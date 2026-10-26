"""Join rendered movie parts with the concat filter (as tools/render_chunks.py) but as a 2-pass x264 encode at a target
bitrate (the size budget), AAC 128 kb/s, faststart.

Usage: join2pass.py <scratch> <video kbps> [parts glob, default "pieces/p*.mp4"]
  parts are taken in sorted order relative to <scratch>; audio is <scratch>/bundle/public/narration_music.wav
  (ch00_cross_product_why: 172 kb/s gave 77.5 MB for 33:26)."""
import subprocess, sys, time
from pathlib import Path
S = Path(sys.argv[1]); kb = int(sys.argv[2]); pat = sys.argv[3] if len(sys.argv) > 3 else "pieces/p*.mp4"
parts = sorted(S.glob(pat))
if not parts:
    sys.exit(f"no parts match {S / pat}")
R = S / "render"; R.mkdir(exist_ok=True)
ins = []
for p in parts: ins += ["-i", str(p)]
n = len(parts)
filt = "".join(f"[{k}:v]" for k in range(n)) + f"concat=n={n}:v=1:a=0[v]"
audio = S / "bundle" / "public" / "narration_music.wav"
out = R / "1080_2pass.mp4"; log = str(R / "x264pass")
common = ["-filter_complex", filt, "-map", "[v]", "-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-b:v", f"{kb}k",
          "-maxrate", f"{kb * 6}k", "-bufsize", f"{kb * 12}k", "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709",
          "-color_trc", "bt709", "-color_range", "tv", "-r", "30", "-passlogfile", log]
t0 = time.time()
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, *common, "-pass", "1", "-an", "-f", "mp4", "NUL"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-i", str(audio), *common, "-pass", "2", "-map", f"{n}:a", "-c:a", "aac", "-b:a", "128k",
                "-movflags", "+faststart", str(out)], check=True)
print(f"{n} parts -> {out}: {out.stat().st_size / 1e6:.1f} MB in {time.time() - t0:.0f} s")
