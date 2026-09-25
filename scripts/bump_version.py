#!/usr/bin/env python3
"""Bump automatique de version PAR FICHIER, declenche par le hook git post-commit.

Pour le dernier commit, on lit son message (convention `type(scope)!: description`)
pour determiner l'ampleur du bump (major/minor/patch), puis on bump INDIVIDUELLEMENT
chaque fichier "suivi" modifie par ce commit (packages/*.yaml, automations.yaml,
configuration.yaml, scenes.yaml, scripts.yaml, themes/*.yaml, dashboards
.storage/lovelace.*). Chaque fichier a donc sa propre version, independante des
autres, stockee dans versions.json (cle = chemin relatif du fichier).

Pour les fichiers YAML (pas les dashboards, qui sont du JSON), une ligne d'entete
"# [AUTO-VERSION] ..." est ajoutee/mise a jour en premiere ligne du fichier.

Cree un commit de suivi "chore(version): ..." avec les fichiers mis a jour.
Ce commit est ignore par ce meme script (evite la boucle infinie).
"""
import json
import re
import subprocess
import sys
import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VERSIONS_FILE = ROOT / "versions.json"
HEADER_MARK = "# [AUTO-VERSION]"

COMMIT_RE = re.compile(
    r"^(?P<type>[a-zA-Z]+)(\((?P<scope>[a-zA-Z0-9_\-./]+)\))?(?P<bang>!)?:\s*(?P<desc>.+)$"
)

TRACKED_ROOT_FILES = {
    "automations.yaml",
    "configuration.yaml",
    "scenes.yaml",
    "scripts.yaml",
}
TRACKED_PREFIXES = ("packages/", "themes/")
DASHBOARD_PREFIX = ".storage/lovelace."


def is_tracked(rel_path: str) -> bool:
    if rel_path.startswith(DASHBOARD_PREFIX):
        return True
    if rel_path in TRACKED_ROOT_FILES:
        return True
    if rel_path.startswith(TRACKED_PREFIXES) and rel_path.endswith((".yaml", ".yml")):
        return True
    return False


def is_yaml(rel_path: str) -> bool:
    return rel_path.endswith((".yaml", ".yml"))


def run(cmd):
    return subprocess.check_output(cmd, cwd=ROOT, text=True)


def get_last_commit_message() -> str:
    return run(["git", "log", "-1", "--pretty=%B"]).strip()


def get_changed_files() -> list:
    try:
        out = run(["git", "diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"])
    except subprocess.CalledProcessError:
        return []
    return [line.strip() for line in out.splitlines() if line.strip()]


def bump(version: str, kind: str) -> str:
    try:
        major, minor, patch = (int(x) for x in version.split("."))
    except (ValueError, AttributeError):
        major, minor, patch = 0, 0, 0
    if kind == "major":
        return f"{major + 1}.0.0"
    if kind == "minor":
        return f"{major}.{minor + 1}.0"
    return f"{major}.{minor}.{patch + 1}"


def bump_kind(commit_type: str, bang: str) -> str:
    if bang:
        return "major"
    if commit_type == "feat":
        return "minor"
    return "patch"


def update_yaml_header(path: Path, version: str, when_iso: str, description: str) -> None:
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)
    while lines and lines[0].startswith(HEADER_MARK):
        lines.pop(0)
    when_human = datetime.datetime.fromisoformat(when_iso).strftime("%d/%m/%Y %H:%M")
    header = f"{HEADER_MARK} v{version} | {when_human} | {description}\n"
    path.write_text(header + "".join(lines), encoding="utf-8")


def main() -> None:
    msg = get_last_commit_message()
    first_line = msg.splitlines()[0] if msg else ""
    if first_line.startswith("chore(version):"):
        return  # commit de suivi genere par ce script : on ne rebondit pas dessus

    m = COMMIT_RE.match(first_line)
    if not m:
        return  # message non conventionnel : pas de bump automatique

    kind = bump_kind(m.group("type"), m.group("bang"))
    description = m.group("desc").strip()

    versions = {}
    if VERSIONS_FILE.exists():
        versions = json.loads(VERSIONS_FILE.read_text(encoding="utf-8"))

    # Fichiers supprimes (dans ce commit ou avant) : leur entree est retiree de versions.json
    # au lieu d'etre bumpee (un "git add" sur un fichier supprime faisait echouer le hook).
    pruned = [k for k in list(versions) if not (ROOT / k).exists()]
    for k in pruned:
        versions.pop(k)
    changed = [f for f in get_changed_files() if is_tracked(f) and (ROOT / f).exists()]
    if not changed and not pruned:
        return

    now = datetime.datetime.now().astimezone().isoformat()
    to_stage = []

    for rel in changed:
        entry = versions.get(rel, {"version": "0.0.0"})
        new_version = bump(entry.get("version", "0.0.0"), kind)
        versions[rel] = {
            "version": new_version,
            "last_change": description,
            "last_update": now,
        }
        if is_yaml(rel):
            update_yaml_header(ROOT / rel, new_version, now, description)
        to_stage.append(rel)

    VERSIONS_FILE.write_text(
        json.dumps(versions, indent=2, ensure_ascii=False, sort_keys=True) + "\n",
        encoding="utf-8",
    )

    subprocess.run(["git", "add", "versions.json", *to_stage], cwd=ROOT, check=True)
    names = ", ".join(Path(f).name for f in to_stage[:5])
    suffix = "..." if len(to_stage) > 5 else ""
    msg = (f"chore(version): bump {len(to_stage)} fichier(s) ({names}{suffix})" if to_stage
           else f"chore(version): retrait de {len(pruned)} fichier(s) supprime(s) du suivi")
    if to_stage and pruned:
        msg += f" + retrait de {len(pruned)} fichier(s) supprime(s)"
    subprocess.run(
        [
            "git",
            "commit",
            "-m",
            msg,
        ],
        cwd=ROOT,
        check=True,
    )
    print(f"[bump_version] {len(to_stage)} fichier(s) mis a jour ({kind})")


if __name__ == "__main__":
    main()
