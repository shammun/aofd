"""git pre-commit rules for staged paths (PLANNING §7.2), run by ``.githooks/pre-commit`` after check_secrets.py.

Fails (exit 1) when a staged file is book-derived or private (``*.pdf``, ``_private/``, ``chapters/`` other than the
page map, ``outputs/``, ``data/raw``, ``tests/book_values_*``), larger than 10 MB, or a ``*_colab.ipynb`` with outputs.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BAD = re.compile(r"(\.pdf$|^_private/|^chapters/(?!_page_map\.json$)|^outputs/|^data/raw/|^tests/book_values_)", re.I)
MAX = 10 * 1024 * 1024


def main() -> int:
    staged = subprocess.run(["git", "diff", "--cached", "--name-only", "--diff-filter=ACMR"], cwd=ROOT,
                            capture_output=True, text=True).stdout.split("\n")
    problems = []
    for rel in filter(None, staged):
        p = ROOT / rel
        if BAD.search(rel):
            problems.append(f"{rel}: private or book-derived path")
            continue
        if p.is_file() and p.stat().st_size > MAX:
            problems.append(f"{rel}: {p.stat().st_size / 1e6:.1f} MB > 10 MB")
        if rel.endswith("_colab.ipynb") and p.is_file():
            nb = json.loads(p.read_text(encoding="utf-8"))
            if any(c.get("outputs") for c in nb.get("cells", []) if c.get("cell_type") == "code"):
                problems.append(f"{rel}: Colab twin has outputs (strip them)")
    if problems:
        print("pre-commit: refused\n  " + "\n  ".join(problems), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
