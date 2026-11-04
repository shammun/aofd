"""UF1 QA gate for ch00_weather_basics: every scene with a storyboard source_line shows it (U-WB-R1), none without.

1. Static: every (scene, index) source line of uf1.json (copied verbatim from the storyboard by the builder) is referenced by a
   <SrcG>/<Src> (UF2 K2 SourceBelow) in WeatherBasics.tsx; no SrcLine names a scene that has no source line.
2. Frames: for each scene with n source lines, five frames inside the k-th n-th of the scene are taken from the MP4 and
   in at least one of them the bottom band (y 740-862, the source-line area above the caption band; s00_title: y 540-640, BAND_BY_SCENE) must hold source-line pixels (the muted
   #9aa6bd text colour, ≥ 150 px within ±14 per channel); scenes without real data are reported
   (their chart ticks share the muted colour, so 'none' is not gated; the static check covers it).
usage: .venv/Scripts/python.exe tools/movie_wb/source_check.py <mp4> [--out <json>]
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
MOV = ROOT / "movies/ch00/ch00_weather_basics"
TSX = ROOT / "movies/src/ch00_weather_basics/WeatherBasics.tsx"
MUTED = np.array([0x9a, 0xa6, 0xbd])
BAND = (740, 862)                 # where a source line sits under a picture
# the only scene whose credit sits elsewhere: the s00 title's credit is under its right-column animation (y about 555-621, UF2 review 2)
BAND_BY_SCENE = {"s00_title": (540, 640)}


def frame(mp4: Path, t: float) -> np.ndarray:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", str(mp4), "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(1080, 1920, 3)


def muted_px(img: np.ndarray, sid: str = "") -> int:
    y0, y1 = BAND_BY_SCENE.get(sid, BAND)
    band = img[y0:y1].astype(int)
    return int(np.all(np.abs(band - MUTED) <= 14, axis=-1).sum())


def main() -> int:
    mp4 = Path(sys.argv[1])
    out = Path(sys.argv[sys.argv.index("--out") + 1]) if "--out" in sys.argv else None
    src = json.loads((MOV / "data/uf1.json").read_text(encoding="utf-8"))["sources"]
    tsx = TSX.read_text(encoding="utf-8")
    refs = set()
    for m in re.finditer(r'<(?:SrcLine|SrcG|Src) id=(?:"([^"]+)"|\{warm \? "([^"]+)" : "([^"]+)"\})(?: i=\{(\d+)\})?', tsx):
        i = int(m.group(4) or 0)
        for g in (m.group(1), m.group(2), m.group(3)):
            if g:
                refs.add((g, i))
    rows, ok = [], True
    for sid, texts in src.items():
        for i in range(len(texts)):
            hit = (sid, i) in refs
            ok &= hit
            rows.append({"check": "static", "scene": sid, "i": i, "pass": hit})
    for sid, i in sorted(refs):
        if sid not in src:
            ok = False
            rows.append({"check": "static-extra", "scene": sid, "i": i, "pass": False})
    tm = json.loads((MOV / "timing.json").read_text(encoding="utf-8"))
    sc = tm["scenes"]
    for k, s in enumerate(sc):
        a, b = (0.0 if k == 0 else s["start"]), (sc[k + 1]["start"] if k + 1 < len(sc) else tm["total_s"])
        n = len(src.get(s["id"], []))
        if not n:   # muted tick labels share the colour: "none" is reported, not gated
            t = a + (b - a) * 0.5
            rows.append({"check": "frame", "scene": s["id"], "t": round(t, 2), "muted_px": muted_px(frame(mp4, t), s["id"]), "expect": "none", "pass": True})
            continue
        for j in range(n):   # line j is expected somewhere in its share of the scene (5 frames; a line shows only with its picture)
            ts = [a + (b - a) * (j + (q + 0.5) / 5) / n for q in range(5)]
            pxs = [muted_px(frame(mp4, t), s["id"]) for t in ts]
            p = max(pxs) >= 150
            ok &= p
            rows.append({"check": "frame", "scene": s["id"], "i": j, "t": [round(t, 2) for t in ts], "muted_px": pxs, "expect": "line", "pass": bool(p)})
    bad = [r for r in rows if not r["pass"]]
    print(f"source lines: {len(src)} scenes, {sum(len(v) for v in src.values())} lines; {len(rows)} checks; {len(bad)} failed")
    for r in bad:
        print("  FAIL", r)
    if out:
        out.write_text(json.dumps({"pass": ok, "rows": rows}, indent=1), encoding="utf-8")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
