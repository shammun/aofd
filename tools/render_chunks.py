"""Render a long Remotion movie in chunks with a stall watchdog, then join the chunks and mux the audio.

House render recipe (movies/HOUSE_STYLE.md §10). Each chunk is one `remotion render` call: muted, crf 23, low concurrency,
its own port. If the log's "Rendered n/N" count does not advance for --stall seconds, the whole process tree is killed and
the chunk is retried (max 3 tries). The chunks are joined with the ffmpeg concat *filter* (one re-encode; `-c copy`
concat drops frames) and the narration + music WAV is muxed as AAC with faststart.

Before running: bundle once (`npx remotion bundle src/index.ts --out-dir <scratch>/bundle`) and copy narration_music.wav
and music.json into `<scratch>/bundle/public` (a prebuilt bundle ignores --public-dir); kill orphan `remotion render`
node, chrome-headless-shell and ffmpeg processes.

Example
-------
.venv/Scripts/python.exe tools/render_chunks.py --scratch "G:/.../scratch/movies/<slug>/v1" --comp Ch01Foo --frames 31817
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
import time
from pathlib import Path

MOVIES = Path(__file__).resolve().parents[1] / "movies"
PAT = re.compile(r"Rendered (\d+)/\d+")


def kill_tree(pid: int) -> None:
    """Kill a process and all its children (Windows taskkill /T /F)."""
    subprocess.run(["taskkill", "/PID", str(pid), "/T", "/F"], capture_output=True)


def render_chunk(a: argparse.Namespace, i: int, f0: int, f1: int, out_dir: Path) -> Path:
    """Render frames f0..f1 into c<i>.mp4, retrying on a stall; returns the chunk path."""
    out = out_dir / f"c{i:02d}.mp4"
    if out.exists() and out.stat().st_size > 0:
        return out
    bundle = a.scratch / "bundle"
    props = f' --props="{a.props}"' if a.props else ""
    for attempt in range(1, 4):
        log = out_dir / f"c{i:02d}_try{attempt}.log"
        cmd = (f'npx remotion render "{bundle}" {a.comp} "{out}" --frames={f0}-{f1} --concurrency={a.concurrency} '
               f'--port={a.port0 + i} --muted --crf=23 --codec=h264{props}')
        with open(log, "w", encoding="utf-8", errors="replace") as fh:
            p = subprocess.Popen(cmd, cwd=MOVIES, stdout=fh, stderr=subprocess.STDOUT, shell=True)
        last, last_t = -1, time.time()
        while p.poll() is None:
            time.sleep(10)
            txt = log.read_text(encoding="utf-8", errors="replace")[-4000:]
            m = PAT.findall(txt)
            n = int(m[-1]) if m else 0
            if n != last or "Encoded" in txt[-300:]:
                last, last_t = n, time.time()
            elif time.time() - last_t > a.stall:
                print(f"chunk {i} try {attempt}: stalled at {n}, killing", flush=True)
                kill_tree(p.pid)
                p.wait()
                break
        if p.returncode == 0 and out.exists():
            print(f"chunk {i} ({f0}-{f1}) done on try {attempt}", flush=True)
            return out
        out.unlink(missing_ok=True)
    sys.exit(f"chunk {i} failed 3 times")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--scratch", type=Path, required=True, help="render scratch folder on G: holding bundle/ (with public/)")
    ap.add_argument("--comp", required=True, help="Remotion composition id")
    ap.add_argument("--frames", type=int, required=True, help="total frames of the composition")
    ap.add_argument("--audio", type=Path, help="WAV to mux (default <scratch>/bundle/public/narration_music.wav)")
    ap.add_argument("--props", type=Path, help="optional props JSON file")
    ap.add_argument("--chunk", type=int, default=4000)
    ap.add_argument("--concurrency", type=int, default=3)
    ap.add_argument("--port0", type=int, default=3181)
    ap.add_argument("--stall", type=float, default=150.0, help="seconds without progress before a chunk is killed")
    ap.add_argument("--out", type=Path, help="joined MP4 (default <scratch>/render/1080.mp4)")
    a = ap.parse_args()
    out_dir = a.scratch / "render"
    out_dir.mkdir(parents=True, exist_ok=True)
    audio = a.audio or a.scratch / "bundle" / "public" / "narration_music.wav"
    t0 = time.time()
    parts = [render_chunk(a, i, f0, min(f0 + a.chunk, a.frames) - 1, out_dir) for i, f0 in enumerate(range(0, a.frames, a.chunk))]
    ins: list[str] = []
    for p in parts:
        ins += ["-i", str(p)]
    n = len(parts)
    filt = "".join(f"[{k}:v]" for k in range(n)) + f"concat=n={n}:v=1:a=0[v]"
    final = a.out or out_dir / "1080.mp4"
    cmd = ["ffmpeg", "-v", "error", "-y", *ins, "-i", str(audio), "-filter_complex", filt, "-map", "[v]", "-map", f"{n}:a",
           "-c:v", "libx264", "-profile:v", "high", "-crf", "20", "-pix_fmt", "yuv420p",
           "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
           "-r", "30", "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", str(final)]
    subprocess.run(cmd, check=True)
    print(f"joined -> {final}; wall {time.time() - t0:.0f} s", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
