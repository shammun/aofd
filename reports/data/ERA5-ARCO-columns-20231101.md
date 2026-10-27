# ERA5-ARCO-columns-20231101 — ERA5 37-level columns over Trappes and Singapore (D4)

- **Route**: ARCO-ERA5 zarr, anonymous. A selection of 2 vars × 2 hours × 2 grid columns transfers 4 whole 37-level
  chunks (about 0.4 GB over the network in 41 s) but writes only 21,942 B.
- **Product**: `era5_columns_trappes_singapore_2023-11-01.nc` (26,003 B) holding t [K] and z [m] for
  site × time (00, 12 UTC 1 Nov) × level (1000…1 hPa).
  - Trappes grid point 48.75°N 2.0°E; Singapore 1.25°N 104.0°E.
- **Key numbers**:
  - WMO tropopause, Trappes 00 UTC: 10.98 km, −62.3 °C. The balloon gave 10.88 km and −62.7 °C.
  - Trappes 12 UTC: 10.18 km, −54.1 °C. The front had passed and the tropopause dropped.
  - Singapore 00 UTC: 15.34 km, −76.4 °C. The balloon gave 16.16 km and −81.3 °C; the 37 levels (100/125 hPa) smooth
    the sharp tropical cold point.
  - **Stratopause (W25, 45–52 km): not resolved.** The top level, 1 hPa, sits at 46.3 km (Trappes) and 47.9 km
    (Singapore), and the temperature is still rising there (−25 °C and −12 °C).
    - ARCO's model-level stores (137 levels to 0.01 hPa) are on ERA5's native spectral/Gaussian grids, so decoding one
      column is not cheap.
    - Recommendation: show the ERA5 column up to 47 km and take the stratopause from `standard_atmosphere`
      (USSA-1976), labelled as such.
- **Licence verdict**: CC-BY 4.0. **Redistributable: yes.** Colab: committed file.
- **Disk** (data-scout session 2026-10-27, all ch00_weather_basics downloads): before the first download C: 74.2 GB and G: 577.6 GB free, project data 11.96 GB; after the last one C: 74.0 GB and G: 576.2 GB free, project data 13.34 GB (raw 0.46 GB, up 0.18 GB from 0.28 GB). Nothing evicted. Every fetch printed and logged its own before/after line in `G:/Geophysical Fluid Dynamics/aofd-data/logs/downloads.log`.
