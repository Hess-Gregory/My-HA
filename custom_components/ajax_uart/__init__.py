"""Ajax UART integration bootstrap."""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Mapping
from typing import Any, Dict

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_PORT
from homeassistant.core import HomeAssistant
import homeassistant.helpers.config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.exceptions import HomeAssistantError

from .const import (
    ATTR_TYPE_CODE,
    CONF_BAUDRATE,
    CONF_NAME,
    DEFAULT_BAUDRATE,
    DOMAIN,
    MANUFACTURER,
    SERVICE_REMOVE_DEVICE,
    SERVICE_SET_PARAMETERS,
    PAIR_TIMEOUT_SECONDS,
    PLACEHOLDER_DEVICE_ID,
    PLACEHOLDER_WARNING,
    SIGNAL_EVENT,
    ATTR_DEVICE_ID,
    ATTR_PARAMETERS,
)
from .device_library import DEVICE_LIBRARY
from .uart_transport import start_uart

_LOGGER = logging.getLogger(__name__)

# Provide backwards compatible logger name so existing configurations
# targeting custom_components.ajax_bridge continue to work.
legacy_logger_name = "custom_components.ajax_bridge"
legacy_logger = logging.getLogger(legacy_logger_name)
if legacy_logger is not _LOGGER:
    logging.Logger.manager.loggerDict[legacy_logger_name] = _LOGGER

PLATFORMS: list[str] = ["binary_sensor", "sensor", "select", "switch"]
LIST_TIMEOUT_SECONDS = 5
LIST_RETRY_DELAY = 0.5
LIST_MAX_RETRIES = 5
LIST_START_DELAY = 0.5
LIST_WRK_DELAY = 0.7


class PairingError(Exception):
    """Base error for Ajax pairing operations."""

    def __init__(self, reason: str) -> None:
        super().__init__(reason)
        self.reason = reason


class PairingTimeoutError(PairingError):
    """Raised when pairing times out."""


class PairingCancelledError(PairingError):
    """Raised when pairing is cancelled."""


class AjaxPairingCoordinator:
    """Encapsulate uartBridge pairing flow control."""

    def __init__(self, hass: HomeAssistant, entry_data: Dict[str, Any]) -> None:
        self._hass = hass
        self._entry_data = entry_data
        self._active = False
        self._flow_id: str | None = None
        self._stage: str | None = None
        self._timeout_handle: asyncio.TimerHandle | None = None
        self._search_future: asyncio.Future | None = None
        self._finalize_future: asyncio.Future | None = None
        self._candidate: Dict[str, Any] | None = None
        self._in_engineering = False
        self._exit_pending = False
        self._exit_stage: str | None = None
        self._exit_timeout_handle: asyncio.TimerHandle | None = None
        self._exit_command_handle: asyncio.TimerHandle | None = None
        self._stop_retries = 0
        self._requested_stop = False

    @property
    def is_active(self) -> bool:
        return self._active

    @property
    def is_exiting(self) -> bool:
        return self._exit_pending

    @property
    def active(self) -> bool:
        return self._active

    def start_search(self, flow_id: str) -> asyncio.Future:
        """Begin searching for a new device."""

        if self._active:
            raise PairingError("busy")

        if self._exit_pending:
            raise PairingError("busy")

        if self._entry_data.get("list_active"):
            raise PairingError("busy")

        protocol = self._entry_data.get("protocol")
        if not protocol:
            raise PairingError("not_ready")

        if self._exit_timeout_handle:
            self._exit_timeout_handle.cancel()
            self._exit_timeout_handle = None
        self._cancel_exit_command()
        self._exit_pending = False
        self._exit_stage = None

        self._active = True
        self._flow_id = flow_id
        self._stage = "await_stop_result"
        self._candidate = None
        self._finalize_future = None
        self._search_future = self._hass.loop.create_future()
        self._in_engineering = False
        self._stop_retries = 0
        self._reset_timeout()
        protocol.send_cmd("stop")
        self._requested_stop = True
        return self._search_future

    def cancel(self, *, reason: str = "cancelled", immediate: bool = False) -> None:
        """Abort the pairing flow."""

        if not self._active and not immediate:
            return

        exc: PairingError
        if reason == "timeout":
            exc = PairingTimeoutError(reason)
        elif reason == "user_stop":
            exc = PairingCancelledError(reason)
        else:
            exc = PairingCancelledError(reason)

        if self._finalize_future and not self._finalize_future.done():
            self._finalize_future.set_exception(exc)
        if self._search_future and not self._search_future.done():
            self._search_future.set_exception(exc)
        self._cleanup(send_wrk=True, force_exit=immediate)

    def confirm_candidate(self, flow_id: str) -> asyncio.Future:
        """Accept the pending candidate device."""

        if not self._active or flow_id != self._flow_id:
            raise PairingError("no_session")

        if not self._candidate:
            raise PairingError("no_candidate")

        if self._stage != "await_confirmation":
            raise PairingError("invalid_stage")

        protocol = self._entry_data.get("protocol")
        if not protocol:
            raise PairingError("not_ready")

        self._stage = "waiting_finalize"
        self._finalize_future = self._hass.loop.create_future()
        self._reset_timeout()
        protocol.send_cmd("y")
        return self._finalize_future

    def handle_event(self, event: Mapping[str, Any]) -> bool:
        """Process an incoming UART event.

        Returns True when the event was consumed by the pairing workflow.
        """

        tag = event.get("tag")

        if self._exit_pending:
            if tag == "RESULT":
                return self._handle_exit_result(
                    (event.get("status") or "").upper(),
                    (event.get("code") or "").strip(),
                    self._entry_data.get("protocol"),
                )
            if tag == "EVENT":
                self._handle_exit_event(event)
                return True

        if not self._active:
            return False

        if tag == "RESULT":
            return self._handle_result(event)

        if tag == "EVENT":
            return self._handle_event_dispatch(event)

        return False

    def force_cleanup(self) -> None:
        """Reset state without sending commands."""

        if self._timeout_handle:
            self._timeout_handle.cancel()
            self._timeout_handle = None
        if self._exit_timeout_handle:
            self._exit_timeout_handle.cancel()
            self._exit_timeout_handle = None
        if self._exit_command_handle:
            self._exit_command_handle.cancel()
            self._exit_command_handle = None

        if self._search_future and not self._search_future.done():
            self._search_future.set_exception(PairingCancelledError("cancelled"))

        if self._finalize_future and not self._finalize_future.done():
            self._finalize_future.set_exception(PairingCancelledError("cancelled"))

        self._active = False
        self._stage = None
        self._flow_id = None
        self._candidate = None
        self._search_future = None
        self._finalize_future = None
        self._in_engineering = False
        self._requested_stop = False

    def current_candidate(self) -> Dict[str, Any] | None:
        """Return the currently pending candidate, if any."""

        if not self._candidate:
            return None
        return dict(self._candidate)

    def _handle_result(self, event: Mapping[str, Any]) -> bool:
        status = (event.get("status") or "").upper()
        code = (event.get("code") or "").strip()
        protocol = self._entry_data.get("protocol")

        if self._exit_pending:
            return self._handle_exit_result(status, code, protocol)

        if self._stage == "await_stop_result":
            if status == "OK" and code in {"", "0", "2"}:
                self._stage = "await_add_result"
                self._in_engineering = True
                self._reset_timeout()
                if protocol:
                    protocol.send_cmd("add")
                return True

            if status == "NAK" and code == "2":
                if self._stop_retries >= 3:
                    self._fail("busy")
                    return True
                self._stop_retries += 1
                self._stage = "await_stop_clear"
                self._reset_timeout()
                if protocol:
                    protocol.send_cmd("stt")
                return True

            if status == "NAK" and code == "0":
                if self._stop_retries >= 3:
                    self._fail("stop_failed")
                    return True
                self._stop_retries += 1
                self._stage = "await_stop_result"
                self._reset_timeout()
                if protocol:
                    protocol.send_cmd("stop")
                return True

            self._fail("stop_failed")
            return True

        if self._stage == "await_stop_clear":
            if status in {"OK", "NAK"} and code in {"", "0", "2"}:
                self._stage = "await_stop_result"
                self._reset_timeout()
                if protocol:
                    protocol.send_cmd("stop")
                return True

            self._fail("stop_failed")
            return True

        if self._stage == "await_add_result":
            if status == "OK":
                self._stage = "await_device"
                self._reset_timeout()
            else:
                self._fail("add_failed")
            return True

        if self._stage == "waiting_finalize":
            if status == "OK":
                self._finalize_success()
            else:
                self._fail("confirm_failed")
            return True

        return False

    def _handle_event_dispatch(self, event: Mapping[str, Any]) -> bool:
        tokens = list(event.get("event") or [])
        if "EVENT" not in tokens:
            return self._handle_event_line(event)

        consumed = False
        current: list[str] = []

        for token in tokens:
            if token.upper() == "EVENT":
                if current:
                    consumed |= self._handle_event_line(
                        {
                            "tag": "EVENT",
                            "event": current[:],
                            "raw": event.get("raw"),
                        }
                    )
                    current.clear()
                continue
            current.append(token)

        if current:
            consumed |= self._handle_event_line(
                {"tag": "EVENT", "event": current, "raw": event.get("raw")}
            )

        return consumed

    def _handle_event_line(self, event: Mapping[str, Any]) -> bool:
        tokens = event.get("event") or []
        if not tokens:
            return False

        device_id, attributes = _parse_event_tokens(tokens)
        if not device_id:
            return False

        if self._stage == "await_device":
            if attributes.get("NEW") == "1" and attributes.get("WFA"):
                candidate = _build_candidate_details(device_id, attributes)
                self._candidate = candidate
                self._stage = "await_confirmation"
                self._reset_timeout()
                _LOGGER.info(
                    "New Ajax device %s (%s) awaiting confirmation",
                    candidate["device_id"],
                    candidate.get("type_name") or candidate.get("type_code") or "unknown",
                )
                if self._search_future and not self._search_future.done():
                    self._search_future.set_result(candidate)
                return True
            return False

        if (
            self._stage == "waiting_finalize"
            and self._candidate
            and device_id == self._candidate["device_id"]
        ):
            if attributes.get("STR") and attributes.get("SLT"):
                _LOGGER.debug(
                    "Ajax device %s reported slot assignment; refreshing device list",
                    device_id,
                )
                self._finalize_success(refresh=True)
                return True
            if attributes.get("NEW") == "1" and not attributes.get("WFA"):
                _LOGGER.info(
                    "Ajax device %s pairing complete",
                    self._candidate["device_id"],
                )
                self._finalize_success(refresh=False)
                return True

        return False

    def _finalize_success(self, *, refresh: bool) -> None:
        candidate = self._candidate

        if self._finalize_future and not self._finalize_future.done():
            self._finalize_future.set_result(candidate)
        elif self._search_future and not self._search_future.done():
            self._search_future.set_result(candidate)

        self._active = False
        self._stage = None
        self._flow_id = None
        self._search_future = None
        self._finalize_future = None

        if refresh:
            self._candidate = candidate
            self._hass.async_create_task(self._refresh_then_exit(candidate))
        else:
            self._candidate = None
            self._cleanup(send_wrk=True)

    async def _refresh_then_exit(self, candidate: Dict[str, Any] | None) -> None:
        await asyncio.sleep(2.0)

        _LOGGER.debug(
            "Pairing refresh: requesting device list for %s",
            candidate.get("device_id") if candidate else "unknown",
        )

        try:
            await _async_refresh_device_list(self._hass, self._entry_data)
        except Exception:
            _LOGGER.exception("Device list refresh after pairing failed")
            self._candidate = None
            self._cleanup(send_wrk=True)
            return

        _LOGGER.debug(
            "Pairing refresh: device list updated; bridge should already be in work mode"
        )
        self._candidate = None
        self._exit_pending = False
        self._exit_stage = None
        self._in_engineering = False
        self._requested_stop = False
    def _fail(self, reason: str) -> None:
        exc = PairingError(reason)
        if self._finalize_future and not self._finalize_future.done():
            self._finalize_future.set_exception(exc)
        if self._search_future and not self._search_future.done():
            self._search_future.set_exception(exc)
        self._cleanup(send_wrk=True)

    def _on_timeout(self) -> None:
        if not self._active:
            return
        exc = PairingTimeoutError("timeout")
        if self._finalize_future and not self._finalize_future.done():
            self._finalize_future.set_exception(exc)
        elif self._search_future and not self._search_future.done():
            self._search_future.set_exception(exc)
        self._cleanup(send_wrk=True)

    def _reset_timeout(self) -> None:
        if self._timeout_handle:
            self._timeout_handle.cancel()
        self._timeout_handle = self._hass.loop.call_later(
            PAIR_TIMEOUT_SECONDS, self._on_timeout
        )

    def _cleanup(self, *, send_wrk: bool, force_exit: bool = False) -> None:
        if self._timeout_handle:
            self._timeout_handle.cancel()
            self._timeout_handle = None

        protocol = self._entry_data.get("protocol")
        should_exit = send_wrk and protocol and (
            force_exit
            or self._in_engineering
            or self._requested_stop
            or self._stage in {"await_stop_result", "await_stop_clear", "await_add_result", "await_device"}
        )
        if should_exit and protocol:
            _LOGGER.debug("Pairing exit: initiating stop sequence")
            self._exit_pending = True
            if self._exit_timeout_handle:
                self._exit_timeout_handle.cancel()
            self._exit_timeout_handle = self._hass.loop.call_later(
                4.0, self._send_wrk_fallback
            )
            self._send_exit_command("stt", stage="await_stt_result", delay=0.0)
        else:
            if self._exit_pending:
                _LOGGER.debug("Pairing exit cancelled before sending stt")
            self._exit_pending = False
            self._exit_stage = None
            self._in_engineering = False
            if self._exit_timeout_handle:
                self._exit_timeout_handle.cancel()
                self._exit_timeout_handle = None
            self._cancel_exit_command()

        self._active = False
        self._stage = None
        self._flow_id = None
        self._candidate = None
        self._search_future = None
        self._finalize_future = None

        if not self._exit_pending:
            self._in_engineering = False
            self._requested_stop = False

    def _handle_exit_result(
        self, status: str, code: str, protocol: Any
    ) -> bool:
        """Handle RESULT frames during exit from engineer mode."""

        ok_codes = {"", "0", "2"}

        if self._exit_stage == "await_stt_result":
            if status == "OK" and code in ok_codes:
                _LOGGER.debug(
                    "Pairing exit: stt acknowledged (status=%s code=%s); scheduling wrk", status, code
                )
                self._restart_wrk_fallback_timer()
                self._send_exit_command("wrk", stage="await_wrk_result", delay=2.0)
                return True

            if status == "NAK" and code == "2":
                _LOGGER.debug(
                    "Pairing exit: stt reported busy (status=%s code=%s); retrying", status, code
                )
                self._send_exit_command("stt", stage="await_stt_result", delay=2.0)
                return True

            _LOGGER.warning(
                "Pairing exit: unexpected stt result status=%s code=%s; retrying",
                status,
                code,
            )
            self._send_exit_command("stt", stage="await_stt_result", delay=2.0)
            return True

        if self._exit_stage == "await_wrk_result":
            if status == "OK" and code in ok_codes:
                self._complete_exit_success()
                return True

            _LOGGER.debug(
                "Pairing exit: wrk returned status=%s code=%s; retrying",
                status,
                code,
            )
            self._restart_wrk_fallback_timer()
            self._send_exit_command("wrk", stage="await_wrk_result", delay=2.0)
            return True

        return False

    def _send_wrk_fallback(self) -> None:
        if not self._exit_pending:
            return
        _LOGGER.debug("Pairing exit fallback: forcing wrk")
        self._restart_wrk_fallback_timer()
        self._send_exit_command("wrk", stage="await_wrk_result", delay=0.0)

    def _handle_exit_event(self, event: Mapping[str, Any]) -> None:
        if self._exit_stage != "await_stt_result":
            return
        payload = event.get("event")
        if not payload:
            return
        first = payload[0].strip().upper()
        if first == "SYSTEM":
            _LOGGER.debug("Pairing exit: SYSTEM event received; scheduling stt retry")
            self._send_exit_command("stt", stage="await_stt_result", delay=2.0)

    def _send_exit_command(self, command: str, *, stage: str, delay: float) -> None:
        """Send an exit command with the requested delay."""

        self._exit_stage = stage
        self._cancel_exit_command()

        def _send() -> None:
            if not self._exit_pending:
                return
            protocol = self._entry_data.get("protocol")
            if not protocol:
                return
            _LOGGER.debug("Pairing exit: sending %s (stage=%s)", command, stage)
            protocol.send_cmd(command)

        self._exit_command_handle = self._hass.loop.call_later(delay, _send)

    def _cancel_exit_command(self) -> None:
        handle = self._exit_command_handle
        if handle:
            handle.cancel()
        self._exit_command_handle = None

    def _restart_wrk_fallback_timer(self) -> None:
        if self._exit_timeout_handle:
            self._exit_timeout_handle.cancel()
        self._exit_timeout_handle = self._hass.loop.call_later(
            4.0, self._send_wrk_fallback
        )

    def _complete_exit_success(self) -> None:
        _LOGGER.debug("Pairing exit: bridge returned to work mode successfully")
        self._exit_pending = False
        self._exit_stage = None
        self._in_engineering = False
        self._candidate = None
        if self._exit_timeout_handle:
            self._exit_timeout_handle.cancel()
            self._exit_timeout_handle = None
        self._cancel_exit_command()
        self._requested_stop = False


class AjaxDeletionCoordinator:
    """Manage UART deletion operations."""

    def __init__(self, hass: HomeAssistant, entry_data: Dict[str, Any]) -> None:
        self._hass = hass
        self._entry_data = entry_data
        self._lock = asyncio.Lock()
        self._future: asyncio.Future | None = None
        self._stage: str | None = None
        self._device_id: str | None = None

    @property
    def busy(self) -> bool:
        return self._future is not None

    async def async_delete(self, device_id: str) -> None:
        device_id = device_id.upper()

        if not device_id or device_id == self._entry_data.get("hub_device_code"):
            raise HomeAssistantError("Invalid device id")

        async with self._lock:
            if self._future is not None:
                raise HomeAssistantError("Another delete operation is running")

            protocol = self._entry_data.get("protocol")
            if not protocol:
                raise HomeAssistantError("Bridge connection not ready")

            devices = self._entry_data.get("devices", {})
            if device_id not in devices:
                raise HomeAssistantError(f"Unknown device id {device_id}")

            if self._entry_data.get("list_active"):
                raise HomeAssistantError("Device list refresh in progress")

            pairing: AjaxPairingCoordinator | None = self._entry_data.get(
                "pairing_manager"
            )
            if pairing and (pairing.is_active or pairing.is_exiting):
                raise HomeAssistantError("Pairing operation in progress")

            self._stage = "await_stop"
            self._device_id = device_id
            self._future = self._hass.loop.create_future()
            protocol.send_cmd("stop")

            try:
                await asyncio.wait_for(self._future, timeout=15)
            except asyncio.TimeoutError as exc:
                self._fail("Deletion timed out")
                raise HomeAssistantError("Deletion timed out") from exc
            finally:
                self._stage = None
                self._device_id = None
                self._future = None

        # Remove the device from Home Assistant's registry immediately
        _LOGGER.debug("Device %s deleted from bridge, removing from registry", device_id)
        devices = self._entry_data.get("devices", {})
        device_meta = devices.get(device_id)
        if device_meta:
            device_entry_id = device_meta.get("device_registry_id")
            if device_entry_id:
                device_registry = dr.async_get(self._hass)
                device_registry.async_remove_device(device_entry_id)
                _LOGGER.info("Removed device %s from Home Assistant registry", device_id)
            # Remove from internal device list
            devices.pop(device_id, None)
            allowed_ids = self._entry_data.get("allowed_ids", set())
            if isinstance(allowed_ids, set):
                allowed_ids.discard(device_id)
        
        # Then refresh the device list to sync with bridge
        _LOGGER.debug("Starting device list refresh after deletion of %s", device_id)
        await asyncio.sleep(0.5)
        await _async_refresh_device_list(self._hass, self._entry_data)

    def handle_event(self, event: Mapping[str, Any]) -> bool:
        if self._future is None or event.get("tag") != "RESULT":
            return False

        status = (event.get("status") or "").upper()
        code = (event.get("code") or "").strip()
        protocol = self._entry_data.get("protocol")

        if self._stage == "await_stop":
            if status == "OK" and code in {"", "0", "2"}:
                if protocol:
                    protocol.send_cmd(f"del {self._device_id}")
                self._stage = "await_delete"
                return True
            if status == "NAK" and code == "2":
                if protocol:
                    protocol.send_cmd("stop")
                return True
            self._fail(f"stop_failed status={status} code={code}")
            return True

        if self._stage == "await_delete":
            if status == "OK" and code in {"", "0", "2"}:
                if protocol:
                    protocol.send_cmd("wrk")
                self._stage = "await_wrk"
                return True
            self._fail(f"delete_failed status={status} code={code}")
            return True

        if self._stage == "await_wrk":
            if status == "OK" and code in {"", "0", "2"}:
                if self._future and not self._future.done():
                    self._future.set_result(True)
                return True
            if status == "NAK" and code == "2":
                if protocol:
                    protocol.send_cmd("wrk")
                return True
            self._fail(f"wrk_failed status={status} code={code}")
            return True

        return False

    def cancel(self) -> None:
        if self._future and not self._future.done():
            self._future.cancel()
        self._future = None
        self._stage = None
        self._device_id = None

    def _fail(self, reason: str) -> None:
        if self._future and not self._future.done():
            self._future.set_exception(HomeAssistantError(reason))
        protocol = self._entry_data.get("protocol")
        if protocol:
            protocol.send_cmd("wrk")
        self.cancel()


class AjaxParameterCoordinator:
    """Coordinate parameter updates via UART commands."""

    def __init__(self, hass: HomeAssistant, entry_data: Dict[str, Any]) -> None:
        self._hass = hass
        self._entry_data = entry_data
        self._lock = asyncio.Lock()
        self._future: asyncio.Future | None = None
        self._stage: str | None = None
        self._device_id: str | None = None
        self._command: str | None = None

    @property
    def busy(self) -> bool:
        return self._future is not None

    async def async_set(self, device_id: str, command: str) -> None:
        device_id = device_id.upper()

        async with self._lock:
            if self._future is not None:
                raise HomeAssistantError("Another parameter update is running")

            protocol = self._entry_data.get("protocol")
            if not protocol:
                raise HomeAssistantError("Bridge connection not ready")

            if self._entry_data.get("list_active"):
                raise HomeAssistantError("Device list refresh in progress")

            delete_manager: AjaxDeletionCoordinator | None = self._entry_data.get(
                "delete_manager"
            )
            if delete_manager and delete_manager.busy:
                raise HomeAssistantError("Device deletion in progress")

            pairing: AjaxPairingCoordinator | None = self._entry_data.get(
                "pairing_manager"
            )
            if pairing and (pairing.is_active or pairing.is_exiting):
                raise HomeAssistantError("Pairing operation in progress")

            self._stage = "await_stop"
            self._device_id = device_id
            self._command = command
            self._future = self._hass.loop.create_future()
            protocol.send_cmd("stop")

            try:
                await asyncio.wait_for(self._future, timeout=15)
            except asyncio.TimeoutError as exc:
                self._fail("Parameter update timed out")
                raise HomeAssistantError("Parameter update timed out") from exc
            finally:
                self._stage = None
                self._device_id = None
                self._command = None
                self._future = None

    def handle_event(self, event: Mapping[str, Any]) -> bool:
        if self._future is None or event.get("tag") != "RESULT":
            return False

        status = (event.get("status") or "").upper()
        code = (event.get("code") or "").strip()
        protocol = self._entry_data.get("protocol")

        if self._stage == "await_stop":
            if status == "OK" and code in {"", "0", "2"}:
                if protocol and self._command:
                    protocol.send_cmd(self._command)
                self._stage = "await_command"
                return True
            if status == "NAK" and code == "2":
                if protocol:
                    protocol.send_cmd("stop")
                return True
            self._fail(f"stop_failed status={status} code={code}")
            return True

        if self._stage == "await_command":
            if status == "OK" and code in {"", "0", "2"}:
                if protocol:
                    protocol.send_cmd("wrk")
                self._stage = "await_wrk"
                return True
            self._fail(f"par_failed status={status} code={code}")
            return True

        if self._stage == "await_wrk":
            if status == "OK" and code in {"", "0", "2"}:
                if self._future and not self._future.done():
                    self._future.set_result(True)
                return True
            if status == "NAK" and code == "2":
                if protocol:
                    protocol.send_cmd("wrk")
                return True
            self._fail(f"wrk_failed status={status} code={code}")
            return True

        return False

    def cancel(self) -> None:
        if self._future and not self._future.done():
            self._future.cancel()
        self._future = None
        self._stage = None
        self._device_id = None
        self._command = None

    def _fail(self, reason: str) -> None:
        if self._future and not self._future.done():
            self._future.set_exception(HomeAssistantError(reason))
        protocol = self._entry_data.get("protocol")
        if protocol:
            protocol.send_cmd("wrk")
        self.cancel()


def _parse_event_tokens(tokens: list[str]) -> tuple[str | None, Dict[str, Any]]:
    device_id: str | None = None
    attributes: Dict[str, Any] = {}

    for idx, token in enumerate(tokens):
        token = token.strip()
        if idx == 0:
            device_id = token.upper()
            continue
        if not token:
            continue
        if "=" not in token:
            continue
        key, value = token.split("=", 1)
        attributes[key.upper()] = value

    return device_id, attributes


def _build_candidate_details(device_id: str, attrs: Dict[str, Any]) -> Dict[str, Any]:
    details: Dict[str, Any] = {
        "device_id": device_id,
        "type_code": attrs.get("TYP"),
        "firmware": attrs.get("VER"),
        "raw": attrs,
    }
    type_code = details.get("type_code")
    if type_code:
        details["type_name"] = DEVICE_LIBRARY.device_model(type_code) or type_code
    else:
        details["type_name"] = None
    return details


def _ensure_device_identity(entry: Dict[str, Any], device_id: str) -> None:
    """Populate derived metadata for a device entry."""

    type_code = entry.get(ATTR_TYPE_CODE)
    type_name = entry.get("type_name") or DEVICE_LIBRARY.device_model(type_code)
    entry["type_name"] = type_name

    params_template = DEVICE_LIBRARY.params_template_name(type_code)
    if params_template:
        entry["params_template"] = params_template
        entry.setdefault("params_state", {})
    else:
        entry.pop("params_template", None)
        entry.pop("params_state", None)

    vendor_slug = MANUFACTURER.split(" ")[0]
    type_token = (type_name or "Device").replace(" ", "")
    unique_name = f"{vendor_slug}_{type_token}_{device_id}".replace("__", "_")
    entry["unique_name"] = unique_name
    entry.setdefault(CONF_NAME, unique_name.replace("_", " "))


CONFIG_SCHEMA = vol.Schema(
    {
        DOMAIN: vol.Schema(
            {
                vol.Required(CONF_PORT): cv.string,
                vol.Optional(CONF_BAUDRATE, default=DEFAULT_BAUDRATE): cv.positive_int,
            }
        )
    },
    extra=vol.ALLOW_EXTRA,
)


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Handle YAML import."""

    if DOMAIN in config:
        hass.async_create_task(
            hass.config_entries.flow.async_init(
                DOMAIN,
                context={"source": config_entries.SOURCE_IMPORT},
                data=config[DOMAIN],
            )
        )

    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Ajax UART from a config entry."""

    hass.data.setdefault(DOMAIN, {})

    config = {**entry.data, **entry.options}
    port = config[CONF_PORT]
    baudrate = config.get(CONF_BAUDRATE, DEFAULT_BAUDRATE)

    device_registry = dr.async_get(hass)
    hub_unique = f"hub_{entry.unique_id or entry.entry_id}"
    hub_device = device_registry.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, hub_unique)},
        manufacturer=MANUFACTURER,
        name=entry.title or f"Ajax UART ({port})",
        model="uartBridge",
    )

    entry_data: Dict[str, Any] = {
        "entry": entry,
        "devices": {},
        "allowed_ids": set(),
        "placeholder_warned": False,
        "list_active": False,
        "hub_identifier": (DOMAIN, hub_unique),
        "hub_unique_identifier": (DOMAIN, hub_unique),
        "hub_device_id": hub_device.id,
        "port": port,
        "baudrate": baudrate,
        "debug_logging_enabled": False,
        "debug_logging_levels": {},
    }
    entry_data["parameter_coordinator"] = AjaxParameterCoordinator(hass, entry_data)
    hass.data[DOMAIN][entry.entry_id] = entry_data

    entry_data["pairing_manager"] = AjaxPairingCoordinator(hass, entry_data)
    entry_data["delete_manager"] = AjaxDeletionCoordinator(hass, entry_data)

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    await _async_start_bridge(hass, entry, entry_data)

    if not hass.data[DOMAIN].get("_remove_device_service_registered"):

        async def _async_remove_device_service(call: Any) -> None:
            device_reg_id: str = call.data[ATTR_DEVICE_ID]
            device_registry = dr.async_get(hass)
            device_entry = device_registry.async_get(device_reg_id)
            if not device_entry:
                raise HomeAssistantError(f"Unknown device id {device_reg_id}")

            domain_entries = hass.data.get(DOMAIN, {})

            target_entry_data: Dict[str, Any] | None = None
            for entry_id in device_entry.config_entries:
                entry_data = domain_entries.get(entry_id)
                if entry_data:
                    target_entry_data = entry_data
                    break

            if target_entry_data is None:
                raise HomeAssistantError(
                    f"Device {device_reg_id} is not managed by {DOMAIN}"
                )

            delete_manager: AjaxDeletionCoordinator | None = target_entry_data.get(
                "delete_manager"
            )
            if delete_manager is None:
                raise HomeAssistantError("Bridge connection not ready")

            ajax_device_id = None
            for ajax_id, meta in target_entry_data.get("devices", {}).items():
                if meta.get("device_registry_id") == device_reg_id:
                    ajax_device_id = ajax_id
                    break

            if ajax_device_id is None:
                raise HomeAssistantError(
                    f"Device {device_reg_id} is not managed by {DOMAIN}"
                )

            await delete_manager.async_delete(ajax_device_id)

        hass.services.async_register(
            DOMAIN,
            SERVICE_REMOVE_DEVICE,
            _async_remove_device_service,
            vol.Schema(
                {
                    vol.Required(ATTR_DEVICE_ID): cv.string,
                }
            ),
        )
        hass.data[DOMAIN]["_remove_device_service_registered"] = True

    if not hass.data[DOMAIN].get("_set_parameters_service_registered"):

        async def _async_set_parameters_service(call: Any) -> None:
            raw_device_value = str(call.data[ATTR_DEVICE_ID]).strip()
            parameters = call.data.get(ATTR_PARAMETERS) or {}

            if not raw_device_value:
                raise HomeAssistantError("Invalid device id")

            if not isinstance(parameters, Mapping) or not parameters:
                raise HomeAssistantError("No parameters provided")

            domain_entries = hass.data.get(DOMAIN, {})
            target_entry_data: Dict[str, Any] | None = None
            ajax_device_id: str | None = None

            device_registry = dr.async_get(hass)
            device_entry = device_registry.async_get(raw_device_value)

            if device_entry is not None:
                for entry_id in device_entry.config_entries:
                    entry_data_candidate = domain_entries.get(entry_id)
                    if entry_data_candidate:
                        target_entry_data = entry_data_candidate
                        break
                if target_entry_data is None:
                    raise HomeAssistantError(
                        f"Device {raw_device_value} is not managed by {DOMAIN}"
                    )
                for ajax_id, meta in target_entry_data.get("devices", {}).items():
                    if meta.get("device_registry_id") == device_entry.id:
                        ajax_device_id = ajax_id
                        break
                if ajax_device_id is None:
                    raise HomeAssistantError(
                        f"Ajax identifier for device {raw_device_value} not found"
                    )
            else:
                candidate_ajax_id = raw_device_value.upper()
                for entry_data_candidate in domain_entries.values():
                    if not isinstance(entry_data_candidate, dict):
                        continue
                    devices = entry_data_candidate.get("devices", {})
                    if candidate_ajax_id in devices:
                        target_entry_data = entry_data_candidate
                        ajax_device_id = candidate_ajax_id
                        break
                if ajax_device_id is None or target_entry_data is None:
                    raise HomeAssistantError(
                        f"Device {raw_device_value} is not managed by {DOMAIN}"
                    )

            manager = target_entry_data.get("parameter_manager")
            if manager is None:
                raise HomeAssistantError("Parameter controls not ready")

            await manager.async_set_parameters(ajax_device_id, parameters)

        hass.services.async_register(
            DOMAIN,
            SERVICE_SET_PARAMETERS,
            _async_set_parameters_service,
            vol.Schema(
                {
                    vol.Required(ATTR_DEVICE_ID): cv.string,
                    vol.Required(ATTR_PARAMETERS): dict,
                }
            ),
        )
        hass.data[DOMAIN]["_set_parameters_service_registered"] = True

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload an Ajax UART config entry."""

    entry_data: Dict[str, Any] | None = hass.data[DOMAIN].get(entry.entry_id)

    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if entry_data:
        delete_manager = entry_data.get("delete_manager")
        if delete_manager:
            delete_manager.cancel()
        pairing = entry_data.get("pairing_manager")
        if pairing:
            pairing.cancel(reason="cancelled")
            pairing.force_cleanup()
        entry_data["list_active"] = False
        _schedule_wrk_cancel(entry_data)
        timeout = entry_data.pop("list_timeout_task", None)
        if timeout:
            timeout.cancel()
        transport = entry_data.get("transport")
        if transport:
            transport.close()

    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id, None)

    return unload_ok


async def _async_start_bridge(
    hass: HomeAssistant, entry: ConfigEntry, entry_data: Dict[str, Any]
) -> None:
    """Open the UART transport and start the discovery handshake."""

    config = {**entry.data, **entry.options}
    port = config[CONF_PORT]
    baudrate = config.get(CONF_BAUDRATE, DEFAULT_BAUDRATE)

    _LOGGER.info("Starting Ajax UART on %s at %s baud", port, baudrate)

    loop = asyncio.get_running_loop()

    def _handle_event(event: Mapping[str, Any]) -> None:
        delete_manager: AjaxDeletionCoordinator | None = entry_data.get(
            "delete_manager"
        )
        if delete_manager and delete_manager.handle_event(event):
            return

        parameter_coordinator: AjaxParameterCoordinator | None = entry_data.get(
            "parameter_coordinator"
        )
        if parameter_coordinator and parameter_coordinator.handle_event(event):
            return

        pairing_manager: AjaxPairingCoordinator | None = entry_data.get(
            "pairing_manager"
        )
        if pairing_manager and pairing_manager.handle_event(event):
            return

        tag = event.get("tag")

        if tag == "LIST":
            _handle_list_entry(hass, entry_data, event)
            return

        if tag == "RESULT" and entry_data.get("list_active"):
            _process_list_result(hass, entry_data, event)
            return

        if tag == "RSTATE":
            _handle_hub_rstate(hass, entry_data, event)
            return

        device_id = str(event.get("device_id", "")).upper()

        if (
            device_id == PLACEHOLDER_DEVICE_ID
            and not entry_data.get("placeholder_warned")
        ):
            entry_data["placeholder_warned"] = True
            _LOGGER.warning(PLACEHOLDER_WARNING)

        allowed_ids = entry_data.get("allowed_ids")
        hub_id = entry_data.get("hub_device_code")
        if (
            allowed_ids
            and device_id
            and device_id not in allowed_ids
            and device_id != hub_id
        ):
            _LOGGER.debug("Ignoring event for unlisted device %s", device_id)
            return

        async_dispatcher_send(hass, SIGNAL_EVENT, event)

    transport, protocol = await start_uart(
        loop, port, baudrate, _LOGGER, on_event=_handle_event
    )

    entry_data.update({"transport": transport, "protocol": protocol})

    hass.async_create_task(_async_refresh_device_list(hass, entry_data))


async def _async_refresh_device_list(
    hass: HomeAssistant, entry_data: Dict[str, Any]
) -> None:
    """Query the uartBridge for the list of paired devices."""

    if entry_data.get("list_active"):
        _LOGGER.debug("Device list refresh already in progress")
        return

    protocol = entry_data.get("protocol")
    if not protocol:
        _LOGGER.debug("UART protocol not ready; delaying device refresh")
        return

    entry_data["devices_snapshot"] = dict(entry_data.get("devices", {}))
    entry_data["list_pending"] = {}
    entry_data["list_active"] = True
    entry_data["list_stage"] = None
    entry_data["list_retries"] = 0

    entry_data["list_timeout_task"] = hass.async_create_task(
        _async_device_list_timeout(hass, entry_data)
    )

    async def _delayed_stop() -> None:
        await asyncio.sleep(LIST_START_DELAY)
        if not entry_data.get("list_active"):
            return
        entry_data["list_stage"] = "stop"
        protocol.send_cmd("stop")

    hass.async_create_task(_delayed_stop())


def _handle_list_entry(
    hass: HomeAssistant, entry_data: Dict[str, Any], event: Mapping[str, Any]
) -> None:
    if not entry_data.get("list_active"):
        return

    pending = entry_data.setdefault("list_pending", {})

    device_id = str(event.get("device_id", "")).upper()
    if not device_id:
        _LOGGER.debug("LIST entry missing device id: %s", event)
        return

    type_code = event.get("type_code")
    entry = pending.setdefault(device_id, {})

    if type_code is not None:
        type_code = str(type_code).strip()
        if type_code:
            entry[ATTR_TYPE_CODE] = type_code
            entry["type_name"] = DEVICE_LIBRARY.device_model(type_code)

    entry.setdefault("sequence", event.get("sequence"))
    entry.setdefault("slot", event.get("slot"))

    _ensure_device_identity(entry, device_id)

    if entry_data.get("list_stage") == "lst":
        _schedule_wrk_send(hass, entry_data)


def _process_list_result(
    hass: HomeAssistant, entry_data: Dict[str, Any], event: Mapping[str, Any]
) -> None:
    status = (event.get("status") or "").upper()
    stage = entry_data.get("list_stage")
    protocol = entry_data.get("protocol")

    if stage not in {"stop", "lst", "wrk"}:
        return

    if status != "OK":
        code = str(event.get("code") or "")

        if (
            stage == "stop"
            and status == "NAK"
            and code in {"0", ""}
            and entry_data.get("list_retries", 0) < LIST_MAX_RETRIES
        ):
            entry_data["list_retries"] = entry_data.get("list_retries", 0) + 1
            _LOGGER.debug(
                "Retrying stop command for device refresh (attempt %s)",
                entry_data["list_retries"],
            )
            if protocol:
                hass.loop.call_later(LIST_RETRY_DELAY, protocol.send_cmd, "stop")
            return

        if (
            stage == "lst"
            and status == "NAK"
            and code in {"0", ""}
            and entry_data.get("list_retries", 0) < LIST_MAX_RETRIES
        ):
            entry_data["list_retries"] = entry_data.get("list_retries", 0) + 1
            _LOGGER.debug(
                "LIST command rejected; retrying stop before retrying list (attempt %s)",
                entry_data["list_retries"],
            )
            if protocol:
                _schedule_wrk_cancel(entry_data)
                entry_data["list_stage"] = "stop"
                hass.loop.call_later(LIST_RETRY_DELAY, protocol.send_cmd, "stop")
            return

        _LOGGER.warning(
            "Command %s during device refresh failed: status=%s code=%s",
            stage,
            status,
            code,
        )
        if protocol:
            protocol.send_cmd("wrk")
        _finalize_device_list(hass, entry_data, success=False)
        return

    if stage == "stop":
        entry_data["list_retries"] = 0
        entry_data["list_stage"] = "lst"
        if protocol:
            protocol.send_cmd("lst")
            _schedule_wrk_send(hass, entry_data)
        return

    if stage == "lst":
        entry_data["list_stage"] = "wrk"
        if protocol:
            protocol.send_cmd("wrk")
        _schedule_wrk_cancel(entry_data)
        return

    if stage == "wrk":
        _finalize_device_list(hass, entry_data, success=True)


def _finalize_device_list(
    hass: HomeAssistant, entry_data: Dict[str, Any], *, success: bool
) -> None:
    timeout_task = entry_data.pop("list_timeout_task", None)
    if timeout_task:
        timeout_task.cancel()
    _schedule_wrk_cancel(entry_data)

    pending = entry_data.pop("list_pending", {})
    snapshot = entry_data.pop("devices_snapshot", entry_data.get("devices", {}))

    new_devices = pending if success and pending else snapshot

    devices = entry_data.setdefault("devices", {})
    devices.clear()

    config_entry: ConfigEntry = entry_data["entry"]
    device_registry = dr.async_get(hass)

    removed_ids: set[str] = set(snapshot.keys()) - set(new_devices.keys())

    _LOGGER.debug(
        "Device list finalization: snapshot=%s, new=%s, removed=%s",
        list(snapshot.keys()),
        list(new_devices.keys()),
        list(removed_ids),
    )

    for device_id, meta in new_devices.items():
        meta = dict(meta)
        _ensure_device_identity(meta, device_id)
        previous_meta = snapshot.get(device_id) or {}
        previous_state = previous_meta.get("params_state")
        if previous_state:
            meta.setdefault("params_state", {}).update(previous_state)
        devices[device_id] = meta

        device_entry = device_registry.async_get_or_create(
            config_entry_id=config_entry.entry_id,
            identifiers={(DOMAIN, meta["unique_name"])},
            manufacturer=MANUFACTURER,
            name=meta.get(CONF_NAME),
            model=meta.get("type_name") or "Unknown",
        )
        meta["device_registry_id"] = device_entry.id

    for removed_id in removed_ids:
        removed_meta = snapshot.get(removed_id) or {}
        device_entry_id = removed_meta.get("device_registry_id")
        _LOGGER.debug(
            "Removing device %s from registry, entry_id=%s",
            removed_id,
            device_entry_id,
        )
        if device_entry_id:
            device_registry.async_remove_device(device_entry_id)
            _LOGGER.info("Removed device %s from Home Assistant registry", removed_id)
        else:
            _LOGGER.warning(
                "Device %s has no device_registry_id, cannot remove from registry",
                removed_id,
            )

    allowed_ids = set(new_devices.keys())
    entry_data["allowed_ids"] = allowed_ids
    entry_data["list_active"] = False
    entry_data["list_stage"] = None
    entry_data["list_retries"] = 0

    _update_hub_device_metadata(hass, entry_data)

    binary_manager = entry_data.get("binary_sensor_manager")
    if binary_manager:
        binary_manager.sync_devices(allowed_ids)
        for device_id, meta in new_devices.items():
            binary_manager.add_device(device_id, meta.get(ATTR_TYPE_CODE))

    sensor_manager = entry_data.get("sensor_manager")
    if sensor_manager:
        sensor_manager.sync_devices(allowed_ids)
        for device_id, meta in new_devices.items():
            sensor_manager.add_device(device_id, meta.get(ATTR_TYPE_CODE))

    arm_manager = entry_data.get("arm_manager")
    if arm_manager:
        arm_manager.sync_devices(allowed_ids)
        arm_manager.ensure_hub_entity()
        for device_id, meta in new_devices.items():
            arm_manager.add_device(device_id, meta.get(ATTR_TYPE_CODE))

    select_manager = entry_data.get("parameter_manager")
    if select_manager:
        select_manager.sync_devices(allowed_ids)
        for device_id, meta in new_devices.items():
            select_manager.add_device(device_id, meta.get(ATTR_TYPE_CODE))

    _LOGGER.info(
        "Detected %s Ajax device(s): %s",
        len(allowed_ids),
        ", ".join(sorted(allowed_ids)) or "<none>",
    )


async def _async_device_list_timeout(
    hass: HomeAssistant, entry_data: Dict[str, Any]
) -> None:
    await asyncio.sleep(LIST_TIMEOUT_SECONDS)
    if not entry_data.get("list_active"):
        return

    _LOGGER.warning("Device list refresh timed out; returning to work mode")
    protocol = entry_data.get("protocol")
    if protocol:
        protocol.send_cmd("wrk")
    pending = entry_data.get("list_pending", {})
    _finalize_device_list(hass, entry_data, success=bool(pending))


def _schedule_wrk_send(hass: HomeAssistant, entry_data: Dict[str, Any]) -> None:
    handle = entry_data.get("list_wrk_handle")
    if handle:
        handle.cancel()

    protocol = entry_data.get("protocol")
    if not protocol:
        return

    def _send_wrk() -> None:
        entry_data["list_wrk_handle"] = None
        if not entry_data.get("list_active"):
            return
        entry_data["list_stage"] = "wrk"
        protocol.send_cmd("wrk")

    entry_data["list_wrk_handle"] = hass.loop.call_later(
        LIST_WRK_DELAY, _send_wrk
    )


def _schedule_wrk_cancel(entry_data: Dict[str, Any]) -> None:
    handle = entry_data.pop("list_wrk_handle", None)
    if handle:
        handle.cancel()


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options updates by reloading the entry."""

    await hass.config_entries.async_reload(entry.entry_id)


def _handle_hub_rstate(
    hass: HomeAssistant, entry_data: Dict[str, Any], event: Mapping[str, Any]
) -> None:
    device_id = str(event.get("device_id", "")).upper()
    if not device_id:
        return

    entry_data["hub_device_code"] = device_id
    entry_data.setdefault("allowed_ids", set()).add(device_id)
    entry_data["hub_identifier"] = (DOMAIN, device_id)
    entry_data["hub_rstate_raw"] = event.get("raw")
    entry_data["hub_rstate"] = _convert_rstate(event)
    entry_data["hub_info"] = _build_hub_info(entry_data)

    _update_hub_device_metadata(hass, entry_data)


def _update_hub_device_metadata(hass: HomeAssistant, entry_data: Dict[str, Any]) -> None:
    hub_device_entry_id = entry_data.get("hub_device_id")
    if not hub_device_entry_id:
        return

    registry = dr.async_get(hass)
    hub_code = entry_data.get("hub_device_code")
    info_text = entry_data.get("hub_info")

    kwargs: Dict[str, Any] = {}

    if hub_code:
        hub_ids = {(DOMAIN, hub_code)}
        unique_identifier = entry_data.get("hub_unique_identifier")
        if unique_identifier:
            hub_ids.add(unique_identifier)
        kwargs["new_identifiers"] = hub_ids
        kwargs["serial_number"] = hub_code
        kwargs.setdefault("name", f"Ajax UART ({hub_code})")

    rstate = entry_data.get("hub_rstate") or {}
    ver = rstate.get("VER")
    if ver is not None:
        try:
            kwargs["sw_version"] = f"{int(ver) / 100:.2f}"
            kwargs.setdefault("hw_version", f"uartBridge info | Firmware {int(ver) / 100:.2f}")
        except (ValueError, TypeError):
            kwargs["sw_version"] = str(ver)

    if info_text:
        kwargs["hw_version"] = info_text

    if not kwargs:
        return

    try:
        registry.async_update_device(hub_device_entry_id, **kwargs)
    except Exception:  # pragma: no cover - defensive logging
        _LOGGER.debug("Unable to update hub device metadata", exc_info=True)


def _convert_rstate(event: Mapping[str, Any]) -> Dict[str, Any]:
    raw = event.get("raw")
    if not raw:
        return dict(event)

    parts = raw.split(";")
    data: Dict[str, Any] = {"raw": raw}
    for kv in parts[2:]:
        if "=" not in kv:
            continue
        key, value = kv.split("=", 1)
        key = key.upper()
        existing = data.get(key)
        if existing is None:
            data[key] = value
        elif isinstance(existing, list):
            existing.append(value)
        else:
            data[key] = [existing, value]
    return data


def _build_hub_info(entry_data: Dict[str, Any]) -> str:
    rstate = entry_data.get("hub_rstate") or {}
    parts: list[str] = []

    hub_code = entry_data.get("hub_device_code")
    if hub_code:
        parts.append(f"ID: {hub_code}")

    firmware = rstate.get("VER")
    if firmware is not None:
        try:
            parts.append(f"Firmware: {int(firmware) / 100:.2f}")
        except (ValueError, TypeError):
            parts.append(f"Firmware: {firmware}")

    ful = rstate.get("FUL")
    if ful is not None:
        parts.append(f"Registered detectors: {_safe_int(ful)}")

    onl = rstate.get("ONL")
    if onl is not None:
        parts.append(f"Online detectors: {_safe_int(onl)}")

    nsl = rstate.get("NSL")
    if nsl is not None:
        values = nsl if isinstance(nsl, list) else [nsl]
        noise = ", ".join(str(_safe_int(val)) for val in values)
        parts.append(f"Noise levels: {noise}")

    lls = rstate.get("LLS")
    if lls is not None:
        parts.append(f"Lowest signal: {_safe_int(lls)}")

    port = entry_data.get("port")
    baudrate = entry_data.get("baudrate")
    if port:
        connection = f"{port}"
        if baudrate:
            connection += f" @ {baudrate}"
        parts.append(f"Connection: {connection}")

    return " | ".join(parts)


def _safe_int(value: Any) -> Any:
    try:
        return int(value)
    except (ValueError, TypeError):
        return value
