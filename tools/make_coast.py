"""Write ``assets/coast110.json``: Natural Earth 1:110m coastlines as quantised int16 lon/lat polylines.

Natural Earth is public domain (https://www.naturalearthdata.com/about/terms-of-use/). The zip is downloaded once
into the data root (``<AOFD_DATA_ROOT>/raw/naturalearth/``, on G:) through the disk guard, never into the repo.

Encoding (decoded by ``Viz3D.coast()`` in ``assets/viz3d.js``): ``scale`` = 100 (0.01° steps), ``starts`` = index of
the first point of each polyline, ``data`` = base64 of little-endian int16 pairs (lon·100, lat·100). Points closer
than ``--min-step`` degrees to the previous kept point are dropped (default 0.25°), which keeps the file ≲ 30 kB.

Usage::  .venv/Scripts/python.exe tools/make_coast.py [--min-step 0.25]
"""
from __future__ import annotations

import argparse
import base64
import json
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
OUT = ROOT / "assets" / "coast110.json"
URL = "https://naturalearth.s3.amazonaws.com/110m_physical/ne_110m_coastline.zip"


def guarded_download(url: str, dest: Path) -> Path:
    """Download ``url`` to ``dest`` after the disk guard has approved its size (no-op if already there)."""
    import requests

    import disk_guard

    if dest.exists() and dest.stat().st_size > 0:
        return dest
    head = requests.head(url, allow_redirects=True, timeout=30)
    size = int(head.headers.get("Content-Length", "0") or 0) or 1_000_000
    print("before:", disk_guard.report())
    disk_guard.check(size, what=f"Natural Earth 110m coastline ({url})")
    dest.parent.mkdir(parents=True, exist_ok=True)
    with requests.get(url, stream=True, timeout=60) as r:
        r.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in r.iter_content(1 << 16):
                f.write(chunk)
    print(f"downloaded {dest} ({dest.stat().st_size / 1e3:.0f} kB)")
    print("after: ", disk_guard.report())
    return dest


def main() -> int:
    import shapefile

    import disk_guard

    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--min-step", type=float, default=0.25)
    a = ap.parse_args()
    z = guarded_download(URL, disk_guard.data_root() / "raw" / "naturalearth" / "ne_110m_coastline.zip")
    rd = shapefile.Reader(str(z))
    starts, pts = [], []
    for shp in rd.shapes():
        parts = list(shp.parts) + [len(shp.points)]
        for i in range(len(parts) - 1):
            seg = np.asarray(shp.points[parts[i]:parts[i + 1]], dtype=float)
            if len(seg) < 2:
                continue
            keep = [seg[0]]
            for p in seg[1:-1]:
                if np.hypot(*(p - keep[-1])) >= a.min_step:
                    keep.append(p)
            keep.append(seg[-1])
            if len(keep) >= 2:
                starts.append(len(pts))
                pts.extend(keep)
    q = np.round(np.asarray(pts) * 100.0).astype("<i2")
    data = {"_about": "Natural Earth 1:110m coastline (public domain), lon/lat x100 as int16 pairs; tools/make_coast.py",
            "source": URL, "scale": 100, "n_lines": len(starts), "n_points": len(pts), "min_step_deg": a.min_step,
            "starts": starts, "data": base64.b64encode(q.tobytes()).decode("ascii")}
    OUT.write_text(json.dumps(data, separators=(",", ":")), encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT).as_posix()}: {len(starts)} lines, {len(pts)} points, "
          f"{OUT.stat().st_size / 1e3:.1f} kB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
