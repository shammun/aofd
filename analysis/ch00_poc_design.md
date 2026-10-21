# Chapter 0 · PoC design — how PoC A, B, F and G are taught (lesson-designer)

Input: `analysis/ch00_poc.md` (orchestrator brief). Skills followed: `teaching-style` (§1c derivations, §1d Chapter-0
voice, §1f Like…/Unlike…, §1h easy | exact, §1j scratch → library), `interactive-viz` §0–§5, `viz3d` §3–§10,
`from-scratch-code`, `cross-book-continuity`, `aofd-book`. PLANNING §8.1, §8.2, §9.1 (E01 row), §15.1, §15.5; R2 §3.3,
§8.2; R4 §1–§2.

## 0 · Equations checked on page images (read, not recalled)

| Where | Rendered page (private, git-ignored) | What is on it |
|---|---|---|
| Kundu App. B p. 5 (printed 861) | `chapters/pages/kundu_appB/p05.png` | (B.2.2) Galilean change of variables, (B.2.3) similarity variable; **B.3 Basic Vector Calculus** begins (∇ as a vector operator) |
| Kundu App. B p. 6 (printed 862) | `chapters/pages/kundu_appB/p06.png` | **unnumbered** Cartesian ∇, grad, div (a dot product with ∇), curl (determinant); identities **(B.3.1)–(B.3.13)**; Gauss and Stokes (unnumbered) |
| Kundu ch02 p. 52 (PDF 79) | `../Fluid Dynamics/chapters/pages/ch02/p079.png` (read-only) | **u·v = uv cos θ** (unnumbered; Exercises 2.12–2.13); cross product magnitude uv sin θ and right-handed direction (unnumbered text); **(K 2.20)** components of u×v; determinant form (unnumbered); **(K 2.21)** (u×v)_k = ε_ijk u_i v_j |
| Kundu ch02 p. 51 (PDF 78, via `ch02.txt` line 920 ff.) | — | dot product definition u·v = u₁v₁ + u₂v₂ + u₃v₃ = u_iv_i — **unnumbered** (§2.8) |
| Vallis p. 5 (PDF 25) | `chapters/pages/ch01/p025.png` | **(1.6)** dφ/dt = ∂φ/∂t + v·∇φ; **(1.7)** Dφ/Dt = ∂φ/∂t + (v·∇)φ; (1.8)–(1.11) |
| Vallis p. 66 (PDF 86) | `chapters/pages/ch02/p086.png` | **(2.55)** Du/Dt + f×u = −(1/ρ)∇_z p, with **f = f k = 2Ω sin ϑ k** (unnumbered definition; f ≡ 2Ω sin ϑ is defined in the text after (2.51), p. 65) |
| Vallis p. 91 (PDF 111) | `chapters/pages/ch02/p111.png` | (2.210a,b) −f v_g = −∂ϕ/∂x = −(1/(a cos ϑ))∂ϕ/∂λ, f u_g = −∂ϕ/∂y = −(1/a)∂ϕ/∂ϑ; **(2.215)** f × u_g = −∇_p Φ (geostrophic balance in pressure coordinates, Φ = geopotential) |

**Consequence for numbering.** Kundu Appendix B has **no number** for the dot product, for a·b = |a||b| cos θ or
for |a×b| = |a||b| sin θ — B.3 only *uses* "·" and "×" inside the unnumbered ∇ definitions and in (B.3.1)–(B.3.13).
So on screen and in the notebook we write: the definition "(Kundu §2.8, unnumbered; used in App. B §B.3)", the cosine
form "(Kundu §2.8, unnumbered)", the cross-product components **(K 2.20)**, index form **(K 2.21)**, and our own derived
results get **our** labels **(0A.1)** (cosine form, derived in D0A-PoC1) and **(0A.2)** (sine/area form, D0A-PoC2) so
that the "equation shown with its number" rule still holds without inventing a Kundu number. `coverage_check.py`
must accept `(0A.n)` as a Chapter-0 label (open question Q1).

Exact TeX used everywhere below (copy, never retype):
```
DOT_DEF  \mathbf a\cdot\mathbf b = a_1b_1 + a_2b_2 + a_3b_3 = a_ib_i                        (Kundu §2.8, unnumbered; App. B §B.3)
0A.1     \mathbf a\cdot\mathbf b = |\mathbf a|\,|\mathbf b|\cos\theta                          (0A.1)  [Kundu §2.8, unnumbered]
K2.20    \mathbf a\times\mathbf b = (a_2b_3-a_3b_2)\,\mathbf i + (a_3b_1-a_1b_3)\,\mathbf j + (a_1b_2-a_2b_1)\,\mathbf k   (K 2.20)
K2.21    (\mathbf a\times\mathbf b)_k = \varepsilon_{ijk}\,a_ib_j                               (K 2.21)
0A.2     |\mathbf a\times\mathbf b| = |\mathbf a|\,|\mathbf b|\sin\theta = \text{area of the parallelogram}   (0A.2)
PROJ     \text{shadow length } = |\mathbf a|\cos\theta = \frac{\mathbf a\cdot\mathbf b}{|\mathbf b|},\quad
         \text{shadow vector } = \frac{\mathbf a\cdot\mathbf b}{|\mathbf b|^2}\,\mathbf b      (0A.3, ours)
V1.7     \frac{D\varphi}{Dt} = \frac{\partial\varphi}{\partial t} + (\mathbf v\cdot\nabla)\varphi   (1.7)
V2.55    \frac{D\mathbf u}{Dt} + \mathbf f\times\mathbf u = -\frac{1}{\rho}\nabla_z p,\qquad \mathbf f = f\mathbf k = 2\Omega\sin\vartheta\,\mathbf k   (2.55)
V2.215   \mathbf f\times\mathbf u_g = -\nabla_p\Phi                                              (2.215)
```
Vallis writes bold **f** for f**k** in (2.55) and (2.215); we write `f\,\mathbf k\times\mathbf u` in Chapter 0 and add
"(Vallis writes this as **f** × **u**)" the first time (a `> ⚠️ Which convention?` one-liner).

---

# Part E · Explainer storyboard

### E1 · vector_products_lab

| Field | Value |
|---|---|
| File | `viz/ch00/vector_products_lab.html` (`tools/new_viz.py --3d ch00 vector_products_lab`; scene source `viz/ch00/scenes/vector_products_lab.scene.js`) |
| Title (question) | **What do a·b and a×b actually measure?** |
| Subtitle | Drag two arrows in 3-D: the dot product is a signed shadow, the cross product is an area that points. |
| IDs | C0A-PoC1 (dot product), C0A-PoC2 (cross product); derivations D0A-PoC1, D0A-PoC2; Chapter-0 explainer E01 |
| Metas | `viz:chapter ch00` · `viz:slug vector_products_lab` · `viz:order 1` · `viz:3d 1` · `viz:kundu rossby_waves` (format exemplar; content cousin: fluidpy ch02 C08 / `rotation_of_axes`) · `viz:derivations D0A-PoC1 D0A-PoC2` · `viz:equations DOT_DEF 0A.1 K2.20 0A.2 0A.3 1.7 2.55` · `viz:fluidpy fluidpy.geo.vectors` · `viz:data none` |
| Exemplars to open first | `../Fluid Dynamics/viz/ch13/rossby_waves.html` (one clock, faint-whole + bold-so-far curve, Explain depth), `../Fluid Dynamics/viz/ch13/ekman_spiral.html` (one cursor across 3-D + 2-D), `templates/viz_example_3d.html` |
| 3-D decision | **Yes.** The cross product's answer points *out of* the plane of a and b; on a flat page the result arrow collapses to a dot or a "⊙" symbol and the right-hand rule becomes a memorised trick. Orbiting shows (i) the result arrow standing ⟂ to the parallelogram, (ii) the shadow drop-line ⟂ to b, (iii) that a general pair (preset "tilted") lives in a tilted plane, not the x–y plane. This is the "earn the third dimension" case of R2 §6.1. |

**JS physics mirrors** (pure functions, same names and argument order as Python; arrays are `[x, y, z]`):

| JS | Python twin (to be implemented by the concept-implementer; names from the brief) |
|---|---|
| `dot(a, b)` | `fluidpy.geo.vectors.dot(a, b)` |
| `cross(a, b)` | `fluidpy.geo.vectors.cross(a, b)` |
| `norm(a)` | `fluidpy.geo.vectors.norm(a)` |
| `angleBetween(a, b)` (rad) | `fluidpy.geo.vectors.angle_between(a, b)` (rad; `degrees=False`) |
| `scalarProjection(a, b)` | `fluidpy.geo.vectors.scalar_projection(a, b)` = a·b/\|b\| |
| `projection(a, b)` | `fluidpy.geo.vectors.projection(a, b)` = (a·b/\|b\|²) b |
| `parallelogramArea(a, b)` | `fluidpy.geo.vectors.parallelogram_area(a, b)` |
| `tripleScalar(a, b, c)` | `fluidpy.geo.vectors.triple_scalar(a, b, c)` |
| `kCross(u)` → (−u_y, u_x, 0) | `fluidpy.geo.vectors.k_cross(u)` |
Reuse rule: `geo.vectors.dot/cross/angle_between` should wrap `fluidpy.core.tensors.dot/cross/angle_between`
(kundu_index ch02 C08), not copy them.

#### Views (one state, one clock; ≤ 3 views)

| id | Row / flex | What it draws | Linked how |
|---|---|---|---|
| `scene3d` | row 0, flex 1.5 | **3-D arrow scene** (Part H · H1): a teal, b orange from the origin; **dot glyph** = shadow of a on b's line (thick teal segment on b's line + dashed drop-line from a's tip, right-angle tick) and a **signed bar** standing beside the origin (teal up if a·b > 0, rose-dashed down if < 0, height = a·b); **cross glyph** = translucent parallelogram (violet α 0.18), curled arc from a to b (24-point line, arrowhead at b), **result arrow** a×b (violet, ⟂ the plane, length = area); E/N/U triad labelled x (east), y (north), z (up); light grid on z = 0 | drag either tip → `app.set({ax, ay, az})` / `({bx, by, bz})` (drag in the plane facing the camera; shift-drag or the z slider moves z) |
| `flat` | row 0, flex 1 | **2-D projection / component view**, two modes (chip in the view title): **"face-on"** (default) = the a–b plane drawn true-shape (θ arc labelled with degrees, shadow segment, parallelogram, signed bar on the right edge); **"x–y components"** = the map view looking down z with component ticks a_x, a_y, b_x, b_y dashed to the axes and the products a_xb_x, a_yb_y as labelled rectangles (area = product, teal if > 0, rose hatched if < 0) — the picture of a₁b₁ + a₂b₂ + a₃b₃ | same state; clicking a rectangle highlights the matching term in the readout table and the Explain line |
| `curves` | row 1, flex 1 (`hidePortrait` swapped by step, see fit plan) | **θ-curves**: faint whole curves over θ ∈ [0°, 180°] of a·b = \|a\|\|b\|cos θ (teal) and \|a×b\| = \|a\|\|b\| sin θ (violet) for the current lengths; bold "so far" part during a sweep; dot at the current θ; ghost dashed line at ±\|a\|\|b\| (the biggest possible value); markers at 0°, 90°, 180° labelled "parallel", "perpendicular", "anti-parallel" | θ cursor = state; dragging the dot along the axis sets θ (rotates b in the a–b plane, lengths kept) |

**Readout table** (`readouts`, shown under the stage; ≤ 22-char labels; the same values feed Explain and Code):

| id | Label | Value |
|---|---|---|
| `a` | a = (a_x, a_y, a_z) | (2, 1, 0) |
| `b` | b = (b_x, b_y, b_z) | (1, 3, 0) |
| `na`, `nb` | \|a\|, \|b\| | 2.236, 3.162 |
| `theta` | angle θ | 45.0° |
| `dot` | a·b | 5.000 |
| `sproj` | shadow \|a\|cos θ | 1.581 |
| `cross` | a×b | (0, 0, 5) |
| `area` | area \|a×b\| | 5.000 |
| `fkxu` (preset f k×u only) | f k×u [m s⁻²] | (−6.19e-4, 8.25e-4, 0) |

**Terms panel** (decomposition, depth feature): title "a·b, term by term", items a_xb_x = 2, a_yb_y = 3, a_zb_z = 0
(teal/teal/teal, negative ones rose), total 5 — click a term to isolate its rectangle in `flat`.

#### Params (Explore shows ≤ 5; the rest `optional`)

| key | type | range / default | Explore? |
|---|---|---|---|
| `ax, ay, az` | sliders | −5…5, step 0.1; (2, 1, 0) | `ax, ay` shown; `az` optional |
| `bx, by, bz` | sliders | −5…5, step 0.1; (1, 3, 0) | `bx, by` shown; `bz` optional |
| `show` | select chips | `dot` · `cross` · `both` (default `both`) | yes |
| `hemi` | toggle (only meaningful in preset f k×u) | NH (f > 0) / SH (f < 0) | optional |
| `lat` | slider (f k×u only) | −90…90°, 45° | optional |
| `t` | transport angle φ | 0…360° | (transport) |

`modes`: `{param: 'show', options: [['dot','a·b'],['cross','a×b'],['both','both']]}`.

#### Presets (chips; each `set` carries its distinguishing values — ch15 lesson)

| Label | set | Title / what it shows |
|---|---|---|
| **45°** (default) | a = (2, 1, 0), b = (1, 3, 0) | a·b = 5, \|a×b\| = 5, θ = 45°: dot and area happen to be equal (cos 45° = sin 45°) |
| **perpendicular** | a = (2, 1, 0), b = (−1, 2, 0) | a·b = 0 (no shadow), area 5 = \|a\|\|b\| (the biggest) |
| **parallel** | a = (2, 1, 0), b = (4, 2, 0) | a·b = 10 = \|a\|\|b\|, area 0, result arrow vanishes |
| **anti-parallel** | a = (2, 1, 0), b = (−4, −2, 0) | a·b = −10, shadow points backwards, signed bar goes down |
| **tilted** | a = (1, 2, 2), b = (3, 0, 0) | a general 3-D pair: θ = 70.53°, a·b = 3, a×b = (0, 6, −6), area 8.485 — the plane is tilted, so the result arrow is not vertical |
| **f k×u** | a = k = (0, 0, 1) (label "**k**, up"), b = u = (8, 6, 0) m s⁻¹ (label "**u**, wind"), lat = 45° | k×u = (−6, 8, 0): the wind turned **90° to the left**, same length 10; f = 2Ω sin 45° = 1.031e-4 s⁻¹ (easy 1e-4); f k×u = (−6.19e-4, 8.25e-4, 0) m s⁻²; ghost arrow **−f k×u** (violet dashed) = the Coriolis acceleration, pointing to the **right** of the wind (NH). `hemi` flip → f < 0 → both arrows flip |

#### Transport (what animates)
`transport: {param: 't', min: 0, max: 360, rate: 30 /* deg per s */, end: 'loop', unit: '°'}`. **b rotates
in the a–b plane** at fixed length: b(φ) = \|b\|(cos(θ₀+φ) â + sin(θ₀+φ) ê), ê = unit vector ⟂ a in the original a–b
plane (for parallel pairs ê = k×â, or x̂ if â ∥ k). As it turns: the shadow slides and shrinks through zero at 90°
and goes negative past it; the signed bar breathes as a cosine; the parallelogram opens and closes as \|sin\|; the
result arrow shrinks to zero at 180° and **flips through the plane** (θ > 180° measured one way = b now on the other
side → right-hand rule reverses). The `curves` view draws the bold "so far" part. Scrubbing is exact (closed form,
f(t)). The arc animation of the right-hand rule ("fingers curl from a to b") plays once on step 6 (`enter`), 1.2 s.

#### Status verdicts (`status: s => …`)
| Condition (θ in degrees, tolerance 0.5°) | Text | Tone |
|---|---|---|
| \|a\| or \|b\| < 1e-9 | "⚪ a zero arrow: no direction, everything is 0" | warn |
| θ < 0.5 | "∥ parallel: full shadow (a·b = \|a\|\|b\|), no area" | info |
| θ > 179.5 | "⇅ anti-parallel: shadow points backwards (a·b < 0), no area" | info |
| \|θ − 90\| < 0.5 | "⟂ perpendicular: no shadow (a·b = 0), biggest area" | key |
| θ < 90 | "↗ acute: a helps along b (a·b > 0)" | info |
| θ > 90 | "↙ obtuse: a works against b (a·b < 0)" | info |
| preset f k×u active | prefix "↺ k×u = wind turned 90° left; Coriolis −f k×u points right (NH)" / "… left (SH)" | key |

#### Walkthrough (8 steps; each = one camera preset + one new layer; ≤ 45 words)

| # | Title | Camera (Part H presets) | New layer | Text (draft) | set / extras |
|---|---|---|---|---|---|
| 1 | Two arrows, one question | `iso` | a, b arrows + component table | "Here are two arrows, a = (2, 1, 0) and b = (1, 3, 0). Multiplying numbers is easy. What could it mean to multiply two *arrows*? There are two answers, and each one measures something you can see." | preset 45°; `flat` view shown |
| 2 | The shadow | `faceOn` (looking down the a–b plane normal) | shadow segment + drop line + right-angle tick | "Shine a light straight down onto b's line. a's shadow is 1.58 long. That shadow, \|a\| cos θ, is 'how much of a points along b'." | readout `sproj` highlighted; eq PROJ |
| 3 | Signed bar = a·b | `faceOn` | signed bar + terms panel (a_xb_x + a_yb_y) | "Shadow times \|b\| gives a·b = 1.58 × 3.16 = 5. And the components say the same: 2·1 + 1·3 = 5. Two routes, one number — the Derivation tab proves why." | eq DOT_DEF + 0A.1 live; `derive: {id:'D0A-PoC1', step: 9}` |
| 4 | Sweep the angle | `iso` | `curves` view (swap in on phones) | "Press ▶. b swings round. The bar rises and falls like a cosine: positive while the angle is acute, zero at 90°, negative beyond. Perpendicular arrows have a dot product of exactly zero." | `play: true`; code line `dot` lit |
| 5 | The parallelogram | `iso` | parallelogram + area readout | "Now the second product. a and b span a parallelogram. Its area is base × height = \|a\| × \|b\| sin θ = 5. Area is biggest when they are perpendicular and zero when parallel." | preset 45°; eq 0A.2 live |
| 6 | The answer points | `edgeOn` (camera in the a–b plane) | arc a→b + result arrow a×b | "a×b is not just a number: it is an arrow standing straight out of the parallelogram, as long as the area. Curl your right-hand fingers from a to b; your thumb points along it: (0, 0, 5)." | eq K2.20 live; arc animation once |
| 7 | f k×u turns the wind | `top` | preset f k×u + ghost −f k×u (Coriolis) | "Take a = k (straight up) and b = a wind u. k×u is the wind turned 90° left. Times f = 1.03×10⁻⁴ s⁻¹ this is the Coriolis term of Vallis (2.55); with the minus sign it pushes to the right." | eq V2.55 written; status prefix |
| 8 | Your turn: predict | `iso` | (hands over controls `ax ay bx by show`) | "Predict first, then test: swap a and b — what happens to a·b, and to a×b? Then flip to the southern hemisphere in the f k×u preset: which way does the Coriolis arrow point now?" | `callout: {kind:'try'}` |

#### Explain tab ("Explanation & interpretation", `Viz.work`, live numbers)
1. **What you are looking at.** Teal = a, orange = b, thick teal on b's line = the shadow, the bar = a·b (teal above 0,
   rose dashed below), violet = parallelogram, arc and a×b. Hint: "On phones the θ-curves view is hidden; turn the
   phone sideways or use step 4."
2. **The dot product with your numbers.** line `a·b = a_xb_x + a_yb_y + a_zb_z = 2·1 + 1·3 + 0·0` → **5** (why: the
   component definition, Kundu §2.8, written out); lines for \|a\| = √(2²+1²+0²) = 2.236, \|b\| = 3.162; cos θ =
   5/(2.236 × 3.162) = 0.7071 → θ = 45.0° (why: (0A.1) solved for cos θ); box: a·b = \|a\|\|b\|cos θ = 5.
3. **The shadow.** scalar projection a·b/\|b\| = 5/3.162 = **1.581** (drawn length of the thick teal segment);
   shadow vector (a·b/\|b\|²) b = 0.5 b = (0.5, 1.5, 0) (the segment's end point). Sign: negative means the shadow
   points backwards along b.
4. **The cross product with your numbers.** (K 2.20) line by line: x: a_yb_z − a_zb_y = 1·0 − 0·3 = 0; y: a_zb_x −
   a_xb_z = 0; z: a_xb_y − a_yb_x = 2·3 − 1·1 = **5**; area check \|a\|\|b\| sin θ = 7.071 × 0.7071 = 5.000 (why: (0A.2));
   box: a×b = (0, 0, 5).
5. **Checks you can see.** (a×b)·a = 0 and (a×b)·b = 0 (live, shown as 0 within 1e-12: the result is ⟂ both);
   (a·b)² + \|a×b\|² = \|a\|²\|b\|² → 25 + 25 = 50 ✓ (Lagrange; D0A-PoC2 step 6); b×a = −(a×b) = (0, 0, −5).
6. **f k×u (shown when the preset is on).** f = 2Ω sin ϑ = 2 × 7.292×10⁻⁵ × sin 45° = 1.031×10⁻⁴ s⁻¹ (easy 10⁻⁴);
   k×u = (−u_y, u_x, 0) = (−6, 8, 0); f k×u = (−6.19, 8.25, 0)×10⁻⁴ m s⁻²; Coriolis acceleration −f k×u points to the
   right of u in the NH (left in the SH, f < 0). Vallis (2.55) written out. "That is like a speed change of 0.9 m/s
   every quarter of an hour, sideways — tiny, but it never stops."
7. **Reading the current setting** (`Viz.work.interpret`, regime-dependent): acute → "a has a positive share along b:
   pushing along b with a would do positive work"; perpendicular → "a has no share along b — in Vallis this is wind
   blowing *along* the temperature contours, u·∇T = 0, so the wind brings no warmer or colder air"; obtuse → "…cold
   advection…"; parallel → "no turning: the cross product is zero"; f k×u → "the Coriolis term never speeds the wind up
   or slows it down: −f k×u is ⟂ u, so u·(−f k×u) = 0". Last line: "From Kundu: ch02 §2.8 and C08
   [link](https://shammun.github.io/fluidpy/notebooks/ch02_cartesian_tensors.html#%F0%9F%A7%A9-The-alternating-tensor-%CE%B5_ijk-C08)".

#### Derivation tab

**D0A-PoC1 · a·b = |a||b| cos θ from components (★★, 9 steps)**
- Goal (plain): show that the "multiply matching components and add" recipe and the "shadow times length" picture are
  the same number, for any two arrows.
- Start: DOT_DEF `\mathbf a\cdot\mathbf b = a_1b_1+a_2b_2+a_3b_3`. Plan: (1) build a triangle from a, b and a − b;
  (2) measure the third side two ways — geometry (law of cosines) and components (Pythagoras); (3) set them equal and
  cancel. Tools: Pythagoras in 3-D \|c\|² = c₁²+c₂²+c₃² (📎 P0-xx), law of cosines (📎 primer before the derivation),
  (x − y)² = x² − 2xy + y². Assumption: neither arrow is zero (else θ is undefined and both sides are 0).

| k | Did | Line | Why | In words |
|---|---|---|---|---|
| 1 | Draw the third side | `\mathbf c = \mathbf a - \mathbf b` | head-to-tail: b + c = a; we want a triangle whose sides we know | c runs from b's tip to a's tip |
| 2 | Law of cosines on that triangle | `|\mathbf a-\mathbf b|^2 = |\mathbf a|^2+|\mathbf b|^2-2|\mathbf a||\mathbf b|\cos\theta` | true for any triangle; θ is the angle between sides a and b | the geometry route to the third side |
| 3 | Same side by Pythagoras | `|\mathbf a-\mathbf b|^2=(a_1-b_1)^2+(a_2-b_2)^2+(a_3-b_3)^2` | a length² is the sum of squared components | the component route |
| 4 | Expand one bracket | `(a_1-b_1)^2=a_1^2-2a_1b_1+b_1^2` | (x−y)² rule; the other two are the same with 2, 3 | each bracket gives an a², a b², and a cross term |
| 5 | Expand all and group | `=(a_1^2+a_2^2+a_3^2)+(b_1^2+b_2^2+b_3^2)-2(a_1b_1+a_2b_2+a_3b_3)` | addition can be reordered | squares of a, squares of b, and the mixed products |
| 6 | Recognise the pieces | `=|\mathbf a|^2+|\mathbf b|^2-2\,\mathbf a\cdot\mathbf b` | Pythagoras twice + DOT_DEF | the mixed products *are* the dot product |
| 7 | Set the two routes equal | `|\mathbf a|^2+|\mathbf b|^2-2\,\mathbf a\cdot\mathbf b=|\mathbf a|^2+|\mathbf b|^2-2|\mathbf a||\mathbf b|\cos\theta` | both equal \|a − b\|² (steps 2 and 6) | same side, two descriptions |
| 8 | Cancel the squares | `-2\,\mathbf a\cdot\mathbf b=-2|\mathbf a||\mathbf b|\cos\theta` | subtract \|a\|² + \|b\|² from both sides | only the mixed part was ever different |
| 9 | Divide by −2 | `\mathbf a\cdot\mathbf b=|\mathbf a||\mathbf b|\cos\theta` **(0A.1)** | −2 ≠ 0 | component recipe = length × length × cos θ; live: `5 = 2.236 × 3.162 × cos 45.0°` |
- Result + meaning: \|a\| cos θ is a's shadow on b, so a·b = (shadow) × \|b\|. Check: units (product of the two units);
  a = b → \|a\|² (θ = 0); i·j = 0 (θ = 90°); numbers 2·1 + 1·3 = 5 = √5·√10·cos 45°. Traps: θ is the angle *between* the
  arrows (0…180°), not an angle to the x-axis; the law of cosines also holds for a flat (degenerate) triangle, so
  θ = 0° and 180° need no special case. Step 2 `set`: preset 45° with c drawn dashed in `flat`; step 9 `live`.

**D0A-PoC2 · |a×b| = |a||b| sin θ = parallelogram area (★★, 10 steps)**
- Goal: show that the length of the (K 2.20) arrow is the parallelogram's area. Start: (K 2.20). Plan: square the
  length, spot Lagrange's identity, use (0A.1), then base × height. Tools: D0A-PoC1, sin²θ + cos²θ = 1, area of a
  parallelogram = base × height (📎). Assumption: 0 ≤ θ ≤ 180°, so sin θ ≥ 0.

| k | Did | Line | Why | In words |
|---|---|---|---|---|
| 1 | Write the components | `\mathbf a\times\mathbf b=(a_2b_3-a_3b_2,\;a_3b_1-a_1b_3,\;a_1b_2-a_2b_1)` (K 2.20) | the definition we start from | three "criss-cross" differences |
| 2 | Square the length | `|\mathbf a\times\mathbf b|^2=(a_2b_3-a_3b_2)^2+(a_3b_1-a_1b_3)^2+(a_1b_2-a_2b_1)^2` | Pythagoras | length² = sum of squared components |
| 3 | Expand the first bracket | `(a_2b_3-a_3b_2)^2=a_2^2b_3^2-2a_2a_3b_2b_3+a_3^2b_2^2` | (x−y)² rule | two "off-diagonal" squares and one mixed term |
| 4 | Collect all three | `=\sum_{i\neq j}a_i^2b_j^2-2(a_1a_2b_1b_2+a_2a_3b_2b_3+a_3a_1b_3b_1)` | the other two brackets are the same with indices cycled | six squares a_i²b_j² with i ≠ j, minus the mixed terms |
| 5 | Add and subtract a₁²b₁² + a₂²b₂² + a₃²b₃² | `=\Big(\sum_{i,j}a_i^2b_j^2\Big)-\Big(\sum_i a_i^2b_i^2+2\sum_{i<j}a_ib_ia_jb_j\Big)` | adding zero; completes both groups | now each bracket is a famous product |
| 6 | Recognise them (Lagrange) | `|\mathbf a\times\mathbf b|^2=|\mathbf a|^2|\mathbf b|^2-(\mathbf a\cdot\mathbf b)^2` | (Σa_i²)(Σb_j²) has all nine terms; (Σa_ib_i)² = squares + 2 × pairs | area² + dot² = \|a\|²\|b\|²; live `25 = 50 − 25` |
| 7 | Use D0A-PoC1 | `|\mathbf a\times\mathbf b|^2=|\mathbf a|^2|\mathbf b|^2-|\mathbf a|^2|\mathbf b|^2\cos^2\theta` | (0A.1) squared | — |
| 8 | Factor | `=|\mathbf a|^2|\mathbf b|^2(1-\cos^2\theta)` | common factor | — |
| 9 | sin² + cos² = 1, square root | `|\mathbf a\times\mathbf b|=|\mathbf a||\mathbf b|\sin\theta` | sin θ ≥ 0 on 0…180°, so the root is the positive one | the length of a×b grows as sin θ |
| 10 | Base × height | `\text{area}=|\mathbf a|\,(|\mathbf b|\sin\theta)=|\mathbf a\times\mathbf b|` **(0A.2)** | a parallelogram's area is base × perpendicular height; the height is the part of b ⟂ a | the arrow's length *is* the area; live `7.071 × 0.7071 = 5` |
- Check: a ∥ b → 0; i×j = k, length 1 = 1·1·sin 90°; numbers (0, 0, 5). Direction (not proved by length): expand
  a·(a×b) = a₁(a₂b₃ − a₃b₂) + a₂(a₃b₁ − a₁b₃) + a₃(a₁b₂ − a₂b₁) = 0 term by term (shown as a closing check, selftest
  invariant). Meaning: in (2.55) \|f k×u\| = f\|u\| because k ⟂ u (θ = 90°): Coriolis turns the wind at full strength
  and never changes its speed. Traps: forgetting the 2 in the mixed terms; taking sin θ negative.

#### Equations tab (each written out, live where marked)
DOT_DEF (live components) · (0A.1) (live θ) · (0A.3) shadow (live) · (K 2.20) (live components) · determinant form
(unnumbered, Kundu §2.8) · (K 2.21) ε form (B depth, static, symbols card ε_ijk) · (0A.2) (live area) · Vallis (1.7)
`Dφ/Dt = ∂φ/∂t + (v·∇)φ` (where the dot product lives in Vallis; note "v·∇ is a dot product of the wind with the
gradient arrow") · Vallis (2.55) with f = 2Ω sin ϑ k (where k×u lives) · forward pointer (B.3.8)
`∇·(u×F) = (∇×u)·F − u·(∇×F)` as "dot and cross together, Chapter 0A §identities". Each card carries its symbol list
(`a, b, θ, i j k, ε_ijk, f, Ω, ϑ`) with units.

#### Code tab (synced; lines lit by steps 3, 4, 6, 7; `{{live}}` values)
```python
import numpy as np
from fluidpy.geo import vectors as V          # the tested vector toolkit (Chapter 0A)

a = np.array([{{ax}}, {{ay}}, {{az}}])          # arrow a (teal)
b = np.array([{{bx}}, {{by}}, {{bz}}])          # arrow b (orange)
print(V.dot(a, b))                            # a·b = {{dot}}  (sum of matching products)
print(np.degrees(V.angle_between(a, b)))      # θ = {{theta}}°
print(V.scalar_projection(a, b))              # shadow |a|cos θ = {{sproj}}
print(V.projection(a, b))                     # shadow as a vector = {{proj}}
print(V.cross(a, b))                          # a×b = {{cross}}  (K 2.20)
print(V.parallelogram_area(a, b))             # area = {{area}} = |a||b| sin θ
u = np.array([8.0, 6.0, 0.0])                 # wind [m/s] (preset f k×u)
f = 2 * 7.292e-5 * np.sin(np.radians({{lat}}))  # f = 2Ω sin ϑ = {{f}} 1/s
print(f * V.k_cross(u))                       # f k×u = {{fkxu}} m/s²
```

#### Check yourself (≥ 3; answerable by experimenting)
1. Drag b until a·b = 0. What is θ, and what happened to the area? — *90°; the area is as large as it can be,
   \|a\|\|b\|, because sin 90° = 1. No shadow, all height.*
2. Swap a and b (type the numbers). What changes? — *a·b stays 5 (order does not matter for a shadow product); a×b
   becomes (0, 0, −5): the fingers now curl from b to a, so the thumb flips.*
3. Double \|b\| (b = (2, 6, 0)). — *a·b and the area both double to 10; θ is unchanged — both products scale with each
   length.*
4. Preset f k×u, then flip to the SH. Which way is the Coriolis arrow −f k×u? — *To the left of the wind: f < 0
   flips the sign, so the same k×u arrow now gets multiplied by a negative number.*
5. Can \|a×b\| ever be bigger than \|a\|\|b\|? — *No: sin θ ≤ 1. Step 6 of D0A-PoC2 says area² = \|a\|²\|b\|² − (a·b)².*

#### Depth features (≥ 2; this has 7)
linked views (3) · transport (angle sweep) · presets (6) · status · terms (component bars that sum to a·b) ·
inspector (click either tip: `a·b = 2×1 + 1×3 + 0×0 = 5`; click the result arrow: the three (K 2.20) lines) ·
modes (dot / cross / both) · **3-D view** · anatomy (hover cards on a, b, θ, k, f from `knowledge/symbols.yaml` via
`Viz.symbols`).

#### selftest() rows (rtol stated; `py:` calls `fluidpy.geo.vectors`)
| name | js | py | rtol / atol |
|---|---|---|---|
| dot 45° | `dot([2,1,0],[1,3,0])` | `fluidpy.geo.vectors.dot([2,1,0],[1,3,0])` | 1e-12 |
| dot tilted | `dot([1,2,2],[3,0,0])` | `…dot([1,2,2],[3,0,0])` | 1e-12 |
| dot perpendicular | `dot([2,1,0],[-1,2,0])` | `…dot(…)` | atol 1e-15 (true 0) |
| cross 45° (3 rows x,y,z) | `cross([2,1,0],[1,3,0])[i]` | `…cross(…)[i]` | atol 1e-12 |
| cross tilted (3 rows) | `cross([1,2,2],[3,0,0])[i]` → (0, 6, −6) | `…cross(…)[i]` | atol 1e-12 |
| norm | `norm([1,2,2])` = 3 | `…norm([1,2,2])` | 1e-12 |
| angle 45° | `angleBetween([2,1,0],[1,3,0])` = π/4 | `…angle_between(…)` | 1e-12 |
| angle tilted | 1.230959417 rad | `…angle_between([1,2,2],[3,0,0])` | 1e-12 |
| scalar projection | `scalarProjection([2,1,0],[1,3,0])` = 1.5811 | `…scalar_projection(…)` | 1e-12 |
| projection y | `projection([2,1,0],[1,3,0])[1]` = 1.5 | `…projection(…)[1]` | 1e-12 |
| area | `parallelogramArea([1,2,2],[3,0,0])` = 8.48528 | `…parallelogram_area(…)` | 1e-12 |
| triple | `tripleScalar([1,0,0],[0,1,0],[0,0,1])` = 1 | `…triple_scalar(…)` | 1e-12 |
| k_cross | `kCross([8,6,0])` → (−6, 8, 0) (2 rows) | `…k_cross([8,6,0])[i]` | 1e-12 |
| f at 45° | `2*OMEGA*Math.sin(Math.PI/4)` | `fluidpy.core.rotating.coriolis_parameter(np.pi/4)` | 1e-6 (Ω constant 7.292e-5 vs library value; state which) |
| **invariant** result ⟂ a | `dot(cross(a,b), a)` for the current state and 3 random seeded pairs | expect 0 | atol 1e-9·\|a\|²\|b\| |
| **invariant** result ⟂ b | `dot(cross(a,b), b)` | expect 0 | same |
| **invariant** shadow length drawn = scalar projection | length of the drawn shadow segment (read from the glyph geometry `S.layer('glyph').shadowLength`) − `scalarProjection(a,b)` | expect 0 | atol 1e-9 |
| **invariant** result-arrow length drawn = area | glyph result length − `parallelogramArea` | expect 0 | atol 1e-9 |
| **invariant** Lagrange | `dot(a,b)**2 + norm(cross(a,b))**2 - norm(a)**2*norm(b)**2` | 0 | atol 1e-9 |
| **invariant** sweep closes | b(φ = 360°) − b(0) | 0 | atol 1e-12 |
| proj3 fallback | fallback draws the result arrow end point = `cross(a,b)` | expect | atol 1e-9 |

#### `Viz.proj3` fallback picture (no WebGL / CDN down)
`Viz.proj3(view, {theta: 40°, phi: 25°})` draws: axes triad (x, y, z labelled), a (teal arrow), b (orange arrow),
shadow as a thick teal line on b's direction plus dashed drop-line, parallelogram as a filled polygon (violet α 0.18),
the arc as a 24-point polyline, the result arrow (violet), the signed bar as a vertical line at the origin offset;
labels "a", "b", "a×b", "a·b = 5". Orbit by drag still works. Every tab teaches unchanged; the status line adds
"(3-D drawn without WebGL)".

#### Fit plan (no scrolling at the 8 sizes)
Wide: `scene3d` (left, flex 1.5) + `flat` (right) on row 0, `curves` row 1 (0.6). Landscape phone: `scene3d` + `flat`
only. **Portrait phone: `scene3d` + one 2-D view, swapped by step**: steps 1–3 `flat`, steps 4 `curves`, steps 5–8
`flat`; Explore shows `flat`; a hint in Explain §1 names the hidden one. The status is ≤ 1 line on phones (short
form "⟂ perpendicular · a·b = 0"); step 4's key number (θ, a·b) is repeated in the `scene3d` title so the phone reader
never needs the hidden view (ch01 lesson).

---

# Part H · 3-D scene specs

### H1 · scene for E1 vector_products_lab (`viz/ch00/scenes/vector_products_lab.scene.js`)
- `Viz3D.scene(g.view('scene3d'), {camera: {fov: 35, up: 'z'}, controls: {orbit: true, pan: 'desktop'},
  background: 'token:--viz-bg', lazy: true, fallback: 'proj3', provenance: true, audit: Viz3D.auditFromUrl()})`.
- Layers:
  | id | Layer | Params from state | Provenance chip |
  |---|---|---|---|
  | `grid` | thin z = 0 grid (−5…5, 1-unit lines) + E/N/U triad labelled x east, y north, z up | static | schematic |
  | `glyphDot` | `Viz3D.vectorGlyph({at:[0,0,0], op:'dot', a:{v:a, label:'\\mathbf a', color:'teal'}, b:{v:b, label:'\\mathbf b', color:'orange'}, showShadow:true, readout:true})` | a, b; visible when `show ∈ {dot, both}` | computed `vectors.dot` |
  | `glyphCross` | `Viz3D.vectorGlyph({op:'cross', a, b, showParallelogram:true, showArc:true})`, result colour violet | a, b; visible when `show ∈ {cross, both}` | computed `vectors.cross` |
  | `signedBar` | box at (−0.6, −0.6, 0) of height a·b (scale 0.2 per unit, label "a·b = 5"), teal above / rose dashed outline below | dot | computed |
  | `ghostCoriolis` | dashed violet arrow −f k×u at the origin, scaled ×10⁴ (label "−f k×u (×10⁴ for visibility)") | preset f k×u only | computed `vectors.k_cross` |
  | `labels` | ≤ 6: a, b, a×b, a·b, θ = 45°, (−f k×u) | | |
- Camera presets (`Viz3D.cameraPresets`, tween 700 ms, reduced motion → cut): `iso` (pos (6, −7, 5), target 0) ·
  `faceOn` (along n = a×b/\|a×b\|, distance 9; for parallel pairs along k) · `edgeOn` (perpendicular to n, in the a–b
  plane, so the parallelogram is a line and the result arrow stands up) · `top` (down −z) · `alongB` (behind b, for the
  shadow). Free orbit + "reset view" always.
- Shared state keys: `ax ay az bx by bz show t lat hemi preset`. Picking: drag a tip → raycast onto the plane through the
  tip facing the camera → `app.set`. 2-D ↔ 3-D: θ cursor in `curves` moves b in 3-D; clicking a rectangle in `flat`
  pulses the matching component tick in 3-D.
- Exaggeration: only the ghost Coriolis arrow (labelled ×10⁴). Time label: "transport: 30° per second".
- Glyph rules (R2 §3.3): result arrow length = area (same scale as a, b); arc from a to b; flipping order flips arc and
  arrow; shadow ⟂ drop line drawn with a right-angle tick.
- Reduced motion: no auto-orbit, step-6 arc animation replaced by a static arc with an arrowhead, transport paused.
- Parity: `Viz3D.selftestRows(S)` adds result ⟂ inputs and drawn-length rows (Part E table). Performance: < 15 draw
  calls; no particles; DPR ≤ 2.

### S0 · PoC B — `templates/viz_example_globe.html` · "Which way does a moving puck turn on a spinning Earth?"
A full Kundu-format explainer used as the new-kit reference template (`viz:3d 1`); later re-used as Chapter-0 E19
`coriolis_turntable_globe`.

**Physics (honest version — open question Q2).** The puck is a frictionless parcel feeling only the Coriolis term:
Vallis (2.55) with ∇p = 0, on the sphere, i.e. the components (2.50a,b) with pressure dropped:
`du/dt = (f + u tanϑ/a) v`, `dv/dt = −(f + u tanϑ/a) u`, `dλ/dt = u/(a cosϑ)`, `dϑ/dt = v/a`, f = 2Ω sin ϑ.
(The metric terms u tan ϑ/a are kept; they are tiny at 10 m/s and are named in the Explain tab.) This is the
**Earth-frame path**. The **inertial (space) view** of the *same* motion is the Earth-frame position rotated by the
planet's turn: λ_I = λ_E + Ωt (ϑ unchanged). Ghost: the same puck with f = 0 and no metric term (a great circle in the
Earth frame: "if the Earth did not spin"). We do **not** model "a puck going straight in space on a frictionless
sphere": without the equatorial bulge it slides toward the equator under the unbalanced centrifugal effect, a classic
trap (Like…/Unlike… card).

**fluidpy.geo.frames functions** (expected names — to confirm with the concept-implementer; parity `py:` follows the
implemented names): `coriolis_parameter(lat)` (wraps `core.rotating.coriolis_parameter`) ·
`coriolis_horizontal(u, v, lat)` → (f v, −f u) = −f k×u · `inertial_oscillation_sphere(lat0, lon0, u0, v0, t, dt=60.0)`
→ (lon, lat, u, v) in the Earth frame, fixed-step RK4 (so JS mirrors it to 1e-9) · `to_inertial_lon(lon, t, Omega)` ·
`inertial_circle(U, f)` → (radius U/\|f\|, period 2π/\|f\|).

**Views:** `scene3d` (globe, row 0 flex 1.6) · `local` (2-D tangent-plane map around the start point, km east/north,
path so far bold + faint whole, inertial-circle reference circle radius U/\|f\| dashed, ghost straight line) · `fcurve`
(f(ϑ) = 2Ω sin ϑ over −90…90°, dot at current ϑ, sign shaded; `hidePortrait`).

**Params:** `lat0` −80…80° (45) · `U` 1…30 m s⁻¹ (10) · `heading` 0…360° (90 = toward east) · `frame` chips Earth /
space · `ghost` toggle (f = 0 path) · `hemi` flip button (lat0 → −lat0) · optional `days` run length 0.5…3 (2).
**Presets:** "45°N, 10 m/s east" · "45°S (mirror)" · "equator: f = 0" (lat0 = 0: the path is a great circle, no
loop) · "60°N" · "slow 2 m/s" · "space view". **Transport:** t 0…`days`, `rate` so that **1 s = 2 h** (badge),
end 'hold' with end card "loop radius 97 km, period 16.9 h".
**Status:** "↻ NH: deflected to the right of its motion (anticyclonic loop, clockwise seen from above)" ·
"↺ SH: to the left (anticlockwise seen from above)" · "— equator: f = 0, no sideways push here" · always with
hemisphere and viewpoint (teaching-style §1h).

**Layers (Viz3D):**
| id | Layer | Data / function | Chip |
|---|---|---|---|
| `globe` | `Viz3D.globe({radius:1, coast: assets/coast110.json, graticule: 30, latLabels: true, rotate:{omega: Ω·timeScale, frame}})` — rotates only in `frame = space` (rotate the planet **or** the camera, never both) | Natural Earth 110 m coast | data (Natural Earth, public domain) |
| `fShade` | translucent latitude bands coloured by f (cmocean `balance`, centred 0, legend s⁻¹) | `coriolis_parameter` | computed |
| `path` | `Viz3D.trajectory`-style polyline lifted 0.3 %: Earth-frame path (solid violet), ticks every 3 h | `inertial_oscillation_sphere` | computed |
| `pathSpace` | same positions with λ + Ωt (solid slate) in `frame = space` | `to_inertial_lon` | computed |
| `ghost` | f = 0 great circle (dashed grey) | analytic | computed |
| `puck` | small disc at the current position | | |
| `glyph` | `Viz3D.vectorGlyph({at: puck, op:'cross', a:{v: f k (local up, length ∝ f), color:'orange', label:'f\\mathbf k'}, b:{v: u, color:'teal', label:'\\mathbf u'}, showParallelogram:true, showArc:true})`, plus the result drawn as **−f k×u** (violet, ⟂ u, label "Coriolis −f k×u") | `coriolis_horizontal` | computed |
| `probe` | where-from / where-to: click the globe → start state = clicked point with current U, heading → integrate back 12 h (dashed, "came from") and forward 24 h (solid, "goes to"), ticks every 3 h with labels "−6 h", "+6 h"… | same integrator, `t < 0` allowed | computed |
| `labels` | ≤ 6: N pole, equator, puck "u", "−f k×u", "97 km", hemisphere badge | | |

**Camera presets (story beats):** `space` (whole globe, north up, 3 a) · `over` (above the puck, looking down the local
vertical; the loop looks like a circle) · `axis` (from above the North Pole: Earth spin anticlockwise) · `equator`
(side view, equator centred) · `south` (above 45°S). Walkthrough (6 steps): 1 `space` question "a puck slides east at
45°N with nothing pushing it — where does it go?" · 2 `over` path + ticks (it curves right) · 3 `over` glyph −f k×u
(always ⟂ u: speed never changes) · 4 `axis` f-shading + `fcurve` (f = 2Ω sin ϑ: 1.03×10⁻⁴ s⁻¹ at 45°, 0 at the
equator) · 5 `south` hemisphere flip (left turn; anticlockwise seen from above) · 6 `space` frame toggle → space view +
prediction "predict the path at the equator before pressing it".
**Exaggeration / time labels:** puck and path drawn lifted 0.3 % and 3 px wide ("path width not to scale"); the loop
(97 km) is true to scale on the globe — the `over` preset zooms to see it; badge "1 s = 2 h"; in space view a badge
"the whole Earth turns 30° in 2 s of animation = 4 h".
**Explain (≥ 3):** 1 what you see · 2 f with your latitude, loop radius U/\|f\| = 10/1.031×10⁻⁴ = 97.0 km, period
2π/\|f\| = 16.9 h (easy: 100 km, 17 h; "that is like London to Brighton"; Vallis (2.55) written) · 3 why the speed
stays 10 m/s (u·(−f k×u) = 0, E01 link) · 4 the metric and β drift: on a sphere the loop does not close — it drifts
westward a few km per loop because f changes with latitude (number from the run) · 5 space view: the same puck seen
from space moves east at ≈ Ωa cos ϑ = 329 m/s with the planet; the loops are what is left after you subtract the
planet's turn · 6 reading the current setting.
**Parity rows:** f(45°) JS vs `frames.coriolis_parameter` (1e-12) · position after 6 h (λ, ϑ) JS RK4 vs
`frames.inertial_oscillation_sphere` same dt (1e-9) · speed conserved \|u(48 h)\| / \|u(0)\| − 1 (atol 1e-6, RK4 dt
60 s) · f-plane limit: radius from the run vs `inertial_circle(10, f)` at 45° (rtol 2 %, sphere vs plane — stated) ·
period vs 2π/f (rtol 1 %) · hemisphere mirror: v(t) at −45° = −v(t) at 45° with u equal (1e-9) · `to_inertial_lon`
offset = Ωt (1e-12) · **invariant** −f k×u ⟂ u (atol 1e-12) · **invariant** glyph result length = \|f\|\|u\| ·
context loss: `forceContextLoss()` → message → restore → same path vertex count.
**Fallback (`Viz.proj3`):** globe as graticule lines + coast polyline, path and ghost polylines, glyph arrows; no
f-shading. **Reduced motion:** no planet spin in Earth frame, path drawn complete with ticks; space view shows a still
frame + "press ▶".

### S1 · the_500hPa_surface (`scenes/ch00/the_500hPa_surface.html`, standalone, S0B-PoC1)
**Title card:** "The 500 hPa surface: a bumpy sheet whose slopes make the wind."

**Data (provenance chip *data*):** NCEP/NCAR Reanalysis 1, daily mean geopotential height at 500 hPa, **one day**
(default proposal: a Northern-Hemisphere winter day with a deep trough, chosen by the data-scout, e.g. 2021-02-15 —
open question Q3), 2.5° × 2.5° (144 × 73), NOAA PSL, public domain; credit "NCEP-NCAR Reanalysis 1 data provided by
the NOAA PSL, Boulder, Colorado, USA". Derived product `data/derived/ch00/ncep_r1_hgt500_<YYYYMMDD>.npz`: Z as int16
metres (≈ 21 kB), lat (90 → −90 as in the file, **flipped to south→north on write and stated in attrs**), lon 0…357.5,
area-weighted mean Z̄ (cos ϑ weights), date, source URL; inlined in the scene as base64 (< 50 kB).

**Physics (provenance chip *computed*):** `fluidpy.geo.atmos.geostrophic_wind_from_height(Z, lat, lon, g0=9.80665,
Omega=7.292e-5, a=6.371e6, lat_min=15.0)` → (u_g, v_g) from Vallis (2.215) `f × u_g = −∇_p Φ` with Φ = g₀Z, i.e. on the
sphere `u_g = −(g₀/(f a)) ∂Z/∂ϑ`, `v_g = (g₀/(f a cos ϑ)) ∂Z/∂λ` (the pressure-coordinate twin of (2.210a,b)), centred
differences (periodic in λ, one-sided at the poles), NaN where \|ϑ\| < 15° (f → 0). JS mirror
`geostrophicWindFromHeight` uses the same stencil on the same decoded int16 field.

**Layers:**
| id | Layer | Detail |
|---|---|---|
| `surface` | `Viz3D.globe({radius:1, field:{data: Z, w:144, h:73, units:'m'}, lut:'viridis', range:[Z̄−600, Z̄+400]})` with **displacement** r = 1 + `exag`·(Z − Z̄)/a (the mean height Z̄ ≈ 5.5 km itself is not drawn: r = 1 *is* the mean 500 hPa surface; stated in the side panel) (candidate option `displace:{data, scale}` if the kit lacks it — viz3d-builder adds it as a candidate layer note) | LUT colouring + legend "500 hPa height [m]" |
| `isolines` | contours every **60 m** (6 dam, the forecasters' interval), 5400 bold every 240 m, labelled ≤ 4 | `fieldSurface.contours` on the displaced mesh |
| `coast` | Natural Earth 110 m on the undisplaced reference sphere (r = 1.0005), grey | data chip (Natural Earth) |
| `refShell` | faint transparent sphere at the mean height Z̄ ("where the surface would be if it were flat") | toggle |
| `arrows` | `Viz3D.vectorField` on the displaced surface every 5° (2nd grid point), tangent, length ∝ speed (legend "→ = 20 m s⁻¹"), teal, masked \|ϑ\| < 15° (grey band labelled "geostrophy fails near the equator: f → 0") | toggle `showArrows` |
| `probe` | click → readout card: ϑ, λ, Z, ∂Z/∂x per 100 km, f, u_g, v_g, speed (easy \| exact) | inspector |
| `badges` | "not to scale: height bumps ×`exag`" · "data: NCEP R1 · <date> · 2.5° · public domain" · "arrows: computed from heights (geostrophic)" | always visible |

**Sliders (few):** vertical exaggeration ×0…×500 (default ×200; ×0 = the true-scale flat sheet, "true scale: bumps
of ±400 m on a 6371 km Earth are invisible — that is why we exaggerate"); `showArrows` toggle; `day` only if the
data-scout ships > 1 day (then a 3-day selector). Play / pause / step drive the tour; step ⏭ jumps a card.

**Guided camera tour (timed caption cards, ~7 s each, 8 cards, play/pause/step; reduced motion = cuts):**
1. `space` (NH from 30° above the equator) — "This is not the ground. It is the sheet in the sky where the pressure is exactly 500 hPa — about halfway up the air, near 5.5 km."
2. exaggeration animates 0 → ×200, `refShell` on — "Lift every point by how far that sheet sits above or below its average. Bumps are a few hundred metres; we stretch them ×200 to see them."
3. `trough` (camera over the deepest low, picked from data) — "The dips are troughs. A low 500 hPa height means the whole column of air below is cold and squashed, not that the surface pressure is low."
4. `polar` (from above the North Pole) + isolines — "Draw lines of equal height every 60 m: this is exactly the map forecasters read (Chapter 0C)."
5. arrows on — "The wind blows *along* the height lines, not downhill — with low heights on its left in the northern hemisphere."
6. probe auto-placed on the steepest jet point — "Where the lines crowd, the slope is steep and the wind is strong: here ΔZ ≈ 60 m per 500 km gives about 11 m/s."
7. `equator` — "Near the equator f goes to zero and this balance breaks down, so we draw no arrows there."
8. `south` — "In the southern hemisphere the same rule has the low heights on the *right*. Now orbit, slide the exaggeration, and click anywhere."

**Side panel (slim, ≤ 120 words + one equation):** plain words — "Air feels a push from high to low height on this
surface; on a spinning Earth the Coriolis effect turns the moving air until the push and the turning balance. Then
the wind runs along the height lines, faster where they crowd." Key equation, written out with its number:
`\mathbf f\times\mathbf u_g = -\nabla_p\Phi` **(2.215)**, Φ = g₀Z, with the component line
`u_g = -\frac{g_0}{f}\frac{\partial Z}{\partial y},\; v_g = \frac{g_0}{f}\frac{\partial Z}{\partial x}`, f = 2Ω sin ϑ;
the probe's numbers substituted live. Links: notebook section (Chapter 0B "Geostrophic wind" C0B block; 0C
"500 hPa maps"), explainer E17 `isobaric_surface_3d` and E20 `geostrophic_wind_reader` (when built), movie M0-3
*How to read a climate map* (when approved), E01 `vector_products_lab` ("f k×u").

**Camera presets:** `space`, `trough` (data-driven: argmin Z north of 30°N), `polar`, `jet` (argmax speed), `equator`,
`south`; free orbit + reset.
**Parity rows:** data spot values — decoded Z at 3 grid points (e.g. (60°N, 0°), (45°N, 270°E), (30°S, 150°E)) vs the
Python array (atol 0.5 m, int16 rounding) · **lat not flipped**: the minimum Z north of 20°N lies north of 45°N, and
the NH-mean Z decreases poleward (expect true) · u_g, v_g at 3 points JS vs `atmos.geostrophic_wind_from_height` on the
same int16 field (rtol 1e-9) · **invariant** arrows along contours: \|u_g·∇Z\| / (\|u_g\|\|∇Z\|) < 1e-9 at all unmasked
points · global-mean u_g at 45°N positive (westerlies; expect > 0) · displacement of a vertex = exag·(Z − Z̄)/a
(atol 1e-9) · mask count \|ϑ\| < 15° matches Python. **Fallback (`proj3`):** graticule + coast + 5400/5700 m contour
polylines + arrow segments, no LUT surface; "3-D drawn without WebGL" note. Disk: report C: and G: free space before
and after the single-day download (data-scout).

---

# Part A/C · PoC G — Chapter 0A sample block: the dot product (Kundu App. B §B.3)

Builder: `notebooks/build_poc_ch00a_dot.py` → `notebooks/poc_ch00a_dot.ipynb`. One section, one CORE block, voice
`teaching-style` §1d (no "clearly / obviously / simply / it is easy to see"). Line plan: "0A §0.3 → C0A-PoC1, D0A-PoC1,
eq DOT_DEF / 0A.1 / 0A.3 — about 22 cells". Uses `nb.core`, `nb.md`, `nb.primer`, `nb.derivation`,
`nb.worked_example`, `nb.code`, `nb.explainer`, `nb.figure`, `nb.summary`; where `nbkit` lacks an AOFD helper
(`scratch_vs_lib`, `like_unlike`, `kundu_recap`, `anatomy` are not in `tools/nbkit.py` yet — open question Q4) the
builder writes `nb.md`/`nb.code` with the exact headings from `teaching-style` §2 and tags `eq:0A.1` etc.

| # | Cell (nbkit) | Draft text / code intent | Expected numbers |
|---|---|---|---|
| 1 | `nb.section("0.3", "The dot product: how much of one arrow points along another")` | **What is this section about?** "One way to multiply two arrows and get a plain number — and why that number shows up on almost every page of Vallis." | — |
| 2 | `nb.core("C0A-PoC1", "The dot product", question="How much of the wind blows *toward* the warm air?")` | **Plain words (friendly opening):** "Imagine you are standing in a field with a steady breeze of 10 m/s coming from the south-west, and somewhere to the north the air is warmer. How much of that breeze is actually carrying you toward the warm air? Not all 10 m/s — part of the breeze is going sideways. Put a torch straight above you and look at your shadow on the ground along the north line: the length of the breeze's shadow on that line is the part that counts. That 'shadow, times the length of the line' is the dot product." Symbols introduced on the spot: **a**, **b** (arrows; components a₁, a₂, a₃ = east, north, up — atlas `x, y, z`), \|a\| (length), θ (angle between them, 0°…180°). | breeze 10 m/s at 45° to north → 7.07 m/s northward |
| 3 | 🖼️ picture | static figure (matplotlib, `outputs/ch00/poc_dot_shadow.png`): a = (2, 1), b = (1, 3), shadow on b's line, dashed drop-line, right-angle tick, θ = 45° arc; teal/orange. + `**What you see.** / **How to read it.** / **What would change if…**` (turn b to (−1, 2): the shadow shrinks to a point) | shadow 1.58 |
| 4 | 🔁 From Kundu link line (short, since it is App. B not a K row) | "> 🔁 From Kundu ch02 §2.8 — vector, dot and cross products · [notebook §2.1 / C01](https://shammun.github.io/fluidpy/notebooks/ch02_cartesian_tensors.html#%F0%9F%A7%A9-The-summation-convention:-a-repeated-index-is-a-sum-C01) · [explainer rotation_of_axes](https://shammun.github.io/fluidpy/viz/ch02/rotation_of_axes.html)"; crosswalk 3 rows: Kundu u·v with u, v ↔ our a·b; Kundu e₁, e₂, e₃ ↔ Vallis **i, j, k**; Kundu θ (angle here) ↔ ⚠️ Vallis ϑ = latitude, θ = potential temperature (`> ⚠️ Which convention?` one-liner) | — |
| 5 | 📐 exact statement | "Here is the precise version. For arrows with components a = (a₁, a₂, a₃) and b = (b₁, b₂, b₃):" `$$\mathbf a\cdot\mathbf b = a_1b_1+a_2b_2+a_3b_3$$` *(Kundu §2.8, unnumbered; used throughout App. B §B.3, e.g. ∇·u)* and `$$\mathbf a\cdot\mathbf b=|\mathbf a|\,|\mathbf b|\cos\theta \qquad (0A.1)$$` and the shadow `$$|\mathbf a|\cos\theta = \frac{\mathbf a\cdot\mathbf b}{|\mathbf b|}\qquad(0A.3)$$` Anatomy strip (`nb.md` table): a·b (teal, "a's share along b, times \|b\|") · a₁b₁ + … ("multiply matching parts, add") · cos θ ("1 if parallel, 0 if ⟂, −1 if opposite"). | — |
| 6 | 📎 primers (before the derivation) | P0-?? *law of cosines* (c² = A² + B² − 2AB cos θ; demo with a 3-4-5 triangle: 25 = 9 + 16 − 0 at 90°) · P0-?? *length from components* (\|a\| = √(a₁²+a₂²+a₃²); demo √(2²+1²) = 2.236) | — |
| 7 | 🧮 `nb.derivation("D0A-PoC1", …)` | the 9 steps of Part E D0A-PoC1 verbatim (did · line · why · in words), result, check (units; a = b; i·j = 0; numbers), meaning, traps | — |
| 8 | 🔢 `nb.worked_example("Tiny example: a = (2, 1, 0), b = (1, 3, 0)", …)` | table **easy \| exact**: a·b = 2·1 + 1·3 + 0·0 = **5 \| 5**; \|a\| ≈ 2.2 \| 2.236; \|b\| ≈ 3.2 \| 3.162; cos θ = 5/(2.236·3.162) ≈ 0.7 \| 0.7071 → θ = 45°; shadow ≈ 1.6 \| 1.581. Second line, the breeze: u = (7.07, 7.07) m/s (10 m/s from the SW), north unit vector n = (0, 1): u·n ≈ 7 \| 7.07 m/s. "That is like a brisk walk… times five." | 5, 45°, 1.581, 7.07 |
| 9 | 🐍 From scratch — eq (0A.1) (tag `eq:0A.1`) | see spec below | prints 5.0, 45.0°, 1.581 |
| 10 | **What does the code above do?** | numbered list naming `a`, `b`, `products`, `dot_ab`, `len_a`, `len_b`, `cos_theta`, `theta_deg`, `shadow` | — |
| 11 | 🐍 The library — `fluidpy.geo.vectors.dot` (tag `eq:0A.1`) | see spec below | assert passes |
| 12 | 🎮 `nb.explainer("vector_products_lab", "🎮 Interactive: drag the arrows and watch the shadow", why, tries)` | tries: "Drag b until the bar hits 0 — read θ." · "Press ▶ and watch the bar follow a cosine." · "Preset *anti-parallel*: why is a·b negative?" | — |
| 13 | ⚠️ Like… / Unlike… | **Like…** a shadow on the floor under a lamp: tilt the stick and the shadow shrinks. **Unlike…** a real shadow, the dot product can be *negative* (the shadow points backwards along b), and it is multiplied by \|b\| — a shadow is only \|a\| cos θ. | — |
| 14 | `> ⚠️ Common confusion:` | "a·b is a number, not an arrow. (a·b)c is an arrow; a·(b·c) does not make sense." | — |
| 15 | 🌍/➡️ Where Vallis uses it | "Vallis §1.1, the material derivative `$$\frac{D\varphi}{Dt}=\frac{\partial\varphi}{\partial t}+(\mathbf v\cdot\nabla)\varphi \qquad (1.7)$$` — the last term is a dot product of the wind v with the temperature-slope arrow ∇T: **u·∇T** = (wind's share along the temperature slope) × (steepness). A worked number: wind 10 m/s blowing at 60° to a temperature gradient of 1 K per 100 km → u·∇T = 10 × 10⁻⁵ × cos 60° = 5×10⁻⁶ K/s ≈ **0.43 K per day** of change at a fixed spot as the air arrives (sign: for a conserved T, ∂T/∂t = −u·∇T, so wind blowing from the cold side toward the warm side cools the spot). Wind along the isotherms (θ = 90°) → 0: no advection." Then pointers: Vallis §2.2 (2.55) for the cross product, Chapter 0A §0.4. | 0.43 K/day |
| 16 | small scratch + assert for the advection number (B note, `eq:1.7-adv`) | u = (10 sin 60°, 10 cos 60°) = (8.660, 5.000) m/s, ∇T = (0, 1e-5) K/m → u·∇T, × 86 400 s/day; then `V.dot` + assert (1e-12) | 5.000e-6 K/s, 0.432 K/day |
| 17 | 📇 Symbols introduced | table rendered from `knowledge/symbols.yaml` (see list below) | — |
| 18 | Equation-code ledger | Part G rows for this section | — |
| 19 | `nb.summary` "✅ What should have clicked" | "a·b multiplies matching components and adds them up — and that equals \|a\|\|b\|cos θ, a's shadow on b times \|b\|. Zero means perpendicular; negative means 'against'. In Vallis it is how much the wind blows *across* the temperature lines." | — |

(Cells 15–16 numbers: u = 10 m/s at 60° to a northward ∇T of 1 K/100 km, u = (8.660, 5.000) m/s, ∇T = (0, 1e-5)
K/m → u·∇T = 10 × 1e-5 × cos 60° = 5.000e-6 K/s = **0.432 K/day**; the prose quotes the printed value. Sign convention
stated once: for a conserved temperature, ∂T/∂t = −u·∇T at a fixed point, so wind blowing *up* the temperature slope
(from cold toward warm, u·∇T > 0) cools the fixed spot by 0.43 K per day.)

**From-scratch spec (cell 9, tag `eq:0A.1`) — inputs with units, one operation per line, comment per line:**
```python
# 🐍 From scratch — eq (0A.1): a·b = a1*b1 + a2*b2 + a3*b3 = |a||b| cos θ
import numpy as np                      # numpy only for arrays, sqrt, arccos (no fluidpy here)
a = np.array([2.0, 1.0, 0.0])           # arrow a: 2 east, 1 north, 0 up (units: whatever a carries, here none)
b = np.array([1.0, 3.0, 0.0])           # arrow b: 1 east, 3 north, 0 up
products = a * b                        # matching parts multiplied: [a1*b1, a2*b2, a3*b3] = [2, 3, 0]
dot_ab = products.sum()                 # add them up: the dot product a·b = 5
len_a = np.sqrt((a * a).sum())          # length |a| = sqrt(a1² + a2² + a3²) ≈ 2.236 (Pythagoras)
len_b = np.sqrt((b * b).sum())          # length |b| ≈ 3.162
cos_theta = dot_ab / (len_a * len_b)    # (0A.1) solved for cos θ ≈ 0.7071
theta_deg = np.degrees(np.arccos(cos_theta))   # the angle between the arrows: 45°
shadow = dot_ab / len_b                 # (0A.3) a's shadow on b's line ≈ 1.581
print(f"a·b = {dot_ab:.3f}, θ = {theta_deg:.1f}°, shadow = {shadow:.3f}")
```
(Optional first a loop: `dot_ab = 0.0; for i in range(3): dot_ab += a[i] * b[i]  # add one matching pair at a time`,
then "the same thing, all at once".)

**Library cell (cell 11):**
```python
# 🐍 The library — the same numbers through the tested functions
from fluidpy.geo import vectors as V                       # Chapter 0A vector toolkit (tested, V-ladder)
dot_lib = V.dot(a, b)                                      # a·b
theta_lib = np.degrees(V.angle_between(a, b))              # θ in degrees
shadow_lib = V.scalar_projection(a, b)                     # a's shadow on b
np.testing.assert_allclose([dot_ab, theta_deg, shadow], [dot_lib, theta_lib, shadow_lib], rtol=1e-12)
# rtol 1e-12: same closed-form arithmetic in both → only round-off can differ (from-scratch-code §3)
print("scratch and library agree:", dot_lib, theta_lib, shadow_lib)
```
Note for the builder: arccos near θ = 0° or 180° loses accuracy (cos θ ≈ ±1); the library's `angle_between` should
use `atan2(|a×b|, a·b)`. At θ = 45° both agree to ~1e-15; if the library uses atan2 the theta comparison stays at
1e-12 here, but **do not** reuse 1e-12 for a near-parallel example (open question Q5).

**Picture / explainer link:** E01 `vector_products_lab` (cell 12), Part E above; static figure cell 3.
**Like… / Unlike…:** cell 13. **Where Vallis uses it:** cell 15 (Vallis (1.7), u·∇T, §1.1).

**Symbols introduced** (`knowledge/symbols.yaml` exists): present — `x, y, z` (components east/north/up),
`\mathbf i, \mathbf j, \mathbf k`, `\mathbf u`, `\nabla`, `T`, `\frac{D}{Dt}`, `\vartheta` (pitfall: ϑ vs θ). **To add
(concept-analyst / knowledge-keeper):** `\mathbf a, \mathbf b` (generic vectors, Ch. 0A; pitfall: `a` is also Earth's
radius) · `|\mathbf a|` (length / magnitude) · `\theta` **as "angle between two vectors" in Ch. 0A** — add as an `aka`
note on the existing potential-temperature entry, with ⚠️ "in 0A only; Vallis θ = potential temperature" ·
`\mathbf a\cdot\mathbf b` (dot product, unit = product of units) · `\mathbf a\times\mathbf b` (cross product) ·
`\varepsilon_{ijk}` is present (operators). Glossary words to add: *dot product*, *scalar projection*, *advection*
(first use 0A §0.3 cell 15; "transport of a property by the wind or current").

### Part G · equation-code ledger rows (PoC G section + PoC A/B/F functions)

| Eq. | cell tag | scratch spec (inputs with units → one op per line) | library fn | assert (rtol + why) |
|---|---|---|---|---|
| DOT_DEF a·b = Σ a_ib_i (Kundu §2.8, unnumbered) | `eq:0A.1` (shared) | a, b arrays → `products = a*b` → `sum` | `fluidpy.geo.vectors.dot` | 1e-12 — same arithmetic, round-off only |
| (0A.1) a·b = \|a\|\|b\|cos θ | `eq:0A.1` | lengths by Pythagoras → cos θ → arccos | `vectors.angle_between` | 1e-12 at θ = 45° (state: not for near-parallel) |
| (0A.3) shadow a·b/\|b\|, (a·b/\|b\|²) b | `eq:0A.3` | dot / len_b; dot / len_b² × b | `vectors.scalar_projection`, `vectors.projection` | 1e-12 |
| (1.7) advective term u·∇T (B note) | `eq:1.7-adv` | u (m/s), ∇T (K/m) → product → sum → × 86 400 s/day | `vectors.dot` | 1e-12 |
| (K 2.20) a×b components (PoC A, notebook §0.4 later) | `eq:K2.20` | three criss-cross differences, one per line | `vectors.cross` | atol 1e-12 (some components 0) |
| (0A.2) \|a×b\| = \|a\|\|b\| sin θ = area | `eq:0A.2` | base \|a\| → height \|b\| sin θ → product | `vectors.parallelogram_area` | 1e-12 |
| k×u (2.55 Coriolis form) | `eq:2.55-kxu` | (−u_y, u_x, 0) → × f | `vectors.k_cross` | 1e-12 |
| f = 2Ω sin ϑ (Vallis text after (2.51)) | `eq:f` | Ω → lat in rad → 2Ω sin | `frames.coriolis_parameter` (→ `core.rotating.coriolis_parameter`) | 1e-12 |
| (2.215) geostrophic wind from Z (PoC F) | `eq:2.215` | Z grid (m) → ∂Z/∂ϑ, ∂Z/∂λ centred → f → u_g, v_g | `atmos.geostrophic_wind_from_height` | 1e-12 on the same grid and stencil |
| (K 2.21) ε form | `eq:K2.21` | n/a here: sympy + numeric check in §0.4 (identity form) | `core.tensors.cross_einsum` | sympy exact |

---

## Part C · functions every builder calls (flag: none exist yet — `fluidpy/geo/` is an empty package today)
`fluidpy.geo.vectors`: `dot(a, b)`, `cross(a, b)`, `norm(a)`, `angle_between(a, b, degrees=False)`,
`scalar_projection(a, b)`, `projection(a, b)`, `parallelogram_area(a, b)`, `triple_scalar(a, b, c)`, `k_cross(u)` ·
`fluidpy.geo.frames`: `coriolis_parameter(lat)`, `coriolis_horizontal(u, v, lat)`,
`inertial_oscillation_sphere(lat0, lon0, u0, v0, t, dt=60.0)`, `to_inertial_lon(lon, t, Omega)`,
`inertial_circle(U, f)` (names proposed; confirm) · `fluidpy.geo.atmos`: `geostrophic_wind_from_height(Z, lat, lon,
g0=9.80665, Omega=7.292e-5, a=6.371e6, lat_min=15.0)` · existing: `fluidpy.core.rotating.coriolis_parameter`,
`fluidpy.core.tensors.dot/cross/angle_between`.

## Open questions
- **Q1** Kundu App. B has no number for a·b, a·b = \|a\|\|b\|cos θ or \|a×b\| = area; we label them (0A.1)–(0A.3)
  and cite Kundu §2.8 (unnumbered) and (K 2.20)/(K 2.21). OK, and should `coverage_check.py` accept `(0A.n)`?
- **Q2** PoC B: the brief says "inertial straight-line path on/over a sphere". A puck going straight in space on a
  bulge-free frictionless sphere slides toward the equator (unbalanced centrifugal) — misleading. Design uses the
  Earth-frame Coriolis-only motion (Vallis (2.55), ∇p = 0) and shows the *same* motion from space (λ + Ωt), plus an
  f = 0 ghost. Confirm.
- **Q3** PoC F date: data-scout to pick one NH-winter day with a clear trough (proposal 2021-02-15); one day only.
- **Q4** `tools/nbkit.py` has no `scratch_vs_lib`, `kundu_recap`, `anatomy`, `like_unlike`, `magnitude_table` yet;
  PoC G uses `md`/`code` with the exact headings unless the orchestrator adds them first.
- **Q5** `angle_between` should use atan2(\|a×b\|, a·b) (accurate near 0°/180°); the concept-implementer decides.
- **Q6** `Viz3D.globe` needs a `displace` option (or a sphere-mapped `fieldSurface`) for PoC F; viz3d-builder to add
  as a candidate layer if missing.
