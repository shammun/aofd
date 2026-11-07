"""ch00_coordinates_maps (#5g) remake 2026-11-07: may a queued job start now? (lock protocol 2026-11-07, tightened; = Part 6's rt_lockgate.py
with "after Part 6" instead of "after Parts 1-5"). Exit 0 = yes, 1 = not yet, 2 = CANCEL file present.

  after : Part 7 queues AFTER Part 6's queue (orchestrator 2026-11-07): nothing starts until Part 6's last queued step has written
          <scratch>/ch00_coordinates_routes/build1/stills/r7/k6.json, or the orchestrator has made <scratch>/ch00_coordinates_maps/GO.
  voice : a VOICE job (TTS splice / word times / mix) may start only if HEAVY.lock is free or held by a full render (its owner text says
          "render" and none of K6 / still / SSR), and >= 8 GB RAM is free.
  heavy : a HEAVY job (SSR, K6 stills) may start only if HEAVY.lock AND VOICE.lock are both free.
  The CANCEL file <scratch>/ch00_coordinates_maps/CANCEL stops the queue (exit 2) before any lock is taken.
usage: python mp_lockgate.py voice|heavy   (taking the lock itself is the caller's atomic mkdir)
"""
import ctypes
import sys
from pathlib import Path

M_ = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies")
H, V, ME = M_ / "HEAVY.lock", M_ / "VOICE.lock", M_ / "ch00_coordinates_maps"
AFTER = M_ / "ch00_coordinates_routes" / "build1" / "stills" / "r7" / "k6.json"


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
    if not (AFTER.exists() or (ME / "GO").exists()):
        return 1
    oh = owner(H)
    if mode == "voice":
        heavy_ok = not H.exists() and not (M_ / "RENDER2.lock").exists()  # + no parallel render; 2026-11-07: the VOICE phase includes a mix (~11.5 GB): no overlap with any HEAVY job
        return 0 if heavy_ok and free_gb() >= 14 else 1
    if mode == "heavy":
        return 0 if not H.exists() and not V.exists() and not (M_ / "RENDER2.lock").exists() else 1  # 2026-11-07: renders first
    raise SystemExit(f"mode {mode}?")


if __name__ == "__main__":
    sys.exit(main())
