# ch00_dot_product_why — "What the dot product measures, and why it multiplies by the other length" (Chapter 0A, version 4)

Version 4 (2026-10-23), rewritten from the user's round-2 feedback on v3 (`reports/ch00_poc_user_feedback.md`, section
"user round 2 on v3", items U-M2.G1–G5 and U-M2.1–U-M2.17; it supersedes U-M.2 length and U-M.3 labels/footnotes).
Voice Kokoro `af_bella`, speed 1.0; music bed unchanged (`tools/music.py`, about −28 LUFS, ducked 5 dB under speech).
Chapter-0 informal voice.

**Measured, not estimated.** `tools/tts.py` dry run of this narration on 2026-10-23 (run v4c on G:,
`aofd-data/scratch/movies/ch00_dot_product_why/dryrun/v4c`; the proposed "vector a " entries applied by hand to the audio
copy): 92 sentences, 498.875 s, self-check diff 0.0 ms, 115 cues (max 42 characters per line, max 15.7 characters per
second, cues 1.44–6.53 s, no one-word second lines). Two sentences were then removed (s10 "With a unit vector it gives a
part directly.", s12 "The two differ because the balloon is carried to places with other temperatures."), using their
measured clip lengths and gaps: **22 scenes, 90 sentences, 1142 words, 489.525 s narration + 2.5-s silent end-card hold
= 492.0 s (8:12), 139.3 words per minute.** Earlier drafts: v4a 1235 words / 544.9 s, v4b 1193 / 515.0 s (too long;
cut to fit the user's "up to about 8 minutes, just over is fine").

### v4 changelog (each user item → the scene(s) that fix it)

| Item | What the user asked | v4 fix | Scenes |
|---|---|---|---|
| U-M2.G1 | No references: no equation labels, book or author names, no footnote strip | Every label pill, every book/author word (screen and narration) and the `footnotes:` block are gone; `footnote_strip: false` and no scene has a `footnote:` key, so the builder drops the Footnote component. Equations stay. The only number drawn is a plain **(1)** on the cosine form, because s06 says "divide both sides of equation one by the length of b". Provenance stays in the storyboard metadata (`vallis_eq`, `page_png`), never drawn. | all; (1) in s04, s06 |
| U-M2.G2 | No "not to scale" badges | `scale_badges: false`; every `exaggeration` entry ends "badge: none". Mixed-unit pictures say so in their own labels (rulers in N and m, a wind map with an m/s axis, brackets with true values). Time-lapse clock chips stay (they tell how many hours pass). | all |
| U-M2.G3 | Scene titles must stand out | New `SceneTitle` band (spec in storyboard `title_treatment:`): full-width top band, accent bar, part kicker in caps, 60-px bold title, growing accent underline, scene counter, 12-frame slide-in; PartCards at the Part 2 and Part 3 openings; all content moved below y 160. | all |
| U-M2.G4 | Explain every new term at first use | vector, components (s02); straight bars = length (s02); θ, cosine (s04); shadow (s06); b̂, unit vector (s07); x̂ (s10); newton, joule, work (s11); air parcel, ∂ "partial", local rate, material derivative (s12); φ, v, advection (s13); isotherm, ∂/∂x, ∂/∂y (s14); ∇ "grad", ∇T, kelvin = °C step (s15) | s02–s15 |
| U-M2.G5 | Narration matches the screen; dense screens get more narration | Every on-screen line is revealed with the sentence that says it (`Reveal n (sentence k)` in each storyboard visual). The dense scenes got more words than v3: shadow 90 (v3 115 incl. b̂, now split over s06 + s07 = 166), work 74 (v3 37), material derivative 75 + 64 (v3 23 + 117), advection number 69 (v3 37). | all |
| U-M2.1 | "5 and 1 are the components of vector a; 1 and 3 of vector b" | Said that way and written that way | s02 |
| U-M2.2 | Definition without the label or the "small number = which part" line; two components; a₁ = 5, b₁ = 1, a₂ = 1, b₂ = 3 on screen | Three-term form shown once ("in space, three products"), a₃b₃ struck out ("our flat arrows: 2 components"), then a₁b₁ + a₂b₂ with the four value tags | s03 |
| U-M2.3 | Delete the labels scene; worked example inside the definition scene | v3 s04 deleted; v3 s05 merged into s03 | s03 |
| U-M2.4 | 0°, 90°, 180°; p prominent and fixed, only q changes | p drawn large and alone at the top centre, then copied unchanged into the three panels ("p stays the same in all three pictures", "only q turns"). **Wording flag:** the user wrote "180°, that is they are parallel"; the movie says **"pointing in opposite directions"** (antiparallel), because "parallel" usually means the same direction. Please confirm. | s05 |
| U-M2.5 | Label the first equation just (1); "divide both sides of (1) by \|b\|" | (1) on the cosine form in s04 ("call this equation one") and as the strip's starting row in s06; narration "Divide both sides of equation one by the length of b" | s04, s06 |
| U-M2.6 | Explain b̂ | Own scene: b shrinks to length 1; card "unit vector b̂: length 1, same direction as b"; b̂ = b/\|b\| | s07 |
| U-M2.7 | Every shadow line labelled; merge 4+5 and 6+7; show b̂ = (1/3.162, 3/3.162) | Strip headed "Computing the shadow of a on b", each row tagged "shadow:"; merged row "shadow = \|a\| cos θ = a·b/\|b\| = 8/3.162 = 2.530" (s06); s07 headed "The same shadow, another way": b̂ = (1/3.162, 3/3.162) = (0.316, 0.949) and merged row "shadow = a·b̂ = 5 × 0.316 + 1 × 0.949 = 2.530" | s06, s07 |
| U-M2.8 | Show the calculation of both shadows | Calculation panels under each plane: (5, 1)·(1, 3)/√10 = 8/3.162 = 2.530 and (1, 3)·(5, 1)/√26 = 8/5.099 = 1.569, then × the other length = 8.000 both ways | s09 |
| U-M2.9 | v = (6, 8) = 6 m/s east, 8 m/s north; x̂ = (1, 0); drop the "wind letter" chip and the badge | Narrated exactly so; legs labelled "6 m/s east", "8 m/s north"; x̂ label "1 eastward, 0 northward" | s10 |
| U-M2.10 | Work: 10-N shadow is a force, only it does work, 50 J, then 100 J; slower | 7 sentences (v3: 4): the upward 17.3-N part does no work; the 10-N shadow drawn on its own as a force; W = 10 N × 5 m = 50 J; × 10 m = 100 J; "twice the distance, twice the work" | s11 |
| U-M2.11 | Material derivative first (two thermometers, air parcel), then Dφ/Dt = ∂φ/∂t + v·∇φ; φ any carried quantity; advection of T or of moisture; no bracket form | s12 teaches the pole, the balloon, the air parcel, ∂ and DT/Dt with no equation; s13 then shows Dφ/Dt = ∂φ/∂t + v·∇φ (bracket-free; identical for a scalar), φ = T or moisture, v·∇T = advection of temperature, v·∇q = advection of moisture | s12, s13 |
| U-M2.12 | ∂/∂x, ∂/∂y, ∇T = (∂T/∂x, ∂T/∂y), isotherm; +1 °C per 100 km east; ∂T/∂y = 0 | s14: isotherms at 100, 200, … 500 km (11–15 °C), walk east (+1 °C per isotherm), walk north (no change, ∂T/∂y = 0); s15: ∇T as the arrow of the two slopes, = (1.00 × 10⁻⁵ K/m, 0), uphill | s14, s15 |
| U-M2.13 | The 4:38 scene needs more narration | 4 long sentences, 69 words (v3: 37): the 5-m/s shadow is the speed straight towards warmer air, the other 8.66 m/s runs along the isotherm, the units cancel, × 3600 | s16 |
| U-M2.14 | Rate in space vs rate in time: clarity | Each column revealed with the sentence that names it; the 18-km step bracketed on the map; no frozen-map claim | s17 |
| U-M2.15 | DT/Dt = 0: clarity | "suppose" chip, unchanging parcel tags, then one move per strip row with its why | s18 |
| U-M2.16 | Explain the shaded area behind the arrow or drop it | **Dropped.** The v3 wedge was drawn, not computed, and did not connect to ∂T/∂t = −v·∇T. **Replaced** by the upwind track: a dashed line from the pole back against the wind with three dots "arrives in 1 h / 2 h / 3 h", each tagged with its present temperature 12.82, 12.64, 12.46 °C (= 13.00 + ∇T·(−v t), a new recorded dot-product call). The clock then runs and the pole's reading steps through exactly those values, so "the air arriving comes from colder places upwind" is shown with numbers. | s19 |
| U-M2.17 | Better final recap | Four rows with icons, one per sentence: shadow × length · the sign · a unit vector gives a component · physics joins a direction with a size (W = 50 J, v·∇T = 0.180 K per hour); links on a separate end card | s21, s22 |
| Length (supersedes U-M.2) | up to about 8 min | 492.0 s measured (8:12) | — |

Memory rule: "air parcel" (a small volume of air that moves with the flow), never "bit of air" (s12, s18).

Not done / for the user: (1) "parallel" vs "opposite directions" at 180° (see U-M2.4). (2) The notebook link
`notebooks/poc_ch00a_dot.html` stays on the end card (P1: that page must exist before publishing).

**Vector letters in the audio.** Kokoro reads a lone "a" as the article. The vector a is spoken only as "vector a " /
"Vector a " / "arrow a " / "Arrow a " (followed by a space) or inside "a dot b". "vector a " and "Vector a " are NEW
lexicon entries (proposed in the storyboard `lexicon_additions`). Captions keep this text.

Lines starting with ">" are notes and are not spoken. Times are scene start–end in the movie (seconds, measured).


## s01_hook
Two arrows in, one number out: the dot product. First what it is, then why it's built this way.

> 19 words · 2 sentences · 0.000–8.475 s (8.5 s, measured).
> Hook in the first 3 s: two arrows grow, the number 8 drops onto the gauge.

## s02_arrows
A vector is an arrow, with a length and a direction. Vector a goes five right and one up; vector b goes one right and three up. Five and one are the components of vector a and one and three are the components of vector b. Pythagoras gives the lengths, written with straight bars: about five point one and three point one six.

> 63 words · 4 sentences · 8.475–33.150 s (24.7 s, measured).
> a = (5, 1), b = (1, 3); |a| = √(5² + 1²) = √26 = 5.099; |b| = √(1² + 3²) = √10 = 3.162.

## s03_definition
Definition one: multiply matching components, then add. In space that's three products; our flat arrows have two components, so two. The first components are five and one; the second, one and three. Five times one, plus one times three: eight, one number, not an arrow.

> 45 words · 4 sentences · 33.150–54.775 s (21.6 s, measured).
> a·b = a₁b₁ + a₂b₂ + a₃b₃ (shown once) → a·b = a₁b₁ + a₂b₂ with a₁ = 5, b₁ = 1, a₂ = 1, b₂ = 3 → 5 × 1 + 1 × 3 = 8.

## s04_cosine
Definition two multiplies the two lengths and the cosine of theta, the angle between the arrows. Cosine depends only on the angle, from minus one to one. Here it's point four nine six, and the product is eight again. Call this equation one.

> 43 words · 4 sentences · 54.775–74.350 s (19.6 s, measured).
> (1) a·b = |a||b| cos θ = 5.099 × 3.162 × cos 60.3° = 5.099 × 3.162 × 0.496 = 8.000; cos 0° = 1, cos 90° = 0, cos 180° = −1.

## s05_angle_cases
Now keep one arrow, p, fixed in all three pictures; only q turns. Same direction, zero degrees: three times two, six, positive. At a right angle, ninety degrees: zero. At one hundred and eighty degrees, pointing in opposite directions: minus six, negative. So the dot product measures how much two arrows point the same way.

> 55 words · 5 sentences · 74.350–100.875 s (26.5 s, measured).
> p = (3, 0) fixed; q = (2, 0), (0, 2), (−2, 0): p·q = 6, 0, −6. 'Opposite directions' (antiparallel), not 'parallel'.

## s06_shadow
Drop a line from the tip of arrow a onto b's line, at a right angle. The stretch it marks off is the shadow of arrow a on b. Arrow a is the long side of a right triangle, so the shadow, next to theta, is its length times cos theta. Divide both sides of equation one by the length of b. It cancels on the right, leaving the shadow: a dot b over the length of b: eight over three point one six two, or two point five three.

> 90 words · 5 sentences · 100.875–133.025 s (32.2 s, measured).
> cos θ = shadow/|a| → shadow = |a| cos θ → (1) ÷ |b| → shadow = |a| cos θ = a·b/|b| = 8/3.162 = 2.530 (v3 lines 4 and 5 merged).

## s07_unit_vector
A second way to the same shadow: divide b by its own length. That's b hat, the unit vector along b: length one, same direction. Its components are one and three, each over three point one six two. Dividing b by a number divides the dot product by it too, so the shadow is a dot b hat. Five times point three one six, plus one times point nine four nine: two point five three again.

> 76 words · 5 sentences · 133.025–163.400 s (30.4 s, measured).
> b̂ = b/|b| = (1/3.162, 3/3.162) = (0.316, 0.949), |b̂| = 1; a·b/|b| = a·b̂; shadow = a·b̂ = 5 × 0.316 + 1 × 0.949 = 2.530 (v3 lines 6 and 7 merged).

## s08_question
So the dot product is the shadow times the length of b. Why multiply by that length? Three reasons.

> 19 words · 3 sentences · 163.400–173.000 s (9.6 s, measured).
> a·b = (shadow of a on b) × |b| = 2.530 × 3.162 = 8.000 (product rectangle).

## s09_reason1_order
Reason one: order. The shadow of arrow a on b is two point five three; of b on arrow a, one point five seven. But times the other arrow's length, both give eight.

> 33 words · 3 sentences · 173.000–187.200 s (14.2 s, measured).
> On screen in full: a·b/|b| = 8/√10 = 2.530; b·a/|a| = 8/√26 = 1.569; 2.530 × 3.162 = 8.000 = 1.569 × 5.099.

## s10_reason2_cheap
Reason two: it's cheap, with no angle and no square root. Take the wind v equals six, eight: six metres per second east, eight north. The unit vector x hat points east: components one and zero. So v dot x hat is six times one plus eight times zero: six, the eastward part.

> 53 words · 4 sentences · 187.200–210.000 s (22.8 s, measured).
> v = (6, 8) m/s, |v| = 10 m/s; x̂ = (1, 0); v·x̂ = 6 × 1 + 8 × 0 = 6 m/s.

## s11_work
Reason three: physics needs both sizes. Pull a sled with twenty newtons, tilted sixty degrees up. The upward part, across the motion, does no work. The part along the ground is the shadow: twenty times cos sixty, ten newtons. That shadow is itself a force, and only it does work. Work, in joules, is that force times the distance: fifty joules over five metres, one hundred over ten. Twice the distance, twice the work.

> 74 words · 7 sentences · 210.000–244.250 s (34.2 s, measured).
> F = 20 N at 60° = (10.0, 17.3) N; along the ground 10.0 N (the shadow), up 17.3 N (no work); W = 10 N × 5 m = 50 J; × 10 m = 100 J.

## s12_parcel
Now the weather. One thermometer is fixed on a pole: its rate is partial T by partial t, the local rate. Partial means only time changes; the place stays fixed. A second one rides a balloon drifting with the wind. It always measures the same air parcel: a small volume of air that moves with the flow. Its rate, capital D T by D t, is the material derivative: the rate following an air parcel.

> 75 words · 6 sentences · 244.250–276.800 s (32.6 s, measured).
> ∂T/∂t = local rate (pole, fixed place); DT/Dt = material derivative (balloon, follows an air parcel). No equation yet (U-M2.11).

## s13_equation
The equation: capital D phi by D t equals partial phi by partial t, plus v dot grad phi. Phi is anything the air carries, like temperature or moisture; v is the wind. The last term is the change from being carried across the map: the advection of phi. For temperature, phi is T, and v dot grad T is the advection of temperature.

> 64 words · 4 sentences · 276.800–303.300 s (26.5 s, measured).
> Dφ/Dt = ∂φ/∂t + v·∇φ → DT/Dt = ∂T/∂t + v·∇T; v·∇q for moisture (muted). No bracket form.

## s14_isotherms
The thin lines are isotherms: lines of equal temperature. Here they run north to south, one every hundred kilometres. Walk east, and each one you cross is one degree warmer. That's partial T by partial x: the change going east only. Walk north, and you stay on one isotherm: partial T by partial y is zero.

> 56 words · 5 sentences · 303.300–329.050 s (25.8 s, measured).
> Isotherms at x = 100, 200, 300, 400, 500 km (11–15 °C); ∂T/∂x = 1 °C per 100 km; ∂T/∂y = 0.

## s15_grad_t
These two slopes are the components of one arrow: grad T. The upside-down triangle is read grad. Here it's ten to the minus five kelvin per metre, and zero. Grad T points uphill, towards warmer air; its length is how steep the map is.

> 44 words · 4 sentences · 329.050–348.325 s (19.3 s, measured).
> ∇T = (∂T/∂x, ∂T/∂y) = (1 °C per 100 km, 0) = (1.00 × 10⁻⁵ K/m, 0); |∇T| = 1.00 × 10⁻⁵ K/m.

## s16_advection_number
Now a wind of ten metres per second blows sixty degrees from grad T. Its shadow on grad T, ten times cos sixty, is five metres per second: the speed straight towards warmer air. The rest of the wind runs along the isotherms. Times the length of grad T, the metres cancel: five times ten to the minus five kelvin per second, or point one eight kelvin per hour.

> 69 words · 4 sentences · 348.325–377.150 s (28.8 s, measured).
> v = 10 m/s at 60° from ∇T = (5.00, 8.66) m/s; shadow 5.00 m/s; 8.66 m/s along the isotherm; v·∇T = 5.00 × 1.00 × 10⁻⁵ = 5.00 × 10⁻⁵ K/s × 3600 = 0.180 K/h.

## s17_space_time
Careful: one degree per hundred kilometres is the map's slope, a rate in space. Point one eight kelvin per hour is a rate in time. Each hour, the air gains eighteen kilometres towards warmth, reaching spots that were point one eight degrees warmer when it set off.

> 47 words · 3 sentences · 377.150–396.550 s (19.4 s, measured).
> 5.00 m/s × 3600 s = 18.0 km towards warmer air (36.0 km along the wind); 18.0 km × 1 °C per 100 km = 0.180 °C.

## s18_label_zero
Now suppose each air parcel keeps its temperature, with no sunshine or mixing. Then the balloon's reading never changes: capital D T by D t is zero, and the pattern slides with the wind. Put zero in, then subtract v dot grad T from both sides. Partial T by partial t equals minus v dot grad T.

> 57 words · 4 sentences · 396.550–421.250 s (24.7 s, measured).
> DT/Dt = ∂T/∂t + v·∇T → 0 = ∂T/∂t + v·∇T → subtract v·∇T → ∂T/∂t = −v·∇T.

## s19_pole_cools
So the pole's thermometer falls, point one eight degrees an hour. Look upwind, where the wind comes from. The air reaching the pole in one hour is there now, point one eight degrees colder; in two hours, point three six. So the pole reads thirteen, then twelve point eight two, then twelve point six four.

> 55 words · 4 sentences · 421.250–444.000 s (22.8 s, measured).
> Upwind dots at pin − v·(1, 2, 3 h) = (282.0, 148.8), (264.0, 117.6), (246.0, 86.5) km; their T now 12.82, 12.64, 12.46 °C; pole 13.00 → 12.82 → 12.64 → 12.46 → 11.92 °C (6 h); balloon 13.00 °C.

## s20_twice_steep
Make the map twice as steep. The wind's shadow is still five metres per second: it belongs to the wind. But v dot grad T doubles, and the pole cools twice as fast. The dot product holds the steepness; the shadow alone doesn't.

> 43 words · 4 sentences · 444.000–462.500 s (18.5 s, measured).
> |∇T| = 2.00 × 10⁻⁵ K/m; shadow 5.00 m/s; v·∇T = 1.00 × 10⁻⁴ K/s = 0.360 K/h; pole 13.00 → 12.64 (1 h) → 10.84 °C (6 h).

## s21_recap
So what does the dot product measure? How much two arrows point the same way, times both their lengths. Its sign says same way, across, or opposite. With a unit vector, it's a component. In physics, it joins a direction with a size: work, and the wind's warming or cooling.

> 50 words · 5 sentences · 462.500–484.900 s (22.4 s, measured).
> Four rows, one per sentence 2–5; no references.

## s22_end
Try it yourself in the vector products lab, and in the notebook.

> 12 words · 1 sentences · 484.900–492.025 s (7.1 s, measured).
> End card + 2.5-s silent hold (speech ends 489.225 s). Links: vector products lab; notebooks/poc_ch00a_dot.html (P1).

> Total: 1142 words · 90 sentences · 489.525 s narration · 492.0 s movie (8:12) · 139.3 words per minute.
