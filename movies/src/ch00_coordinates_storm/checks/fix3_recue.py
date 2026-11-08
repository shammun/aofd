"""ch00_coordinates_storm (#5b) fix 3 (2026-11-08, fix2 review 2 M2 + Should 1 + Nit 5): re-cue the captions so that a spoken
vector pair ("minus zero point five one five, zero point eight five seven") or a list of numbers is never split across two cues,
and a line break never falls inside a pair that fits on one line. Captions only: no re-voice, no timing change (sentence times,
scene times and words.json are untouched; only en.vtt, en.srt and timing.json -> "cues" / "self_check" are rewritten).

Approach = Part 1's cf_fix31108_recue.py (fix 4), on top of this movie's own recue (make_timing.py --recue, fix loop 1):
one never-split-a-number predicate (make_timing.splits_number: "twenty | two", "point | four", "minus | zero", "a | hundred",
"and" beside a number word) plus the pair rule: a comma between two number words ("<number>, | <number>") is inside a pair or
list. Cue boundaries: never inside a number, never inside a pair / list. Line breaks: never inside a number; inside a pair only at
its comma and only when the pair / list itself is longer than one line (42 characters: then the comma break, one component per
line, is the only way; the cue holds the whole pair).

Only sentences whose current cues break a rule are re-segmented (every other cue keeps its text, times and line break). A
re-segmented sentence: every split of its words into 1..n+2 cues is tried; legal = every cue wraps into <= 2 lines of <= 42
characters with a legal break, no boundary inside a number / pair, 1-7 s, <= 17 cps; times stay character-proportional inside the
sentence (as tools/tts.py). A first or last cue shorter than 1 s may run into the silence before / after its sentence (never past
the neighbouring cue). Cost: distance of the cuts from the old ones + balance.

usage (repo root):  .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/fix3_recue.py [--write]
                    .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/fix3_recue.py --check   (self-check of en.vtt)
"""
from __future__ import annotations

import itertools
import json
import re
import sys
import types
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(ROOT / "tools"))
sys.modules.setdefault("soundfile", types.ModuleType("soundfile"))   # tts.py imports it at the top; not needed for cues
import make_timing as MT  # noqa: E402
import tts as T  # noqa: E402

OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_storm"
NUMW = MT.NUMW
NUMISH = NUMW | {"point", "minus", "plus", "and", "a"}


def _w(x: str) -> str:
    return re.sub(r"[^a-z]", "", x.lower())


def pair_cut(left: str, right: str) -> bool:
    """True when the cut between `left` and `right` falls at the comma of a spoken pair or list: '<number>, | <number>'."""
    lw, rw = left.split(), right.split()
    if not lw or not rw:
        return False
    return lw[-1].endswith(",") and _w(lw[-1]) in NUMW and _w(rw[0]) in NUMW | {"minus", "plus"}


def span_len(left: str, right: str) -> int:
    """length of the pair / list around a comma cut: number words walked back from the cut and forward from it"""
    lw, rw = left.split(), right.split()
    i = len(lw)
    while i > 0 and _w(lw[i - 1]) in NUMISH and not (i < len(lw) and re.search(r"[.;:!?]$", lw[i - 1])):
        i -= 1
    j = 0
    while j < len(rw) and _w(rw[j]) in NUMISH:
        j += 1
        if re.search(r"[.;:!?]$", rw[j - 1]):
            break
    while i < len(lw) and _w(lw[i]) in ("and", "a") and _w(lw[i]) not in NUMW:   # do not start the span on a bare "and"
        i += 1
    while j > 0 and _w(rw[j - 1]) in ("and", "a", "point", "minus", "plus"):
        j -= 1
    return len(" ".join(lw[i:] + rw[:j]))


def cut_bad(left: str, right: str) -> bool:
    """a cue boundary here is illegal"""
    return MT.splits_number(left, right) or pair_cut(left, right)


def line_bad(l1: str, l2: str) -> bool:
    """a line break here is illegal (a pair longer than a line may break at its comma)"""
    return MT.splits_number(l1, l2) or (pair_cut(l1, l2) and span_len(l1, l2) <= T.MAX_LINE)


def wrap_ok(lines: list[str]) -> bool:
    return (len(lines) <= T.MAX_LINES and all(len(x) <= T.MAX_LINE for x in lines)
            and not (len(lines) == 2 and line_bad(lines[0], lines[1])))


def wrap3(text: str) -> list[str] | None:
    """<= 2 legal lines (the scoring of make_timing's wrap_num); None if impossible"""
    if len(text) <= T.MAX_LINE:
        return [text]
    words = text.split()
    best, best_score = None, None
    for i in range(1, len(words)):
        l1, l2 = " ".join(words[:i]), " ".join(words[i:])
        if len(l1) > T.MAX_LINE or len(l2) > T.MAX_LINE or line_bad(l1, l2):
            continue
        short = i < 2 or i > len(words) - 2
        score = (abs(len(l1) - len(l2)) - (10 if re.search(r"[,;:—–]$", l1) else 0) + (30 if short else 0)
                 + (25 if T._pair_split(words[i - 1], words[i]) and not pair_cut(l1, l2) else 0) + T._break_cost(words[i - 1], words[i]))
        if best_score is None or score < best_score:
            best, best_score = [l1, l2], score
    return best


def ts(t: float) -> float:
    return t


def parse_vtt(p: Path) -> list[list]:
    """[[t0, t1, [lines]]] from a VTT file"""
    out = []
    blocks = p.read_text(encoding="utf-8").strip().split("\n\n")[1:]
    for b in blocks:
        L = b.strip().split("\n")
        a, z = [sum(float(q) * m for q, m in zip(x.strip().split(":"), (3600, 60, 1))) for x in L[0].split("-->")]
        out.append([a, z, L[1:]])
    return out


def problems(cues: list[list]) -> list[str]:
    """every rule break in a cue list [[t0, t1, lines, ...]]"""
    out = []
    for k, c in enumerate(cues):
        t0, t1, L = c[0], c[1], c[2]
        txt, d = " ".join(L), c[1] - c[0]
        if not wrap_ok(L):
            out.append(f"line  {T.fmt_ts(t0, '.')}  {' | '.join(L)}")
        if not (T.CUE_MIN - 2e-3 <= d <= T.CUE_MAX + 2e-3) and not (len(c) > 3 and c[3] == "single"):
            out.append(f"dur   {T.fmt_ts(t0, '.')}  {d:.2f} s  {txt}")
        if len(txt) / d > T.MAX_CPS + 1e-6:
            out.append(f"cps   {T.fmt_ts(t0, '.')}  {len(txt) / d:.1f}  {txt}")
        if k + 1 < len(cues):
            nxt = " ".join(cues[k + 1][2])
            if cut_bad(txt, nxt):
                out.append(f"cue   {T.fmt_ts(t0, '.')}  ...{txt[-34:]} | {nxt[:34]}...")
            if cues[k + 1][0] < t1 - 1e-6:
                out.append(f"overlap {T.fmt_ts(t0, '.')}")
    return out


def resegment(sent: dict, old_cuts: list[int], lo: float, hi: float) -> list[list] | None:
    """best legal split of one sentence; lo / hi = the earliest start / latest end its first / last cue may borrow"""
    words = sent["text"].split()
    start, dur = sent["start"], sent["dur"]
    best = None
    n_old = len(old_cuts) + 1
    for n in range(max(1, n_old - 1), n_old + 3):
        for combo in itertools.combinations(range(1, len(words)), n - 1):
            cuts = [0, *combo, len(words)]
            segs = [" ".join(words[cuts[q]:cuts[q + 1]]) for q in range(n)]
            if any(cut_bad(a, b) for a, b in zip(segs, segs[1:])):
                continue
            wraps = [wrap3(g) for g in segs]
            if any(w is None for w in wraps):
                continue
            tot = sum(len(g) for g in segs)
            tt, c0 = [], start
            for g in segs:
                c1 = c0 + dur * len(g) / tot
                tt.append([c0, c1])
                c0 = c1
            if n > 1:
                if tt[0][1] - tt[0][0] < T.CUE_MIN:
                    tt[0][0] = max(lo, tt[0][1] - T.CUE_MIN)
                if tt[-1][1] - tt[-1][0] < T.CUE_MIN:
                    tt[-1][1] = min(hi, tt[-1][0] + T.CUE_MIN)
            if any(not (T.CUE_MIN - 1e-6 <= b - a <= T.CUE_MAX + 1e-6) for a, b in tt) and n > 1:
                continue
            if any(len(g) / (b - a) > T.MAX_CPS + 1e-6 for g, (a, b) in zip(segs, tt)):
                continue
            cost = (sum(T._break_cost(words[c - 1], words[c]) + (15 if words[c].lower() in ("by", "of", "to") else 0) for c in combo) + sum(min((abs(c - o) for o in old_cuts), default=0) for c in combo) * 3 + 20 * abs(n - n_old)
                    + max(len(g) for g in segs) - min(len(g) for g in segs))
            if best is None or cost < best[0]:
                best = (cost, [[a, b, w, "single" if n == 1 else ""] for (a, b), w in zip(tt, wraps)])
        if best is not None:
            break
    return None if best is None else best[1]


def main() -> int:
    tm = json.loads((OUT / "timing.json").read_text(encoding="utf-8"))
    sents = [x for s in tm["scenes"] for x in s["sentences"]]
    cues = parse_vtt(OUT / "en.vtt")
    if "--check" in sys.argv:
        bad = problems(cues)
        joined = re.sub(r"\s+", " ", " ".join(" ".join(c[2]) for c in cues)).split()
        same = joined == " ".join(x["text"] for x in sents).split()
        print(f"en.vtt: {len(cues)} cues; rule breaks {len(bad)}; text = script: {same}")
        for b in bad:
            print("  ", b)
        return 0 if not bad and same else 1
    # cue -> sentence
    owner = []
    for c in cues:
        k = next((i for i, x in enumerate(sents) if x["start"] - 2e-3 <= c[0] and c[1] <= x["end"] + 2e-3), None)
        if k is None:
            print(f"FAIL cue {T.fmt_ts(c[0], '.')} lies in no sentence")
            return 1
        owner.append(k)
    by: dict[int, list] = {}
    for c, k in zip(cues, owner):
        by.setdefault(k, []).append(c)
    for i, x in enumerate(sents):
        if " ".join(" ".join(c[2]) for c in by.get(i, [])).split() != x["text"].split():
            print(f"FAIL sentence {i}: cue words differ from the script")
            return 1
    for i, x in enumerate(sents):          # single-cue sentences may be shorter than 1 s (as make_timing --recue)
        if len(by[i]) == 1:
            by[i][0].append("single")
    before = problems([c for i in range(len(sents)) for c in by[i]])
    changed = []
    for i, x in enumerate(sents):
        mine = by[i]
        prev_end = by[i - 1][-1][1] if i > 0 else 0.0
        next_start = by[i + 1][0][0] if i + 1 < len(sents) else x["end"] + 0.3
        ctx = ([by[i - 1][-1]] if i > 0 else []) + mine + ([by[i + 1][0]] if i + 1 < len(sents) else [])
        own = [p for p in problems(ctx) if any(p.split()[1].startswith(T.fmt_ts(c[0], '.')) for c in mine)]
        # a boundary problem reported on the previous sentence's last cue that reaches into this one is a sentence end: never a number
        if not own:
            continue
        acc, old_cuts = 0, []
        for c in mine[:-1]:
            acc += len(" ".join(c[2]).split())
            old_cuts.append(acc)
        new = resegment(x, old_cuts, prev_end, next_start)
        if new is None:
            print(f"FAIL sentence {i}: no legal split: {x['text']!r}  ({own})")
            return 1
        changed.append((i, [(T.fmt_ts(c[0], '.'), " | ".join(c[2])) for c in mine], [(T.fmt_ts(c[0], '.'), " | ".join(c[2])) for c in new], own))
        by[i] = new
    allc = [c for i in range(len(sents)) for c in by[i]]
    after = problems(allc)
    joined = " ".join(" ".join(c[2]) for c in allc).split()
    same = joined == " ".join(x["text"] for x in sents).split()
    print(f"cues {len(cues)} -> {len(allc)}; sentences re-cued {len(changed)}; rule breaks before {len(before)}, after {len(after)}; "
          f"text = script: {same}")
    for b in before:
        print("  before:", b)
    for i, o, n, why in changed:
        print(f"  sentence {i}:")
        for t, s in o:
            print(f"     - {t}  {s}")
        for t, s in n:
            print(f"     + {t}  {s}")
    for b in after:
        print("  AFTER :", b)
    if after or not same:
        print("FAIL captions not clean")
        return 1
    if "--write" not in sys.argv:
        return 0
    vtt, srt = ["WEBVTT", ""], []
    for k, c in enumerate(allc, 1):
        vtt += [f"{T.fmt_ts(c[0], '.')} --> {T.fmt_ts(c[1], '.')}", *c[2], ""]
        srt += [str(k), f"{T.fmt_ts(c[0], ',')} --> {T.fmt_ts(c[1], ',')}", *c[2], ""]
    (OUT / "en.vtt").write_text("\n".join(vtt), encoding="utf-8")
    (OUT / "en.srt").write_text("\n".join(srt), encoding="utf-8")
    tm["cues"] = len(allc)
    tm["recue_fix3_1108"] = ("checks/fix3_recue.py (2026-11-08, fix2 review 2 M2/S1/N5): no cue boundary inside a spoken number or a vector pair / "
                             "list; no line break inside a number, nor inside a pair that fits one line (a longer pair breaks only at its comma); "
                             "a first / last cue under 1 s may start / end in the silence beside its sentence; audio and words unchanged")
    (OUT / "timing.json").write_text(json.dumps(tm, indent=1, ensure_ascii=False), encoding="utf-8")
    print("wrote en.vtt, en.srt, timing.json (cues)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
