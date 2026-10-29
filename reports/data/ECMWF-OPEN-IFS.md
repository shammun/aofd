# ECMWF-OPEN-IFS — IFS HRES (open data, stream oper), valid 18 UTC 27 Oct 2026 (#69)

- **Route**: the same byte-range route as ECMWF-OPEN-ENS (`fluidpy.data.ecmwf_open.fetch_fields(model="ifs", stream="oper")`),
  with key `{YYYYMMDD}/{HH}z/ifs/0p25/oper/{…}-{step}h-oper-fc.grib2`. Each run gives 3 messages (msl, gh500, tp), plus tp at step − 6 h.
- **06/18Z runs**: in MARS these runs are stream `scda`, but **the bucket publishes them under `oper`**. `list_files("2026-10-24", 18,
  "ifs", "scda")` returns 0 files, while `oper` has 49 steps (0–144 h). `file_key` therefore needs no `scda` stream.
- **Licence verdict**: CC BY 4.0 plus the ECMWF open-data terms. **Redistributable: yes.** Credit: "ECMWF open data (CC BY 4.0)".
- **Downloads**: 16 GRIB files, 0.30–1.38 MB each, 13.7 MB in all. The runs are 12Z and 00Z on 22/24/26 Oct, 18Z 24 Oct (+72 h) and 18Z 27 Oct
  (+0 h, the "ECMWF analysis"; fetched twice, once with tp and once without, 0.93 MB each).
- **Pitfall**: `tp` is accumulated from the run start, so `tp6 = tp(t) − tp(t − 6 h)`, in mm, clipped at 0. The T+0 run has no 6-h amount (stored as NaN).
- **Derived products**:

  | File | Where | Size | sha256 |
  |---|---|---|---|
  | `rwm_ecmwf_ifs_2026-10-27T18.nc` (run × lat × lon, 0.25°, msl, z500, tp6) | G: `derived/ch00/` | 2,655,060 B | 287e5fbc…f3f |
  | `rwm_ecmwf_ifs_2026-10-27T18.bin` (0.5°, 8 runs, 3 fields) | repo `data/derived/ch00/` | 4,838,400 B | 39fdcb49…bc |
  | `rwm_ecmwf_ifs_2026-10-27T18.json` (with the low per run, its closed-isobar status and the z500 contours) | repo | 161,470 B | b17930e4…385 |

- **The 982 low in each run** (deepest ±2° local minimum within 1200 km of the ECMWF analysis low; `n4` = closed 4-hPa isobars):

  | Run | Lead | p (hPa) | Position | Distance from ECMWF analysis | Closed depth | n4 |
  |---|---|---|---|---|---|---|
  | 27 Oct 18Z (analysis) | 0 h | 983.15 | 42.0° N 43.75° W | — | 13.75 hPa | 4 |
  | 26 Oct 12Z | +30 h | 986.6 | 41.25° N 43.75° W | 83 km | 12.75 | 3 |
  | 26 Oct 00Z | +42 h | 990.8 | 41.25° N 43.0° W | 104 km | 11.0 | 3 |
  | 24 Oct 18Z | +72 h | 992.8 | 41.5° N 43.0° W | 83 km | 10.0 | 2 |
  | 24 Oct 12Z | +78 h | 988.5 | 42.0° N 43.0° W | 62 km | 11.5 | 2 |
  | 24 Oct 00Z | +90 h | 994.8 | 40.0° N 46.0° W | 292 km | 10.5 | 3 |
  | 22 Oct 12Z | +126 h | 1002.6 | 37.0° N 49.75° W | 757 km | 6.75 | 2 |
  | 22 Oct 00Z | +138 h | 1006.6 | 37.0° N 49.0° W | 715 km | 4.75 | 1 |

- **Checks**
  - IFS T+0 against the GFS analysis (0.25° box 10–80° N, 170° W–10° E): msl RMS 1.19 hPa (0.46 hPa on lowland), bias −0.09 hPa;
    z500 RMS 6.7 m, bias +5.5 m.
  - **RM97**: the ECMWF analysis low is 983.15 hPa at 42.0° N 43.75° W; the GFS analysis low is 982.13 hPa at 42.75° N 43.5° W. They are
    **86 km and 1.0 hPa apart**, so the 50-km test **FAILS** and variant **V-s71b-an** applies ("the two centres' analyses differ by about 90 km").
  - **RM96**: IFS 18Z 24 Oct +72 h puts the low at 992.8 hPa, **83 km** from the ECMWF analysis (spoken "80 km", "993 hPa"). GFS +72 h puts it at 992.7 hPa
    at 41.0° N 43.0° W, 199 km from the GFS analysis (matches RM81). The two distances differ by more than 30 km, so V-s71b keeps both sets of numbers.
  - **RM99**: cos φ-weighted msl RMSE over 25–70° N, 80° W–0° at 0.25°:

    | Forecast | vs GFS analysis | vs ECMWF analysis |
    |---|---|---|
    | GFS +72 h | 2.20 hPa | 2.19 hPa |
    | IFS +72 h | 2.20 hPa | 2.20 hPa |

    The two models agree to within 10 % (2.200 vs 2.196), so V-s71c applies: "missed by about 2.2 hPa for both models".
  - **RM91**: the analysis 5520-m z500 contour passes **392 km** from the analysis low, so the 300-km test **fails**. At 45° N on the low's meridian
    (used as a stand-in for the trough axis, because `diag.axes` is not available here), z500 is 5545 m; the nearest 60-m multiple is 5520 m, so the
    fallback leaves the spoken number at 5520. The low itself sits on the 5640-m line (see the quick-look). The trough-axis crossing still needs `fluidpy.diag.axes`.
  - **RM104**: every run's GRIB `valid_time` is 2026-10-27T18:00. PASS.
- **Quick-look**: `outputs/ch00/data/rwm_ecmwf_ifs_quicklook.png` shows msl at 4 hPa, z500 at 5520/5640/5760 m and tp6 for T+0 and +72 h.
- **Colab route**: load the committed `.bin/.json`. **Disk**: see ECMWF-OPEN-ENS (C: 54.5 → 54.1 GB, G: 513.6 → 511.7 GB free). Nothing was evicted.
