"""Fix loop 3 (review 3) records for ch00_weather_basics: sync storyboard.yaml with the spliced v4 narration
(tools/movie_wb/splice_fix3.py), add the fix_loop_3 record, refresh the script.md header and the per-scene word/sentence
counts, and re-time the sound cue sheet (storm-tense section end = new s60 start; s55 gusts = the longer scene; s58 gusts
on the wind sentence, which is now S3).
usage: .venv/Scripts/python.exe tools/movie_wb/sync_storyboard_fix3.py
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
    sbp, tp, scp, cup = D / "storyboard.yaml", D / "timing.json", D / "script.md", D / "sound_cues.yaml"
    raw = sbp.read_text(encoding="utf-8")
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
        if sc["id"] == "s55_ciaran_maps":
            sc["screen_summary_fix3"] = ("S1 says the fronts are drawn 'until that evening' (12-21 UTC 1 Nov, then they fade); the clock runs 12 → 01 UTC "
                                         "by 'fifty-four' (954 hPa at 01 UTC), 01 → 03 UTC over 'crosses the English Channel just north of Brest' "
                                         "(closest at about 01:50 UTC), then on to 12 UTC 2 Nov")
        if sc["id"] == "s58_brest_cold_front":
            sc["screen_summary_fix3"] = ("S1: the map runs on 20 → 00 UTC while the last drawn fronts fade over the first 0.5 s; S2 (new) says the map "
                                         "can't trace the bent fronts and points to Brest's measurements: graph band 'cold front' on \"Brest's own "
                                         "measurements\"; the wind labels / 45-kt sum on S3, '−2 °C' on S4, 'cooler polar air' on S5")
    sb["measured_narration_s"] = T["total_s"]
    sb["measured_frames"] = T["total_frames"] + round(HOLD_S * 30)
    sb["target_duration_s"] = round(T["total_s"] + HOLD_S, 3)
    sb["words"], sb["sentences"] = words, sents
    sb["fix_loop_3"] = {
        "date": "2026-10-28", "review": "reports/ch00_movies.md 'ch00_weather_basics — review 3'",
        "narration": "tools/movie_wb/splice_fix3.py (Kokoro af_bella 1.0, same gain method, rest unchanged): s55 S1 replaced "
                     "(fronts 'until that evening'), one sentence inserted after s58 S1 (the map can't trace the fronts; Brest's measurements show it)",
        "screen": "N3-M1 s58 fronts fade over 0.5 s + reveals re-timed; S-a cream H/L (dark outline) on the diverging MSLP globes s42/s52 "
                  "(pink L / blue H kept on satellite and grey maps); S-b s21 keywords 14 px up; S-c s55 01-03 UTC slowed onto the crossing words; "
                  "cosmetics: s25 'Paris 11 km' left of the curves, s57 '≈ 14.5 °C' (14.35 °C, spoken 'about fourteen and a half'), "
                  "s55-s58 L glyph slides 30 px up-left near Brest's ring",
        "sound": "sound_cues.yaml re-timed (storm-tense to the new s60 start; s55/s58 gusts), re-mixed with tools/movie_wb/sound_mix.py",
    }
    body = yaml.safe_dump(sb, sort_keys=False, allow_unicode=True, width=120)
    sbp.write_text(header + body, encoding="utf-8")

    # script.md header and per-scene counts
    s = scp.read_text(encoding="utf-8")
    first, rest = s.split("\n## ", 1)
    lines = first.splitlines()
    new_hdr = [lines[0], "",
               "Version 3, fix loop 3 (2026-10-28). House style `movies/HOUSE_STYLE.md` (reference `ch00_dot_product_why` v6). Voice Kokoro `af_bella`, speed 1.0; "
               "music: our own procedural score (seed 11, 'air-flowing' + 'storm-tense' under s54-s59, G major Lydian, 84 bpm). Brief: `brief.md`; data: `data_needs.md`; storyboard: `storyboard.yaml`.",
               "",
               f"**Measured (timing.json):** {len(T['scenes'])} scenes, {sents} sentences, {words} words, narration {T['total_s']:.3f} s + 2.5-s end hold = "
               f"{T['total_s'] + 2.5:.3f} s; {T['cues']} caption cues; self-check diff {T['self_check']['diff_ms']} ms. The v1 TTS run was extended by "
               "tools/movie_wb/splice_insert.py (v2: 4 sentences inserted), tools/movie_wb/splice_replace.py (fix loop 1: 4 sentences replaced) and "
               "tools/movie_wb/splice_fix3.py (fix loop 3: s55 S1 replaced, one sentence inserted in s58).",
               "",
               "Conventions: S<k> in the storyboard = sentence k of the scene; numbers are spoken in words and every number on screen is spoken. "
               "The per-scene lines below the narration were written for v1; their measured times are superseded by timing.json.", ""]
    s2 = "\n".join(new_hdr) + "\n## " + rest
    blocks = s2.split("\n## ")
    for i in range(1, len(blocks)):
        sid = blocks[i].split("\n", 1)[0].strip()
        if sid in tsc:
            ts = tsc[sid]
            nw = sum(len(x["text"].split()) for x in ts["sentences"])
            blocks[i] = re.sub(r"> \d+ words · \d+ sentences", f"> {nw} words · {len(ts['sentences'])} sentences", blocks[i], count=1)
    scp.write_text("\n## ".join(blocks), encoding="utf-8")

    # sound cue sheet: line edits (keeps the comments)
    cu = cup.read_text(encoding="utf-8")
    s60 = round(tsc["s60_recap"]["start"], 3)
    s55 = tsc["s55_ciaran_maps"]
    s58 = tsc["s58_brest_cold_front"]
    cu, n1 = re.subn(r"(  - style: storm-tense\n    from_s: [\d.]+\n    to_s: )[\d.]+", rf"\g<1>{s60}", cu)
    cu, n2 = re.subn(r"(  - style: air-flowing\n    from_s: )[\d.]+(\n    to_s: end)", rf"\g<1>{s60}\g<2>", cu)
    d55 = round(s55["end"] - s55["start"] - 0.875, 2)
    cu, n3 = re.subn(r"(  scene: s55_ciaran_maps\n  offset: 0\.0\n  duration: )[\d.]+", rf"\g<1>{d55}", cu)
    w = s58["sentences"][2]
    o58, dd58 = round(w["start"] - s58["start"], 2), round(w["dur"], 2)
    cu, n4 = re.subn(r"(  scene: s58_brest_cold_front\n  offset: )[\d.]+(\n  duration: )[\d.]+", rf"\g<1>{o58}\g<2>{dd58}", cu)
    if (n1, n2, n3, n4) != (1, 1, 1, 1):
        raise SystemExit(f"sound_cues.yaml: edits not applied {n1, n2, n3, n4}")
    cup.write_text(cu, encoding="utf-8")
    print(f"storyboard: {len(sb['scenes'])} scenes, {sents} sentences, {words} words, target {sb['target_duration_s']} s; "
          f"sound cues: storm-tense to {s60}, s55 gusts {d55} s, s58 gusts at +{o58} s for {dd58} s")


if __name__ == "__main__":
    main()
