# Chauffage – préchauffage intelligent (v1.0.0 · 29/10/2026)

Package : `packages/chauffage_prechauffage.yaml`

## Principe
Chaque pièce doit **être** à sa température Confort à l'heure prévue, au lieu de commencer à chauffer à cette heure-là. HA mesure la vitesse de chauffe de chaque pièce (en °C par heure, d'après la sonde Zigbee) et démarre le Confort juste assez tôt.

## Objectifs (pièce prête à…)
| Pièce | Jours de travail | Week-end / férié | Confort |
|---|---|---|---|
| Pièce de vie | 06:15 · 16:40 | 08:00 | 21 °C |
| Chambre adulte | 06:15 · 23:00 | 23:00 | 19 °C |
| Chambre enfants | 06:15 · 16:40 | — | 20 °C |

Les températures Confort sont recopiées de `chauffage.yaml` : si tu changes une consigne Confort là-bas, change-la aussi dans la liste `objectifs` de l'automatisation `chauffage_prechauffage_demarrage`.

## Automatisations
- **chauffage_prechauffage_demarrage** (toutes les 5 min) : avance = (Confort − température actuelle) ÷ vitesse, + 10 min de marge, au maximum 3 h. Quand l'heure est venue, la pièce passe de Éco/Nuit/Hors-gel à Confort, et une ligne est écrite dans le journal (« Préchauffage »). Le Manuel et le Boost ne sont jamais touchés.
- **chauffage_prechauffage_apprentissage** : à chaque passage en Confort avec au moins 0,5 °C à rattraper, la montée est chronométrée (jusqu'à 4 h). La vitesse de la pièce est ensuite mise à jour (60 % ancienne valeur, 40 % nouvelle mesure).
- Les automatisations horaires de `chauffage.yaml` tournent toujours à l'heure de l'objectif : c'est le filet de sécurité.

## Réglages
- `input_boolean.chauffage_prechauffage_actif` : marche/arrêt.
- `input_number.chauffe_vitesse_*` : vitesse apprise (départ 0,8 °C/h), entre 0,2 et 5 °C/h.
