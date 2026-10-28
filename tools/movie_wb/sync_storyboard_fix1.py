"""Fix loop 1 (review 1) records for ch00_weather_basics: sync storyboard.yaml with the spliced v3 narration and the
fix-loop data, and refresh the script.md header (review S10).

* every scene: t, sentence_times and voiceover from timing.json (the four replaced sentences: s29 S7, s44 S1, s55 S1-S2);
* audio.music: the real score (tools/movie_wb/sound_mix.py: 'air-flowing' + 'storm-tense' under s54-s59, G major with a
  Lydian colour, 84 bpm, seed 11, bed -28 LUFS, ducked 5 dB) instead of the stale "seed 7";
* measured_* / target_duration_s / words / sentences from the timing;
* s55: physics_source = the continuity tracker and the attached-front rule, 970.7 → 953.7 hPa; s52 ITCZ on the trough.
The header comment block is kept; PyYAML re-flows the rest (as update_storyboard.py did).
usage: .venv/Scripts/python.exe tools/movie_wb/sync_storyboard_fix1.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
D = ROOT / "movies" / "ch00" / "ch00_weather_basics"
HOLD_S = 2.5


def main() -> None:
    sbp, tp, scp = D / "storyboard.yaml", D / "timing.json", D / "script.md"
    raw = sbp.read_text(encoding="utf-8")
    header = "".join(ln + "\n" for ln in raw.splitlines() if ln.startswith("#"))
    header_lines = []
    for ln in raw.splitlines():
        if ln.startswith("#"):
            header_lines.append(ln)
        else:
            break
    header = "\n".join(header_lines) + "\n"
    sb = yaml.safe_load(raw)
    T = json.loads(tp.read_text(encoding="utf-8"))
    tsc = {s["id"]: s for s in T["scenes"]}
    words = sents = 0
    for sc in sb["scenes"]:
        ts = tsc[sc["id"]]
        sc["t"] = [round(ts["start"], 3), round(ts["end"], 3)]
        sc["sentence_times"] = [[round(x["start"], 3), round(x["end"], 3)] for x in ts["sentences"]]
        sc["voiceover"] = " ".join(x["text"] for x in ts["sentences"])
        words += len(sc["voiceover"].split())
        sents += len(ts["sentences"])
    sb["measured_narration_s"] = T["total_s"]
    sb["measured_frames"] = T["total_frames"] + round(HOLD_S * 30)
    sb["target_duration_s"] = round(T["total_s"] + HOLD_S, 3)
    sb["words"], sb["sentences"] = words, sents
    sb["audio"]["music"] = {
        "source": "tools/movie_wb/sound_mix.py → tools/sound/mix.py + styles.py (procedural synthesis, our own code, CC0)",
        "style": "air-flowing (most of the movie) + storm-tense under the Ciarán application s54-s59, cross-faded with 4-s raised-cosine ramps",
        "key": "G major (Lydian colour)", "tempo": "84 bpm, eighth-note arpeggio", "seed": 11,
        "level": "bed -28 LUFS, ducked 5 dB under speech; mix -16 LUFS", "tail_s": 2.5,
        "sections_s": "from sound_cues.yaml (s54 start → s60 start, measured from timing.json)",
        "notes": "a different score from every other movie (HOUSE_STYLE §8); recorded in v3/sound/sound.json"}
    sb.setdefault("fix_loop_1", {})
    sb["fix_loop_1"] = {
        "date": "2026-10-28", "review": "reports/ch00_movies.md 'ch00_weather_basics — review 1'",
        "narration": "four sentences replaced by tools/movie_wb/splice_replace.py (Kokoro, same gain; rest of the audio unchanged): "
                     "s29 S7 (RH 73 % spoken), s44 S1 ('measured ten metres up'), s55 S1 (front legend spoken), s55 S2 ('nine hundred and seventy')",
        "data": "Ciarán tracked by continuity (M3); hourly fronts attached to the tracked low with continuity (M4); ITCZ trough line (S7) — "
                "CHECK rows M3, M4, S7, W49 in manifest.json",
    }
    for sc in sb["scenes"]:
        if sc["id"] == "s55_ciaran_maps":
            sc["physics_source"] = {
                "fn": "fluidpy.diag.cyclone.storm_centre; fluidpy.diag.fronts.front_lines",
                "params": {"times": "2023-11-01T12 .. 2023-11-02T12 hourly",
                           "tracker": "seed = box (40-60N 30W-10E) minimum at its deepest hour (03 UTC 2 Nov); then storm_centre in ±2.5° lat × ±4° lon round the previous hour",
                           "fronts": "front_lines(T850, locate='centre') lines ≥ 300 km within 350 km of the tracked centre, clipped to 800 km, nearest to the previous hour's line"},
                "outputs": {"min_hPa_start": 970.7, "min_hPa_lowest": 953.7, "lowest_at": "2023-11-02T03 50.1N 3.73W",
                            "old_rule_note": "the box minimum at 12-14 UTC 1 Nov was another low ≥ 1060 km away (965 hPa); fixed in fix loop 1"},
                "data": "data/ciaran_hourly.{bin,json}, data/fronts.json (hourly)",
                "test": "../Fluid Dynamics/tests/diag/test_cyclone.py, test_fronts.py; CHECK M3, M4, W49"}
            sc["screen_summary"] = ("same panel; 12 UTC 1 Nov held while the isobars and the warm (red) / cold (blue) fronts are named; then the hours run with the clock, "
                                    "'L' on Ciarán's own centre with 'low: 971 → 954 hPa'; gold track; Brest dot")
        if sc["id"] == "s52_pressure_belts":
            sc["screen_summary_fix1"] = "ITCZ drawn on the sphere along the annual-mean MSLP trough (climatology.json itcz_trough), not on the equator"
    body = yaml.safe_dump(sb, sort_keys=False, allow_unicode=True, width=120)
    sbp.write_text(header + body, encoding="utf-8")
    # script.md header (review S10): measured numbers of the current narration
    s = scp.read_text(encoding="utf-8")
    first, rest = s.split("\n## ", 1)
    lines = first.splitlines()
    new_hdr = [lines[0], "",
               f"Version 2, fix loop 1 (2026-10-28). House style `movies/HOUSE_STYLE.md` (reference `ch00_dot_product_why` v6). Voice Kokoro `af_bella`, speed 1.0; "
               f"music: our own procedural score (seed 11, 'air-flowing' + 'storm-tense' under s54-s59, G major Lydian, 84 bpm). Brief: `brief.md`; data: `data_needs.md`; storyboard: `storyboard.yaml`.",
               "",
               f"**Measured (timing.json):** {len(T['scenes'])} scenes, {sents} sentences, {words} words, narration {T['total_s']:.3f} s + 2.5-s end hold = "
               f"{T['total_s'] + 2.5:.3f} s; {T['cues']} caption cues; self-check diff {T['self_check']['diff_ms']} ms. The v1 TTS run was extended by "
               "tools/movie_wb/splice_insert.py (v2: 4 sentences inserted) and tools/movie_wb/splice_replace.py (fix loop 1: 4 sentences replaced).",
               "",
               "Conventions: S<k> in the storyboard = sentence k of the scene; numbers are spoken in words and every number on screen is spoken. "
               "The per-scene lines below the narration were written for v1; their measured times are superseded by timing.json.", ""]
    s2 = "\n".join(new_hdr) + "\n## " + rest
    # fix the per-scene sentence counts where they no longer match
    blocks = s2.split("\n## ")
    for i in range(1, len(blocks)):
        sid = blocks[i].split("\n", 1)[0].strip()
        if sid in tsc:
            ts = tsc[sid]
            nw = sum(len(x["text"].split()) for x in ts["sentences"])
            blocks[i] = re.sub(r"> \d+ words · \d+ sentences", f"> {nw} words · {len(ts['sentences'])} sentences", blocks[i], count=1)
    s2 = "\n## ".join(blocks)
    scp.write_text(s2, encoding="utf-8")
    print(f"storyboard: {len(sb['scenes'])} scenes, {sents} sentences, {words} words, target {sb['target_duration_s']} s; script.md header refreshed")


if __name__ == "__main__":
    main()
