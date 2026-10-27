# ERA5-CDS-timeseries — Brest 2 m temperature 1991–2023 (D6)

- **Route**: CDS API (free login; token in `%USERPROFILE%/.cdsapirc`, never copied) through the new
  `fluidpy.data.cds.retrieve`. It calls `fetch(retrieve=…)`, so the disk guard and the log apply.
  - Dataset `reanalysis-era5-single-levels-timeseries`, location 48.45°N 4.42°W, 1991-01-01/2023-12-31, netCDF.
  - 3,486,810 B in 62 s, including the queue.
  - The CDS picked the grid point 48.5°N 4.5°W, the same Brest point as A1.
- **Product**: `era5_brest_t2m_daily_1991-2023.nc` (200,274 B): UTC-day mean, minimum and maximum. There are 12,053
  days and none is missing.
- **Key numbers**:
  - 1991–2020 mean 12.01 °C; 2023 mean 12.93 °C.
  - 1 Nov 2023: 12.97 °C. 2 Nov 2023: 10.34 °C.
  - An indicative 10–90 % band (±7-day window, no smoothing) holds 78.6 % of 2023's days, with 20.0 % above it and 1.4 %
    below. The official W35 number comes from F10 `daily_climatology`.
- **Licence verdict**: CC-BY 4.0. **Redistributable: yes** (Copernicus attribution).
- **Colab**: committed file, no key. A refresh needs a CDS key (Colab Secret `CDSAPI_KEY`).
- **Disk** (data-scout session 2026-10-27, all ch00_weather_basics downloads): before the first download C: 74.2 GB and G: 577.6 GB free, project data 11.96 GB; after the last one C: 74.0 GB and G: 576.2 GB free, project data 13.34 GB (raw 0.46 GB, up 0.18 GB from 0.28 GB). Nothing evicted. Every fetch printed and logged its own before/after line in `G:/Geophysical Fluid Dynamics/aofd-data/logs/downloads.log`.
