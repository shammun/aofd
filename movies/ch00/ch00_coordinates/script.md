# ch00_coordinates — narration (movie-director, 2026-10-28)

Series plan v2 **Stage 1 #5 "Coordinates: on a plane, a cylinder and a sphere"** (polar, cylindrical, spherical and
curvilinear coordinates, rotation of axes, the Galilean transformation, latitude-longitude geometry). House style
`movies/HOUSE_STYLE.md` (binding). Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice; our own words; maths
spoken in words; `[beat]` = 1.5-s hold after a worked calculation (not spoken, not captioned).

**v3 (2026-11-04), plan-v5 pointer fixes, measured:** s12_why_polar_storm (S9: 5.95 -> 6.6 s), s19_earth_cylinder (S9: 10.75 -> 11.0 s), s42_galilean_accel (S11: 9.7 -> 10.6 s); clips from `tools/tts.py` (dry run `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/v5_pointer_dryrun`), every other clip kept and shifted. **453 sentences, 6917 words, narration 2921.075 s + 2.5-s hold = 2923.575 s (48:43.58), 142.0 words per minute overall.** The v2 and v1 numbers below are kept for the record.

**v2 (2026-10-30), HOUSE_STYLE §5b amendment, measured:** changed scenes s11_ian_polar, s14b_ian_stack, s24_enu re-run with `tools/tts.py` (dry run `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/c56_5b_dryrun`); every other scene keeps its v2 clip lengths, shifted. **49 scenes, 453 sentences, 6910 words, narration 2919.275 s + 2.5-s hold = 2921.775 s (48:41.78), 142.0 words per minute overall.** The v1 numbers below are kept for the record.

**v1: Measured, not estimated.** `tools/tts.py` dry run on 2026-10-28 into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates/dryrun/v2` (input = this narration, current `movies/lexicon.yaml`, not edited): **48 scenes, 435 sentences, 6634 words, 62 beats, 2808.750 s narration + 2.5-s silent end-card hold = 2811.250 s (46:51.25)**; speech alone 2564.7 s = 155.2 words per minute while speaking, **141.7 words per minute overall** (limit 150); 688 caption cues; self-check {'expected_s': 2808.75, 'audio_s': 2808.75, 'diff_ms': 0.0, 'len_ok': True, 'cues_ok': True}; warnings: none.

**Spoken-symbol rules.** The Earth's radius is never a lone "a" (Kokoro reads it as the article): the narration says
"the Earth's radius" / "the radius"; the screen writes a. "cosine phi", "sine phi" (never "cos"); "r hat", "theta hat",
"x hat prime"; "capital U" for the frame velocity and "small t" for time in s41-s42; "capital Omega" for the spin rate.
Latitude phi, longitude lambda (colatitude named once in s16). Every clockwise/anticlockwise carries "seen from above".

**Cross-references (user rule 2026-10-27), spoken and on the end card:** vectors and index notation (#1a: s03, s08, s38),
dot product (0.1b: s10, s29, s37, s45), cross product (#2: s24; #3 Omega x r in s19 visual), weather basics (0.3: s06, s20),
derivatives and Taylor (#4: s13, s32), gradient (#6: s27), vorticity (U10, plan v5 pos 29: s12), material derivative (#10: s45),
pressure coordinates (#23A: s27), Coriolis (back-pointer to #3, the cross product movie on our spinning Earth: s19, s42), equations of motion (#29A: s26), gradient wind (#30: s13),
Ekman (#31: s40), stratosphere (#49: s36), reading weather maps (#69: s34). Tropical cyclones (#45) and extratropical
cyclones (#42) are listed in `related:` only (not spoken). `related:` per scene in the storyboard.

**Proposed lexicon entries** (not added; check by ear in the render): Descartes, Longyearbyen, Svalbard, Mercator, Gerardus,
Galilei, Ciarán (exists), ERA5 (exists), Trappes (exists), colatitude, graticule, rhumb, Pinellas (not spoken). See data_needs.md §E.

Lines starting with ">" are notes and are not spoken.

## s00_title
In this video, we'll learn coordinates on a plane, a cylinder and a sphere the easy way, and see how meteorology uses them to measure the winds round a hurricane's eye, and to find distances and directions on our round Earth.

> 41 words · 1 sentences · 0 beats · 0.300–15.850 s (15.5 s; speech 14.8 s) · 0:00.30–0:15.85 (measured, dry run v2, shifted).

## s01_hook
What are coordinates, and why do we need more than one kind? Let's see what they are, and why they're built this way. Then let's see what they tell us about storms, maps and winds.

> 35 words · 3 sentences · 0 beats · 15.850–29.050 s (13.2 s; speech 11.7 s) · 0:15.85–0:29.05 (measured, dry run v2, shifted).

## s02_coordinates
Let's start with a flat map. To say where something is, we need a starting point, and some directions to count from. The starting point is called the origin. Let's put it at a weather station. Now draw one line through it pointing east, and one pointing north. These lines are called the axes. A weather balloon drifts three kilometres east and four kilometres north of the station. So we can write its position as the pair of numbers three and four. [beat] These two numbers are called its coordinates, and together they pin down one place on the map. Measuring along straight axes at right angles, like this, is called Cartesian coordinates, after the French thinker René Descartes.

> 118 words · 10 sentences · 1 beats · 29.050–80.325 s (51.3 s; speech 46.2 s) · 0:29.05–1:20.33 (measured, dry run v2, shifted).

## s03_cartesian_arrows
Each axis comes with a unit vector: an arrow of length one that points along it. We write x hat for the arrow pointing east, and y hat for the arrow pointing north. The balloon's position is three times x hat, plus four times y hat. We met arrows like these in the vectors movie of this series. Here's their key property: x hat points the same way everywhere on the map. Move the balloon anywhere you like, and the two arrows don't change. That's what makes Cartesian coordinates so easy to work with. But many things in the weather aren't laid out in squares. A hurricane spins round its eye, and a weather radar looks out in rings. For those, there's a better way to say where something is.

> 130 words · 10 sentences · 0 beats · 80.325–130.900 s (50.6 s; speech 46.6 s) · 1:20.33–2:10.90 (measured, dry run v2, shifted).

## s04_polar
Instead of going east and north, we can give two other numbers: how far away the balloon is, and in which direction. The distance from the origin is called r. By Pythagoras, r is the square root of three squared plus four squared, which is the square root of twenty five: five kilometres. [beat] The direction is an angle, called theta. Mathematicians measure it from the east axis, turning anticlockwise as seen from above. Its tangent is four over three, so theta is about fifty three degrees. [beat] So the same balloon is at r equals five kilometres, and theta equals fifty three degrees. These two numbers are called polar coordinates. A weather radar measures exactly this pair: how far away the raindrops are, and in which direction.

> 126 words · 9 sentences · 2 beats · 130.900–187.725 s (56.8 s; speech 50.9 s) · 2:10.90–3:07.72 (measured, dry run v2, shifted).

## s05_polar_back
Can we go back the other way? Yes. Think of the right triangle with the balloon at its tip. Its long side is r, and its angle at the station is theta. The side going east is r times cosine theta, and the side going north is r times sine theta. Let's check. Five times the cosine of fifty three degrees is five times zero point six, which is three. And five times zero point eight is four. [beat] So x equals r cosine theta, and y equals r sine theta. These two lines are all we need to switch between the two systems.

> 103 words · 10 sentences · 1 beats · 187.725–231.675 s (44.0 s; speech 38.9 s) · 3:07.72–3:51.68 (measured, dry run v2, shifted).

## s06_bearings
One warning before we go on. Meteorologists and navigators measure directions differently. A compass bearing starts from north, and turns clockwise as seen from above. So the balloon's bearing is ninety minus fifty three, which is thirty seven degrees. [beat] Weather reports add one more twist: a wind's direction says where the wind blows from, as we saw in the weather basics movie. So a west wind blows towards the east. Same arrows, different rulers, so it's always worth checking which angle a data set uses.

> 85 words · 7 sentences · 1 beats · 231.675–271.525 s (39.8 s; speech 35.8 s) · 3:51.68–4:31.52 (measured, dry run v2, shifted).

## s07_radians
Before polar coordinates can do their real work, we need one more building block: measuring angles in radians. Take a circle of radius r, and walk along its edge. The angle in radians is the distance you walked, divided by the radius. So the distance along the edge, called the arc length, is the radius times the angle. A full circle is two pi radians, because its edge is two pi times the radius. So one radian is about fifty seven degrees. Let's try easy numbers. On a ring five kilometres from the station, turning by zero point two radians walks you five times zero point two, which is one kilometre. [beat] On a ring fifty kilometres out, the same turn walks you ten kilometres. [beat] The same angle gives ten times the distance. Keep this rule in mind, because it explains a lot about maps of the Earth.

> 147 words · 11 sentences · 2 beats · 271.525–335.675 s (64.2 s; speech 57.5 s) · 4:31.52–5:35.68 (measured, dry run v2, shifted).

## s08_polar_unit_vectors
Polar coordinates come with their own unit vectors. The arrow r hat points straight away from the origin, the way r grows. Theta hat points sideways, at a right angle to r hat, the way theta grows: anticlockwise, seen from above. At the balloon, r hat is zero point six, zero point eight. And theta hat is minus zero point eight, zero point six. Now let's move the balloon round the circle. Its r hat turns with it, and so does its theta hat. That's the big difference from x hat and y hat: polar unit vectors depend on where you are.

> 102 words · 8 sentences · 0 beats · 335.675–377.575 s (41.9 s; speech 38.6 s) · 5:35.68–6:17.57 (measured, dry run v2, shifted).

## s09_unit_vectors_turn
How fast do they turn? Let's turn the balloon's angle by a small amount, d theta. The tip of r hat moves along a circle of radius one, so it moves a distance of one times d theta. And it moves sideways, in the direction of theta hat. So the change in r hat is theta hat times d theta. Dividing by d theta, the rate of change of r hat with theta is theta hat. [beat] Theta hat turns too, and its tip moves towards the centre, so its rate of change is minus r hat. [beat] That's all there is to it: turn the angle, and each arrow swings towards the other one.

> 113 words · 8 sentences · 2 beats · 377.575–423.100 s (45.5 s; speech 40.0 s) · 6:17.57–7:03.10 (measured, dry run v2, shifted).

## s10_polar_components
Now let's describe a wind in polar coordinates. Suppose that at the balloon, a wind blows due east at ten metres per second. How much of it blows away from the station, and how much blows round it? To find out, we take the dot product of the wind with each unit vector, as in the dot product movie. Along r hat, it's ten times zero point six, plus zero times zero point eight, which is six. [beat] Along theta hat, it's ten times minus zero point eight, which is minus eight. [beat] So six metres per second blow outward, and eight metres per second blow round. The minus sign means the wind goes round clockwise, as seen from above. Let's check the length: six squared plus eight squared is a hundred, and its square root is ten. [beat] It's the same wind, with new components.

> 143 words · 10 sentences · 3 beats · 423.100–484.075 s (61.0 s; speech 53.6 s) · 7:03.10–8:04.07 (measured, dry run v2, shifted).

## s11_ian_polar
Now let's take polar coordinates to a real storm. Here is Hurricane Ian on the twenty eighth of September, twenty twenty-two, at six in the evening, universal time, an hour before it came ashore on the southwest coast of Florida. The map shows the winds ten metres above the ground, from a weather model analysis with grid points every three kilometres. Let's put the origin in the eye, where the pressure is lowest, and zoom in. The eye sits just off the coast, over the warm Gulf of Mexico, with the flat, low land of southwest Florida to its east. Now every wind has two parts. The radial wind, along r hat, blows in or out. The tangential wind, along theta hat, blows round the eye. On a ring twenty five kilometres from the centre, the tangential wind averages about thirty seven metres per second. [beat] That's about a hundred and thirty kilometres per hour, anticlockwise as seen from above, as in every northern hemisphere hurricane. The radial wind averages about minus twelve and a half metres per second. [beat] The minus sign means the air is flowing in, towards the eye. The real storm was even stronger: the official estimate of its strongest sustained wind at that hour is about a hundred and thirty five knots, which is about two hundred and fifty kilometres per hour. The model analysis smooths the strongest winds. Now let's zoom back out to the whole coast.

> 241 words · 15 sentences · 2 beats · 484.075–586.075 s (102.0 s; speech 94.0 s) · 8:04.07–9:46.08 (measured, 5b dry run 2026-10-30).

## s12_why_polar_storm
Why bother with polar coordinates here? Let's go round that ring and plot the eastward and northward winds. Both swing up and down, from plus to minus, all the way round, because the wind keeps turning as we circle the eye. Now let's plot the tangential and radial winds round the same ring. They stay much closer to two steady lines. Two jumpy curves have become two fairly steady numbers: how fast the storm spins, and how fast the air flows in. The angle at which the wind crosses each ring, called the inflow angle, is about nineteen degrees. [beat] Spin and inflow are exactly what hurricane scientists care about, and polar coordinates hand them over directly. The spin also has its own measure, called vorticity, which has its own movie later in this series.

> 134 words · 9 sentences · 1 beats · 586.075–643.850 s (57.8 s; speech 53.0 s) · 9:46.08–10:43.85 (measured, dry run v2 + plan-v5 pointer clips, shifted).

## s13_centripetal
Here's a surprise. Picture an air parcel, a small volume of air that moves with the flow, going round the eye at a steady thirty seven metres per second, on that twenty five kilometre ring. Its tangential wind never changes. Is it accelerating? Yes, because its direction keeps changing, and polar coordinates show exactly why. Its velocity is thirty seven times theta hat, and theta hat turns as the parcel goes round. By the chain rule, from the derivatives movie, the rate of change of theta hat in time is its rate of change with theta, which is minus r hat, times how fast theta changes, which is the speed divided by the radius. So the acceleration is minus the speed squared over the radius, times r hat: it points in, towards the eye. [beat] With our numbers, it's thirty seven squared, over twenty five thousand metres, which is about zero point zero five five metres per second squared. [beat] That's almost two hundred times smaller than gravity, but something has to supply it, and here it's mostly the pressure force, because the pressure is lowest in the eye. We'll come back to this balance in the movie on the gradient wind. The lesson for now: when unit vectors turn, steady components can still mean acceleration.

> 214 words · 12 sentences · 2 beats · 643.850–736.075 s (92.2 s; speech 85.3 s) · 10:43.85–12:16.07 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s14_cylinder
A hurricane isn't flat, though. The air spirals in near the sea, rises in a ring of towering clouds round the eye, called the eyewall, and flows out near the top, about twelve to fifteen kilometres up. To describe that, we add a third coordinate: the height, z, straight up. The distance r, the angle theta and the height z together are called cylindrical coordinates, because all the places with the same r form a cylinder round the axis. The wind now has three parts: radial, tangential and vertical. The vertical unit vector, z hat, is the same everywhere, just like x hat. Only r hat and theta hat turn. So cylindrical coordinates are just polar coordinates with a height added. In a hurricane, the radial wind is negative near the sea, flowing in, and positive near the top, flowing out.

> 141 words · 9 sentences · 0 beats · 736.075–795.025 s (59.0 s; speech 55.4 s) · 12:16.07–13:15.02 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s14b_ian_stack
Let's check that with Ian's real winds. Here are five layers of air round Ian's eye, at that same hour, from the reanalysis called ERA5. They run from about three hundred metres above the sea to about fifteen kilometres up. The colour on each layer is the radial wind: rose, with a minus sign, where the air flows in, and orange where it flows out. On the lowest layer, the air flows in almost everywhere. On a ring two hundred kilometres from the eye, it averages about minus six metres per second. [beat] At about one and a half kilometres, the inflow has almost died away. At about six kilometres, in the middle, the air hardly flows in or out at all; near the eye, it rises instead. Near the top, at about twelve and a half and fifteen kilometres, the sign flips. On the same ring, the air flows out at about four metres per second. [beat] Let's take a short, closer look, from just above the sea, up the side of the stack. In at the bottom, up through the middle, and out at the top. This reanalysis smooths the strongest winds, so we use it for the directions, not the speeds. And every layer is described by the same three coordinates: r, theta and z.

> 216 words · 14 sentences · 2 beats · 795.025–882.875 s (87.9 s; speech 80.2 s) · 13:15.02–14:42.88 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s15_sphere
Now the biggest shape of all: the Earth. Let's put the origin at the Earth's centre. A point on a sphere is pinned down by its distance from the centre, r, and by two angles. On the Earth's surface, r is the Earth's radius: about six thousand four hundred kilometres, or more exactly, six thousand three hundred and seventy one. These are spherical coordinates. Meteorologists use the two angles you already know from maps: latitude and longitude.

> 77 words · 6 sentences · 0 beats · 882.875–917.075 s (34.2 s; speech 31.6 s) · 14:42.88–15:17.07 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s16_latitude
Latitude says how far north or south a place is. Draw a line from the Earth's centre to the place. Latitude is the angle between that line and the plane of the equator. We write it phi. At the equator, phi is zero. At the North Pole, it's ninety degrees north. At the South Pole, it's ninety degrees south, which we write as minus ninety. Brest, a port at the western tip of France, is at about forty eight point four degrees north. All the places with the same latitude form a circle round the Earth, called a parallel. One caution: many maths and physics books measure the angle down from the North Pole instead. That angle is called the colatitude, and it's ninety degrees minus the latitude. So sine and cosine swap places between the two conventions.

> 138 words · 12 sentences · 0 beats · 917.075–975.000 s (57.9 s; speech 53.3 s) · 15:17.07–16:15.00 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s17_longitude
Longitude says how far east or west. Picture the half circles that run from pole to pole, called meridians. The one through Greenwich, in London, is the prime meridian. Longitude is the angle round the Earth's axis, from the prime meridian to the meridian through the place. We write it lambda. East is positive, and west is negative. Brest is at about four and a half degrees west, so its lambda is minus four point five degrees. Some data sets count longitude from zero to three hundred and sixty degrees, all the way round to the east, so Brest becomes three hundred and fifty five point five. The lines of latitude and longitude together make a grid on the globe, called the graticule.

> 123 words · 9 sentences · 0 beats · 975.000–1026.225 s (51.2 s; speech 47.6 s) · 16:15.00–17:06.23 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s18_position
Where exactly is Brest in space? Let's find its position vector, the arrow from the Earth's centre to Brest. We'll do it in two steps, using a right triangle each time. First, look at the Earth from the side. The line to Brest makes the angle phi with the equator plane. So Brest's height above the equator plane is the Earth's radius times sine phi. And its distance from the Earth's axis is the radius times cosine phi. Second, look down from above the North Pole. In the equator plane, that distance from the axis points at the angle lambda. That's polar coordinates in a flat plane again, so it splits into a cosine lambda part and a sine lambda part. Putting it together: x is the radius times cosine phi times cosine lambda, y is the radius times cosine phi times sine lambda, and z is the radius times sine phi. For Brest, the height above the equator plane is six thousand three hundred and seventy one kilometres times zero point seven four eight, which is about four thousand seven hundred and sixty kilometres. [beat] And its distance from the axis is six thousand three hundred and seventy one times zero point six six four: about four thousand two hundred and thirty kilometres. [beat]

> 213 words · 13 sentences · 2 beats · 1026.225–1116.475 s (90.2 s; speech 83.4 s) · 17:06.23–18:36.48 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s19_earth_cylinder
That distance from the axis, the radius times cosine phi, deserves a second look, because it's a cylindrical coordinate. The Earth spins once a day round its axis, so every place travels round a circle with that radius. The spin rate, called capital Omega, is seven point two nine times ten to the minus five radians per second. The ground's speed is the spin rate times the radius of its circle. At the equator, the circle has the full radius, so the ground moves at seven point two nine times ten to the minus five, times six point three seven one million metres: about four hundred and sixty five metres per second. [beat] At Brest, the circle is two thirds as big, so the ground moves at about three hundred and nine metres per second. [beat] At Longyearbyen, on the Arctic islands of Svalbard, seventy eight degrees north, it's only about ninety five. [beat] And at the poles, it's zero. This shrinking circle is part of the reason the Earth's spin affects winds differently at different latitudes, as we saw in the cross product movie on our spinning Earth.

> 186 words · 9 sentences · 3 beats · 1116.475–1194.950 s (78.5 s; speech 71.5 s) · 18:36.48–19:54.95 (measured, dry run v2 + plan-v5 pointer clips, shifted).

## s20_distance_north
Now let's measure distances on the sphere. Going north along a meridian, you walk on a circle whose radius is the full radius of the Earth, because every meridian is half of a circle round the centre. So by the arc length rule, the distance north is the Earth's radius times the change in latitude, in radians. Let's find the length of one degree. One degree is pi over one hundred and eighty, which is zero point zero one seven four five radians. Times six thousand three hundred and seventy one kilometres, that's about one hundred and eleven point two kilometres. [beat] And it's the same at every latitude: a degree north is always about a hundred and eleven kilometres. One minute of latitude, a sixtieth of a degree, is about one point eight five kilometres, which is the nautical mile from the weather basics movie.

> 145 words · 8 sentences · 1 beats · 1194.950–1254.900 s (60.0 s; speech 55.6 s) · 19:54.95–20:54.90 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s21_distance_east
Going east is different. Walking east, you follow a parallel, and a parallel is a circle round the Earth's axis, not round its centre. Its radius is the one we just found: the Earth's radius times cosine phi. So the distance east is the radius, times cosine phi, times the change in longitude. That cosine phi is there because the circle you walk on shrinks as you get closer to the pole. Let's compare one degree of longitude at four places. At the equator, cosine phi is one, so it's a hundred and eleven kilometres, the same as a degree north. [beat] At Brest, cosine phi is zero point six six, so it's about seventy four kilometres. [beat] At Longyearbyen, cosine phi is zero point two, so one degree east is only about twenty three kilometres. [beat] And at the pole, where all the meridians meet, it's zero. Like the segments of an orange, the meridians are widest apart at the equator, and they come together at the poles.

> 166 words · 11 sentences · 3 beats · 1254.900–1327.125 s (72.2 s; speech 64.5 s) · 20:54.90–22:07.12 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s22_grid_cells
This matters every time we use weather data. ERA5, the reanalysis we've used in this series, gives values on a grid every quarter of a degree in latitude and longitude. Near Brest, one grid box is about twenty eight kilometres from south to north, but only about eighteen and a half kilometres from west to east. [beat] At Svalbard, it's still twenty eight kilometres tall, but under six kilometres wide. [beat] So the boxes get thinner and thinner towards the poles. Forget the cosine, and every east-west distance near the poles comes out several times too big, and every east-west slope several times too small. A weather model on such a grid also has to take very short time steps near the poles, which is one reason many modern models use other kinds of grid.

> 133 words · 7 sentences · 2 beats · 1327.125–1384.400 s (57.3 s; speech 52.1 s) · 22:07.12–23:04.40 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s23_area
Distances give us areas. A small patch of the Earth's surface is the radius times d phi tall, and the radius times cosine phi times d lambda wide. So its area is the radius squared, times cosine phi, times d phi, times d lambda. Here's a lovely consequence. Let's add up all the patches between the equator and some latitude. Adding up is integrating, and the integral of cosine phi is sine phi. So the area between the equator and latitude phi grows like sine phi. [beat] The sine of thirty degrees is one half. So half of the northern hemisphere lies between the equator and thirty degrees north, and half of the whole Earth lies between thirty south and thirty north. [beat] The tropics and subtropics are huge, and the polar caps are small. That's why a global average temperature has to weight each latitude by cosine phi. Otherwise, the small polar boxes would count as much as the big tropical ones.

> 161 words · 12 sentences · 2 beats · 1384.400–1455.675 s (71.3 s; speech 64.3 s) · 23:04.40–24:15.68 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s24_enu
Now let's stand at a weather station, at Brest. Brest sits at the western tip of Brittany, with the Atlantic Ocean on three sides. A forecaster there doesn't use axes from the Earth's centre. She uses three local arrows: i hat pointing east, j hat pointing north, and k hat pointing straight up, away from the Earth's centre. This is the local east, north, up frame. In it, the wind is u times i hat, plus v times j hat, plus w times k hat. Here, u is the eastward wind, v the northward wind, and w the upward wind. And i hat cross j hat is k hat, so the frame is right-handed, as in the cross product movie. Each station has its own frame. Let's zoom back out to the whole globe. At Trappes, near Paris, four hundred and eighty kilometres east of Brest, up points in a direction about four degrees different. [beat] At Singapore, near the equator, up differs from Brest's up by about a hundred and one degrees. [beat]

> 172 words · 12 sentences · 2 beats · 1455.675–1528.125 s (72.4 s; speech 66.0 s) · 24:15.68–25:28.12 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s25_enu_turn
So the local arrows change as you move, just like r hat and theta hat. Let's see how. Suppose a plane flies due east along the parallel through Brest, at two hundred and fifty metres per second. In one hour, it covers nine hundred kilometres. That's nine hundred divided by seventy four kilometres per degree: about twelve degrees of longitude. [beat] So its east arrow has swung round the Earth's axis by those same twelve degrees, exactly like theta hat swinging round a circle. Going north tips the arrows too: after a hundred and eleven kilometres north, the up arrow has tilted one degree towards the north. Written out, the rates of change of i hat, j hat and k hat for a moving air parcel each have a speed divided by a radius, the same pattern we found round the hurricane. Speed over radius is how fast the arrows turn.

> 150 words · 9 sentences · 1 beats · 1528.125–1590.200 s (62.1 s; speech 57.3 s) · 25:28.12–26:30.20 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s26_metric_terms
Why does that matter? Because Newton's law is about the change of the whole wind vector, not just of its numbers. When the arrows turn, the change of the wind has extra pieces, even when u, v and w stay the same. For the eastward part, it's the rate of change of u, minus u v tangent phi over the radius, plus u w over the radius. Those extra terms are called metric terms. They come only from the turning arrows of the coordinates. How big are they? For a wind of ten metres per second east and ten north, at forty five degrees, u v tangent phi over the radius is a hundred times one, over six point three seven million: about one point six times ten to the minus five metres per second squared. [beat] That's about sixty five times smaller than the Coriolis effect on the same wind. So in one weather system they're small, but across whole oceans and the whole globe, they add up. We'll meet them again in the movie on the equations of motion.

> 180 words · 11 sentences · 1 beats · 1590.200–1661.900 s (71.7 s; speech 66.3 s) · 26:30.20–27:41.90 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s27_curvilinear
Polar, cylindrical and spherical coordinates are all examples of curvilinear coordinates: coordinates whose lines can curve. They share three features. First, the coordinate lines are curves, like circles and meridians. Second, the unit vectors change from place to place. Third, a change in a coordinate isn't a distance by itself, so it needs a scale factor. In polar coordinates, a change of theta walks you r times d theta, so theta's scale factor is r. On the Earth, latitude's scale factor is the Earth's radius, and longitude's is the radius times cosine phi. These scale factors show up whenever we take slopes. For example, the eastward slope of the temperature on the sphere is one over the radius times cosine phi, times its rate of change with longitude. That's part of the gradient, which gets its own movie, next in this series. Weather models even use a curvilinear vertical coordinate: pressure instead of height, which has its own movie too.

> 160 words · 11 sentences · 0 beats · 1661.900–1733.575 s (71.7 s; speech 67.4 s) · 27:41.90–28:53.58 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s28_why
So why are there so many coordinate systems? There are three good reasons. The first is shape. When the coordinates match the shape of the problem, the numbers become simple: a ring round the eye is just r equals a constant, and the Earth's surface is just r equals its radius. The second is measurement. Use the coordinates your instruments use: a radar sees distance and direction, a station feels east, north and up, and the data come on a latitude and longitude grid. The third is meaning. The right coordinates split a vector into the parts that physics cares about: spin and inflow round a storm, or along and across a coastline, as we'll see soon. Now let's put these ideas to work on maps, on a storm surge, and on a moving storm.

> 135 words · 9 sentences · 0 beats · 1733.575–1789.150 s (55.6 s; speech 52.0 s) · 28:53.58–29:49.15 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s29_great_circle
First, the shortest way between two places. On a flat sheet, it's a straight line. On a sphere, it's part of a great circle: a circle whose centre is the Earth's centre, like the equator or any meridian. Picture a flat sheet slicing through London, Los Angeles and the Earth's centre. Where it cuts the surface is the great circle route. How long is it? Take the dot product of the two places' position arrows of length one. As in the dot product movie, that's the cosine of the angle between them, here at the Earth's centre. The angle comes out at about seventy nine degrees, and the arc length rule turns it into about eight thousand seven hundred and sixty kilometres. [beat] It doesn't head west-south-west, the way Los Angeles looks on a flat map. It leaves London heading north-west, at a bearing of about three hundred and twelve degrees, and climbs to about sixty two degrees north, near the west coast of Greenland. [beat] That's why flights from Europe to California pass over Greenland and northern Canada.

> 177 words · 12 sentences · 2 beats · 1789.150–1863.175 s (74.0 s; speech 67.1 s) · 29:49.15–31:03.18 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s30_rhumb_line
Sailors used a different route for centuries: the rhumb line, which keeps the same compass bearing all the way. It's easy to steer, but it's longer. From London to Los Angeles, the rhumb line holds a bearing of about two hundred and fifty eight degrees, and it's about nine thousand seven hundred and thirty kilometres long. [beat] That's about eleven percent longer than the great circle: nearly a thousand kilometres more, or about an hour of extra flying. [beat] On the globe, the great circle looks straight, and the rhumb line curves. On the most famous flat map, it's the other way round. Let's see why.

> 104 words · 7 sentences · 2 beats · 1863.175–1908.650 s (45.5 s; speech 40.3 s) · 31:03.18–31:48.65 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s31_plate_carree
Flattening the globe always stretches something: you can't flatten an orange peel without tearing or stretching it. The simplest map just uses longitude as x and latitude as y, on squares. That's how most weather data arrive. But on this map, every parallel is drawn as long as the equator. So at latitude phi, east-west distances are stretched by one over cosine phi. At Brest, that's one over zero point six six, about one and a half times. [beat] At Svalbard, it's almost five times. [beat] North-south distances aren't stretched at all, so shapes near the poles are squashed flat.

> 98 words · 8 sentences · 2 beats · 1908.650–1954.750 s (46.1 s; speech 40.5 s) · 31:48.65–32:34.75 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s32_mercator
In fifteen sixty nine, Gerardus Mercator fixed the shapes. His idea: if east-west is stretched by one over cosine phi, stretch north-south by the same amount. Then a small circle stays a circle, and a small angle on the map is the true angle on the Earth. Maps like this are called conformal. That's exactly what a navigator wants: a line of constant bearing, the rhumb line, is a straight line on a Mercator map. To build it, each small step north, the radius times d phi, is drawn one over cosine phi times longer. Adding up all those steps gives the height on the map: the Earth's radius, times the natural log of the tangent of forty five degrees plus half the latitude. You can check it with the derivatives movie: its slope with respect to phi is the radius over cosine phi. [beat] Near the poles, that height runs off to infinity, so a Mercator map can never show the poles.

> 162 words · 9 sentences · 1 beats · 1954.750–2020.350 s (65.6 s; speech 60.8 s) · 32:34.75–33:40.35 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s33_mercator_area
But conformal has a price: areas. Stretched by one over cosine phi in both directions, an area is stretched by one over cosine squared. At sixty degrees, that's four times. [beat] At Svalbard, it's about twenty four times. [beat] So on a Mercator map, Greenland looks nearly as big as Africa. In truth, Africa is about fourteen times bigger. [beat] The Mercator map is great for directions and shapes, and terrible for comparing sizes.

> 71 words · 7 sentences · 3 beats · 2020.350–2058.150 s (37.8 s; speech 31.5 s) · 33:40.35–34:18.15 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s34_equal_area
For climate maps, sizes matter more. If we want to know how much of the Earth is warmer than usual, a map that inflates the polar regions would mislead us. So climate scientists often use equal-area maps, like the Equal Earth map. On it, every patch keeps its true relative area, so Greenland is shown at its real size, about a fourteenth of Africa. The price now is shape: towards the poles, shapes get skewed. At sixty degrees north, away from the middle of this map, angles can be off by thirty degrees or more. [beat] No flat map can keep both areas and shapes right everywhere. So the rule is: pick the map for the job. Use conformal maps for winds and directions, and equal-area maps for comparing amounts. We'll read many maps like these in the movie on reading weather maps.

> 142 words · 10 sentences · 1 beats · 2058.150–2117.000 s (58.8 s; speech 53.8 s) · 34:18.15–35:17.00 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s35_polar_view
There's one more map that every forecaster knows: the view from above a pole. On it, the pole sits in the middle, and the circles of latitude become rings round it. So it's polar coordinates again: the distance from the middle stands for how far you are from the pole, and the angle round it is the longitude. Here is the height of the ten hectopascal pressure surface, about thirty kilometres up in the stratosphere, on the sixth of January, twenty fourteen. The lines join places where that surface has the same height. They circle the Arctic: about twenty eight kilometres near the middle, and almost thirty one kilometres at thirty degrees north. [beat] The winds blow along these lines, round and round the pole, from west to east. This great winter whirl of cold air is called the stratospheric polar vortex.

> 141 words · 8 sentences · 1 beats · 2117.000–2175.225 s (58.2 s; speech 53.8 s) · 35:17.00–36:15.22 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s36_vortex_components
In this view, the eastward wind is the tangential wind round the pole. And the northward wind is the radial wind with a minus sign, because blowing north means blowing in, towards the pole. Westerly winds, the winds from the west, turn anticlockwise as seen from above the North Pole. So the polar vortex is like the hurricane's spin, only far wider and slower to change. Unlike a hurricane, though, it isn't fed by a warm sea: it forms because the polar stratosphere cools in the long winter night. And look where its centre is: not at the pole, but at almost seventy nine degrees north, over Greenland. [beat] If we put the origin at the vortex's own centre instead, its winds become more purely tangential. Choosing the origin is part of choosing good coordinates. When the vortex weakens or splits, cold air can spill south, which is a story for the stratosphere movie.

> 153 words · 9 sentences · 1 beats · 2175.225–2239.950 s (64.7 s; speech 60.0 s) · 36:15.22–37:19.95 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s37_rotate_axes
Now let's change coordinates without moving the origin: we'll just turn the axes. The arrow stays the same; only the rulers we measure it with turn. Say the new x axis is turned by an angle alpha, anticlockwise as seen from above. Its unit vector, x hat prime, is cosine alpha, sine alpha. The new y axis, y hat prime, is minus sine alpha, cosine alpha. The new components are just dot products with the new arrows. So x prime is x cosine alpha plus y sine alpha, and y prime is minus x sine alpha plus y cosine alpha. Let's try it on our east wind of ten metres per second, with the axes turned by thirty degrees. The new x prime is ten times zero point eight seven, about eight point seven. [beat] And y prime is minus ten times zero point five, which is minus five. [beat] And the length is still ten, because the arrow itself didn't change.

> 160 words · 11 sentences · 2 beats · 2239.950–2308.025 s (68.1 s; speech 61.5 s) · 37:19.95–38:28.03 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s38_rotation_matrix
We can write those two lines as a table of numbers, called a rotation matrix. Each entry is a direction cosine: the cosine of the angle between an old axis and a new one. In the index notation of the vectors movie, new component number j is the sum over i of the old components times C i j. And here's a nice link: polar components are just a rotation. At each place, r hat and theta hat are the east and north arrows turned by the angle theta. So the wind's six outward and minus eight round were just the east wind's components in axes turned by fifty three degrees. [beat] The only difference is that in polar coordinates, the turning angle changes from place to place.

> 127 words · 7 sentences · 1 beats · 2308.025–2358.825 s (50.8 s; speech 46.8 s) · 38:28.03–39:18.83 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s39_coastline
Turning the axes is how forecasters look at winds on a coast. What matters there is the part of the wind that blows along the shore, and the part that blows across it, onto the land or out to sea. Here's the southwest coast of Florida. It runs from south-south-east to north-north-west, at a bearing of about three hundred and twenty nine degrees. [beat] Let's turn our axes so that x prime runs along the coast, and y prime points out to sea. At eight in the evening, universal time, about an hour after Ian came ashore, the model wind at Fort Myers Beach was about thirty three metres per second, from the south-west. [beat] Along the shore, it's about nine metres per second. Across the shore, it's about thirty two metres per second, towards the land. [beat] Almost the whole wind was pushing the sea onto the coast.

> 146 words · 9 sentences · 3 beats · 2358.825–2419.925 s (61.1 s; speech 54.0 s) · 39:18.83–40:19.93 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s40_surge
That onshore push piles water up against the coast. Mostly by that push, and a little by the low pressure, the sea rose far above the normal tide. This is called a storm surge. At Fort Myers Beach, the official report found water ten to fifteen feet above the ground: about three to four and a half metres. Now go about a hundred and fifty kilometres north, to Tampa Bay, on the other side of the storm's spin. There, the coast runs almost due north, and the wind was blowing out to sea, at about eleven and a half metres per second across the shore. [beat] So the water was pushed away from the coast, and the water level in the bay fell instead of rising. It's the same storm, on opposite sides of the eye, and the across-shore part flips its sign. Turned axes make that difference jump out. The wind along a coast matters too: it can bring cold water up from below, which is a story for the Ekman movie.

> 172 words · 10 sentences · 1 beats · 2419.925–2486.150 s (66.2 s; speech 61.1 s) · 40:19.93–41:26.15 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s41_galilean
Our last change of coordinates lets the origin move. Imagine you're on a train gliding along a straight track at a steady twenty metres per second. You walk towards the front at one and a half metres per second. Someone standing beside the track sees you moving at twenty plus one and a half: twenty one and a half metres per second. [beat] So velocities add. The velocity seen from the ground is the train's velocity, capital U, plus the velocity seen on the train, u prime. And positions shift as time goes on: x equals x prime plus capital U times small t, while both clocks show the same time. Switching between two frames like this, moving at a steady velocity without turning, is called a Galilean transformation, after Galileo Galilei.

> 131 words · 8 sentences · 1 beats · 2486.150–2542.200 s (56.1 s; speech 51.7 s) · 41:26.15–42:22.20 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s42_galilean_accel
Here's the beautiful part. What happens to accelerations? Let's take the rate of change of u, which is capital U plus u prime. The rate of change of capital U is zero, because the train's velocity never changes. So the rate of change of u equals the rate of change of u prime: the acceleration is the same in both frames. [beat] Drop a ball on the smooth train, and it falls straight down, speeding up by nine point eight metres per second every second, exactly as it does for the person beside the track. And since Newton's law says force equals mass times acceleration, the same forces explain the motion in both frames. For a fluid, the acceleration of an air parcel is the local change of the wind plus the advection term. Each piece can differ between the two frames, but their sum is the same. That's only true for a frame moving steadily in a straight line. A frame that turns, like the spinning Earth, adds new terms, the Coriolis and centrifugal effects, which we met in the cross product movie on our spinning Earth.

> 187 words · 11 sentences · 1 beats · 2542.200–2617.650 s (75.4 s; speech 70.0 s) · 42:22.20–43:37.65 (measured, dry run v2 + plan-v5 pointer clips, shifted).

## s43_storm_frame
Now a real moving storm. Storm Ciarán crossed the English Channel in the night from the first to the second of November, twenty twenty-three. Following its lowest pressure hour by hour, the centre moved towards the east-north-east, at about fifteen metres per second. [beat] Let's look at the winds on a ring two hundred kilometres from the centre, at three in the morning, universal time. Seen from the ground, the winds on the south side averaged about nineteen metres per second, but on the north side, only about eight. [beat] Why so lopsided? On the south side, the storm's anticlockwise spin blows towards the east, the same way the storm moves, so the two add up. On the north side, the spin blows towards the west, against the motion, so they partly cancel. Now let's subtract the storm's own velocity from every wind. These are the storm-relative winds: what you'd feel riding along with the storm.

> 154 words · 10 sentences · 2 beats · 2617.650–2684.350 s (66.7 s; speech 60.4 s) · 43:37.65–44:44.35 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s44_storm_invariant
So what changes, and what doesn't? The wind at each point changes by fifteen metres per second. But the average spin round the ring is about fourteen metres per second in both frames. [beat] And the average inflow is about six metres per second in both frames. [beat] That's no accident. A steady, uniform wind blows as much round one side of a circle as it blows back round the other, so it adds nothing to the average spin, or to the average inflow. The spin belongs to the storm, and the motion belongs to the whole pattern. For a house on the coast, though, the ground-relative wind is what counts, and that's why the strongest winds came on the storm's southern side. That night, the weather station at Brest measured a gust of eighty four knots, about a hundred and fifty six kilometres per hour.

> 144 words · 9 sentences · 2 beats · 2684.350–2744.175 s (59.8 s; speech 53.9 s) · 44:44.35–45:44.18 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s45_fixed_barometer
The moving frame also explains what a fixed barometer sees. Picture the pressure pattern as a frozen map, sliding east-north-east at fifteen metres per second. A barometer that never moves sees the pressure fall as the low approaches, even if the storm itself isn't deepening at all. Changing to the moving frame splits the rate of change at a fixed place into two parts: the change seen by someone riding with the pattern, minus the pattern's velocity times the slope of the pressure. At Plymouth, on England's south coast, at midnight, the pressure was falling by about three point eight hectopascals per hour. [beat] The sliding pattern alone accounts for about three point two of them. [beat] The remaining zero point six is the storm itself changing as it moved. So most of what the barometer saw was the storm just arriving. This is the same idea as advection in the dot product movie, and we'll build it fully in the material derivative movie.

> 162 words · 9 sentences · 2 beats · 2744.175–2811.975 s (67.8 s; speech 61.9 s) · 45:44.18–46:51.98 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s46_recap
To sum up, coordinates are numbers that pin down a place, measured from an origin along chosen directions. Cartesian unit vectors are the same everywhere, while polar, cylindrical and spherical ones turn as you move. The arc length is the radius times the angle, in radians. Round Hurricane Ian's eye, polar coordinates split the wind into about thirty seven metres per second of spin and twelve and a half of inflow. And because theta hat turns, a steady spin still accelerates towards the eye. On the Earth, a degree of latitude is always about a hundred and eleven kilometres, but a degree of longitude is the radius times cosine phi times the angle: seventy four kilometres at Brest, and twenty three at Svalbard, because the parallels shrink towards the poles. Areas go with cosine phi too, so half of the Earth lies between thirty south and thirty north. The shortest route is a great circle. The Mercator map keeps shapes and bearings, and equal-area maps keep sizes. Turning the axes gives new components of the same arrow, like along and across a coast. And a Galilean change to a steadily moving frame changes velocities, but leaves accelerations, and a storm's spin, unchanged.

> 202 words · 11 sentences · 0 beats · 2811.975–2898.175 s (86.2 s; speech 81.9 s) · 46:51.98–48:18.18 (measured, dry run v2, shifted for the plan-v5 pointer fixes).

## s47_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for coordinates, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 56 words · 3 sentences · 0 beats · 2898.175–2921.075 s (22.9 s; speech 21.9 s) · 48:18.18–48:41.08 (measured, dry run v2, shifted for the plan-v5 pointer fixes).
