# HRRR-aws: NOAA HRRR pressure-level GRIB2 for Hurricane Ian (f00, f01, f02 all valid 18 UTC 28 Sep 2022)

Registry entry `HRRR-aws` (added by the provenance audit, 2026-11-07). Full write-up: `reports/data/ch00_coordinates_vertical_motion.md` §1, §5.

- **Route**: anonymous HTTPS, whole files from the NODD bucket `noaa-hrrr-bdp-pds/hrrr.20220928/conus/`, through `fluidpy.data.fetch()`.
  - There is no byte-range door yet, so the whole file comes down.
  - Each file was reduced at once with eccodes, message by message, to the Ian box: 24.5–28.5 N, 84.5–80.5 W, all 37 levels.
- **Files** (`raw/HRRR-aws/`):

  | File | Bytes | Time | Role |
  |---|---|---|---|
  | `hrrr.t18z.wrfprsf00.grib2` | 389,287,328 | 103.8 s | analysis; **used by the storm movie** (continuity cross-check, DS30) |
  | `hrrr.t17z.wrfprsf01.grib2` | 408,288,101 | 102.5 s | research only (1-h forecast w) |
  | `hrrr.t16z.wrfprsf02.grib2` | 410,534,112 | 105.0 s | research only |
  | `hrrr.t17z.wrfprsf01.grib2.idx` | 38,091 | 0.5 s | GRIB index (research) |

  The sha256 of each file is in the registry and in `logs/downloads.log`.
- **Licence verdict**: NOAA data via NODD. The terms say it is "open to the public and can be used as desired".
  Credit NOAA, and do not present modified data as original or imply NOAA endorsement. **redistributable: yes.**
  Cite Dowell et al. 2022 (Wea. Forecasting 37, 1371–1395).
- **Pitfalls**:
  - HRRR hour 0 has **no usable vertical motion**: ω ranges over −0.095 … +0.097 Pa/s, with 1–6 distinct values per level.
  - Winds are grid-relative, so rotate them with `fluidpy.data.hrrr.earth_relative`.
  - Levels below the sea (HGT < 0) were dropped.
- **Derived products**:
  - G: scratch: `scratch/movies/ch00_coordinates_storm/build1/vm/hrrr_prs_18z_f00.nc` (9,868,419 B), used by the build.
  - Research boxes: `…/research/vertical_motion/hrrr_prs_{18z_f00,17z_f01,16z_f02}.nc`.
  - Repo: the continuity-w rows of `movies/ch00/ch00_coordinates_storm/data/cs.json`.
- **Eviction**: the entry has no `derived_on_root`, so the guard does not evict these 1.21 GB.
  - The f01/f02 files and the `.idx` are research only and can be re-downloaded. They may be deleted by hand if space is ever needed.
- **Colab route**: none needed. The movie ships derived numbers only.
- **Disk**: no download in this task. Original fetch (2026-11-05): G: 489.4 → 487.8 GB, C: 115.2 GB.
  2026-11-07: C: 112.4 GB, G: 472.8 GB. No evictions.
