"""Archive-first fetching for remote sources (GEE, GIBS, STAC): every response is stored on G: under
``<data root>/raw/<SOURCE>/<recipe>/<sha256(request)[:20]>/data.<ext>`` with ``request.json`` beside it (asset IDs, region,
dates, scale, visualisation, reducer, licence/credit, the time
fetched and the byte hash. A re-render with the same request reads the archive and never touches the network
(``MAPTOOLS_OFFLINE=1`` makes a cache miss an error). Stdlib + PIL only.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import io
import json
import os
from pathlib import Path


def key_of(request: dict) -> str:
    return hashlib.sha256(json.dumps(request, sort_keys=True, default=str).encode()).hexdigest()[:20]


def cached(job: dict, request: dict, fetch, ext: str, records: list) -> Path:
    """Return the archived file for ``request``; call ``fetch() -> bytes`` only on a cache miss."""
    k = key_of(request)
    arch = Path(job["archive"]) / k                  # raw/<SRC>/<purpose>/<request-hash>/
    if not str(arch).upper().startswith("G:"):
        raise SystemExit(f"remote archive must be on G:, got {arch}")
    arch.mkdir(parents=True, exist_ok=True)
    f = arch / f"data.{ext}"
    meta = arch / "request.json"
    hit = f.exists() and meta.exists()
    if not hit:
        if os.environ.get("MAPTOOLS_OFFLINE") == "1":
            raise SystemExit(f"offline and not archived: {request}")
        data = fetch()
        f.write_bytes(data)
        meta.write_text(json.dumps({"request": request, "fetched": dt.datetime.now().isoformat(timespec="seconds"),
                                    "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest(),
                                    "source": job.get("source"), "recipe": job["recipe"].get("name"),
                                    "licences": [{k2: d.get(k2) for k2 in ("path", "licence", "credit",
                                                                            "licence_status")}
                                                 for d in job.get("provenance", [])]},
                                   indent=1, default=str), encoding="utf-8")
    m = json.loads(meta.read_text(encoding="utf-8"))
    records.append({"archive": str(f), "cache_hit": hit, "sha256": m["sha256"], "fetched": m["fetched"],
                    "request": request})
    return f


def draw_overlays(img_bytes_or_path, job: dict, out: str, size=None, label: str | None = None):
    """Equirectangular image over job bounds -> our overlays drawn on top -> PNG ``out`` (exact ``size``)."""
    from PIL import Image, ImageDraw

    src = img_bytes_or_path
    im = Image.open(io.BytesIO(src) if isinstance(src, (bytes, bytearray)) else src)
    if im.mode in ("RGBA", "LA", "P"):                # masked pixels (land under SST, no-data) -> a neutral grey
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, job["style"].get("nodata_color", "#d9d9d9"))
        im = Image.alpha_composite(bg, im)
    im = im.convert("RGB")
    if size and tuple(im.size) != tuple(size):
        im = im.resize(tuple(size), Image.Resampling.LANCZOS)
    if job.get("overlays"):
        W, H = im.size
        b = job["bounds"]
        X = lambda lon: (lon - b[0]) / (b[2] - b[0]) * W  # noqa: E731
        Y = lambda lat: (b[3] - lat) / (b[3] - b[1]) * H  # noqa: E731
        d = ImageDraw.Draw(im)
        gj = json.loads(Path(job["overlays"]).read_text(encoding="utf-8"))
        col = tuple(int(job["style"].get("overlay_color", "#1a1a1a")[i:i + 2], 16) for i in (1, 3, 5))
        for ft in gj["features"]:
            g = ft["geometry"]
            rings = {"LineString": lambda c: [c], "MultiLineString": lambda c: c, "Polygon": lambda c: c[:1],
                     "MultiPolygon": lambda c: [p[0] for p in c]}[g["type"]](g["coordinates"])
            for ring in rings:
                d.line([(X(x), Y(y)) for x, y, *_ in ring], fill=col, width=1)
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    im.save(out)


def mp4(frames: list[str], out: str, fps: int = 4) -> str | None:
    """Deterministic H.264 from a frame list (bit-exact flags, one thread). Returns the path or None if no ffmpeg."""
    import shutil
    import subprocess

    ff = shutil.which("ffmpeg")
    if not ff or not frames:
        return None
    pat = str(Path(frames[0]).parent / (Path(frames[0]).stem.rsplit("_", 1)[0] + "_%04d.png"))
    subprocess.run([ff, "-y", "-loglevel", "error", "-framerate", str(fps), "-i", pat, "-c:v", "libx264", "-crf",
                    "18", "-pix_fmt", "yuv420p", "-threads", "1", "-fflags", "+bitexact", "-flags:v", "+bitexact",
                    "-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2", out], check=True)
    return out


def chart(csv_path: str, out_png: str, title: str, units: str, size=(1280, 720)):
    """House-style quick chart of a time-series CSV (value column(s) vs start date); the movie redraws its own."""
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    import pandas as pd

    df = pd.read_csv(csv_path, parse_dates=["start"])
    vals = [c for c in df.columns if c.startswith("value")]
    fig, ax = plt.subplots(figsize=(size[0] / 100, size[1] / 100), dpi=100)
    cols = ["#440154", "#21918c", "#fde725", "#3b528b", "#5ec962"]
    for i, c in enumerate(vals):
        ax.plot(df["start"], df[c], color=cols[i % len(cols)], lw=2, label=c.replace("value_", ""))
        ax.axhline(df[c].mean(), color=cols[i % len(cols)], lw=1, ls="--", alpha=0.6)
    ax.set_title(title, fontsize=13)
    ax.set_ylabel(units)
    ax.grid(alpha=0.3)
    if len(vals) > 1:
        ax.legend(frameon=False)
    fig.tight_layout()
    fig.savefig(out_png, metadata={"Software": None})
    plt.close(fig)
