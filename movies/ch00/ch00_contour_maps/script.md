# ch00_contour_maps — narration (movie-director, 2026-10-30)

Series plan v3 **M01 "Contour maps and isolines"**, re-scoped on 2026-10-30 (coordinator, series re-plan v4): **contours and
isolines as a concept** (height on contour maps, isobars, isotherms, terrain), **no forecasting claims**; its place in the
order is set by v4. House style `movies/HOUSE_STYLE.md` (binding). Voice Kokoro `af_bella`, speed 1.0; informal Chapter-0
voice; our own words; maths in words; `[beat]` = 1.5-s hold after a worked calculation (not spoken, not captioned).

**Measured, not estimated.** `tools/tts.py` dry runs on 2026-10-30 (`af_bella` x1.0, current `movies/lexicon.yaml`, not edited) into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_contour_maps/dryrun/v1` (26 scenes) and `…/v1_add` (s08b, s20b): **28 scenes, 199 sentences, 3075 words, 19 beats, 1274.775 s narration + 2.5-s silent end-card hold = 1277.275 s (21:17.28)**; speech alone 1170.9 s = 157.6 words per minute while speaking, **144.7 words per minute overall** (limit 150); 325 caption cues; self-check diff 0.0 ms in both runs; no caption warnings.

**Spoken-symbol rules.** "grad h" for the height gradient (as in #6); "hectopascals" in full; "two hundred metres" (never
"200 m"); "minus" for negative values; "Celsius" said once per scene, then "degrees". Places are named only when the camera
shows them centred and labelled (HOUSE_STYLE §5b).

**Cross-references (spoken):** gradient (#6: s09, s20), coordinates (#5: s06), weather basics (0.3: s16), a later movie on
geopotential (s22). End card: titles only.

**Lexicon candidates** (not added; check by ear in the render): Fuji ("Mount Fuji", default reading expected), Suruga
(`[Suruga](/sʊɹˈuɡə/)`), Lhotse (`[Lhotse](/lˈoʊtsˌA/)`), Khumbu (`[Khumbu](/kˈʊmbu/)`), isohypse (`[isohypse](/ˈIsəhˌIps/)`),
isohyet (`[isohyet](/ˌIsəhˈIət/)`), isobath (`[isobath](/ˈIsəbˌæθ/)`), isopycnal (`[isopycnal](/ˌIsəpˈɪknəl/)`), isotach
(`[isotach](/ˈIsətˌæk/)`), Azores (default), Bermuda (default).

Lines starting with ">" are notes and are not spoken.

## s00_title
In this video, we'll learn contour maps and isolines the easy way, and see how meteorology uses them to draw pressure, temperature and height on a map.

> 27 words · 1 sentences · 0 beats · 0.300–11.250 s (10.9 s; speech 10.1 s) · 0:00.30–0:11.25 (measured).
> Beat: opening title (HOUSE_STYLE §3).

## s01_hook
What is a contour line, and why are so many maps made of them? Let's see what contour lines are, and how to read them. Then let's see what they tell us about mountains, the sea floor, and the air above us.

> 42 words · 3 sentences · 0 beats · 11.250–26.550 s (15.3 s; speech 13.8 s) · 0:11.25–0:26.55 (measured).
> Beat: hook question.

## s02_numbers
Let's start with a map of numbers. Here is the air pressure at sea level over the western Atlantic, at noon universal time on the second of November, twenty twenty-three, from the reanalysis called ERA5. Each number is the pressure in hectopascals at one point of a grid. Pressure, like height or temperature, has one value at every place, so it's a scalar field, as in the gradient movie. But a page full of numbers is hard to read. Where is the pressure highest? Where does it change fastest? Our eyes can't tell from the numbers alone. There are two good ways to turn numbers into a picture. One is to paint each place with a colour. The other is to draw lines.

> 123 words · 11 sentences · 0 beats · 26.550–77.425 s (50.9 s; speech 46.6 s) · 0:26.55–1:17.42 (measured).
> Beat: building block: a field as a map of numbers.

## s03_isoline
Here's how the lines are made. Pick one value, say a thousand and sixteen hectopascals. Now find every place where the pressure is exactly a thousand and sixteen. Between two grid points, one with a thousand and fourteen, and its neighbour with a thousand and eighteen, the value a thousand and sixteen lies halfway between them. [beat] So the line passes halfway between the two points. If the neighbours were a thousand and fifteen and a thousand and nineteen, it would pass a quarter of the way along, nearer the fifteen. [beat] Join all those crossing points, and you get one smooth line. A line that joins places with the same value is called an isoline, or a contour line. Iso comes from the Greek word for equal. Then we pick the next value, a thousand and twenty, and draw its line too, and so on.

> 144 words · 10 sentences · 2 beats · 77.425–138.625 s (61.2 s; speech 55.0 s) · 1:17.42–2:18.62 (measured).
> Beat: building block: what an isoline is (interpolation in words).

## s04_rules
Contour lines follow a few simple rules, and each one comes from the same fact: every place has exactly one value. First, every point on a line has the same value, so walking along a contour line, the value never changes. Second, two lines with different values can never cross or touch, because the crossing point would need two values at once. Third, a line never just stops in the middle of a map. It either closes into a loop, or it runs off the edge. Fourth, a line splits the map into two sides: higher values on one side, and lower values on the other. So once you know which side is higher, you can read the whole map.

> 120 words · 7 sentences · 0 beats · 138.625–185.075 s (46.4 s; speech 43.5 s) · 2:18.62–3:05.07 (measured).
> Beat: building block: the four rules of contour lines.

## s05_interval
The steps between the lines are called the contour interval. On this map, the lines are drawn every four hectopascals: a thousand and twelve, a thousand and sixteen, a thousand and twenty. [beat] To find the interval on any map, take two neighbouring labels and subtract. One thousand and twenty minus one thousand and sixteen is four. [beat] A place between two lines has a value between them. Halfway between the sixteen and the twenty lines, the pressure is about a thousand and eighteen. [beat] The interval is a choice. Let's draw the same pressure map three ways. Every hectopascal, the lines crowd into a tangle. Every ten hectopascals, the small shapes disappear. Every four hectopascals, which is what weather maps use, we see the shapes without the clutter. Many maps also fill the space between two lines with one colour. Then each colour band is one interval, and the colour bar beside the map says which values it holds.

> 157 words · 13 sentences · 3 beats · 185.075–258.300 s (73.2 s; speech 64.8 s) · 3:05.07–4:18.30 (measured).
> Beat: building block: the contour interval, reading values, filled contours.

## s06_globe_fuji
Contour lines are much older than weather maps. Map makers drew them first for the height of the land. Let's fly to a famous mountain. This is Japan, a chain of islands in the north-west Pacific Ocean. On the main island, about a hundred kilometres south-west of Tokyo, stands Mount Fuji, Japan's highest mountain, at three thousand seven hundred and seventy six metres. It's a volcano, standing almost alone, with lakes at its northern foot and the deep water of Suruga Bay to the south. Let's zoom back out, and then take a closer look at the mountain itself.

> 99 words · 7 sentences · 0 beats · 258.300–300.325 s (42.0 s; speech 39.1 s) · 4:18.30–5:00.32 (measured).
> Beat: intuition: where contours come from (globe zoom tour to Mount Fuji).

## s07_slicing
Here is Mount Fuji in three dimensions, built from satellite measurements of the height of the ground every thirty metres. We've stretched the height twice, so the shape is easier to see. Now imagine cutting the mountain with flat, level sheets, like slicing a loaf of bread sideways. The first sheet is five hundred metres above sea level, the next one a thousand metres, and so on, every five hundred metres up to three thousand five hundred. Where each sheet cuts the ground, it leaves a line. Every point on that line has the same height. Let's lift those lines off the mountain, and lay them flat, one above the other, on the map. That's a contour map of the mountain: each line is a height contour, and the contour interval is five hundred metres.

> 135 words · 8 sentences · 0 beats · 300.325–353.100 s (52.8 s; speech 49.5 s) · 5:00.32–5:53.10 (measured).
> Beat: intuition: slicing a real mountain into contour lines (3-D terrain -> contours lift off).

## s08_spacing
Now let's read the steepness from the map. Let's draw the contours more closely, every two hundred metres. Near the summit, neighbouring lines are only about three hundred and fifty metres apart. Low down, on the gentle lower slopes, they're about two kilometres apart. So the same two-hundred-metre climb takes a short walk near the top, and a long walk near the bottom. [beat] Crowded lines mean a steep slope, and widely spaced lines mean a gentle one. Now picture a walker on the mountain. If she walks along a contour line, she stays at the same height: the path is level. If she walks straight across the lines, she climbs as fast as she can.

> 115 words · 9 sentences · 1 beats · 353.100–401.550 s (48.4 s; speech 43.7 s) · 5:53.10–6:41.55 (measured).
> Beat: intuition: spacing = steepness; a walker along and across the lines.

## s08b_profile
Contour maps also let us draw the shape of the ground along any line. Let's draw a straight line across the map, from the lower slopes on one side, over the summit, and down the other side. Every time the line crosses a contour, we know the height at that spot. Let's mark each of those heights above the line, at the right distance along it, and join the dots. That's a profile: a side view of the mountain along our line. Where the contours crowd, the profile climbs steeply, and where they're spread out, it's almost flat. It's the slicing from before, run backwards: from the lines, back to the shape.

> 112 words · 7 sentences · 0 beats · 401.550–444.650 s (43.1 s; speech 40.2 s) · 6:41.55–7:24.65 (measured).
> Beat: intuition: from contours back to the shape (a profile).

## s09_gradient_link
That walk straight across the lines is exactly the gradient from the gradient movie. Grad h, the gradient of the height, points the way the height increases fastest, so it's at right angles to the contour lines, pointing towards the higher ones. And its length, the steepest slope, is the contour interval divided by the spacing between the lines. Near the summit, that's two hundred metres over three hundred and fifty metres, about zero point five seven. [beat] That means about fifty seven metres up for every hundred metres along. On the lower slopes, it's two hundred over two thousand, which is zero point one, or ten metres up for every hundred along. [beat] So the map gives us the gradient without any calculus: its direction is across the lines, and its size is the interval over the spacing. Crowded lines mean a big gradient.

> 143 words · 8 sentences · 2 beats · 444.650–505.325 s (60.7 s; speech 55.1 s) · 7:24.65–8:25.32 (measured).
> Beat: why it matters: contour spacing gives the gradient (link to #6).

## s10_coast_isobaths
The coastline is a contour line too: it's the line where the height is zero, at sea level. And the contours don't stop at the coast. Below the sea, we can draw lines of equal depth. These are called isobaths, from the Greek word for depth. South of Mount Fuji, Suruga Bay drops steeply, and its floor reaches about two and a half kilometres below sea level. [beat] So within less than a hundred kilometres, the ground goes from about three point eight kilometres above the sea to about two and a half below it. One set of lines, height above zero and depth below it, draws the whole shape of the land and the sea floor.

> 116 words · 7 sentences · 1 beats · 505.325–549.850 s (44.5 s; speech 40.5 s) · 8:25.32–9:09.85 (measured).
> Beat: intuition: the coastline is the zero contour; isobaths below the sea.

## s11_globe_everest
Contour maps also show the shapes of mountains, not just their steepness. Let's fly to the highest mountains on Earth. This is the Himalaya, the great mountain wall between the plains of India and Nepal to the south, and the high plateau of Tibet to the north. Here, on the border between Nepal and China, stands Mount Everest, at eight thousand eight hundred and forty nine metres. Its neighbour, Lhotse, is the fourth highest mountain in the world, at eight thousand five hundred and sixteen metres. Let's zoom back out, and then look at the shapes of the ground round them.

> 101 words · 6 sentences · 0 beats · 549.850–590.125 s (40.3 s; speech 37.7 s) · 9:09.85–9:50.12 (measured).
> Beat: intuition: shapes (globe zoom tour to Everest).

## s12_shapes
Let's read the shapes of the ground round Everest from its contours, every two hundred metres. A peak shows up as a set of closed loops, one inside another, with the values rising towards the middle. Everest's summit is the smallest loop of all. A ridge is a long, raised spine of ground. Where the lines cross a ridge, they bend into a U or a V that points downhill, towards the lower values. A valley is the opposite: the lines bend into a V that points uphill, towards the higher values. South of Everest, below the glaciers, the river valleys of the Khumbu region make rows of Vs pointing up each valley. The opposite of a peak is a basin, a hollow with closed loops whose values fall towards the middle.

> 132 words · 8 sentences · 0 beats · 590.125–641.600 s (51.5 s; speech 48.2 s) · 9:50.12–10:41.60 (measured).
> Beat: intuition: peaks, ridges, valleys and basins read from contours.

## s13_col
There's one more shape. Between Everest and Lhotse, the ridge dips to a low point, about seven thousand nine hundred metres high, called the South Col. [beat] A col is a pass between two peaks. The word comes from French, where it means a neck. Stand at the col, and the ground rises in two directions, towards the two peaks, but falls in the other two directions, down into the valleys on either side. On the map, the contours make an hourglass: two sets of loops round the peaks, and two sets of lines bending in from the valleys, almost touching at the col. That's why a col is also called a saddle, like a horse's saddle: up at the front and back, down at the sides.

> 126 words · 7 sentences · 1 beats · 641.600–689.900 s (48.3 s; speech 44.2 s) · 10:41.60–11:29.90 (measured).
> Beat: intuition: the col (saddle) — South Col.

## s14_why_reasons
Why do scientists draw so many maps this way? There are three good reasons. The first is that a contour map shows the whole shape of a field at a glance: the peaks, the hollows, the ridges, the valleys and the passes, without reading a single number. The second reason is that the gradient is drawn for free. Wherever the lines crowd together, the field changes fast, and it changes fastest straight across the lines. The third reason is that lines leave room for other things. On one map we can draw pressure as lines over temperature as colours, and read both at once.

> 104 words · 7 sentences · 0 beats · 689.900–731.725 s (41.8 s; speech 38.9 s) · 11:29.90–12:11.73 (measured).
> Beat: why: three good reasons for contour maps.

## s15_globe_chart
Now let's look at how weather maps use the same idea. Let's go back to our map of sea-level pressure, and zoom out to see the whole of North America and the western Atlantic Ocean, at the same moment, noon universal time on the second of November, twenty twenty-three. In the weather basics movie, we met sea-level pressure: the pressure of the air, adjusted to what it would be at sea level, so that places at different heights can be compared.

> 81 words · 3 sentences · 0 beats · 731.725–760.975 s (29.2 s; speech 27.7 s) · 12:11.73–12:40.98 (measured).
> Beat: application: back to the weather map (map zoom-out to North America and the western Atlantic).

## s16_isobars
Let's draw its contour lines every four hectopascals. Lines of equal pressure are called isobars, from the Greek word for weight, because air pressure is the weight of the air above us. Every rule we've learned still holds. The isobars never cross, they close into loops or run off the map, and the interval between them is four hectopascals. Reading two labels, a thousand and twenty and a thousand and twenty four, confirms it. [beat] The only difference from the mountain is what the lines measure: not the height of the ground, but the pressure of the air.

> 97 words · 6 sentences · 1 beats · 760.975–801.650 s (40.7 s; speech 37.0 s) · 12:40.98–13:21.65 (measured).
> Beat: application: isobars.

## s17_highs_lows
Just like peaks and basins, the pressure map has highs and lows. Over the eastern United States, near Virginia, closed isobars circle a centre of high pressure: about a thousand and thirty four hectopascals in the middle. [beat] Weather maps mark it with a big H. Far out over the Atlantic, near the Azores islands, there's a second high, of about a thousand and thirty. Lows are the basins of the pressure map, marked with an L. One sits over Hudson Bay, in northern Canada, at about nine hundred and eighty five hectopascals. [beat] Another sits east of Newfoundland, at about nine hundred and ninety one. On a pressure map, a high is a peak of pressure, and a low is a hollow.

> 121 words · 8 sentences · 2 beats · 801.650–854.075 s (52.4 s; speech 46.9 s) · 13:21.65–14:14.08 (measured).
> Beat: application: highs and lows.

## s18_ridge_trough
The other shapes come back too. A long tongue of high pressure, stretching out from a high, is called a ridge, just like a ridge on a mountain. The isobars bulge outwards from the high, bending into U shapes that point towards lower pressure. A long tongue of low pressure, stretching out from a low, is called a trough, like a valley in the pressure map. There, the isobars bend into U or V shapes that point towards higher pressure. On this map, a trough reaches south from the low over Hudson Bay, and a ridge reaches out from the high over the eastern United States.

> 106 words · 6 sentences · 0 beats · 854.075–894.400 s (40.3 s; speech 37.8 s) · 14:14.08–14:54.40 (measured).
> Beat: application: ridges and troughs of pressure.

## s19_col_pressure
And there's a col too. South-east of Bermuda, between the high over the United States and the Azores High, the pressure dips to about a thousand and eighteen hectopascals. [beat] Going north or south from there, the pressure falls, towards the low near Newfoundland, and towards lower pressure over the Caribbean Sea. Going west or east, it rises, towards the two highs. That's the same hourglass we saw at the South Col: a saddle in the pressure field. The isobars there are far apart, and the wind was light, only about three metres per second.

> 94 words · 6 sentences · 1 beats · 894.400–934.350 s (40.0 s; speech 36.2 s) · 14:54.40–15:34.35 (measured).
> Beat: application: a col in the pressure field.

## s20_crowded_isobars
Spacing means the same thing as on the mountain. Where isobars crowd together, the pressure gradient is large. Near the low over Hudson Bay, the pressure changes by about six hectopascals in a hundred kilometres. [beat] Over most of the ocean on this map, it changes by only about one hectopascal per hundred kilometres. And the wind follows. Ten metres above the ground, the wind near Hudson Bay was about eighteen metres per second, while over most of the ocean it was about seven. [beat] As the gradient movie showed, the pressure gradient pushes the air, so crowded isobars go with strong winds.

> 101 words · 7 sentences · 2 beats · 934.350–980.100 s (45.8 s; speech 40.6 s) · 15:34.35–16:20.10 (measured).
> Beat: application: crowded isobars and strong winds (link to #6).

## s20b_practice
Let's practise on the whole map. Before we point anything out, try to find three things yourself: the contour interval, the strongest high, and the place where the pressure changes fastest. Here's the first. Two neighbouring labels, a thousand and twenty and a thousand and twenty four, differ by four, so the interval is four hectopascals. [beat] The strongest high is the set of closed loops near Virginia, at about a thousand and thirty four. The fastest change is near Hudson Bay, where the isobars crowd closest together. That's a good order for reading any contour map: first the interval, then the closed loops, then the spacing.

> 106 words · 7 sentences · 1 beats · 980.100–1026.500 s (46.4 s; speech 42.3 s) · 16:20.10–17:06.50 (measured).
> Beat: application: practise reading the chart (prediction pause).

## s21_isotherms
Lines of equal temperature are called isotherms. Here is the average temperature two metres above the ground in January, over the thirty years from nineteen ninety one to twenty twenty, from ERA5, with isotherms every five degrees Celsius. Let's follow the zero-degree isotherm, the line where the average is exactly freezing. Over the middle of North America, it runs at about forty degrees north. But over the north-east Atlantic, off the coast of Norway, it bends far to the north, to about seventy degrees north. [beat] That's about three thousand three hundred kilometres further north. So isotherms don't simply follow the lines of latitude. Over the warm North Atlantic, January is much milder than over the middle of a continent at the same latitude. And where the isotherms crowd together, like along the east coast of North America, the temperature changes fast across a short distance.

> 145 words · 9 sentences · 1 beats · 1026.500–1090.975 s (64.5 s; speech 59.7 s) · 17:06.50–18:10.97 (measured).
> Beat: application: isotherms (January climate).

## s22_isohypses
Contour maps can also show height in the air. Imagine the surface in the sky where the pressure is exactly five hundred hectopascals, about half the pressure at sea level. It isn't flat. On our day, the second of November, twenty twenty-three, it lay about four thousand nine hundred metres up over Hudson Bay, and almost six thousand metres up over the subtropical Atlantic. [beat] Let's draw that surface in three dimensions, stretched upwards so we can see its shape, and slice it, just like Mount Fuji, every sixty metres in height. The lines we get are contours of height, called isohypses, from the Greek word for height. On the map, they look just like a terrain map of a hilly surface high in the sky. A dip in the surface over eastern North America is a trough, and the bulges over the west and over the Atlantic are ridges. This height of a pressure surface is so important that it has its own movie later in the series.

> 168 words · 9 sentences · 1 beats · 1090.975–1157.325 s (66.4 s; speech 61.6 s) · 18:10.97–19:17.33 (measured).
> Beat: application: height on a contour map: the 500-hPa surface and its isohypses.

## s23_family
So contour lines come in a whole family, and the names all follow the same pattern: iso, meaning equal, plus a Greek word for the thing being measured. Isobars join equal pressure. Isotherms join equal temperature. Isohypses join equal height, and isobaths join equal depth under the sea. You'll meet a few more. Isohyets join places with equal rainfall. Isotachs join equal wind speed. And in the ocean, isopycnals join water of equal density. Different words, but the same idea, and the same rules.

> 84 words · 9 sentences · 0 beats · 1157.325–1199.400 s (42.1 s; speech 38.5 s) · 19:17.33–19:59.40 (measured).
> Beat: recap of names: the isoline family.

## s24_recap
To sum up, an isoline, or contour line, joins places where a field has the same value. Lines never cross, and they close into loops or run off the map. The contour interval is the step between neighbouring lines, found by subtracting two labels. Crowded lines mean a large gradient, and the gradient points straight across them, towards higher values. Closed loops mark peaks and hollows, bent lines mark ridges and valleys, and an hourglass marks a col. On weather maps, the same shapes become highs, lows, ridges, troughs and cols of pressure. Isobars, isotherms, isohypses and isobaths are all the same idea, applied to pressure, temperature, height and depth.

> 110 words · 7 sentences · 0 beats · 1199.400–1249.425 s (50.0 s; speech 47.1 s) · 19:59.40–20:49.42 (measured).
> Beat: recap ('To sum up', one beat per sentence).

## s25_end
This video is one of a series of related tutorials, so watch out for the others. They're made to help students of meteorology, atmospheric science and climate science, and anyone else who wants to learn not just these ideas, but the maths behind them too. The notebook for contour maps, and the notebooks for the other concepts, are on the website that goes with this video.

> 66 words · 3 sentences · 0 beats · 1249.425–1274.775 s (25.4 s; speech 24.3 s) · 20:49.42–21:14.78 (measured).
> Beat: series end card (weather/climate ending, HOUSE_STYLE §3).
