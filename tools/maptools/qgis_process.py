"""Run a QGIS processing algorithm (GDAL / GRASS / native / OTB providers) headless for data preparation.

Thin wrapper around the user's ``qgis_process-qgis.bat`` (QGIS 3.34, nothing installed into it). Outputs go where the
parameters say (use the G: scratch or ``outputs/``); JSON result is printed.

    .venv/Scripts/python.exe tools/maptools/qgis_process.py list [--grep hillshade]
    .venv/Scripts/python.exe tools/maptools/qgis_process.py help gdal:hillshade
    .venv/Scripts/python.exe tools/maptools/qgis_process.py run gdal:hillshade INPUT=dem.asc Z_FACTOR=0.000009 OUTPUT=G:/.../hs.tif
    .venv/Scripts/python.exe tools/maptools/qgis_process.py run gdal:contour INPUT=f.asc INTERVAL=4 FIELD_NAME=level OUTPUT=c.gpkg
    .venv/Scripts/python.exe tools/maptools/qgis_process.py run gdal:warpreproject INPUT=a.tif TARGET_CRS=EPSG:3857 OUTPUT=b.tif
    .venv/Scripts/python.exe tools/maptools/qgis_process.py run native:slope INPUT=dem.tif Z_FACTOR=1 OUTPUT=slope.tif

Useful ids (QGIS 3.34 here; SAGA is not installed, GRASS 7 provider is): gdal:hillshade, gdal:contour,
gdal:contour_polygon, gdal:warpreproject, gdal:translate, gdal:cliprasterbyextent, gdal:aspect, gdal:slope,
gdal:roughness, native:hillshade, native:slope, native:aspect, native:ruggednessindex, native:reprojectlayer,
native:clip, grass7:r.relief, grass7:r.slope.aspect (check with ``list --grep grass``).
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import QGIS_ROOT  # noqa: E402


def qp() -> str:
    if not QGIS_ROOT:
        raise SystemExit("QGIS not found under C:/Program Files/QGIS*")
    return str(QGIS_ROOT / "bin" / "qgis_process-qgis.bat")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return
    cmd = sys.argv[1]
    if cmd == "list":
        r = subprocess.run([qp(), "list"], capture_output=True, text=True)
        pat = sys.argv[3].lower() if len(sys.argv) > 3 and sys.argv[2] == "--grep" else None
        for line in r.stdout.splitlines():
            if not pat or pat in line.lower():
                print(line)
        return
    if cmd == "help":
        subprocess.run([qp(), "help", sys.argv[2]])
        return
    if cmd == "run":
        alg, params = sys.argv[2], sys.argv[3:]
        args = [qp(), "--json", "run", alg, "--"] + params
        r = subprocess.run(args, capture_output=True, text=True)
        print(r.stdout[-20000:])
        if r.returncode:
            print(r.stderr[-3000:], file=sys.stderr)
        sys.exit(r.returncode)
    raise SystemExit(f"unknown command {cmd}")


if __name__ == "__main__":
    main()
