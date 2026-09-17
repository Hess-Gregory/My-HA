# packages/dashboard_versions.yaml — Documentation

## Rôle du fichier

Fichier d'infrastructure du système de versioning automatique (voir le [`README.md`](../README.md), section "Versioning automatique"). Il ne contient **aucune logique métier** : il expose simplement le contenu de `/config/versions.json` (généré et mis à jour tout seul par le hook git post-commit) comme un capteur Home Assistant, pour que les dashboards puissent afficher la version de chaque fichier dont ils dépendent dans leur footer.

## Entité créée

- **`sensor.versions_config_ha`** ("Versions Config HA") : capteur `command_line` qui exécute `cat /config/versions.json`.
  - `value_template` : nombre de caractères du JSON (juste pour avoir un état numérique cohérent, la valeur elle-même n'est pas utile).
  - `json_attributes_path: "$"` : expose **tout** le JSON à la racine comme attributs.
  - `json_attributes` : liste des clés extraites, une par fichier suivi (chemin relatif dans le dépôt, ex. `.storage/lovelace.1_accueil`). Chaque attribut est un objet `{version, last_change, last_update}`.

## Comment c'est utilisé

Dans un dashboard, un footer affiche la version d'un fichier via un template du type :

```jinja2
{{ state_attr('sensor.versions_config_ha', '.storage/lovelace.1_streaming').version }}
```

## Comment modifier

| Je veux... | Je fais... |
|---|---|
| Suivre un nouveau fichier/dashboard | Ajouter son chemin relatif à la liste `json_attributes` (voir aussi le README, section "Ajouter un nouveau dashboard au suivi") |
| Ne plus suivre un fichier | Retirer son chemin de `json_attributes` |
| Changer la source des données | Ne pas éditer ce fichier à la main pour le contenu — `versions.json` est régénéré automatiquement par le hook git ; ce package ne fait que le lire |

## Piège connu

Ce fichier **ne doit jamais être édité pour changer une version manuellement** : les versions viennent uniquement de `versions.json`, lui-même généré par le hook post-commit décrit dans le `README.md`. La seule édition légitime de `dashboard_versions.yaml` est l'ajout/retrait d'une clé dans `json_attributes` quand un nouveau dashboard rejoint (ou quitte) le système de suivi.
