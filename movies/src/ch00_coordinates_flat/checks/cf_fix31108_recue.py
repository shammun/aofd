"""ch00_coordinates_flat (#5a) fix 3 (2026-11-08, fix2 review Cosmetic 4): re-cue the captions so a spoken vector pair ("three, four",
"zero point six, zero point eight", "three fifths, four fifths") is never split across two cues. Captions only: no re-voice, no timing
change (sentence times, scene times and words.json are untouched; only en.vtt, en.srt and timing.json -> "cues" are rewritten).

Line wrap inside a cue: never end a line on "minus" nor inside one spoken number (unless no break fits; then the old wrap).

Same cue builder as every splice of this movie (cf_fix1107_splice.build_cues: tools/tts.py rules, cue times proportional to characters
inside each timing entry, a cut never inside a spoken number) with one more rule: a cut never falls between the two numbers of a pair
("<number>, | <number>").

Fix 4 (2026-11-08, fix3 review 2 M1/M2 + six wraps; the default since fix 4): one predicate for cue cuts AND line breaks -
never inside a spoken number ("a | hundred and twenty six", "thirty | five", "point | eight"), never right after "minus", never
inside a vector pair (list extended: "minus q, zero", "zero, p", "minus q, p"). A chunk that cannot wrap into <= 2 lines of
<= 42 characters without such a break is split into more cues; merges of short cues only where the result still wraps
legally. It first checks that the fix-3 rules reproduce en.vtt. (--fix3 runs the fix-3 stage as it was.)

usage (repo root):  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fix31108_recue.py [--fix3] [--dry]
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import cf_fix1107_splice as G  # noqa: E402

# the vector pairs spoken in this movie (script scan: "<number>, <number>" that are the two components of one arrow)
PAIRS = ["three, four", "three fifths, four fifths", "zero point six, zero point eight", "zero, one", "minus one, zero", "minus four, three",
         "minus zero point eight, zero point six", "ten, zero", "three point six, four point eight", "six point four, minus four point eight",
         "zero point eight six six, zero point five", "minus zero point five, zero point eight six six", "four point six, one point nine six",
         "five, zero"]
PAIR4_RE = [re.compile(r"(?<![a-z])" + re.escape(q) + r"(?![a-z])", re.I) for q in ["minus q, zero", "zero, p", "minus q, p"]]   # fix 4
PAIR_RE = [re.compile(r"(?<![a-z])" + re.escape(q) + r"(?![a-z])", re.I) for q in PAIRS]


def _inside_pair(c: str, cut: int) -> bool:
    """True if a cut at `cut` falls inside a spoken vector pair ("three, | four", "zero point six, | zero point eight")."""
    return any(m.start() < cut < m.end() for r in PAIR_RE for m in r.finditer(c))


def _no_line_break(left: str, right: str) -> bool:
    """line wrap (tools/tts.py wrap): besides its short comma pairs, never end a line on "minus" (it belongs to the next number) nor
    inside one spoken number ("eight point | seven")"""
    return (_old_pair(left, right) or left.lower() == "minus"
            or (G._numword(left) and not left.endswith((",", ".", ":", ";")) and G._numword(right)))


_old_inside = G._inside_number
_old_pair = G.tts._pair_split
_old_wrap = G.tts.wrap


def _wrap(text: str) -> list[str]:
    """tts.wrap with the number rule; where that leaves a one-word line (no break fits the rule: "zero point zero zero one seven four
    five."), the old wrap is kept"""
    G.tts._pair_split = _no_line_break
    try:
        L = _old_wrap(text)
    finally:
        G.tts._pair_split = _old_pair
    return _old_wrap(text) if len(L) == 2 and min(len(x.split()) for x in L) < 2 else L


def _inside(c: str, cut: int) -> bool:
    return _old_inside(c, cut) or _inside_pair(c, cut)


def cues_of(vtt: list[str]) -> list[tuple[str, str]]:
    out, i = [], 0
    while i < len(vtt):
        if "-->" in vtt[i]:
            j = i + 1
            txt = []
            while j < len(vtt) and vtt[j].strip():
                txt.append(vtt[j]); j += 1
            out.append((vtt[i], " ".join(txt))); i = j
        else:
            i += 1
    return out


# ------------------------------------------------------------------ fix 4: one rule for cue cuts and line breaks
BIG = {"hundred", "thousand"}


def _inside4(c: str, cut: int) -> bool:
    """True if a cut (cue boundary or line break) at character `cut` of `c` falls inside a spoken number or vector pair, or right
    after "minus"."""
    if _old_inside(c, cut) or _inside_pair(c, cut) or any(m.start() < cut < m.end() for r in PAIR4_RE for m in r.finditer(c)):
        return True
    left, right = c[:cut].split(), c[cut:].split()
    if not left or not right:
        return False
    lw, rw = left[-1].lower(), re.sub(r"[^a-z]", "", right[0].lower())
    return (lw in ("minus", "plus") or (lw == "a" and rw in BIG) or (G._numword(lw) and rw == "pi")
            or (G._numword(lw) and not re.search(r"[,.;:]$", lw) and rw == "and" and len(right) > 1 and G._numword(right[1])))


RELAXED: list[str] = []   # texts where one spoken number or pair is longer than a line: the LINE breaks before the number's "and"
#                           or at the pair's comma (the only way); never a cue boundary there


def wrap4(text: str, relax: bool = False) -> list[str] | None:
    """<= 2 lines of <= 42 characters with no break inside a number / pair / after minus; None if impossible. relax: a number or
    pair longer than one line may break between "hundred"/"thousand" and "and", or at the pair's comma"""
    if len(text) <= G.tts.MAX_LINE:
        return [text]
    words = text.split()
    best, best_score = None, None
    for i in range(1 if relax else 2, len(words) - (0 if relax else 1)):
        l1, l2 = " ".join(words[:i]), " ".join(words[i:])
        if len(l1) > G.tts.MAX_LINE or len(l2) > G.tts.MAX_LINE or (_old_pair(words[i - 1], words[i]) and not relax) or (
                _inside4(text, len(l1)) and not (relax and ((words[i - 1].lower() in BIG and words[i].lower() == "and")
                                                or (words[i - 1].endswith(",") and words[i - 1].lower() != "minus")))):
            continue
        score = (abs(len(l1) - len(l2)) - (10 if re.search(r"[,;:—–]$", l1) else 0) + G.tts._break_cost(words[i - 1], words[i]))
        if best_score is None or score < best_score:
            best, best_score = [l1, l2], score
    return best


def split4(sentence: str, dur: float) -> list[str]:
    chunks = [sentence]
    while True:
        bad = [i for i, c in enumerate(chunks) if (wrap4(c) is None and c not in RELAXED) or dur * len(c) / max(len(sentence), 1) > G.tts.CUE_MAX]
        if not bad:
            return chunks
        i = bad[0]
        c = chunks[i]
        mid = len(c) // 2
        clause = [m.end() for m in re.finditer(r"[,;:—–]\s+|\s+(?:and|but|so|which|while|because|then)\s+", c)]
        spaces = [m.start() for m in re.finditer(r"\s", c)]
        cut = None
        # tiers: clause marks with both pieces >= 16 characters, any space >= 16, any space >= 10 (a one-word cue, "about", lasted 0.4 s);
        # inside a tier the cut nearest the middle, never after a glue word ("metres per | second", "of | a")
        for pool, mn in ((clause, 16), (spaces, 16), (spaces, 10)):
            ok = [q for q in pool if not _inside4(c, q) and mn <= q <= len(c) - mn]
            if ok:
                cut = min(ok, key=lambda q: abs(q - mid) + (25 if c[:q].split()[-1].lower().strip(",") in G.tts._GLUE else 0))
                break
        if cut is None:
            if wrap4(c, relax=True) is None:
                raise SystemExit(f"no legal cut in: {c}")
            RELAXED.append(c)
            return chunks if all(wrap4(q) is not None or q in RELAXED for q in chunks) else split4_rest(chunks, sentence, dur)
        chunks[i:i + 1] = [c[:cut].strip(), c[cut:].strip()]


def split4_rest(chunks: list[str], sentence: str, dur: float) -> list[str]:
    out = []
    for q in chunks:
        out += [q] if (wrap4(q) is not None or q in RELAXED) and dur * len(q) / max(len(sentence), 1) <= G.tts.CUE_MAX else split4(q, dur * len(q) / max(len(sentence), 1))
    return out


def build4(T: dict) -> tuple[list[str], list[str], list[str], int]:
    cues = []
    for sc in T["scenes"]:
        for x in sc["sentences"]:
            parts = split4(x["text"], x["dur"])
            nch = sum(len(q) for q in parts)
            c0 = x["start"]
            for q in parts:
                c1 = c0 + x["dur"] * len(q) / nch
                cues.append((c0, c1, q)); c0 = c1
    merged: list[list] = []
    for c in cues:
        if (merged and merged[-1][1] - merged[-1][0] < G.tts.CUE_MIN and merged[-1][2] not in RELAXED and c[2] not in RELAXED
                and wrap4(merged[-1][2] + " " + c[2]) is not None):
            merged[-1] = [merged[-1][0], c[1], merged[-1][2] + " " + c[2]]
        else:
            merged.append(list(c))
    # a cue still shorter than 1 s joins the cue before it when the joined text wraps legally ("With thirty degrees, y hat prime")
    k = 1
    while k < len(merged):
        c = merged[k]
        if c[1] - c[0] < G.tts.CUE_MIN and abs(merged[k - 1][1] - c[0]) < 1e-6 and wrap4(merged[k - 1][2] + " " + c[2]) is not None:
            merged[k - 1] = [merged[k - 1][0], c[1], merged[k - 1][2] + " " + c[2]]
            del merged[k]
        else:
            k += 1
    vtt, srt, warn = ["WEBVTT", ""], [], []
    for i, (c0, c1, txt) in enumerate(merged, 1):
        lines = wrap4(txt) or (wrap4(txt, relax=True) if txt in RELAXED else None)
        if lines is None or c1 - c0 > G.tts.CUE_MAX + 1e-6:
            warn.append(f"cue {i}: {txt}")
            lines = lines or G.tts.wrap(txt)
        vtt += [f"{G.tts.fmt_ts(c0, '.')} --> {G.tts.fmt_ts(c1, '.')}", *lines, ""]
        srt += [str(i), f"{G.tts.fmt_ts(c0, ',')} --> {G.tts.fmt_ts(c1, ',')}", *lines, ""]
    return vtt, srt, warn, len(merged)


def _lines_of(vtt: list[str]) -> list[tuple[str, list[str]]]:
    out, i = [], 0
    while i < len(vtt):
        if "-->" in vtt[i]:
            j = i + 1
            L = []
            while j < len(vtt) and vtt[j].strip():
                L.append(vtt[j]); j += 1
            out.append((vtt[i], L)); i = j
        else:
            i += 1
    return out


def illegal_breaks(vtt: list[str]) -> list[str]:
    """every cue boundary or line break inside a number / pair / right after minus, in a built vtt"""
    out = []
    cs = _lines_of(vtt)
    for k, (ts, L) in enumerate(cs):
        t = " ".join(L)
        if len(L) == 2 and _inside4(t, len(L[0])) and t not in RELAXED:
            out.append(f"line  {ts}  {L[0]} | {L[1]}")
        if k + 1 < len(cs):
            nxt = " ".join(cs[k + 1][1])
            if _inside4(t + " " + nxt, len(t)):
                out.append(f"cue   {ts}  ...{t[-30:]} | {nxt[:30]}...")
    return out


def main4() -> None:
    T = json.loads((G.MOV / "timing.json").read_text(encoding="utf-8"))
    before = (G.MOV / "en.vtt").read_text(encoding="utf-8")
    G._inside_number = _inside
    G.tts.wrap = _wrap
    try:
        vtt3, _, _, n3 = G.build_cues(T)
    finally:
        G._inside_number = _old_inside
        G.tts.wrap = _old_wrap
    if "\n".join(vtt3) != before or n3 != T["cues"]:
        raise SystemExit("the fix-3 rules do not reproduce en.vtt - stop")
    old_bad = illegal_breaks(vtt3)
    vtt, srt, warn, n = build4(T)
    new_bad = illegal_breaks(vtt)
    a, b = cues_of(vtt3), cues_of(vtt)
    joined = lambda cs: re.sub(r"\s+", " ", " ".join(t for _, t in cs))  # noqa: E731
    if joined(a) != joined(b):
        raise SystemExit("caption text changed - stop")
    bad = []
    for ts, t in b:
        t0, t1 = [sum(float(q) * m for q, m in zip(x.strip().split(":"), (3600, 60, 1))) for x in ts.split("-->")]
        d = t1 - t0
        if not (1.0 - 1e-6 <= d <= 7.0 + 1e-6) or len(t) / d > 17.0:
            bad.append((ts, t, round(d, 2), round(len(t) / d, 1)))
    print(f"unavoidable (one number longer than a line, broken before its 'and'): {RELAXED}")
    print(f"cues {n3} -> {n}; illegal breaks before {len(old_bad)}, after {len(new_bad)}; warnings {warn}; house-limit failures {bad}")
    for x in old_bad:
        print("  before:", x)
    for x in new_bad:
        print("  AFTER :", x)
    if new_bad or bad or warn:
        raise SystemExit("fix-4 captions not clean - stop")
    if "--dry" in sys.argv:
        return
    (G.MOV / "en.vtt").write_text("\n".join(vtt), encoding="utf-8")
    (G.MOV / "en.srt").write_text("\n".join(srt), encoding="utf-8")
    T["cues"] = n
    T.setdefault("self_check", {})["recue_fix4_1108"] = ("captions re-cued: no cue boundary or line break inside a spoken number or vector "
                                                         "pair, none right after 'minus' (fix3 review 2 M1/M2 + six wraps)")
    (G.MOV / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    print("written en.vtt, en.srt, timing.json (cues)")


def main() -> None:
    T = json.loads((G.MOV / "timing.json").read_text(encoding="utf-8"))
    before = (G.MOV / "en.vtt").read_text(encoding="utf-8")
    # the unchanged builder must reproduce the committed captions first
    vtt0, srt0, w0, n0 = G.build_cues(T)
    if "\n".join(vtt0) != before or n0 != T["cues"]:
        raise SystemExit("cue rebuild without the pair rule differs from en.vtt - stop")
    G._inside_number = _inside
    G.tts.wrap = _wrap
    try:
        vtt, srt, warn, n = G.build_cues(T)
    finally:
        G._inside_number = _old_inside
        G.tts.wrap = _old_wrap
    a, b = cues_of(vtt0), cues_of(vtt)
    sa, sb = {x for x in a}, {x for x in b}
    gone, new = [x for x in a if x not in sb], [x for x in b if x not in sa]
    print(f"cues {n0} -> {n}; changed: {len(gone)} old cue(s) -> {len(new)} new cue(s); warnings {warn}")
    for ts, t in gone:
        print(f"  - {ts}  {t}")
    for ts, t in new:
        print(f"  + {ts}  {t}")
    # house limits on the new cues
    bad = []
    for ts, t in new:
        t0, t1 = [sum(float(p) * m for p, m in zip(x.strip().replace(",", ".").split(":"), (3600, 60, 1))) for x in ts.split("-->")]
        d = t1 - t0
        if not (1.0 - 1e-6 <= d <= 7.0 + 1e-6) or len(t) / d > 17.0:
            bad.append((ts, t, round(d, 2), round(len(t) / d, 1)))
    if bad:
        raise SystemExit(f"new cues outside the house limits: {bad}")
    joined = lambda cs: re.sub(r"\s+", " ", " ".join(t for _, t in cs))  # noqa: E731
    if joined(a) != joined(b):
        raise SystemExit("caption text changed - stop")
    if "--dry" in sys.argv:
        return
    (G.MOV / "en.vtt").write_text("\n".join(vtt), encoding="utf-8")
    (G.MOV / "en.srt").write_text("\n".join(srt), encoding="utf-8")
    T["cues"] = n
    T.setdefault("self_check", {})["recue_fix3_1108"] = "captions re-cued: a spoken vector pair never split across cues (fix2 review C4)"
    (G.MOV / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    print("written en.vtt, en.srt, timing.json (cues)")


if __name__ == "__main__":
    main() if "--fix3" in sys.argv else main4()
