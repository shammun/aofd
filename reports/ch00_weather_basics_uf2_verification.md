# Chapter 0 verification — weather basics UF2 library additions (movie `ch00_weather_basics`)   2026-10-29, fluidpy 3800f15 + uncommitted working tree, aofd ad94c49

Scope: the two uncommitted fluidpy functions written for the UF2 build (uf2_plan.md §7, F-UF2-1 and F-UF2-2):
`fluidpy.diag.sounding.column_integral` and `fluidpy.diag.fronts.front_by_level` with its helpers `line_gap_km` and
`parallel_crossings`. Library code was read, never edited.

Equation read from the page image (2026-10-29): Vallis §1.3.3, (1.51) ∂p/∂z = −ρg, `chapters/pages/ch01/p032.png`
(printed p. 12). The docstring's statement ρ dz = −dp/g, ∫ρq dz = (1/g)∫q dp matches the page; the page's remark that
p at a point is the weight of the fluid above it (p = 0 at the top) is used as a V1 check. The front functions carry no
Vallis equation beyond the metric of (2.31) (a cos ϑ δλ), which the tests use.

New test files (fluidpy, not committed):
- `../Fluid Dynamics/tests/diag/test_column_integral.py`: 21 test functions (28 cases with parameters), including 2 strict xfails that pin defects D1 and D2.
- `../Fluid Dynamics/tests/diag/test_front_by_level.py`: 19 test functions (24 cases), including 2 strict xfails that pin defect D3 (one synthetic, one on ERA5); 3 tests run on real ERA5 data and none were skipped.

Result of the two files: **48 passed, 4 xfailed (strict)**. The front file also passes with `-W error::RuntimeWarning`.

## Environment
Python 3.12.1 · numpy 2.5.4 · scipy 1.18.1 · sympy 1.14.0 · xarray 2026.9.0 · scikit-image 0.26.0.

## Validation table
| Concept / Eq. | fluidpy target | Evidence (V-levels) | Numbers | Label |
|---|---|---|---|---|
| Column total (1/g)∫q dp from (1.51) | `column_integral` | V1: constant q gives qΔp/g on 3 level sets; V1: q linear in p is exact on 50 random partial limits; V1: an independent route (explicit knots + `np.trapezoid` of the piecewise-linear interpolant) on 40 random limits; V1: unit q from 0 to p_s gives p_s/g (Vallis p. 12, the weight of the column); V2: sympy, trapezoid = ∫ of a linear q over any partial layer, the code's interpolant hits both end values, and a split is additive; V2: pint units give kg m⁻²; V3: exponential profile; V5: IGRA2 derived PW, Singapore | constant 1e-14 rel; linear 1e-12 rel; interpolant 1e-12 rel; weight 1e-14 rel; docstring example 50.9858 ✓; **order 1.999** (n = 8…256, error 2.48e-2 → 2.43e-5), equal to the Euler–Maclaurin term h²/(12P²) within 1 %; **IGRA2: 55.49 mm reproduced to < 1e-3, and all 309 Singapore soundings of 2023 that carry a PW agree to max 2e-4 rel** (mean PW 53.2 mm, range 38.5–62.0) | analytic, symbolic, converged, benchmark |
| Split additivity | `column_integral` | V2: exact additivity at 30 random pressures, on every level and inside a layer (862.5 hPa); a 3-way split with per-column split pressures | ≤ 1e-13 rel | symbolic |
| Level order, axis, per-column p | `column_integral` | V7: reversed order gives identical results; a random permutation agrees to 1e-14; `axis=-1` agrees; 3-D p equals the column-by-column 1-D result; a 1-D column returns a float | bitwise / 1e-14 | limit |
| Ground mask, NaN below ground | `column_integral` | V7: `p_surface` equals an explicit `p_bottom = min(p_s, p_max)` (bitwise), and the explicit bottom wins when it is higher up; V1: NaN below the ground holds the level above over the partial layer (closed form); p_s on a level gives no partial layer; V7: a NaN in a used layer gives NaN, and in an unused layer it does not | bitwise; 1e-13 rel | analytic, limit |
| No air gives 0 | `column_integral` | V7: p_bottom = p_top (also inside a layer); ground above p_top; a limit above the top level; ground above p_top with `extrapolate="constant"` (test added after mutant 11 survived) | exactly 0 | limit |
| Extrapolation | `column_integral` | V1: explicit bottom at 1013.25 hPa adds q(1000)·1325 Pa/g; p_top = 0 adds q(300)·30000 Pa/g; "none" clips the limits; **D1 and D2 pinned (strict xfail)** | 1e-14 rel | analytic (with defects) |
| Errors | `column_integral` | 8 cases: bad `extrapolate`, < 2 levels, scalar q, wrong p length, non-finite p, duplicate p, p_bottom < p_top, p_top < 0 | — | — |
| Front traced level by level | `front_by_level` | V1: a synthetic tilted tanh frontal zone (9 uneven levels, slopes 1:50 and 1:100) is traced on every level, each level's line lies on its analytic meridian, and the fitted slope and the per-level gaps are recovered; V1: an unrelated second front is not picked (and is traced when seeded); V1: the matching rule with controlled candidate lines (gap = mean of a cos ϑ Δλ); V7: level order, permutation, `FrontLine` seed; stops at the first level beyond `max_step_km` (up and down); never skips a level (added after mutant 30 survived); kind filter; a uniform field and a far seed give {}, and `seed_max_km` widens the seed match; 5 error cases | line within 5.8e-4° of the meridian (< 1/400 of a grid length); **slope −50.005 (rel 9.4e-5) and −99.991 (rel 9.4e-5)** against the plan's 2 % criterion; gaps within 0.15 km of S·Δz | analytic, limit |
| Real data: builder W70 crossings | `front_by_level` + `parallel_crossings` | V7: ERA5 section file, seed = the analysed 850-hPa cold front, `locate="centre"`, `min_length_km=100`: the 46.5°N crossings at 900, 875, 850, 825, 800, 775, 750, 700 and 650 hPa equal the builder's `uf1.json` values (the builder rounds to 0.001°) | all 9 within 6e-4° | limit |
| Real data: edge sensitivity | `front_by_level` | V7: the same hour on the ARCO box cropped to 42–51°N (46.5°N is then 18 rows in; the data agree with the section file to 6.4e-4 K on the overlap) gives the same 46.5°N crossings at 850–550 hPa | ≤ 0.13° (≤ 10 km) at every level | limit |
| Real data: plan W86 | `front_by_level` | **D3 pinned (strict xfail)**: on the full s48b box (40–56°N, 25°W–8°E), 5 of 11 levels are traced, against W86's ≥ 8 | 5/11 | — |
| Mean gap between lines | `line_gap_km` | V1: the equator and a parallel δ away (δ = 0.25°, 0.9°, 2°) give aδ with 0 ≤ gap − aδ ≤ h²/(8d); the docstring's 100-km example; V1: the same bound with misaligned vertices for h = 16…0.5 km; V7: invariant under 3 rigid rotations of the sphere (oblique great circle and its small circle); a sub-segment of the line gives < h/2; symmetric in its arguments; empty input gives NaN; single points | 100.0 km within 0.04; rotations 2e-4 rel. No convergence order is claimed: the resampling error depends on the vertex phase and is not monotone in h (aligned vertices give 7e-15) | analytic, limit |
| Crossings of a parallel | `parallel_crossings` | V1: a straight line (−13.5°, also reversed); a zig-zag crossing 3 times (5, 16.25, 25), returned in ascending order; no crossing gives an empty float array; V7: a vertex on the parallel counts once; a segment lying along the parallel contributes only its end vertices | exact | analytic, limit |

## Functions used by the movie builder (UF2 plan Part C)
| Function | Tests |
|---|---|
| `column_integral` | all of `test_column_integral.py` (W85, "about half": the vapour below 850 hPa as a fraction of the whole column, 0.4986 on the section box in the implementer's smoke run) |
| `front_by_level` | `test_front_by_level_*` (W86, s48b) |
| `line_gap_km` | `test_line_gap_km_*`, and through `front_by_level` |
| `parallel_crossings` | `test_parallel_crossings_*`, and the two ERA5 tests |

## Convergence studies
| Scheme | Grids | Observed order | Design order |
|---|---|---|---|
| `column_integral`, q = 0.018 exp((p − 10⁵)/1.6·10⁴), 1000–300 hPa | n = 8, 16, 32, 64, 128, 256 uniform levels | **1.999** (and the error equals h²/(12P²) within 1 %) | 2 (trapezoid in p) |

## Benchmarks used
| Benchmark | Value | Ours | Source | Date verified |
|---|---|---|---|---|
| Precipitable water, surface to 500 hPa, Singapore SNM00048698, 2023-06-06 (hour field 11 UTC) | 55.49 mm | 55.49 mm (< 1e-3 rel; the published value is rounded to 0.01 mm) | NOAA NCEI IGRA v2 derived parameters, `access/derived-por/SNM00048698-drvd.txt.zip` (Durre et al. 2016, doi:10.7289/V5X63K0Q). Format document `doc/igra2-derived-format.txt`: PW is columns 38–43 of the header, "precipitable water (mm*100) between the surface and 500 hPa"; VAPPRESS is level columns 73–79 in mb×1000 | 2026-10-29 |
| The same, all 309 soundings of 2023 with a PW | mean 53.2 mm (38.5–62.0) | max 2e-4 rel, median 1e-4 | as above; the file was fetched through `fluidpy.data.fetch` (93.4 MB, sha256 cd64f19e…a6) | 2026-10-29 |

IGRA's PW integrates specific humidity q, not the mixing ratio w: integrating w is systematically 1.28 % high on
every sounding, and integrating q matches to 1e-4. The tropical band of 40–60 kg m⁻² that the plan asked for holds
for the benchmark sounding and for the mean of 2023. The fetch logged C: 53.0 GB and G: 521.0 GB free before, and
C: 53.0 GB and G: 520.9 GB free after.

## Figures reproduced with our code (local only)
| Figure | File | Verdict |
|---|---|---|
| Convergence of `column_integral` | `outputs/ch00/verify/uf2_column_integral_convergence.png` | The error lies on the h²/(12P²) line across 1.5 decades of h, a clean second-order straight line. |
| 46.5°N cold-front crossings against height | `outputs/ch00/verify/uf2_front_by_level_46p5N_crossings.png` | The section box (20 levels) and the box cropped to 42–51°N (11 levels) give the same staircase; the builder's 9 points sit on it; the frontal surface is steep from 850 to 650 hPa (fit 1:50) and flattens sharply above 650 hPa (the 850–550 fit is 1:95); the full s48b box trace stops at 800 hPa. |

## Defects found (library code not edited; each is pinned by a strict xfail)
- **D1 (`column_integral`, Must-fix).** With `p_bottom=None`, the lower limit is set to the deepest level *before*
  `p_surface` is applied (`pb = min(p_max, p_s)`). So `extrapolate="constant"` never reaches a surface that lies below
  the deepest level. The docstring promises both "Default: the highest-pressure level (or p_surface when given)" and
  "from the 1000-hPa level down to a 1013-hPa surface". Example: q = 0.01 on [1000, 500] hPa with
  `p_surface=101325, extrapolate="constant"` returns 50.986 kg m⁻², where 52.337 is expected (the same call with
  `p_bottom=101325` returns 52.337). The implementer's smoke run shows the footprint: "constant extrapolation to
  1013.25 hPa: 18.673 (vs 18.673)". Pin: `test_column_integral_V1_p_surface_extrapolates_to_surface`. Hypothesis
  for the fix: use p_s as the default lower limit when it is given, then take min(p_bottom, p_s).
- **D2 (`column_integral`, Should-fix).** With `extrapolate="constant"`, when *both* limits lie beyond the level range
  on the same side, the whole gap (p_min − p_top) or (p_bottom − p_max) is added, instead of (p_bottom − p_top).
  Example: 0–200 hPa with a top level at 300 hPa returns q(300)·300 hPa/g, where q(300)·200 hPa/g is expected. Pin:
  `test_column_integral_V1_extrapolate_constant_both_limits_beyond_range`. Fix: clip the extension intervals to
  [p_top, p_bottom].
- **D3 (`front_by_level`, Must-fix for W86).** The mean gap is measured over the *shorter* line. So a short fragment
  beside the reference line beats the long continuation and becomes the new reference, and the front is lost one
  level later. On the UF2 s48b box (40–56°N, 25°W–8°E; the plan's own data for s48b), the 142-km cold-line fragment at
  800 hPa (46.1–47.3°N, crossing 46.5°N at 6.68°W, on the warm side) has a mean gap of 47.0 km. The 1549-km
  continuation has 48.6 km and crosses at 7.79°W. The fragment wins. At 750 hPa the nearest line is then 99.9 km away
  from it, so tracing stops: **5 of 11 levels, against W86's ≥ 8**. If the long line is kept at every level, all 11
  levels are traced, with mean gaps of 41–65 km. Pins: `test_front_by_level_V7_short_fragment_does_not_capture_trace`
  (synthetic, with controlled candidate lines) and `test_front_by_level_V7_era5_s48b_box_traces_at_least_8_levels`
  (ERA5). Fix options, the designer's choice: break near-ties by length or by overlap (the fraction of the reference
  line within `max_step_km` of the candidate), or measure the gap from the reference line's points restricted to
  their overlap.
- **Minor (cosmetic).** The guard `if Q.ndim == 0` in `column_integral` cannot be reached: `np.moveaxis` raises
  numpy's `AxisError` (a `ValueError`, message "axis 0 is out of bounds") first. It is still a ValueError, and the test
  accepts either message.
- **Stale docstrings.** Both docstrings still read "Validation (planned …) Label: unverified (pending
  tests/diag/test_sounding_column.py)" and "(pending tests/diag/test_fronts_by_level.py)". The real files are
  `tests/diag/test_column_integral.py` and `tests/diag/test_front_by_level.py`. Labels to write after the fixes:
  `column_integral`: analytic, symbolic, converged, benchmark (V1, V2, V3, V5). `front_by_level`: analytic, limit
  (V1, V7). `line_gap_km`: analytic, limit (V1, V7). `parallel_crossings`: analytic, limit (V1, V7). The docstring's
  planned "V3"-like wording for `line_gap_km` ("within step_km/2") is right as a bound, not as an order.

## Finding: the 850–550 hPa slope (1:95 against 1:50) is not an edge-of-box artefact
- **What changes.** The builder (W70) traced the front by the *local* crossing along 46.5°N, at most 80 km per level.
  It stopped at 650 hPa because the 650→600 step along 46.5°N is 99.6 km. `front_by_level` uses the *mean* line gap
  instead. That gap is only 32.1 km at 600 hPa and 47.9 km at 550 hPa, because most of each line moves much less
  than its southern end at 46.5°N. So the trace continues to 550 hPa, and in fact to 500 hPa, where the line no longer
  crosses 46.5°N inside 13–3°W.
- **Edge test.** The section box starts at 46.0°N, so 46.5°N is 2 rows in. The smoothing (100 km FWHM, truncated at
  4σ ≈ 1.5° ≈ 6 rows) and the one-sided second-order differences do reach it. But the same ERA5 hour on a box that
  reaches 42°N, where 46.5°N is 18 rows in, gives 46.5°N crossings that differ by ≤ 0.13° (≤ 10 km) at every level
  from 850 to 550 hPa. The fits on that box are 1:44 (850–650), 1:65 (850–600) and 1:93 (850–550); on the section box
  restricted to the same 11 levels they are 1:45, 1:67 and 1:96. The 1:95 is robust to the box. Pin:
  `test_front_by_level_V7_era5_46p5N_not_an_edge_artefact`.
- **What it is.** The frontal surface curves. From 850 to 650 hPa it is steep but irregular level by level: 850→825
  steps 12 km east (the wrong way), 825→800 steps 49 km west (1:197), 800→700 hPa is 1:17 to 1:25, and 700→650 is 1:85.
  The fit over 850–650 is 1:50, correlation −0.944. Above 650 hPa it flattens sharply: 650→600 is 100 km over 0.61 km (about 1:160), and 600→550
  is 155 km over 0.66 km (about 1:235). A straight-line fit through both regimes (1:95, correlation −0.92 to −0.94) is
  a poor model of a curved surface. Each upper line is long and well matched as a whole (gaps 30–50 km), so this is the
  same frontal zone, not a jump to another feature.
- **Recommendation.** Keep the s47/s48b slope statement on 850–650 hPa (1:50, consistent with W70), or narrate that
  the front leans back more and more with height. The W86 band "850→600 displacement along 46.5°N in 100–160 km"
  fails on the data: it is 198 km on the 42–51°N box and 208 km on the section box. The narration's "about a hundred
  and thirty kilometres back between one and a half and four kilometres up" must follow the data (rule §2.3), for
  example 850→650 hPa: 108 km over 2.13 km ("about a hundred and ten kilometres back over about two kilometres up").

## Deviations & justifications
- No `# DEVIATION` lines in the two functions.
- The V5 benchmark is IGRA2 derived PW, not a US Standard Atmosphere check. USSA-1976 carries no humidity, and the
  AFGL tropical profile tables (Anderson et al. 1986) could not be opened today (DTIC 403, libRadtran mirror 404).
  The IGRA value is a published, dated number for a real tropical sounding, and it tests the same integral.

## Mutation check
Method: a copy of fluidpy and the two test files in a scratch tree (the import probe confirms the copy is the one
imported, and `AOFD_REPO` is set so the ERA5 tests run). Each mutant is applied as a one-line replacement and the
function's test file is run with `-x`. Runner: `<scratchpad>/mutate_uf2.py`; log: `<scratchpad>/mutate_uf2.log`.
Both files pass on the unmutated copy (26 passed + 2 xfailed, and 22 passed + 2 xfailed).

| Function | Mutants | Killed | Survivors |
|---|---|---|---|
| `column_integral` | 13 | **12** | #5 `x0 = clip(pt, a, b)` instead of `clip(max(pt, p_min), a, b)` is equivalent, because every layer top a ≥ p_min |
| `line_gap_km` (+ `_densify`, `_haversine_km`) | 6 | **6** | — |
| `parallel_crossings` | 5 | **5** | — |
| `front_by_level` | 11 | **10** | #34 `idx = sorted(kept)` is equivalent to `[i for i in range(n) if i in kept]` |
| **Total** | **35** | **33 (94 %); 33/33 of the non-equivalent mutants** | |

Killed mutants: `total*g`; left-end-only quadrature; whole-layer trapezoid at a cut; interpolation
denominator +1; descending sort; no ground mask; no below-ground hold; wrong end level in both extrapolations; no
`pb > pt` zero (killed by a test added in this round); `<` instead of `<=` in the duplicate check; ignoring `p_top`;
max instead of mean gap; the axis swapped; the longer line measured instead of the shorter; flat-earth haversine;
no resampling; a in place of 2a; strict crossing test; horizontal-segment guard removed; mirrored interpolation weight;
rounding to 0 decimals; unsorted output; no max_step limit; farthest-first; no kind filter; upward-only tracing;
matching against the seed instead of the previous level; skipping a failed level (killed by a test added in this
round); level order not sorted; `seed_max_km` ignored; `prev` not updated; gaps zeroed. Mutants #15 and #16 (axis
swap; measuring over the longer line) fail 4 ordinary tests as well as XPASSing the strict D3 pin, so the kills do not
depend on the pin. Measuring over the longer line makes the synthetic D3 pin pass, but it is not a fix. It fails the
misaligned-vertex bound, the sub-segment test and both ERA5 tests, and the ERA5 s48b pin still fails under it.

## Suites
- `pytest tests/diag/test_column_integral.py tests/diag/test_front_by_level.py`: **48 passed, 4 xfailed** (strict pins
  for D1, D2 and D3 ×2); nothing skipped.
- `pytest tests/diag tests/data -q -p no:cacheprovider` (run from `../Fluid Dynamics`): **570 passed, 5 xfailed**
  (the 4 new pins, plus the existing strict xfail in `test_axes.py`), 145.9 s.
- **Full fluidpy suite**, run once, serially, from inside `../Fluid Dynamics`
  (`pytest tests -q -p no:cacheprovider`): **3166 passed, 5 xfailed, 0 failed**, 284 warnings, 3641 s (1 h 00 min 41 s).
  C: was 53 GB free before the run, above the 39-GB skip threshold. Right after it, C: read 35 GB free (below the 40-GB floor), and a few minutes later 49 GB. Another process was writing to C: at the same time: this verification's own C: footprint is about 90 MB (pytest temp 76 MB, mutation trees 12 MB). G: was 516 GB free.

## Open items
1. D1, D2, D3 (above) go to the implementer. After the fixes, the three strict xfails will XPASS and fail, which
   forces their markers to be removed. Then re-run this file and W86.
2. Stale validation text in both docstrings (above).
3. Plan W86 numbers (850→600 displacement 100–160 km; "about a hundred and thirty") do not hold on ERA5; the
   designer chooses the window (recommendation: 850–650 hPa).

## Verdict: FAIL (library defects D1 and D3 are pinned; every test is green and the evidence ladder is complete)
Every computable claim has ≥ 2 independent levels. `column_integral`: V1, V2, V3 (order 1.999) and V5 (IGRA2, 2e-4).
`front_by_level`: V1 and V7 (including real ERA5). `line_gap_km`: V1 and V7. `parallel_crossings`: V1 and V7. The
mutation kill rate is 33/35, which is 33/33 of the non-equivalent mutants. Both suites are green.
The verdict is still FAIL because two documented behaviours are wrong:
- D1: `p_surface` combined with `extrapolate="constant"` never reaches the surface.
- D3: a short fragment captures the trace, so the plan's own s48b box gives 5 of 11 levels against W86's ≥ 8.

D2 is a should-fix edge case. Re-verify after the implementer's fix: the strict xfails will XPASS and must then be
turned into plain tests.
