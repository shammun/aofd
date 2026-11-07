"""ch00_coordinates_storm (#5b) notes-2 round (the notes1 verification review, 2026-11-06): bring storyboard.yaml in line with
script.md (the narration source) after the s30 / s31 / s33 re-wordings, and record the notes-2 visual changes.

* every scene's voiceover = its script.md paragraph (with the [beat] markers), so make_timing.py --final can check them;
* a `notes2_2026_11_06` block (item -> scene -> change) at the end of the file (replaced on re-run).
t / sentence_times are filled by make_timing.py --final from the measured TTS.
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/n2_storyboard.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).parent))
from make_timing import set_block  # noqa: E402
from u1_storyboard import script_paragraphs  # noqa: E402

ROOT = Path(__file__).resolve().parents[4]
SBP = ROOT / "movies/ch00/ch00_coordinates_storm/storyboard.yaml"
NOTES2 = {
    "source": "reports/ch00_movies.md '## #5b ch00_coordinates_storm — notes1, verification review' (3 Must, 7 Should, 8 Cosmetic)",
    "M1": "s18: the close oblique camera pulled back (dist 13.5 -> 15.5); the 'height' label sits right of the arrow tip, >= 40 px inside the frame",
    "M2": "s19: the u_r colour bar fades out for the close side look (the layers run under it) and back in after",
    "M3": "s32: on 'So flood mappers use false colour' the natural pair dims ('next: false colour'); it cross-fades to the false-colour pair "
          "when its sweep stops in the middle; band rows on their words; swatches only once the false-colour picture is up; "
          "'the same two days' on its sentence",
    "S1": "s19: the radar's up arrows, 'up: measured by radar' and the radar source line removed (the radar is introduced in s20)",
    "S2": "s31 / s33: the knots -> km/h -> m/s steps are said (1.852, 3.6, why 3.6) and drawn in the key colour",
    "S3": "s34: the natural-colour sweep starts on the scene's first words and stops in the middle before 'Now the same two days'",
    "S4": "s30: Satkhira's label beside its dot; the 'before' date tag at the bottom left",
    "S5": "s30: the counted new-water pixels marked in cyan on the after picture; ≈ 34 700 pixels × (60 m × 60 m = 0.0036 km²) ≈ 125 km² "
          "shown and said (DS38)",
    "S6": "s31: the Nargis picture of 2 May contrast enhanced and shown wider (the eye and the spiral bands show)",
    "S7": "s06: keywords in the maths zone on their sentences (length 1, tip on the circle, θ̂ = r̂ turned 90°, both turn by Δθ, "
          "the slide rule)",
    "C2": "s31: 'Cyclone Nargis · May 2008' on its words",
    "C6": "s30: the Sentinel-1 satellite drawing on its name",
}


def main() -> None:
    par = script_paragraphs()
    lines = SBP.read_text(encoding="utf-8").split("\n")
    sb = yaml.safe_load("\n".join(lines))
    changed = []
    for sc in sb["scenes"]:
        sid = sc["id"]
        if sid in par and sc.get("voiceover", "").strip() != par[sid]:
            lines = set_block(lines, sid, "voiceover", par[sid])
            changed.append(sid)
    txt = "\n".join(lines)
    cut = txt.find("\nnotes2_2026_11_06:")
    if cut >= 0:
        txt = txt[:cut + 1]
    txt = txt.rstrip("\n") + "\n" + yaml.safe_dump({"notes2_2026_11_06": NOTES2}, width=150, sort_keys=False, allow_unicode=True)
    SBP.write_text(txt, encoding="utf-8")
    sb2 = yaml.safe_load(SBP.read_text(encoding="utf-8"))
    bad = [s["id"] for s in sb2["scenes"] if s["id"] in par and s["voiceover"].strip() != par[s["id"]]]
    print(f"voiceovers re-synced: {changed}; mismatches after: {bad}")


if __name__ == "__main__":
    main()
