"""ch00_coordinates_storm (#5b) fix loop 2 (2026-11-08, after the fix1 review): the K6 frame plan for ONE tag folder = the whole house list
(cst_run.py k6_list: scene boundaries, sentence starts +/-, middles, ends, every 0.5 s through the dense scenes) + every 1 s through the scenes
changed in fix loop 2 + every sentence start +15 / +30 there + 15 frames after every spoken number word there + the named reveal moments of the
fix-loop-2 changes (s14 product / ratio / sum rows, s35 heading swaps, the event maps' beta arc, s37 / s40 glide back).
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/fix2_frames.py [TAG=k6f2]   -> <S>/<TAG>_frames.txt
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from cst_run import FPS, S, TIMING, k6_list, total_frames  # noqa: E402

CHANGED = ["s09_dtheta_dt", "s14_steady_but_turning", "s18_ian_stack", "s19_ian_layers_lit", "s20_ian_curtain", "s21_amphan_intro", "s22_amphan_eye",
           "s24_amphan_curtain", "s25_why_cylindrical", "s26_coast_axes", "s33_amphan_wind", "s34_amphan_radar", "s35_nargis_intro", "s36_nargis_wind",
           "s37_nargis_swipe", "s39_idai_wind", "s40_idai_swipe", "s41_recap"]
ROOT = Path(__file__).resolve().parents[4]
WORDS = json.loads((ROOT / "movies/src/ch00_coordinates_storm/words.json").read_text(encoding="utf-8"))["scenes"]
NUM = re.compile(r"(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|"
                 r"nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|minus|plus|alpha|beta|cosine|sine|tangent|over|weaker|stronger)")


def main() -> int:
    tag = sys.argv[1] if len(sys.argv) > 1 else "k6f2"
    t = json.loads(TIMING.read_text(encoding="utf-8"))
    tot = total_frames()
    fr = set(k6_list())
    n0 = len(fr)
    for i, s in enumerate(t["scenes"]):
        if s["id"] not in CHANGED:
            continue
        a = 0 if i == 0 else round(s["start"] * FPS)
        b = round(t["scenes"][i + 1]["start"] * FPS) if i + 1 < len(t["scenes"]) else tot
        fr.update(range(a + 30, b, 30))                                   # every 1 s
        for j, x in enumerate(s["sentences"]):
            st = round(x["start"] * FPS)
            fr.update((st + 15, st + 30, st + 60))                        # every sentence start + 0.5 / 1 / 2 s (rows land on their words)
            e = WORDS.get(s["id"], {}).get(str(j))
            if not e:
                continue
            for tt, tok in e["w"]:                                        # 15 and 45 frames after every spoken number / operation word
                if NUM.fullmatch(re.sub(r"[^a-z]", "", tok.lower())):
                    w = round((x["start"] + tt) * FPS)
                    fr.update((w + 15, w + 45))
    look = S / f"{tag}_look.txt"                                          # optional exact look moments
    if look.exists():
        fr.update(int(x) for x in look.read_text().split(",") if x.strip())
    fr = sorted(f for f in fr if 0 <= f < tot)
    (S / f"{tag}_frames.txt").write_text(",".join(map(str, fr)))
    print(f"{len(fr)} frames ({n0} house list + {len(fr) - n0} in the {len(CHANGED)} changed scenes) -> {S / f'{tag}_frames.txt'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
