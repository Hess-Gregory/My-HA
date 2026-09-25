# matteo_calendar.yaml — moteur et banque

## Entités
| Entité | Type | Rôle |
|---|---|---|
| `sensor.planning_matteo_engine` | command_line | Lit `matteo/data/matteo_moteur.json`. Attributs : `weekends` (toutes les lignes), `vacances`, `pivots`, `evenements`, `nb_weekends`, `maj` (horodatage de la dernière écriture). Relu toutes les 15 min et après chaque enregistrement. |
| `sensor.matteo_banque_trajets` | template | Solde net de la banque (somme des `bank_delta`, lignes supprimées et week-ends masqués exclus). > 0 : Élodie / Olivier doivent des trajets ; < 0 : Grégory en doit. |

## Pourquoi un fichier compact ?
La source brute fait ~190 Ko (historique inclus). Le moteur ne contient que les champs utiles (~110 Ko)
et des calculs faits une fois en Python (week-ends masqués, lieux). Un seul gros capteur au lieu de deux.

## Pièges
- Ne pas éditer `matteo_moteur.json` : il est réécrit à chaque enregistrement.
- Le capteur est exclu de l'historique (`recorder` dans `configuration.yaml`) car ses attributs dépassent 16 Ko.
