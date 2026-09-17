"""Binary sensor entities for the Ajax UART integration."""

from __future__ import annotations

import logging
from typing import Any, Callable, Dict, List, Mapping, Optional, Set

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.event import async_call_later

from .const import (
    ATTR_TYPE_CODE,
    CONF_NAME,
    DOMAIN,
    MANUFACTURER,
    SIGNAL_EVENT,
)
from .device_library import DEVICE_LIBRARY

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: Callable
) -> None:
    """Set up Ajax UART binary sensors for a config entry."""

    entry_data = hass.data[DOMAIN][entry.entry_id]

    manager: _AjaxBinarySensorManager | None = entry_data.get(
        "binary_sensor_manager"
    )
    if manager is None:
        manager = _AjaxBinarySensorManager(hass, entry_data, async_add_entities)
        entry_data["binary_sensor_manager"] = manager
    else:
        manager.set_async_add_entities(async_add_entities)

    for device_id, details in entry_data.get("devices", {}).items():
        manager.add_device(device_id, details.get(ATTR_TYPE_CODE))


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    entry_data = hass.data[DOMAIN].get(entry.entry_id, {})
    manager: _AjaxBinarySensorManager | None = entry_data.pop(
        "binary_sensor_manager", None
    )
    if manager:
        manager.async_shutdown()
    return True


class _AjaxBinarySensorManager:
    """Manage binary sensor entity lifecycle based on incoming events."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry_data: Dict,
        async_add_entities: Callable,
    ) -> None:
        self._hass = hass
        self._entry_data = entry_data
        self._async_add_entities = async_add_entities
        self._entities: Dict[str, Dict[str, AjaxLibraryBinarySensor]] = {}
        self._unsub = async_dispatcher_connect(
            hass, SIGNAL_EVENT, self._handle_event
        )

    def set_async_add_entities(self, async_add_entities: Callable) -> None:
        self._async_add_entities = async_add_entities

    @callback
    def _handle_event(self, event: dict) -> None:
        device_id = _normalize_device_id(event)
        if not device_id:
            return

        allowed_ids: Set[str] = self._entry_data.get("allowed_ids", set())
        if allowed_ids and device_id not in allowed_ids:
            return

        devices_registry = self._entry_data.setdefault("devices", {})
        device_entry = devices_registry.get(device_id)
        if device_entry is None:
            return

        type_code = event.get("type_code")
        if type_code:
            type_code = str(type_code)
            if device_entry.get(ATTR_TYPE_CODE) != type_code:
                device_entry[ATTR_TYPE_CODE] = type_code
                device_entry["type_name"] = DEVICE_LIBRARY.device_model(type_code)
                _populate_identity(device_entry, device_id)

        type_code = device_entry.get(ATTR_TYPE_CODE)
        entity_map = self._ensure_entities(device_id, type_code)
        if not entity_map:
            return

        action_spec = DEVICE_LIBRARY.interpret_alarm(
            type_code, event.get("code")
        )
        if not action_spec:
            return

        if action_spec.get("target") != "device" or action_spec.get("platform") != "binary_sensor":
            return

        entity_key = action_spec.get("entity")
        if not entity_key:
            return

        entity = entity_map.get(entity_key)
        if entity is None:
            _LOGGER.debug(
                "No binary entity configured for %s (%s)", entity_key, device_id
            )
            return

        entity.refresh_metadata()
        entity.apply_action(action_spec)

    def _ensure_entities(
        self, device_id: str, type_code: Optional[str]
    ) -> Dict[str, "AjaxLibraryBinarySensor"] | None:
        if device_id in self._entities:
            return self._entities[device_id]

        specs = DEVICE_LIBRARY.entity_specs(type_code)
        new_entities: List[AjaxLibraryBinarySensor] = []
        entity_map: Dict[str, AjaxLibraryBinarySensor] = {}

        for entity_key, spec in specs.items():
            if spec.get("platform") != "binary_sensor":
                continue
            entity = AjaxLibraryBinarySensor(self._entry_data, device_id, spec)
            entity_map[entity_key] = entity
            new_entities.append(entity)

        if not entity_map:
            self._entry_data.setdefault("devices", {}).setdefault(device_id, {}).setdefault(
                "_unsupported_logged", False
            )
            if not self._entry_data["devices"][device_id]["_unsupported_logged"]:
                self._entry_data["devices"][device_id]["_unsupported_logged"] = True
                _LOGGER.info(
                    "Device %s with type %s has no binary sensor mapping defined",
                    device_id,
                    type_code,
                )
            return None

        self._entities[device_id] = entity_map
        if new_entities:
            self._async_add_entities(new_entities)
        return entity_map

    def _create_fireprotect_entities(
        self, device_id: str
    ) -> List["_AjaxBaseBinarySensor"]:
        return [FireProtectSmokeSensor(self._entry_data, device_id)]

    def _create_motionprotect_entities(
        self, device_id: str
    ) -> List["_AjaxBaseBinarySensor"]:
        name_hint = self._entry_data["devices"].get(device_id, {}).get(CONF_NAME)
        return [
            MotionProtectMotionSensor(self._entry_data, device_id, name_hint=name_hint)
        ]

    def add_device(self, device_id: str, type_code: Optional[str]) -> None:
        allowed_ids: Set[str] = self._entry_data.get("allowed_ids", set())
        if allowed_ids and device_id not in allowed_ids:
            return

        devices_registry = self._entry_data.setdefault("devices", {})
        device_entry = devices_registry.get(device_id)
        if device_entry is None:
            return

        if type_code:
            type_code = str(type_code)
            if device_entry.get(ATTR_TYPE_CODE) != type_code:
                device_entry[ATTR_TYPE_CODE] = type_code
                device_entry["type_name"] = DEVICE_LIBRARY.device_model(type_code)
                _populate_identity(device_entry, device_id)

        resolved_type = device_entry.get(ATTR_TYPE_CODE)
        self._ensure_entities(device_id, resolved_type)

    def sync_devices(self, allowed_ids: Set[str]) -> None:
        registry = er.async_get(self._hass)
        for device_id, entity_map in list(self._entities.items()):
            if device_id not in allowed_ids:
                for entity in entity_map.values():
                    if entity.entity_id:
                        registry.async_remove(entity.entity_id)
                self._entities.pop(device_id, None)

    def async_shutdown(self) -> None:
        if self._unsub:
            self._unsub()
            self._unsub = None
        for entity_map in self._entities.values():
            for entity in entity_map.values():
                entity.cancel_autoclear()
        self._entities.clear()


class _AjaxBaseBinarySensor(BinarySensorEntity):
    """Common logic for Ajax UART binary sensors."""

    _attr_should_poll = False
    _attr_has_entity_name = True

    def __init__(self, entry_data: Dict, device_id: str, name_suffix: str) -> None:
        normalized_id = device_id.upper()
        self._entry_data = entry_data
        self._device_id = normalized_id
        self._name_suffix = name_suffix
        self._attr_unique_id = f"{DOMAIN}_{normalized_id}_{name_suffix}"
        self._attr_name = self._compute_entity_name()
        self._attr_device_info = self._build_device_info()

    @callback
    def handle_event(self, event: dict) -> None:
        raise NotImplementedError

    @property
    def _device_entry(self) -> Dict:
        return self._entry_data.get("devices", {}).get(self._device_id, {})

    @property
    def _base_device_name(self) -> str:
        entry = self._device_entry
        return entry.get("unique_name", f"Ajax_Device_{self._device_id}")

    @property
    def _base_device_label(self) -> str:
        entry = self._device_entry
        return entry.get(CONF_NAME) or self._base_device_name.replace("_", " ")

    @property
    def name(self) -> str | None:
        return self._compute_entity_name()

    def _compute_entity_name(self) -> str:
        label = self._base_device_label
        suffix = _format_suffix(self._name_suffix)
        return f"{label} {suffix}"

    @property
    def device_info(self) -> dict:
        return self._build_device_info()

    def _build_device_info(self) -> dict:
        entry = self._device_entry
        type_code = entry.get(ATTR_TYPE_CODE)
        model = DEVICE_LIBRARY.device_model(type_code)
        unique_name = entry.get("unique_name", f"Ajax_Device_{self._device_id}")
        info = {
            "identifiers": {(DOMAIN, unique_name)},
            "manufacturer": MANUFACTURER,
            "name": self._base_device_label,
            "model": model or (f"Device {type_code}" if type_code else "Unknown"),
        }
        via = self._entry_data.get("hub_identifier")
        if via:
            info["via_device"] = via
        return info

    def refresh_metadata(self) -> None:
        self._attr_name = self._compute_entity_name()
        self._attr_device_info = self._build_device_info()

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        _LOGGER.debug(
            "Binary entity %s info=%s device_id=%s",
            self.entity_id,
            self.device_info,
            getattr(self.registry_entry, "device_id", None),
        )


class AjaxLibraryBinarySensor(_AjaxBaseBinarySensor):
    """Binary sensor populated from the device library specification."""

    def __init__(self, entry_data: Dict, device_id: str, spec: Dict[str, Any]) -> None:
        suffix = spec.get("key") or spec.get("entity") or "binary"
        super().__init__(entry_data, device_id, suffix)
        self._entity_key = spec.get("entity", suffix)
        self._log_key = spec.get("key", self._entity_key)
        device_class = spec.get("device_class")
        if device_class:
            try:
                self._attr_device_class = BinarySensorDeviceClass(device_class)
            except ValueError:
                self._attr_device_class = device_class
        category = spec.get("category")
        if category == "diagnostic":
            self._attr_entity_category = EntityCategory.DIAGNOSTIC
        elif category == "config":
            self._attr_entity_category = EntityCategory.CONFIG
        self._attr_is_on = False
        self._clear_listener: Optional[Callable] = None

    def cancel_autoclear(self) -> None:
        if self._clear_listener:
            self._clear_listener()
            self._clear_listener = None

    def apply_action(self, action: Mapping[str, Any]) -> None:
        action_type = action.get("action")
        if action_type == "on":
            self._set_state(True)
            self.cancel_autoclear()
        elif action_type == "off":
            self._set_state(False)
            self.cancel_autoclear()
        elif action_type == "pulse":
            seconds = action.get("off_seconds", 30)
            self._set_state(True)
            self._schedule_clear(seconds)
        elif action_type == "log":
            _LOGGER.info(
                "Ajax event %s from %s (%s)",
                self._log_key,
                self._device_id,
                action.get("target"),
            )
        else:
            _LOGGER.debug(
                "Unhandled binary sensor action %s for %s", action_type, self._device_id
            )

    def _set_state(self, value: bool) -> None:
        if self._attr_is_on != value:
            self._attr_is_on = value
            self.async_write_ha_state()

    def _schedule_clear(self, seconds: float) -> None:
        self.cancel_autoclear()
        if self.hass:
            self._clear_listener = async_call_later(
                self.hass, seconds, self._handle_auto_clear
            )

    @callback
    def _handle_auto_clear(self, _now) -> None:
        self._clear_listener = None
        if self._attr_is_on:
            self._attr_is_on = False
            self.async_write_ha_state()

    async def async_will_remove_from_hass(self) -> None:
        self.cancel_autoclear()
        await super().async_will_remove_from_hass()


def _normalize_device_id(event: dict) -> str | None:
    device_id = event.get("device_id")
    if not device_id:
        return None
    return str(device_id).upper()


def _populate_identity(entry: Dict, device_id: str) -> None:
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


def _format_suffix(name_suffix: str) -> str:
    text = name_suffix.replace("_", " ")
    lowered = text.lower()
    if lowered in {"co", "rssi"}:
        return lowered.upper()
    return lowered
