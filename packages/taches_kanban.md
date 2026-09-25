# packages/taches_kanban.yaml — Documentation

## Rôle du fichier

Kanban familial basé sur Todoist : un projet par personne (Grégory, Matteo, Sandrine) + un projet "Famille", chacun avec ses sections (colonnes). Ce fichier expose les données brutes (tâches + sections) et fournit toutes les actions CRUD (créer/modifier/déplacer/terminer/rouvrir/supprimer une tâche) via l'API Todoist. Système **indépendant** de `horaires_pro.yaml` (projet Todoist différent, logique différente).

## Projets Todoist concernés (IDs à connaître pour toute évolution)

| Personne | ID projet Todoist |
|---|---|
| Grégory | `6hJq6cQ4hX7Q8jQF` |
| Matteo | `6hJq6gmCgJCC38R4` |
| Sandrine | `6hJq6fXqpFc5ppCC` |
| Famille | `6hW4vXG7V9GffH67` |

## Entités créées

- **`rest` (sensors)**, un couple par personne/projet (8 capteurs au total) :
  - `Kanban <Personne> Projet` : métadonnées du projet (`GET /projects/{id}/full`), expose `project` (nom, etc.) et `sections` (liste des colonnes) en `json_attributes`.
  - `Kanban <Personne>` : liste des tâches du projet (`GET /tasks?project_id=...&limit=200`), expose `results` + `next_cursor`.
  - `scan_interval: 300` sur les 8 capteurs (rafraîchissement automatique toutes les 5 min, en plus des rafraîchissements forcés après chaque action via `homeassistant.update_entity`).
- **`sensor` (template)** : `Kanban Familial`, capteur d'agrégation : son état est le nombre total de tâches (somme des 4 projets), et ses attributs exposent `tasks` (liste fusionnée des 4 projets) et `sections_gregory`/`sections_matteo`/`sections_sandrine`/`sections_famille` (les sections de chaque projet, pour construire les colonnes du dashboard).
- **`rest_command`** (bas niveau, appelés par les scripts ci-dessous, jamais directement depuis le dashboard) : `todoist_create_task` (POST `/tasks`), `todoist_update_task` (POST `/tasks/{id}`), `todoist_delete_task` (DELETE `/tasks/{id}`), `todoist_move_task` (POST `/tasks/{id}/move`), `todoist_close_task` (POST `/tasks/{id}/close`), `todoist_reopen_task` (POST `/tasks/{id}/reopen`). Tous prennent un `payload` déjà construit en JSON par le script appelant (sauf `delete`/`close`/`reopen`, qui n'ont pas besoin de payload).
- **`script`** : `kanban_todoist_add_task`, `kanban_todoist_update_task`, `kanban_todoist_delete_task`, `kanban_todoist_move_task`, `kanban_todoist_close_task`, `kanban_todoist_reopen_task` — un par action, tous en `mode: queued` (les appels s'empilent et s'exécutent l'un après l'autre plutôt que de se court-circuiter), et tous rafraîchissent les 4 capteurs `sensor.kanban_xxx` après un court délai (800ms-1000ms, le temps que Todoist enregistre le changement côté serveur).

## Construction dynamique du payload (`kanban_todoist_add_task` / `update_task`)

Ces deux scripts acceptent une longue liste de champs optionnels (`project_id`, `section_id`, `parent_id`, `content`, `description`, `labels`, `priority`, `assignee_id`, `due_string`, `due_date`, `due_datetime`, `due_lang`, `deadline_date`, `duration`, `duration_unit`). Le payload final est construit par une chaîne de `combine(...)` Jinja : chaque champ n'est ajouté au dictionnaire que s'il est **défini ET non vide** (`if xxx is defined and xxx not in [none, ""]`), pour ne jamais envoyer un champ vide à Todoist qui écraserait une valeur existante par erreur.

Point notable dans `kanban_todoist_update_task` : `due_date` n'est inclus que si ni `due_string` ni `due_datetime` ne sont fournis, et `due_datetime` n'est inclus que si `due_string` n'est pas fourni — ordre de priorité explicite entre les 3 façons de définir une échéance, pour éviter d'envoyer des champs d'échéance contradictoires à l'API.

## Comment modifier

| Je veux... | Je modifie... |
|---|---|
| Ajouter une personne/un projet Kanban | Dupliquer un bloc `rest:` (projet + tâches) avec le nouvel ID Todoist, ajouter les 2 nouvelles entités à la fusion `tasks`/`sections_xxx` de `Kanban Familial`, et ajouter les 2 nouvelles entités à la liste `entity_id` rafraîchie en fin de CHAQUE script (`kanban_todoist_add_task`, `update_task`, `delete_task`, `move_task`, `close_task`, `reopen_task`) |
| Ajouter un champ à la création/modification d'une tâche | Ajouter le `field:` correspondant dans le script concerné, puis un bloc `combine({...} if xxx is defined ...)` dans la construction du payload |
| Changer le délai avant rafraîchissement des capteurs | Le `delay: milliseconds:` de chaque script (actuellement 800-1000ms) |
| Changer la fréquence de rafraîchissement automatique | Le `scan_interval: 300` de chaque bloc `rest:` |
| Limiter/augmenter le nombre de tâches récupérées | Le paramètre `limit=200` dans l'URL de chaque capteur `Kanban <Personne>` |

## Piège connu

Les 6 scripts d'action référencent chacun, en dur, la liste des 4 entités `sensor.kanban_xxx` à rafraîchir en fin de séquence. Ajouter un 5e projet sans mettre à jour ces 6 listes fera que le nouveau projet ne se rafraîchit qu'au bout du `scan_interval` (5 min) après une action, au lieu d'immédiatement.

## Robustesse des capteurs Todoist
Les `value_template` des capteurs REST Todoist testent l'existence des champs (`value_json.… is defined`) : si l'API répond une erreur (jeton expiré 401/403, réponse vide), le capteur passe à `indisponible` / `0` au lieu de remplir le journal d'avertissements. **Un jeton refusé se corrige en générant un nouveau jeton Todoist** (Paramètres › Intégrations › Jeton API) et en le copiant dans `secrets.yaml` (`todoist_api_token`), puis redémarrer HA.
