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
