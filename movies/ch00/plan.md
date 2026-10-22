# Chapter 0 movies — plan

## Override (2026-10-22)
The user asked for one movie now (feedback U-A.17, `reports/ch00_poc_user_feedback.md`). This **overrides** the
`/make-movies` preconditions: the Chapter-0 batch order (batch 1 = M0-1 climate machine, M0-2 spinning planet, M0-3
reading a climate map, Q12) and `notebook: pass`. Chapter-0 curation (`analysis/ch00_curation.md`) does not exist yet,
so the concept id is the PoC id **C0A-PoC1** (the dot product). Remap it when the curation exists. Batch 1 and batch 2
are still planned as in `book.yaml`; this movie is outside both batches and does not use up a batch slot.

## Movie

| Slug | Title | Concepts | Length | Status |
|---|---|---|---|---|
| `ch00_dot_product_why` | Why times the other length? What the dot product really measures | C0A-PoC1 | 170 s (narration measured at 168.975 s, 385 words, 136.7 wpm) | storyboard + script written |

**Question it answers.** "Why is a·b the shadow of a on b *times |b|*, and not just the shadow? What do we gain?"
It gives three reasons, one scene each: (1) a·b is the same in both orders, while the shadow depends on which arrow
casts it; (2) a·b is the cheap number and the shadow comes from it (a·b/|b|), and the two are equal for unit arrows,
which is how components such as u·x̂ work; (3) physics needs both sizes: work F·d, and temperature advection
−u·∇T in K/s. The movie then covers the sign of a·b (forward, zero and backward shadows, anti-parallel = −|a||b|) and
ends on an end card.

**Why motion beats the explainer here.** The explainer `viz/ch00/vector_products_lab.html` shows one state at a
time. The user's question is about a *comparison* and a *change*, and both need a guided sequence:
- the two shadows side by side, then the two product rectangles moving into one tray with the same area;
- b shrinking to unit length while the shadow stays the same and the product becomes equal to it;
- the temperature map getting twice as steep while the shadow stays at 5 m/s and the cooling doubles;
- the shadow sliding behind the origin as b swings past 90°.
In the explainer these are things you have to discover with the sliders. In the movie they are narrated in order. The
movie also sends viewers back to the explainer (end card) so they can try it themselves.

**Reused modules.**
- House components (`movies/src/house/`): `TitleCard` (question card), `EqLine` (K 2.2, 0A.1, 0A.3, (1.7), with term
  highlight), `MapPanel` (temperature map in s6–s7), `ScaleBadge`, `LowerThird`, `EndCard`; palette `glyphA` teal and
  `glyphB` orange for the vector pair, `TERM.friction` rose for negative products.
- Explainer geometry: the dot glyph of `viz/ch00/scenes/vector_products_lab.scene.js` and the product rectangle
  ("shadow × |b| on b's line", rose and hatched when negative), drawn here in 2-D. TeX is copied from the explainer's
  equation cards (`(K 2.2)`, `(0A.1)`, `(0A.3)`, `(1.7)`).
- Physics: `fluidpy.geo.vectors` (`dot`, `norm`, `scalar_projection`, `projection`, `angle_between`, `k_cross`) and
  `fluidpy.core.kinematics.material_derivative_terms` for the advection check. All are light analytic quantities.
  The builder's `movies/data/build_ch00_ch00_dot_product_why.py` should write the scene numbers listed in the
  storyboard to `data/*.json` and a `manifest.json`, computed by these functions.

**Before the builder starts.** Add the three phrase entries in the storyboard's `lexicon_additions` to
`movies/lexicon.yaml → symbols`. They make Kokoro say the vector a as "ay" (eɪ) and not as the article.
