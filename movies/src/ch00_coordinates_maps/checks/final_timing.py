"""ch00_coordinates_maps (#5g) REMAKE 2026-11-07: install the FINAL (spliced) narration timing; re-segment the caption cues.
(= Part 4's checks/final_timing.py, adapted to Part 7's storyboard (= Part 6's): `maths_skip.blocks` + top-level `chapter_marks`, no per-scene `measured`.)

--final <tts dir>  (mp_r7_splice.py output: timing.json, captions.vtt/.srt; narration.wav stays on G:, git-ignored): checks it (0 warnings,
    self-check OK, scene ids and every sentence text equal to the storyboard voiceovers) and writes movies/ch00/ch00_coordinates_maps/
    {timing.json, en.vtt, en.srt}, the storyboard's t / sentence_times / target_duration_s (= total + the 2.5-s hold), the maths-skip chip
    and skip-to times (the "skip ahead" sentence; the keep lines are the FIRST sentences of s06 and s12), the chapter marks, and a build record.
--recue [--write]  (= Part 2's make_timing.py --recue): rebuild the cues from timing.json with tools/tts.py's split / wrap, merging a short
    cue only WITHIN its sentence; audio, sentence times and words unchanged.

checks/make_timing.py (the provisional path from the dry runs) is kept for the record; after the remake it no longer applies.
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_maps/checks/final_timing.py --final <dir> | --recue [--write]
"""
from __future__ import annotations

import json
import math
import re
import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
from revoice import _set_block  # noqa: E402

ROOT = Path(__file__).resolve().parents[4]
OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_maps"
FPS, HOLD_S = 30, 2.5


def mmss(s: float) -> str:
    t = int(math.floor(s))
    return f"{t // 60}:{t % 60:02d}"


def set_top(lines: list[str], key: str, value) -> list[str]:
    new = yaml.safe_dump({key: value}, width=150, sort_keys=False, default_flow_style=False, allow_unicode=True).rstrip("\n").split("\n")
    i0 = next((i for i, ln in enumerate(lines) if ln.startswith(f"{key}:")), None)
    if i0 is None:
        i0 = next(i for i, ln in enumerate(lines) if ln.startswith("conventions:"))
        return lines[:i0] + new + lines[i0:]
    i1 = next((i for i in range(i0 + 1, len(lines)) if lines[i] and not lines[i].startswith((" ", "-", "#"))), len(lines))
    return lines[:i0] + new + lines[i1:]


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
        lines = _set_block(lines, s["id"], "t", [round(s["start"], 4), round(s["end"], 4)])
        lines = _set_block(lines, s["id"], "sentence_times", [[round(x["start"], 4), round(x["end"], 4)] for x in s["sentences"]])
    ms = sb["maths_skip"]
    for b in ms["blocks"]:
        cs, ts = by[b["chip_scene"]], by[b["skip_to_scene"]]
        j = next(i for i, x in enumerate(cs["sentences"]) if "skip ahead" in x["text"])
        keep = ts["sentences"][0]
        if not keep["text"].startswith("If you skipped"):
            print(f"FAIL {b['skip_to_scene']}: first sentence is not the keep line")
            return 1
        b["chip_on"] = f"AT({j}, 'skip ahead') in {b['chip_scene']} (at {mmss(cs['sentences'][j]['start'])})"
        b["skip_to_t"] = round(ts["start"], 4)
        b["skip_to_mmss"] = f"{mmss(ts['start'])} (final splice r7)"
        b["keep_line"] = f"S0 of {b['skip_to_scene']}"
    lines = set_top(lines, "maths_skip", ms)
    cm = sb["chapter_marks"]
    for c in cm:
        c["t"], c["mmss"] = round(by[c["scene"]]["start"], 4), mmss(by[c["scene"]]["start"])
    lines = set_top(lines, "chapter_marks", cm)
    words = sum(len(x["text"].split()) for s in tm["scenes"] for x in s["sentences"])
    rec = {"tool": "movies/src/ch00_coordinates_maps/checks/mp_r7_splice.py", "run": str(tts).replace("\\", "/"), "voice": tm["voice"], "speed": tm["speed"],
           "audio_s": total, "with_hold_s": round(total + HOLD_S, 3), "total_frames": tm["total_frames"], "cues": tm["cues"], "warnings": tm["warnings"],
           "sentences": sum(len(s["sentences"]) for s in tm["scenes"]), "words": words, "words_per_minute_overall": round(words / ((total + HOLD_S) / 60), 1),
           "self_check": {k: v for k, v in tm.get("self_check", {}).items() if k != "spliced_r7"},
           "splice": {k: v for k, v in tm.get("self_check", {}).get("spliced_r7", {}).items() if k != "replaced"}}
    lines = set_top(lines, "final_tts", rec)
    txt = "\n".join(lines)
    txt = re.sub(r"(?m)^target_duration_s: .*$", f"target_duration_s: {round(total + HOLD_S, 3)}", txt, count=1)
    sbp.write_text(txt, encoding="utf-8")
    yaml.safe_load(sbp.read_text(encoding="utf-8"))
    print(f"final timing: {len(tm['scenes'])} scenes, {rec['sentences']} sentences, {words} words ({rec['words_per_minute_overall']} wpm), audio {total:.3f} s "
          f"({tm['total_frames']} frames; movie {total + HOLD_S:.3f} s = {mmss(total + HOLD_S)}), {tm['cues']} cues, warnings {tm['warnings']}")
    for b in ms["blocks"]:
        print(f"  skip block: chip {b['chip_on']}, skip to {b['skip_to_mmss']} ({b['skip_to_scene']} S0)")
    return 0


NUMW = set("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen "
           "twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million point".split())


def isnum(w: str) -> bool:
    return w.lower().strip(",.;:!?") in NUMW


def splits_number(L_: list[str], R_: list[str]) -> bool:
    """True when the boundary between word lists L_ | R_ falls inside one spoken number (a comma ends a number)"""
    if not L_ or not R_:
        return False
    a, b = L_[-1], R_[0]
    if re.search(r"[,;:.]$", a):
        return False
    al = a.lower()
    if isnum(b) and (isnum(a) or al == "minus" or (al == "and" and len(L_) > 1 and isnum(L_[-2]))):
        return True
    return isnum(a) and b.lower() == "and" and len(R_) > 1 and isnum(R_[1])


def recue(write: bool) -> int:
    """= Part 2 make_timing.recue (short cues merged within their sentence only)"""
    import types
    sys.modules.setdefault("soundfile", types.ModuleType("soundfile"))
    sys.path.insert(0, str(ROOT / "tools"))
    import tts as T  # noqa: N812
    tm = json.loads((OUT / "timing.json").read_text(encoding="utf-8"))
    cues: list[list] = []
    sents = [x for s in tm["scenes"] for x in s["sentences"]]
    for si, x in enumerate(sents):
        sent, dur, start = x["text"], x["end"] - x["start"], x["start"]   # Part 7: end - start (the 4-dp rounded dur can overshoot end by 1e-4)
        parts = T.split_for_cues(sent, dur)
        n = sum(len(p) for p in parts)
        c0, mine = start, []
        for p in parts:
            c1 = c0 + dur * len(p) / n
            mine.append([c0, c1, p, si])
            c0 = c1
        i = 0
        while i < len(mine):
            a = mine[i]
            if a[1] - a[0] >= T.CUE_MIN or len(mine) == 1:
                i += 1
                continue
            if i + 1 < len(mine) and len(T.wrap(a[2] + " " + mine[i + 1][2])) <= T.MAX_LINES:
                mine[i:i + 2] = [[a[0], mine[i + 1][1], a[2] + " " + mine[i + 1][2], si]]
                continue
            if i > 0 and len(T.wrap(mine[i - 1][2] + " " + a[2])) <= T.MAX_LINES:
                mine[i - 1:i + 1] = [[mine[i - 1][0], a[1], mine[i - 1][2] + " " + a[2], si]]
                i -= 1
                continue
            j = i + 1 if i + 1 < len(mine) else i - 1
            lo, hi = min(i, j), max(i, j)
            words = (mine[lo][2] + " " + mine[hi][2]).split()
            t0, t1 = mine[lo][0], mine[hi][1]
            best = None
            for kk in range(1, len(words)):
                l_, r_ = " ".join(words[:kk]), " ".join(words[kk:])
                if len(T.wrap(l_)) > T.MAX_LINES or len(T.wrap(r_)) > T.MAX_LINES:
                    continue
                score = abs(len(l_) - len(r_)) - (10 if re.search(r"[,;:]$", l_) else 0)
                if best is None or score < best[0]:
                    best = (score, l_, r_)
            if best is None:
                print(f"FAIL sentence {si}: cannot rebalance the short cue {a[2]!r}")
                return 1
            _, l_, r_ = best
            tc = t0 + (t1 - t0) * len(l_) / (len(l_) + len(r_))
            mine[lo:hi + 1] = [[t0, tc, l_, si], [tc, t1, r_, si]]
            i = lo + 2
        # coordinator rule 2026-11-07: no cue boundary inside a spoken number ("zero point six / six two", "minus / thirty one", "three
        # hundred and / twenty nine"): move the boundary to the number's start (or its end) when both cues still wrap in 2 x 42
        q = 0
        while q + 1 < len(mine):
            L_, R_ = mine[q][2].split(), mine[q + 1][2].split()
            if splits_number(L_, R_):
                words = L_ + R_
                cut0 = len(L_)
                s0 = cut0
                while s0 > 0 and (isnum(words[s0 - 1]) or words[s0 - 1].lower().strip(",.;:") in ("minus", "and")):
                    s0 -= 1
                e0 = cut0
                while e0 < len(words) and (isnum(words[e0]) or (words[e0].lower() == "and" and e0 + 1 < len(words) and isnum(words[e0 + 1]))):
                    e0 += 1
                fixed = False
                for kk in (s0, e0):
                    l_, r_ = " ".join(words[:kk]), " ".join(words[kk:])
                    if l_ and r_ and len(T.wrap(l_)) <= T.MAX_LINES and len(T.wrap(r_)) <= T.MAX_LINES:
                        t0, t1 = mine[q][0], mine[q + 1][1]
                        tc = t0 + (t1 - t0) * len(l_) / (len(l_) + len(r_))
                        mine[q:q + 2] = [[t0, tc, l_, si], [tc, t1, r_, si]]
                        fixed = True
                        break
                if not fixed:
                    print(f"FAIL sentence {si}: cannot keep the number whole across {mine[q][2]!r} | {mine[q + 1][2]!r}")
                    return 1
            q += 1
        cues += mine
    bad = []
    for k_ in range(len(cues) - 1):
        if cues[k_][3] == cues[k_ + 1][3] and splits_number(cues[k_][2].split(), cues[k_ + 1][2].split()):
            bad.append(f"cue {k_ + 1}/{k_ + 2} splits a number: {cues[k_][2]!r} | {cues[k_ + 1][2]!r}")
    if " ".join(c[2] for c in cues).split() != " ".join(x["text"] for x in sents).split():
        bad.append("cue words differ from the sentence words")
    for k_, c in enumerate(cues):
        x = sents[c[3]]
        if c[0] < x["start"] - 1e-6 or c[1] > x["end"] + 1e-6:
            bad.append(f"cue {k_ + 1} leaves its sentence")
        ls = T.wrap(c[2])
        if len(ls) > T.MAX_LINES or any(len(ln) > T.MAX_LINE for ln in ls):
            bad.append(f"cue {k_ + 1}: {ls}")
        d = c[1] - c[0]
        if d > T.CUE_MAX + 1e-6 or (d < T.CUE_MIN - 1e-6 and len([q for q in cues if q[3] == c[3]]) > 1):
            bad.append(f"cue {k_ + 1}: {d:.2f} s")
    if bad:
        print("FAIL", *bad, sep="\n  ")
        return 1
    old = (OUT / "en.vtt").read_text(encoding="utf-8").strip().split("\n\n")[1:] if (OUT / "en.vtt").exists() else []   # Part 7 had no captions before the remake
    oldc = [(b.split("\n")[0], " ".join(b.split("\n")[1:])) for b in old]
    newc = [(f"{T.fmt_ts(c[0], '.')} --> {T.fmt_ts(c[1], '.')}", c[2]) for c in cues]
    so, sn = set(oldc), set(newc)
    print(f"recue: {len(oldc)} cues -> {len(newc)} cues; removed {len(so - sn)}, added {len(sn - so)}")
    cps = [(c[2], len(c[2]) / (c[1] - c[0])) for c in cues if len(c[2]) / (c[1] - c[0]) > T.MAX_CPS]
    print(f"  cues above {T.MAX_CPS} cps: {len(cps)}", *[f"{v:.1f} cps {t!r}" for t, v in cps[:8]], sep="\n    ")
    if write:
        vtt, srt = ["WEBVTT", ""], []
        for i, (c0, c1, txt, _) in enumerate(cues, 1):
            ls = T.wrap(txt)
            vtt += [f"{T.fmt_ts(c0, '.')} --> {T.fmt_ts(c1, '.')}", *ls, ""]
            srt += [str(i), f"{T.fmt_ts(c0, ',')} --> {T.fmt_ts(c1, ',')}", *ls, ""]
        (OUT / "en.vtt").write_text("\n".join(vtt), encoding="utf-8")
        (OUT / "en.srt").write_text("\n".join(srt), encoding="utf-8")
        tm["cues"] = len(cues)
        tm["recue"] = "final_timing.py --recue (remake 2026-11-07): short cues merged within their sentence only; audio and words unchanged"
        (OUT / "timing.json").write_text(json.dumps(tm, indent=1, ensure_ascii=False), encoding="utf-8")
        sbp = OUT / "storyboard.yaml"
        st = sbp.read_text(encoding="utf-8")
        st = re.sub(r"(?m)^(  cues: )\d+$", lambda m: f"{m.group(1)}{len(cues)}", st, count=1)
        sbp.write_text(st, encoding="utf-8")
        print("  wrote en.vtt, en.srt, timing.json (cues)")
    return 1 if cps else 0


if __name__ == "__main__":
    if "--recue" in sys.argv:
        sys.exit(recue("--write" in sys.argv))
    if "--final" in sys.argv:
        sys.exit(final(Path(sys.argv[sys.argv.index("--final") + 1])))
    print(__doc__)
    sys.exit(2)
