"""Switch entities for Ajax UART integration."""

from __future__ import annotations

import logging
from typing import Any, Dict

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity import EntityCategory

from .const import DOMAIN, MANUFACTURER

_LOGGER = logging.getLogger(__name__)

_DEBUG_LOGGER_NAMES = ["custom_components.ajax_uart", "custom_components.ajax_bridge"]


def _apply_debug_logging(entry_data: Dict[str, Any], enabled: bool) -> None:
    prev_levels: Dict[str, int] = entry_data.setdefault("debug_logging_levels", {})
    for name in _DEBUG_LOGGER_NAMES:
        logger = logging.getLogger(name)
        if enabled:
            if name not in prev_levels:
                prev_levels[name] = logger.getEffectiveLevel()
            logger.setLevel(logging.DEBUG)
        else:
            original = prev_levels.get(name)
            if original is not None:
                logger.setLevel(original)
            else:
                logger.setLevel(logging.INFO)
    entry_data["debug_logging_enabled"] = enabled


def _build_hub_device_info(entry_data: Dict[str, Any]) -> Dict[str, Any]:
    identifier = entry_data.get("hub_identifier")
    if identifier:
        identifiers = {identifier}
    else:
        identifiers = {(DOMAIN, "hub")}
    hub_code = entry_data.get("hub_device_code")
    name = f"Ajax Hub {hub_code}" if hub_code else "Ajax Hub"
    return {
        "identifiers": identifiers,
        "manufacturer": MANUFACTURER,
        "name": name,
        "model": "uartBridge",
    }


def _cleanup_legacy_entity(hass: HomeAssistant) -> None:
    registry = er.async_get(hass)
    old_unique_id = f"{DOMAIN}_debug_logging"
    entity_id = registry.async_get_entity_id("switch", DOMAIN, old_unique_id)
    if entity_id:
        registry.async_remove(entity_id)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities
) -> None:
    """Set up debug logging switch."""

    _cleanup_legacy_entity(hass)

    entry_data = hass.data[DOMAIN][entry.entry_id]
    switch = AjaxDebugLoggingSwitch(entry_data)
    entry_data["debug_logging_switch"] = switch
    async_add_entities([switch])


def _revert_debug(entry_data: Dict[str, Any]) -> None:
    if entry_data.get("debug_logging_enabled"):
        _apply_debug_logging(entry_data, False)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    entry_data = hass.data[DOMAIN].get(entry.entry_id, {})
    _revert_debug(entry_data)
    entry_data.pop("debug_logging_switch", None)
    return True


class AjaxDebugLoggingSwitch(SwitchEntity):
    """Switch to toggle Ajax UART debug logging."""

    _attr_should_poll = False
    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, entry_data: Dict[str, Any]) -> None:
        self._entry_data = entry_data
        self._attr_unique_id = f"{DOMAIN}_debug_logging_mode"
        self._attr_name = "Debug Logging"
        self._attr_is_on = bool(entry_data.get("debug_logging_enabled"))

    async def async_turn_on(self, **kwargs: Any) -> None:
        _LOGGER.debug("Enabling debug logging via switch")
        _apply_debug_logging(self._entry_data, True)
        self._attr_is_on = True
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs: Any) -> None:
        _LOGGER.debug("Disabling debug logging via switch")
        _apply_debug_logging(self._entry_data, False)
        self._attr_is_on = False
        self.async_write_ha_state()

    @property
    def device_info(self) -> Dict[str, Any]:
        return _build_hub_device_info(self._entry_data)

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        # Remove legacy entity referencing old unique id
        _cleanup_legacy_entity(self.hass)

    async def async_will_remove_from_hass(self) -> None:
        await super().async_will_remove_from_hass()
        _revert_debug(self._entry_data)
