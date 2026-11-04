# ch00_gradient — narration (movie-director, 2026-10-28)

Series plan v2 **Stage 1 #6 "The gradient"** (gradient operator, directional derivative, pressure and temperature
gradients). House style `movies/HOUSE_STYLE.md` (binding). Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice;
our own words; maths spoken in words; `[beat]` = 1.5-s hold after a worked calculation (not spoken, not captioned).

**Build 1 (2026-11-04, motion-builder):** data_needs decisions applied before the final TTS: s29 S6 (Pointe du Raz 207 km/h, unverified) dropped; s33b_front_stack added (Elliott 22 Dec 2022, 4 layers, reworded per the 2026-10-30 decision); s36 moved to the real zonal-mean wind of September 2026 (D6: 45° N, about six K per 1000 km, about twelve km, about twenty six m/s); s37 S3 states the measured OISST north-wall drop (6.5 °C in 35 km, 29 Oct 2026). s18 S4 corrected: grad capital T points almost straight DOWN (towards the warmer air below; the old line said 'up', which is the wrong sign: ∂T/∂z < 0). Measured numbers: `timing.json`, `build1_log.md`.

**v3 (2026-11-04), plan-v5 pointer fixes, measured:** s07_operator (S5: 9.0 -> 9.075 s), s30_coriolis (S9: 5.225 -> 7.375 s); clips from `tools/tts.py` (dry run `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/v5_pointer_dryrun`), every other clip kept and shifted. **298 sentences, 4493 words, narration 1900.875 s + 2.5-s hold = 1903.375 s (31:43.38), 141.6 words per minute overall.** The v2 and v1 numbers below are kept for the record.

**v2 (2026-10-30), HOUSE_STYLE §5b amendment, measured:** changed scenes s17_lapse_rate, s18_thin_layer, s32_vertical_pressure re-run with `tools/tts.py` (dry run `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/c56_5b_dryrun`); every other scene keeps its v2 clip lengths, shifted. **40 scenes, 298 sentences, 4487 words, narration 1898.650 s + 2.5-s hold = 1901.150 s (31:41.15), 141.8 words per minute overall.** The v1 numbers below are kept for the record.

**v1: Measured, not estimated.** `tools/tts.py` dry run on 2026-10-28 into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_gradient/dryrun/v2` (input = this narration, current `movies/lexicon.yaml`, not edited): **40 scenes, 296 sentences, 4430 words, 36 beats, 1878.650 s narration + 2.5-s silent end-card hold = 1881.150 s (31:21.15)**; speech alone 1717.7 s = 154.7 words per minute while speaking, **141.5 words per minute overall** (limit 150); 469 caption cues; self-check {'expected_s': 1878.65, 'audio_s': 1878.65, 'diff_ms': 0.0, 'len_ok': True, 'cues_ok': True}; warnings: none.

**Spoken-symbol rules.** "grad h", "grad capital T", "grad p" (never a bare "del h"); "partial h by partial x"; "n hat",
"x hat", "y hat", "z hat"; "d s", "d phi", "d lambda"; "rho" for density; "cosine alpha" / "sine alpha" (never "cos");
temperature is "capital T" in symbols, time is never needed. The Earth's radius is never a lone "a" ("the Earth's radius",
"the radius"); latitude phi, longitude lambda. Every clockwise/anticlockwise carries "seen from above" and the hemisphere.

**Cross-references (user rule 2026-10-27), spoken and on the end card:** derivatives and Taylor (#4: s03, s04, s25),
vectors and index notation (#1a: s06, s07), dot product (0.1b: s10, s34), coordinates (#5: s22), weather basics (0.3:
s24, s32, s33), divergence, curl, Laplacian (T01-T03, "later in this series": s07), contour maps and how they are made (#6A, #6B: s12),
Coriolis (back-pointer to #3; the Coriolis movie M03 takes it further: s30), gradient wind (#30: s30), pressure coordinates (#23A: s32), material derivative (#10: s34), thermal
wind (#32: s36), ocean currents (#53: s37). Fronts (#40) and extratropical cyclones (#42) are in `related:` only.

**Proposed lexicon entries** (not added; check by ear): nabla, Chamonix, Mont Blanc, Pointe du Raz, Ganges, ETOPO,
Svalbard, GFS. See data_needs.md §E.

Lines starting with ">" are notes and are not spoken.

## s00_title
In this video, we'll learn the gradient the easy way, and see how meteorology uses it to find which way the air is pushed, and why the wind blows hardest where the isobars crowd together.

> 35 words · 1 sentences · 0 beats · 0.300–13.175 s (12.9 s; speech 12.1 s) · 0:00.30–0:13.18 (measured, dry run v2, shifted).
> Beat: opening title (HOUSE_STYLE §3).

## s01_hook
What is the gradient? Let's see what it is, and why it's built this way. Then let's see what it tells us about mountains, storms and the wind.

> 28 words · 3 sentences · 0 beats · 13.175–24.475 s (11.3 s; speech 9.8 s) · 0:13.18–0:24.48 (measured, dry run v2, shifted).
> Beat: hook question.

## s02_fields
Let's start with a mountain. At every place on a map, the ground has a height above sea level. A quantity that has a value at every place is called a field. Height is a scalar field: at each place, it's just one number. Temperature and pressure are scalar fields too, and they're what the weather is made of. Today's question is simple. Standing at one place in a field, which way does it increase fastest, and how fast?

> 79 words · 7 sentences · 0 beats · 24.475–56.400 s (31.9 s; speech 29.0 s) · 0:24.48–0:56.40 (measured, dry run v2, shifted).
> Beat: building block: scalar field.

## s03_fog
Imagine you're standing on a hillside in thick fog. You can't see the top, but you can feel the slope under your feet. Take a step east, and you climb a little. Take a step north, and you climb a bit more. These two slopes are partial derivatives, which we met in the derivatives movie. Partial h by partial x is how fast the height, h, changes going east, with north held fixed. Partial h by partial y is how fast it changes going north. On our hillside, let's say the ground rises thirty metres for every kilometre east, and forty metres for every kilometre north.

> 106 words · 8 sentences · 0 beats · 56.400–99.300 s (42.9 s; speech 39.7 s) · 0:56.40–1:39.30 (measured, dry run v2, shifted).
> Beat: building block: partial derivatives on a hillside.

## s04_sweep
So which way is steepest? Let's try some directions. Going east, we climb thirty metres per kilometre, and going north, forty. What about a direction in between? From the derivatives movie, a small change in height is the slope east times the step east, plus the slope north times the step north. Walk one kilometre north-east, and you go about zero point seven one kilometres east, and zero point seven one kilometres north. So you climb thirty times zero point seven one, plus forty times zero point seven one, which is about forty nine and a half metres. [beat] That beats both east and north. Now let's turn slowly through every direction, and draw the climb for each one. The curve rises, peaks, and falls again. Its peak is fifty metres per kilometre, at fifty three degrees from east. [beat]

> 138 words · 11 sentences · 2 beats · 99.300–160.700 s (61.4 s; speech 55.2 s) · 1:39.30–2:40.70 (measured, dry run v2, shifted).
> Beat: intuition: try every direction.

## s05_reveal
Now look at those two numbers. Fifty is the square root of thirty squared plus forty squared, by Pythagoras. And fifty three degrees is exactly the direction of an arrow that goes thirty east and forty north. So let's build an arrow from the two slopes, with thirty as its east part and forty as its north part. It points the steepest way uphill, and its length is the steepest slope. That arrow is called the gradient.

> 77 words · 6 sentences · 0 beats · 160.700–191.775 s (31.1 s; speech 28.5 s) · 2:40.70–3:11.78 (measured, dry run v2, shifted).
> Beat: intuition: the arrow built from the two slopes.

## s06_definition
Let's write it down. The gradient of h is written with an upside down triangle, called nabla, or del, and we read it grad h. Grad h equals x hat times partial h by partial x, plus y hat times partial h by partial y. Here x hat and y hat are the unit arrows pointing east and north, from the vectors movie. For our hillside, grad h is thirty x hat plus forty y hat, in metres per kilometre. Its length is fifty metres per kilometre. [beat] So the gradient turns a scalar field into a vector at every place.

> 100 words · 7 sentences · 1 beats · 191.775–233.975 s (42.2 s; speech 38.1 s) · 3:11.78–3:53.97 (measured, dry run v2, shifted).
> Beat: building block: the definition.

## s07_operator
The upside down triangle on its own is called the del operator. Think of it as an arrow made of derivatives, waiting for a field: x hat partial by partial x, plus y hat partial by partial y, plus z hat partial by partial z. The third part is the change going up, which matters for fields that fill the air, like temperature. In index notation, from the vectors movie, the i-th component of grad f is partial f by partial x i. The same del operator also builds the divergence, the curl and the Laplacian, and each of them has its own movie later in this series.

> 108 words · 5 sentences · 0 beats · 233.975–276.600 s (42.6 s; speech 40.4 s) · 3:53.97–4:36.60 (measured, dry run v2 + plan-v5 pointer clips, shifted).
> Beat: building block: the del operator and index form.

## s08_units
A gradient has the field's unit, divided by a length. A height gradient is metres per kilometre, which is just a slope. A temperature gradient is kelvins per metre, though forecasters usually say degrees per hundred kilometres. A kelvin step is the same size as a degree Celsius step. A pressure gradient is pascals per metre, or hectopascals per hundred kilometres.

> 61 words · 5 sentences · 0 beats · 276.600–305.100 s (28.5 s; speech 26.3 s) · 4:36.60–5:05.10 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: building block: units.

## s09_gradient_field
Since every place has its own gradient, we can draw an arrow at every place. That's called a gradient field. Here is the real temperature about one and a half kilometres up, over Brittany in western France. It's six in the evening on the first of November twenty twenty three, as Storm Ciarán approaches. These temperatures come from ERA5, a reanalysis: a careful reconstruction of the weather that blends observations with a weather model. Every arrow points the way the temperature increases fastest, towards the warm air in the south-west. At Brest, partial capital T by partial x is minus three point two degrees per hundred kilometres, and partial capital T by partial y is minus two point five. By Pythagoras, grad capital T has a length of about four point one degrees per hundred kilometres. [beat] It points about two hundred and thirty degrees from north, towards the south-west.

> 149 words · 9 sentences · 1 beats · 305.100–370.500 s (65.4 s; speech 60.6 s) · 5:05.10–6:10.50 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: intuition: a real gradient field.

## s10_directional
Now let's see why the arrow works, starting from a general rule. Suppose we walk a short distance, d s, in some direction. Let's describe that direction by a unit vector, n hat, at an angle alpha from east. Its east part is cosine alpha, and its north part is sine alpha. So the step east is d s times cosine alpha, and the step north is d s times sine alpha. The change in height is partial h by partial x times the step east, plus partial h by partial y times the step north. Now divide both sides by d s. The rate of climb along n hat is partial h by partial x times cosine alpha, plus partial h by partial y times sine alpha. That is exactly the dot product of grad h with n hat, from the dot product movie. So the rate of change in any direction is grad h dot n hat, and it's called the directional derivative. Let's check it going north. Alpha is ninety degrees, so we get thirty times zero, plus forty times one, which is forty. [beat]

> 187 words · 12 sentences · 1 beats · 370.500–445.775 s (75.3 s; speech 69.9 s) · 6:10.50–7:25.77 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: intuition: the directional derivative (derivation).

## s11_steepest
Why does the gradient point the steepest way? The dot product has a second form: the length of grad h, times the length of n hat, times the cosine of the angle between them. Let's call that angle theta. N hat has length one, so the rate of climb is the length of grad h times cosine theta. A cosine is never bigger than one, and it equals one only when theta is zero. So the climb is largest when you walk along grad h itself, and then it equals the length of grad h. That's why the gradient points the way the field increases fastest, and why its length is that fastest rate. Walk the opposite way, where theta is a hundred and eighty degrees, and the cosine is minus one: you go down at the steepest rate.

> 139 words · 8 sentences · 0 beats · 445.775–498.825 s (53.1 s; speech 49.8 s) · 7:25.77–8:18.82 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: why: the gradient points the steepest way.

## s12_perpendicular
Now walk along a path where the height stays the same, round the side of the hill. On a map, such paths are drawn as contour lines. Along a contour, the height doesn't change, so the rate of climb is zero. The length of grad h isn't zero, so cosine theta must be zero, and theta is ninety degrees. So the gradient is always at right angles to the contour lines. The same goes for isotherms, the lines of equal temperature, and isobars, the lines of equal pressure. Contour maps have a whole movie of their own in this series, and so does the way they're made.

> 107 words · 7 sentences · 0 beats · 498.825–540.375 s (41.6 s; speech 38.7 s) · 8:18.82–9:00.38 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: why: perpendicular to contours.

## s13_cases
Let's keep the hillside fixed, and send four walkers out in different directions. The first walks along grad h. The cosine of zero is one, so she climbs fifty metres per kilometre. [beat] When you walk along the gradient, you climb at the steepest rate. The second walks at sixty degrees to it. Fifty times the cosine of sixty is twenty five. [beat] At an angle, you get only the shadow of the gradient on your direction. The third walks along the contour. Fifty times the cosine of ninety is zero. [beat] Along a contour, nothing changes. The fourth walks straight against the gradient. Fifty times minus one is minus fifty. [beat] Against the gradient, you go down at the steepest rate.

> 118 words · 13 sentences · 4 beats · 540.375–597.225 s (56.9 s; speech 47.3 s) · 9:00.38–9:57.23 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: intuition: four walkers, one thing changing.

## s14_spacing
There's a quick way to read the gradient's size off a map. Suppose contour lines are drawn every hundred metres of height. On a gentle slope, they might be two kilometres apart, so the slope is a hundred metres over two kilometres: fifty metres per kilometre. [beat] On a steep slope, they might be half a kilometre apart. A hundred metres over half a kilometre is two hundred metres per kilometre. [beat] So the closer the lines, the bigger the gradient. Crowded lines mean a steep slope, a sharp change of temperature, or a strong push from the pressure.

> 97 words · 7 sentences · 2 beats · 597.225–638.750 s (41.5 s; speech 36.3 s) · 9:57.23–10:38.75 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: intuition: crowded lines mean a big gradient.

## s15_mont_blanc
Let's try a real mountain: Mont Blanc, the highest peak in the Alps, on the border of France and Italy. This is the real terrain, from a global relief data set called ETOPO, with satellite imagery laid over it. The heights are drawn stretched two times, so the shape is easier to see. The town of Chamonix sits at about one thousand and thirty five metres. The summit, at about four thousand eight hundred and six metres, is about ten kilometres to the south. So on average, the ground rises about three thousand seven hundred and seventy metres in ten kilometres. That's about thirty seven and a half metres up for every hundred metres across. [beat] Now let's draw grad h at every point. Every arrow points uphill, at right angles to the contours. The longest arrows sit on the steep walls near the summit, where the slope on this map reaches about sixty percent.

> 154 words · 10 sentences · 1 beats · 638.750–702.425 s (63.7 s; speech 58.6 s) · 10:38.75–11:42.43 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: intuition: a real mountain.

## s16_water_scale
Water feels the gradient too. Rain that falls on these slopes runs roughly the steepest way down, along minus grad h, so the streams follow the arrows backwards. And the size of the gradient depends on how finely you look. On this map, with points less than two kilometres apart, the steepest slopes are about sixty percent. Now average the heights over blocks about thirty five kilometres across, and look at the Himalayas. The ground climbs from the Ganges plain, about fifty metres above sea level, to the Tibetan plateau, almost five thousand metres up. Yet at that scale, the slope near Mount Everest is only about five percent. [beat] Both numbers are right, each for its own scale.

> 118 words · 8 sentences · 1 beats · 702.425–753.975 s (51.5 s; speech 47.1 s) · 11:42.43–12:33.98 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: intuition: steepest descent and the scale of a gradient.

## s17_lapse_rate
The gradient works in three dimensions too, and in the air, the upward part is often the biggest. Here is a real weather balloon, a radiosonde, launched from Singapore, an island city at the southern tip of the Malay Peninsula, close to the equator. It went up at half past seven in the morning, local time, on the first of November, twenty twenty-three. At the ground, thirty three metres above sea level, it measured twenty seven point seven degrees. At sixteen point two kilometres, where the cooling stopped, it measured minus eighty one point three. That level is the tropopause, the top of the lowest layer of the atmosphere. Over the tropics it sits much higher than over Europe, where it's usually somewhere between about ten and thirteen kilometres up. So partial capital T by partial z, averaged over that layer, is minus a hundred and nine degrees over sixteen point one kilometres. That's about minus six point eight degrees per kilometre. [beat] Meteorologists flip the sign, and call plus six point eight the lapse rate: how fast the temperature drops as you go up. Above the tropopause, the temperature starts rising again.

> 192 words · 11 sentences · 1 beats · 753.975–836.325 s (82.4 s; speech 76.9 s) · 12:33.98–13:56.33 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: intuition: the gradient in 3-D (radiosonde).

## s18_thin_layer
Compare that with the sideways gradient over Brest, about four degrees per hundred kilometres. Six point eight degrees per kilometre is six hundred and eighty degrees per hundred kilometres. That's more than a hundred and sixty times bigger. [beat] So surfaces of equal temperature in the air are nearly flat, and grad capital T points almost straight down, towards the warmer air below. In our pictures, we stretch the height to make tilts like these visible, but the real atmosphere is a very thin layer.

> 79 words · 5 sentences · 1 beats · 836.325–871.350 s (35.0 s; speech 31.7 s) · 13:56.33–14:31.35 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: intuition: vertical vs horizontal.

## s19_reason_one
So why is the gradient built this way? There are three good reasons. The first is that one arrow holds the answer for every direction. Instead of a long table of slopes, for east, north, north-east and so on, we keep just two numbers, or three in the air. A dot product with any direction gives the rate that way.

> 60 words · 5 sentences · 0 beats · 871.350–895.700 s (24.4 s; speech 22.2 s) · 14:31.35–14:55.70 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: why: reason 1 (one arrow for every direction).

## s20_reason_two
The second reason is that the arrow doesn't depend on how we draw the axes. Let's turn our axes by thirty degrees. The components change, to about forty six and nineteen point six. But the length is still fifty, and the arrow still points the same way up the hill. [beat] The steepest way up a mountain is a fact about the mountain, not about our map, and the gradient respects that.

> 71 words · 5 sentences · 1 beats · 895.700–924.175 s (28.5 s; speech 25.1 s) · 14:55.70–15:24.18 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: why: reason 2 (independent of the axes).

## s21_reason_three
The third reason is that nature responds to gradients. Heat flows from warm to cold, down the temperature gradient. Water runs down the height gradient. And air is pushed from high pressure towards low pressure, down the pressure gradient. In each case, it's the gradient, not the value itself, that drives the motion. A room that's equally warm everywhere has no flow of heat inside it, however warm it is.

> 70 words · 6 sentences · 0 beats · 924.175–954.925 s (30.8 s; speech 28.2 s) · 15:24.18–15:54.93 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: why: reason 3 (nature responds to gradients).

## s22_sphere
Before we use the gradient on weather maps, there's one twist: the Earth is round. Weather data come on a grid of latitude and longitude, as we saw in the coordinates movie. A step north by a small angle, d phi, covers the Earth's radius times d phi. But a step east by a small angle, d lambda, covers only the radius times cosine phi times d lambda, because the circles of latitude shrink towards the poles. So the slope going east is one over the radius times cosine phi, times partial by partial lambda. And the slope going north is one over the radius, times partial by partial phi. Together with the change going up, these make the gradient on the sphere.

> 123 words · 7 sentences · 0 beats · 954.925–1004.400 s (49.5 s; speech 46.6 s) · 15:54.93–16:44.40 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: building block: the gradient on the sphere.

## s23_cos_example
Let's see why that cosine matters, at Brest. ERA5 gives the temperature every quarter of a degree. One grid point east of Brest, it was four point five one degrees, and one point west, it was five point six nine. At Brest's latitude, a quarter of a degree of longitude is eighteen point four kilometres, so the two points are thirty six point eight kilometres apart. The slope going east is minus one point one eight degrees over thirty six point eight kilometres. That's minus three point two degrees per hundred kilometres. [beat] Forget the cosine, and you'd use twenty seven point eight kilometres per step, as if you were going north. Then you'd get minus two point one, a third too small. [beat] Near Svalbard, at seventy eight degrees north, it would be five times too small.

> 136 words · 9 sentences · 2 beats · 1004.400–1063.275 s (58.9 s; speech 53.0 s) · 16:44.40–17:43.28 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: building block: why the cosine matters (worked example).

## s24_pressure_recap
Now let's use the gradient where it matters most in the weather: pressure. Pressure is the push of the air's molecules on every surface, a force per area. At sea level it's about a thousand and thirteen hectopascals, as we saw in the weather basics movie. Lines that join places with the same sea-level pressure are called isobars. But pressure on its own doesn't move the air. Let's see what does.

> 71 words · 6 sentences · 0 beats · 1063.275–1093.425 s (30.1 s; speech 27.6 s) · 17:43.28–18:13.42 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: application: pressure recap.

## s25_box
Picture a small box of air, d x long from west to east. The air on its west side pushes it east, with the pressure there times the area of that face. The air on its east side pushes it west, with the pressure there times the same area. If the two pressures are equal, the pushes cancel, and nothing happens, however high the pressure is. Now suppose the pressure rises towards the east. By the Taylor series, from the derivatives movie, the pressure on the east face is bigger by partial p by partial x, times d x. So the net push is minus partial p by partial x, times d x, times the area of the face. And d x times that area is the volume of the box.

> 131 words · 8 sentences · 0 beats · 1093.425–1142.600 s (49.2 s; speech 45.9 s) · 18:13.42–19:02.60 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: application: the box derivation.

## s26_per_kilogram
To turn a force into an acceleration, we divide by the mass, which is the density, rho, times the volume. The volume cancels, and the push per kilogram, going east, is minus one over rho, times partial p by partial x. The same happens going north, and going up. Together, the force per kilogram is minus one over rho, times grad p. It's called the pressure gradient force. It appears in the equation that tells the air how to move, next to the Coriolis effect, gravity and friction. Only differences in pressure push, which is why its name carries the word gradient.

> 102 words · 7 sentences · 0 beats · 1142.600–1186.550 s (43.9 s; speech 41.1 s) · 19:02.60–19:46.55 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: application: force per kilogram.

## s27_high_to_low
Grad p points the way pressure increases fastest, towards high pressure. The minus sign flips it. So the pressure gradient force points from high pressure to low pressure, straight across the isobars. Let's put in easy numbers. Suppose the pressure changes by one hectopascal every hundred kilometres. One hectopascal is a hundred pascals, and a hundred kilometres is a hundred thousand metres. So the gradient is a thousandth of a pascal per metre. [beat] With an air density of about one kilogram per cubic metre, the push is about a thousandth of a metre per second squared. [beat] With the real density near the ground, one point two, it's about eight ten-thousandths. That's small, but kept up for an hour, it would add about three metres per second to the wind. [beat]

> 129 words · 10 sentences · 3 beats · 1186.550–1245.950 s (59.4 s; speech 52.5 s) · 19:46.55–20:45.95 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: application: high to low, easy numbers.

## s28_ciaran_push
Now a real storm. Here is Storm Ciarán at three in the morning on the second of November twenty twenty three, from ERA5, with isobars every four hectopascals. Its centre, at about nine hundred and fifty four hectopascals, is crossing the Channel, about two hundred kilometres north of Brest. Over Brest, the isobars are only thirty one kilometres apart. Four hectopascals in thirty one kilometres is about thirteen hectopascals per hundred kilometres, thirteen times our easy example. [beat] Grad p points south-south-west, away from the low. So the pressure gradient force points north-north-east, towards the low. Divide the gradient by the density, one point two five, and the push is about one hundredth of a metre per second squared. [beat] If nothing else acted, that would add about thirty seven metres per second to the wind in a single hour. [beat]

> 138 words · 9 sentences · 3 beats · 1245.950–1311.500 s (65.5 s; speech 59.0 s) · 20:45.95–21:51.50 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: application: Ciarán's pressure gradient force.

## s29_crowded_winds
And this is why winds are strongest where the isobars crowd together. Let's take every point of this map over the sea, sort them by the size of the pressure gradient, and average the wind ten metres above the surface. Where the gradient is below two hectopascals per hundred kilometres, the wind averages ten metres per second. Where it's above ten, the wind averages about twenty six. [beat] At Brest airport that same hour, a gust of eighty four knots was measured, about a hundred and fifty six kilometres per hour. [beat] More than a million homes in France lost power.

> 119 words · 7 sentences · 2 beats · 1311.500–1361.775 s (50.3 s; speech 45.1 s) · 21:51.50–22:41.78 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: application: crowded isobars, strong winds.

## s30_coriolis
But look at the wind arrows. They don't blow straight from high to low. They blow almost along the isobars, anticlockwise round the low, as seen from above. That's because the Earth turns, and the Coriolis effect pushes moving air to the right in the northern hemisphere. Away from the ground, the Coriolis push grows until it balances the pressure gradient force, and then the wind blows along the isobars. The bigger the pressure gradient, the faster the wind must blow for the two pushes to balance. That's the deeper reason crowded isobars mean strong winds. Near the ground, friction slows the wind, and lets it cross the isobars a little, towards the low. We built all of this in the cross product movie on our spinning Earth, and a later Coriolis movie takes it further. One warning: meteorologists also say gradient wind for a different idea, a balance round curved isobars, which has its own movie too.

> 158 words · 10 sentences · 0 beats · 1361.775–1427.425 s (65.7 s; speech 61.8 s) · 22:41.78–23:47.43 (measured, dry run v2 + plan-v5 pointer clips, shifted).
> Beat: application: why the wind blows along the isobars (pointer).

## s31_latest_chart
Here is a more recent chart: six in the evening, universal time, on the twenty seventh of October twenty twenty six, from the American GFS model. A deep low of about nine hundred and sixty one hectopascals sits just east of Iceland. Where its isobars crowd over the sea, the pressure gradient reaches about ten hectopascals per hundred kilometres, close to Ciarán's over Brest. There, the winds near the surface reach about twenty five metres per second.

> 77 words · 4 sentences · 0 beats · 1427.425–1461.150 s (33.7 s; speech 31.9 s) · 23:47.42–24:21.15 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: application: the latest chart (series rule: latest data).

## s32_vertical_pressure
Pressure has a gradient going up too, and it's enormous. The Singapore balloon found the pressure falling by about zero point one one hectopascals for every metre it rose near the ground: one hectopascal in about nine metres. [beat] Ciarán's crowded isobars needed thirty one kilometres for four hectopascals, which is about eight kilometres per hectopascal. So the upward pressure gradient was about eight hundred and fifty times stronger than Ciarán's sideways one. On an ordinary day, it's about ten thousand times stronger. [beat] So why doesn't it blast the air into space? Because gravity pulls down just as hard. This is hydrostatic balance, from the weather basics movie: partial p by partial z equals minus rho g. Near the ground in Singapore, rho is about one point one seven kilograms per cubic metre, and g is nine point eight one, so that's about eleven and a half pascals per metre, close to the balloon's ten point nine. [beat] So the upward push is almost exactly cancelled, and the weather is driven by the tiny sideways part. Because pressure falls so steadily with height, meteorologists often use pressure itself as a vertical coordinate, which has its own movie.

> 195 words · 11 sentences · 3 beats · 1461.150–1549.225 s (88.1 s; speech 80.3 s) · 24:21.15–25:49.22 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: application: the vertical pressure gradient and hydrostatic balance.

## s33_fronts
Now back to temperature. Here again is the map of temperature one and a half kilometres up, at six in the evening on the first of November. Over most of the map, the gradient is about one degree per hundred kilometres. But in one narrow band near the storm, it reaches about eleven. [beat] That band is a front, a boundary between a warm air mass and a cold one, as we saw in the weather basics movie. At a front, the temperature gradient is squeezed into a narrow zone, more than ten times stronger than around it. All its arrows point across the front, towards the warm side.

> 108 words · 7 sentences · 1 beats · 1549.225–1592.225 s (43.0 s; speech 38.9 s) · 25:49.22–26:32.22 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: application: temperature gradients at fronts.

## s33b_front_stack
A front isn't just a line on a map. Let's stack four temperature maps above a strong cold front over the central United States, on the twenty second of December twenty twenty two, from about one and a half to nine kilometres up. On every layer, the orange arrows are grad capital T, pointing towards warmer air. Where the isotherms crowd, the arrows are longest, and that's the front on that layer. Let's circle the stack from outside, from the bottom layer to the top. Every layer above the bottom one has its crowded band on the cold side of the bottom front, between about two hundred and sixty and four hundred and fifty kilometres behind it. [beat] So a front is a sloping surface that leans back over the cold air, and the gradient finds it on every layer.

> Build 1 (2026-11-04): added from data_needs.md §G (orchestrator decision 2026-10-30: keep Elliott 12 UTC, reword: every layer above the near-ground front sits on its cold side, 260-450 km back; 1000 hPa is below ground on the front and is not shown). Four layers (850, 700, 500, 300 hPa).
> Beat: application: a front in 3-D (layer stack).

## s34_advection
The gradient also tells us how the wind changes the temperature at a fixed place. Over Brest at that hour, the wind at that height blew at thirty four metres per second, from just west of south, at a hundred and thirty eight degrees to grad capital T. So along the wind, the temperature changes at grad capital T dot the wind's direction. That's four point one times the cosine of a hundred and thirty eight degrees, which is about minus three degrees per hundred kilometres. [beat] It's negative because the wind blows towards colder air. Times the wind speed, that's minus three point seven degrees per hour. [beat] This is v dot grad capital T, the advection term from the dot product movie. Because the air keeps arriving from the warmer side, a fixed thermometer at Brest would warm by about three point seven degrees per hour from this alone. The material derivative movie takes this apart fully.

> 157 words · 9 sentences · 2 beats · 1592.225–1658.250 s (66.0 s; speech 60.1 s) · 26:32.22–27:38.25 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: application: advection as wind speed times the directional derivative.

## s35_sea_breeze
Some of the sharpest temperature gradients form on sunny days, along coasts. Here is the coast of Normandy, in northern France, at one in the afternoon on the twenty fourth of June twenty twenty four. The satellite picture shows small fair-weather clouds over the land, and clear skies over the sea. Inland, the air two metres above the ground was at twenty four point six degrees. Over the Channel, about fifty five kilometres to the north, it was sixteen point one. That's about fifteen degrees per hundred kilometres, sharper than the storm's front. [beat] Land warms faster in the sun than the sea does. The warm air over the land expands and rises, so near the ground the pressure ends up a little higher over the sea than over the land. That small pressure gradient pushes cooler sea air inland. This is the sea breeze.

> 144 words · 10 sentences · 1 beats · 1658.250–1718.425 s (60.2 s; speech 55.1 s) · 27:38.25–28:38.42 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: application: a land-sea temperature gradient (sea breeze).

## s36_jet
High up, temperature gradients and the jet stream go together. Here is the average for September twenty twenty six, all the way round the Earth, as a slice from the equator to the North Pole. The temperature drops fastest towards the pole near forty five degrees north, by about six degrees per thousand kilometres, averaged from about one and a half to nine kilometres up. [beat] Right above that zone, about twelve kilometres up, the westerly wind is strongest, about twenty six metres per second on average. [beat] Single days can be much stronger. On the twenty eighth of October twenty twenty six, the GFS analysis shows the jet over the North Atlantic at sixty six metres per second. That's about two hundred and forty kilometres per hour. [beat] Why winds grow with height above a temperature gradient is called the thermal wind, and it has its own movie.

> 148 words · 8 sentences · 3 beats · 1718.425–1781.700 s (63.3 s; speech 56.6 s) · 28:38.42–29:41.70 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: application: the jet stream above the strongest temperature gradient.

## s37_gulf_stream
The ocean has temperature gradients too. Off the east coast of the United States, the Gulf Stream carries warm water from the tropics towards the north-east, right next to colder water from the north. Along its northern edge, on the twenty ninth of October twenty twenty six, the sea-surface temperature dropped by about six and a half degrees in about thirty five kilometres. That's one of the sharpest temperature gradients in the open ocean. Winter storms often deepen fastest near it, so forecasters watch it closely. The great ocean currents have their own movies later in this series.

> 87 words · 6 sentences · 0 beats · 1781.700–1819.325 s (37.6 s; speech 35.1 s) · 29:41.70–30:19.32 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: application: an ocean temperature gradient (Gulf Stream).

## s38_recap
To sum up, a scalar field has a value at every place, like height, temperature or pressure. Its gradient, grad f, is the arrow built from its partial derivatives, going east, north and up. It points the way the field increases fastest, and its length is that fastest rate. It's at right angles to contour lines, isotherms and isobars, and it's big where they crowd together. The rate in any direction is grad f dot n hat, the directional derivative. On the round Earth, the slope going east carries one over the radius times cosine phi. The pressure gradient force, minus one over rho times grad p, pushes air from high to low pressure, which is why crowded isobars mean strong winds. Sharp temperature gradients mark fronts and sea breezes, and the jet stream blows above the strongest of them.

> 140 words · 8 sentences · 0 beats · 1819.325–1878.100 s (58.8 s; speech 55.5 s) · 30:19.32–31:18.10 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: recap ('To sum up', one beat per sentence).

## s39_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for the gradient, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 57 words · 3 sentences · 0 beats · 1878.100–1900.875 s (22.8 s; speech 21.8 s) · 31:18.10–31:40.88 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
> Beat: series end card (maths ending, HOUSE_STYLE §3).
