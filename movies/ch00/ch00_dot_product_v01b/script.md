# ch00_dot_product_v01b — "The dot product: the part along, and where it is used" (plan, movie-director 2026-10-28)

House style `movies/HOUSE_STYLE.md` (reference `ch00_dot_product_why` v6). Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice, our own words, maths spoken in words. Lines starting with ">" are notes and are not spoken; `[beat]` = a 1.5-s hold after a worked calculation (not spoken, not captioned).

**Measured, not estimated.** `tools/tts.py` dry run 2026-10-28 (`G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_cross_product_split/dryrun/v3_20261028/ch00_dot_product_v01b_run2`; current `movies/lexicon.yaml`, no new entries): **35 scenes, 231 sentences, 10 beats, 3844 words, 1536.950 s narration + 2.5-s silent end-card hold = 1539.450 s (25:39.45)**; speech alone 1430.4 s = 161.2 words per minute while speaking, **149.8 words per minute overall** (limit 150); 376 caption cues; self-check {'expected_s': 1536.95, 'audio_s': 1536.95, 'diff_ms': 0.0, 'len_ok': True, 'cues_ok': True}; Kokoro render 941.6 s; warnings: none.

**Plan 3 (2026-10-28): the committed 0.1b + everything in v6**
User rule: start from the committed 0.1b (1aa590f, with its added examples) but lose **nothing** from v6. Every v6 scene,
sentence, example, number and device is here; where 0.1b had changed one, v6's version comes first and the 0.1b device
follows it. Music: v6's own score (`tools/music.py`, seed 7). Title fix from the phone review kept. The full map
(every v6 scene → 0.1b, every addition → its source) is in `data_needs.md` §0–§0b.

| Scene | Status |
|---|---|
| s00, s01, s02, s03, s06, s08, s10, s12–s20, s22 | v6 word-identical (s00: title layout fix; s22: thumbnails) |
| s04, s05, s07, s09, s21 | v6 kept word for word + the 0.1b device / sentences added after it |
| s11_work | v6 sled restored word for word (the committed 0.1b had replaced it) |
| s05a, s11a, s11b, s20b, s20c, s20d, s20e | 0.1b additions (s11a = the committed cart, now beside the sled; s11b = the committed perpendicular push, renamed) |

The ≈ 1 TW sentence in s20d is measured here but must not go on screen or into the final narration until its citation
is confirmed (`data_needs.md` §C W2).

## s00_title
In this video, we'll learn the dot product the easy way, and see how meteorology uses it to tell how fast the wind changes the temperature.

> 26 words · 1 sentences · 0 beats · 0.300–10.425 s (10.1 s; speech 9.3 s) · 0:00.30–0:10.43 (measured, dry run 2026-10-28)
> changed
> phone review 2026-10-27 (review_dot_product_v6_final, notes 1-3): title fix

## s01_hook
What is the dot product? Let's see what it is, why it's built this way, and what it tells us about the wind.

> 23 words · 2 sentences · 0 beats · 10.425–18.875 s (8.4 s; speech 7.3 s) · 0:10.43–0:18.88 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s02_arrows
A vector is an arrow, with a length and a direction. Vector a goes five steps right and one up, and vector b goes one right and three up. These numbers are called components: five and one are the components of vector a and one and three are those of vector b. Pythagoras' theorem gives their lengths, written with two straight bars: about five point one and three point one six.

> 71 words · 4 sentences · 0 beats · 18.875–46.600 s (27.7 s; speech 25.9 s) · 0:18.88–0:46.60 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s03_definition
So how do we find the dot product? We multiply the matching components, and then add. Arrows in three-dimensional space have three components, along x, y and z, so we'd add three products. Ours lie flat, in two dimensions, so the third term drops out. The first components give five times one, which is five, and the second give one times three, which is three. Adding them, a dot b equals eight: a single number, not an arrow. A number like this is called a scalar, so the dot product is also called the scalar product.

> 96 words · 7 sentences · 0 beats · 46.600–87.250 s (40.6 s; speech 37.8 s) · 0:46.60–1:27.25 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s04_cosine
Now let's look at how the angle between the two arrows plays a role. The dot product can also be written as the two lengths times the cosine of theta, the angle between them. The cosine is one when two arrows point the same way, zero at a right angle, and minus one when they point in opposite directions. Here's another way to see the cosine. Draw an arrow one unit long, at an angle theta to a flat line, and drop a line from its tip straight down onto that line. The piece it marks off along the line is the cosine of theta. So the piece is the whole arrow when it lies along the line, nothing when it stands at a right angle, and a whole unit backwards when it points the other way. Here theta is about sixty degrees, with a cosine of about point five. Multiplied out, that's eight again, and we'll call this equation one. [beat]

> 161 words · 9 sentences · 1 beats · 87.250–146.775 s (59.5 s; speech 55.2 s) · 1:27.25–2:26.78 (measured, dry run 2026-10-28)
> kept + extended
> v6 kept word for word; ADDED after v6's 'The cosine is one…': the cosine as the piece a unit arrow marks off on a line (research §3 D1)

## s05_angle_cases
Let's keep one arrow fixed in all three pictures, and change only the other one. The fixed arrow, p, has components three and zero. First, the other vector, q, points in the same direction as p and has components two and zero. Three times two plus zero times zero is six, a positive number. In the next case, vector q is at a right angle to p, with components zero and two, and the dot product is zero. In general, whenever two vectors are at right angles, their dot product is zero. Last, q has components minus two and zero, pointing in the opposite direction: three times minus two is minus six, a negative number. When two vectors point in opposite directions, their dot product is negative. In fact, q doesn't have to point exactly along p. Let's sweep it all the way round. Anywhere in the half in front of p, the dot product is positive. On the line straight across, it's zero. And anywhere in the half behind, it's negative. So the dot product measures how much two arrows point the same way.

> 185 words · 14 sentences · 0 beats · 146.775–224.525 s (77.8 s; speech 72.4 s) · 2:26.78–3:44.53 (measured, dry run 2026-10-28)
> kept + extended
> v6 kept word for word and device for device; ADDED after it: the half-plane sweep (research §3 D4)

## s05a_matching_parts
But why does multiplying matching components give the same answer as the lengths and the cosine? Let's split vector a into two arrows laid end to end: five steps along x, and one step along y. To write them, let x hat and y hat be arrows one unit long, pointing along x and along y. Now take the dot product of each piece with b, which we can split the same way. The x piece of vector a points along x, so it only sees the x part of b: five times one. The y piece only sees the y part of b: one times three. A piece along x and a part along y are at right angles, and arrows at right angles give zero, so these mixed terms drop out. And a unit arrow dotted with itself is one times one times cos zero, which is one. What's left is five times one plus one times three, eight: exactly the component recipe. [beat] So each axis does its own multiplication, and we add up the results.

> 178 words · 10 sentences · 1 beats · 224.525–294.775 s (70.2 s; speech 65.2 s) · 3:44.53–4:54.77 (measured, dry run 2026-10-28)
> new
> V-D4 key 'why' scene (research §1b/§1c, user priority) + D3 expand the brackets
> Related: #1a vectors and index notation

## s06_shadow
Now let's find a picture for the dot product. From the tip of vector a we drop a line onto b's line, at a right angle. The piece it marks off is called the shadow of vector a on b. In this right triangle, the shadow is the length of vector a times cos theta. Divide both sides of equation one by the length of b, and only the shadow is left on the right: eight over three point one six, or two point five three.

> 86 words · 5 sentences · 0 beats · 294.775–325.675 s (30.9 s; speech 28.7 s) · 4:54.77–5:25.68 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s07_unit_vector
There's another way to reach the same shadow. Divide b by its own length to get b hat, the unit vector along b: length one, same direction. Its components are one and three, each divided by three point one six. Dividing b by its length divides the dot product by it too, so a dot b hat is the shadow itself: two point five three again. Think of b hat as a ruler laid along b's line. The dot product of vector a with the ruler is the reading where the shadow of vector a ends. Turn the ruler, and the reading changes, even though vector a stays the same.

> 110 words · 7 sentences · 0 beats · 325.675–368.425 s (42.8 s; speech 39.9 s) · 5:25.68–6:08.43 (measured, dry run 2026-10-28)
> kept + extended
> v6 kept word for word and device for device; ADDED after it: the turning ruler (research §3 D1/D7)

## s08_question
So the dot product is the shadow times the length of b. But why not stop at the shadow? There are three good reasons.

> 24 words · 3 sentences · 0 beats · 368.425–378.425 s (10.0 s; speech 8.5 s) · 6:08.43–6:18.43 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s09_reason1_order
The first is that the order shouldn't matter. The shadow of vector a on b is two point five three, but the shadow of b on vector a is one point five seven. Multiply each by the length of the arrow it falls on, and both give eight. Let's draw both products as rectangles. One is two point five three wide and three point one six tall, and the other is one point five seven wide and five point one tall. They have different shapes, but the same area: eight. [beat]

> 90 words · 6 sentences · 1 beats · 378.425–414.300 s (35.9 s; speech 32.6 s) · 6:18.43–6:54.30 (measured, dry run 2026-10-28)
> kept + extended
> v6 kept word for word and device for device; ADDED after it: the two equal rectangles (research §3 D2)

## s10_reason2_cheap
The second reason is practical: it's quick to calculate, with no angle and no square root. Suppose the wind blows towards the north-east at ten metres per second. Written as a vector, v has components six and eight. How much of this wind blows towards the east? To find out, we take the dot product of v with the unit vector pointing east, x hat, whose components are one and zero. Then v dot x hat is six times one, plus eight times zero, which is six. So six metres per second is the eastward part of the wind. It's simply the first component: a dot product with a unit vector picks out the part of v along it.

> 119 words · 8 sentences · 0 beats · 414.300–461.175 s (46.9 s; speech 43.6 s) · 6:54.30–7:41.18 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s11_work
The third reason is that physics often needs both sizes. Pull a sled with a force vector, F, of twenty newtons, tilted sixty degrees up, while it moves along a displacement vector, d. The upward part of the pull does no work; the part along the ground, the shadow of F on d, is ten newtons. Work, in joules, is that force times the distance: fifty joules if d is five metres. If d doubles to ten metres, the work doubles to one hundred joules, but the shadow is still ten newtons. So the shadow alone can't give the work: we must multiply by the length of d, and the dot product does exactly that.

> 115 words · 6 sentences · 0 beats · 461.175–506.025 s (44.8 s; speech 42.3 s) · 7:41.18–8:26.02 (measured, dry run 2026-10-28)
> reused (v6 restored)
> v6 sled restored word for word and device for device (the committed 0.1b had replaced it)

## s11a_cart
Here's another way to see why only the part along counts. Picture a small cart on a straight railway track, with a strong wind pushing on it, again with twenty newtons, at sixty degrees to the track. The cart can only move along the track. The rails hold back the part of the push across the track, so that part does nothing to move the cart. Only the part along the track, ten newtons again, does work: fifty joules over five metres. [beat] Work is an amount of energy given to the cart, with no direction of its own, which is why the dot product gives a number.

> 107 words · 6 sentences · 1 beats · 506.025–546.800 s (40.8 s; speech 37.1 s) · 8:26.02–9:06.80 (measured, dry run 2026-10-28)
> new
> reference video V-D1/V-D2: a push held to a track, the rails take the across part; work has no direction (the committed 0.1b cart, now beside v6's sled instead of replacing it)

## s11b_perp_push
What about a push that's always across the motion? Imagine a ball whirled round on a string. The string pulls towards the centre, always at a right angle to the way the ball is moving. So its dot product with every small step is zero, and it does no work. The ball's energy of motion stays the same: the pull only changes its direction, bending its path into a circle. We'll meet pushes like this again, when Earth's spin turns the wind.

> 82 words · 6 sentences · 0 beats · 546.800–579.600 s (32.8 s; speech 30.2 s) · 9:06.80–9:39.60 (measured, dry run 2026-10-28)
> new
> D5 / W17 perpendicular push does no work (research §3)
> Related: #3 cross product at work (s22e: the Coriolis push only steers), #29 Coriolis

## s12_parcel
Now let's look at how the dot product is used in weather. Imagine one thermometer fixed at one place, so it never moves: we'll call it the fixed thermometer. How fast its temperature changes over time is called the local rate, written partial capital T by partial small t. Here capital T stands for temperature, and small t for time. Partial means only time changes; the place stays fixed. A second thermometer rides a balloon drifting with the wind, inside one air parcel: a small volume of air that moves with the flow. Its rate, following the air parcel, is written capital D T by D t.

> 107 words · 7 sentences · 0 beats · 579.600–624.625 s (45.0 s; speech 42.1 s) · 9:39.60–10:24.62 (measured, dry run 2026-10-28)
> reused (v6 word-identical)
> Related: #10 material derivative

## s13_equation
Here is the equation the balloon's thermometer obeys. It tells us how anything the air carries, called phi, like temperature or moisture, changes as we follow an air parcel. On the left is the change following the parcel. On the right is the change at one fixed place, plus a term with v, the wind, and grad, which we'll meet soon. Advection means being carried along by the flow. So the advection term is the change that comes from being carried into warmer or colder air, or moister or drier air, depending on what phi stands for. The left side is called the material derivative. It isn't a partial derivative, because the place moves with the parcel: it's the partial derivative plus the advection term. For temperature, that term is v dot grad T, and its dot is our dot product.

> 141 words · 9 sentences · 0 beats · 624.625–682.125 s (57.5 s; speech 53.9 s) · 10:24.62–11:22.12 (measured, dry run 2026-10-28)
> reused (v6 word-identical)
> Related: #10 material derivative

## s14_isotherms
To see it at work, picture a map where the temperature rises one degree for every hundred kilometres east, and doesn't change as you walk north. Join the places with the same temperature right now, and you get straight north to south lines, one every hundred kilometres. These are called isotherms. Walk east, and each isotherm you cross is one degree warmer: that's partial T by partial x, the change going east only. Walk north, and you stay on one isotherm, so partial T by partial y is zero.

> 89 words · 5 sentences · 0 beats · 682.125–718.675 s (36.5 s; speech 34.4 s) · 11:22.12–11:58.67 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s15_grad_t
These two rates form one arrow: the temperature gradient, read grad T. A kelvin step is the same size as a degree Celsius step, so grad T is ten to the minus five kelvin per metre going east, and zero going north. It points the way the temperature increases fastest: straight across the isotherms, towards warmer air.

> 57 words · 3 sentences · 0 beats · 718.675–742.875 s (24.2 s; speech 22.7 s) · 11:58.67–12:22.88 (measured, dry run 2026-10-28)
> reused (v6 word-identical)
> Related: #6 gradient

## s16a_wind_parts
Now a wind blows across the map, the one carrying our balloon: ten metres per second, at sixty degrees to grad T. Its shadow on grad T, ten times cos sixty, is five metres per second, straight across the isotherms. This shadow is the part of the wind that carries air across the isotherms, towards the warmer side.

> 58 words · 3 sentences · 0 beats · 742.875–767.225 s (24.4 s; speech 22.9 s) · 12:22.88–12:47.23 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s16b_advection_number
The length of grad T, by Pythagoras, is the square root of ten to the minus five squared, plus zero squared: just ten to the minus five kelvin per metre. So v dot grad T is the wind's shadow times the length of grad T: five metres per second times ten to the minus five kelvin per metre. The metres cancel, leaving five times ten to the minus five kelvin per second, or point one eight kelvin per hour. [beat]

> 79 words · 3 sentences · 1 beats · 767.225–798.550 s (31.3 s; speech 29.1 s) · 12:47.23–13:18.55 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s17_meaning
What does point one eight kelvin per hour mean? Let's follow the balloon's air parcel, which is at the fixed thermometer right now. The wind carries it straight across the isotherms at five metres per second, the wind's shadow. Distance is speed times time, so in one hour, three thousand six hundred seconds, it moves eighteen kilometres across them. On the map as it is right now, each hundred kilometres east is one degree warmer, so eighteen kilometres is worth point one eight degrees. So in one hour, the wind carries the parcel to a place where the map reads thirteen point one eight. One degree per hundred kilometres is a rate in space: how the temperature changes with distance. Multiply it by a speed in kilometres per hour, and you get degrees per hour: a rate in time. So point one eight kelvin per hour is how fast the wind carries the parcel into warmer places. That's v dot grad T, the advection term. It's positive because the wind blows partly towards warmer air, and it's the same for every air parcel here, because the wind and the map are the same everywhere. But does the parcel itself get warmer? That depends on what the map does, so let's look at two cases.

> 214 words · 13 sentences · 0 beats · 798.550–884.125 s (85.6 s; speech 80.6 s) · 13:18.55–14:44.12 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s17b_frozen
In the first case, imagine the map stays frozen, because the sun keeps every place at exactly its temperature. Then the fixed thermometer always reads thirteen degrees, so its local rate, partial T by partial t, is zero. The balloon, though, reads the map wherever the wind takes it: thirteen point one eight after one hour, thirteen point three six after two, and thirteen point five four after three. Its reading climbs by point one eight degrees every hour, because the wind keeps carrying it into warmer places. In our equation, capital D T by D t is zero plus v dot grad T: plus point one eight kelvin per hour. [beat] On the graph, the fixed thermometer's line stays flat, while the balloon's line climbs. So when the map is frozen, the parcel warms by exactly the advection term.

> 139 words · 7 sentences · 1 beats · 884.125–943.125 s (59.0 s; speech 55.0 s) · 14:44.12–15:43.12 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s18_keeps_temperature
Now for the second case, which we'll follow from now on. We assume the air parcel inside the balloon doesn't change its temperature as it moves with the wind: no sunshine and no mixing. That means the material derivative, capital D T by D t, is zero. Every other air parcel keeps its temperature too. And since the air carries its temperature along, the whole pattern of isotherms slides with the wind. Our wind is the same everywhere, so the lines move east, eighteen kilometres every hour.

> 87 words · 6 sentences · 0 beats · 943.125–980.200 s (37.1 s; speech 34.5 s) · 15:43.12–16:20.20 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s19a_pole_cools
Now let's set the clock back to zero and watch the fixed thermometer. Ahead of the wind it's warmer, so behind it, upwind, where the wind comes from, it's colder. The air that will reach the fixed thermometer in one hour is now eighteen kilometres across the isotherms on the colder side, at twelve point eight two degrees. Behind it waits the air that will arrive in two hours, at twelve point six four, and in three hours, at twelve point four six. Now let's start the clock. One by one, each air parcel reaches the fixed thermometer and brings its temperature with it: twelve point eight two after one hour, twelve point six four after two, and twelve point four six after three. Colder and colder air keeps arriving, so the fixed thermometer's reading falls by point one eight degrees every hour. Meanwhile, the balloon moves with its parcel, so its line on the graph stays flat at thirteen degrees.

> 161 words · 8 sentences · 0 beats · 980.200–1044.250 s (64.0 s; speech 60.8 s) · 16:20.20–17:24.25 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s19b_equation
Our equation says the same. Put zero for capital D T by D t, and subtract v dot grad T from both sides: partial T by partial t equals minus v dot grad T. The wind has a part towards warmer air, so v dot grad T is plus point one eight kelvin per hour. The minus sign makes it a fall of point one eight at the fixed thermometer, as colder air is carried in.

> 76 words · 4 sentences · 0 beats · 1044.250–1072.825 s (28.6 s; speech 26.7 s) · 17:24.25–17:52.83 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s19c_balance
So why does the balloon stay at thirteen? In one hour it moves eighteen kilometres across the isotherms, to where the map read thirteen point one eight an hour ago. Crossing the isotherms like that is worth plus point one eight: that's the advection term. In the first case, the map stood still, so the local rate was zero, and the parcel warmed by point one eight. In our second case, every place has cooled by point one eight degrees in that hour, and that fall, minus point one eight, is the local rate. They cancel, so the balloon still reads thirteen. So the advection term is the same in both cases; only the local rate is different.

> 118 words · 7 sentences · 0 beats · 1072.825–1118.975 s (46.1 s; speech 43.2 s) · 17:52.83–18:38.97 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s19d_three_rates
Let's put the three rates side by side, and say what each one means. The advection term, v dot grad T, tells us how fast the wind carries an air parcel into warmer or colder places. Here it's plus point one eight kelvin per hour in both cases, because the wind and the spacing of the isotherms are the same. The local rate, partial T by partial t, is what the fixed thermometer sees, at one place that never moves: zero when the map is frozen, and minus point one eight in our story, as colder air arrives. The material derivative, capital D T by D t, is what the balloon's thermometer sees, and it's the local rate plus the advection term: plus point one eight when the map is frozen, and zero in our story. So whenever you meet v dot grad T, think of how fast the wind carries air across the isotherms, measured in degrees per hour.

> 160 words · 6 sentences · 0 beats · 1118.975–1179.550 s (60.6 s; speech 58.0 s) · 18:38.97–19:39.55 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s20_twice_steep
Now let's change only the map: the temperature rises one degree every fifty kilometres, instead of every hundred. The isotherms are twice as close, so grad T doubles, to two times ten to the minus five kelvin per metre. Its length, by Pythagoras again, is that same number, because the northward part is still zero. The wind's shadow is still five metres per second. But the dot product doubles, to point three six kelvin per hour, so the fixed thermometer cools twice as fast. Just as with the sled, the shadow stayed the same, so on its own it would miss this change. Multiplying by the length of grad T catches it.

> 112 words · 7 sentences · 0 beats · 1179.550–1225.450 s (45.9 s; speech 43.0 s) · 19:39.55–20:25.45 (measured, dry run 2026-10-28)
> reused (v6 word-identical)

## s20b_runway
The dot product turns up in many more places, so let's look at a few. First, a runway. Pilots need to know how much of the wind blows along the runway. Say the runway points north, and the wind blows at ten metres per second towards the north east, thirty degrees off the runway. Let e hat be a unit arrow along the runway. Then the wind dot e hat is ten times cos thirty, about eight point seven metres per second along the runway. [beat] The part straight across it is a job for the cross product, which a later video in this series takes on.

> 106 words · 7 sentences · 1 beats · 1225.450–1267.025 s (41.6 s; speech 37.5 s) · 20:25.45–21:07.03 (measured, dry run 2026-10-28)
> new
> W12 runway (research §4); 'along', not 'headwind' (a wind blowing towards the runway's heading is a tailwind for that heading)
> Related: #3 cross product at work (s53a: the part across the runway)

## s20c_flux
Second, how much passes through a surface. Hold a window frame in a steady stream of sunlight. When it faces the sun square on, it catches the most light. Tilt it, and less light gets through, and edge on, none at all. The amount is the sunlight's strength times s hat dot n hat, where s hat points towards the sun and n hat points straight out of the window. The ground works the same way. At noon on the March equinox, the sun is straight overhead at the equator, but at sixty degrees north it's sixty degrees away from overhead, so s hat dot n hat is cos sixty, one half. [beat] The same sunlight is spread over twice as much ground, which is a big part of why places near the poles are colder. The same dot product measures heat or water flowing through any surface. The climate machine video builds on exactly this.

> 155 words · 10 sentences · 1 beats · 1267.025–1327.775 s (60.8 s; speech 55.6 s) · 21:07.03–22:07.78 (measured, dry run 2026-10-28)
> new
> D6 / W16 / W14 flux (research §3-§4)
> Related: #22 climate machine, #7 divergence and flux

## s20d_wind_work
Third, the wind's work on the ocean. Wind blowing over the sea drags on the water. The drag on each square metre is an arrow called the wind stress, tau. The power it gives the water is tau dot u, where u is the water's velocity. Where the wind blows along with a current, the dot product is positive, and the wind feeds the current with energy. Where it blows against the current, the dot product is negative, and the wind takes energy away. Say the wind stress is point one newtons per square metre, and the current flows the same way at point one metres per second. Then the wind gives the current point zero one watts on every square metre. [beat] Added up over the world ocean, this comes to about a million million watts, most of it over the Southern Ocean, where strong westerly winds blow along with the current that circles Antarctica.

> 155 words · 9 sentences · 1 beats · 1327.775–1388.975 s (61.2 s; speech 56.5 s) · 22:07.78–23:08.97 (measured, dry run 2026-10-28)
> new
> W13 wind work and its sign (research §4)
> Related: #52 wind-driven gyres, #57 Antarctic Circumpolar Current

## s20e_similarity
Fourth, comparing patterns. Write today's pressure at four weather stations, as departures from their usual values, as one list of four numbers: an arrow in four dimensions. We can't draw it, but the recipe works just the same. Today reads three, one, minus two and minus two hectopascals, and a day in the past reads two, two, minus one and minus three. Their dot product is six plus two plus two plus six, which is sixteen. Both lengths are the square root of eighteen, so the cosine of the angle between them is sixteen over eighteen, about point eight nine. [beat] Near one, two days look alike; near zero, they have nothing in common; and near minus one, they're opposites. Forecasters have used this to find past days that looked like today, and computers use the same idea to compare pictures and words.

> 142 words · 8 sentences · 1 beats · 1388.975–1448.975 s (60.0 s; speech 55.6 s) · 23:08.97–24:08.97 (measured, dry run 2026-10-28)
> new
> V-D5 similarity / pattern correlation (research §1b-§1c)
> Related: #21 statistics of fields

## s21_recap
To sum up, the dot product multiplies matching components and adds, giving a number, not an arrow. That works because each axis only multiplies its own parts. In pictures, it's the shadow of one arrow on the other, times the other's length. When the arrows point the same way, it's positive. At right angles, it's zero. In opposite directions, it's negative. With a unit vector, it picks out one part of an arrow. A pilot uses this to find the wind along a runway. And in physics, it gives the work a force does, and how fast the wind changes the temperature at a fixed place. A push across the motion does no work at all. The dot product also measures how much sunlight passes through the ground, whether the wind feeds an ocean current or drains it, and how alike two weather patterns are. The cross product, in the next video, uses the part across instead.

> 157 words · 12 sentences · 0 beats · 1448.975–1513.725 s (64.8 s; speech 60.1 s) · 24:08.97–25:13.72 (measured, dry run 2026-10-28)
> kept + extended
> all seven v6 sentences word for word, in v6's order; ADDED: one sentence after S1 (matching parts), one after S6 (runway), and three after S7 (push across, flux / wind work / similarity, the pointer to the cross product)

## s22_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for this dot product, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 58 words · 3 sentences · 0 beats · 1513.725–1536.950 s (23.2 s; speech 22.2 s) · 25:13.72–25:36.95 (measured, dry run 2026-10-28)
> changed
> Related: #1a vectors, #2 cross product, #3 cross product at work, #6 gradient, #10 material derivative, #22 climate machine

> Total: 3844 words · 231 sentences · 10 beats · 1536.950 s narration · 1539.450 s movie (25:39.45) · 149.8 words per minute.
