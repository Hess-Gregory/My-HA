# themes/large-sections.yaml — Documentation

## Rôle du fichier

Micro-thème utilitaire, sans aucune palette de couleur : uniquement une règle `card-mod-view-yaml` qui force la largeur des colonnes d'une vue de type `sections` à 900px (min ET max), via les variables CSS `--ha-view-sections-column-max-width` / `--ha-view-sections-column-min-width` appliquées au conteneur `.wrapper`.

## Usage

Ce thème n'est pas pensé pour être le thème principal d'un dashboard (il ne définit aucune couleur), mais pour être **combiné** ou appliqué spécifiquement là où une vue en sections a besoin de colonnes plus larges que la largeur par défaut de Home Assistant.

## Comment modifier

| Je veux... | Je modifie... |
|---|---|
| Changer la largeur des colonnes | Les 2 valeurs `900px` (min et max — les garder identiques pour une largeur fixe, ou les différencier pour une largeur flexible avec bornes) |
| Cibler un autre élément que `.wrapper` | Le sélecteur CSS sous `card-mod-view-yaml: .:` |

## Piège connu

Nécessite l'intégration custom **card-mod** (HACS) pour fonctionner — sans elle, ce thème ne change visuellement rien d'autre que ce que HA applique par défaut.
