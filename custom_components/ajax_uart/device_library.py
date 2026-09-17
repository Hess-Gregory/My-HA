"""Helpers for loading the Ajax device library mapping."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, Iterable, Mapping

LIB_PATH = Path(__file__).with_name("device_library.json")


class DeviceLibrary:
    """Load and expose accessors for device library definitions."""

    def __init__(self) -> None:
        with LIB_PATH.open("r", encoding="utf-8") as fh:
            data: Dict[str, Any] = json.load(fh)
        self._raw = data
        self._global_codes = data.get("global", {}).get("codes", {})
        self._devices = data.get("devices", {})
        self._params_templates = data.get("params_templates", {})

    def device_model(self, type_code: str | int | None) -> str | None:
        """Return the human friendly model name for a device type."""
        if type_code is None:
            return None
        return self._devices.get(str(type_code), {}).get("model")

    def merged_codes(self, type_code: str | int | None) -> Dict[str, Dict[str, Any]]:
        """Return merged mapping of alarm codes."""
        result: Dict[str, Dict[str, Any]] = {}
        result.update(self._global_codes)
        if type_code is not None:
            device_section = self._devices.get(str(type_code), {}).get("codes", {})
            result.update(device_section)
        return result

    def interpret_alarm(
        self, type_code: str | int | None, code: str | int | None
    ) -> Dict[str, Any] | None:
        """Return action spec for alarm code."""
        if code is None:
            return None
        merged = self.merged_codes(type_code)
        return merged.get(str(code))

    def entity_specs(self, type_code: str | int | None) -> Dict[str, Dict[str, Any]]:
        """Build entity specs for the given device type."""

        entities: Dict[str, Dict[str, Any]] = {}
        for spec in self.merged_codes(type_code).values():
            if not isinstance(spec, Mapping):
                continue
            if spec.get("target") != "device":
                continue
            entity_key = spec.get("entity")
            if not entity_key:
                continue
            entry = entities.setdefault(
                entity_key,
                {
                    "entity": entity_key,
                    "platform": spec.get("platform"),
                    "device_class": spec.get("device_class"),
                    "category": spec.get("category"),
                    "key": spec.get("key"),
                },
            )
            # Keep reference to all specs for this entity.
            entry.setdefault("actions", []).append(spec)
        return entities

    def get_device_entry(self, type_code: str | int | None) -> Dict[str, Any]:
        """Return raw device library entry."""
        if type_code is None:
            return {}
        return self._devices.get(str(type_code), {})

    def params_template_name(self, type_code: str | int | None) -> str | None:
        """Return the parameter template name for the device type, if any."""
        if type_code is None:
            return None
        params = self._devices.get(str(type_code), {}).get("params")
        if not isinstance(params, Mapping):
            return None
        template = params.get("template")
        if template and template in self._params_templates:
            return template
        return None

    def params_template(self, template_name: str | None) -> Dict[str, Any]:
        """Return the raw parameter template definition."""
        if not template_name:
            return {}
        return self._params_templates.get(template_name, {})

    def param_entities(self, type_code: str | int | None) -> Iterable[Dict[str, Any]]:
        """Yield UI entity specs for parameter controls."""
        template_name = self.params_template_name(type_code)
        if not template_name:
            return []
        template = self._params_templates.get(template_name, {})
        byte_defs = {
            item.get("name"): item
            for item in template.get("bytes", [])
            if isinstance(item, Mapping)
        }
        entities = []
        for spec in template.get("ui", {}).get("entities", []):
            entity_key = spec.get("entity")
            byte_def = byte_defs.get(entity_key)
            if not entity_key or not byte_def:
                continue
            entry = {
                "entity": entity_key,
                "name": spec.get("name", entity_key.replace("_", " ").title()),
                "platform": spec.get("platform", "select"),
                "category": spec.get("category"),
                "options": byte_def.get("options", {}),
                "template": template_name,
            }
            entities.append(entry)
        return entities

    def param_order(self, type_code: str | int | None) -> list[str]:
        """Return the ordered parameter names for the given device type."""
        entry = self.get_device_entry(type_code)
        ordered: list[tuple[int, str]] = []
        for key, value in entry.items():
            if not key.startswith("setting_byte_"):
                continue
            try:
                index = int(key.rsplit("_", 1)[1])
            except (ValueError, IndexError):
                continue
            if value is None:
                continue
            ordered.append((index, str(value)))
        ordered.sort(key=lambda item: item[0])
        return [name for _, name in ordered]

    def build_params_command(
        self, template_name: str, device_id: str, byte_values: list[str | int]
    ) -> str:
        """Format the UART command for parameter update."""
        template = self.params_template(template_name)
        command_pattern = template.get("command")
        if not command_pattern:
            raise ValueError(f"No command template for {template_name}")
        mapping: Dict[str, Any] = {"DevID": device_id}
        for idx, value in enumerate(byte_values, start=1):
            mapping[f"Byte{idx}"] = value
        return command_pattern.format(**mapping)


DEVICE_LIBRARY = DeviceLibrary()
