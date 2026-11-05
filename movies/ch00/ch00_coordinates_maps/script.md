# ch00_coordinates_maps — narration (movie-director, 2026-11-05)

Series plan v6 (amended 2026-11-05: seven parts) **#5g, position 13**: "Coordinates, Part 7 — Maps: projections and the view from the pole" (title
card: "Coordinates · Part 7" / "Maps" / "projections and the view from the pole"; the spoken s00 sentence stays short).
Split plan `movies/ch00/ch00_coordinates/split_plan.md` §2f2 (seven parts). House style `movies/HOUSE_STYLE.md` (binding).
Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice; our own words; maths spoken in words; `[beat]` = 1.5-s hold
after a worked calculation (not spoken, not captioned). Lines starting with ">" are notes and are not spoken; the README
below uses `###` headings so that `tools/tts.py` does not read it as a scene.

### README

**Measured, not estimated** (`tools/tts.py` dry run; numbers block at the end of this README). This movie is the second half of
the 35-scene Part 5 v1 (commit 116f09c; Part 5 before Part 4 was split), split on 2026-11-05 at the user's request (option (b)), now **Part 7 (#5g)**; the first
half is `ch00_coordinates_routes` (#5f, Part 6).

**Scene list** (one line each; measured length per scene below)

| # | Scene | One line |
|---|---|---|
| 0 | s00_title | card "Coordinates · Part 7" / "Maps" / "projections and the view from the pole"; one sentence |
| 1 | s01_hook | Greenland as big as Africa; the Arctic on one page; "the last of seven parts" |
| 2 | s02_part6_recap | arc rule, a, degree lengths (111.2 / 73.8 km), scale factors, the great circle (8755 km) and the rhumb line (258.5°, +11 %) (≤ 60 s) |
| 3 | s03_flattening | the orange peel: no flat map without stretching |
| 4 | s04_plate_carree | **maths-skip line + chip**; unroll the equator (x = a λ) and the meridians (y = a φ); Brest (−500, 5381) km |
| 5 | s05_stretch_k | 40 030 vs 26 580 km → k = 2πa / (2πa cos φ) = 1/cos φ; 1.5, 2, 4.9; Tissot ovals |
| 6 | s06_gradient_preview | **"If you skipped, here's what to keep"**; 1 °C over 73.8 km, not 111.2; ∇T named; next: *The gradient*; *Pressure as a vertical coordinate* |
| 7 | s07_mercator_idea | the photo stretch (Like / Unlike), one strip at a time, the oval made round; conformal |
| 8 | s08_mercator_dy | **maths-skip line + chip**; dy = a dφ / cos φ step by step; 167.4 km at Brest, 222.4 km at 60° N |
| 9 | s09_adding_steps | add the drawn steps in 10° steps (table); the steps grow; Edward Wright 1599 |
| 10 | s10_ln_formula | ln primed (e, ln 1 = 0, ln e = 1); y = a ln tan(π/4 + φ/2) matches the sums; Brest 6165 km |
| 11 | s11_slope_check | centred difference at 60°: 2.00 = 1/cos 60°; y(0) = 0; the pole at infinity |
| 12 | s12_rhumb_straight | **"If you skipped, here's what to keep"**; same slant (4.9 west per 1 south) → a straight line |
| 13 | s13_area_stretch | 100-km square at 60° N → × 4; k²; Svalbard 24; Greenland vs Africa 14 |
| 14 | s14_equal_earth | Equal Earth; the Sep 2026 anomaly on both maps (≥ 80 px apart); angles off 31°; *How weather maps are made* |
| 15 | s15_why_many | three good reasons: shape, measurement, meaning |
| 16 | s16_globe_to_pole | the turning globe → above the North Pole → polar stereographic map; rings and spokes labelled |
| 17 | s17_where_is_what | the place tour with latitudes and longitudes; ring first, then spoke; where is Los Angeles? |
| 18 | s18_vortex | 10-hPa heights 21 Jan 2026, contours, labels fade, natural wind trails; 28.6 / 30.7 km; 79 m/s |
| 19 | s19_vortex_components | i = θ̂, j = −r̂, so u_θ = u, u_r = −v; anticlockwise; like the hurricane, and unlike it |
| 20 | s20_origin_wheel | a flat ring of air, the origin moved 500 km; u_r ≈ −4.5, u_θ ≈ 8.9 at one point |
| 21 | s21_origin_vortex | about the pole 17.5 round, 33 in/out (1.9); about the centre 47 and 20 (0.4); *Waves on the jet*, *The polar vortex* |
| 22 | s22_recap | "To sum up …"; last sentence: "Next in this series, … the gradient." |
| 23 | s23_end | series end card, maths ending, word for word |

| # | Scene | Measured length |
|---|---|---|
| 0 | s00_title | 11.2 s (29 w, 1 S, 0 beats) |
| 1 | s01_hook | 23.2 s (61 w, 4 S, 0 beats) |
| 2 | s02_part6_recap | 54.9 s (129 w, 7 S, 0 beats) |
| 3 | s03_flattening | 33.2 s (83 w, 7 S, 0 beats) |
| 4 | s04_plate_carree | 135.9 s (322 w, 21 S, 4 beats) |
| 5 | s05_stretch_k | 115.2 s (267 w, 15 S, 4 beats) |
| 6 | s06_gradient_preview | 87.1 s (207 w, 12 S, 1 beats) |
| 7 | s07_mercator_idea | 85.2 s (213 w, 14 S, 1 beats) |
| 8 | s08_mercator_dy | 104.4 s (252 w, 15 S, 3 beats) |
| 9 | s09_adding_steps | 112.5 s (283 w, 15 S, 4 beats) |
| 10 | s10_ln_formula | 113.0 s (274 w, 17 S, 4 beats) |
| 11 | s11_slope_check | 98.9 s (234 w, 15 S, 4 beats) |
| 12 | s12_rhumb_straight | 92.7 s (233 w, 15 S, 2 beats) |
| 13 | s13_area_stretch | 85.8 s (197 w, 12 S, 3 beats) |
| 14 | s14_equal_earth | 92.2 s (222 w, 15 S, 1 beats) |
| 15 | s15_why_many | 64.2 s (159 w, 11 S, 0 beats) |
| 16 | s16_globe_to_pole | 80.1 s (189 w, 14 S, 1 beats) |
| 17 | s17_where_is_what | 103.8 s (255 w, 13 S, 2 beats) |
| 18 | s18_vortex | 87.9 s (207 w, 12 S, 2 beats) |
| 19 | s19_vortex_components | 74.9 s (180 w, 11 S, 1 beats) |
| 20 | s20_origin_wheel | 117.5 s (285 w, 17 S, 3 beats) |
| 21 | s21_origin_vortex | 85.1 s (213 w, 11 S, 2 beats) |
| 22 | s22_recap | 67.0 s (165 w, 8 S, 0 beats) |
| 23 | s23_end | 22.9 s (56 w, 3 S, 0 beats) |

**Chapter marks** (for the manifest; provisional, from the dry run):
- 0:00 Maps: the question (s00_title)
- 0:34 What we use from Parts 1, 3 and 6 (s02_part6_recap)
- 1:29 Flattening the Earth (s03_flattening)
- 2:02 Every step: the flat square map and its stretch (optional maths) (s04_plate_carree)
- 6:13 Scale factors on weather grids (s06_gradient_preview)
- 7:41 Mercator's idea (s07_mercator_idea)
- 9:06 Every step: Mercator's formula (optional maths) (s08_mercator_dy)
- 16:15 Why the rhumb line is straight (s12_rhumb_straight)
- 17:47 The price: areas (s13_area_stretch)
- 19:13 Equal-area maps: pick the map for the job (s14_equal_earth)
- 20:45 Why so many coordinate systems (s15_why_many)
- 21:49 The view from the pole (s16_globe_to_pole)
- 23:10 A tour of the polar map (s17_where_is_what)
- 24:53 The stratospheric polar vortex (s18_vortex)
- 26:21 East is round, north is in (s19_vortex_components)
- 27:36 Choosing the origin (s20_origin_wheel)
- 30:59 To sum up (s22_recap)

**Maths-skip blocks** (series-wide rule, user 2026-11-05; the chip's mm:ss is refilled after the final TTS):
- chip in s04_plate_carree (block s04_plate_carree–s05_stretch_k) → skip to 6:13 (provisional: dry run; refill after the final TTS), start of s06_gradient_preview (takeaway line)
- chip in s08_mercator_dy (block s08_mercator_dy–s11_slope_check) → skip to 16:15 (provisional: dry run; refill after the final TTS), start of s12_rhumb_straight (takeaway line)

**Length:** 32:31.60 measured (1951.600 s = 1949.100 s of narration + the 2.5-s silent end-card hold); **4715 words**,
285 sentences, 42 beats. **Estimate at 142 words per minute:** 4715 / 142 = **33.2 min**.

**User feedback covered (U-CO items assigned to #5g after the split).**
- [x] U-CO-064 ∇T without a derivation: s06, ≤ 1 min (1 °C over 73.8 km, not 111.2), the equation with its scale factors underbraced, "next in
  this series: *The gradient*" said and written; #6 s22–s23 become the full derivation.
- [x] U-CO-069 why x = a λ, y = a φ: s04 (unroll the equator → x, each meridian → y; Brest worked; true along both).
- [x] U-CO-070 how k = 1/cos φ: s05 (the parallel drawn 2πa long vs its true 2πa cos φ; numbers first; the cancellation).
- [x] U-CO-071 the Mercator idea made intuitive: s07 (the photo stretch, Like / Unlike; one strip at a time; the oval made round; conformal).
- [x] U-CO-072 how dy is what is shown: s08 (steps with reasons; numbers at Brest and 60° N; Δ → d).
- [x] U-CO-073 why some prefer the rhumb line (completed): s12 (why it is straight on Mercator); the first two reasons are in Part 6 s13.
- [x] U-CO-074 y = a ln tan(π/4 + φ/2) step by step: s09 (add-up table), s10 (ln primed; the formula matches), s11 (slope check, equator, pole).
- [x] U-CO-075 how the stretch factor is computed: s13 (100-km square: × 2 by × 2 = × 4; k × k; 4.9 × 4.9 ≈ 24).
- [x] U-CO-076 "true size" over Greenland: s13 — the map below the column text with ≥ 40 px clear; true-size outlines in the column.
- [x] U-CO-077 the two maps touch: s14 — Mercator x 80–880, Equal Earth x 960–1840 (≥ 80 px apart), one colour bar below both.
- [x] U-CO-078 rotating globe → rise and zoom to the top → settle on the map: s16 (GlobeToPolarMorph).
- [x] U-CO-079 latitudes and longitudes labelled: s16.
- [x] U-CO-080 major areas with a short tour and their latitude/longitude: s17.
- [x] U-CO-081 labels removed later: s18 (fade to 40 %, then out; rings and spokes stay).
- [x] U-CO-082 natural moving wind along the lines: s18 (FlowParticles trails via `advect_on_sphere`, the weather-basics look; data report §5).
- [x] U-CO-083 the 37:04 scene re-thought: s19 (east = round, north = in), s20 (a flat ring, the origin moved, one point by hand), s21 (the
  vortex about the pole vs its own centre, in m/s and as ratio bars 1.9 / 0.4).
- [x] U-CO-054, U-CO-057 (ln primed in s10; anomaly, conformal, equal-area, polar stereographic, stratosphere defined at first use).
- [x] U-CO-099 later-movie pointers ≤ 1 min, voice + keyword: *The gradient* (s06, s22), *Pressure as a vertical coordinate* (s06), *How weather
  maps are made* (s14), *Waves on the jet* and *The polar vortex* (s21).
- [x] U-CO-101 smooth flow: "the last of seven parts" (s01), the Part 6 recap (s02), *The gradient* named as next (s22, word for word from the split plan).
- [x] Maths-skip guidance (user, 2026-11-05): chips + friendly lines at s04 and s08, takeaways at s06 and s12.

**Review 1 and fix-loop-1 guards kept:** Must 6 (bands and links at +48.4, +60, +78.2°; DC32b; Tissot on the real sphere, `a = EARTH_RADIUS`,
never 1), Should 9 (s14 maps apart, now ≥ 80 px), Should 10 (s21 ratio bars + tick legend), Should 14, Should 18; fix-loop rules 1, 4–9.

**Cross-part numbers and symbols this part relies on:** Part 1 polar (r, θ), the arc rule, r̂, θ̂, components as dot products, the hurricane spinning
anticlockwise (NH); Part 3 φ, λ, **a = 6371 km**, Brest (48.39° N, 4.49° W), cos φ = 0.664, **a cos φ ≈ 4230 km**, **111.2 km per degree north,
73.8 km per degree east at Brest**, **Longyearbyen 78.22° N 15.65° E**, adding up = integration, Δ vs d; Part 6 scale factors (the word), the
great circle London–Los Angeles **8755 km**, the rhumb line **258.5°, 9733 km, +11 %**; #4 the centred difference.

**Spoken-symbol rules.** No lone "a" ("the Earth's radius"; once "the letter a" in s02). "phi", "lambda", "cosine phi", "theta hat", "u sub theta",
"u sub r", "d y", "d phi", "l n". "Anticlockwise, as seen from above the North Pole" on the polar map.

**Proposed lexicon entries** (not added): `the letter a` → `the letter [A](/ˈA/)`, Mercator, Gerardus, plate carrée ("plat kar-ay"),
Longyearbyen, Svalbard, Barents, stereographic, Greenwich, "l n" ("ell en").

**Measured** (`tools/tts.py` dry run 2026-11-05 into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_maps/dryrun3_spliced`, Kokoro af_bella × 1.0, current `movies/lexicon.yaml`):
**285 sentences, 4715 words, 42 beats; narration 1949.100 s + 2.5-s hold = 1951.600 s (32:31.60)**; speech alone 1791.4 s =
157.9 words per minute while speaking, **145.1 words per minute overall** (limit 150); 477 caption cues; warnings: s19_vortex_components s4: 17.3 chars/s > 17.0 (slow the speed or shorten).

**How it was measured:** the full script in one `tools/tts.py` run; then the opening recap (s02) was shortened to stay under 60 s, re-measured alone with `tools/tts.py`, and spliced in (every later scene shifted by the measured difference; `timing.json → splice`). The final TTS re-runs the whole script.

## s00_title
In this video, we'll learn map projections the easy way, and see how meteorology uses them to draw weather maps, and to read the winds from above the pole.

> 29 words · 1 sentences · 0 beats · 0.300–11.550 s (11.2 s; speech 10.4 s) · 0:00.30–0:11.55 (measured, dry run 2026-11-05).

## s01_hook
Why does Greenland look as big as Africa on so many maps, and how do forecasters draw the whole Arctic on one page? This is the last of seven parts on coordinates. Let's see how the round Earth is flattened onto maps, and what each kind of map stretches. Then let's read a weather map drawn from above the North Pole.

> 61 words · 4 sentences · 0 beats · 11.550–34.800 s (23.2 s; speech 21.4 s) · 0:11.55–0:34.80 (measured, dry run 2026-11-05).

## s02_part6_recap
Here's what we'll use from the earlier parts. The arc rule from Part 1: the distance along a circle is its radius times the angle, in radians. From Part 3, the latitude, phi, the longitude, lambda, and the Earth's radius, the letter a, about six thousand three hundred and seventy one kilometres. One degree of latitude is about a hundred and eleven point two kilometres everywhere. One degree of longitude is that times cosine phi: about seventy three point eight kilometres at Brest. In Part 6, we called these multipliers scale factors. And we found two routes from London to Los Angeles: the great circle, about eight thousand seven hundred and fifty five kilometres, and the rhumb line, which keeps one compass bearing and is about eleven percent longer.

> 129 words · 7 sentences · 0 beats · 34.800–89.700 s (54.9 s; speech 52.5 s) · 0:34.80–1:29.70 (measured, dry run 2026-11-05).

## s03_flattening
Every map starts by flattening the Earth onto a page. And here's the catch: you can't flatten a sphere without stretching or tearing it. Try it with an orange peel. Cut it into slices from pole to pole, and lay them flat, and gaps open up between them. Close the gaps by stretching, and the shapes change. Every flat map of the Earth makes a choice about what to stretch. Let's build the simplest map, and work out exactly how much it stretches.

> 83 words · 7 sentences · 0 beats · 89.700–122.950 s (33.2 s; speech 30.4 s) · 1:29.70–2:02.95 (measured, dry run 2026-11-05).

## s04_plate_carree
Next, we'll build the simplest map step by step, with every number. That's for anyone who enjoys every step. For the intuition behind weather, climate science or GIS, you only need the result, so if it feels like a lot, skip ahead to the time on screen. We'll build it from the lines on the globe whose lengths we know. First, the equator. Cut it, and unroll it into a straight line across the page. Its length is two pi times the Earth's radius, about forty thousand kilometres. A place at longitude lambda, in radians, is the Earth's radius times lambda along the equator from the prime meridian. That's the arc rule again. So we set x equal to the Earth's radius times lambda. [beat] Second, the meridians. Each one runs from the equator to the pole, and a place at latitude phi is the Earth's radius times phi from the equator, along its meridian. That's the distance north from Part 3. So we draw every meridian as a straight line going up the page, and set y equal to the Earth's radius times phi. [beat] Let's try Brest, at forty eight point four degrees north, and four and a half degrees west. In radians, that's zero point eight four four six, and minus zero point zero seven eight four. So x is six thousand three hundred and seventy one times minus zero point zero seven eight four, about minus five hundred kilometres: just west of the middle line. [beat] And y is six thousand three hundred and seventy one times zero point eight four four six, about five thousand three hundred and eighty one kilometres. [beat] That's exactly how far Brest is from the equator, walking north along its meridian. So along the equator, and along every meridian, this map is true to scale. It's called the plate carrée, French for flat square, and most weather data come on exactly this kind of grid.

> 322 words · 21 sentences · 4 beats · 122.950–258.825 s (135.9 s; speech 123.5 s) · 2:02.95–4:18.82 (measured, dry run 2026-11-05).

## s05_stretch_k
Now look at a circle of latitude, called a parallel. On this map, every parallel is drawn as a straight line across the page, as long as the equator: two pi times the Earth's radius, about forty thousand and thirty kilometres. But on the globe, the parallel through Brest is a smaller circle. As we saw in Part 3, its radius is the Earth's radius times cosine phi, about four thousand two hundred and thirty kilometres. So its true length is two pi times four thousand two hundred and thirty, about twenty six thousand five hundred and eighty kilometres. [beat] The map draws twenty six thousand five hundred and eighty kilometres as forty thousand and thirty. So east-west distances at Brest are stretched by forty thousand and thirty divided by twenty six thousand five hundred and eighty, about one point five. [beat] Let's write that with symbols. The stretch, called k, is two pi times the Earth's radius, divided by two pi times the Earth's radius times cosine phi. The two pi and the radius cancel, so k equals one over cosine phi. [beat] At Brest, that's one over zero point six six four, about one point five. At sixty degrees north, it's one over zero point five, which is two. And at Longyearbyen, on Svalbard, at seventy eight point two degrees north, it's one over zero point two zero four, almost five. [beat] North-south distances aren't stretched at all. So a small circle near Brest is drawn as an oval, one and a half times wider than it is tall, and near the poles, shapes are squashed flat.

> 267 words · 15 sentences · 4 beats · 258.825–373.975 s (115.2 s; speech 104.9 s) · 4:18.82–6:13.98 (measured, dry run 2026-11-05).

## s06_gradient_preview
If you skipped, here's what to keep. The simplest map uses longitude and latitude as x and y. It's true along the equator and along every meridian, but it stretches east-west distances by one over cosine phi: about one and a half times at Brest, two at sixty degrees north, and almost five at Svalbard. Scale factors like this matter for weather data, because most weather data come on exactly this kind of grid. Suppose two grid points near Brest are one degree of longitude apart, and the temperature differs by one degree Celsius between them. The slope we want is per kilometre, not per degree. So we divide by the true distance, seventy three point eight kilometres, not by a hundred and eleven point two. That's about one point four degrees per hundred kilometres. [beat] In symbols, the eastward slope is one over the Earth's radius times cosine phi, times the change with longitude. Together with the northward slope, it makes the gradient on the sphere. We'll build it step by step in the next movie in this series: The gradient. Weather models also use a curvilinear coordinate in the vertical, pressure instead of height, which has its own movie too: Pressure as a vertical coordinate.

> 207 words · 12 sentences · 1 beats · 373.975–461.050 s (87.1 s; speech 81.3 s) · 6:13.98–7:41.05 (measured, dry run 2026-11-05).

## s07_mercator_idea
In fifteen sixty nine, the map maker Gerardus Mercator had a clever idea to fix the squashed shapes of the flat square map. Think of stretching a photo. If you stretch it only sideways, faces look too wide. But if you also stretch it up and down by the same amount, faces look right again, just bigger. Mercator did this to the map, one strip of latitude at a time. Near Brest, east-west is stretched by one point five, so he stretched north-south near Brest by one point five too. Near sixty degrees north, both by two. Near Svalbard, both by almost five. [beat] Now watch a small circle from the globe. On the flat square map, it becomes an oval, too wide. Stretch its strip north-south by the same factor, and it becomes a circle again, only bigger. Unlike a photo, though, each strip of latitude needs its own stretch, so the map grows taller and taller towards the poles. Because small shapes stay the right shape, small angles stay true as well: the angle at which a road crosses a meridian on the map is the angle on the ground. Maps like this are called conformal, which means that they keep shapes and angles right in every small patch.

> 213 words · 14 sentences · 1 beats · 461.050–546.250 s (85.2 s; speech 78.7 s) · 7:41.05–9:06.25 (measured, dry run 2026-11-05).

## s08_mercator_dy
Now let's turn Mercator's idea into a formula, with every step and every number. This part is for learners who want to see how the formula is built; you don't need it for the intuition behind weather, climate science or GIS. If it feels like too much, skip ahead to the time on screen. Take a small step north on the globe, by delta phi. From Part 3, its true length is the Earth's radius times delta phi. On the flat square map, it's drawn just that long, while east-west is drawn one over cosine phi times too long. To keep the shapes, Mercator draws the north step one over cosine phi times longer too. So on his map, the step is drawn as the Earth's radius times delta phi, divided by cosine phi. [beat] Let's put in numbers. One degree north is a hundred and eleven point two kilometres on the ground, everywhere. At Brest, Mercator draws it a hundred and eleven point two times one point five zero six long, about a hundred and sixty seven point four kilometres. [beat] At sixty degrees north, he draws it twice as long, about two hundred and twenty two point four kilometres. [beat] When the step is tiny, we write d instead of delta, as in Part 3. So d y equals the Earth's radius times d phi, divided by cosine phi. This says how fast the map's height grows as we go north: slowly near the equator, and faster and faster towards the pole.

> 252 words · 15 sentences · 3 beats · 546.250–650.650 s (104.4 s; speech 95.3 s) · 9:06.25–10:50.65 (measured, dry run 2026-11-05).

## s09_adding_steps
So how high up the map is a place at latitude phi? It's the sum of all the drawn steps, from the equator up to phi. Let's add them up, ten degrees at a time. Ten degrees is zero point one seven four five radians. For each step, we use the stretch in the middle of the step. From zero to ten degrees, the middle is five degrees, where one over cosine is one point zero zero four. So the first step is drawn zero point one seven four five times one point zero zero four, about zero point one seven five times the Earth's radius, or about one thousand one hundred and sixteen kilometres. [beat] From ten to twenty degrees, the middle is fifteen degrees, the stretch is one point zero three five, and the step is zero point one eight one. The running total is zero point three five six. [beat] From twenty to thirty degrees, the stretch is one point one zero three, the step is zero point one nine three, and the total is zero point five four nine. [beat] Let's speed up. The total reaches about one point zero one at fifty degrees, one point three one at sixty, one point seven three at seventy, and two point four at eighty. [beat] Look at the steps: they grow as we go north, because the stretch grows. The last ten degrees, from eighty to ninety, add at least two more on their own, and we'll see soon that they add far more. Navigators really did it this way: in fifteen ninety nine, the English mathematician Edward Wright published a table made by adding up such steps, one minute of latitude at a time.

> 283 words · 15 sentences · 4 beats · 650.650–763.125 s (112.5 s; speech 102.2 s) · 10:50.65–12:43.12 (measured, dry run 2026-11-05).

## s10_ln_formula
Adding up tiny steps like this is the integration we met in Part 3, and this sum has an exact answer. To write it, we need one new tool, the natural logarithm, written l n. The number e is about two point seven one eight. The natural logarithm of a number answers one question: e to what power gives this number? So l n of one is zero, because e to the power zero is one. And l n of e is one. [beat] Here's the answer to our sum: y equals the Earth's radius, times the natural logarithm of the tangent of forty five degrees plus half the latitude. Forty five degrees is pi over four radians, so on screen it's pi over four plus phi over two. Let's test it against our table. At sixty degrees, forty five plus thirty is seventy five degrees. Its tangent is three point seven three two, and l n of three point seven three two is one point three one seven. [beat] Our ten-degree sum gave one point three one three, very close. With one-degree steps, the sum gives one point three one seven, the same to three decimals. [beat] At Brest, forty five plus half of forty eight point four is sixty nine point two degrees. Its tangent is two point six three two, and its l n is zero point nine six eight. So on a Mercator map, Brest sits zero point nine six eight times the Earth's radius above the equator, about six thousand one hundred and sixty five kilometres. [beat] On the flat square map, it was five thousand three hundred and eighty one.

> 274 words · 17 sentences · 4 beats · 763.125–876.150 s (113.0 s; speech 102.0 s) · 12:43.12–14:36.15 (measured, dry run 2026-11-05).

## s11_slope_check
How can we be sure the formula is right everywhere, not just at a few points? Its slope must match the drawn step: one over cosine phi for each radian of phi. Let's check its slope at sixty degrees with the centred difference from the derivatives movie. At sixty one degrees, the formula gives one point three five two four. At fifty nine degrees, it gives one point two eight two six. [beat] The difference is zero point zero six nine eight, and the two points are two degrees apart, which is zero point zero three four nine radians. Zero point zero six nine eight divided by zero point zero three four nine is about two point zero zero. [beat] And one over the cosine of sixty degrees is exactly two. So the formula's slope is the stretch we wanted. Two more checks. At the equator, the tangent of forty five degrees is one, and l n of one is zero, so y is zero, as it should be. [beat] And at the pole, the angle becomes ninety degrees, where the tangent has no end: it grows without limit. So the pole is infinitely far up the map. At eighty five degrees, y is already three point one three times the Earth's radius, about nineteen thousand nine hundred and fifty kilometres. [beat] That's why Mercator maps are always cut off before the poles, usually somewhere past eighty degrees.

> 234 words · 15 sentences · 4 beats · 876.150–975.050 s (98.9 s; speech 88.6 s) · 14:36.15–16:15.05 (measured, dry run 2026-11-05).

## s12_rhumb_straight
If you skipped, here's what to keep. Mercator stretches north-south by the same amount as east-west, one over cosine phi, so his map grows taller and taller towards the poles, and it can never show the poles themselves. Now we can see why a rhumb line is straight on a Mercator map. A rhumb line keeps one compass bearing. Zoom into any short piece of it. On the globe, it's a tiny slanted step: some distance west, and some distance south. Keeping the same bearing means the same slant everywhere. For our route at two hundred and fifty eight and a half degrees, every piece goes about four point nine kilometres west for each kilometre south. [beat] Now draw it on the Mercator map. At each latitude, Mercator stretches the west part and the south part by the same amount, one over cosine phi. Stretching both parts by the same amount leaves their ratio unchanged. So on the map, every piece of the route has the same slant, four point nine across for each one down. A line whose slant never changes is a straight line. [beat] The great circle keeps changing its bearing, so on this map it comes out curved, bulging towards the pole. The two routes swap looks: on the globe, the great circle looks straight and the rhumb line curves, and on Mercator's map it's the other way round.

> 233 words · 15 sentences · 2 beats · 975.050–1067.775 s (92.7 s; speech 84.7 s) · 16:15.05–17:47.78 (measured, dry run 2026-11-05).

## s13_area_stretch
But keeping shapes has a price: sizes. How much is an area stretched? Take a small square on the globe at sixty degrees north, a hundred kilometres on each side. Its area is a hundred times a hundred, ten thousand square kilometres. On a Mercator map, its width is stretched by two, and its height by two as well. So it's drawn two hundred by two hundred, which is forty thousand square kilometres: four times too big. [beat] In general, the width is stretched by k and the height by k, so the area is stretched by k times k, k squared, which is one over cosine phi, squared. At Svalbard, k is about four point nine, so areas are stretched by about four point nine times four point nine, about twenty four. [beat] That's why, on a Mercator map, Greenland looks about as big as Africa. In truth, Greenland covers about two point one seven million square kilometres, and Africa about thirty point four million. Thirty point four divided by two point one seven is about fourteen, so Africa is about fourteen times bigger. [beat] The Mercator map is great for directions and shapes, and poor for comparing sizes.

> 197 words · 12 sentences · 3 beats · 1067.775–1153.625 s (85.8 s; speech 77.8 s) · 17:47.78–19:13.62 (measured, dry run 2026-11-05).

## s14_equal_earth
For climate maps, sizes often matter more. If we want to know how much of the Earth was warmer than usual last month, a map that inflates the polar regions would mislead us. So climate scientists often use equal-area maps, such as the Equal Earth map, from twenty eighteen. On it, every patch keeps its true share of the Earth's area, so Greenland shows at its real size, about a fourteenth of Africa. Here's the same temperature map for September twenty twenty six, drawn both ways. The colours show how much warmer or colder each place was than its usual September, the average from nineteen ninety one to twenty twenty. That difference from the usual is called an anomaly. On the Mercator map, the far north looks huge. On the Equal Earth map, it shrinks to its true size. The price now is shape. Towards the poles, shapes get skewed: at sixty degrees north and thirty degrees east, angles can be off by about thirty one degrees. [beat] No flat map can keep both areas and shapes right everywhere. So the rule is: pick the map for the job. Use conformal maps for winds and directions, and equal-area maps for comparing amounts. Which maps forecasters use, and why, has its own movie later in this series: How weather maps are made.

> 222 words · 15 sentences · 1 beats · 1153.625–1245.800 s (92.2 s; speech 85.3 s) · 19:13.62–20:45.80 (measured, dry run 2026-11-05).

## s15_why_many
So why are there so many coordinate systems and maps? There are three good reasons. The first is shape. When the coordinates match the shape of the problem, the numbers become simple. A ring round a hurricane's eye is just r equals a constant, the Earth's surface is just r equals its radius, and a great circle route is just one angle, sigma. The second is measurement. We use the coordinates that our instruments and data use. A radar sees distance and direction, a weather station feels east, north and up, and weather data come on a grid of latitude and longitude. The third is meaning. The right coordinates split a vector into the parts that physics cares about: spin and inflow round a storm, along and across a coast, or round and in for a whirl round the pole, as we'll see next. Maps follow the same rule: we choose the one that keeps what our question needs.

> 159 words · 11 sentences · 0 beats · 1245.800–1309.975 s (64.2 s; speech 59.9 s) · 20:45.80–21:49.97 (measured, dry run 2026-11-05).

## s16_globe_to_pole
There's one more map that every forecaster knows: the view from above a pole. Let's get there from the globe. Here's the Earth, turning. Now let's rise up above the North Pole, and look straight down. From up here, the circles of latitude become rings round the pole, and the meridians become spokes, like the spokes of a wheel. Now let's flatten this view into a map. The North Pole sits in the middle. The rings are the latitudes: seventy five, sixty, forty five and thirty degrees north, going outward. The spokes are the longitudes. Zero degrees, the prime meridian through Greenwich, points down. Ninety degrees east points right, a hundred and eighty degrees points up, and ninety degrees west points left. [beat] So going east means going round anticlockwise, as seen from above the North Pole. This is polar coordinates again: the distance from the middle grows with the distance from the pole, and the angle round the middle is the longitude. This kind of map is called polar stereographic, and this one is drawn true to scale at sixty degrees north, like many weather charts of the pole.

> 189 words · 14 sentences · 1 beats · 1309.975–1390.050 s (80.1 s; speech 73.6 s) · 21:49.97–23:10.05 (measured, dry run 2026-11-05).

## s17_where_is_what
If you've never seen a map like this, it can be hard to tell where things are, so let's take a short tour. To find any place, first find its ring, for the latitude, and then its spoke, for the longitude. Near the bottom, at forty eight point four degrees north and four and a half degrees west, is Brest: just past the forty five degree ring, a little left of the zero spoke. Closer to the pole, past the sixty degree ring, is Iceland, at about sixty five degrees north and nineteen degrees west. To its left is Greenland, the big island, around seventy two degrees north and forty degrees west. To the right of the zero spoke is Scandinavia. Further in, at seventy eight point two degrees north and fifteen point six degrees east, is Longyearbyen, on Svalbard. Between Scandinavia and the pole lies the Barents Sea, around seventy five degrees north and forty degrees east. To the right, along the ninety degrees east spoke, stretches Siberia. At the top, near a hundred and eighty degrees, is the Bering Strait, with Alaska to its left, around sixty five degrees north and a hundred and fifty degrees west. And on the left, along ninety degrees west, is Canada, with Hudson Bay at about sixty degrees north. [beat] One last test: where's Los Angeles, at thirty four degrees north and a hundred and eighteen degrees west? Just outside the thirty degree ring, between the ninety west and the hundred and eighty spokes, on the upper left. [beat]

> 255 words · 13 sentences · 2 beats · 1390.050–1493.850 s (103.8 s; speech 97.0 s) · 23:10.05–24:53.85 (measured, dry run 2026-11-05).

## s18_vortex
Now let's put real weather on this map. The air pressure falls as we go up. About thirty kilometres up, in the stratosphere, the layer above the one where our weather happens, it's only ten hectopascals, about a hundredth of the pressure at the ground. The height where the pressure is exactly ten hectopascals isn't the same everywhere, and this map shows it on the twenty first of January, twenty twenty six. The colours show that height, and the lines join places where it's the same, every four hundred metres. We'll fade the place labels now, so that the weather is easy to see. The surface is lowest, about twenty eight point six kilometres, over the Barents Sea, at about seventy three degrees north and forty four degrees east. And it's higher further south: about thirty point seven kilometres on average along thirty degrees north. [beat] Now let's let the air move. The winds blow nearly along these lines, round and round the Arctic, from west to east. The fastest, nearly eighty metres per second, about two hundred and eighty five kilometres per hour, blow over Siberia, near sixty degrees north. [beat] This great winter whirl of cold air, high above the Arctic, is called the stratospheric polar vortex.

> 207 words · 12 sentences · 2 beats · 1493.850–1581.725 s (87.9 s; speech 80.9 s) · 24:53.85–26:21.72 (measured, dry run 2026-11-05).

## s19_vortex_components
Let's describe these winds in the map's polar coordinates. Pick any point, and draw its east and north arrows. The east arrow points round the middle, anticlockwise as seen from above: it's exactly the map's theta hat at that point. The north arrow points straight at the middle, towards the pole. That's the opposite of r hat, which points outward. So the north arrow is minus r hat. [beat] That means the eastward wind u is the tangential wind round the pole, and the northward wind v is the radial wind with its sign flipped, because blowing north means blowing in. So u sub theta equals u, and u sub r equals minus v. Westerly winds, the winds from the west, go round anticlockwise, as seen from above the North Pole. So the polar vortex spins the same way as the hurricane in Part 1, but it's far wider: thousands of kilometres across, instead of about a hundred. And unlike a hurricane, it isn't fed by a warm sea: it forms because the polar stratosphere cools in the long winter night.

> 180 words · 11 sentences · 1 beats · 1581.725–1656.625 s (74.9 s; speech 69.5 s) · 26:21.72–27:36.62 (measured, dry run 2026-11-05).

## s20_origin_wheel
There's one more choice hidden in polar coordinates: where to put the origin. Let's see why it matters with a simple flat example first. Picture a ring of air, a thousand kilometres from its own centre, going round anticlockwise at ten metres per second. With the origin at its centre, every air parcel on the ring moves purely round. The tangential wind is ten, and the radial wind is zero, all the way round. Now keep the same air, but move the origin five hundred kilometres to the west. Look at the top of the ring, due north of the centre. There, the wind blows due west: u is minus ten, and v is zero. Seen from the new origin, this point is five hundred kilometres east and a thousand kilometres north. Its distance is the square root of five hundred squared plus a thousand squared, about one thousand one hundred and eighteen kilometres. So its r hat is five hundred and a thousand, each divided by one thousand one hundred and eighteen: zero point four four seven, zero point eight nine four. [beat] The radial wind is minus ten times zero point four four seven, plus zero times zero point eight nine four, which is about minus four and a half. It looks as if the air is flowing in. [beat] The tangential wind uses theta hat, minus zero point eight nine four, zero point four four seven. It's minus ten times minus zero point eight nine four, plus zero, which is about eight point nine. [beat] Same air, same wind, but the new origin splits it differently. Nothing is flowing in at all: the in and out part comes only from where we put the origin.

> 285 words · 17 sentences · 3 beats · 1656.625–1774.175 s (117.5 s; speech 107.7 s) · 27:36.62–29:34.17 (measured, dry run 2026-11-05).

## s21_origin_vortex
Now back to the vortex. Its own centre isn't at the pole. It's at about seventy two point nine degrees north and forty four point three degrees east, over the Barents Sea, about one thousand nine hundred kilometres from the pole. Let's draw a ring two thousand kilometres from the pole, and split the winds on it with the pole as the origin. The round part averages only about seventeen and a half metres per second, and the in and out part is typically about thirty three, almost twice as big: a ratio of about one point nine. [beat] Now draw a ring two thousand kilometres from the vortex's own centre instead. The round part averages about forty seven metres per second, and the in and out part is typically about twenty, less than half: a ratio of about zero point four. [beat] So about its own centre, the vortex is mostly spin, just like the hurricane round its eye. Choosing the origin is part of choosing good coordinates: put it at the centre of the thing that turns. When the polar vortex weakens or splits, cold air can spill south into the places where people live. That story has its own movies later in this series: Waves on the jet, and The polar vortex.

> 213 words · 11 sentences · 2 beats · 1774.175–1859.250 s (85.1 s; speech 78.5 s) · 29:34.17–30:59.25 (measured, dry run 2026-11-05).

## s22_recap
To sum up, flattening the Earth always stretches something. The flat square map, with x equal to the Earth's radius times lambda, and y equal to the radius times phi, is true along the equator and the meridians, but it stretches east-west by one over cosine phi. Scale factors like this matter whenever we measure slopes on a weather grid. Mercator stretches north-south by the same amount, so small shapes and angles stay right, and rhumb lines are straight. His map's height is the Earth's radius times l n of the tangent of forty five degrees plus half the latitude. But areas grow by one over cosine phi, squared, so equal-area maps are better for comparing amounts. Seen from above the North Pole, a map is polar coordinates again: east is round, north is in, and the polar vortex is mostly spin about its own centre. Next in this series, we'll measure how fast the temperature changes across a map: the gradient.

> 165 words · 8 sentences · 0 beats · 1859.250–1926.200 s (67.0 s; speech 63.7 s) · 30:59.25–32:06.20 (measured, dry run 2026-11-05).

## s23_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for coordinates, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 56 words · 3 sentences · 0 beats · 1926.200–1949.100 s (22.9 s; speech 21.9 s) · 32:06.20–32:29.10 (measured, dry run 2026-11-05).
