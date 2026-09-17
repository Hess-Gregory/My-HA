#!/usr/bin/env python3
"""Incremente la version d'un dashboard en fonction du dernier message de commit.

Convention du message de commit (inspiree de Conventional Commits) :

    <type>(<scope>)!: <description>

    type  : feat, fix, major, minor, patch, chore, docs, style, refactor...
            (seuls feat/fix/major/minor/patch/! declenchent un bump)
    scope : identifiant du dashboard (ex: eclairage, boite_a_outils).
            Optionnel : "global" si absent.
    !     : optionnel, force un bump MAJOR (changement cassant).

Regles de bump :
    - type "major" ou "!" present   -> MAJOR (minor et patch repassent a 0)
    - type "feat" ou "minor"        -> MINOR (patch repasse a 0)
    - type "fix" ou "patch"         -> PATCH
    - tout le reste (chore, docs, style, refactor...) -> pas de bump

Exemples :
    feat(1_streaming): ajoute le bouton Spotify
    fix(boite_a_outils): corrige l'icone du menu
    feat(1_streaming)!: restructure completement la vue
    chore: mise a jour du gitignore
"""
import json
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
VERSIONS_FILE = REPO_ROOT / "versions.json"

COMMIT_RE = re.compile(
    r"^(?P<type>[a-zA-Z]+)(\((?P<scope>[a-zA-Z0-9_-]+)\))?(?P<bang>!)?:\s*(?P<desc>.+)$"
)

MAJOR_TYPES = {"major"}
MINOR_TYPES = {"feat", "minor", "feature"}
PATCH_TYPES = {"fix", "patch", "bugfix"}


def get_last_commit_message():
    result = subprocess.run(
        ["git", "log", "-1", "--pretty=%B"],
        cwd=REPO_ROOT, capture_output=True, text=True, check=True,
    )
    return result.stdout.strip()


def load_versions():
    if VERSIONS_FILE.exists():
        return json.loads(VERSIONS_FILE.read_text())
    return {}


def save_versions(data):
    VERSIONS_FILE.write_text(
        json.dumps(data, indent=2, ensure_ascii=False, sort_keys=True) + "\n"
    )


def bump(version, level):
    major, minor, patch = (int(x) for x in version.split("."))
    if level == "major":
        return f"{major + 1}.0.0"
    if level == "minor":
        return f"{major}.{minor + 1}.0"
    return f"{major}.{minor}.{patch + 1}"


def main():
    message = get_last_commit_message()
    first_line = message.splitlines()[0] if message else ""

    if first_line.startswith("chore(version):"):
        return 0

    match = COMMIT_RE.match(first_line)
    if not match:
        return 0

    ctype = match.group("type").lower()
    scope = match.group("scope") or "global"
    breaking = bool(match.group("bang"))
    desc = match.group("desc").strip()

    if breaking or ctype in MAJOR_TYPES:
        level = "major"
    elif ctype in MINOR_TYPES:
        level = "minor"
    elif ctype in PATCH_TYPES:
        level = "patch"
    else:
        return 0

    versions = load_versions()
    entry = versions.get(scope, {"version": "0.0.0"})
    entry["version"] = bump(entry.get("version", "0.0.0"), level)
    entry["last_change"] = desc
    entry["last_update"] = datetime.now().astimezone().isoformat()
    versions[scope] = entry
    save_versions(versions)

    subprocess.run(["git", "add", "versions.json"], cwd=REPO_ROOT, check=True)
    subprocess.run(
        ["git", "commit", "--no-verify", "-m", f"chore(version): {scope} -> {entry['version']}"],
        cwd=REPO_ROOT, check=True,
    )
    print(f"[bump_version] {scope}: {entry['version']} ({level})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
