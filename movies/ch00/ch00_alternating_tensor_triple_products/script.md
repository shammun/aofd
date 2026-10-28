# ch00_alternating_tensor_triple_products — narration (movie-director, 2026-10-28; 1b of the split)

Series plan v2 **#1b**. Split from `ch00_vectors_index_notation` v1 s33–s59 on 2026-10-28. It stands alone: its own
title (s00), hook (s01), three short recap scenes of what it needs from **#1a `ch00_vectors_index_notation`** (s02 the
place, the moment, the basis and the wind; s03 the index rules and the dot product; s04 the Kronecker delta), a new
"three good reasons" scene (s11), its own recap (s33) and the maths end card (s34). House style `movies/HOUSE_STYLE.md`.
Voice Kokoro `af_bella`, speed 1.0. Chapter-0 informal voice; our own words; maths spoken in words.

Edits in the kept scenes: s23 (v1 s50) defines "air parcel" in its first sentence; s26 (v1 s53) "around the height of
that wind" (was "our map"). Scene map v1 → 1b: s33–s38 → s05–s10 (number minus 28), new s11, s39–s59 → s12–s32
(number minus 27); the full map is in `data_needs.md`.

**Measured, not estimated.** `tools/tts.py` dry run on 2026-10-28 into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_alternating_tensor_triple_products/dryrun/v1` (input = storyboard.yaml, current `movies/lexicon.yaml`, not edited): **35 scenes, 253 sentences, 4167 words, 1670.225 s narration + 2.5-s silent end-card hold = 1672.725 s (27:52.72)**; speech alone 1566.1 s = 159.6 words per minute while speaking, **149.5 words per minute overall** (limit 150); 399 caption cues; self-check {'expected_s': 1670.225, 'audio_s': 1670.225, 'diff_ms': 0.0, 'len_ok': True, 'cues_ok': True}; warnings: ['cue 384: 7.4 s / 2 lines out of house limits'].


> Post-run edit (measured): s33 sentence 3 split in two so no caption cue exceeds 7 s (run warning: cue 384, 7.4 s); the two new clips measured alone are 3.00 + 6.90 s, so the movie grows by +2.85 s to **1673.075 s narration + 2.5 s hold = 1675.575 s (27:55.58), 4172 words, 254 sentences, 149.4 words per minute overall**.

**Spoken-letter rules.** No lone vector "a" anywhere (vectors are p, q, s, u, x, Omega). Indices are spoken "u sub i",
"delta i j", "epsilon i j k"; the unit vector up is "k hat" so it never collides with the index k.

**Pronunciations to check in the render (lexicon not edited; proposed entries):** Kronecker
(`[Kronecker](/kɹˈOnɛkəɹ/)`), epsilon (`[epsilon](/ˈɛpsɪlɑn/)`), parallelepiped (`[parallelepiped](/pˌæɹəlˌɛləpˈIpɪd/)`),
Saint-Malo (`[Saint-Malo](/sˌæn mˈɑlO/)`), Ciarán and ERA5 (exist), "sub" (check it is not read as "S U B"), "k hat",
"e one" (check "e" is the letter name, not a schwa).

**Cross-references (user rule 2026-10-27).** **s02 the vectors and index notation movie (#1a)**, s05 Coriolis (#29), s06 cross product (#2, #3), s15 geostrophic wind (#30), s27 divergence (#7), s30 vector identities (#10A, #10B), s32 Coriolis (#29). Listed again on the end card; `related:` per scene in storyboard.yaml.

Lines starting with ">" are notes and are not spoken. Times are the measured scene start–end (s).

## s00_title
In this video, we'll learn the alternating tensor and the triple products the easy way, and see how meteorology uses them to find the push of Earth's spin on the wind, and how much air crosses a coast each second.

> 40 words · 1 sentence · 0.300–14.950 s (14.6 s; speech 13.8 s) · 0:00.30–0:14.95 (measured, dry run).
> Beat: opening title. Kind: 3-D data cube + map, data animation.

## s01_hook
What are the alternating tensor and the triple products? Let's see what they are, why they're built this way, and what they tell us about the wind.

> 27 words · 2 sentences · 14.950–25.325 s (10.4 s; speech 9.2 s) · 0:14.95–0:25.32 (measured, dry run).
> Beat: hook question. Kind: globe + wind particles.

## s02_recap_vectors
This movie follows on from the one on vectors and index notation, so let's first gather what we need from it. We're at Brest, a port at the western tip of France, at six in the evening, universal time, on the first of November twenty twenty-three, as Storm Ciarán approached. A vector is an arrow, with a size and a direction, like the wind. At Brest we set up three unit vectors, arrows one unit long: e one points east, e two points north, and e three points straight up. A vector's components are its steps along them. Our wind is the one a little more than a kilometre above Brest, from the reanalysis called ERA5, a best estimate of the whole atmosphere. It blew five point eight metres per second towards the east and thirty three point five towards the north, and it hardly rose or sank. By Pythagoras, its length is thirty four metres per second, the wind speed. Down at the ground, the station measured only nine point three.

> 172 words · 9 sentences · 25.325–93.050 s (67.7 s; speech 64.1 s) · 0:25.32–1:33.05 (measured, dry run).
> Beat: building blocks: what we need from 1a (vectors at Brest). Kind: 3-D diagram on terrain + map.

## s03_recap_index
We also wrote vectors with indices. u sub i means the three components u one, u two and u three, with one for east, two for north and three for up. An index that appears once in a term is a free index, so an equation with one is really three equations. An index that appears twice in a term is summed over one, two and three, even though no sum sign is written. That's the Einstein summation convention, and the repeated index is called a dummy index, because its letter doesn't matter. An index may appear at most twice in a term. For example, p sub i q sub i is p one q one, plus p two q two, plus p three q three: the dot product of p and q, a single number. It measures how much two arrows point the same way. And u sub i u sub i is the wind's length squared.

> 158 words · 8 sentences · 93.050–151.775 s (58.7 s; speech 55.5 s) · 1:33.05–2:31.78 (measured, dry run).
> Beat: building blocks: what we need from 1a (index notation). Kind: equation animation.

## s04_recap_delta
Finally, the first special symbol, the Kronecker delta, written delta i j. It's the dot product of two unit vectors, e sub i dot e sub j. So it's one when i equals j, and zero when they differ. Its trick is substitution: delta i j times u sub j equals u sub i. The delta swaps the summed index for its other index, and then it disappears. And delta i i, summed, is one plus one plus one, which is three. That's everything we need, so let's begin.

> 89 words · 7 sentences · 151.775–188.725 s (36.9 s; speech 34.0 s) · 2:31.78–3:08.72 (measured, dry run).
> Beat: building blocks: what we need from 1a (Kronecker delta). Kind: 3-D diagram + table.

## s05_coriolis_why
Now let's meet the second special symbol, which builds the cross product. Why does weather need it? Earth spins, and on a spinning planet, moving air feels a push to one side. This is called the Coriolis effect, and it's why large storms spin. Where it comes from is derived step by step in the Coriolis movie, later in this series. Here we'll use one fact: for each kilogram of air, the push is minus two Omega cross u. Omega is Earth's spin, and u is the wind. To find which way this push points, we need the cross product.

> 100 words · 8 sentences · 188.725–229.100 s (40.4 s; speech 37.1 s) · 3:08.72–3:49.10 (measured, dry run).
> Beat: cross product: why weather needs it. Kind: globe + map.

## s06_cross_basics
The cross product of two vectors, p and q, is another vector, at right angles to both. Its length is the length of p, times the length of q, times the sine of the angle between them. That's the area of the parallelogram the two arrows make. Its direction comes from the right-hand rule: point your fingers along p, curl them towards q, and your thumb points along p cross q. For our unit vectors, e one cross e two is e three: east cross north is up. In components, the first component of p cross q is p two q three, minus p three q two. The other two follow the same pattern, cycling through one, two and three. We take the cross product apart fully, and see its uses across physics, in the two cross product movies.

> 139 words · 8 sentences · 229.100–284.225 s (55.1 s; speech 51.9 s) · 3:49.10–4:44.23 (measured, dry run).
> Beat: cross product: definition (stand-alone). Kind: 3-D diagram + equation.

## s07_epsilon_def
To write this pattern with indices, we need a symbol that knows the order of one, two and three. It's called the alternating tensor, or permutation symbol, and it's written epsilon i j k. It has three indices, so it has twenty seven values. Epsilon i j k is plus one when i, j, k are one, two, three, or that order shifted round: two, three, one, or three, one, two. It's minus one when the order is reversed: three, two, one, or two, one, three, or one, three, two. And it's zero whenever two of the indices are equal. So only six of the twenty seven values aren't zero.

> 110 words · 7 sentences · 284.225–329.025 s (44.8 s; speech 41.9 s) · 4:44.23–5:29.02 (measured, dry run).
> Beat: alternating tensor: definition. Kind: 3-D data cube.

## s08_epsilon_moves
Two moves follow from this. Shifting all three indices one step round the cycle keeps the value: epsilon i j k equals epsilon j k i. But swapping any two indices flips the sign: epsilon i j k equals minus epsilon j i k.

> 44 words · 3 sentences · 329.025–348.400 s (19.4 s; speech 17.9 s) · 5:29.02–5:48.40 (measured, dry run).
> Beat: alternating tensor: two moves. Kind: equation animation.

## s09_cross_index
Now the cross product fits in one line: the i component of p cross q is epsilon i j k times p sub j times q sub k, with j and k both summed. That's nine terms for each i. Let's write them out for i equal to one. Every term with j or k equal to one is zero, because then epsilon repeats an index. That leaves two terms. Epsilon one two three times p two q three is plus p two q three. And epsilon one three two times p three q two is minus p three q two. That's exactly the first component of the cross product.

> 110 words · 8 sentences · 348.400–392.625 s (44.2 s; speech 41.0 s) · 5:48.40–6:32.62 (measured, dry run).
> Beat: cross product in index form. Kind: equation animation.

## s10_cross_check
Let's try easy numbers. Take p with components five, one and zero, and q with components one, three and zero. What's the third component of p cross q? For i equal to three, epsilon three one two gives plus five times three, and epsilon three two one gives minus one times one. So the third component is fifteen minus one, which is fourteen. The first two components are zero, so p cross q points straight up, fourteen units long. And the order matters. In q cross p, the same two terms appear with their signs flipped, so q cross p is minus p cross q. Turning the order round reverses the arrow.

> 112 words · 9 sentences · 392.625–441.200 s (48.6 s; speech 45.0 s) · 6:32.62–7:21.20 (measured, dry run).
> Beat: cross product: easy numbers and order. Kind: 3-D diagram + calculation.

## s11_why_three_reasons
So why is epsilon built this way? There are three good reasons. The first is order. Swapping two indices flips epsilon's sign, and that's exactly why q cross p is minus p cross q. The second is that an arrow crossed with itself gives zero. In epsilon i j k times p sub j times p sub k, the terms come in pairs, like j equal to two with k equal to three, and j equal to three with k equal to two. Swapping j and k flips epsilon's sign but leaves the p's the same, so each pair cancels. That matches the picture: an arrow and itself make a flat parallelogram, with no area. The third reason is that two epsilons can be turned into Kronecker deltas, as we'll see soon. That turns rules about cross products into counting with indices, instead of drawing pictures.

> 146 words · 10 sentences · 441.200–502.575 s (61.4 s; speech 57.4 s) · 7:21.20–8:22.57 (measured, dry run).
> Beat: why: three good reasons (epsilon). Kind: equation animation + mini diagram.

## s12_omega
Now Earth's spin. Omega is an arrow along Earth's axis, pointing out of the North Pole. Its length is seven point two nine times ten to the minus five radians per second, one turn in just under a day. Radians measure angle, and a full turn is two pi radians. At Brest, at forty eight point four five degrees north, the axis isn't straight up: it leans towards the north. So in our east, north, up basis, Omega has components zero, Omega times the cosine of phi, and Omega times the sine of phi, where phi is the latitude. At Brest, that's zero, four point eight four, and five point four six, times ten to the minus five.

> 118 words · 7 sentences · 502.575–550.750 s (48.2 s; speech 45.3 s) · 8:22.57–9:10.75 (measured, dry run).
> Beat: Earth's spin vector at Brest. Kind: globe + 3-D vectors.

## s13_coriolis_easy
Let's find the push's direction with easy numbers first. Take a place at forty five degrees north, where Omega's north and up components are both about five times ten to the minus five. Take a wind of ten metres per second blowing due north, with components zero, ten and zero. The first component of Omega cross u is Omega two u three minus Omega three u two. That's zero, minus five times ten to the minus five times ten, so minus five times ten to the minus four. The second component is Omega three u one minus Omega one u three, which is zero. The third is Omega one u two minus Omega two u one, which is also zero. Multiplying by minus two, the push is plus one times ten to the minus three metres per second squared, towards the east. The wind blows north, and the push points east: a right angle to the right of the wind.

> 160 words · 9 sentences · 550.750–614.375 s (63.6 s; speech 60.0 s) · 9:10.75–10:14.38 (measured, dry run).
> Beat: Coriolis direction: easy numbers. Kind: diagram + calculation.

## s14_coriolis_real
Now the real wind a kilometre above Brest, with Brest's Omega. With epsilon, minus two Omega cross u has three components. They're plus three point six six, minus zero point six three, and plus zero point five six, all times ten to the minus three metres per second squared. The flat part points just south of east. That's exactly a right angle to the right of the wind, which blows a little east of north. The third part points up, and it's nearly twenty thousand times weaker than gravity, so it hardly matters.

> 93 words · 6 sentences · 614.375–652.625 s (38.2 s; speech 35.7 s) · 10:14.38–10:52.62 (measured, dry run).
> Beat: Coriolis direction: the real wind. Kind: map + calculation.

## s15_coriolis_meaning
How big is this push? Three point seven times ten to the minus three metres per second squared sounds tiny. But it never stops. Acting for one hour, it could change the wind by about thirteen metres per second. That's why the wind can't blow straight from high pressure to low pressure for long: in the Northern Hemisphere, the Coriolis push keeps turning it to the right. South of the equator, the latitude counts as negative, so Omega's up part is negative, and the push turns the wind to the left. How this push balances the push from pressure is the story of the geostrophic wind movie.

> 107 words · 7 sentences · 652.625–696.025 s (43.4 s; speech 40.5 s) · 10:52.62–11:36.02 (measured, dry run).
> Beat: Coriolis: what the number means. Kind: map inset + calculation.

## s16_coriolis_globe
Here's the whole planet at one moment. The wind near the ground is drawn in teal, and the push from Earth's spin, worked out with epsilon at every place, is drawn in violet. In the north, every violet arrow points to the right of its wind. In the south, every one points to the left. Near the equator, the flat part of the push shrinks to nothing, because Earth's spin has no up part there.

> 75 words · 5 sentences · 696.025–724.400 s (28.4 s; speech 26.2 s) · 11:36.02–12:04.40 (measured, dry run).
> Beat: Coriolis on the whole planet. Kind: globe (data).

## s17_eps_delta
Now let's connect the two special symbols. When two epsilons share one summed index, they can be replaced by deltas. This is the epsilon delta relation: epsilon i j k times epsilon k l m equals delta i l times delta j m, minus delta i m times delta j l. It's useful because two epsilons mean two cross products, and the deltas turn them into dot products. Here's a way to remember it. The summed index k sits in the middle, next to itself. On the right, the first indices, i and l, pair up, then the second ones, j and m. Then come the same pairs crossed over, with a minus sign.

> 114 words · 8 sentences · 724.400–771.950 s (47.6 s; speech 44.3 s) · 12:04.40–12:51.95 (measured, dry run).
> Beat: epsilon-delta relation: statement. Kind: equation animation.

## s18_eps_delta_check
Let's check it with numbers. Take i equal to one, j equal to two, l equal to one and m equal to two. On the left, only k equal to three survives: epsilon one two three times epsilon three one two, which is one times one, so one. On the right, it's delta one one times delta two two, minus delta one two times delta two one: one minus zero, which is also one. Now swap l and m, so l is two and m is one. The left is epsilon one two three times epsilon three two one: one times minus one, so minus one. The right is zero minus one, minus one again. There are eighty one combinations in all, and a computer checks every one of them in a moment. They all agree.

> 136 words · 9 sentences · 771.950–826.600 s (54.6 s; speech 51.0 s) · 12:51.95–13:46.60 (measured, dry run).
> Beat: epsilon-delta: two cases and 81. Kind: equation + grid animation.

## s19_eps_delta_why
But why must it always be true? For the left side not to be zero, i and j must be different, and k must be the third number. Then epsilon k l m isn't zero only if l and m are the same two numbers as i and j. If they come in the same order, the two epsilons are equal, so their product is plus one. If they come in the swapped order, the two epsilons have opposite signs, so their product is minus one. And that's exactly what the deltas on the right side say.

> 97 words · 6 sentences · 826.600–862.250 s (35.6 s; speech 33.1 s) · 13:46.60–14:22.25 (measured, dry run).
> Beat: epsilon-delta: why it is true. Kind: equation animation.

## s20_lagrange_steps
Here's a first use. Let's find the length of p cross q, squared, without drawing anything. From our one-line formula, the k component of p cross q is epsilon k i j times p sub i q sub j. Moving k two places to the end doesn't change epsilon, so it's also epsilon i j k times p sub i q sub j. The length squared is this component times itself, summed over k. For the second copy we use new dummy letters, l and m. That gives epsilon i j k times epsilon k l m, times p sub i, q sub j, p sub l and q sub m. Now the epsilon delta relation replaces the two epsilons with delta i l delta j m, minus delta i m delta j l.

> 134 words · 8 sentences · 862.250–917.100 s (54.9 s; speech 51.6 s) · 14:22.25–15:17.10 (measured, dry run).
> Beat: derivation: |p x q|² (steps 1-3). Kind: derivation.

## s21_lagrange_result
In the first part, the deltas turn p sub l into p sub i, and q sub m into q sub j. That's p sub i p sub i times q sub j q sub j: the two lengths squared, multiplied. In the second part, they turn p sub l into p sub j, and q sub m into q sub i. That's p sub i q sub i times p sub j q sub j: p dot q, squared. So the length of p cross q squared equals the length of p squared times the length of q squared, minus p dot q squared. Let's check it with p as five, one, zero and q as one, three, zero. On the left, fourteen squared is one hundred and ninety six. On the right, twenty six times ten is two hundred and sixty, and p dot q is eight, so we subtract sixty four. That's one hundred and ninety six again. In pictures, this is sine squared plus cosine squared equals one.

> 172 words · 10 sentences · 917.100–983.450 s (66.4 s; speech 62.4 s) · 15:17.10–16:23.45 (measured, dry run).
> Beat: derivation: |p x q|² (result and check). Kind: derivation + calculation.

## s22_scalar_triple
Now three vectors at once. The scalar triple product is p dot, open bracket, q cross s. In index notation it's epsilon i j k times p sub i, q sub j and s sub k, and it's a single number. Here's its picture. q cross s is an arrow at right angles to q and s, as long as the area of their parallelogram. Its dot product with p multiplies that area by p's height above the parallelogram. A base area times a height is a volume. So the scalar triple product is the volume of the slanted box whose edges are p, q and s, called a parallelepiped. Its sign tells us whether the three edges are arranged like east, north and up: plus for that order, and minus for its mirror image.

> 135 words · 8 sentences · 983.450–1038.375 s (54.9 s; speech 51.7 s) · 16:23.45–17:18.38 (measured, dry run).
> Beat: scalar triple product: volume. Kind: 3-D diagram.

## s23_parcel_volume
Let's use it on an air parcel: a small volume of air that moves with the wind. Take a box of air above Brest, one kilometre from west to east, one kilometre from south to north, and one hundred metres tall. Its edges are one thousand times e one, one thousand times e two, and one hundred times e three, in metres. Only epsilon one two three survives, so the volume is one thousand times one thousand times one hundred. That's ten to the eight cubic metres. At this height, each cubic metre of air has a mass of about one point zero six kilograms. So the whole parcel holds about one hundred thousand tonnes of air.

> 117 words · 7 sentences · 1038.375–1084.900 s (46.5 s; speech 43.6 s) · 17:18.38–18:04.90 (measured, dry run).
> Beat: scalar triple: an air parcel. Kind: 3-D diagram + calculation.

## s24_parcel_shear
Now let the wind lean the parcel over. Imagine the top of the parcel moving one metre per second faster towards the north than its bottom. After ten minutes, the top has slid six hundred metres further north, and the box leans. Its upright edge now reaches six hundred metres north and one hundred metres up. Did the volume change? The new edge is the old one plus a piece along the north edge. That piece makes a box with two edges in the same direction: a flat box, with zero volume. With epsilon, it's zero because swapping two equal edges must flip the sign, and the only number equal to its own negative is zero. So leaning the parcel like this doesn't change its volume: it's still ten to the eight cubic metres. Above Brest that evening, the wind a kilometre up was more than three times as strong as at the ground, so real parcels were being leaned like this all the time.

> 165 words · 10 sentences · 1084.900–1149.375 s (64.5 s; speech 60.5 s) · 18:04.90–19:09.38 (measured, dry run).
> Beat: scalar triple: shear leans the parcel, volume unchanged. Kind: 3-D animation + calculation.

## s25_flux_easy
The triple product also tells us how much air crosses a surface. Picture a window standing on the ground: a curtain one hundred kilometres long from west to east, and one kilometre tall. A wind of ten metres per second blows straight through it, towards the north. In one second, the air that passes through fills a box one hundred kilometres long, one kilometre tall and ten metres deep. Its volume is ten to the nine cubic metres. The box's edges are p along the curtain, q up the curtain, and the wind times one second. So the volume of air crossing each second is the scalar triple product: u dot, open bracket, q cross p.

> 116 words · 7 sentences · 1149.375–1197.200 s (47.8 s; speech 44.9 s) · 19:09.38–19:57.20 (measured, dry run).
> Beat: scalar triple: air through a window (easy). Kind: 3-D diagram.

## s26_flux_slanted
Now let's make it real, and slanted. Imagine the curtain standing along Brittany's north coast, from Brest towards Saint-Malo. It's one hundred and eighty six kilometres long, pointing ten degrees north of east, and one kilometre tall, around the height of that wind. Its edges are p, with components one hundred and eighty three and thirty two kilometres, and q, one kilometre straight up. The cross product q cross p has components minus thirty two, one hundred and eighty three, and zero square kilometres. It's an arrow at right angles to the curtain, pointing out to sea, and as long as the curtain's area. Now we dot it with the wind above Brest, five point eight and thirty three point five metres per second. That's minus thirty two times five point eight, plus one hundred and eighty three times thirty three point five. The result is about five thousand nine hundred and forty square kilometres times metres per second, or about six times ten to the nine cubic metres of air every second.

> 173 words · 9 sentences · 1197.200–1268.625 s (71.4 s; speech 67.8 s) · 19:57.20–21:08.62 (measured, dry run).
> Beat: scalar triple: a slanted curtain on Brittany's coast. Kind: map on a tilted 3-D plate + 3-D curtain.

## s27_flux_meaning
What does that mean? Imagine the wind is the same all along the curtain. Each cubic metre has a mass of about one point zero six kilograms, so more than six million tonnes of air would cross the coast every second. And this air was moist, with about six and a half grams of water vapour in every kilogram. So about forty thousand tonnes of water would cross the coast each second. Long, narrow streams of very moist air are called atmospheric rivers, and measuring them starts with exactly this triple product. Flow through surfaces is built up step by step in the divergence movie.

> 105 words · 7 sentences · 1268.625–1311.700 s (43.1 s; speech 40.2 s) · 21:08.62–21:51.70 (measured, dry run).
> Beat: scalar triple: what the flux means. Kind: map inset + calculation.

## s28_vector_triple_plan
Last, the vector triple product: p cross, open bracket, q cross s. It appears whenever an arrow is turned twice. Our goal is to write it with dot products only. The plan is to write both cross products with epsilon, use the epsilon delta relation, and then let the deltas do the substituting.

> 53 words · 4 sentences · 1311.700–1335.150 s (23.5 s; speech 21.6 s) · 21:51.70–22:15.15 (measured, dry run).
> Beat: vector triple product: goal and plan. Kind: equation + 3-D mini.

## s29_vector_triple_steps
First, the i component of p cross anything is epsilon i j k times p sub j, times that thing's k component. Second, take the k component of q cross s. It's epsilon k l m times q sub l times s sub m. Putting them together gives epsilon i j k times epsilon k l m, times p sub j, q sub l and s sub m. The two epsilons share the summed index k, sitting next to each other. So the epsilon delta relation applies, and we replace them with delta i l delta j m, minus delta i m delta j l.

> 105 words · 6 sentences · 1335.150–1377.325 s (42.2 s; speech 39.6 s) · 22:15.15–22:57.33 (measured, dry run).
> Beat: vector triple product: steps 1-3. Kind: derivation.

## s30_vector_triple_result
In the first part, delta i l turns q sub l into q sub i, and delta j m turns s sub m into s sub j. That leaves q sub i times p sub j s sub j, which is q times p dot s. In the second part, delta i m turns s sub m into s sub i, and delta j l turns q sub l into q sub j. That leaves s sub i times p dot q. So p cross, q cross s, equals q times p dot s, minus s times p dot q. Let's check with easy numbers: p is one, zero, zero, q is zero, one, zero, and s is one, one, zero. Straight from the cross products, the answer is zero, one, zero. From our rule, it's q times one, minus s times zero, which is zero, one, zero as well. Identities like this one, with grad, div and curl inside them, fill the two movies on vector identities.

> 168 words · 9 sentences · 1377.325–1441.775 s (64.5 s; speech 60.9 s) · 22:57.33–24:01.78 (measured, dry run).
> Beat: vector triple product: result and check. Kind: derivation + calculation.

## s31_double_turn
Here's a weather use. Let k hat be the unit vector pointing straight up, the same as e three. With epsilon, k hat cross u has components minus u two and u one: it turns a flat wind a quarter turn to the left, anticlockwise seen from above. What if we turn it twice? By our rule, k hat cross, k hat cross u, is k hat times k hat dot u, minus u times k hat dot k hat. A flat wind is at right angles to k hat, so k hat dot u is zero, and k hat dot k hat is one. So two quarter turns give minus u: the wind turned right round. Let's check with the wind above Brest. One quarter turn makes five point eight and thirty three point five into minus thirty three point five and five point eight. A second turn makes it minus five point eight and minus thirty three point five.

> 161 words · 10 sentences · 1441.775–1503.900 s (62.1 s; speech 58.2 s) · 24:01.78–25:03.90 (measured, dry run).
> Beat: vector triple: two quarter turns. Kind: map + equation.

## s32_centrifugal
One more. As Earth spins, it carries the air round in circles, and that gives a pull outwards, away from the axis, called the centrifugal effect. For each kilogram, it's minus Omega cross, open bracket, Omega cross r, where r is the arrow from Earth's centre to the place. Our rule turns this into Omega squared times r, minus Omega times Omega dot r. Split r into a part along the axis and a part straight out from the axis. The part along the axis cancels, and what's left is Omega squared times the part straight out from the axis. At Brest, that part is six thousand three hundred and seventy one kilometres times the cosine of the latitude, about four thousand two hundred and twenty six kilometres. Times Omega squared, the pull is about zero point zero two two metres per second squared, a quarter of one percent of gravity. Small as it is, it's why Earth bulges at the equator. Its radius there is about twenty one kilometres larger than at the poles. The Coriolis movie shows how this pull is folded into gravity.

> 186 words · 11 sentences · 1503.900–1580.550 s (76.6 s; speech 72.3 s) · 25:03.90–26:20.55 (measured, dry run).
> Beat: vector triple: the centrifugal pull. Kind: 3-D globe slice + calculation.

## s33_recap
To sum up, epsilon i j k is plus one when i, j, k come in the order one, two, three or that order shifted round, minus one when the order is reversed, and zero when an index repeats. Shifting the indices round keeps its value, and swapping two of them flips its sign. With it, we can write the cross product. The i component of p cross q is epsilon i j k times p sub j times q sub k. Earth's spin crossed with the wind gives the Coriolis push, at right angles to the right of the wind in the north, and to the left in the south. The epsilon delta relation turns two epsilons into deltas, and two cross products into dot products. The scalar triple product is a volume, or the air crossing a surface each second. And the vector triple product, p cross, q cross s, is q times p dot s, minus s times p dot q: it turns the wind twice, and it gives the centrifugal pull.

> 169 words · 7 sentences · 1580.550–1645.450 s (64.9 s; speech 62.0 s) · 26:20.55–27:25.45 (measured, dry run).
> Beat: recap. Kind: recap montage.

## s34_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for the alternating tensor and triple products, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 61 words · 3 sentences · 1645.450–1670.225 s (24.8 s; speech 23.8 s) · 27:25.45–27:50.22 (measured, dry run).
> Beat: series end card (maths ending). Kind: end card.

> Total: 4167 words · 253 sentences · 1670.225 s narration · 1672.725 s movie (27:52.72) · 149.5 words per minute.
