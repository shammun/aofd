# ch00_coordinates — brief (movie-director, 2026-10-28)

Series plan v2 (APPROVED, `movies/ch00/series_plan_v2_proposal.md`), **Stage 1 · #5 "Coordinates: on a plane, a cylinder and
a sphere"**: polar, cylindrical, spherical and curvilinear coordinates, rotation of axes, the Galilean transformation,
latitude-longitude geometry. It may use only the movies above it (#1a, #1b, #2, #3, #4 and Stage 0: 0.1/0.1b dot product,
0.2 cross product, 0.3 weather basics) and it **stands on its own**: the dot product (components as projections), the chain
rule (s13) and the wind "from" convention are named in a sentence where they are used. The F4 sphere-geometry and projection
library work (`fluidpy.geo.sphere`, `fluidpy.geo.mapproj`, plan of `ch00_reading_weather_maps`) is reused here, as the
series plan says ("kept for #5 (sphere geometry) and #69").

House style `movies/HOUSE_STYLE.md` is binding: s00 opening title + one sentence → hook question → building blocks →
intuition → why ("three good reasons", s28) → applications → "To sum up" recap → series end card. Voice Kokoro `af_bella`
×1.0, informal Chapter-0 voice, `[beat]` holds after worked calculations, no headings except the title, keywords on screen,
no references, badges or URLs, type floor 44 px, caption band y 880–1040 empty, its own music score (`compass-orbit`, new).
Memory rules: no equation labels or footnotes on screen; every new symbol explained in words; standard terms ("air parcel",
"tangential wind", "radial wind", "inflow angle", "storm-relative wind", "great circle", "rhumb line", "conformal",
"equal-area", "metric terms", "scale factor", "Galilean transformation").

## Audience
First-year calculus, no climate background. Defined at first use: origin, axes, coordinates, Cartesian, unit vector,
polar coordinates, compass bearing, wind direction "from" (recalled), radian, arc length, r hat / theta hat, air parcel,
radial / tangential wind, eye, eyewall, inflow angle, vorticity (named), centripetal acceleration (shown as v²/r, the word
not needed), cylindrical coordinates, spherical coordinates, latitude, parallel, colatitude, longitude, meridian, prime
meridian, graticule, position vector, spin rate Omega, nautical mile (recalled), reanalysis / ERA5 (recalled), grid box,
local east-north-up frame, right-handed (recalled), metric terms, curvilinear coordinates, scale factor, gradient (named),
great circle, rhumb line, projection, plate carrée (described, not named), Mercator, conformal, Tissot circles (drawn, not
named), equal-area, Equal Earth, stereographic polar view (described), stratosphere (recalled), 10 hPa surface, polar
vortex, rotation of axes, rotation matrix, direction cosine, along-shore / across-shore, storm surge, frame of reference,
Galilean transformation, advection (recalled), storm-relative wind, barometer, pressure tendency.

## The promise (s00)
"In this video, we'll learn coordinates on a plane, a cylinder and a sphere the easy way, and see how meteorology uses them
to measure the winds round a hurricane's eye, and to find distances and directions on our round Earth."
Title 'Coordinates' / 'made easy' / 'and how meteorology uses them' (application word in teal).

## Real moments carry the movie (all on disk; numbers computed 2026-10-28 with tested fluidpy functions)
1. **Hurricane Ian, 18 UTC and 20 UTC, 28 September 2022** (HRRR 3-km analysis, GOES-16 image, IBTrACS best track; the
   cross-product movie's world). Ring 25 km round the HRRR pressure centre (960.3 hPa): tangential 37.1 m/s, radial
   −12.5 m/s, inflow angle 18.6°, v²/r 0.055 m/s²; best track 135 kt. Coast along/across at Fort Myers Beach 20 UTC: 32.9 m/s
   from the SW, 9.4 along, 31.6 onshore; St. Petersburg (Tampa Bay) +11.5 m/s offshore.
2. **Brest, Trappes, Longyearbyen (Svalbard), Singapore** on the globe: 1° of longitude 111.2 / 73.8 / 22.7 km; ground speed
   465 / 309 / 95 m/s; ERA5 box 27.8 × 18.5 km at Brest, 27.8 × 5.7 km at Svalbard; up vectors Brest–Trappes 4.3°,
   Brest–Singapore 101°.
3. **London → Los Angeles**: central angle 78.8°, great circle 8761 km, initial bearing 312°, vertex 62.3° N 49.1° W (west
   coast of Greenland); rhumb line 9733 km at 258° (+11 %, 972 km).
4. **The 10 hPa polar vortex, 6 January 2014** (NCEP/NCAR R1, on disk): 28.1 km near the centre (78.7° N 43.8° W), 30.9 km
   zonal mean at 30° N; geostrophic zonal-mean wind at 60° N 54 m/s; rms(radial)/tangential 0.87 about the pole vs 0.42
   about the vortex centre (2000 km ring). D1 refreshes it with the newest winter (series rule: latest data).
5. **Storm Ciarán, 21 UTC 1 Nov → 06 UTC 2 Nov 2023** (ERA5 hourly, tracked by continuity from 52.5° N 1.75° E — the
   storm-tracker rule): motion 14.6 m/s towards 71° (the user's "15 m/s" storm); 200-km ring at 03 UTC: ground-relative
   south 18.8 / north 8.4 m/s; ring means v_t 14.1 vs 13.8, v_r −6.0 vs −5.9 m/s (ground vs storm-relative); Brest gust
   84 kt (ISD); Plymouth 00 UTC: ∂p/∂t −3.82 hPa/h, sliding pattern −3.21, storm changing −0.61.

## What is taught (in order; 48 scenes)
| Block | Scenes | Idea | Real data / tested function |
|---|---|---|---|
| Title, hook | s00–s01 | promise; question | Ian HRRR ring, globe morph |
| Plane | s02–s10 | origin, axes, Cartesian (constant x̂, ŷ); polar (5 km, 53°) and back; maths angle vs bearing vs "from"; radians and s = rθ (1 km / 10 km); r̂, θ̂ depend on place; dr̂/dθ = θ̂, dθ̂/dθ = −r̂ (the unit-circle tip argument); (6, −8) components of an east wind by dot products | `core.coords.*`, `geo.atmos.wind_components` |
| Hurricane in polar | s11–s13 | radial / tangential round Ian's eye (37, −12.5 m/s); why polar (jumpy u, v vs steady v_t, v_r; inflow 19°); **why turning unit vectors matter**: steady spin still accelerates, −v²/r r̂ by the chain rule (0.055 m/s², ~1/180 g, supplied mostly by pressure) | `diag.cyclone.storm_centre`, `storm_relative_wind` (HRRR) |
| Cylinder | s14 | (r, θ, z); ẑ constant; inflow low, outflow aloft | D2 ERA5 pressure levels; `core.coords.unit_vectors_cylindrical` |
| Sphere | s15–s26 | spherical coords; latitude φ (and colatitude), longitude λ (0–360 trap), graticule; position vector by "polar coordinates twice" (Brest 4760 / 4230 km); **a cos φ is a cylindrical radius** → ground speeds 465/309/95/0 m/s; **δy = a δφ** (111 km per degree, nautical mile); **δx = a cos φ δλ — why the cos φ** (Brest 74, Svalbard 23 km); ERA5 boxes thin to the poles; dA = a² cos φ dφ dλ → half the Earth between 30° S and 30° N, cos-weighted means; local ENU frame (2.29) at Brest / Trappes / Singapore; **why i, j, k turn as you move** (eastbound plane 12°/h; (2.39)); metric terms (2.45) sized (1.6 × 10⁻⁵ vs Coriolis ×65) | `geo.sphere.*`, NEW F1 `enu_basis`, NEW F2 `unit_vector_rates`, `metric_terms`, NEW F3 `band_area` |
| Curvilinear | s27 | three shared features; scale factors (r; a, a cos φ); gradient (2.31) named; pressure as a curvilinear vertical coordinate (pointer) | `core.curvilinear.scale_factors`, `geo.sphere.gradient` |
| Why | s28 | three good reasons: shape, measurement, meaning | — |
| Maps | s29–s36 | great circle by the dot product of position vectors (London–LA); rhumb line +11 %; flattening (gores → plate carrée, stretch 1/cos φ); Mercator conformal, y = a ln tan(π/4 + φ/2) checked by its slope a/cos φ; area ×1/cos²φ (4×, 24×), Greenland vs Africa (14×); Equal Earth (shapes skew ≥ 30° at 60° N); pick the map for the job; polar view = polar coordinates; the 10 hPa polar vortex; eastward = tangential round the pole, northward = −radial; choose the origin (vortex centre) | `geo.sphere` (great circle, rhumb), `geo.mapproj` (gores, platecarree, mercator, equalearth, polar_stereographic, tissot), `geo.atmos.geostrophic_wind_from_height`; NCEP R1 |
| Rotation of axes | s37–s40 | x′ = x cos α + y sin α … by dot products (8.7, −5); rotation matrix, direction cosines, x′_j = x_i C_ij; **polar components are a rotation by θ** (6, −8 again); along/across the SW Florida coast (9.4 / 31.6 onshore); storm surge 10–15 ft (cited) vs Tampa Bay drained (sign flip; tide gauges D3); along-shore → Ekman pointer | `core.tensors.rotation_matrix_2d`, `geo.vectors.components_in_axes`, NEW F5 `data.coops` |
| Galilean | s41–s45 | u = U + u′, x = x′ + Ut, t = t′ (train 21.5 m/s); **why accelerations are unchanged** (dU/dt = 0; ball on the train; (K 3.9): local + advection split differs, sum does not); rotating frames are not Galilean (Coriolis pointer); Ciarán at 15 m/s: ground-relative asymmetry (19 vs 8), storm-relative winds; ring-mean spin and inflow unchanged (why: a uniform flow adds nothing round a circle); Brest gust 84 kt; fixed barometer at Plymouth: −3.8 = −3.2 (sliding, (B.2.2)) − 0.6 (storm changing) | `core.kinematics.galilean_transform`, `acceleration`; NEW F4 `track_by_continuity`, `translation_velocity`; `diag.cyclone.storm_relative_wind`; `geo.sphere.gradient` |
| Recap, end | s46–s47 | "To sum up, …" one beat per sentence; maths-tutorial end card with the related-movies row | — |

## Ending
**Maths ending** (HOUSE_STYLE §3), as in #4: this is a Stage-1 maths-toolkit movie. Open question below.

## Deliberately left to later movies (pointed to, never depended on)
- **The gradient on the sphere** (#6): only the eastward slope with its 1/(a cos φ) is shown (s27).
- **Vorticity and circulation** (#8): the hurricane's spin is named "vorticity" (s12) only.
- **Material derivative** (#10): the fixed barometer's two parts are shown with numbers (s45), not derived for parcels.
- **Coriolis and rotating frames** (#29), **the full momentum equations and their metric terms** (#29A): s19, s26, s42 only
  preview and size them.
- **Gradient / cyclostrophic wind** (#30): v²/r is computed, the balance is named only.
- **Ekman transport and upwelling** (#31), **storm surge physics** (#45), **the stratosphere and sudden warmings** (#49),
  **reading real weather charts** (#69): pointers.

## Length
Set by the teaching. Measured in the dry run: see `script.md` (top) and `storyboard.yaml` (`dry_run`).

## Cross-references (user rule 2026-10-27)
Spoken pointers: vectors (s03, s08, s38), dot product (s10, s29, s37, s45), cross product (s24), weather basics (s06, s20),
derivatives (s13, s32), curl (s12), gradient wind (s13), Coriolis (s19, s42), equations of motion (s26), gradient (s27),
pressure coordinates (s27), reading weather maps (s34), stratosphere (s36), Ekman (s40), material derivative (s45). End card:
titles only. `related:` per scene in the storyboard.

## Open questions for the orchestrator
1. Ending: maths ending (planned, as #4) or the weather/climate ending (its applications are all weather)?
   Recommendation: maths ending, for consistency within Stage 1, unless the user switched #4.
2. Latest data: the polar-vortex scene uses 6 Jan 2014 (on disk). D1 fetches NCEP R1 10 hPa daily heights (and winds) for
   the newest complete winter (2025–26) and the build picks the day with the strongest vortex (largest zonal-mean 60° N
   wind); s35–s36 are re-worded and re-measured to that date. Recommendation: do D1 (37 kB per day, open).
3. s40 depends on D3 (NOAA CO-OPS tide gauges Fort Myers 8725520, St. Petersburg 8726520) and on the research-scout
   confirming the NHC report's "10–15 ft above ground at Fort Myers Beach". Without D3, sentence 7 becomes "the wind pushed
   the water away from that coast" (no claim that the level fell).
4. Music: add the new style `compass-orbit` (spec in the storyboard) to `tools/sound/styles.py`; runner-up `ice-polar`.
5. s14 outflow sign: D2 (ERA5 pressure levels for Ian, ~0.4 GB network for one hour × 3 variables, ~2 MB product) or keep the
   sentence generic with illustrative arrows. Recommendation: fetch D2 (the sign is then from data).

## v2 (2026-10-30): HOUSE_STYLE §5b amendment
- Every scene has a `layout_5b` field (it overrides the v1 `visual` where they differ): GlobeFrame and the v5 zoom-reveal numbers on every globe zoom, source lines below pictures, colour bars beside maps, readouts off images, animated winds, column edges to the top, no extra titles.
- s11 (zoom tour round the eye: surroundings + zoom back out) and s24 (zoom-reveal at Brest: surroundings + zoom back out) gained two sentences each.
- **New s14b_ian_stack**: Ian's ERA5 radial wind on 5 layers (975, 850, 500, 200, 125 hPa; inflow low, quiet middle, outflow aloft), hover from outside, one short close look, colour bar beside (data committed; numbers in data_needs.md §G).
- Measured: 48:41.8 (was 46:51.3), 49 scenes, 6910 words, 142.0 words per minute.
