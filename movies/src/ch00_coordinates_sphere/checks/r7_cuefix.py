"""ch00_coordinates_sphere (#5c) remake 2026-11-07: no caption cue may split a number (coordinator rule). tools/tts.py's splitter cut
s35 S13 between "about seven" and "point one"; this moves the boundary before "about seven" (character-proportional time, as tts.py) in
en.vtt and en.srt (and the r7 tts copies). Idempotent; re-run after every `make_timing.py --final`.
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/r7_cuefix.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
FILES = [ROOT / "movies/ch00/ch00_coordinates_sphere/en.vtt", ROOT / "movies/ch00/ch00_coordinates_sphere/en.srt",
         Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_coordinates_sphere\r7\tts\captions.vtt"),
         Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_coordinates_sphere\r7\tts\captions.srt")]
# (end of cue A as split by tts.py, start of cue B, the words to move from A to B)
FIX = [("that weighting turned ERA5's\nplain average of about seven", "point one degrees Celsius into\nabout sixteen point three.", "about seven")]
TS = r"(\d\d):(\d\d):(\d\d)([.,])(\d\d\d)"


def sec(m: re.Match) -> float:
    return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + int(m.group(3)) + int(m.group(5)) / 1000


def fmt(t: float, sep: str) -> str:
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3_600_000); m, ms = divmod(ms, 60_000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}{sep}{ms:03d}"


def wrap2(t: str) -> str:
    """two lines, break nearest the middle (≤ 42 characters each)"""
    w = t.split(); best = None
    for i in range(1, len(w)):
        a, b = " ".join(w[:i]), " ".join(w[i:])
        if len(a) <= 42 and len(b) <= 42 and (best is None or abs(len(a) - len(b)) < abs(len(best[0]) - len(best[1]))):
            best = (a, b)
    assert best, t
    return "\n".join(best)


def main() -> int:
    n = 0
    for p in FILES:
        s = p.read_text(encoding="utf-8")
        for a, b, mv in FIX:
            blocks = s.split("\n\n")
            for k in range(len(blocks) - 1):
                A, B = blocks[k], blocks[k + 1]
                if A.endswith(a) and B.endswith(b):
                    la, lb = A.split("\n"), B.split("\n")
                    ia = next(i for i, x in enumerate(la) if "-->" in x); ib = next(i for i, x in enumerate(lb) if "-->" in x)
                    ma = list(re.finditer(TS, la[ia])); mb = list(re.finditer(TS, lb[ib]))
                    a0, a1, b1 = sec(ma[0]), sec(ma[1]), sec(mb[1]); sep = ma[0].group(4)
                    ta, tb = " ".join(la[ia + 1:]), " ".join(lb[ib + 1:])
                    assert ta.endswith(" " + mv)
                    ta2, tb2 = ta[: -len(mv) - 1], mv + " " + tb
                    rate = (b1 - a0) / (len(ta) + len(tb))
                    cut = a0 + rate * len(ta2)
                    la = la[:ia] + [f"{fmt(a0, sep)} --> {fmt(cut, sep)}"] + wrap2(ta2).split("\n")
                    lb = lb[:ib] + [f"{fmt(cut, sep)} --> {fmt(b1, sep)}"] + wrap2(tb2).split("\n")
                    blocks[k], blocks[k + 1] = "\n".join(la), "\n".join(lb)
                    n += 1
                    print(f"{p.name}: {a1:.3f} -> {cut:.3f}; {len(tb2) / (b1 - cut):.1f} cps")
            s = "\n\n".join(blocks)
        p.write_text(s, encoding="utf-8")
    print(f"{n} cue boundaries moved")
    return 0


if __name__ == "__main__":
    sys.exit(main())
