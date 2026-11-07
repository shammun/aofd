# GEE-flight-patch-bay2020: Bay of Bengal flight patch (MODIS MCD43A4 NBAR + ETOPO1), 84–94 E 15–25 N

Registry entry `GEE-flight-patch-bay2020` (provenance audit, 2026-11-07).

- **What it is**: `raw/GEE/ch00_flood_v2/zoom_base.npz` (16,688,634 B, sha256 in the registry; fetched 2026-11-05).
  - Two arrays on one EPSG:4326 grid of 1400 × 1490 pixels, row 0 = north, bounds_WSEN [84, 15, 94, 25]:
    - `nbar`: MODIS MCD43A4 v061 median over 1–8 Feb 2020, bands 1, 4, 3 as R, G, B (reflectance × 1e4);
    - `etopo1`: NOAA ETOPO1 bedrock elevation [m].
  - Sidecar: `zoom_base.request.json`.
- **Used by**: movie `ch00_coordinates_storm` s29, the flight to the Sundarbans (`data/img/bay_patch.png`, 2,181,893 B).
  - The builder reads the cache hit only: `gee_cached("zoom_base", "npz")`.
- **Licence verdict**: NASA MODIS open data (LP DAAC) and NOAA ETOPO1 (public domain). **redistributable: yes.**
  Credit: "NASA MODIS MCD43A4 v061; NOAA NCEI ETOPO1; processed in Google Earth Engine".
- **How to fetch it again** (needs Earth Engine, so the `.venv-maps` interpreter and the user's EE project; no key is stored anywhere):
  - **`geefetch.py` was recovered.** The audit thought it was missing because it looked in the repo. The builder's path
    `research/flood_v2/_scripts/geefetch.py` is relative to the G: research folder
    `G:/…/aofd-data/scratch/movies/ch00_coordinates/research/flood_v2/_scripts/geefetch.py`, and the file is there.
  - A byte-identical copy is now in the repo at `research/flood_v2/_scripts/geefetch.py` (sha256 `4c080fa7…a799d`, 4,595 B).
    It was verified against the session transcript: the original Write plus one Edit that added `pixels_bundle`, replayed, give
    the same bytes.
  - `zoom_base` was produced by `amphan_close.py zoom_base` (same G: folder, lines 107–116). That script calls
    `pixels_bundle([("nbar", MCD43A4 median 2020-02-01..02-09, 3, 2), ("etopo1", NOAA/NGDC/ETOPO1 bedrock, 1, 2)],
    (84, 15, 94, 25), 1400, <square height>, "zoom_base", meta)`.
  - `zoom_prep.py` only reads the cached array to make the research texture. The `.request.json` records the assets, the
    dates, the box and the size.
  - Every array goes through `fluidpy.data.fetch(ee://ch00_flood_v2/<name>, retrieve=…)` and the disk guard, and is archived
    under `raw/GEE/ch00_flood_v2/`.
- **Colab route**: the derived `bay_patch.png` is in the repo, so no Earth Engine is needed.
- **Disk**: no download in this task. 2026-11-07: C: 112.4 GB, G: 472.8 GB free. No evictions.
  The entry has no `derived_on_root`, so the file is not evictable.
