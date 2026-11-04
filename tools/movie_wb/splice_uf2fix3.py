"""UF2 fix loop 3 (series audit, reports/ch00_series_audit.md): map reading is not the next video (it starts about 36 movies
later), so two sentences change; nothing else is re-synthesised.
  s50 S3   "You'll learn to read these maps in detail in the next video." -> "Later in this series, you'll learn to read these maps in detail."
  s59 S2   "In the next video, we'll learn to read weather maps like this one in detail."
           -> "Later in this series, we'll learn to read weather maps like this one in detail."
  (s59 S3 "And later videos will explain why the wind circles…" and the Coriolis lines stay: they are true.)
Run in .venv-tts:  .venv-tts/Scripts/python.exe tools/movie_wb/splice_uf2fix3.py

Method = splice_uf2fix2.py (copied): Kokoro af_bella 1.0 with the lexicon; ONE constant gain per clip to the BS.1770-4 loudness of the
nearest unchanged neighbours (s50 S3 is the scene's last sentence: its one neighbour S2); 5-ms look-ahead limiter at -1.5 dBTP; every
clip within +-1.5 LU of each neighbour. Inputs: <scratch>/uf2/fix2/tts/{narration.wav,timing.json}. Outputs: <scratch>/uf2/fix3/tts/…;
movies/ch00/ch00_weather_basics/{timing.json,en.vtt,en.srt,script.md}.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(ROOT / "tools" / "movie_wb"))
import tts  # noqa: E402
import splice_uf1fix1 as U  # noqa: E402  (lufs, true_peak, limiter: the same BS.1770-4 code)

MOV = ROOT / "movies/ch00/ch00_weather_basics"
SCR = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_weather_basics\uf2")
OLD, NEW = SCR / "fix2" / "tts", SCR / "fix3" / "tts"
GAP = 0.35
REPLACE = [
    ("s50_front_symbols", 2, "Later in this series, you'll learn to read these maps in detail."),
    ("s59_ciaran_after", 1, "Later in this series, we'll learn to read weather maps like this one in detail."),
]
INSERT: list[tuple[str, int, str]] = []


def main() -> None:
    NEW.mkdir(parents=True, exist_ok=True)
    T = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))
    assert T == json.loads((MOV / "timing.json").read_text(encoding="utf-8")), "movie timing.json is not the UF2 fix-2 timing"
    nar, sr = sf.read(OLD / "narration.wav", dtype="float32")
    subtype = sf.info(str(OLD / "narration.wav")).subtype
    fps = T["fps"]
    from kokoro import KPipeline
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    lex = tts.load_lexicon()

    def synth(text: str) -> np.ndarray:
        return np.concatenate([np.asarray(c, dtype=np.float32) for _, _, c in pipe(tts.respell(text, lex), voice="af_bella", speed=1.0)])

    ids = [s["id"] for s in T["scenes"]]
    seg = lambda s: nar[int(round(s["start"] * sr)): int(round(s["end"] * sr))]  # noqa: E731
    ref = T["scenes"][ids.index("s48b_front_stack")]["sentences"][4]
    raw = synth(ref["text"]); a_ = seg(ref)[: len(raw)]; n = min(len(a_), len(raw))
    corr = float(np.corrcoef(a_[:n], raw[:n])[0, 1])
    print(f"resynth correlation {corr:.4f} on '{ref['text'][:40]}…'")

    def level_clip(sid: str, nb_idx: list[int], text: str, tag: str) -> tuple[np.ndarray, dict]:
        S = T["scenes"][ids.index(sid)]["sentences"]
        Ln = [U.lufs(seg(S[i]), sr) for i in nb_idx]
        target = 10 * np.log10(np.mean([10 ** (v / 10) for v in Ln]))
        clip = synth(text)
        L0 = U.lufs(clip, sr)
        gdb = target - L0
        for _ in range(2):
            clip_l, gr = U.limiter(clip * 10 ** (gdb / 20), sr)
            gdb += target - U.lufs(clip_l, sr)
        clip_l, gr = U.limiter(clip * 10 ** (gdb / 20), sr)
        L1, tp = U.lufs(clip_l, sr), U.true_peak(clip_l)
        ok = all(abs(L1 - v) <= U.TOL_LU for v in Ln) and tp <= U.CEIL_DBTP + 1e-6
        sf.write(NEW / f"clip_{tag}.wav", clip_l, sr, subtype=subtype)
        print(f"{tag}: neighbours {[round(v, 2) for v in Ln]} -> target {target:.2f}; raw {L0:.2f}, gain {gdb:+.2f} dB, limiter {gr:.2f} dB, "
              f"final {L1:.2f} LUFS, TP {tp:.2f} dBTP, ok {ok}")
        if not ok:
            raise SystemExit("splice level check failed - stop")
        return clip_l, {"scene": sid, "neighbours": [f"S{i + 1}" for i in nb_idx], "neighbours_lufs": [round(v, 2) for v in Ln], "target_lufs": round(target, 2),
                        "raw_lufs": round(L0, 2), "gain_db": round(gdb, 2), "limiter_gr_db": round(gr, 2), "final_lufs": round(L1, 2),
                        "true_peak_dbtp": round(tp, 2), "within_1p5_lu": ok, "dur_s": round(len(clip_l) / sr, 3), "new": text}

    edits, report = [], []
    for sid, j, text in REPLACE:
        S = T["scenes"][ids.index(sid)]["sentences"]
        repl = {jj for ss, jj, _ in REPLACE if ss == sid}
        lo = next((i for i in range(j - 1, -1, -1) if i not in repl), None)
        hi = next((i for i in range(j + 1, len(S)) if i not in repl), None)
        clip, rep = level_clip(sid, [i for i in (lo, hi) if i is not None], text, f"{sid}_S{j + 1}")
        rep.update(sentence=j + 1, old=S[j]["text"], old_dur_s=round(S[j]["end"] - S[j]["start"], 3))
        report.append(rep)
        edits.append(dict(kind="rep", t0=S[j]["start"], t1=S[j]["end"], sid=sid, j=j, text=text, clip=clip, old=S[j]["text"]))
    for sid, j, text in INSERT:
        S = T["scenes"][ids.index(sid)]["sentences"]
        clip, rep = level_clip(sid, [j, j - 1], text, f"{sid}_ins{j + 2}")
        rep.update(sentence=j + 2, inserted=True)
        report.append(rep)
        sil = np.zeros((int(round(GAP * sr)),) + nar.shape[1:], dtype=np.float32)
        edits.append(dict(kind="ins", t0=S[j]["end"], t1=S[j]["end"], sid=sid, j=j, text=text, clip=clip, sil=sil, old=S[j]["text"]))
    edits.sort(key=lambda e: e["t0"])
    pieces, cur, shifts = [], 0, []
    for e in edits:
        a, b = int(round(e["t0"] * sr)), int(round(e["t1"] * sr))
        pieces.append(nar[cur:a])
        if e["kind"] == "ins":
            pieces.append(e["sil"])
        c = e["clip"] if nar.ndim == e["clip"].ndim else e["clip"]
        pieces.append(c); cur = b
        add = len(c) + (len(e["sil"]) if e["kind"] == "ins" else 0)
        # an insertion follows its sentence: that sentence's own end does not move (te just above it)
        shifts.append(((e["t1"] + 0.001) if e["kind"] == "ins" else e["t1"], add / sr - (b - a) / sr, e))
    pieces.append(nar[cur:])
    out = np.concatenate(pieces)
    sf.write(NEW / "narration.wav", out, sr, subtype=subtype)
    total = len(out) / sr

    def shift(t: float, inclusive: bool = False) -> float:
        return t + sum(dt for te, dt, _ in shifts if (t >= te - 1e-9 if inclusive else t > te + 1e-9))

    for sc in T["scenes"]:
        for s in sc["sentences"]:
            s["start"], s["end"] = round(shift(s["start"]), 4), round(shift(s["end"], inclusive=True), 4)
        sc["start"], sc["end"] = round(shift(sc["start"]), 4), round(shift(sc["end"], inclusive=True), 4)
    for te, dt, e in shifts:
        S = T["scenes"][ids.index(e["sid"])]["sentences"]
        a_txt = tts.respell(e["text"], lex)
        dur = len(e["clip"]) / sr
        if e["kind"] == "rep":
            s = S[e["j"]]
            s.update(text=e["text"], audio_text=a_txt if a_txt != e["text"] else None, dur=round(dur, 4), end=round(s["start"] + dur, 4))
    for te, dt, e in shifts:      # after the replacements: insertion indices are per-scene and each scene here has one kind of edit
        if e["kind"] == "ins":
            S = T["scenes"][ids.index(e["sid"])]["sentences"]
            st = S[e["j"]]["end"] + GAP
            a_txt = tts.respell(e["text"], lex)
            dur = len(e["clip"]) / sr
            S.insert(e["j"] + 1, {"text": e["text"], "audio_text": a_txt if a_txt != e["text"] else None, "start": round(st, 4), "end": round(st + dur, 4), "dur": round(dur, 4)})
    warnings = []
    for sc in T["scenes"]:
        for k, s in enumerate(sc["sentences"]):
            s["start_frame"], s["end_frame"] = round(s["start"] * fps), round(s["end"] * fps)
            cps = len(s["text"]) / s["dur"]
            if cps > tts.MAX_CPS:
                warnings.append(f"{sc['id']} s{k + 1}: {cps:.1f} chars/s > {tts.MAX_CPS}")
        sc["start_frame"], sc["end_frame"] = round(sc["start"] * fps), round(sc["end"] * fps)
    cues = []
    for sc in T["scenes"]:
        for s in sc["sentences"]:
            parts = tts.split_for_cues(s["text"], s["dur"])
            nch = sum(len(p) for p in parts)
            c0 = s["start"]
            for p in parts:
                c1 = c0 + s["dur"] * len(p) / nch
                cues.append((c0, c1, p)); c0 = c1
    merged = []
    for c in cues:
        if merged and merged[-1][1] - merged[-1][0] < tts.CUE_MIN and len(tts.wrap(merged[-1][2] + " " + c[2])) <= tts.MAX_LINES:
            merged[-1] = [merged[-1][0], c[1], merged[-1][2] + " " + c[2]]
        else:
            merged.append(list(c))
    for i in range(len(merged) - 1):  # review 2 Should 25: a cue that could not merge borrows from the contiguous next cue (house range 1-7 s)
        if merged[i][1] - merged[i][0] < tts.CUE_MIN and abs(merged[i + 1][0] - merged[i][1]) < 1e-6:
            merged[i][1] = merged[i + 1][0] = merged[i][0] + tts.CUE_MIN
    vtt, srt = ["WEBVTT", ""], []
    for i, (c0, c1, txt) in enumerate(merged, 1):
        lines = tts.wrap(txt)
        if c1 - c0 > tts.CUE_MAX + 1e-6 or len(lines) > tts.MAX_LINES:
            warnings.append(f"cue {i}: {c1 - c0:.1f} s / {len(lines)} lines out of house limits")
        vtt += [f"{tts.fmt_ts(c0, '.')} --> {tts.fmt_ts(c1, '.')}", *lines, ""]
        srt += [str(i), f"{tts.fmt_ts(c0, ',')} --> {tts.fmt_ts(c1, ',')}", *lines, ""]
    exp = T["scenes"][-1]["end"]
    prev = T.get("self_check", {})
    T.update(total_s=round(total, 4), total_frames=int(np.ceil(total * fps)), cues=len(merged), warnings=warnings,
             self_check={**{k: v for k, v in prev.items() if k not in ("expected_s", "audio_s", "diff_ms", "len_ok", "cues_ok")},
                         "expected_s": round(exp, 4), "audio_s": round(total, 4), "diff_ms": round((total - exp) * 1000, 2),
                         "len_ok": abs(total - exp) <= 1 / fps, "cues_ok": all(0 <= a < b <= total + 1e-6 for a, b, _ in merged),
                         "spliced_uf2fix3": {"method": "BS.1770-4 loudness match to the two nearest unchanged neighbours + look-ahead limiter (-1.5 dBTP)",
                                             "corr_resynth": round(corr, 4), "replaced": report}})
    for d, nm in ((NEW, "captions"), (MOV, "en")):
        (d / f"{nm}.vtt").write_text("\n".join(vtt), encoding="utf-8")
        (d / f"{nm}.srt").write_text("\n".join(srt), encoding="utf-8")
    for d in (NEW, MOV):
        (d / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    (NEW / "splice.json").write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")
    sp = MOV / "script.md"
    s = sp.read_text(encoding="utf-8")
    for _, _, e in shifts:          # inside the scene's own narration paragraph, not the change log
        h = s.index(chr(10) + "## " + e["sid"] + chr(10))
        if e["old"] not in s[h:]:
            raise SystemExit(f"script.md: sentence not found for {e['sid']}: {e['old']}")
        k = s.index(e["old"], h)
        s = (s[:k] + e["text"] + s[k + len(e["old"]):]) if e["kind"] == "rep" else (s[:k + len(e["old"])] + " " + e["text"] + s[k + len(e["old"]):])
    sp.write_text(s, encoding="utf-8")
    print(f"total {total:.3f} s ({T['total_frames']} frames), cues {len(merged)}, self-check {T['self_check']['diff_ms']} ms, warnings {warnings}")
    for _, dt, e in shifts:
        print(f"  {e['sid']} {e['kind']}: {dt:+.3f} s, {len(e['clip']) / sr:.2f} s, {len(e['text']) / (len(e['clip']) / sr):.1f} cps")


if __name__ == "__main__":
    main()
