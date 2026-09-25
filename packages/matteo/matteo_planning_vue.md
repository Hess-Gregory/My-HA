# matteo_planning_vue.yaml — tableau, filtres et calendrier

## Entités
| Entité | Rôle |
|---|---|
| `input_text.matteo_planning_filtre` | Recherche texte |
| `input_select.matteo_planning_filtre_type` / `_garde` / `_etat` / `_visibilite` | Filtres |
| `input_boolean.matteo_planning_passes` | Inclure les dates passées |
| `input_select.matteo_planning_par_page` + `input_number.matteo_planning_page` | Pagination |
| `input_number.matteo_cal_offset` | Mois affiché dans le calendrier (0 = mois en cours) |
| `sensor.planning_matteo_vue` | Lignes filtrées de la page courante (macro `matteo_vue`). **Déclenché** : recalculé quand un filtre, la page ou le planning change, et chaque heure. |

## Scripts / automatisations
| Nom | Rôle |
|---|---|
| `matteo_planning_page_precedente` / `_suivante` | Pagination |
| `matteo_planning_filtres_reset` | Remet les filtres par défaut |
| `matteo_cal_mois` | Mois précédent / suivant / aujourd'hui |
| `matteo_planning_retour_page_1` | Revient en page 1 quand un filtre change |
| `matteo_calendrier_mois_courant` | Revient au mois en cours 5 min après la dernière navigation, à minuit et au démarrage |

## Piège
Les helpers sont partagés par tous les écrans (tablette, téléphone…) : filtrer sur l'un filtre sur les autres.
