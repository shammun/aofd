# ch00_reading_weather_maps — "Reading weather maps: from the globe to a forecaster's chart" (Chapter 0, F4, version 1)

Version 1 (2026-10-27), movie-director plan. House style `movies/HOUSE_STYLE.md` (reference `ch00_dot_product_why` v6): s00 title + one sentence → hook → building blocks → intuition → why → application → "To sum up" → weather/climate end card. Voice Kokoro `af_bella`, speed 1.0; informal Chapter-0 voice; music `data-curious` with `planet-wide` for the projection block (tools/sound, seed 4). Brief: `brief.md`; data, new functions and CHECK rows: `data_needs.md`; storyboard: `storyboard.yaml`.

**Measured, not estimated.** `tools/tts.py` dry run on 2026-10-27 (G:, `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_reading_weather_maps/dryrun/v1_merged`; input = this narration, current `movies/lexicon.yaml`, the proposed new entries Buys Ballot, Tissot, Himawari, METAR, decametres not applied): **61 scenes, 330 sentences, 5074 words, 2086.775 s narration + 2.5-s silent end-card hold = 2089.275 s (34:49.28)**; speech alone 1944.0 s = 156.6 words per minute while speaking, **145.7 words per minute overall** (limit 150); 523 caption cues; self-check diff 0.0 ms; Kokoro render 762.3 s; warnings: none.

Conventions: S<k> in the storyboard = sentence k of the scene (the `tools/tts.py` splitter); numbers are spoken in words and every number on screen is spoken (colour-bar ticks excepted, as in the reference); times are measured (start–end of the scene's audio in the dry run). Latitude is written φ and longitude λ, as in the earlier series movies (Vallis writes ϑ, λ).

## s00_title
In this video, we'll learn to read weather maps the easy way, and see how forecasters use them to follow real storms, from a satellite picture to a forecaster's chart.

> 30 words · 1 sentences · 0.300–12.325 s (12.0 s; speech 11.2 s) · 0:00.30–0:12.32 (measured) · beat: opening title.
> Screen: 'Reading' / 'weather maps' 150 px TitleGradient; 'made easy' 96 px (pulse on 'the easy way'); 'and how forecasters use them' 68 px, 'forecasters' teal. Right: Part A globe unwrapping to a map with Tissot circles; Part B on 'forecasters': a chart building itself (isobars, H/L, fronts) over infrared

## s01_hook
How do you read a weather map? Here's a real one, drawn by forecasters on the day this video was made, and at first it looks like a secret code. Let's crack it together: where every point on the map is, why the Earth looks stretched, and what each line, arrow and symbol tells us.

> 55 words · 3 sentences · 12.325–32.025 s (19.7 s; speech 18.2 s) · 0:12.32–0:32.02 (measured) · beat: hook question.
> Screen: Full-width real chart from frame 0: WPC 18 UTC 27 Oct 2026 analysis on LCC (IR underlay, isobars, H/L, fronts, barbs, a few station plots); on S3 three gold rings pulse in turn on a station plot, a front, a barb

## s02_two_angles
Let's start with the most basic question on any map: where is this place? The Earth is very nearly a ball, so we can pin down any place on it with just two angles. Picture a straight line from the centre of the Earth, out through the place.

> 48 words · 3 sentences · 32.025–48.950 s (16.9 s; speech 15.4 s) · 0:32.02–0:48.95 (measured) · beat: building blocks · where is a place.
> Screen: 3-D globe (Blue Marble) turning to Brest; on S3 a cut-away: teal line from the centre out through Brest

## s03_latitude
The first angle is the latitude. It's the angle between our line and the equator, measured at the centre of the Earth. The equator has a latitude of zero, the North Pole ninety degrees north, and the South Pole ninety degrees south. All the places with the same latitude form a circle around the Earth, called a parallel. Brest, the port in north-western France that we watched Storm Ciarán pass over, is at about forty-eight point four degrees north.

> 79 words · 5 sentences · 48.950–80.975 s (32.0 s; speech 29.8 s) · 0:48.95–1:20.97 (measured) · beat: building blocks · latitude.
> Screen: cut-away globe: gold arc at the centre from the equator to the Brest line '48.4° N'; equator '0°', poles '90° N', '90° S'; the Brest parallel drawn as a teal ring; keyword 'latitude', 'parallel'

## s04_longitude
Latitude alone isn't enough, because a whole parallel shares it. So we need a second angle, the longitude, which says how far east or west we are. The lines that run from pole to pole are called meridians. The one through Greenwich, in London, was chosen as the starting line, the prime meridian, with a longitude of zero. Longitude is the angle around the Earth's axis, from the prime meridian to the meridian through our place. It runs up to one hundred and eighty degrees east, and one hundred and eighty degrees west. Brest is at about four point five degrees west.

> 102 words · 7 sentences · 80.975–122.825 s (41.9 s; speech 39.0 s) · 1:20.97–2:02.83 (measured) · beat: building blocks · longitude.
> Screen: globe seen from above the North Pole: meridians as spokes; 'Greenwich 0°' gold; arc round the axis from Greenwich to Brest '4.5° W'; '180° E', '180° W'; keyword 'longitude', 'meridian', 'prime meridian'

## s05_signs
Data files and computer code don't write north or west; they use signs. Latitudes north of the equator are positive, and south of it they're negative. Longitudes east of Greenwich are positive, and west of it they're negative. So Brest becomes forty-eight point four, minus four point five. Some data sets count longitude all the way round instead, from zero to three hundred and sixty degrees east. There, Brest is at three hundred and fifty-five point five, which is the same meridian. The net of parallels and meridians drawn on a map is called the graticule.

> 96 words · 7 sentences · 122.825–163.900 s (41.1 s; speech 38.2 s) · 2:02.83–2:43.90 (measured) · beat: building blocks · signs and the graticule.
> Screen: globe front view: '+' teal half above the equator, '−' rose half below (hatched); '+' east / '−' west of Greenwich; 'Brest (48.4, −4.5)'; '0 … 360° E' ring: '355.5° E' = '−4.5°'; full graticule every 15°, keyword 'graticule'

## s06_north_distance
Now, how far apart are two places? Let's give our angles symbols: phi, a Greek letter, for latitude, and lambda for longitude. First, let's walk due north, along a meridian. A meridian is part of a circle centred on the middle of the Earth, with the Earth's radius, a. On any circle, an arc is as long as the radius times the angle, when the angle is in radians. One radian is the angle whose arc is exactly one radius long, and one degree is pi over one hundred and eighty radians. So a small step in latitude, delta phi, carries us a distance delta y, equal to a times delta phi. With a equal to six thousand three hundred and seventy-one kilometres, one degree of latitude is about one hundred and eleven kilometres, everywhere on Earth.

> 137 words · 8 sentences · 163.900–219.600 s (55.7 s; speech 52.5 s) · 2:43.90–3:39.60 (measured) · beat: building blocks · distance along a meridian.
> Screen: 'φ latitude', 'λ longitude'; cut-away meridian circle radius 'a'; radian wedge (arc = radius); '1° = π/180 rad'; δy = a δφ (84 px); CalcStack 6371 km × π/180 ≈ 111 km

## s07_east_distance
Now let's walk due east, along a parallel. A parallel is a circle too, but its centre lies on the Earth's axis, so it's smaller. Its radius is our place's distance from the axis, which is a times cosine phi. So a small step in longitude, delta lambda, is a distance delta x, equal to a cosine phi times delta lambda. At the equator, cosine phi is one, so a degree of longitude is again about one hundred and eleven kilometres. At Brest, it's about seventy-four kilometres. At sixty degrees north, cosine phi is one half, so it's about fifty-six. And at the poles it's zero, because all the meridians meet there.

> 112 words · 8 sentences · 219.600–268.075 s (48.5 s; speech 45.2 s) · 3:39.60–4:28.07 (measured) · beat: building blocks · distance along a parallel.
> Screen: globe with the Brest parallel; its radius 'a cos φ' from the axis; δx = a cos φ δλ beside δy = a δφ; table 0° → 111 km, 48.4° → 74 km, 60° → 56 km, 90° → 0

## s08_great_circle
So what's the shortest path between two places? On a sphere, it runs along a great circle, a circle whose centre is the centre of the Earth, like the equator or any meridian. Take New York and Tokyo, at roughly the same latitude. You might expect the shortest route to head straight west. Instead, the great circle swings far to the north, up to almost seventy degrees, near Alaska. It's about ten thousand eight hundred and fifty kilometres long.

> 79 words · 6 sentences · 268.075–301.350 s (33.3 s; speech 30.7 s) · 4:28.07–5:01.35 (measured) · beat: building blocks · shortest path.
> Screen: globe: great circle through the centre (plane disc); New York and Tokyo dots; gold great-circle arc up to '≈ 70° N'; '10 850 km'

## s09_orange_peel
Now let's flatten the globe into a map. If you've ever tried to flatten the peel of an orange, you know it splits or stretches. A sphere curves in two directions at once, so no flat sheet can cover it without stretching or tearing somewhere. That's a mathematical fact, not a lack of skill. A rule that turns each latitude and longitude into a point on a flat map is called a map projection. Every projection distorts something, so each one has to choose what to keep right.

> 88 words · 6 sentences · 301.350–335.525 s (34.2 s; speech 31.6 s) · 5:01.35–5:35.52 (measured) · beat: intuition · why every flat map distorts.
> Screen: the globe's skin peels into 12 gores that open flat with gaps; then a flat sheet tries to wrap the ball and creases; keyword 'map projection: (φ, λ) → (x, y)'

## s10_plate_carree
The simplest projection uses longitude straight as x and latitude straight as y, with every degree the same size. It's called the equirectangular projection, or plate carrée, French for flat square. Data sets like the reanalysis store their numbers on exactly this kind of grid. Distances north to south come out right everywhere. But a degree of longitude, which really shrinks with cosine phi, is drawn just as wide as at the equator. So the map is stretched east to west, by one over cosine phi: twice as wide as it should be at sixty degrees, and infinitely wide at the poles.

> 102 words · 6 sentences · 335.525–378.975 s (43.5 s; speech 40.9 s) · 5:35.52–6:18.98 (measured) · beat: intuition · the simplest projection.
> Screen: globe morphs into the plate carrée world (Blue Marble); 'x = λ', 'y = φ'; the reanalysis grid dots every 0.25° zoom; stretch readout '1/cos φ': '× 2 at 60°', '× ∞ at the poles'

## s11_tissot
To see what a projection does, let's place identical circles all over the globe, each one thousand kilometres across. Then we project the circles along with the map. Where a circle stays round, shapes are kept. Where it grows or shrinks, sizes are wrong. Where it's squashed into an oval, angles are bent. These test circles are called Tissot's indicatrix, after the French mathematician who invented them. On the plate carrée, the circles near the poles are pulled sideways into wide ovals.

> 82 words · 7 sentences · 378.975–416.075 s (37.1 s; speech 34.2 s) · 6:18.98–6:56.07 (measured) · beat: intuition · seeing distortion (Tissot's indicatrix).
> Screen: globe with gold circles every 30° (each '1000 km'); morph to plate carrée; three keyword pairs 'round → shapes kept', 'bigger → sizes wrong', 'oval → angles bent'; 'Tissot's indicatrix'

## s12_mercator
In fifteen sixty-nine, the mapmaker Gerardus Mercator had a clever idea. If the map is stretched east to west by one over cosine phi, why not stretch it north to south by exactly the same amount, at every latitude? Then a small circle gets bigger, but it stays a circle. Shapes and angles are kept at every point. A projection that keeps angles is called conformal. On Mercator's map, every test circle is round, but they grow towards the poles: twice as wide at sixty degrees, and so four times the area.

> 92 words · 6 sentences · 416.075–455.150 s (39.1 s; speech 36.5 s) · 6:56.07–7:35.15 (measured) · beat: intuition · Mercator's idea (conformal).
> Screen: plate carrée → Mercator morph (north-south stretch); one circle at 60° turns from oval to round; 'east-west × 1/cos φ', 'north-south × 1/cos φ'; keyword 'conformal = angles kept'; '× 2 wide, × 4 area at 60°'

## s13_mercator_y
Where must each parallel go on a Mercator map? Our goal is its height, y, above the equator. A small step in latitude, delta phi, is really a delta phi long. Mercator stretches it by one over cosine phi, so on the map it becomes a delta phi over cosine phi. Adding up all these little steps from the equator is an integral. Its answer is y equals a, times the natural log of the tan of pi over four plus phi over two.

> 84 words · 6 sentences · 455.150–488.725 s (33.6 s; speech 31.0 s) · 7:35.15–8:08.73 (measured) · beat: why · where each parallel goes.
> Screen: Mercator map left with a ruler on the y axis; maths: δy_map = a δφ / cos φ → y = ∫₀^φ a dφ′/cos φ′ → y = a ln tan(π/4 + φ/2) (96 px)

## s14_mercator_check
Let's check that answer by differentiating it. Call the inside angle u, which is pi over four plus phi over two. The chain rule gives one over the tan of u, times one over cos squared u, times one half. That's one over two sine u cos u, which is one over the sine of two u. Two u is pi over two plus phi, and its sine is cosine phi. So the slope is one over cosine phi: exactly the stretch we wanted. At eighty-five degrees, y is already about three point one times the Earth's radius, and at the pole it's infinite. That's why a Mercator map always stops short of the poles.

> 115 words · 8 sentences · 488.725–533.975 s (45.2 s; speech 42.0 s) · 8:08.73–8:53.98 (measured) · beat: why · check by differentiating; why no poles.
> Screen: CalcStack: u = π/4 + φ/2; d/dφ ln tan u = (1/tan u)(1/cos²u)(1/2) = 1/(2 sin u cos u) = 1/sin 2u = 1/sin(π/2 + φ) = 1/cos φ ✓; map: '85° → y ≈ 3.1 a', '90° → ∞'; map edge at 85°

## s15_greenland
The price of Mercator's idea is size. Greenland lies around seventy degrees north, where areas are blown up about ten times. Africa straddles the equator, where they hardly change. So on a Mercator map, Greenland looks almost as big as Africa. In reality, Africa is about fourteen times bigger: about thirty point four million square kilometres, against about two point two million.

> 62 words · 5 sentences · 533.975–563.325 s (29.4 s; speech 27.1 s) · 8:53.98–9:23.33 (measured) · beat: intuition · the price (area).
> Screen: Mercator world with Greenland and Africa outlined gold; '× 10 area at 70° N'; Greenland outline slides onto the globe and shrinks to its true size beside Africa; '30.4 vs 2.2 million km²', '≈ 14 ×'

## s16_rhumb
So why use Mercator at all? Because angles are true, a course with a fixed compass heading is a straight line on the map. A sailor could rule a line and simply hold that heading. Such a line is called a rhumb line. But it isn't the shortest route. From New York to Tokyo, the straight line on the Mercator map is about twelve thousand eight hundred kilometres long. The great circle is nearly two thousand kilometres shorter, and on this map it bends up towards the Arctic. Near the equator the stretch is small, so weather charts of the tropics often use Mercator.

> 104 words · 8 sentences · 563.325–603.725 s (40.4 s; speech 37.1 s) · 9:23.33–10:03.73 (measured) · beat: why · why use Mercator (rhumb line).
> Screen: Mercator Pacific map: straight teal rhumb line New York → Tokyo '12 800 km'; gold great circle bending north '10 850 km'; '≈ 1900 km shorter'; compass rose with a constant heading; tropics band highlighted

## s17_equal_earth
Sometimes we care about amounts, not shapes: how much of the world is desert, or where most of the rain falls. Then we want an equal-area projection, in which every region keeps its true area. The Equal Earth projection, published in twenty eighteen, is one of them. All the test circles cover the same area, but towards the edges they're squashed and tilted. We'll use it for the climate maps of the whole world later in this series.

> 78 words · 5 sentences · 603.725–634.225 s (30.5 s; speech 28.3 s) · 10:03.73–10:34.23 (measured) · beat: contrast · keeping areas instead (Equal Earth).
> Screen: morph Mercator → Equal Earth; Tissot ovals all the same area, tilted near the edges; Greenland and Africa outlines back to their true ratio; keyword 'equal-area'

## s18_polar
Near the poles, Mercator breaks down completely, so polar charts use another projection. Imagine looking down on the Earth from high above the North Pole. In the polar stereographic projection, the parallels become circles around the pole, and the meridians become spokes. It's conformal too, so the test circles stay round. Weather services usually make it true to scale at sixty degrees. Then the scale is about seven percent too small at the pole, and about eighty-seven percent too big at the equator.

> 83 words · 6 sentences · 634.225–671.400 s (37.2 s; speech 34.6 s) · 10:34.23–11:11.40 (measured) · beat: contrast · polar charts (polar stereographic).
> Screen: camera above the North Pole; morph to polar stereographic (northern hemisphere disc); round Tissot circles growing outward; ring '60° true scale' gold; '−7 % at the pole', '+87 % at the equator'

## s19_lambert
In the middle latitudes, most weather charts use the Lambert conformal conic projection. Picture a cone set over the globe like a lampshade, cutting into it along two parallels. Along those two standard parallels, the scale is exactly right. For a map of Europe, we might choose forty and sixty degrees north. Then everywhere from thirty-five to sixty-five degrees, the scale is never more than about two percent off. And because it's conformal, the angles between winds, isobars and coastlines are drawn correctly.

> 83 words · 6 sentences · 671.400–708.725 s (37.3 s; speech 34.8 s) · 11:11.40–11:48.73 (measured) · beat: contrast · mid-latitude charts (Lambert conformal conic).
> Screen: 3-D: translucent cone over the globe cutting at 40° N and 60° N (gold rings); the cone unrolls into a fan-shaped Europe map; band 35°-65° 'scale within ≈ 2 %'; keyword 'standard parallels'

## s20_which
So here's the rule that forecasters follow. Weather charts need true angles, so they use conformal projections: Mercator in the tropics, Lambert in the middle latitudes, and polar stereographic near the poles. Maps that compare amounts use an equal-area projection. And since the scale changes across any map, a scale bar, like this one for a thousand kilometres, is only right near the latitude it's drawn for, here fifty degrees north.

> 71 words · 4 sentences · 708.725–740.475 s (31.8 s; speech 29.9 s) · 11:48.73–12:20.48 (measured) · beat: why · the forecasters' rule.
> Screen: three mini maps side by side (Mercator tropics band, Lambert Europe, polar cap) under 'conformal: angles true'; a fourth Equal Earth 'equal-area: amounts'; scale bar '1000 km (at 50° N)'

## s21_isobars
Now let's read the lines on a weather map. Here's Storm Ciarán again, at midday on the second of November, twenty twenty-three, on a Lambert map. The lines are isobars, joining places with the same sea-level pressure. They're drawn every four hectopascals, and each one is labelled with its full value. A low is marked with an L, and a high with an H, with the central pressure written just below the letter. So your eye goes first to the letters, and then to how tightly the lines are packed.

> 90 words · 6 sentences · 740.475–775.900 s (35.4 s; speech 32.9 s) · 12:20.48–12:55.90 (measured) · beat: building blocks · reading isobars.
> Screen: cartostyle Ciarán chart 12 UTC 2 Nov 2023 (LCC 40/60): isobars every 4 hPa with in-line full labels ('972', '996' …); L '956' over the North Sea, H '1030' south-west; Brest dot

## s22_spacing
How strong is the wind? We can tell from the spacing. Let's measure it in two places. Over the English Channel, the pressure changes by about seven and a half hectopascals every hundred kilometres: nearly two isobars. There, the wind near the ground is about twenty-two metres per second. Near the Azores high, the pressure changes by less than half a hectopascal per hundred kilometres, and the wind is only about three or four metres per second. So the closer the isobars, the stronger the wind. Why that's so is the subject of the video on the geostrophic wind.

> 99 words · 8 sentences · 775.900–818.725 s (42.8 s; speech 39.6 s) · 12:55.90–13:38.73 (measured) · beat: building blocks · spacing means wind.
> Screen: two gold 100-km rulers across the isobars: Channel '7.5 hPa per 100 km' · '22 m/s'; near the Azores '< 0.5 hPa per 100 km' · '3–4 m/s'; keyword 'closer isobars → stronger wind'

## s23_troughs_ridges
Isobars also make two shapes worth naming. Where they bulge outwards from a low in a long, narrow tongue, the pressure along a line is lower than on either side. That line is called a trough, and charts draw it as a dashed line. Where they bulge outwards from a high, the higher pressure reaches out along a line called a ridge. Troughs often bring cloud and showers, while ridges usually bring a quieter spell.

> 75 words · 5 sentences · 818.725–847.775 s (29.0 s; speech 26.9 s) · 13:38.73–14:07.77 (measured) · beat: building blocks · troughs and ridges at the ground.
> Screen: latest North-Atlantic chart crop: a WPC trough (orange dashed) inside a tongue of isobars; a ridge axis (slate dash-dot) from the high over Quebec; keywords 'trough', 'ridge'

## s24_upper_air
Weather near the ground is steered by the air higher up, so forecasters also draw maps of the air aloft. But they do it in a surprising way. Instead of showing the pressure at one height, they show the height of one pressure. The most famous is the five hundred hectopascal map. Remember that about half of all the air lies below five and a half kilometres. So the five hundred hectopascal surface floats at about that height, with half the air below it and half above.

> 87 words · 6 sentences · 847.775–881.750 s (34.0 s; speech 31.4 s) · 14:07.77–14:41.75 (measured) · beat: building blocks · maps of the air aloft.
> Screen: 3-D column over the map: a horizontal plate at 5.5 km 'height fixed' vs a bumpy sheet '500 hPa'; '½ of the air below'

## s25_500_3d
Here's that surface over Storm Ciarán, at the same moment, lifted out of the map. We've drawn its hills and valleys five hundred times taller than they really are, so we can see them. Over the storm, the surface dips to about five thousand one hundred metres. Far to the south-west, over the warm subtropics, it rises to nearly six thousand. Forecasters call this height the geopotential height; for us, it's the height above sea level, to within a fraction of a percent. Lines of equal height are drawn every sixty metres and labelled in decametres, tens of metres. So the label five hundred and sixteen means five thousand one hundred and sixty metres.

> 114 words · 7 sentences · 881.750–929.250 s (47.5 s; speech 44.6 s) · 14:41.75–15:29.25 (measured) · beat: intuition · the 500 hPa surface over Ciarán.
> Screen: 3-D heightfield of z500 (×500) over the tilted map, coloured by height; '≈ 5100 m' at the dip, '≈ 6000 m' south-west; contours every 60 m on the sheet project down onto the map; label '516' → '5160 m'

## s26_why_dips
Why does the surface dip over the storm? Remember the scale height, R T over g: in colder air it's smaller, so the pressure falls faster as we go up. Let's compare two columns, both with a thousand hectopascals at the ground. Let's pretend the temperature is the same all the way up. Then the pressure halves to five hundred at a height of the scale height times the natural log of two. If the column averages two hundred and fifty kelvin, that's about five thousand and seventy metres. If it averages two hundred and seventy kelvin, it's about five thousand four hundred and eighty. So under a cold column, the five hundred hectopascal surface sits about four hundred metres lower. And a low at the ground, like Ciarán, starts lower still.

> 132 words · 9 sentences · 929.250–982.950 s (53.7 s; speech 50.1 s) · 15:29.25–16:22.95 (measured) · beat: why · cold columns are shorter.
> Screen: two 3-D columns (slate cold, orange warm) from 1000 hPa; z₅₀₀ = (R T̄/g) ln(1000/500); CalcStack 287 × 250 / 9.81 × ln 2 ≈ 5070 m; 287 × 270 / 9.81 × ln 2 ≈ 5480 m; bracket '≈ 400 m'

## s27_upper_shapes
On the five hundred hectopascal map, the lines make long waves around the planet. A dip towards the equator is a trough, and a bulge towards the pole is a ridge. Ciarán sits under a deep trough that reaches down towards Spain. And the winds up here blow almost exactly along the height lines, fastest where the lines are packed. West of Portugal, the wind at this height is about sixty-nine metres per second. These waves and their winds get their own videos later in the series.

> 87 words · 6 sentences · 982.950–1018.050 s (35.1 s; speech 32.5 s) · 16:22.95–16:58.05 (measured) · beat: intuition · troughs, ridges and winds aloft.
> Screen: 500-hPa chart (contours every 60 m) with the trough axis (orange dashed) from the North Sea to Spain and a ridge axis to the west; ERA5 500-hPa streaklines along the contours; '69 m/s' west of Portugal; inset hemispheric polar-stereographic 500-hPa map showing the waves

## s28_three_ways
Now let's look at how maps show the wind. One way is arrows, pointing where the wind goes, with their length showing its speed. Another is streamlines, which follow the flow like threads. Forecasters mostly use a third way, the wind barb, because it packs an exact speed and direction into one small symbol.

> 54 words · 4 sentences · 1018.050–1040.775 s (22.7 s; speech 20.9 s) · 16:58.05–17:20.78 (measured) · beat: building blocks · drawing the wind.
> Screen: same patch of Ciarán's 10-m wind three ways side by side: arrows (teal), streamlines (teal threads), barbs (warm white); keywords 'arrows', 'streamlines', 'barbs'

## s29_barb_rules
A barb has a staff, a short line from the station. The staff points towards where the wind comes from, just as winds are named by where they come from. Feathers on the far end give the speed, in knots. A short feather means five knots, a long feather ten, and a filled triangle, called a pennant, fifty. The speed is rounded to the nearest five knots, and a calm wind is drawn as a circle around the station.

> 79 words · 5 sentences · 1040.775–1070.575 s (29.8 s; speech 27.6 s) · 17:20.78–17:50.58 (measured) · beat: building blocks · how a barb works.
> Screen: one big barb (station circle, staff to the west): labels 'staff → from', 'short = 5 kt', 'long = 10 kt', 'pennant = 50 kt', 'calm' (circle)

## s30_barb_examples
Let's read some. A staff pointing south-west, with one long and one short feather, is a south-westerly of fifteen knots. Now the strongest wind on our five hundred hectopascal map: sixty-nine metres per second. To turn it into knots, we divide by point five one four metres per second per knot, and get about one hundred and thirty-four, which rounds to one hundred and thirty-five. So we draw two pennants, three long feathers and one short one.

> 77 words · 5 sentences · 1070.575–1103.575 s (33.0 s; speech 30.8 s) · 17:50.58–18:23.58 (measured) · beat: building blocks · reading barbs.
> Screen: barb A: SW staff, 1 long + 1 short '15 kt'; CalcStack 68.7 ÷ 0.514 ≈ 134 kt → 135 kt = 50 + 50 + 10 + 10 + 10 + 5; barb B drawn feather by feather

## s31_barb_map
Here are barbs for the winds near the ground around Ciarán, from the reanalysis. Each barb stands for the wind at one grid point. The most feathers crowd together south of the low, over the Channel and the Bay of Biscay, exactly where the isobars are packed. Around the high, the barbs are short and few.

> 56 words · 4 sentences · 1103.575–1125.750 s (22.2 s; speech 20.3 s) · 18:23.58–18:45.75 (measured) · beat: intuition · barbs on the real map.
> Screen: Ciarán chart (s21) with regridded 10-m barbs (15 × 8 across the frame, muted warm white); gold ring where feathers crowd south of the low; ring at the Azores high

## s32_metar
Where do the numbers on a weather map start? At weather stations, which report every hour in short coded messages. Here's a real one, from Brest airport, at midnight universal time as Ciarán arrived. It's called a METAR, the code used at airports. LFRB is the airport's name in code. Zero two, zero zero zero zero Z means the second of the month at midnight, and Z stands for universal time. AUTO means the report was made automatically. Two two zero, four two, G six one, K T, says the wind blew from two hundred and twenty degrees, at forty-two knots, gusting to sixty-one knots.

> 105 words · 8 sentences · 1125.750–1173.175 s (47.4 s; speech 44.2 s) · 18:45.75–19:33.17 (measured) · beat: building blocks · a station's coded report (METAR).
> Screen: the real report in monospace 54 px: 'LFRB 020000Z AUTO 22042G61KT 2400 RA BR BKN014 OVC022 11/10 Q0963'; groups underlined gold as decoded: 'Brest airport', '2nd, 00:00 UTC', 'automatic', 'from 220°, 42 kt, gusts 61 kt' (the later groups are decoded in s33)

## s33_metar_rest
Then comes the visibility, two thousand four hundred metres, and R A and B R, short for rain and mist. B K N, zero one four, means broken cloud, covering more than half the sky, at one thousand four hundred feet. O V C, zero two two, means overcast, a fully covered sky, at two thousand two hundred feet. Eleven slash ten is the temperature and the dew point, in degrees Celsius. And Q zero nine six three is the pressure, nine hundred and sixty-three hectopascals, reduced to sea level the way pilots use it. In one short line, the station has told us the wind, the weather, the clouds, the temperature, the humidity and the pressure.

> 117 words · 6 sentences · 1173.175–1221.475 s (48.3 s; speech 45.8 s) · 19:33.17–20:21.47 (measured) · beat: building blocks · the rest of the report.
> Screen: rest of the METAR decoded: '2400 m', 'rain · mist', 'broken 1400 ft', 'overcast 2200 ft', 'T 11 °C · Td 10 °C', '963 hPa'; six small icons in a row

## s34_station_model
Weather maps turn messages like this into a small picture called a station model. Let's build one for Brest, three hours later, at three in the morning. The circle is the station. How much of it is filled shows how much of the sky is covered by cloud, in eighths, called oktas; here it's eight oktas, fully overcast. The barb shows the wind: thirty- nine knots from the west, rounded to forty, so four long feathers. The temperature, nine point two degrees, goes at the upper left, and the dew point, seven point five, at the lower left. The three dots on the left mean moderate rain that keeps on falling.

> 111 words · 7 sentences · 1221.475–1265.975 s (44.5 s; speech 41.6 s) · 20:21.47–21:05.97 (measured) · beat: building blocks · the station model.
> Screen: big station model built piece by piece (SVG, 3× size): filled circle '8 oktas', barb from 270° with 4 long feathers '39 kt → 40', '9.2' upper-left (orange), '7.5' lower-left (teal), rain symbol (3 dots) left; the decoded groups of the real synop above in mono 44 px

## s35_pressure_code
At the upper right is the pressure, written in a squeezed way: six nine six. To save space, the station model drops the leading nine or ten and the decimal point. To decode it, put a nine or a ten in front, whichever gives a value nearer one thousand, and put the point before the last digit. So six nine six is nine hundred and sixty-nine point six hectopascals. At the lower right is how much the pressure changed in the last three hours: plus fifty-five, in tenths, so it rose five point five hectopascals. The little symbol beside it shows the pressure had been steady or falling, and then rose.

> 111 words · 6 sentences · 1265.975–1310.475 s (44.5 s; speech 42.0 s) · 21:05.97–21:50.47 (measured) · beat: building blocks · decoding the pressure.
> Screen: '696' upper right; decode: '9|69.6' vs '10|69.6' → 969.6 hPa (nearer 1000) ✓; '+55' lower right → '+5.5 hPa in 3 h'; tendency glyph '_/'

## s36_two_plots
Now let's keep the station the same and change only the time. Here's Brest nine hours earlier, at six in the evening on the first of November, before the storm's fronts arrived. The wind came from the south-east, at eighteen knots, drawn as two long feathers. The pressure, nine hundred and eighty-three point three hectopascals, had fallen ten point three hectopascals in three hours, and the four dots mean heavy rain. Side by side, the two plots tell the story of the storm passing: falling pressure and a south-easterly ahead of it, then rising pressure and a westerly behind it.

> 100 words · 5 sentences · 1310.475–1351.675 s (41.2 s; speech 39.0 s) · 21:50.47–22:31.67 (measured) · beat: contrast · same station, nine hours apart.
> Screen: two station models side by side: '18 UTC 1 Nov' (wind 150° 18 kt → 20, '103', '833', 10.3/9.8, heavy rain 4 dots, falling glyph) and '03 UTC 2 Nov' (s34 model); keywords 'ahead: falling · south-easterly', 'behind: rising · westerly'

## s37_station_map
A forecaster sees hundreds of these at once. Here are the real station reports around the English Channel at three in the morning on the second of November. Before computers, forecasters drew the isobars by hand, from exactly these numbers. Between a station at nine hundred and sixty-six and one at nine hundred and seventy-four, the nine hundred and seventy isobar must pass about halfway. Join up all such points, and the isobars appear. Laid over the reanalysis isobars, the hand-drawn lines agree to within about a hectopascal.

> 88 words · 6 sentences · 1351.675–1391.575 s (39.9 s; speech 37.4 s) · 22:31.67–23:11.58 (measured) · beat: intuition · drawing isobars from stations.
> Screen: LCC map 45-55 N, 10 W-5 E: ~20 real station models (thinned for legibility); a gold segment between two stations '966' and '974' with a midpoint dot '970'; isobars drawing through the midpoints; ERA5 isobars fade in (slate) on top; '≈ 1 hPa'

## s38_front_clues
Station plots also show where the fronts are. Crossing a front, the temperature, the dew point and the wind direction jump between neighbouring stations, and the pressure tendency flips from falling to rising. Let's look along this line of stations, from west to east. Behind the cold front, the winds are westerly, and the air is cooler and drier. Ahead of it, they're south-westerly, and the air is warmer and moister. The front lies between them.

> 76 words · 6 sentences · 1391.575–1424.675 s (33.1 s; speech 30.6 s) · 23:11.58–23:44.67 (measured) · beat: intuition · finding a front in station plots.
> Screen: same station map; a gold transect of 5 stations west → east; their T, Td and barbs brighten; a mini profile chart below (T orange, Td teal) with a step; a blue cold-front line drawn between the two stations where it jumps

## s39_front_symbols
On the finished chart, fronts are drawn with symbols on the side they're moving towards. A cold front is blue, with triangles. A warm front is red, with half circles. Weather charts use two more kinds.

> 36 words · 4 sentences · 1424.675–1440.500 s (15.8 s; speech 14.0 s) · 23:44.67–24:00.50 (measured) · beat: building blocks · front symbols (recap).
> Screen: four front lines stacked as a legend built by the voice (no box): cold (blue triangles), warm (red half circles); then two greyed placeholders for the next two

## s40_occluded
The first is the occluded front. Cold fronts usually move faster than warm fronts. When a cold front catches up with the warm front ahead of it, the warm air between them is lifted off the ground, and the two fronts join. That joined front is called an occluded front. In this side view, the heights are drawn about fifty times taller than in nature. An occluded front is drawn in purple, with triangles and half circles on the same side. Occluded fronts curl around the centre of mature lows, like the one off Labrador on the latest chart.

> 99 words · 7 sentences · 1440.500–1480.250 s (39.8 s; speech 36.9 s) · 24:00.50–24:40.25 (measured) · beat: building blocks · occluded fronts.
> Screen: 3-D side view (×50): cold wedge catching the warm front, the warm wedge lifted off the ground; map strip above with the two fronts merging into a purple occluded front; real WPC occluded front off Labrador

## s41_stationary_trough
The second is the stationary front, where neither air mass is pushing the other back. It's drawn with red half circles and blue triangles, alternating, on opposite sides of the line. And a trough at the ground, with no clear change of air mass across it, is drawn as a dashed line with no symbols at all.

> 57 words · 3 sentences · 1480.250–1502.500 s (22.2 s; speech 20.8 s) · 24:40.25–25:02.50 (measured) · beat: building blocks · stationary fronts and troughs.
> Screen: stationary front glyph (alternating red half circles / blue triangles on opposite sides); trough as orange dashed line; both then ringed on the real chart over the US

## s42_analysis_build
Put it all together, and you have a surface analysis, the forecaster's map of the weather at one moment. Here's Ciarán's, built up layer by layer at three in the morning: the station plots, the isobars, the low and its central pressure, and the fronts. The fronts here come from a computer method that finds the sharpest temperature changes, about one and a half kilometres up, not from a forecaster's pen. Every mark on it is something we can now read.

> 81 words · 4 sentences · 1502.500–1534.150 s (31.7 s; speech 29.8 s) · 25:02.50–25:34.15 (measured) · beat: application (part 1) · a surface analysis, layer by layer.
> Screen: Ciarán 03 UTC 2 Nov 2023 analysis builds in four layers on an LCC map: station models → isobars (4 hPa) → L '954' → objective fronts with symbols; keyword 'surface analysis'

## s43_visible
Fronts and lows also show up from space, and satellites see them in different kinds of light. A visible image is like a photograph. It shows sunlight bounced back by the clouds and the ground. Thick clouds, snow and ice are bright, and the sea is dark. Here's Ciarán on the second of November, twenty twenty-three, from a satellite passing overhead early in the afternoon. Visible images need sunlight, so at night they're black.

> 74 words · 6 sentences · 1534.150–1565.950 s (31.8 s; speech 29.2 s) · 25:34.15–26:05.95 (measured) · beat: building blocks · visible images.
> Screen: MODIS Aqua true colour of Ciarán, 2 Nov 2023 (LCC, white coast lines, dark halo); keywords 'visible = reflected sunlight', 'bright: thick cloud, snow, ice', 'dark: sea'; a day/night terminator sweeping over a small globe inset

## s44_infrared
An infrared image shows something else. Everything gives off infrared light, and the warmer it is, the more it gives off. So the satellite can measure how warm the top of whatever it sees is, by day and by night. By custom, cold is drawn white and warm is drawn dark, so high, cold cloud tops stand out. Here's the same pass in infrared. The thick cloud bands of Ciarán's fronts are the brightest, coldest parts.

> 76 words · 6 sentences · 1565.950–1597.400 s (31.5 s; speech 28.9 s) · 26:05.95–26:37.40 (measured) · beat: building blocks · infrared images.
> Screen: wipe from visible to infrared (same pass, MODIS Aqua band 31, 11 µm) in grey, cold = white; grey colour bar '−60 … +15 °C' (52 px); keywords 'infrared = emitted heat', 'cold → white', 'day and night'

## s45_cloud_top
How high are those cloud tops? Our goal is a height, from a temperature. The coldest tops here are about minus fifty degrees, and the sea below is about twelve. In the troposphere, the temperature falls by about six and a half degrees for every kilometre. Sixty-two degrees, divided by six and a half degrees per kilometre, is about nine and a half kilometres. So these cloud tops are about nine and a half kilometres up, near the top of the troposphere.

> 82 words · 6 sentences · 1597.400–1630.600 s (33.2 s; speech 30.6 s) · 26:37.40–27:10.60 (measured) · beat: why · how high are the cloud tops.
> Screen: IR image with two probes: cloud top '−50 °C' (gold), sea '+12 °C'; CalcStack (12 − (−50)) ÷ 6.5 °C/km ≈ 9.5 km; side bar: height scale with the tropopause line

## s46_water_vapour
A third kind of image uses infrared light that water vapour itself absorbs and gives off. It's called a water vapour image. It sees the moisture in the middle and upper troposphere, even where there's no cloud at all. Moist air aloft is drawn bright, and dry air, which has usually sunk from high up, is drawn dark. Here's a storm over the North Atlantic on the day this video was made, seen from a satellite that circles the Earth once a day above the equator, so it stays over the same spot. The dark band curling into the storm is a tongue of dry air.

> 106 words · 6 sentences · 1630.600–1670.975 s (40.4 s; speech 37.8 s) · 27:10.60–27:50.97 (measured) · beat: building blocks · water-vapour images.
> Screen: GOES-East water-vapour image (6.2 µm, band 8), 18 UTC 27 Oct 2026, North Atlantic, grey (moist bright, dry dark); keywords 'water vapour', 'moist → bright', 'dry → dark'; a small orbit sketch 'geostationary: one turn a day above the equator'

## s47_three_views
Let's compare the three views of the same moment. The visible image shows how thick and bright the clouds are. The infrared shows how high and cold their tops are. And the water vapour image shows where the air aloft is moist or dry. Forecasters flick between all three, and only the infrared and the water vapour images keep working through the night.

> 63 words · 5 sentences · 1670.975–1696.650 s (25.7 s; speech 23.5 s) · 27:50.97–28:16.65 (measured) · beat: intuition · three views of one moment.
> Screen: GOES-East 18 UTC 27 Oct 2026: visible (band 2) | infrared (band 13) | water vapour (band 8) as a three-way swipe; keywords 'thick', 'high · cold', 'moist · dry'; then a 12-h IR loop as day turns to night

## s48_bb_rule
Now let's look again at the winds on all these maps. Near the ground and higher up, the wind blows nearly along the isobars, around the lows and the highs. In eighteen fifty-seven, the Dutch meteorologist Buys Ballot turned this into a simple rule. In the northern hemisphere, stand with your back to the wind, and the low pressure is on your left.

> 63 words · 4 sentences · 1696.650–1721.975 s (25.3 s; speech 23.5 s) · 28:16.65–28:41.97 (measured) · beat: building blocks · Buys Ballot's rule.
> Screen: Ciarán chart with streaklines along the isobars; a small person icon with its back to a teal wind arrow, 'L' on its left; '1857'; keyword 'back to the wind → low on the left (north)'

## s49_bb_brest
Let's test it at Brest, at three in the morning during Ciarán. The wind came from the west, at two hundred and seventy degrees, so with your back to it, you face east. The centre of the low was about one hundred and eighty kilometres away, to the north-north-east. That's on your left, as the rule says, and a little in front of you: about seventy-five degrees to the left of straight ahead, rather than ninety. Near the ground, friction slows the wind and turns it partly towards the low, so the low ends up a little in front of your left shoulder.

> 103 words · 5 sentences · 1721.975–1759.600 s (37.6 s; speech 35.4 s) · 28:41.97–29:19.60 (measured) · beat: application · testing the rule at Brest.
> Screen: zoom on Brittany 03 UTC: Brest station model; person icon facing east; gold arrow to 'L 954' at 50.0° N 3.75° W '180 km'; angle arc '≈ 75°' vs dashed '90°'; keyword 'friction turns the wind towards the low'

## s50_bb_aloft
Higher up, there's almost no friction. At five hundred hectopascals over Ciarán, the winds run almost exactly along the height lines, with the low heights on their left. So with your back to the wind up there, the low is almost straight to your left.

> 45 words · 3 sentences · 1759.600–1777.500 s (17.9 s; speech 16.4 s) · 29:19.60–29:37.50 (measured) · beat: contrast · the rule aloft.
> Screen: the s27 500-hPa chart with streaklines; the person icon at 500 hPa south of the trough, the low heights at a right angle to its left '≈ 90°'

## s51_bb_south
South of the equator, everything turns the other way. Here's a full view of the Earth in infrared, from a satellite above the western Pacific, on the day this video was made. North of the equator, a typhoon spins anticlockwise, as seen from above. Far to the south, a deep low south of Tasmania spins clockwise, as seen from above. Their central pressures were about nine hundred and thirty-five and nine hundred and forty-five hectopascals. So in the southern hemisphere, with your back to the wind, the low pressure is on your right.

> 93 words · 6 sentences · 1777.500–1816.900 s (39.4 s; speech 36.9 s) · 29:37.50–30:16.90 (measured) · beat: contrast · the southern hemisphere.
> Screen: Himawari full-disk IR 00 UTC 27 Oct 2026 on a three.js globe; GFS isobars around the typhoon (14.5° N 162.5° E) and the southern low (60.3° S 148° E); gold arcs 'anticlockwise' / 'clockwise' (seen from above); 'L 935', 'L 945'; person icon south: low on the right

## s52_bb_equator
Near the equator the rule fails. There, the winds blow across the isobars, straight into the belt of low pressure where the trade winds meet. Why the wind circles lows at all, why the rule flips between the hemispheres, and why it fails at the equator, is the story of the Coriolis effect and the geostrophic wind, in later videos of this series.

> 63 words · 3 sentences · 1816.900–1841.875 s (25.0 s; speech 23.5 s) · 30:16.90–30:41.88 (measured) · beat: why (pointer) · where the rule fails.
> Screen: globe turns to the tropical Pacific: GFS isobars nearly flat; teal 10-m wind arrows crossing them into the low-pressure belt; keywords 'trade winds', 'across the isobars'; two forward pointers 'Coriolis', 'geostrophic wind'

## s53_chart_intro
Now let's read a real forecaster's chart, step by step. This is the surface analysis drawn by the forecasters of the United States Weather Prediction Center, for eighteen hundred universal time on the twenty-seventh of October, twenty twenty-six. Their lows, highs and fronts are drawn on a Lambert map, over the infrared image from the same hour, with isobars from the weather service's computer analysis.

> 65 words · 3 sentences · 1841.875–1870.775 s (28.9 s; speech 27.4 s) · 30:41.88–31:10.78 (measured) · beat: application · a real forecaster's chart.
> Screen: the s01 chart again (now readable): WPC H/L and fronts, GFS isobars, GOES-East IR; keyword '27 Oct 2026 · 18 UTC'; one-line credit nowhere on screen (manifest only)

## s54_chart_letters
Step one: find the letters. Over the middle of the North Atlantic is a low of nine hundred and eighty-two hectopascals. Over western Quebec is a high of one thousand and thirty-three. Further north are deeper lows, the deepest at nine hundred and sixty-one hectopascals, near Iceland.

> 47 words · 4 sentences · 1870.775–1893.575 s (22.8 s; speech 20.9 s) · 31:10.78–31:33.58 (measured) · beat: application · step one, the letters.
> Screen: gold rings on 'L 982' (43° N 43° W), 'H 1033' (48° N 79° W), 'L 961' (66° N 11° W); keywords 'step 1: letters'

## s55_chart_spacing
Step two: look at the spacing. The isobars are packed tightest on the cold side of the Atlantic low, so that's where the strongest winds are, and the barbs agree. And with your back to the wind, the low is on your left, just as Buys Ballot said.

> 48 words · 3 sentences · 1893.575–1911.600 s (18.0 s; speech 16.5 s) · 31:33.58–31:51.60 (measured) · beat: application · step two, spacing and wind.
> Screen: gold bracket on the tightest isobars (from the GFS gradient); barbs brighten there; person icon with the low on its left

## s56_chart_fronts
Step three: read the fronts. From the Atlantic low, a warm front runs east, and a cold front trails a long way to the south-west. Where they meet, near the centre, a short occluded front curls round the low. In the infrared, a long band of cold, high cloud lies along the cold front. Another cold front stretches all the way to the east coast of the United States, and the stations near it show the wind turning as it passes.

> 81 words · 5 sentences · 1911.600–1943.575 s (32.0 s; speech 29.8 s) · 31:51.60–32:23.58 (measured) · beat: application · step three, fronts and clouds.
> Screen: the WPC warm (red), cold (blue) and occluded (purple) fronts of the 982 low glow in turn; the IR cloud band along the cold front ringed; zoom to the US east coast: 5 METAR station models either side of the second cold front, barbs turning from south-west to north-west

## s57_chart_context
Step four: put it in context. The deepest low on this chart, at nine hundred and sixty-one hectopascals, isn't quite as deep as Ciarán, which reached about nine hundred and fifty-four. During Ciarán, the weather station at Brest measured a gust of eighty-four knots, about one hundred and fifty-six kilometres per hour, and about one point two million homes in France lost power.

> 63 words · 3 sentences · 1943.575–1971.200 s (27.6 s; speech 26.1 s) · 32:23.58–32:51.20 (measured) · beat: application · step four, context (latest vs Ciarán, impacts).
> Screen: two letters side by side: 'L 961' (27 Oct 2026) and 'L 954' (Ciarán, 2 Nov 2023); Brest station model with a gust glyph '84 kt ≈ 156 km/h'; '≈ 1.2 million homes without power'

## s58_history
Charts like these are younger than you might think. The first ones could only be drawn once the telegraph let reports from many places arrive within hours, in the eighteen fifties. Today they're drawn from millions of observations and computer analyses, every few hours, but they're still read with exactly the marks we've learned.

> 54 words · 3 sentences · 1971.200–1994.125 s (22.9 s; speech 21.4 s) · 32:51.20–33:14.12 (measured) · beat: application · how old weather maps are.
> Screen: a hand-drawn-style isobar sketch over a few station dots fading into today's chart; '1850s' → '2026'

## s59_recap
To sum up, latitude and longitude are two angles that pin down any place on the Earth. A degree of latitude is about one hundred and eleven kilometres, while a degree of longitude shrinks with cosine phi. No flat map can keep everything, so weather charts use conformal projections, which keep angles: Mercator in the tropics, Lambert in the middle latitudes, and polar stereographic near the poles. Isobars show the pressure, and the closer they are, the stronger the wind. Upper-air maps show the height of the five hundred hectopascal surface, which dips where the air below is cold. Barbs show the wind in knots, and station models pack a whole weather report into a tiny picture. Fronts are drawn with symbols on the side they move towards, and visible, infrared and water vapour images show the clouds, their heights, and the moisture aloft. And with your back to the wind, the low is on your left in the northern hemisphere, and on your right in the southern.

> 168 words · 8 sentences · 1994.125–2061.125 s (67.0 s; speech 63.8 s) · 33:14.12–34:21.12 (measured) · beat: recap.
> Screen: one beat per sentence, mini pictures: globe with φ, λ · '111 km' and '111 cos φ' · three conformal mini maps · packed isobars + wind · 500-hPa sheet · barb + station model · front symbols + the three satellite thumbnails · person icon with L left (N) / right (S)

## s60_end
This video is one of a series of related tutorials, so watch out for the others. They're made to help students of meteorology, atmospheric science and climate science, and anyone else who wants to learn not just these ideas, but the maths behind them too. The notebook for reading weather maps, and the notebooks for the other concepts, are on the website that goes with this video.

> 67 words · 3 sentences · 2061.125–2086.775 s (25.7 s; speech 24.6 s) · 34:21.12–34:46.78 (measured) · beat: end card.
> Screen: house end card (weather/climate version): four faint thumbnails (Tissot globe, Mercator, station model, the chart); 'a series of tutorials' (68 px); 'meteorology · atmospheric science · climate' (54 px); 'the ideas, and the maths behind them' (54 px, gold); notebook icon 'reading-weather-maps notebook'; stacked icons 'notebooks for the other concepts'; 2.5-s silent hold

> Total: 5074 words · 330 sentences · 2086.775 s narration · 2089.275 s movie (34:49.28) · 145.7 words per minute.
