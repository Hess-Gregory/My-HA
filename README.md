# My-HA

 _    _                                         _     _              _
| |  | |                          /\           (_)   | |            | |
| |__| | ___  _ __ ___   ___     /  \   ___ ___ _ ___| |_ __ _ _ __ | |_
|  __  |/ _ \| '_ ` _ \ / _ \   / /\ \ / __/ __| / __| __/ _` | '_ \| __|
| |  | | (_) | | | | | |  __/  / ____ \\__ \__ \ \__ \ || (_| | | | | |_
|_|  |_|\___/|_| |_| |_|\___| /_/    \_\___/___/_|___/\__\__,_|_| |_|\__| by Gregory HESS.


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

## Versionning automatique

> **Instruction pour toute IA (Claude, Gemini, ChatGPT...) travaillant sur ce depot :**
> Ce depot utilise un systeme de versionning automatique par fichier (hook Git post-commit + capteur `sensor.versions_config_ha` + footers de versionning sur les dashboards). Avant toute modification, lis integralement cette section et applique-la strictement. En particulier : ne jamais utiliser `git add -A` ou `git add .` (toujours lister les fichiers explicitement) ; ne jamais commencer un message de commit par `chore(version):` ; ne jamais editer `versions.json` ni les lignes `# [AUTO-VERSION]` a la main ; utiliser les prefixes `fix:` / `feat:` / `feat!:` selon l'ampleur du changement ; apres toute modification d'un dashboard, relancer `python3 scripts/add_footer_card.py <slug>` ; apres toute modification de configuration, faire `ha core check` avant un eventuel restart. En cas de doute sur un point non couvert ici, demande confirmation avant d'agir.

Chaque fichier suivi (`packages/*.yaml`, `automations.yaml`, `configuration.yaml`, `scenes.yaml`, `scripts.yaml`, `themes/*.yaml`, et chaque dashboard `.storage/lovelace.*`) possede son propre numero de version, incremente automatiquement par un hook Git a chaque commit. Les dashboards affichent en pied de page leur version et celle des fichiers `packages/` dont ils dependent.

### Modifier un fichier de configuration (packages, automatisations, scenes, scripts, themes...)

1. Modifier le fichier normalement.
2. `ha core check` pour valider la configuration.
3. `git add <chemin_du_fichier>` (jamais `git add -A` ni `git add .`).
4. `git commit -m "type(scope): description"` :
   - `fix: ...` -> incremente le patch (0.0.x)
   - `feat: ...` -> incremente le mineur (0.x.0)
   - `feat!: ...` ou `fix!: ...` -> incremente le majeur (x.0.0)
   - tout autre prefixe (`chore`, `refactor`, `docs`...) -> patch par defaut

   Le hook post-commit bump automatiquement la version du/des fichier(s) modifie(s), met a jour l'en-tete `# [AUTO-VERSION]` et `versions.json`, puis cree lui-meme un commit `chore(version): ...`.
5. `git push`.
6. Redemarrer si necessaire (`ha core restart`) - pas systematique : les automatisations/scenes/scripts se rechargent souvent sans coupure via Parametres -> Systeme -> Actions -> "Recharger la configuration YAML" ; un package qui ajoute de nouvelles entites (ex. `command_line`) demande un restart complet.

#### Exemple concret

Je veux ajuster un seuil dans `packages/chauffage.yaml` :

```bash
# 1. Editer packages/chauffage.yaml avec l'editeur

# 2. Valider
ha core check

# 3. Indexer uniquement ce fichier
git add packages/chauffage.yaml

# 4. Committer (ici un simple correctif -> patch)
git commit -m "fix(chauffage): corrige le seuil de declenchement du mode absence"

# 5. Pousser (le hook a deja cree son propre commit de bump automatiquement)
git push

# 6. Recharger ou redemarrer selon le besoin
ha core restart
```

Resultat : `packages/chauffage.yaml` passe par exemple de `v0.1.4` a `v0.1.5`, `versions.json` et l'en-tete du fichier sont mis a jour tout seuls, et tous les dashboards qui dependent de `chauffage.yaml` (Accueil, Ma Maison, Mon Confort, Transversal) afficheront automatiquement la nouvelle version dans leur footer, sans aucune action supplementaire.

### Modifier un dashboard (Lovelace)

1. Modifier le dashboard (editeur visuel de l'UI HA, ou directement le fichier `.storage/lovelace.<slug>`).
2. Si de nouvelles entites d'un fichier `packages/*.yaml` sont utilisees, relancer `python3 scripts/detect_dependencies.py` (detection automatique) ou editer `scripts/dashboard_dependencies.json` a la main.
3. Regenerer le footer : `python3 scripts/add_footer_card.py <slug>` (idempotent, a relancer a chaque modification du dashboard).
4. Verifier la validite JSON : `python3 -c "import json; json.load(open('.storage/lovelace.<slug>'))"`.
5. `git add .storage/lovelace.<slug>` (+ `scripts/dashboard_dependencies.json` si modifie), `git commit -m "..."`, `git push`.
6. Si le fichier `.storage` a ete edite directement (hors UI), un `ha core restart` est necessaire pour que Home Assistant recharge la nouvelle structure en memoire.

#### Exemple concret

Je veux ajouter une carte utilisant une entite de `packages/taches_counters.yaml` sur le dashboard `1_accueil` :

```bash
# 1. Ajouter la carte via l'editeur visuel HA, ou editer directement le fichier

# 2. Detecter automatiquement la nouvelle dependance
python3 scripts/detect_dependencies.py

# 3. Regenerer le footer avec la nouvelle dependance
python3 scripts/add_footer_card.py 1_accueil

# 4. Verifier le JSON
python3 -c "import json; json.load(open('.storage/lovelace.1_accueil'))"

# 5. Indexer, committer, pousser
git add .storage/lovelace.1_accueil scripts/dashboard_dependencies.json
git commit -m "feat(accueil): affiche le compteur de taches sur la vue principale"
git push

# 6. Redemarrer pour que HA recharge le dashboard modifie sur disque
ha core restart
```

### A ne jamais faire

- Ne jamais ecrire un message de commit commencant par `chore(version):` toi-meme (prefixe reserve au hook, sinon aucun bump n'aura lieu).
- Ne jamais editer `versions.json` ni la ligne `# [AUTO-VERSION]` a la main.
- Ne jamais utiliser `git add -A` ou `git add .`.
- Ne jamais editer la carte "footer" (commentaire `<!-- versioning-footer -->`) a la main sur un dashboard - utiliser `scripts/add_footer_card.py`.
- Un nouveau fichier dans `packages/` ou `themes/` est suivi automatiquement, mais pour que sa version s'affiche dans un footer, l'ajouter a `json_attributes` du capteur dans `packages/dashboard_versions.yaml`, puis redemarrer.
- Un nouveau dashboard doit etre ajoute a `DASHBOARD_SLUGS` dans `scripts/detect_dependencies.py` et a `json_attributes` du capteur pour etre pris en compte.

### Numerotation des versions (semver) et description de chaque changement

Chaque fichier suit un numero de version `MAJOR.MINOR.PATCH`, initialise a `0.0.1` la premiere fois qu'il est suivi. A chaque commit qui le modifie, le hook determine le type de bump a partir du prefixe du message de commit :

| Prefixe du commit | Bump | Exemple |
|---|---|---|
| `feat!:` ou `fix!:` (ou corps contenant `BREAKING CHANGE:`) | MAJOR (`x.0.0`, minor et patch remis a 0) | `0.3.4` -> `1.0.0` |
| `feat:` | MINOR (`0.x.0`, patch remis a 0) | `0.3.4` -> `0.4.0` |
| tout le reste (`fix:`, `chore:`, `refactor:`, `docs:`, sans prefixe...) | PATCH (`0.0.x`) | `0.3.4` -> `0.3.5` |

Le bump s'applique independamment a **chaque fichier suivi modifie dans le commit** : si un commit touche `packages/chauffage.yaml` et `packages/chaudiere.yaml`, les deux sont bumpes du meme type, mais chacun garde sa propre numerotation (l'un peut etre en `0.4.0` et l'autre en `1.2.0`, sans lien entre eux).

**La description qui apparait dans l'historique de chaque fichier (`last_change` dans `versions.json`) est exactement la partie du message de commit apres `type(scope): `.** Par exemple, pour :

```bash
git commit -m "fix(chauffage): corrige le seuil de declenchement du mode absence"
```

`versions.json` enregistrera pour `packages/chauffage.yaml` :

```json
"packages/chauffage.yaml": {
  "version": "0.1.5",
  "last_change": "corrige le seuil de declenchement du mode absence",
  "last_update": "2026-09-17T19:42:10+02:00"
}
```

**Consequence importante pour toute IA qui redige le commit :** cette description est la seule trace historique de ce qui a change pour ce fichier precis - elle doit donc etre claire, specifique et ecrite du point de vue du changement (pas juste "modification" ou "mise a jour"). Si un commit touche plusieurs fichiers pour des raisons differentes, ils recevront tous la MEME description : il vaut donc mieux faire un commit distinct par changement logique plutot qu'un gros commit fourre-tout, pour que l'historique de version de chaque fichier reste comprehensible individuellement.

Avant de choisir le prefixe (`fix`/`feat`/`feat!`), l'IA doit se demander : est-ce que ce changement casse une automatisation, un dashboard ou une entite existante pour l'utilisateur (MAJOR) ? Est-ce que ca ajoute une nouvelle fonctionnalite/entite/carte (MINOR) ? Ou est-ce juste un correctif/ajustement sans nouveaute (PATCH) ? En cas de doute entre deux niveaux, choisir le plus bas (PATCH) plutot que de sur-incrementer.
