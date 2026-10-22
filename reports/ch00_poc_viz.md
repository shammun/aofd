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


---

## Re-review after fix round 1                                                     2026-10-21

What I ran again:
- `viz_lint.py` on all three: ok. The only warnings are the soft 0A/0B count warnings.
- `shot.py` on A: PASS (8 sizes, 288 views, 8 steps, 125 rows).
- `shot.py --3d` on A: PASS (SwiftShader, 130/130 rows). `--no-webgl` on A: PASS (121 rows).
- `shot.py` on B: PASS (8 sizes, 88 views, 6 steps, 68 rows).
- `shot.py --3d` on B: PASS (68/68). `--no-webgl` on B: PASS (8 sizes, 55 rows).
- `shot.py --scene` on F: PASS (8 sizes, 49/49 rows).
- `eq_refs.py` on all three.
- My own walks with real **Next →** and ⏭ clicks, at 360×640, 390×844, 844×390, 1000×700 and 1366×768: A 8 steps and B 6 steps (WebGL), F 8 cards (WebGL plus no-WebGL). Result: 0 KaTeX errors and 0 console errors.
- A page-by-page pager walk of A's step card and all five F panel tabs.
- A load test with no step clicked, with and without reduced motion and `?audit=1`.
- A Python sweep of the sphere loop residuals with `fluidpy.geo.frames.inertial_oscillation_sphere`.

Outputs are in the scratchpad under `rr/`.

| slug | kind | lint | shot (sizes/views) | parity ok | 3-D checks | explain | derivations | teaching | polish | exemplar compared | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| vector_products_lab | 3-D explainer | ok | PASS 8/288; `--3d` PASS; no-WebGL PASS | 130/130 (GL), 121/121 (proj3) | autoplay off and reduced motion OK; beaded ghost; chips collapse to "ⓘ 3 sources"; E/N/U letters; fallback now fills the view | 7 sections | D0A-PoC1/2 unchanged, checked | strong | 360×640: 3-D illegible, step card pages 3–8 | rossby_waves, geostrophic_adjustment, ekman_spiral | **PASS** |
| viz_example_globe | 3-D template | ok | PASS 8/88; `--3d` PASS; no-WebGL PASS | 68/68; sphere rows now on the right reference, tolerances not derived (B-R1) | 3-D + `local`, swapped to `fcurve` on step 4, on portrait; badge visible; reduced motion OK | 6 sections; §4 does not yet teach 17.2 h | n/a | good | chips cover the lower half of the globe at 844×390 | geostrophic_adjustment, ekman_spiral | **FIX** (one item) |
| the_500hPa_surface | standalone scene | ok | `--scene` PASS 8 sizes; my walk: 8 cards × 5 sizes, panel overflow 0 on every tab | 49/49 incl. (2.234b) rows at 1e-9 vs numpy | arrows equal-area (worst spacing 18 %), culled; ⟂ ∇Z 3.6e-8 (float32) | Eq. tab adds (2.234b) with live R, Ro, U | n/a | card 6 honest | orphan heading page at 360×640 | ekman_spiral, rossby_waves | **PASS** |

### A · vector_products_lab: previous Must-fix items
1. **Autoplay. Fixed.**
   - On load: `{t: 0, playing: false}` with plain URL, `?audit=1`, and `prefers-reduced-motion`.
   - `viz_lib.js` now also skips autoplay when `tour[0].play === false`.
2. **Status symbol. Fixed.** It now reads "↻ … right (clockwise seen from above, NH)" and "↺ … left (anticlockwise …, SH)".
3. **Ghost arrow. Fixed.**
   - The ghost −f k×u ×10⁴ is beaded; k×u is solid.
   - The legend sits in the view title.
   - A parity row checks the dash count.
4. **Phone 3-D. Fixed where it counts.**
   - The camera fit is tighter: edge-on fills the canvas at 1366×768 and 390×844.
   - The chips collapse to one "ⓘ n sources" chip, and the triad uses E/N/U letters.
   - At 360×640 the 3-D view is still 348×106 px, and its labels pile up at step 7.
5. **Notebook clip. Fixed.** Step 2's (0A.3) live line now breaks onto two lines at 1000×700.
- **Should-fix items from last round now done:** (K 2.2) is cited; the wrong (2.80) label is gone; `import numpy as np` is in both snippets; the proj3 fallback fills the view.

**(b) 360×640, step 7.** The 3-D view is decoration there, and that is acceptable on a 360×640 phone *for the picture*:
- the 2-D map (348×89) shows u, the solid k×u and the dashed −f k×u with "right (NH)";
- the status line names the turn and the hemisphere;
- 390×844 and every larger size show the 3-D view legibly.

The real weakness at this size is the **text**:
- Step 7's card has 8 pages. Page 1 is the title only, and pages 2–3 show one visible line each, under "continued on the next page".
- The (2.55) equation card is cut into 4 slices.
- The exemplars also start some steps with a title-only page at this size (geostrophic_adjustment step 3: 1/4; rossby_waves: up to 6 pages). A is at the bad end of that range (3–8 pages per step), so this is a **Should-fix**, not a Must-fix.

**(c) Depth.** Yes, at the level of rossby_waves and geostrophic_adjustment for a Chapter-0 primer.

| feature | A | rossby_waves | geostrophic_adjustment |
|---|---|---|---|
| linked views on one clock | 3 | ✓ | ✓ |
| ghost reference | ✓ | | |
| prediction step | ✓ | | |
| inspector with component arithmetic | ✓ | | |
| term bars | ✓ | | |
| derivations | 2 (9 + 10 steps) | D22, D23 | D16 (11 steps) |
| bridge to a book balance | f k×u → (2.55) | | |
| Explain sections | 7 | 11 | |
| parity rows | 130 | 53 | 67 |

A has fewer Explain sections, which fits the smaller topic. What it still lacks against them is a 3-D tip drag (below).

**Should fix (A)**
- **360×640 step card.**
  - Hide the preset strip in the Walkthrough on portrait phones; the step sets the case.
  - Shorten the status to one line ("↻ turns right · NH").
  - Fit the step dots on one row.
  - On steps 7–8 under 700 px of height, either swap the 3-D view out or hide its tip labels.
  - Target ≤ 3 pages per step.
- **3-D tip drag** (design Part H) is still missing.
- **Explain §1 in f k×u mode:** check that it uses `nameA`/`nameB`.

### B · viz_example_globe: previous Must-fix items
1. **The 2 % rows are replaced.**
   - New rows compare against ϑ_c = ϑ₀ − u₀/(f₀a) and against the U = 1 m/s f-plane limit, at 30°N, 45°N, 60°N and 45°S.
   - The JS values match my Python run to 4 digits (for example 30°N: T = 89 725 s vs 2π/|f(ϑ_c)| = 89 522 s).
   - **The tolerances are not right; see B-R1 below.**
2. **Portrait layout. Fixed.**
   - 360×640 and 390×844 show `scene3d` plus `local` on steps 1–3, 5 and 6, and `fcurve` on step 4.
   - 844×390 shows the 3-D view only. That is acceptable for landscape.
3. **Badge. Fixed.** The legend has moved to the top right and the not-to-scale badge is visible at 390×844 step 4. The "f k" tip label is still cut at the bottom edge (Should-fix).
4. **Reduced motion. Fixed.** Under reduce: `playing: false, t: 0`.

**(a) Is the 30°N rtol 3e-3 derivable? No: it was picked to pass.**

Define the expansion parameter ε = U·cot ϑ/(|f₀|a): 0.0373, 0.0152 and 0.0072 at 30°, 45° and 60° for U = 10 m/s. My sweep (RK4, dt 60 s) gives:

| row | measured residual | as a multiple of ε or ε² |
|---|---|---|
| centre row, period | 2.27e-3 / 4.32e-4 / 1.47e-4 | **1.6 / 1.9 / 2.9 ε²** |
| centre row, radius | 1.68e-3 / 2.89e-4 / 7.9e-5 | 1.2 / 1.25 / 1.5 ε² |
| f-plane row (U = 1) | 3.76e-3 / 1.53e-3 / 7.2e-4 | **1.01 / 1.00 / 1.00 ε** |

- Halving U cuts the centre residual by 4.3 / 4.1 / 4.1 times, so the centre rows really are second order.
- The f-plane rows are exactly first order.

The chosen tolerances do not follow this law:
- The 30°N centre row at 3e-3 has a margin of only 1.3×, while 45°N has 2.3× and 60°N has 6.8×.
- The f-plane rows have 5e-3 / 3e-3 / 3e-3, margins 1.3× / 2× / 4×.

**B-R1 (Must fix).** Compute each row's tolerance from ε inside the row and say so in its name:
- Centre rows: `rtol = 5·ε²` (30°N 7.0e-3, 45°N 1.16e-3, 60°N 2.6e-4; margins 3.1×, 2.7×, 1.75×).
- f-plane rows: replace them with expect rows `(T_run/T_f0 − 1)/ε = 1`, rtol 0.1 (measured 1.01 / 1.00 / 1.00). This tests the β-shift theory instead of hiding it.
- Add one order row: `residual(U = 10)/residual(U = 5) = 4`, rtol 0.15.

**Should fix (B)**
- **Explain §4 and step 2 still say "comes round in 16.9 h"**, while the run on screen takes 17.2 h on a 98.5 km loop. Add the line "its centre sits 97 km equatorward, where f is 1.5 % smaller". The readouts are already labelled U/|f₀| and 2π/|f₀|.
- **f(ϑ) panel labels are still on the wrong hemisphere.** Line 4190 places "f > 0" at ϑ = −85° and "f < 0" at +85°.
- **Chips over the globe.** At 844×390 and 360×640 the badge and two full-width chips cover the lower 40–50 % of the globe, and the teal u is hidden at 844×390 step 3. Use the "ⓘ n sources" chip collapse that A uses.
- **Step 1 autoplays while asking "Where does it go?"** Give it `play: false` so the prediction stands.
- **Step 1 cites (2.55)** without `eq: 'vec'`.
- **No E/N/U triad** at the puck.
- **No real-GPU fps** number recorded.

### F · the_500hPa_surface: previous Must-fix items
1. **Card 6. Fixed.**
   - It now reads geostrophic ≈ 68 m/s, R ≈ 1700 km, Ro 0.5, gradient wind (2.234b) ≈ 49 m/s.
   - The Eq. tab writes out U²/R + fU = −∂φ/∂n = fU_g and the root with live numbers.
   - New rows: R, Ro and U at 1e-9 vs numpy; the residual at 1e-12; the R → ∞ limit; U < U_g.
2. **Arrows. Fixed.**
   - Equal-area rows; worst spacing 18 %.
   - n̂·ĉ < 0.3 culled.
   - At 390×844 the arrows are clear and follow the lines; the 1366×768 limb is clean.
3. **Pacing. Fixed.** Each card lasts max(8, 3 + 0.3·words) s.
- **Should-fix items from last round now done:**
  - the panel is paged with no scrolling (overflow 0 on every tab at all 5 sizes);
  - the tab labels read "Eq." and "Ctrl";
  - card 3 says "mostly … not necessarily";
  - the no-WebGL view culls the far side.

**Should fix (F)**
- **Orphan heading at 360×640.** Page 1 of the Idea tab holds only the heading "What you are looking at". `paginate` keeps an H3 alone when the next block does not fit; move a lone H3 to the next page.
- **Eq. tab length at 360×640.** It has 11 pages; merge the two component lines.
- **Card 6 caption** cites "Eq. 2.234b" without the equation. Add "U²/R + fU = fU_g".

## Re-review verdict

| item | verdict |
|---|---|
| A · vector_products_lab | **PASS** (Should-fix items listed) |
| B · viz_example_globe | **FIX**: only B-R1, the tolerances derived from ε as above |
| F · the_500hPa_surface | **PASS** (Should-fix items listed) |

Overall: **FAIL until B-R1 is done**. That change is about 10 lines and touches no physics. Everything else from round 1 is resolved.

## Round 2 — B · viz_example_globe (2026-10-21)

**B-R1: fixed.** The selftest code (`templates/viz_example_globe.html` lines 4103–4122) computes every tolerance from ε inside the row, with no per-latitude constants.
- It defines `epsOf(lat, U) = U·cot|ϑ0| / (|f(ϑ0)|·a)` and loops over `[30, 45, 60, -45]` with the same expressions at every latitude.
- **Centre rows** use `rtol: r5` with `r5 = 5·ε(U=10)²`. ε and the rtol are printed in each row name. The Python side evaluates `inertial_circle(10, coriolis_parameter(ϑ0 − 10/(f0·a)))`; in the south this moves the centre equatorward, which is correct.
- **f-plane rows** are expect rows `(T_run/T_f0 − 1)/ε = 1` and `(R_run/R_f0 − 1)/ε = 1`, rtol 0.1.
- **Order row**: `res(10)/res(5) = 4` at 45°N, rtol 0.15.

**Re-run results**
- `viz_lint`: ok.
- `shot.py --3d`: **PASS**. SwiftShader, 8 sizes, 88 views, 6 steps, **69/69 selftest rows ok**.
- `shot.py --no-webgl`: **PASS**. Viz.proj3, 8 sizes, 88 views, 56 rows.

**Measured values (audit.json)**

| row | 30°N | 45°N | 60°N | 45°S |
|---|---|---|---|---|
| period residual, in ε² | 1.6 | 1.9 | 2.9 | same as 45°N |
| f-plane coefficient, T | 1.0097 | 1.0050 | 1.0038 | 1.0050 |
| f-plane coefficient, R | 1.0083 | 1.0025 | 1.0025 | 1.0025 |

- Order ratio: **4.13**.
- The builder's stated f-plane range of 1.004–1.010 is slightly off: the R rows go down to 1.0025. All rows are well inside 0.1.

**Should-fix items from round 1**
- **17.2 h text: done.** Step 2 says "comes round in 17.2 h (16.9 h on an f-plane; β slows it…)". The readouts are labelled U/|f₀| and 2π/|f₀|.
- **f(ϑ) labels: done.** "NH: f > 0, turns right" is now on the right half and "SH: f < 0, turns left" on the left (seen at 1280×720 and 1366×768).
- **Chips: done on the phone views.** Phone-tall and phone-land show "ⓘ 2 sources". The "not to scale" badge still crosses the lower globe at 844×390 and 390×844. It is acceptable because it is a badge, not a data layer.

**Still open (Should fix)**
- Step 1 still autoplays: the pause icon shows and t = 0.44 h at phone-land. It needs `play: false`.
- Step 1 cites "(2.55)" without the equation written out.
- At 390×844 the rotated "y north [km]" title touches the −100 and −200 tick labels.
- In the proj3 fallback the arrows are labelled "a" and "b" instead of u and f k̂.

**B verdict: PASS.** No open Must-fix items, so the PoC viz overall is **PASS** (A PASS, B PASS, F PASS).

---

## PoC A — round 3 (after the user's feedback, 2026-10-21)

Fresh-eyes gate review of the reworked `viz/ch00/vector_products_lab.html` (scene `viz/ch00/scenes/vector_products_lab.scene.js`, inlined). The review was checked against `reports/ch00_poc_user_feedback.md` §A (U-A.1–16, F-A.1–16, P-A.1–9), the user's screenshots `1.png`–`4.png`, and the binding decisions: animated right hand + tip view + swap; defaults a = (2, 1, 0), b = (2, 4, 0); a·b drawn as a rectangle, never an arrow. The explainer was not edited. Reviewer screenshots are in `reports/viz/ch00/vector_products_lab/review3/`.

| slug | kind | lint | shot (sizes/views) | parity ok | 3-D checks | explain | derivations | teaching | polish | exemplar compared | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| vector_products_lab | 2-D + 3-D view | ok (1 soft WARN: 0A count) | `--3d` PASS 8 sizes / 288 views / 8 steps; no-WebGL PASS 2 sizes / 72 views | 226/226 (GL), 180/180 (fallback) | most items pass; reduced motion and phone legibility fail | 9 sections, 5 boxes, live | D0A-PoC1 (9 steps), D0A-PoC2 (10 steps), both correct | strong, but step 8 is broken | phone portrait weak | rossby_waves / geostrophic_adjustment / ekman_spiral | **FIX** |

### Gate numbers (all re-run by the reviewer)
- **`tools/viz_lint.py`**: ok. One soft WARN: "0A has 1 explainer".
- **`tools/shot.py --3d`**: **PASS**. SwiftShader, 8 sizes, 288 views, 8 steps, **226/226 selftest rows ok**.
  - Canvas variance ranged from 126 (phone-land) to 425 (full-hd) and was never blank.
  - Forced context loss showed the "paused" message, then restored (variance 144 at phone-tall, 130 at desktop).
  - `renderer.info.memory` → geometries 0, textures 0 after dispose.
- **No-WebGL pass**: **PASS**. Viz.proj3, 2 sizes, 72 views, 180/180 rows; every tab works.
- **Reviewer probe** (Playwright with the GL flags; real clicks on "Next →"):
  - All 8 steps at 360×640, 390×780, 1440×900 and 1000×700, and inside a 1000×700 notebook iframe.
  - 0 page errors, 0 `.katex-error`, no scrolling at any size or step.
  - Below-12 px text comes only from KaTeX subscripts.
- **Other measurements**:
  - Draw calls 13 at laptop size; headless DPR 1. SwiftShader frame rate is 5 fps at 1440×900 (software rendering; no real-GPU number was taken).
  - File size 474 KB (≤ 600 KB). `tools/eq_refs.py`: 0 bare equation numbers.
- **Maximise**:
  - `VIZ.app.maximise('v3d')` grows the 3-D view from 982×368 to 1424×723 at 1440×900. The camera refits, and a, b, the rectangle and a×b fill the view (`review3/max_v3d.png`). Esc returns (`maxView` = null).
  - Phone 360×640: the 3-D view grows to 348×415, and the hand is then readable (`review3/phone_step6_max.png`).
- **Independent hand calculations, all matching the screen**:
  - Start preset: a·b = 2·2 + 1·4 = 8; a×b = (1·0 − 0·4, 0·2 − 2·0, 2·4 − 1·2) = (0, 0, 6); |a||b| = √5·√20 = 10; θ = acos 0.8 = 36.87°.
  - Start preset: shadow 8/√20 = 1.789; b's shadow on a 8/√5 = 3.578; height √20·0.6 = 2.683.
  - Tilted preset: a·b = 3; a×b = (0, 6, −6); θ = acos(1/3) = 70.53°; area 9·0.9428 = 8.485.
  - f k×u preset: k×u for u = (8, 6, 0) is (−6, 8, 0). f(45°) = 2·7.292115e-5·0.70711 = 1.0313e-4 s⁻¹. −f k×u = (6.19e-4, −8.25e-4) m/s² is to the right of u. 2π/f = 16.9 h. |f||u|·900 s = 0.93 m/s.
- **Hand geometry, read back from `handPose`**:
  - Fingers lie along e1 and the palm faces +e2 (toward the second arrow), with the thumb on the +n side. That is a right hand exactly when e1 × e2 · n = +1.
  - Measured +1 for the default pair, default + swap, tilted, and tilted + swap. In all four cases thumb·unit(first × second) = 1; tilted a×b points along (0, 0.707, −0.707), so this covers a non-vertical a×b.
  - **The hand is a right hand, not a left hand. The thumb follows a×b, and flips with swap.**
- **f k×u mode**, sampled at turns 0/60/135/200/300° and latitudes +45°, −45°, 0°:
  - u stays horizontal and k×u is 90° to its left.
  - −f k×u is to the right at 45°N (z-component of u × (−f k×u) = −0.0103) and to the left at 45°S (+0.0103). It is zero at the equator, and the status line says so.
  - The map rotates with the turn (`review3/kmode_lat45_t135.png`, `kmode_lat-45_t60.png`).

### Per-U-A table: would a first-time reader who asked this get the answer from the explainer?
| U-A | Question (short) | Answered? | Where |
|---|---|---|---|
| 1 | Why is a·b an upward arrow? | **Yes** | a·b is now a flat teal rectangle with "a·b = shadow × \|b\| = 1.79 × 4.47 = 8" (3-D and face-on), the HUD reads "a·b is a number: the rectangle's signed area", and the 3-D title reads "a·b = 8, a number". Also the subtitle and Explain §1. A selftest row checks "no a·b arrow in space". |
| 2 | What are E, N, U? | **Yes** | Maths mode uses an x/y/z triad. f k×u mode has the HUD legend "E, N, U = east, north, up", the map compass "↑N →E", and Explain §1. |
| 3 | Sweep φ vs θ? | **Yes** | The slider is now "turn b by" ("turn the wind by" in f k×u mode) and its readout shows "20° · θ 57°". The slider help and Explain §9 say the turn runs 0–360° while θ runs 0–180°. φ is kept free for (1.7). |
| 4 | a·b = 5 but shadow 1.58? | **Yes** | Step 2, "The shadow is not a·b (yet)", gives the live shadow 1.79 = a·b̂, with b̂ drawn dark orange. Step 3 multiplies by \|b\| to get 8. Explain §2–§3 and the Code lines 6–8 say the same. |
| 5 | a×b = 5 next to a·b = 5? | **Yes** | The defaults now give 8 and 6. Step 1 says "one gives a number, the other a new arrow". The 3-D titles read "a·b = 8, a number" and "a×b = (0, 0, 6), an arrow", and Explain §7 adds 8² + 6² = 10². The 45° coincidence itself is no longer shown, which is acceptable. |
| 6 | 3-D too small | **Yes on laptop and notebook; partly on phones** | ⤢ on every view, ↗ to a new tab, Esc to return, and the camera refits. On portrait phones the inline views are still 95–161 px tall (Must-fix M2). |
| 7 | Label the parallelogram | **Yes** | 3-D: "area = \|a×b\| = 6". Face-on: "⊙ area = \|a×b\| = 6", "base \|a\| = 2.24", "height \|b\| sin θ = 2.68". |
| 8 | Right-hand rule, interactive 3-D | **Yes, with polish needed** | Step 6 shows the animated curl, the swap, and an "a×b tip" camera chip. Explain §6 gives the index/middle-finger version and checks i×j = k. The hand is correct but low-contrast (S1), and step 8's swap test does not work (M1). |
| 9 | Something other than three.js? | n/a | This was a process question, answered in the orchestrator's reply ("keep three.js"). It is not an on-screen item. |
| 10 | Parallel: why 10, not √5? | **Yes** | Step 2 with the parallel preset shows "shadow 2.24, that is not a·b" while the bar shows 10 (`review3/parallel_step2.png`). Explain §2 says "This is where a √5 comes from", and Check Q1 asks exactly this question. |
| 11 | 3Blue1Brown inspiration | **Partly** | Step 5 brings in the 2-D signed area a_xb_y − a_yb_x = 6 ("b is anticlockwise from a") before the 3-D arrow. There is no "determinant scales areas" picture. That is acceptable for this PoC. |
| 12 | Anti-parallel: why −10, not 0? | **Yes** | Face-on: the rose, hatched rectangle reads "a·b = shadow × \|b\| = −2.24 × 4.47 = −10" (`review3/anti_step3.png`). Explain §4: "Anti-parallel is not 'no shadow'". Check Q2 and the notes say the same. (In 3-D, a is hidden under the shadow: S5.) |
| 13 | What does f k×u mean? | **Yes** | Step 7 gives live k×u = (−6, 8, 0), "f = 1.03×10⁻⁴ s⁻¹ multiplies each component", and "pushes right of u (NH)". Explain §8 covers f = 2Ω sin ϑ with numbers, the change of units from m/s to m/s², (2.55) written out and moved to the right side, u·(−f k×u) = 0, 0.93 m/s per quarter hour, and 2π/\|f\| = 16.9 h. |
| 14 | The turn doesn't move the map | **Yes** | The wind now turns about k and the map rotates with it. Rows check "map arrows follow the turn" at 5 angles, and the screenshots confirm it. |
| 15 | What are all the vectors in f k×u 3-D? | **Yes** | The HUD legend line, the view title and the per-arrow labels name every arrow. The badge reads "−f k×u drawn ×10⁴, in m/s² (k×u is in m/s) — not to scale", and the log-scale "How big?" view shows the sizes. Some labels collide in the southern hemisphere (S3). |
| 16 | Scientific correctness | **Yes, minor slips** | The physics, signs, numbers and both derivations are correct. Slips: S7 (equator labelled "NH"), S8 (\|f k×u\| = f\|u\| should read \|f\|\|u\|), S6 (reduced motion). |

### Must fix
- **M1 — Step 8 ("Your turn: predict") opens in f k×u mode, so two of its three predictions cannot be tested.**
  - **What is wrong.** Step 8 has no `set`, so it inherits step 7's state (`kmode: true`). I ticked "swap the order: b×a" with a real click on step 8. The result: `kmode: true, swap: true, hand: false`; the 3-D title, the status and the picture were unchanged (`review3/s8_real_swap.png`). Prediction (1), "which way does the thumb point now?", has no thumb to look at. Prediction (3), "make a·b negative", has no a·b on screen in f k×u mode.
  - **Why it matters.** The last walkthrough step is the R2 §8.4 prediction step, and the user asked for the swap demo specifically.
  - **Fix.**
    - Give step 8 a `set` that leaves f k×u mode (`PDEF` + `show: 'both', hand: true, swap: false, cam: 'iso'`). Make prediction (2) say "press the f k×u chip, then drag the latitude below 0°", or show an "f k×u" chip button in the step.
    - Alternatively, have `onChange('swap')` with kmode on switch back to maths mode with the hand on.
    - Add a selftest row: every control a step lists changes the drawn scene from that step's own state.
- **M2 — Portrait phones: the key pictures are too small to read, and the step text is hidden behind paging.**
  - **Measured view heights.**
    - 360×640: 3-D view 95–132 px, 2-D view 80–110 px. The status line is hidden at all 8 steps.
    - 390×780: 3-D view 140–161 px, 2-D view 94–108 px.
  - **Step 6 at 390×780** (`review3/p390_step6.png`): the face-on parallelogram shrinks to about 20 px. "⊙6", "a" and "b" are piled on each other, and the hand is about 20 px.
  - **Step 7 at 360×640** (`review3/p360_step7.png`): the badge and the HUD cover most of the 3-D view. k×u and −f k×u cannot be seen in 3-D, and the map arrows are about 25 px long.
  - **Card paging at 360×640.** Step 1's question is on card page 2: page 1 shows only the title (`review3/p360_step1.png`). Step 3 needs 7 pages.
  - **The builder's question ("~100/70 px, status hidden: acceptable?").** It is acceptable for the 60 px audit floor, but not for teaching. The user's U-A.6 complaint was exactly that the 3-D view is too small.
  - **Fix.**
    - On `data-layout="portrait"`, show one view per step: the 3-D view for steps 1, 5, 6, 7 and 8; the face-on view for steps 2–4 (θ-curves optional). Use `stepView(app, 'none')` + `hidePortrait` so that view gets at least 220 px at 360×640.
    - On views under 200 px tall, merge the HUD and the "not to scale" badge into one tappable chip, like "ⓘ N sources".
    - Keep a one-line status in f k×u mode ("NH: right" / "SH: left").
    - Trim step 1 and step 3 for phones (≤ 30 words; move the "Swap roles…" sentence into an extra) so the question is on page 1 and no step needs more than 4 pages.
    - Re-check `p360_step6/7`-equivalent shots.

### Should fix
- **S1 — The hand is readable but weak (step 6, every size).**
  - The box-and-cylinder glove reads as a hand at notebook size and up (`review3/l1440_step6.png`, `hand_mid_default_iso_curl0.5.png`). The curl animation, the swap and the tilted case are all geometrically right.
  - Problems: it is near-white (`HANDC #dfe4ec`) on the light grid; the thumb is short and sits at the palm, away from the a×b arrow; and it occludes the turn in the tip view (`hand_tilted_tip_curl1.png`).
  - Fix: use a mid-grey (#9aa3b2) with darker edges, lengthen the thumb about 1.5× and point it at the a×b arrow's foot, mark the index fingertip, frame the step 6 camera on the hand, and fade the hand to 30 % in the "a×b tip" view.
- **S2 — The curl arc a → b is barely visible in 3-D** (steps 5 and 6 and the tip view, at every size). Draw it with radius ≈ 0.35·min(\|a\|, \|b\|), at least 3 px wide, with a clear arrowhead, above the parallelogram.
- **S3 — 3-D labels collide in f k×u mode in the southern hemisphere.** At ϑ = −45°, turn 60°, "−f k×u ×10⁴: left of u (SH)" is printed over "k×u: 90° left of u" (`review3/kmode_lat-45_t60.png`). Add a screen-space overlap test to `tagItems`/labels: drop to the short text, or hide the lower-priority label.
- **S4 — Face-on, step 2, 1440×900: the θ label is overlapped** by the b̂ arrow and its "b̂" label ("θ 3.:°", `review3/l1440_step2.png`). Offset b̂ to the far side of b, or move the θ label outside the arc.
- **S5 — Anti-parallel 3-D: a is hidden under the rose shadow** (`review3/anti_step3.png`; F-A.12 is still open in 3-D). Offset the shadow slab toward the rectangle side, as the face-on view does, or draw a last with an outline.
- **S6 — Reduced motion: step 4 (`play: true`) still autoplays** under `prefers-reduced-motion`. Measured t = 10.5° and `playing` true after 2 s, although the comment at `autoplay:false` says the turn never runs then. Gate `play` on `Viz3D.reducedMotion`.
- **S7 — The map at ϑ = 0° says "−f k×u ×10⁴: zero (NH)"** (`s.lat >= 0`). Say "(equator)".
- **S8 — The D0A-PoC2 `interpret` says "\|f k×u\| = f\|u\|".** It should be \|f\|\|u\| (f < 0 in the SH).
- **S9 — The no-WebGL fallback drawing fills only about a quarter of the 3-D view** at desktop (`nowebgl/desktop__tour-step6.png`, `step7`). Fit the glyph bounds to the holder (the `m = 0.9/(sc0·R)` scale is too small).
- **S10 — Presets keep `show` from the current state.** From step 1 (`show: 'arrows'`), the parallel and anti-parallel chips show no shadow and no rectangle (`review3/parallel_from_step1.png`), yet these presets exist to answer U-A.10 and U-A.12. Add `show: 'dot'` to their `set` and to the matching Check items.
- **S11 — Notebook frame 1000×700: the θ-curve headers "perpendicular" and "anti-parallel" overlap** (`review3/nbframe_step6.png`). Drop the middle header when the view is under 420 px wide.
- **S12 — Dark theme.** The "thumb → a×b" label (neutral grey) and the violet a×b label are low-contrast on the dark background (`review3/dark_step6_btn.png`). Use the theme `text`/violet-light tokens.

### What works
- **The root error is fixed.** Both products are drawn as areas, and the dot product is never an arrow. The shadow is introduced as a·b̂ and kept separate from a·b, with the live numbers 1.79 → × 4.47 → 8. The symmetric "b's shadow on a × \|a\|" is there, and the anti-parallel rose rectangle at −10 answers U-A.12 at a glance.
- **Every walkthrough number is live**, with a banner and "Back to this step's setup" when the picture has moved (selftest rows check this for all 8 steps).
- **f k×u mode is now physically right**: the wind turns about k, the map rotates, the arrows and units are labelled, and the honest ×10⁴ badge says "different units". Explain §8 answers "what is f" with numbers and (2.55) written in full.
- **Selftest is strong**: 226 rows covering fluidpy parity, drawn float32 read-backs (rectangle area, a×b ⟂ a and b, thumb ∥ a×b, swap flip), camera framing and k-mode turns.
- **Depth against the exemplars** (rossby_waves, geostrophic_adjustment, ekman_spiral): 9 Explain sections against their 11, two derivations of 9 and 10 steps, 7 presets, 8 Check items, and 226 parity/invariant rows against 53 and 67. That is not shallower. The one-state link between the 3-D view, the face-on view and the θ-curves is the ekman_spiral one-cursor pattern.

### 3-D checklist (R2 §8.4)
- **Physics and honesty**:
  - [x] A provenance chip on every layer ("ⓘ N sources" on phones).
  - [x] Parity rows: JS↔Py, drawn float32 read-backs and invariants, with tolerances stated.
  - [x] ×10⁴ exaggeration and the units difference are labelled.
  - [x] The hemisphere flip changes f and the deflection.
  - [x] E/N/U triad in f k×u mode, x/y/z in maths mode.
  - [x] Every equation is written in full with its number (`eq_refs`: 0).
- **Teaching**:
  - [x] The 3-D view is linked to the face-on view, the curves and the map by one state.
  - [x] Walkthrough: 8 steps with camera presets.
  - [ ] The last step asks for a prediction **that can be tested** (M1).
  - [x] The glyph language: teal/orange, shadow, parallelogram, arc (arc weak: S2), signed bar in 2-D only.
  - [x] Explain reproduces the screen numbers; Code shows them live.
- **Visual**:
  - [x] A legend with units in f k×u mode; no jet; sign also shown by hatching and dashes.
  - [ ] Labels: collisions (S3); phone legibility (M2).
  - [x] Light and dark themes.
  - [x] No z-fighting seen.
  - [x] No scrolling at 8 sizes or in the notebook frame.
- **Robustness**:
  - [x] DPR ≤ 2; 13 draw calls.
  - [x] Context-loss restore.
  - [x] dispose → memory 0.
  - [x] proj3 fallback, with all tabs working.
  - [ ] Reduced motion (S6).
  - [x] 474 KB file; three.js 0.186.1 from the import map only.
  - [x] SwiftShader frame rate noted (5 fps; real-GPU frame rate not measured).

### Screenshots that best show the problems
- **M1**: `reports/viz/ch00/vector_products_lab/review3/s8_real_swap.png`, `l1440_step8.png`
- **M2**: `review3/p360_step7.png`, `p390_step6.png`, `p360_step1.png`, `p360_step3.png`
- **S1 / S2**: `review3/l1440_step6.png`, `hand_tilted_tip_curl1.png`
- **S3**: `review3/kmode_lat-45_t60.png`
- **S4**: `review3/l1440_step2.png`
- **S5**: `review3/anti_step3.png`
- **S9**: `nowebgl/desktop__tour-step6.png`
- **S10**: `review3/parallel_from_step1.png`

## PoC A round-3 verdict: **FIX**
There are two Must-fix items. M1 is a walkthrough `set` plus one row, about 10 lines. M2 is phone portrait layout per step plus a HUD collapse. Neither touches the physics, which is correct throughout. Re-review after the fix means: re-run `shot.py --3d`, re-take the phone shots of steps 1, 6, 7 and 8, and click swap on step 8.

## PoC A — round 4 (2026-10-21)

Fresh-eyes gate review of `viz/ch00/vector_products_lab.html` (scene `viz/ch00/scenes/vector_products_lab.scene.js`, inlined), after the user's round-2 feedback (commit 0fd77fb). The explainer was not edited.

Everything in this round was driven by real input, not `app.set`:
- real mouse drags of b's tip in the face-on view (default, obtuse, stretched + turned, tilted pair);
- keyboard on the `stretch b`, `b_x` and latitude sliders;
- clicks on the turn scrubber, every preset chip, swap, "build on a", the step chips and "Next →", the Derivation tab and its picker, ⤢ and Esc.

After every action the probe compared four things for the same state:
- the 3-D scene's own state, plus the arrows read back from the instanced mesh;
- the face-on frame, rebuilt into 3-D;
- every live walkthrough span;
- the Explain, Equations, Code and Derivation text.

Screenshots: `reports/viz/ch00/vector_products_lab/review4/`.

| slug | kind | lint | shot (sizes/views) | parity ok | 3-D checks | explain | derivations | teaching | polish | exemplar compared | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| vector_products_lab | 2-D + 3-D view | ok (1 soft WARN: 0A count) | `--3d` PASS 8 sizes / 288 views / 8 steps; no-WebGL PASS 2 sizes / 72 views | 253/253 (GL), 206/206 (fallback) | all pass except Derivation-tab picture and preset re-framing | 9 sections, 6 boxes, live; matches hand calc | D0A-PoC1 (9 steps), D0A-PoC2 (10 steps): live numbers on every step, vectors kept; **picture not set when the tab is opened normally** | strong; points 1–7 met except 2 (picture) and 3 (framing) | face-on label overlaps, 3-D arc blob, phone step 2/7 | rossby_waves, geostrophic_adjustment, ekman_spiral, forced_damped_vibrations | **FIX** |

### Gate numbers (all re-run by the reviewer)
- **`tools/viz_lint.py`**: ok. One soft WARN: "0A has 1 explainer".
- **`tools/shot.py --3d`**: **PASS** with SwiftShader (ANGLE Vulkan), 8 sizes, 288 views, 8 steps, **253/253 selftest rows ok**.
  - **Canvas variance** at every size was 104–486, never blank. Phone-land has only a 448×94 3-D view.
  - **Drags and wheel** moved the camera at every size.
  - **Forced context loss** showed the paused message, then restored: variance 433 at phone-tall, 148 at desktop.
  - **Memory**: `renderer.info.memory` → geometries 0, textures 0 after dispose.
- **No-WebGL pass**: **PASS**. `Viz.proj3`, 2 sizes, 72 views, **206/206 rows**; every tab works.
- **Tolerances**:
  - JS↔fluidpy parity rows (57 `py` rows) use rtol 1e-12.
  - The 20 drawn float32 read-backs state "(float32)" and use rtol 1e-5 / atol 1e-5. These cover rectangle area, its sides, rectangle ⟂ a×b, a×b ⟂ a and b, and a×b length = area.
- **Reviewer probe** (Playwright, GL flags, real clicks), all 8 steps at 360×640, 390×780, 1440×900, 1000×700, in a 1000×700 notebook iframe, dark at 1440 and 390, and reduced motion at 1440:
  - 0 page errors and 0 `.katex-error`.
  - No scrolling at any size or step.
  - No non-KaTeX text below 12 px.
- **Phones (one view per step, round-3 M2)**:
  - 360×640: views are 348×272. The step-1 question is on card page 1, and the most pages any step needs is 4.
  - 390×780: views are 378×274.
- **Performance**:
  - Draw calls are 19, 16, 9 and 23 at steps 1, 6, 7 and 8. Headless DPR is 1.
  - The file is 503 KB. three.js 0.186.1 comes only from the import map. The `three@0.128.0` URL in the file is viz_lib's legacy `Viz.three` path and is not loaded.
  - `tools/eq_refs.py`: 0 bare equation numbers.

**Independent hand calculation** (Python, not the page's functions) against the page's `Q(state)` and the text spans. The maximum difference is **0** in every case:

| pair | a·b | shadow | \|b\| | a×b | area | θ | text shows |
|---|---|---|---|---|---|---|---|
| start (2,1,0)·(2,4,0) | 8 | 1.78885 | 4.47214 | (0,0,6) | 6 | 36.8699° | 1.79 × 4.47 = 8, (0, 0, 6), 36.9 |
| parallel (4,2,0) | 10 | 2.23607 | 4.47214 | 0 | 0 | 0° | "2.24 long", 2.24 × 4.47 = 10 |
| anti-parallel (−4,−2,0) | −10 | −2.23607 | 4.47214 | 0 | 0 | 180° | "2.24 long, pointing backwards along b (−2.24)", −10 |
| tilted (1,2,2)·(3,0,0) | 3 | 1 | 3 | (0,6,−6) | 8.48528 | 70.5288° | 1 × 3 = 3, (0, 6, −6), 8.49 |
| parallel, stretch ×2 (real keyboard on step 2) | 20 | 2.23607 | 8.94427 | 0 | 0 | 0° | "2.24 × 8.94 = 20"; readouts a·b 20, shadow 2.24 |

**Derivation live lines checked by hand** after a real drag to b = (0, 4.8, 0):
- D1 step 2: 18.44 = 5 + 23.04 − 2×2.24×4.8×0.447. Check: \|c\|² = 4 + 14.44.
- D1 step 9: 4.8 = 2.236×4.8×cos 63.43°.
- D2 step 5: 115.2 − (23.04 + 2×0) = 92.16.
- D2 step 10: 2.236×4.293 = 9.6.

All are correct.

### Points 1–7 (the user's round-2 complaints)
| # | Requirement | Satisfied? | Evidence |
|---|---|---|---|
| 1 | All three areas show the current vectors | **Yes** | After 30 real actions (drags, sliders, scrubber, 7 presets, swap, build-on-a, tilted drag): 3-D state error **0**, face-on error ≤ 3e-7 (scrubber), 0 stale spans. Drawn 3-D arrows read back along a and b (cos = 1) with \|b\|/\|a\| equal to the true ratio. After a drag to b = (−0.6, 3, 0): Explain, Equations and Code all contain a·b = 1.8 and area 6.6 (`n_explain_after_drag.png`, `n_code_after_drag.png`). The 3-D title, readouts and status agree. |
| 2 | Derivation: general steps **and** your numbers on every step; vectors not replaced | **Numbers: yes. Picture: no (M1).** | D1: 9/9 steps carry a live line. D2: 10/10 steps carry one. Both results interpret with your numbers. The vectors stayed (2, 1, 0), (0, 4.8, 0) through all 23 pages. But opening the tab normally does not apply the derivation's `set`: D1's "c = a − b (dashed in the face-on view)" is never drawn (`showC` false on all pages, `i51_der_p01.png`), and D2 can open on the rectangle (`e_roughC_D2_rectangle.png`). |
| 3 | Change one vector with a control → both visualisations update | **Yes, with one framing defect (M2)** | Real drags of b's tip at 1440×900 update the 3-D view and the face-on view in the same frame (`i02`, `i03`, `i08`, `i31`). The same holds for the keyboard sliders (`i05`, `i06`), the scrubber (`i07`), every preset (exactly one chip pressed each time), swap (`i09`) and build-on-a (`i10`). Exception: a preset clicked within 0.9 s of a step change never re-frames the 3-D camera. Step 5 → anti-parallel left the rectangle cut off at the bottom of the 3-D view after 1.9 s (`inside: false`, `i41_roughB_step5_then_anti.png`). |
| 4 | Parallel: why is a·b not the projection? | **Yes on laptop and notebook; weaker on phones (S3)** | Step 2 has the title "The shadow is a length; a·b is a different number" and the live text "a's shadow on b is all of a, 2.24 long … a·b = 2.24 × 4.47 = 10". Readouts show "a·b (a number) 10" and "shadow of a (a length) 2.24". Stretch ×2 by keyboard gives shadow 2.24 and a·b 20, and the face-on rectangle doubles (`n_step2_stretch2.png`). The callout gives three reasons for × \|b\| (symmetry, component sum, work) and "agree only if \|b\| = 1". **b̂ is gone from step 2.** It remains, defined, in Explain §3, Equations (0A.3), Code and two Check answers. That is acceptable. At 360 px the face-on picture shows only "a·b = 10", with no shadow label; the 2.24 lives on card page 3 (`p360_step2*.png`). |
| 5 | Dot and cross defined clearly at the start | **Yes** | Step 1 reads "a·b = 8 is a number: how much a and b point the same way … a×b = (0, 0, 6) is an arrow: how much they point different ways". A comparison table follows (answer / asks / picture / size / parallel / at 90° / pointing apart), with live numbers. The question is on page 1 at 360 px (`p360_step1*.png`). Explain §1 repeats this with cos θ = 0.8, sin θ = 0.6 and 8² + 6² = 10². |
| 6 | Geometric meaning of both, in detail | **Mostly yes; three muddles (S1, S2, S6)** | Present: the rectangle with its sides labelled; the cos θ and sin θ gauges; build-on-a symmetry (Explain §4 shows 3.578 × 2.236 = 8); the work and tailwind analogy with Like/Unlike; the parallelogram with base and height; the 2-D signed area a_xb_y − a_yb_x = 6 "b anticlockwise from a"; "Why an arrow?"; the spanner; the right hand with swap and tip view. Muddled: face-on labels collide at 1440 on step 3 and with the tilted pair (S1); the 3-D curl arc is a dark blob in the tilted view (S2); the gauges have no tick values, so "0.8" floats without a scale (S6). |
| 7 | "3-D paused" fix | **Yes** | 10× (real ⤢ click → real drag → Esc) at 1440×900 and 390×780: paused sign visible 0/20 times, `active` every time, max view 1410×692 and 364×545. Forced loss via `S.renderer.forceContextLoss()` (`Viz3D.__audit` exists only with `?audit=1`): sign shown, tap → restored (variance 343 at 1440, 513 at 390). With no tap, it restored automatically after **2.06 s** at 1440 and **2.12 s** at 390. A never-returned loss (`forceContextRestore` disabled) restored after 2.08 s and 2.36 s. After every restore the camera is framed on the current tilted pair (`inside: true`), and the three areas still agree (error 0). No stale sign is left (one `.v3d-paused` element, hidden). |

### Builder-admitted rough edges
- **(a) Confirmed.**
  - Tilted pair with "both" at 1440×900: the rectangle label "shadow of a × \|b\| = 1 × 3 = 3" touches "height \|b\| sin θ = 2.83", which covers half of "θ 70.5°" (`i70_tilted_both_1440.png`).
  - The same kind of overlap appears with the **default** pair on step 3: "\|b\| = 4.47" sits on "area = a·b = 8" (`l1440_step3.png`).
  - Maximised, it is clean (`i71`). See S1.
- **(b) Confirmed, and worse than stated.**
  - The cause: `refit()` returns early when a `goto` was less than 900 ms ago and never retries. So the frame is never corrected, not just late by 0.9 s.
  - Step 1 → tilted happened to fit. Step 5 → anti-parallel did not (`inside: false` at 0.3 s and at 1.9 s). See M2.
  - Related: after any real camera drag, `userCam` stays true, so **no** later preset re-frames. The tilted preset after the expand cycles was partly off-screen (`fx 0.18, fy 0.87, inside: false`). See S7.
- **(c) Confirmed.** `setTab('derive')` re-renders the current derivation without applying its `set`.
  - Visiting D2, going back to step 3 and opening Derivation again shows D2 with `show: 'dot'`: the rectangle, no parallelogram (`e_roughC_D2_rectangle.png`).
  - Opening D1 after step 5 shows `show: 'cross'`: no shadow and no c.
  - D1's own `set` (`showC: true`) is never applied unless the reader presses the picker. See M1.
- **Rectangle in the a–b plane.** It is flat, not a slab.
  - By construction, `dotRect` corners are 0, foot, foot + side and side, with side = \|b\|·unit(n × b̂), which lies in the a–b plane.
  - Read-back of the drawn quad: z = 0 at all corners for start, parallel and anti-parallel; the largest distance from the a–b plane is **0** for all four pairs (tilted included); selftest row "drawn rectangle lies in the a–b plane (float32)" passes.
  - The low camera of the `edgeOn` preset shows it flush with the grid (`i8_rect_start_edgeOn.png`). The "raised" look comes from the thick shadow tube and arrow shafts lying on it.

### Round-3 items: really fixed?
| item | status | evidence |
|---|---|---|
| M1 step 8 testable | **fixed** | Real click on swap at step 8: `swap: true`, show 'both', thumb (0, 0, −1). Latitude by keyboard to −5° → f k×u mode, status "turns the wind to the left (SH)". |
| M2 phone legibility | **fixed** (one view per step, 272–274 px; question on page 1; ≤ 4 pages) | Step 7 at 360 px is still weak (S9). |
| S1 hand | fixed | Mid-grey, long thumb, readable in light and dark (`l1440_step6.png`, `e_dark_step6_max.png`). |
| S2 curl arc | **still open** | Reads as an arrow in the tip view, but as a dark blob in the tilted view (`e_step5_max_iso.png`). |
| S3 SH label collision | fixed in 3-D (declutter) | The map label is now clipped at the left edge (S8). |
| S4 θ label at step 2 | fixed | |
| S5 anti-parallel a hidden | fixed | a visible beside the rose shadow in both views (`i41`). |
| S6 reduced motion | fixed | Step 4: t = 0, not playing after 2 s; step 6 curl = 1 at once. |
| S7 equator label | fixed (code: "(equator)") | |
| S8 \|f\|\|u\| | fixed | |
| S9 fallback fit | **still open** | Glyphs fill about 40 % × 25 % of the view; the hand is a few strokes (`nowebgl/desktop__tour-step6.png`). |
| S10 presets carry `show` | fixed | Parallel and anti-parallel set `show: 'dot'`. |
| S11 notebook curve headers | fixed | "perpendicular" dropped below 420 px. |
| S12 dark labels | fixed | |

### Must fix
- **M1 — The Derivation tab does not set up its own picture, so the picture contradicts the text (user point 2, rough edge c).**
  - **What is wrong.**
    - Opening "Derivation" from the tab bar renders D1 or D2 without applying `d.set`.
    - D1 step 1 says "c runs from the tip of b to the tip of a (dashed in the face-on view)", but `showC` stays false on all 11 D1 pages, so no c is drawn (`i51_der_p01.png`).
    - D2 can open on the a·b rectangle with no parallelogram, while its step 10 says "the violet parallelogram in the face-on view …" (`e_roughC_D2_rectangle.png`).
    - Opened after step 5, D1 shows only the parallelogram: no shadow.
  - **Why it matters.** The user asked for the derivation to be tied to the chosen vectors. The numbers are tied; the picture is not.
  - **Fix.**
    - When the derive tab is entered, call `app.goDerive(der.i, der.s)` (not quiet), which applies `d.set` and the step's `set` but never touches ax…bz. Either put this in the explainer's tab hook, or have the orchestrator add it to `viz_lib` `setTab` for every explainer.
    - Remember the `show`/`showC` in force before entering the tab, and restore them on leaving (today Explore inherits `show: 'dot'`, `showC: false` from the derivation).
    - Add selftest rows "derive tab entered from step 1/3/5 → D1 shows shadow + c; D2 shows the parallelogram".
- **M2 — A preset clicked just after a step change never re-frames the 3-D view (user point 3, rough edge b).**
  - **What is wrong.** `refit()` drops the request when a `goto` happened less than 900 ms earlier, and nothing retries. Step 5 → "anti-parallel" leaves the rose rectangle and its label cut off at the bottom of the 3-D view, at 0.3 s and still at 1.9 s (`i41_roughB_step5_then_anti.png`). That is the very picture that answers U-A.12.
  - **Fix.**
    - In `refit`, when inside the 900 ms window, schedule `setTimeout(() => refit(S), 900 − elapsed + 20)` instead of returning (keep one pending timer).
    - Clear `userCam` on a preset click, because a preset is an explicit "show me this".
    - Add a probe row: "goStep(4) then preset 'anti-parallel' → all glyph points on screen after 1.2 s".

### Should fix
- **S1 — Face-on labels collide.** Three cases at 1440×900:
  - default pair, step 3: "\|b\| = 4.47" sits on "area = a·b = 8";
  - tilted + both: the rectangle label touches "height \|b\| sin θ = 2.83";
  - the height label covers "θ 70.5°".

  Fix: in `drawFace`, collect the `later` labels as boxes. Place them in priority order (area > shadow side > \|b\| side > height > base > θ), nudge each along its own normal up to 2 × its height, and drop the lowest priority if it still overlaps.
- **S2 — The 3-D curl arc a → b is a dark blob in the tilted view** (steps 5 and 8, `e_step5_max_iso.png`). Fix:
  - radius 0.35·min(\|a\|, \|b\|), tube about 0.5 × the shaft radius;
  - a cone head no longer than 25 % of the arc length;
  - a violet-dark colour rather than near-black;
  - lift it 0.02 off the plane.
- **S3 — Step 2 on phones.**
  - At 360×640, card page 1 holds only the title; the text starts on page 2, though page 1 has room for it.
  - The face-on picture on small views shows only "a·b = 10", so the contrast "shadow 2.24 vs a·b 10" is not in the picture.

  Fix: let the text pack with the title, and on small views always draw the short label "shadow 2.24" along the shadow strip, even when the rectangle is on.
- **S4 — Step 2 callout wording.** "a force of shadow N along a \|b\| m path" reads literally. Use live numbers: "a force whose part along the path is 2.24 N, pushed 4.47 m, does 10 J".
- **S5 — D1 step 9 "watch" is stale since round 2.** It says "The bar beside the face-on view has height a·b; the dashed ticks are ±\|a\|\|b\|". The gauge now shows cos θ with ticks at ±1. Rewrite it: "the cos θ gauge shows a·b/(\|a\|\|b\|) = 0.447; its dashed ticks are +1 and −1".
- **S6 — The gauges have no scale.** Label the dashed ticks "+1", "0", "−1" for cos θ and "1", "0" for sin θ, so "0.8" can be read against something.
- **S7 — Camera drags disable all later re-framing.** `userCam` stays true. Clear it on every preset and on the step's own `goto`.
- **S8 — f k×u map in the SH.** The tip label "k×u and −f k×u ×10⁴: both left (SH)" is clipped at the left edge of the map view (`e_kmode_lat-45_t60.png`). Clamp the x position to [8, v.w − 8 − width], or flip the label to the arrow's other side.
- **S9 — Phone step 7.**
  - The 3-D view is the only view at 360×640. The arrows fill 0.65 × 0.31 of it, and k×u is a short stub (`p360_step7.png`).
  - On portrait, use the `top` camera for step 7 (it is a map), or show the map view instead.
- **S10 — No-WebGL fallback still small.** The glyphs fill about 40 % × 25 % of the 3-D view at desktop, and the hand is a few strokes. Raise the fit factor (`m`) so the glyph bounds fill 80 % of the smaller holder side.
- **S11 — Phone 3-D, step 1.** The violet a×b arrow is unlabelled at 360 and 390 (`p360_step1.png`). Within the 4-label budget, rank "a×b" above the axis letters.
- **S12 — Dead code.** Remove the two `drawSignedBar` declarations ("replaced by drawGauges").

### What works
- **Point 1 is solid.** One state drives the 3-D scene, the face-on view, the curves, the readouts, the walkthrough spans, Explain, Equations, Code and the derivation lines. The probe found zero disagreement after 30 real actions. The "picture no longer matches this step" banner appears exactly when the reader moves away.
- **Step 1 now defines both products** side by side with live numbers and a table. Step 2 makes "shadow = 2.24 is a length, a·b = 10 is a different number" concrete. The stretch-b proof (shadow stays 2.24, a·b goes 10 → 20) is convincing, and b̂ is gone from the step.
- **The derivations carry the reader's numbers on every step**, with correct arithmetic, and never overwrite the vectors.
- **The kit's paused-sign fix works.** No stale sign after 20 expand cycles. Recovery happens by tap and automatically in about 2 s, framed on the current vectors.
- **Physics is correct throughout.** Hand calculations match to 0 on five pairs. The rectangle lies in the a–b plane (float32 row and read-back). The SH flip and the equator are right.
- **Depth against the exemplars.** Measured against rossby_waves (11 Explain sections, 53 rows), geostrophic_adjustment (★★★ D16, 67 rows), the ekman_spiral one-cursor pattern, and the forced_damped_vibrations Explain panel:
  - 9 numbered Explain sections, live and boxed, ending with a regime reading;
  - 2 derivations (9 and 10 steps) with live lines;
  - 7 presets and 11 Check items;
  - 253 rows, including 53 drawn read-backs.

  That is not shallower.

### 3-D checklist (R2 §8.4)
- **Physics and honesty**:
  - [x] A provenance chip on every layer.
  - [x] Parity: JS↔Py at 1e-12; drawn float32 rows stated at 1e-5.
  - [x] Invariants: a×b ⟂ a and b; the rectangle is in-plane.
  - [x] The ×10⁴ exaggeration and the units difference are labelled.
  - [x] The hemisphere flip changes f and the deflection.
  - [x] E/N/U triad in f k×u mode, x/y/z otherwise.
  - [x] Every equation is written in full with its number (`eq_refs` 0).
- **Teaching**:
  - [x] The 3-D view is linked to the face-on view, the curves and the map by one state.
  - [x] 8 steps, each with a camera preset; the last is a testable prediction.
  - [x] The glyph language: teal/orange; shadow, rectangle, parallelogram; arc (S2); signed gauge in 2-D only.
  - [x] Explain and Code reproduce the screen numbers.
  - [ ] The Derivation picture is linked to its step (M1).
- **Visual**:
  - [x] Legend with units in f k×u mode; no jet; sign also shown by hatching and dashes.
  - [ ] Labels: face-on collisions (S1), clipped SH map label (S8).
  - [x] Dark theme.
  - [x] No z-fighting.
  - [x] No scrolling at all sizes or in the notebook iframe.
- **Robustness**:
  - [x] 9–23 draw calls; DPR ≤ 2.
  - [x] Context-loss restore by tap and automatically in about 2 s.
  - [x] Dispose → 0.
  - [x] proj3 fallback with all tabs working (small: S10).
  - [x] Reduced motion.
  - [x] 503 KB; three.js 0.186.1 only.
  - [x] SwiftShader frame rate not representative; no real-GPU number taken.
  - [ ] Preset re-framing (M2).

### Screenshots
- **M1**: `review4/i51_der_p01.png` (D1 step 1, no c), `review4/e_roughC_D2_rectangle.png`, `review4/e_derive_after_step5.png`
- **M2**: `review4/i41_roughB_step5_then_anti.png`
- **S1**: `review4/l1440_step3.png`, `review4/i70_tilted_both_1440.png`
- **S2**: `review4/e_step5_max_iso.png` (and `review4/e_step5_max_tip.png` for comparison)
- **S3**: `review4/p360_step2.png`, `review4/p360_step2_pg2.png`, `review4/p360_step2_pg3.png`
- **S8**: `review4/e_kmode_lat-45_t60.png`
- **S9**: `review4/p360_step7.png`
- **S10**: `nowebgl/desktop__tour-step6.png`
- **Good evidence**:
  - `review4/n_step2_stretch2.png`, `review4/i02_drag1_step3.png`, `review4/i31_tilted_drag.png`
  - `review4/x1440_after_tap.png`, `review4/x390_after_tap.png`
  - `review4/i8_rect_start_edgeOn.png`, `review4/i8_rect_parallel_iso.png`
  - `review4/nbframe_step*.png`, `review4/dark1440_step*.png`
- **Probe logs**: `review4/interact_log.json`, `review4/tour_log2.json` (dark, reduced motion; the size passes are in this section), `review4/ctx_log.json`, `review4/num_log.json`

## PoC A round-4 verdict: **FIX**
There are two Must-fix items. Both are wiring, not physics:
- **M1**: entering the Derivation tab must apply the derivation's own picture setup, and restore it on leaving.
- **M2**: `refit` must retry instead of dropping a preset's re-frame.

Points 1, 4, 5 and 7 are satisfied, and 6 mostly. Point 2 is met for the numbers but not the picture, and point 3 for the update but not the 3-D framing.

Re-review after the fix means:
- open Derivation from the tab bar after steps 1, 3 and 5, and after a D2 visit;
- click step 5 → anti-parallel;
- re-take the step-3 and tilted face-on shots at 1440×900;
- re-run `shot.py --3d`.

## PoC A — round 4b (2026-10-21): targeted re-check after fix loop 2

- **Gates (re-run by the reviewer):** `viz_lint` ok (1 soft WARN: 0A count). `shot.py --3d` **PASS**: 8 sizes, 288 views, 8 steps, **264/264** rows. No-WebGL **PASS**: 2 sizes, 72 views, **217/217** rows. Probe: 0 page errors, 0 KaTeX errors.
- **M1 — fixed.** The Derivation tab, entered from the tab bar:
  - From steps 1, 3 (after a real drag to b = (0, 4.8, 0)) and 5: D1 opens with `show: 'shadow'`, `showC: true`, and the dashed "c = a − b" is drawn (`review4b/m1_from_step3.png`).
  - After a D2 visit: D2 opens with `show: 'cross'`, the parallelogram (`review4b/m1_D2_reenter.png`).
  - The vectors are kept every time.
  - Leaving restores the reader's picture: tour 'both', 'dot' and 'cross'; Explore 'dot'.
- **M2 — fixed.**
  - Step 5, then anti-parallel: everything on screen 1.2 s later (fill 0.44 × 0.48, `review4b/m2_step5_anti.png`).
  - After a real camera drag, then tilted, parallel or f k×u: everything on screen each time, and `userCam` is cleared (`review4b/m2_drag_*.png`).
- **S1–S12:**

| item | status | evidence |
|---|---|---|
| S1 face-on label overlaps | fixed | `review4b/s1_step3.png`, `review4b/s1_tilted_both.png` |
| S3 step 2 on phones | fixed: shadow label in the picture, text on page 1 of 3 | `review4b/p360_step2.png` |
| S4 work wording | fixed: live "2.24 N, pushed 4.47 m" | |
| S5 stale "watch" | fixed: cos θ gauge, ticks ±1 | |
| S6 gauge ticks | fixed: +1/0/−1 | |
| S7 `userCam` | fixed | |
| S8 SH map label | fixed: inside the view | `review4b/s8_sh_map.png` |
| S9 phone step 7 | fixed: top camera, fill 0.55 × 0.75 | `review4b/p360_step7.png` |
| S11 phone a×b label | fixed | `review4b/p360_step1.png` |
| S12 dead code | fixed: `drawSignedBar` gone | |

- **Still open (Should, not blocking):**
  - **S2** — the 3-D curl arc is no longer a blob, but in the tilted view it is now a tiny hook at the origin (`review4b/s2_arc_iso.png`). Enlarge it to radius ≈ 0.35·min(\|a\|, \|b\|).
  - **S10** — the no-WebGL fallback glyphs still fill only about 40 % × 30 % of the 3-D view, and the hand is a few strokes (`review4b/s10_fallback_step6.png`).

## PoC A round-4b verdict: **PASS** (no open Must-fix; S2 and S10 open as Should)
