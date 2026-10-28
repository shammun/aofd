# ch00_cross_product_uses — data needs and new functions (movie-director, 2026-10-27)

Every download goes through `fluidpy.data.fetch()` and `tools/disk_guard.py`. Builder: `movies/data/build_ch00_cross_product_uses.py`
(reused scenes read the v4 data and manifest rows; the v4 physics calls are replayed, not re-planned). **Disk at
planning: C: 27 GB free (below the 40-GB data floor: nothing may land on C:), G: 562 GB.**

## A. Already on disk (reuse)
| Id | What | Where | Scenes |
|---|---|---|---|
| A1 | All v4 scene data from s20 to s46 (torque, merry, earth, coriolis, paths, winds_mean, trails, ian/idai rings, geo, ciaran_lines, storm) | `movies/ch00/ch00_cross_product_why/data/*.json|.bin` | s00, s20–s46, s47 |
| A2 | v4 real data (ERA5 Ciarán sfc/upper 12 UTC, NCEP R1 LTM winds, Ian/Idai ERA5 and HRRR, GOES-16, VIIRS, IBTrACS, BMNG, MODIS, NE) | `…/cross_product_why/data/real/`, `data/derived/ch00/` | as v4 |
| A3 | GFS analysis 18 UTC 27 Oct 2026 (msl, z500, u10, v10; 10–80°N, 170°W–10°E) | `data/derived/ch00/rwm_gfs_2026-10-27T18_chart.{bin,json}` (registry GFS-ANL-20261027-rwm) | s46a |
| A4 | GOES-19 C02 (visible) and C13 (IR) 18:00 UTC 27 Oct 2026 | `data/derived/ch00/rwm_goes19_2026-10-27T1800_C02.png`, `_C13.png` (+ .json) | s46a |
| A5 | Ian HRRR 10-m wind 18 UTC 28 Sep 2022 and IBTrACS centre | `…/cross_product_why/data/real/ian_hrrr_2022.*`, `ibtracs_ian_2022.json` | s22f |

## B. New downloads
| Id | Dataset | Subset | Size | Licence | Scenes |
|---|---|---|---|---|---|
| D1 | **NASA GIBS VIIRS Day/Night Band** (`VIIRS_SNPP_DayNightBand_At_Sensor_Radiance` or `VIIRS_NOAA20_DayNightBand…`, whichever GIBS serves for the date; `fluidpy.data.gibs.fetch_wms`) | night of 10–11 May 2024: Europe 40–65°N, 15°W–35°E and/or North America 30–60°N, 130–60°W, ~0.01° | ~10–20 MB | NASA open (credit NASA EOSDIS GIBS / Worldview, VIIRS) | s22g |
| D1b | NOAA SWPC event record (citation only): G5 storm 10–11 May 2024, first G5 since October 2003 | — | — | cite | s22g |
| D2 (optional, later #29) | GDP hourly drifters with clean inertial loops | not used in this movie | — | public domain | — |

## C. New functions
| Id | Function | What | Lives in | Tests |
|---|---|---|---|---|
| F1 | builder-only dipole field lines r = L cos² λ (illustrative geometry) | traced from the magnetic poles for L = 4, 6, 8 | builder | CHECK G2 (footpoint latitude arccos(1/√L)) |
| F2 | none new for s22f: `fluidpy.diag.cyclone.storm_relative_wind` on the HRRR field gives the azimuthal-mean tangential wind; `fluidpy.geo.vectors.cross` for L | — | — | CHECK U1, U2 |
| F3 | none new for s46a: `fluidpy.geo.sphere.gradient` on GFS MSLP + `fluidpy.geo.frames.coriolis_parameter` (u_g = k × ∇p /(fρ)); `fluidpy.geo.atmos.wind_direction_from` for the turning angle | — | — | CHECK G3, G4 |
| F4 | none new for s23b: `fluidpy.geo.vectors.cross`, `fluidpy.core.rotating.inertial_velocity` | — | — | CHECK W1 |

## D. CHECK rows (ids in the storyboard)
U1–U2 (L = 3 at both radii; Ian mean tangential wind rises inward and stays below the r·v = const curve) · G1–G2 (helix
push ⟂ velocity, along-B speed constant; footpoints) · W1 (ω × r = (0, 0.6, 0), (0, 0.3, 0), 0) · G3–G4 (10-m winds turn
towards low pressure at > 70 % of open-sea points 30–65°N; speed ratio < 1) · all v4 rows of the reused scenes (121
hashed calls in the v4 manifest). If a CHECK fails, the narration follows the data and the director re-runs the dry run.

## E. Planning notes
- s22g's image: if GIBS has no clean DNB scene for the night (cloud, moonlight), the scout tries the other satellite
  (SNPP vs NOAA-20) and the other continent; fallback: the scene keeps the 3-D geometry and drops S6 (the narration
  then loses one sentence; re-measure).
- s46a's "evening of the twenty seventh of October" = 18 UTC over the North Atlantic (evening in western Europe,
  afternoon in North America); the scout confirms the wording against the GOES-19 terminator in the frame.
