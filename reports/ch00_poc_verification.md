# Chapter 0 PoC verification — fluidpy.geo {constants, vectors, frames, atmos}        2026-10-21
AOFD commit 5e96708 · fluidpy commit c3b6f13 (v0.3.0) + uncommitted working tree (`fluidpy/geo/{constants,vectors,frames,atmos}.py`)

## Environment
Python 3.12.1 · numpy 2.5.4 · scipy 1.18.1 · sympy 1.14.0 · mpmath (sympy's) · AOFD `.venv` (fluidpy editable).

## Validation table (PoC computable items need >= 2 independent levels; every called function >= 1)
| Concept / Eq. | PoC | fluidpy target | Evidence (V-levels) | Numbers | Label | Notes |
|---|---|---|---|---|---|---|
| a·b = Σ a_i b_i = \|a\|\|b\| cos θ (K 2.2), (0A.1) | A, G | `vectors.dot` | V1 component sum and cos form on 400/500 random vectors; V2 sympy cos law + law of cosines; V2 pint (advection unit K/day); V7 rotation invariance, symmetry, 2-vector padding | max rel. err 1e-14 | analytic | — |
| a×b (K 2.20), ε form (K 2.21), \|a×b\| = area (0A.2) | A | `vectors.cross`, `parallelogram_area` | V1 components + np.cross; V2 sympy ε_ijk = Matrix.cross, Lagrange identity, ⟂; V7 rotation covariance, mirror gives −(pseudovector), antisymmetry, shear invariance of area | 1e-14; Lagrange 1e-13 rel.; drawing invariant \|c·a\| < 1e-12 | analytic | — |
| angle θ = atan2(\|a×b\|, a·b) | A, G | `vectors.angle_between` | V1 known angles + field vs arccos (well-conditioned part); V1 near-parallel/antiparallel vs mpmath 50 digits; V7 rotation/scale invariance, zero vector → NaN | ≤ 4e-16 rel. at ε = 1e-13 | analytic | arccos mutant fails |
| projection a·b/\|b\|, (a·b/\|b\|²)b (0A.3) | A, G | `projection`, `scalar_projection` | V1 remainder ⟂ b, idempotent, = \|a\| cos θ; V7 independent of \|b\|, sign flip | 1e-14 | analytic | — |
| a·(b×c) | A | `triple_scalar` | V1 = det; V7 cyclic, antisymmetric, coplanar → 0 | 1e-12 | analytic | — |
| k×u (2.79) | A, B | `k_cross` | V1 = cross(ẑ, u); V7 k×(k×u) = −u, \|k×u\| = \|u\|, ⟂, anticlockwise | exact | analytic | — |
| f = 2Ω sin ϑ (2.80) | B, F | `frames.coriolis_parameter` | V1 field; V5 f(45°) = √2 Ω_WGS84 = 1.0313e-4 s⁻¹; V7 odd, f(0) = 0 | 1e-20 abs | analytic | — |
| β = 2Ω cos ϑ/a (2.81) | — | `beta_parameter` | V1 complex-step derivative; V7 even, 0 at pole | 1e-14 rel. | analytic | not called by PoC |
| −f k×u (2.55)/(2.79) | B | `coriolis_horizontal`, `coriolis_acceleration_horizontal` | V2 sympy: horizontal part of −2Ω×u with Ω = Ω(0, cos ϑ, sin ϑ); V1 ⟂ u (no work), \|a\| = \|f\|\|u\|, = core 3-D; V7 right in NH, left in SH, 0 at equator | 1e-17 abs; 1e-15 rel. | analytic | — |
| turntable puck (2.7), (2.12) | B, D | `turntable_puck` | V1 vs independent DOP853 solve of the rotating-frame ODE (3 cases, incl. Ω < 0); V4 Jacobi integral ½\|v_R\|² − ½Ω²r² (velocities by 4th-order FD of the library output) and \|r_R\| = \|r_I\|; V7 Ω → 0 straight line, NH right / mirror, same launch in either frame; cross-check `core.rotating.projectile_paths` | ODE 1e-9 rel.; Jacobi 1e-9 | analytic | — |
| inertial circle: r = U/\|f\|, T = 2π/\|f\| (§2.9.2, 3.126) | B, D | `inertial_circle` | V2 sympy residual of (3.126), radius, period, centripetal balance; V1 96 968.68 m and 16.924 h at 45°N, 10 m/s; V5 16.9 h at 45° (cited); V7 sense flips with f, ValueError at f = 0, T → ∞ towards the equator | rel. 1e-15; \|T − 16.9 h\| = 0.024 h ≤ 0.05 h | analytic | — |
| f-plane inertial oscillation (3.126)–(3.127) | B, D | `inertial_oscillation` | V1 vs DOP853 ODE (f < 0, offset start); V4 speed, distance to centre; V7 closes after 2π/f, centre right of motion (NH), f = 0 straight line | path 1e-5 m, vel. 1e-9 m/s | analytic | — |
| Coriolis-only motion on the sphere (2.50a,b), (2.28) | B | `inertial_oscillation_sphere` | V3 RK4 order 4.06 (pairwise 4.08, 4.06, 4.03); V1 default dt = 60 s vs DOP853 (< 1 mm after 2 days; off-grid output time); V4 speed and axial absolute angular momentum M = a cos ϑ (u + Ωa cos ϑ) to 1e-10 over 5 days (metric-free run breaks M by > 1e-6); V7 f = 0 → closed-form great circle (< 1 mm), U → 0 → f-plane circle (first order in U/(fa), coefficient converged 0.2 %), hemisphere mirror, equator stays on equator, time reversal, westward β drift, lat_max → NaN | see Convergence/Conservation | converged | — |
| λ_I = λ_E + Ωt (2.7) | B | `to_inertial_lon` | V1 offset; V1 agrees with the 3-D R_z route of `great_circle_earth_frame`; V7 inverse with −Ω, one sidereal day = one turn | 1e-12 | analytic | — |
| great circle (f = 0 ghost) | B | `great_circle` | V1 plane through centre (normal r₀×d), arc length = Ut/a, lap closes; V7 = RK4 sphere with `coriolis=False` | 1e-13; arc 1e-7 rad | analytic | — |
| space-straight path seen from Earth | (trap card) | `great_circle_earth_frame` | V1 \|r\| = a, lat_E = lat_I, lon offset −Ωt, launch speed U + Ωa cos ϑ₀ (2.7); V7 Ω = 0 → `great_circle` | 1e-12 / 1e-14 | analytic | not used by PoC B |
| geostrophic wind from Z on the sphere (2.198)/(2.215) | F | `atmos.geostrophic_wind_from_height` | V2 sympy: solid-body Z gives u₀ cos ϑ, wave Z gives v_g uniform, f k×u_g = −∇Φ componentwise; V2 pint units; V1 exact (1e-11) on a quadratic regional field incl. edge nodes; V3 order 2.00 (u) and 2.00 (v) on global 4°→0.5° grids (solid-body, wave); V7 cyclonic round NH and SH lows (ring circulation and four side winds), equatorial mirror (u even, v odd), constant-Z gauge, N→S ordering, leading axes, regional = global interior, equator/pole NaN masks for lat_min 5° and 15° | V3 errors (solid body, u₀ = 20 m/s): 0.060, 0.015, 0.0038, 0.00095 m/s | converged | see Discrepancy 2 |
| H = RT/g | F (scene text) | `atmos.scale_height` | V1 = RT/g, = core; V1 independent hydrostatic ODE e-folds over H (rel. 1e-9); V5 USSA-1976 8435 m (sea level), 6382 m (20 km, local g); V2 pint | 8434.73 m (−3.2e-5 rel.); 6381.8 m | analytic | — |
| hypsometric thickness (2.166) | F (scene text) | `atmos.hypsometric_thickness` | V1 isothermal both code paths, Δz = H per factor e; V1 exact for T linear in ln p with off-grid bounds (ln-p interpolation); V3 order 2.00 (T nonlinear in ln p, USSA troposphere); V5 USSA-1976 5 km (54 048 Pa → 4996.07 m geopotential, < 0.1 m); V7 antisymmetric, additive, monotone in T, guards | V3 errors 0.62 → 0.0024 m | analytic | see Discrepancy 3 |
| constants Ω, a, g₀, R_d, c_p, κ, p_ref, ρ₀ | all | `geo.constants` | V5 Ω = 7 292 115e-11 (WGS 84); V1 identity with `fluidpy.core`; κ = 2/7; SIDEREAL_DAY = 2π/Ω | exact | analytic | — |

All three PoC-required computable items with ≥ 2 independent levels: dot (V1, V2, V7), cross (V1, V2, V7), angle (V1 ×2 incl. mpmath, V7), turntable puck (V1, V4, V7), inertial circle (V1, V2, V5, V7), geostrophic wind from height (V1, V2, V3, V7). Every Part C function has ≥ 1 level (table above). No `qualitative` or `unverified` rows.

## Functions used by the PoC (design Part C) — tests
`tests/geo/test_vectors.py` (22 tests): dot, cross, norm, angle_between, projection, scalar_projection, parallelogram_area, triple_scalar, k_cross.
`tests/geo/test_frames.py` (31 tests): constants (Ω, sidereal day, a), coriolis_parameter, beta_parameter, coriolis_horizontal, coriolis_acceleration_horizontal, turntable_puck (×3 parametrised + Jacobi + limits + Kundu cross-check), inertial_circle, inertial_oscillation, inertial_oscillation_sphere (V3, V1, V4, 4×V7, guards), to_inertial_lon, great_circle, great_circle_earth_frame.
`tests/geo/test_atmos.py` (17 tests): constants (g₀, R_d, c_p, κ), geostrophic_wind_from_height (V2 ×2, V1, V3 ×2, V7 ×3), scale_height (V1, V5, V2), hypsometric_thickness (V1 ×2, V3, V5, V7).
Tests carrying each label in their name: V1 28 · V2 8 · V3 3 · V4 3 · V5 5 · V6 0 · V7 23 (70 test items, 67 functions). All pass, also under `-W error::RuntimeWarning`.

**Discrimination (mutation study, scratch copy of fluidpy, 15 mutants, all killed):** geostrophic v without cos ϑ (2 tests fail), u sign (4), u factor ½ (3); sphere metric-term sign (4), metric term missing in dv/dt (4), RK4 weights (5); turntable rotation sense (8), launch-velocity sign (3); inertial-circle centre sign (1); Coriolis acceleration sign (3); k×u sign (5); angle via arccos (1); one cross-product component sign (6); hypsometric sign (5); hypsometric interpolation in p instead of ln p (1, after adding the off-grid-bounds V1 test).

## Convergence studies
| scheme | grids | observed order | design order |
|---|---|---|---|
| RK4 on (2.50a,b)+(2.28), 45°N, (30, 10) m/s, 4 days, vs DOP853 rtol 1e-13 | dt = 3600, 1800, 900, 450 s; position error 1396, 82.5, 4.96, 0.303 m | 4.06 (pairwise 4.08, 4.06, 4.03) | 4 |
| geostrophic wind, centred differences, \|ϑ\| ∈ [20°, 70°] — solid body u | 4°, 2°, 1°, 0.5° | 1.98, 2.00, 2.00 | 2 |
| same — wave field u / v | 4°…0.5° | u 1.84, 2.00, 2.00; v 1.87, 2.00, 2.00 | 2 |
| hypsometric trapezoid in ln p, USSA troposphere 1000→300 hPa | 9…129 levels | 2.000 | 2 |
| sphere→f-plane departure vs U/(fa) (limit, not a scheme) | U = 2, 1, 0.5, 0.25 m/s | 1.00 (coefficient ≈ 9.44, converged to 0.2 %) | 1 |

## Conservation / invariant residuals
Turntable Jacobi integral: < 1e-9 of Ω²r² scale over 12 s · \|r_R\| = \|r_I\|: 1e-14 rel. · f-plane speed: 1e-14 rel. · sphere speed: < 1e-10 rel. over 5 days at dt = 60 s (smoke: 1.0e-12 over 2 days) · sphere axial angular momentum: < 1e-10 rel. over 5 days · Coriolis work a·u: < 1e-15 of \|f\|\|u\|².

## Benchmarks used (`reference/ch00/SOURCES.md`, `make_refs.py` → `benchmarks_poc.json`)
| benchmark | value | ours | source | verified |
|---|---|---|---|---|
| Ω | 7 292 115e-11 rad/s | identical | NGA WGS 84 TR8350.2 | 2026-10-21 |
| inertial period 45° | ≈ 16.9 h | 16.924 h | cleonis.nl table; Charles Univ. hydrodynamics ex. 10 ("≈ 17 h") | 2026-10-21 |
| f at 45° | (from Ω) 1.0313e-4 s⁻¹ | 1.03126e-4 | derived from WGS 84 Ω | 2026-10-21 |
| scale height, sea level | 8435 m | 8434.73 m | USSA-1976 via pdas.com Table 2 | 2026-10-21 |
| scale height, 20 km (local g) | 6382 m | 6381.8 m | same | 2026-10-21 |
| 5 km: p = 54 048 Pa, T = 255.676 K | geopotential 4996.07 m | thickness within 0.1 m; T within 2e-3 K | USSA-1976 via pdas.com Table 1 | 2026-10-21 |
The R_d difference (fluidpy 287.058 from CODATA R; USSA 287.053) is 1.7e-5 relative and is allowed for explicitly in the test.

## Numbers from the text
None run: no `tests/book_values_ch00.json` exists (the scale-height and hypsometric docstrings mention Vallis's rule-of-thumb values as V6; they are not evidence here).

## Figures reproduced with our code (local, `outputs/ch00/verify/`, script `make_verify_figs.py`)
| figure | file | verdict |
|---|---|---|
| turntable puck | `turntable_puck.png` | Straight inertial path and a right-curling spiral on the anticlockwise table, both from the launch point — correct sense. |
| inertial oscillations on the sphere | `inertial_sphere.png` | NH loops lie to the south (turning right), SH loops to the north, both drift slowly westward from the dashed f-plane circles; the f = 0 ghost leaves east on a great circle that bends equatorward — as expected. |
| geostrophic wind round two lows | `geostrophic_lows.png` | Anticlockwise round the 45°N low, clockwise round the 45°S low, near zero far from them — cyclonic in both hemispheres. |

## Deviations & justifications
`great_circle_earth_frame` carries `# DEVIATION` (idealised bulge-free sphere, not Vallis's effective-gravity thin shell); tested as geometry only, and not used by PoC B (design Q2).

## Discrepancies (reported, not fixed — library code untouched)
1. **Design vs implementation default.** Design Part C specifies `geostrophic_wind_from_height(..., lat_min=15.0)`; the library default is `lat_min=5.0`. Both values are tested. The PoC F scene must pass `lat_min` explicitly, or the designer/implementer must agree one default.
2. **`geostrophic_wind_from_height` docstring overclaims.** It says the solid-body field "gives exactly u_g = u₀ cos ϑ". The discrete operator does not: the error is second order (0.025 m/s at 2.5°, u₀ = 20 m/s). The operator is exact only for fields quadratic in (ϑ, λ). The wording should say "converges at second order to".
3. **`hypsometric_thickness` docstring.** "V3 profile integral converges at second order to the closed form for T linear in ln p" is wrong in detail: for T linear in ln p the result is exact (V1, 1e-13). Second-order convergence holds for T nonlinear in ln p (tested on the USSA troposphere).
4. **`constants.SIDEREAL_DAY` = 2π/Ω = 86 164.1006 s** is about 10 ms longer than the true sidereal day, 86 164.09 s. The cause is the rounded WGS 84 Ω, so the table's "≈ 86 164" holds. Cosmetic only. My first draft asserted 86 164.09 ± 0.01 from memory; I replaced it with a bound.
5. **`inertial_oscillation_sphere` docstring** says "V1 f-plane limit … within a few %". In fact the departure is linear in U/(fa) with coefficient ≈ 9.4: about 15 % of the radius after one period at U = 10 m/s (the westward β drift of ≈ 14.6 km). The test asserts the limit (U → 0) rather than "a few %" at 10 m/s.
6. Docstring `Validation:` lines should be updated to cite these test names (math-verifier → concept-implementer).

## Open items
- Discrepancies 1–3 and 5 are docstring/design wording, for the concept-implementer; none changes a number.
- V6 not applicable (no private book-value file for ch00).

## Suites
- New tests: `tests/geo/test_vectors.py`, `test_frames.py`, `test_atmos.py` — **70 passed** (also with `-W error::RuntimeWarning`).
- Full fluidpy suite (`PYTHONUTF8=1 … -m pytest tests -q -n 8 -p no:cacheprovider`, baseline 2203 passed): **2273 passed, 1 warning (pre-existing Kundu quad IntegrationWarning) in 1494 s** = baseline 2203 + 70 new; 0 failures.
- AOFD suite (`.venv/Scripts/python.exe -m pytest tests -q`): **15 passed** in 41 s.

## Disk
C: 97 GB free before → 95 GB after; G: 590 GB before → 590 GB after (no downloads).

## Verdict: PASS
