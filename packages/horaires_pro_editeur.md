# packages/horaires_pro_editeur.yaml — Documentation

## Rôle du fichier

Panneau "Détails & Édition" pour les horaires professionnels (Grégory/Sandrine), affiché sous le calendrier dans l'onglet Horaires Pro. Complète `horaires_pro.yaml` (qui expose les données) en ajoutant un vrai flux Créer / Voir / Modifier / Supprimer une tâche Todoist, avec durée 100% libre à la création.

## Pourquoi ce fichier existe (contexte)

Le popup natif de `family-calendar-card` (déclenché par un clic sur un événement du calendrier) est un template fixe de cette carte tierce : il n'affiche que nom/date/heure/description, sans couleur par type ni bouton personnalisé — impossible à améliorer via YAML (vérifié dans le code source de la carte). Le vrai "type" (Jour normal, Congé ONVA, etc.) vient du **label Todoist** de la tâche, que l'entité `calendar.horaires_pro` (intégration Todoist) n'expose pas dans l'objet événement. D'où ce panneau séparé, qui lit les labels via les capteurs de blocs de `horaires_pro.yaml` (qui, eux, connaissent le vrai type/couleur/emoji).

Le clic sur le calendrier lui-même n'est pas remplacé (limitation acceptée) — ce panneau est un flux complémentaire, en dessous.

## Flux d'utilisation

1. On choisit **Personne + Date** → la liste des tâches de ce jour s'affiche (jusqu'à 4), via `sensor.horaires_pro_taches_du_jour`.
2. On sélectionne une tâche (bouton "Sélectionner une tâche du jour", script `horaires_pro_selectionner_tache_par_index`) → panneau "Détails" structuré et coloré (bordure couleur du type, emoji, nom, personne, date, horaires, pause, durée effective), avec 3 boutons : **Fermer** / **Modifier** / **Supprimer**.
3. **Modifier** (`horaires_pro_charger_pour_edition`) charge la tâche dans le même formulaire que la création (pré-rempli) → **Enregistrer** (`horaires_pro_modifier_tache`, PATCH Todoist) ou **Annuler** (`horaires_pro_annuler_edition`).
4. Quand rien n'est sélectionné, le formulaire de **création** (`horaires_pro_creer_tache`) est affiché par défaut, avec une durée libre en texte (ex. "7h30", "07:30", "450", "45min") — les boutons de préréglage rapide du dashboard ne font que pré-remplir ce champ, sans le limiter.

⚠️ **Point de vigilance signalé dans le fichier** : le endpoint de modification (`POST /api/v1/tasks/{id}`) n'était pas encore testé en conditions réelles à l'écriture de ce fichier. En cas d'échec, le message d'erreur apparaît dans `input_text.hp_editeur_resultat` et dans les logs HA.

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
| Changer le nombre max de tâches affichées dans "tâches du jour" | Le dashboard (pas ce fichier) limite l'affichage à 4 ; `sensor.horaires_pro_taches_du_jour` liste, lui, TOUTES les tâches du jour sans limite |
| Ajouter un champ au formulaire (ex. lieu) | Ajouter un `input_text`/`input_select` ici, l'inclure dans le payload des rest_command et dans `horaires_pro_charger_pour_edition` pour le pré-remplissage |
| Changer le projet Todoist cible | L'ID `"6hWVvMpjWrXvrCRm"` dans `rest_command.horaires_pro_todoist_create_task` (payload `project_id`) |

## Pièges connus

- Le endpoint de modification Todoist n'était pas confirmé fonctionnel à l'écriture du fichier — vérifier `input_text.hp_editeur_resultat` après le premier "Enregistrer" réel.
- `input_boolean.hp_a_une_selection` doit être maintenu à la main par chaque script qui touche à la sélection — un nouveau script de sélection qui l'oublierait casserait l'affichage conditionnel du dashboard sans erreur visible dans les logs.
- Toute désynchronisation entre les dictionnaires de labels de ce fichier et de `horaires_pro.yaml` casse silencieusement soit la création (erreur "type introuvable"), soit le préremplissage du bouton "Modifier".
