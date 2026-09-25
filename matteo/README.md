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
  `reprise_alternance: true` (ex. Noël 2026) : l'alternance repart de cette date.
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
