# ch00_cross_product — "The cross product: the part across, as an arrow" (plan, movie-director 2026-10-28)

House style `movies/HOUSE_STYLE.md` (reference `ch00_dot_product_why` v6). Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice, our own words, maths spoken in words. Lines starting with ">" are notes and are not spoken.

**Measured, not estimated.** `tools/tts.py` dry run 2026-10-28 (`G:\Geophysical Fluid Dynamics\aofd-data\scratch\movies\ch00_cross_product_split\dryrun\v2_20261028\ch00_cross_product`; current `movies/lexicon.yaml`, no new entries): **46 scenes, 353 sentences, 5527 words, 2141.175 s narration + 2.5-s silent end-card hold = 2143.675 s (35:43.68)**; speech alone 1997.1 s = 166.1 words per minute while speaking, **154.7 words per minute overall** (limit 150); 533 caption cues; self-check {'expected_s': 2141.175, 'audio_s': 2141.175, 'diff_ms': 0.0, 'len_ok': True, 'cues_ok': True}; Kokoro render 5859.5 s; warnings: none.

## s00_title
In this video, we'll learn the cross product the easy way, and see how meteorology uses it to tell left from right, to measure a storm, and to find the sunny side of a valley.

> 35 words · 1 sentences · 0.300–12.650 s (12.3 s; speech 11.5 s) · 0:00.30–0:12.65 (measured, dry run)
> **New scene.**

## s01_hook
What is the cross product? Let's see what it is, why it's built the way it is, and what it tells us on a weather map.

> 26 words · 2 sentences · 12.650–21.425 s (8.8 s; speech 7.6 s) · 0:12.65–0:21.43 (measured, dry run)
> New or changed sentences: “Let's see what it is, why it's built the way it is, and what it tells …”

## s02_dot_recall
In an earlier video, we met the dot product. We took vector a with components five and one, and vector b with components one and three, and found that a dot b equals eight. In pictures, it was the shadow of one arrow on the other, times the other arrow's length. In weather, v dot grad T told us how fast the wind carries air into warmer or colder places, on a map of isotherms, the lines of equal temperature. The dot product is a number, and it uses only the part of one arrow that lies along the other. Today we meet its partner, which uses the part across instead.

> 111 words · 6 sentences · 21.425–64.050 s (42.6 s; speech 40.1 s) · 0:21.43–1:04.05 (measured, dry run)
> New or changed sentences: “In an earlier video, we met the dot product.” | “The dot product is a number, and it uses only the part of one arrow th…” | “Today we meet its partner, which uses the part across instead.”
> Related: 0.1 dot product

## s03_door
But a number can't describe everything. Imagine pushing a door open. Push near the handle, far from the hinge, and it swings open easily. Push close to the hinge, and you need a much bigger push to turn it just as fast. So turning depends on how far from the hinge you push, and on which way you push. Draw one arrow from the hinge to your hand, along the door. Then draw a second arrow for your push. When you push at a right angle to the door, the dot product of these two arrows is zero. Yet the door turns the most. When you push along the door, straight towards the hinge, the dot product is as large as it can be. Yet the door doesn't turn at all. So for turning, the dot product gets things backwards.

> 140 words · 12 sentences · 64.050–117.100 s (53.0 s; speech 48.4 s) · 1:04.05–1:57.10 (measured, dry run)
> New or changed sentences: “Push near the handle, far from the hinge, and it swings open easily.” | “Push close to the hinge, and you need a much bigger push to turn it ju…” | “So turning depends on how far from the hinge you push, and on which wa…”

## s04_left_right
There's a second problem. Suppose the wind blows north, and something pushes it sideways, to the east or to the west. Both pushes are at right angles to the wind, so both dot products are zero. Let's sweep the push all the way round the wind. The dot product is positive in the whole front half, zero on the line straight across, and negative behind, but it's exactly the same on the left as on the right. The dot product can't tell a push to the right from a push to the left. A turning also has an axis: the door swings around the line of its hinge. So we need a new product, one that's largest at right angles, and that gives an arrow along an axis. That's the cross product.

> 132 words · 9 sentences · 117.100–166.550 s (49.5 s; speech 45.9 s) · 1:57.10–2:46.55 (measured, dry run)
> New or changed sentences: “Let's sweep the push all the way round the wind.” | “The dot product is positive in the whole front half, zero on the line …”

## s05_axes
The cross product lives in three dimensions, so let's add a third axis. Here x points east, y points north, and z points straight up. The unit vectors along them are called x hat, y hat and z hat. Each one is one unit long. Our two arrows lie flat on the floor, so their third components are zero. Vector a becomes five, one, zero, and vector b becomes one, three, zero.

> 72 words · 6 sentences · 166.550–196.750 s (30.2 s; speech 27.6 s) · 2:46.55–3:16.75 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s05_axes.

## s06_recipe
So how do we find the cross product? Since the answer is an arrow, we need to know how far it reaches along x, along y and along z: its three components. For the x component, we leave out the x parts and use only the y and z parts. We take the y part of vector a times the z part of b, and subtract the z part of vector a times the y part of b. The y component leaves out the y parts and uses z and x. The z component leaves out the z parts and uses x and y. Each pair follows the cycle x, y, z, and back to x, with a minus sign between the two products. We'll soon see why it's built like this.

> 132 words · 8 sentences · 196.750–243.900 s (47.2 s; speech 43.9 s) · 3:16.75–4:03.90 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s06_recipe.

## s07_worked
Let's try it on our two arrows. The x component is one times zero, minus zero times three, which is zero. The y component is zero times one, minus five times zero, also zero. The z component is five times three, minus one times one: fifteen minus one, which is fourteen. So a cross b has components zero, zero and fourteen: an arrow fourteen units long, pointing straight up, out of the floor where the two arrows lie. That makes sense: both arrows lie flat on the floor, and turning within the floor is turning about the up direction, so only the z component survives. Because the answer is a vector, the cross product is also called the vector product.

> 120 words · 7 sentences · 243.900–293.525 s (49.6 s; speech 46.7 s) · 4:03.90–4:53.52 (measured, dry run)
> New or changed sentences: “That makes sense: both arrows lie flat on the floor, and turning withi…”

## s08_sine
Now let's look at how the angle between the two arrows plays a role. The dot product used the two lengths times the cosine of theta. The length of the cross product uses the sine instead: the length of vector a times the length of b, times sine theta. Let's check it. By Pythagoras, the length of vector a is the square root of five squared plus one squared, the square root of twenty six, about five point one. The length of b is the square root of one squared plus three squared, the square root of ten, about three point one six. Dividing the dot product, eight, by the two lengths gives a cosine of about point five. So theta is about sixty degrees, with a sine of about point eight seven. Multiplied out, that's about fourteen, the length we found from the components.

> 145 words · 9 sentences · 293.525–350.075 s (56.6 s; speech 52.9 s) · 4:53.52–5:50.07 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s08_sine.

## s09_area
Now let's find a picture for this number. Drop a line from the tip of vector a straight onto b's line, at a right angle. For the dot product, the piece it marked off along b was the shadow. This time, look at the dropped line itself: it's the height of vector a above b's line. Its length is the length of vector a times sine theta, about four point four three. Now slide a copy of b to the tip of vector a and a copy of vector a to the tip of b. Together they make a slanted box called a parallelogram. Its area is the base times the height: three point one six times four point four three, about fourteen. So the length of a cross b is the area of the parallelogram the two arrows make.

> 140 words · 9 sentences · 350.075–402.675 s (52.6 s; speech 49.0 s) · 5:50.07–6:42.68 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s09_area.

## s09a_box_proof
But why does the recipe, five times three minus one times one, give this area too? Draw a box around the parallelogram, six along and four up. Its area is twenty four. The box has six pieces left over. Two triangles sit along vector a and each is half of five times one, so together they make five. Two triangles along b, each half of one times three, make three. And two small corner squares, each one by one, make two. So the parallelogram is twenty four, minus five, minus three, minus two, which is fourteen. Do the same steps with letters, and almost everything cancels. What's left is the x part of vector a times the y part of b, minus the y part of vector a times the x part of b. That's exactly the z recipe: an area formula in disguise.

> 144 words · 11 sentences · 402.675–462.975 s (60.3 s; speech 56.0 s) · 6:42.68–7:42.98 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s09a_box_proof.

## s10_right_angles
The direction is just as neat. The cross product a cross b is at a right angle to both arrows. We can check it with the dot product. A right angle gives a dot product of zero. Zero times five, plus zero times one, plus fourteen times zero, is zero. The same happens with b. But there are two directions at right angles to the floor: up and down. Which one does the cross product choose? That's what the right-hand rule tells us.

> 83 words · 9 sentences · 462.975–498.125 s (35.1 s; speech 31.6 s) · 7:42.98–8:18.12 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s10_right_angles.

## s11_rhr_curl
Hold out your right hand. Point your fingers along vector a so they follow the first arrow. Now curl your fingers towards b, the second arrow, the short way round. Your thumb now points along a cross b: straight up. Let's walk around it. From every side, the curl, the thumb and the arrow agree.

> 55 words · 6 sentences · 498.125–522.400 s (24.3 s; speech 21.7 s) · 8:18.12–8:42.40 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s11_rhr_curl.

## s12_rhr_flat
There's a second way to use the same hand. Point your index finger along vector a and your middle finger along b. Bend the middle finger away from your palm. Then stick your thumb straight up. Your thumb again points along a cross b. So the index finger is the first arrow, and the middle finger is the second. The thumb is the answer.

> 64 words · 7 sentences · 522.400–549.175 s (26.8 s; speech 23.9 s) · 8:42.40–9:09.17 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s12_rhr_flat.

## s13_rhr_screw
A third way uses a bottle cap. Turn the cap from vector a towards b, the short way round. Seen from above, that's anticlockwise, the way you open a bottle, and the cap rises, up along a cross b. Turn it back, from b towards the first arrow, and the cap screws down. A screw works the same way: turned from the first arrow towards the second, it moves along their cross product.

> 73 words · 5 sentences · 549.175–578.175 s (29.0 s; speech 26.8 s) · 9:09.17–9:38.17 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s13_rhr_screw.

## s14_rhr_cycle
Now let's use the rule on the three axes themselves. Point your fingers along x hat and curl them towards y hat. Your thumb points up, so x hat cross y hat is z hat. Turn your hand so your fingers point along y hat, and curl them towards z hat. Your thumb points along x hat, so y hat cross z hat is x hat. Turn it once more, fingers along z hat, curling towards x hat. Your thumb points along y hat, so z hat cross x hat is y hat. The three results follow a cycle: x, y, z, and back to x. It's the same cycle as in the recipe: the x component is built from y and z, the y component from z and x, and the z component from x and y.

> 138 words · 9 sentences · 578.175–630.525 s (52.4 s; speech 48.7 s) · 9:38.17–10:30.52 (measured, dry run)
> New or changed sentences: “It's the same cycle as in the recipe: the x component is built from y …”

## s15_rhr_swap
What if we swap the order? Point your fingers along y hat first, and curl them towards x hat. To curl that way, you have to turn your hand over, and your thumb points down. So y hat cross x hat is minus z hat. In the same way, z hat cross y hat is minus x hat, and x hat cross z hat is minus y hat. And b cross a has components zero, zero and minus fourteen: the same length, pointing straight down. Swapping the order of a cross product flips its arrow. Going round the cycle backwards always gives a minus sign. That's different from the dot product, where a dot b equals b dot a.

> 119 words · 9 sentences · 630.525–677.300 s (46.8 s; speech 43.2 s) · 10:30.52–11:17.30 (measured, dry run)
> New or changed sentences: “Going round the cycle backwards always gives a minus sign.”

## s15a_index_form
Here's a short way to write the whole recipe, in index notation, which the video on the alternating tensor builds step by step. Let the letters i, j and k each stand for x, y or z. The i component of a cross b is epsilon i j k, times the j component of vector a times the k component of b, added up over every j and every k. Epsilon i j k is a table of signs: plus one when i, j and k follow the cycle x, y, z, minus one when they run the other way round, and zero when any two letters are the same. A repeated letter means a direction crossed with itself, which makes no area, so it gives zero. So for the z component, only two terms are left. Epsilon z x y is plus one, times five times three, and epsilon z y x is minus one, times one times one. That's fifteen minus one, fourteen again. And swapping two letters flips the sign of epsilon, which is exactly why b cross a is minus a cross b.

> 187 words · 9 sentences · 677.300–751.250 s (74.0 s; speech 70.4 s) · 11:17.30–12:31.25 (measured, dry run)
> **New scene.**
> Related: #1b alternating tensor and triple products

## s16_rhr_screen
Let's see all six results on a flat screen, with x pointing right and y pointing up. Then z points straight out of the screen, towards you. An arrow coming out of the screen is drawn as a dot in a circle, like the tip of an arrow flying at you. An arrow going into the screen is drawn as a cross in a circle, like the tail feathers of an arrow flying away. So x hat cross y hat comes out of the screen, and y hat cross x hat goes into it. Y hat cross z hat points right, and z hat cross y hat points left. Z hat cross x hat points up, and x hat cross z hat points down. The right hand always tells us which way.

> 132 words · 8 sentences · 751.250–797.825 s (46.6 s; speech 43.3 s) · 12:31.25–13:17.83 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s16_rhr_screen.

## s17_rhr_views
The direction also depends on where you look from. Look down at the floor from above. Turning from vector a to b is anticlockwise, and a cross b points up, straight at you. Now look up from below the floor. The same turn looks clockwise, and the same arrow points away from you. Think of the parallelogram as a thin card with two coloured faces. The cross product sticks out of the face from which the turn from the first arrow to the second looks anticlockwise. So here's a handy rule. If, from where you stand, the turn from the first arrow to the second is anticlockwise, the cross product points towards you. If it's clockwise, it points away.

> 119 words · 10 sentences · 797.825–846.350 s (48.5 s; speech 44.6 s) · 13:17.83–14:06.35 (measured, dry run)
> New or changed sentences: “Think of the parallelogram as a thin card with two coloured faces.” | “The cross product sticks out of the face from which the turn from the …”

## s18_cases
Now let's keep one arrow fixed and change only the other. The fixed arrow, p, has components three, zero and zero. First, q points the same way, with components two, zero and zero. The parallelogram is squashed flat, so p cross q is zero. Next, q is at a right angle to p, with components zero, two and zero. The parallelogram is a three by two rectangle, and p cross q points straight up, six units long. Last, q points the opposite way, with components minus two, zero and zero. The parallelogram is flat again, so the cross product is zero. So the cross product is zero when two vectors point the same way or in opposite directions, and as long as it can be at right angles. That's the opposite of the dot product, which is zero at a right angle, and largest when the arrows lie along one line. And if q keeps turning past the opposite direction, the turn from p to q becomes clockwise, and the arrow flips to point down.

> 175 words · 11 sentences · 846.350–916.975 s (70.6 s; speech 66.3 s) · 14:06.35–15:16.98 (measured, dry run)
> New or changed sentences: “That's the opposite of the dot product, which is zero at a right angle…”

## s18a_why_question
So now we know how to calculate the cross product and which way it points. But why is it built like this? Why the sine, and why an area? And if its length is an area, why is it an arrow that points up or down? And why the minus sign in the recipe? Let's take these one at a time.

> 61 words · 6 sentences · 916.975–939.100 s (22.1 s; speech 19.6 s) · 15:16.98–15:39.10 (measured, dry run)
> New or changed sentences: “And why the minus sign in the recipe?”

## s18b_across_part
Let's start with the sine. The dot product used the shadow, the part of b that lies along the first arrow. Now let's split b into two pieces. One piece lies along vector a and the other goes straight across it, at a right angle. Together they make b. Here, the part along is about one point five seven, and the part across is about two point seven five. The part across is the length of b times sine theta. So the length of a cross b is the length of vector a times the part of b across it: five point one times two point seven five, about fourteen. The dot product uses the part along, and the cross product uses the part across.

> 125 words · 9 sentences · 939.100–988.275 s (49.2 s; speech 45.6 s) · 15:39.10–16:28.27 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s18b_across_part.

## s18d_two_parts
The two products share b between them. The part along is the length of b times cos theta, and the part across is the length of b times sine theta. They are the two short sides of a right triangle, whose long side is b itself. Multiply both sides by the length of vector a too. Then Pythagoras gives a neat rule: a dot b squared, plus the length of a cross b squared, equals the two lengths squared, multiplied. With our numbers, eight squared is sixty four, and fourteen squared is one hundred and ninety six, which add up to two hundred and sixty. That's twenty six times ten, the two lengths squared. So the dot product uses the part along, the cross product uses the part across, and together they use all of b.

> 136 words · 8 sentences · 988.275–1041.325 s (53.1 s; speech 49.8 s) · 16:28.27–17:21.33 (measured, dry run)
> **New scene.**
> Related: 0.1 dot product

## s18c_slide
What if we change only the part along? Let's slide the tip of b along the direction of vector a until it reaches six, four. The parallelogram leans over. But its base stays the same, and so does its height. So its area is still fourteen. Let's check with the recipe: five times four, minus one times six, is twenty minus six, which is fourteen again. However far we slide, a cross b doesn't change. So the cross product ignores how much two arrows agree. It measures only how much one arrow reaches across the other.

> 96 words · 9 sentences · 1041.325–1082.150 s (40.8 s; speech 37.2 s) · 17:21.33–18:02.15 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s18c_slide.

## s20_torque
Why would anyone want the part across? Because only that part can turn things, as the door already told us. Imagine turning a bolt with a spanner. Draw an arrow, r, from the bolt to your hand, zero point three metres long, and an arrow, F, for your push of fifty newtons. The part of the push along the spanner just pulls on the bolt, and only the part across turns it. This turning effect is called torque, written tau, and tau equals r cross F. Push at a right angle, and all fifty newtons are across: zero point three times fifty is fifteen newton metres. Push at thirty degrees, and the part along is about forty three newtons, while the part across is fifty times sine thirty, twenty five newtons. The torque drops to seven point five newton metres. Push along the spanner, and nothing is across, so the bolt doesn't turn.

> 153 words · 10 sentences · 1082.150–1142.375 s (60.2 s; speech 56.3 s) · 18:02.15–19:02.38 (measured, dry run)
> New or changed sentences: “Because only that part can turn things, as the door already told us.”

## s21_torque_axis
The torque arrow points along the bolt's axis, and the right-hand rule tells us which way the bolt turns. Curl your fingers from r towards F. If your thumb points down into the nut, the bolt tightens. If it points up, the bolt loosens. So the torque arrow is the axis of the turning, and its direction says which way round: seen from its tip, looking back down the arrow, the turn is always anticlockwise. So the cross product tells us both how strongly a force turns something, and which way.

> 91 words · 6 sentences · 1142.375–1178.125 s (35.8 s; speech 33.2 s) · 19:02.38–19:38.12 (measured, dry run)
> New or changed sentences: “So the torque arrow is the axis of the turning, and its direction says…”

## s21a_minus_sign
Torque also explains the minus sign in the recipe. Let's lay a spanner flat on the floor, with the bolt at the centre. Its arm, r, reaches point two metres along x and point one along y, and the push, F, has ten newtons along x and thirty along y. Split the push into its two parts. The thirty newtons along y push across the x part of the arm, point two metres. On their own, they turn the spanner anticlockwise, seen from above, with a torque of point two times thirty, which is six newton metres. The ten newtons along x push across the y part of the arm, point one metres. On their own, they turn the spanner the other way, clockwise, with a torque of point one times ten, which is one. The two little torques fight each other, so we subtract: six minus one is five newton metres. That's the z recipe: the x part of r times the y part of F, minus the y part of r times the x part of F. The minus sign is there because the two parts turn the spanner in opposite directions.

> 194 words · 11 sentences · 1178.125–1251.425 s (73.3 s; speech 69.0 s) · 19:38.12–20:51.42 (measured, dry run)
> **New scene.**

## s22_door_again
Now back to the door. Only the part of your push across the door can turn it, and that's the part the cross product uses. Push at a right angle to the door, and all of the push is across, so the torque is as large as it can be. Push along the door, straight towards the hinge, and nothing is across, so the torque is zero, just as our hands tell us. Its arrow points along the hinge: up when the door swings one way, and down when it swings the other.

> 93 words · 5 sentences · 1251.425–1283.100 s (31.7 s; speech 29.5 s) · 20:51.42–21:23.10 (measured, dry run)
> New or changed sentences: “Only the part of your push across the door can turn it, and that's the…” | “Push at a right angle to the door, and all of the push is across, so t…” | “Push along the door, straight towards the hinge, and nothing is across…” | “Its arrow points along the hinge: up when the door swings one way, and…”

## s22x_glass_sheet
But why does the answer point at right angles to both arrows, and not somewhere in between? Picture the plane of the two arrows as a sheet of glass. Any arrow we can build by stretching and adding vector a and b stays inside the glass. So the only direction that belongs to neither of them is the one sticking straight out of the sheet. That's where the answer goes, and that's why its dot products with vector a and with b are both zero.

> 85 words · 5 sentences · 1283.100–1314.600 s (31.5 s; speech 29.3 s) · 21:23.10–21:54.60 (measured, dry run)
> **New scene.**

## s22a_plane_normal
The spanner turns in one flat plane, the plane of r and F, and the bolt turns about an axis sticking straight out of that plane. Any turning, or sweep of one arrow across another, happens in a plane. In three dimensions, the simplest way to say which plane is to give the one direction straight out of it: the normal to the plane. So the cross product packs two things into one arrow. Its length says how much: the area, or how strongly something turns. Its direction says which plane, and which way round: up means the turn from the first arrow to the second is anticlockwise, seen from above. The area lies flat in the plane, and the arrow stands on it like a label, telling us how big the patch is and which way it faces.

> 139 words · 7 sentences · 1314.600–1366.225 s (51.6 s; speech 48.7 s) · 21:54.60–22:46.22 (measured, dry run)

## s22b_component_shadows
This also explains the recipe. Tilt a parallelogram, and look at its shadows on three walls. Its shadow on the floor uses only x and y parts, and its area is the z component. Its shadows on the other two walls give the x and y components. Our parallelogram lies flat on the floor, so seen from the walls it's edge on, with no area. That's why only the z component of a cross b, fourteen, is left.

> 78 words · 6 sentences · 1366.225–1398.350 s (32.1 s; speech 29.6 s) · 22:46.22–23:18.35 (measured, dry run)
> Word-identical to ch00_cross_product_why(v4fix2)/s22b_component_shadows.

## s22d_tilted_axis
In full three dimensions, all three components work together. Imagine a ball floating in space, and brush your finger past it, off centre. The arrow from the centre to your finger, r, and your push, F, can both have x, y and z parts. The x and y parts turn the ball about z, just like the spanner on the floor. The y and z parts turn it about x, and the z and x parts turn it about y. Here r reaches point one metres along x and point one up, and the push is two newtons along y. The recipe gives a torque with components minus point two, zero and point two newton metres. The little torques add up like any arrows, to one torque about a tilted axis, and the ball starts to spin about that axis.

> 140 words · 8 sentences · 1398.350–1450.075 s (51.7 s; speech 48.5 s) · 23:18.35–24:10.08 (measured, dry run)
> **New scene.**
> Related: #3 cross product in physics

## s19_grid
Let's put the two products side by side. The dot product gives a number, using the part along and the cosine. The cross product gives an arrow, using the part across and the sine. The dot product is a shadow times a length. The cross product's length is an area, and its direction is the normal to the plane. The dot product is largest when the arrows point the same way, the cross product at right angles, and only the cross product flips when we swap the order. So the dot product is the part along, a number, and the cross product is the part across, an axis. On weather maps, the dot product tells us how fast the wind carries air into warmer or colder places. So what can the cross product do on a weather map?

> 138 words · 9 sentences · 1450.075–1502.375 s (52.3 s; speech 48.7 s) · 24:10.08–25:02.38 (measured, dry run)
> New or changed sentences: “So the dot product is the part along, a number, and the cross product …” | “On weather maps, the dot product tells us how fast the wind carries ai…” | “So what can the cross product do on a weather map?”
> Related: 0.1 dot product, #6 gradient, #10 material derivative

## s50_three_jobs
The cross product gives us three things at once. Its sign, up or down, tells us which way round the turn from the first arrow to the second goes, and so whether something lies to our left or to our right. Its length gives an area. And its direction tells us which way a flat surface faces. Weather maps use all three, so let's take them one at a time, starting with left and right.

> 75 words · 5 sentences · 1502.375–1530.025 s (27.7 s; speech 25.4 s) · 25:02.38–25:30.03 (measured, dry run)
> **New scene.**

## s51_track_side
This is Hurricane Ian, seen from a weather satellite on the twenty eighth of September, twenty twenty two. That afternoon, its centre crossed the coast of Florida, moving towards the north east. Forecasters always ask which towns lie to the right of a storm's track and which lie to the left, because the right side is usually hit hardest. Let's draw an arrow, d, along the track, the way the storm moves. Then draw a second arrow, r, from the storm's centre to a town. The dot product can't tell us which side the town is on, but the cross product can. If the turn from d to r is anticlockwise, seen from above, then d cross r points up, and the town is on the left. If the turn is clockwise, d cross r points down, and the town is on the right.

> 144 words · 8 sentences · 1530.025–1584.900 s (54.9 s; speech 51.6 s) · 25:30.03–26:24.90 (measured, dry run)
> **New scene.**
> Related: #45 tropical cyclones

## s52_side_numbers
Let's put in numbers, in kilometres, with x pointing east and y pointing north. In the four hours before landfall, the centre moved about fifty kilometres east and forty five north, so d has components fifty, forty five and zero. Fort Myers Beach lies about twenty five kilometres east of where the centre crossed the coast, and twenty eight south, so r has components twenty five, minus twenty eight and zero. Only the z component of d cross r is left: fifty times minus twenty eight, minus forty five times twenty five, which is about minus two thousand five hundred. It's negative, so d cross r points down, and Fort Myers Beach is on the right of the track. For Sarasota, to the north west, r has components minus thirty three, seventy one and zero. Now the z component is fifty times seventy one, minus forty five times minus thirty three, about plus five thousand, so Sarasota is on the left. We only need the sign, and the cross product gives it in one line.

> 175 words · 8 sentences · 1584.900–1656.300 s (71.4 s; speech 68.1 s) · 26:24.90–27:36.30 (measured, dry run)
> **New scene.**

## s53_right_side
Why is the right side usually hit hardest? In the Northern Hemisphere, a hurricane's winds circle its centre anticlockwise, seen from above. On the right of the track, those winds blow the same way the storm is moving, so the two speeds add up. On the left, they blow against the storm's motion, and partly cancel. For Ian, the right side also had winds blowing from the sea onto the land, piling the water up against the coast. At Fort Myers Beach, the sea rose about three to four and a half metres above the ground. On the left side, the winds blew from the land out to sea, and they pushed water out of Tampa Bay, so its level dropped far below normal. The left side still gets strong winds and heavy rain, so it's only safer, never safe. We'll see why storms spin this way in the next video, and much more about storms like Ian in the video on tropical cyclones.

> 164 words · 9 sentences · 1656.300–1718.125 s (61.8 s; speech 58.2 s) · 27:36.30–28:38.12 (measured, dry run)
> **New scene.**
> Related: #3 cross product in physics, #29 Coriolis, #45 tropical cyclones

## s53a_runway
The same sign test helps pilots. Draw a unit arrow along the runway, e hat, and an arrow for the wind. If e hat cross the wind points down, the wind blows towards the right of the runway, so it comes from the left. If it points up, the wind comes from the right. Here the runway points north, and the wind blows at ten metres per second towards the north east, thirty degrees off the runway. The z component is minus five, so the wind comes from the left, with five metres per second straight across. The dot product video measures the other part, along the runway.

> 108 words · 7 sentences · 1718.125–1760.025 s (41.9 s; speech 39.0 s) · 28:38.12–29:20.03 (measured, dry run)
> **New scene.**
> Related: 0.1b dot product (runway, along part)

## s54_storm_size
Next, the length of the cross product, and a question about size: how big is a storm? This is Storm Ciarán, seen from a satellite on the second of November, twenty twenty three. At the centre of this low, the pressure is about nine hundred and fifty six hectopascals. Let's pick the isobar for nine hundred and sixty eight hectopascals, and ask how much area it encloses. It's a wobbly loop, so there's no simple formula for its area.

> 79 words · 5 sentences · 1760.025–1791.850 s (31.8 s; speech 29.6 s) · 29:20.03–29:51.85 (measured, dry run)
> **New scene.**
> Related: #42 extratropical cyclones

## s55_triangle_fan
Here's the trick. Put points all the way round the isobar, and draw an arrow from the centre of the low to each one. Two neighbouring arrows make a thin triangle. A triangle is half of the parallelogram the two arrows make, so its area is half the length of their cross product. Going round the loop anticlockwise, each cross product points up, so we can simply add up their z components. Where the loop bends back on itself, a cross product points down, and it takes away the area we counted twice. We do this on a map that keeps areas true, with distances in kilometres. Adding up a hundred and ten triangles gives about two hundred and seventy thousand square kilometres. That's a little more than the whole area of the United Kingdom, inside just one isobar. Going round clockwise instead flips every cross product, and the sum comes out negative, with the same size. This sum is called the shoelace formula, and computers use it to measure the area of any shape on a map. A sum like this, taken all the way round a loop, comes back in the curl video, where it measures how strongly the wind circulates.

> 203 words · 12 sentences · 1791.850–1871.400 s (79.6 s; speech 74.9 s) · 29:51.85–31:11.40 (measured, dry run)
> **New scene.**
> Related: #8 curl and Stokes

## s57_slope_normal
Now the direction of the cross product, and a question about sunshine: which side of a valley gets more sun in winter? Here are the Alps in three dimensions, built from a map of ground heights, with the heights drawn three times taller so the slopes are easier to see. Let's fly to the Rhône valley near the town of Sion, in Switzerland, which runs almost exactly from east to west. To describe how a patch of hillside is tilted, take two short arrows along the ground, one heading east and one heading north, each rising or dropping with the slope. Both arrows lie in the hillside, so their cross product sticks straight out of it. This arrow is called the normal to the slope, and it tells us which way the ground faces. On the north side of the valley, the normal leans towards the south, so that slope faces south. On the south side of the valley, it leans towards the north.

> 164 words · 8 sentences · 1871.400–1931.550 s (60.1 s; speech 56.9 s) · 31:11.40–32:11.55 (measured, dry run)
> **New scene.**

## s58_slope_sunshine
Now let's bring in the sun. At noon in late December, the sun stands only about twenty degrees above the southern horizon. Draw a unit arrow, s hat, pointing towards the sun, and make the normal one unit long too. The sunshine falling on each square metre of ground is the sun's strength times s hat dot n hat. On flat ground, s hat dot n hat is about zero point three four. On the south facing slope, tilted about eighteen degrees towards the sun, it's about zero point five eight, so it gets about seventy percent more sunshine than flat ground. On the north facing slope, it's only about zero point zero five, so it gets almost no direct sun at all. That's why the vineyards near Sion grow on the sunny north side of the valley, and why snow lasts much longer on the shady side. This leaves out the shadows that the mountains cast on each other, but it captures the main effect. The climate machine video uses the same dot product to show why the poles get less sunshine than the tropics.

> 186 words · 10 sentences · 1931.550–2003.325 s (71.8 s; speech 67.8 s) · 32:11.55–33:23.33 (measured, dry run)
> **New scene.**
> Related: #22 climate machine

## s59_shaded_relief
Do this for every patch of ground, and paint each one by how much sun it gets. The result is a shaded relief map, where the mountains seem to stand up off the page. Mapmakers make them exactly this way, with a cross product for the normal and a dot product with the light, usually shining from the north west, because our eyes read the hills best that way. With the real December noon sun instead, the shady north facing slopes stand out at once. The slopes of the ground east and north together make one arrow, the gradient of the height, which the gradient video builds step by step.

> 110 words · 5 sentences · 2003.325–2043.275 s (40.0 s; speech 37.7 s) · 33:23.33–34:03.28 (measured, dry run)
> **New scene.**
> Related: #6 gradient

## s60_recap
To sum up, the cross product of two arrows is another arrow, at right angles to both. Each component leaves out its own direction and uses the other two, following the cycle x, y, z, with a minus sign because the two parts turn opposite ways. Its length is the first arrow's length times the part of the second arrow across it: the area of their parallelogram, and the size of a torque. The dot product uses the part along, and the cross product uses the part across. Its direction is the axis of the turn, and seen from its tip, the turn is anticlockwise. It's zero when the two arrows lie along one line, and largest at right angles. Swapping the order flips the arrow. On weather maps, its sign tells which side of a storm's track a town is on. Adding up its triangles measures the area inside an isobar. And the normal of a hillside, dotted with the sun's direction, tells how much sunshine it gets. The next video shows how physics uses the cross product, from a spinning wheel to the push that makes storms spin.

> 190 words · 11 sentences · 2043.275–2117.925 s (74.7 s; speech 70.4 s) · 34:03.28–35:17.93 (measured, dry run)
> **New scene.**
> Related: #3 cross product in physics

## s61_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for this cross product, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 58 words · 3 sentences · 2117.925–2141.175 s (23.2 s; speech 22.2 s) · 35:17.93–35:41.18 (measured, dry run)
> **New scene.**
> Related: #1b, #3, #6, #8, #22, #45
