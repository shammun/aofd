"""Write movies/ch00/ch00_gradient/sound.yaml (the cue sheet for tools/sound/mix.py) from the build-1 timing.json: the score and four
quiet effects, each starting on the scene-relative time of the sentence whose picture shows the thing (HOUSE_STYLE §8).

usage (repo root): .venv/Scripts/python.exe movies/src/ch00_gradient/checks/gr_sound_cues.py
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
D = ROOT / "movies" / "ch00" / "ch00_gradient"


def main() -> None:
    T = json.loads((D / "timing.json").read_text(encoding="utf-8"))
    sc = {s["id"]: s for s in T["scenes"]}

    def off(sid: str, j: int, pad: float = 0.2) -> tuple[float, float]:
        s = sc[sid]
        a = s["sentences"][j]
        return round(a["start"] - s["start"] + pad, 2), round(a["end"] - a["start"], 2)

    o15, d15 = off("s15_mont_blanc", 0)
    o16, d16 = off("s16_water_scale", 1)
    o29, d29 = off("s29_crowded_winds", 0)
    o35, d35 = off("s35_sea_breeze", 1)
    txt = f"""# ch00_gradient (#6): sound cue sheet for tools/sound/mix.py (build 1, 2026-11-04; written by checks/gr_sound_cues.py from timing.json).
# Score: the storyboard's new style 'steepest-ascent' is not in tools/sound/styles.py (a tools change, not the builder's), so the
# storyboard's named runner-up is used: sun-radiant (E major warm pad, slow rising arpeggios), seed 31 — not used by any finished movie.
# Effects: only where the picture shows the thing, quiet ducked beds (HOUSE_STYLE §8); offsets = scene-relative seconds of the sentence
# they sit under. The storyboard's 'wind_mountain_soft' / 'water_trickle' / 'wind_strong_far' are mapped to the library's
# wind_gentle / stream / wind_gusty.
music: {{style: sun-radiant, seed: 31, bed_lufs: -28, duck_db: 5, tail_s: 2.5}}
timing: timing.json
sfx_duck_db: 5
effects:
  # s15 S1: the camera over the Mont Blanc massif
  - {{effect: wind_gentle, scene: s15, offset: {o15}, duration: {min(9.0, d15):.2f}, intensity: 0.08, lufs: -30, fade_in: 1.5, fade_out: 2.0, seed: 61}}
  # s16 S2: droplets sliding down the steepest way into the valleys
  - {{effect: stream, scene: s16, offset: {o16}, duration: {min(9.0, d16):.2f}, intensity: 0.08, lufs: -30, fade_in: 1.0, fade_out: 2.0, seed: 62}}
  # s29 S1: streaklines racing where Ciarán's isobars crowd
  - {{effect: wind_gusty, scene: s29, offset: {o29}, duration: {min(8.0, d29 + 2.0):.2f}, intensity: 0.12, lufs: -29, fade_in: 1.5, fade_out: 2.0, seed: 63}}
  # s35 S2: the Normandy shoreline
  - {{effect: waves_breaking, scene: s35, offset: {o35}, duration: {min(7.0, d35):.2f}, intensity: 0.08, lufs: -30, fade_in: 0.8, fade_out: 1.5, seed: 64}}
"""
    (D / "sound.yaml").write_text(txt, encoding="utf-8")
    print("sound.yaml written")


if __name__ == "__main__":
    main()
