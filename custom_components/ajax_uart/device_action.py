"""Device actions for Ajax UART integration."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.const import CONF_DEVICE_ID, CONF_DOMAIN, CONF_TYPE
from homeassistant.core import Context, HomeAssistant
from homeassistant.helpers.config_validation import DEVICE_SCHEMA

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

ACTION_ADD_DEVICES = "add_devices"

ACTION_SCHEMA = DEVICE_SCHEMA.extend(
    {
        vol.Required(CONF_TYPE): ACTION_ADD_DEVICES,
    }
)


async def async_call_action_from_config(
    hass: HomeAssistant,
    config: dict[str, Any],
    variables: dict[str, Any],
    context: Context | None = None,
) -> None:
    """Execute a device action based on the provided config."""
    await async_perform_action(hass, config, variables, context)


async def async_perform_action(
    hass: HomeAssistant,
    config: dict[str, Any],
    variables: dict[str, Any],
    context: Context | None = None,
) -> None:
    """Perform a device action.
    
    This is called when a device action is triggered, such as the "Add Devices"
    button on the hub device page.
    """
    action_type = config[CONF_TYPE]
    device_id = config[CONF_DEVICE_ID]

    if action_type == ACTION_ADD_DEVICES:
        await _perform_add_devices(hass, device_id)


async def _perform_add_devices(hass: HomeAssistant, device_id: str) -> None:
    """Trigger the device pairing flow."""
    domain_data = hass.data.get(DOMAIN, {})
    config_entry_id = None
    
    # Iterate through all config entries for this domain to find the hub device
    for entry_id, entry_data in domain_data.items():
        if entry_data.get("hub_device_id") == device_id:
            config_entry_id = entry_id
            break
    
    if not config_entry_id:
        _LOGGER.error("Could not find config entry for hub device %s", device_id)
        return

    _LOGGER.debug("Triggering device pairing flow for hub device %s (entry: %s)", 
                  device_id, config_entry_id)

    # Trigger the config flow with the entry_id context to start pairing
    hass.async_create_task(
        hass.config_entries.flow.async_init(
            DOMAIN,
            context={"source": "config", "entry_id": config_entry_id},
            data=None,
        )
    )


async def async_get_actions(
    hass: HomeAssistant, device_id: str
) -> list[dict[str, Any]]:
    """List device actions for the given device.
    
    This is called by Home Assistant to determine what actions are available
    for this device. We return the "Add Devices" action for hub devices only.
    """
    domain_data = hass.data.get(DOMAIN, {})
    
    # Check if this device is a hub device (bridge itself)
    for entry_id, entry_data in domain_data.items():
        if entry_data.get("hub_device_id") == device_id:
            # This is a hub device, add the "Add Devices" action
            return [
                {
                    CONF_DEVICE_ID: device_id,
                    CONF_DOMAIN: DOMAIN,
                    CONF_TYPE: ACTION_ADD_DEVICES,
                }
            ]

    return []


async def async_get_action_capabilities(
    hass: HomeAssistant, config: dict[str, Any]
) -> dict[str, vol.Schema]:
    """Get the capabilities of a device action."""
    action_type = config[CONF_TYPE]

    if action_type == ACTION_ADD_DEVICES:
        return {"extra_fields": vol.Schema({})}

    return {}
