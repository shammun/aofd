"""ch00_coordinates_storm (#5b) fix loop 1 (2026-11-07): storyboard.yaml voiceovers = the script.md paragraphs (fix1_script.py), plus a
top-level `fix_loop_1_2026_11_07` block. t / sentence_times / target_duration_s are refilled by make_timing.py --final from the fix1 TTS.
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/fix1_storyboard.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).parent))
from make_timing import set_block, set_top  # noqa: E402
from u1_storyboard import script_paragraphs  # noqa: E402
from fix1_script import FIX1  # noqa: E402

ROOT = Path(__file__).resolve().parents[4]
SBP = ROOT / "movies/ch00/ch00_coordinates_storm/storyboard.yaml"


def main() -> int:
    par = script_paragraphs()
    sb = yaml.safe_load(SBP.read_text(encoding="utf-8"))
    lines = SBP.read_text(encoding="utf-8").split("\n")
    for s in sb["scenes"]:
        if s["voiceover"].strip() != par[s["id"]]:
            lines = set_block(lines, s["id"], "voiceover", par[s["id"]])
    lines = set_top(lines, "fix_loop_1_2026_11_07", {
        "inputs": "reports/ch00_movies.md: r8 review 1 (3 Must, 12 Should) and r8 review 2 calc & sync audit (1 Must, 13 Should, 7 Nit); Must 1 of both "
                  "(physics gate SKIP) resolved by the orchestrator's QA re-run with --manifest",
        "re_voiced": sorted({sid for sid, *_ in FIX1}),
        "voice": "14 clips (Kokoro af_bella x 1.0, loudness-matched), checks/fix1_splice.py; s14, s30 and the three event scenes gain one sentence",
        "timing": "every AT() on Kokoro word times (words.json from checks/fix1_words.py; 537 / 537 sentences)",
        "facts": "IBTrACS v04r01 agency pressures (Amphan 09 UTC 960, Nargis 09-12 UTC 962, Idai 18 UTC 955 hPa); ERA5 grid minimum msl at the "
                 "white circle 965 / 982 / 981 hPa (cs.json shore.*.pmin); 100 Pa / (1025 kg/m3 x 9.81 m/s2) = 0.0099 m; TDR towers 11.6 m/s",
    })
    SBP.write_text("\n".join(lines), encoding="utf-8")
    sb2 = yaml.safe_load(SBP.read_text(encoding="utf-8"))
    bad = [s["id"] for s in sb2["scenes"] if s["voiceover"].strip() != par[s["id"]]]
    print(f"{len(sb2['scenes'])} scenes; voiceover mismatches: {bad}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
