#!/usr/bin/env python3
# /config/matteo/scripts/sauvegarde.py — archive complète du planning Matteo (code + données + dashboard)
# Résultat : /config/matteo/sauvegardes/matteo_AAAAMMJJ_HHMM.tar.gz (les 8 plus récentes sont gardées)
import os, tarfile
from datetime import datetime

DEST = "/config/matteo/sauvegardes"
GARDER = 8
ELEMENTS = [
    "matteo",                                                 # scripts Python, données JSON, documentation
    "packages/matteo",                                        # capteurs, helpers, scripts et automatisations HA
    "custom_templates/matteo_planning.jinja",                 # macros Jinja
    "custom_templates/matteo_planning.md",
    ".storage/lovelace.dashboard_calendrier",                 # dashboard Calendrier (vue Matteo & Trajets)
]


# Crée l'archive tar.gz des éléments ci-dessus puis supprime les archives au-delà de GARDER.
def main():
    os.makedirs(DEST, exist_ok=True)
    nom = os.path.join(DEST, "matteo_%s.tar.gz" % datetime.now().strftime("%Y%m%d_%H%M"))
    with tarfile.open(nom, "w:gz") as t:
        for e in ELEMENTS:
            p = os.path.join("/config", e)
            if os.path.exists(p):
                t.add(p, arcname=e, filter=lambda i: None if ("__pycache__" in i.name or i.name.startswith("matteo/sauvegardes")) else i)
    arch = sorted(f for f in os.listdir(DEST) if f.startswith("matteo_") and f.endswith(".tar.gz"))
    for f in arch[:-GARDER]:
        os.remove(os.path.join(DEST, f))
    print(nom)


if __name__ == "__main__":
    main()
