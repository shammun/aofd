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
