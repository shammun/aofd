# Data patterns — aofd (open data, derived products, figure reproduction)

Lessons for the data-scout and figure-reproducer. Seeded from R3/R3b and the 2026-10-20 access checks; the
knowledge-keeper adds what each chapter's data phase teaches. Skills: `open-data`, `figure-reproduction`.

## Starting lessons

- **One door for downloads:** `fluidpy.data.fetch()` → `tools/disk_guard.py` (G: floor 50 GB, project cap 150 GB;
  C: floor 40 GB; stop if G: is missing, never fall back to C:). Report free space on C: and G: before and after.
- **Data root:** `G:/Geophysical Fluid Dynamics/aofd-data/{raw,derived,scratch,logs,cache}` (`book.yaml → data.root`,
  env `AOFD_DATA_ROOT`; Colab `/content/aofd-data`). Only small redistributable derived products (≤ 10 MB each, ≤ 150 MB
  total) are copied into the repo's `data/derived/`.
- **Windows OPeNDAP:** netCDF4 1.7.5's bundled curl fails TLS here; open remote `…/dodsC/…` URLs with
  `xr.open_dataset(url, engine="pydap")`.
- **NOAA PSL:** use `downloads.psl.noaa.gov/Datasets/ncep.reanalysis.{dailyavgs,derived}/…`; the old
  `Monthlies/`/`Dailies/` paths return 403; PSL THREDDS was 503 on the test day — fall back to whole-file HTTPS.
  **Latitudes run N→S: `sortby("lat")`.** `uflx/vflx` are surface momentum fluxes: check the sign against the trades.
- **ARCO-ERA5** (anonymous zarr) is one hour per ~150 MB chunk: good for snapshots, wrong for time series (use CDS or
  NCEP). **WeatherBench2** is the best anonymous source for zonal-mean climatologies (ends Jan 2023).
- **Keyed sources work** (tested 2026-10-20): CDS (ERA5 monthly single/pressure levels) and NASA Earthdata (ECCO,
  MERRA-2). Credentials only in `%USERPROFILE%` and Credential Manager (`tools/secrets_vault.py`), Colab Secrets.
- **ECCO is large:** stream and reduce to time means once (~100 MB); confirm V4r4 collection short-names at first use.
- **Reproduce the science, not the artwork:** same variable, region, projection type and contour logic; our colormaps
  (cmocean/viridis, diverging centred), layout and caption with a credit line; substitutions labelled ("observed
  analogue", "model analogue"); pseudo-data only as a last resort, stamped "ILLUSTRATIVE — synthetic data".
- **Checks:** 2–4 published numbers per figure (RAPID 17 Sv; QBO ≈ 28 months; Kelvin h_e ≈ 25 m; PF/SAF south of Africa
  ≈ 50°S/45°S); orientation (lat not flipped), sign of ψ stated; private side-by-side only in `_private/compare/`.
- **Registry first:** every dataset has a `data/registry.yaml` entry (URL, licence + URL, citation, size, sha256 for
  fixed files, fetch date, redistributable yes/no) before its product is committed; `DATA_CREDITS.md` is generated.

## PoC record (PLANNING §12 step 11 — PoC C Fig. 21.23 map, PoC F 500 hPa scene data)

| Item | Source / route | Bytes downloaded | Derived product (size) | C: free before → after | G: free before → after | Checks |
|---|---|---|---|---|---|---|
| Natural Earth land / bathymetry | Natural Earth S3 zips (50 m land; 10 m bathymetry H_3000 only) | 457 183 + 2 528 623 | bathy3000 mask 0.25° int8 (34 kB) | 97.0 → 90.9 GB (parallel jobs) | 589.7 → 589.6 GB | public domain |
| Orsi fronts (AADC) | AAD GitHub package orsifronts @ 76d4f6d (AADC zip needs an email; not submitted) | 85 249 | fronts .npz (24 kB) | — | — | PF 49.7°S, SAF 47.6°S at 20°E; CC-BY 4.0 |
| GDP drifter mean velocity | AOML ERDDAP griddap subset 72.9–30.1°S | 9 925 136 | mean velocity .nc (2.8 MB) | — | — | Drake U +0.21 m/s; CC-BY 4.0 (registry corrected from R3) |
| NCEP R1 daily hgt 500 hPa | PSL OPeNDAP via pydap (one day, 37 kB) + HTTPS fallback hgt.2014.nc (84.9 MB, sha256) | 84 922 526 | ncep_r1_z500_20140106.nc (28 kB) | — | — | both routes identical (max diff 0 m); public domain |
