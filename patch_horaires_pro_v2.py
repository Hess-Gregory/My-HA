#!/usr/bin/env python3
"""
Patch v2 de la vue Horaires Pro : corrige les 2 bugs constatés en live
(diagnostic fait en inspectant directement le dashboard via navigateur) :

  1. Le pont calendrier -> date active plantait silencieusement :
     cal._selectedDay.date n'est PAS une string mais un objet Luxon
     DateTime (.year / .month / .day) -> .split('T')[0] levait
     "TypeError: cal._selectedDay.date.split is not a function"
     (visible dans la console navigateur), donc input_datetime.hp_editeur_date
     ne se mettait jamais à jour. Corrigé : extraction robuste
     string/Luxon/Date natif.

  2. Les 8 lignes de la liste (et le message "aucune tâche") ne se
     cachaient jamais : button-card n'évalue PAS un template [[[ ]]]
     placé sur styles.card en bloc (confirmé par test live : ça produit
     un style="0:];" invalide). Seul le templating PAR VALEUR à
     l'intérieur d'une liste de styles fonctionne
     (ex: - display: "[[[ ... ]]]"). Corrigé : toutes les valeurs de
     style sont maintenant templatées individuellement.
     La liste est en plus regroupée dans UNE seule carte conteneur
     (vertical-stack) pour que les lignes cachées ne réservent plus
     d'espace dans la grille.

  Bonus (demande explicite) : chaque ligne affiche maintenant 3
  boutons sur la même ligne : Détail (zone principale), Modifier
  (crayon), Supprimer (poubelle, ouvre directement la confirmation).

Usage :
    python3 patch_horaires_pro_v2.py [chemin_yaml]
(par défaut : /config/horaires-pro_view_popup_v3.yaml)

Ne touche à rien d'autre dans le fichier. Lance ensuite
apply_horaires_pro_view.py (déjà présent) pour pousser le résultat
dans le storage, comme d'habitude.
"""

import sys
import yaml
from pathlib import Path

YAML_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/config/horaires-pro_view_popup_v3.yaml")

L = "(window.__hpMergedList && window.__hpMergedList(states['input_datetime.hp_editeur_date'].state)) || []"

BRIDGE_JS = """[[[
  var findAll = function(root, sel, out) {
    if (!root) return out;
    try {
      root.querySelectorAll(sel).forEach(function(el){ out.push(el); });
      root.querySelectorAll('*').forEach(function(el){ if (el.shadowRoot) findAll(el.shadowRoot, sel, out); });
    } catch(e) {}
    return out;
  };
  var openEditeurPopup = function() {
    var btns = findAll(document, 'button-card', []);
    var target = btns.find(function(b){
      return b.shadowRoot && b.shadowRoot.textContent && b.shadowRoot.textContent.indexOf('Éditeur de tâches') !== -1;
    });
    if (target && target.shadowRoot) {
      var inner = target.shadowRoot.querySelector('ha-card') || target.shadowRoot.firstElementChild;
      if (inner) inner.click();
    }
  };
  if (!window.__hpMergedList) {
    window.__hpMergedList = function(dateStr) {
      var haEl = document.querySelector('home-assistant');
      var h = haEl && haEl.hass;
      var src = [];
      if (h && dateStr) {
        ['gregory','sandrine'].forEach(function(p) {
          var ent = h.states['sensor.horaires_pro_blocs_' + p];
          var blocs = (ent && ent.attributes.blocs) || [];
          blocs.forEach(function(b) {
            if (b.date && b.date.slice(0,10) === dateStr) src.push(b);
          });
        });
        src.sort(function(a,b){ return (a.start||'').localeCompare(b.start||''); });
      }
      return src;
    };
  }
  var hpExtractDate = function(dd) {
    if (!dd) return null;
    if (typeof dd === 'string') return dd.split('T')[0];
    var y, m, day;
    if (typeof dd.year === 'number') { y = dd.year; m = dd.month; day = dd.day; }
    else if (typeof dd.getFullYear === 'function') { y = dd.getFullYear(); m = dd.getMonth() + 1; day = dd.getDate(); }
    else return null;
    var pad = function(n){ n = String(n); return n.length < 2 ? '0' + n : n; };
    return y + '-' + pad(m) + '-' + pad(day);
  };
  if (!window.__hpCalWatcher) {
    window.__hpCalWatcher = true;
    var hpHideDayModal = function() {
      findAll(document, 'family-calendar-card', []).forEach(function(cal) {
        if (!cal.shadowRoot) return;
        if (cal.shadowRoot.getElementById('hp-hide-daymodal')) return;
        var st = document.createElement('style');
        st.id = 'hp-hide-daymodal';
        st.textContent = '.day-events-modal, .hw-overlay { display: none !important; pointer-events: none !important; }';
        cal.shadowRoot.appendChild(st);
      });
    };
    hpHideDayModal();
    setInterval(hpHideDayModal, 2000);
    document.addEventListener('click', function(ev) {
      var path = ev.composedPath ? ev.composedPath() : [];
      var cell = path.find(function(el){
        return el.classList && el.classList.contains('day') && !el.classList.contains('header');
      });
      if (!cell) return;
      var cal = path.find(function(el){
        return el.tagName && el.tagName.toLowerCase() === 'family-calendar-card';
      });
      if (!cal) return;
      setTimeout(function() {
        if (!cal._selectedDay) return;
        var d = hpExtractDate(cal._selectedDay.date);
        if (!d) return;
        var haEl = document.querySelector('home-assistant');
        haEl.hass.callService('input_datetime', 'set_datetime', {
          entity_id: 'input_datetime.hp_editeur_date',
          date: d
        });
      }, 50);
    }, true);

    document.addEventListener('ll-custom', function(ev) {
      if (!ev.detail || typeof ev.detail.hp_row_index !== 'number') return;
      var action = ev.detail.hp_action || 'detail';
      var haEl = document.querySelector('home-assistant');
      var liveHass = haEl.hass;
      var d = liveHass.states['input_datetime.hp_editeur_date'].state;
      var l = window.__hpMergedList(d);
      var t = l[ev.detail.hp_row_index];
      if (!t) return;
      var personneLabel = t.personne === 'Gregory' ? 'Grégory' : 'Sandrine';
      liveHass.callService('input_select', 'select_option', {
        entity_id: 'input_select.hp_editeur_personne',
        option: personneLabel
      });
      setTimeout(function() {
        var hass2 = document.querySelector('home-assistant').hass;
        var ent = hass2.states['sensor.horaires_pro_taches_du_jour'];
        var arr = (ent && ent.attributes && ent.attributes.liste) || [];
        var idx = arr.findIndex(function(x){ return x.nom === t.nom && x.start === t.start; });
        if (idx < 0) idx = 0;
        hass2.callService('script', 'horaires_pro_selectionner_tache_par_index', { index: idx });

        if (action === 'supprimer') {
          setTimeout(function() {
            document.dispatchEvent(new CustomEvent('ll-custom', {
              bubbles: true, composed: true,
              detail: {
                browser_mod: {
                  service: 'browser_mod.popup',
                  data: {
                    title: '⚠️ Confirmation requise',
                    content: {
                      type: 'vertical-stack',
                      cards: [
                        { type: 'markdown', content: '### Supprimer définitivement cette tâche dans Todoist ?\\nCette action est irréversible.' },
                        { type: 'horizontal-stack', cards: [
                          { type: 'custom:button-card', name: 'Annuler', tap_action: { action: 'fire-dom-event', browser_mod: { service: 'browser_mod.close_popup' } } },
                          { type: 'custom:button-card', name: 'Confirmer', color: 'red', tap_action: { action: 'call-service', service: 'script.horaires_pro_supprimer_tache' } }
                        ]}
                      ]
                    }
                  }
                }
              }
            }));
          }, 250);
          return;
        }

        if (action === 'modifier') {
          setTimeout(function() {
            hass2.callService('script', 'horaires_pro_charger_pour_edition', {});
            setTimeout(openEditeurPopup, 250);
          }, 250);
          return;
        }

        setTimeout(openEditeurPopup, 300);
      }, 400);
    }, true);
  }
  return '';
]]]"""

def row_card(n):
    info = {
        "type": "custom:button-card",
        "layout": "icon_name_state",
        "show_state": False,
        "styles": {
            "card": [
                {"display": "[[[ const l = %s; return l[%d] ? 'flex' : 'none'; ]]]" % (L, n)},
                {"flex": "1"},
                {"border-left": "[[[ const l = %s; const t = l[%d]; return '4px solid ' + (t ? (t.couleur || '#888') : 'transparent'); ]]]" % (L, n)},
                {"padding": "6px 10px"},
                {"border-radius": "8px 0 0 8px"},
                {"margin-bottom": "4px"},
                {"background": "rgba(255,255,255,0.04)"},
            ]
        },
        "icon": "[[[ const l = %s; const t = l[%d]; return t ? (t.personne === 'Gregory' ? 'mdi:account-hard-hat' : 'mdi:account') : 'mdi:calendar-blank'; ]]]" % (L, n),
        "name": "[[[ const l = %s; const t = l[%d]; if (!t) return ''; return t.emoji + ' ' + t.nom + ' — ' + (t.start ? t.start + (t.end ? '–'+t.end : '') : 'journée entière'); ]]]" % (L, n),
        "tap_action": {"action": "fire-dom-event", "hp_row_index": n, "hp_action": "detail"},
    }
    modifier = {
        "type": "custom:button-card",
        "show_name": False,
        "show_label": False,
        "icon": "mdi:pencil",
        "styles": {
            "card": [
                {"display": "[[[ const l = %s; return l[%d] ? 'flex' : 'none'; ]]]" % (L, n)},
                {"min-width": "40px"},
                {"padding": "6px"},
                {"margin-bottom": "4px"},
                {"margin-left": "1px"},
                {"background": "rgba(255,255,255,0.04)"},
            ],
            "icon": [{"color": "#f6d68a"}],
        },
        "tap_action": {"action": "fire-dom-event", "hp_row_index": n, "hp_action": "modifier"},
    }
    supprimer = {
        "type": "custom:button-card",
        "show_name": False,
        "show_label": False,
        "icon": "mdi:delete",
        "styles": {
            "card": [
                {"display": "[[[ const l = %s; return l[%d] ? 'flex' : 'none'; ]]]" % (L, n)},
                {"min-width": "40px"},
                {"padding": "6px"},
                {"margin-bottom": "4px"},
                {"margin-left": "1px"},
                {"border-radius": "0 8px 8px 0"},
                {"background": "rgba(255,255,255,0.04)"},
            ],
            "icon": [{"color": "#e57373"}],
        },
        "tap_action": {"action": "fire-dom-event", "hp_row_index": n, "hp_action": "supprimer"},
    }
    return {"type": "horizontal-stack", "cards": [info, modifier, supprimer]}


def build_list_container():
    title = {
        "type": "markdown",
        "text_only": True,
        "content": (
            "{% set d = states('input_datetime.hp_editeur_date') %}\n"
            "## 📋 Tâches du {{ d[8:10] }}/{{ d[5:7] }}/{{ d[0:4] }}\n\n"
            "Grégory & Sandrine — cliquez une date du calendrier pour changer de jour"
        ),
    }
    no_task = {
        "type": "custom:button-card",
        "show_name": False,
        "show_icon": False,
        "show_label": True,
        "styles": {
            "card": [
                {"display": "[[[ const l = %s; return l.length === 0 ? 'block' : 'none'; ]]]" % L},
                {"padding": "10px"},
                {"opacity": "0.75"},
            ]
        },
        "label": "ℹ️ Aucune tâche ce jour-là.",
    }
    rows = [row_card(n) for n in range(8)]
    return {"type": "vertical-stack", "cards": [title, no_task] + rows}


def main():
    if not YAML_PATH.exists():
        print(f"ERREUR : fichier introuvable : {YAML_PATH}")
        sys.exit(1)

    with open(YAML_PATH, "r", encoding="utf-8") as f:
        view = yaml.safe_load(f)

    sections = view.get("sections")
    if not sections or len(sections) < 3:
        print("ERREUR : structure de vue inattendue (sections manquantes).")
        sys.exit(1)

    # --- Section 1 : pont calendrier (carte invisible, 2e carte) ---
    bridge_cards = sections[1].get("cards", [])
    bridge_card = None
    for c in bridge_cards:
        if isinstance(c, dict) and c.get("type") == "custom:button-card" and "label" in c and c.get("show_name") is False and c.get("show_icon") is False:
            bridge_card = c
            break
    if bridge_card is None:
        print("ERREUR : carte pont (PONT CALENDRIER) introuvable dans sections[1].")
        sys.exit(1)
    bridge_card["label"] = BRIDGE_JS
    print("[1/2] Pont calendrier corrigé (extraction de date Luxon-safe + actions Détail/Modifier/Supprimer par ligne).")

    # --- Section 2 : liste inline ---
    sections[2]["cards"] = [build_list_container()]
    print("[2/2] Liste inline reconstruite en une seule carte conteneur (vertical-stack, 8 lignes à 3 boutons).")

    with open(YAML_PATH, "w", encoding="utf-8") as f:
        yaml.safe_dump(view, f, allow_unicode=True, sort_keys=False, width=100000)

    print("")
    print("Fichier YAML mis à jour :", YAML_PATH)
    print("Prochaine étape : python3 apply_horaires_pro_view.py (puis redémarrage HA Core).")


if __name__ == "__main__":
    main()
