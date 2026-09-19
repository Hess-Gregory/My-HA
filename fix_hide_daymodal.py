#!/usr/bin/env python3
import sys
from pathlib import Path

PATCH_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/config/patch_horaires_pro_v2.py")

if not PATCH_PATH.exists():
    print(f"ERREUR : fichier introuvable : {PATCH_PATH}")
    sys.exit(1)

with open(PATCH_PATH, "r", encoding="utf-8") as f:
    content = f.read()

anchor = "window.__hpCalWatcher = true;"

injection = (
    "window.__hpCalWatcher = true;\n"
    "    var hpHideDayModal = function() {\n"
    "      findAll(document, 'family-calendar-card', []).forEach(function(cal) {\n"
    "        if (!cal.shadowRoot) return;\n"
    "        if (cal.shadowRoot.getElementById('hp-hide-daymodal')) return;\n"
    "        var st = document.createElement('style');\n"
    "        st.id = 'hp-hide-daymodal';\n"
    "        st.textContent = '.day-events-modal, .hw-overlay { display: none !important; pointer-events: none !important; }';\n"
    "        cal.shadowRoot.appendChild(st);\n"
    "      });\n"
    "    };\n"
    "    hpHideDayModal();\n"
    "    setInterval(hpHideDayModal, 2000);"
)

marker = "hpHideDayModal"
if marker in content:
    print("Rien a corriger : le masquage du modal jour est deja present.")
    sys.exit(0)

count = content.count(anchor)
if count == 0:
    print("ERREUR : ancre attendue introuvable. Fichier different de ce qui est attendu.")
    sys.exit(1)
if count > 1:
    print(f"ERREUR : {count} occurrences trouvees (1 attendue) - correction manuelle necessaire.")
    sys.exit(1)

content = content.replace(anchor, injection)
with open(PATCH_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("Correction appliquee dans", PATCH_PATH, ": masquage du modal jour natif (day-events-modal) ajoute.")
print("Relance maintenant : python3 patch_horaires_pro_v2.py && python3 apply_horaires_pro_view.py")
