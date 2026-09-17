# themes/amethyst-glow.yaml — Documentation

## Rôle du fichier

Thème nommé **"amethyst-glow Theme by Greg"** (le nom complet, espaces compris, est la clé YAML de premier niveau — c'est le nom qui apparaîtra dans le sélecteur de thème HA). Mode sombre uniquement, palette violette/dorée (fond `#19122a`, texte doré `#f6d68a`, accent lavande `#d9c4f0`), image de fond "cuisine moderne".

## Différence volontaire avec `maison.yaml` / `alpine-night.yaml`

Le commentaire du fichier précise explicitement : **aucun `card-mod-theme` n'est défini ici**, uniquement des variables HA natives (barre latérale, menus, popups "plus d'infos", pages Paramètres). C'est délibéré, pour ne pas entrer en conflit avec le card-mod déjà présent sur les cartes du dashboard qui utilise ce thème (bug connu de card-mod, référencé comme issue #313). **Ne pas ajouter de `card-mod-theme`/`card-mod-card-yaml` à ce fichier sans avoir vérifié que ça ne recrée pas ce conflit.**

## Variables clés

- **`modes: dark:`** : fond `#19122a`/`#241a38`, texte doré `#f6d68a` (primary et accent), texte secondaire lavande `#d9c4f0`, sélection sidebar dorée.
- **`lovelace-background`** : image `/local/images/wallpaper/modern-kitchen-design-clean-elegant-comfortable-luxury-generated-by-ai.jpg`.

## Comment modifier

| Je veux... | Je modifie... |
|---|---|
| Changer la couleur dominante (doré) | `primary-text-color`, `text-primary-color`, `accent-color`, `sidebar-selected-text-color`, `switch-checked-color` (toutes à `#f6d68a` actuellement) |
| Changer l'image de fond | Le chemin dans `lovelace-background` |
| Appliquer un style card-mod à ce thème | Vérifier D'ABORD que le dashboard cible n'a pas déjà son propre card-mod par carte, pour éviter le conflit #313 mentionné dans les commentaires du fichier |
| Ajouter un mode clair | Ajouter un bloc `modes: light:` (absent actuellement) |

## Piège connu

Ne pas copier le pattern `card-mod-theme`/`card-mod-card-yaml` d'`alpine-night.yaml` ou de `maison.yaml` vers ce fichier sans réflexion : c'est précisément ce qui a été évité ici pour cause de conflit avec le card_mod déjà en place sur les cartes qui utilisent ce thème.
