# ch00_cross_product_why — v4 DRAFT narration (re-plan from the user's review of v2, UV2-01 … UV2-31)

Draft for `movies/ch00/ch00_cross_product_why/v4_draft/` (not yet the live source). House style `movies/HOUSE_STYLE.md`
(reference `ch00_dot_product_why` v6). Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice. Our own words;
maths spoken in words. Decision change: U-CP.4 ("no rotating-frame derivation") is overridden by the user (UV2-20,
UV2-22 … UV2-24): v = Ω × r, −2Ω × u and −2Ω × u → −f k × u are derived here.

**Measured timing** is in the table in `changes.md` and in `storyboard.yaml` (`t`, `sentence_times`) from the
`tools/tts.py` dry run of this file; each scene note below gives words · sentences · measured seconds.

Spoken-letter rules (unchanged): the vector a is said only as "vector a " + a word, or inside "a dot b" / "a cross b"
(lexicon overrides); never "vector a," or "vector a." and no spoken subscripts. The wind's components are said as
"its eastward part, small u" only where the vector u and its component would collide (s28b).

Lines starting with ">" are notes and are not spoken.

## s00_title
In this video, we'll learn about the cross product, and see how this is used in meteorology to explain why the wind turns and why storms spin.

> 27 words · 1 sentences · 0.000–10.700 s (10.7 s; speech 9.6 s) · 0:00.00–0:10.70 (measured, dry run).

> UV2-01 (user's words verbatim).

## s01_hook
What is the cross product? Let's see what it is, why it's built the way it is, and what it tells us about the wind.

> 25 words · 2 sentences · 10.700–19.400 s (8.7 s; speech 7.6 s) · 0:10.70–0:19.40 (measured, dry run).

> UV2-02 (user's words verbatim).

## s02_dot_recall
In the last video, we met the dot product. We took vector a with components five and one, and vector b with components one and three, and found that a dot b equals eight. In pictures, it was the shadow of one arrow on the other, times the other arrow's length. In weather, v dot grad T told us how fast the wind carries air into warmer or colder places, on a map of isotherms, the lines of equal temperature. The dot product is a number, and it measures how much two arrows agree.

> 94 words · 5 sentences · 19.400–55.500 s (36.1 s; speech 33.9 s) · 0:19.40–0:55.50 (measured, dry run).

> Narration unchanged (approved link to the last video, U-CP.2). Visual: UV2-03 component legs 5/1 and 1/3 on the plot.

## s03_door
But a number can't describe everything. Imagine pushing a door open. Draw one arrow from the hinge to your hand, along the door. Then draw a second arrow for your push. When you push at a right angle to the door, the dot product of these two arrows is zero. Yet the door turns the most. When you push along the door, straight towards the hinge, the dot product is as large as it can be. Yet the door doesn't turn at all. So for turning, the dot product gets things backwards.

> 92 words · 9 sentences · 55.500–91.925 s (36.4 s; speech 32.8 s) · 0:55.50–1:31.92 (measured, dry run).

> Narration unchanged. Visual: UV2-04 (r label fully inside the frame).

## s04_left_right
There's a second problem. Suppose the wind blows north, and something pushes it sideways, to the east or to the west. Both pushes are at right angles to the wind, so both dot products are zero. The dot product can't tell a push to the right from a push to the left. A turning also has an axis: the door swings around the line of its hinge. So we need a new product, one that's largest at right angles, and that gives an arrow along an axis. That's the cross product.

> 91 words · 7 sentences · 91.925–127.075 s (35.2 s; speech 32.2 s) · 1:31.92–2:07.08 (measured, dry run).

> Unchanged.

## s05_axes
The cross product lives in three dimensions, so let's add a third axis. Here x points east, y points north, and z points straight up. The unit vectors along them are called x hat, y hat and z hat. Each one is one unit long. Our two arrows lie flat on the floor, so their third components are zero. Vector a becomes five, one, zero, and vector b becomes one, three, zero.

> 72 words · 6 sentences · 127.075–157.275 s (30.2 s; speech 27.6 s) · 2:07.08–2:37.28 (measured, dry run).

> Narration unchanged. Visual: UV2-05 component legs and labels from the first frame.

## s06_recipe
So how do we find the cross product? Since the answer is an arrow, we need to know how far it reaches along x, along y and along z: its three components. For the x component, we leave out the x parts and use only the y and z parts. We take the y part of vector a times the z part of b, and subtract the z part of vector a times the y part of b. The y component leaves out the y parts and uses z and x. The z component leaves out the z parts and uses x and y. Each pair follows the cycle x, y, z, and back to x, with a minus sign between the two products. We'll soon see why it's built like this.

> 132 words · 8 sentences · 157.275–204.425 s (47.2 s; speech 43.9 s) · 2:37.28–3:24.43 (measured, dry run).

> UV2-06: the "three components, each one has a recipe" sentences rewritten in plain words.

## s07_worked
Let's try it on our two arrows. The x component is one times zero, minus zero times three, which is zero. The y component is zero times one, minus five times zero, also zero. The z component is five times three, minus one times one: fifteen minus one, which is fourteen. So a cross b has components zero, zero and fourteen: an arrow fourteen units long, pointing straight up, out of the floor where the two arrows lie. Because the answer is a vector, the cross product is also called the vector product.

> 93 words · 6 sentences · 204.425–243.925 s (39.5 s; speech 37.0 s) · 3:24.43–4:03.93 (measured, dry run).

> Narration unchanged. Visual: UV2-07 (component labels on the figure; a = (5, 1, 0), b = (1, 3, 0) top left).

## s08_sine
Now let's look at how the angle between the two arrows plays a role. The dot product used the two lengths times the cosine of theta. The length of the cross product uses the sine instead: the length of vector a times the length of b, times sine theta. Let's check it. By Pythagoras, the length of vector a is the square root of five squared plus one squared, the square root of twenty six, about five point one. The length of b is the square root of one squared plus three squared, the square root of ten, about three point one six. Dividing the dot product, eight, by the two lengths gives a cosine of about point five. So theta is about sixty degrees, with a sine of about point eight seven. Multiplied out, that's about fourteen, the length we found from the components.

> 145 words · 9 sentences · 243.925–300.475 s (56.6 s; speech 53.0 s) · 4:03.93–5:00.48 (measured, dry run).

> UV2-08 (component labels on every drawn vector), UV2-09 (lengths computed here, no reference back).

## s09_area
Now let's find a picture for this number. Drop a line from the tip of vector a straight onto b's line, at a right angle. For the dot product, the piece it marked off along b was the shadow. This time, look at the dropped line itself: it's the height of vector a above b's line. Its length is the length of vector a times sine theta, about four point four three. Now slide a copy of b to the tip of vector a and a copy of vector a to the tip of b. Together they make a slanted box called a parallelogram. Its area is the base times the height: three point one six times four point four three, about fourteen. So the length of a cross b is the area of the parallelogram the two arrows make.

> 140 words · 9 sentences · 300.475–353.075 s (52.6 s; speech 49.0 s) · 5:00.48–5:53.07 (measured, dry run).

> Small wording change (UV2-09 spirit: no "in the last video"); visual unchanged.

## s09a_box_proof
But why does the recipe, five times three minus one times one, give this area too? Draw a box around the parallelogram, six along and four up. Its area is twenty four. The box has six pieces left over. Two triangles sit along vector a and each is half of five times one, so together they make five. Two triangles along b, each half of one times three, make three. And two small corner squares, each one by one, make two. So the parallelogram is twenty four, minus five, minus three, minus two, which is fourteen. Do the same steps with letters, and almost everything cancels. What's left is the x part of vector a times the y part of b, minus the y part of vector a times the x part of b. That's exactly the z recipe: an area formula in disguise.

> 144 words · 11 sentences · 353.075–413.375 s (60.3 s; speech 56.0 s) · 5:53.07–6:53.38 (measured, dry run).

> NEW (UV2-10: why the recipe is built this way).

## s10_right_angles
The direction is just as neat. The cross product a cross b is at a right angle to both arrows. We can check it with the dot product. A right angle gives a dot product of zero. Zero times five, plus zero times one, plus fourteen times zero, is zero. The same happens with b. But there are two directions at right angles to the floor: up and down. Which one does the cross product choose? That's what the right-hand rule tells us.

> 83 words · 9 sentences · 413.375–448.525 s (35.1 s; speech 31.6 s) · 6:53.38–7:28.52 (measured, dry run).

> Unchanged.

## s11_rhr_curl
Hold out your right hand. Point your fingers along vector a so they follow the first arrow. Now curl your fingers towards b, the second arrow, the short way round. Your thumb now points along a cross b: straight up. Let's walk around it. From every side, the curl, the thumb and the arrow agree.

> 55 words · 6 sentences · 448.525–472.800 s (24.3 s; speech 21.7 s) · 7:28.52–7:52.80 (measured, dry run).

## s12_rhr_flat
There's a second way to use the same hand. Point your index finger along vector a and your middle finger along b. Bend the middle finger away from your palm. Then stick your thumb straight up. Your thumb again points along a cross b. So the index finger is the first arrow, and the middle finger is the second. The thumb is the answer.

> 64 words · 7 sentences · 472.800–499.575 s (26.8 s; speech 23.9 s) · 7:52.80–8:19.57 (measured, dry run).

## s13_rhr_screw
A third way uses a bottle cap. Turn the cap from vector a towards b, the short way round. Seen from above, that's anticlockwise, the way you open a bottle, and the cap rises, up along a cross b. Turn it back, from b towards the first arrow, and the cap screws down. A screw works the same way: turned from the first arrow towards the second, it moves along their cross product.

> 73 words · 5 sentences · 499.575–528.575 s (29.0 s; speech 26.8 s) · 8:19.57–8:48.58 (measured, dry run).

## s14_rhr_cycle
Now let's use the rule on the three axes themselves. Point your fingers along x hat and curl them towards y hat. Your thumb points up, so x hat cross y hat is z hat. Turn your hand so your fingers point along y hat, and curl them towards z hat. Your thumb points along x hat, so y hat cross z hat is x hat. Turn it once more, fingers along z hat, curling towards x hat. Your thumb points along y hat, so z hat cross x hat is y hat. The three results follow a cycle: x, y, z, and back to x.

> 106 words · 8 sentences · 528.575–569.825 s (41.2 s; speech 38.0 s) · 8:48.58–9:29.83 (measured, dry run).

## s15_rhr_swap
What if we swap the order? Point your fingers along y hat first, and curl them towards x hat. To curl that way, you have to turn your hand over, and your thumb points down. So y hat cross x hat is minus z hat. In the same way, z hat cross y hat is minus x hat, and x hat cross z hat is minus y hat. And b cross a has components zero, zero and minus fourteen: the same length, pointing straight down. Swapping the order of a cross product flips its arrow. That's different from the dot product, where a dot b equals b dot a.

> 109 words · 8 sentences · 569.825–612.050 s (42.2 s; speech 39.0 s) · 9:29.83–10:12.05 (measured, dry run).

## s16_rhr_screen
Let's see all six results on a flat screen, with x pointing right and y pointing up. Then z points straight out of the screen, towards you. An arrow coming out of the screen is drawn as a dot in a circle, like the tip of an arrow flying at you. An arrow going into the screen is drawn as a cross in a circle, like the tail feathers of an arrow flying away. So x hat cross y hat comes out of the screen, and y hat cross x hat goes into it. Y hat cross z hat points right, and z hat cross y hat points left. Z hat cross x hat points up, and x hat cross z hat points down. The right hand always tells us which way.

> 132 words · 8 sentences · 612.050–658.625 s (46.6 s; speech 43.3 s) · 10:12.05–10:58.62 (measured, dry run).

## s17_rhr_views
The direction also depends on where you look from. Look down at the floor from above. Turning from vector a to b is anticlockwise, and a cross b points up, straight at you. Now look up from below the floor. The same turn looks clockwise, and the same arrow points away from you. So here's a handy rule. If, from where you stand, the turn from the first arrow to the second is anticlockwise, the cross product points towards you. If it's clockwise, it points away.

> 86 words · 8 sentences · 658.625–694.350 s (35.7 s; speech 32.5 s) · 10:58.62–11:34.35 (measured, dry run).

> s11–s17 unchanged (the user did not flag them).

## s18_cases
Now let's keep one arrow fixed and change only the other. The fixed arrow, p, has components three, zero and zero. First, q points the same way, with components two, zero and zero. The parallelogram is squashed flat, so p cross q is zero. Next, q is at a right angle to p, with components zero, two and zero. The parallelogram is a three by two rectangle, and p cross q points straight up, six units long. Last, q points the opposite way, with components minus two, zero and zero. The parallelogram is flat again, so the cross product is zero. So the cross product is zero when two vectors point the same way or in opposite directions, and as long as it can be at right angles. And if q keeps turning past the opposite direction, the turn from p to q becomes clockwise, and the arrow flips to point down.

> 152 words · 10 sentences · 694.350–756.800 s (62.4 s; speech 58.5 s) · 11:34.35–12:36.80 (measured, dry run).

> "We did the same for the dot product" dropped (no simple back-reference). Visual: UV2-11 (p = (3, 0, 0) on all three p arrows).

## s18a_why_question
So now we know how to calculate the cross product and which way it points. But why is it built like this? Why the sine, and why an area? And if its length is an area, why is it an arrow that points up or down? Let's take these one at a time.

> 53 words · 5 sentences · 756.800–775.775 s (19.0 s; speech 16.8 s) · 12:36.80–12:55.77 (measured, dry run).

> NEW (UV2-10).

## s18b_across_part
Let's start with the sine. The dot product used the shadow, the part of b that lies along the first arrow. Now let's split b into two pieces. One piece lies along vector a and the other goes straight across it, at a right angle. Together they make b. Here, the part along is about one point five seven, and the part across is about two point seven five. The part across is the length of b times sine theta. So the length of a cross b is the length of vector a times the part of b across it: five point one times two point seven five, about fourteen. The dot product uses the part along, and the cross product uses the part across.

> 125 words · 9 sentences · 775.775–824.950 s (49.2 s; speech 45.6 s) · 12:55.77–13:44.95 (measured, dry run).

> NEW (UV2-10: the sine is the across part, parallel to the dot product's along part).

## s18c_slide
What if we change only the part along? Let's slide the tip of b along the direction of vector a until it reaches six, four. The parallelogram leans over. But its base stays the same, and so does its height. So its area is still fourteen. Let's check with the recipe: five times four, minus one times six, is twenty minus six, which is fourteen again. However far we slide, a cross b doesn't change. So the cross product ignores how much two arrows agree. It measures only how much one arrow reaches across the other.

> 96 words · 9 sentences · 824.950–865.775 s (40.8 s; speech 37.2 s) · 13:44.95–14:25.77 (measured, dry run).

> NEW (UV2-10: the along part contributes nothing).

## s20_torque
Why would anyone want the part across? Because only that part can turn things. Imagine turning a bolt with a spanner. Draw an arrow, r, from the bolt to your hand, zero point three metres long, and an arrow, F, for your push of fifty newtons. The part of the push along the spanner just pulls on the bolt, and only the part across turns it. This turning effect is called torque, written tau, and tau equals r cross F. Push at a right angle, and all fifty newtons are across: zero point three times fifty is fifteen newton metres. Push at thirty degrees, and the part along is about forty three newtons, while the part across is fifty times sine thirty, twenty five newtons. The torque drops to seven point five newton metres. Push along the spanner, and nothing is across, so the bolt doesn't turn.

> 147 words · 10 sentences · 865.775–924.000 s (58.2 s; speech 54.3 s) · 14:25.77–15:24.00 (measured, dry run).

> Moved into the why section and rewritten around the across part (UV2-10). Visual: component labels r = (0.3, 0, 0) m, F = (0, 50, 0) N / (43.3, 25, 0) N, τ = (0, 0, 15) / (0, 0, 7.5) N·m (UV2-08 global rule).

## s21_torque_axis
The torque arrow points along the bolt's axis, and the right-hand rule tells us which way the bolt turns. Curl your fingers from r towards F. If your thumb points down into the nut, the bolt tightens. If it points up, the bolt loosens. So the cross product tells us both how strongly a force turns something, and which way.

> 60 words · 5 sentences · 924.000–948.025 s (24.0 s; speech 21.8 s) · 15:24.00–15:48.02 (measured, dry run).

> Unchanged.

## s22_door_again
Now back to the door. With the cross product, a push at right angles to the door gives the largest torque, and a push along the door gives none, just as our hands tell us. The torque arrow points along the hinge: up when the door swings one way, and down when it swings the other. So the cross product is largest at right angles, and it tells left from right.

> 71 words · 4 sentences · 948.025–973.475 s (25.5 s; speech 23.6 s) · 15:48.02–16:13.48 (measured, dry run).

> Narration unchanged. Visual: UV2-12 (r label inside the frame).

## s22a_plane_normal
Now, why does the answer point at right angles to both arrows? The spanner turns in one flat plane, the plane of r and F, and the bolt turns about an axis sticking straight out of that plane. Any turning, or sweep of one arrow across another, happens in a plane. In three dimensions, the simplest way to say which plane is to give the one direction straight out of it: the normal to the plane. So the cross product packs two things into one arrow. Its length says how much: the area, or how strongly something turns. Its direction says which plane, and which way round: up means the turn from the first arrow to the second is anticlockwise, seen from above. The area lies flat in the plane, and the arrow stands on it like a label, telling us how big the patch is and which way it faces.

> 151 words · 8 sentences · 973.475–1029.875 s (56.4 s; speech 53.1 s) · 16:13.48–17:09.88 (measured, dry run).

> NEW (UV2-10: why perpendicular; "if the length is an area, why does it point up or down?").

## s22b_component_shadows
This also explains the recipe. Tilt a parallelogram, and look at its shadows on three walls. Its shadow on the floor uses only x and y parts, and its area is the z component. Its shadows on the other two walls give the x and y components. Our parallelogram lies flat on the floor, so seen from the walls it's edge on, with no area. That's why only the z component of a cross b, fourteen, is left.

> 78 words · 6 sentences · 1029.875–1062.000 s (32.1 s; speech 29.6 s) · 17:09.88–17:42.00 (measured, dry run).

> RESTORED (orchestrator decision 2026-10-27; UV2-10: each component is a shadow area, so each leaves out its own direction).

## s22c_angular_momentum
Nature uses this arrow in many places. First, a ball whirled round on a string. Let r be the arrow from the centre to the ball, half a metre long. The second arrow is the ball's momentum, p: its mass times its velocity. A two kilogram ball moving at three metres per second has a momentum of six. Then r cross p is called the angular momentum: how much spin the ball carries, and about which axis. Here it's zero point five times six, which is three, pointing straight up, because the ball goes round anticlockwise, seen from above. The string pulls along r, so it has no part across r, and it can't change the spin.

> 117 words · 8 sentences · 1062.000–1110.050 s (48.0 s; speech 44.8 s) · 17:42.00–18:30.05 (measured, dry run).

> NEW (UV2-10: angular momentum r × p). Screen: r = (0.5, 0, 0) m, p = (0, 6, 0) kg m/s, L = r × p = (0, 0, 3) kg m²/s.

## s22d_moving_charge
Second, a charged particle, like a proton, moving through a magnetic field. The first arrow is its velocity, v, and the second is the magnetic field, B. The push on the particle is its charge times v cross B. If it moves east and the field points straight up, v cross B is along x hat cross z hat, which is minus y hat: a push towards the south. This push is always at a right angle to the velocity. So it never speeds the particle up or slows it down. It only bends its path into a circle. That's how particle accelerators steer their beams round a ring.

> 109 words · 8 sentences · 1110.050–1154.375 s (44.3 s; speech 41.1 s) · 18:30.05–19:14.38 (measured, dry run).

> NEW (UV2-10: force on a moving charge; sets up "a push at 90° turns but never speeds up").

## s22e_perp_push
Why does a push at right angles change only the direction? Let's try it with numbers. An air parcel moves east at ten metres per second. One sideways kick adds one metre per second towards the north. By Pythagoras, its new speed is the square root of ten squared plus one squared, about ten point zero five. It has turned by almost six degrees, and sped up a little. Now split that kick into ten kicks, each a tenth as big, and each at a right angle to the new direction. It turns by almost the same angle, but its speed only grows to about ten point zero zero five. With a hundred kicks, it's ten point zero zero zero five. So a push that acts all the time, always at a right angle, doesn't change the speed at all: it just bends the path into a circle. The push dot the velocity is zero, so the push does no work.

> 161 words · 11 sentences · 1154.375–1217.150 s (62.8 s; speech 58.5 s) · 19:14.38–20:17.15 (measured, dry run).

> NEW (UV2-10, UV2-16: why a perpendicular push turns without speeding up).

## s19_grid
Let's put the two products side by side. The dot product gives a number, using the part along and the cosine. The cross product gives an arrow, using the part across and the sine. The dot product is a shadow times a length. The cross product's length is an area, and its direction is the normal to the plane. The dot product is largest when the arrows point the same way, the cross product at right angles, and only the cross product flips when we swap the order. In mechanics, they give work and torque. In weather, the dot product gives advection, and the cross product turns the wind.

> 109 words · 8 sentences · 1217.150–1260.275 s (43.1 s; speech 39.9 s) · 20:17.15–21:00.28 (measured, dry run).

> Moved after the why section; rows updated (along / across, normal, torque and angular momentum).

## s23_k_cross
Now let's see how weather uses the cross product. Meteorologists usually write a wind that blows flat along the ground as u. At any place on a map, let k be the unit vector pointing straight up, out of the ground. Think of k as an axle standing at that place: turning on a map happens around it. Take a wind blowing east at five metres per second, with components five, zero and zero. With the recipe, k cross u has components zero, five and zero, so it points north: an arrow as long as the wind, turned a quarter turn to the left around k. For a wind blowing east, north is exactly the direction ninety degrees to its left. For a wind blowing north, k cross u points west, again to its left. So k cross is a turning tool: it turns any flat arrow a quarter turn to the left, anticlockwise seen from above. Minus k cross u turns it to the right.

> 166 words · 10 sentences · 1260.275–1325.600 s (65.3 s; speech 61.4 s) · 21:00.28–22:05.60 (measured, dry run).

> UV2-13 (k is the axis, k × turns about it), UV2-14 (daytime satellite map), UV2-15 (what the northward result means: the direction 90° to the left of an eastward wind). "Instead of the v of the last video" dropped.

## s23a_why_turn
Why would we want an exact quarter turn? Not to change the wind: it names the direction straight to the wind's left, with the wind's own size. We need it because Earth's spin gives moving air a push that's always at a right angle to its motion, like the magnet's push on the proton. A push at any other angle, say thirty degrees off, would have a part along the wind, and would speed the air up or slow it down. The spin's push only turns the air. So we need the wind turned by exactly a quarter turn, times a number for its strength. The wind itself doesn't jump by ninety degrees: the push bends its path a little at a time, like our small kicks. And on weather maps, k cross turns the direction in which pressure rises into the direction the wind blows.

> 146 words · 8 sentences · 1325.600–1378.900 s (53.3 s; speech 50.0 s) · 22:05.60–22:58.90 (measured, dry run).

> NEW (UV2-15, UV2-16, UV2-17, UV2-18: why turn, why exactly 90°, who needs it, the turn is gradual).

## s24_spin
Now let's see where this push comes from. Earth spins once a day around the axis through its poles. We draw this spin as an arrow, Omega, along the axis. Curl your right-hand fingers the way Earth turns, from west to east, and your thumb points to the North Pole. Omega's length is how fast Earth turns. A full turn is two pi radians, the angle unit of calculus. Measured against the distant stars, one turn takes twenty three hours and fifty six minutes, a little less than a day. So Omega is about seven point two nine times ten to the minus five radians per second.

> 107 words · 8 sentences · 1378.900–1422.850 s (43.9 s; speech 40.7 s) · 22:58.90–23:42.85 (measured, dry run).

> First sentence changed ("where this push comes from"). Visual: UV2-19 (axis through both poles, occluded behind the globe), UV2-14 (daytime imagery check).

## s25a_position_vector
To follow a place on the spinning Earth, we first say where it is. Draw an arrow from Earth's centre to the place: the position vector, r. Its length is Earth's radius, about six thousand three hundred and seventy one kilometres, and it points from the centre out through the place. Let's cut Earth in half through its axis and our place, to see inside. Our place is at forty five degrees north: that angle, measured at the centre from the equator, is the latitude, phi. Let the x axis point from the centre to the equator below our place, and the z axis along Earth's axis. Then r has components of about four thousand five hundred and five kilometres along x, zero along y, and four thousand five hundred and five along z.

> 134 words · 7 sentences · 1422.850–1474.350 s (51.5 s; speech 48.6 s) · 23:42.85–24:34.35 (measured, dry run).

> NEW (UV2-20: the position vector, with its components). Visual: the redesigned half-Earth slice (no "heart" cut-away).

## s25_ground_speed
How fast does our place move? As Earth turns, it goes round its circle of latitude, whose centre is on Earth's axis. So the circle's radius is the place's distance from the axis. Call theta the angle between the axis, Omega, and r. Then that distance is the length of r times sine theta. Here theta is ninety degrees minus the latitude, forty five degrees, so the radius is about four thousand five hundred and five kilometres. In one turn, the place travels two pi times the radius, and one turn takes two pi over Omega seconds. Dividing, the two pis cancel: the speed is Omega, times the length of r, times sine theta.

> 114 words · 8 sentences · 1474.350–1523.175 s (48.8 s; speech 45.6 s) · 24:34.35–25:23.17 (measured, dry run).

> REWRITTEN (UV2-20: v = Ω × r derived; the speed part).

## s25b_direction
That's exactly the length of Omega cross r. And the place moves along its circle, towards the east, at a right angle to the axis and to r. Curl your fingers from Omega towards r, and your thumb points east. So length and direction both match: the ground's velocity is Omega cross r. With the recipe, Omega has components zero, zero and seven point two nine times ten to the minus five. So Omega cross r has components zero, seven point two nine times ten to the minus five times four million five hundred and five thousand metres, and zero. That's about three hundred and twenty nine metres per second, towards the east. At the equator, it's about four hundred and sixty five, faster than sound, and at the poles, it's zero.

> 132 words · 8 sentences · 1523.175–1578.150 s (55.0 s; speech 51.7 s) · 25:23.17–26:18.15 (measured, dry run).

> NEW (UV2-20: direction, the recipe with numbers, equator and pole).

## s26_coriolis_effect
Now imagine air moving across this spinning ground. We turn with Earth, so we judge the air's motion against the turning ground, and moving air seems to drift sideways. This apparent push is called the Coriolis effect. In the Northern Hemisphere, the half of Earth north of the equator, it turns moving air to the right, and in the Southern Hemisphere, to the left. Let's work out where it comes from.

> 71 words · 5 sentences · 1578.150–1606.625 s (28.5 s; speech 26.3 s) · 26:18.15–26:46.62 (measured, dry run).

> CHANGED: "it gets its own video later" removed (U-CP.4 overridden).

## s26a_merry_go_round
It's easiest to see on a merry-go-round: a flat disc spinning anticlockwise, seen from above, with its spin arrow, Omega, pointing up. Roll a ball across it, with nothing to rub or push it. Someone standing beside it, not turning, sees the ball roll in a straight line. But a rider turns underneath the ball, so to the rider, its path curves to the right. It's the same ball. The rider just measures its motion against a turning floor.

> 79 words · 6 sentences · 1606.625–1640.025 s (33.4 s; speech 30.9 s) · 26:46.62–27:20.03 (measured, dry run).

> NEW (UV2-22: the two views).

## s26b_two_views
Let's write down what each one sees. The rider measures the ball's velocity over the floor: call it u. The floor under the ball moves at Omega cross r, where r is the arrow from the centre to the ball. So the outside watcher sees the ball's velocity as u plus Omega cross r. Newton's law works for this watcher, who isn't turning. With nothing pushing the ball, this velocity doesn't change. So let's see how u plus Omega cross r changes. Two pieces of it change, and each gives an Omega cross u.

> 94 words · 8 sentences · 1640.025–1678.425 s (38.4 s; speech 35.1 s) · 27:20.03–27:58.42 (measured, dry run).

> NEW (UV2-22: velocity seen from outside = u + Ω × r).

## s26c_carried_arrow
The first piece is the arrow u itself. Say the rider sees the ball keep the same velocity across the floor. But the floor turns, and the rider's directions turn with it. So from outside, the arrow u swings round with the floor. Any arrow carried round by the spin changes at Omega cross that arrow, just as r did. That's the first Omega cross u.

> 66 words · 6 sentences · 1678.425–1705.900 s (27.5 s; speech 24.9 s) · 27:58.42–28:25.90 (measured, dry run).

> NEW (UV2-22: the first Ω × u).

## s26d_new_ground
The second piece is the floor's speed under the ball. The ball moves to a new place, where the floor moves differently: fast near the edge, and hardly at all near the centre. The floor's velocity is Omega cross r. When the ball's position changes by u every second, Omega cross r changes by Omega cross u every second. That's the second Omega cross u. One more piece comes from the ball being carried round with the floor itself. It doesn't depend on u, and we'll come back to it.

> 90 words · 7 sentences · 1705.900–1742.725 s (36.8 s; speech 33.9 s) · 28:25.90–29:02.72 (measured, dry run).

> NEW (UV2-22: the second Ω × u).

## s27_coriolis_term
Now let's add the pieces. A push for each kilogram is just an acceleration: how much the velocity changes every second. The change seen from outside is the change of u that the rider sees, plus two Omega cross u, plus the leftover piece. Newton's law says this equals the real pushes on each kilogram, like the pressure push. Move the extra pieces to the other side, and the rider sees u change by the real pushes, minus two Omega cross u, minus the leftover piece. So minus two Omega cross u is the Coriolis push, for each kilogram. The two comes from the two equal pieces, and the minus from moving them to the rider's side. The leftover piece is the centrifugal effect, pulling outwards from the axis. On Earth, the slight bulge at the equator balances it, so it's already part of gravity, and we can leave it out.

> 151 words · 9 sentences · 1742.725–1804.250 s (61.5 s; speech 57.9 s) · 29:02.72–30:04.25 (measured, dry run).

> CHANGED (UV2-22: −2Ω × u derived; centrifugal kept out with one sentence).

## s27a_minus_check
What does the minus mean? On the merry-go-round, Omega points up, so Omega cross u points to the left of the ball's motion. The minus flips it to the right, against the floor's turning: the curve the rider saw. Let's check with a computer. We follow the ball from outside, where it rolls straight, and redraw its path as the rider sees it. Then we use only the rider's equation, with the Coriolis push and the centrifugal pull. The two curves land exactly on top of each other.

> 88 words · 7 sentences · 1804.250–1840.725 s (36.5 s; speech 33.6 s) · 30:04.25–30:40.72 (measured, dry run).

> NEW (UV2-22: the minus, and a numerical check by two tested routes).

## s28a_local_axes
On Earth, the floor is a sphere, and the spin arrow is tilted. Let's stand at one place, at forty five degrees north, and use three directions there: east, north, and up. Up is k, straight out of the ground. These three are all there are, because space has three dimensions. Omega isn't a fourth direction: it points along Earth's axis, so at our place it leans partly north and partly up. Just as we split b, let's split Omega into a north part, Omega times cosine phi, and an up part, Omega times sine phi. At forty five degrees, both are about five point one six times ten to the minus five. So Omega has components zero, Omega cosine phi, and Omega sine phi. At the North Pole, Omega points straight up, and at the equator it lies flat, pointing north.

> 142 words · 9 sentences · 1840.725–1897.975 s (57.2 s; speech 53.6 s) · 30:40.72–31:37.97 (measured, dry run).

> NEW (UV2-21: still 3-D; k is local up; Ω splits into a north part and an up part).

## s28b_components
Large-scale winds blow almost flat, so let's take a flat wind. Its eastward part is small u, its northward part is v, and its up part is zero. Now we find Omega cross u with the recipe. The east component is Omega's north part times zero, minus its up part times v: minus Omega sine phi times v. The north component is Omega's up part times small u, minus zero: Omega sine phi times small u. And the up component is zero times v, minus Omega's north part times small u: minus Omega cosine phi times small u.

> 98 words · 6 sentences · 1897.975–1939.925 s (42.0 s; speech 39.4 s) · 31:37.97–32:19.92 (measured, dry run).

> NEW (UV2-23: Ω × u component by component).

## s28c_flat_part
Look at the first two components. Both start with Omega sine phi, followed by minus v and small u. That's exactly k cross u, our quarter turn to the left, with components minus v, small u and zero. So the flat part of Omega cross u is Omega sine phi times k cross u, from the up part of Omega only. The third component points up or down. For a wind of ten metres per second at forty five degrees, the push it gives is about one thousandth of a metre per second squared, ten thousand times weaker than gravity, so we drop it. What's left is the sideways push: minus two Omega sine phi, times k cross u.

> 119 words · 7 sentences · 1939.925–1986.700 s (46.8 s; speech 43.9 s) · 32:19.92–33:06.70 (measured, dry run).

> NEW (UV2-24: −2Ω × u → −f k × u, step by step, with what is dropped and why).

## s28_f
Two Omega sine phi has its own name: the Coriolis parameter, f. So for flat winds, the Coriolis push is minus f times k cross u. Only Earth's spin about the local up direction turns flat winds sideways. At the North Pole, the ground spins about up at the full rate, like our merry-go-round. At the equator, there's no spin about up at all. At forty five degrees north, f is two times seven point two nine times ten to the minus five, times sine forty five. That's about one point zero three times ten to the minus four per second. South of the equator, the latitude counts as negative, so sine phi and f are negative too.

> 118 words · 8 sentences · 1986.700–2035.425 s (48.7 s; speech 45.5 s) · 33:06.70–33:55.42 (measured, dry run).

> CHANGED (UV2-23: f defined from the up part of Ω, with its geometric meaning and the value at 45°).

## s29_turn_rule
Now the turning tool does its job. The term k cross u is the wind turned a quarter turn to the left, and the minus sign flips it to the right. In the Northern Hemisphere, f is positive, so the push points to the right of the wind. In the Southern Hemisphere, f is negative, which flips it once more, to the left. At the equator, f is zero, and there's no turning at all.

> 75 words · 5 sentences · 2035.425–2063.275 s (27.9 s; speech 25.6 s) · 33:55.42–34:23.28 (measured, dry run).

> CHANGED (UV2-24: the repeated first sentence removed).

## s30_coriolis_size
How strong is it? Take a wind of ten metres per second at forty five degrees north. The push is f times the wind speed: one point zero three times ten to the minus four, times ten. That's about one millimetre per second, every second. That's tiny, but it never stops, and it always acts at a right angle to the wind. If nothing else pushed the air, it would turn the wind round a full circle, without changing its speed. That takes two pi over f, about seventeen hours.

> 90 words · 7 sentences · 2063.275–2100.125 s (36.8 s; speech 34.0 s) · 34:23.28–35:00.12 (measured, dry run).

> CHANGED (UV2-16: the turn is gradual, the speed unchanged).

## s31_globe_paths
Let's watch this on the globe. Here are two air parcels: one over south-west France, at forty five degrees north, and one over Patagonia, in Argentina, at forty five degrees south. Both are set moving towards the east at ten metres per second, with nothing else pushing them. The northern one curves to the right, towards the south. The southern one curves to the left, towards the north. Both trace loops about two hundred kilometres across, turning in opposite directions.

> 80 words · 6 sentences · 2100.125–2135.150 s (35.0 s; speech 32.5 s) · 35:00.12–35:35.15 (measured, dry run).

> CHANGED (UV2-25: land starting points; UV2-26: the turn direction stated and checked).

## s32_reanalysis
Now let's look at real winds. These come from a reanalysis: a best estimate of the weather everywhere, on a regular grid. It's made by combining millions of measurements with a weather forecast model. Let's average them over the thirty years from nineteen ninety one to twenty twenty. Near the ground, they show a clear pattern. Around thirty degrees north and south sit belts of high pressure. They're called the subtropical highs.

> 72 words · 7 sentences · 2135.150–2168.050 s (32.9 s; speech 30.0 s) · 35:35.15–36:08.05 (measured, dry run).

> Unchanged narration. Visual: UV2-14 daytime globe.

## s33_trades
Air flows out of these highs towards the equator. In the Northern Hemisphere, it heads south, and the Coriolis effect turns it to the right, towards the west, so it blows from the north east. In the Southern Hemisphere, it heads north and is turned to the left, again towards the west, so it blows from the south east. These steady winds are the trade winds, which sailing ships once used to cross the oceans. Over the oceans at fifteen degrees north and south, they blow towards the west at about five to seven metres per second. Over the Atlantic and the Pacific, the winds on both sides of the equator lean towards the west, and towards the equator.

> 119 words · 6 sentences · 2168.050–2213.125 s (45.1 s; speech 42.5 s) · 36:08.05–36:53.12 (measured, dry run).

> CHANGED (UV2-27: the last sentence now says both components, checked against the data: v10 < 0 at 15°N, > 0 at 15°S over the Atlantic and Pacific).

## s34_westerlies
Air also flows out of the subtropical highs towards the poles. In the Northern Hemisphere, it heads north and is turned to the right, towards the east. In the Southern Hemisphere, it heads south and is turned to the left, again towards the east. These are the westerlies, named, like all winds, after the direction they blow from. At forty five degrees north and south, they blow towards the east at about three to seven and a half metres per second, strongest over the Southern Ocean, where little land slows them down. Pressure patterns and friction shape these winds too, but the Coriolis turning is why they blow mostly east or west.

> 112 words · 6 sentences · 2213.125–2257.425 s (44.3 s; speech 41.8 s) · 36:53.12–37:37.43 (measured, dry run).

> CHANGED (UV2-28: two closing sentences merged; no added reminders).

## s35_storms
The cross product also explains why storms spin. A hurricane is a huge storm, hundreds of kilometres across. It forms over warm ocean, around a centre of very low pressure. Air near the surface is pushed towards that low centre from every side.

> 43 words · 4 sentences · 2257.425–2277.500 s (20.1 s; speech 18.2 s) · 37:37.43–37:57.50 (measured, dry run).

## s36_ian
This is Hurricane Ian, seen from a weather satellite on the twenty eighth of September, twenty twenty two. Its calm centre, called the eye, is just off the south west coast of Florida, and its cloud bands curl around it. That afternoon, Ian reached the coast with winds of about sixty seven metres per second, the forecasters' best estimate from the observations. Now let's add the winds near the ground, from a weather model with a fine, three kilometre grid. In the Northern Hemisphere, each stream of air heading for the centre is turned to the right: air from the south towards the east, and air from the east towards the north. All the way round, these turned streams add up to an anticlockwise spin, seen from above. Friction near the ground slows the wind, so the air still spirals inwards as it turns.

> 144 words · 7 sentences · 2277.500–2334.200 s (56.7 s; speech 53.8 s) · 37:57.50–38:54.20 (measured, dry run).

## s37_idai
Now the Southern Hemisphere. This is Cyclone Idai, seen from a satellite on the fourteenth of March, twenty nineteen, in the channel between Mozambique and Madagascar. In this part of the world, storms like this are called cyclones. Near its peak, its winds reached about fifty four to fifty nine metres per second, again from the forecasters' best estimates. Its cloud bands curl the other way. Here f is negative, so air heading for the centre is turned to the left, and the storm spins clockwise, seen from above. It's the same physics, with the opposite sign of f.

> 99 words · 7 sentences · 2334.200–2376.575 s (42.4 s; speech 39.5 s) · 38:54.20–39:36.57 (measured, dry run).

## s38_spin_sign
The cross product can even measure the spin. At points around each storm, draw an arrow r from the centre, and take r cross u with the wind there. If the wind goes round anticlockwise, seen from above, the right-hand rule makes r cross u point up. For Ian, the arrows point up all the way round. For Idai, they all point down: clockwise, seen from above. Both storms spin the way the Coriolis effect turns the air.

> 78 words · 6 sentences · 2376.575–2408.950 s (32.4 s; speech 29.8 s) · 39:36.57–40:08.95 (measured, dry run).

> s35–s38 narration unchanged.

## s39_isobars
Now the last application: how the wind blows around highs and lows. Air presses on everything around it. This pressure is measured in hectopascals, and at sea level it's about a thousand hectopascals. Here's a simple weather map with one low in the middle. Joining the places with the same pressure gives lines called isobars. Here they're drawn every four hectopascals, and they circle the low.

> 66 words · 6 sentences · 2408.950–2439.225 s (30.3 s; speech 27.7 s) · 40:08.95–40:39.22 (measured, dry run).

> CHANGED (UV2-29: one low, a few isobars; no back-reference).

## s40_pressure_push
Pick a place south of the low. The pressure gradient, grad p, points the way the pressure increases fastest. Here, that's straight across the isobars, away from the low, towards the south. Air is pushed the other way, from high pressure towards low. This push, for each kilogram of air, is minus one over rho times grad p. Here rho is the density of the air, about one point two kilograms per cubic metre.

> 74 words · 6 sentences · 2439.225–2470.675 s (31.5 s; speech 28.9 s) · 40:39.22–41:10.68 (measured, dry run).

> CHANGED (UV2-29: ∇p points from low to high; the push points to the low).

## s40a_k_cross_gradp
Now let's use the turning tool on grad p. k cross grad p is grad p turned a quarter turn to the left. Grad p points south, so k cross grad p points east. Grad p crosses the isobars at a right angle, so a quarter turn brings it exactly along them. Looking along this new arrow, the low is on its left, and the high is on its right.

> 70 words · 4 sentences · 2470.675–2496.725 s (26.0 s; speech 24.2 s) · 41:10.68–41:36.72 (measured, dry run).

> NEW (UV2-29: what k × ∇p means).

## s41_adjust
Let's zoom in on this place, where the isobars run almost straight, from west to east. Follow an air parcel that starts at rest. The pressure push starts it moving towards the low, but as soon as it moves, the Coriolis effect turns it to the right. The faster it goes, the stronger the turning push, and it keeps turning until it blows along the isobars. It overshoots and makes a series of loops, but on average it moves along the isobars, from west to east.

> 86 words · 5 sentences · 2496.725–2529.775 s (33.1 s; speech 30.8 s) · 41:36.72–42:09.78 (measured, dry run).

> CHANGED (UV2-29: slower; the balance itself moves to s41a).

## s41a_balance
Why does it end up along the isobars? In steady flow, the air isn't speeding up, slowing down, or turning, so the pushes on it add up to zero. Only two pushes act here, so they must be equal in size and opposite in direction. The pressure push points towards the low, so the Coriolis push must point towards the high. And the Coriolis push is the wind turned a quarter turn to the right. So the wind must blow along the isobars, with the high on its right and the low on its left. This is called geostrophic balance, and the wind it gives is the geostrophic wind.

> 109 words · 7 sentences · 2529.775–2572.250 s (42.5 s; speech 39.6 s) · 42:09.78–42:52.25 (measured, dry run).

> NEW (UV2-29: why the balance happens, in words before the maths). UV2-30: "geostrophic" lexicon fix.

## s42_geo_equation
Now the same steps as maths, one at a time. The two pushes add up to zero: minus f k cross u, minus one over rho grad p, equals zero. Move the pressure push to the other side: minus f k cross u equals one over rho grad p. To get the wind itself, we apply k cross to both sides. On the left, we get k cross k cross u. Turning the wind twice to the left points it backwards, so that's minus u. The two minus signs cancel, and the left side becomes f times u. Dividing by f, we get the geostrophic wind: u equals one over f rho, times k cross grad p.

> 117 words · 8 sentences · 2572.250–2618.400 s (46.2 s; speech 42.9 s) · 42:52.25–43:38.40 (measured, dry run).

> CHANGED (UV2-29: one step per equation, starting from "the pushes add up to zero").

## s43_geo_pieces
Read it from right to left. Grad p points across the isobars, towards high pressure. k cross turns it a quarter turn to the left, along the isobars, with the low on the left. One over f rho sets the speed: the closer the isobars, the stronger the wind. And near the equator, f goes to zero, so this balance breaks down there.

> 63 words · 4 sentences · 2618.400–2644.075 s (25.7 s; speech 23.8 s) · 43:38.40–44:04.07 (measured, dry run).

> CHANGED (trimmed; one idea per sentence).

## s44_geo_numbers
Let's put in numbers at our place. The pressure drops by four hectopascals over four hundred kilometres going north. Four hectopascals is four hundred pascals, so grad p has components zero and minus four hundred pascals over four hundred thousand metres. That's minus ten to the minus three pascals per metre. Turned to the left, k cross grad p has components ten to the minus three and zero, pointing east. Next, f times rho is one point zero three times ten to the minus four, times one point two, about one point two four times ten to the minus four. Dividing, the wind blows east at about eight point one metres per second. A pascal is a kilogram per metre per second squared, so the units leave metres per second. As a check, the Coriolis push points south and the pressure push north, and both are about eight point three times ten to the minus four metres per second squared.

> 160 words · 9 sentences · 2644.075–2710.225 s (66.2 s; speech 62.5 s) · 44:04.07–45:10.22 (measured, dry run).

> CHANGED (UV2-08 global rule: every vector with its components; UV2-29: the balance checked with numbers).

## s45_storm_map
Now let's test it on a real storm. This is Storm Ciarán, seen from a satellite early in the afternoon of the second of November, twenty twenty three. This deep low crossed the North Atlantic and hit north-western France and southern England, whose borders are drawn as thin lines. Let's add the isobars from the reanalysis at the same time, every four hectopascals. Near the ground, friction disturbs the wind, so let's look about one and a half kilometres up, where the air feels almost no friction. The violet arrows are the geostrophic wind there, worked out with our formula from the pressure pattern. They run along the isobars, anticlockwise round the low, with the low on their left, and they're longest where the isobars crowd together.

> 127 words · 7 sentences · 2710.225–2762.350 s (52.1 s; speech 49.2 s) · 45:10.22–46:02.35 (measured, dry run).

> CHANGED (UV2-31: MODIS Aqua true colour of 2 Nov 2023, ≈ 13:20 UTC at the storm, with country and region borders; ERA5 isobars at 12 UTC; the narration says image and isobars are from the same time, early in the afternoon).

## s46_real_winds
Now let's add the real winds at the same height, from the reanalysis. They're drawn in a second colour. Over the sea, they point almost exactly the same way as the geostrophic arrows. They're a little slower, though, about fifteen percent near this tight low. That's because the air is racing round a sharp curve, which our simple balance leaves out. Down near the ground, it's different. Friction slows the air and turns it partly across the isobars, towards the low. So from nothing more than a pressure map and a cross product, we get the direction of the wind above the ground almost exactly, and its speed to within about a sixth.

> 78 words · 6 sentences · 2762.350–2794.475 s (32.1 s; speech 29.6 s) · 46:02.35–46:34.47 (measured, dry run).

> CHANGED (numbers re-measured at 12 UTC by the builder; no number is spoken until the CHECK rows pass, see changes.md).

## s47_recap
To sum up, the cross product of two arrows is another arrow, at right angles to both. Each component leaves out its own direction and cross multiplies the other two. Its length is the first arrow's length times the part of the second arrow across it: the area of their parallelogram. Its direction is the normal to their plane, and the right-hand rule says which way round. Physics uses it for torque, angular momentum and the push on a moving charge, and a push always at a right angle turns a motion without speeding it up. On the spinning Earth, the ground moves at Omega cross r, and moving air feels the Coriolis push, minus two Omega cross u. For flat winds, that's minus f k cross u: to the right in the north, and to the left in the south. That's why storms spin. When this push balances the pressure push, we get the geostrophic wind, one over f rho times k cross grad p, along the isobars. Later videos in this series show how to read weather maps, and how grad, div and curl are built from these products.

> 191 words · 10 sentences · 2794.475–2869.500 s (75.0 s; speech 71.1 s) · 46:34.47–47:49.50 (measured, dry run).

> CHANGED (new items in one sentence each).

## s48_end
This video is one of a series of related tutorials, so watch out for the others. They're made to help students of meteorology, atmospheric science and climate science, and anyone else who wants to learn not just these ideas, but the maths behind them too. The notebook for the cross product, and the notebooks for the other concepts, are on the website that goes with this video.

> 58 words · 3 sentences · 2869.500–2892.750 s (23.2 s; speech 22.2 s) · 47:49.50–48:12.75 (measured, dry run).

> House end card for weather/climate/ocean movies (HOUSE_STYLE §3, user decision 2026-10-27); 2879.925–2905.000 s spoken (measured, spliced in fix loop 1), movie 2905.300 s + 2.5-s hold = 2907.80 s.

> Total: 7218 words · 496 sentences · 2892.750 s narration · 2895.250 s movie (48:15.25) · 149.6 words per minute.
