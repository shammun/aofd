# NASA-GIBS-global-2023-11-01 — daytime true-colour globe, 1 Nov 2023 (movies #1a/#1b D3, optional)

- **Route**: GIBS WMS 1.3.0 (anonymous) through `fluidpy.data.gibs.global_daily_mosaic("2023-11-01", res=0.05)`.
  - Each layer is fetched as 2 × 2 tiles of 3600 × 1800, every tile through `fluidpy.data.fetch` and the disk guard
    (6 MB estimate per tile).
  - Fill order: VIIRS NOAA-20, VIIRS NOAA-21, MODIS Aqua, then BMNG November (already cached).
  - 12 tiles, 1.33–1.54 MB each, 6–10 s each.
- **Product**: `gibs_truecolour_global_2023-11-01_0p05.jpg` (7,583,556 B, sha256 `76b7efd9…0033`) plus sidecar `.json`.
  - 7200 × 3600 equirectangular; row 0 = 90° N, col 0 = 180° W.
  - On G: and in the repo `data/derived/ch00/`.
- **Fractions**: NOAA-20 85.68 %, NOAA-21 0.33 %, Aqua 3.95 %, BMNG 10.04 % (polar night and swath gaps); still empty
  0.0002 %.
- **Quick look**: `outputs/ch00/data/ql_gibs_global_2023-11-01.png`. The Arctic is BMNG-filled at the top and Antarctica is
  at the bottom. Ciarán's cloud comma is west of Europe and the Sahara is clear. The orientation is correct.
- **Licence verdict**: NASA EOSDIS imagery, CC0. The BMNG is not copyrighted. Credit NASA Worldview/ESDIS and the BMNG
  (Stöckli et al. 2005). **Redistributable: yes.**
- **Pitfall**: the image is not one instant. Each longitude is seen near 13:30 local solar time, so the globe does not
  show 18 UTC; say "that day", not "that moment".
- **Disk**: before C: 68.0 GB, G: 543.2 GB free; after C: 67.8 GB, G: 543.1 GB free. Nothing evicted.
