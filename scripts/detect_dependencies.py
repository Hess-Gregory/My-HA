#!/usr/bin/env python3
"""Detection automatique des dependances dashboard -> fichier(s) packages/*.yaml.

Repere, pour chaque fichier de packages/, des mots-cles (unique_id et le nom
du fichier) puis verifie dans quels dashboards (.storage/lovelace.*) ces
mots-cles apparaissent (en ignorant le contenu du footer deja injecte, pour
eviter les faux positifs si on relance ce script plusieurs fois).

Usage : python3 scripts/detect_dependencies.py
Ecrit scripts/dashboard_dependencies.json (fusionne avec l'existant).
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PACKAGES_DIR = ROOT / "packages"
DEPENDENCIES_FILE = ROOT / "scripts" / "dashboard_dependencies.json"
MARKER = "versioning-footer"

EXCLUDED_PACKAGES = {"dashboard_versions.yaml"}

DASHBOARD_SLUGS = [
    "1_accueil", "1_courses", "1_eclairage", "1_energie", "1_flight_radar",
    "1_ma_maison", "1_meteo_belgique", "1_mon_confort", "1_pollution",
    "1_reseau_infra", "1_securite", "1_streaming", "1_taches",
    "boite_a_outils", "dashboard_calendrier", "dashboard_transversal",
]


def extract_keywords(package_path: Path) -> set:
    text = package_path.read_text(encoding="utf-8")
    keywords = set()
    for m in re.finditer(r'unique_id:\s*["\']?([a-zA-Z0-9_\.]+)["\']?', text):
        kw = m.group(1).strip().lower()
        if len(kw) >= 6:
            keywords.add(kw)
    stem = package_path.stem.lower()
    if len(stem) >= 5:
        keywords.add(stem)
    return keywords


def dashboard_text_without_footer(slug: str) -> str:
    path = ROOT / f".storage/lovelace.{slug}"
    if not path.exists():
        return ""
    data = json.loads(path.read_text(encoding="utf-8"))
    views = data.get("data", {}).get("config", {}).get("views", [])

    def is_footer(card):
        return isinstance(card, dict) and MARKER in card.get("content", "")

    cleaned_views = []
    for view in views:
        view = dict(view)
        if "cards" in view:
            view["cards"] = [c for c in view["cards"] if not is_footer(c)]
        if "sections" in view:
            new_sections = []
            for section in view["sections"]:
                cards = section.get("cards", [])
                if any(is_footer(c) for c in cards):
                    continue
                new_sections.append(section)
            view["sections"] = new_sections
        cleaned_views.append(view)
    return json.dumps(cleaned_views, ensure_ascii=False).lower()


def main():
    existing = {}
    if DEPENDENCIES_FILE.exists():
        existing = json.loads(DEPENDENCIES_FILE.read_text(encoding="utf-8"))

    package_keywords = {}
    for pkg_path in sorted(PACKAGES_DIR.glob("*.yaml")):
        if pkg_path.name in EXCLUDED_PACKAGES:
            continue
        package_keywords[f"packages/{pkg_path.name}"] = extract_keywords(pkg_path)

    detected = {}
    for slug in DASHBOARD_SLUGS:
        text = dashboard_text_without_footer(slug)
        if not text:
            continue
        deps = []
        for pkg_rel, keywords in package_keywords.items():
            if any(kw in text for kw in keywords):
                deps.append(pkg_rel)
        if deps:
            detected[slug] = sorted(deps)

    merged = dict(existing)
    for slug, deps in detected.items():
        merged[slug] = deps

    DEPENDENCIES_FILE.write_text(
        json.dumps(merged, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )

    print("[detect_dependencies] dependances detectees :")
    for slug in sorted(merged):
        print(f"  - {slug}: {merged[slug]}")


if __name__ == "__main__":
    main()
