"""UF1 fix loop 1 (v4 review 1, M1): replace four sentences of the ch00_weather_basics narration (s47 S2 and the slope
sentence, s48 S1 and S3) without re-synthesising the other 443.
Run in .venv-tts:  .venv-tts/Scripts/python.exe tools/movie_wb/splice_uf1fix1.py

Method (house rule after the #1a loudness fix):
1. each new sentence is synthesised by Kokoro (af_bella, speed 1.0, lexicon applied) exactly as tools/tts.py does;
2. level: ONE constant gain per clip so that its BS.1770-4 integrated loudness (K-weighting re-derived at 24 kHz, 400-ms
   blocks, -70 LUFS / -10 LU gates) equals the mean loudness of the old sentence's two neighbours in the narration
   (previous and next sentence, power mean); no whole-clip peak scaling;
3. a look-ahead peak limiter (5-ms look-ahead, 50-ms release, ceiling -1.5 dBTP measured on 4x oversampling) catches any
   peak above the narration's own ceiling; the gain reduction it applies is reported;
4. check: every spliced clip within +-1.5 LU of each neighbour, true peak <= -1.5 dBTP;
5. the clip replaces the old sentence's audio [start, end); the house gaps around it are unchanged; everything later
   shifts by (new - old duration); timing.json is rebuilt, captions are rebuilt from the timing with tts.py's own cue
   rules, script.md gets the new sentences.
Inputs: <scratch>/v4/uf1/tts/{narration.wav,timing.json}. Outputs: <scratch>/v4/uf1fix1/tts/{narration.wav,timing.json,
captions.vtt,captions.srt,splice.json}; movies/ch00/ch00_weather_basics/{timing.json,en.vtt,en.srt,script.md}.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools"))
import tts  # noqa: E402

MOV = ROOT / "movies/ch00/ch00_weather_basics"
SCR = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_weather_basics\v4")
OLD, NEW = SCR / "uf1" / "tts", SCR / "uf1fix1" / "tts"
REPLACE = [
    ("s47_cold_front", 1, "Here is a real slice through the air around Storm Ciarán, from the reanalysis, at six in the evening on the first "
                          "of November, running from west to east across the Bay of Biscay, right through the cold front on the map."),
    ("s47_cold_front", 5, "In this slice, it rises about one kilometre for every fifty kilometres along, and as it pushes forward, it lifts "
                          "the warm air ahead of it quickly."),
    ("s48_warm_front", 0, "Now let's move north, to a second slice that runs through Brest, where the warm front is arriving."),
    ("s48_warm_front", 2, "Instead, it glides up over the cold air: in this slice, also about one kilometre up for every fifty kilometres "
                          "along, and in many storms warm fronts slope even more gently."),
]
CEIL_DBTP, LOOK_S, REL_S, TOL_LU = -1.5, 0.005, 0.05, 1.5


# ------------------------------------------------------------------------------------- BS.1770-4 at any sample rate
def _biquads(fs: int):
    def shelf(G, Q, fc):
        A = 10 ** (G / 40); w0 = 2 * np.pi * fc / fs; al = np.sin(w0) / (2 * Q)
        b = [A * ((A + 1) + (A - 1) * np.cos(w0) + 2 * np.sqrt(A) * al), -2 * A * ((A - 1) + (A + 1) * np.cos(w0)),
             A * ((A + 1) + (A - 1) * np.cos(w0) - 2 * np.sqrt(A) * al)]
        a = [(A + 1) - (A - 1) * np.cos(w0) + 2 * np.sqrt(A) * al, 2 * ((A - 1) - (A + 1) * np.cos(w0)),
             (A + 1) - (A - 1) * np.cos(w0) - 2 * np.sqrt(A) * al]
        return np.array(b) / a[0], np.array(a) / a[0]

    def hpf(Q, fc):
        w0 = 2 * np.pi * fc / fs; al = np.sin(w0) / (2 * Q)
        b = [(1 + np.cos(w0)) / 2, -(1 + np.cos(w0)), (1 + np.cos(w0)) / 2]
        a = [1 + al, -2 * np.cos(w0), 1 - al]
        return np.array(b) / a[0], np.array(a) / a[0]
    return [shelf(4.0, 1 / np.sqrt(2), 1500.0), hpf(0.5, 38.0)]   # same constants as tools/sound/common.py


def _biquad(x: np.ndarray, b: np.ndarray, a: np.ndarray) -> np.ndarray:
    y = np.zeros_like(x)
    x1 = x2 = y1 = y2 = 0.0
    b0, b1, b2 = b; _, a1, a2 = a
    for n, xn in enumerate(x.tolist()):
        yn = b0 * xn + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
        y[n] = yn; x2, x1, y2, y1 = x1, xn, y1, yn
    return y


def lufs(x: np.ndarray, fs: int) -> float:
    y = np.asarray(x, dtype=np.float64)
    for b, a in _biquads(fs):
        y = _biquad(y, b, a)
    p = y ** 2
    w, h = int(0.4 * fs), int(0.1 * fs)
    c = np.concatenate([[0.0], np.cumsum(p)])
    st = np.arange(0, len(p) - w + 1, h)
    pw = (c[st + w] - c[st]) / w
    L = -0.691 + 10 * np.log10(np.maximum(pw, 1e-20))
    g = pw[L > -70]
    rel = -0.691 + 10 * np.log10(np.mean(g)) - 10
    g2 = pw[(L > -70) & (L > rel)]
    return float(-0.691 + 10 * np.log10(np.mean(g2)))


def true_peak(x: np.ndarray) -> float:
    n = len(x)
    up = np.fft.irfft(np.fft.rfft(np.asarray(x, np.float64)), 4 * n) * 4      # 4x band-limited oversampling (zero-padded spectrum)
    return float(20 * np.log10(np.max(np.abs(up)) + 1e-20))


def limiter(x: np.ndarray, fs: int) -> tuple[np.ndarray, float]:
    """look-ahead peak limiter: gain(t) = min over the next LOOK_S of ceil/|x|, released exponentially (REL_S)."""
    ceil = 10 ** ((CEIL_DBTP - 0.6) / 20)            # 0.6 dB margin for inter-sample peaks, checked after
    need = np.minimum(1.0, ceil / np.maximum(np.abs(x), 1e-12))
    L = max(1, int(LOOK_S * fs))
    pad = np.concatenate([need, np.ones(L)])
    win = np.lib.stride_tricks.sliding_window_view(pad, L + 1)[: len(x)].min(axis=1)
    g = np.empty_like(win); r = np.exp(-1.0 / (REL_S * fs)); cur = 1.0
    for i, w_ in enumerate(win.tolist()):
        cur = w_ if w_ < cur else w_ + (cur - w_) * r
        g[i] = cur
    return (x * g).astype(np.float32), float(20 * np.log10(g.min()))


def main() -> None:
    NEW.mkdir(parents=True, exist_ok=True)
    T = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))
    assert T == json.loads((MOV / "timing.json").read_text(encoding="utf-8")), "movie timing.json is not the UF1 TTS timing"
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
    # determinism check (information): one unchanged sentence re-synthesised
    ref = T["scenes"][ids.index("s47_cold_front")]["sentences"][2]
    raw = synth(ref["text"]); a_ = seg(ref)[: len(raw)]; n = min(len(a_), len(raw))
    corr = float(np.corrcoef(a_[:n], raw[:n])[0, 1])
    print(f"resynth correlation {corr:.4f} on '{ref['text'][:40]}…'")
    reps, report = [], []
    for sid, j, text in REPLACE:
        S = T["scenes"][ids.index(sid)]["sentences"]
        s = S[j]
        nb = [S[i] for i in (j - 1, j + 1) if 0 <= i < len(S)]
        Ln = [lufs(seg(x), sr) for x in nb]
        target = 10 * np.log10(np.mean([10 ** (v / 10) for v in Ln]))
        clip = synth(text)
        L0 = lufs(clip, sr)
        gdb = target - L0
        for _ in range(2):                      # the limiter takes a little loudness off: correct the constant gain once
            clip_l, gr = limiter(clip * 10 ** (gdb / 20), sr)
            L1 = lufs(clip_l, sr)
            gdb += target - L1
        clip_l, gr = limiter(clip * 10 ** (gdb / 20), sr)
        L1, tp = lufs(clip_l, sr), true_peak(clip_l)
        ok = all(abs(L1 - v) <= TOL_LU for v in Ln) and tp <= CEIL_DBTP + 1e-6
        report.append({"scene": sid, "sentence": j + 1, "old": s["text"], "new": text, "neighbours_lufs": [round(v, 2) for v in Ln],
                       "target_lufs": round(target, 2), "raw_lufs": round(L0, 2), "gain_db": round(gdb, 2), "limiter_gr_db": round(gr, 2),
                       "final_lufs": round(L1, 2), "true_peak_dbtp": round(tp, 2), "within_1p5_lu": ok, "dur_s": round(len(clip_l) / sr, 3)})
        print(f"{sid} S{j + 1}: neighbours {[round(v, 2) for v in Ln]} -> target {target:.2f}; raw {L0:.2f}, gain {gdb:+.2f} dB, "
              f"limiter {gr:.2f} dB, final {L1:.2f} LUFS, TP {tp:.2f} dBTP, ok {ok}")
        if not ok:
            raise SystemExit("splice level check failed - stop")
        reps.append((s["start"], s["end"], sid, j, text, clip_l, s["text"]))
    reps.sort(key=lambda x: x[0])
    pieces, cur, shifts = [], 0, []
    for t0, t1, sid, j, text, clip, old in reps:
        a, b = int(round(t0 * sr)), int(round(t1 * sr))
        pieces.append(nar[cur:a]); pieces.append(clip); cur = b
        shifts.append((t1, len(clip) / sr - (b - a) / sr, sid, j, text, len(clip) / sr, old))
    pieces.append(nar[cur:])
    out = np.concatenate(pieces)
    sf.write(NEW / "narration.wav", out, sr, subtype=subtype)
    total = len(out) / sr

    def shift(t: float, inclusive: bool = False) -> float:
        return t + sum(dt for te, dt, *_ in shifts if (t >= te - 1e-9 if inclusive else t > te + 1e-9))

    for sc in T["scenes"]:
        for s in sc["sentences"]:
            s["start"], s["end"] = round(shift(s["start"]), 4), round(shift(s["end"], inclusive=True), 4)
        sc["start"], sc["end"] = round(shift(sc["start"]), 4), round(shift(sc["end"], inclusive=True), 4)
    for te, dt, sid, j, text, dur, old in shifts:
        s = T["scenes"][ids.index(sid)]["sentences"][j]
        a_txt = tts.respell(text, lex)
        s.update(text=text, audio_text=a_txt if a_txt != text else None, dur=round(dur, 4), end=round(s["start"] + dur, 4))
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
                         "spliced_uf1fix1": {"method": "BS.1770-4 loudness match to the two neighbours + look-ahead limiter (-1.5 dBTP)",
                                             "corr_resynth": round(corr, 4), "replaced": report}})
    for d, nm in ((NEW, "captions"), (MOV, "en")):
        (d / f"{nm}.vtt").write_text("\n".join(vtt), encoding="utf-8")
        (d / f"{nm}.srt").write_text("\n".join(srt), encoding="utf-8")
    for d in (NEW, MOV):
        (d / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    (NEW / "splice.json").write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")
    sp = MOV / "script.md"
    s = sp.read_text(encoding="utf-8")
    for _, _, sid, j, text, _, old in shifts:          # replace inside the scene's own narration paragraph, not the change log
        h = s.index(chr(10) + "## " + sid + chr(10))
        k = s.index(old, h) if old in s[h:] else -1
        if k < 0:
            raise SystemExit(f"script.md: sentence not found for {sid} {j + 1}: {old}")
        s = s[:k] + text + s[k + len(old):]
    sp.write_text(s, encoding="utf-8")
    print(f"total {total:.3f} s ({T['total_frames']} frames), cues {len(merged)}, self-check {T['self_check']['diff_ms']} ms, warnings {warnings}")
    for _, dt, sid, j, text, dur, old in shifts:
        print(f"  {sid} S{j + 1}: {dt:+.3f} s, {dur:.2f} s, {len(text) / dur:.1f} cps")


if __name__ == "__main__":
    main()
