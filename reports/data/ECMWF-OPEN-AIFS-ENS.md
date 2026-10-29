# ECMWF-OPEN-AIFS-ENS — AIFS ensemble (open data, control + 50), valid 18 UTC 27 Oct 2026 (#69)

- **Route**: the same byte-range route (`fetch_fields(model="aifs-ens", stream="enfo", type_="cf"|"pf")`), with key
  `{YYYYMMDD}/{HH}z/aifs-ens/0p25/enfo/{…}-{step}h-enfo-{cf|pf}.grib2`. The control (`cf`, number 0) and the perturbed members
  (`pf`, numbers 1–50) are **separate files**. AIFS-ENS has no `gh`, so z500 = `z` / g₀ (g₀ = 9.80665 m s⁻²). The step-0 files also carry the
  surface `z` (orography), which the reduction ignores.
- **Why**: this is the only open ECMWF ensemble that **includes a control**, so it gives a 51-member alternative for s72 (see RM90).
- **Licence verdict**: CC BY 4.0 plus the ECMWF open-data terms. **Redistributable: yes.** Credit: "ECMWF open data (CC BY 4.0)".
- **Downloads**: 14 GRIB files: cf files of 1.4–2.2 MB and pf files of 72.6–113.3 MB (z is about 0.95 MB per message), about 570 MB with the index files.
  **Problem**: S3 returned **503 Service Unavailable** for 8 of the first 14 AIFS-ENS requests (index and ranges). `fetch_all` now backs off and retries
  (30/60/90 s), and the second pass got all 8.
- **Derived products**:

  | File | Where | Size | sha256 |
  |---|---|---|---|
  | `rwm_ecmwf_aifs_ens_2026-10-27T18.nc` (7 runs × 51 members, 0.25°) | G: `derived/ch00/` | 196,148,968 B | 60cc0af9…4790 |
  | `rwm_ecmwf_aifs_ens_2026-10-27T18.bin` (mean and s.d., 1°) | repo | 1,411,200 B | a7897ce8…e379 |
  | `rwm_ecmwf_aifs_ens_2026-10-27T18.json` (with lows, closed-isobar status and contours) | repo | 6,724,628 B | 3556b535…f02b |

- **Spread table** (982 low, 51 members; every member has a closed low at every lead):

  | Run | Lead | Found | Mean p | s.d. p | Pos. RMS spread | Max pair | Mean-position error | z500 s.d. along analysis 5520 m |
  |---|---|---|---|---|---|---|---|---|
  | 22 Oct 12Z | +126 h | 51 | 997.5 | 4.7 hPa | 329 km | 1059 km | 453 km | 58.8 m |
  | 24 Oct 12Z | +78 h | 51 | 987.7 | 5.6 hPa | 263 km | 1149 km | 33 km | 26.9 m |
  | 26 Oct 12Z | +30 h | 51 | 983.9 | 1.9 hPa | 80 km | 356 km | 64 km | 8.4 m |
  | 27 Oct 18Z | +0 h | 51 | 982.6 | 1.5 hPa | 57 km | 231 km | 67 km | 2.5 m |

- **Checks**: the T+0 control against the GFS analysis gives msl RMS 1.18 hPa and z500 RMS 6.7 m; the control low is 983.3 hPa at 42.0° N 43.5° W. RM104 PASS.
- **Colab route**: load the committed `.bin/.json`. **Disk**: see ECMWF-OPEN-ENS. Nothing was evicted.
