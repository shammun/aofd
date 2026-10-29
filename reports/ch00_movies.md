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


# ch00_cross_product_why v4 fix 1: review 2 (commit 2bf998c)                       2026-10-27

This is a fresh-eyes review of the fix-1 render, `movies/out/ch00/ch00_cross_product_why/1080.mp4` (2907.80 s = 48:28, 129.50 MB, 71 scenes; narration ends at 48:25.00, then a 2.8-s hold).

**How the frames were taken.** I extracted 558 frames with ffmpeg and looked at them:
- one at every scene midpoint;
- one at every sentence end minus 0.25 s in s08, s09a, s18–s31 and s39–s46, and at the last sentence of every other scene;
- one at every review-1 timestamp;
- one every 1.5 s through the new end scene (47:59–48:28);
- extra frames and full-resolution crops around anything suspicious.

I also ran a pixel scan of every frame for ink in the edges, in the caption band and in each half of the screen. The frames are in `reports/movies/ch00/ch00_cross_product_why/review/r2/` (`frames/`, `tiles/t_NNN.jpg`, the extra sheets `tiles/x_*.jpg` and `tiles/y_*.jpg`, and `crops/`), 104 MB, local only. I did not edit the movie or its sources.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_cross_product_why (v4 fix 1, review 2, @ 2bf998c) | 2907.80 s (48:28); narration ends at 2905.00 s + 2.8-s hold | 129.50 MB (QA WARN: over the 120 MB budget, under the 160 MB cap) | 9 PASS + size WARN (duration, codec, black, frozen 260/260 narrated, loudness −16.0 LUFS / −3.2 dBTP, flashes 0, captions 719 cues, physics 121 hashes, equations 116) | PASS: M1 fixed (the s30 loop is now ≈ 194 km on the map, the same as s31); M2 fixed (× 10 m/s, °, units); deflection, f, k ×, the rotating frame and the geostrophic numbers are all still right | PASS: no KaTeX errors; every equation still matches (2.7)–(2.12) and (2.80) in our notation | **FIX**: 15 of the 17 MUST collisions are gone. Three new places are unreadable: s42 (maths drawn over the strip), s28a (label pile) and s20 (a readout that contradicts the calculation) | SHOULD: the right half stays empty for 14–20 s in s18b, s18c, s25 and s44 | PASS (719 cues = script, ≤ 42 chars, ≤ 17 cps). Three cues are under 1 s (cosmetic) | PASS: 0 flashes. One colour inconsistency is left (the Coriolis push is orange in s23a, s33 and s34) | n/a (none, as the house style requires) | **FIX** |

## Review-1 items, checked at their timestamps

| item | time · scene | state | evidence |
|---|---|---|---|
| M1 | 34:47–34:59 · s30 | **FIXED** | The loop is drawn at about 85 px against the 100-km bar, so about 194 km across, as in s31 (35:33). The push is violet |
| M2 | 32:47–33:05 · s28c | **FIXED** | `2Ω cos φ u = 2 × 7.29×10⁻⁵ s⁻¹ × cos 45° × 10 m/s ≈ 1.03×10⁻³ m/s²` is a three-line CalcStack. Line 1 ends at x ≈ 1878 (cosmetic, C5) |
| M3 | 06:35–06:52 · s09a | **FIXED** | The key line ends at x ≈ 1875, followed by "= a₁b₂ + a₂b₁ − 2a₂b₁" and "= a₁b₂ − a₂b₁" (underlined) |
| M4 | 04:49–04:54 · s08 | **FIXED** | "θ ≈ 60.3°, sin θ ≈ 0.868" is on its own row below "≈ 0.496" |
| M5 | 15:04–15:23 · s20 | **FIXED** (layout). New issue: N-M3 | The keyword "torque" sits beside τ = r × F, and "across = 50 × sin 30° = 25 N" is in the maths zone. The τ readout is under the spanner and the F label at the arrow tip |
| M6 | 18:14–18:23 · s22c | **FIXED** (layout). New small collisions: S6 | The r label is below the arrow and the L stack starts at x ≥ 1060 |
| M7 | 19:21–20:05 · s22e | **FIXED** | "east" is at the end of the axis and u is labelled below it. The bars read 0.05 / 0.005 / 0.0005 above "1 kick / 10 kicks / 100 kicks" |
| M8 | 21:30–22:05 · s23 | **FIXED** | k × u is labelled at its tip and the recipe sits in the maths zone. In S10 the old k × u is dimmed and −k × u = (5, 0, 0) has its own label |
| M9 | 22:16–22:58 · s23a | **FIXED** | "u = (5, 0, 0) m/s" is below the arrow and the right-angle tick is clear. "30°" and "across: turns" sit above the push |
| M10 | 24:41–25:23 · s25 | **FIXED** | "radius" is on the circle and the r label is clear of it. The dashed axis passes between "r" and "=" (cosmetic) |
| M11 | 29:15–29:37 · s27 | **FIXED** | The duplicate line is gone and "Newton" is a gold pointer below the equation |
| M12 | 30:29–30:35 · s27a | **FIXED** | The inset and "outside: straight" are top right; "route 2: rider's equation" is clear |
| M13 | 31:48–32:18 · s28b | **FIXED** | The table is at x ≥ 1500 and the top equation is broken into two lines inside the frame |
| M14 | 32:43–33:05 · s28c | **FIXED** | "u = (u, v, 0)" is at the arrow and "flat part = Ω sin φ k × u" is in the maths zone |
| M15 | 34:13–34:22 · s29 | **FIXED** | In the SH panel, "−f k × u" is left of its arrow. The NH u label is still split by the arrow (C2) |
| M16 | 41:03–41:10 · s40 | **FIXED** | "density" sits beside ρ ≈ 1.2 kg/m³ |
| M17 | 42:37–42:44 · s41a | **FIXED** | "left: L" / "right: H" are clear of "equal and opposite" |
| S1 | Coriolis push colour | **PARTLY** | It is violet in s27, s27a, s28_f, s29, s30 and s41–s46. It is still **orange** in s23a (22:16–22:58: "push ⊥ wind" and the push arrows along the bending path), s33 (36:11–36:30) and s34 (36:53–37:10). See S1 below |
| S2 | empty halves | **PARTLY** | Filled: s22a, s22d, s28_f, s47 S10, s22e S1, s23 S1. Still empty: s42 (now a blank thumbnail), s18b and s27 29:03–29:07. New: s18c, s25 and s44. See S2 below |
| S3 | text at the edges | **FIXED** (mostly) | s26d, s22e, s25, s23, s09a, s28a and s22b are inside. Text still runs to about x 1873–1878 (past 1840, inside 1900) in s09a 06:35, s28c 32:47 and s33 36:47 (C5) |
| S4 | gold links crossing text | **NOT FIXED** (the builder said partly) | All six are still there, plus one new one. See S4 below |
| S5 | small collisions | **PARTLY** | Fixed: s08 "sine", s21 F arrow, s23a proton, s43, s45 fρ. Still there: s09, s09a, s22e, s26a, s26b, s26d, s28b, s29. s28a got worse (N-M2) |
| S6 | 25:30–26:17 · s25b | **FIXED** | A ⊙ y tag sits at the v arrow. The pole case "r = (0, 0, 6371) km, v = (0, 0, 0)" is shown at 26:16.9–26:18.2. Cosmetic: at 26:12 the ⊙ glyph sits on the "6" of "r = (6371, 0, 0) km", and at 26:16.5 the old r label passes over "v = Ω × r" for about 0.4 s |
| S7 | 29:37 · s27 | **FIXED** | The outside equation stays dimmed above, and the moved terms are highlighted below |
| S8 | 12:27–12:36 · s18 | **FIXED** | "q = (−0.3, 2, 0)" is shown while q turns, then "q = (0, −2, 0)" with "p × q = (0, 0, −6)" in rose with a "−" |
| S9 | 35:30 · s31 | **FIXED** | "≈ 194 km" |
| S10 | 21:05–21:10 · s23 | **FIXED** | "wind: u" is fully in by the end of S2 |

**About the label checker.** The builder's checker reports 0 overlaps, but N-M1, N-M2, S6 and S7 are real overlaps. It seems to miss three kinds of overlap:
- KaTeX blocks drawn over picture fills (the s42 strip);
- labels on projected 3-D arrows (s28a);
- arrowheads and arcs that cross text (s22c).

Extend it to test text boxes against the boxes of filled shapes and arrow or arc paths, not only against other text boxes.

## The UV2 items that review 1 marked PARTLY

| # | state now | evidence / what is left |
|---|---|---|
| UV2-08 | **FIXED** | The s18 q past "opposite" now has its components (12:30, 12:35), and every component label that review 1 found overprinted is now readable |
| UV2-10 | **PARTLY** | s09a, s22c and s22e are clean. Left: N-M3 (s20, the τ readout shows 7.5 about 10 s before it is spoken, next to the "15" calculation), S2 (s18b and s18c empty right halves), S3 (the s18b S9 keyword lines are missing) and S6 (s22c) |
| UV2-20 | **FIXED** | M10 and S6 are done. Left: S2 (s25, 24:37–24:57, the maths zone is empty) |
| UV2-22 | **FIXED** | M11, M12 and S7 are done |
| UV2-23 | **FIXED** | M13 is done. New small issue: S5 (s28_f "sin φCoriolis parameter"). Note that s28a (UV2-21, FIXED in review 1) has regressed into a label pile (N-M2) |
| UV2-24 | **FIXED** | M2 and M14 are done |
| UV2-29 | **PARTLY** | M16 and M17 are done. New: N-M1 (s42, the derivation is drawn over the strip). Still there: S4 (s44 link arrowhead on "∇p =", s45 crossing links) and S2 (s44 empty right half) |

## Physics and equations (checked again on the changed scenes, no action)
- **s30.** The loop radius now matches 97 km on the Dordogne patch, the period 2π/f ≈ 16.9 h and the speed 10.0 m/s. It turns clockwise seen from above in the NH, the same as s31.
- **s28c.** 2 × 7.29×10⁻⁵ × cos 45° × 10 ≈ 1.03×10⁻³ m/s² is right. "About 10 000 × weaker than g" is fair (9.8 / 1.03×10⁻³ ≈ 9500).
- **s29.** With an east wind, k × u = (0, 10) north in every panel:
  - NH: −f k × u points south (right);
  - equator: f = 0, no turning;
  - SH: f < 0, so −f k × u points north (left).
  All right.
- **s25b.** Ω × r = (0, 7.29×10⁻⁵ × 4 505 000, 0) ≈ (0, 329, 0) m/s, east. At the equator (0, 465, 0) m/s; at the pole (0, 0, 0). All right.
- **s42.** −f k × u − (1/ρ)∇p = 0, then −f k × u = (1/ρ)∇p, then −f k × (k × u) = (1/ρ) k × ∇p, then k × (k × u) = −u, then f u = (1/ρ) k × ∇p, then u = (1/(fρ)) k × ∇p. Each step is right, one move per line.
- **s48.** The narration is the house §3 weather/climate ending word for word, with "the cross product" as the concept. It has no URL, no book, no lab and no "thanks for watching".

## MUST fix

1. **N-M1 · 42:54–43:14 · s42 S2–S5. The derivation is drawn over the picture.**
   - What is wrong:
     - The maths stack starts at x ≈ 760, inside the picture zone (80–1000).
     - The orange brace label "pressure push" lies on the strip's top-right corner (42:56).
     - Line 2 "−f k × u = (1/ρ)∇p" starts on the strip's right edge (43:04).
     - Line 3 "−f **k** × (k × u) = …" begins inside the purple strip (43:12). The gold "k ×" that the narration points at sits on purple and cannot be read at 640 px.
     - From 43:17 to 43:36 the picture zone shows only a small blank purple rectangle (the strip thumbnail) under the k × (k × u) half-turn icon. This is review-1 S2 for s42, still open.
   - Fix:
     - Keep the strip and its two push arrows in x 80–1000 for the whole scene.
     - Set the four-line CalcStack at x ≥ 1060, older lines dimmed (the house §6 pattern). Put the two brace labels under line 1 inside the maths zone.
     - Drop the blank thumbnail. Instead, keep the small strip with its two equal and opposite arrows beside the half-turn icon, so the picture stays the situation being derived.
2. **N-M2 · 31:09–31:37 · s28a S5–S9. The local-axes labels pile up at the place.**
   - What is wrong:
     - 31:09–31:30: "Ω sin φ", "up = k", the yellow "φ" and "Ω cos φ" are printed on top of each other around the place, with two separate "Ω" labels and the east arrow running through "Ω cos·φ".
     - 31:31–31:37: "Ω cos φ" sits on "up = k", and an arrow tip strikes the "=" (it reads "up ± k").
     - This is the scene that answers UV2-21 ("three directions = 3-D"). A first-time viewer cannot tell which label belongs to which arrow.
     - Review 1 had it as a small S5 item; it is now worse.
   - Fix:
     - Put the three axis words (east / north / up = k) at the far tips of long axis arrows, outside the globe silhouette.
     - Put "Ω cos φ" and "Ω sin φ" at the tips of their component arrows, on the side away from the axes. Hide the duplicate Ω label at the place while the split is shown.
     - Fade "up = k" once "Ω sin φ" appears, since the maths zone already says "up".
3. **N-M3 · 15:04–15:14 · s20 S8. The τ readout gives the answer early and contradicts the screen.**
   - What is wrong:
     - When F swings to 30° at the start of S8 ("Push at thirty degrees…", 15:04.3), the readout under the spanner already shows **τ = (0, 0, 7.5) N m**.
     - At the same moment the maths zone still shows |τ| = 0.3 × 50 = **15** N m, and the voice is still on "about forty three newtons… twenty five newtons".
     - 7.5 is first spoken at 15:14.2 ("The torque drops to seven point five newton metres").
     - This breaks two house rules (§4 goal-first, answer after the calculation; §6 nothing appears before it is spoken). For 10 s, two different torques are on screen.
   - Fix: hold the readout at "(0, 0, 15)", or dim it to "τ = ?", until AT(9, "seven point five"). Then switch it to 7.5 together with the "|τ| = 0.3 × 25 = 7.5 N m" line.

## SHOULD fix

1. **S1 · Coriolis push colour (house §5: a quantity keeps its colour).** The builder's note says "violet throughout", but three scenes still draw the Earth-spin push in orange (the second-vector and pressure colour):
   - s23a 22:16–22:58: "push ⊥ wind" and the push arrows along the bending path. This is the first time the spin's push is drawn.
   - s33 36:11–36:30: the −f k × u mini arrows on the trades.
   - s34 36:53–37:10: the same on the westerlies.
   - The storyboard still says "orange" for s23a, s29 and s33. Fix those entries too, so a re-render does not bring the colour back.
   - The proton's magnetic push (s22d) and the kicks (s22e) may stay orange (generic pushes), but s23a S3 says the spin's push is "like the magnet's push", so violet there makes the link visible.
2. **S2 · Empty halves (house §5, ≤ 3 s).** Fix: show the keyword or the first calculation line on its words.
   - s18b 12:55–13:15: the right half is empty except "dot product: along" for about 3 s.
   - **s18b S9 13:39–13:45: the right half is completely empty.** The CalcStack has gone, and the storyboard's two keyword lines are not drawn (`a·b → along (cos θ)` slate, `a × b → across (sin θ)` violet, plus the tick on "sin θ ?"). The voice says exactly that comparison, so this is also picture-vs-voice.
   - s18c 13:45–14:04, 19 s, S1–S5: nothing on the right until the recipe at S6. Fix: show "only the part along changes" on S1, "base 5.099 · height 2.75 → area 14" on S4–S5, and move the "a × b = (0, 0, 14)" line earlier.
   - s25 24:37–24:57, 20 s, S2–S5: only "how fast?" is shown (for 3 s). Fix: show "circle of latitude" (S2), "radius = distance from the axis" (S3), "θ: angle between Ω and r" (S4), then the radius = |r| sin θ line on S5.
   - s44 44:02–44:12, 10 s: the right half is empty before "4 hPa = 400 Pa". Fix: show the goal keyword "how fast is the geostrophic wind?" on S1.
   - s42 43:17–43:36: see N-M1.
   - Shorter, cosmetic: s20 14:28–14:32 (the frame is empty except one keyword); s19 20:17–20:22 (only the two column heads); s27 29:03–29:07.
3. **S3 · 21:42–21:52 · s23 S7. The stick figure contradicts its label.**
   - What is wrong: the figure labelled "facing downwind" stands upright with a gold arrow above its head pointing north (up the map), while the wind blows east. A first-time viewer reads it as "a person facing north".
   - Fix: draw the figure seen from above, facing east (along u), with its left arm (gold) pointing north on "ninety degrees to its left", as the storyboard describes.
4. **S4 · Gold links crossing text or each other (house §6).** None of review-1 S4 is fixed:
   - s08 04:33 (arrowhead inside "√(5² + 1²)") and 04:42 (two links cross each other and the θ arc);
   - s09a 06:50–06:52 (the link from "= a₁b₂ − a₂b₁" curls up and lands on the ")" of the top line, through the struck "−2a₂b₁");
   - s18b 13:27–13:38 (the arrowhead lands on the "×" of "3.162 × 0.868");
   - s22b 17:40 (the arrowhead lands on the "14" of "(0, 0, 14)");
   - s44 44:19–44:27 (the arrowhead lands on the "=" of "∇p =");
   - s45 45:22–45:33 (the two links cross).
   - New: s23 21:21–21:28 (the link from "axis of turning" crosses the map label "east").
   - Fix: end every link 12 px short of the text's bounding box, on its near side, and route the s08 and s45 pairs so that they do not cross. Add link-versus-text and link-versus-link tests to the label checker.
5. **S5 · 33:11–33:55 · s28_f.** The keyword "Coriolis parameter" butts against the KaTeX "f = 2Ω sin φ" with no gap ("sin φCoriolis parameter").
   - Fix: put the keyword under the equation, or leave a 30-px gap.
6. **S6 · 18:13–18:29 · s22c S7–S8. Three new small collisions.**
   - The violet L arrowhead overprints "kg" in "p = (0, 6, 0) kg m/s".
   - The gold rotation arc passes through the third component of "r = (0.5, 0, 0) m".
   - At 18:22–18:29, "string pulls along r" is crossed by the r arrow and touches the "r" tip label.
   - Fix: put the p label above and left of the ball; draw the arc inside the r label's box or move the r label below the centre; put "string pulls along r" under the circle.
7. **S7 · House-style decision: the end card.**
   - HOUSE_STYLE §3 (2026-10-27) says: "The pure maths movies (dot product, cross product, grad/div/curl…) keep the maths-tutorial ending above."
   - This movie now uses the weather/climate ending (voice and three keyword lines).
   - The ending itself is well made:
     - the text is word for word;
     - the reveals land on their words (48:09 the line "meteorology · atmospheric science · climate", 48:15.8 the gold line, 48:18.5 the notebook, 48:20 the other notebooks);
     - there is a 2.8-s hold.
   - It fits, since half the movie is meteorology. But it departs from the written rule, and I found no user note asking for it.
   - Fix (either one):
     - Ask the user, and if they agree, record the exception in HOUSE_STYLE §3 and §12 (for example "maths movies whose second half is a weather application may use the weather ending").
     - Or revert s48 to the maths ending.

## COSMETIC
- **C1 · Small overlaps left from review-1 S5:**
  - s09 05:52: "parallelogram" touches "b = (1, 3)";
  - s09a 06:23+: the corner "1" touches the b arrow;
  - s22a 16:27: "plane of r and F" butts against "τ = r × F";
  - s22a 16:49–17:09: "area 14" is crossed by the a arrow;
  - s22e 19:42–20:02: "≈ 5.7°" is sliced by u;
  - s26a 27:18: the keyword is on the arc;
  - s26b 27:30–27:57: the r label is under the ball;
  - s26d 28:44–29:01: "0.75 m/s" and "Ω × u" are on the rim;
  - s28b 31:42–32:18: "k" touches "Ω sin φ";
  - s29 34:05–34:22: the NH arrow splits "u | (10, 0) m/s";
  - s31 35:27: the clock touches "left · towards the north";
  - s44 44:30–44:47: "k × ∇p" crosses the strip's edge.
- **C2 · Review-1 cosmetics still open:**
  - s18 grid planes in the caption band (11:42–12:30);
  - s38 orange wind arrows and u label;
  - s39 "1000 km" with no bar, and "north" touching the map edge;
  - s40/s40a: the L glyph is cut by the top of the map;
  - s43: the brace labels abut;
  - s03 01:08–01:14: the right half is empty;
  - s22c 17:42–17:46: only a dot and a keyword;
  - s03 / s06 text at x ≈ 1860.
- **C3 · 26:12 · s25b.** The ⊙ glyph sits on the "6" of "r = (6371, 0, 0) km". At 26:16.5 the old r label passes over "v = Ω × r" for about 0.4 s.
- **C4 · Captions.** Three cues are shorter than 1 s (house §8: 1–7 s):
  - 00:38.45 "In weather," (0.84 s);
  - 04:24.15 "By Pythagoras," (0.99 s);
  - 39:10.85 "Near its peak," (0.98 s).
  Merge each with the next cue.
- **C5 · Text past x 1840 (inside 1900):** s09a 06:35–06:52 (x ≈ 1875), s28c 32:47 (x ≈ 1878), s33 36:47 (x ≈ 1873).

## House-style conformance
- **Conforms.** The opening title and voice are unchanged and conform. There are:
  - no headings, boxes, references, badges or URLs;
  - keywords only;
  - no text below 44 px seen;
  - picture-to-number links (but see S4);
  - goal-before-calculation, except N-M3;
  - new terms defined (Coriolis parameter, geostrophic, reanalysis, isobars, hectopascals).
- **The end card** matches the reference layout (`ch00_dot_product_why` end frame compared): the four thumbnails, the keyword lines, the notebook icons and the hold. The only difference is the third keyword line, which comes from the chosen ending (S7).
- **Departures:** N-M1, N-M2, N-M3 (collisions and an early number); S1 (colour); S2 (empty halves); S4 (links); S7 (the ending rule).

## Overall: FIX (ch00_cross_product_why v4 fix 1 review 2 — N-M1…N-M3; S1–S7 recommended)
- **Fix 1 cleared review 1's blocking list.**
  - Both physics or arithmetic errors (M1 the s30 scale, M2 the s28c product) are fixed.
  - All fifteen review-1 collisions (M3–M17) are fixed.
  - S6–S10 are fixed.
  - UV2-08, 20, 22, 23 and 24 are now FIXED; UV2-10 and UV2-29 are still PARTLY.
- **What blocks `qa_pass`:** three new problems that a viewer will notice, all local to `CrossProductWhy.tsx`:
  - s42: the derivation is drawn over the strip;
  - s28a: the local-axes labels pile up;
  - s20: τ = 7.5 shows 10 s early, next to the "15" calculation.
- **SHOULD items.** These are what the builder reported as only partly done, or claimed done:
  - S1: the Coriolis push is still orange in s23a, s33 and s34, despite "violet throughout";
  - S2: 14–20-s empty right halves in s18b (with the missing S9 keywords), s18c, s25 and s44;
  - S4: all the gold-link crossings;
  - S3: the s23 stick figure faces north;
  - S7: the end card follows the weather ending against the written rule. This needs one user decision.
- **No re-narration or new data is needed.**
- **Next steps:**
  1. Re-render s18b, s18c, s20, s22c, s23, s23a, s25, s28a, s28_f, s33, s34, s42 and s44 (plus s08, s09a, s22b and s45 for the links).
  2. Extend the label checker to test text against filled shapes and against arrow, arc and link paths.
  3. Re-run `tools/movie_qa.py --storyboard`.
  4. Run a short review 3 of those scenes.

Disk at review: C: 65 GB free, G: 564 GB free. Review-2 frames: 104 MB (558 frames, 141 sheets, 78 crops) under `reports/movies/ch00/ch00_cross_product_why/review/r2/` (local, not committed).


# ch00_cross_product_why v4 fix 2: review 3 (commit a1cc435)                       2026-10-27

This is the third and last fresh-eyes review. It covers the fix-2 render, `movies/out/ch00/ch00_cross_product_why/1080.mp4`: 2907.80 s (48:28), 128.79 MB, 71 scenes. The narration ends at 48:25.30, followed by a 2.5-s hold. I did not edit the movie or its sources.

**How the frames were taken.** I extracted 520 frames with ffmpeg and looked at all of them, as 640-px cells, with full-resolution crops where something looked wrong:
- one frame at every scene midpoint (71);
- every review-2 item at its timestamp:
  - s20 at 1–3-s steps;
  - s28a at 2–4-s steps;
  - s42 at 2–4-s steps;
- sentence end minus 0.25 s in 34 dense scenes (s08, s09a, s18, s18b, s18c, s19–s22e, s23, s25–s31, s39–s46);
- the representative frame of each of the checker's 109 contact keys;
- the end card every 1–5 s from 47:59 to 48:27.7;
- 0.15-s steps through the s03 door swing.

I also ran two measurements over the whole movie:
- a pixel scan at 2 fps for empty screen halves;
- an audio analysis: loudness of speech against music-only gaps, stereo balance, peaks and clipping.

The frames are in `reports/movies/ch00/ch00_cross_product_why/review/r3/` (`frames/`, `tiles/`, `crops/`), 61 MB, local only.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_cross_product_why (v4 fix 2, review 3, @ a1cc435) | 2907.80 s (48:28); narration ends at 2905.30 s, then a 2.5-s hold | 128.79 MB (QA WARN: over the 120-MB budget, under the 160-MB cap) | 9 PASS + size WARN: duration, codec (H.264 High, yuv420p, AAC, faststart), black 0, frozen 262/262 narrated, loudness −16.0 LUFS / −3.2 dBTP, flashes 0/s, captions 719, physics 121 hashes, equations 116 | PASS: Northern Hemisphere right / Southern Hemisphere left (s29, s31, s33, s34); f = 0 at the equator; s27a minus → right, against the turning; s30 loop clockwise seen from above (Northern Hemisphere); "Coriolis" is called a push felt in the turning frame | PASS: s42 chain checked again line by line; no KaTeX errors | PASS with notes: N-M1 and N-M2 are fixed. One real contact is left (s25b label, SHOULD). The rest are cosmetic | PASS: N-M3 is fixed. Empty halves remain (SHOULD) | PASS: 719 cues = script, ≤ 42 chars, ≤ 17 cps. Three cues are under 1 s (cosmetic) | PASS: 0 flashes; voice centred; music ≈ 15 dB under the voice; no clipping | n/a (none, as the house style requires) | **PASS** |

## Review-2 items, checked at their timestamps

| item | time · scene | state | evidence |
|---|---|---|---|
| N-M1 | 42:54–43:36 · s42 | **FIXED** | The strip and its two pushes stay in the picture zone (x 80–1000), with their labels inside the strip. The CalcStack is entirely in the maths zone (x ≥ 1060), with the brace labels under line 1. The lines appear on their words: line 2 at 43:04, line 3 at 43:12, k × (k × u) = −u at 43:20, f u at 43:26, u = … at 43:29, then the gold underline. The blank thumbnail is gone: from 43:15 a small strip with both arrows sits under the half-turn icon (k × u, −u). Cosmetic C3: the labels overflow for about 1 s while the strip shrinks (43:13–43:15) |
| N-M2 | 31:09–31:37 · s28a | **FIXED** | "east" / "north" / "up = k" are at the far tips. On the split (31:09), "up = k" fades to "up". "Ω cos φ" and "Ω sin φ" sit at their component tips on the outer side, with one Ω label. Nothing overprints at 31:13–31:30. Pole (31:32) and equator (31:35) are clean. Cosmetic: at 31:32–31:34 the pole Ω arrowhead touches the top frame edge (the checker's single "edge" flag) |
| N-M3 | 15:04–15:14 · s20 | **FIXED** | The readout shows "τ = (0, 0, ?) N m" from 15:04.6 until 7.5 is spoken (15:14.2). It counts down (10.2 at 15:16.0) and shows "(0, 0, 7.5)" next to "\|τ\| = 0.3 × 25 = 7.5 N m" at 15:17.5. Only one torque is on screen at a time |
| S1 | Coriolis push colour | **FIXED** | Violet in s23a (22:16–22:55: "push ⊥ wind", the push arrows, "push = (strength) × k × u"), s33 (36:20, 36:30) and s34 (37:03, 37:10). The storyboard has no orange Coriolis push left |
| S2 | empty halves | **PARTLY** | All five listed places are fixed: s18b S1–S9 (including the S9 lines `a·b → along (cos θ)`, `a×b → across (sin θ)` at 13:43.9), s18c, s25, s44 and s42. The whole-movie scan finds others, mostly at scene starts (R3-S1 below) |
| S3 | 21:42–21:52 · s23 | **FIXED** | The figure is seen from above, facing east along u, with the gold "left arm" pointing north. The "facing downwind" label is clear |
| S4 | gold links | **PARTLY** | Clean now: s09a 06:33 (ends 12 px short of "14"), s09a 06:52 (now goes round line 2 to ")"; it grazes the struck "−2a₂b₁", cosmetic), s18b 13:37, s22b 17:40, s44 44:21, s45 45:27 (parallel, no crossing), s23 21:21–21:28 (clear of "east"). Left: s08 04:42–04:59 (R3-S4) |
| S5 | 33:11–33:55 · s28_f | **FIXED** | "Coriolis parameter" sits under "f = 2Ω sin φ" |
| S6 | 18:13–18:29 · s22c | **FIXED** | The p label is above and left of the ball, the L arrowhead is clear of "kg", and "string pulls along r" (rose) is in the maths zone |
| S7 | end card rule | **RESOLVED** | HOUSE_STYLE §3 now records the user's exception: the cross-product movie uses the weather/climate ending. The end card at 48:01–48:27.7 shows four thumbnails, then "a series of tutorials" (48:01), "meteorology · atmospheric science · climate" (48:09.5), the gold "the ideas, and the maths behind them" (48:16.5), the cross-product notebook (48:18) and the other notebooks (48:21), then the hold. There is no URL, book or "thanks" |

## The label checker's contacts, triaged

`G:/…/v4/labels/f2_after3/report.json` has 733 flags. They group into **109 unique contacts** (108 shape, arrow or text contacts plus 1 edge flag) in **36 scenes**. I looked at the representative frame of each, and at a sequence wherever a contact could be real.

| class | count | where | judgement |
|---|---|---|---|
| **(a) Real legibility defect at 640 px** | **4 keys, 1 place** | s25b 26:11.5–26:16.0: "r = (6371, 0, 0) km" with the ⊙ y glyph ring and the gold axis on "(6", and the r arrow tail through "r =" | It reads "r = ⊙371, 0, 0) km". See **R3-S2** |
| Readable, but touched (cosmetic) | 39 | s22a "area 14" / "normal" crossed by arrows · s25a "6371 km" and "φ = 45°" crossed by the bracket, the z axis and the arc · s26d rim labels "0.75 m/s", "Ω × u", "1.4 m/s" · s28b/s28c "north" on the dashed Ω cos φ line and "Ω sin φ" crossed by the thin k arrow · s29 the Northern-Hemisphere "u \| (10, 0) m/s" split · s17 11:02 "a × b = (0, 0, 14)" crossed during the camera move · s46 ring over the "C" of Cornwall · s26a "measured against a turning floor" on the rim · s28a the pole Ω arrowhead at the top edge | All readable at 640 px. See C1 |
| (b) Intended or harmless | 66 | Labels on box or disc fills by design: s09a "2.5 / 1.5 / 1" and the "+" proton in s22d. Labels touching isobars or map rectangles (s39, s40, s40a, s32). Labels on arcs or bands by design: s03/s22 "r" on the swing arc, s31 "≈ 194 km", s47 "across", s30 "push". Momentary sweeps: s00 title q/p, s12 "a × b" in the camera move, s20 "30°" on the spanner. Small glyphs: s05 ŷ / "1", s07 "3", s10 "?", s11 θ, s21 τ / "−" | No action |

What the checker misses, found in the frames: R3-S3 (s03, a 2-D right-angle tick left floating while the 3-D door swings), R3-S4 (s08, a link knot at the origin) and the s42 transition overflow (C3).

## Full-movie pass

**Scene midpoints.** I looked at all 71 midpoints and found no regression from the 331-line TSX change in fix 2. Every equation was re-read on screen against the storyboard's LaTeX; all match:
- (2.7)–(2.12) and (2.80) chains in our notation;
- s28b/s28c Ω × u components;
- s44 numbers: ∇p = (0, −1.00×10⁻³) Pa/m, fρ ≈ 1.24×10⁻⁴, u ≈ (8.1, 0) m/s, both pushes ≈ 8.3×10⁻⁴ m/s².

**Sentence ends in dense scenes.** I checked 34 scenes at the end of each sentence.
- Reveals sit on their words in all of them. Checked: s42 (above), s28a (split 31:09, numbers 31:21, components 31:30, pole/equator 31:33), s25 (one keyword per sentence) and s44 (each CalcStack line at its sentence).
- One small timing slip: in s28a S2 (30:45–30:52) the north arrow appears about 1 s before east, although "east" is said first (cosmetic).

**End card.** Conforms (see S7).

**Audio.** The music is "rotation-turning", seed 3, recorded in `sound.yaml` and the storyboard `music:` block, with `effects: []`. These are measured checks only; I did not listen to the audio.

| quantity | value |
|---|---|
| Integrated loudness | −16.0 LUFS |
| Loudness range (LRA) | 4.3 LU |
| Peak | L −3.5 dBFS / R −3.2 dBFS (≤ −1.5 dBTP) |
| Flat factor | 0 (no clipping) |
| Speech RMS, median | −16.7 dBFS |
| Speech RMS, quietest sentence | −18.9 dBFS (20:30.8) |
| Music-only gaps, median | −34.2 dBFS |
| Music-only gaps, p95 | −32.0 dBFS |
| Music-only gaps, loudest | −30.5 dBFS (35:37) |

- **Voice over music.** The voice sits about 15 dB above the music bed (more under speech, which is ducked a further 5 dB), so the music never drowns the voice.
- **Stereo.** The voice is centred (L/R balance within ±0.23 dB). The music pans about ±5 dB in the gaps, which is the "circling" design.
- **Edges.** The 0.3-s lead-in is silent (−84 dBFS) and the final hold fades to −52 dBFS.
- **No sound effects.** No gap is louder than the bed.

**Captions.** 719 cues, in order, with none longer than 7 s, none over 42 chars and none over 17 cps. The last cue ends at 48:25.0, inside the audio. Three cues are still under 1 s (C5).

## MUST fix
None.

## SHOULD fix (recommended for any future re-render; none blocks `qa_pass`)

1. **R3-S1 · Empty halves longer than about 3 s (house §5, U-M4.2).** These were found by the whole-movie scan and are not in review 2's list. The picture is present in each, but the other half is empty.

   | time | scene | length | fix |
   |---|---|---|---|
   | 14:33–14:52 | s20 S3–S5 | 19 s | Keep the keyword "only the part across turns" (now shown only from 14:28.8 to 14:33) until S6. Add "along → pulls · across → turns" on AT(5, "only the part across") |
   | 30:40.5–30:56 | s28a S1–S3 | 15.5 s | Add "on Earth: a sphere, Ω tilted" on S1 and "east · north · up" on S2, each word lit as it is spoken (and the axis arrows in that order), then "up = k" on S3 |
   | 05:00.5–05:10 | s09 S1–S2 | 9.5 s | Add "a picture for \|a × b\|" on S1, then "drop ⊥ onto b's line" on S2 |
   | 30:04.5–30:13.5 | s27a S1–S2 | 9 s | Add "the minus?" on S1, then "Ω up → Ω × u: left" on S2 |
   | 17:49.5–17:57.5 | s22c S2–S3 | 8 s | Keep "many places", then add "ball on a string" (S2) and "r = (0.5, 0, 0) m" in the maths zone (S3) |
   | 23:43–23:51 | s25a S1–S2 | 8 s | Add "where is our place?" on S1, then "position vector r: centre → place" on S2 |

   Cosmetic, 3.5–7 s:
   - 27:20–27:27 s26b, 35:02.5–35:09.5 s31, 36:54–37:00.5 s34;
   - 01:09–01:14.5 s03, 04:04–04:09 s08, 40:09–40:14 s39;
   - 08:49–08:53 s14, 10:59–11:03.5 s17, 18:30.5–18:34.5 s22d, 22:06–22:10.5 s23a;
   - 31:38–31:42 s28b, 36:08–36:12 s33, 42:51–42:55 s42, 26:18.5–26:22 s26;
   - left half 14:26–14:32 s20.
2. **R3-S2 · 26:10.5–26:16.0 · s25b S8. The r label is overprinted.**
   - What is wrong:
     - The ⊙ y-axis glyph ring and the gold Earth axis sit on the start of the r label: "(" of "(4505, 0, 4505)" at 26:10.5, then "(6" of "(6371, 0, 0)" from 26:11.5.
     - The r arrow's tail runs through "r =".
     - For about 4.5 s the equator case reads "r = ⊙371, 0, 0) km". It is the only checker contact that a viewer would notice at 640 px.
   - Fix (either one):
     - Put the r tip label below and left of the place, outside the globe's silhouette, with the arrow tail clear.
     - Or hide the ⊙ y glyph while the r label is shown.
   - Also stop the old r label sliding over "v = Ω × r" at 26:16.5 (review-2 C3).
3. **R3-S3 · 01:15.6–01:16.85 · s03 S6 ("Yet the door turns the most"). A motion glitch.**
   - What is wrong:
     - The door swings open in about 0.45 s, holds for 0.7 s, then snaps shut in 5 frames (01:16.70 → 01:16.85).
     - During the swing the white right-angle tick between r and F stays behind as a floating "<" in empty space (about x 590, y 445).
   - Fix:
     - Parent the right-angle tick to the door group, or fade it out with the swing.
     - Ease the swing back over ≥ 0.5 s, or keep the door open until S7 starts.
4. **R3-S4 · 04:42–04:59 · s08 S7–S9. A link knot at the origin (review-2 S4 residual).**
   - What is wrong: the gold link from the |b| band loops down through the origin. On the way it crosses:
     - the a arrow;
     - the b arrow;
     - the a × b arrow's base;
     - the |a| band, next to the "1" label.
   - Together with the |a| link this makes a tangle of gold lines where θ is being read.
   - Fix: route the |b| link above the picture (from the top of the |b| band, right, to "|b| = √10"), so that the two links run parallel and cross nothing.

## COSMETIC
- **C1 · Readable but touched labels (the checker's 39), with the fix for each:**
  - s22a 16:43–17:09: move "area 14" above the a arrow and "normal" beside the arrow, not on it.
  - s25a 24:04–24:33: put "6371 km" outside the bracket, and "φ = 45°" in the angle's open wedge left of the z axis.
  - s26d 28:29–28:58: put the rim labels inside the disc.
  - s28b/s28c 31:40–33:05: put "north" beyond its arrow tip, and "Ω sin φ" right of the k arrow.
  - s29 34:05–34:22: put the Northern-Hemisphere u label under the arrow. The Southern-Hemisphere "k × u = (0, 10)" sits on the bright Andes; add a dark halo.
  - s17 11:02: hold the label until the camera settles.
  - s46 46:11–46:25: move the "1" ring off "Cornwall". The grey place names on white cloud ("England", "Bretagne", "France") have low contrast; use a dark halo.
  - s28a 31:32–31:34: keep the pole Ω arrowhead ≥ 40 px below the top edge.
- **C2 · Brace labels under KaTeX** ("Coriolis push", "pressure push", "Coriolis push (per kg)", "centrifugal: outwards", "shadow", "length of b"):
  - They render at KaTeX script size, about 40 px, below the 44-px floor. The `floor()` guard does not see KaTeX scripts.
  - The reference movie does the same, so this is a house-wide kit note: give `BraceNote` text an explicit 44 px.
- **C3 · 43:13–43:15 · s42.** While the strip shrinks, "pressure push", "Coriolis push", "L (north)" and "H (south)" spill outside it for about 1 s. Fade the labels out before the shrink.
- **C4 · Spacing.**
  - s18c 14:03–14:25: "a × b = (0, 0, 14)" butts under "base 5.099 · height 2.75" with no gap.
  - s12 08:10–08:19: "index  × middle=thumb" has uneven gaps around "×" and "=".
- **C5 · Captions.** Three cues are still under 1 s: 00:38.45 "In weather," (0.84 s), 04:24.15 "By Pythagoras," (0.99 s) and 39:10.85 "Near its peak," (0.98 s). Merge each with the next cue.
- **C6 · Review-2 cosmetics still open:**
  - s39/s40/s40a: the H and L glyphs are cut by the map top, and "north" touches the map edge;
  - s19 20:17–20:22: only the column heads are shown;
  - s22e 19:42–20:02: "≈ 5.7°" sits close to u.

## House-style conformance
- **Conforms:**
  - the opening title and voice;
  - no headings, boxes, references, badges or URLs;
  - keywords only, with no narrated sentence on screen;
  - colours (the Coriolis push is violet everywhere now; the pressure push is orange);
  - picture-to-number gold links (except R3-S4);
  - goal before calculation (N-M3 fixed);
  - every new term defined (Coriolis parameter, geostrophic, reanalysis, isobars, hectopascals);
  - reveals on their words;
  - the end card under the recorded exception;
  - a per-movie score (§8) with no sound effects.
- **Departures:**
  - R3-S1 (empty halves);
  - R3-S2, R3-S4 (a label contact, a link knot);
  - C2 (KaTeX brace text below 44 px, house-wide).

  None is a Must-fix: a viewer can follow every scene.

## Overall: PASS (ch00_cross_product_why v4 fix 2 review 3 — `qa_pass`; R3-S1…S4 and C1–C6 recommended)
- **Review 2's blocking items are all fixed:**
  - N-M1 (s42 maths over the strip);
  - N-M2 (s28a label pile);
  - N-M3 (s20 early τ readout).
- **Review 2's SHOULD items:**
  - S1, S3, S5 and S6 are fixed, and S7 is resolved by the user's recorded exception;
  - S2 and S4 are fixed at every place review 2 listed, except the s08 link knot.
- **Checker triage:** of the 109 unique contacts, 1 place is a real legibility defect (s25b, SHOULD), 39 are readable but touched (cosmetic) and 66 are intended or harmless.
- **Physics, equations, captions, loudness and accessibility all pass.** The new score sits about 15 dB under a centred voice, with no clipping and no effects.
- **Next steps:**
  1. Mark the movie `qa_pass`.
  2. The user watches it before `/approve-movie 0 ch00_cross_product_why`.
  3. If a re-render happens for any other reason, take R3-S1 (s20, s28a first), R3-S2, R3-S3 and R3-S4. All are local to `CrossProductWhy.tsx`; no new narration or data is needed.
  4. Optionally teach the label checker two more cases:
     - 2-D overlay glyphs left behind by 3-D motion (R3-S3);
     - link-versus-arrow and link-versus-band crossings (R3-S4).

Disk at review: C: 62 GB free, G: 557 GB free. Review-3 frames: 61 MB (520 frames, 83 tiles, 29 crops) under `reports/movies/ch00/ch00_cross_product_why/review/r3/` (local, not committed).


---

# ch00_weather_basics — review 1 (v2 r4, fresh eyes)                                2026-10-28

Movie: `movies/out/ch00/ch00_weather_basics/1080.mp4`. Frames: 429 sentence-end frames, 62 per-scene tiles, a 2-fps
empty-screen scan of the whole movie, and dense crops at transitions. All under
`G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/review1/` (298 MB, local only).

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_weather_basics v2 r4 | 39:48 (2387.8 s) | 133.95 MB | 10/10 PASS | FIX (s55–s58 map vs graph) | PASS | FIX (sub-44 px maths, clipped labels) | **FIX (6 blank screens, 38.5 s; empty halves)** | PASS (598 cues, 0 violations) | PASS | n/a (retired); PASS (none on screen) | **FIX** |

## What passes
- **qa.json:** all 10 gates PASS.
  - Loudness −16.0 LUFS, true peak −2.3 dBTP (re-measured with ebur128).
  - Flashes max 1/s.
  - 31 physics functions reproduce their hashes.
  - 29 equations present.
- **Captions:** I re-checked all 598 cues against the house rules.
  - None has more than 2 lines or more than 42 characters per line.
  - None runs faster than 17 cps or falls outside the 1–7 s length.
  - None is out of order, and none uses `line:` positioning.
  - The VTT in `out/` is identical to the one in the storyboard folder.
- **Physics numbers (spot-recomputed):**
  - ρ = 101325/(287·288.15) = 1.225, and 1.29 / 1.16 at 0 / 30 °C (about 10 % apart).
  - ρg ≈ 12 Pa/m, and 36 hPa over 300 m.
  - H = 8.43 km, and p₀/(ρ₀g) = 8.43 km.
  - Pressure falls 11 % per km and halves every 5.8 km (≈ 507 and 253 hPa).
  - e_s = 6 / 12 / 23 / 42 hPa.
  - Relative humidity 15 ÷ 31.3 = 48 %, and dew point 13 °C.
  - Cloud base 12 ÷ 8 ≈ 1.5 km.
  - The wind (8, 6) gives 10 m/s from 233° (south-westerly), 19 kt; and 23.2 ÷ 0.514 ≈ 45 kt.
  - Sea-level reduction: 835·e^(1.609/8.43) ≈ 1010 hPa.
  - The 35 hPa in 13 h and +14 hPa in 5 h match the s56 graph.
- **Conventions:**
  - Wind is named by where it comes from; the compass arc runs clockwise from north to the tail (s33).
  - s44 says "anticlockwise, seen from above" round the low and clockwise round the high, both slightly inward, with "south: reversed".
  - Cold-front and warm-front geometry, slopes and "×50 taller" are spoken (s47, s48).
  - Front symbols sit on the side the front moves towards (s50).
  - Brest sits in the warm sector, behind the warm front, in s57.
- **House style:**
  - The opening title is right: gradient title, "made easy", "and how meteorology uses them" in teal, and one sentence. The subtitle is about 60 px clear of the readout, which meets the 50-px rule.
  - No headings, references, badges or URLs appear anywhere.
  - The end card uses the weather/climate wording and its three keyword lines, with the notebook icons.
  - Maps sit on real daytime imagery or relief.
- **Data and credits:**
  - The manifest credits cover ERA5 (C3S), IGRA2, NCEP R1, GFS, NASA Worldview/GIBS, BMNG, Natural Earth, ETOPO 2022, CesiumJS and our own CC0 sound.
  - The 27 Oct 2026 GFS "latest map" (typhoon 935 hPa, North Atlantic low about 955 hPa) is recorded with its CHECK rows.
- **Accessibility:** the colour maps are perceptual or diverging and centred, with no jet. H/L and fronts are coded by shape as well as colour. There is no full-screen noise.

## MUST fix
1. **M1: six blank screens (nothing on screen while the voice talks), 38.5 s in total.**
   - Found by the empty-screen scan, then checked by eye: the frames are pure background `#171f33`. The black gate cannot see this because the background is navy.
   - Each stretch, with what the voice is saying:

     | Time | Scene | Length | What the voice is saying |
     |---|---|---|---|
     | 02:22.0–02:26.5 | s05 S1 | 4.5 s | "So how big is the pressure at the ground…" |
     | 04:16.0–04:24.5 | s08 S1–S2 | 8.5 s | "Density tells us… the Greek letter rho". The ρ symbol is defined with nothing on screen. |
     | 05:26.5–05:34.5 | s10 S1–S2 | 8.0 s | |
     | 06:16.5–06:18.5 | s11 S1 | 2.0 s | |
     | 06:49.5–06:54.0 | s12 S1 | 4.5 s | |
     | 21:50.5–22:01.5 | s34 S1–S3 | 11 s | "ten metres per second is thirty-six kilometres per hour" is spoken on an empty screen. |

   - Fix:
     - Each of these scenes must open with its picture on frame 0, as the house style requires.
     - Carry the previous scene's persistent object across the cut: the column into s05, the room box into s08, the molecule boxes into s10.
     - Put the first reveal on its quoted words with `AT(k, j, "rho")` and similar.
     - Then add a "content-area not empty" gate to `movie_qa.py`. For example, fail when fewer than 0.2 % of the pixels in y 40–860 differ from the background for more than 1.5 s.
2. **M2: half of the screen is empty for more than 10 s (house rule ≤ 3 s, U-M4.2).**
   - Stretches over 10 s:

     | Time | Scene | Empty half | Length |
     |---|---|---|---|
     | 00:23.5–00:47 | s02 | right | 23.5 s |
     | 01:49.5–02:06.5 | s04 | right | 17 s |
     | 02:22–02:47 | s05 | right | 25 s |
     | 03:14–03:24.5 | s06 | right | 10.5 s |
     | 05:26.5–06:01 | s10 | right | 34.5 s |
     | 06:16.5–06:31 | s11 | right | 14.5 s |
     | 07:21.5–07:39 | s13 | right | 17.5 s |
     | 10:37–11:17 | s18 | **left** | **40 s**: H = RT/g sits alone in the right half until the uniform-density bars arrive on S7 |
     | 12:06.5–12:18 | s20 | right | 11.5 s |
     | 12:53–13:05.5 | s21 | right | 12.5 s |
     | 16:09.5–16:20.5 | s26 | right | 11 s |
     | 17:36–18:07.5 | s28 | right | 31.5 s: molecules over the water on the left, the curve arrives late |
     | 19:09–19:22.5 | s30 | right | 13.5 s |
     | 21:50.5–22:06 | s34 | left | 15.5 s |
     | 22:30–22:45 | s35 | right | 15 s |
     | 26:11.5–26:35 | s40 | right | 23.5 s |
     | 27:36–27:47.5 | s42 | right | 11.5 s |
     | 29:47–30:01 | s45 | right | 14 s |

   - Fix:
     - Bring the maths-zone object in on S1: for example the CalcStack skeleton, the empty e_s axes in s28, the equation "skeleton" in s10, or the uniform column drawn faint in s18 from S1.
     - Or centre a full-width picture until the second object arrives.
     - The stretches of 3–10 s (s07, s08, s09, s12, s16, s31, s33, s37, s51, s54) can share the same fix (SHOULD).
3. **M3: s55 (35:20–35:43). The "L" marks the wrong low, and the spoken start value is never shown.**
   - From 12 to 14 UTC on 1 Nov, the L sits on the north-western low at the top-left of the map. Ciarán's closed centre, mid-left, has no label.
   - At 15 UTC the L jumps onto Ciarán, while the voice says "the low deepens as it comes".
   - The "low:" readout first appears at 21 UTC showing 959 hPa (35:31). The narration says "from about nine hundred and sixty-five", but 965 is never on screen.
   - Fix:
     - Track Ciarán's minimum from 12 UTC, using a tracker seeded on Ciarán (nearest-neighbour from the previous hour), not the global minimum of the box.
     - Show "low: 965 hPa" from 35:30.3 ("from about nine hundred and sixty-five").
4. **M4: s55–s58 (35:20–37:54). The map's cold front contradicts the Brest graph.**
   - The objective front lines jump between hours.
   - At 15 UTC the cold front lies close to Brest. By 00–03 UTC on 2 Nov it has moved south to northern Spain and Biscay, about 500–700 km from Brest.
   - At 37:50 the graph's gold band says "cold front" passes Brest 00–03 UTC (wind SW → W, −2 °C). A viewer sees the blue line nowhere near the town.
   - Fix (either is fine):
     - Restrict the front diagnostic to the frontal zone attached to Ciarán (mask more than about 800 km from the low centre, add a TFP-magnitude threshold, apply temporal continuity).
     - Or hide the map fronts in s56–s58 and show only the low, the track and the Brest dot.
   - Also mention the front lines in the s55 narration, or remove them from s55. They are on screen and never spoken, so their legend is a keyword without a voice.

## SHOULD fix
1. **S1: the builder's known cosmetic items, all confirmed.**
   - **14:57 (s24 start, 897 s):** the "−6.5 °C / 1 km" slope label sits on the "20" tick and runs past the right end of the axis.
     - Fix: move the slope triangle to about 3–5 km height on the line at about −10 °C, with its label left of the line.
     - Also, the balloon glyph floats at about 38 km, above where the data ends (31 km), while S5 says balloons burst at about 30 km. Park it at the last data point.
   - **20:09 (s31, 1209 s):**
     - "12 °C" overlaps the "30" tick.
     - "dew point" sits on the y-axis at x = 0.
     - The orange T line is not clipped and runs past the left axis above about 2.6 km (it reaches −5 °C at 3 km, outside the 0–30 °C frame).
     - Fix: clip both lines to the plot rectangle, put "12 °C" above the gap bracket, and put "dew point" right of the teal line at about 2 km.
   - **00:05.7 (s00 title):** the two readouts cross-fade on top of each other. "12.0 km −60 °C 191 hPa" and "Brest 997 hPa" overlap for about 0.3 s.
     - Fix: fade Part A's readout fully out over 6 frames before Part B's fades in, or offset Part B's readout down 60 px.
   - **s56–s58 (36:23–37:54), the "L" on the gold line: intended.** The gold line is the track of the low, so its end belongs at the current centre, and the voice says "as the low passes close by".
     - Polish: stop the track at the L's halo edge so the line does not run under the glyph.
     - At 36:47 (s56 S3) the L also touches the Brest dot. Give the dot a 6-px ring so it stays visible.
2. **S2: maths below the 44-px floor.**
   - Affected places:
     - The RH fraction at 18:29–19:07 (s29): "saturation vapour pressure" at about 36 px;
     - s27 "e ≈ 1.61 q p = …" at 17:20;
     - the s40 underbrace labels "station p" and "z_s: height" at 26:20;
     - the small keyword lines "tropos = turning" (s23), "every place, height and hour" (s38), "mountains × 30 taller" (s39), "iso = equal · baros = weight" (s41) and "intertropical convergence zone" (s52), which measure about 30–38 px.
   - These are hard to read at 640 px.
   - Fix: raise them to 44 px, or use `\dfrac` with a larger KaTeX size. The kit's `floor()` guard is evidently not applied to KaTeX inner text.
3. **S3: clipped or detached labels.**
   - **28:35–28:39 (s43):** "Brest" is cut to "Bres", and the "L" is clipped at the map's right edge after the pan to the high. Fix: keep both labels inside the frame by clamping them, or pan less.
   - **37:30–37:33 (s59):** the "H" is clipped at the bottom-left corner. Fix: the same clamp.
   - **29:30 (s44):** the high's clockwise arc is mostly outside the map at the bottom-left. The southern-hemisphere thumbnail (about 110 px) is too small to read the reversed arrow at 640 px. Fix: enlarge it to about 220 px with a clear arrowhead.
   - **36:23–37:12 (s56):** "Brest" is written under the map at bottom-left, about 600 px from its dot. That breaks the cartography rule that a label sits at its point. Fix: label the dot.
   - **13:49 (s21):** "1 Nov 2023 · around midnight" straddles the bottom-right edge of the map, half on the image and half on the background. Fix: move it inside or below.
   - **15:58–16:09 (s25):** "Paris ≈ 11 km" runs into the inset globe. Fix: move the globe 60 px right, or shorten the label to "Paris 11 km".
   - **37:44–37:54 (s58):** "−2 °C" sits on the x-axis line. Fix: place it beside the drop, at about 11 °C.
   - **27:39 (s42):** "Ciarán 956 hPa" sits between the L and the H, directly above the H, so the pairing is ambiguous. Fix: put it under or right of the L.
4. **S4: reveals ahead of their words.**
   - In s49 the cold-front line is drawn with the warm front at 32:52 (S4). "cold front" is not said until S5, at 32:56.2. Fix: draw the trailing-edge line on S5.
   - In s29 "RH 73 %" appears at 19:01–19:07 but is never spoken. Fix: say it ("…rises to about seventy-three percent") or drop the number.
   - In s40 "≈ 1013 hPa" at the sea-level end of the mountain diagram (26:3x) is never spoken. It also sits beside the result "≈ 1010", which invites confusion. Fix: remove it, or say "an ordinary seaside reading, about one thousand and thirteen".
5. **S5: a quantity changes colour (house: "a quantity keeps its colour through the whole movie").**
   - Pressure is teal in the title readout and in s21 ("6 hPa"), but orange in s56.
   - Temperature is orange in the title and s23, but **gold** in s57–s58. Gold is the pointer and link colour.
   - Argon is gold in s03.
   - Fix: pick one colour per quantity (temperature orange; pressure, for example, slate or teal) and keep gold for links.
6. **S6: the s53 winds (34:45–35:25) are white streak segments with no head or taper.**
   - The direction can be read only while they move, and not in a still or poster.
   - The storyboard asked for teal arrows with gold brackets for "north-east trades", "south-east trades" and "westerlies". The labels sit only in the right column, with no link to the globe.
   - Fix: use teal, tapered streaks with a bright head, and add gold brackets or links from each label to its belt.
7. **S7: s52 (34:09–34:45). The ITCZ band is a flat 2-D ring that overhangs the globe's limb on both sides, and it is drawn exactly on the equator.**
   - Fix: drape it on the sphere along the mean MSLP trough, about 5–8° N over the Atlantic and Africa.
8. **S8: honest imagery time.** s21 labels the map "around midnight" but shows a daytime true-colour scene from the afternoon of 1 Nov.
   - The series rule says night hours use the BMNG/relief base, or the imagery time must be labelled.
   - Fix: use the relief base, or label it "satellite: 1 Nov afternoon".
9. **S9: s46 (29:52–30:24). The temperature transect graph has a single y-tick ("11"), so the size of the step cannot be read.**
   - Fix: add ticks at 0 / 5 / 10 °C.
10. **S10: records.**
    - The storyboard's music block still says "seed 7". The real score is seed 11, "air-flowing + storm-tense", G major Lydian, 84 bpm (`v2/sound2.log`). Write that into the storyboard (HOUSE_STYLE §8: style, key and seed recorded, and a different score per movie).
    - The `script.md` header still describes v1 (5696 words and 363 sentences; the storyboard says 5816 and 367). s42's header says 4 sentences while its text has 6. Refresh it.
11. **S11: "10-m wind" (s44, 29:12) is a new term that is not spoken.** The voice says "real winds near the ground".
    - Fix: label it "wind near the ground", or add "measured ten metres above the ground" to S1.

## COSMETIC
- s50 at 32:50: the warm-front semicircles vary a lot in size; one near the L is about 3× the others. Make them uniform.
- s54 at 35:30: the coastlines and borders that S3 mentions are faint at 640 px. Raise them to 2-px warm white at 70 %.
- s43: the L and H are pink and blue, while s42, s44 and s49 use cream or pink. Choose one H/L style for the whole movie.

## House-style conformance
- Opening title, voice, arc, recap and weather end card: conform.
- The deviations are the empty screens and empty halves (M1, M2), the sub-44-px text (S2) and the colour roles (S5).

## Overall: FIX (ch00_weather_basics v2 r4 review 1 — M1–M4; S1–S11 recommended)
- **What blocks `qa_pass`:**
  - M1, the blank screens: a viewer would certainly notice them.
  - M2, the long empty halves.
  - M3 and M4, the s55–s58 map labels and fronts that contradict the narration and the Brest graph.
- **Everything else is local to the composition, apart from two items:**
  - M3 and M4 need the data build (the low tracker and the front masking) re-run, with new CHECK rows and manifest hashes.
  - M3 may add one readout.
- No new narration is needed except the optional S4 and S11 wording.
- **Suggested QA addition:** a content-area-empty gate (M1), so this class of defect cannot pass 10/10 again.

Disk at review: C: 57 GB free, G: 558 GB free. Review frames: 298 MB on G: (scratch, not committed).


---

# ch00_weather_basics — review 2 (v3 fix loop 1, commit 94cab64, fresh eyes)                2026-10-28

Movie: `movies/out/ch00/ch00_weather_basics/1080.mp4`. Frames: 1101 sentence frames (start + 0.4 s, middle and end of
every one of the 429 sentences), 116 per-scene tiles at 640 px, s55 every 0.5 s and every 0.25 s through the hours
14 UTC 1 Nov – 07 UTC 2 Nov, plus crops. All under
`G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/review2/` (655 MB, local only).

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_weather_basics v3 fix 1 | 39:55.5 (2395.5 s) | 139.97 MB | 11 PASS + halves WARN | FIX (front shapes in s55–s58) | PASS | FIX (clipped "Ciarán 956 hPa") | PASS (2 × 3.5-s empty half) | PASS (601 cues, 0 violations) | PASS | n/a (retired); none on screen | **FIX** |

## qa.json
- `pass: true`. 11 gates PASS. **halves: WARN**: right half empty 219.5–223.0 s (03:39.5–03:43, s07 S1) and 1658.5–1662.0 s (27:38.5–27:42, s42 S1), 3.5 s each.
- I re-measured: −16.0 LUFS integrated, true peak −2.4 dBFS, LRA 4.4 LU (ebur128).
- Captions: I re-checked the 601 cues. None has more than 2 lines or more than 42 characters per line. The highest rate is 16.8 cps. All cues are in order, none uses `line:`, and the last cue ends at 2392.68 s. The `out/` VTT is byte-identical to the storyboard folder's VTT.
- **But `movies/out/ch00/ch00_weather_basics/en.srt` is stale.** It is the 27 Oct v2 file, 56 259 bytes, and differs from `movies/ch00/ch00_weather_basics/en.srt` from line 1348 on (see S3).

## Ciarán's centre, checked on my own against `data/ciaran_hourly.json`
- I re-derived the local minima of the hourly ERA5 MSLP (9-point minimum filter).
- **The builder is right, and review 1 was wrong on M3.**
  - At 12 UTC on 1 Nov there are three lows: 965.3 hPa at 56.25 N 25.5 W (the north-western low), **970.7 hPa at 48.0 N 17.5 W (Ciarán)**, and 972.2 hPa at 55.5 N 12 W.
  - The track follows Ciarán continuously. It is 970.7 → 964.3 (15 UTC) → 958.6 (21 UTC) → **953.65 hPa at 03 UTC 2 Nov, 50.1 N 3.7 W** (the deepest) → 955.9 at 12 UTC 2 Nov.
  - The hour-to-hour steps are 60–110 km, with no jumps.
  - The centre crosses Brest's longitude (4.49 W) at 49.96 N between 01 and 02 UTC. That is about 175 km north of Brest, over the western Channel, which matches "just north of Brest during the night".
- Spoken "about nine hundred and seventy … to about nine hundred and fifty-four": correct.
- On screen:
  - At 36:12 the "L" sits on Ciarán, and the NW low (top left) has no label.
  - "low: 971 hPa" fades in at 36:19–36:20, on its words.
  - The readout shows 954 at 03 UTC (36:24) and 956 at 12 UTC 2 Nov. s42's "956" is the same 12 UTC value.
- The Brest point (48.5 N 4.5 W) matches every spoken number:
  - pressure 997.4 → 962.06 hPa (01 UTC): −35.3 hPa in 13 h, then +14.1 hPa by 06 UTC;
  - 18 UTC: 13.2 m/s from 155° (SSE), 12.0 °C;
  - 20 UTC: 17.9 m/s from 204° (SSW), 14.35 °C. "About fourteen and a half" rounds up from 14.4; acceptable.
  - 00 UTC: 221° (SW), 12.6 °C;
  - 03 UTC: 271° (W), 23.2 m/s, 45.1 kt, 10.45 °C.
- RH at 18 °C on the movie's own e_s curve (e₀ 6.12 hPa, L 2.44 MJ/kg) is 15/20.44 = 73 %. That is right, and it is now spoken. On this curve e_s(25 °C) = 31.3 (Bolton would give 31.7), so the curve is internally consistent.

## Review-1 items, verified on the new frames

| item | verdict | evidence (new timestamps) |
|---|---|---|
| M1 blank screens | **fixed** | The picture is present on the first frame of s05 (02:21.9, column), s08 (04:16, room box), s10 (05:26.7, molecule box), s11 (06:16.7, box + p = ρRT), s12 (06:49.7, two boxes) and s34 (21:53, globe). The content gate passes (4791 samples). |
| M2 empty halves | **fixed, two 3.5-s remnants** | s18 shows the faint column from 10:37 with H = RT/g, s28 shows molecules + keywords, and s40 shows mountain + "?". What remains is the QA WARN above: s07 03:39.5–03:43 (dial only) and s42 27:38.5–27:42 (only a lone "H" in the right half). |
| M3 low label and start value | **fixed** (the data was right; see above) | 36:12 L on Ciarán; 36:20 "low: 971 hPa" (spoken "about 970"). |
| M4 map vs Brest graph | **fixed at Brest; new shape problem** | 18 UTC (37:01–37:12): the red line passes through the Brest dot. 20 UTC (37:23): Brest sits just behind it, with the "warm sector" keyword. 00–03 UTC (37:37–37:55): the blue line reaches the Brest dot. Fronts are now named in s55 S1. **But see N-M2:** after 16 UTC the blue line is no longer the trailing cold front. |
| S1 builder cosmetics | mostly fixed | The s24 slope label moved to s23 at about 3–4 km with a gold link (14:40). s31 lines are clipped, and "dew point" and "12 °C" are placed clear (20:16). The s00 readouts no longer overlap (05.5–06.1 s). **Not fixed:** the balloon glyph still floats at about 37 km in s23 (14:51), above the last data point (33.9 km). |
| S2 sub-44-px maths | fixed where checked | s27 e ≈ 1.61 q p (17:30), s29 RH fraction (18:52), s41 "iso = equal" (27:30), s52 ITCZ (34:41), s23 "tropos = turning", and the s38/s40 keywords all read at 640 px. The s40 underbrace labels and exponent are still about 40 px (cosmetic). |
| S3 clipped / detached labels | partly | Fixed: s43 Brest/L inside the frame (28:36); s59 H whole (38:02); s56 "Brest" at its dot; s58 "−2 °C" beside the drop (37:51); s25 "Paris 11 km" clear; s44 SH globe enlarged to about 330 px, arrows correct. **New:** s42 "Ciarán 956 hPa" is clipped (N-M1). The s44 high's arc is still mostly off the map (29:30). |
| S4 reveals ahead of words | fixed | The s49 cold front now appears on S5 (33:01). "RH 73 %" is spoken. |
| S5 colour roles | fixed | Pressure is teal in s56 (graph and readouts) and in the title. Temperature is orange in s57/s58. Gold is used only for links, brackets and bands. |
| S6 s53 winds | fixed | Teal arrow glyphs, with gold links from "north-east trades", "south-east trades" and "westerlies" to their belts (35:04–35:20). |
| S7 ITCZ | fixed | A teal line draped on the sphere along the trough, north of the equator over Africa and the Atlantic (34:39). |
| S8 imagery time | fixed | s21: "satellite: 1 Nov, afternoon" (13:20). s54: "satellite, afternoon". |
| S9 s46 ticks | fixed | 5 / 10 °C ticks (30:41). |
| S10 records | fixed | The `script.md` header now has v2/fix 1 with 5839 words / 367 sentences and the seed-11 score. |
| S11 "10-m wind" | fixed | "measured ten metres up" is spoken (29:15), and the screen says "wind 10 m up". |

## Full fresh pass (every scene, at least one frame per sentence)
- **Arc and house style:**
  - The title s00 is right.
  - The arc runs hook → blocks → intuition → why → application (Ciarán) → "To sum up" (s60, keyword + picture per sentence) → weather end card (s61, three keyword lines, notebook icons, everything above y 860).
  - No headings, boxes, references, equation numbers or URLs appear anywhere.
- **Physics honesty:**
  - Wind is named by where it comes from.
  - The compass runs clockwise from north.
  - s44: NH low anticlockwise, high clockwise, SH reversed, with correct arrowheads (29:46).
  - s53: NE/SE trades and westerlies in the right belts.
  - Fronts: geometry ×50 spoken; symbols on the side the front moves towards (33:27).
  - Hydrostatic numbers (12 Pa/m, 36 hPa per 300 m), H = 8.4 km, halving at 5.8 km, sea-level reduction 835·e^(1.609/8.43) ≈ 1010: all unchanged and correct.
  - The Coriolis turning is deferred to its own video, and nothing on screen claims otherwise.
- **Equation fidelity:** p = ρRT, H = RT/g with its unit line, p = p₀e^(−z/H), p_sea = p_s e^(z_s/H) and 23.2 ÷ 0.514 ≈ 45 kt are all as in the storyboard, with no KaTeX errors. There is no equation label on screen.
- **Colour-blind safety:**
  - Warm and cold fronts are coded by shape (half circles and triangles) as well as red/blue.
  - H/L are letters.
  - The pressure maps use a centred diverging map.
  - The temperature map is perceptual (purple → yellow, no jet).
- **Flashes:** 0 per second. There is no full-screen noise.
- **Sound:** −16.0 LUFS, peak −2.4 dBTP. No clicks stand out at the four replaced-sentence splices (19:01, 29:15, 36:07, 36:18): the largest sample steps there sit at sibilants, at the same level as unspliced speech.

## MUST fix
1. **N-M1: 27:55.9–28:12 (s42 S3–S4). "Ciarán 956 hPa" is clipped to "Ciarán 956 h".**
   - The label was moved right of the L (review-1 S3). It now runs past the picture zone's clip at x ≈ 1000, so the spoken number's unit is cut mid-letter.
   - Fix (either is fine):
     - Put the label under the L (centre x of the L, y + 60) and clamp it inside the globe's bounding box.
     - Or shorten it to "Ciarán 956" and put "hPa" in the keyword column.
2. **N-M2: 36:15–36:31 and 37:01–37:58 (s55–s58). From 17 UTC on, the line drawn as the "cold front" is not Ciarán's trailing cold front, so the map contradicts s49–s50.**
   - In s49–s50, at 33:00–33:27, the viewer has just been shown a long cold front trailing south-west across Biscay.
   - From `fronts.json` (hourly):
     - up to 16 UTC the blue line is the long trailing front (n = 61 points, 42.9–47.5 N, 9–20 W);
     - at 17 UTC it jumps to a 250–450-km arc hugging the west and south side of the centre (n = 21, 47.0–49.3 N). The continuity rule ("nearest to the previous hour") latched onto it after the 800-km clip;
     - from 00 UTC the red "warm front" lies north of the centre (51–52 N, south Wales to England). That is the bent-back occluded zone, not the warm front;
     - at 08–10 UTC one or both lines vanish;
     - at 11–12 UTC 2 Nov the blue line lies **east** of the red one (2–5 E). That frame is held at the end of s55 (36:30.4).
   - In s58 (37:37–37:58) the "cold front" is an arc round the low that **ends at the Brest dot**. Brest agrees with the graph, but the front visibly stops at the town instead of sweeping south across Biscay. The narration says "just as our side view said", and the map shows something else.
   - Fix:
     - Choose the cold-front candidate by shape as well as nearness:
       - length ≥ 800 km;
       - extending south or south-west of the centre;
       - clip only its northern end at the low;
       - continuity by line-to-line mean distance plus orientation, not nearest point.
     - Choose the warm front as the line east or south-east of the centre.
     - Hold the last valid line, or fade the fronts out, after about 07 UTC 2 Nov, when the storm occludes.
     - Add CHECK rows for every hour shown:
       - cold front south/west of the warm front relative to the centre;
       - cold length ≥ 800 km;
       - Brest within 50 km of the warm front at 18–20 UTC and of the cold front at 00–03 UTC (both already true).
     - Re-run the data build and the manifest hashes.
   - If the objective lines cannot satisfy this, show only the warm front up to 21 UTC plus the low and its track, and let the Brest graph carry the cold-front story. Review 1 offered the same alternative.

## SHOULD fix
1. **S1: two 3.5-s empty halves (QA WARN).**
   - 03:39.5–03:43 (s07 S1): only the barometer dial, with the right half empty. Bring "hPa" or "1 hPa = 100 Pa" in on S1's "hectopascals".
   - 27:38.5–27:42 (s42 S1): only a lone "H" sits in the right half. Show "H high" and "L low" together on "called highs … called lows", or keep s41's keyword column for 1 s.
2. **S2: 15:56–16:09 (s25 S4–S5), the inset globe.**
   - "Singapore ≈ 16 km, ≈ −81 °C" runs into the inset globe's shell.
   - The globe's atmosphere shell is cut by a hard vertical edge at x ≈ 1570.
   - The top label "≈ 8 km" is clipped at the inset's top edge.
   - −81 °C is shown but never spoken: the voice says "below minus seventy-five".
   - Fix:
     - Move the inset 80 px right and 40 px down, and draw the full shell or mask it with a soft edge.
     - Put "≈ 8 km" inside the frame.
     - Either say "about minus eighty-one degrees" or write "< −75 °C".
3. **S3: `movies/out/ch00/ch00_weather_basics/en.srt` is the stale v2 file.** Copy the current `movies/ch00/ch00_weather_basics/en.srt` before publishing, and have `movie_qa.py` compare the SRT too.
4. **S4: 14:22–15:37 (s23 vs s24), the profile top is inconsistent.**
   - In s23 the Trappes profile includes the two top points with filled heights (31.1 and 33.9 km, warming to −51 °C), and the balloon glyph sits at about 37 km.
   - In s24 the same line ends at 31 km.
   - Fix: draw the same points in both scenes. Either drop the `z_filled` points in both, or keep them and park the balloon at the last point. Also make it consistent with "balloons usually burst at around thirty kilometres".
5. **S5: 36:20 (s55), "low: 971 hPa" against the spoken "about nine hundred and seventy".**
   - The house rule is that the number on screen is the number spoken.
   - Fix: show "≈ 970 hPa" until the hours start to run, or say "nine hundred and seventy-one".

## COSMETIC
- 36:47–37:00 (s56 S3–S4): the L glyph sits on the Brest dot. Give the dot a 6-px ring, or offset the track end to the halo edge (review-1 S1, still open).
- 29:30 (s44): the high's clockwise arc is still mostly outside the map at the bottom left.
- The H/L styles still differ between scenes: s42 is cream, s45/s49/s59 are pink/blue, and s55–s58 use a dark disc with a cream letter. Pick one.
- s40 (26:20): the underbrace labels "station p" and "z_s: height" and the exponent are about 40 px.

## House-style conformance
- Opening title, voice, arc, recap, weather end card, colour roles and the no-references rule: conform.
- Departures:
  - one clipped label (N-M1);
  - two 3.5-s empty halves (S1);
  - one number on screen that is not spoken (S2, S5).

## Overall: FIX (ch00_weather_basics v3 fix 1 review 2 — N-M1, N-M2; S1–S5 recommended)
- **Review-1 status:**
  - M1 and M2 are fixed; only two 3.5-s remnants are left.
  - M3 was a review-1 error. The builder's 970.7 hPa is right, confirmed independently, and the map now labels Ciarán.
  - M4 is fixed at Brest: map and graph agree at 18–20 and 00–03 UTC.
  - S1–S11 are fixed, except the s23 balloon glyph and the s44 arc.
- **What blocks `qa_pass`:**
  - N-M1, a clipped spoken number (layout only).
  - N-M2, the front lines after 16 UTC. These need the front selection in `build_ch00_weather_basics.py` re-run with shape/orientation rules and new CHECK rows, then a re-render of s55–s58 only, about 1 min 51 s.
- Neither needs new narration, except optionally S2 or S5.

Disk at review: C: 74 GB free, G: 555 GB free. Review frames: 655 MB on G: (scratch, not committed).

# ch00_weather_basics — review 3 (v3 fix loop 2, commit 8ed38fc, fresh eyes)                2026-10-28

Movie: `movies/out/ch00/ch00_weather_basics/1080.mp4`. Frames I looked at:
- 367 sentence-midpoint frames (one per sentence, every scene);
- s55 every 0.5 s (36:06–36:32); s56–s59 every 1 s (36:32–38:23);
- full-resolution stills at every review-2 item, plus crops;
- a frame-difference scan across all 17 chunk seams.

All are under `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/review3/` (127 MB, local only). I also checked `data/fronts.json` hour by hour myself.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_weather_basics v3 fix 2 | 39:55.5 (2395.5 s) | 139.99 MB | 13/13 PASS | PASS (fronts honest) | PASS | PASS (1 small clip, S) | FIX (fronts vanish unexplained, N3-M1) | PASS (601 cues; VTT and SRT = source) | PASS (one colour-sense clash, S) | n/a (retired); none on screen | **FIX** |

## qa.json
- `pass: true`, with all 13 gates PASS: duration, size, codec, black, frozen, content, halves, loudness (−16.0 LUFS, −2.4 dBTP), flashes (0/s), captions (601 cues), subtitles, physics (31 functions reproduce their hashes) and equations (29 present).
- `halves` is now PASS, where review 2 had a WARN.
- `out/en.srt` and `out/en.vtt` are byte-identical to the storyboard folder's files (review-2 S3 fixed).
- Chunk seams: the mean frame-to-frame difference across every seam is ≤ 0.6 grey levels. That matches neighbouring frames, and there are no jumps.

## fronts.json, checked hour by hour (Brest 48.45 N 4.42 W)
| UTC | warm line | cold line (NE end) | nearest to Brest |
|---|---|---|---|
| 12 | 510 km, starts at the low and runs E-SE | 2190 km, trailing WSW, 260 km from the low | warm 561 km, cold 797 km |
| 15 | 936 km | 2677 km | warm 328 km, cold 456 km |
| 18 | 861 km, (49.8 N 11.4 W) → (46.7 N 1.8 W) | 2626 km, NE end 48.0 N 6.7 W | **warm 15 km**, cold 175 km |
| 19 | 622 km | NE end 48.5 N 5.7 W | warm 61 km, cold 91 km |
| 20 | 660 km, NE of Brest | NE end 46.5 N 5.7 W | warm 143 km, cold 236 km |
| 21 | 1019 km | 3051 km, NE end pulled back to 44.9 N 6.0 W, 491 km from the low (axis turn 13°) | warm 218 km, cold 413 km |
| 22 → 12 (2 Nov) | none (`shown: false`) | none | – |

- **Honest: yes.**
  - Every hour shown passes the new shape rules: warm E–SE of the centre; cold ≥ 800 km and trailing S–SW; gaps 34–118 km; axis turns ≤ 36°. The 13 UTC warm turn of 36° is the only one above 30°, and the 30° gate applies to the cold line only.
  - The cold line is the same trailing front as in s49/s50 at 18 UTC.
  - The geometry at Brest is textbook. At 18 UTC the warm front passes 15 km from the town (37:05). At 20 UTC the warm front lies NE of Brest and the cold front's end is in Biscay to the SW, so Brest sits in the warm sector (37:20), just as narrated.
  - After 21 UTC the cold line's NE end retreats south, 413 → 491 km from the low. The builder's note says the only S–SW cold line after 21 UTC lies SE of Brest, before the station's 00–03 UTC wind shift. Drawing it would contradict the Brest graph, and drawing nothing is the honest choice.
  - In s58 no front line is drawn, so nothing on the map contradicts the station.
- **Clear for a learner: not yet.** The fronts vanish twice with no word, and the second time it happens exactly as the voice says "cold front" (N3-M1 below).

## Review-2 items, checked at their timestamps
| item | verdict | evidence |
|---|---|---|
| N-M1 s42 "Ciarán 956 hPa" clipped | **fixed** | 28:08: the label sits whole under the L (x ≈ 440–815); "≈ 1030 hPa" sits under the H. Both read at 640 px. |
| N-M2 s55–s58 fronts | **fixed (data and drawing)** | 36:10–36:18: the 12 UTC fronts are named on their words ("warm front" 36:11, "cold front" 36:12.5–36:13). 36:21–36:22.4: they move with the low to 20 UTC and fade 36:22.4–36:22.7. 37:05 and 37:20: correct 18/20 UTC geometry at Brest. 12 UTC 2 Nov (36:30): no stray lines east of the low. **Narration and clarity are still open:** see N3-M1. |
| S1 empty halves | **fixed** | s07: "101 325 Pa: a big number" at 03:40.5, then "1 hPa = 100 Pa" and "hectopascals (hPa)" by 03:43.5. s42: "H high" at 27:42, then "L low". QA halves PASS. |
| S2 s25 inset globe | **fixed** | 16:00–16:07: the full ring with a soft edge is clear of the plot. "≈ 8 km" and "≈ 16 km" are inside it. The key reads "Singapore ≈ 16 km, below −75 °C", which matches the voice. |
| S3 stale `out/en.srt` | **fixed** | Byte-identical, and the new subtitles gate checks it. |
| S4 s23/s24 profile top | **fixed** | 14:45.8: the balloon is a dot on the 33.9-km point. s24 (15:00–15:34) draws the same line to the same point. |
| S5 "971" vs "about 970" | **fixed** | 36:20.5: "low: ≈ 970 hPa" appears on "about nine hundred and seventy", then the running values. 954 shows at 36:23 on "fifty-four". |
| Cosmetic: L on the Brest dot | partly | The Brest ring is now drawn over the L (37:33–37:58), so the dot reads, but the L is half hidden at 00–03 UTC. |
| Cosmetic: s44 high arc | fixed | The arc is inside the map (29:36–29:47). |
| Cosmetic: H/L styles | fixed (one style everywhere) | Pink L and blue H in s35/s42/s44/s52/s55–s59. This creates S-a below. |
| Cosmetic: s40 underbrace labels ≈ 40 px | still open | 26:49 "station p", "z_s: height". |

## Spot check of the re-rendered chunks (1, 6, 7, 10, 12, 13, 15, 16, 17), ≥ 1 frame per sentence
- **s05–s08:** column, stick figure, dial and room box are present from each scene's first frame, and the maths appears on its words.
- **s21–s27:** radiosonde map; s22 shell bars; s23/s24 profile (thermosphere above mesosphere, ≈ 50 km dashed) are all as in review 2.
- **s34–s37:** knots scale bar and Brest map at 100 km (47 N); the climate band "8 days in 10"; observing-system dots on the globe.
- **s40–s46:** sea-level reduction 835 × e^(1.609/8.43) ≈ 1010; isobar keywords; NH low anticlockwise and high clockwise with the SH inset reversed (29:41); air masses at 850 hPa.
- **s50–s54:** front symbols on the side they move towards; equinox geometry; ITCZ; trades and westerlies with gold links; Ciarán satellite with Brest.
- **s59–s61:** 2 Nov afternoon map; recap keyword + picture per sentence; series end card with every element above y 860.
- No regression found in these chunks apart from S-a, S-b and the cosmetics below.

## MUST fix
1. **N3-M1: 36:22.4–36:30 and 37:33.4–37:37 (s55 S1–S2, s58 S1). The fronts disappear with no word, and in s58 the blue line is removed exactly as the voice says "comes the cold front".**
   - s55 S1 (36:07–36:18) says "…with the warm front in red and the cold front in blue, from midday on the first of November to midday on the second". The fronts are shown only to 21 UTC, which is about 2 s of the 12-s run, and then fade. A viewer reasonably hears that the fronts run until midday on the 2nd.
   - Then s57 brings them back (37:01–37:33), and s58 drops them at the cut (37:33.8) during "A few hours later comes the cold front" (37:33.4–37:36.3).
   - For 3 s nothing on screen is a cold front, until the graph band "cold front" appears at 37:37. The viewer sees the front go away at the moment it is said to arrive.
   - **Exact sentence fixes (narration only; no new data):**
     - s55 S1, replace with:
       > "Here are the isobars every four hectopascals from midday on the first of November to midday on the second, with the warm front in red and the cold front in blue until that evening."
     - s58 S1, keep "A few hours later comes the cold front." and add one new sentence after it:
       > "By now the storm has broken and bent its fronts so much that the map can't trace them cleanly, but Brest's own measurements show it clearly."
   - The s58 addition makes the "cold front" band on the graph the thing the voice points to. Fade the map's fronts out over the first 0.5 s of s58, instead of a hard cut, so the change is seen while it is spoken.
   - Cost:
     - two Kokoro clips; s55 gets about +1 s and s58 about +7 s;
     - re-time the s58 graph reveals (band, readouts, "−2 °C", "cooler polar air") to the shifted sentences;
     - re-render chunks 16–17 and re-run QA.
   - Captions: both sentences split into ≤ 2 × 42-character cues at about 15 cps.

## SHOULD fix
1. **S-a: 27:41–28:35 (s42) and 34:28–34:50 (s52). On the coloured pressure maps, the letter colours contradict the colour bar.**
   - The bar is blue = low and red = high. The blue "H" sits on red shading and the pink "L" sits on blue shading.
   - It reads correctly as letters, but a learner who has just been taught the bar sees a "blue high".
   - Fix: on the diverging MSLP globes (s41/s42/s52), draw H/L in cream with the 3-px dark outline. Keep pink L / blue H on the satellite and grey maps (s35, s43, s44, s55–s59).
2. **S-b: 13:20–13:51 (s21). The bottom of "satellite: 1 Nov, afternoon" is cut by the picture's lower edge (y ≈ 860).**
   - The comma's tail and the outline under the baseline are cut.
   - It is readable, but it is a clipped label. Move the two keywords up about 14 px, or inside the image's safe box.
3. **S-c: 36:26–36:30 (s55 S2). "its centre crosses the English Channel just north of Brest during the night" is spoken while the clock shows 07–11 UTC.**
   - The crossing itself (01–02 UTC) went past at 36:23.
   - Fix: spend more of the run on 22–04 UTC so the crossing lands on "during the night". Use the same frame budget and slow only those hours.
   - This can be done in the same chunk-16 re-render as N3-M1.

## COSMETIC
- 15:56–16:09 (s25): the teal Singapore profile runs through the "Paris 11 km" label. Nudge the label 30 px down or left.
- 37:23–37:33 (s57): "14.4 °C" on screen against the spoken "about fourteen and a half". Review 2 accepted it. Either say "fourteen point four" or show "≈ 14.5 °C".
- 37:33–37:58 (s58): the L is half under the Brest ring at 00–03 UTC. Offset the L glyph 30 px up-left when it is within 40 px of the ring.
- 26:49 (s40): the underbrace labels are still about 40 px.

## House-style conformance
- These all conform:
  - the opening title, the arc and the "To sum up" recap;
  - the weather end card;
  - voice, colours (pressure teal, temperature orange, gold only for links, bands and the track);
  - keywords only, no headings, boxes, equation labels, references or badges;
  - every number on screen spoken (S5 fixed).
- Departures:
  - one visual-narration mismatch (N3-M1);
  - one colour-sense clash (S-a);
  - one clipped keyword (S-b).

## Overall: FIX (ch00_weather_basics v3 fix 2 review 3 — N3-M1; S-a…S-c recommended)
- N-M1 and N-M2 are fixed in data and drawing. The front choice by shape is honest, I confirmed it hour by hour in `fronts.json`, and the 18/20 UTC geometry at Brest is now textbook.
- Review-2 S1–S5 are all fixed.
- The one block is narration: the fronts' disappearance after 21 UTC, and again at the start of s58, is never said. Two sentences (above) and a re-render of chunks 16–17 close it.
- After that fix I expect `qa_pass` with no further visual work. S-c is best done in the same re-render.

Disk at review: C: 73 GB free, G: 553 GB free. Review frames: 127 MB on G: (scratch, not committed).

---

# ch00_weather_basics — review 4 (v3 fix loop 3, commit 866f82f, targeted confirmation)                2026-10-28

Movie: `movies/out/ch00/ch00_weather_basics/1080.mp4` (mtime 28 Oct 13:55). The builder's report was lost, so I checked everything below from the file itself, `timing.json`, `en.vtt` and the audio. Frames I looked at:
- 368 sentence-midpoint frames (one per sentence, every scene s00–s61);
- s55–s59 every 0.5 s (36:06–38:13, 254 frames);
- full-resolution stills for S-a (s42, s52), S-b (s21), s25, and crops of the Brest ring;
- frames at the s59/s60/s61 boundaries and the last second.

All are under `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/review4/` (120 MB, local only).

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_weather_basics v3 fix 3 | 40:05.6 (2405.63 s) | 140.19 MB | 13/13 PASS | PASS | PASS | PASS | PASS (N3-M1 closed) | PASS (604 cues; VTT and SRT = source) | PASS (S-a closed) | n/a (retired); none on screen | **PASS** |

## qa.json
- All 13 gates PASS:
  - duration 2405.63 s against a narration end of 2403.12 s;
  - size 140.19 MB, under the 160 MB budget;
  - codec h264 High, yuv420p, AAC, faststart;
  - black: 0; frozen: 205 stretches, all narrated;
  - content and halves: PASS;
  - loudness −16.0 LUFS, −2.5 dBTP; flashes 0/s;
  - captions: 604 cues match the script; subtitles: SRT = VTT = source;
  - physics: 31 functions reproduce their hashes; equations: 29 present.
- `out/en.vtt` and `out/en.srt` are byte-identical to the storyboard folder's files (`cmp`).
- `timing.json → self_check`: audio length = expected length (diff 0 ms). `spliced_fix3` lists exactly two edits: the s55 S1 replacement (+1.075 s) and the s58 insert after S1 (+9.075 s). The movie is 10.15 s longer than v3 fix 2, as expected.

## N3-M1 — fronts and narration (closed)
| check | verdict | evidence |
|---|---|---|
| s55 S1 text | **as specified** | `script.md`, storyboard and VTT all read "…from midday on the first of November to midday on the second, with the warm front in red and the cold front in blue until that evening." Cues 36:07.1–36:18.9, 15.1 cps. |
| s55 fronts on their words | **yes** | Red line from 36:14.5 on "warm front" (about 36:14.6); blue line from 36:16.5 on "cold front" (about 36:16.4). The legend adds each line as it appears. |
| s55 fronts gone after the evening | **said and shown** | The clock runs 12 → 19 UTC with both fronts (36:21.5–36:23.0). At 22 UTC (36:23.5) the lines and legend are gone. The voice has already said "until that evening". |
| s58 inserted sentence | **as specified** | "By now the storm has broken and bent its fronts so much that the map can't trace them cleanly, but Brest's own measurements show it clearly." 37:37.75–37:46.47, in 3 cues of ≤ 28 characters per line, 15.8 cps. |
| s58 fade, not a cut | **yes** | The fronts and "warm sector" are full at 37:34.0, half-faded at 37:34.5–37:34.6 (crop), and gone at 37:35.0. That is about 0.5 s from the scene start at 37:34.43, with no hard cut. |
| s58 graph reveals on their words | **yes** | "cold front" band at 37:44.0, on "Brest's own measurements show it clearly" (37:43.6–37:46.5). "19 m/s from 221° (SW)" at 37:47.0, on "Between midnight…" (37:46.8). "23 m/s from 271° (W)" at about 37:54, on "by three, it's about twenty-three". "23.2 ÷ 0.514 ≈ 45 kt" at 37:57.5, on "forty-five knots". "−2 °C" at 37:59.0, on "drops by about two degrees". "cooler polar air" fades in at 38:05.5, on S5 (38:05.7). |
- The viewer now hears why the map stops drawing fronts before they vanish. Then the voice points at the graph band, and the band appears as it is named. Nothing on screen contradicts "comes the cold front".

## Recommended items from review 3
| item | verdict | evidence |
|---|---|---|
| S-a cream H/L on the coloured pressure globes | **fixed** | s42 (28:05, 28:25): the H, the L, "Ciarán 956 hPa" and "typhoon ≈ 935 hPa" are cream with a dark outline. s52 (34:32): both subtropical H are cream and outlined. Pink L and blue H are kept on the satellite and grey maps: s35 (22:53), s43/s44 (28:37–29:47), s55–s59, s60 recap. They are also kept on the s45/s46/s49 temperature maps, which is consistent with the rule (they are not pressure shading). |
| S-b s21 "satellite: 1 Nov, afternoon" | **fixed** | 13:32 full frame: the baseline and comma tail sit inside the image (text bottom y ≈ 848, image edge y ≈ 858). Nothing is cut. |
| S-c Channel crossing while the clock shows it | **fixed** | "and its centre crosses the English Channel just north of Brest during the night" is spoken 36:26.5–36:31.6. Clock: 01 UTC 36:24.5–36:27.0, 02 UTC 36:27.5–36:29.0, 03 UTC 36:29.5–36:30.0. The L sits just north of the Brest ring through these hours, and the run reaches 07–12 UTC only after the sentence ends. |
| Cosmetic s25 Paris label | **fixed** | 16:02: "Paris 11 km" sits below the curves, clear of the teal line. |
| Cosmetic s57 14.4 vs "fourteen and a half" | **fixed** | "≈ 14.5 °C" appears at 37:24.0, on "about fourteen and a half". |
| Cosmetic s58 L under the Brest ring | **fixed** | 37:52 crop: the L is offset up-left and fully readable, and the ring is drawn whole. |
| Cosmetic s40 underbrace labels ≈ 40 px | still open (cosmetic) | 26:49 "station p", "z_s: height". These are unchanged and were accepted in reviews 2 and 3. |

## Splice quality (audio)
- **No clicks.**
  - Around every replaced or inserted boundary (36:07.07, 36:18.90, 36:19.25, 37:37.40, 37:37.75, 37:46.47, 37:46.82), the largest sample-to-sample step within ±0.2 s is 0.002–0.004 of full scale.
  - Speech peaks are around 0.29.
  - The 10-ms RMS on each side of each boundary matches within 3 dB, at the −34…−43 dBFS music-bed floor.
- **Level matches.** Active-speech RMS:

  | sentence | active-speech RMS |
  |---|---|
  | new s55 S1 | −16.5 dBFS |
  | neighbouring s55 S2 | −16.4 dBFS |
  | new s58 S2 | −16.6 dBFS |
  | neighbouring s58 S3 | −16.4 dBFS |
  | neighbouring s58 S4 | −17.0 dBFS |

  Integrated loudness over the s55 and s58 windows is −15.6 to −15.9 LUFS, against −16.2 LUFS for s54 and s56. These are ordinary sentence-to-sentence differences. `corr_resynth` 0.9895 shows the untouched sentences were re-used.
- **Timing.** The silences found in the audio (−28 dBFS gate) line up with `timing.json` through s59: for example 37:36.8–37:38.2, 37:45.7–37:47.2 and 38:10.2–38:12.2. Every cue in s55–s59 falls inside its sentence's audio.

## Regression spot-check (every scene, ≥ 1 frame per sentence)
- **s00–s54 (unchanged chunks):** the title, globe, column, gas law, hydrostatic derivation, scale height, exponential, radiosonde, layers, humidity, wind, units, climate band, observations, reanalysis, sea-level reduction, isobars, H/L, air masses, fronts, sunlight, belts, trades and Ciarán intro are as in review 3. The only differences are the S-a/S-b/s25 fixes above.
- **s55–s59 (re-rendered, shifted by +1.075 s, s58 on by +10.15 s):** every reveal was checked at 0.5 s. The cut to s59 is at 38:11.75, and the "2 Nov, afternoon" map is on screen from 38:12.0.
- **s60 recap (38:33.1–39:36.7) and s61 end card (39:37.5–40:02.8):**
  - Each recap keyword appears with its picture on its sentence.
  - The end card's "a series of tutorials" appears at about 39:37. It adds "meteorology · atmospheric science · climate", then "the ideas, and the maths behind them", "weather-basics notebook" and "notebooks for the other concepts" on their sentences.
  - The end card fades to black in the 2.8-s tail.
- **Nothing new was found.** No clipped text, overlaps or empty halves turned up in any of the 368 midpoint frames.

## House-style conformance
- Conforms in full. Specifically:
  - opening title and series end card as specified;
  - keywords only;
  - no headings, boxes, equation labels, references or badges;
  - gold only for links, bands and the track;
  - every number on screen is spoken;
  - reveals land on their words;
  - the H/L colours no longer clash with the colour bar.
- The one departure in review 3 (N3-M1, narration and visual mismatch) is closed.

## Overall: PASS (ch00_weather_basics v3 fix 3 review 4 — `qa_pass`)
- N3-M1 is fixed as specified: the text, a 0.5-s fade, and graph reveals on their words.
- S-a, S-b and S-c are fixed, along with three of the four cosmetics.
- The splices are clean and level-matched, and the captions equal the source.
- No regression in any scene. The only open item is the s40 underbrace label size (cosmetic, optional).
- This is final: the movie may go to `drafts/` for the user to watch before `/approve-movie 0 ch00_weather_basics`.

Disk at review: C: 69 GB free, G: 543 GB free. Review frames: 120 MB on G: (scratch, not committed).


---

# ch00_dot_product_v01b — review 1 (fresh eyes, build 7faa7d5)                         2026-10-28

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_dot_product_v01b | 25:39.5 (1539.47 s) | 77.44 MB | 12 PASS, halves WARN | PASS | PASS (72/72) | FIX (2 collisions) | PASS | PASS (376 cues) | PASS | n/a (retired) | **FIX** |

Inputs: `movies/out/ch00/ch00_dot_product_v01b/1080.mp4`, storyboard, script, data_needs, manifest, timing, TSX, and the v6 reference (`movies/out/ch00/ch00_dot_product_why/1080.mp4`, v6 script and timing).

Frames: 1580 PNGs on G:, in `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_dot_product_v01b/review1/`, 129 MB.
- One frame at the midpoint and one at the end of every sentence (231 sentences), plus the first frame of every scene.
- Matched v6 / v01b pairs: three per v6 sentence, 465 pairs.
- Frames every 1–2.5 s through s00, s04, s05a, s07, s11a, s11b, s20c, s20d, s20e and s21.
- Full-resolution crops of every suspect spot.

Disk at review: C: 69 GB free, G: 553 GB free.

## qa.json (re-run by me with the requested flags)
- PASS: duration (1539.47 s vs narration end 1536.95 s), size, codec, black, frozen (146 stretches, all narrated, longest silence 1.50 s = a beat), content, loudness (−16.0 LUFS, −3.4 dBTP), flashes (0/s), captions, subtitles, physics (75 functions), equations.
- WARN halves: right side empty at 23.0–29.5, 47.0–53.5, 87.5–92.5, 326.0–330.5 and 1467.0–1473.5 s.
  - All five are inherited from v6. At the matched sentence points the v01b frames differ from v6 in ≤ 0.6 % of pixels (s02, s03, s04, s07, s21).
  - Fixing them changes no words, but it changes v6's approved screen. **My decision: leave them**, and record them as accepted v6 design.
  - The builder already filled two other v6 halves (s06 and s11, see below). One of those fills causes M2, which argues for leaving the rest alone.
- My own scan of the caption band (y 870–1040, 2 fps) found only two spots, both identical in v6 and so inherited. Leave both:
  - 85.5–87.0 s: the descenders of the s03 "scalar product" keyword reach y ≈ 880.
  - 829–861 s: the s17 "18 km × 1 °C / 100 km" fraction reaches y ≈ 877.
  - The builder's "s13" spot does not show at this threshold.

## v6 kept? (the user's key requirement), checked against the v6 script, timing and movie
- **Words:**
  - all 28 v6 scenes are present;
  - all 155 v6 sentences appear verbatim and in v6 order (scripted comparison);
  - the added sentences sit only where data_needs §0 says (s04 S4–S7, s05 S9–S13, s07 S5–S7, s09 S4–S6, s21 S2/S8/S10–S12).
- **Devices and numbers:** every v6 sentence's frames (at 15/50/90 % of the sentence) match v6 within ≤ 0.32 % changed pixels.
  - The only exceptions are s00 (the intended title fix), s21 (extended layout, ≤ 1 %, all v6 mini-pictures present) and s22 (six thumbnails).
  - Two small additions sit inside "unchanged" v6 scenes, both halves fills:
    - s06 shows a dim "a·b = |a||b| cos θ (1)" from the scene start;
    - s11 S2 keeps "both sizes" on screen.
  - Neither removes anything, but the s06 one collides (M2).
- **Music:** v6's score (tools/music.py seed 7, the same bed and duck). Loudness is −16 LUFS throughout (−15.7 to −16.2 per section).
- **Beats:** the 10 `[beat]` holds sit after a result each time ("≈ 8", "= 8", "same area: eight", "fifty joules", 0.18 K/h ×2, 8.7 m/s, "one half", 0.01 W/m², ≈ 0.89).
  - On screen, each one lands on the gold underline of that result, so it feels natural.
  - Inside v6 scenes (s04, s16b, s17b) they add only a pause.
- **Title fix:** the subtitle sits on two lines and ends at x ≈ 843. The animation starts at x ≈ 1164 (part B map) or 1245 (part A grid), so the clearance is about 320 px against the 50 px required (1.1, 2.2–9.9 s). The readout is in one face. PASS.

## Physics and maths honesty (new and changed scenes)
- s04 unit arrow: it marks off cos θ, and the three stops light v6's three ticks with gold links on the words (126–134 s).
- s05 sweep: + front half, 0 on the line across, − back half (hatch plus "−" glyph). Readouts +6.00 → 0.00 → −5.95, all consistent with |p||q| = 6.
- s05a: the expansion is correct (5·1 x̂·x̂ + 5·3 x̂·ŷ + 1·1 ŷ·x̂ + 1·3 ŷ·ŷ; the mixed terms are struck; x̂·x̂ = 1·1·cos 0°).
- s09 rectangles: aspect ratios 0.80 and 0.30 against 0.80 and 0.31, equal areas within 5 %.
- s11a and s11b:
  - the rails take the across part; W = 50 J;
  - the whirled ball runs anticlockwise on screen with v tangent and F inward, so F·d = 0 and the energy bar stays flat.
- s20b: v·ê = 10 cos 30° ≈ 8.7 m/s.
- s20c (equinox):
  - the terminator is a vertical meridian with the sun on the left;
  - at 60°N on the noon limb, n̂ points 60° above the sunward horizontal;
  - ŝ·n̂ = 0.5, "× 2 ground".
- s20d:
  - τ·u has the right sign on both tiles;
  - the NCEP winds on the south-polar globe circulate **clockwise seen from above the South Pole = eastward** (westerlies);
  - the geography is not mirrored (Africa top, Australia lower right, the Peninsula toward South America);
  - ≈ 1 TW (Wunsch 1998) is verified in manifest.json, with Hughes & Wilson's 0.76 TW as the cross-check.
- s20e: 6 + 2 + 2 + 6 = 16, |A| = |B| = √18, 16/18 ≈ 0.89. This is the uncentred anomaly cosine, which is what the words describe.

## MUST fix
1. **M1: 24:02.4–24:08.9 (s20e S8, 1442.4–1448.9 s). The gold link from "past days like today" to the past-day panel cuts through the "≈ 0.89" underline and crosses the −1…+1 gauge line between −1 and 0.**
   - This breaks the house rule that links must not cross text or ticks, and it is plainly visible at full screen.
   - Fix (pick one):
     - put the label above the panel pair (about x 1100, y 330) with a short straight link to the panel;
     - or keep it under the gauge and bend the path out to the left of x 1060, so it clears the stack and the gauge.
   - Re-render the s20e chunk.
2. **M2: 05:19.8–05:25.6 (s06 S5, 319.8–325.6 s). The CalcStack's final gold underline (y ≈ 756) runs into the top of the dim "a·b = |a||b| cos θ (1)" reminder (y ≈ 790).**
   - The underline touches the bars of |a| and |b| and the θ.
   - The reminder is a v01b addition to an "unchanged" v6 scene. v6 had no collision here.
   - Fix: fade the reminder out at S5 start ("Divide both sides of equation one", where the stack itself opens with "(1) ÷ |b|"). The reminder keeps its job of filling the empty side during S1–S4. Or move it to y 840.

## SHOULD fix
1. **S1: 08:30–09:06 (s11a, 510–546 s). The decorative wind streaks run to the top frame edge (y 0), outside the content area.**
   - They also pass behind the F label.
   - Clip the streak layer to the picture zone (x 80–1000, y 40–860). This is builder-known and confirmed.
2. **S2: s20e S2–S8 (23:12–24:09). Capital A and B are on screen throughout but are never named.**
   - Fix: add "Let's call today's arrow capital A, and the past day's capital B." after S3, about 3 s.
   - **Hectopascals** are spoken but never defined. Add "the unit weather maps use for pressure" to S4.
3. **S3: 22:44–22:56 (s20d S8). "watts" and "W = watt" are not explained.**
   - Add "a watt is one joule every second" to S8.
   - Optionally show N/m² × m/s = W/m² with the unit story, as v6 does for K/h.
4. **S4: 09:06–09:24 (s11b S1–S3).**
   - "always across the motion?" writes the narrated question on screen. Keep a keyword such as "always across" instead.
   - The ball's arrow **v** is never said; in this movie v is the wind. Say "its velocity, v" in S3, or label the arrow "motion".
5. **S5: 20:46–20:50 (s20b S4).** "towards the north east, thirty degrees off the runway": north-east is 45°, while the picture and the numbers use 30°.
   - v6's own "north-east" for (6, 8) at 37° set a loose precedent, so this is Should, not Must.
   - Suggested: "…blows at ten metres per second, thirty degrees east of the runway's direction."
6. **S6: 21:00–21:06 (s20b S7).** The "cross product" link's arrowhead sits on the **v** label at the wind arrow's tip. Point it at the midpoint of the dashed "across" part instead.
7. **S7: 23:07.5–23:09 (s20d S9).** The "Antarctica" and "circumpolar current" links cross each other over the current ring. Offset the Antarctica keyword down (y ≈ 640) so the two paths do not meet.
8. **S8: 23:58.6–23:59.6 (s20e S7).** "opposites" is on screen for under 1 s, while "alike" and "nothing in common" get 2–3 s each. Keep all three labels once shown, or hold "opposites" to the end of S7 + 1 s.
9. **S9: 04:12–04:50 (s05a S5–S9).**
   - The maths column grows to 8 lines (house CalcStack ≤ 3, older lines at 60 %) and reads as a wall of text at 640 px.
   - Dim a = …, b = … and the question line to 40 % once the expansion starts.
   - x̂·ŷ = 0 and the right-angle marks are drawn in **rose**, the negative colour. Use warm white or slate for a zero (as v6 s05 does for "0 right angle").
10. **S10: docs (not on screen).**
    - storyboard.yaml lines 2560, 2773 and 2777, and data_needs.md §C W2, still say the 1 TW figure "must be confirmed / stays OFF the screen". The manifest records it as verified, so update the notes.
    - S2 (s20e S8, "Forecasters have used this"): the cited Lorenz (1969) chose analogues by RMS difference, not the cosine. Cite a source that used anomaly correlation for analogue selection (e.g. Toth 1989/1991, or van den Dool's analogue work), or soften to "compared weather maps like this".

## COSMETIC
- 06:36.5–06:38.5 (s09 S4): about 2 s with only "a·b = b·a" on screen between the panels and the rectangles. The second rectangle's fill is a mauve-rose that can read as "negative"; use a neutral orange tint.
- 24:57–24:59.5 (s21 S11): about 2.5 s with only the thumbnail row before "sunlight" appears. Hold the S10 whirl until the sunlight icon arrives.
- 06:02–06:07 (s07 S7): "a · ruler" mixes a word into a dot product, and "b̂ = b/|b|" stays while the ruler turns away from b. Fade b̂'s stack during the turn.
- 23:46 (s20e S6): |A| = √(3² + 1² + 2² + 2²) drops the minus signs. Write (−2)², which a novice expects.
- Gold is used as a fill for the work, energy and light bars and for "≈ 1 000 000 000 000 W". The house reserves gold for pointers. Consider warm white for the bars and the number.
- 25:13–25:37 (s22): six thumbnails against HOUSE_STYLE's four. Accept (they name related movies) or trim to four.
- Inherited from v6, leave as approved: the s17 gold link crosses the "350" km tick (13:49–14:21); the caption-band touches at 85.5–87 s and 829–861 s; the five halves WARNs.

## House-style conformance
- These all conform:
  - the opening title (with the fix) and the arc, with the new examples after v6's application and before the recap;
  - spoken bridges ("First, a runway.", "Second…", "Third…", "Fourth…");
  - keywords only;
  - no headings, boxes, equation labels (beyond the plain "(1)"), references or badges;
  - teal/orange/rose/slate roles;
  - reveals on their words (checked ±0.5 s at every sentence in the new scenes);
  - the maths ending word for word as v6.
- Sound effects (wind under s11a, surf under s20d) are listed in the storyboard and credited in the manifest. I did not judge them by ear.
- Departures: M1 and M2 (collisions), the undefined A/B/hPa/W/v (S2–S4), the narrated question on screen (S4) and the zero-in-rose colour (S9).

## Overall: FIX (ch00_dot_product_v01b review 1 — M1, M2; S1–S10 recommended)
- The user's key requirement holds: every v6 scene, sentence (155/155), number, device and the v6 score are kept.
- The additions are correct physics with honest data, and the title fix clears 50 px by a wide margin.
- Two visible collisions block `qa_pass`: the s20e link through the result and gauge, and the s06 underline touching the added reminder. Both are layout-only.
- The fix loop:
  - Do M1 and M2 and re-render the s06 and s20e chunks.
  - Ideally fold in S1, S6, S7, S8 and S9 (layout only, same chunks plus s05a, s11a, s20b, s20d).
  - S2–S5 need about 4 new Kokoro sentences (s11b, s20b, s20d, s20e) and a re-time of those scenes. They are worth doing in the same loop, because no v6 sentence is touched.

---

# ch00_dot_product_v01b — review 2 (fresh eyes, fix loop 1)                         2026-10-28

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_dot_product_v01b | 25:52.8 (1552.83 s) | 77.83 MB | 12 PASS, halves WARN (inherited) | PASS | PASS (72/72) | PASS | PASS | PASS (379 cues) | PASS | n/a (retired) | **PASS** |

Inputs: `movies/out/ch00/ch00_dot_product_v01b/1080.mp4`, storyboard (fix_loop_1 block), script, data_needs, timing, manifest, TSX. Compared against the review-1 build (`G:/…/ch00_dot_product_v01b/r1/render/1080.mp4`, narration and timing in `…/public/`) and v6 (`movies/out/ch00/ch00_dot_product_why/1080.mp4`, narration `G:/…/ch00_dot_product_why/v6/public3/narration.wav`).

Frames: 772 PNGs on G:, `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_dot_product_v01b/review2/` (174 MB).
- Two frames per sentence (50 % and 92 %) for all 233 sentences, and a third at 15 % used only for the pixel diff.
- Every 1 s through s05a S3–S9, s06 S4–S5, s11a, s11b, s20b, s20d S7–S9 and s20e. Extra frames at s20d's globe hand-over and the s20b link. Side-by-side diff images are in `pairs/`.

Disk: C: 68 GB free, G: 551 GB free (unchanged by the review).

## qa.json (re-run by me with the requested flags)
- PASS on duration (1552.83 s against a narration end of 1550.33 s), size, codec, black and frozen.
  - Frozen: 154 stretches, all narrated. The longest silence is 2.81 s, which is the end-card tail (1550.03 → 1552.83 s).
- PASS on content, loudness (−16.0 LUFS, −2.7 dBTP), flashes (0/s), captions and subtitles (379 cues = script; VTT = SRT), physics (75 functions reproduce their hashes) and equations (72).
- Halves WARN: 23.0–29.5, 47.0–53.5, 87.5–92.5, 326.0–330.5 and 1480.5–1487.0 s.
  - These are the five inherited v6 spots. The last one is review 1's 1467.0–1473.5 s moved by the +13.38 s of new narration.
  - They were accepted as v6 design and are not flagged again.

## v6 kept? (scripted checks)
- **Words:** all 155 v6 sentences appear verbatim and in v6 order (0 missing).
- **Audio against the review-1 build:** I compared 227 untouched sentences sample by sample. The maximum |Δ| is **0**, so they are bit-identical. The only sentences without a match are the 6 new or changed ones, all non-v6.
- **Audio against v6:** the 155 v6 sentences are the same takes as in v6 (correlation ≥ 0.9942, level 0.992–1.013). This is the same as at review 1; fix 1 did not change it.
- **Screens against the review-1 build:** I diffed 699 frames, at 15/50/92 % of every sentence, aligned by sentence.
  - These scenes show **0.00 %** changed pixels: s00–s05, s08, s10, s11, s12–s18, s19b–s20 and s22.
  - s19a (one frame, 0.14 %) and s20c (one frame, 0.25 %) differ by sub-frame sampling or anti-aliasing only. s20c's new start falls on a half frame (+1.45 s); I looked at the diff images.
  - The changes sit only where fix 1 put them: s05a S4–S9, s06 S5, s07 S7, s09 S4–S6, s11a, s11b, s20b S7, s20d S8–S9, s20e and s21 S11.
  - s06 S5 now matches **v6** within 0.01 % (the M2 fade puts back v6's own screen). s06 S1 differs from v6 by 0.28 %, which is only the accepted dim reminder.
- **Title, recap and end card:** the title and end card are pixel-identical to review 1. The recap's only change is the intended whirl hold.

## Review-1 items, checked at their new timestamps
| item | new time | state |
|---|---|---|
| M1 s20e link | 24:12.9–24:21.5 (1452.9–1461.5 s) | **Closed.** The "past days like today" link now runs up the gap between the stack (ends x ≈ 700) and the gauge (starts x ≈ 1150). It clears the ≈ 0.89 underline and the gauge line, and ends on the gold-framed past-day panel. |
| M2 s06 reminder | 05:14.7 (314.7 s) | **Closed.** The dim "a·b = \|a\|\|b\| cos θ (1)" fades by 315 s, as "(1) ÷ \|b\|" opens. The final gold underline (from 322 s) has nothing under it. |
| S1 s11a streaks | 08:26–09:06 | **Closed.** The streaks now start at y ≈ 40, not 0. One faint streak still passes behind "F = 20 N" (cosmetic, below). |
| S2 A/B, hPa | 23:31.6–23:49.1 | **Closed.** "…hectopascals, the unit weather maps use for pressure" comes with the keyword "hPa: a unit of pressure" (from 23:37). The new "Let's call today's arrow capital A, and the past day's capital B." brings in the A and B column heads on their words (23:47, 23:49). |
| S3 watt | 22:57.3–23:00.7 | **Closed.** The new sentence "A watt is one joule of energy every second." brings in "1 W = 1 J every second" on "joule" (≈ 22:59). It sits under "W = watt". |
| S4 s11b | 09:06–09:22 | **Closed.** "always across" is a keyword now. "…at a right angle to the ball's velocity, which points the way it is moving" brings in a slate "→ velocity" legend that matches the ball's arrow (from 09:19). |
| S5 runway wording | 20:39.7–20:47.7 | **Closed.** The sentence now reads "…ten metres per second, thirty degrees east of the runway's direction", which agrees with the 30° on screen and with 10 cos 30° ≈ 8.7. |
| S6 cross-product link | 21:01–21:08 | **Closed.** The arrowhead now lands on the middle of the dashed "across" part, clear of the **v** label. |
| S7 s20d links | 23:08.5–23:14.2 | **Mostly closed.** "Antarctica" sits lower (y ≈ 640) and the two paths no longer cross over the ring. The current link's arrowhead (≈ 700, 478) still sits on the Antarctica path where it passes through the ring, so the pair reads as a fork (cosmetic, below). |
| S8 "opposites" | 24:12.0–24:13.6 | **Closed.** It now stays ≈ 1.6 s, about 1 s past the end of S7 (24:12.5). |
| S9 s05a | 04:12–04:54 | **Closed.** The question line, a = … and b = … dim to about 40 % once the expansion starts. "x̂·ŷ = 0" is slate. Only the strike-through lines stay rose, and they mean "drops out", not "negative". At 640 px the stack reads top-down. |
| S10 docs | — | **Closed.** The storyboard s20d honesty note, honesty_notes, data_needs §C W2 ("VERIFIED 2026-10-28") and manifest credits now agree. |

**The softened sentence** (24:12.9, "Weather maps can be compared this way to look for past days like today, and computers use the same idea…") is honest. It claims a possibility, not a practice. The anomaly cosine *can* rank past maps, and it is the standard anomaly-correlation score. The credit note is right on both points:
- Lorenz (1969, *J. Atmos. Sci.* 26, 636–646) chose analogues by RMS difference of height fields, not by the cosine.
- The anomaly correlation coefficient is the WMO verification score (Manual on the GDPFS, WMO-No. 485).

The note says the movie names neither. The screen shows only "past days like today", with no source text.

## Splice quality (6 new sentences)
- **Edges:** no clicks. All 12 splice edges sit in digital silence (the gaps are exactly 0 on both sides). In the final AAC, the largest sample-to-sample step within ±50 ms of each edge is 0.0016–0.0030, the same as ordinary speech.
- **Level:** the new clips' RMS is −15.5 to −17.6 dBFS in the final mix, against −15.3 to −19.1 dBFS (median −16.5) for the untouched sentences. Each one matches its neighbours within about 1.5 dB, so no step is audible.
- **Peaks:** whole-file true peak −2.7 dBTP; segments −2.7 to −2.8 dBTP.
- **Clipping:** in `fix1/narration.wav` all six new clips are hard-clipped at full scale. That is 23–188 samples per clip, with runs of at most 16 samples (0.67 ms). The local gain of ×2.59–2.80 pushed the loudest peaks just past 0 dBFS. No untouched sentence clips.
  - In the final mix this does not show. The 9 kHz high-pass energy of the new clips (p99 −0.9 to −1.3 dB of full band) is inside the range of the untouched sentences (median −1.4, 95th percentile −1.1).
  - Recorded as cosmetic, plus a tooling lesson.

## Fresh review — new and changed scenes
- **Physics and maths:** unchanged from review 1 and still right.
  - 10 cos 30° ≈ 8.7 m/s.
  - τ·u = 0.01 W/m², and the watt is defined straight after its first use.
  - 16/18 ≈ 0.89.
  - The whirled ball runs anticlockwise on screen, with v tangent and F inward, and the energy bar stays flat.
  - The south-polar winds circle clockwise seen from above the South Pole, which is eastward.
- **Reveals on their words:** checked at 1 s through s20e, s20d S7–S9, s11b and s20b S3 ("north" at 20:41, v at 20:42 and 30° at 20:45, on their words).
- **House style:** conforms.
  - No headings beyond the title, no boxes or references.
  - Keywords only. "how much along?" is a short keyword, not the narrated sentence.
  - Teal/orange/slate roles; gold only for links, underlines and the panel highlight. The s20d total is now warm white.
  - Text ≥ 44 px.
  - No new empty half over 3 s: the s20d globe hand-over leaves the right side empty for about 2.5 s (23:01.5–23:04), under the limit.

## MUST fix
- None.

## SHOULD fix
- None.

## COSMETIC (optional; none blocks `qa_pass`)
- 23:08.5–23:14.2 (s20d S9): the "circumpolar current" arrowhead (≈ 700, 478) touches the "Antarctica" path where it crosses the ring.
  - Fix: end the current link on the ring's upper right (≈ 700, 380), or bring the Antarctica path in through the lower-right gap.
- 23:35–23:44 (s20e S4): "A = (3, 1, −2, −2)" (and B at 23:43) is written about 9 s before "capital A" is said.
  - Write "today = (…)" until the naming sentence, or bring in the "A =" letter at 23:47 with the column head.
- 23:45 onward (s20e): "an arrow in 4-D" leaves its keyword row, which leaves a blank line between "departures from usual" and "can't draw it · same recipe".
- 23:35–24:21 (s20e): the "−2" (today) and "−3" (past day) values reach past their panels' right edges. Under the gold highlight (24:17–24:21) the "3" sits on the gold frame. Move both 10–15 px left. This was already there at review 1.
- 23:46 (s20e S6): |A| = √(3² + 1² + 2² + 2²) still drops the minus signs (review-1 cosmetic, not taken). (−2)² is what a novice expects.
- 08:34–08:56 (s11a): one faint wind streak passes behind "F = 20 N".
- 04:06–04:54 (s05a): the x̂/ŷ unit arrows are drawn orange, the colour of b. A neutral (warm white or slate) would avoid "these belong to b".
- 23:31.6 caption: "Today reads three, one, minus two and" breaks the list before its last item. Splitting after "minus two," would read better.
- Narration splice tool: cap the local gain at the clip's peak headroom, or soft-limit it, so new clips never hard-clip. See the splice section above; not audible here.
- data_needs §C: R2 ("pilots use the along-runway part": "cite before the final TTS") and W3 ("cite") are still open as notes. Close them, or mark them as general knowledge.

## House-style conformance
- The opening title, arc, voice, end card and score are as v6.
- The new sentences follow the house voice:
  - goal first ("How much of the wind blows along the runway?");
  - every new term defined (velocity, watt, hectopascal, A and B);
  - no references on screen.
- The "Weather maps can be compared…" line makes no unverified claim.

## Overall: PASS (ch00_dot_product_v01b review 2 — `qa_pass`; final)
- Both Musts (M1, M2) and S1–S6 and S8–S10 are closed. S7 is closed except a cosmetic touch.
- No v6 sentence, audio sample or v6 screen changed beyond what was intended. The 227 untouched sentences are bit-identical to review 1, and 0.00 % of pixels changed in every untouched v6 scene.
- The splices are clean and level-matched.
- The cosmetic items above are optional polish for a later pass. The user should watch the movie before `/approve-movie 0 ch00_dot_product_v01b`.


---

# ch00_cross_product_uses — review 1 (Part 2 of cross product v5, fresh eyes)                2026-10-28

This review covers `movies/out/ch00/ch00_cross_product_uses/1080.mp4`, "The cross product at work": 1815.53 s (30:15.5), 85.46 MB, 45 scenes. The narration ends at 30:13.0, followed by a 2.5-s hold. The movie is Part 2 of the split cross-product v5. It has six new opening scenes (s00, s01, s01a–s01d), then v5 s23 … s48 word-identical. I did not edit the movie or its sources.

**Frames.** 237 frames are in `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_cross_product_uses/review1/` (58 MB, on G:, not C:):
- one frame per sentence end in the new scenes, in s23/s23a (the splice) and in s47/s48;
- start, middle and end of every other scene;
- 1-s steps through s00, s01 and s01d (`dense/`);
- 1080p crops wherever text size or a collision was in doubt.

I compared the script with v5's s23 … s48 headers ("v4 fix 2, word-identical"). I checked the on-screen equations against Vallis p. 69 ((2.77), (2.79), (2.80)) and p. 88 ((2.195)–(2.197)). The audio was measured, not listened to.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_cross_product_uses (Part 2, review 1) | 1815.53 s (30:15.5); narration ends 1813.03 s, then a 2.5-s hold | 85.46 MB (budget 120, cap 160) | 12 PASS + halves WARN (re-run by me): duration, size, codec (H.264 High, yuv420p, AAC, faststart), black 0, frozen 154/154 narrated, content, loudness −16.0 LUFS / −3.0 dBTP, flashes 0/s, captions 451 = script, subtitles SRT = VTT, physics 58 hashes, equations 56 | PASS: Northern Hemisphere right / Southern Hemisphere left; k × u is a quarter turn to the left (anticlockwise seen from above); Coriolis is called an apparent push in the turning frame (s26); f = 0 at the equator (s29, s43); inertial loops clockwise (Northern Hemisphere) and anticlockwise (Southern Hemisphere) seen from above, ≈ 194 km; Ian anticlockwise, Idai clockwise, seen from above; geostrophic wind has the low on its left (Northern Hemisphere); friction turns the surface wind towards the low | PASS: Ω × u components = half the rotation terms of (2.77) with w = 0; −f k × u from (2.79); f = 2Ω sin φ (2.80); u = (1/fρ) k × ∇p from (2.195), components = (2.197); no KaTeX errors | PASS with notes: one new collision (s01a "14" on a's arrowhead); s25b r label still overprinted (R3-S2, open) | FIX: in s01d the picture stays on one kick while the narration says "many small kicks… into a circle" | PASS: 451 cues, ≤ 2 × 42, max 16.91 cps, text = script; two cues under 1 s (cosmetic) | PASS: 0 flashes; violet/teal/orange plus glyphs (⊙/⊗, "−", hatched) | n/a (none, as the house style requires) | **FIX** |

## qa.json (re-run by me with the requested flags)
`reports/movies/ch00_cross_product_uses/qa.json`: **PASS**, with one WARN. Gate `halves` reports these empty halves longer than 3 s:
- right 324.5–328.0 (3.5 s), 481–485 (4 s), 800.5–804.5 (4 s);
- right 1008–1014.5 (6.5 s), 1040–1044 (4 s), 1073–1081 (8 s), 1118.5–1125.5 (7 s);
- right 1314–1319 (5 s), 1375.5–1379 (3.5 s), 1402–1405.5 (3.5 s), 1477–1481 (4 s);
- left 1719.5–1725.5 (6 s).

None of them is in the new scenes (0–162 s). All are scene starts carried over from v5 (review-3 R3-S1 is still open).

## Does the new start stand alone? (user requirement)
| check | verdict | evidence |
|---|---|---|
| Opening title s00 (house §3) | PASS, with notes | Title, 150-px gradient "The cross / product / at work", "made easy", "and how **meteorology** uses it", and one sentence in the house pattern. Part B (the globe with the two turning parcels) arrives on "meteorology" (≈ 00:07). Notes: Part A is a flat disc labelled **lowercase ω**, with the readout "ω × r = (…) m/s". The body of the movie uses capital Ω throughout, and the storyboard asks for the globe with Ω and the ground arrows (see S1) |
| Hook s01 | PASS | "Where does the cross product turn up in the weather?" The globe and its turning arrows are there from the first frame. The keywords "the spinning Earth · moving air turns · storms spin · highs and lows" appear on their words. The mini low has anticlockwise arrows (Northern Hemisphere), which is correct |
| Recap: the arrow (s01a) | **FIX** | a = (5, 1, 0), b = (1, 3, 0), a × b = (0, 0, 14), right angle, "dot: a number / cross: an arrow ⊥ both". But **only the z component is worked**, and the component recipe is never stated. Part 2 then says "with the recipe" three times and works all three components with it: s23 03:04–03:12, s25b 07:30–07:45 and s28b 13:20–14:02 (the struck-column × pattern). A Part-2-only viewer cannot follow which products go where. The recipe is first stated in words in the recap s47 (28:40), so the recap summarises a rule that this movie never taught (M1) |
| Recap: the length (s01b) | PASS, with notes | along/across split, \|a\| ≈ 5.1, across ≈ 2.75, product ≈ 14 = area, parallelogram. The numbers are right: √26 = 5.099 and 14/5.099 = 2.746. Notes (S3, S4): the bars notation "\|a\|" is never said in words, and it is used again in s25 as "\|r\| sin θ". "the part along doesn't count" puts a narrated sentence on screen (house §5) |
| Recap: the direction (s01c) | PASS, with notes | The right hand is curled, the thumb is up and the a × b arrow is up. x̂ × ŷ = ẑ, the cyclic triangle, b × a = −a × b and x̂ × ẑ = −ŷ (rose "−" cycle) are all correct. Notes (S5): "unit vector" is never defined (length one). The axes are not labelled x, y, z and no x̂, ŷ, ẑ arrows are drawn, yet s23 at once says "let k be the unit vector pointing straight up" |
| Recap: the push (s01d) | **FIX** | See M2 (proton) and M3 (kicks) |
| Splice into v5 at s23 (02:41.8) | PASS (words and sound); FIX (one reference) | "Now let's see how weather uses the cross product" follows the push recap naturally. At the joint the music bed is continuous: −33 to −35 dBFS in the 0.8-s gap, with no dropout and no jump. But s23a S3 (≈ 03:56) says "like the magnet's push on the **proton**" and shows a "proton" glyph. s01d said "a moving charge" and labelled its glyph "moving charge"; a proton is never mentioned before s23a (M2). "Like our small kicks" (s23a S6) refers back correctly, provided the kicks are actually shown (M3) |
| Symbols used later | mostly PASS | These are all explained inside Part 2 (s23–s44): u, k, Ω, r, φ, θ, radians, f, ρ, ∇p, hPa, isobars, geostrophic and reanalysis. These are not: "the recipe" (M1), \|·\| (S3), "unit vector" (S5), F and "work" (S6), and the recap's τ, L, p, q, B, "torque", "angular momentum" and "normal" (S2) |
| Ending / end card | PASS (house); see S7 | s47 "To sum up" and s48 are the weather/climate ending, word for word (HOUSE_STYLE §3, cross-product exception). On screen: four thumbnails, "a series of tutorials", "meteorology · atmospheric science · climate", gold "the ideas, and the maths behind them", "cross-product notebook" and "notebooks for the other concepts". It ends with a hold that fades to silence (−47 → −93 dBFS). There is no URL, book or "thanks". **Nothing points to Part 1.** s47 names only the "later videos" (weather maps; grad, div, curl), and no thumbnail is labelled as Part 1 (S7) |

## Physics and maths honesty (new and changed scenes)
- s00: ω × r readouts all have length 0.59 m/s and stay perpendicular to r, leading in the anticlockwise sense with ω up. Correct.
- s01a: 5 × 3 − 1 × 1 = 14. s01c: the cyclic and anticyclic products are correct.
- s01d: on the circle the push points to the centre and is perpendicular to u. Speed is constant. The circle is anticlockwise with the push to the left of the motion. Correct.
- v5 body, re-checked on the frames:
  - k × u = (0, 5, 0) for u = (5, 0, 0), and (−5, 0, 0) for u = (0, 5, 0);
  - Ω × r ≈ (0, 329, 0) m/s at 45°N and 465 m/s at the equator;
  - Ω = (0, 5.16, 5.16) × 10⁻⁵ rad/s;
  - the Ω × u components match (2.77);
  - f ≈ 1.03 × 10⁻⁴ s⁻¹;
  - push ≈ 1.03 × 10⁻³ m/s²;
  - 2π/f ≈ 16.9 h;
  - loops ≈ 194 km;
  - ∇p = (0, −1.00 × 10⁻³) Pa/m and fρ ≈ 1.24 × 10⁻⁴, so u ≈ 8.1 m/s east;
  - both pushes ≈ 8.3 × 10⁻⁴ m/s².
- Rotation senses always come with hemisphere and viewpoint ("anticlockwise · from above", "f > 0 · anticlockwise", "f < 0 · clockwise").
- Ekman transport and Rossby waves are not in this movie (the friction turn appears only in s46, as "partly across the isobars, towards the low", which is correct).

## MUST fix
1. **M1 · 00:50–00:57 · s01a. Restate the component recipe; Part 2 relies on it.**
   - What is wrong:
     - Only "for the z component, five times three minus one times one" is said, with no z on screen.
     - "The other two components are zero" is given without the rule.
     - Yet s23 (03:04–03:12), s25b (07:30–07:45) and s28b (13:20–14:02) all compute "with the recipe", and s28b uses the struck-column × pattern.
   - Fix:
     - Add one sentence to s01a: "Each component leaves out its own direction and cross-multiplies the other two."
     - Show the three-row form `(a₂b₃ − a₃b₂, a₃b₁ − a₁b₃, a₁b₂ − a₂b₁)` with "x part · y part · z part" (the s47 graphic, which already exists).
     - Work the x and y rows for (5, 1, 0) × (1, 3, 0) to 0 and 0, and label the z row "z".
     - Say the word "recipe" once.
2. **M2 · 02:16.6 (s01d S2) → 03:56 (s23a S3). "Moving charge" here, "proton" later.**
   - What is wrong: s01d says "the magnetic push on a moving charge" and labels its glyph "moving charge". s23a says "the magnet's push on the proton" and labels its glyph "proton". A viewer who has not seen Part 1 has never met the proton.
   - Fix: in s01d say "…like a magnet's push on a moving proton" and label the glyph "proton". Or show the s22d proton-in-a-field thumbnail, which the storyboard specifies as a helix.
3. **M3 · 02:26.3–02:34.3 · s01d S3. The picture does not show what is said.**
   - What is wrong:
     - The narration: "Many small sideways kicks, each at a right angle to the new direction, bend the path a little at a time into a circle."
     - The picture: one kick tilts the arrow at 02:27, then the frame is frozen for ≈ 6 s (02:27.5–02:33.8). Then it cuts to a finished smooth circle at 02:34.
     - The storyboard asks for "one sideways kick, then ten small kicks, then a smooth curve".
     - The later "like our small kicks" (s23a S6, 04:24) depends on this picture.
   - Also at 02:16.6–02:26 (S2), "a push that's always at a right angle to the motion" is said, but no push arrow is drawn until the circle.
   - Fix:
     - Animate the kick polygon from the v4 s22e `KickPolygon` data: 1 kick, then N small kicks, each on its own beat with the arrow keeping its length, closing into the circle on "into a circle".
     - Draw the orange push arrow ⊥ u on "at a right angle to the motion" in S2.

## SHOULD fix
1. **S1 · 00:00–00:07 · s00. Lowercase ω versus capital Ω.**
   - What is wrong: Part A is a flat disc labelled "ω" with the readout "ω × r = (…) m/s". The whole movie uses capital Ω for Earth's spin, and the storyboard asks for the globe with Ω and the ground arrows Ω × r along a circle of latitude.
   - Fix: use Ω (or the globe version as the storyboard says). The Part B parcel arrows on the globe (00:08–00:12) are only about 15 px long; make them bigger (cosmetic).
2. **S2 · 28:33–29:47 · s47 (v5 words, kept as the user asked). The recap goes beyond Part 2.**
   - What is wrong:
     - S2 "each component leaves out its own direction…" (fixed by M1).
     - S4 "the normal to their plane".
     - S5 "torque, angular momentum and the push on a moving charge", with τ = r × F, L = r × p and F = q v × B on screen at ≈ 29:01–29:10. τ, L, p, q, B, torque, angular momentum and normal are never explained in Part 2.
   - This conflicts with "every symbol explained" (house §4) for a viewer who starts here.
   - **User decision**, because the requirement was "content unchanged". Either:
     - (a) prefix S5 with "In the last video, we saw that…" and drop the three formulas from the screen (keep the icons); or
     - (b) leave the words and accept the gap.

   I recommend (a).
3. **S3 · 01:15–01:34 (s01b) and 06:15–07:04 (s25).** Say "the length of vector a, written with two bars" once when "|a| ≈ 5.1" appears, because "|r| sin θ" depends on it later.
4. **S4 · 01:30.8–01:34 · s01b.** The narrated sentence "the part along doesn't count" sits on screen (house §5: keywords only). Use "along: 0" or grey out the along band only.
5. **S5 · 01:52–02:13 · s01c.**
   - Define "unit vector" (an arrow one unit long along an axis).
   - Label the floor axes x, y, z, and grow x̂, ŷ, ẑ as each product is spoken: the picture side shows only a, b and a × b while the unit-vector products are read.
   - s23 then reuses "unit vector" for k.
6. **S6 · 02:34.6–02:41 · s01d S4.**
   - F appears in "F · u = 0" but is never named; say "the push, F".
   - "Does no work" is new to a Part-2 viewer: "no work: it gives no energy" is enough.
   - "Same speed all the way round" (02:34–02:41) is not spoken; tie it to "never speeds anything up".
7. **S7 · 29:40–30:15 · s47 S10 / s48. Nothing points to Part 1.**
   - The user asked for "related movies incl. Part 1". The end card is the house weather card. s47 names only "later videos", and none of the four thumbnails is identified as Part 1.
   - Fix: add Part 1 to the spoken bridge without a link or title card ("The first part of this video shows why the cross product is built this way, and later videos…"), and make thumbnail 2 the Part 1 picture (parallelogram + a × b).
   - This needs a words change in s47; it is the user's call.
8. **S8 · 00:56–01:05 · s01a S4–S5.**
   - The gold bracket's "14" label sits on vector a's arrowhead and its "a" label.
   - Move the bracket and "14" to the left of the violet arrow, or above a's tip.
9. **S9 · 07:53–08:00 · s25b S8. R3-S2 is still open.**
   - What is wrong:
     - At the equator, the r arrow's tail runs through "r = (6371, 0, 0) km", and the gold axis cuts "(6".
     - The axis also runs between "v" and "=" in "v = (0, 465, 0) m/s".
     - The v arrow is drawn lying on the cut face, pointing at the axis; at 45°N (07:32) it points right, next to "⊙ y". A first-time viewer can read "v points towards the axis", although the narration says east, at a right angle to the axis and to r.
   - Fix: move the r label outside the globe. Draw v clearly leaving the face (perspective, or a ⊙ glyph at the place with "east").
10. **S10 · empty halves (qa `halves` WARN, R3-S1 carried over).**

    | time | scene |
    |---|---|
    | 17:53–18:01 (8 s) | s33 |
    | 18:38.5–18:45.5 (7 s) | s34 |
    | 16:48–16:54.5 (6.5 s) | s31 |
    | 28:39.5–28:45.5 (6 s, left) | s47 |
    | 21:54–21:59 | s39 |
    | 05:24.5–05:28, 08:01–08:05, 13:20.5–13:24.5, 17:20–17:24, 22:55.5–22:59, 23:22–23:25.5, 24:37–24:41 | others, 3.5–4 s |

    Bring each scene's first keyword in on S1.

## COSMETIC
- **C1 · 25:45–25:49 · s43.** "twice as close" and "balance breaks down / near the equator" nearly touch (≈ 10 px gap) and have different left edges. Stack them with a 24-px gap or separate them.
- **C2 · Captions.** Two cues are under 1 s: 00:00.30 "In this video," (0.95 s, new) and 20:55.85 "Near its peak," (0.98 s, C5 carried over). Merge each with the next cue.
- **C3 · 02:16–02:26 · s01d.** The "moving charge" glyph label is in muted grey (house: muted is for ticks and units only); use warm white.
- **C4 · Inherited from review 3.** C1 (touched labels), C2 (KaTeX brace text ≈ 40 px, house-wide), C3 (s42 overflow while the strip shrinks), C6 (H/L cut by the s39–s40a map top) still apply at their Part-2 times. s41a 24:36: the teal arrowhead overlaps the strip's right border.
- **C5 · 00:12.8–00:15.9 · s01 S1.** "a × b" alone at the top right is the only thing in the maths zone for 3 s, and the hook has not said "a × b". Use "cross product in the weather?" or nothing.

## House-style conformance
- **Conforms:**
  - opening title and sentence pattern;
  - the hook;
  - spoken bridges;
  - no headings (the title only), boxes, references, equation labels, badges or URLs;
  - colours: Coriolis violet, pressure push orange, wind teal, negative rose with a "−" or ⊗;
  - type ≥ 44 px on the checked crops (KaTeX brace notes excepted, house-wide);
  - goal before calculation;
  - reveals on their words in s00–s01c;
  - a per-movie score, continuous through the splice;
  - −16 LUFS;
  - the weather/climate end card.
- **Departures:**
  - M3 (picture ≠ words in s01d);
  - S4 (a narrated sentence on screen);
  - S1 (ω versus Ω);
  - S2 / M1 (terms not explained for a Part-2 viewer);
  - S10 (empty halves).

## Overall: FIX (ch00_cross_product_uses review 1 — M1–M3; S1–S10 recommended)
- The v5 body (s23–s48) is word-identical and still correct. The splice sounds seamless, and every physics sign and number checks out.
- The new opening does not yet stand alone, for two reasons:
  - Part 2 computes "with the recipe" without ever restating it (M1).
  - The push recap names a different particle from the one s23a refers to (M2), and shows one kick where it says many (M3).
- All three fixes are local to s01a and s01d. M1 and M2 add or change two sentences, so they need a TTS re-run for those scenes and re-timed captions; M3 is TSX only.
- S2 and S7 change v5 words, so they need the user's decision.
- After the fix: run review 2 on s00–s01d, s23a and the end card, with ≥ 1 frame per sentence.

Disk at review: C: 69 GB free, G: 536 GB free. Review frames: 58 MB (237 PNG) under `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_cross_product_uses/review1/` (not committed). The QA re-run wrote `reports/movies/ch00_cross_product_uses/qa.json` and its contact frames.


---

# ch00_cross_product_why v5 — review 1 (full movie, fresh eyes)                2026-10-28

This review covers `movies/out/ch00/ch00_cross_product_why/v5_1080.mp4`: 3521.80 s (58:41.8), 150.31 MB, 78 scenes. The narration ends at 58:39.3, followed by a 2.5-s hold. v5 = v4 fix 2 with every word kept, plus the reference-video intuitions (s03, s07, s14, s15, s15a, s17, s18, s18a, s18d, s21, s21a–s21d, s22w, s19). The Part 2 scenes (s23–s48) were reviewed in "ch00_cross_product_uses — review 1" above; I do not repeat those findings here. I did not edit the movie or its sources.

**Frames.** 376 PNG (103 MB) are in `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_cross_product_v5/review1/` (on G:, not C:):
- `v5/`: one frame per sentence end in the 16 new or extended scenes, and the midpoint of every other scene (201 frames, 51 sheets);
- `edge/`: frames at every edge-scan hit, all 24 frames of the s11 entrance, the s17 card every 1.5 s, and 1080p crops wherever text size or a collision was in doubt;
- `p1/`: the Part 1 frames (see the next section).

**Checks.** I re-ran every number in the new scenes with `fluidpy.geo.vectors.cross`:
- (5,1,0)×(1,3,0) = (0,0,14);
- s21a (0.2,0.1,0)×(10,30,0) = (0,0,5);
- s21b (0,0.2,0.1)×(0,10,30) = (5,0,0);
- s21c (0.1,0,0.2)×(30,0,10) = (0,5,0);
- s21d (0.1,0,0.1)×(0,2,0) = (−0.2,0,0.2);
- s18 (3,0,0)×(0,2,0) = (0,0,6);
- s18c (5,1,0)×(6,4,0) = (0,0,14);
- s22d x̂×ẑ = −ŷ;
- by hand: s18d 64 + 196 = 260 = 26 × 10, and s22e √101 = 10.05, √100.1 = 10.005, √100.01 = 10.0005, atan 0.1 = 5.7°.

**Captions.** I checked `v5_en.vtt` myself: 853 cues, text = script, ≤ 2 × 42 characters, max 16.7 cps.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_cross_product_why v5 (review 1) | 3521.80 s (58:41.8); narration ends 3519.30 s, then a 2.5-s hold | 150.31 MB (**size WARN**: budget 120, hard 160) | 11 PASS + 2 WARN (size; halves: 13 stretches of 3.5–7.5 s). Gates: duration, codec (H.264 High, yuv420p, AAC, faststart), black 0, frozen 321/321 narrated, content, loudness −16.0 LUFS / −3.3 dBTP, flashes 0/s, captions 853 = script, subtitles, physics 131 hashes, equations 123 | PASS. Every new number matches fluidpy. Right-handed axes in every new view: s14 (two camera poses), s21b (x̂ out of the screen, y right, z up), s21c (ŷ out, z right, x up). Torque senses are correct: thumb down tightens; 6 N m anticlockwise and 1 N m clockwise seen from the axis tip; s17 mirror view from below. Notes: s18 S10 "largest when along one line" contradicts p·q = −6 on screen (M3) | **FIX**. The equation "− 0.1 × 10 = 1" is false on screen in s21a and s21b (M1). ε_ijk table: all 27 entries correct. Determinant expansion and its middle-term sign swap are correct. Lagrange identity is correct. No KaTeX errors | PASS with notes: s18a overprint (S1); s17 glyph/text overlap (S6); s21a/b labels (S7); KaTeX subscripts small at 640 px (S3) | **FIX**: s22w is a 62-s text slide (M2); s21c's "one pattern" has no picture for 40 s (S3) | PASS: 853 cues, ≤ 2 × 42, ≤ 16.7 cps, text = script; three cues under 1 s (C1) | PASS: 0 flashes; teal/orange/violet/rose, with "−", hatching and dashes for the signs; no red/green-only coding | n/a (none, as the house style requires) | **FIX** |

## Does v5 deliver the user's intuitions? (the key requirement)

| V-X intuition | Scene (time) | Verdict | Evidence |
|---|---|---|---|
| Lever arm: near versus far from the hinge | s03 00:56–01:50 | PASS, with notes | "far from the hinge · easy" / "near the hinge · hard" appear on their words, with a "push needed" bar. Then r (hinge to hand) and F (push), the right-angle door swing, and "r · F = 0 / turns the most" against "r · F largest / no turn / backwards". Note: the bar's "× 4.5" is never spoken (S5) |
| Plane case first | s07 03:43–04:37 | PASS | Each struck-column cross pattern is worked to (0, 0, 14). The 14 bracket links the picture to the number. "turning in the floor → only z" appears on S6 |
| Cycle of the axes = cycle of the recipe | s14 09:36–10:32 | PASS | Three hand poses: x̂×ŷ = ẑ, ŷ×ẑ = x̂, ẑ×x̂ = ŷ, then "x ← (y, z) · y ← (z, x) · z ← (x, y)" with the cycle glyph |
| Backwards round the cycle = minus | s15 10:32–11:22 | PASS | The hand turns over for ŷ×x̂ = −ẑ. b × a = (0, 0, −14) is drawn dashed with a rose "−14", then "a × b = −b × a" and the rose "−" cycle |
| Index form | s15a 11:22–12:38 | PASS, with a note | The three 3×3 sign tables (row j, column k) are correct. The z row is worked: (+1)(5)(3) + (−1)(1)(1) = 14. "swap two letters → minus" is shown. Note: "the alternating tensor" in S1 is a new word that is never defined (S8) |
| Arrow = axis, sense of turning, viewpoint | s17 13:29–14:18; s21 19:25–20:01 | PASS, with notes | Seen from above it is anticlockwise ⊙; seen from below, clockwise ⊗. The card with two faces flips. In s21, thumb down = tightens; S5 is a top view down the τ arrow: "seen from the tip: anticlockwise". Notes in S6 |
| Opposite of the dot product | s18 14:18–15:32 | **FIX** (M3) | The three cases are side by side. S10 says the dot product is "largest when the arrows lie along one line" while the screen shows p·q = −6 for the opposite case |
| "Why the minus sign?" | s18a 15:32–15:54 | PASS, with a note | The question is added, but its line is overprinted by a gold link (S1) |
| Along (dot) and across (cross) share b | s18d 16:46–17:41 | PASS, with a note | The right triangle with along = \|b\| cos θ and across = \|b\| sin θ. Bars 8 : 14 drawn to scale (240 : 420 px). 64 + 196 = 260 = 26 × 10 on its words. Note: the screen shows "both sides × \|a\|²" but the narration says only "by the length of vector a" (S2) |
| z component: two opposing mini-torques | s21a 20:01–21:17 | **FIX** (M1) | This is the strongest new scene. The floor grid has "ẑ towards you". The push splits into 30 N along y and 10 N along x, and gold brackets mark "0.2 m along x" and "0.1 m along y". It shows +0.2 × 30 = 6 with a violet anticlockwise arc, a rose dashed clockwise arc, τ_z = 6 − 1 = 5 N m, and underbraces "anticlockwise" and "clockwise" under r_x F_y − r_y F_x. But the second line reads "− 0.1 × 10 = 1", which is false |
| x component: same picture, axes relabelled | s21b 21:17–22:21 | **FIX** (M1) | The identical geometry in the y-z wall with "x̂ towards you" makes the pattern visible at a glance. A 3-D inset marks the wall. But "−r_z F_y = 0.1 × 10 = 1" is false too |
| y component: z before x, why the determinant's middle term looks backwards, the one pattern | s21c 22:21–23:47 | PASS (correct); **SHOULD** (clicking) | z right, x up, ŷ out: right-handed. (r × F)_y = r_z F_x − r_x F_z = 0.2 × 30 − 0.1 × 10 = 5. In the determinant the middle term is highlighted gold, then −ŷ(r_x F_z − r_z F_x) = ŷ(r_z F_x − r_x F_z) with an arrow to the recipe. Correct and well staged. But S5–S9 (40 s) is symbols only, and the closing "one pattern" sentence has no picture of the three turns (S3) |
| Tilted axis on a 3-D ball | s21d 23:47–24:39 | PASS, with notes | The ball shows r and F; then (x, y) → about z, (y, z) → about x and (z, x) → about y. Arrows "about z: +0.2" and "about x: −0.2" add to a violet τ on a tilted axis, with a tilted equator ring. Notes: "45° between up and −x" is never spoken (S5); the negative part is not drawn in rose (C4) |
| When to use it; what the two arrows stand for | s22w 29:15–30:18 | **FIX** (M2) | The words are right and useful. The screen is a text table with underlined column headings and no pictures |
| Along, a number / across, an axis (grid) | s19 30:18–31:08 | PASS | The new row "along · a number / across · an axis" appears on S7. The grid is otherwise v4 |

**Verdict on the requirement.** Every v4 sentence is present: the script diff against the v4 text is clean, and the v5 scene list keeps all v4 scenes. Taken together, s21a → s21b → s21c answer "why does each component look the way it does". The same lever picture is re-labelled for each wall, which is exactly the reference video's intuition. What stops it from clicking cleanly:
- a false line on screen at the decisive moment (M1);
- the closing pattern given only in symbols (S3);
- the "when to use it" scene shown as a slide (M2).

## MUST fix
1. **M1 · 20:45.8–21:17.4 (s21a S8–S11) and 21:55.5–22:20.7 (s21b S6–S8). A false equation on screen.**
   - What is wrong: s21a shows "− 0.1 × 10 = 1" and s21b shows "− r_z F_y = 0.1 × 10 = 1". The "−" is meant as a tag for the clockwise turn, but as written each equation is false. A first-time learner reads "minus one-tenth times ten equals one", and this is the very line meant to explain the minus sign.
   - Fix: write "0.1 × 10 = 1 · clockwise" (rose, with the clockwise arc) and then "τ_z = 6 − 1 = 5", or write "−(0.1 × 10) = −1". In s21b write "r_z F_y = 0.1 × 10 = 1 · clockwise". This is TSX only; the words are unchanged.
2. **M2 · 29:15.0–30:17.8 (s22w, 62 s). A PowerPoint slide, against house §5 and the user's U-M3.G1.**
   - What is wrong:
     - Underlined column headings: "first arrow", "second arrow", "the answer".
     - Keyword lists and a 50-px globe, and no picture of a lever arm, a push, a spin or a wind.
     - The lower half of the screen is empty from 29:15 to 29:44.
     - "position r (after a spin)" is ambiguous: the narration means "when the first arrow is a spin arrow".
   - Fix:
     - Put four mini-pictures from earlier scenes in the picture zone: the door (r from the hinge, push F), the spanner (r, F), the ball on a string (r, p) and the globe (Ω, place r, wind u). In each, the first arrow is teal and the second orange, lit on its words in S3 and S4.
     - For S5, reuse the s18b along/across picture with the ⊥ arrow.
     - Drop the underlined headings; use colour to show which arrow is first and which second.
     - Write "position r, when the first is a spin". This is TSX only.
3. **M3 · 15:14.6–15:22.4 (s18 S10, a new v5 sentence). "largest when the arrows lie along one line" is wrong for the opposite case.**
   - What is wrong: at that moment the screen shows p·q = 6, 0, −6. The dot product video taught that the opposite case is negative, not largest. The numbers 6, 0 and −6 are also never spoken (house §4).
   - Fix: say "…which is zero at a right angle, and largest when the arrows point the same way" (the wording s19 S6 already uses). Speak or drop the three p·q values. This needs a TTS re-run of one sentence and re-timed captions.

## SHOULD fix
1. **S1 · 15:48.1–15:53.7 · s18a S5–S6.**
   - The new line "the minus sign in the recipe ?" is placed under the gold link from "area … but an arrow, up or down ?", and the link runs through "the".
   - At S6 the four questions jump to a new layout at the bottom left. Its last line nearly touches "a = (5, 1, 0)".
   - Fix: give S5 its own row above the links, and keep the layout fixed through S6.
2. **S2 · 17:02.7–17:06.6 · s18d S4.** The narration says "multiply both sides by the length of vector a", but the screen shows "× |a|²". Say "…by the length of vector a, squared" (words change), or show "× |a|" and square on screen in a second step.
3. **S3 · 22:55.4–23:46.6 · s21c S5–S9. Symbols only for 40 s.**
   - What is wrong:
     - The picture zone has only the long expansion line.
     - The scene's summary sentence ("each is the turning about its own axis, made by the two parts across that axis…") is shown as "x ← (y, z) +r_yF_z −r_zF_y …" with no turning pictured.
     - At 640 px the expansion line's subscripts (≈ 30 px at 1080p) are hard to read, and the subscripts are the point of the line.
   - Fix:
     - In S9, bring back the three mini walls with + and − arcs. The graphic already exists as Part 1 s50 S4 (31:41: the x-y floor, the y-z and z-x walls, "+ one turn − the other").
     - Set the expansion at the 68-px calculation size on two lines.
4. **S4 · 08:15.1–08:15.8 · s11 entrance (edge-scan hit at 495.5 s).**
   - What is wrong:
     - During the cross-fade, the hand enters too large and too low, in a blue-grey translucent material.
     - It runs off the bottom edge and through the caption band (the 27 195-px hit).
     - It then snaps to cream at ≈ 08:15.6 and slides up into place.
   - The same frames are in Part 1. Fix: fade the hand in at its final pose and material.
5. **S5 · Numbers on screen that are never spoken (house §4).**

   | time | scene | number | fix |
   |---|---|---|---|
   | 01:07–01:23 | s03 | "× 4.5" on the push-needed bar | say "about four and a half times the push", or drop the number |
   | 24:30.6–24:38.6 | s21d S8 | "45° between up and −x" | say "halfway between up and minus x", or drop it |
6. **S6 · s17 13:51–14:18.**
   - In S6–S7 the legend "orange face: clockwise" refers to a face that is on screen for only ≈ 1 s, before the card flips to teal. Fix: tilt the card in 3-D on "two coloured faces" so that both faces are seen.
   - In S9–S10 (14:06–14:18) the gold-ringed ⊙/⊗ glyphs overlap the first letters of "anticlockwise" and "clockwise". Fix: move the glyphs 24 px to the left.
7. **S7 · s21a and s21b, label collisions and edges.**
   - "30 N along y" / "30 N along z" is crossed by the faded F arrow (20:22–21:17 and 21:44–22:20).
   - The axis labels "y" (s21a) and "z" (s21b, s21c) sit at y ≈ 20–50, above the content area (the edge hit at 21:19–21:21).
   - The 3-D inset's axis letters are below 44 px.
   - S1 of s21a (20:01–20:04) and S1 of s21b (21:17–21:21) show only an empty grid. Fix: draw r on S1.
8. **S8 · 11:22–11:31 · s15a S1.** "the video on the alternating tensor" uses a word that is never explained. Say "the index-notation video", or define the word.
9. **S9 · 56:59–58:14 · s47 recap (user decision; v4 words were kept).** The v5 recap does not sum up the two new ideas: the minus sign comes from two opposing turns, and the arrow is the axis, anticlockwise seen from its tip. Part 1's s50 S3–S4 already say both. I recommend adding those two sentences to s47.
10. **S10 · Empty halves (qa `halves` WARN).**
    - In the Part-1 scenes:
      - 01:26.5–01:32.0 (s03 S7–S8, right half);
      - 09:36.5–09:40.5 (s14 S1);
      - 11:22.5–11:26.0 (s15a S1);
      - 13:29.0–13:33.5 (s17 S1).
    - The rest are in the Part 2 scenes and are listed in the Part 2 review (S10).
    - Fix: bring the first keyword in on S1.
11. **S11 · Size 150.31 MB.** This is above the 120-MB budget, though below the hard cap of 160. Accept it, or encode at crf 22.

## COSMETIC
- **C1 · Captions.** Three cues are under 1 s:
  - 00:39.60 "In weather," (0.84 s);
  - 04:57.35 "By Pythagoras," (0.98 s);
  - 49:22.13 "Near its peak," (0.98 s).

  Merge each with the next cue.
- **C2 · Small or crowded text.**
  - s06, 02:56–03:43: the KaTeX "along x / along y / along z" labels are ≈ 30 px (carried from v4).
  - s18d, 17:06–17:41: the two bar labels are only ≈ 4 px apart.
- **C3 · Edge-scan hits in the Part 2 scenes not covered by the Part 2 review.**
  - s28a, 41:41–41:44: the faded Ω label overprints "north", and the Ω arrow touches the top edge.
  - s44, 55:11: the arrow crosses its own "u = (8.1, 0) m/s" label, and the label touches the map's right edge.
- **C4 · 24:28–24:39 · s21d.** "about x: −0.2" is drawn in violet with a dash rather than in rose with "−" (house negative), and the label sits on the sphere outline.
- **C5 · 04:30.8–04:36.3 · s07 S7.** The "vector product" gold link crosses the 14 bracket and the arrows.
- **C6 · Muted grey used for keywords** (house: muted is for ticks only): "we only need what it gives" (s21c) and the grey "next Ω × r, −2Ω × u" (s22w).
- **C7 · Deliverables.** The v5 files sit beside v4's (`v5_1080.mp4` / `v5_en.vtt` next to `1080.mp4` / `en.vtt`). The qa `subtitles` gate reports "en.srt", so confirm that it compared the v5 pair. My own check of `v5_en.vtt` passes.

## House-style conformance
- **Conforms:**
  - opening title and sentence;
  - hook;
  - spoken bridges;
  - no badges, equation numbers or URLs;
  - colour roles (a/r teal, b/F orange, cross product violet, negative rose with "−" or a dash);
  - gold picture-to-number links (s07, s09a, s21a brackets);
  - goal before calculation in s21a–s21c ("Torque also explains the minus sign…");
  - beats after the worked results;
  - −16 LUFS;
  - the weather/climate end card (the §3 exception for this movie).
- **Departures:**
  - M2 (slide and headings);
  - M3 and S5 (numbers on screen that are never spoken);
  - S3 (no picture for 40 s);
  - S1, S6 and S7 (collisions);
  - S10 (empty halves).

## Overall: FIX (ch00_cross_product_why v5 review 1 — M1–M3; S1–S11 recommended)
- The new intuition scenes are correct and, apart from the items above, they make the formula's parts click. The best of them are s21a/b/c, s18d, s17 and s21d.
- M1 and M2 are TSX only. M3 changes one v5 sentence, so it needs a TTS re-run of that sentence, re-timed captions and a re-render of the shifted tail.
- After the fix, run review 2 with ≥ 1 frame per sentence on s18, s18a, s18d, s21a–s21c and s22w, and spot frames elsewhere.


---

# ch00_cross_product (Part 1, "The cross product") — review 1 (fresh eyes)                2026-10-28

This review covers `movies/out/ch00/ch00_cross_product/1080.mp4`: 1960.20 s (32:40.2), 92.58 MB, 41 scenes. The narration ends at 32:37.7, followed by a 2.5-s hold. Part 1 = v5 s02 … s19 word-identical, a new s00 and s01, and the new s50_recap and s51_end. I did not edit the movie.

**Frames.** 59 frames plus three dense tiles are in `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_cross_product_v5/review1/p1/`:
- one frame per sentence in s00, s01, s19, s50 and s51;
- the midpoint of every other scene;
- 1-s steps through 00:00–00:20 and through the splice (31:02–31:22);
- 1.5-s steps through 32:05–32:40.

**Checks.**
- The body is v5's. The script text of s02–s19 is identical to v5's; the scene times differ by 0.02–0.03 s.
- Frames at 8 body times (01:40 … 30:00) differ from v5 by at most 0.24/255 mean absolute difference, with 0 % of pixels over 30. So every v5 finding in s02–s19 applies here at the same mm:ss (M1, M2, M3, S1–S8, S10, C1 except "Near its peak", C2, C4–C6).
- I checked `en.vtt` myself: 464 cues, text = script, ≤ 2 × 42, max 16.4 cps, two cues under 1 s.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_cross_product (Part 1, review 1) | 1960.20 s (32:40.2); narration ends 1957.70 s, then a 2.5-s hold | 92.58 MB (budget 120) | 12 PASS + halves WARN (01:26.5–01:32.0, 09:36.5–09:40.5, 13:29–13:33). Gates: duration, size, codec, black 0, frozen 193/193 narrated, content, loudness −16.0 LUFS / −2.3 dBTP, flashes 0/s, captions 464 = script, subtitles, physics 77 hashes, equations 69 | PASS, as v5 (same notes) | **FIX**: inherits M1 (s21a/s21b false line) | PASS with notes (inherits S1, S4, S6, S7) | **FIX**: inherits M2 (s22w slide) | PASS: 464 cues; two under 1 s | PASS | n/a | **FIX** |

## The new start, the new end and the splice (user requirement)
| check | verdict | evidence |
|---|---|---|
| s00 title (house §3) | PASS | "The cross / product" at 150 px with the gradient, "made easy", "and how **physics** uses it". Part A is p × q sweeping, with a live signed value: teal +2.78, rose −4.08. On "physics" (≈ 00:05) it cross-fades to the door with F, then to the ball with its τ on a tilted axis (≈ 00:09), matching "from opening a door to spinning a ball". There is one sentence, in the house pattern |
| s01 hook | PASS, with a note | "What is the cross product? … what it tells us about turning." The a, b picture is on the first frame, and the a × b arrow grows at ≈ 00:15. Note (P1-C1): "a × b" is written at the top right from 00:11, before it is spoken (same as Part 2 C5) |
| Body s02–s19 | = v5 | See above. A Part-1-only viewer meets words that only Part 2 teaches (P1-S2) |
| Splice s19 → s50 (31:08.1) | PASS | Visually it is the house 10-frame cross-fade from the full grid to "a × b ⊥ a, b". The music bed is continuous at −35 to −38 dBFS through the 0.8-s gap, with no dropout or jump. The voice resumes at 31:08.4 |
| s50 recap (8 sentences) | PASS | One mini-picture per sentence, each on its words: ⊥ arrow; parallelogram with "across · area" and τ = r × F; curled hand with "from its tip: anticlockwise"; three mini walls with "+ one turn − the other" and "minus: opposite turns"; zero / largest / zero with "swap → flips"; along/across; τ, L, qv × B icons with the circle; a globe with turning arrows and "next: the spinning Earth · why the wind turns · why storms spin". Every claim was taught in Part 1. S4 and S3 sum up the new v5 ideas well |
| Spoken pointer to Part 2 | PASS | "The next video puts the cross product to work on our spinning Earth, to explain why the wind turns and why storms spin." There is no title card, URL or link |
| s51 end card | PASS (maths ending, word for word); see P1-S1 | The three sentences match HOUSE_STYLE §3 (maths), with "this cross product". On screen: four thumbnails, "a series of maths tutorials", "atmospheric science · meteorology · fluid dynamics", "cross-product notebook" and "notebooks for the other maths concepts". The audio fades from −47 to −97 dBFS over the 2.5-s hold. There is no URL, book or "thanks" |

## MUST fix
- The same as v5 M1, M2 and M3, at the same timestamps: 15:14.6 (s18 S10), 20:45.8–21:17.4 and 21:55.5–22:20.7 (s21a/b), and 29:15–30:18 (s22w). Fixing them in v5 and re-cutting Part 1 fixes both movies.

## SHOULD fix (Part-1-specific)
1. **P1-S1 · 32:14–32:40 · s51. Which ending? (user decision)**
   - HOUSE_STYLE §3 records the user's 2026-10-27 exception: the cross-product movie uses the weather/climate ending, because its second half is weather.
   - Part 1 now has no weather, and the brief chooses the maths ending; that choice fits the content.
   - Ask the user to confirm, and log the decision in HOUSE_STYLE §12 so that later reviews do not flag it.
2. **P1-S2 · Part-1 words that only Part 2 explains (user decision; these are v5 words).**
   - s22w S3/S6 (29:22–30:12): "Earth's spin, Omega", "Omega cross r", "the Coriolis push, minus two Omega cross u".
   - s19 S9 (31:02): "In weather, the dot product gives advection, and the cross product turns the wind".
   - For a Part-1-only viewer these are previews of things never explained (house §4).
   - Recommendation: in Part 1 only, prefix s22w S6's last clause with "and, in the next video, …". Keep s19 S9, since advection was taught in the dot-product video.
3. **P1-S3.** Inherits v5 S1, S2 (words), S3–S8 and S10 at the same times.

## COSMETIC
- **P1-C1.** In s01 (00:11–00:15), "a × b" appears before it is spoken.
- **P1-C2.** In s50 S4 (31:31–31:42), the mini walls' axis letters are below 44 px.
- **P1-C3.** Two cues are under 1 s: 00:39.58 "In weather," and 04:57.33 "By Pythagoras,".

## Overall: FIX (ch00_cross_product Part 1 review 1 — inherits v5 M1–M3; P1-S1 and P1-S2 are user decisions)
- The new s00/s01 stand alone, the s50 recap with its spoken pointer to Part 2 is clear, and the maths end card is to the house letter.
- The splice into s50 is seamless in picture and sound.
- Part 1 needs no fixes of its own beyond the user's two decisions. Once v5 M1–M3 are fixed and Part 1 is re-cut from the fixed v5, run review 2 on s18, s21a, s21b, s22w and s50/s51.

Disk at review: C: 69 GB free, G: 536 GB free (unchanged). Review frames: 103 MB, 376 PNG, under `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_cross_product_v5/review1/` (not committed).
