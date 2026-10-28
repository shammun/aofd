# Dot and cross product: intuitions and "when is it used" (inspiration scout)   2026-10-28

Purpose: give the movie director more intuition for each part of the maths and more "when is it used" cases for
#2 `ch00_cross_product`, #3 `ch00_cross_product_uses` and a new dot-product version **0.1b**. The user's inspiration was
https://www.youtube.com/watch?v=w4x7RLUizJ0. **Ideas only.** Everything below is in our own words, with our own
pictures and our own order. Nothing here copies the video's wording, visuals or sequence (we could not see them anyway, see §1).
Sources are in §6. **(unverified)** marks anything not confirmed today.

---

## 1. What the video does, and what we could actually access

| Item | Finding today (2026-10-28) | Route |
|---|---|---|
| Title | "The Physical Meaning of the Cross Product and Dot Product" | YouTube oEmbed JSON (verified) |
| Channel | **Inductica** (`youtube.com/@Inductica`) | oEmbed `author_name` / `author_url` (verified) |
| Length, upload date, description, chapter markers | **Not accessible.** The watch page came back as a JS shell with no description or chapters | WebFetch of the watch page |
| Transcript | **Not accessible.** The legacy `video.google.com/timedtext` endpoint returned an empty file, `youtubetotranscript.com` returned 403, `youtube-transcript.io` returned only its home page, and an Invidious mirror returned 502 | four public routes tried |
| Reputable summaries | None found. Web searches turned up only aggregator or mirror pages that repeat the title | WebSearch ×3 |

**Plainly: we did not see the video's content.** From the title alone, the video seems to be about the *physical
meaning* of both products, which matches the user's request for "intuition behind each part of the maths" and "when is
it used". Everything in §2–§5 is drawn from the standard literature (3Blue1Brown *Essence of Linear Algebra* ch. 9–11,
Wikipedia's dot/cross product articles, physics-education research on vector misconceptions, and textbook GFD facts),
plus our own devices. So none of it can be a copy of the video. If the user can paste the transcript or list the
video's chapter titles, a follow-up pass can check what we missed.

**UPDATE (orchestrator, 2026-10-28): transcript obtained** (auto-captions, 390 lines, 16:35, via `youtube-transcript-api`
in a scratch venv; not committed). The user wants the video's explanations of *why each part of the formula makes sense*
and *when each product is used* added to the movies. §1b is the video's teaching arc, paraphrased in our words (no
verbatim lines, none of its jokes); §1c says what each idea becomes in our movies. **§1b/§1c take priority over §2–§5
where they overlap.**

## 1b. The video's teaching arc (paraphrased)

The idea running through the whole video: each product was *made* to describe one physical observation. Anchor each
product to that observation and every part of its formula follows. If you forget a formula, go back to the observation.

**Dot product, anchored to work**
| # | Idea | How the video shows it |
|---|---|---|
| V-D1 | Work = force × distance, but only the part of the force *along* the motion counts | A train that can only move along its track; a strong wind blows at an angle. Split the wind force into an along-track part (moves the train) and an across-track part (does nothing, the rails take it). Work = F d cos θ |
| V-D2 | Why the answer is a scalar | Work is "how much motion/energy was delivered", with no direction attached |
| V-D3 | General meaning | Length of the first vector × the component of the second vector *along* the first. The polar form needs the angle |
| V-D4 | **Why the component formula a_x b_x + a_y b_y + a_z b_z is the same thing** | Think of **a** as three arrows laid end to end (its x, y, z parts). Each part may be multiplied only by the part of **b** that points the same way: a_x only "sees" b_x, a_y only b_y, a_z only b_z. Add the three: the component formula falls out of the meaning |
| V-D5 | Uses named | Work and "similar concepts" across physics; also AI (similarity between vectors) |

**Cross product, anchored to torque**
| # | Idea | How the video shows it |
|---|---|---|
| V-X1 | Torque = how much a force changes rotation = force × distance from the pivot | Lever; a door: we push far from the hinges because a long lever arm needs less force, near the hinge it needs much more |
| V-X2 | Only the *perpendicular* part of the force turns | A wrench pushed at a slant: split F into a part along the handle (does nothing) and a part across it (turns). τ = r F sin θ: **the magnitude of the cross product = length of the first × component of the second perpendicular to it** |
| V-X3 | The neat pairing | Dot = first × the *parallel* part of the second → scalar; cross = first × the *perpendicular* part → vector |
| V-X4 | Direction: right-hand rule | Index finger along **r** (first), middle finger along **F** (second), thumb gives τ. Out-of-screen ⊙ and into-screen ⊗ symbols, practised on two cases (a nut turned one way gives τ into the screen) |
| V-X5 | **What the direction means** | The torque vector is the **axis** about which the force increases the rotation. Pointing at you = counter-clockwise as you see it; pointing away = clockwise. Second rule: curl your fingers the way the rotation grows, thumb = vector |
| V-X6 | Reading the "monstrosity" (component formula) | The x component uses only y and z parts; y uses only z and x; z uses only x and y |
| V-X7 | Plane case first | Wrench and force both in the xy-plane → all z parts are zero → only the z component survives. Matches reality: turning *in* the xy-plane is turning *about* the z-axis |
| V-X8 | **Why z = r_x F_y − r_y F_x, term by term** | Split F into F_x and F_y. F_y alone pushes across the lever arm r_x → a mini-torque about z. F_x alone pushes across the lever arm r_y → a mini-torque turning the *opposite* way for same-signed parts. That is why one term has a minus sign. Signs checked on a picture against the formula |
| V-X9 | Full 3-D | A floating sphere spun by brushing a finger past it: lever arm from the centre to the touch point, both **r** and **F** have x, y, z parts. The (x,y) parts give a z-torque, (y,z) parts an x-torque, (z,x) parts a y-torque; the three add to a torque about a **tilted (diagonal) axis** |
| V-X10 | Uses named | Torque "and other similar things" |
| V-S | Closing summary | Dot: scalar from the parallel part; cross: vector from the perpendicular part; if confused, think of work and rotation |

## 1c. What we take into our movies (our own pictures, weather settings where possible)

| Video idea | Our version | Movie |
|---|---|---|
| V-D1/D2 | Keep the train-on-a-track device but make the force a real wind: an air-driven push on a rail car, or better **a sailboat or a ship held to a course** and wind at an angle; add the runway case (headwind = dot part). Energy bar fills for the along part only | 0.1b |
| V-D3/V-X3 | A "parallel part / perpendicular part" pair: the same two arrows, the shadow of **b** along **a** feeds the dot, the part across **a** feeds the cross; Lagrange triangle (§2 X2) as the payoff | 0.1b intro + #2 opening |
| V-D4 | **New key scene:** **a** splits into three coloured arrows; each grabs only its matching part of **b**; three products stack into the sum. Then a weather case: wind · temperature-gradient (advection) term by term | 0.1b (before the advection block) |
| V-D5 | One short line + picture: comparing two weather patterns by their dot product (pattern correlation/analogue forecasting), the root of "similarity" in AI | 0.1b uses |
| V-X1 | Door/lever arm at the start of torque: push near vs far from the hinge, needed force bar shrinks with arm | #2 (torque anchor) and #3 |
| V-X2 | Slanted wrench: split F along/across the handle, the across part turns; τ = r F sin θ grows and shrinks as the angle sweeps | #2 |
| V-X4/X5 | Right-hand rule as fingers + the meaning: the vector **is the axis**, sign = sense of turning, said with viewpoint ("seen from above"). Weather tie: Earth's rotation vector Ω points out of the North Pole, so the Earth turns counter-clockwise **as seen from above the North Pole** | #2 (meaning), #3 (Ω, vorticity) |
| V-X6/X7/X8 | **New key scene:** the component formula built from physics: plane case first (only z survives), then F_y with arm r_x and F_x with arm r_y as two mini-torques fighting, explaining the minus sign; then the cyclic pattern x←(y,z), y←(z,x), z←(x,y) | #2 (after the determinant/area scenes, or replacing their less physical version) |
| V-X9 | Spinning sphere brushed off-centre → torque on a tilted axis, three component torques adding as arrows. Tie to a weather/ocean case where possible (wind stress spinning an eddy; a tilted spin axis like Earth's Ω at a mid-latitude split into local vertical and northward parts) | #2 end of maths / #3 |
| V-S | Closing line in each movie: "dot = along part, a number; cross = across part, an axis" | 0.1b, #2 |

---

## 2. Cross product: one intuition per part of the maths

The idea behind everything in this section: **the cross product measures how much two arrows are *across* each other, and
packs the result into one arrow.** Its length says how much area they sweep out, and its direction says which way the turning goes.
The dot product does the opposite job: it measures how much they point *along* each other (§3). The two fit together
exactly, as row X1 shows.

| # | Part of the maths | Intuition (our words) | Visual device to animate | Notes / pitfalls |
|---|---|---|---|---|
| X1 | **Magnitude** \|a × b\| = \|a\|\|b\| sin θ = area of the parallelogram | "Only the part of b that is *across* a counts." Write b as a part along a plus a part across a. The along part makes a flat parallelogram with zero area, so only the across part, \|b\| sin θ, gives height. Area = base \|a\| × height \|b\| sin θ | **Shear slider**: keep a fixed as the base and slide b's tip parallel to a. The parallelogram leans, but its height and its area (a live number) stay the same. Then rotate b instead: the height bar, and with it the area, rises and falls as sin θ | Units: m × N gives N·m for torque, which is not joules. Say this when torque comes in (#3) |
| X1b | **Sharing with the dot product** \|a × b\|² + (a · b)² = \|a\|²\|b\|² (Lagrange's identity) | "b splits into a part along a and a part across a. The dot product keeps the along part and the cross product keeps the across part. Pythagoras puts them back together" | Right triangle on b: the along leg (teal, labelled 'dot') and the across leg (orange, labelled 'cross'), with the hypotenuse \|b\|. Scale both legs by \|a\|. As θ sweeps, a sin² + cos² = 1 bar stays full | A strong bridge between 0.1b and #2. Verified as Lagrange's identity on Wikipedia |
| X2 | **Direction**: perpendicular to both, chosen by the right-hand rule | "A flat patch of area has two faces. The cross product picks the face from which a turning a → b looks anticlockwise, and points out of it." Equivalently: the axle a screw would advance along if you turned it from a towards b | Parallelogram drawn as a **thin card with two coloured faces**. A curved arrow sweeps a → b across it, the camera flies round to the side where the sweep looks anticlockwise, and the normal arrow grows out of that face. Then a **screwdriver/bolt**: turning a → b drives the bolt along a × b | Always say the viewpoint. "Anticlockwise *seen from the tip* of a × b". #2 already has the right-hand rule in four ways, so add the two-faced card and the screw only if they are not there |
| X2b | **Why perpendicular at all** | "Every direction that lies *in* the plane of a and b is a mixture of a and b. The only direction that belongs to neither is the one sticking out of the plane, so that is where the answer goes" | The plane as a glass sheet. Arrows made by mixing a and b all stay in the sheet, and only the normal pokes out. Check it numerically: (a × b)·a = 0 and (a × b)·b = 0 as live zeros | Ties into the dot-product zero test (D4) |
| X3 | **Components formula** (a₂b₃ − a₃b₂, a₃b₁ − a₁b₃, a₁b₂ − a₂b₁) | "Each component is a 2-D signed area: the shadow of the parallelogram on one coordinate plane." The z-component a₁b₂ − a₂b₁ is the area of the shadow on the floor (the xy-plane), and likewise for the others | **Three shadows**: a light shines straight down, then from the side, then from the front. Each shadow parallelogram is filled, and its signed area flies into the matching slot of the result vector. #2 already uses "components as shadows" (s19), so this deepens that scene rather than adding one | Explain the 2-D determinant a₁b₂ − a₂b₁ first with the **box proof** (#2 has it): a rectangle minus the corner triangles and rectangles |
| X3b | **Determinant form** det[[i, j, k],[a],[b]] | "It's a bookkeeping trick that writes the three shadow areas down in one go. The deeper fact is that the determinant of [a, b, c] is the volume of the box they span, and a × b is the one vector whose dot with any c gives that volume" | **Volume probe**: a third arrow c moves around and the slanted box a, b, c is drawn. Its volume tracks c · (a × b) live. It is largest when c lines up with a × b and zero when c lies in the plane | This is the 3Blue1Brown 'duality' view (ch. 11). Show it briefly; #1b owns the triple products |
| X3c | **Index form** (a × b)ᵢ = εᵢⱼₖ aⱼ bₖ | "ε is a sign table: +1 for x→y→z in order, −1 for a swapped order, 0 if a letter repeats. Repeating a letter means a direction crossed with itself, so no area" | A 3×3×3 cube of cells, mostly empty, with three +1 cells and three −1 cells lit along the cycle and the anti-cycle | Pointer to #1b (already in the plan) |
| X4 | **Anticommutativity** b × a = −(a × b) | "Swap the order and you swap the sense of turning. The same patch is now walked the other way round, so the normal flips to the other face" | The two-faced card: the sweep b → a is drawn, the card flips (the colour faces swap), and the normal drops through to the other side. **Door push**: pushing on the left of the hinge versus the right turns the door opposite ways | Contrast with a · b = b · a: the dot product only measures alignment, which has no sense of turning |
| X4b | **Not associative** (a × b) × c ≠ a × (b × c) | "Doing two cross products in a different order lands you in different planes" | Optional: i × (i × j) = −j but (i × i) × j = 0, one line each | Optional, maybe for #1b/10A |
| X5 | **Zero for parallel vectors** a × a = 0 | "Two arrows along the same line sweep out no area, and they give no turning. Pull straight along a spanner and nothing turns" | The parallelogram **collapses to a line** as θ → 0 and the area number falls to 0. Spanner: pull along the handle (no turn) versus across it (largest turn) | Mirrors the dot product's zero at 90°. Show them side by side: dot = 0 at 90°, cross = 0 at 0° and 180° |
| X6 | **Unit-vector table** i × j = k, j × k = i, k × i = j | "Follow the circle x → y → z → x forwards and you get +, go backwards and you get −" | A clock-face triangle with x, y, z at the corners: a forward arrow labelled +, a backward arrow labelled − | #2 has "the cycle and the swap" |
| X7 | **Cross product with a unit vertical k̂ × u**, a rotation by 90° | "Crossing with straight-up turns any flat arrow a quarter-turn anticlockwise *seen from above* and keeps its length" | Compass rose: u sweeps round and k̂ × u follows exactly 90° ahead, the lengths drawn equal | The key move for Coriolis and geostrophy (#3) |

---

## 3. Dot product: one intuition per part of the maths

The idea behind everything in this section: **the dot product asks "how much of this arrow goes along that one?", then scales by
the other length.** The result is one number with a sign.

| # | Part of the maths | Intuition (our words) | Visual device to animate | Notes / pitfalls |
|---|---|---|---|---|
| D1 | **Projection** a · b̂ = \|a\| cos θ | "Shine a light straight down onto the line of b. The length of a's shadow is a · b̂" | The **shadow band** (v6 already uses it). New for 0.1b: a **ruler that turns**. b̂ is a ruler, and a · b̂ is the reading where a's tip drops onto it. Turn the ruler and the reading changes, while a stays the same | v6 s06–s07 have this. In 0.1b, add the turning ruler as a "reading a dial" device |
| D2 | **\|a\|\|b\| cos θ** (why times the *other* length) | "Projection is one-sided: the shadow of a on b. The dot product is two-sided, so multiply the shadow by b's length. Then it doesn't matter who casts the shadow on whom" | **Two shadows, one area**: draw a's shadow on b × \|b\| as a rectangle and b's shadow on a × \|a\| as a second rectangle. The two rectangles have the same area, shown by a live equal sign | v6 s08–s09 ("reason 1: order") covers why. The equal-rectangles picture makes it *visible* |
| D3 | **Component sum** a₁b₁ + a₂b₂ + a₃b₃ | "Each axis votes on its own. On each axis, multiply how far each arrow goes along it, then add the votes up." It equals the cos form because the axis arrows are at right angles: cross terms like i · j vanish | **Expand the brackets on screen**: (a₁i + a₂j)·(b₁i + b₂j) gives 4 terms, and the two mixed ones are struck through with "i · j = 0, at right angles" | Proof the two definitions agree: the law of cosines on the triangle a, b, a − b. A one-scene derivation if 0.1b goes deeper |
| D4 | **Sign meaning** | "+: they go the same general way. 0: they ignore each other. −: they work against each other" | A **sign dial**: b sweeps round a with the background half-planes tinted (+ half teal, − half rose, the boundary line at 90° marked 'zero'). The dot product reads out live | v6 s05 has the three cases. Add the half-plane tint so the viewer *sees* that the whole half-plane is positive, not just the parallel direction |
| D5 | **Work** W = F · d | "Only the push along the motion does work. A push across the motion (Coriolis, the string on a whirled ball, a magnetic force on a charge) changes the direction but never the energy" | A sled pulled at an angle (v6 s11). New: a **perpendicular push** beside it, with an energy bar that stays flat while the path curves | **The key bridge to #3**: forces built with a cross product with u, like −2Ω × u and qv × B, are always across u, so their dot with u is 0 and they do no work |
| D6 | **Flux** F · n̂ A | "How much goes *through* a window depends on how square-on the window faces the flow. Tilt it and less passes through, and edge-on nothing does" | **A tilting window frame** in a stream of arrows (wind or sunlight). The arrows that pass through are counted, and the count follows cos θ. Turning the frame edge-on gives zero | Sunlight on a slope is ŝ · n̂ (#2 uses this for the Alps with n̂ from a cross product). In 0.1b use flat-ground sunlight versus latitude (cos of the zenith angle), so the two movies don't overlap |
| D7 | **Dot with a unit vector picks out a component** | "To ask how much wind blows along a runway, coast or street, dot the wind with that direction's unit arrow" | A runway (or a stretch of coast) with the wind arrow and the shadow band along it (headwind), and the across part greyed out | The across part is a cross product (see W12), a nice two-movie pairing |
| D8 | **Length from the dot product** \|a\|² = a · a | "Dotting an arrow with itself is Pythagoras" | √(a · a) with the components squared | Already used implicitly in v6 s02 |

---

## 4. When is it used: weather, ocean and physics

"Product" says which product. "Fits" says which movie (#2, #3 or 0.1b), or "later" for a series movie that owns it.
Numbers are easy values to animate; every number shown in a movie must still come from a tested `fluidpy` function (HOUSE_STYLE §7).

| # | Use | Product | One-line intuition | Animatable picture | Fits |
|---|---|---|---|---|---|
| W1 | **Torque** τ = r × F | cross | Turning = lever arm × the part of the push that is across it | Spanner/door with the push split into along and across parts | #3 (has it) |
| W2 | **Angular momentum** L = r × p, and spin-up | cross | "How much the motion goes round the centre." It is kept fixed when there is no torque, so pulling in spins faster | Ball on a string pulled in, then air spiralling into a hurricane | #3 (has it) |
| W3 | **Lorentz force** F = q v × B and the aurora | cross | The push is always across both the motion and the field, so charges spiral along field lines | Helix along a field line | #3 (has it) |
| W4 | **Coriolis acceleration** −2Ω × u | cross | Always across u, so it turns air and water without speeding them up: to the right in the NH, to the left in the SH, seen from above with your back to the motion | A parcel's path curving at constant speed, with an energy bar flat (the D5 bridge) | #3 (preview). Full treatment in #29 |
| W5 | **Inertial circles** | cross (from W4) | With only the Coriolis turn acting, a parcel goes round in a circle every half pendulum day (≈ 17 h at 45°) **(easy value; compute from 2π/f before use)** | A drifter loop drawn by the flat-energy push | #29 (named only in #3) |
| W6 | **Geostrophic wind** u_g = (1/(f ρ)) k̂ × ∇p (or (1/f) k̂ × ∇Φ on pressure surfaces) | cross | The push from high to low pressure is balanced by the Coriolis turn, so the wind blows *along* the isobars, a quarter-turn from ∇p | ∇p arrow → k̂ × rotates it 90° → the wind along the isobars, low on the left (NH) | #3 (has it). #30 |
| W7 | **Ekman transport** M_E = τ × k̂ / (ρ f) (90° to the right of the wind stress in the NH) | cross | The wind drags the top layer, Coriolis turns it, and the net layer transport ends up a quarter-turn to the right (NH) / left (SH) | Wind along a coast → a transport arrow 90° to its right → offshore → cold water rising (upwelling) | **New idea for #3** (a short "uses grid" tile) or #42/Ekman movie later |
| W8 | **Coastal upwelling index** (CUTI/Bakun: cross-shore Ekman transport) | **cross then dot** | First turn the wind 90° (cross) to get the Ekman transport, then take its offshore part (dot with the offshore unit normal) | California coast: wind from the north, the Ekman arrow, the dot with the offshore normal, a bar labelled 'upwelling' | **A flagship two-product example**: the end of 0.1b ("this is where the dot meets the cross") or a tile in #3 |
| W9 | **Vorticity / curl** ζ = k̂ · (∇ × u) | cross (∇×) then dot | Curl measures the local spin: put a small paddle wheel in the flow and see whether it turns | Paddle wheel in a shear flow and in a storm | #8 / #34. Named in #3 (s23b, s38) |
| W10 | **Circulation and the area inside a loop** | cross (shoelace) | Summing half cross products round a loop gives the enclosed area. Summing u along the loop gives circulation (Stokes) | Fan of triangles inside an isobar (#2 has it) | #2 (has it). #8 |
| W11 | **Slope normal, shaded relief, and sunshine on a slope** | cross then dot | Normal = east edge × north edge. Sunlight per square metre = ŝ · n̂ | Alpine valley | #2 (has it) |
| W12 | **Wind along/across a runway or coastline** | dot (along) + cross (across) | Headwind = v · ê, crosswind = (ê × v)·k̂, signed (left or right of the runway) | Runway with the wind arrow: the along band (teal, dot) and the across band (orange, cross). Example: 20 kt at 30° gives ≈ 17.3 kt headwind and 10 kt crosswind | **0.1b** (dot half) and **#2** (cross half, sign = left or right). This mirrors the hurricane left/right test |
| W13 | **Wind work on the ocean** P = τ · u | dot | The wind only adds energy where it pushes *with* the current. Pushing against it takes energy out (negative) | Map tiles: + where the wind and current line up (Southern Ocean westerlies over the ACC), − where they oppose. Global total ≈ 1 TW (Wunsch 1998) | **0.1b** (sign meaning in the real world) |
| W14 | **Heat flux through a surface** q · n̂ | dot | Only the part of the heat flow that goes *through* the surface counts | A tilted surface element in a stream of heat-flux arrows | 0.1b (flux beat, D6) |
| W15 | **Temperature advection** −u · ∇T | dot | How fast the wind carries air into warmer or colder places | v6's isotherm map | 0.1 / 0.1b (has it) |
| W16 | **Sunlight on flat ground versus latitude** S cos(zenith) = S ŝ · k̂ | dot | The same beam spread over more ground near the poles | A torch on a tilting board, then a globe with beams spreading out | 0.1b (flux beat). Pointer to #22 |
| W17 | **Kinetic energy** ½ u · u, and the power of a force F · u | dot | Energy only cares about speed, not direction. A force changes energy only through its along-u part | Energy bar beside a moving parcel | 0.1b (D5) |
| W18 | **Ω × r: the velocity of a point on the spinning Earth** | cross | Each place is carried round on a circle whose radius shrinks towards the poles (≈ 465 m/s at the equator) **(easy value; compute before use)** | Globe with Ω and r, and v tangent to the latitude circle | #3 (has it) |
| W19 | **Normal of a surface, e.g. a sloping isopycnal or front** | cross then dot | A front's tilt direction comes from crossing two edge vectors, and the wind across the front is a dot with that normal | Tilted frontal surface | later (#23D cross-sections) |

**Most useful new additions** (not in the current #2/#3/v6 briefs): W7 Ekman 90°, W8 the upwelling index (cross then
dot), W12 runway along/across (dot + cross pair), W13 wind work with its sign, W14/W16 flux and sunlight, and the
D5 "a perpendicular push does no work" bridge that ties Coriolis and qv × B to the dot product.

---

## 5. Mapping onto our movies

Constraints honoured: HOUSE_STYLE arc (title → hook → building blocks → intuition → why → application → "To sum up" →
end card), no headings except the title, keywords on screen with explanation in the voice, picture → symbols → numbers,
every number from `fluidpy` with CHECK rows. Scene ids are from the briefs and the v6 script. The director decides the final
placement.

### 5a. #2 `ch00_cross_product` (maths ending)

| Where (brief scene) | Add or deepen | Idea rows |
|---|---|---|
| s03 (the door: why the dot product is not enough) | Put the left/right push and the **sign dial** of the dot product side by side: the dot product cannot tell left from right, and the cross product can | X4, D4 |
| \|a\|\|b\| sin θ / parallelogram scenes | **Shear slider** (area unchanged when b's tip slides parallel to a) + rotate b with the height bar following sin θ | X1 |
| New short scene after sin θ | **Lagrange right triangle**: along leg = dot, across leg = cross, sin² + cos² = 1. "The two products split b between them" | X1b |
| Box proof (s09) | Keep it. Then say the 2-D area *is* the z-component (the floor shadow) | X3 |
| Right angle check | **Glass-sheet** picture: every mixture of a and b stays in the plane, so only the normal is left; (a × b)·a = 0 live | X2b |
| Right-hand rule (four ways) | Add the **two-faced card** and the **screw/bolt** if not already among the four | X2 |
| Cycle and swap | Card flip for b × a, and the forward/backward clock triangle | X4, X6 |
| s15a ε index form | The ε sign cube | X3c |
| "Components as shadows" (s19) | Three lights, three shadows, each signed area flying into its slot | X3 |
| Optional, before the summary | **Volume probe** c · (a × b), one beat, pointer to #1b | X3b |
| Cases | Parallelogram collapsing as θ → 0 next to the dot product's zero at 90° | X5 |
| Application, sign (s51–s53, Ian) | Keep. Add **one sentence** that the same sign test tells a pilot whether a crosswind comes from the left or right of the runway (W12), a picture of a few seconds | W12 |
| Application, length (s54–s55) and direction (s57–s59) | Keep. They already use W10 and W11 | W10, W11 |

### 5b. #3 `ch00_cross_product_uses` (weather/climate ending)

| Where (brief scene) | Add or deepen | Idea rows |
|---|---|---|
| s22e "the perpendicular push" | Add the **flat energy bar**: a cross product with u is across u, so its dot with u is zero and it does no work. Pointer back to the dot product (0.1/0.1b) | D5, W4 |
| s19u uses grid | Add tiles for **Ekman transport (90° right of the wind, NH)** and **coastal upwelling** | W7, W8 |
| s23/s23a k̂ × u | Compass rose with k̂ × u always 90° ahead (anticlockwise seen from above) | X7 |
| Coriolis s26–s31 | After "NH right / SH left", add one beat: the parcel's speed is unchanged (energy bar), so Coriolis only *steers*. Inertial circles named with a pointer to #29 | W4, W5 |
| Geostrophic s39–s46a | Keep. Optional: one beat that the *same* k̂ × move turns the wind stress into the Ekman transport in the ocean (W7), "same maths, other fluid" | W6, W7 |
| Recap | The uses grid as the "To sum up" mini-pictures | — |

### 5c. New dot-product version 0.1b (maths ending; variant of `ch00_dot_product_why` v6)

Keep v6's spine (s00–s22) and its advection application. The 0.1b changes are **intuition upgrades** in the building-block
and intuition beats plus **2–3 short "when is it used" scenes** before the main application or as a montage before the recap.
This follows HOUSE_STYLE §1 ("add scenes whenever a step is not crystal clear") and the user's 2026-10-28 note.

| Where (v6 scene) | 0.1b change | Idea rows |
|---|---|---|
| s04 cosine | Make cos θ visible as the **shadow length ÷ arrow length** on a unit circle before naming it | D1 |
| s05 angle cases | Add the **half-plane tint** (+ teal, − rose, zero line): b swept continuously, with the three cases as stops | D4 |
| s06–s07 shadow, unit vector | **Turning ruler**: b̂ as a ruler, a · b̂ as the reading | D1, D7 |
| s08–s09 why the other length | **Two equal rectangles** (a's shadow × \|b\| = b's shadow × \|a\|) | D2 |
| s03 / new after s03 | Optional: **expand the brackets** and strike the i · j terms, showing why the component sum works | D3 |
| s11 work | Add the **perpendicular push** with a flat energy bar ("pushes across do no work"), which sets up Coriolis for #3 | D5, W17 |
| New "when is it used" beat 1 | **Runway/coast**: headwind = v · ê (teal band), with the across part greyed and labelled "that's a job for the cross product". Example 20 kt at 30° → ≈ 17.3 kt along | W12 |
| New beat 2 | **Flux**: a tilting window in sunlight, then flat ground at higher latitude (cos of the zenith angle). Keep it distinct from #2's slope scene | D6, W16, W14 |
| New beat 3 | **Wind work on the ocean** τ · u: a positive and a negative tile, and the ≈ 1 TW global total (cite Wunsch 1998) | W13 |
| Optional closing tease | **Upwelling index**: the cross product turns the wind into the Ekman transport and the dot product takes its offshore part, pointing to #2/#3 | W8 |
| s12–s20 advection | Unchanged (user-approved v6 physics) | W15 |
| s21 recap | Add one sentence per new beat (along a runway, through a surface, energy in or out) | — |

Length note: three new beats at ~45–60 s each plus the device upgrades add roughly 4–5 min to v6's 16:29 **(estimate,
not measured; the director must run `tools/tts.py`)**.

---

## 6. Sources (verified today unless marked)

| Claim | Source | URL |
|---|---|---|
| Video title and channel | YouTube oEmbed for w4x7RLUizJ0 | https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=w4x7RLUizJ0&format=json |
| Transcript routes failed | timedtext (empty), youtubetotranscript (403), youtube-transcript.io (home page), inv.nadeko.net (502) | https://video.google.com/timedtext?lang=en&v=w4x7RLUizJ0 |
| Cross product: area, right-hand rule, determinant, anticommutativity, parallel → 0, Lagrange identity, pseudovector, torque/L/Lorentz | Wikipedia, Cross product | https://en.wikipedia.org/wiki/Cross_product |
| 2-D signed area, orientation, determinant link, 3-D length = area, direction perpendicular | 3Blue1Brown, *Essence of Linear Algebra* ch. 10 | https://3blue1brown.com/lessons/cross-products |
| Cross product via duality (volume-probe idea) | 3Blue1Brown ch. 11 (page title confirmed, content not read) | https://www.3blue1brown.com/lessons/cross-products-extended |
| Dot product as projection, duality | 3Blue1Brown ch. 9 (page title confirmed, content not read) | https://3blue1brown.com/lessons/dot-products |
| Dot product geometric form, scalar projection, orthogonal → 0, work and power | Wikipedia, Dot product | https://en.wikipedia.org/wiki/Dot_product |
| Coriolis a = −2Ω × v, always perpendicular to v; a body under this force alone moves at constant speed on a circle | Wikipedia, Coriolis force | https://en.wikipedia.org/wiki/Coriolis_force |
| Geostrophic wind V_g = (k̂/f) × ∇_p Φ, parallel to isobars, lows rotate anticlockwise (NH) | Wikipedia, Geostrophic wind | https://en.wikipedia.org/wiki/Geostrophic_wind |
| Ekman transport 90° right of the stress (NH), left (SH); offshore transport → coastal upwelling; CUTI/BEUTI | Jacox, Edwards, Hazen & Bograd (2018), *JGR Oceans* 123, 7332–7350, doi:10.1029/2018JC014187 | https://repository.library.noaa.gov/view/noaa/53525 |
| Upwelling on west coasts with northerly winds (California, NW Africa) | Coastal Wiki, Ekman transport | https://coastalwiki.org/wiki/Ekman_transport |
| Wind work on the general circulation ≈ 1 TW, dominated by the Southern Ocean | Wunsch (1998), *J. Phys. Oceanogr.* 28, 2332ff. (full text) | https://data-ww3.ifremer.fr/BIB/Wunsch_JPO1998.pdf |
| Headwind = V cos α, crosswind = V sin α; 20 kt at 30° → 17.3 / 10 kt | Wikipedia, Crosswind; open-exam-prep FAA study guide (secondary) | https://en.wikipedia.org/wiki/Crosswind · https://open-exam-prep.com/study-guides/faa-private-pilot/performance/crosswind-runway-factors |
| Vector misconceptions are common and catalogued (taxonomy from 2067 students; 20-item TUV) | Barniol & Zavala (2014), *Phys. Rev. ST Phys. Educ. Res.* 10, 010121, doi:10.1103/PhysRevSTPER.10.010121 | https://www.physport.org/assessments/assessment.cfm?A=TUV |
| Forum views on the "physical meaning" of the products (cross product meaning comes from its uses; dot = projection) | PhysicsForums threads | https://www.physicsforums.com/threads/what-does-cross-product-of-vectors-actually-mean.761927/post-4799354 · https://physicsforums.com/threads/intuitive-meaning-of-dot-product.752828 |

### Misconceptions worth a Like…/Unlike… or a spoken correction (for both movies)
| Misconception | Why wrong | Source |
|---|---|---|
| "The dot product is a kind of multiplication, so it is bigger when the arrows are bigger, regardless of angle" | At 90° it is zero whatever the lengths, and it can be negative | Wikipedia Dot product (orthogonal → 0); TUV taxonomy (dot-product items **(unverified: item content not read)**) |
| "The cross product lies in the plane of the two arrows" / "a × b points between a and b" | It is perpendicular to both. (a × b)·a = 0 | Wikipedia Cross product |
| "a × b = b × a" | Anticommutative: the sign flips | Wikipedia Cross product |
| "Torque has units N·m, so it is the same as energy (J)" | Torque is a cross product (a direction), work is a dot product (a scalar). Same units, different quantities | standard; Wikipedia Cross product (torque section) **(units remark unverified on the page)** |
| "Coriolis speeds air up / gives it energy" | It is always across the velocity, so the power F · u = 0. It only steers | Wikipedia Coriolis force (constant-speed circle) |
| "Ekman transport goes 45° to the wind" | 45° is the *surface current* in the ideal theory. The *depth-integrated* transport is 90° | Jacox et al. 2018; NOAA NWS report summary via search |
| "Clockwise/anticlockwise" without a viewpoint | The sense flips when you look from the other side, so always say from where | house rule (teaching-style §1h) |

---

## 7. Unverified items
- The video's description, chapters, length and transcript: **not accessed** (see §1).
- Wunsch (1998) DOI 10.1175/1520-0485(1998)028<2332:TWDBTW>2.0.CO;2: **(unverified)**. The paper and the ≈ 1 TW were confirmed via the full-text PDF listing, but not the DOI.
- 3Blue1Brown ch. 9 and ch. 11 page contents: only the titles/URLs were confirmed. The ch. 10 content was confirmed.
- FAA Airplane Flying Handbook as the primary source of the crosswind rule: secondary sources only **(unverified)**.
- Easy values in W5 (≈ 17 h inertial period at 45°) and W18 (≈ 465 m/s): from standard formulas, **not computed today**. They must come from `fluidpy` with CHECK rows before they go on screen.
- Whether TUV items cover the dot/cross products specifically: **(unverified)**.
- 0.1b length increase: an estimate, not a TTS measurement.
