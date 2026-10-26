"""Caption-band / edge scan of the final MP4: one frame every STEP seconds (ffmpeg), count pixels that differ from the
background #171f33 by > 28 (max channel) in y 880–1040 and within 20 px of the frame edges.
usage: vscan.py <mp4> <outdir> [step_s=1]"""
import json, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image

mp4, outdir = Path(sys.argv[1]), Path(sys.argv[2]); step = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
outdir.mkdir(parents=True, exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp4), "-vf", f"fps=1/{step}", "-q:v", "3", str(outdir / "t%05d.jpg")], check=True)
BG = np.array([23, 31, 51], dtype=np.int16)
t = json.load(open(r"C:\Users\sislam27\Work\Climate Dynamics PHD\AOFD Vallis\movies\ch00\ch00_cross_product_why\timing.json", encoding="utf-8"))
starts = [0.0] + [s["start"] for s in t["scenes"][1:]]
rows = []
for p in sorted(outdir.glob("t*.jpg")):
    i = int(p.stem[1:]) - 1
    ts = (i + 0.5) * step
    im = np.asarray(Image.open(p).convert("RGB")).astype(np.int16)
    d = np.abs(im - BG).max(axis=2) > 28
    band = int(d[880:1040, :].sum())
    e = np.zeros_like(d); e[:20, :] = True; e[-20:, :] = True; e[:, :20] = True; e[:, -20:] = True
    edge = int((d & e).sum())
    k = max(j for j, s in enumerate(starts) if s <= ts)
    rows.append({"t": round(ts, 1), "scene": t["scenes"][k]["id"], "band_px": band, "edge_px": edge})
(outdir / "vscan.json").write_text(json.dumps(rows))
bad = [r for r in rows if r["band_px"] > 0 or r["edge_px"] > 0]
print(f"{len(rows)} frames, {len(bad)} with pixels in the caption band or at the edges")
from collections import Counter
print(Counter(r["scene"] for r in bad))
for r in bad[:60]:
    print(r)
