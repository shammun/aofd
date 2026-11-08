"""ch00_coordinates_frames (#5d) remake 2026-11-07: the sound mix (HEAVY job: hold G:/.../scratch/movies/HEAVY.lock).

tools/sound/mix.py's build() with the movie's cue sheet (movies/ch00/ch00_coordinates_frames/sound.yaml: frame-drift, seed 41, bed -28 LUFS,
duck 5 dB, 2.5-s tail, no effects). The style's two "from s28 on" layers carry the pre-remake s28 start (2260.8 s) in tools/sound/styles.py;
here, in this process only, their enter_s is set to the s28 start of the final timing.json (the shared tool is not edited). Writes
<out>/narration_music.wav (+ music.wav, sound.json) and a copy narration_music_fr.wav; prints the integrated loudness and true peak.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_frames/checks/fr_mix.py <narration.wav> <out dir>
"""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(ROOT / "tools" / "sound"))
MOV = ROOT / "movies/ch00/ch00_coordinates_frames"


def main() -> int:
    nar, out = Path(sys.argv[1]), Path(sys.argv[2])
    import mix  # tools/sound/mix.py
    from sound import styles
    tm = json.loads((MOV / "timing.json").read_text(encoding="utf-8"))
    s28 = next(s["start"] for s in tm["scenes"] if s["id"] == "s28_recap")
    st = styles.STYLES["frame-drift"]
    moved = 0
    for ly in st.layers:
        if "enter_s" in ly:
            ly["enter_s"] = round(float(s28), 3)
            moved += 1
    print(f"frame-drift: {moved} layer(s) enter at s28 = {s28:.3f} s (styles.py says 2260.8, the pre-remake s28)")
    r = mix.build(nar, MOV / "sound.yaml", out, MOV / "timing.json")
    L = r["mix"]
    ok = abs(L["integrated_lufs"] - (-16.0)) <= 0.5 and L["true_peak_dbtp"] <= -1.5 + 0.05
    shutil.copyfile(out / "narration_music.wav", out / "narration_music_fr.wav")
    r["remake_note"] = f"frame-drift layers with enter_s moved to s28 = {s28:.3f} s by checks/fr_mix.py"
    (out / "sound.json").write_text(json.dumps(r, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"mix: {L['integrated_lufs']} LUFS, true peak {L['true_peak_dbtp']} dBTP -> {'PASS' if ok else 'FAIL'}; warnings {r.get('warnings')}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
