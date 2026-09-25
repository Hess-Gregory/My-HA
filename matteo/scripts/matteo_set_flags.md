# matteo_set_flags.py — supprimer / suspendre

**Appelé par** : `shell_command.matteo_override_flags` (scripts `matteo_planning_supprimer` et `matteo_planning_appliquer_activation`).

```
matteo_set_flags.py KEY HIDE VISIBLE [USER]
```
- `HIDE=true` : la ligne disparaît du planning (**suppression logique**, récupérable dans le JSON).
  Ses liens de banque sont défaits (les dettes qu'elle soldait redeviennent ouvertes).
- `VISIBLE=false` : la ligne est **suspendue** (« Date active » décochée) : visible seulement avec le filtre « Suspendus ».
- Chaque changement est tracé dans `audit`.
