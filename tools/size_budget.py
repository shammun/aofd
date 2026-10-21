"""Size budget for the public repo and its GitHub Pages site (PLANNING §2.5, R3 §4.2, R1 §5.4).

Limits (fail = exit 1, warn = printed only):

* any tracked file < 50 MB (GitHub refuses 100 MB)                              — fail
* explainer ``viz/**/*.html`` and scene ``scenes/**/*.html`` ≤ 600 KB          — fail
* chapter page ``notebooks/*.html`` ≤ 15 MB (``book.yaml -> project.page_budget_mb``) — fail
* derived product ``data/derived/**`` ≤ 10 MB each and ≤ 150 MB in total       — fail
* repository (tracked files) > 800 MB                                           — warn
* movie files never in this repo (``*.mp4``, ``*.webm`` > 1 MB)               — fail (they live in shammun/aofd-media)

Usage::

    .venv/Scripts/python.exe tools/size_budget.py            # tracked files (git ls-files)
    .venv/Scripts/python.exe tools/size_budget.py --all      # every file under the checked folders, tracked or not
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
MB = 1024 * 1024


def tracked() -> list[Path]:
    out = subprocess.run(["git", "ls-files", "-z"], cwd=ROOT, capture_output=True, text=True).stdout
    return [ROOT / p for p in out.split("\0") if p]


def every() -> list[Path]:
    keep = ("viz", "scenes", "notebooks", "data", "assets", "templates", "figs", "movies/src")
    return [p for d in keep for p in (ROOT / d).rglob("*") if p.is_file() and "node_modules" not in p.parts]


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--all", action="store_true")
    a = ap.parse_args()
    try:
        page_mb = float(yaml.safe_load((ROOT / "book.yaml").read_text(encoding="utf-8"))["project"]["page_budget_mb"])
    except Exception:
        page_mb = 15.0
    files = every() if a.all else tracked()
    fails, warns, total, derived = [], [], 0, 0
    for p in files:
        if not p.is_file():
            continue
        size = p.stat().st_size
        rel = p.relative_to(ROOT).as_posix()
        total += size
        if size >= 50 * MB:
            fails.append(f"{rel}: {size / MB:.1f} MB ≥ 50 MB")
        if rel.startswith(("viz/", "scenes/")) and rel.endswith(".html") and size > 600 * 1024:
            fails.append(f"{rel}: {size / 1024:.0f} KB > 600 KB (explainer/scene budget)")
        if rel.startswith("notebooks/") and rel.endswith(".html") and size > page_mb * MB:
            fails.append(f"{rel}: {size / MB:.1f} MB > {page_mb:g} MB (page budget)")
        if rel.startswith("data/derived/"):
            derived += size
            if size > 10 * MB:
                fails.append(f"{rel}: {size / MB:.1f} MB > 10 MB (derived product)")
        if rel.endswith((".mp4", ".webm", ".mov")) and size > MB:
            fails.append(f"{rel}: movies live in shammun/aofd-media, not here")
    if derived > 150 * MB:
        fails.append(f"data/derived total {derived / MB:.0f} MB > 150 MB")
    if total > 800 * MB:
        warns.append(f"repository {total / MB:.0f} MB > 800 MB")
    for w in warns:
        print("WARN", w)
    for f in fails:
        print("FAIL", f)
    print(f"size budget: {len(files)} files, {total / MB:.1f} MB, derived {derived / MB:.1f} MB — "
          f"{'OK' if not fails else 'FAIL'}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
