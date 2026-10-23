# Chapter 0 movies — plan

## Override (2026-10-22)
The user asked for one movie now (feedback U-A.17, `reports/ch00_poc_user_feedback.md`). This **overrides** the
`/make-movies` preconditions: the Chapter-0 batch order (batch 1 = M0-1 climate machine, M0-2 spinning planet, M0-3
reading a climate map, Q12) and `notebook: pass`. Chapter-0 curation (`analysis/ch00_curation.md`) does not exist yet,
so the concept id is the PoC id **C0A-PoC1** (the dot product). Remap it when the curation exists. Batch 1 and batch 2
are still planned as in `book.yaml`; this movie is outside both batches and does not use up a batch slot.

**Round-4 overrides (user, 2026-10-22), for this movie only:** length **6:00–6:10** (book.yaml `project.movie_seconds`
is 120–180 s and `tools/movie_qa.py` gates on it, so the orchestrator must pass a per-movie duration target);
**background music** (MOVIES_BUDGET.md and `knowledge/movie_patterns.md` say "no music"): our own procedural pad from
`tools/music.py` (CC0), bed about −28 LUFS, ducked a further 5 dB under speech; the size budget (≤ 25 MB per 3 min)
scales to about 50 MB for 6 min and needs the orchestrator's decision.

## Movie

| Slug | Title | Concepts | Length | Status |
|---|---|---|---|---|
| `ch00_dot_product_why` | What the dot product measures, and why it multiplies by the other length | C0A-PoC1 | 367.2 s = 6:07 (narration measured at 364.725 s, 844 words, 138.8 wpm, + 2.5-s end-card hold) | round-4 storyboard + script rewritten from the ground up (21 scenes); needs re-build |

**What it does (round 4).** Part 1 (0:00–2:28) teaches the dot product first: arrows and components with Pythagoras;
definition 1 (K 2.2) with the subscripts, the repeated index and ≡ explained; how to read the labels K, 0A and Vallis
(with a footnote strip on every frame that shows a labelled equation); the worked 8; definition 2 (0A.1) with a cosine
reminder; "how much two arrows point the same way" with 6, 0, −6; the shadow and (0A.3) derived one move per step.
Part 2 (2:28–3:30) asks "why times |b|, why not stop at the shadow?" and gives reason 1 (order), reason 2 (cheap; with a
unit arrow the dot product IS the shadow; v·x̂ = eastward part) and reason 3a (work). Part 3 (3:30–5:55) rebuilds the
weather reason slowly: Vallis (1.7) at the top first, the pole and balloon thermometers, ∇T built from two slopes,
v·∇T = (|v| cos θ)|∇T| written out, what 0.180 K per hour means (a rate in time, 18 km per hour × 1 K per 100 km),
DT/Dt = 0 and the algebra to ∂T/∂t = −v·∇T, the pole cooling, and the twice-as-steep punch line (shadow still 5 m/s,
cooling −0.360 K/h). Part 4: recap, the sign rule in one line, end card to the vector products lab.

**Why motion beats the explainer here.** The explainer `viz/ch00/vector_products_lab.html` shows one state at a
time. The user's questions are about a *sequence* (definition → shadow → why |b|) and about *changes*, which need a
guided order: the derivation strip revealing one move per sentence; b shrinking to unit length while the shadow stays;
the two shadows and the two equal-area rectangles; the balloon drifting 36 km while only 18 km of it is towards warmer
air; the pole thermometer falling while the balloon's stays at 13.00 °C; the map doubling its steepness while the shadow
stays at 5 m/s. The end card sends viewers back to the explainer to try it themselves.

**Reused modules.**
- Existing scenes in `movies/src/ch00/DotProductWhy.tsx`: the pair plane (`PairBase`, P12), `S3` (reason 1, now s10),
  `S4` (reason 2, now s11, wind renamed v, new caption), `S5` (work, now s12), the weather map kit (`TMap`, `MapFrame`,
  `ColourBar`, parcels, upwind cone, pole pin) for s14–s20, `S9` end card (now s21), plus `Gauge`, `ProdRect`, `Band`,
  `Bracket`, `Arc`, `EqBox`, `Chip`, `Card`, `Badge`.
- House components (`movies/src/house/`): `TitleCard`, `EqLine`, `DerivationStrip` (s08, s18), `ScaleBadge`,
  `EndCard`; palette `glyphA` teal / `glyphB` orange, `TERM.advection` teal, `TERM.tendency` slate, `TERM.friction`
  rose for negatives.
- **New house component needed: `Footnote`** (props: `items: string[]`, full-width strip y ≈ 1012–1072, ≥ 28 px muted
  ink on `HOUSE.panel`, joins items with " · ", wraps to two lines at most); text comes from the storyboard's
  `footnotes:` map via each scene's `footnote:` keys. Badges and grid notes move above it. Note for the orchestrator:
  player captions also sit at the bottom; consider a VTT `line:` setting in `tools/tts.py` so cues sit above the strip.
- New small illustrative icons: balloon with thermometer, pole thermometer (pin exists), crossed-out ghost arrow (s05).
- Physics: `fluidpy.geo.vectors` (`dot`, `norm`, `scalar_projection`, `projection`, `angle_between`, `k_cross`),
  `fluidpy.core.operators.gradient` (∇T on the map grid; `[0]` is ∂T/∂x for an `(ny, nx)` array) and
  `fluidpy.core.kinematics.material_derivative_terms`. `movies/data/build_ch00_dot_product_why.py` must add the new
  numbers listed in the storyboard (s02 Pythagoras, s06 cos reminder, s07 p·q, s08 a·b̂ terms, s14 balloon path, s15
  gradient, s17 18.0 / 36.0 km per hour and 13.18 °C, s19 balloon tag 13.00 °C) and rename the s4/s6/s7 wind keys
  from u to v.

**Before the builder starts.** Add to `movies/lexicon.yaml → respell`: `Vallis: "Valiss"` and `Kundu: "Koondoo"`
(checked with Kokoro phonemes; the measured timing already includes them).
