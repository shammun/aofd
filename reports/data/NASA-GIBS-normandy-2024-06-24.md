# NASA-GIBS-normandy-2024-06-24: MODIS Aqua true colour, Normandy, 24 June 2024 (sea-breeze cumulus)

Registry entry `NASA-GIBS-normandy-2024-06-24` (provenance audit, 2026-11-07). It pairs with `ERA5-ARCO-seabreeze-20240624`.

- **File**: `raw/NASA-GIBS/gibs_normandy_seabreeze_MODIS_Aqua_CorrectedReflectance_TrueColor_2024-06-24.jpg`, 113,221 B.
  - Fetched 2026-11-04 10:45 from GIBS WMS (anonymous) through `fluidpy.data.gibs.fetch_wms` → `fetch()`. The sha256 is in the registry.
- **Use**: the movie `ch00_gradient` s35 (sea breeze, D5).
  - `movies/data/build_ch00_gradient.py` reads it as `F_MODIS` and re-encodes it to `movies/ch00/ch00_gradient/data/img/sb_modis.jpg` (JPEG quality 90).
  - The movie manifest lists the raw file in `inputs_sha256`.
- **Licence verdict**: NASA EOSDIS data is CC0; credit "Imagery from the NASA Worldview application". **redistributable: yes.**
- **Colab route**: `sb_modis.jpg` is in the repo.
- **Disk**: no download in this task. 2026-11-07: C: 112.4 GB, G: 472.8 GB free.
