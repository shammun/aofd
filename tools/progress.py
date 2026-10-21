"""Update one chapter's phase status in progress.json (keeps LF line endings and formatting).

Usage:
    .venv/Scripts/python.exe tools/progress.py --brief            # SessionStart hook: one screen of status + disk
    .venv/Scripts/python.exe tools/progress.py ch08 analyze pass --note "analyze: ..."
    .venv/Scripts/python.exe tools/progress.py ch08 explainers a,b,c
    .venv/Scripts/python.exe tools/progress.py ch08 show
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROGRESS = ROOT / "progress.json"


def brief() -> None:
    """Short status for the SessionStart hook: current chapter, its phases, the fluidpy pin, and disk on C:/G:."""
    import subprocess
    import sys

    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if not PROGRESS.exists():
        print("aofd: no progress.json yet (setup session)")
    else:
        data = json.loads(PROGRESS.read_text(encoding="utf-8"))
        cur = data.get("current_chapter")
        ch = data.get("chapters", {}).get(cur, {})
        phases = {k: v for k, v in ch.items() if isinstance(v, str) and k not in ("notes", "updated")}
        print(f"aofd: current {cur} | fluidpy pin {data.get('library_pin')} | "
              + " ".join(f"{k}:{v}" for k, v in phases.items()))
        if data.get("setup"):
            s = data["setup"]
            skip = ("notes", "updated", "awaiting_user", "poc")
            print("setup: " + " ".join(f"{k}:{v}" for k, v in s.items() if k not in skip))
            for k, v in (s.get("poc") or {}).items():
                print(f"  PoC {k}: {v}")
            wait = s.get("awaiting_user")
            if wait and s.get("s11_poc") != "approved":
                print("\n=== WAITING FOR THE USER — do NOT start /do-chapter 0 or any chapter work yet ===")
                print("Session instruction (CLAUDE.md 'Session start'): first give the user this status, then ask these")
                print("questions and wait for the answers.\n")
                print(wait.get("summary", ""))
                print("\nWhat to open and judge:")
                for k, v in (wait.get("open") or {}).items():
                    print(f"  {k}: {v}")
                print("\nQuestions:")
                for q in wait.get("questions", []):
                    print("  " + q)
                for c in wait.get("optional_cleanup", []):
                    print("  (optional) " + c)
                print("\nAfter the answers: " + wait.get("after_approval", ""))
                print("=" * 86)
    dg = ROOT / "tools" / "disk_guard.py"
    if dg.exists():
        r = subprocess.run([sys.executable, str(dg)], capture_output=True, text=True)
        print((r.stdout or r.stderr).strip())


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--brief", action="store_true", help="print a short status (SessionStart hook) and exit")
    ap.add_argument("chapter", nargs="?")
    ap.add_argument("phase", nargs="?")
    ap.add_argument("status", nargs="?")
    ap.add_argument("--note", default=None, help="text appended to notes ('; ' separated)")
    ap.add_argument("--current", action="store_true", help="also set current_chapter")
    a = ap.parse_args()
    if a.brief:
        brief()
        return
    if not (a.chapter and a.phase):
        ap.error("chapter and phase are required (or --brief)")

    data = json.loads(PROGRESS.read_text(encoding="utf-8"))
    chapters = data.get("chapters", data)
    ch = chapters[a.chapter]
    if a.phase == "show":
        print(json.dumps(ch, indent=1, ensure_ascii=False))
        return
    if a.phase == "explainers":
        ch["explainers"] = [s for s in (a.status or "").split(",") if s]
    elif a.status is not None:
        ch[a.phase] = a.status
    if a.note:
        ch["notes"] = f"{ch['notes']}; {a.note}" if ch.get("notes") else a.note
    ch["updated"] = dt.date.today().isoformat()
    if a.current:
        data["current_chapter"] = a.chapter
    with PROGRESS.open("w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"{a.chapter}.{a.phase} = {ch.get(a.phase)}")


if __name__ == "__main__":
    main()
