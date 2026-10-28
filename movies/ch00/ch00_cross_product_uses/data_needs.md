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


## F. Additions 2026-10-28 (research §1b/§1c, §4–§7)

### F1. Values flagged unverified in research §7, now computed (CHECK rows; the builder re-asserts them)
| CHECK | Value on screen / spoken | fluidpy call | Result (director run 2026-10-28) | Scene |
|---|---|---|---|---|
| E1 | ≈ 465 m/s ground speed at the equator | `fluidpy.geo.vectors.cross([0, 0, frames.OMEGA], [constants.EARTH_RADIUS, 0, 0])`, Ω = 7.292115e-5 s⁻¹, a = 6 371 000 m | (0, 464.58, 0) m/s → "about 465" | s25b |
| E1b | ≈ 329 m/s at 45°N | same with r = a (cos 45°, 0, sin 45°) | 328.51 m/s → "about 329" (v4 wording kept) | s25b |
| E2 | inertial period ≈ 17 h at 45° | `fluidpy.core.gfd.inertial_period(fluidpy.geo.frames.coriolis_parameter(radians(45)))` | 60 927 s = 16.92 h → "about seventeen hours" (f = 1.0313e-4 s⁻¹) | s30 |
| E2b | (not spoken) half a pendulum day | 2π / (Ω sin 45°) / 2 | 33.85 h / 2 = 16.92 h, consistent | — |
| E3 | Ekman transport 90° right of τ at 45°N, 90° left at 45°S | `fluidpy.core.gfd.ekman_transport(0.1, 0.0, 1025, ±f45)` | (0, −0.946) m²/s at 45°N, (0, +0.946) at 45°S for τ = 0.1 N/m² east (magnitude not spoken) | s46b |
| E3b | surface current 45° to the right of τ (ideal constant K) | `fluidpy.core.gfd.ekman_surface(0, 0.1, 0, 1025, 0.05, f45)` | −45.0° (45° to the right), asserted 2026-10-28 | s46b |
| E4 | upwelling: Ekman transport · offshore normal > 0 on the D2 day; the coastal SST is colder than 100 km offshore | `ekman_transport` + `fluidpy.geo.vectors.dot` on the D2/D3 fields | to compute | s46c |

The 1 TW wind-work figure is not in this movie (it is in 0.1b).

### F2. New downloads (through `fluidpy.data.fetch()` and the disk guard; G: only)
| Id | Dataset | Subset | Size | Licence | Scene |
|---|---|---|---|---|---|
| D2 | NOAA OISST v2.1 daily (NCEI THREDDS/OPeNDAP, `engine="pydap"`), new registry key `OISST-V21-DAILY` | one clear summer upwelling day off California (the scout picks it from Jun–Aug 2024 by the coastal-minus-offshore SST difference), 30–44°N, 130–115°W, 0.25° | < 2 MB | NOAA, public domain (cite Huang et al. 2021, J. Climate 34, 2923) | s46c |
| D3 | ERA5 (ARCO-ERA5, open) 10-m wind or the mean surface stress (`metss`, `mntss`), same day and box | daily mean | < 2 MB | Copernicus licence (credit line as v4) | s46c |
| D4 (optional) | NOAA CUTI daily index, 31–47°N (Jacox et al. 2018) | same day | < 1 MB | NOAA ERD, open | s46c (cross-check of the sign) |

**Cited facts (the data-scout confirms the wording):**
- The CUTI method, "cross-shore Ekman transport": Jacox, Edwards, Hazen & Bograd (2018), JGR Oceans 123, 7332–7350,
  doi:10.1029/2018JC014187.
- Northerly winds off California in spring and summer.
- Upwelling supports high productivity ("rich in fish"): a NOAA or peer-reviewed source.

### F3. Moved to #2 (orchestrator 2026-10-28)
- v4 s03 door, s20 torque and s21 torque axis are now in #2 (the torque anchor).
- This movie keeps a short `s04_torque_recap`, which reuses `torque.json` (no new data) and adds the torque-vs-joule
  misconception from research §6.

### F4. Vallis page used on screen
- (5.191a) M_E = −(1/f) k × τ_T, rendered as `chapters/pages/ch05/p224.png` (printed p. 204) and read from the image
  on 2026-10-28.
- It is shown on screen without its number (house §5).
- The fluidpy function returns the volume transport (M_E / ρ₀). Only the direction is used on screen.
