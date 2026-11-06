"""ch00_coordinates_sphere (#5c, Part 3) fix 1 (user rules of 2026-11-06, HOUSE_STYLE §3 "Spoken wording rules"; orchestrator note):
re-voice ONLY the four changed sentences and splice them into the build-1 narration (the final TTS); nothing else is re-synthesised.
Copied from src/ch00_coordinates_storm/checks/cst_fix0_splice.py (same method, same cue rules); only the paths and REPLACE differ.

  R1  s00 S0   the opening never says "the easy way"; the concept words carry the title pulse
  R2  s17 S0   no numbered spoken steps: "Second step: the top view." -> "Now for the top view."
  R2  s20 S9   "Second, how far ..." -> "Next, how far ..."
  R2  s20 S12  "Third, speed is ..." -> "So, speed is ..."
(S numbers 0-based.)

Method = Parts 1-2: Kokoro af_bella x1.0 with the lexicon; ONE constant gain per clip to the BS.1770-4 loudness of the nearest
unchanged neighbours in the same scene (s00 has one sentence: its neighbours are s01 S0-S1); 5-ms look-ahead limiter at -1.5 dBTP;
each clip within +-1.5 LU of each neighbour, else stop. House gaps untouched; later times shift. Captions rebuilt with tts.py's cue
rules (selftest: with no edit the rebuild equals the build-1 en.vtt).

Run in .venv-tts from the repo root (take the HEAVY lock first: TTS):
  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/cs_fix1_splice.py --selftest
  .venv-tts/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/cs_fix1_splice.py
Inputs  G:/.../ch00_coordinates_sphere/build1/tts/{narration.wav,timing.json}
Outputs G:/.../ch00_coordinates_sphere/build1/fix1/tts/{narration.wav,timing.json,captions.vtt,captions.srt,splice.json,clip_*.wav};
        movies/ch00/ch00_coordinates_sphere/{timing.json,en.vtt,en.srt,script.md}. Then make_timing.py --final <fix1/tts> (storyboard).
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
import splice_uf1fix1 as U  # noqa: E402  (lufs, true_peak, limiter)

MOV = ROOT / "movies/ch00/ch00_coordinates_sphere"
SCR = Path(r"G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_coordinates_sphere")
OLD, NEW = SCR / "build1" / "tts", SCR / "build1" / "fix1" / "tts"
# (audit item, scene id, old sentence index 0-based, [new sentences; a trailing " [beat]" marks a beat])
REPLACE = [
    ("R1", "s00_title", 0, ["In this video, we'll learn coordinates on our round Earth, and see how meteorology uses them to measure distances "
                            "and areas on its weather grids."]),
    ("R2", "s17_brest_top", 0, ["Now for the top view."]),
    ("R2", "s20_spin_rate", 9, ["Next, how far does the place travel in one turn?"]),
    ("R2", "s20_spin_rate", 12, ["So, speed is distance divided by time."]),
]
SPLIT = __import__("re").compile(r"\s*\[beat\]\s*$", __import__("re").I)


def build_cues(T: dict) -> tuple[list[str], list[str], list[str], int]:
    """tts.py's cue rules on a timing dict -> (vtt lines, srt lines, warnings, n cues). (= cf_fix1_splice.build_cues)"""
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
    T = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))
    vtt, srt, w, n = build_cues(T)
    import re

    def same(a: str, b: str) -> bool:
        """identical text; timestamps within 2 ms (timing.json keeps 4 decimals, tts.py wrote the cues from full precision)"""
        ts = re.compile(r"(\d\d):(\d\d):(\d\d)[.,](\d\d\d)")
        if ts.sub("T", a) != ts.sub("T", b):
            return False
        sec = lambda m: int(m[0]) * 3600 + int(m[1]) * 60 + int(m[2]) + int(m[3]) / 1000  # noqa: E731
        return all(abs(sec(x) - sec(y)) <= 0.002 for x, y in zip(ts.findall(a), ts.findall(b)))
    ok_v = same("\n".join(vtt), (OLD / "captions.vtt").read_text(encoding="utf-8"))
    ok_s = same("\n".join(srt), (OLD / "captions.srt").read_text(encoding="utf-8"))
    print(f"selftest: {n} cues (timing says {T['cues']}); vtt identical {ok_v}; srt identical {ok_s}; warnings {w}")
    if not (ok_v and ok_s and n == T["cues"]):
        raise SystemExit("cue rebuild differs from build 1 - stop")


def main() -> None:
    if "--selftest" in sys.argv:
        selftest(); return
    NEW.mkdir(parents=True, exist_ok=True)
    T = json.loads((OLD / "timing.json").read_text(encoding="utf-8"))
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
    ref = T["scenes"][ids.index("s03_sphere")]["sentences"][0]
    raw = synth(ref["text"]); a_ = seg(ref)[: len(raw)]; n = min(len(a_), len(raw))
    corr = float(np.corrcoef(a_[:n], raw[:n])[0, 1])
    print(f"resynth correlation {corr:.4f} on '{ref['text'][:40]}...'", flush=True)
    if corr < 0.9:
        raise SystemExit("re-synthesis does not reproduce the build-1 clip (voice/lexicon changed?) - stop")

    def level_clip(sid: str, nb_idx: list[int], text: str, tag: str) -> tuple[np.ndarray, dict]:
        S = T["scenes"][ids.index(sid)]["sentences"]
        if not nb_idx:   # a one-sentence scene (s00): level to the next scene's first two sentences
            S, nb_idx = T["scenes"][ids.index(sid) + 1]["sentences"], [0, 1]
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
              f"final {L1:.2f} LUFS, TP {tp:.2f} dBTP, ok {ok}", flush=True)
        if not ok:
            raise SystemExit("splice level check failed - stop")
        return clip_l, {"scene": sid, "neighbours": [f"S{i}" for i in nb_idx], "neighbours_lufs": [round(v, 2) for v in Ln], "target_lufs": round(target, 2),
                        "raw_lufs": round(L0, 2), "gain_db": round(gdb, 2), "limiter_gr_db": round(gr, 2), "final_lufs": round(L1, 2),
                        "true_peak_dbtp": round(tp, 2), "within_1p5_lu": ok, "dur_s": round(len(clip_l) / sr, 3), "new": text}

    edits, report = [], []
    for item, sid, j, texts in REPLACE:
        S = T["scenes"][ids.index(sid)]["sentences"]
        repl = {jj for _, ss, jj, _ in REPLACE if ss == sid}
        lo = next((i for i in range(j - 1, -1, -1) if i not in repl), None)
        hi = next((i for i in range(j + 1, len(S)) if i not in repl), None)
        nb = [i for i in (lo, hi) if i is not None]
        news = []
        for q, raw_t in enumerate(texts):
            beat = bool(SPLIT.search(raw_t))
            text = SPLIT.sub("", raw_t).strip()
            clip, rep = level_clip(sid, nb, text, f"{sid}_S{j}_{q}")
            rep.update(item=item, sentence=j, part=q, old=S[j]["text"] if q == 0 else None, old_dur_s=round(S[j]["end"] - S[j]["start"], 3) if q == 0 else None,
                       beat=beat)
            report.append(rep)
            news.append(dict(text=text, clip=clip, beat=beat))
        # within a one-to-many edit the gaps are the house ones; the gap after the last new sentence stays the old one
        if bool(S[j].get("beat")) != news[-1]["beat"]:
            raise SystemExit(f"{sid} S{j}: the last new sentence must keep the old beat flag ({S[j].get('beat')}) so the following gap is right")
        edits.append(dict(t0=S[j]["start"], t1=S[j]["end"], sid=sid, j=j, news=news, old=S[j]["text"]))
    edits.sort(key=lambda e: e["t0"])
    pieces, cur, shifts = [], 0, []
    for e in edits:
        a, b = int(round(e["t0"] * sr)), int(round(e["t1"] * sr))
        pieces.append(nar[cur:a])
        block, rel = [], []
        t_rel = 0.0
        for q, nw in enumerate(e["news"]):
            rel.append((t_rel, len(nw["clip"]) / sr))
            block.append(nw["clip"].astype(np.float32)); t_rel += len(nw["clip"]) / sr
            if q < len(e["news"]) - 1:
                g = tts.GAP_BEAT if nw["beat"] else tts.GAP_SENT
                block.append(np.zeros(int(round(g * sr)), dtype=np.float32)); t_rel += int(round(g * sr)) / sr
        blk = np.concatenate(block)
        pieces.append(blk); cur = b
        e["rel"] = rel
        shifts.append((e["t1"], len(blk) / sr - (b - a) / sr, e))
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
    # replace (back to front inside a scene so the indices stay valid)
    for _, _, e in sorted(shifts, key=lambda x: (x[2]["sid"], -x[2]["j"])):
        S = T["scenes"][ids.index(e["sid"])]["sentences"]
        s0 = S[e["j"]]["start"]
        new_entries = []
        for nw, (r0, d) in zip(e["news"], e["rel"]):
            a_txt = tts.respell(nw["text"], lex)
            new_entries.append({"text": nw["text"], "audio_text": a_txt if a_txt != nw["text"] else None, "start": round(s0 + r0, 4),
                                "end": round(s0 + r0 + d, 4), "dur": round(d, 4), **({"beat": True} if nw["beat"] else {})})
        S[e["j"]:e["j"] + 1] = new_entries
    warnings = []
    for sc in T["scenes"]:
        for k, s in enumerate(sc["sentences"]):
            s["start_frame"], s["end_frame"] = round(s["start"] * fps), round(s["end"] * fps)
            cps = len(s["text"]) / s["dur"]
            if cps > tts.MAX_CPS:
                warnings.append(f"{sc['id']} s{k + 1}: {cps:.1f} chars/s > {tts.MAX_CPS}")
            # key order as tts.py writes it
            sc["sentences"][k] = {kk: s[kk] for kk in ("text", "audio_text", "start", "end", "dur", "start_frame", "end_frame", "beat") if kk in s}
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
        old_end = k + len(e["old"])
        # the old sentence may carry " [beat]" in the script: keep the script's own marker handling by rewriting the whole run
        tail = s[old_end:old_end + 7]
        had_beat = tail == " [beat]"
        new_txt = " ".join(nw["text"] + (" [beat]" if nw["beat"] else "") for nw in e["news"])
        if had_beat:
            old_end += 7
        s = s[:k] + new_txt + s[old_end:]
    sp.write_text(s, encoding="utf-8")
    print(f"total {total:.3f} s ({T['total_frames']} frames), cues {ncues}, self-check {T['self_check']['diff_ms']} ms, warnings {warnings}")
    for _, dt, e in shifts:
        print(f"  {e['sid']} S{e['j']}: {dt:+.3f} s, {len(e['news'])} sentence(s)")


if __name__ == "__main__":
    main()
