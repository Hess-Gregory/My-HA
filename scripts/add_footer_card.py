#!/usr/bin/env python3
"""Ajoute (ou met a jour) le footer de versionning sur un dashboard Lovelace (mode storage).

Gere les deux types de vues Lovelace :
  - vues classiques (masonry/sidebar/panel) -> carte ajoutee dans view['cards']
  - vues "sections" (nouveau format HA)     -> carte ajoutee dans une section dediee,
                                               en derniere position (effet "footer")

Usage: python3 scripts/add_footer_card.py <slug>
Exemple: python3 scripts/add_footer_card.py 1_streaming
"""
import json
import sys
from pathlib import Path

MARKER = "versioning-footer"


def build_card(slug: str) -> dict:
    sensor = f"sensor.version_dashboard_{slug}"
    content = (
        f"<!-- {MARKER} -->\n"
        "<div style=\"text-align:center;font-size:0.72em;opacity:0.55;"
        "line-height:1.6;margin-top:10px;padding-top:8px;"
        "border-top:1px solid var(--divider-color);\">\n"
        f"🔧 <b>{slug}</b> &middot; v{{{{ states('{sensor}') }}}}<br>\n"
        f"Mis a jour le {{{{ as_timestamp(state_attr('{sensor}','last_update')) "
        "| timestamp_custom('%d/%m/%Y a %H:%M') }}<br>\n"
        f"<i>{{{{ state_attr('{sensor}','last_change') }}}}</i><br>\n"
        "Concu et maintenu par <b>Gregory</b>\n"
        "</div>"
    )
    return {"type": "markdown", "content": content}


def is_footer_card(card) -> bool:
    return isinstance(card, dict) and MARKER in card.get("content", "")


def is_footer_section(section) -> bool:
    if not isinstance(section, dict):
        return False
    return any(is_footer_card(c) for c in section.get("cards", []))


def apply_to_view(view: dict, card: dict) -> None:
    if view.get("type") == "sections":
        # Nettoie une eventuelle cle 'cards' orpheline (ignoree par le renderer sections)
        if "cards" in view and all(is_footer_card(c) for c in view["cards"]):
            del view["cards"]
        sections = view.setdefault("sections", [])
        sections[:] = [s for s in sections if not is_footer_section(s)]
        sections.append({"type": "grid", "cards": [card]})
    else:
        cards = view.setdefault("cards", [])
        cards[:] = [c for c in cards if not is_footer_card(c)]
        cards.append(card)


def main():
    if len(sys.argv) != 2:
        print("Usage: add_footer_card.py <slug>")
        sys.exit(1)
    slug = sys.argv[1]
    path = Path(f".storage/lovelace.{slug}")
    data = json.loads(path.read_text(encoding="utf-8"))
    card = build_card(slug)
    views = data["data"]["config"]["views"]
    for view in views:
        apply_to_view(view, card)
    path.write_text(
        json.dumps(data, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"Footer ajoute/mis a jour sur {len(views)} vue(s) de {slug}")


if __name__ == "__main__":
    main()
