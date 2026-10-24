# ch00_dot_product_why v5: narration analysis and proposed script

Narration analyst, 2026-10-24. Input for the movie director. No movie files were edited.

**Inputs read.** `reports/ch00_poc_user_feedback.md` (all rounds; U-M3.G1–G6 and U-M3.1–23 for v5), the user's own words in
`Video_Prompt_2.docx` (text pulled with zipfile), the v4 `script.md`, `storyboard.yaml` and `timing.json`,
`movies/data/build_ch00_dot_product_why.py`, the committed `data/*.json` (every number below was checked against them),
`movies/lexicon.yaml`, and the teaching-style §1d and motion-graphics §3/§5 rules. Memory rules applied: say "air parcel"
and define it once; no equation labels, footnotes or "not to scale"; explain every new symbol.

(Housekeeping: I ran the build script once by accident while checking numbers. It rewrote `data/*.json` and
`manifest.json` with byte-identical content. `git status` shows no change to any tracked movie file.)

---

## 0. Summary

| | v4 (built) | v5 proposal |
|---|---|---|
| Scenes | 22 | 23: s07 cut, s16 → s16a + s16b, s19 → s19a + s19b |
| Words · sentences | 1142 · 90 | **1764 · 135** |
| Mean / max words per sentence | 12.7 / 26 | 13.1 / 28 |
| Estimated length | 8:12 (measured) | **about 12:30** with the full script, **about 12:05** with trim set T (§4) |

**How the length was estimated.** From v4's measured `timing.json`, Kokoro af_bella at speed 1.0 speaks at
**152.8 words per minute** (1142 words in 448.45 s of speech). The gaps are 0.35 s between sentences, 0.8 s between
scenes and 0.3 s of lead and of tail, plus the 2.5-s end-card hold. A flat 140 words per minute gives 12.6 min for the
same script. Measured TTS time may differ by about ±3 % (±20 s). **Run the `tools/tts.py` dry run before the length is
locked.**

**Why it is over 12 minutes.** The user's main complaint was that the narration was rushed, so every place the user
named got full sentences. On top of that, the weather part answers four new physics questions (U-M3.18–21), which adds
about 230 words. I could not get under 12:00 without dropping teaching the user asked for. Trim set T in §4 has
11 pre-written cuts (−62 words, about −27 s). Question Q1 in §6 asks which way to go.

**Scenes split, added or cut, and why.**
- **s07 (b hat) is cut.** It was the second route to the same shadow and cost about 20 s. The unit-vector idea is still
  taught, at its first real use: s10 defines "a unit vector, an arrow of length one" and uses x hat. The ready-made
  text to put s07 back is in §4 (+42 words, about +18 s). See Q2.
- **s16 → s16a + s16b.** s16a splits the wind into its two parts (5 m/s across the isotherms, 8.66 m/s along them).
  s16b computes v·∇T and its units. v4 put both, plus the 8.66 statement, into 69 words. The user did not follow it
  (U-M3.18).
- **s19 → s19a + s19b.** s19a shows why the pole falls (the isotherms slide, and air arrives from upwind). s19b is the
  balance on its own: +0.18 (advection) − 0.18 (local) = 0. The user asked for this to be said "loudly, clearly"
  (U-M3.19c, U-M3.20).
- s08 stays as a bridge scene. If the director wants fewer scene cuts, s08 can be merged into the end of s06.

---

## 1. Item coverage (every U-M3 item, and whether narration answers it)

| Item | What the user asked | Narration answer (scene) | Screen / design (for the visual analyst) |
|---|---|---|---|
| U-M3.G1 | No headings, scene counter or part cards | No spoken headings: no "Part 2", "definition two" or "reason one:". Ordinals live inside sentences ("The first is that the order shouldn't matter.") | Remove the SceneTitle band, PartCards and n/22 |
| U-M3.G2 | Screen shows keywords; the voice explains | Every scene below has a **keywords** list (symbols, numbers, single words) instead of on-screen sentences | No boxes by default |
| U-M3.G3 | Natural, unhurried, full sentences, natural transitions | Every scene opens with a bridge ("Now let's see how the angle…", "To see what the angle does…", "Now let's look at how the dot product is used in weather."). No "X: Y, Z" fragment chains. See the style sheet in §5 | — |
| U-M3.G4 | No "1 grid square = 1 unit" | Never spoken | Remove from s02–s05 |
| U-M3.G5 | Define every term in plain words: advection, uphill, local rate | **advection** = "being carried along by the wind" (s13); **local rate** = "how fast its temperature changes over time" at the fixed pole (s12); **uphill** is gone, replaced by "the way the temperature increases fastest" (s15). Also defined: vector, components, length bars (s02); scalar (s03); theta, cosine (s04); shadow (s06); unit vector, x hat (s10); force, displacement, newton, joule, work (s11); partial, air parcel (s12); phi, v, grad, material derivative (s13); isotherm, ∂/∂x, ∂/∂y (s14); gradient, kelvin = degree step (s15); upwind (s19a) | — |
| U-M3.G6 | No links or paths on screen | s22 names the lab and the notebook in words only | No URL on screen |
| U-M3.1 | No "two arrows in, one number out"; open with "What is the dot product?" | s01 opens with that question | Remove the "1 what it is · 2 why" box |
| U-M3.2 | "Vector = an arrow…" without a box | s02 says it in a full sentence | Highlight colour or size, no box |
| U-M3.3 | a = (5, 1) with "components" pointers | Narration gives the full sentence | Screen: `a = (5, 1)` + the word *components* with two arrows (same for b) |
| U-M3.4 | Pythagoras: keep; bars note without a box | "Pythagoras' theorem gives their lengths… We write a length with two straight bars." | Margin-note style |
| U-M3.5 | 3-D remark said slowly, then strike a₃b₃ | s03: "If the arrows lived in three-dimensional space, each would have three components, along x, y and z, and we'd add three products. Our arrows lie flat, in two dimensions, so there's no third component, and that term drops out." | Strike a₃b₃ on "drops out" |
| U-M3.6 | a, b written under the picture; no grid note | — | Screen |
| U-M3.7 | Keep the first/second-component tags; the 8 said as a full sentence, scalar | s03: "Multiplying the first components… Multiplying the second… So a dot b equals eight. It's a single number, not an arrow. A number like this is called a scalar, so the dot product is also called the scalar product." | Keep the tags |
| U-M3.8 | No "definition two"; natural transition | s04 opens: "Now let's see how the angle between the two arrows comes into it." | — |
| U-M3.9 | Show the \|a\| and \|b\| calculations in s04 | The voice refers to them. The screen carries √(5²+1²) = √26 = 5.099 and √(1²+3²) = √10 = 3.162 (rule G2) | Screen |
| U-M3.10 | Fixed arrow in full sentences; each case with its calculation and conclusion | s05, three full cases, with the user's wording ("let's keep one arrow fixed in all three pictures, and change only the other one"; "When two vectors are at right angles, their dot product is zero"; "pointing in the opposite direction"). The user wrote p = (2, 0); I kept the movie's p = (3, 0) as instructed | — |
| U-M3.11 | q labels at the arrow tips | — | Screen |
| U-M3.12 | Work: F and d are vectors; 5 m → 50 J, doubled → doubled; the shadow alone is not the work | s11: "a force vector, F"; "the displacement vector, d"; "If d is five metres, the work is fifty joules. If d doubles to ten metres, the work doubles…"; "Yet the shadow is ten newtons both times, so on its own it can't give the work. We must multiply by the length of d, and the dot product does exactly that." | — |
| U-M3.13 | "Now let's look at how the dot product is used in weather"; the two thermometers in full; keep the "partial" sentence | s12, word for word as asked | — |
| U-M3.14 | Say what the equation is before reading it; left = following the parcel, ∂/∂t = fixed place; "material derivative, not partial"; define advection | s13 never reads the equation aloud as a string. It says what the equation is for, then the left side, the right side, advection, and why the left side is called the material derivative | — |
| U-M3.15 | Leaked box in s13 | — | Builder bug |
| U-M3.16 | Build the map in words first, then name the isotherms | s14: rule east → rule north → "Join the places with equal temperature…" → "These are called isotherms." | Lines draw only on "Join the places…" |
| U-M3.17 | No "uphill" | s15: "It points the way the temperature increases fastest: straight across the isotherms, towards warmer air." | Arrow label "warmer →" |
| U-M3.18 | What 0.18 K/h means; where 8.66 m/s comes from and why it does nothing | s16a: "ten times sine sixty, is eight point six six metres per second along the isotherms. Moving along an isotherm keeps the same temperature, so that part brings no change." s16b computes v·∇T. s17 explains whose change it is, on a snapshot (§3) | 10 sin 60° = 8.66 m/s on screen |
| U-M3.19 | (a) Do the isotherms move? (b) colder air from the lower left; (c) the pole falls while the balloon stays at 13 °C, said unambiguously | (a) s17 "But the photograph doesn't stay still." and s18 "the isotherms are only a snapshot: they slide along with the wind." (b) s19a "Look upwind, where the wind comes from: down and to the left on our map." (c) s19a "the thermometer on the pole falls" and s19b "the balloon stays at thirteen degrees, while the pole… keeps cooling". v4's "the air gains… reaching spots… warmer" is gone | — |
| U-M3.20 | Spell out the cancellation +0.18 / −0.18; connect the sliding isotherms to the pole falling | s19a ties the slide to the fall ("The isotherms slide east, eighteen kilometres every hour, leaving the pole on the colder side."); s19b is the balance scene | Two-row balance on screen |
| U-M3.21 | Twice as steep, concretely: 1 °C per 50 km; shadow still 5; ∇T = 2 × 10⁻⁵; 0.36 K/h; twice as fast | s20 says every one of these | Calculation line on screen |
| U-M3.22 | Recap: spell out the three signs; less packed | s21 gives one sentence per idea, the three signs each in their own sentence | One keyword row per sentence |
| U-M3.23 | End card in words, no links | s22 | Screen without URLs |
| Rounds 1–2 still in force | "air parcel" (s12); "pointing in opposite directions" at 180° (s04, s05, s21); no references, no "not to scale"; plain (1) kept ("Let's call this equation one", used in s06, U-M2.5); v is the wind | ✔ | — |

---

## 2. Proposed v5 narration, scene by scene

Estimated times use the v4-measured rate (see §0). "Keywords" means what may appear on screen: symbols, numbers and
single words, never the narrated sentence. Numbers are spoken rounded and shown exact (for example, 5.1 spoken and 5.099
shown).

### s01_hook · 42 words · 3 sentences · ~17 s · 0:00–0:18
> What is the dot product? It's one of the most useful tools in physics and in weather science. Let's see what it is, why it's built this way, and how it tells us whether the wind will warm or cool a place.

- Keywords: **dot product** · arrows a, b · **a · b = 8** · a faint weather-map thumbnail on "wind"
- Answers: U-M3.1, G1, G3. The hook is a question, not a slogan. No "1 · 2" agenda box.

### s02_arrows · 76 words · 7 sentences · ~32 s · 0:18–0:50
> Let's start with vectors. A vector is an arrow, with a length and a direction. Vector a goes five steps right and one step up, and vector b goes one right and three up. These numbers are called components. Vector a has the components five and one, and vector b has one and three. Pythagoras' theorem gives their lengths: about five point one and three point one six. We write a length with two straight bars.

- Keywords: **vector** = length + direction (highlight, no box) · **a = (5, 1)** · **b = (1, 3)** · *components* with two pointer arrows to 5 and 1 (and to 1 and 3) · |a| = √(5² + 1²) = √26 = 5.099 · |b| = √(1² + 3²) = √10 = 3.162 · *Pythagoras* · margin note: |a| = *length of a*
- Answers: U-M3.2, U-M3.3, U-M3.4, U-M2.1 (the component sentence, said in full)

### s03_definition · 106 words · 10 sentences · ~45 s · 0:51–1:36
> So how do we find the dot product? We multiply the matching components, and then add. If the arrows lived in three-dimensional space, each would have three components, along x, y and z, and we'd add three products. Our arrows lie flat, in two dimensions, so there's no third component, and that term drops out. Multiplying the first components, five times one is five. Multiplying the second, one times three is three. Together that's eight. So a dot b equals eight. It's a single number, not an arrow. A number like this is called a scalar, so the dot product is also called the scalar product.

- Keywords: a = (5, 1) and b = (1, 3) **under the picture** · a·b = a₁b₁ + a₂b₂ + ~~a₃b₃~~ · *x, y, z* · *2-D* · tags *first components*, *second components* (the user approved these boxes) · 5 × 1 + 1 × 3 = **8** · **scalar** · *scalar product*
- Answers: U-M3.5, U-M3.6, U-M3.7, U-M2.2
- Note: say "the first components", not "a one b one". Kokoro would read the lone "a" as the article.

### s04_cosine · 89 words · 6 sentences · ~37 s · 1:37–2:13
> Now let's see how the angle between the two arrows comes into it. Another way to write the dot product multiplies the two lengths, and then the cosine of the angle between the arrows, called theta. The cosine is one when two arrows point the same way, zero at a right angle, and minus one when they point in opposite directions. Here the angle is about sixty degrees, and its cosine is about point five. Multiply it all out, and we get eight again. Let's call this equation one.

- Keywords: **a·b = |a| |b| cos θ   (1)** · θ arc · cos 0° = 1, cos 90° = 0, cos 180° = −1 · |a| = √26 = 5.099, |b| = √10 = 3.162 (U-M3.9) · θ = 60.3°, cos θ = 0.496 · 5.099 × 3.162 × 0.496 = **8**
- Answers: U-M3.8, U-M3.9 (on screen), U-M2.5 (plain "(1)")
- Numbers: θ = 60.255°, cos θ = 0.496139 (`pair.json`). The voice says "about sixty degrees" and "about point five".
  The screen shows 0.496 and 8.000.

### s05_angle_cases · 124 words · 9 sentences · ~52 s · 2:14–3:06
> To see what the angle does, let's keep one arrow fixed in all three pictures, and change only the other one. The fixed arrow, p, has components three and zero. In the first picture, q is two, zero, pointing the same way as p. Three times two plus zero times zero is six, a positive number. In the second picture, q is zero, two, at a right angle to p, and both products are zero. When two vectors are at right angles, their dot product is zero. In the third picture, q is minus two, zero, pointing in the opposite direction. Three times minus two is minus six, a negative number. So the dot product measures how much two arrows point the same way.

- Keywords: **p = (3, 0)** large, top centre · each panel: **q = (2, 0)** / **(0, 2)** / **(−2, 0)** at the arrow **tip** (U-M3.11) · 0°, 90°, 180° · 3×2 + 0×0 = **6** *positive* · 3×0 + 0×2 = **0** *zero* · 3×(−2) + 0×0 = **−6** *negative*
- Answers: U-M3.10, U-M3.11 (screen), U-M2.4. "Pointing in the opposite direction" is used at 180°, as the user decided.
- Note: "both products are zero" is said while the screen shows 3×0 + 0×2. The user asked for the calculation to be
  shown. It is on screen, and the voice names it in a full sentence.

### s06_shadow · 95 words · 6 sentences · ~39 s · 3:06–3:46
> Now let's find a picture for the dot product. From the tip of vector a we drop a line onto b's line, meeting it at a right angle. The piece it marks off is called the shadow of vector a on b. In this right triangle, the shadow is the length of vector a times cos theta. Divide both sides of equation one by the length of b, and only the shadow is left on the right. On the left, that's eight over three point one six, so the shadow is two point five three.

- Keywords: drop line + right-angle mark · **shadow** · shadow = |a| cos θ · (1) ÷ |b| → a·b / |b| = |a| cos θ · 8 / 3.162 = **2.530**
- Answers: U-M2.7 (every line is about the shadow), G3. Two v4 sentences were merged, and the cancelling is said in
  plain words.

### (s07_unit_vector: cut, see §0 and Q2)

### s08_question · 29 words · 4 sentences · ~12 s · 3:46–3:59
> So the dot product is the shadow times the length of b. But why multiply by that length? Why not stop at the shadow? There are three good reasons.

- Keywords: a·b = **shadow × |b|** = 2.530 × 3.162 = 8 · product rectangle · three small empty markers (dots, not headings)
- Answers: G1 (no heading), G3

### s09_reason1_order · 49 words · 3 sentences · ~20 s · 3:59–4:19
> The first is that the order shouldn't matter. The shadow of vector a on b is two point five three, but the shadow of b on vector a is one point five seven. Multiply each shadow by the length of the arrow it falls on, and both give eight.

- Keywords: 8 / 3.162 = **2.530** · 8 / 5.099 = **1.569** · 2.530 × 3.162 = **8** = 1.569 × 5.099 · **a·b = b·a**
- Answers: G3 ("Reason one: order" becomes a sentence), U-M2.8 (calculations stay on screen)

### s10_reason2_cheap · 73 words · 5 sentences · ~30 s · 4:20–4:50
> The second reason is practical: it's quick to calculate, with no angle and no square root. And a unit vector, an arrow of length one, makes the dot product the shadow itself. Take a wind blowing six metres per second towards the east and eight towards the north. The unit vector pointing east, x hat, has components one and zero. So v dot x hat is six: the eastward part of the wind.

- Keywords: *no angle · no √* · **unit vector: length 1** · **v = (6, 8) m/s** · 6 m/s east, 8 m/s north · **x̂ = (1, 0)** · v·x̂ = 6×1 + 8×0 = **6 m/s** · *eastward part*
- Answers: U-M2.9, G5 (unit vector defined here now that s07 is cut)

### s11_work · 121 words · 10 sentences · ~51 s · 4:51–5:42
> The third reason is that physics often needs both sizes. Imagine pulling a sled with a force vector, F, of twenty newtons, tilted sixty degrees up. The sled's movement is the displacement vector, d. The upward part of the pull does no work. The part along the ground, the shadow of F on d, is ten newtons. Work, in joules, is that force times the distance. If d is five metres, the work is fifty joules. If d doubles to ten metres, the work doubles to one hundred joules. Yet the shadow is ten newtons both times, so on its own it can't give the work. We must multiply by the length of d, and the dot product does exactly that.

- Keywords: **F = 20 N**, 60° · **d** (*displacement*) · 17.3 N up: *no work* (dimmed) · shadow = 20 cos 60° = **10 N** · **W = F·d** · 10 N × 5 m = **50 J** · d = 10 m → **100 J** · *×2 → ×2* · *shadow: 10 N both times*
- Answers: **U-M3.12** in full (both vectors named; 5 m → 50 J; doubled → doubled; the scene's point said in plain words)
- Numbers: F = (10.000, 17.321) N, W = 50 J and 100 J (`work.json`). "newton" and "joule" are named with their meaning
  (force; work in joules). Show *N = newton*, *J = joule* as small glosses.

### s12_parcel · 91 words · 8 sentences · ~38 s · 5:43–6:21
> Now let's look at how the dot product is used in weather. Imagine two thermometers. The first is fixed on a pole. How fast its temperature changes over time is called the local rate, written partial T by partial t. Partial means only time changes; the place stays fixed. The second thermometer rides a balloon, drifting with the wind. It stays inside one air parcel: a small volume of air that moves with the flow. Its rate of change, following the air parcel, is written capital D T by D t.

- Keywords: pole thermometer · **∂T/∂t** *local rate* · *∂: only time changes* · balloon · **air parcel** (dashed outline) · **DT/Dt** *following the parcel*
- Answers: **U-M3.13** (transition and thermometers word for word; "Partial means…" kept), U-M2.11, U-M.9
- Note: the name "material derivative" now comes in s13, where U-M3.14 asked for the "material, not partial" contrast.

### s13_equation · 116 words · 8 sentences · ~48 s · 6:22–7:10
> One equation links these two rates, and it's the one the balloon's thermometer obeys. Phi stands for anything the air carries, like temperature or moisture. On the left is the change following the air parcel. On the right is the change at one fixed place, plus a term with v, the wind, and grad, the upside-down triangle, which we'll meet in a moment. Advection means being carried along by the wind. This advection term is the change from being carried to places where phi is different. The left side, following a moving parcel, is called the material derivative. For temperature, v dot grad T is the advection of temperature, and its dot is our dot product.

- Keywords: **Dφ/Dt = ∂φ/∂t + v·∇φ** (each term lights up as it is named) · under-labels *following the parcel* · *fixed place* · **advection** · φ: *T, moisture* · v: *wind* · ∇: *grad* · **material derivative** · DT/Dt = ∂T/∂t + **v·∇T** · ring on the dot: *dot product*
- Answers: **U-M3.14** (what the equation is for comes first; it is never read aloud as a symbol string; advection
  defined; "material derivative" named for the moving parcel), U-M3.15 (screen bug), G5
- Note: the user wrote "material derivative instead of partial derivative". Calling it out with "not a partial
  derivative" would add a sentence. The contrast is carried by "The left side, following a moving parcel, is called the
  material derivative", placed right after the fixed-place term. If the director has room, add: "It isn't a partial
  derivative, because the place moves with the parcel." (+13 words)

### s14_isotherms · 83 words · 6 sentences · ~34 s · 7:10–7:45
> To see it at work, picture a map. Suppose the temperature rises one degree for every hundred kilometres east, and doesn't change at all as you walk north. Join the places with equal temperature, and you get straight north to south lines, one every hundred kilometres. These are called isotherms. Walk east, and each isotherm you cross is one degree warmer: that's partial T by partial x. Walk north, and you stay on one isotherm, so partial T by partial y is zero.

- Keywords: colour map only at first · *+1 °C per 100 km →* · *north: no change* · isotherm lines appear **on "Join the places…"**, labelled 11 … 15 °C · **isotherm** · walker +1 °C ticks · **∂T/∂x = 1 °C / 100 km** · **∂T/∂y = 0** (the v4 animation and calculation are kept)
- Answers: **U-M3.16** (rule in words first, lines second, name third), U-M2.12

### s15_grad_t · 62 words · 4 sentences · ~25 s · 7:46–8:11
> These two rates form one arrow: the temperature gradient, read grad T. A kelvin step is the same size as a degree Celsius, so grad T is ten to the minus five kelvin per metre, and zero. It points the way the temperature increases fastest: straight across the isotherms, towards warmer air. Its length is how fast the temperature changes with distance.

- Keywords: **∇T = (∂T/∂x, ∂T/∂y)** · *grad* · = (1 °C / 100 km, 0) = **(1.00 × 10⁻⁵ K/m, 0)** · *1 K step = 1 °C step* · *100 km = 10⁵ m* · arrow label **warmer →** · |∇T|
- Answers: **U-M3.17** ("uphill" replaced), G5

### s16a_wind_parts · 69 words · 4 sentences · ~28 s · 8:12–8:40
> Now let the balloon's wind blow across this map: ten metres per second, sixty degrees away from grad T. Its shadow on grad T, ten times cos sixty, is five metres per second straight across the isotherms. The other part, ten times sine sixty, is eight point six six metres per second along the isotherms. Moving along an isotherm keeps the same temperature, so that part brings no change.

- Keywords: **v = 10 m/s**, 60° · 10 cos 60° = **5.00 m/s** *across* · 10 sin 60° = **8.66 m/s** *along: no change* (dashed along the 13 °C line)
- Answers: **U-M3.18** (the 8.66 calculation shown and explained)
- Numbers: v = (5.000, 8.660) m/s; along-isotherm part (0, 8.660) (`weather.json → v, v_along_isotherm_m_s`).
  "The balloon's wind" ties it back to s12 (v4 as-built: the same wind).

### s16b_advection_number · 50 words · 3 sentences · ~20 s · 8:41–9:01
> So v dot grad T is the wind's shadow times the length of grad T: five metres per second times ten to the minus five kelvin per metre. The metres cancel, leaving five times ten to the minus five kelvin per second. Over an hour, that's point one eight kelvin.

- Keywords: **v·∇T = (|v| cos θ) |∇T|** · 5.00 m/s × 1.00 × 10⁻⁵ K/m · (m/s)(K/m) with *m* struck = K/s · **5.00 × 10⁻⁵ K/s** · × 3600 s = **0.180 K per hour** · check: 5.00 × 10⁻⁵ + 8.66 × 0 ✓
- Answers: U-M3.18 (calculation), U-M2.13

### s17_space_time · 73 words · 7 sentences · ~31 s · 9:02–9:33
> What does point one eight kelvin per hour mean? It's a rate in time, while one degree per hundred kilometres is a rate in space. Think of the map as a photograph of one moment. In an hour, the wind carries the balloon eighteen kilometres across the isotherms. On the photograph, that spot is point one eight degrees warmer than where it started. That's the advection term. But the photograph doesn't stay still.

- Keywords: *rate in space* 1 °C / 100 km · *rate in time* **0.180 K / h** · *snapshot* (camera or photo-frame corner on the map) · 36 km *along the wind*, **18 km** *across* = 5.00 m/s × 3600 s · 18 km × 1 °C / 100 km = **0.18 °C** · map frozen for this scene only, with a "snapshot" marker
- Answers: **U-M3.18** (whose change, where, why), **U-M3.19a** (introduced here). v4's "the air gains… reaching
  spots… warmer" made the user think the temperature rises. Now no thermometer is said to warm: the +0.18 is a
  comparison on a frozen picture, named "the advection term", and the next sentence says the picture moves.

### s18_label_zero · 74 words · 5 sentences · ~31 s · 9:33–10:04
> Suppose each air parcel keeps its temperature: no sunshine and no mixing. Then the balloon's reading never changes, so capital D T by D t is zero. And because the air carries its temperature with it, the isotherms are only a snapshot: they slide along with the wind. Put zero into the equation, and subtract v dot grad T from both sides. Then partial T by partial t equals minus v dot grad T.

- Keywords: *each parcel keeps its T* · balloon **13.00 °C** · **DT/Dt = 0** · isotherms start sliding (kept from v4, the user liked it) · rows: DT/Dt = ∂T/∂t + v·∇T → **0** = ∂T/∂t + v·∇T → −v·∇T on both sides → **∂T/∂t = −v·∇T**
- Answers: **U-M3.19a** (snapshot, and yes, the isotherms slide), U-M3.20 (keep the slide), U-M2.15

### s19a_pole_cools · 79 words · 5 sentences · ~32 s · 10:05–10:37
> With our numbers, that's minus point one eight degrees per hour: the thermometer on the pole falls. The isotherms slide east, eighteen kilometres every hour, leaving the pole on the colder side. Look upwind, where the wind comes from: down and to the left on our map. The air that reaches the pole in an hour is there now, point one eight degrees colder. So the pole reads thirteen, then twelve point eight two, then twelve point six four.

- Keywords: **∂T/∂t = −0.180 K/h** (minus in rose) · *pole falls* ↓ · 13 °C isotherm shifts 18 km east per hour (clock) · *upwind* track with dots *1 h: 12.82 °C*, *2 h: 12.64 °C* (3 h: 12.46) · pole readout **13.00 → 12.82 → 12.64** · balloon **13.00 °C**
- Answers: **U-M3.19b** (colder air from the lower left), **U-M3.19c** (the pole falls), **U-M3.20** (the slide
  linked to the fall)
- Numbers: isotherm shift 18.0 km after 1 h (`shift_km[20]`); upwind dots at (282.0, 148.8), (264.0, 117.6),
  (246.0, 86.5) km, all lower-left of the pole at (300, 180); T = 12.82, 12.64, 12.46 °C (`upwind_T_C`); pole
  `T_pole[20,40,60]` = 12.82, 12.64, 12.46.
- "Down and to the left" replaces a compass word on purpose. The wind points 60° north of east (about NNE), so upwind
  is about SSW. v4's "north-east / south-west" was loose.

### s19b_balance · 71 words · 5 sentences · ~29 s · 10:38–11:07
> Now compare the two thermometers. Moving into warmer parts of the photograph would warm the balloon by point one eight degrees an hour: the advection term, plus point one eight. But every fixed place cools by point one eight an hour, as colder air arrives: the local rate, minus point one eight. Together they make zero. So the balloon stays at thirteen degrees, while the pole, which can't move, keeps cooling.

- Keywords, as a two-row balance (no box): **v·∇T = +0.18 K/h** *advection* · **∂T/∂t = −0.18 K/h** *local* · **DT/Dt = 0** · balloon **13.00 °C** steady · pole ↓
- Answers: **U-M3.20** (the cancellation stated as its own scene), U-M3.19c. This is the user's own reading, made
  explicit: the balloon "gains" 0.18 by moving and "loses" 0.18 because the whole pattern cools at each place.

### s20_twice_steep · 83 words · 6 sentences · ~34 s · 11:08–11:42
> Now let's change only the map. Suppose the temperature rises one degree every fifty kilometres, instead of every hundred. The isotherms are twice as close, so grad T doubles, to two times ten to the minus five kelvin per metre. The wind hasn't changed, so its shadow is still five metres per second. But the dot product doubles, to point three six kelvin per hour, and the pole cools twice as fast. The shadow alone missed the change; the dot product caught it.

- Keywords: **1 °C per 50 km** · isotherms every 50 km · **∇T = 2.00 × 10⁻⁵ K/m (×2)** · shadow **5.00 m/s** (*same*) · v·∇T = 5.00 × 2.00 × 10⁻⁵ = 1.00 × 10⁻⁴ K/s = **0.360 K/h (×2)** · pole 13.00 → **12.64** after 1 h · *twice as fast*
- Answers: **U-M3.21** (every requested number said, and "twice as fast" said plainly)
- Numbers: `K_per_h_steep` 0.36, `T_pole_steep[20]` 12.64, `shadow_steep_m_s` 5.0.

### s21_recap · 83 words · 8 sentences · ~35 s · 11:43–12:18
> Let's sum up. The dot product multiplies matching components and adds, giving a number, not an arrow. In pictures, it's the shadow of one arrow on the other, times the other's length. When the arrows point the same way, it's positive. At right angles, it's zero. In opposite directions, it's negative. With a unit vector, it picks out one part of an arrow. And in physics, it gives the work a force does, and how fast the wind warms or cools a place.

- Keywords, one row per sentence, appearing with it: **5×1 + 1×3 = 8** *scalar* · **shadow × length** · **same way: +** · **right angle: 0** · **opposite: −** · **v·x̂ = 6 m/s** · **W = 50 J** · **v·∇T = 0.18 K/h**
- Answers: **U-M3.22** (the three signs in three sentences; each idea that was taught gets its own sentence and row)

### s22_end · 26 words · 2 sentences · ~11 s · 12:19–12:30 (+ 2.5-s silent hold)
> To try this yourself, look for the vector products lab and the dot product notebook on the website that goes with this video. Thanks for watching.

- Keywords: *vector products lab* · *dot product notebook* (words only, no URL or path)
- Answers: **U-M3.23**, G6

**Total: 1764 words · 135 sentences · about 12:30 (model), 12.6 min at a flat 140 wpm.**

---

## 3. The physics answers (U-M3.18–21), checked against the build script

| Question | Answer as narrated | Source in the build or data |
|---|---|---|
| Where does 8.66 m/s come from? | 10 × sin 60° = 8.66 m/s. It is the part of the wind along the isotherms (here northward) and brings no temperature change. v·∇T in components: 5.00 × 10⁻⁵ + 8.66 × 0 | `v_along = v − projection(v, ∇T)` = (0, 8.660); row "along-isotherm part ⟂ ∇T (dot = 0)" |
| What is 0.18 K/h? | The **advection term** v·∇T = 5.00 m/s × 1.00 × 10⁻⁵ K/m = 5.00 × 10⁻⁵ K/s = 0.180 K/h. On a snapshot of the map, the balloon is carried 18 km per hour across the isotherms, to spots 0.18 °C warmer. **It is not the reading of either thermometer** | `adv1`, `K_per_h` 0.18; `km_per_h_towards_warm` 18.0, `km_per_h_along_wind` 36.0; `warming_met_K` 0.18 |
| Do the isotherms change over time? | Yes. They are a snapshot. With no heating or mixing, each parcel keeps its temperature, so the pattern moves with the air: the lines slide east 18 km per hour (the 8.66-m/s part slides them along themselves, which looks like nothing) | T(x, t) = T_west + G (x − v_x t) in `material_derivative_terms`; `shift_km` = v_x t (18.0 at 1 h) |
| Who warms, who cools? | **The pole's thermometer falls 0.18 °C per hour** (∂T/∂t = −v·∇T = −0.180 K/h): 13.00 → 12.82 → 12.64 → 12.46 °C, because air from upwind (lower left) is colder. **The balloon stays at 13.00 °C** (DT/Dt = 0) | `dTdt_K_h` −0.18; `T_pole`; `upwind_T_C` [12.82, 12.64, 12.46]; `material_derivative_terms`: local −5.00 × 10⁻⁵, advective +5.00 × 10⁻⁵, total 0 |
| The balance | +0.18 (advection) + (−0.18) (local) = 0 = DT/Dt | same `material_derivative` rows (G1 and G2) |
| Twice as steep | 1 °C per 50 km ⇒ ∇T = 2.00 × 10⁻⁵ K/m; the shadow is still 5.00 m/s; v·∇T = 1.00 × 10⁻⁴ K/s = 0.360 K/h; the pole falls 0.36 °C/h (13.00 → 12.64 after 1 h) | `adv2`, `shadow_steep_m_s` 5.0, `K_per_h_steep` 0.36, `T_pole_steep[20]` 12.64 |

Every other spoken number was checked: |a| 5.099 ("about five point one"), |b| 3.162 ("three point one six"), θ 60.255°
("about sixty"), cos θ 0.496 ("about point five"), p·q = 6, 0, −6, shadows 2.530 and 1.569, v·x̂ = 6, F = 20 N →
10 N, W = 50 J / 100 J, isotherms at 100…500 km (11–15 °C), ∂T/∂x = 1.00 × 10⁻⁵ K/m. **No new numbers were invented.**
The builder needs no new data for the narration. The visual analyst may want `shift_km` reused for the s19a isotherm
shift label (already in `weather.json`).

---

## 4. Length control

**Trim set T** (≈ −62 words, −8 sentences, ≈ −27 s → about 12:05). Apply these in order, as needed, after the TTS dry
run. Each one keeps every U-M3 answer.

| # | Scene | Change | Saves |
|---|---|---|---|
| T1 | s01 | Delete "It's one of the most useful tools in physics and in weather science." | 13 w |
| T2 | s08 | → "So why multiply the shadow by the length of b, instead of stopping at the shadow? There are three good reasons." | 8 w |
| T3 | s12 | "Imagine two thermometers. The first is fixed on a pole." → "Imagine one thermometer fixed on a pole."; "The second thermometer rides…" → "A second thermometer rides…" | 6 w |
| T4 | s13 | "and grad, the upside-down triangle, which we'll meet in a moment" → "and grad, which we'll meet in a moment" | 3 w |
| T5 | s15 | Delete "Its length is how fast the temperature changes with distance." (s20's "twice as close… doubles" still carries it) | 10 w |
| T6 | s17 | Delete "That's the advection term." (s19b names it) | 4 w |
| T7 | s20 | "The wind hasn't changed, so its shadow is still…" → "The wind's shadow is still…" | 5 w |
| T8 | s21 | Delete "Let's sum up." | 3 w |
| T9 | s22 | Delete "Thanks for watching." | 3 w |
| T10 | s04 | "Multiply it all out, and we get eight again. Let's call this equation one." → "Multiplied out, that's eight again, and we'll call this equation one." | 4 w |
| T11 | s11 | Fold "The sled's movement is the displacement vector, d." into the sentence before: "…tilted sixty degrees up, while it moves along a displacement vector, d." | 3 w |

**To restore s07** (if Q2 = keep b hat; +42 words, ≈ +18 s):
> There's another way to reach the same shadow. Shrink b to a length of exactly one, keeping its direction. This is b hat, the unit vector along b. Then a dot b hat is the shadow itself: two point five three again.

The screen keeps b̂ = (1/3.162, 3/3.162) = (0.316, 0.949) and 5 × 0.316 + 1 × 0.949 = 2.530 (U-M2.7). If s07 returns,
s10's "a unit vector, an arrow of length one," can shrink to "a unit vector".

---

## 5. Style sheet (the rules this script follows)

1. **One idea per sentence**, at most about 28 words (max here 28, mean 13). Every sentence has a verb. No spoken
   headings or label fragments: no "Definition two", "Reason one: order", "Same direction, zero degrees: …, positive",
   "two arrows in, one number out".
2. **Each scene opens with a bridge** that links it to the last one ("Now let's see how the angle…", "To see what the
   angle does…", "So how do we find…", "Now let's look at how the dot product is used in weather.", "To see it at
   work…", "Now compare the two thermometers.").
3. **Plain words first, then the name**: describe the thing, then "is called X" or "X means …" (isotherm, advection,
   material derivative, scalar, unit vector). Never name a term before the viewer has seen what it is (s14 builds the
   map before saying "isotherm").
4. **Each term is defined once, in one sentence, at first use**, then reused unchanged: air parcel, local rate, advection,
   advection term, material derivative, shadow, unit vector, grad.
5. **Maths in words**: "a dot b", "v dot grad T", "partial T by partial t", "capital D T by D t", "cos sixty", "sine
   sixty", "ten to the minus five kelvin per metre", "point one eight". The equation is never read aloud as a symbol
   string before it has been explained (U-M3.14). The voice says each term's meaning while that term lights up.
6. **Numbers are rounded in the voice and exact on screen** (5.1 / 5.099; point five / 0.496). Arithmetic the user asked
   to see (|a|, |b|, 8.66, the unit chain) is on screen. The voice says the result and what it means.
7. **Sign words are always explicit**: "positive / zero / negative", "falls", "cools", "colder", "warmer than where it
   started". Never say "gains towards warmth" without saying who and on what (v4's mistake).
8. **Temperature units**: "kelvin" in equation readings; "degrees" for thermometer readings and the balance. s15 says
   once that a kelvin step equals a degree Celsius step.
9. **No references, labels, links, "not to scale" or book names.** The only number is the plain "equation one" (s04,
   s06). Say "air parcel", never "bit of air". At 180°, say "pointing in (the) opposite direction(s)".
10. **Banned words**: clearly, obviously, simply, just, uphill (grep-checked: none present).
11. **Kokoro**: the vector a is only ever "vector a " followed by a word, or inside "a dot b". The script never has
    "vector a," / "vector a." / "vector a:" (lexicon only covers "arrow a,"). Instances: "Vector a goes", "Vector a has",
    "vector a we", "vector a on" ×2, "vector a times", "vector a is". "a₁b₁" is spoken as "the first components", never
    "a one b one". Words already confirmed in v4 (no new lexicon needed): isotherm(s), grad, phi, x hat, newtons,
    joules, upwind, partial, capital D. New words to listen for in the dry run: "advection" (expected fine),
    "Pythagoras'", "scalar", "sine".
12. **Captions**: sentences ≤ 28 words split into cues of ≤ 42 characters per line. The longest sentences (s13 grad
    sentence, s16b first sentence, s04 cosine sentence) should be checked for a clean break at the comma or colon.

---

## 6. Decisions needed

1. **Q1 Length.** The full script is about 12:30. Trim set T gives about 12:05. Getting under 12:00 means cutting a
   taught step. Options: (a) accept about 12:05–12:30 as "just over" (the user accepted 8:12 against "about 8"); (b)
   apply T and also cut s09 (−49 w), which loses one of the three "why multiply" reasons; (c) apply T and shorten s05
   to two spoken cases with the third on screen only. **Recommendation: (a) with T applied, after a TTS dry run.** The
   user's complaint was rushing, and v5 must not drift back to it.
2. **Q2 b hat (s07).** Cut (recommended for time: the unit vector is still defined and used in s10, and the recap uses
   it) or kept (+18 s, restores the U-M2.6/U-M2.7 b̂ line the user once asked to see explained).
3. **Q3 Snapshot framing in s17.** I explain the +0.18 as "on a photograph of one moment, the balloon is carried to a
   spot 0.18 °C warmer per hour" and then show the photograph moving. This is the user's own reading in the docx. It
   needs a visual "snapshot" marker on the map in s17 and a visible slide in s18–s19a (director and visual analyst).
4. **Q4 "material, not partial" (s13).** It is covered implicitly. The +13-word explicit sentence is in the s13 notes
   if the user wants it said outright.
5. **Q5 "Thanks for watching."** Added to s22 for a warmer close (T9 removes it). This is a matter of taste.

Working files (scratch, not part of the repo): the proposed script in plain text, identical to §2, is
`C:\Users\sislam27\AppData\Local\Temp\claude\C--Users-sislam27-Work-Climate-Dynamics-PHD-AOFD-Vallis\db06516f-692b-44c5-90da-838cd62ef79c\scratchpad\v5_narr.txt`.
The first full draft, 3587 words and much too long (about 25 min), is `v5_long.txt` in the same folder.
