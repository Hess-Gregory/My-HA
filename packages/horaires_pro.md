# packages/horaires_pro.yaml — Documentation

## Rôle du fichier

Système indépendant du Kanban familial (`taches_kanban.yaml`), dédié au suivi des horaires professionnels de Grégory et Sandrine via Todoist (projet "Horaires Pro", ID `6hWVvMpjWrXvrCRm`). Expose : les tâches brutes Todoist, des calendriers filtrés par type pour l'affichage, et des capteurs calculés (heures travaillées, soldes, quotas) utilisés par le dashboard Calendrier et par `horaires_pro_editeur.yaml`.

Version actuelle documentée dans le fichier : **2.5.0** (18/09/2026), exposée elle-même via `sensor.horaires_pro_version`.

## Historique des versions (changelog interne au fichier)

Le fichier tient son propre changelog en commentaire d'en-tête (indépendant du système de versionning git/`versions.json`) :
- **2.2.0** : passage de `S_Recup_Heures_48h` à `S_CSU`, plafond CSU 56h (2026) / 64h (dès 2027), reset annuel automatique, ajout de `sensor.horaires_pro_version`.
- **2.3.0** (abandonnée) : tentative de 2 calendriers agrégés "Global" par personne via `custom_projects`, pour contourner une collision d'entité dans `family-calendar-card`.
- **2.3.1** : retour en arrière sur la 2.3.0 — le bloc `calendar: platform: todoist` échoue entièrement au démarrage avec une erreur 403 sur `GET /api/v1/projects` (nécessaire pour résoudre "Horaires Pro" par son nom), qui bloque la création de TOUS les calendriers de ce bloc, anciens et nouveaux. Cause non confirmée (bug bibliothèque `todoist_api_python` ou restriction API), non réparable depuis la config YAML seule. Les blocs `custom_projects` "Global" sont **conservés inertes** dans le fichier au cas où le 403 se résout un jour (mise à jour HA, correctif upstream) — pas besoin de les retaper si ça se débloque. Le vrai correctif (inversion de couleurs Grégory/Sandrine) a été appliqué côté dashboard (`dashboard-calendrier.yaml`), pas ici.
- **2.4.0** : alignement des libellés `nom` des blocs (`ADV` → `ADV mensuel`, `Heures supplémentaires` → `Heures supplémentaires prestées`, `Récupération heures supplémentaires` → `Heures supplémentaires déduites`) sur les libellés du formulaire d'édition (`horaires_pro_editeur.yaml`) — nécessaire pour que le bouton "Modifier" du panneau Détails & Édition puisse présélectionner correctement le type dans le menu déroulant (sinon échec silencieux).
- **2.5.0** : ajout des compteurs `sensor.horaires_pro_maladie_gregory` et `sensor.horaires_pro_maladie_sandrine` (somme de `duration_minutes` sur les blocs labellisés `G_Maladie`/`G_Maladie_Enfant` et `S_Maladie`/`S_Maladie_Enfant`), qui manquaient sur la page Statistiques.

**⚠️ Le bloc `calendar: platform: todoist` (section "TODOIST — CALENDRIERS HORAIRES PRO") est actuellement en échec au démarrage (erreur 403).** Ne pas s'étonner que les calendriers "HP Gregory - ..." / "HP Sandrine - ..." n'apparaissent pas tant que ce point n'est pas résolu côté Todoist/HA.

## Entités créées

- **`rest` (sensors)** : `horaires_pro_projet` (métadonnées du projet Todoist), `horaires_pro_taches` (liste brute des tâches, `results` + `next_cursor`, `scan_interval: 300`, `limit=200`).
- **`calendar`** : ~40 calendriers par type de bloc (1 par label G_*/S_*) + 2 calendriers "Global" par personne — voir avertissement ci-dessus sur leur statut actuel (403).
- **`sensor` (template)** :
  - `horaires_pro_version` : expose la version (2.4.0), la date, le fuseau et un résumé de la dernière modification — capteur purement informatif, à maintenir manuellement à chaque évolution du fichier.
  - `horaires_pro_nombre_blocs` : nombre total de tâches dans le projet.
  - `horaires_pro_heures_travail_gregory` / `_sandrine` : somme de `effective_minutes` sur tous les blocs de la personne (Grégory exclut volontairement les labels `G_Heures_Supp_Prestees`/`G_Heures_Supp_Deduites` du total travaillé, car comptabilisés séparément dans le solde d'heures sup).
  - `horaires_pro_solde_heures_supplementaires` : `+` durée des blocs `G_Heures_Supp_Prestees`, `-` durée des blocs `G_Heures_Supp_Deduites` (Grégory uniquement).
  - `horaires_pro_onva_gregory` / `_sandrine`, `horaires_pro_adv_mensuels_xxx`, `horaires_pro_adv_samedi_gregory`, `horaires_pro_adv_13eme_mois_xxx` : simples compteurs de blocs par label.
  - `horaires_pro_csu_sandrine` : solde restant du quota CSU (Congé Sans Solde/Utilisation ?) de Sandrine, plafonné à **56h jusqu'en 2026, 64h à partir du 01/01/2027** (`{% set plafond_heures = 56 if annee <= 2026 else 64 %}`), filtré sur l'année en cours (`bloc.date[:4] == annee`) — ce filtrage par année fait que le compteur se "réinitialise" tout seul chaque 1er janvier, sans automatisation dédiée.
  - `horaires_pro_blocs_gregory` / `horaires_pro_blocs_sandrine` : **le cœur du fichier**. Transforme chaque tâche Todoist brute (`sensor.horaires_pro_taches`) en un "bloc" structuré (voir ci-dessous), via 3 dictionnaires par personne : `labels_map` (code label → nom affiché), `emoji_map` (code label → emoji), `couleur_map` (code label → couleur hex), et une liste `types_travail` (labels comptant comme temps de travail effectif pour `effective_minutes`).

- `horaires_pro_maladie_gregory` / `horaires_pro_maladie_sandrine` : simples compteurs de blocs par label (`G_Maladie`/`G_Maladie_Enfant` et `S_Maladie`/`S_Maladie_Enfant`), en minutes de `duration_minutes` (attributs `jours`, `heures`, `affichage`).

## Structure d'un "bloc" (sortie de `horaires_pro_blocs_xxx`)

Chaque bloc contient : `id`, `personne`, `content` (texte brut Todoist), `label` (code), `nom` (libellé affiché), `emoji`, `couleur`, `labels` (liste complète), `section_id`, `date` (ISO complet), `start`/`end` (HH:MM), `duration_minutes`, `effective_minutes` (temps réellement compté comme travaillé, 0 si le type n'est pas dans `types_travail`), `pause_minutes` et `planned_minutes` (extraits par regex de la `description` Todoist, motifs `Pause: HH:MM` et `Heures prévues: HH:MM`), `journee_entiere` (booléen, vrai si la tâche Todoist n'a pas d'heure précise), `description`, `priority`.

**Calcul de `effective_minutes`** : si le type est dans `types_travail` ET que `planned_minutes` (extrait de la description) est renseigné → on utilise `planned_minutes` en priorité ; sinon si `duration_minutes` > 0 → `duration_minutes - pause_minutes` ; sinon 0. Si le type n'est pas dans `types_travail` → toujours 0.

## Comment modifier

| Je veux... | Je modifie... |
|---|---|
| Ajouter un nouveau type de journée | **3 endroits obligatoires** : `labels_map`/`emoji_map`/`couleur_map` du bloc `blocs_gregory` ou `blocs_sandrine` concerné (ici) + options de l'`input_select` correspondant ET dictionnaires `labels_gregory`/`labels_sandrine` des scripts (dans `horaires_pro_editeur.yaml`). Les 3 doivent utiliser le même libellé affiché ("nom"), sinon le préremplissage du bouton "Modifier" échoue. |
| Faire compter un type comme temps de travail effectif | L'ajouter à la liste `types_travail` du bloc `blocs_gregory` ou `blocs_sandrine` correspondant |
| Changer le plafond CSU ou l'année de bascule 56h→64h | Le `{% set plafond_heures = 56 if annee <= 2026 else 64 %}` dans `horaires_pro_csu_sandrine` |
| Changer le projet Todoist source | L'ID `6hWVvMpjWrXvrCRm` dans les deux blocs `rest:` (projet + tâches) |
| Réactiver les calendriers "HP xxx - yyy" | Attendre/vérifier que le 403 sur `GET /api/v1/projects` soit résolu (mise à jour HA ou Todoist), rien à modifier ici a priori |
| Suivre l'évolution de ce fichier | Mettre à jour l'en-tête "MODIFICATIONS — VERSION x.y.z" ET `sensor.horaires_pro_version` (état + attributs `version`/`date`/`affichage`/`modification`) — les deux sont indépendants du système de versionning git (`versions.json`) et doivent être maintenus manuellement |

## Piège connu

Les libellés affichés (`nom`/`labels_map`) de ce fichier et les dictionnaires `labels_gregory`/`labels_sandrine` de `horaires_pro_editeur.yaml` sont **deux copies indépendantes qui doivent rester identiques mot pour mot**. Une désynchronisation (comme celle corrigée en v2.4.0) casse silencieusement le préremplissage du formulaire d'édition, sans erreur visible ailleurs que par un menu déroulant qui reste sur sa valeur par défaut au lieu du vrai type de la tâche.

## Robustesse des capteurs Todoist
Les `value_template` des capteurs REST Todoist testent l'existence des champs (`value_json.… is defined`) : si l'API répond une erreur (jeton expiré 401/403, réponse vide), le capteur passe à `indisponible` / `0` au lieu de remplir le journal d'avertissements. **Un jeton refusé se corrige en générant un nouveau jeton Todoist** (Paramètres › Intégrations › Jeton API) et en le copiant dans `secrets.yaml` (`todoist_api_token`), puis redémarrer HA.
