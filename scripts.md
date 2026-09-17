# scripts.yaml — Documentation

## Rôle du fichier

Scripts racine (`script: !include scripts.yaml` dans `configuration.yaml`), couvrant la télécommande IR du climatiseur de salon, la sono (coin DJ), les scènes "de vie" (bonne nuit, tout éteindre, je pars, retour, sieste/calme), la simulation de présence, et deux scripts utilisant l'IA Claude via `ai_task.generate_data`.

## Climatiseur salon (télécommande IR Eurom, `device_id: 3c0dab21c8ba8fbc22b611816ce926c4`)

Chaque script envoie une seule commande IR via `remote.send_command` : `allumer_eteindre_clim_salon` (Power), `allumer_eteindre_clim_salon_dupliquer` (Speed), `clim_salon_speed_dupliquer` (Sleep), `clim_salon_speed_dupliquer_2` (Temp +), `clim_salon_speed_dupliquer_dupliquer` (Temp -), `clim_salon_speed_dupliquer_dupliquer_2` (Mode), `clim_salon_mode_dupliquer` (Timer). **⚠️ Les noms internes (`clim_salon_speed_dupliquer_2`, etc.) sont issus de duplications successives depuis l'UI et ne reflètent pas la commande réelle envoyée** — se fier au champ `alias` de chaque script (visible dans le dashboard) plutôt qu'à son ID technique pour savoir ce qu'il fait vraiment.

## Sono (coin DJ)

- **`demarrage_mixer`** : allume le mixer, attend 4s (temps de démarrage électronique), puis allume lecteurs + monitoring.
- **`1786831774432`** (alias "Éteindre la sono") : éteint monitoring, attend 4s, éteint lecteurs puis mixer (ordre inverse du démarrage). Piloté par `light.turn_off` sur des `device_id`, pas des `entity_id` — plus robuste si une entité est renommée, mais moins lisible directement dans ce fichier.
- Ces deux scripts sont appelés par l'automatisation "Sono switch automatisation" (`automations.yaml`) selon l'état de `input_boolean.sono`.

## Scènes "de vie"

- **`bonne_nuit`** 🌙 : éteint toutes les lumières de la liste `&id001` (ancre YAML réutilisée par `tout_eteindre` et `je_pars` via `*id001`/liste dupliquée), coupe la Fire TV, met la tablette murale en veille (luminosité économiseur 30, activation du switch économiseur).
- **`tout_eteindre`** 🔌 : identique à `bonne_nuit` pour les lumières + Fire TV, mais ne touche pas à la tablette.
- **`je_pars`** 🚪 : éteint les mêmes lumières + Fire TV, démarre `timer.compte_a_rebours_depart` (60s, relié à l'armement différé de l'alarme dans `automations.yaml`), et passe chambre adulte/enfants/pièce de vie/SdB en mode chauffage "Éco".
- **`retour`** 🏠 : annule le timer de départ (`timer.cancel`), rallume la Fire TV, désactive l'économiseur d'écran tablette, repasse les 4 pièces de chauffage en "Confort".
- **`sieste_calme`** 🤫 : éteint uniquement le coin DJ + Fire TV (n'éteint pas le reste de l'appartement).
- **`simulation_presence_rotation`** 🎭 : boucle `repeat: while: input_boolean.simulation_presence == 'on'`, qui tire au hasard (`range(0,6) | random`) une des 6 "étapes" (lustre salon, cuisine, panneau mural avec couleur/luminosité aléatoire, ambilight TV, lustre salle à manger, projecteur extérieur), l'allume, attend une durée aléatoire (5-20 min), l'éteint, puis attend encore 3-15 min avant de retirer une nouvelle étape au hasard. Boucle indéfiniment tant que `input_boolean.simulation_presence` reste `on` (piloté par les automatisations "Simulation de présence" dans `automations.yaml`).

## Scripts IA (Claude via `ai_task.generate_data`)

- **`claude_proposition_dashboard`** : prend un champ texte `demande` (ce que l'utilisateur veut comme carte/section), envoie une instruction à `ai_task.claude_ai_task` pour générer UNIQUEMENT du YAML Lovelace prêt à coller (aucune explication), affiche le résultat dans une notification persistante à relire avant de l'appliquer manuellement.
- **`claude_notification_maison`** : génère un résumé chaleureux de l'état de la maison (météo, alarme, consommation électrique du jour) via Claude, avec un champ optionnel `consigne` pour préciser le ton souhaité (par défaut : chaleureux, naturel, familier), affiché en notification persistante.

## Comment modifier

| Je veux... | Je modifie... |
|---|---|
| Ajouter/retirer une lumière des scènes "de vie" | La liste `&id001` définie dans `bonne_nuit` (réutilisée par `*id001` dans `tout_eteindre` — **attention, `je_pars` a sa PROPRE liste dupliquée, pas une ancre**, donc à modifier séparément si besoin) |
| Ajouter une nouvelle commande IR pour le clim salon | Dupliquer un script `clim_salon_xxx`, changer `command:` (voir les commandes possibles dans Outils de développement > Actions > `remote.send_command` ou la doc de la télécommande apprise) |
| Changer les durées d'allumage/extinction de la simulation de présence | Les bornes `range(300, 1200)` (durée allumée, 5-20 min) et `range(180, 900)` (pause entre étapes, 3-15 min) dans `simulation_presence_rotation` |
| Ajouter une nouvelle "étape" à la simulation de présence | Étendre `range(0, 6)` à `range(0, 7)` et ajouter la 7e condition `{{ etape == 6 }}` dans le `choose:` |
| Changer le ton par défaut de `claude_notification_maison` | Le texte "Ton par défaut : chaleureux, naturel, familier" dans les `instructions:` |
| Ajouter une donnée au résumé maison généré par Claude | Ajouter l'état/attribut voulu dans le texte `instructions:` de `claude_notification_maison` (ex. `states('sensor.xxx')`) |

## Pièges connus

- Les IDs techniques des scripts clim salon (`clim_salon_speed_dupliquer_2`, etc.) ne correspondent pas à leur fonction réelle — toujours vérifier l'`alias` avant de modifier le bon script.
- `je_pars` a sa propre liste de lumières dupliquée (pas une référence à l'ancre `&id001`) : une modification de la liste de `bonne_nuit` ne se répercute PAS automatiquement sur `je_pars`.
- `simulation_presence_rotation` tourne en boucle infinie tant que le booléen reste `on` — si le booléen est remis à `on` alors qu'un ancien script tournait encore (mode `single` par défaut sur les scripts sauf indication contraire), vérifier qu'il n'y a pas de comportement inattendu de double-boucle.
