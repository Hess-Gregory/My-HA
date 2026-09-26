# chambre_enfants.yaml — Plafonnier du ventilateur (chambre enfants)

`switch.plafonnier_chambre_enfants` envoie les codes appris « True » (allumer) et « False » (éteindre) du device Broadlink `ventillateur_plafond_chambre` via `remote.cellule_remonte_salon`.

- Pas de retour d'état (infrarouge / radio) : l'interrupteur est **optimiste**, il affiche le dernier ordre envoyé. Si quelqu'un utilise la télécommande physique, l'état affiché peut être faux : un appui remet tout d'accord.
- Les autres fonctions (blanc chaud / froid, intensité, RGB, ventilation) restent des boutons d'action dans les dashboards Éclairage et Ma maison › Chambre enfants.
