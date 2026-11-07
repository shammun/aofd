"""ch00_coordinates_sphere (#5c) remake 2026-11-07: check the reveals cued inside the NEW (re-voiced) sentences against Kokoro's word
timestamps (coordinator rule: re-cued reveals within ±0.5 s of the spoken words), and check that no caption cue splits a number.
Re-synthesises only the new sentences (same text, lexicon and voice as cs_r7_splice.py, so the token times match the spliced clips) and
compares every AT(k, j, "phrase") of those sentences in cs_sA/B/C.tsx with the time Kokoro says the phrase starts. HEAVY (Kokoro): hold the lock.
usage: .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/r7_wordtimes.py [--json out.json]
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / "tools"))
import tts  # noqa: E402

MOV = ROOT / "movies/ch00/ch00_coordinates_sphere"
SRC = ROOT / "movies/src/ch00_coordinates_sphere"
SPL = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_coordinates_sphere\r7\tts\splice.json")
NUMW = set("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty "
           "thirty forty fifty sixty seventy eighty ninety hundred thousand million point and minus".split())
norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower())  # noqa: E731


def caption_splits() -> list[str]:
    """cue boundaries inside one sentence where both sides are number words ('… four thousand' | 'two hundred …')"""
    T = json.loads((MOV / "timing.json").read_text(encoding="utf-8"))
    cues = []
    for blk in (MOV / "en.vtt").read_text(encoding="utf-8").split("\n\n"):
        ln = [x for x in blk.split("\n") if x.strip()]
        if len(ln) >= 2 and "-->" in ln[0]:
            cues.append(" ".join(ln[1:]))
    bad = []
    for a, b in zip(cues, cues[1:]):
        wa, wb = a.split(), b.split()
        if not wa or not wb:
            continue
        la, fb = norm(wa[-1]), norm(wb[0])
        if a.rstrip()[-1] in ".?!:;,":
            continue
        if la in NUMW - {"and"} and fb in NUMW:
            bad.append(f"…{' '.join(wa[-3:])} | {' '.join(wb[:3])}…")
    del T
    return bad


def main() -> int:
    bad = caption_splits()
    print(f"caption cues splitting a number: {len(bad)}")
    for b in bad:
        print("  SPLIT", b)
    T = json.loads((MOV / "timing.json").read_text(encoding="utf-8"))
    new = {(r["scene"], r["sentence"]) for r in json.loads(SPL.read_text(encoding="utf-8"))}
    by = {s["id"]: s for s in T["scenes"]}
    calls = []
    for fn in ("cs_sA.tsx", "cs_sB.tsx", "cs_sC.tsx"):
        src = (SRC / fn).read_text(encoding="utf-8")
        for blk in re.split(r"\nconst S\d\d", src)[1:]:
            m = re.search(r'K\("(s\d\d_\w+)"\)', blk)
            if not m:
                continue
            glow = {mm.group(0) for ln in blk.split("\n") if "glow" in ln for mm in re.finditer(r'AT\(k,\s*\d+,\s*"[^"]+"\)', ln.split("glow", 1)[1])}
            for mm in re.finditer(r'AT\(k,\s*(\d+),\s*"([^"]+)"\)', blk):
                key = (m.group(1), int(mm.group(1)), mm.group(2))
                if ((key[0], key[1]) in new or mm.group(0) in glow) and key not in calls:   # new sentences + every highlight cue
                    calls.append(key)
    from kokoro import KPipeline
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    lex = tts.load_lexicon()
    words: dict[tuple[str, int], list[tuple[float, str]]] = {}
    out, nbad = [], 0
    for sid, j, ph in calls:
        s = by[sid]["sentences"][j]
        if (sid, j) not in words:
            w, off = [], 0.0
            for r in pipe(tts.respell(s["text"], lex), voice="af_bella", speed=1.0):
                for tk in (r.tokens or []):
                    if tk.start_ts is not None:
                        w.append((s["start"] + off + tk.start_ts, tk.text))
                off += len(r.audio) / tts.SR
            words[(sid, j)] = w
        toks = [(t, norm(x)) for t, x in words[(sid, j)] if norm(x)]
        pw = [norm(x) for x in ph.split() if norm(x)]
        act = next((toks[i][0] for i in range(len(toks) - len(pw) + 1) if all(toks[i + q][1] == pw[q] for q in range(len(pw)))), None)
        i = s["text"].index(ph)
        est = s["start"] + (s["end"] - s["start"]) * i / len(s["text"])
        d = None if act is None else est - act
        flag = "" if d is not None and abs(d) <= 0.5 else "  <-- FIX"
        nbad += bool(flag)
        out.append({"scene": sid, "j": j, "phrase": ph, "est": round(est, 2), "word": None if act is None else round(act, 2), "diff": None if d is None else round(d, 2)})
        print(f"{sid} S{j} {ph[:38]:38s} AT {est:8.2f}  word {('%8.2f' % act) if act is not None else '   n/a  '}{flag}")
    print(f"{len(calls)} reveals in new sentences, {nbad} outside ±0.5 s; caption number splits {len(bad)}")
    if "--json" in sys.argv:
        Path(sys.argv[sys.argv.index("--json") + 1]).write_text(json.dumps(out, indent=1), encoding="utf-8")
    return 0 if not nbad and not bad else 1


if __name__ == "__main__":
    sys.exit(main())
