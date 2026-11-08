"""ch00_coordinates_storm (#5b) fix loop 1 (2026-11-07): movies/src/ch00_coordinates_storm/words.json = the Kokoro token start times of
every sentence of the movie's timing.json (Part 1 fix 2 format: {"scenes": {scene: {j: {"text", "w": [[t_s, token], ...]}}}}), which
cs_lib.tsx AT() / ATP() search for the quoted phrase (review 2 S13: no character share). Also re-writes at_words.json (the r8 table:
"<scene>|<j>|<phrase>" -> {text, dt}) for every literal AT phrase, for the tools that still read it.

Sources by sentence TEXT, first hit wins: G:/.../fix1/tts/words_all.json (fix1_words_all.py: every sentence), then the r8 tables and the
r8 auditor's kw.json (used before the fix1 TTS exists). Checks every phrase used in the scene files (AT(k, j, "…"), ATP(k, "…"), SSP is
not timed by words) plus the event-config word fields (`W: "…"` keys in EV_CFG): each sentence that contains the phrase must resolve it
among its tokens; prints every failure.
usage: .venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/fix1_words.py [--write]
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
SRC = ROOT / "movies/src/ch00_coordinates_storm"
TIM = ROOT / "movies/ch00/ch00_coordinates_storm/timing.json"
SCR = Path("G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm")
KW = Path(r"C:\Users\sislam27\AppData\Local\Temp\claude\C--Users-sislam27-Work-Climate-Dynamics-PHD-AOFD-Vallis\59a95c54-f84d-46f4-bd99-469738e8b49c"
          r"\scratchpad\r8s\kw.json")
wn = lambda x: re.sub(r"[^a-z0-9']", "", x.lower())  # noqa: E731


def sources() -> dict[str, tuple[list, str]]:
    by: dict[str, tuple[list, str]] = {}
    for p, tag in [(SCR / "fix1/tts/words_all.json", "fix1_all"), (SCR / "fix1/tts/words.json", "fix1"), (SCR / "r8/tts/words.json", "r8"),
                   (SCR / "r8/tts/words_extra.json", "r8_extra")]:
        if p.exists():
            for w in json.loads(p.read_text(encoding="utf-8")):
                by.setdefault(w["text"], (w["words"], tag))
    if KW.exists():
        for d in json.loads(KW.read_text(encoding="utf-8")).values():
            for e in d.values():
                if abs(e["synth"] - e["dur"]) <= 0.05:
                    by.setdefault(e["text"], (e["w"], "kw_r8s"))
    return by


def tok_time(words: list, phrase: str) -> float | None:
    toks = [(t, wn(x)) for t, x in words if wn(x)]
    ph = [wn(x) for x in phrase.split() if wn(x)]
    for i in range(len(toks) - len(ph) + 1):
        if all(toks[i + q][1] == ph[q] for q in range(len(ph))):
            return toks[i][0]
    return None


def main() -> int:
    tm = json.loads(TIM.read_text(encoding="utf-8"))
    by = sources()
    out, miss, tags = {}, [], {}
    for s in tm["scenes"]:
        for j, x in enumerate(s["sentences"]):
            if x["text"] in by:
                w, tag = by[x["text"]]
                out.setdefault(s["id"], {})[str(j)] = {"text": x["text"], "w": w}
                tags[tag] = tags.get(tag, 0) + 1
            else:
                miss.append(f"{s['id']} S{j}")
    n = sum(len(s["sentences"]) for s in tm["scenes"])
    print(f"words: {n - len(miss)} / {n} sentences ({tags}); without word times: {len(miss)} {miss[:12]}")
    code = "\n".join((SRC / f).read_text(encoding="utf-8") for f in ["cs_sA.tsx", "cs_sB.tsx", "cs_sC.tsx", "cs_sD.tsx"])
    lit = re.findall(r'\bAT\(k,\s*(\d+),\s*"([^"]+)"\)', code)
    phrases = {p for _, p in lit} | set(re.findall(r'\bATP\(k,\s*"([^"]+)"\)', code)) | set(re.findall(r'\b\w+W:\s*"([^"]+)"', code))
    phrases |= set(re.findall(r'\bAT\(k,\s*[^"\d][^"]*?,\s*"([^"]+)"\)', code))
    bad, nres = [], 0
    for s in tm["scenes"]:
        for j, x in enumerate(s["sentences"]):
            for ph in phrases:
                if ph not in x["text"]:
                    continue
                e = out.get(s["id"], {}).get(str(j))
                if e is None or tok_time(e["w"], ph) is None:
                    bad.append(f"{s['id']} S{j} '{ph}'")
                else:
                    nres += 1
    print(f"{len(phrases)} phrases in the code; {nres} (sentence, phrase) pairs resolve on word times; {len(bad)} do not")
    for b in bad[:40]:
        print("  NO WORD TIME", b)
    if "--write" in sys.argv:
        (SRC / "words.json").write_text(json.dumps({"note": "Kokoro af_bella x1.0 token start times (s from the sentence start) per timing entry "
                                                    "(fix loop 1 2026-11-07, checks/fix1_words.py); cs_lib AT() uses them when the text matches",
                                                    "scenes": out}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        atw = {}
        by_id = {s["id"]: s for s in tm["scenes"]}
        for jj, ph in lit:
            pass
        for s in tm["scenes"]:
            for j, x in enumerate(s["sentences"]):
                e = out.get(s["id"], {}).get(str(j))
                if not e:
                    continue
                for ph in phrases:
                    if ph in x["text"]:
                        t = tok_time(e["w"], ph)
                        if t is not None:
                            atw[f"{s['id']}|{j}|{ph}"] = {"text": x["text"], "dt": round(t, 3)}
        (SRC / "at_words.json").write_text(json.dumps(atw, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"wrote words.json ({len(out)} scenes) and at_words.json ({len(atw)} entries)")
        del by_id
    return 1 if (bad or miss) and "--strict" in sys.argv else 0


if __name__ == "__main__":
    sys.exit(main())
