"""Automatic QA gates for a rendered movie (R1 §5.3, PLANNING §8.4). Uses ffprobe/ffmpeg from PATH.

Usage (main venv)::

    .venv/Scripts/python.exe tools/movie_qa.py <movie.mp4> [--storyboard movies/chNN/<slug>/storyboard.yaml]
        [--captions captions.vtt] [--script script.md] [--manifest manifest.json] [--composition movies/src/chNN/X.tsx]
        [--id chNN_slug] [--duration SECONDS] [--duration-window 120,180] [--budget-mb 25] [--hard-mb 40]
        [--no-audio-ok] [--frames-only]
    .venv/Scripts/python.exe tools/movie_qa.py --framemd5 a.mp4 b.mp4      # determinism: compare per-frame hashes

Gates (each PASS / FAIL / SKIP with a reason; exit 0 only when no gate FAILs):

| gate | fails when |
|---|---|
| duration | outside --duration-window (default 120–180 s), or > ±3 % from --duration / the storyboard target |
| size | > --budget-mb (default 25) — FAIL above --hard-mb (default 40), WARN between |
| codec | video not H.264 High (or Main for tiny clips) yuv420p, audio not AAC, or moov atom not before mdat (faststart) |
| black | black > 0.5 s outside the first/last 0.5 s (blackdetect) |
| frozen | a frozen stretch > 4 s (freezedetect) |
| loudness | integrated outside −18…−14 LUFS or true peak > −1 dBTP (ebur128) |
| flashes | > 3 large luminance flashes in any 1 s window (WCAG 2.3.1), from frames sampled at the video fps |
| captions | VTT cues out of order, outside the audio, > 2 lines, > 42 chars/line, > 17 cps, or text ≠ script text |
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


def script_text(script: Path | None, storyboard: dict | None) -> str | None:
    if storyboard:
        return " ".join((sc.get("voiceover") or "") for sc in storyboard.get("scenes", []))
    if script and script.exists():
        lines = [ln for ln in script.read_text(encoding="utf-8").splitlines() if not ln.startswith("#")
                 and not ln.strip().startswith(">")]
        return " ".join(lines)
    return None


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


def review_frames(path: Path, outdir: Path, dur: float, storyboard: dict | None) -> list[str]:
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
    for sc in (storyboard or {}).get("scenes", []):
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
    ap.add_argument("--script")
    ap.add_argument("--manifest")
    ap.add_argument("--composition", help="the .tsx source to grep for on-screen equations")
    ap.add_argument("--id", help="report folder name (default: the movie's file stem)")
    ap.add_argument("--duration", type=float, help="target seconds (±3 %); overrides the storyboard target")
    ap.add_argument("--duration-window", default="120,180")
    ap.add_argument("--budget-mb", type=float, default=25.0)
    ap.add_argument("--hard-mb", type=float, default=40.0)
    ap.add_argument("--no-audio-ok", action="store_true", help="silent test clip: skip codec-audio and loudness")
    ap.add_argument("--frames-only", action="store_true", help="only write the review frames")
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

    files = review_frames(path, outdir, dur, sb)
    if a.frames_only:
        print(f"review frames -> {outdir}: {files}")
        return 0

    # duration
    target = a.duration if a.duration is not None else (sb or {}).get("target_duration_s")
    lo, hi = (float(x) for x in a.duration_window.split(","))
    if a.duration is not None:
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
    fr = re.findall(r"freeze_duration: ([\d.]+)", err)
    gate("frozen", "FAIL" if fr else "PASS", f"frozen > 4 s: {fr}" if fr else "no frozen stretch > 4 s")
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
    if a.captions and Path(a.captions).exists():
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
    # physics parity
    if a.manifest and Path(a.manifest).exists():
        st, det = physics_parity(Path(a.manifest))
        gate("physics", st, det)
    else:
        gate("physics", "SKIP", "no --manifest given")
    # equations present in the composition
    eqs = [sc["on_screen_eq"]["latex"] for sc in (sb or {}).get("scenes", [])
           if isinstance(sc.get("on_screen_eq"), dict) and sc["on_screen_eq"].get("latex")]
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
