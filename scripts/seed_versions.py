#!/usr/bin/env python3
"""Migration ponctuelle : passe versions.json de l'ancien schema (cle = nom de
dashboard) au nouveau schema (cle = chemin relatif du fichier), et initialise
une entree pour chaque fichier suivi qui n'en a pas encore.

A executer UNE SEULE FOIS a la racine du depot (/config), puis committer le
resultat avec un message "chore(version): ..." (prefixe ignore par le hook
post-commit, donc pas de cascade de bump).
"""
import datetime
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VERSIONS_FILE = ROOT / "versions.json"
HEADER_MARK = "# [AUTO-VERSION]"

# Migration des anciennes cles (schema par nom de dashboard) vers les nouveaux
# chemins relatifs (schema par fichier). Les entrees non listees ici gardent
# leur version actuelle si leur nouvelle cle existe deja, sinon partent de 0.0.1.
LEGACY_KEY_MAP = {
    "1_streaming": ".storage/lovelace.1_streaming",
    "dashboard_versions": "packages/dashboard_versions.yaml",
}

TRACKED_PATHS = [
    ".storage/lovelace.1_accueil",
    ".storage/lovelace.1_courses",
    ".storage/lovelace.1_eclairage",
    ".storage/lovelace.1_energie",
    ".storage/lovelace.1_flight_radar",
    ".storage/lovelace.1_ma_maison",
    ".storage/lovelace.1_meteo_belgique",
    ".storage/lovelace.1_mon_confort",
    ".storage/lovelace.1_pollution",
    ".storage/lovelace.1_reseau_infra",
    ".storage/lovelace.1_securite",
    ".storage/lovelace.1_streaming",
    ".storage/lovelace.1_taches",
    ".storage/lovelace.boite_a_outils",
    ".storage/lovelace.dashboard_calendrier",
    ".storage/lovelace.dashboard_transversal",
    "packages/chaudiere.yaml",
    "packages/chauffage.yaml",
    "packages/dashboard_versions.yaml",
    "packages/horaires_pro_editeur.yaml",
    "packages/horaires_pro.yaml",
    "packages/taches_counters.yaml",
    "packages/taches_kanban.yaml",
    "automations.yaml",
    "configuration.yaml",
    "scenes.yaml",
    "scripts.yaml",
    "themes/Alpine-night.yaml",
    "themes/large-sections.yaml",
    "themes/amethyst-glow.yaml",
    "themes/maison.yaml",
]


def is_yaml(rel_path: str) -> bool:
    return rel_path.endswith((".yaml", ".yml"))


def update_yaml_header(path: Path, version: str, when_iso: str, description: str) -> None:
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    while lines and lines[0].startswith(HEADER_MARK):
        lines.pop(0)
    when_human = datetime.datetime.fromisoformat(when_iso).strftime("%d/%m/%Y %H:%M")
    header = f"{HEADER_MARK} v{version} | {when_human} | {description}\n"
    path.write_text(header + "".join(lines), encoding="utf-8")


def main() -> None:
    old = {}
    if VERSIONS_FILE.exists():
        old = json.loads(VERSIONS_FILE.read_text(encoding="utf-8"))

    # Reconstruit un dict "nouveau schema" a partir des anciennes cles connues.
    migrated = {}
    for legacy_key, new_path in LEGACY_KEY_MAP.items():
        if legacy_key in old:
            migrated[new_path] = old[legacy_key]

    # Garde aussi toute entree deja au nouveau schema (chemin avec / ou .yaml).
    for key, value in old.items():
        if key in TRACKED_PATHS and key not in migrated:
            migrated[key] = value

    now = datetime.datetime.now().astimezone().isoformat()
    seeded = []
    for rel in TRACKED_PATHS:
        if rel in migrated:
            continue
        migrated[rel] = {
            "version": "0.0.1",
            "last_change": "initialisation du versionning par fichier",
            "last_update": now,
        }
        seeded.append(rel)
        if is_yaml(rel):
            update_yaml_header(
                ROOT / rel, "0.0.1", now, "initialisation du versionning par fichier"
            )

    VERSIONS_FILE.write_text(
        json.dumps(migrated, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )

    print(f"[seed_versions] {len(seeded)} fichier(s) initialise(s) a 0.0.1 :")
    for rel in seeded:
        print(f"  - {rel}")
    print(f"[seed_versions] {len(migrated) - len(seeded)} fichier(s) migre(s) depuis l'ancien schema.")


if __name__ == "__main__":
    main()
