"""ch00_coordinates_flat (#5a) — user feedback 2026-11-06, minimal scope of 2026-11-07: record the changed scenes in storyboard.yaml
after cf_fb1106_splice.py and cf_fix1_sync.py (which sync the voiceovers and times). Only scenes whose frames changed are touched
(the user: "don't reconcile storyboard text unless the rendered frame is wrong"): s00 (title layout), s19 (tensors keyword), s22, s24,
s25, s27, s28 get a `feedback_2026_11_06` note; s22 / s24 get their new calc rows; one honesty note for the s25 coast sketch.
Idempotent. usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fb1106_storyboard.py
"""
import re
from pathlib import Path

import yaml

R = Path(__file__).resolve().parents[4]
sbp = R / "movies/ch00/ch00_coordinates_flat/storyboard.yaml"
txt = sbp.read_text(encoding="utf-8")
header = "".join(ln + "\n" for ln in txt.splitlines() if ln.startswith("#"))
sb = yaml.safe_load(txt)
S = {s["id"]: s for s in sb["scenes"]}

FB = {
    "s00_title": ("R1/R2: 'made easy' and its pulse removed; the series title layout (kit_cf/SeriesTitle.tsx): 'Coordinates' 150 px house gradient, "
                  "pulsing x1.06 on AT(0,'coordinates'); 'Part 1 · Arrows on a flat map' (size fitted to the 975-px column by textW); subtitle "
                  "'polar coordinates' / 'and rotated axes' 68 px. Voice: no 'the easy way'."),
    "s19_index_form": "R1: S22 'our tensors movie, later in this series'; keyword 'more: our tensors movie'.",
    "s22_spin_inflow": ("R8: S5 (four clips) adds the rule in symbols, ū_r = (1/N) Σ u_r,i (rose) and ū_θ alike (teal), and N = 360°÷5° = 72 "
                        "(gold); the u_θ sum's first terms (38.0 + 37.8 + 38.3 + …)/72 above its running sum (screen only); S10 (three clips) says "
                        "and writes the u_r sum's first terms −8.7, −10.3, −11.2, … (each on its word; those three ring points ringed in gold), then "
                        "the sum −957.2 (running sum moved to y 765/820), ÷ 72, −13.3. S11 (why negative = in) unchanged."),
    "s24_ring_points": ("R7: the three worked points unchanged; S24 (four clips): 'the other points work the same way … without the arithmetic'; "
                        "the map zooms (ring ≈ 230 px) and all eight points every 45° get their u_r (rose) and u_θ (teal) arrows, labelled with "
                        "the values (library to 0.1; 135° 38.6 as worked); legend 'u_r: in (−) or out (+)', 'u_θ: round'; keyword 'in at 7 of 8 "
                        "points · out at 225°'; 'all 72, then average'; R8 link: ū_r = (−8.7 − 10.3 − 11.2 − …)/72 ≈ −13.3 with −8.7 in gold "
                        "and the 0° point ringed."),
    "s25_why_polar_storm": ("R9 (at the 'eastward, northward, round, in, out' legend, 40:23 in fix 3) + user 2026-11-07: S15 (five clips) points "
                            "to Part 2's impact; keyword 'next, in Part 2: winds at a coast'; at Fort Myers Beach the turned axes x' (along the "
                            "shore, NNW) and y' (across it, towards the land, ENE); over the Gulf 'across the shore, towards the land:' / 'sea water "
                            "pushed onto the coast', then on their words 'Part 2: wind onto the land' / '→ water level' / '→ flood maps'."),
    "s27_recap": ("R3 + user 2026-11-07: the teaser (S11, two clips) names Part 2: how fast r-hat and theta-hat turn, height (cylindrical "
                  "coordinates), these same turned axes on real storms (wind onto the land, how high the water rose, the flooding from space "
                  "before and after); one line per phrase; the beat-10 picture is the balloon going round with its r-hat and theta-hat turning."),
    "s28_end": "R3: the picture fades to the background over the final 2.5-s hold (frames LEN−75 … LEN−5) while the music bed fades in the mix tail.",
}
for sid, note in FB.items():
    S[sid]["feedback_2026_11_06"] = note
S["s00_title"]["visual"] = re.sub(r"Left x 100-1075: .*?>= 50 px clear of the animation\.", (
    "Left x 100-1075, the series title layout (kit_cf/SeriesTitle.tsx, feedback 2026-11-06 R1/R2): RiseText 'Coordinates' (150 px, weight 800, "
    "TitleGradient teal -> gold, letters rise 24 px over 8 frames, 2-frame stagger; pulses x1.06 on AT(0,'coordinates')), 'Part 1 · Arrows on a flat "
    "map' (warm white, size fitted to the 975-px column), subtitle 'polar coordinates' / 'and rotated axes' (68 px); >= 50 px clear of the "
    "animation."), S["s00_title"]["visual"], flags=re.S)
S["s22_spin_inflow"]["calc_rows"] = list(dict.fromkeys((S["s22_spin_inflow"].get("calc_rows") or []) + [
    r"\overline{u_r}=\dfrac{1}{N}\sum_{i=1}^{N}u_{r,i}", r"\overline{u_\theta}=\dfrac{1}{N}\sum_{i=1}^{N}u_{\theta,i}",
    r"N=360^\circ\div5^\circ=72\ \text{points}", r"\overline{u_\theta}=\dfrac{38.0+37.8+38.3+\dots}{72}",
    r"\overline{u_r}=\dfrac{-8.7-10.3-11.2-\dots}{72}"]))
S["s24_ring_points"]["calc_rows"] = list(dict.fromkeys(S["s24_ring_points"]["calc_rows"] + [r"\overline{u_r}=\dfrac{-8.7-10.3-11.2-\dots}{72}\approx-13.3"]))
note = ("s25 coast sketch (feedback 2026-11-06): the x′/y′ arrows at Fort Myers Beach are a schematic of Part 2's turned axes (shore about 329°), "
        "not data; the voice says Part 2 shows it with tide gauges and satellite pictures.")
if note not in sb["honesty_notes"]:
    sb["honesty_notes"].append(note)
out = header + yaml.safe_dump(sb, allow_unicode=True, sort_keys=False, width=140)
out = out.replace("Tensors made easy", "our tensors movie")
sbp.write_text(out, encoding="utf-8")
print("storyboard: feedback notes on", len(FB), "scenes; 'easy way' in the s00 visual:", "easy way" in S["s00_title"]["visual"])
