"""Provisional timing.json for ch00_coordinates_storm (#5b, Part 2) from the MEASURED dry run 6 (no new TTS).

dryrun6 (G:/.../scratch/movies/ch00_coordinates_storm/dryrun6/timing.json, tools/tts.py, af_bella x 1.0) is the whole movie.
Every storyboard sentence whose text equals a dry-run sentence of the same scene keeps its MEASURED clip length; a sentence
that was rewritten in the light phase (2026-11-05: s19 S1, s20 S12, s21 S5, s23 S5, s30 S0/S6/S7) gets an ESTIMATED length at
142 words per minute (marked "estimated": true). Times are then recomposed with tools/tts.py's gaps (0.35 s between
sentences, 1.5 s after a [beat], 0.8 s between scenes, 0.3 s lead-in and tail). The script writes
movies/ch00/ch00_coordinates_storm/timing.json (marked provisional) and the storyboard's t / sentence_times /
target_duration_s (target = total + the 2.5-s end hold), and checks that the scene texts equal the storyboard voiceovers.
The final TTS (heavy phase) replaces it; the scene components re-time themselves (SS/SE/AT/SSP read the text).

FINAL mode (heavy phase, 2026-11-05): ``--final <tts dir>`` takes the MEASURED final TTS (tools/tts.py output: timing.json,
captions.vtt/.srt; narration.wav stays on G:, git-ignored), checks it (0 warnings, self-check OK, scene ids and every sentence
text equal to the storyboard voiceovers), and writes movies/ch00/ch00_coordinates_storm/{timing.json, en.vtt, en.srt}, the
storyboard's t / sentence_times / target_duration_s (= total + the 2.5-s end hold), the maths-skip chip times (maths_skip:
chip_on / skip_to_s / skip_to / chip, from the keep sentences), the chapter marks (scene starts), a build_1 TTS record, and
the skip table in the script README.

usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/make_timing.py            # provisional (dry run 6)
       .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/make_timing.py --final <tts dir>
"""
from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_storm"
RUN = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/dryrun6/timing.json")
FPS = 30
WPM = 142.0
GAP_SENT, GAP_BEAT, GAP_SCENE, LEAD, TAIL = 0.35, 1.5, 0.8, 0.3, 0.3
HOLD_S = 2.5


def sentences(par: str) -> list[str]:
    """= tools/tts.py::sentences"""
    par = re.sub(r"\s+", " ", par.strip())
    parts = re.split(r"(?<=[.!?])\s+(?=[A-Z0-9\"'(])|(?<=\[beat\])\s+", par, flags=re.I)
    return [s.strip() for s in parts if s.strip()]


def set_block(lines: list[str], sid: str, key: str, value) -> list[str]:
    s = yaml.safe_dump({key: value}, width=150, sort_keys=False, default_flow_style=False)
    new = ["  " + ln for ln in s.rstrip("\n").split("\n")]
    i0 = lines.index(f"- id: {sid}")
    i1 = next((i for i in range(i0 + 1, len(lines)) if lines[i].startswith("- id: ") or (lines[i].strip() and not lines[i].startswith(" "))), len(lines))
    ks = next(i for i in range(i0 + 1, i1) if re.match(rf"^  {key}:", lines[i]))
    ke = next((i for i in range(ks + 1, i1) if re.match(r"^  [a-z_]+:", lines[i])), i1)
    return lines[:ks] + new + lines[ke:]


def mmss(s: float) -> str:
    """mm:ss as the skip chip shows it (cs_lib.tsx keepTime: floor of the sentence start)"""
    t = int(math.floor(s))
    return f"{t // 60}:{t % 60:02d}"


def set_top(lines: list[str], key: str, value) -> list[str]:
    """replace the top-level block `key:` (up to the next top-level key) with `value` dumped as YAML; insert a missing key
    before `conventions:`"""
    new = yaml.safe_dump({key: value}, width=150, sort_keys=False, default_flow_style=False, allow_unicode=True).rstrip("\n").split("\n")
    i0 = next((i for i, ln in enumerate(lines) if ln.startswith(f"{key}:")), None)
    if i0 is None:
        i0 = next(i for i, ln in enumerate(lines) if ln.startswith("conventions:"))
        return lines[:i0] + new + lines[i0:]
    i1 = next((i for i in range(i0 + 1, len(lines)) if lines[i] and not lines[i].startswith((" ", "-", "#"))), len(lines))
    return lines[:i0] + new + lines[i1:]


SKIP = {"B1": ("s03_tip_on_circle", 0, "s08_product_rule"), "B2": ("s08_product_rule", 1, "s13_acceleration_numbers")}  # intro scene, intro sentence, target


def final(tts: Path) -> int:
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
    if bad:
        print("FAIL", *bad, sep="\n  ")
        return 1
    total = tm["total_s"]
    (OUT / "timing.json").write_text(json.dumps(tm, indent=1, ensure_ascii=False), encoding="utf-8")
    (OUT / "en.vtt").write_bytes((tts / "captions.vtt").read_bytes())
    (OUT / "en.srt").write_bytes((tts / "captions.srt").read_bytes())
    by = {s["id"]: s for s in tm["scenes"]}
    lines = sbp.read_text(encoding="utf-8").split("\n")
    for s in tm["scenes"]:
        lines = set_block(lines, s["id"], "t", [round(s["start"], 4), round(s["end"], 4)])
        lines = set_block(lines, s["id"], "sentence_times", [[round(x["start"], 4), round(x["end"], 4)] for x in s["sentences"]])
    ms = sb["maths_skip"]
    for b in ms:
        sid, j, tgt = SKIP[b["block"]]
        keep = by[tgt]["sentences"][0]
        if not keep["text"].startswith("If you skipped, here's what to keep:"):
            print(f"FAIL {tgt} S0 is not the keep line")
            return 1
        b["chip_on"] = round(by[sid]["sentences"][j]["start"], 4)
        b["skip_to_s"] = round(keep["start"], 4)
        b["skip_to"] = f"{mmss(keep['start'])} (final TTS)"
        b["chip"] = f"every step · optional / skip to {mmss(keep['start'])}"
    lines = set_top(lines, "maths_skip", ms)
    cm = sb["chapter_marks"]
    for c in cm:
        st = by[c["scene"]]["start"]
        c["t"], c["t_s"] = ("0:00" if c["scene"] == "s00_title" else mmss(st)), round(st, 4)
    lines = set_top(lines, "chapter_marks", cm)
    rec = {"tool": "tools/tts.py", "run": str(tts).replace("\\", "/"), "voice": tm["voice"], "speed": tm["speed"], "audio_s": total,
           "total_frames": tm["total_frames"], "cues": tm["cues"], "warnings": tm["warnings"],
           "sentences": sum(len(s["sentences"]) for s in tm["scenes"]),
           "words": sum(len(x["text"].split()) for s in tm["scenes"] for x in s["sentences"]), "render_s": tm.get("render_s"),
           "self_check": tm.get("self_check")}
    lines = set_top(lines, "build_1", {"tts": rec})
    txt = "\n".join(lines)
    txt = re.sub(r"(?m)^target_duration_s: .*$", f"target_duration_s: {round(total + HOLD_S, 3)}", txt, count=1)
    sbp.write_text(txt, encoding="utf-8")
    yaml.safe_load(sbp.read_text(encoding="utf-8"))  # still valid YAML
    # the script README's skip table (a ### section: never spoken)
    scp = OUT / "script.md"
    st = scp.read_text(encoding="utf-8")
    for b in ms:
        sid, j, tgt = SKIP[b["block"]]
        pat = rf"(?m)^(\| {b['block']} \| [^|]*\| )\d+:\d\d( \({sid}\) \| )\d+:\d\d( \({tgt} S0\) \|)"
        st, n = re.subn(pat, lambda m: f"{m.group(1)}{mmss(by[sid]['start'])}{m.group(2)}{mmss(by[tgt]['sentences'][0]['start'])}{m.group(3)}", st)
        if n != 1:
            print(f"WARN script README skip row {b['block']} not found")
    st = st.replace("The mm:ss below are from this dry run; **refill after the\nfinal TTS**", "The mm:ss below are from the FINAL TTS\n(build 1, `make_timing.py --final`)")
    scp.write_text(st, encoding="utf-8")
    print(f"final timing: {len(tm['scenes'])} scenes, {rec['sentences']} sentences, {rec['words']} words, audio {total:.3f} s "
          f"({tm['total_frames']} frames; movie {total + HOLD_S:.3f} s = {mmss(total + HOLD_S)}), {tm['cues']} cues, warnings {tm['warnings']}")
    for b in ms:
        print(f"  {b['block']}: chip on {b['chip_on']:.2f} s, skip to {b['skip_to']} ({b['skip_to_s']:.2f} s)")
    print("  chapter marks:", ", ".join(f"{c['t']} {c['scene']}" for c in cm))
    return 0


def main() -> int:
    if "--final" in sys.argv:
        return final(Path(sys.argv[sys.argv.index("--final") + 1]))
    sbp = OUT / "storyboard.yaml"
    sb = yaml.safe_load(sbp.read_text(encoding="utf-8"))
    tm = json.loads(RUN.read_text(encoding="utf-8"))
    if [s["id"] for s in tm["scenes"]] != [s["id"] for s in sb["scenes"]]:
        print("FAIL scene ids differ between dryrun6 and the storyboard")
        return 1
    t = LEAD
    scenes, est = [], []
    for si, (s, q) in enumerate(zip(sb["scenes"], tm["scenes"])):
        measured = {x["text"]: x["dur"] for x in q["sentences"]}
        srec = {"id": s["id"], "start": round(t, 4), "sentences": []}
        sents = sentences(s["voiceover"])
        for k, raw in enumerate(sents):
            beat = "[beat]" in raw
            txt = re.sub(r"\s*\[beat\]\s*", " ", raw).strip()
            if txt in measured:
                dur, e = measured[txt], False
            else:
                dur, e = round(len(txt.split()) / WPM * 60.0, 4), True
                est.append(f"{s['id']} S{k}: {len(txt.split())} words → {dur:.2f} s")
            start, end = t, t + dur
            srec["sentences"].append({"text": txt, "audio_text": None, "start": round(start, 4), "end": round(end, 4), "dur": round(dur, 4),
                                      "start_frame": round(start * FPS), "end_frame": round(end * FPS), **({"beat": True} if beat else {}),
                                      **({"estimated": True} if e else {})})
            last = k == len(sents) - 1
            gap = (GAP_SCENE if si < len(sb["scenes"]) - 1 else TAIL) if last else GAP_SENT
            t = end + (max(gap, GAP_BEAT) if beat else gap)
        srec["end"] = round(t, 4)
        srec["start_frame"], srec["end_frame"] = round(srec["start"] * FPS), round(srec["end"] * FPS)
        scenes.append(srec)
        vo = re.sub(r"\s*\[beat\]\s*", " ", s["voiceover"]).split()
        if vo != " ".join(x["text"] for x in srec["sentences"]).split():
            print(f"FAIL {s['id']}: text differs from the storyboard voiceover")
            return 1
    total = round(t, 4)
    keep = {k: tm[k] for k in ("voice", "speed", "fps", "sample_rate", "gaps")}
    keep["scenes"] = scenes
    keep["total_s"] = total
    keep["provisional"] = ("dry run 6 (G:/.../ch00_coordinates_storm/dryrun6) measured clip lengths, recomposed by checks/make_timing.py; sentences "
                           f"rewritten in the light phase 2026-11-05 are ESTIMATED at {WPM:.0f} wpm ('estimated': true); the final TTS (heavy phase) replaces it")
    keep["total_frames"] = int(math.ceil(round(total * FPS, 6)))
    (OUT / "timing.json").write_text(json.dumps(keep, indent=1, ensure_ascii=False), encoding="utf-8")
    # the storyboard's times follow
    lines = sbp.read_text(encoding="utf-8").split("\n")
    for s in scenes:
        lines = set_block(lines, s["id"], "t", [s["start"], s["end"]])
        lines = set_block(lines, s["id"], "sentence_times", [[x["start"], x["end"]] for x in s["sentences"]])
    txt = "\n".join(lines)
    txt = re.sub(r"(?m)^target_duration_s: .*$", f"target_duration_s: {round(total + HOLD_S, 3)}", txt, count=1)
    sbp.write_text(txt, encoding="utf-8")
    n = sum(len(s["sentences"]) for s in scenes)
    print(f"make_timing: {len(scenes)} scenes, {n} sentences ({len(est)} estimated at {WPM:.0f} wpm), total {total:.3f} s "
          f"({keep['total_frames']} frames; was {tm['total_s']:.3f}); storyboard t / sentence_times / target_duration_s {round(total + HOLD_S, 3)} written")
    for e_ in est:
        print("  estimated", e_)
    return 0


if __name__ == "__main__":
    sys.exit(main())
