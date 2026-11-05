# ch00_coordinates_moving — narration (movie-director, 2026-11-05)

Series plan v6 **#5e, position 11**: "Coordinates, Part 5 — Moving frames: storm-relative winds" (coordinates series: seven parts).
Split plan `movies/ch00/ch00_coordinates/split_plan.md` §2e, split at the old s27/s28 seam (coordinator, 2026-11-05). House style `movies/HOUSE_STYLE.md` (binding).
Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice; our own words; maths spoken in words; `[beat]` = 1.5-s hold
after a worked calculation (not spoken, not captioned). Lines starting with ">" are notes and are not spoken; the README
below uses `###` headings so that `tools/tts.py` does not read it as a scene.

### README

**Title card:** Coordinates · Part 5 / Moving frames / storm-relative winds.

**Scene list** (measured; w = words)

| # | Scene | One line | Length |
|---|---|---|---|
| 0 | s00_title | opening title (HOUSE_STYLE §3) | 12.9 s (31 w) |
| 1 | s01_hook | hook question | 24.6 s (64 w) |
| 2 | s02_part4_recap | recap of Part 4 (<= 60 s) and of the traveller's rate from the derivatives movie | 49.8 s (137 w) |
| 3 | s03_train | building block: a frame that moves (the train); x = x' + U t derived | 66.6 s (167 w) |
| 4 | s04_velocities_add | derivation: u = u' + U from the positions; Galilean transformation named | 79.3 s (178 w) |
| 5 | s05_accel_same | derivation D41: du/dt = dU/dt + du'/dt; dU/dt = 0; the falling ball | 106.6 s (265 w) |
| 6 | s06_parcel_accel | derivation D42 (1)-(3): the air parcel's acceleration = local change + advection; the frame equation explained | 88.8 s (214 w) |
| 7 | s07_sliding_pattern | derivation D42 (4)-(6): a sliding pattern: each piece differs, the sum agrees (-4.0 + 5.4 = 1.4 = 0 + 1.4) | 135.3 s (323 w) |
| 8 | s08_ciaran | application: Storm Ciaran, tracked by continuity; U = 14.6 m/s towards 71° | 64.2 s (146 w) |
| 9 | s09_lopsided | application: ground-relative round winds, south ≈ 18, north ≈ 7 (why lopsided) | 47.6 s (118 w) |
| 10 | s10_storm_relative | derivation D43: v' = v − U; arrow subtraction at two points with numbers | 80.0 s (193 w) |
| 11 | s11_round_parts | D43 (4): the round parts per side, ground vs rider (18 -> 5, 7 -> 20); pointer U13 | 59.1 s (144 w) |
| 12 | s12_invariant | intuition: ring averages unchanged (14.1 vs 13.8; −6.0 vs −5.9); the uniform-wind picture; Brest gust 84 kt (build-1 s44, kept) | 72.5 s (174 w) |
| 13 | s13_tau | building block D44 (1): two observers; tau defined; what ∂p/∂τ means | 97.1 s (233 w) |
| 14 | s14_tau_derive | derivation D44 (2)-(4): the traveller's chain rule -> ∂p/∂t = ∂p/∂τ − U·∇p; every term read | 106.8 s (242 w) |
| 15 | s15_plymouth | application D44 (5): Plymouth numbers: −3.8, slope 0.061 hPa/km, U·∇p = 3.2, ∂p/∂τ = −0.6 | 81.9 s (189 w) |
| 16 | s16_meaning | meaning: −3.8 = −0.6 − 3.2 (Balance bars, Must 14 redesign); the centre check; pointers | 51.6 s (116 w) |
| 17 | s17_recap | recap ('To sum up'); last sentence the teaser to Part 6, Routes | 70.6 s (161 w) |
| 18 | s18_end | series end card (maths ending, HOUSE_STYLE §3, word for word; decision: maths end card) | 22.9 s (56 w) |

**Length:** 21:58.57 narration + 2.5-s silent end-card hold = **22:01.07** measured (3151 words; at 142 wpm the planning estimate would be 22.2 min).

**Sections:**

- Opening (s00-s02): 1:27.33, 232 words
- Frames that move (Galilean) (s03-s07): 7:56.52, 1147 words
- Ciarán: storm-relative winds (s08-s12): 5:23.48, 775 words
- The fixed barometer and τ (s13-s16): 5:37.45, 780 words
- Recap + end (s17-s18): 1:33.50, 217 words

**Skip guidance (chapter marks):**

- A speeds add, accelerations stay (D40-D41): chip at 2:43 (s04_velocities_add S3), skip to 5:28 (s05_accel_same S15): "If you skipped, here's what to keep: in a frame moving steadily in a straight line, speeds change by the frame's own speed, but accelerations, and so forces, stay the same."
- B linking the barometer and the rider (D44): chip at 16:29 (s14_tau_derive S3), skip to 18:02 (s14_tau_derive S17): "If you skipped, here's what to keep: what the barometer sees is the storm changing, minus the pattern sliding past."

**User feedback covered:**
- [x] U-CO-093 du/dt = dU/dt + du′/dt: how is it true?: s03-s05 (x = x′ + U t, u = u′ + U, D41 five steps, worked +0.5 m/s).
- [x] U-CO-094 explain the equation shown (the frame form of the parcel acceleration): s06 (local + advection from #4, both sides braced), s07 (−4.0 + 5.4 = 0 + 1.4).
- [x] U-CO-095 explain storm-relative winds clearly: s08-s12 (definition, v′ = v − U, arrow subtraction at two points, round parts per side, ring means).
- [x] U-CO-096 explain each term step by step (∂p/∂t = ∂p/∂τ − U·∇p): s13-s16 (two observers, D44, units, Plymouth numbers, centre check).
- [x] U-CO-097 what is τ and ∂p/∂τ?: s13 (τ = the rider's clock; x′ held fixed), s14 (from the traveller's chain rule).
- [x] U-CO-098 'hPa per hour' touches the bars; no text on visuals: s16 (bars own the picture zone, labels beside bars, unit on the axis); rule applied to every scene's layout.
- [x] U-CO-054 every equation and calculation clarified: all scenes: goal -> factors named -> CalcStack with inputs -> meaning.
- [x] U-CO-057 nothing used before it is explained: anemometer defined (s07), storm-relative defined (s10), τ defined (s13), D/Dt recalled (s02).
- [x] U-CO-099 later-movie concepts <= 1 min, named (voice + keyword): T04 The material derivative (s07), U13 Severe storms (s11), M25 Reading maps over time (s16).
- [x] U-CO-101 smooth flow across the split: s01 'fifth of seven', s02 Part 4 recap (<= 60 s), s17 teaser to Part 6 (Routes).

**Review 1 and fix-loop-1 guards:** Must 12 (s03: 'u′ = 1.5' and calcs in the column x >= 1100); Must 13 (s09-s11: north above south, SideCallouts, links never cross); Must 14 (s16: bars get the whole picture zone; two scenes s15-s16); Must 15 (s08-s16: colour bar beside + dated source line); Should 2 (KaTeX hats only); Should 14 (s18: 24-px gap); Should 18 (an opening keyword from frame 0 in every scene). Fix-loop rules: GeoMap body in an overflow-hidden div; SourceBelow, never a bare SourceLine; R3F: no lower-case SVG tags in a three tree; halves: picture from frame 0; keyword swaps >= 8 frames apart; cameras <= 90 deg/s eased; one colour bar per picture, beside it; the builder checks raw TeX, edge clipping, label-on-KaTeX, link crossings, text over a limb, axis through a word on its own stills; render assets staged into movies/public before any bundle; one Remotion/Chrome job at a time; TEMP/TMP on G:.

**Cross-part numbers and symbols this movie relies on:**

- *from_part4*: local frame i-hat, j-hat, k-hat; wind arrow bold v = u i + v j + w k; components along unit arrows are dot products (coast frame); arrows turn as the parcel moves; metric terms (named only in the recap)
- *from_part1*: compass bearing from north; east part = speed x sin(bearing), north part = speed x cos(bearing); ring components: round (u_theta) and in/out (u_r); ring averages (Ian, Part 1)
- *from_earlier_movies*: limits; the traveller's chain rule dT/dt = dT/dt|place + speed x slope; DT/Dt = dT/dt + v.grad T; centred differences (#4); advection (0.1b); subtracting an arrow = adding its reverse (vectors movie); Coriolis and centrifugal in a turning frame (#3)
- *shared_numbers_used*: Ciaran_U_ms = 14.58; Ciaran_U_towards_deg = 71.0; Ciaran_U_en_ms = [13.78, 4.75]; ring_km = 200; Plymouth = [50.25, -4.25]; Brest_gust_kt = 84
- *handed_to_part6*: teaser: In Part 6, we'll find the shortest way round the Earth: great circles, and rhumb lines.

**Seams.** Opens with the Part 4 recap (s02); the recap ends with "In Part 6, we'll find the shortest way round the Earth: great circles, and rhumb lines." The end card is the maths ending, word for word.

**Spoken-symbol rules.** No lone "a" in the voice ("the Earth's radius", "the radius"); "i hat", "capital R hat", "x hat prime";
"capital D i hat by D t"; "partial p by partial tau"; "bold capital U dot grad p"; "cosine phi", "tangent phi"; clockwise only with "as seen from above".

**Proposed lexicon entries** (not added; check by ear): Galilei ("Gal-i-lay"), Cornwall (check), tau ("tow"). Ciarán is already in the lexicon.

**Measured**: 19 scenes, 193 sentences, 3151 words, 39 beats; narration 1318.575 s + 2.5-s hold = 1321.075 s (22:01.07); speech alone 1198.3 s = 157.8 wpm while speaking, **143.4 wpm overall** (limit 150). Clip lengths from three `tools/tts.py` runs on G: (`G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_coordinates_frames\dryrun1`, `splice2`, `splice3`; each scene's source is in the storyboard), times recomputed with the tts.py gap rules (the method reproduces the full run exactly); no warnings in any run. The caption cue count comes with the final TTS.

## s00_title
In this video, we'll learn moving frames the easy way, and see how meteorology uses them to understand a moving storm's winds, and what a barometer sees as the storm passes.

> 31 words · 1 sentences · 0 beats · 0.300–13.250 s (12.9 s; speech 12.2 s) · 0:00.30–0:13.25 (measured, splice3).

## s01_hook
Imagine riding along with a storm as it crosses the English Channel. Would its winds look the same to you as they do to someone standing on the shore? This is the fifth of seven parts on coordinates. Let's see what changes, and what doesn't, when the frame itself moves. Then let's use it on a real storm, and on a barometer it passed.

> 64 words · 5 sentences · 0 beats · 13.250–37.825 s (24.6 s; speech 22.4 s) · 0:13.25–0:37.83 (measured, splice3).

## s02_part4_recap
In Part 4, we stood at a weather station and used its own three arrows: i hat east, j hat north and k hat up. The wind arrow is bold v, which is u i hat, plus v j hat, plus w k hat. We turned those arrows to fit a coast, and the parts of the wind along the new arrows were dot products. Then we saw that the arrows turn by themselves as air moves over the round Earth. From the derivatives movie, we also have the rate a traveller feels: the change at a fixed place, plus the traveller's speed times the slope. When the traveller is an air parcel, a small volume of air moving with the wind, we write that rate as capital D by D t. Today, the frame itself moves.

> 137 words · 7 sentences · 0 beats · 37.825–87.625 s (49.8 s; speech 46.9 s) · 0:37.83–1:27.62 (measured, splice3).

## s03_train
Let's start with the simplest moving frame. Imagine you're on a train gliding along a straight track at a steady twenty metres per second. You walk towards the front at one and a half metres per second. Someone standing beside the track sees you moving at twenty plus one and a half: twenty one and a half metres per second. [beat] Why do the speeds add? Let's measure positions along the track. The person beside the track uses x, measured from the station. You use x prime, measured from the back of the train. The back of the train passed the station at time zero, and it moves at capital U, twenty metres per second. So after a time t, the back of the train is capital U times t from the station. [beat] Your distance from the station is that, plus your distance from the back of the train: x equals x prime plus capital U t. And both clocks show the same time: t prime equals t.

> 167 words · 12 sentences · 2 beats · 87.625–154.175 s (66.6 s; speech 59.6 s) · 1:27.62–2:34.18 (measured, splice3).

## s04_velocities_add
Next come two short derivations: why speeds add, and why accelerations don't change. They're for those who like every step. If not, skip ahead to the time on screen. Now let's get the speeds from the positions. In a short time, delta t, your place on the train changes by delta x prime, and the back of the train moves on by capital U delta t. So, step one: delta x equals delta x prime, plus capital U delta t. [beat] Step two: divide by delta t. Delta x over delta t is the speed seen from the ground, small u. Delta x prime over delta t is the speed seen on the train, u prime. So u equals u prime plus capital U. [beat] With our numbers, one and a half plus twenty is twenty one and a half. [beat] Switching between two frames like this, moving at a steady velocity without turning, is called a Galilean transformation, after Galileo Galilei. In three dimensions, the same holds for each part: bold v equals bold capital U plus bold v prime.

> 178 words · 13 sentences · 3 beats · 154.175–233.450 s (79.3 s; speech 70.8 s) · 2:34.18–3:53.45 (measured, splice2).

## s05_accel_same
Here's the beautiful part. What happens to accelerations? Let's follow the same steps, one move at a time. Step one: at every moment, u equals capital U plus u prime. Step two: a short time later, each of them has changed a little, and the sum still holds. So delta u equals delta capital U plus delta u prime: the change of a sum is the sum of the changes. [beat] Step three: divide by delta t. Step four: let delta t shrink, as in the derivatives movie. That gives d u by d t equals d capital U by d t, plus d u prime by d t. [beat] Step five: the train's speed never changes, so d capital U by d t is zero. So d u by d t equals d u prime by d t: the acceleration is the same in both frames. [beat] For example, if you speed up from one and a half to two metres per second in one second, the person beside the track sees you go from twenty one and a half to twenty two, in the same second. [beat] Drop a ball on a smooth train, and it speeds up downwards by nine point eight metres per second every second, for you, and for the person beside the track. And since Newton's law says force equals mass times acceleration, the same forces explain the motion in both frames. If you skipped, here's what to keep: in a frame moving steadily in a straight line, speeds change by the frame's own speed, but accelerations, and so forces, stay the same.

> 265 words · 15 sentences · 4 beats · 233.450–340.075 s (106.6 s; speech 96.3 s) · 3:53.45–5:40.07 (measured, splice2).

## s06_parcel_accel
In a fluid, we follow an air parcel: a small volume of air that moves with the wind. In the derivatives movie, we found the rate that an air parcel's own thermometer reads. Capital D T by D t equals partial capital T by partial small t, plus bold v dot grad T. The first part is the change at one fixed place. The second is advection: the change from being carried to places where the temperature is different. The eastward wind, u, is just another number the parcel carries along, so we can put u in place of T. Capital D u by D t equals partial u by partial t, plus bold v dot grad u. The same goes for v and for w. [beat] So the air parcel's acceleration is a local change at a fixed place, plus advection. Now here's the train's lesson, written for a fluid. On the left is the parcel's acceleration, worked out by someone on the ground. On the right is the same parcel's acceleration, worked out by someone riding in a frame that moves at capital U, with primes on everything. They're equal, because the acceleration is the same in both frames. But each piece on its own can be different. Let's see that with numbers.

> 214 words · 15 sentences · 1 beats · 340.075–428.875 s (88.8 s; speech 82.0 s) · 5:40.07–7:08.88 (measured, dryrun1).

## s07_sliding_pattern
Picture a pattern of stronger and weaker winds, two hundred kilometres from one gust to the next, all blowing east. The whole pattern slides east at a steady ten metres per second, without changing its shape. Take one moment, at a place where the wind is thirteen and a half metres per second, and is getting stronger towards the east by zero point one one one metres per second for every kilometre. [beat] First, ride with the pattern, at capital U, ten metres per second. To you, the pattern is frozen, so the local change is zero. Relative to you, the air at that place moves east at thirteen and a half minus ten: three and a half metres per second, or twelve point seven kilometres per hour. It's carried into stronger wind, so the advection is twelve point seven kilometres per hour, times zero point one one one metres per second per kilometre. That's plus one point four metres per second, every hour. [beat] Now stand on the ground, beside an anemometer, a wind meter that never moves. The pattern slides past at thirty six kilometres per hour, bringing the weaker wind from the west. So the anemometer sees a local change of minus thirty six times zero point one one one: minus four point zero metres per second, every hour. [beat] The advection, with the full wind of forty eight point seven kilometres per hour, is plus five point four. [beat] Add them: minus four point zero, plus five point four, is plus one point four, the same as for the rider. [beat] So each piece depends on who measures it, but their sum, the air parcel's acceleration, doesn't. That only works for a frame moving steadily in a straight line. A frame that turns, like the spinning Earth, adds the Coriolis and centrifugal effects, as we saw in the cross product movies. We'll build all of this fully in a later movie: The material derivative.

> 323 words · 17 sentences · 5 beats · 428.875–564.150 s (135.3 s; speech 123.1 s) · 7:08.88–9:24.15 (measured, dryrun1).

## s08_ciaran
Now a real moving storm. Storm Ciarán crossed the English Channel in the night from the first to the second of November, twenty twenty three. To follow it, we find its lowest pressure, then look for the lowest pressure close by an hour later, and so on, hour by hour. At midnight, universal time, its centre was just off the tip of Cornwall, at nine hundred and fifty four and a half hectopascals. [beat] Between midnight and six in the morning, the centre moved towards a bearing of seventy one degrees, east-north-east, at about fourteen point six metres per second, roughly fifteen. [beat] With Part 1's bearing rule, its east part is fourteen point six times sine seventy one degrees, about thirteen point eight. Its north part is fourteen point six times cosine seventy one degrees, about four point eight. [beat] We'll call this storm velocity bold capital U.

> 146 words · 8 sentences · 3 beats · 564.150–628.400 s (64.2 s; speech 57.5 s) · 9:24.15–10:28.40 (measured, dryrun1).

## s09_lopsided
Let's look at the winds on a ring two hundred kilometres from the centre, at three in the morning. As in Part 1, we split each wind into its part round the ring and its part in or out. Seen from the ground, the round part averaged about eighteen metres per second on the storm's southern side, but only about seven on its northern side. [beat] Why so lopsided? The storm spins anticlockwise as seen from above, as northern storms do. On its southern side, the spin blows towards the east, the same way the storm moves, so the two add up. On its northern side, the spin blows towards the west, against the motion, so they partly cancel.

> 118 words · 7 sentences · 1 beats · 628.400–675.950 s (47.6 s; speech 43.5 s) · 10:28.40–11:15.95 (measured, dryrun1).

## s10_storm_relative
Now let's ask what the wind looks like to someone riding along with the storm's centre, at bold capital U. That's called the storm-relative wind. From the Galilean rule, the ground wind is bold capital U plus the rider's wind, bold v prime. So the rider's wind is the ground wind minus bold capital U. [beat] Taking an arrow away is the same as adding that arrow turned to point the opposite way. Take a point in the middle of the southern side. There, the ground wind is thirteen point five east and eight point four north. Take away thirteen point eight east and four point eight north, and the rider feels minus zero point three east and three point seven north: a gentle three point seven metres per second. [beat] Now a point in the middle of the northern side. The ground wind is minus four point two east and minus five point three north. Take away the same storm velocity, and the rider feels minus eighteen point zero east and minus ten point one north: about twenty point six metres per second. [beat] So for the rider, the northern side is the windy one.

> 193 words · 12 sentences · 3 beats · 675.950–755.975 s (80.0 s; speech 71.9 s) · 11:15.95–12:35.98 (measured, dryrun1).

## s11_round_parts
Let's do the same with the round parts, averaged over each side. On the southern side, the storm's motion runs the same way as the spin, so it adds about thirteen metres per second to the round part. Riding with the storm, the round part there drops from eighteen to about five. [beat] On the northern side, the motion runs against the spin, so it takes away about thirteen. Riding with the storm, the round part there grows from seven to about twenty. [beat] So the motion explains why people on the ground felt the southern side as the stronger one. The rider sees the storm's own shape, and at that hour, on this ring, its own winds were stronger on its northern side. Forecasters use storm-relative winds to see a storm's own structure, and they matter for thunderstorms too, in a later movie: Severe storms.

> 144 words · 8 sentences · 2 beats · 755.975–815.125 s (59.1 s; speech 53.6 s) · 12:35.98–13:35.12 (measured, dryrun1).

## s12_invariant
So what changes, and what doesn't? The wind at each point changes by the storm's velocity. But the average round part over the whole ring is about fourteen metres per second in both frames: fourteen point one from the ground, and thirteen point eight riding along. [beat] And the average inflow is about six metres per second in both frames. [beat] That's no accident. A steady, uniform wind blows as much round one side of a circle as it blows back round the other, so it adds nothing to the average spin, or to the average inflow. On a flat map, it adds exactly zero. On the round Earth, the meridians close in towards the pole, and that leaves the small difference of zero point three. [beat] The spin belongs to the storm, and the motion belongs to the whole pattern. For a house on the coast, though, the ground wind is what counts. That night, the weather station at Brest measured a gust of eighty four knots, about a hundred and fifty six kilometres per hour.

> 174 words · 11 sentences · 3 beats · 815.125–887.625 s (72.5 s; speech 64.8 s) · 13:35.12–14:47.62 (measured, dryrun1).

## s13_tau
The moving frame also explains what a fixed barometer sees. Let's take Plymouth, on England's south coast. Picture the pressure pattern as a frozen map, sliding east-north-east with the storm. A barometer that never moves sees the pressure fall as the low comes closer, even if the storm itself isn't deepening at all. So the barometer's reading mixes two things: the storm arriving, and the storm changing. To pull them apart, we need two observers. The first is the fixed barometer. Its rate is partial p by partial t: the change of pressure in time, at one fixed place. Here p is the pressure, and t is the time. [beat] The second is a rider, moving with the pressure pattern at bold capital U. The rider's position, measured in the moving pattern, is x prime, which is x minus capital U t, as on the train. And the rider's clock reads tau, the Greek letter t. Tau is the same time as t, but we give it a new name, because it marks a different thing held fixed. Partial p by partial tau is the change of pressure in time while x prime is held fixed: riding with the pattern. [beat] If the pattern really were frozen, the rider would see no change at all. So partial p by partial tau is the storm itself changing: negative when it deepens, and positive when it fills.

> 233 words · 16 sentences · 2 beats · 887.625–984.750 s (97.1 s; speech 88.8 s) · 14:47.62–16:24.75 (measured, dryrun1).

## s14_tau_derive
How are the two rates linked? The next three steps show it. They're for anyone who wants every step, so skip ahead to the time on screen if you'd rather go straight to the numbers. Step one: the rider is a traveller, moving at bold capital U. In the derivatives movie, we found the rate a traveller feels: the change at a fixed place, plus the traveller's speed times the slope, in each direction. With the dot product, that's partial p by partial t, plus bold capital U dot grad p. [beat] Step two: for this traveller, that rate is partial p by partial tau. So partial p by partial tau equals partial p by partial t, plus bold capital U dot grad p. [beat] Step three: move bold capital U dot grad p to the other side. Partial p by partial t equals partial p by partial tau, minus bold capital U dot grad p. [beat] Now let's read each term. On the left is the barometer's rate. The first term on the right is the storm changing. And bold capital U dot grad p is the storm's speed, times how fast the pressure rises along its direction of motion. Kilometres per hour, times hectopascals per kilometre, gives hectopascals per hour. With its minus sign, it's the change caused by the pattern sliding past. [beat] If you skipped, here's what to keep: what the barometer sees is the storm changing, minus the pattern sliding past.

> 242 words · 17 sentences · 4 beats · 984.750–1091.525 s (106.8 s; speech 95.8 s) · 16:24.75–18:11.53 (measured, splice2).

## s15_plymouth
Now the numbers at Plymouth, around midnight. At eleven in the evening, the pressure was nine hundred and sixty four point one hectopascals, and at one in the morning, nine hundred and fifty six point five. So, at midnight, the barometer's rate was nine hundred and fifty six point five minus nine hundred and sixty four point one, over two hours: about minus three point eight hectopascals per hour. [beat] Plymouth was ahead of the low, about a hundred and twenty three kilometres to its north-east. There, the pressure rose along the storm's direction by about zero point zero six one hectopascals per kilometre. [beat] The storm moved at fourteen point six metres per second, which is fifty two and a half kilometres per hour. So bold capital U dot grad p is fifty two and a half times zero point zero six one: about three point two hectopascals per hour. [beat] Then the storm's own change, partial p by partial tau, is partial p by partial t plus bold capital U dot grad p. That's minus three point eight plus three point two: about minus zero point six hectopascals per hour. [beat]

> 189 words · 9 sentences · 4 beats · 1091.525–1173.475 s (81.9 s; speech 74.2 s) · 18:11.53–19:33.47 (measured, dryrun1).

## s16_meaning
So, at Plymouth, minus three point eight equals minus zero point six, from the storm changing, minus three point two, from the pattern sliding past. [beat] Most of what the barometer saw was the storm arriving. Is the minus zero point six believable? Here's a check. Between eleven and one, the lowest pressure at the storm's tracked centre fell from nine hundred and fifty four point nine to nine hundred and fifty four point zero hectopascals: about minus half a hectopascal per hour, the same size. [beat] This is the same idea as advection in the dot product movie. Forecasters draw maps of these pressure changes, and we'll read them in a later movie: Reading maps over time.

> 116 words · 7 sentences · 2 beats · 1173.475–1225.075 s (51.6 s; speech 46.4 s) · 19:33.47–20:25.08 (measured, dryrun1).

## s17_recap
To sum up, a frame moving steadily in a straight line shifts positions by capital U times t, and velocities by capital U: u equals u prime plus capital U. But it leaves accelerations unchanged, so the same forces explain the motion in both frames. For an air parcel, the acceleration is the local change plus advection. Each piece depends on who measures it, but their sum doesn't. Storm Ciarán moved east-north-east at about fifteen metres per second. Taking that motion away from every wind gives the storm-relative wind: what a rider moving with the storm feels. It changed the wind at every point, but left the storm's average spin of about fourteen metres per second. A fixed barometer's rate is the storm changing, minus the pattern sliding past. At Plymouth, the fall of three point eight hectopascals per hour was mostly the storm arriving. In Part 6, we'll find the shortest way round the Earth: great circles, and rhumb lines.

> 161 words · 10 sentences · 0 beats · 1225.075–1295.675 s (70.6 s; speech 66.7 s) · 20:25.08–21:35.67 (measured, splice3).

## s18_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for coordinates, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 56 words · 3 sentences · 0 beats · 1295.675–1318.575 s (22.9 s; speech 21.9 s) · 21:35.67–21:58.58 (measured, dryrun1).
