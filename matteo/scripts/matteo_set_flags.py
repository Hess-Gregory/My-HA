#!/usr/bin/env python3
# /config/matteo/scripts/matteo_set_flags.py — Supprimer (hide) / Suspendre (visible_in_ui)
# Usage : matteo_set_flags.py KEY HIDE VISIBLE [USER]
import sys
sys.path.insert(0, "/config/matteo/scripts")
from matteo_common import load, save, now_iso, reopen


# Interprète 'true/false', 'on/off', '1/0', 'oui' comme booléen.
def b(v):
    return str(v).strip().lower() in ("1", "true", "on", "yes", "oui")


# Applique hide / visible_in_ui à une ligne ; une suppression défait ses liens de banque.
def main(a):
    if len(a) < 3:
        print("Usage: KEY HIDE VISIBLE [USER]"); sys.exit(1)
    key, hide, vis = a[0], b(a[1]), b(a[2]); user = a[3] if len(a) > 3 else "ha"
    c = load(); data = c["data"]
    if key not in data:
        print("No entry for", key); return
    e = data[key]
    oh, ov = bool(e.get("hide", False)), bool(e.get("visible_in_ui", True))
    if oh == hide and ov == vis:
        print("Unchanged:", key); return
    action = "delete" if hide and not oh else ("restore" if not hide and oh else ("enable" if vis else "disable"))
    ts = now_iso()
    e["hide"], e["visible_in_ui"] = hide, vis
    if hide:  # une ligne supprimée ne solde plus rien : on rouvre ses dettes liées
        reopen(data, e.get("report_date", ""), key); reopen(data, e.get("report_date_aller", ""), key)
        sd = e.get("solde_dette", "")
        if sd in data:
            data[sd]["soldee_par"] = [x for x in data[sd].get("soldee_par", []) if x != key]
        for c2 in e.get("soldee_par", []):
            if c2 in data:
                data[c2]["solde_dette"] = ""
    e["modified_at"] = ts
    e["modification_count"] = e.get("modification_count", 0) + 1
    e.setdefault("audit", []).append({"user": user, "action": action, "at": ts, "note": "hide=%s visible_in_ui=%s" % (hide, vis)})
    save(c); print("OK", key, action)


if __name__ == "__main__":
    main(sys.argv[1:])
