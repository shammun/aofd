"""ch00_coordinates_maps (#5g) remake 2026-11-07: the sound mix (VOICE job: hold G:/.../scratch/movies/VOICE.lock, lock protocol 2026-11-07).

tools/sound/mix.py's build() with the movie's cue sheet (movies/ch00/ch00_coordinates_maps/sound.yaml: polar-chart, seed 31, bed -28 LUFS,
duck 5 dB, 2.5-s tail, no effects). The style's "from s16 on" changes (the paper-rustle noise leaves, the high glass drone and the celesta
shimmer enter, the pad thins) carry the pre-remake s16 start (1310.0 s) in tools/sound/styles.py; here, in this process only, every one of
them (layer enter_s / exit_s and pad_env thin_at) is set to the s16 start of the final timing.json (the shared tool is not edited; = Part 4's
checks/fr_mix.py). Writes <out>/narration_music.wav (+ music.wav, sound.json) and a copy narration_music_mp.wav; checks integrated
-16 +-0.5 LUFS and true peak <= -1.5 dBTP.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_maps/checks/mp_mix.py <narration.wav> <out dir>
"""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(ROOT / "tools" / "sound"))
MOV = ROOT / "movies/ch00/ch00_coordinates_maps"
OLD_S16 = 1310.0


def main() -> int:
    nar, out = Path(sys.argv[1]), Path(sys.argv[2])
    import mix  # tools/sound/mix.py
    from sound import styles
    tm = json.loads((MOV / "timing.json").read_text(encoding="utf-8"))
    s16 = round(float(next(s["start"] for s in tm["scenes"] if s["id"] == "s16_globe_to_pole")), 3)
    st = styles.STYLES["polar-chart"]
    moved = 0
    for ly in st.layers:
        for key in ("enter_s", "exit_s"):
            if key in ly:
                if abs(ly[key] - OLD_S16) > 1e-6:
                    print(f"FAIL polar-chart layer {ly.get('kind')} {key} = {ly[key]} (expected the old s16 start {OLD_S16}): check styles.py")
                    return 1
                ly[key] = s16
                moved += 1
    if st.pad_env.get("thin_at") is not None:
        st.pad_env["thin_at"] = s16
        moved += 1
    print(f"polar-chart: {moved} scene-timed setting(s) moved to s16 = {s16:.3f} s (styles.py says {OLD_S16}, the pre-remake s16)")
    r = mix.build(nar, MOV / "sound.yaml", out, MOV / "timing.json")
    L = r["mix"]
    ok = abs(L["integrated_lufs"] - (-16.0)) <= 0.5 and L["true_peak_dbtp"] <= -1.5 + 0.05
    shutil.copyfile(out / "narration_music.wav", out / "narration_music_mp.wav")
    r["remake_note"] = f"polar-chart s16 layers / pad thinning moved to s16 = {s16:.3f} s by checks/mp_mix.py"
    (out / "sound.json").write_text(json.dumps(r, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"mix: {L['integrated_lufs']} LUFS, true peak {L['true_peak_dbtp']} dBTP -> {'PASS' if ok else 'FAIL'}; warnings {r.get('warnings')}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
