# ch00_weather_basics — "Weather basics: pressure, temperature, humidity and wind, from scratch" (Chapter 0B, version 1)

Version 2, fix loop 1 (2026-10-28). House style `movies/HOUSE_STYLE.md` (reference `ch00_dot_product_why` v6). Voice Kokoro `af_bella`, speed 1.0; music: our own procedural score (seed 11, 'air-flowing' + 'storm-tense' under s54-s59, G major Lydian, 84 bpm). Brief: `brief.md`; data: `data_needs.md`; storyboard: `storyboard.yaml`.

**Measured (timing.json):** 62 scenes, 367 sentences, 5839 words, narration 2392.975 s + 2.5-s end hold = 2395.475 s; 601 caption cues; self-check diff 0.0 ms. The v1 TTS run was extended by tools/movie_wb/splice_insert.py (v2: 4 sentences inserted) and tools/movie_wb/splice_replace.py (fix loop 1: 4 sentences replaced).

Conventions: S<k> in the storyboard = sentence k of the scene; numbers are spoken in words and every number on screen is spoken. The per-scene lines below the narration were written for v1; their measured times are superseded by timing.json.

## s00_title
In this video, we'll learn the basics of weather the easy way, and see how meteorology uses them to follow a real storm as it passes over one town.

> 29 words · 1 sentences · 0.300–11.150 s (10.8 s; speech 10.1 s) · 0:00.30–0:11.15 (measured) · beat: opening title.
> Screen: 'Weather' / 'basics' 150 px TitleGradient; 'made easy' 96 px (pulse on 'the easy way'); 'and how meteorology uses them' 68 px, 'meteorology' teal. Right: TitleAtmos3D Part A (globe + rising balloon, live T and p) -> Part B on 'meteorology' (Ciarán true colour, isobars, Brest pressure ticking 997 -> 962 hPa)

## s01_hook
What is weather made of? Let's see what air pressure, temperature, humidity and wind are, why they behave the way they do, and how they come together in a real storm.

> 31 words · 2 sentences · 11.150–23.275 s (12.1 s; speech 11.0 s) · 0:11.15–0:23.27 (measured) · beat: hook question.
> Screen: Globe3D from frame 0 (true colour 2023-11-02 12 UTC, Ciarán spiral visible); keywords appear on their words: 'pressure', 'temperature', 'humidity', 'wind' (54 px) round the globe with tiny icons (barometer, thermometer, droplet, wind arrow)

## s02_thin_shell
Let's start with the air itself. The atmosphere is the layer of air that wraps around the Earth, held down by gravity. It's much thinner than most pictures suggest. The layer where our weather happens is only about twelve kilometres deep, while the Earth's radius is six thousand three hundred and seventy-one kilometres. On a globe thirty centimetres across, that layer would be about three tenths of a millimetre thick, like three sheets of paper. So from now on, we'll draw the air fifty times thicker than it really is, just so we can see it.

> 96 words · 6 sentences · 23.275–61.875 s (38.6 s; speech 36.0 s) · 0:23.27–1:01.88 (measured) · beat: building blocks · the atmosphere.
> Screen: Globe with true-scale shell (hair-thin) -> gold bracket '12 km' vs radius '6371 km'; calc '12 ÷ 6371 × 150 mm ≈ 0.28 mm'; shell swells to 50x on 'fifty times thicker' with keyword '× 50'

## s03_air_parcel
Air is a mixture of gases. By volume, about seventy-eight percent is nitrogen, twenty-one percent is oxygen, and almost one percent is argon. Carbon dioxide is only about four hundredths of one percent, and water vapour comes and goes, from almost nothing to a few percent. All of it is made of molecules that zip around at hundreds of metres per second, bumping into each other billions of times every second. We can't follow single molecules, so meteorologists talk about air parcels. An air parcel is a small volume of air that moves with the flow: big enough to hold countless molecules, but small compared with the weather around it.

> 110 words · 6 sentences · 61.875–108.725 s (46.8 s; speech 44.3 s) · 1:01.88–1:48.72 (measured) · beat: building blocks · what air is.
> Screen: Bar of composition N₂ 78 % · O₂ 21 % · Ar 0.9 % · CO₂ 0.04 % · H₂O 0-4 %; a molecule box (code-drawn dots bouncing); 'air parcel' keyword with a dashed teal blob drifting on a streamline

## s04_pressure_what
Now let's look at air pressure. Those fast molecules keep hitting every surface they meet: your skin, the walls of a room, the surface of the sea. Each hit is a tiny push, and billions of them add up to a steady force. Pressure is that force divided by the area it pushes on. In air at rest, it pushes equally in every direction: up, down and sideways. Its unit is the pascal, one newton of force on each square metre.

> 81 words · 6 sentences · 108.725–141.250 s (32.5 s; speech 30.0 s) · 1:48.72–2:21.25 (measured) · beat: building blocks · pressure.
> Screen: molecule box against a wall -> orange push arrows on a small square; 'p = force ÷ area'; arrows on a cube in 6 directions 'equal'; '1 Pa = 1 N/m²'

## s05_weight_column
So how big is the pressure at the ground, and where does it come from? Picture a tall column of air standing on one square metre of ground, reaching all the way to the top of the atmosphere. Gravity pulls all that air down, and the ground has to hold up its weight. At sea level, the average pressure is one hundred and one thousand three hundred and twenty-five pascals. Weight is mass times g, where g is the pull of gravity, nine point eight one metres per second squared. So the mass in our column is the pressure divided by g. That's about ten thousand three hundred kilograms of air above every square metre, as heavy as seven cars. So the pressure at the ground is the weight of all the air above it, spread over each square metre.

> 140 words · 8 sentences · 141.250–193.325 s (52.1 s; speech 48.8 s) · 2:21.25–3:13.32 (measured) · beat: building blocks · pressure is weight.
> Screen: 3-D column on a 1 m² square (sky-blue, fading upward); 'p₀ = 101 325 Pa'; 'weight = m g', 'g = 9.81 m/s²'; CalcStack m = p₀/g = 101325/9.81 ≈ 10 300 kg; seven car icons on a scale

## s06_not_crushed
Why doesn't this crush us? Because the air pushes from every side at once, and the air and fluids inside our bodies push back out just as hard. The pushes balance, so we don't feel them. We only notice when the balance breaks for a moment: your ears pop in a fast lift or a climbing plane, because the outside pressure changes before the inside catches up.

> 67 words · 4 sentences · 193.325–219.150 s (25.8 s; speech 24.0 s) · 3:13.32–3:39.15 (measured) · beat: building blocks · why we don't feel it.
> Screen: simple person silhouette with equal orange arrows in and teal arrows out; 'balance'; a lift icon with an ear and a small '−' gap pulsing

## s07_hpa
Pascals give big numbers, so weather maps use hectopascals. One hectopascal is one hundred pascals, so the average pressure at sea level is one thousand and thirteen hectopascals. Older maps use millibars, which are exactly the same size, so the numbers don't change. The instrument that measures pressure is called a barometer. Day to day, the reading at sea level moves up or down by only a few percent. Yet those few percent are what drive the winds, as we'll see.

> 81 words · 6 sentences · 219.150–255.225 s (36.1 s; speech 33.5 s) · 3:39.15–4:15.22 (measured) · beat: building blocks · hectopascals.
> Screen: '1 hPa = 100 Pa'; '101 325 Pa = 1013.25 hPa ≈ 1013 hPa'; '1 hPa = 1 mb'; barometer dial 950-1050 with needle at 1013; '± a few %'

## s08_density
Next, density. Density tells us how much mass is packed into each cubic metre, and we write it with the Greek letter rho. Air near the ground has a density of about one point two kilograms per cubic metre. So a room five metres long, four metres wide and two and a half metres high holds fifty cubic metres of air, which is about sixty kilograms: as much as a person.

> 71 words · 4 sentences · 255.225–282.700 s (27.5 s; speech 25.6 s) · 4:15.22–4:42.70 (measured) · beat: building blocks · density.
> Screen: 'ρ' (rho) 'density, kg/m³'; '≈ 1.2 kg/m³'; room box 5 m × 4 m × 2.5 m with labelled edges; CalcStack 5 × 4 × 2.5 = 50 m³; 50 × 1.2 = 60 kg; person icon

## s09_temperature
Temperature measures how fast the molecules jiggle on average: the warmer the air, the faster they move. Weather reports use degrees Celsius, but physics uses kelvin. To get kelvin, add two hundred and seventy-three point one five to the Celsius number, so fifteen degrees Celsius is two hundred and eighty-eight point one five kelvin. A kelvin step is the same size as a degree Celsius step; only the starting point moves. Zero kelvin is the coldest anything can be, so a temperature in kelvin is never negative. That's why the gas law, which comes next, uses kelvin.

> 97 words · 6 sentences · 282.700–325.975 s (43.3 s; speech 40.7 s) · 4:42.70–5:25.98 (measured) · beat: building blocks · temperature and kelvin.
> Screen: two molecule boxes side by side (slow / fast dots) 'colder' / 'warmer'; two aligned thermometer scales °C and K with ticks 0/273.15, 15/288.15, −273.15/0; 'T(K) = T(°C) + 273.15'

## s10_gas_law
Now let's connect pressure, density and temperature. Think about what makes the molecules push harder on a wall. If we pack more molecules into each cubic metre, more of them hit the wall each second, so the pressure goes up with the density. If the molecules move faster, each one hits harder and more often, so the pressure goes up with the temperature. Put together, the pressure is proportional to density times temperature: p equals rho R T. This is called the ideal gas law. Here p is the pressure in pascals, rho is the density, T is the temperature in kelvin, and R is a fixed number for dry air, called the gas constant: two hundred and eighty-seven joules per kilogram per kelvin.

> 124 words · 7 sentences · 325.975–375.950 s (50.0 s; speech 47.1 s) · 5:25.98–6:15.95 (measured) · beat: building blocks · the ideal gas law, built.
> Screen: two contrast boxes: 'more molecules → more hits' (ρ ×2 → p ×2), 'faster → harder, more often' (T ↑ → p ↑); Layered TeX p = ρ R T with underbraces 'pressure (Pa)', 'density', 'gas constant', 'temperature (K)'; 'R = 287 J kg⁻¹ K⁻¹'

## s11_gas_law_numbers
Let's use it. What is the density of air at sea level, at one thousand and thirteen hectopascals and fifteen degrees? We turn the law around: rho equals p divided by R T. That's one hundred and one thousand three hundred and twenty-five pascals, divided by two hundred and eighty-seven times two hundred and eighty-eight point one five. The answer is about one point two two five kilograms per cubic metre, the number we used for the room.

> 78 words · 5 sentences · 375.950–409.000 s (33.1 s; speech 30.8 s) · 6:15.95–6:49.00 (measured) · beat: building blocks · worked number.
> Screen: CalcStack ρ = p/(RT) = 101 325 / (287 × 288.15) ≈ 1.225 kg/m³; gold link to the s08 room thumbnail '1.2'

## s12_warm_air_light
Now let's keep the pressure fixed and change only the temperature. At zero degrees, the density comes out at about one point two nine kilograms per cubic metre. At thirty degrees, it's about one point one six. So at the same pressure, warm air is about ten percent lighter than cold air. That's why a hot-air balloon floats, and why warm air tends to rise while cold air tends to sink. We'll meet this again with weather fronts.

> 78 words · 6 sentences · 409.000–440.975 s (32.0 s; speech 29.4 s) · 6:49.00–7:20.98 (measured) · beat: intuition · warm air is lighter.
> Screen: two cubes side by side at 1013 hPa: '0 °C → 1.29 kg/m³' (slate) and '30 °C → 1.16 kg/m³' (orange); '≈ 10 % lighter'; hot-air balloon icon rising

## s13_slab
Now let's work out how the pressure changes as we go up. Our goal is a rule for how fast it falls with height. Take a thin slab of air inside our column, standing on one square metre, with a small thickness, delta z. Here z is height, and delta z means a small step in height. The slab is at rest, so the forces on it must balance. The air below pushes it up, with a force equal to the pressure at its bottom, because the area is one square metre. The air above pushes it down, with the pressure at its top. And gravity pulls it down with its weight.

> 112 words · 8 sentences · 440.975–481.950 s (41.0 s; speech 37.7 s) · 7:20.98–8:01.95 (measured) · beat: why · pressure with height (setup).
> Screen: the s05 column with a thin slab highlighted; 'z' axis up; bracket 'Δz'; three arrows on the slab: orange up 'p(z)', orange down 'p(z + Δz)', brown down 'weight'

## s14_slab_weight
What does the slab weigh? Its volume is one square metre times delta z, so its mass is rho times delta z. Its weight is that mass times g: rho g delta z. Now the balance. The push up, minus the push down, equals the weight. So p at the bottom, minus p at the top, equals rho g delta z. The pressure at the bottom is bigger, by exactly the weight of the slab.

> 75 words · 7 sentences · 481.950–512.375 s (30.4 s; speech 27.5 s) · 8:01.95–8:32.38 (measured) · beat: why · the slab balance.
> Screen: CalcStack volume = 1 × Δz; mass = ρ Δz; weight = ρ g Δz; then p(z) − p(z+Δz) = ρ g Δz with the three arrows colour-matched

## s15_hydrostatic
Let's tidy this up. The pressure at the top minus the pressure at the bottom is the change in pressure across the slab, delta p. It's negative, because the pressure falls as we go up. So delta p equals minus rho g delta z. Divide both sides by delta z, and let the slab get thinner and thinner. Delta p over delta z becomes the derivative, partial p by partial z: how fast the pressure changes with height. Partial means only the height changes; the place and the time stay fixed. So partial p by partial z equals minus rho g. This is called hydrostatic balance: at every height, the pressure holds up the weight of the air above.

> 119 words · 9 sentences · 512.375–562.675 s (50.3 s; speech 46.7 s) · 8:32.38–9:22.67 (measured) · beat: why · hydrostatic balance.
> Screen: CalcStack Δp = −ρ g Δz → Δp/Δz = −ρ g → ∂p/∂z = −ρ g (main eq 96 px) with underbraces 'how fast p changes with height', 'weight per m³'; keyword 'hydrostatic balance'

## s16_hydrostatic_numbers
How fast is that near the ground? Rho is about one point two two five, and g is nine point eight one, so the pressure falls by about twelve pascals for every metre we climb. That's one hectopascal for about every eight metres. Ride a lift to the top of a three-hundred-metre tower, and the pressure drops by about thirty-six hectopascals. That's the change your ears notice. Hydrostatic balance holds very well for large weather systems, because their up and down accelerations are tiny compared with gravity.

> 87 words · 6 sentences · 562.675–601.150 s (38.5 s; speech 35.9 s) · 9:22.67–10:01.15 (measured) · beat: why · how fast near the ground.
> Screen: CalcStack ρ g = 1.225 × 9.81 ≈ 12 Pa/m; 100 Pa ÷ 12 Pa/m ≈ 8 m per hPa; 300 m × 12 Pa/m ≈ 3600 Pa = 36 hPa; tower with a lift icon and readout 1013 → 977 hPa

## s17_combine
But rho isn't fixed: the higher we go, the thinner the air. So let's bring in the gas law. It says rho equals p over R T. Let's put that into hydrostatic balance, in place of rho. We get partial p by partial z equals minus p g over R T. Now the fall in pressure per metre is proportional to the pressure itself. Where the pressure is high, near the ground, it falls fast. Higher up, where there's less pressure, it falls more slowly.

> 85 words · 8 sentences · 601.150–636.475 s (35.3 s; speech 32.1 s) · 10:01.15–10:36.48 (measured) · beat: why · bring in the gas law.
> Screen: ∂p/∂z = −ρ g with ρ highlighted; ρ = p/(RT) slides in; result ∂p/∂z = −p g/(RT); two small slope arrows on a p(z) sketch: steep low down, gentle higher up

## s18_scale_height
The group R T over g appears so often that it gets its own name: the scale height, capital H. Let's check its units. R is in joules per kilogram per kelvin, and a joule per kilogram is a metre squared per second squared. Multiply by T in kelvin, divide by g in metres per second squared, and we're left with metres: a height. At fifteen degrees, H is two hundred and eighty-seven times two hundred and eighty-eight point one five, divided by nine point eight one, which is about eight point four kilometres. Here's a nice surprise. If the air kept its ground-level density all the way up, the column would end at p over rho g, and that's the same eight point four kilometres.

> 126 words · 7 sentences · 636.475–686.900 s (50.4 s; speech 47.5 s) · 10:36.48–11:26.90 (measured) · beat: why · the scale height.
> Screen: H = RT/g (96 px) 'scale height'; units line J/(kg K) × K ÷ m/s² = m with strikes; CalcStack 287 × 288.15 / 9.81 ≈ 8.4 km; contrast: uniform-density column 8.4 km tall beside it

## s19_exponential
So now our rule reads: partial p by partial z equals minus p over H. Let's assume the temperature, and so H, is the same at every height. Divide both sides by p. The left side is now the rate of change of the natural log of p, so log p falls by one over H for every metre we climb. Add that up from the ground, where the pressure is p zero, to height z: the log of p over p zero equals minus z over H. Undo the log, and we get p equals p zero times e to the minus z over H.

> 106 words · 6 sentences · 686.900–725.800 s (38.9 s; speech 36.4 s) · 11:26.90–12:05.80 (measured) · beat: why · solving for p(z).
> Screen: CalcStack ∂p/∂z = −p/H → (1/p) ∂p/∂z = −1/H → ∂(ln p)/∂z = −1/H → ln(p/p₀) = −z/H → p = p₀ e^(−z/H) (96 px); keyword 'assume T the same at every height'

## s20_exponential_meaning
What does this curve tell us? Every time we climb one scale height, eight point four kilometres, the pressure is divided by e, which is about two point seven two. And every kilometre takes away the same fraction, about eleven percent of what's left. It's like a stack of foam mattresses: the bottom ones are squeezed the most, because they carry everything above them. Unlike mattresses, though, the air's layers aren't separate, and how much they squeeze also depends on their temperature. So the pressure halves about every five point eight kilometres: to about five hundred hectopascals at five point eight kilometres, and about two hundred and fifty at eleven point seven.

> 112 words · 6 sentences · 725.800–772.600 s (46.8 s; speech 44.2 s) · 12:05.80–12:52.60 (measured) · beat: intuition · what the curve says.
> Screen: on the curve: steps of H with '÷ e' marks (1013 → 373 → 137 hPa); '−11 % per km'; mattress stack (Like) with crossed-out note (Unlike); halving marks 5.8 km → 507 hPa, 11.7 km → 253 hPa

## s21_balloon_pressure
Does the real atmosphere follow this curve? Let's check it against a real weather balloon. Twice a day, at hundreds of places around the world, meteorologists launch a balloon carrying a small instrument package called a radiosonde. As it rises, it radios back the pressure, the temperature and the humidity, and from its drift we get the wind. This one was launched near Paris around midnight, at the start of the first of November, twenty twenty-three. In the picture, heights are drawn ten times taller than distances on the map, so that we can see the climb. Near the ground, its pressure follows our curve closely. Higher up, the real pressure falls a little faster, because the real air up there is colder, and colder air has a smaller scale height. So our curve is a good first guess, and the measurements tell us where it needs correcting.

> 148 words · 9 sentences · 772.600–822.575 s (50.0 s; speech 46.7 s) · 12:52.60–13:42.58 (measured) · beat: intuition · check against a real balloon.
> Screen: balloon rising from Trappes on a small true-colour map of France; graph: measured p(z) teal dots vs slate curve H = 8.4 km; gap highlighted aloft 'colder → smaller H'; Everest tick at 8.8 km with both values

## s22_mass_below
Since pressure is the weight of the air above, the pressure at any height also tells us how much air is left above it. At about five and a half kilometres, the pressure is half its ground value, so half of all the air is below us. At sixteen kilometres, it's about one tenth, so nine tenths of the air is below. And by about thirty-one kilometres, ninety-nine percent of the air is below. That's why the atmosphere is such a thin shell.

> 83 words · 5 sentences · 822.575–853.875 s (31.3 s; speech 29.1 s) · 13:42.58–14:13.88 (measured) · beat: intuition · how much air is below.
> Screen: column with fill bars: 5.5 km '½ below'; 16 km '9/10 below'; 31 km '99 % below'; mini globe with the 50x shell, the 31-km line marked

## s23_troposphere
Now let's look at the temperature that the same balloon measured. Here, height goes up and temperature goes across. Near the ground it's mild, and as the balloon climbs, the temperature falls, by about six and a half degrees for every kilometre on average. This lowest layer, where the temperature falls with height, is called the troposphere, from a Greek word for turning, because its air keeps overturning and mixing. Almost all our weather happens here: the clouds, the rain and the storms.

> 83 words · 5 sentences · 853.875–888.550 s (34.7 s; speech 32.5 s) · 14:13.88–14:48.55 (measured) · beat: building blocks · the layers (temperature).
> Screen: graph T(z) from the Trappes sounding (orange line, height 0-35 km up, T −80 … +20 °C across); slope triangle '−6.5 °C per km'; band 0-11 km shaded 'troposphere'; cloud icons in the band

## s24_stratosphere
At about eleven kilometres, at about minus sixty-three degrees, the fall stops. This boundary is called the tropopause. Above it, the temperature stops falling, and higher up it rises again. That's the stratosphere, a calm, layered region, where ozone absorbs the sun's ultraviolet light and warms the air. Balloons usually burst at around thirty kilometres, but other measurements show the warming going on above that, up to about fifty kilometres on average. Above that come the mesosphere and the thermosphere, where the air is extremely thin.

> 86 words · 6 sentences · 888.550–925.925 s (37.4 s; speech 34.8 s) · 14:48.55–15:25.92 (measured) · beat: building blocks · tropopause and stratosphere.
> Screen: tropopause line at ≈ 11 km '≈ −55 °C'; stratosphere band; balloon bursts ~30 km; dashed slate extension to 48 km (reanalysis, same place and time); ozone keyword with sun rays; 'mesosphere', 'thermosphere' above

## s25_tropics
Now let's keep the time the same and change only the place. Here is a balloon launched at the same moment at Singapore, near the equator. Its tropopause is much higher, at about sixteen or seventeen kilometres, and much colder, below minus seventy-five degrees. Strong rising currents in the warm tropics stir the air much higher, so the troposphere is deeper there. Near the poles, it's shallower, about eight to ten kilometres.

> 72 words · 5 sentences · 925.925–957.525 s (31.6 s; speech 29.4 s) · 15:25.92–15:57.52 (measured) · beat: contrast · change only the place.
> Screen: second profile (teal) from Singapore on the same axes; two tropopause marks 'Paris ≈ 11 km', 'Singapore ≈ 16-17 km'; mini globe with tropopause depth band thicker at the equator than at the poles

## s26_why_cold_aloft
Why does the air get colder as we go up, when that brings us closer to the sun? Because sunlight mostly passes straight through the air and warms the ground first. The ground then warms the air touching it, so the troposphere is heated from below, like a pan of water on a stove. Warm air near the ground rises. As it rises, it moves into lower pressure, so it expands. Expanding air pushes its surroundings away, and that work costs it energy, so it cools: by almost ten degrees for every kilometre it rises, as long as no cloud forms. We'll use this cooling for clouds in a moment.

> 110 words · 7 sentences · 957.525–1000.875 s (43.4 s; speech 40.5 s) · 15:57.52–16:40.88 (measured) · beat: why · heated from below.
> Screen: side view: sun rays through the air to the ground (gold), ground glows, warm parcel (orange blob) rises, grows, turns slate; labels 'p lower → expands → cools'; '≈ 9.8 °C per km'

## s27_vapour
Now let's add water. Water vapour is water as a gas, and it's invisible. Clouds and fog are not vapour: they're tiny drops of liquid water. The amount of vapour is often measured by the specific humidity: the grams of vapour in each kilogram of air. It goes from almost zero in cold polar air to about twenty grams per kilogram in warm, steamy tropical air. Vapour also adds its own small share to the air pressure, called the vapour pressure. Twenty grams per kilogram at sea level is a vapour pressure of about thirty-two hectopascals, out of about a thousand.

> 101 words · 7 sentences · 1000.875–1043.825 s (43.0 s; speech 40.0 s) · 16:40.88–17:23.83 (measured) · beat: building blocks · humidity.
> Screen: kettle-free icon: invisible vapour dots (faint) vs a cloud of drops (white); 'specific humidity q = g of vapour per kg of air'; real ERA5 2-m specific humidity globe (2 Nov 2023 12 UTC) 0 → 20 g/kg; 'vapour pressure ≈ 1.61 × q × p' → 32 hPa

## s28_saturation
Over a water surface, molecules leave the water and others land back in it, all the time. The fastest ones escape, and warmer water has more fast molecules. When as many land as leave, the air above is saturated, and its vapour pressure is called the saturation vapour pressure. It depends only on temperature, and it climbs steeply: about six hectopascals at zero degrees, twelve at ten, twenty-three at twenty, and forty-two at thirty. It roughly doubles for every ten degrees of warming. People often say warm air can hold more water, like a bigger sponge. Unlike a sponge, though, the air isn't doing the holding: the limit is set by the temperature, and it would be the same with no air at all.

> 124 words · 7 sentences · 1043.825–1094.650 s (50.8 s; speech 47.9 s) · 17:23.83–18:14.65 (measured) · beat: intuition · saturation.
> Screen: water surface with molecules leaving/landing (counters equal → 'saturated'); curve e_s(T) −10…35 °C with points 6, 12, 23, 42 hPa; '× 2 per 10 °C' steps; sponge icon with 'Like' / 'Unlike'

## s29_relative_humidity
Relative humidity compares the two. It's the vapour pressure divided by the saturation vapour pressure, as a percentage. Let's try air at twenty-five degrees with a vapour pressure of fifteen hectopascals. At twenty-five degrees, the saturation vapour pressure is about thirty-one point three. Fifteen divided by thirty-one point three is about point four eight, so the relative humidity is about forty-eight percent. Notice that it depends on the temperature as well as on the water. Cool the same air to eighteen degrees, and its relative humidity rises to about seventy-three percent, even though no water is added.

> 97 words · 7 sentences · 1094.650–1136.775 s (42.1 s; speech 39.2 s) · 18:14.65–18:56.78 (measured) · beat: building blocks · relative humidity.
> Screen: RH = vapour pressure ÷ saturation vapour pressure × 100 %; on the e_s curve: point at 25 °C, 15 hPa (teal) under the curve at 31.3 (gold); CalcStack 15 ÷ 31.3 ≈ 0.48 → 48 %; point slides left (cooling) and RH readout climbs

## s30_dew_point
So how far must we cool this air before it's saturated? We need the temperature at which the saturation vapour pressure has fallen to fifteen hectopascals. That's about thirteen degrees. This is the dew point: the temperature to which air must be cooled, keeping its water, to become saturated. On a clear night, grass cools below the dew point of the air touching it, and dew forms. When a whole layer of air near the ground cools to its dew point, we get fog. And when rising air cools to its dew point, we get a cloud.

> 97 words · 7 sentences · 1136.775–1175.375 s (38.6 s; speech 35.7 s) · 18:56.78–19:35.38 (measured) · beat: building blocks · dew point.
> Screen: teal dot slides left at 15 hPa until it touches the curve: '13 °C = dew point'; three small icons: dew on grass, fog layer, cloud

## s31_cloud_base
Let's follow that air parcel as it rises from the ground. It cools by almost ten degrees for every kilometre. Its dew point falls too, but slowly, by about two degrees per kilometre, because as the parcel expands, its vapour is spread more thinly. So the gap between the temperature and the dew point, twelve degrees at the ground, shrinks by about eight degrees for every kilometre. It closes after about one and a half kilometres. There the vapour condenses, and the cloud begins. That's why fair-weather clouds have flat bases: parcels rising from the same ground reach their dew point at about the same height.

> 106 words · 7 sentences · 1175.375–1219.525 s (44.2 s; speech 41.2 s) · 19:35.38–20:19.53 (measured) · beat: why · where clouds begin.
> Screen: side view: parcel rises; two lines on a height-temperature graph: T (orange, −9.8/km) and Td (teal, −1.8/km) meeting at ≈ 1.5 km; gap bracket '12 °C' at the ground; flat-based cumulus row at 1.5 km

## s32_wind_vector
Now let's look at wind. Wind is air moving across the Earth's surface, and it has both a speed and a direction, so it's a vector: an arrow. We can split the arrow into two parts, called components. The eastward part is written u, and the northward part is written v. Take a wind blowing towards the north-east, with u equal to eight and v equal to six metres per second. By Pythagoras, its speed is the square root of eight squared plus six squared, which is ten metres per second.

> 91 words · 6 sentences · 1219.525–1255.300 s (35.8 s; speech 33.2 s) · 20:19.53–20:55.30 (measured) · beat: building blocks · wind is a vector.
> Screen: compass rose map patch; teal wind arrow with components: 'u = 8 m/s' along east, 'v = 6 m/s' along north; 'v = (8, 6) m/s'; CalcStack √(8² + 6²) = √100 = 10 m/s

## s33_wind_direction
Meteorologists name a wind by where it comes from, not where it's going. A westerly wind blows from the west, towards the east. The direction is given in degrees, measured clockwise from north as seen from above: north is zero, east ninety, south one hundred and eighty, and west two hundred and seventy. Our wind blows towards the north-east, so it comes from the south-west. Its direction is about two hundred and thirty-three degrees, and we call it a south-westerly. Careful: ocean currents use the opposite habit, and are named by where they go, so an eastward current flows towards the east.

> 102 words · 6 sentences · 1255.300–1298.225 s (42.9 s; speech 40.4 s) · 20:55.30–21:38.22 (measured) · beat: building blocks · the direction convention.
> Screen: compass dial 0/90/180/270 'clockwise from north, seen from above'; westerly arrow entering from the west; our wind with a gold arc from north clockwise to its tail: '233°' 'from the south-west'; 'south-westerly'; contrast: 'eastward current →'

## s34_wind_units
Wind speed comes in several units. Metres per second is the scientific one. Multiply by three point six to get kilometres per hour, so ten metres per second is thirty-six kilometres per hour. Sailors and pilots use knots. A knot is one nautical mile per hour, and a nautical mile, one thousand eight hundred and fifty-two metres, is about one sixtieth of a degree of latitude along the Earth's surface. So one knot is about point five one metres per second, and our ten metres per second wind is about nineteen knots.

> 92 words · 6 sentences · 1298.225–1337.750 s (39.5 s; speech 37.0 s) · 21:38.22–22:17.75 (measured) · beat: building blocks · units and knots.
> Screen: CalcStack 10 m/s × 3.6 = 36 km/h; globe meridian with a 1° arc split into 60 parts: '1 nautical mile = 1852 m'; '1 kt = 1852 m ÷ 3600 s ≈ 0.51 m/s'; '10 ÷ 0.514 ≈ 19 kt'

## s35_why_wind
Why does air move at all? The simplest reason is pressure. Where the pressure is higher on one side than on the other, the air is pushed from high pressure towards low pressure, just as air rushes out of a punctured tyre. But on our spinning Earth, moving air is gradually turned aside, so over large distances the wind ends up blowing around areas of high and low pressure, rather than straight into them. We'll see how that turning works in later videos on the Coriolis effect and the geostrophic wind.

> 91 words · 5 sentences · 1337.750–1372.675 s (34.9 s; speech 32.7 s) · 22:17.75–22:52.67 (measured) · beat: why · what pushes the wind.
> Screen: two barometer dials 'high' / 'low' with an orange push arrow high → low; tyre icon; then a curved arrow bending round an 'L' on a small sketch 'turned aside'

## s36_weather_climate
Before we look at real maps, let's pin down two words. Weather is the state of the atmosphere at one place and time: its temperature, pressure, humidity, wind, clouds and rain, right now or over the next few days. Climate is the statistics of the weather over many years, usually thirty: what's normal, and how far the weather usually strays from it. Here is the daily temperature at Brest, in north-western France, for every day of twenty twenty-three. Behind it is Brest's climate for each day of the year, the average over nineteen ninety-one to twenty twenty, with a band that holds eight days out of ten. The weather line jumps around from day to day, but most of the time it stays inside the band. Climate is what you expect; weather is what you get.

> 136 words · 7 sentences · 1372.675–1426.375 s (53.7 s; speech 50.8 s) · 22:52.67–23:46.38 (measured) · beat: building blocks · weather vs climate.
> Screen: keywords 'weather: now, a few days' / 'climate: 30-year statistics'; TimeGraph Jan-Dec 2023: daily mean T at Brest (orange) over the 1991-2020 daily mean (warm white) and 10-90 % band (slate fill)

## s37_observations
How do we know the weather everywhere? From observations: thousands of weather stations, weather balloons, ships, buoys and aircraft, and many satellites. But they're uneven. Here are the places that launched weather balloons in twenty twenty-three. They're crowded over Europe, North America and East Asia, but sparse over the oceans, much of Africa, and the poles. And each instrument measures different things, at different times.

> 65 words · 6 sentences · 1426.375–1458.350 s (32.0 s; speech 29.4 s) · 23:46.38–24:18.35 (measured) · beat: building blocks · observations.
> Screen: Globe3D (daytime mosaic) with gold dots at IGRA2 stations active in 2023; slow rotation Europe → Pacific → Africa; small icons station/balloon/ship/buoy/plane/satellite

## s38_reanalysis
A reanalysis fills in the gaps. It starts from a weather forecast model, a computer program that steps the laws of physics forward in time, including the hydrostatic balance and the gas law we just met. Every few hours, it nudges the model towards all the observations made at that time, trusting the more reliable ones more. The result is a complete picture of the atmosphere, at every place and height, every hour, for decades. The one we use in this video is called ERA5, made by the European Centre for Medium-Range Weather Forecasts. It runs from nineteen forty to today, on a grid with points about thirty kilometres apart. It's like a jigsaw with missing pieces, filled in using the pieces around them and the rules of physics. Unlike a photograph, though, where observations are sparse the result leans more on the model, so it's least certain there.

> 149 words · 8 sentences · 1458.350–1519.625 s (61.3 s; speech 58.0 s) · 24:18.35–25:19.62 (measured) · beat: building blocks · reanalysis.
> Screen: station dots → a coarse model grid lights up → the full ERA5 field (2-m temperature, 2 Nov 2023 12 UTC) fills the globe; keywords 'model + observations', 'every hour since 1940', '≈ 30 km grid'; jigsaw icon Like / Unlike

## s39_surface_pressure
Now let's make a pressure map. Here is the real air pressure at the ground all over the world, at midday on the second of November, twenty twenty-three, from the reanalysis. What stands out are the mountains. Over Tibet and the Himalayas, the pressure at the ground is less than six hundred hectopascals, and the Andes and the Rockies show up too. In the close-up, the mountains are drawn thirty times taller than they really are. That's just hydrostatic balance: high ground has less air above it. The weather is in there, but these mountain patterns swamp it.

> 98 words · 7 sentences · 1519.625–1553.975 s (34.3 s; speech 31.8 s) · 25:19.62–25:53.97 (measured) · beat: intuition · a pressure map, and the mountain problem.
> Screen: Globe3D: ERA5 surface pressure (sequential map 500-1040 hPa) over shaded relief; camera to Tibet: '< 600 hPa'; Andes, Rockies pointers; keyword 'less air above high ground'

## s40_sea_level
So how do we compare a mountain town with a seaside town? We imagine what the pressure would be if each place were at sea level. Suppose a weather station sits one thousand six hundred and nine metres up, about the height of Denver in the United States, and reads eight hundred and thirty-five hectopascals, with an air temperature of fifteen degrees. We add the weight of an imaginary column of air, reaching from the station down to sea level. With our exponential rule run downwards, that's eight hundred and thirty-five times e to the power of one point six oh nine divided by eight point four three. That's about one thousand and ten hectopascals: a perfectly ordinary sea-level reading. This is called the sea-level pressure. Real weather services use a slightly more careful version of the same idea.

> 139 words · 8 sentences · 1553.975–1611.150 s (57.2 s; speech 53.9 s) · 25:53.97–26:51.15 (measured) · beat: why · reducing to sea level.
> Screen: side view: station on a mountain at 1609 m, 'p = 835 hPa', 'T = 15 °C'; dashed imaginary column down to sea level; CalcStack p_sea = p_s e^(z/H) = 835 × e^(1.609/8.43) ≈ 1010 hPa; keyword 'sea-level pressure'

## s41_msl_isobars
Here is the same moment again, now as sea-level pressure. The mountains are gone, and the weather appears. Let's join the places that have the same sea-level pressure, every four hectopascals. These lines are called isobars, from Greek words for equal weight. Where the isobars crowd together, the pressure changes quickly over a short distance, and the winds are strong.

> 60 words · 5 sentences · 1611.150–1638.150 s (27.0 s; speech 24.8 s) · 26:51.15–27:18.15 (measured) · beat: intuition · sea-level pressure and isobars.
> Screen: cross-fade surface pressure → ERA5 MSLP on the globe; isobars draw outward every 4 hPa; keyword 'isobars = equal weight'; gold bracket where they crowd near Ciarán

## s42_highs_lows
The map shows round patches where the pressure is higher than all around, called highs, and patches where it's lower than all around, called lows. A low is also called a depression, or a cyclone, and a high is also called an anticyclone. Over the east coast of England, at the edge of the North Sea, is a deep low, Storm Ciarán, at about nine hundred and fifty-six hectopascals. Far to the south-west, near the Azores islands, is a high at about one thousand and thirty. Here is a much more recent map, a weather-service analysis from the twenty-seventh of October, twenty twenty-six. Its deepest low is a typhoon over the western Pacific, at about nine hundred and thirty-five hectopascals, while a low over the North Atlantic, at about nine hundred and fifty-five, is about as deep as Ciarán.

> 139 words · 6 sentences · 1638.150–1672.200 s (34.0 s; speech 32.2 s) · 27:18.15–27:52.20 (measured) · beat: building blocks · highs and lows.
> Screen: 'H' and 'L' letters (68 px) at the analysed centres; 'L 956 hPa' Ciarán; 'H ≈ 1030 hPa' near the Azores; keywords 'low = depression = cyclone', 'high = anticyclone'

## s43_lows_cloudy
Lows and highs bring different weather, and now we can see why. Near the ground, air drifts in towards the centre of a low. It can't pile up there, so it rises. Rising air expands and cools, it reaches its dew point, and clouds and rain form. That's why lows bring cloudy, wet and windy weather. Around a high, air sinks from above and spreads out near the ground. Sinking air is squeezed and warms, so it moves away from its dew point, and clouds evaporate. That's why highs usually bring settled, dry weather.

> 94 words · 8 sentences · 1672.200–1711.750 s (39.5 s; speech 36.3 s) · 27:52.20–28:31.75 (measured) · beat: why · lows are cloudy, highs are clear.
> Screen: split: satellite true colour of Ciarán's cloud spiral (left) vs clear skies under the Azores high (right), same image 2 Nov 2023; side-view inset arrows: low = in + up (cloud), high = down + out (clear)

## s44_round_lows
Now let's add the real winds near the ground, measured ten metres up, from the same reanalysis. Near Ciarán, the air doesn't blow straight into the low. It swirls around it, anticlockwise as seen from above, crossing the isobars only slightly towards the centre. Around the high, it turns the other way, clockwise as seen from above. In the southern hemisphere, both are reversed. Why the wind circles instead of rushing in is the story of the Coriolis effect, and it has its own video.

> 85 words · 6 sentences · 1711.750–1746.225 s (34.5 s; speech 31.9 s) · 28:31.75–29:06.22 (measured) · beat: intuition · winds circle the lows.
> Screen: 10-m wind arrows (teal, thinned 1.5°) with streaklines on the image + isobars; gold anticlockwise arc round the L 'anticlockwise, seen from above'; clockwise arc round the H; small SH globe thumbnail with arcs reversed

## s45_air_masses
Now let's look at temperature and moisture together. Air that sits for days over one region takes on its character: cold and dry over snowy land in the far north, warm and moist over tropical seas. A huge body of air like this, often more than a thousand kilometres across, with fairly even temperature and humidity, is called an air mass. Air masses are named after where they come from: polar or tropical, and maritime, from over the sea, or continental, from over land. On the first of November, twenty twenty-three, warm, moist tropical air was flowing north-east towards France, ahead of Ciarán, while cooler polar air followed behind it.

> 110 words · 5 sentences · 1746.225–1791.900 s (45.7 s; speech 43.5 s) · 29:06.22–29:51.90 (measured) · beat: building blocks · air masses.
> Screen: four labels in a 2 × 2 grid without boxes: polar / tropical × maritime / continental; real ERA5 850-hPa temperature + 2-m dew point map 1 Nov 2023 18 UTC over the true-colour image: warm tongue 'tropical maritime', cool air 'polar maritime'

## s46_fronts
Where two air masses meet, they don't mix right away. The change from one to the other is squeezed into a narrow zone, often a hundred kilometres wide or less, called a front. Crossing a front, the temperature and the humidity change quickly, and the wind changes direction. A front is named after the air that's advancing. If cold air is pushing forward, it's a cold front. If warm air is advancing, it's a warm front.

> 76 words · 6 sentences · 1791.900–1823.675 s (31.8 s; speech 29.2 s) · 29:51.90–30:23.67 (measured) · beat: building blocks · fronts.
> Screen: the s45 map: a gold transect across the warm tongue's edge; graph of T850 along it with a steep step 'front'; arrows 'cold advancing → cold front', 'warm advancing → warm front'

## s47_cold_front
Let's look at a cold front from the side. Remember the gas law: at the same pressure, cold air is denser than warm air. So the advancing cold air stays low and pushes in under the warm air like a wedge. Its slope is steep for a front, about one kilometre up for every fifty to a hundred kilometres along, and the warm air is lifted quickly. It cools to its dew point, and tall clouds and heavy showers form in a narrow band. After the front passes, the air is colder and drier, the pressure starts to rise, and the wind turns, in the northern hemisphere usually from the south-west to the west or north-west.

> 116 words · 6 sentences · 1823.675–1867.675 s (44.0 s; speech 41.5 s) · 30:23.67–31:07.67 (measured) · beat: why · a cold front from the side.
> Screen: side-view cross-section (height ×50): slate cold wedge advancing right under orange warm air; warm air lifted (orange arrows up) → tall cumulonimbus and rain band; '1 km per 50-100 km'; wind arrows before/after 'SW → W/NW'

## s48_warm_front
At a warm front, the warm air is advancing, but it's lighter, so it can't push the cold air away from below. Instead, it glides up over the cold air on a gentle slope, rising about one kilometre for every one or two hundred kilometres. As it slides upwards it cools, and a broad sheet of layered cloud forms far ahead of the front, bringing long spells of steady rain. When the warm front passes, the air turns milder and moister, and the wind turns, in the northern hemisphere usually from the south-east to the south or south-west. We've drawn these side views fifty times taller than they really are, so the slopes look much steeper than in nature.

> 119 words · 5 sentences · 1867.675–1912.900 s (45.2 s; speech 43.0 s) · 31:07.67–31:52.90 (measured) · beat: why · a warm front from the side.
> Screen: side view: orange warm air gliding up a gentle slate slope; layered cloud sheet far ahead with long rain; '1 km per 100-200 km'; wind 'SE → S/SW'; keyword '× 50 taller'

## s49_real_fronts
Here are real fronts, around Ciarán at six in the evening on the first of November. The colours show the temperature about one and a half kilometres up, where the ground's daily warming and cooling matter less. The warm tropical air reaches up towards Brittany in a tongue. Along its leading edge, to the east, is the warm front. Along its trailing edge, curving away to the south-west, is the cold front. The arrows show the wind turning as it crosses the fronts, most sharply at the warm front.

> 89 words · 6 sentences · 1912.900–1946.075 s (33.2 s; speech 30.6 s) · 31:52.90–32:26.08 (measured) · beat: application · real fronts round Ciarán.
> Screen: map 40-60N 25W-10E: ERA5 850-hPa T at 00 UTC 2 Nov over a night-free base (BMNG relief, labelled 'base map'), coast/borders; front lines from the thermal front parameter: warm front (red half circles) and cold front (blue triangles) drawn as gold lines first; wind arrows 850 hPa turning across them

## s50_front_symbols
On weather maps, fronts are drawn as lines with symbols on the side they're moving towards. A cold front has blue triangles, and a warm front has red half circles. You'll learn to read these maps in detail in the next video.

> 42 words · 3 sentences · 1946.075–1962.775 s (16.7 s; speech 15.2 s) · 32:26.08–32:42.78 (measured) · beat: application · map symbols (pointer forward).
> Screen: the gold lines of s49 gain their symbols: blue triangles on the cold front's leading side, red half circles on the warm front's; keyword 'symbols point where the front moves'

## s51_heating
Now let's zoom out to the whole planet, and ask why the weather moves at all. It starts with sunlight. Picture a beam of sunlight one metre wide, at noon at an equinox, in March or September, when the sun is overhead at the equator. At the equator, it lands on one metre of ground. At sixty degrees north, the ground is tilted to the beam, and the same beam is spread over two metres, so each square metre gets half as much. So the tropics are heated much more than the poles, and the atmosphere and the ocean carry heat from the tropics towards the poles. Storms like Ciarán are one of the ways the atmosphere does it.

> 119 words · 7 sentences · 1962.775–2007.000 s (44.2 s; speech 41.3 s) · 32:42.78–33:27.00 (measured) · beat: application · the global picture (heating).
> Screen: globe at equinox, sun beam (gold band 1 m wide) hitting the equator (1 m patch) and 60°N (2 m patch); CalcStack 1 ÷ cos 60° = 2; 'half as much'; then poleward orange arrows over a mean 2-m temperature globe

## s52_pressure_belts
Averaged over many years, sea-level pressure falls into belts. Around thirty degrees north and south, air sinks from high up, and large highs sit over the oceans, like the Azores high we saw. These are the subtropical highs. Near the equator is a belt of low pressure where the winds from both hemispheres meet and rise, building tall thunderclouds. It's called the intertropical convergence zone. How these belts are made is the subject of a later video on the general circulation.

> 81 words · 6 sentences · 2007.000–2043.250 s (36.2 s; speech 33.7 s) · 33:27.00–34:03.25 (measured) · beat: application · high and low pressure belts (preview).
> Screen: Globe3D: 1991-2020 mean MSLP (NCEP R1 LTM, diverging map centred 1013 hPa) with isobars every 4 hPa; labels 'subtropical highs' at the Azores, North Pacific, South Atlantic, South Pacific, Indian Ocean highs; equatorial band 'intertropical convergence zone (ITCZ)'

## s53_trades_westerlies
The winds near the ground follow these belts. Between the subtropical highs and the equator, steady winds blow from the east, called the trade winds; sailing ships relied on them to cross the oceans. North of the equator, they come from the north-east. South of it, they come from the south-east. Poleward of the subtropical highs, in the middle latitudes, the winds come mostly from the west: the westerlies. That's why storms like Ciarán usually travel from west to east. Why the winds bend like this is part of the Coriolis story, coming in a later video.

> 97 words · 7 sentences · 2043.250–2083.900 s (40.7 s; speech 37.8 s) · 34:03.25–34:43.90 (measured) · beat: application · trade winds and westerlies (preview).
> Screen: same globe: mean 10-m wind arrows (teal) with streaklines; labels 'north-east trades', 'south-east trades', 'westerlies' with gold brackets; Ciarán track arrow west → east

## s54_ciaran_intro
Now let's put all of this together on one real storm, and watch it from one town. On the first of November, twenty twenty-three, Storm Ciarán was racing across the Atlantic towards Europe. Here it is from a satellite that afternoon, with coastlines and borders drawn in. And here is Brest, a port city at the western tip of France. Let's watch the storm pass over Brest, hour by hour, using the reanalysis. Times are in universal time, the clock that meteorologists everywhere share.

> 84 words · 6 sentences · 2083.900–2120.375 s (36.5 s; speech 33.9 s) · 34:43.90–35:20.38 (measured) · beat: application · one storm over one town.
> Screen: true colour 1 Nov 2023 afternoon (MODIS), 35-60N 30W-10E, coast + admin borders; 'Storm Ciarán · 1 Nov 2023'; gold dot 'Brest'; keyword 'UTC = universal time'

## s55_ciaran_maps
Here are the isobars every four hectopascals, with the warm front in red and the cold front in blue, from midday on the first of November to midday on the second. The low deepens as it comes, from about nine hundred and seventy to about nine hundred and fifty-four hectopascals, and its centre crosses the English Channel just north of Brest during the night.

> 64 words · 2 sentences · 2120.375–2141.525 s (21.2 s; speech 20.0 s) · 35:20.38–35:41.53 (measured) · beat: application · the low moves in.
> Screen: same panel; hourly ERA5 isobars animate 12 UTC 1 Nov → 12 UTC 2 Nov with the clock; 'L' tracking the minimum with its value ticking 965 → 954 hPa; gold track line; Brest dot

## s56_brest_pressure
First, the pressure at Brest. At midday on the first, it reads about nine hundred and ninety-seven hectopascals. Then it falls, faster and faster, to about nine hundred and sixty-two at one o'clock in the morning, as the low passes close by. That's thirty-five hectopascals in thirteen hours, a very fast fall. Then it climbs again, by about fourteen hectopascals in five hours.

> 63 words · 5 sentences · 2141.525–2171.200 s (29.7 s; speech 27.5 s) · 35:41.53–36:11.20 (measured) · beat: application · the pressure at Brest.
> Screen: TimeGraph (12 UTC 1 Nov → 12 UTC 2 Nov): Brest MSLP (orange line, hour dots) 997 → 962 → 976 hPa; brackets '−35 hPa in 13 h', '+14 hPa in 5 h'; barometer icon needle following; small map thumbnail with the L passing

## s57_brest_warm_front
Now the temperature and the wind. At six in the evening, the wind blows from the south-south-east at about thirteen metres per second, and the temperature is twelve degrees. By eight, the wind has turned to come from the south-south-west, it has strengthened to about eighteen metres per second, and the temperature has risen to about fourteen and a half. That's the warm front passing. Brest is now in the warm air behind it, which is called the storm's warm sector.

> 81 words · 5 sentences · 2171.200–2203.525 s (32.3 s; speech 30.1 s) · 36:11.20–36:43.53 (measured) · beat: application · the warm front passes.
> Screen: TimeGraph gains temperature (orange, °C axis right) and a row of wind arrows (teal, pointing where the wind goes, with 'from' labels 155° SSE, 204° SSW and speeds); gold band 18-20 UTC 'warm front'; keyword 'warm sector'

## s58_brest_cold_front
A few hours later comes the cold front. Between midnight and three in the morning, the wind swings from the south-west to the west and strengthens: by three, it's about twenty-three metres per second, or forty-five knots. The temperature drops by about two degrees, to ten and a half, and the pressure starts its fast climb. Cooler polar air has arrived behind the front, just as our side view said.

> 70 words · 4 sentences · 2203.525–2231.775 s (28.2 s; speech 26.4 s) · 36:43.53–37:11.78 (measured) · beat: application · the cold front passes.
> Screen: same TimeGraph: wind arrows at 00 UTC '19 m/s from 221° (SW)' and 03 UTC '23 m/s from 271° (W)'; CalcStack 23.2 ÷ 0.514 ≈ 45 kt; temperature 12.6 → 10.5 °C bracket '−2 °C'; gold band 00-03 UTC 'cold front'; thumbnail of the s47 side view

## s59_ciaran_after
Here is the storm the next afternoon, seen from space, now over the North Sea, with its clouds wrapped in a spiral around the low. In the next video, we'll learn to read weather maps like this one in detail. And later videos will explain why the wind circles the low instead of rushing into it.

> 56 words · 3 sentences · 2231.775–2253.100 s (21.3 s; speech 19.8 s) · 37:11.78–37:33.10 (measured) · beat: application · the storm the next afternoon, and what comes next.
> Screen: MODIS Aqua true colour 2 Nov 2023 with isobars at 12 UTC and the L; Brest dot; keywords 'reading weather maps ->', 'why the wind circles ->'

## s60_recap
To sum up, the atmosphere is a thin shell of air, and almost all our weather happens in its lowest layer, the troposphere. Air pressure is the weight of the air above each square metre, about one thousand and thirteen hectopascals at sea level. By hydrostatic balance, it falls with height, roughly exponentially, with a scale height of about eight kilometres. The gas law, p equals rho R T, ties pressure, density and temperature together, so warm air is lighter than cold air. Relative humidity compares the vapour with its saturation value, and cooling air to its dew point makes clouds. Winds are named by where they come from, and are measured in metres per second or knots. Sea-level pressure maps show highs and lows, and fronts are the boundaries between air masses. Weather is what happens now, climate is its long-term statistics, and a reanalysis gives us both, everywhere, every hour.

> 152 words · 8 sentences · 2253.100–2317.550 s (64.5 s; speech 61.2 s) · 37:33.10–38:37.55 (measured) · beat: recap.
> Screen: one beat per sentence, mini pictures: thin-shell globe · '1013 hPa' column · p = p₀e^(−z/H), H ≈ 8 km · p = ρRT with two cubes · RH curve + dew point ring · compass '233° south-westerly', '19 kt' · MSLP map with H/L and front symbols · Brest TimeGraph + ERA5 globe

## s61_end
This video is one of a series of related tutorials, so watch out for the others. They're made to help students of meteorology, atmospheric science and climate science, and anyone else who wants to learn not just these ideas, but the maths behind them too. The notebook for these weather basics, and the notebooks for the other concepts, are on the website that goes with this video.

> 67 words · 3 sentences · 2317.550–2340.150 s (22.6 s; speech 21.6 s) · 38:37.55–39:00.15 (measured) · beat: end card.
> Screen: house end card: four faint topic thumbnails (globe with shell, pressure column, humidity curve, Ciarán map); 'a series of tutorials' (68 px); 'meteorology · atmospheric science · climate' (54 px); 'the ideas, and the maths behind them' (54 px, gold); notebook icon 'weather-basics notebook'; stacked icons 'notebooks for the other concepts'; 2.5-s silent hold

> Total: 5696 words · 363 sentences · 2340.150 s narration · 2342.650 s movie (39:02.65) · 146.0 words per minute.
