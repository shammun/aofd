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

---

# ch00_vectors_index_notation — review 1 (fresh eyes)                                   2026-10-29

**Movie.** `movies/out/ch00/ch00_vectors_index_notation/1080.mp4`: 2078.57 s (34:38.6), 72.89 MB, 45 scenes, 335 sentences.
Narration ends at 2076.05 s, then a 2.5-s hold.

**Frames.** 382 PNG and 43 labelled 3×3 sheets at 640 px (184 MB) are in
`G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_vectors_index_notation/review1/`. They cover:
- one frame 0.4 s before the end of every sentence, the start of every scene, and the end hold;
- full-size 1080p frames and crops wherever size, a collision or clipping was in doubt;
- my own empty-half scan at 2 fps (`halves_scan.txt`). It leaves out the source-line band (y ≥ 835).

**QA re-run** (`tools/movie_qa.py` with `--storyboard --captions --script --manifest --composition --timing --sound-cues`,
`--hard-mb 160 --budget-mb 120 --duration-window 120,2500`). Result: 12 PASS + 1 WARN, the same as the builder's run.
- duration 2078.57 s vs 2076.05 s; size 72.89 MB; codec H.264 High / yuv420p / AAC / faststart;
- black 0; frozen 192 stretches, all narrated; content PASS;
- loudness −16.0 LUFS / −1.9 dBTP; flashes 0/s;
- captions 520 cues = script; subtitles SRT = VTT; physics 70 hashes reproduce; equations 35 present;
- **halves WARN**: 12 stretches of 3.5–9.5 s.

**The halves gate is blind here.** The data-source lines run to x ≈ 1100–1850, so they count as content in the right
half. My scan, without the source-line band, finds stretches that the gate never reports:
- right half: 1:32.5–1:40 (7.5 s), 4:56.5–5:05.5 (9 s), **6:12–6:28 (16 s)**, 11:08.5–11:15.5 (7 s) and 33:52.5–33:57.5 (5 s);
- left half: **33:19.5–33:38.5 (19 s)**.

The two bold stretches would FAIL the gate (> 10 s). Recommendation for the tool: mask y ≥ 835 in the halves and content gates.

**Numbers.** I re-derived every spoken number by hand. Each one matches the manifest CHECK rows (92 rows; VI06, VI14, VI16,
VI41, VI45, VI49 and VI50 read directly):
- s08: 9.3 sin 330° = −4.65 and 9.3 cos 330° = 8.054;
- s10: √(4.65² + 8.05²) = 9.296;
- s11 and s18: √(5.8² + 33.5²) = 34.0 and √(11.5² + 32²) = 34.0; u_i u_i = 1155.9;
- s15: 5.8 × 0.985 + 33.5 × 0.174 = 11.54;
- s12a and s12b: 250 ± 50; √65000 = 254.95; GFS 28 Oct 2026, 18 UTC jet maximum 66.1 m/s → "about sixty-five";
- s12c: forces sum to (0, 0). C = (6, −8) is 90° to the right of u ∥ (8, 6), which is correct for the NH. F ∥ −u;
- s12d: u_ag = (10, 18) − (30.9, 24.9) = (−20.9, −6.9). The low is on the left of the geostrophic flow, which is correct for the NH;
- s12f and s14: (−1.8, 10.2);
- s12g: shear (2.5, −5.4), 5.95 m/s. The wind turns from 235° to 255° going up (veering), which means warm advection in the NH;
- s12h: −3.7 − (−5.0) = +1.3 (climatology −5.04, 2023 −3.72);
- s12i: c = (19.9, 5.3), about 444 km in 6 h; u − c = (−14.2, 28.5), towards the NNW;
- s22: −9 × 10⁻⁴ K/s = −3.24 K/h;
- s26: −1.86 × 10⁻⁴ + −8.375 × 10⁻⁴ = −1.02 × 10⁻³ K/s = −3.68 K/h;
- s27: (8.23 − 2.38)/2 = 2.9 K/h;
- s31: 33.5 m/s × 3600 s = 121 km.

Equations: δ_ij (2.16) matches its page image. δ_ij u_j = u_i, ∂x_i/∂x_j = δ_ij, p·q = Σp_i q_i, |u|² = u_i u_i and
(p×q)_i = ε_ijk p_j q_k are correct. There are no KaTeX errors.

**Pronunciation (I can't listen; please check by ear).** The lexicon entry `Kronecker → /kɹˈOnɛkəɹ/` ("KROH-neck-er") is
applied in all four sentences: **30:24.2** (s29 S6), **30:40.9** (s30 S1), **32:39.1** (s32 S4) and **33:44.0** (s33 S8).
Please also check:
- "e one" at 2:57 (s06 S4): the letter name, not a schwa;
- "u sub i" at 17:52 (s13 S6): "sub", not "S U B";
- "Saint-Malo", if it is spoken anywhere.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_vectors_index_notation (review 1) | 2078.57 s (34:38.6); narration ends 2076.05 s, then a 2.5-s hold | 72.89 MB (budget 120, hard 160) | 12 PASS + halves WARN (12 stretches of 3.5–9.5 s). The gate is blind to 6 more, two of them > 10 s (see above) | PASS on the numbers. NH deflection to the right (s12c, s34); low on the left of the geostrophic wind; veering → warm advection; advection sign; trades weaken in El Niño. Notes: Coriolis is never called "apparent" (S9); the s09 w arrow is drawn longer than the 34 m/s arrow (S6); s12 x is drawn almost vertical (M8) | PASS. 35 present; (2.16) checked against its page; no KaTeX errors | **FIX**. The source line overlaps the pictures and text (M1); s11 labels pile up (M3); s12b sliver diagram (M4); s12d isobars invisible (M6); s23 equation over text (M9); globe clipped (M12); s12h strips (M13) | **FIX**. Numbers not on screen when spoken (M5); empty halves of 16 s and 19 s (M2) | PASS: 520 cues = script; SRT = VTT | PASS: 0 flashes; perceptual temperature map, sequential jet map; rose with a "−" glyph for negatives | n/a (none, as the house style requires) | **FIX** |

## ch00_vectors_index_notation — MUST fix

1. **M1 · Data-source line on the pictures and under text (global, user rule §5 "never over" the picture; legibility).**
   - **What is wrong.** `SrcLine` is drawn at y ≈ 845–868, but the picture zone runs down to y ≈ 858. So the line sits on
     cloud, map and relief imagery, and at 640 px it can't be read: muted text on white cloud.
     - Scenes with the line over the picture: s01 0:14–0:23, s02–s03 0:57–1:32, s04, s05 2:16–2:44, s11, s12d 11:08–12:22,
       s12f 13:08–14:03, s12i 16:28–17:20, s20 22:51–23:49, s25 26:51–27:21 and s26 27:21–28:17.
     - Text drawn on top of the line:
       - s07 "u = (6, 8, 0) m/s", 3:30–3:54;
       - s08 "u = (−4.65, 8.05, 0) m/s", 4:39–4:56;
       - s12g hodograph tick labels "5 10 15", 14:21–15:16;
       - s12h bottom of the "2023 − normal" map, 16:04–16:28;
       - s12i "about 450 km in 6 h", 16:46–17:20;
       - s15 "dot product →", 20:22;
       - s34 "next movie", 34:07–34:12.
   - **Fix.** Reserve a 40-px strip:
     - end every picture, label and tick at y ≤ 820;
     - draw the source line at y ≈ 832–862, above the caption band (880).
     - Move the bottom labels in the scenes listed above up by 40–60 px.
     - Then mask y ≥ 835 in the QA halves and content gates.
2. **M2 · Empty halves the gate can't see, two of them over the 10-s FAIL limit (house §5, U-M4.2).**
   - **s11, 6:12–6:28: the right half is empty for 16 s.** Fix: show "east, north: (5.8, 33.5)" on S2, when the axes
     turn, and the keyword "same arrow, other axes" on S1.
   - **s33 recap, 33:19.5–33:38.5: the picture half is empty for 19 s** (S5 u_i, S6 summation). Fix: put a mini picture
     for each sentence, as house §2 asks for the recap:
     - the three-equation fan for "free index";
     - the 3 × 3 grid collapsing to 3 for "summed";
     - the Brest advection map for u_j ∂T/∂x_j.
   - **s12h, 15:17–15:56: the lower two-thirds of the screen is empty** for 39 s (see M13).
   - Shorter gate-blind stretches: s04 1:32.5–1:40, s09 4:56.5–5:05.5, s12d 11:08.5–11:15.5 and s34 33:52.5–33:57.5. These are Should, with S1.
3. **M3 · s11, 6:22–7:10: labels pile up and text runs into the map.**
   - "north", "across" and "32.0" overprint each other at the arrow tips (x ≈ 250–450, y ≈ 120–220).
   - "11.5" sits on the east axis.
   - "along, across: (11.5, 32.0)" starts at x = 955, inside the map, which ends at 1000.
   - The gold "the arrow itself" link crosses the √ line at 6:57.
   - Fix:
     - run `placeLabels` on the four tips;
     - put the component values at the ends of the shaded projection bands, not at the tips;
     - start the right column at x ≥ 1060 and route the link around the equation.
4. **M4 · s12b, 8:55–9:58: the parallelogram can't be seen.**
   - **The diagram is tiny.** The 250 m/s arrow is about 340 px and the 50 m/s arrow about 60 px, crammed into the top-left
     corner. The parallelogram is a 60-px sliver, so "the two routes make the sides of a parallelogram" has nothing to look at.
   - **The equation overruns.** "(0, 250) + (50, 0) = (0 + 50, 250 + 0)" spans x = 1020–1860, past both edges of the maths zone.
   - **p and q are never named.** "p + q = q + p" uses them, but the narration says only "the plane" and "the jet".
   - Fix:
     - scale the scene to the picture zone, about 700 px for 250 m/s;
     - draw both routes, plane-then-wind and wind-then-plane, in their own colours;
     - shade the parallelogram;
     - break the equation over two lines inside 1060–1840;
     - write "plane + jet = jet + plane", or say "call the plane's arrow p and the jet's arrow q".
5. **M5 · s12c, 10:12–10:43: numbers are spoken before they appear (house §4: on screen at the moment they are spoken).**
   - "Twelve point five" (S3, 10:12–10:17), "six and minus eight" (S4) and "minus six and minus four point five" (S5) are
     said while only the arrows and a floating "×10⁻⁴ m s⁻²" are on screen.
   - The numbers first appear at 10:43, in the sums.
   - Fix: put "(0, 12.5)", "(6, −8)" and "(−6, −4.5)" at the arrow tips on their words. Attach the unit to the first
     number ("12.5 × 10⁻⁴ m/s²") instead of leaving it floating at the top right.
6. **M6 · s12d, 11:17–12:22: the isobars can't be seen.**
   - They are 1–2 px white lines on white cloud. The scene says "lines of equal pressure … every four hectopascals", but
     there is no visible isobar and no value.
   - Fix: draw the isobars 4 px in a dark ink with a light halo (as in s12i, where they show), and label two of them
     ("960", "964 hPa").
7. **M7 · Symbols on screen that are not explained, or that clash (house §4: every symbol explained at first use).**
   - **u means two things at once.** In s04/s07 u labels the wind vector. In s08 (4:51–4:56) "u = 9.3 × (−½)" is the east
     component, while "u = (−4.65, 8.05, 0)" is the vector, on the same screen. Fix: bold **u** for the vector everywhere and
     say "we'll call the wind vector bold u" in s04; or write "wind = (−4.65, 8.05, 0)" in s08.
   - **s10, 5:47–6:12: u₁, u₂, u₃ appear before they are defined.** The screen shows |**u**| = √(u₁² + u₂² + u₃²), but the
     narration has only u, v, w, and u₁ is defined at 17:32 (s13). Fix: write √(u² + v² + w²) in s10 (and in s18 if needed),
     or add the sentence "we'll also call them u one, u two and u three".
   - **s12e, 12:34: "−q = (−q₁, −q₂)"**. The subscripts are not spoken. Fix: say "q one, q two", or write "(−1, −3)" with the easy numbers.
   - **s12h, 16:04–16:28: u′ and ū are never said.** Fix: say "u prime, the anomaly" and "u bar, the average". Keep one
     typeface (bold for vectors, italic for the east component).
   - **s12i, 16:53–17:20: c and u − c are not named.** Fix: say "call the storm's velocity c".
   - **s23, 26:16: ∂T/∂t appears without "partial T by partial small t, where small t stands for time"** (house §4 example). Fix: add those words to S7.
8. **M8 · s12, 7:21–7:50: the picture contradicts the numbers.**
   - x = (3, 4, 1.2) km, but the arrow is drawn almost vertical, with long x₃ and tiny x₁ and x₂. The balloon looks to be
     mostly above the airport, not 5 km away and 1.2 km up.
   - Fix: draw it to scale (horizontal 5 km, height 1.2 km), or say "we've stretched the height so you can see it".
9. **M9 · s23, 26:16–26:24: equation on top of text.** "∂T/∂t = −u_j ∂T/∂x_j" overprints "warmer air → colder air".
   Fix: move the equation below "stand still", or retire the earlier keyword on S7.
10. **M10 · s21 (23:51–24:44), with s12c and s23: the air parcel is not 3-D (user rule U-WB-R3).**
    - **What is on screen.** The parcel is an isometric SVG wire cube, about 40–90 px, with no shading and no x, y, z. In
      s21 the narration moves it "u one metres east … north … rising adds u three ∂T/∂x₃". That is exactly a 3-D motion,
      but the flat map only shows two legs.
    - **My judgement: this does not meet the rule.** The rule names air parcels explicitly and asks for three.js and visible x, y, z.
    - **Recommendation:** render s21 as a tilted three.js map slab with a translucent shaded parcel box, its edges labelled
      east / north / up. On S2–S3, draw the three legs (u₁, u₂, u₃ per second) in 3-D, with a slow camera orbit. Reuse
      `movies/src/ch00_weather_basics/kit_wb/col3d.tsx` (`Box3D`, `BoxEdges3D`, three.js) and this movie's `kit_vi/three3d.tsx`.
    - In s12c, the force balance is a horizontal vector sum, so keep the plan-view diagram but draw the parcel with the same
      three.js box and an "air parcel" label (the word is spoken but not shown). Do the same for the arriving parcels in s23.
11. **M11 · s31, 31:21–32:20: real data with no data-source line (user rule: fail any real-data frame without it).**
    - The balloon drifts at the ERA5 850-hPa wind (5.8, 33.5) over the real Brittany coast and drifts 120 km, with no source line.
    - Fix: add `s31_balloon_delta: "Data: ERA5 (Copernicus C3S) 850 hPa wind · 1 Nov 2023, 18 UTC · Brest"` to `SRC`.
12. **M12 · s01, 0:14–0:23: the globe is clipped.** The satellite globe is cut by straight edges at x = 80 and y = 40, a disc
    with a flat left side and a flat top. It looks like a rendering fault in the first seconds of the movie.
    - Fix: pull the camera back so the whole limb fits inside 80–1000 × 40–820, or use the s02 rounded window on purpose.
    - The same chamfered clipping is in s02 0:57 and s33 32:46. Make them consistent.
13. **M13 · s12h, 15:17–16:28: the climate maps can't be read.**
    - Three 900 × 180 px strips stack at the top.
    - The climatology map's label is cut at the top edge ("Nov 1991–2020" clipped at y = 40).
    - The arrows are 5–10 px dashes, and the anomaly arrows "point east" can't be seen at 640 px.
    - For the first 39 s, everything below y ≈ 230 is empty.
    - Fix:
      - show one map at a time, full picture-zone height and cropped to about 160° E–100° W, 15° S–15° N, so the arrows are about 3× longer;
      - cross-fade climatology → Nov 2023 → anomaly on S5/S6/S7, with small labelled thumbnails of the other two;
      - draw a gold link from the 170–150° W box to "−5.0", "−3.7" and "+1.3".

## ch00_vectors_index_notation — SHOULD fix

- **S1 · Empty halves of 3.5–9.5 s** (gate and my scan; house §5). Show the first keyword or value on S1 of each scene:
  - right half: 1:32.5–1:40 (s04), 3:21–3:27 (s07), 4:56.5–5:05.5 (s09), 8:55.5–9:00.5 (s12b), 9:59–10:07.5 (s12c),
    11:08.5–11:15.5 (s12d), 17:21–17:24.5 (s13), 22:19.5–22:27.5 (s19), 23:51.5–23:55 (s21), 24:44.5–24:53.5 (s22),
    25:40–25:47 (s23), 27:23.5–27:31.5 (s26), 30:01–30:08 (s29), 30:41–30:49.5 (s30), 31:21.5–31:31 (s31), 33:52.5–33:57.5 (s34);
  - also visually empty: s01 0:14–0:21 (only a "?") and s06 2:44–2:53 (the relief sits in the bottom-left; the top and right are empty).
- **S2 · s04, 1:38–2:15: degrees on screen are not spoken.** The screen shows "150°", "from 150°" and "towards 330°", but the
  narration says "south-south-east" and "north-north-west". Degrees are first spoken in s08. Fix: show "from SSE" and
  "towards NNW" in s04 and keep the degrees for s08, or speak them.
- **S3 · s05, 2:29–2:43: "streaming north" vs the picture.** The highlighted ">30 m/s" arrows west of France point ENE; only
  Brest's own arrow points NNE. The cream highlight discs barely show on white cloud. Fix: say "streaming north-east" (or
  highlight the arrows near Brest), and use a gold ring instead of cream discs.
- **S4 · s07, 3:21–3:54: the axis labels vanish after the camera turns.** east / north / up and e₁, e₂ disappear, while S3
  says "along e one". Fix: keep the labels.
- **S5 · Calculations are small, more than 3 lines, not aligned, and past the safe area** (house §6: CalcStack 68 px, ≤ 3 lines, aligned at "=").
  - s08 4:19–4:56: 4 lines; sin and cos are not aligned with the u and v lines.
  - s12g 15:03: 6 lines.
  - s15 20:04–20:23: the result is 44 px.
  - s26 27:45–28:17: 5 lines; "sum ≈ −1.0 × 10⁻³ K/s" ends at x ≈ 1893.
  - s12f 13:55: "north: … = 10.2" and the subtraction line end at x ≈ 1890.
  - s12b 9:31: the equation ends at x = 1860.
  - Fix: use CalcStack (dim the older lines) and keep everything inside 1060–1840.
- **S6 · s09, 4:56–5:21.** The w arrow is about 3× longer than the 34 m/s arrow, while S3 says "more than three hundred times
  slower". The bars are right, but the arrows say the opposite. Also, "850 hPa" (on the slab label, and in s05/s12g) appears
  before hectopascals are defined in s12d. Fix: shorten w to a stub and label it "w (drawn larger)"; replace "850 hPa" with
  "about 1.4 km up", or define hectopascal earlier.
- **S7 · s10, 6:01–6:12: "4.65²" should be "(−4.65)²".** The sign step is skipped (builder-known). Also say "a straight bar
  on each side" instead of "two straight bars" (the screen shows |**u**|; "two bars" invites ‖**u**‖).
- **S8 · s12a, 7:50–8:54.**
  - The coastlines are almost invisible, so "flights from North America to Europe" has no map to point at. Fix: brighter
    coast and two place labels.
  - The orange "50" sits under the white 300 arrow at 8:30.
  - "300 m s⁻¹" (KaTeX) vs "300 m/s" (labels) mixes unit styles; "m s⁻¹" is never explained. Use "m/s" throughout.
- **S9 · Coriolis is not called apparent** (R1 §6 honesty). s12c S4 (10:17) says only "the Coriolis push, from Earth's spin".
  Fix: add "an apparent push, which appears because we measure the wind on a spinning Earth".
- **S10 · s12i, 16:46–17:20: mixed times.**
  - The map shows the storm at 00 UTC on 2 Nov, next to Brest, but the wind is the 18 UTC wind. Fix: show the 18 UTC
    storm position for the u − c step, or say the times.
  - The "u − c" and "−c" labels and the L glyph overprint each other. Fix: separate them with `placeLabels`.
- **S11 · Colour bars without a quantity** (house §5 "colour bar … with units"; the title should say what is plotted). These
  bars show only "°C": s00 Part B, s03 (the title is dropped from 1:07), s12f, s14, s21 and s24. Fix: "temperature, 1.2 km
  up" as in s20. s31's x₁ field has no colour bar; add "km east of Brest".
- **S12 · s02–s03, 0:42–1:32: the temperature is tinted over the MODIS cloud texture.** The colour no longer reads against the
  bar (the cloud brightness darkens it). Fix: drop the cloud blend to about 15 % or less.
- **S13 · s16 and s17.**
  - "≡" at 21:05 is never explained. Fix: use "=", or say "means the same as".
  - "for j in range(3):" (21:21) loops over 0, 1, 2, but the index runs 1, 2, 3. Fix: "for j in (1, 2, 3):".
  - The loop line stays on screen after p_j q_j is gone (21:26–21:44).
- **S14 · s19, 22:26: things shown before they are taught.** u_j ∂u_i/∂x_j appears before ∂ is introduced (s20), and the lower
  two-thirds of the screen is empty. Fix: show "3 × 3 = 9 terms" as a small 3 × 3 grid of dots, not the formula.
- **S15 · Conversion steps missing** (house §6: show the steps a novice would not do in their head).
  - s22 25:01–25:16: the step "−3 °C per 100 km = −3 ÷ 10⁵ K/m" is missing.
  - s22: "sum: 10 × (−3) + 30 × (−2)" drops the "× 10⁻⁵".
  - s25 27:10: the gold link starts at "100 km", not at "−3.2 °C / 100 km", and the north leg has no "100 km" label.
- **S16 · s26, 28:10–28:17: the sign flip is not written.** The calculation ends at "−3.7 K per hour", but the map says "+3.7
  K per hour". Fix: add a line "fixed thermometer: −u_j ∂T/∂x_j ≈ +3.7 K/h" (the s23 rule).
- **S17 · s27, 28:19–28:55.** The station graph is empty axes for 36 s before its line appears. "T (°C)" touches the "10.0" and
  "16.0" ticks, and the ".0" decimals are not needed. Fix: fade the station axes in on S6; drop the decimals.
- **S18 · s30 and s32.**
  - s30, 31:13: the scene's key result, δ_ij u_j = u_i, is the smallest line (44 px).
  - s30: "j becomes i, and the delta disappears" is nearly the narrated sentence.
  - s32, 32:38: the screen never shows "nine terms → three"; three terms float diagonally, and a duplicate 44-px line sits
    at the right. Fix: a 3 × 3 grid with the off-diagonal terms struck.
- **S19 · s13, 17:39: "(u, v, w)" overprints the letters r and s.** Fix: give it its own row.
- **S20 · s00, 0:09: title spacing.** The subtitle ends 39 px from the Part B map (house: ≥ 50). The u_j ∂T/∂x_j numerator
  touches the bottom edge of the map.
- **S21 · s01 → s02, 0:23: the globe camera jumps** (U-WB-R4 continuity). It cuts from the zoomed North-Atlantic satellite globe
  to the whole temperature globe centred on Africa. Fix: start s02 at s01's camera, then pull out.
- **S22 · Spoken times vs screen times.** s12f says "five o'clock" while the screen shows "17 UTC". s14 says "u sub i at six
  … at five" while the screen shows "18 h, 17 h". Fix: say "seventeen hundred" / "eighteen hundred", or show "17 UTC (5 pm)".
- **S23 · The ending is a user decision.** The movie uses the maths ending (orchestrator decision 2). Half the movie is real
  weather (Ciarán, El Niño, warm advection), so the weather/climate ending (house §3, as granted for the cross product) may
  fit better. Ask the user.

## ch00_vectors_index_notation — what works
- The arc is to the letter:
  - title, then hook with the core picture on its first frame;
  - building blocks with real Brest data;
  - adding and subtracting with six real-weather cases;
  - index notation, then the advection application with a check against what happened;
  - the delta, recap, spoken bridge to 1b, and the maths end card, said and written word for word (§3).
- The voice is warm, and goal-before-answer is kept throughout ("How did the wind change in that hour? We subtract…").
- Every new term is defined in words: reanalysis, scalar field, basis, isobars, geostrophic, hodograph, climatology,
  anomaly, free / dummy index, advection, warm advection, isotherms, warm front.
- The gold links work where used: the s25 zoom with 100-km legs; the s20 grad T arrow.
- The s12f ghost-arrow subtraction; the s27 "our sum +3.7 vs +2.9" check; the s26 term bars ("most of the effect comes from
  the strong wind from the south").
- Colours follow the house roles; no headings, boxes or badges.

## Overall: FIX (ch00_vectors_index_notation review 1 — 13 Must, 23 Should)
- The physics and every number are right, and the teaching arc is sound.
- The picture layer needs a fix loop:
  - the source line has to move off the pictures (M1);
  - three gate-blind empty stretches;
  - five layout and collision faults (M3, M4, M6, M9, M13);
  - numbers and symbols on screen off their words (M5, M7);
  - one misleading drawing (M8);
  - the 3-D parcel rule (M10);
  - one missing source line (M11);
  - the clipped opening globe (M12).
- After the fixes, run review 2 on s01, s04–s12h, s21, s23, s31, s33 and a whole-movie half scan with the source band masked.

Disk at review: C: 70 GB free, G: 524 GB free (unchanged by this review). Review frames: 184 MB, 382 PNG + 43 sheets, under
`G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_vectors_index_notation/review1/` (not committed). The QA re-run
rewrote `reports/movies/ch00/ch00_vectors_index_notation/qa.json` and its contact sheets/frames (same results).


---

# ch00_vectors_index_notation — review 2 (fresh eyes, after fix loop 1)                    2026-10-29

**Movie.** `movies/out/ch00/ch00_vectors_index_notation/1080.mp4` (commit ed892af): 2112.43 s (35:12.4), 72.31 MB,
45 scenes, 529 cues. The narration ends at 2109.93 s, then a 2.5-s hold. 16 sentences were spliced (fix1_build).

**Frames.** All frames are in `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_vectors_index_notation/review2/`
(233 MB, not committed):
- 382 full-size PNGs: one 0.4 s before the end of every sentence, the start of every scene, and the end hold;
- 43 labelled 3×3 sheets at 640 px;
- 143 extra crops and time series: s08, s09, s10 3-D, s11, s12, s12b, s12c, s12d (gridded, to measure angles), s12h links,
  s12i, s21 (every 0.1–2 s), s23, s24, s28, s29, s31, the end card.

**qa.json, as handed over (not re-run): 12 PASS + 1 WARN.**
- duration, size, codec, black (0), frozen (202, all narrated), content, loudness (−16.0 LUFS / −2.9 dBTP);
- flashes 0/s, captions (529 = script), subtitles, physics (70 hashes reproduce), equations (35);
- **halves WARN**: right half empty 1458.0–1461.5 s (s21 start, 3.5 s).
- The gates now mask the source band (y ≥ 835), so my review-1 gate-blind scan is no longer needed.
- I spot-checked the masked result on the sheets. No left/right half is empty for more than about 3.5 s.

**Numbers re-checked by hand.**
- Jet ≈ 65 m/s (GFS 28 Oct 2026): labelled "about 65 m/s · 28 Oct 2026".
- El Niño (16:29–16:48): the thumbnails read "avg: −5.0" and "2023: −3.7", and the equation is
  u′ = (−3.7) − (−5.0) = +1.3 m/s (east). The weakened trades are an eastward anomaly, which is correct.
- s22: −9 × 10⁻⁴ K/s ≈ −3.2 K/h.
- s26: 5.8 × (−3.2 × 10⁻⁵) = −1.86 × 10⁻⁴ and 33.5 × (−2.5 × 10⁻⁵) = −8.38 × 10⁻⁴. The sum is −1.02 × 10⁻³ K/s = −3.7 K/h, and
  the fixed-thermometer line reads "+3.7 K per hour" (the sign flip is now written).
- s27: (8.2 − 2.4)/2 = 2.9 K/h. The station rose 10.3 → 14.9 °C between 18 and 20 UTC.
- s31: 33.5 × 3.6 = 121 km north and 5.8 × 3.6 = 21 km east. The drawn drift matches the x₁ grid.

**Index-notation and Kronecker-delta signs, all right.**
- Free index in every term (s14).
- Dummy index summed, and "at most twice" with p_i q_i s_i struck (s17).
- δ_ij = 1 if i = j and 0 if i ≠ j, as in (2.16) (s29).
- For i = 2, δ₂₁u₁ and δ₂₃u₃ are struck and δ₂₂u₂ = u₂ (s30).
- ∂x_i/∂x_j = δ_ij, and u_j δ_ij = u_i (s31).
- δ_ii = 3, and δ_ij p_i q_j = p_i q_i with the off-diagonal terms struck (s32).

**Physics directions.**
- s12c: Coriolis (6, −8) is 90° to the right of the wind (8, 6), which is correct for the NH. The narration and the screen
  both say it is "apparent".
- s12g: the wind veers going up ("clockwise going up, seen from above"), which means warm advection.
- s34: the Coriolis inset points to the right of the wind.
- s24/s25: grad T points SW, towards the warm air.
- The one fault is s12d (N-M1 below).

## Review-1 items at their new timestamps

| item | status | where I checked (new times) |
|---|---|---|
| M1 source line in its own band, pictures ≤ y 820 | **fixed** | Checked on every sheet: the source line sits at y ≈ 840–866 with nothing on it. One 8-px residual: in s10 at 5:27–5:42 the easy-triangle "6" ends at y ≈ 832 (S-new-12). |
| M2 gate-blind empty halves | **fixed** | s11 keyword from 6:20; s33 recap has a picture per sentence (33:51–34:23); s12h one map. Only s21 is left, 3.5 s (WARN). |
| M3 s11 labels pile up | **partly** | Values now sit on the projection bands and the labels are apart (6:36–7:18). At 7:00–7:18 the gold "the arrow itself" link now crosses the "along coast" label (S-new-6). |
| M4 s12b parallelogram | **fixed** | To scale, both routes, shaded, "call the plane's arrow p and the jet's arrow q" (9:03–10:13). |
| M5 s12c numbers on their words | **fixed** | (0, 12.5) × 10⁻⁴ m/s² at 10:31; (6, −8) at 10:41; (−6, −4.5) at 10:48. |
| M6 s12d isobars invisible | **fixed** | Dark 4-px isobars with a halo, labelled 968 and 972 hPa (11:28–12:40). This reveals N-M1. |
| M7 symbols not explained | **fixed** | Bold **u** (1:52); "east = 9.3 × sin 330°" (4:17); √(u² + v² + w²) (5:48); q₁, q₂ spoken (12:43); "ū: average u′: anomaly" (16:18); "call the storm's velocity c" (17:11); "t: time" (26:35). |
| M8 s12 balloon drawn vertically | **fixed** | Legs drawn to scale: 3 km and 4 km on the floor, a 1.2-km rise (7:30–7:57). |
| M9 s23 equation over text | **fixed** | 26:35–26:55. |
| M10 parcel not 3-D | **fixed** | three.js lit boxes: s12c (10:15), s21 (tilted ERA5 slab, 3-D legs u₁ u₂ u₃, slow orbit; 24:17–25:10), s23 (arriving parcels, 26:08–26:55). Layout faults in S-new-1 and S-new-2. |
| M11 s31 source line | **fixed** | "Data: ERA5 (Copernicus C3S) 850 hPa wind · 1 Nov 2023, 18 UTC · Brest". |
| M12 clipped globe | **fixed** | s01, s02 and s33 show the whole disc. |
| M13 s12h strips | **fixed** | One map at a time, thumbnails, gold links (15:38–16:53). The links cross a label (S-new-4). |
| S1 empty halves | **partly** | Only s21 is left: 24:17.7–24:21.2, 3.5 s (S-new-1). |
| S2 s04 degrees | fixed | "from SSE / towards NNW" (2:12). |
| S3 s05 "north-east", rings | fixed | 2:34. |
| S4 s07 axis labels | fixed | 3:36–3:59. |
| S5 calculations | **partly** | ≤ 3 lines and aligned in s08, s12g, s15, s22 and s26. Two lines still run past x 1840: s08 "= 9.3 × (−½) = −4.65 m/s" ends at x ≈ 1873 (4:24–5:02), and s12b "&#124;p + q&#124; = √(50² + 250²) ≈ 255 m/s" ends at x ≈ 1881 (9:54–10:13). |
| S6 s09 w arrow, 850 hPa | fixed | The w arrow is a stub, "about 1.2 km", and the bars read "> 300 × slower". |
| S7 s10 (−4.65)², "a bar on each side" | fixed | 5:53–6:19. |
| S8 s12a coasts, labels, m/s | fixed | New York, London, "wind 10 km up (m/s)". One residual: s12g uses "m s⁻¹" (15:08–15:37, cosmetic). |
| S9 Coriolis "apparent" | fixed | Spoken, and "apparent push (spinning Earth)" on screen (10:32). |
| S10 s12i times and labels | **partly** | The 6 pm storm and c are shown. The "−c" label overprints the arrow heads, and a track dot sits on the "u" of "u − c", so it reads "û − c" (17:18–17:46; S-new-5). |
| S11 colour-bar titles | fixed | All except the s33 recap globe, which has no bar (S-new-9). |
| S12 cloud blend | fixed | 0:23–1:32. |
| S13 ≡, range(3), stale loop | fixed | "for j in (1, 2, 3):" (21:38). |
| S14 s19 3 × 3 dots | fixed | 22:46. |
| S15 conversion steps | fixed | s22 25:28–25:58; s25 link from "−3.2 °C" and the north 100-km leg. |
| S16 s26 sign flip | fixed | 28:42. |
| S17 s27 empty axes, decimals | fixed | 28:50–29:37. |
| S18 s30 / s32 | **partly** | s32 3 × 3 strike grid is fixed (33:01). In s30 the key result δ_ij u_j = u_i is still the smallest line at the bottom (31:41–31:53; S-new-10). |
| S19 s13 (u, v, w) row | fixed | 17:58. |
| S20 title spacing | fixed | The subtitle is about 66 px clear. |
| S21 s01 → s02 camera | fixed | s02 opens on s01's framing, then pulls out. |
| S22 spoken vs screen times | fixed | "5 pm UTC / 6 pm UTC". |
| S23 ending | fixed | Weather/climate ending (s35), words and keyword lines as HOUSE_STYLE §3. |

**Count.** Of 13 Must: 12 fixed, 1 partly (M3, now cosmetic). Of 23 Should: 19 fixed, 4 partly (S1, S5, S10, S18).

## The builder's open items, judged

1. **s12h "avg −5.0" link crossing a label** (16:29–16:53): **Should**. The crossing is not only while the link grows. In the final
   state, both gold links from "avg: −5.0" and "2023: −3.7", and the "+1.3 m/s" link, run straight through
   "ū: average u′: anomaly". For 24 s it reads like struck-out text, which breaks the HOUSE_STYLE §6 rule that links must not
   cross text. See S-new-4.
2. **s09 column diagram small** (5:02–5:27): **Should**. The slab itself is readable. But the gold link's arrowhead lands on
   the "w" label and covers it from 5:13 to 5:27. On S4 the link also cuts through "clouds". See S-new-3.
3. **s31 "−200" tick next to the keyword** (31:56–32:51): **Should**. "a map of x₁" and "−200" are about 15 px apart. The bar's
   "0" and "100" are about 15 px apart too, and these two ticks sit left of their true positions on a −200…+100 bar
   (the 0 label is at about 573 px; it should be at about 607). See S-new-8.
4. **s21 3.5-s empty right half** (24:17.7–24:21.2, halves WARN): **Should**. Below the 10-s FAIL limit, but trivial to fix.
   See S-new-1.
5. **Spoken "u bar", "u prime" (16:18), "q one" (12:43), "bold u" (1:52).**
   - Each phrase is written as words in the captions: "We call the average u bar / and the anomaly u prime:", "which we call
     q one / and q two", "the wind vector is bold u."
   - The matching symbol is on screen when it is said: ū and u′ (16:18), (−q₁, −q₂) (12:43), the bold **u** label (1:52).
   - The timing sits inside the sentence windows.
   - The same G2P already reads "u one" and "u sub i" in v1 sentences.
   - Risk is low, but **a short listen check is still needed**. I can't hear the audio, and these are spliced sentences with
     per-sentence gain (fix1_build). Listen at 1:52, 5:53, 6:00, 9:31, 10:32, 12:43, 16:18, 17:11–17:25, 18:52, 26:35 and
     34:43–35:10, for two things:
     - the letter names ("you bar", "you prime", "cue one"), not "uh";
     - no level jump at the splice edges.
   - This is a listen item, not a fix.

## ch00_vectors_index_notation review 2 — MUST fix

1. **N-M1 · s12d, 11:41–12:40: the picture shows the opposite of what the scene says (physics honesty, R1 §6).**
   - **What the narration says.**
     - S4: "If the pressure push and the Coriolis push balanced exactly, the wind would blow along the isobars."
     - S11: friction "turns it across the isobars".
   - **What the screen shows.** Measured on a gridded 1080p crop at 11:56:
     - The orange geostrophic arrow points at a screen bearing of about 52°. The isobars it passes over run at about 0–20°
       (nearly north–south).
     - So the arrow cuts across **three** isobars towards *higher* pressure.
     - The teal real wind (bearing about 29°) looks almost parallel to them.
     - Once the isobars were made visible (M6 fixed), any viewer can see this.
   - **Why it happens.** The numbers themselves are right.
     - At the tail point (48° N, 6° W), the ERA5 976 and 980 hPa isobars bend. They run NE (about 35–55°) south of 48.4° N and
       N–S north of 48.5° N. Bearings are from `vi.json → storm.isobars`.
     - So a local u_g of (30.9, 24.9) at about 51° is right.
     - But the 39.7 m/s arrow is drawn about 270 px (≈ 190 km) long, so it reaches into the N–S stretch.
   - **Fix (either):**
     - **(a) preferred:** move the sea point to where the isobars are straight for ±150 km (e.g. about 47.6° N, 6.5–7° W, on the
       NE-running 976/980 stretch). Recompute u_g, u10 and u_ag with the same fluidpy call (CHECK rows), and re-splice S6, S7 and
       S10 with the new numbers.
     - **(b) minimal:**
       - Draw both arrows at about 2.5 px per (m/s), centred on the point, so they stay inside one isobar spacing.
       - Add a short dashed tangent of the local isobar through the point, so "along" can be seen.
       - Then check on a frame that the screen angle between u_g and the local isobar is ≤ 5° and that the real wind visibly
         points across them towards the low.

## ch00_vectors_index_notation review 2 — SHOULD fix

- **S-new-1 · s21 (24:17–25:10), layout of the new 3-D parcel.**
  - The right half is empty for 3.5 s at the start. Show "air parcel · moves with the wind" on the right from frame 0.
  - The S4 folded result shrinks just as it is revealed. "u_j ∂T/∂x_j = u₁… + u₂… + u₃…" drops to about 52 px, below the
    84-px S3 line (24:43–25:10). Keep it at ≥ 68 px on two lines, with "= u·∇T" below.
  - Label collisions:
    - "wind" overprints "north" during the north hop (24:34–24:36);
    - "u₁" runs into "east" (24:23–24:33);
    - "u₃ ≈ 0.1 m/s" overlaps the box edge (24:35–25:10).
    - Run `placeLabels` on the box-edge labels and the leg labels.
  - At 24:17–24:33 the parcel box (about 100 px) covers the Brest dot and the start of the u₁ leg. Start it smaller or lift it.
- **S-new-2 · s23, 26:08–26:55.**
  - The parcel box sits on the wind arrowhead and covers the "(" of "(10, 30) m/s". Move the label 40 px right, or the box
    off the tip.
  - The lowest arriving box pokes out below the field's bottom edge. Clip it to the field.
- **S-new-3 · s09, 5:13–5:27.**
  - The gold link's head covers the "w" label. End the link beside the label, and scale the slab group up about 1.3×.
  - At 5:22–5:27 the link also crosses "clouds". Route it around.
- **S-new-4 · s12h, 16:29–16:53.** Three gold links run through "ū: average u′: anomaly" (HOUSE_STYLE §6). Either:
  - move that keyword line above "u′ = u₂₀₂₃ − ū₁₉₉₁₋₂₀₂₀"; or
  - bring the links in under it, ending them at "(−5.0)" and "(−3.7)" from below.
- **S-new-5 · s12i, 17:18–17:46.**
  - A storm-track dot sits over the "u" of "u − c", so it reads "û − c". Hide the track dots under labels, or move the label.
  - The pink "−c" overprints the arrowheads. Offset it.
- **S-new-6 · s11, 7:00–7:18 (M3 residual).** The "the arrow itself" link crosses the "along coast" label. Route it under the
  coast arrow. At 6:20–7:18 the "north" axis label touches the map's top edge.
- **S-new-7 · s12c, 10:48–11:26.**
  - "Coriolis" touches the wind arrow and an isobar.
  - "(0, 12.5)" sits on an isobar line.
  - "− friction" touches the parcel box.
  - Fix: `placeLabels`, plus a dark halo on the labels.
- **S-new-8 · s31, 31:56–32:51.**
  - Put the colour-bar ticks at their true positions on the −200…+100 bar (0 at 2/3 of the bar).
  - Leave ≥ 40 px between "a map of x₁" and "−200": move the keyword up one line, or the bar right.
- **S-new-9 · s33 recap globe (33:17–33:24) has no colour bar** (HOUSE_STYLE §5, U-WB-R2). Add the s02 bar ("temperature,
  2 m · °C"), or use the uncoloured satellite globe.
- **S-new-10 · s30, 31:41–31:53 (S18 residual).** Make δ_ij u_j = u_i the 84-px result line in gold. Change the keyword
  "j → i, and δ is gone" to "swaps j for i" (the current one nearly repeats the narration).
- **S-new-11 · Data-source lines on frames that show no data** (honesty of attribution). Show the source line only while
  real data is on screen. These frames carry an ERA5 or SYNOP credit but show only diagrams:
  - s10 easy 6-8 triangle (5:27–5:48, "SYNOP");
  - s15 abstract p, q (19:38–20:05, "ERA5 850 hPa wind");
  - s33 S4–S5 and S8 diagrams (33:39–33:59, 34:16–34:23);
  - s34 S0–S1 ε-cloud (34:23–34:30).
- **S-new-12 · M1 residual, s10, 5:27–5:42.** The easy-triangle "6" ends at y ≈ 832, 8 px above the source line. Lift the
  diagram 30 px.
- **S-new-13 · s27, 28:52–29:02: spoken numbers not on screen** (house §4). Label the curve's ends "2.4 °C (17 UTC)" and
  "8.2 °C (19 UTC)" on S2.
- **S-new-14 · S5 residual.** Break the s08 "= 9.3 × (−½) = −4.65 m/s" (x ≈ 1873) and the s12b |p + q| line (x ≈ 1881) so
  they end inside 1840.

## COSMETIC (optional)
- s04 2:12–2:19: the gold direction arc cuts through "Brest".
- s07 3:36–3:59: "e₁" touches "6".
- s12a 8:43–9:03: the westbound plane arrow's head hides under the orange 50 arrow. The colour bar disappears during S13
  without a zoom.
- s12g 15:08–15:37: "m s⁻¹" where the rest of the movie uses "m/s".
- s15 20:31–20:50: the "11.5" link crosses "e along the coast".
- s20 24:02–24:17: the grad T arrow crosses the "Brest" label.
- s22–s23: the synthetic temperature field shows coarse pixel blocks in its NE corner. Smooth it.
- s34 34:23–34:43: overlapping ±1 discs in the ε cloud.
- s35 end card: uneven gaps in the concept list.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_vectors_index_notation (review 2) | 2112.43 s (35:12.4); narration ends 2109.93 s, then a 2.5-s hold | 72.31 MB (budget 120, hard 160) | 12 PASS + halves WARN (s21, 3.5 s) | **FIX**: s12d picture contradicts "along the isobars" (N-M1). Every number right; NH right-deflection, Coriolis "apparent", veering → warm advection, grad T towards warm air, El Niño anomaly sign | PASS: 35 present; δ_ij (2.16); no KaTeX errors | PASS with Shoulds: source band clean; collisions in s09, s11, s12c, s12h, s12i, s21, s23, s31 | PASS: numbers on their words (one gap, s27 S2) | PASS: 529 cues = script; spliced sentences captioned as words | PASS: 0 flashes; perceptual maps | n/a (none, as the house style requires) | **FIX** |

## Overall: FIX (ch00_vectors_index_notation review 2 — 1 Must, 14 Should, 9 Cosmetic)
- Fix loop 1 worked:
  - 12 of 13 Musts are fixed; M3 is left only as a cosmetic link crossing.
  - 19 of 23 Shoulds are fixed; S1, S5, S10 and S18 are partly fixed.
  - The source band is clean, the 3-D parcel is in, the recap has pictures, s12h is readable, and the weather ending is in.
- **One Must remains: N-M1.** In s12d the now-visible isobars show the geostrophic arrow crossing three of them while the
  real wind runs along them. That is the reverse of the scene's message.
- After N-M1, re-check s12d frames at 11:41, 11:56, 12:08 and 12:32. The Shoulds can go in the same loop.
- A short listen check at the spliced sentences (listed above) is still open before `qa_pass`.

Disk:
- At the start: C: 69 GB free, G: 524 GB free.
- At the end: C: 60 GB free, G: 516 GB free.
- This review wrote only 233 MB of frames to G: (`…/review2/`, 382 + 143 PNG + 43 sheets) and nothing to C:. The rest of the
  drop came from other processes.

---

# cross product v5 / Part 1 / Part 2 — review 2 (fresh eyes, after fix loop 1 15d4f4b and the centrifugal build 7efe80d)                2026-10-29

Movies reviewed (read-only; nothing edited):
- **v5 full** `movies/out/ch00/ch00_cross_product_why/v5_1080.mp4`: 4154.60 s (1:09:14.6), 153.59 MB, md5 = the QA'd G: scratch file. Captions `v5_en.vtt`.
- **Part 1** `movies/out/ch00/ch00_cross_product/1080.mp4`: 1961.13 s (32:41.1), 92.66 MB (fix-1 render, 02:22).
- **Part 2** `movies/out/ch00/ch00_cross_product_uses/1080.mp4`: 2456.75 s (40:56.8), 115.55 MB.

**Frames.** 284 PNG + tiles (99 MB) under `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_cross_product_v5/review2/`:
- `v5/`: one frame per sentence end in all 9 centrifugal scenes and the changed s26b, s27 and s47; a 1-s strip through 45:23–45:41.
- `v5r1/`: every review-1 item at its timestamp.
- `p1/`, `p2/`: start, every sentence of the opening and recap scenes, joins and end cards.
- `band/`, `cmp/`: caption-band hits and the v5-versus-part pixel comparisons.

**Scans.**
- **Caption band.** I scanned y 880–1040 at 2 fps in all three movies. There are only four hits, each ≤ 0.5 s (13:42, 15:46, 31:48.5, 59:49 in v5).
  - The builder's old hits in s18_cases, s24_spin, s28a, s17, s21b and s44 are gone.
  - s37 is still a problem, as a collision just above the band (M3).
- **Script diff.** P1 s02–s19 and P2 s23–s46 and s48 are word-identical to v5. P1 s22w and P2 s47 differ on purpose.
- **Pixel diff, v5 against the parts.** Mean |Δ| is ≤ 0.53/255 at 13 Part-1 times and 12 Part-2 times. The one exception is 2.36 at the s46/s47 edge, where the recaps differ.
- **Captions** (my own check):

  | movie | cues | max line | lines per cue | max cps | order | end |
  |---|---|---|---|---|---|---|
  | v5 | 1005 | 42 | ≤ 2 | 16.77 | in order | 4151.8 s |
  | P1 | 465 | 42 | ≤ 2 | 16.34 | in order | 1958.3 s |
  | P2 | 603 | 42 | ≤ 2 | 16.77 | in order | 2454.0 s |

  Every cue ends inside the audio.

**Physics checked by hand** (each value against the manifest rows):
- **The frame rule.** (dB/dt)_out = (dB/dt)_rider + Ω × B. u_out = u + Ω × r.
- **The rule applied twice.** The rider's part gives du/dt + Ω × u. Then Ω × (u + Ω × r) = Ω × u + Ω × (Ω × r).
  - So the change seen outside = du/dt + 2Ω × u + Ω × (Ω × r) (Vallis (2.12) rearranged).
  - So du/dt = pushes − 2Ω × u − Ω × (Ω × r).
- **Triple product.** p × (q × s) = q(p·s) − s(p·q) gives −Ω × (Ω × r) = Ω²r − Ω(Ω·r).
  - On the disc this is Ω²r: 0.25 × 2.5 = 0.625 m/s², with 2π/0.5 = 12.57 s per turn.
  - On Earth it is Ω²r⊥, because Ω(Ω·r) = Ω²r_along.
- **Pictures.**
  - The centrifugal arrow points away from the axis and leans equatorward.
  - The s26f Ω × (Ω × r) arrow points towards the hub.
  - s27a: Coriolis is to the right of u on the anticlockwise disc.
- **Size on Earth.**
  - Ω² = 5.317 × 10⁻⁹ s⁻².
  - × 6 371 km = 0.0339 m/s² (0.345 % of g).
  - × 4 505 km = 0.0240 m/s².
  - 0 at the poles.
- **Sideways part and Coriolis at 45°.**
  - Sideways part = Ω²a cos φ sin φ = 0.0169 m/s².
  - Coriolis on a 10 m/s wind ≤ 2Ω × 10 = 1.46 × 10⁻³ m/s².
  - Ratio 11.6, so "more than ten times" is honest.
- **Effective gravity** g = g* − Ω × (Ω × r), so the right equation is du/dt = pushes + g − 2Ω × u.
- **On the ×50 ellipse,** g is drawn along the normal: 56° versus a true normal of 55°. It does not point at the centre, which is correct.
- **Plumb line.**
  - Tilt 0.099° (sphere) and 0.192° (geodetic − geocentric).
  - The drawn angle ≈ 5.7°, about ×50 of 0.1°, which is honest.
  - The extended line passes on the equator side of the centre, which is correct.
- **Gravity and shape.**
  - g at the equator = 9.780 and at the poles = 9.832 m/s² (WGS 84). The spin share 0.0339/0.0519 = 0.65 is drawn 65 : 35.
  - a − b = 21.4 km ≈ a/300.
- **Arrow scales.** No new scene has a "×50"/"×100" label on screen (house: no badges), so nothing on screen claims a scale. The documentation does not agree with the code (S1).

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| v5 (review 2) | 4154.60 s; narration ends 4152.10 s | 153.59 MB (**size WARN**, hard 160) | 11 PASS + 2 WARN. Size; halves "right 2723.5–2727.5 (4.0 s), 2730.0–2736.5 (6.5 s)" = s27c. Physics 151 hashes, equations 146, captions 1005 = script, −16.0 LUFS / −1.9 dBTP, flashes 0 | PASS (all signs and numbers above) | **FIX**: s27b "p, q → Ω · s → r" reads as a dot product (M1). No KaTeX errors | FIX: s37 labels over the source line (M3); small new-scene pictures (S3–S6) | **FIX**: s27c maths zone empty ≈ 10 of its first 14 s (M2) | PASS (3 cues < 1 s, C9) | PASS: 0 flashes; violet, teal, orange, brown and slate, with rose "−" | n/a (house) | **FIX** |
| Part 1 (review 2) | 1961.13 s; narration ends 1958.63 s | 92.66 MB | 13/13 PASS (halves PASS). Physics 77, equations 69, captions 465, −16.0 LUFS / −2.1 dBTP | PASS | PASS (review-1 M1 fixed) | PASS with cosmetics | PASS | PASS | PASS | n/a | **PASS** → `qa_pass` |
| Part 2 (review 2) | 2456.75 s; narration ends 2454.25 s | 115.55 MB | 12 PASS + halves WARN "right 1036.5–1040.0, 1043.0–1049.5" (= v5 s27c). Physics 78, equations 79, captions 603, −16.0 LUFS / −3.4 dBTP | PASS | **FIX**: inherits M1 | FIX: inherits M3 | **FIX**: inherits M2 | PASS (2 cues < 1 s) | PASS | n/a | **FIX** |

## Are the user's three requests delivered?
| request | verdict | evidence |
|---|---|---|
| 1. Why each part of the formula makes sense (s03, s15a, s18d, s21a–d, s22w) | **Delivered** | Each scene is in the movie, on its words, and correct as written: s03 (lever arm), s15a (ε table), s18d (Pythagoras, "each side × \|a\|"), s21a/b/c (z/x/y mini-torques), s21c (three mini walls with + and − arcs, 23:35–23:46), s21d (tilted axis, rose −x), s22w (four mini-pictures lit on their words). Only s22w's gold frames break the house style (M4) |
| 2. The split; each part starts and ends properly | **Delivered** | **Part 1:** own title ("and how physics uses it", p × q → door → ball), hook, s50 recap with a spoken pointer to Part 2, maths end card (logged in HOUSE_STYLE §12, 2026-10-28), s19 → s50 cross-fade. **Part 2:** own title with capital Ω, hook, s01a–s01d recap (recipe with all three rows worked, \|a\| "written with two bars", unit vectors defined with x̂, ŷ, ẑ drawn, the proton, 1 → 2 → 7 kicks → circle, F named, "no work: no energy given"), splice into s23, s47 "from the last video" / "the last video: why it's built this way", end-card tile 2 labelled "last video" |
| 3. Centrifugal derivation and use (s26a1, s26e, s26f, s27b–g) | **Delivered, with fixes** | The derivation is complete and correct (above): the rule motivated before it is used, used twice, the 2 explained, the triple product, size, effective gravity, level sea, three traces, and a bridge back to Coriolis. To fix: M1, M2 and S1–S8 (legibility and documentation). There are no sign or number errors |

## Review-1 items — status
| item | status | evidence at the new time |
|---|---|---|
| v5 M1 false "− 0.1 × 10 = 1" | **fixed** | 21:00 "⟳ 0.1 × 10 = 1 clockwise", τz = 6 − 1 = 5. s21b at 22:18: "0.2 × 30 − 0.1 × 10 = 5" |
| v5 M2 s22w slide | **fixed**, but a new box (M4) | 29:17–30:15: four mini-pictures with teal first arrows and orange second arrows; the lit one is framed by a gold rectangle |
| v5 M3 s18 "largest along one line" | **fixed** | words: "largest when the arrows point the same way". The p·q values are gone (15:15) |
| v5 S1 s18a overprint | fixed | 15:52: "the minus sign ?" has its own row; the layout is stable |
| v5 S2 s18d "× \|a\|²" | fixed | screen "each side × \|a\|" (17:03) matches "multiply both sides by the length of vector a too" |
| v5 S3 s21c symbols only | fixed | 23:00 expansion on two lines; 23:35–23:46 three mini walls with ± arcs |
| v5 S4 s11 hand entrance | fixed | 08:15.2–08:15.8 the hand enters cream at its final pose, above y 820 |
| v5 S5 "× 4.5", "45°" not spoken | fixed | 01:10 the bar has no number; 24:31 no 45° label |
| v5 S6 s17 card and glyph overlap | fixed | 13:52 orange face shown, 13:58 teal; 14:06 ⊙ is clear of the text |
| v5 S7 s21a/b labels, empty S1 | fixed | r is drawn on S1 (20:01.5, 21:18.5); "30 N along y" is clear; axis letters inside the content area |
| v5 S8 "alternating tensor" | fixed | "the index-notation video" |
| v5 S9 recap lacks the new ideas | fixed | v5 s47 S3 and S6 |
| v5 S10 / P2 S10 / P1 empty halves | fixed except s27c | qa `halves` lists only s27c (new, M2) |
| v5 S11 size | open (accepted WARN) | 153.59 MB < 160 hard |
| v5 C1 / P1-C3 / P2 C2 cues < 1 s | open | C9 |
| v5 C3 s28a and s44 edge hits | fixed (band scan clean) | — |
| v5 C4 s21d negative colour | fixed | 24:31 rose dashed "about x: −0.2" |
| v5 C7 subtitles gate pair | fixed | qa compared 1005 = 1005 on the v5 file |
| v5 C2 s06 30-px labels, C5 s07 link, C6 muted keywords | not re-checked | — |
| P2 M1 recipe | **fixed** | 00:57–01:15 x, y, z rows with 1 × 0 − 0 × 3 = 0 and 0 × 1 − 5 × 0 = 0 worked; "the recipe" |
| P2 M2 proton | **fixed** | 02:40 "proton" glyph in s01d, the same in s23a (04:24) |
| P2 M3 kicks | **fixed** | 02:35 push ⊥ u; 02:40 one kick; 02:43 two; 02:46 seven; 02:52 the circle |
| P2 S1 ω → Ω | fixed | 00:02 Ω, Ω × r readout; 00:11 bigger parcel arrows |
| P2 S2 recap beyond Part 2 | fixed (option a) | "In the last video, we saw that…", 39:37 "from the last video" |
| P2 S3, S4, S5, S6 | fixed | "written with two bars"; "along: 0"; unit vectors defined and x̂, ŷ, ẑ drawn (02:18); "F: the push", "no work: no energy given", "same speed all the way round" |
| P2 S7 pointer to Part 1 | fixed | s47 last sentence; end-card tile 2 "last video" |
| P2 S8 "14" on a's head | fixed | 01:15 bracket is right of the violet arrow |
| P2 S9 s25b r label (R3-S2) | not re-checked | — |
| P2 C5 "a × b" in hook | fixed | "the cross product in the weather?" |
| P1-S1 ending | resolved | HOUSE_STYLE §12, 2026-10-28 |
| P1-S2 Part-2 words in Part 1 | fixed | s22w "and, in the next video, …" |
| P1-C1 "a × b" before spoken | open (cosmetic) | 00:12.4 |

## MUST fix
1. **M1 · v5 44:13.3–44:47 (s27b S5–S7) · P2 15:26–16:00. "p, q → Ω · s → r" reads as the dot product "Ω · s".**
   - What is wrong: the gold mapping line uses the house "·" separator between two maths symbols, so it reads "p, q → (Ω·s) → r" at the decisive substitution step.
   - Fix: write two items, "p, q → Ω" and "s → r", on one row with a 60-px gap, or on two lines. "p = q = Ω, s = r" also works. TSX only.
2. **M2 · v5 45:23.2–45:37 (s27c S1–S3) · P2 17:16–17:30. The maths zone is empty for about 10 of the first 14 s (qa `halves` WARN: 4.0 s + 6.5 s).**
   - What is wrong: "not at right angles" shows only from 45:27 to 45:30. Then the right half is empty until "r = r_along + r⊥" at ≈ 45:37, while S2 is already splitting r on the picture.
   - Fix:
     - Bring "not at right angles" in on S1 (45:23.3) and keep it.
     - Show "r = r_along + r⊥" (on_screen_eq_extra 0) at the start of S2 (45:29.8), lit leg by leg as "along the axis" and "straight out" are spoken.
     - Re-run qa: `halves` must PASS.
3. **M3 · v5 59:49.2–59:52.9 (s37 S7) · P2 31:42.1–31:45.8. The labels overprint the source line, and the source is wrong for the new frame.**
   - What is wrong:
     - When the two thumbnails appear, "f > 0 · anticlockwise" and "f < 0 · clockwise" (y ≈ 806–830) are written over "Image: NASA VIIRS · Data: ERA5 … Cyclone Idai, Mozambique" (y ≈ 840).
     - That line credits only Idai, but the left thumbnail is Ian (GOES-16).
   - Fix:
     - Move the two labels to y ≤ 780, under the thumbnails.
     - On the thumbnails' first frame, switch the source line to the s38 one: "Ian: GOES-16 + NOAA HRRR, 28 Sep 2022 · Idai: NASA VIIRS + ERA5 (Copernicus C3S), 14 Mar 2019".
4. **M4 · v5 29:24–30:12 (s22w S3–S6, v5 only; Part 1's render has no frames). Gold rectangles frame the lit mini-picture (house §5: no boxes, cards, chips or panels).**
   - Seen at 29:30 (globe) and 30:00 (ball).
   - Fix: light the active picture by bringing it to full opacity with the others at 35 % (as at 29:17), plus a gold pointer from its keyword. Remove the rectangles.

## SHOULD fix
1. **S1 · s27e / s27f (v5 47:35–49:33; P2 19:07–21:05). The arrow-scale documentation does not match the drawing.**
   - The code draws the centrifugal arrow ×100 against g*, and the manifest notes this ("storyboard planned ×50; ×50 gave a 20-px arrow"). My frames measure ≈ ×80–100.
   - But `storyboard.yaml` s27e exaggeration ("drawn ×50") and s27f ("centrifugal arrows ×50 against g*") still say ×50.
   - Fix: change both storyboard rows to "×100" (s27g's ×50 flattening and plumb angle are correct as documented). Keep the screen badge-free.
2. **S2 · v5 68:18–68:27 (s47 centrifugal sentence) · P2 39:52–40:01. The recap mini-picture contradicts s27d and s27f.**
   - What is wrong:
     - g is drawn pointing exactly at Earth's centre.
     - The Ω²r⊥ arrow is ≈ 85 % of g's length.
     - The pin floats off the dashed flattened outline.
   - Fix:
     - Reuse the s27f "real Earth" panel: g along the ellipse normal, pin on the outline.
     - Draw the centrifugal arrow short, ≤ 20 % of g, as a sketch.
3. **S3 · v5 46:16–46:24 (s27c S7). The "leans towards the equator" picture is about 50 px.**
   - The white "up" arrow and the gold arc at the pin are unreadable at 640 px, and the planned "north" arrow is missing.
   - Fix: zoom the camera to the pin as s27e does (47:40), and draw up, north and the slate arrow at ≥ 120 px with the 45° arc.
4. **S4 · v5 48:24–49:33 (s27f S3–S9). The sideways part is too small and its label collides.**
   - The rose "sideways part" arrow is ≈ 25 px.
   - Its label sits across the circle outline and the Ω axis, and from 48:37 the gold link starts on "part".
   - Fix:
     - Draw the sideways part at ≥ 80 px (it is already ×100).
     - Put the label outside the disc, upper right of the pin.
     - Start the link at the arrow.
5. **S5 · v5 47:55–48:12 (s27e S8) and 49:34–50:55 (s27g icons). The icons are about 50 px and cannot be recognised.**
   - The "plumb bob" is two arrows, the scale is a grey bar, and the ball is a dot.
   - Fix: 110–130-px code-drawn icons (string + bob, a scale with a dial, a ball with drop lines), each labelled on its words. Or drop them and keep the keyword.
6. **S6 · v5 41:00–41:12 (s26e S7). The "s26d picture in miniature" uses arrows of about 20–25 px.**
   - These are the ball stepping along u, the growing orange floor-speed arrow and the violet Ω × u. They are invisible at 640 px, yet S7 is the step that makes piece ② click.
   - Fix: a 300-px inset of the s26d picture, or zoom the disc for S7–S8.
7. **S7 · v5 37:37–38:31 (s26a1). Collisions around the painted arrow.**
   - The painted arrow B starts on the hub, so its head and the "B" label sit on the "Ω" label (37:37–37:59).
   - From 38:09 the "Ω × B" label at the left edge is crossed by the white dashed sum arrowhead. The teal "rider's change" arrow has no label.
   - Fix:
     - Start B at (1.0, 0.4) m, as the storyboard says.
     - Put "Ω × B" beside the middle of its arrow.
     - Label the teal stub "rider's change".
8. **S8 · v5 38:25–38:31 (s26a1 S10). The rule's second line touches the brace note.**
   - The rule wraps, so the "outside watcher" brace note touches line 2's (dB/dt) numerator. The "rider" brace also repeats the subscript.
   - Fix: set the rule on one line at 68 px (it fits in x 1060–1840), or leave a 24-px gap. Drop the duplicate "rider" brace.
9. **S9 · v5 31:50–31:56 (s23 S7) · P2 04:03–04:09. Labels on the map are hard to read.**
   - "k × u = (−5, 0, 0)" is faint violet on the dark map and is crossed by the dashed −k × u arrow.
   - "−k × u = (5, 0, 0)" runs off the map's right edge.
   - Fix: give the labels a dark halo and put them above and below their arrows, inside the map.
10. **S10 · Size.** v5 is 153.6 MB, against a budget of 120 and a hard cap of 160. Accept it (the user saw the WARN before), or re-encode at crf 24.

## COSMETIC
- **C1 · 45:33–45:40 (s27c).** The "along" leg splits the "45°" label (4|5°). Move the label left of the r arrow.
- **C2 · s27b.**
  - 45:14: the gold link starts on the "m" of "2.5 m".
  - 45:22: the rider glyph is ≈ 30 px.
- **C3 · 47:03–47:12 (s27d).** "centrifugal ≈ 0.034" sits beside the g bar, not beside its slate sliver, and has no unit. Place it at the sliver, with "m/s²".
- **C4 · 49:44–49:54 (s27g).** The equator and pole links cross each other. Put "poles" on the top row, or start the pole link on the right.
- **C5 · 50:30–50:48 (s27g).** "polar radius" and "equator radius" cross the ellipse outline.
- **C6 · s26f → s27 brace numbering.** At 41:59 it reads ②, ①; at 42:27 it reads ①, ②. Use one order.
- **C7 · P2 02:57–03:00 (s01d).** "same speed all the way round" sits on the grid's bottom border.
- **C8 · P2 00:10–00:12 (s00).** The source line is ≈ 20 px under "uses it".
- **C9 · Captions under 1 s.**
  - v5: 00:39.60 "In weather,", 04:57.35 "By Pythagoras,", 59:28.38 "Near its peak,".
  - P2: 00:00.30 "In this video,", 31:21.25 "Near its peak,".
  - P1: the same two as v5's first two.
  - Merge each with the next cue.
- **C10 · v5 collisions.** At 15:25 (s18) "(3, 0, 0)" sits on the teal arrowhead. At 24:31–24:39 (s21d) the r tag sits on F's tail. At 31:48.5 the s23 map corner dips into the caption band for 0.5 s.
- **C11 · P1-C1 and P1-C2 still open.** "a × b" appears at 00:12 before it is spoken. The s50 mini-wall axis letters are ≈ 40 px.

## House-style conformance
- **Conforms:**
  - titles and hooks for v5, P1 and P2;
  - spoken bridges ("Now let's go back to the Coriolis push");
  - goal before calculation ("Before we write down what each one sees, we need one rule", "How big is it on Earth?");
  - reveals on their words;
  - gold picture-to-number links (2.5 m, 4505 km, sideways part);
  - beats after worked numbers;
  - colours: Coriolis violet, g brown, centrifugal slate, negative rose;
  - source lines only on Blue Marble, VIIRS, ERA5 and WGS-84 frames (the SVG cross-sections in s27f/s27g and the disc scenes have none, which is correct);
  - no badges or equation numbers;
  - −16 LUFS;
  - the correct end card for each movie.
- **Departures:**
  - M4 (boxes);
  - M2 (empty half);
  - M1 and M3 (text collisions or misreadings);
  - S3–S6 (pictures under the legible size).

## Overall
- **v5: FIX** — 4 Must (M1–M4), 10 Should, 11 Cosmetic. All TSX only except S1 (storyboard text). No words change, so no TTS run is needed. Re-render the affected ranges: 29:15–30:18, 37:28–49:33, 59:47–59:54, 68:18–68:27.
- **Part 2: FIX** — inherits M1, M2 and M3 (3 Must), S1–S9 at the P2 times, and C2–C9. Re-cut from the fixed v5 pieces.
- **Part 1: PASS → `qa_pass`.**
  - Every review-1 Must is fixed.
  - qa is 13/13 PASS and the caption band is clean.
  - The frames match v5 within 0.26/255 mean.
  - M4 does not apply: Part 1's s22w has no frames.
  - Only C9 and C11 remain.
  - The user watches it before `/approve-movie`.
- After the v5 fixes: run review 3 on s22w, s26a1, s26e, s27b–s27f, s37 S7 and s47 S9, ≥ 1 frame per sentence, then re-check P2 at the same scenes.

Disk: C: 56 GB free at the start, 57 GB at the end; G: 515 GB free at the start and the end. Review frames: 99 MB, 284 PNG, on G: (not committed).

---

# ch00_weather_basics v4 — review 1 (2026-10-29, fresh eyes, frames only) — FIX

Movie `movies/out/ch00/ch00_weather_basics/1080.mp4` (50:54, 143.0 MB, commit a3e6a23). Frames in
`G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/review_v4_1/`. Interim notes (saved first so
they survive an interruption); the U-WB table and verdict follow below when complete.

## Interim findings, s05–s25 and s47–s61 (frames looked at)
- 03:25–04:03 s05: 3-D 1 m² column from the ground to 30 km, edges "1 m", "area 1 m²", p₀ = ? before the number (goal
  first), m = p₀/g ≈ 10 300 kg, seven cars. U-WB-07 done.
- 08:17–08:59 s13: 3-D slab with "1 m", "Δz", p(z), p(z+Δz), weight. U-WB-08 done. 08:59–09:05 "1 m²" sits on top of
  the "1 m" edge label (collision); right half empty 08:54–09:05 (QA halves WARN 534.5–542.5).
- 09:05–09:53 s14: V = 1 m² × Δz → m = ρV = ρ × 1 m² × Δz → W = mg = ρgΔz × 1 m², the × 1 m² struck in every term →
  p(z) − p(z+Δz) = ρgΔz. U-WB-09 done. The W line is drawn in dim orange (low contrast at 640 px).
- 12:00–13:21 s18: g, R, T grouped → H = RT/g → ∂p/∂z = −p/H; units cancel to m; tangent reaching 0 at H; colder/warmer
  columns. U-WB-10/11/12 done. 12:14–12:41 the keyword "scale height" collides with the "g" of RT/g (Must fix);
  12:30 unit row shows stray placeholder dashes before the units appear; 12:08 right half nearly empty (QA WARN 728–732.5).
- 13:21–14:50 s18b: purpose first ("how deep is our air?"), R/T/g named one by one, H ≈ 8.43 km, then the uniform box
  at ρ₀ = 1.225 "sea-level density (gas law)", ρ₀gh = p₀, h ≈ 8.43 km, gold link to H. U-WB-13 done, clean.
- 14:50–16:52 s19/s19b: "assume: same T → H fixed", "a simplification: real T changes", divide by p, d ln p/dp = 1/p,
  chain rule, ∫ with limits, ln p − ln p₀ = −z/H, ln(p/p₀), e ≈ 2.72, p = p₀e^(−z/H). U-WB-14 done. But the large
  p(z) axes stay empty for ~70 s while the ln p inset sits on top of them and over the "pressure (hPa)" label (QA WARN
  942–952); 16:10–16:16 the inset label "z, p" collides with the line "ln p − ln p₀ = −z/H" (Must fix).
- 16:52–17:32 s20: z = H marker, e^(−H/H) = e⁻¹ = 1/e ≈ 1/2.72 ≈ 0.37, "falls to 37 % every 8.4 km", 1013 → 373 → 137 hPa.
  U-WB-15 done. Numbers check: 1013·e⁻¹ = 372.7, 1013·e⁻² = 137.1.
- 17:32–18:34 s20b: 1 km / 8.43 km ≈ 0.12 "p held fixed", 1 − e^(−1/8.43) ≈ 0.11 "p shrinks", "11 % of the pressure at the
  bottom of that kilometre", 1013 → 900 → 800, bars −113 / −101 hPa. U-WB-16 done; numbers check (0.1186, 0.1119,
  1013·0.1119 = 113, 899.6·0.1119 = 101). Second bar has no "2nd km" label (cosmetic).
- 18:34–19:27 s20c: 3-D column of ten ≈ 1000 kg slabs, bottom ≈ 900 m, ninth top ≈ 19 km, no sharp top, mattress
  Like/Unlike. U-WB-17 done (much clearer). 19:13–19:25 the mattress icon overlaps "like: foam mattresses" and the gold
  link crosses "no sharp top" (Should fix).
- 19:27–20:23 s20d: ln(p/p₀) = −z/H → z = H ln(p₀/p) (with ln(1/x) = −ln x), p₀/p = 2, ln 2 ≈ 0.69, z ≈ 5.8 km, marks
  500 hPa at 5.8 km and 250 hPa at 11.7 km. U-WB-18 done.
- 20:23–21:21 s21: source line present. Balloon: white balloon, small gold gondola, a gap above a thin pale-gold trail;
  the gondola and the trail are both gold, so they still read as one line at 640 px (U-WB-21 partly).
- 21:21–22:37 s22: p₀ "weight of all the air", p "weight above z", share above = p/p₀, share below = 1 − p/p₀, standard
  atmosphere defined + source line, 5.5 km p ≈ 505 hPa, 1 − 505/1013 ≈ 0.50, 16 km 90 %, 31 km. U-WB-20 done.
- 22:56 s23 and 23:52 s24: the source line is drawn across the x-axis title "temperature (°C)" (collision, Must fix).
- 23:52–24:24 s25: Singapore profile, globe with ERA5 November zonal-mean temperature ring and a titled colour bar,
  source lines. The chart's source line again runs through "temperature (°C)" (Must fix). 24:22 the polar camera key
  shows an oblique cut-away ellipse that is hard to read (Should fix).
- 24:26–25:44 s26: tilted 3-D plate of the real MODIS Terra morning image, sun shafts, pan icon, thermals, the parcel grows
  and goes red → pink → blue as it rises, Trappes 12 UTC sounding rod "−10 °C per km", cross-fade to the MODIS Aqua
  afternoon; source lines change with the image. U-WB-24/25 done (big improvement).
- 42:30 s47 (ERA5 slice): colour bar titled, source line, particles, density callback, slope triangle "15 km / 1 km".
  PHYSICS: the slice along 48.5°N meets the "cold front" at ≈ 12.75°W (W70), west of the 18 UTC low centre (48.8°N,
  11.7°W), while the s49 map's cold front at that hour starts at 48.0°N 6.7°W and runs south-west — it never crosses
  48.5°N. The feature labelled "cold front" in s47 is not the cold front of the s49 map (it lies on the far side of the
  low, where the bent-back/occluding zone is); the 1:15 slope and the vertical lower part (verifier note) come from that
  feature (Must fix).
- 42:30–43:22 s48: warm front near Brest slopes up towards the east (cold side), "50 km / 1 km", "true scale".
  43:07–43:21 "Brest" and "from S" overlap ("Brestom S") (Must fix); the gold frontal outline ends in a Z-shaped zigzag at
  the ground (Should fix).
- 43:22–44:14 s49/s50: 850-hPa map, titled colour bar, "≈ 1.5 km up", warm tongue, fronts attached to the tracked L, wind
  arrows; cold-front triangles on the warm side, warm-front half circles on the cold side (correct). The map's source line
  is dark text on the map (low contrast, Should fix).
- 49:21–50:53 s60/s61: recap pictures; house end card (three keyword lines, notebook icons, silent hold) correct.

## Findings, s00–s03, s27–s46, s51–s59 (added after the resume)
- 00:01–00:11 s00: title "Weather / basics / made easy / and how meteorologists / read the weather", house pattern,
  source lines on the right-hand animation. U-WB-01/02 done.
- 00:11–00:23 s01: the globe grows and turns. At 00:21 its canvas cuts it off with a straight-edged rectangle (left, right and top).
  The same happens at 02:14 (s03) and 26:54–27:43 (s27b, octagonal corners). Must fix.
- 00:23–01:36 s02: at 00:45 a quarter wedge opens and a bold orange radius "6371 km" runs from the centre to the surface (U-WB-04 done).
  A strip of cloud texture shows behind the cut on the right (artefact). At 00:35 the magnifier says "× 40", a number that is never
  spoken; the movie later says × 50. 00:55–01:30 shows the desk globe (30 cm, radius 150 mm), 12/6371 ≈ 0.002 with "weather
  layer" / "Earth's radius" pointers, "same shrink", 0.002 × 150 mm ≈ 0.3 mm, 3 sheets of paper and × 50 (U-WB-05 done).
- 01:36–02:37 s03: composition bar, molecule box, a dashed parcel on the globe and a flight in. At 02:23 a hard cut with a
  visible brightness seam leads to the three.js Brittany terrain: a teal 3-D box "air parcel" with a trail, ERA5 wind arrows,
  thermometer and droplet, and a source line. At this camera height the terrain is very blurred and no place name (Brittany, Brest,
  Channel) is shown. The box stays at screen centre, so it reads as "the camera moves". At 02:36 the edge of the terrain
  tile is visible. U-WB-06 partly.
- 25:44–26:19 s27: a cloud-free Blue Marble globe spins east, then turns to the pole, and cross-fades into the ERA5 2-m q globe
  with a titled colour bar "specific humidity, 2 m up, g/kg" and a source line. U-WB-26/27/28 done.
- 26:19–27:45 s27b: e ≈ 1.61 q p, each letter named, "this e: vapour pressure, not 2.72", 1-kg boxes of air and vapour,
  29 vs 18, 29/18 ≈ 1.61, "molecule share = 1.61 × mass share", q = 0.020, p ≈ 1000 hPa, e ≈ 32 hPa. U-WB-29 done, and
  the numbers check (28.96/18.02 = 1.607; 1.61·0.02·1000 = 32.2). Collisions: the gold pointer arrows run through "vapour
  pressure" and "kg of vapour", and "29/18" sits on "1 kg of vapour" and on the "1.61 × mass share" line (27:05–27:21). Must fix.
- 30:02–30:47 s31: T and Td lines meet at ≈ 1.5 km, 12 ÷ 8 ≈ 1.5 km, real cumulus image. Its source line is dark text on
  the satellite image (low contrast). 30:47–31:24 s32: u = 8, v = 6, |v| = 10 m/s on a Brittany map with a source line.
  31:24–32:08 s33: compass and 233°, correct sense. 32:08–32:48 s34: 1° = 60 nautical miles, 1852 m, 0.51 m/s, 19 kt.
- 33:23–34:17 s36: locator with scale bar, TimeGraph with the 1991–2020 band, source lines. At 34:14 the keyword "climate: what
  you expect · weather: what you get" is printed on the month tick labels (Must fix). The y axis has no °C label.
- 34:17–35:50 s37/s38: station dots, rotation, ERA5 2-m temperature globe with a titled colour bar. At 35:31–35:42 a grey
  disc artefact shows under the globe's south edge. 35:50–36:30 s39: surface pressure globe with colour bar, Tibet < 600 hPa,
  close-up. At 36:26 the close-up's source line overlaps the "Himalayas" label.
- 37:28–38:52 s41/s42: MSLP globe, titled diverging colour bar, isobars, H/L, Ciarán 956 hPa; GFS 27 Oct 2026 map with
  its own source line. 38:52–40:08 s43/s44: satellite + isobars and 10-m wind arrows. The wind turns cyclonically round the
  low (anticlockwise seen from above, NH) and clockwise round the high, and the SH thumbnail is reversed. Physics correct.
- 40:08–40:54 s45: 2-m temperature globe with colour bar, then the 850-hPa map with "polar maritime" / "tropical maritime". The
  four names said at 40:32–40:42 (polar, tropical, maritime, continental) are not on screen. At 40:45–40:48 the right half is
  empty apart from the colour bar (Should fix).
- 40:54–41:26 s46: 850-hPa map + T graph, "front ≈ 100 km". At 41:00–41:13 the top edge of the frame cuts off the colour-bar
  title "850-hPa temperature" (Must fix). The old gold transect (builder deviation) is accepted.
- 44:14–46:16 s51–s53: sun beam 1 m / 2 m, 1 m / cos 60° = 2 m, 2-m T globe; MSLP belts, ITCZ; mean winds. At 46:05–46:16 the
  gold pointer lines from "westerlies" and the trades labels cross each other and run through the label text (Must fix).
- 46:16–49:21 s54–s59: MODIS afternoon image, Brest, UTC keyword, isobars, track, low 956 hPa. TimeGraphs show 997 → 962 hPa
  (−35 hPa in 13 h, +14 hPa in 5 h), 13 m/s from 155° (SSE) → 18 m/s from 204° (SSW), 12.0 → ≈ 14.5 °C, 19 m/s from 221°
  → 23 m/s from 271°, 23.2 ÷ 0.514 ≈ 45 kt and −2 °C. Every frame has a source line. The wind veers at both fronts, which is
  correct for the NH. At 48:52 the 45 kt CalcStack sits on the hPa graph's tick labels (Should fix).
- Not re-reviewed frame by frame (unchanged since v3 fix 3 apart from beats): s04, s06–s12, s15–s17, s28–s30, s40.

## Captions and QA
- en.vtt: 759 cues, all ≤ 2 lines × 42 chars, max 16.8 cps. One cue is under 1 s (43:13.775–43:14.675 "In this slice,", 0.9 s).
- qa.json: 12 gates PASS and halves WARN (534.5–542.5, 728–732.5, 942.5–952, 1052.5–1057, 1115–1122, 1168–1172 s). In the
  frames these are the first 4–10 s of s14, s18, s19b, s20b, s20c and s20d, with only the left picture on screen.
  source_check.json PASS; it is a static registry check only and does not test contrast or overlap.

## U-WB items (v4 timestamps)
| item | v4 time | status | note |
|---|---|---|---|
| U-WB-01 | 00:00–00:11 | done | opening kept |
| U-WB-02 | 00:03 | done | "and how meteorologists / read the weather" |
| U-WB-03 | 00:11–01:36 | partly | turns and zooms; globe clipped by a rectangle at 00:21; no change of spin direction seen |
| U-WB-04 | 00:45 | done | bold orange radius from the centre; texture strip artefact behind the cut |
| U-WB-05 | 00:55–01:30 | done | every factor named, same shrink, 0.3 mm, 3 sheets |
| U-WB-06 | 02:12–02:37 | partly | 3-D box rides ERA5 wind over three.js terrain; blurred, unnamed place, seam at 02:23, tile edge at 02:36 |
| U-WB-07 | 03:10–04:03 | done | 3-D 1 m² column to 30 km |
| U-WB-08 | 08:13–08:54 | done | 3-D slab, 1 m edges; "1 m²" over "1 m" at 08:59 |
| U-WB-09 | 09:05–09:27 | done | V → m = ρV → W = mg, × 1 m² struck |
| U-WB-10 | 12:00–13:21 | done | 3-D column with 1 m base |
| U-WB-11 | 12:24–12:42 | done | units appear as spoken (stray dashes first) |
| U-WB-12 | 12:42–13:21 | done | why H, tangent to 0 at H, warmer → bigger H |
| U-WB-13 | 13:21–14:50 | done | purpose first, R/T/g named, 1.225 explained |
| U-WB-14 | 14:50–16:52 | done | assumption said, chain rule, integral with limits |
| U-WB-15 | 16:52–17:32 | done | e⁻¹ ≈ 0.37, "falls to 37 %" |
| U-WB-16 | 17:32–18:34 | done | 12 % vs 11 %, "of the pressure at the bottom" |
| U-WB-17 | 18:34–19:27 | done | ten equal-mass 3-D slabs |
| U-WB-18 | 19:27–20:23 | done | z = H ln(p₀/p), ln 2, 5.8 km |
| U-WB-19 | 20:23–21:21 | done | source line |
| U-WB-20 | 21:21–22:37 | done | share below = 1 − p/p₀, 505 hPa → 0.50 |
| U-WB-21 | 20:35–21:14 | partly | gap present; gondola and trail both gold |
| U-WB-22 | 23:54–24:24 | done | source lines (but colliding with the axis title) |
| U-WB-23 | 23:54–24:22 | done | half-screen globe, zoom to Singapore, titled colour bar, source; polar view at 24:22 confusing |
| U-WB-24 | 24:26–25:44 | done | real MODIS morning/afternoon plates, real sounding |
| U-WB-25 | 25:06–25:15 | done | parcel grows, red → blue |
| U-WB-26 | 25:44–26:00 | done | cloud-free, spin then towards the pole |
| U-WB-27 | 26:00 | done | continuity into the q globe, source |
| U-WB-28 | 26:00–27:45 | done | titled colour bar, source |
| U-WB-29 | 26:19–27:45 | done | every symbol and 1.61 explained (label collisions) |
| U-WB-30 | 33:52–40:54 | done | source lines and colour bars on all listed data frames; the reanalysis globe turns |
| U-WB-31 | 41:26–43:22 | partly | real ERA5 slice with moving particles and colour bar; the "cold front" in the slice is not the map's cold front (M1) |

Counts: 27 done, 4 partly, 0 not done. Rules: R1 done (weak contrast on map frames), R2 done, R3 done, R4 partly (globe
clipping), R5 done.

## Builder deviations
- s03 three.js terrain instead of Cesium: acceptable, but the result needs the S-fixes below.
- s25 polar camera key: acceptable; the 24:22 cut-away view needs a cleaner framing.
- s46 old gold transect: acceptable.
- s47–s48 isotherms not drawn: acceptable (anomaly colours carry the idea).
- 143 MB: over the 120-MB budget, under the 160-MB cap; acceptable for a 51-min movie.

## Must fix
1. 41:26–42:30 s47 physics. The 48.5°N slice meets the "cold front" at ≈ 12.75°W (W70), west of the 18 UTC low
   (48.8°N 11.7°W). The s49 map's cold front starts at 48.0°N 6.7°W and runs south-west, so it never crosses 48.5°N. Fix:
   take the cold-front side view on a line that crosses the map's cold front, recompute W70 and the slope, and let s47 S5
   follow the new number. Candidate lines: the fronts.json transect centred at 45.5°N 8.4°W, or a west–east line at about
   46.5°N. Keep the 48.5°N slice for the warm front near Brest (s48).
2. Text collisions:
   - 12:14–12:41: "scale height" sits under the g of RT/g. Move it below the fraction.
   - 16:10–16:16: the inset label "z, p" hits "ln p − ln p₀ = −z/H". Move the equation right or the inset down.
   - 22:56, 23:52 and 23:54–24:22: source lines run across "temperature (°C)". Raise the axis title or move the source line below it.
   - 26:32–27:43: gold arrows run through "vapour pressure" / "kg of vapour", and "29/18" sits over "1 kg of vapour". End the arrows
     at the label edge and put 29/18 below the boxes.
   - 34:14: the keyword sits on the month ticks. Move it above the graph.
   - 43:07–43:21: "Brest" collides with "from S". Move the wind label right of Brest.
   - 46:05–46:16: the pointer lines cross each other and run through the trade-wind labels. Re-route the links so they do not
     cross text or each other.
3. 41:00–41:13: the top edge cuts off the colour-bar title "850-hPa temperature". Move the bar inside y ≥ 40.
4. 00:21, 02:14, 26:54–27:43: the canvas clips the globe (straight or octagonal edges). Enlarge the canvas or keep
   the globe inside it while zooming.

## Should fix
1. The right half is empty for 4–10 s at the start of s14 (08:54–09:05), s18 (12:00–12:08), s19b (15:42–15:52), s20b (17:32–17:37),
   s20c (18:34–18:42) and s20d (19:27–19:32). Carry over the previous scene's last line, or show the scene's first keyword at once.
2. s03 02:23–02:37:
   - soften the cut (cross-fade, match brightness);
   - add the labels "Brittany", "Brest" and "English Channel";
   - frame the camera so the tile edge never shows;
   - raise the resolution or the camera height so the terrain is not a blur;
   - let the box visibly travel across the frame for part of the shot.
3. s45 40:32–40:48: show "polar · tropical" / "maritime · continental" as the four names are said.
4. Source lines drawn as dark text on images (30:46, 30:58, 41:00, 43:24, 47:10): use the muted light text on a darker
   band below the picture, as on the globe frames.
5. s48 43:00–43:21: replace the Z-shaped end of the warm-front outline with one smooth line, and explain or drop "true scale".
6. 00:35 "× 40" in the magnifier: either say it or show × 50 to match the narration. At 00:45 hide the texture strip behind
   the wedge.
7. s20c 19:13–19:25: move the mattress icon off "like: foam mattresses" and route the gold link round "no sharp top".
8. s13 08:59: separate "1 m²" from the "1 m" edge label. s21: give the gondola a non-gold colour (U-WB-21).
9. s25 24:22: replace the oblique polar cut-away with a view where the ring reads as a cross-section.
10. Small items:
    - 35:31–35:42: remove the grey disc under the globe.
    - 36:26: move the source line off "Himalayas".
    - 48:52: move the 45 kt CalcStack off the tick row.
    - s36: add "°C" to the y axis.
    - s20b: label the second bar "2nd km".
    - 12:30: remove the placeholder dashes.

## Overall: FIX
Nearly all the user's feedback is in: 27 of 31 items are done and 4 are partly done. The new teaching beats (s14, s18–s20d,
s22, s27b) read well, and their numbers check. The movie is not yet `qa_pass`. The s47 cold-front slice does not match the cold
front on the s49 map (M1). About a dozen text collisions and clipped elements show at 640 px (M2–M4). After the fixes, re-render
the touched scenes and run review 2 with one frame per second through s03, s27b, s46–s48 and s53.

Disk: C: 55 GB free at the start and the end. G: 512 GB free at the end (515 GB earlier in the day). Review frames are on G:
(not committed).

---

# ch00_vectors_index_notation — review 3 (fresh eyes, after fix loop 2)                    2026-10-29

**Movie.** `movies/out/ch00/ch00_vectors_index_notation/1080.mp4` (commit 07d1910 + the 13:11 render): 2115.20 s (35:15.2),
72.38 MB, 530 cues. The narration ends at 2112.70 s, then a 2.5-s hold. This is a read-only review: the only file changed is this section.

**Frames.** 491 files, 224 MB, in `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_vectors_index_notation/review3/`:
- `sent/`: 382 full-size PNGs, one 0.4 s before the end of every sentence, plus every scene start and the end hold.
- `sheets/`: 43 labelled 3 × 3 sheets, every tile at 640 px (the legibility test).
- `s12d/`: 13 full frames through 11:28–12:43, two 3× zooms of the sea point, and a 14-frame strip of the right-hand reveals.
- `chk/`: 30 full frames and crops, at every review-2 item.
- `audio/`: the splice comparison clips.

**qa.json (not re-run): 13/13 PASS.**
- duration, size, codec;
- black 0, frozen 205 (all narrated), content;
- **halves PASS** (the s21 WARN is gone);
- loudness −16.0 LUFS / −3.5 dBTP, flashes 0/s;
- captions 530 = script, subtitles 530 = VTT;
- physics 70 hashes, equations 35.
- `vscan.log`: 2115 frames, 0 with pixels in the caption band or at the edges.

## N-M1 (s12d), checked by hand
- **Numbers** (`vi.json → storm.sea_pt` = 45.0 N, 2.75 W):
  - u_g = (17.823, 21.015) → (17.8, 21.0); |u_g| = 27.56 m/s, heading 40.3° (towards NE).
  - u10 = (−2.124, 13.408) → (−2.1, 13.4); |u10| = 13.57 m/s, heading −9.0° (towards N by W).
  - u_ag = u10 − u_g = (−19.947, −7.607) → (−19.9, −7.6). The sum on screen is right.
  - The real wind is turned 49.3° to the left of u_g, which is towards the low (NH). The builder's "about 45–49°" is right.
- **Isobars** (`storm.isobars["2023-11-01T18"]`, my own segment bearings):
  - The 1000-hPa isobar passes 8 km from the point. Within 150 km its segments head 31–41° (mean ≈ 37°).
  - The 996 and 1004 isobars run at 29–56°. All three are straight and parallel here, and the low lies to the NW.
  - So u_g (40.3°) lies along the isobar within about 3°. The builder's on-screen mean of 1.9° is consistent with that.
  - The CHECK VI45 text claims a "≤ 8°" spread. I measure 10° over ±150 km (cosmetic, below).
- **On screen** (3× zoom at 12:35.8):
  - The orange arrow lies on the 1000-hPa line from tail to head. It is 194 px long (7 px per m/s × 27.6 = 193) at a screen bearing of 39°.
  - The teal arrow is 94 px (95 expected) at −8°. It visibly crosses towards the next, lower isobar on the low side.
  - The warm-white ageostrophic arrow runs from tip to tip at 249° (true 249.1°).
  - The twelve faint neighbours show the same construction.
  - The picture now says what the words say. **N-M1 is fixed.**
- **New narration vs the picture:**
  - S6 "Over the Bay of Biscay, south of Brittany": the point is in the Bay, about 300 km south of the labelled Brest. Correct.
  - S7 "minus two point one towards the east, so a little west": the teal arrow leans slightly west. Correct.
  - S10 "large": 19.9 and 7.6 against 13.4. Correct.
  - S11 "turns it across the isobars, towards the low pressure": correct for the direction (see the advisory below).
  - **One timing fault (S3-1).** The three tuples appear at their sentence starts, not on their numbers:
    - "(17.8, 21.0)" at 11:56.9; spoken at about 12:00.5, so 3.6 s early.
    - "(−2.1, 13.4)" at 12:06.8; spoken at about 12:09.2, so 2.4 s early.
    - "(−19.9, −7.6)" at 12:29.4; spoken at about 12:32.2, so 2.8 s early.

## Audio re-splice, evidence reviewed
- **`splice_loud.json`.**
  - All 20 spliced sentences are within 0.83 LU (integrated) of their neighbours. The worst is s12d S10 at −0.83.
  - Short-term dS is −1.9…+1.4 LU.
  - One row is flagged `ok: false`: s14 S4 at 18:55.3, dS −1.9 LU. I measured the movie's short-term loudness through that sentence with ebur128: −16.7…−17.6 LUFS while speaking, and no step at either edge. Accept.
- **`stt.json`.** 20/20 letter checks pass:
  - "bold you", "U-bar", "U-prime", "Q1", "velocity sea", "d sub i", "small t";
  - "seventeen point eight", "minus two point one", "minus nineteen point nine", "towards the low".
  - The other differences are homophones ("blue", "the C", "breast").
- **The final MP4 carries this mix.** I correlated 8-s windows of the movie with `v3/mix/narration_music.wav` at 716, 749 and 1135 s:
  - r = 1.000 / 0.999 / 1.000;
  - lag 0 ms;
  - gain −0.02…−0.03 dB.

## Review-2 items — status
| item | status | evidence (new times) |
|---|---|---|
| N-M1 s12d geostrophic arrow crosses isobars | **fixed** | 11:48–12:43; numbers and angles above |
| S-new-1 s21 parcel layout | **fixed** | 24:20: the right half carries "air parcel · moves with the wind" from the cross-fade (halves PASS). The S4 line u_j ∂T/∂x_j stays ≥ 84 px, with the expansion below (24:54). "wind" and "north", "u₁" and "east", and "u₃ ≈ 0.1 m/s" are apart. The box clears Brest (24:36). Residual: "up" sits on the box edge (C) |
| S-new-2 s23 box on arrowhead, box out of field | **fixed** | 26:18–26:57 |
| S-new-3 s09 link on "w", crossing "clouds" | **fixed** | 5:13–5:27: the head ends beside "w" |
| S-new-4 s12h links through "ū: average u′: anomaly" | **fixed** | 16:41–16:55: the links run below the keyword line to "(−3.7)" and "(−5.0)". Residual: they cross each other and the map's lower row (C) |
| S-new-5 s12i "û − c", "−c" on the arrowheads | **fixed** | 17:28–17:49 |
| S-new-6 s11 link through "along coast", "north" on the edge | **fixed** | 7:05–7:18 |
| S-new-7 s12c label collisions | **fixed** | 10:47–11:26. Residual: "isobars" sits on the top isobar (C) |
| S-new-8 s31 ticks, keyword gap | **fixed** | The bar spans the map (−213…+161 km from Brest, `ColourBar lo/hi` from the crop), and the ticks sit at their true positions (0 at x 693, label at 686). "a map of x₁" is about 100 px above "−200" |
| S-new-9 s33 globe without a colour bar | **fixed** | 33:26: "air temperature, 2 m up · °C" |
| S-new-10 s30 result line | **fixed** | 31:48: gold δ_ij u_j = u_i; keyword "swaps j for i" |
| S-new-11 source lines on data-free frames | **fixed** (one new mismatch) | No source line on s10 S1–S6, s15 S1–S4, s33 S4/S5/S8 or s34 S1. New: s33 S2 credits ERA5 for the SYNOP 9.3 m/s (S3-3) |
| S-new-12 s10 "6" near the source band | **fixed** | 5:38: ends at y ≈ 805; no source line |
| S-new-13 s27 spoken numbers | **fixed** | 29:04: "2.4 °C (17 UTC)", "8.2 °C (19 UTC)" |
| S-new-14 s08 / s12b long lines | **fixed** | 4:42 ends at x ≈ 1805. 10:00: the \|p + q\| line is on two lines and ends at x ≈ 1700 |
| C s04 arc through "Brest" | fixed | 2:18 |
| C s07 "e₁" touches "6" | fixed | 3:42 (crop) |
| C s12a colour bar gone in S13 | fixed | 9:01 |
| C s12g "m s⁻¹" | fixed | 15:27: "m/s" |
| C s15 "11.5" link crosses "e along the coast" | moved, not fixed | The link now runs through the "·" of "u · e" (S3-2) |
| C s20 grad T over "Brest" | fixed | 24:09 |
| C s22/s23 pixel blocks | fixed | 25:15–26:57: smooth |
| C s34 overlapping discs | open | 34:32–34:46 |
| C s35 end-card gaps | fixed | 35:12 |

**Count.**
- Must: 1/1 fixed.
- Should: 14/14 fixed (S-new-11 with one new mismatch).
- Cosmetic: 7/9 fixed, 1 moved, 1 open.

## Physics and numbers re-checked (unchanged scenes, sampled)
- s12c: Coriolis (6, −8) is 90° to the right of the wind (8, 6), as it should be in the NH, and is called "apparent".
- s12g: the wind veers going up, which means warm advection.
- s24/s25: grad T points SW, towards the warm air.
- s26: −3.7 → +3.7 K/h, with the sign flip written.
- s27: 2.9 K/h.
- s31: ≈ 120 km north in 1 h.
- El Niño: (−3.7) − (−5.0) = +1.3 m/s east.
- Index and δ_ij signs: s14, s17 and s29–s32 are all right.
- No sign or number errors.

## MUST fix
None.

## SHOULD fix
- **S3-1 · s12d 11:56.9–12:36 (house rule: reveals on their words).**
  - Problem: each tuple appears at its sentence start, 2.4–3.6 s before its numbers are spoken. The first place named ("Bay of Biscay") has no label.
  - Fix (TSX only, `S12D`):
    - show `(17.8, 21.0)` at `AT(k, 5, "seventeen point eight")`;
    - show `(−2.1, 13.4)` at `AT(k, 6, "minus two point one")`;
    - show `(−19.9, −7.6)` and its "m/s" at `AT(k, 9, "minus nineteen")`;
    - add a small "Bay of Biscay" map label beside the gold sea-point dot at `SS(k, 5)`.
- **S3-2 · s15 20:36–20:52 (S9–S11).**
  - Problem: the gold link from the map's "11.5" to "≈ 11.5 m/s" passes through the "·" of "u · e". At 640 px this hides the operator being taught.
  - Fix: route the curve below the "u · e = …" line and into "≈ 11.5" from the left at its baseline, or end it at "11.5" from below.
- **S3-3 · s33 S2 33:27–33:36 (attribution).**
  - Problem: the "components · length = 9.3 m/s" picture is the Brest-Guipavas SYNOP surface wind, but the source line reads "Data: ERA5 (Copernicus C3S) · 1 Nov 2023, 18 UTC · Brest".
  - Fix: give the recap a per-beat source. S2 gets "Data: Brest-Guipavas SYNOP (NOAA ISD) · 1 Nov 2023, 18 UTC". S1, S3, S6 and S7 keep ERA5.
- **S3-4 · s21 storyboard exaggeration (documentation only).**
  - Problem: the u₃ leg (0.1 m/s) is drawn about 50 px long, against about 260 px for u₂ (33.5 m/s). That is about ×60 beyond the stated "×2000 in distance".
  - Fix: add "vertical leg u₃ drawn ≈ ×60 against the horizontal legs (true size < 1 px)" to `s21.exaggeration`. Keep the screen badge-free.

## COSMETIC / advisory
- **s12d 12:35–12:43.** "m/s" sits only under the ageostrophic tuple. Put one "m/s" after the geostrophic tuple, or drop it.
- **s12d physics advisory** (no re-speak needed).
  - A 49° crossing over the sea is more than surface friction alone usually gives (typically 10–30°). Cyclonic curvature and the deepening storm also make the flow sub-geostrophic.
  - Add this to `honesty_notes`. If S11 is ever re-spoken: "Friction with the sea, and the storm's rapid changes, …".
- **Storyboard CHECK VI45 text.** Change "isobar bearing spread ≤ 8 deg over ±150 km" to the measured 10° (31–41° on the 1000-hPa isobar), or narrow it to ±100 km.
- **s12h 16:41–16:55.** The two lower links and the "+1.3" link cross each other and the map's lower row.
- **s12c 10:14–11:26.** "isobars" sits on the top isobar line.
- **s21 24:23–24:36.** "up" sits on the box edge.
- **s12i 17:21–17:49.** A track dot hides under the "L".
- **s34 34:32–34:46.** The ε-cloud discs overlap.
- **Captions under 1 s.** 14:11.9 "On the map,", 28:36.1 "Together," and 29:32.6 "eight o'clock.". Merge each with the next cue.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_vectors_index_notation (review 3) | 2115.20 s (35:15.2); narration ends 2112.70 s, then a 2.5-s hold | 72.38 MB (budget 120, hard 160) | 13/13 PASS (halves PASS; caption band 0/2115) | PASS: s12d u_g along the 1000-hPa isobar (≈ 3°), real wind 49° towards the low, sum exact; NH right-deflection, "apparent" Coriolis, veering → warm advection, grad T towards warm air | PASS: 35 present, no KaTeX errors | PASS with Shoulds: one link through "u · e" (S3-2) | PASS with a Should: s12d tuples 2.4–3.6 s early (S3-1) | PASS: 530 = script, ≤ 42 chars, ≤ 2 lines, max 16.71 cps, 3 cues < 1 s | PASS: 0 flashes, perceptual maps | n/a (house) | **PASS** → `qa_pass` |

## Overall: PASS (ch00_vectors_index_notation review 3 — 0 Must, 4 Should, 9 Cosmetic/advisory)
- **Fix loop 2 fixed the one Must.**
  - The s12d sea point at 45.0 N 2.75 W shows u_g on a straight isobar and the real wind crossing towards the low.
  - Every number checks by hand, and the narration matches the picture.
- **The rest of review 2 is done.** All 14 Shoulds are fixed. The audio splices are level and correctly spoken, and the movie carries that mix.
- **The four new Shoulds are small.**
  - S3-1, S3-2 and S3-3 are TSX-only and need no TTS run. Re-render 11:56–12:43, 20:36–20:52 and 33:27–33:36.
  - S3-4 is storyboard text.
  - None blocks `qa_pass`. Apply them with the next touch, or before publishing if the user prefers.
- **Next:** the user watches the movie before `/approve-movie`, including a listen at 12:00–12:43 (the new s12d sentences).

**Disk.**
- C: 55 GB free at the start and at the end.
- G: 512 GB free at the start, 513 GB at the end.
- This review wrote 224 MB (491 files) to G: under `…/review3/` and nothing to C:.

---

# ch00_derivatives_taylor — review 1 (fresh eyes, build 1, commit c87e959)                    2026-10-29

**What I looked at.**
- 415 frames, one 0.2 s before each sentence end, taken from the final `timing.json`.
- 47 labelled 3×3 sheets at 640 px per tile.
- About 40 full-resolution close-ups: the equations, every suspected collision, the title and the end card.
- Loudness in three places: a beat gap, speech, and the tail.
- Every number checked by hand against `data/dt.json` and `manifest.json`.
- All frames are under `G:/…/scratch/movies/ch00_derivatives_taylor/review1/`.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_derivatives_taylor (build 1) | 2798.77 s (46:38.8); narration ends 2796.25 s, then a 2.5-s hold | 105.80 MB (budget 120, hard 160) | 13/13 PASS | PASS on the maths, every number reproduced by hand. FIX on the teaching: s28/s29 use dI, đQ, đW and the first law without defining them; the s19 sideways term cannot be derived from what is said; s20 skips the reasoning for the sign | PASS: 40 present, no KaTeX errors, no labels, no book refs | **FIX**: 3 collisions hide or garble text (s32, s29, s35); "100 m/s" clipped (s16); maths past x 1840 (s16, s17, s31, s33); tiny inline fractions (s44, s45) | PASS at sentence level: every sampled number appears on its sentence; a few on-screen numbers are never spoken | PASS (QA: 689 cues = script) | PASS: thermal/balance maps, dashes plus colour, 0 flashes; the music bed sits ≈ 13 LU under speech | n/a (house) | **FIX** |

## Maths and physics, checked by hand (all PASS unless noted)
- **Derivative, s02–s03.**
  - (14.9 − 10.3)/2 = 2.3 °C/h.
  - The secant slopes are 7, 6.1 and 6.01, which tend to 6 = 2x at x = 3. The picture turns the secant into the tangent.
- **Partial derivatives, s06–s10.**
  - Toy fields: ∂T/∂x = −0.03 °C/km, ∂T/∂t = +3 °C/h; for xt they are t and x.
  - ERA5 centred difference: (4.51 − 5.69)/36.8 km = −3.20 °C/100 km. North: −1.38/55.6 km = −2.49.
  - The gradient arrow points to the south-west, towards the warm air. Correct.
  - ∂T/∂t = (8.23 − 2.38)/2 h = 2.92 °C/h. The pressure falls 988.3 → 983.3 hPa in one hour.
  - Radiosonde: (−11.8 − 12.3) °C over 5795 − 1533 m = 4262 m gives −5.65 °C/km. The lapse rate is +5.7 °C/km.
  - Mixed partial: (7.58 − 8.63 − 1.77 + 3.19) °C ÷ (36.8 km × 7200 s) = 1.40×10⁻⁹ °C m⁻¹ s⁻¹ (dt.json 1.4285×10⁻⁹).
- **Total differential and chain rule, s11–s21.**
  - s12: −0.32 − 0.50 + 1.45 = +0.63 °C.
  - s15: 100 km/h × −0.03 °C/km = −3 °C/h.
  - s16: 100 m/s × −3.2×10⁻⁵ °C/m × 3600 s = −11.5 °C/h. The plane's rate is −8.60 °C/h flying east and +14.45 °C/h flying west.
  - s18: 4262 m/900 s = 4.74 m/s, and −24.1 °C/900 s = −0.0268 °C/s = −1.6 °C/min.
  - s19 terms:
    - fixed place: −2.59 °C/43 200 s = −6.0×10⁻⁵ °C/s;
    - sideways: −3.27×10⁻⁵ °C/s (dt.json);
    - rising: 4.74 × −5.65×10⁻³ = −0.0268 °C/s;
    - rising share 99.66 %, so "more than 99 %" is right.
    - The drift is 7.81 km E and 14.61 km N, so 16.6 km towards the NNE (28°).
  - s20: the wind is (5.85, 33.49) m/s, so u·∇T = −3.68 °C/h and DT/Dt = 2.92 − 3.68 = −0.76 °C/h.
  - s21: 4262 m/−350 hPa = −12.18 m/hPa. Multiplied by −5.65×10⁻³ °C/m, this gives +0.0689 °C/hPa.
- **Exactness, s22–s29.**
  - ∮(y dx − x dy) round the unit square, anticlockwise, = −2 by Green's theorem. Correct.
  - Gas-law test: R = R, so p passes.
  - s25: −10/290 = −3.45 %. The exact value 290/300 − 1 = −3.33 %.
  - s26: H = 287 × 292.95/9.81 = 8570.5 m.
  - s28, three routes, 280 K, α × 1.5:
    - route 1: R × 93.3 K = 26.8 kJ/kg;
    - route 2: RT ln 1.5 = 32.6 kJ/kg;
    - route 3: R × 140 K = 40.2 kJ/kg;
    - Δη = R ln 1.5 = 116.4 J kg⁻¹ K⁻¹ on every route;
    - ΔI = 0, as it must be for an ideal gas at the same T.
  - s29: ∂c_v/∂α = 0 against R/α, so the heat fails the test. Divided by T it passes (0 = 0).
- **Taylor series, s30–s36.**
  - s31: slope (9.4 − 13.9)/(2.100 − 1.174) = −4.86 °C/km. 12.3 − 4.86 = 7.44, against 6.87 measured. 12.3 − 4.26 × 4.86 = −8.41, against −11.8.
  - s32: c = f″/2 and 3! = 6. The series is written correctly.
  - s33: 1, 1.1, 1.105, 1.10517 against e^0.1 = 1.1051709. The h = 1 partial sums are 2, 2.5, 2.667, 2.708.
  - s34: p₀ = 997.5 hPa, ρ₀ = 99 750/(287 × 292.95) = 1.186 kg/m³, and ρ₀g = 11.6 Pa/m, which is 8.6 m (28 ft) per hPa.
    - At z = 1006 m: line 880.4, plus the bend 887.3, against 887.0 measured.
  - s35: at z = 5627 m the steps are 342.6, 557, 511 and then the exponential's 517.3. With T̄ = 277.45 K the exponential gives 498.7, against 500 measured.
  - s36: tropopause 13.07 km, −66.3 °C.
- **Linearisation, s39–s43.**
  - L/(R_v T²) = 2.5×10⁶/(462 × 273²) = 0.0726 per K. With L(T) it is 6.4 % at 15 °C and 5.7 % at 30 °C.
  - For +1 °C the line gives 7.26 % and the exact value is 7.5 %. For +4 °C the line gives 29.0 % and the exact value is 33.1 %.
  - 1.26 × 7 % ≈ 9 %.
  - (240/5.67×10⁻⁸)^¼ = 255.1 K. 4 × 240/255 = 3.76 W m⁻² K⁻¹. The CERES 2001–2026 mean is 240.61 W/m² (manifest).
  - Exact Planck changes: 3.79 for +1 K and 39.9 for +10 K. The line gives 3.76 and 37.6.
  - Warming: 3.9/3.8 = 1.04 K with the Planck rate alone, and 3.9/3.2 = 1.22 K with the AR6 value.
- **Finite differences, s44–s46.**
  - The forward error is (h/2)f″ and the centred error is (h²/6)f‴; both derivations are correct on screen.
  - For sin at x = 1, h = 0.1: forward 0.49736 − 0.54030 = −0.0429; centred 0.53940 − 0.54030 = −0.0009.
  - Brest: forward −3.319, backward −3.086, centred −3.202 °C/100 km. The coarse grids give −3.17, −3.14, −2.24 and −0.98 at 36.8, 73.7, 147.4 and 221 km. The gentle grid is 3.3× too small.
- **Builder's adjusted numbers.**
  - s31 −4.86 and s34/s35 H = 8570.5 m are the data. No issue.
  - s22 "+140 m" is not the data (135.5 m). See S4.
- **Voice and house style.**
  - The opening sentence follows the pattern. The title says "made easy / and how meteorology uses them".
  - The maths-tutorial ending is word for word, which is correct for a maths movie. There are no headings, boxes, badges, equation labels or book references.
  - "Air parcel" is defined in s20. No "clearly" or "obviously".
- **Music.** I read the levels; I did not listen to the score.
  - A beat gap at 65.1 s measures −30.3 LUFS, against −16.9 LUFS for the neighbouring speech. The bed is well under the voice.
  - The two gentle wind beds are ducked.
  - The "tangent-glide" style itself needs the user's ear.

## Must fix
1. **s32 30:05–30:47: overlapping text.**
   - Problem: the underbrace label "the bend" sits on top of "d/dh(c h²) = 2c h". From 30:23 the keyword "Taylor series" is printed over "h³/3! f‴" and "3! = 3×2×1 = 6", and neither can be read. Close-up `close/f_1831.9.png`.
   - Fix: start the CalcStack 60 px below the brace label, and put "Taylor series" under the full series at 30:46, not over the h³ line.
2. **s16 14:41–14:52: clipped label.**
   - Problem: the plane's speed label is cut to "100 m/" by the map edge, because it moves with the plane. The result line "dT/dt ≈ +2.9 − 11.5 = −8.6 °C/h" runs to x ≈ 1895. s17 has the same overflow at 15:12–15:31 ("≈ +14.4 °C/h" at x ≈ 1897).
   - Fix: clamp the speed label inside the map (flip it to the left of the arrow once x > 900), and set the s16/s17 CalcStack at 84 px from x 1060 so it ends before 1840.
3. **s28–s29 25:23–27:57: undefined symbols.**
   - Problem: "dI = đQ + đW" is on screen for 67 s, but I, W and the barred đ are never said or defined. s29 then states "đQ = c_v dT + p dα" without saying where it comes from. A first-time viewer meets the first law and the inexact-differential notation unexplained, which breaks "every new term defined".
   - Fix: add two sentences in s28 S1 and re-run TTS for that scene. For example: "The first law of thermodynamics says the change in the internal energy, d I, equals the heat added, plus the work done on the air. The d with a bar through it means a small amount, not the change of anything." In s29 S1 add: "Warming the air at a fixed volume takes c v d T, and the air does work p d alpha as it expands." Or drop the equation from s28 if the scene should stay picture-only.
4. **s29 27:45–27:57: the label reads as a minus.**
   - Problem: the orange route line runs straight through its label, so it reads "Δη = −116" with a strike. A viewer sees a negative entropy change on route 1. Close-up `close/h_1670.png`.
   - Fix: lift the label 50 px above the horizontal leg (as for the kJ/kg labels), or end the leg before the label. Add the unit "J kg⁻¹ K⁻¹" once.
5. **s35 33:01–33:46: a spoken number is hidden.**
   - Problem: "balloon 500" is printed on top of the gold "343" label of the line, so the number the narration says at 33:01 cannot be seen. Close-up `close/h_1985.png`.
   - Fix: move "balloon 500" to the right of the teal dot (x of the dot + 30) and keep "343" left of the gold dot, or drop the inline value labels, since the right-hand stack already lists 343 / 558 / 511 / 517.

## Should fix
1. **s19 16:33–17:23: the sizes do not follow from what is said.**
   - The fixed-place term is written "≈ 6 × 10⁻⁵" in the bar and in the underbrace. It is −6×10⁻⁵, because the air cooled. The narration says "about two and a half degrees" while the screen shows "−2.6 °C in 12 h".
   - "Less than one degree per hundred kilometres" times 17 km in 15 min (18 m/s) gives up to 1.9×10⁻⁴, not "a few hundred-thousandths". The real 3.3×10⁻⁵ is small because the drift ran nearly along the isotherms.
   - Fix: show "−6 × 10⁻⁵" and say "two point six". Add one sentence: "and it drifted almost along the lines of equal temperature, so only a small part of that gradient counts."
2. **Symbols not said: s16–s17 13:58–15:31 (U), s19 16:15–17:23 (u, v, w), s20 17:40 (∇).**
   - Fix: say "capital U, the plane's speed east" and "for the balloon, the speeds are the wind: u east, v north, w up". Say "grad T" once in s20.
3. **s20 17:58–18:12: the sign of DT/Dt is not explained.** "The wind brought in warmer air at 3.7 … So the air parcel itself cooled by 0.8" skips the reasoning.
   - Fix: add "If the parcels had kept their temperature, the place would have warmed by 3.7 degrees per hour. It warmed only 2.9, so each parcel cooled by about 0.8."
4. **s22 19:45–20:16: hill numbers.**
   - "+140 m" is shown for both trails, but the data give 135.5 m (summit 325.1 m, car park 189.7 m). "4.0 km" and "9.0 km" are on screen and never spoken.
   - Fix: show "+135 m". Say "about a hundred and thirty-five metres either way; four kilometres on the straight trail, nine on the winding one."
5. **s31 29:22–29:31: spoken number differs from the screen.** The narration says "four point three kilometres higher", but the screen and the maths use 4.26. From the spoken numbers a viewer gets −8.8, not −8.4.
   - Fix: say "four point two six". In s09 7:16–7:54, label the levels "1.53 km" and "5.80 km" so that 4.26 is visible.
6. **Maths past the 1840 safe line (the builder's known items, plus more).**
   - s31 28:46–29:40: T(z₀ + h) and dT/dz end at x ≈ 1896.
   - s33 30:52–31:46: the top formula reaches x ≈ 1905, and the e^h series x ≈ 1880.
   - s16/s17: see M2.
   - Fix: 84 px (main 96) from x 1060, or break the line at "≈".
7. **Source line on frames with no data, or the wrong source.**
   - 0:13–0:16.8: "IGRA2" under the computed Clausius–Clapeyron curve.
   - s32 30:00–30:48: IGRA2 under the c h² panels.
   - s37 34:52–34:59: the flat-plane panel.
   - s38 35:13–35:40: the MODIS line before the image appears.
   - s41 38:15–38:45: the ERA5 water-vapour line before the series appears.
   - s46 44:28–44:51: the ERA5 line under the grid-history dots.
   - s47 44:51–46:13: one blanket line under abstract recap panels.
   - Fix: show the source line only while its data element is on screen, and give the recap a per-beat source.
8. **Collisions (text or links).**
   - s02 1:01–1:09: the link heads land on "rate =".
   - s03 1:31–2:13: "= 7" runs into "f(x) = x²". Put f(x) = x² above the stack.
   - s06 4:24: "+3 °C per h" touches the T-axis label.
   - s08 5:56–6:14: "fixed thermometer" butts into "the place stays fixed".
   - s09 7:21–7:54: both gold links cross "4.26 km".
   - s23 20:37–21:27: the small ∂²f/∂y∂x line touches ∂M/∂y.
   - s24 22:35: "fractional changes add" touches the denominators.
   - s28 25:54–27:57: the route line runs into "27 kJ/kg".
   - s30 28:30–28:35: "locally a line" sits on the inset's "°C".
   - s34 32:38–32:50: the link crosses "exponential".
9. **Legibility at 640 px.**
   - s44/s45 41:58–43:26 use inline \tfrac (the digits of h²/2 and h³/6 are about 25 px). Use \dfrac at ≥ 68 px.
   - s45 S10 43:15–43:26: the "sin x … forward −0.043 / centred −0.0009" line is small and misaligned. Make it "error: forward −0.043, centred −0.0009" at 54 px.
   - s10 8:32–9:09: the "→ ∂/∂t : 2x" rows are small.
10. **s27 24:41–25:00: no integration step.** The scene jumps from dp/p = −dz/H to p = p₀e^(−z/H), which breaks U-WB-R5 ("every step, including the integration").
    - Fix: add a check line using this movie's chain rule: "d/dz of p₀e^(−z/H) = −p/H, so dp/p = −dz/H ✓". Or show ln p − ln p₀ = −z/H.
11. **Tools used but not taught.**
    - s42 39:55: the power rule (T⁴ → 4T³). Add "just as x squared gave two x, T to the fourth gives four T cubed".
    - s24/s25 21:30: kelvin. Add "kelvin is degrees Celsius plus 273".
    - s42 39:49: "emission temperature" (the temperature a black body would need to send out 240 W/m²).
    - s29 27:28: η (say "written eta").
12. **s10 8:47–9:09: a number without its calculation.** 1.4×10⁻⁹ is given before, and without, its calculation.
    - Fix: add a CalcStack (7.6 − 8.6 − 1.8 + 3.2) °C ÷ (36.8 km × 2 h) ≈ 1.4×10⁻⁹ °C m⁻¹ s⁻¹ when the corners appear.
    - The axis title reads "small t" (7:58–9:09). Write "t".
13. **s07 5:17–5:41.** "4.51 − (5.69)" has stray parentheses, and "≈ −2.5" has no unit. Write "4.51 − 5.69" and "≈ −2.5 °C/100 km".
14. **s06 4:25–4:42.** While T = x t is discussed, the dimmed plane of the old field stays on the left. Show the x t saddle, or hide the plane.
15. **Unspoken numbers, or a near-empty half.**
    - s14 13:00–13:08: the "2.5 °C" traveller readout is never said.
    - s43 40:22–40:42: "+1.04 °C" is shown, but "about one degree" is spoken.
    - s43 40:18–40:26: the left half holds only a zero line. Bring in the +3.9 bar or the thermostat picture on S1.
16. **s28 25:23–26:30: no 3-D parcel (U-WB-R3).** "An air parcel… expand to one and a half times its volume" is shown only on the p–α chart. Add a small 3-D parcel cube growing ×1.5 beside it.
17. **s16 13:58–14:52: the hour-long flight is an extrapolation.**
    - The readouts run to −3.5 °C after an hour (5.1 − 8.6) over a map that changes along 360 km. That extrapolates the instant rate.
    - Fix: say "if these rates held for an hour", or end the clock at 10 min.
    - The time graph's tick labels (y ≈ 835) crowd the source-line band. Keep the picture ≤ 820.
18. **s09 7:10–7:16.** The Trappes true-colour tile is a hard-edged white square on the Blue Marble and looks like a glitch. Feather its edge, or outline it and label it "30 Sep 2026".
19. **End card 46:13–46:39.**
    - The topic list has uneven gaps, and "coordinates" is brighter and bolder than the rest.
    - It omits waves, stability and PDEs/numerical methods, which s38 and s46 name.
    - Fix: a 4-column grid of equal weight, with the three missing topics added.
20. **s41 38:23–39:09: the warming figure.**
    - "+1.26 °C (2016–2025)" has no baseline, and the narration says "one and a quarter".
    - Fix: show "+1.26 °C (2016–2025 vs 1850–1900)" and say "one point two six". Add the Forster et al. 2026 credit to the source line while the number shows.
    - s42: the source line says "2026-08", but 240.6 W/m² is the 2001–2026 mean. Add "map 2026-08 · mean 2001–2026".
21. **s05 3:21–3:40.** An orange boxed "x" sits on the landscape with no explanation. Replace it with an arrow labelled "x (east)".
22. **s29 27:28–27:57.** Δη has no unit; see M4.

## Overall: FIX (ch00_derivatives_taylor review 1 — 5 Must, 22 Should)
- **The maths and physics are right everywhere.** All 13 QA gates pass, and the manifest hashes reproduce.
- **The five Musts are layout and one teaching gap.** Three are collisions that hide numbers or text (s32, s29, s35), one is a clipped label (s16), and one is undefined thermodynamics notation (s28/s29).
- **Fix loop.**
  - TSX fixes: M1, M2, M4, M5 and most Shoulds. Re-render s02–s10, s16–s17, s19–s24, s28–s35, s41–s47 and the end card.
  - TTS for the changed sentences: M3, S1–S5, S10, S11, S15, S17 and S20. Use the splice workflow used for #1a.
- **Then** a fresh re-review.

**Disk.**
- C: 55 GB free at the start and at the end.
- G: 512 GB free at the start and at the end.
- This review wrote 156 MB (502 files) to G: under `…/review1/` and nothing to C:.

---

# cross product v5 / Part 2 — review 3 (fresh eyes, after fix loop 2, commit 11ee76f)                2026-10-29

Movies reviewed (read-only; nothing edited; Part 1 is final and not reviewed):
- **v5 full** `movies/out/ch00/ch00_cross_product_why/v5_1080.mp4`: 4154.60 s (1:09:14.6), 153,568,451 bytes = the QA'd file `cf2/final_v5/1080.mp4`. Captions `v5_en.vtt`.
- **Part 2** `movies/out/ch00/ch00_cross_product_uses/1080.mp4`: 2456.75 s (40:56.8), 115.49 MB.

**Frames.** 291 PNG + 54 tiles (122 MB) under `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_cross_product_v5/review3/`:
- `v5/<scene>/`: at least one frame per sentence in s22w, s23, s26a1, s26e, s27b, s27c, s27d, s27e, s27f, s27g, s37 S5–S8 and s47 S8–S10. There are extra frames around the s22w link and the s37 cross-fade.
- `p2/`: s37 and s47. Joins: title and hook 00:00.5–00:20, the s01d → s23 splice 02:55–03:10, the 10-frame Part-2 seams at 04:05.6, 20:05.5, 22:48.5, 31:04.2 and 31:46.7, and the end 40:20–40:56.5.
- `p2diff/`: 41 v5/Part-2 frame pairs at the shared scenes.

**How Part 2 was built.** `cf/seg_p2.json` takes s26e and s27c straight from the v5 fix-3 pieces (`piecesf3_v5/p072686`, `p081697`). So "p2: freshf3 0" in `cf2/final.log` does not mean Part 2 missed them. The pixel comparison confirms it:
- Mean |Δ| is 0.10–0.65/255 at 39 of the 41 shared times: s23, s26a1, s26e, s27b–g, s37 S7 and s37 S8.
- Mean |Δ| is 7.61 at 59:49.5 and 1.39 at 59:51. Both fall in the s37 cross-fade, half a frame apart, and both frames look right.
- Part 2's own s47 recap (39:48–40:06) was looked at on its own.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| v5 (review 3) | 4154.60 s; narration ends 4152.10 s | 153.57 MB (**size WARN**, accepted; hard cap 160) | 12 PASS + size WARN: duration, codec (H.264 High, yuv420p, AAC, faststart), black 0, frozen 383 (all narrated), content, **halves PASS** (was WARN), −16.0 LUFS / −1.9 dBTP, flashes 0/s, captions 1005 = script, subtitles 1005 = VTT, physics 151 hashes, equations 146 | PASS (checked by hand below) | PASS: "p = q = Ω, s = r" (M1 closed); no KaTeX errors | PASS: M3 and M4 closed; S3–S9 at legible sizes | PASS: M2 closed | PASS: 1005 cues, max line 42, ≤ 2 lines, max 16.78 cps, in order, last cue ends 4151.8 s (inside the audio); 3 cues < 1 s (C9) | PASS: 0 flashes; colour families unchanged | n/a (house style: none) | **PASS** → `qa_pass` |
| Part 2 (review 3) | 2456.75 s; narration ends 2454.25 s | 115.49 MB | 13/13 PASS (halves PASS). Physics 78, equations 79, captions 603, −16.0 LUFS / −3.4 dBTP | PASS | PASS | PASS | PASS | PASS: 603 cues, 42 chars, ≤ 2 lines, max 16.91 cps, last cue ends 2453.95 s; 2 cues < 1 s | PASS | n/a | **PASS** → `qa_pass` |

## Review-2 items — status (v5 · Part 2 times)
| item | status | evidence |
|---|---|---|
| M1 s27b mapping read as "Ω · s" | **fixed** | 44:22–44:40 · 16:15–16:33: gold "p = q = Ω, s = r" on its own row (y ≈ 887), no "·" between symbols, shown on "Here p and q are both Omega, and s is r" |
| M2 s27c empty maths zone | **fixed** | 45:23.5 · 17:16: "not at right angles" fades in on S1 and stays to 45:30. "r =" is shown at 45:31, "r = r_along" at 45:33 (on "along Earth's axis") and "+ r⊥" at 45:35 (on "straight out"). The qa `halves` gate now PASSes in both movies |
| M3 s37 labels over the source line | **fixed** | 59:49.4–59:53 · 31:42.4–31:46: "f > 0 · anticlockwise" and "f < 0 · clockwise" sit at y 760–805, with the source at y 840. From the first thumbnail frame the source line credits both storms: "Ian: GOES-16 + NOAA HRRR, 28 Sep 2022, 18 UTC · Idai: NASA VIIRS + ERA5 (Copernicus C3S), 14 Mar 2019, 12 UTC" |
| M4 s22w gold rectangles | **fixed** | 29:19–30:15: no frames or boxes. The active picture is at full opacity and the others are dimmed. Gold pointers run from the keywords: 29:27 to the hinge and the turn, 29:36 to both F arrows, 29:59 τ = r × F to the bolt |
| S1 ×50/×100 documentation | **fixed** | The `storyboard.yaml` s27e/s27f rows (5158, 5200, 5241, 5303) and the manifest note both say "×100 against g*" |
| S2 s47 recap picture | **fixed** | 68:10.5–68:18 · 39:48–39:57: the pin sits on the ×50 outline, g lies along the normal (checked below), and Ω²r⊥ is a short sketch (22 % of g) |
| S3 s27c "leans towards the equator" | **fixed** | 46:17–46:24 · 18:09–18:16: the camera zooms to the pin. Up, north (newly added) and the centrifugal arrow are ≈ 140 px, and the 45° arc lies between up and the centrifugal arrow |
| S4 s27f sideways part | **fixed** | 48:27–48:59 · 20:20–20:52: a ×3 magnifier. The rose arrow is ≈ 99 px, with "sideways part" outside the lens. The gold link starts at the arrowhead |
| S5 s27e icons | **fixed** | 47:51–47:56: code-drawn icons of 110–130 px (string + bob, a scale with a dial, a ball with a drop trail), each labelled on its word. s27g has no icons now, only keywords |
| S6 s26e miniature | **fixed** | 41:02–41:13 · 12:55–13:06: the disc is zoomed. Ω × u is ≈ 120 px and the two Ω × r arrows are ≈ 170 and 80 px |
| S7 s26a1 collisions | **fixed, with the deviation (agreed, below)** | 37:36–38:30 · 9:29–10:23: the "B" label is right of the arrow and "Ω" is below the hub, so they no longer touch. "Ω × B" sits beside the middle of its arrow, clear of the dashed sum (38:09). The teal stub is labelled "rider's change" |
| S8 s26a1 rule layout | **fixed** | 38:24–38:30: about 40 px separate the "outside watcher" brace from line 2. The duplicate "rider" brace is gone; only "carried round" remains |
| S9 s23 map labels | **fixed** | 31:50–32:12 · 3:43–4:05: the labels have a dark halo and sit below their arrows inside the map. "−k × u = (5, 0, 0)" ends at x ≈ 915, inside the map edge at 958 |
| S10 size | accepted | 153.57 MB WARN < 160 MB |
| C1 "4\|5°" | fixed | The "45°" label is hidden during the split (45:31–45:39); the arc stays |
| C2 s27b link / rider glyph | partly | The link now starts at the 2.5-m bracket (45:10). The rider glyph at 45:21 is still ≈ 50 px |
| C3 s27d "centrifugal ≈ 0.034" | open | 47:08–47:12: the label still sits beside the g bar, with no unit |
| C4 s27g links crossing | fixed | 49:49 |
| C5 s27g radius labels | fixed | 50:26–50:37: the labels are inside the ellipse |
| C6 brace numbering | open | 41:59 reads ②, ①, ③; 42:27 reads ①, ②, ③ |
| C7 P2 s01d label on the border | fixed | 02:59.5: about 20 px above the grid border |
| C8 P2 s00 source line | open | 00:12: still ≈ 20 px under "uses it" |
| C9 cues < 1 s | open | v5: 3; P2: 2 (narration unchanged, so the same cues) |
| C10 v5 collisions | open | 15:25 "(3, 0, 0)" sits on the teal arrowhead; 24:35 the r tag sits on F's tail |

## The deviation: B's tail stays on the hub (S7) — **the right call**
- The rule (dB/dt)_out = (dB/dt)_rider + Ω × B is about the rate of change of a vector, so it holds wherever the arrow is drawn.
- But the narration says "the tip moves at Omega cross B" (37:53.65–37:59.45).
  - The tip is a point. Its velocity is Ω × (position of the tip).
  - That equals Ω × B only when the tail is the fixed hub.
  - With the tail at (1.0, 0.4) m, the tip would move at Ω × (tail + B), and the spoken sentence would be false on screen.
- With the tail on the hub, "just as Earth's ground moves at Ω × r" (the inset at 37:58) is an exact parallel. So is "B = r" at 38:26.
- The collision behind S7 was solved by moving the labels instead (37:36 and 38:09 are clean). So the deviation costs nothing.
- Recommendation: record it in `storyboard.yaml` s26a1 ("B drawn from the hub so that its tip moves at Ω × B"), so the storyboard and the picture agree.

## New pictures: physics honesty (measured on full-resolution frames)
- **g along the normal of the flattened outline.**
  - s27f "real Earth" (49:10–49:31):
    - The ellipse semi-axes are 205 × 168 px (ratio 0.82; flattening ≈ ×54, documented as "×50, axis ratio 0.83").
    - The pin sits at (128, 129) px from the centre, on the outline ((x/a)² + (y/b)² = 0.98).
    - The outline normal there is at 56.3°. g is drawn at 55.8° and "up" at 55.3°.
    - Extended, g crosses the axis 61 px below the centre, on the equator side, not at the centre. That is correct.
    - The geodetic − geocentric gap is drawn as 11°, against 0.19° × 54 ≈ 10°.
  - s47 recap (68:10–68:28 · 39:48–39:57): the ellipse is 157 × 130 px and the pin sits on the outline (0.98). The normal is at 56.1° and g is drawn at 55.7°. PASS.
- **×100 centrifugal arrows**, against the true ratio Ω²a cos 45° / g ≈ 0.0240 / 9.83 = 0.00244.
  - s27e head-to-tail (47:40–48:11): g* is 353 px and the centrifugal arrow 81 px, a ratio of 0.229, i.e. ×94.
  - s27f round Earth (48:24–49:31): g* is 197 px and the centrifugal arrow 50 px, i.e. ×103.
  - s47 sketch: 28/130, i.e. ×88.
  - All agree with the storyboard and manifest "×100 against g*".
  - Every centrifugal arrow points straight away from the axis, and the sum g tilts towards the equator.
- **The magnifier does not misstate sizes** (s27f, 48:27–49:00).
  - The surface arc in the lens has a radius of curvature of 602 px, which is 3.0 × the 200-px main circle. So it is exactly the documented "×3 magnifier, same ×100 picture".
  - The angle between g and g* is the same in the lens as in the main panel (57.6° against 45°). The lens only enlarges; it does not stretch angles.
  - The rose sideways arrow is 99 px. The prediction is 3 × (50 px × sin 45°) = 106 px.
  - The readout "sideways ≈ 0.017 m/s²" = Ω²a cos φ sin φ = 0.0169. "Coriolis ≤ 2Ω × 10 ≈ 0.0015", so "> 10 ×" (ratio 11.6) is honest.
- **The other new pictures.**
  - s27c zoom (46:17–46:24): up is radial and north is tangent towards the pole. The centrifugal arrow is horizontal and away from the axis, with the 45° arc between up and centrifugal (= φ). Correct.
  - s26e zoom (41:02–41:13): the disc turns anticlockwise. For u pointing NNE, Ω × u points left and slightly up. Ω × r at both ball positions is ⊥ r, turned anticlockwise. The change between them points along Ω × u. Correct.
  - s26a1 (38:09): with B up-left, Ω × B points down-left. The dashed sum = teal stub + violet arrow. Correct.
  - s27b (44:47–45:15): Ω · r = 0 is crossed out, so −Ω × (Ω × r) = Ω²r, pointing outward. 0.5² × 2.5 = 0.625 m/s², and 2π/0.5 = 12.6 s.
  - s27c: Ω(Ω·r) = Ω²r_along; Ω²r − Ω²r_along = Ω²r⊥; |r⊥| = a cos φ. Correct.
  - s27d: 5.32 × 10⁻⁹ × 6 371 000 = 0.0339 and × 4 505 000 = 0.0240. Correct.
  - s37 (59:38–60:00): Ian has f > 0 and turns anticlockwise; Idai has f < 0 and turns clockwise. The r × u arrows go the right way round both storms.

## MUST fix
None.

## SHOULD fix
1. **R3-S1 · v5 59:49.4–59:56 (s37 S7–S8) and 68:18–68:28 (s47) · P2 31:42.4–31:49 and 39:57–40:06. The Ian thumbnail shows a hard-edged pale rectangle.**
   - What is wrong: the bright cloud-overlay tile ends in a soft-edged pale rectangle in the top centre of the Ian image (x ≈ 400–800, y ≈ 200–300 at 59:51). On a satellite picture it reads as an artefact.
   - It is not new in this loop (the same pieces as review 2), and no physics depends on it.
   - Fix: feather the overlay mask (a radial alpha of ≥ 120 px), or crop the thumbnail to the storm so that the tile edge falls outside the frame. TSX only.
2. **R3-S2 · storyboard s26a1. Record the S7 deviation.**
   - Fix: write "B is drawn from the hub so that its tip moves at Ω × B" in place of "B at (1.0, 0.4) m". Text only; no re-render.

## COSMETIC (optional)
- **R3-C1 · 29:29.5–29:31 (s22w).** The gold link from 29:27 retracts through the dimmed "u" label just as "or a spin arrow, like Earth's spin, Omega" is spoken, so no link points at Ω. Fix: fade that link out instead of retracting it, or point it from "spin arrow Ω" to the Ω arrow.
- **R3-C2 · 44:43–44:53 (s27b).** The side-view r arrowhead touches the disc rim (x ≈ 785). Fix: move the inset 30 px right.
- **R3-C3 · 37:58–38:30 (s26a1).** The "B" letter sits on B's own arrowhead. Fix: offset it 20 px along the perpendicular.
- **R3-C4 · 45:31–45:33 (s27c).** The gold r⊥ leg is drawn about 2.8 s before "straight out from the axis" (45:33.8). It is acceptable as "split into two parts". Fix: draw it at 45:33.8.
- **Open from review 2:**
  - C2 rider glyph ≈ 50 px (45:21);
  - C3 (47:08–47:12): put "centrifugal ≈ 0.034 m/s²" at the sliver;
  - C6 (41:59): number the braces ①, ②, ③ in the order of 42:27;
  - C8 (P2 00:12): move the source line 20 px down;
  - C9: merge the five < 1-s cues;
  - C10 (15:25, 24:35).

## House-style conformance
- **Conforms:**
  - no boxes, cards or badges (M4 closed);
  - keywords only;
  - goal before calculation ("To see which way it points", "How big is it on Earth?", "why don't weather equations have a centrifugal term?");
  - reveals on their words (M1, M2, S3, S5 timings above);
  - gold picture-to-number links: 2.5 m, the sideways arrow → 0.017, the poles and equator → g values;
  - colours: Coriolis violet, g/g* brown, centrifugal slate, sideways/negative rose, the rider teal;
  - source lines on the Blue Marble, VIIRS/GOES/ERA5/HRRR and WGS 84 frames only (not on the SVG cross-sections);
  - text ≥ 44 px except the source lines and the s23 axis words, as before;
  - no empty half > 3 s (qa `halves` PASS in both movies);
  - the correct end card for each movie (Part 2: "last video" tile, notebook lines).
- **Departures left:** R3-S1 (the visual artefact) and the cosmetics above. None is one that a viewer would read as wrong.

## Overall
- **v5: PASS → `qa_pass`.** 0 Must, 2 Should (R3-S1 visual, R3-S2 storyboard text), 4 new cosmetic items plus 6 still open from review 2.
  - Every review-2 Must (M1–M4) and Should (S1–S9) is fixed at its timestamp; S10 is accepted.
  - qa is 12 PASS + the accepted size WARN; `halves` now PASSes.
  - The S7 deviation is the right call.
- **Part 2: PASS → `qa_pass`.**
  - It carries the same fixes, shown by the pixel identity at 39 shared times and by the frames looked at in s37, s47, the joins and the end card.
  - qa is 13/13 PASS. The same R3-S1 thumbnail artefact appears at 31:42–31:49 and 39:57–40:06.
- The user watches both before `/approve-movie`. R3-S1 can be folded into any later re-render; it does not block.

Disk: at the start, C: 53 GB free and G: 506 GB free; at the end, C: 52 GB free and G: 506 GB free. Review frames: 122 MB (291 PNG + 54 tiles) on G:, not committed.


---

## ch00_weather_basics UF2 — review 1 (2026-10-30, build 1, commit a45b9e1)

**Movie:** `movies/out/ch00/ch00_weather_basics/1080.mp4`: 57:45.3, 156.40 MB, 1920×1080, 30 fps, 74 scenes, 868 cues.
**How I looked:** I extracted about 330 frames with ffmpeg into `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/review_uf2_1/` and read them as tiled 640-px sheets (`sheet_*.png`), plus 960-px and full-size frames for close checks.
- One frame at the end of every sentence (minus 0.4 s) for s18–s22, s03, s05, s19–s20b, s25, s27–s27c, s31, s36, s38–s39, s48b and s53.
- Every 3 s through both stacks (31:09–31:48 and 40:43–41:30).
- Every K6 text-text, edge and text-picture hit.
- Mid frames for s41–s61.
- I checked the s51 beam code against v4 fix 1 (`git show 3fc711b`).

I also folded in the user's round-3 items U3-01…U3-07 (`reports/ch00_weather_basics_user_feedback_round3.md`), including the new §5b stack rule.
**Disk:** C: 50 GB free and G: 509 GB free at the start; C: 50 GB and G: 509 GB at the end. I wrote only frames, about 0.1 GB, to G:.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_weather_basics UF2 b1 | 57:45 | 156.4 MB | 13/14 (overlap FAIL) | PASS (all numbers check by hand) | PASS (53 present, no KaTeX error) | FIX | FIX (stacks unreadable, U3-05 late) | PASS (gate) | PASS | n/a (retired) | **FIX** |

**Verdict: FIX. 31 Must and 22 Should.**
- The scale-height rebuild (U2-09…15) now *reads* right. The words are clear and in the right order: define → 8.43 km → curve → 37 % → tangent → not a lid → block → Δz/H. A lost learner can follow them.
- The pictures still need work. About a dozen labels collide in that section, and the s22 "a bit lower" comparison is invisible.
- Both stacks fly inside the layers for 10–15 s and nothing can be read there (U3-03/04/07).
- s25 and s39 need the U3-01/U3-05 rebuilds, and s51 needs the beam-end fix (U3-06).

### Physics and numbers (by hand)
| item | check | result |
|---|---|---|
| H = RT/g | 287 × 288.15 / 9.81 = 8430.1 m | PASS "8.43 km" |
| 37 %, 14 % | e⁻¹ = 0.368 → 1013 × 0.368 = 372.8 hPa; e⁻² = 0.135 → 137.1 hPa; 2H = 16.86 km | PASS (373, 137, "sixteen point nine") |
| 12 Pa/m | 101 325 / 8430 = 12.02; ρ₀g = 1.225 × 9.81 = 12.02 | PASS |
| uniform block | 101 325 / 12.017 = 8431.6 m; p₀/ρ₀g = RT/g with ρ₀ = p₀/RT = 1.2252 | PASS |
| 12 % vs 11 % | 1/8.43 = 0.1186; e^(−1/8.43) = 0.8881 → 0.112; 1013 → 899.6 → 798.9 hPa; drops 113.4 and 100.7 | PASS |
| −10 °C / 30 °C | 7.70 km / 8.87 km | PASS |
| halving | 8.43 ln 2 = 5.84 km, 11.69 km → 507 and 253 hPa | PASS |
| 5.5 km measured vs 5.8 km estimate | IGRA Trappes 5.452 km (W83) < 5.846 km; reason "colder aloft" is right | PASS (picture fails, M18) |
| tropopause | Europe 10.15 km, −52 °C → "about ten, about minus fifty"; tropics 16.61 km, −76.7 °C → "about sixteen and a half, below minus seventy-five" | PASS |
| vapour below 1.5 km | 0.450 (W85). "About half" is inside W85's 0.40–0.60 but **below the orchestrator's 0.46–0.50** | Should: say "almost half" (in M2) |
| front step-back | W86 fit 109.8 km between 1.5 and 4 km, slope 1:43.9 → "about a hundred kilometres" | PASS |
| 287 of 365 | W91 287 (recount 288), share 0.786 vs 0.804 base → "close to the usual eight in ten" | PASS |
| s51 cos 60° | 1/cos 60° = 2 (W47); the frame measures 2.1 beam widths | PASS (drawing fails, M8) |
| hemisphere words | s44 says "as seen from above" and "in the southern hemisphere both are reversed" | PASS |

Two CHECK groups are marked "tests pending at build time" in the manifest: W85 (s27c) and W86 (s48b). The verifier should close them in the fix loop.

### U2 items (new timestamps)
| ID | where now | state | note |
|---|---|---|---|
| U2-01 | s01 0:13–0:23 | partly | The globe zooms, but this is not the K1 zoom-reveal: the globe stays in the left half, its top is cut flat at the frame (0:20), and a faint 82 % panel rectangle shows behind the keywords at 0:16 (S13) |
| U2-02 | s02 0:32–0:48 | done | "how pictures draw it" halo → "true thickness"; no ×40 circle |
| U2-03 | s01–s03 | done | the source line is under every globe |
| U2-04 | s03 2:22–2:36 | done | no trail |
| U2-05 | s03 2:22–2:36 | partly | Molecule dots are in the box, but the parcel is about 50 px and the dots cannot be seen at 640 px (S11) |
| U2-06 | s03 | partly | K7 dash arrows are there but tiny (about 20 px) and faint (S11) |
| U2-07 | s05 3:14+, s13–s15, s18, s20f, s22, s60 | done | the rods reach the top of the frame |
| U2-08 | s15 10:00–10:44 | done | The equation fits, but its link crosses a label (M24) |
| U2-09 | s20e 16:42–18:06 | done (words) / partly (picture) | Tangent, slope and "falls more slowly" are clear; label problems in M12, M13 and S4 |
| U2-10 | s20f 18:07–19:03 | done | "No, it isn't… a scale, not a lid"; M14, S5 and S6 |
| U2-11 | s18b 12:52–13:50 | done (words) | The "colder higher up" picture is a stray line (M9) |
| U2-12 | s20 15:49–16:41 | done | 37 % and 14 % are read off the curve; M11 and S3 |
| U2-13 | s20g 19:04–20:54 | done | A clear thought experiment, never "squash"; M31 and S7 |
| U2-14 | s20b 20:55–22:42 | done | Δz/H as a pure number, 12 % vs 11 % explained; M15, M16, S8 and S9 |
| U2-15 | whole section | done | s20c is dropped; every "curve" is now "the slate curve" and points at it |
| U2-16 | s21 23:38–24:37 | partly | The credit is below the plate, but its second line enters the caption band (M22) and the links cross the graph (M21) |
| U2-17 | s21 S4 23:54 | done | |
| U2-18 | s22 25:03–25:40 | partly | The words and labels are spelled out ("our estimate: 5.8 km", "the measured height: a bit lower"). The two marks are about 2 px apart, so the comparison cannot be seen (M18) |
| U2-19 | s27b 30:45–31:07 | done | zoomed globe, credit below, colour bar beside |
| U2-20 | s27b 30:10–30:45 | done | the slot layout is clean |
| U2-21 | s31 34:05–34:50 | partly | The Sentinel-2 ground is real. The thermals are small and gone by S3; the "gold" plane renders dark grey (S15) |
| U2-22 | s47 47:10 | done | kept |
| U2-23 | s27c, s38b, s48b | partly | The three stacks exist, but the camera flies inside them (M3–M6) |
| U2-24 | s60 56:17–56:25 | done | the same 3-D column, edges to the top |
| U2-25 | s36 38:08–38:53 | done | band = climate, line = weather, each linked; 287/365 |
| U2-26 | s36 38:55–39:02 | done | the saying sits below the figure in bold gold, clear of everything |
| U2-27 | s53 52:16–53:03 | done | streaks, belt circles, chevrons, hovers; S14 |
| U2-28 | s53 52:37–52:51 | done | North Atlantic and Southern Ocean each get their own flight |
| U2-29 | s27, s27b, s38, s39, s52 | done | colour bars sit beside the globes; s25 is crowded (M1) |

### §5b globe table
| scene | unzoomed | zoomed / flight | edges invisible | text only on faded rim | colour bar off globe | source below | zooms back out | verdict |
|---|---|---|---|---|---|---|---|---|
| s00 0:00–0:11 | small globe → MODIS map | — | yes | readouts below the image | n/a | yes (3 tiny lines) | n/a | PASS |
| s01 0:11–0:23 | whole, left | dist 3.8→2.5 | top cut flat at 0:20; panel rectangle visible at 0:16 | yes | n/a | yes | ends zoomed (s02 cuts to whole) | Should S13 |
| s02 0:23–1:36 | whole | wedge, no zoom | yes | keywords in the maths zone | n/a | yes | n/a | PASS |
| s03 1:36–2:37 | whole | flight → Brittany | soft fades | the composition bar's left end (x≈1080) touches sharp cloud at 2:21 | n/a | yes (2 lines) | no zoom-out (terrain to s04) | Should S11 |
| s21 23:38–24:37 | plate | plate | the top edge is hard (24:17+) | readouts outside, but the links cross the graph | n/a | yes, 2nd line at y≈885 | n/a | FIX M21, M22 |
| s22 S10 25:56 | whole | — | **cut at top and bottom** | yes | n/a | yes | n/a | FIX M20 |
| s25 27:15–27:46 | globe + shell | to Singapore, pole | **top cut** | "≈ 16 km", "≈ 8 km" readouts **on the sharp globe** | below, crowded by the 3-line credit | touching | — | FIX M1 (U3-01) |
| s27 29:07–29:41 | whole | spin | yes | yes | beside | 8 px gap | n/a | Should S20 |
| s27b 29:42–31:07 | whole → zoom tropics | yes | soft | callout beside, linked | beside | yes | to the s27c stack | PASS |
| s38 39:34–40:35 | whole | rotation | yes | "unlike: least certain…" touches the colour-bar title | beside | yes | n/a | FIX M28 |
| s38b 40:35–41:34 | globe → shells | flight, **inside** | hard vertical darkening edge at 40:47 | callouts beside | visible | yes | — | FIX M4 |
| s39 41:35–42:14 | whole | no zoom; close-up inset | yes | **"Tibet < 600 hPa" on the sharp globe** | beside | yes | — | FIX M7 (U3-05) |
| s41, s42 43:13–44:37 | whole | — | yes | yes | beside | yes | n/a | PASS |
| s45 45:53 | whole | — | yes | yes | beside | yes | n/a | PASS |
| s51 50:54–51:39 | whole | — | yes | **"1 m" on the globe; "2 m" touches the limb** | beside | yes | n/a | FIX M8 (U3-06) |
| s52 51:40–52:16 | whole | — | yes | yes | beside | yes | n/a | PASS |
| s53 52:16–53:03 | whole → hovers | 4 flights | soft top, left and bottom; the right limb is sharp, with no darkened panel | "Southern Ocean: strongest" starts on the limb (x≈1120) | n/a | yes | yes (S8) | Should S14 |
| s54 53:04–53:40 | globe → satellite | yes | soft | yes | n/a | 2nd line at y≈885 | — | FIX M22 |
| s60 56:08 | minis | — | yes | yes | n/a | yes | n/a | PASS |

### K6 overlap triage (1947 hits in 982 frames)
| kind | hits | real | false positive | notes |
|---|---|---|---|---|
| text-text | 14 | **14** | 0 | 21:22.6 and 21:26.9 (s20b "m/m" on Δz/H, M15); 47:07.5 and 47:09.1 (s46 keyword cross-fade, M25); 48:17.1 ×2 (s47→s48 label cross-fade, M26); 55:37–55:46 ×8 (s58, M27) |
| text-picture | 6 | **6** | 0 | 41:54 and 41:58 "Tibet < 600 hPa" on the globe (M7); 51:13–51:25 ×4 "1 m" on the globe (M8) |
| edge | 48 | 47 | 1 | s21, s31, s54, s55: the two-line credits end at y≈885 > 880 (M22). 31:30.4 "0" at x −512 is an off-screen stack axis label: harmless, but the s27c axis is cut at the left (31:18) |
| text-img | 4 | 0 | 4 | s00 "Brest", "997/968 hPa" 5 px into the image box; nothing visible |
| text-link | 55 | ≈ 30 | ≈ 25 | Real: s15 link across "weight of each m³" (M24); s20f (M14); s21 (M21); s22 (M19); s31 (M23). False: a link's own end labels ("ρ₀g ≈ 12 Pa/m", "Brittany") |
| text-stroke | 279 | ≈ 60 | ≈ 220 | Real: s20e "H = 8.43 km" and "37 %" on the slate curve (M13); s20b "1013 → 900 hPa" on the curve (M16); s20f "× 0.37" on the dashed line (M14). False: s47/s48 slope-triangle labels on their own lines; H/L on their circles; Brest on its marker; axis titles beside axes |
| text-fill | 211 | few | most | False: Brest and L on their own marker polygons; slab labels on their own arrow heads |
| text-arrow3d | 1330 | ≈ 15 | ≈ 1315 | Almost all are axis ticks ("km 30", "0/4/8/12") and edge labels ("1 m", "Δz", "weight") beside their own rods; outlined and readable at 640 px. Real: s05 3:21+ "top of the atmosphere: no sharp edge" and s14 9:30 "push = pressure × area" are crossed by column rods (S18) |

**What K6 missed (all found in frames):**
- 13:49 s18b "what does it mean?" on the gold underline (M10).
- 16:40 s20 "137 hPa · 14 %" on the axis title (M11).
- 25:25 s22 "half the air below" on "≈ 0.50" (M17).
- 31:44–31:48 s27c keywords and colour bar on the stack picture (M3).
- 49:30–49:36 s48b keyword and colour bar on the stack (M5).
- 40:34 s38 keyword on the colour-bar title (M28).
- 19:47–19:59 s20g inset frame against the block (M31).
- Links crossing graph axes and ticks (M21, M23).

**How to tune K6:**
1. **Ownership exemption.** Every label carries `owner` = the id of its rod, marker, curve or link. Hits between a label and its own owner are dropped, and links are exempt within 30 px of their own end labels.
2. **Glyph band, not bbox.** A stroke or rod counts only if it crosses the middle 60 % of the text height. It also has to cover at least 25 % of the text width, or at least 3 px at opacity > 0.5. Thin rods (≤ 3 px) that only clip a corner are ignored.
3. **Missing masks and boxes.** KaTeX boxes, Strike/underline lines, axis tick labels and titles join the text set. K5 must publish its projected stack mask, and the colour-bar box goes into the text set, so text or a colour bar on a stack is caught.
4. **Cross-fades.** Sample every scene boundary at −5, 0 and +5 frames, and every slot change, not only every 0.5 s.
5. **Edge.** Keep it strict (y ≤ 880). It found a real overrun.
6. **Severity.** Real hits after steps 1–2 FAIL. Hits that only an owner exemption would have removed are logged as INFO, so the 1330 rod hits stop drowning the 30 real ones.

### Must (31): each with timestamp and exact fix
**User round 3 (U3-01…07) and stacks**
- **M1 (U3-01) s25_tropics 27:15–27:46.** Replace the globe-with-shell and circles with a **tropopause stack over a flat map**.
  - Picture zone (x 560–1840 after the chart): a tilted equirectangular plate, 10°S–80°N × 30°W–120°E (Blue Marble NG), covering Trappes and Singapore. Above it, one semi-opaque **tropopause-height surface** z_trop(lat, lon) from the same ERA5 Nov-2023 monthly-mean temperature (WMO lapse-rate tropopause via the W84 routine). Heights ×N, listed in the manifest. The surface is coloured by height, with its colour bar ("tropopause height, km") in the text column.
  - Two vertical rods, at Trappes and Singapore, run from the plate to the surface. Callouts beside the picture: "Paris ≈ 11 km" and "Singapore ≈ 16 km, below −75 °C", each with a gold link to its rod top.
  - Camera: outside, side angle el 20°, slow orbit az −20° → +10°, rising bottom to top. It never enters the surface.
  - Keep the left sounding chart. Give one K2 credit under each picture, with no credit touching a colour bar.
  - Must differ from s38b (temperature shells), as §5b requires: this is a height surface, a different variable.
- **M2 (U3-02) s27c_vapour_stack 31:08–31:48.** Use 5 layers: 1000, 850, 700, 500 and 300 hPa. Label each layer with its height (≈ 0.1, 1.5, 3.2, 5.8, 9.7 km from W85 z̄) at the layer's left edge, outlined, off the layer face.
  - Narration S2: "…look at it at **five** heights at once, from the sea surface up to about ten kilometres".
  - S4: "**almost** half" (W85 = 0.450 is under the orchestrator's 0.46–0.50). Keep the half-column fraction computed on all levels.
  - Re-run TTS for S2 and S4, and update W85 "10 layers" to 5.
- **M3 (U3-03, U3-07) s27c camera 31:18–31:48.**
  - Keep 31:09–31:18 (the map tilts and lifts).
  - **Cut 31:20–31:31** (the camera is inside the layers; nothing readable at 31:27 and 31:30) and **31:43–31:48** (a fly-through, with "half the vapour…", "colder air holds less" and the colour bar drawn on the stack picture).
  - Replacement:
    1. S2–S3, 31:11–31:31: outside hover, az −30° → +10°, el 15° → 30° (bottom to top). Each callout links to its layer on its words: "≈ 20 g/kg near the sea" → 1000 hPa, "3 km: a few g/kg" → 700 hPa, "10 km: almost none" → 300 hPa.
    2. S4, 31:31–31:37: an optional close look of ≤ 5 s from the side, slightly upward. The sea surface and the 850-hPa layer are both visible. The callout "lowest 1.5 km: almost half the vapour" goes beside the picture, linked to a gold bracket.
    3. S5, 31:38–31:48: back outside, a slow hover.
  - Text and colour bar stay in the text column. "colder air holds less" goes on its own row, at least 24 px above the colour-bar title.
- **M4 (U3-04, U3-07) s38b_reanalysis_stack 40:36–41:34.**
  - Keep 40:36–40:57 as is (the user likes 40:43–40:53). Make the right-side darkening at 40:47 a gradient over x 980–1160 instead of a hard vertical edge.
  - **Cut 40:58–41:10** (inside the shells, 40:59 and 41:02; an unreadable orange slab with gold brackets, 41:05 and 41:08). Replace it with an outside side view from the east, el 15° → 25°, revealing the layers bottom to top through S3. On S4, 41:03.5 "Over Europe", outline the tropopause layer over Europe (≈ 10 km) in gold and link it to the callout.
  - **Trim the close look 41:11–41:20 to ≤ 6 s** (keep about 41:12–41:18, the frame the user accepted at 41:18): ground and levels visible, looking up. Outline the 16.5-km tropical tropopause in gold.
  - 41:18–41:22: out again.
  - **Cut 41:25–41:34** (top-down haze). For S6–S7, use an outside oblique view (as at 41:23) with the balloon as one vertical gold column through all the shells.
  - Keep the colour bar visible throughout.
- **M5 (U3-07) s48b_front_stack 49:30–49:36 (S3).** The camera is edge-on, between the layers. "gold: the cold front on each layer" and the colour bar are drawn **on the stack picture** (49:35.8).
  - Replace with an outside oblique view from the south-east, el 25°, rising.
  - Keep the keyword and colour bar in the text column, off the picture.
  - S4 49:36–49:47: label the lowest and highest gold lines "1.5 km" and "4 km" (outlined, beside the lines) so the step-back can be read.
- **M6 (U3-07, kit).** `movies/src/house/kit/stack3d.tsx` lines 106–107: remove or disable `stackCam.flyThrough` (throw if it is called). It is used at `movies/src/ch00_weather_basics/WeatherBasics.tsx` line 2330 (s27c); replace that call with the outside hover of M3.
  - Restrict `inside` and `below` to the ≤ 5–6-s side close look.
  - Orchestrator: `movies/HOUSE_STYLE.md` §5b line 217 still says "The camera flies round, through, inside and below the stack". This contradicts line 204; rewrite it to the round-3 rule.
- **M7 (U3-05) s39_surface_pressure 41:49.5–42:14.**
  - Keep the camera on Tibet until AT(4, "and the Andes") − 25 frames. Then hop to {lat 5, lon −80, dist 3.8}, arriving within 1 s of "Andes" (≈ 41:56).
  - Outlined place labels: "Andes" on its word, "Rockies" on its word.
  - Hold until S4 ends (41:58.7), then fly straight back to {lat 32, lon 88} by 42:00.5, before S5 "In the close-up" shows the Tibet image.
  - Move "Tibet < 600 hPa" off the globe into a K3 callout in the text column, with a gold link to the ring. This clears the K6 text-picture hits at 41:54 and 41:58.
- **M8 (U3-06) s51_heating 51:11–51:25.** Measured on the 51:25 frame:
  - What is right: the globe has its centre at (540, 449) and R ≈ 353 px. Both beams are about 39 px wide, horizontal and from the left. The 60°N beam centre (y 142) hits the limb at (363, 143) = latitude 60°. The orange footprint runs (327, 163)–(398, 122): 82 px ≈ 2.1 widths, at 30° to the horizontal, which is the tangent at 60°N.
  - **The bug:** the beam `rect` ends with a **vertical cut at x = p.x** (`WeatherBasics.tsx` S51 `beam()`). Its upper half stops up to 35 px short of the footprint, and its lower half runs over the globe, so the 2 m is not covered.
  - The code is **identical in v4 fix 1** (3fc711b `movies/src/ch00_weather_basics/WeatherBasics.tsx`), so v4 had the same flaw.
  - Fix: draw the beam as a polygon whose right end *is* the footprint:
    ```
    yt = p.y - w/2, yb = p.y + w/2, d = (w/2)·tan(lat)
    points = [GBOX.x,yt] [p.x+d,yt] [p.x-d,yb] [GBOX.x,yb]
    ```
    For lat = 0 this is the rect; for 60° the footprint is 2w = 80 px and fully covered.
  - Labels:
    - A "1 m" width label at the left end of **each** beam, above it: (90, p.y − 34), off the beam and the globe.
    - "2 m" at about (250, 92), clear of the limb (no globe above y 96 there), with a gold pointer to the footprint midpoint.
    - Delete the label at `p + n·(−60)`, which sits on South America and touches the limb.

**Scale-height section (13:00–26:00)**
- **M9 s18b 12:59–13:17.** The "real air: colder higher up" picture is one unlabelled slate line. It slants from −56 °C at the top to *below* the column base (y ≈ 865) and crosses the "1 m" label.
  - Replace it with a vertical temperature strip beside the column, inside x 80–1000: `ussa` T(z), 0–12 km, coloured on the house thermal ramp, labelled "15 °C" at the ground and "−56 °C" at 11 km. It ends at the base.
- **M10 s18b 13:43–13:50.** "what does it mean?" sits on the gold underline of "≈ 8430 m = 8.43 km". Give it its own row at least 24 px below.
- **M11 s20 16:26–16:41.** "137 hPa · 14 %" overlaps the axis title "height (km)". Put the TipLabel right of the marker (+30, +40), or move the axis title above the plot.
- **M12 s20e 16:46–17:40.** The KaTeX row "fall per metre at the ground = p₀/H" renders at about 36 px, under the 44-px floor. Make it two rows: the keyword "fall per metre at the ground" (54 px), then `= p_0/H` (68 px).
  - Keep the CurvedLink to "ρ₀g ≈ 12 Pa/m" off the glyphs: end it 12 px before the text.
- **M13 s20e 17:28–18:06.** The slate curve runs through the label "H = 8.43 km".
  - Make it a gold tick label left of the height axis.
  - S10: the "0" label touches the "8" tick, "37 %" sits on the gold band, and the planned gold bracket is missing. Put "0" below-right of the gold dot and "37 %" right of the slate dot, and draw the bracket between the dots.
- **M14 s20f 18:29–18:58.** The gold link from "H: a scale, not a lid" crosses "pressure = weight above" and "no sharp top", and "× 0.37" sits on the dashed H line.
  - Put "H: a scale, not a lid" as the **last** row of the keyword stack (nearest the line), so its link starts below the other rows.
  - Move "× 0.37" 20 px right of the bracket.
- **M15 s20b 21:18–21:27 (K6 21:22, 21:26).** The struck "m"/"m" is drawn on top of Δz/H. As planned, put `\frac{m}{m}` with both m struck on its own row below, plus the keyword.
- **M16 s20b 22:18–22:42.** "1013 → 900 hPa" and "900 → 800 hPa" straddle the slate curve. Place them right of the curve with 40-px gold leaders.
- **M17 s22 25:18–25:26.** "half the air below" overlaps "≈ 0.50". Give it its own row below the CalcStack.
- **M18 s22 25:27–25:40 (U2-18 picture).** The measured mark (5.45 km) and the estimate (5.85 km) are about 2 px apart on the 0–35 km axis, so "a bit lower" cannot be seen.
  - At S7, zoom the column axis to 0–8 km (MapCamera-style re-label, 1.5 s), so the teal "measured: 5.5 km" and slate "our estimate: 5.8 km" ticks are at least 60 px apart, with the gold "a bit lower" bracket between them.
  - Zoom back to 0–35 km for S8.
- **M19 s22 25:50–25:56.** The link from "just above 30 km: 99 % below" strikes through "1 − 0.10 = 0.90". Route it from the label's left end up the left side of the maths column, or put the 99 % row above the 90 % row.
- **M20 s22 25:56–26:00 (S10).** The whole, unzoomed globe is cut at the top and flattened at the bottom. Fit it inside the K1 box (radius ≤ 390, centre about (560, 440)).
- **M21 s21 23:44–24:37.** The gold links from "radiosonde", "wind at each height ← drift" and the readouts ("13.6 km · 149 hPa", "28.4 km · 14 hPa", "33.9 km · 6 hPa") run diagonally across the graph's axes and the "0" tick. Place the readouts in the maths zone above the graph (x 1100–1840, y 60–140) and link from there over the top of the graph box.
- **M22 K6 edge: s21 23:39–24:37, s31 34:07–34:46, s54 53:06–53:39, s55 53:46–54:04.** The two-line credits end at y ≈ 885, inside the caption band. Raise the picture box 12 px, or join the credit into one line.

**Other scenes**
- **M23 s31 34:32–34:50.** The links from "12 ÷ 8 ≈ 1.5 km" / "cloud base ≈ 1.5 km" and "same height → flat bases" cut across the T/Td graph. Anchor these callouts under the plate (x 80–1000, y 760–800) and link straight up to the plane.
- **M24 s15 10:00–10:44.** The link from "how fast p changes with height" crosses "weight of each m³". Swap the two underbrace label rows (or put "weight of each m³" right of 1840 − width), so the links do not cross.
  - On the slab, "1 m" overlaps "Δz" (10:35): move "Δz" left of the slab edge.
- **M25 s46 47:07–47:10 (K6).** "warm air advancing / → warm front" cross-fades in the same slot as "cold air advancing / → cold front" and the lines garble. Fade the old keyword out at least 8 frames before the new one (slot rule).
- **M26 s47 → s48 48:17 (K6).** During the cross-fade the slice labels overlap ("1 km" on "warm air", "from W" on "cold air"). Fade the s47 labels out before the XF.
- **M27 s58 55:37–55:47 (K6 ×8).** "23.2 ÷ 0.514 ≈ 45 kt" covers the lower graph's "°C", and "cooler polar air" covers the "00 06" ticks. Move both to the free column right of the graphs (x ≥ 1500).
- **M28 s38 40:27–40:35.** "unlike: least certain where data are sparse" touches the colour-bar title. Move the colour bar down 30 px.
- **M29 s38b, s27c, s48b (with M3–M5).** The colour bar must never sit on the stack picture: at 31:44–31:48 and 49:35 it does. Put it in the text column (§5b).
- **M30 s25 27:15–27:46 (with M1).** The three-line globe credit touches the colour-bar title, and the bar's "−80" touches the IGRA credit. Give one credit per picture, at least 16 px from any other text.
- **M31 s20g 19:39–19:59.** The "like identical bricks" inset frame collides with the growing pretend block (19:47 and 19:59) and its "12 N" sits on the top brick. Move the inset to x ≥ 700, y 460–720, and put "12 N" beside the top brick.

### Should (22)
- S1 s18 12:14–12:52: `H = RT/g` and `∂p/∂z = −p/H` run together on one line. Put them on two rows.
- S2 s19 13:50–14:18: empty 0–30 km axes for about 28 s, then a framed "ln p" box (a box). Keep the column, or draw the axes only when used; drop the box frame.
- S3 s20 16:12–16:41: the gold "× 0.37" arrows hug the slate curve and read as a second curve. Use straight arrows 40 px right of the curve.
- S4 s20e 17:40–18:06: the "fall per metre" arrows are tiny. Make them 60–120 px, 6-px strokes.
- S5 s20f 18:12–18:28: "37 % of the air: still above H" sits outside the teal region. Put it inside, and add a horizontal bracket at H from 0 to 373 hPa, "373 hPa = weight of the air above".
- S6 s20f 18:46–19:03: the two columns overlap each other and are small. Set them side by side at 1.4× size; show the "8.9 km" tick together with "7.7 km".
- S7 s20g 19:08–20:00: the weight arrows are 10-px cones with no "101 325 N" labels, so "same weight" is not shown. Use ≥ 80-px brown arrows with labels under both bases.
- S8 s20b 21:37–21:48: the gap between the 12 % estimate and the exact curve is invisible. Add a gold bracket at 1 km between the tangent end (893 hPa) and the curve (900 hPa), "≈ 7 hPa".
- S9 s20b 21:02–21:10: the Δp/Δz step is about 10 px. Enlarge it to a 0.3-km step.
- S10 s18/s18b 12:00–13:50: the column is thin and x 400–1000 is empty. Scale the column 1.4×.
- S11 s03 2:22–2:36: the parcel is about 50 px (dots invisible at 640 px), the wind arrows about 20 px and faint, and "Brittany" is dim. Make the parcel 2× and the arrows 2× and brighter; Brittany in warm white.
- S12 s03 1:36–1:38: an empty outline rectangle shows before the composition bar fills. Start the bar filled.
- S13 s01 0:13–0:23: a faint 82 % panel rectangle shows behind the keywords while unzoomed, and the 0:20 zoom is not the K1 zoom-reveal (the top is cut flat). Apply K1 or stay unzoomed.
- S14 s53 52:19–52:56: the globe's right limb is sharp beside the text (no darkened panel), and "Southern Ocean: strongest" starts on the limb. Move the callout to x ≥ 1180. Next narration pass: name the places at each hover (zoom-tour rule).
- S15 s31 34:05–34:50: the thermals are small and gone after S2, and the cloud-base plane is dark grey, not gold. Keep the parcels cycling through S6 at 1.5× radius; make the plane gold at 25 %.
- S16 s36 38:28–38:53: "weather: what actually happened, 2023", "287 of 365 days inside the band" and "average" sit inside the plot over the grid. Place them outside the plot area, as planned.
- S17 s05 3:21–4:02 and s14 9:30: "top of the atmosphere: no sharp edge" and "push = pressure × area" are crossed by the column rods. Shift them clear of the rods.
- S18 s38b 40:47: a hard vertical darkening edge cuts through the globe. Use a gradient (with M4).
- S19 s27/s27b 29:34 and 29:43: the globe bottom is ≤ 8 px above the credit. Keep the K2 gap at least 16 px.
- S20 s22 S10: the planned gold 30.5-km line on the limb is missing.
- S21 s27c 31:18: the stack's height axis is cut at the left frame edge.
- S22 W85 and W86: the verifier tests are "pending at build time"; close them.

**Layer stacks, insight and legibility.**
- s27c: good idea (vapour hugs the ground) and readable from outside (31:33–31:42), unreadable inside.
- s38b: the 40:43–40:56 build and the 41:14–41:20 close look teach well. Everything inside the shells is lost, and the tropopause is never marked on the shells (M4 adds it).
- s48b: S1, S2, S5 and S6 add real insight (one sloping surface). S3 and S4 are hard to read (M5): the gold lines need height labels.
- s31 thermals are small (S15).

**Captions and sync.** The captions gate passes (868 cues = script, SRT twin). The caption band is empty on every frame I looked at, except the 5-px credit overruns (M22). The reveals I checked sit on their words, except U3-05 (Andes and Rockies shown 15 s late).

---

# ch00_derivatives_taylor — review 2 (fresh eyes, after fix loop 1, 1080.mp4 of 2026-10-30 01:01)                    2026-10-30

**What I looked at.**
- 423 frames, one 0.2 s before each sentence ends (times from the repo `timing.json`, 48:27.15), as 47 labelled 3×3 sheets at 640 px a tile.
- About 45 full-resolution close-ups and crops: every changed scene, the s09 flight (1-s steps from 6:45 to 7:16), the s17 turn, the s28 cube growth, the s20 bars, s29 route labels, s42, the end card, and 640-px versions of the small maths.
- Loudness (BS.1770) of all 25 spliced sentences against their neighbours, measured on the final mix.
- Captions re-checked by script: 715 cues, ≤ 2 lines, ≤ 42 chars, max 16.5 cps, 0 violations; 4 cues under 1 s (cosmetic).
- Every number checked by hand against `data/dt.json` (and the manifest values it carries).
- Frames: `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_derivatives_taylor/review2/` (520 files, 156 MB). Nothing was written to C:.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_derivatives_taylor (fix 1) | 2909.67 s (48:29.7); narration ends 2907.15 s, then a 2.5-s hold | 119.07 MB (budget 120, hard 160) | 12 PASS + **halves WARN** (right half empty 26:24.5–26:30, s28 S1) | PASS: every number reproduced by hand; first law signs right (đW on the air = −p dα); Δη = +116 J kg⁻¹ K⁻¹ on all routes; s20 sign reasoning right | PASS: 40 present, no KaTeX errors, no labels or book refs | **FIX**: a new text collision on the s20 key numbers (−0.8 on top of +3.7 and +2.9); a few sub-44-px maths items remain | PASS: every changed sentence has its picture on its words; one 5.5-s empty half (s28 S1) | PASS (715 cues = script, 0 violations) | PASS: 0 flashes, blue–red trend map, voice ≥ 13 LU over the bed | n/a (house) | **FIX** |

## Review-1 items — status

| Item | Status | Evidence (new times) |
|---|---|---|
| M1 s32 overlapping text | **FIXED** | 31:42–32:13: the CalcStack sits under "the bend"; at S8 (31:54) the h³ line replaces it; "Taylor series" sits below at 32:10. Nothing overlaps. |
| M2 s16 clipped label, s16/s17 maths overflow | **FIXED** | "U = 100 m/s" stays inside the map (14:23–15:11). The s16 stack ends at x ≈ 1755 and the s17 stack at x ≈ 1572 (15:24–15:49). |
| M3 s28/s29 first law undefined | **FIXED** | 26:30–26:56: "dI = đQ + đW", "first law of thermodynamics", "I: internal energy (the molecules' motion)", "Q: heat added", "W: work done on the air", "đ: a small amount, not a change", each on its words. 28:22–28:33: "c_v dT = dI, p dα = −đW" with "the first law turned round". The signs are right: dI = đQ − p dα, so đQ = c_v dT + p dα. |
| M4 Δη read as negative | **FIXED** | 29:18–29:37: "Δη = 116 J kg⁻¹ K⁻¹" sits above the dashed leg, and the orange "Δη = 116" sits above its leg. All three labels read positive, and the unit is shown once. (The teal curve still crosses its own label: see Should 3.) |
| M5 s35 hidden "balloon 500" | **FIXED** | 34:38–35:27: "balloon 500 hPa" heads the right-hand stack, and "343" stays left of the gold dot. |
| S1 s19 sizes and sign | **FIXED** (one picture gap) | "≈ −6 × 10⁻⁵" on the bar (16:57) and "two point six" in S3. S7 (17:11–17:23) gives the along-the-isotherms reason and −3 × 10⁻⁵. The inset shows no isotherms: Should 4. |
| S2 symbols said | **FIXED** | U (14:23), u/v/w (16:32), bold u and grad T (18:12). |
| S3 s20 sign of DT/Dt | **FIXED in the words**; **new Must on the picture** | 18:31–18:46: "If the air parcels had kept their temperature… +3.7… warmed only 2.9, so each air parcel cooled by about 0.8". The bar labels collide (Must 1). The −3.7 on screen against the spoken "+3.7" is not explained (Should 5). |
| S4 s22 hill numbers | **FIXED** | "+135 m" both trails, "4.0 km" and "9.0 km" said and shown (20:18–20:37). |
| S5 s31 4.26 | **FIXED** | "four point two six" (30:59); the s09 axis shows 1.53 and 5.80 (7:16–7:54). |
| S6 maths past x 1840 | **FIXED** | s31 ends at x ≈ 1797, s33 at x ≈ 1785, s16 at ≈ 1755. |
| S7 source lines without data | **FIXED** | None on s00, s32, s37 S4–S5, s38 before the image, s41 S1, s46 S8–S11 or the abstract recap beats; the recap has a source per beat. |
| S8 collisions | **FIXED, one left** | s02 (links stop before "rate"), s03, s06, s08, s09 (links clear of "4.26 km"), s24, s28 orange label, s30 and s34 are clean. The teal labels in s28/s29 are still crossed by the curve (Should 3). |
| S9 legibility (s44/s45/s10) | **FIXED** | \dfrac in s44/s45; "forward error −0.043 / centred error −0.0009" at about 54 px (45:06); the s10 rows are larger. Other small maths remain (Should 9). |
| S10 s27 integration step | **FIXED** | 25:43–25:55: "dp/dz = −(p₀/H)e^(−z/H) = −p/H ✓", with the narration. |
| S11 tools not taught | **FIXED** | Kelvin (22:22), emission temperature (41:28), power rule (41:43), "written eta" (29:10). |
| S12 s10 number before its calculation | **FIXED** | 9:04–9:17: the four corners, "(7.58 − 8.63 − 1.77 + 3.19) °C / (36.8 km × 2 h) = 0.37 °C / (36 800 m × 7200 s)", and the axis reads "t". The number is still spoken first (S8, 8:40), then justified at S11. That is acceptable. |
| S13 s07 parentheses and unit | **FIXED** | "4.51 − 5.69", "≈ −2.5 °C/100 km" (5:22). |
| S14 s06 old plane during x t | **FIXED** | The x t grid replaces the plane (4:25). |
| S15 unspoken numbers, empty half | **FIXED** | s14 has no "2.5 °C" readout. "+1.04" is said (42:22). The s43 S1 left half holds the thermometer. |
| S16 s28 3-D parcel | **PARTLY** | 26:56–27:06: a cube appears with "280 K / × 1.5 volume / same T at the end". It grows honestly (edge × 1.15 ≈ ∛1.5), but it is about 150 px across, is shown for only about 6 s, and disappears when the routes start (Should 2). |
| S17 s16 one-hour extrapolation | **FIXED** | The narration says "if these rates held for a whole hour", and the screen shows "if the rates held for 1 h". The graph stays above y 820. |
| S18 s09 white tile | **FIXED** | The tile is outlined, and "image: MODIS, 30 Sep 2026" sits beside it in the text column (7:07–7:12). |
| S19 end card | **FIXED** | Three equal columns of the same weight; waves, stability, and PDEs/numerical methods added (48:18–48:29). |
| S20 warming baseline, CERES period | **FIXED** | "+1.26 °C / 2016–2025 vs 1850–1900", "one point two six", the Forster et al. (2026) line, and "map 2026-08 · global mean 2001–2026". |
| S21 s05 boxed x | **FIXED** | An arrow labelled "x (east)" (3:21–3:40). |
| S22 Δη unit | **FIXED** | See M4. |
| §5b T-M1 s09 globe frame | **FIXED, short of the zoom-reveal** | The zoomed panel has soft fades on all edges, and the source line sits below it on solid background. It is a ≈ 970 × 630 panel, not the full-bleed zoom-reveal, and it never zooms back out (Should 7). |
| §5b T-M2 s42 graph on the globe | **FIXED** | The W/m²–T graph sits beside the globe (x ≈ 690–1015), and "≈ 240 W/m² global average" sits outside the silhouette. The colour bar is below the globe. |
| §5b T-S1 to T-S4 (outside this loop's scope) | T-S1 open; T-S2 open; T-S3 n/a; T-S4 **FIXED** | The globe is about 540 px across (Should 8). Readouts sit on the maps (Should 6). The s19 link is gone. "weight" sits left of the column, and the column edges reach the top. |

## The 25 spliced sentences
- **Level.** All 25 are within 1.3 LU of their neighbours in the final mix: −15.5 to −16.8 LUFS, against −15.2 to −17.3 for the neighbours. The quietest relative to its neighbours is s42 S8 (41:43.8), at −16.8 against −15.5 and −16.0.
- **Sense from the captions.** All read correctly and match the data:
  - s10 S11 0.37 °C / 36.8 km / 2 h;
  - s16 S3 and S9;
  - s19 S1, S3, S4, S7 and S8;
  - s20 S3, S5 and S6;
  - s22 S4 and S5;
  - s24 S3;
  - s27 S5;
  - s28 S2–S4;
  - s29 S5 and S14;
  - s31 S8;
  - s41 S2;
  - s42 S6 and S8;
  - s43 S3.
- **Timing.** Gaps follow the tts.py pattern: 0.35 s inside a scene and 1.5 s at beats. The fastest is s42 S6 (16.5 cps), still under 17.
- **Worth a human listen.** I did not listen. These are the places where the ear could catch what numbers cannot:
  1. s28 S2–S4, 26:30–26:56: how Kokoro says "d I", "d bar Q" and "d bar W", and the 12-s S3.
  2. s29 S14, 29:10–29:18: "eta". It could come out as "ee-ta", "ay-ta" or spelled.
  3. s42 S6, 41:28–41:37: the comma in "would need, to give off" may cause an odd pause; it is also the fastest clip.
  4. s19 S4 and S7, 16:51–17:23: "about minus six times ten to the minus five", and the "only about minus…" phrasing.
  5. s16 S3, 14:23–14:26: a 2.9-s inserted clip; check the seams on both sides.
  6. s42 S7–S8, 41:38–41:51: the 1.3-LU step down into S8.

## Physics and numbers re-checked (all PASS)
- **Brest and the plane.**
  - s02: 4.6/2 = 2.3.
  - s07: −1.18/36.8 km = −3.2 and −1.38/55.6 km = −2.5 °C/100 km.
  - s08: 5.8/2 h = 2.9 °C/h, and −5 hPa/h.
  - s12: −0.32 − 0.50 + 1.45 = +0.63 °C.
  - s16: 100 × −3.2×10⁻⁵ × 3600 = −11.5, and 2.9 − 11.5 = −8.6; s17: +14.4.
- **The balloon.**
  - s18: 4260 m / 900 s = 4.7 m/s, and −24.1/900 = −0.027 °C/s.
  - s19: −2.59/43 200 = −6.0×10⁻⁵; −3.27×10⁻⁵ (dt.json); 4.74 × −5.65×10⁻³ = −0.0268; share 99.7 %.
  - s20: u·∇T = −3.68 °C/h, so DT/Dt = 2.92 − 3.68 = −0.76 °C/h; if the parcels kept their temperature, the place would warm by +3.68.
  - s21: −12.18 m/hPa × −5.65×10⁻³ = +0.069 °C/hPa.
- **Gas, hydrostatics and heat routes.**
  - s25: −3.45 %, exact −3.3 %.
  - s26: 287 × 293/9.81 = 8571 m.
  - s28: routes R × 93.3 K = 26.8, RT ln 1.5 = 32.6 and R × 140 K = 40.2 kJ/kg.
  - s29: Δη = R ln 1.5 = 116.4.
- **Taylor series.**
  - s31: −4.86; 7.44 against 6.87, and −8.41 against −11.8.
  - s33: 1.10517.
  - s34: 11.6 Pa/m, 8.6 m/hPa; 880.4 and 887.3 against 887.0.
  - s35: 342.6, 557.6, 510.6 and 517.4; T̄ = 277.45 K gives 498.7.
- **Climate numbers.**
  - s40: 0.073 K⁻¹.
  - s42: 255 K, and 4 × 240/255 = 3.76.
  - s43: 1.04 and 1.22; 3.79/3.76 and 39.9/37.6.
- **Finite differences.** s45: −0.043 and −0.0009. s46: −3.32/−3.09/−3.20, then −3.17, −3.14, −2.24 and −0.98.

## MUST fix
1. **s20 S5–S7, 18:31–18:53: the key numbers of the new sign reasoning overlap.**
   - Problem: "−0.8" (cream, with its tick) is drawn on top of the "+3.7" label of the "parcels kept T" bar and the "+2.9" label of "the place" bar, at x ≈ 1750–1845, y ≈ 700–795. The labels are also about 34 px tall, so at 640 px they merge into one blob. These are the three numbers S5–S6 now explain.
   - Close-up: `review2/close/s20_S6.png`, `close/s20_bars2.png`.
   - Fix:
     - Give the bars room: start them at x ≈ 1120 and cap them at 1640, so that every value label fits right of its bar at x ≤ 1840.
     - Put "−0.8" on its own third row ("each parcel: −0.8"), or as a bracket between the two bar ends with its label below the lower bar.
     - Labels at ≥ 44 px.

## SHOULD fix
1. **s28 S1, 26:24.5–26:30: empty right half for 5.5 s (QA halves WARN).**
   - Problem: only the p–α chart is on screen while "the most important small changes that are not perfect: heat and work" is said.
   - Fix: show the keyword "heat · work: not perfect" on S1's words (or bring "dI = đQ + đW" in dimmed). Then reveal "first law of thermodynamics" at S2 as now.
2. **s28 S5, 26:56–27:06: the 3-D parcel is too small and too brief (review-1 S16, partly).**
   - Problem: the cube is about 150 px across and disappears after 6 s, so the routes are never tied to the parcel.
   - Fix: enlarge it to ≈ 300 px and keep it through S6–S9. On each route, let it shrink or grow (volume) and tint cool/warm (temperature) in step with the line being drawn. Keep the honest ∛1.5 edge growth.
3. **s28 S9 to s29 S16, 27:23–29:37: the teal route curve runs through its own labels.**
   - Problem: the curve crosses "33 kJ/kg" (the "3") and later "Δη = 116" (the "Δ"). The orange and pink labels were lifted; the teal one was not.
   - Fix: move the teal label ≈ 50 px up and right of the curve (perpendicular to it), at both times.
4. **s19 S6–S7, 17:00–17:23: the reason is said but not shown.**
   - Problem: "it drifted almost along the lines of equal temperature" is spoken, but the inset shows a nearly uniform colour with no isotherms.
   - Fix: draw 3–4 thin ERA5 500-hPa isotherms (labelled in the colour bar's units) on the inset. Let the 17-km drift arrow run visibly along them.
5. **s20 S4–S6, 18:21–18:46: the sign between the screen and the voice is not linked.**
   - Problem: the screen says "u·∇T = −3.7 °C/h" while the voice says the wind "brought in warmer air at three point seven".
   - Fix: label the dashed bar "−u·∇T = +3.7 (warm air blown in)", or add a dim line "−u·∇T = +3.7 °C/h" under the u·∇T line. The bar then reads as the same number with its sign explained.
6. **§5b retrofit T-S2: readouts and non-place text on maps.** §5b allows only short labels that point at a spot (place names, H/L, station plots).
   - Problem cases:
     - s07, 5:17–5:42: "colder", "18.4 km", "27.8 km".
     - s08, 5:50–6:14: "fixed thermometer" lies over the map's lower edge; "2.4 °C" / "8.2 °C".
     - s12, 10:30–11:23: "10 km", "20 km", "+30 min".
     - s13, 11:42–12:00: "X(t), Y(t), Z(t)".
     - s16, 14:11–15:11: "≈ 360 km/h", "U = 100 m/s", "4.0 … −3.5 °C", "5.5 … 8.0 °C".
     - s17, 15:11–15:49: "5.1 °C", "9.5 °C".
     - s19, 17:00–17:53: "17 km".
     - s20, 17:53–18:53: "4.8 … 4.4 °C".
     - s46, 46:05–46:41: "steps over the front".
   - Fix (Q1 b): move the numbers to the text column with a short gold link to their spot. Keep place names and markers, and keep "air parcel" only if it is the parcel's tag.
7. **s09, 6:54–7:16: the zoom is a framed panel and never zooms back out (§5b zoom-reveal and zoom tours).**
   - Problem:
     - The zoomed state is a ≈ 970 × 630 panel with soft edges. It is not the full-bleed globe darkened behind the text column (x 980–1160 gradient, then 82 % overlay).
     - The scene cuts from Europe to the profile at 7:12 without returning to the whole globe.
     - "Trappes" is labelled at 7:07, about 3 s after it is spoken (≈ 7:04).
   - Fix:
     - Render the zoom full-bleed with the house vignette.
     - Zoom back out to the start view over ≈ 1.5 s before the profile cross-fades in.
     - Label Trappes on the word "Trappes" in S4.
8. **s42, 40:50–42:07: globe size and crowding.**
   - Globe size (T-S1): the CERES globe is ≈ 540 px across. Fix: ≈ 760 px, with the graph and readout still beside it.
   - Crowding at S10 (41:56–42:07): the "4 × 240 / 255" fraction ends ≈ 3 px above the source line (y 835 against 838). Fix: lift the CalcStack ≈ 40 px, or put "= 4F/T" on the dF/dT line.
9. **Maths under 44 px (legibility at 640 px).**
   - Problem cases:
     - s19 S9–S10, 17:37–17:53: the underbrace numbers (≈ 20 px), and the odd "∼−3×10⁻⁵".
     - s20 bar labels (see Must 1).
     - s23, 21:23–22:12: the small ∂²f/∂y∂x = ∂²f/∂x∂y line (≈ 22 px).
     - s32 S8–S10, 31:54–32:13: "h³/3! f‴" as an inline fraction.
     - s33 S6–S7, 33:09–33:27: the h = 1 list (≈ 34 px).
     - s03 S7–S9, 1:50–2:09: "d/dx x²" as \tfrac.
   - Fix: \dfrac and ≥ 44 px for each. For s19, write "≈ −3 × 10⁻⁵", or drop the underbrace values, since the bars carry them.
10. **Minor contacts.**
    - s09 S6–S9, 7:16–7:54: the y-axis runs through "−11.8 °C". Put the label right of the dot.
    - s16 S9–S10, 15:04–15:11: "plane" touches the "1 h" tick.
    - s36 S2–S6, 35:39–36:06: the dot and link cover the "1" of "13.07 km". Shift the label 20 px right.
    - s02 S7–S8, 1:05–1:13: "average rate" sits on the temperature line. Lift it 30 px.

## Overall: FIX (ch00_derivatives_taylor review 2 — 1 Must, 10 Should)
- **All five review-1 Musts are fixed.**
  - M3: the first law with I, Q, W and đ defined on their words, and c_v dT + p dα derived as "the first law turned round".
  - M4: three positive Δη labels with the unit.
- **Review-1 Shoulds.** 20 of 22 are fixed, S8 has one leftover (teal labels), and S16 is partly done.
- **§5b.** T-M1 and T-M2 are done. T-S1 and T-S2, and the full zoom-reveal for s09, remain.
- **The one Must is new.** The s20 bar labels that carry the fixed sign reasoning overlap. It is a TSX-only fix: s20 re-render, no TTS.
- **Next.** Fix Must 1 (and ideally Shoulds 1–5, all TSX-only, s19/s20/s28/s29), then a short re-review of s19–s20 and s28–s29. The whole movie does not need another pass.

**Disk.**
- C: 50 GB free at the start and at the end (floor 40 GB).
- G: 511 GB free at the start, 509 GB at the end.
- This review wrote 156 MB (520 files) under `…/review2/` on G: and nothing to C:.

---

## ch00_weather_basics UF2 — review 2 (2026-10-30, render 3, source commit 25eb34b)

**Movie:** `movies/out/ch00/ch00_weather_basics/1080.mp4`: 57:51.5 (3471.47 s), 156.72 MB, 1920×1080, 30 fps, 73 scenes, 491 sentences, 869 cues.

**How I looked:**
- One frame 0.4 s before the end of each of the 491 sentences, read as 55 tiled sheets at 640 px a tile.
- About 150 close-ups: both stacks every 3–4 s, the slope labels, the title, the sun beam, the keyword cross-fades and the credit zones at native scale.
- Frames: `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/review_uf2_2/`.

**Limits of this review:**
- These are stills, so I judged motion from frame sequences only. I did not listen to the audio.
- I did not re-run QA; the gates below are read from `reports/movies/ch00_weather_basics_fix1c/qa.json`.
- The session can hold only a limited number of images, so older sheets dropped out of view. I re-read sheets in several passes and kept notes. Some note lines turned out to be unsupported and I voided them; the "fixed" entries for 15:40–24:00 rest on notes from the passes I trust, not on images in view at the end.
- Pixel sizes marked ≈ are measured or estimated from frames. Word times are estimated from character position within the sentence.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_weather_basics UF2 render 3 | 57:51 | 156.7 MB | 13/14; overlap FAIL (1 hit, false positive); `pass: false` | FIX (labels and words at the front stack; numbers check by hand) | PASS (gate: 53 present; no KaTeX error seen) | FIX | FIX (no beam for 9 s; two stack stretches unreadable) | PASS (0 violations, max 16.83 cps, 148.8 wpm) | PASS (0 flashes) | n/a (retired) | **FIX** |

**Verdict: FIX. 16 Must and 25 Should.** This is a large step forward from review 1:
- The scale-height section now reads cleanly.
- Six of the seven round-3 items (U3-01…07) are met. U3-04 is only partly met.
- Most of the 16 Musts are small placement fixes. Four need more: the s38b camera (R2-M4, R2-M5) and the s48b words (R2-M2, R2-M3).

### The three QA items
| item | finding | evidence |
|---|---|---|
| Overlap hit, "50 km" vs gold line, frame 86093 | **Confirmed false positive: no contact.** But the label must still move (R2-M1). The gate stays FAIL until it does, and moving it should clear the hit. | "50 km" glyphs end at x ≈ 821, y 437–475. The gold line's left edge is at x = 831 at y 440 and x = 850 at y 470, so the gap is ≈ 10 px at the top and grows downward. QA reported at (831, 438), 22 × 22 px. |
| "Its stills predate the final bundle" | **Not shown by the file times.** `overlap.json` is dated 17:28 and the MP4 17:24. This does not rule out stills from an older bundle, but I could not confirm it. It does not change the result above. | file timestamps |
| source_check, s00_title twice | **Confirmed mis-aimed for s00.** The credit is present on all 8 title frames I sampled, 0:01–0:11.3, at y ≈ 555–621. | At the check's own 10 times: band 740–862 holds 0–3 muted pixels; band 540–640 holds 4041–6154 (threshold 150). I tested s00 only and did not run the tool. It needs a per-scene band. |

### Slope triangle at 47:50: is the labelling honest?
**The numbers are honest. The labelling is misleading, so it is a Must (R2-M1).**
- **What 50 km is:** the horizontal run. The narration says "one kilometre for every fifty kilometres along", from the fit 1:49.86 (850–650 hPa at 46.5°N).
- **The triangle is true to the data:**
  - Horizontal scale: 18° at 46.5°N ≈ 1379 km across ≈ 1600 px ≈ 1.16 px/km, so 50 km should be ≈ 58 px. I measure ≈ 63 px (y 493, x 875–938).
  - Vertical scale at ×80: 1 km should be ≈ 93 px. I measure ≈ 97 px (x 938, y 493–590).
  - At true scale the slant is √(50² + 1²) = 50.01 km, so "50 km" would not even be wrong for the slope length.
- **How it reads:**
  - "1 km" sits on its leg. "50 km" sits on the other side of the slanted line, above the triangle.
  - The horizontal leg is thin, pale and unlabelled.
  - A viewer reads "this slanted line is 50 km long".
  - The whole solid line is ≈ 171 px across and ≈ 255 px up, about 130–150 km along and about 2.6 km up: neither 50 km nor 1 km.
  - The ×80 exaggeration that makes the line look steep is first said at 49:06, 77 s later.

### Physics and numbers (by hand)
| item | check | result |
|---|---|---|
| density | 101 325/(287 × 288.15) = 1.225; 273.15 K → 1.293; 303.15 K → 1.165; difference 9.9 % | PASS (1.225, 1.29, 1.16, ≈ 10 %) |
| hydrostatic | 1.225 × 9.81 = 12.02 Pa/m; 300 m × 12 = 36 hPa; 1013 − 36 = 977 | PASS |
| wind | √(8² + 6²) = 10; direction 233.1°; 10/0.514 = 19.5 → "19 kt" | PASS |
| humidity | 15/31.29 = 0.479 (W30); 29/18 = 1.61 | PASS |
| sea-level pressure | 835 × e^(1.609/8.43) = 1010.6 | PASS (≈ 1010) |
| Brest wind | 23.2/0.514 = 45.1 kt; 997 − 962 = 35 hPa | PASS |
| sun beam | 1/cos 60° = 2 | PASS |
| hemisphere words | s44 "seen from above", southern hemisphere reversed; s33 "clockwise from north, seen from above" | PASS |
| fronts | cold front rises westward over the cold air; warm air glides up over cold; the wind turns as stated for the northern hemisphere | PASS |
| front step-back (s48b) | fit 43.93 km per km; 1.3 → 3.4 km gives ≈ 92 km | **FIX** (R2-M3) |

### Round-3 user items
| ID | state | evidence |
|---|---|---|
| U3-01 tropopause surface | **PASS, with R2-M14 and R2-M15** | 27:18–27:45: flat map, one height surface, rods at Paris and Singapore, callouts and colour bar beside it. Height can be read per place. The picture is only ≈ 630 × 450 px (Should 17). |
| U3-02 five layers | **PASS** | 31:17–31:44: 5 layers labelled 0.1, 1.5, 3.2, 5.9 and 9.7 km; "five heights, to ≈ 10 km". |
| U3-03 outside camera (humidity) | **PASS** | 31:14–31:44 stays outside. Colour bar and keywords stay beside the stack. |
| U3-04 outside camera (temperature) | **PARTLY** | The camera never goes inside, the colour bar stays visible, and 40:43–40:56 is kept. But 40:58–41:10 and 41:23–41:33 do not make "the change with place and height clear" (R2-M4, R2-M5). |
| U3-05 Andes on time | **PASS** | Andes labelled and centred by 41:57 (word ≈ 41:56.7), Rockies by 41:58 (word ≈ 41:57.9), back on Tibet with its image at 42:00. The later drift is Should 7. |
| U3-06 sun beam | **PASS** | 51:25: the beam's end is the slanted orange footprint, ≈ 2 beam widths long, with its edges meeting the beam. Both beams are the same width. Beam start: R2-M10. |
| U3-07 close look | **PASS** | 31:31–31:37 and 41:11–41:17: ground and levels both visible, about 6 s each, and back out. `stackCam.flyThrough` now throws, with 0 uses in the movie. |

### Review 1 items
**Fixed, seen in frames:**
- Stacks and globes: M2, M3 (each callout links to its layer on its words, 31:20–31:29), M6, M7, M8, M28, S14, S19, S20, S21.
- Scale height: M9, M10, M11, M12, M13, M14, M15, M16, M17, M18 (the comparison now reads; new credit problem in R2-M12), M19, M20, M31, S1, S3, S4, S5, S6, S9, S10.
- Other scenes: M21, M22, M23, M24, M25, M26, M27, S12, S13, S15, S17.

**Partly fixed:**

| item | what is left |
|---|---|
| M1 | Built; R2-M14, R2-M15 and Should 17 remain |
| M4 | Inside views are gone, but the replacements are unreadable (R2-M4, R2-M5). This is partly review 1's fault: it asked for a view "from the east", which is the edge-on view at 41:03. The 41:18–41:23 view works |
| M5 | Keyword and colour bar are off the picture and the camera is outside; the labels now disagree with the words (R2-M3) |
| M29 | Colour bars are off the stacks; a new case on a map (R2-M8) |
| M30 | One credit per picture, but the three-line map credit still sits tight on the colour-bar title (Should 17) |
| S2 | The column stays and the box is gone, but the ln p axes are empty 14:24–14:38 (Should 21) |
| S7 | Both blocks are labelled 101 325 N, but the arrows are ≈ 45 px, not ≥ 80 |
| S8 | "≈ 7 hPa" is labelled; the bracket is only ≈ 15 px |
| S11 | Parcel and wind arrows are fixed; "Brittany" is still dim (Should 22) |
| S16 | Later labels moved above the plot; 38:08–38:11 is still inside it (Should 8) |
| S18 | Still a narrow dark edge at 40:47 (Should 6) |
| S22 | The manifest says the W85 tests pass but are "not yet committed in fluidpy", and W86 is "D3 fix in progress, uncommitted" (Should 25) |

### Must (16)
**Front stack and slices**
- **R2-M1 s47 47:50–48:17, s48 48:45–49:14: slope labels.**
  - Put "50 km" directly above the horizontal leg, on the same side as "1 km".
  - Draw both legs in 6-px gold.
  - In s48, keep "50 km" off the thick line; it touches at 49:14.
  - Show the keyword "heights × 80" in s47 on S6, not 77 s later (a spoken clause would be better but needs TTS).
- **R2-M2 s48b S3 49:30–49:36: "On every layer, a gold line marks…" is not true.** Only 6 of the 11 layers are traced (W86: 900–650 hPa, not extended further), and about 6 lines show at 49:33. The keyword says "on each layer" too. Say and write "on the lower layers" (TTS splice).
- **R2-M3 s48b S4 49:37–49:47: labels and words disagree.**
  - The labels read "1.3 km" and "3.4 km". The voice and keyword say "from 1.5 to 4 km up" and "≈ 100 km back".
  - 4 km lies above the highest traced line, so it extrapolates beyond the trace.
  - Say what the labels show: 43.93 × 2.1 km ≈ 92 km, "about ninety kilometres back between about one and three and a half kilometres up" (TTS splice; update the W86 row).
  - The link also ends on "3.4 km". Stop it short of the label.
- **R2-M8 s46 46:42–47:09: the colour bar sits on the map** (46:50 close-up). §5b forbids it. Move it into the right column, under the graph.
- **R2-M9 s47 48:02–48:05, s48 49:05–49:14: keywords run across the slice's top edge.** "tall clouds, heavy showers" and "behind: milder, moister" are half on the picture; "behind: colder, drier" touches it at 48:17. Lower the slice ≈ 50 px, or move these rows beside it.

**Reanalysis stack and pressure globe**
- **R2-M4 s38b 40:58–41:10: the stack is edge-on.** The camera is outside, but the shells are a thin band at the globe's left limb and bare Asia fills the frame, while the voice says each layer is colder than the one below. Hold an oblique view like 40:55 or 41:18–41:23, rising slowly bottom to top, and mark the Europe tropopause in that view. Keep 40:43–40:56 as the user asked.
- **R2-M5 s38b 41:23–41:33: seen from above, the shells merge into flat purple haze.** "Warmer again" cannot be seen, and "above about twenty-five kilometres" is not on screen, while "top shell ≈ 45 km" is on screen but not spoken in S6. Use the same oblique view, outline the warming layers, and write "above ≈ 25 km". At this angle the balloon also foreshortens to a short stick; show it as a full column through the shells.
- **R2-M6 s38b 41:04.0: two keywords overlap** for a few frames ("colder going up, to the tropopause" under "Europe ≈ 10 km"). Fade the old keyword out at least 8 frames before the new one.
- **R2-M7 s39 42:00–42:14: the coloured globe loses its colour bar and its ERA5 credit** (only the relief credit is left). Keep both until the field fades.

**Other scenes**
- **R2-M10 s51 S3 51:02.5–51:12.4: "Picture a beam of sunlight one metre wide" with no beam.** The first beam comes at 51:12.5, on S4. Draw the beam in free air with its "1 m" on S3's words; it reaches the ground on S4. The right half also holds only "equinox noon" for this stretch.
- **R2-M11 s54 about 53:13–53:16: the source line lies on the faded lower globe** (53:14.9, about x 190–770; clear by 53:20). §5b hard rule. Keep the globe's bottom fade above the credit throughout the growth.
- **R2-M12 s22 S7 25:39: the column and the axis run across the credit** ("(NOAA NCEI)" is crossed). This came with the M18 zoom. Clip the zoomed column at y ≤ 830.
- **R2-M13 s20f 19:02: "warmer: pressure falls more slowly" covers the end of "8.9 km"** (it reads "8.9 k"). Move the keyword down or right.
- **R2-M14 s25 S5 27:42–27:46: the Singapore link runs through "the pole ≈ 10 km".** Reorder the callouts so that the links do not cross any text.
- **R2-M15 s25 27:18–27:46: three tropopause numbers for one region, unexplained.** The balloon chart on the same frame shows the Paris line at about 11 km, the callout says "Paris ≈ 11.7 km" (November mean), and s38b later says "Europe ≈ 10 km". 11.7 is not spoken, and the voice says "eight to ten" for the poles against "≈ 10" on screen. Label the callouts "November mean", or use the balloon values, and write "8–10 km" at the pole.
- **R2-M16 s42 44:06–44:13: the link from L crosses "high = anticyclone".** Route it under the keyword stack.

### Should (25)
1. **Credits touching globes (§5b).** The limb reaches the text with a gap of about 0–5 px against the ≥ 16 px asked for at: 2:11 (halo), 36:13–36:49, 41:38–41:55, 44:36, 46:06–46:16.
2. s48 49:06–49:14: "true slope" sits beside the thick line and the true-scale twin is a faint ≈ 45-px dash, so the words read as naming the steep line. Point the label at the twin and make the twin solid gold.
3. s47: the labels appear about 2–4 s before their words (by 47:50; "one kilometre" ≈ 47:51.4, "fifty" ≈ 47:53). A straight grey-violet line, about (390, 330) to (1350, 180), appears over the slice from 47:52.5; I could not identify it. The dashed lowest kilometre kinks back west, unexplained, against "like a wedge". "cold 1.29 · warm 1.16 kg/m³" stays on through 48:17: these are the 0 and 30 °C example values next to a real slice.
4. s48b 49:19–49:29: 11 strongly coloured layers read as one solid block (§5b: about 5 unless more add insight). User decision: the sloping surface does work here.
5. s48b: the colour bar is in K while the slices are in °C. 49:37–49:49: the stack is cut at the left frame edge and the gold lines run off it.
6. s38b 40:47: a large dark half-globe with a narrow edge (§5b: x 980–1160), and the colour bar and keyword sit on it. Soften it, keeping the move the user likes. 41:34.5: a hard dark band across the globe as the stack pulls out. The 16 shells have no visible gaps.
7. s39: 42:04–42:09 Tibet slides to the limb, and by 42:13 the globe shows the Americas beside the Tibet image. Hold on Tibet to the end of the scene. 41:37: a true-colour globe carries only the ERA5 surface-pressure credit.
8. s36: 38:08–38:11 "Brest, 2023" and "1991–2020: average and 8 days in 10" touch, inside the plot on the 25 line. 38:35–38:42: the weather link crosses the climate link. 38:53–39:01: two links end on one point.
9. s40 42:18–43:11: "seaside town" sits ≈ 225 px from its square, beside the mountain; "1609 m" sits ≈ 420 px from the summit town.
10. s44 45:44–45:52: "south: reversed" and "Coriolis effect →" touch the mini globe. The wind arrows on that picture are small and dense.
11. s46 47:12–47:27: a coloured 850-hPa map with no colour bar until the slice's bar appears.
12. s50 50:36 → 50:43: the colour bar jumps from top to bottom; 50:49 it sits tight under "warm front".
13. s51: the link tail of "2 m" runs through the "m"; "1 m" sits on the beam's top edge. The beams are short (≈ 105 px, because the globe is close to the left edge); move the globe right.
14. s60: the same blanket credit shows on abstract beats with no data (56:30 column, 56:52 cubes, 57:06 compass). §5: data frames only.
15. s32 35:00–35:05: wind arrows ≈ 15–20 px and faint on cloud, gone by 35:10 (U2-06, §5b). 35:17–35:25: "v = 6 m/s" straddles the image edge. s35 37:18–37:25: the credit names ERA5 10-m wind, but I see no wind drawn.
16. s26 28:20–28:26: the thermals are sparse pale dots and, at 28:23.8, two grey dots beyond the far edge.
17. s25: enlarge the picture, now ≈ 630 × 450 px at the right. The three-line credit sits tight on the colour-bar title.
18. s09 5:39.9: scale rods cross "faster = warmer" before their labels arrive. 6:03–6:15: "same step" touches the K rod. s12 7:55–8:12: the stacked fractions have no gaps.
19. s15 10:17–10:43: the orange arrow crosses "Δz → 0". s18 12:14–12:21: "scale height" sits tight under the g, with a stray tiny gold "<" above it. 12:45: the gold link ends in the struck s².
20. **Text that looks under the 44-px floor (estimates, not measured):** 9:37–9:53 brace labels; 11:10–11:24 "300 m × 12…" and "vertical accelerations ≪ g"; 12:41–12:50 units row; 13:35 brace labels; 14:54–15:21 "add up small steps = integrate"; 17:39 tangent row; 20:19 h row; 32:38 "set by temperature, not the air"; 36:49 kt row.
21. s19 14:24–14:38: empty ln p axes for 14 s. Draw them when the line arrives.
22. s03 2:28–2:36: "Brittany" is dim on a near-black eastern 40 % of the map.
23. s27c 31:38: the "lowest 1.5 km" bracket is tiny, at the far corner. Enlarge it.
24. s58 55:13: "warm sector" touches the "°C" axis label. s29 33:24: "RH 73 %" has no calculation beside it (15 ÷ 20.6).
25. **Tools and evidence.** Commit the fluidpy tests behind W85 and W86. Give `source_check` a per-scene band for s00. The overlap gate caught none of the 16 Musts above: it needs the colour-bar, keyword-on-picture, link-through-text and credit-on-picture checks review 1 listed. Two cues are under 1 s (house range 1–7 s).

### What works (keep)
- The arc is complete, from title to end card. The opening sentence and all three ending sentences follow §3, and the card has its three keyword lines, its notebook rows and no URL.
- The scale-height stretch 12:00–26:00 now reads as a clean chain: define, 8.43 km, the curve, 37 %, the tangent, not a lid, the block, Δz/H.
- The humidity stack, the 41:11–41:23 close look and gold band, the 49:53–50:01 front surface, and the trade-wind and westerly flights all work; the flights return to the whole globe at 53:08.
- U2-25 and U2-26: 38:22–39:01 ties the band and the line to climate and weather, with the saying below the figure.

### House-style conformance
Opening, end card, voice and pace (148.8 wpm), the absence of headings and boxes, and the data-source lines follow the house style. Departures are the listed §5b items: colour bar on a map, keywords on pictures, credits on globes, reveals before their words, and small text.

### qa.json
`pass: false`. The one failing gate is overlap: "1198 frames, 1 hits {text-shape:text-stroke: 1}; 1590 INFO". The other gates pass: duration 3471.47 s vs narration end 3468.95 s; size 156.72 MB (gate budget 160, while §10 still says 60/80 for long movies, so the override should be recorded); codec; black 0; frozen all narrated; content; halves; loudness −16.3 LUFS, −3.6 dBTP; flashes 0; captions 869 cues; subtitles; physics 74 functions; equations 53.

**My own caption check:** 869 cues, 0 violations of 2 lines × 42 chars or 17 cps, max 16.83 cps, the last cue ends at 3468.65 s, and the copy beside the movie is identical.

### Disk
C: 68 GB free at the start, 66 GB at my last check (floor 40 GB). G: 490 GB free at both. I wrote about 0.4 GB of frames to G:. The 2 GB drop on C: is not from this review's frames, which are on G:.

## Overall: FIX (ch00_weather_basics UF2 render 3 review 2 — R2-M1…M16; 25 Should recommended)
Not `qa_pass`. R2-M2 and R2-M3 need a short TTS splice. R2-M4 and R2-M5 need the s38b camera re-keyed. The rest are placement changes. After the fix loop, re-review s20f, s22, s25, s38b, s39, s42, s46–s48b, s51 and s54, plus any scene touched by the Shoulds.


---

# ch00_derivatives_taylor — review 3 (fresh eyes, after fix loop 2, source commit 745397a)                    2026-10-30

**What I looked at.**
- 426 frames, one 0.2 s before each sentence ends (times from the repo `timing.json`), as 48 labelled 3×3 sheets.
- 27 full-resolution frames, plus 63 targeted frames in 7 groups: the s09 zoom, the s08 and s43 swaps, the s28 cube, the s42 reveals, the s09b close look, the s20 wind and bars. Also 11 extra low-resolution s09b frames.
- The diff of commit 745397a, `stack` in `data/dt.json`, the s09b storyboard entry and cues, and `qa.json`.
- Frames: `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_derivatives_taylor/review3/` (60 MB).

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_derivatives_taylor (fix 2) | 2947.40 s (49:07.4); narration ends 2944.88 s | 122.91 MB (budget 120, hard 160) | 13 PASS + **size WARN** (`pass: true`) | **FIX** on one label: s36 "too cold" names the wrong curve. Numbers checked are right | PASS: 41 present per QA, no KaTeX errors seen, no labels or references | **FIX**: real collisions behind the K6 exemptions (s19), s07, s08, s20, s34 | PASS on the scenes checked (see limits) | PASS: 725 cues per QA; s09b cues read by me = script | PASS on the frames; no colour-blind simulation run | n/a (house) | **FIX** |

**qa.json, the one gate not PASS:** `"size": {"status": "WARN", "detail": "122.91 MB (budget 120, hard 160)"}`. `overlap`: "1425 frames, 0 hits; 472 INFO". That zero is not evidence: Musts 1–3, 5 and 7 are visible collisions or link crossings.

## New s09b stack: readable, numbers right, one Must
- **Data.** `stack.trappes`: z = 0.14 / 3.134 / 7.468 / 13.004 / 16.452 km, T = 20.91 / 2.34 / −22.07 / −64.97 / −61.21 °C. I recomputed the gaps by hand: −6.20, −5.63, −7.75, +1.09 K/km. Screen −6.2, −5.6, −7.7, +1.1 and the narration both match them. −7.749 rounds to −7.7 correctly.
- **Tropopause.** 13.0 km at 175 hPa, on the screen and in the words. s36 gives 13.07 km from the balloon, a consistent small difference between two sources.
- **Words.** −6.2 (about 8:11), −5.6, −7.7 (about 8:15), "13 km" (8:21–8:22), +1.1 (by 8:24), "tropopause" (by 8:26). All land on or within about 1 s of their words.
- **§5b.** Five layers, colour bar and source line beside the stack, heights to scale (about 31 px/km at 7:59). The camera stays outside. The close look runs about 8:23–8:26.5, then back out. No fly-through in the sampled frames.
- **Problems.** Must 8 (holes in the bottom layer), Shoulds 8 and 9.

## K6 exemptions: does each hide a real collision?
| Exemption | Verdict | Evidence |
|---|---|---|
| s19 `data-lc-ok` on the two data curves | **Hides a real collision** (Must 2) | "−2.6 °C in 12 h" sits on both curves |
| s19 `data-lc-maplabel` on the isotherm labels (not on the builder's list) | **Hides a real collision** (Must 1) | The gold link strikes through "−11.0 °C" |
| s15 `data-lc-contour` + `data-lc-maplabel` | **Hides real contacts, still legible** (Should 1) | Isotherms run through every readout on the made-up map |
| s07 "Brest" `data-lc-maplabel` | **Small real contact** (Should 2) | The "t" touches the white bracket |
| s20 "air parcel" `data-lc-maplabel` | **OK** | The parcel's own tag; legible over the coast and wind streaks, 18:32–19:03 |

## Review-2 items — status
| Item | Status | Evidence |
|---|---|---|
| Must 1, s20 bar labels | **PARTLY** | −0.8, +3.7 and +2.9 are on separate rows and no longer on each other. New problems: Must 5 |
| S1 s28 empty half | **FIXED** | "small changes, not perfect / heat · work" at 27:07; QA halves PASS |
| S2 s28 parcel | **FIXED** | About 315 px, kept 27:44–28:08. A small cube rides each route and the large one tints (orange at 27:56). It is gone by 28:13, which is fine |
| S3 teal labels | **FIXED** | "33 kJ/kg" and "Δη = 116" sit clear of the curve (28:07, 30:04) |
| S4 s19 isotherms | **FIXED, with a new Must** | Isotherms drawn, the drift arrow runs along them; see Must 1 |
| S5 s20 sign | **FIXED** | "−u·∇T = +3.7" on the dashed bar from about 19:11 |
| S6 T-S2 readouts on maps | **FIXED, with new Musts** | s08, s12, s13, s16, s17, s19, s20 and s46 readouts are off the maps. s07 now has Must 3 |
| S7 s09 zoom | **FIXED** | Full-bleed with the dark right side 7:06–7:10, zoomed back out by 7:12, "Trappes" labelled by 7:06. Balloon cut by the top edge at 7:10 (Should 12) |
| S8 s42 globe | **MOSTLY FIXED** | About 760 px to 42:15, about 540 px from 42:17 beside the chart. The fraction is clear of the source line at 42:43 |
| S9 maths under 44 px | **MOSTLY FIXED** | s19, s23, s32 h³/3!, s33 and s03 are fixed. Left: s26 unit line (about 30 px), s32 d/dh lines (Should 11) |
| S10 minor contacts | **FIXED** | s09 −11.8, s16 "plane", s36 "13.07 km" and s02 "average rate" are clear. New contacts: Shoulds 5 and 12 |

## Label moves and swaps checked
- **s08 two-stage swap (6:15.5–6:17): clean.** Temperature fades, then pressure and the map arrive, with no double exposure. The curve problem is Must 4.
- **s43 swap (43:33.5–43:35): clean.**
- **s42 keyword timing: PASS on the sampled frames.** "≈ 240" is on by 41:53, "emission temperature" at 42:06, the chart at 42:17, and "heat sent to space" leaves before S5. S4–S6 and the 42:17 swap were sampled; other words rely on the `AT()` code.
- **Moved label away from what it names: s36 only** (Must 6). The s20 reading, s19 "°C/s", s36 "a front" and s46 "steps over the front" are all fine.

## MUST fix (all TSX only, no TTS)
1. **s19, about 17:55–18:31: the gold link strikes through "−11.0 °C".**
   - Problem: the "17 km" link runs through the lower half of the number, one of the two labels that make "along the isotherms" readable. The move in fix 2 put it there.
   - Fix: label that isotherm lower on the map (about y 760, right of Trappes), or start the link below it. Keep the label off the link.
2. **s19, 17:26–18:31: "−2.6 °C in 12 h" sits on both profile curves.**
   - Problem: the thick curve runs through "−2" and the thin one through ".6", and in gold from 18:21.
   - Fix: lift the label above the 7-km end of the curves, or put it right of the bracket at about x 650–900, y 150, in the empty part of the plot.
3. **s07, 5:29–5:42: fan of five gold links and a run-on label row.**
   - Problem: "gradient 18.4 km 27.8 km colder (north)" has gaps of about 6–8 px at y 748 and reads as one string. The links cross near Brest and cover the gold dot. The 18.4 and 27.8 tips land about 40 px apart, so a viewer cannot tell which bracket each names. The "colder (north)" link lies along the rose arrow.
   - Fix: fade the 18.4 and 27.8 km callouts when S7 starts (36.8 and 55.6 km are already in the maths). Keep only the links of the current sentence, and leave ≥ 40 px between labels.
4. **s08, 6:16.5–6:43: the pressure curve leaves its graph.**
   - Problem: the data fall to 977.7 and 976.0 hPa at 19:00 and 20:00, but the axis ends at 980. The curve crosses the x axis and the tick row, hits "20:00" and runs down to the map's top edge.
   - Fix: y axis 970–1000 (or clip and end the series at 18:00). Re-check the two dots and labels afterwards.
5. **s20, about 19:11–19:31: the bar chart runs into the source line.**
   - Problem: the white zero axis cuts "18|UTC", and the dashed rose guide cuts "+2|.9". The three rows are squeezed into y 640–860, and "each parcel: −0.8" ends level with the source line.
   - Fix: end the axis at y 830 and shorten or move the source line left of x 1100. Move "+2.9" clear of the guide, or stop the guide at the "place" bar. Tighten the map or the maths to give the rows about 60 px more.
6. **s36, about 36:26–36:47: "line, series: too cold" names the wrong curve.**
   - Problem: fix 2 moved it to −56 °C, 18.5 km, touching the balloon's measured profile. The curves it means are the rose dashed lines at the left (−75 °C, 14 km), about 300 px away. A viewer reads the measured curve as "too cold".
   - Fix: place it just above the rose line's left end (about x 260–650, y 345, clear of "tropopause"), or give it a short rose link to the dashed line.
7. **s34, 34:55–35:10: the link reads as a third curve and lands on text.**
   - Problem: the link from the ring at 1 km has the same gold and weight as "line". It runs along both curves, crosses the frame, and its head lands on the "l" of "line 880.4".
   - Fix: drop the link and mark the point with a label, or route a thinner link through the empty area above the curves, ending ≥ 20 px before the text.
8. **s09b, 7:55–8:31: unexplained holes in the bottom layer.**
   - Problem: `below_ground_share` is 0.44 at 1000 hPa, so 44 % of the layer is transparent, with blocky dark edges next to the rod's lowest dot. For the first 4–5 s this torn yellow patch is almost the whole picture, while the voice says "all of northern France". It looks like a render fault. The treatment is honest; it is just never said.
   - Fix: choose one. (a) Add a keyword on the layer's first frame, "no 1000 hPa surface over high ground". (b) Use 925 hPa for the bottom layer, which needs rebuilt gaps and narration. (a) needs no TTS. Also show all five layers from the start.
9. **Colour bar missing on coloured data fields (U-WB-R2, HOUSE_STYLE §5). New here; reviews 1–2 did not flag it.**
   - Problem scenes: s07 (4:43–5:42), s08 (5:43–6:16), s11 (9:59–11:06), s12, s13, s14 (11:06–13:59), s16 and s17 (14:46–16:28), s37 (36:45–37:00 and 37:21–37:32), s47 S2, S3 and S5. None of these is a zoom, the only exemption.
   - Fix: add the same bar as s04 (−4, 4, 12 °C) beside or below each map, in the column where the row below the map is taken. Recap beats: either add it or get the user's exemption.

## SHOULD fix
1. **s15, 14:13–14:46: isotherms run through readouts.** "car: 5.5 °C", the clock, "100 km/h", "−0.03 °C per km", "fixed: no change". "100 km/h" also covers the thermometer's bulb as the car passes (14:30). Fix: end the lines at y ≈ 340 and restart below the road, or move the car readout to the column.
2. **s07, 5:03–5:42: "Brest" touches the white bracket** and sits nearer the west grid point than the gold dot. Fix: move it up and left, with a short tick to the dot.
3. **s43, 43:12–43:34: the thermometer's top is drawn inside the dashed bar.** "3.2 → ≈ 1.2 °C" is also odd typography, and the row does not say what 3.2 is. Fix: lower the thermometer about 50 px. Write "IPCC 3.2 per °C: ≈ 1.2 °C".
4. **s40, 40:10–40:35: ghost text under the inset.** The dimmed "6.4 %/°C", "5.7 %/°C" and "e_s (hPa)" are cut by the inset's axes and "°C" (§5b no text over text). Fix: fade the main chart's labels fully.
5. **s09, 7:22–7:54: two contacts.** The bracket's foot cuts the "1" of "12.3 °C". "15 min" touches the profile (7:34–7:54). Fix: end the bracket above the label, and move "15 min" 40 px left.
6. **s17, 16:09–16:28: the thermometer icon touches "°C/h"** in the "−8.6 °C/h" row. Fix: 30 px more space.
7. **s17, 15:53–16:09: "place 5.1 °C" stays frozen while the plane's reading climbs to 9.5.** In s16 the place warms with the clock. At +14.4 °C/h, 9.5 °C means about 0.3 h, when the place would be about 6.0. Fix: run it as in s16, or say "at 18:00" beside it.
8. **s09b, S2: the calculation is not on screen (§6, every calculation in full).** No level temperature or gap in km is shown, so −6.2 cannot be followed. Fix: on S2, add one dim worked line "(2.3 − 20.9) °C / 3.0 km ≈ −6.2" under the equation.
9. **s09b, 8:22–8:23 and 8:26–8:27: abrupt camera; final view crowded.**
   - The picture grows by well over 1.5× in about 1 s, and the links swing. Fix: 1.5–2 s moves.
   - At 8:27–8:31 the higher pitch overlaps the layers heavily (§5b "clearly separated"). Fix: return to the 8:04 side angle.
10. **s42, 41:52–42:15: "≈ 240 W/m² global average" links to one spot on the limb,** implying a local value. Fix: no link, or a bracket round the whole disc.
11. **Remaining small maths and stacks.**
    - s26 unit line, 25:50–25:55: about 30 px.
    - s32 d/dh lines, 32:22–32:40: inline-size fractions.
    - s03, 1:50–2:09: df/dx touches the row above and the d/dx row below.
    - s26, 25:29–25:38: ρ/p touches dp/p.
    - s45, 45:17–45:58: "h³/3" touches the fraction below.
12. **Minor contacts and tags.**
    - s02, 0:55–1:13: the secant touches "10.3 °C" and "14.9 °C".
    - s19, 17:34–18:31: "fixed place" touches its bar.
    - s23, 22:43–22:50: "−2.00" and the ✓ crowd the axis "x".
    - s27, 26:11–27:02: "exponential" touches its curve.
    - s25, 24:41–24:53: "300 K" stays on the ground after its cube rises.
    - s35, 35:20–36:07: "343" touches the line.
    - s32, 32:17–33:06: "c h²" touches the curve.
    - s20, from 18:59: "Over Brest" is said, but the gold dot has no label.
    - s09, 7:10: the balloon is cut by the top edge.
    - s48, 48:58–49:07: the stacked notebook icon touches the single one.

## What works (keep)
- The opening title, the arc, the recap (one beat per sentence) and the end card match the house pattern. The maths ending matches the script.
- The s28 cube with its routes, the s09 zoom-reveal and the s46 data table. "−u·∇T = +3.7" links voice and screen well.
- s42's large globe and side-by-side chart, and the separated s43 and s08 swaps.
- Signs and numbers on the frames I read: s07 gradient arrow points towards warmer air (south-west), s16 −8.6, s17 +14.4, s21 +0.069, s34 880.4 / 887.3 / 887.0, s35 343 / 558 / 511 / 517 / 499.

## Limits of this review
- **Audio not assessed.** I cannot hear. The bundle has never been heard. The −16.0 LUFS and −1.5 dBTP are QA's figures. I did not measure the 3 new s09b clips, so the builder's ≤ 0.17 LU is unverified. Listen first to the seams at 7:54 and 8:31, and to the "minus six point two, minus five point six" run at 8:09–8:15. The review-2 listening list also still stands.
- **Motion only sampled.** Mostly one frame per sentence. Steps of 0.5–3 s only in the targeted groups. Word-level reveals were checked only in s09b, s42, s08, s43, s28 and s20, not at ±0.5 s across the movie.
- **Sizes and gaps are by eye** from frames, not measured from the DOM. Times marked "about", and scene start and end times in Must 9, are bounded by the frames I saw.
- **Not re-done.** I re-derived only the s09b gaps; other numbers were read against the script and the review-2 check. Physics parity, equation presence, flashes and caption limits rest on `qa.json`. `overlap.json` not opened. No colour-blind simulation. The reference movie was not re-opened frame by frame.
- **Wind streaks** differ between the sampled s20 frames, so I take them as animated, but did not measure their speed.

## Overall: FIX (ch00_derivatives_taylor review 3 — 9 Must, 12 Should)
Not `qa_pass`. All nine Musts are TSX changes with no TTS. Re-review s07, s08, s09b, s19, s20, s34, s36, and each scene that gains a colour bar.

**Disk.** C: 64 GB free and G: 488 GB free, at the start and at the end. This review wrote 60 MB on G: and three small helper files to the session scratchpad on C:.


---

## ch00_weather_basics UF2 — review 3 (2026-11-04, fix loop 2, source commit 4269d36)

**Movie:** `movies/out/ch00/ch00_weather_basics/1080.mp4`: 58:06.0 (3486.00 s; narration ends 3483.50 s), 156.74 MB, 1920×1080, 30 fps, 73 scenes, 492 sentences, 874 cues.

**How I looked:**
- Tiled sheets at 640 px a tile (and 480 px for overviews) built from the 1-fps scan `uf2/vscan_fix2/`.
- About 150 extra frames pulled with ffmpeg, at 0.13–0.5 s steps, at every review-2 item and every scene boundary I suspected. Crops at native scale for labels, slope triangles, cross-fades and credits.
- Captions parsed against `timing.json`. Speech presence in the 4 spliced sentences checked with an RMS envelope of the movie's audio.
- Frames and sheets: `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/review_uf2_3/` (112 MB; single frames in `fr/`).

**Limits:** stills only, so motion is judged from frame runs. I cannot hear the audio: the envelope shows speech filling each spliced sentence's window and quiet gaps around it, at the same levels as unspliced neighbours. That is not a listening check. Pixel sizes marked ≈ are by eye from frames.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_weather_basics UF2 fix 2 | 58:06 (3486.0 s) | 156.74 MB | 11 PASS, duration + size FAIL (window config only), equations SKIP; `pass: false` | PASS (fronts, hemisphere words, tropopause numbers, s48b 92 km, RH 73 %, sea-level pressure, knots) | gate SKIP; KaTeX seen rendered, no error boxes, no labels or references | FIX (s47 bar double exposure, s48 "50 km" on the line) | FIX (s39 whip pan) | PASS (874 cues, 0 violations, max 16.83 cps, text = script, out copy identical) | PASS (0 flashes; blue/red front symbols, no red/green-only) | n/a (retired) | **FIX** |

**Verdict: FIX. 4 Must and 18 Should.** Fix loop 2 cleared 13 of the 16 review-2 Musts, all four narration changes, and about 15 of the 25 Shoulds. Two Musts are left over (R2-M1 in s48, R2-M6). Two are new (a whip pan in s39 and a double colour bar in s47). Every Must is a TSX change; no TTS is needed.

### Narration splices and captions
| change | on screen and in the captions | result |
|---|---|---|
| s38b S4 "Over Europe, on that day, …" (41:16.07–41:22.80) | cue 41:16.07 "Over Europe, on that day, that / happens at about ten kilometres,"; keyword "Europe, 2 Nov: ≈ 10 km, ≈ −50 °C" by 41:16.7 (frame `fr/f02476.70.png`) | PASS |
| s48b S3 "On the lower layers, …" (49:43.45–49:49.97) | cue 49:43.45; keyword "gold: the cold front / on the lower layers" (49:45.5) | PASS |
| s48b S4 "… about ninety-two kilometres back between one point three and three point four kilometres up" (49:50.32–50:02.40) | cue 49:56.36 "about ninety-two kilometres / back between one point three and"; labels "1.3 km", "3.4 km" and keyword "≈ 92 km back / from 1.3 to 3.4 km up" (49:58.5). The link ends on the tie between the two lines, not on a label | PASS |
| s25 S6, new sentence (27:46.33–27:58.15) | cues 27:46.33 and 27:50.35; "Paris ≈ 11.7 km" appears on "eleven point seven" (27:53); colour-bar title "tropopause height, Nov 2023 average"; balloon label "Paris balloon, 1 Nov: ≈ 11 km" | PASS |
| caption track | 874 cues, 0 over 2 lines × 42 chars or 17 cps, max 16.83 cps, last cue ends 3483.20 s, joined text = script, `out/` copy byte-identical. One cue (10:03.243–10:08.125, "delta p. It's negative, …") spans the 0.35-s gap between two sentences: harmless, noted | PASS |
| audio envelope | each spliced sentence: body −21.5 to −24.6 dB RMS, edges and gaps −36 to −40 dB, the same pattern as the neighbours | consistent; not heard |

### Review-2 Musts
| item | state | evidence (frame) |
|---|---|---|
| R2-M1 slope labels | **s47 FIXED, s48 NOT FIXED** | s47 48:05.5–48:18: both legs gold, "1 km" on its word (≈ 48:05.8), "50 km" above the horizontal leg (48:07.5), "heights × 80" from 48:05.5 (`s47_tri.jpg`). s48 48:55.5–49:27: "50 km" ends on the thick line, about 0–5 px. The triangle is tiny: horizontal leg ≈ 40 px, legs ≈ 3 px (`s48_tri2.jpg`). → Must 1 |
| R2-M2 "lower layers" | FIXED | 49:45.5 keyword and words agree |
| R2-M3 1.3 / 3.4 km, 92 km | FIXED | 49:58.5 (`s48b_lab.jpg`); 43.93 km/km × 2.1 km ≈ 92 km |
| R2-M4 s38b edge-on stack | FIXED | 41:07.5–41:33.5: oblique outside view, drifting up; Europe tropopause outlined and linked at 41:16.7 (`s38b.jpg`, `s38b_kw.jpg`) |
| R2-M5 warming layers, 25 km, balloon column | FIXED | 41:40.5 outlined warm shells; "above ≈ 25 km" on by 41:36.8, right after "twenty-five" (`s38b_25.jpg`); a full gold column through the shells 41:43–41:47 |
| R2-M6 keyword overlap | **NOT FIXED** (moved) | double exposures at 41:08.67 ("colder going up," over "16 heights, up to ≈ 45 km"), 41:35.53 ("warmer again: stratosphere" over the Europe and tropics rows) and 49:33.3 in s48b (`s38b_xf.jpg`, `s48b_xf.jpg`). → Must 2 |
| R2-M7 s39 colour bar + credit | FIXED | bar and ERA5 credit to 42:24.5; the bar fades while it moves up a row at 42:12.3 |
| R2-M8 s46 colour bar on map | FIXED | 46:53.5 bar in the right column above the graph |
| R2-M9 s47/s48 keywords on slice | FIXED | 48:17.5 "tall clouds, heavy showers", 49:12.5 "behind: milder, moister" are above the slice |
| R2-M10 s51 beam on S3 | FIXED | 51:19.0: beam in free air with "1 m" on "a beam one metre wide"; it reaches the ground on S4 at 51:27.5 (`s51.jpg`) |
| R2-M11 s54 credit on globe | FIXED | 53:26–53:34: bottom fade ≈ 45 px above the credit throughout the growth (`s54.jpg`) |
| R2-M12 s22 column on credit | FIXED | 25:30–25:38: column clipped above the credit |
| R2-M13 s20f "8.9 km" covered | FIXED | 18:59, 19:02.5: keyword below, clear |
| R2-M14 s25 link through text | FIXED | 27:44.5–27:57.5: poles row moved right; no link crosses a row (`s25.jpg`) |
| R2-M15 s25 three numbers | FIXED | "Paris balloon, 1 Nov: ≈ 11 km", "Paris ≈ 11.7 km" with the "Nov 2023 average" bar title and S6, "poles: 8–10 km" (voice: "eight to ten") |
| R2-M16 s42 link across keyword | FIXED | 44:24: both links leave the left ends of their rows under the stack; the typhoon row now shows (44:39–44:49), and its "L" sits on the tiny closed contours of the typhoon (`s42ty.jpg`) |

### Review-2 Shoulds
- **Fixed (15):**
  - S1: 2:11.5 halo ≈ 20 px above its credit; 41:47.4 ≈ 17 px.
  - S2: twin solid gold; "true slope" sits by the twin, 49:22–49:27.
  - S3: no stray line, no dashed kink, density row only during the gas law.
  - S5: bar in °C; the stack is no longer cut at the left edge.
  - S8: s36 labels and links clear, 38:09–38:57.
  - S12: s49 and s50 bars in one place.
  - S13: s51 beams longer; "1 m" above the beam.
  - S14: s60 credit on data beats only, 56:35 and 57:31.
  - S15: s32 arrows larger and teal; "v = 6 m/s" on the image.
  - S16: s26 thermals.
  - S18 (s09 part): "faster = warmer" off the rods.
  - S19 (Δz part).
  - S21: no empty ln p axes, 14:25.5.
  - S24 (RH part): "15 ÷ 20.4 ≈ 0.73" at 33:35.5.
  - "south: / reversed" off the mini globe, 45:57.
- **Partly fixed or not addressed:** S6, S7 (credit part), S9 ("1609 m" still ≈ 320 px from the summit), S10 (arrows small and dense), S11 (s47 part), S15 (s35 part), S17, S18 (s12), S19 (s18 struck s²), S20, S22, S23, S25. They are carried into the Should list below.
- **S4:** the user's decision stands (11 layers, sloping surface).

### K6 exemption spot-check (623 INFO)
The 623 are made up of 321 short edge labels on thin rods, 135 spot labels on rods, 83 markers beside their labels, 80 map labels on linework and 4 end labels.
| exemption | verdict | frame |
|---|---|---|
| s13/s14 "1 m" on a gold slab edge rod (8:28–9:47, overlap up to 72 × 14 px) | **Real contact, still legible**: the slab's top edge runs behind "1 m", and at 9:46.9 the teal centre rod passes between "1" and "m" | `k6a.jpg` → Should 15 |
| s55–s58 "Brest" over teal wind glyphs (54:01–56:07) | OK: small glyphs behind a haloed label | `k6b.jpg` |
| s22 "km 30" over teal balloon dots (25:49) | Small contact: a dot touches the "0" | `k6c.jpg` → Should 15 |
| s03 "Brittany" beside its circle (2:28.5) | OK as a marker; the label is still dim (Should 13) | `early1.jpg` |

The gate's 0 hits missed Musts 2 and 4, both text over text during cross-fades. The overlap stills do not sample mid-fade frames.

### Physics and numbers (by hand)
- Fronts:
  - s47: cold air to the west under warm air, and the surface rises westward over the cold air.
  - s48: warm air glides up eastward over the cold air.
  - s58: the Brest wind veers from SSW (204°) to W (271°) at the cold front. 23.2 ÷ 0.514 = 45.1 kt. The pressure minimum comes before the rise. All PASS.
- s44: anticlockwise around the low and clockwise around the high, seen from above (NH arrows: east on the low's south side, south on the high's east side). Southern hemisphere reversed. PASS.
- s51: 1 m / cos 60° = 2 m. The upper beam meets the limb at ≈ 59° from the centre line. PASS.
- s38b:
  - Europe ≈ 10 km / ≈ −50 °C (data 10.1 km / −52 °C), tropics ≈ 16.5 km / below −75 °C (data 16.6 / −77), warming above ≈ 25 km (outlined shells 26.3–47.1 km). PASS.
- s20f: 287 × 263.15 / 9.81 = 7.70 km and 287 × 303.15 / 9.81 = 8.87 km. PASS.
- s40: 835 × e^(1.609/8.43) = 835 × 1.210 = 1010 hPa. PASS.
- s29/s30: 15 ÷ 31.3 = 0.48; 15 ÷ 20.4 = 0.735. e_s(13 °C) ≈ 15.0 hPa (Bolton). PASS. The movie's e_s(18 °C) = 20.4 is about 1 % below the Bolton and Magnus value of 20.6, which does not change "73 %".

### Must (4)
1. **R2-M1, rest: s48, 48:52–49:28: the slope triangle is still on the thick line and too small** (`s48_tri2.jpg`, 48:55.5 and 49:27.0).
   - The "m" of "50 km" ends on the thick line, about 0–5 px away.
   - The horizontal leg is about 40 px and the legs about 3 px, not 6.
   - Fix: draw the triangle at about the s47 size (horizontal leg ≥ 60 px, legs 6 px). Put "50 km" above the leg's middle, ≥ 12 px from the thick line.
2. **R2-M6, not fixed: keyword cross-fades still double-expose text.**
   - s38b, 41:08.67: "colder going up," sits over "16 heights, up to ≈ 45 km / equator → pole".
   - s38b, 41:35.53: "warmer again: stratosphere" sits over "Europe, 2 Nov …" and "tropics …".
   - s48b, 49:33.3: "11 heights …" sits over "the side views, back in the air".
   - Each lasts about 0.2–0.3 s (`s38b_xf.jpg`, `s48b_xf.jpg`).
   - Fix: as asked in review 2, fade the old rows fully out at least 8 frames before the new rows start. Apply it in the shared keyword-swap helper so every scene gets it.
3. **New, s39, 42:09.0–42:09.6 and 42:12.3–42:12.5: whip pan** (`s39c.jpg`).
   - For "the Andes and the Rockies", the globe swings from Tibet over the pole to the Americas in about 0.6 s, about 150° of longitude.
   - Three seconds later it snaps back to Tibet in about 0.2 s, as the Tibet image arrives.
   - This came with the Should 7 hold. A viewer will see a jolt, and it breaks the gentle globe-camera rule (U-WB-R4).
   - Fix: give each move at least 1.5 s. Start the turn to the Americas at the start of "and the Andes" (about 42:09.3) and the return on S5. Or show the Andes and Rockies on a second, small globe beside the main one.
4. **New, s47, 47:40.2–47:41.8: two colour bars drawn on top of each other** (`s47_cb.jpg`).
   - "850-hPa temperature" (−5…15 °C) and "colder / warmer than average" (−8…+8) cross-fade in the same place for about 1.5 s.
   - The ticks read "−85" and "158" (`s47_brest.jpg`, 47:41.0).
   - Fix: fade the old bar fully out before the new one fades in, or put the new bar one row lower.

### Should (18)
1. **s38b, 40:56–41:03 (S6, carried): the colour bar sits on the darkened right part of the zoomed globe** (`s38b_edge.jpg`, 40:58).
   - §5b says "never on a globe or map … in every zoom state". The darkening edge at x ≈ 545 is also a hard vertical line.
   - 41:47.4: the shells end in a hard straight cut along their 0°N edge as the stack pulls out (`band.jpg`).
2. **s39, 41:48.3–41:51 (S7 part): the true-colour globe has no credit for about 2.5 s.** The ERA5 credit fades in at 41:51. Keep the "image: NASA VIIRS …" credit until the image is gone.
3. **s28–s30, 32:21–34:17, and the recap at 57:09: the vapour-pressure curve leaves its graph.** It runs above the 50-hPa top to the frame's top edge (`s28_30.jpg`). No text is hit, but the line leaves its axes. Fix: clip it at the plot box, or take the y axis to 60 hPa and stop the curve at 35 °C.
4. **s05, 3:17–3:22: the column's top is cut flat at y ≈ 40 px.** This shows the 3-D box edge, while the keyword says "top of the atmosphere: no sharp edge". At 3:21 "km 30" is clipped by the frame's top edge (`s05top.jpg`, `s05full.jpg`). Fix: fade the column out before y ≈ 120, and keep the axis labels ≥ 30 px from the edge during the pull-back.
5. **s47, 47:44–48:31 (S11 part): the 850-hPa map under the slice stays coloured with no colour bar of its own.** Fix: grey it out once the wall rises, or keep its bar in a second row.
6. **s57/s58, 54:57–56:07: the wind readouts and the temperature label.**
   - "18 m/s from 204° (SSW)" and "23 m/s from 271° (W)" straddle the map's bottom edge (`s57.jpg`).
   - "−2 °C" next to the 10–14 °C axis reads as a temperature of minus two degrees. Write "≈ 2 °C drop → 10.5 °C" to match the narration.
7. **s57, 55:27–55:28.4: "warm sector" is a new term, spoken and defined, but on screen for only about 1.3 s** before the scene cuts (`ws.jpg`). Bring it in on its word (about 55:26) and carry it into s58 S1.
8. **s35, 37:04–37:38 (S15 part): the credit names "ERA5 10-m wind", but no wind is drawn.** The isobars that are drawn have no credit. Fix: credit the mean sea-level pressure, or draw the wind.
9. **s25 (S17): the tropopause picture is still small, about 660 × 360 px.**
   - "Singapore ≈ 16.6 km, below −75 °C" puts the November-mean height (16.6) with the balloon's temperature, while the chart says "≈ 16 km".
   - Fix: write "Singapore, Nov mean ≈ 16.6 km" and leave the temperature to the balloon chart.
10. **s22, 25:30–25:39: "our estimate: 5.8 km" appears twice,** as a callout on the column and as a keyword below. Keep one.
11. **S20, not addressed: text under the 44-px floor.**
    - 9:39 brace labels.
    - 11:15 "300 m × 12 Pa/m …" and "vertical accelerations ≪ g".
    - 12:45 units row.
    - 15:05 "add up small steps = integrate".
    - 32:45 "set by temperature, not the air".
    - The list from review 2 also stands.
12. **S18 and S19, not addressed.**
    - s12, 7:55–8:12: the stacked fractions still touch.
    - s18, 12:45: the gold link still ends in the struck "s²".
    - s10, 6:03–6:15: "same step" next to the K rod (not re-measured).
13. **S22: "Brittany" is still dim** on the dark east of the map (2:29.5).
14. **S23: the s27c "lowest 1.5 km" bracket is still tiny,** and it sits against the colour-bar title (31:49.5).
15. **K6-exempt real contacts.**
    - s13/s14, 8:28–9:47: "1 m" on the slab edge; the teal rod passes through it at 9:46.9.
    - s22, 25:49: balloon dots touch "km 30".
16. **S9 and S10, rest.**
    - s40: "1609 m" sits about 320 px from the summit. Add a dashed level line to the summit.
    - s44: the wind arrows are small and dense, 45:44–45:57.
17. **QA record.** `qa.json` reads `pass: false` only because the run used the default windows:
    - duration: 3486.00 s against a narration end of 3483.50 s (+2.5 s, inside +0…+5);
    - size: 156.74 MB against the movie's 160-MB budget.
    - The equations gate is "SKIP: no storyboard equations or no --composition" (review 2: 53 present).
    - Re-run with the movie's windows and `--composition`, so the record reads PASS before `qa_pass`.
18. **S25, rest.** The manifest still marks W85 "not yet committed in fluidpy" and W86 "D3 fix in progress, uncommitted". Commit those tests.

### What works (keep)
- s38b now reads: an oblique outside view, the Europe tropopause outlined on its word, the warm shells outlined, "above ≈ 25 km", and a whole balloon column through the shells.
- s48b now matches its words exactly (lower layers, 1.3 and 3.4 km, ≈ 92 km), and the colour bar is in °C.
- s25 explains its three tropopause numbers in words and on screen.
- s51 draws the beam before it lands. The s47 slope triangle and "heights × 80" land on their words.
- Credits sit clear of the globes in s54 and s22, and the recap credits sit on data beats only.
- Opening, arc, recap and end card still follow HOUSE_STYLE §3. There are no headings, boxes, references, equation numbers or badges.

### Disk
C: 45 GB free, at the 45-GB low-space action line in memory (floor 40 GB); this review wrote nothing large to C:. G: 479 GB free. This review wrote 112 MB of frames to G:.

## Overall: FIX (ch00_weather_basics UF2 fix loop 2, review 3: 4 Must, 18 Should)
Not `qa_pass`. All four Musts are TSX changes (no TTS):
- s48 triangle;
- keyword cross-fade helper;
- s39 camera timing;
- s47 colour-bar swap.

After the fix loop:
- re-check s38b, s39, s47, s48 and s48b frame by frame through every keyword swap;
- re-run QA with the movie's windows and `--composition`.


---

# ch00_derivatives_taylor — review 4 (fresh eyes, after fix loop 3) 2026-11-04

**Movie:** `movies/out/ch00/ch00_derivatives_taylor/1080.mp4` (rendered 2026-11-04 04:46): 49:07.4 (2947.40 s; narration ends 2944.88 s), 122.97 MB, 1920×1080, 30 fps, 50 scenes, 426 sentences, 725 cues.

**How I looked:**
- 426 frames at 640 px, one 0.2 s before each sentence ends (times from `timing.json`), as 48 labelled 3×3 sheets.
- 30 full-size frames at every review-3 item and at anything suspicious.
- Strips at 0.1–2 s steps through:
  - the s07 links (4:56–5:35);
  - the s08 swap (6:14.5–6:18);
  - the s09 zoom (6:58–7:16);
  - s09b (7:54–8:32);
  - the two s09b cross-fades;
  - the s47 opening beat.
- One frame from `fix2_1080.mp4` (47:23.5) for comparison.
- The s47 source lines in `DerivativesTaylor.tsx` (read only).
- Frames: `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_derivatives_taylor/review4/` (25 MB).

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_derivatives_taylor (fix 3) | 2947.40 s (49:07.4) | 122.97 MB (budget 120, hard 160) | 14 PASS + **size WARN** (`pass: true`) | PASS on every number checked; **FIX on one picture**: s47 "tangent" misses its curve | PASS: 41 present per QA, KaTeX rendered, no labels or references | PASS: all review-3 collisions are gone; only small contacts left (Should) | PASS | PASS per QA (725 cues = script, SRT = VTT) | PASS (0 flashes; magma, teal/rose and red-blue diverging maps, no red/green-only) | n/a (house) | **FIX** |

**qa.json:** every gate is PASS except `"size": {"status": "WARN", "detail": "122.97 MB (budget 120, hard 160)"}`. The other gates:
- `av_length`: 2947.40 vs 2947.38 s.
- `overlap`: "1425 frames, 0 hits; 473 INFO".
- `loudness`: −16.0 LUFS, −1.5 dBTP.
- `physics`: 67 functions.
- `equations`: 41.

## Vscan edge pixels (376.5 s, 424.5 s, 430.5 s): harmless
| t | scene | what it is | verdict |
|---|---|---|---|
| 376.5 s (6:16.5) | s08 | The sea-level-pressure map slides in from beyond the left frame edge. Only its right part (Brittany) shows, x 0–255. It is in place by 6:17.2 (`strip_s08swap.jpg`). No text is cut. | Harmless motion (see Should 10) |
| 424.5 s (7:04.5) | s09 | The planned full-bleed zoom onto Europe. The globe fills the frame and the top-left fade reaches the edge. Labels, credit and maths are inside the frame. | Harmless (the review-2 S7 design) |
| 430.5 s (7:10.5) | s09 | The zoom-out. The globe's top limb touches the top edge for a few frames, then shrinks. The balloon is ≥ 85 px from the top at 7:09.6. | Harmless |

## Review-3 items: status in the rendered frames
| item | status | evidence |
|---|---|---|
| M1 s19 link through "−11.0 °C" | **FIXED** | 18:15: the "17 km" link runs about 35 px under "−11.0 °C" to the drift arrow's tip (`full_1095.00.jpg`) |
| M2 s19 "−2.6 °C in 12 h" on the curves | **FIXED** | Right of the bracket at x 665–960. Both curves end before x 630 at that height |
| M3 s07 link fan and label row | **FIXED** | Row "colder (north) · 18.4 km · 27.8 km" with gaps of about 45–50 px. Links are shown only on their sentences, never cross, and none lies along an arrow. "gradient" takes the slot on S8. New, smaller problem: Should 1 |
| M4 s08 pressure leaves its graph | **FIXED** | Axis 970–1000. The curve ends at about 976 inside the plot, and the 988.3 / 983.3 labels are clear (`full_0376.50.jpg`) |
| M5 s20 bars into the source line | **FIXED** | Axis ends at y ≈ 820. The source line ends at x ≈ 1098, left of the axis (x 1120). "+2.9" is clear of the guide (`full_1163.50.jpg`) |
| M6 s36 "too cold" on the wrong curve | **FIXED** | Rose "too cold" sits just above the rose dashed lines' left ends, about 12 px from the measured profile (`full_2185.00.jpg`) |
| M7 s34 link reads as a third curve | **FIXED** | No link. "880.4" sits beside the gold ring (34:58) |
| M8 s09b unexplained holes | **FIXED** | "holes: no 1000 hPa level / where the ground is higher" from 7:54.4. All five layers are in by 7:55.0 |
| M9 colour bars | **FIXED** | The bar is under the map in s07, s12, s16 and s17. It is in the column in s08, s37 and s47 S3/S5. The landscape bar is in s11, s13, s14, s37 and s47 S2 |
| Should 1 (s15) | FIXED | Readout and clock in the top row, "100 km/h" under the road, no isotherm through text |
| Should 2 (s07 "Brest") | FIXED | — |
| Should 3 (s43) | FIXED | The thermometer is clear of the dashed bar. Label reads "IPCC 3.2 per °C: ≈ 1.2 °C" |
| Should 4 (s40) | FIXED | No ghost text under the inset |
| Should 5 (s09) | FIXED | — |
| Should 6 (s17) | FIXED | — |
| Should 7 (s17) | FIXED | "place 6.0 °C" with "plane 9.5 °C" at 16:08.8 |
| Should 8 (s09b) | FIXED | Worked line "(2.3 − 20.9) °C / 3.0 km ≈ −6.2" is shown |
| Should 9 (s09b camera) | **PARTLY** | The return to the side angle is clean by 8:28. The links still point off-frame during the close look (Should 8) |
| Should 10 (s42) | FIXED | — |
| Should 11 (maths sizes) | FIXED | — |
| Should 12 | FIXED | s20 "Brest" named at 19:08. s25 "300 K" rises with its cube. s48 icons are apart |

## Physics and numbers re-checked by hand (all PASS)
- s07: ∂T/∂x = (4.51 − 5.69)/36.8 km = −3.2 °C/100 km; ∂T/∂y = −2.5. The gradient arrow points to the warmer south-west, about 40° below west (expected 38°).
- s10: (7.58 − 8.63 − 1.77 + 3.19) = 0.37 °C, and 0.37 / (36 800 m × 7200 s) = 1.40×10⁻⁹.
- s12: −0.32 − 0.50 + 1.45 = +0.63 °C.
- s15: 100 km/h × (−0.03 °C/km) = −3 °C/h.
- s16: −3.2×10⁻⁵ × 100 × 3600 = −11.5, so +2.9 − 11.5 = −8.6.
- s17: +14.4; place 6.0 at plane 9.5.
- s18 / s19:
  - 4260 m / 900 s = 4.7 m/s;
  - −2.6 / 43 200 s = −6×10⁻⁵;
  - 4.7 × (−5.7×10⁻³) = −0.027;
  - the drift arrow points NNE along the isotherms.
- s20: +2.9 − 3.7 = −0.8. The wind is from the SW (warm side), so this is warm advection.
- s21: (−5.7×10⁻³)(−12.2) = +0.069 °C/hPa.
- s23: ∮(y dx − x dy) round the unit square, anticlockwise, = −2.
- s25: −10/290 = −3.45 %; exact 290/300 − 1 = −3.3 %.
- s26: H = 287 × 293 / 9.81 = 8570 m.
- s28: at 280 K, α 0.8 → 1.2 gives 33 kJ/kg (RT ln 1.5). The routes give 27 and 40, and Δη = R ln 1.5 = 116 J kg⁻¹ K⁻¹.
- s31:
  - (9.4 − 13.9)/(2.100 − 1.174) = −4.86 °C/km;
  - 12.3 − 4.86 = 7.4 (balloon 6.9);
  - 12.3 − 4.26 × 4.86 = −8.4 (balloon −11.8).
- s33: e^0.1 = 1.10517; partial sums 1, 2, 2.5, 2.667, 2.708 → 2.718.
- s34: 1.186 × 9.81 = 11.6 Pa/m, so 8.6 m per hPa.
- s40: 2.5×10⁶ / (462 × 273²) = 0.073 K⁻¹; the +4 °C exact value of 33 % holds.
- s41: 1.26 × 7 % ≈ 9 %.
- s42: (240/σ)^¼ = 255 K, and 4 × 240/255 = 3.8 W m⁻² K⁻¹.
- s43: 3.9/3.8 = 1.04 °C.

## Must fix (1)
1. **s47 S1, 47:19.1–47:24.8: the recap's "slope of the tangent" line never touches the curve** (`strip_s47a.jpg`, `full_2843.5.jpg`).
   - What is wrong: the gold line runs parallel to the parabola, about 6 units (≈ 130 px) above it. It does not pass through the gold dot at x = 3.
   - Why it is a Must: this is the picture that defines the derivative in the summary.
   - Cause in source (`DerivativesTaylor.tsx`, S47, the `<path d={poly([P(1, 3), P(5, 27)])} …>` beside `<Dot p={P(3, 9)} …>`): it draws y = 6x − 3. The tangent to y = x² at x = 3 is y = 6x − 9.
   - Fix: `poly([P(1.5, 0), P(5, 21)])` (or `P(1, -3)`, already clipped by `r0`). TSX only, no TTS.
   - History: the error is the same in `fix2_1080.mp4`. Reviews 1–3 missed it.

## Should fix (14; cosmetic, none blocks understanding)
1. **s07 S7–S8, 5:33.8–5:41.3: orphan "colder" labels.**
   - The "colder (north)" link appears only about 0.6 s before S7 ends.
   - On S8 both "colder" links are gone, but the labels stay. "colder (east)" then sits alone right under the ∂T/∂y result "≈ −2.5 °C/100 km", which invites the wrong pairing (`full_0340.90.jpg`).
   - Fix: start the north link on "towards the north" and hold it ≥ 1.5 s. Fade both "colder" labels with their links at S8.
2. **s15, 14:20–14:45: the car readout is computed at the car's rear bumper.**
   - The car's centre is about 40 px (≈ 0.5 °C) further east. At 14:35 the car reads "4.3 °C" while its centre sits at about 3.7 on the isotherm scale (`full_0875.30.jpg`).
   - Fix: place the car's centre (or a small sensor dot) at the computed position.
3. **s19 S10, 18:21–18:31: the "∂T/∂z" tag touches the gold profile and the thin 00-UTC curve** at the top of the "z" (`full_1105.00.jpg`). Fix: move it about 20 px down-left, into the empty part of the plot.
4. **s12, 11:25–12:01: the two gold links from "10 km" and "20 km" cross** inside the map near the arrows.
5. **s23, 21:51–22:50: cramped stack.** The ∂x denominator of M's fraction sits between the two ∂²f numerators of the next row (`full_1352.00.jpg`). Add about 25 px between rows 2 and 3.
6. **s31, 30:56–31:58: the gold tangent passes through the "z₀" label** (`full_1910.00.jpg`).
7. **s44 and s45, 43:58–45:53: the step label "h" straddles the x-axis line** (`full_2721.00.jpg`). Lift it above the axis.
8. **s09b close look, 8:23.5–8:26.5: links point to layers that have left the frame.** The "−6.2" and "−5.6" links point to the lower layers, which are out of shot, so they end in empty space or at the bottom edge. Fade those links during the close look.
9. **Scene cross-fades double-expose text for about 0.2–0.3 s.**
   - 7:54.2–7:54.5: "northern France, one moment" over "30 Sep 2026, 12 UTC", and "holes: …" over the ∂T/∂z fraction.
   - 8:31.95–8:32.15: s09b labels inside the s10 box.
   - Fix (if the house cross-fade is touched): fade out before fade in.
10. **s08, 6:16.3–6:17.0: the isobar map slides in from beyond the left frame edge** (the vscan hit). This is harmless, but a fade would match the house's gentle-motion habit.
11. **s27 S7, 26:42: "balloon" appears about 7 s before its dots** (the dots arrive on S8).
12. **s18, 16:30–17:09: "1212 s after launch" ends about 10 px from the gold 1.53-km dot.**
13. **s10, 8:31–9:30, and s23, 21:39–22:35: an empty grid box stays up for about 55–60 s** before its corner values or loop arrive. QA halves PASS; the box is static but carries nothing new.
14. **Size:** 122.97 MB is above the 120 MB budget (WARN, under the 160 MB hard cap).

## What works (keep)
- Every review-3 Must is gone in the rendered frames.
- The s07 sentence-by-sentence links now read cleanly.
- The s19 and s20 bar panels are clean.
- The s09b stack (holes explained, worked line, return to the side view) works.
- The s40 inset is clean.
- Colour bars sit on every coloured field.
- House style holds:
  - opening title and arc;
  - recap one beat per sentence;
  - series end card with the notebook line and the topic list;
  - keywords only;
  - no headings, boxes, equation numbers, references or badges;
  - data-source lines under every data frame;
  - "lake or sea (illustrative)" marks the decorative scene.

## Limits
- Audio not heard (QA's loudness figures only).
- Motion judged from sentence-end frames plus the strips above.
- Pixel gaps are by eye from frames.
- Captions, flashes, physics hashes and equation presence rest on `qa.json`.
- No colour-blind simulation run.

**Disk.** C: 53 GB free and G: 478 GB free, at the start and the end. This review wrote 25 MB of frames on G: and two small helper files in the session scratchpad on C:.

## Overall: FIX (ch00_derivatives_taylor review 4 — 1 Must, 14 Should)
The one Must is a one-line TSX coordinate fix in s47 (the recap tangent: y = 6x − 9, not 6x − 3). It needs no TTS and no timing change. After that fix and a re-render of s47's first beat (47:19–47:25), a frame check of those seconds is enough for `qa_pass`; no further full review is needed. The Shoulds are optional polish.

### ch00_derivatives_taylor — review 4 Must closed (orchestrator, 2026-11-04)
- s47 tangent: source dd9cfb7 (`poly([P(1.5, 0), P(5, 21)])`, y = 6x − 9); bundle rebuilt (27 hand-staged `public/dt_*` assets copied from the previous bundle), piece c085000 re-rendered, 89 pieces rejoined. Frame 47:23.5 checked: the line touches y = x² at the gold dot (3, 9).
- movie_qa PASS (av_length 2947.40/2947.38 s; size WARN 122.95 MB). The 14 Shoulds are carried into the §5b retro-fit (fix-loop limit reached).
- **Status: FINAL**: G: viewing `4_derivatives_taylor_FINAL.mp4` + Drive.


---

# ch00_weather_basics — UF2 review 4 (fresh eyes, after fix loop 3) 2026-11-04

**Movie:** `movies/out/ch00/ch00_weather_basics/1080.mp4` (rendered 2026-11-04 08:09).
- Length 58:06.5 (3486.47 s; narration ends 3483.95 s); 156.46 MB; 1920×1080; 30 fps.
- 73 scenes, 492 sentences, 874 cues.

**How I looked:**
- 492 frames at 640 px, one 0.25 s before each sentence ends (times from `timing.json`), read as 55 labelled 3×3 sheets.
- Strips at 0.1–0.5 s steps through:
  - s39 (42:06–42:17.5);
  - the s47 colour-bar swap (47:37.5–47:44.5);
  - s48 (48:40–49:29);
  - the three review-3 cross-fades (41:08, 41:35, 49:33);
  - the fix-3 K6 hit frames (18:45.6, 19:59.3, 24:02.9, 30:56.9, 31:45.7);
  - s60 (56:37–56:46), s45 (46:30) and s02 (0:48.2–0:50.5).
- Full-size frames and crops at the s47 and s48 triangles, s22, s25, the s13/s14 slab, s38b, s59 and s02.
- Audio: a 50-ms RMS envelope and a sample-jump scan of the two re-voiced sentences (s50 S3, s59 S2), plus the VTT text for both.
- Frames: `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_weather_basics/review4/` (40 MB). Nothing large was written to C:.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_weather_basics UF2 fix 3 | 58:06.5 (3486.47 s) | 156.46 MB (cap 160) | 15/15 PASS (`pass: true`) | PASS (every number below re-computed by hand; fronts, hemisphere words and wind sense right) | PASS (53 present per QA; KaTeX rendered; no labels or references) | PASS (no text over text; small contacts only, Should) | PASS (s39 move ≈ 2.5 s each way) | PASS (874 cues = script; both re-voiced cues match) | PASS (0 flashes; blue/red diverging and magma maps, no red/green-only) | n/a (retired) | **PASS** |

**qa.json:** every gate is PASS.
- `duration`: 3486.47 s against a narration end of 3483.95 s (window 120–3600 s).
- `av_length`: 3486.47 against 3486.45 s.
- `size`: 156.46 MB (budget 160).
- `codec`, `black`, `frozen` (232 stretches, all narrated), `content`, `halves`: PASS.
- `overlap`: 3387 frames, 0 hits.
- `loudness`: −16.3 LUFS, −1.8 dBTP.
- `flashes`: 0 per second.
- `captions`: 874 cues; `subtitles`: SRT = VTT.
- `physics`: 74 functions; `equations`: 53.

## Pass 1: review-3 items in the rendered frames
| item | status | evidence |
|---|---|---|
| M1 s48 slope triangle | **FIXED** | 48:56.5 (`crop_s48tri.jpg`): the horizontal leg is ≈ 66 px, the vertical leg ≈ 103 px, both legs ≈ 6 px. "50 km" sits above the leg, ≈ 25 px from the thick line; "1 km" is left of the vertical leg. Drawn ratio 103/66 = 1.56; the line's own slope is 380/245 = 1.55; the expected ratio is 80 × 1/50 = 1.6 (perspective takes off the rest). The legs close on the line. |
| M2 keyword cross-fades | **FIXED** | No two text blocks are visible together at any swap I sampled.<br>41:08.0–41:09.1: "16 heights…" is gone by 41:08.4; "colder going up," starts at 41:08.7.<br>41:34.9–41:36.0: the Europe row leaves first; the tropics row fades to ≈ 30 % as "warmer again" starts at 41:35.6. The two are at different heights, and the tropics row is gone by 41:35.7.<br>49:32.7–49:33.8: "the side views…" is gone by 49:33.2; "11 heights…" starts at 49:33.5.<br>Also clean: 18:45.6–46.9 (s20f), 19:59.3–20:00.7 (s20g "same weight?" → h = p₀/(ρ₀g), with 0.36 s of empty column between), 24:02.9–04.3 (s21), 30:56.9–58.3 (s27b), 31:45.7–47.0 (s27c), 46:30 (s45), 56:37–56:39.4 (s60). |
| M3 s39 globe move | **FIXED** | Tibet holds to 42:09.0. The turn over the pole runs 42:09.0–42:11.5 (≈ 2.5 s, no jolt between frames 0.5 s apart). The return runs 42:13.0–42:15.0 (≈ 2 s) beside the Tibet image. "Tibet < 600 hPa" leaves at 42:09.0, before the turn. |
| M4 s47 two colour bars | **FIXED** | 47:40.14: the 850-hPa bar is fading and the map is dimming. 47:40.47: there is no bar. 47:40.80: the slice bar fades in. Only one bar is on screen at any time. |
| S1 s38b bar on the darkened globe | NOT FIXED (as logged) | 40:53–41:03: the bar still sits on the K1-dimmed right half of the zoomed globe, and the K1 dark band has a hard vertical edge at x ≈ 1090 (`full/40_58.00.jpg`). → Should 2 |
| S2 s39 credit | FIXED | 41:50.3: "Image: NASA VIIRS true colour…" is under the true-colour globe |
| S3 e_s curve | FIXED | 32:32 and the recap at 57:15: the curve ends at the 50-hPa top, inside the plot |
| S4 s05 top | FIXED | 3:21.7: the column fades out towards the top; "km 30" is faded, not clipped |
| S5 s47/s48 map without a bar | FIXED | 47:40.5 onwards: plain grey ground under the slice |
| S6 s57/s58 readouts, "2 °C" | FIXED | 55:19.8 and 55:53.3: the readouts are below the map. 56:01.4: "2 °C / colder" is beside the drop, 12.5 → 10.5 °C |
| S7 "warm sector" | FIXED | It arrives at 55:28.5 and stays through s58 S2 (55:41.4) |
| S8 s35 credit | NOT FIXED (as logged) | 37:30: the credit says "ERA5 10-m wind", but the frame shows isobars, not wind arrows. → Should 6 |
| S9 s25 text | FIXED (the picture is still small) | 27:33.8: "Singapore, Nov mean ≈ 16.6 km" |
| S10 s22 duplicate | FIXED | 25:39.6: "our estimate: 5.8 km" appears once |
| S11 small text | NOT FIXED (as logged) | Brace labels at 7:05, 9:37 and 10:36; "300 m × 12 Pa/m…" at 11:10. → Should 9 |
| S12 s12 fractions | FIXED | 7:55–8:12: the rows are separated. The s18 link still ends in the struck "s²" (12:45), and s10 "same step" is fine |
| S13 "Brittany" | FIXED | 2:28.6: drawn clear and bright |
| S14 s27c bracket | NOT FIXED (as logged) | 31:45.7–31:49: the gold "lowest 1.5 km" bracket is still a ≈ 10-px tick at the stack's front corner |
| S15 contacts | PARTLY | s22: the balloon dots now run between the rod and the column (25:36), FIXED. s13/s14: "1 m" still sits on the slab's top face across its gold edge (8:28–9:54, `crop_slab.jpg`), Should 8 |
| S16 s40 "1609 m" | FIXED | 42:50: a dashed level line runs to the summit town |
| S17 QA record | FIXED | `pass: true`, equations 53 |
| S18 W85/W86 tests | FIXED in fluidpy, manifest stale | fluidpy commit fc51cf0 (2026-10-30) holds `tests/diag/test_column_integral.py` and `test_front_by_level.py`. `manifest.json` lines 66 and 68 still say "not yet committed" / "uncommitted". → Should 12 |

## Re-voiced sentences (s50 S3, s59 S2)
| sentence | captions | on screen | audio (envelope; not heard) |
|---|---|---|---|
| s50 S3 51:04.68–51:08.90 "Later in this series, you'll learn to read these maps in detail." | VTT 00:51:04.675 → 00:51:08.900, 2 lines, text = script | "weather maps: later" (51:08.7) | Speech from 51:05.15 to 51:08.1, at −12 to −30 dB. The gaps before and after sit at −37 to −40 dB, the same floor as the neighbours. No sample jump at the splice edges (largest jumps are inside speech) |
| s59 S2 56:17.05–56:22.22 "Later in this series, we'll learn to read weather maps like this one in detail." | VTT 00:56:17.050 → 00:56:22.225, text = script | "weather maps: later", then "why the wind circles →" on S3 | Speech from 56:17.5 to 56:21.3. Edges and gaps at −37 to −42 dB, like the neighbours; no step and no click |

## Pass 2: fresh full pass
**Physics and numbers re-checked by hand (all PASS):**
- s02: 12/6371 = 0.0019 ≈ 0.002, and 0.002 × 150 mm = 0.3 mm.
- s05: 101 325/9.81 = 10 329 ≈ 10 300 kg.
- s08: 5 × 4 × 2.5 = 50 m³, and 50 × 1.2 = 60 kg.
- s11: 101 325/(287 × 288.15) = 1.225.
- s12: 1.293, 1.165, and (1.29 − 1.16)/1.29 = 10 %.
- s16: 1.225 × 9.81 = 12.0 Pa/m; 100/12 ≈ 8 m; 300 × 12 = 36 hPa → 977 hPa.
- s18: the units J kg⁻¹ K⁻¹ · K ÷ m s⁻² reduce to m.
- s18b: 287 × 288.15/9.81 = 8430 m.
- s20: 1013/e = 373 hPa and 1013/e² = 137 hPa. Both dots sit at the right axis positions (x = 151 and 97 px).
- s20e:
  - p₀/H = 12.0 Pa/m;
  - the tangent meets p = 0 at z = H;
  - the tangent's area construction gives 37 %: ∫_H^∞ p dz / ∫_0^∞ p dz = e⁻¹.
- s20f:
  - "5 km → 13.43 km: × 0.37": the dots sit at 559 and 206 hPa;
  - H = 7.70 and 8.87 km.
- s20g: 101 325/(1.225 × 9.81) = 8432 m.
- s20b:
  - 1/8.43 = 0.119;
  - e^(−1/8.43) = 0.888;
  - the gap to the tangent is 899.6 − 892.8 = 6.8 ≈ 7 hPa;
  - 1st km −113.4, 2nd km −100.7 hPa; the bars are in proportion.
- s20d: 8.43 × ln 2 = 5.84 km; 11.7 km ↔ 253 hPa. Both dots are placed right.
- s23: (13 + 62)/11 ≈ 6.8 °C/km (labelled −6.5).
- s27b: 29/18 = 1.61, and 1.61 × 0.020 × 1000 = 32 hPa.
- s28–s30: ×2 per 10 °C (6, 12, 23, 42 hPa); 15/31.3 = 0.48; 15/20.4 = 0.73; dew point 13 °C.
- s31: 12 ÷ 8 = 1.5 km; the crossing sits at 1.5 km.
- s32: √(8² + 6²) = 10. The drawn legs are 90 and 65 px (expected 0.75).
- s33: 233° = south-westerly; the arrow points north-east.
- s34:
  - 36 km/h;
  - 1852/3600 = 0.514 m/s per knot;
  - 19.4 kt;
  - 60 × 1852 m = 111 km for 1°.
- s36: 287/365 = 79 % ≈ 8 days in 10.
- s40: 835 × e^(1.609/8.43) = 1010 hPa.
- s44: anticlockwise round the low and clockwise round the high, seen from above, in the NH; the southern hemisphere is reversed.
- s47 triangle: 93/63 px against a line slope of 1.49 (cold air to the west; the surface rises westward over it).
- s48: the warm front rises eastward over the cold air.
- s48b: 2.1 km in 92 km ≈ 1:44.
- s50 symbols:
  - triangles on the south side of the east–west cold front;
  - half circles on the north side of the warm front.
- s51: 1 m/cos 60° = 2 m.
- s53: north-east trades in the NH, south-east trades in the SH, westerlies, and storms moving west → east.
- s56: 997 → 962 hPa is −35 hPa in 13 h (12 → 01 UTC).
- s58: 23.2/0.514 = 45.1 kt; the wind turns SSW (204°) → W (271°) at the cold front.

**Data frames:**
- Every real-data frame has a source line under the picture.
- Every coloured data field has a colour bar with units, except the s60 recap map (Should 1).

**House style:**
- Opening title s00 and the hook.
- Keywords only.
- No headings, boxes, equation numbers, references or badges.
- Gold picture-to-number links.
- The recap runs one beat per sentence.
- The series end card has the notebook lines (57:43–58:03).

## Must fix (0)
None. Every review-3 Must is gone in the rendered frames, and the fresh pass found no wrong physics or maths, no text over text, and no broken teaching step.

## Should fix (16; cosmetic or polish, none blocks understanding)
1. **s60 S7, 57:22–57:31: the recap 850-hPa temperature map has a source line but no colour bar.** House rule U-WB-R2 asks for a bar on every coloured field. Fix: add the −5…15 °C bar beside the thumbnail, or show the map without its colours.
2. **s38b, 40:53–41:03 (review-3 S1, carried):**
   - The colour bar sits on the dimmed right half of the zoomed globe (§5b: never on a globe "in every zoom state").
   - The K1 dark band has a hard vertical edge at x ≈ 1090 (`full/40_58.00.jpg`).
   - 41:47: the shells are still cut straight along 0°N.
3. **s22, 25:14–25:39 and 25:49: the height axis reads low against the column, because of perspective.**
   - The axis rod (x = −0.6) stands behind the column, so its zero sits ≈ 35 px above the column's base.
   - Unzoomed (25:17–25:25): the "measured: half at 5.5 km" ring reads ≈ 3.3 km on the ticks.
   - Zoomed (25:36): the ring reads ≈ 5.0 km and the "our estimate" end of the bracket reads ≈ 5.5 km.
   - 25:49: the box top behind "16 km: 90 % below" reads ≈ 14 km.
   - The labels carry the right numbers, and the 3-D placement is correct.
   - Fix: put the ticks on the column's front-left edge (x ≈ −0.05), or put the ring and the bracket on the rod.
4. **s02 S4→S5, 0:49.0–0:49.4: the cut-face globe cross-fades with a whole globe that is offset ≈ 140 px to the right.** For ≈ 0.3 s the ghost runs behind "true thickness / weather layer / Earth's radius" and through "6371 km". It has a hard vertical left edge (`crop_s02.jpg`). The text stays on top and is readable. Fix: register both globes on the same centre, or turn the half instead of cross-fading.
5. **s47 S2, 47:41.1–41.5: the "Brest" map label stays on top of the rising slice wall** (red on red, then a ghost "rest"). Fade the map labels with the map before the wall rises.
6. **s35, 37:18–37:38 (review-3 S8, carried):** the credit names "ERA5 10-m wind", but the frame shows isobars, not wind arrows. Credit the mean sea-level pressure.
7. **s47 S4–S5, 47:55–48:02: "cold 1.29 · warm 1.16 kg/m³" are the 0 °C and 30 °C densities from s12,** not the slice's air masses. Those differ by ≈ 8 °C, about 3 % in density. Write "(0 °C vs 30 °C)" or give the slice's own numbers.
8. **s13/s14, 8:28–9:54 (carried):** the right "1 m" sits on the slab's top face, across its gold edge; the left "1 m" touches the slab corner (`crop_slab.jpg`).
9. **Small text (review-3 S11/S20, carried):**
   - 7:05: "density · gas constant · temperature (K)" braces nearly touch.
   - 6:20: "density temperature" reads as one phrase.
   - 9:37: brace labels.
   - 11:10: "300 m × 12 Pa/m…".
   - 32:50: "set by temperature, not the air".
10. **Lines leaving their axes:**
    - s17, 11:55–12:00: the gold "falls fast" tangent runs past the 1000-hPa end and below z = 0.
    - s25, 27:19–27:58: the Singapore sounding's surface point (+28 °C) is drawn ≈ 12 px right of the axis end (+22 °C).
11. **s09, 5:40.1 (S1 end): two bare vertical axis lines with no labels.** Also, the °C/K scales are not linear: 0 → 15 is drawn ≈ 24 px, where 0 → −273 is ≈ 180 px. It should be ≈ 10 px.
12. **manifest.json lines 66 and 68 are stale.** W85/W86 are committed in fluidpy (fc51cf0); change "not yet committed" / "uncommitted" to the commit.
13. **s27c, 31:45–31:49 (carried):** the "lowest 1.5 km" bracket is a ≈ 10-px tick.
14. **s39, 42:09.3–42:11.0:** "Andes" and "Rockies" are labelled ≈ 1.7 s after "Andes" is spoken (the §5b target is ≤ 1 s).
15. **s21, 23:53.8:** the "radiosonde" link ends ≈ 55 px right of the balloon, in empty sky.
16. **s18, 12:45 (carried):** the gold link ends in the struck "s²". **s25:** the 3-D tropopause map is small (≈ 660 × 360 px).

## Verified (keep)
- **The 68 keyword swaps:** every sampled swap leaves ≥ 0.25 s of clear column between the old and new text. That covers the three review-3 failures and all seven fix-3 K6 hit frames.
- **The s39 globe move:** gentle and centred, with ≈ 2.5 s each way.
- **The s47 single colour bar:** the old bar leaves before the new one arrives, and the map turns grey with its bar.
- **The s48 slope triangle:** large, legs 6 px, "50 km" clear of the line, and the geometry right.
- **Re-voiced s50/s59 sentences:** the captions match the script; the keywords say "weather maps: later"; no seam shows in the envelope.
- Source lines on every data frame; colour bars on every coloured field except Should 1.

## Limits
- Audio not heard (envelope only).
- Motion judged from frame runs.
- Pixel sizes by eye from frames.
- The 68 swaps were sampled (12 of 35 scenes frame by frame), not exhaustively; the rest rest on `swap_check.mjs` and the QA overlap gate.
- No colour-blind simulation run.

**Disk.** C: 53 GB free at the start and 52 GB at the end; G: 474 GB and then 472 GB. This review wrote 40 MB of frames to G: and small helper scripts to the session scratchpad on C:.

## Overall: PASS
ch00_weather_basics UF2 fix 3, review 4: 0 Must and 16 Should. The movie can become `qa_pass`; the user watches it before `/approve-movie`. The Shoulds are optional polish for a §5b retro-fit. If one of them is taken, Should 1 (the recap colour bar) and Should 3 (the s22 axis) are the most visible.

---

# ch00_coordinates build 1, review 1 (fresh eyes) 2026-11-04

**Movie:** `movies/out/ch00/ch00_coordinates/1080.mp4` (rendered 2026-11-04 20:16).
- Length 48:46.27 (2926.27 s; narration ends 2923.75 s + 2.5-s hold); 154.60 MB; 1920×1080; 30 fps.
- 49 scenes, 453 sentences, 714 cues.

**How I looked:**
- 453 frames at 640 px, one 0.25 s before each sentence ends (times from `timing.json`), read as 51 labelled 3×3 sheets.
- Full-size frames at 34 suspicious moments, and crops of the s11 arrow (8:49, 8:54).
- Narration checked line by line against the screen; every spoken number re-computed by hand.
- Frames: `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates/build1/review1/` (25 MB). Nothing large written to C:.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_coordinates build 1 | 48:46.3 (2926.27 s) | 154.60 MB (cap 160) | 14 PASS, halves WARN | numbers PASS. Pictures FIX: s31/s33/s34 bands mirrored into the SH; s11 radial arrow invisible; s26 readouts unexplained | PASS (29 present; one raw-TeX label `u_θ`/`u_r` in s14) | FIX (clipped labels s09/s16/s29; text over text s41/s45; text over globe s29; links through text s11/s43) | mostly PASS (s14b heights unspoken on screen; s27 bottom half empty) | PASS (714 cues = script) | PASS (sequential yellow-green, RdBu, rose+hatch; 0 flashes) | n/a (retired) | **FIX** |

**qa.json:** 14 gates PASS. `halves` is WARN:
- right half 272.0–276.0 s, 1508.5–1512.0 s and 2020.5–2024.0 s.
- `overlap`: 4086 frames, 0 hits (1133 INFO).
- `loudness`: −16.3 LUFS, −3.5 dBTP.
- `physics`: 72 functions; `equations`: 29.

**The three halves WARN spans** are s07 S0 (4:32–4:36, before "radians"), s24 S9 (25:08–25:12, the zoom-out) and s33 S0 (33:40–33:44, before "area stretch").
- In each one the left picture is full, and the gap lasts 3.5–4 s.
- A viewer would barely notice. Should 18.

**K6 0 hits did not catch** these faults:
- raw-TeX text;
- labels clipped at a canvas edge (s09, s16, s29);
- a label touching a KaTeX block (s41);
- links crossing each other or text (s11, s43);
- a calculation over the globe limb (s29);
- an axis line through a word (s45).

Most of the Musts below are in those classes.

## Build-reviewer flags: confirmed or closed
| flag | verdict |
|---|---|
| s44 uniform wind "adds nothing" vs 0.26 m/s on the sphere | **CLOSED.** The argument is exact on a flat circle. On the 200-km ring the residual is 0.26 m/s of spin and 0.09 m/s of inflow, ≈ 2 %, below the spoken precision ("about fourteen", "about six"). The screen says "adds ≈ 0" (45:22). No change needed. |
| s40 Pinellas coast 353.1° vs 355.4° | **CLOSED, with a manifest note.** The two bearings give +11.5 and +12.1 m/s across the shore; "about eleven and a half" is within 5 %. Record the coast segment used (355.4°) in the manifest. Should 15. |
| DC12 definition (std of v_t, v_r vs u, v) | **Should 3.** The spin curve is steady, but the inflow curve swings 0 → −35 m/s (10:07–10:19). "Two fairly steady numbers" overstates the inflow; "always negative" is the honest point. |
| DC42/43 nearest HRRR point | CLOSED. √(9.4² + 31.6²) = 33.0 m/s; the wind comes from ≈ 222° (SW). |
| DC53 right/left-of-track sectors called "south/north side" | CLOSED. The sectors are centred SSE and NNW. True north/south sectors give 20.6/6.5 m/s, which tell the same story. |
| s14 GOES eye image never shows | **CONFIRMED → Must 1.** |
| s45 cramped | **CONFIRMED → Must 14.** |
| s39 links converge | CONFIRMED, minor. The three links meet at Fort Myers Beach and cross the wind arrow and the across band (40:16). → Should 12 |

## Physics and numbers re-checked by hand (all PASS)
- s04–s05: √25 = 5; tan⁻¹(4/3) = 53.1°; 5 × 0.6 = 3; 5 × 0.8 = 4.
- s06: 90 − 53 = 37°; a west wind blows east.
- s07: 1 rad = 57.3°; 5 × 0.2 = 1 km; 50 × 0.2 = 10 km.
- s08/s10:
  - r̂ = (0.6, 0.8); θ̂ = (−0.8, 0.6);
  - 10 × 0.6 = 6; 10 × (−0.8) = −8, clockwise seen from above;
  - √100 = 10.
- s09: dr̂/dθ = θ̂ and dθ̂/dθ = −r̂.
- s11:
  - 37 m/s = 133 km/h;
  - 135 kt = 250 km/h;
  - anticlockwise in the NH;
  - inflow angle tan⁻¹(12.5/37) = 18.7° ≈ 19°.
- s13:
  - 37²/25 000 = 0.0548 ≈ 0.055 m/s²;
  - 9.81/0.0548 = 179, "almost 200";
  - the chain rule gives −v²/r r̂, inward;
  - f v at 26.6° N = 0.0024 m/s², so "mostly the pressure force" is right.
- s16–s18:
  - Brest sin 48.4° = 0.748, so 6371 × 0.748 = 4765 ≈ 4760 km;
  - cos 48.4° = 0.664, so 4230 km;
  - λ = −4.5° = 355.5°.
- s19:
  - 7.29e-5 × 6.371e6 = 464.5 ≈ 465 m/s;
  - × 0.664 = 308.5 ≈ 309 m/s;
  - Longyearbyen (78.2°) gives 95 m/s.
- s20–s22:
  - 6371 × 0.017453 = 111.2 km;
  - 1′ = 1.853 km;
  - 74, 23 km;
  - ERA5 0.25° box: 27.8 × 18.5 km at Brest and 27.8 × 5.7 km at Svalbard;
  - 1/0.2045 = 4.9.
- s23: dA = a² cos φ dφ dλ; ∫cos = sin; sin 30° = ½.
- s24: Trappes 480 km/6371 km = 4.3°; Brest–Singapore central angle ≈ 101°.
- s25: 250 × 3600 = 900 km; 900/74 = 12.2°. The Di/Dt, Dj/Dt, Dk/Dt rows match the spherical-frame rates.
- s26: 100/6.37e6 = 1.57e-5 m/s²; f v at 45° = 1.03e-3, so the ratio is 66.
- s29–s30, London → Los Angeles:
  - great circle: 78.8° and 8760 km, initial bearing 312°, vertex 62.4° N;
  - rhumb line: 258.5° and 9732 km, which is +11 % and 970 km longer.
- s31–s33:
  - 1/0.66 = 1.5; 1/cos² 60° = 4; 1/cos² 78.2° = 23.9;
  - Africa/Greenland area = 30.4/2.17 = 14;
  - y = a ln tan(π/4 + φ/2), dy/dφ = a/cos φ.
- s35–s36:
  - 10 hPa ≈ 30 km;
  - westerlies run anticlockwise seen from above the NP;
  - northward = −radial in the polar view.
- s37–s38:
  - 10 cos 30° = 8.66; −10 sin 30° = −5;
  - C_ij = e_i·e′_j gives C = [[cos, −sin], [sin, cos]], and x′_j = x_i C_ij reproduces s37;
  - 6, −8 = the east wind in axes turned by 53°.
- s39–s40:
  - along 9.4 and across −31.6 m/s (onto the land);
  - NHC Fort Myers Beach 10–15 ft = 3.0–4.6 m;
  - Tampa Bay offshore wind, and its water level fell.
- s41–s42: 20 + 1.5 = 21.5 m/s; dU/dt = 0; the material derivative is Galilean-invariant.
- s43–s45:
  - Ciarán 1–2 Nov 2023, moving ENE at ≈ 15 m/s;
  - stronger on the right of the track;
  - Brest gust 84 kt = 155.6 km/h;
  - Plymouth 3.8 − 3.2 = 0.6 hPa/h;
  - ∂p/∂t = ∂p/∂τ − U·∇p, with the sign right.

## Must fix (17)
1. **s14, 12:16–13:14: the GOES-16 image does not read as a satellite picture.**
   - The plate is a near-uniform light grey with a faint smudge (12:25, 12:57). The credit under it names an image the viewer cannot see.
   - The "eyewall" keyword (12:18–12:30) points at nothing.
   - The cylinder is a pair of thin white ellipses.
   - Fix:
     - render the GOES texture unlit (basic material, sRGB colour space) with its true contrast, so the eye and the cloud ring show;
     - draw the eyewall ring and link "eyewall" to it;
     - thicken the cylinder edges.
2. **s14 S4, 12:47–13:00: raw TeX on the picture.**
   - The arrow tags read `u_θ` and `u_r` with literal underscores (full frame 12:51.5).
   - Fix: render them with KaTeX as u_θ and u_r, or use the house TipLabel with subscripts.
3. **s14b, 13:15–14:42: no layer is labelled with its height.**
   - The narration says 300 m, 1.5, 6, 12.5 and 15 km, but no height appears on screen (13:30, 14:05).
   - The column stacks "hardly in or out; rising" (6 km) above "inflow almost gone" (1.5 km) above "≈ −6 m/s" (300 m), and only the last has a link. A viewer cannot tell which layer is which.
   - Fix:
     - put a height tag at each layer's right edge ("300 m", "1.5 km", "6 km", "12.5 km", "15 km") as each is spoken;
     - give each keyword a link to its own layer's ring.
4. **s11 S6–S13, 8:45–9:42: the radial wind arrow is invisible.**
   - At 8:49 and 8:54 it is a ≈ 15-px rose stub under the teal arrow, so "radial: in or out" and "−12.5 m/s" have no picture.
   - Fix: draw the ring-mean radial component (−12.5 m/s, a third of the 37-m/s tangential arrow) as a rose arrow pointing at the eye. Or show the local point's u_r at a visible length and say it is the local value.
5. **s11 S10–S13, 9:18–9:42: the "−12.5 m/s" link runs through "anticlockwise" and covers its "a"** (full frame 9:20).
   - Both links leave from inside the text column, and the upper one skims under "southwest Florida".
   - Fix: start each link at the left edge of its own line (SideCallout), and route both below the "southwest Florida" label.
6. **s31 S5–S7 (32:16–32:34), s33 S2–S3 (33:51–33:59) and s34 S5–S9 (34:48–35:16): the stretch bands are mirrored into the southern hemisphere.**
   - On the plate carrée map (32:30) the "Brest" band spans 38.5–59° S and the "Svalbard" band 69–90° S, and the "1.5 ×" and "4.9 ×" links point there.
   - On Mercator (33:58) the "4 ×" link ends on a 60° S circle and "≈ 24 ×" ends on Antarctica.
   - On Equal Earth, "angles off ≥ 30°" points at a far-south ellipse while the voice says "at sixty degrees north".
   - The latitudes are exactly the named northern places with the sign flipped, so this is a y-sign bug.
   - Fix: draw the bands and link targets at +48.4°, +60° and +78.2° (Brest, 60° N, Svalbard).
7. **s29 S2–S11, 30:04–31:02: the "Los Angeles" label is clipped to "ngeles" at the globe canvas edge** for ≈ 58 s (30:43.5).
   - Fix: place the label to the right of or below the dot, inside the canvas, or turn the camera ≈ 10° west.
8. **s29 S8–S11, 30:37–31:02: the line "d ≈ 6371 × 1.375 ≈ 8760 km" starts at x ≈ 912, on the globe's limb.**
   - Fix: align the CalcStack at x ≥ 1100 like the line above it.
9. **s09, 6:17–7:02: "radius 1" is clipped at the frame's left edge ("adius 1").**
   - Fix: move the label inside the circle or below it.
10. **s16 S5, 15:35–15:38: the "+90°" tag at the North Pole is cut off by the top of the frame** (full frame 15:38).
    - The spoken "ninety degrees north" is not readable.
    - Fix: put the tag to the right of the pole dot, or zoom the camera out ≈ 5 %.
11. **s19 S8, 19:43–19:54: as the globe turns to Asia, "Svalbard" and "Brest" stack at the top-left limb, over Siberia, away from their dots.**
    - The pole "0" is cut at the top (19:53.5).
    - Fix: fade the place labels when their points go behind the limb, or keep the camera on the Atlantic for S8.
12. **s41 S6–S7, 42:04–42:24: "u′ = 1.5" runs straight into "x = x′ + U t", which reads "u′ = 1.5x = x′ + U t"** (full frame 42:13.3).
    - Fix: put the equation row at the column x (≥ 1100), like the lines above it, or move the u′ tag left of the walker.
13. **s43 S4–S7, 44:07–44:36: the "north ≈ 8" and "south ≈ 19" links cross each other near x 1230–1290, and the north link runs under the "s" of "south"** (44:16).
    - Fix: list "north ≈ 8 m/s" above "south ≈ 19 m/s" so that each link goes straight to its own arc, or start both from the left edge of their own line.
14. **s45 S3–S8, 46:07–46:54: the column is cramped and overlapped.**
    - The bar chart's baseline runs through the words "hPa per hour".
    - "mostly: the storm arriving" (S7) and "advection · material derivative" (S8) sit directly on "hPa per hour".
    - The equation is split so that "=" floats alone at the end of line 1 (46:46, 46:53.5).
    - Fix:
      - write the equation on one line at 64 px, or break it after "=" with the right-hand side indented under it;
      - move the bars down ≈ 80 px and put "hPa per hour" under the bar values;
      - put the S7/S8 keywords above the equation, or swap one out.
15. **s40 (40:22–41:28) and s45 (45:46–46:54): the wind-speed field is drawn in colour with no colour bar.**
    - s39 has the bar; s40 and s45 drop it.
    - The s40 credit also lacks the date and time.
    - Fix (U-WB-R2):
      - add the 0–50 (s40) and 0–30 (s45) m/s bars beside the map;
      - write "HRRR (NOAA) · 28 Sep 2022, 20 UTC · NOAA CO-OPS gauges · NHC report".
16. **s26 S1–S6, 26:32–27:05: unexplained changing readouts.**
    - The readouts tick from "u = 10.5, v = 9.4" to "u = 13.4, v = 4.6 m/s", with "no force: the arrows turn", while the voice says the extra pieces appear "even when u, v and w stay the same". None of the numbers is spoken.
    - The great-circle thought experiment is never said, and the screen shows the reverse case to the one narrated.
    - Fix, either:
      - TSX only: remove the readouts and the keyword, and let the parcel glide; or
      - re-voice one sentence: "Here's a thought experiment: an air parcel glides along a great circle with no force at all, yet its u and v change, because the arrows turn."
17. **s15 S2–S5 (14:49–15:16), then everywhere: the symbol a is never introduced.**
    - The keyword says "r" while the radius line and the column say "a ≈ 6400 | 6371 km".
    - From s18 on, every formula uses a (a sin φ, a cos φ, x = aλ, δy = aδφ, dA = a² …) and the voice says "the radius". The "|" easy/exact notation is also unexplained on screen.
    - Fix:
      - TSX: write "Earth's radius a ≈ 6400 km (6371 km)" and label the line a;
      - or add one spoken clause in s15 S3 ("we call it a").

## Should fix (18)
1. **s07 S4–S5, 4:55–5:05:** "2π r" sits on the orange circle's stroke. Move it outside, at the upper left.
2. **"θ̂" keywords render the hat beside the θ ("θ' turn")** at:
   - s14 S6–S8 (13:00–13:14);
   - s25 S5 (26:04);
   - s46 S1 (47:09).

   Use KaTeX hat-theta in these keywords.
3. **s12 S4–S5, 10:07–10:19:** "two fairly steady numbers". The inflow curve swings 0 to −35 m/s. Fix:
   - draw dashed mean lines at 37 and −12.5;
   - add the keyword "inflow: negative all the way round";
   - or soften the words at the next re-voice.
4. **s11 S12, 9:24–9:42:** "official best track" is jargon that the voice never says ("official estimate"). Write "official estimate: 135 kt ≈ 250 km/h".
5. **s18:**
   - S5–S6 (17:27–17:38): φ sits on the orange a sin φ leg.
   - S9 (17:55): the "a cos φ sin λ" tag almost touches "two right triangles".
   - S11–S12 (18:09–18:35): the gold links cross the top-view circle and its x label, and the 4230-km link ends on the "a cos φ" tag.
6. **s22 S5, 22:43–22:53:** "× 4.9 too wide" is not spoken ("several times"). Speak it at the next re-voice, or write "≈ 5 × too wide".
7. **s23 S1:** the keywords use δ ("height a δφ"), but the equation and the voice use d. Use one symbol.
8. **s27, 27:42–28:53:** everything sits in the top 45 % of the frame, and y 600–860 is empty for 70 s. Move the three pictures down and enlarge them, or put the scale-factor rows under them.
9. **s34 S0–S2, 34:18–34:35:** the Equal Earth map's left end slides under the Mercator panel (≈ 20 px of image over image). Leave a 40-px gap.
10. **s36 S6–S8, 37:02–37:22:** the dense orange and rose ticks round the vortex centre have no legend, and the claim "far more purely tangential" cannot be read from them. Show two numbers (radial share about the pole vs about the vortex centre) as bars.
11. **s40 S1–S3, 40:26–40:45:** the Fort Myers gauge peaks at ≈ 2.2 m "above tide", while the text says "3–4.5 m" above the ground at Fort Myers Beach. Label the gauge's place (Fort Myers, upriver) and add "above ground" to the NHC line, so the two do not look contradictory.
12. **s39 S5–S8, 40:05–40:21:**
    - The three links converge on one point and cross the wind arrow and the across band.
    - "Fort Myers Beach" touches the x′ arrows.
    - Fix: end the "along" link on the middle of the along arrow, and end the coast link on the coastline 60 px north.
13. **s39 S7:** the screen shows "≈ −32 m/s: onto the land", but the voice says "thirty two … towards the land". At the next re-voice say "minus thirty two", which also sets up s40 S7 "the sign flips".
14. **End card, 48:35–48:46:**
    - The stacked-notebooks icon touches "vectors and index notation".
    - The whole card sits in the top 75 % of the frame.
    - The topic list is extra to the house end card (fine if kept). Leave a 24-px gap under the icon row.
15. **Manifest:** record which Pinellas coast segment gives 355.4° (the 10-m coast gives 353.1°), so DC43 is reproducible.
16. **s21 S7–S9, 21:44–21:58:** "74 km" sits on the teal radius line, and the "23 km" tag touches the top edge at 21:58. Nudge both.
17. **s24 S0, 24:15–24:19:** at the first frame "Brest" stands over the Bay of Biscay before the zoom settles. Hold the label until the camera stops.
18. **Halves WARN spans (4:32–4:36, 25:08–25:12, 33:40–33:44):** give each an opening keyword from frame 0, for example:
    - "radians" (4:32–4:36);
    - "zoom out: other stations" (25:08–25:12);
    - "conformal has a price" (33:40–33:44).

**Decision for the user (not a defect):** the end card uses the maths-tutorial ending. That is right for a "pure maths" movie (HOUSE_STYLE §3). But about half of this movie is real weather (Ian, the polar vortex, Ciarán), which is the reason the cross-product movie got the weather ending. My recommendation: keep the maths ending, unless the user wants the cross-product exception extended.

## What works (keep)
- **House arc:**
  - the title s00 with its globe/great-circle animation;
  - the hook;
  - building blocks before the application;
  - "There are three good reasons" (s28);
  - the recap, one beat per sentence;
  - the series end card;
  - a 2.5-s hold.
- **Goal before calculation throughout.** For example, s10: "How much of it blows away from the station…?" comes before the dot products.
- **CalcStacks show every step:**
  - √ by Pythagoras;
  - 37²/25 000;
  - 250 × 3600;
  - 6371 × 1.375.
- **The voice defines terms at first use:** origin, axes, coordinates, unit vector, arc length, air parcel, eyewall, parallel, meridian, graticule, colatitude, metric terms, conformal, rhumb line, storm surge, Galilean transformation, storm-relative.
- "Clockwise" and "anticlockwise" always come with "seen from above", and with the hemisphere where it matters.
- **Data frames:** source lines sit under every picture, and colour bars stand beside every coloured field except s40/s45 (Must 15).
- **Colour-blind safety:**
  - inflow is rose with black hatching, outflow is orange;
  - the spin/inflow curves are teal/rose;
  - the anomaly map is a blue-red diverging map.
- No flashes.
- **Strong teaching moves:**
  - s12, the u/v vs u_θ/u_r curves round the real ring;
  - s25, the plane's east arrow swinging by 12°;
  - s30, the rhumb-line vs great-circle comparison with its Mercator inset;
  - s44, the two rings with "same";
  - s45, the barometer bars −3.8 = −3.2 − 0.6.

## Limits
- Audio was not heard; the captions = script result comes from QA.
- Motion was judged from frames 0.25 s before each sentence end, plus 34 full frames. Swaps between those samples were not checked frame by frame.
- Equations were checked against the storyboard LaTeX and by derivation. I did not re-render the page PNGs.
- No colour-blind simulation was run.
- Pixel sizes were judged by eye.

**Disk.** C: 51 GB free at the start and 51 GB at the end; G: 470 GB and then 469 GB. This review wrote 25 MB of frames to G:, and one helper script to the session scratchpad on C:.

## Overall: FIX (ch00_coordinates build 1, review 1: 17 Must, 18 Should)
The physics and every spoken number are right. The Musts are all TSX/data-overlay fixes:
- the mirrored stretch bands;
- the invisible radial arrow and the washed-out GOES plate;
- unlabelled stack heights;
- clipped labels;
- the remaining text/link collisions that K6 cannot see;
- the missing colour bars.

Only two optional fixes would need narration: the s26 thought-experiment sentence and the "a" clause in s15, and both have TSX-only alternatives. No re-voice is required.

---

## #5a ch00_coordinates_flat — build 1, review 1 (2026-11-05)

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_coordinates_flat (Part 1) | 38:29.3 (2309.27 s; narration 2306.75 s) | 148.7 MB | 11 PASS, 1 WARN (halves), 3 SKIP (captions, subtitles, physics) | PASS (58/58 CHECK; parity not re-run) | FIX (1 wrong table, 1 unit-wrong line) | FIX | FIX (2 early reveals) | PASS (own check) | PASS (0 flashes, CB-safe ramp) | n/a (retired) | **FIX** |

**Method.** I extracted 231 frames at 640 px, one every 10 s (offset +5 s, checked against a direct grab at 895 s). I tiled them into 26 sheets, which is the 640-px legibility test. I also took 45 full-resolution frames at the title, the hook, every skip chip, every suspicious spot, the halves-WARN windows and the end card. All of them are in `reports/movies/ch00_coordinates_flat/review1/`. I read the timed script (405 lines from `timing.json`) against the frames, and checked every spoken number by hand and against the manifest CHECK rows (DF04–DF26).

**What is right (keep).**
- Title: "Coordinates · Part 1 / Arrows on a flat map / made easy / polar coordinates and rotated axes".
  - The s00 sentence follows the house pattern.
  - The hook says "first of seven parts" and shows the seven-part strip.
- The recap teaser and the "Part 2: accelerating?" frame point to Part 2. Nothing names the gradient movie as next; "gradient" appears only in the other-notebooks list.
- End card: the maths-tutorial ending, word for word.
- Ian numbers match the data report and CHECK rows:
  - centre: 26.506 N 82.441 W (DF20, 0.76 km from `storm_centre`, 17.0 km from the KTBW radar eye);
  - ring averages: v_t 34.80 (said "35"), v_r −13.29 (said "minus 13");
  - inflow angle: 13.3/34.8 = 0.382, giving 20.9° ≈ 21°;
  - unit conversions: 35 × 3.6 = 126 km/h; 13 × 3.6 ≈ 47 km/h;
  - travel times: 25 000/13 ≈ 1900 s ≈ 32 min; 2π·25 km = 157 km, which takes ≈ 75 min at 35 m/s;
  - ratio 35/13 ≈ 2.7; 135 kt ≈ 250 km/h;
  - the three ring points 0°, 90°, 135° (DF24).
- No sentence says the inflow holds "all the way round". s25 S11 says "negative at 58 of 72 points" (DF25), and the keyword shows the same.
- The tangential wind "stays positive all the way round" is true (DF21, min 16.9).
- Hemisphere and viewpoint are always given: "anticlockwise, seen from above, NH" on the s22 map, and the gold arc runs the right way.
- Polar and rotated-axes maths checked:
  - r̂ = (cos θ, sin θ) and θ̂ = (−sin θ, cos θ);
  - the 90° rule (p, q) → (−q, p);
  - x′ = x cos α + y sin α, y′ = −x sin α + y cos α;
  - (4.598, 1.964), length 5;
  - C₁₁…C₂₂ and the j = 1, 2 sums;
  - α = θ gives (6, −8) and (5, 0);
  - the 0.1° slide: 8.73 m = (−6.99, 5.23).
- Data frames: the HRRR source line sits below every Ian map, and the colour bar is in the column in s01, s21–s24.
- No equation numbers, book names, URLs or badges on screen.
- Text stays inside x ≤ 1842 (widest: s14 CalcStack at x 1836).
- Captions: 542 cues, 0 violations (≤ 2 × 42, ≤ 17 cps, 1–7 s). The text equals the script, and `out/` vtt/srt are byte-identical to the source copies.
- Loudness −16.3 LUFS, peak −4.0 dBTP. Flashes 0/s. The wind-speed ramp is perceptual (pale to dark green), and the radial vs tangential lines are also told apart by dash pattern.

**U-CO items mapped to Part 1.** These are all addressed on screen and in the voice:
- 001–003: s09–s11, D01–D03, anticlockwise +90°;
- 007–009: s13 column shows u = (10, 0), θ = 53°, r̂, θ̂; u_r = 6 and u_θ = −8 grow on their words;
- 010: re-centred on the model's calm eye, with the offset named in the source line;
- 011: s23 explains what 35 and 13 mean (47 km/h, 32 min, 75 min, ~3 m round per 1 m in, spiral);
- 012/014: end labels plus a legend;
- 013/015: s24 works three points by hand;
- 016: s25 is slower, with dashed mean lines;
- 017: s26 puts the four angles side by side;
- 022/025–027: product, time and centre are on the source line;
- 084–089: s16–s20;
- 099: later movies are named ("more: Tensors made easy", "How tropical cyclones form", "Vorticity in plain words");
- 101: the split.

Review-1 guards are kept: Must 4/5, Should 1/2/3/4/14/18.

**Maths-skip guidance.** All four blocks have a spoken lead-in, a chip, and an "If you skipped, here's what to keep" line. Every chip time matches the VTT:

| Block | Chip | VTT cue |
|---|---|---|
| s09 | "skip to 11:47" | 707.55 s |
| s13 | "skip to 16:05" | 965.90 s |
| s15 | "skip to 26:05" | 1565.15 s |
| s24 | "skip to 33:39" | 2019.275 s |

All 18 manifest chapter marks equal the scene starts in `timing.json`, and the render follows `timing.json` (offset 0 at 895 s). Two gaps are listed under Should 5–6.

**Halves WARN.**
- Right half, 1758–1762 s: dead space. The keyword fades at the start of S4 and the √ line arrives 4 s later; fix with Should 2.
- Left half, 2199.5–2207 s: intentional. The recap grid is there, but at near-background contrast, so the gate reads it as empty; brighten it (Should 13).

### Must fix (6)
1. **23:54–24:11, s19 S19–S21: the flipped table shows wrong labels.** After the "flipped over its diagonal" swap, the table holds [[cos α, sin α], [−sin α, cos α]] but keeps the row labels e₁, e₂ and drops the column labels. It now says C₁₂ = sin α, which contradicts C₁₂ = −sin α derived 80 s earlier on the same screen. **Fix** (`cf_sB.tsx`, S19): on the flipped table, label the rows e′₁, e′₂ and the columns e₁, e₂. Or keep the C table and draw the rotation matrix beside it with a gold "rows ↔ columns" link.
2. **31:13–33:39, s24, and 27:20–27:40, s22: on-map component labels are unreadable at 640 px.** "u_θ = 38.0", "u_r = −8.7", "u_θ = 16.9", "u_r = −37.4" and "u_r = −24.3" are drawn semi-transparent, in thin KaTeX, with no halo, on the green field. The coastline and streaks cross them, and at 32:25 the u_θ arrowhead sits on "16.9". The s22 per-point "u_r"/"u_θ" tags have the same problem. **Fix** (`cf_sC.tsx` S22/S24): full opacity, ≥ 44 px, and a dark 6-px halo like "25 km" has. Place each label off its arrow and the coast (or keep the numbers in the column only, with a gold link).
3. **33:50–35:25, s25: the wind-speed map has no colour bar.** The whole scene shows it without one, against the user rule U-WB-R2 and point 3 of this brief. **Fix** (`cf_sC.tsx` S25): put the `SpeedBar` under the "why polar here?" keyword or under the graph legend, beside the map, never on it. The same gap, smaller, is at 2:03 (s03 thumbnail), 37:40 (s27 recap mini-map) and the s00 title map: add a compact bar or treat those as Should.
4. **20:04–20:27, s17 S11–S16: picture label runs into the maths column.** The label "(x′, y′) = (4.6, 1.96)" ends at x ≈ 1055, past the picture zone (≤ 1000). It sits on the same baseline as "x = 3, y = 4, α = 30°", which starts at x 1082. At 640 px the two read as one line. **Fix** (`cf_sB.tsx` S17): move the tip label inside x ≤ 1000, e.g. above-left of the arrow tip, or drop it to two lines.
5. **28:05, s22 S6: the conversion line has wrong units.** "3600 s / 1000 m = 3.6" is dimensionally wrong (s/m ≠ 1). **Fix** (`cf_sC.tsx` S22 / `cf_eq.ts`): write `1\ \mathrm{m/s}=3600\ \mathrm{m/h}=3.6\ \mathrm{km/h}`, or (3600 s/h) ÷ (1000 m/km), at ≥ 44 px (the fraction is ≈ 32 px now).
6. **QA is incomplete.** qa.json has `captions` SKIP, `subtitles` SKIP and `physics` SKIP ("no --captions given", "no --manifest given") besides the halves WARN. My own caption check passes, but the physics-parity gate (manifest hashes re-run) was never run. **Fix:** re-run `tools/movie_qa.py` with `--storyboard --captions --manifest` on the fixed build and record 15/15.

### Should fix (14)
1. **12:39–16:17 (s13–s14) and 37:20 (s27 mini): radial and tangential colours are swapped.** These scenes colour u_r teal and u_θ rose ("u_r: along r̂" teal, "6 r̂" teal, "−8 θ̂" rose). From the title on, and in s21–s26 and the end-card thumbnail, u_θ is teal and u_r is rose. A quantity must keep its colour (HOUSE_STYLE §5). **Fix** (`cf_sB.tsx` S13/S14, `cf_sC.tsx` S27): u_θ teal, u_r rose throughout. Keep the "−" glyph for u_θ = −8.
2. **29:18–29:26, s23 S4: the answer 37 appears too early.** "≈ 37 m/s" and "√(35²+13²) ≈ 37 m/s" are on screen at 1762 s, ≈ 4–5 s before "about thirty seven" (≈ 1766 s); the answer comes before the calculation. The column is also empty from 1758 to 1762 s (the halves WARN). **Fix** (`cf_sC.tsx` S23): keep "what do they mean?" until the √ line. Reveal the √ on "square root" and "≈ 37" on "thirty seven" (`AT`).
3. **33:05–33:39, s24: the θ = 135° numbers disagree.** The map says "u_r = −24.3"; the column and the voice say −24.4 (7.1 − 31.5); the exact value is −24.32. Also "38.0" on the map vs "38" in the column. **Fix:** one value everywhere. Either "7.14 − 31.46 ≈ −24.3" (re-voice S20) or a map label of −24.4.
4. **34:59, s25 S11: "only on the southwest side does it blow a little outward" understates the outflow.** The outward part reaches +14.1 m/s ≈ 51 km/h (DF25), which is not "a little". **Fix** (script, storyboard s25 S11, re-TTS one sentence): "...does it blow outward, by up to about fourteen metres per second."
5. **31:00, s24 S0–S1: the skip lead-in leaves out the required words.** It only says "if that feels like too much, skip ahead". The rule requires saying the steps are not needed for the weather/climate/maps intuition (s09 and s15 do; s13 S1 omits "maps"). The chip text "every step, if you want it" also lacks the user's word "optional". **Fix** (script s24 S1, s13 S1; `SkipChip` text "every step · optional · skip to mm:ss").
6. **26:05, s20 keep line: alpha is never given to viewers who skipped.** The line does not name α, yet s26 S8 ("Alpha says how far we turned our axes") and the recap use it. **Fix:** "...turning the axes by an angle alpha changes the numbers…".
7. **5:38–8:25, s08–s09: θ has no east reference ray.** At 5:45 the θ arc floats with no rays at all; later only the radius is drawn. **Fix** (`cf_sB.tsx` S08/S09): add a dashed east ray from the station, and draw the radius from 5:38.
8. **7:30–7:50, s09 S8–S10: the inset is unlabelled and boxed.** It shows two arrows (gold and orange, at right angles) with no labels, inside a panel box (no boxes) that touches the circle at x 700. **Fix:** label "slide" and "r̂", drop the box, and keep it ≥ 24 px off the circle.
9. **1:22–2:13, s03: x̂ and ŷ are hard to see.** They are drawn on top of the same-orange axes, so only the arrowheads show, and the ŷ label crowds tick "1". **Fix** (`cf_sA.tsx` S03): draw the axes muted (as in s15) or offset or thicken the unit arrows.
10. **1:55–2:10, s03 S5–S6: a "same everywhere" arrow pair overflows.** The pair at (6, 1.5) km pokes past the map panel edge (x 1000 > 990), and one pair covers the balloon. Move both inside.
11. **0:31–0:40, s02 S0–S2: the map panel is empty for 9 s.** **Fix:** show the station or a faint grid on "a starting point" (33.9 s).
12. **21:12, s18 S8: "top row: … = 4.60" should be "≈ 4.60"** (0.866·3 + 2 = 4.598; HOUSE_STYLE §6).
13. **36:39–36:47, s27 S0: the recap grid is near the background colour** (halves WARN). Draw its axes in orange or brighten the grid.
14. **Other small items.**
    - 0:10–0:31 and 37:40: the source line wraps, leaving "eye" or "eye, ≈ 17 km…" orphaned. Shorten it to "centre: model's calm eye, ≈ 17 km SW of radar eye".
    - 28:25–28:56: the "−13 m/s: in" gold link crosses the teal arrow shaft.
    - 14:47–14:55, s14 S0–S1: the r̂/θ̂ tip labels are missing while the voice says "six times r hat plus minus eight times theta hat".

### Limits
- Audio not heard. Captions = script was checked from timing.json and the VTT.
- Motion judged from 10-s samples plus targeted grabs. Swaps between samples were not checked frame by frame.
- No colour-blind simulation; pixel sizes judged by eye at 1920 and 640 px.
- I did not re-render page PNGs: the on-screen equations are standard identities with no Vallis numbers, and the storyboard provenance is Kundu (2.4)/(2.5).

**Disk.** C: 115 GB free, G: 487 GB free at the end. This review wrote 24 MB of frames (ignored folder) and one text file to the session scratchpad.

### Overall: FIX (#5a build 1, review 1: 6 Must, 14 Should)
The physics, the Ian numbers, the maths-skip times and the captions are right.
- Must fixes 1–5 are TSX-only; Must 6 is a QA re-run.
- Two Shoulds need one re-voiced sentence each (s24 S20 if −24.3 is chosen, s25 S11).
- Two Shoulds change narration lines (s24 S1, s20 S19).

## #5b ch00_coordinates_storm — calculation & sync audit (2026-11-05)

**Scope.** Pre-render audit for the user's rule "show every calculation and derivation; visuals follow the narration". Read: `script.md`, `storyboard.yaml`, `timing.json` (sentence times used for every timestamp below), `cs_sA/sB/sC.tsx`, `cs_eq.ts`, `cs_lib.tsx`, `data/cs.json`, build CHECK rows. Every number spoken or shown was recomputed in Python. There is no render yet, so this audit has no frames. Layout items come from the TSX coordinates.

**Numbers recomputed (all agree with cs.json / CHECK rows unless a finding says otherwise).** 0.1 rad = 5.73°; chord of 0.1 rad = 0.09996; cos/sin(53.13° + 0.01 rad = 53.70°) = 0.5920 / 0.8060; finite-difference slopes −0.803 / 0.596; θ̂(53.70°) = (−0.806, 0.592); (cos 0.1, sin 0.1) = (0.9950, 0.0998); 11 × that = (10.945, 1.098); pieces (1, 0), (−0.050, 0.998), (−0.005, 0.100); halving: piece 3 = 0.1 / 0.025 / 0.0062, ÷Δt = 0.1 / 0.05 / 0.025; ω = 34.80 / 25 000 = 1.392 × 10⁻³ rad/s = 0.0798°/s = 4.79°/min; lap 4513 s = 75.2 min (2π/0.00139 = 4520 s); 34.8² = 1211.0; v²/r = 0.0484 m/s²; 35²/25 000 = 0.049; g/a = 202; 100 km/h = 27.78 m/s, ÷ 0.0484 = 573 s = 9.6 min (screen 27.8/0.048 = 579 ≈ 580 s); Δθ(60 s) = 0.0835 rad = 4.79°; 34.8 × 0.084 = 2.92, exact chord 2.906 m/s, ÷ 60 = 0.0484; f = 2Ω sin 26.5° = 6.51 × 10⁻⁵ s⁻¹, f v = 2.26 × 10⁻³ m/s², ratio 21.4; arctan(13.30/34.80) = 20.9°, arctan(5.97/20.08) = 16.6°; 90 kt = 166.7 km/h = 46.3 m/s, ERA5 ring 20.1 m/s = 72 km/h; 0.25° = 27.8 km N–S (26.0 km E–W at 20.7° N); √(22.23² + 24.29²) = 32.93 m/s from 222.5°; 10–15 ft = 3.05–4.57 m; 1 hPa ↔ 100/(1025 × 9.81) = 0.0099 m; 1013 − 938 = 75 hPa ≈ 0.75 m; box-continuity check w = 2h|u_r|/r = 2 × 1000 × 15.7 / 30 000 = 1.05 m/s (DS30 1.04). Stack heights are 0.699 / 1.429 / 5.80 / 12.44 / 14.25 km. The 100-km ring means are −6.48 / +0.46 / +0.94 / +0.94 / +6.65 m/s. The TDR peak is 3.34 m/s at 8.5 km, r 45 km.

**Re-voice needed (the final TTS is running now).** B1 (s14 S16) is a physics error and must be re-voiced. B13 (s20 S12) and B14 (s23 S8–S9) need new or changed sentences. B12 is one word, or a screen change instead. B4, B6, B19 and B20 have optional narration additions. Everything else is TSX/visual only. Any re-voice shifts the skip-chip times; let `make_timing.py --final` recompute them.

### Must fix (14)

**B1 — s14 S15–S16 (22:24–22:36): the Earth's spin is drawn and said pushing the wrong way (physics).** In a northern-hemisphere cyclone the air goes round anticlockwise (seen from above). The Coriolis deflection is to the right of the motion, so it points **outward**: a = −f k̂ × v θ̂ = +f v r̂. The narration says "The Earth's spin adds a smaller push", and `cs_sB.tsx` S14 draws the violet arrow pointing inward, with no arrowhead (`head={0}`) and only 8 px long. The real balance is pressure push inward ≈ v²/r + f v = 0.048 + 0.002 m/s².
- *Narration S16 (re-voice):* "The Earth's spin pushes the other way, a little outward, about twenty times weaker, so the pressure force has to be a little stronger than the turning alone needs."
- *Screen (on S16):* `\text{turning: }0.048\ \mathrm{m/s^2}\ \text{(inward)}` → `\text{Earth's spin: }\approx0.002\ \mathrm{m/s^2}\ \text{(outward)}` → `\frac{0.048}{0.002}\approx20` → `\text{pressure push}\approx0.048+0.002=0.050\ \mathrm{m/s^2}`. Add the slate note "Earth's spin worked out in the Coriolis movie".
- *Visual (`cs_sB.tsx` S14):* violet arrow outward from the parcel, with a head, ≥ 50 px, tag "drawn 6× longer" (it is 1/21 of the 170-px pressure arrow). Change the label to "Earth's spin: ≈ 1/20, outward". Fix the storyboard visual and the honesty_notes the same way.

**B2 — s11 S6 (17:34) and s12 S7–S8 (18:53–19:05): scene ids on screen.** The labels "θ̂ (s05)", "v/r (s09)" and "−r̂ (s06)" are meaningless to a viewer and break the house no-references rule. *Fix (`cs_sB.tsx` S11, S12):* "θ̂: from the turning rule", "v/r: how fast θ grows", "−r̂: θ̂ swings towards −r̂". In s12 also label the recalled mini picture: "θ̂" on the orange arrow, "−r̂" on the rose one.

**B3 — s08 S20–S22 (13:42–13:59): the key "small × small vanishes" step is not on screen, and the halving bars collide with the grid.**
- (a) The three Δt groups of bars have no numbers. The division by Δt that makes piece 3 vanish is never shown.
- (b) The grid group (`fout(f, tRule-10)`) is still visible when the bars come in (`tHalf`, S21). The bars (x 160–1004, y 600–720) sit on the grid and the teal product arrows (y 640). The label "Δt = 1 s" (x 230, y 766) prints over "1 m/s per square" (x 180, y 760).
- *Fix (`cs_sA.tsx` S08):* fade the grid group out at `tHalf − 10`. Put the numbers under each bar. Add the CalcStack rows:
  - S21: `\Delta t=1:\ \ 1,\ \ 1,\ \ 0.1`, then `\Delta t=0.5:\ \ 0.5,\ \ 0.5,\ \ 0.025`, then `\Delta t=0.25:\ \ 0.25,\ \ 0.25,\ \ 0.006`
  - S22: `\div\Delta t:\ \ 0.1\to0.05\to0.025\to0` (the third piece), with "first two stay ≈ 1" in slate
- *Optional narration after S21:* "Divide each piece by the time step: the first two stay at about one, but the third goes from zero point one to zero point zero five to zero point zero two five, halving every time."

**B4 — s08 S9–S12, S16 (12:29–13:18): the toy numbers appear without their origin, and one row is early.**
- Δv = 1 is never written.
- (0.995, 0.1) is never shown as (cos 0.1, sin 0.1), and the turned unit arrow is never drawn (only the wedge).
- The arrow's change (−0.005, 0.1) is used in pieces 2 and 3 but never derived.
- The row "11 (0.995, 0.1) = (10.945, 1.1)" appears at `tLater + 30` = 12:29.9, 11 s before S11 says it.
- *Rows in order (`cs_sA.tsx` S08):*
  - S9: `\Delta v=11-10=1\ \mathrm{m/s}`
  - S10: `\hat{\mathbf d}_{\text{new}}=(\cos0.1,\ \sin0.1)\approx(0.995,\ 0.1)` and draw the orange turned unit arrow
  - S11: `11\,(0.995,\ 0.1)\approx(10.945,\ 1.1)`, moved to `tNow`
  - S12: `(10.945,\ 1.1)-(10,\ 0)=(0.945,\ 1.1)`
  - S16, before piece 2: `\Delta\hat{\mathbf d}=(0.995,\ 0.1)-(1,\ 0)=(-0.005,\ 0.1)`
- *Optional narration S16:* "Second, the old number times the change in the arrow. The arrow went from one, zero to zero point nine nine five, zero point one, a change of minus zero point zero zero five, zero point one. Ten times that is minus zero point zero five, one."

**B5 — s08 S13–S18 (12:54–13:40): the "the change, magnified" picture has no scale and no link, and runs off the top.** This is the same kind of fault as Part 1's 11:21 trigger. The inset is drawn at 260 px per m/s, against the grid's 70, so ×3.7, but the scale is not stated. Nothing links it to the gold change arrow on the grid. Its top arrowhead lands at y ≈ 14 px (`ZO = [700, 300]`, 1.1 × 260), outside the safe area.
- *Fix (`cs_sA.tsx` S08):* `ZO = [660, 400]`, `Z = 200`, so the inset spans y 180–400 above the grid. Label it "the gold change arrow, drawn 3× larger" and draw a dashed gold leader from the grid's change arrow to the inset. Tag each piece with its value on its words: "(1, 0)" slate, "(−0.05, 1)" orange, "(−0.005, 0.1)" rose. Add "sum (0.945, 1.1)" on the gold arrow at S18.

**B6 — s04 S10–S15 (5:33.8–6:20.6): the numeric check hides where its numbers come from.**
- "cos θ = 0.6, sin θ = 0.8" is shown without the 3-4-5 balloon.
- θ + Δθ = 53.70° and the looked-up 0.592 / 0.806 are never shown.
- During S12 and S14 nothing new is on screen: the rows arrive only at S13 and S15, as one fraction each.
- *Rows (`cs_sA.tsx` S04), one per sentence:*
  - S10: `\theta=53.13^\circ:\ \cos\theta=\tfrac35=0.6,\ \ \sin\theta=\tfrac45=0.8`
  - S11: `\Delta\theta=0.01\ \mathrm{rad}=0.57^\circ\ \Rightarrow\ \theta+\Delta\theta=53.70^\circ`
  - S12: `\cos53.70^\circ=0.592,\quad 0.592-0.600=-0.008`
  - S13: `\frac{-0.008}{0.01}=-0.8=-\sin\theta`
  - S14: `\sin53.70^\circ=0.806,\quad 0.806-0.800=+0.006`
  - S15: `\frac{0.006}{0.01}=0.6=\cos\theta`
- *Optional narration S11:* "Turn by zero point zero one radians, about half a degree, to fifty three point seven degrees."

**B7 — s04 S3 and S6 (4:51.0, 5:10.0): two derivation moves are only spoken.**
- S3 turns the move "Δθ along θ̂" into two components, but nothing is written.
- S6, "divide both changes by Δθ and let it shrink": the Δ rows fade at `tDiv − 20`, before the sentence. The limit rows appear only at S7. So the division itself is never on screen.
- *Rows:*
  - S3: `\text{move}\approx\Delta\theta\,\hat{\boldsymbol\theta}=\Delta\theta\,(-\sin\theta,\ \cos\theta)=(-\sin\theta\,\Delta\theta,\ \ \cos\theta\,\Delta\theta)`
  - Keep the two Δ rows until S7.
  - S6: `\frac{\Delta(\cos\theta)}{\Delta\theta}\approx-\sin\theta,\qquad \frac{\Delta(\sin\theta)}{\Delta\theta}\approx\cos\theta`, plus the slate tag "Δθ → 0: ≈ becomes =".

**B8 — s06 S23 (9:16.4): "−r̂" is not opposite the drawn r̂.** The rose −r̂ is drawn at θ + 180° = 233°. The visible r̂ has turned to θ + 20° = 73° (step 3 left it there), so the two are 160° apart, while S23 says "the arrow r hat, flipped". *Fix (`cs_sA.tsx` S06):* at `t5` (S18), ease both arrows back to the un-turned position, or keep a dashed ghost r̂ at θ labelled "r̂ (before the turn)". Then, as the storyboard says, slide the step-4 slide arrow onto −r̂ with a gold "same direction" tick.

**B9 — s07 S11–S14, S17 (10:32–11:21): the check's inputs and subtraction are not shown.**
- θ̂(53° + 0.01) appears as bare numbers.
- The change is a text label with no subtraction.
- r̂ = (0.6, 0.8) is not on screen when S14 says it.
- S17's "minus r hat again" has no "= −r̂".
- *Rows (`cs_sA.tsx` S07):*
  - S11: `\hat{\boldsymbol\theta}(53.70^\circ)=(-\sin53.70^\circ,\ \cos53.70^\circ)=(-0.806,\ 0.592)`, plus the slate tag "same numbers as the slope check"
  - S12: `\big(-0.806-(-0.800),\ \ 0.592-0.600\big)=(-0.006,\ -0.008)`, replacing the text label
  - S14: `\hat{\mathbf r}=(0.6,\ 0.8)\ \Rightarrow\ (-0.6,\ -0.8)=-\hat{\mathbf r}`
  - S17: append `=-\hat{\mathbf r}` to the slope row

**B10 — s09 S7 and S9 (14:44.9, 14:59.2): the arc rule is invoked but not written, and the division by Δt is not shown.** The EQ appears only at S10. *Rows (`cs_sB.tsx` S09):*
- S7: `\text{arc rule: }\Delta s=r\,\Delta\theta`
- S8: the existing `\Delta\theta=\frac{\Delta s}{r}=\frac{v\,\Delta t}{r}`
- S9: `\frac{\Delta\theta}{\Delta t}=\frac{v\,\Delta t}{r\,\Delta t}=\frac{v}{r}`, plus the tag "Δt cancels"

**B11 — s09 S12–S16 (15:14–15:52): silent conversions.**
- 25 km → 25 000 m is not shown.
- v switches from the keyword "≈ 35" to 34.8 with no word.
- "× 57.3" appears with no origin.
- "≈ 5°/min" appears with no × 60.
- "2π ÷ 0.00139" is said at S15 but appears at S16.
- 4500 s → 75 min has no ÷ 60.
- *Rows:*
  - S12: `r=25\ \mathrm{km}=25\,000\ \mathrm m,\quad v=34.8\ \mathrm{m/s}\ (\approx35)`, then the existing division
  - S14: `1\ \mathrm{rad}=\frac{180^\circ}{\pi}\approx57.3^\circ`, `0.00139\times57.3\approx0.08^\circ/\mathrm s`, `0.08\times60\approx4.8\approx5^\circ/\mathrm{min}`
  - S15: `\frac{2\pi}{0.00139}=\frac{6.283}{0.00139}`
  - S16: `\approx4500\ \mathrm s,\qquad \frac{4500}{60}=75\ \mathrm{min}`

**B12 — s18 S7 (26:46), s19 S3 (27:50), s20 S10 (29:34): screen and voice disagree on the 850-hPa height.** The tags and callouts say "1.4 km" (data 1.429). The voice says "one and a half kilometres" three times. *Fix, either one:*
- (a) Re-voice "about one point four kilometres" in those three sentences.
- (b) Visual only: write "≈ 1.5 km" in the three places and relax `CHECK_B z850` to 1.5 ± 0.1.

While touching these, round the other tags to what is spoken ("≈ 6 km", "≈ 12 km", "≈ 14 km"; the voice says six, twelve, fourteen) or re-voice them to match.

**B13 — s20 S12 (29:52–30:07): "the inflow alone says the air must rise at about a metre per second" is a result with no inputs.** The builder's continuity integral (DS30, 1.04 m/s) cannot be shown in one line, but a box estimate reproduces it. Air comes in through the side of a cylinder r = 30 km in a layer h ≈ 1 km deep at |u_r| ≈ 16 m/s (925-hPa ring mean −15.7 m/s at 30 km; at 850 hPa only −3.8). It leaves through the lid: 2π r h |u_r| = π r² w, so w = 2h|u_r|/r.
- *Rows (keyword zone, on the new sentences):*
  - `\text{in through the side: }2\pi r\,h\,|u_r|`
  - `\text{up through the lid: }\pi r^2\,w`
  - `w=\frac{2h\,|u_r|}{r}=\frac{2\times1000\times16}{30\,000}\approx1\ \mathrm{m/s}`
- *Narration (re-voice; replaces the first half of S12):* "Here's a quick check. Air flows in through the side of a cylinder thirty kilometres in radius, in a layer about one kilometre deep, at about sixteen metres per second. All of it has to leave through the cylinder's lid, which is a much bigger area, so it rises more slowly: two times one thousand times sixteen, divided by thirty thousand, is about one metre per second. And radar on a hurricane-hunter aircraft measured it: about three metres per second, eight and a half kilometres up, with single towers near ten."
- *Visual (`cs_sB.tsx` S20):* on the section, a gold outline rectangle r 0–30 km × z 0–1 km, with the inflow FlowArrow entering its right side and three short up-arrows leaving its top. Add a CHECK row in the builder: box estimate 1.05 vs DS30 1.04 m/s. The new wording also fixes the "nine kilometres" vs "8.5 km up" mismatch with the existing callout.

**B14 — s23 S8–S9 (32:49.9–33:04): "the reanalysis is far too weak" compares unlike quantities in different units.** The screen sets the official 90-kt maximum (3-min) against a 20-m/s ring mean at 50 km. The 90 kt is never converted to m/s, and a ring mean is not a maximum, so the gap is overstated.
- *Rows:* `90\ \mathrm{kt}\times1.852\approx167\ \mathrm{km/h}` (exists) → `167\div3.6\approx46\ \mathrm{m/s}`. Then a like-for-like pair: ERA5's lowest pressure `967\ \mathrm{hPa}` vs official `956\ \mathrm{hPa}` (both already in cs.json: `amphan.msl`, `best06.hpa`). Or ERA5's own maximum 10-m speed in the box vs 46 m/s (add `amphan.vmax10` and a CHECK row in the builder).
- *Narration S8–S9 (re-voice):* "The official estimate at that hour, averaged over three minutes, was about ninety knots, which is about forty six metres per second, and a lowest pressure of nine hundred and fifty six hectopascals. ERA5's lowest pressure is only about nine hundred and sixty seven, so the reanalysis storm is much too weak."

### Should fix (11)

**B15 — s03 S15 (3:52.9): "0.1 rad ≈ 6°" shows no conversion, and the picture contradicts it.** The arc labelled "≈ 0.1" is drawn for a 20° turn, about 0.35 rad.
- *Rows:* `0.1\ \mathrm{rad}\times\frac{180^\circ}{\pi}\approx5.7^\circ\approx6^\circ`, then `s=1\times0.1=0.1`.
- *Visual (`cs_sA.tsx` S03):* on S15, ease the wedge from 20° to 5.7° and relabel it "0.1 rad ≈ 6°". Ease it back on S16.
- Also append `=\Delta\theta` to row 1 on S14 (3:45.6); now it shows only at S19.

**B16 — s04 S4–S5: the label "slivers drawn 20× larger" is wrong.** The slivers are the true geometry of a turn drawn at 20° (0.35 rad), so there is no 20× factor. *Fix:* "turn drawn large (20°)".

**B17 — s05 S3–S4, S11 (6:40–7:22): two steps are missing.**
- (a) S3 says "about" with no reason. The straight arrow Δr̂ is the chord, not the arc. DS02 already has chord(0.1) = 0.09996 vs arc 0.1, but it is unused. Row on S3: `|\Delta\hat{\mathbf r}|=0.09996\ \text{ vs arc }0.1\ \ (\Delta\theta=0.1)`, plus the tag "straight ≈ curved for a small turn".
- (b) S4 has no division row. Add `\frac{\Delta\hat{\mathbf r}}{\Delta\theta}\approx\hat{\boldsymbol\theta}\ \ \xrightarrow{\ \Delta\theta\to0\ }\ \ \frac{d\hat{\mathbf r}}{d\theta}=\hat{\boldsymbol\theta}`.
- (c) S11 jumps to the answer. Add the middle line `=\Big(\frac{d\cos\theta}{d\theta},\ \frac{d\sin\theta}{d\theta}\Big)` before `=(-\sin\theta,\ \cos\theta)`.

**B18 — s06 S13 (8:27.1) and s07 S1/S5 (9:40.6, 10:00.4): small gaps.**
- s06 S13 says "slides a distance Δθ" without restating the arc rule. Row: `s=1\times\Delta\theta=\Delta\theta`.
- s07: the 5-km circle has no "r = 5 km" tag.
- s07: the tails-together inset has no label. Add "θ̂ at three places, tails together" (slate) and the angles 0°, 25°, 53° at the three balloon dots.

**B19 — s08 S6–S10 (12:15–12:41): a label comes too early, and d̂ is never defined.** "v = 10 → 11 m/s, d̂ turns 0.1 rad" appears at S6, 12–18 s before the numbers are said. The symbol d̂ then appears in the product rule (S23) but is never said or defined. *Fix:* split it into "v = 10 m/s · d̂ = (1, 0): an arrow of length 1" (S7), "→ 11 m/s" (S9), "d̂ turns 0.1 rad" (S10). Optional narration S7: "…along an arrow pointing east, one, zero. We'll call that arrow d hat."

**B20 — s11 S1, S8–S9 (17:04–17:52): the first term is not struck, and the result shows early.**
- S1 shows only "dr/dt = 0". The s10 line with its first term struck is not on screen (the storyboard asks for it).
- `EQ_S11` appears whole at S8 ("Now multiply by r"), including "= v θ̂", before S9 says it. `cutAt(EQ_S11, "=v")` is computed but never used.
- *Fix (`cs_sB.tsx` S11):*
  - S1: `\mathbf v=\cancel{\tfrac{dr}{dt}\,\hat{\mathbf r}}+r\,\tfrac{d\hat{\mathbf r}}{dt}` (house Strike)
  - S8: e1 only
  - S9: append `=v\,\hat{\boldsymbol\theta}`

**B21 — s12 S4, S10–S11 (18:34, 19:12–19:20): the same pattern, plus a skipped move.**
- At S4 the dv/dt term is not struck.
- `EQ_S12`, shown at S10, already holds the final "−v²/r r̂".
- The move v · (−r̂ v/r) = −(v·v/r) r̂ is never written.
- *Rows:*
  - S4: strike `\tfrac{dv}{dt}\hat{\boldsymbol\theta}`
  - S10: `\mathbf a=v\cdot\Big(-\hat{\mathbf r}\,\frac{v}{r}\Big)`
  - S11: `=-\frac{v\cdot v}{r}\,\hat{\mathbf r}=-\frac{v^2}{r}\,\hat{\mathbf r}`

**B22 — s13 S8 (20:40.4): the car numbers have no conversions.** 100 km/h → 27.8 m/s and 580 s → 10 min are not shown. The storyboard calc_row still says 570 s; the screen says 580; the data give 573.
- *Rows:*
  - `100\ \mathrm{km/h}=\frac{100\,000\ \mathrm m}{3600\ \mathrm s}\approx27.8\ \mathrm{m/s}`
  - `\frac{27.8}{0.048}\approx580\ \mathrm s` (exists)
  - `\frac{580}{60}\approx9.7\ \mathrm{min}\approx10\ \mathrm{min}`
- Align the storyboard row to 580.

**B23 — s14 S4, S10 (21:11, 21:45): two pieces are unlabelled or unconverted.**
- The dashed circle of radius 34.8 m/s, which S10 names, has no label.
- The wedge "≈ 5°" is drawn at 15°.
- The 0.084 rad → 5° conversion is missing.
- *Fix:* label "radius 34.8 m/s" on the dashed arc; slate "turn drawn 3× larger" under the wedge; row `0.084\times57.3\approx4.8^\circ\approx5^\circ`.

**B24 — s23 S11 (33:06.5): the angle step and the term are missing.** The tan → angle step is not shown, and "inflow angle" is used without restating what it is.
- *Visual:* at the ring point `rp`, draw the actual wind arrow, the sum of the teal and rose ring-mean arrows. Add a gold angle arc between it and the round (teal) arrow, labelled "inflow angle".
- *Rows (update `EQ_S23` and the storyboard):*
  - `\tan(\text{inflow angle})=\frac{|u_r|}{u_\theta}`
  - `\frac{6.0}{20.1}\approx0.30\ \Rightarrow\ \arctan0.30\approx16.6^\circ\approx17^\circ`
  - `\frac{13.3}{34.8}\approx0.38\ \Rightarrow\ \arctan0.38\approx20.9^\circ\approx21^\circ`
- Optional row on S3: `0.25^\circ\times111\ \mathrm{km}\approx28\ \mathrm{km}`, with the slate note "Part 3 shows where 111 km comes from".

**B25 — s26 S3, s27 S3–S4, s28, s29 (35:11–38:22): the coast numbers have no arithmetic.**
- (a) s26 S3: the 33 m/s from the SW comes with no components. Rows:
  - `u=22.2\ \mathrm{m/s}\ (\text{east}),\ \ v=24.3\ \mathrm{m/s}\ (\text{north})`
  - `\sqrt{22.2^2+24.3^2}=\sqrt{493+590}\approx32.9\ \mathrm{m/s}`
  - Tag: "blows towards the NE → from the SW"
- (b) s27 S3: "1 cm per hPa" never gets Ian's number. Rows:
  - `1013-938\approx75\ \mathrm{hPa}\ \Rightarrow\ \approx75\ \mathrm{cm}`
  - Tag "small next to 3-4.5 m"
  - Optional origin: `\frac{100\ \mathrm{Pa}}{1025\times9.81}\approx0.01\ \mathrm m`
  - Optional narration: "Ian's centre was about seventy five hectopascals below normal, so that's only about seventy five centimetres."
- (c) s27 S4: show the factor: `10\times0.3048\approx3.0\ \mathrm m,\ \ 15\times0.3048\approx4.6\ \mathrm m`.
- (d) s28: the map label "St. Pete" does not match the voice and the chart, which say "Saint Petersburg".
- (e) s29 S4: put "≈ 33 km" on the gold shelf line itself.

### Verified (keep)
- Every `SS`/`AT` index in s00–s32 points at the sentence the comment names (checked against `timing.json`).
- The skip chips point at 11:34 (s08 S0) and 19:49 (s13 S0).
- The CHECK_A/B/C tolerances hold for the values in cs.json.
- Hemisphere wording ("anticlockwise as seen from above", "both in the northern hemisphere") is correct.
- The 17 km WSW bearing (252.5°) is correct, and the two centres are never on one data picture.
- The radius-height numbers (−15.7 at 30 km and 0.70 km; +9.2 at 125 km and 15.3 km; u_θ 55.0 at 30 km and 1.43 km) are correct.
- Amphan: the 50-km ring is the ERA5 spin maximum (20.08 > 19.72 at 100 km). Inflow angle 16.5°. Khulna 79 km = the voice. The Nargis dates (−11 d, +66 h) are right.

### Limits
- Pre-render. No frames exist, so the layout items (B3, B5, B8) come from SVG coordinates and need a frame check after the fix.
- Audio not heard.

### Verdict: FIX (Part 2 audit: 14 Must, 11 Should)
B1 is a physics error. B13 and B14 need the narration changed; for B12 the user picks (a) re-voice or (b) a screen change. The rest are TSX/visual edits plus a few optional narration additions.


## #5a ch00_coordinates_flat — calculation & sync audit (2026-11-05)

User request (2026-11-05): "don't skip any calculation; show every calculation and derivation thoroughly; where something is skipped, explained too briefly, or the visuals don't follow the narration, review and improve it." Yardstick: the s10/s11 0.1° slide (build 1, 11:21–11:46). That slide is already being redesigned in the working tree (`storyboard.yaml` s11 `calc_rows`, `cf_sB.tsx` CHECK rows at lines 270–273). This audit covers every other spoken or shown number. Items already listed in review 1 (Must 1–6, Should 1–14) are not repeated.

**Method.**
- I took one frame 0.25 s before the end of every sentence: 376 frames from `movies/out/ch00/ch00_coordinates_flat/1080.mp4` (build 1, 2309.27 s).
- I tiled them per scene, nine to a sheet, each frame labelled with scene, sentence and time. Then I read every sheet against the build-1 timed script. That script is `timing.json` at HEAD; the working-tree timing is fix-1 and later, and longer.
- I took full-resolution frames wherever the 640-px tiles were unclear.
- Everything is in `reports/movies/ch00_coordinates_flat/calc_audit/{sent,sheets,full}/` (ignored), with `sent_times.txt`.
- I recomputed every number in Python from `data/cf.json` and the script.
- Timestamps are build 1 (mm:ss in the rendered MP4). Scene and sentence ids (S1 = first sentence) are stable across builds.
- Letters: (a) result without inputs or arithmetic · (b) derivation jumps more than one move · (c) narration ≠ picture · (d) earlier rule not restated · (e) text/voice disagree or mistimed.

**Verified (no finding).** I recomputed each of these and found it correct:
- r = 5 and θ = 53.13°; bearing 37°.
- 0.2 rad: 1 km and 10 km.
- (−4, 3); r̂ and θ̂ at the balloon.
- (6, −8) and its rebuild; x̂′ and ŷ′ at 30°.
- (4.598, 1.964); C₁₁…C₂₂; α = θ gives (6, −8) and (5, 0).
- Ring means 34.80 / −13.29 (sums 2505.89 / −957.23 over 72 points).
- 126 km/h; 46.8 km/h; 1923 s = 32.1 min; 157.08 km in 74.8 min; 35/13 = 2.69.
- The three ring points: 7.14 − 31.46 = −24.32 and 7.14 + 31.46 = 38.60 (data −24.32 / 38.65).
- u_θ from 16.88 to 46.84; u_r from −40.12 to +14.15, with 58 points negative and positives at 185–250°.
- 135 kt = 250.0 km/h; inflow angle tan⁻¹(13.3/34.8) = 20.9°.
- The s25 wording "east side north, west side south, south side east": v(0°) = +38.0, v(180°) = −45.6, u(270°) = +24.6.

**Where the added steps go.** The added steps go inside the four optional blocks: s09–s11, s13–s14, s15–s20 and s24. Outside those blocks, the added lines are one short arithmetic row each, so the pace hardly changes. Re-voiced sentences need re-TTS of that sentence only (splice method of `cf_fix1_splice.py`). Every new number gets a CHECK row in the owning TSX.

### Findings

**C1 · 1:34–1:44 · s03 S3 · (c).** "Three times x hat, plus four times y hat" is said while the picture shows one x̂ and one ŷ with gold links. The three steps and four steps are never drawn.
- **On screen** (reveal on "three times", "four times", "plus"):
  1. `3\,\hat{\mathbf x}=3\,(1,\ 0)=(3,\ 0)`
  2. `4\,\hat{\mathbf y}=4\,(0,\ 1)=(0,\ 4)`
  3. `(3,\ 0)+(0,\ 4)=(3,\ 4)`
- **Narration** (after S3): "Three steps of x hat take us three kilometres east, and four steps of y hat take us four kilometres north, which lands exactly on the balloon."
- **Visual** (`cf_sA.tsx` S03): lay three x̂ arrows tip to tail along the east axis to 3 km, then four ŷ arrows up the dashed line to the balloon. Each group reveals on its words.

**C2 · 2:21–2:35 · s04 S2–S3 · (a)(c).** Pythagoras uses a triangle whose legs are unlabelled: the east leg is the axis itself and the north leg is a bare dashed line. The column also jumps from √(3²+4²) straight to √25.
- **On screen** (the √(9+16) line on "nine and sixteen"):
  1. `r=\sqrt{x^2+y^2}`
  2. `=\sqrt{3^2+4^2}`
  3. `=\sqrt{9+16}`
  4. `=\sqrt{25}=5\ \mathrm{km}`
- **Narration** (S3): "By Pythagoras, r is the square root of three squared plus four squared. Three squared is nine, and four squared is sixteen, so that's the square root of twenty five: five kilometres."
- **Visual** (`cf_sA.tsx` S04): gold leg labels "3 km" under the east leg and "4 km" beside the dashed north leg, plus a right-angle mark at the foot. Each appears on its number word.

**C3 · 2:45–2:52 · s04 S6 · (a)(b).** "Its tangent is four over three, so theta is about fifty three degrees" has two gaps:
- the tangent is never defined, here or anywhere else in the movie (s26 relies on it);
- the inverse step from 1.333 to 53.13° is silent.
- **On screen:**
  1. `\tan\theta=\dfrac{\text{north side}}{\text{east side}}=\dfrac{4}{3}\approx1.333`
  2. `\theta=\tan^{-1}(1.333)\approx53.13^\circ\approx53^\circ`
- **Narration:** "In a right triangle, the tangent of an angle is the side opposite it divided by the side next to it: here the north side over the east side, four over three, about one point three three. The angle with that tangent is about fifty three point one degrees, so theta is about fifty three degrees."
- **Visual** (`cf_sA.tsx` S04): gold links from "4" to the north leg and from "3" to the east leg.

**C4 · 3:18–3:43 · s05 S4–S8 · (a)(d).** The definitions of cosine and sine never appear. "5 cos 53° = 5 × 0.6" uses a value whose origin is not shown. It is also not quite right for 53°: cos 53° = 0.602, and only cos 53.13° = 3/5 = 0.6 exactly.
- **On screen:**
  1. `\cos\theta=\dfrac{\text{east side}}{r},\quad \sin\theta=\dfrac{\text{north side}}{r}`
  2. `\cos\theta=\tfrac{3}{5}=0.6,\quad \sin\theta=\tfrac{4}{5}=0.8`
  3. `x=r\cos\theta=5\times0.6=3`
  4. `y=r\sin\theta=5\times0.8=4`
- Replace "cos 53°" with "cos θ (θ ≈ 53.13°)".
- **Narration** (before S7): "Cosine theta is the east side divided by the long side, and sine theta is the north side divided by the long side. For our balloon that's three fifths, zero point six, and four fifths, zero point eight."
- **Visual** (`cf_sA.tsx` S05): label the triangle legs "3" and "4" next to "r cos θ" and "r sin θ" while the check runs.

**C5 · 5:03–5:07 · s07 S5–S6 · (a).** "1 rad = 360°/2π ≈ 57°" skips 2π ≈ 6.283 and the division.
- **On screen:**
  1. `2\pi\ \mathrm{rad}=360^\circ`
  2. `1\ \mathrm{rad}=\dfrac{360^\circ}{2\pi}=\dfrac{360^\circ}{6.283}\approx57.3^\circ`
- **Narration** (S6): "Two pi is about six point two eight, so one radian is three hundred and sixty degrees divided by six point two eight: about fifty seven degrees."

**C6 · 5:10–5:32 · s07 S8–S10 · (c)(a).** Three gaps:
- The wedge's angle is not labelled: "0.2 rad" never appears on the picture.
- The 1-km arc on the 5-km ring is only a few pixels long.
- "Ten times the distance" has no ratio shown.
- **On screen:**
  1. `0.2\ \mathrm{rad}\approx0.2\times57.3^\circ\approx11.5^\circ`
  2. `5\ \mathrm{km}\times0.2=1\ \mathrm{km}` (kept)
  3. `50\ \mathrm{km}\times0.2=10\ \mathrm{km}` (kept)
  4. `\dfrac{10\ \mathrm{km}}{1\ \mathrm{km}}=\dfrac{50\ \mathrm{km}}{5\ \mathrm{km}}=10`
- **Narration** (S8 add): "That's a turn of about eleven and a half degrees."
- **Visual** (`cf_sA.tsx` S07): label the vertex wedge "0.2 rad" and thicken the inner 1-km arc (or draw a magnified inset of it).

**C7 · 5:46–6:14 · s08 S3–S7 · (e)(b)(a).** Three gaps:
- r̂ is described at 5:46, but nothing is drawn until 6:06.
- In one cut the 5-km arrow from the station becomes a length-1 arrow sitting at the balloon. That is two moves (shrink, then move), and neither is shown or said.
- The spoken "three fifths, four fifths" is not on screen.
- **On screen:**
  1. `\hat{\mathbf r}=\dfrac{(3,\ 4)}{5}`
  2. `=\left(\tfrac{3}{5},\ \tfrac{4}{5}\right)`
  3. `=(0.6,\ 0.8)`
- **Narration** (S6 add): "We draw r hat at the balloon, because it tells us the direction there."
- **Visual** (`cf_sB.tsx` S08):
  - S3: a ghost r̂ at the balloon.
  - S6: keep the 5-km arrow labelled "5". Shrink a copy along it to length 1, labelled "1", then slide it out to the balloon.
  - Tip label "(0.6, 0.8)".

**C8 · 6:14–6:21 · s08 S8 · (a).** "|r̂| = √(0.36 + 0.64) = 1" does not show where 0.36 and 0.64 come from, and the voice leaves out the square root.
- **On screen:**
  1. `|\hat{\mathbf r}|=\sqrt{0.6^2+0.8^2}`
  2. `=\sqrt{0.36+0.64}`
  3. `=\sqrt{1}=1`
- **Narration:** "Its length is the square root of zero point six squared plus zero point eight squared. That's zero point three six plus zero point six four, which is one, and the square root of one is one."

**C9 · 7:34–7:49 and 8:03–8:10 · s09 S10–S11, S14 · (c).** The inset shows "5.1 km" and "4.9 km", but neither number is spoken or computed. The rejected clockwise direction is a short rose stub with no label (review 1 Should 8 covered the inset box and the slide/r̂ labels, not these).
- **On screen:**
  1. `5+0.1=5.1\ \mathrm{km}\ne5`
  2. `5-0.1=4.9\ \mathrm{km}\ne5`
- **Narration** (S10 add): "For example, if the slide had a part of a tenth of a kilometre along r hat, the balloon would end up five point one or four point nine kilometres from the station, not five."
- **Visual** (`cf_sB.tsx` S09): label the stub "clockwise: θ shrinks", in muted rose with a cross.

**C10 · 8:57–9:12 · s10 S8–S9 · (c).** "Turn the whole drawing": the turned triangle replaces the original, so there is no before/after.
- **Visual** (`cf_sB.tsx` S10): keep the original "p east, q north" triangle as a 40 % ghost, with a gold 90° arc from it to the turned "p north, q west" triangle.

**C11 · 9:11–9:20 · s10 S9–S11 · (b).** "p(0, 1) + q(−1, 0) = (−q, p)" merges two moves: multiply each vector by its number, then add east parts and north parts.
- **On screen:**
  1. `\to p\,(0,\ 1)+q\,(-1,\ 0)`
  2. `=(0,\ p)+(-q,\ 0)`
  3. `=(0-q,\ p+0)`
  4. `=(-q,\ p)`
- **Narration** (S10 or S11): "p times zero, one is zero, p, and q times minus one, zero is minus q, zero. Adding the east parts gives minus q, and adding the north parts gives p."

**C12 · 9:38–9:45 · s10 S16 · (a).** "|(−4, 3)| = √(16 + 9) = 5" skips the squares, and the "5 as before" is not shown beside it.
- **On screen:**
  1. `|(-4,\ 3)|=\sqrt{(-4)^2+3^2}=\sqrt{16+9}=\sqrt{25}=5`
  2. `|(3,\ 4)|=\sqrt{9+16}=5`
- **Narration:** "Minus four squared is sixteen and three squared is nine, so its length is the square root of twenty five: five, the same as the balloon's arrow."

**C13 · 10:08–10:16 · s11 S3–S4 · (d).** "Using the rule, we swap them": only the keyword is on screen, not the rule with symbols or the substitution. The redesigned `calc_rows` row 1 still goes from r̂ to θ̂ directly.
- **On screen:**
  1. `(p,\ q)\to(-q,\ p)`
  2. `p=\cos\theta,\ \ q=\sin\theta`
  3. `\hat{\boldsymbol\theta}=(-\sin\theta,\ \cos\theta)`
- **Narration:** keep. S3 already says "swap them and put a minus on the first".

**C14 · 10:21–10:39 · s11 S6–S8 · (c)(e).** Two gaps:
- The turned triangle replaces r̂'s triangle with no before/after.
- The west leg is labelled "sin θ" while the voice says "minus sine theta becomes the east part".
- **Visual** (`cf_sB.tsx` S11):
  - keep r̂'s triangle as a ghost with a gold 90° arc;
  - label the west leg "sin θ, pointing west" and add a gold link to "−sin θ" in the formula on "minus sine theta".

**C15 · 10:42–11:21 · s11 S10–S15 · (a).** The check rows give results with no substitution, and the length row skips the squares.
- **On screen:**
  1. `\theta=0^\circ:\ (-\sin0^\circ,\ \cos0^\circ)=(0,\ 1)`
  2. `\theta=90^\circ:\ (-\sin90^\circ,\ \cos90^\circ)=(-1,\ 0)`
  3. `\theta\approx53.13^\circ:\ (-0.8,\ 0.6)`
  4. `|\hat{\boldsymbol\theta}|=\sqrt{(-0.8)^2+0.6^2}=\sqrt{0.64+0.36}=1`
- **Narration** (S10): "At theta equals zero, minus sine zero is zero, and cosine zero is one, so theta hat is zero, one." S12: "At ninety degrees, minus sine ninety is minus one, and cosine ninety is zero, so theta hat is minus one, zero."
- **Visual:** draw r̂ next to θ̂ at the balloon while the dot product is said, because the r̂ · θ̂ row uses it.

**C16 · 11:21–11:47 · s11 S16–S19 · (a)(c)(d), the trigger.** Already being redesigned (working-tree `calc_rows` rows 7–17 and the U1 inset). Check the redesign for four remaining gaps:
- `5\ \mathrm{km}=5000\ \mathrm{m}` before `s=r\,\Delta\theta`.
- The calc row `\theta=53^\circ` should become `\theta\approx53.13^\circ`, to match "before 53.13°" (5000 cos 53° = 3009, not 3000).
- Show the squares: `\sqrt{7.0^2+5.2^2}=\sqrt{49+27.04}=\sqrt{76.04}\approx8.7`.
- Split the last row into `-7.0/8.7\approx-0.80` and `5.2/8.7\approx0.60`.

Recomputed values: 0.1° = 0.0017453 rad; s = 8.7266 m; (2993.01, 4005.23) m; slide (−6.99, +5.23) m; slide ÷ s = (−0.801, 0.599).

**C17 · 12:04–12:19 · s12 S2–S4 · (a).** The east, north and west rows give r̂ and θ̂ with no θ and no substitution.
- **On screen:**
  1. `\theta=0^\circ:\ \hat{\mathbf r}=(\cos0^\circ,\ \sin0^\circ)=(1,\ 0),\ \hat{\boldsymbol\theta}=(0,\ 1)`
  2. `\theta=90^\circ:\ \hat{\mathbf r}=(0,\ 1),\ \hat{\boldsymbol\theta}=(-1,\ 0)`
  3. `\theta=180^\circ:\ \hat{\mathbf r}=(\cos180^\circ,\ \sin180^\circ)=(-1,\ 0),\ \hat{\boldsymbol\theta}=(-\sin180^\circ,\ \cos180^\circ)=(0,\ -1)`
- **Visual** (`cf_sB.tsx` S12): a small "θ = 0°", "90°" or "180°" label at the balloon's position as it stops.

**C18 · 12:59–13:46 · s13 S4–S13 · (c).** The close-up has no context:
- no station, no circle and no θ = 53°, only "to the station";
- the wind arrow has no "10 m/s";
- r̂ and θ̂ (length 1) are drawn longer than the 6 m/s shadow, which mixes two scales without saying so.
- **Visual** (`cf_sB.tsx` S13):
  - a small locator in the corner (station, 5-km circle, balloon at 53°), with a gold zoom frame leading into the close-up, as in the s11 redesign;
  - wind tip label "10 m/s, due east" on "ten metres per second";
  - keyword "r̂, θ̂: length 1 · wind: its own scale".
- **Narration:** none needed.

**C19 · 14:55–15:11 · s14 S3–S4 · (b)(a).** Scalar times vector is done in one jump, and the minus-times-minus sign (the classic trap) is never shown.
- **On screen:**
  1. `6\,\hat{\mathbf r}=6\,(0.6,\ 0.8)=(6\times0.6,\ 6\times0.8)=(3.6,\ 4.8)`
  2. `-8\,\hat{\boldsymbol\theta}=-8\,(-0.8,\ 0.6)=\big((-8)(-0.8),\ (-8)(0.6)\big)=(6.4,\ -4.8)`
- **Narration** (S4): "Minus eight times minus zero point eight is plus six point four, because two minus signs make a plus, and minus eight times zero point six is minus four point eight."

**C20 · 15:28–15:36 · s14 S8 · (a).**
- **On screen:**
  1. `\sqrt{6^2+8^2}=\sqrt{36+64}=\sqrt{100}=10\ \mathrm{m/s}`
  2. `|(10,\ 0)|=\sqrt{10^2+0^2}=10\ \mathrm{m/s}`
- **Narration:** "Six squared is thirty six and eight squared is sixty four, which makes a hundred, and its square root is ten: the same as the wind's own length."

**C21 · 17:26–17:37 · s15 S14 · (a).** "cos 30° ≈ 0.87 (0.866)" and "sin 30° = 0.5" appear with no origin.
- **On screen:**
  1. `\cos30^\circ=\dfrac{\sqrt3}{2}=\dfrac{1.732}{2}\approx0.866`
  2. `\sin30^\circ=\tfrac12=0.5`
- **Narration:** "Cosine of thirty degrees is the square root of three over two: one point seven three two over two, about zero point eight six six. Sine of thirty degrees is exactly one half."
- **Visual** (`cf_sB.tsx` S15): label the x̂′ triangle legs "0.866" and "0.5" next to "cos α" and "sin α".

**C22 · 17:53–18:09 · s16 S3–S4 · (d)(c).** The rule is applied with no symbols, and the ŷ′ triangle legs are unlabelled.
- **On screen:**
  1. `(p,\ q)\to(-q,\ p)`
  2. `p=\cos\alpha,\ \ q=\sin\alpha`
  3. `\hat{\mathbf y}'=(-\sin\alpha,\ \cos\alpha)`
- **Visual** (`cf_sB.tsx` S16): label the ŷ′ triangle legs "sin α (west)" and "cos α (north)".

**C23 · 18:09–18:38 · s16 S5–S8 · (a).** Three gaps:
- The substitution step is missing.
- The length line skips the squares and says "= 1"; in fact 0.866² = 0.74996, so it should read "≈" (exactly 3/4).
- The dot product skips its products.
- **On screen:**
  1. `\hat{\mathbf y}'=(-\sin30^\circ,\ \cos30^\circ)=(-0.5,\ 0.866)`
  2. `|\hat{\mathbf y}'|=\sqrt{(-0.5)^2+0.866^2}=\sqrt{0.25+0.75}=1`, with `0.866^2\approx0.75\ (\text{exactly }\tfrac34)`
  3. `\hat{\mathbf x}'\cdot\hat{\mathbf y}'=0.866\times(-0.5)+0.5\times0.866=-0.433+0.433=0`
- **Narration** (S8 add): "That's minus zero point four three three plus zero point four three three, which is zero."

**C24 · 19:14–20:18 · s17 S6, S14–S15 · (a)(e).** Two gaps:
- The length check jumps from √(4.6² + 1.96²) to √25 and writes "=".
- The keyword "shadow on the new x axis" stays up through the whole y′ part.
- **On screen:**
  1. `\text{length}=\sqrt{4.6^2+1.96^2}`
  2. `=\sqrt{21.16+3.84}`
  3. `\approx\sqrt{25}=5\ \mathrm{km}`
- **Narration** (S15): "Four point six squared is about twenty one point one six, and one point nine six squared is about three point eight four. Together that's twenty five, and its square root is five kilometres, as before."
- **Visual** (`cf_sB.tsx` S17): from S6, the keyword becomes "shadows on the new axes".

**C25 · 20:57–21:11 · s18 S6–S8 · (c).** "Go along one row, multiply… then add" is said, but only the keyword "row × column, then add" is shown.
- **On screen:**
  1. `\text{top row: }\cos\alpha\cdot x+\sin\alpha\cdot y=x'`
  2. `\text{bottom row: }-\sin\alpha\cdot x+\cos\alpha\cdot y=y'`
- **Visual** (`cf_sB.tsx` S18): a gold sweep along the top row and down the (x, y) column, each pair of entries lit as it is multiplied.

**C26 · 21:11–21:22 · s18 S9 · (a).** "top row: 0.866 × 3 + 0.5 × 4 = 4.60" skips the products, and the bottom row is never computed (review Should 12 asked only for "≈").
- **On screen:**
  1. `0.866\times3+0.5\times4=2.598+2\approx4.60=x'`
  2. `-0.5\times3+0.866\times4=-1.5+3.464\approx1.96=y'`
- **Narration** (S9 add): "And the bottom row gives minus zero point five times three, plus zero point eight six six times four: one point nine six, our y prime again."

**C27 · 21:25–21:51 · s18 S11–S14 · (d)(b).** "The dot product of two arrows of length one is the cosine of the angle between them": the rule from the dot-product movie is not restated on screen. "So each number is the cosine of…" then jumps over three of the four entries. Only cos α is shown. A viewer is never shown why sin α and −sin α are cosines.
- **On screen:**
  1. `\hat{\mathbf a}\cdot\hat{\mathbf b}=|\hat{\mathbf a}|\,|\hat{\mathbf b}|\cos\gamma=1\times1\times\cos\gamma=\cos\gamma`
  2. `\hat{\mathbf x}'\cdot\hat{\mathbf x}=\cos\alpha`
  3. `\hat{\mathbf x}'\cdot\hat{\mathbf y}=\cos(90^\circ-\alpha)=\sin\alpha`
  4. `\hat{\mathbf y}'\cdot\hat{\mathbf x}=\cos(90^\circ+\alpha)=-\sin\alpha`
  5. `\hat{\mathbf y}'\cdot\hat{\mathbf y}=\cos\alpha`
  6. At 30°: `\cos60^\circ=0.5,\ \cos120^\circ=-0.5`
- **Narration** (after S11): "As in the dot product movie: length times length times the cosine of the angle, and both lengths are one." After S14: "The angle between x hat prime and y hat is ninety degrees minus alpha, and its cosine is sine alpha. The angle between y hat prime and x hat is ninety degrees plus alpha, and its cosine is minus sine alpha."
- **Visual** (`cf_sB.tsx` S18): draw the arcs α, 90° − α and 90° + α between the pairs in turn, each linked in gold to its matrix entry.

**C28 · 22:32–22:58 · s19 S9–S12 · (a).** C₁₁…C₂₂ are shown as "(1, 0) · (cos α, sin α) = cos α", without the term-by-term products.
- **On screen:**
  1. `C_{11}=(1,0)\cdot(\cos\alpha,\sin\alpha)=1\cdot\cos\alpha+0\cdot\sin\alpha=\cos\alpha`
  2. Write C₁₂, C₂₁ and C₂₂ the same way. C₁₂ is `1\cdot(-\sin\alpha)+0\cdot\cos\alpha=-\sin\alpha`.
- **Narration** (S9): "one times cosine alpha, plus zero times sine alpha: cosine alpha." The other three need no words.

**C29 · 22:58–23:26 · s19 S13–S16 · (d)(b).** The summing rule from the vectors movie appears only as the keyword "i repeated → add i = 1, 2". The j = 1 line then substitutes both the C's and x₁, x₂ → x, y in one move, and there is no number check.
- **On screen:**
  1. `x'_j=x_i\,C_{ij}\ \text{means}\ x'_j=\sum_{i=1}^{2}x_i\,C_{ij}`
  2. `x'_1=x_1C_{11}+x_2C_{21}`
  3. `=x_1\cos\alpha+x_2\sin\alpha`
  4. `=x\cos\alpha+y\sin\alpha`
  5. `=3\times0.866+4\times0.5\approx4.60\ \checkmark`
- Do the same for j = 2, ending with ≈ 1.96.
- **Narration** (S16 add): "With our numbers that's four point six again."

**C30 · 24:47–25:13 · s20 S7–S10 · (c)(a).** "Let's check with the east wind" is said, but the wind is never drawn. The picture shows only r̂, θ̂ and the axes. The input "cos = 0.6, sin = 0.8" also does not name θ.
- **On screen:**
  1. `\mathbf u=(10,\ 0),\ \cos\theta=0.6,\ \sin\theta=0.8`
  2. `x'=10\times0.6+0\times0.8=6+0=6`
  3. `y'=-10\times0.8+0\times0.6=-8+0=-8`
- **Visual** (`cf_sB.tsx` S20): the 10 m/s east wind at the balloon, its shadow on the x′ (= r̂) axis labelled 6 on "six" and on the y′ (= θ̂) axis labelled −8 on "minus eight", in the u_r rose / u_θ teal colours.

**C31 · 25:51–26:05 · s20 S17–S19 · (c).** "With turned axes, we choose one angle for the whole map" is illustrated with two extra unlabelled arrow pairs (east point and north-west point). Both pairs are polar pairs; the fixed turned-axes pair is never shown. The north-west pair also sits on the "y′" label.
- **Visual** (`cf_sB.tsx` S20): at three points (θ = 0°, 53°, 150°), draw
  - the identical turned pair x̂′, ŷ′ at α = 53° (muted), labelled "turned axes: α = 53° everywhere";
  - the polar pair r̂, θ̂ (bright), labelled "polar: θ = 0°, 53°, 150°".
- Move the pair off the y′ label.

**C32 · 27:42–28:30 · s22 S5–S10 · (a)(e).** "Add up the seventy two values, and divide by seventy two" is said, but no sum or division with numbers is shown. "≈ 35 m/s" and "−13 m/s" appear as results. The exact means, 34.8 and −13.3, are first seen in s26 (35:41), 7.5 minutes later, with no origin.
- **On screen** (reveal on "add up" and "divide"):
  1. `360^\circ\div5^\circ=72\ \text{points}`
  2. `\overline{u_\theta}=\dfrac{2505.9\ \mathrm{m/s}}{72}\approx34.8\approx35\ \mathrm{m/s}`
  3. `\overline{u_r}=\dfrac{-957.2\ \mathrm{m/s}}{72}\approx-13.3\approx-13\ \mathrm{m/s}`
- **Narration** (S6 and S10): "The seventy two tangential winds add up to about two thousand five hundred and six metres per second. Divided by seventy two, that's about thirty four point eight, or about thirty five." "The seventy two radial winds add up to about minus nine hundred and fifty seven. Divided by seventy two, that's about minus thirteen point three, or about minus thirteen."
- **Visual** (`cf_sC.tsx` S22): the 72 ring dots light in turn while a running sum ticks in the column. Add CHECK rows for 2505.89, −957.23 and 72.

**C33 · 28:39–29:01 · s22 S13–S15 · (a)(c).** "135 kt" ≈ 250 km/h is never put in m/s, so it cannot be compared with the 35 m/s on screen or the 0–50 m/s colour bar. "The model analysis smooths out the strongest winds" also has no number. The comparison mixes the strongest one-minute wind with a ring average, and the narration doesn't say so.
- **On screen:**
  1. `135\ \mathrm{kt}\times1.852\approx250\ \mathrm{km/h}`
  2. `250\ \mathrm{km/h}\div3.6\approx69\ \mathrm{m/s}`
  3. `\text{strongest on our ring}\approx49\ \mathrm{m/s}` (DF: ring max 48.9 m/s)
- **Narration** (S14 add / S15): "That's about sixty nine metres per second. It's the single strongest wind, while our thirty five is an average round the ring, and even the strongest wind on our model ring is only about forty nine."

**C34 · 29:18–29:29 · s23 S5 · (a).** "√(35² + 13²) ≈ 37" skips the squares (the case named in the brief). Review Should 2 fixed only the timing.
- **On screen:**
  1. `\sqrt{35^2+13^2}`
  2. `=\sqrt{1225+169}`
  3. `=\sqrt{1394}\approx37.3\approx37\ \mathrm{m/s}`
- **Narration:** "Thirty five squared is twelve hundred and twenty five, and thirteen squared is a hundred and sixty nine. Together that's thirteen hundred and ninety four, and its square root is about thirty seven metres per second."
- **Honesty note:** this is the arrow built from the two averages. The average wind speed on the ring is 40.2 m/s, so don't call 37 "the wind speed".

**C35 · 29:54–30:06 · s23 S10 · (a).** Two silent steps: 25 km becomes 25 000 m, and "≈ 1900 s ≈ 32 min" skips 1923 s and the division by 60.
- **On screen:**
  1. `25\ \mathrm{km}=25\,000\ \mathrm{m}`
  2. `t=\dfrac{25\,000\ \mathrm{m}}{13\ \mathrm{m/s}}\approx1923\ \mathrm{s}`
  3. `1923\ \mathrm{s}\div60\ \mathrm{s/min}\approx32\ \mathrm{min}`
- **Narration:** "Twenty five thousand divided by thirteen is about nineteen hundred and twenty three seconds. Divided by sixty seconds a minute, that's about thirty two minutes."

**C36 · 30:06–30:20 · s23 S11 · (a)(c).** "2π × 25 km ≈ 157 km" and "157 000 m / 35 m/s ≈ 75 min" skip their arithmetic. "One lap of this ring" is also never drawn: the picture still shows the radius.
- **On screen:**
  1. `2\pi\times25\ \mathrm{km}=2\times3.1416\times25\approx157\ \mathrm{km}=157\,000\ \mathrm{m}`
  2. `t=\dfrac{157\,000\ \mathrm{m}}{35\ \mathrm{m/s}}\approx4490\ \mathrm{s}`
  3. `4490\ \mathrm{s}\div60\approx75\ \mathrm{min}`
- **Narration:** "…about a hundred and fifty seven kilometres, takes about four thousand four hundred and ninety seconds, which is about seventy five minutes."
- **Visual** (`cf_sC.tsx` S23): a gold arc sweeps the full ring on "one lap", labelled "157 km".

**C37 · 30:24–30:35 · s23 S13 · (b).** It is never shown why a speed ratio is a distance ratio ("for every metre in, almost three round").
- **On screen:**
  1. `\dfrac{\text{distance round}}{\text{distance in}}=\dfrac{35\,t}{13\,t}=\dfrac{35}{13}\approx2.7`
- **Narration:** "In any stretch of time, it goes thirty five metres round for every thirteen in, and thirty five over thirteen is about two point seven."

**C38 · 31:36–32:30 · s24 S8–S16 · (b).** "So u sub r equals u" and "u sub theta equals minus u, which is plus sixteen point nine" skip the substitution. At 90°, that hides the −(−16.9) double negative.
- **On screen:**
  1. `0^\circ:\ u_r=(-8.7)(1)+(38)(0)=-8.7`
  2. `u_\theta=-(-8.7)(0)+(38)(1)=38`
  3. `90^\circ:\ u_r=(-16.9)(0)+(-37.4)(1)=-37.4`
  4. `u_\theta=-(-16.9)(1)+(-37.4)(0)=+16.9`
- **Narration** (S16): "And u sub theta is minus u times one, plus v times zero. Minus times minus sixteen point nine makes plus sixteen point nine: round."

**C39 · 32:43–32:53 · s24 S19 · (a).** "cos ≈ −0.707, sin ≈ 0.707" appear with no origin.
- **On screen:**
  1. `\cos135^\circ=-\cos45^\circ=-\tfrac{1}{\sqrt2}\approx-0.707`
  2. `\sin135^\circ=\sin45^\circ=\tfrac{1}{\sqrt2}\approx0.707`
- **Narration:** "A hundred and thirty five degrees is forty five degrees short of due west, so its cosine is minus one over the square root of two, about minus zero point seven zero seven, and its sine is plus zero point seven zero seven."
- **Visual** (`cf_sC.tsx` S24): draw r̂ at the 135° point with its equal west and north legs (a 45° triangle).

**C40 · 33:13–33:31 · s24 S22–S23 · (b).** In build 1 the column writes "u_θ = 10.1 × 0.707 + …", with the −u already folded into +10.1. The −(−10.1) step is never shown. The products are now 7.14 / 31.46 (fix 1).
- **On screen:**
  1. `u_r=(-10.1)(-0.707)+(-44.5)(0.707)=7.14-31.46\approx-24.3`
  2. `u_\theta=-(-10.1)(0.707)+(-44.5)(-0.707)=7.14+31.46\approx38.6`
- **Narration** (S22): "And u sub theta is minus u times sine, so minus minus ten point one, which is plus ten point one, times zero point seven zero seven, plus minus forty four point five times minus zero point seven zero seven."

**C41 · 34:41–35:07 · s25 S10–S12 · (e)(c).** The graph shows none of the spoken numbers: "between about seventeen and forty seven, with an average of thirty five", "between about minus forty and plus fourteen", "negative at fifty eight of the seventy two points". The mean lines are unlabelled dotted lines, and the 14 outward points are not marked.
- **Visual** (`cf_sC.tsx` S25), each label on its words:
  - "17" at 90° and "47" at 215° on the teal curve, with "mean 35" on its dotted line;
  - "−40" at 100° and "+14" at 220° on the rose curve, with "mean −13";
  - a light rose band over 185°–250° labelled "14 points out".
- **On screen:** `72-14=58\ \text{points in}`

**C42 · 34:21–34:29 · s25 S7 · (c).** "On the east side it blows north, on the west side south, on the south side east": the graph is not linked to these words.
- **Visual** (`cf_sC.tsx` S25): gold links on each phrase:
  - 0°: v ≈ +38;
  - 180°: v ≈ −46;
  - 270°: u ≈ +25.

**C43 · 35:41–35:56 · s26 S4–S5 · (a)(c)(d).** Three gaps:
- "tan(inflow angle) = 13.3/34.8 ≈ 0.38" uses inputs never shown before (fixed by C32).
- The triangle is not drawn: the wind sits over θ̂ with a wedge, but no legs.
- The inverse-tangent step is silent. The tangent rule is not restated (C3 adds it in s04).
- **On screen:**
  1. `\tan(\text{inflow angle})=\dfrac{\text{in}}{\text{round}}=\dfrac{13.3}{34.8}\approx0.382`
  2. `\text{inflow angle}=\tan^{-1}(0.382)\approx20.9^\circ\approx21^\circ`
- **Narration** (S4–S5): "Its tangent is the side opposite the angle over the side next to it: the inward part over the round part, thirteen point three over thirty four point eight, about zero point three eight. The angle with that tangent is about twenty one degrees."
- **Visual** (`cf_sC.tsx` S26): legs drawn as the wind's two parts, "34.8 round" (teal, along θ̂) and "13.3 in" (rose, toward the eye), with the wind as the long side.
- **Note:** don't use the rounded 13/35: it gives 0.371 and 20.4°.

### Summary

43 items in total. Every item is tagged above with its letters (a)–(e).

- **Must (a viewer following the maths notices):** C2, C3, C4, C7, C11, C19, C23, C27, C29, C30, C31, C32, C34, C35, C36, C38, C40, C43.
- **Should:** the rest.
- **Narration re-voice needed:** about 30 sentences in s03, s04, s05, s07, s08, s09, s10, s11, s14, s15, s16, s17, s18, s19, s22, s23, s24 and s26. In all, this adds about 4–5 minutes, mostly inside the optional blocks (s09–s11, s13–s14, s15–s20, s24). The skip chip times move, so recompute them from `timing.json` as in fix 1.
- **Visual-only items (no re-voice):** C10, C14, C18, C25, C31, C41, C42.

**Overall: FIX** (calculation and sync, 43 items; 18 Must). The physics and every number are right. The gaps are missing inputs, arithmetic and pictures, not wrong results.

**Limits.**
- Frames were taken at sentence ends. Motion between them was not checked frame by frame, and audio was not heard.
- Timestamps are build 1; the fix-1 and s11-redesign builds shift everything after s11.
- I did not open the redesigned s11 render; C16 is checked against the working-tree storyboard rows only.

**Disk.** C: 115 GB free, G: 485 GB free. This audit wrote 30 MB of frames to the ignored `calc_audit/` folder.

## #5c ch00_coordinates_sphere — calculation & sync audit (2026-11-05)

**Scope.** Same method as #5b: `script.md`, `storyboard.yaml`, `timing.json`, `cs_sA/sB/sC.tsx` (the CalcStack rows and their `SS`/`AT` anchors), `data/`. All numbers recomputed in Python. No render yet.

**Recomputed, all agree.**
- Brest: sin/cos 48.4° = 0.7478 / 0.6639; z = 4764.3 km; a cos φ = 4229.8 km; x = 4217.0 km; y = −331.9 km; Pythagoras checks back to 4230 and 6371.
- Brest r̂ = (0.662, −0.052, 0.748).
- Khulna: z = 2469, a cos φ = 5873, x = 41.0, y = 5873 km.
- Ω = 2π/86 164 = 7.2921 × 10⁻⁵ rad/s.
- U = 464.6 m/s at the equator; 464.5 Singapore; 428.3 Khulna; 308.4 Brest; 95.0 Longyearbyen.
- 1° = 111.19 km; 1′ = 1.853 km; 48.4° × 111.2 = 5382 km; one degree east at Brest = 73.8 km.
- Box widths 27.8 / 25.6 / 18.5 / 5.7 km; 27.8/5.7 = 4.9.
- Box areas 772.8 / 712.4 / 513.1 / 158.0 km².
- Strip check 0.1582 vs 0.1580; strips 0.174 + 0.168 + 0.158 = 0.500.
- 2πa² = 255.0 × 10⁶ km²; 4πa² = 510.1 × 10⁶ km².
- Weighted average example 20 °C.

**Re-voice needed:** C1 (s20 S6, s21 S4) and C2 (s26 S13). Everything else is visual only.

### Must fix (2)

**C1 — s20 S6 (24:14), s21 S4 (25:55): "Twenty three hours and fifty six minutes is eighty six thousand one hundred and sixty four seconds" is false arithmetic.** 23 h 56 min = 82 800 + 3 360 = 86 160 s. The sidereal day is 23 h 56 min **4 s** = 86 164 s. The screen row "T = 86 164 s" appears with no working.
- *Narration (re-voice):*
  - s20 S6: "…the Earth turns once every twenty three hours, fifty six minutes and four seconds."
  - s21 S4: "Twenty three hours, fifty six minutes and four seconds is eighty six thousand one hundred and sixty four seconds."
- *Rows (`cs_sB.tsx` S21, on S4):* `T=23\times3600+56\times60+4` then `=82\,800+3\,360+4=86\,164\ \text{s}`.
- *Visual (S20):* change the label to "one turn: 23 h 56 min 4 s".

**C2 — s26 S13 (34:38): wrong back-reference.** "This is also how we turned the coast's latitudes and longitudes into kilometres in Part 2" is no longer true. The coast derivation moved to Part 4: Part 2 s26 now says "In Part 4, we'll … measure exactly how much". The keyword "Part 2: degrees → km" (`cs_sC.tsx` S26) is wrong too.
- *Narration:* "This is also how, in Part 4, we'll turn a coast's latitudes and longitudes into kilometres."
- *Keyword:* "Part 4: degrees → km".

### Should fix (7)

**C3 — s21 S7–S14 (26:19–27:24): rounding makes the shown arithmetic disagree with the voice.**
- `7.29\times10^{-5}\times6.371\times10^{6}` is 464.4, but the row says ≈ 465.
- The rows then multiply 465 by cos φ. That gives 428.7 and 308.7, while the screen and voice say 428 and 308.
- Singapore's "about 464" (S10) has no row at all; it appears only on a map label.
- *Rows:*
  - S7: `U_{\text{eq}}=7.292\times10^{-5}\times6.371\times10^{6}\approx464.6\approx465\ \text{m/s}`
  - S10: `\text{Singapore }1.35^\circ\text{N: }464.6\times0.9997\approx464`
  - S11–S14: `464.6\times0.9219\approx428`, `464.6\times0.6639\approx308`, `464.6\times0.2045\approx95`

**C4 — s21 S8–S9 (26:33–26:50): the easy check hides two steps.** The "40 000 km" and the "almost twice a jet" have no working.
- *Rows:*
  - `2\pi\times6400\approx40\,000\ \text{km}`
  - `40\,000\div24\approx1670\ \text{km/h}` (exists)
  - `465\times3.6\approx1670\ \text{km/h}` (links the exact and easy routes)
  - `1670\div900\approx1.9`

**C5 — s20 S8 (24:24): "four minutes shorter … because the Earth also moves along its orbit" gives the 4 min with no origin.** *Rows:* `360^\circ\div365\ \text{days}\approx1^\circ\ \text{a day}` then `24\ \text{h}\div360=4\ \text{min per }1^\circ`. A small orbit sketch: the Sun direction shifts 1° per day, so the Earth must turn 361° from noon to noon.

**C6 — s19 S3, S5, S8, S9 (22:30–23:24): Khulna's sines and cosines are said but never shown on their own.** Brest got these rows in s15–s17; here the values appear only inside the products. "sine phi is 0.3875" is said at S3, but its row comes at S4.
- *Rows:*
  - S3: `\sin22.8^\circ\approx0.3875`
  - S5: `\cos22.8^\circ\approx0.9219`
  - S8: `\cos89.6^\circ\approx0.00698`
  - S9: `\sin89.6^\circ\approx1.000`

**C7 — s26 S6–S9 (33:50–34:17): box widths shown as labels only.** The widths appear ("25.6 km wide" and so on) but the multiplication never does. *Rows on each label's words:*
- `27.8\times0.9997\approx27.8`
- `27.8\times0.9219\approx25.6`
- `27.8\times0.6639\approx18.5`
- `27.8\times0.2045\approx5.7`

**C8 — s31 S7 (40:53): "their steps in sine phi are 0.174, 0.168 and 0.158" shows no subtractions.** *Rows:*
- `\sin10^\circ-\sin0^\circ=0.174-0=0.174`
- `\sin20^\circ-\sin10^\circ=0.342-0.174=0.168`
- `\sin30^\circ-\sin20^\circ=0.500-0.342=0.158`

**C9 — several scenes: small hidden steps.**
- s18 S7–S8 (21:00–21:25): add the squares:
  - `\sqrt{17\,783\,000+110\,000}=\sqrt{17\,893\,000}\approx4230`
  - `\sqrt{17\,893\,000+22\,696\,000}=\sqrt{40\,589\,000}\approx6371`
- s19 S11: the same for Khulna.
- s32 S3 (41:49): `2\pi\times40.6\times10^{6}\approx255\times10^{6}\ \text{km}^2`.
- s34 S14 (45:36): `16.3-7.1=9.2\ ^\circ\text{C}`.

### Verified (keep)
- Every derivation in s08, s14–s18 and s27–s33 is one move per sentence, with its rows on the words.
- The skip chips and "if you skipped" lines are in place.
- The s04, s07, s11, s23, s24, s28 and s30 rows match the voice digit for digit.

### Verdict: FIX (Part 3 audit: 2 Must, 7 Should)

## #5d ch00_coordinates_frames — calculation & sync audit (2026-11-05)

**Recomputed, all agree.**
- Brest frame: k̂ = (0.662, −0.052, 0.748), î = (0.078, 0.997, 0), ĵ = (−0.745, 0.059, 0.664); î × ĵ = k̂; î·ĵ = 0.0007 ("zero up to rounding").
- Trappes 480/6371 = 0.0753 rad = 4.32°.
- Singapore k̂·k̂_B = −0.191 → 101.0°.
- Khulna k̂·k̂_B = 0.246 → 75.8°; î_B·î_K = −0.0715 → 94.1°.
- Coast: Δy = 91.51 km, Δx = −55.03 km; tan = 0.601 → 31.0°; bearing 329°; α = 121°.
- Ian's wind: along 9.37, across −31.57 m/s; check 32.97.
- Plane: 900 km / 74 = 12.2°.
- Turning rate 2.36 × 10⁻⁶ rad/s = 11.7° per day.
- Metric term 1.57 × 10⁻⁵; f v = 1.03 × 10⁻³; ratio 65.6 ≈ 66.
- The glider 11.5 / 8.2 → 14.12 m/s, the same speed.

**Physics checked.**
- Going east, east tips north and down; going east, up leans east and north leans west.
- Du/Dt = uv tan φ / a with u, v > 0 in the NH makes u grow and v shrink.

**Re-voice needed:** D1 (one word), D3 (place name), and D4 if (b) is chosen. Everything else is visual only.

### Should fix (8)

**D1 — s09 S3 (11:00.8): "about seventy eight kilometres west of Khulna" disagrees with Part 2.** Part 2 s21 S5 says "seventy nine" (data 79.36 km). *Re-voice:* "about seventy nine kilometres".

**D2 — s09 S5–S10 (11:17–11:55): the Khulna arithmetic skips moves that Brest and Singapore showed.**
- k̂_K appears with no cos/sin inputs.
- The dot product jumps straight to "0.004 − 0.048 + 0.290"; the products are missing.
- î_K and î_B·î_K show results only.
- *Rows:*
  - `\cos\varphi=0.922,\ \sin\varphi=0.388,\ \cos\lambda=0.007,\ \sin\lambda=1.000` (from Part 3)
  - `0.662\times0.006+(-0.052)\times0.922+0.748\times0.388` → `=0.004-0.048+0.290` (exists)
  - `\hat{\mathbf i}_K=(-\sin89.6^\circ,\ \cos89.6^\circ,\ 0)=(-1.000,\ 0.007,\ 0)`
  - `\hat{\mathbf i}_B\cdot\hat{\mathbf i}_K=0.078\times(-1.000)+0.997\times0.007+0=-0.078+0.007=-0.071`
  - `\cos^{-1}(-0.071)\approx94^\circ`

**D3 — s11 S2, S9–S12 (13:25–14:52): a place name and several steps.**
- (a) The point 26.92° N, 82.35° W is about 4 km from **Englewood**, but about 22 km from Venice, Florida (27.10° N, 82.45° W). Part 2's data calls it `englewood`. *Re-voice S2:* "…one near Englewood, further up the coast…"
- (b) The degree→radian step is not shown, and "0.0144" (row 3) vs "0.01436" (row 4) disagree: 6371 × 0.0144 = 91.7, not 91.5. *Rows:*
  - `0.823\times0.01745=0.01436\ \text{rad}`
  - `-0.553\times0.01745=-0.00965\ \text{rad}`
  - Use 0.01436 in both rows.
- (c) The middle latitude needs its average: `\frac{26.10+26.92}{2}=26.51^\circ\approx26.5^\circ`.

**D4 — s14 S7, S9 (18:52, 19:09): the across value is both −31.5 and −31.6.** The arithmetic row gives −19.0 − 12.5 = −31.5 ("about minus thirty one and a half"). The check row and the summary say 31.6 / −31.6. *Fix, either one:*
- (a) Visual only: show the products to 2 dp, −19.03 − 12.51 = −31.54 ≈ −31.5, and use 31.5 everywhere: `9.4^2+31.5^2\approx88+992=1080,\ \sqrt{1080}\approx32.9\approx33`.
- (b) Re-voice S9 with "thirty one point five".

**D5 — s19 S16–S17 (26:13–26:23): "about twelve degrees in a day" shows no conversion.** *Rows:* `2.4\times10^{-6}\times86\,400\ \text{s}\approx0.20\ \text{rad}` then `0.20\times57.3\approx11.7^\circ\approx12^\circ`.

**D6 — s06 S11 (7:42): ĵ at Brest appears as a result only.** The storyboard's calc row (the products) is not drawn. *Row:* `\hat{\mathbf j}=(-0.748\times0.997,\ -0.748\times(-0.078),\ 0.664)` then `\approx(-0.745,\ 0.059,\ 0.664)`.

**D7 — s26 S8 (35:44.9): the glider's 11.5 and 8.2 have no source on screen.**
- *Slate line:* "worked out step by step along the great circle (notebook)".
- *A first-guess row that the viewer can check:* `\frac{Du}{Dt}=1.57\times10^{-5}\ \text{m/s}^2` → `\times86\,400\ \text{s}\approx1.4\ \text{m/s}` → `u\approx10+1.4\approx11.4` (the full path gives 11.5).

**D8 — small steps.**
- s08 S2 (9:20): `6.5^\circ\times73.8\ \text{km}\approx480\ \text{km}` (Trappes 2.0° E vs Brest 4.5° W).
- s27 S5 (36:53): `\sin45^\circ=0.707`.
- s07 S5 "the other pairs work out the same way": show the j·k and k·i values as two slate rows, e.g. `\hat{\mathbf j}\cdot\hat{\mathbf k}\approx0,\ \hat{\mathbf k}\cdot\hat{\mathbf i}\approx0`.

### Verified (keep)
- s04, s07, s08 (Singapore), s12, s13, s14 and s27 already show every product on its words.
- The derivations s16–s25 are one move per sentence, with the rows on the words.

### Verdict: FIX (Part 4 audit: 0 Must, 8 Should)

## #5e ch00_coordinates_moving — calculation & sync audit (2026-11-05)

**Recomputed.**
- Train: 21.5, +0.5 m/s.
- Pattern: u = 10 + 5 sin(2πx/200 km) at x = 25 km gives 13.536 m/s; slope 0.1111 m/s per km.
- Rider: 3.536 m/s = 12.73 km/h, advection +1.414.
- Ground: −4.00 + 5.41 = +1.41.
- Ciarán: |U| = 14.578 m/s at 70.97°, (13.78, 4.75), 52.48 km/h.
- South: v′ = (13.47, 8.44) − (13.78, 4.75) = (−0.32, 3.68), |v′| = 3.69.
- North: (−18.00, −10.08), |v′| = 20.63.
- Side means 18.20 / 6.91 → 4.99 / 19.94.
- Ring means 14.06 / 13.81, inflow −6.02 / −5.93.
- 84 kt = 155.6 km/h.
- Plymouth: −3.82 + 3.21 = −0.61 hPa/h.
- Centre check −0.47 hPa/h.

**Physics.** NH anticlockwise spin adds to the motion on the right-hand (southern) side ✓. The sign of U·∇p ahead of the low ✓.

**Re-voice needed:** none required. E2 and E3 have optional narration.

### Must fix (1)

**E1 — s10 S7 (11:55): the shown subtraction is wrong.** The row reads (13.5, 8.4) − (13.8, 4.8) ≈ (−0.3, **3.7**), but 8.4 − 4.8 = 3.6. The 3.7 comes from the unrounded data (8.44 − 4.75). The lengths |v′| ≈ 3.7 and 20.6 also appear with no Pythagoras.
- *Rows (`mv_sB.tsx` S10), visual only:*
  - `\mathbf v'=(13.47,\ 8.44)-(13.78,\ 4.75)=(-0.31,\ 3.69)`
  - `|\mathbf v'|=\sqrt{0.31^2+3.69^2}\approx3.7`
  - North: `|\mathbf v'|=\sqrt{18.0^2+10.1^2}=\sqrt{324+102}\approx20.6`

### Should fix (5)

**E2 — s07 S2–S11 (7:23–8:48): the sliding-pattern numbers.**
- (a) Rounding: the screen says u = 13.5, then 13.5 − 10 = 3.5 → "≈ 12.7 km/h" and "48.7 km/h". But 3.5 × 3.6 = 12.6 and 13.5 × 3.6 = 48.6. The true values are 3.54 and 13.54.
- (b) The × 3.6 conversions are never shown.
- (c) Where 13.5 and 0.111 come from is not shown. That is a missed link to Part 2's slope of sine.
- *Rows:*
  - S0–S2: `u=10+5\sin\!\Big(\frac{2\pi x}{200\ \text{km}}\Big)`; at x = 25 km: `10+5\sin45^\circ=10+3.54=13.54`; slope: `5\times\frac{2\pi}{200}\times\cos45^\circ\approx0.111\ \frac{\text{m/s}}{\text{km}}`
  - S5: `13.54-10=3.54\ \text{m/s}`, `3.54\times3.6\approx12.7\ \text{km/h}`
  - S9: `10\times3.6=36\ \text{km/h}`
  - S11: `13.54\times3.6\approx48.7\ \text{km/h}`
  - Unit row: `\frac{\text{km}}{\text{h}}\times\frac{\text{m/s}}{\text{km}}=\frac{\text{m/s}}{\text{h}}`
- *Optional narration S2:* "…where the wind is thirteen point five four metres per second…"

**E3 — s08 S4 (9:53.7): 14.6 m/s and the 71° bearing have no inputs.** They come from the track, but the distance, the time and the angle are never shown. That is Part 4's coast recipe again.
- *Rows (builder: take the 06 UTC centre from the track and add a CHECK row):*
  - `\Delta y\approx103\ \text{km north},\ \ \Delta x\approx298\ \text{km east}`
  - `\sqrt{103^2+298^2}\approx315\ \text{km}`
  - `\frac{315\,000\ \text{m}}{6\times3600\ \text{s}}=\frac{315\,000}{21\,600}\approx14.6\ \text{m/s}`
  - `\tan\beta=\frac{298}{103}\approx2.9\ \Rightarrow\ \beta\approx71^\circ`
- *Optional narration S4:* "In those six hours, it moved about three hundred and fifteen kilometres: about a hundred north and three hundred east."

**E4 — s11 S1–S4 (12:40–13:09): "the motion adds about thirteen" has no origin.** The 13.2 and −13.0 are U·θ̂ averaged over each 85° side of the ring.
- *Rows:*
  - `\text{middle of the side: }\hat{\boldsymbol\theta}\parallel\mathbf U\ \Rightarrow\ \mathbf U\cdot\hat{\boldsymbol\theta}=14.6`
  - `\text{across the side, }\hat{\boldsymbol\theta}\text{ turns up to }\pm42^\circ:\ \text{average}\approx14.6\times0.91\approx13.2`
  - North: `\approx-13.0`
- *Visual:* θ̂ arrows at 5 points of the southern arc with U beside them, and their dot products as small numbers.

**E5 — s15 S4 (18:46.8): "rises along the storm's direction by 0.061 hPa/km" hides a dot product.**
- *Rows:*
  - `|\nabla p|\approx0.062\ \text{hPa/km},\ \text{pointing }63^\circ`
  - `\text{along }71^\circ:\ 0.062\times\cos8^\circ\approx0.061\ \text{hPa/km}`
- *Visual:* the ∇p and U arrows already drawn, with the 8° angle between them marked.

**E6 — s15 S5 (18:56): the m/s → km/h step is missing, and 14.6 × 3.6 gives 52.56, not the "52.5" shown.** *Row:* `14.58\ \text{m/s}\times3.6\approx52.5\ \text{km/h}`.

### Verified (keep)
- s03–s05: the derivations are one move per sentence.
- s13–s14: the τ derivation, with its unit row.
- s16: the centre check.

### Verdict: FIX (Part 5 audit: 1 Must, 5 Should)

## #5f ch00_coordinates_routes — calculation & sync audit (2026-11-05)

**Recomputed, all agree.**
- London r̂ = (0.622, −0.0014, 0.783); LA r̂ = (−0.392, −0.730, 0.560).
- cos σ = 0.1953 (3-dp rows give 0.1954); σ = 78.74° = 1.3742 rad; d = 8755 km; 8755/900 = 9.7 h.
- Initial bearing 311.8°, final 214.0°, vertex 62.37° N.
- Rhumb 258.49°, 9732.8 km; ratio 1.112; extra 978 km = 1.09 h.
- Brest–Lisbon great circle 1138.1 km; rhumb +0.149 km.
- 1° east at Brest = 73.8 km.

**Re-voice needed:** none.

### Should fix (4)

**F1 — s11 S4–S6 (12:16–12:42): 312°, 62.4° N and 214° appear as results with no method.** They can be worked out with tools the viewer already has (Part 4's east/north arrows and dot products). The route leaves London in the plane of r̂₁ and r̂₂, so its ground direction is r̂₂'s part along London's east and north. Put the rows in the maths-skip block, or as a short optional block before s11's keep line.
- *Rows:*
  - `\hat{\mathbf i}_1=(0.002,\ 1.000,\ 0),\ \ \hat{\mathbf j}_1=(-0.783,\ 0.002,\ 0.622)`
  - `\text{east: }\hat{\mathbf r}_2\cdot\hat{\mathbf i}_1\approx-0.731,\qquad \text{north: }\hat{\mathbf r}_2\cdot\hat{\mathbf j}_1\approx0.307-0.001+0.348=0.654`
  - `\tan\beta=\frac{0.731}{0.654}\approx1.12\ \Rightarrow\ \beta\approx48^\circ\ \text{west of north}\ \Rightarrow\ 360^\circ-48^\circ=312^\circ`
  - At LA, the same with LA's arrows gives the bearing back to London, ≈ 34°. Add 180° and the arrival heading is 214°.
  - Highest latitude (optional, a new rule, so give it its own sentence): `\cos\varphi_{\max}=\sin48.2^\circ\times\cos51.5^\circ\approx0.464\ \Rightarrow\ \varphi_{\max}\approx62.4^\circ`.
- If the user prefers not to add a block: a slate line "worked out from the two position arrows (notebook)".

**F2 — s12 S2–S3 (13:07–13:16): the rhumb's 258.5° and 9733 km have no inputs.** Neither Part 6 nor Part 7 works them out (see G4). *Fix:* a slate line "worked out on Mercator's map in Part 7", plus the G4 rows in Part 7.

**F3 — s13 S7 (14:39): the 1138 km and the "+150 m" appear with no working.** The 1138 km can be checked with the flat-map recipe from Parts 3–4, which is good on a short trip:
- `\Delta y=9.67^\circ\times111.2\approx1075\ \text{km}`
- `\Delta x=4.65^\circ\times111.2\times\cos43.6^\circ\approx375\ \text{km}`
- `\sqrt{1075^2+375^2}\approx1138\ \text{km}`

Add the slate "+150 m: from the notebook's rhumb formula". Lisbon = 38.72° N, 9.14° W. Do **not** use the 3-dp dot-product recipe here: arccos near 1 is ill-conditioned (0.9840 gives 1141 km).

**F4 — s03 S6 (2:14): two screen numbers are never spoken.** "1° east ≈ 111 km (equator)" and "≈ 23 km (78° N)" are on screen, and the 23 has no working. *Row:* `111.2\times\cos78^\circ\approx23\ \text{km}`. Or say it: "…about a hundred and eleven kilometres at the equator, but only twenty three near Svalbard."

### Verified (keep)
- s04, s08, s09 and s10 show every product and conversion on its words.
- The σ chain (r̂ → dot → arccos → radians → a σ → quick check) is complete.

### Verdict: FIX (Part 6 audit: 0 Must, 4 Should)

## #5g ch00_coordinates_maps — calculation & sync audit (2026-11-05)

**Recomputed.**
- Plate carrée: x = −500.4 km; y = 5381.8 km (48.4° = 0.84474 rad).
- 2πa = 40 030 km; 2π × 4230 = 26 578 km; k = 1.506; 1/0.2045 = 4.89.
- 1 °C / 73.8 km = 1.36 °C per 100 km.
- Mercator: 111.2 × 1.506 = 167.47 km per degree.
- 10° steps (1/cos at the mid-latitude, step, running total):
  - 1.004, 0.1752, 0.1752
  - 1.035, 0.1807, 0.3559
  - 1.103, 0.1926, 0.5485
  - 1.221, 0.2131, 0.7615
  - 1.414, 0.2468, 1.0084
  - 1.743, 0.3043, 1.3126
  - 2.366, 0.4130, 1.7256
  - 3.864, 0.6743, 2.4000
- ln tan 75° = 1.3170; ln tan 69.2° = 0.96794 → 6166.8 km.
- y(61°) − y(59°) = 0.06984; ÷ 0.034907 = 2.0007.
- y(85°) = 3.1313 a = 19 950 km.
- tan 78.5° = 4.92; 4.9² = 24.0; 30.4/2.17 = 14.0.
- √(500² + 1000²) = 1118.0; u_r = −4.47, u_θ = 8.94; 79 × 3.6 = 284.4 km/h.
- Vortex centre 17.1° from the pole = 1901 km.

**Re-voice needed:** G3 (optional). Everything else is visual only.

### Must fix (1)

**G1 — s09 S10–S11 (12:03–12:17): "Let's speed up" skips five of the eight steps.** The table shows only totals for 50°, 60°, 70° and 80°. The user's rule is: no calculation skipped. *Fix (`mp_sB.tsx` S09, visual only):* fill the table rows on S10–S11, one row about every 1.5 s. Keep the voice.

| step | middle | 1/cos | drawn | total |
|---|---|---|---|---|
| 30–40° | 35° | 1.221 | 0.213 | 0.762 |
| 40–50° | 45° | 1.414 | 0.247 | 1.008 |
| 50–60° | 55° | 1.743 | 0.304 | 1.313 |
| 60–70° | 65° | 2.366 | 0.413 | 1.726 |
| 70–80° | 75° | 3.864 | 0.674 | 2.400 |

The spoken 1.01 / 1.31 / 1.73 / 2.4 then land on the gold totals. The table needs 5 more rows: shrink the row pitch to 50 px, or scroll the earlier rows up to 60 % opacity.

### Should fix (6)

**G2 — s04 S15–S18 (3:27–4:05): the radian value is off, and the result disagrees with Part 3.** 48.4° = 0.8447 rad, not 0.8446. y = 5381.8 ≈ **5382** km, which Part 3 s23 says ("about five thousand three hundred and eighty two"). Here the screen and voice say 5381 and call it "exactly how far Brest is from the equator". The × 0.01745 conversion is not shown either.
- *Rows:*
  - `48.4\times0.01745\approx0.8447\ \text{rad}`
  - `-4.5\times0.01745\approx-0.0785\ \text{rad}`
  - `y=6371\times0.8447\approx5382\ \text{km}`
- *Optional re-voice of S15/S17:* "zero point eight four four seven" and "five thousand three hundred and eighty two".

**G3 — s10 S14–S15 (14:11–14:18): the row uses ln = 0.9677, but ln tan 69.2° = 0.9679 (0.96794).** So 0.968 × 6371 = 6167, while the screen and voice say 6165. *Rows:* `\ln2.6325\approx0.9679` then `0.9679\times6371\approx6167\ \text{km}`. Optional re-voice: "about six thousand one hundred and sixty seven".

**G4 — s12 S7 (16:51): the 258.5° bearing and "4.9 west per south" are used without origin.** Neither Part 6 nor Part 7 works them out. With y = a ln tan(π/4 + φ/2) just built, they come in four lines. This also closes F2 (9733 km).
- *Rows:*
  - `y_{\text{London}}/a=\ln\tan70.76^\circ\approx1.052,\quad y_{\text{LA}}/a=\ln\tan62.03^\circ\approx0.633`
  - `\Delta y/a\approx-0.420,\quad \Delta x/a=\Delta\lambda\approx-118.1^\circ=-2.061\ \text{rad}`
  - `\tan(\text{angle from south})=\frac{2.061}{0.420}\approx4.9\ \Rightarrow\ 78.5^\circ\ \Rightarrow\ \text{bearing }180^\circ+78.5^\circ=258.5^\circ`
  - Length: `\frac{a\,|\Delta\varphi|}{\cos78.5^\circ}=\frac{6371\times0.3047}{0.1995}\approx9733\ \text{km}`
- *Optional narration (one sentence):* "And that's where Part 6's two numbers come from: a slant of four point nine gives a bearing of two hundred and fifty eight and a half degrees, and a length of nine thousand seven hundred and thirty three kilometres."

**G5 — s21 S2–S6 (29:39–30:31): the vortex numbers have no working.**
- "1900 km from the pole": `(90^\circ-72.9^\circ)\times111.2\ \text{km}\approx1900\ \text{km}`.
- The ratios: `\frac{33}{17.5}\approx1.9` and `\frac{20}{47}\approx0.4`.
- "typically" stands for an rms that is never named. Either keep "typically" and add the slate "root-mean-square", or say "the typical size of the in and out part".

**G6 — s14 S10 (20:12): "angles can be off by about thirty one degrees" is a result with no input.** *Fix:* the slate "worked out from the Equal Earth formulas (notebook)". Also mark the point (60° N, 30° E) on both maps with a small distorted-cross glyph.

**G7 — small items.**
- s11 S13: `3.131\times6371\approx19\,950` (3.13 × 6371 = 19 941).
- s18 S2: `10\div1013\approx0.01`.
- s08 S10: the voice says "one point five zero six" while the row multiplies 111.19 × 1.5059. Both give 167.4, so this is fine.

### Verified (keep)
- s04–s05: the parallel stretch chain.
- s08: the Mercator step.
- s10: tan/ln with both table cross-checks.
- s11: the centred-difference slope check (2.00 vs 2).
- s13: the area stretch.
- s20: the origin wheel, with every product on its words.
- Physics: east = θ̂ and north = −r̂ seen from above the NP; westerlies go anticlockwise.

### Verdict: FIX (Part 7 audit: 1 Must, 6 Should)

## #5a ch00_coordinates_flat — fix 1, review 2 (2026-11-05)

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_coordinates_flat (Part 1, fix 1c) | 43:40.7 (2620.70 s; narration 2618.18 s) | 151.4 MB | 15/15 PASS | PASS | PASS | FIX (1 overlap, 1 edge, small fractions) | FIX (keep-line picture, unspoken rows, row order) | PASS (619 cues, = script) | PASS | n/a (retired) | **FIX** |

**Method.**
- One frame 0.25 s before the end of each of the 381 sentences, tiled per scene at 640 px (55 sheets).
- 1-s frames through the whole tenth-of-a-degree block (13:03–14:12, 70 frames).
- Dense crops at s08 (6:54–7:05) and s22 (31:20–31:43, 32:12–32:27).
- 25 full-resolution frames wherever a tile was unclear.
- Everything is in `reports/movies/ch00_coordinates_flat/review2/` (ignored, 48 MB), with `timed_script.txt`.
- Numbers recomputed in Python. Chapter marks and skip blocks checked against `timing.json`; VTT checked against the source.
- Audio proxy: the soundtrack decoded to 16 kHz. I measured speech level per sentence, and in 2-s windows inside 7 re-voiced compound sentences (s04 S3, s05 S7, s11 S16–S24, s18 S14, s22 S6, s23 S5, s24 S16).

**Review-1 items, checked on frames: all fixed.**
- M1: the s19 flipped table now has rows e′₁, e′₂ and columns e₁, e₂.
- M2: the s22/s24 map labels are bold, haloed and placed off the arrows.
- M3: colour bars are on s00, s03, s25 and s27.
- M4: the s17 tip label is on two lines inside the picture.
- M5: the conversion line reads 1 m/s = 3600 m/h = 3.6 km/h.
- M6: qa 15/15.
- Shoulds 1–14 are applied. One leftover: the wind arrow is still teal (Should 3 below).

**C1–C43: all present in the render.**
- Every listed row, gold link and picture element is on screen and appears on its words: C1, C2/C3 (leg labels, tan⁻¹), C4, C5/C6 (0.2 rad ≈ 11.5°, ratio), C7 (the shrink "5 → 1" animation at 6:56–6:57), C8, C9 ("clockwise: θ shrinks"), C10/C11, C12, C13–C15, C17 (θ = 0°/90°/180° rows), C18 (locator), C19–C24, C25–C29 (C₁₁…C₂₂ term by term, Σ form, ✓ checks), C30/C31 (wind with its 6/−8 shadows; turned pair muted against the polar pairs), C32 (running "sum so far" plus the ÷72 rows), C33, C34–C37 (gold lap "157 km"), C38–C40, C41/C42 (graph labels, rose band "14 out", "72 − 14 = 58 points in"), C43 (legs "34.8 round" and "13.3 in").
- What remains is layout and timing, listed below.

**User note U1, the tenth-of-a-degree check (13:03.95–14:10.0).** Every requested element is on screen, on its words:
- the wide view with the station, the 5-km circle, the dashed east ray, "r = 5 km", "θ ≈ 53.13°" and "(3 km, 4 km)";
- the gold zoom box and the "magnified" inset with before, after 0.1° and r̂;
- Δθ = 0.1 × π/180 ≈ 0.001745 rad (13:17–13:26);
- r = 5 km = 5000 m, then s = rΔθ = 5000 m × 0.001745 ≈ 8.7 m, with the gold 8.7-m slide (13:27–13:37);
- (x, y) = (r cos θ, r sin θ); before (3000, 4000) m; after = 53.13° + 0.1° = 53.23°; x = 5000 × 0.598603 ≈ 2993.0 m and y = 5000 × 0.801046 ≈ 4005.2 m (13:38–13:56);
- Δx = −7.0 m (west) and Δy = +5.2 m (north), with the dashed legs "7.0 m" and "5.2 m" (13:56–14:01);
- √(7.0² + 5.2²) = √(49 + 27.04) = √76.04 ≈ 8.7 m = s;
- −7.0/8.7 ≈ −0.80 and 5.2/8.7 ≈ 0.60, then θ̂ ≈ (−0.80, 0.60) with a gold tick (14:02–14:10).

Recomputed: Δθ = 0.00174533; s = 8.7266 m; after (2993.014, 4005.230); slide (−6.986, +5.230), length 8.7266; √76.04 = 8.720; −7.0/8.7 = −0.805; 5.2/8.7 = 0.598. All screen values round correctly.

As a first-time learner, I can follow it. One move per row, each on its spoken phrase, and the picture matches the voice. Four things still trip a learner (Must 2, Should 9, Should 10):
1. The √ length check is shown but never said.
2. The row "before, 53.13° = (3000, 4000) m" sets an angle equal to a position, and it hangs left of the column into the inset (x ≈ 1005).
3. The voice says "s equals r times theta" while the screen says s = rΔθ.
4. The final tick sits in empty space at (1780, 790), far from θ̂ ≈ (−0.80, 0.60), and never links back to the θ̂ formula above.

**Numbers re-checked (all PASS).**
- 360/6.283 = 57.30; 0.2 × 57.3 = 11.46.
- 1923.08 s ÷ 60 = 32.05 min; 2π × 25 = 157.08 km; 157 000/35 = 4486 s (screen "≈ 4490") = 74.8 min.
- √1394 = 37.34; 35/13 = 2.69.
- 135 × 1.852 = 250.0 km/h; ÷ 3.6 = 69.4 m/s.
- 2505.9/72 = 34.80; −957.2/72 = −13.29.
- 10.1 × 0.707 = 7.14 and 44.5 × 0.707 = 31.46, giving −24.32 and 38.60.
- tan⁻¹(13.3/34.8) = 20.92°.
- 3 × 0.866 + 2 = 4.598; −1.5 + 3.464 = 1.964; 4.6² + 1.96² = 25.0016.

**Physics.**
- NH anticlockwise "seen from above, NH", and the gold arc runs the right way.
- u_r is negative and inward (rose); u_θ is positive and round (teal).
- At 0°/90°/135° the u_θ arrows point N/W/SW, which is anticlockwise.
- In s20 the polar pairs at 0° and 150° are r̂ outward and θ̂ +90°. The turned pair is the same at all three points.
- The s23 spiral leans in while it goes round.

**Data frames and references.**
- Every Ian frame has the HRRR source line and a colour bar.
- No equation numbers, book names or badges on screen. The skip chips are house components.

**Skip chips and chapters.**

| Block | Chip | VTT keep line |
|---|---|---|
| s09 | "every step · optional / skip to 14:11" | 14:11.52 |
| s13 | "skip to 18:39" | 18:39.03 |
| s15 | "skip to 29:42" | 29:42.53 |
| s24 | "skip to 38:43" | 38:43.60 |

- Every block has a spoken lead-in naming weather, climate and maps, and a keep line.
- All 18 manifest chapter marks equal the `timing.json` scene starts (Δ = 0, title −0.3 s).
- `out/en.vtt` is byte-identical to the source.

**Audio proxy.** I found no level step at any splice:
- inside the re-voiced compound sentences, speech windows stay within −15…−20 dB, so no sub-clip stands out;
- per-sentence outliers are all short sentences ("Yes.", "Let's check."), where the window is mostly pause: a measurement artefact;
- the gate reads −16.3 LUFS and a peak of −4.1 dBTP.

I did not listen to it. The fix-1c log says the limiter took up to 8.3 dB off single peaks, so give s11 S16–S24 and s23 S5 one listen.

### Must fix (5)
1. **14:11.5–14:22.6, s11 S25 keep line: the picture is the U1 check, not the keep line.**
   - The skip chip sends skippers to 14:11. They land on the magnified inset ("5.2 m", "7.0 m before"), "5.2/8.7 ≈ 0.60" and "without the θ̂ formula". They skipped all of that.
   - Meanwhile the voice says "r hat points away from the centre, theta hat points round it…".
   - **Fix** (`cf_sB.tsx` S11, last sentence): clear the U1 inset and rows at S25 start. Show the balloon on its circle with r̂ (out) and θ̂ (round, anticlockwise), the +90° arc, and the two formulas r̂ = (cos θ, sin θ), θ̂ = (−sin θ, cos θ). The s14 and s24 keep lines already do this.
2. **13:27–14:10, s11 U1: one unspoken row and two layout faults.**
   - (a) The rows √(7.0² + 5.2²) = √(49 + 27.04) and = √76.04 ≈ 8.7 m = s (14:02–14:05) are never spoken; the voice is already on "Dividing each by eight point seven". Re-voice: after S23 add "Check: seven squared is forty nine, and five point two squared is twenty seven point zero four. The square root of seventy six point zero four is about eight point seven: the same slide." Reveal each row on its words.
   - (b) S20 says "s equals r times theta". Re-voice to "s equals r times the change in theta", to match s = rΔθ.
   - (c) The row "before, 53.13° = (3000, 4000) m" (13:46–13:52) equates an angle with a position, and it starts at x ≈ 1005, against the inset frame. Write it as two "="-aligned rows: "before: θ ≈ 53.13°" and "(x, y) = (3000, 4000) m". Keep them inside the column (x ≥ 1080).
   - (d) The gold tick (14:08) sits alone at (1780, 790). Put it right of "θ̂ ≈ (−0.80, 0.60)" and add a gold link up to θ̂ = (−sin θ, cos θ).
3. **1:50–2:00, s03 S3–S4: a calculation row overlaps the map panel.** "(3, 0) + (0, 4) = (3, 4)" starts at x ≈ 922, over the panel's right border (x 990). The "=" alignment pushes the long left side left. **Fix** (`cf_sA.tsx` S03): left-align this stack at x ≥ 1080, or write the row as "= (3, 0) + (0, 4) = (3, 4)" under the two rows above.
4. **31:28–31:43 and 32:12–32:27, s22 S6/S10: running sums run off the frame, and the ū_r rows flash.**
   - The gold "sum so far: 2074.8 m/s (61 of 72)" and "…−906.1 m/s (67 of 72)" end at x ≈ 1915, past the 1842 limit and at the frame edge.
   - The ū_r = −957.2 m/s / 72 ≈ −13.3 ≈ −13 m/s rows are visible only 32:19–32:22. They are squeezed under "seen from above, NH" (the numerator touches it). They leave 3 s before "about minus thirteen" ends, so only "−13 m/s: in" remains with no origin. The ū_θ rows, by contrast, stay.
   - **Fix** (`cf_sC.tsx` S22): put the sum on two lines ("sum so far: 2074.8 m/s" / "61 of 72 points") inside x ≤ 1842. Give the ū_r rows their own slot, 24 px clear of the keyword, and keep them to the end of the scene like ū_θ.
5. **32:44–33:11, s22 S13–S15: the knots chain reads bottom-up and is split by an unrelated label.** "250 km/h ÷ 3.6 ≈ 69 m/s" (and later "strongest on our ring ≈ 49 m/s") sits above "−13 m/s: in / towards the eye". Its input, "official estimate: 135 kt / 135 kt × 1.85 ≈ 250 km/h", sits below it. A learner meets the result before its input. **Fix:** stack top-down in spoken order: 135 kt → × 1.85 ≈ 250 km/h → ÷ 3.6 ≈ 69 m/s → ring max ≈ 49 m/s. Move or shrink the −13 label group out of that column.

### Should fix (13)
1. **Text-style fractions are below 44 px.** These \frac/\tfrac read at about 28–32 px (about 10 px at 640 width):
   - 4:01–4:22: 3/5, 4/5
   - 5:47–5:57: 360°/2π, 360°/6.283
   - 6:21–6:30: 10 km/1 km = 50 km/5 km
   - 7:00–7:26: (3/5, 4/5)
   - 21:01–21:24: "exactly ¾"
   - 34:17–35:42: 1923/60 and 4490/60
   - 37:37–38:35: 1/√2

   **Fix:** use \dfrac, or write "÷ 60" / "= 0.6" inline.
2. **13:04–14:22 and 15:23–17:09: the θ̂ glyph is broken in sans keywords.** "without the θ̂ formula" and "r̂, θ̂: length 1" render the combining hat offset ("θ`"). **Fix:** set the symbol in KaTeX (\hat{\boldsymbol\theta}) inside the keyword.
3. **The colour contract leaks: wind and radius are teal.** The east wind **u** is drawn as a teal dashed arrow (15:23–17:09, 17:10–18:50, 28:25–28:50; the 0°/90°/135° winds 36:16–38:35). The radius "r = 5 km" is teal in s04 and the U1 wide view. Teal means u_θ. **Fix:** draw the full wind and the radius in ink/white (dashed). Keep teal for u_θ only.
4. **Paged stacks lose their left-hand side.**
   - 26:50–27:16 (s19 S15–S18): "= x₁ cos α + x₂ sin α" and the next rows show with no "x′₁ =" or "x′₂ =" above them.
   - 38:13–38:35 (s24 S22–S23): the first row "u_θ = −(−10.1)(0.707)" holds only half the sum, so the stack reads u_θ = 10.1 × 0.707.

   **Fix:** pin the left-hand-side row while paging. Write the full first row: u_θ = −(−10.1)(0.707) + (−44.5)(−0.707).
5. **24:02–24:22, s18 S9: the number matrix is cramped.** It sits 15 px under the symbolic matrix with no "α = 30°:" label. **Fix:** add 30 px of space and the label "α = 30°:" before the number matrix.
6. **39:46–40:31, s25 graph: labels sit on curves.**
   - "mean 35" sits on the θ = 0 dot and the teal curve.
   - "47" sits on the dashed v line, and "−40" on the u curve.
   - "14 out" and "mean −13" run together.
   - The colour bar crowds the graph's "m/s" title.

   **Fix:** move the labels into clear space with leader ticks, and fade the u/v curves to 30 % from S8.
7. **41:07–41:50, s26 S6–S11:** an orphan "tan(inflow angle)" row stays alone at the top while the four-angles panel runs. Fade it with its rows.
8. **Safe area.** "(−4, 3)" starts at x 28 (11:04–11:32, s10). The 150° arrow pair reaches x ≈ 38 (29:31–29:55, s20). Keep both ≥ 96 px from the edge.
9. **13:52–13:56, U1: last-digit mismatch.** cos 53.23° = 0.598604 and sin 53.23° = 0.801045 on a calculator. The screen's 0.598603 and 0.801046 are for 53.2301°. **Fix:** show "53.2301°" in the after row, or use the 53.23° values. 2993.0 and 4005.2 are unchanged either way.
10. **13:20–14:22, U1 inset.**
    - "7.0 m" abuts "before" and reads "7.0 m before".
    - "≈ 8.7 m" touches the slide's arrowhead.
    - **Fix:** move "7.0 m" under the leg's middle and "≈ 8.7 m" 20 px off the arrow.
    - Optional: drop the inset's filled frame to an outline (house style "no boxes"; review-1 Should 8 removed the s09 inset box).
11. **21:01–21:24, s16:** the x′ ruler line runs through "cos α (north)". Move the label left of its leg, or above the ruler.
12. **35:22–35:42, s23 S15:** a white upward arrow on a plan view reads as a northward wind. Use a ⊙ "rising (out of the screen)" mark instead.
13. **Dim recap.** 41:50–42:54, s27: the beat text and pictures run at about 60 % contrast and look washed out at 640 px. Brighten the current beat to full ink.

### Verified (keep)
- The U1 picture-to-number chain.
- Every C-item row is on its words.
- The s12 balloon waits at each stop.
- Skip chips: "every step · optional" with the exact times.
- Data frames: source line plus colour bar.
- NH sense correct everywhere.
- Captions are 619 cues equal to the script.
- QA 15/15.

### Limits
- Audio not heard; loudness judged by a level proxy only.
- Motion sampled at sentence ends, plus 1-s sampling in U1 and dense crops at s08 and s22. Swaps between samples elsewhere were not checked frame by frame.
- No colour-blind simulation (teal/rose plus dash pattern were already accepted in review 1).

**Disk.** C: 116 GB free, G: 481 GB free (unchanged). Review frames: 48 MB in the ignored `review2/`.

### Overall: FIX (#5a fix 1, review 2: 5 Must, 13 Should)
- The physics and every number are right, and U1 and C1–C43 are delivered.
- Must 1, 3, 4 and 5 are TSX-only.
- Must 2 needs two re-voiced sentences (s11 S20, plus one new sentence after S23); the splice method is in `cf_fix1c_splice.py`.
- Re-render s03, s11 (from 13:03), s22, and anything after the new sentence shifts by about 9 s (skip chips 18:39 → about 18:48 and the later ones; chapter marks from s12).

## #5a fix 2 review 3 (2026-11-05)

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_coordinates_flat (Part 1, fix 2, `build1_1080.mp4`) | 43:55.2 (2635.20 s; narration 2632.70 s) | 151.7 MB | 14/15 (`halves` FAIL) | PASS | PASS | FIX (x′/y′ in sans, s23 label collision) | FIX (spoken numbers off screen, keep line, unspoken rows) | PASS (623 cues = script, max 16.8 cps, ≤ 42 chars, ≤ 2 lines) | PASS | n/a (retired) | **FIX** |

**Method.**
- One frame 0.25 s before the end of each of the 381 sentences, tiled per scene at 640 px.
- 1.5-s frames through the whole U1 block (13:05–14:38, 49 frames).
- Dense frames at s05 S7, s18 S14 (3 s, then 0.5 s over the scene change) and s22 S6/S10/S15.
- Full-resolution crops at 13:08, 15:23, 20:32, 24:36, 25:14, 25:31.9, 26:28, 27:13, 33:21, 35:10, 35:46 and 40:31, plus the end-card icons.
- Captions, chapters and skip chips checked by script against `en.vtt`, `timing.json` and `manifest.json`.
- Speech-level proxy (16 kHz, 2-s windows) over the re-voiced sentences.
- Everything is in `reports/movies/ch00_coordinates_flat/review3/` (ignored), with `timed_script.txt`.

### qa.json
- 14/15 PASS.
- The one FAIL is `halves`: the right half is empty 2481.5–2500.5 s (19.0 s; FAIL > 10 s; 1 span > 3 s in all).
- Other gates:
  - overlap: 3680 frames, 0 hits;
  - captions: 623 cues = script;
  - physics: 19 functions reproduce their hashes;
  - equations: 23/23;
  - loudness: −16.3 LUFS, peak −1.6 dBTP;
  - flashes: 0.

### Review-2 items, checked on the frames
| item | status | evidence |
|---|---|---|
| Must 1 (s11 keep line) | **fixed** | 14:26–14:37. The U1 inset and rows are gone. On screen: the balloon on its circle, r̂ out, θ̂ round, the gold +90° arc and an anticlockwise arc; "θ̂ = r̂ turned by +90°" and "anticlockwise, seen from above". |
| Must 2a (√ check spoken) | **fixed** | "length = √(7.0² + 5.2²)" at 14:02.5 ("seven squared"); "= √(49 + 27.04)" at 14:07 ("twenty seven point zero four"); "= √76.04" at 14:09.5; "≈ 8.7 m = s" at 14:12.5. Each row appears on its words. |
| Must 2b ("change in theta") | **fixed** (text) | S20, 13:27.4–13:37.9, reads "s equals r times the change in theta" in timing and VTT. Speech-level proxy: −15…−22 dB per window, no step at the splices. Not listened to. |
| Must 2c (before rows) | **fixed** | 13:47–13:51. "before: θ ≈ 53.13°" and "(x, y) = (3000, 4000) m" are two rows starting at x ≈ 1116. |
| Must 2d (tick + link) | **fixed** | 14:24–14:26. The tick sits right of "θ̂ ≈ (−0.80, 0.60)", with a gold link up to θ̂ = (−sin θ, cos θ). |
| Must 3 (s03 row) | **fixed** | 1:49.8. "3x̂ + 4ŷ = (3, 0) + (0, 4) = (3, 4)" starts at x ≈ 1075–1080, clear of the panel. |
| Must 4 (s22 sums / ū_r) | **fixed** | 31:45–31:50 and 32:29–32:33: two-line sums inside the column. 32:34–32:58: the ū_r division has its own slot, and its result row stays to the end of the scene. One new nit: Should 7. |
| Must 5 (knots chain) | **fixed** | 33:09–33:25. Top-down: 135 kt → × 1.85 ≈ 250 km/h → ÷ 3.6 ≈ 69 m/s → ring max ≈ 49 m/s. Right edge measured at x 1840. |
| Should 1 (\dfrac) | fixed | 4:13 (3/5), 5:57 (360°/2π), 6:24 (10 km/1 km), 7:11 ((3/5, 4/5)), 21:15 (¾), 34:52 ("÷ 60" inline), 38:06 (1/√2). |
| Should 2 (θ̂ glyph) | fixed | 13:08 crop: "without the θ̂ formula" is KaTeX, with the hat over the θ. Same for "r̂, θ̂ : length 1" at 15:43. |
| Should 3 (ink wind and radius) | fixed | 15:43: **u** is white and dashed. 13:14: "r = 5 km" is white. Teal is still used for position arrows (Should 9). |
| Should 4 (paged left-hand sides) | fixed | 27:04: "x′₁ = …" stays pinned. 38:42: the full two-line u_θ sum. |
| Should 5 (s18 α = 30°) | fixed | 24:36. |
| Should 6 (s25 labels) | mostly | 40:00–40:46. "mean −13" now sits on the plot's bottom frame (Should 11). |
| Should 7 (s26 orphan) | fixed | No orphan at 41:21. |
| Should 8 (safe area) | fixed | 11:03: "(−4, 3)" at x ≥ 135. 29:56: the 150° pair at x ≈ 111. |
| Should 9 (53.2301°) | fixed | 13:52. |
| Should 10 (inset) | fixed | 14:10. Outline only; "7.0 m" under its leg, "before" below it, "≈ 8.7 m" off the arrowhead. |
| Should 11 (s16 ruler) | fixed | 20:54. |
| Should 12 (⊙ rising) | fixed, but a new collision | 35:37. Its label now runs into the equation (Must 3). |
| Should 13 (recap contrast) | fixed | 42:05–43:29, full ink. |

### The user's notes
- **11:23–11:37 in build 1 (now the U1 check, 13:04–14:26): fixed.**
  - Every number is on screen while it is spoken:
    - Δθ = 0.1 × π/180 ≈ 0.001745 rad;
    - r = 5 km = 5000 m, then s = rΔθ = 5000 m × 0.001745 ≈ 8.7 m;
    - (x, y) = (r cos θ, r sin θ); before (3000, 4000) m;
    - after 53.1301° + 0.1° = 53.2301°, so x ≈ 2993.0 m and y ≈ 4005.2 m;
    - Δx = 2993.0 − 3000 = −7.0 m (west) and Δy = +5.2 m (north);
    - the √ check, then −7.0/8.7 and 5.2/8.7.
  - The picture follows the voice: the wide view, the zoom box, the "magnified" inset with before and after 0.1°, the gold 8.7-m slide, and the 7.0-m and 5.2-m legs.
  - One leftover: Should 1.
- **11:00–12:30 in this build (s10 S14 to s11 S12).**
  - The (−4, 3) length and dot-product checks are shown term by term, on their words.
  - θ̂ is built by the swap rule and by the turned triangle.
  - The θ = 0° and θ = 90° checks are shown.
  - One A1 gap at 12:46 (Should 2).
- **13:06 hat: fixed.** The hat sits over the θ (13:08 crop).
- **15:23 hat: fixed.** θ̂ and r̂ in the s13 picture, and the "r̂, θ̂ : length 1" keyword, are KaTeX.
- **43:15 rings icon (end card, now 43:30–43:55): fixed.** The rings and both arrows sit inside the box with at least 40 px of margin (crop at 43:50).

### Sweep A–E
Frames at every sentence end (about 7 s apart on average), plus every calculation block.

- **A (calculations).** I checked every calculation block against its sentence: s04, s05, s07, s08, s10, s11, s13, s14, s15–s20, s22–s24 and s26. The inputs and the arithmetic are on screen for nearly every spoken number. The gaps:
  - Must 5: "our thirty five" in s22 S15;
  - Should 2: θ̂ at the balloon;
  - Should 5: α = 30°;
  - Should 4: the A2 sign lines.
- **B (pictures follow the voice).**
  - The halves FAIL (Must 1).
  - The s20 keep line shows leftovers (Must 4); the s14 keep line partly does (Should 3).
  - Unspoken rows flash at the end of s18 (Should 6).
- **C (symbols).**
  - Hats render correctly everywhere I looked: 13:08, 15:23, 20:32, 26:28, 42:45.
  - Exceptions: x′/y′ in the sans font (Must 2), and an ASCII hyphen used as a minus in the running sums (Should 7).
  - `tools/movie_symbol_lint.py --strict` reported 0 hits, yet `cf_sB.tsx` has sans x′ labels. The lint does not catch U+2032 (prime) in plain `Lbl`/`Keyword` text. Adding it is a tool change for the orchestrator.
- **D (colours and data).**
  - Every HRRR frame has its source line below the image and a colour bar.
  - Teal still marks position arrows and shadows (Should 9).
  - The recap is at full contrast.
- **E (skip guidance).** All four chips match the keep lines in the captions file (`en.vtt`):

  | block | chip | keep line in `en.vtt` |
  |---|---|---|
  | s09 | "every step · optional / skip to 14:26" | 14:26.05 |
  | s13 | skip to 18:53 | 18:53.55 |
  | s15 | skip to 29:57 | 29:57.05 |
  | s24 | skip to 38:58 | 38:58.12 |

  Every block has its spoken lead-in. All 29 chapter marks equal the scene starts; the title mark at 0.0 s against the 0.3-s scene start is intentional.

### Physics honesty (all PASS)
- The NH storm turns anticlockwise "seen from above" (32:19), and the gold arc runs the right way.
- At 0°, 90° and 135°, the u_θ arrows point N, W and SW: anticlockwise.
- u_r is negative and inward (rose); u_θ is positive and goes round (teal).
- The s23 spiral, r = R e^(−tan 21° φ), leans inward while it goes round. Rising air on the plan view is drawn as a ⊙.
- The inflow angle, tan⁻¹(13.3/34.8) = 20.9°, is drawn at about 21°.
- The bearing is 90° − 53° = 37°, and "a west wind blows towards the east".
- Numbers recomputed (all match the screen):
  - 0.1π/180 = 0.0017453, and 5000 m × that = 8.727 m.
  - √76.04 = 8.72.
  - 2505.9/72 = 34.80 and −957.2/72 = −13.29.
  - 135 × 1.852 = 250.0 km/h = 69.4 m/s.
  - 25 000/13 = 1923 s = 32.05 min; 157 080/35 = 4488 s = 74.8 min.
  - √1394 = 37.34 and 35/13 = 2.69.
  - 3 × 0.866 + 2 = 4.598; −1.5 + 3.464 = 1.964.
  - 10.1 × 0.707 = 7.14 and 44.5 × 0.707 = 31.46.

### Legibility at 640 px
- The calculation rows are 44–56 px KaTeX and read well at 640 px (crops at 24:36, 26:28, 27:13).
- Small text:
  - 15:43–17:24: "r̂, θ̂ : length 1 / wind: its own scale" is about 36 px and grey (Should 12).
  - 13:04–13:50: the KaTeX keyword "without the θ̂ formula" is about 40 px. Acceptable.
  - The s25 graph labels are about 40 px and readable.

### MUST fix (6)
1. **41:21.5–41:40.5, s26 S6–S8: the right half is empty for 19 s (qa `halves` FAIL; known item a).**
   - The tan and tan⁻¹ rows fade at `tFour − 18`.
   - The four-angle row then builds from the left: θ at x 250 (41:27), the bearing at 700 (41:33). Nothing reaches x > 960 until α at 1150 (41:40) and the inflow angle at 1600 (41:44).
   - **Fix** (`cf_sC.tsx` S26, lines 504–556): from `tFour`, draw all four slots ghosted at 0.25 opacity, at MX = 250, 700, 1150 and 1600 (baseline, icon and both caption lines). Raise each slot to full strength with `mini(n)` on its own sentence.
   - Optionally add `<Keyword text="four angles" at={[1080,160]} appear={tFour} out={tQ − 18}/>`.
   - Alternative: keep lines 564–565 (`inflow angle = tan⁻¹(0.38)` and `≈ 20.9° ≈ 21°`) until `tAl − 18`.
   - Re-run the halves gate.
2. **19:45–23:32 and 28:03–30:10: x′, y′ and "(x′, y′)" are set in the plain sans font (known item b).**
   - Where, in `cf_sB.tsx`:
     - the s15 and s16 ruler labels (lines 752 and 808);
     - the s17 ruler labels (866);
     - the s17 keyword "new coordinates x′, y′" (878);
     - the s17 picture labels "x′ = 4.6" and "y′ = 1.96" (876–877);
     - "(x′, y′) / = (4.6, 1.96)" (`S17L`, line 851);
     - the s20 axis labels (1100–1101).
   - The calculation rows set the same symbols in KaTeX, so two fonts sit side by side (22:53–23:32).
   - **Fix:** replace each `Lbl` with a `<TeX>` of the same colour and size: `x'`, `y'`, `x'=4.6`, `y'=1.96`, `(x',\ y')=(4.6,\ 1.96)`.
     - Give the keyword a TeX segment: `\text{new coordinates }x',\ y'`.
     - For consistency, set the plain "x" and "y" axis letters of s15 in TeX too.
3. **35:37–35:57, s23 S15–S16: "(out of the screen)" runs into the ratio equation.**
   - The ⊙ label ends at x 1242 and the CalcStack "=" sits at x 1262, so the line reads "(out of the screen) = 35/13 ≈ 2.7".
   - The left side "distance round / distance in" starts at x 912. That is left of the 1080 column and next to the ⊙ label.
   - **Fix** (`cf_sC.tsx` lines 250–254 and 264), either way works:
     - put "rising" and "(out of the screen)" inside the circle, left of the ⊙ (`a="end"`, x = ⊙x − 48), and fade the ratio rows at `tRise − 10` (the ratio is finished in S14);
     - or move the CalcStack to x ≥ 1340 so its left sides start at x ≥ 1080.
4. **29:57–30:10, s20 S20 keep line: the picture shows leftovers from the skipped block.**
   - Skippers jump from 19:13 to 29:57. They land on things they skipped:
     - "turned axes: α = 53° everywhere" and "polar: θ = 0°, 53°, 150°" (from s20 S18–S19);
     - the x′/y′ axes;
     - "α = θ: x̂′ = r̂, ŷ′ = θ̂".
   - Nothing shows the first half of the keep sentence: same arrow, new numbers.
   - **Fix** (`cf_sB.tsx` S20):
     - At the start of S20, fade the S18–S19 keywords and the extra arrow pairs.
     - Show the (3, 4) arrow (ink) with the old axes and the axes turned by α = 30°. Show the two number pairs "(3, 4)" and "(4.6, 1.96)" under "same arrow, new numbers".
     - On "polar parts are just axes turned by theta", show "r̂, θ̂ = x̂, ŷ turned by θ" on the balloon picture.
     - This is the same pattern as the s11 fix.
5. **33:09.5–33:25.5, s22 S15: the voice says "our thirty five is an average round the ring", but no 35 is on screen.**
   - The "≈ 35 m/s" SideCallout and the "35 × 3.6 = 126 km/h" row leave at `tSm − 22` (33:09).
   - The voice then compares 69, 35 and 49; only 69 and 49 are on screen.
   - **Fix** (`cf_sC.tsx` S22, line ≈ 48), either way:
     - keep the SideCallout to the end of the scene (`out` = scene end);
     - or add a teal row "our ring average: ū_θ ≈ 35 m/s", between "250 km/h ÷ 3.6 ≈ 69 m/s" and "strongest on our ring ≈ 49 m/s", on the words "our thirty five".
6. **5:06.8–5:16.4, s06 S6–S7: u and v appear 10 minutes before they are defined, and their row collides with "from".**
   - The row "u = +10, v = 0" appears under "bearing = … = 37°". u and v are first defined at 15:46 (s13 S6), and again at 30:35 (s21).
   - "from" sits left of the row, so it reads "from u = +10, v = 0" (crop at 5:09.5). The row's top touches "= 37°".
   - **Fix** (`cf_sA.tsx` S06), either way:
     - drop the u, v row and write "blows towards the east" in words beside the W → E arrow;
     - or move it under the arrow as "(towards the east, 10 m/s)".
   - Either way, keep "from" on its own line above the arrow, at least 24 px clear.

### SHOULD fix (14)
1. **14:20–14:26, s11 S24: "−7.0/8.7 ≈ −0.80" pages out at 14:24, just as θ̂ ≈ (−0.80, 0.60) appears.** Only two rows show, in a half-empty column. **Fix:** in the U1 stack (`cf_sB.tsx` line 482), change `maxLines={2}` to `{3}` so both divisions stay up with the θ̂ row and its tick.
2. **12:46.8–12:51.9, s11 S14: "θ̂ = (−0.8, 0.6)" at the balloon is given without inputs (A1).** **Fix:** add the row "= (−sin 53.13°, cos 53.13°)" before the result. Alternatively show "r̂ = (0.6, 0.8) → swap, minus on the first → (−0.8, 0.6)".
3. **18:53.6–19:04.4, s14 S13 keep line: the √(6² + 8²) and |(10, 0)| rows and the ✓ rebuild are leftovers (B4).** **Fix** (`cf_sB.tsx` 695):
   - Fade the first CalcStack (`old`) at the keep line.
   - Label the picture "in/out: u_r = **u**·r̂" (rose) and "round: u_θ = **u**·θ̂" (teal).
   - Keep the two general formulas.
4. **A2: sign moves are spoken but have no line of their own.**
   - 17:41.7–17:52.8, s14 S4: add "(−8)(−0.8) = +6.4 (minus × minus = plus)" (`cf_sB.tsx` 699–700).
   - 37:26.6–37:37.5, s24 S16: add "−(−16.9) = +16.9".
   - 38:18.8–38:26, s24 S21: add "(−10.1)(−0.707) = +7.14" and "(−44.5)(0.707) = −31.46" before "7.14 − 31.46".
   - 38:27.5–38:43, s24 S22: add "(−44.5)(−0.707) = +31.46" (`cf_sC.tsx` 393–405).
5. **20:10.6–20:13.7, s15 S13: the voice says "Let's use alpha equals thirty degrees", but α = 30° is not on screen; the arc is labelled "α" only.** **Fix:** add an "α = 30°" row at the head of the S15 stack (`cf_sB.tsx` 783), on "thirty degrees", and label the arc "α = 30°".
6. **25:31.5–25:32.5, end of s18: unspoken rows flash into the fade-out.**
   - The rows: "ŷ′·ŷ = cos α" (also never spoken); "α = 30° : cos 60° = 0.5," with a dangling comma; "cos 120° = −0.5".
   - They are scheduled at `AT(k,13,"ninety degrees plus") + 75/150/170`, after S14 ends.
   - **Fix:** delete lines 977–979 of `cf_sB.tsx`, or voice them.
7. **31:45–31:50 and 32:29–32:33, s22 running sums: the minus is an ASCII hyphen in the sans font ("sum so far: -19.1 m/s", "-949.2").** **Fix:** in the S22 sum labels of `cf_sC.tsx`, use `sumR.toFixed(1).replace("-", "−")` (U+2212), or set the label in KaTeX.
8. **20:27–20:32, s15: the gold "α" touches "sin α = 0.5", and the dashed sin leg runs through the α.** **Fix:** move "sin α = 0.5" 30 px right, or put the α label below its arc (`cf_sB.tsx` ≈ 779).
9. **D1: teal still marks plain arrows. Teal means u_θ.**
   - The (3, 4) position arrow and the turned (−4, 3): 9:41–11:32 (s10), 19:05–23:32 (s15–s17), 43:02 (s27 S8).
   - The s17 shadows and the labels "x′ = 4.6" and "y′ = 1.96": 22:02–23:32.
   - **Fix:** draw position arrows in ink. Draw the shadows and their labels in a neutral colour (gold, or the rulers' orange `second`).
10. **30:51–31:12, s21 S7–S9: the map's right-edge fade clips "southwest Florida" to "Florid a".** **Fix:** move the label about 120 px left, inside the map (`cf_sC.tsx` S21).
11. **40:18–40:46, s25: two labelling problems.**
    - "mean −13" sits on the plot's bottom frame line (y = −50), with a ghost behind it.
    - The two 14s are ambiguous: "72 − 14 = 58 points in" and "14 out" count points, while "+14" is in m/s.
    - **Fix:** put "mean −13" at the right end of the dotted −13 line, and write "+14 m/s" and "14 points out".
12. **15:43–17:24, s13: "r̂, θ̂ : length 1 / wind: its own scale" is about 36 px and grey, under the 44-px minimum.** **Fix:** use T.floor (at least 44 px) at key contrast.
13. **14:57–15:17, s12 S5–S7: the θ = 180° rows stay on screen while the balloon is back at 53°.** **Fix:** fade the θ = 180° rows at S5.
14. **28:07–28:15, s20 S2: the voice says "fifty three degrees", but the screen shows only "α = θ".** **Fix:** write "α = θ ≈ 53°" (`cf_sB.tsx` 1143).

### COSMETIC (optional)
- 4:18–4:22, s05: "cos θ = 3/5 = 0.6" pages out before "5 × 0.6" is said (`cf_sA.tsx` 387: `maxLines` 2 → 3). The x row itself still carries the 0.6.
- 38:07–38:43, s24: "sin 135° ≈ 0.707" pages out before it is used. The rows still carry the 0.707.
- 24:41–25:05, s18: γ in "|â||b̂| cos γ" is never named. Add "γ: the angle between them".
- 9:26–9:40 and 14:30–14:37: "turned by + 90°" has the spacing of a binary plus. Write `{+}90^\circ`.
- 28:14–30:09, s20: the "r̂" tip label and the "x′" axis label touch.
- 7:55–8:36, s09 S1–S8: for 40 s the right side holds only the keyword. The content is on the left, and the gate passes.

### Limits
- I did not listen to the audio. The speech-level proxy shows no level step in the re-voiced S20 and S23.
- Motion was sampled at sentence ends, and densely only in U1, s05, s18 and s22.
- No colour-blind simulation (accepted in review 1).

**Disk.** C: 115 GB free, G: 478 GB free. The review frames are in the ignored `review3/`.

### Overall: FIX (#5a fix 2 review 3: 6 Must, 14 Should)
- The user's four notes and every review-2 Must are fixed. The physics and every number check out.
- All six remaining Musts are TSX-only, with no TTS:
  - the s26 halves FAIL;
  - x′/y′ in TeX;
  - the s23 label collision;
  - the s20 keep picture;
  - "35" on screen in s22 S15;
  - u/v in s06.
- Re-render s06, s11 and s13–s27 (or the whole movie), then re-run qa (`halves`) and K6.


## #5b build 1 review 1 (with calculation & sync audit)
2026-11-06 · fresh eyes · movie `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/build1_1080.mp4`

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_coordinates_storm (#5b) build 1 | 42:48 (2568.33 s) | 153.9 MB | 14/15 (halves FAIL) | PASS (1 honesty Should) | PASS | FIX (clipped label, colliding bar numbers) | FIX (2 empty halves, lap clock, s22 zoom off the eye) | PASS (2 minor) | PASS | n/a (retired; exaggerations labelled on screen) | **FIX** |

**Method.** 507 frames extracted with ffmpeg into `reports/movies/ch00_coordinates_storm/review1/frames/` (not committed): one at
the end of every one of the 399 sentences (end − 0.15 s; the largest gap between two frames is 17 s), plus extra frames for the
halves FAIL spans, the s09 lap (every 1.5 s), the s19 swing round / close look (every 1.5 s), s22 (every 2 s), the s30 swipe
(every 1 s, plus a 10-fps tracker of the gold swipe line) and mid-sentence checks. They are tiled with time stamps in
`review1/tiles/` (calculation scenes at 960 px, the rest at 640 px, which is also the legibility check), with full-resolution crops
in `review1/crop_*.jpg`. Every number on screen was recomputed in Python. Sources read: `part1_lessons_checklist.md`, the #5b audit
B1–B25, `fix0_log.md`, `part1_lessons_log.md`, `script.md`, `timing.json`, `en.vtt`, `qa.json`, `cs_sA/sB/sC.tsx`, `cs_eq.ts`.
The C–G audit items in this report belong to Parts 3–7. None of them targets #5b; their cross-part rules are the checklist rows
checked below.

**qa.json.** 14/15 PASS. The one FAIL is `halves`: "left 720.0–739.0 s (19.0 s); left 859.5–872.0 s (12.5 s) [FAIL > 10 s; 7 span(s)
> 3 s in all]" (see M1). Captions re-checked independently: 625 cues, text = script, 0 lines > 42 characters, 0 cues > 17 cps.

### Physics checks (asked for)
- **NH Coriolis on cyclonic flow points outward: PASS.** At 22:51–23:02 (s14 S16) the violet arrow points outward from the parcel,
  with its head, and is tagged "drawn 6× longer". The numbers are right: f = 2Ω sin 26.5° = 6.51 × 10⁻⁵ s⁻¹; f v = 0.00226 m/s²;
  0.048 / 0.0023 = 21. The inputs for 0.0023 are not on screen (M10), and the force is not called apparent (S12).
- **Box continuity w = 2h|u_r|/r ≈ 1 m/s: PASS.** At 30:21–30:45 (s20 S13–S14): 2 × 1000 × 16 / 30 000 = 1.07 m/s (1.05 with 15.7).
  The gold box r 0–30 km × z 0–1 km is drawn, with the inflow arrow into its side and three up arrows out of its lid. One step is
  missing: the equality and its cancellation (S15).
- **Signs of u_r: PASS.** Inflow is negative everywhere: "≈ 13 m/s in (−)", "−6.5", "−16", "−6", "−11"; the colour key is
  "rose −: in · blue +: out". One wording is ambiguous, "in −6.0" (S16).
- **Hemisphere and viewpoint wording: PASS.** "Anticlockwise as seen from above" appears at 1:31, 18:23 and 33:31, with "both
  storms are in the northern hemisphere". Every drawn circulation (s01, s02, s09–s14, s15 GOES plate, s23 ERA5, s26 HRRR) turns
  anticlockwise, and the s15 inflow arrows spiral in cyclonically.
- **Flood swipe right → left → right → middle, slow full sweeps: PASS on motion.** The 10-fps tracker gives: line at the right
  edge (x 1078) to 40:29.3; R → L 40:29.4–40:33.3 to x 78; hold; L → R 40:35.5–40:39.3; hold; → middle (x 578) 40:41.3–40:43.2;
  hold to 41:01. That is ≈ 4 s eased per full width (`swipeX` G = 135 frames). The sync is a Should (S22).
- Ian 960 vs 938 hPa, 17 km WSW, ring tags −6.5 / 0 / +1 / +1 / +6.5, section −16 / +9 / 55 m/s, radar 3.3 m/s at 8.5 km, Amphan
  90 kt = 46 m/s and 967 vs 956 hPa, Nargis dates (21 Apr / 2 May / 5 May), 75 hPa → 75 cm, shelf ≈ 33 km: all match the voice and
  the data.

### Calculation & sync audit (sentence-end frames, scene by scene)
| scene | calculation / derivation | on screen, in sync? | result |
|---|---|---|---|
| s03 (2:35–4:26) | arc s = 1 × Δθ; 0.1 rad × 180°/π ≈ 5.7° ≈ 6°; s = 1 × 0.1 | every row on its sentence; wedge eases to 5.7° and back | PASS (S3 label overlaps) |
| s04 (4:26–6:31) | move ≈ Δθ θ̂ = (−sin θ Δθ, cos θ Δθ); ÷Δθ; check at 53.13°: 0.592 − 0.600 = −0.008, ÷0.01 = −0.8; 0.806 − 0.800 = +0.006, ÷0.01 = 0.6 | one row per sentence; the Δ rows stay to S7 | PASS (S5: 3/5 origin, 0.57°) |
| s05 (6:31–7:41) | chord 0.09996 vs arc 0.1; Δr̂/Δθ → dr̂/dθ = θ̂; middle slope line | in sync | PASS (S6: "Δθ→0" 30 px) |
| s06 (7:41–9:41) | five steps; swap → (cos θ, −sin θ); minus first → (−cos θ, −sin θ) = −r̂ | in sync; −r̂ opposite r̂ (B8 fixed) | **M5** clipped label; S7 early arc |
| s07 (9:41–11:38) | θ̂(53.70°) = (−0.806, 0.592); Δθ̂ = (−0.806 − (−0.800), 0.592 − 0.600) = (−0.006, −0.008); ÷0.01; = −r̂ | in sync | **M4** sign line missing |
| s08 (11:38–14:32) | 10(1, 0); Δv = 1; d̂_new; 11(0.995, 0.1); (10.945, 1.1) − (10, 0); 1(1, 0); Δd̂ = (−0.005, 0.1); 10(…); 1(…); sum; halving; ÷Δt | rows on their words (B3, B4, B19 fixed) | **M1, M2, M3** |
| s09 (14:32–16:13) | Δs = vΔt; arc rule; Δθ/Δt = v/r; 34.8/25 000 = 0.00139; × 57.3 = 0.08°/s; × 60 = 4.8 ≈ 5°/min; 6.283/0.00139 ≈ 4500 s; /60 = 75 min | in sync | **M6** lap clock |
| s10–s11 (16:13–18:32) | position = r r̂; product rule; dr/dt = 0 struck; chain rule; v = r θ̂ v/r = v θ̂ | in sync (B20 fixed) | PASS (S6: r's not struck, row ≈ 40 px) |
| s12 (18:32–20:09) | product rule, dv/dt struck; chain rule; a = v·(−r̂ v/r) = −(v·v/r) r̂ = −(v²/r) r̂; units | in sync (B21 fixed) | PASS (S9 "−" tag) |
| s13 (20:09–21:15) | 34.8² ≈ 1211; /25 000 ≈ 0.048; 35²/25 000 ≈ 0.049; 9.81/0.048 ≈ 200; 100 000 m/3600 s ≈ 27.8; /0.048 ≈ 580 s; /60 ≈ 9.7 ≈ 10 min | in sync | PASS (S5: 35² = 1225 not shown) |
| s14 (21:15–23:19) | Δθ = 0.00139 × 60 ≈ 0.084 rad; × 57.3 ≈ 4.8°; 34.8 × 0.084 ≈ 2.9; /60 ≈ 0.048; balance 0.048 in / 0.0023 out / ratio 21 / 0.050 | in sync; arc-rule row printed twice | **M10** (inputs, one rounding) |
| s20 (28:52–31:19) | ring average (1/72) Σ; box: 2πr h\|u_r\|, πr² w, w = 2h\|u_r\|/r = 2 × 1000 × 16/30 000 ≈ 1 | in sync | PASS (S15 one move, km → m) |
| s23 (32:36–34:22) | 90 kt × 1.852 ≈ 167 km/h; ÷ 3.6 ≈ 46 m/s; 967 vs 956; tan = \|u_r\|/u_θ; 6.0/20.1 ≈ 0.30 ⇒ 16.6°; 13.3/34.8 ≈ 0.38 ⇒ 20.9° | 956 row one sentence late | Should (S16) |
| s26 (35:51–36:37) | (22.2 E, 24.3 N); √(22.2² + 24.3²) = √(494 + 590) ≈ 32.9 | in sync | **M9** 22.2² = 492.8, not 494 |
| s27 (36:37–38:18) | 1013 − 938 ≈ 75 hPa ⇒ ≈ 75 cm; 10 × 0.3048 ≈ 3.0; 15 × 0.3048 ≈ 4.6 | in sync | Should (S18: units, 4.6 vs 4.5, 1 cm/hPa origin) |
| skip chips | "skip to 11:38" (s08 S0 at 11:38.60), "skip to 20:09" (s13 S0 at 20:09.95) = VTT | — | PASS |

**Audit items B1–B25 in the frames.** Applied: B1, B2, B4–B8, B10–B12, B14, B15–B23, B25(c)–(e). Partly applied:
- B3: the bar numbers collide, and the divisions are missing (M2, M3).
- B9: no sign line (M4).
- B13: one step is skipped (S15).
- B24: the angles are rounded inconsistently (S16).
- B25(a): the squared value is wrong (M9).
- B25(b): the origin of "1 cm per hPa" is still missing (S18).

### Must fix (10)
1. **M1 — 12:00–12:19 and 14:19.8–14:32 (s08 S3–S5 and S23–S24): the left half is empty (`halves` FAIL, 19.0 s and 12.5 s).**
   - *Cause* (`cs_sA.tsx` S08): the keep picture fades out at `tTool − 14` (line 541), and the grid only comes in at `tEasy`
     (line 549). Later, the bars leave at `fout(f, tRule − 10)` (line 575), and EQ_S08 sits on the right.
   - *Fix, first span:* bring the grid group in at `tTool` with the unit arrow d̂ = (1, 0) and the ink (10, 0) arrow. Show a gold
     "×10" tag on S5 ("a number times an arrow") and let both pulse on "both change".
   - *Fix, second span:* keep the two surviving pieces of the inset on the left from `tRule` to the end of the scene. Draw (1, 0)
     in slate, tagged "$\tfrac{dv}{dt}\hat{\mathbf d}$", and (−0.05, 1) in orange, tagged "$v\tfrac{d\hat{\mathbf d}}{dt}$", in
     the colours of the two gold lines "number's rate × arrow" and "+ number × arrow's rate". Then re-run `halves`.
2. **M2 — 13:57–14:20 (s08 S21–S22): the bar numbers run together.** They read "0.5 0.0250.25 0.250.006". The bars are 100 px
   apart, but "0.025" at 44 px is ≈ 110 px wide (`cs_sA.tsx` S08 lines 577–582, `x + j * 100`).
   - *Fix:* bars 120 px apart, groups 340 px apart (x 80…1000), or put each rose number above its bar.
3. **M3 — 13:43–14:19 (s08 S18, S22): two spoken results have no arithmetic.**
   - (a) S18 "sum = (0.945, 1.1)" is shown without the addition (line 610). Add
     `(1,\ 0)+(-0.05,\ 1)+(-0.005,\ 0.1)=(1-0.05-0.005,\ \ 0+1+0.1)` and then `=(0.945,\ 1.1)`.
   - (b) S22 "÷Δt: 0.1 → 0.05 → 0.025 → 0" (line 617) shows no division, and "the first two stay at about one" is not
     computed. Add the row `\dfrac{1}{1}=1,\ \dfrac{0.5}{0.5}=1,\ \dfrac{0.25}{0.25}=1` on "the first two stay", and the row
     `\dfrac{0.1}{1}=0.1,\ \ \dfrac{0.025}{0.5}=0.05,\ \ \dfrac{0.00625}{0.25}=0.025` on "the third goes".
   - (c) The third bar and its row show "0.006", but 0.006 / 0.25 = 0.024, not the spoken 0.025. Show 0.00625 in the
     Δt = 0.25 row and under the bar (A6, one rounding; lines 581 `n3`, 616).
4. **M4 — 10:44.9–10:50.6 (s07 S12): the sign step is skipped.** "−0.806 − (−0.800)" jumps straight to −0.006 (A2: signs get
   their own lines).
   - *Fix* (`cs_sA.tsx` S07 lines 504–506): insert `\phantom{\Delta\hat{\boldsymbol\theta}}=\big(-0.806+0.800,\ \ 0.592-0.600\big)`
     with the slate tag "minus a minus is a plus" before the result row.
5. **M5 — 08:41–09:16 (s06 S16–S22): the rose label "θ̂ turned 90°" runs off the left frame edge.** It reads "rned 90°".
   - *Fix* (`cs_sA.tsx` S06 line 431): the label is end-anchored at `slideEnd[0] − 10`. Anchor it at start, below the
     circle (x ≥ 60), or right of the slide arrow inside the circle.
6. **M6 — 15:58.7–16:13 (s09 S15–S16): the lap clock contradicts the parcel.**
   - *What's wrong:* the clock runs 0 → 75 min over the lap phase. The parcel uses `lapA(f)` with `per = 300` frames (10 s per
     lap). So it is at −40° at "t = 7 min", back at −40° at "t = 62 min", and 1.3 laps round at "t = 69 min", while the rows
     say one lap = 75 min.
   - *Fix* (`cs_sB.tsx` S09 lines 70, 73, 89): from `tLap` on, set `a = aLap0 + 360 * lapFrac`, where `aLap0` is the parcel's
     angle at `tLap`.
7. **M7 — data frames without their colour bar or source line (D2).**
   - (a) 26:22–27:28 (s18 S0–S7): the coloured u_r layers show for 66 s before the colour bar comes in on S8. The bar is
     `URBar … o={fin(f, tCol)…}` at `cs_sB.tsx` line 636. Show the bar from S3 (when the layers are named), or keep the layers
     grey until `tCol`.
   - (b) 28:41–28:50 (s19 S7–S8): during the swing round and close look, the source line is faded out (line 691,
     `1 − win(f, tOrbit − 12, tLook + 140)`) and the colour bar goes too (line 666 `colO`). Keep both. For example, put the credit
     at top right beside the picture during the close look, and keep the bar at least half visible.
   - (c) 01:01–01:14 (s01 S6–S8): the world map has no source line until the Ian dot. In `cs_sA.tsx` S01 line 155, change
     `o={oWorld * fin(f, tIan)}` to `o={oWorld}`.
8. **M8 — 32:16–32:36 (s22): the zoom drifts off Amphan's eye.**
   - *What's wrong:* at z = 1 (32:16.5) the dark pinhole eye sits ≈ 126 px below the gold ring (≈ 100 km, ≈ 0.9° latitude).
     The zoom is centred on `AMP.modis.eye`, so the real eye slides down and leaves the frame by 32:24. From 32:27 the "pinhole
     eye" ring and the cylinder circle blank, flat-white cloud. The voice ("a tiny clear dot") has no picture.
   - *Fix:* correct `amphan.modis.eye` in `movies/data/build_ch00_coordinates_storm.py`. Locate the dark local minimum in the
     MODIS crop, and add a CHECK row "eye within 5 px of the darkest pixel".
   - Then re-run the zoom (`cs_sC.tsx` S22 lines 114–121). Contrast-stretch the crop, as the GOES plate is ("contrast enhanced";
     note it on the source line), so the 3.4× view is not uniform white.
   - Draw the cylinder in ink with a dark halo; at present it is invisible on white.
9. **M9 — 36:10–36:37 (s26 S3–S5): the arithmetic on screen is wrong.** The row reads "√(22.2² + 24.3²) = √(494 + 590)", but
   22.2² = 492.8. The 494 comes from the unrounded 22.23.
   - *Fix* (`cs_sC.tsx` S26 line 386): square the displayed values, `Math.round(Number(nf(u[0], 1)) ** 2)`, which gives
     √(493 + 590) = √1083 ≈ 32.9.
10. **M10 — 22:51.8–23:02 (s14 S16): "Earth's spin ≈ 0.0023 m/s²" appears with no inputs (A1), and the sum rounds it a second
    time (A6).**
    - *Fix* (`cs_sB.tsx` S14 lines 368–373): before the 0.0023 row, add
      `f\,v=2\Omega\sin\varphi\cdot v\approx6.5\times10^{-5}\ \mathrm{s^{-1}}\times34.8\ \mathrm{m/s}\approx0.0023\ \mathrm{m/s^2}`,
      with the slate tag "Ω: Earth's spin rate · φ = 26.5°: Ian's latitude · why: Coriolis movie".
    - Make the sum `0.048+0.0023\approx0.050` (it now reads 0.048 + 0.002).

### Should fix (25)
1. **S1 — s02.**
   - 02:16–02:31 (S7): the Ian-ring panel's coastline spills out of its box, up to the frame top and to the right. Clip the
     coast path to `IB` (`cs_sA.tsx` S02).
   - 02:27–02:35 (S8–S9): the gold turning arc and the r̂ head reach y ≈ 10–50 px. Move the polar picture 60 px down.
2. **S2 — 00:49–01:00 (s01 S5): the parcel and its arrow run over the highlighted cylinder icon in the series row.** Raise the
   ring or lower the icon row (`cs_sA.tsx` S01 lines 100–150).
3. **S3 — labels on strokes.**
   - 03:34–04:26 (s03): "Δθ" sits on the turned r̂ arrow, and "≈ 0.1" sits under the gold leader's arrowhead.
   - 08:22–08:36 (s06 S12–S13): "Δθ" and "θ̂" are stacked on the thick arc.
   - 10:04 (s07 S4): "leans west" sits on the 53° θ̂ arrow.
4. **S4 — 04:26–06:31 (s04): the arrow colours swap roles.** In s03 and s05 orange is the turned r̂ and brown the old one. In s04
   orange is the old (53°) arrow and brown the turned (73°) one. Use one convention (`cs_sA.tsx` S04).
5. **S5 — small missing inputs (A1).**
   - 05:44 (s04 S10): "cos θ = 3/5" comes without its origin. Add the slate tag "balloon: 3 km E, 4 km N, 5 km away".
   - 05:51 (s04 S11): "0.01 rad = 0.57°" comes without `0.01\times57.3\approx0.57^\circ`.
   - 11:10 (s07 S16): the middle line `\tfrac{d}{d\theta}(-\sin\theta,\ \cos\theta)=\big(\tfrac{d(-\sin\theta)}{d\theta},\ \tfrac{d\cos\theta}{d\theta}\big)` is missing (as in s05; use `\dfrac`).
   - 20:37 (s13 S4): `35^2=1225` is missing.
6. **S6 — maths below 44 px, or not shown cancelling.**
   - 06:48–07:00 (s05 S4): the "Δθ→0" label over `\xrightarrow` is ≈ 30 px (`cs_sA.tsx` line 388). Make it its own 44-px row,
     "as Δθ → 0".
   - 19:48–20:09 (s12, `EQ_S12`, `cs_sB.tsx` line 245) and 18:04–18:12 (s11 S8–S9 row): the summary rows render at ≈ 36–40 px.
   - "The two r's cancel" (s11 S9) shows no strike. Strike both r's, as s09 does for "Δt cancels".
7. **S7 — 08:07 (s06 S7): the "quarter turn ahead" arc and label appear on "Step two",** ≈ 5 s before S9 says it. Put them on
   `AT(k, 9, "quarter turn")`.
8. **S8 — 19:47–20:21 (s12 S12–s13): the inward acceleration arrow is tagged with a lone "−"** (`cs_sB.tsx` line 213), which
   reads as a dash. Write `$-\hat{\mathbf r}$` or "inward".
9. **S9 — 21:00–21:15 (s13 S8): the car rows are crowded.** The "0.048 m/s²" denominator touches "580 s" below it.
10. **S10 — 22:12–22:33 (s14 S11–S12): the arc-rule row is printed twice.** It appears in the stack and again as `EQ_S14` at 44 px
    (line 364). Keep one.
11. **S11 — 22:34–22:44 (s14 S13–S14): the parcel and its arrows vanish** while the voice says "something must push the parcel
    inward"; only an empty ring shows. Keep the parcel.
12. **S12 — physics honesty (R1): s14 says and labels "Earth's spin pushes …" without saying it is an apparent push seen in the
    rotating frame.**
    - Change the label (line 352) to "Earth's spin, as seen on the turning Earth: ≈ 1/20, outward".
    - In a later voice pass, consider "…the Earth's spin seems to push the other way…".
13. **S13 — 29:01–29:15 (s20 S1–S2): for ≈ 14 s the left half holds only a shrinking ring, then a dot.**
    - The formula says 72 points, but the ring shows 12.
    - Draw the ring of 72 samples on the 925-hPa layer image.
    - Add the slate tags "Σ: add up the 72 values" and "bar: the ring average". This is new notation for this audience.
14. **S14 — s20 sections.**
    - 29:58–31:19: the tangential-wind contour labels (10–50) are near-black with a dark halo, which reads as smudges at 640 px
      (`cs_sB.tsx` line 776, `c="#1a1a24"`). Use dark text on a pale halo.
    - The dark notch at the bottom left of the section (0–45 km, lowest ≈ 0.3 km) has no label. So does the matching one on
      Amphan's section (34:22–35:00, 0–75 km). Label it, for example "no data: below the sea surface".
15. **S15 — 30:31–30:45 (s20 S13–S14): one move per step in the box check.**
    - Add `2\pi r\,h\,|u_r|=\pi r^2\,w`.
    - Then add `w=\dfrac{2\pi r\,h\,|u_r|}{\pi r^2}`, with π and one r struck, before `w=\dfrac{2h|u_r|}{r}`.
    - Write `h=1\ \mathrm{km}=1000\ \mathrm m,\ \ r=30\ \mathrm{km}=30\,000\ \mathrm m` (lines 830–833, label line 817).
16. **S16 — s23.**
    - 32:40–34:22: the colour bar's "m/s" touches the keyword. Move the bar under the map.
    - 33:03 (S3): "one box ≈ 28 km" needs `0.25^\circ\times111\ \mathrm{km}\approx28\ \mathrm{km}`.
    - 33:50 (S8): the official 956 hPa is spoken in S8 but its row comes in on S9 (line 245). Split the row.
    - 34:05 (S11): `\arctan0.30=16.7^\circ` and `\arctan0.38=20.8^\circ`. Write 0.299 and 0.382 so that 16.6° and 20.9° hold
      (`cs_eq.ts` line 19, `cs_sC.tsx` line 224).
    - "round 20.1 · in −6.0" reads as a double negative. Write "u_θ = 20.1 · u_r = −6.0 (in)" (lines 204, 213, 215).
17. **S17 — 36:12–38:18 (s26–s27): the white wind arrows cross the map labels.**
    - The arrow at Fort Myers Beach cuts through "Beach" ("Beac|h"); the St Pete arrow does the same to "Saint Petersburg".
      Offset the labels.
    - 36:22: "towards the NE = from the SW" sits ≤ 10 px above the "wind speed" bar title.
18. **S18 — 37:12–37:22 (s27 S3–S4).**
    - The feet rows have no units. Write `10\ \mathrm{ft}\times0.3048\ \mathrm{m/ft}\approx3.0\ \mathrm m`.
    - 15 ft is shown as 4.6 m, but the keyword and the voice say 4.5. Use one rounding (lines 465–466).
    - "75 cm: small next to 3–4.5 m" is printed above its own input row.
    - "≈ 1 cm per hPa" needs its origin, `\dfrac{100\ \mathrm{Pa}}{1025\times9.81}\approx0.01\ \mathrm m`.
19. **S19 — s21.**
    - 31:49: "130 kt (IMD)" is unspoken, unconverted, and the abbreviation is undefined (`cs_sC.tsx` line 95). Write ≈ 67 m/s
      and "India Meteorological Department", or drop it.
    - 32:05: "Kolkata ≈ 17 km" is ambiguous. Write "closest to Kolkata ≈ 17 km" (line 97).
    - 32:10–32:16 (S6): the view zooms out to the globe while the voice names the Khulna and Satkhira districts, and the right
      half is empty. Hold the zoomed map with the two districts outlined until S6 ends.
20. **S20 — 34:22–35:00 (s24): the vertical colour bar's "+ out" overlaps "+16".**
21. **S21 — 35:37 (s25 S6).**
    - The north component v is drawn teal, which the series reserves for u_θ. Use ink or slate dashes.
    - The gold "–" between the two mini pictures should be an arrow.
22. **S22 — 40:29–40:40 (s30 S7–S8): the swipe plays against the voice.**
    - The first sweep (R → L) runs during S7. "As the line glides across, dark water spreads over land that was green before"
      (S8) then plays over the L → R return, where the water recedes.
    - Start the sequence on `AT(k, 8, "glides")` instead of `tR` (`cs_sC.tsx` line 587). The order and speed are right.
23. **S23 — 41:01–42:22 (s31): each recap keyword fades about 0.5 s before its sentence ends** (`out={t(j+1) − 20}`, `cs_sC.tsx`
    lines 683–691). D3 requires full strength to the end of the sentence. Use `t(j+1) − 4`.
24. **S24 — captions.**
    - Cue 00:53.12 "In this part," lasts 0.92 s (< 1 s).
    - Cue 31:59.03–32:02.95 spans the S4/S5 gap ("Bangladesh. Its centre then…"). Break cues at sentence ends (`make_timing.py`).
25. **S25 — the five WARN half-spans (> 3 s) are not itemised in qa.json.**
    - The ones seen here are 28:44–28:49 (s19 close look, right half), 29:01–29:15 (s20, dot only, see S13) and 32:10–32:16
      (s21 S6).
    - The gauge axes (s27, s28, s31) begin with an ambiguous "12 UTC" (27 Sep). Write "27 Sep 12 UTC".
    - Add the WARN list to the qa output.

### What works (keep)
- The derivation blocks from s03 to s14 read row by row on their words. The halving bars, the "change, drawn 3× larger" inset with
  its gold leader, the tails-together inset, the s23 triangles and the B8 −r̂ slide are clear.
- Data frames have source lines below the picture (≥ 28 px), except the M7 gaps. Diverging rose–blue for u_r and a yellow–green
  sequential for speed are colour-blind safe. There are no flashes (max 0 per second), and loudness is −16.3 LUFS.
- The skip pattern is correct: lead-ins at 2:35 and 11:49, keep lines at 11:38 and 20:09, and the chips equal the VTT times. The
  chapter marks equal the scene starts.
- The title and the end card follow the house style; the end card is the maths ending, word for word.

### Limits
- Audio was not listened to. Captions and sync come from `timing.json`, the VTT and the frames.
- Frames come from the H.264 render (CRF), so fine-colour judgements are approximate. The s18/s19 layer colours were not checked
  against data. The physics parity gate covers them (28 functions reproduce their hashes).

### Verdict: FIX (#5b build 1 review 1: 10 Must, 25 Should)
M1 fails the house `halves` gate. M6 and M8 make the picture contradict the voice. M9 and M3(c) are wrong arithmetic on screen.
M3, M4 and M10 skip calculation steps. M2 and M5 are illegible or clipped text. M7 leaves data frames without their colour bar or
source line. All of these are TSX/data edits; no re-voicing is needed. After the fixes, re-run K6 on s01, s06–s09, s14, s18–s22,
s26 and s31, then a full render and `movie_qa`.


## #5a fix 3 review 4 (verification)
2026-11-06 · fresh eyes · movie `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_flat/build1/build1_1080.mp4` (151 835 881 bytes, the file `qa.json` measured) · source commit 6aa7d66

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ch00_coordinates_flat (Part 1, fix 3) | 43:55.2 (2635.20 s; narration 2632.70 s) | 151.8 MB | **15/15 PASS** | PASS | PASS | PASS with notes (s12, s25 label crowding) | PASS | PASS (623 cues = script; timing unchanged since fix 2) | PASS | n/a (retired) | **PASS with notes** |

**Method.**
- 270 frames, extracted with ffmpeg into `reports/movies/ch00_coordinates_flat/review4/` (ignored; tiles in `review4/tiles/`).
- Each review-3 item checked at its timestamp, with 2–6 frames around it. Full-resolution crops at 14:56, 19:02, 20:30, 20:56, 30:09.5, 40:35, 16:00, 04:19, 43:15 and 43:50.
- U1 block (13:05–14:37.5): 24 frames, about one every 3.5 s.
- Whole-movie sweep: one frame every 30 s (57 frames) outside the stretches already covered densely.
- Fix 3 changed only TSX, so `timing.json`, `en.vtt` and the skip-chip times are those of review 3. I checked them again on screen: 14:26, 18:53, 29:57 and 38:58.

### qa.json
15/15 PASS. Changes since review 3:
- `halves` now PASS ("no picture or maths zone empty > 3 s"; it was 19.0 s FAIL).
- overlap: 3680 frames, 0 hits.
- captions: 623 cues = script.
- physics: 19 functions reproduce their hashes.
- equations: 23/23.
- loudness: −16.3 LUFS, peak −1.6 dBTP.
- flashes: 0.

### Review-3 items, checked on the frames
| item | status | evidence |
|---|---|---|
| Must 1 (s26 halves) | **fixed** | 41:23: all four slots are ghosted across x 250…1600, with "four angles" at the top right. Each slot comes up on its own sentence: θ at 41:28, the bearing at 41:35, α at 41:41 and inflow at 41:46. The tan⁻¹ rows end at 41:20.3, after "twenty one degrees". |
| Must 2 (x′, y′ in TeX) | **fixed** | 19:50–23:30 and 28:10–29:40: the ruler labels x′/y′, "new coordinates x′, y′", "x′ = 4.6", "y′ = 1.96", "(x′, y′) = (4.6, 1.96)" and the s20 axis labels are all KaTeX. The s15 x/y axis letters are KaTeX too. |
| Must 3 (s23 ⊙ label) | **fixed** | 35:39–35:55: the ratio rows have gone before the ⊙ appears. "rising / (out of the screen)" stands alone beside the ring. |
| Must 4 (s20 keep picture) | **fixed** (one Should left) | 29:58: the leftovers are gone, and "same arrow, new numbers" shows with (x, y) = (3, 4). 30:03: "(x′, y′) ≈ (4.6, 1.96)", with an inset of the old axes and the axes turned by α = 30°. 30:09: "r̂, θ̂ = x̂, ŷ turned by θ", with dashed x̂, ŷ at the balloon. See R4-4 below. |
| Must 5 (s22 "35") | **fixed** | 33:08–33:25: "≈ 35 m/s" (teal) stays to the end of the scene above the knots chain. "strongest on our ring ≈ 49 m/s" follows. |
| Must 6 (s06 u, v) | **fixed** | 5:08–5:15: the u, v row is gone. "from" stands on its own line, the W → E arrow sits under it, and "a west wind blows east" sits under that. Nothing touches "= 37°". |
| Should 1 (U1 maxLines) | fixed | 14:21–14:24.4: both divisions and θ̂ ≈ (−0.80, 0.60) are up together with the tick and the gold link. |
| Should 2 (θ̂ at the balloon) | fixed | 12:51.5: "θ ≈ 53.13° : θ̂ = (−sin 53.13°, cos 53.13°) = (−0.8, 0.6)". |
| Should 3 (s14 keep) | fixed | 18:55: the √ rows are gone. 19:00–19:04: "in/out: u_r" (rose) and "round: u_θ" (teal) label the picture, and "u_r = u·r̂" and "u_θ = u·θ̂" sit above the general formulas. |
| Should 4 (A2 sign lines) | fixed | 17:52.5: "(−8)(−0.8) = +6.4 / minus × minus = plus". 37:37: "−(−16.9) = +16.9". 38:25.8: "(−10.1)(−0.707) = +7.14" and "(−44.5)(0.707) = −31.46". 38:42.8: "−(−10.1) = +10.1", "10.1 × 0.707 = 7.14" and "(−44.5)(−0.707) = +31.46". |
| Should 5 (α = 30°) | fixed | 20:13.0: the row "α = 30°" and the arc label "α = 30°", on "thirty degrees". |
| Should 6 (s18 unspoken rows) | fixed | 25:29–25:33: only the two spoken direction-cosine rows show, and they leave with the scene. |
| Should 7 (ASCII minus) | fixed | 32:31.5: "sum so far: −906.1 m/s". `nf()` in `cf_lib.tsx:45` writes U+2212. |
| Should 8 (α touches sin α) | fixed | 20:30 crop: "sin α = 0.5" starts at x 568. The α sits about 13 px left of the dashed leg. |
| Should 9 (teal position arrows) | fixed | 11:05, 19:50–23:30 and 43:00: the position arrows are ink. The shadows and x′/y′ labels are gold. |
| Should 10 ("Florid a") | fixed | 30:59.5–31:12: "southwest Florida" sits inside the map, near the top. |
| Should 11 (s25 labels) | **partly** | 40:22–40:46: "mean −13" now sits at the right end of the dotted line, and "14 points out" counts points. But "+14" has no "m/s", and three new crowding problems appear (R4-2). |
| Should 12 (36-px grey keyword) | fixed | 16:00 crop: "r̂, θ̂ : length 1" is KaTeX at about 50 px, and "wind: its own scale" is about 44 px in key colour. |
| Should 13 (θ = 180° rows) | fixed | 14:57: the rows are up during S4. 15:03: they are gone. |
| Should 14 (α = θ ≈ 53°) | fixed | 28:10. |
| Cosmetic: s05 cos row pages out | fixed | 4:19–4:21.5: "cos θ = 3/5 = 0.6" stays up while "5 × 0.6" is spoken. |
| Cosmetic: s24 sin 135° pages out | fixed | 38:50: "sin 135° ≈ 0.707" is still up. |
| Cosmetic: γ unnamed | fixed | 24:50: "γ : the angle between them". |
| Cosmetic: "+ 90°" spacing | fixed | 9:30 and 14:36.5: "turned by +90°" uses unary spacing. |
| Cosmetic: s20 "r̂" and "x′" touch | not fixed | 28:30 and 29:00: the two tip labels still touch (R4-6). |
| Cosmetic: s09 sparse right | unchanged (intentional) | 8:05–8:35. |

### The user's original notes
- **11:00–14:30 (the 8.7-m slide, and −7 and 5.2): still fixed, no regression.**
  - 13:09 → 13:16.5: the wide view, the zoom box, the "magnified / after 0.1° / before" inset.
  - 13:21 → 13:25.5: Δθ = 0.1° = 0.1 × π/180 ≈ 0.001745 rad.
  - 13:30 → 13:41: r = 5 km = 5000 m, then s = rΔθ = 5000 m × 0.001745 ≈ 8.7 m, with the gold slide labelled "≈ 8.7 m".
  - 13:50: (x, y) = (r cos θ, r sin θ); before θ ≈ 53.13°, (3000, 4000) m.
  - 13:55.5 → 14:00: x = 5000 × cos 53.2301° = 5000 × 0.598603 ≈ 2993.0 m; y ≈ 4005.2 m; Δx = 2993.0 − 3000 = −7.0 m (west).
  - 14:03.5: Δy = +5.2 m (north).
  - 14:03.5 → 14:13: √(7.0² + 5.2²) = √(49 + 27.04) = √76.04 ≈ 8.7 m = s, each row on its words.
  - 14:21 → 14:24.4: −7.0/8.7 ≈ −0.80 and 5.2/8.7 ≈ 0.60, then θ̂ ≈ (−0.80, 0.60) ✓.
  - 14:26.5–14:37.5: the keep picture (r̂ out, θ̂ round, the +90° arc, "anticlockwise, seen from above").
  - 11:00–12:51 (the (−4, 3) checks, θ̂ by the swap rule and by the turned triangle, θ = 0° and 90°) is unchanged and complete.
- **13:06 hat: fixed.** At 13:05 and 13:07, "without the θ̂ formula" is KaTeX with the hat over the θ.
- **15:23 hat: fixed.** At 15:23 and 15:45, θ̂ and r̂ in the picture and in "r̂, θ̂ : length 1" are KaTeX.
- **43:15 rings (end card, 43:30–43:55): fixed.** The 43:50 crop shows the rings and both arrows inside the second box with at least 25 px of margin. The fourth icon's arrow tip is about 30 px below the box top. 43:15 itself is the recap: "35 m/s round, 13 m/s in, ≈ 21°", with the source line and the colour bar.

### Regressions and sweep (part1_lessons_checklist A–E)
I looked at the touched scenes (s05, s06, s11, s12–s15, s17, s18, s20–s26) and at the 30-s sweep.

- **A (calculations).** Every spoken number has its inputs on screen. I recomputed:
  - 0.866 × 3 + 2 = 4.598;
  - −1.5 + 3.464 = 1.964;
  - (−8)(−0.8) = 6.4;
  - (−10.1)(−0.707) = 7.14 and (−44.5)(0.707) = −31.46, giving −24.3;
  - 7.14 + 31.46 = 38.6;
  - 13.3/34.8 = 0.382, so tan⁻¹ = 20.9°.

  All match the screen.
- **B (pictures follow the voice).**
  - The s14 and s20 keep pictures now show their key idea.
  - No row vanishes before it is spoken.
  - Exceptions:
    - R4-1: s12 labels sit on the radius line, and one tip label is outside the safe area.
    - R4-4: the s20 θ arc has no rays.
    - R4-5: "≈ 21°" in the s26 picture comes about 2.5 s early.
- **C (symbols).**
  - Hats and primes are correct everywhere I looked.
  - The remaining plain-font maths is an unaccented α or θ in sans: R4-3 in s16, and the R4-7 list.
- **D (colours and data).**
  - Every HRRR frame has its source line and colour bar (30:35, 31:50, 33:25, 36:05, 37:05, 39:05, 40:35, 43:15).
  - u_θ is teal and u_r is rose. The wind and the radius are ink.
  - The recap is at full contrast (42:15–43:05).
- **E (skip guidance).**
  - Chips at 8:10, 15:23, 19:05 and 36:05 point to 14:26, 18:53, 29:57 and 38:58.
  - These match the keep lines (14:26.05, 18:53.55, 29:57.05, 38:58.12).
- **No new overlaps** in the fix-3 changes, apart from the s25 crowding in R4-2.
- **Physics (unchanged, re-seen):**
  - The NH storm turns anticlockwise, seen from above (32:29).
  - u_r is negative and inward.
  - Rising air on the plan view is drawn as ⊙.
  - Bearing 37°; "a west wind blows east".

### MUST fix
None.

### SHOULD fix (5; none blocks the user's viewing)
1. **R4-1 · 14:43–14:58, s12: the moving "θ = 0°", "θ = 90°" and "θ = 180°" labels sit on the grey radius line, which strikes through them (14:45, 14:50, 14:55). At θ = 180°, the "r̂" tip label sits at x ≈ 10–36, outside the x ≥ 60 safe area (14:53–14:58).** This is old code that was not changed in fix 3; it shows only between sentence ends, so earlier reviews missed it.
   - **Fix** (`cf_sB.tsx` line 553): offset the label 40 px off the radius, along the perpendicular (b − er·100 + et·40), and set it in TeX: `\theta=0^\circ`.
   - For θ = 180°, place the r̂ tip label above its arrow, or shorten L12 so the tip stays at x ≥ 60.
2. **R4-2 · 40:10–40:46, s25: graph labels crowd (crop 40:35).**
   - "17" (teal) and "+14" (rose) sit side by side at x 1268–1398 and read as "17+14".
   - "14 points out" sits on the plot's bottom frame line (y −50) and over the dashed u_r curve.
   - "mean −13" begins about 8 px after "out".
   - "+14" still has no unit (review-3 Should 11).
   - **Fix:**
     - Move "17" below its trough (y + 40), or move "+14 m/s" to the right of the u_r peak (θ ≈ 230°).
     - Raise "14 points out" by 30 px, above the frame line, inside the shaded band.
     - Start "mean −13" at least 24 px right of "out", or put it under the dotted line at the right end.
3. **R4-3 · 20:44–21:39, s16: "sin α (west)", "cos α" and "(north)" are bold sans with a sans α, stacked in one 3-line block about 15 px apart, beside the KaTeX α of "ŷ′ = (−sin α, cos α)" (crop 20:56).** This is the same two-font problem as review-3 Must 2, for α. The block also leaves unclear which label belongs to which leg.
   - **Fix** (`cf_sB.tsx`, S16 labels): set them in TeX, `\sin\alpha\ \text{(west)}` and `\cos\alpha\ \text{(north)}`.
   - Put the sin label above the dashed top leg, and the cos label right of the vertical leg at its midpoint, with at least 24 px between them.
4. **R4-4 · 30:03–30:10, s20 keep picture: the θ arc at the station has no east ray and no radius to the balloon, so it floats beside the station mast like a bracket (crop 30:09.5; checklist B2).**
   - **Fix** (`cf_sB.tsx` S20 keep): draw the dashed east ray from the station and the faint radius line to the balloon, both visible while "turned by θ" is shown.
5. **R4-5 · 41:16–41:19.5, s26 S5: the picture's "≈ 21°" replaces "inflow angle" at about 41:16, about 2.5 s before the voice says "twenty one" and before the row "≈ 20.9° ≈ 21°" (41:19.5).** The result appears before its arithmetic (checklist B3).
   - **Fix** (`cf_sC.tsx` S26): give the picture label the same `appear` as the "≈ 20.9° ≈ 21°" row, i.e. AT(k, 5, "twenty one").

### COSMETIC (optional)
6. 28:15–29:56, s20: the "r̂" and "x′" tip labels still touch. Offset x′ by 30 px along the axis.
7. Some unaccented Greek letters are still in the sans font next to KaTeX:
   - "θ" and "α" in the s26 four-angle icons (41:23–41:55);
   - "θ round the eye (°)" on the s25 axis;
   - "θ = 53°" in the s13 inset;
   - the s05/s07/s08 triangle "θ" labels.

   They read correctly. For full C1 consistency, set them in TeX.
8. 42:50, s27 S7: the u_r and u_θ shadow bars are drawn at reduced strength (dull rose and teal) while their sentence is spoken. Raise them to full strength like the other recap beats.

### Limits
- I did not listen to the audio. The narration is unchanged since fix 2.
- Motion was sampled: densely in U1, s26 S5–S10 and s12, and every 30 s elsewhere.
- No colour-blind simulation (accepted in review 1).

**Disk.** C: 112 GB free, G: 475 GB free. `review4/` holds 72 MB of frames (ignored, not committed).

### Overall: PASS with notes (#5a fix 3 review 4: 0 Must, 5 Should, 3 Cosmetic)
- All 6 review-3 Musts are fixed, along with 13 of the 14 Shoulds (Should 11 partly) and 4 of the 6 cosmetic items.
- The user's four notes are fixed, with no regressions.
- `qa.json` is 15/15, and `halves` passes.
- The maths, the physics and every on-screen number check out.
- Nothing left is wrong for a learner. R4-1 and R4-2 are label-placement nits, legible but crowded, worth a TSX-only touch if s12, s16, s20, s25 and s26 are re-rendered for another reason.
- **Ready for the user to watch (`qa_pass`).**
