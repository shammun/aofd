# PoC — user feedback, findings and fix plan

Collected item by item (CLAUDE.md "Session start"; `progress.json → setup.awaiting_user` Q1). Each item: the user's
points (paraphrased, numbered U-x.n), the orchestrator's close inspection (F-x.n, with code locations), then the fix plan
per owning agent. Fixes run only after the user agrees the plan.

---

## A · `viz/ch00/vector_products_lab.html` (2026-10-21)

Screenshots supplied by the user: `1.png` (45° preset), `2.png` (parallel), `3.png` (anti-parallel, step 2),
`4.png` (f k×u preset, step 2). Equations re-checked on the page images: Vallis (2.55) p. 66 (`Du/Dt + f×u = −(1/ρ)∇_z p`,
`f = fk = 2Ω sin ϑ k`) ✔, Vallis (1.7) p. 5 ✔.

### User points
- U-A.1 Why is a·b = 5 drawn as an upward green arrow? Only because it is positive?
- U-A.2 What are E, N, U? Does U mean "up"?
- U-A.3 What is the sweep angle φ and how is it different from θ?
- U-A.4 a·b = 5 but the drawn shadow is 1.58: which one is the dot product?
- U-A.5 The ⊙ "a×b = 5" next to "a·b = 5": what is the difference between the two?
- U-A.6 The 3-D view is too small: add an expanded view (full window or new tab).
- U-A.7 The shaded parallelogram is the cross product, but nothing on the picture says so: label it.
- U-A.8 The right-hand rule is only touched on: explain it properly, with an interactive 3-D animation.
- U-A.9 Research whether something other than three.js would be more intuitive.
- U-A.10 Parallel (2.png): if the projection of a on b is a itself, the dot product should be |a| = √5, not 10. What is missing?
- U-A.11 Use 3Blue1Brown's cross-product video as inspiration.
- U-A.12 Anti-parallel (3.png): there is "no shadow" of a on b, so why is a·b = −10 and not 0?
- U-A.13 f k×u (4.png): what does it mean? Is f a constant multiplying each component? What does it represent?
- U-A.14 Changing the sweep angle in f k×u mode changes the 3-D view but not the map view: why?
- U-A.15 What are all the vectors and lines in the 3-D view in f k×u mode?
- U-A.16 Check that everything drawn is scientifically right; look for further mistakes and improvements.

### Inspection findings (orchestrator)
| id | Severity | Finding | Where |
|---|---|---|---|
| F-A.1 | **Must** (teaching error) | Subtitle says "the dot product **is** a signed shadow". Wrong: the shadow is \|a\|cos θ; a·b = shadow × \|b\|. This sentence is the root of U-A.4/U-A.10. | `subtitle`, Explain step 1 |
| F-A.2 | **Must** | a·b (a scalar) is drawn in 3-D as a vertical arrow (`signedBar`, a `vectorField` along +z), the same direction a×b points. It reads as a vector. | scene.js `signedBar` |
| F-A.3 | **Must** | The a×b result arrow has no label in the 3-D view (1.png: tall violet arrow unlabelled). | scene / glyph readout |
| F-A.4 | **Must** (physics) | In f k×u mode the sweep turns u about unit(k×u), a horizontal axis, so the wind tilts into or out of the ground. The map autoscales \|u_h\| and \|f k×u\| by the same cos φ, so it looks frozen (U-A.14), and flips at 90°. The sweep must turn u about k (the wind changes direction in the horizontal). | `vecB`, `sweepAxis`, `drawMap` |
| F-A.5 | **Must** | Walkthrough text has hard-coded numbers ("b = (1, 3, 0)", "1.58 long", "2.24×2.24 = 5", 3.16). After a preset they contradict the screen (2.png, 3.png, 4.png). | `tour[]` |
| F-A.6 | Must | The bar label reads "a·b = …" in f k×u mode (4.png "a·b = 0"); it should be absent there. | scene.js `barLabelItem` |
| F-A.7 | Must (notation) | φ names the sweep **and** the generic property in (1.7) shown in the Equations tab. In Vallis φ/ϑ/λ are spoken for. Rename the sweep in plain words ("turn b by"). | `transport.label`, Explain step 7 |
| F-A.8 | Should | E/N/U triad in the pure-maths presets is never explained, and N is teal, the colour of a. Use x, y, z in the maths presets; east/north/up only in f k×u mode, with a legend. | scene grid / triad |
| F-A.9 | Should | Parallelogram unlabelled (U-A.7); "1.58" unlabelled in the face-on view at mid widths; ⊙ never explained on screen. | `drawFace` |
| F-A.10 | Should | The 45° coincidence a·b = \|a×b\| = 5 (cos 45° = sin 45°) is only in a preset tooltip: it invites "what is the difference?" (U-A.5). Say it on screen, or use a default where they differ. | `PRESETS`, step 1 |
| F-A.11 | Should | The right-hand rule is one sentence (step 6). No animation, no orientation check, no swap demo in 3-D. | `tour[5]` |
| F-A.12 | Should | Anti-parallel 3-D: the shadow coincides with a and recolours it (3.png, a looks violet/rose); parallel: degenerate arc/plane line beyond b. | glyphs, degenerate pairs |
| F-A.13 | Should | The face-on "θ 0°" label sits on the arrows (2.png). | `drawFace` θ arc |
| F-A.14 | Should | The acute/obtuse reading mixes in u·∇T without saying a = u and b = ∇T. | `reading()` |
| F-A.15 | Should | No per-view maximise; the app-level ⛶ fullscreens the whole app (U-A.6). | viz_lib (shared) |
| F-A.16 | Nice | In f k×u mode, k×u (m/s) and −f k×u ×10⁴ (m/s²) share one picture: the badge must also say "different units". | badge |
| ✔ | — | Checked correct: (K 2.2), (K 2.20), (K 2.21), (0A.1)–(0A.3) derivations, the sign of −f k×u (right of u in NH, left in SH), f(45°) = 1.031×10⁻⁴ s⁻¹, (2.55) as printed, (1.7), the cold/warm advection signs, the 0.93 m/s per quarter-hour number, all selftest rows. | |

### Fix plan (proposed, NOT yet run)
| # | Change | Owner |
|---|---|---|
| P-A.1 | New core picture: **both products are areas**. a·b = a **rectangle** on b's line with sides (signed shadow) × \|b\| (rose and hatched if negative); a×b = the **parallelogram**, labelled "area = \|a×b\| = 5", with base and height marked. Dot bar becomes a flat HUD gauge (never an arrow in space). Fixes F-A.1/2/9. | viz3d-builder + viz-builder |
| P-A.2 | New walkthrough steps: (i) shadow ≠ dot product, the unit-vector case a·b̂ = shadow (= √5 for the parallel preset), then × \|b\|; (ii) symmetry: b's shadow on a × \|a\| gives the same number; (iii) the sign: the shadow's foot lands behind the origin (anti-parallel = −\|a\|, perpendicular = 0); (iv) the 45° coincidence spelled out. All numbers live. Fixes F-A.5/10. | viz-builder |
| P-A.3 | Right-hand rule: 3Blue1Brown-style bridge, 2-D signed area first (a_x b_y − a_y b_x > 0 when b is anticlockwise from a), then 3-D. A stylised right hand built from simple shapes (our own geometry) that curls from a to b with the thumb growing into a×b; "look down from the tip: a→b turns anticlockwise" camera move; a swap button that flips the thumb (b×a = −a×b); index-middle-thumb variant; checks i×j = k (east × north = up). New 3-D step(s) + a "Right-hand rule" preset. Fixes F-A.11. | viz3d-builder (hand + camera), viz-builder (steps, Explain section), viz-integrator |
| P-A.4 | f k×u mode: the sweep turns the wind about k (compass direction); the map rotates; k×u stays 90° left; no a·b bar; legend for every drawn thing (u orange, k̂ teal, k×u solid violet, −f k×u beaded ×10⁴ "different units"); an Explain section "What f k×u means" (f scalar → scales each component; units m/s → m/s²; why sin ϑ; inertial period 2π/f ≈ 17 h at 45°). Fixes F-A.4/6/16. | viz-builder + viz3d-builder |
| P-A.5 | Rename the sweep: "turn b by" (k-mode: "turn the wind by"), no Greek letter; show θ beside it. Fixes F-A.7. | viz-builder |
| P-A.6 | x/y/z triad in maths mode, E/N/U only in k-mode, with an on-screen legend; triad colours not reused by a/b. Labels for a×b always on; ⊙ legend "arrow pointing out of the screen, at you". Fixes F-A.3/8/9/12/13. | viz3d-builder + viz-builder |
| P-A.7 | **Expand 3-D**: a ⤢ button on every 3-D view: (1) maximise in place (the view fills the stage, controls stay, Esc returns); (2) "open in new tab" with the state in the URL hash. Built once in `assets/viz_lib.js` / `viz3d.js` for all explainers, then `tools/viz_inline.py --all`. Fixes F-A.15. | orchestrator (shared JS) |
| P-A.8 | Gates: viz_lint, `shot.py --3d` at 360×640 … 1920×1080 + notebook frame, all selftest rows (new: rectangle area = a·b, hand thumb ∥ a×b, k-mode sweep keeps u horizontal), viz-reviewer fresh-eyes round. | viz-reviewer |
| P-A.9 | Lessons into `knowledge/viz_patterns.md`: never draw a scalar as an arrow in space; no hard-coded numbers in walkthrough text; sweep axis must respect the physics; avoid 45° coincidences in defaults. | knowledge-keeper |

Engine (U-A.9): keep three.js (see reply 2026-10-21). Status: **awaiting the user's agreement to P-A.1 … P-A.9.**

### Status (2026-10-21)
Rounds: rework `bccd851` → fix 1 `8956d4b` → user round 2 (consistency, intuition, derivations with live numbers) `0fd77fb` →
fix 2 `47d692e`; kit: expand `7a51d12`, 3-D restore `06c0203`. viz review round 4b: **PASS** (264/264 GL, 217/217 fallback).
Open Should: S2 (3-D curl arc small in the tilted view), S10 (no-WebGL fallback fills ~40 % × 30 %). P-A.9 → knowledge-keeper.
Awaiting the user's second look.

2026-10-22: user says A is **not right yet**; a larger round-3 feedback list is being prepared. B-G feedback will follow later.

### Round 3 user points (collecting, 2026-10-22)
- U-A.17 (with 3Blue1Brown screenshot `dot_pro.png`) Why is a·b the shadow of a on b **times |b|**, not just the shadow? What do we gain by
  multiplying by |b|: what is the geometric intuition and what useful information does it give? The explainer must answer
  this. Answer given in chat: (i) the shadow alone depends on which vector you project onto, while shadow × the other length gives
  the same number both ways; (ii) a·b is the cheap formula (Σ aᵢbᵢ) and the shadow is derived from it, a·b/|b|; with a unit vector the
  two are equal (components, u·x̂); (iii) the physics needs both sizes: work F·d, advection u·∇T (m/s × K/m = K/s).

## Movie `ch00_dot_product_why` — user round 1 (2026-10-22, screenshots `5_2.png`, `6.png`–`9.png`)
- U-M.1 Don't open with the puzzle: first the definition, explanation, intuition and examples (up to ~1.5 min), then the question, then the answers.
- U-M.2 Length at least 6 min (the user first said 5–6 min, then "at least 6"): target 6:00–6:10.
- U-M.3 Labels (K 2.2), (0A.1), (0A.3), (Vallis 1.7) unexplained (the user read "0A" as "O = Vallis"). Explain the labels once, and give a
  source footnote on every frame that shows a labelled equation.
- U-M.4 (0A.3) `|a|cosθ = a·b̂ = a·b/|b|`, `b̂ = b/|b|` was shown at ~0:30 without explanation: explain it step by step.
- U-M.5 At ~1:04, "they're the same" doesn't say what is the same; "dividing by |b| does nothing" is unclear. Say that the dot product equals the shadow.
- U-M.6 Reason 3 (the weather) jumps in difficulty: explain ∇T, the material derivative, (v·∇)φ, what v and φ are here, and how (Vallis 1.7)
  is advection. Put (1.7) first, then the numbers; write u·∇T = (shadow of u) × |∇T|; explain what 0.180 K per hour means (a rate in time, not
  the map's slope in space).
- U-M.7 At ~1:58, why DT/Dt = 0 gives ∂T/∂t = −u·∇T and what a zero material derivative means; the line "how fast YOUR temperature changes
  (doubles)" is unclear.
- U-M.8 Add smooth, soothing background music (overrides "no music by default" for this movie). Tool: `tools/music.py` (procedural, our own, CC0).
- Decisions (user, 2026-10-22): music level as proposed (bed −28 LUFS, duck 5 dB); length 6:00–6:10; the wind is **v** in the weather
  part (matches Vallis 1.7); otherwise the orchestrator's recommendations (PoC D test clip stays local).
- U-M.9 (2026-10-22): explain the material derivative clearly where it is first used (s14): following the same bit of air vs a fixed
  place, with an on-screen definition card. Added to the fix loop 1 of v2.
  User correction: say **air parcel** (defined: a small volume of air that moves with the flow), never "bit of air"; DT/Dt = rate of change following an air parcel; ∂T/∂t = local derivative, rate at a fixed point.

## Movie `ch00_dot_product_why` — user round 2 on v3 (2026-10-23) → version 4
**Supersedes U-M.2 (length) and U-M.3 (labels/footnotes).** New length limit: up to ~8 min (just over 8 is OK). Times refer to v3.

Global rules for v4 (all scenes):
- U-M2.G1 **No references anywhere**: no equation labels (K 2.2), (0A.1), (0A.3), (Vallis 1.7); no book names, authors (Kundu, Cohen, Dowling, Vallis), no "a definition from school mechanics, no book number"; **no footnote strip at all**. Equations stay; their labels go. If a step must refer back to an equation, number it plainly (1), (2), (3)… inside that scene only.
- U-M2.G2 **No "not to scale" badges** anywhere (s?, 3:07, 4:32, 4:38, 5:42, …) — the user finds them an unnecessary complication.
- U-M2.G3 **Scene titles must stand out**: today they read as one more line of text. Redesign the title treatment (size, weight, colour/band, position, spacing) for every scene.
- U-M2.G4 **Explain every new term or symbol the first time it appears**, in easy words (b̂, isotherm, ∂/∂x, ∇, …).
- U-M2.G5 Narration and screen must agree: what is said is shown, and dense screens get enough narration (no packing 3 ideas into 2 lines).

Scene points:
- U-M2.1 (~0:18–0:19) Don't say "the numbers are components". Say: "5 and 1 are the components of vector a; 1 and 3 are the components of vector b."
- U-M2.2 (~0:30–0:31) Definition a·b = a₁b₁ + a₂b₂ + a₃b₃: drop the (K 2.2) label; drop the "small number = which part, 1 ↔ x, 2 ↔ y, 3 ↔ z" line entirely. Instead say these vectors have two components, so we write only a₁b₁ + a₂b₂, with a₁ = 5, b₁ = 1, a₂ = 1, b₂ = 3 shown on screen.
- U-M2.3 (~0:43–1:01) Delete the whole "how to read the equation labels / references" scene (s04). The following "try it" scene is then not needed as a separate scene: show the worked calculation in the definition scene itself.
- U-M2.4 (~1:31, angle cases) θ = 0° as now; then θ = 90° ⇒ dot product 0; then state clearly θ = 180° (pointing opposite ways) ⇒ dot product negative. Put vector **p** prominently (centre/top, larger, distinct colour); say p is the same in all three pictures and only q changes, i.e. we change the angle to show how the dot product changes.
  Decision (user, 2026-10-23): at 180° say "pointing in opposite directions" (confirmed).
- U-M2.5 (~1:39, derivation) Equations are acceptable here because step 3 refers back: label the first equation just (1) (not 0A.1) and say "divide both sides of (1) by |b|".
- U-M2.6 (~2:14) Explain b̂: the unit vector along b (length 1, same direction as b), b̂ = b/|b|.
- U-M2.7 (~2:20–2:29, shadow numbers chain) No 0A.1 label; no footnote. Make clear every line is a computation of the shadow. Merge lines 4+5 (a·b/|b| = 8/3.162 = 2.530 — the shadow) and lines 6+7 (a·b̂ computed another way, same shadow), and show how b̂ = (0.316, 0.949) is obtained (1/3.162, 3/3.162).
- U-M2.8 (~2:30) "Shadow of a on b" and "shadow of b on a": also show the calculation for each on screen (the full vectors and the formula with numbers); narration need not spell it all out.
- U-M2.9 (~2:58, reason 2, wind) Say v = (6, 8) means 6 m/s eastward and 8 m/s northward. Say x̂ is the eastward unit vector, so its components are 1 eastward and 0 northward; then v·x̂ = 6 is the eastward part of the wind. Remove "Vallis calls the wind v, its eastward part is written u". Remove "not to scale".
- U-M2.10 (~3:07–3:20, reason 3, work) Remove "not to scale" and "Work: a definition from school mechanics, no book number". Expand "its shadow 10 N is still a force … × 5 m = 50 J, twice as far, twice the work": explain that the shadow (the part of the force along the motion) is itself a force of 10 N, that only it does work, work = 10 N × 5 m = 50 J, and over 10 m it is 100 J — twice the distance, twice the work. Slow down, more narration.
- U-M2.11 (~3:24–3:32, the weather equation) Don't call it "Vallis's equation"; drop "Vallis 1.7". **First** teach what the material derivative is (the two-thermometer / air-parcel explanation the user liked, currently ~4:00 — integrate it at the start), then the equation Dφ/Dt = ∂φ/∂t + (v·∇)φ: φ can be any quantity carried by the air — temperature T, moisture, … Explain v·∇φ is advection: of temperature if φ = T, of moisture if φ = moisture. Avoid the confusing "(v·∇) in brackets, φ outside" reading — show it written as v·∇T together for temperature.
- U-M2.12 (~4:23–4:34, ∇T) Explain ∂/∂x, ∂/∂y (partial derivatives: change in one direction only) and ∇T = (∂T/∂x, ∂T/∂y). Define **isotherm** (a line of equal temperature). Say explicitly: the vertical isotherms at 100, 200, 300 km mean T rises 1 °C (user wrote "1 kilometer" — means 1 °C) per 100 km eastward and does not change northward, so ∂T/∂y = 0. Remove "not to scale".
- U-M2.13 (~4:38) Visual is great but narration is too thin: add more explanation. Remove "not to scale", footnotes, "1.7".
- U-M2.14 (~4:57, rate in space vs time) Already good; check narration ↔ screen agreement and improve clarity where possible.
- U-M2.15 (~5:20, DT/Dt = 0) Already good; see if clarity can be increased.
- U-M2.16 (~5:42) Remove "not to scale". Explain the **shaded area behind the green arrow** (the user does not know what it is or how it relates to the shadow / to ∂T/∂t = −v·∇T); either explain it clearly or remove it. Make "parcels arriving at the pole come from colder places upwind" clear.
- U-M2.17 (last scene, "what the dot product measures") Improve the content, the wording on screen and the narration. No references.
- Decision (user): length up to ~8 min is fine. Background music: unchanged (not mentioned).
- Decisions (user, 2026-10-23, v4): length 8:12 accepted; build `notebooks/poc_ch00a_dot.html` so the end-card link works (P1); s19 shaded wedge replaced by the upwind track (1 h / 2 h / 3 h dots) accepted.

## Movie `ch00_dot_product_why` — status after v4 (2026-10-23 evening)
- v4 fix 1 (d5bcb3f, 8:12) passed QA 10/10 and review 4b, but **the user is not satisfied**. Round-3 feedback (U-M3.*) comes in the next session; the scene map with v4 times is in `reports/ch00_session_handoff.md`.
