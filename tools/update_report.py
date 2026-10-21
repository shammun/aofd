"""Facts for an "update" to the user: what changed since the last update (CLAUDE.md "When the user says update").

Lists the commits since the last update marker (``progress.json -> last_update.commit``) in this repo and in the fluidpy
repo, every file added / modified / deleted since then grouped by folder, uncommitted and untracked files, the
outward-facing state (pushed or not, tags), and free space on C:/G:. The session then writes the update in plain
words around these facts and says exactly what needs the user's feedback.

Usage::

    .venv/Scripts/python.exe tools/update_report.py           # facts since the last marker
    .venv/Scripts/python.exe tools/update_report.py --mark    # ... and move the marker to HEAD (after giving the update)
    .venv/Scripts/python.exe tools/update_report.py --since 6c00f2e
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KUNDU = (ROOT.parent / "Fluid Dynamics").resolve()
PROGRESS = ROOT / "progress.json"
STATUS = {"A": "new", "M": "changed", "D": "deleted", "R": "renamed"}


def git(*args: str, cwd: Path = ROOT) -> str:
    return subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True, encoding="utf-8",
                          errors="replace").stdout


def section(repo: Path, since: str | None, label: str) -> None:
    head = git("rev-parse", "--short", "HEAD", cwd=repo).strip()
    empty_tree = "4b825dc642cb6eb9a060e54bf8d69288fbee4904"     # git's empty tree: since="root" = whole history
    rng = "HEAD" if since == "root" else (f"{since}..HEAD" if since else "HEAD~10..HEAD")
    print(f"\n## {label} ({repo.name}) — HEAD {head}, changes "
          + ("since the first commit" if since == "root" else rng))
    log = git("log", "--oneline", "--no-decorate", rng, cwd=repo).strip()
    print("### Commits\n" + ("\n".join("- " + ln for ln in log.splitlines()) if log else "- (none)"))
    diff_args = [empty_tree, "HEAD"] if since == "root" else [rng]
    diff = git("diff", "--name-status", *diff_args, cwd=repo).strip()
    groups: dict[str, list[str]] = defaultdict(list)
    for ln in diff.splitlines():
        parts = ln.split("\t")
        st, path = parts[0][0], parts[-1]
        top = path.split("/")[0] if "/" in path else "(root)"
        groups[top].append(f"{STATUS.get(st, st)}: {path}")
    print("### Files committed since then")
    if not groups:
        print("- (none)")
    for top in sorted(groups):
        print(f"- **{top}/** ({len(groups[top])})")
        for item in groups[top]:
            print(f"  - {item}")
    dirty = git("status", "--short", cwd=repo).strip()
    print("### Not committed yet\n" + ("\n".join("- " + ln for ln in dirty.splitlines()) if dirty else "- (clean)"))
    ahead = git("rev-list", "--count", "@{u}..HEAD", cwd=repo).strip()
    tags = git("tag", "--points-at", "HEAD", cwd=repo).strip()
    print(f"### Remote\n- commits not pushed: {ahead or 'no upstream'}" + (f"\n- tags at HEAD: {tags}" if tags else ""))


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--since", default=None)
    ap.add_argument("--mark", action="store_true", help="move the marker to HEAD after the update was given")
    a = ap.parse_args()
    data = json.loads(PROGRESS.read_text(encoding="utf-8"))
    mark = data.get("last_update", {})
    since = a.since or mark.get("commit")
    since_k = mark.get("fluidpy_commit")
    print(f"# Update facts — {dt.datetime.now():%Y-%m-%d %H:%M} (last update marker: {mark.get('time', 'none')})")
    section(ROOT, since, "AOFD repo")
    if KUNDU.exists():
        section(KUNDU, since_k, "fluidpy repo (library paths only are ours)")
    r = subprocess.run([sys.executable, str(ROOT / "tools" / "disk_guard.py")], capture_output=True, text=True)
    print("\n## Disk\n- " + (r.stdout or r.stderr).strip())
    wait = (data.get("setup") or {}).get("awaiting_user")
    if wait:
        print("\n## Still waiting for the user (progress.json -> setup.awaiting_user)")
        for q in wait.get("questions", []):
            print("- " + q)
    if a.mark:
        data["last_update"] = {"commit": git("rev-parse", "--short", "HEAD").strip(),
                               "fluidpy_commit": git("rev-parse", "--short", "HEAD", cwd=KUNDU).strip()
                               if KUNDU.exists() else None,
                               "time": dt.datetime.now().isoformat(timespec="minutes")}
        PROGRESS.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"\n(marker moved to {data['last_update']['commit']})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
