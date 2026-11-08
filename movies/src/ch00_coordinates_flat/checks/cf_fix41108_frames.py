"""ch00_coordinates_flat fix 4 (2026-11-08): the K6 frame plan for ONE new tag folder (screen-only fix: no re-voice, no timing change).

* Every frame of the fix-3 K6 plan (k6z4 lists = the frames in k6z5: the house list, every 1 s of the fix-3 scenes, strips, look frames).
* Every 1 s (30 frames) through every scene changed in fix 4 (s05, s11, s15, s20, s21, s22, s23, s25, s26).
* Look frames on the fix-4 items' words (s25 y′ / onshore arrow, s25 chart labels, word-timed results, gold inputs, s23 "25 km").
* Frames of the changed scenes, +-15 frames round their boundaries, are RENDERED; all other frames are COPIED from k6z5 (same timing, same
  code there). A frame missing in k6z5 is rendered.

usage: .venv/Scripts/python.exe cf_fix41108_frames.py <tag> [<old tag>]   -> <S>/<tag>_render.txt, <S>/<tag>_copy.txt, <S>/<tag>_look.json
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import cf_run  # noqa: E402

R = HERE.parents[3]
M = R / "movies/ch00/ch00_coordinates_flat"
T = json.loads((M / "timing.json").read_text(encoding="utf-8"))
W = json.loads((M / "words.json").read_text(encoding="utf-8"))["scenes"]
FPS = 30
IDS = [s["id"] for s in T["scenes"]]
sc = {s["id"]: s for s in T["scenes"]}
CUT = [0 if i == 0 else round(s["start"] * FPS) for i, s in enumerate(T["scenes"])]
END = CUT[1:] + [T["total_frames"] + 75]
CHANGED = ["s05_polar_back", "s11_theta_hat", "s15_turn_axes", "s20_polar_is_turned", "s21_ian_polar", "s22_spin_inflow",
           "s23_what_numbers_mean", "s25_why_polar_storm", "s26_inflow_angle"]
norm = lambda x: re.sub(r"[^a-z0-9']", "", x.lower())  # noqa: E731


def word(sid: str, j: int, phrase: str, last: bool = False) -> int:
    """absolute frame of the phrase's first (or last) word (Kokoro word time, as AT() / ATlast() in cf_lib.tsx)"""
    s = sc[sid]["sentences"][j]
    e = W[sid][str(j)]
    assert e["text"] == s["text"], (sid, j)
    toks = [(t, norm(x)) for t, x in e["w"] if norm(x)]
    ph = [norm(x) for x in phrase.split() if norm(x)]
    for i in range(len(toks) - len(ph) + 1):
        if all(toks[i + q][1] == ph[q] for q in range(len(ph))):
            return round((s["start"] + toks[i + (len(ph) - 1 if last else 0)][0]) * FPS)
    raise SystemExit(f"no '{phrase}' in {sid} S{j + 1}")


def ss(sid: str, j: int) -> int:
    return round(sc[sid]["sentences"][j]["start"] * FPS)


def main(tag: str, old: str) -> None:
    S = cf_run.S
    base = {int(x) for n in ("render", "copy") for x in (S / f"k6z4_{n}.txt").read_text().split(",") if x.strip()}
    every1s = set()
    for sid in CHANGED:
        k = IDS.index(sid)
        every1s.update(range(CUT[k] + 15, END[k], 30))
    look = {}
    for sid, j, ph, d, why, last in [
        ("s05_polar_back", 6, "So five kilometres times", 12, "s05 x row inputs, no result yet", False),
        ("s05_polar_back", 6, "east side: three", 10, "s05 '= 3' on 'three'", True), ("s05_polar_back", 7, "north side: four", 10, "s05 '= 4' on 'four'", True),
        ("s11_theta_hat", 18, "a tenth times pi", 12, "s11 0.1° gold", False),
        ("s15_turn_axes", 13, "about zero point eight six six", 12, "s15 0.866 gold", False), ("s15_turn_axes", 13, "exactly one half", 12, "s15 0.5 gold", False),
        ("s20_polar_is_turned", 12, "five", -12, "s20 sum before '= 5'", False), ("s20_polar_is_turned", 12, "five", 12, "s20 '= 5'", False),
        ("s20_polar_is_turned", 14, "zero", 12, "s20 '= 0'", False),
        ("s21_ian_polar", 0, "", 30, "s21 fitted full map (no notch)", False), ("s21_ian_polar", 5, "zoom in", 20, "s21 zoom from the fitted box", False),
        ("s22_spin_inflow", 5, "about thirty four point eight", -12, "s22 mean not yet", False), ("s22_spin_inflow", 5, "about thirty four point eight", 12, "s22 mean on its word", False),
        ("s22_spin_inflow", 12, "a hundred and thirty five", 12, "s22 135 kt gold", False),
        ("s23_what_numbers_mean", 4, "thirty seven", -12, "s23 √1394 without 37.3", False), ("s23_what_numbers_mean", 4, "thirty seven", 12, "s23 ≈ 37.3", False),
        ("s23_what_numbers_mean", 10, "one lap", 40, "s23 '25 km' off the gold lap arc", False),
        ("s25_why_polar_storm", 0, "", 40, "s25 fitted map (no ragged edge)", False),
        ("s25_why_polar_storm", 9, "seventeen", 14, "s25 '17' off the 0 line", False), ("s25_why_polar_storm", 10, "minus forty", 14, "s25 '−40' off u_r", False),
        ("s25_why_polar_storm", 9, "forty seven", 14, "s25 '47' vs the bar", False),
        ("s25_why_polar_storm", 14, "a part across it", 20, "s25 y′ WSW out to sea", False),
        ("s25_why_polar_storm", 14, "towards the land", 20, "s25 dashed onshore arrow", False),
        ("s25_why_polar_storm", 14, "In Part 2", 10, "s25 axes + impact chain", False),
        ("s26_inflow_angle", 4, "twenty one degrees", -12, "s26 'inflow angle' gone, 21° not yet", False),
        ("s26_inflow_angle", 4, "twenty one degrees", 12, "s26 '≈ 21°' on its word", False),
    ]:
        look[(ss(sid, j) if not ph else word(sid, j, ph, last)) + d] = why
    allf = base | every1s | set(look)
    win = [(CUT[IDS.index(s)] - 15, END[IDS.index(s)] + 15) for s in CHANGED]
    copy, render = [], []
    for f in sorted(allf):
        ok_old = all((S / "stills" / old / nm).exists() for nm in (f"b{f:05d}.json", f"f{f:05d}.jpg"))
        (render if any(a <= f < b for a, b in win) or f in look or not ok_old else copy).append(f)
    (S / f"{tag}_render.txt").write_text(",".join(map(str, render)))
    (S / f"{tag}_copy.txt").write_text(",".join(map(str, copy)))
    (S / f"{tag}_look.json").write_text(json.dumps({str(k): v for k, v in sorted(look.items())}, indent=0, ensure_ascii=False), encoding="utf-8")
    print(f"k6z4/k6z5 plan {len(base)} + every 1 s of the fix-4 scenes {len(every1s)} + look {len(look)} = {len(allf)} frames: "
          f"render {len(render)}, copy from {old} {len(copy)}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "k6z6", sys.argv[2] if len(sys.argv) > 2 else "k6z5")
