# ch00_cross_product_why — "The cross product: an arrow at right angles, and why the wind turns (v5)" (plan, movie-director 2026-10-28)

House style `movies/HOUSE_STYLE.md` (reference `ch00_dot_product_why` v6). Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice, our own words, maths spoken in words. Lines starting with ">" are notes and are not spoken; `[beat]` = a 1.5-s hold after a worked calculation (not spoken, not captioned).

**Measured, not estimated.** `tools/tts.py` dry run 2026-10-29 (`G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_cross_product_split/dryrun/cf_20261029/ch00_cross_product_why`; current `movies/lexicon.yaml`, no new entries): **87 scenes, 660 sentences, 65 beats, 10278 words, 4152.100 s narration + 2.5-s silent end-card hold = 4154.600 s (1:09:14.60)**; speech alone 3809.2 s = 161.9 words per minute while speaking, **148.5 words per minute overall** (limit 150); 1005 caption cues; self-check {'expected_s': 4152.1, 'audio_s': 4152.1, 'diff_ms': -0.0, 'len_ok': True, 'cues_ok': True}; Kokoro render 1946.2 s; warnings: none.

**U-CF (2026-10-29, user 2026-10-28: derive and name the centrifugal term).** New scenes s26a1_rule, s26e_rule_again, s26f_collect, s27b_centrifugal, s27c_centrifugal_earth, s27d_centrifugal_size, s27e_effective_gravity, s27f_level_sea, s27g_three_traces; changed s26b_two_views (+1 sentence), s27_coriolis_term (S1, S3, S5, S8, S9), s47_recap (+1 sentence). Every other sentence is unchanged.

**v5 in one table (2026-10-28, orchestrator's revised plan from the user)**
Rule: **every v4 fix 2 scene and every v4 word is kept.** v5 adds the reference video's intuitions (research
`research/xprod_video_intuitions.md` §1b V-X1…V-X10, our own words and pictures), reusing the scenes written for the
1aa590f #2 plan where they match, folds the review-3 SHOULD items (R3-S1…S4, C1–C6) into the visuals, and puts `[beat]`s
after worked calculations. Each scene's note line says "word-identical", "v4 words kept + added: …" or "new: …".

| V-X item (reference video) | Where in v5 |
|---|---|
| V-X1 torque = force × distance from the pivot; door and lever arm | v4 s03 + new sentences (push near vs far from the hinge), v4 s20, s22 |
| V-X2 only the perpendicular part turns; slanted spanner; \|a × b\| = first × across part of second | v4 s18b, s20 (slanted push, live τ follows sin θ) |
| V-X3 dot = parallel part (number), cross = perpendicular part (arrow) | s18 + sentence, new s18d_two_parts, s19_grid + sentence |
| V-X4 right-hand rule (index, middle, thumb), ⊙ / ⊗, the nut | v4 s11–s13, s16, s21 |
| V-X5 the arrow is the axis; sense of turning with the viewpoint | s17 + two-faced card, s21 + "seen from its tip, anticlockwise", v4 s22a |
| V-X6 reading the component formula: x uses y, z; y uses z, x; z uses x, y | v4 s06, s14 + sentence, s15 + sentence, new s15a, new s21b, new s21c |
| V-X7 plane case first: only z survives | s07 + sentence |
| V-X8 z = r_x F_y − r_y F_x as two opposing mini-torques (why the minus) | s18a + question, new s21a (z), new s21b (x), new s21c (y, and why the determinant's middle term looks backwards) |
| V-X9 3-D ball brushed off centre: three component torques add to a tilted axis | new s21d_tilted_axis |
| V-X10 when to use it; what the two arrows stand for | new s22w_when_to_use (first = position / lever arm / spin; second = force / velocity, or a position when the first is a spin) |

**Split point (step 2):** after s19_grid, before s23_k_cross ("Now let's see how weather uses the cross product.").
Part 1 = `movies/ch00/ch00_cross_product` (s00…s19_grid + s50_recap + s51_end); Part 2 = `movies/ch00/ch00_cross_product_uses`
(s00_title, s01_hook, s01a–s01d + s23…s48).

## s00_title
In this video, we'll learn about the cross product, and see how this is used in meteorology to explain why the wind turns and why storms spin.

> 27 words · 1 sentences · 0 beats · 0.300–10.700 s (10.4 s; speech 9.6 s) · 0:00.30–0:10.70 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s01_hook
What is the cross product? Let's see what it is, why it's built the way it is, and what it tells us about the wind.

> 25 words · 2 sentences · 0 beats · 10.700–19.400 s (8.7 s; speech 7.6 s) · 0:10.70–0:19.40 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s02_dot_recall
In the last video, we met the dot product. We took vector a with components five and one, and vector b with components one and three, and found that a dot b equals eight. [beat] In pictures, it was the shadow of one arrow on the other, times the other arrow's length. In weather, v dot grad T told us how fast the wind carries air into warmer or colder places, on a map of isotherms, the lines of equal temperature. The dot product is a number, and it measures how much two arrows agree.

> 94 words · 5 sentences · 1 beats · 19.400–56.650 s (37.2 s; speech 33.9 s) · 0:19.40–0:56.65 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s03_door
But a number can't describe everything. Imagine pushing a door open. Push near the handle, far from the hinge, and it swings open easily. Push close to the hinge, and you need a much bigger push to turn it just as fast. So turning depends on how far from the hinge you push, and on which way you push. Draw one arrow from the hinge to your hand, along the door. Then draw a second arrow for your push. When you push at a right angle to the door, the dot product of these two arrows is zero. Yet the door turns the most. When you push along the door, straight towards the hinge, the dot product is as large as it can be. Yet the door doesn't turn at all. So for turning, the dot product gets things backwards.

> 140 words · 12 sentences · 0 beats · 56.650–109.700 s (53.1 s; speech 48.4 s) · 0:56.65–1:49.70 (measured, dry run 2026-10-29)
> v4 words kept + added: V-X1 lever arm: push near vs far from the hinge (sentences from the 1aa590f #2 plan)

## s04_left_right
There's a second problem. Suppose the wind blows north, and something pushes it sideways, to the east or to the west. Both pushes are at right angles to the wind, so both dot products are zero. The dot product can't tell a push to the right from a push to the left. A turning also has an axis: the door swings around the line of its hinge. So we need a new product, one that's largest at right angles, and that gives an arrow along an axis. That's the cross product.

> 91 words · 7 sentences · 0 beats · 109.700–144.850 s (35.1 s; speech 32.2 s) · 1:49.70–2:24.85 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s05_axes
The cross product lives in three dimensions, so let's add a third axis. Here x points east, y points north, and z points straight up. The unit vectors along them are called x hat, y hat and z hat. Each one is one unit long. Our two arrows lie flat on the floor, so their third components are zero. Vector a becomes five, one, zero, and vector b becomes one, three, zero. [beat]

> 72 words · 6 sentences · 1 beats · 144.850–175.750 s (30.9 s; speech 27.6 s) · 2:24.85–2:55.75 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s06_recipe
So how do we find the cross product? Since the answer is an arrow, we need to know how far it reaches along x, along y and along z: its three components. For the x component, we leave out the x parts and use only the y and z parts. We take the y part of vector a times the z part of b, and subtract the z part of vector a times the y part of b. The y component leaves out the y parts and uses z and x. The z component leaves out the z parts and uses x and y. Each pair follows the cycle x, y, z, and back to x, with a minus sign between the two products. We'll soon see why it's built like this.

> 132 words · 8 sentences · 0 beats · 175.750–222.900 s (47.2 s; speech 43.9 s) · 2:55.75–3:42.90 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s07_worked
Let's try it on our two arrows. The x component is one times zero, minus zero times three, which is zero. [beat] The y component is zero times one, minus five times zero, also zero. [beat] The z component is five times three, minus one times one: fifteen minus one, which is fourteen. [beat] So a cross b has components zero, zero and fourteen: an arrow fourteen units long, pointing straight up, out of the floor where the two arrows lie. [beat] That makes sense: both arrows lie flat on the floor, and turning within the floor is turning about the up direction, so only the z component survives. Because the answer is a vector, the cross product is also called the vector product.

> 120 words · 7 sentences · 4 beats · 222.900–277.125 s (54.2 s; speech 46.7 s) · 3:42.90–4:37.12 (measured, dry run 2026-10-29)
> v4 words kept + added: V-X7 plane case: turning within the floor is turning about up, so only z survives (sentences from the 1aa590f #2 plan)

## s08_sine
Now let's look at how the angle between the two arrows plays a role. The dot product used the two lengths times the cosine of theta. The length of the cross product uses the sine instead: the length of vector a times the length of b, times sine theta. Let's check it. By Pythagoras, the length of vector a is the square root of five squared plus one squared, the square root of twenty six, about five point one. [beat] The length of b is the square root of one squared plus three squared, the square root of ten, about three point one six. [beat] Dividing the dot product, eight, by the two lengths gives a cosine of about point five. [beat] So theta is about sixty degrees, with a sine of about point eight seven. [beat] Multiplied out, that's about fourteen, the length we found from the components. [beat]

> 145 words · 9 sentences · 5 beats · 277.125–338.975 s (61.9 s; speech 53.0 s) · 4:37.12–5:38.98 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s09_area
Now let's find a picture for this number. Drop a line from the tip of vector a straight onto b's line, at a right angle. For the dot product, the piece it marked off along b was the shadow. This time, look at the dropped line itself: it's the height of vector a above b's line. Its length is the length of vector a times sine theta, about four point four three. [beat] Now slide a copy of b to the tip of vector a and a copy of vector a to the tip of b. Together they make a slanted box called a parallelogram. Its area is the base times the height: three point one six times four point four three, about fourteen. [beat] So the length of a cross b is the area of the parallelogram the two arrows make.

> 140 words · 9 sentences · 2 beats · 338.975–393.875 s (54.9 s; speech 49.0 s) · 5:38.98–6:33.88 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s09a_box_proof
But why does the recipe, five times three minus one times one, give this area too? Draw a box around the parallelogram, six along and four up. Its area is twenty four. The box has six pieces left over. Two triangles sit along vector a and each is half of five times one, so together they make five. [beat] Two triangles along b, each half of one times three, make three. [beat] And two small corner squares, each one by one, make two. [beat] So the parallelogram is twenty four, minus five, minus three, minus two, which is fourteen. [beat] Do the same steps with letters, and almost everything cancels. What's left is the x part of vector a times the y part of b, minus the y part of vector a times the x part of b. That's exactly the z recipe: an area formula in disguise.

> 144 words · 11 sentences · 4 beats · 393.875–458.775 s (64.9 s; speech 56.0 s) · 6:33.88–7:38.77 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s10_right_angles
The direction is just as neat. The cross product a cross b is at a right angle to both arrows. We can check it with the dot product. A right angle gives a dot product of zero. Zero times five, plus zero times one, plus fourteen times zero, is zero. [beat] The same happens with b. But there are two directions at right angles to the floor: up and down. Which one does the cross product choose? That's what the right-hand rule tells us.

> 83 words · 9 sentences · 1 beats · 458.775–495.075 s (36.3 s; speech 31.6 s) · 7:38.77–8:15.07 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s11_rhr_curl
Hold out your right hand. Point your fingers along vector a so they follow the first arrow. Now curl your fingers towards b, the second arrow, the short way round. Your thumb now points along a cross b: straight up. Let's walk around it. From every side, the curl, the thumb and the arrow agree.

> 55 words · 6 sentences · 0 beats · 495.075–519.350 s (24.3 s; speech 21.7 s) · 8:15.07–8:39.35 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s12_rhr_flat
There's a second way to use the same hand. Point your index finger along vector a and your middle finger along b. Bend the middle finger away from your palm. Then stick your thumb straight up. Your thumb again points along a cross b. So the index finger is the first arrow, and the middle finger is the second. The thumb is the answer.

> 64 words · 7 sentences · 0 beats · 519.350–546.125 s (26.8 s; speech 23.9 s) · 8:39.35–9:06.12 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s13_rhr_screw
A third way uses a bottle cap. Turn the cap from vector a towards b, the short way round. Seen from above, that's anticlockwise, the way you open a bottle, and the cap rises, up along a cross b. Turn it back, from b towards the first arrow, and the cap screws down. [beat] A screw works the same way: turned from the first arrow towards the second, it moves along their cross product.

> 73 words · 5 sentences · 1 beats · 546.125–576.275 s (30.1 s; speech 26.8 s) · 9:06.12–9:36.27 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s14_rhr_cycle
Now let's use the rule on the three axes themselves. Point your fingers along x hat and curl them towards y hat. Your thumb points up, so x hat cross y hat is z hat. [beat] Turn your hand so your fingers point along y hat, and curl them towards z hat. Your thumb points along x hat, so y hat cross z hat is x hat. [beat] Turn it once more, fingers along z hat, curling towards x hat. Your thumb points along y hat, so z hat cross x hat is y hat. [beat] The three results follow a cycle: x, y, z, and back to x. It's the same cycle as in the recipe: the x component is built from y and z, the y component from z and x, and the z component from x and y.

> 138 words · 9 sentences · 3 beats · 576.275–632.075 s (55.8 s; speech 48.8 s) · 9:36.27–10:32.08 (measured, dry run 2026-10-29)
> v4 words kept + added: V-X6 the cycle in the axes is the cycle in the recipe (sentences from the 1aa590f #2 plan)

## s15_rhr_swap
What if we swap the order? Point your fingers along y hat first, and curl them towards x hat. To curl that way, you have to turn your hand over, and your thumb points down. So y hat cross x hat is minus z hat. [beat] In the same way, z hat cross y hat is minus x hat, and x hat cross z hat is minus y hat. [beat] And b cross a has components zero, zero and minus fourteen: the same length, pointing straight down. [beat] Swapping the order of a cross product flips its arrow. Going round the cycle backwards always gives a minus sign. That's different from the dot product, where a dot b equals b dot a.

> 119 words · 9 sentences · 3 beats · 632.075–682.300 s (50.2 s; speech 43.2 s) · 10:32.08–11:22.30 (measured, dry run 2026-10-29)
> v4 words kept + added: V-X6 going round the cycle backwards gives a minus (sentences from the 1aa590f #2 plan)

## s15a_index_form
Here's a short way to write the whole recipe, in index notation, which the index-notation video builds step by step. Let the letters i, j and k each stand for x, y or z. The i component of a cross b is epsilon i j k, times the j component of vector a times the k component of b, added up over every j and every k. Epsilon i j k is a table of signs: plus one when i, j and k follow the cycle x, y, z, minus one when they run the other way round, and zero when any two letters are the same. A repeated letter means a direction crossed with itself, which makes no area, so it gives zero. So for the z component, only two terms are left. Epsilon z x y is plus one, times five times three, and epsilon z y x is minus one, times one times one. [beat] That's fifteen minus one, fourteen again. [beat] And swapping two letters flips the sign of epsilon, which is exactly why b cross a is minus a cross b.

> 184 words · 9 sentences · 2 beats · 682.300–758.025 s (75.7 s; speech 69.8 s) · 11:22.30–12:38.02 (measured, dry run 2026-10-29)
> fx1 2026-10-28 (combined fix loop 1, one-sentence splices): 184 words · 9 sentences · 682.300–758.025 s (measured)

> new: V-X6 the cyclic pattern as a sign table (research X3c; pointer to #1b) (scene from the 1aa590f #2 plan)
> Related: #1b alternating tensor and triple products

## s16_rhr_screen
Let's see all six results on a flat screen, with x pointing right and y pointing up. Then z points straight out of the screen, towards you. An arrow coming out of the screen is drawn as a dot in a circle, like the tip of an arrow flying at you. An arrow going into the screen is drawn as a cross in a circle, like the tail feathers of an arrow flying away. So x hat cross y hat comes out of the screen, and y hat cross x hat goes into it. [beat] Y hat cross z hat points right, and z hat cross y hat points left. [beat] Z hat cross x hat points up, and x hat cross z hat points down. [beat] The right hand always tells us which way.

> 132 words · 8 sentences · 3 beats · 758.025–808.050 s (50.0 s; speech 43.3 s) · 12:38.02–13:28.05 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s17_rhr_views
The direction also depends on where you look from. Look down at the floor from above. Turning from vector a to b is anticlockwise, and a cross b points up, straight at you. Now look up from below the floor. The same turn looks clockwise, and the same arrow points away from you. [beat] Think of the parallelogram as a thin card with two coloured faces. The cross product sticks out of the face from which the turn from the first arrow to the second looks anticlockwise. So here's a handy rule. If, from where you stand, the turn from the first arrow to the second is anticlockwise, the cross product points towards you. If it's clockwise, it points away.

> 119 words · 10 sentences · 1 beats · 808.050–857.725 s (49.7 s; speech 44.6 s) · 13:28.05–14:17.73 (measured, dry run 2026-10-29)
> v4 words kept + added: V-X5 viewpoint: the two-faced card (the arrow sticks out of the face where the turn is anticlockwise) (sentences from the 1aa590f #2 plan)

## s18_cases
Now let's keep one arrow fixed and change only the other. The fixed arrow, p, has components three, zero and zero. First, q points the same way, with components two, zero and zero. The parallelogram is squashed flat, so p cross q is zero. [beat] Next, q is at a right angle to p, with components zero, two and zero. The parallelogram is a three by two rectangle, and p cross q points straight up, six units long. [beat] Last, q points the opposite way, with components minus two, zero and zero. The parallelogram is flat again, so the cross product is zero. [beat] So the cross product is zero when two vectors point the same way or in opposite directions, and as long as it can be at right angles. That's the opposite of the dot product, which is zero at a right angle, and largest when the arrows point the same way. And if q keeps turning past the opposite direction, the turn from p to q becomes clockwise, and the arrow flips to point down.

> 175 words · 11 sentences · 3 beats · 857.725–931.600 s (73.9 s; speech 66.1 s) · 14:17.73–15:31.60 (measured, dry run 2026-10-29)
> fx1 2026-10-28 (combined fix loop 1, one-sentence splices): 175 words · 11 sentences · 857.725–931.600 s (measured)

> v4 words kept + added: V-X3 pairing: the opposite of the dot product (sentences from the 1aa590f #2 plan)

## s18a_why_question
So now we know how to calculate the cross product and which way it points. But why is it built like this? Why the sine, and why an area? And if its length is an area, why is it an arrow that points up or down? And why the minus sign in the recipe? Let's take these one at a time.

> 61 words · 6 sentences · 0 beats · 931.600–953.725 s (22.1 s; speech 19.6 s) · 15:31.60–15:53.73 (measured, dry run 2026-10-29)
> v4 words kept + added: V-X8 announces the question 'why the minus sign?' (sentences from the 1aa590f #2 plan)

## s18b_across_part
Let's start with the sine. The dot product used the shadow, the part of b that lies along the first arrow. Now let's split b into two pieces. One piece lies along vector a and the other goes straight across it, at a right angle. Together they make b. Here, the part along is about one point five seven, and the part across is about two point seven five. [beat] The part across is the length of b times sine theta. So the length of a cross b is the length of vector a times the part of b across it: five point one times two point seven five, about fourteen. [beat] The dot product uses the part along, and the cross product uses the part across.

> 125 words · 9 sentences · 2 beats · 953.725–1005.200 s (51.5 s; speech 45.6 s) · 15:53.73–16:45.20 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s18d_two_parts
The two products share b between them. The part along is the length of b times cos theta, and the part across is the length of b times sine theta. They are the two short sides of a right triangle, whose long side is b itself. Multiply both sides by the length of vector a too. Then Pythagoras gives a neat rule: a dot b squared, plus the length of a cross b squared, equals the two lengths squared, multiplied. With our numbers, eight squared is sixty four, and fourteen squared is one hundred and ninety six, which add up to two hundred and sixty. [beat] That's twenty six times ten, the two lengths squared. [beat] So the dot product uses the part along, the cross product uses the part across, and together they use all of b.

> 136 words · 8 sentences · 2 beats · 1005.200–1060.550 s (55.3 s; speech 49.8 s) · 16:45.20–17:40.55 (measured, dry run 2026-10-29)
> new: V-X3 the pairing: along part (dot) and across part (cross) share b (scene from the 1aa590f #2 plan)
> Related: 0.1 dot product

## s18c_slide
What if we change only the part along? Let's slide the tip of b along the direction of vector a until it reaches six, four. The parallelogram leans over. But its base stays the same, and so does its height. So its area is still fourteen. Let's check with the recipe: five times four, minus one times six, is twenty minus six, which is fourteen again. [beat] However far we slide, a cross b doesn't change. So the cross product ignores how much two arrows agree. It measures only how much one arrow reaches across the other.

> 96 words · 9 sentences · 1 beats · 1060.550–1102.525 s (42.0 s; speech 37.2 s) · 17:40.55–18:22.53 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s20_torque
Why would anyone want the part across? Because only that part can turn things. Imagine turning a bolt with a spanner. Draw an arrow, r, from the bolt to your hand, zero point three metres long, and an arrow, F, for your push of fifty newtons. The part of the push along the spanner just pulls on the bolt, and only the part across turns it. This turning effect is called torque, written tau, and tau equals r cross F. Push at a right angle, and all fifty newtons are across: zero point three times fifty is fifteen newton metres. [beat] Push at thirty degrees, and the part along is about forty three newtons, while the part across is fifty times sine thirty, twenty five newtons. [beat] The torque drops to seven point five newton metres. [beat] Push along the spanner, and nothing is across, so the bolt doesn't turn.

> 147 words · 10 sentences · 3 beats · 1102.525–1164.200 s (61.7 s; speech 54.3 s) · 18:22.53–19:24.20 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s21_torque_axis
The torque arrow points along the bolt's axis, and the right-hand rule tells us which way the bolt turns. Curl your fingers from r towards F. If your thumb points down into the nut, the bolt tightens. If it points up, the bolt loosens. So the torque arrow is the axis of the turning, and its direction says which way round: seen from its tip, looking back down the arrow, the turn is always anticlockwise. So the cross product tells us both how strongly a force turns something, and which way.

> 91 words · 6 sentences · 0 beats · 1164.200–1199.950 s (35.8 s; speech 33.2 s) · 19:24.20–19:59.95 (measured, dry run 2026-10-29)
> v4 words kept + added: V-X5 the arrow IS the axis of turning, sense anticlockwise seen from its tip (sentences from the 1aa590f #2 plan)

## s21a_minus_sign
Torque also explains the minus sign in the recipe. Let's lay a spanner flat on the floor, with the bolt at the centre. Its arm, r, reaches point two metres along x and point one along y, and the push, F, has ten newtons along x and thirty along y. Split the push into its two parts. The thirty newtons along y push across the x part of the arm, point two metres. On their own, they turn the spanner anticlockwise, seen from above, with a torque of point two times thirty, which is six newton metres. [beat] The ten newtons along x push across the y part of the arm, point one metres. On their own, they turn the spanner the other way, clockwise, with a torque of point one times ten, which is one. [beat] The two little torques fight each other, so we subtract: six minus one is five newton metres. [beat] That's the z recipe: the x part of r times the y part of F, minus the y part of r times the x part of F. The minus sign is there because the two parts turn the spanner in opposite directions.

> 194 words · 11 sentences · 3 beats · 1199.950–1276.700 s (76.8 s; speech 69.0 s) · 19:59.95–21:16.70 (measured, dry run 2026-10-29)
> new: V-X8 z = r_x F_y − r_y F_x as two opposing mini-torques (scene from the 1aa590f #2 plan)

## s21b_x_component
The same idea builds the x component. Turning about the x axis happens in the wall made by y and z, so only the y and z parts can do it. Let's stand our spanner up in that wall: the arm reaches point two metres along y and point one along z, and the push has ten newtons along y and thirty along z. The thirty newtons along z push across the y part of the arm. Seen from the tip of x hat, looking back at the wall, they turn the spanner anticlockwise, with a torque of point two times thirty, which is six. [beat] The ten newtons along y push across the z part of the arm, and turn it clockwise: point one times ten, which is one. [beat] Again the two fight, so we subtract, and get five newton metres. [beat] That's the x recipe: the y part of r times the z part of F, minus the z part of r times the y part of F.

> 168 words · 8 sentences · 3 beats · 1276.700–1340.000 s (63.3 s; speech 56.6 s) · 21:16.70–22:20.00 (measured, dry run 2026-10-29)
> new: V-X6/V-X8 the x component built the same way (y and z parts, two opposing mini-torques)

## s21c_y_component
And the y component, the turning about y, happens in the wall made by z and x. Following the cycle, z comes before x. So the y component is the z part of r times the x part of F, minus the x part of r times the z part of F. With an arm of point two metres along z and point one along x, and a push of thirty newtons along x and ten along z, that's point two times thirty, minus point one times ten: six minus one, five again. [beat] You'll often see the recipe written as a determinant: a three by three grid, with x hat, y hat and z hat on the top row, then the parts of r, then the parts of F. We don't need determinants here, only what the grid gives. Its middle term has a minus sign in front of y hat, and the pair inside looks backwards: the x part of r times the z part of F, minus the z part of r times the x part of F. But the minus in front swaps the two products, and that's exactly our cycle order, z before x. So all three components follow one pattern: each is the turning about its own axis, made by the two parts that lie across that axis, with a plus for the turn that follows the cycle and a minus for the turn against it.

> 241 words · 9 sentences · 1 beats · 1340.000–1425.825 s (85.8 s; speech 81.1 s) · 22:20.00–23:45.83 (measured, dry run 2026-10-29)
> new: V-X6/V-X8 the y component (z and x parts, cycle order z before x) and why the determinant's middle term looks backwards; the cyclic pattern for all three
> Related: #1b alternating tensor and triple products

## s21d_tilted_axis
In full three dimensions, all three components work together. Imagine a ball floating in space, and brush your finger past it, off centre. The arrow from the centre to your finger, r, and your push, F, can both have x, y and z parts. The x and y parts turn the ball about z, just like the spanner on the floor. The y and z parts turn it about x, and the z and x parts turn it about y. Here r reaches point one metres along x and point one up, and the push is two newtons along y. The recipe gives a torque with components minus point two, zero and point two newton metres. [beat] The little torques add up like any arrows, to one torque about a tilted axis, and the ball starts to spin about that axis.

> 140 words · 8 sentences · 1 beats · 1425.825–1478.700 s (52.9 s; speech 48.5 s) · 23:45.83–24:38.70 (measured, dry run 2026-10-29)
> new: V-X9 a ball brushed off centre: three component torques add to a tilted axis (scene from the 1aa590f #2 plan)
> Related: Part 2 / #3

## s22_door_again
Now back to the door. With the cross product, a push at right angles to the door gives the largest torque, and a push along the door gives none, just as our hands tell us. The torque arrow points along the hinge: up when the door swings one way, and down when it swings the other. So the cross product is largest at right angles, and it tells left from right.

> 71 words · 4 sentences · 0 beats · 1478.700–1504.150 s (25.5 s; speech 23.6 s) · 24:38.70–25:04.15 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s22a_plane_normal
Now, why does the answer point at right angles to both arrows? The spanner turns in one flat plane, the plane of r and F, and the bolt turns about an axis sticking straight out of that plane. Any turning, or sweep of one arrow across another, happens in a plane. In three dimensions, the simplest way to say which plane is to give the one direction straight out of it: the normal to the plane. So the cross product packs two things into one arrow. Its length says how much: the area, or how strongly something turns. Its direction says which plane, and which way round: up means the turn from the first arrow to the second is anticlockwise, seen from above. The area lies flat in the plane, and the arrow stands on it like a label, telling us how big the patch is and which way it faces.

> 151 words · 8 sentences · 0 beats · 1504.150–1560.550 s (56.4 s; speech 53.1 s) · 25:04.15–26:00.55 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s22b_component_shadows
This also explains the recipe. Tilt a parallelogram, and look at its shadows on three walls. Its shadow on the floor uses only x and y parts, and its area is the z component. Its shadows on the other two walls give the x and y components. Our parallelogram lies flat on the floor, so seen from the walls it's edge on, with no area. That's why only the z component of a cross b, fourteen, is left. [beat]

> 78 words · 6 sentences · 1 beats · 1560.550–1593.375 s (32.8 s; speech 29.6 s) · 26:00.55–26:33.38 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s22c_angular_momentum
Nature uses this arrow in many places. First, a ball whirled round on a string. Let r be the arrow from the centre to the ball, half a metre long. The second arrow is the ball's momentum, p: its mass times its velocity. A two kilogram ball moving at three metres per second has a momentum of six. [beat] Then r cross p is called the angular momentum: how much spin the ball carries, and about which axis. Here it's zero point five times six, which is three, pointing straight up, because the ball goes round anticlockwise, seen from above. [beat] The string pulls along r, so it has no part across r, and it can't change the spin.

> 117 words · 8 sentences · 2 beats · 1593.375–1643.725 s (50.3 s; speech 44.8 s) · 26:33.38–27:23.72 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s22d_moving_charge
Second, a charged particle, like a proton, moving through a magnetic field. The first arrow is its velocity, v, and the second is the magnetic field, B. The push on the particle is its charge times v cross B. If it moves east and the field points straight up, v cross B is along x hat cross z hat, which is minus y hat: a push towards the south. This push is always at a right angle to the velocity. So it never speeds the particle up or slows it down. It only bends its path into a circle. That's how particle accelerators steer their beams round a ring.

> 109 words · 8 sentences · 0 beats · 1643.725–1688.050 s (44.3 s; speech 41.1 s) · 27:23.72–28:08.05 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s22e_perp_push
Why does a push at right angles change only the direction? Let's try it with numbers. An air parcel moves east at ten metres per second. One sideways kick adds one metre per second towards the north. By Pythagoras, its new speed is the square root of ten squared plus one squared, about ten point zero five. [beat] It has turned by almost six degrees, and sped up a little. Now split that kick into ten kicks, each a tenth as big, and each at a right angle to the new direction. It turns by almost the same angle, but its speed only grows to about ten point zero zero five. [beat] With a hundred kicks, it's ten point zero zero zero five. [beat] So a push that acts all the time, always at a right angle, doesn't change the speed at all: it just bends the path into a circle. The push dot the velocity is zero, so the push does no work.

> 161 words · 11 sentences · 3 beats · 1688.050–1754.275 s (66.2 s; speech 58.5 s) · 28:08.05–29:14.28 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s22w_when_to_use
So when do we reach for the cross product? Look at what the two arrows usually stand for. The first is normally a position or a lever arm, like r from a hinge, a bolt or the centre of a turn, or a spin arrow, like Earth's spin, Omega. The second is normally a force or a velocity, like a push, F, a momentum, or the wind, u, and when the first is a spin arrow, the second is often a position. Use the cross product whenever you want the size of the part of one arrow that lies across the other, together with a direction at right angles to both: the axis of a turn, or the side towards which something is pushed. That's torque, r cross F, angular momentum, r cross p, and the push on a moving charge, and soon the speed of the spinning ground, Omega cross r, and the Coriolis push, minus two Omega cross u. And keep the order in mind: swap the two arrows, and the answer flips.

> 175 words · 7 sentences · 0 beats · 1754.275–1817.025 s (62.8 s; speech 59.9 s) · 29:14.28–30:17.03 (measured, dry run 2026-10-29)
> new: V-X10 / orchestrator (c) when to use it and what the two arrows usually stand for

## s19_grid
Let's put the two products side by side. The dot product gives a number, using the part along and the cosine. The cross product gives an arrow, using the part across and the sine. The dot product is a shadow times a length. The cross product's length is an area, and its direction is the normal to the plane. The dot product is largest when the arrows point the same way, the cross product at right angles, and only the cross product flips when we swap the order. So the dot product is the part along, a number, and the cross product is the part across, an axis. In mechanics, they give work and torque. In weather, the dot product gives advection, and the cross product turns the wind.

> 129 words · 9 sentences · 0 beats · 1817.025–1867.375 s (50.3 s; speech 46.8 s) · 30:17.03–31:07.38 (measured, dry run 2026-10-29)
> v4 words kept + added: V-X3/V-S the closing pair 'along, a number / across, an axis'

## s23_k_cross
Now let's see how weather uses the cross product. Meteorologists usually write a wind that blows flat along the ground as u. At any place on a map, let k be the unit vector pointing straight up, out of the ground. Think of k as an axle standing at that place: turning on a map happens around it. Take a wind blowing east at five metres per second, with components five, zero and zero. With the recipe, k cross u has components zero, five and zero, so it points north: an arrow as long as the wind, turned a quarter turn to the left around k. For a wind blowing east, north is exactly the direction ninety degrees to its left. For a wind blowing north, k cross u points west, again to its left. So k cross is a turning tool: it turns any flat arrow a quarter turn to the left, anticlockwise seen from above. Minus k cross u turns it to the right.

> 166 words · 10 sentences · 0 beats · 1867.375–1932.700 s (65.3 s; speech 61.4 s) · 31:07.38–32:12.70 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s23a_why_turn
Why would we want an exact quarter turn? Not to change the wind: it names the direction straight to the wind's left, with the wind's own size. We need it because Earth's spin gives moving air a push that's always at a right angle to its motion, like the magnet's push on the proton. A push at any other angle, say thirty degrees off, would have a part along the wind, and would speed the air up or slow it down. The spin's push only turns the air. So we need the wind turned by exactly a quarter turn, times a number for its strength. The wind itself doesn't jump by ninety degrees: the push bends its path a little at a time, like our small kicks. And on weather maps, k cross turns the direction in which pressure rises into the direction the wind blows.

> 146 words · 8 sentences · 0 beats · 1932.700–1986.000 s (53.3 s; speech 50.0 s) · 32:12.70–33:06.00 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s24_spin
Now let's see where this push comes from. Earth spins once a day around the axis through its poles. We draw this spin as an arrow, Omega, along the axis. Curl your right-hand fingers the way Earth turns, from west to east, and your thumb points to the North Pole. Omega's length is how fast Earth turns. A full turn is two pi radians, the angle unit of calculus. Measured against the distant stars, one turn takes twenty three hours and fifty six minutes, a little less than a day. So Omega is about seven point two nine times ten to the minus five radians per second.

> 107 words · 8 sentences · 0 beats · 1986.000–2029.950 s (44.0 s; speech 40.7 s) · 33:06.00–33:49.95 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s25a_position_vector
To follow a place on the spinning Earth, we first say where it is. Draw an arrow from Earth's centre to the place: the position vector, r. Its length is Earth's radius, about six thousand three hundred and seventy one kilometres, and it points from the centre out through the place. Let's cut Earth in half through its axis and our place, to see inside. Our place is at forty five degrees north: that angle, measured at the centre from the equator, is the latitude, phi. Let the x axis point from the centre to the equator below our place, and the z axis along Earth's axis. Then r has components of about four thousand five hundred and five kilometres along x, zero along y, and four thousand five hundred and five along z.

> 134 words · 7 sentences · 0 beats · 2029.950–2081.450 s (51.5 s; speech 48.6 s) · 33:49.95–34:41.45 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s25_ground_speed
How fast does our place move? As Earth turns, it goes round its circle of latitude, whose centre is on Earth's axis. So the circle's radius is the place's distance from the axis. Call theta the angle between the axis, Omega, and r. Then that distance is the length of r times sine theta. Here theta is ninety degrees minus the latitude, forty five degrees, so the radius is about four thousand five hundred and five kilometres. In one turn, the place travels two pi times the radius, and one turn takes two pi over Omega seconds. Dividing, the two pis cancel: the speed is Omega, times the length of r, times sine theta.

> 114 words · 8 sentences · 0 beats · 2081.450–2130.275 s (48.8 s; speech 45.6 s) · 34:41.45–35:30.28 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s25b_direction
That's exactly the length of Omega cross r. And the place moves along its circle, towards the east, at a right angle to the axis and to r. Curl your fingers from Omega towards r, and your thumb points east. So length and direction both match: the ground's velocity is Omega cross r. With the recipe, Omega has components zero, zero and seven point two nine times ten to the minus five. So Omega cross r has components zero, seven point two nine times ten to the minus five times four million five hundred and five thousand metres, and zero. That's about three hundred and twenty nine metres per second, towards the east. [beat] At the equator, it's about four hundred and sixty five, faster than sound, and at the poles, it's zero.

> 132 words · 8 sentences · 1 beats · 2130.275–2186.400 s (56.1 s; speech 51.7 s) · 35:30.28–36:26.40 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s26_coriolis_effect
Now imagine air moving across this spinning ground. We turn with Earth, so we judge the air's motion against the turning ground, and moving air seems to drift sideways. This apparent push is called the Coriolis effect. In the Northern Hemisphere, the half of Earth north of the equator, it turns moving air to the right, and in the Southern Hemisphere, to the left. Let's work out where it comes from.

> 71 words · 5 sentences · 0 beats · 2186.400–2214.750 s (28.3 s; speech 26.1 s) · 36:26.40–36:54.75 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s26a_merry_go_round
It's easiest to see on a merry-go-round: a flat disc spinning anticlockwise, seen from above, with its spin arrow, Omega, pointing up. Roll a ball across it, with nothing to rub or push it. Someone standing beside it, not turning, sees the ball roll in a straight line. But a rider turns underneath the ball, so to the rider, its path curves to the right. It's the same ball. The rider just measures its motion against a turning floor.

> 79 words · 6 sentences · 0 beats · 2214.750–2248.150 s (33.4 s; speech 30.9 s) · 36:54.75–37:28.15 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s26a1_rule
Before we write down what each one sees, we need one rule, and the merry-go-round shows it. Paint an arrow on the floor, and call it B. It could be any arrow: a position, a velocity, or a direction. The rider sees the painted arrow stay exactly the same. But from outside, it swings round with the floor, and its tip moves along a circle. Just as Earth's ground moves at Omega cross r, the tip moves at Omega cross B. Now suppose the rider also sees B change, for example by growing longer. Then the outside watcher sees both changes, added together. We write how fast B changes each second as d B by d t, and say who is watching. So here's the rule: d B by d t seen from outside equals d B by d t seen by the rider, plus Omega cross B. We'll use it twice: first on the position, then on the velocity.

> 160 words · 11 sentences · 0 beats · 2248.150–2311.550 s (63.4 s; speech 59.1 s) · 37:28.15–38:31.55 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): the rule (dB/dt)_outside = (dB/dt)_rider + Ω × B stated and motivated before it is used (user item 1)

## s26b_two_views
Let's write down what each one sees. The rider measures the ball's velocity over the floor: call it u. The floor under the ball moves at Omega cross r, where r is the arrow from the centre to the ball. So the outside watcher sees the ball's velocity as u plus Omega cross r. That's our rule used on the position r: the rider sees r change at the rate u, and the spin adds Omega cross r. Newton's law works for this watcher, who isn't turning. With nothing pushing the ball, this velocity doesn't change. So let's see how u plus Omega cross r changes. Two pieces of it change, and each gives an Omega cross u.

> 118 words · 9 sentences · 0 beats · 2311.550–2358.575 s (47.0 s; speech 43.4 s) · 38:31.55–39:18.57 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical
> U-CF 2026-10-29: + S5 'That's our rule used on the position r…'

## s26c_carried_arrow
The first piece is the arrow u itself. Say the rider sees the ball keep the same velocity across the floor. But the floor turns, and the rider's directions turn with it. So from outside, the arrow u swings round with the floor. Any arrow carried round by the spin changes at Omega cross that arrow, just as r did. That's the first Omega cross u.

> 66 words · 6 sentences · 0 beats · 2358.575–2386.050 s (27.5 s; speech 24.9 s) · 39:18.57–39:46.05 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s26d_new_ground
The second piece is the floor's speed under the ball. The ball moves to a new place, where the floor moves differently: fast near the edge, and hardly at all near the centre. The floor's velocity is Omega cross r. When the ball's position changes by u every second, Omega cross r changes by Omega cross u every second. That's the second Omega cross u. One more piece comes from the ball being carried round with the floor itself. It doesn't depend on u, and we'll come back to it.

> 90 words · 7 sentences · 0 beats · 2386.050–2422.875 s (36.8 s; speech 33.9 s) · 39:46.05–40:22.88 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s26e_rule_again
Now let's use the rule a second time, to find all the pieces at once. This time, the arrow B is the velocity the outside watcher sees: u plus Omega cross r. The rule says its change seen from outside is its change seen by the rider, plus Omega cross that same velocity. Let's take the rider's part first. The rider sees u change at a rate we write d u by d t: how fast the velocity over the floor changes each second. In Omega cross r, Omega doesn't change, so only r does. The rider sees r change at the rate u, so Omega cross r changes at Omega cross u. That's our second piece: the floor's speed changing under the moving ball.

> 125 words · 8 sentences · 0 beats · 2422.875–2473.275 s (50.4 s; speech 47.1 s) · 40:22.88–41:13.28 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): the rule applied to the outside velocity u + Ω × r; the rider's part gives du/dt + Ω × u (piece ②)

## s26f_collect
Now the last part of the rule: Omega cross, open bracket, u plus Omega cross r. The cross product works part by part, like ordinary multiplication, so we cross Omega with each part on its own. Omega cross u is our first piece: the arrow u carried round by the floor. Omega cross, open bracket, Omega cross r, is the floor's own velocity, Omega cross r, carried round in its turn. That's the leftover piece, and now we can see where it comes from. Adding everything, the change seen from outside is d u by d t, plus Omega cross u, plus Omega cross u again, plus Omega cross, open bracket, Omega cross r. The two equal pieces, one from each use of the rule, make two Omega cross u. [beat]

> 130 words · 7 sentences · 1 beats · 2473.275–2527.225 s (53.9 s; speech 50.4 s) · 41:13.28–42:07.22 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): Ω × (u + Ω × r) split part by part into ① Ω × u and ③ Ω × (Ω × r); the two equal Ω × u make the 2 (user item 1)

## s27_coriolis_term
Now let's put the sum to work. A push for each kilogram is just an acceleration: how much the velocity changes every second. The change seen from outside is the change of u that the rider sees, plus two Omega cross u, plus Omega cross, open bracket, Omega cross r. Newton's law says this equals the real pushes on each kilogram, like the pressure push. Move the extra pieces to the other side, and the rider sees u change by the real pushes, minus two Omega cross u, minus Omega cross, open bracket, Omega cross r. So minus two Omega cross u is the Coriolis push, for each kilogram. The two comes from the two equal pieces, and the minus from moving them to the rider's side. The leftover piece, minus Omega cross, open bracket, Omega cross r, is called the centrifugal acceleration, and it pulls outwards from the axis. We'll see why, and where it goes on Earth, right after we check the minus sign.

> 166 words · 9 sentences · 0 beats · 2527.225–2596.225 s (69.0 s; speech 65.4 s) · 42:07.22–43:16.22 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical
> U-CF 2026-10-29: S1 'Now let's add the pieces.' → 'Now let's put the sum to work.'; S3, S5 'the leftover piece' → 'Omega cross, open bracket, Omega cross r'; S8-S9 changed (named here; the bulge sentence moved to s27f_level_sea)

## s27a_minus_check
What does the minus mean? On the merry-go-round, Omega points up, so Omega cross u points to the left of the ball's motion. The minus flips it to the right, against the floor's turning: the curve the rider saw. Let's check with a computer. We follow the ball from outside, where it rolls straight, and redraw its path as the rider sees it. Then we use only the rider's equation, with the Coriolis push and the centrifugal pull. The two curves land exactly on top of each other.

> 88 words · 7 sentences · 0 beats · 2596.225–2632.650 s (36.4 s; speech 33.5 s) · 43:16.22–43:52.65 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s27b_centrifugal
Now let's look at the centrifugal acceleration, minus Omega cross, open bracket, Omega cross r. It depends only on where the ball is, not on how it moves. To see which way it points, we use the vector triple product from the triple products video. It says that p cross, open bracket, q cross s, equals q times p dot s, minus s times p dot q. Here p and q are both Omega, and s is r. So Omega cross, open bracket, Omega cross r, equals Omega times Omega dot r, minus r times Omega dot Omega. Omega dot Omega is the length of Omega, squared, which we write Omega squared. On the merry-go-round, r lies flat on the floor and Omega points straight up, so Omega dot r is zero. With the minus sign in front, the centrifugal acceleration is just Omega squared times r, pointing straight out from the centre. Our merry-go-round turns at point five radians per second, about once every twelve and a half seconds. So at two and a half metres from the centre, the centrifugal acceleration is point two five times two and a half, which is point six two five metres per second squared. [beat] That's the outward pull a rider feels, as if something were trying to throw them off the edge.

> 220 words · 12 sentences · 1 beats · 2632.650–2723.225 s (90.6 s; speech 84.8 s) · 43:52.65–45:23.22 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): the leftover named; −Ω × (Ω × r) = Ω² r via the vector triple product (#1b) on the flat disc; 0.625 m/s² at 2.5 m (user item 2)

## s27c_centrifugal_earth
On Earth, r points from the centre to our place, and it isn't at right angles to Omega. So let's split r into two parts: one along Earth's axis, and one straight out from the axis, which we call r perp, short for perpendicular. In Omega times Omega dot r, only the part along the axis counts, and it gives Omega squared times that part. So it cancels the same part of Omega squared times r, and what's left is Omega squared times r perp. The length of r perp is our distance from the axis: the radius of our circle of latitude, Earth's radius times cosine phi. So the centrifugal acceleration is Omega squared, times Earth's radius, times cosine phi, pointing away from the axis. Notice its direction: it points away from the axis, not straight up, so at forty five degrees it leans towards the equator.

> 148 words · 7 sentences · 0 beats · 2723.225–2784.100 s (60.9 s; speech 58.0 s) · 45:23.22–46:24.10 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): on Earth −Ω × (Ω × r) = Ω² r⊥, size Ω² a cos φ, pointing away from the axis, leaning towards the equator (user item 2)

## s27d_centrifugal_size
How big is it on Earth? Omega squared is about five point three two times ten to the minus nine per second squared. At the equator, times six million three hundred and seventy one thousand metres, that's about zero point zero three four metres per second squared. [beat] At forty five degrees, our distance from the axis is about four thousand five hundred and five kilometres, so it's about zero point zero two four. At the poles, it's zero, because the poles sit on the axis. Gravity is about nine point eight one metres per second squared. So even at the equator, the centrifugal acceleration is only about a third of one percent of gravity.

> 114 words · 7 sentences · 1 beats · 2784.100–2832.525 s (48.4 s; speech 44.4 s) · 46:24.10–47:12.53 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): sizes on Earth: ≈ 0.034 m/s² at the equator, ≈ 0.024 at 45°, 0 at the poles, ≈ 1/3 % of g (user item 2)

## s27e_effective_gravity
So why don't weather equations have a centrifugal term? Because it never acts alone. One of the real pushes on every kilogram of air is Earth's gravitational attraction, which pulls it almost straight towards Earth's centre. Let's write it g star. Like the centrifugal acceleration, it depends only on where the air is. So we add the two together, and call the sum effective gravity, g. g equals g star, minus Omega cross, open bracket, Omega cross r. This is the gravity that a plumb line, a bathroom scale, or a dropped ball feels, and it's the g in every weather equation. So the rider's equation becomes: d u by d t equals the other real pushes, like the pressure push, plus g, minus two Omega cross u. The centrifugal acceleration is still there, just folded into g.

> 138 words · 10 sentences · 0 beats · 2832.525–2892.575 s (60.0 s; speech 56.1 s) · 47:12.53–48:12.57 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): the centrifugal term is folded into effective gravity g = g* − Ω × (Ω × r); the rider's equation then shows only g (user item 3)

## s27f_level_sea
Effective gravity has one more surprise: its direction. On a perfectly round Earth, g star would point to the centre, but the centrifugal part points away from the axis. So their sum would lean slightly towards the equator, with a part along the ground. At forty five degrees, that sideways part would be about zero point zero one seven metres per second squared. A wind of ten metres per second gets a Coriolis push of at most two Omega times ten, about zero point zero zero one five. [beat] So on a round Earth, the sideways pull would be more than ten times stronger than the Coriolis push, and the oceans would flow towards the equator and pile up there. In fact, over its long history, Earth's rock and water have settled into a slightly flattened shape, with a bulge at the equator. On that shape, the sea surface is level: effective gravity points straight down into it, with no sideways part. So in weather equations, up means straight against g, and g never pushes the wind sideways. On Earth, the slight bulge at the equator balances the centrifugal effect, so it's already part of gravity, and we can leave it out.

> 201 words · 10 sentences · 1 beats · 2892.575–2973.150 s (80.6 s; speech 75.5 s) · 48:12.57–49:33.15 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): why weather equations have no sideways centrifugal push: on a sphere it would be > 10 × the Coriolis push; the flattened Earth makes the sea level ⟂ g; the v4 'bulge ... part of gravity ... leave it out' sentence moved here (user item 3)

## s27g_three_traces
We can see the centrifugal effect in three places. First, gravity is weaker at the equator. Carefully measured, it's about nine point seven eight metres per second squared at the equator, and nine point eight three at the poles. The centrifugal pull explains about two thirds of that difference. The rest comes from the bulge itself, which puts the equator farther from Earth's centre. Second, a plumb line, a weight hanging on a string, doesn't point exactly at Earth's centre. On a round Earth, the spin alone would tilt it by up to about a tenth of a degree, near forty five degrees latitude. On the real, flattened Earth, the bulge's own pull adds about as much again, so the tilt reaches about a fifth of a degree. Third, Earth's shape: its radius at the equator is about twenty one kilometres larger than at the poles. That's only about one part in three hundred, so for everything else, we can treat Earth as a sphere. [beat] The video on circular motion builds the centrifugal effect from scratch, and the Coriolis video goes through this whole derivation in more detail. Now let's go back to the Coriolis push, and see how it works on the spinning Earth.

> 205 words · 12 sentences · 1 beats · 2973.150–3055.675 s (82.5 s; speech 76.7 s) · 49:33.15–50:55.68 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): where it shows: g 9.78 vs 9.83 m/s², the plumb line (0.1° → 0.2°), the 21-km bulge; pointers to #28B and #29; bridge back to the Coriolis push (user item 3)

## s28a_local_axes
On Earth, the floor is a sphere, and the spin arrow is tilted. Let's stand at one place, at forty five degrees north, and use three directions there: east, north, and up. Up is k, straight out of the ground. These three are all there are, because space has three dimensions. Omega isn't a fourth direction: it points along Earth's axis, so at our place it leans partly north and partly up. Just as we split b, let's split Omega into a north part, Omega times cosine phi, and an up part, Omega times sine phi. At forty five degrees, both are about five point one six times ten to the minus five. So Omega has components zero, Omega cosine phi, and Omega sine phi. At the North Pole, Omega points straight up, and at the equator it lies flat, pointing north.

> 142 words · 9 sentences · 0 beats · 3055.675–3112.925 s (57.2 s; speech 53.6 s) · 50:55.68–51:52.93 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s28b_components
Large-scale winds blow almost flat, so let's take a flat wind. Its eastward part is small u, its northward part is v, and its up part is zero. Now we find Omega cross u with the recipe. The east component is Omega's north part times zero, minus its up part times v: minus Omega sine phi times v. The north component is Omega's up part times small u, minus zero: Omega sine phi times small u. And the up component is zero times v, minus Omega's north part times small u: minus Omega cosine phi times small u.

> 98 words · 6 sentences · 0 beats · 3112.925–3154.875 s (41.9 s; speech 39.4 s) · 51:52.93–52:34.88 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s28c_flat_part
Look at the first two components. Both start with Omega sine phi, followed by minus v and small u. That's exactly k cross u, our quarter turn to the left, with components minus v, small u and zero. So the flat part of Omega cross u is Omega sine phi times k cross u, from the up part of Omega only. The third component points up or down. For a wind of ten metres per second at forty five degrees, the push it gives is about one thousandth of a metre per second squared, ten thousand times weaker than gravity, so we drop it. What's left is the sideways push: minus two Omega sine phi, times k cross u.

> 119 words · 7 sentences · 0 beats · 3154.875–3201.650 s (46.8 s; speech 43.9 s) · 52:34.88–53:21.65 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s28_f
Two Omega sine phi has its own name: the Coriolis parameter, f. So for flat winds, the Coriolis push is minus f times k cross u. Only Earth's spin about the local up direction turns flat winds sideways. At the North Pole, the ground spins about up at the full rate, like our merry-go-round. At the equator, there's no spin about up at all. At forty five degrees north, f is two times seven point two nine times ten to the minus five, times sine forty five. That's about one point zero three times ten to the minus four per second. [beat] South of the equator, the latitude counts as negative, so sine phi and f are negative too.

> 118 words · 8 sentences · 1 beats · 3201.650–3251.425 s (49.8 s; speech 45.4 s) · 53:21.65–54:11.43 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s29_turn_rule
Now the turning tool does its job. The term k cross u is the wind turned a quarter turn to the left, and the minus sign flips it to the right. In the Northern Hemisphere, f is positive, so the push points to the right of the wind. In the Southern Hemisphere, f is negative, which flips it once more, to the left. At the equator, f is zero, and there's no turning at all.

> 75 words · 5 sentences · 0 beats · 3251.425–3279.275 s (27.8 s; speech 25.6 s) · 54:11.43–54:39.28 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s30_coriolis_size
How strong is it? Take a wind of ten metres per second at forty five degrees north. The push is f times the wind speed: one point zero three times ten to the minus four, times ten. That's about one millimetre per second, every second. [beat] That's tiny, but it never stops, and it always acts at a right angle to the wind. If nothing else pushed the air, it would turn the wind round a full circle, without changing its speed. That takes two pi over f, about seventeen hours.

> 90 words · 7 sentences · 1 beats · 3279.275–3317.275 s (38.0 s; speech 34.0 s) · 54:39.28–55:17.28 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s31_globe_paths
Let's watch this on the globe. Here are two air parcels: one over south-west France, at forty five degrees north, and one over Patagonia, in Argentina, at forty five degrees south. Both are set moving towards the east at ten metres per second, with nothing else pushing them. The northern one curves to the right, towards the south. The southern one curves to the left, towards the north. Both trace loops about two hundred kilometres across, turning in opposite directions.

> 80 words · 6 sentences · 0 beats · 3317.275–3352.300 s (35.0 s; speech 32.5 s) · 55:17.28–55:52.30 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s32_reanalysis
Now let's look at real winds. These come from a reanalysis: a best estimate of the weather everywhere, on a regular grid. It's made by combining millions of measurements with a weather forecast model. Let's average them over the thirty years from nineteen ninety one to twenty twenty. Near the ground, they show a clear pattern. Around thirty degrees north and south sit belts of high pressure. They're called the subtropical highs.

> 72 words · 7 sentences · 0 beats · 3352.300–3385.200 s (32.9 s; speech 30.0 s) · 55:52.30–56:25.20 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s33_trades
Air flows out of these highs towards the equator. In the Northern Hemisphere, it heads south, and the Coriolis effect turns it to the right, towards the west, so it blows from the north east. In the Southern Hemisphere, it heads north and is turned to the left, again towards the west, so it blows from the south east. These steady winds are the trade winds, which sailing ships once used to cross the oceans. Over the oceans at fifteen degrees north and south, they blow towards the west at about five to seven metres per second. Over the Atlantic and the Pacific, the winds on both sides of the equator lean towards the west, and towards the equator.

> 119 words · 6 sentences · 0 beats · 3385.200–3430.200 s (45.0 s; speech 42.5 s) · 56:25.20–57:10.20 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s34_westerlies
Air also flows out of the subtropical highs towards the poles. In the Northern Hemisphere, it heads north and is turned to the right, towards the east. In the Southern Hemisphere, it heads south and is turned to the left, again towards the east. These are the westerlies, named, like all winds, after the direction they blow from. At forty five degrees north and south, they blow towards the east at about three to seven and a half metres per second, strongest over the Southern Ocean, where little land slows them down. Pressure patterns and friction shape these winds too, but the Coriolis turning is why they blow mostly east or west.

> 112 words · 6 sentences · 0 beats · 3430.200–3474.575 s (44.4 s; speech 41.8 s) · 57:10.20–57:54.57 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s35_storms
The cross product also explains why storms spin. A hurricane is a huge storm, hundreds of kilometres across. It forms over warm ocean, around a centre of very low pressure. Air near the surface is pushed towards that low centre from every side.

> 43 words · 4 sentences · 0 beats · 3474.575–3494.650 s (20.1 s; speech 18.2 s) · 57:54.57–58:14.65 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s36_ian
This is Hurricane Ian, seen from a weather satellite on the twenty eighth of September, twenty twenty two. Its calm centre, called the eye, is just off the south west coast of Florida, and its cloud bands curl around it. That afternoon, Ian reached the coast with winds of about sixty seven metres per second, the forecasters' best estimate from the observations. Now let's add the winds near the ground, from a weather model with a fine, three kilometre grid. In the Northern Hemisphere, each stream of air heading for the centre is turned to the right: air from the south towards the east, and air from the east towards the north. All the way round, these turned streams add up to an anticlockwise spin, seen from above. Friction near the ground slows the wind, so the air still spirals inwards as it turns.

> 144 words · 7 sentences · 0 beats · 3494.650–3551.350 s (56.7 s; speech 53.8 s) · 58:14.65–59:11.35 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s37_idai
Now the Southern Hemisphere. This is Cyclone Idai, seen from a satellite on the fourteenth of March, twenty nineteen, in the channel between Mozambique and Madagascar. In this part of the world, storms like this are called cyclones. Near its peak, its winds reached about fifty four to fifty nine metres per second, again from the forecasters' best estimates. Its cloud bands curl the other way. Here f is negative, so air heading for the centre is turned to the left, and the storm spins clockwise, seen from above. It's the same physics, with the opposite sign of f.

> 99 words · 7 sentences · 0 beats · 3551.350–3593.725 s (42.4 s; speech 39.5 s) · 59:11.35–59:53.72 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s38_spin_sign
The cross product can even measure the spin. At points around each storm, draw an arrow r from the centre, and take r cross u with the wind there. If the wind goes round anticlockwise, seen from above, the right-hand rule makes r cross u point up. For Ian, the arrows point up all the way round. For Idai, they all point down: clockwise, seen from above. Both storms spin the way the Coriolis effect turns the air.

> 78 words · 6 sentences · 0 beats · 3593.725–3626.025 s (32.3 s; speech 29.8 s) · 59:53.72–1:00:26.03 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s39_isobars
Now the last application: how the wind blows around highs and lows. Air presses on everything around it. This pressure is measured in hectopascals, and at sea level it's about a thousand hectopascals. Here's a simple weather map with one low in the middle. Joining the places with the same pressure gives lines called isobars. Here they're drawn every four hectopascals, and they circle the low.

> 66 words · 6 sentences · 0 beats · 3626.025–3656.300 s (30.3 s; speech 27.7 s) · 1:00:26.03–1:00:56.30 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s40_pressure_push
Pick a place south of the low. The pressure gradient, grad p, points the way the pressure increases fastest. Here, that's straight across the isobars, away from the low, towards the south. Air is pushed the other way, from high pressure towards low. This push, for each kilogram of air, is minus one over rho times grad p. Here rho is the density of the air, about one point two kilograms per cubic metre.

> 74 words · 6 sentences · 0 beats · 3656.300–3687.750 s (31.4 s; speech 28.9 s) · 1:00:56.30–1:01:27.75 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s40a_k_cross_gradp
Now let's use the turning tool on grad p. k cross grad p is grad p turned a quarter turn to the left. Grad p points south, so k cross grad p points east. Grad p crosses the isobars at a right angle, so a quarter turn brings it exactly along them. Looking along this new arrow, the low is on its left, and the high is on its right.

> 70 words · 5 sentences · 0 beats · 3687.750–3714.275 s (26.5 s; speech 24.3 s) · 1:01:27.75–1:01:54.28 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s41_adjust
Let's zoom in on this place, where the isobars run almost straight, from west to east. Follow an air parcel that starts at rest. The pressure push starts it moving towards the low, but as soon as it moves, the Coriolis effect turns it to the right. The faster it goes, the stronger the turning push, and it keeps turning until it blows along the isobars. It overshoots and makes a series of loops, but on average it moves along the isobars, from west to east.

> 86 words · 5 sentences · 0 beats · 3714.275–3747.225 s (32.9 s; speech 30.8 s) · 1:01:54.28–1:02:27.22 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s41a_balance
Why does it end up along the isobars? In steady flow, the air isn't speeding up, slowing down, or turning, so the pushes on it add up to zero. Only two pushes act here, so they must be equal in size and opposite in direction. The pressure push points towards the low, so the Coriolis push must point towards the high. And the Coriolis push is the wind turned a quarter turn to the right. So the wind must blow along the isobars, with the high on its right and the low on its left. This is called geostrophic balance, and the wind it gives is the geostrophic wind.

> 109 words · 7 sentences · 0 beats · 3747.225–3789.250 s (42.0 s; speech 39.1 s) · 1:02:27.22–1:03:09.25 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s42_geo_equation
Now the same steps as maths, one at a time. The two pushes add up to zero: minus f k cross u, minus one over rho grad p, equals zero. Move the pressure push to the other side: minus f k cross u equals one over rho grad p. To get the wind itself, we apply k cross to both sides. On the left, we get k cross k cross u. Turning the wind twice to the left points it backwards, so that's minus u. The two minus signs cancel, and the left side becomes f times u. Dividing by f, we get the geostrophic wind: u equals one over f rho, times k cross grad p.

> 117 words · 8 sentences · 0 beats · 3789.250–3835.325 s (46.1 s; speech 42.8 s) · 1:03:09.25–1:03:55.32 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s43_geo_pieces
Read it from right to left. Grad p points across the isobars, towards high pressure. k cross turns it a quarter turn to the left, along the isobars, with the low on the left. One over f rho sets the speed: the closer the isobars, the stronger the wind. And near the equator, f goes to zero, so this balance breaks down there.

> 63 words · 5 sentences · 0 beats · 3835.325–3861.600 s (26.3 s; speech 24.1 s) · 1:03:55.32–1:04:21.60 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s44_geo_numbers
Let's put in numbers at our place. The pressure drops by four hectopascals over four hundred kilometres going north. Four hectopascals is four hundred pascals, so grad p has components zero and minus four hundred pascals over four hundred thousand metres. That's minus ten to the minus three pascals per metre. Turned to the left, k cross grad p has components ten to the minus three and zero, pointing east. Next, f times rho is one point zero three times ten to the minus four, times one point two, about one point two four times ten to the minus four. Dividing, the wind blows east at about eight point one metres per second. [beat] A pascal is a kilogram per metre per second squared, so the units leave metres per second. As a check, the Coriolis push points south and the pressure push north, and both are about eight point three times ten to the minus four metres per second squared.

> 160 words · 9 sentences · 1 beats · 3861.600–3928.750 s (67.2 s; speech 62.4 s) · 1:04:21.60–1:05:28.75 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s45_storm_map
Now let's test it on a real storm. This is Storm Ciarán, seen from a satellite early in the afternoon of the second of November, twenty twenty three. This deep low crossed the North Atlantic and hit north-western France and southern England, whose borders are drawn as thin lines. Let's add the isobars from the reanalysis at the same time, every four hectopascals. Near the ground, friction disturbs the wind, so let's look about one and a half kilometres up, where the air feels almost no friction. The violet arrows are the geostrophic wind there, worked out with our formula from the pressure pattern. They run along the isobars, anticlockwise round the low, with the low on their left, and they're longest where the isobars crowd together.

> 127 words · 7 sentences · 0 beats · 3928.750–3980.700 s (51.9 s; speech 49.0 s) · 1:05:28.75–1:06:20.70 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s46_real_winds
Now let's add the real winds at the same height, from the reanalysis. They're drawn in a second colour. Over the sea, they point almost exactly the same way as the geostrophic arrows. They're a little slower, though, about fifteen percent near this tight low. That's because the air is racing round a sharp curve, which our simple balance leaves out. Down near the ground, it's different. Friction slows the air and turns it partly across the isobars, towards the low. So from nothing more than a pressure map and a cross product, we get the direction of the wind above the ground almost exactly, and its speed to within about a sixth.

> 113 words · 8 sentences · 0 beats · 3980.700–4025.400 s (44.7 s; speech 41.5 s) · 1:06:20.70–1:07:05.40 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s47_recap
To sum up, the cross product of two arrows is another arrow, at right angles to both. Each component leaves out its own direction and cross multiplies the other two. Each component is the turning about its own axis, made by the two parts across that axis, with a minus sign because those two parts turn opposite ways. Its length is the first arrow's length times the part of the second arrow across it: the area of their parallelogram. Its direction is the normal to their plane, and the right-hand rule says which way round. It points along the axis of the turn, and seen from its tip, the turn is anticlockwise. Physics uses it for torque, angular momentum and the push on a moving charge, and a push always at a right angle turns a motion without speeding it up. On the spinning Earth, the ground moves at Omega cross r, and moving air feels the Coriolis push, minus two Omega cross u. The spin also gives the centrifugal pull, Omega squared times the distance from the axis, and it's folded into gravity, g. For flat winds, that's minus f k cross u: to the right in the north, and to the left in the south. That's why storms spin. When this push balances the pressure push, we get the geostrophic wind, one over f rho times k cross grad p, along the isobars. Later videos in this series show how to read weather maps, and how grad, div and curl are built from these products.

> 257 words · 13 sentences · 0 beats · 4025.400–4126.725 s (101.3 s; speech 96.3 s) · 1:07:05.40–1:08:46.73 (measured, dry run 2026-10-29)
> fx1 2026-10-28 (combined fix loop 1, one-sentence splices): 236 words · 12 sentences · 3418.425–3510.725 s (measured)

> v4 fix 2, word-identical
> U-CF 2026-10-29: + S7 'The spin also gives the centrifugal pull…'

## s48_end
This video is one of a series of related tutorials, so watch out for the others. They're made to help students of meteorology, atmospheric science and climate science, and anyone else who wants to learn not just these ideas, but the maths behind them too. The notebook for the cross product, and the notebooks for the other concepts, are on the website that goes with this video.

> 67 words · 3 sentences · 0 beats · 4126.725–4152.100 s (25.4 s; speech 24.4 s) · 1:08:46.73–1:09:12.10 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

> Total: 10278 words · 660 sentences · 65 beats · 4152.100 s narration · 4154.600 s movie (1:09:14.60) · 148.5 words per minute.
