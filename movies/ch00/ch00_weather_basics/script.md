# ch00_weather_basics — "Weather basics: pressure, temperature, humidity and wind, from scratch" (Chapter 0B)

Version 4 = user feedback round 1 (UF1, 2026-10-28) on v3 fix 3 (40:05). House style `movies/HOUSE_STYLE.md` (§5 data-source line, colour bars, 3-D for space, globe camera, explain every number). Voice Kokoro `af_bella`, speed 1.0. Feedback: `reports/ch00_weather_basics_user_feedback.md`; data, new functions and CHECK rows: `data_needs.md` §G; visual specs: the 'UF1:' paragraph of each scene's `visual` in `storyboard.yaml`.

**Measured (UF1 dry run, `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/dryrun_uf1`):** 68 scenes, 447 sentences, 7510 words, 27 beats; narration 3051.075 s + 2.5-s end hold = 3053.575 s (50:53.57); speech 2835.4 s; 759 caption cues; 147.7 words per minute overall (158.9 while speaking); self-check {'expected_s': 3051.075, 'audio_s': 3051.075, 'diff_ms': 0.0, 'len_ok': True, 'cues_ok': True}; warnings: none.

Conventions: S<k> = sentence k of the scene; `[beat]` ends a sentence with a 1.5-s hold after a worked calculation (not spoken, not captioned). Numbers are spoken in words, and every number on screen is spoken.

# UF1 change log (every changed sentence; '−' old, '+' new; 'beat' = only a hold added)

> **s00_title**: − old S1: In this video, we'll learn the basics of weather the easy way, and see how meteorology uses them to follow a real storm as it passes over one town. | + S1: In this video, we'll learn the basics of weather the easy way, and see how meteorologists use them to read the weather and follow a real storm over one town.
> **s02_thin_shell**: − old S4: The layer where our weather happens is only about twelve kilometres deep, while the Earth's radius is six thousand three hundred and seventy-one kilometres. | − old S5: On a globe thirty centimetres across, that layer would be about three tenths of a millimetre thick, like three sheets of paper. | + S4: The layer where our weather happens is only about twelve kilometres deep, while the Earth's radius, the distance from its centre to its surface, is six thousand three hundred and seventy-one kilometres. | + S5: How thin is that, really? | + S6: Let's shrink the whole Earth down to a desk globe, thirty centimetres across, so its radius is fifteen centimetres, or one hundred and fifty millimetres. | + S7: First, we find what fraction of the Earth's radius the weather layer is: twelve divided by six thousand three hundred and seventy-one, which is about two thousandths. | + S8: Then we shrink the layer by the same factor as the Earth: two thousandths of one hundred and fifty millimetres is about three tenths of a millimetre. [beat] | + S9: That's like three sheets of paper, painted onto the desk globe.
> **s03_air_parcel**: + S7: Here's one, drawn far bigger than life, riding the real wind over north-western France. | + S8: Wherever the wind goes, the parcel goes, and it carries its own temperature and water vapour along with it.
> **s05_weight_column**: beat after S7 (words unchanged)
> **s08_density**: beat after S4 (words unchanged)
> **s11_gas_law_numbers**: beat after S5 (words unchanged)
> **s12_warm_air_light**: beat after S4 (words unchanged)
> **s14_slab_weight**: − old S2: Its volume is one square metre times delta z, so its mass is rho times delta z. | − old S3: Its weight is that mass times g: rho g delta z. | + S2: First, its volume: its base is one square metre and its thickness is delta z, so its volume, capital V, is one square metre times delta z. | + S3: Next, its mass: mass is density times volume, so m equals rho times V, which is rho, times one square metre, times delta z. | + S4: Last, its weight: weight is mass times g, so W equals rho g delta z, times one square metre. [beat] | + S6: Each push is a pressure times the area it pushes on, one square metre. | − old S6: So p at the bottom, minus p at the top, equals rho g delta z. | − old S7: The pressure at the bottom is bigger, by exactly the weight of the slab. | + S8: The square metre appears in every term, so we can cancel it: p at the bottom, minus p at the top, equals rho g delta z. | + S9: The pressure at the bottom is bigger, by exactly the weight of the slab on each square metre.
> **s16_hydrostatic_numbers**: beat after S2, S4 (words unchanged)
> **s18_scale_height**: − old S1: The group R T over g appears so often that it gets its own name: the scale height, capital H. | + S1: Look at the new rule: the three numbers R, T and g always appear together, as g over R T. | + S2: So let's give the upside-down group, R T over g, its own name: the scale height, capital H. | + S3: With it, our rule becomes much simpler: partial p by partial z equals minus p over H. | + S4: What kind of quantity is H? | − old S5: At fifteen degrees, H is two hundred and eighty-seven times two hundred and eighty-eight point one five, divided by nine point eight one, which is about eight point four kilometres. | − old S6: Here's a nice surprise. | − old S7: If the air kept its ground-level density all the way up, the column would end at p over rho g, and that's the same eight point four kilometres. | + S8: So what does this height mean? | + S9: The rule says that if the pressure kept falling at the rate it has at the start, it would reach zero after a climb of exactly H. | + S10: It never actually gets there, because the fall slows down as the pressure gets smaller, but H tells us the size of climb that matters. | + S11: So H is one number that tells us how deep the atmosphere is: the bigger H is, the more slowly the pressure falls, and the higher the air reaches. | + S12: And because T is on top of the fraction, warmer air has a bigger scale height and reaches higher than colder air.
> **s18b_scale_height_number** (new scene): + S1: So how deep is our air? | + S2: Let's work out H for a typical day at sea level. | + S3: R is two hundred and eighty-seven, the gas constant for dry air. | + S4: T is fifteen degrees, which is two hundred and eighty-eight point one five kelvin. | + S5: And g is nine point eight one metres per second squared. | + S6: So H is two hundred and eighty-seven times two hundred and eighty-eight point one five, divided by nine point eight one, which is about eight point four three kilometres. [beat] | + S7: Here's a nice way to picture that number. | + S8: Imagine squashing all the air in our column to the same density all the way up: the sea-level density, one point two two five kilograms per cubic metre, which we found with the gas law. | + S9: How tall would that column be, if it still had to weigh the same as the real one? | + S10: Its weight on each square metre would be rho g times its height, and that must equal the sea-level pressure, p zero. | + S11: So its height is p zero over rho g: one hundred and one thousand three hundred and twenty-five, divided by one point two two five times nine point eight one. | + S12: That's again about eight point four three kilometres. [beat] | + S13: So the scale height is how tall the atmosphere would be if all its air were as dense as it is at sea level.
> **s19_exponential**: − old S1: So now our rule reads: partial p by partial z equals minus p over H. | − old S2: Let's assume the temperature, and so H, is the same at every height. | − old S3: Divide both sides by p. | − old S4: The left side is now the rate of change of the natural log of p, so log p falls by one over H for every metre we climb. | − old S5: Add that up from the ground, where the pressure is p zero, to height z: the log of p over p zero equals minus z over H. | − old S6: Undo the log, and we get p equals p zero times e to the minus z over H. | + S1: Now let's solve this rule, to find the pressure at any height. | + S2: To keep the steps simple, let's assume the temperature is the same at every height, so that H is one fixed number. | + S3: That's a simplification: the real temperature changes with height, as we'll see soon, but it gives us a clean formula that makes a good first guess. | + S4: First, divide both sides by p: one over p, times partial p by partial z, equals minus one over H. | + S5: Here's a useful fact from calculus: the slope of the natural log of p is one over p. | + S6: So, by the chain rule, the left side is just the rate of change of the natural log of p with height. | + S7: That means the log of p falls by the same amount, one over H, for every metre we climb.
> **s19b_integrate** (new scene): + S1: Now we add up those small falls, from the ground, where z is zero and the pressure is p zero, up to height z, where the pressure is p. | + S2: Adding up small changes is what an integral does, so we integrate both sides. | + S3: On the left, adding up the changes in the log of p gives the log of p, minus the log of p zero. | + S4: On the right, minus one over H for every metre, over a climb of z metres, adds up to minus z over H. | + S5: And the log of p, minus the log of p zero, is the log of p over p zero. | + S6: So the log of p over p zero equals minus z over H. | + S7: The natural log is built on a special number called e, about two point seven two, which turns up with growth and decay just as pi turns up with circles. | + S8: To undo the log, we raise e to the power of each side, and we get p equals p zero times e to the minus z over H. [beat] | + S9: This tells us the pressure at any height z, in air that has the same temperature all the way up.
> **s20_exponential_meaning**: − old S2: Every time we climb one scale height, eight point four kilometres, the pressure is divided by e, which is about two point seven two. | − old S3: And every kilometre takes away the same fraction, about eleven percent of what's left. | − old S4: It's like a stack of foam mattresses: the bottom ones are squeezed the most, because they carry everything above them. | − old S5: Unlike mattresses, though, the air's layers aren't separate, and how much they squeeze also depends on their temperature. | − old S6: So the pressure halves about every five point eight kilometres: to about five hundred hectopascals at five point eight kilometres, and about two hundred and fifty at eleven point seven. | + S2: Let's climb exactly one scale height, so z equals H. | + S3: Then the power is minus H over H, which is minus one, and e to the minus one is one divided by e: about zero point three seven. | + S4: So every time we climb one scale height, eight point four kilometres, the pressure falls to about thirty-seven percent of what it was. [beat] | + S5: From the ground's one thousand and thirteen hectopascals, that's about three hundred and seventy-three at eight point four kilometres, and about one hundred and thirty-seven at sixteen point nine.
> **s20b_per_km** (new scene): + S1: Now let's zoom in on a single kilometre near the ground. | + S2: Our rule says that each metre we climb takes away one over H of the pressure. | + S3: So one kilometre takes away about one kilometre divided by eight point four three kilometres, which is about twelve percent. | + S4: But the pressure shrinks a little as we climb through that kilometre, so the real fall is slightly less: one minus e to the minus one over eight point four three, which is about eleven percent. [beat] | + S5: Eleven percent of what? | + S6: Of the pressure at the bottom of that kilometre. | + S7: So the first kilometre takes one thousand and thirteen hectopascals down to about nine hundred, and the next takes nine hundred down to about eight hundred. | + S8: Each kilometre takes away the same fraction, so the drops get smaller as we go up: about a hundred and thirteen hectopascals in the first kilometre, but only about a hundred and one in the second.
> **s20c_equal_slabs** (new scene): + S1: Here's another way to see why the curve bends. | + S2: Let's cut our column into ten slabs that each hold the same amount of air: one tenth of the total, about a thousand kilograms above each square metre. | + S3: The bottom slab is only about nine hundred metres thick, because it carries the weight of all the air above it and is squeezed the most. | + S4: Each slab higher up has less air pressing down on it, so it's squeezed less and is thicker. | + S5: The ninth slab reaches up to about nineteen kilometres, and the last one thins out with no sharp top at all. | + S6: It's like a stack of foam mattresses: the bottom ones are squeezed the most, because they carry everything above them. | + S7: Unlike mattresses, though, the air's layers aren't separate, and how much they squeeze also depends on their temperature.
> **s20d_halving** (new scene): + S1: Now let's find the height where the pressure has halved. | + S2: Start again from the log of p over p zero equals minus z over H, and multiply both sides by minus H. | + S3: The log of a fraction turned upside down is minus the log of the fraction, so we get z equals H times the log of p zero over p. | + S4: This formula gives the height for any pressure we choose. | + S5: For half the ground pressure, p zero over p is two, so z equals eight point four three times the log of two. | + S6: The log of two is about zero point six nine, so z is about five point eight kilometres. [beat] | + S7: So the pressure halves about every five point eight kilometres: to about five hundred hectopascals at five point eight kilometres, and about two hundred and fifty at eleven point seven.
> **s22_mass_below**: − old S2: At about five and a half kilometres, the pressure is half its ground value, so half of all the air is below us. | − old S3: At sixteen kilometres, it's about one tenth, so nine tenths of the air is below. | + S2: At the ground, the pressure p zero is the weight of the whole column, and at height z, the pressure p is the weight of only the air above z. | + S3: So p over p zero is the share of all the air that's above us, and the share below is one minus p over p zero. | + S4: This time, let's use the standard atmosphere, an average of real measurements that gets colder as we go up. | + S5: At about five and a half kilometres, its pressure is about five hundred and five hectopascals, close to half of one thousand and thirteen. | + S6: So p over p zero is about one half, and one minus a half is a half: half of all the air is below us. [beat] | + S7: That's a little lower than our five point eight kilometres, because colder air has a smaller scale height. | + S8: At sixteen kilometres, the pressure is about one tenth of its ground value, so nine tenths of the air is below.
> **s26_why_cold_aloft**: − old S4: Warm air near the ground rises. | + S4: Here's a real sunny morning over northern France, on the twenty-fourth of June, twenty twenty-four, seen from a satellite. | + S5: Heights in this picture are drawn twenty times taller than distances on the map. | + S6: Warm air near the ground rises, in bubbles called thermals. | − old S7: We'll use this cooling for clouds in a moment. | + S9: A weather balloon launched near Paris at midday that day agrees: in the lowest one and a half kilometres, the temperature fell by about ten degrees for every kilometre. [beat] | + S10: By the early afternoon, the rising air had cooled enough to make clouds, and the satellite saw the sky fill with them. | + S11: We'll work out exactly where those clouds begin a little later.
> **s27_vapour**: − old S7: Twenty grams per kilogram at sea level is a vapour pressure of about thirty-two hectopascals, out of about a thousand.
> **s27b_vapour_pressure** (new scene): + S1: How big is that share? | + S2: There's a handy rule for it: e is about one point six one, times q, times p. | + S3: Here e is the vapour pressure, q is the specific humidity written in kilograms of vapour per kilogram of air, and p is the air pressure. | + S4: Careful: this e is just the usual letter for vapour pressure, not the number e from before. | + S5: Where does one point six one come from? | + S6: Pressure comes from molecules hitting things, so the vapour's share of the pressure is its share of the molecules. | + S7: A water molecule is lighter than an average air molecule: it weighs about eighteen atomic mass units, against about twenty-nine. | + S8: So a kilogram of vapour holds about twenty-nine divided by eighteen, or one point six one, times as many molecules as a kilogram of air. | + S9: That's why the vapour's share of the molecules, and so of the pressure, is about one point six one times its share of the mass, q. | + S10: Let's try the steamiest tropical air: q is twenty grams per kilogram, which is zero point zero two, and p is about a thousand hectopascals. | + S11: So e is about one point six one times zero point zero two times a thousand, which is about thirty-two hectopascals, out of about a thousand. [beat]
> **s29_relative_humidity**: beat after S5 (words unchanged)
> **s30_dew_point**: beat after S3 (words unchanged)
> **s31_cloud_base**: beat after S5 (words unchanged)
> **s32_wind_vector**: beat after S6 (words unchanged)
> **s33_wind_direction**: beat after S5 (words unchanged)
> **s34_wind_units**: beat after S6 (words unchanged)
> **s40_sea_level**: beat after S6 (words unchanged)
> **s47_cold_front**: + S2: Here is a real slice through the air around Storm Ciarán, from the reanalysis, at six in the evening on the first of November, running from west to east through Brest. | + S3: The colours show how much warmer or colder the air is than the average at the same height, and the moving dots follow the wind inside the slice.
> **s48_warm_front**: + S1: Now let's move east along the same slice, to the warm front near Brest. | − old S5: We've drawn these side views fifty times taller than they really are, so the slopes look much steeper than in nature. | + S6: In this slice, heights are drawn eighty times taller than distances along the ground, so the slopes look much steeper than in nature.
> **s51_heating**: beat after S5 (words unchanged)
> **s56_brest_pressure**: beat after S4 (words unchanged)
> **s58_brest_cold_front**: beat after S3 (words unchanged)

## s00_title
In this video, we'll learn the basics of weather the easy way, and see how meteorologists use them to read the weather and follow a real storm over one town.

> 30 words · 1 sentences · 0.300–11.500 s (11.2 s; speech 10.4 s) · 0:00.30–0:11.50 (measured) · beat: opening title · UF1: U-WB-01 (kept), U-WB-02, R1.
> Screen: 'Weather' / 'basics' 150 px TitleGradient; 'made easy' 96 px (pulse on 'the easy way'); 'and how meteorologists' / 'read the weather' 68 px, 'meteorologists' teal; right: globe + balloon, then Ciarán with Brest's pressure; two source lines
> Source line(s): [S1] Data: NASA GIBS · IGRA v2 radiosonde (NOAA NCEI) · ERA5 (Copernicus C3S) · 1–2 Nov 2023 / [AT(1, "meteorologists")] Image: NASA MODIS (NASA GIBS), 1 Nov 2023 · isobars: ERA5 (Copernicus C3S), 1 Nov 12 UTC – 2 Nov 03 UTC · Brest

## s01_hook
What is weather made of? Let's see what air pressure, temperature, humidity and wind are, why they behave the way they do, and how they come together in a real storm.

> 31 words · 2 sentences · 11.500–23.625 s (12.1 s; speech 11.0 s) · 0:11.50–0:23.62 (measured) · beat: hook question · UF1: U-WB-03, R1, R4.
> Screen: Globe3D from frame 0 (true colour 2023-11-02 12 UTC, Ciarán spiral visible); keywords appear on their words: 'pressure', 'temperature', 'humidity', 'wind' (54 px) round the globe with tiny icons (barometer, thermometer, droplet, wind arrow)
> Source line(s): [S1] Image: NASA VIIRS true colour (NASA GIBS) · 2 Nov 2023

## s02_thin_shell
Let's start with the air itself. The atmosphere is the layer of air that wraps around the Earth, held down by gravity. It's much thinner than most pictures suggest. The layer where our weather happens is only about twelve kilometres deep, while the Earth's radius, the distance from its centre to its surface, is six thousand three hundred and seventy-one kilometres. How thin is that, really? Let's shrink the whole Earth down to a desk globe, thirty centimetres across, so its radius is fifteen centimetres, or one hundred and fifty millimetres. First, we find what fraction of the Earth's radius the weather layer is: twelve divided by six thousand three hundred and seventy-one, which is about two thousandths. Then we shrink the layer by the same factor as the Earth: two thousandths of one hundred and fifty millimetres is about three tenths of a millimetre. [beat] That's like three sheets of paper, painted onto the desk globe. So from now on, we'll draw the air fifty times thicker than it really is, just so we can see it.

> 177 words · 10 sentences · 23.625–96.125 s (72.5 s; speech 67.4 s) · 0:23.62–1:36.12 (measured) · beat: building blocks · the atmosphere · UF1: U-WB-03, U-WB-04, U-WB-05, R1, R4, R5.
> Screen: globe turns and zooms; quarter wedge opens with a bold orange radius '6371 km' from the centre; desk globe '30 cm', 'radius 150 mm'; 12/6371 ≈ 0.002; 0.002 × 150 mm ≈ 0.3 mm; 3 sheets of paper; ×50 shell
> Source line(s): [S1] Image: NASA VIIRS true colour (NASA GIBS) · 2 Nov 2023

## s03_air_parcel
Air is a mixture of gases. By volume, about seventy-eight percent is nitrogen, twenty-one percent is oxygen, and almost one percent is argon. Carbon dioxide is only about four hundredths of one percent, and water vapour comes and goes, from almost nothing to a few percent. All of it is made of molecules that zip around at hundreds of metres per second, bumping into each other billions of times every second. We can't follow single molecules, so meteorologists talk about air parcels. An air parcel is a small volume of air that moves with the flow: big enough to hold countless molecules, but small compared with the weather around it. Here's one, drawn far bigger than life, riding the real wind over north-western France. Wherever the wind goes, the parcel goes, and it carries its own temperature and water vapour along with it.

> 143 words · 8 sentences · 96.125–157.250 s (61.1 s; speech 57.9 s) · 1:36.12–2:37.25 (measured) · beat: building blocks · what air is · UF1: U-WB-06, R1, R3, R4.
> Screen: globe -> composition bar -> molecule box -> flight to Brittany -> Cesium 3-D landscape with a translucent teal parcel box riding the real ERA5 wind, trail, 'air parcel' label, thermometer and droplet icons
> Source line(s): [S1] Image: NASA VIIRS true colour (NASA GIBS) · 2 Nov 2023 / [AT(7, "Here's one")] Data: ERA5 10-m wind (Copernicus C3S) · 1 Nov 2023, 12–18 UTC · Brittany, France · relief: ETOPO 2022 (NOAA NCEI) · image: Blue Marble NG (NASA)

## s04_pressure_what
Now let's look at air pressure. Those fast molecules keep hitting every surface they meet: your skin, the walls of a room, the surface of the sea. Each hit is a tiny push, and billions of them add up to a steady force. Pressure is that force divided by the area it pushes on. In air at rest, it pushes equally in every direction: up, down and sideways. Its unit is the pascal, one newton of force on each square metre.

> 81 words · 6 sentences · 157.250–189.775 s (32.5 s; speech 30.0 s) · 2:37.25–3:09.78 (measured) · beat: building blocks · pressure · UF1: —.
> Screen: molecule box against a wall -> orange push arrows on a small square; 'p = force ÷ area'; arrows on a cube in 6 directions 'equal'; '1 Pa = 1 N/m²'

## s05_weight_column
So how big is the pressure at the ground, and where does it come from? Picture a tall column of air standing on one square metre of ground, reaching all the way to the top of the atmosphere. Gravity pulls all that air down, and the ground has to hold up its weight. At sea level, the average pressure is one hundred and one thousand three hundred and twenty-five pascals. Weight is mass times g, where g is the pull of gravity, nine point eight one metres per second squared. So the mass in our column is the pressure divided by g. That's about ten thousand three hundred kilograms of air above every square metre, as heavy as seven cars. [beat] So the pressure at the ground is the weight of all the air above it, spread over each square metre.

> 140 words · 8 sentences · 189.775–243.000 s (53.2 s; speech 48.8 s) · 3:09.78–4:03.00 (measured) · beat: building blocks · pressure is weight · UF1: U-WB-07, R3, beat.
> Screen: 3-D column on a 1 m² square (sky-blue, fading upward); 'p₀ = 101 325 Pa'; 'weight = m g', 'g = 9.81 m/s²'; CalcStack m = p₀/g = 101325/9.81 ≈ 10 300 kg; seven car icons on a scale

## s06_not_crushed
Why doesn't this crush us? Because the air pushes from every side at once, and the air and fluids inside our bodies push back out just as hard. The pushes balance, so we don't feel them. We only notice when the balance breaks for a moment: your ears pop in a fast lift or a climbing plane, because the outside pressure changes before the inside catches up.

> 67 words · 4 sentences · 243.000–268.825 s (25.8 s; speech 24.0 s) · 4:03.00–4:28.82 (measured) · beat: building blocks · why we don't feel it · UF1: —.
> Screen: simple person silhouette with equal orange arrows in and teal arrows out; 'balance'; a lift icon with an ear and a small '−' gap pulsing

## s07_hpa
Pascals give big numbers, so weather maps use hectopascals. One hectopascal is one hundred pascals, so the average pressure at sea level is one thousand and thirteen hectopascals. Older maps use millibars, which are exactly the same size, so the numbers don't change. The instrument that measures pressure is called a barometer. Day to day, the reading at sea level moves up or down by only a few percent. Yet those few percent are what drive the winds, as we'll see.

> 81 words · 6 sentences · 268.825–304.900 s (36.1 s; speech 33.5 s) · 4:28.82–5:04.90 (measured) · beat: building blocks · hectopascals · UF1: R1.
> Screen: '1 hPa = 100 Pa'; '101 325 Pa = 1013.25 hPa ≈ 1013 hPa'; '1 hPa = 1 mb'; barometer dial 950-1050 with needle at 1013; '± a few %'
> Source line(s): [AT(5, "Day to day")] Data: ERA5 sea-level pressure (Copernicus C3S) · Brest · 1–2 Nov 2023

## s08_density
Next, density. Density tells us how much mass is packed into each cubic metre, and we write it with the Greek letter rho. Air near the ground has a density of about one point two kilograms per cubic metre. So a room five metres long, four metres wide and two and a half metres high holds fifty cubic metres of air, which is about sixty kilograms: as much as a person. [beat]

> 71 words · 4 sentences · 304.900–333.075 s (28.2 s; speech 25.6 s) · 5:04.90–5:33.07 (measured) · beat: building blocks · density · UF1: —.
> Screen: 'ρ' (rho) 'density, kg/m³'; '≈ 1.2 kg/m³'; room box 5 m × 4 m × 2.5 m with labelled edges; CalcStack 5 × 4 × 2.5 = 50 m³; 50 × 1.2 = 60 kg; person icon

## s09_temperature
Temperature measures how fast the molecules jiggle on average: the warmer the air, the faster they move. Weather reports use degrees Celsius, but physics uses kelvin. To get kelvin, add two hundred and seventy-three point one five to the Celsius number, so fifteen degrees Celsius is two hundred and eighty-eight point one five kelvin. A kelvin step is the same size as a degree Celsius step; only the starting point moves. Zero kelvin is the coldest anything can be, so a temperature in kelvin is never negative. That's why the gas law, which comes next, uses kelvin.

> 97 words · 6 sentences · 333.075–376.350 s (43.3 s; speech 40.7 s) · 5:33.07–6:16.35 (measured) · beat: building blocks · temperature and kelvin · UF1: —.
> Screen: two molecule boxes side by side (slow / fast dots) 'colder' / 'warmer'; two aligned thermometer scales °C and K with ticks 0/273.15, 15/288.15, −273.15/0; 'T(K) = T(°C) + 273.15'

## s10_gas_law
Now let's connect pressure, density and temperature. Think about what makes the molecules push harder on a wall. If we pack more molecules into each cubic metre, more of them hit the wall each second, so the pressure goes up with the density. If the molecules move faster, each one hits harder and more often, so the pressure goes up with the temperature. Put together, the pressure is proportional to density times temperature: p equals rho R T. This is called the ideal gas law. Here p is the pressure in pascals, rho is the density, T is the temperature in kelvin, and R is a fixed number for dry air, called the gas constant: two hundred and eighty-seven joules per kilogram per kelvin.

> 124 words · 7 sentences · 376.350–426.325 s (50.0 s; speech 47.1 s) · 6:16.35–7:06.32 (measured) · beat: building blocks · the ideal gas law, built · UF1: —.
> Screen: two contrast boxes: 'more molecules → more hits' (ρ ×2 → p ×2), 'faster → harder, more often' (T ↑ → p ↑); Layered TeX p = ρ R T with underbraces 'pressure (Pa)', 'density', 'gas constant', 'temperature (K)'; 'R = 287 J kg⁻¹ K⁻¹'

## s11_gas_law_numbers
Let's use it. What is the density of air at sea level, at one thousand and thirteen hectopascals and fifteen degrees? We turn the law around: rho equals p divided by R T. That's one hundred and one thousand three hundred and twenty-five pascals, divided by two hundred and eighty-seven times two hundred and eighty-eight point one five. The answer is about one point two two five kilograms per cubic metre, the number we used for the room. [beat]

> 78 words · 5 sentences · 426.325–460.075 s (33.8 s; speech 30.8 s) · 7:06.32–7:40.07 (measured) · beat: building blocks · worked number · UF1: —.
> Screen: CalcStack ρ = p/(RT) = 101 325 / (287 × 288.15) ≈ 1.225 kg/m³; gold link to the s08 room thumbnail '1.2'

## s12_warm_air_light
Now let's keep the pressure fixed and change only the temperature. At zero degrees, the density comes out at about one point two nine kilograms per cubic metre. At thirty degrees, it's about one point one six. So at the same pressure, warm air is about ten percent lighter than cold air. [beat] That's why a hot-air balloon floats, and why warm air tends to rise while cold air tends to sink. We'll meet this again with weather fronts.

> 78 words · 6 sentences · 460.075–493.200 s (33.1 s; speech 29.4 s) · 7:40.07–8:13.20 (measured) · beat: intuition · warm air is lighter · UF1: —.
> Screen: two cubes side by side at 1013 hPa: '0 °C → 1.29 kg/m³' (slate) and '30 °C → 1.16 kg/m³' (orange); '≈ 10 % lighter'; hot-air balloon icon rising

## s13_slab
Now let's work out how the pressure changes as we go up. Our goal is a rule for how fast it falls with height. Take a thin slab of air inside our column, standing on one square metre, with a small thickness, delta z. Here z is height, and delta z means a small step in height. The slab is at rest, so the forces on it must balance. The air below pushes it up, with a force equal to the pressure at its bottom, because the area is one square metre. The air above pushes it down, with the pressure at its top. And gravity pulls it down with its weight.

> 112 words · 8 sentences · 493.200–534.175 s (41.0 s; speech 37.7 s) · 8:13.20–8:54.17 (measured) · beat: why · pressure with height (setup) · UF1: U-WB-08, R3.
> Screen: the s05 column with a thin slab highlighted; 'z' axis up; bracket 'Δz'; three arrows on the slab: orange up 'p(z)', orange down 'p(z + Δz)', brown down 'weight'

## s14_slab_weight
What does the slab weigh? First, its volume: its base is one square metre and its thickness is delta z, so its volume, capital V, is one square metre times delta z. Next, its mass: mass is density times volume, so m equals rho times V, which is rho, times one square metre, times delta z. Last, its weight: weight is mass times g, so W equals rho g delta z, times one square metre. [beat] Now the balance. Each push is a pressure times the area it pushes on, one square metre. The push up, minus the push down, equals the weight. The square metre appears in every term, so we can cancel it: p at the bottom, minus p at the top, equals rho g delta z. The pressure at the bottom is bigger, by exactly the weight of the slab on each square metre.

> 146 words · 9 sentences · 534.175–594.200 s (60.0 s; speech 55.3 s) · 8:54.17–9:54.20 (measured) · beat: why · the slab balance · UF1: U-WB-09, R3, R5.
> Screen: 3-D slab; V = 1 m² × Δz; m = ρV = ρ × 1 m² × Δz; W = mg = ρgΔz × 1 m²; force balance with × 1 m² struck → p(z) − p(z+Δz) = ρgΔz

## s15_hydrostatic
Let's tidy this up. The pressure at the top minus the pressure at the bottom is the change in pressure across the slab, delta p. It's negative, because the pressure falls as we go up. So delta p equals minus rho g delta z. Divide both sides by delta z, and let the slab get thinner and thinner. Delta p over delta z becomes the derivative, partial p by partial z: how fast the pressure changes with height. Partial means only the height changes; the place and the time stay fixed. So partial p by partial z equals minus rho g. This is called hydrostatic balance: at every height, the pressure holds up the weight of the air above.

> 119 words · 9 sentences · 594.200–644.500 s (50.3 s; speech 46.7 s) · 9:54.20–10:44.50 (measured) · beat: why · hydrostatic balance · UF1: R3.
> Screen: CalcStack Δp = −ρ g Δz → Δp/Δz = −ρ g → ∂p/∂z = −ρ g (main eq 96 px) with underbraces 'how fast p changes with height', 'weight per m³'; keyword 'hydrostatic balance'

## s16_hydrostatic_numbers
How fast is that near the ground? Rho is about one point two two five, and g is nine point eight one, so the pressure falls by about twelve pascals for every metre we climb. [beat] That's one hectopascal for about every eight metres. Ride a lift to the top of a three-hundred-metre tower, and the pressure drops by about thirty-six hectopascals. [beat] That's the change your ears notice. Hydrostatic balance holds very well for large weather systems, because their up and down accelerations are tiny compared with gravity.

> 87 words · 6 sentences · 644.500–685.275 s (40.8 s; speech 35.9 s) · 10:44.50–11:25.27 (measured) · beat: why · how fast near the ground · UF1: —.
> Screen: CalcStack ρ g = 1.225 × 9.81 ≈ 12 Pa/m; 100 Pa ÷ 12 Pa/m ≈ 8 m per hPa; 300 m × 12 Pa/m ≈ 3600 Pa = 36 hPa; tower with a lift icon and readout 1013 → 977 hPa

## s17_combine
But rho isn't fixed: the higher we go, the thinner the air. So let's bring in the gas law. It says rho equals p over R T. Let's put that into hydrostatic balance, in place of rho. We get partial p by partial z equals minus p g over R T. Now the fall in pressure per metre is proportional to the pressure itself. Where the pressure is high, near the ground, it falls fast. Higher up, where there's less pressure, it falls more slowly.

> 85 words · 8 sentences · 685.275–720.600 s (35.3 s; speech 32.1 s) · 11:25.27–12:00.60 (measured) · beat: why · bring in the gas law · UF1: —.
> Screen: ∂p/∂z = −ρ g with ρ highlighted; ρ = p/(RT) slides in; result ∂p/∂z = −p g/(RT); two small slope arrows on a p(z) sketch: steep low down, gentle higher up

## s18_scale_height
Look at the new rule: the three numbers R, T and g always appear together, as g over R T. So let's give the upside-down group, R T over g, its own name: the scale height, capital H. With it, our rule becomes much simpler: partial p by partial z equals minus p over H. What kind of quantity is H? Let's check its units. R is in joules per kilogram per kelvin, and a joule per kilogram is a metre squared per second squared. Multiply by T in kelvin, divide by g in metres per second squared, and we're left with metres: a height. So what does this height mean? The rule says that if the pressure kept falling at the rate it has at the start, it would reach zero after a climb of exactly H. It never actually gets there, because the fall slows down as the pressure gets smaller, but H tells us the size of climb that matters. So H is one number that tells us how deep the atmosphere is: the bigger H is, the more slowly the pressure falls, and the higher the air reaches. And because T is on top of the fraction, warmer air has a bigger scale height and reaches higher than colder air.

> 214 words · 12 sentences · 720.600–801.400 s (80.8 s; speech 76.2 s) · 12:00.60–13:21.40 (measured) · beat: why · the scale height · UF1: U-WB-10, U-WB-11, U-WB-12, R3, R5.
> Screen: rule with g, R, T grouped → H = RT/g 'scale height' → ∂p/∂z = −p/H; units built word by word; tangent reaching 0 at H; 'H = how deep the air is'; colder/warmer columns

## s18b_scale_height_number
So how deep is our air? Let's work out H for a typical day at sea level. R is two hundred and eighty-seven, the gas constant for dry air. T is fifteen degrees, which is two hundred and eighty-eight point one five kelvin. And g is nine point eight one metres per second squared. So H is two hundred and eighty-seven times two hundred and eighty-eight point one five, divided by nine point eight one, which is about eight point four three kilometres. [beat] Here's a nice way to picture that number. Imagine squashing all the air in our column to the same density all the way up: the sea-level density, one point two two five kilograms per cubic metre, which we found with the gas law. How tall would that column be, if it still had to weigh the same as the real one? Its weight on each square metre would be rho g times its height, and that must equal the sea-level pressure, p zero. So its height is p zero over rho g: one hundred and one thousand three hundred and twenty-five, divided by one point two two five times nine point eight one. That's again about eight point four three kilometres. [beat] So the scale height is how tall the atmosphere would be if all its air were as dense as it is at sea level.

> 228 words · 13 sentences · 801.400–890.175 s (88.8 s; speech 81.5 s) · 13:21.40–14:50.17 (measured) · beat: why · the scale height in numbers · UF1: U-WB-13, R3, R5.
> Screen: R = 287 'gas constant, dry air'; T = 15 °C = 288.15 K; g = 9.81; H = 287 × 288.15 / 9.81 ≈ 8.43 km; uniform box at ρ₀ = 1.225 rises to 8.43 km beside the real fading column; ρ₀ g h = p₀; h = p₀/(ρ₀g) ≈ 8.43 km linked to H

## s19_exponential
Now let's solve this rule, to find the pressure at any height. To keep the steps simple, let's assume the temperature is the same at every height, so that H is one fixed number. That's a simplification: the real temperature changes with height, as we'll see soon, but it gives us a clean formula that makes a good first guess. First, divide both sides by p: one over p, times partial p by partial z, equals minus one over H. Here's a useful fact from calculus: the slope of the natural log of p is one over p. So, by the chain rule, the left side is just the rate of change of the natural log of p with height. That means the log of p falls by the same amount, one over H, for every metre we climb.

> 139 words · 7 sentences · 890.175–942.400 s (52.2 s; speech 49.3 s) · 14:50.17–15:42.40 (measured) · beat: why · solving for p(z) · UF1: U-WB-14, R5.
> Screen: ∂p/∂z = −p/H; 'assume same T'; 'real T changes'; divide by p; d ln p/dp = 1/p; ∂ln p/∂z = −1/H; ln p falls in a straight line

## s19b_integrate
Now we add up those small falls, from the ground, where z is zero and the pressure is p zero, up to height z, where the pressure is p. Adding up small changes is what an integral does, so we integrate both sides. On the left, adding up the changes in the log of p gives the log of p, minus the log of p zero. On the right, minus one over H for every metre, over a climb of z metres, adds up to minus z over H. And the log of p, minus the log of p zero, is the log of p over p zero. So the log of p over p zero equals minus z over H. The natural log is built on a special number called e, about two point seven two, which turns up with growth and decay just as pi turns up with circles. To undo the log, we raise e to the power of each side, and we get p equals p zero times e to the minus z over H. [beat] This tells us the pressure at any height z, in air that has the same temperature all the way up.

> 199 words · 9 sentences · 942.400–1012.450 s (70.1 s; speech 65.3 s) · 15:42.40–16:52.45 (measured) · beat: why · solving for p(z): the integration · UF1: U-WB-14, R5.
> Screen: limits on the ln p inset; ∫ dp'/p' = −(1/H)∫ dz'; left → ln p − ln p₀; right → −z/H; ln(p/p₀) = −z/H; e ≈ 2.72; p = p₀e^(−z/H) while the curve draws

## s20_exponential_meaning
What does this curve tell us? Let's climb exactly one scale height, so z equals H. Then the power is minus H over H, which is minus one, and e to the minus one is one divided by e: about zero point three seven. So every time we climb one scale height, eight point four kilometres, the pressure falls to about thirty-seven percent of what it was. [beat] From the ground's one thousand and thirteen hectopascals, that's about three hundred and seventy-three at eight point four kilometres, and about one hundred and thirty-seven at sixteen point nine.

> 96 words · 5 sentences · 1012.450–1052.425 s (40.0 s; speech 36.6 s) · 16:52.45–17:32.42 (measured) · beat: intuition · what the curve says · UF1: U-WB-15, R5.
> Screen: marker climbs to z = H; e^{-1} = 1/e ≈ 1/2.72 ≈ 0.37; 'falls to 37 % every 8.4 km'; 1013 → 373 → 137 hPa

## s20b_per_km
Now let's zoom in on a single kilometre near the ground. Our rule says that each metre we climb takes away one over H of the pressure. So one kilometre takes away about one kilometre divided by eight point four three kilometres, which is about twelve percent. But the pressure shrinks a little as we climb through that kilometre, so the real fall is slightly less: one minus e to the minus one over eight point four three, which is about eleven percent. [beat] Eleven percent of what? Of the pressure at the bottom of that kilometre. So the first kilometre takes one thousand and thirteen hectopascals down to about nine hundred, and the next takes nine hundred down to about eight hundred. Each kilometre takes away the same fraction, so the drops get smaller as we go up: about a hundred and thirteen hectopascals in the first kilometre, but only about a hundred and one in the second.

> 158 words · 8 sentences · 1052.425–1114.675 s (62.2 s; speech 57.9 s) · 17:32.42–18:34.67 (measured) · beat: intuition · eleven percent per kilometre · UF1: U-WB-16, R5.
> Screen: zoom on the lowest 2 km; 1 km / 8.43 km ≈ 0.12; 1 − e^(−1/8.43) ≈ 0.11; '11 % of the pressure at the bottom of that kilometre'; 1013 → 900 → 800 hPa; drops −113 and −101 hPa

## s20c_equal_slabs
Here's another way to see why the curve bends. Let's cut our column into ten slabs that each hold the same amount of air: one tenth of the total, about a thousand kilograms above each square metre. The bottom slab is only about nine hundred metres thick, because it carries the weight of all the air above it and is squeezed the most. Each slab higher up has less air pressing down on it, so it's squeezed less and is thicker. The ninth slab reaches up to about nineteen kilometres, and the last one thins out with no sharp top at all. It's like a stack of foam mattresses: the bottom ones are squeezed the most, because they carry everything above them. Unlike mattresses, though, the air's layers aren't separate, and how much they squeeze also depends on their temperature.

> 140 words · 7 sentences · 1114.675–1167.850 s (53.2 s; speech 50.3 s) · 18:34.67–19:27.85 (measured) · beat: intuition · why the curve bends (equal-mass slabs) · UF1: U-WB-17, R3.
> Screen: 3-D column of ten equal-mass slabs (≈ 1000 kg each) thickening upward: bottom ≈ 900 m, ninth top ≈ 19 km, last fades out; like foam mattresses / unlike

## s20d_halving
Now let's find the height where the pressure has halved. Start again from the log of p over p zero equals minus z over H, and multiply both sides by minus H. The log of a fraction turned upside down is minus the log of the fraction, so we get z equals H times the log of p zero over p. This formula gives the height for any pressure we choose. For half the ground pressure, p zero over p is two, so z equals eight point four three times the log of two. The log of two is about zero point six nine, so z is about five point eight kilometres. [beat] So the pressure halves about every five point eight kilometres: to about five hundred hectopascals at five point eight kilometres, and about two hundred and fifty at eleven point seven.

> 142 words · 7 sentences · 1167.850–1223.200 s (55.4 s; speech 51.3 s) · 19:27.85–20:23.20 (measured) · beat: intuition · the halving height · UF1: U-WB-18, R5.
> Screen: ln(p/p₀) = −z/H → ×(−H) → z = H ln(p₀/p); p₀/p = 2 → z = 8.43 × ln 2 ≈ 8.43 × 0.69 ≈ 5.8 km; halving marks ≈ 500 hPa at 5.8 km, ≈ 250 hPa at 11.7 km

## s21_balloon_pressure
Does the real atmosphere follow this curve? Let's check it against a real weather balloon. Twice a day, at hundreds of places around the world, meteorologists launch a balloon carrying a small instrument package called a radiosonde. As it rises, it radios back the pressure, the temperature and the humidity, and from its drift we get the wind. This one was launched near Paris around midnight, at the start of the first of November, twenty twenty-three. In the picture, heights are drawn ten times taller than distances on the map, so that we can see the climb. Near the ground, its pressure follows our curve closely. Higher up, the real pressure falls a little faster, because the real air up there is colder, and colder air has a smaller scale height. So our curve is a good first guess, and the measurements tell us where it needs correcting.

> 148 words · 9 sentences · 1223.200–1281.475 s (58.3 s; speech 54.7 s) · 20:23.20–21:21.47 (measured) · beat: intuition · check against a real balloon · UF1: U-WB-19, R1.
> Screen: balloon rising from Trappes on a small true-colour map of France; graph: measured p(z) teal dots vs slate curve H = 8.4 km; gap highlighted aloft 'colder → smaller H'; Everest tick at 8.8 km with both values
> Source line(s): [S1] Data: IGRA v2 radiosonde (NOAA NCEI) · Trappes, near Paris · 1 Nov 2023, 00 UTC · image: NASA MODIS (NASA GIBS), 1 Nov 2023

## s22_mass_below
Since pressure is the weight of the air above, the pressure at any height also tells us how much air is left above it. At the ground, the pressure p zero is the weight of the whole column, and at height z, the pressure p is the weight of only the air above z. So p over p zero is the share of all the air that's above us, and the share below is one minus p over p zero. This time, let's use the standard atmosphere, an average of real measurements that gets colder as we go up. At about five and a half kilometres, its pressure is about five hundred and five hectopascals, close to half of one thousand and thirteen. So p over p zero is about one half, and one minus a half is a half: half of all the air is below us. [beat] That's a little lower than our five point eight kilometres, because colder air has a smaller scale height. At sixteen kilometres, the pressure is about one tenth of its ground value, so nine tenths of the air is below. And by about thirty-one kilometres, ninety-nine percent of the air is below. That's why the atmosphere is such a thin shell.

> 208 words · 10 sentences · 1281.475–1357.725 s (76.2 s; speech 71.2 s) · 21:21.47–22:37.72 (measured) · beat: intuition · how much air is below · UF1: U-WB-20, R1, R3, R4, R5.
> Screen: 3-D column; brackets 'p₀: weight of all the air', 'p: weight above z'; share above = p/p₀, share below = 1 − p/p₀; 5.5 km 505 hPa → 0.50; 16 km 90 %; 31 km 99 %; ×50 globe
> Source line(s): [AT(4, "standard atmosphere")] Standard atmosphere: U.S. Standard Atmosphere 1976 (NOAA/NASA/USAF) / [AT(10, "thin shell")] Image: NASA VIIRS true colour (NASA GIBS) · 2 Nov 2023

## s23_troposphere
Now let's look at the temperature that the same balloon measured. Here, height goes up and temperature goes across. Near the ground it's mild, and as the balloon climbs, the temperature falls, by about six and a half degrees for every kilometre on average. This lowest layer, where the temperature falls with height, is called the troposphere, from a Greek word for turning, because its air keeps overturning and mixing. Almost all our weather happens here: the clouds, the rain and the storms.

> 83 words · 5 sentences · 1357.725–1392.400 s (34.7 s; speech 32.5 s) · 22:37.72–23:12.40 (measured) · beat: building blocks · the layers (temperature) · UF1: U-WB-21, R1.
> Screen: graph T(z) from the Trappes sounding (orange line, height 0-35 km up, T −80 … +20 °C across); slope triangle '−6.5 °C per km'; band 0-11 km shaded 'troposphere'; cloud icons in the band
> Source line(s): [S1] Data: IGRA v2 radiosonde (NOAA NCEI) · Trappes, near Paris · 1 Nov 2023, 00 UTC

## s24_stratosphere
At about eleven kilometres, at about minus sixty-three degrees, the fall stops. This boundary is called the tropopause. Above it, the temperature stops falling, and higher up it rises again. That's the stratosphere, a calm, layered region, where ozone absorbs the sun's ultraviolet light and warms the air. Balloons usually burst at around thirty kilometres, but other measurements show the warming going on above that, up to about fifty kilometres on average. Above that come the mesosphere and the thermosphere, where the air is extremely thin.

> 86 words · 6 sentences · 1392.400–1432.950 s (40.5 s; speech 38.0 s) · 23:12.40–23:52.95 (measured) · beat: building blocks · tropopause and stratosphere · UF1: U-WB-21, R1.
> Screen: tropopause line at ≈ 11 km '≈ −55 °C'; stratosphere band; balloon bursts ~30 km; dashed slate extension to 48 km (reanalysis, same place and time); ozone keyword with sun rays; 'mesosphere', 'thermosphere' above
> Source line(s): [S1] Data: IGRA v2 radiosonde (NOAA NCEI), Trappes, 1 Nov 2023, 00 UTC · above the burst: ERA5 (Copernicus C3S), same place and time · above 47 km: U.S. Standard Atmosphere 1976

## s25_tropics
Now let's keep the time the same and change only the place. Here is a balloon launched at the same moment at Singapore, near the equator. Its tropopause is much higher, at about sixteen or seventeen kilometres, and much colder, below minus seventy-five degrees. Strong rising currents in the warm tropics stir the air much higher, so the troposphere is deeper there. Near the poles, it's shallower, about eight to ten kilometres.

> 72 words · 5 sentences · 1432.950–1464.500 s (31.5 s; speech 29.4 s) · 23:52.95–24:24.50 (measured) · beat: contrast · change only the place · UF1: U-WB-22, U-WB-23, R1, R2, R4.
> Screen: second profile (teal) from Singapore on the same axes; two tropopause marks 'Paris ≈ 11 km', 'Singapore ≈ 16-17 km'; mini globe with tropopause depth band thicker at the equator than at the poles
> Source line(s): [S1] Data: IGRA v2 radiosondes (NOAA NCEI) · Trappes and Singapore · 1 Nov 2023, 00 UTC / [globe] Data: ERA5 monthly mean temperature (Copernicus C3S) · November 2023 · averaged around each latitude · image: Blue Marble NG (NASA)

## s26_why_cold_aloft
Why does the air get colder as we go up, when that brings us closer to the sun? Because sunlight mostly passes straight through the air and warms the ground first. The ground then warms the air touching it, so the troposphere is heated from below, like a pan of water on a stove. Here's a real sunny morning over northern France, on the twenty-fourth of June, twenty twenty-four, seen from a satellite. Heights in this picture are drawn twenty times taller than distances on the map. Warm air near the ground rises, in bubbles called thermals. As it rises, it moves into lower pressure, so it expands. Expanding air pushes its surroundings away, and that work costs it energy, so it cools: by almost ten degrees for every kilometre it rises, as long as no cloud forms. A weather balloon launched near Paris at midday that day agrees: in the lowest one and a half kilometres, the temperature fell by about ten degrees for every kilometre. [beat] By the early afternoon, the rising air had cooled enough to make clouds, and the satellite saw the sky fill with them. We'll work out exactly where those clouds begin a little later.

> 200 words · 11 sentences · 1464.500–1544.675 s (80.2 s; speech 74.7 s) · 24:24.50–25:44.67 (measured) · beat: why · heated from below · UF1: U-WB-24, U-WB-25, R1, R3.
> Screen: tilted 3-D plate of the real 24 Jun 2024 morning (MODIS Terra), sun shafts, glowing fields; thermals rise; hero parcel expands and turns warm → cool; real Trappes sounding rod '−10 °C per km'; plate cross-fades to the afternoon (MODIS Aqua) full of cumulus
> Source line(s): [AT(4, "a real sunny morning")] Image: NASA MODIS Terra true colour (NASA GIBS) · 24 Jun 2024, about 10:20 UTC · northern France / [AT(9, "A weather balloon")] Image: NASA MODIS Terra (NASA GIBS), 24 Jun 2024, 10:20 UTC · sounding: IGRA v2 (NOAA NCEI), Trappes, 24 Jun 2024, 12 UTC / [AT(10, "the early afternoon")] Image: NASA MODIS Aqua true colour (NASA GIBS) · 24 Jun 2024, about 13:20 UTC · northern France

## s27_vapour
Now let's add water. Water vapour is water as a gas, and it's invisible. Clouds and fog are not vapour: they're tiny drops of liquid water. The amount of vapour is often measured by the specific humidity: the grams of vapour in each kilogram of air. It goes from almost zero in cold polar air to about twenty grams per kilogram in warm, steamy tropical air. Vapour also adds its own small share to the air pressure, called the vapour pressure.

> 81 words · 6 sentences · 1544.675–1579.300 s (34.6 s; speech 32.1 s) · 25:44.67–26:19.30 (measured) · beat: building blocks · humidity · UF1: U-WB-26, U-WB-27, U-WB-28, R1, R2, R4.
> Screen: Blue Marble globe spinning east, then turning to the pole; 'vapour: invisible' / 'cloud: drops'; q = g of vapour / kg of air 'specific humidity'; ERA5 q field 0-20 g/kg with colour bar; flight to the tropics
> Source line(s): [S1] Image: Blue Marble Next Generation (NASA), cloud-free / [AT(4, "specific humidity")] Data: ERA5 2-m specific humidity (Copernicus C3S) · 2 Nov 2023, 12 UTC · image: Blue Marble NG (NASA)

## s27b_vapour_pressure
How big is that share? There's a handy rule for it: e is about one point six one, times q, times p. Here e is the vapour pressure, q is the specific humidity written in kilograms of vapour per kilogram of air, and p is the air pressure. Careful: this e is just the usual letter for vapour pressure, not the number e from before. Where does one point six one come from? Pressure comes from molecules hitting things, so the vapour's share of the pressure is its share of the molecules. A water molecule is lighter than an average air molecule: it weighs about eighteen atomic mass units, against about twenty-nine. So a kilogram of vapour holds about twenty-nine divided by eighteen, or one point six one, times as many molecules as a kilogram of air. That's why the vapour's share of the molecules, and so of the pressure, is about one point six one times its share of the mass, q. Let's try the steamiest tropical air: q is twenty grams per kilogram, which is zero point zero two, and p is about a thousand hectopascals. So e is about one point six one times zero point zero two times a thousand, which is about thirty-two hectopascals, out of about a thousand. [beat]

> 214 words · 11 sentences · 1579.300–1665.700 s (86.4 s; speech 81.4 s) · 26:19.30–27:45.70 (measured) · beat: building blocks · vapour pressure from specific humidity · UF1: U-WB-29, R1, R2, R5.
> Screen: humidity globe continues to the q ≈ 20 g/kg tropics; e ≈ 1.61 q p with braces; 'this e: vapour pressure, not 2.72'; 1-kg boxes air (100 dots) vs vapour (161 dots), 29 vs 18, 29/18 ≈ 1.61; e ≈ 1.61 × 0.020 × 1000 ≈ 32 hPa
> Source line(s): [S1] Data: ERA5 2-m specific humidity (Copernicus C3S) · 2 Nov 2023, 12 UTC · image: Blue Marble NG (NASA)

## s28_saturation
Over a water surface, molecules leave the water and others land back in it, all the time. The fastest ones escape, and warmer water has more fast molecules. When as many land as leave, the air above is saturated, and its vapour pressure is called the saturation vapour pressure. It depends only on temperature, and it climbs steeply: about six hectopascals at zero degrees, twelve at ten, twenty-three at twenty, and forty-two at thirty. It roughly doubles for every ten degrees of warming. People often say warm air can hold more water, like a bigger sponge. Unlike a sponge, though, the air isn't doing the holding: the limit is set by the temperature, and it would be the same with no air at all.

> 124 words · 7 sentences · 1665.700–1716.525 s (50.8 s; speech 47.9 s) · 27:45.70–28:36.53 (measured) · beat: intuition · saturation · UF1: —.
> Screen: water surface with molecules leaving/landing (counters equal → 'saturated'); curve e_s(T) −10…35 °C with points 6, 12, 23, 42 hPa; '× 2 per 10 °C' steps; sponge icon with 'Like' / 'Unlike'

## s29_relative_humidity
Relative humidity compares the two. It's the vapour pressure divided by the saturation vapour pressure, as a percentage. Let's try air at twenty-five degrees with a vapour pressure of fifteen hectopascals. At twenty-five degrees, the saturation vapour pressure is about thirty-one point three. Fifteen divided by thirty-one point three is about point four eight, so the relative humidity is about forty-eight percent. [beat] Notice that it depends on the temperature as well as on the water. Cool the same air to eighteen degrees, and its relative humidity rises to about seventy-three percent, even though no water is added.

> 97 words · 7 sentences · 1716.525–1762.625 s (46.1 s; speech 42.0 s) · 28:36.53–29:22.62 (measured) · beat: building blocks · relative humidity · UF1: —.
> Screen: RH = vapour pressure ÷ saturation vapour pressure × 100 %; on the e_s curve: point at 25 °C, 15 hPa (teal) under the curve at 31.3 (gold); CalcStack 15 ÷ 31.3 ≈ 0.48 → 48 %; point slides left (cooling) and RH readout climbs

## s30_dew_point
So how far must we cool this air before it's saturated? We need the temperature at which the saturation vapour pressure has fallen to fifteen hectopascals. That's about thirteen degrees. [beat] This is the dew point: the temperature to which air must be cooled, keeping its water, to become saturated. On a clear night, grass cools below the dew point of the air touching it, and dew forms. When a whole layer of air near the ground cools to its dew point, we get fog. And when rising air cools to its dew point, we get a cloud.

> 97 words · 7 sentences · 1762.625–1802.375 s (39.8 s; speech 35.7 s) · 29:22.62–30:02.38 (measured) · beat: building blocks · dew point · UF1: —.
> Screen: teal dot slides left at 15 hPa until it touches the curve: '13 °C = dew point'; three small icons: dew on grass, fog layer, cloud

## s31_cloud_base
Let's follow that air parcel as it rises from the ground. It cools by almost ten degrees for every kilometre. Its dew point falls too, but slowly, by about two degrees per kilometre, because as the parcel expands, its vapour is spread more thinly. So the gap between the temperature and the dew point, twelve degrees at the ground, shrinks by about eight degrees for every kilometre. It closes after about one and a half kilometres. [beat] There the vapour condenses, and the cloud begins. That's why fair-weather clouds have flat bases: parcels rising from the same ground reach their dew point at about the same height.

> 106 words · 7 sentences · 1802.375–1847.675 s (45.3 s; speech 41.2 s) · 30:02.38–30:47.67 (measured) · beat: why · where clouds begin · UF1: R1.
> Screen: side view: parcel rises; two lines on a height-temperature graph: T (orange, −9.8/km) and Td (teal, −1.8/km) meeting at ≈ 1.5 km; gap bracket '12 °C' at the ground; flat-based cumulus row at 1.5 km
> Source line(s): [real image] Image: NASA MODIS Aqua 250 m (NASA GIBS) · 24 Jun 2024, about 13:20 UTC · northern France · cloud base: ERA5 (Copernicus C3S)

## s32_wind_vector
Now let's look at wind. Wind is air moving across the Earth's surface, and it has both a speed and a direction, so it's a vector: an arrow. We can split the arrow into two parts, called components. The eastward part is written u, and the northward part is written v. Take a wind blowing towards the north-east, with u equal to eight and v equal to six metres per second. By Pythagoras, its speed is the square root of eight squared plus six squared, which is ten metres per second. [beat]

> 91 words · 6 sentences · 1847.675–1884.150 s (36.5 s; speech 33.2 s) · 30:47.67–31:24.15 (measured) · beat: building blocks · wind is a vector · UF1: R1.
> Screen: compass rose map patch; teal wind arrow with components: 'u = 8 m/s' along east, 'v = 6 m/s' along north; 'v = (8, 6) m/s'; CalcStack √(8² + 6²) = √100 = 10 m/s
> Source line(s): [map] Data: ERA5 10-m wind (Copernicus C3S) · 1 Nov 2023, 12 UTC · Brittany · image: NASA MODIS (NASA GIBS), 1 Nov 2023

## s33_wind_direction
Meteorologists name a wind by where it comes from, not where it's going. A westerly wind blows from the west, towards the east. The direction is given in degrees, measured clockwise from north as seen from above: north is zero, east ninety, south one hundred and eighty, and west two hundred and seventy. Our wind blows towards the north-east, so it comes from the south-west. Its direction is about two hundred and thirty-three degrees, and we call it a south-westerly. [beat] Careful: ocean currents use the opposite habit, and are named by where they go, so an eastward current flows towards the east.

> 102 words · 6 sentences · 1884.150–1928.225 s (44.1 s; speech 40.4 s) · 31:24.15–32:08.22 (measured) · beat: building blocks · the direction convention · UF1: —.
> Screen: compass dial 0/90/180/270 'clockwise from north, seen from above'; westerly arrow entering from the west; our wind with a gold arc from north clockwise to its tail: '233°' 'from the south-west'; 'south-westerly'; contrast: 'eastward current →'

## s34_wind_units
Wind speed comes in several units. Metres per second is the scientific one. Multiply by three point six to get kilometres per hour, so ten metres per second is thirty-six kilometres per hour. Sailors and pilots use knots. A knot is one nautical mile per hour, and a nautical mile, one thousand eight hundred and fifty-two metres, is about one sixtieth of a degree of latitude along the Earth's surface. So one knot is about point five one metres per second, and our ten metres per second wind is about nineteen knots. [beat]

> 92 words · 6 sentences · 1928.225–1968.450 s (40.2 s; speech 37.0 s) · 32:08.22–32:48.45 (measured) · beat: building blocks · units and knots · UF1: R1, R4.
> Screen: CalcStack 10 m/s × 3.6 = 36 km/h; globe meridian with a 1° arc split into 60 parts: '1 nautical mile = 1852 m'; '1 kt = 1852 m ÷ 3600 s ≈ 0.51 m/s'; '10 ÷ 0.514 ≈ 19 kt'
> Source line(s): [S1] Image: NASA VIIRS true colour (NASA GIBS) · 2 Nov 2023

## s35_why_wind
Why does air move at all? The simplest reason is pressure. Where the pressure is higher on one side than on the other, the air is pushed from high pressure towards low pressure, just as air rushes out of a punctured tyre. But on our spinning Earth, moving air is gradually turned aside, so over large distances the wind ends up blowing around areas of high and low pressure, rather than straight into them. We'll see how that turning works in later videos on the Coriolis effect and the geostrophic wind.

> 91 words · 5 sentences · 1968.450–2003.375 s (34.9 s; speech 32.7 s) · 32:48.45–33:23.38 (measured) · beat: why · what pushes the wind · UF1: R1.
> Screen: two barometer dials 'high' / 'low' with an orange push arrow high → low; tyre icon; then a curved arrow bending round an 'L' on a small sketch 'turned aside'
> Source line(s): [map] Data: ERA5 10-m wind (Copernicus C3S) · 2 Nov 2023, 12 UTC · image: NASA MODIS Aqua (NASA GIBS), 2 Nov 2023

## s36_weather_climate
Before we look at real maps, let's pin down two words. Weather is the state of the atmosphere at one place and time: its temperature, pressure, humidity, wind, clouds and rain, right now or over the next few days. Climate is the statistics of the weather over many years, usually thirty: what's normal, and how far the weather usually strays from it. Here is the daily temperature at Brest, in north-western France, for every day of twenty twenty-three. Behind it is Brest's climate for each day of the year, the average over nineteen ninety-one to twenty twenty, with a band that holds eight days out of ten. The weather line jumps around from day to day, but most of the time it stays inside the band. Climate is what you expect; weather is what you get.

> 136 words · 7 sentences · 2003.375–2057.075 s (53.7 s; speech 50.8 s) · 33:23.38–34:17.07 (measured) · beat: building blocks · weather vs climate · UF1: U-WB-30, R1.
> Screen: keywords 'weather: now, a few days' / 'climate: 30-year statistics'; TimeGraph Jan-Dec 2023: daily mean T at Brest (orange) over the 1991-2020 daily mean (warm white) and 10-90 % band (slate fill)
> Source line(s): [locator] Relief: ETOPO 2022 (NOAA NCEI) · Brest, Brittany / [chart] Data: ERA5 daily mean 2-m temperature (Copernicus C3S) · Brest (48.4°N, 4.5°W) · 2023 and 1991–2020

## s37_observations
How do we know the weather everywhere? From observations: thousands of weather stations, weather balloons, ships, buoys and aircraft, and many satellites. But they're uneven. Here are the places that launched weather balloons in twenty twenty-three. They're crowded over Europe, North America and East Asia, but sparse over the oceans, much of Africa, and the poles. And each instrument measures different things, at different times.

> 65 words · 6 sentences · 2057.075–2089.050 s (32.0 s; speech 29.4 s) · 34:17.07–34:49.05 (measured) · beat: building blocks · observations · UF1: U-WB-30, R1, R4.
> Screen: Globe3D (daytime mosaic) with gold dots at IGRA2 stations active in 2023; slow rotation Europe → Pacific → Africa; small icons station/balloon/ship/buoy/plane/satellite
> Source line(s): [S1] Data: IGRA v2 stations reporting in 2023 (NOAA NCEI) · image: NASA VIIRS (NASA GIBS), 2 Nov 2023

## s38_reanalysis
A reanalysis fills in the gaps. It starts from a weather forecast model, a computer program that steps the laws of physics forward in time, including the hydrostatic balance and the gas law we just met. Every few hours, it nudges the model towards all the observations made at that time, trusting the more reliable ones more. The result is a complete picture of the atmosphere, at every place and height, every hour, for decades. The one we use in this video is called ERA5, made by the European Centre for Medium-Range Weather Forecasts. It runs from nineteen forty to today, on a grid with points about thirty kilometres apart. It's like a jigsaw with missing pieces, filled in using the pieces around them and the rules of physics. Unlike a photograph, though, where observations are sparse the result leans more on the model, so it's least certain there.

> 149 words · 8 sentences · 2089.050–2150.550 s (61.5 s; speech 58.2 s) · 34:49.05–35:50.55 (measured) · beat: building blocks · reanalysis · UF1: U-WB-30, R1, R2, R4.
> Screen: station dots → a coarse model grid lights up → the full ERA5 field (2-m temperature, 2 Nov 2023 12 UTC) fills the globe; keywords 'model + observations', 'every hour since 1940', '≈ 30 km grid'; jigsaw icon Like / Unlike
> Source line(s): [S1] Data: IGRA v2 stations reporting in 2023 (NOAA NCEI) · image: NASA VIIRS (NASA GIBS), 2 Nov 2023 / [field] Data: ERA5 2-m temperature (Copernicus C3S) · 2 Nov 2023, 12 UTC

## s39_surface_pressure
Now let's make a pressure map. Here is the real air pressure at the ground all over the world, at midday on the second of November, twenty twenty-three, from the reanalysis. What stands out are the mountains. Over Tibet and the Himalayas, the pressure at the ground is less than six hundred hectopascals, and the Andes and the Rockies show up too. In the close-up, the mountains are drawn thirty times taller than they really are. That's just hydrostatic balance: high ground has less air above it. The weather is in there, but these mountain patterns swamp it.

> 98 words · 7 sentences · 2150.550–2190.325 s (39.8 s; speech 36.9 s) · 35:50.55–36:30.32 (measured) · beat: intuition · a pressure map, and the mountain problem · UF1: R1, R2, R4.
> Screen: Globe3D: ERA5 surface pressure (sequential map 500-1040 hPa) over shaded relief; camera to Tibet: '< 600 hPa'; Andes, Rockies pointers; keyword 'less air above high ground'
> Source line(s): [globe] Data: ERA5 surface pressure (Copernicus C3S) · 2 Nov 2023, 12 UTC / [Cesium close-up] Relief: ETOPO 2022 (NOAA NCEI) · image: Blue Marble NG (NASA) · Tibet and the Himalayas

## s40_sea_level
So how do we compare a mountain town with a seaside town? We imagine what the pressure would be if each place were at sea level. Suppose a weather station sits one thousand six hundred and nine metres up, about the height of Denver in the United States, and reads eight hundred and thirty-five hectopascals, with an air temperature of fifteen degrees. We add the weight of an imaginary column of air, reaching from the station down to sea level. With our exponential rule run downwards, that's eight hundred and thirty-five times e to the power of one point six oh nine divided by eight point four three. That's about one thousand and ten hectopascals: a perfectly ordinary sea-level reading. [beat] This is called the sea-level pressure. Real weather services use a slightly more careful version of the same idea.

> 139 words · 8 sentences · 2190.325–2248.650 s (58.3 s; speech 53.9 s) · 36:30.32–37:28.65 (measured) · beat: why · reducing to sea level · UF1: —.
> Screen: side view: station on a mountain at 1609 m, 'p = 835 hPa', 'T = 15 °C'; dashed imaginary column down to sea level; CalcStack p_sea = p_s e^(z/H) = 835 × e^(1.609/8.43) ≈ 1010 hPa; keyword 'sea-level pressure'

## s41_msl_isobars
Here is the same moment again, now as sea-level pressure. The mountains are gone, and the weather appears. Let's join the places that have the same sea-level pressure, every four hectopascals. These lines are called isobars, from Greek words for equal weight. Where the isobars crowd together, the pressure changes quickly over a short distance, and the winds are strong.

> 60 words · 5 sentences · 2248.650–2275.650 s (27.0 s; speech 24.8 s) · 37:28.65–37:55.65 (measured) · beat: intuition · sea-level pressure and isobars · UF1: R1, R4.
> Screen: cross-fade surface pressure → ERA5 MSLP on the globe; isobars draw outward every 4 hPa; keyword 'isobars = equal weight'; gold bracket where they crowd near Ciarán
> Source line(s): [S1] Data: ERA5 mean sea-level pressure (Copernicus C3S) · 2 Nov 2023, 12 UTC

## s42_highs_lows
The map shows round patches where the pressure is higher than all around, called highs, and patches where it's lower than all around, called lows. A low is also called a depression, or a cyclone, and a high is also called an anticyclone. Over the east coast of England, at the edge of the North Sea, is a deep low, Storm Ciarán, at about nine hundred and fifty-six hectopascals. Far to the south-west, near the Azores islands, is a high at about one thousand and thirty. Here is a much more recent map, a weather-service analysis from the twenty-seventh of October, twenty twenty-six. Its deepest low is a typhoon over the western Pacific, at about nine hundred and thirty-five hectopascals, while a low over the North Atlantic, at about nine hundred and fifty-five, is about as deep as Ciarán.

> 139 words · 6 sentences · 2275.650–2332.800 s (57.2 s; speech 54.6 s) · 37:55.65–38:52.80 (measured) · beat: building blocks · highs and lows · UF1: U-WB-30, R1, R4.
> Screen: 'H' and 'L' letters (68 px) at the analysed centres; 'L 956 hPa' Ciarán; 'H ≈ 1030 hPa' near the Azores; keywords 'low = depression = cyclone', 'high = anticyclone'
> Source line(s): [S1] Data: ERA5 mean sea-level pressure (Copernicus C3S) · 2 Nov 2023, 12 UTC / [GFS map] Data: GFS analysis (NOAA NCEP) · 27 Oct 2026, 00 UTC

## s43_lows_cloudy
Lows and highs bring different weather, and now we can see why. Near the ground, air drifts in towards the centre of a low. It can't pile up there, so it rises. Rising air expands and cools, it reaches its dew point, and clouds and rain form. That's why lows bring cloudy, wet and windy weather. Around a high, air sinks from above and spreads out near the ground. Sinking air is squeezed and warms, so it moves away from its dew point, and clouds evaporate. That's why highs usually bring settled, dry weather.

> 94 words · 8 sentences · 2332.800–2372.350 s (39.5 s; speech 36.3 s) · 38:52.80–39:32.35 (measured) · beat: why · lows are cloudy, highs are clear · UF1: R1.
> Screen: split: satellite true colour of Ciarán's cloud spiral (left) vs clear skies under the Azores high (right), same image 2 Nov 2023; side-view inset arrows: low = in + up (cloud), high = down + out (clear)
> Source line(s): [S1] Image: NASA MODIS Aqua true colour (NASA GIBS) · 2 Nov 2023 · isobars: ERA5 (Copernicus C3S), 12 UTC

## s44_round_lows
Now let's add the real winds near the ground, measured ten metres up, from the same reanalysis. Near Ciarán, the air doesn't blow straight into the low. It swirls around it, anticlockwise as seen from above, crossing the isobars only slightly towards the centre. Around the high, it turns the other way, clockwise as seen from above. In the southern hemisphere, both are reversed. Why the wind circles instead of rushing in is the story of the Coriolis effect, and it has its own video.

> 85 words · 6 sentences · 2372.350–2408.550 s (36.2 s; speech 33.6 s) · 39:32.35–40:08.55 (measured) · beat: intuition · winds circle the lows · UF1: R1.
> Screen: 10-m wind arrows (teal, thinned 1.5°) with streaklines on the image + isobars; gold anticlockwise arc round the L 'anticlockwise, seen from above'; clockwise arc round the H; small SH globe thumbnail with arcs reversed
> Source line(s): [S1] Data: ERA5 10-m wind and sea-level pressure (Copernicus C3S) · 2 Nov 2023, 12 UTC · image: NASA MODIS Aqua (NASA GIBS)

## s45_air_masses
Now let's look at temperature and moisture together. Air that sits for days over one region takes on its character: cold and dry over snowy land in the far north, warm and moist over tropical seas. A huge body of air like this, often more than a thousand kilometres across, with fairly even temperature and humidity, is called an air mass. Air masses are named after where they come from: polar or tropical, and maritime, from over the sea, or continental, from over land. On the first of November, twenty twenty-three, warm, moist tropical air was flowing north-east towards France, ahead of Ciarán, while cooler polar air followed behind it.

> 110 words · 5 sentences · 2408.550–2454.225 s (45.7 s; speech 43.5 s) · 40:08.55–40:54.22 (measured) · beat: building blocks · air masses · UF1: U-WB-30, R1, R2, R4.
> Screen: four labels in a 2 × 2 grid without boxes: polar / tropical × maritime / continental; real ERA5 850-hPa temperature + 2-m dew point map 1 Nov 2023 18 UTC over the true-colour image: warm tongue 'tropical maritime', cool air 'polar maritime'
> Source line(s): [globe] Data: ERA5 2-m temperature (Copernicus C3S) · 2 Nov 2023, 12 UTC / [chart] Data: ERA5 850-hPa temperature (Copernicus C3S) · 1 Nov 2023, 18 UTC

## s46_fronts
Where two air masses meet, they don't mix right away. The change from one to the other is squeezed into a narrow zone, often a hundred kilometres wide or less, called a front. Crossing a front, the temperature and the humidity change quickly, and the wind changes direction. A front is named after the air that's advancing. If cold air is pushing forward, it's a cold front. If warm air is advancing, it's a warm front.

> 76 words · 6 sentences · 2454.225–2486.000 s (31.8 s; speech 29.2 s) · 40:54.22–41:26.00 (measured) · beat: building blocks · fronts · UF1: R1, R2.
> Screen: the s45 map: a gold transect across the warm tongue's edge; graph of T850 along it with a steep step 'front'; arrows 'cold advancing → cold front', 'warm advancing → warm front'
> Source line(s): [S1] Data: ERA5 850-hPa temperature (Copernicus C3S) · 1 Nov 2023, 18 UTC · fronts computed from it

## s47_cold_front
Let's look at a cold front from the side. Here is a real slice through the air around Storm Ciarán, from the reanalysis, at six in the evening on the first of November, running from west to east through Brest. The colours show how much warmer or colder the air is than the average at the same height, and the moving dots follow the wind inside the slice. Remember the gas law: at the same pressure, cold air is denser than warm air. So the advancing cold air stays low and pushes in under the warm air like a wedge. Its slope is steep for a front, about one kilometre up for every fifty to a hundred kilometres along, and the warm air is lifted quickly. It cools to its dew point, and tall clouds and heavy showers form in a narrow band. After the front passes, the air is colder and drier, the pressure starts to rise, and the wind turns, in the northern hemisphere usually from the south-west to the west or north-west.

> 175 words · 8 sentences · 2486.000–2550.450 s (64.4 s; speech 61.2 s) · 41:26.00–42:30.45 (measured) · beat: why · a cold front from the side · UF1: U-WB-31, R1, R2, R3.
> Screen: the s46 transect rises into a real ERA5 slice (×80): colours = warmer/colder than average at that height, saturated air shaded, ≈1500 dots moving with the in-slice wind; cold wedge outlined, slope triangle, lifted warm air brightens; ground winds; colour bar
> Source line(s): [S1] Data: ERA5 on pressure levels (Copernicus C3S) · 1 Nov 2023, 18 UTC · slice along 48.5°N, 18°W–4°E

## s48_warm_front
Now let's move east along the same slice, to the warm front near Brest. At a warm front, the warm air is advancing, but it's lighter, so it can't push the cold air away from below. Instead, it glides up over the cold air on a gentle slope, rising about one kilometre for every one or two hundred kilometres. As it slides upwards it cools, and a broad sheet of layered cloud forms far ahead of the front, bringing long spells of steady rain. When the warm front passes, the air turns milder and moister, and the wind turns, in the northern hemisphere usually from the south-east to the south or south-west. In this slice, heights are drawn eighty times taller than distances along the ground, so the slopes look much steeper than in nature.

> 135 words · 6 sentences · 2550.450–2602.425 s (52.0 s; speech 49.4 s) · 42:30.45–43:22.43 (measured) · beat: why · a warm front from the side · UF1: U-WB-30, U-WB-31, R1, R2, R3.
> Screen: camera glides east along the slice to the warm front near Brest; warm air gliding up the gentle slope (particles), cloud sheet ahead, ground winds, slope triangle with a true-scale twin
> Source line(s): [S1] Data: ERA5 on pressure levels (Copernicus C3S) · 1 Nov 2023, 18 UTC · slice along 48.5°N, 18°W–4°E

## s49_real_fronts
Here are real fronts, around Ciarán at six in the evening on the first of November. The colours show the temperature about one and a half kilometres up, where the ground's daily warming and cooling matter less. The warm tropical air reaches up towards Brittany in a tongue. Along its leading edge, to the east, is the warm front. Along its trailing edge, curving away to the south-west, is the cold front. The arrows show the wind turning as it crosses the fronts, most sharply at the warm front.

> 89 words · 6 sentences · 2602.425–2637.450 s (35.0 s; speech 32.5 s) · 43:22.43–43:57.45 (measured) · beat: application · real fronts round Ciarán · UF1: U-WB-31, R1, R2.
> Screen: map 40-60N 25W-10E: ERA5 850-hPa T at 00 UTC 2 Nov over a night-free base (BMNG relief, labelled 'base map'), coast/borders; front lines from the thermal front parameter: warm front (red half circles) and cold front (blue triangles) drawn as gold lines first; wind arrows 850 hPa turning across them
> Source line(s): [S1] Data: ERA5 850-hPa temperature and wind (Copernicus C3S) · 1 Nov 2023, 18 UTC · fronts computed from it

## s50_front_symbols
On weather maps, fronts are drawn as lines with symbols on the side they're moving towards. A cold front has blue triangles, and a warm front has red half circles. You'll learn to read these maps in detail in the next video.

> 42 words · 3 sentences · 2637.450–2654.150 s (16.7 s; speech 15.2 s) · 43:57.45–44:14.15 (measured) · beat: application · map symbols (pointer forward) · UF1: R1, R2.
> Screen: the gold lines of s49 gain their symbols: blue triangles on the cold front's leading side, red half circles on the warm front's; keyword 'symbols point where the front moves'
> Source line(s): [S1] Data: ERA5 850-hPa temperature (Copernicus C3S) · 1 Nov 2023, 18 UTC · fronts computed from it

## s51_heating
Now let's zoom out to the whole planet, and ask why the weather moves at all. It starts with sunlight. Picture a beam of sunlight one metre wide, at noon at an equinox, in March or September, when the sun is overhead at the equator. At the equator, it lands on one metre of ground. At sixty degrees north, the ground is tilted to the beam, and the same beam is spread over two metres, so each square metre gets half as much. [beat] So the tropics are heated much more than the poles, and the atmosphere and the ocean carry heat from the tropics towards the poles. Storms like Ciarán are one of the ways the atmosphere does it.

> 119 words · 7 sentences · 2654.150–2699.525 s (45.4 s; speech 41.3 s) · 44:14.15–44:59.53 (measured) · beat: application · the global picture (heating) · UF1: R1, R2, R4.
> Screen: globe at equinox, sun beam (gold band 1 m wide) hitting the equator (1 m patch) and 60°N (2 m patch); CalcStack 1 ÷ cos 60° = 2; 'half as much'; then poleward orange arrows over a mean 2-m temperature globe
> Source line(s): [S1] Image: Blue Marble NG (NASA) / [field] Data: NCEP/NCAR Reanalysis 1 (NOAA PSL) · 1991–2020 mean 2-m temperature

## s52_pressure_belts
Averaged over many years, sea-level pressure falls into belts. Around thirty degrees north and south, air sinks from high up, and large highs sit over the oceans, like the Azores high we saw. These are the subtropical highs. Near the equator is a belt of low pressure where the winds from both hemispheres meet and rise, building tall thunderclouds. It's called the intertropical convergence zone. How these belts are made is the subject of a later video on the general circulation.

> 81 words · 6 sentences · 2699.525–2735.600 s (36.1 s; speech 33.5 s) · 44:59.53–45:35.60 (measured) · beat: application · high and low pressure belts (preview) · UF1: R1, R2, R4.
> Screen: Globe3D: 1991-2020 mean MSLP (NCEP R1 LTM, diverging map centred 1013 hPa) with isobars every 4 hPa; labels 'subtropical highs' at the Azores, North Pacific, South Atlantic, South Pacific, Indian Ocean highs; equatorial band 'intertropical convergence zone (ITCZ)'
> Source line(s): [S1] Data: NCEP/NCAR Reanalysis 1 (NOAA PSL) · 1991–2020 mean sea-level pressure

## s53_trades_westerlies
The winds near the ground follow these belts. Between the subtropical highs and the equator, steady winds blow from the east, called the trade winds; sailing ships relied on them to cross the oceans. North of the equator, they come from the north-east. South of it, they come from the south-east. Poleward of the subtropical highs, in the middle latitudes, the winds come mostly from the west: the westerlies. That's why storms like Ciarán usually travel from west to east. Why the winds bend like this is part of the Coriolis story, coming in a later video.

> 97 words · 7 sentences · 2735.600–2776.250 s (40.7 s; speech 37.8 s) · 45:35.60–46:16.25 (measured) · beat: application · trade winds and westerlies (preview) · UF1: R1, R4.
> Screen: same globe: mean 10-m wind arrows (teal) with streaklines; labels 'north-east trades', 'south-east trades', 'westerlies' with gold brackets; Ciarán track arrow west → east
> Source line(s): [S1] Data: NCEP/NCAR Reanalysis 1 (NOAA PSL) · 1991–2020 mean 10-m wind · storm track: ERA5 (Copernicus C3S)

## s54_ciaran_intro
Now let's put all of this together on one real storm, and watch it from one town. On the first of November, twenty twenty-three, Storm Ciarán was racing across the Atlantic towards Europe. Here it is from a satellite that afternoon, with coastlines and borders drawn in. And here is Brest, a port city at the western tip of France. Let's watch the storm pass over Brest, hour by hour, using the reanalysis. Times are in universal time, the clock that meteorologists everywhere share.

> 84 words · 6 sentences · 2776.250–2812.725 s (36.5 s; speech 33.9 s) · 46:16.25–46:52.72 (measured) · beat: application · one storm over one town · UF1: R1, R4.
> Screen: true colour 1 Nov 2023 afternoon (MODIS), 35-60N 30W-10E, coast + admin borders; 'Storm Ciarán · 1 Nov 2023'; gold dot 'Brest'; keyword 'UTC = universal time'
> Source line(s): [S1] Data: ERA5 sea-level pressure (Copernicus C3S) · 1 Nov 2023 · image: NASA MODIS Terra and Aqua (NASA GIBS), 1 Nov 2023, afternoon

## s55_ciaran_maps
Here are the isobars every four hectopascals from midday on the first of November to midday on the second, with the warm front in red and the cold front in blue until that evening. The low deepens as it comes, from about nine hundred and seventy to about nine hundred and fifty-four hectopascals, and its centre crosses the English Channel just north of Brest during the night.

> 67 words · 2 sentences · 2812.725–2838.075 s (25.3 s; speech 24.2 s) · 46:52.72–47:18.07 (measured) · beat: application · the low moves in · UF1: R1.
> Screen: same panel; 12 UTC 1 Nov held while the isobars and the warm (red) / cold (blue) fronts are named; then the hours run with the clock, 'L' on Ciarán's own centre with 'low: ≈ 970 hPa' then the running value to 954; the fronts and their key fade out after 21 UTC; gold track; Brest dot
> Source line(s): [S1] Data: ERA5 hourly sea-level pressure and 10-m wind (Copernicus C3S) · fronts from ERA5 850-hPa temperature · 1 Nov 12 UTC – 2 Nov 12 UTC 2023

## s56_brest_pressure
First, the pressure at Brest. At midday on the first, it reads about nine hundred and ninety-seven hectopascals. Then it falls, faster and faster, to about nine hundred and sixty-two at one o'clock in the morning, as the low passes close by. That's thirty-five hectopascals in thirteen hours, a very fast fall. [beat] Then it climbs again, by about fourteen hectopascals in five hours.

> 63 words · 5 sentences · 2838.075–2868.900 s (30.8 s; speech 27.5 s) · 47:18.07–47:48.90 (measured) · beat: application · the pressure at Brest · UF1: R1.
> Screen: TimeGraph (12 UTC 1 Nov → 12 UTC 2 Nov): Brest MSLP (orange line, hour dots) 997 → 962 → 976 hPa; brackets '−35 hPa in 13 h', '+14 hPa in 5 h'; barometer icon needle following; small map thumbnail with the L passing
> Source line(s): [S1] Data: ERA5 hourly, grid point 48.5°N 4.5°W, nearest to Brest (Copernicus C3S) · 1–2 Nov 2023

## s57_brest_warm_front
Now the temperature and the wind. At six in the evening, the wind blows from the south-south-east at about thirteen metres per second, and the temperature is twelve degrees. By eight, the wind has turned to come from the south-south-west, it has strengthened to about eighteen metres per second, and the temperature has risen to about fourteen and a half. That's the warm front passing. Brest is now in the warm air behind it, which is called the storm's warm sector.

> 81 words · 5 sentences · 2868.900–2901.225 s (32.3 s; speech 30.1 s) · 47:48.90–48:21.22 (measured) · beat: application · the warm front passes · UF1: R1.
> Screen: TimeGraph gains temperature (orange, °C axis right) and a row of wind arrows (teal, pointing where the wind goes, with 'from' labels 155° SSE, 204° SSW and speeds); gold band 18-20 UTC 'warm front'; keyword 'warm sector'
> Source line(s): [S1] Data: ERA5 hourly, grid point 48.5°N 4.5°W, nearest to Brest (Copernicus C3S) · 1–2 Nov 2023

## s58_brest_cold_front
A few hours later comes the cold front. By now the storm has broken and bent its fronts so much that the map can't trace them cleanly, but Brest's own measurements show it clearly. Between midnight and three in the morning, the wind swings from the south-west to the west and strengthens: by three, it's about twenty-three metres per second, or forty-five knots. [beat] The temperature drops by about two degrees, to ten and a half, and the pressure starts its fast climb. Cooler polar air has arrived behind the front, just as our side view said.

> 96 words · 5 sentences · 2901.225–2939.700 s (38.5 s; speech 35.1 s) · 48:21.22–48:59.70 (measured) · beat: application · the cold front passes · UF1: R1.
> Screen: same TimeGraph: wind arrows at 00 UTC '19 m/s from 221° (SW)' and 03 UTC '23 m/s from 271° (W)'; CalcStack 23.2 ÷ 0.514 ≈ 45 kt; temperature 12.6 → 10.5 °C bracket '−2 °C'; gold band 00-03 UTC 'cold front'; thumbnail of the s47 side view
> Source line(s): [S1] Data: ERA5 hourly, grid point 48.5°N 4.5°W, nearest to Brest (Copernicus C3S) · 1–2 Nov 2023

## s59_ciaran_after
Here is the storm the next afternoon, seen from space, now over the North Sea, with its clouds wrapped in a spiral around the low. In the next video, we'll learn to read weather maps like this one in detail. And later videos will explain why the wind circles the low instead of rushing into it.

> 56 words · 3 sentences · 2939.700–2961.025 s (21.3 s; speech 19.8 s) · 48:59.70–49:21.03 (measured) · beat: application · the storm the next afternoon, and what comes next · UF1: R1.
> Screen: MODIS Aqua true colour 2 Nov 2023 with isobars at 12 UTC and the L; Brest dot; keywords 'reading weather maps ->', 'why the wind circles ->'
> Source line(s): [S1] Image: NASA MODIS Aqua true colour (NASA GIBS) · 2 Nov 2023 · isobars: ERA5 (Copernicus C3S), 12 UTC

## s60_recap
To sum up, the atmosphere is a thin shell of air, and almost all our weather happens in its lowest layer, the troposphere. Air pressure is the weight of the air above each square metre, about one thousand and thirteen hectopascals at sea level. By hydrostatic balance, it falls with height, roughly exponentially, with a scale height of about eight kilometres. The gas law, p equals rho R T, ties pressure, density and temperature together, so warm air is lighter than cold air. Relative humidity compares the vapour with its saturation value, and cooling air to its dew point makes clouds. Winds are named by where they come from, and are measured in metres per second or knots. Sea-level pressure maps show highs and lows, and fronts are the boundaries between air masses. Weather is what happens now, climate is its long-term statistics, and a reanalysis gives us both, everywhere, every hour.

> 152 words · 8 sentences · 2961.025–3025.475 s (64.4 s; speech 61.2 s) · 49:21.03–50:25.47 (measured) · beat: recap · UF1: R1.
> Screen: one beat per sentence, mini pictures: thin-shell globe · '1013 hPa' column · p = p₀e^(−z/H), H ≈ 8 km · p = ρRT with two cubes · RH curve + dew point ring · compass '233° south-westerly', '19 kt' · MSLP map with H/L and front symbols · Brest TimeGraph + ERA5 globe
> Source line(s): [S1] Data: ERA5 (Copernicus C3S) · IGRA v2 (NOAA NCEI) · NASA GIBS · NCEP/NCAR Reanalysis 1 (NOAA PSL)

## s61_end
This video is one of a series of related tutorials, so watch out for the others. They're made to help students of meteorology, atmospheric science and climate science, and anyone else who wants to learn not just these ideas, but the maths behind them too. The notebook for these weather basics, and the notebooks for the other concepts, are on the website that goes with this video.

> 67 words · 3 sentences · 3025.475–3051.075 s (25.6 s; speech 24.6 s) · 50:25.47–50:51.07 (measured) · beat: end card · UF1: —.
> Screen: house end card: four faint topic thumbnails (globe with shell, pressure column, humidity curve, Ciarán map); 'a series of tutorials' (68 px); 'atmospheric science · meteorology · fluid dynamics' (54 px); notebook icon 'weather-basics notebook'; stacked icons 'notebooks for the other concepts'; 2.5-s silent hold

> Total: 7510 words · 447 sentences · 3051.075 s narration · 3053.575 s movie (50:53.57) · 147.7 words per minute.
