# packages/horaires_pro_feries.yaml — Documentation

## Rôle du fichier

Automatise le traitement des jours fériés belges pour Grégory et Sandrine, à partir de l'entité `calendar.belgique` (intégration Holiday). Complète `horaires_pro_editeur.yaml` (qui gère la saisie manuelle) en supprimant la saisie répétitive des fériés, et tient un compteur des fériés tombant un week-end, qui ouvrent un droit à récupération.

## Règle métier

- **Férié du lundi au vendredi** → une tâche « Jour férié » de **8h00** est créée dans Todoist, **pour les deux personnes**.
- **Férié tombant un samedi ou un dimanche** → **aucune tâche n'est créée**. Le jour alimente le compteur « fériés à récupérer ».

La portée est **l'année civile en cours** (1er janvier au 31 décembre). Au 1er janvier, les compteurs repartent naturellement sur la nouvelle année, et l'automatisation crée les fériés de l'année qui commence.

## Pourquoi un compteur calculé et non un `counter` / `input_number`

Un compteur que l'on incrémente dérive : double comptage si l'automatisation tourne deux fois, désynchronisation si une tâche est supprimée à la main dans Todoist, valeur fausse après une restauration de sauvegarde. Ici le compteur est **recalculé** à chaque déclenchement :

```
jours à récupérer = fériés tombant un week-end cette année
                  − tâches « Récupération jour férié » déjà posées cette année
```

Il ne peut donc pas dériver, et il se corrige tout seul si tu ajoutes ou retires une récupération à la main. Le résultat est borné à zéro (pas de valeur négative si tu poses plus de récupérations que de droits).

**Conséquence pratique** : pour consommer un jour de récupération, il suffit de créer normalement une tâche de type « Récupération jour férié » à la date choisie, via le dashboard. Le compteur se décrémente tout seul.

## Entités créées

- **`sensor.horaires_pro_feries_a_recuperer_gregory`** et **`sensor.horaires_pro_feries_a_recuperer_sandrine`** — nombre de jours fériés à récupérer, en jours. Attributs : `feries_weekend` (la liste des fériés concernés, avec date et nom) et `deja_recuperes` (le nombre de récupérations déjà posées).
- **`automation.horaires_pro_generer_jours_feries`** — crée les tâches des fériés en semaine.

## Fonctionnement technique

Un capteur template classique **ne peut pas** appeler `calendar.get_events` (un template n'appelle pas de service). Les deux compteurs sont donc des **capteurs déclenchés** (`trigger:` + `action:` + `sensor:`) : ils appellent le service, récupèrent la réponse dans `feries_annee`, et calculent leur état à partir de là.

Ils se recalculent au démarrage de HA, tous les jours à 03:10, et à chaque changement des capteurs de blocs — donc immédiatement après que tu aies posé ou retiré une récupération.

L'automatisation de création tourne au démarrage de HA et tous les jours à 03:20. Elle est **idempotente** : avant chaque création, elle vérifie qu'aucune tâche du même label n'existe déjà à cette date dans les blocs. Tu peux donc la lancer à la main autant de fois que tu veux sans créer de doublons.

## Comment modifier

| Je veux... | Je modifie... |
|---|---|
| Changer la durée d'un jour férié | `duration: 480` (en minutes) dans l'appel `rest_command.horaires_pro_todoist_create_task` |
| Changer l'heure de début des tâches créées | `jour ~ ' 08:00'` dans le calcul de `due_datetime` |
| Créer aussi une tâche pour les fériés de week-end | Remplacer la condition `isoweekday() <= 5` par une logique qui choisit le label `*_Recup_Jour_Ferie` — et retirer alors ces jours du calcul des compteurs, sans quoi ils seraient comptés deux fois |
| Ne générer que pour une seule personne | Retirer l'entrée correspondante de la liste `for_each` de la boucle interne |
| Changer le pays des jours fériés | L'entité `calendar.belgique` (intégration Holiday, à reconfigurer dans les intégrations), puis son nom dans ce fichier |
| Décaler les horaires d'exécution | Les déclencheurs `at: "03:10:00"` (compteurs) et `at: "03:20:00"` (création) |

## Pièges connus

- **Les deux boucles `repeat` sont imbriquées, et `repeat.item` de la boucle interne masque celui de la boucle externe.** C'est pour cette raison que la date et le nom du férié sont capturés dans des variables (`jour`, `nom_ferie`) **avant** d'entrer dans la boucle interne. Si tu ajoutes du code dans la boucle interne, n'essaie jamais d'y lire `repeat.item.start` : ce n'est plus l'événement du calendrier.
- **Ne jamais mettre de `condition:` seule dans une boucle `repeat`** : en Home Assistant, une condition non remplie arrête tout le script, pas seulement l'itération en cours. D'où l'usage de `if / then` partout dans ce fichier.
- Le test d'existence s'appuie sur les capteurs de blocs, qui reflètent l'état du projet Todoist **au dernier rafraîchissement**. L'automatisation rafraîchit donc les capteurs avant de commencer. Si tu la relances deux fois en moins de cinq secondes, le second passage pourrait ne pas voir les tâches du premier — le mode `single` l'en empêche normalement.
- Les fériés sont des événements « journée entière » : leur `start` est une date (`AAAA-MM-JJ`), pas un horodatage. Le code fait `(repeat.item.start | string)[:10]` pour s'en accommoder dans les deux cas.
- Ce fichier dépend de labels Todoist définis ailleurs (`G_Jour_Ferie`, `S_Jour_Ferie`, `G_Recup_Jour_Ferie`, `S_Recup_Jour_Ferie`). Ils doivent rester cohérents avec les dictionnaires de `horaires_pro_editeur.yaml` et de `horaires_pro.yaml` — voir la section « Dictionnaires de labels » de la documentation de l'éditeur.

## À faire à l'installation

1. Ajouter `"packages/horaires_pro_feries.yaml"` à la liste `json_attributes` du capteur dans `packages/dashboard_versions.yaml`, sans quoi sa version ne remontera pas dans les footers.
2. Redémarrer Home Assistant (le fichier crée de nouvelles entités, un simple rechargement YAML ne suffit pas).
3. Lancer l'automatisation une première fois à la main pour peupler l'année en cours.