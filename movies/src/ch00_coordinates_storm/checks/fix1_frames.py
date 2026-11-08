"""ch00_coordinates_storm (#5b) fix loop 1 (2026-11-07): the K6 frame plan for ONE tag folder = the whole house list (cst_run.py k6_list:
scene boundaries, sentence starts +/- , middles, ends, every 0.5 s through the dense scenes) + every 1 s through the scenes changed in fix
loop 1 + a frame 15 after every AT/ATP word anchor of those scenes (the reveal moments).
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/fix1_frames.py TAG   -> <S>/<TAG>_frames.txt
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from cst_run import FPS, S, TIMING, k6_list, total_frames  # noqa: E402

CHANGED = ["s09_dtheta_dt", "s13_acceleration_numbers", "s14_steady_but_turning", "s15_cylinder", "s20_ian_curtain", "s21_amphan_intro", "s23_amphan_ring",
           "s26_coast_axes", "s27_coast_angle", "s28_fmb_calc", "s29_stp_calc", "s30_onshore_piles", "s31_gauges", "s33_amphan_wind", "s34_amphan_radar",
           "s36_nargis_wind", "s37_nargis_swipe", "s39_idai_wind", "s40_idai_swipe", "s41_recap"]
ROOT = Path(__file__).resolve().parents[4]
WORDS = json.loads((ROOT / "movies/src/ch00_coordinates_storm/words.json").read_text(encoding="utf-8"))["scenes"]


def main() -> int:
    tag = sys.argv[1]
    t = json.loads(TIMING.read_text(encoding="utf-8"))
    tot = total_frames()
    fr = set(k6_list())
    n0 = len(fr)
    for i, s in enumerate(t["scenes"]):
        if s["id"] not in CHANGED:
            continue
        a = 0 if i == 0 else round(s["start"] * FPS)
        b = round(t["scenes"][i + 1]["start"] * FPS) if i + 1 < len(t["scenes"]) else tot
        fr.update(range(a + 30, b, 30))
        for j, x in enumerate(s["sentences"]):        # 15 frames after every spoken number word / phrase start (reveal moments)
            e = WORDS.get(s["id"], {}).get(str(j))
            if not e:
                continue
            for tt, tok in e["w"]:
                if re.fullmatch(r"(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|"
                                r"nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|minus|plus|alpha|cosine|sine)", tok.lower()):
                    fr.add(round((x["start"] + tt) * FPS) + 15)
    look = S / f"{tag}_look.txt"                       # the look moments (session scratchpad fix1s/look1.txt), shot exactly
    if look.exists():
        fr.update(int(x) for x in look.read_text().split(",") if x.strip())
    fr = sorted(f for f in fr if 0 <= f < tot)
    (S / f"{tag}_frames.txt").write_text(",".join(map(str, fr)))
    print(f"{len(fr)} frames ({n0} house list + {len(fr) - n0} in the changed scenes) -> {S / f'{tag}_frames.txt'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
