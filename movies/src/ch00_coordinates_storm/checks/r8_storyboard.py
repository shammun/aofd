"""ch00_coordinates_storm (#5b) pass r8 2026-11-07 ("show it, don't voice it"): storyboard.yaml voiceovers = the new script.md paragraphs
(r8_script.py), plus a top-level `pass_r8_2026_11_07` block. t / sentence_times / target_duration_s are refilled by
make_timing.py --final from the measured r8 TTS.
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/r8_storyboard.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).parent))
from make_timing import set_block, set_top  # noqa: E402
from u1_storyboard import script_paragraphs  # noqa: E402
from r8_script import R8  # noqa: E402

ROOT = Path(__file__).resolve().parents[4]
SBP = ROOT / "movies/ch00/ch00_coordinates_storm/storyboard.yaml"


def main() -> int:
    par = script_paragraphs()
    sb = yaml.safe_load(SBP.read_text(encoding="utf-8"))
    lines = SBP.read_text(encoding="utf-8").split("\n")
    changed = sorted({sid for sid, *_ in R8})
    for s in sb["scenes"]:
        if s["voiceover"].strip() != par[s["id"]]:
            lines = set_block(lines, s["id"], "voiceover", par[s["id"]])
    lines = set_top(lines, "pass_r8_2026_11_07", {
        "rule": "user 2026-11-07 'show it, don't voice it' + clarification: the arithmetic stays on screen in full; the voice relates the numbers "
                "(what is combined, where each comes from) and gives the result; no individual products / sums / sign rules read out",
        "tool": "movies/src/ch00_coordinates_storm/checks/r8_script.py (53 sentences incl. the s00 opening rule, sentence counts unchanged)",
        "scenes": changed,
        "on_screen": "unchanged; reveals re-pointed to the new words (Kokoro word timestamps, r8 word table)",
    })
    SBP.write_text("\n".join(lines), encoding="utf-8")
    sb2 = yaml.safe_load(SBP.read_text(encoding="utf-8"))
    bad = [s["id"] for s in sb2["scenes"] if s["voiceover"].strip() != par[s["id"]]]
    print(f"{len(sb2['scenes'])} scenes; voiceover mismatches: {bad}; r8 scenes: {len(changed)}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
