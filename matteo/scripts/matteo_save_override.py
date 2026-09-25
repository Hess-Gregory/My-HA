#!/usr/bin/env python3
# /config/matteo/scripts/matteo_save_override.py
# Crée ou met à jour une ligne du planning Matteo (week-end, part de vacances, exception, pivot…)
# Args : KEY TYPE_CODE TYPE_LABEL GARDIEN ACTEUR_ALLER ACTEUR_ALLER_CODE ACTEUR_RETOUR ACTEUR_RETOUR_CODE
#        CODE_ALLER CODE_RETOUR MOTIF1_CODE MOTIF1 MOTIF_LIBRE REPORT_DATE REPORT_AGREED USER
#        MOTIF2_CODE MOTIF2 DATE_DU DATE_AU REPORT_DATE_ALLER ECHANGE_AVEC NOTES LIEU_ALLER LIEU_RETOUR MOTIF_LIEU_CODE MOTIF_LIEU
import sys
from datetime import datetime, timedelta
sys.path.insert(0, "/config/matteo/scripts")
from matteo_common import (masques, load, save, now_iso, type_labels, ddmmyyyy_to_date, entry_start,
                           weekend_defaut, reopen, link, WE_PAPA, WE_MAMAN)


# Argument n° i de la ligne de commande, ou valeur par défaut s'il est absent.
def arg(a, i, d=""):
    return a[i] if len(a) > i else d


# Point d'entrée : crée / met à jour la ligne `key` avec les valeurs du formulaire (voir en-tête).
def main(a):
    if len(a) < 16:
        print("Usage: voir en-tête"); sys.exit(1)
    key, type_code, type_label, gardien = a[0], a[1], a[2], a[3]
    acteur_aller, acteur_aller_code, acteur_retour, acteur_retour_code = a[4], a[5], a[6], a[7]
    code_aller, code_retour, m1_code, m1, libre = a[8], a[9], a[10], a[11], a[12]
    report_date, user = a[13], a[15]
    m2_code, m2 = arg(a, 16, "NONE"), arg(a, 17, "Aucun")
    du_s, au_s, report_aller = arg(a, 18), arg(a, 19), arg(a, 20)
    ech = arg(a, 21)
    notes = arg(a, 22, None)
    lieu_a, lieu_r = arg(a, 23, None), arg(a, 24, None)
    ml_code, ml = arg(a, 25, None), arg(a, 26, "Aucun")

    content = load(); data = content["data"]
    ts = now_iso()

    # Période de vacances : crée la période + ses parts (2, ou 4 pour l'été)
    if type_code == "PERIODE_VAC":
        du, au = ddmmyyyy_to_date(du_s), ddmmyyyy_to_date(au_s)
        nom = libre.strip() or "Période de vacances"
        content["vacances"].append({"nom": nom, "segments": [{"debut": du.isoformat(), "fin": au.isoformat()}]})
        n = 4 if ("été" in nom.lower() or "ete" in nom.lower()) else 2
        for i in range(1, n + 1):
            k = "VAC_%s_%d" % (du.isoformat(), i)
            data.setdefault(k, vac_part(k, nom, du.isoformat(), au.isoformat(), i, n, ts))
        save(content); print("Période créée:", nom, n, "parts"); return

    entry = data.get(key, {})
    prev_ref, prev_ref_a = entry.get("report_date", ""), entry.get("report_date_aller", "")
    prev_ech = entry.get("echange_avec", "")
    orig_type = entry.get("type_origine") or entry.get("type_action_code", "")

    if du_s and au_s:
        date_du, date_au = du_s, au_s
    else:
        d = datetime.strptime(key, "%d-%m-%Y").date()
        date_du, date_au = d.strftime("%d/%m/%Y"), (d + timedelta(days=2)).strftime("%d/%m/%Y")

    is_vac = key.startswith("VAC_")
    entry.update({
        "date_key": key, "date_du": date_du, "date_au": date_au,
        "type_action": type_label, "type_action_code": type_code,
        "subtype": "Vacances" if is_vac or type_code.startswith("VAC_") else ("Pivot" if type_code == "PIVOT" else "Weekend"),
        "site": "Engis" if "GREGORY" in type_code else ("Maurage" if "ELODIE" in type_code else ""),
        "gardien_force": gardien,
        "acteur_aller": acteur_aller, "acteur_aller_code": acteur_aller_code,
        "acteur_retour": acteur_retour, "acteur_retour_code": acteur_retour_code,
        "code_aller": code_aller, "code_retour": code_retour,
        "motif-1": m1, "motif-1_code": m1_code, "motif_libre": libre,
        "motif-2": m2, "motif-2_code": m2_code,
        "motif_aller": "Compensation (aller fait par Élodie / Olivier)" if code_aller == "B" else "",
        "report_date": report_date if code_retour == "D" else "",
        "report_date_aller": report_aller if code_aller == "B" else "",
    })
    if notes is not None:
        entry["notes"] = notes.strip()
    if lieu_a is not None:   # lieu où Grégory va chercher Matteo (par défaut Maurage)
        entry["lieu_aller"] = (lieu_a.strip() or "MAURAGE") if code_aller == "A" else ""
    if lieu_r is not None:   # lieu où Grégory ramène Matteo (par défaut Maurage)
        entry["lieu_retour"] = (lieu_r.strip() or "MAURAGE") if code_retour in ("A", "C") else ""
    if ml_code is not None:  # motif obligatoire quand le lieu n'est pas Maurage
        diff = entry.get("lieu_aller") not in ("", "MAURAGE", None) or entry.get("lieu_retour") not in ("", "MAURAGE", None)
        entry["motif_lieu_code"], entry["motif_lieu"] = (ml_code, ml) if diff and ml_code != "NONE" else ("NONE", "Aucun")
    entry["reason_code"] = "BANK_PLUS_1" if code_retour == "C" else ("COMPENSATION" if code_retour == "D" or code_aller == "B" else "NONE")
    entry["bank_delta"] = (1 if code_retour == "C" else 0) - (1 if code_retour == "D" else 0) - (1 if code_aller == "B" else 0)

    entry["created_at"] = entry.get("created_at", ts)
    entry["modified_at"] = ts
    entry["modification_count"] = entry.get("modification_count", 0) + 1
    entry.setdefault("audit", []).append({"user": user, "action": "upsert", "at": ts, "note": "enregistré via le dashboard"})
    entry["hide"] = entry.get("hide", False)
    entry["visible_in_ui"] = entry.get("visible_in_ui", True)
    data[key] = entry

    # Liens de rattrapage (retour D) et de compensation (aller fait par Élodie)
    if prev_ref != entry["report_date"]:
        reopen(data, prev_ref, key)
    if prev_ref_a != entry["report_date_aller"]:
        reopen(data, prev_ref_a, key)
    link(data, entry["report_date"], key, user, ts, "rattrapé (retour) par")
    link(data, entry["report_date_aller"], key, user, ts, "compensé (aller) par")

    # Dettes de Grégory : retour D ou aller B d'Élodie / Olivier sans trajet C à solder -> Grégory leur doit un trajet.
    # Un retour C (Grégory fait leur tour) solde d'abord la plus ancienne de ces dettes (rattrapage par Grégory).
    MASQ = masques(data)

    def unites(k2):
        e2 = data.get(k2, {})
        if e2.get("hide") or k2 in MASQ:
            return 0
        u = (1 if e2.get("code_retour") == "D" and not e2.get("report_date") else 0) + \
            (1 if e2.get("code_aller") == "B" and not e2.get("report_date_aller") else 0)
        return u - len([x for x in e2.get("soldee_par", []) if x != key])
    old_sd = entry.get("solde_dette", "")
    if old_sd and old_sd in data:
        data[old_sd]["soldee_par"] = [x for x in data[old_sd].get("soldee_par", []) if x != key]
    entry["solde_dette"] = ""
    if code_retour == "C":
        dettes = sorted([k2 for k2 in data if k2 != key and unites(k2) > 0],
                        key=lambda k2: entry_start(data[k2]) or datetime.max.date())
        if dettes:
            d2 = dettes[0]
            data[d2].setdefault("soldee_par", []).append(key)
            entry["solde_dette"] = d2
            entry["reason_code"] = "RATTRAPAGE_GREGORY"

    # Échange croisé : le week-end choisi passe chez l'autre parent (et inversement à l'annulation)
    labels = type_labels()
    def marque(e2, note):
        e2["modified_at"] = ts; e2["modification_count"] = e2.get("modification_count", 0) + 1
        e2.setdefault("audit", []).append({"user": user, "action": "echange", "at": ts, "note": note})
    def restaure(k2):
        e2 = data.get(k2)
        if not e2 or e2.get("echange_avec") != key:
            return
        o2 = e2.get("type_origine") or e2.get("type_action_code")
        s2 = entry_start(e2)
        if o2 in (WE_PAPA, WE_MAMAN) and s2:
            reopen(data, e2.get("report_date", ""), k2); reopen(data, e2.get("report_date_aller", ""), k2)
            e2.update(weekend_defaut(s2, o2 == WE_PAPA, labels))
        e2.pop("echange_avec", None); e2.pop("type_origine", None); marque(e2, "échange annulé avec " + key)
    if prev_ech and (type_code != "ECHANGE" or prev_ech != ech):
        restaure(prev_ech)
    if type_code == "ECHANGE" and ech and ech in data and ech != key:
        e2 = data[ech]; s2 = entry_start(e2)
        e2["type_origine"] = e2.get("type_origine") or e2.get("type_action_code")
        reopen(data, e2.get("report_date", ""), ech); reopen(data, e2.get("report_date_aller", ""), ech)
        e2.update(weekend_defaut(s2, gardien != "Papa", labels))
        e2.update({"type_action_code": "ECHANGE", "type_action": type_label, "echange_avec": key,
                   "motif-1_code": m1_code, "motif-1": m1, "motif_libre": libre})
        marque(e2, "échange croisé avec " + key)
        entry["echange_avec"] = ech; entry["type_origine"] = orig_type
    elif type_code != "ECHANGE":
        entry.pop("echange_avec", None); entry.pop("type_origine", None)

    # Changement permanent : inverse la garde de toutes les lignes à partir de la date pivot
    if type_code == "PIVOT" and not entry.get("pivot_applied"):
        start = ddmmyyyy_to_date(date_du)
        labels = type_labels(); n = 0
        for k, e in data.items():
            if k == key or k.startswith("VAC_") or k.startswith("PIVOT_"):
                continue
            s = entry_start(e)
            if not s or s < start or e.get("type_action_code") not in (WE_PAPA, WE_MAMAN):
                continue
            papa = e.get("type_action_code") == WE_MAMAN   # inversion
            reopen(data, e.get("report_date", ""), k); reopen(data, e.get("report_date_aller", ""), k)
            e.update(weekend_defaut(s, papa, labels))
            e["modified_at"] = ts; e["modification_count"] = e.get("modification_count", 0) + 1
            e.setdefault("audit", []).append({"user": user, "action": "pivot", "at": ts, "note": "garde inversée par le pivot " + key})
            n += 1
        entry["pivot_applied"] = True
        content["pivots"].append({"date": start.isoformat(), "key": key, "at": ts})
        print("Pivot appliqué :", n, "week-ends inversés")

    save(content)
    print("Saved:", key)


# Nouvelle part de congé « à définir » (dates vides, à fixer via Modifier).
def vac_part(k, nom, debut, fin, i, n, ts):
    return {
        "date_key": k, "date_du": "", "date_au": "", "type_action": "", "type_action_code": "",
        "gardien_force": "", "acteur_aller": "", "acteur_aller_code": "", "acteur_retour": "",
        "acteur_retour_code": "", "code_aller": "", "code_retour": "",
        "motif-1": "Aucun", "motif-1_code": "NONE", "motif-2": "Aucun", "motif-2_code": "NONE",
        "motif_libre": "", "motif_aller": "", "report_date": "", "report_date_aller": "",
        "report_agreed": False, "rattrape_par": "", "bank_delta": 0, "reason_code": "NONE",
        "subtype": "Vacances", "site": "",
        "vac_nom": nom, "vac_debut": debut, "vac_fin": fin, "vac_part": i, "vac_parts": n,
        "created_at": ts, "modified_at": ts, "modification_count": 0,
        "audit": [{"user": "script", "action": "create", "at": ts, "note": "part de congé à définir"}],
        "hide": False, "visible_in_ui": True,
    }


if __name__ == "__main__":
    main(sys.argv[1:])
