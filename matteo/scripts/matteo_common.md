# matteo_common.py — bibliothèque commune

**Rôle** : fonctions partagées par tous les scripts du planning. Aucun script n'écrit le JSON autrement
que par `save()` de ce module.

## Constantes
| Nom | Valeur | Rôle |
|---|---|---|
| `DATA_PATH` | `data/matteo_planning_overrides.json` | Source de vérité |
| `OPTIONS_PATH` | `data/matteo_options.json` | Listes des menus (types, motifs, lieux) |
| `MOTEUR_PATH` | `data/matteo_moteur.json` | Fichier compact lu par HA |
| `ALT_REF` | 22/01/2027 | Référence historique de l'alternance des retours (pré-remplissage) |
| `LIEU_DEFAUT` | `MAURAGE` | Lieu par défaut des trajets de Grégory |

## Fonctions
| Fonction | Ce qu'elle fait |
|---|---|
| `load()` / `save(content)` | Lit / écrit le JSON. `save` recalcule les événements, réaligne les retours, fait une copie `.bak`, écrit de façon atomique puis régénère le moteur |
| `recalc_evenements(content)` | Attache à chaque ligne les anniversaires / fêtes de sa période (`evenements_lies`, `evenement_ok`) |
| `weekend_defaut(fri, papa)` | Valeurs par défaut d'un week-end (type, garde, aller A, retour par défaut) |
| `retour_papa_par_defaut(fri)` | Retour pré-rempli d'un week-end papa (avant réalignement) |
| `masques(data)` | Week-ends entièrement recouverts par une part de congé active |
| `manuel(e)` | Vrai si la ligne a été enregistrée à la main (jamais réalignée) |
| `aligner_retours(data)` | Alternance stricte des retours futurs auto-générés à partir du dernier retour réel |
| `reopen` / `link` | Rouvre / lie une dette de trajet (banque) |
| `lieux_labels()` / `lieu_label(code)` | Libellés des lieux depuis `matteo_options.json` |
| `ecrire_moteur(content)` | Écrit `matteo_moteur.json` (champs utiles, `masque`, lieux, motifs, dates de création) |

## Utilisation directe
```
python3 /config/matteo/scripts/matteo_common.py   # recalcul complet + régénération du moteur
```

## Pièges
- Ne jamais écrire `matteo_planning_overrides.json` sans passer par `save()` : le moteur ne serait pas régénéré.
- Les week-ends masqués gardent leurs données dans la source mais le moteur leur met `bank_delta = 0` et retire leurs liens.


## aligner_retours — règle (correctif Noël 2026)

Tous les retours A/B **futurs** suivent l'alternance stricte (après A ou D → B ; après B ou C → A), même s'ils ont été saisis à la main depuis le dashboard. Les ancres qui cassent la chaîne sont uniquement les échanges C/D et un retour marqué `reprise_alternance`. Les entrées passées ne sont jamais modifiées.

## Inversion permanente des retours

- `retour_attendu_chaine(data, key, debut)` : retour attendu par l'alternance avant une date.
- `compenser_inversion(...)` : passe la ligne de compensation en C (+1) ou D (−1) et la lie à l'inversion.
- `nettoyer_inversions(data)` : appelée par `save()` avant `aligner_retours` ; remet à la normale une compensation orpheline (inversion annulée, déplacée ou supprimée).
- Moteur : exporte `inversion_retours`, `inversion_comp`, `compense_inversion`.
