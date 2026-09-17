# themes/alpine-night.yaml — Documentation

## Rôle du fichier

Thème Home Assistant nommé `alpine-night`. Définit uniquement un mode **sombre** (`modes: dark:`) : palette bleu-nuit/gris-anthracite avec accent orange (`#f5a742`), image de fond montagne ("Les Orres"), et un style `card-mod` appliqué automatiquement aux cartes de type `entities` (fond semi-transparent flouté, coins arrondis, texte blanc en gras pour l'en-tête).

## Variables clés

- **Palette native HA** (`modes: dark:`) : fonds (`primary-background-color` `#0d1219`, `card-background-color` `#293544`), textes blancs, accent orange (`accent-color`/`sidebar-selected-text-color`/`state-icon-active-color` = `#f5a742`).
- **`lovelace-background`** : image de fond plein écran (`/local/images/wallpaper/alpine/les-orres-01.jpg`) — remplace le `background:` normalement défini au niveau du dashboard.
- **`card-mod-theme: "alpine-night"`** : active card-mod pour ce thème (nécessite l'intégration custom **card-mod**, HACS).
- **`card-mod-card-yaml`** : style CSS appliqué à toute carte `entities` (clé `entities:`) et, en secours, à toute carte non listée explicitement (clé `.`) — fond `rgba(41, 53, 68, 0.75)` flouté (`backdrop-filter: blur(8px)`), coins arrondis 14px, ombre supprimée.

## Comment modifier

| Je veux... | Je modifie... |
|---|---|
| Changer la couleur d'accent | `accent-color`, `sidebar-selected-text-color`, `sidebar-selected-icon-color`, `mdc-theme-secondary`, `switch-checked-color`, `state-icon-active-color` (toutes doivent rester cohérentes entre elles) |
| Changer l'image de fond | Le chemin dans `lovelace-background` (fichier à placer dans `/config/www/images/wallpaper/alpine/`) |
| Étendre le style card-mod à d'autres types de carte (ex. `markdown`) | Ajouter une clé du type de carte sous `card-mod-card-yaml` avec son propre bloc `ha-card { ... }` |
| Ajouter un mode clair | Ajouter un bloc `modes: light:` avec les mêmes variables (actuellement absent — ce thème n'a qu'un mode sombre) |

## Piège connu

Ce thème n'a **pas** de mode `light:` défini — s'il est appliqué à un utilisateur dont le mode d'affichage HA est réglé sur "Clair", le rendu peut être incohérent (variables de couleur du mode clair par défaut de HA mélangées aux styles card-mod pensés pour le sombre).
