# Documentation : packages/dashboard_versions.yaml

## Rôle du fichier
Fichier d'infrastructure du système de versioning automatique. Il ne contient aucune logique métier : il expose simplement le contenu de `/config/versions.json` sous forme du capteur Home Assistant `sensor.versions_config_ha`.

## Entité créée
- **`sensor.versions_config_ha`** ("Versions Config HA") : Capteur `command_line` qui exécute `cat /config/versions.json`.
  - `value_template` : Nombre de caractères du JSON.
  - `json_attributes_path: "$"` : Expose la totalité du fichier JSON comme attributs.
  - `json_attributes` : Liste des chemins des fichiers suivis dans le dépôt.

## Comment modifier
| Je veux... | Je fais... |
|---|---|
| Suivre un nouveau fichier/dashboard | Ajouter son chemin relatif à la liste `json_attributes` |
| Ne plus suivre un fichier | Retirer son chemin de la liste `json_attributes` |

## Piège connu
- Ne jamais éditer les numéros de version manuellement dans ce fichier ou dans `versions.json`.
- Après tout ajout dans `json_attributes`, effectuer un `ha core restart` pour charger le capteur mis à jour.

## Fichiers du planning Matteo suivis
Les 6 packages `packages/matteo/*.yaml` sont suivis individuellement. Le footer de l'onglet Matteo & Trajets
n'affiche que le package maître `packages/matteo/matteo_calendar.yaml` (moteur du planning). L'ancien `packages/matteo_logistique.yaml`
a été retiré (remplacé par `packages/matteo/`, voir `/config/matteo/README.md`).

## Footer propre à une vue
`scripts/dashboard_dependencies.json` accepte une clé `"<slug>/<chemin de la vue>"` (ex. `dashboard_calendrier/matteo-trajets`)
qui remplace, pour cette vue seulement, la liste par défaut `"<slug>"`. Relancer ensuite `python3 scripts/add_footer_card.py <slug>`.
