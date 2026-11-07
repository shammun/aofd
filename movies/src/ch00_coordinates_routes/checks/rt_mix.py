"""ch00_coordinates_routes (#5f) remake 2026-11-07: the sound mix (VOICE job: hold G:/.../scratch/movies/VOICE.lock, lock protocol 2026-11-07).

tools/sound/mix.py's build() with the movie's cue sheet (movies/ch00/ch00_coordinates_routes/sound.yaml: chart-voyage, seed 29, bed -28
LUFS, duck 5 dB, 2.5-s tail, no effects). chart-voyage has no scene-entry layers (unlike Part 4's frame-drift), so nothing is moved.
Writes <out>/narration_music.wav (+ music.wav, sound.json) and a copy narration_music_rt.wav; checks integrated -16 +-0.5 LUFS and
true peak <= -1.5 dBTP. (= Part 4's checks/fr_mix.py without the layer shift.)

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_routes/checks/rt_mix.py <narration.wav> <out dir>
"""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(ROOT / "tools" / "sound"))
MOV = ROOT / "movies/ch00/ch00_coordinates_routes"


def main() -> int:
    nar, out = Path(sys.argv[1]), Path(sys.argv[2])
    import mix  # tools/sound/mix.py
    from sound import styles
    st = styles.STYLES["chart-voyage"]
    if any("enter_s" in ly or "exit_s" in ly for ly in st.layers):
        print("FAIL chart-voyage now has scene-timed layers: set them to this movie's final timing first")
        return 1
    r = mix.build(nar, MOV / "sound.yaml", out, MOV / "timing.json")
    L = r["mix"]
    ok = abs(L["integrated_lufs"] - (-16.0)) <= 0.5 and L["true_peak_dbtp"] <= -1.5 + 0.05
    shutil.copyfile(out / "narration_music.wav", out / "narration_music_rt.wav")
    (out / "sound.json").write_text(json.dumps(r, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"mix: {L['integrated_lufs']} LUFS, true peak {L['true_peak_dbtp']} dBTP -> {'PASS' if ok else 'FAIL'}; warnings {r.get('warnings')}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
