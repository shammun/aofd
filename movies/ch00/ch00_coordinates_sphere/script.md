# ch00_coordinates_sphere — narration (movie-director, 2026-11-05)

Series plan v6 **#5c, position 9**: "Coordinates, Part 3 — Our round Earth: latitude, longitude, distances and areas" (title updated by the coordinator 2026-11-05; spoken title stays short).
Split plan `movies/ch00/ch00_coordinates/split_plan.md` §2d (commit 73044df). House style `movies/HOUSE_STYLE.md` (binding).
Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice; our own words; maths spoken in words; `[beat]` = 1.5-s hold
after a worked calculation (not spoken, not captioned). Lines starting with ">" are notes and are not spoken; the README
uses `###` headings so that `tools/tts.py` does not read it as a scene.

### README

**Measured, not estimated** (`tools/tts.py` dry run, numbers block below).

**Scene list** (measured length per scene; w = words)

| # | Scene | One line | Length |
|---|---|---|---|
| 0 | s00_title | card "Coordinates · Part 3" / "Our round Earth" / "latitude, longitude, distances and areas"; the sliced Earth opens on Brest, then ERA5 boxes thinning to the pole | 11.2 s (28 w) |
| 1 | s01_hook | where is a place on a round Earth, how far apart; "third of seven parts" | 27.5 s (81 w) |
| 2 | s02_part2_recap | Parts 1-2 in about a minute: r, θ, x = r cos θ, s = r θ, slope of sine, ring acceleration, r θ z, Ian and Amphan | 59.8 s (149 w) |
| 3 | s03_sphere | origin at the Earth's centre; a distance and two angles: spherical coordinates | 54.4 s (140 w) |
| 4 | s04_slice_radius | the half-Earth slice through Brest (cross-product Part 2 slice); r from the centre; "We call it a." ≈ 6400 (6371) km | 63.3 s (162 w) |
| 5 | s05_latitude | φ as a wedge at the centre, seen near face-on; Brest 48.4° N; 0, 45, ±90 | 55.7 s (135 w) |
| 6 | s06_parallel | the parallel traced round the globe, then sliced across: a disc round the axis | 79.4 s (190 w) |
| 7 | s07_colatitude | colatitude 90° − φ = 41.6° (an angle) vs the parallel (a circle) | 51.0 s (119 w) |
| 8 | s08_sin_cos_swap | D26 two-view: one triangle, next and opposite swap; sin 41.6° = cos 48.4° = 0.6639 | 127.7 s (325 w) |
| 9 | s09_meridians | a meridian drawn pole to pole with the camera following; eleven more as the globe turns | 61.4 s (164 w) |
| 10 | s10_prime_meridian | zoom tour down 0°: Arctic, North Sea, Yorkshire, Greenwich, France, Spain, Algeria, Mali, Burkina Faso, Togo/Ghana, Gulf of Guinea, Antarctica | 89.9 s (222 w) |
| 11 | s11_longitude | λ at the centre of the equatorial slice (top view); east anticlockwise; Brest −4.5° = 355.5° | 88.6 s (218 w) |
| 12 | s12_graticule | meridians and parallels every 15°, named; right angles; Brest's crossing | 56.6 s (133 w) |
| 13 | s13_earth_axes | D23 (1): x̂ to (0° N, 0° E), ŷ to (0° N, 90° E), ẑ to the North Pole; x̂ × ŷ = ẑ; Earth-fixed | 72.8 s (196 w) |
| 14 | s14_brest_side | D23 (2) two-view: centre, axis, equator line, arrow a, φ, dropped line, right triangle, in sync | 77.4 s (201 w) |
| 15 | s15_brest_z | D23 (3): z = a sin φ = 6371 × 0.7478 ≈ 4764 km (easy 4800), labelled on both views; z < 0 in the south | 77.5 s (179 w) |
| 16 | s16_brest_axis_distance | D23 (4)-(5): a cos φ = 6371 × 0.6639 ≈ 4230 km = the parallel's radius | 60.7 s (140 w) |
| 17 | s17_brest_top | D24 two-view top: x = 4230 × 0.9969 ≈ 4217, y = 4230 × (−0.0785) ≈ −332 km | 105.8 s (261 w) |
| 18 | s18_position_vector | x, y, z assembled; Pythagoras twice → 6371; r̂ = (0.662, −0.052, 0.748) | 107.0 s (247 w) |
| 19 | s19_khulna | D25: zoom to Khulna and the Sundarbans (Amphan track); (41, 5873, 2469) km; length 6371 | 98.6 s (233 w) |
| 20 | s20_spin_rate | D27 (1)-(4): T = 23 h 56 min, lap 2π a cos φ, U = 2π a cos φ / T, Ω = 2π / T, U = Ω a cos φ | 105.3 s (250 w) |
| 21 | s21_ground_speeds | D27 (5)-(6): Ω ≈ 7.29 × 10⁻⁵ rad/s; 465 (easy 1670 km/h), Singapore 464, Khulna 428, Brest 308, Longyearbyen 95, pole 0 m/s | 147.2 s (348 w) |
| 22 | s22_distance_north | D28 two-view: meridian = circle round the centre; Δy = a Δφ; 1° = 0.01745 rad → 111.2 km | 106.7 s (252 w) |
| 23 | s23_north_examples | 1′ = 1.85 km (the nautical mile); Brest–equator 5382 km along the curve vs z = 4764 km straight | 53.4 s (121 w) |
| 24 | s24_distance_east | D29 two-view: parallel = circle round the axis; Δx = a cos φ Δλ; Brest 73.8 km per degree | 69.1 s (164 w) |
| 25 | s25_degree_east | four discs on the globe + a bar strip in sync: 111.2, 102.5, 73.8, 22.7, 0 km | 81.1 s (188 w) |
| 26 | s26_grid_boxes | ERA5 0.25° boxes at four places: 27.8 tall; 27.8 / 25.6 / 18.5 / 5.7 wide; ×4.9 too wide (Should 6) | 104.5 s (230 w) |
| 27 | s27_area_patch | D30: patch sides a Δφ and a cos φ Δλ at right angles → dA = a² cos φ dφ dλ; Δ vs d (Should 7) | 107.3 s (261 w) |
| 28 | s28_box_areas | box areas: 773 × cos φ → 712, 513, 158 km²; exact curved patch 513.1 | 79.9 s (174 w) |
| 29 | s29_strip_round | D31 (1)-(2): a strip all round, unrolled: 2π a cos φ × a Δφ | 59.3 s (146 w) |
| 30 | s30_slope_of_sine | D31 (3)-(4): Part 2's slope of sine: cos φ Δφ ≈ Δ(sin φ); check 0.158 = 0.158 | 74.6 s (177 w) |
| 31 | s31_adding_strips | D31 (5)-(6): staircase → 2π a² sin φ; 0.174 + 0.168 + 0.158 = 0.5; the integral named | 80.9 s (204 w) |
| 32 | s32_band_fraction | D31 (7)-(8): 255 and 510 million km²; share sin φ; half the Earth within 30° of the equator; ¾ south of Brest | 72.9 s (160 w) |
| 33 | s33_archimedes | Archimedes' cylinder: equal heights, equal areas; why the two effects cancel | 80.6 s (201 w) |
| 34 | s34_global_mean | two-box toy 15 vs 20 °C; ERA5 Sep 2026 2-m temperature: plain 7.1 vs weighted 16.3 °C | 105.5 s (240 w) |
| 35 | s35_recap | "To sum up"; teaser to Part 4 word for word | 118.3 s (289 w) |
| 36 | s36_end | series end card, maths ending, word for word | 22.9 s (56 w) |

**Length:** 48:18.55 measured (narration 2896.05 s = 48:16.05, plus the 2.5-s silent end-card hold; 6984 words; 49.2 min at the
plan rate of 142 words per minute). The split plan estimated ≈ 25.4 min (≈ 3610 words). The difference is the user's
"assume nothing, don't rush" depth: 9 new scenes (s03 the sphere on its own, s06 the parallel sliced, s08 the swap, s13 the
axes, s16 the second leg, s18 the assembled vector with its checks, s23 two north examples, s28 box areas, s30 and s33 for
D31's steps and Archimedes, s34 real ERA5 data) and every calculation said with its inputs. The coordinator accepted Part 1's
36:28 at the same depth.

**Numbers** (`tools/tts.py` dry run 2026-11-05 into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_sphere/dryrun3`,
Kokoro af_bella × 1.0, current `movies/lexicon.yaml`, not edited): **37 scenes, 445 sentences, 6984 words,
63 beats; narration 2896.1 s (48:16.05); with the 2.5-s silent end-card hold 48:18.55**; speech alone 2651.8 s = 158.0 words per minute while
speaking, **144.7 words per minute overall** (limit 150); 711 caption cues; warnings: [].

**User feedback assigned to Part 3 (split plan §1a), every one addressed:**
- [x] U-CO-033 slice the Earth to show r from the centre (as in the cross product Part 2 movie): s04 (kit_cp `HalfEarthMesh`), reused in s05, s07, s08, s14–s17, s22.
- [x] U-CO-034 Brest's 48.4° angle visibly drawn (not a vertical line): s05 (gold wedge at the centre, face 15° from frontal, never edge-on).
- [x] U-CO-035 which is colatitude and which is a parallel: s06 (the parallel, traced and sliced), s07 (colatitude wedge; "an angle" vs "a circle").
- [x] U-CO-036 what a parallel is: s06 (traced round the globe, then the Earth sliced across: a disc round the axis).
- [x] U-CO-037 how sine and cosine swap: s08 (D26 on one triangle, both corners, two-view, number check).
- [x] U-CO-038 a meridian drawn top to bottom with the camera: s09.
- [x] U-CO-039 move across the globe to show the meridians: s09 (twelve meridians as the globe turns).
- [x] U-CO-040 prime meridian and the continents, countries and oceans it crosses: s10 (zoom tour, Natural Earth crossings, zoom out).
- [x] U-CO-041 the graticule clearly: s12 (drawn line by line, named; right angles), s11 (longitude first).
- [x] U-CO-042 Brest by cutting the globe; which angle is what: s14 (meridian slice), s17 (equatorial slice).
- [x] U-CO-043 globe and flat diagram drawn at the same time: `TwoViewSlice` in s08, s14–s17, s19, s22–s25.
- [x] U-CO-044 the calculations of a cos φ cos λ and a cos φ sin λ: s17 (Brest), s19 (Khulna), s18 (assembled).
- [x] U-CO-045 drawn on the globe and the diagram together: s17 (equatorial slice, both views).
- [x] U-CO-046 how z = a sin φ, why z, which way z points: s13 (axes defined first), s15 (D23, sign in the south).
- [x] U-CO-047 what is calculated, what 6371 and 0.748 are: s15 (inputs written and named: a = 6371 km, sin 48.4° ≈ 0.7478).
- [x] U-CO-048 the values labelled on the picture: s15, s16 (leg tags on both views on the result's words).
- [x] U-CO-049 the same for the next calculation: s16 (a cos φ = 6371 × 0.6639 ≈ 4230 km).
- [x] U-CO-050 what a is and its value: s04 ("We call it a.", 6400 | 6371 km on screen and spoken).
- [x] U-CO-051 what U is and how U = Ω a cos φ: s20 (D27, five moves), s21 (numbers at six places).
- [x] U-CO-052 how Δy and its values: s22 (D28), s23 (two worked examples).
- [x] U-CO-053 how Δx and its values: s24 (D29 on the parallel slice), s25.
- [x] U-CO-054 every equation and calculation clarified: goal → each factor named → CalcStack with inputs → meaning, in every scene; `derivation` blocks in the storyboard.
- [x] U-CO-055 the degree-east picture much clearer: s25 (globe discs + to-scale bar strip, in sync).
- [x] U-CO-056 explain and visualise every equation there, use the globe better: s24–s25 (every number with its circle on the globe).
- [x] U-CO-057 nothing used before it is explained: axes (s13), the triangle rules recalled from Part 1 (s08, s15), the slope of sine recalled from Part 2 (s02, s30), integration built then named (s31), radians conversion written (s22, s28).
- [x] U-CO-058 how dA is calculated: s27 (D30, five moves), s28 (box areas with inputs, exact check).
- [x] U-CO-059 the band-area calculations: s29–s32 (D31, one move per sentence, numeric checks), s33 (Archimedes).
- [x] U-CO-099 later-movie concepts ≤ 1 min and named: none owned later is taught here beyond one sentence: Coriolis (s21, back-pointer "the cross product movie"); the nautical mile (s23, back-pointer "the weather basics movie"); the up arrow of a station (s18, "Part 4").
- [x] U-CO-100 explained here because no later movie owns it: integration as adding up, Archimedes' band, colatitude, the position vector, ground speed, the area element and cos φ weighting.
- [x] U-CO-101 smooth flow across the split: s01 "third of seven parts" (series now seven parts: 4 turning frames, 5 moving frames, 6 routes, 7 maps; coordinator 2026-11-05), s02 recap of Parts 1–2 (ends on Part 2's teaser line), s35 teaser to Part 4 word for word from split plan §2g.
- U-CO-060 (Khulna after Brest and Singapore, Part 4 s06) is prepared here: Khulna's position (s19), ground speed (s21), degree (s25) and box (s26, s28) sit next to Brest and Singapore.

**What Part 4 (Turning frames) relies on from here** (coordinator 2026-11-05), all taught: the Earth axes named x̂, ŷ, ẑ
(x̂ to 0° N 0° E, ŷ to 0° N 90° E, ẑ to the North Pole) in s13; the meridian slice (s04, s14, s22) and the parallel as a circle
round the axis (s06, s16, s24); Δy = a Δφ (s22) and Δx = a cos φ Δλ (s24); Khulna at 22.8° N, 89.6° E (s19); r̂ = (cos φ cos λ,
cos φ sin λ, sin φ) (s18).

**Maths-skip guidance** (user rule via the coordinator, 2026-11-05). Four step-by-step blocks, each opened by one friendly
sentence and an on-screen chip ("every step: optional · not needed for the intuition · skip to mm:ss") and closed by an "If
you skipped, here's what to keep" sentence at the landing scene. Times below are from this dry run; the builder refills the
chip's mm:ss from the final TTS (storyboard `skip_blocks`, `chapter_marks`).

| Block | Steps | Chip at | Skip to | Keep line |
|---|---|---|---|---|
| K1 | the sine-cosine swap (D26) | s08_sin_cos_swap S4 (6:55.80) | s09_meridians (8:50.25) | "If you skipped, here's what to keep. The colatitude is measured down from the pole, so a book that uses it has a cosine wherever we have a sine of the latitude, and the other way round. Now for the second angle." |
| K2 | Brest's x, y, z and the ground speed (D23-D25, D27 steps) | s14_brest_side S3 (15:14.65) | s21_ground_speeds (25:31.88) | "If you skipped, here's what to keep. A place at latitude phi sits the Earth's radius times sine phi above the equator plane, and the radius times cosine phi from the Earth's axis. As the Earth spins, that place is carried east at capital Omega, times its distance from the axis." |
| K3 | distances north and east (D28-D29) | s22_distance_north S2 (28:03.70) | s25_degree_east (31:48.35) | "If you skipped, here's what to keep. A degree of latitude is always about a hundred and eleven kilometres, but a degree of longitude is that times cosine phi, so it shrinks towards the poles. Let's compare one degree of longitude at four places, side by side." |
| K4 | dA, box areas, band areas, Archimedes (D30-D31) | s27_area_patch S5 (35:14.68) | s34_global_mean (44:09.35) | "If you skipped, here's what to keep. Grid boxes shrink towards the poles by cosine phi, so the tropics are huge and the polar caps are small: half of the whole Earth lies between thirty degrees south and thirty degrees north. Here's where this matters for climate." |

**Review 1 and fix-loop-1 guards kept in Part 3** (split plan §1b–§1c; storyboard `guards`): Must 10 (s05 pole label inside
the frame), Must 11 (s21 `facing()` fade, pole "0" right of its dot), Must 17 (s04 a written and spoken), Should 2 (KaTeX
hats), Should 5 (s14–s17 φ inside the triangle, tags beside legs), Should 6 (s26 "four point nine times, so about five
times, too wide" spoken), Should 7 (s27 Δ vs d said once), Should 14 (end card gap), Should 16 (s25 tags below bands),
Should 18 (opening keyword from frame 0); fix-loop rules 4–9.

**Cross-part numbers and symbols** (shared `_coords_common.py` CHECK rows; Parts 4, 5 and #6 must reuse these exactly):

| Quantity | Value (easy \| exact) | Used later in |
|---|---|---|
| Places (on-screen arithmetic uses these rounded coordinates) | Brest 48.4° N 4.5° W · Khulna 22.8° N 89.6° E · Singapore 1.35° N 103.8° E · Longyearbyen 78.2° N 15.6° E | P4–P7, #6 |
| a | 6400 \| 6371 km; a² ≈ 40.6 million km² | all |
| Ω, T | 7.29 × 10⁻⁵ rad/s = 2π / 86 164 s; T = 23 h 56 min | P4 (Coriolis size) |
| Brest sin φ, cos φ, colatitude | 0.7478, 0.6639, 41.6° | P4–P7, #6 |
| Brest position (km) | x 4217, y −332, z 4764; a cos φ 4230 | P4 D33, P6 (Routes) d = a σ |
| r̂ (Brest) | (0.662, −0.052, 0.748) = Part 4's k | P4 D33–D34 |
| Khulna position (km) | x 41, y 5873, z 2469; a cos φ 5873; r̂ (0.006, 0.922, 0.388) | P4 s06 |
| Brest–Khulna angle between the "ups" | 75.8° with these coordinates (split plan D34 says 75.7°, from 89.55° E): Part 4 should say 75.8 | P4 D34 |
| Ground speed U = Ω a cos φ | equator 465, Singapore 464, Khulna 428, Brest 308, Longyearbyen 95 m/s | P4 |
| 1° north / 1 minute | 111.2 km / 1.85 km (nautical mile) | P4, P7 (plate carrée), #6 |
| 1° east | Singapore 111.2, Khulna 102.5, Brest 73.8, Longyearbyen 22.7 km | P4 (plane flying east), P7 (plate carrée k), #6 s23 |
| ERA5 0.25° box | 27.8 km tall; 27.8 / 25.6 / **18.5** / 5.7 km wide; ×4.9 | **#6 s23 must use 18.5 (not 18.4)** |
| ERA5 0.25° box area | 773 · 712 · 513 · 158 km² (cos φ weighting) | #6 |
| Band areas | 2π a² ≈ 255, 4π a² ≈ 510 million km²; share sin φ | P7 (Greenland/Africa areas) |
| ERA5 Sep 2026 global mean 2-m T | weighted 16.3 °C, plain 7.1 °C | — |
| Symbols introduced | φ, λ, a, Ω, U, Δx, Δy, dA, r̂ (Earth), Earth axes x̂ ŷ ẑ, colatitude (no letter) | P4: i, j, k built from r̂; P6: σ; P7: k |

**Spoken-symbol rules.** "the Earth's radius" or "the radius" in every formula; the letter "a" only at the end of a sentence
("We call it a.", G2P checked: mid-sentence it is read as the article). "d capital A" (not "d A"). "phi", "lambda",
"capital Omega", "capital T", "capital U", "delta x", "delta y", "delta phi", "delta lambda", "r hat"; "cosine phi",
"sine phi" (never "cos"). East = anticlockwise "seen from above the North Pole".

**Proposed lexicon entries** (`movies/lexicon.yaml`, not edited; G2P checked 2026-11-05):
- `colatitude: "[colatitude](/kˌOlˈæTətˌud/)"` — default G2P reads kˈɑlətˌɪTud ("KAL-uh-tude").
- `Amphan: "[Amphan](/ˈʌmpɑn/)"` — default ˈæmfən ("AM-fən"); Bengali "Um-pun" (also needed by Part 2).
- Checked and fine without an entry: Khulna, Sundarbans, Longyearbyen, Svalbard, Greenwich, Archimedes, Burkina Faso,
  Togo, Ghana, Accra, Gulf of Guinea, Normandy, Pyrenees, Valencia, Yorkshire, Brighton, graticule, meridian, reanalysis.

**Data and physics** (storyboard `physics_source` per scene; CHECK rows DS01–DS29 for the builder):
`fluidpy.geo.sphere.{unit_vector, parallel_points, meridian_points, wrap_lon, arc_lengths, polygon_area, band_area,
band_fraction}`, `fluidpy.geo.constants.{EARTH_RADIUS, OMEGA}`, `fluidpy.core.coords.cartesian_from_spherical`
(colatitude bridge), `fluidpy.diag.climatology.global_mean`, `fluidpy.data.naturalearth.read_records` (prime-meridian and
48.4° N crossings, computed 2026-11-05), `fluidpy.data.ibtracs` (Amphan track), ERA5 September 2026 2-m temperature
(`data/derived/ch00/era5_t2m_anom_2026-09_1deg.nc`, on disk). **Pending the data report:** only Khulna as Amphan's city (s19).


## s00_title
In this video, we'll learn coordinates on our round Earth the easy way, and see how meteorology uses them to measure distances and areas on its weather grids.

> 28 words · 1 sentences · 0 beats · 0.300–11.475 s (11.2 s; speech 10.4 s) · 0:00.30–0:11.47 (measured, dry run 2026-11-05).

## s01_hook
How do we say where a place is on a round Earth, and how far apart two places are? This is the third of seven parts on coordinates, and in this part, we leave the flat map and go round the globe. Let's see how latitude and longitude are built, and how they turn into kilometres. Then let's see what they tell us about the grid boxes of weather data, and about how much of the Earth lies in the tropics.

> 81 words · 4 sentences · 0 beats · 11.475–39.000 s (27.5 s; speech 25.7 s) · 0:11.47–0:39.00 (measured, dry run 2026-11-05).

## s02_part2_recap
First, a quick look back. In Part 1, we met polar coordinates on a flat map: a distance r, and an angle theta, measured anticlockwise from east, as seen from above. We found that x equals r cosine theta, and y equals r sine theta. We met radians, and the arc length rule: the length of an arc is the radius times the angle, in radians. In Part 2, we watched arrows turn, and we found the slopes of sine and cosine. When an angle grows by a tiny step, its sine grows by about its cosine times that step. We saw that air going round a ring is always accelerating, towards the centre of the ring. Then we added a height z, to get cylindrical coordinates, and looked inside Hurricane Ian and Cyclone Amphan. Now let's take these ideas to the biggest round shape of all: the Earth.

> 149 words · 9 sentences · 0 beats · 39.000–98.750 s (59.8 s; speech 56.1 s) · 0:39.00–1:38.75 (measured, dry run 2026-11-05).

## s03_sphere
Let's start with the shape. The Earth is very nearly a ball, a sphere, so let's treat it as one. On the flat map, we measured from an origin. On the Earth, the natural origin is the Earth's centre. Then any point, on the ground, up in the air, or deep underground, can be pinned down by three numbers. The first is its distance from the centre, which we call r, just as on the flat map. The other two are angles, which say in which direction the point lies, as seen from the centre. A distance and two angles like this are called spherical coordinates. On the Earth, the two angles are the ones you know from maps: latitude and longitude. But the centre is hidden deep inside the Earth. So to see it, let's cut the Earth open.

> 140 words · 11 sentences · 0 beats · 98.750–153.175 s (54.4 s; speech 50.1 s) · 1:38.75–2:33.18 (measured, dry run 2026-11-05).

## s04_slice_radius
Imagine slicing the Earth in half with a flat knife that passes through the North Pole, the South Pole, and the city of Brest, a port at the western tip of France. Now we can see the flat face of the cut, with the Earth's centre in the middle of it. Let's draw an arrow from the centre to Brest. Its length is Brest's distance from the centre, r. For any place on the ground, that length is the Earth's radius. It's about six thousand four hundred kilometres, or more exactly, six thousand three hundred and seventy one. [beat] It's used in so many formulas that it gets its own letter. We call it a. So for places on the ground, r equals a. A weather balloon ten kilometres up is only ten kilometres farther from the centre, about a sixth of one percent more. That's why, for the weather, we can usually use the Earth's radius for every height in the air.

> 162 words · 11 sentences · 1 beats · 153.175–216.450 s (63.3 s; speech 57.8 s) · 2:33.18–3:36.45 (measured, dry run 2026-11-05).

## s05_latitude
Now let's measure the first angle. On the cut face, draw a line from the centre out to the equator. Latitude is the angle between that line and the arrow to the place, measured at the centre. We write it with the Greek letter phi. For Brest, the arrow is turned up from the equator line by about forty eight point four degrees. [beat] That's why we say Brest is at forty eight point four degrees north. At the equator, phi is zero. Halfway from the equator to the North Pole, it's forty five degrees. At the North Pole itself, it's ninety degrees north. At the South Pole, it's ninety degrees south, which we write as minus ninety. So latitude says how far north or south a place is, from minus ninety to plus ninety degrees.

> 135 words · 11 sentences · 1 beats · 216.450–272.150 s (55.7 s; speech 50.2 s) · 3:36.45–4:32.15 (measured, dry run 2026-11-05).

## s06_parallel
Which other places share Brest's latitude? Let's put the Earth back together and turn it. Brest's arrow sweeps round the Earth's axis, always at forty eight point four degrees above the equator plane, and its tip traces a circle round the globe. Every place on that circle has the same latitude as Brest. This circle is called a parallel, because it runs parallel to the equator. Brest's parallel runs east through central Europe, Ukraine, Kazakhstan and Mongolia. Then it runs on round through the northern United States and eastern Canada, and back across the Atlantic to Brest. Now let's slice the Earth the other way: straight across, through Brest's parallel, at right angles to the axis. The cut face is a flat disc, and its rim is Brest's parallel. The centre of this disc is not the Earth's centre. It sits on the Earth's axis, above the equator plane. So a parallel is a circle round the Earth's axis. The equator is the biggest parallel, and the parallels get smaller and smaller towards the poles, where they shrink to a point. We'll measure the size of Brest's parallel very soon.

> 190 words · 14 sentences · 0 beats · 272.150–351.525 s (79.4 s; speech 74.0 s) · 4:32.15–5:51.52 (measured, dry run 2026-11-05).

## s07_colatitude
There's a second way to measure the same direction. You'll meet it in many maths and physics books. Instead of starting from the equator, start from the North Pole, and measure the angle down from the Earth's axis to the arrow. This angle is called the colatitude. Latitude and colatitude together fill the right angle between the equator plane and the axis. So the colatitude is ninety degrees minus the latitude. For Brest, it's ninety minus forty eight point four, which is forty one point six degrees. [beat] Be careful not to mix up two words here. The colatitude is an angle, measured at the centre. A parallel is a circle, made of all the places with the same latitude.

> 119 words · 10 sentences · 1 beats · 351.525–402.550 s (51.0 s; speech 45.9 s) · 5:51.52–6:42.55 (measured, dry run 2026-11-05).

## s08_sin_cos_swap
Why does it matter which angle a book uses? Because sine and cosine swap places. The next minute and a half shows exactly why, for anyone who likes to see every step. You don't need it for the intuition of weather, climate science or mapping, so feel free to skip ahead to the time on screen. Let's see why, on one triangle. Take the arrow to Brest, but shrink it to length one. From its tip, drop a line straight down to the equator plane, parallel to the axis. Together with the equator line, this makes a right triangle. From Part 1, the side next to an angle is the long side times the cosine, and the side opposite it is the long side times the sine. At the centre, the angle is the latitude, phi. The side next to it lies along the equator plane, so it's cosine phi. The side opposite it runs parallel to the axis, so it's sine phi. Now look from the triangle's other sharp corner, at Brest's end. The three angles of a triangle add up to a hundred and eighty degrees. The right angle takes ninety, so the two sharp angles share the other ninety. So the angle at Brest's end is ninety degrees minus phi, which is exactly the colatitude. From that corner, the side next to it is the one parallel to the axis, and the side opposite it is the one in the equator plane. Same triangle, same sides, but next and opposite have swapped. So the sine of the colatitude equals cosine phi, and the cosine of the colatitude equals sine phi. For Brest, the sine of forty one point six degrees is zero point six six three nine, and so is the cosine of forty eight point four degrees. [beat] So wherever this video has a sine of the latitude, a book that uses the colatitude has a cosine, and the other way round.

> 325 words · 21 sentences · 1 beats · 402.550–530.250 s (127.7 s; speech 118.7 s) · 6:42.55–8:50.25 (measured, dry run 2026-11-05).

## s09_meridians
If you skipped, here's what to keep. The colatitude is measured down from the pole, so a book that uses it has a cosine wherever we have a sine of the latitude, and the other way round. Now for the second angle. First, we need another kind of line on the globe. Start at the North Pole, and draw a line straight down the globe, heading due south all the way, until it reaches the South Pole. This half circle is called a meridian. All along one meridian, the Sun is highest in the sky at the same moment, at midday, and that's where the name comes from. Let's turn the globe and draw more of them, twelve, evenly spaced all the way round. Every meridian runs from pole to pole, and they all meet at the poles. Each one is half of a big circle whose centre is the Earth's centre. That's the difference from the parallels, whose centres sit on the axis.

> 164 words · 11 sentences · 0 beats · 530.250–591.600 s (61.4 s; speech 57.1 s) · 8:50.25–9:51.60 (measured, dry run 2026-11-05).

## s10_prime_meridian
One meridian is chosen as the starting line. It passes through Greenwich, in London, and it was agreed at an international meeting in eighteen eighty four. It's called the prime meridian. Let's follow it from the top of the globe to the bottom. It starts at the North Pole, in the middle of the frozen Arctic Ocean. It runs south between Greenland and Norway, over the Norwegian Sea and the North Sea, and comes ashore on the east coast of England, in Yorkshire. It passes through Greenwich, in east London, and leaves England on the south coast, near Brighton. It crosses the English Channel, and runs right through France, from Normandy in the north to the Pyrenees mountains in the south. Then it crosses the east of Spain, and reaches the Mediterranean Sea a little north of Valencia. In Africa, it crosses the Sahara desert in Algeria, then Mali, and Burkina Faso. Further south, it runs for a short way along the border between Togo and Ghana, then through Ghana, to the coast near the capital, Accra. Out in the Gulf of Guinea, part of the Atlantic Ocean, it crosses the equator. Then it runs south over the open South Atlantic and the Southern Ocean, for more than eight thousand kilometres. It reaches the ice of Antarctica, and finally the South Pole.

> 222 words · 14 sentences · 0 beats · 591.600–681.550 s (89.9 s; speech 84.6 s) · 9:51.60–11:21.55 (measured, dry run 2026-11-05).

## s11_longitude
Now we can define the second angle. Let's look down on the Earth from far above the North Pole. From up here, every meridian looks like a spoke of a wheel, running out from the pole. Now slice the Earth across, along the equator, and look at the round face of the cut. Its centre is the Earth's centre, and the meridians meet its rim like the ends of the spokes. Longitude is the angle at the centre, from the prime meridian round to the meridian of the place. We write it with the Greek letter lambda. Seen from above the North Pole, east is anticlockwise, the same way the angle theta turned in Part 1. Places east of Greenwich have positive longitude, up to a hundred and eighty degrees east. Places to the west have negative longitude, down to minus a hundred and eighty. Brest is about four and a half degrees west of Greenwich, so its lambda is minus four point five degrees. [beat] Some data sets count longitude from zero to three hundred and sixty degrees, always going east. Then Brest is at three hundred and sixty minus four point five, which is three hundred and fifty five point five degrees. [beat] Both numbers point to the same meridian, so always check which way your data counts.

> 218 words · 14 sentences · 2 beats · 681.550–770.175 s (88.6 s; speech 81.0 s) · 11:21.55–12:50.17 (measured, dry run 2026-11-05).

## s12_graticule
Now let's cover the globe with both kinds of line. First, the meridians, one every fifteen degrees of longitude: zero, fifteen east, thirty east, and all the way round. Then the parallels, one every fifteen degrees of latitude: the equator, fifteen north, thirty north, forty five, sixty and seventy five, and the same to the south. Together, they make a grid on the globe, called the graticule. Every meridian crosses every parallel at a right angle, because the meridians run north and south, and the parallels run east and west. Any place on Earth sits where one parallel meets one meridian. So two numbers, its latitude and its longitude, pin it down. Brest sits where the parallel at forty eight point four degrees north meets the meridian at four point five degrees west.

> 133 words · 8 sentences · 0 beats · 770.175–826.750 s (56.6 s; speech 53.3 s) · 12:50.17–13:46.75 (measured, dry run 2026-11-05).

## s13_earth_axes
Latitude and longitude tell us where a place is on the surface. But in physics, we often want the place as an arrow in space, from the Earth's centre, with x, y and z parts, like the balloon's arrow in Part 1. For that, we first need three axes, all starting at the Earth's centre. The z axis runs up the Earth's spin axis, towards the North Pole. The x axis runs out to the point where the prime meridian meets the equator, in the Gulf of Guinea, off the coast of West Africa. The y axis runs out to the equator at ninety degrees east, in the Indian Ocean, south of the Bay of Bengal. The arrows of length one along them are called x hat, y hat and z hat. All three are at right angles to each other. They're arranged so that x hat cross y hat gives z hat, as in the cross product movie. And they turn with the Earth, so a city's x, y and z never change. Our goal now is to find Brest's x, y and z. We'll do it in two steps, with one slice each time.

> 196 words · 12 sentences · 0 beats · 826.750–899.550 s (72.8 s; speech 68.1 s) · 13:46.75–14:59.55 (measured, dry run 2026-11-05).

## s14_brest_side
The next few minutes build Brest's position, and then the speed of the spinning ground, one step at a time. They're here for anyone who wants every step, and you don't need them for the intuition of weather, climate science or mapping. So if it feels like a lot, skip ahead to the time on screen. First, the side view. Let's slice the Earth along Brest's meridian again, and next to it, draw the same cut face flat on the page. Everything we draw on the globe, we'll draw on the flat diagram at the same moment. Here's the centre, in both pictures. Here's the Earth's axis, pointing up to the North Pole: that's the z direction. Here's the line from the centre out to the equator, on Brest's meridian. Here's the arrow from the centre to Brest, as long as the Earth's radius. And here's the latitude, phi, forty eight point four degrees, between the equator line and the arrow. Now drop a line from Brest straight down to the equator plane, parallel to the axis. It meets the equator line at a right angle. So we have a right triangle, and the arrow to Brest is its long side.

> 201 words · 14 sentences · 0 beats · 899.550–976.950 s (77.4 s; speech 72.0 s) · 14:59.55–16:16.95 (measured, dry run 2026-11-05).

## s15_brest_z
What's Brest's height above the equator plane? That height is the side of the triangle that runs parallel to the axis, so it's measured along z. It's the side opposite the angle phi. By the rule from Part 1, it's the long side times sine phi. So z equals the Earth's radius times sine phi. Now the numbers. The long side is the Earth's radius, six thousand three hundred and seventy one kilometres. The sine of forty eight point four degrees is zero point seven four seven eight. So z is six thousand three hundred and seventy one times zero point seven four seven eight, which is about four thousand seven hundred and sixty four kilometres. [beat] With easy numbers, six thousand four hundred times three quarters is four thousand eight hundred: about the same. [beat] So Brest sits about four thousand seven hundred and sixty four kilometres above the equator plane, on the North Pole's side. A place in the southern hemisphere has a negative latitude, so its sine, and its z, are negative: it lies below the equator plane.

> 179 words · 12 sentences · 2 beats · 976.950–1054.475 s (77.5 s; speech 70.6 s) · 16:16.95–17:34.47 (measured, dry run 2026-11-05).

## s16_brest_axis_distance
Next, the triangle's other short side: Brest's distance from the Earth's axis. It's the side next to the angle phi, so it's the long side times cosine phi. The cosine of forty eight point four degrees is zero point six six three nine. So the distance from the axis is six thousand three hundred and seventy one times zero point six six three nine, which is about four thousand two hundred and thirty kilometres. [beat] With easy numbers, six thousand four hundred times two thirds is about four thousand two hundred and seventy: close. [beat] This distance is exactly the radius of Brest's parallel, the disc we sliced across earlier. On both pictures, the two short sides now carry their lengths: four thousand seven hundred and sixty four kilometres up, and four thousand two hundred and thirty kilometres out from the axis.

> 140 words · 7 sentences · 2 beats · 1054.475–1115.175 s (60.7 s; speech 55.5 s) · 17:34.47–18:35.17 (measured, dry run 2026-11-05).

## s17_brest_top
Second step: the top view. Now look down on the Earth from far above the North Pole, and slice it across along the equator plane, as we did for longitude. Next to it, again, the same face is drawn flat. Brest itself is above this plane, but straight below Brest, in the plane, is the foot of the line we dropped. That foot is four thousand two hundred and thirty kilometres from the centre, the distance from the axis we just found. And it lies on Brest's meridian, so it's at Brest's longitude, lambda, minus four and a half degrees, measured from the x axis. That's polar coordinates on a flat face, exactly as in Part 1, with the distance from the axis playing the part of r, and lambda playing the part of theta. So the x part is that distance times cosine lambda, and the y part is that distance times sine lambda. Now the numbers. The cosine of minus four point five degrees is zero point nine nine six nine. So x is four thousand two hundred and thirty times zero point nine nine six nine, about four thousand two hundred and seventeen kilometres. [beat] The sine of minus four point five degrees is minus zero point zero seven eight five. So y is four thousand two hundred and thirty times minus zero point zero seven eight five, about minus three hundred and thirty two kilometres. [beat] The y part is small, because Brest is close to the prime meridian, and it's negative, because Brest is just west of it.

> 261 words · 14 sentences · 2 beats · 1115.175–1221.000 s (105.8 s; speech 98.2 s) · 18:35.17–20:21.00 (measured, dry run 2026-11-05).

## s18_position_vector
Let's put the two steps together. The distance from the axis is the Earth's radius times cosine phi. So x is the Earth's radius, times cosine phi, times cosine lambda. And y is the Earth's radius, times cosine phi, times sine lambda. And z is the Earth's radius times sine phi. For Brest, that's four thousand two hundred and seventeen, minus three hundred and thirty two, and four thousand seven hundred and sixty four kilometres. [beat] Let's check that this arrow really is as long as the Earth's radius. First, Pythagoras in the equator plane: the square root of x squared plus y squared gives back the distance from the axis, four thousand two hundred and thirty. [beat] Then Pythagoras in the side view: the square root of four thousand two hundred and thirty squared, plus z squared, gives six thousand three hundred and seventy one. [beat] It works for every place, because cosine squared plus sine squared is always one. Now divide the arrow by its length, the Earth's radius. We get an arrow of length one, pointing straight up from the place, away from the centre. We call it r hat, just as on the flat map. Its parts are cosine phi cosine lambda, cosine phi sine lambda, and sine phi. For Brest, they're about zero point six six two, minus zero point zero five two, and zero point seven four eight. [beat] We'll use this arrow again in Part 4, as the up direction of a weather station.

> 247 words · 16 sentences · 4 beats · 1221.000–1327.975 s (107.0 s; speech 96.3 s) · 20:21.00–22:07.97 (measured, dry run 2026-11-05).

## s19_khulna
Let's do the same for a city on the other side of Asia. Khulna is in the southwest of Bangladesh, near the Sundarbans, the world's largest mangrove forest, close to where Cyclone Amphan, from Part 2, came ashore in May twenty twenty. It's at about twenty two point eight degrees north, and eighty nine point six degrees east. In the side view, sine phi is zero point three eight seven five. So Khulna's height above the equator plane is six thousand three hundred and seventy one times zero point three eight seven five, about two thousand four hundred and sixty nine kilometres. [beat] Cosine phi is zero point nine two one nine, so its distance from the axis is about five thousand eight hundred and seventy three kilometres. [beat] Khulna is much closer to the equator than Brest, so it sits lower, and much farther from the axis. In the top view, lambda is eighty nine point six degrees, almost a right angle from the prime meridian. Its cosine is only zero point zero zero six nine eight, so x is about forty one kilometres. [beat] Its sine is almost exactly one, so y is about five thousand eight hundred and seventy three kilometres. [beat] So Khulna's arrow points almost straight along the y axis, tilted up towards the North Pole. And once again, its length comes out at six thousand three hundred and seventy one kilometres.

> 233 words · 12 sentences · 4 beats · 1327.975–1426.550 s (98.6 s; speech 89.3 s) · 22:07.97–23:46.55 (measured, dry run 2026-11-05).

## s20_spin_rate
That distance from the axis has a second meaning. The Earth spins round its axis, so every place on the ground is carried round a circle: its parallel. The radius of that circle is the distance from the axis, the Earth's radius times cosine phi. How fast is the ground moving? Let's work it out, one step at a time. First, how long does one turn take? Measured against the distant stars, the Earth turns once every twenty three hours, fifty six minutes and four seconds. We call this time capital T. It's four minutes shorter than a day from noon to noon, because the Earth also moves along its orbit round the Sun. Second, how far does the place travel in one turn? Once round its circle, which is two pi times the radius of the circle. That's two pi, times the Earth's radius, times cosine phi. Third, speed is distance divided by time. So the ground speed, capital U, is two pi, times the Earth's radius, times cosine phi, divided by capital T. Fourth, we pull out the part that's the same for every place: two pi divided by capital T. That's the angle the Earth turns through each second, in radians. It's called the Earth's spin rate, and we write it capital Omega, as in the cross product movie. So capital U equals capital Omega, times the Earth's radius, times cosine phi. [beat] It's Part 2's rule for a ring again: the speed is the radius times the turning rate.

> 250 words · 19 sentences · 1 beats · 1426.550–1531.875 s (105.3 s; speech 97.1 s) · 23:46.55–25:31.88 (measured, dry run 2026-11-05).

## s21_ground_speeds
If you skipped, here's what to keep. A place at latitude phi sits the Earth's radius times sine phi above the equator plane, and the radius times cosine phi from the Earth's axis. As the Earth spins, that place is carried east at capital Omega, times its distance from the axis. Now the numbers. Twenty three hours, fifty six minutes and four seconds is eighty six thousand one hundred and sixty four seconds. So capital Omega is two pi divided by eighty six thousand one hundred and sixty four, which is about seven point two nine two times ten to the minus five radians per second. [beat] At the equator, cosine phi is one. So the ground moves at seven point two nine two times ten to the minus five, times six point three seven one million metres, which is about four hundred and sixty four point six metres per second. [beat] With easy numbers, the equator is about forty thousand kilometres round, and forty thousand kilometres in twenty four hours is about one thousand six hundred and seventy kilometres per hour. That's almost twice as fast as a passenger jet. Singapore, almost on the equator, moves at about four hundred and sixty four metres per second. [beat] At Khulna, cosine phi is zero point nine two one nine, so it's about four hundred and twenty eight. [beat] At Brest, cosine phi is zero point six six three nine, so it's about three hundred and eight. [beat] At Longyearbyen, on the Arctic islands of Svalbard, seventy eight point two degrees north, cosine phi is zero point two zero four five. So the ground there moves at only about ninety five metres per second. [beat] And at the poles, cosine phi is zero, so the ground just turns on the spot. Every one of these speeds points east, the way the Earth turns. We don't feel any of it, because the air, the sea and we ourselves all move along with the ground. But this shrinking circle is part of the reason why the Earth's spin affects the winds differently at different latitudes, as we saw in the cross product movie.

> 348 words · 19 sentences · 6 beats · 1531.875–1679.100 s (147.2 s; speech 133.2 s) · 25:31.88–27:59.10 (measured, dry run 2026-11-05).

## s22_distance_north
Now let's measure distances on the ground, step by step. If you'd rather keep to the big picture, skip ahead to the time on screen: these steps aren't needed for the intuition of weather, climate science or mapping. Let's start with going north. Slice the Earth along a meridian again. Walking due north, you follow the meridian, and a meridian is part of a circle whose centre is the Earth's centre. So the radius of that circle is the full radius of the Earth. As you walk north, your latitude grows, and latitude is exactly the angle at the centre of this circle. So by the arc length rule from Part 1, the distance walked is the radius times the change of angle, in radians. We write it like this: delta y, the distance north, equals the Earth's radius times delta phi, the change in latitude. Let's find the length of one degree. A full turn is three hundred and sixty degrees, or two pi radians. So one degree is pi over one hundred and eighty, which is zero point zero one seven four five radians. [beat] Times six thousand three hundred and seventy one kilometres, that's about one hundred and eleven point two kilometres. [beat] With easy numbers, six thousand four hundred times zero point zero one seven five is one hundred and twelve: about the same. [beat] And it's the same at every latitude, because every meridian has the same radius. So a degree north is always about a hundred and eleven kilometres.

> 252 words · 16 sentences · 3 beats · 1679.100–1785.825 s (106.7 s; speech 97.2 s) · 27:59.10–29:45.83 (measured, dry run 2026-11-05).

## s23_north_examples
Two examples. One minute of latitude is a sixtieth of a degree, so it's one hundred and eleven point two divided by sixty, which is about one point eight five kilometres. [beat] That's the nautical mile from the weather basics movie, and that's where it comes from. Next, how far is Brest from the equator, walking due south along its meridian? Forty eight point four degrees, times one hundred and eleven point two kilometres per degree, is about five thousand three hundred and eighty two kilometres. [beat] Notice that's longer than Brest's height above the equator plane, four thousand seven hundred and sixty four kilometres. The walk follows the curved surface of the Earth. The height is a straight line, through the inside.

> 121 words · 8 sentences · 2 beats · 1785.825–1839.250 s (53.4 s; speech 47.9 s) · 29:45.83–30:39.25 (measured, dry run 2026-11-05).

## s24_distance_east
Going east is different. Walking due east, you follow a parallel. And a parallel, as we saw when we sliced across, is a circle round the Earth's axis, not round its centre. Its radius is the distance from the axis: the Earth's radius times cosine phi. Let's slice across at Brest's latitude again. As you walk east along this circle, your longitude grows, and longitude is the angle at the centre of this circle, on the axis. So by the same arc length rule, the distance east is the radius of the parallel times the change in longitude. We write it like this: delta x equals the Earth's radius, times cosine phi, times delta lambda. For one degree at Brest, that's four thousand two hundred and thirty kilometres times zero point zero one seven four five, which is about seventy three point eight kilometres. [beat] That's only two thirds of a degree north, because Brest's parallel is only two thirds as big as the equator.

> 164 words · 10 sentences · 1 beats · 1839.250–1908.350 s (69.1 s; speech 64.0 s) · 30:39.25–31:48.35 (measured, dry run 2026-11-05).

## s25_degree_east
If you skipped, here's what to keep. A degree of latitude is always about a hundred and eleven kilometres, but a degree of longitude is that times cosine phi, so it shrinks towards the poles. Let's compare one degree of longitude at four places, side by side. Each one is one hundred and eleven point two kilometres, times cosine phi. At Singapore, cosine phi is almost exactly one, so one degree east is about one hundred and eleven point two kilometres, the same as a degree north. [beat] At Khulna, cosine phi is zero point nine two one nine, so it's about one hundred and two point five. [beat] At Brest, it's about seventy three point eight. [beat] At Longyearbyen, cosine phi is zero point two zero four five, so one degree east is only about twenty two point seven kilometres. [beat] And at the pole, where all the meridians meet, it's zero. Like the segments of a peeled orange, the meridians are widest apart at the equator, and they come together at the poles. Unlike an orange, which has a fixed number of segments, there's a meridian through every single place.

> 188 words · 11 sentences · 4 beats · 1908.350–1989.400 s (81.1 s; speech 72.1 s) · 31:48.35–33:09.40 (measured, dry run 2026-11-05).

## s26_grid_boxes
This matters every time we use weather data. ERA5, the reanalysis we've used throughout this series, is a reconstruction of the past weather everywhere, made by combining observations with a weather model. It gives its values on a grid of latitude and longitude, every quarter of a degree. So each grid box is a quarter of a degree tall, and a quarter of a degree wide. The height is easy: a quarter of one hundred and eleven point two is about twenty seven point eight kilometres, at every latitude. [beat] The width depends on cosine phi. At Singapore, a box is about twenty seven point eight kilometres wide: nearly square. [beat] At Khulna, it's about twenty five point six kilometres wide. [beat] At Brest, about eighteen and a half. [beat] At Longyearbyen, a box is still twenty seven point eight kilometres tall, but only about five point seven wide. [beat] So the boxes get thinner and thinner towards the poles. Forget the cosine, and a box at Longyearbyen comes out four point nine times, so about five times, too wide. [beat] Every east-west distance there would be five times too big, and every east-west slope five times too small. This is also how, in Part 4, we'll turn a coast's latitudes and longitudes into kilometres. And it's one reason why many modern weather models use other kinds of grid, which don't crowd together at the poles.

> 230 words · 15 sentences · 6 beats · 1989.400–2093.925 s (104.5 s; speech 91.9 s) · 33:09.40–34:53.93 (measured, dry run 2026-11-05).

## s27_area_patch
Distances give us areas. Why do we care? Because to average anything over the Earth, like the temperature, we need to know how much area each grid box covers. The next few minutes build the area of a small patch, and then of whole bands round the Earth, one step at a time. They're for anyone who wants every step, and not needed for the intuition, so feel free to skip ahead to the time on screen. Take a small patch of the surface, between two meridians and two parallels. Its north-south side is the Earth's radius times delta phi. Its east-west side is the Earth's radius times cosine phi times delta lambda. The two sides meet at a right angle, because meridians cross parallels at right angles. And when the patch is small, it's almost flat, so it's almost a rectangle. The area of a rectangle is its width times its height. So the patch's area is about the east-west side times the north-south side. Collecting the pieces, that's the radius squared, times cosine phi, times delta phi, times delta lambda. As the patch shrinks, the bending of the surface matters less and less. In the limit, we write the tiny area as d capital A, and the tiny steps as d phi and d lambda. So d capital A equals the radius squared, times cosine phi, d phi, d lambda. From here on, delta means a small step, and a small d means a step so tiny that the approximation becomes exact. And the angles are always in radians.

> 261 words · 18 sentences · 0 beats · 2093.925–2201.200 s (107.3 s; speech 100.5 s) · 34:53.93–36:41.20 (measured, dry run 2026-11-05).

## s28_box_areas
Let's work out the area of one ERA5 box. A quarter of a degree is zero point zero zero four three six radians. The radius squared is six thousand three hundred and seventy one squared, about forty point six million square kilometres. [beat] Times zero point zero zero four three six, and times zero point zero zero four three six again, that's about seven hundred and seventy three square kilometres, for a box on the equator. [beat] Every other box is that, times cosine phi. At Khulna, seven hundred and seventy three times zero point nine two one nine is about seven hundred and twelve square kilometres. [beat] At Brest, times zero point six six three nine, it's about five hundred and thirteen. [beat] At Longyearbyen, times zero point two zero four five, it's only about a hundred and fifty eight. [beat] As a check, a computer can work out the exact area of the curved patch at Brest. It's also about five hundred and thirteen point one square kilometres, so the flat rectangle is a very good approximation. [beat]

> 174 words · 10 sentences · 6 beats · 2201.200–2281.100 s (79.9 s; speech 69.5 s) · 36:41.20–38:01.10 (measured, dry run 2026-11-05).

## s29_strip_round
Now a bigger question. How much of the Earth's surface lies between the equator and some latitude, say thirty degrees north? Why care? Because that's how much of the planet is tropical and subtropical, and it tells us how much each part of the world counts in a global average. Let's build that area from thin strips. Take one strip that goes all the way round the Earth, between latitude phi and a little further north, phi plus delta phi. Cut it and unroll it, and it's almost a long, thin rectangle. Its length is the length of the parallel: two pi times its radius, which is two pi, times the Earth's radius, times cosine phi. Its width is the step north: the Earth's radius times delta phi. So the strip's area is about two pi, times the radius squared, times cosine phi, times delta phi.

> 146 words · 10 sentences · 0 beats · 2281.100–2340.425 s (59.3 s; speech 55.4 s) · 38:01.10–39:00.43 (measured, dry run 2026-11-05).

## s30_slope_of_sine
Adding up lots of cosines like this looks hard. But Part 2 gave us a shortcut. When an angle grows by a small step, its sine grows by about its cosine times that step. So cosine phi times delta phi is just how much sine phi grows across the strip. We call that delta sine phi. Let's check it with a strip ten degrees wide, from twenty to thirty degrees north. Ten degrees is zero point one seven four five radians. Cosine phi at the middle of the strip, at twenty five degrees, is zero point nine zero six. So cosine phi times delta phi is zero point nine zero six times zero point one seven four five, about zero point one five eight. [beat] And sine phi grows from zero point three four two, at twenty degrees, to zero point five, at thirty degrees. That's a step of zero point one five eight too. [beat] So the strip's area is two pi, times the radius squared, times delta sine phi: the change in sine phi across the strip.

> 177 words · 12 sentences · 2 beats · 2340.425–2415.000 s (74.6 s; speech 67.6 s) · 39:00.43–40:15.00 (measured, dry run 2026-11-05).

## s31_adding_strips
Now stack the strips, from the equator all the way up to latitude phi. Each strip adds its own step in sine phi, like the steps of a staircase. And all the steps of a staircase add up to the height of the top, minus the height of the bottom. At the equator, sine phi is zero. So all the steps together add up to just sine phi. That means the area between the equator and latitude phi is two pi, times the radius squared, times sine phi. [beat] Let's check with ten degree strips, from the equator to thirty degrees. Their steps in sine phi are zero point one seven four, zero point one six eight, and zero point one five eight. [beat] They add up to zero point five, which is exactly the sine of thirty degrees. [beat] This adding up of thinner and thinner strips has a name: integration. We write it with a tall S, for sum, and a small d for the tiny steps. Inside, we call the latitude of each strip phi prime, so it isn't mixed up with the top latitude, phi. So the integral of cosine phi prime, d phi prime, from zero up to phi, equals sine phi.

> 204 words · 13 sentences · 3 beats · 2415.000–2495.900 s (80.9 s; speech 72.4 s) · 40:15.00–41:35.90 (measured, dry run 2026-11-05).

## s32_band_fraction
Let's check the formula. Go all the way up to the North Pole. The sine of ninety degrees is one, so the northern hemisphere has an area of two pi times the radius squared. That's about two hundred and fifty five million square kilometres. [beat] The whole Earth is twice that, four pi times the radius squared: about five hundred and ten million square kilometres. [beat] So the share of the northern hemisphere between the equator and latitude phi is simply sine phi. The sine of thirty degrees is one half. So half of the northern hemisphere lies between the equator and thirty degrees north. [beat] The same goes for the south. So half of the whole Earth lies between thirty degrees south and thirty degrees north. [beat] At Brest's latitude, sine phi is zero point seven four seven eight, so about three quarters of the northern hemisphere lies south of Brest. [beat] The tropics and subtropics are huge, and the polar caps are small.

> 160 words · 12 sentences · 5 beats · 2495.900–2568.775 s (72.9 s; speech 62.5 s) · 41:35.90–42:48.78 (measured, dry run 2026-11-05).

## s33_archimedes
There's a lovely picture of this result, found by Archimedes more than two thousand years ago. Wrap the Earth in a cylinder that just touches it all round the equator, so the cylinder has the same radius as the Earth. Now take our band, from the equator up to latitude phi, and push it straight out sideways, away from the axis, onto the cylinder. On the cylinder, it covers a band whose height is the Earth's radius times sine phi. That's z, the height above the equator plane, from earlier. A cylinder band is a rectangle rolled up. Its length is two pi times the radius, and its height is the radius times sine phi. So its area is two pi, times the radius squared, times sine phi: exactly the same as the Earth's band. [beat] Why do they match? Near the pole, a strip on the Earth is shorter round than on the cylinder, by a factor of cosine phi. But the Earth's surface there is steep, so the strip is wider along the surface than its height, by the same factor. The two effects cancel exactly. So slices of the Earth of equal height have equal areas, wherever they are.

> 201 words · 13 sentences · 1 beats · 2568.775–2649.350 s (80.6 s; speech 74.4 s) · 42:48.78–44:09.35 (measured, dry run 2026-11-05).

## s34_global_mean
If you skipped, here's what to keep. Grid boxes shrink towards the poles by cosine phi, so the tropics are huge and the polar caps are small: half of the whole Earth lies between thirty degrees south and thirty degrees north. Here's where this matters for climate. Imagine a planet with just two grid boxes, the same size in degrees. One is on the equator, at thirty degrees Celsius. The other is at sixty degrees north, at zero degrees Celsius. A plain average says fifteen degrees. But the box at sixty degrees covers only cosine sixty degrees, which is one half of the area of the equator box. So the area-weighted average is thirty times one, plus zero times one half, all divided by one and a half. That's twenty degrees. [beat] That's why a global average gives each latitude a weight of cosine phi. Now let's do it with real data: ERA5's air temperature two metres above the ground, averaged over September twenty twenty six, on a one degree grid. A plain average of all the grid boxes gives about seven point one degrees Celsius. [beat] Weighted by cosine phi, it's about sixteen point three degrees. [beat] The plain average is more than nine degrees too cold, because the many thin boxes near the poles, over the cold Arctic and the frozen Antarctic, count as much as the big tropical ones. This cosine weighting is how global average temperatures are worked out.

> 240 words · 16 sentences · 3 beats · 2649.350–2754.800 s (105.5 s; speech 95.9 s) · 44:09.35–45:54.80 (measured, dry run 2026-11-05).

## s35_recap
To sum up, a point on or around the Earth is pinned down by spherical coordinates: its distance from the centre, and two angles. On the ground, that distance is the Earth's radius, about six thousand four hundred kilometres, which we call a. Latitude, phi, is the angle up from the equator plane, measured at the centre. The colatitude is ninety degrees minus phi, measured down from the pole, and it swaps sine and cosine. A parallel is a circle of constant latitude, round the Earth's axis. A meridian is a half circle from pole to pole, round the Earth's centre. Longitude, lambda, is the angle round the axis, from the prime meridian through Greenwich, positive to the east. Two slices give the position arrow: x is the radius times cosine phi times cosine lambda, y is the radius times cosine phi times sine lambda, and z is the radius times sine phi. The ground is carried east at capital Omega, times the radius, times cosine phi: about four hundred and sixty four point six metres per second at the equator. A step north is the radius times delta phi, about a hundred and eleven kilometres per degree, everywhere. A step east is the radius, times cosine phi, times delta lambda, and it shrinks towards the poles. So a small patch has an area of the radius squared, times cosine phi, d phi, d lambda. Adding up strips shows that the band from the equator to latitude phi holds a share sine phi of its hemisphere, which is why global averages weight each latitude by cosine phi. In Part 4, we'll stand at a weather station, and see how its own east, north and up arrows turn as the air moves.

> 289 words · 14 sentences · 0 beats · 2754.800–2873.150 s (118.3 s; speech 113.0 s) · 45:54.80–47:53.15 (measured, dry run 2026-11-05).

## s36_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for coordinates, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 56 words · 3 sentences · 0 beats · 2873.150–2896.050 s (22.9 s; speech 21.9 s) · 47:53.15–48:16.05 (measured, dry run 2026-11-05).
