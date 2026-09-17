# automations.yaml — Documentation

## Rôle du fichier

Fichier racine (`automation: !include automations.yaml` dans `configuration.yaml`) regroupant toutes les automatisations qui ne vivent pas dans un package dédié (le chauffage a les siennes dans `packages/chauffage.yaml`, par exemple). Contient des automatisations réseau, sécurité, énergie, tâches, présence, tablette murale et divertissement.

## ⚠️ Limitation importante : `!secret alarm_code`

Ce fichier utilise `!secret alarm_code` (défini dans `secrets.yaml`) dans plusieurs automatisations liées à l'alarme. Conséquence connue de Home Assistant : **l'éditeur graphique des automatisations** (Paramètres > Automatisations > icône crayon) **ne supporte pas** les `!secret` et renvoie une erreur 500 *"Secrets not supported in this YAML file"* si vous essayez d'ouvrir N'IMPORTE QUELLE automatisation de ce fichier dans cet éditeur — pas seulement celles qui utilisent le secret. Ce n'est pas un bug, c'est une limitation du composant qui lit ce fichier directement sans résoudre les secrets.

**Conséquence pratique : toute modification de `automations.yaml` doit se faire via un éditeur de texte (File editor / Studio Code Server / SSH), jamais via le bouton crayon de l'interface.** Les automatisations elles-mêmes continuent de fonctionner normalement (démarrage, activation/désactivation depuis la liste) — seule l'édition graphique est bloquée.

## Inventaire des automatisations

### Réseau / système
- **Speedtest 15min** (`1786571826109`) : force le rafraîchissement des capteurs Ookla Speedtest (download/upload/ping) toutes les 15 min.
- **Réseau - Alerte bascule ligne de secours (4G)** : notifie (notification persistante) quand `binary_sensor.r_wan2_core_liaison_internet_du_port_2` passe à `off` (bascule sur la carte SIM Digi de secours) ou revient à `on` (retour ligne principale VOO/Orange).
- **Réseau - Alerte appareil hors-ligne** : surveille 7 capteurs "état de l'appareil" (routeur, 3 points d'accès, 3 switchs) et notifie dans les deux sens (hors-ligne / retour en ligne), avec un `notification_id` par appareil pour que le retour en ligne remplace la notif hors-ligne au lieu de s'empiler.

### Énergie
- **Bascule tarif bi-horaire Mega Energie** : change `select.consommation_maison` (heures_pleines/heures_creuses) selon l'état de `schedule.heures_pleines` (7h-11h et 17h-22h tous les jours).
- **Énergie - Alerte avant disjonction** : notifie si la puissance instantanée (`sensor.buanderie_local_tech_compteur_general_maison_puissance`) dépasse 12 kW pendant 30 secondes soutenues (seuils repris de la gauge du dashboard Énergie : vert 0-9kW / orange 9-12kW / rouge 12-15kW).

### Sécurité / présence
- **Sono switch automatisation** : `input_boolean.sono` on/off démarre/arrête le script mixer (`demarrage_mixer` / script `1786831774432`).
- **Simulation de présence - activation/désactivation** (2 automatisations) : `input_boolean.simulation_presence` → armement alarme absence + chauffage en Éco sur les 5 pièces + démarrage/arrêt du script `simulation_presence_rotation`. ⚠️ Note du fichier : il n'existe pas de thermostat global unique, donc l'action cible les 5 `input_select.mode_*` en "Éco" plutôt qu'une action `climate.set_preset_mode` qui n'a jamais existé sur cette installation.
- **Cave - Réarmement auto si porte fermée et zone désarmée** : réarme automatiquement la zone alarme cave si la porte de la cave est fermée depuis 5 min ET que la zone est désarmée (oubli/désactivation involontaire).
- **Je pars - armement alarme après délai de 60s** : le script "je_pars" démarre `timer.compte_a_rebours_depart` (60s) au lieu d'armer tout de suite ; cette automatisation arme l'alarme et met la tablette en veille au déclenchement de l'événement `timer.finished` (pas un simple changement d'état — un timer annulé via `timer.cancel` déclenche `timer.cancelled`, pas `timer.finished`, donc si vous rentrez à temps via le script "Retour", l'alarme ne s'arme jamais).
- **Sécurité - Alerte événements de sécurité AJAX** : écoute l'entité `event.buanderie_local_tech_centrale_alarme_ajax_evenement_de_securite` (bien plus fiable qu'un état "triggered" qui n'existe pas avec cette intégration). Deux niveaux : **critique** 🚨 (alarm, panic, tamper, glass_break, fire, co_alarm, flood) et **maintenance** ⚠️ (malfunction, connection_lost, battery_low). Les types arm/disarm/motion/door_open/doorbell_pressed sont volontairement ignorés (déjà visibles ailleurs, ou trop bruyants). `notification_id` horodaté (jamais fixe) pour qu'un nouvel incident n'efface jamais le précédent.

### Tablette murale (Sam)
- **Popup compte à rebours "Je pars"** (ouverture/fermeture, 2 automatisations) : nécessite l'intégration custom **Browser Mod** (HACS). Affiche un popup plein écran avec le minuteur en direct dès que `timer.compte_a_rebours_depart` passe à `active`, le ferme dès qu'il repasse à `idle` (fin normale OU annulation). Browser ID confirmé : `browser_mod_59a39768_1e3bd7e4`.
- **Tablette Sam - Mode sombre/clair auto** (2 automatisations) : mode sombre si nuit (`sun.sun` = `below_horizon`) ET lustre salle à manger éteint ; sinon mode clair. Vérifié toutes les 15 min en plus des changements d'état.
- **Interphone : Pop-up Appel Entrant** : dès que `camera.hall_dentree_bticino_intercom_greg_et_sandrine_platine_de_rue` passe à `streaming` (appel entrant sur la platine BTicino), réveille l'écran de la tablette et affiche la carte `custom:bticino-intercom-card` (vidéo + déverrouillage porte) en popup, fermeture auto après 30s.

### Tâches
- **Tâches - Rappel quotidien** : chaque soir à 19h, récupère via `todo.get_items` le détail des tâches non faites des 3 listes (`todo.taches_gregory/matteo/sandrine`) et envoie un résumé par personne, avec mise en avant de celles dues aujourd'hui ou en retard (si Todoist a bien synchronisé une échéance).
- **Tâches - Incrémenter compteur hebdo à la complétion** / **Reset hebdomadaire** : voir `packages/taches_counters.md` — la logique de ces 2 automatisations vit ici, les compteurs `counter.*` qu'elles utilisent sont déclarés dans `packages/taches_counters.yaml`.

### Divers / qualité de l'air / électroménager
- **Flight Radar - Alerte de repérage** : notifie si un avion militaire (préfixes BAF/RCH/NATO/CTM/FAF/GAF/GAM/ASCOT/SPAR/CNV) ou un vol à moins de 3000 ft est présent dans la zone Domicile/Liège (`sensor.flightradar24_current_in_area`, attribut `flights`). Utilise le test Jinja `search` (pas `regex_search`, qui n'existe qu'en filtre, pas en test — source d'une erreur corrigée).
- **Four - Alerte fin de cuisson** : notifie quand `sensor.four_etat` contient "termin" (insensible à la casse). ⚠️ Le texte exact renvoyé par le four Siemens Home Connect n'était pas confirmé à l'écriture — à vérifier dans Outils de développement > États si ça ne se déclenche pas au bon moment.
- **Chaudière - Alerte entretien légal & constructeur** : rappelle chaque jour à 8h si l'entretien est en retard, avec 2 seuils codés en dur : recommandation constructeur dépassée le `2025-02-10`, échéance légale wallonne (AGW 29/01/2009, tous les 3 ans max) le `2026-02-10`. **⚠️ Le jour du prochain entretien réel, il faut mettre à jour ces 2 dates ICI et la carte correspondante dans `mon_confort.yaml`**, sinon l'alerte continue de se déclencher sur les anciennes échéances.
- **Pollution - Alerte code couleur classification AQI Engis** : notifie à chaque changement de catégorie AQI (Bon/Modéré/Mauvais pour groupes sensibles/Mauvais/Très mauvais/Dangereux, échelle EPA 0-500 — **pas** une concentration officielle en µg/m³) plutôt qu'à chaque variation de chiffre. Indique aussi le polluant dominant (PM2.5/PM10/NO2/SO2/O3) avec une explication. Ne remplace pas l'abonnement officiel AwAC (PM10 réel en µg/m³).

## Comment modifier

| Je veux... | Je modifie... |
|---|---|
| Éditer n'importe quelle automatisation de ce fichier | Toujours via un éditeur de texte (jamais le crayon de l'UI, à cause de `!secret`) |
| Changer le code d'alarme utilisé | `secrets.yaml` (`alarm_code`), pas ce fichier |
| Mettre à jour les dates d'entretien chaudière | Les 2 dates dans `chaudiere_alerte_entretien` **+** la carte correspondante dans `mon_confort.yaml` |
| Ajouter un appareil réseau à surveiller | Ajouter son capteur "état de l'appareil" à la liste `entity_id` du trigger de `reseau_alerte_appareil_hors_ligne`, et son nom au dictionnaire `noms` dans le message |
| Ajouter une personne au rappel de tâches du soir | Ajouter sa liste `todo.taches_xxx` au trigger + au dictionnaire `noms` de `taches_rappel_quotidien` |
| Changer les préfixes d'avions militaires suivis | La liste `MIL_PREFIXES` dans `flight_radar_alerte_reperage` (dupliquée dans la condition ET dans le message — à changer aux deux endroits) |
| Recevoir les alertes en push sur le téléphone en plus de la notification persistante | Ajouter une action `notify.mobile_app_<nom_du_telephone>` dans l'automatisation concernée |

## Pièges connus

- `!secret alarm_code` bloque l'éditeur graphique pour TOUT le fichier, pas juste les automatisations qui l'utilisent.
- Les dates de `chaudiere_alerte_entretien` sont dupliquées avec `mon_confort.yaml` — un oubli de mise à jour à l'un des deux endroits rend l'alerte incohérente avec le dashboard.
- La liste `MIL_PREFIXES` est dupliquée entre la condition et le message de `flight_radar_alerte_reperage`.
- Le texte exact de fin de cuisson du four n'est pas garanti stable (dépend de Home Connect Siemens) — à revérifier si l'alerte ne se déclenche pas.
