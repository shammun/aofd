"""ch00_coordinates_moving (#5e) remake 2026-11-07: the sound mix (VOICE job: hold G:/.../scratch/movies/VOICE.lock; lock protocol 2026-11-07).

tools/sound/mix.py's build() with the movie's cue sheet (movies/ch00/ch00_coordinates_moving/sound.yaml: passing-front, seed 43, bed -28 LUFS,
duck 5 dB, 2.5-s tail, one quiet wind bed under s08). The style's "from s08 on" wind layer carries the pre-remake s08 start (564.1 s) in
tools/sound/styles.py; here, in this process only, its enter_s is set to the s08 start of the final timing.json (the shared tool is not
edited) (= Part 4's fr_mix.py). Writes <out>/narration_music.wav (+ music.wav, sound.json) and a copy narration_music_mv.wav (the
composition's audio name); prints the integrated loudness and true peak.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_moving/checks/mv_mix.py <narration.wav> <out dir>
"""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(ROOT / "tools" / "sound"))
MOV = ROOT / "movies/ch00/ch00_coordinates_moving"


def main() -> int:
    nar, out = Path(sys.argv[1]), Path(sys.argv[2])
    import mix  # tools/sound/mix.py
    from sound import styles
    tm = json.loads((MOV / "timing.json").read_text(encoding="utf-8"))
    if tm.get("provisional"):
        print("STOP: timing.json is provisional (run mv_final_timing.py --final first)")
        return 1
    s08 = next(s["start"] for s in tm["scenes"] if s["id"] == "s08_ciaran")
    st = styles.STYLES["passing-front"]
    moved = 0
    for ly in st.layers:
        if "enter_s" in ly:
            ly["enter_s"] = round(float(s08), 3)
            moved += 1
    print(f"passing-front: {moved} layer(s) enter at s08 = {s08:.3f} s (styles.py says 564.1, the pre-remake s08)")
    r = mix.build(nar, MOV / "sound.yaml", out, MOV / "timing.json")
    L = r["mix"]
    ok = abs(L["integrated_lufs"] - (-16.0)) <= 0.5 and L["true_peak_dbtp"] <= -1.5 + 0.05
    shutil.copyfile(out / "narration_music.wav", out / "narration_music_mv.wav")
    r["remake_note"] = f"passing-front layer(s) with enter_s moved to s08 = {s08:.3f} s by checks/mv_mix.py"
    (out / "sound.json").write_text(json.dumps(r, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"mix: {L['integrated_lufs']} LUFS, true peak {L['true_peak_dbtp']} dBTP -> {'PASS' if ok else 'FAIL'}; warnings {r.get('warnings')}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
