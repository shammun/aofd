"""ch00_coordinates_flat (#5a) fix loop 1 (review 1, reports/ch00_movies.md): re-voice ONLY the six changed sentences and splice them
into the build-1 narration; nothing else is re-synthesised.

  s13 S2   skip lead-in names maps (Should 5)
  s20 S20  keep line names the angle alpha (Should 6)
  s24 S2   skip lead-in says the steps are not needed for weather, climate or maps (Should 5)
  s24 S21  7.14 - 31.46 = -24.32, about minus twenty four point three (Should 3: one value, the data's -24.32)
  s24 S23  7.14 + 31.46 = 38.60 (Should 3: same inputs as the u_r line)
  s25 S12  the outflow reaches about 14 m/s (Should 4; DF25 max +14.15 m/s at 220 deg)
(S numbers 1-based.)

Method = tools/movie_wb/splice_uf2fix3.py (copied, not imported): Kokoro af_bella x1.0 with the lexicon; ONE constant gain per clip to the
BS.1770-4 loudness of the nearest unchanged neighbours in the same scene; 5-ms look-ahead limiter at -1.5 dBTP; each clip within
+-1.5 LU of each neighbour, else stop. The house gaps (0.35 s sentence, beats, scene gaps) are untouched; later times shift by the
duration change. Captions are rebuilt from the timing with tts.py's own cue rules (checked first: with no edit the rebuild must equal
the build-1 en.vtt byte for byte).

Run in .venv-tts from the repo root:
  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fix1_splice.py --selftest   # cue rebuild == build-1 en.vtt
  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_flat/checks/cf_fix1_splice.py
Inputs  G:/.../ch00_coordinates_flat/build1/tts4/{narration.wav,timing.json} (== movies/.../timing.json, asserted)
Outputs G:/.../ch00_coordinates_flat/fix1/tts/{narration.wav,timing.json,captions.vtt,captions.srt,splice.json,clip_*.wav};
        movies/ch00/ch00_coordinates_flat/{timing.json,en.vtt,en.srt,script.md}
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(ROOT / "tools" / "movie_wb"))
import tts  # noqa: E402
import splice_uf1fix1 as U  # noqa: E402  (lufs, true_peak, limiter: the BS.1770-4 code used by every splice in the series)

MOV = ROOT / "movies/ch00/ch00_coordinates_flat"
SCR = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_coordinates_flat")
OLD, NEW = SCR / "build1" / "tts4", SCR / "fix1" / "tts"
# (scene id, sentence index 0-based, new text)
REPLACE = [
    ("s13_components", 1, "If you'd rather keep the big picture, skip ahead to the time on screen; you won't miss anything you need for "
                          "weather, climate or maps."),
    ("s20_polar_is_turned", 19, "If you skipped, here's what to keep: turning the axes by an angle alpha changes the numbers that describe an "
                                "arrow, but not the arrow itself, and polar parts are just axes turned by theta."),
    ("s24_ring_points", 1, "You don't need these steps for the intuition of weather, climate science or maps, so if that feels like too much, "
                           "skip ahead to the time on screen."),
    ("s24_ring_points", 20, "That's seven point one four minus thirty one point four six, about minus twenty four point three: in."),
    ("s24_ring_points", 22, "That's seven point one four plus thirty one point four six, about thirty eight point six: round."),
    ("s25_why_polar_storm", 11, "It's negative at fifty eight of the seventy two points, and only on the southwest side does it blow outward, "
                                "by up to about fourteen metres per second."),
]


def build_cues(T: dict) -> tuple[list[str], list[str], list[str], int]:
    """tts.py's cue rules on a timing dict -> (vtt lines, srt lines, warnings, n cues)."""
    warnings: list[str] = []
    cues = []
    for sc in T["scenes"]:
        for s in sc["sentences"]:
            parts = tts.split_for_cues(s["text"], s["dur"])
            nch = sum(len(p) for p in parts)
            c0 = s["start"]
            for p in parts:
                c1 = c0 + s["dur"] * len(p) / nch
                cues.append((c0, c1, p)); c0 = c1
    merged: list[list] = []
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
    return vtt, srt, warnings, len(merged)


def selftest() -> None:
    T = json.loads((MOV / "timing.json").read_text(encoding="utf-8"))
    vtt, srt, w, n = build_cues(T)
    ok_v = "\n".join(vtt) == (MOV / "en.vtt").read_text(encoding="utf-8")
    ok_s = "\n".join(srt) == (MOV / "en.srt").read_text(encoding="utf-8")
    print(f"selftest: {n} cues (timing says {T['cues']}); vtt identical {ok_v}; srt identical {ok_s}; warnings {w}")
    if not (ok_v and ok_s and n == T["cues"]):
        raise SystemExit("cue rebuild differs from build 1 - stop")


def main() -> None:
    if "--selftest" in sys.argv:
        selftest(); return
    NEW.mkdir(parents=True, exist_ok=True)
    T = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))
    assert T == json.loads((MOV / "timing.json").read_text(encoding="utf-8")), "movie timing.json is not the build-1 tts4 timing"
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
    ref = T["scenes"][ids.index("s22_spin_inflow")]["sentences"][1]
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
        edits.append(dict(t0=S[j]["start"], t1=S[j]["end"], sid=sid, j=j, text=text, clip=clip, old=S[j]["text"]))
    edits.sort(key=lambda e: e["t0"])
    pieces, cur, shifts = [], 0, []
    for e in edits:
        a, b = int(round(e["t0"] * sr)), int(round(e["t1"] * sr))
        pieces.append(nar[cur:a]); pieces.append(e["clip"].astype(np.float32)); cur = b
        shifts.append((e["t1"], len(e["clip"]) / sr - (b - a) / sr, e))
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
    for _, _, e in shifts:
        s = T["scenes"][ids.index(e["sid"])]["sentences"][e["j"]]
        a_txt = tts.respell(e["text"], lex)
        dur = len(e["clip"]) / sr
        s.update(text=e["text"], audio_text=a_txt if a_txt != e["text"] else None, dur=round(dur, 4), end=round(s["start"] + dur, 4))
    warnings = []
    for sc in T["scenes"]:
        for k, s in enumerate(sc["sentences"]):
            s["start_frame"], s["end_frame"] = round(s["start"] * fps), round(s["end"] * fps)
            cps = len(s["text"]) / s["dur"]
            if cps > tts.MAX_CPS:
                warnings.append(f"{sc['id']} s{k + 1}: {cps:.1f} chars/s > {tts.MAX_CPS}")
        sc["start_frame"], sc["end_frame"] = round(sc["start"] * fps), round(sc["end"] * fps)
    vtt, srt, cw, ncues = build_cues(T)
    warnings += cw
    exp = T["scenes"][-1]["end"]
    prev = T.get("self_check", {})
    T.update(total_s=round(total, 4), total_frames=int(np.ceil(total * fps)), cues=ncues, warnings=warnings,
             self_check={**{k: v for k, v in prev.items() if k not in ("expected_s", "audio_s", "diff_ms", "len_ok", "cues_ok")},
                         "expected_s": round(exp, 4), "audio_s": round(total, 4), "diff_ms": round((total - exp) * 1000, 2),
                         "len_ok": abs(total - exp) <= 1 / fps, "cues_ok": True,
                         "spliced_fix1": {"method": "BS.1770-4 loudness match to the nearest unchanged neighbours + look-ahead limiter (-1.5 dBTP)",
                                          "corr_resynth": round(corr, 4), "replaced": report}})
    for d, nm in ((NEW, "captions"), (MOV, "en")):
        (d / f"{nm}.vtt").write_text("\n".join(vtt), encoding="utf-8")
        (d / f"{nm}.srt").write_text("\n".join(srt), encoding="utf-8")
    for d in (NEW, MOV):
        (d / "timing.json").write_text(json.dumps(T, indent=1, ensure_ascii=False), encoding="utf-8")
    (NEW / "splice.json").write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")
    sp = MOV / "script.md"
    s = sp.read_text(encoding="utf-8")
    for _, _, e in shifts:          # inside the scene's own narration paragraph, not the README
        h = s.index(chr(10) + "## " + e["sid"] + chr(10))
        if e["old"] not in s[h:]:
            raise SystemExit(f"script.md: sentence not found for {e['sid']}: {e['old']}")
        k = s.index(e["old"], h)
        s = s[:k] + e["text"] + s[k + len(e["old"]):]
    sp.write_text(s, encoding="utf-8")
    print(f"total {total:.3f} s ({T['total_frames']} frames), cues {ncues}, self-check {T['self_check']['diff_ms']} ms, warnings {warnings}")
    for _, dt, e in shifts:
        print(f"  {e['sid']} S{e['j'] + 1}: {dt:+.3f} s, {len(e['clip']) / sr:.2f} s, {len(e['text']) / (len(e['clip']) / sr):.1f} cps")


if __name__ == "__main__":
    main()
