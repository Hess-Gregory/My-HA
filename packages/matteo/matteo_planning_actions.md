# matteo_planning_actions.yaml — le formulaire (Modifier / Créer / Supprimer)

## Helpers du formulaire
| Entité | Rôle |
|---|---|
| `input_text.matteo_form_date_key` | Clé de la ligne éditée (`JJ-MM-AAAA`, `VAC_…`, `PIVOT_…`) |
| `input_datetime.matteo_form_du` / `_au` | Dates de la période |
| `input_select.matteo_form_type` / `_garde` | Type de période / chez qui (types hors rythme) |
| `input_select.matteo_form_aller` / `_retour` | Qui fait l'aller / le retour (codes A–E) |
| `input_select.matteo_form_lieu_aller` / `_lieu_retour` | Lieu quand Grégory fait le trajet (défaut Maurage) |
| `input_select.matteo_form_motif` | Motif de garde (types hors rythme) |
| `input_select.matteo_form_motif2` | Motif quand un parent n'a pas fait son trajet (obligatoire pour C, D, aller B) |
| `input_select.matteo_form_motif_lieu` | Motif quand le lieu n'est pas Maurage (obligatoire) |
| `input_text.matteo_form_motif_libre` | Précision si un motif « Autre » est choisi |
| `input_select.matteo_form_rattrapage` | Trajet dû soldé par un retour D |
| `input_select.matteo_form_echange` | Week-end partenaire d'un échange croisé |
| `input_text.matteo_form_notes` | Notes libres |
| `input_boolean.matteo_form_actif` | « Date active » (décoché = suspendu) |
| `input_boolean.matteo_a_une_selection` / `matteo_mode_edition` | État du popup (détail / édition / création) |
| `input_text.matteo_form_resultat` | Message d'erreur ou de succès |

## Scripts
| Script | Rôle |
|---|---|
| `matteo_planning_charger` | Remplit le formulaire depuis une ligne existante |
| `matteo_planning_selectionner` / `_editer` / `_annuler_edition` / `_nouveau` | Navigation du popup |
| `matteo_planning_maj_rattrapage` / `_maj_echange` | Remplissent les listes « trajet rattrapé » / « échange avec » |
| `matteo_planning_retour_suggere` | Applique le retour suggéré par l'alternance |
| `matteo_planning_enregistrer` | Contrôles + appel de `matteo_save_override.py` |
| `matteo_planning_modifier` / `_creer` | Boutons Enregistrer / Créer du popup (attendent la validation) |
| `matteo_planning_appliquer_activation` | Applique « Date active » |
| `matteo_planning_supprimer` / `_supprimer_selection` | Suppression logique (hide) |

## Capteurs
| Entité | Rôle |
|---|---|
| `sensor.matteo_form_retour_attendu` | Retour attendu selon l'alternance (A ou B) + dernier retour, dettes de chaque côté. Déclenché par la ligne éditée / le planning. |
| `sensor.matteo_form_validation` | `ok` / `erreur` + message : le bouton Enregistrer est désactivé tant que c'est `erreur` |

## Règles de validation (résumé)
Dates valides · pas de doublon · parts de congé sans chevauchement · motif de garde pour les types hors rythme ·
aller/retour renseignés chez papa · retour conforme à l'alternance (sinon C/D) · **motif obligatoire** si un trajet
n'est pas fait par le bon parent ou si le lieu n'est pas Maurage · précision si « Autre ».

## Pièges
- La même règle est codée deux fois : dans la macro `matteo_form_erreur` (bouton désactivé) et dans le script
  `matteo_planning_enregistrer` (garde-fou). Modifier les deux ensemble.
- Les options des menus de motifs sont réécrites par `matteo_planning_options.yaml` depuis `matteo_options.json`.

## Inversion permanente des retours

- `input_boolean.matteo_form_inverser_retours` : case « 🔁 Inverser les retours à partir de cette date ».
- `input_select.matteo_form_compensation` : date du trajet de compensation (obligatoire), remplie par `script.matteo_planning_maj_compensation` (un retour sur deux après la date) ; l'automatisation `matteo_form_maj_compensation` la met à jour quand on coche la case ou change la date.
- Contrôles : retour A/B = l'autre parent que prévu, date de compensation et motif obligatoires. Arguments 27-28 du script Python : `inversion`, `comp_key`.
