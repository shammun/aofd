# Chapter 0 (PoC D) — movie review                                       2026-10-21

Reviewer: movie-reviewer (fresh eyes; viewed the movie only as frames). Inputs: `movies/out/poc/{1080.mp4, poster.jpg, en.vtt, en.srt, index.html}`,
`movies/poc/{storyboard.yaml, script.md, timing.json, manifest.json}`, `reports/movies/poc_coriolis_turntable/{qa.json, contact_sheet.png, frame_*.png}`,
page images `chapters/pages/ch02/p077.png` (2.12) and `p089.png` (2.80).
Extra frames: `reports/movies/poc_coriolis_turntable/review/`. These are 640-px frames at 0.0, 0.5, 5.8, 6.0, 6.1, 6.5, 10.5, 11.0, 11.2, 11.5, 12.0, 12.5, 13.0, 14.0,
14.5–18.2 (every 0.5 s), 18.5, 19.0 and 19.5 s, plus crops of the end strip from 18.3 to 19.95 s. They are tiled in `tile_cuts.png`, `tile_s3.png` and `tile_end.png`.

| movie | duration | size | qa gates | physics | equations | legibility | pacing | captions | access | badges | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| poc_coriolis_turntable | 20.01 s (target 20.0 ± 0.1) | 3.38 MB (≤ 4) | 10/10 PASS | PASS | PASS | **FIX** (small text at 640 px) | PASS | PASS | PASS | PASS | **FIX** (minor; one re-render) |

## poc_coriolis_turntable

### qa.json
The duration, size, codec (H.264 High, yuv420p, AAC, faststart), black, frozen, loudness (−16.1 LUFS, −4.5 dBTP), flashes (0/s), captions,
physics (4 functions re-run with matching hashes) and equations gates all PASS. `pass: true`.
- NOTE (tooling): the equations gate counts "1 storyboard equation". It checks only `on_screen_eq` and skips `on_screen_eq_extra` (2.80).
  I checked (2.80) by eye (see below). `movie_qa.py` should also check the extra equations.
- NOTE (provenance): manifest `fluidpy.dirty: true` and `frames_py_tracked: false`. The hashes match, but the code that produced them is
  uncommitted (sha256 a52b5838…). Commit `fluidpy/geo/frames.py` before any public release, so that the manifest points at a real SHA.

### Physics honesty: PASS
- 00:00–06:03 (s1, room view). The puck leaves the centre in frame 0 (hook) and its trail is a dead-straight horizontal segment, 0.9 m at 5.9 s.
  The orange rim mark moves anticlockwise: at 5.9 s it sits at 169° from east, which equals Ωt = 0.5 × 5.9 rad.
  The chips "no horizontal force acts" and "table spins anticlockwise (seen from above) — like the Northern Hemisphere" are present. PASS.
- 06:03–11:17 (s2, table view). The trail bends to the RIGHT of the motion (clockwise seen from above).
  At 8.6 s (table time 3.4 s) the puck is at (−0.07, −0.51) m and at 11.1 s it ends at (−0.89, −0.13) m.
  Both positions match r_R = 0.15 t (cos Ωt, −sin Ωt) and the manifest spot values. The mark is missed.
- Violet Coriolis arrow. I checked its direction against v_R in three places, and each time it is 90° to the right of the velocity:
  - 6.1 s: south, for an east launch.
  - 8.6 s: (−0.37, 0.93), against an expected (−0.39, 0.92).
  - 10.5 s: up and to the right, for a velocity up and to the left.
  The chip says "length not to scale". PASS.
- Centrifugal force is acknowledged in two places:
  - the bottom-left chip in s2, "centrifugal also acts here (at most half the Coriolis push)";
  - the centrifugal term with its underbrace in (2.12).
  The caption "both are apparent ('as if') forces, seen only from the rotating frame" is on screen from 15.0 s. PASS.
- The inset "room view: still straight" in s2 (8.6 s and 11.0 s) shows the s1 line with the mark at Ωt. PASS.
- Globe (15.5–20 s):
  - f > 0 in the NH (violet), the dark neutral band at the equator is labelled "equator: f = 0", and f < 0 in the SH (green).
  - The readouts are correct: 90°N 1.46×10⁻⁴, 45°N 1.03×10⁻⁴, 0° 0, 45°S −1.03×10⁻⁴ s⁻¹. The colour bar is symmetric at ±1.46×10⁻⁴.
  - "NH: turns right / SH: turns left" is correct.
  - "~10 000× faster" is consistent with 1/1.03×10⁻⁴ ≈ 9700.
  - No puck on a sphere is drawn (decision Q2 respected). PASS.

### Equation fidelity: PASS
- (2.12) on screen: (dv_R/dt)_R = (dv_I/dt)_I − 2Ω×v_R − Ω×(Ω×r).
  It matches p077 symbol by symbol: upright d, bold italic v, r, subscripts R/I, and both minus signs. The tag "(2.12)" is shown and KaTeX shows no error box.
- (2.80) on screen: f = 2Ω sin ϑ. This is the exact first part of (2.80) on p089, as the storyboard declares. The tag "(2.80)" and "ϑ = latitude · Vallis §2.3" are shown.
- NOTE (cosmetic, no fix needed): the bold Ω is rendered upright, while the book uses bold italic. The symbol is the same.
  `\boldsymbol{\varOmega}` would match the page exactly.

### Legibility at 640 px: FIX
- **FIX 11:20–20:00 — the "(2.12)" tag is about 20 px tall at 1080p, so about 7 px at 640 px wide. It is unreadable on a phone.**
  Make it the same size as "(2.80)" (about 30 px), or larger.
- FIX (minor) 17:00–20:00 — the text under the globe is about 22–24 px at 1080p (about 7–8 px at 640 px) and is hard to read on a phone:
  the colour-bar ticks "−1.46×10⁻⁴ / f [s⁻¹] / 1.46×10⁻⁴", the readout row, and the table-vs-Earth inset line.
  Raise it to ≥ 28 px, or drop the colour-bar tick labels, which repeat the readout row.
- NOTE: the s2 footnote chip "flat table: centrifugal also acts here …" (6:03–11:17) is about 24 px. It is legible at 640 px, but only just.
- NOTE: "NH: turns right" ends at x ≈ 1890 of 1920 (17:00–20:00). It is not clipped, but it sits outside the 5 % title-safe margin.
  Move the hemisphere labels about 60 px to the left.
- No overlaps were found. The s2 Coriolis arrow never covers labels. The end strip (18.5–20.0 s) is clear and does not cover the equation.

### Pacing: PASS
- The cuts at 6.03 s and 11.17 s come 0.4 s before the first sentence of the next scene ("Now ride with the table" starts at 6.425 s; s3 at 11.55 s).
- "It curves to the right" (8.8–10.75 s) plays while the curve is being drawn. The playback is 6 s of table time in about 4.5 s, then a hold to 11.17 s.
- In s3 the equation builds term by term: LHS at 11.5 s, Coriolis term at about 12.5–13.0 s (while "minus two Omega cross v" is spoken), centrifugal at about 14.0 s.
- The f line and the globe fade in at about 15.0–15.5 s, with "On Earth, f is…" (15.5 s). The labels and readouts follow by about 17.0 s.
- NOTE: from 11.2 to about 15.0 s the right 40 % of s3 is empty. This is acceptable for 20 s, but a full-length movie should fill it, or centre the equation until the globe arrives.
- NOTE: the globe's spin is hard to see, because the bands are zonally symmetric and the graticule is faint. The "one turn per 10 s" label claims a motion the viewer cannot see.
  A brighter meridian or one marked longitude line would show it.

### Captions: PASS
- There are 6 cues. Their text matches `script.md` word for word and the cue times match `timing.json`; the audio runs to 19.3 s and the last cue ends at 19.0 s.
- Every cue is one line; the longest is 39 chars ("On Earth, f is two Omega sine latitude.").
- Reading speed is 10.6–14.1 cps (the highest is cue 2, 32 chars in 2.275 s). Cues last 1.9–3.6 s. The SRT is identical to the VTT.
- Captions are a separate track (`<track default>` in index.html), not burned in.

### Accessibility: PASS
- The diverging map is violet (+) / green (−) with a dark neutral centre. It is PRGn-like, so the two signs differ in hue and lightness, and they are not red/green.
  The labels name each hemisphere in text as well.
- The orange mark and the teal and violet strokes are distinguishable. There are no flashes (QA 0/s; the s2→s3 hard cut goes dark to darker, not a flash) and no full-screen noise.
- index.html has no autoplay, uses `preload="metadata"`, and has a transcript below the video.

### Not-to-scale badges: PASS
- s1: "table 0.5 rad/s, Earth 7.29×10⁻⁵ rad/s; puck drawn 6 cm wide".
- s2: the same, plus "time ×1.33", and the arrow chip says "length not to scale".
- s3: "globe spins 1 turn per 10 s (Earth: 23 h 56 min)", and the table-vs-Earth inset gives the ~10⁴ ratio.
- Every exaggeration listed in the storyboard is covered.

### Integrity: PASS
- No book scans, crops or quoted text. The narration is in our own words.
- The end strip is "Explore it: Coriolis globe explainer · Chapter 0B notebook · Coriolis block". It is text only, with no URL to check. The links in the PoC index.html (MP4, SRT) resolve locally.

### Verdict: FIX (one re-render)
Enlarge the (2.12) tag and the text under the globe. The physics, equations, captions, pacing, badges and accessibility are all correct.

## Overall: FIX

## Re-review (2026-10-21, after fix loop 1)
Movie: `movies/out/poc/1080.mp4` (rendered 01:53). 20.011 s, 3.51 MB. qa.json is 10/10 PASS, and the equations gate now reports "2 storyboard equation(s) present".
Frames: `reports/movies/poc_coriolis_turntable/review/rr640_{9,12,15,17.5,19.5}.png` and `rr1080_*.png`. Heights are ink heights measured by row scan in the 1080p frame; dividing by 3 gives the height at 640 px.

| item | before | now (1080p ink → 640 px) | target | result |
|---|---|---|---|---|
| "(2.12)" tag, 11.2–20 s | ≈ 20 px → 7 px | 29 px → ≈ 10 px (font 33 px) | ≥ "(2.80)" = 29 px | PASS (same size as "(2.80)") |
| colour-bar ticks "f < 0 / f > 0" | 22–24 px | 21 px ink (no descender), font 28 px | font ≥ 28 px | PASS |
| readout rows (90°N…, 0°…) | 22–24 px | 24 px ink, font 28 px → ≈ 8 px | font ≥ 28 px | PASS (readable in rr640_17.5) |
| table-vs-Earth line | 22–24 px | 24 px ink, font 28 px | font ≥ 28 px | PASS |

Regression check:
- Physics: s2 still curves to the right, and the Coriolis arrow is perpendicular, on the right of the motion (rr640_9). The room view is straight. The table is labelled anticlockwise (NH). The globe reads "NH: turns right / equator: f = 0 / SH: turns left", with f > 0 violet and f < 0 green. The readouts are unchanged (1.46×10⁻⁴, 1.03×10⁻⁴, −1.03×10⁻⁴ s⁻¹, about 10 000×). "Apparent ('as if') forces" is still on screen.
- Badges: "not to scale" appears in all three scenes (contact sheet). s3 now shows the plain globe from 11.2 s, so the earlier "empty right 40 %" note is resolved. The hemisphere labels now sit at x ≈ 1330–1600, inside title-safe, so that note is resolved too.
- Captions: `en.vtt` and `en.srt` have mtime 01:08, from before the re-render. The 6 cues are the same, and the captions gate is PASS.
- No new overlaps. The end strip (19.5 s) clears the f equation and the readouts.
- NOTE (no action needed): the "Coriolis" and "centrifugal" underbrace labels are about 24 px at 1080p (≈ 8 px at 640). They are legible, and their size has not changed since round 1.

### Verdict: PASS (becomes `qa_pass`; the user watches the movie before `/approve-movie`)
## Overall: PASS
