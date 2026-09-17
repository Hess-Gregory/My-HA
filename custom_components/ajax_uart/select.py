"""Select entities for Ajax UART parameter controls."""

from __future__ import annotations

import logging
from typing import Any, Callable, Dict, Mapping, Optional, Set

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.event import async_call_later

from .const import (
    ATTR_DEVICE_ID,
    ATTR_PARAMETERS,
    ATTR_TYPE_CODE,
    CONF_NAME,
    DOMAIN,
    MANUFACTURER,
    SERVICE_SET_PARAMETERS,
    SIGNAL_EVENT,
)
from .device_library import DEVICE_LIBRARY

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: Callable
) -> None:
    """Set up Ajax UART select entities for a config entry."""

    entry_data = hass.data[DOMAIN][entry.entry_id]

    parameter_manager: _AjaxParameterManager | None = entry_data.get("parameter_manager")
    if parameter_manager is None:
        parameter_manager = _AjaxParameterManager(hass, entry_data, async_add_entities)
        entry_data["parameter_manager"] = parameter_manager
    else:
        parameter_manager.set_async_add_entities(async_add_entities)

    for device_id, details in entry_data.get("devices", {}).items():
        parameter_manager.add_device(device_id, details.get(ATTR_TYPE_CODE))

    arm_manager: _AjaxArmManager | None = entry_data.get("arm_manager")
    if arm_manager is None:
        arm_manager = _AjaxArmManager(hass, entry_data, async_add_entities)
        entry_data["arm_manager"] = arm_manager
    else:
        arm_manager.set_async_add_entities(async_add_entities)

    arm_manager.ensure_hub_entity()
    for device_id, details in entry_data.get("devices", {}).items():
        arm_manager.add_device(device_id, details.get(ATTR_TYPE_CODE))


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    entry_data = hass.data[DOMAIN].get(entry.entry_id, {})
    manager: _AjaxParameterManager | None = entry_data.pop("parameter_manager", None)
    if manager:
        manager.async_shutdown()
    arm_manager: _AjaxArmManager | None = entry_data.pop("arm_manager", None)
    if arm_manager:
        arm_manager.async_shutdown()
    return True


class _AjaxParameterManager:
    """Manage parameter select entities."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry_data: Dict[str, Any],
        async_add_entities: Callable,
    ) -> None:
        self._hass = hass
        self._entry_data = entry_data
        self._async_add_entities = async_add_entities
        self._entities: Dict[str, Dict[str, AjaxParameterSelect]] = {}
        self._unsub = async_dispatcher_connect(hass, SIGNAL_EVENT, self._handle_event)
        self._coordinator = entry_data.get("parameter_coordinator")

    def set_async_add_entities(self, async_add_entities: Callable) -> None:
        self._async_add_entities = async_add_entities

    def async_shutdown(self) -> None:
        if self._unsub:
            self._unsub()
            self._unsub = None
        self._entities.clear()

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
                _populate_identity(device_entry, device_id)

        entity_map = self._ensure_entities(device_id, device_entry.get(ATTR_TYPE_CODE))
        if not entity_map:
            return

        state = device_entry.get("params_state", {})
        for entity in entity_map.values():
            entity.refresh_metadata()
            entity.set_value(state.get(entity.param_key))

    def sync_devices(self, allowed_ids: Set[str]) -> None:
        registry = er.async_get(self._hass)
        for device_id, entity_map in list(self._entities.items()):
            if device_id not in allowed_ids:
                for entity in entity_map.values():
                    if entity.entity_id:
                        registry.async_remove(entity.entity_id)
                self._entities.pop(device_id, None)

    async def async_set_parameters(
        self, device_id: str, parameters: Mapping[str, Any]
    ) -> None:
        device_id = device_id.upper()

        devices_registry = self._entry_data.get("devices", {})
        device_entry = devices_registry.get(device_id)
        if device_entry is None:
            raise HomeAssistantError(f"Unknown device id {device_id}")

        template_name = self._ensure_template(device_entry, device_id)
        if not template_name:
            raise HomeAssistantError("Device does not support parameter adjustments")

        if not isinstance(parameters, Mapping) or not parameters:
            raise HomeAssistantError("No parameters supplied")

        type_code = device_entry.get(ATTR_TYPE_CODE)
        param_specs = {
            spec["entity"]: spec for spec in DEVICE_LIBRARY.param_entities(type_code)
        }
        order = DEVICE_LIBRARY.param_order(type_code)
        if not order:
            raise HomeAssistantError("Device does not support parameter adjustments")
        valid_names = set(order)
        invalid = [name for name in parameters if name not in valid_names]
        if invalid:
            raise HomeAssistantError(
                f"Unsupported parameter(s) for device {device_id}: {', '.join(invalid)}"
            )

        state = device_entry.setdefault("params_state", {})

        values_map: Dict[str, str] = {
            name: str(value) for name, value in state.items() if value is not None
        }

        for param_name, raw_value in parameters.items():
            canonical = self._normalize_param_value(
                param_specs, param_name, raw_value
            )
            values_map[param_name] = canonical

        missing = [name for name in order if name not in values_map]
        if missing:
            raise HomeAssistantError(
                f"Current value for {', '.join(missing)} is unknown"
            )

        byte_values = [values_map[name] for name in order]

        if not self._coordinator:
            raise HomeAssistantError("Parameter coordinator not ready")

        command = DEVICE_LIBRARY.build_params_command(
            template_name, device_id, byte_values
        )
        _LOGGER.debug("Setting parameters for %s via command: %s", device_id, command)
        await self._coordinator.async_set(device_id, command)

        # Update local state on success
        for name, value in values_map.items():
            state[name] = value

        entity_map = self._entities.get(device_id, {})
        for entity in entity_map.values():
            entity.refresh_metadata()
            entity.set_value(state.get(entity.param_key))

    def _ensure_entities(
        self, device_id: str, type_code: Optional[str]
    ) -> Dict[str, AjaxParameterSelect] | None:
        existing = self._entities.get(device_id)
        if existing is not None:
            return existing

        template_name = DEVICE_LIBRARY.params_template_name(type_code)
        if not template_name:
            return None

        order = DEVICE_LIBRARY.param_order(type_code)
        if not order:
            return None

        allowed = set(order)
        specs = [
            spec
            for spec in DEVICE_LIBRARY.param_entities(type_code)
            if spec.get("platform") == "select" and spec.get("entity") in allowed
        ]
        if not specs:
            return None

        device_entry = self._entry_data.setdefault("devices", {}).setdefault(
            device_id, {}
        )
        device_entry.setdefault("params_state", {})

        entity_map: Dict[str, AjaxParameterSelect] = {}
        new_entities: list[AjaxParameterSelect] = []
        for spec in specs:
            entity = AjaxParameterSelect(self._entry_data, device_id, spec)
            entity_map[entity.param_key] = entity
            new_entities.append(entity)

        self._entities[device_id] = entity_map
        if new_entities:
            self._async_add_entities(new_entities)

        return entity_map

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
                _populate_identity(device_entry, device_id)

        if event.get("tag") != "STATUS":
            return

        template_name = self._ensure_template(device_entry, device_id)
        if not template_name:
            return

        type_code = device_entry.get(ATTR_TYPE_CODE)
        order = DEVICE_LIBRARY.param_order(type_code)
        if not order:
            return

        state = device_entry.setdefault("params_state", {})
        updated = False
        for idx, param_name in enumerate(order, start=1):
            raw_value = event.get(f"setting_byte_{idx}")
            if raw_value is None:
                continue
            value_str = str(raw_value)
            previous = state.get(param_name)
            state[param_name] = value_str
            if previous != value_str:
                updated = True

        if not updated:
            return

        entity_map = self._entities.get(device_id, {})
        if not entity_map:
            return

        for entity in entity_map.values():
            entity.refresh_metadata()
            entity.set_value(state.get(entity.param_key))

    def _ensure_template(self, entry: Dict[str, Any], device_id: str) -> Optional[str]:
        type_code = entry.get(ATTR_TYPE_CODE)
        template_name = DEVICE_LIBRARY.params_template_name(type_code)
        if template_name:
            entry["params_template"] = template_name
            entry.setdefault("params_state", {})
        else:
            entry.pop("params_template", None)
            entry.pop("params_state", None)
        return template_name

    def _normalize_param_value(
        self,
        param_specs: Dict[str, Dict[str, Any]],
        param_name: str,
        value: Any,
    ) -> str:
        spec = param_specs.get(param_name)
        value_str = str(value).strip()
        if not spec:
            return value_str

        options = spec.get("options", {})
        if value_str in options:
            return value_str

        lowered = value_str.lower()
        for key, label in options.items():
            if lowered == str(label).lower():
                return str(key)

        raise HomeAssistantError(
            f"Invalid value '{value}' for parameter {param_name}"
        )


class _AjaxArmManager:
    """Manage arm/disarm select entities for hub and devices."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry_data: Dict[str, Any],
        async_add_entities: Callable,
    ) -> None:
        self._hass = hass
        self._entry_data = entry_data
        self._async_add_entities = async_add_entities
        self._device_entities: Dict[str, AjaxDeviceArmSelect] = {}
        self._hub_entity: AjaxHubArmSelect | None = None
        self._unsub = async_dispatcher_connect(hass, SIGNAL_EVENT, self._handle_event)

    def set_async_add_entities(self, async_add_entities: Callable) -> None:
        self._async_add_entities = async_add_entities
        self.ensure_hub_entity()

    def async_shutdown(self) -> None:
        if self._unsub:
            self._unsub()
            self._unsub = None
        if self._hub_entity:
            self._hub_entity.cancel_revert()
            self._hub_entity = None
        for entity in self._device_entities.values():
            entity.cancel_revert()
        self._device_entities.clear()

    def ensure_hub_entity(self) -> None:
        if self._hub_entity is not None:
            return
        hub_code = self._entry_data.get("hub_device_code")
        if not hub_code:
            return
        registry = er.async_get(self._hass)
        legacy_unique_id = f"{DOMAIN}_hub_arm_mode"
        legacy_entity_id = registry.async_get_entity_id("select", DOMAIN, legacy_unique_id)
        if legacy_entity_id:
            registry.async_remove(legacy_entity_id)
        entity = AjaxHubArmSelect(self._entry_data)
        self._hub_entity = entity
        self._async_add_entities([entity])

    def add_device(self, device_id: str, type_code: Optional[str]) -> None:
        allowed_ids: Set[str] = self._entry_data.get("allowed_ids", set())
        normalized = device_id.upper()
        if allowed_ids and normalized not in allowed_ids:
            return

        devices_registry = self._entry_data.setdefault("devices", {})
        device_entry = devices_registry.get(normalized)
        if device_entry is None:
            return

        if type_code:
            type_code = str(type_code)
            if device_entry.get(ATTR_TYPE_CODE) != type_code:
                device_entry[ATTR_TYPE_CODE] = type_code
                _populate_identity(device_entry, normalized)

        existing = self._device_entities.get(normalized)
        if existing:
            existing.refresh_metadata()
            return

        registry = er.async_get(self._hass)
        legacy_unique_id = f"{DOMAIN}_{normalized}_arm_mode"
        legacy_entity_id = registry.async_get_entity_id("select", DOMAIN, legacy_unique_id)
        if legacy_entity_id:
            registry.async_remove(legacy_entity_id)

        entity = AjaxDeviceArmSelect(self._entry_data, normalized)
        entity.refresh_metadata()
        self._device_entities[normalized] = entity
        self._async_add_entities([entity])

    def sync_devices(self, allowed_ids: Set[str]) -> None:
        registry = er.async_get(self._hass)
        for device_id, entity in list(self._device_entities.items()):
            if device_id not in allowed_ids:
                if entity.entity_id:
                    registry.async_remove(entity.entity_id)
                entity.cancel_revert()
                self._device_entities.pop(device_id, None)

    @callback
    def _handle_event(self, event: dict) -> None:
        tag = event.get("tag")
        if tag == "RSTATE":
            device_id = str(event.get("device_id", "")).upper()
            hub_code = self._entry_data.get("hub_device_code")
            if hub_code and device_id == hub_code:
                self.ensure_hub_entity()
                if self._hub_entity:
                    self._hub_entity.refresh_metadata()
        elif tag == "LIST":
            device_id = str(event.get("device_id", "")).upper()
            entity = self._device_entities.get(device_id)
            if entity:
                entity.refresh_metadata()

class AjaxParameterSelect(SelectEntity):
    """Select entity exposing Ajax detector configuration options."""

    _attr_should_poll = False
    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, entry_data: Dict[str, Any], device_id: str, spec: Dict[str, Any]) -> None:
        self._entry_data = entry_data
        self._device_id = device_id.upper()
        self._spec = spec
        self._param_key = spec.get("entity")
        self._name_suffix = spec.get("name") or self._param_key.replace("_", " ").title()
        self._attr_unique_id = f"{DOMAIN}_{self._device_id}_{self._param_key}"
        self._attr_name = self._compute_entity_name()
        self._attr_device_info = self._build_device_info()
        self._label_to_value: Dict[str, str] = {}
        self._value_to_label: Dict[str, str] = {}
        self._current_value: Optional[str] = None
        self._attr_options: list[str] = []
        self._attr_current_option: Optional[str] = None
        self._attr_available = False
        self._setup_options(spec.get("options", {}))

    @property
    def param_key(self) -> str:
        return self._param_key

    async def async_select_option(self, option: str) -> None:
        value = self._label_to_value.get(option)
        if value is None:
            raise HomeAssistantError(f"Unknown option {option} for {self._param_key}")
        await self.hass.services.async_call(
            DOMAIN,
            SERVICE_SET_PARAMETERS,
            {
                ATTR_DEVICE_ID: self._device_id,
                ATTR_PARAMETERS: {self._param_key: value},
            },
            blocking=True,
        )

    def set_value(self, value: Optional[str]) -> None:
        if value is None:
            if self._current_value is None and self._attr_available:
                return
            self._current_value = None
            self._attr_current_option = None
            self._attr_available = bool(self._attr_options)
            if self.hass:
                self.schedule_update_ha_state()
            return

        new_value = str(value)
        if new_value == self._current_value and self._attr_available:
            return

        label = self._value_to_label.get(new_value)
        if label is None:
            label = _format_option_label(new_value)
            if label not in self._label_to_value:
                self._label_to_value[label] = new_value
                self._value_to_label[new_value] = label
                if label not in self._attr_options:
                    self._attr_options = [*self._attr_options, label]
        self._current_value = new_value
        self._attr_current_option = label
        self._attr_available = True
        if self.hass:
            self.schedule_update_ha_state()

    def refresh_metadata(self) -> None:
        self._attr_name = self._compute_entity_name()
        self._attr_device_info = self._build_device_info()

    def _compute_entity_name(self) -> str:
        base = self._base_device_label
        return f"{base} {self._name_suffix}"

    @property
    def _device_entry(self) -> Dict[str, Any]:
        return self._entry_data.get("devices", {}).get(self._device_id, {})

    @property
    def _base_device_name(self) -> str:
        entry = self._device_entry
        return entry.get("unique_name", f"Ajax_Device_{self._device_id}")

    @property
    def _base_device_label(self) -> str:
        entry = self._device_entry
        return entry.get(CONF_NAME) or self._base_device_name.replace("_", " ")

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

    def _setup_options(self, options: Mapping[str, Any]) -> None:
        ordered = sorted(
            ((str(key), value) for key, value in options.items()),
            key=lambda item: int(item[0]),
        )
        self._label_to_value.clear()
        self._value_to_label.clear()
        labels: list[str] = []
        for key, raw_label in ordered:
            label = _format_option_label(str(raw_label), key)
            if label in labels:
                label = f"{label} ({key})"
            labels.append(label)
            self._label_to_value[label] = key
            self._value_to_label[key] = label
        self._attr_options = labels
        self._attr_available = bool(labels)


ARM_SELECT_OPTIONS = ["Armed", "Disarmed"]
ARM_REVERT_SECONDS = 180


class _AjaxArmBaseSelect(SelectEntity):
    """Shared logic for operation mode selects."""

    _attr_should_poll = False
    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, entry_data: Dict[str, Any]) -> None:
        self._entry_data = entry_data
        self._revert_handle = None
        self._attr_options = list(ARM_SELECT_OPTIONS)
        self._attr_current_option = "Armed"

    async def async_select_option(self, option: str) -> None:
        normalized = self._normalize_option(option)
        await self._set_mode(normalized, schedule_revert=True)

    async def _set_mode(self, option: str, *, schedule_revert: bool) -> None:
        await self._execute_command(option)
        self._attr_current_option = option
        if schedule_revert and option == "Disarmed":
            self._schedule_revert()
        else:
            self._cancel_revert()
        self.async_write_ha_state()

    def cancel_revert(self) -> None:
        self._cancel_revert()

    def _normalize_option(self, option: str) -> str:
        value = str(option).strip().lower()
        if value in {"arm", "armed", "1"}:
            return "Armed"
        if value in {"disarm", "disarmed", "0"}:
            return "Disarmed"
        raise HomeAssistantError(f"Unsupported option {option}")

    def _schedule_revert(self) -> None:
        self._cancel_revert()
        if self.hass:
            self._revert_handle = async_call_later(
                self.hass, ARM_REVERT_SECONDS, self._handle_auto_revert
            )

    @callback
    def _handle_auto_revert(self, _now) -> None:
        self._revert_handle = None
        if self.hass:
            self.hass.async_create_task(self._set_mode("Armed", schedule_revert=False))

    def _cancel_revert(self) -> None:
        if self._revert_handle:
            self._revert_handle()
            self._revert_handle = None

    async def _execute_command(self, option: str) -> None:
        raise NotImplementedError

    def _check_ready(self):
        if self._entry_data.get("list_active"):
            raise HomeAssistantError("Device list refresh in progress")
        pairing = self._entry_data.get("pairing_manager")
        if pairing and (pairing.is_active or pairing.is_exiting):
            raise HomeAssistantError("Pairing operation in progress")
        delete_manager = self._entry_data.get("delete_manager")
        if delete_manager and getattr(delete_manager, "busy", False):
            raise HomeAssistantError("Device deletion in progress")
        protocol = self._entry_data.get("protocol")
        if not protocol:
            raise HomeAssistantError("Bridge connection not ready")
        return protocol

    async def async_will_remove_from_hass(self) -> None:
        self._cancel_revert()
        await super().async_will_remove_from_hass()


class AjaxDeviceArmSelect(_AjaxArmBaseSelect):
    """Select entity for detector operation mode."""

    def __init__(self, entry_data: Dict[str, Any], device_id: str) -> None:
        super().__init__(entry_data)
        self._device_id = device_id.upper()
        self._name_suffix = "Operation Mode"
        self._attr_unique_id = f"{DOMAIN}_{self._device_id}_operation_mode"
        self.refresh_metadata()

    async def _execute_command(self, option: str) -> None:
        protocol = self._check_ready()
        value = "1" if option == "Armed" else "0"
        protocol.send_cmd(f"ssp {self._device_id},{value}")

    def refresh_metadata(self) -> None:
        entry = self._entry_data.setdefault("devices", {}).setdefault(self._device_id, {})
        _populate_identity(entry, self._device_id)
        self._attr_name = self._compute_entity_name()
        self._attr_device_info = self._build_device_info()

    def _compute_entity_name(self) -> str:
        base = self._base_device_label
        return f"{base} {self._name_suffix}"

    @property
    def _device_entry(self) -> Dict[str, Any]:
        return self._entry_data.get("devices", {}).get(self._device_id, {})

    @property
    def _base_device_name(self) -> str:
        entry = self._device_entry
        return entry.get("unique_name", f"Ajax_Device_{self._device_id}")

    @property
    def _base_device_label(self) -> str:
        entry = self._device_entry
        return entry.get(CONF_NAME) or self._base_device_name.replace("_", " ")

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


class AjaxHubArmSelect(_AjaxArmBaseSelect):
    """Select entity for hub operation mode."""

    def __init__(self, entry_data: Dict[str, Any]) -> None:
        super().__init__(entry_data)
        self._attr_unique_id = f"{DOMAIN}_hub_operation_mode"
        self.refresh_metadata()

    async def _execute_command(self, option: str) -> None:
        protocol = self._check_ready()
        command = "act" if option == "Armed" else "pas"
        protocol.send_cmd(command)

    def refresh_metadata(self) -> None:
        self._attr_name = self._compute_entity_name()
        self._attr_device_info = self._build_device_info()

    def _compute_entity_name(self) -> str:
        base = self._base_label
        return f"{base} Operation Mode"

    @property
    def _base_label(self) -> str:
        hub_code = self._entry_data.get("hub_device_code")
        if hub_code:
            return f"Ajax Hub {hub_code}"
        return "Ajax Hub"

    def _build_device_info(self) -> dict:
        identifier = self._entry_data.get("hub_identifier")
        if identifier:
            identifiers = {identifier}
        else:
            identifiers = {(DOMAIN, "hub")}
        return {
            "identifiers": identifiers,
            "manufacturer": MANUFACTURER,
            "name": self._base_label,
            "model": "uartBridge",
        }
def _normalize_device_id(event: Mapping[str, Any]) -> Optional[str]:
    device_id = event.get("device_id")
    if not device_id:
        return None
    return str(device_id).upper()


def _populate_identity(entry: Dict[str, Any], device_id: str) -> None:
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


def _format_option_label(value: str, key: Optional[str] = None) -> str:
    lowered = value.lower()
    mapping = {
        "min": "Low",
        "mid": "Medium",
        "max": "High",
        "on": "On",
        "off": "Off",
    }
    special_numeric = {
        "0": "Off",
    }
    if value in special_numeric:
        return special_numeric[value]
    if lowered in mapping:
        return mapping[lowered]
    if value == "0":
        return "Unknown"
    return value.replace("_", " ").title()
