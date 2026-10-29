# GFS-ANL-20261027T18-upper: GFS analysis 18 UTC 27 Oct 2026, upper-air extras (reading-maps N2, time-limited)

- **Route**: Unidata THREDDS NCSS, analysis collection (global, server-side variable cut), through `fluidpy.data.gfs.fetch_analysis`.
  - 1000 hPa height: 2,312,473 B.
  - 850 hPa T, u and v: 5,614,368 B.
  - 250 hPa u and v: 4,026,668 B.
  - Fetched 2026-10-29 at 05:35–05:36 UTC. The cycle leaves THREDDS about 3 Nov 2026.
  - This extends the D6 entry (`GFS-ANL-20261027-rwm`); its 500 hPa height file is reused for the thickness.
- **Licence**: US Government (NOAA/NCEP), public domain. **Redistributable: yes.**
- **Product**: the new `fluidpy.data.movie_rwm.gfs_upper()`, on box 10–80° N, 170° W–10° E at 0.25°.
  - Variables `z1000`, `z500`, `t850`, `u850`, `v850`, `u250`, `v250` and `thick` (= z500 − z1000).

  | File | Where | Size (B) | sha256 |
  |---|---|---|---|
  | `rwm_gfs_2026-10-27T18_upper.nc` | G: `derived/ch00/` | 3,121,525 | `0d28503c…0990` |
  | `rwm_gfs_2026-10-27T18_upper.bin` | repo `data/derived/ch00/` | 6,483,232 | `9d6ae619…cc46` |
  | `rwm_gfs_2026-10-27T18_upper.json` | repo `data/derived/ch00/` | 15,501 | `5b771342…1e08` |

- **Checks**:
  - **RM69 PASS**: 1000–500 hPa thickness at La Grande (CYAH, nearest point 53.75° N 73.75° W) is **5255 m**, below the 5350 m bound (the director's estimate was about 5250 m).
  - The 250 hPa maximum wind is **66.4 m/s at 38.25° N 53.75° W**, identical to the planning read.
  - 850 hPa temperature ranges from 249.3 to 298.7 K.
- **Colab route**: the repo bin/JSON (no keys).
- **Disk**:

  | | C: free | G: free |
  |---|---|---|
  | Before | 69.0 GB | 521.2 GB |
  | After | 68.8 GB | 521.0 GB |

  Nothing was evicted.
