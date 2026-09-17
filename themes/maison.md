# themes/maison.yaml — Documentation

## Rôle du fichier

**Le thème principal, utilisé sur les 15 dashboards de l'installation.** Fond gris-violet profond (`#14101d`/`#251c33`), texte lilas clair (`#efe6fb`), accents dorés (`#f6d68a`) et lavande (`#d9c4f0`). Définit aussi une longue liste de variables CSS custom (`--glass-*`, `--header-*`, `--accent-*`, `--wallpaper-scrim`) utilisées par les cartes personnalisées des différents dashboards pour un effet "verre dépoli" cohérent partout.

## ⚠️ Point capital : mode clair = copie exacte du mode sombre

Sur demande explicite ("lisible à plus d'un mètre, jamais criard le jour, jamais aveuglant la nuit"), **le bloc `modes: light:` est une copie mot pour mot du bloc `modes: dark:`** — il n'y a plus AUCUNE différence visuelle entre les deux modes. Conséquence directe : **peu importe ce que fait l'automatisation jour/nuit** (`automations/theme_jour_nuit.yaml`, si elle existe/est active), l'affichage reste identique matin, midi et soir. Cette automatisation peut rester active sans effet visuel, ou être désactivée — les deux options sont équivalentes désormais.

**Si vous voulez un jour réintroduire un vrai mode clair différent** : il faudra redéfinir tout le bloc `modes: light:` séparément du bloc `dark:`, et vérifier que l'automatisation jour/nuit fonctionne toujours (elle n'a probablement pas été supprimée, juste rendue sans effet visuel).

## Variables clés

- **Palette de base** (hors modes) : `primary-color: "#8a6d3b"`, `accent-color: "#6d5a8a"`, `mush-title-color`/`mush-icon-color: "#8a6d3b"` (utilisées par les cartes Mushroom).
- **Par mode** (dark = light, identiques) :
  - Fonds : `primary-background-color: "#14101d"`, `card-background-color`/`ha-card-background: "#251c33cc"` (le `cc` final = transparence ~80%, pour l'effet verre).
  - Textes : `primary-text-color: "#efe6fb"`, `secondary-text-color: "#c8b8dd"`.
  - Variables custom "glass" (fond/flou/bordure/ombre des cartes en verre dépoli) : `--glass-bg`, `--glass-bg-strong`, `--glass-bg-accent`, `--glass-blur: blur(16px)`, `--glass-border`, `--glass-shadow`.
  - Variables custom d'en-tête : `--header-text: "#f6d68a"` (doré), `--header-sub: "#d9c4f0"` (lavande), `--header-glow` (ombre portée du texte pour la lisibilité sur fond d'image).
  - Variables custom d'accent sémantique : `--accent-gold`, `--accent-lavender`, `--accent-good` (vert, `#66bb6a`), `--accent-warn` (orange, `#ffb74d`), `--accent-bad` (rouge, `#ef5350`) — à utiliser dans les cartes pour rester cohérent avec le code couleur du thème plutôt que des couleurs codées en dur.
  - `--wallpaper-scrim` : voile sombre semi-transparent posé sur l'image de fond pour garder le texte lisible.

## Comment modifier

| Je veux... | Je modifie... |
|---|---|
| Changer la couleur de fond des cartes | `card-background-color` / `ha-card-background` (les deux, dans `dark:` ET `light:` puisqu'ils sont identiques) |
| Changer l'intensité du flou "verre" | La valeur dans `--glass-blur` |
| Changer la couleur des titres/en-têtes des dashboards | `--header-text` / `--header-sub` |
| Réintroduire un vrai mode clair différent | Redéfinir entièrement le bloc `modes: light:` séparément de `dark:` — et vérifier l'état de l'automatisation jour/nuit |
| Utiliser une couleur sémantique dans une nouvelle carte | Référencer `var(--accent-good)` / `var(--accent-warn)` / `var(--accent-bad)` plutôt que coder une couleur en dur, pour rester cohérent si la palette change un jour |

## Piège connu

**Toute modification de couleur doit être répercutée dans LES DEUX blocs `dark:` et `light:`** tant qu'ils sont volontairement identiques — modifier un seul des deux recréerait une différence jour/nuit non voulue et potentiellement incohérente selon le mode d'affichage choisi par chaque utilisateur HA.
