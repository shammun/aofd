"""ch00_coordinates_moving (#5e) remake 2026-11-07: may the queued heavy step start now? (lock protocol of 2026-11-07, as tightened)

  voice  (TTS splice, word times, mix; takes VOICE.lock): HEAVY.lock is free, or held by a full render (owner mentions "render" and none of
         K6 / stills / SSR), and >= 8 GB RAM is free.
  heavy  (SSR, K6 stills; takes HEAVY.lock): VOICE.lock is free (a K6 / stills / SSR job never runs beside a voice job).
Both: the CANCEL file is absent, and Parts 1-4 go first: no queue / run script of ch00_coordinates_{flat,storm,sphere,frames} is alive.
The caller takes the lock itself (mkdir is atomic). Exit 0 = go, 1 = wait, 2 = cancelled. Prints the reason when waiting (with --why).

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_moving/checks/r7_gate.py voice|heavy [--why]
"""
from __future__ import annotations

import os
import re
import sys
from pathlib import Path

import psutil

SM = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies")
HEAVY, VOICE, CANCEL = SM / "HEAVY.lock", SM / "VOICE.lock", SM / "ch00_coordinates_moving" / "CANCEL"
EARLIER = re.compile(r"ch00_coordinates_(flat|storm|sphere|frames)[/\\]checks[/\\][^ \"']*(heavy|_run|run\.py|splice|mix|words)", re.I)


def owner(lock: Path) -> str:
    try:
        return (lock / "owner.txt").read_text(encoding="utf-8", errors="replace").strip()
    except OSError:
        return "(no owner.txt)"


def earlier_alive() -> list[str]:
    me = os.getpid()
    out = []
    for p in psutil.process_iter(["pid", "cmdline"]):
        try:
            cl = " ".join(p.info["cmdline"] or [])
        except (psutil.Error, TypeError):
            continue
        if p.info["pid"] != me and EARLIER.search(cl):
            out.append(f"{p.info['pid']}: {cl[:140]}")
    return out


def main() -> int:
    mode, why = sys.argv[1], "--why" in sys.argv
    if CANCEL.exists():
        print(f"CANCEL file present ({CANCEL})")
        return 2
    reasons = []
    ea = earlier_alive()
    if ea:
        reasons.append(f"Parts 1-4 first: {len(ea)} queue/run process(es) alive, e.g. {ea[0]}")
    if mode == "voice":
        if HEAVY.exists():
            o = owner(HEAVY)
            if True:  # 2026-11-07: VOICE phase includes a mix (~11.5 GB): no overlap with any HEAVY job
                reasons.append(f"HEAVY.lock held by a non-render job: {o}")
        free = psutil.virtual_memory().available / 1e9
        if free < 14:
            reasons.append(f"RAM {free:.1f} GB free < 14")
    elif mode == "heavy":
        if VOICE.exists():
            reasons.append(f"VOICE.lock held: {owner(VOICE)}")
        if HEAVY.exists():
            reasons.append(f"HEAVY.lock held: {owner(HEAVY)}")
    else:
        print("mode must be voice or heavy")
        return 2
    if reasons and why:
        print("; ".join(reasons))
    return 1 if reasons else 0


if __name__ == "__main__":
    sys.exit(main())
