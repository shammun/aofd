# ch00_reading_weather_maps — "Reading weather maps: from the first report to tomorrow's forecast" (Chapter 0, #69, version 3)

Version 3 (2026-10-29): v2 (85 scenes, 49:57, commit 93e7b41) + ECMWF open data in the models-and-ensembles part (user-approved 2026-10-29): two models at the same lead time (s71b), the map score (s71c), what AIFS is (s71d), physics vs machine learning (s71e), the ECMWF 51-member ensemble (s72-s73b). The GEFS comparison s73c is kept as an optional scene at the end of this file. House style `movies/HOUSE_STYLE.md` (reference `ch00_dot_product_why` v6; §5 data-source line, colour bars, 3-D for space, globe camera, explain every number). Voice Kokoro `af_bella`, speed 1.0. Brief: `brief.md`; data, new functions and CHECK rows: `data_needs.md`; storyboard: `storyboard.yaml`.

**Measured, not estimated.** v2 scenes keep their measured spans from the v2 dry run (`dryrun/v2_merged`, 2994.225 s, self-check 0.0 ms). The 9 new or changed scenes (s69, s71b, s71c, s71d, s71e, s72, s73, s73b, s83) plus the optional s73c were measured with `tools/tts.py` on 2026-10-29 (`G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_reading_weather_maps/dryrun/v3_patch`, input `dryrun/script_v3_patch.md`; current `movies/lexicon.yaml`; IFS and AIFS written as letters in the measurement copy to match the proposed lexicon entries; 64 sentences, 498.95 s audio, 127 cues, self-check diff 0.0 ms, Kokoro render 302.9 s, warnings none). Splice: −140.725 s (old spans of s69, s72, s73, s83) + 461.45 s (measured spans of the 9 scenes) = +320.725 s. **90 scenes, 406 sentences (63 with a 1.5-s `[beat]`), 7851 words, 3314.950 s narration + 2.5-s silent end-card hold = 3317.450 s (55:17.45)**; **142.1 words per minute overall** (limit 150); 832 caption cues. Adding the optional s73c costs +37.7 s (total 3355.15 s = 55:55.15).

**Planning numbers in the ECMWF scenes (s71b, s71c, s71e, s73, s73b) are placeholders chosen to measure the narration, not data reads**: the data-scout reports `reports/data/ECMWF-OPEN-*.md` did not exist when this plan was written. Each is a CHECK row (RM90–RM104, data_needs §D) with re-wording variants (§D2); the builder speaks the data value and re-runs the TTS for any changed sentence.

Conventions: `[beat]` = 1.5-s hold after a worked reading (not spoken, not captioned); numbers are spoken in words and every number on screen is spoken (colour-bar ticks excepted); times are measured (start–end of the scene's audio in the dry run). Latitude φ, longitude λ (Vallis ϑ, λ).

## s00_title
In this video, we'll learn to read weather maps the easy way, and see how forecasters use them to follow real storms, from the first weather report to tomorrow's forecast.

> 30 words · 1 sentences · 0.300–12.400 s (12.1 s) · 0:00.30–0:12.40 (measured) · beat: opening title · reuses v1 s00_title
> Screen: 'Reading' / 'weather maps' 150 px TitleGradient; 'made easy' 96 px (pulse on 'the easy way'); 'and how forecasters use them' 68 px ('forecasters' teal). Right: Part A globe unrolling to a map with Tissot circles; Part B on 'forecasters': the 27 Oct 2026 chart building itself (IR, isobars, H/L, fronts), then a forecast clock 'T+72' ticking on 'forecast'

## s01_hook
How do you read a weather map? Here's a real one, drawn by forecasters on the twenty-seventh of October, twenty twenty-six, and at first it looks like a secret code. Let's crack it, one mark at a time: the map itself, the chart at the ground and the stations behind it, the air above, satellites and radar, and finally the forecasts.

> 61 words · 3 sentences · 12.400–35.950 s (23.6 s) · 0:12.40–0:35.95 (measured) · beat: hook question · reuses v1 s01_hook
> Screen: Full-width real chart from frame 0 (WPC 18 UTC 27 Oct 2026 on LCC: GOES-19 IR, GFS isobars, WPC H/L and fronts, barbs, station plots); on S4 seven tiny icons run along the top in the order spoken (graticule, isobar, station circle, 500-hPa sheet, satellite, radar sweep, clock), each lighting on its word

## s02_two_angles
Let's start with the most basic question on any map: where is this place? The Earth is very nearly a ball, so two angles pin down any place on it. We built them in the coordinates movie, so here's a quick reminder. Picture a straight line from the centre of the Earth, out through the place.

> 56 words · 4 sentences · 35.950–56.925 s (21.0 s) · 0:35.95–0:56.92 (measured) · beat: building blocks · where is a place · reuses v1 s02_two_angles
> Screen: 3-D globe (Blue Marble) turning to Brest; on S3 a cut-away: teal line from the centre out through Brest

## s03_lat_lon
The first angle is the latitude: the angle between our line and the equator, measured at the centre of the Earth, from zero at the equator to ninety degrees at each pole. Places with the same latitude form a circle called a parallel. The second angle is the longitude: the angle around the Earth's axis, from the meridian through Greenwich, in London, to the meridian through our place, up to one hundred and eighty degrees east or west. Brest, the port in north-western France where we watched Storm Ciarán pass, is at about forty-eight point four degrees north and four point five degrees west.

> 104 words · 4 sentences · 56.925–97.850 s (40.9 s) · 0:56.92–1:37.85 (measured) · beat: building blocks · latitude and longitude · reuses v1 s03_latitude
> Screen: Picture zone x 80-1000: cut-away Globe3D (Blue Marble), tilted so the equatorial plane is seen edge-on. S1: gold Arc at the centre between the equator line (slate) and the teal Brest line; '0 deg' on the equator, '90 deg N', '90 deg S' at the poles (54 px) on their words. S2: the Brest parallel draws itself as a teal ring; keyword 'parallel'. S3: camera rises above the North Pole (meridians as spokes, 'Greenwich 0 deg' gold); an arc round the axis from Greenwich to Brest; '180 deg E', '180 deg W'; keywords 'longitude', 'meridian'. S4: readout 'Brest 48.4 deg N, 4.5 deg W' (68 px) with gold lin

## s04_degrees
How far is one degree? Going due north, one degree of latitude is about one hundred and eleven kilometres everywhere: the Earth's radius, six thousand three hundred and seventy-one kilometres, times one degree in radians, which is pi over one hundred and eighty. [beat] Going due east is different, because the parallels shrink towards the poles. Let's call the latitude phi and the longitude lambda. A parallel's radius is the Earth's radius times cosine phi, so a degree of longitude is about one hundred and eleven kilometres at the equator, about seventy-four at Brest, and zero at the poles. [beat]

> 98 words · 5 sentences · 97.850–142.000 s (44.2 s) · 1:37.85–2:22.00 (measured) · beat: building blocks · how far is a degree · NEW in v2
> Screen: Picture zone x 80-1000: cut-away Globe3D (Blue Marble) with the Brest meridian and parallel. S1-S2: a gold arc one degree long along the meridian with a teal radius 'Earth's radius' from the centre; maths zone CalcStack '6371 km x pi/180 ~ 111 km' (68 px) aligned at '='. S3-S5: the Brest parallel ring, its radius drawn from the axis (slate) labelled 'radius x cos phi'; keywords 'phi latitude', 'lambda longitude'. Equations (84 px) delta y = a delta phi and delta x = a cos phi delta lambda stack in the maths zone, the 'a' with a small underbrace 'Earth's radius'. S6: three readouts on the globe

## s05_flatten
Now let's flatten the globe. You can't flatten an orange peel without stretching or tearing it, and the same goes for the Earth. A rule that turns latitude and longitude into a point on flat paper is called a map projection, and every projection distorts something. The simplest uses longitude as x and latitude as y, which is how most weather data arrive. But it draws every parallel as long as the equator, so it's stretched east to west by one over cosine phi: twice at sixty degrees. [beat]

> 88 words · 5 sentences · 142.000–178.825 s (36.8 s) · 2:22.00–2:58.82 (measured) · beat: intuition · flattening (plate carree) · NEW in v2
> Screen: Full width. S1-S2: three.js: the globe's skin peels into 12 gores that fall open flat with gaps (v1 s09 gores). S3: keyword 'map projection: (phi, lambda) -> (x, y)'. S4-S5: ProjectionMorph globe -> plate carree (Blue Marble), 'x = lambda', 'y = phi'; the reanalysis grid dots every 0.25 deg flash for 1 s over Europe. S6: readout '1/cos phi' with '60 deg: x 2' on a gold link to the 60 deg parallel, which is drawn the same length as the equator.

## s06_tissot_mercator
To see the distortion, let's place identical circles, each a thousand kilometres across, all over the globe. These test circles are called Tissot's indicatrix. On the simple map, the circles near the poles become wide ovals. Mercator's projection also stretches north to south by one over cosine phi, so the circles stay round: angles and shapes are kept, and the map is called conformal. The price is size: Greenland looks almost as big as Africa, although Africa is about fourteen times bigger.

> 82 words · 5 sentences · 178.825–215.975 s (37.2 s) · 2:58.82–3:35.97 (measured) · beat: intuition · Tissot and Mercator · NEW in v2
> Screen: Full width. S1-S2: gold Tissot circles (500-km radius, every 30 deg) on the globe, then projected on the plate carree (ovals near the poles). S3-S4: morph plate carree -> Mercator; one circle at 60 deg turns from oval to round (gold pulse); keyword 'conformal = angles kept'. S5-S6: Greenland and Africa outlined gold on the Mercator map; Greenland slides back onto the globe and shrinks to its true size beside Africa; '~ 14 x' readout.

## s07_chart_projections
Weather charts need true angles, because the angle between the wind and the isobars matters, so forecasters use conformal maps: Mercator near the equator, and near the poles the polar stereographic projection, the view from above a pole. In the middle latitudes they use the Lambert conformal conic projection: picture a cone set over the globe like a lampshade, cutting it along two standard parallels, where the scale is exactly right. With standard parallels at forty and sixty degrees north, the scale stays within about two percent from thirty-five to sixty-five degrees. [beat] Maps that compare amounts, like rainfall totals, use equal-area projections instead.

> 103 words · 4 sentences · 215.975–263.750 s (47.8 s) · 3:35.97–4:23.75 (measured) · beat: why · the projections forecasters use · NEW in v2
> Screen: Full width, three beats. S2: Mercator tropics band (Tissot circles nearly equal). S3: camera rises above the North Pole; morph to polar stereographic disc; gold ring '60 deg: true scale'. S4-S5: 3-D translucent cone over the globe cutting at 40 and 60 deg N (gold rings), the cone unrolls into a fan-shaped Europe map; band 35-65 deg 'within ~ 2 %' with the k readouts '1.018 ... 0.985 ... 1.022' (52 px) along a slim scale graph at the right. S5 (v1 s17 folded in): a 2-s morph to Equal Earth with equal-area Tissot ovals; keyword 'equal-area: amounts'.

## s08_legend
Every chart also has small print worth reading first. What is plotted, and in which unit: hectopascals, degrees Celsius, or knots? What is the step between lines, called the contour interval: four hectopascals for isobars, or sixty metres for heights? What does the colour bar span? Two maps can use the same colours for very different numbers. And where do the data come from: stations, a satellite, a reanalysis or a forecast model? In this video, that answer is always in a small line at the bottom of the picture.

> 90 words · 7 sentences · 263.750–303.575 s (39.8 s) · 4:23.75–5:03.57 (measured) · beat: building blocks · the small print: legend, units, interval, source · NEW in v2
> Screen: Full width: the Ciaran 12 UTC chart (s15 base) small at left; four gold pointers land in turn on its parts: an isobar label '996 hPa' (S1), the gap between two isobars '4 hPa' (S2), a colour bar of a 2-m temperature inset (52 px ticks, deg C) (S3), then the same colours re-labelled on a second inset of 500-hPa height 'm' (S4, the trap: same colours, different numbers), and finally the source line at the bottom 'Data: ERA5 (Copernicus C3S/ECMWF) · 2 Nov 2023, 12 UTC' which pulses (S5-S6).

## s09_utc
Next, the time stamp. Weather charts use one clock for the whole world, universal time, written U T C or simply Z, which is said Zulu. Brest in November is one hour ahead, so three in the morning universal time is four in the morning in Brest. [beat] New York in late October is four hours behind, so eighteen hundred universal time is two in the afternoon there. [beat]

> 67 words · 4 sentences · 303.575–332.950 s (29.4 s) · 5:03.57–5:32.95 (measured) · beat: building blocks · universal time and local time · NEW in v2
> Screen: Picture zone: a small globe with the day-night terminator at 03 UTC 2 Nov 2023, two clock glyphs: 'UTC 03:00' (gold) and 'Brest 04:00' (teal, UTC+1). S4: globe turns to New York at 18 UTC 27 Oct 2026: 'UTC 18:00' and 'New York 14:00' (UTC-4). Maths zone: '03:00 Z + 1 h = 04:00', '18:00 Z - 4 h = 14:00'.

## s10_valid_initial
Forecast charts carry two times. The initial time is when the forecast started, and the valid time is the moment the chart shows. The difference is the forecast hour. So a forecast started at eighteen hundred universal time on the twenty-fourth of October, plus seventy-two hours, is valid at eighteen hundred on the twenty-seventh. [beat] An analysis is a chart whose valid time is its initial time: our best picture of the present.

> 72 words · 5 sentences · 332.950–365.200 s (32.2 s) · 5:32.95–6:05.20 (measured) · beat: building blocks · initial time, valid time, forecast hour · NEW in v2
> Screen: Maths zone: a time line (gold) with two ticks 'initial 24 Oct 18 UTC' and 'valid 27 Oct 18 UTC' and a bracket 'forecast hour T+72'; CalcStack '24 Oct 18Z + 72 h = 27 Oct 18Z'. Picture zone: the real GFS +72-h MSLP chart thumbnail (s84 data) with its two stamps in the corner pulsing on their words; S5: the analysis thumbnail with 'T+0'.

## s11_traps
A few traps before we read any lines. Some data sets count longitude from zero to three hundred and sixty degrees east, so Brest sits at three hundred and fifty-five point five, the same meridian as minus four point five. Sea-level pressure over high mountains is only an estimate: on one global chart in October twenty twenty-six, the highest pressure on Earth, one thousand and fifty-eight hectopascals, sat on the Karakoram mountains. [beat]

> 72 words · 3 sentences · 365.200–396.925 s (31.7 s) · 6:05.20–6:36.93 (measured) · beat: why · traps before reading · NEW in v2
> Screen: Picture zone: (S1) a plate-carree strip of Europe split at 0 deg with its western half pasted at the far right (the wrong 0-360 seam, rose dash), snapping back; '355.5 deg E = -4.5 deg'. (S2-S3) the GFS 00 UTC 27 Oct 2026 global MSLP (unmasked) on a small globe turned to Asia; the 1057.8 maximum on the Karakoram ringed rose with a hatch; keyword 'not real weather'; colour bar hPa (52 px). (S4) two tiny maps 'value' / 'anomaly' (ERA5 Sep 2026 2-m temperature and its anomaly, colour bars). Source lines 'Data: NCEP GFS · 27 Oct 2026, 00 UTC' / 'Data: ERA5 · Sep 2026'.

## s12_isobars
Now let's read the chart at the ground. Here's Storm Ciarán at midday universal time on the second of November, twenty twenty-three. The lines are isobars, joining places with the same sea-level pressure, drawn every four hectopascals and labelled with their full value. A low is marked L and a high H, with the central pressure below the letter: nine hundred and fifty-six for the low over the North Sea, and one thousand and thirty for the high near the Azores. A low isn't low because of a magic number: it's lower than everything around it, with isobars closing round it.

> 101 words · 5 sentences · 396.925–437.750 s (40.8 s) · 6:36.93–7:17.75 (measured) · beat: building blocks · reading isobars · reuses v1 s21_isobars
> Screen: cartostyle Ciarán chart 12 UTC 2 Nov 2023 (LCC 40/60): isobars every 4 hPa with in-line full labels ('972', '996' …); L '956' over the North Sea, H '1030' south-west; Brest dot

## s13_sea_level
Why sea-level pressure? Near the ground, the pressure falls by about one hectopascal for every eight metres we climb, so a barometer on a hill reads lower than one at the coast in the same weather. So each station's pressure is converted to what it would be at sea level. At six in the evening on the first of November, the barometer at Brest airport, ninety-nine metres up, read nine hundred and seventy-one point eight hectopascals; reduced to sea level, it became nine hundred and eighty-three point three. [beat] Eleven and a half hectopascals, times about eight and a half metres per hectopascal in that mild air, is about ninety-eight metres: the station's height. [beat]

> 113 words · 5 sentences · 437.750–485.300 s (47.6 s) · 7:17.75–8:05.30 (measured) · beat: why · why sea-level pressure (a real reduction at Brest) · NEW in v2
> Screen: Picture zone: 3-D cut-away of Brittany terrain (ETOPO, vertical x20 said nowhere: drawn as a profile 'not to scale' is NOT shown; the x20 is in the manifest) with the airport on its hill at 99 m and a barometer icon; a slate column drops from the barometer to sea level with a bracket '99 m'. Maths zone CalcStack: '983.3 - 971.8 = 11.5 hPa'; '11.5 hPa x 8.5 m/hPa ~ 98 m'; the 8.5 has an underbrace 'R T / (g p) at 10 deg C'. Source line 'Data: NOAA NCEI ISD (Brest-Guipavas SYNOP) · 1 Nov 2023, 18 UTC'.

## s14_spacing
How strong is the wind? Look at the spacing, just as crowded contours meant a steep slope in the gradient movie. Over the English Channel, the pressure changes by about seven and a half hectopascals every hundred kilometres, and the wind near the ground is about twenty-two metres per second. Near the Azores high, it changes by less than half a hectopascal per hundred kilometres, and the wind is only three or four metres per second. So the closer the isobars, the stronger the wind.

> 85 words · 5 sentences · 485.300–519.675 s (34.4 s) · 8:05.30–8:39.67 (measured) · beat: building blocks · spacing means wind · reuses v1 s22_spacing
> Screen: two gold 100-km rulers across the isobars: Channel '7.5 hPa per 100 km' · '22 m/s'; near the Azores '< 0.5 hPa per 100 km' · '3–4 m/s'; keyword 'closer isobars → stronger wind'

## s15_geostrophic_idea
Why? We built the answer in the geostrophic wind movie. Away from the ground, the push of the pressure, from high towards low, is balanced by the Coriolis effect of the Earth's spin, which pushes moving air sideways. Then the wind blows along the isobars, at a speed of one over the density times f, times how fast the pressure changes across the isobars. Here f is the Coriolis parameter, two Omega sine phi.

> 74 words · 5 sentences · 519.675–551.625 s (32.0 s) · 8:39.67–9:11.62 (measured) · beat: why · the balance behind spacing (geostrophic) · NEW in v2
> Screen: Picture zone: a strip of four straight isobars (from the s20 site) with an air parcel (teal dot); orange arrow 'pressure push, high -> low' and violet arrow 'Coriolis' growing until equal and opposite; the teal wind arrow then runs along the isobars. Maths zone (96 px): V_g = (1/(rho f)) Delta p / Delta n with gold underbraces 'density', 'Coriolis parameter', 'pressure change across the isobars'; then f = 2 Omega sin phi (84 px) with 'Earth's spin' under Omega.

## s16_geostrophic_number
Let's try it west of Spain, at forty-four degrees north, where the isobars are nearly straight. The pressure changes by three hectopascals, which is three hundred pascals, every hundred kilometres. The air's density is about one point two five kilograms per cubic metre, and f is about one point zero one times ten to the minus four per second. Three hundred over one hundred thousand, divided by one point two five times one point zero one times ten to the minus four, is about twenty-four metres per second. [beat] The reanalysis wind ten metres above the sea there is about seventeen, about seventy percent of that, because friction near the surface slows the wind. [beat]

> 113 words · 5 sentences · 551.625–601.200 s (49.6 s) · 9:11.62–10:01.20 (measured) · beat: why · a worked geostrophic wind west of Spain · NEW in v2
> Screen: Picture zone: zoom (MapCamera) on the Ciaran chart at 44 N 10 W: a gold 100-km ruler across two isobars, labels '3 hPa', '100 km'; the reanalysis 10-m barb at the point (teal). Maths zone CalcStack: f = 2 x 7.29e-5 x sin 44 deg ~ 1.01e-4 /s; V_g = (300 Pa / 100 000 m) / (1.25 x 1.01e-4) ~ 24 m/s (gold link from the ruler to 300 Pa); 'measured 17 m/s ~ 70 %'. S4: two spacing bars '100 km -> ~ 30 m/s', '500 km -> ~ 6 m/s'. Source line 'Data: ERA5 · 2 Nov 2023, 12 UTC · 44 N 10 W'.

## s17_bb_brest
Because the wind blows nearly along the isobars, there's a handy rule for finding the low, put into words by the Dutch meteorologist Buys Ballot in eighteen fifty-seven. In the northern hemisphere, stand with your back to the wind, and the low pressure is on your left. Let's test it at Brest, at three in the morning during Ciarán. The wind came from the west, so with your back to it, you face east. The centre of the low was about one hundred and eighty kilometres away, to the north-north-east: on your left, and a little in front, about seventy-five degrees to the left rather than ninety. [beat] Near the ground, friction turns the wind partly towards the low, which puts the low a little ahead of your left shoulder.

> 129 words · 6 sentences · 601.200–651.075 s (49.9 s) · 10:01.20–10:51.08 (measured) · beat: building blocks + application · Buys Ballot's rule, tested at Brest · reuses v1 s49_bb_brest
> Screen: (v1 s48 + v1 s49 merged) S1-S2: Ciaran chart with streaklines along the isobars; a small person icon with its back to a teal wind arrow, 'L' on its left; '1857'; keyword 'back to the wind -> low on the left (north)'. S3-S6: zoom on Brittany 03 UTC: Brest station model; person icon facing east; gold arrow to 'L 954' (50.0 N 3.75 W) '180 km'; angle arc '~ 75 deg' vs dashed '90 deg'; keyword 'friction turns the wind towards the low'. Source line 'Data: NOAA NCEI ISD (Brest SYNOP) · ERA5 · 2 Nov 2023, 03 UTC'.

## s18_bb_south
South of the equator, everything turns the other way. Here's the Earth in infrared from Japan's Himawari satellite, at midnight universal time on the twenty-seventh of October. North of the equator, a typhoon of about nine hundred and thirty-five hectopascals spins anticlockwise, as seen from above. Far to the south, a low of about nine hundred and forty-five, south of Tasmania, spins clockwise, as seen from above. So in the southern hemisphere, with your back to the wind, the low is on your right. Near the equator the rule fails, as we saw in the Coriolis and geostrophic wind movies.

> 100 words · 6 sentences · 651.075–694.950 s (43.9 s) · 10:51.08–11:34.95 (measured) · beat: contrast · the southern hemisphere · reuses v1 s51_bb_south
> Screen: Himawari full-disk IR 00 UTC 27 Oct 2026 on a three.js globe; GFS isobars around the typhoon (14.5° N 162.5° E) and the southern low (60.3° S 148° E); gold arcs 'anticlockwise' / 'clockwise' (seen from above); 'L 935', 'L 945'; person icon south: low on the right

## s19_tendency
Forecasters also watch how fast the pressure is changing. The change over the last three hours is called the pressure tendency. Here it is for Ciarán at three in the morning on the second of November. Over the English Channel, ahead of the low, the pressure had fallen by almost eleven hectopascals in three hours. [beat] Behind it, west of Brittany, it had risen by fifteen. [beat] Lines of equal tendency are called isallobars. A low moves towards the falls and away from the rises, so this pair points the way Ciarán went: north-east, up the Channel.

> 95 words · 7 sentences · 694.950–737.725 s (42.8 s) · 11:34.95–12:17.73 (measured) · beat: intuition · pressure tendency and isallobars · NEW in v2
> Screen: Full width LCC map 44-56 N, 14 W-8 E: 3-h MSLP change 00->03 UTC 2 Nov 2023 as a diverging colour field (rose = falls, teal = rises, colour bar -12...+16 hPa/3 h, 52 px, with '-'/'+' glyphs), isallobars every 2 hPa/3 h (thin), current isobars (white 60 %) on top; L '954' at 50.0 N 3.75 W. S4: gold probe '-10.9' over the Channel; S5: '+15.0' west of Brittany. S7: a gold arrow from the rise centre through the low to the fall centre; S8: the 12 UTC centre (52.5 N 1.75 E) appears as a ghost 'L 956, 9 h later' along the arrow (track by continuity). Source line 'Data: ERA5 (Copernicus C3S/ECMWF) · 2

## s20_troughs_ridges
Isobars also make shapes worth naming. Where they bulge out from a low in a long, narrow tongue, the line of lowest pressure is a trough, drawn as a dashed line. Where they bulge out from a high, the line of highest pressure is a ridge. Between two highs and two lows, the isobars form a saddle called a col, where the winds are light.

> 65 words · 4 sentences · 737.725–762.025 s (24.3 s) · 12:17.73–12:42.02 (measured) · beat: building blocks · troughs, ridges and cols at the ground · reuses v1 s23_troughs_ridges
> Screen: latest North-Atlantic chart crop: a WPC trough (orange dashed) inside a tongue of isobars; a ridge axis (slate dash-dot) from the high over Quebec; keywords 'trough', 'ridge'

## s21_fronts_intro
Now the boldest marks on the chart: the fronts. A front is the boundary between two air masses with different temperatures and humidity, as we saw in the weather basics movie. It's drawn where it meets the ground, with symbols on the side towards which it's moving. Let's go through every kind.

> 52 words · 4 sentences · 762.025–783.925 s (21.9 s) · 12:42.02–13:03.92 (measured) · beat: building blocks · fronts · reuses v1 s39_front_symbols
> Screen: four front lines stacked as a legend built by the voice (no box): cold (blue triangles), warm (red half circles); then two greyed placeholders for the next two

## s22_cold_front
A cold front, where cold air pushes under warmer air, is blue with triangles. As one passes, the wind veers, which means its direction turns clockwise on the compass; the temperature and the dew point drop; and the pressure starts to rise. At Brest, Ciarán's cold front came through in the early hours of the second of November. Between midnight and three in the morning, the wind turned from two hundred and twenty degrees to two hundred and seventy, the dew point fell from ten to seven and a half degrees, and the pressure began to rise.

> 97 words · 4 sentences · 783.925–821.375 s (37.5 s) · 13:03.92–13:41.38 (measured) · beat: building blocks · the cold front, with Brest's real passage · NEW in v2
> Screen: Left: the legend line 'cold front' (blue #4a7fd8 line, triangles) fills its slot. Picture zone: 3-D side view (x50, said in s30) of a cold wedge undercutting warm air, moving right. Maths zone: a mini time panel for Brest 00 -> 03 UTC 2 Nov 2023: two barbs (220 deg 42 kt -> 270 deg 39 kt) with a compass arc 'veer +50 deg'; 'Td 10 -> 7.5 deg C' (teal), 'pressure: falling -> rising' with the tendency glyph. Source line 'Data: NOAA NCEI ISD (Brest METAR, SYNOP) · 2 Nov 2023, 00-03 UTC'.

## s23_warm_front
A warm front, where warm air slides up over colder air, is red with half circles. Ahead of it, the cloud thickens and lowers, steady rain sets in, and the pressure falls. Behind it comes the warm sector, the warm, moist air between the two fronts. At Brest at six in the evening on the first of November, the pressure had fallen ten point three hectopascals in three hours, with heavy rain and a south-easterly wind. [beat] Two hours later, in the warm sector, the reanalysis dew point there had climbed to thirteen degrees.

> 93 words · 5 sentences · 821.375–860.000 s (38.6 s) · 13:41.38–14:20.00 (measured) · beat: building blocks · the warm front and the warm sector · NEW in v2
> Screen: Legend line 'warm front' (red #e0554f, half circles). Picture zone: 3-D side view of warm air gliding up a shallow cold wedge (x50), cloud layers thickening towards the front. Maths zone: Brest 18 UTC panel: barb 150 deg 18 kt, '-10.3 hPa in 3 h' with tendency glyph code 8, four rain dots; then a small Td time line 18 -> 20 UTC rising to '13.0 deg C' (teal, ERA5). Source line 'Data: NOAA NCEI ISD (Brest SYNOP) · ERA5 · 1 Nov 2023, 18-20 UTC'.

## s24_occluded
Cold fronts usually move faster than warm fronts. When a cold front catches up with the warm front, the warm air between them is lifted off the ground, and the two fronts join into an occluded front. In this side view, the heights are drawn about fifty times taller than in nature. An occluded front is purple, with triangles and half circles on the same side, and it curls round the centre of a mature low, like the one off Labrador on the latest chart.

> 85 words · 4 sentences · 860.000–891.875 s (31.9 s) · 14:20.00–14:51.88 (measured) · beat: building blocks · occluded fronts · reuses v1 s40_occluded
> Screen: 3-D side view (×50): cold wedge catching the warm front, the warm wedge lifted off the ground; map strip above with the two fronts merging into a purple occluded front; real WPC occluded front off Labrador

## s25_stationary
When neither air mass pushes the other back, the front is stationary: red half circles and blue triangles on opposite sides. A trough at the ground, with no clear change of air mass, is a dashed line without symbols. On the latest chart, forecasters drew twelve stationary fronts and thirty-eight troughs.

> 51 words · 3 sentences · 891.875–913.975 s (22.1 s) · 14:51.88–15:13.98 (measured) · beat: building blocks · stationary fronts and trough lines · reuses v1 s41_stationary_trough
> Screen: stationary front glyph (alternating red half circles / blue triangles on opposite sides); trough as orange dashed line; both then ringed on the real chart over the US

## s26_squall_dryline
Two more lines appear on American charts. A squall line, a long line of thunderstorms with sudden gusts, is drawn with dashes and pairs of dots, and we'll see one on radar soon. A dryline, drawn with open half circles, separates moist air from very dry air, usually over the southern Great Plains in spring. At three in the afternoon local time on the twentieth of May, twenty thirteen, Duncan, in Oklahoma, had a dew point of twenty-one degrees and a southerly wind, while Lawton, about forty-four kilometres to the west, had six degrees and a westerly wind. [beat] Storms often start along a dryline, and that afternoon a violent tornado struck the town of Moore.

> 115 words · 5 sentences · 913.975–963.475 s (49.5 s) · 15:13.98–16:03.48 (measured) · beat: building blocks · squall lines (symbol) and drylines, with real Oklahoma stations · NEW in v2
> Screen: S1: legend line 'squall line' (dash, dot, dot) fills its slot with a tiny illustrative line of storm cells (decorative). Legend line 'dryline' (brown #b07a3a open half circles) fills its slot. Picture zone: LCC map of Oklahoma (NE 10m admin-1, cities) with ~40 real METAR station models at 20 UTC 20 May 2013 (Td in teal large); the builder's dryline drawn where Td drops fastest between neighbours (gold dashed then brown symbol); Duncan and Lawton ringed, gold link to 'Td 21 deg C | 6 deg C', '44 km'. S6: a small marker at Moore (no imagery). Source line 'Data: Iowa Environmental Mesonet (NWS/FA

## s27_front_clues
So how does a forecaster know where to draw a front? From the stations. Across a front, the temperature, the dew point and the wind direction jump between neighbours, and the pressure tendency flips from falling to rising. Along this line of stations at three in the morning, the winds behind the cold front are westerly and the air is cooler and drier; ahead of it, they're south-westerly, and the air is warmer and moister. The front lies between them.

> 80 words · 5 sentences · 963.475–996.225 s (32.8 s) · 16:03.48–16:36.23 (measured) · beat: intuition · finding a front in station plots · reuses v1 s38_front_clues
> Screen: same station map; a gold transect of 5 stations west → east; their T, Td and barbs brighten; a mini profile chart below (T orange, Td teal) with a step; a blue cold-front line drawn between the two stations where it jumps

## s28_analysis_build
Put it all together, and you have a surface analysis: the forecaster's map of the weather at one moment. Here's Ciarán's, built up layer by layer at three in the morning: the station plots, the isobars, the low and its central pressure, and the fronts. These fronts come from a computer method that finds the sharpest temperature changes, about one and a half kilometres up.

> 65 words · 3 sentences · 996.225–1022.000 s (25.8 s) · 16:36.23–17:02.00 (measured) · beat: application · a surface analysis, layer by layer · reuses v1 s42_analysis_build
> Screen: Ciarán 03 UTC 2 Nov 2023 analysis builds in four layers on an LCC map: station models → isobars (4 hPa) → L '954' → objective fronts with symbols; keyword 'surface analysis'

## s29_obs_network
Where do the numbers start? At thousands of weather stations, reporting every hour or every three hours. Here are the stations one archive collected in twenty minutes around eighteen hundred universal time on the twenty-seventh of October: more than four thousand seven hundred. Airports send a code called METAR, and other stations a code called SYNOP, short for synoptic: seeing the whole picture at once.

> 65 words · 4 sentences · 1022.000–1052.400 s (30.4 s) · 17:02.00–17:32.40 (measured) · beat: building blocks · where the numbers start · NEW in v2
> Screen: Globe3D turns slowly (camera continuity from s35's Europe), 4730 station dots (warm white 70 %, 4 px) appear in a sweep on AT(3, 'more than four thousand'); count readout '4 730' ticks up. S4: two keywords 'METAR: airports', 'SYNOP: weather stations'. Source line 'Data: Iowa Environmental Mesonet (METARs) · 27 Oct 2026, 17:50-18:10 UTC'.

## s30_metar
Here's a real METAR from Brest airport, at midnight universal time as Ciarán arrived. L F R B is the airport's code. Zero two, zero zero zero zero Z means the second of the month at midnight, universal time. AUTO means an automatic report. Two two zero, four two, G six one, K T says the wind blew from two hundred and twenty degrees at forty-two knots, gusting to sixty-one.

> 70 words · 5 sentences · 1052.400–1084.525 s (32.1 s) · 17:32.40–18:04.53 (measured) · beat: building blocks · a METAR decoded (Brest) · reuses v1 s32_metar
> Screen: the real report in monospace 54 px: 'LFRB 020000Z AUTO 22042G61KT 2400 RA BR BKN014 OVC022 11/10 Q0963'; groups underlined gold as decoded: 'Brest airport', '2nd, 00:00 UTC', 'automatic', 'from 220°, 42 kt, gusts 61 kt' (the later groups are decoded in s33)

## s31_metar_rest
Next comes the visibility, two thousand four hundred metres, and R A and B R, rain and mist. B K N, zero one four, is broken cloud, covering more than half the sky, at one thousand four hundred feet, and O V C, zero two two, is overcast, a fully covered sky, at two thousand two hundred feet. Eleven slash ten is the temperature and the dew point in degrees Celsius. And Q zero nine six three is the pressure, nine hundred and sixty-three hectopascals, reduced to sea level the way pilots use it.

> 94 words · 4 sentences · 1084.525–1122.950 s (38.4 s) · 18:04.53–18:42.95 (measured) · beat: building blocks · the rest of the METAR · reuses v1 s33_metar_rest
> Screen: rest of the METAR decoded: '2400 m', 'rain · mist', 'broken 1400 ft', 'overcast 2200 ft', 'T 11 °C · Td 10 °C', '963 hPa'; six small icons in a row

## s32_metar_remarks
American METARs add remarks. Here's Fairbanks, in Alaska, at five to six in the evening universal time on the twenty-seventh of October: wind from seventy degrees at four knots, visibility one eighth of a mile, F G for fog, and V V zero zero two, a hidden sky with a vertical visibility of two hundred feet. A three zero four seven is the pilots' altimeter setting, thirty point four seven inches of mercury, about one thousand and thirty-two hectopascals. After R M K, S L P three two nine is the sea-level pressure, one thousand and thirty-two point nine: one report, two pressures for different jobs. [beat] T zero zero zero nine, zero zero zero nine gives the temperature and dew point in tenths: zero point nine degrees both, so the air is saturated. And five two zero one two is the tendency: code two, rising, by one point two hectopascals. [beat]

> 150 words · 6 sentences · 1122.950–1189.825 s (66.9 s) · 18:42.95–19:49.83 (measured) · beat: building blocks · an American METAR with remarks (Fairbanks) · NEW in v2
> Screen: Maths zone: the real report in monospace 54 px 'PAFB 271755Z 07004KT 1/8SM FG VV002 01/01 A3047 RMK AO2A SLP329 4/004 T00090009 10028 20007 52012 RVRNO', groups underlined gold as decoded: 'from 70 deg, 4 kt', '1/8 mile', 'fog', 'sky hidden, 200 ft', 'altimeter 30.47 inHg'. CalcStack '30.47 x 33.86 ~ 1032 hPa'. Picture zone: a small globe flies to Alaska and Fairbanks (gold dot) with a fog-grey disc. Source line 'Data: Iowa Environmental Mesonet (NWS METAR) · Fairbanks PAFB · 27 Oct 2026, 17:55 UTC'. Then (S4-S6): the remark groups decoded in turn: 'SLP 1032.9 hPa' beside 'altimeter ~ 1032 hPa

## s33_synop
A SYNOP report is a row of five-digit groups, and each digit has a fixed meaning. Here's Brest at three in the morning on the second of November. Eight two seven three nine means eight oktas of cloud, which we'll meet in a moment, and a wind from two hundred and seventy degrees at thirty-nine knots. In one zero zero nine two, the one says temperature, the zero says above zero, and zero nine two means nine point two degrees. Two zero zero seven five is the dew point, seven point five. Three nine five eight two is the pressure at the station, nine hundred and fifty-eight point two hectopascals, and four nine six nine six the sea-level pressure, nine hundred and sixty-nine point six.

> 125 words · 6 sentences · 1189.825–1240.200 s (50.4 s) · 19:49.83–20:40.20 (measured) · beat: building blocks · a SYNOP decoded (Brest 03 UTC) · NEW in v2
> Screen: Maths zone: the real groups in monospace 54 px '82739 10092 20075 39582 49696 53055 763// 333 ... 91084', each group underlined gold in turn with its decode below (keyword 52-54 px): 'N 8 · from 270 deg · 39 kt', '1 · + · 9.2 deg C', '2 · + · Td 7.5 deg C', '3 · station 958.2 hPa', '4 · sea level 969.6 hPa'; digit-level colour: the group's leading digit gold, the sign digit slate. Picture zone: the Brest station circle waiting, empty. Source line 'Data: NOAA NCEI ISD (Brest-Guipavas SYNOP) · 2 Nov 2023, 03 UTC'.

## s34_synop_rest
Five three zero five five is the pressure tendency: code three, a rise of five point five hectopascals in three hours. Seven six three slash slash is the present weather, code sixty-three: moderate rain, falling without a break. And nine one one, eight four is the strongest gust in the past hour, eighty-four knots. A knot is one point eight five two kilometres per hour, so that's about one hundred and fifty-six kilometres per hour. [beat]

> 75 words · 4 sentences · 1240.200–1273.975 s (33.8 s) · 20:40.20–21:13.97 (measured) · beat: building blocks · the rest of the SYNOP (tendency, weather, gust) · NEW in v2
> Screen: Same strip: '5 · 3 · 055 -> +5.5 hPa in 3 h' with tendency glyph code 3; '7 · 63 · //' -> three dots in a triangle arrangement 'moderate continuous rain'; '911 · 84 kt' with CalcStack '84 x 1.852 ~ 156 km/h'. Source line as s41.

## s35_station_layout
Weather maps turn these messages into a small picture called a station model, with every number in its own place around a circle. The temperature goes at the upper left, the dew point at the lower left, the sea-level pressure at the upper right, and the tendency at the right. The present weather sits to the left, with the visibility further left. The barb shows the wind, and the circle shows the cloud cover. American charts write the temperatures in Fahrenheit, so always check the unit.

> 86 words · 5 sentences · 1273.975–1307.950 s (34.0 s) · 21:13.97–21:47.95 (measured) · beat: building blocks · the station model layout · reuses v1 s34_station_model
> Screen: big station model built piece by piece (SVG, 3× size): filled circle '8 oktas', barb from 270° with 4 long feathers '39 kt → 40', '9.2' upper-left (orange), '7.5' lower-left (teal), rain symbol (3 dots) left; the decoded groups of the real synop above in mono 44 px

## s36_cloud_cover
How much of the circle is filled shows how much of the sky is covered, in eighths called oktas: empty for a clear sky, a quarter for two oktas, half for four, and full for eight. A cross means the sky can't be seen, as in the Fairbanks fog. METARs use words instead: few means one or two oktas, scattered three or four, broken five to seven, and overcast eight.

> 70 words · 3 sentences · 1307.950–1335.100 s (27.1 s) · 21:47.95–22:15.10 (measured) · beat: building blocks · cloud cover in oktas · NEW in v2
> Screen: Maths zone: a row of nine sky-cover circles 0-8 oktas (WMO code 2700 glyphs, MetPy sky_cover glyph set re-drawn in house SVG) plus the obscured cross, each lighting on its number; under them the METAR words 'FEW 1-2 · SCT 3-4 · BKN 5-7 · OVC 8' aligned to the glyphs. Picture zone: the sky over Brest at 03 UTC as a hemisphere dome 8/8 filled (3-D, translucent grey) beside a dome 2/8 filled (illustrative).

## s37_present_weather
The present weather symbols are a little picture language. Dots are rain, commas are drizzle, and stars are snow. A triangle under a dot is a shower, three horizontal lines are fog, and a sign like a letter R with an arrow for a tail is a thunderstorm. More dots mean heavier rain, and dots side by side mean it's raining without a break. Here they are at real stations at the same moment: light snow at La Grande, in Quebec; fog at Fairbanks; light drizzle in central Sweden; and a thunderstorm with rain at Santo Domingo.

> 97 words · 5 sentences · 1335.100–1374.150 s (39.1 s) · 22:15.10–22:54.15 (measured) · beat: building blocks · present-weather symbols on real stations · NEW in v2
> Screen: Maths zone: the WMO ww glyphs drawn in house SVG (MetPy wx_symbols font as the reference shapes, BSD-3), each on its word: dot (rain), comma (drizzle), star (snow), dot over triangle (shower), three bars (fog), thunderstorm glyph; then intensity: 1, 2, 3, 4 dots and side-by-side vs stacked. Picture zone: Globe3D flies in four hops (Quebec -> Alaska -> Sweden -> Caribbean, continuity) to four real station models built from their METARs (CYAH -SN M01/M03; PAFB FG 01/01; ESKS -DZ 09/09; MDJB TSRA 23/22), each with its glyph glowing. Source line 'Data: Iowa Environmental Mesonet (METARs) · 27 Oct 

## s38_barb_rules
Now the wind barb. Its staff points towards where the wind comes from, just as winds are named by where they come from. Feathers on the far end give the speed in knots: a short feather five, a long feather ten, and a filled triangle, called a pennant, fifty. The speed is rounded to the nearest five knots, and a calm is drawn as a circle round the station.

> 69 words · 4 sentences · 1374.150–1399.900 s (25.8 s) · 22:54.15–23:19.90 (measured) · beat: building blocks · how a barb works · reuses v1 s29_barb_rules
> Screen: one big barb (station circle, staff to the west): labels 'staff → from', 'short = 5 kt', 'long = 10 kt', 'pennant = 50 kt', 'calm' (circle)

## s39_barb_examples
Let's read some. A staff pointing south-west with one long and one short feather is a south-westerly of fifteen knots. Brest's thirty-nine knots from the west rounds to forty: four long feathers on a staff pointing west. And the fastest wind in this video, high above the Atlantic, was eighty-three metres per second. Dividing by zero point five one four metres per second per knot gives about one hundred and sixty-one knots, which rounds to one hundred and sixty. [beat] So we draw three pennants and one long feather. [beat]

> 88 words · 6 sentences · 1399.900–1440.375 s (40.5 s) · 23:19.90–24:00.38 (measured) · beat: building blocks · reading barbs (15 kt, Brest 39 kt, the 161-kt jet) · reuses v1 s30_barb_examples
> Screen: barb A: SW staff, 1 long + 1 short '15 kt'; CalcStack 68.7 ÷ 0.514 ≈ 134 kt → 135 kt = 50 + 50 + 10 + 10 + 10 + 5; barb B drawn feather by feather

## s40_pressure_code
The plotted pressure is squeezed: the station model drops the leading nine or ten and the decimal point. To decode it, put a nine or a ten in front, whichever gives a value nearer one thousand, and put the point before the last digit. So Brest's six nine six is nine hundred and sixty-nine point six hectopascals. [beat] And Fairbanks's three two nine is one thousand and thirty-two point nine, because that's much nearer one thousand than nine hundred and thirty-two point nine. [beat]

> 82 words · 4 sentences · 1440.375–1475.900 s (35.5 s) · 24:00.38–24:35.90 (measured) · beat: building blocks · decoding the plotted pressure · reuses v1 s35_pressure_code
> Screen: '696' upper right; decode: '9|69.6' vs '10|69.6' → 969.6 hPa (nearer 1000) ✓; '+55' lower right → '+5.5 hPa in 3 h'; tendency glyph '_/'

## s41_tendency_glyphs
Next to the tendency number is a tiny graph of the pressure over the last three hours: rising then levelling off, falling, dipping then rising, and so on, nine shapes numbered zero to eight. At Brest at six in the evening, it was code eight, steady or rising then falling, with minus one zero three, a fall of ten point three hectopascals. [beat] At three in the morning, it was code three, falling or steady then rising, with plus five five. [beat]

> 80 words · 3 sentences · 1475.900–1509.125 s (33.2 s) · 24:35.90–25:09.12 (measured) · beat: building blocks · the tendency symbol · NEW in v2
> Screen: Maths zone: the nine WMO code-0200 tendency glyphs in a row, each with its number 0-8 (52 px) and a tiny real-ish 3-h trace drawn beside each as the voice says 'rising then levelling off' (1), 'falling' (7), 'dip then rise' (5). S3: glyph 8 flies to the 18 UTC Brest model with '-103'; S4: glyph 3 to the 03 UTC model with '+55'. Under each, the real 3-hourly ERA5 msl at Brest drawn as a mini line (slate) confirming the shape.

## s42_two_plots
Now let's keep the station and change only the time. Here's Brest's full station model at three in the morning, beside the one nine hours earlier. Then, the wind came from the south-east at eighteen knots, two long feathers; the pressure was nine hundred and eighty-three point three and falling fast; and four dots meant heavy rain. Side by side, they tell the storm's story: falling pressure and a south-easterly ahead of it, then rising pressure and a westerly behind it.

> 81 words · 4 sentences · 1509.125–1542.450 s (33.3 s) · 25:09.12–25:42.45 (measured) · beat: contrast · the same station, nine hours apart · reuses v1 s36_two_plots
> Screen: two station models side by side: '18 UTC 1 Nov' (wind 150° 18 kt → 20, '103', '833', 10.3/9.8, heavy rain 4 dots, falling glyph) and '03 UTC 2 Nov' (s34 model); keywords 'ahead: falling · south-easterly', 'behind: rising · westerly'

## s43_station_map
A forecaster sees hundreds of these at once. Here are the real station reports around the English Channel at three in the morning on the second of November. Before computers, isobars were drawn by hand from these numbers: between a station at nine hundred and sixty-six and one at nine hundred and seventy-four, the nine hundred and seventy isobar passes about halfway. Join such points, the method from the movie on how contour maps are made, and the isobars appear, within about a hectopascal of the reanalysis.

> 87 words · 4 sentences · 1542.450–1579.025 s (36.6 s) · 25:42.45–26:19.03 (measured) · beat: intuition · drawing isobars from stations · reuses v1 s37_station_map
> Screen: LCC map 45-55 N, 10 W-5 E: ~20 real station models (thinned for legibility); a gold segment between two stations '966' and '974' with a midpoint dot '970'; isobars drawing through the midpoints; ERA5 isobars fade in (slate) on top; '≈ 1 hPa'

## s44_upper_air
Weather near the ground is steered by the air higher up, so forecasters also draw maps of the air aloft, in the surprising way we met in the pressure coordinates movie: instead of the pressure at one height, they show the height of one pressure. The most famous is the five hundred hectopascal map. About half of all the air lies below five and a half kilometres, so that surface floats at about that height.

> 75 words · 3 sentences · 1579.025–1606.425 s (27.4 s) · 26:19.03–26:46.42 (measured) · beat: building blocks · maps of the air aloft · reuses v1 s24_upper_air
> Screen: 3-D column over the map: a horizontal plate at 5.5 km 'height fixed' vs a bumpy sheet '500 hPa'; '½ of the air below'

## s45_500_3d
Here's that surface over Ciarán at midday on the second of November, with its hills and valleys drawn five hundred times taller than they really are. Over the storm it dips to about five thousand one hundred metres, and over the warm subtropics to the south-west it rises to nearly six thousand. This height is called the geopotential height: very nearly the height above sea level. Height lines are drawn every sixty metres and labelled in decametres, tens of metres, so five hundred and sixteen means five thousand one hundred and sixty metres.

> 93 words · 4 sentences · 1606.425–1644.000 s (37.6 s) · 26:46.42–27:24.00 (measured) · beat: intuition · the 500 hPa surface over Ciarán · reuses v1 s25_500_3d
> Screen: 3-D heightfield of z500 (×500) over the tilted map, coloured by height; '≈ 5100 m' at the dip, '≈ 6000 m' south-west; contours every 60 m on the sheet project down onto the map; label '516' → '5160 m'

## s46_why_dips
Why does it dip over the storm? Remember the scale height, R T over g: in colder air it's smaller, so the pressure falls faster with height. Take two columns with a thousand hectopascals at the ground, and pretend each has the same temperature all the way up. The pressure halves at the scale height times the natural log of two. At two hundred and fifty kelvin, that's about five thousand and seventy metres. [beat] At two hundred and seventy kelvin, it's about five thousand four hundred and eighty. [beat] So under a cold column, the five hundred hectopascal surface sits about four hundred metres lower, and a low at the ground, like Ciarán, starts lower still.

> 115 words · 7 sentences · 1644.000–1692.850 s (48.8 s) · 27:24.00–28:12.85 (measured) · beat: why · cold columns are shorter · reuses v1 s26_why_dips
> Screen: two 3-D columns (slate cold, orange warm) from 1000 hPa; z₅₀₀ = (R T̄/g) ln(1000/500); CalcStack 287 × 250 / 9.81 × ln 2 ≈ 5070 m; 287 × 270 / 9.81 × ln 2 ≈ 5480 m; bracket '≈ 400 m'

## s47_levels
Forecasters use a set of standard levels, which had their own movie. In the standard atmosphere, eight hundred and fifty hectopascals is about one and a half kilometres up, seven hundred about three, five hundred about five and a half, three hundred about nine, and two hundred and fifty about ten point four. Eight fifty, just above the friction near the ground, shows the air masses and fronts. Five hundred shows the big waves that steer storms. And two fifty, near the top of the troposphere, shows the jet streams. Isentropic maps, drawn on surfaces of constant potential temperature, had their own movie too.

> 104 words · 6 sentences · 1692.850–1736.775 s (43.9 s) · 28:12.85–28:56.78 (measured) · beat: building blocks · the standard levels and what each shows · NEW in v2
> Screen: Full width 3-D: a tall column over the Ciaran map with five translucent ERA5 pressure surfaces at 850/700/500/300/250 hPa (real heights from the 12 UTC 2 Nov ten-level file, vertical exaggeration x60 said nowhere; manifest), each label billboarded at the right ('850 hPa ~ 1.5 km' …) appearing on its number. S3-S5: the 850 sheet tints by temperature (colour bar deg C), the 500 sheet by height, the 250 sheet shows isotachs; keywords 'air masses · fronts', 'waves', 'jets'. Source line 'Data: ERA5 (Copernicus C3S/ECMWF) · 2 Nov 2023, 12 UTC'.

## s48_850_chart
Here's the eight hundred and fifty hectopascal chart for Ciarán at midday on the second of November. The colours show the temperature, and the thin lines are isotherms every two degrees. Behind the cold front, the air over Brest has cooled to about one degree at this level, while over north-western Italy it's still about ten, and the warmest air, about fourteen degrees, lies over eastern Spain. [beat] Where the isotherms crowd together, there's a front.

> 75 words · 4 sentences · 1736.775–1769.800 s (33.0 s) · 28:56.78–29:29.80 (measured) · beat: building blocks · the 850 hPa chart: air masses · NEW in v2
> Screen: Full width LCC (40/60): ERA5 850-hPa temperature field (perceptual diverging map centred 0 deg C, colour bar -10...+14 deg C, 52 px), isotherms every 2 deg C (thin, labelled), 850-hPa height contours every 30 m (white 60 %), barbs at 850 (sparse). Probes on their words: Brest '0.8', Genoa '10.1', 'max 13.7' near 40.25 N 0.25 E. S5: the objective 850-hPa front (diag.fronts.front_lines) drawn where isotherms crowd. Source line 'Data: ERA5 (Copernicus C3S/ECMWF) · 2 Nov 2023, 12 UTC · 850 hPa'.

## s49_temp_advection
When the wind blows across the isotherms, it carries warmer or colder air with it. That's temperature advection, the dot product from the dot product movie: minus the wind dot the temperature gradient. Over the south of France, the wind here blows at about eighteen and a half metres per second from the west-north-west, straight across isotherms where the temperature changes by about five point two degrees every hundred kilometres. Eighteen and a half, times five point two over one hundred thousand, times three thousand six hundred seconds in an hour, is about three and a half degrees per hour of cooling. [beat] Wind blowing from cold air towards warm is called cold advection, and from warm towards cold, warm advection.

> 120 words · 5 sentences · 1769.800–1820.025 s (50.2 s) · 29:29.80–30:20.03 (measured) · beat: why · temperature advection, a worked number · NEW in v2
> Screen: Picture zone: zoom on the 850 chart at 43.5 N 3 E: teal wind arrow from 292 deg, orange grad-T arrow, isotherms (labels), the angle ~180 deg marked; Band highlights the 100-km ruler across '5.2 deg C'. Maths zone: -v . grad T (96 px) with underbraces 'wind', 'temperature gradient'; CalcStack '18.5 m/s x 5.2e-5 K/m ~ 9.6e-4 K/s', 'x 3600 s/h ~ 3.5 K/h' (m struck, s struck). S5: the whole map re-tints to the advection field (rose = cooling, orange = warming, colour bar -4...+4 K/h, 52 px). Source line 'Data: ERA5 · 2 Nov 2023, 12 UTC · 850 hPa · 43.5 N 3 E'.

## s50_500_shapes
Back on the five hundred hectopascal map, the lines make long waves around the planet: a dip towards the equator is a trough, and a bulge towards the pole is a ridge. Ciarán sits under a deep trough reaching down past Portugal. The winds up here blow almost exactly along the height lines, with the low heights on their left, fastest where the lines are packed: about sixty-nine metres per second west of Portugal.

> 74 words · 3 sentences · 1820.025–1848.825 s (28.8 s) · 30:20.03–30:48.83 (measured) · beat: intuition · troughs, ridges and winds aloft · reuses v1 s27_upper_shapes
> Screen: 500-hPa chart (contours every 60 m) with the trough axis (orange dashed) from the North Sea to Spain and a ridge axis to the west; ERA5 500-hPa streaklines along the contours; '69 m/s' west of Portugal; inset hemispheric polar-stereographic 500-hPa map showing the waves

## s51_trough_axis
How is that trough line found? Along each line of latitude, find where the smoothed heights are lowest, then join those points from one latitude to the next. South of about forty-eight and a half degrees north, the axis runs between five and seven degrees west, off Portugal and Spain. Further north it bends east, to a closed ring of height lines over the North Sea, the lowest point on the map, at about five thousand one hundred and fourteen metres. [beat] A low wrapped in its own closed contours like this is called a cut-off low, and it can sit and spin for days.

> 104 words · 5 sentences · 1848.825–1889.500 s (40.7 s) · 30:48.83–31:29.50 (measured) · beat: why · how a trough axis is found · NEW in v2
> Screen: Picture zone: the smoothed z500 field; a scanning gold horizontal line steps from 40 N to 55 N; at each row a small dot marks the lowest height (zonal minimum), the dots chain into the orange dashed axis; a mini profile at the right shows z500 along one latitude row with its minimum. S4-S5: readouts '5-7 deg W south of 48.5 N', 'bends east to ~0 deg'. Source line 'Data: ERA5 · 2 Nov 2023, 12 UTC · 500 hPa'. S4-S5 (the draft cut-off-low scene folded in): camera tilts into the 3-D z500 sheet (x500) over the North Sea; the closed 5160 and 5220 m contours glow gold; 'min 5114 m'; keyword 'cut-off 

## s52_jet
Now let's climb to two hundred and fifty hectopascals, about ten kilometres up. This chart shows isotachs, lines of equal wind speed, shaded where the wind is strongest. On the second of November, twenty twenty-three, a jet stream roared across the Atlantic towards Ciarán, its core reaching about eighty-three metres per second, far west of France. That's about one hundred and sixty-one knots, or about three hundred kilometres per hour. [beat] A stretch of the fastest wind inside a jet is called a jet streak.

> 84 words · 5 sentences · 1889.500–1927.825 s (38.3 s) · 31:29.50–32:07.83 (measured) · beat: building blocks · the 250 hPa jet and isotachs · NEW in v2
> Screen: Full width LCC: ERA5 250-hPa wind speed shaded from 30 m/s (sequential map, colour bar 30-85 m/s, 52 px), isotachs every 10 m/s (thin), streaklines along the jet (data animation, time-compressed, manifest), 250-hPa heights every 120 m (white 50 %). S4: gold probe on the maximum at 46.75 N 19.5 W '83 m/s'; CalcStack '83 / 0.514 ~ 161 kt', '83 x 3.6 ~ 300 km/h'. S5: the jet streak outlined (the 70-m/s isotach) gold. Source line 'Data: ERA5 (Copernicus C3S/ECMWF) · 2 Nov 2023, 12 UTC · 250 hPa'.

## s53_thickness
Forecasters also subtract one height map from another. The height of the five hundred hectopascal surface minus that of the one thousand hectopascal surface is the thickness of the layer. By the same rule, it's the layer's scale height times the natural log of two, so it depends only on the layer's average temperature. At Brest at midday, the thickness was about five thousand three hundred and seventy metres. [beat] Turned round, that's an average of about two hundred and sixty-five kelvin, or minus eight degrees, through the lowest five and a half kilometres. [beat]

> 93 words · 5 sentences · 1927.825–1969.325 s (41.5 s) · 32:07.83–32:49.33 (measured) · beat: why · thickness tells the mean temperature · NEW in v2
> Screen: Picture zone: 3-D: the 1000-hPa and 500-hPa sheets over the map (x60), the slab between them at Brest highlighted as a translucent column with a bracket '5371 m'; maths zone: Delta z = (R T-bar / g) ln(1000/500) (96 px) then the inverse T-bar = g Delta z / (R ln 2) with CalcStack '9.81 x 5371 / (287 x 0.693) ~ 265 K ~ -8 deg C'. Then the thickness map (contours every 60 m, labelled in dam: '534', '540'). Source line 'Data: ERA5 · 2 Nov 2023, 12 UTC · 1000-500 hPa'.

## s54_rain_snow
Thickness is a quick guide to rain or snow: a small thickness means a cold layer, so snow is more likely to reach the ground. North American forecasters watch the five thousand four hundred metre line, and in Britain, where the sea keeps the lowest air milder, about five thousand two hundred and eighty. It's only a rule of thumb. Under Ciarán, the thickness at Brest was below five thousand four hundred, yet it rained, at about nine degrees, because the lowest air over the warm sea was far too mild for snow. [beat] On the latest chart, at La Grande, in Quebec, the thickness was well below five thousand four hundred, and it was snowing lightly at minus one degree. [beat]

> 120 words · 5 sentences · 1969.325–2018.300 s (49.0 s) · 32:49.33–33:38.30 (measured) · beat: application · thickness and the rain-snow line (with a trap) · NEW in v2
> Screen: Picture zone, two maps: (1) Ciaran thickness 12 UTC 2 Nov with the 5400 (gold) and 5280 (slate) lines and the Brest station model (rain, 9.2 deg C); (2) the GFS 18 UTC 27 Oct 2026 thickness over eastern Canada with the 5400 line and the CYAH METAR station model (-SN, M01). Keywords 'rule of thumb', '5400 m (North America)', '5280 m (Britain)'. Source lines 'Data: ERA5 · 2 Nov 2023, 12 UTC' / 'Data: NCEP GFS · IEM METAR · 27 Oct 2026, 18 UTC'.

## s55_skewt
Forecasters also read weather balloon soundings. A radiosonde hung under a balloon measures the temperature, the humidity and the wind as it rises, plotted on the skew T log P diagram we built in its own movie. Here's Trappes, near Paris, launched just before midnight universal time on the first of November, twenty twenty-three, ahead of Ciarán's cold front. The orange line is the temperature, and the teal line the dew point. From the ground to about five hundred and fifty hectopascals, they lie on top of each other, so the air is saturated: one deep layer of cloud, from which rain was falling.

> 104 words · 5 sentences · 2018.300–2061.250 s (43.0 s) · 33:38.30–34:21.25 (measured) · beat: building blocks · reading a balloon sounding (Trappes) · NEW in v2
> Screen: Full width skew-T log-p (house SVG; isotherms skewed 45 deg, slate; dry adiabats faint): Trappes 00 UTC 2 Nov 2023 IGRA2 temperature (orange 10 px) and dew point (teal 10 px) draw upward from 969 hPa as the balloon icon rises; S3: one isotherm highlighted slanting; S6: the saturated band 964-554 hPa shaded gold (dew-point depression <= 0.4 deg C) with keyword 'saturated: cloud'. Barbs on the right edge. Source line 'Data: NOAA NCEI IGRA2 (radiosonde) · Trappes · 1 Nov 2023, 23:15 UTC launch (nominal 2 Nov 00 UTC)'.

## s56_skewt_more
The temperature crosses zero at about two point one kilometres: the freezing level, above which the cloud holds ice and snow that melt into rain on the way down. Near two hundred and fifty hectopascals, about ten kilometres up, the temperature stops falling, at about minus fifty-seven degrees: that's the tropopause. [beat] And the barbs show the wind turning from southerly to south-westerly and strengthening with height, from about twenty-one metres per second to about forty-nine. [beat]

> 75 words · 3 sentences · 2061.250–2096.550 s (35.3 s) · 34:21.25–34:56.55 (measured) · beat: building blocks · freezing level, tropopause and winds on the sounding · NEW in v2
> Screen: Same skew-T: S1 the 0 deg C isotherm gold, crossing marker '~ 2.1 km' (interpolated between 850 hPa 3.4 deg C at 1247 m and 700 hPa -2.5 deg C at 2805 m); S3 tropopause marker at 250 hPa '-57 deg C · 10.2 km' (WMO lapse-rate rule); S4 the barb column brightens bottom to top: 925 hPa 180 deg 21 m/s ... 250 hPa 235 deg 49 m/s. Source line as s67.

## s57_orbits
Fronts and lows also show up from space, seen by two kinds of satellite. A geostationary satellite sits about thirty-six thousand kilometres above the equator and circles once a day, as fast as the Earth spins, so it stares at the same part of the globe, taking a full picture every ten minutes. A polar-orbiting satellite flies about seven hundred kilometres up, over the poles, seeing a strip of the Earth in finer detail on each pass, only a couple of times a day at any one place.

> 88 words · 3 sentences · 2096.550–2130.300 s (33.8 s) · 34:56.55–35:30.30 (measured) · beat: building blocks · two kinds of weather satellite · NEW in v2
> Screen: Full width 3-D: Globe3D (Blue Marble) at true relative scale with a geostationary satellite glyph at 35 786 km over 75.2 W (GOES-19), orbit ring, a cone of view onto its disk; the satellite and the Earth turn together (one turn = one day, time compressed, manifest). S3: a polar orbit at ~705 km (Aqua) sweeping a gold swath strip across Europe. Keywords 'geostationary: ~ 36 000 km, every 10 min', 'polar orbit: ~ 700 km, a strip per pass'.

## s58_visible
A visible image is like a photograph: sunlight bounced back by the clouds and the ground. Thick clouds, snow and ice are bright, and the sea is dark. Here's Ciarán on the second of November, twenty twenty-three, from a polar-orbiting satellite passing overhead early in the afternoon. Visible images need sunlight, so at night they're black.

> 56 words · 4 sentences · 2130.300–2155.100 s (24.8 s) · 35:30.30–35:55.10 (measured) · beat: building blocks · visible images · reuses v1 s43_visible
> Screen: MODIS Aqua true colour of Ciarán, 2 Nov 2023 (LCC, white coast lines, dark halo); keywords 'visible = reflected sunlight', 'bright: thick cloud, snow, ice', 'dark: sea'; a day/night terminator sweeping over a small globe inset

## s59_infrared
An infrared image shows something else. Everything gives off infrared light, more when it's warmer, so the satellite can measure how warm the top of whatever it sees is, by day and by night. By custom, cold is drawn white and warm dark, so high, cold cloud tops stand out. In the same pass in infrared, the thick cloud bands of Ciarán's fronts are the brightest, coldest parts.

> 68 words · 4 sentences · 2155.100–2183.225 s (28.1 s) · 35:55.10–36:23.22 (measured) · beat: building blocks · infrared images · reuses v1 s44_infrared
> Screen: wipe from visible to infrared (same pass, MODIS Aqua band 31, 11 µm) in grey, cold = white; grey colour bar '−60 … +15 °C' (52 px); keywords 'infrared = emitted heat', 'cold → white', 'day and night'

## s60_cloud_top
How high are those tops? Our goal is a height, from a temperature. The coldest tops are about minus fifty degrees, and the sea below is about twelve. In the troposphere, the temperature falls by about six and a half degrees per kilometre, so sixty-two degrees divided by six and a half is about nine and a half kilometres. [beat]

> 59 words · 4 sentences · 2183.225–2207.425 s (24.2 s) · 36:23.22–36:47.43 (measured) · beat: why · how high are the cloud tops · reuses v1 s45_cloud_top
> Screen: IR image with two probes: cloud top '−50 °C' (gold), sea '+12 °C'; CalcStack (12 − (−50)) ÷ 6.5 °C/km ≈ 9.5 km; side bar: height scale with the tropopause line

## s61_water_vapour
A third kind of image uses infrared light that water vapour itself absorbs and gives off. A water vapour image sees the moisture in the middle and upper troposphere, even where there's no cloud: moist air is bright, and dry air, which has usually sunk from high up, is dark. Here's the North Atlantic storm of the twenty-seventh of October, twenty twenty-six, from the geostationary satellite GOES nineteen, with a dark tongue of dry air curling into it.

> 78 words · 3 sentences · 2207.425–2239.675 s (32.2 s) · 36:47.43–37:19.68 (measured) · beat: building blocks · water-vapour images · reuses v1 s46_water_vapour
> Screen: GOES-East water-vapour image (6.2 µm, band 8), 18 UTC 27 Oct 2026, North Atlantic, grey (moist bright, dry dark); keywords 'water vapour', 'moist → bright', 'dry → dark'; a small orbit sketch 'geostationary: one turn a day above the equator'

## s62_reading_features
Let's read the shapes. A mature low wraps its cloud into a comma, with the head over the centre and the tail trailing along the cold front, and the North Atlantic low on our latest chart has exactly that shape. Along much of the cold-front band, the tops are colder than minus thirty degrees. [beat] On the water vapour image, a dark dry slot curls in behind the cold front towards the centre: dry air sinking from high up, often where the storm is strongest.

> 84 words · 4 sentences · 2239.675–2273.175 s (33.5 s) · 37:19.68–37:53.18 (measured) · beat: intuition · reading cloud shapes: comma, cold-front band, dry slot · NEW in v2
> Screen: Full width: GOES-19 18:00 UTC 27 Oct 2026 IR (band 13, grey, colour bar deg C) with the WPC fronts of the 982 low over it (thin); S2 a gold comma outline traced over the cloud (head at 43 N 43 W, tail SW); S3 'cold-front band' gold bracket; S4 the band pixels colder than 240 K tinted gold-white (colour bar notch at -33 deg C); S5-S6 swipe to band 8 water vapour: the dry slot (> 245 K) outlined, keyword 'dry slot'. Source line 'Data: NOAA GOES-19 ABI via Google Earth Engine · Analysis: NOAA NWS WPC · 27 Oct 2026, 18:00 UTC'.

## s63_typhoon
Infrared also shows how tall tropical storms are. Here's the typhoon in the western Pacific at midnight universal time on the twenty-seventh of October, seen by Himawari. In its small eye, the satellite sees almost down to the warm sea, at around twenty-seven degrees, while the cloud tops around it are as cold as about minus seventy-six. [beat] A hundred and three degrees, at six and a half per kilometre, means tops about sixteen kilometres up, because the tropical troposphere is much deeper. [beat]

> 82 words · 4 sentences · 2273.175–2310.625 s (37.4 s) · 37:53.18–38:30.62 (measured) · beat: application · a typhoon's eye and its deep cloud tops (Himawari) · NEW in v2
> Screen: Globe3D (continuity from s23's Himawari view) zooms to 14.5 N 162.5 E: Himawari-9 band 13 BT in grey (colour bar -80...+30 deg C, 52 px); probes 'eye ~ +27 deg C' and 'tops ~ -76 deg C'; CalcStack '(27 - (-76)) / 6.5 ~ 16 km'. Source line 'Data: JMA Himawari-9 AHI band 13 via NASA GIBS · 27 Oct 2026, 00:00 UTC'.

## s64_radar_how
Satellites see the tops of clouds. To see the rain itself, forecasters use weather radar. A radar dish sends out short pulses of microwaves and listens for echoes from raindrops, snowflakes and hail; it sees precipitation, not cloud. The pulse travels at the speed of light, out and back again, so an echo that returns after one thousandth of a second comes from about one hundred and fifty kilometres away. [beat] Turning the dish round and round builds up a map of the rain.

> 83 words · 5 sentences · 2310.625–2347.175 s (36.6 s) · 38:30.62–39:07.18 (measured) · beat: building blocks · how weather radar works · NEW in v2
> Screen: Picture zone 3-D: a radar dome on a hill (illustrative) with a pulse (gold ring segment) travelling out to a rain shaft and an echo travelling back; a clock glyph 't = 1 ms'. Maths zone: r = c Delta t / 2 (84 px) with underbraces 'speed of light', 'there and back'; CalcStack '3 x 10^8 m/s x 10^-3 s / 2 = 150 km'. S5: the beam sweeps 360 deg, painting a ring of echoes (decorative).

## s65_dbz
The strength of the echo is called the reflectivity, capital Z. A drop's echo grows with its diameter to the sixth power, so Z spans many powers of ten, and radar uses a logarithmic scale in decibels, called d B Z: ten times the log, base ten, of Z. Every ten more d B Z is ten times stronger. [beat] A rough rule found by Marshall and Palmer in nineteen forty-eight links it to rainfall: Z equals two hundred times the rain rate to the power one point six. So twenty d B Z is light rain, about two thirds of a millimetre per hour; forty is heavy rain, about eleven and a half; and fifty is a downpour of nearly fifty millimetres per hour. [beat]

> 124 words · 5 sentences · 2347.175–2397.550 s (50.4 s) · 39:07.18–39:57.55 (measured) · beat: building blocks · reflectivity, decibels and rain rate · NEW in v2
> Screen: Maths zone: dBZ = 10 log10 Z (84 px; Z in mm^6 m^-3, underbrace 'drop diameter to the sixth power'); a log ladder 10 -> 100 -> 1000 -> 10 000 with '10 dBZ, 20, 30, 40'; then Z = 200 R^1.6 (84 px) and CalcStack 'R = (Z / 200)^(1/1.6)': '20 dBZ: (100/200)^0.625 ~ 0.65 mm/h', '40 dBZ: (10^4/200)^0.625 ~ 11.5 mm/h', '50 dBZ: ~ 49 mm/h'. Picture zone: the house radar colour bar (perceptual, 5-dBZ steps, 52 px) with the three rain rates pinned on it; drops of three sizes (illustrative).

## s66_radar_latest
Here's the American radar mosaic at eighteen hundred universal time on the twenty-seventh of October. Under the big high, there are few echoes near the east coast. The largest area of rain is over Minnesota, Wisconsin and Iowa, just where the METARs were reporting rain, including heavy rain on an island in Lake Superior. [beat] Radar and stations agree: that's exactly the cross-check a forecaster makes.

> 65 words · 4 sentences · 2397.550–2429.125 s (31.6 s) · 39:57.55–40:29.12 (measured) · beat: application · the radar mosaic at the latest chart's moment · NEW in v2
> Screen: Full width LCC (US): IEM NEXRAD n0q composite reflectivity 18:00 UTC 27 Oct 2026 (house radar colour bar 5-65 dBZ, 52 px; < 5 dBZ transparent) over a dark land base with state lines; WPC H/L and fronts faint; S3: METAR rain glyphs (RA, -RA, +RA) at their stations over the upper Midwest pulse in; gold ring on K4R5 (Madeline Island, +RA). Source line 'Data: NOAA NWS NEXRAD mosaic via Iowa Environmental Mesonet · IEM METARs · 27 Oct 2026, 18:00 UTC'.

## s67_radar_squall
And here's the squall line we promised: the storms that crossed Iowa on the tenth of August, twenty twenty, a derecho, which is a long-lived windstorm driven by a line of thunderstorms. On radar, it's a bow-shaped line of echoes stronger than fifty d B Z, racing east, with lighter rain trailing behind. Its winds flattened crops and trees across the state, and it became the costliest thunderstorm event in American records. [beat]

> 72 words · 3 sentences · 2429.125–2460.850 s (31.7 s) · 40:29.12–41:00.85 (measured) · beat: application · a squall line on radar (the 2020 derecho) · NEW in v2
> Screen: Full width LCC (Midwest): IEM n0q composites 15-19 UTC 10 Aug 2020, hourly, cross-faded with a clock (data animation, time compressed, manifest); the > 50 dBZ cores gold-outlined; the squall-line symbol (dash, dot, dot) drawn along the leading edge as the line moves; Des Moines and Cedar Rapids dots. Colour bar 5-65 dBZ. Source line 'Data: NOAA NWS NEXRAD mosaic via Iowa Environmental Mesonet · 10 Aug 2020, 15-19 UTC · Iowa'.

## s68_models
Every chart so far showed the present or the past. Forecast charts come from numerical weather prediction models: computer programs that solve the equations of motion for the whole atmosphere, step by step in time. The starting state, the analysis, is made by blending millions of observations with the previous forecast, a step called data assimilation. Then the model runs forward, writing a chart every few hours.

> 67 words · 4 sentences · 2460.850–2491.200 s (30.3 s) · 41:00.85–41:31.20 (measured) · beat: building blocks · analysis, data assimilation and forecast models · NEW in v2
> Screen: Full width: a globe wrapped in a coarse model grid (0.25 deg cells shown at 4 deg for legibility, manifest) with stations, balloons and satellites (dots from s36, s67, s69) flowing into it ('observations'), a slate arrow 'previous forecast', merging into 'analysis'; then a clock runs T+0 -> T+24 -> T+72 while the GFS MSLP field steps forward on the globe (real forecast frames from N3). Keywords 'data assimilation', 'model'. Source line 'Data: NOAA NCEP GFS · run 24 Oct 2026, 18 UTC'.

## s69_forecast_runs
Let's watch a forecast come true. Here are four charts of the North Atlantic, all valid at eighteen hundred universal time on the twenty-seventh of October, from the American GFS model. The first started five days earlier, the second three days earlier, the third one day earlier, and the last is the analysis itself. The time between a forecast's start and the time it's valid for is called the lead time: here five days, three days, one day and zero.

> 80 words · 4 sentences · 2491.200–2524.450 s (33.2 s) · 41:31.20–42:04.45 (measured) · beat: application · four charts, one valid time; lead time defined · CHANGED in v3 (lead time defined)
> Screen: Full width: four LCC panels in a row (same frame as s85), MSLP isobars every 4 hPa, each with two stamps (initial, valid) and a forecast-hour tag 'T+120', 'T+72', 'T+24', 'T+0' (54 px) appearing on their words; the analysed L position marked faintly in all four. Source line 'Data: NOAA NCEP GFS · runs 22, 24, 26, 27 Oct 2026 · valid 27 Oct 2026, 18 UTC'.
> Numbers are planning values to be re-asserted: CHECK RM80 (data_needs §D2; if a check fails the sentence is re-worded to the data and re-measured).

## s70_forecast_verify
Five days ahead, the model had the Atlantic low at about one thousand and one hectopascals, nearly five hundred kilometres south-west of where it actually was. [beat] Three days ahead, it had it at about nine hundred and ninety-three, two hundred kilometres away. One day ahead, nine hundred and eighty-five, only sixty kilometres off. And the analysis put it at nine hundred and eighty-two. [beat] So forecasts get sharper as the valid time comes closer, and a forecast five days ahead is a sketch, not a promise.

> 85 words · 5 sentences · 2524.450–2563.250 s (38.8 s) · 42:04.45–42:43.25 (measured) · beat: application · how far off each forecast was · NEW in v2
> Screen: The four panels merge into one map: four L markers (slate T+120, slate-lighter T+72, teal T+24, warm white analysis) with gold distance links '~ 480 km', '~ 200 km', '~ 60 km' and their central pressures '1001', '993', '985', '982'; a small TimeGraph at the right: lead time (days) vs position error (km), three dots and a line. Source line as s84.

## s71_precip_panel
Forecast charts often pair the sea-level pressure with the rain or snow expected in the past six hours, shaded with a colour bar in millimetres. In the forecast started a day earlier, the heaviest falls lie along the Atlantic low's cold front and near its centre, under the comma head we saw from space. [beat]

> 54 words · 2 sentences · 2563.250–2585.800 s (22.6 s) · 42:43.25–43:05.80 (measured) · beat: building blocks · the pressure-and-precipitation forecast panel · NEW in v2
> Screen: Full width LCC: GFS T+24 (init 18Z 26 Oct) 6-h accumulated precipitation (sequential blue-green map, colour bar 0.5-40 mm, 52 px) under MSLP isobars every 4 hPa; WPC fronts faint for comparison; S3 gold outline on the max band; the GOES IR comma (s74) ghosts in at 30 % for 2 s. Source line 'Data: NOAA NCEP GFS · run 26 Oct 2026, 18 UTC · T+24 · valid 27 Oct 2026, 18 UTC'.

## s71b_two_models
The GFS isn't the only model. The European Centre for Medium-Range Weather Forecasts runs its own physics model, called the IFS, short for Integrated Forecasting System. Here are the two side by side, both started at eighteen hundred universal time on the twenty-fourth of October, so both have a lead time of three days. The GFS put the Atlantic low about two hundred kilometres from where it turned out to be, at about nine hundred and ninety-three hectopascals, and the European model about ninety kilometres away, at about nine hundred and eighty-six. [beat] Both centres' analyses put it at about nine hundred and eighty-two. When two good models agree, forecasters trust the forecast more, and when they disagree, the disagreement itself warns that the forecast is uncertain.

> 126 words · 6 sentences · 2585.800–2641.825 s (56.0 s) · 43:05.80–44:01.82 (measured) · beat: application · two models, same start, same valid time (GFS vs ECMWF IFS) · NEW in v3 (ECMWF open data)
> Screen: three LCC panels GFS +72 h | IFS +72 h | analysis (both started 18 UTC 24 Oct); L markers '993', '986', '982'; gold distance links '~ 200 km', '~ 90 km'; tags 'GFS', 'IFS', 'start 24 Oct 18 UTC', '+72 h'; isobar overlay with the gold band where the models differ most. Source line 'Data: NOAA NCEP GFS · ECMWF open data (CC BY 4.0) · IFS run 24 Oct 2026 18Z +72 h · valid 27 Oct 2026, 18 UTC'.
> Numbers are planning values to be re-asserted: CHECK RM81, RM96, RM97, RM104 (data_needs §D2; if a check fails the sentence is re-worded to the data and re-measured).

## s71c_map_score
One low is only one spot on the map. To score a whole map, forecasters use the root mean square error. Take the difference between the forecast and the analysis at every grid point, and square each one, so that too high and too low can't cancel. Average the squares, and take the square root. With three points off by one, minus two and two hectopascals, the squares are one, four and four, their average is three, and the square root of three is about one point seven hectopascals. [beat] On a real map, grid points crowd together towards the pole, so each one counts in proportion to the area it covers. Over this North Atlantic map, the three-day forecast missed by about three point one hectopascals for the GFS, and about two point six for the European model. [beat] That's the typical size of the miss, everywhere on the map at once.

> 151 words · 8 sentences · 2641.825–2703.200 s (61.4 s) · 44:01.82–45:03.20 (measured) · beat: building blocks · scoring a whole map: the root mean square error · NEW in v3
> Screen: three grid points with signed difference bars (+1, -2, +2 hPa) and CalcStack '1, 4, 4' -> '(1+4+4)/3 = 3' -> '√3 ≈ 1.7 hPa'; keyword 'root mean square error'; then the GFS and IFS +72 h difference maps (diverging, colour bar 'forecast - analysis (hPa)'), pole-ward cells narrower ('smaller area'), scores '≈ 3.1 hPa' and '≈ 2.6 hPa' with gold links. Source line on the real maps only.
> Numbers are planning values to be re-asserted: CHECK RM98, RM99 (data_needs §D2; if a check fails the sentence is re-worded to the data and re-measured).

## s71d_ai_model
There's now a different kind of model, too. The European Centre also runs the AIFS, a machine-learning model: a computer program that learned how the weather changes by studying past examples. It was trained on decades of past weather from ERA5, the reanalysis we used for Ciarán, and then fine-tuned on the European Centre's recent analyses. It doesn't solve the equations of motion. Instead, it takes the state of the atmosphere and predicts the state six hours later, then repeats that step again and again. It starts from the same analysis as the physics model, so the two can be compared fairly.

> 102 words · 6 sentences · 2703.200–2748.500 s (45.3 s) · 45:03.20–45:48.50 (measured) · beat: building blocks · what a machine-learning weather model is (AIFS), in plain words · NEW in v3
> Screen: decorative diagram: 'AIFS', 'machine learning'; a strip of ERA5 map thumbnails 'decades of past weather' -> 'learn', a short strip 'recent analyses' ('fine-tuned'); the equations icon struck in slate; a '+6 h' loop counting to '+72 h'; one analysis splitting into 'IFS' (teal) and 'AIFS' (violet, dashed).
> Numbers are planning values to be re-asserted: CHECK C20, C21, C22 (data_needs §D2; if a check fails the sentence is re-worded to the data and re-measured).

## s71e_physics_vs_ai
Here are the two European forecasts from the same start, three days ahead: the physics model on the left, the machine-learning model in the middle, and the analysis on the right. The physics model had the low about ninety kilometres away, at about nine hundred and eighty-six hectopascals. The machine-learning model had it about one hundred and twenty kilometres away, at about nine hundred and eighty-eight. [beat] Over the whole map, it missed by about two point eight hectopascals, against two point six for the physics model. [beat] Notice that the machine-learning map is a little smoother, with a less sharp low and more widely spaced isobars around it. On this one forecast, both were useful and neither was exact. One case can't tell us which model is better in general; that takes thousands of forecasts.

> 134 words · 7 sentences · 2748.500–2805.750 s (57.2 s) · 45:48.50–46:45.75 (measured) · beat: application · physics model vs machine-learning model vs the analysis (IFS, AIFS, analysis) · NEW in v3 (ECMWF open data)
> Screen: three LCC panels IFS +72 h ('physics') | AIFS +72 h ('machine learning') | ECMWF analysis; L markers '986', '988' and links '~ 90 km', '~ 120 km'; scores '≈ 2.6 hPa', '≈ 2.8 hPa'; (if RM101) zoom on the two lows, rings counted, keyword 'smoother'; keyword 'one case'. Source line 'Data: ECMWF open data (CC BY 4.0) · IFS/AIFS run 24 Oct 2026 18Z +72 h · valid 27 Oct 2026, 18 UTC'.
> Numbers are planning values to be re-asserted: CHECK RM100, RM101, RM104 (data_needs §D2; if a check fails the sentence is re-worded to the data and re-measured).

## s72_ensembles
So which forecast should we believe? A single forecast can't say how sure it is. Tiny errors in the starting state grow as the model runs, a sensitivity called chaos. So forecast centres run an ensemble: the same model many times, each from a slightly different starting state, with small random nudges to the model's physics. Each of these runs is called a member. The European ensemble has fifty-one members: one control, started from the best analysis, and fifty with small changes. [beat] If twenty of the fifty-one bring a gale to a place, the chance of a gale there is about thirty-nine percent. [beat]

> 103 words · 7 sentences · 2805.750–2852.150 s (46.4 s) · 46:45.75–47:32.15 (measured) · beat: building blocks · ensembles, members and chaos (ECMWF ENS) · CHANGED in v3 (ECMWF ensemble, 51 members)
> Screen: 51 teal member tracks fanning out from one start over a T+0 -> T+126 h clock (real ENS member lows if the 6-hourly steps are fetched, otherwise illustrative); 'member' (one track gold), 'control' (one warm white) and '50'; '51 members'; CalcStack '20 / 51 ≈ 0.39 = 39 %' (thought example).
> Numbers are planning values to be re-asserted: CHECK RM90, RM102 (data_needs §D2; if a check fails the sentence is re-worded to the data and re-measured).

## s73_spaghetti
One way to show an ensemble is a spaghetti plot. From each member, we draw just one height line on the five hundred hectopascal map, here five thousand five hundred and twenty metres, and a dot where that member puts the Atlantic low. These are the fifty-one lines from the European ensemble started at noon universal time on the twenty-second of October, five and a quarter days before our valid time. The bold gold line and the gold ring are the analysis: what actually happened. [beat] Where the strands bunch, the members agree, and where they fan out, the forecast is uncertain. Here the dots are scattered across about a thousand kilometres, and in six members the low hasn't formed at all.

> 121 words · 6 sentences · 2852.150–2901.600 s (49.4 s) · 47:32.15–48:21.60 (measured) · beat: application · a spaghetti plot: the ECMWF ensemble five and a quarter days ahead · REPLACED in v3 (ECMWF spaghetti; was GEFS)
> Screen: 51 ECMWF ENS 5520-m z500 contours (teal 3 px, 55 %), member low dots, '51', '+126 h'; analysis line bold gold with dark casing and gold ring; gold rings where the strands fan out most; bracket '~ 1000 km' across the dots; tally '6 without a low'. Source line 'Data: ECMWF open data (CC BY 4.0) · ENS run 22 Oct 2026 12Z +126 h · valid 27 Oct 2026, 18 UTC · 500 hPa'.
> Numbers are planning values to be re-asserted: CHECK RM90, RM91, RM92, RM104 (data_needs §D2; if a check fails the sentence is re-worded to the data and re-measured).

## s73b_spread_shrinks
Now let's move the start closer. Started on the twenty-fourth, three and a quarter days ahead, the strands draw together. Started on the twenty-sixth, just thirty hours ahead, they lie almost on top of each other, and on the analysis. The spread measures how far the members are from one another: here, the typical distance of each member's low from the members' average position, using the same root mean square recipe. It shrank from about four hundred kilometres, to about two hundred, to about fifty. [beat] The spread of the central pressure shrank from about six hectopascals, to three, to one. [beat] That's the lesson of every ensemble: the closer the valid time, the smaller the spread, and the more a forecast can be trusted.

> 123 words · 7 sentences · 2901.600–2955.125 s (53.5 s) · 48:21.60–49:15.12 (measured) · beat: application · the spread shrinks as the start comes closer (+126 h, +78 h, +30 h) · NEW in v3 (ECMWF open data)
> Screen: cross-fades to ENS +78 h and +30 h (stamps); mean low cross and gold spread circle; three thumbnails + TimeGraph 'lead time (h)' vs 'spread of the low (km)' dots '≈ 400', '≈ 200', '≈ 50' and slate pressure-spread series '≈ 6', '≈ 3', '≈ 1' hPa. Source line per map ('ENS run 24 Oct 2026 12Z +78 h', then '26 Oct 2026 12Z +30 h').
> Numbers are planning values to be re-asserted: CHECK RM90, RM93, RM94, RM95 (data_needs §D2; if a check fails the sentence is re-worded to the data and re-measured).

## s74_case_stack
Now let's put everything together on one storm, the way a forecaster works, from the top down. Here's Ciarán at midday on the second of November, in layers: at two hundred and fifty hectopascals, the jet stream rushing in from the west; at five hundred, the trough and its cut-off low; at eight hundred and fifty, cold air sweeping round the south of the storm; and at the ground, the low itself, at nine hundred and fifty-six hectopascals. The low at five hundred hectopascals now sits almost exactly above the low at the ground, only about thirty-four kilometres apart. [beat] A storm stacked like this has stopped deepening, and indeed Ciarán's central pressure had been rising since its lowest, about nine hundred and fifty-four, early that morning.

> 126 words · 4 sentences · 2955.125–3006.975 s (51.8 s) · 49:15.12–50:06.97 (measured) · beat: application · Ciaran through every chart (top-down, 3-D stack) · NEW in v2
> Screen: S1 (the draft workflow scene folded in): a vertical strip of thumbnails from this movie (MODIS IR, 250-hPa jet, 500-hPa trough, 850 chart, surface analysis) stacks top-down, then dissolves into the 3-D stack. Full width 3-D: four ERA5 layers at 12 UTC 2 Nov 2023 stacked (x60 heights, manifest), each with its own colour bar on its word: 250 isotachs (sequential), 500 heights (contours), 850 temperature (diverging), surface MSLP isobars over the Blue Marble/coast. The camera orbits slowly; S6: a gold vertical line joins the 500-hPa minimum (52.5 N 1.25 E) and the surface low (52.5 N 1.75 E) with

## s75_case_impacts
What did all those packed isobars mean for people? At Brest, the gust of eighty-four knots was about one hundred and fifty-six kilometres per hour, and other stations on the Brittany coast measured even stronger gusts, such as about one hundred and seventy kilometres per hour at Lanvéoc, across the bay from Brest. About one point two million homes in France lost power.

> 63 words · 3 sentences · 3006.975–3033.025 s (26.1 s) · 50:06.97–50:33.03 (measured) · beat: application · what the charts meant on the ground · reuses v1 s57_chart_context
> Screen: two letters side by side: 'L 961' (27 Oct 2026) and 'L 954' (Ciarán, 2 Nov 2023); Brest station model with a gust glyph '84 kt ≈ 156 km/h'; '≈ 1.2 million homes without power'

## s76_latest_intro
Now back to the chart we started with. It's the surface analysis drawn by the forecasters of the United States Weather Prediction Center, for eighteen hundred universal time on the twenty-seventh of October, twenty twenty-six: their lows, highs and fronts on a Lambert map, over the infrared image from the same hour, with isobars from the GFS analysis. Charts like this began in the eighteen fifties, when the telegraph first brought in reports from many places within hours.

> 78 words · 3 sentences · 3033.025–3065.650 s (32.6 s) · 50:33.03–51:05.65 (measured) · beat: application · a real forecaster's chart · reuses v1 s53_chart_intro
> Screen: the s01 chart again (now readable): WPC H/L and fronts, GFS isobars, GOES-East IR; keyword '27 Oct 2026 · 18 UTC'; one-line credit nowhere on screen (manifest only)

## s77_latest_letters
Step one: find the letters. Over the middle of the North Atlantic is a low of nine hundred and eighty-two hectopascals. Over western Quebec is a high of one thousand and thirty-three. Further north are deeper lows, the deepest at nine hundred and sixty-one hectopascals, near Iceland.

> 47 words · 4 sentences · 3065.650–3088.450 s (22.8 s) · 51:05.65–51:28.45 (measured) · beat: application · step one, the letters · reuses v1 s54_chart_letters
> Screen: gold rings on 'L 982' (43° N 43° W), 'H 1033' (48° N 79° W), 'L 961' (66° N 11° W); keywords 'step 1: letters'

## s78_latest_spacing
Step two: look at the spacing. The isobars are packed tightest on the south-south-western side of the Atlantic low, at about nine hectopascals per hundred kilometres, so that's where the strongest winds are, near twenty-seven metres per second, and the barbs agree. And with your back to the wind, the low is on your left, just as Buys Ballot said.

> 60 words · 3 sentences · 3088.450–3113.100 s (24.7 s) · 51:28.45–51:53.10 (measured) · beat: application · step two, spacing and wind · reuses v1 s55_chart_spacing
> Screen: gold bracket on the tightest isobars (from the GFS gradient); barbs brighten there; person icon with the low on its left

## s79_latest_fronts
Step three: read the fronts. From the Atlantic low, a warm front runs east, and a cold front trails a long way to the south-west. Where they meet, near the centre, a short occluded front curls round the low, and in the infrared, a band of cold, high cloud lies along much of the cold front. Another cold front reaches the Virginia coast, but it's a weak one: the stations either side of it show almost no change of wind.

> 80 words · 4 sentences · 3113.100–3143.875 s (30.8 s) · 51:53.10–52:23.88 (measured) · beat: application · step three, fronts and clouds · reuses v1 s56_chart_fronts
> Screen: the WPC warm (red), cold (blue) and occluded (purple) fronts of the 982 low glow in turn; the IR cloud band along the cold front ringed; zoom to the US east coast: 5 METAR station models either side of the second cold front, barbs turning from south-west to north-west

## s80_latest_aloft
Step four: climb. On the five hundred hectopascal map, a long trough runs north to south about eight degrees west of the Atlantic low, and the jet stream at two hundred and fifty hectopascals blows round its southern end, at up to about sixty-six metres per second. [beat] On the water vapour image, the dry slot wraps into the low from the south-west, just where the trough and the jet are pushing.

> 71 words · 3 sentences · 3143.875–3172.650 s (28.8 s) · 52:23.88–52:52.65 (measured) · beat: application · step four, the air above the latest chart · NEW in v2
> Screen: Full width LCC: GFS z500 18Z 27 Oct 2026 contours every 60 m with the trough axis from diag.axes (orange dashed); 250-hPa isotachs shaded from 30 m/s (colour bar m/s) from the GFS 18Z 27 Oct analysis (NEW N2; until fetched, the 28 Oct 18Z jet product is NOT substituted — different time); GOES band 8 dry slot outline (s74) faint. Source line 'Data: NOAA NCEP GFS · GOES-19 · 27 Oct 2026, 18 UTC'.

## s81_latest_context
Step five: conclude. The deepest low on the chart, nine hundred and sixty-one hectopascals near Iceland, isn't quite as deep as Ciarán's nine hundred and fifty-four. So a forecaster would expect a stormy, wet night over the open Atlantic, while the eastern United States stays dry and quiet under the big high.

> 52 words · 3 sentences · 3172.650–3196.100 s (23.4 s) · 52:52.65–53:16.10 (measured) · beat: application · step five, compare and conclude · NEW in v2
> Screen: Full width: the s93 chart with 'L 961' (27 Oct 2026) and a ghost 'L 954' (Ciaran, 2 Nov 2023) side by side; the T+24 low marker (s85) and the T+24 spaghetti (s88) as faint thumbnails at the right; gold highlight over the open Atlantic storm area and slate over the dry eastern United States under 'H 1033'. Source line 'Analysis: NOAA NWS WPC · Data: NCEP GFS/GEFS · 27 Oct 2026, 18 UTC'.

## s82_climate
One last idea. Each chart is one moment of weather. Average the charts of thirty Novembers, and you get the climate. Here's the average November sea-level pressure from nineteen ninety-one to twenty twenty: the Icelandic low, at about nine hundred and ninety-nine hectopascals, and the Azores high, at about one thousand and twenty-two, are still there, built from day-to-day storms like Ciarán. [beat] Climate maps are read with exactly the same skills.

> 71 words · 5 sentences · 3196.100–3230.425 s (34.3 s) · 53:16.10–53:50.43 (measured) · beat: application · from weather to climate · NEW in v2
> Screen: Globe3D turns from the North Atlantic chart to the same frame (continuity); the NCEP/NCAR Reanalysis 1 November long-term mean MSLP (1991-2020) cross-fades in: isobars every 4 hPa, 'L 999' at 62.5 N 30 W, 'H 1022' at 35 N 25 W; then a soft stack of thin daily-chart ghosts (thumbnails of s15, s93) dissolving into the mean on 'average'. Colour bar hPa. Source line 'Data: NCEP/NCAR Reanalysis 1 (NOAA PSL) · November mean 1991-2020'.

## s83_recap
To sum up, latitude and longitude pin down any place, and weather charts use conformal projections, which keep angles. Read the small print first: units, contour interval, colour bar, source and time. Isobars show the sea-level pressure; the closer they are, the stronger the wind, with the low on your left in the north and on your right in the south. Fronts carry symbols on the side they move towards, and station models pack a report into a tiny picture. Upper-air maps show the height of a pressure surface, and the thickness tells a layer's temperature. Satellites show the clouds and the moisture aloft, and radar shows the rain. Forecasts sharpen as the lead time gets shorter, and ensembles show how sure they are through their spread. And comparing models, physical or machine-learned, shows where the forecast is still uncertain.

> 140 words · 8 sentences · 3230.425–3289.300 s (58.9 s) · 53:50.43–54:49.30 (measured) · beat: recap · CHANGED in v3 (last sentence split: lead time + spread; comparing models)
> Screen: one beat per sentence, mini pictures: globe with φ, λ · '111 km' and '111 cos φ' · three conformal mini maps · packed isobars + wind · 500-hPa sheet · barb + station model · front symbols + the three satellite thumbnails · person icon with L left (N) / right (S)

## s84_end
This video is one of a series of related tutorials, so watch out for the others. They're made to help students of meteorology, atmospheric science and climate science, and anyone else who wants to learn not just these ideas, but the maths behind them too. The notebook for reading weather maps, and the notebooks for the other concepts, are on the website that goes with this video.

> 67 words · 3 sentences · 3289.300–3314.950 s (25.6 s) · 54:49.30–55:14.95 (measured) · beat: end card · reuses v1 s60_end
> Screen: house end card (weather/climate version): four faint thumbnails (Tissot globe, Mercator, station model, the chart); 'a series of tutorials' (68 px); 'meteorology · atmospheric science · climate' (54 px); 'the ideas, and the maths behind them' (54 px, gold); notebook icon 'reading-weather-maps notebook'; stacked icons 'notebooks for the other concepts'; 2.5-s silent hold

> Total: 7851 words · 406 sentences · 3314.950 s narration · 3317.450 s movie (55:17.45) · 142.1 words per minute overall.

## OPTIONAL s73c_two_ensembles (not in the timeline)
Forecasters also compare ensembles from different centres. Here's the American ensemble, thirty-one members of the GFS, started six hours later, at eighteen hundred universal time on the twenty-second. Its lows are the orange triangles, and the European lows are the teal dots. The two clouds overlap over the middle of the Atlantic, but the American one reaches further south-west. When both clouds cover the same area, the forecast is more trustworthy, and when they sit apart, even the ensembles disagree.

> 80 words · 5 sentences · 37.7 s measured (v3_patch) · beat: application · two ensembles from two centres (GEFS vs ECMWF ENS, about five days ahead) · would follow s73b; costs +37.7 s
> Screen: ECMWF +126 h member lows (teal dots) and GEFS 18Z 22 Oct +120 h member lows (orange triangles), analysis gold ring, hulls and mean crosses, gold link between the means if ≥ 200 km. Source line 'Data: ECMWF open data (CC BY 4.0) · ENS run 22 Oct 2026 12Z +126 h · NOAA NCEP GEFS run 22 Oct 2026 18Z +120 h · valid 27 Oct 2026, 18 UTC'.
> CHECK RM83, RM103 (three wordings, data_needs §D2).
