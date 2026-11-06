"""Estimated timing for the sentences of ch00_coordinates_routes (#5f, Part 6) re-voiced by the Part 1 lessons pass (2026-11-05),
WITHOUT a new TTS run. Copied from Part 3's checks/revoice.py (apply / sync / apply_text unchanged).

The provisional timing of this part comes from the measured dry run (dryrun2_spliced, see make_timing.py). Each changed sentence keeps
its measured start and gets an ESTIMATED clip length = measured length x (new characters / old characters); every later sentence,
scene end and the total shift by the difference. make_timing.py applies `apply()` before its checks; `--sync` writes the estimated
times into the storyboard (scene t, sentence_times, target_duration_s, dry_run.audio_s, chapter_marks, maths_skip). The final TTS
replaces all of this.

REVOICE = {scene_id: {sentence index: (old text, new text)}}; an old text that does not match the dry run is an error.
"""
from __future__ import annotations

import bisect
import math
import re
from pathlib import Path

import yaml

FPS = 30

REVOICE: dict[str, dict[int, tuple[str, str]]] = {
    # House style 2026-11-06 (user): never say 'the easy way'; the title promise pulses on the concept words instead
    "s00_title": {0: ("In this video, we'll learn about routes across our round Earth the easy way, and see how meteorology and aviation use them to plan the shortest flights.",
                    "In this video, we'll learn about routes across our round Earth, and see how meteorology and aviation use them to plan the shortest flights.")},
    # Part 1 lessons A6 (2026-11-05): one rounding everywhere. The row said 78.74 x 0.01745 ~ 1.3742, but that product is 1.3740; the
    # exact angle 78.738 deg times pi/180 gives 1.37424. The voice now says which exact angle is used (as Part 1's 53.2301 deg row).
    "s10_distance": {
        2: ("So seventy eight point seven four degrees is seventy eight point seven four times zero point zero one seven four five, about one point three seven four two radians.",
            "So seventy eight point seven four degrees, or more exactly seventy eight point seven three eight, times pi over a hundred and eighty, is about one point three seven four two radians."),
        # the quick check gave 78.74 x 111.2 = 8755.9, said "again about 8755"; now said as it is, with the rounding named
        5: ("Let's check it the quick way: seventy eight point seven four degrees, times a hundred and eleven point two kilometres per degree, is again about eight thousand seven hundred and fifty five kilometres.",
            "Let's check it the quick way: seventy eight point seven four degrees, times a hundred and eleven point two kilometres per degree, is about eight thousand seven hundred and fifty six kilometres, the same to within the rounding."),
    },
}
# text already in script.md / storyboard.yaml that is not the dry run's (none)
EXTRA_TEXT: dict[str, list[tuple[str, str]]] = {}

def apply(tm: dict, revoice: dict | None = None) -> float:
    """re-time `tm` (tools/tts.py timing dict, absolute times) in place; return the total shift in seconds"""
    rv = REVOICE if revoice is None else revoice
    seen = set()
    shift = 0.0
    for sc in tm["scenes"]:
        sc["start"] = round(sc["start"] + shift, 4)
        for j, q in enumerate(sc["sentences"]):
            q["start"] = round(q["start"] + shift, 4)
            q["end"] = round(q["end"] + shift, 4)
            if sc["id"] in rv and j in rv[sc["id"]]:
                old, new = rv[sc["id"]][j]
                if q["text"] != old:
                    raise SystemExit(f"revoice: {sc['id']} S{j} text is not the expected old text:\n  {q['text']}\n  {old}")
                dur = q["end"] - q["start"]
                nd = round(dur * len(new) / len(old), 4)
                q["end"] = round(q["start"] + nd, 4)
                q["text"], q["audio_text"], q["estimated"] = new, None, True
                shift += nd - dur
                seen.add((sc["id"], j))
            q["dur"] = round(q["end"] - q["start"], 4)
            q["start_frame"], q["end_frame"] = round(q["start"] * FPS), round(q["end"] * FPS)
        sc["end"] = round(sc["end"] + shift, 4)
        sc["start_frame"], sc["end_frame"] = round(sc["start"] * FPS), round(sc["end"] * FPS)
    want = {(s, j) for s, d in rv.items() for j in d}
    if want - seen:
        raise SystemExit(f"revoice: not found in the dry run: {sorted(want - seen)}")
    tm["total_s"] = round(tm["total_s"] + shift, 4)
    tm["total_frames"] = int(math.ceil(tm["total_s"] * FPS - 1e-9))
    if rv:
        tm["estimated_sentences"] = [f"{s} S{j}" for s, d in rv.items() for j in sorted(d)]
    return shift


def _set_block(lines: list[str], sid: str, key: str, value) -> list[str]:
    s = yaml.safe_dump({key: value}, width=150, sort_keys=False, default_flow_style=False)
    new = ["  " + ln for ln in s.rstrip("\n").split("\n")]
    i0 = lines.index(f"- id: {sid}")
    i1 = next((i for i in range(i0 + 1, len(lines)) if lines[i].startswith("- id: ") or (lines[i].strip() and not lines[i].startswith(" "))), len(lines))
    ks = next(i for i in range(i0 + 1, i1) if re.match(rf"^  {key}:", lines[i]))
    ke = next((i for i in range(ks + 1, i1) if re.match(r"^  [a-z_]+:", lines[i])), i1)
    return lines[:ks] + new + lines[ke:]


def _mmss(t: float) -> str:
    m, s = divmod(t, 60)
    return f"{int(m)}:{s:04.1f}"


def sync(sb_path: Path, tm: dict, target: float, audio_s: float | None = None) -> None:
    """write the estimated times of `tm` into the storyboard (line-based: comments and layout kept)"""
    sb = yaml.safe_load(sb_path.read_text(encoding="utf-8"))
    by = {s["id"]: s for s in tm["scenes"]}
    lines = sb_path.read_text(encoding="utf-8").split("\n")
    for s in tm["scenes"]:
        lines = _set_block(lines, s["id"], "t", [round(s["start"], 4), round(s["end"], 4)])
        lines = _set_block(lines, s["id"], "sentence_times", [[round(q["start"], 4), round(q["end"], 4)] for q in s["sentences"]])
    txt = "\n".join(lines)

    # chapter marks and skip chips (blocks chapter_marks / skip_blocks / skip_guidance / maths_skip): every time is moved by the shift of
    # the last sentence that starts at or before it (old = the storyboard's sentence times before this sync, so a second sync is a no-op);
    # seconds fields keep their number format, mm:ss strings keep theirs ("9:03" floor, "0:00.3" one decimal)
    old = [a for x in sb["scenes"] for a, _ in x["sentence_times"]]
    new = [q["start"] for x in tm["scenes"] for q in x["sentences"]]
    if len(old) != len(new):
        raise SystemExit("revoice.sync: sentence counts differ between the storyboard and the timing")

    def remap(t: float) -> float:
        i = bisect.bisect_right(old, t + 1e-6) - 1
        return t + (new[i] - old[i]) if i >= 0 else t

    def mm(mt: re.Match) -> str:
        m_, s_, d_ = int(mt.group(1)), int(mt.group(2)), mt.group(3)
        if d_:
            t = remap(m_ * 60 + s_ + float(d_))
            q, r = divmod(round(t, 1), 60)
            return f"{int(q)}:{r:04.1f}"
        t = remap(m_ * 60 + s_ + 0.5)
        q, r = divmod(int(math.floor(t)), 60)
        return f"{q}:{r:02d}"

    keys = r"(?:t|t_s|chip_t|skip_to_t|chip_at_s|skip_to_s|chip_on)"
    lines = txt.split("\n")
    for blk in ("chapter_marks", "skip_blocks", "skip_guidance", "maths_skip"):
        i0 = next((i for i, ln in enumerate(lines) if ln.startswith(f"{blk}:")), None)
        if i0 is None:
            continue
        i1 = next((i for i in range(i0 + 1, len(lines)) if lines[i] and not lines[i].startswith((" ", "-", "#"))), len(lines))
        for i in range(i0 + 1, i1):
            m = re.match(rf"^(\s*(?:- )?{keys}: )([0-9]+(?:\.[0-9]+)?)\s*$", lines[i])
            if m:
                lines[i] = m.group(1) + str(round(remap(float(m.group(2))), 4))
            else:
                lines[i] = re.sub(r"(?<![\d.:])(\d{1,2}):(\d\d)(\.\d)?(?![\d:])", mm, lines[i])
    txt = "\n".join(lines)
    txt = re.sub(r"(?m)^target_duration_s: .*$", f"target_duration_s: {round(target, 4)}", txt, count=1)
    if audio_s is not None:
        i = txt.index("\ndry_run:")
        m = re.compile(r"^(  audio_s: ).*$", re.M).search(txt, i)
        txt = txt[:m.start()] + m.group(1) + str(round(audio_s, 4)) + txt[m.end():]
    sb_path.write_text(txt, encoding="utf-8")
    yaml.safe_load(sb_path.read_text(encoding="utf-8"))


def _flex(old: str) -> str:
    """regex for `old` with any whitespace run (incl. YAML line breaks) matching any whitespace run"""
    return r"\s+".join(re.escape(w) for w in old.split())


def apply_text(script_md: Path, sb_path: Path, revoice: dict | None = None, extra: dict | None = None) -> list[str]:
    """write the new sentences into script.md (in place, whitespace-flexible) and the storyboard voiceovers (re-dumped).
    `extra` = {scene_id: [(old, new)]} for text that is in the files but not in the dry run (e.g. an earlier partial edit)."""
    rv = REVOICE if revoice is None else revoice
    log = []
    md = script_md.read_text(encoding="utf-8")
    lines = sb_path.read_text(encoding="utf-8").split("\n")
    sb = yaml.safe_load("\n".join(lines))
    vo = {s["id"]: s["voiceover"] for s in sb["scenes"]}
    pairs = {sid: [(o, n) for _, (o, n) in sorted(d.items())] for sid, d in rv.items()}
    for sid, lst in (extra or {}).items():
        pairs.setdefault(sid, []).extend(lst)
    for sid, lst in pairs.items():
        v = vo[sid]
        for old, new in lst:
            for what in ("script", "storyboard"):
                txt = md if what == "script" else v
                if new in re.sub(r"\s+", " ", txt):
                    log.append(f"{sid} {what}: already new")
                    continue
                txt2, n = re.subn(_flex(old), lambda m: new, txt, count=1)
                log.append(f"{sid} {what}: {'replaced' if n else 'NOT FOUND'}: {old[:60]}")
                if what == "script":
                    md = txt2
                else:
                    v = txt2
        if v != vo[sid]:
            lines = _set_block(lines, sid, "voiceover", re.sub(r"\s+", " ", v).strip())
    script_md.write_text(md, encoding="utf-8")
    sb_path.write_text("\n".join(lines), encoding="utf-8")
    yaml.safe_load(sb_path.read_text(encoding="utf-8"))
    return log
