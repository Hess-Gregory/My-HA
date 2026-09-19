# packages/chaudiere.yaml — Documentation

> **⚠️ Ce fichier a été entièrement réécrit le 19/09/2026.** Jusqu'à cette date,
> `packages/chaudiere.yaml` était une **copie obsolète de `chauffage.yaml`**
> (version « vannes Bosch pas encore installées »), et ce `.md` documentait sa
> suppression. Le package obsolète a été supprimé, et le nom a été réattribué à
> un vrai package chaudière. Voir la section « Historique » en bas.

## Rôle du fichier

Surveillance de la chaudière **Junkers ZWB 28-3 CE** (Bosch Thermotechnik) via
la passerelle **EMS-ESP (BBQKees)** en MQTT. Ce package ne pilote rien : il
**observe** et **alerte**. Le pilotage du chauffage (modes par pièce, consignes,
planning, vannes Bosch) est dans [`packages/chauffage.yaml`](chauffage.md).

Ne pas confondre non plus avec l'automation **« Chaudière - Alerte entretien
légal & constructeur »**, qui vit dans `automations.yaml` (rappel quotidien à 8h
sur les échéances d'entretien, contact Ets. Dubois) et qui reste indépendante de
ce package.

## Entités créées

### Capteurs de synthèse (`template:`)

- **`sensor.chaudiere_etat`** — état lisible de la chaudière : `OK`,
  `Entretien demandé (Hxx)` ou `Défaut <code>`. L'icône suit l'état.
  Attributs : `code_defaut`, `message_entretien`, et `detail` (phrase complète
  expliquant quoi faire).
- **`sensor.chaudiere_heures_bruleur`** — `sensor.boiler_burnworkmin` converti
  en heures. Attributs : `allumages` et `minutes_par_allumage`.
- **`sensor.chaudiere_heures_avant_entretien`** — recopie
  `number.boiler_maintenancetime` (compteur interne de la chaudière).

### Mémoire des défauts

- **`input_text.chaudiere_dernier_code_defaut`** — dernier code avec sa date.
- **`input_text.chaudiere_historique_defauts`** — historique glissant, tronqué
  à 255 caractères (limite HA sur `input_text`), les plus anciens sortent.
- **`input_datetime.chaudiere_dernier_defaut_horodatage`** — horodatage exact.

### Automations

| ID | Ce qu'elle fait |
|---|---|
| `chaudiere_alerte_code_defaut_ems_esp` | `sensor.boiler_servicecodenumber` passe au-dessus de 0 pendant 1 min → notification push + notification persistante + enregistrement dans les 3 aides ci-dessus |
| `chaudiere_retour_normal_code_defaut` | Le code repasse à 0 pendant 2 min → ferme la notification persistante et confirme |
| `chaudiere_alerte_message_entretien` | Tous les jours à 9h, si `sensor.boiler_maintenancemessage` ≠ `H00` → rappel push |
| `chaudiere_alerte_passerelle_injoignable` | `sensor.boiler_curflowtemp` indisponible plus de 30 min → alerte (passerelle débranchée, MQTT coupé, souci réseau sur le VLAN Home) |

Les notifications partent sur `notify.mobile_app_smartphone_greg`.

## Entités EMS-ESP utilisées

Toutes vérifiées comme existantes et alimentées au moment de l'écriture :

| Entité | Valeur au 19/09/2026 | Sens |
|---|---|---|
| `sensor.boiler_servicecodenumber` | `0` | Code défaut — 0 = aucun |
| `sensor.boiler_maintenancemessage` | `H00` | Message d'entretien — H00 = rien à signaler |
| `number.boiler_maintenancetime` | `2300` h | Compteur avant entretien programmé |
| `sensor.boiler_burnworkmin` | `302302` min | Minutes de fonctionnement brûleur |
| `sensor.boiler_burnstarts` | `309702` | Nombre d'allumages brûleur |
| `sensor.boiler_curflowtemp` | `73.3` °C | Température de départ (sert de témoin de vie) |

## Ce qui n'est volontairement PAS ici

**L'alerte « pression d'eau basse ».** L'ancien package en contenait une
(`automation.chaudiere_alerte_pression_basse`, aujourd'hui orpheline). Elle ne
peut pas fonctionner : **aucun des 66 capteurs EMS-ESP de l'installation ne
remonte la pression du circuit**. La Junkers ZWB 28-3 ne l'expose pas sur le bus
EMS. Pour surveiller la pression il faut un capteur connecté indépendant.

**Le verrouillage par code technicien.** L'ancien package proposait un
déverrouillage temporaire par code à 4 chiffres avec reverrouillage automatique
au bout d'1h30 (automations `chaudiere_technicien_verification_code` et
`chaudiere_technicien_reverrouillage_auto`, scripts `chaudiere_pin_*`,
`chaudiere_verrouiller_maintenant`). Son code source est perdu et son
comportement exact (ce qu'il verrouillait au juste) n'est pas reconstituable
depuis les seuls identifiants d'entités. À réécrire si le besoin revient.

## Comment modifier

| Je veux... | Je fais... |
|---|---|
| Changer le destinataire des alertes | Remplacer `notify.mobile_app_smartphone_greg` dans les 4 automations |
| Recevoir aussi les alertes sur le téléphone de Sandrine | Ajouter une action `notify.mobile_app_sandrine_smartphone` en parallèle |
| Déplacer le rappel d'entretien quotidien | `triggers: trigger: time: at:` de `chaudiere_alerte_message_entretien` (9h par défaut) |
| Changer le délai avant l'alerte passerelle | Le `for:` de `chaudiere_alerte_passerelle_injoignable` (30 min par défaut) |
| Afficher l'état sur un dashboard | Utiliser `sensor.chaudiere_etat` et son attribut `detail` |
| Rendre l'historique des défauts plus long | `input_text` est plafonné à 255 caractères par HA — pour aller au-delà il faut passer par un `logbook` ou un fichier |

## Pièges connus

- **Le nom `chaudiere.yaml` a servi à deux choses différentes.** Toute
  documentation, sauvegarde ou commit antérieur au 19/09/2026 qui parle de
  `chaudiere.yaml` désigne l'ancienne copie de `chauffage.yaml`, pas ce
  package. Les deux fichiers de `backups_claude/` (`chaudiere.yaml` et
  `chaudiere.yaml.bak`) sont des copies de l'ancien, sans rapport avec ici.
- **Des entités orphelines subsistent** en `unavailable` dans le registre :
  `automation.chaudiere_alerte_pression_d_eau_basse`,
  `automation.chaudiere_enregistrement_historique_code_defaut`,
  `automation.chaudiere_reverrouillage_automatique_apres_1h30`,
  `automation.chaudiere_verification_code_technicien_4_chiffres`,
  `automation.zz_obsolete_chaudiere_alerte_code_defaut`, et les 4 scripts
  `chaudiere_pin_*` / `chaudiere_verifier_code_technicien` /
  `chaudiere_verrouiller_maintenant`. Elles ne gênent pas mais peuvent être
  supprimées dans Paramètres → Appareils et services → Entités.
- **`sensor.boiler_ubauptime` est exclu du recorder** (voir
  `configuration.md`) : c'est un compteur monotone qui changeait toutes les
  minutes et pesait lourd dans la base d'historique.

## Observation relevée à l'écriture

302 302 minutes de brûleur pour 309 702 allumages, soit **moins d'une minute
par démarrage**. C'est du court-cycle marqué, cohérent avec une chaudière de
28 kW installée sur un appartement de 90 m² — largement surdimensionnée pour le
besoin. Sans gravité immédiate, mais c'est ce qui use un brûleur. Les deux
leviers sont la courbe de chauffe (voir `chauffage.yaml`, automation
`chauffage_courbe_chauffe_ajustement`) et `number.boiler_selflowtemp`, réglé à
75 °C, ce qui est élevé.

## Historique

- **19/09/2026** — Suppression de l'ancien `chaudiere.yaml` (copie obsolète de
  `chauffage.yaml` datant d'avant l'installation des vannes Bosch). Sa présence
  provoquait 4 erreurs `duplicate key` à chaque chargement et neutralisait
  `chauffage.yaml`, dont l'automation
  `chauffage_appliquer_consignes_sur_les_vannes` — celle qui pousse les
  consignes sur les vannes — n'avait donc jamais tourné. Le nom a ensuite été
  réattribué au présent package de surveillance chaudière.