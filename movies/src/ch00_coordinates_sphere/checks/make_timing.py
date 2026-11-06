"""Provisional timing.json for ch00_coordinates_sphere (#5c, Part 3) from the MEASURED dry run 3 (no new TTS).

The storyboard (movies/ch00/ch00_coordinates_sphere/storyboard.yaml) was generated from dry run 3
(G:/.../scratch/movies/ch00_coordinates_sphere/dryrun3/timing.json). This script copies that run's scenes and sentences,
checks that every sentence time equals the storyboard's `sentence_times` (to 1 ms), that every scene text equals the storyboard
voiceover (with "[beat]" removed) and that the total equals `target_duration_s`, and writes timing.json marked provisional (the
final TTS of the heavy phase replaces it; the composition reads only scenes / sentences / total_frames).

Calc & sync audit #5c (2026-11-05): the re-voiced sentences in checks/revoice.py (REVOICE) get ESTIMATED clip lengths (measured
length x new/old characters) and everything after them shifts (revoice.apply); `--sync` first writes those estimated times into the
storyboard (scene t, sentence_times, target_duration_s, dry_run.audio_s, chapter_marks, skip_blocks). The final TTS replaces it.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/make_timing.py [--sync]          (provisional, superseded)
       .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/make_timing.py --final <tts dir>  (build 1: the measured final TTS)
"""
from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
import revoice  # noqa: E402

ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_sphere"
DRY = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/dryrun3/timing.json")


HOLD_S = 2.5


def _mmss_floor(s: float) -> str:
    """mm:ss as the skip chip shows it (cs_lib.tsx keepTime: floor of the keep sentence start)"""
    t = int(math.floor(s))
    return f"{t // 60}:{t % 60:02d}"


def _mmss_1(s: float) -> str:
    q, r = divmod(round(s, 1), 60)
    return f"{int(q)}:{r:04.1f}"


def _set_top(lines: list[str], key: str, value) -> list[str]:
    """replace the top-level block `key:` with `value` dumped as YAML; insert a missing key before `quiz_hook:`"""
    new = yaml.safe_dump({key: value}, width=150, sort_keys=False, default_flow_style=False, allow_unicode=True).rstrip("\n").split("\n")
    i0 = next((i for i, ln in enumerate(lines) if ln.startswith(f"{key}:")), None)
    if i0 is None:
        i0 = next(i for i, ln in enumerate(lines) if ln.startswith("quiz_hook:"))
        return lines[:i0] + new + lines[i0:]
    i1 = next((i for i in range(i0 + 1, len(lines)) if lines[i] and not lines[i].startswith((" ", "-", "#"))), len(lines))
    return lines[:i0] + new + lines[i1:]


def final(tts: Path) -> int:
    """FINAL mode (heavy phase, build 1): take the MEASURED final TTS (tools/tts.py output in `tts`: timing.json,
    captions.vtt/.srt; narration.wav stays on G:, git-ignored), check it (0 warnings, self-check OK, scene ids and every
    sentence text = the storyboard voiceovers) and write timing.json, en.vtt, en.srt, the storyboard's t / sentence_times /
    target_duration_s (= total + the 2.5-s end hold), chapter_marks (= scene starts), skip_blocks (chip and keep times),
    a build_1 TTS record, and the README skip table in script.md. Mirrors Part 2's make_timing.py --final."""
    sbp = OUT / "storyboard.yaml"
    sb = yaml.safe_load(sbp.read_text(encoding="utf-8"))
    tm = json.loads((tts / "timing.json").read_text(encoding="utf-8"))
    bad = []
    if tm.get("warnings"):
        bad.append(f"TTS warnings: {tm['warnings']}")
    sc_ = tm.get("self_check", {})
    if not (sc_.get("len_ok") and sc_.get("cues_ok")):
        bad.append(f"TTS self-check: {sc_}")
    if [s["id"] for s in tm["scenes"]] != [s["id"] for s in sb["scenes"]]:
        bad.append("scene ids differ between the TTS and the storyboard")
    for s, q in zip(sb["scenes"], tm["scenes"]):
        if re.sub(r"\s*\[beat\]\s*", " ", s["voiceover"]).split() != " ".join(x["text"] for x in q["sentences"]).split():
            bad.append(f"{s['id']}: spoken text differs from the storyboard voiceover")
    by = {s["id"]: s for s in tm["scenes"]}
    for b in sb["skip_blocks"]:
        ch = by[b["chip_scene"]]["sentences"][b["chip_sentence"] - 1]
        if "skip ahead" not in ch["text"]:
            bad.append(f"{b['id']}: {b['chip_scene']} S{b['chip_sentence']} has no 'skip ahead' (chip_sentence is 1-based)")
        if not by[b["skip_to_scene"]]["sentences"][0]["text"].startswith("If you skipped, here's what to keep"):
            bad.append(f"{b['id']}: {b['skip_to_scene']} S0 is not the keep line")
    if bad:
        print("FAIL", *bad, sep="\n  ")
        return 1
    total = tm["total_s"]
    (OUT / "timing.json").write_text(json.dumps(tm, indent=1, ensure_ascii=False), encoding="utf-8")
    (OUT / "en.vtt").write_bytes((tts / "captions.vtt").read_bytes())
    (OUT / "en.srt").write_bytes((tts / "captions.srt").read_bytes())
    lines = sbp.read_text(encoding="utf-8").split("\n")
    for s in tm["scenes"]:
        lines = revoice._set_block(lines, s["id"], "t", [round(s["start"], 4), round(s["end"], 4)])
        lines = revoice._set_block(lines, s["id"], "sentence_times", [[round(x["start"], 4), round(x["end"], 4)] for x in s["sentences"]])
    cm = sb["chapter_marks"]
    for c in cm:
        st = by[c["scene"]]["sentences"][0]["start"] if c["scene"] == "s00_title" else by[c["scene"]]["start"]
        c["t"], c["mmss"] = round(st, 4), _mmss_1(st)
    lines = _set_top(lines, "chapter_marks", cm)
    kb = sb["skip_blocks"]
    for b in kb:
        b["chip_t"] = round(by[b["chip_scene"]]["sentences"][b["chip_sentence"] - 1]["start"], 4)
        keep = by[b["skip_to_scene"]]["sentences"][0]["start"]
        b["skip_to_t"] = round(keep, 4)
        b["skip_to_mmss"] = _mmss_floor(keep)
        b["chip"] = f"every step · optional / skip to {_mmss_floor(keep)}"
        b["note"] = "final TTS (build 1, make_timing.py --final); the chip shows skip_to_mmss = floor of the keep sentence start (cs_lib keepTime)"
    lines = _set_top(lines, "skip_blocks", kb)
    rec = {"tool": "tools/tts.py", "run": str(tts).replace("\\", "/"), "voice": tm["voice"], "speed": tm["speed"], "audio_s": total,
           "total_frames": tm["total_frames"], "cues": tm["cues"], "warnings": tm["warnings"],
           "sentences": sum(len(s["sentences"]) for s in tm["scenes"]),
           "words": sum(len(x["text"].split()) for s in tm["scenes"] for x in s["sentences"]), "render_s": tm.get("render_s"),
           "self_check": tm.get("self_check")}
    lines = _set_top(lines, "build_1", {"tts": rec})
    txt = "\n".join(lines)
    txt = re.sub(r"(?m)^target_duration_s: .*$", f"target_duration_s: {round(total + HOLD_S, 3)}", txt, count=1)
    sbp.write_text(txt, encoding="utf-8")
    yaml.safe_load(sbp.read_text(encoding="utf-8"))  # still valid YAML
    # README skip table in script.md (### section, never spoken)
    scp = OUT / "script.md"
    st = scp.read_text(encoding="utf-8")
    for b in kb:
        pat = rf"(?m)^(\| {b['id']} \| [^|]*\| {b['chip_scene']} S{b['chip_sentence']} )\([0-9:.]+\)( \| {b['skip_to_scene']} )\([0-9:.]+(?:; chip [0-9:]+)?\)"
        st, n = re.subn(pat, lambda m: f"{m.group(1)}({_mmss_1(b['chip_t'])}){m.group(2)}({_mmss_1(b['skip_to_t'])}; chip {b['skip_to_mmss']})", st)
        if n != 1:
            print(f"WARN script README skip row {b['id']} not found")
    st = st.replace("Times below are from this dry run; the builder refills the\nchip's mm:ss from the final TTS",
                    "Times below are from the FINAL TTS (build 1,\n`make_timing.py --final`); the chip's mm:ss is")
    scp.write_text(st, encoding="utf-8")
    print(f"final timing: {len(tm['scenes'])} scenes, {rec['sentences']} sentences, {rec['words']} words, audio {total:.3f} s "
          f"({tm['total_frames']} frames; movie {total + HOLD_S:.3f} s = {_mmss_floor(total + HOLD_S)}), {tm['cues']} cues, warnings {tm['warnings']}")
    for b in kb:
        print(f"  {b['id']}: chip sentence {b['chip_scene']} S{b['chip_sentence']} at {b['chip_t']:.2f} s, skip to {b['skip_to_mmss']} ({b['skip_to_t']:.2f} s)")
    print("  chapter marks:", ", ".join(f"{c['mmss']} {c['scene']}" for c in cm))
    return 0


def main() -> int:
    if "--final" in sys.argv:
        return final(Path(sys.argv[sys.argv.index("--final") + 1]))
    sb = yaml.safe_load((OUT / "storyboard.yaml").read_text(encoding="utf-8"))
    tm = json.loads(DRY.read_text(encoding="utf-8"))
    shift = revoice.apply(tm)
    if "--sync" in sys.argv:
        revoice.sync(OUT / "storyboard.yaml", tm, target=tm["total_s"], audio_s=tm["total_s"])
        sb = yaml.safe_load((OUT / "storyboard.yaml").read_text(encoding="utf-8"))
    bad = 0
    if [s["id"] for s in tm["scenes"]] != [s["id"] for s in sb["scenes"]]:
        print("FAIL scene ids differ between dry run 3 and the storyboard")
        return 1
    for s_sb, s_tm in zip(sb["scenes"], tm["scenes"]):
        st = s_sb["sentence_times"]
        if len(st) != len(s_tm["sentences"]):
            print(f"FAIL {s_sb['id']}: {len(s_tm['sentences'])} sentences in the dry run, {len(st)} in the storyboard"); bad += 1; continue
        for j, (q, (a, b)) in enumerate(zip(s_tm["sentences"], st)):
            if abs(q["start"] - a) > 1e-3 or abs(q["end"] - b) > 1e-3:
                print(f"FAIL {s_sb['id']} S{j}: {q['start']:.3f}-{q['end']:.3f} vs storyboard {a}-{b}"); bad += 1
        vo = re.sub(r"\s*\[beat\]\s*", " ", s_sb["voiceover"]).split()
        tx = " ".join(q["text"] for q in s_tm["sentences"]).split()
        if vo != tx:
            print(f"FAIL {s_sb['id']}: text differs from the storyboard voiceover"); bad += 1
    if abs(tm["total_s"] - sb["target_duration_s"]) > 1e-3:
        print(f"FAIL total {tm['total_s']} vs storyboard {sb['target_duration_s']}"); bad += 1
    if bad:
        print(f"make_timing: {bad} failure(s); timing.json NOT written")
        return 1
    keep = {k: tm[k] for k in ("voice", "speed", "fps", "sample_rate", "gaps", "scenes", "total_s", "total_frames", "cues", "warnings")}
    keep["provisional"] = ("copied from the measured dry run 3 (G:/.../ch00_coordinates_sphere/dryrun3) by checks/make_timing.py; "
                           f"{len(tm.get('estimated_sentences', []))} re-voiced sentences ESTIMATED (calc & sync audit #5c, checks/revoice.py; shift {shift:+.3f} s); "
                           "the final TTS replaces it")
    keep["estimated_sentences"] = tm.get("estimated_sentences", [])
    (OUT / "timing.json").write_text(json.dumps(keep, indent=1, ensure_ascii=False), encoding="utf-8")
    n = sum(len(s["sentences"]) for s in tm["scenes"])
    print(f"make_timing: {len(tm['scenes'])} scenes, {n} sentences, total {tm['total_s']:.3f} s ({tm['total_frames']} frames); "
          f"every sentence time = storyboard to 1 ms; texts = storyboard voiceovers")
    return 0


if __name__ == "__main__":
    sys.exit(main())
