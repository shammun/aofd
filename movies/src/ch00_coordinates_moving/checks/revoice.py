"""Estimated timing for the sentences re-voiced by the calculation & sync audit (2026-11-05), WITHOUT a new TTS run.

The provisional timing of this part comes from a measured dry run (see make_timing.py). The audit changed a few sentences;
until the final TTS (heavy phase) runs, each changed sentence keeps its measured start and gets an ESTIMATED clip length
= measured clip length x (new characters / old characters) (Kokoro's rate inside one sentence); every later sentence, scene
end and the total shift by the difference. make_timing.py applies `apply()` to the dry run before its checks, so the
composition (SS/SE/AT read timing.json's text) and the storyboard stay in step. `sync()` writes the estimated times into the
storyboard (scene t, sentence_times, target_duration_s, dry_run.audio_s, chapter_marks, skip_blocks); it is idempotent
because it always starts again from the dry run. The final TTS replaces all of this.

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
    "s00_title": {0: ("In this video, we'll learn moving frames the easy way, and see how meteorology uses them to understand a moving storm's winds, and what a barometer sees as the storm passes.",
                    "In this video, we'll learn moving frames, and see how meteorology uses them to understand a moving storm's winds, and what a barometer sees as the storm passes.")},
    # E2 (optional narration taken): the true values 13.54 and 3.54 (3.54 x 3.6 = 12.7 and 13.54 x 3.6 = 48.7 then agree with the voice)
    "s07_sliding_pattern": {
        2: ("Take one moment, at a place where the wind is thirteen and a half metres per second, and is getting stronger towards the east by zero point one one one metres per second for every kilometre.",
            "Take one moment, at a place where the wind is thirteen point five four metres per second, and is getting stronger towards the east by zero point one one one metres per second for every kilometre."),
        5: ("Relative to you, the air at that place moves east at thirteen and a half minus ten: three and a half metres per second, or twelve point seven kilometres per hour.",
            "Relative to you, the air at that place moves east at thirteen point five four minus ten: three point five four metres per second, or twelve point seven kilometres per hour."),
    },
    # Part 1 lessons E1 (2026-11-05): the skip lead-in says the steps are not needed for weather, climate or maps
    's04_velocities_add': {2: ('If not, skip ahead to the time on screen.',
                          "If not, skip ahead to the time on screen: you don't need them for the intuition of weather, climate or maps.")},
    # Part 1 lessons E1 (2026-11-05): the skip lead-in says the steps are not needed for weather, climate or maps
    's14_tau_derive': {2: ("They're for anyone who wants every step, so skip ahead to the time on screen if you'd rather go straight to the numbers.",
                      "They're for anyone who wants every step and aren't needed for the intuition of weather, climate or maps, so skip ahead to the time on screen if you'd rather go straight to the numbers.")},
}
EXTRA_TEXT: dict = {}


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
