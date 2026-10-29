# ch00_vectors_index_notation — narration (movie-director, 2026-10-28; v2 = 1a of the split)

Series plan v2 **#1a**. Split from v1 (71 scenes, 56:32) on 2026-10-28 (orchestrator decision in `data_needs.md`): this
movie keeps v1 s00–s32 (vectors, components, adding and subtracting with real weather, index notation, temperature
advection, the Kronecker delta) and ends with a new recap, a spoken pointer to **#1b
`ch00_alternating_tensor_triple_products`** and the maths end card. House style `movies/HOUSE_STYLE.md` (reference
`ch00_dot_product_why` v6). Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice; our own words; maths spoken in words.

Changes from v1 in the kept scenes: s00 promise (no "push of Earth's spin": that is 1b's), s01 keywords (no epsilon),
s19 sentence 6 ("a special symbol that we'll meet soon, and a second one in the next movie"). New: s33_recap, s34_next
(forward pointer to 1b), s35_end (v1 s61, end-card row now starts with 1b).

**Measured, not estimated.** `tools/tts.py` dry run on 2026-10-28 into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_vectors_index_notation/dryrun/v4_split_1a` (input = storyboard.yaml, current `movies/lexicon.yaml`, not edited): **45 scenes, 335 sentences, 5172 words, 2073.975 s narration + 2.5-s silent end-card hold = 2076.475 s (34:36.47)**; speech alone 1936.7 s = 160.2 words per minute while speaking, **149.4 words per minute overall** (limit 150); 521 caption cues; self-check {'expected_s': 2073.975, 'audio_s': 2073.975, 'diff_ms': 0.0, 'len_ok': True, 'cues_ok': True}; warnings: none.


**Spoken-letter rules.** No lone vector "a" anywhere (vectors are p, q, s, u, x, Omega). Indices are spoken "u sub i",
"delta i j", "epsilon i j k"; the unit vector up is "k hat" so it never collides with the index k.

**Pronunciations to check in the render (lexicon not edited; proposed entries):** Kronecker
(`[Kronecker](/kɹˈOnɛkəɹ/)`), epsilon (`[epsilon](/ˈɛpsɪlɑn/)`), parallelepiped (`[parallelepiped](/pˌæɹəlˌɛləpˈIpɪd/)`),
Saint-Malo (`[Saint-Malo](/sˌæn mˈɑlO/)`), Ciarán and ERA5 (exist), "sub" (check it is not read as "S U B"), "k hat",
"e one" (check "e" is the letter name, not a schwa).

**Cross-references (user rule 2026-10-27).** s11 coordinates (#5), s12c Coriolis, geostrophic wind and friction (#29, #30, #31), s12d geostrophic wind (#30), s12g thermal wind (#32), s12h El Niño (#62), s15 dot product (#0.1), s20 partial derivatives (#4) and gradient (#6), s23 material derivative (#10), s27 thermodynamics (#24), s28 vector identities II (#10B), s32 tensors (#11), **s34 the next movie, #1b**. Listed again on the end card; `related:` per scene in storyboard.yaml.

Lines starting with ">" are notes and are not spoken. Times are the measured scene start–end (s).

## s00_title
In this video, we'll learn vectors and index notation the easy way, and see how meteorology uses them to write the wind, how it changes, and the warmth it carries, in a few short symbols.

> 35 words · 1 sentence · 0.300–13.650 s (13.3 s; speech 12.6 s) · 0:00.30–0:13.65 (measured, dry run).
> Beat: opening title. Kind: 3-D diagram + map, data animation.

## s01_hook
What are vectors and index notation? Let's see what they are, why they're built this way, and what they tell us about the wind.

> 24 words · 2 sentences · 13.650–23.150 s (9.5 s; speech 8.3 s) · 0:13.65–0:23.15 (measured, dry run).
> Beat: hook question. Kind: globe + wind particles.

## s02_scalar_globe
Let's start with temperature. This globe shows the air temperature two metres above the ground all over the Earth, at six in the evening, universal time, on the first of November twenty twenty-three. Universal time is the one clock that weather services share around the world. The map comes from a reanalysis, called ERA5: a best estimate of the whole atmosphere, made by blending millions of observations into a weather model. At every place, the temperature is a single number. At Brest, a port at the western tip of France, the weather station read ten point three degrees Celsius.

> 99 words · 6 sentences · 23.150–66.400 s (43.3 s; speech 40.7 s) · 0:23.15–1:06.40 (measured, dry run).
> Beat: building blocks: scalar. Kind: globe (data).

## s03_scalar_word
A quantity like this, one number with a unit and nothing more, is called a scalar. Pressure, density and humidity are scalars too. Because the temperature has a value at every place, the whole map is called a scalar field. And a scalar doesn't care which way you face. Turn around on the same spot, and the thermometer still reads ten point three.

> 63 words · 5 sentences · 66.400–92.275 s (25.9 s; speech 23.7 s) · 1:06.40–1:32.28 (measured, dry run).
> Beat: building blocks: scalar defined. Kind: globe + keywords.

## s04_vector_wind
Now let's look at the wind, at the same place and the same moment. The station at Brest reported a wind of nine point three metres per second, from the south-south-east. A single number can't describe this. We need to know how fast the air moves, and which way it goes. A quantity with a size and a direction is called a vector, and we draw it as an arrow, which we name with a bold letter: the wind vector is bold u. The arrow's length shows the speed, and the arrow points the way the air is moving. Careful, though: weather reports give the direction the wind comes from. This wind comes from the south-south-east, so the air moves towards the north-north-west.

> 110 words · 8 sentences · 92.275–135.625 s (43.3 s; speech 40.1 s) · 1:32.28–2:15.62 (measured, dry run).
> Beat: building blocks: vector. Kind: relief locator map + station.

## s05_vector_field
Draw an arrow at every place, and you get a vector field. Here are the winds a little more than a kilometre above western Europe at that moment, as Storm Ciarán, a deep area of low pressure, was approaching. Over the sea west of France, the air was streaming towards the north-east at more than thirty metres per second. Arrows show the wind at a glance. But to calculate with them, we need numbers.

> 72 words · 5 sentences · 135.625–163.800 s (28.2 s; speech 26.0 s) · 2:15.62–2:43.80 (measured, dry run).
> Beat: building blocks: vector field. Kind: map (satellite + analysis).

## s06_basis
So let's set up three directions at Brest. One axis points east, one points north, and one points straight up, away from the ground. Along each axis we put a unit vector: an arrow exactly one unit long. We'll call them e one, e two and e three, for east, north and up. Here the small numbers one, two and three don't take part in any calculation. They just label the three directions. The three unit vectors are at right angles to each other, and together they're called a basis.

> 90 words · 7 sentences · 163.800–200.525 s (36.7 s; speech 33.8 s) · 2:43.80–3:20.53 (measured, dry run).
> Beat: building blocks: basis. Kind: 3-D diagram on terrain.

## s07_components_easy
Any arrow can be built from these three. Let's try an easy one first: a wind that blows six metres per second towards the east and eight towards the north. Walk six steps along e one, then eight along e two, and you arrive at the arrow's tip. These two numbers, six and eight, are the wind's components. This wind doesn't rise or sink, so its third component is zero. So the wind is six times e one, plus eight times e two, plus zero times e three.

> 88 words · 6 sentences · 200.525–234.500 s (34.0 s; speech 31.4 s) · 3:20.53–3:54.50 (measured, dry run).
> Beat: building blocks: components (easy numbers). Kind: 3-D diagram.

## s08_components_real
Now the real wind at Brest. It comes from one hundred and fifty degrees, measured clockwise from north, as seen from above. So the air moves the opposite way, towards three hundred and thirty degrees. How much of it moves east, and how much north? The east part is the speed times the sine of three hundred and thirty degrees, which is minus a half. So it's nine point three times minus a half: minus four point six five metres per second. The minus means the air moves partly towards the west. The north part is the speed times the cosine of three hundred and thirty degrees, about point eight six six. That gives eight point zero five metres per second. Meteorologists call the three components u, v and w, in plain letters: u towards the east, v towards the north, and w upwards. Near the ground, w is almost zero.

> 148 words · 11 sentences · 234.500–296.125 s (61.6 s; speech 57.3 s) · 3:54.50–4:56.12 (measured, dry run).
> Beat: building blocks: components (real wind). Kind: 2-D diagram + calculation.

## s09_up_component
A little more than a kilometre up, the reanalysis gives the up component too. Over Brest at this hour, the air was rising at about ten centimetres per second. That's more than three hundred times slower than the wind across the map, and it's why weather maps usually draw only the flat part of the wind. Still, this slow rising is what builds the clouds.

> 64 words · 4 sentences · 296.125–321.075 s (24.9 s; speech 23.1 s) · 4:56.12–5:21.07 (measured, dry run).
> Beat: building blocks: the up component. Kind: 3-D column.

## s10_magnitude
How long is the arrow? On a flat map, Pythagoras' theorem gives the length from two components: the square root of six squared plus eight squared, which is ten. In three dimensions, we use Pythagoras twice. First across the floor, to the point straight below the tip, and then up to the tip. So the length is the square root of the sum of all three components squared. The length is also called the magnitude, and we write it with a straight bar on each side of bold u. For the real wind at Brest, it's the square root of minus four point six five, squared, plus eight point zero five squared, plus zero squared. That's nine point three, the speed the station reported. So the magnitude of the wind vector is the wind speed.

> 128 words · 9 sentences · 321.075–371.675 s (50.6 s; speech 47.0 s) · 5:21.07–6:11.68 (measured, dry run).
> Beat: building blocks: magnitude. Kind: 3-D diagram + calculation.

## s11_other_axes
Now let's turn the axes and keep the arrow. Along Brittany's north coast, a forecaster might prefer one axis along the coast and one across it. Take the wind a kilometre up, which blew at thirty four metres per second. Measured along the east and north axes, its components are five point eight and thirty three point five. Measured along the coast and across it, they're eleven point five and thirty two. The components changed, because they depend on the axes we choose. But the arrow didn't move, and its length is thirty four either way. So a vector is the arrow itself, and its components describe it in one choice of axes. Its length is a scalar: it's the same in any axes. Turning axes, and the other coordinates we use on a round Earth, get their own movie later in the series.

> 144 words · 10 sentences · 371.675–430.125 s (58.4 s; speech 54.5 s) · 6:11.68–7:10.12 (measured, dry run).
> Beat: intuition: same arrow, other axes. Kind: map + diagram.

## s12_position
Places are vectors too. Put the origin of our axes at Brest airport. A weather balloon drifting above the town then has a position vector, x. Its components, x one, x two and x three, say how far east, how far north and how high the balloon is. So x is x one times e one, plus x two times e two, plus x three times e three. Say the balloon is three kilometres east, four kilometres north and one point two kilometres up. Then its components are three, four and one point two kilometres.

> 95 words · 7 sentences · 430.125–469.600 s (39.5 s; speech 36.6 s) · 7:10.12–7:49.60 (measured, dry run).
> Beat: building blocks: position vector. Kind: 3-D diagram.

## s12a_add_tip_to_tail
Now let's add vectors. Picture an airliner flying east at two hundred and fifty metres per second through the air. That's its airspeed: an arrow pointing east. But the air itself is moving. High up, a fast band of wind called the jet stream blows from the west. Say the jet blows at fifty metres per second, towards the east. How fast does the plane move over the ground? To find out, we put the wind's arrow with its tail at the tip of the plane's arrow. The arrow from the first tail to the last tip is the sum: three hundred metres per second, towards the east. This is called adding vectors tip to tail. Flying the other way, against the jet, the sum is only two hundred metres per second. That's why flights from North America to Europe are usually shorter than the flights back. On the day this video was made, the jet over the North Atlantic reached about sixty-five metres per second.

> 166 words · 13 sentences · 469.600–534.675 s (65.1 s; speech 60.1 s) · 7:49.60–8:54.67 (measured, dry run).
> Beat: addition: tip to tail (aircraft in the jet stream). Kind: map (latest data) + vector animation.

## s12b_add_parallelogram
What if the wind blows across the plane's path? Let the plane head north at two hundred and fifty metres per second, while the jet blows east at fifty. Tip to tail, the sum points a little east of north. Now add them the other way round: the wind first, then the plane. We reach the same tip. The two routes make the sides of a parallelogram, and the sum is its diagonal. Calling the plane's arrow p and the jet's arrow q, that's p plus q equals q plus p: the order of adding doesn't matter. In components, adding is easy: we add the east parts, and we add the north parts. Zero plus fifty is fifty towards the east, and two hundred and fifty plus zero is two hundred and fifty towards the north. By Pythagoras, the ground speed is about two hundred and fifty five metres per second. The ocean works the same way. A drifting buoy is carried by the current and pushed by the wind, so its velocity is the current's arrow plus the wind drift's arrow.

> 165 words · 12 sentences · 534.675–598.450 s (63.8 s; speech 59.1 s) · 8:54.67–9:58.45 (measured, dry run).
> Beat: addition: parallelogram and components. Kind: 2-D diagram + calculation.

## s12c_add_forces
Forces add like this too. Picture an air parcel near the ground, where three pushes act on each kilogram. The pressure push points towards low pressure, here straight north, with a size of twelve point five, in units of ten to the minus four metres per second squared. The Coriolis push is an apparent push, which appears because we measure the wind on a spinning Earth, and here it has components six and minus eight. Friction with the ground pulls back against the wind: minus six and minus four point five. Let's add them tip to tail. The east parts give zero plus six minus six, which is zero. The north parts give twelve point five minus eight minus four point five, also zero. The three arrows close into a triangle, so the total push is zero. That means the parcel's wind doesn't change: the three pushes balance. Here the wind blows towards the east-north-east, partly across the lines of equal pressure, towards the low. How each of these pushes arises gets its own movies later in the series.

> 164 words · 12 sentences · 598.450–667.500 s (69.0 s; speech 64.4 s) · 9:58.45–11:07.50 (measured, dry run).
> Beat: addition: forces on a parcel balance. Kind: diagram + calculation.

## s12d_add_geostrophic
Now a real map. Here's Ciarán at the same moment, with lines of equal pressure, called isobars, drawn every four hectopascals. A hectopascal is the unit weather maps use for pressure. If the pressure push and the Coriolis push balanced exactly, the wind would blow along the isobars. That imagined wind is called the geostrophic wind, and the geostrophic wind movie explains it in full. Over the Bay of Biscay, south of Brittany, it would blow seventeen point eight metres per second towards the east and twenty one towards the north. The real wind, ten metres above the sea, blew minus two point one towards the east, so a little west, and thirteen point four towards the north. The arrow we must add to the geostrophic wind to reach the real wind is called the ageostrophic wind. So the real wind is the geostrophic wind plus the ageostrophic wind. Here the ageostrophic part is large: minus nineteen point nine and minus seven point six. Friction with the sea slows the air and turns it across the isobars, towards the low pressure.

> 176 words · 11 sentences · 667.500–741.925 s (74.4 s; speech 70.1 s) · 11:07.50–12:21.92 (measured, dry run).
> Beat: addition: real = geostrophic + ageostrophic (Ciarán). Kind: map (satellite + analysis) + vectors.

## s12e_subtract_def
Now subtraction. First, the negative of a vector is the same arrow, turned to point the opposite way: minus q has every component of q, which we call q one and q two, with its sign flipped. To subtract q from p, we add minus q: p minus q equals p plus minus q. There's a handy picture too. Draw p and q from the same point. Then p minus q is the arrow from the tip of q to the tip of p. Let's check it: q plus that arrow lands on the tip of p, so q plus, p minus q, is p. With easy numbers, if p is five, one, and q is one, three, then p minus q is four, minus two.

> 118 words · 8 sentences · 741.925–787.675 s (45.8 s; speech 42.5 s) · 12:21.92–13:07.67 (measured, dry run).
> Beat: subtraction: definition. Kind: 2-D diagram + calculation.

## s12f_subtract_hour
Here's subtraction on a real map. A kilometre above Brest, at five o'clock universal time, the wind blew seven point six metres per second towards the east and twenty three point three towards the north. An hour later, at six, it blew five point eight towards the east and thirty three point five towards the north. How did the wind change in that hour? We subtract the old wind from the new one. East: five point eight minus seven point six is minus one point eight. North: thirty three point five minus twenty three point three is ten point two. On the map, the change is the arrow from the tip of the old wind to the tip of the new one, pointing a little west of north. In one hour, the wind grew stronger and swung towards the north, as Ciarán approached.

> 143 words · 9 sentences · 787.675–842.675 s (55.0 s; speech 51.4 s) · 13:07.67–14:02.67 (measured, dry run).
> Beat: subtraction: the wind's change in one hour (map animation). Kind: map data animation + vectors.

## s12g_shear_hodograph
Subtraction also measures wind shear: how the wind changes with height. This is a real weather balloon sounding from Trappes, near Paris, launched at midnight universal time on the first of November. Let's draw the wind at each height as an arrow from one shared point. Joining the arrow tips gives a curve called a hodograph. At eight hundred and fifty hectopascals, about one point four kilometres up, the wind blew thirteen point nine towards the east and nine point eight towards the north. At five hundred hectopascals, about five and a half kilometres up, it blew sixteen point four towards the east and four point four towards the north. The shear between them is the upper wind minus the lower wind: two point five towards the east and minus five point four towards the north, about six metres per second. On the hodograph, it's simply the arrow from the lower tip to the upper tip. Here the wind turns clockwise as we go up, seen from above. Forecasters read that as a sign of warm air being carried in, a link the thermal wind movie explains.

> 187 words · 10 sentences · 842.675–916.525 s (73.9 s; speech 69.9 s) · 14:02.67–15:16.52 (measured, dry run).
> Beat: subtraction: wind shear and the hodograph (real sounding). Kind: 3-D column + hodograph chart.

## s12h_anomaly
Climate scientists subtract vectors all the time. An anomaly is the difference between what happened and what's normal for that time of year. Normal here means the average over the thirty years from nineteen ninety one to twenty twenty, called the climatology. Over the equatorial Pacific Ocean, the trade winds normally blow from the east, towards Asia. This map shows the average wind for November in those thirty years. Next to it is November twenty twenty-three, during an El Niño, a warming of the tropical Pacific that shifts weather around the world. We call the average u bar and the anomaly u prime: subtract u bar from November twenty twenty-three, arrow by arrow, and the anomaly arrows point east. In the central Pacific, the normal wind blew about five metres per second towards the west, but in twenty twenty-three only about three point seven. So the anomaly is about one point three metres per second towards the east: the trade winds had weakened, as they do in an El Niño. El Niño gets its own long movie later in the series.

> 172 words · 10 sentences · 916.525–988.200 s (71.7 s; speech 67.7 s) · 15:16.52–16:28.20 (measured, dry run).
> Beat: subtraction: El Niño trade-wind anomaly (climate). Kind: map (climate) x3 + slider.

## s12i_relative
One more use: relative velocity. Storms move, and forecasters often want the wind as the storm itself feels it. Between six in the evening and midnight, Ciarán's centre moved about four hundred and fifty kilometres, mostly towards the east. Let's call the storm's velocity c: about twenty metres per second towards the east and five towards the north. The wind relative to the storm is u minus c: the wind minus the storm's velocity. A kilometre above Brest, that's five point eight minus twenty, about minus fourteen, towards the east, and thirty three point five minus five, about twenty eight, towards the north. So, seen from the moving storm, the air above Brest flows towards the north-north-west, round the storm's eastern side.

> 117 words · 7 sentences · 988.200–1039.975 s (51.8 s; speech 48.9 s) · 16:28.20–17:19.97 (measured, dry run).
> Beat: subtraction: storm-relative wind. Kind: map data animation + vectors.

## s13_naming
Now we have a naming problem. The wind's components are u, v and w, the position's are x, y and z, and the unit vectors have names of their own. With many vectors we'd run out of letters, and every equation would have to be written out three times. So let's number the directions instead: one for east, two for north and three for up. The wind's components become u one, u two and u three. Then we write u sub i. Sub means the small letter written below, and i stands for any of the numbers one, two or three. So u sub i is the whole list of the wind's components, in just two symbols. This way of writing is called index notation, and i is called an index.

> 131 words · 9 sentences · 1039.975–1091.100 s (51.1 s; speech 47.5 s) · 17:19.97–18:11.10 (measured, dry run).
> Beat: index notation: subscripts. Kind: equation animation.

## s14_free_index
An index that appears once in a term is called a free index. An equation with a free index is really three equations, one for each value. Remember the wind's change over an hour above Brest? In index notation, it's one line: the change, d sub i, equals u sub i at six, minus u sub i at five. For i equal to one, it says minus one point eight equals five point eight minus seven point six. For i equal to two, it says ten point two equals thirty three point five minus twenty three point three. And for i equal to three, it does the same for the up component. So one line holds three equations, and adding or subtracting vectors means adding or subtracting their components. The rule is that a free index must appear in every term, on both sides, so that every term has the same number of components.

> 152 words · 9 sentences · 1091.100–1150.975 s (59.9 s; speech 56.3 s) · 18:11.10–19:10.97 (measured, dry run).
> Beat: index notation: free index. Kind: map pair + equation.

## s15_dot_product
Now let's meet a product of two vectors. The dot product of two vectors, p and q, multiplies their matching components and adds the results: p one q one, plus p two q two, plus p three q three. The answer is a single number, a scalar. It measures how much two arrows point the same way: it's the shadow of one arrow on the other, times the other's length. Here's a weather example. How much of the wind blows along Brittany's coast? The unit vector along the coast has components zero point nine eight five, zero point one seven four, and zero. Its dot product with the wind is five point eight times zero point nine eight five, plus thirty three point five times zero point one seven four, plus zero. That's about eleven point five metres per second: the part along the coast that we measured a moment ago. So a dot product with a unit vector picks out the part of the wind along it. The dot product has a whole movie of its own in this series, where we take it apart fully.

> 187 words · 11 sentences · 1150.975–1223.075 s (72.1 s; speech 67.8 s) · 19:10.97–20:23.08 (measured, dry run).
> Beat: index notation: dot product (defined here, stand-alone). Kind: diagram + map + calculation.

## s16_summation
The dot product is a sum of three terms. With a sigma, the Greek capital letter for sum, we write it as the sum of p sub i times q sub i, for i from one to three. Look at the index i: it appears twice in the same term. Albert Einstein noticed that whenever an index appears twice like this, it's always summed. So he simply stopped writing the sigma. This is the Einstein summation convention. When an index is repeated in a term, we add up the terms for one, two and three, even though no sum sign is written. So p dot q is just p sub i q sub i.

> 114 words · 8 sentences · 1223.075–1265.500 s (42.4 s; speech 39.2 s) · 20:23.08–21:05.50 (measured, dry run).
> Beat: index notation: summation convention. Kind: equation animation.

## s17_dummy
A repeated index is called a dummy index, because its letter doesn't matter. p sub i q sub i and p sub j q sub j are exactly the same sum, just as a loop counter in a program can have any name. A term with no free index is a single number, a scalar. A term with one free index is a vector, three numbers. And one rule keeps everything safe: an index may appear at most twice in a term. Something like p sub i q sub i s sub i has no meaning, because we can't tell which pair to add up.

> 105 words · 5 sentences · 1265.500–1304.025 s (38.5 s; speech 36.3 s) · 21:05.50–21:44.03 (measured, dry run).
> Beat: index notation: dummy index and rules. Kind: equation animation.

## s18_length_index
Here's a quick use. The wind's length squared is u sub i times u sub i, the sum of its three components squared. For the wind a kilometre above Brest, that's five point eight squared, plus thirty three point five squared, plus about zero. That's about one thousand one hundred and fifty six. Its square root is thirty four metres per second, the length we saw before.

> 67 words · 5 sentences · 1304.025–1332.425 s (28.4 s; speech 26.2 s) · 21:44.03–22:12.42 (measured, dry run).
> Beat: index notation: length with indices. Kind: calculation.

## s19_three_reasons
So why write maths like this? There are three good reasons. The first is that it's short: one line can hold three equations, or even nine terms, as we'll see in a moment. The second is that it's safe: the rules for free and dummy indices catch mistakes, like adding an arrow to a single number, before we compute anything. The third is that it turns algebra into counting. With a special symbol that we'll meet soon, and a second one in the next movie, we can prove rules about vectors by checking indices, instead of drawing pictures.

> 98 words · 6 sentences · 1332.425–1370.875 s (38.5 s; speech 35.9 s) · 22:12.42–22:50.88 (measured, dry run).
> Beat: why: three good reasons. Kind: keywords.

## s20_gradient
Now let's see how index notation is used in weather. Our question: how fast was the wind bringing warmer air to Brest? First, we need to know how the temperature changes from place to place. Going east, it changes by some amount for every metre: that's partial capital T by partial x one. Here capital T stands for temperature, and partial means we move only east, while north and up stay fixed. Going north, it's partial T by partial x two, and going up, partial T by partial x three. In index notation, all three are partial T by partial x sub i. Together they make an arrow called the temperature gradient, read grad T. It points the way the temperature increases fastest. Partial derivatives and the gradient each get their own movie later in the series.

> 137 words · 10 sentences · 1370.875–1429.300 s (58.4 s; speech 54.5 s) · 22:50.88–23:49.30 (measured, dry run).
> Beat: application 1: temperature gradient. Kind: map + equation.

## s21_advection_built
Now picture an air parcel: a small volume of air that moves with the wind. In one second, the wind carries it u one metres east, so the temperature around it changes by u one times partial T by partial x one. Moving north adds u two times partial T by partial x two, and rising adds u three times partial T by partial x three. Adding the three, we get u sub j times partial T by partial x sub j, with the repeated index j summed. This is the dot product of the wind with grad T, and it's called the advection of temperature. Advection means being carried along by the flow. It tells us how fast the wind carries the parcel into warmer or colder places, in degrees per second.

> 133 words · 7 sentences · 1429.300–1482.225 s (52.9 s; speech 50.0 s) · 23:49.30–24:42.22 (measured, dry run).
> Beat: application 1: advection built term by term. Kind: map + equation animation.

## s22_advection_easy
Let's try easy numbers first. Suppose the wind blows ten metres per second towards the east and thirty towards the north. And suppose the temperature drops three degrees for every hundred kilometres east, and two degrees for every hundred kilometres north. A hundred kilometres is ten to the five metres, so the slopes are minus three and minus two, times ten to the minus five kelvin per metre. A kelvin step is the same size as a degree Celsius step. Leaving the up part aside for now, the sum is ten times minus three, plus thirty times minus two. That's minus ninety times ten to the minus five, or minus nine times ten to the minus four kelvin per second. Times three thousand six hundred seconds in an hour, it's about minus three point two kelvin per hour.

> 138 words · 8 sentences · 1482.225–1538.000 s (55.8 s; speech 52.5 s) · 24:42.22–25:38.00 (measured, dry run).
> Beat: application 1: easy numbers. Kind: diagram + calculation.

## s23_advection_sign
What does the minus sign mean? The wind blows towards colder places, so each parcel is carried from warmer air into colder air. Now turn it around, and stand still. The air arriving at a fixed place comes from the warmer side. So if each parcel keeps its own temperature, a thermometer fixed at that place warms by plus three point two kelvin per hour. This is called warm advection. In symbols, the fixed thermometer's rate is partial T by partial small t, where small t stands for time, and it equals minus u sub j times partial T by partial x sub j. Following a parcel like this is the subject of the material derivative movie, later in the series.

> 106 words · 8 sentences · 1538.000–1582.375 s (44.4 s; speech 41.1 s) · 25:38.00–26:22.38 (measured, dry run).
> Beat: application 1: what the sign means. Kind: diagram.

## s24_real_map
Now the real numbers. Here's the reanalysis temperature a little more than a kilometre up, at that same moment. Lines that join places with the same temperature are called isotherms, and here they're drawn every two degrees. They crowd together just south-west of Brest. That's where Ciarán's warm air is pushing north into the colder air ahead of it. Let's zoom in on Brest and read the map.

> 68 words · 6 sentences · 1582.375–1611.200 s (28.8 s; speech 26.3 s) · 26:22.38–26:51.20 (measured, dry run).
> Beat: application 1: the real map. Kind: map (data).

## s25_real_gradient
Going east from Brest, the temperature falls by three point two degrees in a hundred kilometres. Going north, it falls by two point five. So partial T by partial x one is minus three point two times ten to the minus five kelvin per metre. And partial T by partial x two is minus two point five times ten to the minus five. The grad T arrow points south-west, towards the warm air.

> 73 words · 5 sentences · 1611.200–1641.200 s (30.0 s; speech 27.8 s) · 26:51.20–27:21.20 (measured, dry run).
> Beat: application 1: reading the real gradient. Kind: map (zoomed) + calculation.

## s26_real_sum
The wind there blows five point eight metres per second towards the east and thirty three point five towards the north. Now the sum, term by term. The east term is five point eight times minus three point two times ten to the minus five. That's about minus one point nine times ten to the minus four kelvin per second. The north term is thirty three point five times minus two point five times ten to the minus five, about minus eight point four times ten to the minus four. Most of the effect comes from the strong wind from the south. Together, they make about minus one point zero times ten to the minus three kelvin per second, or minus three point seven kelvin per hour. So the air arriving over Brest was warmer, by about three point seven degrees for every hour.

> 144 words · 8 sentences · 1641.200–1696.675 s (55.5 s; speech 52.2 s) · 27:21.20–28:16.67 (measured, dry run).
> Beat: application 1: the real sum. Kind: map + calculation + bars.

## s27_real_check
Did Brest really warm up? In the reanalysis, the temperature at this height over Brest rose from two point four degrees at five o'clock to eight point two at seven. That's about two point nine degrees per hour, close to our estimate, but a little smaller. Most of the gap comes from the rising air, which cools as it expands, and our sum alone doesn't include that. Why rising air cools gets its own movie, on the thermodynamics of the atmosphere. Down at the ground, the station's thermometer climbed from ten point three to fourteen point nine degrees between six and eight o'clock. The edge of the warm air had arrived: forecasters call it a warm front.

> 117 words · 7 sentences · 1696.675–1743.425 s (46.8 s; speech 43.9 s) · 28:16.67–29:03.42 (measured, dry run).
> Beat: application 1: check against what happened. Kind: chart + map inset.

## s28_nine_terms
Index notation really shines when we follow the wind itself, because the wind carries its own motion along too. The advection of the wind is u sub j times partial u sub i by partial x sub j. It has one free index, i, so it's three equations. And it has one dummy index, j, so each equation has three terms. That's nine terms in one short line. For i equal to one, they read: u one times partial u one by partial x one, plus u two times partial u one by partial x two, plus u three times partial u one by partial x three. Weather forecast models work out all nine of these at millions of points, every few minutes. We'll read this term piece by piece in the second movie on vector identities.

> 137 words · 8 sentences · 1743.425–1798.650 s (55.2 s; speech 52.0 s) · 29:03.42–29:58.65 (measured, dry run).
> Beat: application 1: nine terms in one line. Kind: equation animation.

## s29_kronecker
Now for the first special symbol. Let's take dot products of our unit vectors with each other. East with east gives one, because a unit vector has length one. East with north gives zero, because they're at right angles. Doing all nine pairs, we get one whenever the two are the same, and zero whenever they're different. This pattern has its own name: the Kronecker delta, written delta i j. It's one if i equals j, and zero if i is not equal to j. As a table, it has ones along the diagonal and zeros everywhere else.

> 98 words · 8 sentences · 1798.650–1838.950 s (40.3 s; speech 37.0 s) · 29:58.65–30:38.95 (measured, dry run).
> Beat: Kronecker delta: from the basis. Kind: 3-D diagram + table.

## s30_substitution
The Kronecker delta has one very useful trick. Look at delta i j times u sub j, with j summed. Written out, it's delta i one times u one, plus delta i two times u two, plus delta i three times u three. For i equal to two, only delta two two is one, and the other two deltas are zero. So all that's left is u two. The same happens for every i. So delta i j times u sub j equals u sub i. The delta swaps the summed index j for its other index, i, and then it disappears.

> 102 words · 8 sentences · 1838.950–1879.475 s (40.5 s; speech 37.3 s) · 30:38.95–31:19.47 (measured, dry run).
> Beat: Kronecker delta: substitution. Kind: equation animation.

## s31_balloon_delta
Here's what that means for a weather balloon. Think of the east distance from Brest, x one, as a map: at each place, its value is how far east that place is. It grows by one metre for every metre east, and it doesn't change at all going north or up. So partial x sub i by partial x sub j is just delta i j. Now let the wind carry this map, exactly as it carried temperature. We get u sub j times partial x sub i by partial x sub j, which is u sub j times delta i j, which is u sub i. In words: as the balloon is carried along, its position changes at the wind's velocity. A kilometre above Brest, it would drift five point eight metres east and thirty three point five metres north every second, about one hundred and twenty kilometres north in an hour.

> 153 words · 8 sentences · 1879.475–1937.650 s (58.2 s; speech 54.9 s) · 31:19.47–32:17.65 (measured, dry run).
> Beat: Kronecker delta: the balloon drifts with the wind. Kind: map + equation.

## s32_delta_facts
Two more quick facts. Delta i i, with i summed, is one plus one plus one, which is three: the number of dimensions of space. And delta i j times p sub i q sub j turns a sum of nine terms into a sum of three, because it's just p dot q. The Kronecker delta comes back in the tensors movie, as the simplest tensor of all.

> 68 words · 4 sentences · 1937.650–1963.700 s (26.0 s; speech 24.2 s) · 32:17.65–32:43.70 (measured, dry run).
> Beat: Kronecker delta: two facts. Kind: equation animation.

## s33_recap
To sum up, a scalar is one number, like the temperature, and a vector is an arrow, like the wind. Its components are its steps along the unit vectors east, north and up, and its length, by Pythagoras, is the wind speed. The components change when we turn the axes, but the arrow and its length don't. Vectors add tip to tail, or component by component, and p minus q is the arrow from the tip of q to the tip of p: a wind change, a wind shear, or an anomaly. In index notation, u sub i stands for all three components, and a free index means three equations. A repeated index is summed: that's the Einstein convention, so u sub j times partial T by partial x sub j is the advection of temperature. Over Brest, it brought warmer air at about three point seven degrees per hour. The Kronecker delta is one for equal indices and zero otherwise, and it swaps one index for another.

> 168 words · 8 sentences · 1963.700–2029.950 s (66.2 s; speech 63.0 s) · 32:43.70–33:49.95 (measured, dry run).
> Beat: recap. Kind: recap montage.

## s34_next
There's one more special symbol, called the alternating tensor, and written epsilon i j k. With it, the cross product fits in one line, and so does the push that Earth's spin gives the wind. That's the next movie in this series, which starts exactly where this one stops.

> 49 words · 3 sentences · 2029.950–2049.825 s (19.9 s; speech 18.4 s) · 33:49.95–34:09.82 (measured, dry run).
> Beat: forward pointer to 1b (spoken bridge, no card). Kind: 3-D data cube + map inset.

## s35_end
This video is one of a series of related tutorials, so watch out for the others. They're made to help students of meteorology, atmospheric science and climate science, and anyone else who wants to learn not just these ideas, but the maths behind them too. The notebook for vectors and index notation, and the notebooks for the other concepts, are on the website that goes with this video.

> 59 words · 3 sentences · 2049.825–2073.975 s (24.2 s; speech 23.2 s) · 34:09.82–34:33.97 (measured, dry run).
> Beat: series end card (weather/climate ending, HOUSE_STYLE §3; fix loop 1 S23). Kind: end card.

> Total: 5172 words · 335 sentences · 2073.975 s narration · 2076.475 s movie (34:36.47) · 149.4 words per minute.
