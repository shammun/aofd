# ch00_dot_product_v01b — "The dot product: the part along, and where it is used" (plan, movie-director 2026-10-28)

House style `movies/HOUSE_STYLE.md` (reference `ch00_dot_product_why` v6). Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice, our own words, maths spoken in words. Lines starting with ">" are notes and are not spoken.

**Measured, not estimated.** `tools/tts.py` dry run 2026-10-28 (`G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_cross_product_split\dryrun\v2_20261028\ch00_dot_product_v01b`; current `movies/lexicon.yaml`, no new entries): **34 scenes, 227 sentences, 3777 words, 1501.400 s narration + 2.5-s silent end-card hold = 1503.900 s (25:03.90)**; speech alone 1406.9 s = 161.1 words per minute while speaking, **150.7 words per minute overall** (limit 150); 369 caption cues; self-check {'expected_s': 1501.4, 'audio_s': 1501.4, 'diff_ms': 0.0, 'len_ok': True, 'cues_ok': True}; Kokoro render 1067.5 s; warnings: none.

## s00_title
In this video, we'll learn the dot product the easy way, and see how meteorology uses it to tell how fast the wind changes the temperature.

> 26 words · 1 sentences · 0.300–10.425 s (10.1 s; speech 9.3 s) · 0:00.30–0:10.43 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s00_title.

## s01_hook
What is the dot product? Let's see what it is, why it's built this way, and what it tells us about the wind.

> 23 words · 2 sentences · 10.425–18.875 s (8.4 s; speech 7.3 s) · 0:10.43–0:18.88 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s01_hook.

## s02_arrows
A vector is an arrow, with a length and a direction. Vector a goes five steps right and one up, and vector b goes one right and three up. These numbers are called components: five and one are the components of vector a and one and three are those of vector b. Pythagoras' theorem gives their lengths, written with two straight bars: about five point one and three point one six.

> 71 words · 4 sentences · 18.875–46.600 s (27.7 s; speech 25.9 s) · 0:18.88–0:46.60 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s02_arrows.

## s03_definition
So how do we find the dot product? We multiply the matching components, and then add. Arrows in three-dimensional space have three components, along x, y and z, so we'd add three products. Ours lie flat, in two dimensions, so the third term drops out. The first components give five times one, which is five, and the second give one times three, which is three. Adding them, a dot b equals eight: a single number, not an arrow. A number like this is called a scalar, so the dot product is also called the scalar product.

> 96 words · 7 sentences · 46.600–87.250 s (40.6 s; speech 37.8 s) · 0:46.60–1:27.25 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s03_definition.

## s04_cosine
Now let's look at how the angle between the two arrows plays a role. First, what is the cosine of an angle? Draw an arrow one unit long, at an angle theta to a flat line, and drop a line from its tip straight down onto that line. The piece it marks off along the line is the cosine of theta. When the arrow lies along the line, the piece is the whole arrow, so the cosine is one. When the arrow stands at a right angle, the piece shrinks to nothing, so the cosine is zero. And when the arrow points backwards, the piece is a whole unit backwards: minus one. The dot product can also be written as the two lengths times the cosine of theta, the angle between them. Here theta is about sixty degrees, with a cosine of about point five. Multiplied out, that's eight again, and we'll call this equation one.

> 156 words · 10 sentences · 87.250–146.025 s (58.8 s; speech 54.8 s) · 1:27.25–2:26.03 (measured, dry run)
> New or changed sentences: “First, what is the cosine of an angle?” | “Draw an arrow one unit long, at an angle theta to a flat line, and dro…” | “The piece it marks off along the line is the cosine of theta.” | “When the arrow lies along the line, the piece is the whole arrow, so t…” | “When the arrow stands at a right angle, the piece shrinks to nothing, …” | “And when the arrow points backwards, the piece is a whole unit backwar…”

## s05_angle_cases
Let's keep one arrow fixed in all three pictures, and change only the other one. The fixed arrow, p, has components three and zero. First, the other vector, q, points in the same direction as p and has components two and zero. Three times two plus zero times zero is six, a positive number. In the next case, vector q is at a right angle to p, with components zero and two, and the dot product is zero. In general, whenever two vectors are at right angles, their dot product is zero. Last, q has components minus two and zero, pointing in the opposite direction: three times minus two is minus six, a negative number. When two vectors point in opposite directions, their dot product is negative. In fact, q doesn't have to point exactly along p. Let's sweep it all the way round. Anywhere in the half in front of p, the dot product is positive. On the line straight across, it's zero. And anywhere in the half behind, it's negative. So the dot product measures how much two arrows point the same way.

> 185 words · 14 sentences · 146.025–223.775 s (77.8 s; speech 72.4 s) · 2:26.03–3:43.78 (measured, dry run)
> New or changed sentences: “In fact, q doesn't have to point exactly along p.” | “Let's sweep it all the way round.” | “Anywhere in the half in front of p, the dot product is positive.” | “On the line straight across, it's zero.” | “And anywhere in the half behind, it's negative.”

## s05a_matching_parts
But why does multiplying matching components give the same answer as the lengths and the cosine? Let's split vector a into two arrows laid end to end: five steps along x, and one step along y. To write them, let x hat and y hat be arrows one unit long, pointing along x and along y. Now take the dot product of each piece with b, which we can split the same way. The x piece of vector a points along x, so it only sees the x part of b: five times one. The y piece only sees the y part of b: one times three. A piece along x and a part along y are at right angles, and arrows at right angles give zero, so these mixed terms drop out. And a unit arrow dotted with itself is one times one times cos zero, which is one. What's left is five times one plus one times three, eight: exactly the component recipe. So each axis does its own multiplication, and we add up the results.

> 178 words · 10 sentences · 223.775–292.875 s (69.1 s; speech 65.2 s) · 3:43.78–4:52.88 (measured, dry run)
> **New scene.**
> Related: #1a vectors and index notation

## s06_shadow
Now let's find a picture for the dot product. From the tip of vector a we drop a line onto b's line, at a right angle. The piece it marks off is called the shadow of vector a on b. In this right triangle, the shadow is the length of vector a times cos theta. Divide both sides of equation one by the length of b, and only the shadow is left on the right: eight over three point one six, or two point five three.

> 86 words · 5 sentences · 292.875–323.775 s (30.9 s; speech 28.7 s) · 4:52.88–5:23.77 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s06_shadow.

## s07_unit_vector
There's another way to reach the same shadow. Divide b by its own length to get b hat, the unit vector along b: length one, same direction. Its components are one and three, each divided by three point one six. Dividing b by its length divides the dot product by it too, so a dot b hat is the shadow itself: two point five three again. Think of b hat as a ruler laid along b's line. The dot product of vector a with the ruler is the reading where the shadow of vector a ends. Turn the ruler, and the reading changes, even though vector a stays the same.

> 110 words · 7 sentences · 323.775–366.525 s (42.8 s; speech 39.9 s) · 5:23.77–6:06.52 (measured, dry run)
> New or changed sentences: “Think of b hat as a ruler laid along b's line.” | “The dot product of vector a with the ruler is the reading where the sh…” | “Turn the ruler, and the reading changes, even though vector a stays th…”

## s08_question
So the dot product is the shadow times the length of b. But why not stop at the shadow? There are three good reasons.

> 24 words · 3 sentences · 366.525–376.525 s (10.0 s; speech 8.5 s) · 6:06.52–6:16.52 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s08_question.

## s09_reason1_order
The first is that the order shouldn't matter. The shadow of vector a on b is two point five three, but the shadow of b on vector a is one point five seven. Multiply each by the length of the arrow it falls on, and both give eight. Let's draw both products as rectangles. One is two point five three wide and three point one six tall, and the other is one point five seven wide and five point one tall. They have different shapes, but the same area: eight.

> 90 words · 6 sentences · 376.525–411.700 s (35.2 s; speech 32.6 s) · 6:16.52–6:51.70 (measured, dry run)
> New or changed sentences: “Let's draw both products as rectangles.” | “One is two point five three wide and three point one six tall, and the…” | “They have different shapes, but the same area: eight.”

## s10_reason2_cheap
The second reason is practical: it's quick to calculate, with no angle and no square root. Suppose the wind blows towards the north-east at ten metres per second. Written as a vector, v has components six and eight. How much of this wind blows towards the east? To find out, we take the dot product of v with the unit vector pointing east, x hat, whose components are one and zero. Then v dot x hat is six times one, plus eight times zero, which is six. So six metres per second is the eastward part of the wind. It's simply the first component: a dot product with a unit vector picks out the part of v along it.

> 119 words · 8 sentences · 411.700–458.575 s (46.9 s; speech 43.6 s) · 6:51.70–7:38.57 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s10_reason2_cheap.

## s11_work
The third reason is that physics often needs both sizes. Picture a small cart on a straight railway track, with a strong wind pushing on it. The wind's push is a force vector, F, of twenty newtons, at sixty degrees to the track. The cart can only move along the track, along a displacement vector, d. The rails hold back the part of the push across the track, so that part does nothing to move the cart. The part along the track, the shadow of F on d, is ten newtons. Work, in joules, is that force times the distance: fifty joules if d is five metres. If d doubles to ten metres, the work doubles to one hundred joules, but the shadow is still ten newtons. So the shadow alone can't give the work: we must multiply by the length of d, and the dot product does exactly that. Work is an amount of energy given to the cart, with no direction of its own, which is why the dot product gives a number.

> 175 words · 10 sentences · 458.575–524.775 s (66.2 s; speech 62.3 s) · 7:38.57–8:44.77 (measured, dry run)
> New or changed sentences: “Picture a small cart on a straight railway track, with a strong wind p…” | “The wind's push is a force vector, F, of twenty newtons, at sixty degr…” | “The cart can only move along the track, along a displacement vector, d…” | “The rails hold back the part of the push across the track, so that par…” | “The part along the track, the shadow of F on d, is ten newtons.” | “Work is an amount of energy given to the cart, with no direction of it…”

## s11a_perp_push
What about a push that's always across the motion? Imagine a ball whirled round on a string. The string pulls towards the centre, always at a right angle to the way the ball is moving. So its dot product with every small step is zero, and it does no work. The ball's energy of motion stays the same: the pull only changes its direction, bending its path into a circle. We'll meet pushes like this again, when Earth's spin turns the wind.

> 82 words · 6 sentences · 524.775–557.575 s (32.8 s; speech 30.2 s) · 8:44.77–9:17.58 (measured, dry run)
> **New scene.**
> Related: #3 cross product in physics, #29 Coriolis

## s12_parcel
Now let's look at how the dot product is used in weather. Imagine one thermometer fixed at one place, so it never moves: we'll call it the fixed thermometer. How fast its temperature changes over time is called the local rate, written partial capital T by partial small t. Here capital T stands for temperature, and small t for time. Partial means only time changes; the place stays fixed. A second thermometer rides a balloon drifting with the wind, inside one air parcel: a small volume of air that moves with the flow. Its rate, following the air parcel, is written capital D T by D t.

> 107 words · 7 sentences · 557.575–602.600 s (45.0 s; speech 42.1 s) · 9:17.58–10:02.60 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s12_parcel.
> Related: #10 material derivative

## s13_equation
Here is the equation the balloon's thermometer obeys. It tells us how anything the air carries, called phi, like temperature or moisture, changes as we follow an air parcel. On the left is the change following the parcel. On the right is the change at one fixed place, plus a term with v, the wind, and grad, which we'll meet soon. Advection means being carried along by the flow. So the advection term is the change that comes from being carried into warmer or colder air, or moister or drier air, depending on what phi stands for. The left side is called the material derivative. It isn't a partial derivative, because the place moves with the parcel: it's the partial derivative plus the advection term. For temperature, that term is v dot grad T, and its dot is our dot product.

> 141 words · 9 sentences · 602.600–660.100 s (57.5 s; speech 53.9 s) · 10:02.60–11:00.10 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s13_equation.
> Related: #10 material derivative

## s14_isotherms
To see it at work, picture a map where the temperature rises one degree for every hundred kilometres east, and doesn't change as you walk north. Join the places with the same temperature right now, and you get straight north to south lines, one every hundred kilometres. These are called isotherms. Walk east, and each isotherm you cross is one degree warmer: that's partial T by partial x, the change going east only. Walk north, and you stay on one isotherm, so partial T by partial y is zero.

> 89 words · 5 sentences · 660.100–696.650 s (36.5 s; speech 34.3 s) · 11:00.10–11:36.65 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s14_isotherms.

## s15_grad_t
These two rates form one arrow: the temperature gradient, read grad T. A kelvin step is the same size as a degree Celsius step, so grad T is ten to the minus five kelvin per metre going east, and zero going north. It points the way the temperature increases fastest: straight across the isotherms, towards warmer air.

> 57 words · 3 sentences · 696.650–720.850 s (24.2 s; speech 22.7 s) · 11:36.65–12:00.85 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s15_grad_t.
> Related: #6 gradient

## s16a_wind_parts
Now a wind blows across the map, the one carrying our balloon: ten metres per second, at sixty degrees to grad T. Its shadow on grad T, ten times cos sixty, is five metres per second, straight across the isotherms. This shadow is the part of the wind that carries air across the isotherms, towards the warmer side.

> 58 words · 3 sentences · 720.850–745.200 s (24.4 s; speech 22.8 s) · 12:00.85–12:25.20 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s16a_wind_parts.

## s16b_advection_number
The length of grad T, by Pythagoras, is the square root of ten to the minus five squared, plus zero squared: just ten to the minus five kelvin per metre. So v dot grad T is the wind's shadow times the length of grad T: five metres per second times ten to the minus five kelvin per metre. The metres cancel, leaving five times ten to the minus five kelvin per second, or point one eight kelvin per hour.

> 79 words · 3 sentences · 745.200–775.825 s (30.6 s; speech 29.1 s) · 12:25.20–12:55.83 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s16b_advection_number.

## s17_meaning
What does point one eight kelvin per hour mean? Let's follow the balloon's air parcel, which is at the fixed thermometer right now. The wind carries it straight across the isotherms at five metres per second, the wind's shadow. Distance is speed times time, so in one hour, three thousand six hundred seconds, it moves eighteen kilometres across them. On the map as it is right now, each hundred kilometres east is one degree warmer, so eighteen kilometres is worth point one eight degrees. So in one hour, the wind carries the parcel to a place where the map reads thirteen point one eight. One degree per hundred kilometres is a rate in space: how the temperature changes with distance. Multiply it by a speed in kilometres per hour, and you get degrees per hour: a rate in time. So point one eight kelvin per hour is how fast the wind carries the parcel into warmer places. That's v dot grad T, the advection term. It's positive because the wind blows partly towards warmer air, and it's the same for every air parcel here, because the wind and the map are the same everywhere. But does the parcel itself get warmer? That depends on what the map does, so let's look at two cases.

> 214 words · 13 sentences · 775.825–861.400 s (85.6 s; speech 80.6 s) · 12:55.83–14:21.40 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s17_meaning.

## s17b_frozen
In the first case, imagine the map stays frozen, because the sun keeps every place at exactly its temperature. Then the fixed thermometer always reads thirteen degrees, so its local rate, partial T by partial t, is zero. The balloon, though, reads the map wherever the wind takes it: thirteen point one eight after one hour, thirteen point three six after two, and thirteen point five four after three. Its reading climbs by point one eight degrees every hour, because the wind keeps carrying it into warmer places. In our equation, capital D T by D t is zero plus v dot grad T: plus point one eight kelvin per hour. On the graph, the fixed thermometer's line stays flat, while the balloon's line climbs. So when the map is frozen, the parcel warms by exactly the advection term.

> 139 words · 7 sentences · 861.400–919.250 s (57.9 s; speech 55.0 s) · 14:21.40–15:19.25 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s17b_frozen.

## s18_keeps_temperature
Now for the second case, which we'll follow from now on. We assume the air parcel inside the balloon doesn't change its temperature as it moves with the wind: no sunshine and no mixing. That means the material derivative, capital D T by D t, is zero. Every other air parcel keeps its temperature too. And since the air carries its temperature along, the whole pattern of isotherms slides with the wind. Our wind is the same everywhere, so the lines move east, eighteen kilometres every hour.

> 87 words · 6 sentences · 919.250–956.325 s (37.1 s; speech 34.5 s) · 15:19.25–15:56.33 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s18_keeps_temperature.

## s19a_pole_cools
Now let's set the clock back to zero and watch the fixed thermometer. Ahead of the wind it's warmer, so behind it, upwind, where the wind comes from, it's colder. The air that will reach the fixed thermometer in one hour is now eighteen kilometres across the isotherms on the colder side, at twelve point eight two degrees. Behind it waits the air that will arrive in two hours, at twelve point six four, and in three hours, at twelve point four six. Now let's start the clock. One by one, each air parcel reaches the fixed thermometer and brings its temperature with it: twelve point eight two after one hour, twelve point six four after two, and twelve point four six after three. Colder and colder air keeps arriving, so the fixed thermometer's reading falls by point one eight degrees every hour. Meanwhile, the balloon moves with its parcel, so its line on the graph stays flat at thirteen degrees.

> 161 words · 8 sentences · 956.325–1020.375 s (64.0 s; speech 60.8 s) · 15:56.33–17:00.38 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s19a_pole_cools.

## s19b_equation
Our equation says the same. Put zero for capital D T by D t, and subtract v dot grad T from both sides: partial T by partial t equals minus v dot grad T. The wind has a part towards warmer air, so v dot grad T is plus point one eight kelvin per hour. The minus sign makes it a fall of point one eight at the fixed thermometer, as colder air is carried in.

> 76 words · 4 sentences · 1020.375–1048.950 s (28.6 s; speech 26.7 s) · 17:00.38–17:28.95 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s19b_equation.

## s19c_balance
So why does the balloon stay at thirteen? In one hour it moves eighteen kilometres across the isotherms, to where the map read thirteen point one eight an hour ago. Crossing the isotherms like that is worth plus point one eight: that's the advection term. In the first case, the map stood still, so the local rate was zero, and the parcel warmed by point one eight. In our second case, every place has cooled by point one eight degrees in that hour, and that fall, minus point one eight, is the local rate. They cancel, so the balloon still reads thirteen. So the advection term is the same in both cases; only the local rate is different.

> 118 words · 7 sentences · 1048.950–1095.100 s (46.1 s; speech 43.2 s) · 17:28.95–18:15.10 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s19c_balance.

## s19d_three_rates
Let's put the three rates side by side, and say what each one means. The advection term, v dot grad T, tells us how fast the wind carries an air parcel into warmer or colder places. Here it's plus point one eight kelvin per hour in both cases, because the wind and the spacing of the isotherms are the same. The local rate, partial T by partial t, is what the fixed thermometer sees, at one place that never moves: zero when the map is frozen, and minus point one eight in our story, as colder air arrives. The material derivative, capital D T by D t, is what the balloon's thermometer sees, and it's the local rate plus the advection term: plus point one eight when the map is frozen, and zero in our story. So whenever you meet v dot grad T, think of how fast the wind carries air across the isotherms, measured in degrees per hour.

> 160 words · 6 sentences · 1095.100–1155.675 s (60.6 s; speech 58.0 s) · 18:15.10–19:15.67 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s19d_three_rates.

## s20_twice_steep
Now let's change only the map: the temperature rises one degree every fifty kilometres, instead of every hundred. The isotherms are twice as close, so grad T doubles, to two times ten to the minus five kelvin per metre. Its length, by Pythagoras again, is that same number, because the northward part is still zero. The wind's shadow is still five metres per second. But the dot product doubles, to point three six kelvin per hour, so the fixed thermometer cools twice as fast. Just as with the sled, the shadow stayed the same, so on its own it would miss this change. Multiplying by the length of grad T catches it.

> 112 words · 7 sentences · 1155.675–1201.575 s (45.9 s; speech 43.0 s) · 19:15.67–20:01.58 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s20_twice_steep.

## s20b_runway
The dot product turns up in many more places, so let's look at a few. First, a runway. Pilots need to know how much of the wind blows along the runway. Say the runway points north, and the wind blows at ten metres per second towards the north east, thirty degrees off the runway. Let e hat be a unit arrow along the runway. Then the wind dot e hat is ten times cos thirty, about eight point seven metres per second along the runway. The part straight across it is a job for the cross product, in the next video.

> 101 words · 7 sentences · 1201.575–1240.500 s (38.9 s; speech 36.0 s) · 20:01.58–20:40.50 (measured, dry run)
> **New scene.**
> Related: #2 cross product (runway, across part)

## s20c_flux
Second, how much passes through a surface. Hold a window frame in a steady stream of sunlight. When it faces the sun square on, it catches the most light. Tilt it, and less light gets through, and edge on, none at all. The amount is the sunlight's strength times s hat dot n hat, where s hat points towards the sun and n hat points straight out of the window. The ground works the same way. At noon on the March equinox, the sun is straight overhead at the equator, but at sixty degrees north it's sixty degrees away from overhead, so s hat dot n hat is cos sixty, one half. The same sunlight is spread over twice as much ground, which is a big part of why places near the poles are colder. The same dot product measures heat or water flowing through any surface. The climate machine video builds on exactly this.

> 155 words · 10 sentences · 1240.500–1300.100 s (59.6 s; speech 55.7 s) · 20:40.50–21:40.10 (measured, dry run)
> **New scene.**
> Related: #22 climate machine, #7 divergence and flux

## s20d_wind_work
Third, the wind's work on the ocean. Wind blowing over the sea drags on the water. The drag on each square metre is an arrow called the wind stress, tau. The power it gives the water is tau dot u, where u is the water's velocity. Where the wind blows along with a current, the dot product is positive, and the wind feeds the current with energy. Where it blows against the current, the dot product is negative, and the wind takes energy away. Say the wind stress is point one newtons per square metre, and the current flows the same way at point one metres per second. Then the wind gives the current point zero one watts on every square metre. Added up over the world ocean, this comes to about a million million watts, most of it over the Southern Ocean, where strong westerly winds blow along with the current that circles Antarctica.

> 155 words · 9 sentences · 1300.100–1360.150 s (60.1 s; speech 56.5 s) · 21:40.10–22:40.15 (measured, dry run)
> **New scene.**
> Related: #52 wind-driven gyres, #57 Antarctic Circumpolar Current

## s20e_similarity
Fourth, comparing patterns. Write today's pressure at four weather stations, as departures from their usual values, as one list of four numbers: an arrow in four dimensions. We can't draw it, but the recipe works just the same. Today reads three, one, minus two and minus two hectopascals, and a day in the past reads two, two, minus one and minus three. Their dot product is six plus two plus two plus six, which is sixteen. Both lengths are the square root of eighteen, so the cosine of the angle between them is sixteen over eighteen, about point eight nine. Near one, two days look alike; near zero, they have nothing in common; and near minus one, they're opposites. Forecasters have used this to find past days that looked like today, and computers use the same idea to compare pictures and words.

> 142 words · 8 sentences · 1360.150–1419.000 s (58.8 s; speech 55.6 s) · 22:40.15–23:39.00 (measured, dry run)
> **New scene.**
> Related: #21 statistics of fields

## s21_recap
To sum up, the dot product multiplies matching components and adds, giving a number, not an arrow, because each axis only multiplies its own parts. In pictures, it's the shadow of one arrow on the other, times the other's length. When the arrows point the same way, it's positive. At right angles, it's zero. In opposite directions, it's negative. With a unit vector, it picks out one part of an arrow, like the wind along a runway. It gives the work a force does along the motion, and a push across the motion does no work at all. It measures how much sunlight passes through the ground, whether the wind feeds an ocean current or drains it, how alike two weather patterns are, and how fast the wind changes the temperature at a fixed place. The cross product, in the next video, uses the part across instead.

> 147 words · 9 sentences · 1419.000–1478.175 s (59.2 s; speech 55.6 s) · 23:39.00–24:38.17 (measured, dry run)
> New or changed sentences: “To sum up, the dot product multiplies matching components and adds, gi…” | “With a unit vector, it picks out one part of an arrow, like the wind a…” | “It gives the work a force does along the motion, and a push across the…” | “It measures how much sunlight passes through the ground, whether the w…” | “The cross product, in the next video, uses the part across instead.”

## s22_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for this dot product, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 58 words · 3 sentences · 1478.175–1501.400 s (23.2 s; speech 22.2 s) · 24:38.17–25:01.40 (measured, dry run)
> Word-identical to ch00_dot_product_why(v6fix1)/s22_end.
> Related: #1a, #2, #3, #6, #10, #22
