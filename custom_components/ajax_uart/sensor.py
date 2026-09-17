"""Sensor entities for the Ajax UART integration."""

from __future__ import annotations

import logging
from typing import Callable, Dict, List, Optional, Set

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import EntityCategory

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
    """Set up Ajax UART sensors for a config entry."""

    entry_data = hass.data[DOMAIN][entry.entry_id]

    manager: _AjaxSensorManager | None = entry_data.get("sensor_manager")
    if manager is None:
        manager = _AjaxSensorManager(hass, entry_data, async_add_entities)
        entry_data["sensor_manager"] = manager
    else:
        manager.set_async_add_entities(async_add_entities)

    for device_id, details in entry_data.get("devices", {}).items():
        manager.add_device(device_id, details.get(ATTR_TYPE_CODE))


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    entry_data = hass.data[DOMAIN].get(entry.entry_id, {})
    manager: _AjaxSensorManager | None = entry_data.pop("sensor_manager", None)
    if manager:
        manager.async_shutdown()
    return True


class _AjaxSensorManager:
    """Manage sensor entities based on incoming events."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry_data: Dict,
        async_add_entities: Callable,
    ) -> None:
        self._hass = hass
        self._entry_data = entry_data
        self._async_add_entities = async_add_entities
        self._entities: Dict[str, List[_AjaxBaseSensor]] = {}
        self._unsub = async_dispatcher_connect(hass, SIGNAL_EVENT, self._handle_event)

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

        sensors = self._ensure_entities(device_id)
        if not sensors:
            return

        for sensor in sensors:
            sensor.refresh_metadata()
            sensor.handle_event(event)

    def _ensure_entities(self, device_id: str) -> List["_AjaxBaseSensor"] | None:
        sensors = self._entities.get(device_id)
        if sensors is not None:
            return sensors

        sensors = self._create_common_sensors(device_id)
        if not sensors:
            return None
        self._entities[device_id] = sensors
        self._async_add_entities(sensors)
        return sensors

    def _create_common_sensors(self, device_id: str) -> List["_AjaxBaseSensor"]:
        registry = er.async_get(self._hass)
        old_unique_id = f"{DOMAIN}_{device_id.upper()}_signal_bars"
        old_entity_id = registry.async_get_entity_id("sensor", DOMAIN, old_unique_id)
        if old_entity_id:
            registry.async_remove(old_entity_id)

        return [
            AjaxBatterySensor(self._entry_data, device_id),
            AjaxSignalPercentSensor(self._entry_data, device_id),
            AjaxRSSISensor(self._entry_data, device_id),
            AjaxNoiseSensor(self._entry_data, device_id),
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

        self._ensure_entities(device_id)

    def sync_devices(self, allowed_ids: Set[str]) -> None:
        registry = er.async_get(self._hass)
        for device_id, sensors in list(self._entities.items()):
            if device_id not in allowed_ids:
                for sensor in sensors:
                    if sensor.entity_id:
                        registry.async_remove(sensor.entity_id)
                self._entities.pop(device_id, None)

    def async_shutdown(self) -> None:
        if self._unsub:
            self._unsub()
            self._unsub = None
        self._entities.clear()


class _AjaxBaseSensor(SensorEntity):
    """Shared logic for Ajax UART sensors."""

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

    @property
    def name(self) -> str | None:
        return self._compute_entity_name()

    def _compute_entity_name(self) -> str:
        label = self._base_device_label
        suffix = _format_suffix(self._name_suffix)
        return f"{label} {suffix}"

    def refresh_metadata(self) -> None:
        self._attr_name = self._compute_entity_name()
        self._attr_device_info = self._build_device_info()

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        _LOGGER.debug(
            "Sensor entity %s info=%s device_id=%s",
            self.entity_id,
            self.device_info,
            getattr(self.registry_entry, "device_id", None),
        )


class AjaxBatterySensor(_AjaxBaseSensor):
    """Report device battery percentage."""

    _attr_device_class = SensorDeviceClass.BATTERY
    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, entry_data: Dict, device_id: str) -> None:
        super().__init__(entry_data, device_id, "battery")
        self._attr_native_value = None

    @callback
    def handle_event(self, event: dict) -> None:
        if _normalize_device_id(event) != self._device_id:
            return
        if event.get("tag") != "STATUS":
            return

        value = _coerce_int(event.get("battery"))
        if value is None:
            return
        if value != self._attr_native_value:
            self._attr_native_value = value
            self.async_write_ha_state()


class AjaxSignalPercentSensor(_AjaxBaseSensor):
    """Wi-Fi style percentage signal strength computed from SNR."""

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "%"
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, entry_data: Dict, device_id: str) -> None:
        super().__init__(entry_data, device_id, "signal")
        self._attr_native_value: int | None = None
        self._snr_ema: float | None = None

    @callback
    def handle_event(self, event: dict) -> None:
        if _normalize_device_id(event) != self._device_id or event.get("tag") != "STATUS":
            return

        rssi = _coerce_float(event.get("loc_rssi"))
        noise = _coerce_float(event.get("loc_noise"))
        if rssi is None or noise is None:
            return

        snr = rssi - noise
        self._snr_ema = _ema(self._snr_ema, snr)
        percent = _snr_to_percent(self._snr_ema)
        if percent is None:
            return
        if percent != self._attr_native_value:
            self._attr_native_value = percent
            self.async_write_ha_state()

    @property
    def icon(self) -> str:
        bars = _snr_to_bars(self._snr_ema)
        return _bars_to_icon(bars)


class AjaxRSSISensor(_AjaxBaseSensor):
    """Expose the raw RSSI reported by the receiver (dBm)."""

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_device_class = SensorDeviceClass.SIGNAL_STRENGTH
    _attr_native_unit_of_measurement = "dBm"

    def __init__(self, entry_data: Dict, device_id: str) -> None:
        super().__init__(entry_data, device_id, "rssi")
        self._attr_native_value: float | None = None

    @callback
    def handle_event(self, event: dict) -> None:
        if _normalize_device_id(event) != self._device_id or event.get("tag") != "STATUS":
            return

        rssi = _coerce_float(event.get("loc_rssi"))
        if rssi is None:
            return
        if rssi != self._attr_native_value:
            self._attr_native_value = rssi
            self.async_write_ha_state()


class AjaxNoiseSensor(_AjaxBaseSensor):
    """Expose the local noise floor measured by the receiver (dBm)."""

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_device_class = SensorDeviceClass.SIGNAL_STRENGTH
    _attr_native_unit_of_measurement = "dBm"

    def __init__(self, entry_data: Dict, device_id: str) -> None:
        super().__init__(entry_data, device_id, "noise")
        self._attr_native_value: float | None = None

    @callback
    def handle_event(self, event: dict) -> None:
        if _normalize_device_id(event) != self._device_id or event.get("tag") != "STATUS":
            return

        noise = _coerce_float(event.get("loc_noise"))
        if noise is None:
            return
        if noise != self._attr_native_value:
            self._attr_native_value = noise
            self.async_write_ha_state()


def _normalize_device_id(event: dict) -> str | None:
    device_id = event.get("device_id")
    if not device_id:
        return None
    return str(device_id).upper()


def _coerce_int(value) -> int | None:
    if value is None:
        return None
    try:
        return int(str(value))
    except (ValueError, TypeError):
        _LOGGER.debug("Unable to parse integer from value: %s", value)
        return None


def _coerce_float(value) -> float | None:
    if value is None:
        return None
    try:
        return float(str(value))
    except (ValueError, TypeError):
        _LOGGER.debug("Unable to parse float from value: %s", value)
        return None


def _ema(previous: float | None, new_value: float, alpha: float = 0.3) -> float:
    if previous is None:
        return new_value
    return alpha * new_value + (1 - alpha) * previous


def _snr_to_percent(snr: float | None) -> int | None:
    if snr is None:
        return None
    percent = (snr / 50.0) * 100.0
    percent = max(0.0, min(100.0, percent))
    return int(round(percent))


def _snr_to_bars(snr: float | None) -> int:
    if snr is None:
        return 0
    if snr >= 40:
        return 4
    if snr >= 30:
        return 3
    if snr >= 20:
        return 2
    if snr >= 10:
        return 1
    return 0


def _bars_to_icon(bars: int | None) -> str:
    mapping = {
        4: "mdi:wifi-strength-4",
        3: "mdi:wifi-strength-3",
        2: "mdi:wifi-strength-2",
        1: "mdi:wifi-strength-1",
        0: "mdi:wifi-strength-outline",
    }
    return mapping.get(int(bars or 0), "mdi:wifi-strength-outline")


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
