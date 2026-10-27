# ERA5-ARCO-global-20231102T12 — ERA5 global hour, 12 UTC 2 Nov 2023 (D2)

- **Route**: ARCO-ERA5 zarr, anonymous, through `fluidpy.data.fetch` (`era5_arco.fetch_box`, global box).
  - Seven single-level chunks.
  - Guard size 29.1 MB. Raw subset 16,589,614 B, fetched in 5.0 s (13 s with the store open).
- **Products**:
  - `era5_global_2023-11-02T12_sfc.nc` (0.25°, 16,995,038 B, G: only).
  - `era5_global_2023-11-02T12_sfc_0p5.nc` (every second grid point, values unchanged, 4,510,089 B, repo).
  - Variables: msl, sp [Pa]; zs [m] = surface geopotential / 9.80665; t2m, d2m [K]; u10, v10 [m s⁻¹].
  - Latitude runs S→N. Longitude runs −180…179.75 (`open_box` now maps 180°E to −180).
- **Key numbers**:
  - **Azores high** at 12 UTC 2 Nov 2023: **1029.8 hPa at 35.0°N 32.75°W**, the maximum MSLP over 20–50°N, 60°W–0.
    The same grid point is the maximum in the narrower box 25–45°N, 45–10°W, so this is the true centre, not a box
    edge. **W40 (1027–1034 hPa) passes**, and "about one thousand and thirty" holds.
  - Ciarán: 955.9 hPa at 52.5°N 1.75°E (identical to ERA5-ARCO-ciaran2023-1102).
  - **Tibet**: surface pressure minimum 494.0 hPa at 35.25°N 81.0°E (orography 5859 m). 35 % of the box 25–40°N,
    75–105°E is below 600 hPa (**W37 passes**).
  - Brest grid point (48.5°N 4.5°W): MSLP 983.0 hPa, t2m 9.8 °C, d2m 6.4 °C.
  - Global MSLP ranges from 941.6 hPa (74.5°S, 145°W, Antarctic coast) to 1041.3 hPa (44.75°S, 158.5°W).
- **Licence verdict**: CC-BY 4.0 (Copernicus) with the attribution line. **Redistributable: yes.**
- **Colab**: committed 0.5° file.
- **Quick-look**: `outputs/ch00/data/ql_global.png`.
- **Disk** (data-scout session 2026-10-27, all ch00_weather_basics downloads): before the first download C: 74.2 GB and G: 577.6 GB free, project data 11.96 GB; after the last one C: 74.0 GB and G: 576.2 GB free, project data 13.34 GB (raw 0.46 GB, up 0.18 GB from 0.28 GB). Nothing evicted. Every fetch printed and logged its own before/after line in `G:/Geophysical Fluid Dynamics/aofd-data/logs/downloads.log`.
