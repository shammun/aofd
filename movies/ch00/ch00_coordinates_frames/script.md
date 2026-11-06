# ch00_coordinates_frames — narration (movie-director, 2026-11-05)

Series plan v6 **#5d, position 10**: "Coordinates, Part 4 — Turning frames: local axes and how they turn" (coordinates series: seven parts).
Split plan `movies/ch00/ch00_coordinates/split_plan.md` §2e, split at the old s27/s28 seam (coordinator, 2026-11-05). House style `movies/HOUSE_STYLE.md` (binding).
Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice; our own words; maths spoken in words; `[beat]` = 1.5-s hold
after a worked calculation (not spoken, not captioned). Lines starting with ">" are notes and are not spoken; the README
below uses `###` headings so that `tools/tts.py` does not read it as a scene.

### README

**Title card:** Coordinates · Part 4 / Turning frames / local axes and how they turn.

**Scene list** (measured; w = words)

| # | Scene | One line | Length |
|---|---|---|---|
| 0 | s00_title | opening title (HOUSE_STYLE §3) | 11.9 s (32 w) |
| 1 | s01_hook | hook question | 28.3 s (74 w) |
| 2 | s02_part3_recap | recap of Part 3 (<= 60 s, split plan §2g) | 72.8 s (176 w) |
| 3 | s03_enu | building block: the local east-north-up frame | 77.9 s (192 w) |
| 4 | s04_k_up | derivation D33 (1): up = the position arrow's direction | 101.5 s (256 w) |
| 5 | s05_i_east | derivation D33 (2): east from the top view (Part 1's 90° rule) | 95.0 s (222 w) |
| 6 | s06_j_north | derivation D33 (3): north from the meridian slice | 90.6 s (217 w) |
| 7 | s07_enu_checks | check: unit length, right angles, right-handed | 75.7 s (179 w) |
| 8 | s08_other_stations | intuition: every place has its own frame (Trappes, Singapore) | 87.1 s (200 w) |
| 9 | s09_khulna | intuition: Khulna (U-CO-060), the Bay of Bengal seen from the globe | 89.1 s (204 w) |
| 10 | s10_coast_frame | frames we turn on purpose: the coast frame (recap of Part 1's turned axes, not re-derived) | 62.7 s (156 w) |
| 11 | s11_coast_points | derivation D21 (1)-(3): two coast points, the steps north and east in km (Part 3's rules) | 108.1 s (251 w) |
| 12 | s12_coast_angle | derivation D21 (4)-(6): the triangle, the angle from north, the bearing 329° | 98.1 s (235 w) |
| 13 | s13_alpha | derivation D22 (1)-(2): α = 90° − 329° ≡ 121°; the along and across arrows | 72.6 s (160 w) |
| 14 | s14_along_across | application D22 (3)-(5): Ian's wind at Fort Myers Beach, along 9.4 and across −31.6 m/s | 106.7 s (258 w) |
| 15 | s15_arrows_turn | intuition: the local arrows turn by themselves as you move (build-1 s25, kept and re-voiced) | 87.5 s (213 w) |
| 16 | s16_toolkit | recap of Part 2's turning rules (the only tools D35-D38 need) | 82.3 s (205 w) |
| 17 | s17_which_moves | plan of the derivation: three motions, what each one leaves alone | 51.9 s (126 w) |
| 18 | s18_i_east_a | derivation D35 (1)-(3): going east turns i-hat towards −R-hat | 76.7 s (173 w) |
| 19 | s19_i_east_b | derivation D35 (4)-(7): R-hat in local arrows; Di/Dt; the Brest number | 107.2 s (248 w) |
| 20 | s20_jk_north | derivation D36: going north turns k-hat towards j-hat and j-hat towards −k-hat | 73.2 s (174 w) |
| 21 | s21_jk_east | derivation D37: going east also tilts k-hat (towards east) and j-hat (towards west) | 84.3 s (198 w) |
| 22 | s22_add_motions | derivation D38: add the motions -> the three rates; check; the link to Ω × B | 108.7 s (275 w) |
| 23 | s23_whole_vector | why it matters: Newton's law needs D(bold v)/Dt; the product rule gives six terms (D39 (1)-(2)) | 88.3 s (234 w) |
| 24 | s24_dot_i_a | derivation D39 (3)-(4): dot with i-hat; terms 1, 2, 3, 5 | 62.8 s (158 w) |
| 25 | s25_dot_i_b | derivation D39 (5)-(7): terms 4 and 6; the result; metric terms named | 93.5 s (230 w) |
| 26 | s26_glider | intuition: the force-free puck (Must 16, re-voiced): numbers change, speed does not | 84.1 s (205 w) |
| 27 | s27_metric_size | why it matters: size of the metric term vs Coriolis (log bars) | 82.0 s (195 w) |
| 28 | s28_recap | recap ('To sum up'); last sentence the teaser to Part 5, Moving frames (seven-part series) | 77.3 s (207 w) |
| 29 | s29_end | series end card (maths ending, HOUSE_STYLE §3, word for word; decision: maths end card) | 22.9 s (56 w) |

**Length:** 39:20.97 narration + 2.5-s silent end-card hold = **39:23.47** measured (5709 words; at 142 wpm the planning estimate would be 40.2 min).

**Sections:**

- Opening (s00-s02): 1:53.00, 282 words
- Local frames (s03-s09): 10:16.90, 1470 words
- The coast frame (329°) (s10-s14): 7:28.27, 1060 words
- Arrows that turn as you move (s15-s22): 11:11.60, 1612 words
- Metric terms (s23-s27): 6:50.70, 1022 words
- Recap + end (s28-s29): 1:40.20, 263 words

**Skip guidance (chapter marks):**

- A the local arrows in numbers (D33): chip at 3:19 (s04_k_up S3), skip to 9:03 (s07_enu_checks S10): "If you skipped, here's what to keep: every place has its own three arrows, east, north and up, and up always points straight away from the Earth's centre."
- B how fast the arrows turn (D35-D38): chip at 21:13 (s16_toolkit S3), skip to 30:38 (s22_add_motions S16): "If you skipped, here's what to keep: as air moves over the round Earth, its east, north and up arrows turn, at about its speed divided by the Earth's radius."
- C Dv/Dt and the metric terms (D39): chip at 30:59 (s23_whole_vector S4), skip to 34:41 (s25_dot_i_b S13): "If you skipped, here's what to keep: because the arrows turn, the wind's numbers can change even when nothing pushes the air, and the extra terms that say so are called metric terms."

**User feedback covered:**
- [x] U-CO-060 after Brest and Singapore, add Khulna (the city near the Bay of Bengal cyclone): s09 (zoom tour, Amphan 78 km west, 75.8° and 94°).
- [x] U-CO-061 Di/Dt, Dj/Dt, Dk/Dt derived step by step: s15-s22 (D35-D38: toolkit, plan, four cases, sum, check).
- [x] U-CO-062 say if another video derived them, but show them anyway: s22 (no earlier movie derived them; the cross product at work's Ω × B named as a cousin).
- [x] U-CO-063 Dv/Dt · i derived step by step: s23-s25 (D39: product rule, six terms, dot with i one term at a time), s26-s27 (meaning, size).
- [x] U-CO-084 ŷ′ = (−sin α, cos α) derived and drawn: Part 1 s16 owns it (coordinator 2026-11-05); recapped in s10, used in s13 with numbers.
- [x] U-CO-085 why x′, y′ are dot products: Part 1 s17 owns it; recapped in s10, used in s14 with numbers.
- [x] U-CO-087/088 rotation matrix; x′_i = C_ij x_j and e_i · e′_j: Part 1 s18-s19 own them; Part 4 does not re-derive (coordinator).
- [x] U-CO-090 329°: measured from what, computed how: s11-s12 (D21: two coastline points, Part 3 km, triangle, 31° west of north, 360 − 31, sphere check 329.1°).
- [x] U-CO-091 explain the along/across calculations: s13-s14 (D22: α = 121°, x̂′, ŷ′, both dot products with inputs, length check).
- [x] U-CO-054 every equation and calculation clarified: all scenes: goal -> factors named -> CalcStack with inputs -> meaning.
- [x] U-CO-057 nothing used before it is explained: R-hat defined (s05), D/Dt recalled (s15), the 90° rule recalled (s05).
- [x] U-CO-099 later-movie concepts <= 1 min, named (voice + keyword): R04 From F = ma to the equation of motion (s27), storm-surge movie F19 (s14).
- [x] U-CO-100 explain what no later movie covers: the local frame from the Earth's axes (D33), turning rates (D35-D38), coast bearing (D21).
- [x] U-CO-101 smooth flow across the split: s01 'fourth of seven', s02 Part 3 recap, s28 teaser to Part 5 (Moving frames).

**Review 1 and fix-loop-1 guards:** Must 15 (s14: colour bar beside + dated source line); Must 16 (s26: the glider/puck thought experiment voiced); Should 2 (KaTeX hats only); Should 12 (s11, s14: links end on their own targets); Should 13 (s14: 'minus thirty two' voiced); Should 14 (s29: 24-px gap); Should 15 (s14: manifest coast_segment kept, extended with A/B points); Should 17 (s03, s08: labels only after the camera settles); Should 18 (an opening keyword from frame 0 in every scene). Fix-loop rules: GeoMap body in an overflow-hidden div; SourceBelow, never a bare SourceLine; R3F: no lower-case SVG tags in a three tree; halves: picture from frame 0; keyword swaps >= 8 frames apart; cameras <= 90 deg/s eased; one colour bar per picture, beside it; the builder checks raw TeX, edge clipping, label-on-KaTeX, link crossings, text over a limb, axis through a word on its own stills; render assets staged into movies/public before any bundle; one Remotion/Chrome job at a time; TEMP/TMP on G:.

**Cross-part numbers and symbols this movie relies on:**

- *from_part1*: the 90-deg turn rule (p, q) -> (-q, p) (D02, s10); theta-hat = r-hat turned +90 deg; 'the way the angle grows' (D01, D03); polar r-hat = (cos theta, sin theta); turned axes x-hat' = (cos alpha, sin alpha), y-hat' = (-sin alpha, cos alpha) (D05, s16); components along unit arrows are dot products (D06, s17); compass bearing from north, clockwise seen from above; maths angle = 90 deg - bearing (s06); bearing -> east/north parts (speed x sin bearing, speed x cos bearing); tan = opposite / next to; 'the angle whose tangent is' (s04); wind arrow called 'bold u' in Part 1 (renamed bold v here, said in s03)
- *from_part2*: d r-hat/d theta = theta-hat, d theta-hat/d theta = -r-hat (D13, D14); d theta/dt = v/r (D16); product rule for a number times an arrow (D15); chain rule used on turning arrows (D17, D18); 'speed over radius is how fast the arrows turn'
- *from_part3*: latitude phi from the equator, longitude lambda east of 0 deg; Brest 48.4 N, 4.5 W (48.39, -4.49); Earth axes: x-hat to (0 N, 0 E), y-hat to (0 N, 90 E), z-hat to the North Pole (D23 step 1) -- Part 3 must use x-hat, y-hat, z-hat (or the movie re-labels); a = 6371 km (easy 6400), spoken 'the Earth's radius' (no lone 'a' in the voice); r-hat = (cos phi cos lambda, cos phi sin lambda, sin phi); height a sin phi; distance from the axis a cos phi (Brest 4230 km); Delta y = a Delta phi: 1 deg = 111.2 km; Delta x = a cos phi Delta lambda: 73.8 (74) km per deg at Brest; the meridian slice (half-Earth face) and the parallel as a circle round the axis (TwoViewSlice); Khulna 22.8 N, 89.6 E (NE 22.8419, 89.5581)
- *from_earlier_movies*: dot product: cosine of the angle between unit arrows; advection (0.1b); cross product recipe; i x j = k; right-handed (#2); f = 2 Omega sin phi, Omega = 7.29e-5 s^-1; Coriolis; dB/dt = Omega x B for an arrow carried by a spin (#3, 'The cross product at work'); limits, total differential, the traveller's chain rule dT/dt = dT/dt|place + speed x slope, DT/Dt = dT/dt + v.grad T, centred differences (#4)
- *shared_numbers_used*: a_km = 6371; Brest = [48.39, -4.49]; Trappes = [48.77, 2.01]; Singapore = [1.35, 103.82]; Khulna = [22.8, 89.6]; Omega_s^-1 = 7.292e-05; km_per_deg_north = 111.2; km_per_deg_east_Brest = 73.8; a_cos_phi_Brest_km = 4230; coast_bearing_deg = 329; Ian_coast_wind_ms = [22.2, 24.3]; Ciaran_U_ms = 14.58; Ciaran_U_towards_deg = 71.0
- *handed_to_part5*: the local frame and bold v (recapped in Part 5 s02); teaser: In Part 5, we'll let the frame itself move, and see what a storm's winds look like to someone riding along with it.
- *handed_to_6_gradient*: i-hat, j-hat, k-hat derived here (split plan §3b item 3: #6 recaps them in <= 30 s)
- *handed_to_part6*: great circles named (s26 puck) and promised for Part 6 (Routes)

**Seams.** Opens with the Part 3 recap (s02); the recap ends with "In Part 5, we'll let the frame itself move, and see what a storm's winds look like to someone riding along with it." The end card is the maths ending, word for word.

**Spoken-symbol rules.** No lone "a" in the voice ("the Earth's radius", "the radius"); "i hat", "capital R hat", "x hat prime";
"capital D i hat by D t"; "partial p by partial tau"; "bold capital U dot grad p"; "cosine phi", "tangent phi"; clockwise only with "as seen from above".

**Proposed lexicon entries** (not added; check by ear): Khulna ("Kool-nah"), Sundarbans ("Sun-der-bunz"), Kolkata ("Kol-kah-tah"), Amphan ("Um-pun").

**Measured**: 30 scenes, 346 sentences, 5709 words, 68 beats; narration 2360.975 s + 2.5-s hold = 2363.475 s (39:23.47); speech alone 2150.2 s = 159.3 wpm while speaking, **145.1 wpm overall** (limit 150). Clip lengths from three `tools/tts.py` runs on G: (`G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_coordinates_frames\dryrun1`, `splice2`, `splice3`; each scene's source is in the storyboard), times recomputed with the tts.py gap rules (the method reproduces the full run exactly); no warnings in any run. The caption cue count comes with the final TTS.

## s00_title
In this video, we'll learn local frames and how they turn, and see how meteorology uses them to measure the winds on a coast and over the round Earth.

> 32 words · 1 sentences · 0 beats · 0.300–12.200 s (11.9 s; speech 11.1 s) · 0:00.30–0:12.20 (measured, splice3).

## s01_hook
A forecaster at Brest, in France, measures the wind with three arrows: east, north and up. Are those the same three arrows at Khulna, in Bangladesh? And what happens to them as the air moves? This is the fourth of seven parts on coordinates. Let's see what local frames are, how to turn them to fit a coast, how they turn by themselves as the air moves, and why that matters for the wind.

> 74 words · 5 sentences · 0 beats · 12.200–40.500 s (28.3 s; speech 26.1 s) · 0:12.20–0:40.50 (measured, splice3).

## s02_part3_recap
In Part 3, we took coordinates to our round Earth. Latitude, phi, is the angle north of the equator, and longitude, lambda, is the angle east of the prime meridian. We put the origin at the Earth's centre, with three fixed axes. X hat points to latitude zero and longitude zero, y hat to latitude zero and ninety degrees east, and z hat along the spin axis to the North Pole. The Earth's radius is about six thousand four hundred kilometres, or more exactly six thousand three hundred and seventy one. On screen, it has its own symbol. The arrow of length one from the centre to a place is cosine phi cosine lambda, cosine phi sine lambda, sine phi. A place sits at the radius times sine phi above the equator's plane, and at the radius times cosine phi from the axis. And one degree north is always about a hundred and eleven kilometres, while one degree east is the radius, times cosine phi, times the angle in radians: about seventy four kilometres at Brest. [beat]

> 176 words · 9 sentences · 1 beats · 40.500–113.300 s (72.8 s; speech 68.5 s) · 0:40.50–1:53.30 (measured, dryrun1).

## s03_enu
Now let's stand at a weather station at Brest. Brest sits at the western tip of Brittany, in France, with the Atlantic Ocean on three sides. A forecaster there doesn't use axes from the Earth's centre. She uses three arrows of length one, fixed to her own spot. I hat points east, j hat points north, and k hat points straight up, away from the Earth's centre. This is called the local east, north, up frame. In Part 1, we called the wind arrow bold u. With three parts, it's usual to call it bold v, and to keep small u, v and w for its parts. So the wind is u times i hat, plus v times j hat, plus w times k hat. Here, u is the eastward wind, v the northward wind, and w the upward wind. And i hat cross j hat is k hat, so the frame is right-handed, as in the cross product movie. Why these arrows? Gravity pulls along minus k hat, the ground lies along i hat and j hat, and wind directions are measured from north. So every weather report uses this frame.

> 192 words · 14 sentences · 0 beats · 113.300–191.225 s (77.9 s; speech 72.6 s) · 1:53.30–3:11.22 (measured, dryrun1).

## s04_k_up
The next few steps write these three arrows as numbers, one move at a time. They're here for anyone who wants every step. You don't need them to follow the weather, the climate or maps, so if it feels like a lot, skip ahead to the time on screen. Each of the three arrows can be written with the Earth's fixed axes, x hat, y hat and z hat. Let's start with up, because it's the easiest. Up points straight out from the Earth's centre. That's exactly the direction of the arrow from the centre to the station, the one we found in Part 3. So k hat is cosine phi cosine lambda, cosine phi sine lambda, sine phi. [beat] Let's put in Brest's numbers. Brest is at forty eight point four degrees north, and four point five degrees west, so lambda is minus four point five degrees. Cosine phi is zero point six six four, and sine phi is zero point seven four eight. Cosine lambda is zero point nine nine seven, and sine lambda is minus zero point zero seven eight. So the first part of k hat is zero point six six four times zero point nine nine seven, which is zero point six six two. The second is zero point six six four times minus zero point zero seven eight, which is minus zero point zero five two. And the third is zero point seven four eight. [beat] Its length is one, because it's still the arrow from Part 3, divided by the radius.

> 256 words · 16 sentences · 2 beats · 191.225–292.700 s (101.5 s; speech 93.1 s) · 3:11.22–4:52.70 (measured, splice2).

## s05_i_east
Now east. Let's look down on the Earth from far above the North Pole. From there, the circle of latitude through Brest, the parallel, is a circle round the Earth's axis. Brest sits on it at the angle lambda from the x axis, measured anticlockwise as seen from above the North Pole. Going east means lambda grows, so Brest slides anticlockwise round this circle. This is exactly the picture from Part 1. The arrow pointing from the circle's centre out to Brest plays the role of r hat. We'll call it capital R hat: it points straight away from the Earth's axis, level with the equator, and it's cosine lambda, sine lambda, zero. East is the way the angle grows, so east plays the role of theta hat. In Part 1, we found theta hat by turning r hat by ninety degrees anticlockwise: swap the two numbers, and put a minus on the first. So i hat is minus sine lambda, cosine lambda. Its third part is zero, because east runs level, round the circle, with no part along the axis. [beat] At Brest, that's zero point zero seven eight, zero point nine nine seven, zero. [beat] So east at Brest points almost exactly along y hat. That makes sense: Brest is close to longitude zero, and there, east points towards ninety degrees east.

> 222 words · 15 sentences · 2 beats · 292.700–387.675 s (95.0 s; speech 87.0 s) · 4:52.70–6:27.68 (measured, dryrun1).

## s06_j_north
Now north. This time, let's slice the Earth along Brest's meridian, the half circle from pole to pole through Brest, as we did in Part 3. In this slice, there are two fixed directions: capital R hat, pointing away from the axis, and z hat, pointing up the axis. Up, k hat, sits at the angle phi above capital R hat. So, just like r hat in Part 1, k hat is cosine phi times capital R hat, plus sine phi times z hat. [beat] North is the way phi grows: Brest sliding round the meridian towards the North Pole. So north plays the role of theta hat in this slice. Let's turn k hat by ninety degrees towards the pole, with the same rule: swap the two numbers, and put a minus on the first. That gives j hat equals minus sine phi times capital R hat, plus cosine phi times z hat. Now put in capital R hat, which is cosine lambda, sine lambda, zero. So j hat is minus sine phi cosine lambda, minus sine phi sine lambda, cosine phi. [beat] At Brest, that's minus zero point seven four five, zero point zero five nine, and zero point six six four. [beat] So north at Brest points partly up the Earth's axis, and partly in towards it.

> 217 words · 13 sentences · 3 beats · 387.675–478.325 s (90.6 s; speech 82.2 s) · 6:27.68–7:58.32 (measured, dryrun1).

## s07_enu_checks
Let's check that these really are three arrows of length one, at right angles. For i hat, zero point zero seven eight squared, plus zero point nine nine seven squared, is one. [beat] The dot product of i hat and j hat is zero point zero seven eight times minus zero point seven four five, plus zero point nine nine seven times zero point zero five nine, plus zero. That's minus zero point zero five eight, plus zero point zero five nine: zero, up to rounding. So they're at right angles. [beat] The other pairs work out the same way. And with the cross product recipe, i hat cross j hat gives zero point six six two, minus zero point zero five two, and zero point seven four eight. That's k hat. [beat] So the three local arrows are right-handed, just like x hat, y hat and z hat, only turned to fit Brest. If you skipped, here's what to keep: every place has its own three arrows, east, north and up, and up always points straight away from the Earth's centre.

> 179 words · 10 sentences · 3 beats · 478.325–554.050 s (75.7 s; speech 68.3 s) · 7:58.32–9:14.05 (measured, splice2).

## s08_other_stations
Each station has its own frame. Let's zoom back out to the whole globe. Trappes, near Paris, is four hundred and eighty kilometres east of Brest. How different is its up? The angle between two ups is the angle at the Earth's centre between the two places. By the arc rule, that's the distance divided by the radius: four hundred and eighty over six thousand three hundred and seventy one. That's zero point zero seven five radians, about four point three degrees. [beat] Now Singapore, near the equator. For places far apart, the dot product is easier. The dot product of two arrows of length one is the cosine of the angle between them. Singapore's up is minus zero point two three nine, zero point nine seven one, zero point zero two four. Multiply the matching parts of the two ups, and add. That's minus zero point one five eight, minus zero point zero five zero, plus zero point zero one eight, which is minus zero point one nine one. [beat] The angle whose cosine is minus zero point one nine one is about a hundred and one degrees. [beat] So Singapore's up points more than a right angle away from Brest's up.

> 200 words · 15 sentences · 3 beats · 554.050–641.125 s (87.1 s; speech 77.9 s) · 9:14.05–10:41.12 (measured, dryrun1).

## s09_khulna
Now let's fly to Khulna, in south-west Bangladesh. Khulna lies on the rivers of the Ganges delta, just north of the Sundarbans, the largest mangrove forest in the world. To the south is the Bay of Bengal, and to the west, across the border, is Kolkata, in India. In May twenty twenty, the centre of Cyclone Amphan passed about seventy nine kilometres west of Khulna, and the sea flooded the coast to its south. Khulna is at twenty two point eight degrees north, and eighty nine point six degrees east. Its up arrow is zero point zero zero six, zero point nine two two, zero point three eight eight. [beat] Dotted with Brest's up, that's zero point zero zero four, minus zero point zero four eight, plus zero point two nine zero: zero point two four six. The angle whose cosine is zero point two four six is about seventy five point eight degrees. [beat] Even east is different. Khulna's i hat is minus one, zero point zero zero seven, zero, almost exactly opposite to x hat. It's about ninety four degrees away from Brest's east. [beat] So forecasters in Khulna and in Brest both say east, north and up, but they mean different arrows. Let's zoom back out.

> 204 words · 13 sentences · 3 beats · 641.125–730.200 s (89.1 s; speech 80.6 s) · 10:41.12–12:10.20 (measured, dryrun1).

## s10_coast_frame
Sometimes a forecaster turns her east and north arrows on purpose. On a coast, what matters is the part of the wind blowing along the shore, and the part blowing across it, onto the land or out to sea. In Part 1, we learned how to turn axes. We keep up, k hat, as it is, and turn i hat and j hat by an angle alpha, anticlockwise as seen from above. The new along arrow, x hat prime, is cosine alpha times i hat, plus sine alpha times j hat. The new across arrow, y hat prime, is that one turned by ninety degrees: minus sine alpha times i hat, plus cosine alpha times j hat. And the wind's parts along them are dot products. So everything hangs on one number: the angle of the coast. Let's find it for the south-west coast of Florida, where Hurricane Ian came ashore in September twenty twenty two.

> 156 words · 9 sentences · 0 beats · 730.200–792.875 s (62.7 s; speech 59.1 s) · 12:10.20–13:12.88 (measured, dryrun1).

## s11_coast_points
First, we need two points on the coastline. Let's take one near Naples, in Florida, at twenty six point one zero degrees north and eighty one point eight zero degrees west. And one near Englewood, further up the coast, at twenty six point nine two degrees north and eighty two point three five degrees west. Both come from a world map of coastlines. Going from Naples to Englewood, the latitude grows by zero point eight two three degrees. [beat] The longitude changes by minus zero point five five three degrees. It's minus because we go west. [beat] Now let's turn these angles into kilometres, with the rules from Part 3. The step north is the Earth's radius times the change in latitude, in radians. Zero point eight two three degrees is zero point zero one four three six radians, so the step north is six thousand three hundred and seventy one times zero point zero one four three six: about ninety one and a half kilometres. [beat] The step east is the radius, times cosine phi, times the change in longitude in radians. For phi, we use the middle latitude, twenty six and a half degrees, whose cosine is zero point eight nine five. So the step east is six thousand three hundred and seventy one, times zero point eight nine five, times minus zero point zero zero nine six five: about minus fifty five kilometres. [beat] So going up the coast, we move about ninety one and a half kilometres north, and fifty five kilometres west.

> 251 words · 14 sentences · 4 beats · 792.875–900.950 s (108.1 s; speech 98.1 s) · 13:12.88–15:00.95 (measured, dryrun1).

## s12_coast_angle
Let's draw that as a triangle on a small flat map in kilometres: ninety one and a half to the north, and fifty five to the west. The coast is the long side. We want its angle measured from north, because that's how compasses work. The angle between north and the coast has fifty five kilometres opposite it, and ninety one and a half next to it. So its tangent is fifty five divided by ninety one and a half, which is zero point six zero one. [beat] The angle whose tangent is zero point six zero one is thirty one degrees. [beat] So the coast runs thirty one degrees west of north. In Part 1, we met compass bearings: they're measured from north, turning clockwise as seen from above. Thirty one degrees anticlockwise from north is the same as three hundred and sixty minus thirty one degrees clockwise: three hundred and twenty nine degrees. [beat] That's where three hundred and twenty nine comes from. It's measured from the local north arrow, j hat, at the coast, turning clockwise, and it points north-north-west. Worked out on the round Earth instead of a flat map, the bearing comes out the same, three hundred and twenty nine degrees. Why north-north-west, and not the other way along the coast, south-south-east? Because then the across arrow, which is the along arrow turned anticlockwise, points out to sea, into the Gulf of Mexico.

> 235 words · 14 sentences · 3 beats · 900.950–999.100 s (98.1 s; speech 89.3 s) · 15:00.95–16:39.10 (measured, dryrun1).

## s13_alpha
Now we need alpha, which is measured from east, anticlockwise. In Part 1, we found that the maths angle is ninety degrees minus the bearing. Ninety minus three hundred and twenty nine is minus two hundred and thirty nine degrees. [beat] Adding a full turn of three hundred and sixty degrees doesn't change a direction, so that's the same as a hundred and twenty one degrees. [beat] Let's check: a hundred and twenty one degrees from east is ninety degrees round to north, plus thirty one more towards the west. That's the coast. [beat] So the along arrow, x hat prime, is cosine a hundred and twenty one degrees, sine a hundred and twenty one degrees: minus zero point five one five, zero point eight five seven, in east and north parts. [beat] The across arrow, y hat prime, is minus the sine, then the cosine: minus zero point eight five seven, minus zero point five one five. It points west-south-west, out to sea. [beat]

> 160 words · 9 sentences · 5 beats · 999.100–1071.750 s (72.6 s; speech 63.8 s) · 16:39.10–17:51.75 (measured, dryrun1).

## s14_along_across
Now Ian's wind. At eight in the evening, universal time, on the twenty eighth of September, about an hour after Ian came ashore, a weather model gave the wind at Fort Myers Beach as about thirty three metres per second, from the south-west. Its east part was twenty two point two, and its north part twenty four point three metres per second. [beat] The part along the coast is the dot product with x hat prime. That's twenty two point two times minus zero point five one five, plus twenty four point three times zero point eight five seven. That's minus eleven point four, plus twenty point eight: about nine point four metres per second along the shore. [beat] The part across is the dot product with y hat prime: twenty two point two times minus zero point eight five seven, plus twenty four point three times minus zero point five one five. That's minus nineteen point zero, minus twelve point five: about minus thirty one and a half, roughly minus thirty two metres per second. [beat] Minus means against y hat prime: not out to sea, but onto the land. A check: nine point four squared, plus thirty one point five squared, is about one thousand and eighty, and its square root is about thirty three, the full wind. [beat] So almost the whole wind was pushing the sea onto the coast. That push piles the water up against the shore: the storm surge that flooded Fort Myers Beach that afternoon. Storm surges get their own movie later in this series.

> 258 words · 13 sentences · 4 beats · 1071.750–1178.475 s (106.7 s; speech 97.1 s) · 17:51.75–19:38.47 (measured, dryrun1).

## s15_arrows_turn
Now a second kind of turning. Our arrows also turn by themselves, as you move over the round Earth. Suppose a plane flies due east along the parallel through Brest, at two hundred and fifty metres per second. In one hour, it covers two hundred and fifty times three thousand six hundred metres: nine hundred kilometres. [beat] At Brest, one degree of longitude is about seventy four kilometres, so that's nine hundred divided by seventy four: about twelve degrees of longitude. [beat] Seen from above the North Pole, the plane has gone twelve degrees round the axis, and its east arrow has swung round by the same twelve degrees, just like theta hat swinging round a circle. Going north tips the arrows too. After a hundred and eleven kilometres north, which is one degree of latitude, the up arrow has tilted by one degree. So for a moving air parcel, i hat, j hat and k hat keep changing. We write their rates of change as capital D i hat by D t, and so on. Capital D by D t means the rate of change as we follow the air parcel, as in the derivatives movie. How fast do the arrows turn, and which way? Let's work it out, one motion at a time.

> 213 words · 13 sentences · 2 beats · 1178.475–1265.925 s (87.5 s; speech 80.2 s) · 19:38.47–21:05.92 (measured, dryrun1).

## s16_toolkit
Now let's work out exactly how fast the arrows turn. This part is for those who enjoy every step. It isn't needed for the weather, the climate or maps, so skip ahead to the time on screen if you like. We need just two results from Part 2. Take a point going round a circle, with r hat pointing out from the centre, and theta hat pointing the way the angle grows. First, as the angle grows, r hat changes towards theta hat, and theta hat changes towards minus r hat. We wrote that as d r hat by d theta equals theta hat, and d theta hat by d theta equals minus r hat. [beat] Second, if the point moves along the circle at a speed v, its angle grows at v divided by the circle's radius, in radians per second. Putting the two together with the chain rule from the derivatives movie, theta hat changes at minus r hat, times the speed over the radius. And r hat changes at theta hat, times the speed over the radius. [beat] So here's the recipe. Find the circle, find which arrow plays r hat and which plays theta hat, and divide the speed by the circle's radius.

> 205 words · 12 sentences · 2 beats · 1265.925–1348.225 s (82.3 s; speech 75.3 s) · 21:05.92–22:28.22 (measured, splice2).

## s17_which_moves
An air parcel can move in three ways: east, north and up. Let's take them one at a time, and add them up at the end. Going straight up is the easiest. Look at our three formulas: i hat, j hat and k hat depend only on phi and lambda, the latitude and the longitude. Going up changes neither, so going up turns none of the arrows. [beat] Going north changes phi, but not lambda. And i hat, minus sine lambda, cosine lambda, zero, has no phi in it. So going north leaves i hat alone. [beat] That leaves four things to find: how going east turns i hat, how going north turns j hat and k hat, and how going east turns j hat and k hat.

> 126 words · 9 sentences · 2 beats · 1348.225–1400.075 s (51.9 s; speech 46.0 s) · 22:28.22–23:20.08 (measured, dryrun1).

## s18_i_east_a
First, going east, and i hat. Going east, the parcel moves round its parallel: a circle round the Earth's axis, whose radius is the distance from the axis, the Earth's radius times cosine phi. In the view from above the North Pole, capital R hat plays r hat, i hat plays theta hat, and lambda plays the angle. Step one: how fast does lambda grow? The parcel moves east at the speed u, round a circle whose radius is the Earth's radius times cosine phi. So lambda grows at u divided by that radius. [beat] Step two: Part 2's rule says theta hat changes towards minus r hat. So as lambda grows, i hat changes towards minus capital R hat: d i hat by d lambda equals minus capital R hat. [beat] Step three: multiply the two, by the chain rule. Capital D i hat by D t equals minus capital R hat, times u, over the Earth's radius times cosine phi. [beat] In words: going east, the east arrow swings in towards the Earth's axis.

> 173 words · 11 sentences · 3 beats · 1400.075–1476.750 s (76.7 s; speech 68.9 s) · 23:20.08–24:36.75 (measured, dryrun1).

## s19_i_east_b
But a forecaster doesn't use capital R hat. She wants the answer in her own arrows. Let's go back to Brest's meridian slice. There, we wrote k hat as cosine phi capital R hat, plus sine phi z hat. And j hat as minus sine phi capital R hat, plus cosine phi z hat. Step four: multiply the first line by cosine phi, and the second line by sine phi. Step five: take the second line away from the first. The z hat parts cancel, because cosine phi sine phi minus sine phi cosine phi is zero. The capital R hat parts give cosine squared phi plus sine squared phi, which is one. So capital R hat equals cosine phi k hat, minus sine phi j hat. [beat] In words: pointing away from the axis is partly up, and partly south. Step six: put minus capital R hat into step three. Capital D i hat by D t equals u over the Earth's radius times cosine phi, times, open bracket, j hat sine phi, minus k hat cosine phi, close bracket. [beat] So going east, the east arrow tips a little towards the north, and a little downwards. How fast? For a wind of ten metres per second towards the east at Brest, divide ten by the distance from the axis, four million two hundred and thirty thousand metres. That's about two point four times ten to the minus six radians per second. [beat] That's about twelve degrees in a day.

> 248 words · 18 sentences · 3 beats · 1476.750–1583.900 s (107.2 s; speech 97.0 s) · 24:36.75–26:23.90 (measured, dryrun1).

## s20_jk_north
Next, going north, which turns j hat and k hat. Going north, the parcel moves round its meridian: a circle round the Earth's centre, whose radius is the Earth's radius itself. In the meridian slice, k hat points out from the centre, so it plays r hat. And j hat points the way phi grows, so it plays theta hat. The parcel moves north at the speed v, so phi grows at v over the radius. [beat] Part 2's rules then give the answer at once. K hat changes towards j hat: capital D k hat by D t equals j hat, v over the radius. And j hat changes towards minus k hat: capital D j hat by D t equals minus k hat, v over the radius. [beat] In words: going north, up tips towards the north, and north tips downwards. A hundred and eleven kilometres north, divided by six thousand three hundred and seventy one kilometres, is zero point zero one seven five radians: the one-degree tilt of up that we saw before. [beat]

> 174 words · 10 sentences · 3 beats · 1583.900–1657.150 s (73.2 s; speech 66.3 s) · 26:23.90–27:37.15 (measured, dryrun1).

## s21_jk_east
Last, going east also tilts j hat and k hat. Look again at how they're built: k hat is cosine phi capital R hat, plus sine phi z hat, and j hat is minus sine phi capital R hat, plus cosine phi z hat. Going east, phi stays the same, so the sines and cosines don't change. Z hat lies along the Earth's axis, and never turns. Only capital R hat turns. In the view from above, capital R hat plays r hat, so it changes towards i hat, which plays theta hat. Capital D capital R hat by D t equals i hat, times u over the Earth's radius times cosine phi. [beat] So capital D k hat by D t is cosine phi times that. The cosines cancel, leaving i hat, u over the radius. [beat] And capital D j hat by D t is minus sine phi times the same thing: minus i hat, times u over the radius, times sine phi over cosine phi. Sine over cosine is the tangent, so that's minus i hat, u over the radius, tangent phi. [beat] In words: going east, up leans towards the east, and north leans towards the west.

> 198 words · 12 sentences · 3 beats · 1657.150–1741.425 s (84.3 s; speech 76.2 s) · 27:37.15–29:01.42 (measured, dryrun1).

## s22_add_motions
Now let's add the motions. In a short time, the parcel moves a little east and a little north. As in the total differential from the derivatives movie, the small changes from each move add up. So capital D i hat by D t equals u over the radius times cosine phi, times, open bracket, j hat sine phi, minus k hat cosine phi, close bracket. Capital D j hat by D t equals minus i hat, u over the radius, tangent phi, minus k hat, v over the radius. And capital D k hat by D t equals i hat, u over the radius, plus j hat, v over the radius. [beat] Every piece is a speed divided by a radius, just as round the hurricane in Part 2. Speed over radius is how fast the arrows turn. And here's a check. The change of i hat has no i hat part, the change of j hat has no j hat part, and the change of k hat has no k hat part. That has to be so. An arrow of length one can only turn, never grow, so its change is always at right angles to itself. [beat] No earlier movie derived these three lines. The cross product at work met a close cousin: an arrow carried round by a spin changes at Omega cross the arrow. These three lines follow the same rule, with the flow's own turning in place of the Earth's spin. If you skipped, here's what to keep: as air moves over the round Earth, its east, north and up arrows turn, at about its speed divided by the Earth's radius.

> 275 words · 16 sentences · 2 beats · 1741.425–1850.075 s (108.7 s; speech 100.3 s) · 29:01.42–30:50.08 (measured, splice2).

## s23_whole_vector
Why does all this matter? Because of Newton's law. The next three steps show where the turning arrows end up in it. They're for anyone who wants every step, and you don't need them for the intuition of weather, climate or maps, so skip ahead to the time on screen if you like. Force equals mass times acceleration, and the acceleration is the rate of change of the whole wind arrow, bold v, as we follow the air parcel. Bold v is u i hat, plus v j hat, plus w k hat. Each of those is a number times an arrow, and as the parcel moves, both of them change. So we need the product rule from Part 2. The change of a number times an arrow is the change of the number times the arrow, plus the number times the change of the arrow. [beat] Using it on all three pieces gives six terms. Capital D bold v by D t equals capital D u by D t times i hat, plus u times capital D i hat by D t. Plus capital D v by D t times j hat, plus v times capital D j hat by D t. Plus capital D w by D t times k hat, plus w times capital D k hat by D t. [beat] In each pair, the first term is the change of the number, and the second is the change of the arrow.

> 234 words · 14 sentences · 2 beats · 1850.075–1938.400 s (88.3 s; speech 80.7 s) · 30:50.08–32:18.40 (measured, splice2).

## s24_dot_i_a
Let's find the eastward part of this acceleration. How do we get the part of any arrow along i hat? With the dot product, as in Part 1. So we dot all six terms with i hat, one at a time. First term: capital D u by D t, times i hat dot i hat. I hat dot i hat is one, so it's capital D u by D t. [beat] Second term: u times capital D i hat by D t, dot i hat. The change of i hat has only j hat and k hat parts, and both are at right angles to i hat. So this term is zero. [beat] Third term: capital D v by D t, times j hat dot i hat. J hat is at right angles to i hat, so that's zero too. [beat] Fifth term, in the same way: capital D w by D t, times k hat dot i hat, is zero. [beat]

> 158 words · 12 sentences · 4 beats · 1938.400–2001.225 s (62.8 s; speech 54.0 s) · 32:18.40–33:21.22 (measured, dryrun1).

## s25_dot_i_b
Now the two terms that survive. Fourth term: v times capital D j hat by D t, dot i hat. Capital D j hat by D t has an i hat part, minus u over the radius tangent phi, and a k hat part, which the dot product drops. So this term is v times minus u over the radius tangent phi: minus u v tangent phi over the radius. [beat] Sixth term: w times capital D k hat by D t, dot i hat. Capital D k hat by D t has the i hat part, u over the radius. So this term is plus u w over the radius. [beat] Adding the six terms, capital D bold v by D t dot i hat equals capital D u by D t, minus u v tangent phi over the radius, plus u w over the radius. [beat] The first term is the change of the number u. The other two come only from the turning arrows of our coordinates. They're called metric terms. With the same recipe, dotting with j hat and with k hat, we get the northward and upward parts, each with metric terms of its own. [beat] If you skipped, here's what to keep: because the arrows turn, the wind's numbers can change even when nothing pushes the air, and the extra terms that say so are called metric terms.

> 230 words · 13 sentences · 4 beats · 2001.225–2094.675 s (93.5 s; speech 83.8 s) · 33:21.22–34:54.68 (measured, splice2).

## s26_glider
What do the metric terms mean? Let's try a thought experiment. Imagine a puck gliding over a smooth Earth that doesn't spin, with nothing pushing it along the ground. Then the eastward part of its acceleration, capital D bold v by D t dot i hat, is zero. So capital D u by D t must equal u v tangent phi over the radius, minus u w over the radius. The puck stays on the ground, so w is zero, and that leaves u v tangent phi over the radius, which isn't zero. So the puck's eastward number changes, even though nothing pushes it. Let's start it at forty five degrees north, going north-east, at ten metres per second east and ten north. After one day, its east part has grown to about eleven and a half, and its north part has shrunk to about eight point two. [beat] But its speed is still fourteen point one metres per second. [beat] The puck goes straight, along a great circle, which we'll meet in Part 6. It's our arrows that turned under it. Metric terms never speed anything up or slow it down. They only share the same speed out between east and north, as the arrows turn.

> 205 words · 14 sentences · 2 beats · 2094.675–2178.750 s (84.1 s; speech 76.4 s) · 34:54.68–36:18.75 (measured, splice3).

## s27_metric_size
How big are they? Take the same wind, ten metres per second east and ten north, at forty five degrees, where the tangent is one. U v tangent phi over the radius is ten times ten times one, divided by six point three seven one million metres. That's about one point six times ten to the minus five metres per second squared. [beat] Let's compare the Coriolis effect, from the cross product movies: f times v, where f is two Omega sine phi. Two times seven point two nine times ten to the minus five, times zero point seven zero seven, is one point zero three times ten to the minus four per second. Times ten metres per second, that's about one point zero times ten to the minus three. [beat] So the metric term is about sixty six times smaller. [beat] In one weather system, metric terms are small. But they grow near the poles, where the tangent gets large, and over flows that span whole oceans or the whole globe, so weather and climate models keep them. We'll meet them again in a later movie: From F equals mass times acceleration, to the equation of motion.

> 195 words · 11 sentences · 3 beats · 2178.750–2260.775 s (82.0 s; speech 74.3 s) · 36:18.75–37:40.78 (measured, dryrun1).

## s28_recap
To sum up, a forecaster's local frame has three arrows: i hat east, j hat north and k hat up, and the wind is u i hat, plus v j hat, plus w k hat. Up is the arrow from the Earth's centre, east comes from turning in the view from above the pole, and north from turning in the meridian slice. Every place has its own frame: Brest's up and Khulna's up are about seventy five point eight degrees apart. Turning the frame to a coast, at a bearing of three hundred and twenty nine degrees, split Ian's wind into about nine metres per second along the shore, and about thirty two onto the land. As the air moves, the arrows turn by themselves, at speeds divided by radii. So the eastward acceleration is capital D u by D t, minus u v tangent phi over the radius, plus u w over the radius: two metric terms that come only from the turning arrows. For an ordinary wind, they're about sixty six times smaller than the Coriolis effect, but weather and climate models keep them. In Part 5, we'll let the frame itself move, and see what a storm's winds look like to someone riding along with it.

> 207 words · 8 sentences · 0 beats · 2260.775–2338.075 s (77.3 s; speech 74.0 s) · 37:40.78–38:58.07 (measured, splice3).

## s29_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for coordinates, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 56 words · 3 sentences · 0 beats · 2338.075–2360.975 s (22.9 s; speech 21.9 s) · 38:58.07–39:20.97 (measured, dryrun1).
