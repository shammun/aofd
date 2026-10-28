# ch00_cross_product_why v5 — plan notes and data needs (movie-director, 2026-10-28)

**What v5 is.** v4 fix 2 (commit a1cc435, 48:28, review 3 PASS) with every scene and every word kept, plus the
reference video's intuitions (research/xprod_video_intuitions.md §1b, V-X1…V-X10) in our own words and pictures, plus
the review-3 SHOULD items in the visuals, plus `[beat]`s after worked calculations. The V-X → scene table and the
measured numbers are at the top of `script.md`; every scene's `v5:` field in `storyboard.yaml` says kept / extended / new.

**Then split** (step 2) after s19_grid: Part 1 `movies/ch00/ch00_cross_product`, Part 2 `movies/ch00/ch00_cross_product_uses`.

## Inserted and extended scenes
| Scene | Kind | V-X item | Source of the words |
|---|---|---|---|
| s03_door | v4 + 3 sentences | V-X1 lever arm (near vs far from the hinge) | 1aa590f #2 plan |
| s07_worked | v4 + 1 sentence | V-X7 plane case first | 1aa590f #2 plan |
| s14_rhr_cycle | v4 + 1 sentence | V-X6 cycle of the axes = cycle of the recipe | 1aa590f #2 plan |
| s15_rhr_swap | v4 + 1 sentence | V-X6 backwards round the cycle = minus | 1aa590f #2 plan |
| s15a_index_form | new | V-X6 (sign table ε; pointer to #1b) | 1aa590f #2 plan |
| s17_rhr_views | v4 + 2 sentences | V-X5 viewpoint (two-faced card) | 1aa590f #2 plan |
| s18_cases | v4 + 1 sentence | V-X3 the opposite of the dot product | 1aa590f #2 plan |
| s18a_why_question | v4 + 1 sentence | V-X8 "why the minus sign?" | 1aa590f #2 plan |
| s18d_two_parts | new | V-X3 along (dot) and across (cross) share b | 1aa590f #2 plan |
| s21_torque_axis | v4 + 1 sentence | V-X5 the arrow is the axis; anticlockwise seen from its tip | 1aa590f #2 plan |
| s21a_minus_sign | new | V-X8 z component: two opposing mini-torques | 1aa590f #2 plan |
| s21b_x_component | new | V-X6/V-X8 x component: y and z parts, two mini-torques | new (2026-10-28) |
| s21c_y_component | new | V-X6/V-X8 y component (z before x), why the determinant's middle term looks backwards, the one pattern | new (2026-10-28) |
| s21d_tilted_axis | new | V-X9 ball brushed off centre, tilted axis | 1aa590f #2 plan (was s22d_tilted_axis) |
| s22w_when_to_use | new | V-X10 when to use it; what the two arrows stand for | new (2026-10-28) |
| s19_grid | v4 + 1 sentence | V-X3 / V-S along, a number / across, an axis | 1aa590f #2 plan |

Already in v4 and kept as they are: V-X2 (s18b across part, s20 slanted spanner), V-X4 (s11–s13 right hand, s16 ⊙/⊗,
s21 tighten/loosen).

Review-3 SHOULD items (in the `visual` fields, "V5 (from the 1aa590f split plans …)"): R3-S1 empty halves (s03, s08,
s09, s20, s22c, s22d, s23a, s25a, s26b, s27a, s28a, s31, s33, s34), R3-S2 (s25b r label), R3-S3 (s03, s22 door tick and
swing), R3-S4 (s08 link), C1/C4/C6 cosmetic rows.

## Data
No download. Every reused scene reads `movies/ch00/ch00_cross_product_why/data/*.json|.bin` and the v4 manifest rows
(121 replayed calls). New builder rows (`movies/data/build_ch00_cross_product_why.py`, v5 block), all via
`fluidpy.geo.vectors` and checked by the director on 2026-10-28:

| CHECK | Scene | Asserted | Value |
|---|---|---|---|
| X1–X3 | s15a | ε_ijk signs (`fluidpy.core.tensors.levi_civita`); ε_zxy·5·3 + ε_zyx·1·1 = 14 | 14 |
| X4 | s18d | (a·b)² + \|a × b\|² = \|a\|²\|b\|²: 64 + 196 = 260 = 26 × 10 | 260 |
| X5 | s21a | r = (0.2, 0.1, 0) m, F = (10, 30, 0) N: +6, −1, (r × F)_z = 5 N m | (0, 0, 5) |
| X5x | s21b | r = (0, 0.2, 0.1) m, F = (0, 10, 30) N: +6, −1, (r × F)_x = 5 N m | (5, 0, 0) |
| X5y | s21c | r = (0.1, 0, 0.2) m, F = (30, 0, 10) N: +6, −1, (r × F)_y = 5 N m | (0, 5, 0) |
| X5d | s21c | −(r_x F_z − r_z F_x) = (r × F)_y for 1000 random pairs | max error 0.0 |
| X7 | s21d | r = (0.1, 0, 0.1) m, F = (0, 2, 0) N → τ = (−0.2, 0, 0.2) N m | (−0.2, 0, 0.2) |
| T0 | s00 (Part 1) | sweep of \|a × b\| for θ 0…360° (`data/title_sweep.json`) | 14.0 at the drawn θ |

E1 (465 m/s at the equator, `vectors.cross`, 464.58 m/s) and E2 (inertial period 16.92 h at 45°) stay as in the v4 rows.

## Music
v4's own score (rotation-turning, seed 3) for v5. Part 1 and Part 2 are cut from the same movie and keep that score.

## Measured (tools/tts.py dry runs 2026-10-28, `G:/…/scratch/movies/ch00_cross_product_split/dryrun/v3_20261028/run2/`)
| Movie | Scenes | Sentences | Beats | Words | Movie length | Words/min overall |
|---|---|---|---|---|---|---|
| v5 (this folder) | 78 | 572 | 60 | 8735 | 3521.8 s (58:41.8) | 148.8 |
| Part 1 `ch00_cross_product` | 41 | 316 | 56 | 4898 | 1960.2 s (32:40.2) | 149.9 |
| Part 2 `ch00_cross_product_uses` | 45 | 289 | 5 | 4485 | 1815.5 s (30:15.5) | 148.2 |

The definition half is denser than the weather half (about 166 words a minute while speaking), so Part 1 needs its
beats. Every beat comes after a worked result: a component, a length, a torque, a right-hand-rule answer.
