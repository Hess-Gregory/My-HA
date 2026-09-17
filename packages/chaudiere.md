# packages/chaudiere.yaml — Documentation

## ⚠️ Statut : très probablement un fichier obsolète, à confirmer/supprimer

Ce fichier fait **1508 lignes** et est structurellement quasi identique à [`packages/chauffage.yaml`](chauffage.md) (1521 lignes) : mêmes clés de scripts (`chauffage_sieste_adulte_fin`, `chauffage_depart_temporaire`, `chauffage_retour_temporaire`, etc.), même architecture générale (modes par pièce, consignes, planning, pilotage vannes/chaudière...).

La différence essentielle, visible dès les premières lignes :

- **`chaudiere.yaml`** décrit l'état **"vannes connectées PAS ENCORE INSTALLÉES"** — tout ce qui concerne les vannes Bosch est préparé mais désactivé (`initial_state: false`), avec des commentaires du type "Cherche 'A FAIRE QUAND LES VANNES ARRIVENT' pour savoir quoi modifier".
- **`chauffage.yaml`** décrit l'état **actuel et confirmé** : vannes Bosch Radiator Thermostat II M (7 vannes) + passerelle Bosch Smart Home Controller II, intégrées le 12/09/2026 via l'intégration HACS "Bosch SHC" (`climate.chambre_adulte`, `climate.chambre_enfants`, `climate.couloir`, `climate.living`, `climate.salle_de_bain`).

Un `diff` complet entre les deux fichiers fait **434 lignes** de différences réparties sur tout le fichier (pas juste l'en-tête) : les deux versions ont clairement divergé au moment de l'installation des vannes, `chauffage.yaml` étant la version mise à jour et `chaudiere.yaml` la version pré-installation restée sur le disque.

## Pourquoi c'est un problème

Home Assistant charge **tous** les fichiers de `packages/` via `!include_dir_named packages` (voir `configuration.yaml`). `chaudiere.yaml` et `chauffage.yaml` définissent donc, **en même temps**, des scripts/automatisations portant les **mêmes identifiants** (`chauffage_sieste_adulte_fin`, `chauffage_depart_temporaire`, `chauffage_retour_temporaire`, etc.).

En pratique, comme les fichiers sont chargés par ordre alphabétique et que YAML fusionne les dictionnaires, **`chauffage.yaml` (chargé après) écrase silencieusement les définitions de `chaudiere.yaml`** pour toute clé identique. Le contenu de `chaudiere.yaml` est donc aujourd'hui **du code mort** : il ne provoque pas d'erreur au démarrage, mais il n'a plus aucun effet réel, prend de la place, et surtout **sème la confusion** (c'est très exactement ce qui s'est passé dans cette conversation : le contenu de `chaudiere.yaml`, avec sa mention "vannes pas encore installées", a été confondu avec une "vraie" version alternative de `chauffage.yaml`).

## Recommandation

**À vérifier avec Gregory, mais tout indique que ce fichier devrait être supprimé** (ou à défaut renommé en `chaudiere.yaml.bak` / déplacé hors de `packages/` pour qu'il ne soit plus chargé par Home Assistant), puisque :

1. Son contenu est entièrement dépassé (décrit un état "vannes non installées" qui n'existe plus depuis le 12/09/2026).
2. Il est de toute façon neutralisé par `chauffage.yaml` au chargement.
3. Sa présence a directement causé une confusion lors de cette session de documentation.

Si Gregory confirme la suppression : supprimer `packages/chaudiere.yaml` **et ce fichier `chaudiere.md`** dans le même commit, avec un message du type `chore(chaudiere): supprime le package obsolete pre-vannes-Bosch, remplace par chauffage.yaml`.

Si au contraire ce fichier doit être conservé pour une autre raison (backup volontaire, référence historique...), il faudrait au minimum le sortir de `packages/` (Home Assistant ne doit pas le charger) et documenter pourquoi il est gardé.

## Comment modifier (si le fichier est conservé tel quel)

| Je veux... | Je fais... |
|---|---|
| Vérifier ce qui diffère exactement de `chauffage.yaml` | `diff packages/chaudiere.yaml packages/chauffage.yaml` |
| Supprimer le doublon (recommandé) | `git rm packages/chaudiere.yaml packages/chaudiere.md`, commit, `ha core check`, puis `ha core restart` |
| Le neutraliser sans le supprimer | Le déplacer hors de `packages/` (ex. `mv packages/chaudiere.yaml chaudiere.yaml.bak`) pour qu'il ne soit plus inclus par `!include_dir_named packages` |

## Piège connu

Ne pas modifier `chaudiere.yaml` en pensant modifier le comportement réel du chauffage : à cause de l'écrasement par `chauffage.yaml` décrit ci-dessus, **toute modification faite ici est sans effet visible**. Pour changer le comportement réel du chauffage, voir [`packages/chauffage.md`](chauffage.md).
