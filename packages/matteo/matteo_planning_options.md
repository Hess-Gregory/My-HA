# matteo_planning_options.yaml — menus déroulants

- `sensor.matteo_options_source` lit `matteo/data/matteo_options.json` (types, motifs, lieux, acteurs, codes couleur).
- L'automatisation `matteo_options_synchro_menus` réécrit les options des menus du formulaire
  (`matteo_form_type`, `matteo_form_motif`, `matteo_form_motif2`, `matteo_form_motif_lieu`) au démarrage
  et à chaque changement du JSON. « Aucun » est toujours ajouté en tête des motifs (sans doublon).
- Les listes écrites dans ce YAML ne servent que de **secours** au premier démarrage.

| Je veux… | Je fais… |
|---|---|
| Ajouter un motif / un lieu | Éditer `matteo_options.json` (un code unique + un libellé) |
| Renommer un libellé | Éditer le JSON ; les lignes existantes gardent leur code |
