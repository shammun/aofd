# GFS-FC: GFS forecasts valid 18 UTC 27 Oct 2026 from runs of different ages (reading-maps N3, time-limited)

- **Route**: Unidata THREDDS NCSS (anonymous) on `Global_0p25deg/GFS_Global_0p25deg_<init>.grib2`, through the new
  F16 `fluidpy.data.gfs.fetch_forecast(init, valid|fhour, variables, level, box)`. The server cuts the box 10–80° N, 170° W–10° E.
  - 19 files fetched on 2026-10-29 between 05:20 and 05:36 UTC.
  - The catalogue then held runs from 22 Oct 00Z to 29 Oct 00Z, so the **22 Oct 18Z run was secured before it rolled off**.
- **Runs and fields**: MSLP (`Pressure_reduced_to_MSL_msl`), 500 hPa height, and 6-h precipitation
  (`Total_precipitation_surface_Mixed_intervals_Accumulation`; none at +0 h).

  | Run | Forecast hours fetched |
  |---|---|
  | 22 Oct 18Z | +120 h |
  | 24 Oct 18Z | +0, +24, +48, +72 h |
  | 26 Oct 18Z | +24 h |
  | 27 Oct 18Z | +0 h (the analysis check) |

- **Pitfall: the precipitation variable.**
  - The mixed-interval precipitation sits on a time axis of interval midpoints (`time2`). NCSS ignores the time
    selection for it, both `time=valid` and `time=valid−3 h`, and returns **the whole run** (177 buckets, 31–41 MB per file).
  - The disk guard was given 3 MB for each of these requests, about 13× too low. That is still harmless: G: has 521 GB free and the project uses 69 of 150 GB.
  - `forecast_set_product` picks the 6-h bucket ending at the valid time from the file's `time2_bounds`.
  - A future fix: request with `time_start`/`time_end`, or evict the whole-run files after reduction. They can be evicted once the product exists, but are **not re-downloadable** after the THREDDS window closes.
- **Licence**: US Government (NOAA/NCEP), public domain; credit "NOAA NCEP GFS forecasts via Unidata THREDDS (UCAR)". **Redistributable: yes.**
- **Raw**: about 184 MB in 19 files (5 precipitation files of 31–41 MB; 14 single fields of 0.30–0.37 MB). sha256 values are in the registry.
- **Products**:

  | File | Where | Grid | Size (B) | sha256 |
  |---|---|---|---|---|
  | `gfs_fc_valid_2026-10-27T18.nc` | G: `derived/ch00/` | 0.25° | 4,812,446 | `33e9fd42…498d` |
  | `gfs_fc_valid_2026-10-27T18_0p5.nc` | repo `data/derived/ch00/` | 0.5° | 1,340,247 | `343e5ff9…84e1` |

  - Variables `msl`, `z500` and `precip6h` on (case 7, lat, lon), with `init`, `valid` and `fhour` per case.
- **Checks** (deepest North Atlantic low, 35–70° N, 80° W–0°):

  | Forecast | Low | Position error vs analysis | Depth error |
  |---|---|---|---|
  | Analysis (+0 h, 27 Oct run) | 960.6 hPa at 66.0° N 12.0° W | — | — |
  | +24 h (26 Oct run) | 959.9 hPa at 66.5° N 10.75° W | 79 km | −0.7 hPa |
  | +72 h (24 Oct run) | 955.2 hPa at 63.0° N 5.75° W | 448 km | −5.4 hPa |
  | +120 h (22 Oct run) | 951.4 hPa at 62.5° N 8.0° W | 434 km | −9.2 hPa |

  - The older forecasts put the low about 430–450 km too far south-east and 5–9 hPa too deep. The 1-day forecast was nearly exact. That is the "forecasts sharpen as the day approaches" story for s68–s71.
  - Precipitation maxima of 174–281 mm in 6 h sit in a model East Pacific tropical cyclone near 15° N 104° W. The 99.9th percentile is 27–34 mm, so cap the colour scale.
- **Colab route**: the repo 0.5° product (no keys). Refresh is impossible after the THREDDS window; use NCAR RDA ds084.1 or AWS `noaa-gfs-bdp-pds` (GRIB-2) instead.
- **Disk**:

  | | C: free | G: free | Project data |
  |---|---|---|---|
  | Before | 69.0 GB | 521.2 GB | 69.18 GB |
  | After | 68.8 GB | 521.0 GB | 69.42 GB |

  C: was checked (≥ 40 GB) before each request. Nothing was evicted.
