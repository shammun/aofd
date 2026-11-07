"""ch00_coordinates_storm (#5b) pass r8 2026-11-07: Kokoro word timestamps for RE-USED (unchanged) sentences that carry an AT reveal or
highlight in the calculation scenes (house rule 2026-11-07: inputs said and highlighted on their word, timed from word timestamps).

The re-used clips were made by Kokoro af_bella x 1.0 with the same lexicon; this re-synthesises each such sentence (same respelling as
cst_r8_splice.py), keeps the token start times, and accepts them only when the re-synthesised length equals the clip's length in
timing.json within 0.05 s (else the sentence is reported and keeps the character share). Output G:/.../r8/tts/words_extra.json
(same format as words.json); r8_words.py merges both.
Heavy job (hold HEAVY.lock); run in .venv-tts:
  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/r8_words_extra.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(Path(__file__).parent))
import tts  # noqa: E402
from cst_r8_splice import LOCAL, NEW  # noqa: E402

SRC = ROOT / "movies/src/ch00_coordinates_storm"
TIM = ROOT / "movies/ch00/ch00_coordinates_storm/timing.json"
SCENES = ["s09_dtheta_dt", "s13_acceleration_numbers", "s27_coast_angle", "s28_fmb_calc", "s29_stp_calc", "s30_onshore_piles",
          "s33_amphan_wind", "s36_nargis_wind", "s39_idai_wind"]


def main() -> int:
    from kokoro import KPipeline
    tm = json.loads(TIM.read_text(encoding="utf-8"))
    new = {(w["scene"], w["j"]) for w in json.loads((NEW / "words.json").read_text(encoding="utf-8"))}
    phrases = set()
    for f in ["cs_sA.tsx", "cs_sB.tsx", "cs_sC.tsx", "cs_sD.tsx"]:
        phrases |= set(re.findall(r'\bAT\(k,\s*[^"]+?,\s*"([^"]+)"\)', (SRC / f).read_text(encoding="utf-8")))
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    lex = tts.load_lexicon()
    out, skipped = [], []
    for s in tm["scenes"]:
        if s["id"] not in SCENES:
            continue
        for j, x in enumerate(s["sentences"]):
            if (s["id"], j) in new or not any(p in x["text"] for p in phrases):
                continue
            a = tts.respell(x["text"], lex)
            for pat, rep in LOCAL:
                a = pat.sub(rep, a)
            words, off = [], 0.0
            for r in pipe(a, voice="af_bella", speed=1.0):
                c = np.asarray(r.audio, dtype=np.float32)
                for tk in (r.tokens or []):
                    if tk.start_ts is not None:
                        words.append([round(off + float(tk.start_ts), 3), tk.text])
                off += len(c) / tts.SR
            d = off - x["dur"]
            print(f"{s['id']} S{j}: clip {x['dur']:.3f} s, resynth {off:.3f} s ({d:+.3f})", flush=True)
            if abs(d) <= 0.05:
                out.append({"scene": s["id"], "j": j, "text": x["text"], "words": words})
            else:
                skipped.append(f"{s['id']} S{j}")
    (NEW / "words_extra.json").write_text(json.dumps(out, indent=0, ensure_ascii=False), encoding="utf-8")
    print(f"{len(out)} sentences with word times; skipped (length differs > 0.05 s): {skipped}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
