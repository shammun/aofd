# GEE-flood-v2-ian2022: Sentinel-2 and NAIP arrays for Hurricane Ian at Fort Myers Beach (research)

Registry entry `GEE-flood-v2-ian2022` (provenance audit, 2026-11-07). Research: `reports/data/ch00_coordinates_flood_visuals.md` §3.

- **Files**: three arrays in `raw/GEE/ch00_flood_v2/`, each with a `.request.json` sidecar (fetched 2026-11-05):
  - `ian_s2.npz` (57,631,514 B): Sentinel-2 SR on 25 and 30 Sep 2022, box 82.2–81.8 W, 26.36–26.56 N, 1920 × 1072 pixels;
  - `ian_naip_overview.npz` (3,618,326 B): NAIP Dec 2021 along Estero Island, 1800 × 670 pixels;
  - `ian_naip_20220930bC0815745w262745n.npz` (13,997,126 B): NAIP 2021 on the footprint of NOAA ERI tile C0815745w262745n,
    2160 × 2160 pixels. It is the "before" image of the aerial pair (the "after" is `NOAA-ERI`).
- **Route**: Earth Engine `computePixels` through `research/flood_v2/_scripts/geefetch.py`, which wraps `fetch(ee://…)`.
  The caller is `ian_fetch.py` in the G: research folder.
- **Licence verdict**: **redistributable: yes.** Credits:
  - Sentinel-2: "Contains modified Copernicus Sentinel data 2022, processed in Google Earth Engine".
  - NAIP: "USDA Farm Service Agency NAIP (public domain)".
- **Use**: research only. The Ian slider was proposed but not adopted.
- **Disk**: no download in this task. 2026-11-07: C: 112.4 GB, G: 472.8 GB free. Not evictable.
