# NASA-GIBS-trappes-2026-09-30 — true colour over northern France, 30 Sep 2026 (movie #4 D5, optional)

- **Route**: GIBS WMS 1.3.0 (anonymous) through `fluidpy.data.gibs.fetch_wms_tiled`, one 1000 × 700 image per layer, each
  through `fluidpy.data.fetch` and the disk guard.
  - Box 45–52° N, 3° W–7° E, 0.01°.
  - Layers: MODIS Aqua (primary), MODIS Terra, then VIIRS NOAA-20 as fills (`gibs.mosaic_fill`).
  - Aqua tile 122,180 B in 2.1 s.
- **Product**: `trappes_truecolour_2026-09-30_aqua_terra.jpg` (152,359 B, sha256 `e16e8885…c6a0`) plus sidecar `.json`. On G:
  and in the repo.
- **Fractions**: Aqua 99.98 %, Terra 0.02 %, NOAA-20 0 %; still empty 0.
- **Quick look**: `outputs/ch00/data/ql_gibs_trappes_2026-09-30.png`.
  - France, including Paris and Trappes, is almost entirely under a broad frontal cloud band. Southern England and the
    Channel are partly clear at the top left.
  - This fits the ERA5 southerly flow of about 12 m/s.
  - **For s09 the close-up shows cloud, not the ground.** It can serve as "the launch day from space". Otherwise use the
    runner-up BMNG (A7).
- **Licence verdict**: NASA EOSDIS imagery, CC0. **Redistributable: yes.**
- **Disk**: before C: 67.8 GB, G: 542.9 GB free; after C: 67.8 GB, G: 542.6 GB free. Nothing evicted.
