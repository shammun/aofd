# ch00_derivatives_taylor — brief (movie-director, 2026-10-28)

Series plan v2 (APPROVED, `movies/ch00/series_plan_v2_proposal.md`), **Stage 1 · #4 "Derivatives and Taylor series"**:
partial derivatives, the chain rule, the perfect differential, Taylor series, linearisation, plus the finite differences of a
weather-model grid. It may use only the movies above it (#1a, #1b, #2, #3, and Stage 0: 0.1/0.1b dot product, 0.2 cross
product, 0.3 weather basics), and it **stands on its own**: the one thing it needs from earlier movies (the dot product, for
u·∇T in s20) is named in a sentence, and hydrostatic balance and the gas law (weather basics) are restated before use.

House style `movies/HOUSE_STYLE.md` is binding: s00 opening title + one sentence → hook question → building blocks →
intuition → why ("three good reasons", s37) → applications → "To sum up" recap → series end card. Voice Kokoro `af_bella` ×1.0,
informal Chapter-0 voice, `[beat]` holds after worked calculations, no headings except the title, keywords on screen, no
references, badges or URLs, type floor 44 px, caption band y 880–1040 empty, its own music score (`tangent-glide`, new).
Memory rules: no equation labels or footnotes on screen; every new symbol explained in words; "air parcel".

## Audience
First-year calculus (the ordinary derivative is re-built in s02–s03 anyway), no climate background. Words defined at first use:
rate of change, derivative, limit, secant, tangent, slope, field, reanalysis (ERA5), partial derivative, centred difference,
gradient (named), fixed thermometer, hectopascal, pressure tendency, radiosonde, lapse rate (both sign conventions), mixed
partial derivative, total differential, chain rule, traveller's rate, air parcel, material derivative (named, handed on),
pressure as a vertical coordinate, state function, perfect (exact) differential, ideal gas law, density, kelvin, specific
volume, hydrostatic balance, scale height, exponential, heat and work as non-state quantities, internal energy, entropy,
potential temperature (named), Taylor series, factorial, tropopause, weather front, linearisation, water vapour, vapour
pressure, saturation, saturation vapour pressure, latent heat, Clausius–Clapeyron, black body, Stefan–Boltzmann constant,
emission temperature, Planck response, radiative forcing (in words: "adds watts per square metre of heating"), feedback, grid point, forward /
backward / centred difference, first- and second-order accurate.

## The promise (s00)
"In this video, we'll learn partial derivatives, the chain rule and Taylor series the easy way, and see how meteorology uses
them to follow a weather balloon's temperature, and to find how much more water vapour it takes to saturate warmer air."

## Two real moments carry the movie
1. **The map: 18 UTC, 1 November 2023, Brest, Storm Ciarán's warm air arriving** (the series world of 0.3, 1a and 1b).
   ERA5 850 hPa (on disk): T 5.12 °C; ∂T/∂x −3.20, ∂T/∂y −2.49 K per 100 km; ∂T/∂t +2.92 K/h; wind (5.85, 33.49) m/s;
   u·∇T −3.68 K/h, so DT/Dt ≈ −0.76 K/h. Brest SYNOP: 10.3 → 14.9 °C (18 → 20 UTC), slp 988.3 → 983.3 hPa (17 → 18 UTC).
2. **The balloon: 12 UTC, 30 September 2026, Trappes near Paris** — the newest IGRA2 sounding on disk, with the
   radiosonde's elapsed time on every level (series rule: latest data; D1 refreshes it at production). 850 → 500 hPa:
   1533 → 5795 m, 12.3 → −11.8 °C in 900 s: w 4.74 m/s, dT/dt −0.0268 K/s (−1.6 °C/min), ∂T/∂z −5.65 K/km; fixed-place
   change from the 00 UTC sounding −6 × 10⁻⁵ K/s; drift 16.6 km NNE. Surface 997.5 hPa, 19.8 °C: H 8570 m, 8.6 m per hPa;
   pressure Taylor series 343 → 558 → 511 → 517 hPa vs the measured 500 (499 with the layer-mean temperature); tropopause
   13.07 km.
All planning numbers were computed with the tested library on the files on disk (2026-10-28); the builder re-asserts every
spoken number in CHECK rows (`data_needs.md` §D).

## What is taught (in order; 49 scenes)
| Block | Scenes | Idea | Real data / tested function |
|---|---|---|---|
| Title, hook | s00–s01 | promise; question | Trappes profile + tangent zoom; Ciarán map |
| Derivative | s02–s03 | average rate (Brest station 2.3 °C/h) → limit → tangent; x² at 3: 7, 6.1, 6.01 → 6 | ISD; NEW F1 `secant_slopes` |
| Partial derivatives | s04–s10 | fields T(x, y, z, t); slice the landscape; the rule with easy numbers; real ∂T/∂x, ∂T/∂y (centred difference), ∂T/∂t (fixed thermometer; −5 hPa/h pressure tendency), ∂T/∂z (radiosonde, lapse rate both signs); mixed partials commute (x²t; ERA5 1.43 × 10⁻⁹; the four-corner reason) | ERA5 A1, ISD A2, IGRA2 A3; `geo.sphere.gradient`, `core.thermo.partial_derivative`, NEW F1 `mixed_partials` |
| Total differential | s11–s12 | dT = Σ slope × step; Like/Unlike a hillside; +0.63 °C near Brest | NEW F1 `total_differential` |
| Chain rule | s13–s21 | the traveller's rate (Kundu p. 858 display, index form); meaning and units; car on a frozen road −3 °C/h; plane east −8.6, west +14.4 °C/h; real balloon −1.6 °C/min, ~99 % from rising (terms sized); the air parcel → DT/Dt named (−0.8 °C/h), handed to #10; z → p by the chain rule (+0.069 °C/hPa) | NEW F1 `chain_rule_rate`, NEW F4 `ascent_rates`, `drift`; `diag.advection.advection` |
| Perfect differential | s22–s29 | state function (Like/Unlike a hill's height vs the distance walked, real ETOPO hill); the exactness test from equal mixed partials (y dx ± x dy; loop −2); p = ρRT exact, dp/p = dρ/ρ + dT/T (warm air 3.4 % vs 3.3 % lighter); hydrostatic balance → dp/p = −dz/H, H 8570 m → p₀e^(−z/H) vs the balloon; heat on three routes 27/33/40 kJ/kg, ΔI = 0; đQ fails, đQ/T passes → entropy (116 J kg⁻¹ K⁻¹ on all routes), potential temperature named | `core.thermo.path_heat_work_totals`, `perfect_gas_entropy_change`, `core.statics.*`; NEW F1 `exactness_residual`, `loop_integral` |
| Taylor series | s30–s36 | zoom until it's a line (real profile); first order 7.4 vs 6.9 and −8.4 vs −11.8; why h²/2 and 3!; e^h sums; pressure: the first term is hydrostatic balance (8.6 m per hPa; 880.4 / 887.3 / 887.0), the far step and the model error (517 vs 499 vs 500); where it fails (tropopause kink, fronts) | NEW F1 `taylor_polynomial`; `core.fd.taylor_table_sympy`; `igra.wmo_tropopause` |
| Why | s37 | three good reasons | — |
| Linearisation (applications) | s38–s43 | basic state + small disturbance; saturation in plain words (escaping and returning molecules balance; e_s set by temperature alone, not by the air); Clausius–Clapeyron (18.27) with L(0 °C) = 2.5 × 10⁶ J/kg → 7.3 %/K at 0 °C (6.4, 5.7 at 15, 30), line vs exact (7.3/7.5, 29/33 %); climate: +1.26 °C (2016–2025, Forster et al. 2026) → e_s ~9 % higher, observed near-surface vapour only ~4–5 % per °C (Allan et al. 2022), ERA5 water vapour rising since 1979 (checked from 1993 too), heavy rain projected ~7 %/°C (AR6 SPM B.2.4); σT⁴ → T_e 255 K, Planck response 3.8 W m⁻² K⁻¹, 2×CO₂ 3.9 W m⁻² → ~1 °C (AR6 3.2 → 1.2 °C), feedbacks, line vs exact (3.79/3.76; 40/38) | `geo.moist.saturation_vapour_pressure`, NEW F3 `cc_fractional_rate`, NEW F2 `geo.radiation`, NEW F5 `global_mean`, `linear_trend`; D3 ERA5 TCWV, D4 CERES |
| Finite differences (application) | s44–s46 | forward error (h/2) f″ and centred (h²/6) f‴ from Taylor; sin check −0.043 / −0.0009; ERA5 at Brest: −3.32/−3.09/−3.20 at 18 km, then −3.17, −3.14, −2.24, −0.98 as the grid coarsens; grid history: the 1950 first computer forecast 736 km, early climate models a few hundred km, the leading global forecast models today ~9 km (ERA5's 0.25° data grid is interpolated from its ~31 km model grid, said as "the data") | `core.fd.stencil_error`, `stencil_taylor_coefficients`, `fd_derivative` |
| Recap, end | s47–s48 | "To sum up, …" one beat per sentence; maths-tutorial end card with the related-movies row | — |

## Ending
**Maths ending** (HOUSE_STYLE §3, "series of related maths tutorials … atmospheric science, meteorology and fluid dynamics"):
this is a Stage-1 maths-toolkit movie, like 1a/1b, even though its applications are weather and climate. Option for the
orchestrator: switch to the weather/climate ending if the user prefers it for maths movies with climate applications (the
cross-product precedent).

## Deliberately left to later movies (pointed to, never depended on)
- **The material derivative** (#10): DT/Dt is named, its numbers computed once (s20), not derived for parcels.
- **The gradient** (#6): ∂T/∂x and ∂T/∂y are combined into "the gradient" by name only (s07).
- **Pressure coordinates** (#23A) and **coordinates** (#5): only the one-variable chain rule z → p (s21).
- **Thermodynamics, potential temperature, Maxwell relations** (#24): entropy appears as the integrating-factor result
  (s29); potential temperature named; Maxwell relations not shown.
- **Clausius–Clapeyron's derivation and moist processes** (#26): the equation is stated (Vallis (18.27)) and linearised, not derived.
- **Feedbacks and climate sensitivity** (#22, #67): only the Planck response is computed; feedbacks named.
- **Numerical methods on whole equations** (#14): only derivative stencils and their truncation error.

## Length
Set by the teaching. Measured in the dry run: see `script.md` (top) and `storyboard.yaml` (`dry_run`).

## Cross-references (user rule 2026-10-27)
Spoken pointers: weather basics (s26), the vectors movie (s13), the dot product movie (s20), gradient (s07), material
derivative (s20), pressure coordinates (s21), ODEs (s27), potential temperature / thermodynamics (s29), waves and stability
(s38), water in the air (s39), PDEs and numerical methods (s46). End card related row: coordinates (next), gradient, material
derivative, vectors and index notation, dot product, weather basics, pressure coordinates, ODEs, thermodynamics, water in the
air, climate machine, climate change (titles only). `related:` per scene in the storyboard.

## Open questions for the orchestrator
1. Ending: maths ending (planned) or the weather/climate ending?
2. D1: keep 2026-09-30T12 if a newer Trappes sounding lacks elapsed time, or switch station (a US RRS station always has it)?
   Recommendation: keep Trappes (the series' French world; IGRA2 2026 Trappes soundings carry etime).
3. Music: add the new style `tangent-glide` (spec in the storyboard) to `tools/sound/styles.py`, runner-up `sun-radiant`.
4. s28 uses a 50 % expansion so the three heat routes separate (27/33/40 kJ/kg); a realistic 5 % expansion gives routes within
   1 % of each other (planning check: 12.07/12.05/12.20 kJ/kg for 280 → 290 K, 0.80 → 0.85 m³/kg). Keep the large one, said as
   a thought experiment.

## Source check applied (2026-10-28, `research/ch00_derivatives_taylor_sources.md`)
| # | Scene | Change |
|---|---|---|
| 1, 2 | s41 | warming "about one and a quarter degrees" (1.26 °C, 2016–2025, Forster et al. 2026); "about nine percent" (DT54) |
| 3 | s00, s39, s40, s41, s43, s47, title | no "air holds water vapour": saturation = escaping and returning molecules balance; e_s depends only on temperature, "not on the air"; the rule is said as the saturation vapour pressure rising ~7 % per degree |
| 5 | s41 | heavy rain as a projection ("is expected to become … worldwide") |
| 8 | s43 | "adds about three point nine watts per square metre of heating" |
| 10, 11 | s46 | "the leading global forecast models today"; new line: the 1950 first computer forecast, grid points 736 km apart |
| 12 | s07, s46 | "the ERA5 data come on a grid every quarter of a degree … going east"; "the data points … going east" |
| 13 | s21 | balloons "have long reported pressure, and many of the equations become simpler that way" |
| 14 | s09 | "once or twice a day, at about eight hundred stations around the world" |
| 15 | s34 | "Pilots use this rule of thumb near the ground: about thirty feet for each hectopascal" (no altimeter claim) |
| 19 | s39, s40 | L = 2.5 × 10⁶ J/kg at 0 °C ("a little less for warmer water") → 0.073 per K; line vs exact 7.3/7.5 %, 29/33 % |
| 21 | s41 | new sentence: the rule is about saturated air; measured near-surface vapour rose ~4–5 % per degree (no claim that the observed rise equals the rule) |
| 4 | data | DT53 from 1979 and from 1993 |
| 7 | data | σ cited to CODATA 2022 |

