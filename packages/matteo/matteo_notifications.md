# matteo_notifications.yaml — prochaine période, stats, notifications, export

## Capteurs (déclenchés : changement du planning + chaque heure)
| Entité | Rôle |
|---|---|
| `sensor.matteo_prochain_weekend` | Période en cours / à venir : attributs `info` et `suivant` (garde, trajets, lieux, événements, notes) |
| `sensor.matteo_statistiques` | Statistiques de l'année scolaire (week-ends, nuits de congé, trajets non respectés, rattrapages) |

## Automatisations
| Nom | Quand | Quoi |
|---|---|---|
| `matteo_notif_veille_trajet` | 19h00 | Rappel des trajets du lendemain (qui, lieu, événement, notes) |
| `matteo_notif_conges_a_definir` | 09h00 | Congé pas encore daté à J-21, 14, 7, 3, 1 |
| `matteo_notif_evenement_autre_parent` | 19h05 | Événement fêté chez l'autre parent à J-3 |
| `matteo_export_agenda` | à chaque écriture du planning + démarrage | Régénère .ics / page imprimable / CSV et recharge le calendrier « Matteo » |

Notifications envoyées sur `notify.mobile_app_smartphone_greg` + notification persistante HA.

## Script
`matteo_planning_filtre_rapide` : raccourcis de filtres (à venir, historique, à rattraper, congés à définir).
