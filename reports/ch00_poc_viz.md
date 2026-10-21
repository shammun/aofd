# Chapter 0 PoC: explainer and scene review (PoC A, B, F)                         2026-10-21

Reviewer: viz-reviewer, fresh eyes, phase-7 gate. Brief: `analysis/ch00_poc.md`. Specs: `analysis/ch00_poc_design.md` Parts E and H.
What I ran myself:
- `tools/viz_lint.py` on all three files.
- `tools/shot.py`, then `shot.py --3d` (SwiftShader GL flags plus the WebGL-disabled pass) on A and B.
- `tools/shot.py --scene` on F.
- `tools/eq_refs.py`.
- My own Playwright click-walks. They click the real **Next →**, ⏭ and dot buttons through every walkthrough step and caption card, at 360×640, 390×844, 844×390, 1000×700 (notebook) and 1366×768, with WebGL on and off, and with reduced motion. The outputs are in the scratchpad (`walkA/`, `walkB/`, `walkF/`).
- Python checks of the inertial-period physics with `fluidpy.geo.frames`.
- The Code-tab snippets, run as written.

I checked the equations against the page text and images for ch02, PDF 77, 85–86, 115–116 and 111: (2.7), (2.28), (2.50a,b), (2.51), (2.55), (2.79), (2.80), (2.215), (2.233), (2.234a,b). I also checked Kundu ch02 for (K 2.2), (K 2.20) and (K 2.21).

| slug | kind | lint | shot (sizes/views) | parity ok | 3-D checks | explain | derivations | teaching | polish | exemplar compared | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| vector_products_lab | 3-D explainer | ok (soft warn: 0A has 1/12) | PASS 8 sizes, 288 views, 8 steps; `--3d` PASS; no-WebGL PASS (2 sizes) | 119/119 (GL), 110/110 (proj3) | context loss → message → restore OK; dispose → memory 0; 17 draw calls; reduced motion **broken** (autoplay) | 7 sections, boxes, live, interpretation | D0A-PoC1 9 steps, D0A-PoC2 10 steps, every line checked | strong; step 1 contradicted by autoplay | 3-D unreadable on 360×640 and 844×390; ghost arrow ambiguous | rossby_waves, geostrophic_adjustment, ekman_spiral | **FIX** |
| viz_example_globe | 3-D template | ok | PASS 8 sizes, 88 views, 6 steps; `--3d` PASS; no-WebGL PASS | 54/54 (GL), 41/41 (proj3); 2 rows are not honest (see B-M1) | restore OK; memory 0; 28 draw calls; GPU read-back rows (rtol 1e-6) OK; reduced motion **broken** | 6 sections | none (template) | good; phones get only the 3-D view | legend covers the not-to-scale badge on phones | geostrophic_adjustment, ekman_spiral | **FIX** |
| the_500hPa_surface | standalone scene | ok (soft warn: 0B 1/12) | `--scene` PASS 8 sizes, 40 rows, no scroll; my card walk: 8 cards × 5 sizes, 0 KaTeX errors, 0 console errors | 40/40 (data spot values, lat not flipped, JS↔Py 1e-9, ⟂ invariants, GPU LUT read-back) | restore OK (variance 4037); memory 0; 10 draw calls; data 28 kB; reduced motion OK; proj3 fallback draws | side panel + live probe | none | good arc; card 6 overclaims | arrow clutter; captions too fast | ekman_spiral (one-cursor), rossby_waves | **FIX** |

Disk report for F: present in `reports/data/NCEP1-hgt-daily.md`. C: 97.0 → 90.9 GB and G: 589.7 → 589.6 GB, with the C: drop not caused by the download. Licence: public domain. Attribution text is in the scene's About tab.

---

## A · vector_products_lab (`viz/ch00/vector_products_lab.html`, scene `viz/ch00/scenes/vector_products_lab.scene.js`)

### Must fix
1. **The transport auto-plays on load, contradicting walkthrough step 1 and ignoring reduced motion.**
   - Step 1 has `play: false` and says "a = (2, 1, 0) and b = (1, 3, 0)". On a fresh load the sweep is already running.
   - Measured after 2.5 s: `{t: 15, playing: true}` with plain URL; `t: 26` with `?audit=1`; `t: 17` under `prefers-reduced-motion: reduce`.
   - The step-1 readout then shows b = (−0.795, 3.06, 0) and the 3-D title θ = 69–78° (desktop step-1 screenshot from the walk).
   - Cause: `viz_lib.js` line 2030 `if (animated && cfg.autoplay !== false) app.play(true)` runs after `goStep(0)`.
   - Fix here: `autoplay: false`.
   - Fix in the kit (knowledge-keeper): never autoplay when the first tour step says `play: false` or when the reader asks for reduced motion.
   - `shot.py` missed this because it calls `goStep`. Only a real load showed it.
2. **The Coriolis-mode status arrow points the wrong way.**
   - `statusOf` prints "↺ −f k×u turns the wind right (NH)" and "↻ … left (SH)".
   - A right turn is clockwise seen from above (↻). The globe template uses ↻ for the NH correctly.
   - Swap the symbols, and add "clockwise seen from above" to follow teaching-style §1h.
3. **In 3-D, the ghost −f k×u (×10⁴) is a solid violet arrow on the same line as the violet k×u result, pointing the opposite way. The two look like one long violet line.**
   - |f k×u|·10⁴ = 10.3 is almost the same length as |k×u| = 10, so the ×10⁴ scaling reads as "equal".
   - The 2-D map dashes the ghost, so it is fine. The 3-D one is not.
   - At 390×844 step 7 the two tip labels collide with the "u" label.
   - Sign is shown only by direction, and the two arrows share hue and style.
   - Draw the ghost dashed or beaded (the candidate kit option `vectorField({dash})`), or in a lighter violet with an outline. Keep k×u solid. Add a one-line legend in the view title.
4. **The 3-D view is unreadable on 360×640 and 844×390.**
   - The canvas is 334×96 and 448×109 px. The glyph spans about 60×40 px.
   - The three provenance chips cover about 40 % of the view.
   - In step 7 (`top` camera) the labels pile onto the 2 cm grid square (390×844 walk, steps 2, 6, 7).
   - `fitPresets` is too conservative: minimum distance 6, plus 15 %, plus 0.5/0.6 padding. Step 6 `edgeOn` and the derivation-tab iso views fill only about ⅓ of the canvas even on desktop.
   - Fix:
     - collapse the chips to one "ⓘ 3 sources" chip on views under 420 px;
     - tighten the fit (padding in screen pixels, not scene units);
     - at 360×640 give row 0 the larger share;
     - keep single-letter E / N / U labels on small views instead of hiding the triad labels entirely.
5. **An equation is clipped in the notebook frame (1000×700).**
   - Step 2's equation card "(0A.3)" cuts its live line at "0.5 b = (0.5, 1.5, 0" (screenshot `walkA/notebook__step2.png`). The audit did not flag it because the overflow is inside a scrolling `.viz-eq`.
   - Split the live line into two, or use `\begin{aligned}`.

### Should fix
- **Dot-product citation.** Kundu numbers the dot product: (K 2.2) is a·b = a₁b₁ + a₂b₂ + a₃b₃ = aᵢbᵢ in §2.2. The design's "unnumbered" holds only for the §2.8 restatement. Cite (K 2.2) in the `dotdef` card and the Explain line.
- **Wrong labels in selftest names and scene comments.**
  - `(2.80)` for f = 2Ω sin ϑ is wrong. (2.80) is the β-plane Taylor expansion; f ≡ 2Ω sin ϑ is defined in the text after (2.51).
  - `(2.79)` for k×u is loose; (2.79) is the f-plane momentum equation.
  - `eq_refs.py` flags L3801.
- **3-D drag is missing.** Design H asks for dragging a tip in 3-D. Today 3-D picking only opens the inspector, so the 3-D view does no interactive work beyond orbiting.
- **The proj3 fallback is undersized.** It draws in about ⅓ of the view (`nowebgl/desktop__3d-nowebgl-scene0.png`). Raise `proj3Scale`, or fit to the drawn points.
- **Explain §1 in f k×u mode** still says "a's shadow on b's line … arc from a to b". Use `nameA`/`nameB` there too.
- **Code tab, kxu snippet:** add `import numpy as np` so it runs on its own. Both snippets run and reproduce the on-screen numbers: 5, 45°, 1.581, [0.5, 1.5, 0], [0, 0, 5], 5; f = 1.0313e-4; k×u = (−6, 8, 0).
- **Unused data:** about 27.5 kB of Natural Earth coast data is inlined but never used (no globe layer). The inliner should add it only when a globe layer is present.
- **Small overlap:** the face-on "shadow 1.58" label crosses the drop line at 390×844.

### What works
- Every derivation line follows by the stated move (D0A-PoC2 step 4's Σᵢ≠ⱼ and its mixed terms checked). The *why* and *in words* are true, and the live lines match the page.
- One clock (the sweep) drives the 3-D view, face-on view, θ-curves, signed bar, terms, Explain §7 and Code.
- The θ-curves have a faint whole curve, a bold "so far" part, ghost lines at ±|a||b|, and markers at 0°, 90° and 180°.
- Clicking a term isolates its component rectangle. The inspector shows the (K 2.20) arithmetic.
- 119 parity rows: JS ↔ `fluidpy.geo.vectors` at 1e-12, including the current state.
- Drawing invariants pass: drawn result ⟂ a and b; drawn length = area; drawn signed bar (float32, rtol 1e-5 stated); fallback geometry; camera read-back; the "sweep closes" row.
- Context-loss restore works (variance 189), dispose leaves memory 0, and there are 0 KaTeX errors over all 8 steps and 5 sizes.
- **Depth against the exemplars:** at the level of rossby_waves and geostrophic_adjustment for a Chapter-0 primer: 7 Explain sections, 2 full derivations, 7 depth features, the f k×u bridge to (2.55), and a prediction step. Once the Must-fix items are done, this passes on depth.

---

## B · viz_example_globe (`templates/viz_example_globe.html`)

### Issue (i): the 2 % sphere-vs-plane rows. Honest physics, wrong reference, loosened row.

I measured with `fluidpy.geo.frames.inertial_oscillation_sphere`, RK4, dt 60 s, eastward launch.

| case | T_sphere / (2π/f₀) − 1 | vs 2π/\|f(ϑ_c)\| | vs loop-mean f | metric terms off |
|---|---|---|---|---|
| 45°N, 10 m/s | **+1.60 %** | +0.043 % | +0.0004 % | +1.595 % |
| 45°N, 2 m/s | +0.31 % | +0.0016 % | +0.0001 % | |
| 45°N, 1 m/s | +0.15 % | +0.0004 % | +0.0001 % | |
| 30°N, 10 m/s | **+4.13 %** (fails 2 %) | +0.23 % | +0.0016 % | |
| 30°N, 30 m/s | +16.2 % | +2.9 % | +0.007 % | |

- **The offset is real and first-order. It is not round-off.** The puck loops around a centre that sits U/(f₀a) = 97 km (0.87°) equatorward of the launch point, for an eastward NH launch. There f is about cot ϑ·U/(f₀a) ≈ 1.5 % smaller, so the period is longer.
- **It is β, not metric.** Switching the metric terms off changes the result by only 0.006 %.
- **The 2 % row is a loosened tolerance.**
  - It passes only because of the launch chosen (45°N, eastward).
  - It would fail at 30°N.
  - It changes sign for a westward launch.
  - It hides a 1.6 % *physical* effect inside a "tolerance".
- **Replace the two 2 % rows (period and radius) with:**
  - **(a)** the sphere's own expectation: `T_run` against `2π/|f(ϑ_c)|`, with ϑ_c = ϑ₀ − u₀/(f₀a) (and λ_c shifted by v₀/(f₀a cos ϑ₀)). Measured +4.3e-4, so **rtol 1e-3**. The radius row the same way: measured +4.4e-4, rtol 1e-3.
  - **(b)** a small-U f-plane limit: U = 1 m/s against the flat `inertial_circle(1, f₀)`. Measured +0.15 %, so **rtol 3e-3**, inside the design's 1 %.
  - Optionally **(c)** `T_run·|⟨f⟩_loop|/2π = 1` with rtol 1e-4 (measured 4e-6). This is the strongest row.
- **Teach it in Explain §4.** "On the sphere this loop takes 17.2 h, not 16.9 h: its centre sits 97 km south of the start, where f is 1.5 % smaller." The end-of-run card and readouts R, T should say they are *f-plane* values. The run gives 98.5 km and 17.2 h.

### Must fix
1. **Issue (i)**, as above: swap the two 2 % rows for the (a)/(b) rows.
2. **Issue (ii), portrait phones: only the 3-D view is visible.**
   - Both `local` and `fcurve` are `hidePortrait`. The walk confirms that on 360×640 and 390×844 every step shows only `scene3d`.
   - This breaks the skill rule "Portrait phones: the 3-D view + one 2-D view, swapped by step". It also leaves step 2's true-scale loop (the f-plane circle and the drift) and step 4's f(ϑ) curve unseen by phone readers.
   - Make `local` visible on portrait by default and swap in `fcurve` on step 4 (the scoped-CSS `data-*2d` swap used in vector_products_lab).
   - This is a reference template, so its layout will be copied.
3. **At 390×844 step 4 the f legend covers the "1 s = 2 h · arrows, dots enlarged — not to scale" badge.**
   - The honesty badge is hidden, and the `f k` label is clipped at the bottom edge.
   - Stack the legend below the badge or move it to the bottom-right, and keep labels inside the canvas.
4. **Reduced motion is ignored (kit).** The transport autoplays under `prefers-reduced-motion: reduce` (measured `playing: true, t ≈ 1.6 h` after 2.5 s). This is the same fix as A-M1.

### Should fix
- **No E/N/U triad at the puck.** Required by the R2 §8.4 checklist. Add a small triad in the `near`/`over` views.
- **Equation numbers without the equation.** Step 1's text cites "(2.55)" with no equation shown: add `eq: 'vec'`. Explain §5 cites "(2.7)" without writing v_I = v_R + Ω×r. `eq_refs.py` lists both.
- **f(ϑ) panel labels are misplaced.** "f > 0: turns right" sits over the southern half and "f < 0: turns left" over the northern half. Put each in its own quadrant.
- **No real-GPU frame rate recorded.** SwiftShader gives about 6–8 fps for the whole page in rAF, with 28 draw calls. The builder's 33 → about 50 fps claim on Iris Xe is not reproduced here.
- **The keep-warm hidden glyph/trajectory is a workaround.** Track the kit fix (update buffers in place) so the template does not teach the workaround.

### What works
- **Physics.**
  - Spherical components with ∇p = 0 match (2.50a,b) and (2.28) on the page (signs checked).
  - The space view uses (2.7). Inertial circles match (2.234b).
  - The (2.233) card reads "for f > 0 the force is to the right", as the book does.
- **Parity rows.**
  - RK4 path at 6 h, 24 h, 48 h, backward −12 h and off-grid t, all at 1e-9…1e-12.
  - Speed kept to 1e-6 (shown live as 10.000000).
  - Hemisphere mirror.
  - Drawn path end = RK4 state (atol 1e-9).
  - Glyph result ⟂ u.
  - The glyph's sign follows `coriolis_horizontal`.
  - GPU f-texture read-back at ±47.5° (float32, rtol 1e-6, lat orientation checked).
- **Context loss and fallback.** Context-loss restore works (variance 1306) and dispose leaves memory 0. The fallback draws the graticule, coast and paths.
- **Teaching.**
  - The where-from / where-to probe works.
  - The status names the hemisphere and the viewpoint.
  - The "rotate planet or camera, never both" rule is respected.
  - The last step asks for a prediction.

---

## F · the_500hPa_surface (`scenes/ch00/the_500hPa_surface.html`, NCEP R1 2014-01-06)

### Must fix
1. **Card 6 overclaims the wind.**
   - The jet probe sits at the base of the Great Lakes trough (32.5°N, 90°W). The caption says the slope "gives about 68 m/s".
   - That is the *geostrophic* speed. The contour curvature there gives R ≈ 1700 km, so Ro = V_g/(fR) ≈ 0.51, and the cyclonic gradient wind from (2.234b) is ≈ **49 m/s**.
   - Fix the caption to "geostrophic estimate ≈ 68 m/s; the bend of the trough (Ro ≈ 0.5) slows the real wind to about 50 m/s", with (2.234b) written out in the probe tab. Alternatively, pick the jet point among nodes with Ro < 0.2.
   - This is also the "when it breaks" moment that teaching-style §1e asks for.
2. **Arrow clutter.**
   - On phones (390×844, 360×640) the 1872 arrows are 3–5 px teal specks, so card 5's "the wind follows the lines" cannot be seen. On desktop, arrows pile into streaks along the limb.
   - Polar rings are uneven: the stride rule `2·max(1, round(0.5/cos ϑ))` gives about 190 km zonal spacing at 70°N against 556 km meridional. Arrows of 20–40 m/s are 223–446 km long, so they overlap their neighbours.
   - Fix:
     - use near-constant ground spacing, stride ≈ 2·round(1/cos ϑ) (about 500 km);
     - cull arrows whose surface normal faces away or grazes the view (n̂·view < 0.3);
     - thin by screen spacing (≥ 28 px) at the current zoom;
     - on phones, use larger heads, or show only every other ring.
3. **Caption pacing is too fast.**
   - Every card gets 7 s (`CARD = 7.0`) for 25–50 words, including a 0.9 s camera tween. That is about 210–430 words a minute, and autoplay (without reduced motion) is the default first experience.
   - Use duration = max(8, 3 + 0.3·words) s (card 3 → about 18 s), or pause at the end of each card with the ⏭ button pulsing.

### Should fix
- **The side panel scrolls internally on phones** (`.sp-pane { overflow-y: auto }`). 33 px of hidden text at 390×844, 106 px at 360×640, 149 px on the probe tab. The Idea text is cut mid-sentence at "That balance is Eq." with no cue. Page the panel, or shorten it on phones.
- **Chips wrap on phones.** The provenance chips take 2–3 lines and cover the top of the globe. Use one line with ellipsis, as vector_products_lab already does.
- **Card 3 overstates the cause of a trough.** "A low 500 hPa height means the column below is cold and squashed, **not** that the pressure at the ground is low" is too absolute: Z500 = Z₁₀₀₀ + thickness. Write "mostly that … , not necessarily that …".
- **The no-WebGL fallback shows the far side.** Back-hemisphere labels and arrows show through ("SH low" and "no arrows: f → 0" on the NH polar view). Cull back-facing items in proj3.
- **Notebook frame (1000×700):** the panel tabs truncate to "Eq. 2…" and "Cont…". Use shorter labels ("Eq.", "Ctrl").
- **Wrong label in the code:** `coriolisParameter` docstring says "(2.80)". Use "f ≡ 2Ω sin ϑ, defined after (2.51)".
- **Tool gap (knowledge-keeper):** `shot.py --scene` does not walk the cards, check panel overflow, or run the no-WebGL pass. My walk did all three.

### What works
- **Equation and physics.**
  - (2.215) f×u_g = −∇_pΦ is written out with its components and live numbers. u_g = −(g₀/f)∂Z/∂y and v_g = (g₀/f)∂Z/∂x are checked against the page.
  - JS ↔ `fluidpy.geo.atmos.geostrophic_wind_from_height` agree to 1e-9 at 4 points, plus the mask count, the zonal mean and the maximum.
  - Data spot values match to within half the quantisation step.
- **Latitude is not flipped.** The trough is found at 42.5°N, 270°E, and the NH zonal mean falls poleward.
- **Drawing invariants.**
  - Wind ⟂ ∇Z to 3e-16 (CPU) and 4e-8 (float32 instance matrices).
  - Drawn vertex radius = 1 + ex·(Z − Z̄)/a.
  - Isolines interpolate exactly.
  - Circulation sign around NH and SH lows.
  - The balance glyph closes head to tail.
- **Honesty and flow.**
  - The "height ×200 — not to scale" badge appears from card 2 on; card 1 is at true scale.
  - There are data, computed and schematic chips, and a 20 m/s key that rescales with zoom.
  - Reduced motion is respected: no autoplay, with a note on the card.
  - The 8 cards keep one clock and one idea each, and end on the southern hemisphere and a hand-over.

---

## R2 §8.4 3-D checklist

| item | A | B | F |
|---|---|---|---|
| provenance chip on every layer | ✓ | ✓ | ✓ |
| parity JS↔Py / GPU↔CPU / invariants, tolerances stated | ✓ | ✓ except the 2 % rows (B-M1) | ✓ |
| exaggeration, time and speed scaling labelled; true-scale toggle | ✓ ×10⁴ badge | ✓ 1 s = 2 h; badge hidden on phone (B-M3) | ✓ ×200; ×1 = true scale |
| hemisphere flip changes f and deflection; E/N/U triad | flip ✓; status symbol wrong (A-M2); triad unlabelled on phones | ✓; no triad | SH card ✓; n/a |
| equations written in full with number | ✓ (cite K 2.2) | step 1 and Explain §5 missing | ✓ |
| 3-D linked to a 2-D reading by one state | ✓ | ✓ (not on phones, B-M2) | n/a (scene) |
| walkthrough 4–8 steps, camera + layer, last step a prediction | ✓ 8 | ✓ 6 | 8 cards ✓ |
| glyph language (teal/orange, shadow, parallelogram, arc) | ✓; ghost style (A-M3) | ✓ | balance glyph ✓ |
| Explain reproduces screen numbers; Code runs | ✓ ran | ✓ ran | probe tab ✓ |
| legend with units; cmocean/viridis; sign not by hue alone | n/a / A-M3 | balance ✓ | thermal ✓ |
| labels ≥ 12 px, ≤ 6 on phones, no overlap | overlaps on phones (A-M4) | legend over badge (B-M3) | chips over globe (Should) |
| no scrolling at 8 sizes and in a notebook frame | ✓ (clip, A-M5) | ✓ | page ✓; panel scrolls inside |
| fps / DPR / draw calls | 17 calls, DPR 1; SwiftShader only | 28 calls; SwiftShader 6–8 fps; no iGPU number | 10 calls, 148k triangles; SwiftShader about 4 fps |
| context-loss restore; dispose → 0 | ✓ / ✓ | ✓ / ✓ | ✓ / ✓ |
| proj3 fallback; all tabs | ✓ (small) | ✓ | ✓ (back-side labels) |
| reduced motion | ✗ (A-M1) | ✗ (B-M4) | ✓ |
| data ≤ 150 KB, file ≤ 600 KB, three.js 0.186.1, no extra CDN | 407 KB (27.5 kB unused coast) | 360 KB | 389 KB, 28 kB data |

## Verdict: **FAIL**

All three items are FIX. None is far off. Every lint, shot, `--3d`, `--scene` and no-WebGL run passes, and the physics mirrors are exact.

The blocking items, in order of priority:
1. Autoplay and reduced motion (A-M1, B-M4). One kit fix plus `autoplay: false`.
2. The globe's 2 % rows replaced by the honest centre-latitude and small-U rows (B-M1).
3. The scene's card 6 geostrophic overclaim (F-M1).
4. Phone legibility: the 3-D view in A (A-M4); a 2-D view on portrait in B (B-M2); the arrows in F (F-M2); the hidden badge in B (B-M3).
5. The A status symbol, ghost arrow style and notebook clip (A-M2, A-M3, A-M5), and the F caption pacing (F-M3).
