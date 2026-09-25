# matteo_delete_override.py — effacement définitif

**Usage** : `python3 matteo_delete_override.py KEY` — outil d'administration, **non utilisé par le dashboard**
(le dashboard utilise la suppression logique de `matteo_set_flags.py`).

Rouvre d'abord les dettes liées puis retire complètement la ligne du JSON. Une ligne auto-générée effacée
sera recréée par `generate_matteo_planning.py` à sa prochaine exécution.
