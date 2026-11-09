"""ch00_coordinates_sphere (#5c) fix loop p3a (2026-11-08, pass-2 review 2 Info): Amphan's closest approach measured from Khulna CITY.

The data builder (movies/data/build_ch00_coordinates_sphere.py) now measures it from the Natural Earth populated place Khulna
(22.842 N, 89.558 E) instead of the rounded geometry point (22.8, 89.6). A full builder run decodes the 21 600-px Blue Marble (heavy:
another movie holds HEAVY.lock), so this script repeats ONLY the Amphan steps of the builder with the same tested functions, the same
IBTrACS file and the same interpolation, then patches the one number in data/cs.json (serialised exactly as the builder does) and the
manifest (data_files hash of cs.json, parameters.amphan, the new DS16 row). The next full builder run writes the same value.

usage (repo root):  .venv/Scripts/python.exe movies/src/ch00_coordinates_sphere/checks/p3_amphan_patch.py [--write]
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT.parent / "Fluid Dynamics"))
from fluidpy.data.ibtracs import storm_table  # noqa: E402
from fluidpy.geo.sphere import great_circle_distance  # noqa: E402

OUT = ROOT / "movies" / "ch00" / "ch00_coordinates_sphere"
F_IBT_NI = Path("G:/Geophysical Fluid Dynamics/aofd-data/raw/IBTrACS-v04r01/IBTrACS.NI.v04r01.nc")
AMPHAN = "2020136N10088"


def main() -> int:
    cs = json.loads((OUT / "data" / "cs.json").read_text(encoding="utf-8"))
    KC = tuple(cs["khulna"]["places"]["Khulna"])          # the builder's pl["Khulna"] (Natural Earth 10 m populated places)
    st = storm_table(path=str(F_IBT_NI), sid=AMPHAN, agencies=("usa", "newdelhi"))
    tt = np.array([np.datetime64(t.replace(" ", "T")) for t in st["time"]])
    la_, lo_ = np.array(st["lat"], float), np.array(st["lon"], float)
    sel = (tt >= np.datetime64("2020-05-16T00:00")) & (tt <= np.datetime64("2020-05-21T06:00"))
    th = ((tt - np.datetime64("2020-05-20T00:00")) / np.timedelta64(1, "h")).astype(float)
    hf = np.arange(th[sel][0], th[sel][-1] + 1e-9, 1 / 6)
    laf, lof = np.interp(hf, th, la_), np.interp(hf, th, lo_)
    # same track as the stored one (the s19 drawing)
    assert np.allclose(np.round(la_[sel], 2), cs["khulna"]["amphan"]["lat"]) and np.allclose(np.round(lo_[sel], 2), cs["khulna"]["amphan"]["lon"])
    dK = np.asarray(great_circle_distance(lat1=laf, lon1=lof, lat2=KC[0], lon2=KC[1])) / 1e3
    jm = int(np.argmin(dK))
    km, west = float(dK[jm]), bool(lof[jm] < KC[1])
    old = cs["khulna"]["amphan"]["closest_km"]
    print(f"Khulna city {KC}: closest {km:.3f} km at {hf[jm]:+.2f} h from 20 May 00 UTC, west of the city: {west} (stored before: {old:.2f} km)")
    ok = abs(km - 79.36) <= 0.01 and west
    print("CHECK DS16 closest ≈ 79.36 km ±0.01, to the west:", "PASS" if ok else "FAIL")
    if not ok:
        return 1
    if "--write" not in sys.argv:
        return 0
    cs["khulna"]["amphan"]["closest_km"] = km
    blob = json.dumps(cs, separators=(",", ":"), ensure_ascii=False, allow_nan=False).encode("utf-8")
    (OUT / "data" / "cs.json").write_bytes(blob)
    man = json.loads((OUT / "manifest.json").read_text(encoding="utf-8"))
    man["data_files"]["cs.json"] = hashlib.sha256(blob).hexdigest()
    man["parameters"]["amphan"]["closest_km_to_khulna"] = km
    man["parameters"]["amphan"]["closest_from"] = "Khulna city, Natural Earth 10 m populated places (22.842 N, 89.558 E)"
    name = "Amphan's centre closest to Khulna city (22.842 N, 89.558 E) ≈ 79.36 km, to its west (screen '≈ 79 km to the west'; Part 2 79.4)"
    man["checks"] = [r for r in man["checks"] if r.get("name") != name]
    i = max(k for k, r in enumerate(man["checks"]) if r["id"] == "DS16") + 1
    man["checks"].insert(i, {"id": "DS16", "name": name, "value": [round(km, 6), 1.0], "ref": [79.36, 1.0], "tol": [0.01, 0], "pass": True})
    man["p3a_patch"] = "2026-11-08 checks/p3_amphan_patch.py: khulna.amphan.closest_km from Khulna city (79.36 km), cs.json rehashed; the builder does the same"
    (OUT / "manifest.json").write_text(json.dumps(man, indent=1, ensure_ascii=False), encoding="utf-8")
    print("patched data/cs.json and manifest.json; sha256", man["data_files"]["cs.json"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
