"""ch00_coordinates_storm (#5b) pass r8 2026-11-07: reveal times from the spoken words (user / Part 1 audit: Kokoro word timestamps, not
the character share; target +/- 0.5 s).

Reads the Kokoro word timestamps that cst_r8_splice.py saved for every re-voiced sentence (G:/.../r8/tts/words.json) and writes
movies/src/ch00_coordinates_storm/at_words.json: {"<scene>|<j>|<phrase>": {"text": <sentence text>, "dt": <s from the sentence start>}}
for every AT phrase used in the scene files (any AT(k, <expr>, "phrase") form) that occurs in a re-voiced sentence. cs_lib.tsx AT() and
checks/at_check.mjs use an entry only while the sentence text is unchanged. Prints, per entry, the character-share estimate, the
measured word time and their difference (the error the table removes).
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/r8_words.py [--write]
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
SRC = ROOT / "movies/src/ch00_coordinates_storm"
TIM = ROOT / "movies/ch00/ch00_coordinates_storm/timing.json"
WORDS = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/r8/tts/words.json")
norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower())  # noqa: E731


def word_time(words: list, phrase: str, text: str) -> float | None:
    toks = [(t, norm(x)) for t, x in words if norm(x)]
    ph = [norm(x) for x in phrase.split() if norm(x)]
    hits = [toks[i][0] for i in range(len(toks) - len(ph) + 1) if all(toks[i + q][1] == ph[q] for q in range(len(ph)))]
    if not hits:
        return None
    # the phrase's occurrence in the text (AT uses the first) -> the matching occurrence among the tokens
    n_before = text[: text.index(phrase)].lower().count(phrase.lower())
    return hits[min(n_before, len(hits) - 1)]


def main() -> int:
    tm = json.loads(TIM.read_text(encoding="utf-8"))
    by = {s["id"]: s for s in tm["scenes"]}
    W = json.loads(WORDS.read_text(encoding="utf-8"))
    ex = WORDS.with_name("words_extra.json")   # re-used sentences with highlights (r8_words_extra.py)
    if ex.exists():
        W += json.loads(ex.read_text(encoding="utf-8"))
    phrases = set()
    for f in ["cs_sA.tsx", "cs_sB.tsx", "cs_sC.tsx", "cs_sD.tsx"]:
        phrases |= set(re.findall(r'\bAT\(k,\s*[^"]+?,\s*"([^"]+)"\)', (SRC / f).read_text(encoding="utf-8")))
    out, bad, rows = {}, 0, []
    for w in W:
        s = by[w["scene"]]["sentences"][w["j"]]
        if s["text"] != w["text"]:
            print(f"FAIL {w['scene']} S{w['j']}: timing text differs from the voiced text")
            bad += 1
            continue
        for ph in sorted(phrases):
            if ph not in s["text"]:
                continue
            t = word_time(w["words"], ph, s["text"])
            est = (s["end"] - s["start"]) * s["text"].index(ph) / len(s["text"])
            if t is None:
                print(f"WARN {w['scene']} S{w['j']} '{ph}': not found among the Kokoro tokens; character share kept")
                continue
            out[f"{w['scene']}|{w['j']}|{ph}"] = {"text": s["text"], "dt": round(t, 3)}
            rows.append((w["scene"], w["j"], ph, est, t))
    for sc, j, ph, e, t in rows:
        print(f"{sc} S{j:<3} {ph[:34]:34s} char-share {e:6.2f} s  word {t:6.2f} s  diff {e - t:+.2f} s")
    big = [r for r in rows if abs(r[3] - r[4]) > 0.5]
    print(f"{len(out)} entries; {len(big)} would have been off by > 0.5 s with the character share")
    if "--write" in sys.argv and not bad:
        (SRC / "at_words.json").write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        print("wrote", SRC / "at_words.json")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
