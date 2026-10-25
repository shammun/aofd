# ch00_dot_product_why — "What the dot product measures, and why it multiplies by the other length" (Chapter 0A, version 6)

Version 6 (2026-10-25), from the user's round-6 feedback on v5 fix 4 (`reports/ch00_poc_user_feedback.md`, "user round 6 on v5 fix 4": U-M6.1–12) and the orchestrator's plan `reports/ch00_v6_plan.md` (physics answers §1, scene plan §2, data §3). Voice Kokoro `af_bella`, speed 1.0; music bed unchanged. Chapter-0 informal voice. Scenes not named in the v6 changelog are word-identical to v5 fix 4; only their measured times moved (s00 was added at the front).

**Measured, not estimated (v6).** `tools/tts.py` dry run on 2026-10-25 (G:, `aofd-data/scratch/movies/ch00_dot_product_why/dryrun/v6/run1`; input = this narration, current `movies/lexicon.yaml`, no new entries): **27 scenes, 149 sentences, 2457 words, 986.100 s narration + 2.5-s silent end-card hold = 988.600 s (16:28.60)**; speech alone 922.0 s = 159.9 words per minute while speaking, **149.1 words per minute overall** (limit 150); 242 caption cues, max 15.9 characters per second, max 42 characters per line, ≤ 2 lines; self-check diff 0.0 ms; Kokoro render 730.5 s; warnings: none.

### v6 changelog (each user item → the fix → the scene)

| Item | What the user asked | v6 fix | Scenes |
|---|---|---|---|
| U-M6.1 | s05 first case: 'the other vector, q, points in the same direction as p and has components two and zero' | The user's words: "First, the other vector, q, points in the same direction as p and has components two and zero." The calculation follows as its own sentence ("Three times two plus zero times zero is six, a positive number.") so each caption stays short; 'same direction' keyword on the words | s05 |
| U-M6.2 | s05 second case wording | The user's words verbatim: "In the next case, vector q is at a right angle to p, with components zero and two, and the dot product is zero." The rule sentence after it is kept (user: everything else in s05 is good) | s05 |
| U-M6.3 | New opening frame: big colourful title, catchy animation, then s01 | s00_title: 'The dot product' 150 px teal → gold, 'made easy', 'and how meteorology uses it'; TitleSweep (q sweeps round p, live signed p·q from sweep.json) → mini sliding map with the pole ticking down; one sentence: "In this video, we'll learn the dot product the easy way, and see how meteorology uses it to tell how fast the wind changes the temperature." The one allowed title frame (exception to U-M3.G1) | s00 |
| U-M6.4 | s13 balloon/thermometer icon on ∂φ/∂t | The S1 top-centre balloon icon is deleted; no icon on, over or touching ∂φ/∂t; the balloon stays above Dφ/Dt and the pole icon beside the 'one fixed place' label below | s13 |
| U-M6.5 | s13: not 'where phi is different' | "Advection means being carried along by the flow. So the advection term is the change that comes from being carried into warmer or colder air, or moister or drier air, depending on what phi stands for." Keywords 'warmer · colder', 'moister · drier' | s13 |
| U-M6.6 | s16a: drop 10 × sin 60° = 8.66 m/s from narration and screen | Gone from the voice, the CalcStack, the picture (no along leg) and the equation list; the third sentence now says what the shadow does: "This shadow is the part of the wind that carries air across the isotherms, towards the warmer side." | s16a |
| U-M6.7 | Label the shadow on the picture; curved arrow to 5.00 m/s | 'shadow' label under the band on the map + a gold CurvedLink to '5.00 m/s' in s16a; the same link to the 5.00 m/s factor of v·∇T in s16b | s16a, s16b |
| U-M6.8 | What 0.18 K/h means: rate in time, which parcel, why × 1 h, the sign; check the user's reading | s17_meaning rewritten FORWARD: the balloon's parcel at the pole right now; "Distance is speed times time" (why × 3600 s); 18 km across; "each hundred kilometres east is one degree warmer" → 0.18 degrees; arrives where the map reads 13.18; rate in space × speed = rate in time; "how fast the wind carries the parcel into warmer places"; v·∇T, the advection term; positive because the wind blows partly towards warmer air; same for every parcel. The user's reading ("the wind adds 0.18 K per hour to a parcel") is true only on a frozen map: the movie asks "does the parcel itself get warmer?" and answers with Case 1 (yes, s17b) and Case 2 (no, s18-s19c) | s17, s17b, s19c |
| U-M6.9 | Highlight what 0.18 °C corresponds to, with an arrow to it | Teal 18-km span band (300 → 318 km) with a CurvedLink to '18 km'; gold strip between the 13.00 °C isotherm and the 13.18 °C line with a CurvedLink to '0.18 °C' (camera zoom to 4 px/km so the 18 km is 72 px wide) | s17 |
| U-M6.10 | Show ∂T/∂t negative (colder air arriving) AND the parcel that gains temperature, by how much; verify the sign at ~9:40 | Case 1 (new s17b): frozen map, pole flat, balloon 13.00 → 13.18 → 13.36 → 13.54, DT/Dt = 0 + v·∇T = +0.18 K per hour, "the parcel warms by exactly the advection term". Case 2 (s19a): the colder queued parcels arrive and the pole falls −0.18 K per hour while the balloon stays flat, on one TimeGraph. Sign verified (plan §1): v5's '0.18 degrees colder' was the upwind (pole) view told before the forward (+) view; both are right for different observers, and v6 shows + first | s17b, s19a, s19c |
| U-M6.11 | s18: say the assumption first | "Now for the second case, which we'll follow from now on. We assume the air parcel inside the balloon doesn't change its temperature as it moves with the wind: no sunshine and no mixing. That means the material derivative, capital D T by D t, is zero." Then every other parcel, then the slide (two v5 sentences kept) | s18 |
| U-M6.12 | s19a confusing (rising map dots vs falling bottom row); re-sequence | Bottom row deleted. Order: warmer ahead / colder behind (upwind) → the parcel that will arrive in 1 h, 18 km across on the colder side, 12.82 °C → the ones for 2 h and 3 h → "Now let's start the clock" → each parcel arrives and its number moves into the pole readout and onto the graph → "Colder and colder air keeps arriving, so the fixed thermometer's reading falls by point one eight degrees every hour" → balloon line flat at 13 | s19a |
| plan s19c | s19b/s19c keep their spirit and tie back to the two cases | s19b word-identical. s19c keeps its first three and its 'They cancel' sentences; adds "In the first case, the map stood still, so the local rate was zero, and the parcel warmed by point one eight.", "In our second case, every place has cooled…" and "So the advection term is the same in both cases; only the local rate is different." Two Balance rows | s19c |

Unchanged in v6 (word-identical, same visuals): s01–s04, s06–s12, s14, s15, s16b (narration; visual gains the CurvedLink), s19b (narration; the graph thumbnail stays), s20, s21, s22.

### Earlier versions (history)

Version 5 (2026-10-24), rewritten from the user's round-3 feedback on v4 (`reports/ch00_poc_user_feedback.md`, "user round 3 on v4": U-M3.G1–G6, U-M3.1–24 and the decisions of 2026-10-24, including the correction that the book is not named in the ending), using `reports/ch00_v5_analysis_narration.md`, `…_visual.md` and `…_physics.md`. Voice Kokoro `af_bella`, speed 1.0; music bed unchanged (`tools/music.py`, about −28 LUFS, ducked 5 dB under speech). Chapter-0 informal voice.

**Measured, not estimated.** `tools/tts.py` dry run v5b on 2026-10-24 (G:, `aofd-data/scratch/movies/ch00_dot_product_why/dryrun/v5b`; the current `movies/lexicon.yaml`, no new entries needed): **25 scenes, 114 sentences, 1809 words, 731.250 s narration + 2.5-s silent end-card hold = 733.750 s (12:13.75)**; speech alone 680.3 s = 159.5 words per minute while speaking, 147.9 words per minute overall (limit 150); 177 caption cues, max 16.1 characters per second; self-check diff -0.0 ms; Kokoro render 842.8 s. Earlier runs: v5a (1833 words, 739.02 s narration, 741.5 s movie, 181 cues: over the window; about 25 words of wording trims and the corrected ending gave v5b).

**Fix loop 1 (review 5, 2026-10-24).** Seven sentences reworded for natural, complete speech (S12: s05 ×3, s15, s19c split into two, s20 + one sentence) and S6 (s19a "start the clock again"). Real `tools/tts.py` run (v5fix1): **25 scenes, 116 sentences, 1856 words, 749.300 s narration + 2.5-s hold = 751.800 s (12:31.80)**; speech 697.6 s; 148.1 words per minute overall; 182 cues; self-check diff 0.0 ms; Kokoro render 473.7 s.

**Fix loop 3 (user round 4, U-M4.1–3 + review 5c S1–S4, 2026-10-25).** s10 rewritten so the goal comes first: the wind is introduced as blowing *towards* the north-east at ten metres per second, then as v with components six and eight (user correction: its eastward part is not named before the question), then "How much of this wind blows towards the east?", the dot product with x hat, the calculation, and only then "So six metres per second is the eastward part of the wind" plus one sentence that a dot product with a unit vector picks out a part (U-M4.1); the wind picture is on screen from the first second (U-M4.2). s16b gains one sentence with |∇T| by Pythagoras, shown before it is used; s20 gains one for the steep map (U-M4.3). Real `tools/tts.py` run (v5fix3): **25 scenes, 122 sentences, 1960 words, 788.375 s narration + 2.5-s hold = 790.875 s (13:10.88)**; speech 734.6 s; 148.7 words per minute overall; 192 cues; self-check diff 0.0 ms; Kokoro render 619.6 s.

**Fix loop 4 (user round 5, U-M5.1–2, 2026-10-25).** Narration only, no other layout changes (review 5d T1–T4 not done, user: "all else are good enough"). s05 gains "When two vectors point in opposite directions, their dot product is negative." before the closing sentence (U-M5.2); s12's first use becomes "…the local rate, written partial capital T by partial small t. Here capital T stands for temperature, and small t for time." (U-M5.1); every other sentence word-identical. Real `tools/tts.py` run (v5fix4): **25 scenes, 124 sentences, 1985 words, 800.075 s narration + 2.5-s hold = 802.575 s (13:22.58)**; speech 745.6 s; 148.4 words per minute overall; 194 cues; self-check diff 0.0 ms; Kokoro render 683.5 s.

#### v5 changelog (each user item → the fix → the scene)

| Item | What the user asked | v5 fix | Scenes |
|---|---|---|---|
| U-M3.G1 | No headings, scene titles, part cards or "n/22" counter | SceneTitle band, kicker, PartCards and counter deleted (storyboard `composition_changes`); the freed band goes to larger pictures (content y 40–860) and a type scale with a 44-px floor | all |
| U-M3.G2 | Screen = keywords, symbols, numbers; voice = explanation; no boxes | Every `visual` lists only symbols, numbers and one-word keywords; Chip/Card/Slots/panels/boxed rows deleted; emphasis by colour, size, gold pointers (Keyword) and underbraces (BraceNote); only box kept: the s03 component tags | all |
| U-M3.G3 | Natural, unhurried full sentences; natural transitions; no fragments | No "two arrows in…", "definition one/two", "reason one: order" or "X: Y, positive" chains; every scene opens with a bridge ("Now let's look at how the angle…", "The first is…", "Now let's look at how the dot product is used in weather.") | all |
| U-M3.G4 | Remove "1 grid square = 1 unit" everywhere | GridNote and the s10 m/s variant deleted; never spoken | s02–s10 |
| U-M3.G5 | Explain advection, "uphill", "local rate" in plain words | local rate = "how fast its temperature changes over time" at the fixed pole (s12); advection = "being carried along by the flow" (s13); "uphill" removed → "the way the temperature increases fastest" (s15) | s12, s13, s15 |
| U-M3.G6 | No links or paths on screen | End card says "on the website that goes with this video" in words only; no URL, path or address drawn | s22 |
| U-M3.1 | Open with "What is the dot product?", no agenda box, no heading | Opens with the question; agenda box, funnel and gauge gone | s01 |
| U-M3.2 | "vector = an arrow…" without a box | Keyword "vector" in large warm-white type with pointers "length" → bracket, "direction" → arrowhead | s02 |
| U-M3.3 | Just a = (5, 1) + "components" with two arrows to 5 and 1; same for b | Exactly that (Keyword with two pointers); the voice says the full sentence | s02 |
| U-M3.4 | Keep Pythagoras; \|a\| = length of a without a box | Pythagoras lines kept; BraceNote option A: underbrace "length of a" under \|a\| that fades after 2.5 s | s02 |
| U-M3.5 | Rephrase the 3-D remark slowly, then strike a₃b₃ | "Arrows in three-dimensional space have three components, along x, y and z… Ours lie flat, in two dimensions, so the third term drops out"; x, y, z appear under the terms; the strike lands on "drops out" | s03 |
| U-M3.6 | a = (5, 1), b = (1, 3) under the picture; no grid note | Both at 54 px under the picture from s02 to s07 | s02–s07 |
| U-M3.7 | Keep the component tags; "eight" as a full sentence with scalar | Tags kept; "Adding them, a dot b equals eight: a single number, not an arrow. A number like this is called a scalar, so the dot product is also called the scalar product." + keyword "scalar" → 8 | s03 |
| U-M3.8 | No "definition two"; natural transition | "Now let's look at how the angle between the two arrows plays a role." No counter | s04 |
| U-M3.9 | Show the √ calculations of \|a\|, \|b\| in s04 | CalcStack √(5² + 1²) = √26 = 5.099, √(1² + 3²) = √10 = 3.162, then the product (≈ 8, R1) | s04 |
| U-M3.10 | "Keep one arrow fixed… change only the other"; p's components; each case in full with its calculation | User wording; "The fixed arrow, p, has components three and zero" (movie's p kept); three full cases with 3×2 + 0×0 = 6, 3×0 + 0×2 = 0, 3×(−2) + 0×0 = −6; "When two vectors are at right angles, their dot product is zero"; "pointing in the opposite direction"; closing sentence kept | s05 |
| U-M3.11 | q labels at the arrow tips | TipLabel at each q tip (above in panels 1–2, left of the tip in panel 3) | s05 |
| U-M3.12 | Work: F and d are vectors; 5 m → 50 J, doubled → doubled; shadow alone is not the work | "a force vector, F… a displacement vector, d"; "fifty joules if d is five metres. If d doubles to ten metres, the work doubles to one hundred joules, but the shadow is still ten newtons. So the shadow alone can't give the work: we must multiply by the length of d…"; W = (\|F\| cos θ)\|d\| with underbraces | s11 |
| U-M3.13 | Transition to weather; two thermometers in full; keep the "partial" sentence | "Now let's look at how the dot product is used in weather." Pole thermometer → local rate ∂T/∂t; "Partial means only time changes; the place stays fixed." kept; balloon in one air parcel → DT/Dt | s12 |
| U-M3.14 | Say what the equation is before reading it; left/right meaning; material ≠ partial; define advection | Opens "Here is the equation the balloon's thermometer obeys. It tells us how anything the air carries… changes as we follow an air parcel." Never read as a symbol string. Left = following the parcel; right = one fixed place + advection term; advection defined; "The left side is called the material derivative. It isn't a partial derivative, because the place moves with the parcel: it's the partial derivative plus the advection term." (decision Q4) | s13 |
| U-M3.15 | Remove the faded box leaking into s13 | Root cause: s13's own dimmed map + veil (TSX L1157–1160, v4 storyboard L503/L528). Deleted; s13 has no map | s13 |
| U-M3.16 | Build the map in words first, then name isotherms; keep ∂T/∂x, ∂T/∂y animation | Rule east → rule north → "Join the places with the same temperature right now…" (lines draw only then) → "These are called isotherms." Walker animation and both partials kept | s14 |
| U-M3.17 | No "uphill" | "It points the way the temperature increases fastest: straight across the isotherms, towards warmer air." | s15 |
| U-M3.18 | What 0.18 K/h means; where 8.66 m/s comes from and why it does nothing | s16a: 10 × cos 60° = 5 m/s across, 10 × sin 60° = 8.66 m/s along, "moving along an isotherm brings no temperature change" (8.66 × 0 = 0). s16b: the unit chain to 0.18 K per hour, named "the advection term". s17: whose change and where: "a rate in time"; the pole's air comes from upwind; the air reaching it in an hour is 18 km upwind across the isotherms, 0.18 °C colder | s16a, s16b, s17 |
| U-M3.19a | Are the isotherms a snapshot; do they change? | s14 "the same temperature right now"; s17 snapshot marker (decision Q3) + "But the snapshot doesn't stay still"; s18 "the whole pattern of isotherms slides with the wind… east, eighteen kilometres every hour" (visible slide, precomputed) | s14, s17, s18 |
| U-M3.19b | Colder air arrives from the lower left (upwind) | s17 "Its air comes from upwind, where the wind comes from: down and to the left, on the colder side"; s19a "That's the colder air from upwind arriving" | s17, s19a |
| U-M3.19c | Pole falls 0.18 K/h while the balloon stays 13 °C; no "gains towards warmth" | One clock: pole 13 → 12.82 → 12.64 → 12.46, balloon 13.00 (s19a). The v4 sentence is gone; no thermometer is ever said to warm | s19a, s19c |
| U-M3.20 | DT/Dt = 0 ⇒ ∂T/∂t = −v·∇T ⇒ pole falls; cancellation +0.18 / −0.18; keep the sliding isotherms | Physics story W1–W11: one assumption (s18), pole first (s17, s19a), then the equation with the sign (s19b: v·∇T = +0.18, "the minus sign makes it a fall of point one eight at the fixed thermometer, as colder air is carried in"), then the balance as bookkeeping (s19c: +0.18 advection term, −0.18 local rate, they cancel) | s18–s19c |
| U-M3.21 | Twice as steep, concretely, with the calculation; "twice as fast" | "one degree every fifty kilometres, instead of every hundred… grad T doubles, to two times ten to the minus five kelvin per metre. The wind's shadow is still five metres per second. But the dot product doubles, to point three six kelvin per hour, so the fixed thermometer cools twice as fast." + the sled link | s20 |
| U-M3.22 | Recap: spell out the three signs; one idea per sentence | Seven sentences, one per idea; "When the arrows point the same way, it's positive. At right angles, it's zero. In opposite directions, it's negative." One screen beat per sentence | s21 |
| U-M3.23 | End card in words, no links | "The notebook for this dot product, and the notebooks for the other maths concepts, are on the website that goes with this video." The lab is **not** mentioned (user's second correction, 2026-10-24) | s22 |
| U-M3.24 | No "Thanks for watching"; a series of related maths tutorials; who they are for | "This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas." **No book name** (user correction 2026-10-24: U-M2.G1 holds without exception); no lab (second correction) | s22 |
| Decision: ~12 min | Trim set T applied; nothing taught cut | T1 (s01), T2 (s08), T3 (s12), T4 (s13), T5 (s15), T6 (s17), T7 (s20), T9 (s22) applied as written or in spirit; T8/T10/T11 folded into rewrites; further trims were wording only (merged clauses, no repeated sentences) | — |
| Decision: keep b̂ | s07 restored in the v5 style | Narration from the narration report §4, tightened; b̂ = (1/3.162, 3/3.162) = (0.316, 0.949); a·b̂ ≈ 2.53 (R2) | s07 |
| Decision: splits | s16 → s16a + s16b; s19 → s19a + s19b + s19c | s19 is split three ways to follow the physics story order (pole and balloon on one clock → the equation → the balance) | s16a–s19c |
| fix loop 3 / U-M4 | U-M4.1 s10 unnatural (answer only at the end); user correction: don't name the eastward part before asking; U-M4.2 empty left half for ~7 s; U-M4.3 \|∇T\| used without its calculation; review 5c S1–S4 | s10: goal first ("Suppose the wind blows towards the north-east at ten metres per second. Written as a vector, v has components six and eight. How much of this wind blows towards the east?"), then x hat, v·x̂ = 6×1 + 8×0 = 6, then "So six metres per second is the eastward part of the wind" and "a dot product with a unit vector picks out the part of v along it"; leg labels and the shadow band only after the result; picture from frame 4. s16b/s20: \|∇T\| = √((∂T/∂x)² + (∂T/∂y)²) = √((1.00 × 10⁻⁵)² + 0²) = 1.00 × 10⁻⁵ K/m and √((2.00 × 10⁻⁵)² + 0²) = 2.00 × 10⁻⁵ K/m with one spoken sentence each (recorded `fluidpy.geo.vectors.norm` calls + CHECK rows). S1 '18 km' at the map top left of the ghost line; S2 '36 km along the wind' left of the upwind track; S3 '15 °C' tag left of the walker; S4 '13 °C' tag 30 px higher | s10, s14, s16a, s16b, s17, s18, s20 |
| fix loop 4 / U-M5 | U-M5.1 "partial T by partial t" is ambiguous when spoken; U-M5.2 state the opposite-directions rule after "minus six, a negative number" | s12: "written partial capital T by partial small t. Here capital T stands for temperature, and small t for time." + keywords 'T = temperature', 't = time' (54 px, no box) beside ∂T/∂t, sliding under 'following the parcel' for DT/Dt; later uses (s14 ∂T/∂x, s19b) unchanged. s05: "When two vectors point in opposite directions, their dot product is negative." with 'opposite' and 'negative' pulsing on the words; the closing sentence kept | s05, s12 |
| Physics R1, R2 | Rounded factors shown with "= 8.000", "= 2.530" | "≈ 8" (s04, s08, s09) and "≈ 2.53" (s07); new display checks N1, N2 | s04, s07–s09 |
| Physics W1–W14 | Misleading wordings | W1/W2 frozen-map "parcel meets" gone (s17 is pole-first and marked as a snapshot); W4 "steep" not used; W5 "the wind is the same everywhere" said; W6 "at sixty degrees to grad T"; W7 kelvin step said; W8 recap says "how fast the wind changes the temperature at a fixed place"; W9 "the one carrying our balloon"; W11 "right now"; W12 shift and far point moved into data; W13 = R1/R2; W14 one clock | s14–s21 |

Memory rules applied (v6 unchanged; new in v6: rate in space, rate in time, frozen map, queued parcels, graph): "air parcel" (a small volume of air that moves with the flow), never "bit of air" (s12, s18); "pointing in the opposite direction(s)" at 180° (s04, s05, s21); no equation labels, footnotes, "not to scale" badges or book names; every new symbol is explained at first use (vector, components, \|a\|, x y z, scalar, θ, cos, p q, shadow, b̂, unit vector, x̂, F, d, newton, joule, work, ∂T/∂t, local rate, partial, air parcel, DT/Dt, φ, v, grad, advection, material derivative, isotherm, ∂/∂x, ∂/∂y, ∇T, kelvin step, upwind).

**Vector letters in the audio.** Kokoro reads a lone "a" as the article. The vector a is spoken only as "vector a "/"Vector a " + a word, or inside "a dot b" (existing lexicon entries). No new lexicon words: advection, Pythagoras', scalar, sine, isotherm(s), grad, phi, x hat, b hat, newtons, joules, upwind, partial and capital D were all spoken in this run (listen-check them in the final render).

Lines starting with ">" are notes and are not spoken. Times are the measured scene start–end (s).

## s00_title
In this video, we'll learn the dot product the easy way, and see how meteorology uses it to tell how fast the wind changes the temperature.

> 26 words · 1 sentences · 0.300–10.425 s (10.1 s; speech 9.3 s) · 0:00.30–0:10.43 (measured) · **new in v6**.
> Screen: 'The dot product' (150 px, teal → gold), 'made easy', 'and how meteorology uses it'; TitleSweep: q sweeps round p with the live signed 'p·q' and its shadow band; then a mini map with sliding isotherms and the pole readout 13.00 → 12.82 °C.

## s01_hook
What is the dot product? Let's see what it is, why it's built this way, and what it tells us about the wind.

> 23 words · 2 sentences · 10.425–18.875 s (8.4 s; speech 7.3 s) · 0:10.43–0:18.88 (measured).
> Screen: a, b grow from frame 0; 'a · b' (128 px) then '= 8'; faint map thumbnail on 'about the wind'.

## s02_arrows
A vector is an arrow, with a length and a direction. Vector a goes five steps right and one up, and vector b goes one right and three up. These numbers are called components: five and one are the components of vector a and one and three are those of vector b. Pythagoras' theorem gives their lengths, written with two straight bars: about five point one and three point one six.

> 71 words · 4 sentences · 18.875–46.600 s (27.7 s; speech 25.9 s) · 0:18.88–0:46.60 (measured).
> Screen: 'vector' + 'length' / 'direction' pointers; a = (5, 1), b = (1, 3) each with 'components' pointing to the two numbers; |a| (underbrace 'length of a') = √(5² + 1²) = √26 = 5.099; |b| = √(1² + 3²) = √10 = 3.162.

## s03_definition
So how do we find the dot product? We multiply the matching components, and then add. Arrows in three-dimensional space have three components, along x, y and z, so we'd add three products. Ours lie flat, in two dimensions, so the third term drops out. The first components give five times one, which is five, and the second give one times three, which is three. Adding them, a dot b equals eight: a single number, not an arrow. A number like this is called a scalar, so the dot product is also called the scalar product.

> 96 words · 7 sentences · 46.600–87.250 s (40.6 s; speech 37.8 s) · 0:46.60–1:27.25 (measured).
> Screen: a·b = a₁b₁ + a₂b₂ + a₃b₃ with x, y, z; a₃b₃ struck on 'drops out'; gold 'first / second components' tags (kept); 5 × 1 + 1 × 3 = 8; 'scalar' → 8. a = (5, 1), b = (1, 3) under the picture.

## s04_cosine
Now let's look at how the angle between the two arrows plays a role. The dot product can also be written as the two lengths times the cosine of theta, the angle between them. The cosine is one when two arrows point the same way, zero at a right angle, and minus one when they point in opposite directions. Here theta is about sixty degrees, with a cosine of about point five. Multiplied out, that's eight again, and we'll call this equation one.

> 83 words · 5 sentences · 87.250–119.600 s (32.3 s; speech 30.1 s) · 1:27.25–1:59.60 (measured).
> Screen: a·b = |a| |b| cos θ (1); cos 0° = 1, cos 90° = 0, cos 180° = −1; |a| = √26 = 5.099, |b| = √10 = 3.162; θ = 60.3°, cos θ = 0.496; 5.099 × 3.162 × 0.496 ≈ 8 (R1).

## s05_angle_cases
Let's keep one arrow fixed in all three pictures, and change only the other one. The fixed arrow, p, has components three and zero. First, the other vector, q, points in the same direction as p and has components two and zero. Three times two plus zero times zero is six, a positive number. In the next case, vector q is at a right angle to p, with components zero and two, and the dot product is zero. In general, whenever two vectors are at right angles, their dot product is zero. Last, q has components minus two and zero, pointing in the opposite direction: three times minus two is minus six, a negative number. When two vectors point in opposite directions, their dot product is negative. So the dot product measures how much two arrows point the same way.

> 138 words · 9 sentences · 119.600–176.950 s (57.3 s; speech 53.8 s) · 1:59.60–2:56.95 (measured) · **changed in v6**.
> Screen: p = (3, 0) large; q = (2, 0) / (0, 2) / (−2, 0) at the q tips; 'same direction'; 3×2 + 0×0 = 6 positive; 3×0 + 0×2 = 0; 3×(−2) + 0×0 = −6 negative. Reveals re-tied to the new sentences.

## s06_shadow
Now let's find a picture for the dot product. From the tip of vector a we drop a line onto b's line, at a right angle. The piece it marks off is called the shadow of vector a on b. In this right triangle, the shadow is the length of vector a times cos theta. Divide both sides of equation one by the length of b, and only the shadow is left on the right: eight over three point one six, or two point five three.

> 86 words · 5 sentences · 176.950–207.850 s (30.9 s; speech 28.7 s) · 2:56.95–3:27.85 (measured).
> Screen: drop-line, 'shadow' pointer; cos θ = shadow/|a| → shadow = |a| cos θ → (1) ÷ |b| → 8 / 3.162 = 2.530.

## s07_unit_vector
There's another way to reach the same shadow. Divide b by its own length to get b hat, the unit vector along b: length one, same direction. Its components are one and three, each divided by three point one six. Dividing b by its length divides the dot product by it too, so a dot b hat is the shadow itself: two point five three again.

> 66 words · 4 sentences · 207.850–234.000 s (26.2 s; speech 24.3 s) · 3:27.85–3:54.00 (measured).
> Screen: b shrinks to b̂ (length 1); 'unit vector'; b̂ = (1/3.162, 3/3.162) = (0.316, 0.949); a·b̂ = 5 × 0.316 + 1 × 0.949 ≈ 2.53 (R2).

## s08_question
So the dot product is the shadow times the length of b. But why not stop at the shadow? There are three good reasons.

> 24 words · 3 sentences · 234.000–244.000 s (10.0 s; speech 8.5 s) · 3:54.00–4:04.00 (measured).
> Screen: product rectangle; a·b = (|a| cos θ)|b| with underbraces 'shadow', 'length of b'; '× |b| ?'.

## s09_reason1_order
The first is that the order shouldn't matter. The shadow of vector a on b is two point five three, but the shadow of b on vector a is one point five seven. Multiply each by the length of the arrow it falls on, and both give eight.

> 48 words · 3 sentences · 244.000–262.200 s (18.2 s; speech 16.7 s) · 4:04.00–4:22.20 (measured).
> Screen: 8 / 3.162 = 2.530 and 8 / 5.099 = 1.569; × the other length ≈ 8 both ways; a·b = b·a.

## s10_reason2_cheap
The second reason is practical: it's quick to calculate, with no angle and no square root. Suppose the wind blows towards the north-east at ten metres per second. Written as a vector, v has components six and eight. How much of this wind blows towards the east? To find out, we take the dot product of v with the unit vector pointing east, x hat, whose components are one and zero. Then v dot x hat is six times one, plus eight times zero, which is six. So six metres per second is the eastward part of the wind. It's simply the first component: a dot product with a unit vector picks out the part of v along it.

> 119 words · 8 sentences · 262.200–309.075 s (46.9 s; speech 43.6 s) · 4:22.20–5:09.07 (measured).
> Screen (U-M4.1/U-M4.2): the wind picture (grid, 'east', 'north', teal v) on the left from the first second; right: 'no angle · no √' with 5×1 + 1×3 and |a| |b| cos θ; then '10 m/s' and 'north-east' at the arrow; 'v = (6, 8) m/s' (tip and maths zone) with unlabelled dashed legs; 'how much east?' pointing at the east axis; x̂ = (1, 0); v·x̂ = 6×1 + 8×0 = 6 m/s; only then the eastward shadow band, '6 m/s east' and 'eastward part'; 'the first component' → the 6 in v = (6, 8).

## s11_work
The third reason is that physics often needs both sizes. Pull a sled with a force vector, F, of twenty newtons, tilted sixty degrees up, while it moves along a displacement vector, d. The upward part of the pull does no work; the part along the ground, the shadow of F on d, is ten newtons. Work, in joules, is that force times the distance: fifty joules if d is five metres. If d doubles to ten metres, the work doubles to one hundred joules, but the shadow is still ten newtons. So the shadow alone can't give the work: we must multiply by the length of d, and the dot product does exactly that.

> 115 words · 6 sentences · 309.075–353.925 s (44.9 s; speech 42.3 s) · 5:09.07–5:53.93 (measured).
> Screen: F = 20 N (force), d = 5 m (displacement); shadow = 20 × cos 60° = 10 N; 17.3 N dimmed; W = 10 N × 5 m = 50 J → 10 m: 100 J; W = (|F| cos θ)|d| with 'shadow', 'length of d'.

## s12_parcel
Now let's look at how the dot product is used in weather. Imagine one thermometer fixed at one place, so it never moves: we'll call it the fixed thermometer. How fast its temperature changes over time is called the local rate, written partial capital T by partial small t. Here capital T stands for temperature, and small t for time. Partial means only time changes; the place stays fixed. A second thermometer rides a balloon drifting with the wind, inside one air parcel: a small volume of air that moves with the flow. Its rate, following the air parcel, is written capital D T by D t.

> 97 words · 7 sentences · 353.925–395.450 s (41.5 s; speech 38.6 s) · 5:53.93–6:35.45 (measured).
> Screen: map without isotherms; pole 'fixed place', ∂T/∂t 'local rate', 'time changes · place fixed'; balloon + 'air parcel'; DT/Dt 'following the parcel'.

## s13_equation
Here is the equation the balloon's thermometer obeys. It tells us how anything the air carries, called phi, like temperature or moisture, changes as we follow an air parcel. On the left is the change following the parcel. On the right is the change at one fixed place, plus a term with v, the wind, and grad, which we'll meet soon. Advection means being carried along by the flow. So the advection term is the change that comes from being carried into warmer or colder air, or moister or drier air, depending on what phi stands for. The left side is called the material derivative. It isn't a partial derivative, because the place moves with the parcel: it's the partial derivative plus the advection term. For temperature, that term is v dot grad T, and its dot is our dot product.

> 141 words · 9 sentences · 395.450–452.950 s (57.5 s; speech 53.9 s) · 6:35.45–7:32.95 (measured) · **changed in v6**.
> Screen: Dφ/Dt = ∂φ/∂t + v·∇φ built, not read aloud, with NO icon on ∂φ/∂t; φ: T, moisture; underbraces 'following the parcel' · 'one fixed place' · 'advection'; 'warmer · colder', 'moister · drier'; 'material derivative' → D/Dt; D/Dt = ∂/∂t + advection; DT/Dt = ∂T/∂t + v·∇T with the dot = 'dot product'.

## s14_isotherms
To see it at work, picture a map where the temperature rises one degree for every hundred kilometres east, and doesn't change as you walk north. Join the places with the same temperature right now, and you get straight north to south lines, one every hundred kilometres. These are called isotherms. Walk east, and each isotherm you cross is one degree warmer: that's partial T by partial x, the change going east only. Walk north, and you stay on one isotherm, so partial T by partial y is zero.

> 89 words · 5 sentences · 452.950–489.500 s (36.6 s; speech 34.4 s) · 7:32.95–8:09.50 (measured).
> Screen: walker '+1 °C' every 100 km east, 'no change' north; isotherms drawn only on 'Join the places…'; 'isotherm'; ∂T/∂x = 1 °C/100 km; ∂T/∂y = 0.

## s15_grad_t
These two rates form one arrow: the temperature gradient, read grad T. A kelvin step is the same size as a degree Celsius step, so grad T is ten to the minus five kelvin per metre going east, and zero going north. It points the way the temperature increases fastest: straight across the isotherms, towards warmer air.

> 57 words · 3 sentences · 489.500–513.700 s (24.2 s; speech 22.7 s) · 8:09.50–8:33.70 (measured).
> Screen: ∇T = (∂T/∂x, ∂T/∂y), 'grad'; 1 °C/100 km = 1 K/10⁵ m; ∇T = (1.00 × 10⁻⁵ K/m, 0); 'towards warmer'.

## s16a_wind_parts
Now a wind blows across the map, the one carrying our balloon: ten metres per second, at sixty degrees to grad T. Its shadow on grad T, ten times cos sixty, is five metres per second, straight across the isotherms. This shadow is the part of the wind that carries air across the isotherms, towards the warmer side.

> 58 words · 3 sentences · 513.700–538.050 s (24.3 s; speech 22.9 s) · 8:33.70–8:58.05 (measured) · **changed in v6**.
> Screen: v = 10 m/s at 60°; shadow band labelled 'shadow' on the picture; 10 × cos 60° = 5.00 m/s 'across'; CurvedLink 'shadow' → 5.00 m/s; 'towards warmer'. No 8.66.

## s16b_advection_number
The length of grad T, by Pythagoras, is the square root of ten to the minus five squared, plus zero squared: just ten to the minus five kelvin per metre. So v dot grad T is the wind's shadow times the length of grad T: five metres per second times ten to the minus five kelvin per metre. The metres cancel, leaving five times ten to the minus five kelvin per second, or point one eight kelvin per hour.

> 79 words · 3 sentences · 538.050–568.675 s (30.6 s; speech 29.1 s) · 8:58.05–9:28.67 (measured).
> Screen: |∇T| = √((∂T/∂x)² + (∂T/∂y)²) = √((1.00 × 10⁻⁵)² + 0²) = 1.00 × 10⁻⁵ K/m first; then v·∇T = (|v| cos θ)|∇T| = 5.00 m/s × 1.00 × 10⁻⁵ K/m with a CurvedLink from the map's 'shadow' to 5.00 m/s (v6); (m/s)(K/m) with m struck; × 3600 s = 0.18 K per hour, 'advection term'.

## s17_meaning
What does point one eight kelvin per hour mean? Let's follow the balloon's air parcel, which is at the fixed thermometer right now. The wind carries it straight across the isotherms at five metres per second, the wind's shadow. Distance is speed times time, so in one hour, three thousand six hundred seconds, it moves eighteen kilometres across them. On the map as it is right now, each hundred kilometres east is one degree warmer, so eighteen kilometres is worth point one eight degrees. So in one hour, the wind carries the parcel to a place where the map reads thirteen point one eight. One degree per hundred kilometres is a rate in space: how the temperature changes with distance. Multiply it by a speed in kilometres per hour, and you get degrees per hour: a rate in time. So point one eight kelvin per hour is how fast the wind carries the parcel into warmer places. That's v dot grad T, the advection term. It's positive because the wind blows partly towards warmer air, and it's the same for every air parcel here, because the wind and the map are the same everywhere. But does the parcel itself get warmer? That depends on what the map does, so let's look at two cases.

> 213 words · 13 sentences · 568.675–653.575 s (84.9 s; speech 79.9 s) · 9:28.67–10:53.58 (measured) · **new in v6**.
> Screen: snapshot corners + 't = 0 h'; camera zoom to 4 px/km; balloon's parcel at the pole; 1-h path; teal 18-km span (300 → 318 km) with CurvedLink to '5.00 m/s × 3600 s = 18 km'; gold strip 13.00 → 13.18 °C with CurvedLink to '18 km × 1 °C/100 km = 0.18 °C'; ghost balloon 13.18 °C; 'space' / 'time'; (°C/km)(km/h) = °C/h; v·∇T = +0.18 K per hour 'advection term'; '?' → 'map frozen' | 'map slides'.

## s17b_frozen
In the first case, imagine the map stays frozen, because the sun keeps every place at exactly its temperature. Then the fixed thermometer always reads thirteen degrees, so its local rate, partial T by partial t, is zero. The balloon, though, reads the map wherever the wind takes it: thirteen point one eight after one hour, thirteen point three six after two, and thirteen point five four after three. Its reading climbs by point one eight degrees every hour, because the wind keeps carrying it into warmer places. In our equation, capital D T by D t is zero plus v dot grad T: plus point one eight kelvin per hour. On the graph, the fixed thermometer's line stays flat, while the balloon's line climbs. So when the map is frozen, the parcel warms by exactly the advection term.

> 137 words · 7 sentences · 653.575–709.975 s (56.4 s; speech 53.5 s) · 10:53.58–11:49.98 (measured) · **new in v6**.
> Screen: sun glyph + 'map frozen'; isotherms still; marks 13.18 / 13.36 / 13.54 °C; pole 13.00 °C, ∂T/∂t = 0 'local rate'; clock 0 → 3 h, balloon readout 13.18, 13.36, 13.54 on the spoken numbers; TimeGraph: pole flat, balloon climbing, '+0.18' steps; DT/Dt = ∂T/∂t + v·∇T = 0 + 0.18 K per hour with underbraces 'local rate' / 'advection term'.

## s18_keeps_temperature
Now for the second case, which we'll follow from now on. We assume the air parcel inside the balloon doesn't change its temperature as it moves with the wind: no sunshine and no mixing. That means the material derivative, capital D T by D t, is zero. Every other air parcel keeps its temperature too. And since the air carries its temperature along, the whole pattern of isotherms slides with the wind. Our wind is the same everywhere, so the lines move east, eighteen kilometres every hour.

> 87 words · 6 sentences · 709.975–747.050 s (37.1 s; speech 34.5 s) · 11:49.98–12:27.05 (measured) · **changed in v6**.
> Screen: zoom back to the full map; 'map slides'; balloon 13.00 °C, 'keeps its temperature', 'no sun · no mixing'; DT/Dt = 0 'material derivative'; tagged parcels keep their numbers; isotherms slide (precomputed); '18 km' shift bracket at 1 h.

## s19a_pole_cools
Now let's set the clock back to zero and watch the fixed thermometer. Ahead of the wind it's warmer, so behind it, upwind, where the wind comes from, it's colder. The air that will reach the fixed thermometer in one hour is now eighteen kilometres across the isotherms on the colder side, at twelve point eight two degrees. Behind it waits the air that will arrive in two hours, at twelve point six four, and in three hours, at twelve point four six. Now let's start the clock. One by one, each air parcel reaches the fixed thermometer and brings its temperature with it: twelve point eight two after one hour, twelve point six four after two, and twelve point four six after three. Colder and colder air keeps arriving, so the fixed thermometer's reading falls by point one eight degrees every hour. Meanwhile, the balloon moves with its parcel, so its line on the graph stays flat at thirteen degrees.

> 157 words · 8 sentences · 747.050–808.100 s (61.1 s; speech 57.8 s) · 12:27.05–13:28.10 (measured) · **changed in v6**.
> Screen: map back to t = 0; 'warmer' ahead, 'colder', 'upwind' behind; queued parcels 'in 1 h' 12.82 °C (rose 18-km band and strip), 'in 2 h' 12.64, 'in 3 h' 12.46; clock runs; each parcel arrives and its number moves into the pole readout and onto the TimeGraph (pole falls); '−0.18 °C per hour'; balloon line flat at 13.00. No bottom row.

## s19b_equation
Our equation says the same. Put zero for capital D T by D t, and subtract v dot grad T from both sides: partial T by partial t equals minus v dot grad T. The wind has a part towards warmer air, so v dot grad T is plus point one eight kelvin per hour. The minus sign makes it a fall of point one eight at the fixed thermometer, as colder air is carried in.

> 75 words · 4 sentences · 808.100–836.025 s (27.9 s; speech 26.1 s) · 13:28.10–13:56.02 (measured).
> Screen: DT/Dt = ∂T/∂t + v·∇T → 0 = ∂T/∂t + v·∇T → ∂T/∂t = −v·∇T; +0.18 K/h under v·∇T, −0.18 K/h under ∂T/∂t; 'colder air carried in'.

## s19c_balance
So why does the balloon stay at thirteen? In one hour it moves eighteen kilometres across the isotherms, to where the map read thirteen point one eight an hour ago. Crossing the isotherms like that is worth plus point one eight: that's the advection term. In the first case, the map stood still, so the local rate was zero, and the parcel warmed by point one eight. In our second case, every place has cooled by point one eight degrees in that hour, and that fall, minus point one eight, is the local rate. They cancel, so the balloon still reads thirteen. So the advection term is the same in both cases; only the local rate is different.

> 118 words · 7 sentences · 836.025–882.175 s (46.1 s; speech 43.2 s) · 13:56.02–14:42.17 (measured) · **changed in v6**.
> Screen: ghost '13.18 °C, an hour ago'; two Balance rows: 'map frozen' +0.18 / 0 → +0.18 (with the s17b graph thumbnail) and 'map slides' +0.18 / −0.18 → 0; DT/Dt = ∂T/∂t + v·∇T; '+0.18 = 0 + 0.18', '0 = −0.18 + 0.18'; 'same advection term', 'local rate differs'; balloon 13.00 °C.

## s19d_three_rates
Let's put the three rates side by side, and say what each one means. The advection term, v dot grad T, tells us how fast the wind carries an air parcel into warmer or colder places. Here it's plus point one eight kelvin per hour in both cases, because the wind and the spacing of the isotherms are the same. The local rate, partial T by partial t, is what the fixed thermometer sees, at one place that never moves: zero when the map is frozen, and minus point one eight in our story, as colder air arrives. The material derivative, capital D T by D t, is what the balloon's thermometer sees, and it's the local rate plus the advection term: plus point one eight when the map is frozen, and zero in our story. So whenever you meet v dot grad T, think of how fast the wind carries air across the isotherms, measured in degrees per hour.

> New scene (orchestrator, user 2026-10-25: "add multiple scenes if needed to make this clear"). Times: measured by the builder's TTS run.
> Screen: 3 × 2 grid, no boxes: rows v·∇T 'advection term' (wind), ∂T/∂t 'local rate' (pole), DT/Dt 'material derivative' (balloon); columns 'map frozen' / 'our story'; +0.18 | +0.18, 0 | −0.18, +0.18 | 0 K per hour; row 3 = row 1 + row 2 brace.

## s20_twice_steep
Now let's change only the map: the temperature rises one degree every fifty kilometres, instead of every hundred. The isotherms are twice as close, so grad T doubles, to two times ten to the minus five kelvin per metre. Its length, by Pythagoras again, is that same number, because the northward part is still zero. The wind's shadow is still five metres per second. But the dot product doubles, to point three six kelvin per hour, so the fixed thermometer cools twice as fast. Just as with the sled, the shadow stayed the same, so on its own it would miss this change. Multiplying by the length of grad T catches it.

> 111 words · 7 sentences · 882.175–927.300 s (45.1 s; speech 42.2 s) · 14:42.17–15:27.30 (measured).
> Screen: isotherms every 50 km, '1 °C per 50 km'; ∇T = 2.00 × 10⁻⁵ K/m '× 2'; (U-M4.3) |∇T| = √((2.00 × 10⁻⁵)² + 0²) = 2.00 × 10⁻⁵ K/m; shadow 5.00 m/s 'same'; 5.00 × 2.00 × 10⁻⁵ = 1.00 × 10⁻⁴ K/s → 0.36 K per hour '× 2'; pole 13.00 → 12.64 in 1 h.

## s21_recap
To sum up, the dot product multiplies matching components and adds, giving a number, not an arrow. In pictures, it's the shadow of one arrow on the other, times the other's length. When the arrows point the same way, it's positive. At right angles, it's zero. In opposite directions, it's negative. With a unit vector, it picks out one part of an arrow. And in physics, it gives the work a force does, and how fast the wind changes the temperature at a fixed place.

> 85 words · 7 sentences · 927.300–962.875 s (35.6 s; speech 32.7 s) · 15:27.30–16:02.88 (measured).
> Screen: one beat per sentence: 5×1 + 1×3 = 8 · shadow × length · + / 0 / − with mini pictures · v·x̂ = 6 m/s · W = 50 J, v·∇T = 0.18 K per hour.

## s22_end
This video is one of a series of related maths tutorials, so watch out for the others. They're made for students of atmospheric science, meteorology and fluid dynamics, and anyone else who needs these ideas. The notebook for this dot product, and the notebooks for the other maths concepts, are on the website that goes with this video.

> 58 words · 3 sentences · 962.875–988.600 s (25.7 s; speech 22.2 s) · 16:02.88–16:28.60 (measured).
> Screen: 'a series of maths tutorials'; 'atmospheric science · meteorology · fluid dynamics'; 'dot-product notebook' + 'notebooks for the other maths concepts' (no URL, no path, no book name, no lab); 2.5-s silent hold.

> Total: 2457 words · 149 sentences · 986.100 s narration · 988.600 s movie (16:28.60) · 149.1 words per minute.
