# HRRR-zarr-ian2022 — NOAA HRRR 3-km analyses of Hurricane Ian near landfall (2022-09-28 12–21 UTC)

- **Route**: the anonymous HRRR-zarr archive `s3://hrrrzarr/sfc/20220928/20220928_HHz_anl.zarr` (University of Utah
  copy of NOAA HRRR, 150 × 150 chunks), read lazily through `fluidpy.data.fetch` (`fluidpy.data.hrrr.storm_box`).
  - **Why not the GRIB route**: the requested route was GRIB2 byte ranges from `noaa-hrrr-bdp-pds` via the `.idx`
    files (HEAD OK: the 18z `wrfsfcf00` file is 144.5 MB, its `.idx` 9.1 kB). It was **not used because no GRIB decoder
    (cfgrib/eccodes/pygrib) is installed in `.venv`**. The zarr mirror holds the same analysis fields and needs no
    install.
  - **Library changes**: `fetch()` now supports `s3://` anonymous zarr access, a `group` in the subset, falls back
    when there is no consolidated metadata, and upcasts float16 (the winds are stored as float16) to float32.
  - **Fields**: `mean_sea_level/MSLMA`, `surface/PRES`, `10m_above_ground/UGRD`, `VGRD`, in the window 23.2–30.3°N
    85.8–78.3°W (236 × 217 points), hourly 12–21 UTC.
  - **Sizes**: 40 raw files, 2.35 MB in total, about 0.1 MB each, about 66 s per hour (mostly opening the store).
  - **Derived product**: `G:/…/derived/ch00/hrrr_ian_2022.nc` (3.97 MB), with the winds rotated from grid-relative to
    earth-relative (α = sin 38.5°·(λ + 97.5°)) and 2-D lat/lon added.
  - **Movie copy**: `ian_hrrr_2022.bin` (3,687,264 B: psfc, mslma, u10, v10, lat, lon at 17–20 UTC) plus `.json`.
- **Licence verdict**: NOAA NODD data: "open to the public and can be used as desired". Credit NOAA; do not present
  modified data as original NOAA data or imply endorsement. **Redistributable: yes**, as "derived from NOAA HRRR". Cite
  Dowell et al. (2022) and Gowan et al. (2022).
- **Numbers** (centre = minimum surface pressure; RMW from the azimuthal-mean 10 m tangential wind in 3-km rings;
  "eye" = mean 10 m speed within 6 km of the centre):

  | UTC | psfc min (hPa) | MSLMA min (hPa) | max 10 m (m/s) | RMW (km) | eye speed (m/s) |
  |---|---|---|---|---|---|
  | 12 | 957.5 | 965.8 | 41.0 | 40 | 13.9 |
  | 13 | 969.4 | 975.7 | 35.2 | 56 | 10.9 |
  | 14 | 969.0 | 975.1 | 43.5 | 38 | 7.6 |
  | 15 | 969.7 | 975.4 | 39.8 | 35 | 9.1 |
  | 16 | 970.6 | 975.1 | 42.9 | 35 | 5.5 |
  | 17 | **934.2** | 951.9 | **61.0** | 26 | 14.9 |
  | 18 | 947.9 | 960.3 | 50.8 | 29 | 20.0 |
  | 19 | 943.7 | 961.0 | **64.3** | 20 | 22.9 |
  | 20 | 939.1 | 956.9 | 47.3 | 20 | 13.5 |
  | 21 | 958.5 | 969.2 | 39.4 | 44 | 8.0 |

  - **Observed at landfall** (HURDAT2, 2022-09-28T19:05): 941 hPa, 130 kt = 66.9 m/s (1-min sustained), RMW 37 km.
  - At 19 UTC HRRR gives 943.7 hPa and 64.3 m/s. This is **close to the observed strength**, unlike ERA5
    (972 hPa / 32 m/s).
  - The circulation is anticlockwise at every hour (mean tangential wind 10–100 km: +19 to +28 m/s).
- **Eye and eyewall**: resolved at 17–20 UTC. There is a weak-wind centre about 10–15 km across, surrounded by a
  closed eyewall ring at 20–30 km radius with 50–64 m/s, strongest on the western (ocean) side
  (`outputs/ch00/data/p_ian_hrrr.png`). At 3 km the eye spans only about 5–7 grid points, so the eye winds are not calm
  (5–23 m/s mean within 6 km).
- **Pitfalls**:
  1. **The hourly analyses are not consistent with each other.** 13–16 UTC sit near 969 hPa with a broad 35–55 km RMW,
     while 17–20 UTC jump to 934–948 hPa. This is the assimilation cycle, not storm physics. Use 17–20 UTC only, and do
     not animate 12→21 as if it were a continuous evolution.
  2. **MSLMA** (the MAPS sea-level reduction) is 10–18 hPa shallower than surface pressure in the core. Over the sea
     use `psfc` for the central pressure.
  3. HRRR covers CONUS only, so there is no Idai equivalent.
- **Credit line**: "Derived from NOAA HRRR analyses (public domain), via the University of Utah HRRR-zarr archive on AWS."
- **Disk**: before, C: 84.2 GB and G: 583.2 GB free. After, C: 84.2 GB and G: 583.1 GB. Project data went from 6.37 to
  6.45 GB; part of that is render scratch from another process (scratch went from 6.18 to 6.26 GB).
