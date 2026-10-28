# GFS-ANL-20261027-rwm — GFS 0.25° at 18 UTC and 00 UTC 27 Oct 2026 (movie ch00_reading_weather_maps, D6)

- **Route**: Unidata THREDDS NCSS (anonymous) → `fluidpy.data.gfs.fetch_analysis(cycle, variables, level=, height=,
  collection=)` → `fluidpy.data.fetch` (disk guard). New in F12: `level` [hPa] / `height` [m] become NCSS `vertCoord`;
  `collection="fc"` reads forecast hour 0 of the forecast collection `Global_0p25deg` (adds `time=<cycle>`).
- **Pitfall found**: the analysis collection `Global_0p25deg_ana` has **no 10-m wind** (its `height_above_ground1` axis is
  20, 30, 40, 50, 80, 100 m). The 10-m wind therefore comes from forecast hour 0 of the same cycle (the model's
  initial state = the analysis). The 18Z forecast run reached THREDDS at about 00:10 UTC 28 Oct.
- **Rolling archive**: THREDDS keeps about 7 days (21 Oct 00Z … 27 Oct 18Z at fetch). After that, use NCAR RDA ds084.1 or
  AWS `noaa-gfs-bdp-pds` (GRIB-2), so `redownloadable: false` for this route.
- **Licence verdict**: US Government work (NOAA/NCEP), public domain. **Redistributable: yes.** Credit: "NOAA NCEP GFS
  analysis (public domain), via Unidata THREDDS (UCAR)".
- **Downloads** (all at 2026-10-27 ~23:05 UTC, plus 00:15 UTC 28 Oct for the 18Z wind):

  | File | Bytes | Time |
  |---|---|---|
  | `gfs_anl_20261027_1800_mslp-orog.nc` | 2,600,949 | 5.1 s |
  | `gfs_anl_20261027_1800_Geopotentialheightisobar_500hPa.nc` | 1,783,903 | 2.5 s |
  | `gfs_anl_20261027_1800_…_10m_fc.nc` | 3,950,234 | 12.1 s |
  | `gfs_anl_20261027_0000_Geopotentialheightisobar_500hPa.nc` | 1,780,620 | 2.6 s |
  | `gfs_anl_20261027_0000_…_10m_fc.nc` | 3,897,065 | 4.5 s |

- **Derived products** (`fluidpy.data.movie_rwm.gfs_chart`, `gfs_global_00z`):

  | File | Where | Size | Content |
  |---|---|---|---|
  | `rwm_gfs_2026-10-27T18_chart.nc` | G: `derived/ch00/` | 1,716,535 B | msl, z500, u10, v10, zs; 10–80°N, 170°W–10°E, 0.25° |
  | `rwm_gfs_2026-10-27T18_chart.bin/.json` | repo `data/derived/ch00/` | 3,241,616 + 14,187 B | msl, z500, u10, v10 (float32 LE) |
  | `rwm_gfs_2026-10-27T00_global_0p5.nc` | G: | 1,932,156 B | msl, z500, u10, v10, global 0.5° |
  | `rwm_gfs_2026-10-27T00_global_0p5.bin/.json` | repo | 4,158,720 + 14,381 B | same |

- **Checks**:
  - **WPC vs GFS, 18Z**: the GFS centres next to the bulletin's centres (search radius 3°) are L 982.1 hPa at 42.75°N
    43.5°W (WPC 982), L 960.6 at 66.0°N 12.0°W (WPC 961), L 973.3 at 58.25°N 52.25°W (WPC 972), and H 1032.6 at
    46.25°N 79.75°W (WPC 1033 at 47.8°N 79.3°W; the high is flat, so the position differs by 1.6°). RM41/RM42 hold.
  - **z500 in the box**: 5032–5932 m, inside 4.8–6.0 km (F12 test).
  - **RM43**: the tightest gradient within 100–600 km of the 982 low is 9.32 hPa/100 km at 40.0°N 44.25°W, bearing
    192° (SSW). Quadrant means: SE 4.66 > SW 3.74 > NE 2.86 > NW 2.08 hPa/100 km. Strongest 10-m wind there: 27.4 m/s.
  - **00Z, RM39**: the typhoon is 934.9 hPa at 14.5°N 162.5°E, with mean 10-m relative vorticity within 300 km of
    **+6.2×10⁻⁵ s⁻¹** (cyclonic, NH). The southern low is 944.7 hPa at 60.25°S 148.0°E, with **−6.2×10⁻⁵ s⁻¹**
    (cyclonic, SH). The pressures repeat A7.
  - Quick-looks: `outputs/ch00/data/rwm_gfs_wpc_18z.png` and `rwm_gfs_00z_global.png` (orientation correct; the WPC
    fronts sit in the GFS troughs).
- **Colab route**: read the committed `.bin/.json`; no keys and no download.
- **Disk**: before the first D6 fetch, C: 61.9 GB and G: 564.4 GB free. After the last, C: 66.5 GB and G: 561.3 GB
  free. Project data 29.09 GB of 150. Nothing evicted.
