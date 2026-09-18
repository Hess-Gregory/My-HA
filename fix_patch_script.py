#!/usr/bin/env python3
"""
Corrige une erreur de transcription dans patch_horaires_pro_v2.py :
la sequence JS \\n (2 caracteres : backslash + n, censee produire un
saut de ligne A L'INTERIEUR d'une chaine JS a une seule ligne) avait
ete collee avec un seul backslash. Resultat : Python l'interprete
comme UN VRAI saut de ligne dans la chaine Python, qui se propage
jusque dans le JS final -> "SyntaxError: Invalid or unexpected token"
dans button-card (confirme en inspectant le dashboard en direct).

Ce script ne touche qu'a cette unique occurrence (contexte "Todoist ?"
/ "Cette action") et n'utilise aucun backslash litteral dans son
propre code source (chr(92)) pour eviter de reproduire le meme bug
en le transmettant.
"""
import sys
from pathlib import Path

PATCH_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/config/patch_horaires_pro_v2.py")

BACKSLASH = chr(92)

if not PATCH_PATH.exists():
    print(f"ERREUR : fichier introuvable : {PATCH_PATH}")
    sys.exit(1)

with open(PATCH_PATH, "r", encoding="utf-8") as f:
    content = f.read()

broken = "Todoist ?" + BACKSLASH + "nCette"
fixed = "Todoist ?" + BACKSLASH * 2 + "nCette"

count = content.count(broken)
if count == 0:
    if content.count(fixed) > 0:
        print("Rien a corriger : la sequence est deja correcte.")
        sys.exit(0)
    print("ERREUR : sequence attendue introuvable (ni cassee ni corrigee). Fichier different de ce qui est attendu.")
    sys.exit(1)
if count > 1:
    print(f"ERREUR : {count} occurrences trouvees (1 attendue) - correction manuelle necessaire pour eviter toute ambiguite.")
    sys.exit(1)

content = content.replace(broken, fixed)
with open(PATCH_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("Correction appliquee dans", PATCH_PATH)
print("Relance maintenant : python3 patch_horaires_pro_v2.py && python3 apply_horaires_pro_view.py")
