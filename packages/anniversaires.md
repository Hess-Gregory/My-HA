# anniversaires.yaml — Anniversaires & dates récurrentes

Liste des dates affichées dans **Calendrier › Vue d'ensemble** (section 🎂 et carte « prochain anniversaire »).
Ces dates sont **indépendantes du planning de Matteo** : elles n'apparaissent ni dans ses trajets, ni dans son calendrier, ni dans l'impression.

## Stockage
- `sensor.anniversaires` (capteur déclenché, restauré au redémarrage) : état = nombre de dates, attribut `liste` = `[{id, nom, date (AAAA-MM-JJ), type}]`.
- `type` : `anniversaire` (🎂 âge), `rencontre` (💞 années ensemble), `memoire` (🕊️ proche disparu : « aurait eu N ans »), `autre` (📅).
- Seul l'événement `anniversaires_modifier` modifie la liste (`action` : `ajouter` + `item`, `supprimer` + `id`, `importer` + `liste`).

## Formulaires (popups du dashboard)
- **Ajouter** : `script.anniversaire_nouveau` (vide le formulaire) puis `script.anniversaire_ajouter` (nom obligatoire, date passée, pas de doublon) ; message dans `input_text.anniv_form_resultat`.
- **Supprimer** : `script.anniversaire_maj_liste` remplit `input_select.anniv_a_supprimer`, puis `script.anniversaire_supprimer` (avec confirmation).
- Pas de modification ni de fiche détail (volontaire) : pour corriger une date, la supprimer puis la rajouter.

## Pièges
- Les `input_datetime.anniversaire_*` (Grégory, Sandrine, Matteo, Hugo) restent utilisés par le planning de Matteo ; ils ne sont plus affichés dans la vue.
- Sauvegarde : la liste vit dans l'état restauré de HA (`.storage/core.restore_state`) ; exporter avec l'outil Développeur › États si besoin.

## Rappels
- `automation.anniversaires_rappel` : chaque matin à 08:02, au démarrage et à chaque changement de liste, notification persistante « 🎂 Anniversaires cette semaine » (dates de J-7 au jour J), retirée quand il n'y en a plus.
- À 08:02 seulement : push sur le téléphone de Grégory à J-7, la veille et le jour J (toucher = Calendrier › Vue d'ensemble).
- Accueil › État rapide : carte « prochain anniversaire » (toucher = Calendrier).
