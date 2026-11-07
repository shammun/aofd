"""ch00_coordinates_storm (#5b) notes-2 round: the frame list for the K6 pass (the whole movie: the house K6 list of cst_run.py)
plus the LOOK frames of every changed moment (notes2 M1-M3, S1-S7, C2, C6, C8), so one stills run (one HEAVY.lock hold) serves both.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/n2_frames.py
writes <S>/n2_frames.txt (K6 ∪ look) and <S>/n2_look.json ({frame: "scene · moment"}) for the look sheets.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(Path(__file__).parent))
import cst_run  # noqa: E402

S = cst_run.S
FPS = 30
T = json.loads(cst_run.TIMING.read_text(encoding="utf-8"))
SC = {s["id"]: s for s in T["scenes"]}


def fr(t: float) -> int:
    return int(round(t * FPS))


def at(sid: str, j: int, phrase: str | None = None, dt: float = 0.0) -> float:
    x = SC[sid]["sentences"][j]
    if phrase is None:
        return x["start"] + dt
    i = x["text"].index(phrase)
    return x["start"] + (x["end"] - x["start"]) * i / len(x["text"]) + dt


def look() -> dict[int, str]:
    L: dict[int, str] = {}

    def add(t: float, what: str) -> None:
        L[fr(t)] = what
    for j in range(2, 14):                                   # S7: the s06 keywords, one per sentence
        add(at("s06_dtheta_dtheta", j, dt=1.5), f"s06 S{j} keywords")
    s18 = SC["s18_ian_stack"]
    for t in range(int(s18["sentences"][3]["start"]), int(s18["end"]), 3):   # M1: close oblique camera + height label
        add(t + 0.5, "s18 close camera / height label")
    s19 = SC["s19_ian_layers_lit"]
    for j in (6, 7):                                         # S1: no radar arrows / label before s20
        add(at("s19_ian_layers_lit", j, dt=1.0), f"s19 S{j} no radar arrows")
        add(at("s19_ian_layers_lit", j, dt=3.0), f"s19 S{j} no radar arrows")
    t8 = s19["sentences"][8]["start"]
    for dt in (0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5):          # M2: the close look, colour bar out
        add(t8 + dt, "s19 close look, colour bar")
    for j, ph in ((4, "Sentinel-1"), (6, "sixteenth"), (7, None), (8, "marked here in cyan"), (8, "thirty four thousand"), (9, "sixty metres"),
                  (9, "zero point"), (10, None), (11, "eleven")):
        add(at("s30_amphan_radar", j, ph, dt=1.0), f"s30 S{j} {ph or ''}".strip())
    for t in range(int(SC["s30_amphan_radar"]["sentences"][7]["start"]), int(SC["s30_amphan_radar"]["sentences"][9]["start"]) + 1):
        add(t + 0.5, "s30 sweep + cyan")
    for j, ph in ((0, "Cyclone Nargis"), (6, "ninety knots"), (7, "one point eight five two"), (8, "a thousand metres"), (8, "divide by three point six"),
                  (9, None), (10, "eye"), (11, None), (12, None)):
        add(at("s31_nargis_intro", j, ph, dt=1.0), f"s31 S{j} {ph or ''}".strip())
    s32 = SC["s32_nargis_swipe"]
    for t in range(int(s32["sentences"][3]["start"]), int(s32["sentences"][12]["start"]) + 1):   # M3: every second S3-S11
        add(t + 0.5, "s32 natural → false colour")
    for j, ph in ((4, "eighty five knots"), (5, "one point eight five two"), (6, "three point six"), (7, None)):
        add(at("s33_idai_intro", j, ph, dt=1.0), f"s33 S{j} {ph or ''}".strip())
    s34 = SC["s34_idai_swipe"]
    for t in range(int(s34["start"]), int(s34["sentences"][3]["start"]) + 1):                     # S3: natural sweep with its middle stop
        add(t + 0.5, "s34 natural sweep")
    return L


def main() -> int:
    L = look()
    k6 = set(cst_run.k6_list())
    tot = cst_run.total_frames()
    allf = sorted(f for f in k6 | set(L) if 0 <= f < tot)
    (S / "n2_frames.txt").write_text(",".join(map(str, allf)))
    (S / "n2_look.json").write_text(json.dumps({str(k): v for k, v in sorted(L.items())}, indent=0, ensure_ascii=False), encoding="utf-8")
    print(f"{len(allf)} frames ({len(k6)} K6, {len(L)} look) -> {S / 'n2_frames.txt'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
