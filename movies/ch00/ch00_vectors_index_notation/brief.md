# ch00_vectors_index_notation — brief (movie-director, 2026-10-27)

Series plan v2 (APPROVED, `movies/ch00/series_plan_v2_proposal.md`), **Stage 1 · #1 "Vectors, components and index
notation"**. It comes after the dot-product and cross-product movies in production, but it is the first maths movie in
the viewing order, so it **stands on its own**: the dot and cross products it needs are defined inside it (briefly,
with one worked example each), never "as we saw in the last video". It reuses their visual language (teal first vector,
orange second, violet cross-product result, gold links, shadow bands, parallelogram, right-hand rule glyph, CalcStack).

House style `movies/HOUSE_STYLE.md` is binding: s00 opening title + one sentence → hook question → building blocks →
intuition → why ("three good reasons") → application → "To sum up" recap → series end card. Voice Kokoro `af_bella`
×1.0, informal Chapter-0 voice, no headings except the title, keywords on screen, no references/badges/URLs, type floor
44 px, caption band y 880–1040 empty, a different music score for this movie.

## Audience
First-year calculus, no climate background. Every word is defined at first use and then used consistently: scalar,
scalar field, vector, vector field, unit vector, basis, component, magnitude, position vector, index, free index,
dummy index, summation convention, dot product, gradient, partial (derivative), air parcel, advection, warm advection,
isotherm, warm front, reanalysis (ERA5), universal time, Kronecker delta, alternating tensor / permutation symbol,
tip to tail, parallelogram, negative vector, difference vector, jet stream, airspeed/ground speed, isobar, hectopascal, geostrophic and ageostrophic wind, friction, wind shear, sounding, hodograph, veering, climatology, anomaly, trade winds, El Niño, relative velocity, cross product, right-hand rule, Coriolis effect, radian, latitude, epsilon–delta relation, parallelepiped, flux
(volume crossing a surface each second), atmospheric river, centrifugal effect.

## The promise (s00)
"In this video, we'll learn vectors and index notation the easy way, and see how meteorology uses them to write the
wind, the warmth it carries, and the push of Earth's spin in a few short symbols."

## One real moment carries the whole movie
**18 UTC, 1 November 2023, Brest (48.45° N, 4.42° W), as Storm Ciarán's warm air arrived** — the same storm and town as
`ch00_weather_basics` and `ch00_reading_weather_maps`, so the series feels like one world, but nothing from those
movies is assumed.
- Station (ISD/SYNOP Brest-Guipavas 07110, on disk): wind from 150° at 9.3 m/s, 10.3 °C; 20 UTC: 210° 13.4 m/s,
  14.9 °C (warm front passes).
- ERA5 850 hPa (on disk, grid point 48.5° N 4.5° W): T 5.1 °C, u 5.8, v 33.5 m/s, |u| 34.0 m/s, q 6.5 g/kg;
  ∂T/∂x −3.20, ∂T/∂y −2.49 K per 100 km (0.25° and 1° differences agree: −3.17 / −2.50, so the number is robust);
  u·∇T = −1.02 × 10⁻³ K/s = −3.7 K/h (warm advection +3.7 K/h); ERA5 T over Brest 17 → 19 UTC: 2.4 → 8.2 °C
  (+2.9 K/h); 17 UTC wind (7.6, 23.3) for the free-index example.
- Ω at 48.45° N: (0, 4.84, 5.46) × 10⁻⁵ s⁻¹; −2Ω × u = (+3.66, −0.63, +0.56) × 10⁻³ m s⁻² (`core.rotating.coriolis_acceleration`);
  f = 1.091 × 10⁻⁴ s⁻¹; centrifugal Ω² a cos φ = 0.0225 m s⁻².
All planning numbers above were computed with the tested library on the files on disk (2026-10-27); the builder
re-asserts every spoken number in CHECK rows (data_needs.md §D).

## What is taught (in order; 71 scenes)
| Block | Scenes | Idea | Real data / tested function |
|---|---|---|---|
| Title, hook | s00–s01 | promise; question | Brest wind arrow + ERA5 map |
| Scalars | s02–s03 | scalar, unit, scalar field, invariance under turning | ERA5 2-m T globe; Brest station 10.3 °C |
| Vectors | s04–s05 | vector = size + direction; from-convention; vector field | Brest SYNOP wind; ERA5 850 hPa winds |
| Basis, components | s06–s09 | e₁ e₂ e₃ (east, north, up), components, easy (6, 8, 0) then real (−4.65, 8.05, 0) by sin/cos 330°; u, v, w; w ≈ 10 cm/s | `geo.atmos.wind_components`; ERA5 ω → w (NEW F1) |
| Magnitude | s10 | Pythagoras twice; \|u\| = 9.3 m/s = the reported speed | `geo.vectors.norm` |
| Other axes | s11 | components depend on axes, the arrow and its length do not: (5.8, 33.5) vs (11.5, 32.0) along/across the coast | `core.tensors.rotation_matrix_2d` + `transform_vector` |
| Position | s12 | x = x₁e₁ + x₂e₂ + x₃e₃ (K 2.1) | — (thought example) |
| **Addition** (user addition 2026-10-27) | s12a–s12d | tip to tail (airliner 250 + jet 50 = 300 m/s east, 200 west; latest GFS jet ≈ 70 m/s); parallelogram, order does not matter, component-wise sums, √(50² + 250²) ≈ 255; drifter = current + wind drift (inset); three forces on a parcel close to zero (3-4-5 numbers, consistent with Brest's 9.3 m/s); **real wind = geostrophic + ageostrophic** on Ciarán (48° N 6° W: (30.9, 24.9) + (−20.9, −6.9) = (10.0, 18.0)) | NEW D4 GFS 250 hPa (latest); A4 ERA5 msl/u10/v10; NEW F5 geostrophic from MSLP |
| **Subtraction** (user addition) | s12e–s12i | −q, p − q = p + (−q), "from q to p" ((5,1) − (1,3) = (4, −2)); wind change in one hour at Brest (−1.8, +10.2) as an animated map; **wind shear and the hodograph** from the real Trappes sounding (u₅₀₀ − u₈₅₀ = (2.5, −5.4), 5.9 m/s, veering → warm advection, pointer to thermal wind); **anomaly** = Nov 2023 − Nov 1991–2020 trade winds (≈ +2.5 m/s eastward, El Niño); **storm-relative wind** (Ciarán moving (20, 5) m/s; relative wind at Brest ≈ (−14, 28)) | IGRA2 Trappes (on disk); NEW D5 ERA5 monthly means; A4 storm track (`era5_arco.storm_centre`) |
| Index notation | s13–s18 | u_i; free index (three equations: the s12f wind change c_i = u_i(18 h) − u_i(17 h); adding/subtracting = component by component); dot product defined; Σ → Einstein convention (K 2.2); dummy index; at most twice; order = number of free indices; u_i u_i = \|u\|² | `core.index_notation.classify_indices`, `tensor_order`, `rename_dummy`, `expand_indices` |
| Why | s19 | three good reasons: short, safe, algebra becomes counting | — |
| Advection (application 1) | s20–s28 | ∂T/∂x_i, grad T; u_j ∂T/∂x_j built term by term; easy (−3.2 K/h) then real ERA5 (−3.7 K/h); sign → warm advection; check against ERA5 (+2.9 K/h) and the station (+4.6 °C in 2 h, warm front); u_j ∂u_i/∂x_j = nine terms | `geo.sphere.gradient`, `geo.vectors.dot`; NEW F2 advection |
| Kronecker delta | s29–s32 | e_i·e_j = δ_ij (K 2.16); δ_ij u_j = u_i (K 2.17); ∂x_i/∂x_j = δ_ij → (u·∇)x = u (B.3.4): the balloon drifts at the wind; δ_ii = 3 (B.3.1 idea); δ_ij p_i q_j = p·q | `core.tensors.kronecker_delta` |
| Cross product via ε (application 2) | s33–s43 | why (Coriolis push −2Ω × u, stated, derived in its own movie); cross product (K 2.20) + right-hand rule; ε_ijk (K 2.18), 27 cells, 6 non-zero; cyclic/swap moves; (p × q)_i = ε_ijk p_j q_k (K 2.21) written out; (5,1,0) × (1,3,0) = (0,0,14); swap order; Ω at Brest (Vallis 2.77 text); Coriolis easy (10 m/s north at 45°) then real; meaning (13 m/s per hour); global ERA5 field of pushes, right in NH, left in SH | `core.tensors.levi_civita`, `cross_einsum`; `core.gfd.earth_rotation_local`; `core.rotating.coriolis_acceleration`; `geo.vectors.k_cross` |
| ε–δ | s44–s48 | statement (K 2.19) + mnemonic; two cases by hand; 81 cases by computer; why it is true (counting argument); Lagrange identity derived one move per step, checked 196 = 260 − 64 | `core.tensors.epsilon_delta_residual` |
| Triple products (application 3) | s49–s59 | scalar triple = volume (ε_ijk p_i q_j s_k); parcel 10⁸ m³, ~10⁵ t; shear leans it, volume unchanged; volume flux through a window u·(q × p): easy 10⁹ m³/s, real slanted curtain Brest→Saint-Malo 5.9 × 10⁹ m³/s, 6 Mt air/s, ≈ 4 × 10⁴ t water/s (atmospheric rivers); vector triple derived via ε–δ (3 steps + result + check); k̂ × (k̂ × u) = −u (real wind); centrifugal −Ω × (Ω × r) = Ω² r⊥ (Vallis 2.13), 0.022 m/s², equatorial bulge 21 km | `geo.vectors.triple_scalar`, `core.tensors.triple_product`, `core.rotating.centrifugal_acceleration`; `geo.sphere.great_circle_distance`, `initial_bearing` |
| Recap, end | s60–s61 | "To sum up, …" one beat per sentence; maths-tutorial end card (HOUSE_STYLE §3, see open question Q1) | — |

## Deliberately left to later movies (pointed to, never depended on)
- **Where the Coriolis push comes from** (−2Ω × u derived, f = 2Ω sin φ): the Coriolis movie (#29). Here it is stated as
  a fact, with its direction computed by ε (s33 says so in one sentence).
- **The cross product in depth** (area proof, the three right-hand rules, torque): #2–#3. Here: definition, one rule,
  one worked example.
- **Gradient, divergence, curl** (#6–#8): ∂T/∂x_i and grad T are introduced only as "the change per metre going east /
  north / up" and "the arrow of fastest increase".
- **Material derivative** (#10): s23 says "if each parcel keeps its own temperature, the fixed thermometer's rate is
  −u_j ∂T/∂x_j" without D/Dt; the vertical term and adiabatic cooling are named, not treated (s22, s27).
- **Tensors** (#11): s17 states only "no free index = scalar, one free index = vector"; two free indices (u_i v_j, nine numbers) and the stress −p δ_ij are left to the tensors movie.

## Length
Set by the teaching; target band 25–45 min. **Measured (dry run v3, 2026-10-28): 3389.3 s narration + 2.5 s hold = 3391.8 s (56:32), 8434 words, 538 sentences, 836 cues, 149.2 words per minute overall — about 11.5 min OVER the 45-min ceiling** after the addition/subtraction block (+570 s) and the cross-reference pointers (+80 s). See the open question on length (keep as one movie, trim, or split after s32 at 32:43).

## Cross-references (user rule 2026-10-27)
Short spoken pointers wherever an operator is treated in depth elsewhere: coordinates #5 (s11), dot product #0.1 (s15), partial derivatives #4 and gradient #6 (s20), material derivative #10 (s23), thermodynamics #24 (s27), vector identities #10A/#10B (s28, s57), tensors #11 (s32), Coriolis #29 (s12c, s33, s59), cross product #2/#3 (s34), geostrophic wind #30 (s12c, s12d, s42), Ekman/friction #31 (s12c), thermal wind #32 (s12g), ENSO #62 (s12h), divergence #7 (s54). End card lists: dot product, cross product, cross product in physics, gradient, divergence, material derivative, vector identities I and II, tensors, Coriolis, geostrophic wind, thermal wind, El Niño (titles only). `related:` per scene in the storyboard. The movie still stands on its own.
