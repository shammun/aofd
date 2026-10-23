# Chapter 0 — movie review                                       2026-10-22

The PoC D review (`poc_coriolis_turntable`, 2026-10-21) is in `reports/ch00_poc_movies.md`. This file did not exist
before this review, so nothing in it was overwritten. The Chapter-0 movie reviews start here.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_dot_product_why (review 1) | 170.005 s (target 170) | 12.90 MB (≤ 25) | 9/10 PASS; **frozen FAIL** (`pass: false`) | PASS (one sign slip in a readout, see M1) | PASS | **FIX** (label overlap) | PASS | PASS | PASS | PASS | **FIX** (minor; one re-render + QA re-run) |
| ch00_dot_product_why (review 2) | 170.005 s | 13.16 MB | 10/10 PASS (`pass: true`) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** (one publish condition, P1) |
| ch00_dot_product_why (review 3, v2 @ 3787a8b) | 367.253 s (target 367.225; user window 6:00–6:10) | 25.38 MB (override budget 60) | 10/10 PASS (`pass: true`) | **FIX** (M1: s17 says the map stays put, s18–s20 move it) | PASS | PASS (S2, S4 small overlaps) | PASS | PASS (S5 orphan words) | PASS | PASS (but S1: captions cover badges) | **FIX** (one Must, one re-render) |

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
