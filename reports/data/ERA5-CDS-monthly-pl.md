# ERA5-CDS-monthly-pl — ERA5 November 2023 zonal-mean temperature and tropopause (D8)

- **Route**: CDS API through `fluidpy.data.cds.retrieve`.
  - Request: `reanalysis-era5-pressure-levels-monthly-means`, monthly_averaged_reanalysis, t and z, 37 levels,
    2023-11, grid 1° × 1° (regridded on the server), netCDF unarchived.
  - 6,690,545 B in 112 s, including the queue.
- **Product**: `era5_zonal_t_z_tropopause_2023-11.nc` (68,048 B). It holds t_zm and z_zm by (level, lat) and the WMO
  tropopause by latitude, computed two ways: from the zonal-mean profile, and as the mean over all columns.
- **Key numbers** (mean of the columns):

  | Latitude | Tropopause height | Temperature |
  |---|---|---|
  | 15°S–15°N | **16.6 km** | −78…−79 °C |
  | 30°N / 30°S | 15.6 km | |
  | 45°N | 11.4 km | |
  | 60–70°N | 9.9 km | |
  | **85°N** | **8.9 km** (8.5 km from the zonal-mean profile) | −57 °C |
  | 85°S | 10.1 km | −68 °C (Antarctic spring) |

  - **W27 (polar 7–10 km) passes for the Arctic.**
  - The heights are quantised by the 37 levels (100 hPa ≈ 16.6 km).
  - The top level is 1 hPa ≈ 47.2 km, so the stratopause is not resolved (see ERA5-ARCO-columns-20231101).
- **Licence verdict**: CC-BY 4.0. **Redistributable: yes.**
- **Disk** (data-scout session 2026-10-27, all ch00_weather_basics downloads): before the first download C: 74.2 GB and G: 577.6 GB free, project data 11.96 GB; after the last one C: 74.0 GB and G: 576.2 GB free, project data 13.34 GB (raw 0.46 GB, up 0.18 GB from 0.28 GB). Nothing evicted. Every fetch printed and logged its own before/after line in `G:/Geophysical Fluid Dynamics/aofd-data/logs/downloads.log`.

## Extension 2026-10-30: September 2026 t, u, z (movie #6 D6, s36)

- **Route**: `cds.retrieve`, 37 levels, 1°; 10,918,077 B in 106.3 s. September 2026 is the newest complete month and may still be ERA5T.
- **Product**: `era5_zonal_t_u_z_2026-09.nc`, 74,968 B, on G: and in the repo. `t_zm`, `u_zm`, `z_zm` on (level, lat).
- **Measured**:
  - Real zonal-mean jet, Northern Hemisphere: **25.66 m/s at 45° N, 200 hPa, Z 12.15 km**.
  - 850–300 hPa pressure-weighted steepest ∂T/∂y: −6.37 K/1000 km at 45° N. The jet sits exactly above it (DG35 "within 3°": PASS).
  - 500 hPa steepest −6.04 at 45° N. T(30° N) − T(60° N): 15.9, 15.0, 14.5 K at 850, 500, 300 hPa.
- **Nov 2023 rows re-checked on the old product**: steepest at 44° N, PASS; 500 hPa −7.13, PASS; T difference 850 hPa 21.27, PASS. The layer mean depends on the method: −7.19 pressure-weighted, −7.09 on 850/700/500/300, against plan −6.98 ± 0.1 (FAIL by 0.01–0.11, spoken "about seven" holds). An unweighted mean of all 14 levels moves the latitude to 41° N, so the builder should state the weighting.
- **If s36 moves to September 2026**: "November twenty twenty three" → "September twenty twenty six"; "near forty four" → "near forty five"; "about seven" → "about six"; "about ten and a half kilometres" → "about twelve"; "about thirty metres per second" → "about twenty five". This also replaces the geostrophic estimate with real zonal wind.
- **Disk**: whole session, C: 60.4 → 61.0 GB free, G: 492.1 → 491.1 GB free, project data 98.07 → 99.01 GB. Render scratch moves these too. Nothing evicted.
