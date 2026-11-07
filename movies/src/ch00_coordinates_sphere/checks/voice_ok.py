"""Lock protocol 2026-11-07 (tightened): a VOICE job (TTS / mix) may start only if HEAVY.lock is free or held by a full render, with
>= 8 GB free RAM (a mix: HEAVY.lock free and >= 14 GB, `--mix`). Exit 0 when that holds, 1 otherwise. usage: until python voice_ok.py; do sleep 20; done"""
import ctypes
import sys
from pathlib import Path

H = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\HEAVY.lock")


class M(ctypes.Structure):
    _fields_ = [("l", ctypes.c_ulong), ("load", ctypes.c_ulong), ("tot", ctypes.c_ulonglong), ("avail", ctypes.c_ulonglong)] + [(f"x{i}", ctypes.c_ulonglong) for i in range(5)]


m = M(); m.l = ctypes.sizeof(M); ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(m))
free = m.avail / 2 ** 30
own = (H / "owner.txt").read_text(encoding="utf-8", errors="replace") if H.exists() else ""
ok_heavy = (not H.exists()) or ("render" in own.lower() and not any(w in own.lower() for w in ("k6", "still", "ssr")))
R2 = H.parent / "RENDER2.lock"
if "--heavy" in sys.argv:   # K6 / stills / SSR: >= 12 GB free while a full render (RENDER2.lock) runs
    sys.exit(0 if (not R2.exists() or free >= 12) else 1)
if "--mix" in sys.argv:   # memory rule 2026-11-07: a mix needs HEAVY.lock free and >= 14 GB free at start (it peaks near 11.5 GB)
    sys.exit(0 if free >= 14 and not H.exists() and not R2.exists() else 1)   # no mix while a render runs
sys.exit(0 if free >= 8 and ok_heavy else 1)
