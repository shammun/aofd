"""UF2 fix loop 3: the K6 still list for ch00_weather_basics. Review 3 found that the K6 pass missed text-over-text during keyword
cross-fades (it sampled sentence start + 12, after a swap has finished). This list adds the mid-swap frames:

* tools/k6_overlap.k6_frames(timing)            (scene boundaries -5/0/+5, sentence start + 12, middle, end - 6)
* every sentence start - 4 and + 3                (an old row fading out / a new row fading in)
* every 0.5 s through the fix-3 scenes s38b, s39, s47, s48, s48b (the review-3 Musts) and s57/s58 (moved readouts)

usage: .venv/Scripts/python.exe tools/movie_wb/k6_fix3_frames.py <out.txt>
then:  .venv/Scripts/python.exe tools/movie_wb/stills_uf2.py k6fix3 --bundle --frames "$(cat <out.txt>)" --jobs 3
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))
from k6_overlap import k6_frames  # noqa: E402

TIMING = ROOT / "movies/ch00/ch00_weather_basics/timing.json"
DENSE = {"s38b_reanalysis_stack", "s39_surface_pressure", "s47_cold_front", "s48_warm_front", "s48b_front_stack", "s57_brest_warm_front",
         "s58_brest_cold_front"}
FPS, HOLD = 30, 75


def main() -> None:
    t = json.loads(TIMING.read_text(encoding="utf-8"))
    total = t["total_frames"] + HOLD
    out = set(k6_frames(TIMING))
    for i, s in enumerate(t["scenes"]):
        a = 0 if i == 0 else round(s["start"] * FPS)
        b = round(t["scenes"][i + 1]["start"] * FPS) if i + 1 < len(t["scenes"]) else total
        for x in s["sentences"]:
            s0 = round(x["start"] * FPS)
            out.update({s0 - 4, s0 + 3})
        if s["id"] in DENSE:
            out.update(range(a, b, 15))
    fr = sorted(f for f in out if 0 <= f < total)
    Path(sys.argv[1]).write_text(",".join(map(str, fr)), encoding="utf-8")
    print(len(fr), "frames ->", sys.argv[1])


if __name__ == "__main__":
    main()
