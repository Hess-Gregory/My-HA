# generate_print.py — page imprimable et export Excel

**Appelé par** : `generate_ics.py` (fonction `build()`).

| Sortie | Contenu |
|---|---|
| `/config/www/matteo/imprimer_<jeton>.html` | Page autonome : calendrier mensuel ou liste, choix du mois et de la durée, bouton Imprimer / PDF |
| `/config/www/matteo/planning_<jeton>.csv` | Export Excel (séparateur `;`, UTF-8 avec BOM) |

Les données (périodes, congés, événements) sont injectées en JSON dans le gabarit HTML `TEMPLATE`.
Les lieux autres que Maurage sont ajoutés au nom de la personne (« Grégory à ICPP Uccle (École) »).
