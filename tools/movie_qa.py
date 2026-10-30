"""Automatic QA gates for a rendered movie (R1 §5.3, PLANNING §8.4). Uses ffprobe/ffmpeg from PATH.

Usage (main venv)::

    .venv/Scripts/python.exe tools/movie_qa.py <movie.mp4> [--storyboard movies/chNN/<slug>/storyboard.yaml]
        [--captions captions.vtt] [--script script.md] [--manifest manifest.json] [--composition movies/src/chNN/X.tsx]
        [--id chNN_slug] [--duration SECONDS] [--duration-window 120,180] [--budget-mb 25] [--hard-mb 40]
        [--no-audio-ok] [--frames-only] [--no-content] [--content-only] [--content-frac 0.002] [--content-max 1.5]
        [--half-warn 3] [--half-max 10]
    .venv/Scripts/python.exe tools/movie_qa.py --framemd5 a.mp4 b.mp4      # determinism: compare per-frame hashes

Gates (each PASS / FAIL / SKIP with a reason; exit 0 only when no gate FAILs):

| gate | fails when |
|---|---|
| duration | outside --duration-window (default 120–180 s), or > ±3 % from --duration / the storyboard target |
| size | > --budget-mb (default 25) — FAIL above --hard-mb (default 40), WARN between |
| codec | video not H.264 High (or Main for tiny clips) yuv420p, audio not AAC, or moov atom not before mdat (faststart) |
| black | black > 0.5 s outside the first/last 0.5 s (blackdetect) |
| frozen | a frozen stretch > 4 s (freezedetect) holding > 4 s of silence (narration from timing.json; without one, any) |
| content | the content area (y 40–835; the source-line band y ≥ 835 is masked) has < --content-frac (0.2 %) of its pixels off the house background #171f33 for > --content-max (1.5 s), sampled every 0.5 s at 480 px — a navy "blank screen" the black gate cannot see (added 2026-10-28, ch00_weather_basics review 1 M1) |
| halves | the picture zone (x 80–1000) or the maths zone (x 1060–1840) is empty that way for > --half-max (10 s); WARN above --half-warn (3 s), HOUSE_STYLE §5 / U-M4.2 |
| loudness | integrated outside −18…−14 LUFS or true peak > −1 dBTP (ebur128) |
| flashes | > 3 large luminance flashes in any 1 s window (WCAG 2.3.1), from frames sampled at the video fps |
| captions | VTT cues out of order, outside the audio, > 2 lines, > 42 chars/line, > 17 cps, or text ≠ script text; with --sound-cues SIDECAR, bracketed sound lines ("[waves breaking]") are allowed only where the sidecar lists them (and every listed sound must be captioned), the spoken words still exact |
| subtitles | the SRT twin of the VTT (--srt, default beside it) has other cues, times (> 2 ms) or text, or the en.vtt / en.srt copies beside the movie are not byte-identical to them (stale) |
| physics | manifest functions re-run and their output hashes differ from the manifest |
| equations | an on_screen_eq.latex of the storyboard is not in the composition source |

Review material (always written): a contact sheet (1 frame / 5 s, 480 px, 6×5 tiles) and full-size frames at every
scene midpoint and boundary into ``reports/movies/<id>/``, plus ``qa.json`` there.
"""
from __future__ import annotations

import argparse
import hashlib
import importlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FF, FP = shutil.which("ffmpeg"), shutil.which("ffprobe")


def run(args: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(args, capture_output=True, text=True, encoding="utf-8", errors="replace")


def probe(path: Path) -> dict:
    r = run([FP, "-v", "error", "-show_format", "-show_streams", "-of", "json", str(path)])
    return json.loads(r.stdout or "{}")


def faststart(path: Path) -> bool:
    """True if the 'moov' atom comes before 'mdat' (top-level box scan)."""
    with open(path, "rb") as f:
        while True:
            hdr = f.read(8)
            if len(hdr) < 8:
                return False
            size, kind = int.from_bytes(hdr[:4], "big"), hdr[4:8]
            if kind == b"moov":
                return True
            if kind == b"mdat":
                return False
            if size == 1:
                size = int.from_bytes(f.read(8), "big")
                f.seek(size - 16, 1)
            elif size == 0:
                return False
            else:
                f.seek(size - 8, 1)


def detect(path: Path, vf: str) -> str:
    return run([FF, "-hide_banner", "-nostats", "-i", str(path), "-vf", vf, "-an", "-f", "null", "-"]).stderr


def ebur128(path: Path) -> dict:
    err = run([FF, "-hide_banner", "-nostats", "-i", str(path), "-vn", "-af", "ebur128=peak=true", "-f", "null",
               "-"]).stderr
    tail = err[err.rfind("Summary:"):]
    i = re.search(r"I:\s*(-?[\d.]+|-inf)\s*LUFS", tail)
    p = re.search(r"Peak:\s*(-?[\d.]+|-inf)\s*dBFS", tail)
    f = lambda m: float(m.group(1)) if m and m.group(1) != "-inf" else float("-inf")   # noqa: E731
    return {"integrated_lufs": f(i), "true_peak_dbtp": f(p)}


def flashes(path: Path, fps: float) -> dict:
    """WCAG 2.3.1: count pairs of opposing large luminance changes (≥ 10 % of full scale, darker frame < 0.8) per
    second, from 64×36 grey frames at the native fps."""
    w, h = 64, 36
    raw = subprocess.run([FF, "-v", "error", "-i", str(path), "-vf", f"scale={w}:{h},format=gray", "-f", "rawvideo",
                          "-"], capture_output=True).stdout
    n = len(raw) // (w * h)
    if n < 2:
        return {"max_per_s": 0, "frames": n}
    lum = [sum(raw[k * w * h:(k + 1) * w * h]) / (w * h * 255.0) for k in range(n)]
    events = []
    for k in range(1, n):
        d = lum[k] - lum[k - 1]
        if abs(d) >= 0.10 and min(lum[k], lum[k - 1]) < 0.8:
            events.append((k, 1 if d > 0 else -1))
    flashes_at = [events[j][0] for j in range(1, len(events)) if events[j][1] != events[j - 1][1]]
    win = max(1, int(round(fps)))
    worst = max((sum(1 for t in flashes_at if s <= t < s + win) for s in range(0, n)), default=0)
    return {"max_per_s": worst, "frames": n, "events": len(events)}


def parse_vtt(path: Path) -> list[dict]:
    cues, block = [], []
    for line in path.read_text(encoding="utf-8").splitlines() + [""]:
        if line.strip():
            block.append(line)
            continue
        if block and "-->" in "".join(block):
            i = next(k for k, ln in enumerate(block) if "-->" in ln)
            a, b = [x.strip().split()[0] for x in block[i].split("-->")]
            cues.append({"start": _ts(a), "end": _ts(b), "lines": block[i + 1:]})
        block = []
    return cues


def _ts(s: str) -> float:
    parts = s.replace(",", ".").split(":")
    parts = ["0"] * (3 - len(parts)) + parts
    return int(parts[0]) * 3600 + int(parts[1]) * 60 + float(parts[2])


def norm_words(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


BEAT = re.compile(r"\s*\[beat\]\s*", re.I)  # tools/tts.py pause marker: never spoken, never captioned


def script_text(script: Path | None, storyboard: dict | None) -> str | None:
    if storyboard:
        return BEAT.sub(" ", " ".join((sc.get("voiceover") or "") for sc in storyboard.get("scenes", [])))
    if script and script.exists():
        lines = [ln for ln in script.read_text(encoding="utf-8").splitlines() if not ln.startswith("#")
                 and not ln.strip().startswith(">")]
        return BEAT.sub(" ", " ".join(lines))
    return None


SOUND_LINE = re.compile(r"^\[[^\[\]]+\]$")


def load_sound_cues(path: Path) -> list[dict]:
    """The sound-captions sidecar: ``{"sound_cues": [{start, end, text}, …]}`` (JSON, as written by
    ``tools/sound/mix.py``) or the same as YAML, or a bare list."""
    txt = path.read_text(encoding="utf-8")
    if path.suffix.lower() in (".yaml", ".yml"):
        import yaml

        data = yaml.safe_load(txt)
    else:
        data = json.loads(txt)
    items = data.get("sound_cues", []) if isinstance(data, dict) else (data or [])
    return [{"start": float(s["start"]), "end": float(s["end"]), "text": str(s["text"]).strip()} for s in items]


def captions_gate_with_sounds(cues: list[dict], ref: str | None, sound_cues: list[dict], dur: float,
                              tol: float = 0.5) -> tuple[str, str]:
    """Captions gate that also allows bracketed sound captions ("[waves breaking]", HOUSE_STYLE §8), used only with
    ``--sound-cues``; the default gate is unchanged.

    * A caption line that is wholly ``[ … ]`` is a sound line. It must match a sidecar entry: same text (case and
      surrounding space ignored) and a cue time overlapping the sidecar's [start − tol, end + tol]. Every sidecar
      entry must be captioned. A line mixing words and brackets fails.
    * Sound lines are removed before the spoken-word check, which stays exact: the remaining caption text must equal
      the script text word for word (``norm_words``), as in the default gate.
    * Order, ≤ 2 lines, ≤ 42 characters, ≤ 17 cps (WARN) and ≤ 7 s apply to every cue, sound cues included.
    """
    issues: list[str] = []
    prev = 0.0
    spoken: list[str] = []
    matched = [False] * len(sound_cues)
    for k, c in enumerate(cues, 1):
        d = c["end"] - c["start"]
        txt = " ".join(c["lines"])
        if c["start"] < prev - 1e-6:
            issues.append(f"cue {k} out of order")
        if c["end"] > dur + 0.05:
            issues.append(f"cue {k} ends after the video")
        if len(c["lines"]) > 2 or any(len(ln) > 42 for ln in c["lines"]):
            issues.append(f"cue {k} > 2 lines or > 42 chars")
        if d > 0 and len(txt) / d > 17:
            issues.append(f"cue {k} {len(txt) / d:.1f} cps")
        if d > 7.0 + 1e-6:
            issues.append(f"cue {k} {d:.1f} s > 7 s")
        prev = c["start"]
        for ln in c["lines"]:
            s = ln.strip()
            if SOUND_LINE.match(s):
                hit = [i for i, sc in enumerate(sound_cues)
                       if sc["text"].lower() == s.lower() and c["start"] < sc["end"] + tol and c["end"] > sc["start"] - tol]
                if not hit:
                    issues.append(f"cue {k} sound caption {s} not in the sound-cues sidecar at {c['start']:.2f} s")
                for i in hit:
                    matched[i] = True
            elif "[" in s or "]" in s:
                issues.append(f"cue {k} mixes words and a bracketed sound: {s!r}")
            else:
                spoken.append(s)
    for i, sc in enumerate(sound_cues):
        if not matched[i]:
            issues.append(f"sidecar sound {sc['text']} at {sc['start']:.2f} s has no caption")
    if ref is not None and norm_words(" ".join(spoken)) != norm_words(ref):
        issues.append("caption text differs from the script text")
    hard = [i for i in issues if "cps" not in i]
    n_sound = sum(matched)
    return (("FAIL" if hard else ("WARN" if issues else "PASS")),
            "; ".join(issues) or f"{len(cues)} cues match the script; {n_sound} sound caption(s) match the sidecar")


def physics_parity(manifest: Path) -> tuple[str, str]:
    """Re-run every manifest entry {fn: 'pkg.mod.func', params: {...}, sha256: '…'} and compare output hashes."""
    m = json.loads(manifest.read_text(encoding="utf-8"))
    entries = m.get("physics") or m.get("functions") or []
    if not entries:
        return "SKIP", "manifest has no physics entries"
    sys.path.insert(0, str(ROOT))
    bad = []
    for e in entries:
        mod, fn = e["fn"].rsplit(".", 1)
        out = getattr(importlib.import_module(mod), fn)(**(e.get("params") or {}))
        try:
            import numpy as np

            blob = np.ascontiguousarray(np.asarray(out, dtype=float)).tobytes()
        except Exception:
            blob = json.dumps(out, sort_keys=True, default=str).encode()
        h = hashlib.sha256(blob).hexdigest()
        if e.get("sha256") and h != e["sha256"]:
            bad.append(f"{e['fn']}: {h[:12]} != manifest {e['sha256'][:12]}")
    return ("FAIL", "; ".join(bad)) if bad else ("PASS", f"{len(entries)} function(s) reproduce their hashes")


def framemd5(a: Path, b: Path) -> int:
    def hashes(p: Path) -> list[str]:
        out = run([FF, "-v", "error", "-i", str(p), "-map", "0:v", "-f", "framemd5", "-"]).stdout
        return [ln.split(",")[-1].strip() for ln in out.splitlines() if ln and not ln.startswith("#")]
    ha, hb = hashes(a), hashes(b)
    diff = [i for i, (x, y) in enumerate(zip(ha, hb)) if x != y]
    print(f"frames {len(ha)} vs {len(hb)}; identical {len(ha) - len(diff)}; differing {len(diff)}"
          + (f" (first: {diff[:10]})" if diff else ""))
    return 0 if not diff and len(ha) == len(hb) else 1


def narration_spans(timing: Path | None) -> list[tuple[float, float]] | None:
    """Spoken (start, end) seconds of every sentence in a tools/tts.py timing.json, or None without one."""
    if timing is None or not timing.exists():
        return None
    t = json.loads(timing.read_text(encoding="utf-8"))
    return sorted((float(s["start"]), float(s["end"])) for sc in t.get("scenes", []) for s in sc.get("sentences", []))


def longest_silence(s: float, e: float, speech: list[tuple[float, float]]) -> float:
    """Longest stretch inside [s, e] that no narration sentence covers [s]."""
    longest, cursor = 0.0, s
    for a, b in speech:
        if b <= cursor or a >= e:
            continue
        longest = max(longest, a - cursor)
        cursor = max(cursor, b)
    return max(longest, e - cursor)


CONTENT_BG = (23, 31, 51)         # house background #171f33 (HOUSE_STYLE §5)
SRC_BAND_Y = 835                  # the data-source line band starts here; excluded from the content/halves gates


def content_scan(path: Path, dur: float, step: float = 0.5, thr: int = 28, w: int = 480,
                 bg: tuple[int, int, int] = CONTENT_BG) -> list[dict]:
    """Sample the movie every ``step`` s at ``w`` px wide and measure, for each sample, the fraction of pixels that
    differ from the house background by more than ``thr`` (max over R, G, B) in three regions of the 1920×1080 layout
    (HOUSE_STYLE §5): the whole content area (x 0–1920, y 40–860), the picture zone (x 80–1000) and the maths zone
    (x 1060–1840), all y 40–835. Navy background counts as empty, which the black gate cannot see. The data-source
    band (y ≥ 835, HOUSE_STYLE §5 source line at y 832–862) is left out on purpose: a source line must never count as
    content, or it would mask an empty half (ch00_vectors_index_notation review 1, 2026-10-29)."""
    import numpy as np

    h = int(round(w * 1080 / 1920))
    s = w / 1920
    y0, y1 = int(40 * s), int(SRC_BAND_Y * s)
    regions = {"content": (0, w), "left": (int(80 * s), int(1000 * s)), "right": (int(1060 * s), int(1840 * s))}
    proc = subprocess.Popen([FF, "-v", "error", "-i", str(path), "-vf",
                             f"fps=1/{step},scale={w}:{h}:flags=area,format=rgb24", "-f", "rawvideo", "-"],
                            stdout=subprocess.PIPE)
    frame_bytes = w * h * 3
    ref = np.array(bg, dtype=np.int16)
    rows, k = [], 0
    assert proc.stdout is not None
    while True:
        buf = proc.stdout.read(frame_bytes)
        if len(buf) < frame_bytes:
            break
        im = np.frombuffer(buf, dtype=np.uint8).reshape(h, w, 3)[y0:y1].astype(np.int16)
        d = np.abs(im - ref).max(axis=2) > thr
        row = {"t": round(k * step, 3)}
        for name, (xa, xb) in regions.items():
            row[name] = float(d[:, xa:xb].mean())
        rows.append(row)
        k += 1
    proc.wait()
    return rows


def empty_spans(rows: list[dict], key: str, frac: float, step: float, dur: float,
                edge: float = 0.5) -> list[tuple[float, float]]:
    """Maximal [start, end) spans where region ``key`` has fewer than ``frac`` differing pixels, ignoring the first
    and last ``edge`` seconds (fades)."""
    spans, cur = [], None
    for r in rows:
        t = r["t"]
        empty = r[key] < frac and edge <= t <= dur - edge
        if empty and cur is None:
            cur = t
        if not empty and cur is not None:
            spans.append((cur, t))
            cur = None
    if cur is not None:
        spans.append((cur, rows[-1]["t"] + step))
    return spans


def review_frames(path: Path, outdir: Path, dur: float, storyboard: dict | None,
                  timing: dict | None = None) -> list[str]:
    outdir.mkdir(parents=True, exist_ok=True)
    files = []
    sheet = outdir / "contact_sheet.png"
    run([FF, "-v", "error", "-y", "-i", str(path), "-vf", "fps=1/5,scale=480:-1,tile=6x5", "-frames:v", "1",
         str(sheet)])
    if dur < 30:   # short clips: one frame per second so the sheet is not a single tile
        run([FF, "-v", "error", "-y", "-i", str(path), "-vf", "fps=1,scale=480:-1,tile=6x5", "-frames:v", "1",
             str(sheet)])
    if sheet.exists():
        files.append(sheet.name)
    times = set()
    for sc in (timing or {}).get("scenes", []):   # measured scene times win over the storyboard's
        if "start" in sc and "end" in sc:
            a, b = float(sc["start"]), float(sc["end"])
            times.update([a + 0.05, (a + b) / 2, max(a, b - 0.1)])
    for sc in ([] if times else (storyboard or {}).get("scenes", [])):
        if isinstance(sc.get("t"), list) and len(sc["t"]) == 2:
            a, b = sc["t"]
            times.update([a + 0.05, (a + b) / 2, max(a, b - 0.1)])
    if not times:
        times = {dur * k / 6 for k in range(6)} | {max(0.0, dur - 0.1)}
    for t in sorted(times):
        if t > dur:
            continue
        name = f"frame_{t:07.2f}s.png"
        run([FF, "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", str(path), "-frames:v", "1", str(outdir / name)])
        if (outdir / name).exists():
            files.append(name)
    return files


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("movie", nargs="?")
    ap.add_argument("--framemd5", nargs=2, metavar=("A", "B"))
    ap.add_argument("--storyboard")
    ap.add_argument("--captions")
    ap.add_argument("--srt", help="SRT twin of --captions (default: the .srt beside --captions): gate 'subtitles' checks the same "
                                  "cues, times (±2 ms) and text, and that en.vtt / en.srt beside the movie are byte-identical copies")
    ap.add_argument("--script")
    ap.add_argument("--manifest")
    ap.add_argument("--composition", help="the .tsx source to grep for on-screen equations")
    ap.add_argument("--timing", help="tools/tts.py timing.json (default: next to --storyboard); makes the frozen "
                                     "gate fail only on > 4 s of silence inside a frozen stretch")
    ap.add_argument("--id", help="report folder name (default: the movie's file stem)")
    ap.add_argument("--duration", type=float, help="target seconds (±3 %%); overrides the storyboard target")
    ap.add_argument("--duration-window", default="120,180")
    ap.add_argument("--budget-mb", type=float, default=25.0)
    ap.add_argument("--hard-mb", type=float, default=40.0)
    ap.add_argument("--sound-cues", help="sound-captions sidecar (tools/sound/mix.py sound_captions.json): allow "
                                         "bracketed sound captions listed there; spoken words still checked exactly")
    ap.add_argument("--no-audio-ok", action="store_true", help="silent test clip: skip codec-audio and loudness")
    ap.add_argument("--frames-only", action="store_true", help="only write the review frames")
    ap.add_argument("--no-content", action="store_true", help="skip the content-area and half-screen gates")
    ap.add_argument("--content-frac", type=float, default=0.002,
                    help="a region is empty below this fraction of pixels off the background (default 0.2 %%)")
    ap.add_argument("--content-max", type=float, default=1.5, help="content area empty longer than this fails (s)")
    ap.add_argument("--half-warn", type=float, default=3.0, help="picture/maths zone empty longer than this warns (s)")
    ap.add_argument("--half-max", type=float, default=10.0, help="picture/maths zone empty longer than this fails (s)")
    ap.add_argument("--content-only", action="store_true", help="run only the content/halves gates (calibration)")
    ap.add_argument("--overlap", help="K6 (HOUSE_STYLE §5b): folder of BoxProbe b<frame>.json files; adds the gate 'overlap' "
                                      "(text over text or over a sharp picture, colour bar on a picture, source-line gap; tools/k6_overlap.py)")
    a = ap.parse_args()
    if a.framemd5:
        return framemd5(Path(a.framemd5[0]), Path(a.framemd5[1]))
    if not a.movie:
        ap.error("give a movie or --framemd5 A B")
    if not (FF and FP):
        print("ffmpeg/ffprobe not on PATH")
        return 2
    path = Path(a.movie).resolve()
    sb = None
    if a.storyboard:
        import yaml

        sb = yaml.safe_load(Path(a.storyboard).read_text(encoding="utf-8"))
    timing_path = Path(a.timing) if a.timing else (Path(a.storyboard).with_name("timing.json") if a.storyboard else None)
    mid = a.id or (sb or {}).get("id") or path.stem
    outdir = ROOT / "reports" / "movies" / mid
    info = probe(path)
    fmt = info.get("format", {})
    dur = float(fmt.get("duration", 0))
    vs = next((s for s in info.get("streams", []) if s.get("codec_type") == "video"), {})
    au = next((s for s in info.get("streams", []) if s.get("codec_type") == "audio"), None)
    fps = eval(vs.get("avg_frame_rate", "30/1").replace("/", "/") or "30") if vs.get("avg_frame_rate", "0/0") != "0/0" else 30.0
    gates: dict[str, dict] = {}

    def gate(name: str, status: str, detail: str) -> None:
        gates[name] = {"status": status, "detail": detail}

    def content_gates() -> None:
        # content area empty (navy #171f33 counts as empty) and half-screen empty (HOUSE_STYLE §5, U-M4.2)
        if a.no_content:
            gate("content", "SKIP", "--no-content")
            gate("halves", "SKIP", "--no-content")
        else:
            step = 0.5
            rows = content_scan(path, dur, step=step)
            outdir.mkdir(parents=True, exist_ok=True)
            (outdir / "content_scan.json").write_text(json.dumps(rows), encoding="utf-8")
            blank = [(s, e) for s, e in empty_spans(rows, "content", a.content_frac, step, dur) if e - s > a.content_max]
            gate("content", "FAIL" if blank else "PASS",
                 (f"content area (y 40–835) empty > {a.content_max:g} s: "
                  + ", ".join(f"{s:.1f}–{e:.1f} s ({e - s:.1f} s)" for s, e in blank)) if blank else
                 f"{len(rows)} samples every {step:g} s; no empty content area > {a.content_max:g} s "
                 f"(< {a.content_frac * 100:g} % of pixels off the background)")
            halves = []
            for key in ("left", "right"):
                for s, e in empty_spans(rows, key, a.content_frac, step, dur):
                    if e - s > a.half_warn:
                        halves.append((key, s, e))
            halves.sort(key=lambda x: x[1])
            hard = [x for x in halves if x[2] - x[1] > a.half_max]
            gate("halves", "FAIL" if hard else ("WARN" if halves else "PASS"),
                 ("; ".join(f"{k} {s:.1f}–{e:.1f} s ({e - s:.1f} s)" for k, s, e in (hard or halves))
                  + (f" [FAIL > {a.half_max:g} s; {len(halves)} span(s) > {a.half_warn:g} s in all]" if hard else
                     f" [WARN > {a.half_warn:g} s]")) if halves else
                 f"no picture or maths zone empty > {a.half_warn:g} s")

    timing = None
    if timing_path and timing_path.exists():
        timing = json.loads(timing_path.read_text(encoding="utf-8"))
    if a.content_only:
        content_gates()
        for k, g in gates.items():
            print(f"  {g['status']:4s} {k:10s} {g['detail']}")
        return 0 if all(g['status'] != 'FAIL' for g in gates.values()) else 1
    files = review_frames(path, outdir, dur, sb, timing)
    if a.frames_only:
        print(f"review frames -> {outdir}: {files}")
        return 0

    # duration
    target = a.duration if a.duration is not None else (sb or {}).get("target_duration_s")
    lo, hi = (float(x) for x in a.duration_window.split(","))
    if timing and "total_s" in timing:
        # the narration's measured end is the target: the movie may only add a short silent end hold (≤ 5 s)
        tt = float(timing["total_s"])
        ok = tt - 0.1 <= dur <= tt + 5.0 and lo <= dur <= hi
        gate("duration", "PASS" if ok else "FAIL",
             f"{dur:.2f} s vs narration end {tt:.2f} s from timing.json (+0 … +5 s hold); window {lo:g}–{hi:g} s")
    elif a.duration is not None:
        ok = abs(dur - target) <= 0.03 * target + 1e-6 or abs(dur - target) <= 0.1
        gate("duration", "PASS" if ok else "FAIL", f"{dur:.2f} s vs target {target} s (±3 %)")
    else:
        ok = lo <= dur <= hi and (target is None or abs(dur - target) <= 0.03 * target)
        gate("duration", "PASS" if ok else "FAIL", f"{dur:.2f} s; window {lo:g}–{hi:g} s; target {target}")
    # size
    mb = path.stat().st_size / 1e6
    gate("size", "FAIL" if mb > a.hard_mb else ("WARN" if mb > a.budget_mb else "PASS"),
         f"{mb:.2f} MB (budget {a.budget_mb:g}, hard {a.hard_mb:g})")
    # codec
    prof, pix = vs.get("profile", ""), vs.get("pix_fmt", "")
    problems = []
    if vs.get("codec_name") != "h264":
        problems.append(f"video codec {vs.get('codec_name')}")
    if prof not in ("High", "Main", "Constrained Baseline"):
        problems.append(f"profile {prof}")
    if pix != "yuv420p":
        problems.append(f"pix_fmt {pix}")
    if au is None and not a.no_audio_ok:
        problems.append("no audio stream")
    if au is not None and au.get("codec_name") != "aac":
        problems.append(f"audio codec {au.get('codec_name')}")
    fs = faststart(path)
    if not fs:
        problems.append("no faststart (run ffmpeg -c copy -movflags +faststart)")
    gate("codec", "FAIL" if problems else "PASS",
         "; ".join(problems) or f"h264 {prof} {pix}, {'aac' if au else 'silent'}, faststart, {fps:.3g} fps, "
                                 f"{vs.get('width')}×{vs.get('height')}")
    # black / frozen
    err = detect(path, "blackdetect=d=0.5:pix_th=0.10")
    blacks = [(float(s), float(e)) for s, e in re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", err)]
    inner = [(s, e) for s, e in blacks if s > 0.5 and e < dur - 0.5]
    gate("black", "FAIL" if inner else "PASS", f"{len(blacks)} black stretch(es); inside: {inner}")
    err = detect(path, "freezedetect=n=0.003:d=4")
    starts = [float(x) for x in re.findall(r"freeze_start: ([\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"freeze_end: ([\d.]+)", err)]
    ends += [dur] * (len(starts) - len(ends))          # a freeze running to the last frame has no end line
    freezes = list(zip(starts, ends))
    speech = narration_spans(timing_path)
    if speech is None:
        # no timing.json: every frozen stretch > 4 s fails (silent clips, old behaviour)
        gate("frozen", "FAIL" if freezes else "PASS",
             f"frozen > 4 s: {[round(e - s, 2) for s, e in freezes]}" if freezes else "no frozen stretch > 4 s")
    else:
        # skill rule: fail only a frozen stretch holding > 4 s of continuous silence (a static slide while the
        # narrator talks is fine)
        silent = [(s, e, longest_silence(s, e, speech)) for s, e in freezes]
        bad = [(round(s, 2), round(e, 2), round(g, 2)) for s, e, g in silent if g > 4.0]
        worst = max((g for *_, g in silent), default=0.0)
        gate("frozen", "FAIL" if bad else "PASS",
             f"{len(freezes)} frozen stretch(es) > 4 s; silent > 4 s inside: {bad}" if bad else
             f"{len(freezes)} frozen stretch(es) > 4 s, all narrated (longest silence inside {worst:.2f} s)")
    content_gates()
    if a.overlap:
        sys.path.insert(0, str(Path(__file__).resolve().parent))
        from k6_overlap import overlap_gate
        st, det, rep = overlap_gate(Path(a.overlap))
        outdir.mkdir(parents=True, exist_ok=True)
        (outdir / "overlap.json").write_text(json.dumps(rep, indent=1, ensure_ascii=False), encoding="utf-8")
        gate("overlap", st, det)
    # loudness
    if au is None:
        gate("loudness", "SKIP" if a.no_audio_ok else "FAIL", "no audio stream")
    else:
        L = ebur128(path)
        ok = -18 <= L["integrated_lufs"] <= -14 and L["true_peak_dbtp"] <= -1.0
        gate("loudness", "PASS" if ok else "FAIL", f"{L['integrated_lufs']} LUFS, peak {L['true_peak_dbtp']} dBTP")
    # flashes
    fl = flashes(path, fps)
    gate("flashes", "PASS" if fl["max_per_s"] <= 3 else "FAIL", f"max {fl['max_per_s']} flashes/s (WCAG ≤ 3)")
    # captions
    if a.captions and Path(a.captions).exists() and a.sound_cues:
        # opt-in variant: bracketed sound captions allowed when listed in the sidecar; spoken words still exact
        st, det = captions_gate_with_sounds(parse_vtt(Path(a.captions)),
                                            script_text(Path(a.script) if a.script else None, sb),
                                            load_sound_cues(Path(a.sound_cues)), dur)
        gate("captions", st, det)
    elif a.captions and Path(a.captions).exists():
        cues = parse_vtt(Path(a.captions))
        issues = []
        prev = 0.0
        for k, c in enumerate(cues, 1):
            d = c["end"] - c["start"]
            txt = " ".join(c["lines"])
            if c["start"] < prev - 1e-6:
                issues.append(f"cue {k} out of order")
            if c["end"] > dur + 0.05:
                issues.append(f"cue {k} ends after the video")
            if len(c["lines"]) > 2 or any(len(ln) > 42 for ln in c["lines"]):
                issues.append(f"cue {k} > 2 lines or > 42 chars")
            if d > 0 and len(txt) / d > 17:
                issues.append(f"cue {k} {len(txt) / d:.1f} cps")
            if d > 7.0 + 1e-6:
                issues.append(f"cue {k} {d:.1f} s > 7 s")
            prev = c["start"]
        ref = script_text(Path(a.script) if a.script else None, sb)
        if ref is not None and norm_words(" ".join(" ".join(c["lines"]) for c in cues)) != norm_words(ref):
            issues.append("caption text differs from the script text")
        hard = [i for i in issues if "cps" not in i]
        gate("captions", "FAIL" if hard else ("WARN" if issues else "PASS"),
             "; ".join(issues) or f"{len(cues)} cues match the script")
    else:
        gate("captions", "SKIP", "no --captions given")
    # subtitles: the SRT is the VTT's twin, and the copies published beside the movie are not stale (added 2026-10-28,
    # ch00_weather_basics review 2 S3: out/…/en.srt was the v2 file while en.vtt was current)
    if a.captions and Path(a.captions).exists():
        vtt = Path(a.captions)
        srt = Path(a.srt) if a.srt else vtt.with_suffix(".srt")
        issues, notes = [], []
        if srt.exists():
            cv, cs = parse_vtt(vtt), parse_vtt(srt)
            if len(cv) != len(cs):
                issues.append(f"{len(cs)} SRT cues vs {len(cv)} VTT cues")
            for k, (x, y) in enumerate(zip(cv, cs), 1):
                if abs(x["start"] - y["start"]) > 0.002 or abs(x["end"] - y["end"]) > 0.002:
                    issues.append(f"cue {k} time differs (VTT {x['start']:.3f}–{x['end']:.3f}, SRT {y['start']:.3f}–{y['end']:.3f})")
                    break
                if [ln.strip() for ln in x["lines"]] != [ln.strip() for ln in y["lines"]]:
                    issues.append(f"cue {k} text differs")
                    break
            notes.append(f"SRT {srt.name}: {len(cs)} cues = VTT" if not issues else "")
        else:
            notes.append("no SRT beside the VTT")
        for src, name in ((vtt, "en.vtt"), (srt, "en.srt")):
            cp = path.parent / name
            if cp.exists() and src.exists() and cp.resolve() != src.resolve():
                if cp.read_bytes() != src.read_bytes():
                    issues.append(f"{cp} is not a copy of {src} (stale)")
                else:
                    notes.append(f"{name} beside the movie = source")
            elif not cp.exists() and src.exists():
                notes.append(f"no {name} beside the movie")
        gate("subtitles", "FAIL" if issues else "PASS", "; ".join(issues) if issues else "; ".join(n for n in notes if n))
    else:
        gate("subtitles", "SKIP", "no --captions given")
    # physics parity
    if a.manifest and Path(a.manifest).exists():
        st, det = physics_parity(Path(a.manifest))
        gate("physics", st, det)
    else:
        gate("physics", "SKIP", "no --manifest given")
    # equations present in the composition
    eqs = []                                  # every on-screen equation: on_screen_eq and on_screen_eq_extra, dict or list
    for sc in (sb or {}).get("scenes", []):
        for key in ("on_screen_eq", "on_screen_eq_extra"):
            val = sc.get(key)
            for item in (val if isinstance(val, list) else [val]):
                if isinstance(item, dict) and item.get("latex"):
                    eqs.append(item["latex"])
    if eqs and a.composition:
        src = Path(a.composition).read_text(encoding="utf-8")
        squash = lambda s: re.sub(r"\s+", "", s.replace("\\\\", "\\"))   # noqa: E731
        missing = [e for e in eqs if squash(e) not in squash(src)]
        gate("equations", "FAIL" if missing else "PASS",
             f"missing: {missing}" if missing else f"{len(eqs)} storyboard equation(s) present")
    else:
        gate("equations", "SKIP", "no storyboard equations or no --composition")

    failed = [k for k, g in gates.items() if g["status"] == "FAIL"]
    report = {"movie": str(path), "id": mid, "duration_s": round(dur, 3), "size_mb": round(mb, 3), "fps": fps,
              "gates": gates, "review_frames": files, "pass": not failed}
    outdir.mkdir(parents=True, exist_ok=True)
    (outdir / "qa.json").write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding="utf-8")
    for k, g in gates.items():
        print(f"  {g['status']:4s} {k:10s} {g['detail']}")
    print(f"movie_qa: {'PASS' if not failed else 'FAIL ' + ', '.join(failed)} -> {outdir / 'qa.json'}")
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())
