"""ch00_coordinates_maps (#5g) remake 2026-11-07: Kokoro WORD timestamps for every sentence a reveal is cued on (coordinator rule
2026-11-07: re-cued reveals timed from Kokoro word timestamps, +-0.5 s). HEAVY (Kokoro): hold the HEAVY.lock.

For each sentence named by an AT(k, j, "phrase") in mp_sA/B/C.tsx, the sentence's audio text (lexicon respelled, = the splice) is
re-synthesised with Kokoro af_bella x1.0 and its token start times are kept, scaled by (clip length / synthesis length) so they sit on the
clip actually used (re-used clips re-synthesise at r >= 0.98, the splice's check). The words go into movies/.../timing.json as
sentences[*].words = [[t_abs, token], ...]; mp_lib.AT() uses them when the phrase's words are found (else the old character estimate).
Prints every cue whose character estimate is more than 0.5 s off the word time.

usage: .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_maps/checks/mp_words.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / "tools"))
import tts  # noqa: E402

MOV = ROOT / "movies/ch00/ch00_coordinates_maps"
SRC = ROOT / "movies/src/ch00_coordinates_maps"
norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower())  # noqa: E731


def cues() -> list[tuple[str, int, str]]:
    out = []
    for f in ("mp_sA.tsx", "mp_sB.tsx", "mp_sC.tsx"):
        src = (SRC / f).read_text(encoding="utf-8")
        for blk in re.split(r"\nconst S\d\d", src)[1:]:
            # build1 2026-11-10: the s17 tour helper `tourTimes(k)` sits at the end of S16's block but is called with s17's k
            if "\nconst tourTimes" in blk:
                blk, tour = blk.split("\nconst tourTimes", 1)
                out += [("s17_where_is_what", int(a), b) for a, b in re.findall(r'AT\(k,\s*(\d+),\s*"([^"]+)"\)', tour)]
            m = re.search(r'K\("(s\d\d\w*)"\)', blk)
            if m:
                out += [(m.group(1), int(a), b) for a, b in re.findall(r'AT\(k,\s*(\d+),\s*"([^"]+)"\)', blk)]
    return sorted(set(out))


def word_time(words: list, phrase: str) -> float | None:
    toks = [(t, norm(x)) for t, x in words if norm(x)]
    ph = [norm(x) for x in phrase.split() if norm(x)]
    for i in range(len(toks) - len(ph) + 1):
        if all(toks[i + k][1] == ph[k] for k in range(len(ph))):
            return toks[i][0]
    return None


def main() -> int:
    from kokoro import KPipeline
    tm = json.loads((MOV / "timing.json").read_text(encoding="utf-8"))
    by = {s["id"]: s for s in tm["scenes"]}
    C = cues()
    need = sorted({(sid, j) for sid, j, _ in C})
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    lex = tts.load_lexicon()
    for sid, j in need:
        s = by[sid]["sentences"][j]
        a = s.get("audio_text") or tts.respell(s["text"], lex)
        words, off = [], 0.0
        for r in pipe(a, voice="af_bella", speed=1.0):
            for tk in (r.tokens or []):
                if tk.start_ts is not None:
                    words.append((off + tk.start_ts, tk.text))
            off += len(r.audio) / tts.SR
        k = (s["end"] - s["start"]) / off if off > 0 else 1.0
        s["words"] = [[round(s["start"] + t * k, 3), w] for t, w in words]
        s["words_scale"] = round(k, 4)
    tm["words"] = "mp_words.py: Kokoro token start times per cued sentence (scaled to the clip); mp_lib.AT uses them"
    (MOV / "timing.json").write_text(json.dumps(tm, indent=1, ensure_ascii=False), encoding="utf-8")
    bad = miss = 0
    for sid, j, ph in C:
        s = by[sid]["sentences"][j]
        est = s["start"] + (s["end"] - s["start"]) * s["text"].index(ph) / len(s["text"])
        wt = word_time(s["words"], ph)
        if wt is None:
            miss += 1
            print(f"  no word match  {sid} S{j} '{ph}' (character estimate kept)")
        elif abs(est - wt) > 0.5:
            bad += 1
            print(f"  {sid} S{j} '{ph[:40]}': estimate {est:.2f} s, word {wt:.2f} s ({est - wt:+.2f})")
    print(f"words: {len(need)} sentences, {len(C)} cues; {bad} estimates > 0.5 s off (now timed from the words), {miss} without a word match")
    return 0


if __name__ == "__main__":
    sys.exit(main())
