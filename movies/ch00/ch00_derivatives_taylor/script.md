# ch00_derivatives_taylor — narration (movie-director, 2026-10-28)

Series plan v2 **Stage 1 #4 "Derivatives and Taylor series"** (partial derivatives, chain rule, perfect differential,
Taylor series, linearisation; plus finite differences on a model grid). House style `movies/HOUSE_STYLE.md` (binding).
Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice; our own words; maths spoken in words; `[beat]` = 1.5-s
hold after a worked calculation (not spoken, not captioned).

**Measured, not estimated.** `tools/tts.py` dry run on 2026-10-28 into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_derivatives_taylor/dryrun/v3` (input = script.md after the source check `research/ch00_derivatives_taylor_sources.md`, current `movies/lexicon.yaml`, not edited): **49 scenes, 415 sentences, 6688 words, 66 beats, 2796.900 s narration + 2.5-s silent end-card hold = 2799.400 s (46:39.40)**; speech alone 2556.2 s = 157.0 words per minute while speaking, **143.5 words per minute overall** (limit 150); 689 caption cues; self-check {'expected_s': 2796.9, 'audio_s': 2796.9, 'diff_ms': 0.0, 'len_ok': True, 'cues_ok': True}; warnings: none. Previous run v2 (before the source check): 6587 words, 2752.625 s narration, 2755.125 s movie, 143.6 wpm.

**Spoken-letter rules.** Time is always "small t" and temperature "capital T" at first use in a scene that has both;
"partial capital T by partial x"; "d T by d t" for the traveller's rate; "capital D T by D t" only in s20. No lone vector
"a". The specific volume is "alpha", density "rho", the saturation vapour pressure "e s", the vapour gas constant "R v",
the heat capacity "c v". Starting points are "z nought" and "x nought".

**Cross-references (user rule 2026-10-27), spoken and on the end card:** weather basics (0.3: s26 hydrostatic balance,
s04 reanalysis), vectors and index notation (#1a: s13), dot product (0.1/0.1b: s20), gradient (#6: s07), material
derivative (#10: s20), coordinates (#5: s21 pressure as a coordinate is #23A), pressure as a vertical coordinate (#23A:
s21), ODEs (#13: s27), thermodynamics and potential temperature (#24: s29), water in the air (#26: s39), climate machine
(#22: s42), climate change (#67: s43), waves (#16) and stability (#20: s38), PDEs and numerical methods (#14: s46). The
cross-product movies (#1b, #2, #3) are not needed here and are listed on the end card only as "the other maths movies".

Lines starting with ">" are notes and are not spoken.

**Change log (motion-builder, 2026-10-29: narration re-worded to the data, `movies/data/build_ch00_derivatives_taylor.py`).**
- s19 S7-S8 (DT26): ERA5 2026-09-30 12 UTC horizontal temperature gradient at Trappes is 0.31 / 0.74 / 0.98 K per 100 km at
  850 / 700 / 500 hPa and the sideways term along the drift averages about 3.3e-5 K/s: "only about one degree per hundred
  kilometres ... around one times ten to the minus four" -> "less than one degree per hundred kilometres ... only a few
  hundred-thousandths of a degree per second".
- s19 S9 (DT27): the rising share is 99.6 %: "about ninety nine percent" -> "more than ninety nine percent".
- Final TTS: G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_derivatives_taylor/v1/tts (numbers in timing.json).

**Change log (fix loop 1, motion-builder, 2026-10-29: review 1 "ch00_derivatives_taylor — review 1"; every number from `data/dt.json` / `manifest.json`; sentence numbers are 1-based, after the change).**
- s10 new S11 (review S12): "At Brest, the four corners give zero point three seven degrees, divided by thirty six point eight kilometres and by two hours: the same one point four times ten to the minus nine." (e850.corners 7.58 − 8.63 − 1.77 + 3.19 = 0.37 °C; 2 Δx = 36.8 km; 2 h; e850.mixed 1.43e-9).
- s16 new S3 (review S2): "Let's call its speed east capital U." S9 (review S17): "... per hour" -> "... per hour, if these rates held for a whole hour."
- s19 S1 (review S2): "+, writing the balloon's speeds as u east, v north and w up". S3 (S1): "two and a half" -> "two point six" (snd.dT12 −2.59). S4: "about six" -> "about minus six times ten to the minus five" (snd.fixed −5.98e-5). S7 (S1): "That's only a few hundred-thousandths of a degree per second." -> "But it drifted almost along the lines of equal temperature, so only a small part of that gradient counts: about minus three times ten to the minus five degrees per second." (snd.side −3.27e-5). S8: "the rising term: w, four point seven ...".
- s20 S3 (review S2): "the wind dotted with the gradient," -> "the wind, bold u, dotted with the gradient, grad T:". S5 + S6 (review S3): "So the air parcel itself cooled ..." -> "If the air parcels had kept their temperature, the place would have warmed by three point seven degrees per hour. It warmed by only two point nine, so each air parcel itself cooled by about zero point eight degrees per hour." (e850.adv_Kh −3.68, dTdt 2.92, DTDt −0.76 °C/h).
- s22 S4/S5 (review S4): "+, about a hundred and thirty five metres," (hill summit 325.1 − car park 189.7 m); "different, because a winding trail is longer than a straight one" -> "different: four kilometres on the straight trail, and nine on the winding one." (hill.Lst 3.99, Lw 8.98 km).
- s24 S3 (review S11): "+, which is the temperature in degrees Celsius plus two hundred and seventy three".
- s27 new S5 (review S10): "By the chain rule, its slope, d p by d z, is minus p over capital H, so it really does solve d p over p equals minus d z over capital H."
- s28 new S2-S4 (review M3): "They're tied together by the first law of thermodynamics. The small change in the air's internal energy, d I, the energy of its molecules' motion, equals a small amount of heat added, plus a small amount of work done on the air. We write those two with a d that has a bar through it, d bar Q and d bar W, because they're small amounts, not the change of anything."
- s29 new S5 (review M3): "That's the first law turned round: c v d T is the change in the internal energy, and p d alpha is the work the air does on its surroundings as it expands." S14 (review S11): "+, written eta".
- s31 S8 (review S5): "four point three" -> "four point two six".
- s41 S2 (review S20): "The world has warmed by about one and a quarter degrees since the late eighteen hundreds." -> "The last ten years were about one point two six degrees warmer than the late eighteen hundreds." (cc.warm 1.26 °C, 2016–2025 vs 1850–1900, Forster et al. 2026).
- s42 S6 (review S11): "+: the temperature a black body would need, to give off those two hundred and forty watts per square metre". S8 (review S11): "Just as x squared gave two x, " + the old sentence.
- s43 S3 (review S15): "about one degree" -> "about one point zero four degrees" (rad.dT_planck 1.044).
- New and changed sentences: Kokoro af_bella ×1.0 with the lexicon, one constant gain to the BS.1770 loudness of the unchanged neighbours + a 5-ms look-ahead limiter at −1.5 dBFS (`movies/out/ch00/ch00_derivatives_taylor/_tools/splice_fix1.py`); the unchanged sentences are the build-1 clips, sample for sample, with the tts.py gaps. Fix-1 TTS: G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_derivatives_taylor/v1/fix1/tts.

## s00_title
In this video, we'll learn partial derivatives, the chain rule and Taylor series the easy way, and see how meteorology uses them to follow a weather balloon's temperature, and to find how much more water vapour it takes to saturate warmer air.

> 42 words · 1 sentences · 0 beats · 0.300–16.850 s (16.6 s; speech 15.8 s) · 0:00.30–0:16.85 (measured, dry run v3).

## s01_hook
What are partial derivatives, the chain rule and Taylor series? Let's see what they are, and why they're built this way. Then let's see what they tell us about the weather.

> 31 words · 3 sentences · 0 beats · 16.850–29.250 s (12.4 s; speech 10.9 s) · 0:16.85–0:29.25 (measured, dry run v3).

## s02_average_rate
Let's start with a quantity that changes with just one thing. At Brest, a port at the western tip of France, the weather station's thermometer read ten point three degrees Celsius at six in the evening, universal time, on the first of November twenty twenty-three, as Storm Ciarán's warm air arrived. Two hours later, it read fourteen point nine. How fast did it warm? We take the change, four point six degrees, and divide it by the time, two hours. That's two point three degrees per hour. [beat] But that's an average over two hours. The derivative is the rate at one instant.

> 102 words · 8 sentences · 1 beats · 29.250–73.800 s (44.5 s; speech 40.1 s) · 0:29.25–1:13.80 (measured, dry run v3).

## s03_derivative_limit
To get the rate at one instant, we shrink the time step. Let's see how, on an easy curve: f of x equals x squared, at x equals three. A step from three to four raises f from nine to sixteen, so the rate is seven over one, which is seven. [beat] A step of one tenth gives six point one, and a step of one hundredth gives six point zero one. [beat] As the step shrinks, the rate settles on six. That limit is the derivative, written d f by d x. For x squared it's two x, which is six at x equals three. In the picture, the line through two points of the curve turns into the tangent, the line that just touches the curve. So the derivative is the slope of the tangent: how much f changes for each unit of x.

> 144 words · 9 sentences · 2 beats · 73.800–129.450 s (55.6 s; speech 49.8 s) · 1:13.80–2:09.45 (measured, dry run v3).

## s04_fields
In the weather, though, a quantity rarely depends on just one thing. The temperature depends on where you are, and when. Let's call the distance east x, the distance north y, the height z, and the time small t. Then the temperature, capital T, is a function of all four: T of x, y, z and small t. A quantity that has a value at every place and every time is called a field. Here's the temperature field a little more than a kilometre above western France, at six in the evening. It comes from ERA5, a reanalysis: a best estimate of the whole atmosphere, built from observations and a weather model.

> 112 words · 7 sentences · 0 beats · 129.450–174.450 s (45.0 s; speech 42.1 s) · 2:09.45–2:54.45 (measured, dry run v3).

## s05_partial_idea
So how fast does the temperature change as we go east? Now four things could change at once. The trick is to change only one of them, and hold the others fixed. Let's lift the map into a landscape, where the height of the ground stands for the temperature. Now cut it with a wall that runs due east through Brest. Along that cut, only x changes, while y, the height and the time stay fixed. The edge of the cut is an ordinary curve, and its slope is the partial derivative of T with respect to x. We write it with a curly d, and say partial capital T by partial x. Partial means that only x changes, and everything else stays put.

> 124 words · 9 sentences · 0 beats · 174.450–221.050 s (46.6 s; speech 43.0 s) · 2:54.45–3:41.05 (measured, dry run v3).

## s06_partial_rule
Working out a partial derivative is easy: treat every other variable as a constant, and take the ordinary derivative. Let's try an easy, made-up temperature field: T equals ten, minus zero point zero three x, plus three small t, with x in kilometres and small t in hours. For partial capital T by partial x, small t is a constant, so the three small t term has no slope in x. What's left is minus zero point zero three degrees per kilometre. [beat] For partial capital T by partial small t, x is the constant, and we get plus three degrees per hour. [beat] Now a field with a product, T equals x times small t. Holding small t fixed, partial capital T by partial x is small t. Holding x fixed, partial capital T by partial small t is x.

> 139 words · 8 sentences · 2 beats · 221.050–282.575 s (61.5 s; speech 56.0 s) · 3:41.05–4:42.57 (measured, dry run v3).

## s07_partial_real
Now the real field. The ERA5 data come on a grid every quarter of a degree, which here is about eighteen kilometres apart going east. So to find the slope at Brest, we take the grid point one step east and the point one step west, and divide their difference by the distance between them. That's called a centred difference, and we'll see later why it's a good choice. East of Brest it was colder, so partial capital T by partial x is negative: minus three point two degrees per hundred kilometres. [beat] Cutting north instead gives partial capital T by partial y: minus two point five degrees per hundred kilometres. [beat] So at that moment, the air got colder towards the east, and towards the north. Together, these two partial derivatives make the gradient, which has its own movie in this series.

> 141 words · 8 sentences · 2 beats · 282.575–342.125 s (59.6 s; speech 54.0 s) · 4:42.57–5:42.12 (measured, dry run v3).

## s08_partial_time
What about partial capital T by partial small t? Now we hold the place fixed, and let only the time change. That's what a thermometer fixed at one place measures, so let's call it the fixed thermometer. At that height over Brest, the reanalysis temperature rose from two point four degrees at five o'clock to eight point two at seven o'clock. Over those two hours, partial capital T by partial small t was about plus two point nine degrees per hour. [beat] At the ground, the station's barometer shows another partial derivative in time. The pressure fell from nine hundred and eighty eight point three hectopascals at five o'clock to nine hundred and eighty three point three at six. Hectopascals are the pressure unit of weather maps. That's a fall of five hectopascals in one hour, a sign of a deep storm coming. [beat]

> 142 words · 9 sentences · 2 beats · 342.125–403.350 s (61.2 s; speech 55.8 s) · 5:42.12–6:43.35 (measured, dry run v3).

## s09_partial_height
And partial capital T by partial z, the change with height? For that we need a weather balloon. Once or twice a day, at about eight hundred stations around the world, a balloon carries a small instrument package, called a radiosonde, up through the atmosphere. Let's take the latest one we have from Trappes, near Paris: noon, universal time, on the thirtieth of September twenty twenty-six. At one and a half kilometres up, it measured twelve point three degrees. At five point eight kilometres, it measured minus eleven point eight. So partial capital T by partial z was minus twenty four point one degrees over four point two six kilometres, which is minus five point seven degrees per kilometre. [beat] The balloon took fifteen minutes to climb between those heights, and we'll check later that the air itself hardly changed in that time. Meteorologists call this cooling with height the lapse rate, and they flip its sign, so here the lapse rate is plus five point seven degrees per kilometre.

> 169 words · 9 sentences · 1 beats · 403.350–474.175 s (70.8 s; speech 66.1 s) · 6:43.35–7:54.18 (measured, dry run v3).

## s10_mixed_partials
We can also take a partial derivative of a partial derivative. Let's take the eastward slope, partial capital T by partial x, and ask how fast it changes in time. Or, the other way round, take the warming rate, partial capital T by partial small t, and ask how it changes going east. These sound like different questions, but for any smooth field they give the same answer. Let's check with an easy field, T equals x squared times small t. The slope in x is two x small t, and its rate in time is two x. [beat] The rate in time is x squared, and its slope in x is also two x. [beat] Over Brest, the reanalysis gives both as one point four times ten to the minus nine degrees per metre per second. [beat] Here's why they must agree. Both are built from the same four values, at the corners of a small rectangle in x and small t: top right, minus top left, minus bottom right, plus bottom left. At Brest, the four corners give zero point three seven degrees, divided by thirty six point eight kilometres and by two hours: the same one point four times ten to the minus nine. Only the order of the subtractions differs, so the answer can't.

> 182 words · 11 sentences · 3 beats · 474.175–549.650 s (75.5 s; speech 67.7 s) · 7:54.18–9:09.65 (measured, dry run v3).

## s11_total_differential
Now let's change everything at once, but only by a little. Suppose we take a small step east, d x, a small step north, d y, a small step up, d z, and wait a short time, d t. How much does the temperature change? Each partial derivative says how much T changes for each unit of step in its own direction. So we multiply each one by its own step, and add them up. The small change, d T, equals partial capital T by partial x times d x, plus partial capital T by partial y times d y, plus partial capital T by partial z times d z, plus partial capital T by partial small t times d t. This is called the total differential. It's like walking on a hillside: your rise is the slope going east times your step east, plus the slope going north times your step north. Unlike a real hillside, our landscape also changes while we walk, so the time gets a term too.

> 171 words · 9 sentences · 0 beats · 549.650–616.075 s (66.4 s; speech 62.8 s) · 9:09.65–10:16.08 (measured, dry run v3).

## s12_total_example
Let's try it near Brest. We go ten kilometres east and twenty kilometres north, keep the same height, and wait half an hour. The east step gives minus three point two degrees per hundred kilometres, times ten kilometres: minus zero point three two degrees. The north step gives minus two point five per hundred kilometres, times twenty kilometres: minus zero point five. And the wait gives plus two point nine degrees per hour, times half an hour: plus one point four five. [beat] Adding them up, the temperature changes by about plus zero point six three degrees. [beat] This works only for small steps, where the landscape looks flat. We'll see exactly why, and what goes wrong for big steps, when we get to Taylor series.

> 124 words · 8 sentences · 2 beats · 616.075–670.600 s (54.5 s; speech 49.0 s) · 10:16.08–11:10.60 (measured, dry run v3).

## s13_chain_rule
So far we chose the steps ourselves. Now let's ride along with something that moves, like a plane or a balloon. Its position changes with time, so its x, y and z are themselves functions of time: capital X of t, capital Y of t, and capital Z of t. In a short time d t, it moves east by d X, which is d X by d t, its eastward speed, times d t. The same goes for north and up. Let's put these steps into the total differential, and divide everything by d t. That gives the rate the traveller's own thermometer reads. d T by d t equals partial capital T by partial small t, plus d X by d t times partial capital T by partial x, plus d Y by d t times partial capital T by partial y, plus d Z by d t times partial capital T by partial z. This is the chain rule. In the index notation of the vectors movie, the three moving terms are d X sub j by d t times partial capital T by partial x sub j, with j summed.

> 194 words · 10 sentences · 0 beats · 670.600–747.200 s (76.6 s; speech 72.6 s) · 11:10.60–12:27.20 (measured, dry run v3).

## s14_chain_meaning
Let's read it term by term. The first term is the change at a fixed place: the fixed thermometer's rate. Each of the other terms is a speed times a slope: how fast the traveller moves in one direction, times how much the temperature changes per metre in that direction. Metres per second times degrees per metre gives degrees per second, so every term is a rate in time. Moving into colder places cools the traveller, even if nothing changes at any fixed place. And the speeds are the traveller's own, so a car, a plane and a balloon at the same place feel different rates.

> 106 words · 6 sentences · 0 beats · 747.200–788.950 s (41.8 s; speech 39.2 s) · 12:27.20–13:08.95 (measured, dry run v3).

## s15_chain_easy
Let's try the simplest case first, on an easy, made-up road. Imagine a frozen map, where nothing changes at any fixed place, so partial capital T by partial small t is zero. A car drives east at one hundred kilometres per hour, and the air gets colder by zero point zero three degrees for every kilometre east. The chain rule gives one hundred kilometres per hour, times minus zero point zero three degrees per kilometre. The kilometres cancel, leaving minus three degrees per hour. [beat] So the car's dashboard thermometer falls by three degrees every hour, though the air at every fixed place keeps its temperature.

> 105 words · 6 sentences · 1 beats · 788.950–835.275 s (46.3 s; speech 42.6 s) · 13:08.95–13:55.27 (measured, dry run v3).

## s16_flight_east
Now a thought experiment on the real map. Imagine a small plane at that height over Brest at six in the evening, flying due east at one hundred metres per second, about three hundred and sixty kilometres per hour. Let's call its speed east capital U. What does its thermometer read? The place itself is warming, at plus two point nine degrees per hour. But the plane flies into colder air. One hundred metres per second, times minus three point two degrees per hundred kilometres, is minus zero point zero zero three two degrees per second. Times three thousand six hundred seconds in an hour, that's minus eleven point five degrees per hour. [beat] Adding the two, the plane's thermometer falls at about eight point six degrees per hour, if these rates held for a whole hour. [beat] So the plane cools, even though every place it passes is warming.

> 133 words · 9 sentences · 2 beats · 835.275–892.900 s (57.6 s; speech 51.7 s) · 13:55.27–14:52.90 (measured, dry run v3).

## s17_flight_west
Now let's turn the plane round, and fly due west at the same speed. It now flies into warmer air, so the moving term flips its sign, to plus eleven point five degrees per hour. Adding the warming of the place, its thermometer rises at about fourteen point four degrees per hour. [beat] Same place, same moment, same temperature field, but a different traveller, so a different rate. That's the heart of the chain rule: d T by d t belongs to the traveller, while partial capital T by partial small t belongs to the place.

> 95 words · 5 sentences · 1 beats · 892.900–931.450 s (38.6 s; speech 35.2 s) · 14:52.90–15:31.45 (measured, dry run v3).

## s18_balloon_rate
Now a real traveller: the Trappes balloon. It rose from one and a half kilometres to five point eight kilometres in nine hundred seconds, which is fifteen minutes. So its upward speed, d Z by d t, was four point two six kilometres divided by nine hundred seconds: four point seven metres per second. [beat] Over the same fifteen minutes, its thermometer fell by twenty four point one degrees. That's minus zero point zero two seven degrees per second, or about one point six degrees every minute. [beat] Which terms of the chain rule make this?

> 94 words · 6 sentences · 2 beats · 931.450–973.675 s (42.2 s; speech 37.4 s) · 15:31.45–16:13.67 (measured, dry run v3).

## s19_balloon_terms
Let's size each term, writing the balloon's speeds as u east, v north and w up. First, the fixed place. Comparing this balloon with the one launched twelve hours earlier, the air at five point eight kilometres cooled by about two point six degrees in twelve hours. That's only about minus six times ten to the minus five degrees per second. Next, the sideways terms. The balloon drifted with the wind, about seventeen kilometres to the north-north-east, through air whose temperature changed by less than one degree per hundred kilometres sideways. But it drifted almost along the lines of equal temperature, so only a small part of that gradient counts: about minus three times ten to the minus five degrees per second. Last, the rising term: w, four point seven metres per second, times minus five point seven degrees per kilometre, is minus zero point zero two seven degrees per second. [beat] So the rising term makes more than ninety nine percent of what the thermometer saw. That's why we can read a balloon's record as the temperature profile, partial capital T by partial z, even though the balloon is moving.

> 157 words · 10 sentences · 1 beats · 973.675–1043.325 s (69.7 s; speech 64.5 s) · 16:13.67–17:23.33 (measured, dry run v3).

## s20_parcel_pointer
There's one very special traveller: an air parcel, a small volume of air that moves with the wind. For an air parcel, the speeds in the chain rule are the wind itself, and its rate gets its own name and symbol: capital D T by D t, the material derivative. Its moving terms together are the wind, bold u, dotted with the gradient, grad T: the dot product from the dot product movie. Over Brest, the place warmed by two point nine degrees per hour, while the wind brought in warmer air at three point seven degrees per hour. If the air parcels had kept their temperature, the place would have warmed by three point seven degrees per hour. It warmed by only two point nine, so each air parcel itself cooled by about zero point eight degrees per hour. [beat] We take this apart fully in the material derivative movie, later in this series.

> 123 words · 6 sentences · 1 beats · 1043.325–1092.025 s (48.7 s; speech 45.0 s) · 17:23.33–18:12.03 (measured, dry run v3).

## s21_change_variables
The chain rule also lets us swap one variable for another. Meteorologists often use pressure instead of height to say how high something is. Weather balloons have long reported pressure, and many of the equations become simpler that way. So how do we turn a rate per kilometre into a rate per hectopascal? Along the balloon's climb, height is a function of pressure, so partial capital T by partial p equals partial capital T by partial z, times partial z by partial p. Between our two levels, the height rose four thousand two hundred and sixty two metres, while the pressure fell three hundred and fifty hectopascals. So partial z by partial p is minus twelve point two metres per hectopascal. [beat] Times minus five point seven degrees per kilometre, that gives plus zero point zero six nine degrees per hectopascal. [beat] So the air gets warmer as the pressure rises, going down. Pressure as a vertical coordinate has its own movie in this series.

> 163 words · 10 sentences · 2 beats · 1092.025–1165.075 s (73.0 s; speech 66.8 s) · 18:12.03–19:25.08 (measured, dry run v3).

## s22_state_functions
Now a question that matters a lot in the physics of air. When is a small change, d of something, really the change of a quantity? Think of climbing a hill. The height you gain from the car park to the summit, about a hundred and thirty five metres, is the same whichever trail you take: it depends only on where you start and where you end. The distance you walk is different: four kilometres on the straight trail, and nine on the winding one. A quantity like the height, which depends only on where you are, is called a state function. Its small change is called a perfect differential, or an exact differential. The temperature, pressure and density of air are all state functions. But the distance walked is not: its small steps add up to a total that depends on the route.

> 135 words · 9 sentences · 0 beats · 1165.075–1216.250 s (51.2 s; speech 47.6 s) · 19:25.08–20:16.25 (measured, dry run v3).

## s23_exact_test
How can we tell, just from the formula? Take a small change of the form M times d x, plus N times d y. If it's the change of some function f, then M is partial f by partial x, and N is partial f by partial y. And we just saw that mixed partial derivatives come out the same in either order. So the test is: partial M by partial y must equal partial N by partial x. Let's try y d x plus x d y. Partial y by partial y is one, and partial x by partial x is one. They match, so it's exact: it's the change of x times y. [beat] Now try y d x minus x d y. We get one against minus one. They don't match, so it's not the change of anything. [beat] Add it up going once round a square of side one, anticlockwise, and you come back to the start with minus two, not zero. [beat] For a perfect differential, every round trip adds up to exactly zero.

> 176 words · 13 sentences · 3 beats · 1216.250–1287.950 s (71.7 s; speech 63.2 s) · 20:16.25–21:27.95 (measured, dry run v3).

## s24_ideal_gas
Now real air. Its pressure, density and temperature are tied together by the ideal gas law: p equals rho R T. Here p is the pressure, rho the density, which is the mass of air in each cubic metre, and T the temperature in kelvin, which is the temperature in degrees Celsius plus two hundred and seventy three. R is a constant for dry air: two hundred and eighty seven joules per kilogram per kelvin. So pressure is a function of density and temperature, and its total differential is d p equals R T d rho, plus rho R d T. Let's test it. Partial of R T by partial T is R, and partial of rho R by partial rho is also R. They match, so pressure passes the test, as a state function must. [beat] Now divide both sides by p, which is rho R T. We get d p over p equals d rho over rho, plus d T over T. In words, the fractional change in pressure is the fractional change in density, plus the fractional change in temperature.

> 169 words · 11 sentences · 1 beats · 1287.950–1357.300 s (69.3 s; speech 63.9 s) · 21:27.95–22:37.30 (measured, dry run v3).

## s25_ideal_gas_example
Let's use it. On a sunny afternoon, suppose the air near the ground warms from two hundred and ninety to three hundred kelvin, while the pressure stays the same. The pressure term is zero, so d rho over rho equals minus d T over T: minus ten over two hundred and ninety, about minus three and a half percent. [beat] So the warmed air is about three and a half percent lighter than the air around it, which didn't warm. That's what makes it rise. The exact answer is two hundred and ninety over three hundred, minus one: minus three point three percent. [beat] That's close, because ten kelvin is a small step compared with two hundred and ninety.

> 117 words · 7 sentences · 2 beats · 1357.300–1405.900 s (48.6 s; speech 43.4 s) · 22:37.30–23:25.90 (measured, dry run v3).

## s26_hydrostatic
Pressure also changes with height. In the weather basics movie, we met hydrostatic balance: at every height, the pressure holds up the weight of the air above. As a differential, d p equals minus rho g d z, where g is gravity, nine point eight one metres per second squared. Going up a small step d z, the pressure drops by the weight of that thin layer. Now divide by p, and use the gas law: rho over p is one over R T. We get d p over p equals minus d z over capital H, where capital H, which is R T over g, is called the scale height. [beat] At the ground at Trappes, at nineteen point eight degrees Celsius, capital H is two hundred and eighty seven, times two hundred and ninety three, divided by nine point eight one. That's about eight thousand five hundred and seventy metres. [beat]

> 151 words · 8 sentences · 2 beats · 1405.900–1467.350 s (61.4 s; speech 56.4 s) · 23:25.90–24:27.35 (measured, dry run v3).

## s27_exponential
If the temperature were the same all the way up, capital H would be a constant. Then d p over p equals minus d z over capital H says that the pressure falls by the same fraction for every metre we climb. That makes an exponential: p equals the ground pressure, times e to the minus z over capital H. Here e is the number two point seven one eight. By the chain rule, its slope, d p by d z, is minus p over capital H, so it really does solve d p over p equals minus d z over capital H. This is the solution of a differential equation, and the ordinary differential equations movie solves many like it. Now let's compare with the balloon. The real pressure follows the exponential closely near the ground, then falls below it higher up. That's because the real air gets colder, and colder air is denser, so the pressure falls faster. We'll use this curve in a minute to see how Taylor series work.

> 140 words · 9 sentences · 0 beats · 1467.350–1523.000 s (55.7 s; speech 52.1 s) · 24:27.35–25:23.00 (measured, dry run v3).

## s28_heat_routes
Now the most important small changes that are not perfect: heat and work. They're tied together by the first law of thermodynamics. The small change in the air's internal energy, d I, the energy of its molecules' motion, equals a small amount of heat added, plus a small amount of work done on the air. We write those two with a d that has a bar through it, d bar Q and d bar W, because they're small amounts, not the change of anything. Take an air parcel at two hundred and eighty kelvin, and let it expand to one and a half times its volume, ending at the same temperature. Route one: first cool it at a fixed volume, then heat it as it expands at a fixed pressure. Route two: expand it slowly at a fixed temperature. Route three: heat it as it expands at a fixed pressure, then cool it at a fixed volume. The heat we must add is twenty seven, thirty three and forty kilojoules for each kilogram of air. [beat] Three routes, three different amounts of heat, between the same two states. So heat is not a state function: there's no amount of heat stored in the air, only heat flowing in or out. The same is true of work. But the internal energy, the energy of the molecules' motion, changes by exactly zero on all three routes, because the parcel ends at the temperature it started with.

> 172 words · 10 sentences · 1 beats · 1523.000–1590.300 s (67.3 s; speech 62.2 s) · 25:23.00–26:30.30 (measured, dry run v3).

## s29_entropy
Here's the test at work. For each kilogram of air, the heat added in a small, slow step is c v d T, plus p d alpha. Here c v is the heat needed to warm one kilogram by one kelvin at a fixed volume. Alpha, which is one over rho, is the volume of one kilogram, called the specific volume. That's the first law turned round: c v d T is the change in the internal energy, and p d alpha is the work the air does on its surroundings as it expands. With the gas law, p is R T over alpha. Let's test it. Partial of c v by partial alpha is zero, but partial of R T over alpha by partial T is R over alpha, which is not zero. They don't match, so heat is not a perfect differential. [beat] Now divide the heat by the temperature. We get c v d T over T, plus R d alpha over alpha. Test again: zero, and zero. They match! [beat] So heat divided by temperature is a perfect differential, the small change of a state function called entropy, written eta. On all three of our routes, the entropy rose by the same amount: one hundred and sixteen joules per kilogram per kelvin. [beat] Its close cousin, the potential temperature, follows air parcels through the whole atmosphere, and it has its own movie in this series.

> 201 words · 15 sentences · 3 beats · 1590.300–1677.375 s (87.1 s; speech 77.9 s) · 26:30.30–27:57.38 (measured, dry run v3).

## s30_zoom
Now let's zoom in. Here's the temperature profile from the Trappes balloon, all the way up to thirty two kilometres. From afar, it bends, and it even has kinks. Let's zoom in around one and a half kilometres. And again. And again. The closer we look, the straighter it gets, until it's a line. That line is the tangent, and its slope is the derivative there. So close to any one point, a smooth curve is almost a straight line. That's the idea behind Taylor series.

> 86 words · 10 sentences · 0 beats · 1677.375–1715.525 s (38.2 s; speech 34.2 s) · 27:57.38–28:35.53 (measured, dry run v3).

## s31_linear_approx
Let's write that line as a formula. Starting at a height z nought, the temperature a small step h higher is about the temperature at z nought, plus h times the slope there. At one and a half kilometres, the temperature was twelve point three degrees. The slope, from the readings just below and just above, was minus four point nine degrees per kilometre. Let's predict the temperature one kilometre higher. Twelve point three, plus one kilometre times minus four point nine, is seven point four degrees. [beat] The balloon measured six point nine, so the line is off by only half a degree. [beat] Now let's predict four point two six kilometres higher. The line gives minus eight point four, but the balloon measured minus eleven point eight. That's off by more than three degrees. [beat] The farther we go from the starting point, the worse the line gets, because the curve bends.

> 150 words · 11 sentences · 3 beats · 1715.525–1780.450 s (64.9 s; speech 57.2 s) · 28:35.53–29:40.45 (measured, dry run v3).

## s32_add_bend
To do better, we add a term for the bend. The bend is measured by the second derivative: how fast the slope itself changes. We add h squared, times the second derivative, divided by two. Why divided by two? Take the simplest bend, c times h squared. Its slope is two c h, and its second derivative is two c. So to make the bend's second derivative come out right, c must be half of it. [beat] The same idea gives the next term: h cubed, times the third derivative, divided by three times two times one, which is written three factorial. Each term makes one more derivative come out right at the starting point. Added up for ever, this is the Taylor series. f at x nought plus h equals f, plus h times the slope, plus h squared over two factorial times the second derivative, plus h cubed over three factorial times the third derivative, and so on.

> 159 words · 11 sentences · 1 beats · 1780.450–1848.550 s (68.1 s; speech 62.6 s) · 29:40.45–30:48.55 (measured, dry run v3).

## s33_series_example
Let's watch a Taylor series at work on an easy function, e to the x. All its derivatives are e to the x too, so at zero they're all one. Then e to the h is one, plus h, plus h squared over two, plus h cubed over six, and so on. For h equals zero point one, the sums are one, then one point one, then one point one zero five, then one point one zero five one seven. [beat] The calculator also says one point one zero five one seven, so just three terms already give four correct figures. [beat] For h equals one, we need more terms: one, two, two point five, two point six six seven, two point seven zero eight, and on towards two point seven one eight. [beat] So a small step needs few terms, and a big step needs many.

> 144 words · 7 sentences · 3 beats · 1848.550–1906.650 s (58.1 s; speech 51.8 s) · 30:48.55–31:46.65 (measured, dry run v3).

## s34_pressure_line
Now the pressure. Let's expand p equals the ground pressure times e to the minus z over capital H, for a height step z above the ground. The first two terms are the ground pressure, times one minus z over capital H. Look at the slope of that line: the ground pressure over capital H is rho g, so this line is just hydrostatic balance at the ground. [beat] At Trappes, that's a fall of eleven point six pascals for every metre, or one hectopascal for every eight point six metres you climb. [beat] Pilots use this rule of thumb near the ground: about thirty feet for each hectopascal. Let's test it one kilometre above the station. The line gives eight hundred and eighty point four hectopascals. Adding the bend gives eight hundred and eighty seven point three, and the balloon measured eight hundred and eighty seven point zero. [beat]

> 147 words · 9 sentences · 3 beats · 1906.650–1970.050 s (63.4 s; speech 56.8 s) · 31:46.65–32:50.05 (measured, dry run v3).

## s35_pressure_far
Now let's go five point six kilometres above the station, where the balloon measured five hundred hectopascals. The line gives only three hundred and forty three, far too low. [beat] Adding the bend gives five hundred and fifty eight, and the next term gives five hundred and eleven. [beat] With all the terms, the series lands on five hundred and seventeen, the exponential's own value. [beat] The last seventeen hectopascals are not the series' fault: our exponential assumed the ground's temperature all the way up. With the layer's average temperature, two hundred and seventy seven kelvin, the exponential gives four hundred and ninety nine, right next to the balloon's five hundred. [beat] So a Taylor series can only be as good as the curve it expands.

> 122 words · 7 sentences · 4 beats · 1970.050–2026.850 s (56.8 s; speech 49.3 s) · 32:50.05–33:46.85 (measured, dry run v3).

## s36_where_fails
Taylor series need a smooth curve. At about thirteen kilometres, the balloon's temperature profile has a kink: the cooling stops, and above it the air gets a little warmer. That's the tropopause, the lid on the weather layer. A line or a series built just below the kink predicts ever colder air above it, and gets it wrong. The same happens across a weather front, where the temperature changes sharply over a short distance. So the rule is: use a Taylor series only for steps that are small compared with the distance over which the curve bends.

> 97 words · 6 sentences · 0 beats · 2026.850–2065.900 s (39.1 s; speech 36.5 s) · 33:46.85–34:25.90 (measured, dry run v3).

## s37_three_reasons
So why are these tools built the way they are? There are three good reasons. The first is that the weather depends on many things at once, the place and the time, and partial derivatives let us ask about one of them at a time, by holding the rest fixed. The second is that, when we zoom in close enough, every smooth field looks flat, so small changes simply add up, slope times step, one direction at a time. That's the total differential, and the chain rule. The third reason is practical. The Taylor series tells us how big our error is when we stop at the straight line, and so how small a step must be, whether it's a degree of warming or the spacing of a weather model's grid.

> 131 words · 7 sentences · 0 beats · 2065.900–2113.075 s (47.2 s; speech 44.3 s) · 34:25.90–35:13.07 (measured, dry run v3).

## s38_linearisation
Keeping only the first two terms of a Taylor series, the value and the slope, is called linearisation. It turns a curve into a straight line around a chosen starting state, for small changes. Meteorologists and oceanographers do this all the time: a quiet starting state, plus a small disturbance. That's how waves, and the growth of storms, are first understood, in the waves and stability movies of this series. Now let's linearise two famous climate curves.

> 77 words · 5 sentences · 0 beats · 2113.075–2146.775 s (33.7 s; speech 31.5 s) · 35:13.07–35:46.78 (measured, dry run v3).

## s39_cc_curve
First, water vapour. Over a lake or the sea, water molecules keep escaping into the air as vapour, a gas, while others return to the water. The vapour's share of the air pressure is called the vapour pressure. When escaping and returning balance, we say the air is saturated, and the vapour pressure takes its saturation value, written e s. That value depends only on the temperature, not on the air, and the Clausius–Clapeyron equation tells us how. d e s by d T equals L times e s, divided by R v times T squared. Here L is the latent heat, the energy needed to turn one kilogram of liquid water into vapour: about two and a half million joules at zero degrees, a little less for warmer water. R v is the gas constant for water vapour, four hundred and sixty two joules per kilogram per kelvin. And T is the temperature in kelvin. The curve climbs faster and faster: at zero degrees Celsius, e s is about six hectopascals, at fifteen degrees it's seventeen, and at thirty degrees it's forty two. Water in the air has its own movie in this series.

> 195 words · 11 sentences · 0 beats · 2146.775–2227.525 s (80.8 s; speech 76.5 s) · 35:46.78–37:07.53 (measured, dry run v3).

## s40_cc_linear
How much does e s grow for each extra degree? Let's divide both sides by e s. The fractional growth per kelvin is L over R v T squared. At zero degrees Celsius, that's two and a half million, divided by four hundred and sixty two times two hundred and seventy three squared: zero point zero seven three, or about seven percent per degree. [beat] At fifteen degrees, it's six point four percent, and at thirty degrees, five point seven. [beat] That's the famous seven percent rule: for each degree of warming, the saturation vapour pressure rises by about seven percent. How good is the line? For one degree, it gives seven point three percent, and the exact curve gives seven point five. For four degrees, the line gives twenty nine percent, and the exact curve gives thirty three. [beat] The gap grows with the step, just as the Taylor series told us, because the bend term is missing.

> 156 words · 10 sentences · 3 beats · 2227.525–2295.650 s (68.1 s; speech 60.7 s) · 37:07.53–38:15.65 (measured, dry run v3).

## s41_cc_climate
Why does this matter? The last ten years were about one point two six degrees warmer than the late eighteen hundreds. By the seven percent rule, that raises the saturation vapour pressure by about nine percent. [beat] The rule is about saturated air, though, and the water vapour measured near the ground has risen a little less: about four to five percent for each degree of global warming. Still, the reanalysis shows the water vapour in the whole atmosphere rising since nineteen seventy nine. More vapour means more water for the heaviest downpours. The Intergovernmental Panel on Climate Change assesses that, worldwide, the heaviest daily rainfall is expected to become about seven percent more intense for each degree of global warming.

> 119 words · 7 sentences · 1 beats · 2295.650–2349.425 s (53.8 s; speech 49.7 s) · 38:15.65–39:09.43 (measured, dry run v3).

## s42_planck
Second, the heat that Earth sends to space. Every warm body glows in infrared light, and a perfect emitter, called a black body, gives off sigma T to the fourth watts per square metre. Here sigma is the Stefan–Boltzmann constant, five point six seven times ten to the minus eight. Satellites measure Earth giving off about two hundred and forty watts per square metre, on average. Solving sigma T to the fourth equals two hundred and forty gives T equals two hundred and fifty five kelvin, about minus eighteen degrees Celsius. That's Earth's emission temperature: the temperature a black body would need, to give off those two hundred and forty watts per square metre. [beat] Now let's linearise: how much more does Earth give off for each degree warmer? Just as x squared gave two x, the derivative of sigma T to the fourth is four sigma T cubed. And sigma T cubed is just sigma T to the fourth, divided by T. So the slope is four times two hundred and forty, divided by two hundred and fifty five: about three point eight watts per square metre for each degree. [beat]

> 164 words · 10 sentences · 2 beats · 2349.425–2418.500 s (69.1 s; speech 63.3 s) · 39:09.43–40:18.50 (measured, dry run v3).

## s43_planck_meaning
This is called the Planck response, and it's the planet's thermostat: warm up, and you lose heat faster, which pulls you back. Doubling the carbon dioxide in the air adds about three point nine watts per square metre of heating. To shed that, a planet with only the Planck response would warm by about three point nine divided by three point eight: about one point zero four degrees. [beat] The Intergovernmental Panel's careful estimate of the real Planck response is a little lower, about three point two, which gives about one point two degrees. The full warming is larger, because of feedbacks: for example, a warmer world has more water vapour in its air, and water vapour traps heat too. Is the linear Planck rule good enough? For one degree, the exact curve gives three point seven nine, against the line's three point seven six. For ten degrees, it's forty against thirty eight. [beat] For the changes that climate scientists worry about, the line does very well.

> 162 words · 9 sentences · 2 beats · 2418.500–2487.325 s (68.8 s; speech 62.9 s) · 40:18.50–41:27.32 (measured, dry run v3).

## s44_fd_forward
Last, how does a weather model take a derivative? It knows the temperature only at grid points, a distance h apart. The simplest estimate of the slope is the forward difference: the value one step ahead, minus the value here, divided by h. How wrong is it? The Taylor series tells us. The value one step ahead is f, plus h times the slope, plus h squared over two times the second derivative, and so on. Let's subtract f, and divide by h. We get the slope, plus h over two times the second derivative, plus smaller terms. So the forward difference is off by about h over two times the bend. Halve the step, and you halve the error. [beat] That's called first-order accurate.

> 124 words · 11 sentences · 1 beats · 2487.325–2541.850 s (54.5 s; speech 49.1 s) · 41:27.32–42:21.85 (measured, dry run v3).

## s45_fd_centred
Now the centred difference we used on the map: the value one step ahead, minus the value one step behind, divided by two h. Let's write both with the Taylor series. Ahead is f, plus h times the slope, plus h squared over two times the bend, plus h cubed over six times the third derivative. Behind is the same, but every odd power of h flips its sign. Subtract, and the f terms cancel, and so do the bend terms. Divide by two h, and we're left with the slope, plus h squared over six times the third derivative. [beat] Halve the step, and the error drops to a quarter. That's second-order accurate. [beat] Let's check on the sine curve at x equals one, with a step of zero point one. The forward difference is off by minus zero point zero four three, the centred one by only minus zero point zero zero zero nine. [beat]

> 154 words · 10 sentences · 3 beats · 2541.850–2606.875 s (65.0 s; speech 58.1 s) · 42:21.85–43:26.88 (measured, dry run v3).

## s46_fd_grid
Now the real map at Brest. With the data points eighteen kilometres apart going east, the forward difference gives minus three point three two degrees per hundred kilometres, the backward difference minus three point zero nine, and the centred one minus three point two zero, in between. [beat] Now let's pretend the grid is coarser. With points thirty seven kilometres apart, the centred difference gives minus three point one seven, and seventy four kilometres apart, minus three point one four. [beat] But at one hundred and forty seven kilometres, it drops to minus two point two four, and at two hundred and twenty one kilometres, to minus zero point nine eight. [beat] The coarse grid steps right over the warm front, so it sees a temperature change three times too gentle. That's why weather models use fine grids. The first computer weather forecast, in nineteen fifty, had grid points seven hundred and thirty six kilometres apart. Early climate models had points a few hundred kilometres apart. The leading global forecast models today have grid points about nine kilometres apart. Solving whole equations on grids has its own movie in this series.

> 188 words · 11 sentences · 3 beats · 2606.875–2691.150 s (84.3 s; speech 76.5 s) · 43:26.88–44:51.15 (measured, dry run v3).

## s47_recap
To sum up, a derivative is the slope of the tangent, the rate at one instant. A partial derivative changes one variable and holds the others fixed. Over Brest, the air got colder by three point two degrees per hundred kilometres towards the east, while a fixed thermometer warmed by two point nine degrees per hour. The total differential adds slope times step for each variable, and dividing by time gives the chain rule, the rate a traveller feels. The plane flying east cooled at eight point six degrees per hour, while every place it passed was warming. The Trappes balloon cooled by one point six degrees every minute, almost all of it from rising. Mixed partials don't depend on the order, and that gives the test for a perfect differential. Pressure passes it, heat fails it, and heat divided by temperature passes again. A Taylor series builds a curve from its value, slope, bend and more. Keeping the first two terms is linearisation: about seven percent more saturation vapour pressure, and three point eight more watts per square metre sent to space, for each degree. And the same Taylor series tells us how accurate a weather model's derivatives are.

> 200 words · 11 sentences · 0 beats · 2691.150–2773.025 s (81.9 s; speech 77.6 s) · 44:51.15–46:13.03 (measured, dry run v3).

## s48_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for derivatives and Taylor series, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 59 words · 3 sentences · 0 beats · 2773.025–2796.900 s (23.9 s; speech 22.9 s) · 46:13.03–46:36.90 (measured, dry run v3).

> Total: 6688 words · 415 sentences · 66 beats · 2796.900 s narration · 2799.400 s movie (46:39.40) · 143.5 words per minute.
