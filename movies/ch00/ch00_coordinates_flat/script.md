# ch00_coordinates_flat — narration (movie-director, 2026-11-05)

Series plan v6 **#5a, position 7**: "Coordinates, Part 1: on a flat map, from Cartesian to polar and turned axes".
Split plan `movies/ch00/ch00_coordinates/split_plan.md` §2b (commit 73044df). House style `movies/HOUSE_STYLE.md` (binding).
Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice; our own words; maths spoken in words; `[beat]` = 1.5-s hold
after a worked calculation (not spoken, not captioned). Lines starting with ">" are notes and are not spoken; the README
below uses `###` headings so that `tools/tts.py` does not read it as a scene.

### README

**Measured, not estimated** (`tools/tts.py` dry run, see the numbers block at the end of this README).

**Scene list** (measured length per scene; S = sentences; * = pending the data report)

| # | Scene | One line | Length |
|---|---|---|---|
| 0 | s00_title | title "Coordinates, Part 1"; one sentence; polar sweep, then Ian's ring | 10.5 s (27 w) |
| 1 | s01_hook | what are coordinates, why more than one kind; "the first of five parts" | 20.4 s (57 w) |
| 2 | s02_coordinates | origin, axes, the balloon at (3, 4) km, Cartesian (kept) | 51.3 s (118 w) |
| 3 | s03_cartesian_arrows | x̂, ŷ, the same everywhere (kept) | 50.6 s (130 w) |
| 4 | s04_polar | r = 5 km by Pythagoras, θ ≈ 53° (kept) | 56.8 s (126 w) |
| 5 | s05_polar_back | x = r cos θ, y = r sin θ, checked (kept) | 44.0 s (103 w) |
| 6 | s06_bearings | compass bearing = 90° − θ; wind "from" (kept) | 39.8 s (85 w) |
| 7 | s07_radians | s = r θ; 1 rad ≈ 57°; rings 5 and 50 km (kept, Should 1) | 64.2 s (147 w) |
| 8 | s08_r_hat | r̂ = arrow ÷ its length = (cos θ, sin θ); the way r grows; (0.6, 0.8) | 71.5 s (173 w) |
| 9 | s09_where_theta_grows | D01: hold r, grow θ: the balloon slides round; no part along r̂; anticlockwise → +90° | 79.2 s (184 w) |
| 10 | s10_turn_90 | D02: the 90° turn rule (p, q) → (−q, p) from x̂, ŷ; check on (3, 4) → (−4, 3) | 95.1 s (220 w) |
| 11 | s11_theta_hat | D03: θ̂ = (−sin θ, cos θ); the triangle turned; checks at 0°, 90°, the balloon, a 0.1° slide | 107.3 s (246 w) |
| 12 | s12_arrows_depend | r̂, θ̂ turn round the circle; x̂, ŷ don't | 39.8 s (99 w) |
| 13 | s13_components | D04: the wind (10, 0) with every input on screen; u_r = 6, u_θ = −8 labelled as computed | 110.9 s (256 w) |
| 14 | s14_rebuild_general | D04 check: 6 r̂ − 8 θ̂ = (10, 0); length 10; the general u_r, u_θ formulas | 81.1 s (187 w) |
| 15 | s15_turn_axes | keep the arrow, turn the rulers; x̂′ = (cos α, sin α); α = 30° | 69.0 s (167 w) |
| 16 | s16_y_prime | D05: ŷ′ by the 90° rule, drawn; (−0.5, 0.866); checks | 60.5 s (146 w) |
| 17 | s17_new_components | D06: x′, y′ as shadows on the new rulers; (3, 4) → (4.6, 1.96); length 5 | 103.8 s (236 w) |
| 18 | s18_matrix | D07: line the two equations up → the rotation matrix; row × column; direction cosines | 84.2 s (214 w) |
| 19 | s19_index_form | D08: x′_j = x_i C_ij with C_ij = e_i · e′_j, all four computed, j = 1 and 2 written out | 140.1 s (348 w) |
| 20 | s20_polar_is_turned | D09: α = θ gives r̂, θ̂; the wind → (6, −8); the balloon → (5, 0) | 113.8 s (260 w) |
| 21 | s21_ian_polar* | Ian, 28 Sep 2022, 18 UTC; u, v from the model; origin at the eye's centre; zoom | 62.8 s (162 w) |
| 22 | s22_spin_inflow* | the 25-km ring, 72 points, averages: 37 round, −12.5 in; official 135 kt | 101.2 s (230 w) |
| 23 | s23_what_numbers_mean* | D10: 37 vs 12.5; 45 km/h; 33 min; 74 km round, half a lap; 3 round per 1 in; spiral | 118.9 s (294 w) |
| 24 | s24_ring_points* | D11: three ring points (0°, 90°, 135°): u, v → u_r, u_θ with numbers | 140.4 s (326 w) |
| 25 | s25_why_polar_storm* | labelled curves: u, v swing; u_θ near 37, u_r negative or near zero all round | 88.3 s (219 w) |
| 26 | s26_inflow_angle* | inflow angle ≈ 19°; four angles side by side; vorticity pointer | 72.2 s (171 w) |
| 27 | s27_recap | "To sum up", teaser to Part 2 | 85.0 s (208 w) |
| 28 | s28_end | series end card, maths ending, word for word | 22.9 s (56 w) |

**Length:** 36:28.25 measured (5195 words; 36.6 min at 142 words per minute).

**User feedback covered (Part 1 items of the split plan §1a; every one addressed in this script and the storyboard).**
- [x] U-CO-001 θ̂ derived before the formula: s09 (D01), s10 (D02), s11 (D03).
- [x] U-CO-002 why θ̂ is drawn where it is: s09 (hold r, grow θ, the balloon slides round the circle).
- [x] U-CO-003 why that direction (anticlockwise, +90° not −90°) and how it gives the formula: s09 → s10 → s11.
- [x] U-CO-007 values of u and θ written during the u_r, u_θ calculation: s13 (inputs row: u = (10, 0) m/s, θ = 53°, r̂, θ̂).
- [x] U-CO-008 r̂ and θ̂ labelled: s08–s14 (tip labels on the arrows at the balloon for every scene they appear in).
- [x] U-CO-009 u_r and u_θ labelled exactly when computed: s13 (each component arrow grows on its own result words).
- [x] U-CO-010 the eye re-centred (up and left): s21–s24, **pending the data report** (centre parameter block).
- [x] U-CO-011 the meaning of 12.5 and how it differs from 37: s23 (D10).
- [x] U-CO-012 eastward/northward curves labelled: s25 (end labels + legend, spoken "solid" and "dashed").
- [x] U-CO-013 u, v shown at some ring points: s24 (three points, arrows split into east and north parts).
- [x] U-CO-014 tangential/radial curves labelled: s25 (end labels "round: u_θ", "in or out: u_r" + legend).
- [x] U-CO-015 u_r, u_θ calculated at a few points: s24 (D11, all three points).
- [x] U-CO-016 the explanation after the plot rewritten slowly: s25 (one idea per sentence; why u, v swing; dashed means).
- [x] U-CO-017 inflow angle vs the other angles: s26 (four-angle contrast).
- [x] U-CO-022 Ian shown correctly from the data: s21–s22 product, time and centre on the source line; **pending the data report**.
- [x] U-CO-025 Ian's data and maps checked: storyboard `data_block`, **pending the data report**.
- [x] U-CO-026 swap to the Bay of Bengal storm if Ian cannot be corrected: s21–s26 written swappable (`data_block`, `swap_rules`).
- [x] U-CO-027 better or more detailed data sources: `data_block.product` follows the data report (**pending**).
- [x] U-CO-028 best tools for maps: `tool` / `runner_up` per data scene follow the data report (**pending**).
- [x] U-CO-054 every equation and calculation clarified: goal → each factor named → CalcStack with inputs → meaning, in every scene.
- [x] U-CO-057 nothing used before it is explained: the 90° rule (s10), direction cosines (s18), index form recalled (s19).
- [x] U-CO-084 ŷ′ = (−sin α, cos α) derived and drawn: s16 (D05).
- [x] U-CO-085 what x′, y′ are and why dot products: s17 (D06, shadows on the new rulers).
- [x] U-CO-086 don't rush: one move per sentence, `[beat]` after every worked number (68 beats).
- [x] U-CO-087 where the rotation matrix comes from: s18 (D07, the two lines lined up).
- [x] U-CO-088 x_i C_ij and e_i · e′_j slowly: s19 (D08, all four C's, j = 1 and j = 2 written out).
- [x] U-CO-089 the rest of that frame (polar = turned axes): s20 (D09, with the balloon: (6, −8) and (5, 0)).
- [x] U-CO-099 later-movie concepts ≤ 1 min, then named (voice + keyword): *Tensors made easy* (s19), *How tropical
  cyclones form* (s23), *Vorticity in plain words* (s26), Part 2 (s12, s23, s27).
- [x] U-CO-100 what is not planned later is explained here: the 90° turn rule, direction cosines, the ring average.
- [x] U-CO-101 smooth flow across the split: "first of five parts" (s01), Part 2 teaser (s27).

**Review 1 and fix-loop-1 guards kept in Part 1** (split plan §1b–§1c): Must 4 (radial arrow ≥ 90 px, rose, at the eye,
s22), Must 5 (links leave from their text's left edge, s22), Should 1 ("2π r" outside the circle, s07), Should 2 (KaTeX
hats only), Should 3 ("negative, or nearly zero, all the way round", s25), Should 4 ("official estimate", s22),
Should 14 (end card 24-px gap, s28), Should 18 (an opening keyword from frame 0 in every scene); fix-loop rules 4, 6, 7, 8.

**Spoken-symbol rules.** No lone "a" anywhere (Kokoro reads it as the article): the 90° rule uses p and q. "r hat",
"theta hat", "x hat prime", "y hat prime"; "u sub r", "u sub theta"; "x sub one", "C one two" (index form); "cosine
alpha", "sine alpha" (never "cos"); "bold u" for the wind arrow, "u" for its eastward part, "v" for its northward part.
Every clockwise/anticlockwise carries "as seen from above" (and the hemisphere for the storm).

**Proposed lexicon entries:** none new for Part 1 (Descartes checked by ear in build 1; no other hard word).

**Measured** (`tools/tts.py` dry run 2026-11-05 into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_flat/dryrun3`, Kokoro af_bella x 1.0, current `movies/lexicon.yaml`, not edited): **29 scenes, 363 sentences, 5195 words, 68 beats; narration 2185.750 s + 2.5-s silent end-card hold = 2188.250 s (36:28.25)**; speech alone 1968.6 s = 158.3 words per minute while speaking, **142.6 words per minute overall** (limit 150); 508 caption cues; warnings: ['s08_r_hat s3: 17.2 chars/s > 17.0 (slow the speed or shorten)', 'cue 212: 7.3 s / 2 lines out of house limits'].

**Estimated length at the plan rate (142 words per minute):** 5195 / 142 = 36.6 min. The split plan's estimate for Part 1 was about 3620 words, 25.5 min; the new derivations, the inputs rows and the slower pacing the user asked for add the difference (see the open question in the hand-back).

## s00_title
In this video, we'll learn coordinates on a flat map the easy way, and see how meteorology uses them to measure the winds round a hurricane's eye.

> 27 words · 1 sentences · 0 beats · 0.300–10.775 s (10.5 s; speech 9.7 s) · 0:00.30–0:10.78 (measured, dry run 2026-11-05).

## s01_hook
What are coordinates, and why do we need more than one kind? This is the first of five parts on coordinates, and in this part, we stay on a flat map. Let's see what coordinates are, and why they're built the way they are. Then let's see what they tell us about the winds round a hurricane.

> 57 words · 4 sentences · 0 beats · 10.775–31.175 s (20.4 s; speech 18.6 s) · 0:10.78–0:31.18 (measured, dry run 2026-11-05).

## s02_coordinates
Let's start with a flat map. To say where something is, we need a starting point, and some directions to count from. The starting point is called the origin. Let's put it at a weather station. Now draw one line through it pointing east, and one pointing north. These lines are called the axes. A weather balloon drifts three kilometres east and four kilometres north of the station. So we can write its position as the pair of numbers three and four. [beat] These two numbers are called its coordinates, and together they pin down one place on the map. Measuring along straight axes at right angles, like this, is called Cartesian coordinates, after the French thinker René Descartes.

> 118 words · 10 sentences · 1 beats · 31.175–82.450 s (51.3 s; speech 46.2 s) · 0:31.18–1:22.45 (measured, dry run 2026-11-05).

## s03_cartesian_arrows
Each axis comes with a unit vector: an arrow of length one that points along it. We write x hat for the arrow pointing east, and y hat for the arrow pointing north. The balloon's position is three times x hat, plus four times y hat. We met arrows like these in the vectors movie of this series. Here's their key property: x hat points the same way everywhere on the map. Move the balloon anywhere you like, and the two arrows don't change. That's what makes Cartesian coordinates so easy to work with. But many things in the weather aren't laid out in squares. A hurricane spins round its eye, and a weather radar looks out in rings. For those, there's a better way to say where something is.

> 130 words · 10 sentences · 0 beats · 82.450–133.025 s (50.6 s; speech 46.6 s) · 1:22.45–2:13.03 (measured, dry run 2026-11-05).

## s04_polar
Instead of going east and north, we can give two other numbers: how far away the balloon is, and in which direction. The distance from the origin is called r. By Pythagoras, r is the square root of three squared plus four squared, which is the square root of twenty five: five kilometres. [beat] The direction is an angle, called theta. Mathematicians measure it from the east axis, turning anticlockwise as seen from above. Its tangent is four over three, so theta is about fifty three degrees. [beat] So the same balloon is at r equals five kilometres, and theta equals fifty three degrees. These two numbers are called polar coordinates. A weather radar measures exactly this pair: how far away the raindrops are, and in which direction.

> 126 words · 9 sentences · 2 beats · 133.025–189.850 s (56.8 s; speech 50.9 s) · 2:13.03–3:09.85 (measured, dry run 2026-11-05).

## s05_polar_back
Can we go back the other way? Yes. Think of the right triangle with the balloon at its tip. Its long side is r, and its angle at the station is theta. The side going east is r times cosine theta, and the side going north is r times sine theta. Let's check. Five times the cosine of fifty three degrees is five times zero point six, which is three. And five times zero point eight is four. [beat] So x equals r cosine theta, and y equals r sine theta. These two lines are all we need to switch between the two systems.

> 103 words · 10 sentences · 1 beats · 189.850–233.800 s (44.0 s; speech 38.9 s) · 3:09.85–3:53.80 (measured, dry run 2026-11-05).

## s06_bearings
One warning before we go on. Meteorologists and navigators measure directions differently. A compass bearing starts from north, and turns clockwise as seen from above. So the balloon's bearing is ninety minus fifty three, which is thirty seven degrees. [beat] Weather reports add one more twist: a wind's direction says where the wind blows from, as we saw in the weather basics movie. So a west wind blows towards the east. Same arrows, different rulers, so it's always worth checking which angle a data set uses.

> 85 words · 7 sentences · 1 beats · 233.800–273.650 s (39.8 s; speech 35.8 s) · 3:53.80–4:33.65 (measured, dry run 2026-11-05).

## s07_radians
Before polar coordinates can do their real work, we need one more building block: measuring angles in radians. Take a circle of radius r, and walk along its edge. The angle in radians is the distance you walked, divided by the radius. So the distance along the edge, called the arc length, is the radius times the angle. A full circle is two pi radians, because its edge is two pi times the radius. So one radian is about fifty seven degrees. Let's try easy numbers. On a ring five kilometres from the station, turning by zero point two radians walks you five times zero point two, which is one kilometre. [beat] On a ring fifty kilometres out, the same turn walks you ten kilometres. [beat] The same angle gives ten times the distance. Keep this rule in mind, because it explains a lot about maps of the Earth.

> 147 words · 11 sentences · 2 beats · 273.650–337.800 s (64.2 s; speech 57.5 s) · 4:33.65–5:37.80 (measured, dry run 2026-11-05).

## s08_r_hat
Polar coordinates come with their own unit vectors, so let's build them one at a time. The first is called r hat. It's an arrow of length one that points straight away from the station, towards the balloon. Here's how to get it. The arrow from the station to the balloon is three, four, and its length is r, five kilometres. Dividing an arrow by its own length keeps its direction, and makes its length one. So r hat is three fifths, four fifths, which is zero point six, zero point eight. [beat] Its length is one, because zero point three six plus zero point six four is one. The same works for any point. The arrow to it is r cosine theta, r sine theta, as we just saw. Dividing by r, the r cancels, so r hat is cosine theta, sine theta. [beat] Why is it called r hat? Hold theta fixed and let r grow, and the balloon slides straight outward, along this arrow. So r hat points the way r grows.

> 173 words · 14 sentences · 2 beats · 337.800–409.275 s (71.5 s; speech 63.8 s) · 5:37.80–6:49.27 (measured, dry run 2026-11-05).

## s09_where_theta_grows
Now the second arrow, theta hat. Its job is to point the way theta grows. So let's do the same experiment, with the roles swapped. Hold r fixed at five kilometres, and let theta grow a little. The balloon slides along the circle of radius five kilometres round the station. Which way is that, exactly? While it slides, its distance from the station doesn't change. If its move had any part along r hat, the balloon would get further from the station, or closer to it. So a small slide along the circle has no part along r hat: it's at right angles to r hat. That's why the edge of a circle always runs at right angles to its radius. But there are two directions at right angles to r hat: one turned anticlockwise from it, and one turned clockwise. Theta grows anticlockwise, as seen from above, so the balloon slides anticlockwise. So theta hat is r hat, turned by ninety degrees anticlockwise. [beat] To turn that picture into numbers, we need one small tool: a rule for turning any arrow by ninety degrees.

> 184 words · 14 sentences · 1 beats · 409.275–488.425 s (79.2 s; speech 72.7 s) · 6:49.27–8:08.43 (measured, dry run 2026-11-05).

## s10_turn_90
Let's start with the two easiest arrows. Turn x hat, which points east, by ninety degrees anticlockwise, and it points north. So it becomes zero, one. [beat] Turn y hat, which points north, and it points west. So it becomes minus one, zero. [beat] Now take any arrow, with an east part p and a north part q. It's p steps along x hat, followed by q steps along y hat. If we turn the whole drawing by ninety degrees, both pieces turn together, and they stay joined, tip to tail. So the p steps east become p steps north, and the q steps north become q steps west. Steps to the west count as minus in the east part. So the turned arrow is minus q, p. [beat] In words: swap the two numbers, and put a minus sign on the first one. Let's try it on the balloon's arrow, three, four. Swap them, and put a minus on the first: minus four, three. [beat] Is that really a quarter turn? Its length is the square root of sixteen plus nine, which is five, the same as before. And its dot product with three, four is three times minus four, plus four times three, which is zero. [beat] A zero dot product means a right angle, as we saw in the dot product movie.

> 220 words · 18 sentences · 5 beats · 488.425–583.550 s (95.1 s; speech 82.6 s) · 8:08.43–9:43.55 (measured, dry run 2026-11-05).

## s11_theta_hat
Now let's turn r hat itself. Its east part is cosine theta, and its north part is sine theta. Using the rule, we swap them and put a minus on the first. So theta hat is minus sine theta, cosine theta. [beat] Here's the same thing as a picture. Turn r hat's little triangle by ninety degrees. Its east side, cosine theta, now points north, so cosine theta becomes the north part. Its north side, sine theta, now points west, so minus sine theta becomes the east part. Let's check that this makes sense. At theta equals zero, the point is due east of the station, and theta hat is zero, one. It points north, which is the way the point slides when theta grows. [beat] At ninety degrees, the point is due north, and theta hat is minus one, zero. It points west. [beat] At the balloon, theta hat is minus zero point eight, zero point six. [beat] Its length is one, and its dot product with r hat is minus zero point four eight plus zero point four eight, which is zero, so it's at right angles. And one last check, with no formula at all. Turn the balloon by a tenth of a degree. By the arc rule, it slides about eight point seven metres along the circle: about seven metres west, and five point two metres north. Dividing each by eight point seven gives about minus zero point eight and zero point six: theta hat again. [beat]

> 246 words · 19 sentences · 5 beats · 583.550–690.825 s (107.3 s; speech 94.9 s) · 9:43.55–11:30.83 (measured, dry run 2026-11-05).

## s12_arrows_depend
Now let's move the balloon round the circle, and watch both arrows. Due east of the station, r hat points east, and theta hat points north. Due north, r hat points north, and theta hat points west. Due west, r hat points west, and theta hat points south. So r hat and theta hat turn as the balloon goes round, while x hat and y hat never change. That's the big difference between the two systems: polar unit vectors depend on where you are. Keep this in mind, because these turning arrows will matter a lot in Part 2.

> 99 words · 7 sentences · 0 beats · 690.825–730.675 s (39.8 s; speech 37.0 s) · 11:30.83–12:10.67 (measured, dry run 2026-11-05).

## s13_components
Now let's describe a wind in polar coordinates. Suppose that at the balloon, the wind blows due east at ten metres per second. We'll call the wind arrow bold u. Its eastward part is called u, and its northward part v. Here, u is ten and v is zero. [beat] How much of this wind blows away from the station, and how much blows round it? The part along r hat is called the radial wind, u sub r. The part along theta hat is called the tangential wind, u sub theta. To find each one, we take the dot product of the wind with that unit vector, as in the dot product movie. It gives the length of the wind's shadow along that arrow. Here are the inputs. The wind is ten, zero. The angle theta is fifty three degrees. R hat is zero point six, zero point eight, and theta hat is minus zero point eight, zero point six. First, the radial wind. Multiply the matching parts, and add: ten times zero point six, plus zero times zero point eight. That's six plus zero, so u sub r is six metres per second. [beat] Next, the tangential wind: ten times minus zero point eight, plus zero times zero point six. That's minus eight plus zero, so u sub theta is minus eight metres per second. [beat] So six metres per second blow away from the station, and eight blow round it. The minus sign means the wind goes round against theta hat: clockwise, as seen from above.

> 256 words · 21 sentences · 3 beats · 730.675–841.525 s (110.9 s; speech 99.6 s) · 12:10.67–14:01.52 (measured, dry run 2026-11-05).

## s14_rebuild_general
Let's check that these two parts really make up the same wind. We rebuild it: six times r hat, plus minus eight times theta hat. Six times zero point six, zero point eight is three point six, four point eight. [beat] Minus eight times minus zero point eight, zero point six is six point four, minus four point eight. [beat] Adding the east parts gives three point six plus six point four, which is ten. Adding the north parts gives four point eight minus four point eight, which is zero. [beat] We're back to ten, zero: the same wind, measured with new arrows. Its length agrees too: six squared plus eight squared is a hundred, and its square root is ten. [beat] The same dot products work for any wind and any angle. With the wind u, v, and r hat equal to cosine theta, sine theta, u sub r is u cosine theta plus v sine theta. [beat] And with theta hat equal to minus sine theta, cosine theta, u sub theta is minus u sine theta plus v cosine theta. [beat] We'll use these two lines on a real hurricane soon.

> 187 words · 12 sentences · 6 beats · 841.525–922.575 s (81.1 s; speech 69.5 s) · 14:01.52–15:22.58 (measured, dry run 2026-11-05).

## s15_turn_axes
Now let's look at a second way to change coordinates. This time, we keep the origin where it is, and we just turn the axes. Why would we want that? Along a coastline, a runway or a valley, it's often more useful to measure along it and across it than east and north. The arrow itself stays the same. Only the rulers we measure it with turn. Say the new x axis is turned by an angle alpha, anticlockwise as seen from above. We call its unit vector x hat prime. The little dash is read prime, and it marks the new axes. Like r hat, it's an arrow of length one at an angle, so it's cosine alpha, sine alpha. [beat] Let's use alpha equals thirty degrees. Cosine of thirty degrees is about zero point eight seven, or more exactly zero point eight six six, and sine of thirty degrees is exactly one half. So x hat prime is zero point eight six six, zero point five. [beat]

> 167 words · 13 sentences · 2 beats · 922.575–991.575 s (69.0 s; speech 62.1 s) · 15:22.58–16:31.58 (measured, dry run 2026-11-05).

## s16_y_prime
What about the new y axis? It must be at right angles to the new x axis, and turned anticlockwise from it, just as north is from east. So y hat prime is x hat prime turned by ninety degrees, and we already have the rule for that: swap the two numbers, and put a minus on the first. That gives minus sine alpha, cosine alpha. [beat] With thirty degrees, y hat prime is minus zero point five, zero point eight six six. [beat] Let's check it. Its length is one, because zero point two five plus zero point seven five is one. And its dot product with x hat prime is zero point eight six six times minus zero point five, plus zero point five times zero point eight six six, which is zero. [beat] So the new axes are at right angles, just like the old ones.

> 146 words · 9 sentences · 3 beats · 991.575–1052.050 s (60.5 s; speech 53.4 s) · 16:31.58–17:32.05 (measured, dry run 2026-11-05).

## s17_new_components
Now we can measure the balloon's arrow, three, four, with the new rulers. Its new coordinates are called x prime and y prime. X prime answers one question: how much of the arrow lies along the new x axis? That's the length of the arrow's shadow on that axis, which is its dot product with x hat prime. Multiply the matching parts, and add: x times cosine alpha, plus y times sine alpha. [beat] In the same way, y prime is the dot product with y hat prime: minus x sine alpha, plus y cosine alpha. [beat] Now the numbers, with x equals three, y equals four, and alpha equals thirty degrees. X prime is three times zero point eight six six, plus four times zero point five. That's two point six plus two, about four point six. [beat] Y prime is minus three times zero point five, plus four times zero point eight six six. That's minus one point five plus three point four six, about one point nine six. [beat] So in the turned axes, the balloon is at about four point six, one point nine six. Is it the same arrow? Its length is the square root of four point six squared plus one point nine six squared. That's the square root of twenty five: five kilometres, as before. [beat] The arrow didn't move. Only the numbers that describe it changed, because we measure it with different rulers.

> 236 words · 17 sentences · 5 beats · 1052.050–1155.850 s (103.8 s; speech 91.7 s) · 17:32.05–19:15.85 (measured, dry run 2026-11-05).

## s18_matrix
These two lines have the same shape, so let's line them up. Write x prime above y prime, with the x terms in one column and the y terms in the other. Now look at just the four numbers in front of x and y. The top row is cosine alpha and sine alpha, and the bottom row is minus sine alpha and cosine alpha. That square of four numbers is called a rotation matrix, because it turns old coordinates into new ones. To use it, go along one row. Multiply its first number by x, and its second number by y, then add. The top row gives x prime, and the bottom row gives y prime. With our numbers, the top row gives zero point eight six six times three, plus zero point five times four: four point six again. [beat] Each of the four numbers has a meaning, too. The dot product of two arrows of length one is the cosine of the angle between them. So each number is the cosine of the angle between one new axis and one old axis. That's why they're called direction cosines. For example, the angle between x hat prime and x hat is alpha, so their dot product is cosine alpha: the top left number.

> 214 words · 14 sentences · 1 beats · 1155.850–1240.050 s (84.2 s; speech 77.7 s) · 19:15.85–20:40.05 (measured, dry run 2026-11-05).

## s19_index_form
In the vectors movie, we met index notation, a short way to write all of this. Let's rewrite it one step at a time. First, the names. The old coordinates x and y become x sub one and x sub two. The old unit vectors x hat and y hat become e sub one and e sub two, and the new ones become e prime sub one and e prime sub two. Next, each direction cosine gets two labels. C sub i j is the dot product of old arrow number i with new arrow number j. Let's work out all four. C one one is x hat dot x hat prime, which is cosine alpha. [beat] C one two is x hat dot y hat prime, which is minus sine alpha. [beat] C two one is y hat dot x hat prime, which is sine alpha. [beat] And C two two is y hat dot y hat prime, which is cosine alpha. [beat] Now the rule: new coordinate number j is x sub i times C sub i j. The index i appears twice, so, as in the vectors movie, we add up the terms for i equals one and i equals two. For j equals one, that's x sub one times C one one, plus x sub two times C two one. That's x cosine alpha plus y sine alpha: our x prime. [beat] For j equals two, it's x sub one times C one two, plus x sub two times C two two. That's minus x sine alpha plus y cosine alpha: our y prime. [beat] So the short line says exactly what our two long lines say. If we set the four C's in a square, with i for the row and j for the column, we get our rotation matrix flipped over its diagonal. That's only because this form reads down the columns instead of along the rows, and the four numbers are the same. The same rule works in three dimensions, and for things called tensors, which have their own movie later in this series: Tensors made easy.

> 348 words · 22 sentences · 6 beats · 1240.050–1380.125 s (140.1 s; speech 125.0 s) · 20:40.05–23:00.12 (measured, dry run 2026-11-05).

## s20_polar_is_turned
Here's a nice link between the two ideas. Go back to the balloon, at fifty three degrees, and turn the axes by alpha equals theta, fifty three degrees. Then x hat prime is cosine theta, sine theta, which is r hat. And y hat prime is minus sine theta, cosine theta, which is theta hat. [beat] So r hat and theta hat are just the east and north arrows, turned by the angle theta. That means the polar parts of any arrow are its coordinates in turned axes. Let's check with the east wind, ten, zero. X prime is ten times zero point six, plus zero times zero point eight, which is six. [beat] Y prime is minus ten times zero point eight, plus zero times zero point six, which is minus eight. [beat] Those are exactly u sub r and u sub theta from before. Now the balloon's own position arrow, three, four. X prime is three times zero point six, plus four times zero point eight. That's one point eight plus three point two, which is five. [beat] Y prime is minus three times zero point eight, plus four times zero point six. That's minus two point four plus two point four, which is zero. [beat] So the balloon is at five, zero in these axes: five kilometres along r hat, and nothing along theta hat, because r hat points straight at the balloon. There's one difference, though. With turned axes, we choose one angle for the whole map. With polar coordinates, the angle is theta, so it changes from place to place.

> 260 words · 19 sentences · 5 beats · 1380.125–1493.900 s (113.8 s; speech 100.9 s) · 23:00.12–24:53.90 (measured, dry run 2026-11-05).

## s21_ian_polar
> PENDING DATA REPORT (reports/data/ch00_coordinates_research.md): product, hour, centre and every number below come from the storyboard `data_block`; swap rules in the storyboard.
Now let's take polar coordinates to a real storm. Here is Hurricane Ian on the twenty eighth of September, twenty twenty-two, at six in the evening, universal time, an hour before it came ashore on the southwest coast of Florida. The colours show the wind speed ten metres above the ground, from a weather model analysis with grid points every three kilometres. Like most weather data, it gives each wind as two numbers: its eastward part u, and its northward part v. The calm centre of the storm is called the eye. Let's put the origin in the middle of the eye, and zoom in. The eye sits just off the coast, over the warm Gulf of Mexico, with the flat, low land of southwest Florida to its east. Round the eye, the winds are the strongest in the storm. Now every point round the eye gets its polar coordinates: its distance r from the centre, and its angle theta from east.

> 162 words · 9 sentences · 0 beats · 1493.900–1556.725 s (62.8 s; speech 59.2 s) · 24:53.90–25:56.72 (measured, dry run 2026-11-05).

## s22_spin_inflow
> PENDING DATA REPORT: 37, 130, minus 12.5, 135 kt and 250 km/h are build-1 values about the HRRR pressure minimum; they are recomputed about the new centre.
Every wind on the map now has two polar parts. The radial wind, u sub r, blows in or out. The tangential wind, u sub theta, blows round the eye. Let's draw a ring twenty five kilometres from the centre, and work out both parts at seventy two points round it, one every five degrees. Then we average each part round the ring: we add up the seventy two values, and divide by seventy two. The tangential wind averages about thirty seven metres per second. [beat] To turn metres per second into kilometres per hour, we multiply by three point six, because an hour has three thousand six hundred seconds, and a kilometre has a thousand metres. So thirty seven metres per second is about a hundred and thirty kilometres per hour. [beat] The air goes round anticlockwise, as seen from above, as in every northern hemisphere hurricane. The radial wind averages about minus twelve and a half metres per second. [beat] The minus sign means that, on average, the air is flowing in, towards the eye. The real storm was even stronger. The official estimate of its strongest wind at that hour, averaged over a minute, is about a hundred and thirty five knots. One knot is one point eight five kilometres per hour, so that's about two hundred and fifty kilometres per hour. [beat] The model analysis smooths out the strongest winds.

> 230 words · 15 sentences · 4 beats · 1556.725–1657.950 s (101.2 s; speech 90.9 s) · 25:56.72–27:37.95 (measured, dry run 2026-11-05).

## s23_what_numbers_mean
> PENDING DATA REPORT: every number follows the two ring means of s22 (CHECK rows recompute them).
So what do these two numbers mean, and how are they different? Thirty seven is how fast the air goes round the eye. Twelve and a half is how fast it moves towards the eye. They're two parts of the same wind, at right angles to each other. By Pythagoras, together they make an arrow of the square root of thirty seven squared plus twelve and a half squared, about thirty nine metres per second. [beat] It points mostly round, and a little in. Twelve and a half metres per second, times three point six, is about forty five kilometres per hour, towards the centre. [beat] Now imagine, just for a moment, that nothing changed. An air parcel, a small volume of air that moves with the flow, starts on this ring, twenty five kilometres out. Moving in at twelve and a half metres per second, it would cover the twenty five thousand metres to the centre in two thousand seconds, about thirty three minutes. [beat] Going round at thirty seven metres per second, one lap of this ring, two pi times twenty five kilometres, about a hundred and fifty seven kilometres, takes about seventy one minutes. [beat] So the air is moving round and moving in at the same time. Thirty seven divided by twelve and a half is about three, so for every metre it moves in, it moves about three metres round. [beat] The air doesn't fall straight into the eye: it spirals in. In the real storm, the inflow slows down near the ring of strongest winds, and the air rises there instead, in towering clouds. We'll look at that rising air in Part 2, and the whole story of how hurricanes work has its own movie later in this series: How tropical cyclones form.

> 294 words · 16 sentences · 5 beats · 1657.950–1776.875 s (118.9 s; speech 107.1 s) · 27:37.95–29:36.88 (measured, dry run 2026-11-05).

## s24_ring_points
> PENDING DATA REPORT: the u, v values at the three points come from the new centre's ring (CHECK rows).
Where do those averages come from? Let's work out three of the seventy two points by hand. Remember, the data give us u and v, the eastward and northward parts. First, the point due east of the eye, at theta equals zero. There, u is about zero, and v is about thirty eight: the wind blows north. [beat] Our rule has cosine of zero, which is one, and sine of zero, which is zero. So u sub r is about zero, and u sub theta is about thirty eight. Here, the wind blows almost purely round. [beat] Next, the point due north of the eye, at ninety degrees. There, u is minus twenty seven point three, and v is minus twenty point four: the wind blows towards the west, and a little south. [beat] Now the cosine is zero and the sine is one. So u sub r equals v, which is minus twenty point four: in. And u sub theta equals minus u, which is plus twenty seven point three: round. [beat] Last, the point to the northwest, at a hundred and thirty five degrees. There, u is minus nine point eight, and v is minus forty eight point seven. [beat] The cosine of a hundred and thirty five degrees is minus zero point seven zero seven, and the sine is plus zero point seven zero seven. So u sub r is minus nine point eight times minus zero point seven zero seven, plus minus forty eight point seven times zero point seven zero seven. That's six point nine minus thirty four point four, about minus twenty seven and a half: in. [beat] And u sub theta is plus nine point eight times zero point seven zero seven, plus minus forty eight point seven times minus zero point seven zero seven. That's six point nine plus thirty four point four, about forty one point four: round. [beat] The computer does exactly this at all seventy two points, and then takes the averages.

> 326 words · 21 sentences · 7 beats · 1776.875–1917.275 s (140.4 s; speech 124.5 s) · 29:36.88–31:57.28 (measured, dry run 2026-11-05).

## s25_why_polar_storm
> PENDING DATA REPORT: the curve ranges (u, v swing; u_theta 25 to 50; u_r 0 to minus 35) follow the new ring.
Why bother with polar coordinates here? Let's go all the way round the ring, and plot the winds against the angle theta. First, the eastward wind u, the solid orange line, and the northward wind v, the dashed orange line. Our three points sit on these lines. Both lines swing up and down, from plus to minus, by tens of metres per second. They swing because the wind keeps turning as we go round the eye. On the east side it blows north, and on the north side it blows west, and so on, all the way round. Now let's plot the two polar parts round the same ring. The tangential wind, u sub theta, is the teal line, and the radial wind, u sub r, is the rose line. The tangential wind stays close to its average of thirty seven, between about twenty five and fifty. The radial wind wobbles more, between about zero and minus thirty five, because the storm isn't perfectly round. But it's negative, or nearly zero, all the way round. So the air flows in on every side. Instead of two lines that swing from plus to minus, we get two numbers that mean something: how fast the storm spins, and how fast the air flows in. That's why hurricane scientists use polar coordinates.

> 219 words · 15 sentences · 0 beats · 1917.275–2005.600 s (88.3 s; speech 82.6 s) · 31:57.28–33:25.60 (measured, dry run 2026-11-05).

## s26_inflow_angle
> PENDING DATA REPORT: 12.5 over 37, 0.34 and 19 degrees follow the ring means.
There's one more angle that hurricane scientists use. The wind crosses each ring at a slant, a little inward. The angle between the wind and the ring's own direction, theta hat, is called the inflow angle. Its tangent is the inward part over the round part: twelve and a half over thirty seven, which is about zero point three four. So the inflow angle is about nineteen degrees. [beat] We've now met four different angles, so let's put them side by side. Theta says where a point is, measured from east, anticlockwise as seen from above. The compass bearing says which way something points, measured from north, clockwise as seen from above. Alpha says how far we turned our axes. And the inflow angle says how far the wind leans inward from the ring. They answer four different questions, so it's always worth checking which angle you're looking at. The storm's spin also has its own measure, called vorticity, which has its own movie later in this series: Vorticity in plain words.

> 171 words · 12 sentences · 1 beats · 2005.600–2077.850 s (72.2 s; speech 66.5 s) · 33:25.60–34:37.85 (measured, dry run 2026-11-05).

## s27_recap
To sum up, coordinates are numbers that pin down a place, measured from an origin along chosen directions. Cartesian coordinates use x and y, and their unit vectors, x hat and y hat, are the same everywhere. Polar coordinates use the distance r and the angle theta, with x equals r cosine theta, and y equals r sine theta. The arc length is the radius times the angle, in radians. R hat points the way r grows. Theta hat points the way theta grows: it's r hat turned by ninety degrees, minus sine theta, cosine theta. The parts of a wind along these two arrows are dot products: the radial and the tangential wind. Turning the axes by an angle alpha gives new coordinates for the same arrow, and the four direction cosines make the rotation matrix. Polar parts are just turned axes, with an angle that changes from place to place. Round Hurricane Ian's eye, they split the wind into about thirty seven metres per second of spin and twelve and a half of inflow, so the air spirals in at about nineteen degrees. In Part 2, we'll ask whether air going round at a steady speed is accelerating, and look at a hurricane in three dimensions.

> 208 words · 11 sentences · 0 beats · 2077.850–2162.850 s (85.0 s; speech 80.7 s) · 34:37.85–36:02.85 (measured, dry run 2026-11-05).

## s28_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for coordinates, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 56 words · 3 sentences · 0 beats · 2162.850–2185.750 s (22.9 s; speech 21.9 s) · 36:02.85–36:25.75 (measured, dry run 2026-11-05).
