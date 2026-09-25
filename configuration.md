# configuration.yaml — Documentation

## Rôle du fichier

Fichier de configuration racine de Home Assistant. Active les packages (`packages/*.yaml`), les thèmes (`themes/*.yaml`), les fichiers `automations.yaml`/`scripts.yaml`/`scenes.yaml`, et regroupe les entités/intégrations qui n'ont pas leur place dans un package (boutons télécommande, flux RSS, aides diverses, réglages système).

## Sections principales

- **`default_config:`** : bloc standard HA, ne pas retirer.
- **`homeassistant: packages: !include_dir_named packages`** : active tous les fichiers du dossier `packages/` (chacun documenté séparément).
- **`frontend: themes: !include_dir_merge_named themes`** : active tous les fichiers du dossier `themes/` (voir `themes/*.md`).
- **`automation: !include automations.yaml`**, **`script: !include scripts.yaml`**, **`scene: !include scenes.yaml`** : les 3 fichiers racine complémentaires, documentés séparément.
- **`browser_mod:`** : active l'intégration custom **Browser Mod** (à installer via HACS). Sans le téléchargement HACS + redémarrage, cette ligne seule ne fait rien. Sert aux popups plein écran sur la tablette murale (compte à rebours "Je pars", interphone).
- **`template: button:`** : bouton virtuel "Clim Salon Vitesse" qui simule un appui sur la touche "Speed" de la télécommande IR du climatiseur Eurom (via `remote.send_command`, `device_id: 3c0dab21c8ba8fbc22b611816ce926c4`). ⚠️ Au 19/09/2026 l'entrée **Broadlink "Cellule Remonte salon" est en échec de connexion** (`setup_retry : connect_failed`) : ce bouton ne fait donc rien tant que le module IR n'est pas rétabli.
- **`template: sensor:`** :
  - `Présence Ordre Haut` : détermine qui de Grégory ou Sandrine est prioritaire pour l'affichage "trajet retour" (présent à la maison > ETA < 1 min > ETA < 2 min > ETA connu > aucune info), en tenant compte de la fraîcheur de la donnée Waze (ignore un ETA vieux de plus de 30 min).
- **`command_line: sensor:`** : 3 capteurs RSS (Actu RTBF, Actu Sudinfo, Actu RTL Info) qui téléchargent un flux XML, le parsent en JSON via une chaîne `curl | sed | awk | jq` (nécessite `jq` sur l'hôte, présent par défaut sur la plupart des installations HAOS/Supervised), et exposent un attribut `articles` consommé par la carte `custom:rss-news-card` du dashboard Accueil. `scan_interval: 900` (15 min), `command_timeout: 30`.
- **`input_boolean: simulation_presence`** : interrupteur du dashboard qui pilote la simulation de présence (voir `automations.yaml`).
- **`timer: compte_a_rebours_depart`** : minuterie 60s utilisée par le flux "Je pars" (voir `automations.yaml` + `scripts.yaml`).
- **`input_datetime:`** : 4 dates d'anniversaire (Grégory, Sandrine, Matteo, Hugo) pour l'onglet Anniversaires du dashboard Calendrier. ⚠️ `initial:` ne fixe la date qu'à la toute première création de l'aide — une modification ultérieure depuis l'interface HA n'est plus jamais écrasée par ce fichier.
- **`logger:`** : niveau général `warning`, avec 3 namespaces réduits au silence — voir la section dédiée ci-dessous.
- **`recorder:`** : rétention 7 jours + exclusions ciblées — voir la section dédiée ci-dessous.

## Le bloc `logger:`

Trois namespaces sont passés en `critical`. Les passer en `error` ne servirait à rien : ces messages sont déjà émis en `warning` ou `error`, donc seul `critical` les fait réellement taire.

| Namespace | Pourquoi |
|---|---|
| `custom_components.flightradar24` | Erreurs 429 répétées, le temps que le quota API se libère. Se rétablit seul. |
| `custom_components.bticino_intercom` | Voir ci-dessous. |
| `pybticino.websocket` | Voir ci-dessous. |

**Le cas bticino.** Le websocket vers le cloud Legrand tombe régulièrement (code 1006). Le coordinateur de l'intégration déclare le lien « périmé » après 300 s de silence et force une reconnexion, que le serveur rejette parfois (`server rejected`, `timed out during opening handshake`). La boucle s'auto-entretient toutes les 30 secondes. Au 19/09/2026 elle représentait **~75 % du volume total du journal** (117 entrées sur 153 en 6 heures).

Aucun impact fonctionnel : les 15 entités du visiophone (serrure, éclairage extérieur, 3 caméras, compteur d'appels, état du bridge) fonctionnent normalement, et les dashboards *Ma Maison* et *Sécurité* qui les utilisent s'affichent correctement. Le `logger:` ne touche que la journalisation, jamais les entités.

C'est un bug de l'intégration custom v2.0.2 (dernière version disponible sur HACS). Le correctif propre serait de relever le seuil de péremption dans son `coordinator.py`, mais HACS écraserait la modification à la prochaine mise à jour — à remonter en amont plutôt.

## Le bloc `recorder:`

> Performances : `entity_globs` exclut aussi les entités très bavardes sans intérêt historique (lecteur SpotifyPlus, calendriers, mémoire/stockage de la tablette, distances iBeacon, Browser Mod, instantanés bticino, puissance PoE des switches) : environ 20 000 écritures par jour en moins.

> Planning Matteo : les capteurs `sensor.planning_matteo_*`, `sensor.matteo_form_*`, `sensor.matteo_options_source`,
> `sensor.matteo_prochain_weekend`, `sensor.matteo_statistiques` et les helpers `input_*.matteo_*` sont exclus via
> `entity_globs` (gros attributs / formulaire). La garde de Matteo n'est plus calculée ici : voir `/config/matteo/README.md`
> (l'ancien capteur « Semaine Matteo », basé sur la parité des semaines, a été supprimé car faux après les congés et pivots).

**Contexte.** Au 19/09/2026 la base atteignait **997 Mo pour 11 jours** d'historique, soit ~90 Mo/jour et ~200 000 changements d'état quotidiens. Ça pesait sur la réactivité de l'interface (chaque graphe d'historique interroge ce volume) et sur la durée des redémarrages.

| Réglage | Effet |
|---|---|
| `purge_keep_days: 7` | Une semaine d'historique détaillé. **Les statistiques long terme ne sont pas concernées** : le tableau Énergie garde tout son historique. |
| `commit_interval: 30` | Regroupe les écritures toutes les 30 s au lieu de chaque seconde. Moins d'I/O sur l'eMMC de la HA Green, donc moins d'usure et moins de CPU. |
| `auto_repack: true` | Compacte le fichier SQLite lors de la purge nocturne. Sans ça, les pages libérées restent allouées et le fichier ne rétrécit jamais. |

**Ce qui est exclu, et pourquoi :**

- Les 5 capteurs d'horloge (`sensor.time`, `date_time`, `time_date`, `time_utc`, `date_time_utc`) — une ligne par minute chacun, pour historiser l'heure.
- Les 5 compteurs de fonctionnement (`boiler_ubauptime`, `system_uptime`, `system_uptime_sec`, `system_rxreceived`, `system_txreads`) — monotones, sans intérêt rétrospectif.
- 4 grandeurs électriques instantanées du Shelly EM-50 : puissance apparente, courant, tension, facteur de puissance. À elles seules ~1 800 écritures toutes les 2 h.
- `sensor.prochain_changement_*`, `sensor.mode_horaire_*`, `sensor.ecart_*` — capteurs calculés de `packages/chauffage.yaml`, recalculés en permanence et reconstituables à tout moment.
- `sensor.flightradar24_*` — affichage temps réel uniquement.
- `binary_sensor.*_intrusion_area_1_*` et `binary_sensor.*_franchissement_de_ligne_*` — détections IA Reolink redondantes avec les `_personne` et `_vehicule` conservés.

**⚠️ À ne jamais exclure.** Les capteurs d'énergie du Shelly EM-50 : `..._energie`, `..._aujourd_hui`, `..._cette_semaine`, `..._ce_mois`, et surtout `..._heures_pleines_depuis_dernier_releve` / `..._heures_creuses_depuis_dernier_releve`. Les exclure effacerait leurs statistiques long terme et casserait le tableau de bord Énergie ainsi que le suivi de coût bihoraire. On garde aussi `..._puissance` (puissance réelle), dont le graphe est utile.

## Comment modifier

| Je veux... | Je modifie... |
|---|---|
| Ajouter un flux RSS | Dupliquer un bloc `command_line: sensor:` avec la nouvelle URL, et ajouter la carte correspondante dans le dashboard Accueil |
| Exclure un nouveau capteur à variation rapide de l'historique | L'ajouter à `recorder: exclude: entities:` (nom exact) ou `entity_globs:` (motif) |
| Changer la durée de rétention de l'historique | `recorder: purge_keep_days` |
| Récupérer l'espace disque après avoir ajouté des exclusions | Outils de développement → Actions → `recorder.purge` avec `repack: true` (10-15 min, HA ralenti pendant) |
| Faire taire les logs répétitifs d'une autre intégration | Ajouter son namespace à `logger: logs:` avec le niveau `critical` |
| Ajouter un anniversaire | Un nouveau bloc `input_datetime.anniversaire_xxx`, puis ajouter la personne dans l'onglet Anniversaires du dashboard Calendrier |

## Pièges connus

- `browser_mod:` ne fait rien tant que l'intégration HACS correspondante n'est pas installée et HA redémarré — ne pas s'étonner que les popups tablette ne marchent pas si cette étape a été oubliée.
- `initial:` sur les `input_datetime` d'anniversaire ne s'applique qu'à la création initiale de l'aide — modifier ce fichier après coup ne changera pas une date déjà réglée manuellement dans l'UI.
- **Ajouter une exclusion `recorder:` n'efface pas les données déjà enregistrées.** Il faut une purge manuelle avec `repack: true` pour récupérer l'espace, sinon la base reste à sa taille.
- **Les blocs `logger:` et `recorder:` ne se rechargent pas à chaud.** Un « Tout recharger » depuis Outils de développement ne suffit pas : il faut un `ha core restart`.

## Historique

- **19/09/2026** — Réécriture des blocs `logger:` et `recorder:`. Contexte complet dans les deux sections dédiées ci-dessus. Le même jour : suppression du package obsolète `packages/chaudiere.yaml` (voir [`packages/chaudiere.md`](packages/chaudiere.md)), installation de l'intégration **Workday** (Belgique) dont l'absence empêchait depuis toujours 4 automations de `chauffage.yaml` de se déclencher (voir [`packages/chauffage.md`](packages/chauffage.md)), et passage de l'automation Speedtest de 15 à 30 minutes (voir `automations.md`).