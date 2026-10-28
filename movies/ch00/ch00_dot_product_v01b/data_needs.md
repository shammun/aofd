# ch00_dot_product_v01b — data needs and CHECK rows (movie-director, 2026-10-28)

**Builder:** `movies/data/build_ch00_dot_product_v01b.py`.
- It imports the v6 builder (`movies/data/build_ch00_dot_product_why.py`) for every reused scene: the s00–s20 data and
  the 121 v6 CHECK rows.
- It adds the rows below.
- No download is needed, except the optional D1.

**Disk at planning:** C: 66 GB free, G: 559 GB free.

## A. Reused (on disk)
| What | Where | Scenes |
|---|---|---|
| v6 scene data (sweep, examples, cases, shadow, work, the weather-map series) | `movies/ch00/ch00_dot_product_why/data/*.json`, `manifest.json` | s00–s20 |
| NCEP R1 LTM 10-m winds (the westerlies over the Southern Ocean, for the s20d globe) | `movies/ch00/ch00_cross_product_why/data/real/` (v4 products) | s20d |
| Blue Marble NG globe texture | `…/cross_product_why/data/real/globe_bmng_*.jpg` | s20c, s20d |

## B. New CHECK rows
| CHECK | Scene | Asserted | Function | Value (director run 2026-10-28) |
|---|---|---|---|---|
| D1 | s05a_matching_parts | (5x̂ + ŷ)·(x̂ + 3ŷ): terms 5, 0, 0, 3; x̂·ŷ = 0; x̂·x̂ = 1; sum 8 = \|a\|\|b\| cos θ | `fluidpy.geo.vectors.dot` | 8 |
| D1b | s04_cosine | the unit arrow's piece = cos θ at 0°, 60.3°, 90°, 180° (1, 0.496, 0, −1) | `vectors.scalar_projection` | ok |
| D1c | s07_unit_vector | ruler reading a·(cos α, sin α) = 5 cos α + sin α: 2.53 at b's angle, 5.00 at 0°, 1.00 at 90° | `vectors.dot` | ok |
| D1d | s09_reason1_order | rectangles 2.530 × 3.162 = 1.569 × 5.099 = 8.000 | `vectors.scalar_projection`, `norm` | 8.000 |
| D2 | s11a_perp_push | F·d = 0 for all 120 steps of the whirl (≤ 1e-12); the energy stays constant | `vectors.dot` | 0 |
| C1 | s11_work (changed device: a wind on a cart on rails) | F = 20 N at 60° to the track: along part 10 N; W = 50 J (5 m), 100 J (10 m), the same numbers as v6 s11 | `vectors.dot`, `scalar_projection` | 10, 50, 100 |
| R1 | s20b_runway | v = 10 (sin 30°, cos 30°) m/s, ê = (0, 1): v·ê = 8.660 | `vectors.dot` | 8.660 |
| F1 | s20c_flux | ŝ·n̂ at equinox noon: 1.000 at 0°, 0.500 at 60°N. The declination is set to 0; on the equinox day it is within ±0.4°, so "one half" holds to 1 % | `vectors.dot` | 1.000, 0.500 |
| W1 | s20d_wind_work | τ = (0.1, 0) N/m², u = (±0.1, 0) m/s: τ·u = ±0.01 W/m² (N m⁻² × m s⁻¹ = W m⁻²) | `vectors.dot` | ±0.0100 |
| S1 | s20e_similarity | A = (3, 1, −2, −2), B = (2, 2, −1, −3) hPa: A·B = 16, \|A\| = \|B\| = √18 = 4.243, cos = 0.889 | numpy in the builder (see E) | 16, 4.243, 0.889 |

## C. Values that need a cited source before they go on screen
| Id | Value | Source to confirm | Status |
|---|---|---|---|
| W2 | wind work on the ocean's general circulation ≈ 1 TW ("about a million million watts"), most of it over the Southern Ocean | Wunsch, C. (1998), "The work done by the wind on the oceanic general circulation", *J. Phys. Oceanogr.* 28, 2332–2340. DOI 10.1175/1520-0485(1998)028<2332:TWDBTW>2.0.CO;2 is **unverified**: research §7 confirmed the paper and the ≈ 1 TW from the full-text PDF, but not the DOI. Cross-check with a later estimate (e.g. Hughes & Wilson 2008, JGR 113, C02016) | **data-scout: confirm the DOI and the number.** If later papers give a different total, the narration says "roughly" and keeps the sign story |
| W3 | the Southern Ocean westerlies blow along with the Antarctic Circumpolar Current | standard (any ACC review); the globe uses our NCEP LTM winds | cite |
| S2 | analogue forecasting as a past method (finding past days that looked like today) | Lorenz, E. N. (1969), "Atmospheric predictability as revealed by naturally occurring analogues", *J. Atmos. Sci.* 26, 636–646 | cite (unverified today) |
| R2 | pilots use the along-runway and across-runway parts of the wind | FAA Airplane Flying Handbook (research §7: secondary sources only) | cite before the final TTS |

## D. Optional data
| Id | Dataset | Use | Note |
|---|---|---|---|
| D1 | ERA5 monthly surface stress + OSCAR currents (the Earthdata account exists) over the Southern Ocean | a real τ·u map behind the s20d globe, instead of the schematic band | optional; the scene works with the illustrative tiles plus the cited total |

## E. Library proposal
| Id | Function | Lives in | Why |
|---|---|---|---|
| F1 | `pattern_correlation(a, b, centred=False, weights=None)`: the uncentred (cosine) or centred pattern correlation of two fields | `fluidpy/diag/climatology.py` | Needed for s20e, and later for #21 statistics of fields; `vectors.dot` pads to 3-D and cannot take a 4-vector. Tests: V1 identical → 1, opposite → −1, orthogonal → 0; V7 scale invariance. Until it exists, the builder computes S1 with numpy and records it as builder-only |

## F. Title fix (phone review 2026-10-27)
Source: `G:/Geophysical Fluid Dynamics/aofd-data/reviews/review_dot_product_v6_final_20261027-1809/`, notes 1–3.

No data is needed; the fix is layout only (storyboard s00_title, "TITLE FIX"):
- the subtitle goes on two lines;
- the animation column is x 1130–1840;
- the readout sits inside the column, in one face.

QA frames at 1.1 s, 2.6 s and 8.1 s must show ≥ 50 px clearance.
