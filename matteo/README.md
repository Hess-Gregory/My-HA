# 👦 Planning Matteo — guide complet

> Gestion de la garde alternée de Matteo (week-ends, congés scolaires, fêtes, anniversaires),
> des **trajets** (qui va le chercher, qui le ramène, où) et de la **banque de trajets**
> (qui doit un trajet à qui). Tout s'utilise depuis Home Assistant :
> **Calendrier › Matteo & Trajets**.

---

## 1. Le principe en 30 secondes (pour tout le monde)

1. **Une ligne = une période** : un week-end (vendredi → dimanche) ou une *part* de congé scolaire
   (ex. « Toussaint, part 1 »). Chaque ligne dit **chez qui** est Matteo et **qui fait les trajets**.
2. Le planning se **génère tout seul** jusqu'à fin 2028 (un week-end sur deux chez papa) ;
   on ne modifie que les exceptions via le bouton **Modifier** du tableau.
3. **Trajets** (seulement quand Matteo est chez papa) :
   - l'**aller** (vendredi) : normalement Grégory va le chercher ;
   - le **retour** (dimanche) : **un coup Grégory, un coup Élodie / Olivier** (alternance stricte).
4. **Lieu** : par défaut **Maurage**. Si Grégory va le chercher ou le ramène ailleurs
   (ICPP Uccle, Forest…), on choisit le lieu et un **motif obligatoire**.
5. **Banque de trajets** : quand un parent fait un trajet à la place de l'autre, la banque le note.
   L'objectif est toujours **0 – 0** (tout le monde a fait ses trajets).

| Code | Signification | Effet banque |
|---|---|---|
| **A** | Grégory fait le trajet (normal) | — |
| **B** | Élodie / Olivier font le trajet (normal) | — |
| **C** | Grégory fait le retour **à la place** d'Élodie / Olivier | Élodie / Olivier doivent 1 trajet (ou rattrapage si Grégory leur devait) |
| **D** | Élodie / Olivier font le retour **à la place** de Grégory | solde leur plus ancienne dette, sinon Grégory leur doit 1 trajet |
| **E** | Aucun trajet (Matteo chez maman) | — |

Un **motif est obligatoire** dès qu'un parent n'a pas fait son trajet (C, D, aller par Élodie / Olivier)
ou que le lieu n'est pas Maurage.

---

## 1 bis. Pourquoi ce dashboard ?

Matteo vit chez sa maman (Élodie, avec Olivier, à **Maurage**) et vient chez son papa (Grégory, à **Engis**)
**un week-end sur deux** et pendant une partie des **congés scolaires**. Au quotidien, plusieurs questions reviennent :

- *Ce week-end, Matteo est chez qui ?* et *qui va le chercher, qui le ramène ?*
- *Qui a déjà fait le trajet à la place de l'autre, et qui doit « rendre » un trajet ?*
- *Comment partager les congés (Toussaint, Noël, Carnaval, Pâques, été) et à quelles dates ?*
- *Un anniversaire ou une fête tombe-t-il chez le bon parent ?*

Avant, tout cela était calculé « de tête » ou avec une simple formule sur le numéro de semaine,
qui devenait fausse dès qu'un congé, un échange ou une fête changeait le rythme. Ce dashboard centralise
**tout le planning jusqu'à fin 2028**, garde l'**historique** de chaque changement, calcule
automatiquement **qui fait quel trajet**, tient la **banque de trajets** pour que chacun fasse sa part,
et **prévient** (notification la veille, congé à définir, événement chez l'autre parent).

## 1 ter. À quoi il sert — ce qu'on voit à l'écran

Onglet **Calendrier › Matteo & Trajets** :

| Section | Ce qu'elle montre |
|---|---|
| **Prochaine période** | Où est Matteo maintenant / la prochaine fois, qui fait l'aller et le retour, le lieu, les événements |
| **Calendrier mensuel** | Un mois en couleurs : week-ends papa / maman, congés, exceptions ; survol d'un jour = détails ; navigation mois par mois |
| **Banque de trajets** | Deux colonnes : ce qu'Élodie / Olivier te doivent et ce que tu leur dois ; ✅ 0 – 0 quand tout est respecté |
| **Statistiques** | Année scolaire : week-ends et nuits de congé chez chacun, trajets non respectés, rattrapages |
| **Imprimer / exporter / partager** | Page imprimable (PDF), Excel, agenda iPhone / Android, lien pour Élodie, 💾 sauvegarde |
| **Lexique** | Explication des couleurs et des codes |
| **Planning** | Le tableau de toutes les dates, avec filtres et bouton **Modifier** sur chaque ligne |

Le calendrier commun (vues *Semaine / Mois* et *Vue d'ensemble*) affiche aussi les périodes de garde sur la ligne « 👦 Matteo ».

## 1 quater. L'organisation, expliquée simplement

### Les week-ends
- Un week-end = **du vendredi soir au dimanche soir**.
- **Un week-end sur deux chez papa**, en partant du week-end de référence du 18/09/2026 (chez papa).
- Si le rythme change durablement (ex. inversion décidée à partir d'une date), on crée un **pivot** :
  tous les week-ends suivants sont inversés, sans toucher au passé.
- Un **échange croisé** permute ponctuellement deux week-ends (papa ↔ maman) ; l'annuler remet les deux comme avant.

### Les congés scolaires
- Les congés officiels (Fédération Wallonie-Bruxelles) sont déjà inscrits jusqu'à l'été 2028.
- Chaque congé est découpé en **parts** : 2 parts (Toussaint, Noël, Carnaval, Pâques) ou 4 parts (été).
  On fixe les dates de chaque part via **Modifier** (ex. Toussaint 2026 : part 1 chez papa du 16/10 au 25/10,
  part 2 chez maman du 26/10 au 01/11).
- Tant qu'une part n'est pas datée, elle apparaît « à définir » et une notification le rappelle à J-21, 14, 7, 3, 1.
- Une part datée **remplace** les week-ends ordinaires qu'elle recouvre (ils disparaissent du tableau et ne comptent plus).
- Noël alterne d'une année à l'autre (une année chez papa, l'autre chez maman) : on le fixe dans les parts.

### Les fêtes et anniversaires
- **Fête des pères** (2e dimanche de juin, Belgique) → week-end chez papa ; **fête des mères** (2e dimanche de mai) → chez maman.
  Si le rythme normal tombe mal, les week-ends sont échangés automatiquement.
- Anniversaires (Noémie, Élodie, Hugo, Grégory, Matteo) et Saint-Valentin : une icône sur le week-end qui contient la date
  (ou le suivant) ; ⚠️ si l'événement est fêté chez l'autre parent que celui qui a Matteo ce week-end-là.

### Les trajets
- Trajets à gérer **seulement quand Matteo est chez papa** (chez maman : aucun trajet).
- **Aller** (vendredi) : c'est normalement Grégory qui va chercher Matteo.
- **Retour** (dimanche) : **alternance stricte**, un coup Grégory, un coup Élodie / Olivier, en suivant le **dernier retour réel**
  (congés compris). Exemple réel : 04/10 retour fait par Grégory à la place d'Élodie / Olivier (Olivier travaillait) →
  25/10 compensation par Élodie / Olivier → puis 15/11 Grégory à leur place (échange C), 29/11 Grégory, 13/12 eux… À Noël 2026 (18/12 → 27/12 chez Grégory, congé qui prolonge le week-end),
  l'alternance **continue** : le 13/12 a été fait par eux, donc Grégory ramène Matteo le 27/12,
  puis eux le 10/01, Grégory le 24/01, etc.
- **Inversion permanente des retours** : dans le formulaire, la case « 🔁 Inverser les retours à partir de cette date »
  donne ce retour à l'autre parent et fait repartir l'alternance de là, pour toutes les dates suivantes. Le parent qui
  fait ainsi un retour de plus doit être compensé : la **date du trajet de compensation est obligatoire** (proposée parmi
  un retour sur deux après l'inversion, là où c'est de nouveau son tour). Ce jour-là, le retour passe en **C** (Grégory fait
  leur retour, +1) ou en **D** (Élodie / Olivier font celui de Grégory, −1) : la banque revient à 0 sans casser l'alternance.
  Un motif est obligatoire. Décocher la case (ou supprimer la ligne) annule l'inversion et remet la compensation à la normale.
- **Lieu** : par défaut Maurage. Parfois Grégory va chercher Matteo à l'école (ICPP Uccle) ou à Forest : on choisit le lieu,
  un **motif** est alors obligatoire, et le lieu s'affiche **en rouge** à côté du nom dans le tableau.
- Le formulaire **suggère** le bon retour et **refuse d'enregistrer** une incohérence (mauvais tour sans le signaler,
  motif manquant…).

### La banque de trajets (objectif 0 – 0)
- Si **Grégory fait le retour à la place** d'Élodie / Olivier (code C) → ils lui doivent **1 trajet**.
- Si **Élodie / Olivier font un trajet à la place** de Grégory (retour D, ou aller) → cela **rembourse** leur plus ancienne
  dette ; s'ils ne devaient rien, c'est **Grégory qui leur doit 1 trajet**, qu'il rendra en faisant un de leurs retours.
- Chaque remboursement est **relié** au trajet qu'il solde (visible dans la fiche Détails) ; supprimer une ligne défait le lien.

## 2. Comment ça marche (pour un développeur)

```
 Tableau de bord (Lovelace)                     Home Assistant                         Disque (/config)
 ┌───────────────────────────┐   script   ┌──────────────────────────┐  python   ┌──────────────────────────────────┐
 │ Formulaire Modifier/Créer │──────────▶ │ script.matteo_planning_* │─────────▶ │ matteo/scripts/*.py               │
 │ (helpers input_*)         │            │ shell_command.*          │           │   écrit data/…overrides.json      │
 └───────────────────────────┘            └──────────────────────────┘           │   + data/matteo_moteur.json       │
            ▲                                                                   └───────────────┬──────────────────┘
            │  capteurs template (vue, stats, prochain week-end, validation)                     │ cat (command_line)
            └────────────── sensor.planning_matteo_engine ◀──────────────────────────────────────┘
```

1. **Source de vérité** : `matteo/data/matteo_planning_overrides.json` (une entrée par ligne, avec historique).
2. **Écriture** : uniquement par les scripts Python (`matteo_save_override.py`, `matteo_set_flags.py`…),
   appelés par des `shell_command` depuis les scripts HA du formulaire.
3. À chaque écriture, `matteo_common.save()` :
   - recalcule les **événements liés** (anniversaires, fêtes) de chaque ligne ;
   - **réaligne les retours futurs** générés automatiquement (alternance stricte) ;
   - écrit un **fichier compact** `matteo_moteur.json` (champs utiles + calculs : week-ends masqués par un congé, lieux…).
4. HA lit ce fichier compact avec **un seul** capteur `command_line` : `sensor.planning_matteo_engine`.
5. Les **macros Jinja** (`custom_templates/matteo_planning.jinja`) filtrent / paginent / valident à partir de ce capteur.
6. Les capteurs lourds sont **déclenchés** (trigger-based) : ils ne se recalculent que quand quelque chose change
   (et une fois par heure pour la date du jour), jamais chaque minute.
7. Après chaque écriture, l'automatisation d'export régénère l'agenda **.ics**, la page **imprimable**, le **CSV**
   et le calendrier local HA **« Matteo »**.

---

## 3. Qui fait quoi — carte des fichiers

### Dossier principal `/config/matteo/`
| Fichier | Rôle | Doc |
|---|---|---|
| `scripts/matteo_common.py` | Bibliothèque commune : chemins, chargement / sauvegarde, alternance, banque, moteur compact, lieux | [md](scripts/matteo_common.md) |
| `scripts/matteo_save_override.py` | Créer / modifier une ligne (appelé par le formulaire) | [md](scripts/matteo_save_override.md) |
| `scripts/matteo_set_flags.py` | Supprimer (masquer) ou suspendre une ligne | [md](scripts/matteo_set_flags.md) |
| `scripts/matteo_delete_override.py` | Effacement définitif (administration) | [md](scripts/matteo_delete_override.md) |
| `scripts/generate_matteo_planning.py` | Complète le planning jusqu'au 31/12/2028 (sans rien écraser) | [md](scripts/generate_matteo_planning.md) |
| `scripts/generate_ics.py` | Agenda .ics partagé + calendrier local « Matteo » | [md](scripts/generate_ics.md) |
| `scripts/generate_print.py` | Page imprimable (PDF) + export Excel (CSV) | [md](scripts/generate_print.md) |
| `scripts/sauvegarde.py` | Archive complète (code + données + dashboard) | [md](scripts/sauvegarde.md) |
| `data/matteo_planning_overrides.json` | **Source de vérité** du planning | — |
| `data/matteo_moteur.json` | Vue compacte lue par HA (générée, ne pas éditer) | — |
| `data/matteo_options.json` | Listes des menus : types, motifs, lieux | — |
| `data/ics_token` | Jeton secret des liens de partage (non versionné) | — |
| `sauvegardes/` | Archives `matteo_AAAAMMJJ_HHMM.tar.gz` (8 dernières, non versionné) | — |

### Configuration Home Assistant `/config/packages/matteo/`
| Fichier | Rôle | Doc |
|---|---|---|
| `matteo_calendar.yaml` | Capteur moteur + banque de trajets | [md](../packages/matteo/matteo_calendar.md) |
| `matteo_planning_actions.yaml` | Formulaire : helpers, scripts charger / enregistrer / supprimer, validation | [md](../packages/matteo/matteo_planning_actions.md) |
| `matteo_planning_vue.yaml` | Tableau : filtres, pagination, calendrier mensuel | [md](../packages/matteo/matteo_planning_vue.md) |
| `matteo_planning_options.yaml` | Menus déroulants synchronisés depuis `matteo_options.json` | [md](../packages/matteo/matteo_planning_options.md) |
| `matteo_notifications.yaml` | Prochaine période, statistiques, notifications, export agenda | [md](../packages/matteo/matteo_notifications.md) |
| `matteo_maintenance.yaml` | Sauvegarde manuelle + hebdomadaire | [md](../packages/matteo/matteo_maintenance.md) |

### Autres emplacements imposés par Home Assistant
| Fichier | Rôle | Doc |
|---|---|---|
| `/config/custom_templates/matteo_planning.jinja` | Macros : tableau, fiche détail, stats, retour attendu, validation | [md](../custom_templates/matteo_planning.md) |
| `/config/www/matteo/` | Fichiers publics générés (.ics, page imprimable, CSV) — non versionné | — |
| `.storage/lovelace.dashboard_calendrier` | Le dashboard (vues « Vue d'ensemble » et « Matteo & Trajets ») | — |
| `.storage/local_calendar.matteo.ics` | Calendrier HA « Matteo » (rempli automatiquement) | — |

---

## 4. Règles métier détaillées

- **Garde** : un week-end sur deux chez papa à partir du week-end de référence (18/09/2026) ;
  un **pivot** inverse la garde de tous les week-ends suivants (non rétroactif).
- **Congés** : découpés en parts (2, ou 4 pour l'été) à dater via « Modifier ». Une part définie
  **masque** les week-ends ordinaires qu'elle recouvre : leurs trajets ne comptent plus
  (ni banque, ni alternance, ni notifications).
- **Retours** : alternance stricte d'après le **dernier retour réel** (congés compris). Après A ou D c'est
  le tour d'Élodie / Olivier ; après B ou C c'est le tour de Grégory. Une ligne peut porter
  `reprise_alternance: true` (uniquement si les parents en conviennent explicitement) : l'alternance repart de cette date.
  Les lignes futures générées automatiquement sont réalignées à chaque enregistrement ; les lignes
  enregistrées à la main ne sont jamais modifiées.
- **Banque** (objectif 0 – 0) : voir tableau des codes. Les rattrapages sont liés entre eux
  (`rattrape_par`, `report_date`, `solde_dette`, `soldee_par`) et se défont si une ligne est supprimée.
- **Échange croisé** : deux week-ends échangent leur garde ; l'annulation restaure les deux.
- **Fêtes** : fête des pères chez papa, fête des mères chez maman (échange automatique avec le week-end suivant).
- **Événements** (anniversaires, Saint-Valentin…) : affichés sur le week-end qui les contient ou le suivant ;
  ⚠️ si l'événement est fêté chez l'autre parent.
- **Lieux** : Maurage par défaut ; autre lieu ⇒ affiché en rouge dans le tableau + motif obligatoire.
- **Supprimer** = `hide: true` (disparaît) · **Suspendre** = « Date active » décochée (`visible_in_ui: false`).

---

## 5. Opérations courantes

| Je veux… | Je fais… |
|---|---|
| Modifier une date | Tableau → ligne → **Modifier** (le formulaire refuse d'enregistrer tant qu'une règle n'est pas respectée) |
| Ajouter une exception | Bouton **Ajouter une date** |
| Tout recalculer | `python3 /config/matteo/scripts/matteo_common.py` puis mettre à jour `sensor.planning_matteo_engine` |
| Prolonger le planning | Modifier `END_DATE` dans `generate_matteo_planning.py` puis l'exécuter |
| Ajouter un lieu / motif | Éditer `matteo/data/matteo_options.json` (listes `lieux`, `motifs_trajet`) — les menus se mettent à jour seuls |
| Sauvegarder | Bouton **💾 Sauvegarder** (onglet Matteo & Trajets) ou automatique le dimanche 03h17 |
| Restaurer | Extraire une archive de `matteo/sauvegardes/` dans `/config`, puis redémarrer HA |

## 6. Versioning

Les fichiers `packages/matteo/*.yaml` et le dashboard sont suivis par le versioning automatique du dépôt
(hook git `post-commit` → `versions.json` → footer de chaque onglet). Voir `/config/README.md`.
Toute modification d'un fichier doit mettre à jour son `.md` compagnon dans le même commit.
