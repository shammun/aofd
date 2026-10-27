# NASA-GIBS-cumulus-france-2024-06-24 — fair-weather cumulus field at 250 m (D9)

- **How it was chosen**: a contact sheet of MODIS Aqua images at 0.01° (`outputs/ch00/data/d9_candidates.png`). It
  covers the US Southeast (31–36°N, 90–82°W) and northern France (46–50°N, 1°W–5°E) on six summer days in 2023–2024.
  - **24 June 2024 over northern France** is a textbook field of small, flat-based popcorn cumulus with cloud streets
    from the Channel coast to the Loire.
  - Forests (Orléans, Sologne, Fontainebleau) and Paris stay cloud-free.
  - The runner-up is the US Southeast on 11 Jul 2023, which has a swath seam.
- **Route**: GIBS WMS, anonymous, at 0.0025° (MODIS true colour, sharpened to 250 m). Box 47–49.5°N, 0–4°E,
  1600 × 1000 px.
  - Aqua (about 13:20 UTC at 2°E): 447,678 B.
  - Terra (about 10:20 UTC): 410,030 B.
  - Both files are copied byte for byte.
- **Teaching bonus**: the cells are smaller at 10:20 than at 13:20 UTC, because the cumulus grow through the day. The
  ERA5 cloud base estimate rises from 1.1 to 1.4 km (ERA5-ARCO-cumulus-france-20240624).
- **Licence verdict**: NASA CC0. **Redistributable: yes.**
- **Quick-look**: `outputs/ch00/data/d9_cumulus_250m.png`.
- **Disk** (data-scout session 2026-10-27, all ch00_weather_basics downloads): before the first download C: 74.2 GB and G: 577.6 GB free, project data 11.96 GB; after the last one C: 74.0 GB and G: 576.2 GB free, project data 13.34 GB (raw 0.46 GB, up 0.18 GB from 0.28 GB). Nothing evicted. Every fetch printed and logged its own before/after line in `G:/Geophysical Fluid Dynamics/aofd-data/logs/downloads.log`.
