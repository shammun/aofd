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
    "wb_cumulus_terra_20240624.jpg": (DER / "cumulus_france_2024-06-24_modis_terra_250m.jpg", 1600),   # UF1 s26 morning
}
BINS = ["global_20231102T12.bin", "ciaran_hourly.bin", "ciaran_850.bin", "climatology.bin", "latest_gfs.bin", "tibet_etopo.bin",
        "brittany_etopo.bin", "slice.bin", "slice_cf.bin"]   # UF1: s03 relief, s48 slice (48.5N); fix 1: s47 slice (46.5N)
CROPS = {  # out name: (source, lat0, lat1, lon0, lon1) on an equirectangular image (-180..180, 90..-90)
    "wb_bmng_tibet.jpg": (CP / "globe_bmng_topo_200409_5400x2700.jpg", 25.0, 42.0, 72.0, 105.0),
    # UF1 s03: Blue Marble NG 21600 (A6, 500 m) crop of the ETOPO Brittany tile, cloud-free drape for the 3-D relief
    "wb_bmng_brittany.jpg": (Path("G:/Geophysical Fluid Dynamics/aofd-data/raw/BMNG-2004/world.topo.bathy.200409.3x21600x10800.jpg"), 46.5, 49.5, -6.5, -1.0),
}
UPSAMPLE = {  # UF1 fix 1 (review 1 S2): the 330-px Brittany drape is upsampled ×4 (Lanczos) + unsharp mask so the close-up is not a blur
    "wb_bmng_brittany.jpg": 4,
}


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
    for name, (src, la0, la1, lo0, lo1) in CROPS.items():
        im = Image.open(src).convert("RGB")
        W_, H_ = im.size
        box = (round((lo0 + 180) / 360 * W_), round((90 - la1) / 180 * H_), round((lo1 + 180) / 360 * W_), round((90 - la0) / 180 * H_))
        im = im.crop(box)
        if name in UPSAMPLE:
            from PIL import ImageFilter
            k = UPSAMPLE[name]
            im = im.resize((im.width * k, im.height * k), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=3, percent=90, threshold=2))
        im.save(a.out / name, quality=92)
        print(name, box)
    for b in BINS:
        shutil.copy2(DATA / b, a.out / f"wb_{b}")
    if a.audio:
        shutil.copy2(a.audio, a.out / "narration_music.wav")
    print("public ->", a.out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
