# ch00_cross_product_uses — "The cross product at work: why the wind turns (Part 2 of v5)" (plan, movie-director 2026-10-28)

House style `movies/HOUSE_STYLE.md` (reference `ch00_dot_product_why` v6). Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice, our own words, maths spoken in words. Lines starting with ">" are notes and are not spoken; `[beat]` = a 1.5-s hold after a worked calculation (not spoken, not captioned).

**Measured, not estimated.** `tools/tts.py` dry run 2026-10-29 (`G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_cross_product_split/dryrun/cf_20261029/ch00_cross_product_uses`; current `movies/lexicon.yaml`, no new entries): **54 scenes, 376 sentences, 10 beats, 6059 words, 2454.250 s narration + 2.5-s silent end-card hold = 2456.750 s (40:56.75)**; speech alone 2287.5 s = 158.9 words per minute while speaking, **148.1 words per minute overall** (limit 150); 603 caption cues; self-check {'expected_s': 2454.25, 'audio_s': 2454.25, 'diff_ms': -0.0, 'len_ok': True, 'cues_ok': True}; Kokoro render 1694.1 s; warnings: none.

**U-CF (2026-10-29, user 2026-10-28: derive and name the centrifugal term).** New scenes s26a1_rule, s26e_rule_again, s26f_collect, s27b_centrifugal, s27c_centrifugal_earth, s27d_centrifugal_size, s27e_effective_gravity, s27f_level_sea, s27g_three_traces; changed s26b_two_views (+1 sentence), s27_coriolis_term (S1, S3, S5, S8, S9), s47_recap (+1 sentence). Every other sentence is unchanged.

**Part 2 of cross product v5**
Content = cross product v5 (`movies/ch00/ch00_cross_product_why`) scenes s23_k_cross … s48_end, **word-identical**
(including v5's own recap s47 and its weather/climate ending s48). New at the start only:
- **s00_title**: house opening title, "The cross product / at work", one sentence.
- **s01_hook**: the question and what we'll see.
- **s01a–s01c**: recap of Part 1 (the arrow (0, 0, 14), the length = area = across part, the right-hand rule and the
  swap), reused from the 1aa590f #3 plan with "from the last video".
- **s01d_recap_push** (new): a push always at a right angle only turns (needed because v5's s23a speaks of "the magnet's
  push on the proton" and "our small kicks", both in Part 1).

## s00_title
In this video, we'll learn how the cross product works on our spinning Earth, the easy way, and see how meteorology uses it to explain why the wind turns and why storms spin.

> 33 words · 1 sentences · 0 beats · 0.300–12.825 s (12.5 s; speech 11.7 s) · 0:00.30–0:12.82 (measured, dry run 2026-10-29)
> new (Part 2 start)

## s01_hook
Where does the cross product turn up in the weather? Let's see how it describes the spinning Earth, why moving air turns, why storms spin, and how the wind blows around highs and lows.

> 34 words · 2 sentences · 0 beats · 12.825–26.125 s (13.3 s; speech 12.1 s) · 0:12.82–0:26.12 (measured, dry run 2026-10-29)
> new (Part 2 start)

## s01a_recap_arrow
First, a quick reminder of what the cross product is, from the last video. Take two arrows lying flat on the floor: vector a with components five, one and zero, and vector b with components one, three and zero. Unlike the dot product, which gives a number, their cross product, a cross b, is another arrow, at right angles to both. We find it with the recipe: each component leaves out its own direction, and cross multiplies the other two. For the z component, that's five times three, minus one times one, which is fourteen. [beat] In the x and y components, every product has a zero in it, so both are zero, and a cross b points straight up, fourteen units long.

> 122 words · 6 sentences · 1 beats · 26.125–76.475 s (50.3 s; speech 46.6 s) · 0:26.12–1:16.47 (measured, dry run 2026-10-29)
> fx1 2026-10-28 (combined fix loop 1, one-sentence splices): 122 words · 6 sentences · 26.125–76.475 s (measured)

> new (Part 2 start: recap of Part 1)
> Related: #2 cross product (Part 1)

## s01b_recap_length
Its length has a simple meaning. Split b into two pieces: a part that lies along vector a itself, and a part straight across it. The length of vector a, written with two bars, is about five point one, and the part of b across it is about two point seven five. Their product, about fourteen, is the length of a cross b: the area of the parallelogram the two arrows make. The part along doesn't count at all.

> 79 words · 5 sentences · 0 beats · 76.475–107.150 s (30.7 s; speech 28.5 s) · 1:16.47–1:47.15 (measured, dry run 2026-10-29)
> fx1 2026-10-28 (combined fix loop 1, one-sentence splices): 79 words · 5 sentences · 76.475–107.150 s (measured)

> new (Part 2 start: recap of Part 1)
> Related: #2 cross product (Part 1)

## s01c_recap_direction
Its direction comes from the right-hand rule. Point the fingers of your right hand along the first arrow, and curl them towards the second, the short way round. Your thumb points along the cross product: here, straight up, towards you if you look down from above. The unit vectors, arrows one unit long along the axes, follow the same rule: x hat cross y hat is z hat, y hat cross z hat is x hat, and z hat cross x hat is y hat. Swap the order, and the arrow flips: b cross a is minus a cross b, and x hat cross z hat is minus y hat.

> 110 words · 5 sentences · 0 beats · 107.150–148.325 s (41.2 s; speech 39.0 s) · 1:47.15–2:28.32 (measured, dry run 2026-10-29)
> fx1 2026-10-28 (combined fix loop 1, one-sentence splices): 110 words · 5 sentences · 107.150–148.325 s (measured)

> new (Part 2 start: recap of Part 1)
> Related: #2 cross product (Part 1)

## s01d_recap_push
One more idea from that video. A push that's always at a right angle to the motion, like a magnet's push on a moving proton, never speeds anything up or slows it down. Many small sideways kicks, each at a right angle to the new direction, bend the path a little at a time into a circle. This push, F, has a dot product of zero with the velocity, so it does no work: it gives no energy, and the speed stays the same all the way round.

> 88 words · 4 sentences · 0 beats · 148.325–180.250 s (31.9 s; speech 30.1 s) · 2:28.32–3:00.25 (measured, dry run 2026-10-29)
> fx1 2026-10-28 (combined fix loop 1, one-sentence splices): 88 words · 4 sentences · 148.325–180.250 s (measured)

> new (Part 2 start: recap of Part 1)
> Related: #2 cross product (Part 1), 0.1b dot product (s11b)

## s23_k_cross
Now let's see how weather uses the cross product. Meteorologists usually write a wind that blows flat along the ground as u. At any place on a map, let k be the unit vector pointing straight up, out of the ground. Think of k as an axle standing at that place: turning on a map happens around it. Take a wind blowing east at five metres per second, with components five, zero and zero. With the recipe, k cross u has components zero, five and zero, so it points north: an arrow as long as the wind, turned a quarter turn to the left around k. For a wind blowing east, north is exactly the direction ninety degrees to its left. For a wind blowing north, k cross u points west, again to its left. So k cross is a turning tool: it turns any flat arrow a quarter turn to the left, anticlockwise seen from above. Minus k cross u turns it to the right.

> 166 words · 10 sentences · 0 beats · 180.250–245.575 s (65.3 s; speech 61.4 s) · 3:00.25–4:05.57 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s23a_why_turn
Why would we want an exact quarter turn? Not to change the wind: it names the direction straight to the wind's left, with the wind's own size. We need it because Earth's spin gives moving air a push that's always at a right angle to its motion, like the magnet's push on the proton. A push at any other angle, say thirty degrees off, would have a part along the wind, and would speed the air up or slow it down. The spin's push only turns the air. So we need the wind turned by exactly a quarter turn, times a number for its strength. The wind itself doesn't jump by ninety degrees: the push bends its path a little at a time, like our small kicks. And on weather maps, k cross turns the direction in which pressure rises into the direction the wind blows.

> 146 words · 8 sentences · 0 beats · 245.575–298.875 s (53.3 s; speech 50.0 s) · 4:05.57–4:58.88 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s24_spin
Now let's see where this push comes from. Earth spins once a day around the axis through its poles. We draw this spin as an arrow, Omega, along the axis. Curl your right-hand fingers the way Earth turns, from west to east, and your thumb points to the North Pole. Omega's length is how fast Earth turns. A full turn is two pi radians, the angle unit of calculus. Measured against the distant stars, one turn takes twenty three hours and fifty six minutes, a little less than a day. So Omega is about seven point two nine times ten to the minus five radians per second.

> 107 words · 8 sentences · 0 beats · 298.875–342.825 s (43.9 s; speech 40.7 s) · 4:58.88–5:42.82 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s25a_position_vector
To follow a place on the spinning Earth, we first say where it is. Draw an arrow from Earth's centre to the place: the position vector, r. Its length is Earth's radius, about six thousand three hundred and seventy one kilometres, and it points from the centre out through the place. Let's cut Earth in half through its axis and our place, to see inside. Our place is at forty five degrees north: that angle, measured at the centre from the equator, is the latitude, phi. Let the x axis point from the centre to the equator below our place, and the z axis along Earth's axis. Then r has components of about four thousand five hundred and five kilometres along x, zero along y, and four thousand five hundred and five along z.

> 134 words · 7 sentences · 0 beats · 342.825–394.325 s (51.5 s; speech 48.6 s) · 5:42.82–6:34.32 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s25_ground_speed
How fast does our place move? As Earth turns, it goes round its circle of latitude, whose centre is on Earth's axis. So the circle's radius is the place's distance from the axis. Call theta the angle between the axis, Omega, and r. Then that distance is the length of r times sine theta. Here theta is ninety degrees minus the latitude, forty five degrees, so the radius is about four thousand five hundred and five kilometres. In one turn, the place travels two pi times the radius, and one turn takes two pi over Omega seconds. Dividing, the two pis cancel: the speed is Omega, times the length of r, times sine theta.

> 114 words · 8 sentences · 0 beats · 394.325–443.150 s (48.8 s; speech 45.6 s) · 6:34.32–7:23.15 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s25b_direction
That's exactly the length of Omega cross r. And the place moves along its circle, towards the east, at a right angle to the axis and to r. Curl your fingers from Omega towards r, and your thumb points east. So length and direction both match: the ground's velocity is Omega cross r. With the recipe, Omega has components zero, zero and seven point two nine times ten to the minus five. So Omega cross r has components zero, seven point two nine times ten to the minus five times four million five hundred and five thousand metres, and zero. That's about three hundred and twenty nine metres per second, towards the east. [beat] At the equator, it's about four hundred and sixty five, faster than sound, and at the poles, it's zero.

> 132 words · 8 sentences · 1 beats · 443.150–499.275 s (56.1 s; speech 51.7 s) · 7:23.15–8:19.27 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s26_coriolis_effect
Now imagine air moving across this spinning ground. We turn with Earth, so we judge the air's motion against the turning ground, and moving air seems to drift sideways. This apparent push is called the Coriolis effect. In the Northern Hemisphere, the half of Earth north of the equator, it turns moving air to the right, and in the Southern Hemisphere, to the left. Let's work out where it comes from.

> 71 words · 5 sentences · 0 beats · 499.275–527.625 s (28.4 s; speech 26.1 s) · 8:19.27–8:47.62 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s26a_merry_go_round
It's easiest to see on a merry-go-round: a flat disc spinning anticlockwise, seen from above, with its spin arrow, Omega, pointing up. Roll a ball across it, with nothing to rub or push it. Someone standing beside it, not turning, sees the ball roll in a straight line. But a rider turns underneath the ball, so to the rider, its path curves to the right. It's the same ball. The rider just measures its motion against a turning floor.

> 79 words · 6 sentences · 0 beats · 527.625–561.025 s (33.4 s; speech 30.9 s) · 8:47.62–9:21.02 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s26a1_rule
Before we write down what each one sees, we need one rule, and the merry-go-round shows it. Paint an arrow on the floor, and call it B. It could be any arrow: a position, a velocity, or a direction. The rider sees the painted arrow stay exactly the same. But from outside, it swings round with the floor, and its tip moves along a circle. Just as Earth's ground moves at Omega cross r, the tip moves at Omega cross B. Now suppose the rider also sees B change, for example by growing longer. Then the outside watcher sees both changes, added together. We write how fast B changes each second as d B by d t, and say who is watching. So here's the rule: d B by d t seen from outside equals d B by d t seen by the rider, plus Omega cross B. We'll use it twice: first on the position, then on the velocity.

> 160 words · 11 sentences · 0 beats · 561.025–624.425 s (63.4 s; speech 59.1 s) · 9:21.02–10:24.42 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): the rule (dB/dt)_outside = (dB/dt)_rider + Ω × B stated and motivated before it is used (user item 1)

## s26b_two_views
Let's write down what each one sees. The rider measures the ball's velocity over the floor: call it u. The floor under the ball moves at Omega cross r, where r is the arrow from the centre to the ball. So the outside watcher sees the ball's velocity as u plus Omega cross r. That's our rule used on the position r: the rider sees r change at the rate u, and the spin adds Omega cross r. Newton's law works for this watcher, who isn't turning. With nothing pushing the ball, this velocity doesn't change. So let's see how u plus Omega cross r changes. Two pieces of it change, and each gives an Omega cross u.

> 118 words · 9 sentences · 0 beats · 624.425–671.450 s (47.0 s; speech 43.4 s) · 10:24.42–11:11.45 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical
> U-CF 2026-10-29: + S5 'That's our rule used on the position r…'

## s26c_carried_arrow
The first piece is the arrow u itself. Say the rider sees the ball keep the same velocity across the floor. But the floor turns, and the rider's directions turn with it. So from outside, the arrow u swings round with the floor. Any arrow carried round by the spin changes at Omega cross that arrow, just as r did. That's the first Omega cross u.

> 66 words · 6 sentences · 0 beats · 671.450–698.925 s (27.5 s; speech 24.9 s) · 11:11.45–11:38.92 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s26d_new_ground
The second piece is the floor's speed under the ball. The ball moves to a new place, where the floor moves differently: fast near the edge, and hardly at all near the centre. The floor's velocity is Omega cross r. When the ball's position changes by u every second, Omega cross r changes by Omega cross u every second. That's the second Omega cross u. One more piece comes from the ball being carried round with the floor itself. It doesn't depend on u, and we'll come back to it.

> 90 words · 7 sentences · 0 beats · 698.925–735.750 s (36.8 s; speech 33.9 s) · 11:38.92–12:15.75 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s26e_rule_again
Now let's use the rule a second time, to find all the pieces at once. This time, the arrow B is the velocity the outside watcher sees: u plus Omega cross r. The rule says its change seen from outside is its change seen by the rider, plus Omega cross that same velocity. Let's take the rider's part first. The rider sees u change at a rate we write d u by d t: how fast the velocity over the floor changes each second. In Omega cross r, Omega doesn't change, so only r does. The rider sees r change at the rate u, so Omega cross r changes at Omega cross u. That's our second piece: the floor's speed changing under the moving ball.

> 125 words · 8 sentences · 0 beats · 735.750–786.150 s (50.4 s; speech 47.1 s) · 12:15.75–13:06.15 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): the rule applied to the outside velocity u + Ω × r; the rider's part gives du/dt + Ω × u (piece ②)

## s26f_collect
Now the last part of the rule: Omega cross, open bracket, u plus Omega cross r. The cross product works part by part, like ordinary multiplication, so we cross Omega with each part on its own. Omega cross u is our first piece: the arrow u carried round by the floor. Omega cross, open bracket, Omega cross r, is the floor's own velocity, Omega cross r, carried round in its turn. That's the leftover piece, and now we can see where it comes from. Adding everything, the change seen from outside is d u by d t, plus Omega cross u, plus Omega cross u again, plus Omega cross, open bracket, Omega cross r. The two equal pieces, one from each use of the rule, make two Omega cross u. [beat]

> 130 words · 7 sentences · 1 beats · 786.150–840.100 s (54.0 s; speech 50.4 s) · 13:06.15–14:00.10 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): Ω × (u + Ω × r) split part by part into ① Ω × u and ③ Ω × (Ω × r); the two equal Ω × u make the 2 (user item 1)

## s27_coriolis_term
Now let's put the sum to work. A push for each kilogram is just an acceleration: how much the velocity changes every second. The change seen from outside is the change of u that the rider sees, plus two Omega cross u, plus Omega cross, open bracket, Omega cross r. Newton's law says this equals the real pushes on each kilogram, like the pressure push. Move the extra pieces to the other side, and the rider sees u change by the real pushes, minus two Omega cross u, minus Omega cross, open bracket, Omega cross r. So minus two Omega cross u is the Coriolis push, for each kilogram. The two comes from the two equal pieces, and the minus from moving them to the rider's side. The leftover piece, minus Omega cross, open bracket, Omega cross r, is called the centrifugal acceleration, and it pulls outwards from the axis. We'll see why, and where it goes on Earth, right after we check the minus sign.

> 166 words · 9 sentences · 0 beats · 840.100–909.100 s (69.0 s; speech 65.4 s) · 14:00.10–15:09.10 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical
> U-CF 2026-10-29: S1 'Now let's add the pieces.' → 'Now let's put the sum to work.'; S3, S5 'the leftover piece' → 'Omega cross, open bracket, Omega cross r'; S8-S9 changed (named here; the bulge sentence moved to s27f_level_sea)

## s27a_minus_check
What does the minus mean? On the merry-go-round, Omega points up, so Omega cross u points to the left of the ball's motion. The minus flips it to the right, against the floor's turning: the curve the rider saw. Let's check with a computer. We follow the ball from outside, where it rolls straight, and redraw its path as the rider sees it. Then we use only the rider's equation, with the Coriolis push and the centrifugal pull. The two curves land exactly on top of each other.

> 88 words · 7 sentences · 0 beats · 909.100–945.525 s (36.4 s; speech 33.5 s) · 15:09.10–15:45.52 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s27b_centrifugal
Now let's look at the centrifugal acceleration, minus Omega cross, open bracket, Omega cross r. It depends only on where the ball is, not on how it moves. To see which way it points, we use the vector triple product from the triple products video. It says that p cross, open bracket, q cross s, equals q times p dot s, minus s times p dot q. Here p and q are both Omega, and s is r. So Omega cross, open bracket, Omega cross r, equals Omega times Omega dot r, minus r times Omega dot Omega. Omega dot Omega is the length of Omega, squared, which we write Omega squared. On the merry-go-round, r lies flat on the floor and Omega points straight up, so Omega dot r is zero. With the minus sign in front, the centrifugal acceleration is just Omega squared times r, pointing straight out from the centre. Our merry-go-round turns at point five radians per second, about once every twelve and a half seconds. So at two and a half metres from the centre, the centrifugal acceleration is point two five times two and a half, which is point six two five metres per second squared. [beat] That's the outward pull a rider feels, as if something were trying to throw them off the edge.

> 220 words · 12 sentences · 1 beats · 945.525–1036.100 s (90.6 s; speech 84.8 s) · 15:45.52–17:16.10 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): the leftover named; −Ω × (Ω × r) = Ω² r via the vector triple product (#1b) on the flat disc; 0.625 m/s² at 2.5 m (user item 2)

## s27c_centrifugal_earth
On Earth, r points from the centre to our place, and it isn't at right angles to Omega. So let's split r into two parts: one along Earth's axis, and one straight out from the axis, which we call r perp, short for perpendicular. In Omega times Omega dot r, only the part along the axis counts, and it gives Omega squared times that part. So it cancels the same part of Omega squared times r, and what's left is Omega squared times r perp. The length of r perp is our distance from the axis: the radius of our circle of latitude, Earth's radius times cosine phi. So the centrifugal acceleration is Omega squared, times Earth's radius, times cosine phi, pointing away from the axis. Notice its direction: it points away from the axis, not straight up, so at forty five degrees it leans towards the equator.

> 148 words · 7 sentences · 0 beats · 1036.100–1096.975 s (60.9 s; speech 58.0 s) · 17:16.10–18:16.97 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): on Earth −Ω × (Ω × r) = Ω² r⊥, size Ω² a cos φ, pointing away from the axis, leaning towards the equator (user item 2)

## s27d_centrifugal_size
How big is it on Earth? Omega squared is about five point three two times ten to the minus nine per second squared. At the equator, times six million three hundred and seventy one thousand metres, that's about zero point zero three four metres per second squared. [beat] At forty five degrees, our distance from the axis is about four thousand five hundred and five kilometres, so it's about zero point zero two four. At the poles, it's zero, because the poles sit on the axis. Gravity is about nine point eight one metres per second squared. So even at the equator, the centrifugal acceleration is only about a third of one percent of gravity.

> 114 words · 7 sentences · 1 beats · 1096.975–1145.400 s (48.4 s; speech 44.4 s) · 18:16.97–19:05.40 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): sizes on Earth: ≈ 0.034 m/s² at the equator, ≈ 0.024 at 45°, 0 at the poles, ≈ 1/3 % of g (user item 2)

## s27e_effective_gravity
So why don't weather equations have a centrifugal term? Because it never acts alone. One of the real pushes on every kilogram of air is Earth's gravitational attraction, which pulls it almost straight towards Earth's centre. Let's write it g star. Like the centrifugal acceleration, it depends only on where the air is. So we add the two together, and call the sum effective gravity, g. g equals g star, minus Omega cross, open bracket, Omega cross r. This is the gravity that a plumb line, a bathroom scale, or a dropped ball feels, and it's the g in every weather equation. So the rider's equation becomes: d u by d t equals the other real pushes, like the pressure push, plus g, minus two Omega cross u. The centrifugal acceleration is still there, just folded into g.

> 138 words · 10 sentences · 0 beats · 1145.400–1205.450 s (60.0 s; speech 56.1 s) · 19:05.40–20:05.45 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): the centrifugal term is folded into effective gravity g = g* − Ω × (Ω × r); the rider's equation then shows only g (user item 3)

## s27f_level_sea
Effective gravity has one more surprise: its direction. On a perfectly round Earth, g star would point to the centre, but the centrifugal part points away from the axis. So their sum would lean slightly towards the equator, with a part along the ground. At forty five degrees, that sideways part would be about zero point zero one seven metres per second squared. A wind of ten metres per second gets a Coriolis push of at most two Omega times ten, about zero point zero zero one five. [beat] So on a round Earth, the sideways pull would be more than ten times stronger than the Coriolis push, and the oceans would flow towards the equator and pile up there. In fact, over its long history, Earth's rock and water have settled into a slightly flattened shape, with a bulge at the equator. On that shape, the sea surface is level: effective gravity points straight down into it, with no sideways part. So in weather equations, up means straight against g, and g never pushes the wind sideways. On Earth, the slight bulge at the equator balances the centrifugal effect, so it's already part of gravity, and we can leave it out.

> 201 words · 10 sentences · 1 beats · 1205.450–1286.025 s (80.6 s; speech 75.5 s) · 20:05.45–21:26.03 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): why weather equations have no sideways centrifugal push: on a sphere it would be > 10 × the Coriolis push; the flattened Earth makes the sea level ⟂ g; the v4 'bulge ... part of gravity ... leave it out' sentence moved here (user item 3)

## s27g_three_traces
We can see the centrifugal effect in three places. First, gravity is weaker at the equator. Carefully measured, it's about nine point seven eight metres per second squared at the equator, and nine point eight three at the poles. The centrifugal pull explains about two thirds of that difference. The rest comes from the bulge itself, which puts the equator farther from Earth's centre. Second, a plumb line, a weight hanging on a string, doesn't point exactly at Earth's centre. On a round Earth, the spin alone would tilt it by up to about a tenth of a degree, near forty five degrees latitude. On the real, flattened Earth, the bulge's own pull adds about as much again, so the tilt reaches about a fifth of a degree. Third, Earth's shape: its radius at the equator is about twenty one kilometres larger than at the poles. That's only about one part in three hundred, so for everything else, we can treat Earth as a sphere. [beat] The video on circular motion builds the centrifugal effect from scratch, and the Coriolis video goes through this whole derivation in more detail. Now let's go back to the Coriolis push, and see how it works on the spinning Earth.

> 205 words · 12 sentences · 1 beats · 1286.025–1368.550 s (82.5 s; speech 76.7 s) · 21:26.03–22:48.55 (measured, dry run 2026-10-29)
> new (2026-10-29, U-CF): where it shows: g 9.78 vs 9.83 m/s², the plumb line (0.1° → 0.2°), the 21-km bulge; pointers to #28B and #29; bridge back to the Coriolis push (user item 3)

## s28a_local_axes
On Earth, the floor is a sphere, and the spin arrow is tilted. Let's stand at one place, at forty five degrees north, and use three directions there: east, north, and up. Up is k, straight out of the ground. These three are all there are, because space has three dimensions. Omega isn't a fourth direction: it points along Earth's axis, so at our place it leans partly north and partly up. Just as we split b, let's split Omega into a north part, Omega times cosine phi, and an up part, Omega times sine phi. At forty five degrees, both are about five point one six times ten to the minus five. So Omega has components zero, Omega cosine phi, and Omega sine phi. At the North Pole, Omega points straight up, and at the equator it lies flat, pointing north.

> 142 words · 9 sentences · 0 beats · 1368.550–1425.800 s (57.2 s; speech 53.6 s) · 22:48.55–23:45.80 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s28b_components
Large-scale winds blow almost flat, so let's take a flat wind. Its eastward part is small u, its northward part is v, and its up part is zero. Now we find Omega cross u with the recipe. The east component is Omega's north part times zero, minus its up part times v: minus Omega sine phi times v. The north component is Omega's up part times small u, minus zero: Omega sine phi times small u. And the up component is zero times v, minus Omega's north part times small u: minus Omega cosine phi times small u.

> 98 words · 6 sentences · 0 beats · 1425.800–1467.750 s (42.0 s; speech 39.4 s) · 23:45.80–24:27.75 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s28c_flat_part
Look at the first two components. Both start with Omega sine phi, followed by minus v and small u. That's exactly k cross u, our quarter turn to the left, with components minus v, small u and zero. So the flat part of Omega cross u is Omega sine phi times k cross u, from the up part of Omega only. The third component points up or down. For a wind of ten metres per second at forty five degrees, the push it gives is about one thousandth of a metre per second squared, ten thousand times weaker than gravity, so we drop it. What's left is the sideways push: minus two Omega sine phi, times k cross u.

> 119 words · 7 sentences · 0 beats · 1467.750–1514.525 s (46.8 s; speech 43.9 s) · 24:27.75–25:14.53 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s28_f
Two Omega sine phi has its own name: the Coriolis parameter, f. So for flat winds, the Coriolis push is minus f times k cross u. Only Earth's spin about the local up direction turns flat winds sideways. At the North Pole, the ground spins about up at the full rate, like our merry-go-round. At the equator, there's no spin about up at all. At forty five degrees north, f is two times seven point two nine times ten to the minus five, times sine forty five. That's about one point zero three times ten to the minus four per second. [beat] South of the equator, the latitude counts as negative, so sine phi and f are negative too.

> 118 words · 8 sentences · 1 beats · 1514.525–1564.300 s (49.8 s; speech 45.4 s) · 25:14.53–26:04.30 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s29_turn_rule
Now the turning tool does its job. The term k cross u is the wind turned a quarter turn to the left, and the minus sign flips it to the right. In the Northern Hemisphere, f is positive, so the push points to the right of the wind. In the Southern Hemisphere, f is negative, which flips it once more, to the left. At the equator, f is zero, and there's no turning at all.

> 75 words · 5 sentences · 0 beats · 1564.300–1592.150 s (27.9 s; speech 25.6 s) · 26:04.30–26:32.15 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s30_coriolis_size
How strong is it? Take a wind of ten metres per second at forty five degrees north. The push is f times the wind speed: one point zero three times ten to the minus four, times ten. That's about one millimetre per second, every second. [beat] That's tiny, but it never stops, and it always acts at a right angle to the wind. If nothing else pushed the air, it would turn the wind round a full circle, without changing its speed. That takes two pi over f, about seventeen hours.

> 90 words · 7 sentences · 1 beats · 1592.150–1630.150 s (38.0 s; speech 34.0 s) · 26:32.15–27:10.15 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s31_globe_paths
Let's watch this on the globe. Here are two air parcels: one over south-west France, at forty five degrees north, and one over Patagonia, in Argentina, at forty five degrees south. Both are set moving towards the east at ten metres per second, with nothing else pushing them. The northern one curves to the right, towards the south. The southern one curves to the left, towards the north. Both trace loops about two hundred kilometres across, turning in opposite directions.

> 80 words · 6 sentences · 0 beats · 1630.150–1665.175 s (35.0 s; speech 32.5 s) · 27:10.15–27:45.17 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s32_reanalysis
Now let's look at real winds. These come from a reanalysis: a best estimate of the weather everywhere, on a regular grid. It's made by combining millions of measurements with a weather forecast model. Let's average them over the thirty years from nineteen ninety one to twenty twenty. Near the ground, they show a clear pattern. Around thirty degrees north and south sit belts of high pressure. They're called the subtropical highs.

> 72 words · 7 sentences · 0 beats · 1665.175–1698.075 s (32.9 s; speech 30.0 s) · 27:45.17–28:18.08 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s33_trades
Air flows out of these highs towards the equator. In the Northern Hemisphere, it heads south, and the Coriolis effect turns it to the right, towards the west, so it blows from the north east. In the Southern Hemisphere, it heads north and is turned to the left, again towards the west, so it blows from the south east. These steady winds are the trade winds, which sailing ships once used to cross the oceans. Over the oceans at fifteen degrees north and south, they blow towards the west at about five to seven metres per second. Over the Atlantic and the Pacific, the winds on both sides of the equator lean towards the west, and towards the equator.

> 119 words · 6 sentences · 0 beats · 1698.075–1743.075 s (45.0 s; speech 42.5 s) · 28:18.08–29:03.08 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s34_westerlies
Air also flows out of the subtropical highs towards the poles. In the Northern Hemisphere, it heads north and is turned to the right, towards the east. In the Southern Hemisphere, it heads south and is turned to the left, again towards the east. These are the westerlies, named, like all winds, after the direction they blow from. At forty five degrees north and south, they blow towards the east at about three to seven and a half metres per second, strongest over the Southern Ocean, where little land slows them down. Pressure patterns and friction shape these winds too, but the Coriolis turning is why they blow mostly east or west.

> 112 words · 6 sentences · 0 beats · 1743.075–1787.450 s (44.4 s; speech 41.8 s) · 29:03.08–29:47.45 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s35_storms
The cross product also explains why storms spin. A hurricane is a huge storm, hundreds of kilometres across. It forms over warm ocean, around a centre of very low pressure. Air near the surface is pushed towards that low centre from every side.

> 43 words · 4 sentences · 0 beats · 1787.450–1807.525 s (20.1 s; speech 18.2 s) · 29:47.45–30:07.53 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s36_ian
This is Hurricane Ian, seen from a weather satellite on the twenty eighth of September, twenty twenty two. Its calm centre, called the eye, is just off the south west coast of Florida, and its cloud bands curl around it. That afternoon, Ian reached the coast with winds of about sixty seven metres per second, the forecasters' best estimate from the observations. Now let's add the winds near the ground, from a weather model with a fine, three kilometre grid. In the Northern Hemisphere, each stream of air heading for the centre is turned to the right: air from the south towards the east, and air from the east towards the north. All the way round, these turned streams add up to an anticlockwise spin, seen from above. Friction near the ground slows the wind, so the air still spirals inwards as it turns.

> 144 words · 7 sentences · 0 beats · 1807.525–1864.225 s (56.7 s; speech 53.8 s) · 30:07.53–31:04.22 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s37_idai
Now the Southern Hemisphere. This is Cyclone Idai, seen from a satellite on the fourteenth of March, twenty nineteen, in the channel between Mozambique and Madagascar. In this part of the world, storms like this are called cyclones. Near its peak, its winds reached about fifty four to fifty nine metres per second, again from the forecasters' best estimates. Its cloud bands curl the other way. Here f is negative, so air heading for the centre is turned to the left, and the storm spins clockwise, seen from above. It's the same physics, with the opposite sign of f.

> 99 words · 7 sentences · 0 beats · 1864.225–1906.600 s (42.4 s; speech 39.5 s) · 31:04.22–31:46.60 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s38_spin_sign
The cross product can even measure the spin. At points around each storm, draw an arrow r from the centre, and take r cross u with the wind there. If the wind goes round anticlockwise, seen from above, the right-hand rule makes r cross u point up. For Ian, the arrows point up all the way round. For Idai, they all point down: clockwise, seen from above. Both storms spin the way the Coriolis effect turns the air.

> 78 words · 6 sentences · 0 beats · 1906.600–1938.900 s (32.3 s; speech 29.8 s) · 31:46.60–32:18.90 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s39_isobars
Now the last application: how the wind blows around highs and lows. Air presses on everything around it. This pressure is measured in hectopascals, and at sea level it's about a thousand hectopascals. Here's a simple weather map with one low in the middle. Joining the places with the same pressure gives lines called isobars. Here they're drawn every four hectopascals, and they circle the low.

> 66 words · 6 sentences · 0 beats · 1938.900–1969.175 s (30.3 s; speech 27.7 s) · 32:18.90–32:49.17 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s40_pressure_push
Pick a place south of the low. The pressure gradient, grad p, points the way the pressure increases fastest. Here, that's straight across the isobars, away from the low, towards the south. Air is pushed the other way, from high pressure towards low. This push, for each kilogram of air, is minus one over rho times grad p. Here rho is the density of the air, about one point two kilograms per cubic metre.

> 74 words · 6 sentences · 0 beats · 1969.175–2000.625 s (31.5 s; speech 28.9 s) · 32:49.17–33:20.62 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s40a_k_cross_gradp
Now let's use the turning tool on grad p. k cross grad p is grad p turned a quarter turn to the left. Grad p points south, so k cross grad p points east. Grad p crosses the isobars at a right angle, so a quarter turn brings it exactly along them. Looking along this new arrow, the low is on its left, and the high is on its right.

> 70 words · 5 sentences · 0 beats · 2000.625–2027.150 s (26.5 s; speech 24.3 s) · 33:20.62–33:47.15 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s41_adjust
Let's zoom in on this place, where the isobars run almost straight, from west to east. Follow an air parcel that starts at rest. The pressure push starts it moving towards the low, but as soon as it moves, the Coriolis effect turns it to the right. The faster it goes, the stronger the turning push, and it keeps turning until it blows along the isobars. It overshoots and makes a series of loops, but on average it moves along the isobars, from west to east.

> 86 words · 5 sentences · 0 beats · 2027.150–2060.100 s (32.9 s; speech 30.8 s) · 33:47.15–34:20.10 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s41a_balance
Why does it end up along the isobars? In steady flow, the air isn't speeding up, slowing down, or turning, so the pushes on it add up to zero. Only two pushes act here, so they must be equal in size and opposite in direction. The pressure push points towards the low, so the Coriolis push must point towards the high. And the Coriolis push is the wind turned a quarter turn to the right. So the wind must blow along the isobars, with the high on its right and the low on its left. This is called geostrophic balance, and the wind it gives is the geostrophic wind.

> 109 words · 7 sentences · 0 beats · 2060.100–2102.125 s (42.0 s; speech 39.1 s) · 34:20.10–35:02.12 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s42_geo_equation
Now the same steps as maths, one at a time. The two pushes add up to zero: minus f k cross u, minus one over rho grad p, equals zero. Move the pressure push to the other side: minus f k cross u equals one over rho grad p. To get the wind itself, we apply k cross to both sides. On the left, we get k cross k cross u. Turning the wind twice to the left points it backwards, so that's minus u. The two minus signs cancel, and the left side becomes f times u. Dividing by f, we get the geostrophic wind: u equals one over f rho, times k cross grad p.

> 117 words · 8 sentences · 0 beats · 2102.125–2148.200 s (46.1 s; speech 42.8 s) · 35:02.12–35:48.20 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s43_geo_pieces
Read it from right to left. Grad p points across the isobars, towards high pressure. k cross turns it a quarter turn to the left, along the isobars, with the low on the left. One over f rho sets the speed: the closer the isobars, the stronger the wind. And near the equator, f goes to zero, so this balance breaks down there.

> 63 words · 5 sentences · 0 beats · 2148.200–2174.475 s (26.3 s; speech 24.1 s) · 35:48.20–36:14.47 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s44_geo_numbers
Let's put in numbers at our place. The pressure drops by four hectopascals over four hundred kilometres going north. Four hectopascals is four hundred pascals, so grad p has components zero and minus four hundred pascals over four hundred thousand metres. That's minus ten to the minus three pascals per metre. Turned to the left, k cross grad p has components ten to the minus three and zero, pointing east. Next, f times rho is one point zero three times ten to the minus four, times one point two, about one point two four times ten to the minus four. Dividing, the wind blows east at about eight point one metres per second. [beat] A pascal is a kilogram per metre per second squared, so the units leave metres per second. As a check, the Coriolis push points south and the pressure push north, and both are about eight point three times ten to the minus four metres per second squared.

> 160 words · 9 sentences · 1 beats · 2174.475–2241.625 s (67.2 s; speech 62.4 s) · 36:14.47–37:21.62 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s45_storm_map
Now let's test it on a real storm. This is Storm Ciarán, seen from a satellite early in the afternoon of the second of November, twenty twenty three. This deep low crossed the North Atlantic and hit north-western France and southern England, whose borders are drawn as thin lines. Let's add the isobars from the reanalysis at the same time, every four hectopascals. Near the ground, friction disturbs the wind, so let's look about one and a half kilometres up, where the air feels almost no friction. The violet arrows are the geostrophic wind there, worked out with our formula from the pressure pattern. They run along the isobars, anticlockwise round the low, with the low on their left, and they're longest where the isobars crowd together.

> 127 words · 7 sentences · 0 beats · 2241.625–2293.575 s (51.9 s; speech 49.0 s) · 37:21.62–38:13.57 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s46_real_winds
Now let's add the real winds at the same height, from the reanalysis. They're drawn in a second colour. Over the sea, they point almost exactly the same way as the geostrophic arrows. They're a little slower, though, about fifteen percent near this tight low. That's because the air is racing round a sharp curve, which our simple balance leaves out. Down near the ground, it's different. Friction slows the air and turns it partly across the isobars, towards the low. So from nothing more than a pressure map and a cross product, we get the direction of the wind above the ground almost exactly, and its speed to within about a sixth.

> 113 words · 8 sentences · 0 beats · 2293.575–2338.275 s (44.7 s; speech 41.5 s) · 38:13.57–38:58.28 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

## s47_recap
To sum up, the cross product of two arrows is another arrow, at right angles to both. Each component leaves out its own direction and cross multiplies the other two. Its length is the first arrow's length times the part of the second arrow across it: the area of their parallelogram. Its direction is at right angles to their plane, and the right-hand rule says which way round. In the last video, we saw that physics uses it for torque, angular momentum and the push on a moving charge, and that a push always at a right angle turns a motion without speeding it up. On the spinning Earth, the ground moves at Omega cross r, and moving air feels the Coriolis push, minus two Omega cross u. The spin also gives the centrifugal pull, Omega squared times the distance from the axis, and it's folded into gravity, g. For flat winds, that's minus f k cross u: to the right in the north, and to the left in the south. That's why storms spin. When this push balances the pressure push, we get the geostrophic wind, one over f rho times k cross grad p, along the isobars. The last video shows why the cross product is built this way, and later videos in this series show how to read weather maps, and how grad, div and curl are built from these products.

> 234 words · 11 sentences · 0 beats · 2338.275–2428.875 s (90.6 s; speech 86.3 s) · 38:58.28–40:28.88 (measured, dry run 2026-10-29)
> fx1 2026-10-28 (combined fix loop 1, one-sentence splices): 213 words · 10 sentences · 1731.300–1812.875 s (measured)

> v4 fix 2, word-identical
> U-CF 2026-10-29: + S7 'The spin also gives the centrifugal pull…'

## s48_end
This video is one of a series of related tutorials, so watch out for the others. They're made to help students of meteorology, atmospheric science and climate science, and anyone else who wants to learn not just these ideas, but the maths behind them too. The notebook for the cross product, and the notebooks for the other concepts, are on the website that goes with this video.

> 67 words · 3 sentences · 0 beats · 2428.875–2454.250 s (25.4 s; speech 24.4 s) · 40:28.88–40:54.25 (measured, dry run 2026-10-29)
> v4 fix 2, word-identical

> Total: 6059 words · 376 sentences · 10 beats · 2454.250 s narration · 2456.750 s movie (40:56.75) · 148.1 words per minute.
