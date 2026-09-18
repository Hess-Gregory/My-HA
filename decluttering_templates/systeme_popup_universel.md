# Documentation : systeme_popup_universel.yaml

Composant colocalisé pour la gestion universelle des événements/tâches par pop-ups.

## Dépendances (HACS)
- browser_mod
- button-card
- decluttering-card

## Variables disponibles
| Variable | Type | Description | Exemple |
| :--- | :--- | :--- | :--- |
| entity_id | String | ID de l entité liée | todo.courses |
| titre_element | String | Nom affiché sur la carte | "Acheter du pain" |
| description | String | Texte du détail complet | "3 baguettes" |
| service_suppression | Service | Service appelé pour effacer | todo.remove_item |
| cle_parametre_suppression | String | Clé identifiante de suppression | item |
| valeur_parametre_suppression | String | Valeur identifiante | "Acheter du pain" |
