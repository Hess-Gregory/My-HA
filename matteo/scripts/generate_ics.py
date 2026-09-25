#!/usr/bin/env python3
# /config/matteo/scripts/generate_ics.py — agenda partagé du planning Matteo (lecture seule, format .ics)
# Écrit /config/www/matteo/planning_<jeton>.ics  ->  https://<ha>/local/matteo/planning_<jeton>.ics
import os, sys, secrets
from datetime import datetime, date, timedelta, timezone
sys.path.insert(0, "/config/matteo/scripts")
from matteo_common import load, entry_start, lieu_label

TOKEN_FILE = "/config/matteo/data/ics_token"
OUT_DIR = "/config/www/matteo"


# Échappement des caractères spéciaux du format iCalendar.
def esc(s):
    return str(s).replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\n", "\\n")


# 'JJ/MM/AAAA' -> date.
def d(s):
    return datetime.strptime(s, "%d/%m/%Y").date()


LOCAL_CAL = "/config/.storage/local_calendar.matteo.ics"   # calendrier « Matteo » des vues Semaine/Mois


# Recopie les périodes de garde dans le calendrier local HA « Matteo ».
def ecrire_calendrier_local(L):
    """Copie les périodes de garde (pas les anniversaires) dans le calendrier local « Matteo » de HA.
    Les événements ajoutés à la main dans ce calendrier sont conservés."""
    import re
    ev, cur = [], None
    for x in L:
        if x == "BEGIN:VEVENT": cur = [x]
        elif cur is not None:
            cur.append(x)
            if x == "END:VEVENT":
                if not any(y.startswith("UID:ev-") for y in cur): ev += cur
                cur = None
    garder = []
    if os.path.exists(LOCAL_CAL):
        txt = open(LOCAL_CAL, encoding="utf-8").read().replace("\r\n", "\n")
        for blk in re.findall(r"BEGIN:VEVENT\n.*?\nEND:VEVENT", txt, re.S):
            if "@planning-matteo" not in blk: garder += blk.split("\n")
    out = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Planning Matteo//HA//FR"] + garder + ev + ["END:VCALENDAR"]
    tmp = LOCAL_CAL + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="") as f:
        f.write("\r\n".join(out) + "\r\n")
    os.replace(tmp, LOCAL_CAL)


# Construit l'agenda .ics (périodes + anniversaires), l'écrit dans www/matteo, met à jour le calendrier
# local puis génère la page imprimable et le CSV.
def main():
    if not os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "w") as f:
            f.write(secrets.token_urlsafe(18))
    token = open(TOKEN_FILE).read().strip()
    c = load(); data = c["data"]
    act = {k: e for k, e in data.items() if e.get("date_du") and e.get("date_au") and not e.get("hide") and e.get("visible_in_ui", True)}
    parts = [(d(e["date_du"]), d(e["date_au"])) for k, e in act.items() if k.startswith("VAC_")]
    nom = {"A": "Grégory", "B": "Élodie / Olivier", "C": "Grégory (retour non respecté)", "D": "Élodie / Olivier (rattrapage)"}
    now = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Planning Matteo//HA//FR", "CALSCALE:GREGORIAN",
         "X-WR-CALNAME:Planning Matteo", "X-WR-TIMEZONE:Europe/Brussels", "REFRESH-INTERVAL;VALUE=DURATION:PT6H"]
    for k, e in sorted(act.items(), key=lambda kv: d(kv[1]["date_du"])):
        du, au = d(e["date_du"]), d(e["date_au"])
        tc = e.get("type_action_code", "")
        if tc in ("WEEKEND_GREGORY", "WEEKEND_ELODIE") and any(a <= du and au <= b for a, b in parts):
            continue
        papa = e.get("code_aller") in ("A", "B") or "GREGORY" in tc
        titre = "Matteo chez " + ("papa" if papa else "maman")
        if k.startswith("VAC_"):
            titre += " — " + e.get("vac_nom", "congé")
        elif tc not in ("WEEKEND_GREGORY", "WEEKEND_ELODIE"):
            titre += " — " + e.get("type_action", "")
        desc = []
        if e.get("code_aller") in nom: desc.append("Aller : " + nom[e["code_aller"]] + (" — " + lieu_label(e.get("lieu_aller")) if e.get("code_aller") == "A" else ""))
        if e.get("code_retour") in nom: desc.append("Retour : " + nom[e["code_retour"]] + (" — " + lieu_label(e.get("lieu_retour")) if e.get("code_retour") in ("A", "C") else ""))
        L += ["BEGIN:VEVENT", "UID:%s@planning-matteo" % k, "DTSTAMP:" + now,
              "DTSTART;VALUE=DATE:" + du.strftime("%Y%m%d"), "DTEND;VALUE=DATE:" + (au + timedelta(days=1)).strftime("%Y%m%d"),
              "SUMMARY:" + esc(titre), "DESCRIPTION:" + esc("\n".join(desc)), "TRANSP:TRANSPARENT", "END:VEVENT"]
    ans = sorted({d(e["date_du"]).year for e in act.values()})
    for ev in c.get("evenements", []):
        if not ev.get("jour"):
            continue
        for y in ans:
            try:
                j = date(y, int(ev["jour"][0:2]), int(ev["jour"][3:5]))
            except ValueError:
                continue
            t = (ev.get("icone", "") + " " + ("Anniversaire de " if ev.get("type") == "anniversaire" else "") + ev["nom"]).strip()
            L += ["BEGIN:VEVENT", "UID:ev-%s-%d@planning-matteo" % (ev["nom"].encode("utf-8").hex(), y), "DTSTAMP:" + now,
                  "DTSTART;VALUE=DATE:" + j.strftime("%Y%m%d"), "DTEND;VALUE=DATE:" + (j + timedelta(days=1)).strftime("%Y%m%d"),
                  "SUMMARY:" + esc(t), "TRANSP:TRANSPARENT", "END:VEVENT"]
    L.append("END:VCALENDAR")
    os.makedirs(OUT_DIR, exist_ok=True)
    for f in os.listdir(OUT_DIR):
        if f.startswith("planning_") and f != "planning_%s.ics" % token:
            os.remove(os.path.join(OUT_DIR, f))
    with open(os.path.join(OUT_DIR, "planning_%s.ics" % token), "w", encoding="utf-8", newline="") as f:
        f.write("\r\n".join(L) + "\r\n")
    print("/local/matteo/planning_%s.ics" % token)
    ecrire_calendrier_local(L)
    import generate_print
    print(generate_print.build())


if __name__ == "__main__":
    main()
