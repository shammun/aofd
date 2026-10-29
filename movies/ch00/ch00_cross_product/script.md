# ch00_cross_product — "The cross product: the part across, as an arrow (Part 1 of v5)" (plan, movie-director 2026-10-28)

House style `movies/HOUSE_STYLE.md` (reference `ch00_dot_product_why` v6). Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice, our own words, maths spoken in words. Lines starting with ">" are notes and are not spoken; `[beat]` = a 1.5-s hold after a worked calculation (not spoken, not captioned).

**Measured, not estimated.** `tools/tts.py` dry run 2026-10-28 (`G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_cross_product_split/dryrun/v3_20261028/run2/ch00_cross_product`; current `movies/lexicon.yaml`, no new entries): **41 scenes, 316 sentences, 56 beats, 4898 words, 1957.700 s narration + 2.5-s silent end-card hold = 1960.200 s (32:40.20)**; speech alone 1765.8 s = 166.4 words per minute while speaking, **149.9 words per minute overall** (limit 150); 464 caption cues; self-check {'expected_s': 1957.7, 'audio_s': 1957.7, 'diff_ms': 0.0, 'len_ok': True, 'cues_ok': True}; Kokoro render 704.3 s; warnings: none.

**Part 1 of cross product v5**
Content = cross product v5 (`movies/ch00/ch00_cross_product_why`) scenes s00_title … s19_grid, **word-identical**, with
two exceptions at the start and two new scenes at the end:
- s00_title: the sentence no longer promises meteorology (that is Part 2): "…see how physics uses it to describe turning,
  from opening a door to spinning a ball." The title animation's Part B becomes the door and the tilted-axis ball.
- s01_hook: "…what it tells us about the wind" → "…what it tells us about turning".
- **s50_recap** (new): "To sum up…", one idea per sentence, with the spoken pointer to Part 2.
- **s51_end** (new): the maths ending, word for word (HOUSE_STYLE §3), concept "this cross product".

## s00_title
In this video, we'll learn the cross product the easy way, and see how physics uses it to describe turning, from opening a door to spinning a ball.

> 28 words · 1 sentences · 0 beats · 0.300–10.725 s (10.4 s; speech 9.6 s) · 0:00.30–0:10.72 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical | PART 1: opening sentence changed (the meteorology it promised is in Part 2)

## s01_hook
What is the cross product? Let's see what it is, why it's built the way it is, and what it tells us about turning.

> 24 words · 2 sentences · 0 beats · 10.725–19.375 s (8.7 s; speech 7.5 s) · 0:10.72–0:19.38 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical | PART 1: 'about the wind' -> 'about turning'

## s02_dot_recall
In the last video, we met the dot product. We took vector a with components five and one, and vector b with components one and three, and found that a dot b equals eight. [beat] In pictures, it was the shadow of one arrow on the other, times the other arrow's length. In weather, v dot grad T told us how fast the wind carries air into warmer or colder places, on a map of isotherms, the lines of equal temperature. The dot product is a number, and it measures how much two arrows agree.

> 94 words · 5 sentences · 1 beats · 19.375–56.625 s (37.2 s; speech 33.9 s) · 0:19.38–0:56.62 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s03_door
But a number can't describe everything. Imagine pushing a door open. Push near the handle, far from the hinge, and it swings open easily. Push close to the hinge, and you need a much bigger push to turn it just as fast. So turning depends on how far from the hinge you push, and on which way you push. Draw one arrow from the hinge to your hand, along the door. Then draw a second arrow for your push. When you push at a right angle to the door, the dot product of these two arrows is zero. Yet the door turns the most. When you push along the door, straight towards the hinge, the dot product is as large as it can be. Yet the door doesn't turn at all. So for turning, the dot product gets things backwards.

> 140 words · 12 sentences · 0 beats · 56.625–109.675 s (53.0 s; speech 48.4 s) · 0:56.62–1:49.67 (measured, dry run 2026-10-28)
> v4 words kept + added: V-X1 lever arm: push near vs far from the hinge (sentences from the 1aa590f #2 plan)

## s04_left_right
There's a second problem. Suppose the wind blows north, and something pushes it sideways, to the east or to the west. Both pushes are at right angles to the wind, so both dot products are zero. The dot product can't tell a push to the right from a push to the left. A turning also has an axis: the door swings around the line of its hinge. So we need a new product, one that's largest at right angles, and that gives an arrow along an axis. That's the cross product.

> 91 words · 7 sentences · 0 beats · 109.675–144.825 s (35.1 s; speech 32.2 s) · 1:49.67–2:24.82 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s05_axes
The cross product lives in three dimensions, so let's add a third axis. Here x points east, y points north, and z points straight up. The unit vectors along them are called x hat, y hat and z hat. Each one is one unit long. Our two arrows lie flat on the floor, so their third components are zero. Vector a becomes five, one, zero, and vector b becomes one, three, zero. [beat]

> 72 words · 6 sentences · 1 beats · 144.825–175.725 s (30.9 s; speech 27.6 s) · 2:24.82–2:55.72 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s06_recipe
So how do we find the cross product? Since the answer is an arrow, we need to know how far it reaches along x, along y and along z: its three components. For the x component, we leave out the x parts and use only the y and z parts. We take the y part of vector a times the z part of b, and subtract the z part of vector a times the y part of b. The y component leaves out the y parts and uses z and x. The z component leaves out the z parts and uses x and y. Each pair follows the cycle x, y, z, and back to x, with a minus sign between the two products. We'll soon see why it's built like this.

> 132 words · 8 sentences · 0 beats · 175.725–222.875 s (47.2 s; speech 43.9 s) · 2:55.72–3:42.88 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s07_worked
Let's try it on our two arrows. The x component is one times zero, minus zero times three, which is zero. [beat] The y component is zero times one, minus five times zero, also zero. [beat] The z component is five times three, minus one times one: fifteen minus one, which is fourteen. [beat] So a cross b has components zero, zero and fourteen: an arrow fourteen units long, pointing straight up, out of the floor where the two arrows lie. [beat] That makes sense: both arrows lie flat on the floor, and turning within the floor is turning about the up direction, so only the z component survives. Because the answer is a vector, the cross product is also called the vector product.

> 120 words · 7 sentences · 4 beats · 222.875–277.100 s (54.2 s; speech 46.7 s) · 3:42.88–4:37.10 (measured, dry run 2026-10-28)
> v4 words kept + added: V-X7 plane case: turning within the floor is turning about up, so only z survives (sentences from the 1aa590f #2 plan)

## s08_sine
Now let's look at how the angle between the two arrows plays a role. The dot product used the two lengths times the cosine of theta. The length of the cross product uses the sine instead: the length of vector a times the length of b, times sine theta. Let's check it. By Pythagoras, the length of vector a is the square root of five squared plus one squared, the square root of twenty six, about five point one. [beat] The length of b is the square root of one squared plus three squared, the square root of ten, about three point one six. [beat] Dividing the dot product, eight, by the two lengths gives a cosine of about point five. [beat] So theta is about sixty degrees, with a sine of about point eight seven. [beat] Multiplied out, that's about fourteen, the length we found from the components. [beat]

> 145 words · 9 sentences · 5 beats · 277.100–338.950 s (61.8 s; speech 53.0 s) · 4:37.10–5:38.95 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s09_area
Now let's find a picture for this number. Drop a line from the tip of vector a straight onto b's line, at a right angle. For the dot product, the piece it marked off along b was the shadow. This time, look at the dropped line itself: it's the height of vector a above b's line. Its length is the length of vector a times sine theta, about four point four three. [beat] Now slide a copy of b to the tip of vector a and a copy of vector a to the tip of b. Together they make a slanted box called a parallelogram. Its area is the base times the height: three point one six times four point four three, about fourteen. [beat] So the length of a cross b is the area of the parallelogram the two arrows make.

> 140 words · 9 sentences · 2 beats · 338.950–393.850 s (54.9 s; speech 49.0 s) · 5:38.95–6:33.85 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s09a_box_proof
But why does the recipe, five times three minus one times one, give this area too? Draw a box around the parallelogram, six along and four up. Its area is twenty four. The box has six pieces left over. Two triangles sit along vector a and each is half of five times one, so together they make five. [beat] Two triangles along b, each half of one times three, make three. [beat] And two small corner squares, each one by one, make two. [beat] So the parallelogram is twenty four, minus five, minus three, minus two, which is fourteen. [beat] Do the same steps with letters, and almost everything cancels. What's left is the x part of vector a times the y part of b, minus the y part of vector a times the x part of b. That's exactly the z recipe: an area formula in disguise.

> 144 words · 11 sentences · 4 beats · 393.850–458.750 s (64.9 s; speech 56.0 s) · 6:33.85–7:38.75 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s10_right_angles
The direction is just as neat. The cross product a cross b is at a right angle to both arrows. We can check it with the dot product. A right angle gives a dot product of zero. Zero times five, plus zero times one, plus fourteen times zero, is zero. [beat] The same happens with b. But there are two directions at right angles to the floor: up and down. Which one does the cross product choose? That's what the right-hand rule tells us.

> 83 words · 9 sentences · 1 beats · 458.750–495.050 s (36.3 s; speech 31.6 s) · 7:38.75–8:15.05 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s11_rhr_curl
Hold out your right hand. Point your fingers along vector a so they follow the first arrow. Now curl your fingers towards b, the second arrow, the short way round. Your thumb now points along a cross b: straight up. Let's walk around it. From every side, the curl, the thumb and the arrow agree.

> 55 words · 6 sentences · 0 beats · 495.050–519.325 s (24.3 s; speech 21.7 s) · 8:15.05–8:39.33 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s12_rhr_flat
There's a second way to use the same hand. Point your index finger along vector a and your middle finger along b. Bend the middle finger away from your palm. Then stick your thumb straight up. Your thumb again points along a cross b. So the index finger is the first arrow, and the middle finger is the second. The thumb is the answer.

> 64 words · 7 sentences · 0 beats · 519.325–546.100 s (26.8 s; speech 23.9 s) · 8:39.33–9:06.10 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s13_rhr_screw
A third way uses a bottle cap. Turn the cap from vector a towards b, the short way round. Seen from above, that's anticlockwise, the way you open a bottle, and the cap rises, up along a cross b. Turn it back, from b towards the first arrow, and the cap screws down. [beat] A screw works the same way: turned from the first arrow towards the second, it moves along their cross product.

> 73 words · 5 sentences · 1 beats · 546.100–576.250 s (30.1 s; speech 26.8 s) · 9:06.10–9:36.25 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s14_rhr_cycle
Now let's use the rule on the three axes themselves. Point your fingers along x hat and curl them towards y hat. Your thumb points up, so x hat cross y hat is z hat. [beat] Turn your hand so your fingers point along y hat, and curl them towards z hat. Your thumb points along x hat, so y hat cross z hat is x hat. [beat] Turn it once more, fingers along z hat, curling towards x hat. Your thumb points along y hat, so z hat cross x hat is y hat. [beat] The three results follow a cycle: x, y, z, and back to x. It's the same cycle as in the recipe: the x component is built from y and z, the y component from z and x, and the z component from x and y.

> 138 words · 9 sentences · 3 beats · 576.250–632.050 s (55.8 s; speech 48.8 s) · 9:36.25–10:32.05 (measured, dry run 2026-10-28)
> v4 words kept + added: V-X6 the cycle in the axes is the cycle in the recipe (sentences from the 1aa590f #2 plan)

## s15_rhr_swap
What if we swap the order? Point your fingers along y hat first, and curl them towards x hat. To curl that way, you have to turn your hand over, and your thumb points down. So y hat cross x hat is minus z hat. [beat] In the same way, z hat cross y hat is minus x hat, and x hat cross z hat is minus y hat. [beat] And b cross a has components zero, zero and minus fourteen: the same length, pointing straight down. [beat] Swapping the order of a cross product flips its arrow. Going round the cycle backwards always gives a minus sign. That's different from the dot product, where a dot b equals b dot a.

> 119 words · 9 sentences · 3 beats · 632.050–682.275 s (50.2 s; speech 43.2 s) · 10:32.05–11:22.27 (measured, dry run 2026-10-28)
> v4 words kept + added: V-X6 going round the cycle backwards gives a minus (sentences from the 1aa590f #2 plan)

## s15a_index_form
Here's a short way to write the whole recipe, in index notation, which the index-notation video builds step by step. Let the letters i, j and k each stand for x, y or z. The i component of a cross b is epsilon i j k, times the j component of vector a times the k component of b, added up over every j and every k. Epsilon i j k is a table of signs: plus one when i, j and k follow the cycle x, y, z, minus one when they run the other way round, and zero when any two letters are the same. A repeated letter means a direction crossed with itself, which makes no area, so it gives zero. So for the z component, only two terms are left. Epsilon z x y is plus one, times five times three, and epsilon z y x is minus one, times one times one. [beat] That's fifteen minus one, fourteen again. [beat] And swapping two letters flips the sign of epsilon, which is exactly why b cross a is minus a cross b.

> fx1 2026-10-28 (combined fix loop 1, one-sentence splices): 184 words · 9 sentences · 682.275–758.000 s (measured)

> 187 words · 9 sentences · 2 beats · 682.275–758.525 s (76.2 s; speech 70.3 s) · 11:22.27–12:38.52 (measured, dry run 2026-10-28)
> new: V-X6 the cyclic pattern as a sign table (research X3c; pointer to #1b) (scene from the 1aa590f #2 plan)
> Related: #1b alternating tensor and triple products

## s16_rhr_screen
Let's see all six results on a flat screen, with x pointing right and y pointing up. Then z points straight out of the screen, towards you. An arrow coming out of the screen is drawn as a dot in a circle, like the tip of an arrow flying at you. An arrow going into the screen is drawn as a cross in a circle, like the tail feathers of an arrow flying away. So x hat cross y hat comes out of the screen, and y hat cross x hat goes into it. [beat] Y hat cross z hat points right, and z hat cross y hat points left. [beat] Z hat cross x hat points up, and x hat cross z hat points down. [beat] The right hand always tells us which way.

> 132 words · 8 sentences · 3 beats · 758.525–808.550 s (50.0 s; speech 43.3 s) · 12:38.52–13:28.55 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s17_rhr_views
The direction also depends on where you look from. Look down at the floor from above. Turning from vector a to b is anticlockwise, and a cross b points up, straight at you. Now look up from below the floor. The same turn looks clockwise, and the same arrow points away from you. [beat] Think of the parallelogram as a thin card with two coloured faces. The cross product sticks out of the face from which the turn from the first arrow to the second looks anticlockwise. So here's a handy rule. If, from where you stand, the turn from the first arrow to the second is anticlockwise, the cross product points towards you. If it's clockwise, it points away.

> 119 words · 10 sentences · 1 beats · 808.550–858.225 s (49.7 s; speech 44.6 s) · 13:28.55–14:18.23 (measured, dry run 2026-10-28)
> v4 words kept + added: V-X5 viewpoint: the two-faced card (the arrow sticks out of the face where the turn is anticlockwise) (sentences from the 1aa590f #2 plan)

## s18_cases
Now let's keep one arrow fixed and change only the other. The fixed arrow, p, has components three, zero and zero. First, q points the same way, with components two, zero and zero. The parallelogram is squashed flat, so p cross q is zero. [beat] Next, q is at a right angle to p, with components zero, two and zero. The parallelogram is a three by two rectangle, and p cross q points straight up, six units long. [beat] Last, q points the opposite way, with components minus two, zero and zero. The parallelogram is flat again, so the cross product is zero. [beat] So the cross product is zero when two vectors point the same way or in opposite directions, and as long as it can be at right angles. That's the opposite of the dot product, which is zero at a right angle, and largest when the arrows point the same way. And if q keeps turning past the opposite direction, the turn from p to q becomes clockwise, and the arrow flips to point down.

> fx1 2026-10-28 (combined fix loop 1, one-sentence splices): 175 words · 11 sentences · 857.700–931.575 s (measured)

> 175 words · 11 sentences · 3 beats · 858.225–932.300 s (74.1 s; speech 66.3 s) · 14:18.23–15:32.30 (measured, dry run 2026-10-28)
> v4 words kept + added: V-X3 pairing: the opposite of the dot product (sentences from the 1aa590f #2 plan)

## s18a_why_question
So now we know how to calculate the cross product and which way it points. But why is it built like this? Why the sine, and why an area? And if its length is an area, why is it an arrow that points up or down? And why the minus sign in the recipe? Let's take these one at a time.

> 61 words · 6 sentences · 0 beats · 932.300–954.425 s (22.1 s; speech 19.6 s) · 15:32.30–15:54.42 (measured, dry run 2026-10-28)
> v4 words kept + added: V-X8 announces the question 'why the minus sign?' (sentences from the 1aa590f #2 plan)

## s18b_across_part
Let's start with the sine. The dot product used the shadow, the part of b that lies along the first arrow. Now let's split b into two pieces. One piece lies along vector a and the other goes straight across it, at a right angle. Together they make b. Here, the part along is about one point five seven, and the part across is about two point seven five. [beat] The part across is the length of b times sine theta. So the length of a cross b is the length of vector a times the part of b across it: five point one times two point seven five, about fourteen. [beat] The dot product uses the part along, and the cross product uses the part across.

> 125 words · 9 sentences · 2 beats · 954.425–1005.900 s (51.5 s; speech 45.6 s) · 15:54.42–16:45.90 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s18d_two_parts
The two products share b between them. The part along is the length of b times cos theta, and the part across is the length of b times sine theta. They are the two short sides of a right triangle, whose long side is b itself. Multiply both sides by the length of vector a too. Then Pythagoras gives a neat rule: a dot b squared, plus the length of a cross b squared, equals the two lengths squared, multiplied. With our numbers, eight squared is sixty four, and fourteen squared is one hundred and ninety six, which add up to two hundred and sixty. [beat] That's twenty six times ten, the two lengths squared. [beat] So the dot product uses the part along, the cross product uses the part across, and together they use all of b.

> 136 words · 8 sentences · 2 beats · 1005.900–1061.250 s (55.4 s; speech 49.8 s) · 16:45.90–17:41.25 (measured, dry run 2026-10-28)
> new: V-X3 the pairing: along part (dot) and across part (cross) share b (scene from the 1aa590f #2 plan)
> Related: 0.1 dot product

## s18c_slide
What if we change only the part along? Let's slide the tip of b along the direction of vector a until it reaches six, four. The parallelogram leans over. But its base stays the same, and so does its height. So its area is still fourteen. Let's check with the recipe: five times four, minus one times six, is twenty minus six, which is fourteen again. [beat] However far we slide, a cross b doesn't change. So the cross product ignores how much two arrows agree. It measures only how much one arrow reaches across the other.

> 96 words · 9 sentences · 1 beats · 1061.250–1103.225 s (42.0 s; speech 37.2 s) · 17:41.25–18:23.22 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s20_torque
Why would anyone want the part across? Because only that part can turn things. Imagine turning a bolt with a spanner. Draw an arrow, r, from the bolt to your hand, zero point three metres long, and an arrow, F, for your push of fifty newtons. The part of the push along the spanner just pulls on the bolt, and only the part across turns it. This turning effect is called torque, written tau, and tau equals r cross F. Push at a right angle, and all fifty newtons are across: zero point three times fifty is fifteen newton metres. [beat] Push at thirty degrees, and the part along is about forty three newtons, while the part across is fifty times sine thirty, twenty five newtons. [beat] The torque drops to seven point five newton metres. [beat] Push along the spanner, and nothing is across, so the bolt doesn't turn.

> 147 words · 10 sentences · 3 beats · 1103.225–1164.900 s (61.7 s; speech 54.3 s) · 18:23.22–19:24.90 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s21_torque_axis
The torque arrow points along the bolt's axis, and the right-hand rule tells us which way the bolt turns. Curl your fingers from r towards F. If your thumb points down into the nut, the bolt tightens. If it points up, the bolt loosens. So the torque arrow is the axis of the turning, and its direction says which way round: seen from its tip, looking back down the arrow, the turn is always anticlockwise. So the cross product tells us both how strongly a force turns something, and which way.

> 91 words · 6 sentences · 0 beats · 1164.900–1200.650 s (35.8 s; speech 33.2 s) · 19:24.90–20:00.65 (measured, dry run 2026-10-28)
> v4 words kept + added: V-X5 the arrow IS the axis of turning, sense anticlockwise seen from its tip (sentences from the 1aa590f #2 plan)

## s21a_minus_sign
Torque also explains the minus sign in the recipe. Let's lay a spanner flat on the floor, with the bolt at the centre. Its arm, r, reaches point two metres along x and point one along y, and the push, F, has ten newtons along x and thirty along y. Split the push into its two parts. The thirty newtons along y push across the x part of the arm, point two metres. On their own, they turn the spanner anticlockwise, seen from above, with a torque of point two times thirty, which is six newton metres. [beat] The ten newtons along x push across the y part of the arm, point one metres. On their own, they turn the spanner the other way, clockwise, with a torque of point one times ten, which is one. [beat] The two little torques fight each other, so we subtract: six minus one is five newton metres. [beat] That's the z recipe: the x part of r times the y part of F, minus the y part of r times the x part of F. The minus sign is there because the two parts turn the spanner in opposite directions.

> 194 words · 11 sentences · 3 beats · 1200.650–1277.400 s (76.8 s; speech 69.0 s) · 20:00.65–21:17.40 (measured, dry run 2026-10-28)
> new: V-X8 z = r_x F_y − r_y F_x as two opposing mini-torques (scene from the 1aa590f #2 plan)

## s21b_x_component
The same idea builds the x component. Turning about the x axis happens in the wall made by y and z, so only the y and z parts can do it. Let's stand our spanner up in that wall: the arm reaches point two metres along y and point one along z, and the push has ten newtons along y and thirty along z. The thirty newtons along z push across the y part of the arm. Seen from the tip of x hat, looking back at the wall, they turn the spanner anticlockwise, with a torque of point two times thirty, which is six. [beat] The ten newtons along y push across the z part of the arm, and turn it clockwise: point one times ten, which is one. [beat] Again the two fight, so we subtract, and get five newton metres. [beat] That's the x recipe: the y part of r times the z part of F, minus the z part of r times the y part of F.

> 168 words · 8 sentences · 3 beats · 1277.400–1340.700 s (63.3 s; speech 56.6 s) · 21:17.40–22:20.70 (measured, dry run 2026-10-28)
> new: V-X6/V-X8 the x component built the same way (y and z parts, two opposing mini-torques)

## s21c_y_component
And the y component, the turning about y, happens in the wall made by z and x. Following the cycle, z comes before x. So the y component is the z part of r times the x part of F, minus the x part of r times the z part of F. With an arm of point two metres along z and point one along x, and a push of thirty newtons along x and ten along z, that's point two times thirty, minus point one times ten: six minus one, five again. [beat] You'll often see the recipe written as a determinant: a three by three grid, with x hat, y hat and z hat on the top row, then the parts of r, then the parts of F. We don't need determinants here, only what the grid gives. Its middle term has a minus sign in front of y hat, and the pair inside looks backwards: the x part of r times the z part of F, minus the z part of r times the x part of F. But the minus in front swaps the two products, and that's exactly our cycle order, z before x. So all three components follow one pattern: each is the turning about its own axis, made by the two parts that lie across that axis, with a plus for the turn that follows the cycle and a minus for the turn against it.

> 241 words · 9 sentences · 1 beats · 1340.700–1426.525 s (85.8 s; speech 81.1 s) · 22:20.70–23:46.53 (measured, dry run 2026-10-28)
> new: V-X6/V-X8 the y component (z and x parts, cycle order z before x) and why the determinant's middle term looks backwards; the cyclic pattern for all three
> Related: #1b alternating tensor and triple products

## s21d_tilted_axis
In full three dimensions, all three components work together. Imagine a ball floating in space, and brush your finger past it, off centre. The arrow from the centre to your finger, r, and your push, F, can both have x, y and z parts. The x and y parts turn the ball about z, just like the spanner on the floor. The y and z parts turn it about x, and the z and x parts turn it about y. Here r reaches point one metres along x and point one up, and the push is two newtons along y. The recipe gives a torque with components minus point two, zero and point two newton metres. [beat] The little torques add up like any arrows, to one torque about a tilted axis, and the ball starts to spin about that axis.

> 140 words · 8 sentences · 1 beats · 1426.525–1479.400 s (52.9 s; speech 48.5 s) · 23:46.53–24:39.40 (measured, dry run 2026-10-28)
> new: V-X9 a ball brushed off centre: three component torques add to a tilted axis (scene from the 1aa590f #2 plan)
> Related: Part 2 / #3

## s22_door_again
Now back to the door. With the cross product, a push at right angles to the door gives the largest torque, and a push along the door gives none, just as our hands tell us. The torque arrow points along the hinge: up when the door swings one way, and down when it swings the other. So the cross product is largest at right angles, and it tells left from right.

> 71 words · 4 sentences · 0 beats · 1479.400–1504.850 s (25.4 s; speech 23.6 s) · 24:39.40–25:04.85 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s22a_plane_normal
Now, why does the answer point at right angles to both arrows? The spanner turns in one flat plane, the plane of r and F, and the bolt turns about an axis sticking straight out of that plane. Any turning, or sweep of one arrow across another, happens in a plane. In three dimensions, the simplest way to say which plane is to give the one direction straight out of it: the normal to the plane. So the cross product packs two things into one arrow. Its length says how much: the area, or how strongly something turns. Its direction says which plane, and which way round: up means the turn from the first arrow to the second is anticlockwise, seen from above. The area lies flat in the plane, and the arrow stands on it like a label, telling us how big the patch is and which way it faces.

> 151 words · 8 sentences · 0 beats · 1504.850–1561.250 s (56.4 s; speech 53.1 s) · 25:04.85–26:01.25 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s22b_component_shadows
This also explains the recipe. Tilt a parallelogram, and look at its shadows on three walls. Its shadow on the floor uses only x and y parts, and its area is the z component. Its shadows on the other two walls give the x and y components. Our parallelogram lies flat on the floor, so seen from the walls it's edge on, with no area. That's why only the z component of a cross b, fourteen, is left. [beat]

> 78 words · 6 sentences · 1 beats · 1561.250–1594.075 s (32.8 s; speech 29.6 s) · 26:01.25–26:34.08 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s22c_angular_momentum
Nature uses this arrow in many places. First, a ball whirled round on a string. Let r be the arrow from the centre to the ball, half a metre long. The second arrow is the ball's momentum, p: its mass times its velocity. A two kilogram ball moving at three metres per second has a momentum of six. [beat] Then r cross p is called the angular momentum: how much spin the ball carries, and about which axis. Here it's zero point five times six, which is three, pointing straight up, because the ball goes round anticlockwise, seen from above. [beat] The string pulls along r, so it has no part across r, and it can't change the spin.

> 117 words · 8 sentences · 2 beats · 1594.075–1644.425 s (50.3 s; speech 44.8 s) · 26:34.08–27:24.42 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s22d_moving_charge
Second, a charged particle, like a proton, moving through a magnetic field. The first arrow is its velocity, v, and the second is the magnetic field, B. The push on the particle is its charge times v cross B. If it moves east and the field points straight up, v cross B is along x hat cross z hat, which is minus y hat: a push towards the south. This push is always at a right angle to the velocity. So it never speeds the particle up or slows it down. It only bends its path into a circle. That's how particle accelerators steer their beams round a ring.

> 109 words · 8 sentences · 0 beats · 1644.425–1688.750 s (44.3 s; speech 41.1 s) · 27:24.42–28:08.75 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s22e_perp_push
Why does a push at right angles change only the direction? Let's try it with numbers. An air parcel moves east at ten metres per second. One sideways kick adds one metre per second towards the north. By Pythagoras, its new speed is the square root of ten squared plus one squared, about ten point zero five. [beat] It has turned by almost six degrees, and sped up a little. Now split that kick into ten kicks, each a tenth as big, and each at a right angle to the new direction. It turns by almost the same angle, but its speed only grows to about ten point zero zero five. [beat] With a hundred kicks, it's ten point zero zero zero five. [beat] So a push that acts all the time, always at a right angle, doesn't change the speed at all: it just bends the path into a circle. The push dot the velocity is zero, so the push does no work.

> 161 words · 11 sentences · 3 beats · 1688.750–1754.975 s (66.2 s; speech 58.5 s) · 28:08.75–29:14.97 (measured, dry run 2026-10-28)
> v4 fix 2, word-identical

## s22w_when_to_use
So when do we reach for the cross product? Look at what the two arrows usually stand for. The first is normally a position or a lever arm, like r from a hinge, a bolt or the centre of a turn, and, in the next video, a spin arrow, like Earth's spin, Omega. The second is normally a force or a velocity, like a push, F, a momentum, or the wind, u, and when the first is a spin arrow, the second is often a position. Use the cross product whenever you want the size of the part of one arrow that lies across the other, together with a direction at right angles to both: the axis of a turn, or the side towards which something is pushed. That's torque, r cross F, angular momentum, r cross p, and the push on a moving charge, and, in the next video, the speed of the spinning ground, Omega cross r, and the Coriolis push, minus two Omega cross u. And keep the order in mind: swap the two arrows, and the answer flips.

> fx1 2026-10-28 (combined fix loop 1, one-sentence splices): 182 words · 7 sentences · 1754.250–1818.650 s (measured)

> 175 words · 7 sentences · 0 beats · 1754.975–1817.725 s (62.8 s; speech 59.9 s) · 29:14.97–30:17.72 (measured, dry run 2026-10-28)
> new: V-X10 / orchestrator (c) when to use it and what the two arrows usually stand for

## s19_grid
Let's put the two products side by side. The dot product gives a number, using the part along and the cosine. The cross product gives an arrow, using the part across and the sine. The dot product is a shadow times a length. The cross product's length is an area, and its direction is the normal to the plane. The dot product is largest when the arrows point the same way, the cross product at right angles, and only the cross product flips when we swap the order. So the dot product is the part along, a number, and the cross product is the part across, an axis. In mechanics, they give work and torque. In weather, the dot product gives advection, and the cross product turns the wind.

> 129 words · 9 sentences · 0 beats · 1817.725–1868.075 s (50.4 s; speech 46.8 s) · 30:17.72–31:08.08 (measured, dry run 2026-10-28)
> v4 words kept + added: V-X3/V-S the closing pair 'along, a number / across, an axis'

## s50_recap
To sum up, the cross product of two arrows is another arrow, at right angles to both. Its length is the first arrow's length times the part of the second arrow across it: the area of their parallelogram, and the size of a torque. Its direction is the axis of the turn, and seen from its tip, the turn is anticlockwise. Each component is the turning about its own axis, made by the two parts across that axis, with a minus sign because those two parts turn opposite ways. It's zero when the two arrows lie along one line, largest at right angles, and swapping the order flips it. The dot product uses the part along, and the cross product the part across. Physics uses it for torque, angular momentum and the push on a moving charge, and a push always at a right angle turns a motion without speeding it up. The next video puts the cross product to work on our spinning Earth, to explain why the wind turns and why storms spin.

> 175 words · 8 sentences · 0 beats · 1868.075–1934.450 s (66.4 s; speech 63.1 s) · 31:08.08–32:14.45 (measured, dry run 2026-10-28)
> new (Part 1 ending)
> Related: #3 cross product at work

## s51_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for this cross product, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 58 words · 3 sentences · 0 beats · 1934.450–1957.700 s (23.2 s; speech 22.2 s) · 32:14.45–32:37.70 (measured, dry run 2026-10-28)
> new (Part 1 ending)
> Related: 0.1 dot product, #1a vectors and index notation, #1b alternating tensor, #3 cross product at work

> Total: 4898 words · 316 sentences · 56 beats · 1957.700 s narration · 1960.200 s movie (32:40.20) · 149.9 words per minute.
