"""Two-pass join of the ch00_weather_basics chunks to a size target (UF2: the movie must stay under the 160-MB cap; crf 24
gave > 210 MB on the particle-heavy UF2 cut). Concat FILTER (one re-encode), x264 2-pass at the bitrate that gives
`--mb` MB with `--abr` audio, bt709 tv-range yuv420p, AAC, faststart. Pass logs and temp files on G:.
usage: .venv/Scripts/python.exe tools/movie_wb/join2pass.py <render dir> <audio wav> <out mp4> [--mb 152] [--abr 112k]"""
import json
import subprocess
import sys
from pathlib import Path

a = [x for x in sys.argv[1:] if not x.startswith("--")]
opt = lambda k, d: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d  # noqa: E731
rd, audio, out = Path(a[0]), Path(a[1]), Path(a[2])
parts = sorted(rd.glob("c[0-9][0-9].mp4"))
dur = float(json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(audio)],
                                      capture_output=True, text=True).stdout)["format"]["duration"])
abr = int(opt("--abr", "112k").rstrip("k"))
vbr = int(float(opt("--mb", "152")) * 8e3 / dur - abr)  # kbit/s
ins = []
for p in parts:
    ins += ["-i", str(p)]
n = len(parts)
filt = "".join(f"[{k}:v]" for k in range(n)) + f"concat=n={n}:v=1:a=0[v]"
plog = str(out.with_suffix("")) + "_2pass"
common = ["-filter_complex", filt, "-map", "[v]", "-c:v", "libx264", "-profile:v", "high", "-preset", "medium", "-b:v", f"{vbr}k",
          "-maxrate", f"{3 * vbr}k", "-bufsize", f"{6 * vbr}k", "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709",
          "-color_trc", "bt709", "-color_range", "tv", "-r", "30", "-passlogfile", plog]
print(f"{n} chunks, {dur:.1f} s, video {vbr} kbit/s + audio {abr} kbit/s", flush=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, *common, "-pass", "1", "-an", "-f", "mp4", "NUL"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-i", str(audio), *common, "-pass", "2", "-map", f"{n}:a", "-c:a", "aac", "-b:a", f"{abr}k",
                "-movflags", "+faststart", str(out)], check=True)
print("joined", n, "chunks ->", out, out.stat().st_size / 1e6, "MB", flush=True)
