# Chapter 0A PoC G (dot-product block): lesson review                2026-10-21

Reviewed `notebooks/poc_ch00a_dot.ipynb` (builder `notebooks/build_poc_ch00a_dot.py`) against `analysis/ch00_poc_design.md`
(Part A/C · PoC G, Part G) and `analysis/ch00_poc.md`. The committed notebook has **no outputs** (the builder writes none), so
I executed it myself: `publish_notebook.execute` → `outputs/ch00_poc/executed.ipynb`, **17.5 s, 46 cells, 0 errors**. I looked
at the figure (`outputs/ch00_poc/fig10.png`).

coverage_check `ch00 --nb outputs/ch00_poc/executed.ipynb`: **OK, 0 errors, 3 warnings** (all chapter-level: no ch00 curation tiers
table, 1 explainer < 5, no ch00_design.md. These don't apply to a sample block) · crossref_check: **tool does not exist**
(`tools/crossref_check.py` missing). I checked the links by hand against `knowledge/kundu_index.yaml` and the local Kundu HTML
`<h2 id>`s, and all 4 resolve · sections 1/1 · CORE 1/1 complete (C0A-PoC1) · K 1/1 present, depth adequate, 3 parts weak
(see audit) · eq-code 4/4.

Equations were checked against the page images: (K 2.2) Kundu p. 41 ✓; cosine form unnumbered in Kundu §2.8 p. 52 ✓ (the
§2.8 title "Vector, dot, and cross products" is on p. 51 ✓); ∇·u in App. B §B.3 p. 862, unnumbered, with **u** = (u, v, w) ✓;
Vallis (1.7) p. 5 (boxed) ✓; Vallis (2.55) p. 66 with **f** = f**k** = 2Ω sin ϑ **k** ✓. Every printed number matches its
cell: 2.236, 5, 45.0°, 1.581, (0.5, 1.5, 0), 7.07 m/s, 5.000e-5 K/s, 4.320 K/day. Note that the design's 0.43 K/day
(5e-6 K/s) was an arithmetic slip, and the notebook correctly uses 10 × 1e-5 × 0.5 = 5e-5 K/s, which is 4.32 K/day.

## Must fix
1. **"Coriolis" is used but never explained** (cell 0: "crossed with the Earth's spin gives the Coriolis effect"; cell 41:
   "Vallis's Coriolis term"). This is a climate word on first use for a reader who has never seen a weather map, and it is
   missing from the block's 📖 word list. Fix: add one clause at first use (glossary `Coriolis effect`: "moving things seem
   to curve sideways on a spinning planet") and add the term to the word list.
2. **(2.55) is shown with undefined symbols** (cell 41): ρ, p, ∇_z, Ω and the vector D**u**/Dt are never named. Only ϑ is in
   the symbol table. This breaks R4 check 7. Fix: one line under (2.55), for example "ρ density (≈ 1.2 kg m⁻³ for air), p
   pressure, ∇_z the horizontal slope at fixed height, Ω Earth's spin rate ≈ 7×10⁻⁵ | 7.29×10⁻⁵ s⁻¹". Also add the symbols
   to the 📇 table.
3. **Vector addition and subtraction are used in the derivation but never taught.** Step 1 says "head-to-tail addition
   says b + c = a" and Step 3 says "the components of a − b are a₁ − b₁ …", but neither idea appears in "What you should
   already know", in "Tools we use" or in a primer. This is a tool first used inside a derivation, which the teaching style
   says must be primed before the derivation. Fix: add a 📎 primer (picture of head-to-tail; (2,1) − (1,3) = (1,−2); a
   two-line numpy demo) before the law-of-cosines primer, and list it under "Tools we use".
4. **An equation is cited by number only** (cell 41, "Where next": "(K 2.20)–(K 2.21)"). Neither equation is written
   anywhere in the notebook. Fix: write **a×b** = (a₂b₃ − a₃b₂, a₃b₁ − a₁b₃, a₁b₂ − a₂b₁) (K 2.20) beside the number, or drop
   the numbers and say "the component formula for a×b".

## Should fix
- **Figure (cell 10).** The thick teal shadow lies under the orange b arrow, so the main thing being shown is hard to see
  (only a faint halo). The label "shadow = |a| cos θ = 1.581" runs across the orange arrow, and the arc end cuts through
  "θ = 45°". Fix: offset the stripe slightly to the side of b's line (or draw b thinner on top of a wider, more opaque
  stripe), move the label left or below, and nudge the θ label.
- **K-recap (cell 12) is missing three of its eight parts:**
  - (a) There is no labelled **"What Vallis adds"** line. "Where Vallis uses it" does this job, so say so in one line
    (Vallis's u·∇T in (1.7), and the k×u term).
  - (b) There is no Kundu derivation id. Kundu leaves the cosine form to Exercises 2.12–2.13, so state "no Kundu
    derivation to reuse; D0A-PoC1 is ours (9 steps)".
  - (c) The code uses `fluidpy.geo.vectors.dot`. Say in the library cell that it is a thin wrapper of
    `fluidpy.core.tensors.dot` (the Kundu function), as its docstring says.
- **Mislabelled link.** "Kundu ch02 §2.8 ([notebook])" in cells 12 and 41 actually opens §2.1, because the published
  Kundu notebook has no §2.8 anchor. Relabel it ("§2.8 material is taught on the site under §2.1 / C08"), or link C08 for
  §2.8.
- **Symbol table (cell 42) has no typical-value column**, which R4 check 7 and teaching-style §1d require. Add one:
  u ≈ 10 m/s, T ≈ 288 K, |∇T| ≈ 10⁻⁵ K/m, and "—" for the generic a, b, θ.
- **The atlas link target does not exist.** The link `https://shammun.github.io/aofd/viz/atlas.html` points to a page
  with no `viz/atlas.html` in the repo yet. Build the atlas before publishing, or the link 404s.
- **Callout in cell 7.** It mentions "potential temperature" and "colatitude" without defining them. The end-of-block
  glossary defines potential temperature using "adiabatically" and "1000 hPa", and the symbol table says "p_R", so the
  two disagree and neither is plain. Add a half-sentence each: "a temperature-like quantity you'll meet in Chapter 1",
  "angle measured from the North Pole = 90° − latitude".
- **The step from Vallis's operator to the dot product needs one line** (cell 36). Vallis writes (**v**·∇)φ, and the text
  jumps to "the wind dotted with ∇T". Add: (**v**·∇)T = u ∂T/∂x + v ∂T/∂y + w ∂T/∂z = **v**·(∇T), the same thing for a
  scalar. The 📇 table even warns that "(u·∇) is an operator", so the reader needs this bridge.
- **∇·u has a w-term with no note** (cell 41). The text quotes Kundu's ∇·u = ∂u/∂x + ∂v/∂y + ∂w/∂z, but the block's own
  table says Vallis's bold u is horizontal. Add "(Kundu's **u** is 3-D, Vallis's **v**)", or write ∇·**v**.
- **∇ appears before it is explained.** It is first used in the K-recap (cell 12: "every ∇ formula"), but its primer is
  cell 34. Say "(the slope arrow, primed below)" at the first use.
- **A tolerance comment uses ideas not yet taught.** The cell 24 comment mentions atan2(|a×b|, a·b) before the cross
  product and atan2 are taught. Add "(cross product: next block)".
- **Round-off is not explained.** Cell 27 prints `leftover·b = 1.3e-15`, but the reading notes say "is 0". Say "1e-15 is
  round-off, i.e. zero".
- **The opening story never gets its payoff.** The question is "how much of the breeze carries air toward the warm
  side", but its answer (7.07 m/s × 10⁻⁵ K/m ≈ 6 | 6.1 K/day of *cooling*) is never computed. A reader may expect
  "toward the warm side" to mean warming. One sentence in "Where Vallis uses it" closes the loop.
- **The explainer cell (30) has no explicit "why interactive" sentence.** Add one, for example "a static picture shows one
  angle; dragging shows a·b following cos θ through zero and below".
- **Jargon in the anatomy strip (cell 14).** "Glyph pair" is unexplained. Say "a in teal, b in orange, as in the figure".
- **Tooling.** `tools/crossref_check.py` is named in the procedure and the skills but missing. Either create it or remove
  it from the gates.

## Unexplained-first-use list (term · first cell · explained at / missing)
| Term | First cell | Explained at / missing |
|---|---|---|
| Coriolis effect | 0 | **missing** (Must 1) |
| ρ, p, ∇_z, Ω, D**u**/Dt | 41 | **missing** (Must 2) |
| vector addition / subtraction (head-to-tail) | 17 (D step 1, 3) | **missing** (Must 3) |
| (K 2.20), (K 2.21) | 41 | **never written** (Must 4) |
| potential temperature | 7 | 43 glossary (late; uses undefined "adiabatically", "hPa") (Should) |
| colatitude | 7 | **missing** (Should) |
| ∇ | 12 | 34 primer (late) (Should) |
| atan2, a×b | 24 (comment) | next block (Should) |
| (**v**·∇) as an operator vs **v**·∇T | 36 | partly, in 📇 table 42 (Should) |
| glyph pair | 14 | missing (Should) |
| summation convention, a_ib_i | 12 | 13 ✓ |
| arrow/vector, components, \|a\|, θ | 7 | 7 ✓ |
| Pythagoras 3-D, law of cosines | 8, 15 | primers 8, 15 ✓ |
| numpy `*`, `.sum()`, `arccos`, `degrees` | 23 | primer 20 ✓ (np.radians in 16 is fine for a Python-strong reader) |
| south-westerly, fluid parcel, material derivative, advection, isotherm | 6, 36, 34 | at first use ✓ |
| ∂T/∂y | 34 | 34 ✓ |

## K-recap audit
| K id | links ok | full depth | scratch+assert | verdict |
|---|---|---|---|---|
| Kundu ch02 §2.1/§2.8 dot product (App. B item) | 4/4 resolve (anchors in kundu_index.yaml and the local HTML); the "§2.8" label points to §2.1 | link line ✓, crosswalk ✓ (4 rows, θ/ϑ, u,v lengths), plain words ✓, (K 2.2) written ✓, derivation ✓ (ours, 9 steps), tiny example ✓, Kundu explainer linked + AOFD explainer embedded ✓; **no "What Vallis adds" label, no note that Kundu has no derivation** | ✓ scratch (no fluidpy) + `geo.vectors.dot` (wraps `core.tensors.dot`, not stated) + assert rtol 1e-12 | adequate, 3 Should-fix |

## Derivation audit
| D id | steps | follows? | why / in-words | check | verdict |
|---|---|---|---|---|---|
| D0A-PoC1 a·b = \|a\|\|b\|cos θ | 9 + start | yes, each line follows by the stated move. I worked every step by hand, and the sympy cell rebuilds steps 3–6 and 7–9 | all four parts on every step; the zero-vector assumption is stated; degenerate θ = 0°/180° is covered | units ✓, limits (a = b, i·j) ✓, numbers ✓, sympy ✓ (★, so not required) | pass, except that the tool for steps 1/3 (vector subtraction) is unprimed (Must 3) |

## R4 checks 7–14
- **7 Symbol atlas:** findings. The table matches symbols.yaml wording, but has no typical-value column, the (2.55)
  symbols are missing, and the atlas URL is not built yet (Must 2, Should).
- **8 Anatomy and magnitude:** pass. The anatomy strip is present for (0A.1). There is no scale analysis in the block.
- **9 Reading cards:** n/a (no data figure).
- **10 Mechanism blocks:** n/a for a maths block. The "Where Vallis uses it" part has a story, an equation and a number.
- **11 Rotation sense:** pass (no clock words).
- **12 Analogies:** pass. Like… and Unlike… are both present, and the Unlike is precise (negative values, ×|b|).
- **13 Colour:** pass. Teal for a and orange for b, no colormaps. The explainer bar is teal/rose, which is fine.
- **14 No climate background:** findings. Coriolis, potential temperature and colatitude are not defined (Must 1, Should).
  Everything else is defined in place.

**Voice (Ch. 0):** pass. The voice is informal and second person ("Imagine you are standing in a flat field", "That's
the whole idea"). Each block has a heading and one idea. Precision comes in the right order: friendly paragraph → exact
(K 2.2)/(0A.1)/(0A.3) → easy | exact table → loop then vectorised scratch → library → assert. There is no "clearly",
"obviously", "simply" or "trivially" (grep: 0). The "that is like…" comparisons are present (fast cycling, mild-to-cool
day). A prediction prompt is in the explainer bullets. The only formal passages are the template boilerplate in cells
0–1.

## What works well
- The shadow story runs through the whole block: field breeze → figure → precise statement → derivation → the
  u·∇T advection number, all with the same numbers.
- The derivation is a model of the style: one move per step, an honest *why* on each step, a check, the meaning, and a
  sympy cell that re-checks the moves themselves, not only the final answer.
- The scratch code teaches with a loop first, then the vectorised form. The asserts are meaningful, and the tolerance
  comment flags the arccos-vs-atan2 trap near 0°/180°, with an atol where the true value is 0.
- The convention callouts are careful (θ angle vs potential temperature vs Kundu's latitude/colatitude; Vallis's a = Earth
  radius vs the arrow **a**; bold u horizontal vs 3-D). The sign of the advection result is explained correctly (wind up
  the gradient → cooling).
- The notebook fixes the design's arithmetic slip (0.43 → 4.32 K/day).

## Verdict: FAIL
There are 4 Must-fix items, all small and local (about 15 minutes in the builder): define Coriolis, define the (2.55)
symbols, prime vector addition/subtraction, and write out (K 2.20) or drop the bare numbers. Voice and depth are at the
standard the PoC gate asks for. After these four fixes, the block should PASS.

---

# Re-review (after fix loop 1)                                        2026-10-21

I re-read the committed `notebooks/poc_ch00a_dot.ipynb`, which is now saved with outputs: **48 cells, 15 code cells
executed in order (1–15), 0 errors**. coverage_check `ch00 --nb notebooks/poc_ch00a_dot.ipynb`: **OK, 0 errors, 3 warnings**
(the same chapter-level warnings as before, not applicable to a sample block) · crossref_check: **still missing**
(`tools/crossref_check.py`). I re-checked the links by hand and all of them resolve · sections 1/1 · CORE 1/1 · K 1/1
complete · eq-code 4/4. I looked at the saved figure (cell 10).

## Previous Must-fix: all closed
| # | Item | Status |
|---|---|---|
| 1 | Coriolis unexplained | **Fixed.** Cell 0 now explains it at first use ("anything moving seems to curve sideways: to the right in the NH, to the left in the SH"), and it is in the 📖 word list (cell 45). |
| 2 | (2.55) symbols unnamed | **Fixed.** Cell 43 lists Du/Dt, **f** = f**k** = 2Ω sin ϑ **k** (Ω and f each with easy and exact values), ρ, p and ∇_z, each with a unit and a typical value. Ω, f, ρ, p and ∇_z are added to the 📇 table. |
| 3 | Vector addition/subtraction not primed | **Fixed.** A 📎 primer (cell 15, head to tail, (2,1) − (1,3) = (1,−2)) with a numpy demo (cell 16, output `[1 −2] [2 1]`) now sits before the law-of-cosines primer and is listed under "Tools we use". |
| 4 | (K 2.20)–(K 2.21) cited by number only | **Fixed.** Both are written out in cell 43, with ε_ijk defined. I checked them against Kundu p. 52 (PDF 79): the components match (2.20) in a/b and i/j/k letters, and (a×b)_k = ε_ijk a_i b_j matches (2.21). The sign table for ε is correct (k = 3 gives a₁b₂ − a₂b₁). |

## Previous Should-fix
Fixed: the figure (the stripe is now beside b and visible, the label sits left of it, and θ is clear of the arc) · all
three K-recap parts ("What Vallis adds", "no Kundu derivation; D0A-PoC1 ours (9 steps)", and the note that
`geo.vectors.dot` wraps `core.tensors.dot`, which I confirmed in its docstring) · the §2.8 link label · the typical-value
column · the colatitude and potential-temperature half-sentences in cell 7 · the (**v**·∇)T = **v**·(∇T) bridge (cell 38) ·
∇·**v** with the Kundu 3-D note · the ∇ forward pointer · "(cross product: next block)" in the tolerance comment ·
round-off explained (cell 31) · the opening-story payoff (7.07 m/s → 6.11 K/day of cooling, sign explained) · the
"why interactive" sentence · "glyph pair" replaced.
Still open:
- **The atlas link still 404s** (`viz/atlas.html` does not exist). This blocks publishing, not the lesson.
- **`tools/crossref_check.py` still does not exist.** This is a tooling gap.
- **Potential temperature is still defined three different ways.** The 📖 glossary uses "adiabatically … 1000 hPa", the
  📇 table says "p_R", and cell 7 says "a temperature-like quantity". Make the glossary line plain: "…brought to a
  standard pressure without heating or cooling".

## New, introduced by the fixes (all Should fix)
- **An unsupported claim in cell 43.** It says "**u**·(**k**×**u**) = 0 because the turned wind is at right angles to the
  wind", but nothing in this block shows that **k**×**u** is **u** turned 90°. Add "(**k**×**u** = (−v, u, 0): **u** turned a
  quarter-turn to the left; next block)". With that, the dot product is −uv + vu = 0 and the reader can check it.
- **The Du/Dt description is simplified.** Cell 43 calls Du/Dt "the material derivative of (1.7), applied to the wind".
  On Vallis p. 66 it also carries the turning of **i** and **j** on the sphere (u Di/Dt + v Dj/Dt, (2.56)). Add "(on a
  sphere, plus a small term because east and north turn as you move)". This would match the 📇 note about **i**, **j**, **k**.
- **A stderr warning is saved under the figure.** Cell 10 shows "findfont: Failed to find font weight semibold for DejaVu
  Sans, now using 700." in its output, which would appear on the web page. Suppress it in the style setup, or use `fontweight="bold"`.

## Re-checks
- **Numbers vs outputs:** all match. Values: 2.236 · [1 −2] [2 1] · 5.0/3.606/1.0 · loop 5.000 / θ 45.0° · 1.581 ·
  (0.5, 1.5, 0) · leftover·b 1.3e-15 · 5.000e-05 K/s = 4.320 K/day · 7.071e-05 K/s = 6.11 K/day. The tolerance comment
  claims θ agrees to "1.6e-16", and I recomputed it as 1.58e-16 relative.
- **Equations vs page images:** all match. (K 2.2) and the unnumbered cosine form on Kundu p. 41/52 · (K 2.20) and
  (K 2.21) on p. 52 · Vallis (2.55) on p. 66, Du/Dt + **f**×**u** = −(1/ρ)∇_z p, with **u** = (u, v, 0) and
  **f** = 2Ω sin ϑ **k** · (1.7) as before.
- **Derivation D0A-PoC1:** unchanged and still passes. Its tool for steps 1 and 3 is now primed beforehand.
- **Voice:** still informal and second person, one idea per headed block. The new text (the Coriolis clause, the
  (2.55) symbol list, the primer, the breeze payoff) is plain and can be read aloud. A grep for
  clearly/obviously/simply/trivially returns 0. There are no clock words. "Right in the NH" is stated with the hemisphere.
- **Unexplained-first-use:** the four Must rows are now explained at first use (Coriolis in cell 0; (2.55) symbols in
  cell 43; vector add/subtract in cell 15; (K 2.20)/(K 2.21) in cell 43). Colatitude and ∇ are explained or pointed to at
  first use. There are no new missing rows; only the **k**×**u** "turned 90°" claim (Should) is new.
- **R4 checks 7–14:** 7 pass (atlas page not yet built) · 8 pass · 9 n/a · 10 n/a · 11 pass · 12 pass · 13 pass · 14 pass.

## Verdict (re-review): PASS
0 Must-fix. There are 6 Should-fix items: atlas page, crossref_check tool, potential-temperature wording, the
**k**×**u** = (−v, u, 0) line, the Du/Dt sphere note, and the font warning in the saved output.
