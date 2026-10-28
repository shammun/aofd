# ch00_vectors_index_notation — narration (movie-director, 2026-10-27)

Series plan v2 #1. House style `movies/HOUSE_STYLE.md` (reference `ch00_dot_product_why` v6). Voice Kokoro `af_bella`,
speed 1.0. Chapter-0 informal voice; our own words; maths spoken in words.

**Measured, not estimated.** `tools/tts.py` dry run on 2026-10-27 into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_vectors_index_notation/dryrun/v3` (input = this narration, current `movies/lexicon.yaml`, not edited): **71 scenes, 538 sentences, 8434 words, 3389.300 s narration + 2.5-s silent end-card hold = 3391.800 s (56:31.80)**; speech alone 3169.2 s = 159.7 words per minute while speaking, **149.2 words per minute overall** (limit 150); 836 caption cues; self-check {'expected_s': 3389.3, 'audio_s': 3389.3, 'diff_ms': -0.0, 'len_ok': True, 'cues_ok': True}; warnings: ['cue 761: 7.5 s / 2 lines out of house limits'].

**Spoken-letter rules.** No lone vector "a" anywhere (vectors are p, q, s, u, x, Omega). Indices are spoken "u sub i", "delta i j", "epsilon i j k"; the unit vector up is "k hat" (s58) so it never collides with the index k. The wind's change in s14 is "c sub i", not "delta", so delta always means the Kronecker delta.

**Pronunciations to check in the render (lexicon not edited; proposed entries):** Kronecker (`[Kronecker](/kɹˈOnɛkəɹ/)`), epsilon (`[epsilon](/ˈɛpsɪlɑn/)`), parallelepiped (`[parallelepiped](/pˌæɹəlˌɛləpˈIpɪd/)`), Ciarán (exists), ERA5 (exists), Brest (reads correctly), Saint-Malo (`[Saint-Malo](/sˌæn mˈɑlO/)`), Guipavas (not spoken), "sub" (check it is not read as "S U B"), "k hat", "e one" (check "e" is the letter name, not a schwa).

**Cross-references (user rule 2026-10-27).** Short spoken pointers to the movies that treat an operator in depth: s12c Coriolis, geostrophic wind and friction (#29, #30, #31), s12d geostrophic wind (#30), s12g thermal wind (#32), s12h El Niño (#62), s11 coordinates (#5), s15 dot product (#0.1), s20 partial derivatives (#4) and gradient (#6), s23 material derivative (#10), s27 thermodynamics (#24), s28 vector identities II (#10B), s32 tensors (#11), s33 Coriolis (#29), s34 cross product (#2, #3), s42 geostrophic wind (#30), s54 divergence (#7), s57 vector identities (#10A, #10B), s59 Coriolis (#29). Listed again on the end card; `related:` per scene in storyboard.yaml.

Lines starting with ">" are notes and are not spoken. Times are the measured scene start–end (s).

## s00_title
In this video, we'll learn vectors and index notation the easy way, and see how meteorology uses them to write the wind, the warmth it carries, and the push of Earth's spin in a few short symbols.

> 37 words · 1 sentences · 0.300–14.125 s (13.8 s; speech 13.0 s) · 0:00.30–0:14.12 (measured, dry run).
> Beat: opening title. Kind: 3-D diagram + map, data animation.

## s01_hook
What are vectors and index notation? Let's see what they are, why they're built this way, and what they tell us about the wind.

> 24 words · 2 sentences · 14.125–23.625 s (9.5 s; speech 8.3 s) · 0:14.12–0:23.62 (measured, dry run).
> Beat: hook question. Kind: globe + wind particles.

## s02_scalar_globe
Let's start with temperature. This globe shows the air temperature two metres above the ground all over the Earth, at six in the evening, universal time, on the first of November twenty twenty-three. Universal time is the one clock that weather services share around the world. The map comes from a reanalysis, called ERA5: a best estimate of the whole atmosphere, made by blending millions of observations into a weather model. At every place, the temperature is a single number. At Brest, a port at the western tip of France, the weather station read ten point three degrees Celsius.

> 99 words · 6 sentences · 23.625–66.875 s (43.2 s; speech 40.7 s) · 0:23.62–1:06.88 (measured, dry run).
> Beat: building blocks: scalar. Kind: globe (data).

## s03_scalar_word
A quantity like this, one number with a unit and nothing more, is called a scalar. Pressure, density and humidity are scalars too. Because the temperature has a value at every place, the whole map is called a scalar field. And a scalar doesn't care which way you face. Turn around on the same spot, and the thermometer still reads ten point three.

> 63 words · 5 sentences · 66.875–92.750 s (25.9 s; speech 23.7 s) · 1:06.88–1:32.75 (measured, dry run).
> Beat: building blocks: scalar defined. Kind: globe + keywords.

## s04_vector_wind
Now let's look at the wind, at the same place and the same moment. The station at Brest reported a wind of nine point three metres per second, from the south-south-east. A single number can't describe this. We need to know how fast the air moves, and which way it goes. A quantity with a size and a direction is called a vector, and we draw it as an arrow. The arrow's length shows the speed, and the arrow points the way the air is moving. Careful, though: weather reports give the direction the wind comes from. This wind comes from the south-south-east, so the air moves towards the north-north-west.

> 110 words · 8 sentences · 92.750–136.100 s (43.3 s; speech 40.1 s) · 1:32.75–2:16.10 (measured, dry run).
> Beat: building blocks: vector. Kind: relief locator map + station.

## s05_vector_field
Draw an arrow at every place, and you get a vector field. Here are the winds a little more than a kilometre above western Europe at that moment, as Storm Ciarán, a deep area of low pressure, was approaching. Over the sea west of France, the air was streaming north at more than thirty metres per second. Arrows show the wind at a glance. But to calculate with them, we need numbers.

> 72 words · 5 sentences · 136.100–164.275 s (28.2 s; speech 26.0 s) · 2:16.10–2:44.28 (measured, dry run).
> Beat: building blocks: vector field. Kind: map (satellite + analysis).

## s06_basis
So let's set up three directions at Brest. One axis points east, one points north, and one points straight up, away from the ground. Along each axis we put a unit vector: an arrow exactly one unit long. We'll call them e one, e two and e three, for east, north and up. Here the small numbers one, two and three don't take part in any calculation. They just label the three directions. The three unit vectors are at right angles to each other, and together they're called a basis.

> 90 words · 7 sentences · 164.275–201.000 s (36.7 s; speech 33.8 s) · 2:44.28–3:21.00 (measured, dry run).
> Beat: building blocks: basis. Kind: 3-D diagram on terrain.

## s07_components_easy
Any arrow can be built from these three. Let's try an easy one first: a wind that blows six metres per second towards the east and eight towards the north. Walk six steps along e one, then eight along e two, and you arrive at the arrow's tip. These two numbers, six and eight, are the wind's components. This wind doesn't rise or sink, so its third component is zero. So the wind is six times e one, plus eight times e two, plus zero times e three.

> 88 words · 6 sentences · 201.000–234.975 s (34.0 s; speech 31.4 s) · 3:21.00–3:54.97 (measured, dry run).
> Beat: building blocks: components (easy numbers). Kind: 3-D diagram.

## s08_components_real
Now the real wind at Brest. It comes from one hundred and fifty degrees, measured clockwise from north, as seen from above. So the air moves the opposite way, towards three hundred and thirty degrees. How much of it moves east, and how much north? The east part is the speed times the sine of three hundred and thirty degrees, which is minus a half. So it's nine point three times minus a half: minus four point six five metres per second. The minus means the air moves partly towards the west. The north part is the speed times the cosine of three hundred and thirty degrees, about point eight six six. That gives eight point zero five metres per second. Meteorologists call the three components u, v and w: u towards the east, v towards the north, and w upwards. Near the ground, w is almost zero.

> 148 words · 11 sentences · 234.975–296.600 s (61.6 s; speech 57.3 s) · 3:54.97–4:56.60 (measured, dry run).
> Beat: building blocks: components (real wind). Kind: 2-D diagram + calculation.

## s09_up_component
A little more than a kilometre up, the reanalysis gives the up component too. Over Brest at this hour, the air was rising at about ten centimetres per second. That's around three hundred times slower than the wind across the map, and it's why weather maps usually draw only the flat part of the wind. Still, this slow rising is what builds the clouds.

> 64 words · 4 sentences · 296.600–321.550 s (24.9 s; speech 23.1 s) · 4:56.60–5:21.55 (measured, dry run).
> Beat: building blocks: the up component. Kind: 3-D column.

## s10_magnitude
How long is the arrow? On a flat map, Pythagoras' theorem gives the length from two components: the square root of six squared plus eight squared, which is ten. In three dimensions, we use Pythagoras twice. First across the floor, to the point straight below the tip, and then up to the tip. So the length is the square root of the sum of all three components squared. The length is also called the magnitude, and we write it with two straight bars. For the real wind at Brest, it's the square root of four point six five squared, plus eight point zero five squared, plus zero squared. That's nine point three, the speed the station reported. So the magnitude of the wind vector is the wind speed.

> 128 words · 9 sentences · 321.550–372.150 s (50.6 s; speech 47.0 s) · 5:21.55–6:12.15 (measured, dry run).
> Beat: building blocks: magnitude. Kind: 3-D diagram + calculation.

## s11_other_axes
Now let's turn the axes and keep the arrow. Along Brittany's north coast, a forecaster might prefer one axis along the coast and one across it. Take the wind a kilometre up, which blew at thirty four metres per second. Measured along the east and north axes, its components are five point eight and thirty three point five. Measured along the coast and across it, they're eleven point five and thirty two. The components changed, because they depend on the axes we choose. But the arrow didn't move, and its length is thirty four either way. So a vector is the arrow itself, and its components describe it in one choice of axes. Its length is a scalar: it's the same in any axes. Turning axes, and the other coordinates we use on a round Earth, get their own movie later in the series.

> 144 words · 10 sentences · 372.150–430.600 s (58.5 s; speech 54.5 s) · 6:12.15–7:10.60 (measured, dry run).
> Beat: intuition: same arrow, other axes. Kind: map + diagram.

## s12_position
Places are vectors too. Put the origin of our axes at Brest airport. A weather balloon drifting above the town then has a position vector, x. Its components, x one, x two and x three, say how far east, how far north and how high the balloon is. So x is x one times e one, plus x two times e two, plus x three times e three. Say the balloon is three kilometres east, four kilometres north and one point two kilometres up. Then its components are three, four and one point two kilometres.

> 95 words · 7 sentences · 430.600–470.075 s (39.5 s; speech 36.6 s) · 7:10.60–7:50.07 (measured, dry run).
> Beat: building blocks: position vector. Kind: 3-D diagram.

## s12a_add_tip_to_tail
Now let's add vectors. Picture an airliner flying east at two hundred and fifty metres per second through the air. That's its airspeed: an arrow pointing east. But the air itself is moving. High up, a fast band of wind called the jet stream blows from the west. Say the jet blows at fifty metres per second, towards the east. How fast does the plane move over the ground? To find out, we put the wind's arrow with its tail at the tip of the plane's arrow. The arrow from the first tail to the last tip is the sum: three hundred metres per second, towards the east. This is called adding vectors tip to tail. Flying the other way, against the jet, the sum is only two hundred metres per second. That's why flights from North America to Europe are usually shorter than the flights back. On the day this video was made, the jet over the North Atlantic reached about seventy metres per second.

> 166 words · 13 sentences · 470.075–535.150 s (65.1 s; speech 60.1 s) · 7:50.07–8:55.15 (measured, dry run).
> Beat: addition: tip to tail (aircraft in the jet stream). Kind: map (latest data) + vector animation.

## s12b_add_parallelogram
What if the wind blows across the plane's path? Let the plane head north at two hundred and fifty metres per second, while the jet blows east at fifty. Tip to tail, the sum points a little east of north. Now add them the other way round: the wind first, then the plane. We reach the same tip. The two routes make the sides of a parallelogram, and the sum is its diagonal. So the order of adding doesn't matter. In components, adding is easy: we add the east parts, and we add the north parts. Zero plus fifty is fifty towards the east, and two hundred and fifty plus zero is two hundred and fifty towards the north. By Pythagoras, the ground speed is about two hundred and fifty five metres per second. The ocean works the same way. A drifting buoy is carried by the current and pushed by the wind, so its velocity is the current's arrow plus the wind drift's arrow.

> 165 words · 12 sentences · 535.150–598.925 s (63.8 s; speech 59.1 s) · 8:55.15–9:58.92 (measured, dry run).
> Beat: addition: parallelogram and components. Kind: 2-D diagram + calculation.

## s12c_add_forces
Forces add like this too. Picture an air parcel near the ground, where three pushes act on each kilogram. The pressure push points towards low pressure, here straight north, with a size of twelve point five, in units of ten to the minus four metres per second squared. The Coriolis push, from Earth's spin, has components six and minus eight. Friction with the ground pulls back against the wind: minus six and minus four point five. Let's add them tip to tail. The east parts give zero plus six minus six, which is zero. The north parts give twelve point five minus eight minus four point five, also zero. The three arrows close into a triangle, so the total push is zero. That means the parcel's wind doesn't change: the three pushes balance. Here the wind blows towards the east-north-east, partly across the lines of equal pressure, towards the low. How each of these pushes arises gets its own movies later in the series.

> 164 words · 12 sentences · 598.925–667.975 s (69.1 s; speech 64.4 s) · 9:58.92–11:07.98 (measured, dry run).
> Beat: addition: forces on a parcel balance. Kind: diagram + calculation.

## s12d_add_geostrophic
Now a real map. Here's Ciarán at the same moment, with lines of equal pressure, called isobars, drawn every four hectopascals. A hectopascal is the unit weather maps use for pressure. If the pressure push and the Coriolis push balanced exactly, the wind would blow along the isobars. That imagined wind is called the geostrophic wind, and the geostrophic wind movie explains it in full. Over the sea just west of Brest, it would blow thirty point nine metres per second towards the east and twenty four point nine towards the north. The real wind, ten metres above the sea, blew ten towards the east and eighteen towards the north. The arrow we must add to the geostrophic wind to reach the real wind is called the ageostrophic wind. So the real wind is the geostrophic wind plus the ageostrophic wind. Here the ageostrophic part is large, about minus twenty one and minus seven. Friction with the sea slows the air and turns it across the isobars, and the air is racing round a tight curve.

> 176 words · 11 sentences · 667.975–742.400 s (74.4 s; speech 70.1 s) · 11:07.98–12:22.40 (measured, dry run).
> Beat: addition: real = geostrophic + ageostrophic (Ciarán). Kind: map (satellite + analysis) + vectors.

## s12e_subtract_def
Now subtraction. First, the negative of a vector is the same arrow, turned to point the opposite way: minus q has every component of q with its sign flipped. To subtract q from p, we add minus q: p minus q equals p plus minus q. There's a handy picture too. Draw p and q from the same point. Then p minus q is the arrow from the tip of q to the tip of p. Let's check it: q plus that arrow lands on the tip of p, so q plus, p minus q, is p. With easy numbers, if p is five, one, and q is one, three, then p minus q is four, minus two.

> 118 words · 8 sentences · 742.400–788.150 s (45.8 s; speech 42.5 s) · 12:22.40–13:08.15 (measured, dry run).
> Beat: subtraction: definition. Kind: 2-D diagram + calculation.

## s12f_subtract_hour
Here's subtraction on a real map. A kilometre above Brest, at five o'clock universal time, the wind blew seven point six metres per second towards the east and twenty three point three towards the north. An hour later, at six, it blew five point eight towards the east and thirty three point five towards the north. How did the wind change in that hour? We subtract the old wind from the new one. East: five point eight minus seven point six is minus one point eight. North: thirty three point five minus twenty three point three is ten point two. On the map, the change is the arrow from the tip of the old wind to the tip of the new one, pointing a little west of north. In one hour, the wind grew stronger and swung towards the north, as Ciarán approached.

> 143 words · 9 sentences · 788.150–843.150 s (55.0 s; speech 51.4 s) · 13:08.15–14:03.15 (measured, dry run).
> Beat: subtraction: the wind's change in one hour (map animation). Kind: map data animation + vectors.

## s12g_shear_hodograph
Subtraction also measures wind shear: how the wind changes with height. This is a real weather balloon sounding from Trappes, near Paris, launched at midnight universal time on the first of November. Let's draw the wind at each height as an arrow from one shared point. Joining the arrow tips gives a curve called a hodograph. At eight hundred and fifty hectopascals, about one point four kilometres up, the wind blew thirteen point nine towards the east and nine point eight towards the north. At five hundred hectopascals, about five and a half kilometres up, it blew sixteen point four towards the east and four point four towards the north. The shear between them is the upper wind minus the lower wind: two point five towards the east and minus five point four towards the north, about six metres per second. On the hodograph, it's simply the arrow from the lower tip to the upper tip. Here the wind turns clockwise as we go up, seen from above. Forecasters read that as a sign of warm air being carried in, a link the thermal wind movie explains.

> 187 words · 10 sentences · 843.150–917.000 s (73.9 s; speech 69.9 s) · 14:03.15–15:17.00 (measured, dry run).
> Beat: subtraction: wind shear and the hodograph (real sounding). Kind: 3-D column + hodograph chart.

## s12h_anomaly
Climate scientists subtract vectors all the time. An anomaly is the difference between what happened and what's normal for that time of year. Normal here means the average over the thirty years from nineteen ninety one to twenty twenty, called the climatology. Over the equatorial Pacific Ocean, the trade winds normally blow from the east, towards Asia. This map shows the average wind for November in those thirty years. Next to it is November twenty twenty-three, during an El Niño, a warming of the tropical Pacific that shifts weather around the world. Subtract the climatology from November twenty twenty-three, arrow by arrow, and the anomaly arrows point east. In the central Pacific, the normal wind blew about six metres per second towards the west, but in twenty twenty-three only about three and a half. So the anomaly is about two and a half metres per second towards the east: the trade winds had weakened, as they do in an El Niño. El Niño gets its own long movie later in the series.

> 172 words · 10 sentences · 917.000–988.675 s (71.7 s; speech 67.7 s) · 15:17.00–16:28.67 (measured, dry run).
> Beat: subtraction: El Niño trade-wind anomaly (climate). Kind: map (climate) x3 + slider.

## s12i_relative
One more use: relative velocity. Storms move, and forecasters often want the wind as the storm itself feels it. Between six in the evening and midnight, Ciarán's centre moved about four hundred and fifty kilometres, mostly towards the east. That's a velocity of about twenty metres per second towards the east and five towards the north. The wind relative to the storm is the wind minus the storm's velocity. A kilometre above Brest, that's five point eight minus twenty, about minus fourteen, towards the east, and thirty three point five minus five, about twenty eight, towards the north. So, seen from the moving storm, the air above Brest flows towards the north-north-west, round the storm's eastern side.

> 117 words · 7 sentences · 988.675–1040.450 s (51.8 s; speech 48.9 s) · 16:28.67–17:20.45 (measured, dry run).
> Beat: subtraction: storm-relative wind. Kind: map data animation + vectors.

## s13_naming
Now we have a naming problem. The wind's components are u, v and w, the position's are x, y and z, and the unit vectors have names of their own. With many vectors we'd run out of letters, and every equation would have to be written out three times. So let's number the directions instead: one for east, two for north and three for up. The wind's components become u one, u two and u three. Then we write u sub i. Sub means the small letter written below, and i stands for any of the numbers one, two or three. So u sub i is the whole list of the wind's components, in just two symbols. This way of writing is called index notation, and i is called an index.

> 131 words · 9 sentences · 1040.450–1091.575 s (51.1 s; speech 47.5 s) · 17:20.45–18:11.58 (measured, dry run).
> Beat: index notation: subscripts. Kind: equation animation.

## s14_free_index
An index that appears once in a term is called a free index. An equation with a free index is really three equations, one for each value. Remember the wind's change over an hour above Brest? In index notation, it's one line: c sub i equals u sub i at six, minus u sub i at five. For i equal to one, it says minus one point eight equals five point eight minus seven point six. For i equal to two, it says ten point two equals thirty three point five minus twenty three point three. And for i equal to three, it does the same for the up component. So one line holds three equations, and adding or subtracting vectors means adding or subtracting their components. The rule is that a free index must appear in every term, on both sides, so that every term has the same number of components.

> 152 words · 9 sentences · 1091.575–1151.450 s (59.9 s; speech 56.3 s) · 18:11.58–19:11.45 (measured, dry run).
> Beat: index notation: free index. Kind: map pair + equation.

## s15_dot_product
Now let's meet a product of two vectors. The dot product of two vectors, p and q, multiplies their matching components and adds the results: p one q one, plus p two q two, plus p three q three. The answer is a single number, a scalar. It measures how much two arrows point the same way: it's the shadow of one arrow on the other, times the other's length. Here's a weather example. How much of the wind blows along Brittany's coast? The unit vector along the coast has components zero point nine eight five, zero point one seven four, and zero. Its dot product with the wind is five point eight times zero point nine eight five, plus thirty three point five times zero point one seven four, plus zero. That's about eleven point five metres per second: the part along the coast that we measured a moment ago. So a dot product with a unit vector picks out the part of the wind along it. The dot product has a whole movie of its own in this series, where we take it apart fully.

> 187 words · 11 sentences · 1151.450–1223.550 s (72.1 s; speech 67.8 s) · 19:11.45–20:23.55 (measured, dry run).
> Beat: index notation: dot product (defined here, stand-alone). Kind: diagram + map + calculation.

## s16_summation
The dot product is a sum of three terms. With a sigma, the Greek capital letter for sum, we write it as the sum of p sub i times q sub i, for i from one to three. Look at the index i: it appears twice in the same term. Albert Einstein noticed that whenever an index appears twice like this, it's always summed. So he simply stopped writing the sigma. This is the Einstein summation convention. When an index is repeated in a term, we add up the terms for one, two and three, even though no sum sign is written. So p dot q is just p sub i q sub i.

> 114 words · 8 sentences · 1223.550–1265.975 s (42.4 s; speech 39.2 s) · 20:23.55–21:05.97 (measured, dry run).
> Beat: index notation: summation convention. Kind: equation animation.

## s17_dummy
A repeated index is called a dummy index, because its letter doesn't matter. p sub i q sub i and p sub j q sub j are exactly the same sum, just as a loop counter in a program can have any name. A term with no free index is a single number, a scalar. A term with one free index is a vector, three numbers. And one rule keeps everything safe: an index may appear at most twice in a term. Something like p sub i q sub i s sub i has no meaning, because we can't tell which pair to add up.

> 105 words · 5 sentences · 1265.975–1304.500 s (38.5 s; speech 36.3 s) · 21:05.97–21:44.50 (measured, dry run).
> Beat: index notation: dummy index and rules. Kind: equation animation.

## s18_length_index
Here's a quick use. The wind's length squared is u sub i times u sub i, the sum of its three components squared. For the wind a kilometre above Brest, that's five point eight squared, plus thirty three point five squared, plus about zero. That's about one thousand one hundred and fifty six. Its square root is thirty four metres per second, the length we saw before.

> 67 words · 5 sentences · 1304.500–1332.900 s (28.4 s; speech 26.2 s) · 21:44.50–22:12.90 (measured, dry run).
> Beat: index notation: length with indices. Kind: calculation.

## s19_three_reasons
So why write maths like this? There are three good reasons. The first is that it's short: one line can hold three equations, or even nine terms, as we'll see in a moment. The second is that it's safe: the rules for free and dummy indices catch mistakes, like adding an arrow to a single number, before we compute anything. The third is that it turns algebra into counting. With two special symbols, which we'll meet soon, we can prove rules about vectors by checking indices, instead of drawing pictures.

> 90 words · 6 sentences · 1332.900–1369.825 s (36.9 s; speech 34.4 s) · 22:12.90–22:49.83 (measured, dry run).
> Beat: why: three good reasons. Kind: keywords.

## s20_gradient
Now let's see how index notation is used in weather. Our question: how fast was the wind bringing warmer air to Brest? First, we need to know how the temperature changes from place to place. Going east, it changes by some amount for every metre: that's partial capital T by partial x one. Here capital T stands for temperature, and partial means we move only east, while north and up stay fixed. Going north, it's partial T by partial x two, and going up, partial T by partial x three. In index notation, all three are partial T by partial x sub i. Together they make an arrow called the temperature gradient, read grad T. It points the way the temperature increases fastest. Partial derivatives and the gradient each get their own movie later in the series.

> 137 words · 10 sentences · 1369.825–1428.250 s (58.4 s; speech 54.5 s) · 22:49.83–23:48.25 (measured, dry run).
> Beat: application 1: temperature gradient. Kind: map + equation.

## s21_advection_built
Now picture an air parcel: a small volume of air that moves with the wind. In one second, the wind carries it u one metres east, so the temperature around it changes by u one times partial T by partial x one. Moving north adds u two times partial T by partial x two, and rising adds u three times partial T by partial x three. Adding the three, we get u sub j times partial T by partial x sub j, with the repeated index j summed. This is the dot product of the wind with grad T, and it's called the advection of temperature. Advection means being carried along by the flow. It tells us how fast the wind carries the parcel into warmer or colder places, in degrees per second.

> 133 words · 7 sentences · 1428.250–1481.175 s (52.9 s; speech 50.0 s) · 23:48.25–24:41.17 (measured, dry run).
> Beat: application 1: advection built term by term. Kind: map + equation animation.

## s22_advection_easy
Let's try easy numbers first. Suppose the wind blows ten metres per second towards the east and thirty towards the north. And suppose the temperature drops three degrees for every hundred kilometres east, and two degrees for every hundred kilometres north. A hundred kilometres is ten to the five metres, so the slopes are minus three and minus two, times ten to the minus five kelvin per metre. A kelvin step is the same size as a degree Celsius step. Leaving the up part aside for now, the sum is ten times minus three, plus thirty times minus two. That's minus ninety times ten to the minus five, or minus nine times ten to the minus four kelvin per second. Times three thousand six hundred seconds in an hour, it's about minus three point two kelvin per hour.

> 138 words · 8 sentences · 1481.175–1536.950 s (55.8 s; speech 52.5 s) · 24:41.17–25:36.95 (measured, dry run).
> Beat: application 1: easy numbers. Kind: diagram + calculation.

## s23_advection_sign
What does the minus sign mean? The wind blows towards colder places, so each parcel is carried from warmer air into colder air. Now turn it around, and stand still. The air arriving at a fixed place comes from the warmer side. So if each parcel keeps its own temperature, a thermometer fixed at that place warms by plus three point two kelvin per hour. This is called warm advection. In symbols, the fixed thermometer's rate is minus u sub j times partial T by partial x sub j. Following a parcel like this is the subject of the material derivative movie, later in the series.

> 106 words · 8 sentences · 1536.950–1581.325 s (44.4 s; speech 41.1 s) · 25:36.95–26:21.33 (measured, dry run).
> Beat: application 1: what the sign means. Kind: diagram.

## s24_real_map
Now the real numbers. Here's the reanalysis temperature a little more than a kilometre up, at that same moment. Lines that join places with the same temperature are called isotherms, and here they're drawn every two degrees. They crowd together just south-west of Brest. That's where Ciarán's warm air is pushing north into the colder air ahead of it. Let's zoom in on Brest and read the map.

> 68 words · 6 sentences · 1581.325–1610.150 s (28.8 s; speech 26.3 s) · 26:21.33–26:50.15 (measured, dry run).
> Beat: application 1: the real map. Kind: map (data).

## s25_real_gradient
Going east from Brest, the temperature falls by three point two degrees in a hundred kilometres. Going north, it falls by two point five. So partial T by partial x one is minus three point two times ten to the minus five kelvin per metre. And partial T by partial x two is minus two point five times ten to the minus five. The grad T arrow points south-west, towards the warm air.

> 73 words · 5 sentences · 1610.150–1640.150 s (30.0 s; speech 27.8 s) · 26:50.15–27:20.15 (measured, dry run).
> Beat: application 1: reading the real gradient. Kind: map (zoomed) + calculation.

## s26_real_sum
The wind there blows five point eight metres per second towards the east and thirty three point five towards the north. Now the sum, term by term. The east term is five point eight times minus three point two times ten to the minus five. That's about minus one point nine times ten to the minus four kelvin per second. The north term is thirty three point five times minus two point five times ten to the minus five, about minus eight point four times ten to the minus four. Most of the effect comes from the strong wind from the south. Together, they make about minus one point zero times ten to the minus three kelvin per second, or minus three point seven kelvin per hour. So the air arriving over Brest was warmer, by about three point seven degrees for every hour.

> 144 words · 8 sentences · 1640.150–1695.625 s (55.5 s; speech 52.2 s) · 27:20.15–28:15.62 (measured, dry run).
> Beat: application 1: the real sum. Kind: map + calculation + bars.

## s27_real_check
Did Brest really warm up? In the reanalysis, the temperature at this height over Brest rose from two point four degrees at five o'clock to eight point two at seven. That's about two point nine degrees per hour, close to our estimate, but a little smaller. Most of the gap comes from the rising air, which cools as it expands, and our sum alone doesn't include that. Why rising air cools gets its own movie, on the thermodynamics of the atmosphere. Down at the ground, the station's thermometer climbed from ten point three to fourteen point nine degrees between six and eight o'clock. The edge of the warm air had arrived: forecasters call it a warm front.

> 117 words · 7 sentences · 1695.625–1742.375 s (46.8 s; speech 43.9 s) · 28:15.62–29:02.38 (measured, dry run).
> Beat: application 1: check against what happened. Kind: chart + map inset.

## s28_nine_terms
Index notation really shines when we follow the wind itself, because the wind carries its own motion along too. The advection of the wind is u sub j times partial u sub i by partial x sub j. It has one free index, i, so it's three equations. And it has one dummy index, j, so each equation has three terms. That's nine terms in one short line. For i equal to one, they read: u one times partial u one by partial x one, plus u two times partial u one by partial x two, plus u three times partial u one by partial x three. Weather forecast models work out all nine of these at millions of points, every few minutes. We'll read this term piece by piece in the second movie on vector identities.

> 137 words · 8 sentences · 1742.375–1797.600 s (55.2 s; speech 52.0 s) · 29:02.38–29:57.60 (measured, dry run).
> Beat: application 1: nine terms in one line. Kind: equation animation.

## s29_kronecker
Now for the first special symbol. Let's take dot products of our unit vectors with each other. East with east gives one, because a unit vector has length one. East with north gives zero, because they're at right angles. Doing all nine pairs, we get one whenever the two are the same, and zero whenever they're different. This pattern has its own name: the Kronecker delta, written delta i j. It's one if i equals j, and zero if i is not equal to j. As a table, it has ones along the diagonal and zeros everywhere else.

> 98 words · 8 sentences · 1797.600–1837.900 s (40.3 s; speech 37.0 s) · 29:57.60–30:37.90 (measured, dry run).
> Beat: Kronecker delta: from the basis. Kind: 3-D diagram + table.

## s30_substitution
The Kronecker delta has one very useful trick. Look at delta i j times u sub j, with j summed. Written out, it's delta i one times u one, plus delta i two times u two, plus delta i three times u three. For i equal to two, only delta two two is one, and the other two deltas are zero. So all that's left is u two. The same happens for every i. So delta i j times u sub j equals u sub i. The delta swaps the summed index j for its other index, i, and then it disappears.

> 102 words · 8 sentences · 1837.900–1878.425 s (40.5 s; speech 37.3 s) · 30:37.90–31:18.42 (measured, dry run).
> Beat: Kronecker delta: substitution. Kind: equation animation.

## s31_balloon_delta
Here's what that means for a weather balloon. Think of the east distance from Brest, x one, as a map: at each place, its value is how far east that place is. It grows by one metre for every metre east, and it doesn't change at all going north or up. So partial x sub i by partial x sub j is just delta i j. Now let the wind carry this map, exactly as it carried temperature. We get u sub j times partial x sub i by partial x sub j, which is u sub j times delta i j, which is u sub i. In words: as the balloon is carried along, its position changes at the wind's velocity. A kilometre above Brest, it would drift five point eight metres east and thirty three point five metres north every second, about one hundred and twenty kilometres north in an hour.

> 153 words · 8 sentences · 1878.425–1936.600 s (58.2 s; speech 54.9 s) · 31:18.42–32:16.60 (measured, dry run).
> Beat: Kronecker delta: the balloon drifts with the wind. Kind: map + equation.

## s32_delta_facts
Two more quick facts. Delta i i, with i summed, is one plus one plus one, which is three: the number of dimensions of space. And delta i j times p sub i q sub j turns a sum of nine terms into a sum of three, because it's just p dot q. The Kronecker delta comes back in the tensors movie, as the simplest tensor of all.

> 68 words · 4 sentences · 1936.600–1962.650 s (26.1 s; speech 24.2 s) · 32:16.60–32:42.65 (measured, dry run).
> Beat: Kronecker delta: two facts. Kind: equation animation.

## s33_coriolis_why
Now let's meet the second special symbol, which builds the cross product. Why does weather need it? Earth spins, and on a spinning planet, moving air feels a push to one side. This is called the Coriolis effect, and it's why large storms spin. Where it comes from is derived step by step in the Coriolis movie, later in this series. Here we'll use one fact: for each kilogram of air, the push is minus two Omega cross u. Omega is Earth's spin, and u is the wind. To find which way this push points, we need the cross product.

> 100 words · 8 sentences · 1962.650–2003.025 s (40.4 s; speech 37.1 s) · 32:42.65–33:23.03 (measured, dry run).
> Beat: cross product: why weather needs it. Kind: globe + map.

## s34_cross_basics
The cross product of two vectors, p and q, is another vector, at right angles to both. Its length is the length of p, times the length of q, times the sine of the angle between them. That's the area of the parallelogram the two arrows make. Its direction comes from the right-hand rule: point your fingers along p, curl them towards q, and your thumb points along p cross q. For our unit vectors, e one cross e two is e three: east cross north is up. In components, the first component of p cross q is p two q three, minus p three q two. The other two follow the same pattern, cycling through one, two and three. We take the cross product apart fully, and see its uses across physics, in the two cross product movies.

> 139 words · 8 sentences · 2003.025–2058.150 s (55.1 s; speech 51.9 s) · 33:23.03–34:18.15 (measured, dry run).
> Beat: cross product: definition (stand-alone). Kind: 3-D diagram + equation.

## s35_epsilon_def
To write this pattern with indices, we need a symbol that knows the order of one, two and three. It's called the alternating tensor, or permutation symbol, and it's written epsilon i j k. It has three indices, so it has twenty seven values. Epsilon i j k is plus one when i, j, k are one, two, three, or that order shifted round: two, three, one, or three, one, two. It's minus one when the order is reversed: three, two, one, or two, one, three, or one, three, two. And it's zero whenever two of the indices are equal. So only six of the twenty seven values aren't zero.

> 110 words · 7 sentences · 2058.150–2102.950 s (44.8 s; speech 41.9 s) · 34:18.15–35:02.95 (measured, dry run).
> Beat: alternating tensor: definition. Kind: 3-D data cube.

## s36_epsilon_moves
Two moves follow from this. Shifting all three indices one step round the cycle keeps the value: epsilon i j k equals epsilon j k i. But swapping any two indices flips the sign: epsilon i j k equals minus epsilon j i k.

> 44 words · 3 sentences · 2102.950–2122.325 s (19.4 s; speech 17.9 s) · 35:02.95–35:22.32 (measured, dry run).
> Beat: alternating tensor: two moves. Kind: equation animation.

## s37_cross_index
Now the cross product fits in one line: the i component of p cross q is epsilon i j k times p sub j times q sub k, with j and k both summed. That's nine terms for each i. Let's write them out for i equal to one. Every term with j or k equal to one is zero, because then epsilon repeats an index. That leaves two terms. Epsilon one two three times p two q three is plus p two q three. And epsilon one three two times p three q two is minus p three q two. That's exactly the first component of the cross product.

> 110 words · 8 sentences · 2122.325–2166.550 s (44.2 s; speech 41.0 s) · 35:22.32–36:06.55 (measured, dry run).
> Beat: cross product in index form. Kind: equation animation.

## s38_cross_check
Let's try easy numbers. Take p with components five, one and zero, and q with components one, three and zero. What's the third component of p cross q? For i equal to three, epsilon three one two gives plus five times three, and epsilon three two one gives minus one times one. So the third component is fifteen minus one, which is fourteen. The first two components are zero, so p cross q points straight up, fourteen units long. And the order matters. In q cross p, the same two terms appear with their signs flipped, so q cross p is minus p cross q. Turning the order round reverses the arrow.

> 112 words · 9 sentences · 2166.550–2215.125 s (48.6 s; speech 45.0 s) · 36:06.55–36:55.12 (measured, dry run).
> Beat: cross product: easy numbers and order. Kind: 3-D diagram + calculation.

## s39_omega
Now Earth's spin. Omega is an arrow along Earth's axis, pointing out of the North Pole. Its length is seven point two nine times ten to the minus five radians per second, one turn in just under a day. Radians measure angle, and a full turn is two pi radians. At Brest, at forty eight point four five degrees north, the axis isn't straight up: it leans towards the north. So in our east, north, up basis, Omega has components zero, Omega times the cosine of phi, and Omega times the sine of phi, where phi is the latitude. At Brest, that's zero, four point eight four, and five point four six, times ten to the minus five.

> 118 words · 7 sentences · 2215.125–2263.300 s (48.2 s; speech 45.3 s) · 36:55.12–37:43.30 (measured, dry run).
> Beat: Earth's spin vector at Brest. Kind: globe + 3-D vectors.

## s40_coriolis_easy
Let's find the push's direction with easy numbers first. Take a place at forty five degrees north, where Omega's north and up components are both about five times ten to the minus five. Take a wind of ten metres per second blowing due north, with components zero, ten and zero. The first component of Omega cross u is Omega two u three minus Omega three u two. That's zero, minus five times ten to the minus five times ten, so minus five times ten to the minus four. The second component is Omega three u one minus Omega one u three, which is zero. The third is Omega one u two minus Omega two u one, which is also zero. Multiplying by minus two, the push is plus one times ten to the minus three metres per second squared, towards the east. The wind blows north, and the push points east: a right angle to the right of the wind.

> 160 words · 9 sentences · 2263.300–2326.925 s (63.6 s; speech 60.0 s) · 37:43.30–38:46.93 (measured, dry run).
> Beat: Coriolis direction: easy numbers. Kind: diagram + calculation.

## s41_coriolis_real
Now the real wind a kilometre above Brest, with Brest's Omega. With epsilon, minus two Omega cross u has three components. They're plus three point six six, minus zero point six three, and plus zero point five six, all times ten to the minus three metres per second squared. The flat part points just south of east. That's exactly a right angle to the right of the wind, which blows a little east of north. The third part points up, and it's nearly twenty thousand times weaker than gravity, so it hardly matters.

> 93 words · 6 sentences · 2326.925–2365.175 s (38.2 s; speech 35.7 s) · 38:46.93–39:25.18 (measured, dry run).
> Beat: Coriolis direction: the real wind. Kind: map + calculation.

## s42_coriolis_meaning
How big is this push? Three point seven times ten to the minus three metres per second squared sounds tiny. But it never stops. Acting for one hour, it could change the wind by about thirteen metres per second. That's why the wind can't blow straight from high pressure to low pressure for long: in the Northern Hemisphere, the Coriolis push keeps turning it to the right. South of the equator, the latitude counts as negative, so Omega's up part is negative, and the push turns the wind to the left. How this push balances the push from pressure is the story of the geostrophic wind movie.

> 107 words · 7 sentences · 2365.175–2408.575 s (43.4 s; speech 40.5 s) · 39:25.18–40:08.57 (measured, dry run).
> Beat: Coriolis: what the number means. Kind: map inset + calculation.

## s43_coriolis_globe
Here's the whole planet at one moment. The wind near the ground is drawn in teal, and the push from Earth's spin, worked out with epsilon at every place, is drawn in violet. In the north, every violet arrow points to the right of its wind. In the south, every one points to the left. Near the equator, the flat part of the push shrinks to nothing, because Earth's spin has no up part there.

> 75 words · 5 sentences · 2408.575–2436.950 s (28.4 s; speech 26.2 s) · 40:08.57–40:36.95 (measured, dry run).
> Beat: Coriolis on the whole planet. Kind: globe (data).

## s44_eps_delta
Now let's connect the two special symbols. When two epsilons share one summed index, they can be replaced by deltas. This is the epsilon delta relation: epsilon i j k times epsilon k l m equals delta i l times delta j m, minus delta i m times delta j l. It's useful because two epsilons mean two cross products, and the deltas turn them into dot products. Here's a way to remember it. The summed index k sits in the middle, next to itself. On the right, the first indices, i and l, pair up, then the second ones, j and m. Then come the same pairs crossed over, with a minus sign.

> 114 words · 8 sentences · 2436.950–2484.500 s (47.6 s; speech 44.3 s) · 40:36.95–41:24.50 (measured, dry run).
> Beat: epsilon-delta relation: statement. Kind: equation animation.

## s45_eps_delta_check
Let's check it with numbers. Take i equal to one, j equal to two, l equal to one and m equal to two. On the left, only k equal to three survives: epsilon one two three times epsilon three one two, which is one times one, so one. On the right, it's delta one one times delta two two, minus delta one two times delta two one: one minus zero, which is also one. Now swap l and m, so l is two and m is one. The left is epsilon one two three times epsilon three two one: one times minus one, so minus one. The right is zero minus one, minus one again. There are eighty one combinations in all, and a computer checks every one of them in a moment. They all agree.

> 136 words · 9 sentences · 2484.500–2539.150 s (54.7 s; speech 51.0 s) · 41:24.50–42:19.15 (measured, dry run).
> Beat: epsilon-delta: two cases and 81. Kind: equation + grid animation.

## s46_eps_delta_why
But why must it always be true? For the left side not to be zero, i and j must be different, and k must be the third number. Then epsilon k l m isn't zero only if l and m are the same two numbers as i and j. If they come in the same order, the two epsilons are equal, so their product is plus one. If they come in the swapped order, the two epsilons have opposite signs, so their product is minus one. And that's exactly what the deltas on the right side say.

> 97 words · 6 sentences · 2539.150–2574.800 s (35.7 s; speech 33.1 s) · 42:19.15–42:54.80 (measured, dry run).
> Beat: epsilon-delta: why it is true. Kind: equation animation.

## s47_lagrange_steps
Here's a first use. Let's find the length of p cross q, squared, without drawing anything. From our one-line formula, the k component of p cross q is epsilon k i j times p sub i q sub j. Moving k two places to the end doesn't change epsilon, so it's also epsilon i j k times p sub i q sub j. The length squared is this component times itself, summed over k. For the second copy we use new dummy letters, l and m. That gives epsilon i j k times epsilon k l m, times p sub i, q sub j, p sub l and q sub m. Now the epsilon delta relation replaces the two epsilons with delta i l delta j m, minus delta i m delta j l.

> 134 words · 8 sentences · 2574.800–2629.650 s (54.8 s; speech 51.6 s) · 42:54.80–43:49.65 (measured, dry run).
> Beat: derivation: |p x q|² (steps 1-3). Kind: derivation.

## s48_lagrange_result
In the first part, the deltas turn p sub l into p sub i, and q sub m into q sub j. That's p sub i p sub i times q sub j q sub j: the two lengths squared, multiplied. In the second part, they turn p sub l into p sub j, and q sub m into q sub i. That's p sub i q sub i times p sub j q sub j: p dot q, squared. So the length of p cross q squared equals the length of p squared times the length of q squared, minus p dot q squared. Let's check it with p as five, one, zero and q as one, three, zero. On the left, fourteen squared is one hundred and ninety six. On the right, twenty six times ten is two hundred and sixty, and p dot q is eight, so we subtract sixty four. That's one hundred and ninety six again. In pictures, this is sine squared plus cosine squared equals one.

> 172 words · 10 sentences · 2629.650–2696.000 s (66.3 s; speech 62.4 s) · 43:49.65–44:56.00 (measured, dry run).
> Beat: derivation: |p x q|² (result and check). Kind: derivation + calculation.

## s49_scalar_triple
Now three vectors at once. The scalar triple product is p dot, open bracket, q cross s. In index notation it's epsilon i j k times p sub i, q sub j and s sub k, and it's a single number. Here's its picture. q cross s is an arrow at right angles to q and s, as long as the area of their parallelogram. Its dot product with p multiplies that area by p's height above the parallelogram. A base area times a height is a volume. So the scalar triple product is the volume of the slanted box whose edges are p, q and s, called a parallelepiped. Its sign tells us whether the three edges are arranged like east, north and up: plus for that order, and minus for its mirror image.

> 135 words · 8 sentences · 2696.000–2750.925 s (54.9 s; speech 51.7 s) · 44:56.00–45:50.93 (measured, dry run).
> Beat: scalar triple product: volume. Kind: 3-D diagram.

## s50_parcel_volume
Let's use it on an air parcel. Take a box of air above Brest, one kilometre from west to east, one kilometre from south to north, and one hundred metres tall. Its edges are one thousand times e one, one thousand times e two, and one hundred times e three, in metres. Only epsilon one two three survives, so the volume is one thousand times one thousand times one hundred. That's ten to the eight cubic metres. At this height, each cubic metre of air has a mass of about one point zero six kilograms. So the whole parcel holds about one hundred thousand tonnes of air.

> 107 words · 7 sentences · 2750.925–2794.525 s (43.6 s; speech 40.7 s) · 45:50.93–46:34.53 (measured, dry run).
> Beat: scalar triple: an air parcel. Kind: 3-D diagram + calculation.

## s51_parcel_shear
Now let the wind lean the parcel over. Imagine the top of the parcel moving one metre per second faster towards the north than its bottom. After ten minutes, the top has slid six hundred metres further north, and the box leans. Its upright edge now reaches six hundred metres north and one hundred metres up. Did the volume change? The new edge is the old one plus a piece along the north edge. That piece makes a box with two edges in the same direction: a flat box, with zero volume. With epsilon, it's zero because swapping two equal edges must flip the sign, and the only number equal to its own negative is zero. So leaning the parcel like this doesn't change its volume: it's still ten to the eight cubic metres. Above Brest that evening, the wind a kilometre up was more than three times as strong as at the ground, so real parcels were being leaned like this all the time.

> 165 words · 10 sentences · 2794.525–2859.000 s (64.5 s; speech 60.5 s) · 46:34.53–47:39.00 (measured, dry run).
> Beat: scalar triple: shear leans the parcel, volume unchanged. Kind: 3-D animation + calculation.

## s52_flux_easy
The triple product also tells us how much air crosses a surface. Picture a window standing on the ground: a curtain one hundred kilometres long from west to east, and one kilometre tall. A wind of ten metres per second blows straight through it, towards the north. In one second, the air that passes through fills a box one hundred kilometres long, one kilometre tall and ten metres deep. Its volume is ten to the nine cubic metres. The box's edges are p along the curtain, q up the curtain, and the wind times one second. So the volume of air crossing each second is the scalar triple product: u dot, open bracket, q cross p.

> 116 words · 7 sentences · 2859.000–2906.825 s (47.8 s; speech 44.9 s) · 47:39.00–48:26.82 (measured, dry run).
> Beat: scalar triple: air through a window (easy). Kind: 3-D diagram.

## s53_flux_slanted
Now let's make it real, and slanted. Imagine the curtain standing along Brittany's north coast, from Brest towards Saint-Malo. It's one hundred and eighty six kilometres long, pointing ten degrees north of east, and one kilometre tall, around the height of our map. Its edges are p, with components one hundred and eighty three and thirty two kilometres, and q, one kilometre straight up. The cross product q cross p has components minus thirty two, one hundred and eighty three, and zero square kilometres. It's an arrow at right angles to the curtain, pointing out to sea, and as long as the curtain's area. Now we dot it with the wind above Brest, five point eight and thirty three point five metres per second. That's minus thirty two times five point eight, plus one hundred and eighty three times thirty three point five. The result is about five thousand nine hundred and forty square kilometres times metres per second, or about six times ten to the nine cubic metres of air every second.

> 173 words · 9 sentences · 2906.825–2978.075 s (71.2 s; speech 67.7 s) · 48:26.82–49:38.07 (measured, dry run).
> Beat: scalar triple: a slanted curtain on Brittany's coast. Kind: map on a tilted 3-D plate + 3-D curtain.

## s54_flux_meaning
What does that mean? Imagine the wind is the same all along the curtain. Each cubic metre has a mass of about one point zero six kilograms, so more than six million tonnes of air would cross the coast every second. And this air was moist, with about six and a half grams of water vapour in every kilogram. So about forty thousand tonnes of water would cross the coast each second. Long, narrow streams of very moist air are called atmospheric rivers, and measuring them starts with exactly this triple product. Flow through surfaces is built up step by step in the divergence movie.

> 105 words · 7 sentences · 2978.075–3021.150 s (43.1 s; speech 40.2 s) · 49:38.07–50:21.15 (measured, dry run).
> Beat: scalar triple: what the flux means. Kind: map inset + calculation.

## s55_vector_triple_plan
Last, the vector triple product: p cross, open bracket, q cross s. It appears whenever an arrow is turned twice. Our goal is to write it with dot products only. The plan is to write both cross products with epsilon, use the epsilon delta relation, and then let the deltas do the substituting.

> 53 words · 4 sentences · 3021.150–3044.600 s (23.4 s; speech 21.6 s) · 50:21.15–50:44.60 (measured, dry run).
> Beat: vector triple product: goal and plan. Kind: equation + 3-D mini.

## s56_vector_triple_steps
First, the i component of p cross anything is epsilon i j k times p sub j, times that thing's k component. Second, take the k component of q cross s. It's epsilon k l m times q sub l times s sub m. Putting them together gives epsilon i j k times epsilon k l m, times p sub j, q sub l and s sub m. The two epsilons share the summed index k, sitting next to each other. So the epsilon delta relation applies, and we replace them with delta i l delta j m, minus delta i m delta j l.

> 104 words · 5 sentences · 3044.600–3085.800 s (41.2 s; speech 39.0 s) · 50:44.60–51:25.80 (measured, dry run).
> Beat: vector triple product: steps 1-3. Kind: derivation.

## s57_vector_triple_result
In the first part, delta i l turns q sub l into q sub i, and delta j m turns s sub m into s sub j. That leaves q sub i times p sub j s sub j, which is q times p dot s. In the second part, delta i m turns s sub m into s sub i, and delta j l turns q sub l into q sub j. That leaves s sub i times p dot q. So p cross, q cross s, equals q times p dot s, minus s times p dot q. Let's check with easy numbers: p is one, zero, zero, q is zero, one, zero, and s is one, one, zero. Straight from the cross products, the answer is zero, one, zero. From our rule, it's q times one, minus s times zero, which is zero, one, zero as well. Identities like this one, with grad, div and curl inside them, fill the two movies on vector identities.

> 168 words · 9 sentences · 3085.800–3150.250 s (64.4 s; speech 60.9 s) · 51:25.80–52:30.25 (measured, dry run).
> Beat: vector triple product: result and check. Kind: derivation + calculation.

## s58_double_turn
Here's a weather use. Let k hat be the unit vector pointing straight up, the same as e three. With epsilon, k hat cross u has components minus u two and u one: it turns a flat wind a quarter turn to the left, anticlockwise seen from above. What if we turn it twice? By our rule, k hat cross, k hat cross u, is k hat times k hat dot u, minus u times k hat dot k hat. A flat wind is at right angles to k hat, so k hat dot u is zero, and k hat dot k hat is one. So two quarter turns give minus u: the wind turned right round. Let's check with the wind above Brest. One quarter turn makes five point eight and thirty three point five into minus thirty three point five and five point eight. A second turn makes it minus five point eight and minus thirty three point five.

> 161 words · 10 sentences · 3150.250–3212.375 s (62.1 s; speech 58.2 s) · 52:30.25–53:32.38 (measured, dry run).
> Beat: vector triple: two quarter turns. Kind: map + equation.

## s59_centrifugal
One more. As Earth spins, it carries the air round in circles, and that gives a pull outwards, away from the axis, called the centrifugal effect. For each kilogram, it's minus Omega cross, open bracket, Omega cross r, where r is the arrow from Earth's centre to the place. Our rule turns this into Omega squared times r, minus Omega times Omega dot r. Split r into a part along the axis and a part straight out from the axis. The part along the axis cancels, and what's left is Omega squared times the part straight out from the axis. At Brest, that part is six thousand three hundred and seventy one kilometres times the cosine of the latitude, about four thousand two hundred and twenty six kilometres. Times Omega squared, the pull is about zero point zero two two metres per second squared, a quarter of one percent of gravity. Small as it is, it's why Earth bulges at the equator. Its radius there is about twenty one kilometres larger than at the poles. The Coriolis movie shows how this pull is folded into gravity.

> 186 words · 11 sentences · 3212.375–3289.025 s (76.7 s; speech 72.3 s) · 53:32.38–54:49.03 (measured, dry run).
> Beat: vector triple: the centrifugal pull. Kind: 3-D globe slice + calculation.

## s60_recap
To sum up, a scalar is one number, like the temperature, and a vector is an arrow, like the wind. Its components are its steps along the unit vectors east, north and up, and its length, by Pythagoras, is the wind speed. Vectors add tip to tail, or component by component, and p minus q is the arrow from the tip of q to the tip of p: a wind change, a wind shear, or an anomaly. In index notation, u sub i stands for all three components, and a free index means three equations. A repeated index is summed: that's the Einstein convention, so u sub j times partial T by partial x sub j is the advection of temperature. The Kronecker delta is one for equal indices and zero otherwise, and it swaps one index for another. Epsilon i j k builds the cross product, which gives the Coriolis push, at right angles to the right of the wind in the north. The epsilon delta relation turns two cross products into dot products. And the scalar triple product is a volume, or the air crossing a surface each second.

> 191 words · 9 sentences · 3289.025–3365.150 s (76.1 s; speech 72.5 s) · 54:49.03–56:05.15 (measured, dry run).
> Beat: recap. Kind: recap montage.

## s61_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for vectors and index notation, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 59 words · 3 sentences · 3365.150–3389.300 s (24.2 s; speech 23.2 s) · 56:05.15–56:29.30 (measured, dry run).
> Beat: series end card (maths ending). Kind: end card.

> Post-run edit (not re-measured): s56 sentence 2 split in two so that no caption cue exceeds 7 s (run warning: cue 761, 7.5 s); expected change < +0.6 s.

> Total: 8434 words · 538 sentences · 3389.300 s narration · 3391.800 s movie (56:31.80) · 149.2 words per minute.
