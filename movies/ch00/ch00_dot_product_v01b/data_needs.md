# ch00_dot_product_v01b — data needs, CHECK rows and the v6 map (movie-director, 2026-10-28, plan 3)

**Rule (user, 2026-10-28):** 0.1b = the committed 0.1b plan (1aa590f, with its added examples) **plus everything in v6**.
No v6 scene, sentence, example, number or device is lost. Where 0.1b had changed a v6 device or sentence, the v6 version
comes first and the 0.1b device follows it ("Here's another way to see…"). Music: **v6's own score** (`tools/music.py`,
seed 7). The phone-review title fix stays.

**Builder:** `movies/data/build_ch00_dot_product_v01b.py`.
- It imports the v6 builder (`movies/data/build_ch00_dot_product_why.py`) for every reused scene: the s00–s20 data and
  the 121 v6 CHECK rows.
- It adds the rows in §B.
- No download is needed, except the optional §D.

**Disk at planning:** C: 74 GB free, G: 556 GB free.

## 0. Every v6 scene → where it is in 0.1b
| v6 scene | In 0.1b | What changed |
|---|---|---|
| s00_title | s00_title, unchanged words | title fix only (subtitle on two lines, ≥ 50 px clear; readout inside the column) |
| s01_hook | s01_hook | unchanged |
| s02_arrows | s02_arrows | unchanged |
| s03_definition | s03_definition | unchanged |
| s04_cosine | s04_cosine | **kept + extended**: all five v6 sentences and devices (arc, equation, the −1…+1 tick line, the √ CalcStack, ≈ 8, "(1)"); added after v6's "The cosine is one…": the unit arrow whose dropped piece is cos θ, its three stops lighting v6's three ticks |
| s05_angle_cases | s05_angle_cases | **kept + extended**: all nine v6 sentences, three panels and calculations; added before the closing sentence: the sweep of q all round p (front half +, line across 0, back half −) |
| s06_shadow | s06_shadow | unchanged |
| s07_unit_vector | s07_unit_vector | **kept + extended**: v6's four sentences and b̂ = (0.316, 0.949), a·b̂ ≈ 2.53; added: b̂ as a turning ruler |
| s08_question | s08_question | unchanged |
| s09_reason1_order | s09_reason1_order | **kept + extended**: v6's three sentences (2.53 × 3.16 = 1.57 × 5.1 = 8); added: the two equal rectangles |
| s10_reason2_cheap | s10_reason2_cheap | unchanged |
| s11_work | s11_work | **unchanged (v6 sled restored**: the committed 0.1b had replaced it with the cart); the cart is now its own scene s11a, after it |
| s12_parcel … s20_twice_steep (s12, s13, s14, s15, s16a, s16b, s17, s17b, s18, s19a, s19b, s19c, s19d, s20) | same ids | unchanged, word for word and device for device |
| s21_recap | s21_recap | **kept + extended**: all seven v6 sentences in v6's order; added one sentence after S1 (matching parts), one after S6 (runway), three after S7 (push across, sunlight / wind work / similarity, pointer to the cross product) |
| s22_end | s22_end | words unchanged (maths ending); the thumbnail row lists six related topics |

## 0b. Every addition and its source
| 0.1b scene / beat | What it adds | Source |
|---|---|---|
| s00 title fix | subtitle two lines, column x 1130–1840, readout in one face | user's phone review 2026-10-27 (notes 1–3) |
| s04 (S4–S7) | cos θ = the piece a unit arrow marks off on a line | research §3 D1 |
| s05 (sweep) | the whole front half is +, the line across 0, the back half − | research §3 D4 |
| **s05a_matching_parts** | why "multiply matching components and add" equals \|a\|\|b\| cos θ: each piece of vector a only sees the matching part of b; mixed pairs are at right angles → 0 | **reference video V-D4** (+ research D3) |
| s07 (ruler) | b̂ as a ruler; a·b̂ is the reading | research §3 D1/D7 |
| s09 (rectangles) | two products drawn as rectangles of equal area 8 | research §3 D2 |
| **s11a_cart** | a push held to a track: the rails take the across part; work has no direction, so the dot product gives a number | **reference video V-D1, V-D2** |
| s11b_perp_push | a push always across the motion does no work (whirled ball, flat energy bar) | research §3 D5 / W17 (extends v6's "the upward part does no work") |
| s20b_runway | wind along a runway = v·ê | research §4 W12 |
| s20c_flux | sunlight through a window and on the ground: ŝ·n̂ | research §3 D6, §4 W14/W16 |
| s20d_wind_work | the wind's power on a current τ·u, with its sign | research §4 W13 |
| **s20e_similarity** | the cosine of two patterns: how alike they are; computers compare pictures and words this way | **reference video V-D5** (+ research: analogue forecasting) |
| s21 (5 sentences) | one recap sentence per new idea | research §5c |

Reference-video items V-D1…V-D5 (research §1b): V-D1 → v6 s11 (sled) and s11a (cart); V-D2 → s03 (scalar) and s11a;
V-D3 → v6 s06–s08 (shadow × length); V-D4 → s05a; V-D5 → v6 s11 (work) and s20e (similarity).

## A. Reused (on disk)
| What | Where | Scenes |
|---|---|---|
| v6 scene data (sweep, examples, cases, shadow, work, the weather-map series) | `movies/ch00/ch00_dot_product_why/data/*.json`, `manifest.json` | s00–s22 |
| NCEP R1 LTM 10-m winds (the westerlies over the Southern Ocean, for the s20d globe) | `movies/ch00/ch00_cross_product_why/data/real/` (v4 products) | s20d |
| Blue Marble NG globe texture | `…/cross_product_why/data/real/globe_bmng_*.jpg` | s20c, s20d |

## B. New CHECK rows
| CHECK | Scene | Asserted | Function | Value (director run 2026-10-28) |
|---|---|---|---|---|
| D1 | s05a_matching_parts | (5x̂ + ŷ)·(x̂ + 3ŷ): terms 5, 0, 0, 3; x̂·ŷ = 0; x̂·x̂ = 1; sum 8 = \|a\|\|b\| cos θ | `fluidpy.geo.vectors.dot` | 8 |
| D1b | s04_cosine | the unit arrow's piece = cos θ at 0°, 60.3°, 90°, 180° (1, 0.496, 0, −1) | `vectors.scalar_projection` | ok (0.4961) |
| D1c | s07_unit_vector | ruler reading a·(cos α, sin α) = 5 cos α + sin α: 2.53 at b's angle, 5.00 at 0°, 1.00 at 90° | `vectors.dot` | ok |
| D1d | s09_reason1_order | rectangles 2.530 × 3.162 = 1.569 × 5.099 = 8.000 | `vectors.scalar_projection`, `norm` | 8.000 |
| C1 | s11a_cart | F = 20 N at 60° to the track: along part 10 N; W = 50 J over 5 m (the same numbers as v6's sled, whose own rows stay) | `vectors.dot`, `scalar_projection` | 10, 50 |
| D2 | s11b_perp_push | F·d = 0 for all 120 steps of the whirl (≤ 1e-12); the energy stays constant | `vectors.dot` | 0 |
| R1 | s20b_runway | v = 10 (sin 30°, cos 30°) m/s, ê = (0, 1): v·ê = 8.660 | `vectors.dot` | 8.660 |
| F1 | s20c_flux | ŝ·n̂ at equinox noon: 1.000 at 0°, 0.500 at 60°N. The declination is set to 0; on the equinox day it is within ±0.4°, so "one half" holds to 1 % | `vectors.dot` | 1.000, 0.500 |
| W1 | s20d_wind_work | τ = (0.1, 0) N/m², u = (±0.1, 0) m/s: τ·u = ±0.01 W/m² (N m⁻² × m s⁻¹ = W m⁻²) | `vectors.dot` | ±0.0100 |
| S1 | s20e_similarity | A = (3, 1, −2, −2), B = (2, 2, −1, −3) hPa: A·B = 16, \|A\| = \|B\| = √18 = 4.243, cos = 0.889 | numpy in the builder (see E) | 16, 4.243, 0.889 |

## C. Values that need a cited source before they go on screen
| Id | Value | Source to confirm | Status |
|---|---|---|---|
| W2 | wind work on the ocean's general circulation ≈ 1 TW ("about a million million watts"), most of it over the Southern Ocean | Wunsch, C. (1998), "The work done by the wind on the oceanic general circulation", *J. Phys. Oceanogr.* 28, 2332–2340. DOI 10.1175/1520-0485(1998)028<2332:TWDBTW>2.0.CO;2 is **unverified**: research §7 confirmed the paper and the ≈ 1 TW from the full-text PDF, but not the DOI. Cross-check with a later estimate (e.g. Hughes & Wilson 2008, JGR 113, C02016) | **OPEN — data-scout must confirm the DOI and the number before the figure goes on screen or into the final narration.** If it cannot be confirmed, the sentence is cut (the sign story stays) and the TTS is re-run |
| W3 | the Southern Ocean westerlies blow along with the Antarctic Circumpolar Current | standard (any ACC review); the globe uses our NCEP LTM winds | cite |
| S2 | analogue forecasting as a past method (finding past days that looked like today) | Lorenz, E. N. (1969), "Atmospheric predictability as revealed by naturally occurring analogues", *J. Atmos. Sci.* 26, 636–646 | cite (unverified today) |
| R2 | pilots use the along-runway part of the wind | FAA Airplane Flying Handbook (research §7: secondary sources only) | cite before the final TTS |

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

## G. Beats (`[beat]`, 1.5-s hold after a worked calculation)
s04 (≈ 8, equation one) · s05a (eight: the component recipe) · s09 (same area: eight) · s11a (fifty joules) · s16b
(0.18 K per hour) · s17b (+0.18 K per hour) · s20b (8.7 m/s) · s20c (one half) · s20d (0.01 W/m²) · s20e (≈ 0.89).
A beat changes only the pause after a sentence; v6 sentences carry no other change.
