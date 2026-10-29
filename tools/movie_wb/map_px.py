"""Pixel positions on the ch00_weather_basics 850-hPa map layers (tools/movie_wb/make_maps.py t850 frame, 1240 × 820, LCC):
the s49 particle tracks (data/t850_particles.bin, advect_on_sphere in the builder) and the s46 slice line (48.5N, 18W-4E).

The same cartostyle frame as make_maps.t850_maps (cs.new_map(bbox, st, fit="frame")), so the points sit exactly on the
PNG layers. Display transform only (no physics): lon/lat → projected → axes data → figure pixels (y down).

usage: .venv/Scripts/python.exe tools/movie_wb/map_px.py --out <public dir> [--check <png>]
writes wb_t850_particles_px.bin (float32 [3000, 37, 2] x, y px; NaN where a track left the field) and wb_t850_px.json
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools" / "movie_wb"))
import make_maps as mm  # noqa: E402

DATA = ROOT / "movies" / "ch00" / "ch00_weather_basics" / "data"


def main() -> int:
    import cartopy.crs as ccrs
    import matplotlib.pyplot as plt
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--check", type=Path, help="write a PNG with the particles' first points over the t850 base")
    a = ap.parse_args()
    st = mm.st_frame()
    fig, ax, choice = mm.cs.new_map((-27.0, 6.0, 38.0, 60.0), st, fit="frame")
    fig.canvas.draw()
    pc = ccrs.PlateCarree()
    H = mm.H

    def px(lon, lat):
        lon, lat = np.asarray(lon, float), np.asarray(lat, float)
        xy = ax.projection.transform_points(pc, lon.ravel(), lat.ravel())[:, :2]
        d = ax.transData.transform(xy) * (st.dpi / fig.dpi)
        out = np.stack([d[:, 0], H - d[:, 1]], -1).reshape(*lon.shape, 2)
        out[~(np.isfinite(lon) & np.isfinite(lat))] = np.nan
        return out

    hdr = json.loads((DATA / "t850_particles.json").read_text(encoding="utf-8"))
    buf = (DATA / "t850_particles.bin").read_bytes()
    v = {x["name"]: np.frombuffer(buf, "<f4", x["count"], x["offset_bytes"]).reshape(x["shape"]) for x in hdr["variables"]}
    P = px(v["lon"], v["lat"]).astype("<f4")
    a.out.mkdir(parents=True, exist_ok=True)
    (a.out / "wb_t850_particles_px.bin").write_bytes(P.tobytes())
    lons = np.linspace(-18.0, 4.0, 45)
    info = {"frame_px": [mm.W, H], "projection": choice.name, "params": choice.params, "particles": {"shape": list(P.shape), "bin": "wb_t850_particles_px.bin",
            "sha256": hashlib.sha256(P.tobytes()).hexdigest(), "source": "data/t850_particles.bin"},
            "slice_line_px": np.round(px(lons, np.full_like(lons, 48.5)), 1).tolist(), "brest_px": np.round(px(-4.49, 48.39), 1).tolist()}
    (a.out / "wb_t850_px.json").write_text(json.dumps(info), encoding="utf-8")
    plt.close(fig)
    if a.check:
        from PIL import Image, ImageDraw
        im = Image.open(a.out / "wb_map_t850_base.png").convert("RGB")
        d = ImageDraw.Draw(im)
        for p in P[::10, 0]:
            if np.isfinite(p).all():
                d.ellipse([p[0] - 2, p[1] - 2, p[0] + 2, p[1] + 2], fill=(255, 255, 255))
        d.line([tuple(q) for q in info["slice_line_px"]], fill=(216, 178, 58), width=4)
        b = info["brest_px"]
        d.ellipse([b[0] - 6, b[1] - 6, b[0] + 6, b[1] + 6], outline=(255, 0, 0), width=3)
        im.save(a.check)
    print("map_px ->", a.out, P.shape)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
