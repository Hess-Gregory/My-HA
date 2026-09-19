#!/usr/bin/env python3
"""
Corrige packages/horaires_pro_editeur.yaml :

1. CREATION : le script ne selectionnait jamais la tache creee, donc le
   popup restait sur le formulaire vierge. On retrouve la tache par son
   label + son heure de debut, puis on applique les trois gestes de
   selection du systeme -> le popup bascule tout seul sur Details.

2. CALENDRIER FIGE : les trois scripts rafraichissaient les capteurs
   mais jamais calendar.horaires_pro, l'entite que lit
   family-calendar-card. D'ou les evenements fantomes dans la grille
   mensuelle. On l'ajoute aux trois rafraichissements.

Trois blocs modifies, chacun identifie par une ancre unique. Le script
refuse d'agir si le fichier ne correspond pas a ce qui est attendu, et
ne fait rien s'il a deja ete applique.
"""
import sys
from pathlib import Path

YAML_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/config/packages/horaires_pro_editeur.yaml")

if not YAML_PATH.exists():
    print(f"ERREUR : fichier introuvable : {YAML_PATH}")
    sys.exit(1)

with open(YAML_PATH, "r", encoding="utf-8") as f:
    content = f.read()

if "id_creee" in content:
    print("Rien a corriger : le rafraichissement du calendrier est deja present.")
    sys.exit(0)

REFRESH_10 = """          - service: homeassistant.update_entity
            target:
              entity_id:
                - sensor.horaires_pro_taches
                - sensor.horaires_pro_projet
"""

# --- 1. CREATION ---------------------------------------------------
old_creation = REFRESH_10 + """          - service: input_text.set_value
            target:
              entity_id: input_text.hp_editeur_resultat
            data:
              value: >-
                ✅ Tâche créée : {{ prefix }} — {{ type_nom }} — {{ date }}
                {{ heure[:5] }} ({{ duree }})"""

new_creation = """          - service: homeassistant.update_entity
            target:
              entity_id:
                - sensor.horaires_pro_taches
                - sensor.horaires_pro_projet
                - calendar.horaires_pro
          - delay: "00:00:01"
          - variables:
              liste_jour: >-
                {{ state_attr('sensor.horaires_pro_taches_du_jour', 'liste')
                   | default([], true) }}
              id_creee: >-
                {% set m = liste_jour
                     | selectattr('label', 'eq', label_code)
                     | selectattr('start', 'eq', heure[:5])
                     | list %}
                {{ m[-1].id if m | count > 0 else '' }}
          - if:
              - condition: template
                value_template: "{{ id_creee != '' }}"
            then:
              - service: input_text.set_value
                target:
                  entity_id: input_text.hp_selection_id
                data:
                  value: "{{ id_creee }}"
              - service: input_boolean.turn_off
                target:
                  entity_id: input_boolean.hp_editeur_mode_edition
              - service: input_boolean.turn_on
                target:
                  entity_id: input_boolean.hp_a_une_selection
          - service: input_text.set_value
            target:
              entity_id: input_text.hp_editeur_resultat
            data:
              value: >-
                ✅ Tâche créée : {{ prefix }} — {{ type_nom }} — {{ date }}
                {{ heure[:5] }} ({{ duree }})"""

# --- 2. MODIFICATION -----------------------------------------------
old_modif = REFRESH_10 + """          - service: input_text.set_value
            target:
              entity_id: input_text.hp_editeur_resultat
            data:
              value: >-
                ✅ Tâche modifiée : {{ type_nom }} — {{ date }} {{ heure[:5] }}
                ({{ duree }})"""

new_modif = old_modif.replace(
    "                - sensor.horaires_pro_projet\n",
    "                - sensor.horaires_pro_projet\n                - calendar.horaires_pro\n",
)

# --- 3. SUPPRESSION ------------------------------------------------
old_suppr = """      - service: homeassistant.update_entity
        target:
          entity_id:
            - sensor.horaires_pro_taches
            - sensor.horaires_pro_projet"""

new_suppr = old_suppr + "\n            - calendar.horaires_pro"

# --- Verifications avant toute ecriture -----------------------------
for libelle, ancre in (
    ("creation", old_creation),
    ("modification", old_modif),
    ("suppression", old_suppr),
):
    n = content.count(ancre)
    if n != 1:
        print(f"ERREUR : ancre '{libelle}' trouvee {n} fois (1 attendue).")
        print("Aucune modification effectuee.")
        sys.exit(1)

content = content.replace(old_creation, new_creation)
content = content.replace(old_modif, new_modif)
content = content.replace(old_suppr, new_suppr)

with open(YAML_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("Correction appliquee dans", YAML_PATH)
print("  1. creation : selection de la tache creee (bascule sur Details)")
print("  2. creation / modification / suppression : rafraichissement de calendar.horaires_pro")
print()
print("Etape suivante : ha core check, puis ha core restart.")
