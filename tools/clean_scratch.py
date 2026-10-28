"""Delete movie/render junk safely (user approval 2026-10-27: "delete junk without asking; archive to G: first if reusable").

Only paths inside these roots can be removed (the project's settings deny a raw ``rm -rf``):
    G:/Geophysical Fluid Dynamics/aofd-data/scratch/
    G:/Geophysical Fluid Dynamics/aofd-data/archive/
    <repo>/reports/movies/   <repo>/outputs/          (git-ignored local products)
    <repo>/movies/out/**/_tools/ and old render pieces under movies/out (never a preview_*.mp4 or the final 1080.mp4)

Usage:
    .venv/Scripts/python.exe tools/clean_scratch.py PATH [PATH ...]            # dry run: lists what would go and its size
    .venv/Scripts/python.exe tools/clean_scratch.py --yes PATH [PATH ...]      # delete
    .venv/Scripts/python.exe tools/clean_scratch.py --yes --archive SLUG PATH  # copy to archive/movies/SLUG/ first, then delete

Every deletion is appended to G:/Geophysical Fluid Dynamics/aofd-data/logs/cleanup.log.
"""
from __future__ import annotations

import argparse
import datetime as dt
import os
import shutil
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DATA = Path("G:/Geophysical Fluid Dynamics/aofd-data")
ALLOWED = [DATA / "scratch", DATA / "archive", REPO / "reports" / "movies", REPO / "outputs"]
TEMP = Path(os.environ.get("TEMP", ""))
# Remotion leaves a webpack bundle / asset copy in %TEMP% per render (user 2026-10-27: "delete junk on C:"); only those.
TEMP_PREFIXES = ("remotion-webpack-bundle-", "remotion-v4.0.537-assets")
PROTECTED_NAMES = ("preview_",)          # files the user may be watching
PROTECTED_FILES = {"1080.mp4"}           # final movies under movies/out are never removed by this tool
LOG = DATA / "logs" / "cleanup.log"


def size_of(p: Path) -> int:
    """Total bytes of a file or a folder tree."""
    if p.is_file():
        return p.stat().st_size
    return sum(f.stat().st_size for f in p.rglob("*") if f.is_file())


def check(p: Path) -> str | None:
    """Return a reason the path may not be removed, or None if it is allowed."""
    rp = p.resolve()
    if not rp.exists():
        return "does not exist"
    in_temp = TEMP.name and rp.parent == TEMP.resolve() and rp.name.startswith(TEMP_PREFIXES)
    if not in_temp and not any(rp != root.resolve() and root.resolve() in rp.parents for root in ALLOWED):
        return "outside the allowed roots (or is a root itself)"
    names = [rp.name] + ([f.name for f in rp.rglob("*")] if rp.is_dir() else [])
    if any(n.startswith(PROTECTED_NAMES) for n in names):
        return "contains a preview_* file the user may be watching"
    if any(n in PROTECTED_FILES for n in names) and "scratch" not in rp.parts and "archive" not in rp.parts:
        return "contains a final 1080.mp4"
    return None


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="+", type=Path)
    ap.add_argument("--yes", action="store_true", help="really delete (default: dry run)")
    ap.add_argument("--archive", metavar="SLUG", help="copy each path to archive/movies/SLUG/ before deleting")
    a = ap.parse_args()
    if not DATA.exists():
        sys.exit("G: data root is missing: nothing removed")
    total = 0
    for p in a.paths:
        why = check(p)
        if why:
            print(f"SKIP  {p}  ({why})")
            continue
        n = size_of(p)
        total += n
        print(f"{'DEL ' if a.yes else 'would'}  {p}  {n / 1e6:,.1f} MB")
        if not a.yes:
            continue
        if a.archive:
            dest = DATA / "archive" / "movies" / a.archive / p.name
            dest.parent.mkdir(parents=True, exist_ok=True)
            (shutil.copytree if p.is_dir() else shutil.copy2)(p, dest)
            print(f"      archived to {dest}")
        shutil.rmtree(p) if p.is_dir() else p.unlink()
        LOG.parent.mkdir(parents=True, exist_ok=True)
        with LOG.open("a", encoding="utf-8") as fh:
            fh.write(f"{dt.datetime.now():%Y-%m-%dT%H:%M:%S}\t{n}\t{p}\t{'archived:' + a.archive if a.archive else ''}\n")
    print(f"{'freed' if a.yes else 'would free'} {total / 1e9:.2f} GB")


if __name__ == "__main__":
    main()
