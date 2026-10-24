# ch00_dot_product_why — v5 visual / layout analysis

Analyst: visual/layout (read-only on movie source). Inputs: U-M3.G1–G6, U-M3.1–23 (+ U-M.*, U-M2.* still in force unless
overridden: no references, no footnotes, no "not to scale"; U-M3.G1 overrides U-M2.G3 titles). Source read:
`movies/src/ch00/DotProductWhy.tsx` (1654 lines, v4 fix 1), `movies/src/ch00/SceneTitle.tsx`, `movies/src/house/*`,
storyboard v4, `tools/movie_qa.py`. Frames from the v4 render (8:12) at 32 timestamps, 960 px wide, in
`G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_dot_product_why/v5_analysis/tNNNN.N.png` (looked at:
4, 26, 52, 68, 97, 238, 270, 286, 302.5, 310, 370, 418, 440, 480 s).

---

## 0 · Summary

- **s13 ← s14 "leaked box" is not a leak.** It is s13's own background: `S13` draws the s14/s12 temperature map dimmed
  (`<TMap g={GM} … iso={false} o={0.4}/>`, L1157–1159) under a 55 % dark veil (`rgba(15,20,32,0.55)`, L1160). Net
  opacity ≈ 0.4 × 0.45 ≈ 18 %, with no frame, axes or isotherms, at exactly the rectangle where s14 then draws its
  full map (GM: x 110–980, y 200–722 px). Sequences do not overlap (`CUT`/`END` are contiguous, L34–36, L1648–1650), so
  nothing from s14 renders in s13. Origin: storyboard s13 "Map dims to 40 % on the left … the dimmed map repeats s12"
  (storyboard.yaml L503, L528). The frame at 302.5 s shows the purple-to-orange rectangle behind the first equation
  half, cut off mid-screen. **Fix:** delete L1157–1160 (the `<Svg><TMap …/></Svg>` and the veil `AbsoluteFill`) and
  the two storyboard lines; s13 becomes plain background. No sequencing change needed.
- **Main reason v4 fails on phones:** almost every on-screen text is 24–32 px at 1080p (census of `DotProductWhy.tsx`:
  22 px ×5, 24 ×13, 26 ×37, 28 ×64, 30 ×31, 32 ×27; only 24 uses ≥ 34 px). On a phone in portrait (video ~390 CSS px
  wide, scale 0.203) 28 px becomes **5.7 CSS px**: unreadable. The title band takes y 0–132 (12 % of the frame), and
  the caption reservation + gauges/colour bars below y 815 take another ~25 %.
- **Proposed type scale (1080p px):** hero 128 · main equation 84 (KaTeX) · calculation lines and vector names 68 ·
  keywords and on-picture labels 54 · floor 44 (ticks, units). Nothing below 44 px.
- **Top changes:** delete `SceneTitle`/`PartCard`/`TitleLayer`/`TITLES`, `GridNote`, `Chip`, `Card`, `Slots`, the
  boxed `Row` and every panel background; add `Keyword` (word + pointer arrows), `TipLabel` (label at the arrow tip,
  with collision avoidance), `CalcStack` (stacked, aligned at =, revealed with the voice), `BraceNote` (the 3Blue1Brown-
  style underbrace note for |a|); move the captions to the bottom (drop `line:76%`); enlarge the pictures to fill
  y 40–860.

---

## 1 · v4 inventory (line numbers in `movies/src/ch00/DotProductWhy.tsx` unless stated)

### 1.1 Global machinery to remove
| Item | Where | v5 action |
|---|---|---|
| Title band: panel y 0–132, accent bar, kicker "PART n · …", title 52–60 px, underline, **counter "n / 22"** | `SceneTitle.tsx` L36–72 (counter L67–70); titles `TITLES` L49–72; `TitleLayer` L1637–1644; mounted L1651; length assert L1634 | delete all (G1) |
| PartCard (dims stage to 35 %, 84 px card) | `SceneTitle.tsx` L81–87; used s08 L778–779, L787, L803; s12 L1086, L1106, L1128 | delete (G1); s08/s12 start without dim |
| `GridNote` "1 grid square = 1 unit" | def L342–344; s02 L505, s03 L545, s04 L604, s06 L720, s07 L768, s08 L801; s10 variant "wind map: 1 grid square = 1 m/s …" L911 | delete (G4) |
| `Chip` (bordered panel box) | def L298–305 | delete; replace by `Keyword` / plain label |
| `Card` (s10) | def L865–874 | delete |
| `Slots` reason boxes "1 · 2 · 3" | def L360–376; s08 L800, s09 L859, s10 L914, s11 L993, s20 L1567 | delete (PowerPoint look; the narration says "the first reason …") |
| `Row` with `boxed` border | L346–358 (border L352); boxed in s06 L719, s07 L765, s18 L1444 | drop the border; use colour/weight for the result line |
| `EqBox` number ring "(1)" | L324–335 | keep plain "(1)" only in s04/s06 (U-M2.5), no ring |
| `Gauge` under the captions (y 1008) | def L267–296; s01 L461, s03 L530, s04 L596, s05 L656, s11 L983 | move into the picture zone or delete (collides with phone captions) |
| `ColourBar` + "· an idealised map (not data)" at y 978 | L1055–1065; s12–s16, s18–s20 | move up beside the map at ≥ 44 px, short label "T (°C)" |
| Caption cue `line:76%` (captions at y ≈ 821–950) | `en.vtt` (written by the builder; not in `tools/tts.py`) | default bottom position (y ≈ 900–1040) |
| End-card URLs | s22 L1624–1626 | delete (G6, U-M3.23) |

### 1.2 Scene by scene (v4 times)
| Scene | Headings / counters | Boxes, cards, panels | Grid note | Sentences on screen (should be keywords) | Wrong position / other |
|---|---|---|---|---|---|
| s01 0–8.5 | band "Two arrows in, one number out", 1/22 | `a·b` box L468–470 + funnel L463; chips a=(5,1), b=(1,3) L471–472; agenda chip "1 · what it is 2 · why…" L473 | — | "one number, not an arrow" L462; agenda L473 | gauge in caption band L461 |
| s02 8.5–33.2 | band, 2/22 | chip "vector = an arrow: a length and a direction" L497; boxed "5 and 1 are the components of vector a: a = (5, 1)" L498, b L499; chip "|a| (two straight bars) = the length of a" L504 | L505 | L498–500, L503 "Pythagoras: length² = …" | no pointer from "components" to 5 and 1 (U-M3.3) |
| s03 33.2–54.8 | band "Definition 1 …", 3/22 | chip "multiply matching components, then add" L533; gold tag boxes L520 (**keep**, U-M3.7) | L545 | L533; L535–536 "arrows in space: 3 components / our flat arrows: 2 components"; L544 "a·b = 8: one number, not an arrow" | a=(5,1), b=(1,3) not under the picture (U-M3.6); gauge L530 |
| s04 54.8–74.4 | band "Definition 2 …" (U-M3.8), 4/22 | chip "θ = 60.3°, the angle between the arrows" L598; CosDial panel rect L568 | L604 | L600 "equation (1): we use it in a moment"; L603 "two recipes, one number"; L569 | |a| = 5.099, |b| = 3.162 shown without √ (U-M3.9, L433/438 `values`) |
| s05 74.4–100.9 | band, 5/22 | three panel frames L635; chips "p stays the same…" L667, "only q turns" L668 | — | L649 captions "same direction: positive"…; L669 | **q = (…) at panel top** (x0+270, y 392) L647, not at the tip (U-M3.11); a "q" letter at the tip L644–646; three gauges in caption band L656; "a·b measures…" uses a·b for p·q L669 |
| s06 100.9–133.0 | band, 6/22 | boxed result row L719 | L720 | heading "Computing the shadow of a on b" L708; "why" lines L676–678, L704 | |
| s07 133.0–163.4 | band, 7/22 | chips L760–761; boxed row L765 | L768 | heading L762; L764 why; L766 | |
| s08 163.4–173.0 | band + **PartCard** "Part 2 …" L803 | `\boxed{}` in TeX L774–775; Slots L800 | L801 | "Why multiply by |b|? Why not stop at the shadow?" L799; legend L798 | area labels 27 px |
| s09 173.0–187.2 | band "Reason 1 · …" | panel rects L845–846; chips L852, L858 | — | L858 | — |
| s10 187.2–210.0 | band "Reason 2 …" | two Cards L884–887; chip L908; Slots L914 | L911 (m/s variant) | L885–887, L905, L907, L910 | — |
| s11 210.0–244.3 | band "Reason 3 …" | chip L992; Slots L993 | — | L957, L961–962, L986–991 (whole sentences) | gauge L983; rulers 22–24 px |
| s12 244.3–276.8 | band + **PartCard** "Part 3 …" L1128 | `row()` panels L1093–1103 (×3); chips L1121, L1123 | — | L1115–1116, L1122–1126 | — |
| s13 276.8–303.3 | band, 13/22 | gold `\boxed{φ}` L1138, `\boxed{v}` L1151; ring L1189; chips L1186, L1194 | — | brace labels L1147–1152; L1177, L1185, L1193, L1195–1196 | **dimmed map rectangle L1157–1160 (the "leak")** |
| s14 303.3–329.1 | band | chip "isotherm = …" L1240 | — | L1241–1250 | "100 km" labels 24 px |
| s15 329.1–348.3 | band "∇T: …" | bordered div "∇ = 'grad' …" L1279; chip L1281 | — | L1282 "∇T points uphill …" (U-M3.17), L1283–1284 | "uphill → warmer" on map L1273 |
| s16 348.3–377.2 | band | chip "components: … ✓" L1338 (visible 0.3 s, S12) | — | L1331–1332, L1335 | 8.66 m/s shown without 10 sin 60° (U-M3.18) L1314 |
| s17 377.2–396.6 | band | two column cards L1355–1383; chip clock L1384 | — | L1379–1388 incl. "after 1 h the parcel is over a spot that was 0.180 °C warmer…" (U-M3.19c confusion) | emoji 📏 🕒 |
| s18 396.6–421.3 | band | chips L1439, L1441; boxed row L1444 | — | why lines L1395–1398; L1440, L1442 (22 px) | parcel tags 24 px L1430 |
| s19 421.3–444.0 | band | status panel L1511–1516; chip L1517 | — | L1497, L1513–1518 | "arrives in 2 h · 12.64 °C" 26 px L1489 |
| s20 444.0–462.5 | band | chip L1554; bordered cards L1560–1565; Slots L1567 | — | L1555–1568 | eq at 25 px L1556 |
| s21 462.5–484.9 | band "RECAP" | 4 row panels L1598–1599 | — | heading L1596; row texts L1589–1592 | packed (U-M3.22) |
| s22 484.9–492.2 | band "Try it yourself" | 2 link panels L1616 | — | L1626 | **absolute URLs** L1624–1626 |

---

## 2 · v5 visual design system (1920 × 1080, watched on phones)

### 2.1 Viewing assumptions
Phone portrait inline: video ≈ 360–420 CSS px wide → scale 0.19–0.22. Phone landscape full screen: ≈ 800–930 CSS px →
scale 0.42–0.48. Comfortable reading needs ≥ 12–14 CSS px for words and ≥ 10 CSS px for a single short number.
Design for **portrait inline as the floor**, landscape as the normal case.

### 2.2 Type scale (render px at 1080p → CSS px at 390-wide portrait / 844-wide landscape)
| Token | Size | Weight | Use | Portrait / landscape |
|---|---|---|---|---|
| `T.hero` | 128 | 700 | a single result or symbol on its own: "8", "a·b", "−0.18 K/h" | 26 / 56 |
| `T.eq` | 84 (KaTeX) | — | the scene's main equation | 17 / 37 |
| `T.calc` | 68 (KaTeX or text) | 600 | calculation lines, vector names a b p q v, a = (5, 1) | 14 / 30 |
| `T.key` | 54 | 600 | keywords, labels on the picture, coordinates at tips, temperatures | 11 / 24 |
| `T.floor` | 44 | 500 | axis ticks, units, map km labels, "T (°C)" | 9 / 19 |
Rules: nothing below 44 px. At most ~22 characters per keyword line, ≤ 3 text items + 1 equation block visible per
zone. A line that would need < 54 px to fit must be split or cut. Label halo stays (`paintOrder: stroke`, stroke
`HOUSE.bg`, width = 0.18 × size). Strokes: vector arrows 10 px, heads 40 px; secondary arrows 6 px; pointers 5 px.

### 2.3 Frame, zones, safe margins (no title band)
```
y   0 ┌──────────────────────────────────────────────────────────────────┐
   40 │  (safe top)                                                      │
      │  PICTURE ZONE  x 80–1000           │  MATHS ZONE  x 1060–1840     │
      │  (vectors, maps, sled)             │  (symbols, numbers, calcs)   │
  860 │  ─ content may go to here ─────────┴──────────────────────────── │
  880 │  CAPTION BAND y 880–1040: player captions (bottom, 2 lines);    │
 1040 │  nothing essential here                                         │
 1080 └──────────────────────────────────────────────────────────────────┘
```
- Content y 40–860 (820 px tall, v4 had 160–815 = 655 px: **+25 %**), side margins 80 px (4 %, title-safe for
  phones' rounded corners). Full-width scenes use x 80–1840 centred.
- Picture zone grows from v4's ~740 × 560 px to ~920 × 800 px; the pair plane scale goes 92 → 135 px per unit.
- Captions: write cues without `line:` (default bottom) so they sit in y ≈ 880–1040 on every player. Nothing drawn
  there except during the final silent hold.

### 2.4 Colour roles (house-dark-v1, unchanged hues; checked for deuteranopia/protanopia by hue + luminance + shape)
| Role | Colour | Redundant cue (CVD) |
|---|---|---|
| first vector a, p, wind v, F | teal `#2aa198` | solid thick arrow |
| second vector b, q, ∇T, x̂, d | orange `#e8833a` | solid thick arrow; teal/orange is the safest pair for red-green CVD |
| shadow | the caster's colour, 70 % band, 20 px wide | band shape, not an arrow |
| product (area) | ink 18 % fill, ink outline | area shape |
| negative | rose `#d9667f` + 45° hatch + dashed outline + "−" glyph | rose ≈ orange for CVD, so never rely on hue: always hatch and the minus sign |
| keyword + pointer | warm white `#f4ecd2` text, pointer `#d8b23a` gold, 5 px, open chevron head | thin curved line + open head, never confused with the filled vector arrows |
| local rate ∂T/∂t (pole) | slate brightened to `#aab4c8` for text (TERM.tendency `#8a94a8` is too dark at 54 px on phones) | the pole icon beside it |
| advection v·∇T | teal (TERM.advection) | the balloon icon beside it |
| temperature map | cmocean thermal LUT (keep) | isotherm lines + °C labels |
| muted secondary | `#9aa6bd` | only for ticks/units at `T.floor`; never for a keyword |
Drop `HOUSE.accent #4fb3bf` as a text colour: it is too close to teal `a` and was the title-band colour. Use it nowhere
in v5 except, optionally, a 4-px focus underline.

### 2.5 `Keyword` component (word + pointer arrows)
- Props: `text`, `at: [x, y]` (text anchor), `targets: Pt[]` (glyph centres or bbox edges), `appear` (frame from
  `AT()`), `colour`.
- Draw: word fades in (8 frames, 12 px rise); then each pointer draws with `strokeDashoffset` over 10 frames, 4-frame
  stagger; a quadratic Bézier from the word's nearest bbox edge to 14 px short of the target, control point offset
  25 % of the chord to the outside (so two pointers fan out, not cross); open chevron head 18 px; target glyph gets a
  soft gold halo pulse (one 20-frame sine).
- Hold while the voice talks about it; fade with the next beat. Never a box.
- Use in s02 ("components" → 5, 1 and → 1, 3; "length" → bracket; "direction" → arrowhead), s03 ("scalar" → 8),
  s13 ("advection" → v·∇T), s14 ("isotherm" → a line), s16 ("along the isotherm" → 8.66 leg).

### 2.6 The "note" for |a| = length of a (U-M3.4): two options
**Option A — underbrace on the symbol (recommended).** In the Pythagoras line write
`\underbrace{|\mathbf a|}_{\text{length of }\mathbf a} = \sqrt{5^2+1^2} = \sqrt{26} = 5.099`, the brace and its words in
teal at `T.key`; at the same moment the length bracket on the picture pulses and the two bars of |a| flash gold once.
After ~2.5 s the underbrace text fades, leaving |a|. Reasons: the meaning sits on the symbol it explains (how
3Blue1Brown annotates: braces and colour-matched words, no frames); one element instead of two; no extra zone needed;
reusable for |b|, |∇T| (s15), |v| (s16).
**Option B — margin gloss with a rule.** A short muted line `| |  =  "length of"` at `T.key` in the maths zone, with
a 4-px vertical gold rule on its left (a pull-quote, not a box) and a pointer to the bracket on the picture. Reasons:
it is visible longer, reads as an aside; cost: one more text block and it separates meaning from use.
Pick A; fall back to B only if the underbrace pushes the stack past 3 lines.

### 2.7 How calculations are shown (`CalcStack`)
- One KaTeX `\begin{aligned}` block per calculation, aligned at "=", line height 1.35 × `T.calc`.
- Line k fades in (10 frames) at the phrase that says it (`AT(k, j, "…")`); the previous lines dim to 60 %; the result
  term is bold and in its quantity's colour; the final line gets a short gold underline (not a box).
- ≤ 3 lines visible; a fourth slides the stack up by one line (eased over 12 frames) rather than shrinking the font.
- Storyboard LaTeX strings stay as literal constants in the TSX (each line one constant), so the `equations` QA gate can
  still find them; the aligned block is assembled from those constants.

### 2.8 Labels at arrow tips (`TipLabel` + `placeLabels`)
- Default anchor: tip + (head length × 0.6 + 16 px) along the arrow direction, text anchored on the near side.
- Candidates in order: along · along + left normal · along + right normal · above tip · below tip (5 positions).
- Box estimate: width = 0.56 × size × characters (KaTeX labels: measure once with a hidden render, memoised); height =
  1.1 × size; pad 10 px.
- Reject a candidate that intersects another placed label, any arrow segment (distance < size × 0.6), the zone edge, or
  the caption band; take the first that passes; fixed order ⇒ deterministic.
- Placed once per scene from data (not per frame) so labels never jitter.

### 2.9 Other treatments
- Clock: plain text "t = 1.05 h" at `T.key` beside the map, no "1 h in 1.5 s" line (say it once in the narration).
- Thermometer readouts: number at `T.calc` next to its icon (pole: slate; balloon: teal), no status panel.
- Map: `GM` moves up into the freed band and grows a little: 600 × 360 km at 1.47 px/km = 882 × 529 px at
  x 120–1002, y 140–669 (v4: 870 × 522 at y 200–722), which leaves y 700–860 under the map for keywords; ticks at
  `T.floor`; colour bar vertical at the map's right edge x 1010–1030, labels 44 px.
- Transitions: 10-frame cross-fade between scenes; elements that persist (a, b, the map) stay put across the cut.

---

## 3 · Per-scene v5 layout sketches (coordinates in 1080p px; v4 scene ids; times grow to 10–12 min in total)

Pair plane for s01–s08: `P = mkP(240, 620, 135)`, faint grid x −1…6, y −1…4 (x 105–1050, y 755–80), a tip (915, 485),
b tip (375, 215).

**s01 opening** ("What is the dot product?")
```
 picture: a and b grow from O                     maths: "a · b" at T.hero (1450, 330)
                                                         then "= 8" slides in (T.hero)
```
No agenda chip, no funnel box, no gauge. "a" and "b" names at the tips (`TipLabel`, T.calc).

**s02 vectors and components**
```
 picture (a, b, dotted legs, 5 1 / 1 3 at T.key)  │ (1100,180) "vector"  T.hero-ish 96 px
   "length" ──pointer──▶ bracket along a          │   keywords "length"  "direction" with pointers to the picture
   "direction" ─pointer─▶ arrowhead of a          │ (1100,360) a = (5, 1)   T.calc teal
                                                  │ (1180,450) components ↖ ↗ (pointers to 5 and 1)
                                                  │ (1100,560) b = (1, 3)   T.calc orange
                                                  │ (1180,650) components ↖ ↗
```
Then the vector/keyword block fades and the Pythagoras stack takes the maths zone:
`|a| (underbrace "length of a") = √(5² + 1²) = √26 = 5.099` and `|b| = √(1² + 3²) = √10 = 3.162` (T.calc), right
ticks on the picture. Drop the "Pythagoras: length² = …" sentence (say it).

**s03 multiply matching components, then add**
```
 picture (unchanged, a b)                          │ (1080,140) a·b = a₁b₁ + a₂b₂ + a₃b₃   T.eq
 (240,700) a = (5, 1)    (620,700) b = (1, 3)      │   x, y, z under the three terms (T.key), then a₃b₃ struck grey
   ← just below the picture, T.calc, colours      │ (1080,330) a·b =  a₁b₁ + a₂b₂ with the gold tags (KEEP the
                                                   │            tag boxes, U-M3.7) a₁=5 b₁=1 | a₂=1 b₂=3
                                                   │ (1080,560) = 5×1 + 1×3 = 5 + 3 = 8  (CalcStack)
                                                   │ (1500,700) "8" T.hero; "scalar" keyword with pointer to 8;
                                                   │            small crossed arrow icon "not an arrow"
```
"arrows in space: 3 components" text goes: the x, y, z labels under the terms carry it.

**s04 the angle (no "Definition 2")**
```
 picture: θ arc (T.calc), brackets |a| |b|         │ (1080,140) a·b = |a| |b| cos θ   (1)    T.eq
                                                   │ (1080,300) |a| = √(5² + 1²) = √26 = 5.099
                                                   │ (1080,390) |b| = √(1² + 3²) = √10 = 3.162
                                                   │ (1080,480) θ = 60.3°,  cos θ = 0.496
                                                   │ (1080,600) a·b = 5.099 × 3.162 × 0.496 = 8.000  (bold 8)
```
The CosDial panel goes; if the cos θ range is still taught, draw the −1…1 line without the panel rect, labels 44 px.

**s05 the angle sets the sign** (≈ 40 s, three beats)
```
 (200,140) p = (3, 0)  T.calc teal, big p arrow     (centre top, 260 px long)
 three panels x 80–620, 690–1230, 1300–1840; panel y 300–700, no frames, faint grid only
   q drawn orange; label "q = (2, 0)" at q's TIP via TipLabel (above the tip in panel 1 because p overlaps the shaft;
   above in panel 2; left of the tip, end-anchored, in panel 3)
   under each panel (y 740): p·q = 3×2 + 0×0 = 6    | 3×0 + 0×2 = 0 | 3×(−2) + 0×0 = −6 (rose, hatch area)  T.calc
   one keyword per panel (y 810): "same direction" · "right angle" · "opposite"  T.key
```
Panels appear one by one with the voice; "same p" text goes (the same p is visibly the same arrow). Drop the three
gauges. Closing line: "how much they point the same way" at T.key centred y 210 only if the voice needs a pause.

**s06 the shadow**: picture as now, larger; triangle words on the picture at T.key: "shadow", "|a| = 5.099", "θ".
Maths zone: `CalcStack` cos θ = shadow / |a| → shadow = |a| cos θ → (1)/|b| with |b| cancelling (rose strike) →
shadow = 8 / 3.162 = 2.530 (bold). Delete the heading L708 and the "why" sentences (narration).
**s07 b̂**: b shrinks to b̂ on the picture; "b̂ = b / |b|" T.eq; "unit vector" keyword with pointers to b̂ and to its
"1" bracket; stack: b̂ = (1/3.162, 3/3.162) = (0.316, 0.949) → a·b̂ = 5×0.316 + 1×0.949 = 2.530 → "same shadow" check
glyph ✓ next to 2.530 (no text).
**s08 why multiply by |b|?**: no PartCard. Picture: shadow band + rectangle growing; maths: a·b = (|a| cos θ) |b|
with the two factors underbraced "shadow" (teal) and "length of b" (orange) instead of `\boxed`; = 2.530 × 3.162 = 8.
Spoken question; on screen only "× |b| ?" at T.hero.
**s09 order**: two planes side by side, each 880 px wide (scale 70 px/unit, y 120–600); under each one calc line at
T.calc (2.530 × 3.162 = 8.000 / 1.569 × 5.099 = 8.000); centre bottom a·b = b·a T.eq. No panel rects, no chips.
**s10 a unit vector picks out a part**: drop the two Cards; show `5×1 + 1×3` vs `|a| |b| cos θ` as two lines with
"2 multiplications" / "√, cos" keywords if kept at all; wind map larger (scale 70 px per m/s, x 120–860, y 120–820),
"6 m/s east", "8 m/s north" at the legs at T.key; maths: x̂ = (1, 0), v·x̂ = 6×1 + 8×0 = 6 m/s, keyword "eastward
part" with pointer to the band. No grid note.
**s11 work** (U-M3.12)
```
 sled scene x 80–1000, ground y 560; F (teal) at 60°, labels at tips: "F = 20 N", "d = 5 m" (orange)
 shadow band "10 N" T.key; product rectangle under the ground
 maths: (1080,140) W = F · d  T.eq, with keywords "force" → F and "displacement" → d (both vectors)
        (1080,330) shadow = 20 × cos 60° = 10 N
        (1080,420) W = 10 N × 5 m = 50 J
        (1080,510) d × 2 → W = 10 N × 10 m = 100 J   (d arrow and rectangle stretch)
        (1080,640) "shadow alone ≠ work" T.key; "× |d|" T.calc
```
Rulers removed or at 44 px; gauge removed (the rectangle is the scalar). "N = newton", "J = joule" said, or shown as
`N` and `J` subscripts with a 44 px gloss once.
**s12 two thermometers**: no PartCard; map larger (x 120–1000, y 140–700); pole and balloon icons ×1.4; on the map:
"fixed place" under the pole, "moves with the wind" by the balloon (T.key). Maths zone, no row panels:
∂T/∂t (slate, T.eq) + pole icon + keyword "local rate"; later DT/Dt (teal) + balloon icon + "following an air
parcel". "∂ = only time changes; place fixed" as two keywords "time ✓" "place fixed" under ∂ (the user likes the
sentence: say it, show the two keywords). "air parcel" keyword with a pointer to the dashed ellipse.
**s13 the material derivative** (U-M3.14–15)
```
 NO MAP (the leak fix). Full width.
 (centre, y 260) DΦ/Dt = ∂Φ/∂t + v·∇Φ     T.eq 96 px, terms coloured (teal / slate / teal)
 underbraces (y 390), T.key: "following an air parcel" · "at one fixed place" · "advection"
   balloon icon above DΦ/Dt, pole icon above ∂Φ/∂t
 (y 520) "material derivative" keyword with pointer to D/Dt
 (y 600) Φ:  T  ·  moisture   (small icons)    advection keyword stays; "carried by the wind" T.key under it
 (y 720) DT/Dt = ∂T/∂t + v·∇T   T.calc, the dot in v·∇T flashes gold = "our dot product"
```
Drop the gold `\boxed{φ}` / `\boxed{v}`: colour the symbol instead.
**s14 isotherms** (U-M3.16): build in words first: an empty map with axes; a walker goes east and a "+1 °C" pops
every 100 km (T.key, above the walker's path, y ≥ map top + 60); walking north: "no change" keyword; then the
isotherm lines draw one by one with "11 °C … 15 °C" (T.key) above the map; "isotherm" keyword with pointer to one
line. Maths: ∂T/∂x = 1 °C / 100 km, ∂T/∂y = 0 (T.calc, orange) — keep the animation.
**s15 ∇T** (U-M3.17): ∇T arrow on the map with "|∇T|" bracket; maths: ∇T = (∂T/∂x, ∂T/∂y) = (1.00×10⁻⁵ K/m, 0)
split over two lines (v4 squeezed it to 30 px); keyword "towards warmer" with pointer to the arrow head; "fastest
increase" T.key. Delete "uphill" everywhere (L1273, L1282).
**s16 v·∇T** (U-M3.18)
```
 map, pin at 300/180 km; v (teal) 10 m/s at 60°, ∇T (orange)
 legs: "5 m/s" (shadow, along ∇T) and "8.66 m/s" (along the isotherm) at T.key at the leg midpoints
 maths: (1080,140) v·∇T = (|v| cos θ) |∇T|        T.eq
        (1080,260) 10 × cos 60° = 5 m/s            ← towards warmer
        (1080,340) 10 × sin 60° = 8.66 m/s         ← along the isotherm: no change (keyword + pointer to the leg)
        (1080,450) 5 m/s × 1.00×10⁻⁵ K/m = 5.00×10⁻⁵ K/s
        (1080,530) × 3600 s = 0.18 K per hour (bold)
        (1080,640) keyword "the balloon's thermometer" → pointer to the balloon icon (whose temperature: answered)
```
The components check chip (S12 follow-up) becomes a fourth stack line or is dropped.
**s17 rate in space vs rate in time**: two keywords side by side instead of column cards: "1 °C per 100 km" (orange,
with a ruler bracket on the map) and "0.18 °C per hour" (teal, with a small clock glyph). Zoomed map larger (GZ).
Delete "after 1 h the parcel is over a spot that was 0.18 °C warmer" — it caused the "temperature increases"
misreading (U-M3.19c). Show instead "18 km towards warmer air in 1 h" on the map.
**s18 DT/Dt = 0, pattern slides** (U-M3.19a, U-M3.20)
```
 map x 120–1000, y 140–700 with sliding isotherms and parcel tags (tags at T.floor 44 px, 3 rows × 4 instead of 4 × 5
 so they fit); balloon "13 °C" stays with its parcel
 maths: (1080,140) DT/Dt = ∂T/∂t + v·∇T
        (1080,250) 0 = ∂T/∂t + v·∇T     keyword "keeps its temperature" → 0
        (1080,360) ∂T/∂t = − v·∇T       (rose minus)
 keyword "the pattern slides with the wind" with pointer to an isotherm moving (y 760, T.key)
```
**s19 the balance: pole falls, parcel keeps 13 °C** (U-M3.19b–c, U-M3.20)
```
 map left with the upwind track (1 h / 2 h / 3 h dots, labels "12.82", "12.64", "12.46 °C" at T.key, left of dots)
 pole readout next to the pole "12.82 °C ↓" (slate, T.calc); balloon "13.00 °C" (teal) riding off
 maths zone: balance bar
        (1080,160) DT/Dt = ∂T/∂t + v·∇T
        (1080,300)   0   = −0.18  + 0.18      (K per hour; −0.18 rose under ∂T/∂t, +0.18 teal under v·∇T,
                                               the two bars below grow to equal length in opposite directions)
        (1120,430) [rose bar ◀────] | [────▶ teal bar]  on a zero line, each labelled at its end
        (1080,560) keywords: "pole: −0.18 K/h" (slate) · "parcel: 0" (teal)
        (1080,660) "colder air arrives from upwind" keyword + pointer to the track
```
**s20 twice as steep** (U-M3.21): map with isotherms every 50 km; bracket "1 °C per 50 km" (T.key) between two lines;
maths: shadow = 5 m/s (unchanged, teal) · ∇T = 2.00×10⁻⁵ K/m (orange, ×2 badge-free: "× 2" keyword) ·
v·∇T = 5 × 2.00×10⁻⁵ × 3600 = 0.36 K per hour (bold) · "twice as fast" T.key. Pole readout falls 0.36 K/h. No Slots,
no cards.
**s21 recap** (U-M3.22), ~60–70 s, one idea per beat, full width, no panels, each beat replaces the previous:
1. a·b = a₁b₁ + a₂b₂ = 8 with the picture (small pair plane left).
2. a·b = |a| |b| cos θ, shadow × length rectangle.
3. sign: three mini-pictures with "+" "0" "−" at T.hero under them, keywords "same direction" · "right angle" ·
   "opposite".
4. unit vector: v·x̂ = 6 m/s "eastward part".
5. work W = F·d = 50 J; weather v·∇T = 0.18 K/h, pole −0.18 K/h.
Final hold: the five mini-icons in a row with one keyword each (T.key).
**s22 end card** (U-M3.23, G6): no URLs, no panels. Centre: two large icons (controller, notebook) with "vector
products lab" and "dot-product notebook" at T.calc; the voice says "on the website that goes with this video".
Optional bottom line "fluidpy" at T.floor (no address).

---

## 4 · Code changes and risks

### 4.1 Delete
- `movies/src/ch00/SceneTitle.tsx` (whole file) and its import L4; `TITLES` L49–72; `TitleLayer` L1637–1644; L1651;
  assert L1634. Storyboard `title_treatment:` (L70–80) and every `title:`-as-on-screen note (keep `title:` only as a
  scene name for logs).
- `GridNote` L342–344 and its 7 uses; `Chip` L298–305; `Card` L865–874; `Slots`/`REASONS` L360–376; the `boxed`
  border in `Row` L352; `EqBox` ring; the `row()` panels in S12 L1093–1103; `colStyle` cards S17 L1355–1383; the S19
  status panel L1511–1516; S20 border cards L1559–1566; S21 panels L1598–1599; S22 links L1615–1626.
- S13 L1157–1160 (the dimmed map + veil) — the "leak".
- `Gauge` uses in the caption band (s01, s03, s04, s05, s11) and `ColourBar` at y 978 (re-place, smaller footprint).

### 4.2 Add (in `movies/src/ch00/kit/` now; promote to `movies/src/house/` by the orchestrator later)
| Component | Purpose |
|---|---|
| `type.ts` | `T` scale (128/84/68/54/44), `SAFE` (x 80–1840, y 40–860), `ZONE.pic` / `ZONE.math`, colour roles of §2.4 |
| `Keyword` + `Pointer` | §2.5 |
| `TipLabel` + `placeLabels()` | §2.8 (pure function of the scene's static geometry, memoised) |
| `CalcStack` | §2.7 (KaTeX `aligned`, per-line reveal by `AT()`, dim, slide-up) |
| `BraceNote` | SVG brace along a segment / KaTeX `\underbrace` wrapper with fade-out |
| `Balance` | s19 two-bar balance (−0.18 / +0.18) on a zero line |
| `useTex` memo | KaTeX strings rendered once per string (many more KaTeX lines in v5) |

Data/physics: new on-screen numbers need `CHECK` rows (L150–160): `10 sin 60° = 8.66` (`wx.v_along_isotherm_m_s[1]`,
already in data), √26/√10 (already `pair.norm_a_sq`, `norm_b_sq`), s20 "1 °C per 50 km" (`wx.gradT_steep`), the
balance +0.18/−0.18 (`wx.K_per_h`, `wx.dTdt_K_h`). No new fluidpy function is needed.

### 4.3 QA gates and risks
| Gate / risk | Effect | Mitigation |
|---|---|---|
| `duration` | v4 run used `--duration-window 470,500` | use `600,720` and `--duration <measured>` |
| `size` | 30.95 MB at 8:12 → ≈ 42–48 MB at 11–12 min (bigger text barely changes bitrate) | `--budget-mb 60 --hard-mb 80` still fits |
| `captions` | ≈ 113 → 160–190 cues; fuller sentences raise cps | keep ≤ 42 chars/line, ≤ 17 cps; slower narration helps; drop `line:76%` (cue position is not checked by the gate) |
| `equations` | storyboard `latex` must appear verbatim (whitespace-squashed) in the TSX; aligned stacks built from fragments would FAIL | keep every storyboard equation (and each stack line) as a literal `String.raw` constant; count rises ~36 → ~55 |
| physics parity / manifest | unchanged physics | rerun the data script only if new samples are added |
| phone legibility (not a gate today) | the main user complaint | add a reviewer step: contact sheet downscaled to 390 px wide; reject any text that is not readable; optionally a lint in the builder: grep the TSX for `s={2x}`, `fontSize: 2x/3x`, `size={2x/3x}` < 44 |
| render time | ~1.45× frames of v4; more KaTeX per frame | memoise KaTeX (`useMemo` per string), keep TMap at 120 strips, render at `--concurrency 50%` alone (one low-memory stop on 2026-10-23); scratch on G: |
| label collisions with bigger text | more overlaps (s05 panel 1 where q lies on p, s16 legs, s19 dots) | `placeLabels` candidates + the reviewer checking every scene's busiest frame |
| reviewer checklist | still checks "not to scale" presence and 640 px | update `movie-reviewer` brief: no badges (U-M2.G2), legibility at 390 px, no headings/boxes |
