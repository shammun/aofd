# ERA5-ARCO-amphan2020: ERA5 near Cyclone Amphan's landfall, 20 May 2020 (movie 5b, B8)

- **Route**: ARCO-ERA5 zarr (anonymous gcsfs) → `fluidpy.data.era5_arco.fetch_box` → `fluidpy.data.fetch` (disk guard).
  - 06 UTC files (fetched 2026-11-05 for s21–s23): surface 48,256 B (14–27 N, 81–95 E), pressure levels 385,255 B.
  - **New 2026-11-06**: u10, v10, msl hourly 09–15 UTC, 20–23.5 N, 87–91 E: **37,233 B in 8.7 s** (sha256 `0fce3215…8262`).
    Network transfer is whole global chunks (≈ 3 MB per variable-hour, ≈ 63 MB here).
- **Licence**: Copernicus licence / CC-BY 4.0. **Redistributable: yes**, with the attribution
  "Contains modified Copernicus Climate Change Service information 2026 …".
- **Conventions**: store latitude N→S, longitude 0–360; `open_box` returns S→N and −180…180. u east, v north [m/s]; msl [Pa].
- **Honesty check (ERA5 vs IBTrACS NI)**: ERA5 box max 10-m wind 27.5 m/s and min msl 965.2 hPa (09–15 UTC); IMD best track
  90 kt = 46.3 m/s (3-min) / 957–960 hPa, JTWC 95 kt (1-min). ERA5 reaches ~0.6 of the IMD wind: **use directions, not speeds**.
  ERA5 centre 21.5 N 88.0 E at 09 UTC vs IBTrACS 21.4 N 88.1 E.
- **Derived**: `derived/ch00/coord_storm_shore_winds.json → events.amphan` (`fluidpy.data.movie_shore.shore_winds_product`).
  - Coastal point: Sundarbans shore, Bangladesh (Satkhira district) 21.644 N 89.229 E; ERA5 sea point 21.50 N 89.25 E (16 km).
  - Coast points (NE 10 m, outer-coast envelope): A 21.765 N 89.690 E → B 21.568 N 88.791 E; legs 21.9 km S, 92.9 km W;
    bearing 256.7°, **α = 193.3°**, ŷ′ = (0.23, −0.97) points south-south-east, out to sea (NE 50 m land test passes).
  - 09 UTC: u = −8.38, v = +20.96 (22.6 m/s from 158°) → along +3.35, **across −22.32 m/s, onto the land**.
  - msl at the sea point 985.3 hPa → inverse barometer ≈ 28 cm; ERA5 centre 965.4 hPa → ≈ 48 cm (best track 960 hPa → ≈ 53 cm).
- **Pitfalls**: the NE 10 m Sundarbans coast is a comb of estuaries: the coast bearing must come from the outer-coast envelope
  (southernmost vertex per 0.1° of longitude), not from the nearest vertex.
- **Colab route**: the derived JSON (55 kB) can be copied to the repo (CC-BY, small); no keys.
- **Disk**: before C: 108.2 GB, G: 456.2 GB free; after C: 108.2 GB, G: 456.2 GB (project data 130.1 of 150 GB). Nothing evicted.
- Quick look: `outputs/ch00/data/coord_storm_shore_winds_quicklook.png`.
