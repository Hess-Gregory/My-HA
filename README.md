# My-HA

Configuration Home Assistant de Gregory (installation Home Assistant Green), versionnee avec git et sauvegardee sur ce depot GitHub prive.

## Contenu du depot

- `configuration.yaml`, `automations.yaml` : configuration principale.
- `packages/` : packages Home Assistant (chauffage, chaudiere/EMS-ESP, horaires, taches Kanban, versioning des dashboards...).
- `themes/` : themes Lovelace (glassmorphism violet/or, etc.).
- `www/` : ressources frontend personnalisees (cartes custom). Le sous-dossier `www/community/` (gere par HACS) n'est pas versionne, il est retelecharge automatiquement par HACS.
- `.storage/lovelace*` : configuration des dashboards Lovelace (mode "storage", edites via l'interface Home Assistant). **Seuls** ces fichiers sont suivis dans `.storage/` (voir securite ci-dessous).
- `scripts/` : outils du depot (versioning automatique des dashboards, voir plus bas).
- `versions.json` : version courante de chaque dashboard, generee automatiquement.

## Securite : ce qui n'est jamais versionne

Le fichier `.gitignore` bloque tout `.storage/` par defaut, a l'exception explicite de `.storage/lovelace*` :

```
.storage/*
!.storage/lovelace*
```

Sont donc exclus du depot : `secrets.yaml`, les bases de donnees (`*.db`), les logs, `.storage/auth`, `.storage/core.config_entries`, `.storage/cloud`, et tout le reste de `.storage/` qui contient des jetons et identifiants (Nabu Casa, Ajax, Reolink, Spotify, tokens d'application mobile, etc.).

**Regle a respecter en editant les dashboards :** ne jamais coller une cle API ou un identifiant en clair directement dans une carte Lovelace (passer par une integration ou `secrets.yaml`, qui reste hors du depot).

Avant tout nouveau commit massif (`git add -A`), il est recommande de verifier qu'aucun fichier sensible ne s'est glisse dedans :

```
git status --short | grep -iE '\.storage|secrets\.yaml|\.db$|\.db-|home-assistant_v2'
```

Cette commande ne doit rien afficher (a part eventuellement des fichiers `.storage/lovelace*`, qui sont normaux).

## Comment editer

Les dashboards sont modifies directement en fichiers via Studio Code Server (add-on Home Assistant), pas via l'editeur YAML integre a Lovelace : ce dernier supprime les commentaires et ne permet pas de suivi de version propre.

Workflow habituel :

1. Modifier le(s) fichier(s) dans Studio Code Server.
2. `git add -A`
3. `git commit -m "<type>(<scope>): <description>"` (voir convention ci-dessous)
4. `git push`

## Versioning automatique des dashboards

Chaque dashboard suivi a son propre numero de version `x.y.z` (semver), affiche en direct dans son footer, et mis a jour automatiquement a partir du message de commit.

### Convention de message de commit

```
<type>(<scope>)!: <description>
```

- `type` : `feat`, `fix`, `major`, `minor`, `patch`, ou un type neutre (`chore`, `docs`, `style`, `refactor`...) qui ne declenche aucun bump.
- `scope` : identifiant du dashboard concerne (le meme nom que le fichier `.storage/lovelace.<scope>`), par exemple `1_streaming`, `boite_a_outils`. Omis -> `global`.
- `!` : optionnel, force un bump MAJOR (changement cassant).

Regles de bump (semver) :

| Type de commit         | Bump  | Effet                              |
|-------------------------|-------|-------------------------------------|
| `major` ou suffixe `!`  | MAJOR | minor et patch repassent a 0        |
| `feat`, `minor`         | MINOR | patch repasse a 0                   |
| `fix`, `patch`          | PATCH | incremente juste le patch           |
| autre (`chore`, `docs`...) | aucun | pas de changement de version     |

Exemples :

```
feat(1_streaming): ajoute le bouton Spotify
fix(boite_a_outils): corrige l'icone du menu reseau
feat(1_streaming)!: restructure completement la vue
chore: mise a jour du gitignore
```

### Fonctionnement technique

1. Un hook git `post-commit` (installe une fois via `scripts/install-hooks.sh`) execute `scripts/bump_version.py` apres chaque commit.
2. Ce script lit le dernier message de commit, determine le type de bump, met a jour `versions.json`, puis cree automatiquement un petit commit `chore(version): <scope> -> <version>`.
3. Home Assistant lit `versions.json` via des capteurs `command_line` definis dans `packages/dashboard_versions.yaml` (un capteur par dashboard suivi, rafraichi toutes les 30 secondes).
4. Chaque dashboard affiche sa version en direct via une carte Markdown dans son footer, par exemple :

```yaml
type: markdown
content: >
  **v{{ states('sensor.version_dashboard_1_streaming') }}** - {{ as_timestamp(state_attr('sensor.version_dashboard_1_streaming','last_update')) | timestamp_custom('%d/%m/%Y %H:%M') }}

  _{{ state_attr('sensor.version_dashboard_1_streaming','last_change') }}_
```

### Installer le hook (une seule fois, ou apres un nouveau clone)

```
bash scripts/install-hooks.sh
```

### Ajouter un nouveau dashboard au suivi

1. Ajouter un bloc `sensor` (platform `command_line`) dans `packages/dashboard_versions.yaml`, sur le modele des exemples existants, avec le meme `<scope>` que celui utilise dans les messages de commit.
2. Ajouter la carte Markdown de footer dans le dashboard concerne.
3. Redemarrer Home Assistant (ou recharger les capteurs) pour que le nouveau capteur apparaisse.
