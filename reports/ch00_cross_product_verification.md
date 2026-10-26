# ch00 cross-product movie: library verification (I1 trajectories, I2 cyclone diagnostics)

2026-10-26 · fluidpy `be91830` + uncommitted `fluidpy/diag/{_grid,trajectories,cyclone}.py` · aofd `682031c`

## Environment
Python 3.12.1 · numpy 2.5.4 · scipy 1.18.1 · run from `../Fluid Dynamics` (cwd matters).

## Scope
These are library tests for two new `fluidpy.diag` modules used by the movie `ch00_cross_product_why`:
- `fluidpy/diag/trajectories.py`: `advect_on_sphere` (I1)
- `fluidpy/diag/cyclone.py`: `storm_centre`, `storm_relative_wind` (I2)
- `fluidpy/diag/_grid.py`: private helpers, exercised through both.

I read Vallis (2.28)–(2.29) from the rendered page (p. 61): (u, v, w) = (r cos ϑ Dλ/Dt, r Dϑ/Dt, Dr/Dt) and **v** = **i**u + **j**v + **k**w. The code's dλ/dt = u/(a cos ϑ), dϑ/dt = v/a and the unit vectors i = (−sin λ, cos λ, 0), j = (−sin ϑ cos λ, −sin ϑ sin λ, cos ϑ) agree with the page (latitude ϑ, not colatitude).

Test files (fluidpy repo, not committed):
- `C:\Users\sislam27\Work\Climate Dynamics PHD\Fluid Dynamics\tests\diag\test_trajectories.py`: 22 tests
- `C:\Users\sislam27\Work\Climate Dynamics PHD\Fluid Dynamics\tests\diag\test_cyclone.py`: 21 tests (including 4 parametrised Gaussian cases and 2 real-data cases)

## Validation table
| Function / claim | Evidence (V-levels) | Numbers | Label |
|---|---|---|---|
| `advect_on_sphere`, (2.28) λ-λ form | V1 solid body u = U cos ϑ closes after 2πa/U (round-off, < 1e-9°); V1 off-row closure within the bilinear bound 2π·1.05·h²/8; V3 RK4 against the loxodrome | observed order **3.986** (dt halved 4×, errors 5.9e-5 → 9.5e-10 rad) | analytic, converged |
| polar Cartesian form (2.29), pole guard | V1 tilted-axis solid-body rotation against Rodrigues (one track goes over the N pole, one reaches 85°); V3 grid order; V7 guard on vs off | max error 1.0e-5 rad at h = 0.25°; grid order **1.96 / 2.05** (design 2); closure 4.5e-5 rad with the guard vs 3.3e-2 rad without it (×740) | analytic, converged, limit |
| time-dependent winds | V1 u = (U₀ + αt) cos ϑ is exact (quadratic in t); V7 time-constant equals steady (1e-10°); datetime64 equals float seconds (bit-identical); outside the record gives NaN | exact to 1e-9° | analytic, limit |
| dt < 0 | V7 retraces the forward track; back trajectory from the record end matches the analytic −15 m/s·T/a | 2.1e-9 rad | limit |
| grid invariances | V7 zero wind keeps parcels fixed; ascending = descending latitude (bit-identical); a duplicate cyclic column changes nothing (bit-identical); −180…180 = 0…360 (1e-9°); unwrap / wrap; periodic auto-detection | — | limit |
| regional exit / missing data | V1 exit step = ⌊t_exit/dt⌋ + 1 exactly, NaN stays NaN; seed outside the box gives NaN; a NaN strip in the data kills the parcel | — | analytic, limit |
| `storm_relative_wind` ring geometry | V1 against the navigation formulas (haversine distance, initial bearing, back-bearing for r̂), which are independent of the library's rotation construction; meridian convergence is present (1–2.5° at 400 km) | distance rtol 1e-9; r̂ 1e-9 | analytic |
| spin and radial sign, k·(r̂ × u), r̂·u | V1 uniform wind (bilinear interpolation is exact): v_t = r̂_e v − r̂_n u, v_r = r̂_e u + r̂_n v | 1e-9 | analytic |
| Rankine vortex | V1 v_t exact up to interpolation, v_r ≈ 0; V3 grid order | at h = 0.025°: v_t relative error 2.1e-4 / 6.6e-5 / 2.0e-5 at 80/150/300 km; \|v_r\|/v_t ≤ 2.7e-4; order **2.19** | analytic, converged |
| pure sink, spiral inflow | V1 v_r = −U, v_t = 0, inflow angle 90°; spiral inflow angle = atan(15/40) | sink: \|Δv_r\| 1.1e-3 m/s, angle 0.005°; spiral 20.5560° vs 20.5560° | analytic |
| hemisphere mirror and σ DEVIATION | V7 the mirrored field (ϑ → −ϑ, v → −v, descending SH grid): v_t flips, v_r and the inflow angle are unchanged; `hemisphere_sign=+1` in the SH gives 180° − β | 1e-9 | limit |
| curvilinear grid | V7 2-D coordinates of a regular grid match the regular-grid result (1e-8); V1 a sheared, rotated affine grid with an affine field is exact (Newton inversion) | 1e-7 | analytic, limit |
| partial ring | V7 valid_fraction is in (0, 1) and matches the off-grid arc (to within 2 azimuths); the means and median are NaN | — | limit |
| `storm_centre` | V1 paraboloid recovered to round-off (lat/lon 5e-14°, p 3e-11 Pa), descending latitude too; V1 off-grid Gaussian lows (4 centres × 2 widths) | max error **0.0066 cell** (spec 0.1) | analytic |
| `storm_centre` edges | V7 an edge minimum gives refined = False (the grid node is returned); a low on the 0° seam; box selection; a box across 0°; leading time axes; errors raised | — | limit |
| real data spot check (skips without G:) | V5 ERA5 MSLP centre vs IBTrACS v04r01 best track; signs of v_t, v_r and the inflow angle | Ian 2022-09-28 18Z: 0.15° from IBTrACS, v_t(150 km) +14.6 m/s, inflow 20°; Idai 2019-03-14 00Z: 0.19°, v_t −16.9 m/s, inflow 29° | benchmark (positional, qualitative signs) |

Every function called by the movie builder (`advect_on_sphere`, `storm_relative_wind`; `storm_centre` is exported) has ≥ 2 independent levels (V1 + V3 or V1 + V7).

## Discrimination (mutation) check
Each mutant was patched into a scratch copy of `fluidpy` and the `tests/diag` suite was run against it. All 9 mutants were killed (number of tests that fail in brackets):
- dropping cos ϑ in dλ/dt (10)
- sign of j in the polar form (5)
- no time interpolation (1)
- RK4 replaced by a midpoint step (3)
- v_t = k·(u × r̂) (8, including both real-data cases)
- flat r̂ = (cos α, sin α) (6)
- σ removed (1)
- dx/dy swapped in the centre refinement (6)
- clockwise azimuth (2)

## Convergence studies
| Scheme | Refinement | Observed order | Design order |
|---|---|---|---|
| RK4 time stepping (constant field, loxodrome) | dt = T/5 … T/80 | 3.986 | 4 |
| bilinear + RK4, tilted rotation | h = 1°, 0.5°, 0.25° | 1.96, 2.05 | 2 |
| bilinear ring interpolation, Rankine at 150 km | h = 0.1°, 0.05°, 0.025° | 2.19 | 2 |

## Deviations & justifications
- `cyclone.py:223, 281`: the inflow angle is atan2(−v_r, σ v_t) with σ = sign(ϑ_c). This is the implementer's documented DEVIATION. It is tested: the angle is unchanged under the hemisphere mirror, and `hemisphere_sign=+1` reproduces the spec's unsigned formula (180° − β in the SH).
- Test correction (my own error, not the library's): I first bounded the Gaussian `msl_min` to 50 Pa, which ignored the Gaussian's quartic term over the 3×3 patch. I replaced it with the derived bound D·4/(8(σ/h)⁴): 156 Pa for σ = 2 cells and 9.8 Pa for σ = 4 cells. Observed values were 54–63 Pa and < 10 Pa. The position tolerance (0.1 cell) is unchanged.

## Library bug found (reported, not fixed)
**B1 · `fluidpy/diag/trajectories.py:197/211` with `:66`: a round-off overshoot at the end of the record kills the parcel.**
- **What happens:** the step time is `t = F.t0 + n*dt`, and the end-of-step check samples `F(..., t + dt)`. `_Sampler.__call__` uses `np.interp(t, times, …, right=np.nan)` with no allowance. If you integrate over exactly the record with dt = T/n, then for n = 7 or 13 (T = 864000 s) (n − 1)·dt + dt − T = **+1.16e-10 s**. The last point becomes NaN although the parcel never left the record.
- **Pinned by:** `test_time_dependent_V7_integrating_exactly_to_record_end_stays_finite`, which fails: last point NaN for n = 7.
- **Suggested fix (for the implementer):** clip t to [times[0], times[−1]] when it is within a few ulp of either end (e.g. `atol = 1e-9·max(1, |T|)`), or compute `t = t0 + n*dt` with the final step snapped to the record end.
- **Movie impact:** low (the builder's streaklines are steady or stop short of the record end), but a back-trajectory from `times[-1]` with an awkward dt could lose its first point the same way.

## Open items
1. **B1:** fix in `trajectories.py` by the concept-implementer, then re-run `tests/diag`.
2. Docstrings still say "Validation (planned, math-verifier) … Label: unverified (until the tests land)" in `advect_on_sphere`, `storm_centre` and `storm_relative_wind`. After B1 is fixed, the implementer should update them to the levels above:
   - `advect_on_sphere`: analytic, converged, limit (V1, V3, V7).
   - `storm_relative_wind`: analytic, converged, limit (V1, V3, V7).
   - `storm_centre`: analytic, limit (V1, V7).
3. The real-data test is a positional V5 against IBTrACS (55 km acceptance radius, 2 ERA5 cells) plus qualitative sign and range checks. The inflow-angle range 0–60° is qualitative; the cited typical value is about 23° (Zhang & Uhlhorn 2012).

## Suite results
- `tests/diag` (new): **42 passed, 1 failed** (B1).
- Full fluidpy suite (`-n 8`, PYTHONHASHSEED=31363, cwd `../Fluid Dynamics`): **2333 passed, 1 failed, 1 warning in 1396.83 s (23:16)**. The only failure is B1. No Kundu regressions. The ch09 sympy `dsolve` test did not hang with this seed.
- AOFD suite: not run. This task changed no AOFD code; the only AOFD file written is this report.

## Verdict: FAIL
One library bug (B1) is pinned by a failing test. Every other claim passes with ≥ 2 independent levels.
