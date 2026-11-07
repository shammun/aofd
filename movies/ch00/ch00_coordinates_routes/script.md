# ch00_coordinates_routes — narration (movie-director, 2026-11-05)

Series plan v6 (amended 2026-11-05: seven parts) **#5f, position 12**: "Coordinates, Part 6 — Routes: great circles and rhumb lines" (title card:
"Coordinates · Part 6" / "Routes" / "great circles and rhumb lines"; the spoken s00 sentence stays short).
Split plan `movies/ch00/ch00_coordinates/split_plan.md` §2f (seven parts). House style `movies/HOUSE_STYLE.md` (binding).
Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice; our own words; maths spoken in words; `[beat]` = 1.5-s hold
after a worked calculation (not spoken, not captioned). Lines starting with ">" are notes and are not spoken; the README
below uses `###` headings so that `tools/tts.py` does not read it as a scene.

### README

**Remake 2026-11-07** (`remake_2026-11-07_log.md`; master plan R1, R3, R16, R19, §C; house rules of 2026-11-07). Title card now
"Coordinates" / "Part 6 · Routes" / "great circles" + "and rhumb lines" (series layout). **s02_part5_recap is cut** (no opening recap);
its facts are recalled where used: s04 (Part 1 arc length, Part 3 distances and the letter a), s07 (Part 1 arc length), s08 (Part 3
position vector), s11 (Part 4 local east and north; new S5); s06 S10 pays off Part 4's puck. Voiced arithmetic removed (s04, s08, s09,
s10, s12: the screen keeps every step; the voice says what is combined and the result). s13's Part 7 line cut; s14 ends with the
two-sentence Part 7 teaser. Natural openings (s00, s01 S2). 15 scenes, 131 sentences (110 re-used clips, 21 new). Provisional
length 964.1 s + 2.5-s hold = **16:06.6** (checks/rt_r7_splice.py --provisional; the final splice replaces it). The tables below
are the pre-remake record (2026-11-05) and are kept for history.

**Measured, not estimated** (`tools/tts.py` dry run; numbers block at the end of this README). This movie is the first half of
the 35-scene Part 5 v1 (commit 116f09c; Part 5 before Part 4 was split), split on 2026-11-05 at the user's request (option (b)); the second half is
`ch00_coordinates_maps` (#5g, Part 7).

**Scene list** (one line each; measured length per scene below)

| # | Scene | One line |
|---|---|---|
| 0 | s00_title | card "Coordinates · Part 6" / "Routes" / "great circles and rhumb lines"; one sentence |
| 1 | s01_hook | the shortest way London → Los Angeles; "the sixth of seven parts"; the sailors' route |
| 2 | s02_part5_recap | arc rule, φ, λ, the letter a, r̂, 111.2 km per degree north, × cos φ east; i, j, k (Part 4); storm-relative winds (Part 5) (≤ 60 s) |
| 3 | s03_curvilinear | curvilinear coordinates: curved lines, turning unit vectors, a step that is not a distance |
| 4 | s04_scale_factors | scale factor = metres per unit; r, a, a cos φ; Brest 111.2 and 73.8 km per degree |
| 5 | s05_shortest_way | goal first (fuel, time); what a great circle is |
| 6 | s06_great_circle | the slicing sheet through London, Los Angeles and the centre; why it is the shortest |
| 7 | s07_sigma | σ = the angle at the centre; the face-on slice is Part 1's arc rule, d = a σ; 1° of σ ≈ 111.2 km |
| 8 | s08_position_arrows | **maths-skip line + chip**; r̂₁, r̂₂ written out with every input |
| 9 | s09_cos_sigma | cos σ = −0.244 + 0.001 + 0.438 ≈ 0.195; σ ≈ 78.7° |
| 10 | s10_distance | σ ≈ 1.3742 rad; d ≈ 8755 km; check 78.74 × 111.2; ≈ 9.7 h |
| 11 | s11_route_shape | **"If you skipped, here's what to keep"**; leaves at 312°, tops out at 62.4° N, arrives at 214° |
| 12 | s12_rhumb | rhumb line 258.5°, 9733 km, × 1.11, +978 km; spirals to a pole |
| 13 | s13_why_rhumb | three reasons: one compass setting; Brest → Lisbon +150 m; a ruler on Mercator ("why: Part 7"); rhumb-line legs |
| 14 | s14_recap | "To sum up …"; teaser to Part 7 |
| 15 | s15_end | series end card, maths ending, word for word |

| # | Scene | Measured length |
|---|---|---|
| 0 | s00_title | 10.5 s (27 w, 1 S, 0 beats) |
| 1 | s01_hook | 23.8 s (64 w, 4 S, 0 beats) |
| 2 | s02_part5_recap | 56.3 s (136 w, 8 S, 0 beats) |
| 3 | s03_curvilinear | 54.8 s (133 w, 8 S, 0 beats) |
| 4 | s04_scale_factors | 99.6 s (234 w, 14 S, 2 beats) |
| 5 | s05_shortest_way | 51.3 s (133 w, 8 S, 0 beats) |
| 6 | s06_great_circle | 59.3 s (156 w, 10 S, 0 beats) |
| 7 | s07_sigma | 62.9 s (161 w, 11 S, 1 beats) |
| 8 | s08_position_arrows | 140.6 s (346 w, 15 S, 6 beats) |
| 9 | s09_cos_sigma | 88.2 s (209 w, 13 S, 5 beats) |
| 10 | s10_distance | 64.7 s (147 w, 7 S, 3 beats) |
| 11 | s11_route_shape | 62.2 s (149 w, 9 S, 1 beats) |
| 12 | s12_rhumb | 63.1 s (155 w, 8 S, 3 beats) |
| 13 | s13_why_rhumb | 85.3 s (220 w, 13 S, 1 beats) |
| 14 | s14_recap | 71.4 s (180 w, 8 S, 0 beats) |
| 15 | s15_end | 22.9 s (56 w, 3 S, 0 beats) |

**Chapter marks** (for the manifest; provisional, from the dry run):
- 0:00 Routes: the question (s00_title)
- 0:34 What we use from Parts 1, 3, 4 and 5 (s02_part5_recap)
- 1:30 Curvilinear coordinates and scale factors (s03_curvilinear)
- 4:05 The shortest way: great circles (s05_shortest_way)
- 5:55 The angle sigma and d = a sigma (s07_sigma)
- 6:58 Every step: working out sigma (optional maths) (s08_position_arrows)
- 11:52 Where the route goes (s11_route_shape)
- 12:54 The rhumb line (s12_rhumb)
- 13:57 Why sailors liked the rhumb line (s13_why_rhumb)
- 15:23 To sum up (s14_recap)

**Maths-skip blocks** (series-wide rule, user 2026-11-05; the chip's mm:ss is refilled after the final TTS):
- chip in s08_position_arrows (block s08_position_arrows–s10_distance) → skip to 11:52 (provisional: dry run; refill after the final TTS), start of s11_route_shape (takeaway line)

**Length:** 16:59.88 measured (1019.875 s = 1017.375 s of narration + the 2.5-s silent end-card hold); **2506 words**,
140 sentences, 22 beats. **Estimate at 142 words per minute:** 2506 / 142 = **17.6 min**.

**User feedback covered (U-CO items assigned to #5f after the split).**
- [x] U-CO-065 "Los Angeles" fully inside the frame: s01, s06, s11 (label right of and below its dot, ≥ 40 px inside; Must 7).
- [x] U-CO-066 the calculation's picture: s06 (translucent slicing sheet, the centre shown), s07 (the slice turned face-on), s09–s10 (σ and d
  on the disc, numbers in the column with gold links).
- [x] U-CO-067 why make this calculation: s05 (goal first: fuel and time), s10 (≈ 9.7 h).
- [x] U-CO-068 what σ is and why d = a σ: s07 (the angle at the centre; the arc rule; 1° of σ ≈ 111.2 km), s08 (both r̂ with every input),
  s09 (cos σ = r̂₁ · r̂₂, each product), s10 (radians, the result, a second check).
- [x] U-CO-073 why some prefer the rhumb line: s12 (what it is), s13 (three reasons; the straight-on-Mercator reason is completed in Part 7 s12).
- [x] U-CO-054 every calculation: goal → factors named → inputs row → CalcStack → meaning.
- [x] U-CO-057 nothing used unexplained: great circle, σ, rhumb line, scale factor, curvilinear defined at first use.
- [x] U-CO-099 later-movie pointers: none needed here (the gradient pointer moved to Part 7 so that only Part 7 names *The gradient*).
- [x] U-CO-101 smooth flow: "the sixth of seven parts" (s01), the Parts 1–5 recap ending on Part 5's moving frames (s02), the Part 7 teaser (s14).
- [x] Maths-skip guidance (user, 2026-11-05): chip + friendly line at s08, takeaway at s11.

**Review 1 and fix-loop-1 guards kept:** Must 7 (Los Angeles inside the frame), Must 8 (CalcStack x ≥ 1100), Should 8 (s03 no empty bottom
half), Should 14 (end card gap), Should 18 (an opening keyword or picture from frame 0); fix-loop rules 4–9.

**Cross-part numbers and symbols this part relies on** (storyboard `cross_part`): Part 1 polar (r, θ), the arc rule s = r θ, r̂, θ̂, components
as dot products, compass bearing from north clockwise as seen from above; Part 2 cylindrical coordinates (named only, s03); Part 3 φ, λ,
**a = 6371 km (6400)**, r̂ = (cos φ cos λ, cos φ sin λ, sin φ), **Brest 48.39° N 4.49° W**, cos φ = 0.664, **111.2 km per degree north, 73.8 km
per degree east at Brest**, **Longyearbyen 78.22° N**; Part 4 i, j, k (recap); Part 5 storm-relative winds (recap); the dot product movie (a · b = |a||b| cos angle). Own places:
**London 51.51° N 0.13° W, Los Angeles 34.05° N 118.24° W** (city centres); Lisbon 38.72° N 9.14° W.

**Spoken-symbol rules.** No lone "a" (the voice says "the Earth's radius"; once "the letter a" in s02). "sigma", "phi", "lambda", "cosine phi",
"r hat one", "r hat two". Every clockwise/anticlockwise with "as seen from above".

**Proposed lexicon entries** (not added): `the letter a` → `the letter [A](/ˈA/)`, rhumb ("rum"), Longyearbyen, Greenwich, Lisbon, Mercator.

**Measured** (`tools/tts.py` dry run 2026-11-05 into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_routes/dryrun2_spliced`, Kokoro af_bella × 1.0, current `movies/lexicon.yaml`):
**140 sentences, 2506 words, 22 beats; narration 1017.375 s + 2.5-s hold = 1019.875 s (16:59.88)**; speech alone 937.0 s =
160.5 words per minute while speaking, **147.8 words per minute overall** (limit 150); 255 caption cues; warnings: none.

**How it was measured:** the full script in one `tools/tts.py` run; then the opening recap (s02) was shortened to stay under 60 s, re-measured alone with `tools/tts.py`, and spliced in (every later scene shifted by the measured difference; `timing.json → splice`). The final TTS re-runs the whole script.

## s00_title
> remake 2026-11-07: changed (see remake_2026-11-07_log.md).
In this video, we'll learn about routes across our round Earth and the coordinates behind them, and see how they're used to plan the shortest flights.

## s01_hook
> remake 2026-11-07: changed (see remake_2026-11-07_log.md).
What's the shortest way from London to Los Angeles, and why doesn't a plane fly the way a flat map seems to point? This is the sixth of seven parts on coordinates. Now let's dive into the pieces we need: scale factors, which turn a change in latitude or longitude into kilometres, and the great circle, the shortest route over our round Earth. Then let's meet the route that sailors used for centuries, and see why they liked it.

## s03_curvilinear
Let's start by putting our coordinate systems side by side: polar coordinates on a flat map, cylindrical coordinates round a hurricane, and latitude and longitude on the Earth. They're all called curvilinear coordinates, which means coordinates whose lines can curve. They share three features. First, the coordinate lines are curves: the rings round a radar, the circles of latitude, and the meridians. Second, the unit vectors change from place to place: r hat and theta hat turn as we go round, and so do the east and north arrows on the globe. Third, a change in a coordinate isn't a distance by itself. Turning by one degree can mean a short walk or a long one, depending on where you are. That third feature needs a name, so let's look at it closely.

> 133 words · 8 sentences · 0 beats · 90.925–145.675 s (54.8 s; speech 51.5 s) · 1:30.92–2:25.68 (measured, dry run 2026-11-05).

## s04_scale_factors
> remake 2026-11-07: changed (see remake_2026-11-07_log.md).
How far do we walk when one coordinate changes by a small step? In Part 1, we found the arc rule: on a ring of radius r, turning by a small angle delta theta walks r times delta theta. So for theta, the distance walked is r times the step. That multiplier, the metres walked per unit of the coordinate, is called a scale factor. For theta, the scale factor is r. On the Earth, as we found in Part 3, stepping north by a small change in latitude, delta phi, walks the Earth's radius times delta phi. So the scale factor of latitude is the Earth's radius, which we write as the letter a, about six thousand three hundred and seventy one kilometres. Stepping east by a small change in longitude, delta lambda, walks round a parallel, a circle whose radius is the Earth's radius times cosine phi. So the scale factor of longitude is the Earth's radius times cosine phi. Let's put numbers on it at Brest, at forty eight point four degrees north. One degree is zero point zero one seven four five radians. So one degree north walks the Earth's radius times that, about a hundred and eleven point two kilometres. [beat] The cosine of forty eight point four degrees is zero point six six four. So one degree east walks those hundred and eleven point two kilometres times the cosine, only about seventy three point eight kilometres. [beat] The same one-degree step gives two different distances, and the scale factors keep track of that.

## s05_shortest_way
Now let's put coordinates to work on a question every airline asks: what's the shortest way between two places? It matters, because a shorter route burns less fuel and takes less time. On a flat sheet of paper, the shortest way is a straight line. But a plane can't tunnel through the Earth, so it has to follow the curved surface. On a sphere, the shortest way follows a great circle. A great circle is any circle on the sphere whose centre is the centre of the Earth. The equator is one, and so is every meridian, together with its partner on the other side of the globe. The other circles of latitude are not great circles: their centres sit on the Earth's axis, above or below the Earth's centre, so they're smaller.

> 133 words · 8 sentences · 0 beats · 245.325–296.600 s (51.3 s; speech 48.0 s) · 4:05.32–4:56.60 (measured, dry run 2026-11-05).

## s06_great_circle
> remake 2026-11-07: changed (see remake_2026-11-07_log.md).
Let's find the great circle through London and Los Angeles. London is at fifty one and a half degrees north, almost on the prime meridian. Los Angeles is at thirty four degrees north, and a hundred and eighteen degrees west. Picture a flat sheet slicing through the globe, so that it passes through London, through Los Angeles, and through the Earth's centre. Three points that aren't in a line fix exactly one flat sheet, just as three legs steady a stool. Where the sheet cuts the Earth's surface, it traces a great circle, and the part between the two cities is the great circle route. Why is it the shortest? Think of all the circles on the globe that pass through both cities. The great circle is the biggest of them, so between the two cities it bends the least. A string pulled tight between the two cities on a desk globe lies right along it. And the puck from Part 4, gliding over a smooth Earth with nothing pushing it, was moving along exactly such a great circle.

## s07_sigma
How long is this route? Let's turn the globe, so that we look straight at the slicing sheet. Now it's just a flat circle, with the Earth's centre in the middle, and its radius is the Earth's radius. Draw one arrow from the centre to London, and another one to Los Angeles. The angle between these two arrows, at the Earth's centre, is called sigma. The route is the arc of the circle between the two arrow tips. And that's exactly the picture of the arc rule from Part 1: the distance along a circle is the radius times the angle. So the distance d equals the Earth's radius times sigma, with sigma in radians. [beat] Here's a way to feel it. Every degree of sigma is one degree of a great circle, about a hundred and eleven point two kilometres on the ground, just like a degree of latitude along a meridian. So once we know sigma, we know the distance.

> 161 words · 11 sentences · 1 beats · 355.950–418.875 s (62.9 s; speech 57.5 s) · 5:55.95–6:58.88 (measured, dry run 2026-11-05).

## s08_position_arrows
> remake 2026-11-07: changed (see remake_2026-11-07_log.md).
The next few minutes work out sigma step by step, with every number. They're here for anyone who enjoys seeing every step, but you don't need them for the intuition behind weather, climate science or GIS. If it feels like a lot, skip ahead to the time on screen, and you won't miss the big idea. To find sigma, we need the two position arrows of length one, r hat one for London and r hat two for Los Angeles. From Part 3, each one is cosine phi cosine lambda, cosine phi sine lambda, sine phi. London is at fifty one point five one degrees north, and zero point one three degrees west, so its lambda is minus zero point one three degrees. The cosine of fifty one point five one degrees is zero point six two two, and the cosine of minus zero point one three degrees is almost exactly one. So the first part is zero point six two two. [beat] The sine of minus zero point one three degrees is minus zero point zero zero two three, so the second part, cosine phi times sine lambda, is about minus zero point zero zero one. [beat] The third part is the sine of fifty one point five one degrees, zero point seven eight three. [beat] Los Angeles is at thirty four point zero five degrees north, and a hundred and eighteen point two four degrees west, so its lambda is minus a hundred and eighteen point two four degrees. Its cosine phi is zero point eight two nine, its cosine lambda is minus zero point four seven three, and its sine lambda is minus zero point eight eight one. So its first part, cosine phi times cosine lambda, is about minus zero point three nine two. [beat] Its second part, cosine phi times sine lambda, is about minus zero point seven three zero. [beat] And its third part, the sine of thirty four point zero five degrees, is zero point five six zero. [beat]

## s09_cos_sigma
> remake 2026-11-07: changed (see remake_2026-11-07_log.md).
Now let's use the rule from the dot product movie. The dot product of two arrows is the product of their lengths, times the cosine of the angle between them. Our two arrows both have length one, so their dot product is just the cosine of sigma. That's the shadow picture again: the shadow of one arrow of length one on the other. To take the dot product, we multiply London's first part by Los Angeles' first part, then the second parts, and then the third parts, and add the three products. That gives about zero point one nine five, so the cosine of sigma is zero point one nine five. [beat] Which angle has a cosine of zero point one nine five? A calculator's inverse cosine says about seventy eight point seven degrees. [beat] A cosine just below zero point two means an angle a little less than ninety degrees, so London and Los Angeles are almost a quarter of the way round the Earth from each other.

## s10_distance
> remake 2026-11-07: changed (see remake_2026-11-07_log.md).
The arc rule needs sigma in radians. One degree is pi over a hundred and eighty radians, about zero point zero one seven four five. So sigma, seventy eight point seven three eight degrees to be exact, is about one point three seven four two radians. [beat] Now the distance is the Earth's radius, six thousand three hundred and seventy one kilometres, times sigma in radians. That's about eight thousand seven hundred and fifty five kilometres. [beat] Let's check it the quick way: every degree of sigma is about a hundred and eleven point two kilometres, so seventy eight point seven four degrees make about eight thousand seven hundred and fifty six kilometres, the same to within the rounding. [beat] At a cruising speed of about nine hundred kilometres per hour, that's nearly ten hours in the air, before any help or hindrance from the winds.

## s11_route_shape
> remake 2026-11-07: changed (see remake_2026-11-07_log.md).
If you skipped, here's what to keep. Seen from the Earth's centre, London and Los Angeles are about seventy nine degrees apart, so the great circle route between them is about eight thousand seven hundred and fifty five kilometres long. Where does this route go? On most flat maps, Los Angeles looks to the west-south-west of London. But the great circle leaves London heading north-west, at a compass bearing of about three hundred and twelve degrees. That heading comes from London's own east and north arrows, from Part 4: we measure how much of Los Angeles' position arrow points along each one, and turn that into a compass bearing. It climbs to its highest latitude, about sixty two point four degrees north, near the south-west coast of Greenland. Then it turns south over northern Canada, and arrives at Los Angeles heading south-west, at a bearing of about two hundred and fourteen degrees. [beat] So along the way, the compass heading changes by almost a hundred degrees. That's why flights from Europe to California pass over Greenland and Canada.

## s12_rhumb
> remake 2026-11-07: changed (see remake_2026-11-07_log.md).
Sailors used a different route for centuries. It's called the rhumb line: a route that keeps the same compass bearing all the way, so it crosses every meridian at the same angle. From London to Los Angeles, the rhumb line holds a bearing of about two hundred and fifty eight and a half degrees, a little south of due west. It stays further south than the great circle, and it's about nine thousand seven hundred and thirty three kilometres long. [beat] How much longer is that? Dividing the rhumb line's length by the great circle's gives about one point one one, so the rhumb line is about eleven percent longer. [beat] The extra is about nine hundred and seventy eight kilometres, more than an hour of flying at nine hundred kilometres per hour. [beat] And if you kept following a rhumb line, it would spiral round and round towards a pole.

## s13_why_rhumb
> remake 2026-11-07: changed (see remake_2026-11-07_log.md).
So why would anyone choose the longer route? There are three reasons. The first is steering. A rhumb line needs one compass setting for the whole trip: set two hundred and fifty eight and a half degrees, and hold it. The great circle needs a new heading all the time, from three hundred and twelve degrees at London to two hundred and fourteen at Los Angeles. Before satellites and computers, a ship's navigator with a compass could steer a rhumb line easily, but a great circle only with a lot of calculation. The second reason is that, on short trips, the extra distance is tiny. From Brest to Lisbon, about one thousand one hundred and thirty eight kilometres, the rhumb line is only about a hundred and fifty metres longer. [beat] The third reason is a map. On the most famous flat map, the Mercator map, a rhumb line is a straight line. So a navigator could draw the route with a ruler, read off its angle, and steer by it. That's why long voyages were often split into a few rhumb-line legs that follow the great circle closely: each leg is easy to steer, and the whole route is nearly the shortest.

## s14_recap
> remake 2026-11-07: changed (see remake_2026-11-07_log.md).
To sum up, curvilinear coordinates have curved lines, unit vectors that turn, and scale factors that turn a change of coordinate into a distance. On the Earth, the scale factor of latitude is the Earth's radius, and of longitude, the radius times cosine phi. The shortest way between two places follows a great circle, whose centre is the Earth's centre. Its length is the Earth's radius times sigma, the angle at the centre, and the cosine of sigma is the dot product of the two position arrows. From London to Los Angeles, that's about seventy eight point seven degrees, or about eight thousand seven hundred and fifty five kilometres. Along the great circle, the compass heading changes all the way, from three hundred and twelve degrees to two hundred and fourteen. A rhumb line keeps one compass bearing, so it's easy to steer, but here it's about eleven percent longer. In Part 7, we'll flatten the Earth onto maps, and work out exactly what each map stretches. That explains why the rhumb line comes out straight on the most famous map of all, and why weather data on a grid need care near the poles.

## s15_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for coordinates, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 56 words · 3 sentences · 0 beats · 994.475–1017.375 s (22.9 s; speech 21.9 s) · 16:34.48–16:57.38 (measured, dry run 2026-11-05).
