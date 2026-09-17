# packages/taches_counters.yaml — Documentation

## Rôle du fichier

Définit 3 aides `counter` (compteurs) utilisées pour le suivi hebdomadaire des tâches complétées par personne : `counter.taches_completees_gregory`, `counter.taches_completees_matteo`, `counter.taches_completees_sandrine`. Icône trophée, valeur initiale 0, pas de 1, `restore: true` (la valeur survit à un redémarrage de HA).

**Ce fichier ne contient AUCUNE logique** : il ne fait que déclarer les 3 compteurs comme entités. Toute la logique qui les fait évoluer vit dans `automations.yaml` (hors dossier `packages/`), via deux automatisations :
- `taches_completees_incrementer` : incrémente le compteur de la personne concernée à chaque fois que le nombre d'éléments restants d'une de ses listes `todo.taches_gregory` / `todo.taches_matteo` / `todo.taches_sandrine` diminue (complétion OU suppression — l'entité `todo.*` ne fait pas la différence, approximation assumée).
- `taches_completees_reset_hebdo` : remet les 3 compteurs à zéro chaque lundi à minuit.

## Pourquoi ce fichier existe

Avant sa création, les deux automatisations ci-dessus référençaient ces 3 `counter.*` sans qu'ils n'existent nulle part (le commentaire d'origine dans `automations.yaml` demandait de les créer à la main via *Paramètres > Aides > Créer une aide > Compteur*, ce qui n'avait pas été fait), d'où des erreurs "Referenced entities ... are missing or not currently available" dans le journal HA. Les déclarer ici en YAML évite de devoir les recréer manuellement dans l'interface (utile aussi si l'installation est un jour reconstruite depuis zéro).

## Comment modifier

| Je veux... | Je modifie... |
|---|---|
| Ajouter une personne au suivi | Ajouter un bloc `counter.taches_completees_xxx` ici, **et** ajouter la nouvelle entité dans le dictionnaire `noms` de `taches_completees_incrementer` et dans la liste `entity_id` de `taches_completees_reset_hebdo` (dans `automations.yaml`) |
| Changer le jour/l'heure du reset hebdomadaire | Le trigger `time`/`weekday` de `taches_completees_reset_hebdo` (dans `automations.yaml`, pas ici) |
| Repartir de zéro immédiatement | Appeler le service `counter.reset` sur les 3 entités (Outils de développement > Actions), ou attendre le prochain lundi minuit |

## Piège connu

Ce fichier seul ne suffit pas à faire fonctionner le suivi : il doit toujours être accompagné des deux automatisations correspondantes dans `automations.yaml`. Si vous renommez une de ces 3 entités ici, pensez à répercuter le changement dans `automations.yaml`, sinon les erreurs "entities missing" réapparaîtront.
