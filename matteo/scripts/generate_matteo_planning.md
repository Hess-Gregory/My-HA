# generate_matteo_planning.py — génération du planning

**Rôle** : complète le planning jusqu'à `END_DATE` (31/12/2028) **sans jamais rien écraser** : seules les dates
manquantes sont ajoutées.

## Ce que fait le script
1. Ajoute les congés scolaires officiels (Fédération Wallonie-Bruxelles) manquants et crée leurs parts à dater.
2. Crée chaque vendredi manquant : garde papa / maman selon l'alternance depuis `REF_FRIDAY` (18/09/2026)
   et les pivots.
3. **Fêtes** : fête des pères chez papa, fête des mères chez maman ; si l'une tombe chez le mauvais parent,
   échange avec le week-end suivant (ou échange des deux week-ends).
4. `save()` (réalignement des retours + moteur).

## Utilisation
```
python3 /config/matteo/scripts/generate_matteo_planning.py
```
Aussi disponible via `shell_command.matteo_planning_generer`.

## Modifier
| Je veux… | Je modifie… |
|---|---|
| Prolonger le planning | `END_DATE` |
| Ajouter une année scolaire | la liste `VACANCES` (noms avec l'année pour éviter les doublons) |
