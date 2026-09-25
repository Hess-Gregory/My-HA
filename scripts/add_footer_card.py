#!/usr/bin/env python3
"""Ajoute (ou met a jour) le footer de versionning sur un dashboard Lovelace (mode storage).

Gere les deux types de vues Lovelace :
  - vues classiques (masonry/sidebar/panel) -> carte ajoutee dans view['cards']
  - vues "sections" (nouveau format HA)     -> carte ajoutee dans une section dediee,
                                                en pleine largeur, en derniere position

Le footer affiche uniquement :
  - la version du dashboard lui-meme (capteur sensor.versions_config_ha,
    attribut = ".storage/lovelace.<slug>")
  - la version (et date/heure) de chaque fichier "dependance" declare pour ce
    dashboard dans scripts/dashboard_dependencies.json

Usage: python3 scripts/add_footer_card.py <slug>
Exemple: python3 scripts/add_footer_card.py dashboard_calendrier
"""
import json
import sys
from pathlib import Path

MARKER = "versioning-footer"
SENSOR = "sensor.versions_config_ha"
ROOT = Path(__file__).resolve().parent.parent
DEPENDENCIES_FILE = ROOT / "scripts" / "dashboard_dependencies.json"
FULL_WIDTH_GRID_OPTIONS = {"columns": 36, "rows": "auto"}


def dashboard_path(slug: str) -> str:
    return f".storage/lovelace.{slug}"


def load_dependencies(slug: str) -> list:
    if not DEPENDENCIES_FILE.exists():
        return []
    try:
        data = json.loads(DEPENDENCIES_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []
    return data.get(slug, [])


def version_line(path: str, label: str, icon: str) -> str:
    return (
        f"{icon} <b>{label}</b> &middot; "
        f"v{{{{ state_attr('{SENSOR}', '{path}').version "
        f"if state_attr('{SENSOR}', '{path}') else '0.0.0' }}}} &middot; "
        f"{{{{ as_timestamp(state_attr('{SENSOR}', '{path}').last_update) "
        f"| timestamp_custom('%d/%m/%Y a %H:%M') "
        f"if state_attr('{SENSOR}', '{path}') else 'non versionne' }}}}"
    )


def build_card(slug: str) -> dict:
    own_path = dashboard_path(slug)
    deps = load_dependencies(slug)

    lines = [
        f"<!-- {MARKER} -->",
        "<div style=\"text-align:center;font-size:0.72em;opacity:0.55;"
        "line-height:1.7;margin-top:10px;padding-top:8px;"
        "border-top:1px solid var(--divider-color);\">",
        version_line(own_path, slug, "\U0001F527") + "<br>",
    ]

    for dep in deps:
        dep_label = Path(dep).stem
        lines.append(version_line(dep, dep_label, "\U0001F4E6") + "<br>")

    lines.append("Con\u00e7u et maintenu par <b>Gregory</b> via Claude AI")
    lines.append("</div>")

    return {"type": "markdown", "content": "\n".join(lines)}


def is_footer_card(card) -> bool:
    return isinstance(card, dict) and MARKER in card.get("content", "")


def is_footer_section(section) -> bool:
    if not isinstance(section, dict):
        return False
    return any(is_footer_card(c) for c in section.get("cards", []))


def apply_to_view(view: dict, card: dict) -> None:
    if view.get("type") == "sections":
        if "cards" in view and all(is_footer_card(c) for c in view["cards"]):
            del view["cards"]
        sections = view.setdefault("sections", [])
        sections[:] = [s for s in sections if not is_footer_section(s)]
        full_width_card = dict(card)
        full_width_card["grid_options"] = dict(FULL_WIDTH_GRID_OPTIONS)
        sections.append({"type": "grid", "cards": [full_width_card]})
    elif view.get("type") == "panel":
        # Vue "panel" : seule la PREMIERE carte est affichee. Le footer est donc place
        # a la fin de cette carte (si c'est une pile) au lieu d'etre ajoute a cote.
        cards = view.setdefault("cards", [])
        cards[:] = [c for i, c in enumerate(cards) if i == 0 or not is_footer_card(c)]
        if cards and isinstance(cards[0], dict) and isinstance(cards[0].get("cards"), list):
            inner = cards[0]["cards"]
            inner[:] = [c for c in inner if not is_footer_card(c)]
            inner.append(dict(card))
        elif not cards:
            cards.append(dict(card))
    else:
        cards = view.setdefault("cards", [])
        cards[:] = [c for c in cards if not is_footer_card(c)]
        cards.append(dict(card))


def main():
    if len(sys.argv) != 2:
        print("Usage: add_footer_card.py <slug>")
        sys.exit(1)
    slug = sys.argv[1]
    path = ROOT / f".storage/lovelace.{slug}"
    data = json.loads(path.read_text(encoding="utf-8"))
    card = build_card(slug)
    views = data["data"]["config"]["views"]
    for view in views:
        apply_to_view(view, card)
    path.write_text(
        json.dumps(data, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    deps = load_dependencies(slug)
    print(
        f"Footer ajoute/mis a jour sur {len(views)} vue(s) de {slug} "
        f"(capteur: {SENSOR}, dependances: {deps if deps else 'aucune'})"
    )


if __name__ == "__main__":
    main()
