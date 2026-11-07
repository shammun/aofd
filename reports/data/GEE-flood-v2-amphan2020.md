# GEE-flood-v2-amphan2020: flood research v2 arrays for Cyclone Amphan (not used by a movie)

Registry entry `GEE-flood-v2-amphan2020` (provenance audit, 2026-11-07). The research is described in
`reports/data/ch00_coordinates_flood_visuals.md` §1–§4.

- **Files**: 13 arrays in `raw/GEE/ch00_flood_v2/`, each with a `.request.json` sidecar (sizes and sha256 in the registry), fetched 2026-11-05.
  - Wide box, 87.6–90.8 E, 21.45–23.35 N, 1600 × 1028 pixels:
    - `modis_wide_{MOD,MYD}_<date>.npy`: six days of MOD/MYD09 7-2-1;
    - `mod8_wide_<date>.npy`: three MOD09A1 8-day composites;
    - `modcomp_wide.npz`: clear-pixel medians, 1–19 May and 21 May–3 Jun;
    - `wide_s1_jrc.npz`: Sentinel-1 VV orbit 150 on 16, 22 and 28 May, plus JRC GSW.
  - Close box, 88.8–89.92 E, 22.12–22.75 N, 1920 × 1168 pixels:
    - `close_s2.npz`: Sentinel-2 SR on 14 and 16 May and 3 Jun;
    - `close_l8.npz`: Landsat 8 SR on 8 and 24 May.
- **Route**: Earth Engine `computePixels` through `research/flood_v2/_scripts/geefetch.py`, which wraps `fluidpy.data.fetch(ee://…)`.
  The callers are `amphan_fetch.py` and `amphan_close.py` in the G: research folder.
- **Licence verdict**: decided per array; each `request.json` carries the licence and credit.
  - NASA MODIS: open data.
  - Copernicus Sentinel: free, with attribution.
  - USGS Landsat: public domain.
  - JRC GSW v1.4: CC-BY 4.0.
  - Overall: **redistributable: yes**, with the credits.
- **Use**: research only. The movie uses `GEE-S1-amphan2020` (`close_s1` / `close_jrc`) and `GEE-MODIS-flood-v3`.
- **Re-fetch**: re-run the G: research scripts with `.venv-maps`. Each sidecar holds the asset, the dates, the bounds and the size.
- **Disk**: no download in this task. 2026-11-07: C: 112.4 GB, G: 472.8 GB free. Not evictable (no `derived_on_root`).
