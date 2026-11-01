# Localisation – alertes (v2.1.0 · 28/10/2026)

Package : `packages/localisation_alertes.yaml`. Va avec le dashboard **maison-localisation v2.1.0** (`www/plan3d/loc-hub-card.js`).

## Interrupteurs
| Entité | Rôle |
|---|---|
| `input_boolean.loc_alertes_sandrine` / `_greg` / `_matteo` | Suivre les arrivées et départs de cette personne |
| `input_boolean.loc_alerte_ecole_matteo` | Alerte à 8 h 45 les jours ouvrables si Matteo n'est pas à l'école (désactivée pendant les vacances) |

## Automatisations
- **loc_arrivee_depart** : changement de zone stable depuis 3 min, ignoré si l'ancienne ou la nouvelle position est imprécise (précision GPS ≥ 100 m) → notification aux téléphones de Greg et Sandrine (pas à la personne concernée), avec l'heure de retour Waze au départ d'un lieu. Annonce vocale sur la tablette entre 7 h et 22 h, sauf en mode nuit.
- **loc_rappel_alarme_retour** : Waze < 8 min, la personne n'est pas à la maison et l'alarme est en `armed_away` → rappel pour désarmer.
- **loc_ecole_matteo** : 8 h 45, jour ouvrable, interrupteur actif et personne dans `zone.icpp_ecole_matteo` → alerte avec la dernière position.
- **loc_batterie_faible** : batterie < 15 % hors de la maison (Sandrine, Greg, iPhone de Matteo).
- **loc_position_figee** : à 10 h et à 17 h, signale les positions hors maison non mises à jour depuis plus de 2 h.

## Liens
- `chauffage_retour_imminent_salon` (chauffage.yaml) : ne se déclenche plus si la personne est déjà à la maison.

## Historique
- 2.1.2 (01/11/2026) : « Sandrine est rentrée » annoncé après une fausse visite au Delhaize (±247 m) suivie d'un retour à ±100 m. Le filtre porte maintenant sur l'ancienne et la nouvelle position, et il est strict (< 100 m).
- 2.1.1 (01/11/2026) : fausses annonces « arrivé(e) au Delhaize » alors qu'on était à la maison (positions réseau à ±200 m qui tombent dans la zone Delhaize, à 235 m). Filtre de précision ≤ 100 m et stabilité portée à 3 min.
- 2.1.0 (28/10/2026) : création.
