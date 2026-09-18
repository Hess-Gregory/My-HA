#!/usr/bin/env python3
"""
Corrige le nom du service appele quand on clique une date du calendrier.
Le domaine input_datetime n'a PAS de service "set_value" (celui-ci
n'existe que pour input_text / input_number) : il a "set_datetime".
Confirme en direct via hass.services.input_datetime dans le navigateur
(seuls "reload" et "set_datetime" existent), d'ou l'erreur "Action
input_datetime.set_value introuvable" au clic sur une date.
"""
import sys
from pathlib import Path

PATCH_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/config/patch_horaires_pro_v2.py")

if not PATCH_PATH.exists():
    print(f"ERREUR : fichier introuvable : {PATCH_PATH}")
    sys.exit(1)

with open(PATCH_PATH, "r", encoding="utf-8") as f:
    content = f.read()

broken = "callService('input_datetime', 'set_value'"
fixed = "callService('input_datetime', 'set_datetime'"

count = content.count(broken)
if count == 0:
    if content.count(fixed) > 0:
        print("Rien a corriger : deja sur set_datetime.")
        sys.exit(0)
    print("ERREUR : sequence attendue introuvable. Fichier different de ce qui est attendu.")
    sys.exit(1)
if count > 1:
    print(f"ERREUR : {count} occurrences trouvees (1 attendue) - correction manuelle necessaire.")
    sys.exit(1)

content = content.replace(broken, fixed)
with open(PATCH_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("Correction appliquee dans", PATCH_PATH, ": input_datetime.set_value -> input_datetime.set_datetime")
print("Relance maintenant : python3 patch_horaires_pro_v2.py && python3 apply_horaires_pro_view.py")
