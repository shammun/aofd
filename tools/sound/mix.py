"""Cue sheet → final movie soundtrack: narration + a music bed in the movie's style + timed sound effects, ducked
under the voice, normalised to −16 LUFS (true peak ≤ −1.5 dBTP), with a credits JSON and a sound-captions sidecar.

Run with the main venv::

    .venv/Scripts/python.exe tools/sound/mix.py --narration narration.wav --cues sound.yaml --out-dir <dir>
        [--timing timing.json] [--check-only]

Writes into ``--out-dir``:

* ``narration_music.wav`` — the mix (44.1 kHz stereo 16-bit, −16 LUFS integrated, true peak ≤ −1.5 dBTP);
* ``music.wav`` — the music bed alone at its bed loudness (−28 LUFS by default), not ducked;
* ``sfx.wav`` — the effects stem, ducked, at the level it has in the mix before the final gain (review aid);
* ``sound.json`` — every sound used (music style, key, seed; each effect with its start, duration, seed, source and
  licence; measured loudness) for the manifest credits;
* ``sound_captions.json`` — the bracketed sound captions (``[waves breaking]``) with their times, for the captions
  writer and for ``tools/movie_qa.py --sound-cues``.

Cue sheet (YAML; times in seconds; a cue starts either ``at`` an absolute time or at ``scene`` + ``offset`` using the
movie's ``timing.json``)::

    music:
      style: air-flowing        # tools/sound/styles.py list
      seed: 11
      bed_lufs: -28             # the bed on its own (house rule)
      duck_db: 5                # music drop under speech
      tail_s: 2.5               # music after the narration ends
    timing: timing.json         # optional, relative to this file; needed for scene cues
    sfx_duck_db: 5              # effects drop under speech too
    effects:
      - effect: waves_breaking  # tools/sound/sfx.py list
        scene: s05              # a timing.json scene id, or its prefix before "_"
        offset: 1.2             # seconds after the scene starts (or use `at: 63.4`)
        duration: 9
        intensity: 0.6
        lufs: -27               # loudest short-term level in the FINAL mix, before ducking: −30 … −24
        fade_in: 0.3
        fade_out: 1.5
        seed: 3
        params: {first: 0.8}    # effect-specific keyword arguments
        caption: "[waves breaking]"   # only where the sound carries meaning; omit otherwise
        caption_s: 3            # how long the caption shows (default min(duration, 4))
      - sample: {path: "G:/Geophysical Fluid Dynamics/aofd-data/raw/SFX/x.wav", licence: CC0-1.0,
                 source: "https://…", registry: SFX-x}   # a recorded CC0 file instead of a synthesised effect
        at: 80.0
        duration: 4

Rules enforced (HOUSE_STYLE §8): never two effects at once unless one of them is a bed (rain, wind, surf, stream,
storm, waves); at most two at once; each effect's level −30 … −24 LUFS short-term; music and effects ducked under
speech (0.25-s attack, 1.2-s release, the same speech mask as ``tools/music.py``). The report says, per effect, how
far it sits under the voice (``voice_margin_lu``); a margin under 10 LU is flagged.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
import yaml

TOOLS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(TOOLS))
import music  # noqa: E402  (tools/music.py: speech mask, ffmpeg loudnorm)
from sound import sfx, styles  # noqa: E402
from sound.common import (SR, fade, integrated_lufs, momentary_lufs, read_wav, short_term_lufs,  # noqa: E402
                          true_peak_dbtp, write_wav)

ALLOWED_SAMPLE_LICENCES = {"CC0-1.0", "CC0", "public domain", "own"}
LUFS_RANGE = (-30.0, -24.0)


def effect_level(x: np.ndarray) -> float:
    """Loudest short-term loudness (3-s window); for effects shorter than 3 s the loudest momentary (0.4-s) value."""
    if len(x) >= 3 * SR:
        return float(np.max(short_term_lufs(x)))
    return float(np.max(momentary_lufs(x)))


def scene_start(timing: dict | None, scene: str) -> float:
    if timing is None:
        raise SystemExit(f"cue uses scene '{scene}' but no timing.json was given")
    for sc in timing.get("scenes", []):
        sid = str(sc.get("id", ""))
        if sid == scene or sid.split("_")[0] == scene:
            return float(sc["start"])
    raise SystemExit(f"scene '{scene}' not in timing.json")


def resolve(cues: list[dict], timing: dict | None) -> list[dict]:
    out = []
    for k, c in enumerate(cues):
        c = dict(c)
        if "at" in c:
            start = float(c["at"])
        elif "scene" in c:
            start = scene_start(timing, str(c["scene"])) + float(c.get("offset", 0.0))
        else:
            raise SystemExit(f"cue {k}: give `at` or `scene` (+ `offset`)")
        name = c.get("effect") or "sample"
        c.update(index=k, name=name, start=start, duration=float(c["duration"]),
                 bed=bool(c.get("bed", name in sfx.BEDS)))
        out.append(c)
    return sorted(out, key=lambda c: c["start"])


def overlap_problems(cues: list[dict]) -> list[str]:
    """House rule: never two effects at once unless one is a bed; never more than two at once."""
    bad = []
    for i, a in enumerate(cues):
        for b in cues[i + 1:]:
            if b["start"] < a["start"] + a["duration"] and a["start"] < b["start"] + b["duration"]:
                if not (a["bed"] or b["bed"]):
                    bad.append(f"cue {a['index']} ({a['name']}) overlaps cue {b['index']} ({b['name']}) and neither "
                               "is a bed")
    for c in cues:                                          # at most two sounding at any cue start
        t = c["start"] + 1e-6
        live = [d for d in cues if d["start"] <= t < d["start"] + d["duration"]]
        if len(live) > 2:
            bad.append(f"{len(live)} effects at once at {t:.2f} s: {[d['name'] for d in live]}")
    return sorted(set(bad))


def render_cue(c: dict) -> tuple[np.ndarray, dict]:
    if "sample" in c:
        s = c["sample"]
        if str(s.get("licence", "")).strip() not in ALLOWED_SAMPLE_LICENCES:
            raise SystemExit(f"sample {s.get('path')}: licence {s.get('licence')!r} not allowed "
                             f"(allowed: {sorted(ALLOWED_SAMPLE_LICENCES)})")
        x = read_wav(Path(s["path"])).astype(np.float32)
        n = int(c["duration"] * SR)
        if len(x) < n:                                      # loop with a 0.5-s crossfade
            xf = int(0.5 * SR)
            while len(x) < n:
                head = x[:len(x)]
                w = np.linspace(0, 1, xf)[:, None]
                x = np.concatenate([x[:-xf], x[-xf:] * (1 - w) + head[:xf] * w, head[xf:]])
        x = x[:n]
        src = {"source": s.get("source", s["path"]), "licence": s["licence"], "registry": s.get("registry"),
               "file": Path(s["path"]).name}
    else:
        kw = dict(c.get("params") or {})
        x = sfx.render(c["effect"], c["duration"], c.get("intensity"), int(c.get("seed", 0)), **kw).astype(np.float32)
        x = x[: int(c["duration"] * SR)]
        src = {"source": "tools/sound/sfx.py (procedural synthesis, our own code)", "licence": "CC0-1.0"}
    x = fade(x, float(c.get("fade_in", 0.05)), float(c.get("fade_out", 0.3)))
    return x, src


def build(narration: Path, cue_path: Path, out_dir: Path, timing_path: Path | None = None,
          check_only: bool = False, target: float = -16.0, tp: float = -1.5) -> dict:
    sheet = yaml.safe_load(cue_path.read_text(encoding="utf-8")) or {}
    mus = {"style": "maths-calm", "seed": 7, "bed_lufs": -28.0, "duck_db": 5.0, "tail_s": 2.5}
    mus.update(sheet.get("music") or {})
    sfx_duck = float(sheet.get("sfx_duck_db", 5.0))
    if timing_path is None and sheet.get("timing"):
        timing_path = (cue_path.parent / sheet["timing"]).resolve()
    timing = json.loads(Path(timing_path).read_text(encoding="utf-8")) if timing_path else None
    cues = resolve(sheet.get("effects") or [], timing)
    problems = overlap_problems(cues)
    for c in cues:
        lv = float(c.get("lufs", -27.0))
        if not LUFS_RANGE[0] <= lv <= LUFS_RANGE[1]:
            problems.append(f"cue {c['index']} ({c['name']}): lufs {lv} outside {LUFS_RANGE}")
    if problems:
        raise SystemExit("cue sheet rejected:\n  " + "\n  ".join(problems))

    v = read_wav(narration).astype(np.float32)
    n = len(v) + int(float(mus["tail_s"]) * SR)
    end_s = n / SR
    for c in cues:
        if c["start"] < 0 or c["start"] + c["duration"] > end_s + 1e-6:
            raise SystemExit(f"cue {c['index']} ({c['name']}) runs outside the soundtrack (0 … {end_s:.2f} s)")
    if check_only:
        return {"ok": True, "cues": len(cues), "soundtrack_s": end_s}
    v = np.pad(v, ((0, n - len(v)), (0, 0)))
    mask = music.speech_mask(v)

    # music bed at bed_lufs on its own, ducked under speech
    m = styles.compose(str(mus["style"]), end_s, int(mus["seed"])).astype(np.float32)[:n]
    m = np.pad(m, ((0, n - len(m)), (0, 0)))
    m *= 10 ** ((float(mus["bed_lufs"]) - integrated_lufs(m)) / 20)
    out_dir.mkdir(parents=True, exist_ok=True)
    write_wav(out_dir / "music.wav", m)
    m_duck = m * (10 ** (-float(mus["duck_db"]) * mask / 20))[:, None]

    # the final gain the loudness normaliser will apply (≈ voice + bed), so effect levels are set for the final mix
    g_final_db = target - integrated_lufs(v + m_duck)
    fx = np.zeros((n, 2), dtype=np.float32)
    used = []
    sfx_gain = (10 ** (-sfx_duck * mask / 20))[:, None]
    for c in cues:
        x, src = render_cue(c)
        want = float(c.get("lufs", -27.0)) - g_final_db           # premix level that lands on `lufs` after the gain
        x *= 10 ** ((want - effect_level(x)) / 20)
        i0 = int(round(c["start"] * SR))
        seg = slice(i0, min(n, i0 + len(x)))
        xd = x[: seg.stop - seg.start] * sfx_gain[seg]
        fx[seg] += xd
        # how far the (ducked) effect sits under the voice where they coincide
        vs = v[seg]
        voiced = mask[seg] > 0.5
        if np.any(voiced) and len(vs) >= int(0.4 * SR):
            v_lv = float(np.percentile(momentary_lufs(vs)[momentary_lufs(vs) > -60], 50)) \
                if np.any(momentary_lufs(vs) > -60) else float("-inf")
            fx_lv = float(np.max(momentary_lufs(xd)))
            margin = round(v_lv - fx_lv, 1)
        else:
            margin = None
        cap = c.get("caption")                                    # captions only where asked for (meaningful)
        row = {"name": c["name"], "start_s": round(c["start"], 3), "duration_s": c["duration"],
               "intensity": c.get("intensity"), "seed": c.get("seed", 0), "params": c.get("params") or {},
               "bed": c["bed"], "target_lufs_final": float(c.get("lufs", -27.0)),
               "final_level_lufs": round(effect_level(x) + g_final_db, 2), "voice_margin_lu": margin,
               "caption": cap, **src}
        if c.get("scene"):
            row.update(scene=c["scene"], offset_s=float(c.get("offset", 0.0)))
        used.append(row)
    write_wav(out_dir / "sfx.wav", fx)

    raw = out_dir / "narration_music_raw.wav"
    write_wav(raw, v + m_duck + fx)
    stats = music.loudnorm(raw, out_dir / "narration_music.wav", target, tp)
    raw.unlink()
    final = read_wav(out_dir / "narration_music.wav").astype(np.float32)
    meas = {"integrated_lufs": round(integrated_lufs(final), 2), "true_peak_dbtp": round(true_peak_dbtp(final), 2)}
    try:
        sys.path.insert(0, str(TOOLS))
        import movie_qa
        meas["ffmpeg_ebur128"] = movie_qa.ebur128(out_dir / "narration_music.wav")
    except Exception as e:                                       # pragma: no cover
        meas["ffmpeg_ebur128"] = f"unavailable: {e}"
    warnings = [f"{u['name']} at {u['start_s']} s sits only {u['voice_margin_lu']} LU under the voice"
                for u in used if u["voice_margin_lu"] is not None and u["voice_margin_lu"] < 10]
    warnings += [f"{u['name']} at {u['start_s']} s final level {u['final_level_lufs']} LUFS outside −31…−23"
                 for u in used if not -31.0 <= u["final_level_lufs"] <= -23.0]
    caps = []
    for c, u in zip(cues, used):
        if u["caption"]:
            caps.append({"start": round(c["start"], 3),
                         "end": round(c["start"] + float(c.get("caption_s", min(c["duration"], 4.0))), 3),
                         "text": u["caption"], "effect": u["name"]})
    (out_dir / "sound_captions.json").write_text(json.dumps({"sound_cues": caps}, indent=1, ensure_ascii=False),
                                                 encoding="utf-8")
    report = {
        "narration": str(narration), "cue_sheet": str(cue_path), "soundtrack_s": round(end_s, 3),
        "music": {**styles.info(str(mus["style"])), "seed": int(mus["seed"]), "bed_lufs": float(mus["bed_lufs"]),
                  "duck_db": float(mus["duck_db"]), "tail_s": float(mus["tail_s"])},
        "effects": used, "sfx_duck_db": sfx_duck, "final_gain_db_estimate": round(g_final_db, 2),
        "mix": {"target_lufs": target, "true_peak_limit_dbtp": tp, "premix_lufs_ffmpeg": float(stats["input_i"]),
                **meas},
        "credits": sorted({f"{u['name']}: {u['source']} ({u['licence']})" for u in used}
                          | {f"music ({mus['style']}, seed {mus['seed']}): tools/sound/styles.py, our own (CC0-1.0)"}),
        "warnings": warnings,
    }
    (out_dir / "sound.json").write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")
    return report


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--narration", type=Path, required=True)
    ap.add_argument("--cues", type=Path, required=True)
    ap.add_argument("--out-dir", type=Path, required=True)
    ap.add_argument("--timing", type=Path)
    ap.add_argument("--check-only", action="store_true", help="validate the cue sheet (times, overlaps, levels) only")
    a = ap.parse_args()
    r = build(a.narration, a.cues, a.out_dir, a.timing, a.check_only)
    print(json.dumps(r, indent=1, ensure_ascii=False))
    ok = r.get("ok", True)
    if not a.check_only:
        L = r["mix"]
        ok = abs(L["integrated_lufs"] - (-16.0)) <= 0.5 and L["true_peak_dbtp"] <= -1.5 + 0.05
        print(f"mix: {L['integrated_lufs']} LUFS, true peak {L['true_peak_dbtp']} dBTP -> {'PASS' if ok else 'FAIL'}"
              + (f"; {len(r['warnings'])} warning(s)" if r["warnings"] else ""))
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
