# NASA-GIBS-global-2023-11-02 — daytime true-colour globe for the Ciarán day (D5b)

- **Route**: GIBS WMS 1.3.0, anonymous, in 2 × 2 tiles of 3600 × 1800 per layer (0.05°) through `fluidpy.data.fetch`.
  - No Content-Length is sent; the guard used an estimate of 6 MB per tile.
  - Each tile was about 1.3–1.7 MB and took 5–7 s.
- **Mosaic** (`gibs.global_daily_mosaic`), in fill order:

  | Source | Share of pixels |
  |---|---|
  | VIIRS NOAA-20 | 85.6 % |
  | VIIRS NOAA-21 | 0.4 % |
  | MODIS Aqua | 3.8 % |
  | Blue Marble NG, November 2004 (resampled 5400 → 7200) | 10.2 % (Arctic polar night, swath gaps) |

  Pixels still empty: 0.
- **Product**: `gibs_truecolour_global_2023-11-02_0p05.jpg`, 7,685,821 B, 7200 × 3600, with a sidecar JSON giving the
  edges, the fractions and an overpass note.
- **Pitfalls**:
  - It is not one instant. Each longitude is seen near its own 13:30 local time.
  - The Arctic is filled with a sunlit Blue Marble in November, when it is actually dark.
- **Orientation**: checked in `outputs/ch00/data/ql_global.png` with ERA5 isobars. The Azores high and Ciarán markers
  fall in the right places.
- **Licence verdict**: NASA CC0, credit NASA; BMNG not copyrighted. **Redistributable: yes.**
- **Disk** (data-scout session 2026-10-27, all ch00_weather_basics downloads): before the first download C: 74.2 GB and G: 577.6 GB free, project data 11.96 GB; after the last one C: 74.0 GB and G: 576.2 GB free, project data 13.34 GB (raw 0.46 GB, up 0.18 GB from 0.28 GB). Nothing evicted. Every fetch printed and logged its own before/after line in `G:/Geophysical Fluid Dynamics/aofd-data/logs/downloads.log`.
