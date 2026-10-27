# Chapter 0 — movie review                                       2026-10-22

The PoC D review (`poc_coriolis_turntable`, 2026-10-21) is in `reports/ch00_poc_movies.md`. This file did not exist
before this review, so nothing in it was overwritten. The Chapter-0 movie reviews start here.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_dot_product_why (review 1) | 170.005 s (target 170) | 12.90 MB (≤ 25) | 9/10 PASS; **frozen FAIL** (`pass: false`) | PASS (one sign slip in a readout, see M1) | PASS | **FIX** (label overlap) | PASS | PASS | PASS | PASS | **FIX** (minor; one re-render + QA re-run) |
| ch00_dot_product_why (review 2) | 170.005 s | 13.16 MB | 10/10 PASS (`pass: true`) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** (one publish condition, P1) |
| ch00_dot_product_why (review 3, v2 @ 3787a8b) | 367.253 s (target 367.225; user window 6:00–6:10) | 25.38 MB (override budget 60) | 10/10 PASS (`pass: true`) | **FIX** (M1: s17 says the map stays put, s18–s20 move it) | PASS | PASS (S2, S4 small overlaps) | PASS | PASS (S5 orphan words) | PASS | PASS (but S1: captions cover badges) | **FIX** (one Must, one re-render) |
| ch00_dot_product_why (review 4, v4 @ d029eba) | 492.181 s (target 492.15; user accepted 8:12) | 30.85 MB (override budget 60) | 10/10 PASS (`pass: true`) | PASS (advection sign, upwind 12.82/12.64/12.46 °C all right) | PASS | **FIX** (M2: s11 label overlap) | **FIX** (M1: s19 clock vs spoken readings) | PASS (113 cues, ≤ 15.7 cps, no collisions) | PASS | PASS (none, per user G2) | **FIX** (two visual-only Musts; P1 before publishing) |
| ch00_dot_product_why (review 4b, v4 fix 1 @ d5bcb3f) | 492.181 s | 30.95 MB | 10/10 PASS (`pass: true`) | PASS | PASS | PASS (M2 fixed) | PASS (M1 fixed; the clock holds at 3 h, accepted) | PASS (113 cues, unchanged) | PASS | PASS (none) | **PASS → `qa_pass`** (P1 before publishing; S12 optional) |

## ch00_dot_product_why (review 1, 2026-10-22)

Reviewer: movie-reviewer, with fresh eyes. I saw the movie only as frames.
Inputs: `movies/out/ch00/ch00_dot_product_why/{1080.mp4, en.vtt, index.html}`,
`movies/ch00/ch00_dot_product_why/{storyboard.yaml, script.md, timing.json, manifest.json, data/*.json}`,
`movies/src/ch00/DotProductWhy.tsx` (font sizes and readout strings only),
`reports/movies/ch00/ch00_dot_product_why/{qa.json, contact_sheet.png, frame_*.png}`, and the page images
Kundu p. 41 (`../Fluid Dynamics/chapters/pages/ch02/p068.png`), Kundu p. 52 (`p079.png`) and Vallis p. 5
(`chapters/pages/ch01/p025.png`). The user's question is U-A.17 in `reports/ch00_poc_user_feedback.md`.

My frames are in `reports/movies/ch00/ch00_dot_product_why/review/`:
- 57 frames 640 px wide, from 1 s to 169.8 s, tiled four to a sheet in `tile_01…15.png`;
- the s7 motion every 2 s (`tile_s7_motion.png`) and the steep-map switch every 0.5 s (`tile_steep.png`);
- full-resolution crops `crop_105_angle.png`, `crop_125_eq.png` and `crop_131_pin.png`.

### qa.json
Duration, size, codec (H.264 High, yuv420p, AAC, faststart), black (0 stretches), loudness (−16.2 LUFS, −4.5 dBTP),
flashes (0/s), captions (36 cues match the script), physics (25 functions reproduce their hashes) and equations
(9 present) all **PASS**.
- **Not PASS:** `"frozen": FAIL — frozen > 4 s: ['8.333333', '6.033333', '5', '5.3', '4.966667', '8.833333', '4.033333', '5.1', '13.133333', '14.5', '6.133333', '6.233333', '6.366667', '7.366667']`, so `"pass": false`.
- My own freezedetect run (480 px, −60 dB, 4 s) found these static stretches: 3.4–8.3, 12.5–16.7, 18.2–22.9, 33.6–42.3,
  50.1–54.6, 55.0–60.0, 73.7–82.8, 96.2–113.3, 134.2–140.4 and 161.8–170.0 s.
- Every one of them is narrated, with gaps of ≤ 0.8 s. The longest silence is the 1.15 s hold on the end card.
- The frames also show small elements appearing inside several of these stretches. For example, F = 20 N appears between
  75 and 80 s; |∇T|, u and the shadow appear at 97.5, 102.5 and 107 s.
- None of these stretches feels dead to a viewer. The weakest is 134–140 s (see N7).
- The skill's rule is "frozen > 4 s *without narration*". The gate fails only because `movie_qa.py` does not subtract the
  narrated time, so this is a tool false positive. It still blocks `qa_pass` (see M2).

### Teaching: does it answer U-A.17? PASS
- **The question comes first.** The question is on screen from frame 0 (0:00) and spoken by 0:11. The hook is inside the
  first 10 s.
- **The three answers from U-A.17 are all there, in order:**
  - **Symmetry (0:33–0:54).** The two shadows are 2.530 and 1.569. Each × the other length gives 8.000. The two product
    rectangles stand side by side in a tray with a 1 unit² grid. I measured them on the 640-px frames: widths 68 : 42 px
    (2.530 : 1.569 = 1.61), heights 85 : 136 px (3.162 : 5.099 = 0.62). So they are true to scale and equal in area.
  - **Cheap, and the shadow comes from it (0:54–1:13).** The recipe cards show the dot product, then the shadow = a·b ÷ |b|.
    Then b shrinks to b̂. The shadow stays at 2.530, and an intermediate frame reads "a·(orange arrow) = 2.530 × 2.982 =
    7.544". The gauge then reads a·b̂ = 2.530 = shadow. The wind example gives u·x̂ = 6.00 m/s.
  - **Physics needs both sizes.** Work: 50 J becomes 100 J while the shadow stays 10.0 N. Advection: 0.180 K/h becomes
    0.360 K/h while the shadow stays 5.00 m/s.
- **The sign (2:20–2:40).** The sign is covered at 60.3°, 90°, 120° (the shadow falls on b's line extended behind O,
  dashed) and 180° (the shadow is the whole of a pointing backwards, −16.125).
- **The voice.** It is informal and second person ("Here's a puzzle", "Mind the sign"). The script, captions and
  composition text contain no "clearly", "obviously", "trivially", "simply" or "easy to see". The narration is in our own
  words: Kundu's p. 52 sentence about "magnitude of one vector times the component of the other" is not paraphrased.
- **Scalars are never drawn as arrows.** a·b, W and u·∇T appear only as numbers, gauges or rectangles.

### Physics and maths honesty: PASS (one readout sign slip, M1)
I recomputed every number independently, and each one matches `data/*.json` and the frame:
- **The vector pair.** a·b = 5 + 3 = 8; |a| = √26 = 5.099; |b| = √10 = 3.162; θ = 60.255°.
- **The shadows.** Shadow of a on b = 8/√10 = 2.530; shadow of b on a = 8/√26 = 1.569. 2.530 × 3.162 = 1.569 × 5.099 = 8.000.
- **The rectangle corners** match `rect_on_b` and `rect_on_a`.
- **Work (s5).** 20 cos 60° = 10.0 N; W = 50.0 J, then 100.0 J. The rectangle depth matches the d arrow: 63 vs 62 px,
  and 130 vs 132 px after doubling.
- **Advection (s6).**
  - The shadow is 10 cos 60° = 5.00 m/s.
  - u·∇T = 5.00×10⁻⁵ K/s = 0.180 K/h. The steep map gives 1.00×10⁻⁴ K/s = 0.360 K/h, and its ∇T arrow is drawn twice
    as long (145 → 295 px at 1080p).
  - ∇T points east, towards warmer air, on a 10 → 16 °C field with isotherms every 100 km.
- **Advection (s7).**
  - −u·∇T is shown as cooling, and the upwind cone points south-west towards the colder side. This is correct for a wind
    from the SW.
  - The isotherms slide east 35, 70 and 108 km at 2, 4 and 6 h, which is 5 m/s × t.
  - The thermometer reads 13.00 → 12.78 (1.3 h) → 12.23 (4.3 h) → 11.92 °C (6 h), which is 13 − 0.18 t.
  - On the steep map it reads 15.91 (0.3 h), 15.55 (1.3 h) and 13.84 °C (6 h), which is 16 − 0.36 t.
- **The sign sweep (s8).**
  - 85.4° gives 0.413 and 1.306, consistent with the angle shown.
  - 90° gives 0.000.
  - 120° gives −2.550 and −8.062.
  - 180° gives −5.099 and −16.125 = −√260. The chip says −16.12 ÷ 16.12 = −1.000 → 180°.
  - b keeps |b| = 3.162 and turns anticlockwise, and the screen says "seen from above the page".
- **Colours and labels.** The colours are consistent all through: a, F and u are teal; b, d, ∇T, x̂ and b̂ are orange;
  negative products are rose and hatched. Every drawn object has a label.
- **Provenance.** The manifest pins fluidpy 6d2c52e. `vectors.py` is tracked, and `dirty_tracked` is false.

### Equation fidelity: PASS
- **(K 2.2)** (from 0:16). The page reads a·b = a₁b₁ + a₂b₂ + a₃b₃ = Σᵢ aᵢbᵢ ≡ aᵢbᵢ (2.2), Kundu p. 41. The screen shows
  the first, second and last forms, which is allowed by the storyboard. It uses "=" where the page has "≡" (N2).
- **(0A.1)** a·b = |a||b| cos θ = (|a| cos θ)|b|. This matches Kundu p. 52, u·v = uv cos θ (unnumbered); the label is ours.
- **(0A.1, both ways)** and **(0A.1, solved for cos θ)** are correct rearrangements.
- **(0A.3)** |a| cos θ = a·b̂ = a·b/|b|, b̂ = b/|b|. This is ours and correct.
- **Vallis (1.7)** Dφ/Dt = ∂φ/∂t + (v·∇)φ. This matches p. 5. The page has upright D and bold-italic **v**; the movie uses
  \mathbf, which the storyboard notes. The (v·∇)φ term is boxed teal at 1:53.
- The line ∂T/∂t = −u·∇T when DT/Dt = 0 is correctly left unnumbered.
- W = F·d = |F||d| cos θ is correctly labelled "a definition from school mechanics (no book number)".
- No KaTeX error boxes appear in any frame.

### Legibility at 640 px: FIX (one overlap; sizes OK)
- The smallest font in the composition is 28 px at 1080p, about 9 px at 640 px. That meets the ≥ 28 px bar agreed in the
  PoC D re-review. Muted-grey 28-px notes ("1 grid square = 1 unit", "flat picture: the z-parts are 0", "assumes each
  parcel keeps its temperature…", the end-card "From Kundu…" line) are the hardest to read, but they are readable.
- **Overlap** at 1:42–1:57 (S1, below).
- **Contrast** at 2:08–2:20 (S2b, below).
- Nothing is clipped. The −16.125 gauge readout at 2:35 overhangs the left end of the gauge but stays inside the panel.

### Pacing: PASS
Every narrated claim is on screen at the moment it is said:
- 0:16 (K 2.2) · 0:22.8 (0A.1) · 0:28.3 shadow box;
- 0:37 and 0:41.5 the two shadows · 0:46 the rectangles · 0:50.8 "order doesn't matter";
- 0:59 "shadow = a·b ÷ |b|" · 1:03.7 b shrinks · 1:07 the wind;
- 1:17 to 1:31 the sled, shadow, 50 J and 100 J;
- 1:32.5, 1:37.7, 1:42.7, 1:47.3 and 1:53.3 ∇T, |∇T|, u, the shadow and the product;
- 1:57.8 the cone · 2:03.7 −u·∇T · 2:07.7 the steep map;
- 2:23, 2:27.7, 2:30.8 and 2:34.7 the holds at 60°, 90°, 120° and 180°.

The rate is 136.7 words per minute, so nothing is rushed.

### Captions: PASS
- 36 cues. The text equals the script.
- Lines are ≤ 42 characters; the maximum is 15.4 characters per second.
- Every cue lies inside the audio (0.30–168.85 s). Captions are not burned in.
- Two cues end on a one-word second line (N1).

### Accessibility: PASS
- Teal and orange are never the only cue: every arrow is labelled.
- Negative values are rose, hatched and dashed against neutral ink, never red against green.
- The map uses a dark-blue → purple → orange → yellow sequential map (thermal-like), not jet.
- 0 flashes. No full-screen noise. No black frames.

### Badges: PASS
"Not to scale" appears on every scene the storyboard lists as exaggerated:
- s4: wind arrow, 1 grid square = 1 m/s;
- s5: N and m on different scales, sled illustrative;
- s6: arrows not to the km scale, idealised field "illustrative (not data)";
- s7: time ×3600, arrows not to scale, idealised field.

s1–s3 and s8 have no exaggerations, and s9 is text only.

### Audio (vector "a")
I could not listen. Instead:
- `timing.json` shows the lexicon applied to all six spoken vector-a phrases ("Arrow [A](/ˈA/)", "arrow [A](/ˈA/)" ×3,
  "[A](/ˈA/) dot b" ×2).
- `KPipeline(model=False)` in `.venv-tts` gives the phoneme ˈA (misaki's "ay", eɪ) in each one. For example, "ˈɛɹO ˈA ɪz
  fˈIv" and "ˈA dˈɑt bˈi ˈOvəɹ ðə lˈɛŋθ ʌv bˈi".
- Lone "a" articles stay ɐ ("sˌO ɐ wˈɪnd"). u is jˈu, grad T is ɡɹˈæd tˈi, and x hat is ˈɛks hˈæt.
- The user should confirm by ear at 0:12, 0:28, 0:37, 0:41, 0:59 and 2:35.

### Integrity: PASS
- No book scans, crops or quoted text. All pictures are code-drawn.
- The end card names `viz/ch00/vector_products_lab.html` and `notebooks/poc_ch00a_dot.ipynb`, and both exist (but see S3).

### Findings

**Must**
- **M1 · 2:03.7–2:07.7 (s7 readout, still on screen until the steep map at about 2:08).** The line reads
  "= −5.00×10⁻⁵ K/s = −0.180 K/h **(4.32 K per day)**". The per-day value has lost its minus sign, in the scene whose
  whole point is the sign. The storyboard has "(−4.32 K per day)". The cause is `DotProductWhy.tsx` line 782, which prints
  `fx(adv.K_per_day, 2)` with `K_per_day = 4.32` positive and no rose "−". Fix: print "(−4.32 K per day)" with the minus
  in rose, like the two minus signs before it.
- **M2 · qa.json.** `pass: false` because of the frozen gate (quoted above). I judge every stretch narrated and none dead,
  but the movie cannot become `qa_pass` while qa.json says FAIL. Fix: make `movie_qa.py` apply the skill's rule (fail
  only on freezes > 4 s that overlap a narration gap > 4 s, using `timing.json`), then re-run QA after the M1 re-render.

**Should**
- **S1 · 1:42.7–1:57.6 (s6).** The "60°" angle label and its arc sit on top of the orange "|∇T|" bracket label above the
  ∇T arrow (`crop_105_angle.png`), so "|∇T|" is unreadable for 15 s. Fix: move the "|∇T|" label below the arrow (as the
  product rectangle's "|∇T|" is at 1:52), or put the 60° label above the arc's midpoint, at about 30° from ∇T.
- **S2 · 2:07.7–2:20 (s7 steep map).**
  - **(a) The thermometer jumps.** It goes from 11.92 °C (end of run 1) to 16.00 °C when the map steepens, and nothing
    says the clock restarts on a new map (`tile_steep.png`, 2:07.9 → 2:08.4). A first-time viewer may think the "cooling"
    warmed them by 4 K.
    - Best fix: build the steep map around the pin, T = 13 °C + 2 K/100 km × (x − 300 km), which runs 7 → 19 °C. Both runs
      then start at 13.00 °C and end at 11.92 vs 10.84 °C, so the doubling is visible.
    - Simpler fix: a chip "new map · clock restarts · 16.00 °C at you".
  - **(b) Low contrast.** On the steep map the orange ∇T arrow runs over the orange-yellow east half of the map and almost
    vanishes (`crop_131_pin.png`). Fix: give the arrows on the map a dark halo (the same `paintOrder` stroke the labels use).
- **S3 · 2:40.6–2:50 (end card).** The links are repo paths ("notebooks/poc_ch00a_dot.ipynb", "viz/ch00/vector_products_lab.html").
  Fix: show public addresses, e.g. "shammun.github.io/aofd/viz/ch00/vector_products_lab.html" and the notebook's HTML
  page. Keep "(until the Chapter 0A notebook is published)" only if that page will really exist when the movie goes public.

**Nice**
- **N1 · 0:11.975 and 0:33.25 (captions).** Two cues end with a one-word line: "Arrow a is five, one, and arrow b is one, /
  three." and "Reason one: a shadow depends on who casts / it." Re-break the lines ("Arrow a is five, one, / and arrow b
  is one, three.").
- **N2 · 0:16–0:54 (K 2.2).** The page has "≡ aᵢbᵢ" (a definition, by the summation convention); the screen has "= aᵢbᵢ".
  Consider ≡ to match the page.
- **N3 · 1:57.6–2:20 (s7 parcels).** The parcels are hollow white circles. The storyboard wanted each parcel to keep its
  own colour, which would *show* "keeps its temperature (DT/Dt = 0)". Fill each dot with its starting T colour.
- **N4 · 0:35–0:47 (s3 copies).** On the 640-px frames, 5 units of a span about 133 px in the left copy and about 142 px
  in the right. The storyboard says "same scale". Check the two copies' scale (the tray comparison is right either way).
- **N5 · 2:27.7–2:30.5 (90° hold).** The zero-width rectangle is drawn as a white line from O backwards along a's line. It
  can read as a new arrow. Hide the rectangle outline when its width is 0, and keep only the "0.000" readout.
- **N6 · 1:29–1:32 (s5).** The storyboard has the sled sliding on to 10 m; only the d arrow grows. That is fine, but a
  short slide would match "walk twice as far" better.
- **N7 · 2:13–2:20 (s7 card).** The two-row card is static while it is read out. Highlight row 1 on "The shadow says…"
  (2:13.05) and row 2 on "The dot product says…" (2:16.7).

### Verdict: FIX
The teaching, physics, equations and pacing are right, and the movie answers U-A.17 clearly. To reach `qa_pass` it needs:
1. one re-render for M1 (and preferably S1–S3);
2. the frozen-gate tool fix and a QA re-run (M2).

The re-review only needs frames at 1:42–1:57, 2:03–2:20 and 2:40–2:50, plus the new qa.json.


## ch00_dot_product_why (review 2, 2026-10-22)

Re-review after fix loop 1 (re-rendered MP4, 170.005 s, 13.16 MB). New frames are in
`reports/movies/ch00/ch00_dot_product_why/review2/`:
- `t_1…6.png`: 640-px frames at 18, 25, 36, 44, 47, 103, 106, 110, 116, 120, 124, 126, 127.6, 128, 128.5, 130, 133, 136,
  139, 148, 149, 158, 162 and 166 s;
- `n4_grid.png`: a full-resolution s3 frame with a 100-px grid laid over it.

I also swept the new contact sheet for regressions.

### qa.json: 10/10 PASS, `pass: true`
The frozen gate now reads "14 frozen stretch(es) > 4 s, all narrated (longest silence inside 0.80 s)", which is the
skill's rule. The other nine gates are unchanged: −16.2 LUFS, −4.5 dBTP, 0 flashes, 36 cues, 25 hashes, 9 equations.
**M2 closed.**

### Round-1 findings
| id | window | now | result |
|---|---|---|---|
| M1 | 2:03.7–2:20 | "(−4.32 K per day)" on run 1 and "(−8.64 K per day)" on the steep run. The values come from the signed `dTdt_K_day*` in the data. | PASS |
| M2 | qa.json | The frozen gate is narration-aware: PASS. | PASS |
| S1 | 1:42.7–1:57.6 | "\|∇T\|" now sits below the ∇T arrow (1:43, 1:46, 1:50). The "60°" label and arc are clear. | PASS |
| S2a | 2:07.7–2:20 | The steep map is built around the pin and runs 7 → 19 °C on a fixed 4–20 °C colour bar. The pin colour does not change at the switch. The chip "same place, gradient ×2 — clock restarts" appears from 2:07.6. The thermometer resets 11.92 → 13.00 °C (the chip explains this) and ends at 10.84 °C. | PASS |
| S2b | 1:42–2:20 | The ∇T and u arrows have a dark halo and stay visible over the orange east half (2:08.5, 2:10, 2:13). | PASS |
| S3 | 2:40.6–2:50 | The end card shows `https://shammun.github.io/aofd/notebooks/poc_ch00a_dot.html`, `https://shammun.github.io/aofd/viz/ch00/vector_products_lab.html` and the fluidpy ch02 URL. | PASS (see P1) |
| N1 | 0:11.975, 0:33.25 | "Arrow a is five, one, / and arrow b is one, three." and "Reason one: a shadow / depends on who casts it." No line in the VTT is over 42 characters. | PASS |
| N2 | 0:16–0:54 | "a·b = a₁b₁ + a₂b₂ + a₃b₃ ≡ aᵢbᵢ (K 2.2)" now matches the page (Kundu p. 41) symbol for symbol, apart from the Σ form, which is omitted on purpose. | PASS |
| N3 | 1:57.6–2:20 | Each parcel is filled with its own temperature colour and outlined. Its fill matches the map under it, as it should for a field that is uniform in y. | PASS |
| N4 | 0:35–0:47 | Confirmed equal scale. In the full-resolution frame, a spans 400 px in both copies (O 400 → 800 and O 1240 → 1640), which is 80 px per unit. My round-1 figure of 133 vs 142 px was measured to the "a" label, not to the arrow tip. | PASS (no issue) |
| N5 | 2:27.7–2:30.5 | No rectangle at the 90° hold. Only the dashed drop line along a remains, plus the readout 0.000 and "perpendicular: no shadow". | PASS |

N6 (the sled does not slide) and N7 (the card rows are not highlighted) were not changed. They stay optional.

### Independent check of the new `s6_s7_advection.json`
- **Rates.** dTdt_K_s = −5×10⁻⁵ and −1×10⁻⁴; K_h = −0.18 and −0.36; K_day = −4.32 and −8.64. These equal
  −10 cos 60° × 1×10⁻⁵ (and ×2) × 3600 and × 86 400.
- **The steep map.** T_west_steep = 13 − 2 K per 100 km × 300 km = 7 °C, so the east edge is 19 °C.
- **Run 1.** T_pin at t = 0, 0.05, 0.3, 1 and 6 h is 13.0, 12.991, 12.946, 12.82 and 11.92, which is 13 − 0.18 t.
- **Steep run.** T_pin_steep at the same times is 13.0, 12.982, 12.892, 12.64 and 10.84, which is 13 − 0.36 t.
- **The other values.** The shadow is 5.00 m/s on both maps, and lut_range_C is [4, 20]. These match the frames.
- **On-screen readouts** match the series at the frame's sample: 12.60 at "2.3 h", 12.87 at "0.3 h", 12.33 at "1.9 h",
  11.25 at "4.8 h" and 10.84 at "6.0 h".

### Regression sweep: PASS
- The contact sheet and the frames show no new overlaps, clipping, KaTeX errors or colour changes.
- The s6 map now uses the 4–20 °C bar, so the 10–16 °C field reads purple to orange. Isotherm labels 11–15° are correct.
- s1–s5 and s8 are unchanged.

### New findings
- **P1 (publish condition, not a qa blocker).** The end card links to `https://shammun.github.io/aofd/notebooks/poc_ch00a_dot.html`,
  but no `notebooks/poc_ch00a_dot.html` exists in the repo yet; only the `.ipynb` exists. Build and publish that page, or
  point the card at a page that exists, **before** `/approve-movie` makes the movie public. I could not check the live
  site. `viz/ch00/vector_products_lab.html` exists in the repo.
- **Nice N8 · 1:57.6–2:20.** The clock prints t to 1 decimal while the series steps by 0.05 h. So "t = 0.3 h · 12.87 °C"
  sits beside 13 − 0.36 × 0.3 = 12.89 °C, a gap of up to 0.02 °C. Print t to 2 decimals, or step the series by 0.1 h.

### Verdict: PASS → `qa_pass`
The movie can go to drafts for the user to watch, with P1 to be resolved before it is published.

### Overall after review 2: PASS (P1 is a publish condition)


## ch00_dot_product_why (review 3 — version 2, commit 3787a8b, 2026-10-22)

Reviewer: movie-reviewer, fresh eyes, frames only (I cannot hear the audio). Version 2 is a rewrite: 21 scenes, 844 words,
367.253 s, with a music bed. It answers the user's round-1 movie feedback U-M.1…U-M.8
(`reports/ch00_poc_user_feedback.md`; v1 screenshots `5_2.png`, `6.png`–`9.png`).

**Inputs.**
- `movies/out/ch00/ch00_dot_product_why/{1080.mp4, en.vtt, index.html}`.
- `movies/ch00/ch00_dot_product_why/{storyboard.yaml, script.md, timing.json, manifest.json}`.
- `reports/movies/ch00_dot_product_why/{qa.json, contact_sheet.png, frame_*.png}`.
- `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_dot_product_why/public/{music.json, music.wav, narration.wav, narration_music.wav}`.
- Page images: Kundu p. 41 (`../Fluid Dynamics/chapters/pages/ch02/p068.png`), pp. 51–52 (`p078.png`, `p079.png`) and Vallis p. 5 (`chapters/pages/ch01/p025.png`).

**My frames** are in `reports/movies/ch00_dot_product_why/review/`:
- `g640/t_NNN.png`: 123 frames, 640 px wide, at exactly t = 3·NNN s (0–366 s). They are tiled six to a sheet in
  `sheets/sheet_00…20.png`, each tile labelled with its time.
- `full/`: full-resolution frames at 40, 81, 147.5, 169.5, 186, 302 and 308 s, and `iso_*.png` (the isotherm
  positions in s18).
- `part3/` and `part3_title_sheet.png`: 209.80–212.30 s, every 0.2 s.
- `eq03/` and `eq03_sheet.png`: the (0A.3) line, 145–148.2 s.
- `drift/` and `drift_sheet.png`: the map in s18–s20, 307–353 s.
- `capsim_t/` and `caption_collision_sheet.png`: the en.vtt cues drawn at `line:76%` on frames (see S1).
- `ebur128.log`: the ebur128 run on the mix.
- `f640/` and the loose `sheet_*.png` at the top of `review/` come from a first extraction whose timestamps I could not
  pin down. They are superseded by `g640/` and `sheets/`; ignore them. I am not allowed to delete files, so they stay.

### qa.json: 10/10 PASS, `pass: true` (run with the user-authorised per-movie overrides)
| gate | result |
|---|---|
| duration | 367.25 s vs 367.225 s (±3 %) |
| size | 25.38 MB (budget 60, hard cap 80; overrides) |
| codec | H.264 High, yuv420p, AAC, faststart, 30 fps, 1920×1080 |
| black | 0 stretches |
| frozen | 34 stretches longer than 4 s, all narrated; the longest silence inside one is 2.83 s |
| loudness | −16.0 LUFS, true peak −3.5 dBTP |
| flashes | at most 0 per second |
| captions | 88 cues match the script |
| physics | 32 functions reproduce their hashes |
| equations | 20 storyboard equations present |

**Independent checks.**
- **Captions.** I parsed en.vtt myself and found:
  - 88 cues, in order, from 0.300 to 364.425 s, all inside the 367.25-s audio;
  - at most 2 lines and at most 42 characters per line;
  - at most 15.6 characters per second;
  - cues of 1.06–6.30 s;
  - `line:76%` on every cue;
  - cue text identical to the `timing.json` sentences (844 words).
- **Loudness.** ebur128 on the mix gives I = −16.0 LUFS, LRA 4.1 LU and a true peak of −3.5 dBFS.

### U-M.1…U-M.8: is each point really fixed?
| item | verdict | evidence (time · frame) |
|---|---|---|
| **U-M.1** teach first, then the question | **Fixed** | 0:00–2:28 teaches before any question is asked: the agenda chip "1 · what it is · 2 · why it's built this way" (0:06, `g640/t_002`); vectors, components and Pythagoras (0:15–0:27, `t_005–t_009`); definition 1 (0:30–0:44, `t_010–t_014`); the labels card (0:45–1:03, `t_015–t_021`); a worked 8 (1:06–1:12); definition 2 with what cos does (1:15–1:30, `t_025–t_030`); "how much two arrows point the same way" with +6 / 0 / −6 (1:36–1:45, `t_032–t_035`); the shadow derived (1:48–2:27, `t_036–t_049`). The question "Why multiply by \|b\|? Why not stop at the shadow?" first appears at 2:28–2:33 (`t_050–t_051`). Tell the user that the teaching part is about 2:28 long, not the "~1.5 min" they mentioned: the extra time is the step-by-step shadow derivation they asked for in U-M.4. |
| **U-M.2** length 6:00–6:10 | **Fixed** | 367.253 s = 6:07.3 (qa.json); the narration runs 364.4 s at 138.8 words per minute. |
| **U-M.3** labels explained once, and a source footnote on every frame that shows a label | **Fixed, with one gap (S3)** | The card "How to read the equation labels" (0:44–1:04, `t_015–t_021`) gives three rows: (K 2.2) is Kundu, Cohen & Dowling, 5th ed. (2012), equation 2.2; "0A = zero-A, with the **digit zero** (not the letter O): our label for Chapter 0, Part A … not a book number", with a ring around the digit; (Vallis 1.7) is Vallis, AOFD, 2nd ed. (2017), equation 1.7. An arrow then points to the footnote strip. The footnote strip is present in s03–s06, s08–s11, s12 (work), s13–s16 and s18–s20. It is about 28 px tall at 1080p (`full/f_40.png`, `f_81.png`), so about 9 px at 640 px, which meets the agreed bar. Every footnote is correct against the page images (next table). The **gap**: from 0:52 to 1:04 the card shows the (0A.1) and (Vallis 1.7) pills, but the strip still names only (K 2.2), while the card says "exact section and page: always in the footnote" (`t_018–t_021`). |
| **U-M.4** (0A.3) derived step by step | **Fixed** | s08, 1:45–2:28 (`t_036–t_049`, `full/f_147.5.png`). The drop line, the shadow and the right triangle come first. Then seven numbered steps, each with its reason: cos θ = side next to θ ÷ long side = shadow ÷ \|a\| → shadow = \|a\| cos θ ("multiply both sides by \|a\|") → divide (0A.1) by \|b\| (the \|b\| struck out in rose) → a·b/\|b\| = \|a\| cos θ = shadow → 8 ÷ 3.162 = 2.530 → a·b/\|b\| = a·(b/\|b\|) = a·b̂ → the check 5 × 0.316 + 1 × 0.949 = 2.530 ✓. Then (0A.3) is assembled with its label. b̂ = (0.316, 0.949), length 1, "b hat", is drawn on the plane. |
| **U-M.5** say plainly that the dot product equals the shadow | **Fixed** | 2:58–3:04 (`t_060`, `t_061`). b shrinks to b̂ while the shadow label stays "2.530 (does not change)". The gauge falls from +8.000 to +2.530. The orange caption reads "if \|b\| = 1, then a·b ÷ \|b\| = a·b ÷ 1 = a·b, **so the dot product equals the shadow: a·b̂ = 2.530**". The narration says "the dot product is the shadow". The wind example follows: v·x̂ = 6 × 1 + 8 × 0 = 6.00 m/s = the eastward part (3:06, `t_062`, `full/f_186.png`). |
| **U-M.6** the weather part | **Partly** (see M1) | All the requested pieces are on screen; see the sub-table below. But s17's answer "No. The map stays put." with a lock "map does not change" (4:52–5:06) is contradicted 3 s later, when the isotherms slide with the wind (s18), and again in s19, when the fixed pole cools. |
| **U-M.7** DT/Dt = 0, the one-move algebra, and no "(doubles)" | **Fixed** | 5:06–5:26 (`t_103–t_108`). The meaning comes first: "each parcel keeps its temperature: no sunshine heating it, no mixing — it carries its temperature like a label (tags never change)", with parcel tags on the map and the chip "DT/Dt = 0: the balloon's reading never changes". Then the strip: (1) DT/Dt = ∂T/∂t + v·∇T, "(Vallis 1.7) with φ = T" → (2) 0 = ∂T/∂t + v·∇T → (3) 0 − v·∇T = ∂T/∂t + v·∇T − v·∇T, "subtract v·∇T from both sides", with the pair struck out → (4) ∂T/∂t = −v·∇T, boxed, "what's left: the pair on the right cancels". "doubles" and "YOUR" appear nowhere in script.md, en.vtt or the s18–s20 composition. (The only "doubles" left is the s12 work chip "double either arrow → the product doubles", which is correct and was not part of the complaint.) The twice-as-steep result is clear at 5:39–5:54 (`t_113–t_118`). |
| **U-M.8** smooth background music | **Fixed (by numbers; the user must judge by ear)** | See "Music" below: the bed is −28.0 LUFS, ducked 5 dB; in the gaps the music sits about 16 dB below the speech. |

**U-M.6 sub-items**
| asked for | where | result |
|---|---|---|
| (1.7) first | 3:32 (`part3/t_212.30`, `t_071`): (1.7) alone, large, with its label and footnote, before any map or number | ✔ |
| φ = T, and v = the wind | 3:36–3:42 (`t_072–t_074`): φ boxed in all three places; "φ = any quantity the air carries (temperature, moisture, …)"; "here φ = T, the temperature", with the T-form; v boxed, "v = the velocity of the air: the wind (Vallis's letter, bold v)", with a teal arrow | ✔ |
| the pole and balloon contrast | 3:45–4:12 (`t_075–t_084`): ∂T/∂t boxed slate with a leader to the pole, "how fast the reading changes at ONE FIXED place"; DT/Dt with a leader to the balloon, "the material derivative: the change felt riding with the air"; v·∇T boxed teal; the anatomy braces "balloon's change = pole's change + change from crossing the slope", and "advection = carrying by the wind" | ✔ |
| ∇T explained | 4:13–4:30 (`t_085–t_090`): an east probe "50 km east: +0.5 K"; ∂T/∂x = 1 K per 100 km = 1.00×10⁻⁵ K/m; ∂T/∂y = 0 ("the isotherms run north–south"); ∇T = (∂T/∂x, ∂T/∂y) = (1.00×10⁻⁵ K m⁻¹, 0); "points uphill, towards warmer air"; \|∇T\| = how steep the map is; "100 km per 1 K" bracket. No north probe arrow is drawn; the ∂T/∂y = 0 line carries that point. | ✔ |
| v·∇T = (\|v\| cos θ) × \|∇T\| | 4:42–4:48 (`t_094–t_096`): v·∇T = (shadow of v on ∇T) × \|∇T\| = (\|v\| cos θ) × \|∇T\| = (10.0 m/s × cos 60°) × 1.00×10⁻⁵ K/m = 5.00×10⁻⁵ K/s; × 3600 s = 0.180 K per hour; units (m/s) × (K/m) = K/s with the m struck out; definition-1 check ✓; product rectangle "area = v·∇T" | ✔ |
| 0.180 K/h as a rate in time (18 km/h × 1 K/100 km) | 4:49–5:06 (`t_097–t_102`, `full/f_302.png`): a two-column card, "rate in SPACE · the map's slope · 1 K per 100 km · fixed" against "rate in TIME · what the moving air meets · 0.180 K per hour"; the balloon goes 36.0 km along the wind and 18.0 km towards warmer air in 1 h (I measured 318 km, 211 km on the zoomed axes, which matches the data); "5.00 m/s = 18.0 km per hour", "18.0 km × (1 K per 100 km) = 0.180 K" | ✔, but see **M1** |
| DT/Dt = 0 and the one-move algebra | see U-M.7 | ✔ |
| no "(doubles)"; twice as steep clear | 5:36–5:54: "same place, map ×2 steeper — clock restarts"; \|∇T\| = 2.00×10⁻⁵ K/m (twice as steep); "shadow of v on ∇T: still 5.00 m/s — it belongs to the wind alone"; ∂T/∂t = −v·∇T = −1.00×10⁻⁴ K/s = −0.360 K per hour (−8.64 K per day): twice as fast; a two-row card, "shadow \|v\| cos θ = 5.00 m/s on both maps → the wind alone" against "∂T/∂t: −0.180 → −0.360 K per hour → the wind AND the map: the shadow alone can't give this" | ✔ |

### Footnotes against the page images: all correct
| footnote | page image | check |
|---|---|---|
| (K 2.2) = Kundu, Cohen & Dowling, *Fluid Mechanics*, 5th ed. (2012), §2.1, eq. (2.2), p. 41 | p068: running head "2.1 SCALARS, VECTORS, TENSORS, NOTATION 41"; a·b = a₁b₁ + a₂b₂ + a₃b₃ = Σ aᵢbᵢ ≡ aᵢbᵢ (2.2) | ✔ The screen shows the first, second and last forms with ≡, and spells out the Σ form in the annotation. |
| (0A.1) = our label; Kundu states u·v = uv cos θ unnumbered, §2.8, p. 52 | p079, first line: "u·v = uv cos θ" (unnumbered); §2.8 begins on p. 51 | ✔ |
| a·b = b·a: Kundu §2.8, p. 51 (unnumbered) | p078, bottom: "2.8 VECTOR, DOT, AND CROSS PRODUCTS … u·v = v·u = …" | ✔ |
| ∇T = (∂T/∂x, ∂T/∂y): the gradient, Kundu §2.9, p. 52 (unnumbered, after (K 2.22)) | p079: §2.9; (2.22) defines ∇; ∇φ = Σ eᵢ ∂φ/∂xᵢ follows, unnumbered | ✔ |
| (Vallis 1.7) = Vallis, AOFD, 2nd ed. (2017), §1.1.2, eq. (1.7), p. 5 | p025: printed page 5; Dφ/Dt = ∂φ/∂t + (v·∇)φ (1.7), boxed; §1.1.3 starts lower on the same page, so (1.7) is in §1.1.2 | ✔ Symbol for symbol. The page has upright D and bold-italic v; the movie has italic D and bold-upright v, a typographic difference already accepted in review 1. |
| (0A.3) = our label; derived on screen from (0A.1); no book number · W = F·d: school definition; no book number · ∂T/∂t = −v·∇T: derived on screen; not a numbered equation | — | ✔ Honest, and no number is invented. |

### Equation fidelity: PASS
- Every on-screen equation is as listed above. I saw no KaTeX error box in any of the 123 frames.
- The derived lines are labelled as derived: the T-form, v·∇T = (\|v\| cos θ)\|∇T\|, and ∂T/∂t = −v·∇T when DT/Dt = 0.

### Physics honesty: FIX (one consistency error, M1); every sign and number is right
**Numbers, recomputed.**
- a·b = 8, \|a\| = 5.099, \|b\| = 3.162, θ = 60.3°, cos θ = 0.496.
- Shadows 2.530 and 1.569. The tray rectangles are to scale: 202 × 253 px and 126 × 408 px on an 80-px grid, i.e. 2.53 × 3.16 and 1.57 × 5.10 (`full/f_169.5.png`).
- s07 gives +6, 0 and −6; the negative case is rose and hatched.
- Work: 20 cos 60° = 10.0 N; W = 50.0 J, then 100.0 J (`part3/t_209.80`).
- Wind map: v·x̂ = 6.00 m/s, drawn 6 × 8 squares at 60 px per unit.

**Advection.**
- The wind is 10 m/s at 60° from east, towards the NE (teal). ∇T points east, towards the warm side (orange).
- The shadow is 5.00 m/s, so v·∇T = 5.00×10⁻⁵ K/s = 0.180 K/h.
- ∂T/∂t = −0.180 K/h (−4.32 K per day).
- The pole reads 12.84 at 0.9 h, 12.30 at 3.9 h and 11.92 °C at 6 h, which is 13 − 0.18 t. The balloon reads 13.00 °C.
- On the steep map the pole reads 12.42 at 1.6 h and 10.84 °C at 6 h, which is 13 − 0.36 t.
- The upwind cone opens to the SW of the pole, towards the colder side. That is right for a NE-bound wind.
- The sign rule is on the end card.

**Map motion (my pixel measurement, `full/iso_*.png`).** In s18 the isotherms move east with the parcels: 0, 6.2, 15.4
and 17.7 km at 306.6, 308.0, 309.5 and 311.5 s. Each parcel's tag matches the map beneath it (e.g. "10.3" at 35 km with
the 10° line at 6 km). That is honest for DT/Dt = 0.

**M1 is the problem**: the scene just before (s17) tells the viewer the opposite (see Findings).

**Colour contract.**
- The first vector is teal: a, p, F, v.
- The second is orange: b, q, d, ∇T, b̂, x̂.
- A shadow takes the caster's colour. Products are neutral, or rose when negative.
- ∂T/∂t is slate and v·∇T is teal.
- The map uses a dark-blue → purple → orange → yellow sequential map on a fixed 4–20 °C bar; no jet, no red/green.
- ✔ throughout.

### Part 3 title at 209.97–212.03 s: confirmed
`part3_title_sheet.png` shows the sequence:
- 209.80 s: the s12 end (W = 100.0 J).
- 209.97 s: the chip "Reason 3 · (b) the weather" with the title fading in.
- 210.20–211.80 s: "**Part 3 · the weather** / the same dot product, inside the equation for how temperature changes",
  fully legible.
- 212.03 s: a cross-fade into (1.7).
- 212.30 s: (1.7) with its footnote.

Mean luminance stays at 18.7–21.0 of 255 (the dark house background), so nothing goes near-black. The narration "Now the
weather." (209.97–211.62) runs under the title, and "This is Vallis one point seven" (211.97) lands as (1.7) appears.

### Music (U-M.8): PASS by the numbers
- **The plan.** `music.json` sets bed_lufs −28.0, duck_db 5.0, target −16.0, premix −13.2 LUFS, seed 7, tail 2.5 s.
- **The stems.** music.wav measures I = −28.0 LUFS (peak −16.4 dBFS). narration.wav measures −16.1 LUFS. The mix
  (narration_music.wav, and the MP4) measures −16.0 LUFS, −3.5 dBTP, LRA 4.1 LU. Loudness gate PASS.
- **Speech against the gaps** (ebur128 momentary, 400-ms window):
  - Inside sentences (2914 samples): median −17.2 LUFS (p90 −13.2).
  - In the 20 scene gaps of 0.8 s or more, a window lying wholly in the gap: median −33.2 LUFS (range −34.8 to −30.5).
  - So the bed sits about 16 dB under the narration when it is heard alone, and lower still under speech (ducked 5 dB).
    **The narration is clearly dominant.**
- **Fade-out.** Over the end-card hold, momentary loudness falls smoothly from −44.6 to −58.6 LUFS.
- **What I cannot check.** I cannot verify "no beats / no melody / soothing", or the gentle lift in s21, by ear. The user
  should listen at 0:00–0:10, in any scene gap, and at 5:55–6:07.

### Legibility at 640 px: PASS, with two small overlaps (S2, S4)
- Body text is 28 px or more at 1080p; the footnotes are about 28 px. Everything is readable on the 640-px sheets.
- Halos keep the map labels readable on the orange half.
- Overlaps: the Σ limit at 0:37–0:44 (S2), the s18 parcel tags (S4), the wind label at 3:05 (N1) and the b̂ hat at 2:21 (N2).

### Footnote strip against the captions: no collision; captions collide with content instead (S1)
- **The strip and the captions.** With `line:76%`, a cue box starts at y ≈ 821 px. Two lines at a Chrome-like 5 %-height
  font reach about y 950. The footnote strip is at y 1000–1072. **No collision** (`caption_collision_sheet.png`).
- **The content in that band.** The y 820–960 band holds content in many scenes:
  - the number-line gauges in s01, s05 and s06;
  - the s07 mini gauges;
  - "area = a·b = 8.000 (both)" in s10;
  - the s12 work gauge;
  - the yellow "not to scale" badges in s14–s17 (bottom right) and s19–s20 (bottom left);
  - the s18 legend.
- My simulation (54-px Arial, 85 % panel) shows the cues covering parts of these (S1).

### Pacing: PASS
Reveals land on the spoken words:
- 0:04.3 agenda;
- 0:13.9 a's legs;
- 0:22.3 Pythagoras;
- 0:33 subscripts;
- 0:37 Σ;
- 0:52 the (0A.1) row;
- 0:58.6 the Vallis row;
- 1:22 the cos inset;
- 1:28.9 the numbers;
- 1:37.6, 1:40.9 and 1:43 the three panels;
- 1:50.7 the shadow;
- 1:57 steps 1–7 one per sentence (2:00, 2:03, 2:09, 2:12, 2:15, 2:20, 2:25);
- 2:28 the question;
- 2:38 and 2:43 the shadows;
- 2:47 the tray;
- 2:58 b → b̂;
- 3:05 the wind;
- 3:21 the force shadow;
- 3:24–3:29 50 J → 100 J;
- 3:32 (1.7);
- 3:35 φ;
- 3:39.6 v;
- 3:45 pole;
- 3:51 balloon;
- 3:57 v·∇T;
- 4:04 braces;
- 4:13 ∇T;
- 4:32 v;
- 4:37 shadow;
- 4:41 product;
- 4:49 question;
- 4:52 answer;
- 4:57 balloon;
- 5:01 check lines;
- 5:12 DT/Dt = 0;
- 5:16 subtract;
- 5:27 pole cools;
- 5:32 upwind cone;
- 5:36 steep map;
- 5:45 twice as fast;
- 5:55 recap.

The rate is 138.8 words per minute. Two soft spots:
- 1:33–1:37 is nearly empty (only the heading chip) while "So the dot product measures…" is spoken (N5).
- (0A.3) is on screen only 2.2 s (2:25.8–2:28) before the cut to s09 (N3). It returns at 2:57–3:04.

### Badges and integrity: PASS
- **"Not to scale" badges** appear on s11 (wind arrow), s12 (N and m scales; sled illustrative), s14–s20 (time ×1200 /
  ×900 / ×3600; idealised field, illustrative, not data; arrows not to the km scale).
- **Text cards** (s03, s04, s13, s21) draw no physics.
- **Integrity.** No book scans or quoted text, and the narration is in our own words.
- **End-card links.** `shammun.github.io/aofd/viz/ch00/vector_products_lab.html` (the repo file exists) and the fluidpy
  ch02 page.
- **P1 is still open:** the end card links to `shammun.github.io/aofd/notebooks/poc_ch00a_dot.html`, and
  `notebooks/poc_ch00a_dot.html` still does not exist (only the `.ipynb`). This must be resolved before `/approve-movie`.

### Accessibility: PASS
- 0 flashes.
- The title and all fades are gentle.
- No full-screen noise.
- Every arrow is labelled, so colour is never the only cue.
- Negative values are rose, hatched or dashed.

### Findings

**Must**
- **M1 · 4:52–5:06 (s17), against 5:06–5:36 (s18–s19). "The map stays put" contradicts the next scene.**
  - **What s17 shows.** The answer chip "No. The map stays put.", the narration "No, the map stays put; its slope is a rate
    in space", a lock icon "map does not change", and "map under the balloon: 13.00 °C → 13.18 °C after 1 h"
    (`full/f_302.png`, `g640/t_098–t_102`).
  - **What follows.** About 3 s later, s18 slides the isotherms 17.7 km east with the parcels (`full/iso_308.0.png`,
    `iso_311.5.png`). Then s19 says that the thermometer on the pole — a fixed place on the map — falls 0.180 K per hour.
  - **Why it matters.** A first-time viewer is told the map does not change and then sees it change at a fixed place.
    That reopens exactly the confusion U-M.6 asked to remove (rate in time vs. slope in space). It also clashes with
    "DT/Dt = 0: the balloon's reading never changes": s17 has the balloon meeting 13.18 °C air after 1 h.
  - **Physics.** Both pictures are legitimate *limits*, but s17 never says it is a "suppose":
    - frozen map: ∂T/∂t = 0 and DT/Dt = +v·∇T;
    - parcels keep T: DT/Dt = 0 and ∂T/∂t = −v·∇T.
  - **Fix (recommended).** Re-say s17 as "the slope is a rate in space; 0.180 K per hour is a rate in time":
    - Answer chip: "No: 1 K per 100 km is the map's slope — a rate in space."
    - Narration sentence 2: "No: one degree per hundred kilometres is the map's slope, a rate in space."
    - Replace the lock with "slope: 1 K per 100 km everywhere".
    - Change "map under the balloon 13.00 → 13.18" to "after 1 h the air is over a spot that was 0.180 K warmer at the
      start".
    - In s18, add one chip when the isotherms start to move: "the air carries its temperature, so the pattern slides with
      the wind".
  - **Minimal alternative** (no new audio): a chip "for this question, hold the map still for a moment" in s17, plus the
    s18 chip above. One sentence of TTS changes in the recommended fix; the s17 length may move by about 0.5 s.

**Should**
- **S1 · captions over content (`caption_collision_sheet.png`, frames `capsim_t/t_*.png`).** The `line:76%` cues sit at
  y ≈ 821–950 and cover:
  - the gauges at 0:03–1:32;
  - the mini gauges at 1:37–1:45;
  - "area = a·b = 8.000 (both)" at 2:47–2:50;
  - the W gauge at 3:24–3:30;
  - the **"not to scale" badges** at 3:45–5:06 (bottom right) and 5:27–5:55 (bottom left);
  - the s18 legend at 5:06–5:26.

  Hiding an honesty badge while captions are on (they are `default` on the page) is the important part. Fix: move the
  ScaleBadge to the top right in s14–s17 and s19–s20, as s11, s12 and s18 already do. Keep y 820–960 free of essential
  text where possible (the gauges could move up about 60 px). The footnote/caption spacing itself is fine.
- **S2 · 0:36.9–0:44.4 (s03).** The Σ lower limit "i=1" prints over "(a shorthand" in the note
  "≡ : 'is defined as' (a shorthand, not a new fact)" (`full/f_40.png`). Move the note down about 30 px.
- **S3 · 0:52–1:04 (s04).** The card shows the (0A.1) and (Vallis 1.7) pills, but the footnote strip names only
  (K 2.2), while the card itself says "exact section and page: always in the footnote" (`g640/t_018–t_021`). Add the 0A.1
  and V1.7 footnotes as each row appears. This is the one place where the U-M.3 rule is not met.
- **S4 · 5:06–5:26 (s18).** The parcel tags overlap their neighbours' dots: "14.4" under the 15.0 dot, "11.2" under 11.6,
  "13.8" under 14.4, "10.4" under 11.0, "13.1" under 13.7 (`full/iso_308.0.png`). At 640 px several tags are unreadable,
  and the tags are the point of the scene ("tags never change"). Use five or six parcels per row, or put each tag above its
  dot.
- **S5 · captions.** 13 cues end on a one-word second line: 0:00.3 "product.", 0:09.97 "direction.", 0:13.95 "one.",
  0:18.15 "components.", 0:48.1 "edition.", 1:28.9 "again.", 1:40.9 "six.", 2:02.5 "theta.", 4:25.05 "east:",
  4:48.9 "hour?", 5:32.1 "upwind.", 5:54.8 "ways,", 6:01.1 "lab.". The worst is "Arrow a goes five right and one up: five, /
  one.", which splits the pair (5, 1). Rebalance the line breaks (v1 N1 was fixed by hand; `tools/tts.py` still breaks
  greedily).

**Nice**
- **N1 · 3:04.9–3:10.** "wind v = (6, 8) m/s, \|v\| = 10.0 m/s" starts on the dashed drop line and runs off the grid
  (`full/f_186.png`). Put it left of the arrow.
- **N2 · 2:20–2:28.** In the step-6 note, the hat of "b̂" is drawn up on the line above, over "a" in "by a number"
  (`full/f_147.5.png`).
- **N3 · 2:25.8–2:28.** (0A.3) is held only about 2.2 s before s09 (`eq03_sheet.png`). Hold it 1 s longer, or say
  "that's (0A.3)" at its s11 reprise.
- **N4 · 3:45–4:13.** "(v·∇)T = v·∇T … the dot product of the wind with ∇T" shows ∇T before s15 explains it at 4:13. The
  narration gives the meaning, but a small chip "∇T, 'grad T': next" would help.
- **N5 · 1:33–1:37.** Only the heading chip is on screen while the s07 headline is spoken. Bring panel 1 in earlier.
- **N6 · 5:29–5:36.** The balloon leaves the top of the map at about 3.9 h, but the readout keeps "balloon: 13.00 °C".
  Add "(off the map, still 13.00)".
- **N7.** Only Part 3 has a title card. Matching "Part 1 · what it is" at 0:10 and "Part 2 · why" at 2:28 would echo
  the agenda chip.

### Verdict: FIX
Version 2 answers the user's points much better than v1:
- U-M.1, 2, 4, 5, 7 and 8 are fixed.
- U-M.3 is fixed except for a 12-s gap (S3).
- U-M.6 has every requested element.

Everything that moves is right, and every footnote matches its page. **One Must remains.** M1 is the s17 "map stays put"
statement, which the next scene contradicts on the very point U-M.6 was about. M1 needs one re-render (and one new TTS
sentence if the recommended wording is used). S1–S4 should go in the same re-render. A re-review needs:
- frames at 0:36–1:05, 4:49–5:36 and the badge scenes;
- a caption simulation;
- the new qa.json.

P1 (the notebook page) is still a publish condition.

## Overall: FIX (ch00_dot_product_why review 3 — M1; S1–S5 recommended; P1 before publishing)

## ch00_dot_product_why (review 4 — version 4, commit d029eba, 2026-10-23)

Reviewer: movie-reviewer, with fresh eyes. I looked only at frames, not at the running movie.
The yardstick is the user's round-2 feedback (`reports/ch00_poc_user_feedback.md`, "user round 2 on v3": U-M2.G1–G5 and
U-M2.1–U-M2.17) and the decisions recorded under it:
- the 8:12 length is accepted;
- at 180° the movie says "pointing in opposite directions";
- the upwind track replaces the s19 wedge;
- the end-card notebook page exists.

Inputs:
- `movies/out/ch00/ch00_dot_product_why/{1080.mp4, en.vtt}`;
- `movies/ch00/ch00_dot_product_why/{storyboard.yaml, script.md, timing.json}`;
- `reports/movies/ch00_dot_product_why/qa.json`;
- the page image `chapters/pages/ch01/p025.png`;
- `movies/lexicon.yaml`.

Frames (scratch on G:, `aofd-data/scratch/movies/ch00_dot_product_why/review4_v4/`, 174 full frames, 64 MB):
- one frame at every scene start (+0.6 s) and at the end of every sentence (113 frames). They are tiled at 640 px with the
  caption band (y 821–950) outlined, in `tiles/sent_000…028.png`.
- sweeps: s19 clock every 0.5 s from 436.5 to 444 s; s19 opening every 1.5 s; s11 every 1 s from 234 to 244 s; s03 every
  0.75 s from 38 to 43.5 s; s05 every 1 s from 75 to 80 s.
- full-resolution crops `full/c_*.png` (s06 strip, s08 title, s11 labels, s13 equation, s16, s17 map, s18 strip, s21 rows).

### qa.json: 10/10 PASS, `pass: true`
- duration 492.18 s (target 492.15, ±3 %);
- size 30.85 MB (budget 60, hard 80);
- codec: H.264 High, yuv420p, AAC, faststart;
- black: 0 stretches;
- frozen: 59 stretches longer than 4 s, all narrated; the longest silence inside one is 2.83 s;
- loudness −16.0 LUFS, true peak −3.5 dBTP;
- flashes: 0 per second;
- captions: 113 cues match the script;
- physics: 36 functions reproduce their hashes;
- equations: 36 present.

### My own checks of the captions and audio
- **Captions:** 113 cues, at most 2 lines and 42 characters per line, at most 15.72 characters per second. Every cue
  lasts 1–7 s and the cues are in order. The last cue ends at 489.35 s. There are no one-word second lines.
  - No cue contains "Vallis", "Kundu", "Cohen", "Dowling", "not to scale", "0A" or "bit of air".
  - Every one of the 113 frames is empty inside the caption band (y 821–950). The gauges and reason slots sit below it
    (y ≥ 960), and the s21 rows end at y 788, so **captions and content never collide**.
- **Music** (ebur128 on the narration gaps): the bed is ≈ −32.5 LUFS in the 0.7-s scene gaps (7.7 s, 100.1 s,
  443.4 s, 484.3 s) and −53 LUFS in the end-card hold. Speech is −16.6 LUFS (300–302 s).
  - So the bed sits about 16 dB under the voice. It can be heard in the gaps and does not mask any word. This matches
    the level the user confirmed.
  - The 5-s fade-in, the 8-s fade-out and the missing lift on s21 differ from the storyboard text, but the user said
    "music unchanged". **Accepted** (storyboard doc drift, S11).
- **"arrow a,"** (lexicon line 61) covers the s09 comma form "of b on arrow a, one point five seven". The caption keeps
  "arrow a,". **Accepted.**

### U-M2 items: is each one fixed?
| Item | Verdict | Evidence (timestamps in v4) |
|---|---|---|
| G1 no references | **PASS** | No label, book or author name or footnote strip appears in any of the 174 frames. The only number on screen is a plain "(1)": at 0:55–1:14 on the cosine form, with the note "equation (1): we use it in a moment" at 1:13, then in the s06 strip from 1:41 ("divide both sides of (1) by \|b\|", 2:02). The end card says only "Made with tested fluidpy physics · shammun.github.io/aofd". The captions are clean (above). |
| G2 no "not to scale" badges | **PASS** | There is no badge anywhere. Mixed units are explained by their own labels: "wind map: 1 grid square = 1 m/s (an arrow's length is a speed)" (3:17), "force ruler (N)" and "path ruler (m)" (3:38–4:03), "(the arrow has its own scale, in K/m; the bracket gives its value)" (5:47). |
| G3 titles stand out | **PASS** | A full-width band with an accent bar, a kicker in capitals, a 60-px bold title with an underline, and "n / 22" on the right, in every scene. PartCards appear at 2:44 and 4:05. The KaTeX symbols inside titles are slightly oversized (S10). |
| G4 every new term explained | **PASS** (one forward reference, S5) | **Components:** "component = how far the arrow reaches along one axis" (0:25). **Straight bars:** "\|a\| (two straight bars) = the length of a" (0:32). **θ:** "the angle between the arrows" (0:55). **cos θ:** the dial (1:06). **Shadow:** 1:50. **b̂:** "unit vector b̂: length 1, same direction as b" (2:23). **x̂:** "the unit vector pointing east — 1 eastward, 0 northward" (3:22). **N, J:** 3:38 and 4:00. **∂:** "only one thing changes — here the time" (4:17). **Air parcel:** 4:28. **Material derivative:** 4:36. **φ and v:** 4:50. **Advection:** 4:56. **Isotherm:** 5:04. **∂T/∂x, ∂T/∂y:** 5:22 and 5:28. **∇ "grad, short for gradient":** 5:37. **1 K step = 1 °C step:** 5:41. The one gap: ∇ first appears at 4:37 with only a name chip, "∇ = 'grad': explained in two scenes" (S5). |
| G5 narration = screen | **FIX** (M1) | Every other line is revealed with the sentence that says it (checked at all 90 sentence ends). The exception is s19 at 7:17–7:23: the spoken pole readings lag the on-screen clock by about 1 h. |
| U-M2.1 | **PASS** | The 0:21–0:25 narration and chips say "5 and 1 are the components of vector a: a = (5, 1)" and "1 and 3 are the components of vector b: b = (1, 3)". |
| U-M2.2 | **PASS** | 0:38.75 shows a·b = a₁b₁ + a₂b₂ + a₃b₃ ("arrows in space: 3 components"). By 0:43 the a₃b₃ term is struck through ("our flat arrows: 2 components") and a·b = a₁b₁ + a₂b₂ is shown. At 0:48 the tags "a₁ = 5 b₁ = 1 / first components" and "a₂ = 1 b₂ = 3 / second components" appear. No label and no "small number = which part" line. |
| U-M2.3 | **PASS** | The labels scene is gone. The worked line "= 5 × 1 + 1 × 3 = 5 + 3 = 8" is in the definition scene at 0:54. The extra "5 + 3" is correct and helps a beginner (deviation **accepted**). |
| U-M2.4 | **PASS** (S7) | At 1:15–1:18 a large p is alone at the top with "p stays the same in all three pictures". At 1:19.5 "only q turns" appears, and the three panels have a pinned p, each tagged "same p". The panels are 0° → +6 (1:25), 90° → 0 (1:29) and 180° → "opposite directions: negative", −6 (1:35), and the band "a·b measures how much two arrows point the same way" closes the scene (1:40). Once the panels appear, p is no larger than q (S7). |
| U-M2.5 | **PASS** | "(1)" at 0:55 and 2:02. The narration says "Divide both sides of equation one by the length of b" (2:02.7). |
| U-M2.6 | **PASS** | At 2:17–2:23 b shrinks to b̂, with "b̂ ('b hat') = b ÷ \|b\|" and "unit vector b̂: length 1, same direction as b (\|b̂\| = 1)". |
| U-M2.7 | **PASS** | The strip is headed "Computing the shadow of a on b" and each row is tagged "shadow:". The merged row at 2:12 is "shadow = \|a\| cos θ = a·b/\|b\| = 8/3.162 = 2.530". At 2:28, b̂ = (1/3.162, 3/3.162) = (0.316, 0.949). The merged row "shadow = a·b̂ = 5 × 0.316 + 1 × 0.949 = 2.530" comes at 2:42.5, with "✓ same shadow as before". |
| U-M2.8 | **PASS** | At 3:02.6 both calculation panels are written out in full: (5,1)·(1,3)/√10 = 8/3.162 = 2.530 and (1,3)·(5,1)/√26 = 8/5.099 = 1.569. At 3:06.4 come "× \|b\| = 8.000" and "× \|a\| = 8.000", the rectangles, and "a·b = b·a". The rectangles grow in place instead of sliding to a tray (deviation **accepted**: the centre still shows "area 8.000 both ways"). |
| U-M2.9 | **PASS** | At 3:17 the label reads "wind v = (6, 8): 6 m/s eastward, 8 m/s northward", with the legs labelled "6 m/s east" and "8 m/s north". At 3:22, "x̂ = (1, 0): … 1 eastward, 0 northward", and at 3:29 "v·x̂ = 6 × 1 + 8 × 0 = 6 m s⁻¹ = the eastward part of the wind". No "Vallis calls…" chip and no badge. |
| U-M2.10 | **PASS** (narration and content); the label overlap is M2 | The scene has 7 sentences over 34 s. **17.3 N:** "across the motion, does no work" (3:42). **Shadow:** "along the ground = the shadow of F on the motion = 20 × cos 60° = 10.0 N" (3:48). **10 N:** "this shadow is a force: 10 N pulling forward — the only part that does work" (3:52). **Work:** 50 J, then 100 J (4:00). **Close:** "twice the distance → twice the work" (4:03). |
| U-M2.11 | **PASS** | s12 (4:04–4:37) teaches the pole, ∂, the balloon, the air parcel and DT/Dt before any equation appears. s13 then shows Dφ/Dt = ∂φ/∂t + v·∇φ without brackets. On screen: "φ = any quantity the air carries: temperature T, moisture, …"; "v·∇φ = advection of φ"; DT/Dt = ∂T/∂t + v·∇T with "v·∇T = advection of temperature"; "moisture q: v·∇q = advection of moisture" (5:02). No "Vallis". |
| U-M2.12 | **PASS** | **5:07:** isotherms at 100…500 km, labelled 11…15 °C, with "isotherm = a line of equal temperature". **5:12:** "100 km" brackets. **5:16:** the walk east, "+1 °C" at each crossing. **5:22:** ∂T/∂x = 1 °C/100 km, "change going east only (north position held fixed)". **5:28:** ∂T/∂y = 0, "you stay on the 13 °C isotherm". **5:41:** ∇T = (∂T/∂x, ∂T/∂y) = (1.00 × 10⁻⁵ K m⁻¹, 0). No badge. |
| U-M2.13 | **PASS** | The narration has 4 sentences and 69 words. The shadow "= speed straight towards warmer air" (6:02); "8.66 m/s along the isotherm: no temperature change" (6:06); "units: (m/s) × (K/m) = K/s" with the m's struck through, then 0.180 K per hour (6:16). No footnote, no "1.7". |
| U-M2.14 | **PASS** | "rate in SPACE · the map's slope · 1 °C per 100 km" (6:23) and "rate in TIME · what the moving air parcel meets · 0.180 K per hour" (6:27) are each revealed with their own sentence. At 6:35, "36.0 km along the wind", "18.0 km towards warmer air = 5.00 m/s × 3600 s" and "after 1 h the parcel is over a spot that was 0.180 °C warmer when it set off" match the narration word for word. |
| U-M2.15 | **PASS** (S3) | **Chips:** "suppose: each parcel keeps its temperature (no sunshine, no mixing)" (6:37), then "balloon: 13.00 °C, never changes · DT/Dt = 0" and "the pattern slides with the wind" (6:50). **Strip:** rows 1–4, one move each, with the pair struck through and −v·∇T boxed with a rose minus (7:00). |
| U-M2.16 | **PASS** in content; the timing is M1 | The wedge is gone. **Upwind line:** "upwind = where the wind comes from" (7:09). **Dots and formula:** the three dots "arrives in 1 h · 12.82 °C / 2 h · 12.64 °C / 3 h · 12.46 °C" (7:10.5) and T_upwind = 13.00 + ∇T·(−v t) (7:16.5). **Clock:** the dots slide into the pole and the readout steps down: 12.78 at 1.20 h, 12.59 at 2.26 h, 12.31 at 3.85 h, 11.92 at 6.00 h. **Balloon:** it stays at 13.00 °C. |
| U-M2.17 | **PASS** | Four rows with icons, one per sentence (7:45–8:04). Each row has its formula and number: a·b = (\|a\| cos θ)\|b\| = \|a\|\|b\| cos θ; "+ same way · 0 at a right angle · − opposite directions"; v·x̂ = 6 m s⁻¹; W = F·d = 50 J, v·∇T = 0.180 K per hour. No references. The links are on a separate end card. |

### Physics honesty: PASS
I recomputed every number on screen and every one is right:
- **Definitions:** \|a\| = √26 = 5.099, \|b\| = √10 = 3.162; θ = 60.26°, cos θ = 8/16.125 = 0.4961.
- **Shadows:** a·b/\|b\| = 2.530 with foot (0.8, 2.4); b·a/\|a\| = 1.569. b̂ = (0.316, 0.949), and 5 × 0.316 + 0.949 = 2.530.
- **p·q:** +6, 0, −6.
- **Wind and sled:** v·x̂ = 6 m/s. F = (10.0, 17.3) N, W = 50 J and 100 J.
- **The weather map:** ∇T = 1.00 × 10⁻⁵ K/m; v = (5.00, 8.66) m/s; v·∇T = 5.00 × 10⁻⁵ K/s = 0.180 K/h; 18.0 km per hour
  towards warmer air and 36.0 km along the wind.
- **Advection sign:** the screen derives ∂T/∂t = −v·∇T from DT/Dt = 0 (7:00). The wind has a part towards warmer air
  (v·∇T > 0), so the fixed thermometer **cools**: 13.00 → 11.92 °C in 6 h. The balloon stays at 13.00 °C. Both are
  right.
- **Upwind dots:** pin − v·t = (300, 180) − (18.0, 31.18) km × n gives (282.0, 148.8), (264.0, 117.6) and
  (246.0, 86.5) km. Their temperatures now are 10 + x/100 = 12.82, 12.64 and 12.46 °C. These are exactly the pole's
  readings at 1, 2 and 3 h, because the pattern slides at v. The dots move along the wind (towards the north-east),
  into the pole. **Correct.**
- **Twice as steep:** the shadow is still 5.00 m/s; v·∇T = 0.360 K/h; the pole reads 11.48 °C at 4.23 h and 10.84 °C at
  6 h (13 − 0.36 × 6). **Correct.**
- **s17** no longer claims a frozen map, and s18 shows the pattern sliding, so v3's M1 stays fixed.

### Equation fidelity: PASS
- **Material derivative:** I compared Dφ/Dt = ∂φ/∂t + v·∇φ (s13, 4:37–5:03) with the rendered page `chapters/pages/ch01/p025.png`.
  - The boxed (1.7) there is Dφ/Dt = ∂φ/∂t + (v·∇)φ, and (1.6) on the same page writes the same right-hand side as
    v·∇φ. For a scalar the two are identical, so the bracket-free form is faithful.
  - φ is the curly φ as on the page, and v is bold.
  - One cosmetic difference: the movie's D is italic, while the page's D is upright (`\mathrm D`), as the storyboard
    itself specifies (S8).
- **The other strings are unchanged since review 3** and were checked against their page images there: a·b = a₁b₁ + a₂b₂ + a₃b₃, a·b = \|a\|\|b\| cos θ and
  ∇T = (∂T/∂x, ∂T/∂y).
- No KaTeX error box appears in any frame.

### Builder-declared deviations
| Deviation | Verdict |
|---|---|
| lexicon "arrow a," | Accepted: needed for the s09 comma form; the caption text is unchanged. |
| music bed as in v3 (5-s fade-in, 8-s fade-out, no lift on s21) | Accepted: the user asked for "unchanged" music. Update the storyboard `audio.music.notes` (S11). |
| s09 rectangles grow in place | Accepted: both areas and "area 8.000 both ways" are on screen at 3:06. |
| s11 sled still while d grows | Accepted with S9. d is labelled on a "path ruler (m)", but a still sled under a growing displacement reads oddly. |
| s22 local two-row links card | Accepted: the links are correct. The lab page is on origin; the notebook page is not yet (P1). |
| s03 worked line "5 + 3" | Accepted. |

### Legibility at 640 px: FIX (one text-on-text overlap, M2); small secondary text (S4)
All titles, equations and the main labels can be read at 640 px. There is no clipped text, except the balloon leaving
the map in s19 (S1).

### Pacing: FIX (M1); everything else PASS
No scene is rushed or frozen. The densest scene, s09 (14 s), puts both calculation panels up with their sentence.

### Accessibility: PASS
- The palette is teal and orange, with rose plus hatching for negative values, so nothing depends on red and green.
- The map uses cmocean thermal.
- There are no flashes (QA: 0 per second).
- PartCards dim the stage to 35 % and never flash it.

### Integrity: PASS
- No book scans and no quoted text.
- The narration is in our own words.
- The end card links to `viz/ch00/vector_products_lab.html` and `notebooks/poc_ch00a_dot.html`.

### Findings
**Must fix**
- **M1 (s19, 7:17.7–7:23.3, pacing, G5).** The 6-h clock starts at 7:17.9 and runs at 1 h per second, so the spoken
  readings trail the readout by about an hour:
  - at "thirteen" (≈ 7:18.5) the screen shows 12.88 °C;
  - at "twelve point eight two" (≈ 7:19.5–7:20) it shows 12.69–12.59 °C;
  - at "twelve point six four" (≈ 7:21.5–7:22.5) it shows 12.31–12.12 °C.

  The user's G5 rule asks that what is said is what is on screen.
  **Fix:** drive the clock from the sentence-4 word times so that 0 h, 1 h and 2 h land on "thirteen", "twelve point
  eight two" and "twelve point six four". About 1 h per 1.6 s for the first 2–3 h fits the 5.65-s sentence. Then let it
  run on to 6 h over the scene tail, or end at 3 h. Visuals only, no new TTS.
- **M2 (s11, 3:53.6–3:59.0, legibility).** The teal "10 N forward" label and the orange "d = 5 m" label are drawn on top
  of each other, and both cover the "60°" angle label (crop `full/c_s11_labels.png`). The overlap lasts until d grows
  past about 6 m.
  **Fix:** move "d = 5 m" under the ground line (or to the arrow tip), lift "10 N forward" about 30 px, and fade the 60°
  arc and label with the 17.3-N leg.

**Should fix**
- **S1 (s19, 7:00–7:23).**
  - The panel lists "balloon: 13.00 °C, keeps its temperature" from 7:01.4, but no balloon is visible until 7:18
    (it is hidden under the pole).
  - From 7:22.3 to 7:23.3 the balloon leaves the map through the top edge. It is drawn outside the map frame and is cut
    off under the title band at 7:23.0, without its "off the map" tag on the map.

  **Fix:** offset the balloon icon from the pole at the start, and fade it out at the map edge.
- **S2 (s16, 5:49–6:16).** The label "a new wind: \|v\| = 10 m/s, 60° from ∇T" is wrong: this is the same wind the
  balloon rode in s12 (10 m/s, 60° from east). Say "the wind".
- **S3 (s18, 7:00.5–7:01.4).** The summary line "∂T/∂t = −v·∇T when DT/Dt = 0" fades in during the last ≈ 0.8 s before
  the cut, so a viewer only glimpses it. Show it with sentence 4 or drop it.
- **S4 (legibility at 640 px).** Several pieces of secondary text are ≤ 9 px at 640 px wide. Raise them to ≥ 28 px at
  1080, full-opacity muted ink:
  - the reason-slot captions "same number both ways / cheap / physics needs both sizes" (≈ 18 px at 1080 → 6 px; 3:06–4:03, 7:41);
  - the strip "why" lines in s06, s07 and s18 (≈ 26 px → 8.7 px);
  - the dimmed s16 components check chip (6:16);
  - the s04 cos-dial labels (1:06);
  - "uphill → warmer" and "\|∇T\|" in s15 (5:47).
- **S5 (s13, 4:37).** ∇ first appears here with only "∇ = 'grad': explained in two scenes". G4 asks for an explanation at
  first use. Add a five-word gloss, for example "grad φ: how φ changes across the map".
- **S6 (s13, 5:02).** "v·∇T = advection of temperature" touches the teal ring. Leave a 16-px gap.
- **S7 (s05, 1:19.5–1:40).** U-M2.4 asked for p to be "larger". The big p is visible alone only from 1:15 to 1:18.5,
  and in the panels p is the same size as q. Keep a large reference p in the free space at the top through the scene.
- **S8 (s13, s16, s18).** D/Dt is set in italic; the page and the storyboard use upright D (`\mathrm{D}`).
- **S9 (s11, 3:59–4:01).** d grows from 5 to 10 m while the sled stands still. Move the sled with the tip of d, or label
  d "distance pulled".
- **S10 (titles of s07, s08, s15, s16).** KaTeX symbols in the titles render larger than the sans title. The \|b\| bars in
  s08 cross the band's lower edge, and the underline runs through the KaTeX descenders (crop `full/c_s08_title.png`).
  Render the title symbols at title size in the title font.
- **S11 (docs).** The storyboard still says 2-s fades with a lift on s21, a centre tray in s09 and a sliding sled in
  s11. Update the storyboard to what was built.

**Publish condition**
- **P1.** `notebooks/poc_ch00a_dot.html` is committed (7eb99d5) but not on `origin/main` (the local branch is 10 commits
  ahead). The end card's second link returns 404 until it is pushed.

### Verdict: FIX
Version 4 does what round 2 asked:
- 21 of the 22 U-M2 items PASS. The one FIX is G5, through M1. G1–G4 hold on every frame and in the captions.
- The physics and the advection sign are right, every number checks, and the captions are clean and never collide with
  content.

**Two small Musts remain**, both visual only, so no TTS is needed:
- M1, the s19 clock pacing (7:17–7:23);
- M2, the s11 label overlap (3:53–3:59).

Fixing them needs a re-render of s11 and s19 (S1–S4 and S6–S10 should go in the same pass) and a QA re-run. A
re-review needs only frames at 3:50–4:03 and 7:00–7:24 and the new qa.json.

Disk at review time: C: 83 GB free, G: 588 GB free. The review scratch is 64 MB on G: (deletable after the re-review).

## Overall: FIX (ch00_dot_product_why review 4 — M1, M2; S1–S11 recommended; P1 before publishing)

## ch00_dot_product_why (review 4b — v4 fix loop 1, commit d5bcb3f, 2026-10-23)

I re-reviewed the movie at the same path from my own frames. The narration and captions are unchanged (113 cues).
Frames are in `aofd-data/scratch/movies/ch00_dot_product_why/review4b_v4fix1/` on G::
- s11 every 1 s from 3:50 to 4:04;
- s19 every 1.5 s from 7:01.5 to 7:13.5, then every 0.5 s from 7:14 to 7:24;
- s18 at 6:58–7:01.3;
- one frame at each S-item spot (1:06, 1:19.5, 1:40, 2:12, 2:17, 2:42.5, 2:47, 3:06, 4:37, 4:50, 5:02.5, 5:47.5, 6:06.6,
  6:16.4, 6:17.0, 7:41.7);
- full-resolution crops `full/c_*.png`.

### qa.json: 10/10 PASS, `pass: true`
- duration 492.18 s; size 30.95 MB;
- frozen: 60 stretches longer than 4 s, all narrated (longest silence 2.83 s);
- −16.0 LUFS, peak −3.5 dBTP; 0 flashes;
- 113 captions match the script; 36 physics hashes; 36 equations.

### Round-4 findings
| Item | Verdict | Evidence |
|---|---|---|
| M1 s19 clock vs the spoken readings | **PASS** | The clock is still at 0.00 h (13.00 °C) through "thirteen" (7:17.7–7:18.9). It reads 1.05 h / 12.81 °C at 7:20.0, inside "twelve point eight two", and 2.09 h / 12.62 °C at 7:22.0, inside "twelve point six four". It ends at 3.00 h / 12.46 °C at 7:24.0. Each upwind dot reaches the pole as its value is spoken. **The hold at 3 h is acceptable:** the narration names only 13, 12.82 and 12.64. Ending on the third dot (12.46 °C, the last tag on screen) closes the picture without racing past the voice. The 0.18 °C per hour rule is still shown by ∂T/∂t = −0.180 K per hour in the panel. Nothing said or written needs 6 h any more: the panel now reads "clock: 1 h in 1.5 s". |
| M2 s11 label overlap | **PASS** | From 3:50 to 4:04, "10 N forward" sits alone above the sled's nose. "d = 5 m (distance pulled)", growing to "d = 10 m", sits under the product rectangle, clear of "path ruler (m)". The 60° arc and label have gone with the dimmed 17.3-N leg. No text touches other text. |
| S1 s19 balloon | **PASS** | The balloon is beside the pole from 7:01.5 with "balloon: 13.00 °C". At 7:24 it is still inside the map, at the top edge. |
| S2 s16 "a new wind" | **PASS** | The label now reads "the wind (as the balloon's): \|v\| = 10 m/s, 60° from ∇T" (6:06). |
| S3 s18 summary line | **PASS** | The line is on screen with sentence 4 (seen at 6:58.0, held to the cut). |
| S4 small text | **PASS** (with one leftover, S12) | The reason slots now wrap onto two lines at a readable size (3:06, 7:41.7). The s06 "why" lines grew from about 26 to about 28 px (crops `c_s06why.png` / `c_s06why_old.png`). In s15, "uphill → warmer" and "\|∇T\|" are about 30 px (5:47.5). The s04 dial labels are larger (1:06). The s16 components chip is now full-opacity ink once shown, but see S12. |
| S5 ∇ at first use | **PASS** | s13 (4:50) says "∇φ ("grad φ"): how φ changes across the map". |
| S6 ring gap | **PASS** | At 5:02.5 "v·∇T = advection of temperature" stands clear of the ring. |
| S7 large p | **PASS** | "p = (3, 0), fixed" is drawn large at the top left from 1:19.5 to 1:40, beside the three panels. |
| S8 upright D | **PASS** | The D/Dt is upright in s13 (4:50, 5:02.5), s16 (6:06) and s18 (6:58). |
| S9 sled | **PASS** | d is labelled "distance pulled". The sled still does not move, but the label now explains the arrow. |
| S10 title symbols | **PASS** | Titles use plain text at title size: "the unit vector b̂" (2:17), "by \|b\|?" (2:47), "∇T: the temperature gradient", "Advection: v·∇T = shadow × steepness". Nothing crosses the band edge. |
| S11 storyboard | **PASS** | The storyboard has `as_built:` notes in s05, s09, s11, s13, s16, s18, s19 and s22, and they match the frames. |

### Regression sweep: PASS
- No references, badges or footnotes appear in any new frame.
- The caption band (y 821–950) is empty in every frame.
- No new overlaps.
- Physics values are unchanged: 12.82, 12.64 and 12.46 °C; 0.180 and 0.360 K per hour; the pole reads 10.84 °C at 6 h
  in s20.

### New finding (optional)
- **S12 (s16, 6:16.4–6:17.3).** The components check chip fades in at the very end of sentence 4. It is fully visible
  for only about 0.3 s before the cut to s17 (crops `c_s16chip.png` at 6:16.4 and `c_s16chip_377.png` at 6:17.0).
  Reveal it with "the metres cancel", or hold the scene about 1 s. This does not block `qa_pass`.

### Publish condition
- **P1 is still open.** `notebooks/poc_ch00a_dot.html` is not on `origin/main` (the local branch is 12 commits ahead), so
  the end card's notebook link returns 404 until it is pushed.

### Verdict: PASS → `qa_pass`
Both Musts are fixed, S1–S11 are applied, and no regressions appeared. The user's round-2 items (G1–G5 and U-M2.1–17)
all pass now. The movie can become `qa_pass` for the user to watch. Push P1 before `/approve-movie`.

Disk at re-review: C: 83 GB free, G: 588 GB free. Review scratch on G: `review4_v4` 64 MB + `review4b_v4fix1` 34 MB (both deletable).

## Overall: PASS (ch00_dot_product_why review 4b — `qa_pass`; P1 before publishing; S12 optional)

## ch00_dot_product_why (review 5 — version 5, commit cc1d979, 2026-10-24)

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_dot_product_why v5 | 733.78 s (12:13.8) | 39.58 MB | 10/10 PASS | PASS (43 hashes; every number re-checked) | PASS (KaTeX clean; plain (1) only) | FIX (systematic label/tick collisions; small text at 390 px) | PASS (reveals land on their sentences) | PASS (177 cues, ≤ 2 × 42, max 15.9 cps, text = script) | PASS (plasma-type map, hatched negative bars, 0 flashes) | PASS (none, per U-M2.G2) | **FIX** |

**How I reviewed it.** I extracted 242 frames with ffmpeg from `1080.mp4`: one 0.1 s before every sentence end, one at
every sentence midpoint (114 sentences × 2), plus extra frames at scene cuts and the |a| underbrace. They are in
`G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_dot_product_why/review5_v5/` (62 MB), with 390-px copies in
`p390/` and tiles in `tiles/`. I looked at every frame at phone size (390 px) and at about 40 of them at full size.
The VTT was checked against the script and timing.json. Every number on screen was recomputed: |a| = 5.099, |b| = 3.162,
θ = 60.26°, cos θ = 0.496, 8/3.162 = 2.530, 8/5.099 = 1.569, b̂ = (0.316, 0.949), 20 cos 60° = 10 N, 17.3 N,
10 sin 60° = 8.66 m/s, 5 × 10⁻⁵ K/s × 3600 = 0.18 K/h, 18 km, 12.82 / 12.64 / 12.46 °C, 0.36 K/h and 12.64 °C after 1 h.
The geometry was measured in pixels: the upwind dots, the balloon on the 13 °C isotherm at 1 h and 3 h, and the isotherm
shift of 54 km at 3 h. All of them agree with the physics.

### U-M3 acceptance table

| Item | Result | Evidence (movie time) |
|---|---|---|
| G1 no headings, kickers, counters or PartCards | **PASS** | None in any frame. The only title-like words are the keyword "Pythagoras" (0:28–0:31) and "a·b = b·a" (3:52). Both are acceptable. |
| G2 keywords, not sentences; no boxes except the s03 tags | **FAIL (partial)** | The text is keywords throughout and the s03 tags are kept (1:04–1:16). But there are unexplained filled rectangles in s05 (1:59–2:33, grey and hatched), s08 (3:30), s09 (3:52), s11 (4:51–5:09) and s16b (8:04–8:23, on the temperature map). There is also an unlabelled gradient block in s01 (0:05–0:09). See M3 and S1. |
| G3 natural, unhurried narration | **PASS (with S12)** | 147.9 wpm overall. The bridges are natural ("Now let's look at how the angle…", "Now let's look at how the dot product is used in weather."). Four short spots still sound clipped (S12). |
| G4 no "1 grid square" | **PASS** | Not in any frame and not spoken. |
| G5 advection, uphill, local rate | **PASS** | "local rate" 5:17; advection defined 6:08–6:17; "the way the temperature increases fastest" 7:28. |
| G6 no links or paths | **PASS** | The end card (11:48–12:14) has no URL, path or book name. |
| U-M3.1 natural opening, no agenda box | **PASS** | 0:00 "What is the dot product?" with a and b only. |
| U-M3.2 "vector" without a box | **PASS** | 0:09–0:12: large "vector" with "length" and "direction" pointers. |
| U-M3.3 a = (5, 1) + "components" pointers | **PASS** | 0:19–0:27, two gold pointers to each pair. |
| U-M3.4 Pythagoras kept; \|a\| note without a box | **PASS** | 0:28–0:31: underbrace "length of a", which fades. Spacing is uneven after the fade (S9). |
| U-M3.5 3-D remark, then strike a₃b₃ | **PASS** | x, y, z under the terms at 0:47. The strike lands on "drops out" at 0:56. |
| U-M3.6 a, b under the picture; no grid note | **PASS** | a = (5, 1) and b = (1, 3) stay under the picture from 0:28 to 3:30. |
| U-M3.7 tags kept; "scalar" sentence | **PASS** | Tags 1:00–1:16. "scalar" and "scalar product" point to 8 (1:10–1:16). |
| U-M3.8 natural transition, no counter | **PASS** | 1:17. |
| U-M3.9 √(5² + 1²) = √26 = 5.099 and √(1² + 3²) = √10 = 3.162 in s04 | **FAIL** | 1:38–1:44 shows only "\|a\| = √26 = 5.099" and "\|b\| = √10 = 3.162", without the squares. By 1:46 the \|a\| line is gone, so "5.099 × 3.162 × 0.496 ≈ 8" (1:46–1:49) has lost the line its 5.099 comes from. See M4. |
| U-M3.10 user wording; p's components; three full cases | **PASS (with S12)** | 1:49–2:32: 3×2 + 0×0 = 6 positive; 3×0 + 0×2 = 0 right angle; 3×(−2) + 0×0 = −6 negative. The closing sentence is kept. |
| U-M3.11 q labels at the q tips | **PASS / M6** | The labels sit at the tips. But in panel 1 (1:59–2:33) q is drawn under p, and only its arrowhead shows. |
| U-M3.12 work: F, d vectors; 50 J → 100 J; the shadow alone is not the work | **PASS** | 4:28–5:09: "force" / "displacement" pointers, 10 N × 5 m = 50 J, 10 m → 100 J, "× 2 → × 2", underbraced W = (\|F\| cos θ)\|d\|. The sled never moves (S11). |
| U-M3.13 weather transition, two thermometers | **PASS** | 5:09–5:44, including "Partial means only time changes; the place stays fixed." |
| U-M3.14 say what the equation is; define advection; material ≠ partial | **PASS** | 5:44–6:36. Underbraces "following the parcel", "one fixed place" and "advection"; "carried by the flow" 6:08; "material derivative" 6:18. |
| U-M3.15 no leaked box in s13 | **PASS** | 5:45.3 and 5:45.8 are clean. Nothing leaks during s13. |
| U-M3.16 map in words first, then isotherms | **PASS** | No lines at 6:45.8. Lines draw at 6:46–6:50, then "isotherm" at 6:54. The ∂T/∂x and ∂T/∂y walker is kept (6:57–7:12). |
| U-M3.17 no "uphill" | **PASS** | 7:28 "towards warmer". |
| U-M3.18 meaning of 0.18 K/h; 8.66 = 10 sin 60° | **PASS** | 7:53–8:03: "10 × sin 60° = 8.66", "along: no change", "8.66 × 0 = 0". The 0.18 K/h chain is at 8:04–8:23, and its meaning (rate in time vs rate in space, the pole, upwind) at 8:23–8:56. |
| U-M3.19a snapshot; the pattern slides | **PASS (with S5)** | Snapshot corners and "t = 0 h" 8:32. "the pattern slides" 9:14. But the slide in s18 is only 18 km ≈ 26 px (≈ 5 px at 390 px). The slide is clear only in s19a (54 km at 3 h, 9:37). |
| U-M3.19b colder air from upwind | **PASS** | 8:37–8:43 "upwind" / "colder side"; 9:37 "colder air from upwind". |
| U-M3.19c pole falls, balloon stays 13 °C | **PASS** | 9:25–9:46 on one clock: 13.00 → 12.82 → 12.64 → 12.46 °C for the pole, 13.00 °C for the balloon. No thermometer is ever said to warm. |
| U-M3.20 DT/Dt = 0 ⇒ ∂T/∂t = −v·∇T; +0.18 / −0.18 cancel | **FAIL (partial)** | The derivation (9:49–10:00) and the balance bars (10:23–10:40, "0 = −0.18 + 0.18") are good. But in s19b (10:00–10:14) "+0.18 K/h →" floats under the stack with an arrow pointing at nothing, and "= −0.18 K per hour" has no left side. The sign step the user asked to make "much clearer" is the least clear frame. See M1. |
| U-M3.21 twice as steep, concretely | **PASS** | 10:40–11:12: "1 °C per 50 km", "× 2", "5.00 m/s same", the 1.00 × 10⁻⁴ K/s × 3600 = 0.36 K per hour chain, "twice as fast", and the pole at 12.64 °C after 1 h. |
| U-M3.22 recap signs spelled out | **PASS** | 11:25–11:35: "+ same way", "0 right angle", "− opposite", one beat per sentence. |
| U-M3.23 end card in words | **PASS** | 11:48–12:14. |
| U-M3.24 series wording; no thanks; no book | **PASS** | "a series of maths tutorials" and "atmospheric science · meteorology · fluid dynamics". The dot-product notebook and the other notebooks are mentioned in words only. No lab, no book. |
| Decisions: ~12 min, keep b̂, one movie | **PASS** | 12:13.8; b̂ at 3:04–3:30; one movie. |
| Rounds 1–2 rules | **PASS** | Equations carry only the plain label "(1)" (U-M2.5). No book or author names, footnotes or "not to scale". "air parcel" is used throughout, and the movie says "point in opposite directions" (1:29) and "pointing in the opposite direction" (2:18). |

**Background #171f33.** It looks fine. The navy reads as deliberate, the text contrast is good, and I saw no banding.
The only side effect is that the dark (4 °C) end of the colour bar merges into the background. That is harmless.

**Listen-proxy (VTT = script, QA verified).** Most of the narration now reads as natural speech. Four sentences still
sound clipped or label-like (S12). I found no physics wording problems: the movie says "at sixty degrees to grad T", the
pole cools, the balloon stays at 13 °C, advection is defined before it is used, and the cold air comes from upwind.

### Must-fix
- **M1 (s19b, 10:00.6–10:14.7): the sign step.** "+0.18 K/h →" sits under the equations with an arrow to nothing, and
  the next line, "= −0.18 K per hour", has no left side.
  - Fix: on the line ∂T/∂t = −v·∇T, put the underbrace "+0.18 K/h" under v·∇T. Then write the full result line
    "∂T/∂t = −0.18 K per hour" in rose, under ∂T/∂t. Delete the dangling arrow.
  - Reveal "+0.18" on "plus point one eight kelvin per hour" (10:03) and "−0.18" on "The minus sign makes it a fall"
    (10:08).
- **M2 (s19c, 10:23–10:40): builder-flagged collision.** The ghost label "13.18 °C, an hour ago" runs past the map's
  right edge (x ≈ 1048) into the colour-bar column, directly above "20".
  - Fix: anchor the label's right end at x ≤ 980, inside the map, or place it on the left of the dashed line at
    y ≈ 170.
- **M3 (s16b, 8:04–8:23; s05, 1:59–2:33): unexplained filled rectangles.** This is the same kind of problem as the
  shaded area the user asked about in U-M2.16, and it breaks U-M3.G2.
  - s16b: a white-outlined, filled rectangle sits on the temperature map under ∇T, at about 300–390 km × 50–180 km. It
    reads like a region of the map.
  - s05: a grey box (panel 1) and a hatched rose box (panel 3) hang under p, and neither is narrated.
  - Fix: remove the s16b and s05 rectangles. If the area picture is kept in s08, s09 and s11, see S10.
- **M4 (s04, 1:38–1:49): U-M3.9 is not met.**
  - Show "\|a\| = √(5² + 1²) = √26 = 5.099" and "\|b\| = √(1² + 3²) = √10 = 3.162".
  - Keep both lines on screen until "≈ 8" (the \|a\| line disappears at about 1:46 today). Make room by putting
    "θ = 60.3°, cos θ = 0.496" on one line, or by moving the cos-scale out after 1:38.
- **M5 (s06, s12, s15–s19b): systematic label collisions.** Pointer curves and labels cut through axis tick labels or
  cover numbers:
  - "air parcel" pointer over "500" (5:38–5:44);
  - "towards warmer" pointer over "500" (7:28–7:36);
  - "along: no change" pointer over "200" (7:53–8:04);
  - "36 km along the wind" pointer over "200" (8:44–8:56);
  - snapshot corner brackets through "360" and "0" (8:33–8:56);
  - the "each parcel keeps its T" arrowhead covers the parcel tag, so "13.0" reads "1?.0" (9:00–9:21);
  - "colder air from upwind" pointer over "200" (9:37–9:46);
  - the "colder air carried in" arrowhead covers the "1" of "12.46 °C" (10:08–10:14);
  - "\|a\| = 5.099" sits on the x-axis line (2:47–3:04).

  Fix: end every pointer at least 8 px short of its target. Route the curves between ticks, or anchor the keyword
  inside the map so the curve never crosses the tick row. Inset the snapshot corners 12 px. Move the \|a\| label below
  the axis.
- **M6 (s05, 1:59–2:33): q is invisible in the "same way" picture.** In panel 1 the orange q lies under the teal p, and
  only its arrowhead peeks out.
  - Fix: draw q on top, offset 12 px above p (or draw p as an outline). Keep the tip label "q = (2, 0)".

### Should-fix
- **S1 (s01, 0:05–0:09): gradient block.** The "map thumbnail" is an unlabelled purple-to-orange block. Add two isotherm
  lines and a wind arrow so it reads as a weather map, or drop it.
- **S2 (s10 4:23; s15–s20): units.** The screen uses m s⁻¹, K m⁻¹ and K s⁻¹, while the labels and the voice use m/s
  and K per hour (the storyboard for s16b specifies (m/s)(K/m)). Use slash units everywhere for this audience.
- **S3 (s12–s20): no axis unit.** The map axes (0–600, 0–360) never say km. Add "km" to the last tick, or an axis title.
- **S4 (s12, 5:29–5:44): pole inside the parcel.** The pole thermometer sits inside the balloon's dashed "air parcel"
  ellipse. The clock "t = 1.5 h" is never mentioned. Offset the ellipse from the pole, and drop the clock.
- **S5 (s18, 9:01–9:21): the slide is too small.** The isotherms slide 18 km (about 26 px, about 5 px on a phone), and
  the clock freezes at 1.0 h from about 9:11. Run s18 to 3 h, or brighten the 13 °C isotherm and leave a ghost at its
  t = 0 position so the slide can be seen.
- **S6 (cut s18 → s19a, 9:21.6): clock reset.** The clock jumps back from 1.0 h to 0.0 h, and the balloon reappears on
  top of the pole thermometer, so the two icons merge. Either add "Let's start the clock again" to the first s19a
  sentence or continue from the s18 state. Offset the balloon from the pole at t = 0.
- **S7 (s17, 8:44–8:56; s19c, 10:23–10:40): "18 km across".** The bracket is about 26 px wide, and the label sits
  40–300 px to its right, so it seems to describe the right half of the map. Put the label beside the bracket with a
  short pointer.
- **S8 (s15–s20): weak map labels.** The "∇T" label on the map has a heavy dark stroke that smudges the glyphs. In s20
  (10:56–11:12) "5.00 m/s" is muted teal on pink and hard to read. Use a clean fill with a thin outline.
- **S9 (s02 0:33–0:36; s06 3:00–3:04): spacing.** In s02 the \|b\| block crowds right under "= √26 = 5.099", while the
  faded underbrace leaves a gap above. In s06 the gold underline touches the "3.162" denominator. Even out the spacing.
- **S10 (s08 3:30–3:40; s09 3:52–3:58; s11 4:51–5:09): the area picture.** The rectangles are never mentioned. Add one
  clause in s08: "…the shadow times the length of b, which is the area of this rectangle." Otherwise remove them. The
  s09 rectangles also spill outside the grids, and the panel-2 rectangle nearly touches "a·b = b·a".
- **S11 (s11, 4:28–5:09): the sled never moves**, while the voice says "while it moves along a displacement vector, d".
  Slide it along d (5 m, then 10 m).
- **S12: four clipped sentences.** I would replace them as follows.
  - s05 2:00 / 2:08 / 2:18: "First, q is two, zero, …" → "First, q has components two and zero, so it points the same
    way as p: …". Use the same pattern for (0, 2) and (−2, 0).
  - s15 7:19: "…ten to the minus five kelvin per metre, and zero." → "…ten to the minus five kelvin per metre going east,
    and zero going north."
  - s19c 10:18–10:35: "…that's the advection term, plus point one eight. But … cooled by point one eight: the local rate,
    minus point one eight." → "That gain of point one eight is the advection term. But in that hour every place has
    cooled by point one eight degrees, and that fall is the local rate."
  - s20 11:08: "As with the sled, the shadow alone missed the change." → "Just as with the sled, the shadow stayed the
    same, so on its own it would miss this change. Multiplying by the length of grad T catches it."
- **S13 (390-px legibility).** These elements render at about 5–7 px on a 390-px-wide phone, below the 44-px floor at
  1080p:
  - the underbrace labels "length of b" (3:30) and "length of ∇T" (8:04);
  - the s05 calculation lines;
  - "1 K step = 1 °C step" (7:21);
  - the s21 recap strip labels (11:12–11:48);
  - the map tick labels.

  Raise them to the floor, or drop the strip labels and let the icons carry them.
- **S14 (s16a, 7:52–8:04): wind components hidden.** The 5 m/s "across" part lies under the orange ∇T arrow. The
  8.66 m/s "along" part is a grey dashed line on top of the white 13 °C isotherm. Draw each part as its own arrow,
  offset from ∇T and from the isotherm.
- **S15 (s13, 6:30–6:36): icon and keyword.** The pole icon's stem overlaps the ∂ glyph. The keyword "dot product" has
  no pointer to the dot in v·∇T.
- **S16 (s05, 2:18–2:33): panel 3 labels.** "q = (−2, 0)" reaches left into the gap between panels 2 and 3, and
  "opposite" floats unattached. Place the label just left of the q tip, and put "opposite" under the 180° arc.
- **S17 (s03, 1:10–1:16): crowding.** The "scalar" keyword and its gold curve crowd the "= 5 + 3 = 8" line. Move them
  down about 30 px.

### Verdict: FIX
Physics, numbers, captions, pacing and the round-1 and round-2 rules all pass. The user's round-3 items pass, except
three:
- U-M3.9: the √ working is incomplete, and the \|a\| line vanishes before the product (M4).
- U-M3.20: the s19b sign step is unclear (M1).
- U-M3.G2: there are unexplained filled boxes (M3).

There is also one confirmed label collision near the colour bar (M2), a pattern of pointer and tick-label collisions
(M5), and an invisible q in s05 (M6). All six Musts are layout or text changes. None of them needs new narration audio
except the optional S12 rewrites, which would change timing.json for s05, s15, s19c and s20. After M1–M6, the movie
should pass at re-review.

Disk at review: C: 77 GB free, G: 587 GB free. Review scratch on G: `review5_v5` 62 MB (deletable).

## Overall: FIX (ch00_dot_product_why review 5 — M1–M6; S1–S17 recommended)

## ch00_dot_product_why (review 5b — version 5 fix loop 1, commit 14b658c, 2026-10-24)

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_dot_product_why v5 fix 1 | 751.81 s (12:31.8) | 40.36 MB | 10/10 PASS | FIX (one misleading label, N1); all numbers correct | PASS (KaTeX clean; plain (1) only) | PASS (only minor collisions left) | PASS (one early reveal, N3) | PASS (182 cues, ≤ 2 × 42, max 15.93 cps, text = script) | PASS (0 flashes; hatched negative bar) | PASS (none, per U-M2.G2) | **FIX** |

**How I reviewed it.** I extracted 232 frames with ffmpeg from `movies/out/ch00/ch00_dot_product_why/1080.mp4` (md5
9a2fee9f…): one 0.15 s before every sentence end and one at every sentence midpoint (116 sentences, times from
`timing.json`). I added runs every 1–2 s through s11 (sled), s19a (clock) and s19b (sign step), and crops of every
pointer that M5 listed. The frames are in `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_dot_product_why/review5b/`
(59 MB), with 390-px copies in `p390/` and 12-up phone tiles in `tiles/`. I looked at all 116 sentence-end frames at
390 px and about 40 frames or crops at full size.

I checked the VTT against the limits: 182 cues, none out of order, at most 2 lines, longest line 42 characters, peak
15.93 cps, last cue ending at 749.0 s, inside the audio. It contains no forbidden words (book or author names, URL,
"not to scale", "bit of air", "uphill", "thanks for watching").

I re-checked the numbers on screen:
- The s18 parcel tags match T = 10 + x/100 at their positions.
- The parcels move 26 px east and 45 px north per hour, which is 18 km across and 31 km along at 60°.
- The s19a balloon moves 80 px east in 3 h (54 km) and stays on the 13 °C isotherm.
- The pole reads 13.00 → 12.82 → 12.64 → 12.46 °C.
- The other values: 0.36 K/h, 12.64 °C at 1 h in s20, 10 cos 60° = 5, 10 sin 60° = 8.66.

### Review 5 fixes: did they land?

| Item | Fixed? | Evidence (new times) |
|---|---|---|
| M1 s19b sign step | **Yes (residual N3)** | 10:11–10:20: an underbrace "+0.18 K/h" sits under v·∇T, the dangling arrow is gone, and the full rose line "∂T/∂t = −0.18 K per hour" is underlined in gold. The "+0.18" text appears at about 10:00.5, which is 11 s before it is spoken (N3). |
| M2 "13.18 °C, an hour ago" off the map | **Yes** | 10:24–10:52: the label is inside the map at the top left (x 130–570), clear of the colour bar. |
| M3 unexplained rectangles (s16b, s05) | **Yes** | s05 (1:59–2:37) and s16b (8:09–8:29) have no boxes. |
| M4 √ working, kept until ≈ 8 | **Yes** | 1:38–1:49: "\|a\| = √(5² + 1²) = √26 = 5.099" and "\|b\| = √(1² + 3²) = √10 = 3.162" stay on screen through "5.099 × 3.162 × 0.496 ≈ 8". |
| M5 pointer and tick collisions | **Yes (all 9 cases)** | "air parcel" 5:33 is now in the map; "towards warmer" 7:34 is in the map; "along: no change" 7:59 is in the map; the snapshot corners 8:38 are inset; the "each parcel" arrowhead stops short of "10.4" (9:02); "colder air from upwind" 9:44 runs between the 200 and 300 ticks; "colder air carried in" 10:15 ends at the bulb; \|a\| = 5.099 is below the axis (2:51). One new pointer collapsed (N2). |
| M6 q hidden under p | **Yes** | 2:00–2:37: q = (2, 0) is drawn above p. |
| S1 gradient block | Yes | 0:03–0:08: stripes (isotherms) and an arrow on the thumbnail. |
| S2 slash units | Yes | 7:23 "1.00 × 10⁻⁵ K/m"; s16b "K/m", "K/s", "(m/s) × (K/m) = K/s". |
| S3 km on axes | Yes | "km" above 360 and "600 km". |
| S4 pole inside the parcel; t = 1.5 h | Yes | 5:33: the ellipse is offset to (350–400 km, 50–180 km) and there is no clock. |
| S5 slide too small | Yes | 9:13–9:26: a ghost dashed line stays at t = 0, the bright 13 °C isotherm moves to 318 km, and "east, 18 km per hour" is shown. |
| S6 clock reset | Yes | 9:27 "Now let's start the clock again…". The balloon is offset from the pole, but that created N1. |
| S7 "18 km across" far from its bracket | Yes | 8:49 and 10:24: the label is attached to the bracket. |
| S8 ∇T stroke; "5.00 m/s" on pink | Yes | Clean ∇T glyph; white "5.00 m/s" with an outline (10:52–11:30). |
| S9 spacing | Yes | 0:28–0:36: even spacing. 3:04: the gold underline sits 25 px below "3.162". |
| S10 area rectangles s08, s09, s11 | Yes (removed) | 3:34–5:13: no rectangles. |
| S11 sled never moves | Yes | 4:49–5:13: a ghost sled at 5 m, then the sled at 10 m. |
| S12 four clipped sentences | Yes | All seven rewrites are in the VTT and read naturally. |
| S13 small text at 390 px | Mostly | The recap strip labels are dropped. The underbrace labels are now about 44 px. "N = newton", "J = joule" (4:33–4:56) and "idealised map" (5:13–5:21) are about 34–40 px, which is under the floor (N7). |
| S14 wind parts hidden | Yes | 7:58: a white vertical 8.66 m/s arrow and a teal 5 m/s arrow, both offset from ∇T. |
| S15 icon on ∂; no pointer to the dot | Yes | 6:34: the icons sit above the fractions, and "dot product" points to the dot. |
| S16 panel-3 labels | Mostly | "opposite" is under the arrow pair, not under the arc. "q = (−2, 0)" starts about 65 px left of the panel 3 grid. This is acceptable. |
| S17 "scalar" crowding | Yes | 1:10: the keyword is 50 px below "= 5 + 3 = 8". |

### U-M3 acceptance (re-checked on the new render)

| Item | Result | Evidence |
|---|---|---|
| G1 no headings or counters | PASS | none in any frame |
| G2 keywords only, no boxes except the s03 tags | PASS | The boxes from review 5 are gone. The tags are kept (1:00–1:16). The s06 triangle fill is narrated ("In this right triangle", 2:51). |
| G3 natural narration | PASS | 148.1 wpm overall. The S12 rewrites remove the clipped spots. No sentence sounds robotic. The only long one is s19a 9:31 (12 s, a list of four readings), which is acceptable because it lands on the clock. |
| G4 no grid note | PASS | — |
| G5 advection, local rate, no "uphill" | PASS | 5:21, 6:12, 7:34 |
| G6 no links or paths | PASS | 12:06–12:31 |
| U-M3.1 – 3.8 | PASS | 0:00–1:22 (as in review 5) |
| U-M3.9 √ working | **PASS** | 1:38–1:49 (M4) |
| U-M3.10 / 3.11 three cases, labels at the tips | PASS | 1:49–2:37 |
| U-M3.12 work | PASS | 4:28–5:13, and the sled now moves |
| U-M3.13 – 3.18 | PASS | 5:13–8:29 |
| U-M3.19a snapshot and slide | PASS | 8:38 snapshot; 9:13–9:26 visible slide with ghost |
| U-M3.19b colder air from upwind | PASS | 8:42, 9:44 |
| U-M3.19c pole falls, balloon stays 13 °C | **FAIL (visual)** | The readouts are right: pole 13.00 → 12.46, balloon 13.00, "stays 13 °C". But from 9:27 to about 9:39 the upwind-dot label "12.64" sits right beside the balloon, so the balloon appears to read 12.64 (N1). |
| U-M3.20 DT/Dt = 0 ⇒ ∂T/∂t = −v·∇T; cancel | PASS (N3 minor) | 9:56–10:52 |
| U-M3.21 twice as steep | PASS | 10:52–11:30 |
| U-M3.22 recap signs | PASS | 11:43–11:53 |
| U-M3.23 / 3.24 ending | PASS | 12:06–12:31: no book, no lab, no URL, no thanks |
| Decisions (~12 min, b̂, one movie) | PASS | 12:31.8 |
| Rounds 1–2 rules | PASS | Only the plain "(1)" label; "air parcel"; "point in opposite directions" (1:29); "pointing in the opposite direction" (2:22). |

### Must-fix
- **N1 (s19a, 9:27.2–≈9:39): "12.64" beside the balloon.** This is a regression from the S6 fix.
  - The 2-hour upwind dot sits at about (507, 495), but its label "12.64" is drawn to the right of the balloon, at about
    (600–730, 440–505). For 12 s the balloon seems to read 12.64 °C, while the voice says the balloon stays at 13. That
    is exactly the who-warms, who-cools confusion behind U-M3.19c.
  - Fix: place the 2-hour label on the left of its dot, like the 12.82 and 12.46 labels (right end at x ≤ 490,
    y ≈ 495). Or drop the middle label, since the bottom-left chain already shows 12.64. Keep at least 60 px between
    any number and the balloon icon.

### Should-fix
- **N2 (s17, 8:49–8:58): collapsed pointer.** The "36 km along the wind" pointer has shrunk to a lone yellow "<"
  chevron at about (580, 435), with no curve. Either draw a 60–80 px curve from the label to the midpoint of the dashed
  upwind track, or delete the chevron.
- **N3 (s19b, 10:00.5–10:11.5): early reveal.** "+0.18 K/h" appears with the line ∂T/∂t = −v·∇T, 11 s before it is
  spoken and before its underbrace. Reveal the number together with the brace, on "so v dot grad T is plus point one
  eight" (≈ 10:10).
- **N4 (s18, 9:13–9:26): balloon over a parcel.** The balloon overlaps the "13.1" parcel circle. The bright sliding
  13 °C isotherm also runs through the "13.1" and "13.0" tags. Offset the balloon 30 px left of the parcel, and keep the
  tags clear of the isotherm, or let the outline hide the line.
- **N5 (s12, 5:33–5:48): "air parcel" label at the edges.** The label sits on the map's bottom border, and its right
  end (x ≈ 990) touches the colour-bar column next to "4". Move it up 30 px and left 40 px.
- **N6 (s11, 4:42–4:56): label crossed by a line.** The dashed vertical line of the 17.3 N part crosses "d = 5 m",
  through the "=". Move "d = 5 m" to the right of x = 540, or under the arrow.
- **N7: text under the 44-px floor.** These labels are about 34–40 px high:
  - "N = newton" and "J = joule" (4:33–4:56);
  - "idealised map" (5:13–5:21);
  - the s10 "no angle / no √" (4:02–4:09).

  Raise them to 44 px.
- **N8 (s19c, 10:24–10:33): empty axis.** An empty bar axis (a line with a tick) sits alone for about 8 s before the
  bars arrive. Fade it in together with the "+0.18" bar.
- **N9 (s16a, 7:41–8:09): balloon far from its isotherm.** The balloon icon sits at about 80 km east, near the bottom
  (about 10.8 °C), yet later it is the 13 °C balloon. Place it on the 13 °C isotherm, or hide it until s18.

### Verdict: FIX
The fix loop landed:
- all six Musts M1–M6 are fixed (M1 with a small timing residual);
- 15 of the 17 Shoulds are fully fixed, and the other two (S13, S16) are mostly fixed.

Captions, QA (10/10), numbers and narration all pass.

One new Must comes from the S6 rearrangement. In s19a, the upwind label "12.64" sits next to the balloon for 12 s
(N1), which undercuts U-M3.19c. It is a one-line layout change (no audio, no timing change).

After N1, the movie can become `qa_pass` without another full review: a spot-check of 9:25–9:45 is enough. N2–N9 are
optional polish.

Disk at review: C: 76 GB free, G: 587 GB free. Review scratch `review5b` 59 MB (deletable).

## Overall: FIX (ch00_dot_product_why review 5b — N1 only; N2–N9 optional)

## ch00_dot_product_why (review 5c — version 5 fix loop 2, commit deb750f, 2026-10-25)

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_dot_product_why v5 fix 2 | 751.81 s (12:31.8) | 40.35 MB | 10/10 PASS | PASS (N1 gone; every number checked) | PASS (KaTeX clean; plain (1) only) | PASS (two small collisions, Should-fix) | PASS (N3 fixed) | PASS (182 cues, ≤ 2 × 42, max 15.93 cps, text = script) | PASS (0 flashes; hatched negative bar) | PASS (none, per U-M2.G2) | **PASS** |

**How I reviewed it.** The render has md5 b095a441…. I re-ran the qa.json gates and all 10 pass:
- duration 751.81 s;
- size 40.35 MB;
- codec: H.264 High, yuv420p, AAC, faststart;
- 0 black stretches;
- 82 frozen stretches, all narrated (longest silence 2.81 s);
- loudness −16.0 LUFS, peak −3.6 dBTP;
- 0 flashes;
- captions: 182 cues match the script;
- physics: 43 functions reproduce their hashes;
- equations: 55 present.

I extracted 380 frames with ffmpeg from `movies/out/ch00/ch00_dot_product_why/1080.mp4`:
- one at the midpoint of every sentence and one 0.15 s before its end (116 sentences, times from `timing.json`);
- one every 2 s through 4:00–5:50 and 7:40–10:45;
- a crop strip every 0.3–0.5 s through 9:24–9:28.

The frames are in `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_dot_product_why/review5c/` (99 MB, deletable). The folder also has 390-px copies in `p390/`, 32 phone tiles (12 frames each) in `tiles/` and crops in `extra/`. I looked at every tile at 390 px and at about 25 frames at full size.

I re-checked the VTT: 182 cues, longest line 42 characters, peak 15.93 cps. It contains no "Vallis", "Kundu", URL, "lab", "not to scale", "bit of air", "uphill" or "thanks for watching". Narration and timing are unchanged from fix loop 1.

**Numbers on screen.** All of them are right:
- **Pole:** 13.00 → 12.82 → 12.64 → 12.46 °C, in the readout and in the chain at the bottom (9:31–9:52). The readout passes through 12.89 at 0.6 h, 12.72 at 1.5 h and 12.55 at 2.5 h, which is linear at −0.18 K/h.
- **Balloon:** 13.00 °C throughout.
  - It moves 80 px east (54 km) and 135 px north (92 km ≈ 8.66 m/s × 3 h) in 3 h, and it stays on the 13 °C isotherm. That isotherm moves from 300 km to 354 km.
  - At 3 h the pole sits 54 km upwind of 13 °C, so it reads 13 − 0.54 = 12.46 °C.
- **Other values:** 0.36 K/h and 12.64 °C at 1 h in s20; 10 cos 60° = 5.00; 10 sin 60° = 8.66; 5 m/s × 3600 s = 18 km; 18 km × 1 °C/100 km = 0.18 °C; 36 km along the wind = 10 m/s × 1 h.

### N1–N9 (review 5b): did they land?

| Item | Fixed? | Evidence (times in this render) |
|---|---|---|
| **N1** (Must) "12.64" beside the balloon, s19a | **Yes** | 9:27.2–9:52: all three upwind labels sit to the left of their dots: "12.82" (x 370–510), "12.64" (x 345–485) and "12.46 °C" (x 250–455). At 9:30 the balloon is at x ≈ 560, so its nearest number is about 100 px away. At 9:38 "12.46 °C" ends at x ≈ 497 and the balloon is at x ≈ 600. From 9:42 to 9:52 the only label left is "12.46 °C", at the pole's foot, to the left. Nothing but its own "13.00 °C" readout (right panel) and "stays 13 °C" sits beside the balloon. |
| N2 collapsed pointer, s17 | Yes (chevron removed) | 8:50–9:00: the stray "<" chevron is gone. "36 km along the wind" stands as a free label to the right of the pole (x 595–975, y 455–560). It is next to the wind arrow rather than the dashed upwind track, which is acceptable (S2 below is optional). |
| N3 early "+0.18", s19b | Yes | 10:00–10:11: only ∂T/∂t = −v·∇T is shown. The underbrace and "+0.18 K/h" appear together between 10:10.7 and 10:12, on "is plus point one eight" (10:07.2–10:14.2). |
| N4 balloon over a parcel, s18 | Yes (mostly) | 9:08–9:26: the balloon sits on the bright 13 °C isotherm (x ≈ 587 at 1 h), between the "13.1" and "13.0" tags, and overlaps no parcel circle. The bright line still passes behind the "13.1", "13.0" and "13.1" tags, but their dark outline keeps them readable. A new "18 km" label now sits beside the balloon (S1). |
| N5 "air parcel" at the edges, s12 | Yes | 5:38–5:48: the label is inside the map (x 715–950, y 595–645), clear of the bottom border and 60 px left of the colour bar. |
| N6 "d = 5 m" crossed by a line, s11 | Yes | 4:41–5:00: the dashed 17.3 N line is at x ≈ 519, and "d = 5 m" starts at x ≈ 550. |
| N7 text under 44 px | Yes | "N = newton" (4:36) and "J = joule" (4:54) have a cap height of about 50 px, "idealised map" (5:14) about 55 px, and "no angle / no √" (4:02–4:10) about 50 px. |
| N8 empty bar axis, s19c | Yes | 10:22–10:37: no axis. The axis fades in with the "+0.18 / advection term" bar at about 10:38. |
| N9 balloon far from its isotherm, s16a | Yes | 7:42–8:09: the balloon is at x ≈ 560 (300 km), on the 13 °C isotherm, just above the wind and ∇T arrows. |

All nine are fixed.

### U-M3 acceptance (re-checked on this render)

| Item | Result | Evidence |
|---|---|---|
| G1 no headings or counters | PASS | none in any of 380 frames |
| G2 keywords only, no boxes except the s03 tags | PASS | 1:00–1:16 tags kept; elsewhere keywords and pointers only |
| G3 natural narration | PASS | unchanged from 5b (148 wpm) |
| G4 no grid note | PASS | — |
| G5 advection, local rate, no "uphill" | PASS | 5:21 local rate; 6:12–6:21 "carried by the flow"; 7:33 "towards warmer" |
| G6 no links or paths | PASS | 12:06–12:31 shows words and icons only |
| U-M3.1 – 3.8 | PASS | 0:00–1:22 |
| U-M3.9 √ working | PASS | 1:38–1:49 |
| U-M3.10 / 3.11 three cases, labels at the tips | PASS | 1:52–2:37 |
| U-M3.12 work (50 J, doubled to 100 J, shadow alone is not the work) | PASS | 4:28–5:13 |
| U-M3.13 – 3.18 | PASS | 5:13–8:29 |
| U-M3.19a snapshot and slide | PASS | 8:40 snapshot corners; 9:13–9:26 ghost and slid isotherm, "east, 18 km per hour" |
| U-M3.19b colder air from upwind | PASS | 8:44–9:00 "upwind" and "colder side"; 9:44 "colder air from upwind" |
| **U-M3.19c pole falls, balloon stays 13 °C** | **PASS** | 9:27–9:52: the balloon reads 13.00 °C and no other temperature sits beside it. The pole reads 13.00 → 12.82 → 12.64 → 12.46 °C, and "stays 13 °C" appears at 9:52. |
| U-M3.20 DT/Dt = 0 ⇒ ∂T/∂t = −v·∇T; the terms cancel | PASS | 9:54–10:52, with "+0.18" now revealed on cue |
| U-M3.21 twice as steep | PASS | 10:52–11:30: 1 °C per 50 km, ×2, 5.00 m/s "same", 0.36 K per hour, "twice as fast" |
| U-M3.22 recap signs | PASS | 11:45–11:53: + same way, 0 right angle, − opposite |
| U-M3.23 / 3.24 ending | PASS | 12:09–12:31: "a series of maths tutorials", the three fields, "dot-product notebook", "notebooks for the other maths concepts"; no book, no lab, no URL, no thanks |
| Rounds 1–2 rules | PASS | no book or author names, no "not to scale" badges, no footnotes; only the plain "(1)" label (narrated "equation one"); "air parcel" (5:38, 9:04) |

### Must-fix
None.

### Should-fix (cosmetic, optional)
- **S1 (s18, 9:24.5–9:27.2): "18 km" beside the balloon.**
  - The bracket label for the isotherm shift sits right next to the balloon icon (x 610–765, y 315–365) for about 3 s.
  - It carries "km", so it does not read as a temperature, and the balloon has in fact moved 18 km east. It still breaks the rule that no other number sits beside the balloon.
  - Fix: move the bracket and label to the top of the map, between the dashed ghost line (x 560) and the bright line (x 587) at y ≈ 165. Or move the label left of the ghost line ("18 km →" ending at x ≤ 540).
- **S2 (s17, 8:50–9:00): "36 km along the wind" floats.**
  - The label sits beside the wind arrow at the pole, not beside the dashed upwind track it measures.
  - Fix: place it along the left of the dashed track (right end at x ≤ 450, y ≈ 520), or add a 60-px pointer to the track's midpoint.
- **S3 (s14, 7:05–7:10): "15 °C" walker tag touches the colour bar.**
  - The right end of the tag (x ≈ 1012) overlaps the colour-bar column (x 1010–1030).
  - Fix: put the tag to the left of the dot (right end at x ≤ 840).
- **S4 (s16a, 8:06–8:09): "13 °C" tag on the map's bottom border.**
  - The walker tag at the bottom of the 13 °C isotherm (y 620–670) sits on the frame line.
  - Fix: raise it 30 px.
- **S5 (s10, 4:02–4:10): empty left half.**
  - For about 7 s, "no angle / no √" and the two formulas fill only the right half.
  - Fix: optionally centre the group, or start the wind picture 2 s earlier.

### Verdict: PASS
The second fix loop landed with no regressions that mislead:
- **N1:** the only Must from review 5b, it is fixed. In s19a nothing but its own 13.00 °C sits beside the balloon, while the pole visibly falls 13.00 → 12.82 → 12.64 → 12.46 °C.
- **N2–N9:** all fixed.
- **Other checks:** QA 10/10, captions, every number and all U-M3 items pass.
- **Should-fixes:** S1–S5 are cosmetic polish and do not block.

The movie can become `qa_pass`. The user watches it before `/approve-movie 0 ch00_dot_product_why`.

Disk at review: C: 75 GB free, G: 587 GB free. Review scratch `review5c` is 99 MB (deletable).

## Overall: PASS (ch00_dot_product_why review 5c — `qa_pass`; S1–S5 optional)


## ch00_dot_product_why (review 5d — version 5 fix loop 3, commit 104d3d7, 2026-10-25)

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_dot_product_why v5 fix 3 | 790.90 s (13:10.9) | 39.50 MB | 10/10 PASS | PASS (6·1 + 8·0 = 6; √((1.00e-5)² + 0²) = 1.00e-5 K/m; 2.00e-5 K/m; 0.18 and 0.36 K/h; pole 13.00 → 12.82 → 12.64 → 12.46) | PASS (KaTeX clean, no error boxes) | PASS (three small crowding items, Should-fix) | PASS | PASS (192 cues, ≤ 2 × 42, max 15.73 cps, text = script) | PASS (0 flashes) | PASS (none, per U-M2.G2) | **PASS** |

**How I reviewed it.** The render has md5 d6db618c…. qa.json has all 10 gates PASS:
- duration 790.90 s (window 760–820 s, which the user accepted);
- size 39.50 MB;
- codec: H.264 High, yuv420p, AAC, faststart;
- 0 black stretches;
- 85 frozen stretches, all narrated (longest silence 2.82 s);
- loudness −16.0 LUFS, peak −3.5 dBTP;
- 0 flashes;
- captions: 192 cues match the script;
- physics: 44 functions reproduce their hashes;
- equations: 59 present.

I extracted 338 full frames with ffmpeg into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_dot_product_why/review5d/` (93 MB, deletable):
- one every 1.5 s through s10 (4:02.5–4:49.5), s16b (8:30.5–9:01) and s20 (11:24.4–12:09.7);
- the midpoint and the end (minus 0.15 s) of each of the 122 sentences;
- ±0.5 s and ±1 s around each seam.

The folder also has 390-px copies (`p390/`) and labelled tiles (`tiles/`). I looked at every tile and at about 15 frames at full size.

**Seams (frames 7200, 8760, 12000 = 4:00.0, 4:52.0, 6:40.0): clean.**
- **Frame count:** sorted video PTS run without a gap from 0 to 790.867 s at exactly 1/30 s steps. That is 23 727 frames = 790.9 s × 30, so no frame is dropped or duplicated anywhere.
- **What the seams show:** 12-frame strips across each seam show s09's two static shadow panels (4:00), the sled alone on its track (4:52, s11 opening) and the static material-derivative equation (6:40). None has a jump, a flash or a re-encode artefact. The framemd5 alternation inside these windows is ordinary encoder noise on a static picture.
- **A/V sync:** I matched speech onsets (300–3400 Hz band energy) to the `timing.json` sentence starts in each of the four chunks. The best lag is +0.44 s in all four (0–240, 240–292, 292–400, 400–790 s), so the seams add no drift. The constant 0.44 s is Kokoro's lead-in silence inside each clip: captions appear about 0.4 s before the voice, as in every earlier version.

### U-M4 acceptance

| Item | Result | Evidence (times in this render) |
|---|---|---|
| **U-M4.1** s10 starts with the goal; dot with x̂; calculation; only then "6 m/s is the eastward part" | **PASS** | The narration order is right:<br>- 4:09.2 "Suppose the wind blows towards the north-east at ten metres per second."<br>- 4:14.5 "Written as a vector, v has components six and eight."<br>- 4:18.8 "How much of this wind blows towards the east?"<br>- 4:22.2 the dot product with x hat, (1, 0)<br>- 4:31.3 "six times one, plus eight times zero, which is six"<br>- 4:37.1 "So six metres per second is the eastward part of the wind."<br>- 4:41.9 the closing "first component" sentence, which the user kept.<br><br>The screen follows the same order:<br>- arrow + "north-east", "10 m/s" (4:13)<br>- v = (6, 8) m/s (4:14.6)<br>- "how much east?" with a pointer (4:19–4:27)<br>- x̂ = (1, 0) (4:29)<br>- v·x̂ = 6 × 1 + 8 × 0 (4:32)<br>- "= 6 m/s" (4:36.6)<br>- then the "6 m/s east" leg bar (4:38.5), a gold underline and "eastward part" (4:40)<br>- "the first component" pointer on the 6 (4:43). |
| **U-M4.1a** the eastward part is not named before the question; the leg is highlighted only after the result | **PASS** | No "6 m/s eastward" is spoken or shown before 4:37. From 4:17.5 both legs are only thin dashed construction lines with no labels. The solid "6 m/s east" bar first appears at 4:38.5, after "= 6 m/s". |
| **U-M4.2** no empty half of the screen in s10 | **PASS** | The wind picture is on the left from 4:04.0 (s10 starts at 4:02.6; 4:02.5 is still s09's two panels). The right half holds "5×1+1×3 / \|a\|\|b\|cos θ / no angle, no √" until about 4:14.2, then v = (6, 8) m/s from 4:14.6. The only gap is a cross-fade of about 0.5 s (4:14.1–4:14.6). Nothing is empty at any time a sentence is spoken. |
| **U-M4.3** s16b shows \|∇T\| = √(…) = 1.00 × 10⁻⁵ K/m before it is used; s20 shows 2.00 × 10⁻⁵ | **PASS** | s16b (8:30.6–8:41.4): the √((∂T/∂x)² + (∂T/∂y)²) line appears at 8:32, then = √((1.00 × 10⁻⁵)² + 0²) at 8:33.5–8:35, then = 1.00 × 10⁻⁵ K/m, underlined, at 8:39.5. It is used at 8:50 ("× 1.00 × 10⁻⁵ K/m" under "length of ∇T"). In s20 (11:40.9–11:52), \|∇T\| = √((2.00 × 10⁻⁵)² + 0²) = 2.00 × 10⁻⁵ K/m appears with "Its length, by Pythagoras again…" and stays until v·∇T = 5.00 m/s × 2.00 × 10⁻⁵ K/m (11:52.9). It reaches = 0.36 K per hour at 11:54.4. All three lines are legible at full size; at 390 px the −5 exponents are small but readable. |

### Review 5c should-fixes S1–S4

| Item | Result | Evidence |
|---|---|---|
| S1 "18 km" beside the balloon (s18) | **Fixed** | 9:58.3: "18 km" sits at the top of the map (x 390–545, y 150–200), left of the ghost line. That is about 120 px above the balloon (y ≈ 310). The balloon has only its own 13.00 °C readout (right panel). |
| S2 "36 km along the wind" floats (s17) | **Fixed** (new small nit T2) | 9:25.8–9:32.8: "36 km / along the wind" now sits left of the dashed upwind track, with a teal pointer to it. |
| S3 "15 °C" tag on the colour bar (s14) | **Fixed** | 7:26.7–7:31: the tag is left of the walker dot (it ends at x ≈ 915 of 1920) and is clear of the colour bar. |
| S4 "13 °C" tag on the map border (s16a) | **Fixed** | 8:24.7–8:30: "13 °C" (y ≈ 590–640) is inside the map, about 25 px above the bottom frame line (y 668). |

### No regressions (review 5c PASS items re-checked)
- **Pole and balloon (s19a, 10:01–10:25):** the chain reads 13.00 → 12.82 → 12.64 → 12.46 °C. The pole readout falls (12.76 °C at 1.3 h, 12.46 °C at 3.0 h). The balloon readout stays 13.00 °C, and "stays 13 °C" appears at 10:24.5. In the map, the upwind labels "12.64" and "12.46 °C" sit left of their dots, and the balloon (x ≈ 595 at 1.3 h) is about 50 px from the nearest dot. Nothing but its own readout sits beside the balloon.
- **s19b/c:** "+0.18 K/h" appears with its underbrace on cue (10:46). ∂T/∂t = −0.18 K per hour (10:49.6). The bars −0.18 local rate / +0.18 advection term (11:10–11:24) are hatched for the negative bar.
- **s20:** "1 °C per 50 km", ×2, 5.00 m/s "same", 0.36 K per hour, "twice as fast". The pole reads 12.64 °C at 1.0 h (= 13 − 0.36).
- **Ending (12:48–13:10.9):** "a series of maths tutorials", "atmospheric science · meteorology · fluid dynamics", "dot-product notebook", "notebooks for the other maths concepts". There is no book or author name, no URL, no lab and no thanks.
- **Earlier rules:**
  - No headings, counters, footnotes or "not to scale" badges. The only equation label is the plain "(1)" (1:48).
  - "air parcel" at 5:59 and in s18.
  - The VTT contains no "Vallis", "Kundu", URL, "lab", "not to scale", "bit of air", "uphill" or "thanks".
  - Captions: 192 cues, longest line 42, max 15.73 cps, all 1–7 s, in order; the last cue ends at 788.08 s, before the audio ends (790.875 s).

### Narration of the changed sentences (VTT = script)
- **s10:** it now reads as a natural problem → method → answer arc. "Suppose the wind blows towards the north-east…" / "Written as a vector, v has components six and eight." / "How much of this wind blows towards the east?" / "To find out, we take the dot product…" / "So six metres per second is the eastward part of the wind." These are full, unhurried sentences (12.8–14.5 cps), with the question asked before any answer.
- **s16b:** "The length of grad T, by Pythagoras, is the square root of ten to the minus five squared, plus zero squared: just ten to the minus five kelvin per metre." It is clear with the screen. Spoken alone, "ten to the minus five squared" is slightly ambiguous, but the on-screen (1.00 × 10⁻⁵)² resolves it.
- **s20:** "Its length, by Pythagoras again, is that same number, because the northward part is still zero." This is natural and short.
- **One wording note, not a defect:** s10's closing sentence starts "It's simply the first component". "Simply" is on the Chapter-0 voice list of words to avoid (teaching-style §1d). The user asked to keep this sentence, so I list it only as an optional Should-fix (T4).

### Must-fix
None.

### Should-fix (cosmetic, optional)
- **T1 (s10, 4:40–4:49): "east" crowds "eastward part".**
  - The new "eastward part" label (y ≈ 810–860) sits about 5 px under the "east" axis label (x 805–890, y 775–815). At 390 px they read as one block, "east / eastward part".
  - Fix: move "eastward part" and its pointer below the bar's midpoint (x ≈ 380–620, y ≈ 800), or drop the axis word "east" once the bar appears.
- **T2 (s17, 9:25.8–9:32.8): the S2 label crowds the upwind dot and crosses the map edge.**
  - "36 km" sits about 15 px under "12.82 °C".
  - "along the wind" starts at x ≈ 60, over the map's left border (x 120) and next to the white corner bracket.
  - Everything is readable. Fix: shift the two-line label 40 px down and 60 px right, so it starts inside the map.
- **T3 (s14 7:06–7:31, s12 5:36–5:48, s16a 8:07–8:15, s20 11:25.9–11:33): the right part of the screen is empty while the map builds.**
  - These are the longest stretches; s14 runs about 25 s.
  - Nothing is missing that the narration needs, and this layout passed reviews 5b/5c. However, the user rejected exactly this pattern in s10 (U-M4.2).
  - Optional fix: centre the map while it is alone, or bring the right-hand keyword or formula in earlier. In s20, the "1 °C / 50 km = 2.00 × 10⁻⁵ K/m" fraction could appear with "one degree every fifty kilometres" (11:26.6) instead of at 11:33.4.
- **T4 (s10, 4:41.9): "It's simply the first component".**
  - Fix: optionally drop "simply" ("That's just the first component: …").
  - This needs one sentence re-voiced. Only do it if the user agrees, since the user asked to keep this sentence.

### Verdict: PASS
Fix loop 3 delivers every user item:
- **U-M4.1 / U-M4.1a:** s10 is goal → question → dot with x̂ → 6 × 1 + 8 × 0 = 6 → "six metres per second is the eastward part". The leg is highlighted only after the result.
- **U-M4.2:** no empty half in s10.
- **U-M4.3:** \|∇T\| is computed on screen before it is used, as 1.00 × 10⁻⁵ K/m in s16b and 2.00 × 10⁻⁵ K/m in s20.
- **S1–S4:** all fixed.
- **Seams:** the chunk joins at 4:00, 4:52 and 6:40 have no glitches, no dropped or duplicated frames and no A/V drift.
- **Regressions:** none. The pole/balloon numbers, ending wording, rules and captions all hold.

T1–T4 are cosmetic and do not block. The movie can become `qa_pass`. The user watches it before `/approve-movie 0 ch00_dot_product_why`.

Disk at review: C: 87 GB free, G: 587 GB free. Review scratch `review5d` is 93 MB (deletable).

## Overall: PASS (ch00_dot_product_why review 5d — `qa_pass`; T1–T4 optional)

## ch00_dot_product_why (review 5e — version 5 fix loop 4, commit d1e04e3, 2026-10-25)

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_dot_product_why v5 fix 4 | 802.60 s (13:22.6), 24 078 frames | 38.45 MB | 10/10 PASS | PASS (44 hashes; s05 3·(−2)+0·0 = −6; s12 unchanged maths) | PASS (59 present, KaTeX clean) | PASS (U1 tight, Should-fix) | PASS | PASS (194 cues, ≤ 2 × 42, max 15.93 cps, text = script) | PASS (0 flashes) | PASS (none, per U-M2.G2) | **PASS** |

**How I reviewed it.** ffprobe: video 802.600 s, 24 078 frames (= 802.6 × 30, so no net drop/duplicate); AAC LC 44.1 kHz stereo, 802.575 s. qa.json all 10 gates PASS (duration 802.60 s in 773–833; 38.45 MB; H.264 High yuv420p faststart; 0 black; 83 frozen stretches all narrated, longest silence 0.80 s; −16.0 LUFS / −3.5 dBTP; 0 flashes; 194 cues; 44 physics hashes; 59 equations). Frames in `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_dot_product_why/review5e/` (deletable): s05 every ~1 s 2:21.9–2:42.5 plus pulse peaks, s12 every ~1 s 5:47–6:21 plus the label move (frames 10840/10845/10850), 390-px copies, one reveal frame per scene s06–s22 (`grid.png`), s19a balloon strip (`balloon.png`), and `diffs.npy` (frame-to-frame differences of the whole movie).

**Audio (the 0.80 s vs 2.82 s question).** The mp4 track is the right mix: cross-correlation of the mp4 audio with `v5fix4/public/narration_music.wav` gives lag 0.0 ms and correlation 1.000 at 16 points (0:05, 2:10, 2:13, 2:30, 4:26, 4:27, 5:52, 6:40, 8:52, 8:53, 10:40, 11:06, 11:07, 11:40, 13:10, 13:18), and with the bare `narration.wav` lag 0.0 ms, correlation 0.986–0.998 (the remainder is the −28 LUFS music bed, ducked 5 dB; music.json tail 2.5 s). The narration is complete and in place at the end (13:18 still matches). The lower "longest silence" is consistent with the continuous music bed and the 0.80 s scene gap; nothing is missing. 44.1 kHz comes from the pre-mixed WAV and is fine for AAC.

**Seams (frames 4000, 8000, 12000, 16000, 20000, 24000 = 2:13.3, 4:26.7, 6:40.0, 8:53.3, 11:06.7, 13:20.0): clean.** Every seam falls on a static picture (s05 middle panel, s10 question, s13 equation, s16b between sentences, s19c opening, end card). Frame-to-frame differences across each seam are 0.03–0.09 grey levels (invisible encoder noise), no jump, no flash. **Video sync:** I listed every visual onset (motion after ≥ 10 still frames, 232 onsets) and matched them to `timing.json` sentence starts: the median offset is +2 frames (the fade-in's first visible step) in every chunk 0–5 (chunk 5: +0.5), so no chunk is shifted and there is no drift after the +5.35 s / +17.05 s shifts. Audio sync: lag 0 everywhere (above).

### U-M5 acceptance

| Item | Result | Evidence |
|---|---|---|
| **U-M5.2** s05 rule after "minus six, a negative number" | **PASS** | VTT 2:27.9–2:31.9 "three times minus two / is minus six, a negative number." then 2:32.2–2:37.6 "When two vectors point in opposite / directions, their dot product is negative." then 2:37.9 "So the dot product measures…" — word-identical to script.md. On screen "opposite" pulses at 2:34.1–2:34.8 (peak 2:34.45, still inside panel 3, clear of the arrows and "p") and "−6 negative" pulses at 2:36.8–2:37.5 (peak 2:37.15, right edge x ≈ 1872 < 1920, no clipping). Both read at 390 px. Natural: it repeats the pattern of the right-angle rule two sentences earlier. |
| **U-M5.1** s12 "partial capital T by partial small t" + meaning | **PASS** | VTT 5:52.8–5:56.1 "written partial / capital T by partial small t." then 5:56.4–6:01.1 "Here capital T stands for temperature, / and small t for time." = script. "T = temperature" / "t = time" (54 px, no box) fade in at ~5:57–5:59 beside ∂T/∂t, then slide down at 6:01.2–6:01.9 to y ≈ 770/835 under "following the parcel"; during the slide they cross nothing ("time changes" fades in only after they have passed). At 6:21 (DT/Dt shown) the legend sits below "following the parcel" with ~70 px clearance. Legible at 390 px. Later uses (s14 ∂T/∂x, s19b ∂T/∂t) unchanged, as intended. |

### No regressions (sampled one reveal frame per scene s06–s22)
- s06 shadow chain = 2.530 (3:12.5); s07 b̂ = (0.316, 0.949), ≈ 2.53 (3:38.5); s08 × |b| ? (3:47.5); s09 2.530 × 3.162 ≈ 8, 1.569 × 5.099 ≈ 8 (4:06.5); s10 v·x̂ = 6 × 1 + 8 × 0 = 6 m/s with "6 m/s east" (4:44); s11 W = 10 N × 5 m = 50 J (5:21); s13 material derivative anatomy + "dot product" (7:11.5); s14 isotherm label (7:32.5); s15 ∇T = (1.00 × 10⁻⁵ K/m, 0) (8:05); s16a 10 cos 60° = 5.00, 10 sin 60° = 8.66 (8:40); s16b = 0.18 K per hour (9:10.5); s17 18 km, 0.18 °C, "colder side" (9:41); s18 DT/Dt = 0, "east, 18 km per hour" (10:09); s19a/b/c 12.46 / 13.00 °C, ∂T/∂t = −v·∇T, bars −0.18 / +0.18 (10:26–11:34); s20 0.36 K per hour, "twice as fast" (12:09.5); s21 + / 0 / − (12:43.5); s22 end card (13:19.5, 13:22.4). Each shows what its sentence says at that moment.
- **Balloon 13 °C:** 10:17–10:36.8 the upwind labels 12.82 / 12.64 / 12.46 °C sit left of their dots; the balloon carries no number beside it, only its own 13.00 °C readout in the right panel.
- **Ending:** "a series of maths tutorials", "atmospheric science · meteorology · fluid dynamics", "dot-product notebook", "notebooks for the other maths concepts"; spoken: "one of a series of related maths tutorials… watch out for the others… on the website that goes with this video". No book/author name, URL, lab or thanks.
- **Rules:** no headings, counters, footnotes or "not to scale" badges. VTT contains no "Vallis", "Kundu", "http", "www", "lab", "not to scale", "bit of air", "uphill", "thank" ("simply" only in s10's kept sentence, T4). Captions: 194 cues, in order, all 1–7 s, longest line 42, max 15.93 cps, last cue ends 799.775 s < audio 802.575 s.

### Must-fix
None.

### Should-fix (cosmetic, optional)
- **U1 (s12, 5:57–6:01.2): "T = temperature" is close under ∂t.** The cap of "T = temperature" (y ≈ 285) is about 8 px below the bottom of the ∂t denominator (y ≈ 278). It reads clearly at full size and at 390 px, but it looks cramped. Fix: start the label at y 320 / 390 (instead of 300 / 370), or start the slide 20 px lower.
- **U2 (caption 5:52.8): awkward line break "written partial / capital T by partial small t."** Better: "written partial capital T / by partial small t." (both lines ≤ 42). Caption-only, no re-render needed.
- T1–T4 from review 5d remain (user: "all else are good enough").

### Verdict: PASS
Fix loop 4 delivers U-M5.1 and U-M5.2 word for word, with on-screen keywords on cue and no overlaps. The 7-chunk render has clean seams, exactly 24 078 frames, audio identical to the narration+music mix with 0 ms lag from start to end, and visual reveals on their sentences in every chunk. No regressions of the user's rules. `qa_pass`; the user watches it before `/approve-movie 0 ch00_dot_product_why`.

Disk at review: C: 86 GB free, G: 586 GB free.

## Overall: PASS (ch00_dot_product_why review 5e — `qa_pass`; U1–U2 optional)

## ch00_dot_product_why (review 6 — version 6, commit fda822f, 2026-10-25)

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_dot_product_why v6 | 1060.57 s (17:40.6), 31 817 frames | 51.17 MB | 10/10 PASS | FIX (M3, M4: wrong drawn positions; all numbers and signs right) | PASS (65 present, KaTeX clean, no black KaTeX) | FIX (M1, M2) | PASS (S2–S4, S15) | PASS (261 cues, ≤ 2 × 42, max 15.93 cps, text = script, no "pole") | PASS (0 flashes; teal / rose / grey) | PASS (none, per U-M2.G2) | **FIX** |

**How I reviewed it.** ffprobe: 1060.567 s, 31 817 video frames, H.264 1920×1080 + AAC; timing.json total 1058.05 s + hold, self-check diff 0.0 ms. qa.json (15:40) has all 10 gates PASS (−16.0 LUFS / −3.6 dBTP; 0 flashes; 107 frozen stretches all narrated; 261 cues; 54 physics hashes; 65 equations). I re-checked the captions myself: 261 cues, all 1–7 s, ≤ 2 lines, ≤ 42 characters per line, max 15.93 cps, and no "pole" in the VTT. Frames are in `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_dot_product_why/review6/` (deletable). `tiles/adv_01…15.png` are 1 frame/s over 8:35–16:05, `tiles/s00_01.png` is 2 frames/s over 0–12 s, and `f/` holds full 1080p frames at every beat quoted below (plus 640-px copies). For A/V sync I ran silencedetect (high-pass 300 Hz, −32 dB) at 12:30–13:10 and 14:50–15:20. The speech gaps fall on the VTT gaps within 0.3–0.4 s (Kokoro lead-in), so there is no drift.

Scene starts (timing.json): s16a 8:38.5 · s16b 9:02.9 · s17 9:33.5 · s17b 10:59.1 · s18 11:56.9 · s19a 12:34.0 · s19b 13:38.1 · s19c 14:06.6 · s19d 14:52.8 · s20 15:53.4.

### U-M6 acceptance

| Item | Result | Evidence |
|---|---|---|
| U-M6.1 s05 | PASS | VTT 2:09.8–2:16.7 matches the user's wording; "same direction" is on screen under panel 1 at 2:29. |
| U-M6.2 s05 | PASS | 2:22.3–2:30.8 verbatim. "= 0" brightens about 1 s after "is zero" (fine). |
| U-M6.3 s00 title | PASS (S13) | 0:00–0:10. The 150-px teal→gold "The dot product", "made easy", "and how meteorology uses it" are all legible at 640 px. The q-sweep shows a live signed p·q (+6.00 → −5.95 → +6.00), then the map with the fixed thermometer goes 13.00 → 12.82 °C. It leads cleanly into s01 "What is the dot product?". The bottom third is empty and the animation is small (S13). |
| U-M6.4 s13 | PASS | 7:16: no icon on ∂φ/∂t. The balloon sits above Dφ/Dt and the thermometer beside "one fixed place". |
| U-M6.5 s13 | PASS | 7:08–7:18 "carried into warmer or colder air, or moister or drier air…" with the keywords on screen. |
| U-M6.6 s16a | PASS | No 8.66 anywhere in 8:38–9:03 (voice, CalcStack, picture). |
| U-M6.7 s16a/b | PASS (S1) | "shadow" is labelled on the picture. The gold link to 5.00 m/s is on screen 8:51–9:02 and again in s16b at 9:19–9:24, but it crosses the map and the colour-bar title (S1). |
| U-M6.8 meaning of +0.18 K/h | Narration PASS; layout FIX (M1, M2) | Order 9:33–10:59: question → the balloon's parcel "at the fixed thermometer right now" → "Distance is speed times time" → 18 km → 0.18 °C → 13.18 → rate in space × speed = rate in time → "how fast the wind carries the parcel into warmer places" → v·∇T → positive because towards warmer → same for every parcel → fork. This answers all four of the user's questions, in the right order. |
| U-M6.9 highlight + arrow to 0.18 °C | PASS in content; FIX in layout (M1) | 9:52–10:10: teal 18-km span (300→318 km) linked to "= 18 km"; gold strip 13.00→13.18 °C linked to "= 0.18 °C". |
| U-M6.10 ∂T/∂t negative + parcel that warms | PASS (M3) | s17b 10:59–11:57: frozen map, balloon 13.18 / 13.36 / 13.54, fixed thermometer flat. s19a 12:34–13:38: fixed thermometer 13 → 12.82 → 12.64 → 12.46, balloon flat at 13. |
| U-M6.11 s18 assumption first | PASS (S15) | 12:01–12:15 is the assumption, then DT/Dt = 0 at 12:14. |
| U-M6.12 s19a re-sequenced | PASS in order and numbers (M3, M4) | Warmer ahead / colder upwind (12:39–12:45) → queue 12.82 / 12.64 / 12.46 (12:49–13:05) → clock → arrivals → graph. No bottom row. The queue numbers fall upwind and the readout falls too, so the contradiction the user saw is gone. |
| U-M6.13 s19d | PASS (S11, S12) | 14:52.8–15:53: 3 × 2 table, row 3 = row 1 + row 2. |
| U-M6.14 no "pole" | PASS | Not in the VTT. Not on screen in any frame checked (the s19a legend says "fixed thermometer"). |

### Physics honesty (all numbers checked against the frames)
- **Case 1 (s17b):** balloon 13.18 / 13.36 / 13.54 °C at x = 318 / 336 / 354 km. Fixed thermometer 13.00 throughout. "DT/Dt = ∂T/∂t + v·∇T = 0 + 0.18 K per hour". Graph dots at +0.18 per hour. **Correct.**
- **Case 2 (s19a):** readout 13.00 → 12.84 at t = 0.9 h (13 − 0.18 × 0.9 = 12.838 ✓) → 12.46 at 3 h. Graph dots at 12.82 / 12.64 / 12.46. Balloon line flat at 13.00. "−0.18 °C per hour". **Correct.** The queued parcels lie 36 km apart along the wind (= 18 km across, 27 px at 1.47 px/km) ✓.
- **Signs:** s19b ∂T/∂t = −v·∇T, with +0.18 K/h under v·∇T and ∂T/∂t = −0.18 K per hour ✓. s19c "+0.18 = 0 + 0.18" and "0 = −0.18 + 0.18" ✓. s19d +0.18 | +0.18, 0 | −0.18, +0.18 | 0 ✓.
- **18-km span and strip (s17):** the span runs 300→318 km and the strip runs between the 13.00 isotherm and the dashed 13.18 line ✓. The 1-h path ends at (318, ~211 km), 36 km along the wind ✓.
- **Map slide (s18):** isotherms and tagged parcels move 18 km east and ~31 km north in 1 h, and the 13 °C isotherm ends at the balloon ✓.
- **Wrong drawn positions (not wrong numbers):** M3 (balloon) and M4 ("18 km" on the along-wind segment).

### Would a first-time learner follow 8:38–15:53?
Mostly yes. The narration now answers each of the user's five confusions, in the right order:
1. **What +0.18 K/h means:** 10:29–10:36.
2. **Which parcel:** 9:37–9:42.
3. **Why × 1 hour:** 9:49 "Distance is speed times time".
4. **The + vs − sign:** forward first (10:40), then the two cases, then upwind (12:39) and the minus sign (13:59).
5. **The rising labels vs falling readings:** the s19a queue now falls upwind, the same way the readout falls.

Three visual faults still work against the learner:
- **M3:** the balloon is drawn far below the fixed thermometer exactly when the voice says it was there.
- **M4:** "18 km" is placed on a 36-km diagonal.
- **M1:** the s17 calculations are crowded onto the colour bar, with two crossing links.

### Must-fix
- **M1 (s17, 9:49–10:59): the calculation column collides with the colour bar, and the two curved links cross each other and the map.**
  - The colour-bar title "T (°C)" (x 1055–1095, y 380–480) overprints the "5" of "5.00 m/s × 3600 s = 18 km" (starts x ≈ 1080, y 445). The CalcStack sits 50 px from the bar.
  - The 18-km link (from (476, 575)) and the 0.18-°C link (from (476, 260)) both cross the 14 °C isotherm and the colour bar, and they cross each other at about (1000–1250, 300).
  - All content is packed into (380–520, 450–620) while y 740–1080 is empty.
  - **Fix:**
    - Hide the colour bar in the zoomed s17. The zoom already labels 13 °C / 14 °C on top, so the bar adds nothing here.
    - Move the two calculation lines into the empty band under the map, left-aligned at x = 120: "5.00 m/s × 3600 s = 18 km" at y = 800 and "18 km × 1 °C/100 km = 0.18 °C" at y = 900 (≥ 56 px).
    - Replace the curved links with short straight vertical links: teal span bottom (476, 600) → the top of "18 km" (≈ y 770), and gold strip bottom (476, 668) → the top of "0.18 °C" (≈ y 870). Nothing crosses.
    - Keep the right column (x ≥ 1130) for "0.18 K per hour", the unit chain (°C/km × km/h = °C/h, space / time) and v·∇T.
    - Show "13.18 °C" once (at the ghost balloon, 545, 400), not also at the top of the dashed line.
- **M2 (s17, 10:36–10:59): "v·∇T = +0.18 K per hour" is clipped at the right edge.** "hour" runs past x = 1920 (the text starts at x 1130 at ~72 px). **Fix:** start at x = 1110 and set 60 px so the right edge is ≤ 1840, or put "K per hour" on its own line (y + 70).
- **M3 (s19a 12:34–13:38 and s19c 14:06–14:52): the balloon is drawn about 150 km south of the fixed thermometer.**
  - At t = 0 in s19a the thermometer base is at (300, 180 km), pixel (560, 405). The balloon's pin is at (300, ~33 km), pixel (560, 620). At 3 h it is at (354, ~127 km).
  - In s19c, at 1 h, it is at (318, ~64 km) instead of (318, 211 km).
  - This contradicts s17 ("the balloon's air parcel, which is at the fixed thermometer right now"), s18 (balloon at the thermometer) and the wind direction. A learner sees a different parcel south of the thermometer and loses the thread "which parcel?" — the user's own question.
  - **Fix:** draw the balloon at its true pin (300, 180) → (318, 211) → (336, 242) → (354, 273 km) on the dashed "warmer" track, with the glyph 25 px to the right of the thermometer (as in s17) so the two icons do not overlap. In s19c, move the "18 km across" bracket up to y = 180 km (from x 300 to 318 km) and put the balloon at its end.
- **M4 (s19a, 12:45–13:06): "18 km" labels the diagonal segment between the fixed thermometer (560, 405) and the first queued parcel (535, 450).** That segment is 36 km along the wind. The 18 km is the across-isotherm distance, and this is exactly the "18 km upwind" the user found unclear in v5. **Fix:** as in s19c, draw a horizontal bracket from the parcel (282 km) to the 300-km line at the parcel's height (y ≈ 450 px, from x 533 to 560). Label it "18 km across" below or left of the bracket, at (330, 470), clear of the "12.82 °C" label (move that label to the left of the parcel's circle at y 430).

### Should-fix
- **S1 (s16a 8:51–9:02, s16b 9:19–9:24, scenes s16a/s16b): the gold shadow→5.00 m/s link crosses the map, the ∇T label and the colour-bar title; the bottom 35 % of the screen is empty.** Put the CalcStack under the map (x 120, y 780–1000) and draw a straight link down from the "shadow" label (625, 515) to "5.00 m/s", or route the curve below the x-axis (y ≥ 740).
- **S2 (s17, 9:57): the "13.18 °C" label at the dashed line appears ~15 s before it is spoken (10:12).** Reveal it on "So in one hour" (10:08). See also M1 (one label only).
- **S3 (s17, 10:54–10:59): the fork labels "map frozen | map slides" appear only at 10:58.8, 0.3 s before the cut.** Reveal them on "two cases" (10:56.5) and let them carry over into s17b's "map frozen" title.
- **S4 (s17b, 10:59–11:15): the 13.18 / 13.36 / 13.54 °C marks are on screen 20 s before they are spoken (11:19.9–11:27.9), they are rotated 90°, and the right half is empty for ~8 s.** Reveal each mark when the balloon reaches it, as horizontal labels above the map top (y 125, x = 513 / 585 / 657, 40-px offset rows to avoid overlap). Fade in the readouts and the empty graph axes at 10:59.
- **S5 (s17b, 11:25–11:57): at 3 h the balloon glyph sits on the map's top border and the gold bar (y 125–155).** Pan the zoom window 40 km north, or draw the glyph below its pin.
- **S6 (s19a graph, 13:10–13:38): the fixed thermometer's line is a thin dashed light grey, and its rate label is rose.** Make it a 5-px solid line in the rose of "−0.18 °C per hour", with filled dots at 1, 2, 3 h, and keep the dashed style out of the legend. The thermometer readout (1165, 155) can stay grey.
- **S7 (s19a, 13:05.5): the clock starts at 13:10.5, about 3 s after the "start the clock" cue ends (13:07.6).** It does little harm: the 1-h arrival (13:13.8) lands on "twelve point eight two after one hour" (13:14.2), and 2 h / 3 h lead the voice by ≈ 1 s. Optional: start at 13:07.6 and run the first hour over 6.6 s.
- **S8 (s19a, 12:56–13:06): the queue labels "in 1 h / in 2 h / in 3 h" fade out before the clock starts.** Keep each one until its parcel arrives.
- **S9 (s19a 13:22–13:38): the "colder air arriving" link crosses the x-axis tick "400".** Start the label at (520, 790) and end the arrow at the upwind track at (500, 535) via a path left of x 450.
- **S10 (s19c, 14:06–14:52): the bars need tidying.**
  - The −0.18 hatched bar has a gold rectangle outline, which is a box (U-M3.G2). Remove the outline.
  - The "map frozen" row shows "0" as a stray number at the axis. Label it "local rate 0" in grey.
  - The thumbnail graph (1130–1350, 320–430) has no labels. Add "balloon" / "fixed thermometer" at ≥ 44 px, or drop it (s17b already showed it).
- **S11 (s19d, 14:57–15:08): the isotherm-crossing glyph "| | ⊢→" starts at x 860, 17 px after "advection term" (ends x 843), and runs into the +0.18 column; the "same" tag is ~22 px.** Draw the glyph under "the wind" (x 460–640, y 420), and make "same" ≥ 44 px or drop it.
- **S12 (s19d): the material-derivative row (DT/Dt, label, +0.18) uses teal, the advection colour.** Use warm white or gold for row 3 so that "advection = teal" stays unique (teaching-style §1l).
- **S13 (s00, 0:00–0:10): the visual half is small (map 640 × 380) and y > 700 is empty.** Scale the TitleSweep / mini map to ≈ 760 × 450 at x 1080–1840, y 180–630, and set "p·q = …" at y 720. It would read as more "catchy" at 640 px.
- **S14 (QA tool):**
  - qa.json `review_frames` are keyed to the stale dry-run times in script.md (e.g. 568.57 s, 653.48 s) instead of timing.json (573.50 s, 659.08 s), so the boundary frames miss the real boundaries.
  - The duration gate's target equals the measured value (1060.567 s), so the gate cannot fail.
  - Fix `tools/movie_qa.py` to read timing.json and the storyboard target.
- **S15 (s18, 11:57–12:26): the visuals run ahead of the narration.** "map slides" is on screen from 11:57, before the assumption is said, and the isotherm slide runs 12:18–12:20, before "the whole pattern of isotherms slides" (12:20–12:26). Reveal "map slides" on "slides with the wind" and run the slide 12:21–12:26.
- **Text under 44 px:**
  - Colour-bar title and ticks: ~36 px in s16a–s19c.
  - Graph tick labels: ~36 px in s17b and s19a.
  - "same" in s19d: ~22 px.
  - They are readable at 1080p and marginal at 640 px. Raise the graph ticks to 44 px. Colour-bar text goes with M1.

### Verdict: FIX
The v6 narration fixes the advection story: all of U-M6.1–14 are said, in a good order, with correct numbers and signs throughout. Four visual faults remain:
- **M1:** the s17 collision and crossing links.
- **M2:** "+0.18 K per hour" clipped at the right edge.
- **M3:** the balloon drawn far from its parcel in s19a/s19c.
- **M4:** "18 km" on a 36-km diagonal.

Each one undercuts exactly the points the user found confusing. They are layout and position fixes in `movies/src/ch00/` only; no narration or physics changes are needed, and the captions stay valid. S1–S15 are recommended (S4, S6 and S15 most).

Disk at review: C: 85 GB free, G: 584 GB free.

## Overall: FIX (ch00_dot_product_why review 6 — M1–M4; S1–S15 recommended)

## ch00_dot_product_why (review 6b — version 6 fix loop 1, commit b8c6859, 2026-10-25)

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_dot_product_why v6 fix 1 | 1060.567 s (17:40.6) | 51.27 MB | 10/10 PASS | PASS (balloon on its true path; "18 km across" on the across-isotherm bracket; every number and sign correct) | PASS (65 present, KaTeX clean) | PASS (M1, M2 fixed; T1–T8 cosmetic) | PASS (reveals on their words; A/V sync within 0.3–0.6 s, no drift) | PASS (261 cues, ≤ 2 × 42, max 15.7 cps, text = script, no "pole") | PASS (0 flashes; teal / rose / grey) | PASS (none, per U-M2.G2) | **PASS** |

**How I reviewed it.** ffprobe: 1060.567 s, 51 270 111 bytes. qa.json (17:50): all 10 gates PASS. The duration gate now checks against timing.json (window 1045–1076 s), and the review frames sit on the timing.json boundaries (for example 10.33 / 10.48 s around the s00 → s01 cut at 10.425 s), so S14 is closed. I re-checked the captions myself: 261 cues, 1.01–6.53 s, ≤ 2 lines, ≤ 42 characters per line, max 15.7 cps, and no "pole". Frames are in `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_dot_product_why/review6b/` (deletable):
- `tiles/adv_01…38.png`: 1 frame/s over 8:35–16:00, timestamped;
- `tiles/s00_*`: 2 frames/s over 0–12 s; `tiles/s05_*` and `tiles/s21_*`: one frame every 2 s;
- `f/`: full 1080p frames at every beat quoted below.

For A/V sync I ran silencedetect (high-pass 300 Hz, −32 dB) over s17 (9:33–11:03), s19a (12:34–13:44) and s22. The speech onsets fall within 0.3–0.6 s of the VTT cue starts throughout (Kokoro lead-in), with no drift.

### Review 6 items
| Item | Status | Evidence |
|---|---|---|
| **M1** s17 collision / crossing links | **FIXED** | 9:50–10:59. The colour bar is hidden in the zoom. "5.00 m/s × 3600 s = 18 km" (y ≈ 770) and "18 km × 1 °C/100 km = 0.18 °C" (y ≈ 845) now sit under the map. The two links no longer cross each other or the map. "13.18 °C" is shown once, at the ghost balloon. Residual: the 0.18 °C link crosses the "350" tick label (T3). |
| **M2** "+0.18 K per hour" clipped | **FIXED** | 10:44: "v·∇T = +0.18 K per hour" ends at x ≈ 1790. |
| **M3** balloon far from its parcel | **FIXED** | s19a 12:34: the balloon's string ends at (≈ 318 km, 180 km), beside the thermometer (300, 180); the glyph is offset to the right as in s17. 13:38 (3 h): pin at ≈ (371, 277 km), i.e. the true (354, 273) plus the same glyph offset. s19c 14:20: pin at ≈ (318, 215 km), with the "18 km across" bracket from 300 to 318 km just under the thermometer. The balloon is the same air parcel in s17, s17b, s18, s19a and s19c. |
| **M4** "18 km" on the 36-km diagonal | **FIXED** | 12:50–12:59: a horizontal bracket runs from the 1-h parcel (535 px) to the 300-km line (560 px), labelled "18 km across" on its left, with "12.82 °C" above it. |
| S1 s16a/b gold link | **Half fixed** | s16a 8:51–9:02: a straight vertical link from "shadow" down to "10 × cos 60° = 5.00 m/s across" under the map. Clean. s16b 9:19–9:24: the curved link still crosses the ∇T arrowhead, the 14 °C isotherm and the colour bar, and its tip lands on the "=" of "= 5.00 m/s" (T2). |
| S2 "13.18 °C" early | FIXED | Fades in at 10:12.5–10:13, on "the map reads thirteen point one eight". |
| S3 fork labels late | FIXED | "map frozen / map slides" is on screen from 10:55, inside the "two cases" cue (10:54–10:59). |
| S4 s17b marks early / rotated / empty right | FIXED | 13.18 / 13.36 / 13.54 are horizontal above the map (13.36 is on a raised row) and appear at 11:20 / 11:23 / 11:25, as each one is spoken. Both readouts and the empty graph axes are on screen from 10:59. |
| S5 balloon on the map border | FIXED | 11:25–11:57: the map is panned (y 150–300 km), and the 3-h glyph sits 40 px inside the top edge. |
| S6 thermometer line style | FIXED | 13:10–13:38: solid rose line with dots at 1, 2 and 3 h; rose legend swatch. |
| S7 clock start | FIXED | The clock leaves 0.0 h at 13:07.6, at the end of "Now let's start the clock". 1.0 h at 13:14.0 ("twelve point eight two after one hour", 13:14.2); 2.0 h ≈ 13:16.3; 3.0 h ≈ 13:19. |
| S8 queue labels | FIXED | "in 1 h / in 2 h / in 3 h" stay on until each parcel arrives (13:08–13:19). |
| S9 "colder air arriving" link | **Not fixed (T4)** | 13:22–13:38: the arrow still runs through the "400" tick label. |
| S10 s19c bars | FIXED | No gold outline; the hatched bar has only its own dashed rose edge, which reads as part of the bar. The frozen row says "local rate 0". The thumbnail graph is gone. |
| S11 s19d glyph / "same" | FIXED | 15:00: the isotherm-crossing glyph sits under "the wind" (x 495–640, y 428). "same" is dropped. |
| S12 row-3 colour | FIXED | The DT/Dt row is warm white / cream. Teal stays for advection only. |
| S13 s00 small visual | FIXED (new T1) | 0:04.5–0:10: the map is now 760 × 455 at x 1080–1840, y 180–635, with "12.86 °C" at y 725. See T1. |
| S14 QA tool | FIXED (orchestrator, 0d62684) | As above. |
| S15 s18 visuals ahead of narration | FIXED | "map slides" appears at 12:25, on "slides with the wind" (12:23–12:27). The slide runs 12:25–12:28. The "18 km" bracket comes at 12:31 on "eighteen kilometres every hour". |
| Text < 44 px | FIXED (mostly) | Colour-bar ticks and title and the graph ticks are now 52 px. Remaining small glyphs: the gold "+" signs beside the s19d brackets (~30 px) and the s18 isotherm-label row (unchanged, ~44 px). |

### Touched scenes: new problems?
- **s00:** one near-collision (T1). Everything else reads well at 640 px.
- **s05:** clean. Three panels; equations and "= 6 positive / = 0 right angle / = −6 negative" fit (rightmost edge x ≈ 1818); no overlap.
- **s16a:** the link is clean. Because the calculation moved under the map, the right 40 % of the screen (x > 1110) is empty for the whole scene, 8:38–9:02 (T5).
- **s16b:** T2.
- **s17:**
  - T3.
  - The right column holds only "0.18 K per hour" from 9:33 to 10:14, before the unit chain arrives (T5).
  - "towards warmer air" (10:40) runs to x ≈ 998, flush with the map's right border at 1000 (T6).
- **s17b:** clean apart from a crowded corner. The map's x-axis unit "km" (x 1053) sits 15 px from the graph's "13.0" tick and reads as "km 13.0". The same happens in s19a (T7).
- **s18:** clean.
- **s19a:**
  - T4 and T7.
  - At 13:14.3–13:15, the "12.82 °C" label flies to the readout and briefly crosses the colour-bar "20" tick. This is a transient arrival animation and acceptable.
- **s19c:** two small items (T8):
  - The rotated colour-bar title "T (°C)" ends 15 px from the "map slides" row label, so it reads "⊢ map slides". The local-rate thermometer icon sits on the bar axis line.
  - "13.18 °C, an hour ago" is parked at the map's top-left (x 130–570). It is not attached to the dashed 318-km line it refers to, and that line is now also where the 13 °C isotherm sits.
- **s19d:** clean.
- **s21:** clean, unchanged.

No new must-fix collision, no off-word reveal, no text clipped.

### User-facing rules
- **No "pole":** PASS. Not in the VTT. Not on screen in any frame checked; labels say "fixed thermometer".
- **No boxes except the s03 tags:** PASS. The −0.18 hatched bar has no gold outline. The s22 thumbnails were accepted in earlier rounds.
- **No links or book names:** PASS. The end card says "a series of maths tutorials · atmospheric science · meteorology · fluid dynamics". No URL, no book title, no equation numbers in the touched scenes.
- **"air parcel":** PASS. Narration uses "air parcel" (17 cues). On screen: "each parcel keeps its T".

### The advection stretch (8:38–15:53) read as a confused first-time learner
1. **What +0.18 K/h means.** 9:33–10:44. The ghost-balloon picture (teal 18-km span, gold strip from 13.00 to 13.18) feeds the two-line calculation under the map. The space × speed = time unit chain follows, then "v·∇T = +0.18 K per hour, advection term". Every step is on screen as it is said. **Clear.**
2. **Which air parcel.** The balloon and the fixed thermometer start side by side inside one dashed ellipse in s17. They stay together at t = 0 in s17b, s18 and s19a. The balloon then follows its own dashed track in s19a and ends 18 km across in s19c. M3 is gone, so there is only ever one balloon parcel. **Clear.**
3. **Why × 1 hour.** "5.00 m/s × 3600 s" appears on "Distance is speed times time" (9:50), then "= 18 km" with the link from the teal span (10:00). **Clear.**
4. **The + vs − sign.**
   - The forward direction comes first ("towards warmer air", +0.18).
   - Frozen map: 0 + 0.18.
   - Upwind and colder (12:39–12:45), the falling readout, the rose −0.18 °C per hour.
   - s19b: the brace "+0.18 K/h" under v·∇T, then the rose "∂T/∂t = −0.18 K per hour" underlined.
   - The s19c bars, then the s19d 3 × 2 table.

   The sign is carried by colour (teal +, rose −) and by words. **Clear.**
5. **The falling readings.** The s19a queue (12.82 / 12.64 / 12.46) falls upwind. The parcels arrive one by one, the readout drops in step, and the rose line falls on the graph while the teal balloon line stays flat. No rising labels remain to contradict it. **Clear.**

The stretch is now seamless. The cuts s16b → s17 (zoom into the same map), s17 → s17b (the fork carries "map frozen" into the title), s17b → s18 (zoom out) and s18 → s19a (clock reset, same map) keep the same map, icons and colours. Nothing jumps.

### Must-fix
None.

### Optional (T) — cosmetic, for any future re-render
- **T1 (s00, 0:04.5–0:10):** "and how meteorology uses it" ends at x ≈ 1075, 5 px from the enlarged map (x 1080) and next to the readout thermometer icon (x 1100). At 640 px it looks joined. Move the map and readout to x ≥ 1130 (map 1130–1860), or set the subtitle at 64 px.
- **T2 (s16b, 9:19–9:24):** the shadow → 5.00 m/s link still crosses the ∇T arrowhead, the 14 °C isotherm and the colour bar, and its tip lands on the "=". Route it below the map (from "shadow" down to y ≈ 760, then right to x ≈ 1270, then up), or end it at the left edge of "5.00".
- **T3 (s17, 9:58–10:44):** the 0.18 °C link crosses the "350" tick label. Start it at (476, 668) and end it at (600, 805) so that it passes left of "350".
- **T4 (s19a, 13:22–13:38, S9 carry-over):** the "colder air arriving" arrow runs through the "400" tick label. Bend it left of x = 450, or put the label at (300, 800).
- **T5 (s16a 8:38–9:02; s17 9:33–10:14):** the right 40 % of the screen is empty. Optional: set "10 × cos 60° = 5.00 m/s across" larger, or keep a copy of v·∇T = (shadow)(length) on the right.
- **T6 (s17, 10:40–10:59):** "towards warmer air" touches the map's right border. Shift it 30 px left, or drop "air".
- **T7 (s17b, s19a):** the map's "km" unit sits next to the graph's "13.0" tick. Move the "km" under "600", or start the graph 40 px further right.
- **T8 (s19c, 14:06–14:52):** hide the colour bar, as in s17, so that "T (°C)" stops reading as "⊢ map slides". Lift the local-rate thermometer icon off the bar axis. Attach "13.18 °C, an hour ago" to the dashed line with a short tick, or put it right of the dashed line.

### Verdict: PASS
All four must-fix items from review 6 are fixed:
- **M1:** the s17 layout.
- **M2:** no clipping.
- **M3:** the balloon is on its true path in s19a and s19c.
- **M4:** "18 km across" is on a horizontal bracket.

Of the should-fix items, S2–S8 and S10–S15 are fixed. S1 is half fixed and S9 is not fixed; both are now cosmetic (T2, T4). Physics, numbers, signs, captions and A/V sync are unchanged and correct. The advection stretch now answers the user's five questions on screen, in order, without visual contradictions. T1–T8 are optional polish. T1 (title card) and T2 are the most visible if another render happens.

The movie becomes `qa_pass`. The user watches it before `/approve-movie 0 ch00_dot_product_why`.

Disk at review: C: 85 GB free, G: 584 GB free.

## Overall: PASS (ch00_dot_product_why review 6b — `qa_pass`; T1–T8 optional)


---

# ch00_cross_product_why v1 review (review 1, commit d40480e)                    2026-10-26

Fresh-eyes review of the final render `movies/out/ch00/ch00_cross_product_why/1080.mp4` (2006.17 s). 468 frames
extracted with ffmpeg at every sentence end minus 0.25 s (build complete) and at every scene end, plus spot frames;
per-scene 640-px montages (the legibility test) in `reports/movies/ch00_cross_product_why/review1/montage/sNN.jpg`.
Frame names are `sNN_Skk_<seconds>.jpg` (scene, sentence, time), all under
`reports/movies/ch00_cross_product_why/review1/`. Builder stills on G: were not used.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_cross_product_why (review 1, v1 @ d40480e) | 2006.17 s (33:26; narration end 2003.65 + 2.5 hold) | 80.76 MB (**over the house hard cap of 80 MB**, §10.3; qa.json says WARN against 80/100) | 9 PASS + size WARN | **FIX** (picture contradicts the words in s21, s38, s23, s46; the narration itself is right) | PASS against the page images; **FIX** for rendering (s40/s42/s43 fractions, s42 collisions) | **FIX** (about 30 collisions or clipped labels, caption-band intrusions) | **FIX** (s18 reveals early, s15 hand turns late, empty halves) | PASS (494 cues, ≤ 16.8 cps, ≤ 42 chars, ≤ 2 lines; 1 cue of 0.98 s) | **FIX** (teal against violet in deuteranopia, ΔE 16) | n/a (none, as the house style requires) | **FIX** |

## What is right (checked, no action)
- **Narration physics: all correct.**
  - Cross-product chirality: x̂×ŷ=ẑ, ŷ×ẑ=x̂, ẑ×x̂=ŷ and the reverses; ⊙ out of the screen and ⊗ into it.
  - Views: from above anticlockwise → towards you; from below clockwise → away.
  - Bottle cap: opens anticlockwise and rises.
  - Torque: tightens clockwise from above → down; 0.3 × 50 × sin 90° = 15 N·m and × sin 30° = 7.5 N·m.
  - Rotation and Coriolis:
    - Ω follows west→east to the North Pole; Ω = 2π/86 164 s = 7.29×10⁻⁵ rad/s.
    - Ground speed |Ω×r| is 465 m/s at the equator, 465 cos 45° ≈ 329 m/s at 45°N, and 0 at the poles.
    - The Coriolis effect is called "apparent"; −2Ω×u does no work.
    - f = 2Ω sin φ, with φ = 90° − angle(Ω, k), is 1.03×10⁻⁴ s⁻¹ at 45°N, 0 at the equator, and negative in the SH.
    - The push −f k×u is to the right in the NH and to the left in the SH.
    - f|u| = 1.03×10⁻³ m s⁻², 2π/f = 16.9 h, and the inertial loop is 193.9 km across.
  - Winds:
    - The trades blow from the NE and SE, and the westerlies blow towards the east.
    - Ian is anticlockwise from above (NH) and Idai clockwise (SH); each inward stream turns to its right in s36.
    - The geostrophic derivation k×(k×u) = −u is right, and the low is on the left in the NH.
    - 400 Pa / 400 000 m = 1.00×10⁻³ Pa/m; fρ = 1.24×10⁻⁴; |u| ≈ 8.1 m/s, blowing east.
  - Strength is spoken only from IBTrACS: Ian landfall 130 kt = 66.9 m/s ("about 67"), Idai 105–115 kt = 54–59 m/s.
  - "All the way round" for the data claim (s38) uses the 150-km ring, with CHECK rows "all 16 > 0" and "all 16 < 0".
- **Equations versus the page images:**
  - I read `chapters/pages/ch02/p089.png` (2.79, 2.80) and `p108.png` (2.195–2.197).
  - −f k×u, f = 2Ω sin φ, f k×u = −(1/ρ)∇p and u = (1/(fρ)) k×∇p are consistent with them, symbol by symbol. Vallis writes ϑ, the movie writes φ (brief), and the movie drops the subscript z on ∇.
  - No equation numbers, book names or links are on screen.
- **House style:**
  - The opening sentence follows the house pattern exactly.
  - The title layout, gradient and type sizes match the reference (`review1/ref_dot_title.jpg` against `x_4.5.jpg`).
  - The end card matches the reference word for word, with the concept changed (`ref_dot_end.jpg` against `s48_S03_2003.10.jpg`).
  - No headings, badges, URLs or "thanks for watching"; "air parcel" is used; spoken bridges, not cards.
- **The s11 hand (the orchestrator's question):**
  - It now reads clearly as a right-hand **thumbs-up**, not a rude gesture.
  - The curled fingers wrap anticlockwise seen from the thumb tip (front → right → back), which only a right hand can do. The gold curl arrow agrees, and so do the thumb and the violet arrow.
  - Chirality is also right in every s14 and s15 pose that I checked: thumb +ẑ, +x̂ and +ŷ, then −ẑ, −x̂ and −ŷ.
  - **But** see M3: the fingers never visibly lie along a, and the screen is unbalanced.

## MUST fix
- **M1 · 28:12–28:43 s42 — the geostrophic derivation collides (the orchestrator's r5/f51662 issue is still in the final render).**
  - Frame: `s42_S06_1722.03.jpg`.
  - The problems:
    - Line 4's ρ sits on line 5's numerator "1".
    - The "pressure push" brace label overlaps line 2's numerator "1".
    - The gold underline runs through "fρ".
    - "geostrophic wind" is only about 20 px from ∇p.
    - All 5 lines are shown at once; the house CalcStack allows ≤ 3 lines with older lines dimmed.
    - Every −(1/ρ) has a fraction bar as short as a minus sign, so it reads "− − 1/ρ" (also s40 27:17, s43, s44).
    - The planned rose strike of the two minus signs is missing.
  - The fix:
    - Use a CalcStack of 3 lines, dropping the oldest; pitch ≥ 1.5 × the fraction height.
    - Use `\dfrac{1}{\rho}` with padding (`\dfrac{\,1\,}{\,\rho\,}`) so the bar is clearly wider than the minus.
    - Put the underline 20 px below the descender of ρ.
    - Move "geostrophic wind" under the underline.
    - Add the strike.
- **M2 · 27:12–27:18 s40 — the "high → low" keyword covers the numerator "1" of −(1/ρ)∇p.**
  - Frame: `s40_S05_1637.83.jpg`.
  - Fix: put the keyword at least 40 px above the equation, or to its left; widen the fraction bar as in M1.
- **M3 · 06:29–06:53 s11 — the hand never does the move the voice describes.**
  - Frames: `s11_S02_0396.38.jpg`, `s11_S06_0412.77.jpg`, `s11_S99_0413.70.jpg`.
  - The problems:
    - The hand is already a thumbs-up fist on "Hold out your right hand".
    - On "point your fingers along vector a" the straight fingers point to the screen-right, parallel to **b**, and float a hand-height above the origin.
    - On "curl towards b" nothing sweeps from a to b.
    - The keyword "curl · thumb · arrow agree" is cut at the right frame edge.
    - The "a" label and the tip of a are in the caption band (y ≈ 1040).
    - The right half is empty during the orbit (06:46–06:53).
  - The fix:
    - Start with an open flat hand whose wrist is behind O and whose fingers lie **on** a.
    - Animate the curl so the fingertips travel along the gold arc from a to b.
    - Keep the keywords visible during the orbit, at x ≤ 1800.
    - Raise the camera target so a ends above y 860.
    - Optional: scale the hand up 1.3× and move the whole group 150 px right, so the screen is balanced.
- **M4 · 14:02–14:31 s21 — the picture contradicts the words.**
  - Frames: `s21_S01_0845.08.jpg`, `s21_S04_0858.90.jpg`, `s21_S05_0864.48.jpg`.
  - S1–S3: the τ arrow points down **under the opaque plate**, so only a floating "τ" and "−" are visible on "the torque arrow points along the bolt's axis".
  - S5–S6 ("a clockwise turn makes the arrow point down, away from you"): the main view still shows the reversed push, with τ **up** ("loosens"); only the inset shows clockwise/⊗.
  - Fix:
    - Make the plate translucent or draw τ above it.
    - Return to the clockwise push with τ down for S5–S6.
- **M5 · 25:53–26:05 s38 — the demo of "anticlockwise → r×u up" is drawn on the wrong storm.**
  - Frame: `s38_S05_1564.80.jpg`.
  - The thumbs-up hand, the r/u mini arrows and the keyword sit on the **Idai** panel, whose columns all point down, and spill outside the panel.
  - Fix: move the hand inset to one Ian ring point inside the Ian panel, and put the keyword under Ian.
- **M6 · 15:44–16:05 s23 — wrong and overlapping labels.**
  - Frames: `s23_S08_0941.15.jpg`, `s23_S11_0951.33.jpg`, `s23_S13_0964.27.jpg`.
  - The problems:
    - In the wind-north case the CalcStack still shows the east-wind result "(0, 5, 0)" beside "k × u: west".
    - The labels "u" and "east" overlap, and so do "k × u" and "north".
    - The "−k × u" label is garbled: two labels are drawn on top of each other.
  - The fix:
    - Swap the calc to `k × u = (0×0 − 1×5, 1×0 − 0×0, 0) = (−5, 0, 0)` for the second case.
    - Offset the tip labels from the axis words.
    - Draw a single "−k × u" label.
- **M7 · 11:00–12:17 s18 — the cases are revealed early and drawn wrongly.**
  - Frames: `s18_S01_0664.98.jpg`, `s18_S03_0672.62.jpg`, `s18_S14_0726.17.jpg`, `s18_S15_0733.15.jpg`.
  - The problems:
    - 11:00–11:08 is an almost empty screen.
    - At 11:12 all three panels already show their final states (the 3×2 rectangle and the opposite q) before the voice reaches them (11:27, 11:43).
    - At 12:05 "same way or opposite → 0" is overwritten by "right angle → longest" (the "0" is hidden under the "r").
    - At 12:13 the sweep fills a **pentagon**, not a parallelogram, and the downward p×q is a stub hidden behind q.
  - The fix:
    - Show the panels empty until each case is spoken.
    - Use two separate keyword lines.
    - Build the polygon from the 4 corners O, p, p+q, q only.
    - Draw p×q in front, with its "(0, 0, −6)" label.
- **M8 · 31:09–31:46 s46 — the real-wind comparison does not show what the voice says.**
  - Frame: `s46_S05_1894.80.jpg`.
  - The problems:
    - Long violet "geostrophic" arrows lie over land near the low (Britain/France), crossing the isobars at large angles. This contradicts "they run along the isobars" and the storyboard's "sea points only".
    - The 13°–21° turn of the 10-m wind is not visible in the zooms (only a tiny gold tick).
    - The dashed zoom links cross the "real wind / geostrophic" keywords.
  - The fix:
    - Apply the NE 50m land mask to the arrows, as for the isobars.
    - Draw a gold angle arc labelled "13°" and "21°" in each zoom.
    - Route the links above the keywords.
- **M9 · Caption band intrusions (house: y 880–1040 stays empty).**
  - The intrusions:
    - s10 06:25, "down?" and the ghost arrow (`s10_S09_0388.50.jpg`).
    - s11 06:53, a and "a".
    - s12 07:11, "a".
    - s15 09:10–09:25, the "b × a" arrow and label (`s15_S08_0550.85.jpg`).
    - s28 19:37–19:46, "k · up" (`s28_S10_1185.70.jpg`).
  - Fix: raise the camera targets / shrink the 3-D groups so everything ends at y ≤ 860.
- **M10 · Things cut at the frame edge.**
  - The cuts:
    - s11 06:53, "agree".
    - s34 22:59–23:33, "named from where they bl…" (`s34_S04_1385.97.jpg`).
    - s25 16:53–17:44, the Ω axis runs off the top with no arrowhead or label (`s25_S06_1045.35.jpg`).
    - s28 18:55–19:46, Ω and k at the site run off the top, and the k label at 19:38 is cut at the left edge (`s28_S02_1143.92.jpg`, `s28_S08_1177.97.jpg`).
    - s22 14:34, the τ arrowhead and "up" touch the top edge (`s22_S02_0879.10.jpg`).
    - s47 32:07, the recap hand is cut by the left edge (`x_1932.0.jpg`).
  - Fix: keep everything inside x 80–1840, y 40–860.
- **M11 · Empty half for more than 3 s (house §5, U-M4.2).**
  - The cases:
    - s03 00:57–01:16, right half (19 s).
    - s09 05:01–05:26, right half (25 s; `s09_S05_0321.32.jpg`).
    - s10 05:54–06:05 (11 s).
    - s13 07:21–07:29 (8 s).
    - s21 14:02–14:19 (17 s, one keyword).
    - s23 15:02–15:13 (bare grid).
    - s24 16:05–16:30, right half (25 s; `s24_S05_0987.05.jpg`).
    - s47 recap beats S2–S3 and S6–S7 (left half empty) and S13–S14 (right half empty).
  - Fix: reveal the scene's goal keyword or first calculation line with its sentence, and give each recap beat its left mini picture plus right keywords.
- **M12 · Other collisions.**
  - The collisions:
    - s05 02:45, "east" touches "a = (5, 1, 0)" (`s05_S06_0165.03.jpg`).
    - s08 04:59, "θ" overlaps "14"; the 14 bracket floats away from a×b; the gold link crosses a (`s08_S09_0299.88.jpg`).
    - s09 05:53, the area link's arrowhead lands on "≈" and crosses "a" (`s09_S11_0353.35.jpg`).
    - s20 13:51–14:01, "F = 50 N", "30°" and "r = 0.3 m" pile up, and "F" sits under "torque" (`s20_S09_0832.05.jpg`, `s20_S11_0841.10.jpg`).
    - s24 16:35–16:51, the stacked fractions 2π/(23 h 56 min) and 2π/86 164 s overlap.
    - s25 17:07–17:44, "v" sits on "6371 km".
    - s26 17:55–18:00, "without the effect" touches "turning with Earth" (`s26_S05_1083.45.jpg`).
    - s27 18:37–18:52, "push", "u" and "east" pile up.
    - s28, "shadow" sits on "90° − φ", and "φ < 0" on Ω.
    - s37 25:18–25:27, "observed" sits on "Madagascar" (`s37_S06_1526.53.jpg`).
    - s39 26:43–26:51, the "isobars" pointer crosses the colour bar and "1006".
    - s43 28:58–29:16, "sets the speed" sits on "L low on the left" (`s43_S05_1743.95.jpg`).
    - s44 29:31–29:40, the link crosses "45°N" and its arrowhead sits on "400 000 m" (`s44_S05_1780.33.jpg`).
  - Fix: placeLabels with a ≥ 12-px gap; route links around text.
- **M13 · 17:07–17:44 s25 — v = Ω×r, the result of the scene, is invisible.**
  - It points along the line of sight, so it shows as an orange dot.
  - Fix: turn the camera so east lies in the picture plane, and draw v ≥ 200 px.
- **M14 · 08:00–08:04 s14 — on "curl them towards y hat", ŷ points straight into the screen.**
  - Its label sits on the thumb and the ẑ shaft (`s14_S02_0483.73.jpg`).
  - Fix: start beat A from the az 225° view, so x̂ and ŷ are both visible.
- **M15 · 22:48–23:00 s34 — "turned left" has nothing visible to point to.**
  - The SH poleward arrow from the South Indian high is behind the globe (`s34_S03_1379.67.jpg`).
  - Fix: use the South Atlantic high, or tilt the camera to show both.
- **M16 · 16:20–16:30 s24 — "curl your fingers the way Earth turns" uses a hand about 120 px tall.**
  - The curl cannot be seen.
  - Fix: show a 300-px inset of the hand on the axis.
- **M17 · 17:56–18:26 s26 — the NH and SH Coriolis tracks are about 40 px curves at full-globe zoom.**
  - At 640 px they are illegible; the SH track sits on the globe's lower limb.
  - Fix: add two zoom windows on the tracks, as s31 does.
- **M18 · Size: 80.76 MB is over the house hard cap for long movies.**
  - HOUSE_STYLE §10.3 sets the budget at 60 MB and the hard cap at 80 MB.
  - `movie_qa.py` judged it against 80/100 and so only warned.
  - Fix: re-encode at crf 21–22 (or 64-kbps-lower AAC), or record a user-approved exception; align the movie_qa thresholds with the house style.

## SHOULD fix
- **S1 · 00:32 s02** — "= 8" wraps onto a second line at a larger size (`s02_S04_0038.27.jpg`). Keep it on one line.
- **S2 · 01:20–01:28 s03** — on "push along the door" the F arrow is hidden along r, behind the translucent door. Draw it on top, slightly offset.
- **S3 · 02:16–03:31 s05–s06** — a and b lose their tip labels on the 3-D floor while the voice says "part of vector a". The ẑ label sits on b.
- **S4 · 02:49 s06** — the "x y z" slot letters are not centred under the slots, and the slot line ends at x 1895, beyond 1840.
- **S5 · 04:30 s08** — the gold underline under "sin θ" is shifted right, and the multiplied-out line reaches x 1868.
- **S6 · 06:54–07:20 s12** — the index and middle fingers are short stubs floating above the arrows; the index is foreshortened to a dot. Lay the fingers on a and b.
- **S7 · 07:21–07:55 s13** — the bottle and block are dark navy on the dark background, and the a/b marks on the cap are about 6 px.
  - While the voice says "moves along their cross product", the screw drives **in** (dashed down) with no first/second marks.
  - Show the a→b turn on the screw head with the up arrow.
- **S8 · 08:42–09:25 s15** — several problems:
  - The hand stays thumbs-up through "curl them towards x hat… turn your hand over" and flips only at about 08:51.
  - The rose "−" glyph is drawn on the back of the hand.
  - The "flip glyph" is a stray gold ")".
  - a and b swap colours (b teal) against the house rule that a quantity keeps its colour; the "first: b" keyword does not fully save it.
- **S9 · 09:26–10:21 s16** — the arrow-tip sketch reads like a car logo and sits at x 1865. No hands appear in s16: the mini-hands were dropped.
- **S10 · 12:17–13:10 s19** — problems in the last row:
  - It overflows the cross column.
  - "k × ∇p" appears 2 min before k and about 14 min before ∇p are defined.
  - The KaTeX in the cells sits above the text baseline.
- **S11 · 13:10–14:02 s20** — the plate fills the caption band, and the maths sits on the plate.
- **S12 · 14:46–15:01 s22** — the downward τ is hidden inside the door, and the "down" label sits on the door.
- **S13 · 16:00–16:05 s23** — the "right" arc spans 180° from k×u to −k×u. Draw 90° from u to −k×u.
- **S14 · 18:29–18:52 s27** — the −2Ω×u push looks almost parallel to u and has no visible right-angle tick, in the scene whose point is "always at a right angle".
- **S15 · 20:53–21:02 s31** — two featureless dark-blue panels; the sense arcs have no arrowheads. Show where the windows sit on the globe first.
- **S16 · 22:30–22:43 s33** — during the flight the keywords sit over the busy globe, and the globe fills the caption band. The illustrative turning arrows in s33 and s34 are about 30 px at 640 px.
- **S17 · 23:34–25:40 s35–s37**:
  - The GOES patch shows hard rectangular edges, which read as a pasted box.
  - "Florida" and "Mozambique" sit on the cloud shields.
  - "spirals inwards" is crammed under "from above" (`s36_S12_1495.58.jpg`).
- **S18 · 24:42 s36** — "All the way round" is spoken over a 250-km arc and 300-km arrows. The data CHECK exists only for the 150-km ring (s38). Shrink the sketch to ≤ 150 km, or say "around the centre".
- **S19 · 26:24–29:56 s39–s44**:
  - The colour bar puts 1010 at the top while the map has 1010 at the bottom.
  - The km axis has no unit.
  - The "1010" isobar label is clipped by the map's bottom edge.
- **S20 · 27:19–28:12 s41** — the parcel arrows are about 40 px at 640 px, and the "=" between the pushes is a tiny box.
- **S21 · 28:43–29:16 s43** — the equation pieces are spread with large gaps, "quarter turn left" and "across the isobars" touch, and there is a stray mark in "twice às close".
- **S22 · 29:16–30:15 s44** — the CalcStack shows 6–7 lines (house ≤ 3), and "4 hPa = 400 Pa" sits alone at the bottom.
- **S23 · 30:15–31:08 s45**:
  - The keyword stack grows to 9 items with touching lines.
  - At 31:04 the gold circles mark the secondary western low, not "where the isobars crowd".
- **S24 · 31:09–31:46 s46**:
  - The two zooms are boxed panels (house: no boxes).
  - "Over the sea, they match… within a few per cent" generalises from two check points (5.9 % and 5.2 %, 2.7° and 4.1°). Say "at these two places".
- **S25 · colour-blind safety of the new violet #a58be0.**
  - CIEDE2000 distance to teal: 36 for normal vision, **16 deuteranopia**, 22 protanopia, 27 tritanopia.
  - The two colours have similar lightness.
  - Against orange it is ≥ 28 and against gold ≥ 23 in every vision type: fine.
  - Where teal and violet arrows are compared side by side by hue alone (s45–s46 real against geostrophic), add a second cue: dashed shafts or open heads for the geostrophic arrows.
- **S26 · 00:00–00:10 s00** — the Part-A floor grid runs under "uses it". The subtitle must be ≥ 50 px clear of the animation (`x_4.5.jpg`).
- **S27 · glossary order**:
  - "Belts of high pressure" and "subtropical highs" (21:46) come before pressure is introduced (26:24).
  - "Density" (27:12) is never explained in plain words ("the mass of one cubic metre of air").
- **S28 · 20:21–20:53 s30** — the wind and push arrows are unlabelled.

## NICE
- **N1** · 25:18.100 — the cue "Near its peak," lasts 0.98 s (house minimum 1 s).
- **N2** · Length 33:26 is longer than the brief's expected 22–27 min. The user allowed more than 25; worth saying so when handing over.
- **N3** · 33:00 recap — the ∇· and ∇× icons are unexplained (a pointer only, acceptable).
- **N4** · Say once that ∇p here means the change of pressure along the ground (Vallis' ∇_z).
- **N5** · 10:24 s17 — "a × b" sits over b.
- **N6** · 12:50 s19 — the "work" mini picture (a grey bar) is not readable as a sled.

## U-CP.5 coverage (every way, every direction)
| Requirement | Where | State |
|---|---|---|
| Curl grip | s11, s14, s15, s21, s24, s38 | present; s11 does not show the fingers along a (M3); s24 hand too small (M16); s38 on the wrong storm (M5) |
| Flat (index/middle/thumb) | s12 | present, but the fingers are stubs (S6) |
| Bottle cap and screw | s13 | present; the screw lacks first/second marks (S7) |
| x̂×ŷ=ẑ cycle and reverses, the hand turned to each pose | s14–s15 | present and chirally right; ŷ hidden at 08:00 (M14); turn late (S8) |
| Up/down, left/right, into/out of the screen | s16 | present (flat SVG, no hands; mini-hands dropped) |
| From the top, from below, from the side | s17 | present and right (no hand) |
| Order swap flips the thumb | s15 | present (late, S8) |
| three.js orbit | s11 (360°), s12 (+90°) | present |

## Overall: FIX (ch00_cross_product_why review 1 — M1–M18; S1–S28 recommended)
- The teaching arc, the narration and the physics are sound, and the house opening, voice and end card match the reference.
- The render is not ready for the user:
  - In four places the picture contradicts the words (M4 s21, M5 s38, M6 s23, M8 s46).
  - s18 reveals its cases before they are spoken and draws a wrong shape (M7).
  - The s11 right-hand rule never shows the fingers along a (M3).
  - There are many collisions and clipped labels (M1, M2, M10, M12), the most visible in the s42 derivation.
  - Seven scenes leave half the screen empty for 8–25 s (M11).
  - The file is 0.76 MB over the house hard cap (M18).
- After the fix loop: re-render the changed scenes, re-run `tools/movie_qa.py --storyboard`, then review again.

Disk at review: C: 83 GB free, G: 581 GB free; review frames 47 MB (local, not committed).


# ch00_cross_product_why v2 review (review 2, commit 414c736)                    2026-10-26

Fresh-eyes review of the fix-loop-1 render `movies/out/ch00/ch00_cross_product_why/1080.mp4` (2006.17 s, 77.49 MB).
I extracted 471 frames with ffmpeg: one at every sentence end minus 0.25 s, one at every scene end, and extra frames
around anything suspicious. All review-1 timestamps were covered, because the timing is unchanged.
- Per-scene 640-px montages (the legibility test) are in `reports/movies/ch00_cross_product_why/review2/montage/`.
- Frame names are `sNN_Skk_<s>.jpg` and `x_<s>.jpg`, all under `reports/movies/ch00_cross_product_why/review2/`.
- I also scanned the caption band (y 880–1040) of the final MP4 at 2 fps.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_cross_product_why (review 2, v2 @ 414c736) | 2006.17 s (33:26) | 77.49 MB (inside the accepted 60–80 MB band, under the 80 MB hard cap) | 9 PASS + size WARN | **FIX** (in s30 the velocity arrow is not tangent to the inertial circle; this was already in v1 and review 1 missed it) | PASS (s42 is clean; the s19 storyboard row is stale) | **FIX** (s04 door covers the equations; s23 "leftanticlockwise"; in s11/s12 **b** is hidden behind the hand) | **FIX** (s04 and s15 leave the right half empty for 13–14 s) | PASS (494 cues, QA PASS) | PASS (dashed geostrophic arrows plus a legend give a second cue; 0 flashes) | n/a (none, as the house style requires) | **FIX** |

## Review 1 items, verified on the v2 frames
| item | state | evidence |
|---|---|---|
| M1 s42 derivation | **FIXED**: 3 lines; padded fraction bars clearly longer than the minus; rose strike on both minus signs; gold underline about 20 px under fρ; "geostrophic wind" below | `s42_S06_1722.03.jpg`, `s42_S04_1712.10.jpg` |
| M2 s40 keyword | **FIXED**: "high → low" sits beside the equation, not on the 1 | `s40_S05_1637.83.jpg` |
| M3 s11 hand | **FIXED** as specified: open hand, fingers along a (teal), gold fingertip trace to b at 06:38–06:40, thumb rises, keywords in the right half at x ≤ 1700, a above y 860. **New problem**: b is never visible (see N-M4) | `x_s11.jpg`, `s11_S02_0396.38.jpg`, `s11_S04_0405.90.jpg` |
| M4 s21 plate | **FIXED**: translucent plate; τ down for the clockwise case; thumb-down hand at 14:13–14:16 | `x_s21.jpg`, `s21_S05_0864.48.jpg` |
| M5 s38 demo | **FIXED**: hand inset with r/u inside the Ian panel; keyword under Ian | `s38_S05_1564.80.jpg` |
| M6 s23 | **FIXED**: (0×0−1×5, 1×0−0×0, 0) = (−5, 0, 0); single "−k × u" label. **New problem**: typo (N-M3) | `s23_S11_0951.33.jpg`, `s23_S13_0964.27.jpg` |
| M7 s18 cases | **FIXED**: each panel appears with its sentence; 4-corner parallelogram; p × q = (0, 0, −6) in front, dashed down | `montage/s18_1.jpg`, `s18_S16_0736.12.jpg` |
| M8 s45/s46 | **PARTIAL**: sea-only arrows, numbered round lenses and no box links are done. Still open: the 13°/21° "arcs" are a 6-px tick, and the labels sit on the violet arrowheads (S-new 12) | `s46_S05_1894.80.jpg`, `x_s46_lens_crop_1894.8.jpg` |
| M9 caption band | **FIXED**: the 2-fps scan finds one 0.3-s transient (10:35, s17 camera flip, "a × b" label) | `montage/x_s17flip.jpg` |
| M10 edges | **FIXED**: s11 keywords, s34 "named from where they blow", s25 Ω with head and label, s28 Ω/k labels, s22 τ head and s47 recap hand all sit inside the frame | montages s11, s22, s25, s28, s34, s47 |
| M11 empty halves (listed cases) | **FIXED** for s03, s09, s10, s13, s21, s23, s24 and the s47 recap beats. **Other empty halves remain** (N-M5, S-new 15) | montages |
| M12 collisions (listed) | **FIXED** for all 13 listed spots (s05, s08, s09, s20, s24, s25, s26, s27, s28, s37, s39, s43, s44). New collisions are listed below | montages |
| M13 s25 v | **FIXED**: v is orange and about 260 px, perpendicular to r and Ω | `s25_S06_1045.35.jpg` |
| M14 s14 view | **FIXED**: x̂ and ŷ are both visible at 08:00 | `s14_S02_0483.73.jpg` |
| M15 s34 SH arrow | **FIXED**: the South Atlantic high's poleward arrow is turned left (east) and visible (still small, S16) | `s34_S03_1379.67.jpg` |
| M16 s24 hand | **FIXED**: about 300-px inset, thumb on the Ω axis, curl anticlockwise from above | `s24_S05_0987.05.jpg` |
| M17 s26 tracks | **FIXED**: two lenses, NH bends right and SH bends left | `s26_S10_1105.33.jpg` |
| M18 size | **FIXED**: 77.49 MB, under the 80 MB hard cap | qa.json |
| S1 · S2 · S3 · S4 · S5 | FIXED | s02, s03, s05, s06, s08 montages |
| S6 s12 fingers | **NOT FIXED**: the index lies along a, but the middle finger points straight up next to the thumb and a × b, and b is hidden (N-M4) | `s12_S04_0428.02.jpg` |
| S7 · S8 · S9 · S11 · S12 · S13 · S14 · S15 · S18 · S19 · S21 · S25 · S26 · S28 | FIXED | montages |
| S10 s19 | FIXED on screen: v·∇T sits beside advection, and k×∇p is gone. **The storyboard is stale** (S-new 1) | `s19_S13_0789.70.jpg` |
| S16 s33/s34 | PARTIAL: the flight keywords overlap the map's faded edge; the turning arrows are still about 25–30 px at 640 px | `s33_S09_1362.15.jpg` |
| S17 s35–s37 | PARTIAL: "spirals inwards" is fixed. Still open: 24:08–24:10 swaps to a greyscale image with a hard black rectangle; the s37 Ian thumbnail still shows a hard-edged patch | `x_s36.jpg`, `s36_S03_1449.70.jpg`, `s37_S99_1540.75.jpg` |
| S20 s41 | PARTIAL: the arrows are fine; the "=" between the pushes is still a tiny glyph | `s41_S09_1679.20.jpg` |
| S22 s44 | PARTIAL: "4 hPa = 400 Pa" now sits at the top, but the stack still shows 6–7 lines (older lines dimmed) | `s44_S08_1797.85.jpg` |
| S23 s45 | PARTIAL (as the builder says): 8 keyword items remain, and at 31:07 one gold circle is still on the secondary western low, where the arrows are short | `s45_S12_1867.78.jpg` |
| S24 s46 | FIXED for the boxes (round lenses) and for "at points 1 and 2:" | `s46_S03_1883.92.jpg` |
| S27 glossary | FIXED: high pressure and density are explained in plain words. Both glosses are about 36 px high (S-new 13) | `x_s40_density_crop.jpg` |

**Physics re-checked on the v2 frames: all correct except s30 (N-M2).**
- Chirality of the hand poses:
  - s11 orbit, s14 x̂×ŷ=ẑ / ŷ×ẑ=x̂ / ẑ×x̂=ŷ.
  - s15 reverses: thumb −ẑ, −x̂, −ŷ.
  - s16 mini-hands: y×z → right, z×y → left, z×x → up, x×z → down.
  - s21 thumb down = tightens.
  - s24 thumb to the North Pole.
  - s38 inset r→u anticlockwise → up.
- ⊙/⊗:
  - ⊙ = towards you and ⊗ = away in s16 and s17.
  - In s38 Ian is ⊙ (violet columns up) and Idai is ⊗ (rose columns down).
- Turning by hemisphere:
  - NH turns right and SH turns left in s26 (lenses), s29, s31 (NH loop clockwise from the top start, SH anticlockwise from the bottom start), s33 and s34.
  - Ian is anticlockwise from above (south side flows east) and Idai is clockwise (south side flows west).
  - In s36 the turned streams follow the narration: from the south → east, from the east → north.
- Geostrophic wind and the numbers:
  - Low on the left (NH) in s41, s43, s44 and s45.
  - s25: 465 / 329 / 0 m/s.
  - s20: 15 / 7.5 N·m.
  - s44: 1.00×10⁻³ Pa/m, fρ = 1.24×10⁻⁴, 8.1 m/s, and the units reduce to m/s.
  - s28: f = 1.03×10⁻⁴ s⁻¹; the SH shadow is negative (drawn opposite k).
  - s42: the algebra is right.

## MUST fix
- **N-M1 · 01:59.5–02:05 s04 — the door picture flies over the equations.**
  - Frames: `x_0122.50.jpg`, `s04_S07_0124.10.jpg`, `montage/x_s04door.jpg`.
  - During "A turning also has an axis…", the door enlarges onto "wind · push west = 0" and covers "west = 0" for about 5 s.
  - Fix: put the door in free space (for example x 1450–1750, y 560–860), or fade the two equations to 30 % first.
- **N-M2 · 20:43–20:53 s30 — the inertial-circle picture is physically inconsistent. It was the same in v1; review 1 missed it.**
  - Frames: `x_1246.00.jpg`, `montage/x_s30.jpg`, `s30_S06_1247.92.jpg`.
  - The velocity u is drawn with its tip on the parcel, but it is not tangent to the gold trace:
    - The trace leaves the start point heading south, while u = east.
    - At t = 4.7 h, u points south while the trace runs west under it.
    - At 8.5 h, u points west at the circle's leftmost point.
  - The push is tangent to the trace, not pointing to the circle's centre.
  - The trace is rotated 90° from the arrows. A parcel starting east and turning right moves on a circle whose centre is south of the start, so the start is the **top** of the circle (as s31 draws correctly).
  - Fix: build the trace from the same integration as the arrows (circle centre = start + (0, −U/f)), or rotate the trace by −90° about the start point. Then check that u is tangent and the push points to the centre in 3 frames.
- **N-M3 · 16:00–16:05 s23 — a text bug: "quarter turn leftanticlockwise".**
  - Frames: `s23_S12_0960.05.jpg`, `s23_S13_0964.27.jpg`.
  - The two keyword spans are joined with no space or separator.
  - Fix: "quarter turn left · anticlockwise from above" (the house rule: clockwise words always carry their viewpoint).
- **N-M4 · 06:30–06:46 s11 and 06:54–07:17 s12 — b, "the second arrow", is hidden behind the hand.**
  - Frames: `s11_S02_0396.38.jpg`, `s11_S04_0405.90.jpg`, `s12_S04_0428.02.jpg`.
  - Only the orange "b" label shows, and at 06:45 and 07:08 it sits on the a × b arrowhead and on the gold curl arrowhead.
  - The narration says "curl your fingers towards b, the second arrow" and "middle finger along b".
  - In s12 the middle finger also points straight up beside the thumb, so a viewer cannot tell "middle along b" from "thumb up" until the camera turns at 07:17 (S6 is still open).
  - The fix:
    - Choose a camera azimuth where b (1, 3, 0) recedes visibly beside the hand, for example the view s11 reaches at 06:49; alternatively make the hand body 60 % opaque.
    - Put the b label at b's tip, ≥ 12 px from a × b.
    - In s12, lay the middle finger along the visible b.
- **N-M5 · Empty right half for more than 10 s (house §5, U-M4.2), not listed in review 1.**
  - The cases:
    - s04 01:36–01:50: only a 30-px door icon (`s04_S02_0100.42.jpg`, `s04_S03_0103.88.jpg`).
    - s15 08:39–08:53: only a dim, small "x̂ × ŷ = ẑ" (`s15_S01_0521.27.jpg`, `s15_S04_0533.08.jpg`).
  - Fix:
    - s04: show "wind ↑ · push east / push west" or the question "which way does the push go?" with S02–S03.
    - s15: show "ŷ × x̂ = ?" (then "−ẑ") with S02–S03.

## SHOULD fix
1. **s19 storyboard**: `on_screen_eq_extra` for s19 still lists `\mathbf k\times\nabla p`, which v2 no longer draws there.
   - The equations gate passes only because k×∇p appears later, in s42.
   - Update the storyboard row so that the contract matches the screen; this is a documentation fix, no re-render needed. It does matter for traceability.
2. **11:08–11:13 s18**: "p = (3, 0, 0)" fades out exactly while the voice reads "p has components three, zero and zero", and the three panels never label p.
   - Frame: `montage/x_s18.jpg`.
   - Fix: keep the p line at the top through S03–S16, and put "p" at each panel's teal tip.
3. **Keywords run into the colour-bar tick labels.** They read as "1004 pressure", "1006 high → low", "1010 pressure push" (s39–s40, 26:31–27:19) and "1200 km geostrophic balance" (s41, 28:06–28:12).
   - Frames: `s40_S04_1631.47.jpg`, `s41_S10_1686.38.jpg`.
   - Fix: start the keyword column ≥ 60 px right of the tick labels.
4. **15:31–15:51 s23**: the "east" axis word ends 20 px before the calculation "k × u = (…)" on the same baseline (`s23_S11_0951.33.jpg`). Fix: move "east" below the grid edge, or start the calculation at x ≥ 1100.
5. **18:52–18:54 s27**: after the camera turn, "push" sits on the k and Ω shafts (`s27_S06_1133.50.jpg`). Fix: anchor the label on the push's outer side.
6. **19:42–19:47 s28 (SH case)**: the "Ω" label sits on the latitude arc, and "φ < 0" is placed far away on the globe (`s28_S10_1185.70.jpg`). Fix: Ω label at the Ω arrow's tip; "φ < 0" beside the gold arc.
7. **s44**:
   - 29:40: the gold link from "400 km" lands its arrowhead on the ∇ of |∇p|; it should end at "400 000 m", 12 px clear (`s44_S05_1780.33.jpg`).
   - 30:07–30:15: the 8.1 m/s arrow starts on the "400 km" label (`s44_S99_1815.65.jpg`).
8. **06:51–06:53 s11 orbit**: the "a" label sits under "a × b" (`x_0412.00.jpg`).
9. **16:20–16:30 s24 inset**: the curl ellipse runs through its own label, which reads "west-→-east" (`s24_S05_0987.05.jpg`). Fix: move the label under the ellipse.
10. **16:53–17:44 s25**:
    - The two cut-away half-discs read as a heart shape.
    - The globe's polar texture shows concentric ring artefacts (top left).
    - Frame: `s25_S06_1045.35.jpg`.
    - Fix: one meridional cut, or a translucent globe; fix the pole UVs.
11. **17:56–18:04 s26**: "without the effect" sits on the globe's limb, about 250 px from the dashed path it names (`s26_S05_1083.45.jpg`). Fix: put it next to the dashed line, or drop it once the lenses appear.
12. **31:18–31:36 s46 lenses**:
    - Only a 6-px tick marks each angle, and "13°" and "21°" sit on the violet arrowheads.
    - The 10-m wind is drawn in the same teal as the "real wind" legend (which means 1.5 km).
    - Frame: `x_s46_lens_crop_1894.8.jpg`.
    - Fix:
      - Draw a gold arc (r ≥ 60 px) between the geostrophic and the 10-m arrow, with the label outside the ring.
      - Draw the 10-m wind as a hollow or shorter teal arrow labelled "10 m".
13. **Two new glosses are about 36 px high**, below the 44-px floor: "the mass of one cubic metre of air" (s40, 27:12) and "the air presses down harder" (s32, 21:46).
    - Frames: `x_s40_density_crop.jpg`, `s32_S07_1313.15.jpg`.
    - Fix: 44 px.
14. **s47 recap 31:46–32:12**:
    - b collapses to a dot because of the camera.
    - The recap introduces "⊥", which the movie never defines.
    - Frame: `s47_S01_1912.35.jpg`.
    - Fix: turn the camera so b shows; write "a × b at right angles to a and b", or keep the right-angle tick and drop ⊥.
15. **Shorter empty halves (3–7 s)**:
    - s16 09:26–09:32.
    - s20 13:11–13:17.
    - s41 27:49–27:53.
    - s36 24:42–24:48 (only the title).
    - Fix: reveal the scene's goal keyword with the first sentence.
16. **24:08–24:10 s36**: the hard cut from true colour to a greyscale image with black rectangles reads as a pasted box (S17). Fix: crossfade over ≥ 1 s and feather the patch edges, or stay in true colour.
17. **31:07 s45**: one gold circle still marks the secondary western low (S23). Move it to the crowded isobars south-west of the main low.

## NICE
- **N1–N6** from review 1 are unchanged. N2 (33:26 is longer than the brief) is still worth saying at hand-over.
- **00:04.5 title teaser**: a stray rose "−" floats under p, and the label reads "(0, 0, −0.41)" (`x_0004.50.jpg`). Harmless, but the dot reference's teaser had no orphan glyph.
- **10:35**: a 0.3-s caption-band transient during the s17 camera flip.
- **s33 22:36**: the "lean west" chevrons sit only on the northern side of the equator; the narration says "on either side".
- **s46**: point 2 sits on a coastline at 640 px. Confirm it is a sea grid point (the CHECK row says sea points).
- **s42**: the small unlabelled pressure-map thumbnail on the left is decoration with no role.
- **s12**: the keyword "index × middle = thumb" has uneven spacing around × and =.
- **s08 05:00**: a 7-line stack, with the product line starting 70 px left of the others.

## Overall: FIX (ch00_cross_product_why review 2 — N-M1 … N-M5; SHOULD 1–17 recommended)
- Fix loop 1 worked. 17 of 18 review-1 MUST items are fixed, and the 18th (M8) is partly fixed; the s42 derivation, the s21/s38/s23 picture-vs-narration problems and the s18 build now read cleanly.
- What still blocks `qa_pass`:
  - One physics error that review 1 missed: the s30 inertial circle is rotated 90° from its velocity arrows.
  - One visible typo (s23).
  - The s04 door covering the equations.
  - The hidden b in the two key right-hand-rule scenes (s11, s12).
  - Two right halves empty for 13–14 s (s04, s15).
- All five are local fixes.
- After the fix loop:
  1. Re-render s04, s11, s12, s15, s23 and s30, plus any SHOULD scenes taken.
  2. Re-run `tools/movie_qa.py --storyboard`.
  3. Update the s19 storyboard row.
  4. Review again (a short review 3 of the changed scenes is enough).

Disk at review: C: 81 GB free, G: 580 GB free. Review-2 frames: 51 MB, 536 files, local and not committed.


---

# ch00_cross_product_why v4 review 1 (commit a9180a2)                              2026-10-27

This is a fresh-eyes review of the v4 re-plan render, `movies/out/ch00/ch00_cross_product_why/1080.mp4` (2905.70 s = 48:26, 129.48 MB, 71 scenes).

**How the frames were taken.** I extracted 392 frames with ffmpeg and looked at every one:
- one at every scene midpoint;
- one at every sentence end minus 0.25 s in the dense scenes (s09a, s18b, s22–s31, s39–s46) and at the last sentence of every other scene;
- extra frames and crops around anything suspicious.

**Where the frames are.** `reports/movies/ch00/ch00_cross_product_why/review/`, with these subfolders:
- `frames/f_<s>.png`;
- `tiles/t_NNN.jpg` (labelled 2×2 sheets, each panel 960 px wide);
- `tiles/x_*.jpg` and `tiles/y*.jpg` (the extra frames);
- `crops/`.

**Other checks.**
- A pixel scan of every frame for ink in the 20-px edges, in the caption band (y 880–1040) and right of x 1850.
- The S30 drawing code, read to confirm the s30 scale finding.
- The page image of Vallis p. 57 (2.7)–(2.12), rendered with `tools/render_pages.py ch02 --eq 2.12`.

I did not edit the movie or its sources.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_cross_product_why (v4 review 1, @ a9180a2) | 2905.70 s (48:26); narration ends at 2903.18 s + 2.5-s hold | 129.48 MB (QA WARN: over the 120 MB budget, under the 160 MB cap) | 9 PASS + size WARN; physics parity 122 functions; 116 equations present; 719 cues | **FIX**: the s30 inertial circle is drawn 2.3× too large on a real map (unlisted); the s28c calculation leaves out the factor u = 10 m/s. Everything else is right, and the rotating-frame derivation matches Vallis (2.7)–(2.12) | PASS: (2.7), (2.10)+(2.11), (2.12), f = 2Ω sin φ (2.80) and the geostrophic form of (2.195) all match in our notation; no numbers on screen; no KaTeX errors seen | **FIX**: 17 places where text overprints text or is clipped at the frame edge (s08, s09a, s20, s22c, s22e, s23, s23a, s25, s27, s27a, s28b, s28c, s29, s40, s41a) | **FIX** (SHOULD level): the right or left half stays empty for 7–30 s in s22a, s22d, s27, s28_f, s42, s47 | PASS (QA: 719 cues match the script, ≤ 42 chars, ≤ 17 cps; timing.json has no warnings) | PASS: 0 flashes; signs carry glyphs (⊙/⊗, "−") as well as colour. One colour inconsistency (Coriolis push orange vs violet) | n/a (none, as the house style requires) | **FIX** |

## The user's v2 notes (UV2-01 … 31), checked on v4

| # | v4 time · scene | state | evidence / what is left |
|---|---|---|---|
| UV2-01 | 00:00–00:10 · s00 | **FIXED** | The sentence is the user's wording verbatim; the title card is the house title ("made easy", "meteorology" in teal) |
| UV2-02 | 00:13–00:19 · s01 | **FIXED** | "…why it's built the way it is…" is spoken verbatim |
| UV2-03 | 00:23–00:55 · s02 | **FIXED** | Dashed legs are labelled 5 / 1 and 1 / 3, and a = (5, 1), b = (1, 3) is under the plot (00:37) |
| UV2-04 | 01:01–01:31 · s03 | **FIXED** | The r label sits on the door face, fully visible (01:06, 01:13, 01:30) |
| UV2-05 | 02:07–02:37 · s05 | **FIXED** | Legs and labels are there from the first frame (02:07.6); the 3-component display, with the "0" tags, is at 02:36 |
| UV2-06 | 02:40–03:24 · s06 | **FIXED** | The new specific sentence plays, and the slot words "along x / along y / along z" are on screen (03:00) |
| UV2-07 | 03:24–04:03 · s07 | **FIXED** | a = (5, 1, 0) and b = (1, 3, 0) sit top left for the whole scene (crop at 03:44); the legs are on the figure |
| UV2-08 | global | **PARTLY** | Components are on screen for almost every numeric vector. Still open: the s18 case past "opposite" (12:27–12:36) shows no q components. Several component labels are drawn but unreadable because something overprints them (M7, M8, M9, M10, M13, M14) |
| UV2-09 | 04:24–04:50 · s08 | **FIXED** | √(5² + 1²) = √26 and √(1² + 3²) = √10 are worked out on screen; "from the last video" is gone. New collision at 04:49 (M4) |
| UV2-10 | 05:53–20:17 · s09a, s18a–s22e, s19 | **PARTLY** (content FIXED, execution FIX) | All the requested teaching is there: the box proof; the part across vs the part along; the slide; torque with 15 / 7.5 / 0 N m; the plane normal ("a label for the patch"); the wall shadows; L = r × p; F = q v × B; the 1 / 10 / 100 kicks; the summary grid. It reads well and answers "why an area, but an arrow". Execution is not clean: M3 (s09a), M5 (s20), M6 (s22c), M7 (s22e) |
| UV2-11 | 11:39–12:36 · s18 | **FIXED** | 'p = (3, 0, 0)' on the big p and '(3, 0, 0)' on each copy (11:52, 12:15) |
| UV2-12 | 15:48–16:12 · s22 | **FIXED** | r is fully visible on the door (15:49, 16:06) |
| UV2-13 | 21:16–21:22 · s23 | **FIXED** | An axle at the place, with a turning arc and the keyword "axis of turning" (21:21) |
| UV2-14 | s23, s23a, s28b, s29, s30, s31, s24–s26 globes | **FIXED** | Daytime Blue Marble patches (Biscay, Dordogne, Gulf of Guinea, Patagonia) at full brightness; the globes are lit everywhere |
| UV2-15 | 21:41–21:47 · s23; 22:09–22:15 · s23a | **FIXED** | "left of an eastward wind = north", a stick figure facing downwind, and "a direction: left of the wind" |
| UV2-16 | 22:16–22:51 · s23a | **FIXED** (content). Overlaps: M9 | "push ⊥ wind"; the 30°-off contrast split into "along: speeds up" / "across: turns"; "only turns"; a path bent a little at a time with the struck 90° ghost |
| UV2-17 | 22:51–22:58 · s23a; s40a; s29 | **FIXED** | Weather-map preview (∇p → k × ∇p along the isobars); the Coriolis push as the "left tool with a minus" in s29 |
| UV2-18 | 22:37–22:43 · s23a | **FIXED** | "push = (strength) × k × u" with braces "a number" and "quarter turn" |
| UV2-19 | 23:02–23:42 · s24 | **FIXED** | The axis leaves the globe at the poles, and no dashes are drawn over the globe (23:05, 23:10, 23:41) |
| UV2-20 | 23:43–26:18 · s25a, s25, s25b | **PARTLY** (content FIXED) | Position vector (centre → place, 6371 km); half-Earth cut with the axis on the face; radius = \|r\| sin θ ≈ 4505 km; 2π × radius over 2π/Ω, so the 2π cancels; right-hand rule east; recipe → (0, 329, 0) m/s; 465 m/s at the equator. Execution: M10 (r label overprinted 24:41–25:23); S6 (v reads as lying in the cut face; no "0" at the pole) |
| UV2-21 | 30:40–31:37 · s28a | **FIXED** (content). Clutter: S5 | east / north / up = k; "three directions = 3-D"; "not a fourth direction"; Ω cos φ north + Ω sin φ up, both 5.16 × 10⁻⁵; Ω = (0, Ω cos φ, Ω sin φ); "pole: all up · equator: all north" |
| UV2-22 | 26:18–30:40 · s26–s27a | **PARTLY** (content FIXED, execution FIX) | The merry-go-round in two views; v_outside = u + Ω × r; piece ① (the carried arrow) and piece ② (the new ground), each Ω × u; piece ③; "2 ← ① + ②"; "− ← moved across"; centrifugal into gravity; computer check with a gap of 2 × 10⁻¹¹ m. Matches Vallis (2.8), (2.10), (2.11), (2.12). Execution: M11 (s27 overprints), M12 (s27a), S7 |
| UV2-23 | 31:38–33:55 · s28b, s28_f | **PARTLY** (content FIXED) | Ω × u is worked out one component per sentence with crossed pairs; f defined from the up part; pole / 45°N / equator / 45°S pictures; 1.03 × 10⁻⁴ s⁻¹; f < 0 in the south. Execution: M13 |
| UV2-24 | 32:19–33:06 · s28c | **PARTLY** (content FIXED) | Ω sin φ (−v, u, 0); k × u by the recipe = (−v, u, 0); flat part = Ω sin φ k × u; vertical part ≈ 0.001 m/s², about 10 000 × weaker than g; −2Ω sin φ k × u. Execution: M2 (calculation leaves out × 10 m/s) and M14 |
| UV2-25 | 35:00–35:34 · s31 | **FIXED** | "45°N · France" (Dordogne) and "45°S · Patagonia · Argentina", both loops over land, daytime |
| UV2-26 | 35:14–35:34 · s31 | **FIXED** | NH: launched east, curves right towards the south, clockwise from above. SH: left, towards the north, anticlockwise from above (35:23, 35:27, 35:33) |
| UV2-27 | 36:08–36:52 · s33 | **FIXED** | NH air heading south is turned right (west); SH air heading north is turned left (west); "towards the west and the equator" (36:30, 36:51) |
| UV2-28 | 36:53–37:37 · s34 | **FIXED** | Both hemispheres turned to the east; "named from where they blow"; no repeated reminders |
| UV2-29 | 40:08–45:08 · s39–s44 | **PARTLY** (content FIXED, execution FIX) | One round low with four isobars; ∇p towards high pressure; k × ∇p along the isobars, low on the left; the adjustment told slowly with loops; the balance argued in words; the maths one move per line; numbers 8.1 m/s; check 8.3 × 10⁻⁴ each way. Execution: M16 (s40), M17 (s41a), S2 (s42 picture zone), S4 (s44 link) |
| UV2-30 | lexicon | **FIXED in `movies/lexicon.yaml`** (`ʤˌiOstɹˈɑfɪk`); **not verifiable from frames** | The user should ear-check "geostrophic" at 42:43–42:50 and 43:27–43:36 |
| UV2-31 | 45:09–46:45 · s45, s46 | **FIXED** | MODIS true-colour image of 2 Nov 2023; coastlines and thin admin borders; England / Cornwall / Bretagne / France; ERA5 isobars at the same time. Small: the two gold links at 45:27 cross (S4) |
| cut-away | 24:06+, 30:44+ | **FIXED** | A half-Earth cut through the axis and the place, with the axis on the flat face; no "heart" wedge |

**Builder's self-reported residuals, verified independently:**
- s27: confirmed, and worse than reported (M11).
- s09a: confirmed (M3, plus S4 and S5 items).
- s22c: confirmed (M6).
- s25a–s28a: s25a itself is acceptable, but s25 (M10), s27a (M12) and s28a (S5) are confirmed.

**Not limited to them.** I also found the s08, s20, s22e, s23, s23a, s28b, s28c, s29, s40 and s41a collisions (all new) and the s30 scale error.

## Physics and equations: what is right (checked, no action)
- **Deflection, every hemisphere and view.**
  - s26 states NH right / SH left.
  - s27a: on a merry-go-round turning anticlockwise from above, Ω × u points left and the minus turns it right, which is the curve the rider saw.
  - s29: for an east wind in the NH, −f k × u points south (right); in the SH it points north (left); at the equator f = 0.
  - Turning sense: s30 clockwise from above in the NH; s31 loops with the correct sense in both hemispheres; s41 turns right while adjusting.
  - Winds and storms: s33/s34 trades and westerlies; s36/s37 Ian anticlockwise, Idai clockwise; s38 r × u up for Ian and down for Idai.
- **Coriolis called apparent.** s26 S2–S3 ("we judge the air's motion against the turning ground … this apparent push"), and s26a S6 "the rider just measures its motion against a turning floor". This is consistent with Vallis's "quasi-force".
- **Rotating-frame derivation against p. 57, step by step.**
  - v_outside = u + Ω × r is (2.7).
  - ① the carried arrow, Ω × u, is the Ω × v_R of (2.8).
  - ② + ③, Ω × (dr/dt) = Ω × u + Ω × (Ω × r), is the last term of (2.10) with (2.11).
  - The rider's equation du/dt = real pushes − 2Ω × u − Ω × (Ω × r) is (2.12).
  - The "2 = two equal pieces" and "minus = moved across" explanations are exact. Centrifugal: −Ω × (Ω × r) points outwards, which agrees with (2.13), and it is absorbed into gravity.
- **f = 2Ω sin φ.**
  - The split Ω = (0, Ω cos φ, Ω sin φ) is right; 7.29 × 10⁻⁵ × cos 45° = 5.16 × 10⁻⁵ is right.
  - Ω × u component by component is right (east −Ω sin φ v, north Ω sin φ u, up −Ω cos φ u).
  - The flat part is Ω sin φ k × u, and f = 2 × 7.29 × 10⁻⁵ × sin 45° ≈ 1.03 × 10⁻⁴ s⁻¹.
  - f → 0 at the equator ("this balance breaks down there"), and f < 0 in the SH.
- **k × as a 90° turn.**
  - The recipe gives (0, 5, 0) for an east wind and (−5, 0, 0) for a north wind.
  - −k × u gives (5, 0, 0), to the right.
  - The turn is anticlockwise from above.
- **Geostrophic.**
  - In s40a, ∇p points south and k × ∇p points east, with the low on the left and the high on the right.
  - u = (1/(fρ)) k × ∇p, derived through k × (k × u) = −u.
  - Numbers: 400 Pa / 400 000 m = 1.00 × 10⁻³ Pa/m; fρ = 1.24 × 10⁻⁴; u ≈ (8.1, 0) m/s, with a unit check.
  - Balance check: (0, ±8.3 × 10⁻⁴) m/s².
- **The 15 % claim is honest.**
  - The manifest CHECK rows give a median actual/geostrophic ratio of 0.858 (W flank 0.860, North Sea 0.847).
  - "about fifteen percent" and "to within about a sixth" are fair.
  - The stated reason (curvature: flow round a low is slower than geostrophic) is right.
- **Other numbers.**
  - s08: θ ≈ 60.3°, sin θ ≈ 0.868.
  - s18b: along 1.57, across 2.75.
  - s20: 15 / 7.5 / 0 N m.
  - s21: τ = (0, 0, −15) N m, tightening, clockwise from above.
  - s22c: L = (0, 0, 3) kg m²/s.
  - s22d: east × up = south; clockwise from above.
  - s22e: √101, √100.1, √100.01.
  - s24: 2π / 86 164 s.
  - s25b: 329 and 465 m/s.
  - All correct.

## MUST fix

1. **M1 · 34:47–34:59 · s30.** The inertial circle is drawn far too large.
   - What is wrong:
     - `S30` draws it with R = 190 px on `bmng_s31n.jpg` (889.6 km over 760 px, so 1.17 km/px). On the map the loop is ≈ 445 km across, against a true 194 km (radius 97 km); that is 2.3× too large.
     - The storyboard's `exaggeration` lists only the time compression.
     - The next scene (s31, 35:33) shows "≈ 194" on a 100-km bar over the same Dordogne terrain, so a viewer sees two different loop sizes on the same map.
   - Fix (either one):
     - Scale R to 97 km ÷ 1.17 km/px ≈ 83 px (zoom the patch if it looks small).
     - Or drop the map under the circle in s30 and record the scale in the storyboard `exaggeration` list.
2. **M2 · 32:47–33:05 · s28c S6.** The calculation leaves out the wind speed.
   - What is wrong: the line reads "2Ω cos φ u = 2 × 7.29 × 10⁻⁵ × cos 45 ≈ 1.03 × 10⁻³ m/s²", with no "× 10 m/s" and no degree sign. As written, it equals 1.03 × 10⁻⁴. The line also runs to x ≈ 1918 (frame edge).
   - Fix: write `2 × 7.29×10⁻⁵ s⁻¹ × cos 45° × 10 m/s ≈ 1.03×10⁻³ m/s²` as a two-line CalcStack inside x ≤ 1840.
3. **M3 · 06:35–06:52 · s09a S9–S11.** The letters derivation is cut off.
   - What is wrong: "(a₁+b₁)(a₂+b₂) − a₁a₂ − b₁b₂ − 2a₂b₁ = a₁b₂ − (" is clipped at the right frame edge, so the end of the key line is missing.
   - Fix: break it into two lines (the box product, then "= a₁b₂ + a₂b₁ − 2a₂b₁"), or reduce it to 60 px and start at x 1060.
4. **M4 · 04:49–04:54 · s08 S8.** "≈ 0.496" (the cos θ result) is printed on top of "θ ≈ 60.3°, sin θ ≈ 0.868".
   - Fix: let CalcStack own the cos θ lines, and put θ / sin θ one row lower (or fade the cos line out before they appear).
5. **M5 · 15:04–15:23 · s20 S8–S10.** A pile-up of labels on the spanner.
   - What is wrong:
     - "30°" lies on "across = 25 N", which lies on the keyword "torque".
     - "along ≈ 43.3 N" and "τ = (0, 0, 7.5) N m" lie across the spanner and the r label.
     - At S10, "F = (50, 0, 0) N" runs into "torque" ("F = (50, 0, torque").
   - Fix:
     - Move the keyword "torque" under the equation, at y ≈ 200.
     - Put the F label at the arrow tail side.
     - Give the along/across parts their labels in the maths zone (CalcStack rows), not on the picture.
     - Move τ to the bolt end, below the spanner.
6. **M6 · 18:14–18:23 · s22c S7.** Two collisions.
   - What is wrong: the picture label "r = (0.5, 0, 0) m" runs into the KaTeX "L = r × p", and the gold rotation arc strikes through "p = (0, 6, 0) kg m/s".
   - Fix: start the maths column at x ≥ 1080, or put the r label below the arrow; draw the arc inside the dashed orbit, or put the p label outside the arc.
7. **M7 · 19:21–19:58 and 20:00–20:05 · s22e.** Two unreadable labels.
   - What is wrong:
     - The tip label "u = (10, 0) m/s" is overprinted by the axis label "east" (reads "(1̶0̶ t 0) m/s") from S3 on.
     - At S9 the bar labels run together ("0.05 0.0050.0005").
   - Fix: put the axis label "east" at the far end of the axis (x ≥ 1000) or above the line. Space the three bars ≥ 160 px apart, or label them vertically or under each bar on two lines (1 kick · 10 kicks · 100 kicks).
8. **M8 · 21:30–22:05 · s23 S6–S10.** Turning-tool labels overprint each other.
   - What is wrong:
     - S6: "k × u = (0, 5, 0)" lies on "k = (0, 0, 1)" and on "90° left".
     - S7 (21:42–21:52): the picture label "u = (5, 0, 0) m/s" runs into the KaTeX "k × u = (0 × 0 − 1 × 0, …".
     - S8–S9 (21:47–22:01): "k × u = (−5, 0, 0)" is garbled by the arc and by "90° left".
     - S10 (22:01–22:05): "−k × u = (5, 0, 0)" is printed on top of "k × u = (−5, 0, 0)", and both are unreadable.
   - Fix:
     - Fade the k label out once k × u appears.
     - Put the turned-arrow labels at the arrow tips, outside the arc.
     - Keep the picture inside x ≤ 1000 and the maths at x ≥ 1060.
     - In S10, dim the old k × u label and put −k × u at its own tip (east side).
9. **M9 · 22:16–22:58 · s23a S3–S8.** The u label loses its number.
   - What is wrong: the right-angle tick sits on the "5" of "u = (5, 0, 0) m/s", so the number is unreadable for 40 s. At S4 (22:26–22:34) "30°" and "across: turns" are also printed over that label.
   - Fix: place the u label below the arrow (y + 50), and put the 30° split labels above the push.
10. **M10 · 24:41–25:23 · s25 S2–S8.** The r label is overprinted.
    - What is wrong: the gold circle of latitude cuts through "r = (4505, 0, 4505) km", and from S3 a second label "radius" is printed over its start ("r̶a̶d̶i̶(4505 …").
    - Fix: move the r label inside the cut face (below the arrow), and put "radius" on the radius segment, away from r.
11. **M11 · 29:15–29:37 · s27 S3–S4** (builder residual). Two overprints.
    - What is wrong: the teal "rider sees" brace label is printed over the second "change of u: du/dt" line, and "= real pushes" is overprinted by "Newton" ("real pusNewton").
    - Fix: drop the duplicate "change of u" line (the brace already names it), and move "Newton" below the equation as a gold pointer.
12. **M12 · 30:29–30:35 · s27a S6.** "route 2: rider's equation" is overprinted by the inset label "outside: straight".
    - Fix: put the inset (and its label) at x ≥ 1600, y ≥ 300, or fade it out at S6.
13. **M13 · 31:48–32:18 · s28b S2–S6.** Two problems.
    - What is wrong: the picture label "u = (u, v, 0)" runs into the table row label "u:" ("(u, v, 0)u:"). At S6 (32:09–32:18) the top equation is clipped at the right frame edge ("… −Ω cos(").
    - Fix: move the table to x ≥ 1100 (or put the picture label under the arrow), and set the top line at 54 px or break it after the second component.
14. **M14 · 32:43–33:05 · s28c S4–S7.** "u = (u, v, 0)" runs into "flat part = Ω sin φ k × u" ("0)flat part").
    - Fix: as M13; also keep the k × u recipe line (x ≈ 1912 at 32:35) inside x ≤ 1840.
15. **M15 · 34:13–34:22 · s29 S4–S5.** In the SH panel, "−f k × u" is printed on top of "k × u = (0, 10)" (they read as one garbled string), because both arrows point north.
    - Fix: put the −f k × u label on the left of its arrow, or offset the two arrows by 12 px with separate labels.
16. **M16 · 41:03–41:10 · s40 S6.** "density" is printed over "pressure push (per kg)".
    - Fix: put "density" under ρ ≈ 1.2 kg/m³, at y ≥ 960 (inside 860, so move the whole stack up), or fade the brace label.
17. **M17 · 42:37–42:44 · s41a S6.** "left: L" is printed over "equal and opposite".
    - Fix: put "left: L" / "right: H" inside the strip or below its right end, or fade out the first two keyword lines before S6.

**Root cause, and a mechanical check.** Most of M3–M17 are text-on-text collisions. The builder's per-sentence frame self-check is not catching them. I suggest a bounding-box collision CHECK in the kit:
- `Lbl` / `TipLabel` / `Keyword` / KaTeX blocks register their boxes per frame;
- any intersection, or any box outside x 20–1900 / y 20–860, is reported at every sentence end.

## SHOULD fix
1. **S1 · Coriolis push colour (house §5: a quantity keeps its colour).**
   - The Coriolis push is orange (the pressure / second-vector colour) here: −2Ω × u at 30:13–30:22 (s27a), −f k × u at 34:00–34:22 (s29), "push" at 34:30–34:59 (s30).
   - It is violet in s27 and in s41–s46.
   - Fix: make it violet everywhere; orange stays for the pressure push.
2. **S2 · Empty halves (house §5, ≤ 3 s).** Fix: show the keyword or the first calculation line on the words.
   - s22a 16:13–16:45 (30 s, right half);
   - s22d 18:30–18:42 (12 s);
   - s27 29:03–29:12 (whole frame: a faint mini disc and one keyword);
   - s28_f 33:06–33:17 (left half, 11 s);
   - s42 42:51–43:14 (the only picture is a blank purple strip thumbnail);
   - s47 S10 47:51–47:59 (left half);
   - shorter: s18b 13:00–13:13, s22e 19:14–19:21, s23 21:00–21:10.
3. **S3 · Text in the 20-px edge or right of 1840.** Fix: wrap or shrink to stay inside x 80–1840.
   - s26d 28:33–28:58 ("fast near the edge, slow near the centre", x ≈ 1915);
   - s22e 19:57–20:05 ("≈ 10.005 m/s", x ≈ 1916);
   - s25 25:00–25:23 ("≈ 4505", x ≈ 1910; also add "km");
   - s28c 32:35–33:05 (x ≈ 1912);
   - s23 21:42–21:52 ("left of an eastward wind = north", x ≈ 1904);
   - s33 36:47–36:52 ("towards the west and the equator");
   - s09a 06:30–06:35 ("24 − 5 − 3 − 2 = 14", x ≈ 1890);
   - s22a 16:59–17:10 ("up = anticlockwise from above");
   - s28a 31:31–31:37 (the label "Ω (0, 7.29 × 10⁻⁵, 0)" starts at x ≈ 10);
   - s22b 17:10–17:41 (axis label "z" at y ≈ 8–40).
4. **S4 · Gold links crossing text or each other (house §6).** Fix: bend the links around the text, or end them at its edge.
   - s09a 06:33 (through "2 × 1 × 1 = 2" and the "4"), 06:52 (through the struck line);
   - s18b 13:30–13:43 (through "3.162 × 0.868");
   - s22b 17:36–17:41 (arrowhead on "14");
   - s23 21:28 (through the u label);
   - s44 44:21–44:33 (arrowhead on "∇p =");
   - s45 45:24–45:33 (the two links cross).
5. **S5 · Smaller collisions.** Each one is readable but crowded:
   - s08 04:34–04:43 "sine" on √10;
   - s09 05:44–05:52 "parallelogram" on "b = (1, 3)";
   - s09a 06:26–06:52 corner-square "1" on the b label, and the "4" box label against the KaTeX lines;
   - s21 15:30–15:47 F arrow through "N m";
   - s22e 19:43–20:05 "≈ 5.7°" sliced by u;
   - s23a 22:16–22:33 proton icon on "wind", and 22:51–22:58 "k × ∇p" struck by its arrow;
   - s25a 24:28–24:34 "4505 km" on "φ = 45°";
   - s26a 27:18 keyword on the yellow arc;
   - s26b 27:30–27:57 the r label hidden under the ball;
   - s26d 28:44–29:01 "0.75 m/s" on "Ω × u" and the rim;
   - s28a 31:12–31:30 "Ω sin φ" on "north";
   - s28b 31:42 "k" on "Ω sin φ";
   - s29 34:00–34:22 NH arrow through "u = (10, 0) m/s";
   - s43 44:01 "balance breaks down near the equator" on "low on the left";
   - s45 45:55–46:00 "low on the left" on fρ.
6. **S6 · s25b 25:30–26:10: the direction of v.** The v arrow is drawn horizontally towards the dashed axis, so on the cut face it reads as lying in the face, pointing at the axis, not east (the ⊙ y direction).
   - Fix: tilt the camera so y projects clearly, or draw a small ⊙ y tag at the arrow.
   - Also, at 26:13–26:17 the narration says "at the poles, it's zero", but no "v = 0" is shown. Add it.
7. **S7 · 29:37 · s27 S5.** The "move the extra pieces across" step replaces the line instead of stacking it.
   - Fix: keep the outside equation dimmed above, with the moved terms highlighted (CalcStack), so the move is visible.
8. **S8 · 12:27–12:36 · s18 S10.** The q past "opposite" has no components (UV2-08). Add q = (−2, −1, 0) (or whatever the data has) at its tip.
9. **S9 · 35:30–35:34 · s31.** "≈ 194" has no unit. Write "≈ 194 km".
10. **S10 · 21:05–21:10 · s23 S2.** "wind: u" is still fading in at the end of its sentence. Reveal it on "u".

## COSMETIC
- s18 11:45–12:30: faint grid planes reach into the caption band (y ≈ 880–990).
- s26b 27:44–27:57: the plain keyword "v_outside" shows a raw underscore. Use "v outside" or KaTeX.
- s38 39:45–40:08: the wind arrows and the u label are orange (u is teal everywhere else).
- s39 40:08–40:38: "1000 km" has no bar, and "north" touches the map edge.
- s40/s40a 40:40–41:35: the L glyph is cut by the top of the zoomed map.
- s43 43:49–44:01: the brace labels "turn left" and "across" abut.
- s03 01:08–01:13: the right half is empty for about 5 s.
- s22c 17:42–17:46: S1 shows only a dot and a keyword.
- s08 04:50–05:00: the gold length brackets are bare lines with no end ticks.
- s25 25:15–25:23: the "= Ω |r| sin θ" line touches the 2π/Ω denominator.
- s03 01:30 "turns the most" and s06 03:23 "?" sit at x ≈ 1860.

## House-style conformance
- **Conforms.**
  - The opening title (house layout, gradient title, "made easy", teal application word, data-driven p × q then the globe).
  - The end card: the three house sentences verbatim, the thumbnails, both notebook lines, and the 2.5-s hold.
  - No headings (keywords only), no boxes, no references, no badges.
  - "N = newton" and "N m = newton metre" are defined on screen.
  - New terms are defined in words: position vector, latitude, merry-go-round, centrifugal, reanalysis, isobars, hectopascals, geostrophic.
  - Goal-before-calculation and picture-to-number links are used.
- **Departures** (all listed above): the empty halves (S2), the colour of the Coriolis push (S1), text at the edges (S3), links crossing text (S4) and the collisions (M3–M17).
- **The opening sentence** is the user's own wording (UV2-01). It overrides the house pattern "the easy way" on purpose.

## Overall: FIX (ch00_cross_product_why v4 review 1 — M1–M17; S1–S10 recommended)
- **The re-plan does what the user asked.** Of the 31 UV2 items:
  - 23 are FIXED on screen;
  - UV2-30 is fixed in the lexicon and needs the user's ear check;
  - 7 are PARTLY (UV2-08, 10, 20, 22, 23, 24, 29). All the requested teaching is on screen and in the voice, but their scenes carry the collisions below.
- **Physics.** The physics and the rotating-frame derivation are right, and match Vallis (2.7)–(2.12) and (2.80). The 15 % claim is honest.
- **What blocks `qa_pass`:**
  - one physics-honesty error (M1, the s30 loop 2.3× too big on a real map, contradicting s31);
  - one wrong-as-written calculation (M2);
  - fifteen text collisions or clippings that a viewer will notice (M3–M17), concentrated in the new derivation scenes.
- **All of them are local layout fixes in `CrossProductWhy.tsx`.** No re-plan, re-narration or new data is needed.
- **After the fix loop:**
  1. Re-render s08, s09a, s20, s22c, s22e, s23, s23a, s25, s27, s27a, s28b, s28c, s29, s30, s40 and s41a, plus any SHOULD scenes taken.
  2. Re-run `tools/movie_qa.py --storyboard`.
  3. Run a short review 2 of the changed scenes.
  4. Ideally add the bounding-box collision check first.
  5. The size WARN (129.5 MB, cap 160) needs no action.

Disk at review: C: 71 GB free, G: 576 GB free. Review-1 frames: 180 MB, 392 frames + tiles + crops under `reports/movies/ch00/ch00_cross_product_why/review/` (local, not committed).
