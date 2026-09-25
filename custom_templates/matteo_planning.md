# matteo_planning.jinja — macros du planning

Macros importées par les capteurs et cartes : `{% from 'matteo_planning.jinja' import matteo_vue %}`.
Source des données : `sensor.planning_matteo_engine`.

| Macro | Renvoie | Utilisée par |
|---|---|---|
| `matteo_vue(brut=false)` | JSON `{rows, total, page, pages}` : lignes filtrées, triées, paginées (week-ends masqués exclus). `brut=true` : lignes à venir sans filtre ; `brut='tout'` : toutes les lignes | `sensor.planning_matteo_vue`, prochaine période, stats |
| `matteo_detail(k)` | Tableau Markdown de la fiche « Détails » (période, trajets, lieux, nature banque, motifs, notes, historique) | popup Détails |
| `matteo_stats()` | JSON des statistiques de l'année scolaire | `sensor.matteo_statistiques` |
| `matteo_retour_attendu()` | JSON `{attendu, precedent, code, greg_doit, elodie_doit}` pour la ligne éditée | `sensor.matteo_form_retour_attendu` |
| `matteo_form_erreur()` | Premier problème du formulaire, ou chaîne vide | `sensor.matteo_form_validation` |

Chaque ligne de `matteo_vue` contient notamment `aller_c` / `retour_c` au format `CODE|Libellé`
(ex. `A|Grégory à ICPP Uccle (École)`), `lieu_a` / `lieu_r` (lieu seulement s'il n'est pas Maurage), `conge`, `notes`.

## Pièges
- Après modification : **Outils de développement → YAML → Recharger les modèles personnalisés** (ou `homeassistant.reload_custom_templates`).
- La validation existe aussi dans `matteo_planning_enregistrer` (voir `matteo_planning_actions.md`).

## Inversion permanente des retours

`matteo_form_erreur` contrôle la case d'inversion (retour A/B opposé à l'alternance, date de compensation et motif obligatoires). La fiche Détails affiche « 🔁 Retours inversés… » sur la ligne d'inversion et « ⚖️ Compensation… » sur le trajet de compensation.
