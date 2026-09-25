#!/usr/bin/env python3
# /config/matteo/scripts/matteo_delete_override.py — effacement définitif d'une ligne (outil d'administration)
import sys
sys.path.insert(0, "/config/matteo/scripts")
from matteo_common import load, save, reopen

if len(sys.argv) < 2:
    print("Usage: matteo_delete_override.py KEY"); sys.exit(1)
key = sys.argv[1]
c = load(); data = c["data"]
if key in data:
    e = data.pop(key)
    reopen(data, e.get("report_date", ""), key); reopen(data, e.get("report_date_aller", ""), key)
    save(c); print("Deleted:", key)
else:
    print("No entry for", key)
