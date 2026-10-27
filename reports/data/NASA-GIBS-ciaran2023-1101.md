# NASA-GIBS-ciaran2023-1101 — Ciarán approaching, 1 Nov 2023 afternoon (D5a)

- **Route**: GIBS WMS, anonymous. One 2500 × 1500 image (0.02°, 35–65°N, 40°W–10°E) per layer, each about 1.1 MB in
  3–5 s.
- **Mosaic**:
  - MODIS Aqua 99.77 %.
  - MODIS Terra 0.23 %. These are isolated dark-ocean pixels at or below the 8/255 threshold, not real gaps.
  - VIIRS NOAA-20 0.002 %.
- **Product**: `ciaran_truecolour_2023-11-01_aqua_terra.jpg`, 1,444,043 B, with a sidecar JSON.
  - Aqua's overpass is at about 13:20 UTC at 0°, 14:00 UTC at 10°W and 16:10 UTC at 40°W.
  - ERA5 is hourly, so 13 or 14 UTC is the matching hour.
- **Licence verdict**: NASA CC0. **Redistributable: yes.**
- **Disk** (data-scout session 2026-10-27, all ch00_weather_basics downloads): before the first download C: 74.2 GB and G: 577.6 GB free, project data 11.96 GB; after the last one C: 74.0 GB and G: 576.2 GB free, project data 13.34 GB (raw 0.46 GB, up 0.18 GB from 0.28 GB). Nothing evicted. Every fetch printed and logged its own before/after line in `G:/Geophysical Fluid Dynamics/aofd-data/logs/downloads.log`.
