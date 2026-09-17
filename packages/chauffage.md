# packages/chauffage.yaml — Documentation

## Rôle du fichier

Pilote le chauffage de l'appartement (90m², 2 chambres, SdB, couloir, séjour) via 5 vannes connectées Bosch Radiator Thermostat II M (intégration HACS "Bosch SHC"). Chaque pièce a son propre mode et son propre planning horaire (contrairement à une v1 antérieure avec un mode unique pour tout l'appart). Pilote aussi la chaudière elle-même : marche/arrêt du circuit central selon la demande réelle, et température de départ via une courbe de chauffe (compensation météo).

Dépend de l'intégration **Workday** (`binary_sensor.workday_sensor`, pays Belgique) pour ignorer automatiquement week-ends et jours fériés belges dans le planning "jours travaillés".

## Vue d'ensemble des entités créées

- **`input_select`** : un mode par pièce (`mode_chambre_adulte`, `mode_chambre_enfants`, `mode_piece_de_vie`, `mode_salle_de_bain`, `mode_couloir`), options communes `Été / Hors-gel / Éco / Nuit / Confort / Boost / Manuel`.
- **`input_boolean`** : `routine_activee` (interrupteur maître), `presence_exceptionnelle` (RTT/télétravail), `chauffage_courbe_active` (courbe météo, actuellement activable/désactivable — voir section courbe plus bas).
- **`input_number`** : températures manuelles par pièce (`temp_manuel_xxx`), `temp_boost_cible` (partagée), 4 réglages de courbe de chauffe (`chauffage_courbe_*`).
- **`sensor` (template)** : consignes par pièce (`consigne_xxx`), écarts consigne/réel (`ecart_xxx`), écart minimum global (`ecart_demande_min`), textes d'affichage dashboard (`prochain_changement_xxx`, `mode_horaire_xxx`), consigne de départ chaudière calculée (`chauffage_consigne_depart_courbe`).
- **`automation`** : planning horaire par pièce, vacances/maladie, présence réelle (alarme + trajet Waze), coupure auto du Boost, application des consignes sur les vannes, pilotage marche/arrêt du circuit chaudière, ajustement courbe de chauffe.
- **`script`** : boutons manuels (SdB confort on/off, sieste enfant/adulte début/fin, départ/retour temporaire).

## 1. Modes par pièce (section 1)

Chaque pièce a SON PROPRE `input_select` de mode. Ordre de la liste (du plus froid au plus chaud) : `Été < Hors-gel < Éco < Nuit < Confort < Boost`, avec `Manuel` toujours en dernier (température réglable, donc sans place fixe).

- **`Manuel`** : prend la consigne dans `input_number.temp_manuel_xxx` de la pièce.
- **`Boost`** : chauffe fort à `input_number.temp_boost_cible` (23°C par défaut, **partagée par les 5 pièces**). Se coupe automatiquement après 2h (section 7bis) et reprend le mode que la pièce DEVRAIT avoir à cet instant selon son horaire (pas juste "Confort").
- **`routine_activee`** : coupe-le pour désactiver tout le planning automatique (vacances/maladie) → tout l'appart passe en Hors-gel. Rallume-le pour reprendre la routine normale (retour immédiat en Confort).
- **`presence_exceptionnelle`** : bouton pour un jour travaillé où vous êtes finalement à la maison (RTT, télétravail). Passe l'appart en Confort dans la journée. Se remet à `off` tout seul au prochain changement de mode horaire programmé — pas besoin d'y repenser.
- **`chauffage_courbe_active`** : ⚠️ actuellement **en pause** dans la logique (voir section courbe de chauffe plus bas) suite à un constat matériel sur la chaudière — le commentaire du fichier explique pourquoi.
- Le **couloir** n'a volontairement AUCUN planning horaire : reste toujours en `Éco`, sauf Hors-gel en vacances. Changez-le uniquement à la main sur le dashboard si besoin.
- **Chambre enfants, chambre adulte et salle de bain** ne sont PLUS chauffées automatiquement en journée quand inoccupées : elles restent en Éco/Nuit sauf activation manuelle (sieste, douche — boutons section 10). La prochaine transition programmée reprend toujours la main normalement.
- La **chambre adulte** est pré-chauffée à 22h30 TOUS LES JOURS (semaine + week-end), pour ne jamais se coucher dans des draps froids.

## 2. Consignes par pièce (section 2, template sensors)

Chaque `sensor.consigne_xxx` calcule la température cible de sa pièce selon le mode sélectionné. C'est **ici** qu'on ajuste les températures cibles : dictionnaire `consignes` dans chaque bloc, ex. pour la chambre adulte :

```yaml
{% set consignes = {'Confort': 19, 'Éco': 17, 'Nuit': 17, 'Hors-gel': 10, 'Été': none} %}
```

Valeurs actuelles par pièce (Confort / Éco / Nuit / Hors-gel) :

| Pièce | Confort | Éco | Nuit | Hors-gel |
|---|---|---|---|---|
| Chambre adulte | 19 | 17 | 17 | 10 |
| Chambre enfants | 20 | 17 | 20 (proche de Confort, pas de couverture la nuit) | 12 |
| Couloir | 18 | 17 | 16 | 10 |
| Pièce de vie | 20 | 17 | 17 | 10 |
| Salle de bain | 21 | 18 | 18 | 12 |

`Été` = `none` → chauffage coupé pour cette pièce (`off`). `Manuel` et `Boost` ignorent ce dictionnaire et prennent directement l'`input_number` correspondant.

**Pour changer une température cible : modifiez juste le chiffre dans le dictionnaire `consignes` de la pièce concernée, rien d'autre à toucher.**

## 3. Écarts consigne/réelle et demande globale (section 3)

`sensor.ecart_xxx` = température réelle (sonde Sonoff Zigbee) moins consigne, par pièce. Sert à vérifier que le planning est cohérent et, plus tard, à détecter une vanne bloquée/mal réglée.

`sensor.ecart_demande_min` = le plus petit écart parmi les pièces ayant une consigne active (ignore les pièces en `Été`). C'est ce capteur qui pilote la marche/arrêt du circuit central de la chaudière (section 9bis) : si aucune pièce n'a réellement besoin de chaleur, peu importe son mode affiché, le circuit s'éteint.

## 4. Textes d'affichage dashboard (sections 3bis/3ter)

`sensor.prochain_changement_xxx` génère une phrase du type *"Mode Confort actuellement activé — le mode Éco sera activé aujourd'hui à 07:05."*, calculée à partir du planning fixe (section 4/5) + `binary_sensor.workday_sensor`. `sensor.mode_horaire_xxx` fait l'inverse : donne le mode que la pièce DEVRAIT avoir maintenant selon son horaire (sert notamment à la coupure auto du Boost, section 7bis). **Ces deux familles de capteurs dupliquent les horaires du planning (sections 4/5) : si vous changez une heure dans le planning, pensez à la reporter ici aussi**, sinon l'affichage dashboard et la coupure du Boost restent basés sur l'ancien horaire.

## 5. Planning automatique — jours travaillés (section 4)

Actif seulement si `routine_activee = on` ET `binary_sensor.workday_sensor = on` (donc ignoré automatiquement week-end + jours fériés belges).

| Heure | Automatisation | Effet |
|---|---|---|
| 06:00 | Pré-chauffe parents + salon | Chambre adulte + pièce de vie → Confort |
| 06:15 | Chambre enfant | Chambre enfants → Confort |
| 07:05 | Tout le monde parti | Chambre adulte, enfants, pièce de vie, SdB → Éco (sauf si `presence_exceptionnelle`) |
| — | Présence exceptionnelle (déclenché par le bouton) | Toutes les pièces → Confort immédiatement |
| 16:40 | Retour Sandrine + enfant | Pièce de vie + chambre enfants → Confort |
| 22:30 | Pré-chauffe chambre adulte | Chambre adulte → Confort (tous les jours, semaine ET week-end) |

## 6. Planning automatique — tous les jours (section 5)

| Heure | Automatisation | Effet |
|---|---|---|
| 20:30 | Coucher du petit | Chambre enfants → Nuit |
| 23:15 | Coucher adultes | Chambre adulte → Nuit ; pièce de vie + SdB → Éco |
| 08:00 (week-end/férié uniquement) | Matin week-end | Pièce de vie → Confort |

**Pour changer une heure de planning : modifiez le `at:` du trigger `time` de l'automatisation concernée.** Si cette heure est aussi utilisée pour l'affichage dashboard ou la coupure Boost, reportez le changement dans les blocs `sensor.prochain_changement_xxx` / `sensor.mode_horaire_xxx` correspondants (section 4 ci-dessus).

## 7. Vacances / maladie (section 6)

Piloté uniquement par `input_boolean.routine_activee` :
- passage à `off` → toutes les pièces (y compris couloir) → `Hors-gel`.
- retour à `on` → Confort immédiat sur chambre adulte/enfants/pièce de vie/SdB, couloir → Éco. Le planning normal reprend ensuite la main tout seul.

## 8. Présence réelle — alarme + trajet (section 7)

Deux automatisations complémentaires au planning horaire (respectent `routine_activee`) :
- **Maison vide confirmée** : alarme armée absence + porte d'entrée fermée + ni Sandrine ni Gregory détectés "home", **limité aux jours NON travaillés** (les jours travaillés, l'automatisation 07:05 fait déjà ce travail). ⚠️ Si le capteur de porte Ajax inverse ouvert/fermé, il faut inverser la condition `state: "off"` sur `binary_sensor.hall_dentree_porte_entree_porte`.
- **Retour imminent** : dès que le trajet Waze de Sandrine ou Gregory passe sous 10 min → pièce de vie en Confort.

## 9. Mode Boost — coupure automatique après 2h (section 7bis)

Chaque pièce qui passe en `Boost` lance sa propre minuterie de 2h (mode `parallel`, indépendant par pièce). À l'échéance, la pièce reprend le mode que `sensor.mode_horaire_xxx` indique pour cet instant précis (pas systématiquement "Confort") — sauf si vous avez déjà changé la pièce vous-même entretemps (rien ne se passe alors). Pour changer la durée du Boost : modifier le `delay: "02:00:00"`. Pour changer la température du Boost : `input_number.temp_boost_cible`.

## 10. Application des consignes sur les vannes (section 9)

Vannes Bosch intégrées via HACS "Bosch SHC" (`tschamm/mosandlt`), qui crée un vrai `climate` par pièce (le salon/cuisine/salle à manger, 3 vannes physiques, sont déjà fusionnés côté Bosch en une seule entité `climate.living`). Cette automatisation pousse la consigne calculée (section 2) sur chaque `climate.xxx` dès qu'elle change, ou coupe la vanne (`hvac_mode: off`) si la consigne vaut `off` (mode Été).

⚠️ **Point de vigilance signalé dans le fichier** : vérifier dans *Outils de développement > États > climate.living > attributs > hvac_modes* que `off` est bien supporté par ces thermostats Bosch. S'il ne l'est pas (parfois limités à heat/auto), remplacer la branche "Été" par une consigne basse (ex. 10°C) au lieu de `hvac_mode: off`.

## 11. Pilotage de la chaudière (sections 9bis / 9ter / 3quater)

Deux mécanismes indépendants et complémentaires :

- **9bis — Marche/arrêt du circuit** (`switch.boiler_heatingactivated`) : basé sur `sensor.ecart_demande_min`, pas juste "toutes les pièces en Été". Hystérésis : rallume si écart < -0.3°C pendant 5 min, coupe si écart > 0.2°C pendant 15 min, + une vérification périodique toutes les 10 min en filet de sécurité (car un `numeric_state` avec `for` ne redémarre son décompte que sur un changement d'état réel — si le capteur reste parfaitement stable, l'évaluation peut ne jamais se redéclencher sans ce filet). Pour ajuster la sensibilité : modifier les seuils `below`/`above` et les `for`.
- **9ter — Courbe de chauffe (compensation météo)** : ajuste en continu `number.boiler_selflowtemp` (température de départ) selon `weather.forecast_maison`, via une interpolation linéaire entre 2 points réglables (section 3quater / `input_number.chauffage_courbe_*`) : température extérieure froide/douce de référence → température de départ correspondante. Se désactive proprement via `input_boolean.chauffage_courbe_active`. Rappel toutes les 5 min (+ à chaque démarrage de pompe/circuit) car la chaudière semble revenir seule à sa valeur installateur par défaut (75°C) sans module HC1/RC si elle ne reçoit pas de rappel assez fréquent.
- **⚠️ Statut actuel (constaté le 08/09/2026)** : la chaudière a deux molettes physiques (ECS + radiateurs) qui réaffirment leur propre valeur toutes les ~2 min quoi qu'on envoie par MQTT — la courbe de chauffe se bat donc actuellement contre ces molettes. Mise en pause au profit de la coupure sur demande réelle (9bis, qui elle ne rencontre pas ce problème). Réactivable si besoin, idéalement avec un rappel plus fréquent (ou le Scheduler intégré à EMS-ESP côté passerelle plutôt que Home Assistant).

**Pour ajuster la courbe** : `chauffage_courbe_temp_ext_froid`/`chauffage_courbe_depart_froid` (point froid) et `chauffage_courbe_temp_ext_doux`/`chauffage_courbe_depart_doux` (point doux) dans les réglages du dashboard (input_number, section 1bis). Si les pièces peinent à atteindre leur consigne par grand froid, monter la valeur "départ froid". Ne pas descendre "départ doux" sous ~28°C (certains radiateurs sous-dimensionnés peinent à monter en régime).

## 12. Boutons manuels (section 10)

Scripts sans minuterie ni toggle, à ajouter sur le dashboard : `chauffage_sdb_activer_confort` / `_desactiver_confort`, `chauffage_sieste_enfant_debut` / `_fin`, `chauffage_sieste_adulte_debut` / `_fin`, `chauffage_depart_temporaire` / `chauffage_retour_temporaire`. Aucun n'a besoin d'être "désactivé" après usage : la prochaine transition programmée reprend toujours la main normalement.

## Guide pratique — que modifier selon le besoin

| Je veux... | Je modifie... |
|---|---|
| Changer une température cible d'un mode (ex. Confort chambre enfants) | Le dictionnaire `consignes` dans `sensor.consigne_chambre_enfants` (section 2) |
| Changer une heure de planning | Le `trigger: time: at:` de l'automatisation concernée (section 4/5), **+ reporter l'heure** dans les capteurs `prochain_changement_xxx` / `mode_horaire_xxx` correspondants (section 3bis/3ter) |
| Changer la température ou la durée du Boost | `input_number.temp_boost_cible` (température) ou le `delay:` dans `chauffage_boost_coupure_auto` (durée) |
| Ajuster la sensibilité de coupure du circuit chaudière | Les seuils `below`/`above`/`for` dans `chauffage_demande_globale_circuit` (section 9bis) |
| Ajuster la courbe de chauffe | Les 4 `input_number.chauffage_courbe_*` (aucune modification YAML nécessaire) |
| Remplacer une sonde de température physique (ex. changement de matériel) | L'`entity_id` du capteur Sonoff dans `sensor.ecart_xxx` (section 3) — et dans les automatisations "Appliquer consignes sur les vannes" si l'entité `climate` change aussi |
| Ajouter une nouvelle pièce | Dupliquer : un `input_select.mode_xxx` (section 1), un `input_number.temp_manuel_xxx` (section 1bis), un `sensor.consigne_xxx` + `sensor.ecart_xxx` (sections 2/3), l'inclure dans `ecart_demande_min`, ajouter son planning si besoin (section 4/5), et l'ajouter dans la liste `rooms` de `chauffage_appliquer_consignes_vannes` (section 9) |

## Pièges connus / points de vigilance

- Les capteurs `prochain_changement_xxx` et `mode_horaire_xxx` **dupliquent en dur** les heures du planning (sections 4/5) — toute modification d'horaire doit être reportée aux deux endroits, sinon l'affichage dashboard et la coupure du Boost restent incohérents avec le vrai planning.
- `hvac_mode: off` sur les vannes Bosch n'est pas garanti supporté (section 9) — à vérifier avant de compter dessus pour couper une pièce en mode Été.
- La courbe de chauffe (9ter) est actuellement neutralisée en pratique par les molettes physiques de la chaudière — ne pas s'étonner si `chauffage_courbe_active` semble sans effet visible tant que ce point matériel n'est pas résolu.
- Le couloir n'a intentionnellement aucun planning : ne pas ajouter d'automatisation dessus par erreur en pensant "oublié".
