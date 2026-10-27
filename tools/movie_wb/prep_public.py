"""Public folder for the ch00_weather_basics render: resized images, the data bins and the narration+music WAV.

Run with the main venv::

    .venv/Scripts/python.exe tools/movie_wb/prep_public.py --out "G:/.../scratch/movies/ch00_weather_basics/v1/public"

Images are display copies of committed products (data/derived/ch00, the cross-product movie's Blue Marble), resized
with Lanczos so a 1080p frame never decodes a 26-Mpx texture; the sha256 of each source is in the movie manifest
(``assets``). Nothing is written into the repo.
"""
from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
DER = ROOT / "data" / "derived" / "ch00"
CP = ROOT / "movies" / "ch00" / "ch00_cross_product_why" / "data" / "real"
DATA = ROOT / "movies" / "ch00" / "ch00_weather_basics" / "data"
Image.MAX_IMAGE_PIXELS = None

IMAGES = {  # out name: (source, max width)
    "wb_globe_tc_20231102.jpg": (DER / "gibs_truecolour_global_2023-11-02_0p05.jpg", 2048),
    "wb_bmng.jpg": (CP / "globe_bmng_topo_bathy_200409_5400x2700.jpg", 2048),
    "wb_ciaran_tc_20231101.jpg": (DER / "ciaran_truecolour_2023-11-01_aqua_terra.jpg", 2000),
    "wb_modis_20231102.jpg": (DER / "ciaran_modis_aqua_truecolour_2023-11-02.jpg", 2100),
    "wb_cumulus_20240624.jpg": (DER / "cumulus_france_2024-06-24_modis_aqua_250m.jpg", 1600),
}
BINS = ["global_20231102T12.bin", "ciaran_hourly.bin", "ciaran_850.bin", "climatology.bin"]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--audio", type=Path, help="narration_music.wav to copy in")
    a = ap.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    for name, (src, w) in IMAGES.items():
        dst = a.out / name
        if dst.exists() and dst.stat().st_mtime > src.stat().st_mtime:
            continue
        im = Image.open(src).convert("RGB")
        if im.width > w:
            im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        im.save(dst, quality=90)
        print(f"{name}: {im.size}")
    for b in BINS:
        shutil.copy2(DATA / b, a.out / f"wb_{b}")
    if a.audio:
        shutil.copy2(a.audio, a.out / "narration_music.wav")
    print("public ->", a.out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
