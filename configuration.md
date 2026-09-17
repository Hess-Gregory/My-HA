# configuration.yaml — Documentation

## Rôle du fichier

Fichier de configuration racine de Home Assistant. Active les packages (`packages/*.yaml`), les thèmes (`themes/*.yaml`), les fichiers `automations.yaml`/`scripts.yaml`/`scenes.yaml`, et regroupe les entités/intégrations qui n'ont pas leur place dans un package (boutons télécommande, flux RSS, aides diverses, réglages système).

## Sections principales

- **`default_config:`** : bloc standard HA, ne pas retirer.
- **`homeassistant: packages: !include_dir_named packages`** : active tous les fichiers du dossier `packages/` (chacun documenté séparément).
- **`frontend: themes: !include_dir_merge_named themes`** : active tous les fichiers du dossier `themes/` (voir `themes/*.md`).
- **`automation: !include automations.yaml`**, **`script: !include scripts.yaml`**, **`scene: !include scenes.yaml`** : les 3 fichiers racine complémentaires, documentés séparément.
- **`browser_mod:`** : active l'intégration custom **Browser Mod** (à installer via HACS). Sans le téléchargement HACS + redémarrage, cette ligne seule ne fait rien. Sert aux popups plein écran sur la tablette murale (compte à rebours "Je pars", interphone).
- **`template: button:`** : bouton virtuel "Clim Salon Vitesse" qui simule un appui sur la touche "Speed" de la télécommande IR du climatiseur Eurom (via `remote.send_command`, `device_id: 3c0dab21c8ba8fbc22b611816ce926c4`).
- **`template: sensor:`** :
  - `Présence Ordre Haut` : détermine qui de Grégory ou Sandrine est prioritaire pour l'affichage "trajet retour" (présent à la maison > ETA < 1 min > ETA < 2 min > ETA connu > aucune info), en tenant compte de la fraîcheur de la donnée Waze (ignore un ETA vieux de plus de 30 min).
  - `Semaine Matteo` : logique de garde alternée. Matteo est chez Gregory les semaines ISO paires, du vendredi soir au dimanche soir. L'alternance du "qui récupère le dimanche soir" est ancrée sur une observation réelle (06/09/2026, semaine 36, multiple de 4 = Elodie est venue le chercher) : `semaine % 4 == 0` → Elodie vient le chercher, `semaine % 4 == 2` → Gregory le reconduit. **⚠️ Ancrage fragile** : si le rythme réel de garde change, cette formule modulo doit être recalculée à partir d'une nouvelle date de référence confirmée.
- **`command_line: sensor:`** : 3 capteurs RSS (Actu RTBF, Actu Sudinfo, Actu RTL Info) qui téléchargent un flux XML, le parsent en JSON via une chaîne `curl | sed | awk | jq` (nécessite `jq` sur l'hôte, présent par défaut sur la plupart des installations HAOS/Supervised), et exposent un attribut `articles` consommé par la carte `custom:rss-news-card` du dashboard Accueil. `scan_interval: 900` (15 min), `command_timeout: 30`.
- **`input_boolean: simulation_presence`** : interrupteur du dashboard qui pilote la simulation de présence (voir `automations.yaml`).
- **`timer: compte_a_rebours_depart`** : minuterie 60s utilisée par le flux "Je pars" (voir `automations.yaml` + `scripts.yaml`).
- **`input_datetime:`** : 4 dates d'anniversaire (Grégory, Sandrine, Matteo, Hugo) pour l'onglet Anniversaires du dashboard Calendrier. ⚠️ `initial:` ne fixe la date qu'à la toute première création de l'aide — une modification ultérieure depuis l'interface HA n'est plus jamais écrasée par ce fichier.
- **`logger:`** : niveau général `warning`. `custom_components.flightradar24` passé en `critical` pour faire taire ses erreurs 429 répétées (quota API), qui étaient déjà émises en `error` (donc les passer en `error` n'aurait rien changé).
- **`recorder:`** : `purge_keep_days: 10`. Exclut de l'historique long terme les capteurs calculés à très haute fréquence de variation (`sensor.prochain_changement_*`, `sensor.mode_horaire_*`, `sensor.ecart_*` — tous définis dans `packages/chauffage.yaml`), pour alléger la base de données et les requêtes de l'interface.

## Comment modifier

| Je veux... | Je modifie... |
|---|---|
| Ajouter un flux RSS | Dupliquer un bloc `command_line: sensor:` avec la nouvelle URL, et ajouter la carte correspondante dans le dashboard Accueil |
| Changer la logique de garde alternée de Matteo | La formule modulo dans `sensor.semaine_matteo` — **revérifier l'ancrage** (date de référence confirmée) avant de changer quoi que ce soit |
| Exclure un nouveau capteur à variation rapide de l'historique | Ajouter son pattern à `recorder: exclude: entity_globs:` |
| Changer la durée de rétention de l'historique | `recorder: purge_keep_days` |
| Faire taire les logs répétitifs d'une autre intégration | Ajouter son namespace à `logger: logs:` avec le niveau `critical` |
| Ajouter un anniversaire | Un nouveau bloc `input_datetime.anniversaire_xxx`, puis ajouter la personne dans l'onglet Anniversaires du dashboard Calendrier |

## Pièges connus

- `browser_mod:` ne fait rien tant que l'intégration HACS correspondante n'est pas installée et HA redémarré — ne pas s'étonner que les popups tablette ne marchent pas si cette étape a été oubliée.
- La formule de `sensor.semaine_matteo` est ancrée sur une seule date d'observation réelle : toute erreur de calendrier de garde future (jour férié, échange exceptionnel) n'est PAS gérée automatiquement par cette formule — c'est un calcul purement mécanique sur le numéro de semaine ISO.
- `initial:` sur les `input_datetime` d'anniversaire ne s'applique qu'à la création initiale de l'aide — modifier ce fichier après coup ne changera pas une date déjà réglée manuellement dans l'UI.
