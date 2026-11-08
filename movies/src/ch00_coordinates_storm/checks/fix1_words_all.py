"""ch00_coordinates_storm (#5b) fix loop 1 (2026-11-07): Kokoro word timestamps for EVERY sentence of the fix1 narration, so that every
AT() reveal in the movie is timed from its spoken word (review 2 S13: no character share left; Part 1 fix 2 did the same).

Sources, matched by sentence TEXT (indices shift where a sentence was split):
  1. G:/.../fix1/tts/words.json        the clips re-voiced in fix loop 1 (exact: the same synthesis)
  2. G:/.../r8/tts/words.json          the clips re-voiced in pass r8 (exact)
  3. G:/.../r8/tts/words_extra.json    r8 re-synthesis of re-used clips (accepted at +/- 0.05 s of the clip length)
  4. the r8 review-2 auditor's kw.json (scratchpad r8s; 204 sentences, every re-synthesis = the clip length)
  5. otherwise: re-synthesised here (Kokoro af_bella x 1.0, same lexicon and local respellings as cst_r8_splice.py), accepted only when
     the re-synthesised length equals the clip's length in timing.json within 0.05 s; else reported (that sentence keeps the share).
Output G:/.../fix1/tts/words_all.json: [{scene, j, text, words: [[t_s from the clip start, token], ...], src}]
Heavy-ish (≈ 15-20 min CPU): run under VOICE.lock in .venv-tts:
  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/fix1_words_all.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(Path(__file__).parent))
import tts  # noqa: E402
from fix1_splice import LOCAL, NEW, SCR  # noqa: E402

KW = Path(r"C:\Users\sislam27\AppData\Local\Temp\claude\C--Users-sislam27-Work-Climate-Dynamics-PHD-AOFD-Vallis\59a95c54-f84d-46f4-bd99-469738e8b49c"
          r"\scratchpad\r8s\kw.json")


def main() -> int:
    tm = json.loads((NEW / "timing.json").read_text(encoding="utf-8"))
    by_text: dict[str, tuple[list, str]] = {}
    for p, tag in [(NEW / "words.json", "fix1"), (SCR / "r8/tts/words.json", "r8"), (SCR / "r8/tts/words_extra.json", "r8_extra")]:
        if p.exists():
            for w in json.loads(p.read_text(encoding="utf-8")):
                by_text.setdefault(w["text"], (w["words"], tag))
    if KW.exists():
        for sid, d in json.loads(KW.read_text(encoding="utf-8")).items():
            for j, e in d.items():
                if abs(e["synth"] - e["dur"]) <= 0.05:
                    by_text.setdefault(e["text"], (e["w"], "kw_r8s"))
    out, todo = [], []
    for s in tm["scenes"]:
        for j, x in enumerate(s["sentences"]):
            if x["text"] in by_text:
                w, tag = by_text[x["text"]]
                out.append({"scene": s["id"], "j": j, "text": x["text"], "words": w, "src": tag})
            else:
                todo.append((s["id"], j, x))
    print(f"{len(out)} sentences from existing word tables; {len(todo)} to re-synthesise", flush=True)
    skipped = []
    if todo:
        from kokoro import KPipeline
        pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
        lex = tts.load_lexicon()
        for sid, j, x in todo:
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
            print(f"{sid} S{j}: clip {x['dur']:.3f} s, resynth {off:.3f} s ({d:+.3f})", flush=True)
            if abs(d) <= 0.05:
                out.append({"scene": sid, "j": j, "text": x["text"], "words": words, "src": "fix1_resynth"})
            else:
                skipped.append(f"{sid} S{j}")
    (NEW / "words_all.json").write_text(json.dumps(out, indent=0, ensure_ascii=False), encoding="utf-8")
    n = sum(len(s["sentences"]) for s in tm["scenes"])
    print(f"words_all.json: {len(out)} / {n} sentences; skipped (length differs > 0.05 s): {skipped}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
