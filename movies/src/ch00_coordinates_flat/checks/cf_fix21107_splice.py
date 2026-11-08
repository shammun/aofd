"""ch00_coordinates_flat (#5a) fix 2 (2026-11-07, fix1 review 2 Should 14): re-voice ONLY s23 S7 and S13, which still read a plain
product / quotient of numbers, under the house rule "show the arithmetic, voice the meaning".

Same method as cf_fix1107_splice.py (it is imported and re-pointed): one Kokoro af_bella x1.0 clip per spoken sentence, 0.35-s house
gap, BS.1770-4 match to the nearest unchanged neighbours, limiter -1.5 dBTP, +-1.5 LU or stop; cues never split a number; Kokoro
token times of the new clips go into words.json (all other entries are kept from the merged words.json); script.md is updated.

Base: the fix-1 narration (scratch fix1107/tts). Output: scratch fix21107/tts + movie timing.json, en.vtt/srt, words.json, script.md.
Run in .venv-tts under VOICE.lock:  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fix21107_splice.py [--dry]
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import cf_fix1107_splice as G  # noqa: E402

REPLACE = [
    # was: "Thirteen metres per second, times three point six, is about forty seven kilometres per hour, towards the centre."
    ("s23_what_numbers_mean", 6, "Converted with the same factor of three point six, the inflow is about forty seven kilometres per hour, "
                                 "towards the centre."),
    # was: "... for every thirteen in, and thirty five over thirteen is about two point seven. So for every metre ..."
    ("s23_what_numbers_mean", 12, "In any stretch of time, it goes thirty five metres round for every thirteen in, so it goes about two "
                                  "point seven times as far round as in. So for every metre it moves in, it moves almost three metres round."),
]


def current_words(T: dict) -> dict:
    """the merged words.json (every entry), checked against the base timing"""
    W = json.loads((G.MOV / "words.json").read_text(encoding="utf-8"))["scenes"]
    sc = {s["id"]: s for s in T["scenes"]}
    for sid, ents in W.items():
        for j, e in ents.items():
            if sc[sid]["sentences"][int(j)]["text"] != e["text"]:
                raise SystemExit(f"words.json {sid} {j} does not match the base timing")
    return {sid: dict(v) for sid, v in W.items()}


def main() -> None:
    G.REPLACE = REPLACE
    G.OLD, G.NEW = G.SCR / "fix1107" / "tts", G.SCR / "fix21107" / "tts"
    G.r2_words = current_words
    if "--dry" in sys.argv:
        G.dry(); return
    before = json.loads((G.MOV / "timing.json").read_text(encoding="utf-8"))
    hist = before.get("self_check", {}).get("spliced_fix1107")
    G.main()
    for d in (G.NEW, G.MOV):
        p = d / "timing.json"
        T = json.loads(p.read_text(encoding="utf-8"))
        sc = T["self_check"]
        sc["spliced_fix2_1107"] = sc.pop("spliced_fix1107")
        if hist is not None:
            sc["spliced_fix1107"] = hist
        p.write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    W = json.loads((G.MOV / "words.json").read_text(encoding="utf-8"))
    W["note"] += "; fix 2 (2026-11-07): merged auditor word times for the entries not re-voiced in fix 1; s23 S7 and S13 re-voiced"
    (G.MOV / "words.json").write_text(json.dumps(W, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


if __name__ == "__main__":
    main()
