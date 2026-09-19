# packages/horaires_pro_editeur.yaml — Documentation

## Rôle du fichier

Panneau "Détails & Édition" pour les horaires professionnels (Grégory/Sandrine), affiché sous le calendrier dans l'onglet Horaires Pro. Complète `horaires_pro.yaml` (qui expose les données) en ajoutant un vrai flux Créer / Voir / Modifier / Supprimer une tâche Todoist, avec durée 100% libre à la création.

## Pourquoi ce fichier existe (contexte)

Le popup natif de `family-calendar-card` (déclenché par un clic sur un événement du calendrier) est un template fixe de cette carte tierce : il n'affiche que nom/date/heure/description, sans couleur par type ni bouton personnalisé — impossible à améliorer via YAML (vérifié dans le code source de la carte). Le vrai "type" (Jour normal, Congé ONVA, etc.) vient du **label Todoist** de la tâche, que l'entité `calendar.horaires_pro` (intégration Todoist) n'expose pas dans l'objet événement. D'où ce panneau séparé, qui lit les labels via les capteurs de blocs de `horaires_pro.yaml` (qui, eux, connaissent le vrai type/couleur/emoji).

Le clic sur le calendrier lui-même n'est pas remplacé (limitation acceptée) — ce panneau est un flux complémentaire, en dessous.

## Flux d'utilisation

1. On choisit **Personne + Date** → la liste des tâches de ce jour s'affiche, via `sensor.horaires_pro_taches_du_jour`.
2. On sélectionne une tâche (script `horaires_pro_selectionner_tache_par_index`) → panneau "Détails" structuré et coloré (bordure couleur du type, emoji, nom, personne, date, horaires, pause, durée effective), avec 3 boutons : **Fermer** / **Modifier** / **Supprimer**.
3. **Modifier** (`horaires_pro_charger_pour_edition`) charge la tâche dans le même formulaire que la création (pré-rempli) → **Enregistrer** (`horaires_pro_modifier_tache`), **Annuler** (`horaires_pro_annuler_edition`) ou **Supprimer**.
4. Quand rien n'est sélectionné, le formulaire de **création** (`horaires_pro_creer_tache`) est affiché par défaut, avec une durée libre en texte (ex. "7h30", "07:30", "450", "45min") — les boutons de préréglage rapide du dashboard ne font que pré-remplir ce champ, sans le limiter.
5. Après une création réussie, le script **retrouve la tâche qu'il vient de créer et la sélectionne** : le panneau bascule donc tout seul sur "Détails". Voir la section "Sélection automatique après création" ci-dessous.

## Sélection automatique après création

À la fin de `horaires_pro_creer_tache`, la tâche créée est retrouvée dans `sensor.horaires_pro_taches_du_jour` par **`label` + `start`** — deux valeurs que le script connaît déjà, l'API Todoist ne lui renvoyant pas l'identifiant de la tâche créée. Si elle est trouvée, le script applique les trois gestes de sélection du système (`hp_selection_id`, `hp_editeur_mode_edition` à `off`, `hp_a_une_selection` à `on`).

Ce repérage est encadré par un `if` : si la tâche n'est pas retrouvée, le script n'échoue pas, il affiche simplement le message de confirmation sans basculer. Un `delay` d'une seconde précède la recherche, le temps que les capteurs template se recalculent après le rafraîchissement.

**Limite connue** : si deux tâches du même type démarrent à la même heure le même jour, c'est la dernière de la liste qui est sélectionnée. Cas jugé improbable en usage réel.

## Rafraîchissement des données après action

Les trois scripts qui modifient Todoist (`creer`, `modifier`, `supprimer`) rafraîchissent **trois** entités, pas deux :

- `sensor.horaires_pro_taches` et `sensor.horaires_pro_projet` — ils alimentent, via `horaires_pro.yaml`, les capteurs de blocs dont dépend la **liste** du dashboard.
- `calendar.horaires_pro` — c'est une entité **distincte**, et c'est elle que lit `family-calendar-card` pour la **grille mensuelle**.

Oublier la troisième est un piège classique : la liste se met à jour correctement pendant que le calendrier continue d'afficher des événements fantômes, ce qui donne l'impression que la suppression n'a pas fonctionné.

À noter que `family-calendar-card` ne réagit de toute façon pas aux changements d'entité : elle va chercher ses événements elle-même, sur son propre minuteur (`updateInterval` dans la config de la carte). Rafraîchir l'entité garantit que la donnée est fraîche quand la carte la redemande, mais le délai d'affichage reste celui de la carte.

## Entités créées

- **`input_select`** : `hp_editeur_personne` (Grégory/Sandrine), `hp_editeur_type_gregory` (~23 types), `hp_editeur_type_sandrine` (~19 types).
- **`input_datetime`** : `hp_editeur_date`, `hp_editeur_heure` (heure de début).
- **`input_text`** : `hp_editeur_duree` (défaut "08:00"), `hp_editeur_pause` (défaut "00:30"), `hp_editeur_resultat` (dernier message de retour), `hp_selection_id` (ID de la tâche actuellement sélectionnée), `hp_editeur_task_id_en_cours` (ID de la tâche en cours d'édition).
- **`input_boolean`** : `hp_editeur_mode_edition`, `hp_a_une_selection`. Ce dernier est un simple reflet de "`hp_selection_id` non vide" — nécessaire car le composant `conditional` de cette version de HA n'accepte que des conditions `state`/`numeric_state`, pas de `template` ("Conditions are invalid"). Il est mis à jour explicitement par les scripts à chaque sélection/désélection/suppression — **si vous ajoutez un nouveau chemin de sélection/désélection, pensez à mettre à jour ce booléen vous-même**, sinon la visibilité des panneaux du dashboard se désynchronise.
- **`rest_command`** : `horaires_pro_todoist_create_task` (POST `/tasks`), `horaires_pro_todoist_update_task` (POST `/tasks/{id}`, **ne touche jamais à `content`**), `horaires_pro_todoist_delete_task` (DELETE `/tasks/{id}`).
- **`sensor` (template)** : `horaires_pro_taches_du_jour` (liste des tâches du jour choisi pour la personne choisie, triée par heure de début), `horaires_pro_tache_selectionnee` (détail complet de la tâche dont l'ID est dans `hp_selection_id`).
- **`script`** : `horaires_pro_creer_tache`, `horaires_pro_charger_pour_edition`, `horaires_pro_modifier_tache`, `horaires_pro_annuler_edition`, `horaires_pro_fermer_selection`, `horaires_pro_selectionner_tache_par_index`, `horaires_pro_supprimer_tache`.

## Règle importante : le texte de la tâche n'est jamais réécrit

`horaires_pro_todoist_update_task` et le script `horaires_pro_modifier_tache` n'envoient JAMAIS le champ `content` à Todoist. Seuls `description`, `labels`, `due_datetime` et `duration` sont modifiés. Objectif : ne jamais effacer un texte personnalisé ("— Gregory — Travail" etc.) que vous auriez tapé à la main dans l'app Todoist. **Ne réintroduisez jamais l'envoi de `content` dans une modification sans y penser à deux fois.**

## Dictionnaires de labels (le point le plus fragile du fichier)

Chaque script (`horaires_pro_creer_tache` et `horaires_pro_modifier_tache`) contient sa **propre copie** de deux dictionnaires `labels_gregory` / `labels_sandrine` (nom affiché → code de label Todoist, ex. `"Jour normal": "G_Jour_Normal"`). Ces dictionnaires doivent rester strictement synchronisés avec :
1. Les options des `input_select.hp_editeur_type_gregory` / `hp_editeur_type_sandrine` (ce fichier, section du haut) — un type dans le menu déroulant sans entrée correspondante dans le dictionnaire produit l'erreur "type introuvable".
2. Les dictionnaires `labels_map` (et `emoji_map`/`couleur_map`) de `horaires_pro.yaml`, qui doivent utiliser exactement les mêmes noms affichés — sinon le bouton "Modifier" ne peut pas présélectionner le bon type dans le menu déroulant (bug déjà rencontré et corrigé en v2.4.0 de `horaires_pro.yaml`, voir sa documentation).

**Pour ajouter un nouveau type de journée : il faut le déclarer à 3 endroits simultanément** — options de l'`input_select` correspondant (ici), dictionnaire `labels_gregory`/`labels_sandrine` dans les DEUX scripts `horaires_pro_creer_tache` et `horaires_pro_modifier_tache` (ici), et `labels_map`/`emoji_map`/`couleur_map` dans `horaires_pro.yaml`.

Attention également : `horaires_pro_creer_tache` utilise `label_code` pour retrouver la tâche créée (voir "Sélection automatique après création"). Une désynchronisation casse donc aussi la bascule vers l'écran Détails, en plus de la création elle-même.

## Parsing de la durée et de la pause (format libre)

`duree_min` et `pause_min` (variables des scripts création/modification) acceptent plusieurs formats et les convertissent en minutes :
- `"7h30"` ou `"7h"` → heures + minutes après le "h"
- `"07:30"` → format HH:MM
- `"45min"` → minutes explicites
- `"450"` (chiffre seul) → minutes brutes

**Pour ajouter un nouveau format accepté** : modifier la logique `{% if 'h' in d %} ... {% elif ':' in d %} ... {% elif 'min' in d %} ... {% else %}` dans les DEUX scripts (création et modification) — elle est dupliquée, pas factorisée.

## Comment modifier

| Je veux... | Je modifie... |
|---|---|
| Ajouter un type de journée | Voir section "Dictionnaires de labels" ci-dessus (3 endroits, dont `horaires_pro.yaml`) |
| Changer la durée ou la pause par défaut du formulaire | `initial:` de `input_text.hp_editeur_duree` / `hp_editeur_pause` |
| Changer le nombre max de tâches affichées dans "tâches du jour" | Le dashboard limite l'affichage à 8 lignes ; `sensor.horaires_pro_taches_du_jour` liste, lui, TOUTES les tâches du jour sans limite |
| Ajouter un champ au formulaire (ex. lieu) | Ajouter un `input_text`/`input_select` ici, l'inclure dans le payload des rest_command et dans `horaires_pro_charger_pour_edition` pour le pré-remplissage |
| Changer le projet Todoist cible | L'ID `"6hWVvMpjWrXvrCRm"` dans `rest_command.horaires_pro_todoist_create_task` (payload `project_id`) |
| Ajouter une entité au rafraîchissement après action | Les trois blocs `homeassistant.update_entity` des scripts créer / modifier / supprimer (voir "Rafraîchissement des données après action") |

## Pièges connus

- `input_boolean.hp_a_une_selection` doit être maintenu à la main par chaque script qui touche à la sélection — un nouveau script de sélection qui l'oublierait casserait l'affichage conditionnel du dashboard sans erreur visible dans les logs.
- Toute désynchronisation entre les dictionnaires de labels de ce fichier et de `horaires_pro.yaml` casse silencieusement soit la création (erreur "type introuvable"), soit le préremplissage du bouton "Modifier", soit la bascule automatique vers Détails après création.
- **Oublier `calendar.horaires_pro` dans un `update_entity`** laisse la grille mensuelle afficher des événements fantômes alors que la liste, elle, est correcte. Symptôme trompeur : on croit que la suppression a échoué.
- **Un bouton de popup qui appelle un de ces scripts par `call-service` ne referme pas le popup.** Côté dashboard, seuls les boutons natifs de `browser_mod.popup` (`left_button` / `right_button` avec leur `*_action`) referment en exécutant leur action. C'est pour cette raison que la confirmation de suppression utilise ces boutons natifs et non des `button-card` imbriqués dans le contenu. Voir `decluttering_templates/systeme_popup_universel.md` pour le détail du comportement de browser_mod.
- Si un script de ce fichier doit un jour refermer lui-même un popup, il lui faut une étape `browser_mod.close_popup` — aucun des scripts actuels ne le fait, la fermeture est entièrement gérée côté dashboard.

## Historique de validation

- **19/09/2026** — L'endpoint de modification Todoist (`POST /api/v1/tasks/{id}`), signalé comme non testé à l'écriture du fichier, a été validé en conditions réelles : modification d'une durée de 450 à 480 minutes correctement répercutée dans Todoist, dans les capteurs et dans l'affichage. L'avertissement correspondant a été retiré de cette documentation.
- **19/09/2026** — Flux complet testé de bout en bout : sélection de date, ouverture du détail, les trois boutons du panneau Détails, les boutons de l'écran Modifier, les préréglages de durée, les boutons de ligne (crayon et corbeille), la confirmation de suppression, et le rafraîchissement de la liste et du calendrier.