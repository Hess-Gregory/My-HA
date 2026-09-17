def parse_line(line: str) -> dict:
    parts = line.split(";")
    tag = parts[0].upper()
    parsed = {"tag": tag, "raw": line}

    try:
        if tag == "ALARM":
            parsed.update(parse_alarm(parts))
        elif tag == "STATUS":
            parsed.update(parse_status(parts))
        elif tag == "RSTATE":
            parsed.update(parse_rstate(parts))
        elif tag == "EVENT":
            parsed.update({"event": parts[1:]})
        elif tag == "LIST":
            parsed.update(parse_list(parts))
        elif tag == "RESULT":
            parsed.update(parse_result(parts))
    except Exception as e:
        parsed["error"] = str(e)

    return parsed


def parse_alarm(fields):
    return {
        "type_code": fields[1],
        "device_id": fields[2].upper(),
        "code": fields[3] if len(fields) > 3 else None,
    }


def parse_status(fields):
    parsed = {
        "type_code": fields[1] if len(fields) > 1 else None,
        "device_id": fields[2].upper() if len(fields) > 2 else None,
        "battery": fields[4] if len(fields) > 4 else None,
        "signal": fields[5] if len(fields) > 5 else None,
    }
    if len(fields) > 8:
        try:
            loc_noise = float(fields[7])
            loc_rssi = float(fields[8])
            parsed["loc_noise"] = loc_noise
            parsed["loc_rssi"] = loc_rssi
        except ValueError:
            pass
    if len(fields) > 10:
        parsed["setting_byte_1"] = _maybe_int(fields[10])
    if len(fields) > 11:
        parsed["setting_byte_2"] = _maybe_int(fields[11])
    return parsed


def parse_rstate(fields):
    out = {"device_id": fields[1].upper()}
    for kv in fields[2:]:
        if "=" in kv:
            k, v = kv.split("=")
            out[k] = v
    return out


def parse_list(fields):
    return {
        "sequence": fields[1] if len(fields) > 1 else None,
        "slot": fields[2] if len(fields) > 2 else None,
        "device_id": fields[3].upper() if len(fields) > 3 else None,
        "type_code": fields[4] if len(fields) > 4 else None,
    }


def parse_result(fields):
    return {
        "status": fields[1] if len(fields) > 1 else None,
        "code": fields[2] if len(fields) > 2 else None,
    }


def _maybe_int(value):
    try:
        return int(str(value))
    except (ValueError, TypeError):
        return None
