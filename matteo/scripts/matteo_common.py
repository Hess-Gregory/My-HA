# /config/matteo/scripts/matteo_common.py — fonctions partagées du planning Matteo
import json, os, shutil
from datetime import datetime, date, timedelta
from zoneinfo import ZoneInfo

# =====================================================================
# Chemins et constantes
# =====================================================================
DATA_PATH = "/config/matteo/data/matteo_planning_overrides.json"
OPTIONS_PATH = "/config/matteo/data/matteo_options.json"
TZ = ZoneInfo("Europe/Brussels")

WE_PAPA, WE_MAMAN = "WEEKEND_GREGORY", "WEEKEND_ELODIE"
ALT_REF = date(2027, 1, 22)   # debut de l alternance stricte du retour (B, A, B, A...)


# Horodatage ISO 8601 à la seconde, fuseau Europe/Brussels (utilisé dans l'historique « audit »).
def now_iso():
    return datetime.now(TZ).replace(microsecond=0).isoformat()


# Charge le JSON source ; renvoie une structure vide valide si le fichier n'existe pas encore.
def load():
    if not os.path.exists(DATA_PATH):
        return {"data": {}, "vacances": [], "pivots": []}
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        c = json.load(f)
    c.setdefault("data", {}); c.setdefault("vacances", []); c.setdefault("pivots", [])
    return c


# 2e dimanche du mois (fêtes des mères = mai, des pères = juin, règle belge).
def _deuxieme_dimanche(y, m):
    d = date(y, m, 1)
    d += timedelta(days=(6 - d.weekday()) % 7)
    return d + timedelta(days=7)


# Liste (date, événement) d'une année : anniversaires à date fixe et fêtes calculées.
def evenements_annee(content, y):
    out = []
    for ev in content.get("evenements", []):
        if ev.get("jour"):
            try:
                d = date(y, int(ev["jour"][0:2]), int(ev["jour"][3:5]))
            except ValueError:
                continue
        elif ev.get("regle"):
            d = _deuxieme_dimanche(y, 5 if "Mères" in ev["nom"] else 6)
        else:
            continue
        out.append((d, ev))
    return out


# Attache à chaque ligne les événements de sa période (week-end : du lundi au dimanche,
# congé : toute la part) et indique s'ils sont fêtés chez le bon parent.
def recalc_evenements(content):
    """evenements_lies (liste) + evenement_ok (True = fêté chez le bon parent, False = chez l'autre)."""
    for k, e in content.get("data", {}).items():
        e.pop("evenements_lies", None); e.pop("evenement_ok", None)
        s = entry_start(e)
        try:
            f = ddmmyyyy_to_date(e.get("date_au", ""))
        except Exception:
            f = None
        if not s or not f:
            continue
        dmin = s if k.startswith("VAC_") else f - timedelta(days=6)
        papa = e.get("code_aller") in ("A", "B") or "GREGORY" in e.get("type_action_code", "")
        lies = []
        for y in sorted({dmin.year, f.year}):
            for d, ev in evenements_annee(content, y):
                if dmin <= d <= f:
                    ok = None if not ev.get("chez") else ((ev["chez"] == "papa") == papa)
                    lies.append({"nom": ev["nom"], "icone": ev.get("icone", "🎂"), "date": d.strftime("%d/%m/%Y"),
                                 "chez": ev.get("chez", ""), "ok": ok, "avant": d < s})
        if lies:
            e["evenements_lies"] = lies
            flags = [x["ok"] for x in lies if x["ok"] is not None]
            e["evenement_ok"] = all(flags) if flags else True


# SEULE fonction d'écriture du planning : recalcul des événements, alignement des retours,
# copie .bak, écriture atomique (.tmp puis remplacement) et régénération du moteur compact.
def save(content):
    recalc_evenements(content)
    aligner_retours(content.get("data", {}))
    if os.path.exists(DATA_PATH):
        try:
            shutil.copy2(DATA_PATH, DATA_PATH + ".bak")
        except Exception:
            pass
    tmp = DATA_PATH + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    os.replace(tmp, DATA_PATH)
    ecrire_moteur(content)


# Libellés des types de période (code -> libellé) depuis matteo_options.json.
def type_labels():
    try:
        with open(OPTIONS_PATH, "r", encoding="utf-8") as f:
            o = json.load(f)
        return {t["code"]: t["label"] for t in o.get("types_action", [])}
    except Exception:
        return {}


# Conversion 'JJ/MM/AAAA' -> date.
def ddmmyyyy_to_date(s):
    return datetime.strptime(s, "%d/%m/%Y").date()


# Date de début d'une ligne (None si la part de congé n'est pas encore datée).
def entry_start(e):
    """Date de début d'une entrée (None si non définie)."""
    try:
        return ddmmyyyy_to_date(e.get("date_du", ""))
    except Exception:
        return None


# Retour pré-rempli d'un week-end papa à sa création (corrigé ensuite par aligner_retours).
def retour_papa_par_defaut(fri):
    """Retour du dimanche d'un week-end Papa : a partir du 22/01/2027, alternance stricte un coup Elodie/Olivier (B), un coup Gregory (A).
    Avant cette date : semaine ISO multiple de 4 -> B, sinon A."""
    if fri >= ALT_REF:
        if ((fri - ALT_REF).days // 7 // 2) % 2 == 0:
            return {"acteur_retour": "Élodie / Olivier", "acteur_retour_code": "ELODIE", "code_retour": "B"}
        return {"acteur_retour": "Grégory", "acteur_retour_code": "GREGORY", "code_retour": "A"}
    if fri.isocalendar()[1] % 4 == 0:
        return {"acteur_retour": "Élodie / Olivier", "acteur_retour_code": "ELODIE", "code_retour": "B"}
    return {"acteur_retour": "Grégory", "acteur_retour_code": "GREGORY", "code_retour": "A"}


# Valeurs par défaut d'un week-end ordinaire : type, garde, site, aller (A chez papa) et retour.
def weekend_defaut(fri, papa, labels=None):
    labels = labels or type_labels()
    code = WE_PAPA if papa else WE_MAMAN
    e = {
        "type_action_code": code,
        "type_action": labels.get(code, "Weekend Gregory (Engis)" if papa else "Weekend Elodie (Maurage)"),
        "gardien_force": "Papa" if papa else "Maman",
        "site": "Engis" if papa else "Maurage",
        "subtype": "Weekend",
        "motif-1": "Aucun", "motif-1_code": "NONE",
        "motif-2": "Aucun", "motif-2_code": "NONE",
        "motif_libre": "", "motif_aller": "",
        "report_date": "", "report_date_aller": "", "report_agreed": False, "rattrape_par": "",
        "bank_delta": 0, "reason_code": "NONE",
    }
    if papa:
        e.update({"acteur_aller": "Grégory", "acteur_aller_code": "GREGORY", "code_aller": "A"})
        e.update(retour_papa_par_defaut(fri))
    else:
        e.update({"acteur_aller": "Aucun", "acteur_aller_code": "AUCUN", "code_aller": "E",
                  "acteur_retour": "Aucun (Chez Maman)", "acteur_retour_code": "AUCUN", "code_retour": "E"})
    return e


# Banque : rouvre la dette `ref` si elle avait été soldée par la ligne `key`.
def reopen(data, ref, key):
    """Rouvre une dette (trajet C) si elle était rattrapée par `key`."""
    if ref and ref in data and data[ref].get("rattrape_par") == key:
        data[ref]["report_agreed"] = False
        data[ref]["rattrape_par"] = ""


# Banque : marque la dette `ref` comme soldée par la ligne `key` (et trace l'action).
def link(data, ref, key, user, ts, note):
    if ref and ref in data and ref != key:
        r = data[ref]
        r["report_agreed"] = True
        r["rattrape_par"] = key
        r.setdefault("audit", []).append({"user": user, "action": "balance", "at": ts, "note": note + " " + key})


# ---------------------------------------------------------------------
# Moteur : fichier compact lu par Home Assistant (sensor.planning_matteo_engine)
# ---------------------------------------------------------------------
MOTEUR_PATH = "/config/matteo/data/matteo_moteur.json"
_RET = {"A": ("Grégory", "GREGORY"), "B": ("Élodie / Olivier", "ELODIE")}


# Conversion tolérante 'JJ/MM/AAAA' -> date (None si vide ou invalide).
def _d(s):
    try:
        return ddmmyyyy_to_date(s)
    except Exception:
        return None


# Week-ends ordinaires entièrement couverts par une part de congé active :
# ils sont cachés et leurs trajets ne comptent plus (banque, alternance, notifications).
def masques(data):
    """Week-ends ordinaires entièrement recouverts par une part de congé définie (active) : ils ne comptent plus."""
    parts = []
    for k, e in data.items():
        if k.startswith("VAC_") and not e.get("hide") and e.get("visible_in_ui", True):
            a, b = _d(e.get("date_du", "")), _d(e.get("date_au", ""))
            if a and b:
                parts.append((a, b))
    out = set()
    for k, e in data.items():
        if k.startswith("VAC_") or e.get("type_action_code") not in (WE_PAPA, WE_MAMAN):
            continue
        s, f = _d(e.get("date_du", "")), _d(e.get("date_au", ""))
        if s and f and any(a <= s and f <= b for a, b in parts):
            out.add(k)
    return out


# Vrai si la ligne a été enregistrée depuis le dashboard ou modifiée par un pivot.
def manuel(e):
    """Ligne enregistrée à la main (dashboard) : ses trajets ne sont jamais recalculés."""
    return any(a.get("action") in ("upsert", "pivot") for a in e.get("audit", []))


# Alternance stricte des retours : après A ou D -> tour d'Élodie / Olivier (B) ; après B ou C -> tour de Grégory (A).
# Ne touche que les lignes futures générées automatiquement ; les lignes manuelles servent de point d'appui.
def aligner_retours(data):
    """Alternance stricte des retours (un coup Grégory, un coup Élodie / Olivier) sur les lignes FUTURES générées
    automatiquement, en partant du dernier retour réel. Même règle que la suggestion du formulaire."""
    m = masques(data); today = datetime.now(TZ).date(); prev = None; n = 0
    seq = sorted((_d(e.get("date_du", "")), k) for k, e in data.items()
                 if not e.get("hide") and e.get("visible_in_ui", True) and k not in m
                 and e.get("code_retour") in ("A", "B", "C", "D") and _d(e.get("date_du", "")))
    for s, k in seq:
        e = data[k]
        if prev and s >= today and e["code_retour"] in ("A", "B") and not manuel(e):
            att = "B" if prev in ("A", "D") else "A"
            if e["code_retour"] != att:
                e["code_retour"] = att
                e["acteur_retour"], e["acteur_retour_code"] = _RET[att]
                n += 1
        prev = e["code_retour"]
    return n


# =====================================================================
# Lieux de prise en charge (défaut : Maurage) — libellés dans matteo_options.json > lieux
# =====================================================================
LIEU_DEFAUT = "MAURAGE"


def lieux_labels():
    try:
        with open(OPTIONS_PATH, "r", encoding="utf-8") as f:
            return {l["code"]: l["label"] for l in json.load(f).get("lieux", [])}
    except Exception:
        return {"MAURAGE": "Maurage (Maison Maman)"}


def lieu_label(code, labels=None):
    labels = labels or lieux_labels(); code = code or LIEU_DEFAUT
    return labels.get(code, code)


# Écrit data/matteo_moteur.json : une ligne par période avec uniquement les champs utiles au dashboard,
# plus les calculs faits une fois ici (masque, lieux, liens de banque neutralisés pour les week-ends masqués).
def ecrire_moteur(content):
    data = content.get("data", {}); m = masques(data); ws = []; LX = lieux_labels()
    for k, it in data.items():
        it = dict(it)
        if k in m:  # week-end recouvert par un congé : ses trajets et liens de banque ne comptent plus
            it.update({"report_date": "", "report_date_aller": "", "solde_dette": "", "soldee_par": []})
        else:       # un rattrapage porté par un week-end masqué n'existe plus : la dette redevient ouverte
            if it.get("rattrape_par") in m:
                it.update({"report_agreed": False, "rattrape_par": ""})
            if it.get("soldee_par"):
                it["soldee_par"] = [x for x in it["soldee_par"] if x not in m]
        ws.append({
            "date_key": k, "du": it.get("date_du", ""), "au": it.get("date_au", ""),
            "type": it.get("type_action", ""), "type_code": it.get("type_action_code", ""),
            "gardien": it.get("gardien_force", ""), "aller": it.get("acteur_aller", ""), "retour": it.get("acteur_retour", ""),
            "code_aller": it.get("code_aller", ""), "code_retour": it.get("code_retour", ""),
            "motif": it.get("motif-1", "Aucun"), "motif_code": it.get("motif-1_code", "NONE"),
            "motif_libre": it.get("motif_libre", ""), "motif2": it.get("motif-2", "Aucun"),
            "motif2_code": it.get("motif-2_code", "NONE"), "motif_aller": it.get("motif_aller", ""),
            "report_date": it.get("report_date", ""), "report_date_aller": it.get("report_date_aller", ""),
            "report_agreed": bool(it.get("report_agreed", False)), "rattrape_par": it.get("rattrape_par", ""),
            "echange_avec": it.get("echange_avec", ""), "evenements_lies": it.get("evenements_lies", []),
            "evenement_ok": it.get("evenement_ok", True), "notes": it.get("notes", ""),
            "solde_dette": it.get("solde_dette", ""), "soldee_par": it.get("soldee_par", []),
            "bank_delta": 0 if k in m else int(it.get("bank_delta", 0) or 0), "subtype": it.get("subtype", ""),
            "vac_nom": it.get("vac_nom", ""), "vac_debut": it.get("vac_debut", ""), "vac_fin": it.get("vac_fin", ""),
            "vac_part": it.get("vac_part", 0), "vac_parts": it.get("vac_parts", 0),
            "visible": it.get("visible_in_ui", True), "reprise_alternance": bool(it.get("reprise_alternance", False)),
            "lieu_aller_code": (it.get("lieu_aller") or LIEU_DEFAUT) if it.get("code_aller") == "A" else "",
            "lieu_aller": lieu_label(it.get("lieu_aller"), LX) if it.get("code_aller") == "A" else "",
            "lieu_retour_code": (it.get("lieu_retour") or LIEU_DEFAUT) if it.get("code_retour") in ("A", "C") else "",
            "lieu_retour": lieu_label(it.get("lieu_retour"), LX) if it.get("code_retour") in ("A", "C") else "",
            "motif_lieu": it.get("motif_lieu", "Aucun"), "motif_lieu_code": it.get("motif_lieu_code", "NONE"), "hide": bool(it.get("hide", False)), "masque": k in m,
            "created_at": it.get("created_at", ""), "modified_at": it.get("modified_at", ""),
            "modification_count": it.get("modification_count", 0),
        })
    out = {"nb_weekends": len(data), "maj": now_iso(), "vacances": content.get("vacances", []),
           "pivots": content.get("pivots", []), "evenements": content.get("evenements", []), "weekends": ws}
    tmp = MOTEUR_PATH + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    os.replace(tmp, MOTEUR_PATH)


if __name__ == "__main__":
    # Recalcul complet + régénération du fichier moteur :  python3 /config/matteo/scripts/matteo_common.py
    c = load(); save(c); print("OK moteur", len(c["data"]))
