# ch00_coordinates_maps — narration (movie-director, 2026-11-05)

Series plan v6 **#5e, position 11**: "Coordinates, Part 5 — Routes and maps: great circles and map projections" (title card: "Coordinates · Part 5" / "Routes and maps" / "great circles and map projections"; the spoken s00 sentence stays short).
Split plan `movies/ch00/ch00_coordinates/split_plan.md` §2f (commit 73044df). House style `movies/HOUSE_STYLE.md` (binding).
Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice; our own words; maths spoken in words; `[beat]` = 1.5-s hold
after a worked calculation (not spoken, not captioned). Lines starting with ">" are notes and are not spoken; the README
below uses `###` headings so that `tools/tts.py` does not read it as a scene.

### README

**Measured, not estimated** (`tools/tts.py` dry run; numbers block at the end of this README).

**Scene list** (one line each; measured length per scene below)

| # | Scene | One line |
|---|---|---|
| 0 | s00_title | title "Coordinates, Part 5"; one sentence; great circle on the globe → curved on Mercator → polar map with wind trails |
| 1 | s01_hook | the shortest way London → Los Angeles, and why it looks curved; "the last of five parts" |
| 2 | s02_part4_recap | arc rule, φ, λ, the letter a, r̂, 111.2 km per degree north, × cos φ east; i, j, k and moving frames (≤ 60 s) |
| 3 | s03_curvilinear | curvilinear coordinates: curved lines, turning unit vectors, a step that is not a distance |
| 4 | s04_scale_factors | D53: scale factor = metres per unit; r, a, a cos φ; Brest 111.2 and 73.8 km per degree |
| 5 | s05_gradient_preview | 1 °C over 73.8 km, not 111.2; the gradient on the sphere named; next: *The gradient*; *Pressure as a vertical coordinate* (≤ 1 min) |
| 6 | s06_shortest_way | goal first (fuel, time); what a great circle is (equator, meridians; other parallels are not) |
| 7 | s07_great_circle | D45 (1)–(3), D46: the slicing sheet through London, Los Angeles and the centre; why it is the shortest |
| 8 | s08_sigma | D45: σ = the angle at the centre; the slice face-on = Part 1's arc rule, d = a σ; 1° of σ ≈ 111.2 km |
| 9 | s09_position_arrows | r̂₁, r̂₂ written out with every input (cos and sin values) |
| 10 | s10_cos_sigma | cos σ = r̂₁ · r̂₂ = −0.244 + 0.001 + 0.438 ≈ 0.195; σ ≈ 78.7° |
| 11 | s11_distance | σ ≈ 1.3742 rad; d ≈ 6371 × 1.3742 ≈ 8755 km; check 78.74 × 111.2; ≈ 9.7 h |
| 12 | s12_route_shape | leaves at 312°, tops out at 62.4° N near SW Greenland, arrives at 214° |
| 13 | s13_rhumb | D47: rhumb line 258.5°, 9733 km, × 1.11, +978 km, > 1 h; spirals to a pole |
| 14 | s14_why_rhumb | three reasons: one compass setting; short trips (Brest → Lisbon +150 m); a ruler on Mercator; rhumb-line legs |
| 15 | s15_flattening | the orange peel: no flat map without stretching |
| 16 | s16_plate_carree | D48 (1)–(3): unroll the equator (x = a λ) and the meridians (y = a φ); Brest (−500, 5381) km |
| 17 | s17_stretch_k | D48 (4)–(6): 40 030 vs 26 580 km → k = 2πa / (2πa cos φ) = 1/cos φ; 1.5, 2, 4.9; Tissot ovals |
| 18 | s18_mercator_idea | D49: the photo stretch (Like / Unlike), one strip at a time, the oval made round; conformal |
| 19 | s19_mercator_dy | D49: dy = a dφ / cos φ step by step; 1° at Brest 167.4 km, at 60° N 222.4 km |
| 20 | s20_adding_steps | D50: add the drawn steps in 10° steps (table); the steps grow; Edward Wright 1599 |
| 21 | s21_ln_formula | D50: ln primed (e, ln 1 = 0, ln e = 1); y = a ln tan(π/4 + φ/2) matches the sums; Brest 6165 km |
| 22 | s22_slope_check | centred difference at 60°: 0.0698 / 0.0349 ≈ 2.00 = 1/cos 60°; y(0) = 0; the pole at infinity |
| 23 | s23_rhumb_straight | D52: same slant (4.9 west per 1 south), both parts stretched alike → a straight line |
| 24 | s24_area_stretch | D51: 100-km square at 60° N → × 4; k² = 1/cos²φ; Svalbard 24; Greenland vs Africa 14 |
| 25 | s25_equal_earth | Equal Earth; the Sep 2026 anomaly on both maps (apart); angles off 31°; pick the map; *How weather maps are made* |
| 26 | s26_why_many | three good reasons: shape, measurement, meaning |
| 27 | s27_globe_to_pole | D54: the turning globe → above the North Pole → polar stereographic map; rings and spokes labelled |
| 28 | s28_where_is_what | the place tour with latitudes and longitudes; ring first, then spoke; where is Los Angeles? |
| 29 | s29_vortex | 10-hPa heights 21 Jan 2026, contours, labels fade, natural wind trails; 28.6 / 30.7 km; 79 m/s; the polar vortex |
| 30 | s30_vortex_components | D55: i = θ̂, j = −r̂, so u_θ = u, u_r = −v; anticlockwise; like the hurricane, unlike it |
| 31 | s31_origin_wheel | D56 (re-thought): a flat ring of air, the origin moved 500 km; u_r ≈ −4.5, u_θ ≈ 8.9 at one point |
| 32 | s32_origin_vortex | D56: about the pole 17.5 round, 33 in/out (1.9); about the centre 47 and 20 (0.4); *Waves on the jet*, *The polar vortex* |
| 33 | s33_recap | "To sum up …"; last sentence: "Next in this series, … the gradient." |
| 34 | s34_end | series end card, maths ending, word for word |

| # | Scene | Measured length |
|---|---|---|
| 0 | s00_title | 11.2 s (31 w, 1 S, 0 beats) |
| 1 | s01_hook | 25.7 s (72 w, 4 S, 0 beats) |
| 2 | s02_part4_recap | 65.9 s (165 w, 8 S, 0 beats) |
| 3 | s03_curvilinear | 54.7 s (133 w, 8 S, 0 beats) |
| 4 | s04_scale_factors | 99.7 s (234 w, 14 S, 2 beats) |
| 5 | s05_gradient_preview | 62.9 s (146 w, 9 S, 1 beats) |
| 6 | s06_shortest_way | 51.3 s (133 w, 8 S, 0 beats) |
| 7 | s07_great_circle | 59.4 s (156 w, 10 S, 0 beats) |
| 8 | s08_sigma | 62.9 s (161 w, 11 S, 1 beats) |
| 9 | s09_position_arrows | 119.9 s (290 w, 12 S, 6 beats) |
| 10 | s10_cos_sigma | 88.2 s (209 w, 13 S, 5 beats) |
| 11 | s11_distance | 64.7 s (147 w, 7 S, 3 beats) |
| 12 | s12_route_shape | 46.4 s (109 w, 7 S, 1 beats) |
| 13 | s13_rhumb | 63.1 s (155 w, 8 S, 3 beats) |
| 14 | s14_why_rhumb | 85.0 s (219 w, 13 S, 1 beats) |
| 15 | s15_flattening | 29.1 s (73 w, 6 S, 0 beats) |
| 16 | s16_plate_carree | 116.6 s (275 w, 18 S, 4 beats) |
| 17 | s17_stretch_k | 115.2 s (267 w, 15 S, 4 beats) |
| 18 | s18_mercator_idea | 84.0 s (208 w, 14 S, 1 beats) |
| 19 | s19_mercator_dy | 89.0 s (210 w, 13 S, 3 beats) |
| 20 | s20_adding_steps | 112.5 s (283 w, 15 S, 4 beats) |
| 21 | s21_ln_formula | 113.0 s (274 w, 17 S, 4 beats) |
| 22 | s22_slope_check | 98.9 s (234 w, 15 S, 4 beats) |
| 23 | s23_rhumb_straight | 77.1 s (193 w, 13 S, 2 beats) |
| 24 | s24_area_stretch | 85.9 s (197 w, 12 S, 3 beats) |
| 25 | s25_equal_earth | 92.2 s (222 w, 15 S, 1 beats) |
| 26 | s26_why_many | 64.2 s (159 w, 11 S, 0 beats) |
| 27 | s27_globe_to_pole | 80.1 s (189 w, 14 S, 1 beats) |
| 28 | s28_where_is_what | 103.8 s (255 w, 13 S, 2 beats) |
| 29 | s29_vortex | 87.9 s (207 w, 12 S, 2 beats) |
| 30 | s30_vortex_components | 75.4 s (183 w, 11 S, 1 beats) |
| 31 | s31_origin_wheel | 117.6 s (285 w, 17 S, 3 beats) |
| 32 | s32_origin_vortex | 85.1 s (213 w, 11 S, 2 beats) |
| 33 | s33_recap | 103.7 s (250 w, 13 S, 0 beats) |
| 34 | s34_end | 22.9 s (56 w, 3 S, 0 beats) |

**Length:** 45:17.85 measured (2717.850 s = 2715.350 s of narration + the 2.5-s silent end-card hold); **6593 words**,
391 sentences, 64 beats. **Estimate at 142 words per minute:** 6593 / 142 = **46.4 min**. The split plan's
estimate for Part 5 was ≈ 3300 words, 23.2 min; the new derivations (σ, the position arrows, x and y of the plate carrée, k,
dy, the add-up table, the ln primer, the slope check, the area square), the rhumb-line reasons, the globe-to-pole move, the
place tour and the re-thought origin scene add the difference. Part 1 measured 36:28 and that length is accepted.

**User feedback covered (Part 5 items of the split plan §1a; each addressed in this script and the storyboard).**
- [x] U-CO-064 ∇T without a derivation: s05, ≤ 1 min with a worked number (1 °C over 73.8 km, not 111.2), the equation with its scale
  factors underbraced, and "next in this series: *The gradient*" said and written; #6 s22–s23 become the full derivation (split plan §3b).
- [x] U-CO-065 "Los Angeles" cut off: s01, s07, s12, s28 — the label right of and below its dot, ≥ 40 px inside the frame; the camera
  centres the whole route (Must 7).
- [x] U-CO-066 the calculation's picture hard to see: s07 (translucent slicing sheet, the centre shown), s08 (the slice turned face-on: a
  flat circle with two arrows, σ and the arc), s10–s11 (σ and d on the disc, numbers in the column with gold links).
- [x] U-CO-067 why make this calculation: s06 (goal first: fuel and time), s11 (≈ 9.7 h).
- [x] U-CO-068 what σ is and why d = a σ: s08 (σ = the angle at the centre; the face-on slice is Part 1's arc rule; 1° of σ ≈ 111.2 km),
  s09 (both r̂ written out with every input), s10 (cos σ = r̂₁ · r̂₂ with each product), s11 (radians, the result, a second check).
- [x] U-CO-069 why x = a λ, y = a φ: s16 (unroll the equator → x; unroll each meridian → y; Brest worked; true along both).
- [x] U-CO-070 how k = 1/cos φ: s17 (the parallel drawn 2πa long vs its true 2πa cos φ; numbers at Brest first; the cancellation).
- [x] U-CO-071 the Mercator idea (32:45) made intuitive: s18 (the photo stretch, Like / Unlike; one strip at a time; the oval made round
  again; angles kept → conformal).
- [x] U-CO-072 how dy is what is shown: s19 (four steps, each with its reason; numbers at Brest and 60° N; Δ → d).
- [x] U-CO-073 why some prefer the rhumb line: s13 (what it is), s14 (three reasons: one compass setting vs 312° → 214°; Brest → Lisbon only
  150 m longer; a ruler on Mercator; rhumb-line legs), s23 (why it is straight on Mercator).
- [x] U-CO-074 y = a ln tan(π/4 + φ/2) step by step with numbers: s20 (the add-up table), s21 (the natural log primed; the formula matches
  the sums at 60° and Brest), s22 (the numerical slope check, the equator, the pole) — decision 5.
- [x] U-CO-075 how the stretch factor is computed: s24 (a 100-km square at 60° N: × 2 by × 2 = × 4; then k × k; Svalbard 4.9 × 4.9 ≈ 24).
- [x] U-CO-076 "true size" over Greenland: s24 — the map sits below the column text with ≥ 40 px clear; the true-size outlines and their
  numbers go in the column, never on the map.
- [x] U-CO-077 the two maps touch: s25 — Mercator x 80–880 and Equal Earth x 960–1840 (≥ 80 px apart), one shared colour bar below both.
- [x] U-CO-078 start from the rotating globe, rise and zoom to the top, settle on the map: s27 (GlobeToPolarMorph).
- [x] U-CO-079 label latitudes and longitudes: s27 (rings 75, 60, 45, 30° N; spokes 0°, 90° E, 180°, 90° W, each on its words).
- [x] U-CO-080 label major areas with a short tour and their latitude/longitude: s28 (Brest, Iceland, Greenland, Scandinavia, Longyearbyen,
  Barents Sea, Siberia, Bering Strait and Alaska, Canada and Hudson Bay; "ring first, then spoke"; a Los Angeles prediction).
- [x] U-CO-081 drop the labels later if cluttered: s29 (the place labels fade to 40 % and then out when the 10-hPa field arrives; ring and spoke
  labels stay).
- [x] U-CO-082 natural moving wind along the lines: s29 (house FlowParticles trails advected through the day's 10-hPa wind by
  `fluidpy.diag.trajectories.advect_on_sphere`, the weather-basics look; data report §5 recommendation).
- [x] U-CO-083 the 37:04 scene re-thought: s30 (east = round, north = in, one point at a time), s31 (a flat ring of air, the origin moved,
  one point worked by hand: −4.5 in, 8.9 round, "nothing is flowing in"), s32 (the vortex about the pole vs its own centre, in m/s and as
  ratio bars 1.9 / 0.4).
- [x] U-CO-054 every equation and calculation clarified: goal → each factor named → inputs row → CalcStack → meaning, in every scene.
- [x] U-CO-057 nothing used before it is explained: the natural log primed in s21 (owner: this part); the centred difference recalled from #4;
  "anomaly", "great circle", "rhumb line", "plate carrée", "conformal", "equal-area", "polar stereographic", "stratosphere" defined at first use.
- [x] U-CO-099 later-movie concepts ≤ 1 min, then named (voice + keyword): *The gradient* (s05, s33), *Pressure as a vertical coordinate*
  (s05), *How weather maps are made* (s25), *Waves on the jet* and *The polar vortex* (s32); contour lines rely on 0.3 (M01 named in the storyboard only).
- [x] U-CO-100 what is not planned later is explained here: great-circle distance, the rhumb line, plate carrée, Mercator, ln, equal-area maps,
  the polar map, the origin choice.
- [x] U-CO-101 smooth flow across the split: "the last of five parts" (s01), the Part 4 recap (s02), the teaser naming *The gradient* (s33, word
  for word from the split plan §2g).

**Review 1 and fix-loop-1 guards kept in Part 5** (split plan §1b–§1c): Must 6 (stretch bands and links at +48.4, +60, +78.2°; DC32b; Tissot
on the real sphere, `a = EARTH_RADIUS`, never 1), Must 7 (Los Angeles inside the frame), Must 8 (CalcStack x ≥ 1100), Should 8 (s03 no empty
bottom half), Should 9 (s25 maps apart, now ≥ 80 px), Should 10 (s32 ratio bars + tick legend), Should 14 (end card gap), Should 18 (an opening
keyword or picture from frame 0); fix-loop rules 1, 4, 5, 6, 7, 8, 9.

**Cross-part numbers and symbols this part relies on** (also in the storyboard `cross_part`):
- Part 1: polar (r, θ); the arc rule s = r θ (radians); r̂, θ̂; components as dot products; compass bearing from north, clockwise as seen from
  above; "air parcel"; the hurricane ring spinning anticlockwise (NH).
- Part 2: cylindrical coordinates round a hurricane (named only, s03).
- Part 3: φ, λ; **a = 6371 km (easy 6400)**; r̂ = (cos φ cos λ, cos φ sin λ, sin φ) with x to 0° on the equator, y to 90° E, z to the North
  Pole; **Brest 48.39° N, 4.49° W**, cos φ = 0.664, a cos φ ≈ 4230 km; **Δy = a Δφ, 111.2 km per degree**; **Δx = a cos φ Δλ, 73.8 km per degree
  at Brest**; **Longyearbyen 78.22° N, 15.65° E** (1/cos ≈ 4.9); adding up = integration; Δ for a step, d for the limit.
- Part 4: i, j, k at a station; frames that move (recap only).
- Dot product movie: a · b = |a||b| cos(angle), the shadow. #4: the centred difference.
- New shared places for this part: **London 51.51° N, 0.13° W; Los Angeles 34.05° N, 118.24° W** (city centres, the split plan's r̂ values;
  build 1 used the airports).

**Spoken-symbol rules.** No lone "a": the voice says "the Earth's radius" (screen: a), once "the letter a" in s02 (lexicon proposal below).
"sigma", "phi", "lambda", "cosine phi" (never "cos"), "r hat one", "r hat two", "theta hat", "u sub theta", "u sub r", "d y", "d phi", "l n".
Every clockwise/anticlockwise carries "as seen from above" (and "the North Pole" on the polar map).

**Proposed lexicon entries** (not added; check by ear in the dry-run audio): `the letter a` → `the letter [A](/ˈA/)` (symbols, case-sensitive),
Mercator, Gerardus ("Jeh-rar-dus"), rhumb ("rum"), plate carrée ("plat kar-ay"), Longyearbyen ("Long-yeer-bee-en"), Svalbard ("Svahl-bar"),
Barents ("Bar-ents"), stereographic, Greenwich ("Gren-itch"), Lisbon, "l n" ("ell en").

**Measured** (`tools/tts.py` dry run 2026-11-05 into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_maps/dryrun1`, Kokoro af_bella × 1.0, current `movies/lexicon.yaml`, not edited):
**391 sentences, 6593 words, 64 beats; narration 2715.350 s + 2.5-s silent end-card hold = 2717.850 s (45:17.85)**; speech alone
2490.3 s = 158.9 words per minute while speaking, **145.7 words per minute overall** (limit 150); 665 caption cues; warnings: s30_vortex_components s4: 17.3 chars/s > 17.0 (slow the speed or shorten).

## s00_title
In this video, we'll learn routes and maps of our round Earth the easy way, and see how meteorology uses them to plan flights and read maps from above the pole.

> 31 words · 1 sentences · 0 beats · 0.300–11.475 s (11.2 s; speech 10.4 s) · 0:00.30–0:11.47 (measured, dry run 2026-11-05).

## s01_hook
What's the shortest way from London to Los Angeles, and why does it look curved on most maps? This is the last of five parts on coordinates. Let's find the shortest route over our round Earth, and see how its length is measured. Then let's see how the Earth is flattened onto maps, what each kind of map stretches, and how to read a weather map drawn from above the North Pole.

> 72 words · 4 sentences · 0 beats · 11.475–37.150 s (25.7 s; speech 23.8 s) · 0:11.47–0:37.15 (measured, dry run 2026-11-05).

## s02_part4_recap
Here's what we'll use from the earlier parts. In Part 1, we met polar coordinates, and the arc rule: the distance along a circle is its radius times the angle, in radians. In Part 3, we gave each place on the Earth a latitude, phi, and a longitude, lambda. We write the Earth's radius as the letter a: about six thousand four hundred kilometres, or more exactly six thousand three hundred and seventy one. A place's position arrow of length one, from the Earth's centre, is cosine phi cosine lambda, cosine phi sine lambda, sine phi. One degree of latitude is about a hundred and eleven kilometres everywhere. One degree of longitude is that times cosine phi, so it shrinks towards the poles. In Part 4, we stood at a weather station with its own east, north and up arrows, i, j and k, and saw how they turn as the air moves, and how a moving storm looks from frames that move with it.

> 165 words · 8 sentences · 0 beats · 37.150–103.075 s (65.9 s; speech 62.7 s) · 0:37.15–1:43.08 (measured, dry run 2026-11-05).

## s03_curvilinear
Let's start by putting our coordinate systems side by side: polar coordinates on a flat map, cylindrical coordinates round a hurricane, and latitude and longitude on the Earth. They're all called curvilinear coordinates, which means coordinates whose lines can curve. They share three features. First, the coordinate lines are curves: the rings round a radar, the circles of latitude, and the meridians. Second, the unit vectors change from place to place: r hat and theta hat turn as we go round, and so do the east and north arrows on the globe. Third, a change in a coordinate isn't a distance by itself. Turning by one degree can mean a short walk or a long one, depending on where you are. That third feature needs a name, so let's look at it closely.

> 133 words · 8 sentences · 0 beats · 103.075–157.825 s (54.7 s; speech 51.5 s) · 1:43.08–2:37.82 (measured, dry run 2026-11-05).

## s04_scale_factors
How far do we walk when one coordinate changes by a small step? In Part 1, on a ring of radius r, turning by a small angle delta theta walks r times delta theta. So for theta, the distance walked is r times the step. That multiplier, the metres walked per unit of the coordinate, is called a scale factor. For theta, the scale factor is r. On the Earth, stepping north by delta phi walks the Earth's radius times delta phi, so the scale factor of latitude is the Earth's radius. Stepping east by delta lambda walks round a parallel, a circle whose radius is the Earth's radius times cosine phi. So the scale factor of longitude is the Earth's radius times cosine phi. Let's put numbers on it at Brest, at forty eight point four degrees north. One degree is zero point zero one seven four five radians. So one degree north walks six thousand three hundred and seventy one kilometres times zero point zero one seven four five, about a hundred and eleven point two kilometres. [beat] The cosine of forty eight point four degrees is zero point six six four. So one degree east walks a hundred and eleven point two times zero point six six four, only about seventy three point eight kilometres. [beat] The same one-degree step gives two different distances, and the scale factors keep track of that.

> 234 words · 14 sentences · 2 beats · 157.825–257.475 s (99.7 s; speech 92.0 s) · 2:37.82–4:17.48 (measured, dry run 2026-11-05).

## s05_gradient_preview
Scale factors show up whenever we measure how fast something changes across a map. Suppose two grid points near Brest are one degree of longitude apart, and the temperature differs by one degree Celsius between them. The slope we want is per kilometre, not per degree. So we divide by the true distance, seventy three point eight kilometres, not by a hundred and eleven point two. That's about one point four degrees per hundred kilometres. [beat] In symbols, the eastward slope is one over the Earth's radius times cosine phi, times the change with longitude. Together with the northward slope, it makes the gradient on the sphere. We'll build it step by step in the next movie in this series: The gradient. Weather models also use a curvilinear coordinate in the vertical, pressure instead of height, which has its own movie too: Pressure as a vertical coordinate.

> 146 words · 9 sentences · 1 beats · 257.475–320.375 s (62.9 s; speech 58.1 s) · 4:17.48–5:20.38 (measured, dry run 2026-11-05).

## s06_shortest_way
Now let's put coordinates to work on a question every airline asks: what's the shortest way between two places? It matters, because a shorter route burns less fuel and takes less time. On a flat sheet of paper, the shortest way is a straight line. But a plane can't tunnel through the Earth, so it has to follow the curved surface. On a sphere, the shortest way follows a great circle. A great circle is any circle on the sphere whose centre is the centre of the Earth. The equator is one, and so is every meridian, together with its partner on the other side of the globe. The other circles of latitude are not great circles: their centres sit on the Earth's axis, above or below the Earth's centre, so they're smaller.

> 133 words · 8 sentences · 0 beats · 320.375–371.650 s (51.3 s; speech 48.0 s) · 5:20.38–6:11.65 (measured, dry run 2026-11-05).

## s07_great_circle
Let's find the great circle through London and Los Angeles. London is at fifty one and a half degrees north, almost on the prime meridian. Los Angeles is at thirty four degrees north, and a hundred and eighteen degrees west. Picture a flat sheet slicing through the globe, so that it passes through London, through Los Angeles, and through the Earth's centre. Three points that aren't in a line fix exactly one flat sheet, just as three legs steady a stool. Where the sheet cuts the Earth's surface, it traces a great circle, and the part between the two cities is the great circle route. Why is it the shortest? Think of all the circles on the globe that pass through both cities. The great circle is the biggest of them, so between the two cities it bends the least. A string pulled tight between the two cities on a desk globe lies right along it.

> 156 words · 10 sentences · 0 beats · 371.650–431.000 s (59.4 s; speech 55.4 s) · 6:11.65–7:11.00 (measured, dry run 2026-11-05).

## s08_sigma
How long is this route? Let's turn the globe, so that we look straight at the slicing sheet. Now it's just a flat circle, with the Earth's centre in the middle, and its radius is the Earth's radius. Draw one arrow from the centre to London, and another one to Los Angeles. The angle between these two arrows, at the Earth's centre, is called sigma. The route is the arc of the circle between the two arrow tips. And that's exactly the picture of the arc rule from Part 1: the distance along a circle is the radius times the angle. So the distance d equals the Earth's radius times sigma, with sigma in radians. [beat] Here's a way to feel it. Every degree of sigma is one degree of a great circle, about a hundred and eleven point two kilometres on the ground, just like a degree of latitude along a meridian. So once we know sigma, we know the distance.

> 161 words · 11 sentences · 1 beats · 431.000–493.925 s (62.9 s; speech 57.5 s) · 7:11.00–8:13.93 (measured, dry run 2026-11-05).

## s09_position_arrows
To find sigma, we need the two position arrows of length one, r hat one for London and r hat two for Los Angeles. From Part 3, each one is cosine phi cosine lambda, cosine phi sine lambda, sine phi. London is at fifty one point five one degrees north, and zero point one three degrees west, so its lambda is minus zero point one three degrees. The cosine of fifty one point five one degrees is zero point six two two, and the cosine of minus zero point one three degrees is almost exactly one. So the first part is zero point six two two. [beat] The sine of minus zero point one three degrees is minus zero point zero zero two three, so the second part is zero point six two two times that, about minus zero point zero zero one. [beat] The third part is the sine of fifty one point five one degrees, zero point seven eight three. [beat] Los Angeles is at thirty four point zero five degrees north, and a hundred and eighteen point two four degrees west, so its lambda is minus a hundred and eighteen point two four degrees. Its cosine phi is zero point eight two nine, its cosine lambda is minus zero point four seven three, and its sine lambda is minus zero point eight eight one. So its first part is zero point eight two nine times minus zero point four seven three, about minus zero point three nine two. [beat] Its second part is zero point eight two nine times minus zero point eight eight one, about minus zero point seven three zero. [beat] And its third part, the sine of thirty four point zero five degrees, is zero point five six zero. [beat]

> 290 words · 12 sentences · 6 beats · 493.925–613.875 s (119.9 s; speech 108.9 s) · 8:13.93–10:13.88 (measured, dry run 2026-11-05).

## s10_cos_sigma
Now let's use the rule from the dot product movie. The dot product of two arrows is the product of their lengths, times the cosine of the angle between them. Our two arrows both have length one, so their dot product is just the cosine of sigma. That's the shadow picture again: the shadow of one arrow of length one on the other. To take the dot product, multiply the matching parts and add. Zero point six two two times minus zero point three nine two is minus zero point two four four. [beat] Minus zero point zero zero one times minus zero point seven three zero is about plus zero point zero zero one. [beat] And zero point seven eight three times zero point five six zero is zero point four three eight. [beat] Adding the three gives about zero point one nine five. So the cosine of sigma is zero point one nine five. [beat] Which angle has a cosine of zero point one nine five? A calculator's inverse cosine says about seventy eight point seven degrees. [beat] A cosine just below zero point two means an angle a little less than ninety degrees, so London and Los Angeles are almost a quarter of the way round the Earth from each other.

> 209 words · 13 sentences · 5 beats · 613.875–702.125 s (88.2 s; speech 77.5 s) · 10:13.88–11:42.12 (measured, dry run 2026-11-05).

## s11_distance
The arc rule needs sigma in radians. One degree is pi over a hundred and eighty radians, about zero point zero one seven four five. So seventy eight point seven four degrees is seventy eight point seven four times zero point zero one seven four five, about one point three seven four two radians. [beat] Now the distance is the Earth's radius times sigma: six thousand three hundred and seventy one kilometres times one point three seven four two. That's about eight thousand seven hundred and fifty five kilometres. [beat] Let's check it the quick way: seventy eight point seven four degrees, times a hundred and eleven point two kilometres per degree, is again about eight thousand seven hundred and fifty five kilometres. [beat] At a cruising speed of about nine hundred kilometres per hour, that's nearly ten hours in the air, before any help or hindrance from the winds.

> 147 words · 7 sentences · 3 beats · 702.125–766.825 s (64.7 s; speech 58.3 s) · 11:42.12–12:46.83 (measured, dry run 2026-11-05).

## s12_route_shape
Where does this route go? On most flat maps, Los Angeles looks to the west-south-west of London. But the great circle leaves London heading north-west, at a compass bearing of about three hundred and twelve degrees. It climbs to its highest latitude, about sixty two point four degrees north, near the south-west coast of Greenland. Then it turns south over northern Canada, and arrives at Los Angeles heading south-west, at a bearing of about two hundred and fourteen degrees. [beat] So along the way, the compass heading changes by almost a hundred degrees. That's why flights from Europe to California pass over Greenland and Canada.

> 109 words · 7 sentences · 1 beats · 766.825–813.225 s (46.4 s; speech 42.3 s) · 12:46.83–13:33.23 (measured, dry run 2026-11-05).

## s13_rhumb
Sailors used a different route for centuries. It's called the rhumb line: a route that keeps the same compass bearing all the way, so it crosses every meridian at the same angle. From London to Los Angeles, the rhumb line holds a bearing of about two hundred and fifty eight and a half degrees, a little south of due west. It stays further south than the great circle, and it's about nine thousand seven hundred and thirty three kilometres long. [beat] How much longer is that? Nine thousand seven hundred and thirty three divided by eight thousand seven hundred and fifty five is about one point one one, so the rhumb line is about eleven percent longer. [beat] The extra is about nine hundred and seventy eight kilometres, more than an hour of flying at nine hundred kilometres per hour. [beat] And if you kept following a rhumb line, it would spiral round and round towards a pole.

> 155 words · 8 sentences · 3 beats · 813.225–876.300 s (63.1 s; speech 56.4 s) · 13:33.23–14:36.30 (measured, dry run 2026-11-05).

## s14_why_rhumb
So why would anyone choose the longer route? There are three reasons. The first is steering. A rhumb line needs one compass setting for the whole trip: set two hundred and fifty eight and a half degrees, and hold it. The great circle needs a new heading all the time, from three hundred and twelve degrees at London to two hundred and fourteen at Los Angeles. Before satellites and computers, a ship's navigator with a compass could steer a rhumb line easily, but a great circle only with a lot of calculation. The second reason is that, on short trips, the extra distance is tiny. From Brest to Lisbon, about one thousand one hundred and thirty eight kilometres, the rhumb line is only about a hundred and fifty metres longer. [beat] The third reason is a map. On the most famous flat map, the Mercator map, a rhumb line is a straight line. So a navigator could draw the route with a ruler, read off its angle, and steer by it. That's why long voyages were often split into a few rhumb-line legs that follow the great circle closely: each leg is easy to steer, and the whole route is nearly the shortest. To see why that map makes rhumb lines straight, we first need to flatten the Earth.

> 219 words · 13 sentences · 1 beats · 876.300–961.275 s (85.0 s; speech 78.8 s) · 14:36.30–16:01.27 (measured, dry run 2026-11-05).

## s15_flattening
And here's the catch: you can't flatten a sphere without stretching or tearing it. Try it with an orange peel. Cut it into slices from pole to pole, and lay them flat, and gaps open up between them. Close the gaps by stretching, and the shapes change. Every flat map of the Earth makes a choice about what to stretch. Let's build the simplest map, and work out exactly how much it stretches.

> 73 words · 6 sentences · 0 beats · 961.275–990.400 s (29.1 s; speech 26.6 s) · 16:01.27–16:30.40 (measured, dry run 2026-11-05).

## s16_plate_carree
We'll build it from the lines on the globe whose lengths we know. First, the equator. Cut it, and unroll it into a straight line across the page. Its length is two pi times the Earth's radius, about forty thousand kilometres. A place at longitude lambda, in radians, is the Earth's radius times lambda along the equator from the prime meridian. That's the arc rule again. So we set x equal to the Earth's radius times lambda. [beat] Second, the meridians. Each one runs from the equator to the pole, and a place at latitude phi is the Earth's radius times phi from the equator, along its meridian. That's the distance north from Part 3. So we draw every meridian as a straight line going up the page, and set y equal to the Earth's radius times phi. [beat] Let's try Brest, at forty eight point four degrees north, and four and a half degrees west. In radians, that's zero point eight four four six, and minus zero point zero seven eight four. So x is six thousand three hundred and seventy one times minus zero point zero seven eight four, about minus five hundred kilometres: just west of the middle line. [beat] And y is six thousand three hundred and seventy one times zero point eight four four six, about five thousand three hundred and eighty one kilometres. [beat] That's exactly how far Brest is from the equator, walking north along its meridian. So along the equator, and along every meridian, this map is true to scale. It's called the plate carrée, French for flat square, and most weather data come on exactly this kind of grid.

> 275 words · 18 sentences · 4 beats · 990.400–1107.000 s (116.6 s; speech 105.3 s) · 16:30.40–18:27.00 (measured, dry run 2026-11-05).

## s17_stretch_k
Now look at a circle of latitude, called a parallel. On this map, every parallel is drawn as a straight line across the page, as long as the equator: two pi times the Earth's radius, about forty thousand and thirty kilometres. But on the globe, the parallel through Brest is a smaller circle. As we saw in Part 3, its radius is the Earth's radius times cosine phi, about four thousand two hundred and thirty kilometres. So its true length is two pi times four thousand two hundred and thirty, about twenty six thousand five hundred and eighty kilometres. [beat] The map draws twenty six thousand five hundred and eighty kilometres as forty thousand and thirty. So east-west distances at Brest are stretched by forty thousand and thirty divided by twenty six thousand five hundred and eighty, about one point five. [beat] Let's write that with symbols. The stretch, called k, is two pi times the Earth's radius, divided by two pi times the Earth's radius times cosine phi. The two pi and the radius cancel, so k equals one over cosine phi. [beat] At Brest, that's one over zero point six six four, about one point five. At sixty degrees north, it's one over zero point five, which is two. And at Longyearbyen, on Svalbard, at seventy eight point two degrees north, it's one over zero point two zero four, almost five. [beat] North-south distances aren't stretched at all. So a small circle near Brest is drawn as an oval, one and a half times wider than it is tall, and near the poles, shapes are squashed flat.

> 267 words · 15 sentences · 4 beats · 1107.000–1222.150 s (115.2 s; speech 104.8 s) · 18:27.00–20:22.15 (measured, dry run 2026-11-05).

## s18_mercator_idea
In fifteen sixty nine, the map maker Gerardus Mercator had a clever idea to fix those squashed shapes. Think of stretching a photo. If you stretch it only sideways, faces look too wide. But if you also stretch it up and down by the same amount, faces look right again, just bigger. Mercator did this to the map, one strip of latitude at a time. Near Brest, east-west is stretched by one point five, so he stretched north-south near Brest by one point five too. Near sixty degrees north, both by two. Near Svalbard, both by almost five. [beat] Now watch a small circle from the globe. On the flat square map, it becomes an oval, too wide. Stretch its strip north-south by the same factor, and it becomes a circle again, only bigger. Unlike a photo, though, each strip of latitude needs its own stretch, so the map grows taller and taller towards the poles. Because small shapes stay the right shape, small angles stay true as well: the angle at which a road crosses a meridian on the map is the angle on the ground. Maps like this are called conformal, which means that they keep shapes and angles right in every small patch.

> 208 words · 14 sentences · 1 beats · 1222.150–1306.200 s (84.0 s; speech 77.5 s) · 20:22.15–21:46.20 (measured, dry run 2026-11-05).

## s19_mercator_dy
Let's turn that idea into a formula, one step at a time. Take a small step north on the globe, by delta phi. From Part 3, its true length is the Earth's radius times delta phi. On the flat square map, it's drawn just that long, while east-west is drawn one over cosine phi times too long. To keep the shapes, Mercator draws the north step one over cosine phi times longer too. So on his map, the step is drawn as the Earth's radius times delta phi, divided by cosine phi. [beat] Let's put in numbers. One degree north is a hundred and eleven point two kilometres on the ground, everywhere. At Brest, Mercator draws it a hundred and eleven point two times one point five zero six long, about a hundred and sixty seven point four kilometres. [beat] At sixty degrees north, he draws it twice as long, about two hundred and twenty two point four kilometres. [beat] When the step is tiny, we write d instead of delta, as in Part 3. So d y equals the Earth's radius times d phi, divided by cosine phi. This says how fast the map's height grows as we go north: slowly near the equator, and faster and faster towards the pole.

> 210 words · 13 sentences · 3 beats · 1306.200–1395.175 s (89.0 s; speech 80.5 s) · 21:46.20–23:15.17 (measured, dry run 2026-11-05).

## s20_adding_steps
So how high up the map is a place at latitude phi? It's the sum of all the drawn steps, from the equator up to phi. Let's add them up, ten degrees at a time. Ten degrees is zero point one seven four five radians. For each step, we use the stretch in the middle of the step. From zero to ten degrees, the middle is five degrees, where one over cosine is one point zero zero four. So the first step is drawn zero point one seven four five times one point zero zero four, about zero point one seven five times the Earth's radius, or about one thousand one hundred and sixteen kilometres. [beat] From ten to twenty degrees, the middle is fifteen degrees, the stretch is one point zero three five, and the step is zero point one eight one. The running total is zero point three five six. [beat] From twenty to thirty degrees, the stretch is one point one zero three, the step is zero point one nine three, and the total is zero point five four nine. [beat] Let's speed up. The total reaches about one point zero one at fifty degrees, one point three one at sixty, one point seven three at seventy, and two point four at eighty. [beat] Look at the steps: they grow as we go north, because the stretch grows. The last ten degrees, from eighty to ninety, add at least two more on their own, and we'll see soon that they add far more. Navigators really did it this way: in fifteen ninety nine, the English mathematician Edward Wright published a table made by adding up such steps, one minute of latitude at a time.

> 283 words · 15 sentences · 4 beats · 1395.175–1507.650 s (112.5 s; speech 102.2 s) · 23:15.17–25:07.65 (measured, dry run 2026-11-05).

## s21_ln_formula
Adding up tiny steps like this is the integration we met in Part 3, and this sum has an exact answer. To write it, we need one new tool, the natural logarithm, written l n. The number e is about two point seven one eight. The natural logarithm of a number answers one question: e to what power gives this number? So l n of one is zero, because e to the power zero is one. And l n of e is one. [beat] Here's the answer to our sum: y equals the Earth's radius, times the natural logarithm of the tangent of forty five degrees plus half the latitude. Forty five degrees is pi over four radians, so on screen it's pi over four plus phi over two. Let's test it against our table. At sixty degrees, forty five plus thirty is seventy five degrees. Its tangent is three point seven three two, and l n of three point seven three two is one point three one seven. [beat] Our ten-degree sum gave one point three one three, very close. With one-degree steps, the sum gives one point three one seven, the same to three decimals. [beat] At Brest, forty five plus half of forty eight point four is sixty nine point two degrees. Its tangent is two point six three two, and its l n is zero point nine six eight. So on a Mercator map, Brest sits zero point nine six eight times the Earth's radius above the equator, about six thousand one hundred and sixty five kilometres. [beat] On the flat square map, it was five thousand three hundred and eighty one.

> 274 words · 17 sentences · 4 beats · 1507.650–1620.675 s (113.0 s; speech 102.0 s) · 25:07.65–27:00.67 (measured, dry run 2026-11-05).

## s22_slope_check
How can we be sure the formula is right everywhere, not just at a few points? Its slope must match the drawn step: one over cosine phi for each radian of phi. Let's check its slope at sixty degrees with the centred difference from the derivatives movie. At sixty one degrees, the formula gives one point three five two four. At fifty nine degrees, it gives one point two eight two six. [beat] The difference is zero point zero six nine eight, and the two points are two degrees apart, which is zero point zero three four nine radians. Zero point zero six nine eight divided by zero point zero three four nine is about two point zero zero. [beat] And one over the cosine of sixty degrees is exactly two. So the formula's slope is the stretch we wanted. Two more checks. At the equator, the tangent of forty five degrees is one, and l n of one is zero, so y is zero, as it should be. [beat] And at the pole, the angle becomes ninety degrees, where the tangent has no end: it grows without limit. So the pole is infinitely far up the map. At eighty five degrees, y is already three point one three times the Earth's radius, about nineteen thousand nine hundred and fifty kilometres. [beat] That's why Mercator maps are always cut off before the poles, usually somewhere past eighty degrees.

> 234 words · 15 sentences · 4 beats · 1620.675–1719.575 s (98.9 s; speech 88.6 s) · 27:00.67–28:39.58 (measured, dry run 2026-11-05).

## s23_rhumb_straight
Now we can see why a rhumb line is straight on a Mercator map. A rhumb line keeps one compass bearing. Zoom into any short piece of it. On the globe, it's a tiny slanted step: some distance west, and some distance south. Keeping the same bearing means the same slant everywhere. For our route at two hundred and fifty eight and a half degrees, every piece goes about four point nine kilometres west for each kilometre south. [beat] Now draw it on the Mercator map. At each latitude, Mercator stretches the west part and the south part by the same amount, one over cosine phi. Stretching both parts by the same amount leaves their ratio unchanged. So on the map, every piece of the route has the same slant, four point nine across for each one down. A line whose slant never changes is a straight line. [beat] The great circle keeps changing its bearing, so on this map it comes out curved, bulging towards the pole. The two routes swap looks: on the globe, the great circle looks straight and the rhumb line curves, and on Mercator's map it's the other way round.

> 193 words · 13 sentences · 2 beats · 1719.575–1796.725 s (77.1 s; speech 69.9 s) · 28:39.58–29:56.72 (measured, dry run 2026-11-05).

## s24_area_stretch
But keeping shapes has a price: sizes. How much is an area stretched? Take a small square on the globe at sixty degrees north, a hundred kilometres on each side. Its area is a hundred times a hundred, ten thousand square kilometres. On a Mercator map, its width is stretched by two, and its height by two as well. So it's drawn two hundred by two hundred, which is forty thousand square kilometres: four times too big. [beat] In general, the width is stretched by k and the height by k, so the area is stretched by k times k, k squared, which is one over cosine phi, squared. At Svalbard, k is about four point nine, so areas are stretched by about four point nine times four point nine, about twenty four. [beat] That's why, on a Mercator map, Greenland looks about as big as Africa. In truth, Greenland covers about two point one seven million square kilometres, and Africa about thirty point four million. Thirty point four divided by two point one seven is about fourteen, so Africa is about fourteen times bigger. [beat] The Mercator map is great for directions and shapes, and poor for comparing sizes.

> 197 words · 12 sentences · 3 beats · 1796.725–1882.575 s (85.9 s; speech 77.8 s) · 29:56.72–31:22.58 (measured, dry run 2026-11-05).

## s25_equal_earth
For climate maps, sizes often matter more. If we want to know how much of the Earth was warmer than usual last month, a map that inflates the polar regions would mislead us. So climate scientists often use equal-area maps, such as the Equal Earth map, from twenty eighteen. On it, every patch keeps its true share of the Earth's area, so Greenland shows at its real size, about a fourteenth of Africa. Here's the same temperature map for September twenty twenty six, drawn both ways. The colours show how much warmer or colder each place was than its usual September, the average from nineteen ninety one to twenty twenty. That difference from the usual is called an anomaly. On the Mercator map, the far north looks huge. On the Equal Earth map, it shrinks to its true size. The price now is shape. Towards the poles, shapes get skewed: at sixty degrees north and thirty degrees east, angles can be off by about thirty one degrees. [beat] No flat map can keep both areas and shapes right everywhere. So the rule is: pick the map for the job. Use conformal maps for winds and directions, and equal-area maps for comparing amounts. Which maps forecasters use, and why, has its own movie later in this series: How weather maps are made.

> 222 words · 15 sentences · 1 beats · 1882.575–1974.750 s (92.2 s; speech 85.3 s) · 31:22.58–32:54.75 (measured, dry run 2026-11-05).

## s26_why_many
So why are there so many coordinate systems and maps? There are three good reasons. The first is shape. When the coordinates match the shape of the problem, the numbers become simple. A ring round a hurricane's eye is just r equals a constant, the Earth's surface is just r equals its radius, and a great circle route is just one angle, sigma. The second is measurement. We use the coordinates that our instruments and data use. A radar sees distance and direction, a weather station feels east, north and up, and weather data come on a grid of latitude and longitude. The third is meaning. The right coordinates split a vector into the parts that physics cares about: spin and inflow round a storm, along and across a coast, or round and in for a whirl round the pole, as we'll see next. Maps follow the same rule: we choose the one that keeps what our question needs.

> 159 words · 11 sentences · 0 beats · 1974.750–2038.925 s (64.2 s; speech 59.9 s) · 32:54.75–33:58.92 (measured, dry run 2026-11-05).

## s27_globe_to_pole
There's one more map that every forecaster knows: the view from above a pole. Let's get there from the globe. Here's the Earth, turning. Now let's rise up above the North Pole, and look straight down. From up here, the circles of latitude become rings round the pole, and the meridians become spokes, like the spokes of a wheel. Now let's flatten this view into a map. The North Pole sits in the middle. The rings are the latitudes: seventy five, sixty, forty five and thirty degrees north, going outward. The spokes are the longitudes. Zero degrees, the prime meridian through Greenwich, points down. Ninety degrees east points right, a hundred and eighty degrees points up, and ninety degrees west points left. [beat] So going east means going round anticlockwise, as seen from above the North Pole. This is polar coordinates again: the distance from the middle grows with the distance from the pole, and the angle round the middle is the longitude. This kind of map is called polar stereographic, and this one is drawn true to scale at sixty degrees north, like many weather charts of the pole.

> 189 words · 14 sentences · 1 beats · 2038.925–2119.000 s (80.1 s; speech 73.6 s) · 33:58.92–35:19.00 (measured, dry run 2026-11-05).

## s28_where_is_what
If you've never seen a map like this, it can be hard to tell where things are, so let's take a short tour. To find any place, first find its ring, for the latitude, and then its spoke, for the longitude. Near the bottom, at forty eight point four degrees north and four and a half degrees west, is Brest: just past the forty five degree ring, a little left of the zero spoke. Closer to the pole, past the sixty degree ring, is Iceland, at about sixty five degrees north and nineteen degrees west. To its left is Greenland, the big island, around seventy two degrees north and forty degrees west. To the right of the zero spoke is Scandinavia. Further in, at seventy eight point two degrees north and fifteen point six degrees east, is Longyearbyen, on Svalbard. Between Scandinavia and the pole lies the Barents Sea, around seventy five degrees north and forty degrees east. To the right, along the ninety degrees east spoke, stretches Siberia. At the top, near a hundred and eighty degrees, is the Bering Strait, with Alaska to its left, around sixty five degrees north and a hundred and fifty degrees west. And on the left, along ninety degrees west, is Canada, with Hudson Bay at about sixty degrees north. [beat] One last test: where's Los Angeles, at thirty four degrees north and a hundred and eighteen degrees west? Just outside the thirty degree ring, between the ninety west and the hundred and eighty spokes, on the upper left. [beat]

> 255 words · 13 sentences · 2 beats · 2119.000–2222.800 s (103.8 s; speech 96.9 s) · 35:19.00–37:02.80 (measured, dry run 2026-11-05).

## s29_vortex
Now let's put real weather on this map. The air pressure falls as we go up. About thirty kilometres up, in the stratosphere, the layer above the one where our weather happens, it's only ten hectopascals, about a hundredth of the pressure at the ground. The height where the pressure is exactly ten hectopascals isn't the same everywhere, and this map shows it on the twenty first of January, twenty twenty six. The colours show that height, and the lines join places where it's the same, every four hundred metres. We'll fade the place labels now, so that the weather is easy to see. The surface is lowest, about twenty eight point six kilometres, over the Barents Sea, at about seventy three degrees north and forty four degrees east. And it's higher further south: about thirty point seven kilometres on average along thirty degrees north. [beat] Now let's let the air move. The winds blow nearly along these lines, round and round the Arctic, from west to east. The fastest, nearly eighty metres per second, about two hundred and eighty five kilometres per hour, blow over Siberia, near sixty degrees north. [beat] This great winter whirl of cold air, high above the Arctic, is called the stratospheric polar vortex.

> 207 words · 12 sentences · 2 beats · 2222.800–2310.675 s (87.9 s; speech 80.9 s) · 37:02.80–38:30.68 (measured, dry run 2026-11-05).

## s30_vortex_components
Let's describe these winds in the map's polar coordinates. Pick any point, and draw its east and north arrows. The east arrow points round the middle, anticlockwise as seen from above: it's exactly the map's theta hat at that point. The north arrow points straight at the middle, towards the pole. That's the opposite of r hat, which points away from the middle. So the north arrow is minus r hat. [beat] That means the eastward wind u is the tangential wind round the pole, and the northward wind v is the radial wind with its sign flipped, because blowing north means blowing in. So u sub theta equals u, and u sub r equals minus v. Westerly winds, the winds from the west, go round anticlockwise, as seen from above the North Pole. So the polar vortex spins the same way as the hurricane in Part 1, but it's far wider: thousands of kilometres across, instead of about a hundred. And unlike a hurricane, it isn't fed by a warm sea: it forms because the polar stratosphere cools in the long winter night.

> 183 words · 11 sentences · 1 beats · 2310.675–2386.100 s (75.4 s; speech 70.0 s) · 38:30.68–39:46.10 (measured, dry run 2026-11-05).

## s31_origin_wheel
There's one more choice hidden in polar coordinates: where to put the origin. Let's see why it matters with a simple flat example first. Picture a ring of air, a thousand kilometres from its own centre, going round anticlockwise at ten metres per second. With the origin at its centre, every air parcel on the ring moves purely round. The tangential wind is ten, and the radial wind is zero, all the way round. Now keep the same air, but move the origin five hundred kilometres to the west. Look at the top of the ring, due north of the centre. There, the wind blows due west: u is minus ten, and v is zero. Seen from the new origin, this point is five hundred kilometres east and a thousand kilometres north. Its distance is the square root of five hundred squared plus a thousand squared, about one thousand one hundred and eighteen kilometres. So its r hat is five hundred and a thousand, each divided by one thousand one hundred and eighteen: zero point four four seven, zero point eight nine four. [beat] The radial wind is minus ten times zero point four four seven, plus zero times zero point eight nine four, which is about minus four and a half. It looks as if the air is flowing in. [beat] The tangential wind uses theta hat, minus zero point eight nine four, zero point four four seven. It's minus ten times minus zero point eight nine four, plus zero, which is about eight point nine. [beat] Same air, same wind, but the new origin splits it differently. Nothing is flowing in at all: the in and out part comes only from where we put the origin.

> 285 words · 17 sentences · 3 beats · 2386.100–2503.650 s (117.6 s; speech 107.7 s) · 39:46.10–41:43.65 (measured, dry run 2026-11-05).

## s32_origin_vortex
Now back to the vortex. Its own centre isn't at the pole. It's at about seventy two point nine degrees north and forty four point three degrees east, over the Barents Sea, about one thousand nine hundred kilometres from the pole. Let's draw a ring two thousand kilometres from the pole, and split the winds on it with the pole as the origin. The round part averages only about seventeen and a half metres per second, and the in and out part is typically about thirty three, almost twice as big: a ratio of about one point nine. [beat] Now draw a ring two thousand kilometres from the vortex's own centre instead. The round part averages about forty seven metres per second, and the in and out part is typically about twenty, less than half: a ratio of about zero point four. [beat] So about its own centre, the vortex is mostly spin, just like the hurricane round its eye. Choosing the origin is part of choosing good coordinates: put it at the centre of the thing that turns. When the polar vortex weakens or splits, cold air can spill south into the places where people live. That story has its own movies later in this series: Waves on the jet, and The polar vortex.

> 213 words · 11 sentences · 2 beats · 2503.650–2588.725 s (85.1 s; speech 78.5 s) · 41:43.65–43:08.72 (measured, dry run 2026-11-05).

## s33_recap
To sum up, curvilinear coordinates have curved lines, unit vectors that turn, and scale factors that turn a change of coordinate into a distance. On the Earth, the scale factor of latitude is the Earth's radius, and of longitude, the radius times cosine phi. The shortest way between two places follows a great circle, whose centre is the Earth's centre. Its length is the Earth's radius times sigma, the angle at the centre, and the cosine of sigma is the dot product of the two position arrows. From London to Los Angeles, that's about seventy eight point seven degrees, or about eight thousand seven hundred and fifty five kilometres. A rhumb line keeps one compass bearing, so it's easy to steer, but here it's about eleven percent longer. Flattening the Earth always stretches something. The flat square map stretches east-west by one over cosine phi. Mercator stretches north-south by the same amount, so small shapes and angles stay right, and rhumb lines are straight. His map's height is the Earth's radius times l n of the tangent of forty five degrees plus half the latitude. But areas grow by one over cosine phi, squared, so equal-area maps are better for comparing amounts. Seen from above the North Pole, a map is polar coordinates again: east is round, north is in, and the polar vortex is mostly spin about its own centre. Next in this series, we'll measure how fast the temperature changes across a map: the gradient.

> 250 words · 13 sentences · 0 beats · 2588.725–2692.450 s (103.7 s; speech 98.7 s) · 43:08.72–44:52.45 (measured, dry run 2026-11-05).

## s34_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for coordinates, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 56 words · 3 sentences · 0 beats · 2692.450–2715.350 s (22.9 s; speech 21.9 s) · 44:52.45–45:15.35 (measured, dry run 2026-11-05).
