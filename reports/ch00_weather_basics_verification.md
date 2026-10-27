# Chapter 0 movie `ch00_weather_basics` — verification of library functions F1–F11      2026-10-27 (round 2)

AOFD at `4c777ce` (+ uncommitted movie work); fluidpy at `e448957` + uncommitted F1–F11 (`fluidpy/geo/moist.py` new,
`geo/atmos.py`, `geo/constants.py`, `diag/fronts.py` new, `diag/climatology.py` new, `data/igra.py`). Verifier: math-verifier
agent. Plan: `movies/ch00/ch00_weather_basics/data_needs.md` §C. Nothing committed.

**Round 2 (same day).** The implementer changed F10 `daily_climatology` to pooled-window percentiles (all base-year
values within ±(smooth_days//2) calendar days, circular, 29 Feb counted as day 59; no curve smoothing afterwards)
and gave F11 a relative round-off allowance of 1e-9 on the 2 K/km threshold. The F10 tests were rewritten against
independently derived expectations, an F11 exact-threshold test was added, both mutation sets were re-run, and the
full suite was run once more. Round-1 findings 1 (F10 coverage) and 3 (F11 round-off) are resolved.

## Environment
Python 3.12.1 · numpy 2.5.4 · scipy 1.18.1 · sympy 1.14.0 · xarray 2026.9.0 · pandas 3.0.6 · scikit-image 0.26.0
(AOFD `.venv`, fluidpy installed editable).

## Equations checked on the page images (before any analytic or sympy row)
| Equation | Page (pdf / printed) | Matches the code |
|---|---|---|
| (18.6) R^v/R^d = μ^d/μ^v = 1/ε ≈ 1.608; (18.9) e = n^v/(n^d + n^v) p; (18.11) e = qp/(q + ε(1 − q)), q = εe/(p − e(1 − ε)) | p695 / 675 | yes (`specific_humidity`, `vapour_pressure_from_q`, `exact=True`) |
| (18.12) e ≈ wp/ε = 1.61wp, q ≈ w ≈ εe/p; ℋ = e/e_s ≈ q/q_s | p696 / 676 | yes |
| (18.27) de_s/dT = L e_s/(R^v T²); (18.28) e_s = e0 exp[(L/R^v)(1/T0 − 1/T)] | p699 / 679 | yes |
| Fig. 18.1 caption: T0 = 273 K, e0 = 6.12 hPa, L = 2.44 × 10⁶ J kg⁻¹, R^v = 462 J kg⁻¹ K⁻¹ | p700 / 680 | yes (module defaults) |
| (2.166) z(p₂) − z(p₁) = −(R/g) ∫ T d ln p | p103 / 83 | yes (`sea_level_pressure`) |
| (2.246) Γ_d = g/c_p; lapse rate Γ = −∂T/∂z | p119 / 99 | yes (LCL ascent; tropopause uses the meteorological sign for the 2 K/km threshold, the Kundu sign dT/dz internally) |

## Validation table
Test files (fluidpy): `tests/geo/test_moist.py` (22), `tests/geo/test_atmos_weather.py` (17), `tests/diag/test_fronts.py`
(20 incl. parametrised), `tests/diag/test_climatology.py` (9 incl. parametrised; round 2: no xfail).

| Id | Function | Evidence (V-levels) | Numbers | Label | Verdict |
|---|---|---|---|---|---|
| F1 | `moist.saturation_vapour_pressure` | V1 e_s(T0) = e0 exactly, (18.28) vs `math.exp` on 181 points (rtol 1e-13); V2 sympy `dsolve` of (18.27) with e_s(T0) = e0 gives (18.28); V2/V3 library satisfies (18.27): centred FD residual order 2.000, 1.4e-5 at h = 0.125 K; V2 dimensions (pint); V5 Bolton (1980) | 6.19, 12.24, 23.13, 41.91 hPa at 0/10/20/30 °C; vs Bolton max 1.99 % on −4…35 °C (< 2 %); −10…−4 °C: 3.45 % at −10 °C, bounded by the log-triangle inequality with Bolton-anchored constants (e0 = 611.2 Pa, T0 = 273.15 K, L = 2.501e6, R^v = 461.5; that curve is within 0.28 % of Bolton on −10…0 °C) | analytic, symbolic, benchmark | PASS |
| F2 | `moist.dew_point` | V1 round trip on 201 points (rtol 1e-13), dew_point(e0) = T0; V2 sympy solve of (18.28) for T equals the coded inverse; V7 monotone, guard | 15 hPa → 286.27 K (13.1 °C) | analytic, symbolic | PASS |
| F3 | `moist.relative_humidity` | V1 e/e_s by independent `math.exp`; V7 ℋ = 1 at e = e_s(T) and at T = T_d(e) (rtol 1e-12); supersaturation not clipped | 15 hPa at 25 °C → 0.479 | analytic, limit | PASS |
| F4 | `moist.specific_humidity`, `vapour_pressure_from_q` | V1 movie number and mutual inverses (both forms, rtol 1e-13); V2 sympy: (18.8a) + (18.9) ⇒ both forms of (18.11); (18.12) is the first term of the e/p series; V7 exact/approx gap = (1 − ε) e/p + O((e/p)²); V2 dimensions | q = 0.020, 1000 hPa → 32.2 hPa (18.12), 31.8 hPa (18.11) | analytic, symbolic, limit | PASS |
| F5 | `moist.lifting_condensation_level` | V1 closed-form parcel state; p_lcl vs independent `solve_ivp` hydrostatic (rel 1e-9); saturation residual (rel 1e-9); q conserved (rel 1e-12); V1 Espy within 5 %; V2 sympy derivation of the Espy slope 1/(g/c_p − g R^v T/(L R)); V7 slope limit T_d → T (rel 1.3e-6 at δ = 1e-3 K, halves with δ); V3 independent midpoint march converges at order 2.004 (Euler 1.037); V7 T_d = T → (0, p, T), monotone, guards, broadcasting | movie case 25 °C / 13.1 °C / 1013 hPa → 1493 m (CHECK W32 range 1.35–1.65 km); Espy worst 2.9 % (35 °C, 0.5 K) over 0–35 °C × 0.5–15 K; Espy slope 126.6 m/K at 288 K | analytic, symbolic, converged, limit | PASS |
| F6 | `atmos.wind_direction_from`, `wind_components` | V1 eight compass points, (8, 6) → 233.13° = 180° + atan(8/6); V7 round trip on 500 random winds (1e-10°), rotation equivariance (+37°), calm → NaN, never 360 | 233.13° (CHECK W33) | analytic, limit | PASS |
| F7 | `constants.KNOT`, `NAUTICAL_MILE` | V1 definitions; V7 same conversion through pint's registry (rel 1e-12) | 0.5144 m/s; 10 m/s = 19.44 kt; 2πa/21600 = 1853 m, 0.07 % from 1852 (CHECK W34) | analytic | PASS |
| F8 | `atmos.sea_level_pressure` | V1 isothermal closed form (rel 1e-14); V1 hypsometric route (2.166): thickness = z_s (rel 1e-12) for three stations; V2 sympy inversion of (2.166); V1 lapse column vs independent `solve_ivp` (rel 1e-10, three lapse rates incl. an inversion); V7 z_s = 0, first-order lapse limit (g/R)Γz_s²/(2T_s²) | 835 hPa, 1609 m, 15 °C → 1010.5 hPa (CHECK W38); with −6.5 K/km: 1007.1 hPa | analytic, symbolic, limit | PASS |
| F9 | `diag.fronts.thermal_front_parameter`, `front_fields`, `smooth_on_sphere`, `front_lines` | V2 sympy: TFP = −τ″ of a tanh front, zero at the centre, maximum at tanh = 1/√3 (s = 0.65848 W); V1/V3 TFP vs analytic on a latitude front, order 1.95, 2.0e-3 at 0.05°; V1/V3 longitude front at 20–70° N (metric 1/(a cos ϑ)), order 1.99, 1.1e-3; V1 smoothing leaves constants and interior linear fields unchanged; V1+V7 centre and warm edge located within one grid length under 7 rotations; V7 translation (lat/lon shifts incl. 141°E) and N→S latitude order; V7 warm/cold type from advection (3 orientations, mean advection −U ΔT/W within 2 %); V7 a moving front (10 m/s, 6 h) moves 216 km; V7 symmetric smoothing keeps the centre; V1 50° N regional case | ERA5 Ciarán 850 hPa, 18 UTC 1 Nov 2023, `locate="centre"`: cold front crosses 48.5° N at 12.713° W (377 km piece); 2° W of it colder than 2° E by > 2 K | analytic, symbolic, converged, limit | PASS |
| F10 | `diag.climatology.calendar_day`, `daily_climatology`, `band_share` | V1 known dates and agreement with a pandas `dayofyear` route on 1991–2020; V1 annual cosine: pooled mean = count-weighted window mean Σ n_j f(j)/Σ n_j (n_59 = 38 with the 8 leap days) for w = 1, 15, 31 (atol 1e-12), pool sizes equal Σ n_j, pooled q90 equals numpy on an independently built pool; zero-width band (inclusive share 1.0) only for w = 1; V1 w = 1 band share = (364·24 + 30)/10958 exactly; V1 pooled coverage vs exchangeability theory (each pool member inside with probability (⌊0.9(N−1)⌋ − ⌈0.1(N−1)⌉ + 1)/N: 360/450 = 0.8, 366/458 for pools with day 59) → **0.79996**, seeds 1–3 give 0.80005, 0.80042, 0.80078 (within 5 SE); V7 ≈ 0.8 ± 5 SE (former xfail, now passes); V7 circular window across 31 Dec / 1 Jan; xarray = pandas input | Brest 2023 share **0.7863 = 287/365** (CHECK W35), confirmed by an independent pandas recount of the ±7-day pools (287 inside); Brest base-period share 0.8038 | analytic, limit | PASS |
| F11 | `atmos.lapse_rate_tropopause` (+ `igra.wmo_tropopause` delegation) | V1 USSA-1976 → 11 000.000 m / 216.65 K at dz = 50, 100, 250 m; V1 agreement with an independent dense (1 m) re-implementation of the WMO rule on 40 random profiles; V7 isothermal → base; steady 6.5 K/km → none; both sides of 2 K/km (1.999 / 2.001); exactly 2 K/km → its base, (0 m, 250 K) and (0 m, 288.15 K), on 100, 250 and 37 m grids (the raw layer lapse does exceed 2e-3 by round-off there), while 2.00001 K/km → none; thin 500 m layer rejected by the 2 km rule; deep low layer found without and skipped with p ≤ 500 hPa; level order and NaNs; delegation smoke | IGRA 2023-11-01 00 UTC on `z_hyps`: Trappes 10 882.78 m / −62.70 °C, Singapore 16 163 m / −81.30 °C (both = stored product values; both reproduced by the dense re-implementation) | analytic, limit | PASS |

Mutation check (lesson ch01): 20 wrong variants patched into a scratch copy of `fluidpy/`; **all 20 are caught**
(sign of (18.28), R^v = 461.5, dew-point sign, (1 + ε) in (18.11), R/c_p exponent and no-q-conservation in the LCL,
direction-to, components sign, +z_s and lapse sign in the reduction, missing 2 km check, Kundu/met sign confusion,
1853 m mile, missing cos ϑ, TFP sign, advection sign, σ = FWHM, 29 Feb → 60, non-circular smoothing, exclusive band;
the last one was caught only after adding the zero-width-band row).

Round 2 mutation set (pooled F10 and the F11 allowance): **8 of 8 caught**: 29 Feb → 60 (4 tests fail), window ±w
(6), strict `<` window edge (6), non-circular distance (3), modulus 366 in the circular distance (3), exclusive band
(1), F11 allowance removed (1), F11 allowance widened to 1e-4 (1).

## Functions used by the movie builder (design Part C) — test name each
| Function | Tests |
|---|---|
| `saturation_vapour_pressure` | `test_es_V1_reference_point_and_closed_form_values`, `test_es_V2_derivation_integrates_clausius_clapeyron`, `test_es_V5_bolton_1980_within_2pct_from_minus4_to_35C`, `test_es_V5_bolton_minus10_to_minus4C_departure_is_the_caption_constants` |
| `dew_point` | `test_dew_point_V1_round_trip_and_reference`, `test_dew_point_V2_symbolic_inverse_of_18_28` |
| `relative_humidity` | `test_rh_V1_movie_number_and_definition`, `test_rh_V7_saturation_and_dew_point_identity` |
| `specific_humidity`, `vapour_pressure_from_q` | `test_q_V1_movie_number_and_inverses`, `test_q_V2_derivation_of_18_11_from_mass_and_mole_fractions` |
| `lifting_condensation_level` | `test_lcl_V1_movie_case_and_state_at_lcl`, `test_lcl_V1_espy_rule_within_5pct`, `test_lcl_V3_independent_parcel_march_converges_second_order` |
| `wind_direction_from`, `wind_components` | `test_wind_direction_V1_compass_points_and_movie_number`, `test_wind_direction_V7_round_trip_and_rotation_equivariance` |
| `KNOT`, `NAUTICAL_MILE` | `test_knot_nautical_mile_V1_definitions_and_movie_numbers` |
| `sea_level_pressure` | `test_slp_V1_isothermal_closed_form_and_movie_number`, `test_slp_V1_hypsometric_route_2_166` |
| `thermal_front_parameter`, `front_fields`, `front_lines` | `test_tfp_V1_V3_latitude_front_second_order`, `test_front_lines_V1_centre_and_warm_edge_under_rotation`, `test_front_lines_data_ciaran_cold_front_crosses_48p5N_west_of_brittany` |
| `daily_climatology`, `band_share` | `test_climatology_V1_annual_cosine_pooled_mean`, `test_climatology_V1_pooled_band_coverage_matches_exchangeability_theory`, `test_band_share_data_brest_2023` |
| `lapse_rate_tropopause` / `igra.wmo_tropopause` | `test_tropopause_V1_standard_atmosphere_11km`, `test_tropopause_V7_exactly_2K_per_km_is_at_most_2K_per_km`, `test_tropopause_data_igra_trappes_and_singapore` |

## Convergence studies
| Scheme | Grids | Observed order | Design order |
|---|---|---|---|
| e_s: centred FD of the library vs (18.27) | h = 1, 0.5, 0.25, 0.125 K | 2.000 | 2 |
| LCL: independent explicit-midpoint parcel march → library root | h = 80 … 5 m | 2.004 (error 2.1e-4 m at 5 m) | 2 |
| LCL: same with Euler on ln p | h = 80 … 5 m | 1.037 | 1 |
| TFP, latitude tanh front (W = 1.5°) | 0.4, 0.2, 0.1, 0.05° | 1.951 (rel. error 2.0e-3) | 2 |
| TFP, longitude tanh front at 20–70° N (W = 1°) | 0.1, 0.05, 0.025° | 1.990 (rel. error 1.1e-3) | 2 |

## Conservation / invariant residuals
q conserved through the LCL ascent: rel 1e-12. Saturation at the LCL: rel 1e-9 (root `xtol` 1e-6 m). Wind round trip:
1e-10°. Sea-level reduction ↔ (2.166) thickness: rel 1e-12.

## Benchmarks used
| Benchmark | Value | Ours | Source | Verified |
|---|---|---|---|---|
| Bolton (1980) Eq. (10) e_s | 6.112 exp(17.67t/(t + 243.5)) hPa | max 1.99 % (−4…35 °C); 3.45 % at −10 °C (explained by the caption constants) | Mon. Wea. Rev. 108, 1046–1053, doi:10.1175/1520-0493(1980)108<1046:TCOEPT>2.0.CO;2 | 2026-10-27 |
| Knot / nautical mile | 1852/3600 m s⁻¹; 1852 m | exact | BIPM SI Brochure (non-SI units) | 2026-10-27 |
| USSA-1976 tropopause | 11.000 km, 216.65 K | 11 000.000 m, 216.65 K | NASA-TM-X-74335 | 2026-10-27 |
| WMO (1957) tropopause rule | definition | independent dense re-implementation agrees (40 random profiles, 2 soundings) | WMO Bulletin 6, 134–138 | 2026-10-27 |
| Espy rule | ≈ 125 m/K | 126.6 m/K (derived), library within 2.9 % for ≤ 15 K | re-derived (V2) | 2026-10-27 |
Rows recorded in `reference/ch00/SOURCES.md` (section "ch00_weather_basics").

## Numbers from the text
No V6 private book values for this movie (the movie's numbers are our own computations; the e_s constants are the
caption's and are in the public library as parameters, as before). Not run.

## Figures reproduced with our code (local, `outputs/ch00/verify/`)
| Figure | File | Verdict |
|---|---|---|
| e_s (18.28) vs Bolton and the departure | `es_vs_bolton.png` | The dashed (18.28) curve sits on Bolton's; the departure leaves the ±2 % band only below −4 °C and rises to ~7 % at −20 °C, as stated. |
| LCL vs Espy | `lcl_vs_espy.png` | Four LCL lines (5–35 °C) lie on the 125 m/K line up to 20 K, fanning by about 3 %. |
| Ciarán fronts, ERA5 850 hPa 18 UTC 1 Nov 2023 | `ciaran_fronts_1101T18.png` | A long cold front runs south-west from Biscay; its northern piece hooks round the low and crosses 48.5° N at 12.7° W (white dot); warm fronts (red) lie to the north-east, all along strong T850 gradients. |
| Brest 1991–2020 band and 2023 | `brest_climatology_2023.png` (round 1, curve-smoothed method; not redrawn for round 2) | The band follows the seasonal cycle (8 °C in winter to 17 °C in summer); 2023 runs mostly at or above the mean, with the September heat outside the band. |
| IGRA soundings with the WMO tropopause | `igra_tropopause.png` | The circles sit at the kinks: Trappes near 10.9 km / −63 °C, Singapore near 16.2 km / −81 °C. |

## Deviations & justifications
* F1 V5 is split as the implementer asked: −4…35 °C at the planned 2 %; −10…−4 °C by a **derived** bound (log-triangle
  inequality with Bolton-anchored constants), not a widened tolerance.
* F8 with a lapse rate uses the closed-form linear-T column (`core.statics.linear_lapse_pressure`) instead of the plan's
  "column mean temperature": a better choice, verified against an independent ODE solve.
* F11 on the IGRA product is run on `z_hyps` (reported + hypsometrically filled heights), which is what the product's
  `wmo_trop_z` used; see Open item 2.
* Two of my own tests were corrected after their first run (no tolerance on a library value was changed): the
  exactly-2 K/km profile was decided by round-off and became a 1.999/2.001 pair (round-1 Open item 3; round 2 adds the
  exact-threshold test after the implementer's allowance); a 500 m surface inversion
  correctly fails the 2 km rule, so the p-filter case now uses a 2.5 km low isothermal layer. The lapse → 0 limit row
  now asserts the analytic first-order coefficient instead of a guessed 1e-7.

## Open items
1. ~~F10 claim false~~ **Resolved in round 2.** Round 1 found that smoothing the per-day quantile curves gave a band
   holding 0.769 of days (theory) / 0.770 (Brest base period), not 0.80. The pooled-window method now gives 0.79996 in
   theory, 0.8000–0.8008 on seeded noise and 0.8038 on Brest's base period. CHECK W35 is now 0.7863 (287/365) for Brest
   2023, to be compared with the base-period 0.80. The narration and CHECK W35 range must follow the new number (not
   0.7534).
2. **F11 pitfall (data, not code).** On the IGRA product's mandatory-level `z` alone, Trappes gives 10.31 km / −58.3 °C
   (pinned by `test_tropopause_data_trappes_needs_filled_heights`); the 10.88 km / −62.70 °C value needs `z_hyps`. Any
   builder or notebook must pass `z_hyps`.
3. ~~F11 round-off~~ **Resolved in round 2:** a relative allowance of 1e-9 accepts an exactly-2 K/km profile at its
   base and still rejects 2.00001 K/km; pinned by `test_tropopause_V7_exactly_2K_per_km_is_at_most_2K_per_km` and two
   mutants (allowance removed / widened to 1e-4).
4. Bolton's 0.1 % accuracy statement was confirmed from secondary sources only (formula identical in two); the 2 %
   test does not depend on it.
5. F9's Ciarán crossing lies on a 377 km piece (the hooked northern end of the cold front), not on the 2626 km main line,
   which stays south of 48.0° N at 18 UTC; the movie text should not say "the main cold front crosses 48.5° N".

## Test runs
| Run | Command (cwd) | Result |
|---|---|---|
| New tests | `pytest tests/geo/test_moist.py tests/geo/test_atmos_weather.py tests/diag/test_fronts.py tests/diag/test_climatology.py tests/data/test_igra.py` (fluidpy) | **73 passed, 1 xfailed** (31.6 s) |
| Docstring examples | `pytest --doctest-modules` on the four changed modules | 16 passed |
| Full fluidpy suite, run 1 | `pytest -q -n 8 "../Fluid Dynamics/tests"` (cwd AOFD) | 12 failed, 2458 passed, 1 xfailed (24:54). All 12 are ch10/ch11/ch13 Kundu data tests that open reference files relative to the cwd (`FileNotFoundError: reference data 'ghia1982_table1.csv'`): a working-directory artefact, not a regression. `test_ch09` sympy test passed. |
| Full fluidpy suite, run 2 | `pytest -q -n 8 tests` (cwd `../Fluid Dynamics`, as instructed) | **1 failed, 2469 passed, 1 xfailed** (14:13). Failure: `tests/test_ch06.py::test_half_body_V1_stagnation_body_and_width` (passed in run 1 and passes alone); `test_ch09` sympy test passed. |
| AOFD suite | `pytest -q -n 8 tests` (cwd AOFD) | **16 passed** (19.0 s) |
| **Round 2: new tests** | same five files (fluidpy) | **75 passed** (no xfail); doctests of `climatology.py`, `atmos.py`: 7 passed |
| **Round 2: full fluidpy suite** | `pytest -q -n 8 tests` (cwd `../Fluid Dynamics`) | **1 failed, 2471 passed** (18:15). Failure: the known ch06 half-body flake again (same line 570, same draw with the NaN point inside the body). The ch09 sympy test passed. |

### Kundu flakes found (pre-existing, unrelated to F1–F11; Kundu code and tests not edited)
* **`test_ch06.py::test_half_body_V1_stagnation_body_and_width` — order-dependent random draw.** The test draws 20
  points from the module-level `RNG = np.random.default_rng(6)` that the module's other tests share, so the draw
  depends on which tests xdist ran first on that worker. `PF.half_body(1.3, 2.0).phi` is NaN inside the solid body by
  design (checked: NaN at (1.5, 0.5), finite at (1.5, 1.0)); 46.5 % of 20-point draws from successive states of that
  generator hit the body, and then `np.allclose(fl.phi(x, y), U x + (m/2π) ln r, atol=1e-12)` fails on the NaN (failing
  point near x = 1.48). Fix (for the Kundu owner): a local `default_rng` in the test, or draw y above h_max = m/(2U).
* **`test_ch09.py::test_sympy_engines_V2_thwaites_jets_cylinder_and_derive_all` — intermittent stall in sympy.** It
  passed in both full runs and alone (11–17 s for PYTHONHASHSEED 0–7). Under load it stalls: of 8 concurrent runs, 2
  (seeds 0, 1) had not finished after > 20 min in a first batch; in a second batch with `faulthandler_timeout=150`,
  3 (seeds 1, 5, 7) were stuck while 5 passed in 26 s. All three tracebacks end in the same call:
  `fluidpy/ch09_boundary_layers.py:187 thwaites_sympy → sp.dsolve(ode_n, Zn) → ode.py:640 dsolve → _helper_simplify →
  odesimp (ode.py:1635) → simplify (simplify.py:616)` (seed 5 reached it through `derive_all`, line 484). The same
  PYTHONHASHSEED passes alone, so the hash seed does not decide it. Hypothesis: the hash of the undefined-function
  class `sp.Function("Zn")` is id-based, which makes set/dict ordering depend on memory layout and sometimes sends
  `odesimp` down a very slow simplification branch. Under `-n 8` this shows up as a failure or timeout. Fix (Kundu owner):
  `sp.dsolve(ode_n, Zn, hint="1st_linear", simplify=False)` or the closed form from the integrating factor already in
  the function.

## Verdict: PASS for F1–F11; full-suite rule not met only by a pre-existing Kundu flake
Round 2 resolves both round-1 findings: F10 now meets its ≈ 80 % claim (theory 0.79996, seeded 0.8000–0.8008), and F11
accepts an exactly-2 K/km profile. Every computable item has ≥ 2 independent levels, and 28 mutants are caught in
total (20 in round 1, 8 in round 2). The full fluidpy suite still has 1 failure, `test_ch06.py::test_half_body_V1_stagnation_body_and_width`.
It is a pre-existing order-dependent RNG flake in a Kundu test that this work does not touch; the orchestrator asked
for it to be reported, not edited. Strictly by the rule "all tests pass in both repos", the chapter-level verdict stays
**FAIL until that Kundu test is fixed**; the F1–F11 library work itself is **PASS**.

Function verdicts: F1 PASS · F2 PASS · F3 PASS · F4 PASS · F5 PASS · F6 PASS · F7 PASS · F8 PASS · F9 PASS ·
F10 PASS · F11 PASS.

Round-1 verdict, superseded: FAIL (F10 coverage claim false; suite not green).
