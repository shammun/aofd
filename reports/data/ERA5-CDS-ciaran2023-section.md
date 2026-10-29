# ERA5-CDS-ciaran2023-section: ERA5 pressure levels round Storm Ciarán, 2023-11-01 18 UTC (weather basics UF1, D12, s47–s48)

- **Route**: CDS API through `fluidpy.data.cds.retrieve` → `fluidpy.data.fetch(retrieve=...)` (disk guard given 3 MB).
  - Request: `reanalysis-era5-pressure-levels`, product_type `reanalysis`.
  - Variables: temperature, specific humidity, u, v, vertical velocity (ω), geopotential.
  - Levels: 20, from 1000 to 300 hPa. Time: 2023-11-01 18 UTC.
  - Area [51, −20, 46, 6] (N, W, S, E), grid 0.25° set on the server, netCDF unarchived.
  - Result: 617,941 B in 180.5 s including the queue, sha256 `643e5ed4…d48e`. That is smaller than the planned 1.1 MB because the netCDF is compressed.
- **Licence**: CC-BY 4.0 (Copernicus), attribution line required. **Redistributable: yes.**
- **Product**: `era5_ciaran_2023_section_48p5N_18UTC.nc` (567,858 B, sha256 `03803164…96c6`), made by `cds.grid_product`. On G: and in the repo (`data/derived/ch00/`).
  - Dimensions: time 1, level 20 (1000→300 hPa), lat 46–51° N (S→N, 21), lon −20…6° E (105).
  - The whole box is kept. The builder takes the 48.5° N slice (or any path) with F15 `diag.sections.vertical_section`.
- **Pitfall**: `z` is **geopotential [m² s⁻²]**, not height. Divide by 9.80665 for geopotential height. The minimum is −3296 m² s⁻² at 1000 hPa, where the pressure surface lies below sea level inside the low.
- **First look** (box ranges): t 224.8–289.8 K; q up to 9.7 g kg⁻¹; u −9.6…50.4 m s⁻¹; v −34.2…35.6 m s⁻¹; ω −3.17…+1.49 Pa s⁻¹.
  - Along 48.5° N the largest unsmoothed |∂T/∂λ| at 850 hPa is at **12.75° W**, inside the W70 window (14–11° W).
  - The builder's smoothed slope test (W70, W71) is still to run.
- **Colab route**: the repo product (no keys).
- **Disk**:

  | | C: free | G: free | Project data |
  |---|---|---|---|
  | Before | 71.6 GB | 528.5 GB | 61.90 GB |
  | After | 71.6 GB | 528.5 GB | 61.91 GB |

  C: was checked before the download (above the 40 GB floor). Nothing was evicted.
- **Same session**: added the registry row `ETOPO2022-60s-brittany` for the subset already on disk (`raw/ETOPO2022-60s/etopo2022_60s_brittany_46.5-49.5N_-6.5--1E.nc`).
  - 202,464 B, sha256 `9171ce38…c65c`.
  - Fetched 2026-10-27 by OPeNDAP through `fetch()`; public domain.
  - 180 × 330 cells at 1′; z from −4632 to +328 m (EGM2008).
