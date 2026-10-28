# ch00_cross_product_uses — "The cross product at work: from a spanner to the turning wind" (plan, movie-director 2026-10-28)

House style `movies/HOUSE_STYLE.md` (reference `ch00_dot_product_why` v6). Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice, our own words, maths spoken in words. Lines starting with ">" are notes and are not spoken.

**Measured, not estimated.** `tools/tts.py` dry run 2026-10-28 (`G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_cross_product_split\dryrun\v2_20261028\ch00_cross_product_uses`; current `movies/lexicon.yaml`, no new entries): **55 scenes, 374 sentences, 6058 words, 2420.675 s narration + 2.5-s silent end-card hold = 2423.175 s (40:23.18)**; speech alone 2265.2 s = 160.5 words per minute while speaking, **150.0 words per minute overall** (limit 150); 603 caption cues; self-check {'expected_s': 2420.675, 'audio_s': 2420.675, 'diff_ms': 0.0, 'len_ok': True, 'cues_ok': True}; Kokoro render 7489.3 s; warnings: none.

## s00_title
In this video, we'll learn how physics uses the cross product the easy way, and see how meteorology uses it to explain why the wind turns and why storms spin.

> 30 words · 1 sentences · 0.300–12.175 s (11.9 s; speech 11.1 s) · 0:00.30–0:12.18 (measured, dry run)
> **New scene.**

## s01_hook
Where does the cross product turn up in the real world? Let's see how it turns a bolt, spins a ball, steers a moving charge, and turns the wind on our spinning Earth.

> 33 words · 2 sentences · 12.175–23.900 s (11.7 s; speech 10.6 s) · 0:12.18–0:23.90 (measured, dry run)
> **New scene.**

## s01a_recap_arrow
First, a quick reminder of what the cross product is, which the cross product video builds step by step. Take two arrows lying flat on the floor: vector a with components five, one and zero, and vector b with components one, three and zero. Unlike the dot product, which gives a number, their cross product, a cross b, is another arrow, at right angles to both. For the z component, that's five times three, minus one times one, which is fourteen. The other two components are zero, so a cross b points straight up, fourteen units long.

> 97 words · 5 sentences · 23.900–63.500 s (39.6 s; speech 37.4 s) · 0:23.90–1:03.50 (measured, dry run)
> **New scene.**
> Related: #2 cross product

## s01b_recap_length
Its length has a simple meaning. Split b into two pieces: a part that lies along vector a itself, and a part straight across it. The length of vector a is about five point one, and the part of b across it is about two point seven five. Their product, about fourteen, is the length of a cross b: the area of the parallelogram the two arrows make. The part along doesn't count at all.

> 75 words · 5 sentences · 63.500–92.475 s (29.0 s; speech 26.8 s) · 1:03.50–1:32.47 (measured, dry run)
> **New scene.**
> Related: #2

## s01c_recap_direction
Its direction comes from the right-hand rule. Point the fingers of your right hand along the first arrow, and curl them towards the second, the short way round. Your thumb points along the cross product: here, straight up, towards you if you look down from above. The unit vectors along the axes follow the same rule: x hat cross y hat is z hat, y hat cross z hat is x hat, and z hat cross x hat is y hat. Swap the order, and the arrow flips: b cross a is minus a cross b, and x hat cross z hat is minus y hat.

> 106 words · 5 sentences · 92.475–131.900 s (39.4 s; speech 37.2 s) · 1:32.47–2:11.90 (measured, dry run)
> **New scene.**
> Related: #2

## s04_torque_recap
In that video, the cross product came from turning things. For a spanner, the arrow r from the bolt to your hand, crossed with your push, F, is the torque, tau: how strongly the push turns the bolt, and about which axis. Only the part of the push across the spanner turns it. Torque is measured in newton metres. That's the same unit as the joule, the unit of work, but torque is a different thing. Work is a dot product, a number, while torque is a cross product, an arrow along the axis of the turn. Now let's see where else nature uses this arrow.

> 106 words · 7 sentences · 131.900–172.050 s (40.2 s; speech 37.2 s) · 2:11.90–2:52.05 (measured, dry run)
> **New scene.**
> Related: #2 (torque anchor, minus sign)

## s22c_angular_momentum
First, a ball whirled round on a string. Let r be the arrow from the centre to the ball, half a metre long. The second arrow is the ball's momentum, p: its mass times its velocity. A two kilogram ball moving at three metres per second has a momentum of six. Then r cross p is called the angular momentum: how much spin the ball carries, and about which axis. Here it's zero point five times six, which is three, pointing straight up, because the ball goes round anticlockwise, seen from above. The string pulls along r, so it has no part across r, and it can't change the spin.

> 110 words · 7 sentences · 172.050–216.600 s (44.5 s; speech 41.7 s) · 2:52.05–3:36.60 (measured, dry run)

## s22f_spin_up
Now pull the string in, so the ball circles closer to the centre. The string pulls along r, so it still can't change the angular momentum: it stays three. If r shrinks to a quarter of a metre, half as long, the momentum must double to keep r cross p at three, so the ball whirls twice as fast. That's how a figure skater spins faster by pulling in her arms. Air spiralling into a hurricane does something similar: as it moves closer to the centre, it spins faster, which is part of why the strongest winds are near the eye. Friction with the sea takes some of that spin away, so the winds don't grow quite as fast as the string rule says.

> 124 words · 6 sentences · 216.600–262.600 s (46.0 s; speech 43.5 s) · 3:36.60–4:22.60 (measured, dry run)
> **New scene.**
> Related: #34 vorticity and PV, #45 tropical cyclones

## s22d_moving_charge
Second, a charged particle, like a proton, moving through a magnetic field. The first arrow is its velocity, v, and the second is the magnetic field, B. The push on the particle is its charge times v cross B. If it moves east and the field points straight up, v cross B is along x hat cross z hat, which is minus y hat: a push towards the south. This push is always at a right angle to the velocity. So it never speeds the particle up or slows it down. It only bends its path into a circle. That's how particle accelerators steer their beams round a ring.

> 109 words · 8 sentences · 262.600–306.925 s (44.3 s; speech 41.1 s) · 4:22.60–5:06.93 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s22d_moving_charge.

## s22g_aurora
The same push steers particles from the Sun around our planet. The Sun blows out a thin stream of charged particles, called the solar wind, and Earth's magnetic field reaches far out into space to meet it. The part of a particle's velocity across the field is bent into a circle, while the part along the field isn't touched at all, so the particle spirals along the field lines. The field lines dip down into the atmosphere near the magnetic poles, so that's where the particles arrive. About a hundred kilometres up, they hit the air and make it glow: the aurora, the northern and southern lights. On the night of the tenth of May, twenty twenty four, the strongest solar storm in about twenty years pushed the aurora far towards the equator, and satellites saw it glowing over Europe and North America.

> 143 words · 6 sentences · 306.925–360.850 s (53.9 s; speech 51.4 s) · 5:06.93–6:00.85 (measured, dry run)
> **New scene.**

## s22e_perp_push
Why does a push at right angles change only the direction? Let's try it with numbers. An air parcel moves east at ten metres per second. One sideways kick adds one metre per second towards the north. By Pythagoras, its new speed is the square root of ten squared plus one squared, about ten point zero five. It has turned by almost six degrees, and sped up a little. Now split that kick into ten kicks, each a tenth as big, and each at a right angle to the new direction. It turns by almost the same angle, but its speed only grows to about ten point zero zero five. With a hundred kicks, it's ten point zero zero zero five. So a push that acts all the time, always at a right angle, doesn't change the speed at all: it just bends the path into a circle. The push is at a right angle to the motion, so its dot product with the velocity is zero, and it does no work: it adds no energy of motion. That's the dot product video's rule, a push across the motion does no work, and here it comes from a cross product.

> 200 words · 12 sentences · 360.850–436.875 s (76.0 s; speech 71.4 s) · 6:00.85–7:16.88 (measured, dry run)
> New or changed sentences: “The push is at a right angle to the motion, so its dot product with th…” | “That's the dot product video's rule, a push across the motion does no …”
> Related: 0.1b dot product (perpendicular push)

## s19u_uses_grid
Let's put these three uses side by side. Torque is r cross F: how strongly a force turns something, and about which axis. Angular momentum is r cross p: how much spin a moving object carries, and about which axis. The push on a moving charge is its charge times v cross B, always at a right angle to its motion. In all three, only the parts at right angles count: the part of F across r, the part of p across r, and the part of v across B.

> 90 words · 5 sentences · 436.875–471.900 s (35.0 s; speech 32.8 s) · 7:16.88–7:51.90 (measured, dry run)
> **New scene.**

## s23_k_cross
Now let's see how weather uses the cross product. Meteorologists usually write a wind that blows flat along the ground as u. At any place on a map, let k be the unit vector pointing straight up, out of the ground. Think of k as an axle standing at that place: turning on a map happens around it. Take a wind blowing east at five metres per second, with components five, zero and zero. With the recipe, k cross u has components zero, five and zero, so it points north: an arrow as long as the wind, turned a quarter turn to the left around k. For a wind blowing east, north is exactly the direction ninety degrees to its left. For a wind blowing north, k cross u points west, again to its left. Let's turn the wind all the way round the compass. Wherever it points, k cross u stays exactly a quarter turn ahead, anticlockwise seen from above, and just as long. So k cross is a turning tool: it turns any flat arrow a quarter turn to the left, anticlockwise seen from above. Minus k cross u turns it to the right.

> 196 words · 12 sentences · 471.900–549.850 s (78.0 s; speech 73.3 s) · 7:51.90–9:09.85 (measured, dry run)
> New or changed sentences: “Let's turn the wind all the way round the compass.” | “Wherever it points, k cross u stays exactly a quarter turn ahead, anti…”

## s23a_why_turn
Why would we want an exact quarter turn? Not to change the wind: it names the direction straight to the wind's left, with the wind's own size. We need it because Earth's spin gives moving air a push that's always at a right angle to its motion, like the magnet's push on the proton. A push at any other angle, say thirty degrees off, would have a part along the wind, and would speed the air up or slow it down. The spin's push only turns the air. So we need the wind turned by exactly a quarter turn, times a number for its strength. The wind itself doesn't jump by ninety degrees: the push bends its path a little at a time, like our small kicks. And on weather maps, k cross turns the direction in which pressure rises into the direction the wind blows.

> 146 words · 8 sentences · 549.850–603.150 s (53.3 s; speech 50.0 s) · 9:09.85–10:03.15 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s23a_why_turn.

## s23b_wheel
Earth's spin is behind that push, so first let's see how the cross product describes anything that spins, starting with a wheel lying flat, like a potter's wheel. Its spin is an arrow too, called small omega, along the axle. Curl the fingers of your right hand the way the wheel turns, and your thumb points along small omega. Its length is how fast the wheel turns, in radians per second, where a full turn is two pi radians. Say the wheel turns anticlockwise, seen from above, at two radians per second, so small omega has components zero, zero and two. Take a point on the rim, with an arrow r from the axle to it, zero point three metres long, pointing along x. With the recipe, small omega cross r has components zero, zero point six and zero. That's exactly the rim's velocity: zero point six metres per second, along the rim, at a right angle to both the axle and r. Halfway to the axle, the speed is half as big, and at the axle itself, the wheel doesn't move at all. In the curl and vorticity videos, we'll see that the curl of this velocity is twice small omega, which is how meteorologists measure spin.

> 208 words · 10 sentences · 603.150–686.025 s (82.9 s; speech 78.9 s) · 10:03.15–11:26.02 (measured, dry run)
> **New scene.**
> Related: #8 curl, #34 vorticity

## s24_spin
Now let's see where this push comes from. Earth spins once a day around the axis through its poles. We draw this spin as an arrow, Omega, along the axis. Curl your right-hand fingers the way Earth turns, from west to east, and your thumb points to the North Pole. So, seen from above the North Pole, Earth turns anticlockwise. Omega's length is how fast Earth turns. A full turn is two pi radians, the angle unit of calculus. Measured against the distant stars, one turn takes twenty three hours and fifty six minutes, a little less than a day. So Omega is about seven point two nine times ten to the minus five radians per second.

> 117 words · 9 sentences · 686.025–734.900 s (48.9 s; speech 45.3 s) · 11:26.02–12:14.90 (measured, dry run)
> New or changed sentences: “So, seen from above the North Pole, Earth turns anticlockwise.”

## s25a_position_vector
To follow a place on the spinning Earth, we first say where it is. Draw an arrow from Earth's centre to the place: the position vector, r. Its length is Earth's radius, about six thousand three hundred and seventy one kilometres, and it points from the centre out through the place. Let's cut Earth in half through its axis and our place, to see inside. Our place is at forty five degrees north: that angle, measured at the centre from the equator, is the latitude, phi. Let the x axis point from the centre to the equator below our place, and the z axis along Earth's axis. Then r has components of about four thousand five hundred and five kilometres along x, zero along y, and four thousand five hundred and five along z.

> 134 words · 7 sentences · 734.900–786.400 s (51.5 s; speech 48.6 s) · 12:14.90–13:06.40 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s25a_position_vector.

## s25_ground_speed
How fast does our place move? As Earth turns, it goes round its circle of latitude, whose centre is on Earth's axis. So the circle's radius is the place's distance from the axis. Call theta the angle between the axis, Omega, and r. Then that distance is the length of r times sine theta. Here theta is ninety degrees minus the latitude, forty five degrees, so the radius is about four thousand five hundred and five kilometres. In one turn, the place travels two pi times the radius, and one turn takes two pi over Omega seconds. Dividing, the two pis cancel: the speed is Omega, times the length of r, times sine theta.

> 114 words · 8 sentences · 786.400–835.225 s (48.8 s; speech 45.6 s) · 13:06.40–13:55.23 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s25_ground_speed.

## s25b_direction
That's exactly the length of Omega cross r. And the place moves along its circle, towards the east, at a right angle to the axis and to r. Curl your fingers from Omega towards r, and your thumb points east. So length and direction both match: the ground's velocity is Omega cross r. With the recipe, Omega has components zero, zero and seven point two nine times ten to the minus five. So Omega cross r has components zero, seven point two nine times ten to the minus five times four million five hundred and five thousand metres, and zero. That's about three hundred and twenty nine metres per second, towards the east. At the equator, it's about four hundred and sixty five, faster than sound, and at the poles, it's zero.

> 132 words · 8 sentences · 835.225–890.200 s (55.0 s; speech 51.7 s) · 13:55.23–14:50.20 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s25b_direction.

## s26_coriolis_effect
Now imagine air moving across this spinning ground. We turn with Earth, so we judge the air's motion against the turning ground, and moving air seems to drift sideways. This apparent push is called the Coriolis effect. In the Northern Hemisphere, the half of Earth north of the equator, it turns moving air to the right, and in the Southern Hemisphere, to the left. The Coriolis video goes through all of this in full, with many more examples, so here we'll follow the cross products. Let's work out where it comes from.

> 92 words · 6 sentences · 890.200–926.800 s (36.6 s; speech 34.1 s) · 14:50.20–15:26.80 (measured, dry run)
> New or changed sentences: “The Coriolis video goes through all of this in full, with many more ex…”
> Related: #29 Coriolis

## s26a_merry_go_round
It's easiest to see on a merry-go-round: a flat disc spinning anticlockwise, seen from above, with its spin arrow, Omega, pointing up. Roll a ball across it, with nothing to rub or push it. Someone standing beside it, not turning, sees the ball roll in a straight line. But a rider turns underneath the ball, so to the rider, its path curves to the right. It's the same ball. The rider just measures its motion against a turning floor.

> 79 words · 6 sentences · 926.800–960.200 s (33.4 s; speech 30.8 s) · 15:26.80–16:00.20 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s26a_merry_go_round.

## s26b_two_views
Let's write down what each one sees. The rider measures the ball's velocity over the floor: call it u. The floor under the ball moves at Omega cross r, where r is the arrow from the centre to the ball. So the outside watcher sees the ball's velocity as u plus Omega cross r. Newton's law works for this watcher, who isn't turning. With nothing pushing the ball, this velocity doesn't change. So let's see how u plus Omega cross r changes. Two pieces of it change, and each gives an Omega cross u.

> 94 words · 8 sentences · 960.200–998.600 s (38.4 s; speech 35.1 s) · 16:00.20–16:38.60 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s26b_two_views.

## s26c_carried_arrow
The first piece is the arrow u itself. Say the rider sees the ball keep the same velocity across the floor. But the floor turns, and the rider's directions turn with it. So from outside, the arrow u swings round with the floor. Any arrow carried round by the spin changes at Omega cross that arrow, just as r did. That's the first Omega cross u.

> 66 words · 6 sentences · 998.600–1026.075 s (27.5 s; speech 24.9 s) · 16:38.60–17:06.08 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s26c_carried_arrow.

## s26d_new_ground
The second piece is the floor's speed under the ball. The ball moves to a new place, where the floor moves differently: fast near the edge, and hardly at all near the centre. The floor's velocity is Omega cross r. When the ball's position changes by u every second, Omega cross r changes by Omega cross u every second. That's the second Omega cross u. One more piece comes from the ball being carried round with the floor itself. It doesn't depend on u, and we'll come back to it.

> 90 words · 7 sentences · 1026.075–1062.900 s (36.8 s; speech 33.9 s) · 17:06.08–17:42.90 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s26d_new_ground.

## s27_coriolis_term
Now let's add the pieces. A push for each kilogram is just an acceleration: how much the velocity changes every second. The change seen from outside is the change of u that the rider sees, plus two Omega cross u, plus the leftover piece. Newton's law says this equals the real pushes on each kilogram, like the pressure push. Move the extra pieces to the other side, and the rider sees u change by the real pushes, minus two Omega cross u, minus the leftover piece. So minus two Omega cross u is the Coriolis push, for each kilogram. The two comes from the two equal pieces, and the minus from moving them to the rider's side. The leftover piece is the centrifugal effect, pulling outwards from the axis. On Earth, the slight bulge at the equator balances it, so it's already part of gravity, and we can leave it out.

> 151 words · 9 sentences · 1062.900–1124.325 s (61.4 s; speech 57.8 s) · 17:42.90–18:44.33 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s27_coriolis_term.

## s27a_minus_check
What does the minus mean? On the merry-go-round, Omega points up, so Omega cross u points to the left of the ball's motion. The minus flips it to the right, against the floor's turning: the curve the rider saw. Let's check with a computer. We follow the ball from outside, where it rolls straight, and redraw its path as the rider sees it. Then we use only the rider's equation, with the Coriolis push and the centrifugal pull. The two curves land exactly on top of each other.

> 88 words · 7 sentences · 1124.325–1160.750 s (36.4 s; speech 33.5 s) · 18:44.33–19:20.75 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s27a_minus_check.

## s28a_local_axes
On Earth, the floor is a sphere, and the spin arrow is tilted. Let's stand at one place, at forty five degrees north, and use three directions there: east, north, and up. Up is k, straight out of the ground. These three are all there are, because space has three dimensions. Omega isn't a fourth direction: it points along Earth's axis, so at our place it leans partly north and partly up. Just as we split b, let's split Omega into a north part, Omega times cosine phi, and an up part, Omega times sine phi. At forty five degrees, both are about five point one six times ten to the minus five. So Omega has components zero, Omega cosine phi, and Omega sine phi. At the North Pole, Omega points straight up, and at the equator it lies flat, pointing north.

> 142 words · 9 sentences · 1160.750–1218.000 s (57.2 s; speech 53.6 s) · 19:20.75–20:18.00 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s28a_local_axes.

## s28b_components
Large-scale winds blow almost flat, so let's take a flat wind. Its eastward part is small u, its northward part is v, and its up part is zero. Now we find Omega cross u with the recipe. The east component is Omega's north part times zero, minus its up part times v: minus Omega sine phi times v. The north component is Omega's up part times small u, minus zero: Omega sine phi times small u. And the up component is zero times v, minus Omega's north part times small u: minus Omega cosine phi times small u.

> 98 words · 6 sentences · 1218.000–1259.950 s (42.0 s; speech 39.4 s) · 20:18.00–20:59.95 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s28b_components.

## s28c_flat_part
Look at the first two components. Both start with Omega sine phi, followed by minus v and small u. That's exactly k cross u, our quarter turn to the left, with components minus v, small u and zero. So the flat part of Omega cross u is Omega sine phi times k cross u, from the up part of Omega only. The third component points up or down. For a wind of ten metres per second at forty five degrees, the push it gives is about one thousandth of a metre per second squared, ten thousand times weaker than gravity, so we drop it. What's left is the sideways push: minus two Omega sine phi, times k cross u.

> 119 words · 7 sentences · 1259.950–1306.725 s (46.8 s; speech 43.9 s) · 20:59.95–21:46.72 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s28c_flat_part.

## s28_f
Two Omega sine phi has its own name: the Coriolis parameter, f. So for flat winds, the Coriolis push is minus f times k cross u. Only Earth's spin about the local up direction turns flat winds sideways. At the North Pole, the ground spins about up at the full rate, like our merry-go-round. At the equator, there's no spin about up at all. At forty five degrees north, f is two times seven point two nine times ten to the minus five, times sine forty five. That's about one point zero three times ten to the minus four per second. South of the equator, the latitude counts as negative, so sine phi and f are negative too.

> 118 words · 8 sentences · 1306.725–1355.350 s (48.6 s; speech 45.4 s) · 21:46.72–22:35.35 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s28_f.

## s29_turn_rule
Now the turning tool does its job. The term k cross u is the wind turned a quarter turn to the left, and the minus sign flips it to the right. In the Northern Hemisphere, f is positive, so the push points to the right of the wind. In the Southern Hemisphere, f is negative, which flips it once more, to the left. At the equator, f is zero, and there's no turning at all.

> 75 words · 5 sentences · 1355.350–1383.200 s (27.9 s; speech 25.7 s) · 22:35.35–23:03.20 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s29_turn_rule.

## s30_coriolis_size
How strong is it? Take a wind of ten metres per second at forty five degrees north. The push is f times the wind speed: one point zero three times ten to the minus four, times ten. That's about one millimetre per second, every second. That's tiny, but it never stops, and it always acts at a right angle to the wind. If nothing else pushed the air, it would turn the wind round a full circle, without changing its speed. Because the push never speeds the air up or slows it down, the Coriolis effect only steers. Going once round the circle takes two pi over f, about seventeen hours. This loop is called an inertial circle, and the Coriolis video finds loops like it in real ocean drifters.

> 130 words · 9 sentences · 1383.200–1435.875 s (52.7 s; speech 49.1 s) · 23:03.20–23:55.88 (measured, dry run)
> New or changed sentences: “Because the push never speeds the air up or slows it down, the Corioli…” | “Going once round the circle takes two pi over f, about seventeen hours…” | “This loop is called an inertial circle, and the Coriolis video finds l…”
> Related: #29 Coriolis

## s31_globe_paths
Let's watch this on the globe. Here are two air parcels: one over south-west France, at forty five degrees north, and one over Patagonia, in Argentina, at forty five degrees south. Both are set moving towards the east at ten metres per second, with nothing else pushing them. The northern one curves to the right, towards the south. The southern one curves to the left, towards the north. Both trace loops about two hundred kilometres across, turning in opposite directions.

> 80 words · 6 sentences · 1435.875–1470.900 s (35.0 s; speech 32.5 s) · 23:55.88–24:30.90 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s31_globe_paths.

## s32_reanalysis
Now let's look at real winds. These come from a reanalysis: a best estimate of the weather everywhere, on a regular grid. It's made by combining millions of measurements with a weather forecast model. Let's average them over the thirty years from nineteen ninety one to twenty twenty. Near the ground, they show a clear pattern. Around thirty degrees north and south sit belts of high pressure. They're called the subtropical highs.

> 72 words · 7 sentences · 1470.900–1503.800 s (32.9 s; speech 30.0 s) · 24:30.90–25:03.80 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s32_reanalysis.

## s33_trades
Air flows out of these highs towards the equator. In the Northern Hemisphere, it heads south, and the Coriolis effect turns it to the right, towards the west, so it blows from the north east. In the Southern Hemisphere, it heads north and is turned to the left, again towards the west, so it blows from the south east. These steady winds are the trade winds, which sailing ships once used to cross the oceans. Over the oceans at fifteen degrees north and south, they blow towards the west at about five to seven metres per second. Over the Atlantic and the Pacific, the winds on both sides of the equator lean towards the west, and towards the equator.

> 119 words · 6 sentences · 1503.800–1548.800 s (45.0 s; speech 42.4 s) · 25:03.80–25:48.80 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s33_trades.

## s34_westerlies
Air also flows out of the subtropical highs towards the poles. In the Northern Hemisphere, it heads north and is turned to the right, towards the east. In the Southern Hemisphere, it heads south and is turned to the left, again towards the east. These are the westerlies, named, like all winds, after the direction they blow from. At forty five degrees north and south, they blow towards the east at about three to seven and a half metres per second, strongest over the Southern Ocean, where little land slows them down. Pressure patterns and friction shape these winds too, but the Coriolis turning is why they blow mostly east or west. The video on the general circulation explains these wind belts in full.

> 124 words · 7 sentences · 1548.800–1598.875 s (50.1 s; speech 47.2 s) · 25:48.80–26:38.88 (measured, dry run)
> New or changed sentences: “The video on the general circulation explains these wind belts in full…”
> Related: #48 general circulation

## s35_storms
The cross product also explains why storms spin. A hurricane is a huge storm, hundreds of kilometres across. It forms over warm ocean, around a centre of very low pressure. Air near the surface is pushed towards that low centre from every side.

> 43 words · 4 sentences · 1598.875–1618.950 s (20.1 s; speech 18.2 s) · 26:38.88–26:58.95 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s35_storms.

## s36_ian
This is Hurricane Ian, seen from a weather satellite on the twenty eighth of September, twenty twenty two. Its calm centre, called the eye, is just off the south west coast of Florida, and its cloud bands curl around it. That afternoon, Ian reached the coast with winds of about sixty seven metres per second, the forecasters' best estimate from the observations. Now let's add the winds near the ground, from a weather model with a fine, three kilometre grid. In the Northern Hemisphere, each stream of air heading for the centre is turned to the right: air from the south towards the east, and air from the east towards the north. All the way round, these turned streams add up to an anticlockwise spin, seen from above. Friction near the ground slows the wind, so the air still spirals inwards as it turns.

> 144 words · 7 sentences · 1618.950–1675.650 s (56.7 s; speech 53.8 s) · 26:58.95–27:55.65 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s36_ian.
> Related: #45 tropical cyclones

## s37_idai
Now the Southern Hemisphere. This is Cyclone Idai, seen from a satellite on the fourteenth of March, twenty nineteen, in the channel between Mozambique and Madagascar. In this part of the world, storms like this are called cyclones. Near its peak, its winds reached about fifty four to fifty nine metres per second, again from the forecasters' best estimates. Its cloud bands curl the other way. Here f is negative, so air heading for the centre is turned to the left, and the storm spins clockwise, seen from above. It's the same physics, with the opposite sign of f.

> 99 words · 7 sentences · 1675.650–1718.025 s (42.4 s; speech 39.5 s) · 27:55.65–28:38.03 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s37_idai.

## s38_spin_sign
The cross product can even measure the spin. At points around each storm, draw an arrow r from the centre, and take r cross u with the wind there. If the wind goes round anticlockwise, seen from above, the right-hand rule makes r cross u point up. For Ian, the arrows point up all the way round. For Idai, they all point down: clockwise, seen from above. Both storms spin the way the Coriolis effect turns the air. The vorticity video measures this spin properly, for every storm on the map.

> 91 words · 7 sentences · 1718.025–1756.050 s (38.0 s; speech 35.1 s) · 28:38.03–29:16.05 (measured, dry run)
> New or changed sentences: “The vorticity video measures this spin properly, for every storm on th…”
> Related: #34 vorticity

## s39_isobars
Now the last application: how the wind blows around highs and lows. Air presses on everything around it. This pressure is measured in hectopascals, and at sea level it's about a thousand hectopascals. Here's a simple weather map with one low in the middle. Joining the places with the same pressure gives lines called isobars. Here they're drawn every four hectopascals, and they circle the low.

> 66 words · 6 sentences · 1756.050–1786.325 s (30.3 s; speech 27.7 s) · 29:16.05–29:46.33 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s39_isobars.

## s40_pressure_push
Pick a place south of the low. The pressure gradient, grad p, points the way the pressure increases fastest. Here, that's straight across the isobars, away from the low, towards the south. The gradient video builds grad p step by step. Air is pushed the other way, from high pressure towards low. This push, for each kilogram of air, is minus one over rho times grad p. Here rho is the density of the air, about one point two kilograms per cubic metre.

> 83 words · 7 sentences · 1786.325–1822.000 s (35.7 s; speech 32.8 s) · 29:46.33–30:22.00 (measured, dry run)
> New or changed sentences: “The gradient video builds grad p step by step.”
> Related: #6 gradient

## s40a_k_cross_gradp
Now let's use the turning tool on grad p. k cross grad p is grad p turned a quarter turn to the left. Grad p points south, so k cross grad p points east. Grad p crosses the isobars at a right angle, so a quarter turn brings it exactly along them. Looking along this new arrow, the low is on its left, and the high is on its right.

> 70 words · 4 sentences · 1822.000–1847.550 s (25.5 s; speech 23.7 s) · 30:22.00–30:47.55 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s40a_k_cross_gradp.

## s41_adjust
Let's zoom in on this place, where the isobars run almost straight, from west to east. Follow an air parcel that starts at rest. The pressure push starts it moving towards the low, but as soon as it moves, the Coriolis effect turns it to the right. The faster it goes, the stronger the turning push, and it keeps turning until it blows along the isobars. It overshoots and makes a series of loops, but on average it moves along the isobars, from west to east.

> 86 words · 5 sentences · 1847.550–1880.500 s (33.0 s; speech 30.7 s) · 30:47.55–31:20.50 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s41_adjust.

## s41a_balance
Why does it end up along the isobars? In steady flow, the air isn't speeding up, slowing down, or turning, so the pushes on it add up to zero. Only two pushes act here, so they must be equal in size and opposite in direction. The pressure push points towards the low, so the Coriolis push must point towards the high. And the Coriolis push is the wind turned a quarter turn to the right. So the wind must blow along the isobars, with the high on its right and the low on its left. This is called geostrophic balance, and the wind it gives is the geostrophic wind. The geostrophic wind video explores this balance in full, on many real maps.

> 122 words · 8 sentences · 1880.500–1928.625 s (48.1 s; speech 44.9 s) · 31:20.50–32:08.62 (measured, dry run)
> New or changed sentences: “The geostrophic wind video explores this balance in full, on many real…”
> Related: #30 geostrophic wind

## s42_geo_equation
Now the same steps as maths, one at a time. The two pushes add up to zero: minus f k cross u, minus one over rho grad p, equals zero. Move the pressure push to the other side: minus f k cross u equals one over rho grad p. To get the wind itself, we apply k cross to both sides. On the left, we get k cross k cross u. Turning the wind twice to the left points it backwards, so that's minus u. The two minus signs cancel, and the left side becomes f times u. The video on vector identities shows rules like this one for any three arrows. Dividing by f, we get the geostrophic wind: u equals one over f rho, times k cross grad p.

> 131 words · 9 sentences · 1928.625–1980.700 s (52.1 s; speech 48.5 s) · 32:08.62–33:00.70 (measured, dry run)
> New or changed sentences: “The video on vector identities shows rules like this one for any three…”
> Related: #10A vector identities

## s43_geo_pieces
Read it from right to left. Grad p points across the isobars, towards high pressure. k cross turns it a quarter turn to the left, along the isobars, with the low on the left. One over f rho sets the speed: the closer the isobars, the stronger the wind. And near the equator, f goes to zero, so this balance breaks down there.

> 63 words · 4 sentences · 1980.700–2006.375 s (25.7 s; speech 23.8 s) · 33:00.70–33:26.38 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s43_geo_pieces.

## s44_geo_numbers
Let's put in numbers at our place. The pressure drops by four hectopascals over four hundred kilometres going north. Four hectopascals is four hundred pascals, so grad p has components zero and minus four hundred pascals over four hundred thousand metres. That's minus ten to the minus three pascals per metre. Turned to the left, k cross grad p has components ten to the minus three and zero, pointing east. Next, f times rho is one point zero three times ten to the minus four, times one point two, about one point two four times ten to the minus four. Dividing, the wind blows east at about eight point one metres per second. A pascal is a kilogram per metre per second squared, so the units leave metres per second. As a check, the Coriolis push points south and the pressure push north, and both are about eight point three times ten to the minus four metres per second squared.

> 160 words · 9 sentences · 2006.375–2072.375 s (66.0 s; speech 62.4 s) · 33:26.38–34:32.38 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s44_geo_numbers.

## s45_storm_map
Now let's test it on a real storm. This is Storm Ciarán, seen from a satellite early in the afternoon of the second of November, twenty twenty three. This deep low crossed the North Atlantic and hit north-western France and southern England, whose borders are drawn as thin lines. Let's add the isobars from the reanalysis at the same time, every four hectopascals. Near the ground, friction disturbs the wind, so let's look about one and a half kilometres up, where the air feels almost no friction. The violet arrows are the geostrophic wind there, worked out with our formula from the pressure pattern. They run along the isobars, anticlockwise round the low, with the low on their left, and they're longest where the isobars crowd together.

> 127 words · 7 sentences · 2072.375–2124.325 s (51.9 s; speech 49.1 s) · 34:32.38–35:24.32 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s45_storm_map.
> Related: #42 extratropical cyclones

## s46_real_winds
Now let's add the real winds at the same height, from the reanalysis. They're drawn in a second colour. Over the sea, they point almost exactly the same way as the geostrophic arrows. They're a little slower, though, about fifteen percent near this tight low. That's because the air is racing round a sharp curve, which our simple balance leaves out. Down near the ground, it's different. Friction slows the air and turns it partly across the isobars, towards the low. So from nothing more than a pressure map and a cross product, we get the direction of the wind above the ground almost exactly, and its speed to within about a sixth.

> 113 words · 8 sentences · 2124.325–2169.025 s (44.7 s; speech 41.5 s) · 35:24.32–36:09.03 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s46_real_winds.

## s46a_today
Does the same rule work on today's weather? Here's a weather-service analysis of the North Atlantic for the evening of the twenty seventh of October, twenty twenty six, with its isobars every four hectopascals. The violet arrows are our geostrophic wind, worked out from the pressure map alone. The real winds near the ground blow a little slower, and they cross the isobars towards the lows, just as we saw for Ciarán. So a pressure map and a cross product tell a forecaster, at a glance, which way the wind is blowing almost everywhere away from the equator.

> 98 words · 5 sentences · 2169.025–2208.700 s (39.7 s; speech 37.5 s) · 36:09.03–36:48.70 (measured, dry run)
> **New scene.**
> Related: #30 geostrophic wind

## s46b_ekman
The same quarter turn works in the ocean too. When the wind blows over the sea, it drags the top layer of water along, and the Coriolis effect turns the moving water. Added up over the whole top layer, a few tens of metres deep, the water ends up moving at a right angle to the wind: to the right in the Northern Hemisphere, and to the left in the Southern. This flow is called the Ekman transport. The wind's drag on each square metre of sea is an arrow called the wind stress, tau, and the Ekman transport is minus one over f, times k cross tau. The water right at the surface turns less, about forty five degrees in the simplest theory; it's the whole layer, added up, that moves at ninety degrees.

> 135 words · 6 sentences · 2208.700–2259.225 s (50.5 s; speech 48.0 s) · 36:48.70–37:39.22 (measured, dry run)
> **New scene.**
> Related: #31 Ekman layers

## s46c_upwelling
This has a big effect along some coasts. Off California, in spring and summer, the wind often blows from the north, along the coast. The Ekman transport is a quarter turn to the right of it, so the top layer of water moves away from the coast, out to sea. Colder water rises from below to take its place. This is called coastal upwelling, and sea temperature maps from satellites show it as a strip of cold water along the shore. The rising water brings nutrients up from the deep, which helps make these waters so rich in fish. To measure it, oceanographers take the dot product of the Ekman transport with an arrow pointing offshore: first a cross product, then a dot product.

> 124 words · 7 sentences · 2259.225–2307.250 s (48.0 s; speech 45.1 s) · 37:39.22–38:27.25 (measured, dry run)
> **New scene.**
> Related: #31 Ekman layers, #55 eastern boundary currents and upwelling, 0.1b dot product

## s47_recap
To sum up, the cross product measures how much one arrow reaches across another, and about which axis. For a spanner, r cross F is the torque. For a whirling ball, r cross p is its angular momentum, which a pull along the string can't change, so pulling in makes it spin faster. For a moving charge, the push is its charge times v cross B, which steers particles from the Sun into the aurora. A push always at a right angle to the motion does no work: it turns a motion without speeding it up. For a spinning wheel, and for the spinning Earth, each point moves at the spin cross r. Moving air feels the Coriolis push, minus two Omega cross u, and for flat winds that's minus f k cross u: to the right in the north, and to the left in the south. That's why storms spin. When this push balances the pressure push, we get the geostrophic wind, one over f rho times k cross grad p, along the isobars. And in the ocean, the same quarter turn moves the top layer at a right angle to the wind, which brings cold water up along some coasts. Later videos in this series take the Coriolis effect, the geostrophic wind and the Ekman layer much further, with more real maps and real storms.

> 227 words · 11 sentences · 2307.250–2393.850 s (86.6 s; speech 82.3 s) · 38:27.25–39:53.85 (measured, dry run)
> **New scene.**
> Related: #29, #30, #31

## s48_end
This video is one of a series of related tutorials, so watch out for the others. They're made to help students of meteorology, oceanography, atmospheric and climate science, and anyone else who wants to learn not just these ideas, but the maths behind them too. The notebook for the cross product in physics, and the notebooks for the other concepts, are on the website that goes with this video.

> 69 words · 3 sentences · 2393.850–2420.675 s (26.8 s; speech 25.8 s) · 39:53.85–40:20.68 (measured, dry run)
> **New scene.**
> Related: #2, #8, #29, #30, #31, #45
