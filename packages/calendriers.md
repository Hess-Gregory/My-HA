# Calendriers en grille (package `calendriers.yaml`)

Deux collecteurs **en lecture seule** alimentent des grilles de mois au design du planning de Matteo :
- `sensor.calendrier_famille_mois` : Calendrier, Greg, Sandrine, Matteo, Hugo, jours fériés (`calendar.belgique`). Mois affiché : `input_number.cal_famille_offset` (0 = mois en cours). Jour sélectionné : `input_datetime.cal_famille_jour`.
- `sensor.horaires_pro_mois` : horaires pro (`calendar.horaires_pro`, `horaire_gregory`, `horaire_sandrine`) + fériés. Mois : `input_number.cal_hp_offset`. Un appui sur un jour renseigne `input_datetime.hp_editeur_date` (éditeur existant inchangé).

Attributs : `debut` (lundi de la 1re semaine affichée) et `evenements` (liste `{s, e, t, c}` : début, fin, titre, calendrier) sur 6 semaines. Mise à jour toutes les 15 min, au démarrage, et à chaque changement de mois.
