"""ch00_coordinates_routes (#5f) remake 2026-11-07: may a queued job start now? (lock protocol 2026-11-07, tightened; = Part 3's voice_ok.py
plus the HEAVY rule and the "after Parts 1-5" yield). Exit 0 = yes, 1 = not yet, 2 = CANCEL file present.

  voice : a VOICE job (TTS splice / word times / mix) may start only if HEAVY.lock is free or held by a full render (its owner text says
          "render" and none of K6 / still / SSR), and >= 8 GB RAM is free.
  heavy : a HEAVY job (SSR, K6 stills) may start only if HEAVY.lock AND VOICE.lock are both free.
  Both  : Part 6 queues AFTER Parts 1-5 (orchestrator 2026-11-07): while any lock is held by a #5a-#5e job, the time is written to
          <scratch>/ch00_coordinates_routes/last_5ae.txt, and this gate says "not yet" until 15 min have passed with no #5a-#5e owner. A
          file <scratch>/ch00_coordinates_routes/GO (made by the orchestrator) skips the yield; the lock rules above still hold.
          The CANCEL file <scratch>/ch00_coordinates_routes/CANCEL stops the queue (exit 2) before any lock is taken.
usage: python rt_lockgate.py voice|heavy   (taking the lock itself is the caller's atomic mkdir)
"""
import ctypes
import re
import sys
import time
from pathlib import Path

M_ = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies")
H, V, ME = M_ / "HEAVY.lock", M_ / "VOICE.lock", M_ / "ch00_coordinates_routes"
YIELD_S = 15 * 60


class MS(ctypes.Structure):
    _fields_ = [("l", ctypes.c_ulong), ("load", ctypes.c_ulong), ("tot", ctypes.c_ulonglong), ("avail", ctypes.c_ulonglong)] + [(f"x{i}", ctypes.c_ulonglong) for i in range(5)]


def free_gb() -> float:
    m = MS(); m.l = ctypes.sizeof(MS); ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(m))
    return m.avail / 2 ** 30


def owner(p: Path) -> str:
    try:
        return (p / "owner.txt").read_text(encoding="utf-8", errors="replace") if p.exists() else ""
    except OSError:
        return "?"


def main() -> int:
    mode = sys.argv[1]
    if (ME / "CANCEL").exists():
        return 2
    oh, ov = owner(H), owner(V)
    stamp = ME / "last_5ae.txt"
    if re.search(r"#5[a-e]\b", oh + " " + ov):
        stamp.write_text(str(time.time()))
        return 1
    if not (ME / "GO").exists() and stamp.exists() and time.time() - float(stamp.read_text() or 0) < YIELD_S:
        return 1
    if mode == "voice":
        heavy_ok = (not H.exists()) or ("render" in oh.lower() and not any(w in oh.lower() for w in ("k6", "still", "ssr")))
        return 0 if heavy_ok and free_gb() >= 8 else 1
    if mode == "heavy":
        return 0 if not H.exists() and not V.exists() else 1
    raise SystemExit(f"mode {mode}?")


if __name__ == "__main__":
    sys.exit(main())
