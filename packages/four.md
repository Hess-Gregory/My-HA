# Four Siemens (package `four.yaml`)

Four **Siemens HS736G3B1** relié par l'intégration **Home Connect**.

## Ce que HA reçoit du four
- État (`sensor.four_etat` : inactive, ready, run, pause, actionrequired, finished…), porte, température de la cavité, progression, heure de fin.
- Programme sélectionné / actif (12 modes), température de consigne, durée, préchauffage rapide (options visibles seulement quand un programme est choisi).
- Alimentation, sécurité enfant, pause, arrêt, minuterie.
- **Pas exposés par l'intégration pour ce modèle** : sonde de cuisson, jets de vapeur / vapeur ajoutée, réservoir d'eau et sa trappe, commande de l'éclairage, favoris et recettes de l'application Siemens.
- Les capteurs d'évènement (préchauffage terminé, programme terminé…) ont été activés mais ne remontent rien sur ce four : les alertes se basent sur `sensor.four_etat`.

## Automatisations
| id | rôle |
|---|---|
| `four_alertes_etat` | « Le four demande une action » (réservoir, trappe, confirmation) et « C'est prêt » avec boutons +10 min / Maintenir au chaud / Éteindre |
| `four_memo_programme` | mémorise le dernier programme lancé dans `input_text.four_dernier_programme` |
| `four_chaud` | « Le four est chaud » quand la cavité atteint la consigne (1 fois / 30 min) |
| `four_reveil` | minuterie écoulée |
| `four_notification_actions` | exécute les boutons de la notification |
| `four_demarrage_programme` | démarre le programme choisi à `input_datetime.four_demarrer_a` si `input_boolean.four_demarrage_programme` est actif |
| `four_porte_ouverte_chaud` | porte ouverte > 2 min alors que le four dépasse 80 °C |
| `four_absence` | plus personne à la maison depuis 5 min → four éteint |

Le script « Je pars » éteint aussi le four.

## Scripts (scripts.yaml)
- `script.four_preparer` (program, temperature, duree en minutes, prechauffage) : allume, sélectionne, règle — ne démarre pas.
- `script.four_demarrer` : lance le programme sélectionné.
- `script.four_fav_ajouter` / `script.four_fav_supprimer` : favoris dans `input_text.four_favori_1…8` au format `nom|programme|°C|minutes|préchauffage`.

## Pourquoi un package
`automations.yaml` contient des `!secret` (code alarme) : l'éditeur d'automatisations de l'UI ne peut pas l'écrire (erreur 500). Les nouvelles automatisations vont donc dans des packages.

## Plat favori (liste déroulante)
`select.four_plat_favori` (template) liste les noms des favoris `input_text.four_favori_1…16` ; le choix est mémorisé dans `input_number.four_favori_choisi`. Format d'un favori : `nom|programme|°C|minutes|préchauffage|programme2|°C2|minutes2|conseil|icône` (les champs 6 à 8 servent aux recettes en 2 étapes, lancées par `script.four_favori`).

## Recettes, carnet, rappels
- `sensor.four_recettes` : catalogue de 100 recettes (attribut `recettes`, classé par type de plat) ; `select.four_recette` liste les recettes de la catégorie `input_select.four_recette_categorie`.
- `sensor.four_carnet` : 20 dernières cuissons (date, recette, programme, minutes, température max).
- `input_text.four_recette_en_cours` (nom|retourner|minutes) : renseigné par `script.four_favori`, sert au rappel de mi-cuisson (`four_mi_cuisson`) et au message « enfournez maintenant ».
- `counter.four_cuissons_nettoyage` : rappel de nettoyage à partir de 15 cuissons (`four_fin_suivi`).
