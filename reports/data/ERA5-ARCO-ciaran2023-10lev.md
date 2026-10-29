# ERA5-ARCO-ciaran2023-10lev: ERA5 on ten pressure levels round Storm Ciarán, 12 UTC 2 Nov 2023 (reading-maps N1)

- **Route**: ARCO-ERA5 zarr (anonymous) through `fluidpy.data.era5_arco.fetch_box`.
  - Fetched in the capability tests on 2026-10-27: 3,934,000 B in 54.0 s, logged in `logs/downloads.log`, sha256 `bc01680b…178e`.
  - Variables t, z, u, v on 1000, 925, 850, 700, 600, 500, 400, 300, 250 and 200 hPa; box 30–70° N, 40° W–20° E, 0.25°.
  - The file was on G: but was **not registered until now**.
- **Licence**: CC-BY 4.0 (Copernicus); attribution "Contains modified Copernicus Climate Change Service information 2023 …". **Redistributable: yes.**
- **Product**: the new `fluidpy.data.movie_rwm.era5_ciaran_10lev()` keeps 1000, 850, 700, 500, 300 and 250 hPa.
  - It converts geopotential to height (÷ 9.80665), sorts latitude S→N, puts longitude in −40…20 and casts to float32.

  | File | Where | Size (B) | sha256 |
  |---|---|---|---|
  | `rwm_era5_ciaran_6lev_2023-11-02T12.nc` | G: `derived/ch00/` | 2,384,213 | `19927c72…e0c4` |
  | `rwm_era5_ciaran_6lev_2023-11-02T12.bin` | repo `data/derived/ch00/` | 3,724,896 | `deea20a1…5dbb` |
  | `rwm_era5_ciaran_6lev_2023-11-02T12.json` (header) | repo `data/derived/ch00/` | 7,116 | `c7395ff4…3774` |

  The bin + JSON total 3.73 MB, under the planned 4.5 MB.
- **Checks**:
  - The 500 hPa minimum is **5114 m at 52.5° N 1.25° E**. That is the Ciarán trough: the planning seed for the 12 UTC centre was 52.5° N 1.75° E.
  - The 250 hPa wind maximum is **83.0 m/s at 46.75° N 19.5° W** (jet streak upstream of the trough).
  - Height ranges: 850 hPa 973–1636 m; 500 hPa 5114–5970 m; 250 hPa 9847–11 018 m.
  - The 1000 hPa height reaches −379 m inside the low (the surface lies below sea level). Temperatures are plausible at every level.
- **Colab route**: the repo bin/JSON (no keys).
- **Disk**: no download (the file already existed). C: 70 GB free; the G: product adds 2.4 MB.
