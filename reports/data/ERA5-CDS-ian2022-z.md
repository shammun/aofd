# ERA5-CDS-ian2022-z: ERA5 geopotential on 18 levels round Hurricane Ian, 2022-09-28 18 UTC (stack heights)

Registry entry `ERA5-CDS-ian2022-z`. It was split out of `ERA5-ARCO-ian2022-pl` by the provenance audit (2026-11-07),
which already described this file under `raw_files_extension`. The full write-up is in
`reports/data/ERA5-ARCO-ian2022-pl.md`, section "Stack check and heights extension, 2026-10-29".

- **Route**: CDS API through `fluidpy.data.cds.retrieve`, called via `fetch(retrieve=…)`.
  - Dataset `reanalysis-era5-pressure-levels`, variable geopotential.
  - 18 levels (1000–100 hPa), 2022-09-28 18:00 UTC, area [32, −90, 20, −75].
  - It needs a CDS account. The token lives in `%USERPROFILE%\.cdsapirc`, never in the repo.
- **Raw**: `raw/ERA5-CDS-ian2022-z/era5_ian_pl_z_18lev_2022-09-28T18.nc`.
  - 106,698 B, sha256 `2bd66393…6ecd`, final ERA5.
  - Transfer took 42.4 s (887 s including the CDS queue), fetched 2026-10-29.
- **Derived**: `derived/ch00/era5_ian_2022-09-28T18_z18.nc`, made by `fluidpy.data.stack.stack_product`.
  - 212,045 B, sha256 `214daef5…8b0a`. It is on G: and in the repo at `data/derived/ch00/`; the two copies are identical.
  - Contents: z [m² s⁻²] and zg = z / 9.80665 [m], levels ordered bottom to top.
  - It uses the same 49 × 61 grid as the u/v product.
- **Checks**: zg at the ERA5 centre (26.454 N, 82.391 W):
  - 1000 hPa: −171 m. This is below sea level because ERA5 extrapolates under the 979.6 hPa low.
  - 975 hPa: 49 m. 500 hPa: 5680 m. 100 hPa: 16,647 m.
- **Licence verdict**: CC-BY 4.0 (Copernicus licence), with the attribution line. **redistributable: yes.**
- **Used by**: movie `ch00_coordinates` s14, the K5 cylindrical stack (layer heights; read by `movies/data/build_ch00_coordinates.py`).
- **Colab route**: the repo product. No key needed.
- **Disk**: no download in this task. Original fetch: C: 53.4 → 52.8 GB, G: 520.4 → 520.3 GB.
  2026-11-07: C: 112.4 GB, G: 472.8 GB. Now evictable: the raw file can be downloaded again and its derived product exists.
