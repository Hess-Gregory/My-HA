#!/usr/bin/env python3
# /config/matteo/scripts/generate_matteo_planning.py
# Complète le planning jusqu'à END_DATE SANS rien écraser : seules les dates manquantes sont ajoutées.
# Respecte l'alternance de référence, les changements permanents (pivots) et crée les parts de congés.
import sys
from datetime import date, datetime, timedelta
sys.path.insert(0, "/config/matteo/scripts")
from matteo_common import load, save, now_iso, type_labels, weekend_defaut

REF_FRIDAY = date(2026, 9, 18)          # week-end Papa de référence
END_DATE = date(2028, 12, 31)

# Congés officiels Fédération Wallonie-Bruxelles 2026-2027
VACANCES = [
    {"nom": "Vacances d'automne (Toussaint)", "segments": [{"debut": "2026-10-19", "fin": "2026-10-30"}]},
    {"nom": "Vacances d'hiver (Noël)", "segments": [{"debut": "2026-12-21", "fin": "2027-01-01"}]},
    {"nom": "Vacances de détente (Carnaval)", "segments": [{"debut": "2027-02-22", "fin": "2027-03-05"}]},
    {"nom": "Vacances de printemps (Pâques)", "segments": [{"debut": "2027-04-26", "fin": "2027-05-07"}]},
    {"nom": "Vacances d'été", "segments": [{"debut": "2027-07-03", "fin": "2027-08-29"}]},
    # 2027-2028 (FWB, publié par la RTBF) — fin de l'été 2028 à confirmer
    {"nom": "Vacances d'automne (Toussaint) 2027", "segments": [{"debut": "2027-10-25", "fin": "2027-11-05"}]},
    {"nom": "Vacances d'hiver (Noël) 2027", "segments": [{"debut": "2027-12-27", "fin": "2028-01-07"}]},
    {"nom": "Vacances de détente (Carnaval) 2028", "segments": [{"debut": "2028-02-28", "fin": "2028-03-10"}]},
    {"nom": "Vacances de printemps (Pâques) 2028", "segments": [{"debut": "2028-05-01", "fin": "2028-05-12"}]},
    {"nom": "Vacances d'été 2028", "segments": [{"debut": "2028-07-08", "fin": "2028-08-27"}]},
]


# Garde par défaut d'un vendredi : alternance depuis REF_FRIDAY, inversée par chaque pivot passé.
def papa_par_defaut(fri, pivots):
    papa = ((fri - REF_FRIDAY).days // 7) % 2 == 0
    for p in pivots:
        if fri >= date.fromisoformat(p["date"]):
            papa = not papa
    return papa


# 2e dimanche du mois (fêtes des mères / pères).
def _deuxieme_dimanche(annee, mois):
    d = date(annee, mois, 1)
    d += timedelta(days=(6 - d.weekday()) % 7)
    return d + timedelta(days=7)


# Vrai si le week-end n'a jamais été modifié à la main (on ne force jamais une saisie manuelle).
def _auto(e):
    """Week-end ordinaire jamais modifie a la main (on ne touche pas aux saisies manuelles)."""
    return e and e.get("type_action_code") in ("WEEKEND_GREGORY", "WEEKEND_ELODIE") and not any(
        a.get("action") in ("upsert", "pivot") for a in e.get("audit", []))


# Force un week-end chez papa / maman pour une fête (type INVERSION + motif).
def _forcer(data, k, papa, motif_code, motif, labels, ts):
    e = data[k]; fri = datetime.strptime(k, "%d-%m-%Y").date()
    e.update(weekend_defaut(fri, papa, labels))
    e.update({"type_action_code": "INVERSION", "type_action": labels.get("INVERSION", "Exceptionnel Ponctuel (Inverser ce week-end / Jour)"),
              "motif-1_code": motif_code, "motif-1": motif, "modified_at": ts,
              "modification_count": e.get("modification_count", 0) + 1})
    e.setdefault("audit", []).append({"user": "script", "action": "fete", "at": ts, "note": motif})


# Fêtes des pères / mères chez le bon parent, par échange avec le week-end suivant si besoin.
def appliquer_fetes(c, labels, ts):
    """Fete des peres (2e dimanche de juin) chez papa, fete des meres (2e dimanche de mai) chez maman.
    Si l une tombe chez le mauvais parent : on echange avec le week-end suivant ; si les deux sont inversees : on echange les deux."""
    data = c["data"]; faits = []
    for an in range(REF_FRIDAY.year, END_DATE.year + 1):
        kp = (_deuxieme_dimanche(an, 6) - timedelta(days=2)).strftime("%d-%m-%Y")
        km = (_deuxieme_dimanche(an, 5) - timedelta(days=2)).strftime("%d-%m-%Y")
        ep, em = data.get(kp), data.get(km)
        p_ko = _auto(ep) and ep["type_action_code"] == "WEEKEND_ELODIE"
        m_ko = _auto(em) and em["type_action_code"] == "WEEKEND_GREGORY"
        if p_ko and m_ko:
            _forcer(data, kp, True, "FETE_PERES", "Fête des Pères", labels, ts)
            _forcer(data, km, False, "FETE_MERES", "Fête des Mères", labels, ts); faits.append(kp + "<->" + km)
        elif p_ko:
            kn = (datetime.strptime(kp, "%d-%m-%Y").date() + timedelta(days=7)).strftime("%d-%m-%Y")
            _forcer(data, kp, True, "FETE_PERES", "Fête des Pères", labels, ts)
            if _auto(data.get(kn)): _forcer(data, kn, False, "FETE_PERES", "Fête des Pères (échange)", labels, ts)
            faits.append(kp + "->" + kn)
        elif m_ko:
            kn = (datetime.strptime(km, "%d-%m-%Y").date() + timedelta(days=7)).strftime("%d-%m-%Y")
            _forcer(data, km, False, "FETE_MERES", "Fête des Mères", labels, ts)
            if _auto(data.get(kn)): _forcer(data, kn, True, "FETE_MERES", "Fête des Mères (échange)", labels, ts)
            faits.append(km + "->" + kn)
    return faits


# Ajoute congés et vendredis manquants jusqu'à END_DATE, applique les fêtes puis sauvegarde.
def main():
    c = load(); data = c["data"]; ts = now_iso(); labels = type_labels(); added = 0
    noms = {v["nom"] for v in c["vacances"]}
    for v in VACANCES:
        if v["nom"] not in noms:
            c["vacances"].append(v)
    for v in c["vacances"]:
        seg = v["segments"][0]
        if not seg.get("debut"):
            continue
        n = 4 if ("été" in v["nom"].lower()) else 2
        for i in range(1, n + 1):
            k = "VAC_%s_%d" % (seg["debut"], i)
            if k not in data:
                from matteo_save_override import vac_part
                data[k] = vac_part(k, v["nom"], seg["debut"], seg["fin"], i, n, ts); added += 1
    fri = REF_FRIDAY
    while fri <= END_DATE:
        k = fri.strftime("%d-%m-%Y")
        if k not in data:
            e = {"date_key": k, "date_du": fri.strftime("%d/%m/%Y"), "date_au": (fri + timedelta(days=2)).strftime("%d/%m/%Y")}
            e.update(weekend_defaut(fri, papa_par_defaut(fri, c["pivots"]), labels))
            e.update({"created_at": ts, "modified_at": ts, "modification_count": 0, "hide": False, "visible_in_ui": True,
                      "audit": [{"user": "script", "action": "create", "at": ts, "note": "auto generation"}]})
            data[k] = e; added += 1
        fri += timedelta(weeks=1)
    f = appliquer_fetes(c, labels, ts)
    save(c); print("Ajouts :", added, "| fetes :", f or "rien a changer")


if __name__ == "__main__":
    main()
