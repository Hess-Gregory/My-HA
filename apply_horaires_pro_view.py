#!/usr/bin/env python3
"""
Remplace la vue "Horaires Pro" (path: horaires-pro) dans le dashboard
storage-mode "Calendrier" (/config/.storage/lovelace.dashboard_calendrier)
par le contenu de horaires-pro_view_popup_v3.yaml.

Usage :
    python3 apply_horaires_pro_view.py

Pré-requis :
    - Le fichier horaires-pro_view_popup_v3.yaml doit se trouver dans
      /config/ (même dossier que ce script, par défaut).
    - Le paquet pyyaml doit être installé (pip install pyyaml si besoin).
    - IMPORTANT : ferme tout onglet du navigateur qui aurait le dashboard
      "Calendrier" ouvert en mode édition avant de lancer ce script, pour
      éviter qu'Home Assistant n'écrase ce changement avec un état en
      mémoire périmé.
    - Un redémarrage de Home Assistant Core est nécessaire ensuite pour
      que le changement soit pris en compte (les dashboards storage-mode
      sont chargés en mémoire au démarrage, pas relus à chaud).

Ce script fait une sauvegarde horodatée du fichier de stockage avant
toute modification.
"""

import json
import shutil
import sys
from datetime import datetime
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERREUR : le module 'pyyaml' n'est pas installé.")
    print("Lance d'abord : pip install pyyaml")
    sys.exit(1)

STORAGE_PATH = Path("/config/.storage/lovelace.dashboard_calendrier")
NEW_VIEW_PATH = Path("/config/horaires-pro_view_popup_v3.yaml")
VIEW_PATH_KEY = "horaires-pro"


def main():
    if not STORAGE_PATH.exists():
        print(f"ERREUR : fichier introuvable : {STORAGE_PATH}")
        sys.exit(1)

    if not NEW_VIEW_PATH.exists():
        print(f"ERREUR : fichier introuvable : {NEW_VIEW_PATH}")
        print("Crée d'abord ce fichier avec le contenu de horaires-pro_view_popup_v3.yaml.")
        sys.exit(1)

    # 1. Sauvegarde horodatée du fichier de stockage
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = STORAGE_PATH.with_name(STORAGE_PATH.name + f".backup_{timestamp}")
    shutil.copy2(STORAGE_PATH, backup_path)
    print(f"[1/5] Sauvegarde créée : {backup_path}")

    # 2. Chargement du JSON de stockage actuel
    with open(STORAGE_PATH, "r", encoding="utf-8") as f:
        storage = json.load(f)
    print("[2/5] Fichier de stockage chargé.")

    # 3. Chargement de la nouvelle vue YAML
    with open(NEW_VIEW_PATH, "r", encoding="utf-8") as f:
        new_view = yaml.safe_load(f)
    if not isinstance(new_view, dict) or "path" not in new_view:
        print("ERREUR : le YAML chargé ne ressemble pas à une vue Lovelace valide (pas de clé 'path').")
        sys.exit(1)
    print(f"[3/5] Nouvelle vue chargée : title='{new_view.get('title')}', path='{new_view.get('path')}'")

    # 4. Localisation et remplacement de la vue existante
    try:
        views = storage["data"]["config"]["views"]
    except (KeyError, TypeError):
        print("ERREUR : structure inattendue dans le fichier de stockage.")
        print("Clés de premier niveau trouvées :", list(storage.keys()))
        sys.exit(1)

    found_index = None
    for i, v in enumerate(views):
        if isinstance(v, dict) and v.get("path") == VIEW_PATH_KEY:
            found_index = i
            break

    if found_index is None:
        print(f"ERREUR : aucune vue avec path='{VIEW_PATH_KEY}' trouvée dans le dashboard.")
        print("Vues actuellement présentes :", [v.get("path") for v in views if isinstance(v, dict)])
        sys.exit(1)

    old_title = views[found_index].get("title")
    views[found_index] = new_view
    print(f"[4/5] Vue remplacée à l'index {found_index} (ancien titre : '{old_title}').")

    # 5. Écriture du fichier de stockage mis à jour
    with open(STORAGE_PATH, "w", encoding="utf-8") as f:
        json.dump(storage, f, ensure_ascii=False)
    print(f"[5/5] Fichier de stockage réécrit : {STORAGE_PATH}")

    print("")
    print("=" * 60)
    print("TERMINÉ. Prochaine étape OBLIGATOIRE :")
    print("  redémarrer Home Assistant Core pour charger le changement.")
    print("  (les dashboards storage-mode sont en cache mémoire, pas")
    print("   relus à chaud depuis le disque)")
    print("=" * 60)


if __name__ == "__main__":
    main()
