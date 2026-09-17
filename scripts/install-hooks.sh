#!/usr/bin/env bash
set -e
ROOT="$(git rev-parse --show-toplevel)"
cp "$ROOT/scripts/post-commit" "$ROOT/.git/hooks/post-commit"
chmod +x "$ROOT/.git/hooks/post-commit" "$ROOT/scripts/bump_version.py"
echo "Hook post-commit installe."
