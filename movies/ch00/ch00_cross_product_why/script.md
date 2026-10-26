# ch00_cross_product_why — "The cross product: an arrow at right angles, and why the wind turns" (Chapter 0A, version 1)

Version 1 (2026-10-25), written from the user-approved brief `reports/ch00_cross_product_brief.md` (U-CP.1–6) under the
binding house style `movies/HOUSE_STYLE.md` (reference movie `ch00_dot_product_why` v6). Second video of the Chapter 0
maths series (PLANNING §15.11), straight after the dot product. Voice Kokoro `af_bella`, speed 1.0; music bed as the
reference (`tools/music.py`, seed 7). Chapter-0 informal voice.

**Measured, not estimated (v1).** `tools/tts.py` dry run on 2026-10-25 (G:, `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_cross_product_why/dryrun/v4`; input = this narration and the current `movies/lexicon.yaml` with the new entries Idai, Ciarán, "a cross b", "b cross a", "b dot a"): **49 scenes, 419 sentences, 4870 words, 2003.650 s narration + 2.5-s silent end-card hold = 2006.150 s (33:26.15)**; speech alone 1835.2 s = 159.2 words per minute while speaking, **145.7 words per minute overall** (limit 150); 494 caption cues, max 16.8 characters per second, max 42 characters per line, ≤ 2 lines; self-check diff 0.0 ms; Kokoro render 2268.2 s; warnings: none.

### Brief → scene map (each user item → where the movie does it)

| Item | What the user asked | How this script does it | Scenes |
|---|---|---|---|
| U-CP.1 | No vorticity section (pointer only); right-hand rule with a 3-D hand and a screw or bottle cap; torque with a spanner and a door | No curl/vorticity; one pointer sentence in the recap ("how grad, div and curl are built from these products"). Hand3D in two grips (curl, flat) + Screw3D/BottleCap3D. Spanner torque 15 N·m / 7.5 N·m / 0, then the door again | s11–s13, s20–s22, s47 |
| U-CP.2 | Link to the dot-product video near the start; why the dot product is not enough (door torque; cannot tell left from right); refer back throughout | s02 recalls a = (5, 1), b = (1, 3), a · b = 8, the shadow, v·∇T and the isotherms; s03 the door; s04 left vs right (both dot products 0) and "an arrow along an axis". Callbacks: s08 (cos → sin), s09 (the shadow's dropped line becomes the height), s10 (perpendicular checked with a dot product = 0), s15 (a·b = b·a but a×b = −b×a), s18 (same p, q cases), s19 (side-by-side grid), s23 (u instead of the last video's v), s28 (f from the shadow of Ω, a dot product), s39 (isobars like the isotherms), s40 (grad p like grad T) | s02–s04 and callbacks |
| U-CP.3 | Real maps and real 3-D globes: trades and westerlies on a real globe with real reanalysis winds; hurricanes anticlockwise (NH) / clockwise (SH) seen from above | Globe3D with the Blue Marble texture (P5) and the long-term mean 10 m winds (P1) as moving streaklines; camera flies over the Atlantic, then the Pacific; Ian and Idai first as real satellite images draped on the globe seen from straight above (GOES-16 18:01 UTC 28 Sep 2022; VIIRS 14 Mar 2019), then real winds as inward-spiralling particles (HRRR 3 km for Ian, ERA5 for Idai); strength spoken only from IBTrACS (Ian ≈ 67 m/s at landfall, Idai ≈ 54–59 m/s); no parametric vortex; the spin sign measured with r × u (user decision 2026-10-26) | s31–s38 |
| U-CP.4 | Coriolis and geostrophic from scratch, basic level, about 3 min each; f = 2Ω sin φ explained; no rotating-frame derivation | Coriolis s24–s31 (spin arrow, ground speed Ω × r, the effect in words, −2Ω × u, f from the shadow of Ω, −f k × u right/left, size and the 17-hour circle, globe paths); "it gets its own video later". Geostrophic s39–s46 (isobars, pressure push, adjustment, the equation solved with k ×, read piece by piece, 4 hPa / 400 km ≈ 8.1 m/s, the real storm map) | s24–s31, s39–s46 |
| U-CP.5 | Right-hand rule in every way and every direction, three.js with an orbiting camera | Seven scenes, one beat per sentence: curl grip + 360° orbit (s11), flat three-finger grip (s12), bottle cap and screw both ways (s13), x×y = z, y×z = x, z×x = y with the hand turned to each (s14), the three reverses with the thumb flipping and b × a (s15), all six results on a flat screen: up/down, left/right, into/out of the screen with ⊙/⊗ (s16), the same a × b from the top, from below and from the side (s17) | s11–s17 |
| U-CP.6 | Series order | `movies/ch00/plan.md`; the recap's last sentence points to the later Coriolis, weather-map and grad/div/curl videos | s47 |

**Spoken-letter rules (from the reference).** The vector a is said only as "vector a " + a word, or inside "a dot b" /
"a cross b" (new lexicon entry, same override as "a dot b"). Never "vector a," or "vector a." and never a spoken
subscript such as "a two b three" (Kokoro reads a lone "a" as the article): the components are said as "the y part of
vector a" instead. Latitude is φ ("phi") as in the approved brief (Vallis writes ϑ; open question to the orchestrator).
The wind is u from s23 on, and the narration says why (the last video used v).

Lines starting with ">" are notes and are not spoken. Times are the measured scene start–end (s).

## s00_title
In this video, we'll learn the cross product the easy way, and see how meteorology uses it to explain why the wind turns and why storms spin.

> 27 words · 1 sentences · 0.300–10.825 s (10.5 s; speech 9.7 s) · 0:00.30–0:10.82 (measured).
> Screen: 'The cross' / 'product' (150 px, teal → gold), 'made easy' (96 px), 'and how meteorology uses it' (68 px, 'meteorology' teal). TitleCross3D: a and b sweep on a floor, a × b (violet) rises and shrinks with the parallelogram's area; on 'meteorology' a cross-fade to the spinning Blue Marble globe with a wind arrow that curves to the right.

## s01_hook
What is the cross product? Let's see what it is, why it's built this way, and what it tells us about the wind.

> 23 words · 2 sentences · 10.825–19.300 s (8.5 s; speech 7.3 s) · 0:10.82–0:19.30 (measured).
> Screen: a, b grow on the floor from frame 0; 'a × b' (128 px); the violet a × b rises on 'why it's built this way'; a faint globe thumbnail on 'about the wind'.

## s02_dot_recall
In the last video, we met the dot product. We took vector a with components five and one, and vector b with components one and three. We found that a dot b equals eight. In pictures, it was the shadow of one arrow on the other, times the other arrow's length. And in weather, v dot grad T told us how fast the wind carries air into warmer or colder places. It worked on a map of isotherms, the lines of equal temperature. That's a number, and numbers are great for measuring how much two arrows agree.

> 97 words · 7 sentences · 19.300–57.300 s (38.0 s; speech 35.1 s) · 0:19.30–0:57.30 (measured).
> Screen: the dot movie's pair plane (same grid, same colours): a = (5, 1), b = (1, 3); a·b = 5×1 + 1×3 = 8; the teal shadow band '2.530'; a mini isotherm map with v and ∇T and 'v·∇T'.

## s03_door
But a number can't describe everything. Imagine pushing a door open. Draw one arrow from the hinge to your hand, along the door. Then draw a second arrow for your push. When you push at a right angle to the door, the dot product of these two arrows is zero. Yet the door turns the most. When you push along the door, straight towards the hinge, the dot product is as large as it can be. Yet the door doesn't turn at all. So for turning, the dot product gets things backwards.

> 92 words · 9 sentences · 57.300–93.725 s (36.4 s; speech 32.8 s) · 0:57.30–1:33.72 (measured).
> Screen: Door3D seen from above at an angle: hinge, door, teal r (hinge → hand), orange F (push). Case 1 F ⟂ r: 'r·F = 0' and the door swings (big); case 2 F along r: 'r·F largest' and the door stays put; keyword 'backwards'.

## s04_left_right
There's a second problem. Suppose the wind blows north, and something pushes it sideways. The push could be to the east, or to the west. Both pushes are at right angles to the wind, so both dot products are zero. The dot product gives the same number for a push to the right as for a push to the left. So it can't tell left from right. A turning also has an axis: the door swings around the line of its hinge. So we need a new product, one that's largest at right angles. It should also give an arrow along an axis. That's the cross product.

> 107 words · 10 sentences · 93.725–135.875 s (42.2 s; speech 38.2 s) · 1:33.72–2:15.88 (measured).
> Screen: map plane: teal wind north; orange push east and push west; '= 0' under each; keyword 'left or right?'; the door's hinge line glows gold; 'largest at right angles' · 'an arrow along an axis'; then 'a × b' at 128 px.

## s05_axes
The cross product lives in three dimensions, so let's add a third axis. Here x points east, y points north, and z points straight up. The unit vectors along them are called x hat, y hat and z hat. Each one is one unit long. Our two arrows lie flat on the floor, so their third components are zero. Vector a becomes five, one, zero, and vector b becomes one, three, zero.

> 72 words · 6 sentences · 135.875–166.075 s (30.2 s; speech 27.6 s) · 2:15.88–2:46.07 (measured).
> Screen: Axes3D grows out of the 2-D pair plane (the camera tilts from straight above to 35° elevation); x̂ ŷ ẑ unit arrows with tip labels; 'a = (5, 1, 0)', 'b = (1, 3, 0)' under the picture.

## s06_recipe
So how do we find the cross product? The answer is an arrow, so we need three components. Each one has a recipe. For the x component, we leave out the x parts, and use only the y and z parts. We take the y part of vector a times the z part of b. Then we subtract the z part of vector a times the y part of b. The y component leaves out the y parts and uses z and x. The z component leaves out the z parts and uses x and y. Each pair follows the cycle x, y, z, and back to x. And there's always a minus sign between the two products.

> 118 words · 10 sentences · 166.075–211.050 s (45.0 s; speech 41.0 s) · 2:46.07–3:31.05 (measured).
> Screen: main equation a × b = (a₂b₃ − a₃b₂, a₃b₁ − a₁b₃, a₁b₂ − a₂b₁) built one component per clause; the 'x' column of a two-row component table greys out (leave out), the y·z cross-multiply links draw (gold); the cycle wheel x → y → z → x.

## s07_worked
Let's try it on our two arrows. The x component is one times zero, minus zero times three, which is zero. The y component is zero times one, minus five times zero, which is also zero. The z component is five times three, minus one times one. That's fifteen minus one, which is fourteen. So a cross b has components zero, zero and fourteen. It's an arrow fourteen units long, pointing straight up. It stands out of the floor where vector a and vector b lie. Because the answer is a vector, the cross product is also called the vector product.

> 101 words · 9 sentences · 211.050–255.350 s (44.3 s; speech 40.7 s) · 3:31.05–4:15.35 (measured).
> Screen: CalcStack: x: 1×0 − 0×3 = 0; y: 0×1 − 5×0 = 0; z: 5×3 − 1×1 = 15 − 1 = 14; 'a × b = (0, 0, 14)'; the violet arrow rises from O to 14 (scaled); keyword 'vector product'.

## s08_sine
Now let's look at how the angle between the two arrows plays a role. For the dot product, we multiplied the two lengths by the cosine of theta. The length of the cross product uses the sine instead. It's the length of vector a times the length of b, times sine theta. The sine is zero when two arrows point the same way, and one at a right angle. It's zero again when they point in opposite directions. From the last video, the lengths are about five point one and three point one six. The angle theta is about sixty degrees, with a sine of about point eight seven. Multiplied out, that's fourteen again.

> 114 words · 9 sentences · 255.350–300.925 s (45.6 s; speech 42.0 s) · 4:15.35–5:00.93 (measured).
> Screen: a·b = |a| |b| cos θ (dim, the last video) → |a × b| = |a| |b| sin θ; sin 0° = 0, sin 90° = 1, sin 180° = 0; |a| = 5.099, |b| = 3.162, θ = 60.3°, sin θ = 0.868; 5.099 × 3.162 × 0.868 ≈ 14.

## s09_area
Now let's find a picture for this number. In the last video, we dropped a line from the tip of vector a onto b's line. The piece it marked off along b was the shadow. This time, look at the dropped line itself. Its length is the height of vector a above b's line. That's the length of vector a times sine theta, about four point four three. Now slide a copy of b to the tip of vector a and a copy of vector a to the tip of b. Together they make a slanted box called a parallelogram. Its area is the base times the height. That's three point one six times four point four three, which is about fourteen. So the length of a cross b is the area of the parallelogram the two arrows make.

> 139 words · 11 sentences · 300.925–354.400 s (53.5 s; speech 49.2 s) · 5:00.93–5:54.40 (measured).
> Screen: back to the flat pair plane (camera straight above): the drop line and the dim shadow band '2.530'; the drop line becomes a gold-bracketed 'height'; 'height = |a| sin θ = 5.099 × 0.868 ≈ 4.43'; the parallelogram fills (violet 18 %); 'area = 3.162 × 4.43 ≈ 14' with a CurvedLink from the filled area to the 14.

## s10_right_angles
The direction is just as neat. The cross product a cross b is at a right angle to both arrows. We can check it with the dot product. A right angle gives a dot product of zero. Zero times five, plus zero times one, plus fourteen times zero, is zero. The same happens with b. But there are two directions at right angles to the floor: up and down. Which one does the cross product choose? That's what the right-hand rule tells us.

> 83 words · 9 sentences · 354.400–389.550 s (35.2 s; speech 31.6 s) · 5:54.40–6:29.55 (measured).
> Screen: 3-D again: right-angle ticks between a × b and a, and a × b and b; '(a × b)·a = 0×5 + 0×1 + 14×0 = 0', '(a × b)·b = 0'; a ghost arrow pointing down appears beside the up arrow, '?' between them.

## s11_rhr_curl
Hold out your right hand. Point your fingers along vector a so they follow the first arrow. Now curl your fingers towards b, the second arrow, the short way round. Your thumb now points along a cross b: straight up. Let's walk around it. From every side, the curl, the thumb and the arrow agree.

> 55 words · 6 sentences · 389.550–413.825 s (24.3 s; speech 21.7 s) · 6:29.55–6:53.82 (measured).
> Screen: Hand3D (right hand) in the curl grip; a gold curl arc from a to b; the thumb on the violet a × b; then a 360° camera orbit around z with the hand, arrows and the arc in view.

## s12_rhr_flat
There's a second way to use the same hand. Point your index finger along vector a and your middle finger along b. Bend the middle finger away from your palm. Then stick your thumb straight up. Your thumb again points along a cross b. So the index finger is the first arrow, and the middle finger is the second. The thumb is the answer.

> 64 words · 7 sentences · 413.825–440.600 s (26.8 s; speech 23.9 s) · 6:53.82–7:20.60 (measured).
> Screen: Hand3D flat grip (index on a, middle on b, thumb on a × b); finger names as keywords 'index · a', 'middle · b', 'thumb · a × b'; a slow 90° orbit.

## s13_rhr_screw
A third way uses a bottle cap, or a screw. Turn the cap from vector a towards b, the short way round. Seen from above, that's anticlockwise, the way you open a bottle. And the cap rises, up along a cross b. Turn it back the other way, from b towards the first arrow. Then the cap screws down, the way a bottle closes. A screw works the same way. Turned from the first arrow towards the second, it moves along their cross product.

> 84 words · 8 sentences · 440.600–475.400 s (34.8 s; speech 31.6 s) · 7:20.60–7:55.40 (measured).
> Screen: BottleCap3D on a bottle at O with a and b marked on the cap rim; the cap turns a → b and rises; then turns back and sinks; Screw3D beside it does the same through a block; turn arcs gold, travel arrows violet.

## s14_rhr_cycle
Now let's use the rule on the three axes themselves. Point your fingers along x hat and curl them towards y hat. Your thumb points up, so x hat cross y hat is z hat. Now turn your hand so your fingers point along y hat. Then curl them towards z hat. Your thumb points along x hat, so y hat cross z hat is x hat. Turn it once more, with your fingers along z hat, curling towards x hat. Your thumb points along y hat. So z hat cross x hat is y hat. The three results follow a cycle: x, y, z, and back to x.

> 109 words · 10 sentences · 475.400–519.350 s (44.0 s; speech 40.0 s) · 7:55.40–8:39.35 (measured).
> Screen: Axes3D; per beat the first axis teal, the second orange, the result violet; Hand3D turned to each orientation; the camera swings so the result points roughly at the viewer each time; the cycle wheel x → y → z → x builds one arc per result.

## s15_rhr_swap
What if we swap the order? Point your fingers along y hat first, and curl them towards x hat. To curl that way, you have to turn your hand over. Your thumb now points down. So y hat cross x hat is minus z hat. In the same way, z hat cross y hat is minus x hat. And x hat cross z hat is minus y hat. And b cross a has components zero, zero and minus fourteen. It has the same length, but points straight down. In general, swapping the order of a cross product flips its arrow. That's different from the dot product, where a dot b equals b dot a.

> 114 words · 11 sentences · 519.350–565.975 s (46.6 s; speech 42.3 s) · 8:39.35–9:25.98 (measured).
> Screen: the hand flips over (thumb down); ŷ × x̂ = −ẑ, ẑ × ŷ = −x̂, x̂ × ẑ = −ŷ (rose minus glyphs, results drawn dashed-violet); b × a = (0, 0, −14) with the arrow down; 'a × b = −b × a'; dim 'a·b = b·a'.

## s16_rhr_screen
Let's see all six results on a flat screen, with x pointing right and y pointing up. Then z points straight out of the screen, towards you. An arrow coming out of the screen is drawn as a dot in a circle, like the tip of an arrow flying at you. An arrow going into the screen is drawn as a cross in a circle. It's like the tail feathers of an arrow flying away. First, x hat cross y hat comes out of the screen. And y hat cross x hat goes into it. Next, y hat cross z hat points right, and z hat cross y hat points left. And z hat cross x hat points up, and x hat cross z hat points down. So the cross product can point up or down, left or right, into or out of the screen. The right hand always tells us which.

> 152 words · 11 sentences · 565.975–620.925 s (54.9 s; speech 50.6 s) · 9:25.98–10:20.92 (measured).
> Screen: orthographic front view (x right, y up, z out); ⊙ and ⊗ glyphs (96 px) with an arrow-tip / feathers sketch; six results in three pairs, each with its little hand silhouette; keywords 'out' 'in' 'right' 'left' 'up' 'down'.

## s17_rhr_views
The direction also depends on where you look from. Look down at the floor from above. Turning from vector a to b is anticlockwise, and a cross b points up, straight at you. Now look up from below the floor. The very same turn now looks clockwise, and the same arrow points away from you. From the side, you see it standing straight up. So here's a handy rule. If, from where you stand, the turn from the first arrow to the second is anticlockwise, the cross product points towards you. If it's clockwise, it points away.

> 97 words · 9 sentences · 620.925–660.800 s (39.9 s; speech 36.3 s) · 10:20.92–11:00.80 (measured).
> Screen: the a, b, a × b scene with a translucent floor; camera keyframes top (⊙ at O, anticlockwise arc) → below (⊗, the arc now clockwise) → side (arrow up); keywords 'from above · anticlockwise · towards you', 'from below · clockwise · away'.

## s18_cases
Now let's keep one arrow fixed and change only the other one. We did the same for the dot product. The fixed arrow, p, has components three, zero and zero. First, q points in the same direction as p, with components two, zero and zero. The parallelogram is squashed flat and has no area. That makes p cross q zero. In the next case, q is at a right angle to p. Its components are zero, two and zero. Now the parallelogram is a rectangle, three by two. And p cross q points straight up, six units long. Last, q points in the opposite direction, with components minus two, zero and zero. The parallelogram is flat again, so the cross product is zero. In general, when two vectors point the same way or in opposite directions, their cross product is zero. And when they're at right angles, it's as long as it can be. If q keeps turning, past the opposite direction, the turn from p to q becomes clockwise. Then the arrow flips to point down.

> 177 words · 16 sentences · 660.800–737.175 s (76.4 s; speech 70.3 s) · 11:00.80–12:17.17 (measured).
> Screen: three 3-D panels (camera 30° elevation), p teal identical in each; q = (2, 0, 0) / (0, 2, 0) / (−2, 0, 0) with tip labels; p × q = (0, 0, 0), (0, 0, 6), (0, 0, 0); the 3 × 2 rectangle violet; then one panel where q sweeps on round and p × q flips to (0, 0, −6).

## s19_grid
Let's put the two products side by side. The dot product gives a number, and the cross product gives an arrow. The dot product uses the cosine of the angle. The cross product uses the sine. In pictures, the dot product is a shadow times a length. The length of the cross product is an area. The dot product is largest when the arrows point the same way. The cross product is largest when they're at right angles. Swapping the order doesn't change the dot product, but it flips the cross product. In mechanics, the dot product gives work. The cross product gives torque, which we'll meet next. And in weather, the dot product gives advection. The cross product turns the wind, as we'll see soon.

> 126 words · 13 sentences · 737.175–790.750 s (53.6 s; speech 48.6 s) · 12:17.17–13:10.75 (measured).
> Screen: a two-column grid without boxes or rules, header glyphs 'a·b' (teal-orange) and 'a × b' (violet); rows one per sentence: number | arrow · cos θ | sin θ · shadow × length | area · same way | right angle · order: same | flips · work | torque · v·∇T advection | k × ∇p turning; each row's mini picture in the left margin.

## s20_torque
Now let's see why physics needs the cross product. Imagine turning a bolt with a spanner. Draw an arrow, r, from the bolt to your hand, zero point three metres long. Then draw an arrow, F, for your push of fifty newtons. The turning effect of a force is called torque, written tau. It's the cross product of r with F: tau equals r cross F. Push at a right angle, and the size of the torque is zero point three times fifty times sine ninety degrees. That's fifteen newton metres. Push at thirty degrees to the spanner, and the sine is one half. The torque drops to seven point five newton metres. Push along the spanner, and the torque is zero: the bolt doesn't turn.

> 126 words · 11 sentences · 790.750–842.150 s (51.4 s; speech 47.1 s) · 13:10.75–14:02.15 (measured).
> Screen: Spanner3D from above at 45°: bolt, spanner, teal r '0.3 m', orange F '50 N'; τ = r × F; |τ| = 0.3 × 50 × sin 90° = 15 N·m; F swings to 30°: 0.3 × 50 × sin 30° = 7.5 N·m; F along r: 0; the violet τ arrow on the bolt's axis grows and shrinks with the case.

## s21_torque_axis
The torque arrow points along the bolt's axis. The right-hand rule tells us which way the bolt turns. Curl your fingers from r towards F. If your thumb points down into the nut, the bolt tightens, and if it points up, the bolt loosens. Seen from above, a clockwise turn makes the arrow point down, away from you. So the cross product tells us both how strongly a force turns something, and which way.

> 74 words · 6 sentences · 842.150–871.575 s (29.4 s; speech 26.9 s) · 14:02.15–14:31.58 (measured).
> Screen: Hand3D curl grip on the spanner; the bolt turns clockwise seen from above and sinks (thread); τ violet down, ⊗ at the bolt in the inset top view; then the push reversed: τ up, ⊙, bolt rises.

## s22_door_again
Now back to the door. With the cross product, a push at right angles to the door gives the largest torque. A push along the door gives none, just as our hands tell us. And the torque arrow points along the hinge. It points up when the door swings one way, and down when it swings the other. So the cross product does what the dot product couldn't. It's largest at right angles, and it tells left from right.

> 79 words · 7 sentences · 871.575–901.650 s (30.1 s; speech 27.2 s) · 14:31.58–15:01.65 (measured).
> Screen: Door3D again: push ⟂ → big violet τ up along the hinge, door swings open (anticlockwise from above); push along → τ = 0; push the other way → τ down, door swings shut; keywords 'largest at right angles', 'left or right ✓'.

## s23_k_cross
In weather, we need one particular cross product again and again. Meteorologists usually write a wind that blows flat along the ground as u. So we'll use u from now on, instead of the v of the last video. On a map, let k be the unit vector pointing straight up, out of the ground. Take a wind blowing east at five metres per second. Its components are five, zero and zero. Then k cross u has components zero, five and zero: it points north. The wind arrow has been turned ninety degrees to the left. Its length hasn't changed. Try a wind blowing north. Now k cross u points west, again ninety degrees to the left. So k cross is a turning tool: it turns any flat arrow a quarter turn to the left, anticlockwise seen from above. And minus k cross u turns it a quarter turn to the right.

> 152 words · 13 sentences · 901.650–965.325 s (63.7 s; speech 58.7 s) · 15:01.65–16:05.33 (measured).
> Screen: a map plane in 3-D (30° elevation) with 'east', 'north'; k violet up; u teal east '5 m/s'; k × (5, 0, 0) = (0 × 0 − 1 × 0, 1 × 5 − 0 × 0, 0) = (0, 5, 0) with the 90° arc; u north → k × u west; then the top view with a gold quarter-turn arc 'left'; −k × u 'right'.

## s24_spin
Now let's see why the wind needs turning. Earth spins once a day around the axis through its poles. We can draw this spin as an arrow, Omega, along the axis. The right-hand rule picks its direction. Curl your fingers the way Earth turns, from west to east, and your thumb points to the North Pole. Its length is how fast Earth turns. A full turn is two pi radians, the angle unit of calculus. Measured against the distant stars, one turn takes twenty three hours and fifty six minutes. That's a little less than a day. So Omega is about seven point two nine times ten to the minus five radians per second.

> 114 words · 10 sentences · 965.325–1012.850 s (47.5 s; speech 43.6 s) · 16:05.33–16:52.85 (measured).
> Screen: Globe3D (Blue Marble P5) turning west → east (time compressed), the violet Ω arrow along the axis out of the North Pole; Hand3D curl grip round the axis; Ω = 2π / 1 day ≈ 7.29 × 10⁻⁵ rad/s.

## s25_ground_speed
Every point on the ground is carried round by this spin. Draw an arrow, r, from Earth's centre to that point. Earth's radius is about six thousand three hundred and seventy one kilometres. The point's velocity is then Omega cross r, another cross product. At the equator, r is at a right angle to Omega, so the speed is as large as it can be. It's about four hundred and sixty five metres per second, faster than the speed of sound. At forty five degrees north, the angle is smaller. The speed there is about three hundred and twenty nine metres per second. At the poles, r points along Omega, so the cross product is zero. There, the ground just turns on the spot.

> 124 words · 10 sentences · 1012.850–1064.850 s (52.0 s; speech 48.0 s) · 16:52.85–17:44.85 (measured).
> Screen: the globe cut-away: r teal from the centre, Ω violet, Ω × r orange tangent arrows at 0°, 45°N, 90°N; |Ω × r| = 7.29 × 10⁻⁵ × 6 371 000 m ≈ 465 m/s at 0°; ≈ 329 m/s at 45°N; 0 at the pole.

## s26_coriolis_effect
Now imagine air moving across this spinning ground. We stand on Earth and turn with it. So we judge the air's motion against the turning ground. Seen this way, moving air drifts sideways. It's as if a force pushed it at a right angle to its motion. This apparent push is called the Coriolis effect. In the Northern Hemisphere, the half of Earth north of the equator, it turns moving air to the right. In the Southern Hemisphere, it turns it to the left. Where it comes from needs the maths of spinning frames. It gets its own video later in this series.

> 103 words · 10 sentences · 1064.850–1106.375 s (41.5 s; speech 37.6 s) · 17:44.85–18:26.38 (measured).
> Screen: Globe3D with an air-parcel track in each hemisphere (P-free: computed paths, see storyboard) curving right (NH) and left (SH); keywords 'Coriolis effect', 'Northern Hemisphere · right', 'Southern Hemisphere · left'.

## s27_coriolis_term
Here's what it looks like as maths. The Coriolis effect adds a push of minus two Omega cross u for each kilogram of air, where u is the wind. Because it's a cross product, this push is always at a right angle to the wind. So its dot product with the wind is zero. It does no work, and it never speeds the wind up or slows it down. It only turns it.

> 73 words · 6 sentences · 1106.375–1134.550 s (28.2 s; speech 25.6 s) · 18:26.38–18:54.55 (measured).
> Screen: −2Ω × u (96 px) with underbraces 'spin', 'wind'; a local 3-D patch: u teal, Ω violet, the push orange ⟂ u; '(−2Ω × u)·u = 0'; keyword 'only turns'.

## s28_f
For winds that blow flat along the ground, only part of Omega matters. It's the shadow of Omega on the local up direction, k. Phi is the latitude, the angle north of the equator. Between Omega and k, the angle is ninety degrees minus phi. So the shadow is Omega times sine phi, a dot product again. Twice this shadow has its own name, the Coriolis parameter, f: f equals two Omega sine phi. At forty five degrees north, f is about one point zero three times ten to the minus four per second. At the equator, the shadow is zero, so f is zero. South of the equator, the latitude counts as negative. So sine phi and f are negative too.

> 122 words · 10 sentences · 1134.550–1186.750 s (52.2 s; speech 48.2 s) · 18:54.55–19:46.75 (measured).
> Screen: Globe3D cut-away at 45°N: Ω violet on the axis, k at the site, the angle 90° − φ, the violet shadow band of Ω on k; Ω·k = Ω cos(90° − φ) = Ω sin φ; f = 2Ω sin φ; f = 2 × 7.29 × 10⁻⁵ × sin 45° ≈ 1.03 × 10⁻⁴ s⁻¹; the site slides to 0° (shadow 0, f = 0) and to 45°S (shadow points down, f < 0, rose '−').

## s29_turn_rule
So, for flat winds, the Coriolis push becomes minus f times k cross u. Now the turning tool does its job. The term k cross u is the wind turned a quarter turn to the left. The minus sign flips it to the right. In the Northern Hemisphere, f is positive. So the push points to the right of the wind. In the Southern Hemisphere, f is negative, which flips it once more, to the left. At the equator, f is zero, and there's no turning at all.

> 88 words · 8 sentences · 1186.750–1221.250 s (34.5 s; speech 31.2 s) · 19:46.75–20:21.25 (measured).
> Screen: −2Ω × u → −f k × u; three map patches NH / equator / SH: u teal, k × u (dim, left), −f k × u orange (right in NH, left in SH, absent at 0°); signs 'f > 0', 'f = 0', 'f < 0' with '+', '0', '−' glyphs.

## s30_coriolis_size
How strong is it? Take a wind of ten metres per second at forty five degrees north. The push is f times the wind speed: one point zero three times ten to the minus four, times ten. That's about one millimetre per second, every second. That's tiny, but it never stops. If nothing else pushed the air, it would turn the wind round a full circle. That takes two pi over f, about seventeen hours.

> 75 words · 7 sentences · 1221.250–1253.375 s (32.1 s; speech 29.2 s) · 20:21.25–20:53.38 (measured).
> Screen: |−f k × u| = f |u| = 1.03 × 10⁻⁴ s⁻¹ × 10 m/s ≈ 1.03 × 10⁻³ m/s²; 'about 1 mm/s every second'; 2π / f ≈ 16.9 h with a clock glyph; a top-view circle traced by the turning wind arrow.

## s31_globe_paths
Let's watch this on the globe. Here are two air parcels, one at forty five degrees north and one at forty five degrees south. Both are set moving towards the east at ten metres per second, with nothing else pushing them. The northern one curves to the right, and the southern one curves to the left. Both trace loops about two hundred kilometres across, turning in opposite directions.

> 68 words · 5 sentences · 1253.375–1281.300 s (27.9 s; speech 25.7 s) · 20:53.38–21:21.30 (measured).
> Screen: Globe3D, camera close over each parcel in turn (regional zoom, true 10 m/s and true loop size); two tracks from the sphere integration; clock 't = 0 … 17 h'; keywords 'right' (NH), 'left' (SH).

## s32_reanalysis
Now let's look at real winds. These come from a reanalysis: a best estimate of the weather everywhere, on a regular grid. It's made by combining millions of measurements with a weather forecast model. Let's average them over the thirty years from nineteen ninety one to twenty twenty. Near the ground, they show a clear pattern. Around thirty degrees north and south sit belts of high pressure. They're called the subtropical highs.

> 72 words · 7 sentences · 1281.300–1314.200 s (32.9 s; speech 30.0 s) · 21:21.30–21:54.20 (measured).
> Screen: Globe3D (Blue Marble, P5) with the NCEP/NCAR R1 1991–2020 mean 10 m wind as moving streaklines (P1); '1991–2020' on the spoken years; 'H' labels on the ocean sea-level-pressure maxima near 30°N and 30°S (high ground masked); keywords 'reanalysis', 'subtropical highs'.

## s33_trades
Air flows out of these highs towards the equator. In the Northern Hemisphere, that air heads south, and the Coriolis effect turns it to the right, towards the west. So it blows from the north east. In the Southern Hemisphere, it heads north and is turned to the left, again towards the west. So it blows from the south east. These steady winds are the trade winds, which sailing ships once used to cross the oceans. Over the oceans at fifteen degrees north and south, they blow towards the west at about five to seven metres per second. Let's fly over the Atlantic, and then over the Pacific. Over both oceans, the winds on either side of the equator lean towards the west.

> 123 words · 9 sentences · 1314.200–1363.200 s (49.0 s; speech 45.4 s) · 21:54.20–22:43.20 (measured).
> Screen: illustrative 'heads south → turned right' / 'heads north → turned left' arrows; '≈ 5–7 m/s towards the west' at 15°N/S (P1 sectors −4.9 … −6.9 m/s); camera flight Atlantic then Pacific over the P1 streaklines; keyword 'trade winds'.

## s34_westerlies
Air also flows out of the subtropical highs towards the poles. In the Northern Hemisphere, it heads north and is turned to the right, towards the east. In the Southern Hemisphere, it heads south and is turned to the left, again towards the east. These are the westerlies, named, like all winds, after the direction they blow from. At forty five degrees north and south, they blow towards the east at about three to seven and a half metres per second. They're strongest over the Southern Ocean, where there's little land to slow them down. This is a simple picture. Pressure patterns and friction shape the winds too. But the Coriolis turning is why they blow mostly east or west, rather than straight north or south.

> 126 words · 9 sentences · 1363.200–1413.875 s (50.7 s; speech 47.1 s) · 22:43.20–23:33.88 (measured).
> Screen: illustrative turned arrows at 45°N and 45°S; '≈ 3–7.5 m/s towards the east' (P1 sectors +3.2 … +7.5 m/s); camera to the Southern Ocean; keyword 'westerlies'.

## s35_storms
The cross product also explains why storms spin. A hurricane is a huge storm, hundreds of kilometres across. It forms over warm ocean, around a centre of very low pressure. Air near the surface is pushed towards that low centre from every side.

> 43 words · 4 sentences · 1413.875–1433.950 s (20.1 s; speech 18.2 s) · 23:33.88–23:53.95 (measured).
> Screen: the globe flies to the Gulf of Mexico; the GOES-16 true-colour image (2022-09-28 18:01 UTC) draped on the globe, camera straight down; 'L' at the centre; eight dashed illustrative inward arrows.

## s36_ian
This is Hurricane Ian, seen from a weather satellite on the twenty eighth of September, twenty twenty two. Its calm centre, called the eye, is just off the south west coast of Florida. Its cloud bands curl around the eye. That afternoon, Ian reached the coast with winds of about sixty seven metres per second. That's the forecasters' best estimate, made from the observations. Now let's add the winds near the ground, from a weather model with a fine, three kilometre grid. In the Northern Hemisphere, each stream of air heading for the centre is turned to the right. Air coming from the south is turned towards the east. And air coming from the east is turned towards the north. All the way round, these turned streams add up to an anticlockwise spin, seen from above. Near the ground, friction slows the wind. So the air still spirals inwards as it turns.

> 152 words · 12 sentences · 1433.950–1496.625 s (62.7 s; speech 58.0 s) · 23:53.95–24:56.62 (measured).
> Screen: GOES-16 true colour (then a cross-fade to the band-13 infrared) on the globe from straight above; keyword 'eye' with a pointer; '≈ 67 m/s · observed' (IBTrACS landfall 130 kt, 19:05 UTC; never an HRRR or ERA5 strength); HRRR 3-km 10 m winds (18 UTC) as particles spiralling inwards anticlockwise; inward arrows bend right; gold anticlockwise arc 'anticlockwise · from above'.

## s37_idai
Now the Southern Hemisphere. This is Cyclone Idai, seen from a satellite on the fourteenth of March, twenty nineteen. It sits in the channel between Mozambique and Madagascar. Its cloud bands curl the other way. In this part of the world, storms like this are called cyclones. Near its peak, its winds reached about fifty four to fifty nine metres per second, again from the forecasters' best estimates. Here f is negative, so air heading for the centre is turned to the left. The storm spins clockwise, seen from above. It's the same physics, with the opposite sign of f.

> 100 words · 9 sentences · 1496.625–1540.850 s (44.2 s; speech 40.6 s) · 24:56.62–25:40.85 (measured).
> Screen: camera travels to the Mozambique Channel; NASA VIIRS true colour (2019-03-14) draped on the globe, Madagascar beside the storm; '≈ 54–59 m/s · observed' (IBTrACS 105–115 kt); ERA5 10 m winds as particles spiralling inwards clockwise; inward arrows bend left; gold clockwise arc; Ian | Idai side by side, 'f > 0' / 'f < 0'.

## s38_spin_sign
The cross product can even measure the spin for us. At each point around the storm, draw an arrow r from the centre to the point. Then take r cross u with the wind there. If the wind goes round anticlockwise, seen from above, the turn from r to u is anticlockwise too. Then the right-hand rule makes r cross u point up. For Ian, the arrows point up all the way round. For Idai, they point down: clockwise, seen from above. So both storms spin the way the Coriolis effect turns the air. They spin anticlockwise in the north, and clockwise in the south.

> 105 words · 9 sentences · 1540.850–1583.775 s (42.9 s; speech 39.3 s) · 25:40.85–26:23.78 (measured).
> Screen: both storms tilted to 35°, satellite images dimmed to 40 %: 16 ring points at 150 km, teal r, orange u (HRRR for Ian, ERA5 for Idai), violet r × u columns up (Ian) / down (Idai), ⊙ / ⊗; 'north: anticlockwise', 'south: clockwise'.

## s39_isobars
Now the last application: how the wind blows around highs and lows. Air presses on everything around it. This pressure is measured in hectopascals. At sea level, it's about a thousand hectopascals. On a weather map, we join the places with the same pressure. We did the same with temperature in the last video. These lines are called isobars.

> 59 words · 7 sentences · 1583.775–1611.675 s (27.9 s; speech 25.0 s) · 26:23.78–26:51.67 (measured).
> Screen: a flat idealised strip map (the dot movie's isotherm map style): pressure colour, then the lines draw one by one: 1004 hPa (north) and 1008 hPa (south) 400 km apart plus neighbours every 4 hPa; keyword 'isobars' (like 'isotherms', dim thumbnail); 'H' south, 'L' north.

## s40_pressure_push
Like grad T, grad p points the way the pressure increases fastest. It points straight across the isobars, towards high pressure. Air is pushed the other way, from high pressure towards low. This push, for each kilogram of air, is minus one over rho times grad p. Here rho is the density of the air: about one point two kilograms per cubic metre.

> 63 words · 5 sentences · 1611.675–1638.875 s (27.2 s; speech 25.0 s) · 26:51.67–27:18.88 (measured).
> Screen: orange ∇p at the pin pointing south (towards H); the push −(1/ρ)∇p orange-dashed pointing north (towards L); keyword 'pressure push'; 'ρ ≈ 1.2 kg/m³'.

## s41_adjust
Let's follow an air parcel that starts at rest between a high and a low. The pressure push starts it moving towards the low. But as soon as it moves, the Coriolis effect turns it to the right. The faster it goes, the stronger the turning push. Soon the parcel blows along the isobars. In fact, it overshoots and makes a series of loops. But on average, it moves along the isobars. Along that average path, the two pushes are equal and opposite. The pressure push points towards the low, and the Coriolis push points towards the high. This balance is called geostrophic balance, and the wind it gives is the geostrophic wind. In the Northern Hemisphere, it blows with low pressure on its left.

> 125 words · 11 sentences · 1638.875–1692.375 s (53.5 s; speech 49.2 s) · 27:18.88–28:12.38 (measured).
> Screen: the parcel's path on the strip map from the adjustment solution (slightly damped), the teal velocity arrow on the parcel, the two push arrows (pressure orange-dashed, Coriolis violet) at the parcel; clock 't = 0 … 2 days'; at the end the two arrows equal and opposite; keyword 'geostrophic balance', 'low on the left'.

## s42_geo_equation
Written as maths, the balance says that f times k cross u equals minus one over rho times grad p. We want the wind itself, so we apply k cross to both sides. Turning the wind twice to the left points it backwards. So k cross k cross u is minus u. Dividing by f and rho, we get the geostrophic wind. The wind u equals one over f rho, times k cross grad p.

> 75 words · 6 sentences · 1692.375–1723.075 s (30.7 s; speech 28.2 s) · 28:12.38–28:43.08 (measured).
> Screen: CalcStack: f k × u = −(1/ρ)∇p; k × (f k × u) = −(1/ρ) k × ∇p; k × (k × u) = −u (two quarter turns, mini picture); u = (1/(fρ)) k × ∇p (96 px, gold underline).

## s43_geo_pieces
Let's read it piece by piece. Grad p points across the isobars, towards high pressure. Then k cross turns it a quarter turn to the left, so the wind blows along the isobars. High pressure is on its right, and low pressure is on its left. One over f rho sets the speed. The closer the isobars, the steeper the pressure, and the stronger the wind. And near the equator, f goes to zero, so this balance breaks down there.

> 80 words · 7 sentences · 1723.075–1755.975 s (32.9 s; speech 30.0 s) · 28:43.08–29:15.97 (measured).
> Screen: the main equation with underbraces 'across the isobars' (∇p), 'quarter turn left' (k ×), 'sets the speed' (1/(fρ)); on the strip map ∇p (south) turns 90° left → u east along the isobars; 'low on the left'; a second strip with isobars twice as close and a longer arrow; 'f → 0 near the equator'.

## s44_geo_numbers
Let's put in numbers. Suppose the pressure drops by four hectopascals over four hundred kilometres, going north. We're at forty five degrees north. Four hectopascals is four hundred pascals. So the pressure gradient is four hundred pascals over four hundred thousand metres: ten to the minus three pascals per metre. Next, we multiply f by rho: one point zero three times ten to the minus four, times one point two. That's about one point two four times ten to the minus four. Dividing, the wind speed is about eight point one metres per second. The units work out. A pascal is a kilogram per metre per second squared, and what's left is metres per second. And since the low pressure lies to the north, the wind blows east, with the low on its left, just like the westerlies.

> 138 words · 11 sentences · 1755.975–1815.750 s (59.8 s; speech 55.5 s) · 29:15.97–30:15.75 (measured).
> Screen: CalcStack: |∇p| = 400 Pa / 400 000 m = 1.00 × 10⁻³ Pa/m; fρ = 1.03 × 10⁻⁴ × 1.2 ≈ 1.24 × 10⁻⁴; |u| = 1.00 × 10⁻³ / 1.24 × 10⁻⁴ ≈ 8.1 m/s; unit line Pa = kg m⁻¹ s⁻² → m/s (struck units); the 400-km bracket on the strip with a CurvedLink to 400 000 m; u east '8.1 m/s'.

## s45_storm_map
Now let's test it on a real storm. This is Storm Ciarán, a deep low that crossed the North Atlantic. It reached England and France in early November twenty twenty three. Here it is early on the second of November. The isobars are drawn every four hectopascals, and they circle the low. Near the ground, friction disturbs the wind. So let's look about one and a half kilometres up, where the air feels almost no friction. The violet arrows are the geostrophic wind at that height. We worked them out with our formula, from the pressure pattern there. They run along the isobars, anticlockwise round the low. The low is always on their left. Where the isobars crowd together, the arrows are longest.

> 123 words · 12 sentences · 1815.750–1868.825 s (53.1 s; speech 48.4 s) · 30:15.75–31:08.83 (measured).
> Screen: Storm Ciarán at 2023-11-02 00 UTC (P4): mean sea-level pressure isobars every 4 hPa, 'L'; a side glyph '≈ 1.5 km'; violet geostrophic arrows from the 850 hPa heights, sea points only; gold anticlockwise arc; no ERA5 intensity numbers.

## s46_real_winds
Now let's add the real winds at the same height, from the reanalysis. They're drawn in a second colour. Over the sea, they match the geostrophic arrows to within a few per cent in speed, and a few degrees in direction. Down near the ground, it's different. Friction slows the air and turns it across the isobars, by about thirteen to twenty one degrees, towards the low. So from nothing more than a pressure map and a cross product, we get the direction of the wind above the ground. And we get its speed to within a few per cent.

> 100 words · 7 sentences · 1868.825–1906.450 s (37.6 s; speech 34.7 s) · 31:08.83–31:46.45 (measured).
> Screen: teal ERA5 850 hPa winds beside the violet geostrophic arrows (sea points; within a few % and degrees); then the 10 m winds turned '13°–21° towards the low' with gold angle arcs; keywords 'friction', 'direction ✓', 'speed: a few %'.

## s47_recap
To sum up, the cross product of two arrows is another arrow, at right angles to both. Each component leaves out its own direction, and cross multiplies the other two. There's a minus sign between them. Its length is the two lengths times sine theta: the area of their parallelogram. The right-hand rule gives its direction, and swapping the order flips it. When the arrows point the same way or in opposite directions, it's zero. At right angles, it's as long as it can be. In physics, it gives torque. In weather, k cross turns the wind a quarter turn to the left. The Coriolis effect, minus f k cross u, turns moving air to the right in the north and to the left in the south. That's why storms spin. And the geostrophic wind, one over f rho times k cross grad p, blows along the isobars. Later videos in this series show where the Coriolis effect comes from, and how to read weather maps. They also show how grad, div and curl are built from these products.

> 179 words · 14 sentences · 1906.450–1980.400 s (74.0 s; speech 68.6 s) · 31:46.45–33:00.40 (measured).
> Screen: one beat per sentence, mini picture left, keywords/maths right: (0, 0, 14) ⟂ a, b · the recipe · |a||b| sin θ = area · hand + 'a × b = −b × a' · 0 / largest / 0 · τ = r × F · k × u quarter turn · −f k × u with Ian | Idai · u = (1/(fρ)) k × ∇p on the storm map · three faint thumbnails (spinning globe, weather map, ∇ symbols).

## s48_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for this cross product, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 58 words · 3 sentences · 1980.400–2006.150 s (25.8 s; speech 22.2 s) · 33:00.40–33:26.15 (measured).
> Screen: house end card: four faint topic thumbnails (arrows, a cross product, a gradient map, a globe); 'a series of maths tutorials' (68 px); 'atmospheric science · meteorology · fluid dynamics' (54 px); 'cross-product notebook' + 'notebooks for the other maths concepts'; 2.5-s silent hold.


> Total: 4870 words · 419 sentences · 2003.650 s narration · 2006.150 s movie (33:26.15) · 145.7 words per minute.
