"""ch00_coordinates_flat (#5a) fix 3 (2026-11-08, fix2 review Cosmetic 4): re-cue the captions so a spoken vector pair ("three, four",
"zero point six, zero point eight", "three fifths, four fifths") is never split across two cues. Captions only: no re-voice, no timing
change (sentence times, scene times and words.json are untouched; only en.vtt, en.srt and timing.json -> "cues" are rewritten).

Line wrap inside a cue: never end a line on "minus" nor inside one spoken number (unless no break fits; then the old wrap).

Same cue builder as every splice of this movie (cf_fix1107_splice.build_cues: tools/tts.py rules, cue times proportional to characters
inside each timing entry, a cut never inside a spoken number) with one more rule: a cut never falls between the two numbers of a pair
("<number>, | <number>").

usage (repo root):  .venv/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fix31108_recue.py [--dry]
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
    main()
