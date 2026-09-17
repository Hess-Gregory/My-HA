"""Config flow for Ajax UART integration."""

from __future__ import annotations

import asyncio
from collections import OrderedDict
from typing import Any, Dict

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.const import CONF_PORT
from homeassistant.data_entry_flow import FlowResult
import homeassistant.helpers.config_validation as cv
import logging

from .const import CONF_BAUDRATE, DEFAULT_BAUDRATE, DOMAIN
from .device_library import DEVICE_LIBRARY

STEP_CONFIRM_ADD = "confirm_add"
STEP_CONFIRM_STOP = "confirm_stop"
STEP_ADD_CHOICE = "add_choice"
STEP_ADD_HUB = "add_hub"


def _schema(
    default_port: str | None = None, default_baud: int = DEFAULT_BAUDRATE
) -> vol.Schema:
    return vol.Schema(
        {
            vol.Required(CONF_PORT, default=default_port or ""): cv.string,
            vol.Optional(CONF_BAUDRATE, default=default_baud): vol.Coerce(int),
        }
    )


class AjaxUARTConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Ajax UART."""

    VERSION = 1
    _LOGGER = logging.getLogger(__name__)

    def __init__(self) -> None:
        self._selected_entry_id: str | None = None
        self._pairing_task: asyncio.Task | None = None
        self._confirm_task: asyncio.Task | None = None
        self._pairing_candidate: Dict[str, Any] | None = None
        self._pairing_error: str | None = None
        self._pairing_manager: Any = None

    async def async_step_user(
        self, user_input: Dict[str, Any] | None = None
    ) -> FlowResult:
        self._LOGGER.debug(
            "async_step_user context=%s user_input=%s", self.context, user_input
        )
        entries = self.hass.config_entries.async_entries(DOMAIN)

        if entries:
            # If entry_id is provided in context, start pairing for that hub
            if self.context.get("entry_id"):
                self._selected_entry_id = self.context["entry_id"]
                return await self.async_step_pairing()

            # Multiple or single entry: show choice menu
            return await self.async_step_add_choice()

        # No entries exist - show hub setup form
        if user_input is None:
            return self.async_show_form(step_id="user", data_schema=_schema())

        user_input = dict(user_input)
        user_input[CONF_PORT] = user_input[CONF_PORT].strip()

        await self.async_set_unique_id(user_input[CONF_PORT])
        self._abort_if_unique_id_configured()

        return self.async_create_entry(
            title=f"Ajax UART ({user_input[CONF_PORT]})",
            data={
                CONF_PORT: user_input[CONF_PORT],
                CONF_BAUDRATE: user_input.get(CONF_BAUDRATE, DEFAULT_BAUDRATE),
            },
        )

    async def async_step_import(self, user_input: Dict[str, Any]) -> FlowResult:
        user_input = dict(user_input)
        user_input[CONF_PORT] = user_input[CONF_PORT].strip()
        await self.async_set_unique_id(user_input[CONF_PORT])
        self._abort_if_unique_id_configured()
        return self.async_create_entry(
            title=f"Ajax UART ({user_input[CONF_PORT]})",
            data={
                CONF_PORT: user_input[CONF_PORT],
                CONF_BAUDRATE: user_input.get(CONF_BAUDRATE, DEFAULT_BAUDRATE),
            },
        )

    async def async_step_add_choice(
        self, user_input: Dict[str, Any] | None = None
    ) -> FlowResult:
        """Show menu to choose between adding hub or device."""
        return self.async_show_menu(
            step_id="add_choice",
            menu_options=["add_hub", "add_device"],
        )

    async def async_step_add_hub(
        self, user_input: Dict[str, Any] | None = None
    ) -> FlowResult:
        """Add a new Hub (UART bridge device)."""
        if user_input is None:
            return self.async_show_form(step_id="add_hub", data_schema=_schema())

        user_input = dict(user_input)
        user_input[CONF_PORT] = user_input[CONF_PORT].strip()

        await self.async_set_unique_id(user_input[CONF_PORT])
        self._abort_if_unique_id_configured()

        return self.async_create_entry(
            title=f"Ajax UART ({user_input[CONF_PORT]})",
            data={
                CONF_PORT: user_input[CONF_PORT],
                CONF_BAUDRATE: user_input.get(CONF_BAUDRATE, DEFAULT_BAUDRATE),
            },
        )

    async def async_step_add_device(
        self, user_input: Dict[str, Any] | None = None
    ) -> FlowResult:
        """Add a new device to an existing Hub."""
        entries = self.hass.config_entries.async_entries(DOMAIN)
        
        if not entries:
            return self.async_abort(reason="no_config_entry")

        # If only one hub exists, skip selection and go directly to pairing
        if len(entries) == 1:
            self._selected_entry_id = entries[0].entry_id
            return await self.async_step_pairing()

        # Multiple hubs: show selection menu
        return await self.async_step_hub(user_input)

    async def async_step_hub(
        self, user_input: Dict[str, Any] | None = None
    ) -> FlowResult:
        entries = self.hass.config_entries.async_entries(DOMAIN)
        if not entries:
            return self.async_abort(reason="no_config_entry")

        entry_map = OrderedDict(
            (entry.entry_id, entry.title or entry.data.get(CONF_PORT, entry.entry_id))
            for entry in entries
        )

        if user_input is None:
            return self.async_show_form(
                step_id="hub",
                data_schema=vol.Schema(
                    {
                        vol.Required(
                            "entry_id",
                            default=self._selected_entry_id
                            or next(iter(entry_map.keys())),
                        ): vol.In(entry_map)
                    }
                ),
            )

        entry_id = user_input["entry_id"]
        if entry_id not in entry_map:
            return self.async_abort(reason="invalid_hub")

        self._selected_entry_id = entry_id
        return await self.async_step_pairing()

    async def async_step_pairing(
        self, user_input: Dict[str, Any] | None = None
    ) -> FlowResult:
        manager = self._get_pairing_manager()
        if manager is None:
            return self.async_abort(reason="not_ready")

        if self._pairing_task is None:
            try:
                future = manager.start_search(self.flow_id)
            except Exception as err:  # PairingError
                reason = getattr(err, "reason", "pairing_failed")
                return self.async_abort(reason=reason)

            self._pairing_manager = manager
            self._pairing_task = self.hass.async_create_task(
                self._async_wait_candidate(future)
            )
            # Register a done callback to handle when the user closes the dialog
            self._pairing_task.add_done_callback(
                self._on_pairing_task_done
            )

        if not self._pairing_task.done():
            return self.async_show_progress(
                step_id="pairing",
                progress_action="pairing_search",
                progress_task=self._pairing_task,
            )

        try:
            await self._pairing_task
        except Exception as err:  # PairingError subclasses
            reason = getattr(err, "reason", "pairing_failed")
            self._cleanup_manager()
            self._reset_pairing_state()
            if reason == "timeout":
                return self.async_show_progress_done(next_step_id="pairing_timeout")
            if reason in {"user_stop", "cancelled"}:
                return self.async_show_progress_done(next_step_id="pairing_stopped")
            self._pairing_error = reason
            return self.async_show_progress_done(next_step_id="pairing_error")

        self._pairing_task = None
        return self.async_show_progress_done(next_step_id="confirm")

    async def _async_wait_candidate(self, future: asyncio.Future) -> None:
        candidate = await future
        if candidate:
            type_code = candidate.get("type_code")
            if type_code and not candidate.get("type_name"):
                candidate["type_name"] = (
                    DEVICE_LIBRARY.device_model(type_code) or type_code
                )
        self._pairing_candidate = candidate

    async def async_step_confirm(
        self, user_input: Dict[str, Any] | None = None
    ) -> FlowResult:
        candidate = self._pairing_candidate
        manager = self._pairing_manager
        if not candidate or not manager:
            self._cleanup_manager()
            self._reset_pairing_state()
            return self.async_abort(reason="pairing_missing_candidate")

        placeholders = _candidate_placeholders(candidate)
        return self.async_show_menu(
            step_id="confirm",
            menu_options=[STEP_CONFIRM_ADD, STEP_CONFIRM_STOP],
            description_placeholders=placeholders,
        )

    async def async_step_confirm_add(
        self, user_input: Dict[str, Any] | None = None
    ) -> FlowResult:
        manager = self._pairing_manager
        if manager is None:
            self._reset_pairing_state()
            return self.async_abort(reason="pairing_missing_candidate")

        if self._confirm_task is None:
            try:
                future = manager.confirm_candidate(self.flow_id)
            except Exception as err:  # PairingError
                reason = getattr(err, "reason", "pairing_failed")
                self._cleanup_manager()
                self._reset_pairing_state()
                return self.async_abort(reason=reason)

            self._confirm_task = self.hass.async_create_task(
                self._async_wait_confirmation(future)
            )
            # Register a done callback to handle when the user closes the dialog
            self._confirm_task.add_done_callback(
                self._on_confirm_task_done
            )

        if not self._confirm_task.done():
            return self.async_show_progress(
                step_id="confirm_add",
                progress_action="pairing_confirm",
                progress_task=self._confirm_task,
            )

        try:
            await self._confirm_task
        except Exception as err:  # PairingError
            reason = getattr(err, "reason", "pairing_failed")
            self._cleanup_manager()
            self._reset_pairing_state()
            if reason == "timeout":
                return self.async_show_progress_done(next_step_id="pairing_timeout")
            self._pairing_error = reason
            return self.async_show_progress_done(next_step_id="pairing_error")

        self._confirm_task = None
        self._cleanup_manager()
        self._reset_pairing_state()
        return self.async_show_progress_done(next_step_id="pairing_success")

    async def _async_wait_confirmation(self, future: asyncio.Future) -> None:
        await future

    async def async_step_confirm_stop(
        self, user_input: Dict[str, Any] | None = None
    ) -> FlowResult:
        self._ensure_pairing_halted("user_stop")
        self._reset_pairing_state()
        return self.async_abort(reason="pairing_stopped")

    async def async_step_pairing_success(
        self, user_input: Dict[str, Any] | None = None
    ) -> FlowResult:
        self._ensure_pairing_halted("success")
        self._reset_pairing_state()
        return self.async_abort(reason="pairing_success")

    async def async_step_pairing_timeout(
        self, user_input: Dict[str, Any] | None = None
    ) -> FlowResult:
        self._ensure_pairing_halted("timeout")
        self._reset_pairing_state()
        return self.async_abort(reason="pairing_timeout")

    async def async_step_pairing_error(
        self, user_input: Dict[str, Any] | None = None
    ) -> FlowResult:
        self._ensure_pairing_halted("error")
        self._reset_pairing_state()
        reason = self._pairing_error or "pairing_failed"
        self._pairing_error = None
        return self.async_abort(reason=reason)

    async def async_step_pairing_stopped(
        self, user_input: Dict[str, Any] | None = None
    ) -> FlowResult:
        self._ensure_pairing_halted("user_stop")
        self._reset_pairing_state()
        return self.async_abort(reason="pairing_stopped")

    def _get_pairing_manager(self) -> Any | None:
        """Fetch the pairing manager for the selected entry."""

        if self._selected_entry_id is None:
            entries = self.hass.config_entries.async_entries(DOMAIN)
            if len(entries) == 1:
                self._selected_entry_id = entries[0].entry_id
            else:
                return None

        domain_data = self.hass.data.get(DOMAIN)
        if not domain_data:
            return None
        entry_data = domain_data.get(self._selected_entry_id)
        if not entry_data:
            return None
        return entry_data.get("pairing_manager")

    def _on_pairing_task_done(self, task: asyncio.Task) -> None:
        """Handle when the pairing search task is cancelled (user closes dialog)."""
        # Check if the task was cancelled (not completed normally)
        if task.cancelled():
            self._LOGGER.debug("Pairing search task was cancelled by user")
            self._ensure_pairing_halted("user_stop")
            self._reset_pairing_state()

    def _on_confirm_task_done(self, task: asyncio.Task) -> None:
        """Handle when the confirm task is cancelled (user closes dialog)."""
        # Check if the task was cancelled (not completed normally)
        if task.cancelled():
            self._LOGGER.debug("Pairing confirm task was cancelled by user")
            self._ensure_pairing_halted("user_stop")
            self._reset_pairing_state()

    def _cleanup_manager(self) -> None:
        manager = self._pairing_manager
        if not manager:
            return
        if getattr(manager, "is_exiting", False):
            self._pairing_manager = None
            return
        try:
            manager.force_cleanup()
        except Exception:
            pass
        self._pairing_manager = None

    def _ensure_pairing_halted(self, reason: str) -> None:
        manager = self._pairing_manager
        if manager is None:
            manager = self._get_pairing_manager()
        if manager is None:
            return

        immediate = reason != "success"

        if getattr(manager, "is_active", False):
            try:
                manager.cancel(reason=reason, immediate=immediate)
            except Exception:
                try:
                    manager.force_cleanup()
                except Exception:
                    pass
        elif immediate and not getattr(manager, "is_exiting", False):
            try:
                manager.force_cleanup()
            except Exception:
                pass

        self._pairing_manager = manager
        self._cleanup_manager()

    def _reset_pairing_state(self) -> None:
        self._pairing_task = None
        self._confirm_task = None
        self._pairing_candidate = None
        self._pairing_error = None

    @staticmethod
    def async_get_options_flow(entry: config_entries.ConfigEntry) -> config_entries.OptionsFlow:
        return AjaxUARTOptionsFlow(entry)


class AjaxUARTOptionsFlow(config_entries.OptionsFlow):
    """Handle Ajax UART options."""

    def __init__(self, entry: config_entries.ConfigEntry) -> None:
        self._entry = entry

    async def async_step_init(
        self, user_input: Dict[str, Any] | None = None
    ) -> FlowResult:
        data = {**self._entry.data, **self._entry.options}
        if user_input is None:
            return self.async_show_form(
                step_id="init",
                data_schema=_schema(
                    default_port=data.get(CONF_PORT),
                    default_baud=data.get(CONF_BAUDRATE, DEFAULT_BAUDRATE),
                ),
            )

        new_data = {
            CONF_PORT: user_input[CONF_PORT].strip(),
            CONF_BAUDRATE: user_input.get(CONF_BAUDRATE, DEFAULT_BAUDRATE),
        }
        return self.async_create_entry(title="", data=new_data)


def _candidate_placeholders(candidate: Dict[str, Any]) -> Dict[str, Any]:
    type_code = candidate.get("type_code")
    type_name = candidate.get("type_name") or DEVICE_LIBRARY.device_model(type_code)
    firmware = candidate.get("firmware") or "-"
    return {
        "device_name": type_name or candidate.get("device_id", "Unknown"),
        "device_id": candidate.get("device_id", ""),
        "firmware": firmware,
    }
