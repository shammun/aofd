# ECMWF-OPEN-AIFS — AIFS single (open data), valid 18 UTC 27 Oct 2026 (#69)

- **Route**: the same byte-range route as the other ECMWF keys (`fetch_fields(model="aifs-single", stream="oper")`), with key
  `{YYYYMMDD}/{HH}z/aifs-single/0p25/oper/{…}-{step}h-oper-fc.grib2`. AIFS has steps every 6 h to 360 h in all four cycles and
  14 pressure levels; it publishes both `gh` and `z`.
- **Licence verdict**: CC BY 4.0 plus the ECMWF open-data terms. **Redistributable: yes.** Credit: "ECMWF open data (CC BY 4.0)". Cite Lang et al. 2024
  (arXiv:2406.01465) for AIFS.
- **Downloads**: 15 GRIB files, 0.28–1.29 MB each, about 12.3 MB with the index files. The runs are the same 8 as for IFS.
- **Pitfall**: AIFS starts from the IFS analysis, so AIFS T+0 is almost the IFS analysis (0.16 hPa msl RMS apart, max 5.6 hPa). It
  is not an independent analysis.
- **Derived products**:

  | File | Where | Size | sha256 |
  |---|---|---|---|
  | `rwm_ecmwf_aifs_2026-10-27T18.nc` | G: `derived/ch00/` | 2,594,503 B | 51eb7db1…731e |
  | `rwm_ecmwf_aifs_2026-10-27T18.bin` (0.5°, 8 runs, msl, z500, tp6) | repo | 4,838,400 B | 8e0e0536…d7d1 |
  | `rwm_ecmwf_aifs_2026-10-27T18.json` | repo | 158,294 B | d4c958b5…892 |

- **The 982 low** (method as for IFS):

  | Run | Lead | p (hPa) | Position | Distance from ECMWF analysis | Closed depth | n4 |
  |---|---|---|---|---|---|---|
  | 27 Oct 18Z | 0 h | 983.3 | 42.0° N 43.5° W | 21 km | 13.5 | 4 |
  | 26 Oct 12Z | +30 h | 982.0 | 42.75° N 42.75° W | 117 km | 14.0 | 3 |
  | 26 Oct 00Z | +42 h | 984.1 | 41.5° N 43.25° W | 69 km | 15.0 | 3 |
  | 24 Oct 18Z | +72 h | 990.3 | 41.75° N 42.75° W | 87 km | 10.5 | 3 |
  | 24 Oct 12Z | +78 h | 990.9 | 41.5° N 43.25° W | 69 km | 10.5 | 3 |
  | 24 Oct 00Z | +90 h | 997.6 | 39.5° N 46.0° W | 336 km | 7.75 | 2 |
  | 22 Oct 12Z | +126 h | 1000.7 | 38.75° N 45.75° W | 399 km | 6.75 | 1 |
  | 22 Oct 00Z | +138 h | 1001.9 | 38.5° N 47.0° W | 477 km | 7.25 | 2 |

- **Checks**
  - AIFS T+0 against the GFS analysis: msl RMS 1.18 hPa, z500 RMS 6.7 m.
  - **RM100**: AIFS 18Z 24 Oct +72 h puts the low at 990.3 hPa, **87 km** from the ECMWF analysis (spoken "90 km", "990 hPa"). Its msl RMSE over
    25–70° N, 80° W–0° is **1.56 hPa** against the ECMWF analysis (also 1.56 against the GFS analysis), compared with 2.20 hPa for IFS.
  - **RM101** ("smoother" sentence): the strongest pressure gradient within 500 km of the low is 6.83 hPa per 100 km for AIFS and 8.57 for IFS, and
    6.83 ≤ 0.9 × 8.57, so that part passes. But the AIFS central pressure is **lower** (990.3 vs 992.8 hPa), and AIFS has **more** closed 4-hPa isobars
    (3 vs 2), so **RM101 FAILS and S4 is cut**. The gradient here was computed with centred differences in numpy on the sphere (a = 6371 km),
    not with `geo.sphere.gradient`; re-check with that function.
  - RM104: every `valid_time` is 2026-10-27T18:00.
- **Colab route**: load the committed `.bin/.json`. **Disk**: see ECMWF-OPEN-ENS. Nothing was evicted.
