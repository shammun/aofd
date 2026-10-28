"""Join the rendered chunks of ch00_weather_basics with the concat FILTER (one re-encode; -c copy concat drops frames),
mux the narration+music+effects WAV as AAC, faststart. Size-aware: crf and audio bitrate are arguments (the house
render_chunks join uses crf 20 + AAC 320k, which gave 261 MB for this 39:48 movie, over the 160-MB cap).
usage: .venv/Scripts/python.exe tools/movie_wb/join.py <render dir> <audio wav> <out mp4> [--crf 26] [--abr 128k]"""
import subprocess
import sys
from pathlib import Path

a = [x for x in sys.argv[1:] if not x.startswith("--")]
opt = lambda k, d: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d  # noqa: E731
rd, audio, out = Path(a[0]), Path(a[1]), Path(a[2])
parts = sorted(rd.glob("c*.mp4"))
ins = []
for p in parts:
    ins += ["-i", str(p)]
n = len(parts)
filt = "".join(f"[{k}:v]" for k in range(n)) + f"concat=n={n}:v=1:a=0[v]"
cmd = ["ffmpeg", "-v", "error", "-y", *ins, "-i", str(audio), "-filter_complex", filt, "-map", "[v]", "-map", f"{n}:a",
       "-c:v", "libx264", "-profile:v", "high", "-preset", "medium", "-crf", opt("--crf", "26"), "-pix_fmt", "yuv420p",
       "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
       "-r", "30", "-c:a", "aac", "-b:a", opt("--abr", "128k"), "-movflags", "+faststart", str(out)]
subprocess.run(cmd, check=True)
print("joined", n, "chunks ->", out, out.stat().st_size / 1e6, "MB")
