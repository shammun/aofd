# ch00_coordinates_routes (#5f, Coordinates Part 6): remake 2026-11-07 log

**Brief.** These sources were read:
- `movies/ch00/coordinates_series/master_plan_2026-11-07.md` (R1, R3, R16, R19, §C);
- `continuity_plan.md` (§3: the 5f recall table and teaser; §5 titles; §6 endings; §7: the 5f work list);
- `fact_check_2026-11-07.md` (Part 6: every row is OK, so there was no non-OK row to apply);
- `series_audit_2026-11-07.md` (no 5f-specific row besides the plan housekeeping);
- `user_feedback_2026-11-06.md`;
- HOUSE_STYLE §3, §4 and §6 (calculations);
- the memory rules dont-voice-simple-arithmetic, natural-openings, no-opening-recaps, verify-every-fact and movie-spoken-wording.

**Reference.** Part 4's remake (`ch00_coordinates_frames/remake_2026-11-07_log.md`) and its tools: `fr_r7_splice.py`, `final_timing.py`, `fr_words.py`, `fr_mix.py`, `fr_run.py`, `kit_fr/SeriesTitle.tsx` (= Part 2's kit_cs), and `Recall` / `HL` / `$…$` labels in fr_lib. Part 3's `voice_ok.py` was also used (lock rule).

**Start state.** The light-phase build of 2026-11-05 (calc audit and Part 1 lessons). **No final TTS had ever run for 5f.**
- timing.json was PROVISIONAL (dryrun2_spliced, 1019.47 s).
- There had been no mix, no stills and no render.

Nothing was committed, rendered or deleted. Pre-remake copies are in the session scratchpad at `rt_before_r7/` (script, storyboard, timing, manifest, the TSX files and the builder); git HEAD holds them too.

## 13:16 start
- Disk (`tools/disk_guard.py --report`): **C: 116.1 GB free, G: 434.6 GB free**. Project data is 151.68 GB of 150 (scratch 111.62). Per the no-G:-cleanup rule, nothing was cleaned.
- Locks:
  - HEAVY.lock was held by "#5a fix1107 TTS splice + word times" (13:15), then by "#5b r8 SSR + K6" (13:29);
  - VOICE.lock was held by "#5c remake r7 TTS splice" (13:17), then by "#5a fix1107 sound10 mix" (13:25).
  - So all static work came first.
- **Old render chunks:** `G:/…/scratch/movies/ch00_coordinates_routes/build1/` holds `public/` (rt_bmng.jpg), `tmp/` and `tsc.txt` only. **There is no `render/` folder and there are no old chunks** (5f was never rendered).

## 13:20 narration (`checks/r7_text.py`, idempotent; script.md + storyboard voiceovers)
`tools/script_wording_lint.py` found **6 → 0 findings**.

| Scene | Change | Rule |
|---|---|---|
| s00 | "…routes across our round Earth and the coordinates behind them, and see how they're used to plan the shortest flights." Removed: "how meteorology and aviation use them". | R1, natural openings |
| s01 S2 | "Now let's dive into the pieces we need: scale factors, which turn a change in latitude or longitude into kilometres, and the great circle, the shortest route over our round Earth." S0, S1 and S3 are re-used. | natural openings |
| s02_part5_recap | **Cut.** Its facts are now recalled at their point of use (below). | §C, no-opening-recaps |
| s04 S1 | "In Part 1, we found the arc rule: …" | R16 |
| s04 S5–S7 | "On the Earth, as we found in Part 3, stepping north by a small change in latitude, delta phi, walks the Earth's radius times delta phi." Then a new S6: "So the scale factor of latitude is the Earth's radius, which we write as the letter a, about six thousand three hundred and seventy one kilometres." (the letter a was in the cut s02). In S7, "a small change in longitude, delta lambda". | R16; input said |
| s04 S11, S13 | The products are no longer read aloud: "walks the Earth's radius times that, about 111.2 km" and "those 111.2 km times the cosine, only about 73.8 km". | show it, don't voice it |
| s06 S10 (new) | "And the puck from Part 4, gliding over a smooth Earth with nothing pushing it, was moving along exactly such a great circle." | continuity §3 (puck payoff) |
| s08 S8, S12, S13 | "the second part, cosine phi times sine lambda, is about …" and similar: says what is multiplied, not the products. | show it, don't voice it |
| s09 S4–S5 | Five sentences (three products, the sum, the result) became two: "…we multiply London's first part by Los Angeles' first part, then the second parts, and then the third parts, and add the three products." and "That gives about 0.195, so the cosine of sigma is 0.195." | show it, don't voice it |
| s10 S2, S3, S5 | "So sigma, 78.738° to be exact, is about 1.3742 radians" / "the Earth's radius, 6371 km, times sigma in radians" / "every degree of sigma is about 111.2 km, so 78.74 degrees make about 8756 km …" | show it, don't voice it |
| s11 S5 (new) | "That heading comes from London's own east and north arrows, from Part 4: we measure how much of Los Angeles' position arrow points along each one, and turn that into a compass bearing." This voices the audit-F1 rows as what is combined. | R16, show it, don't voice it |
| s12 S5 | "Dividing the rhumb line's length by the great circle's gives about 1.11 …" | show it, don't voice it |
| s13 S12 | **Cut** ("We'll see why that map makes rhumb lines straight in Part 7 …"). The teaser is now said once, in the recap. | continuity §6 |
| s14 S7–S8 | The two-sentence teaser: "In Part 7, we'll flatten the Earth onto maps, and work out exactly what each map stretches. That explains why the rhumb line comes out straight on the most famous map of all, and why weather data on a grid need care near the poles." | R3, continuity §3 |

**Splice plan** (`checks/rt_r7_splice.py --plan`): 15 scenes and 131 sentences; **110 re-used** measured clips (dryrun2) and **21 new**. The three sentences that had only been estimated before (s00, s10 S2, s10 S5) are all among the new ones.

### Fact table (new or changed claims, checked before TTS)
| Scene | Claim | Verdict | Source |
|---|---|---|---|
| s00 | Routes and coordinates "are used to plan the shortest flights" | OK | Great-circle routing in flight planning (Part 6 fact row script.md:164, OK) |
| s04 S1 | Part 1 found the arc rule (arc length = radius × angle) | OK | Part 1 script: "the arc length, is the radius times the angle"; "By the arc rule, s equals r times the change in theta" |
| s04 S5–S6 | Part 3: Δy = a Δφ; the radius is called a, 6371 km | OK | Part 3 script: "delta y, the distance north, equals the Earth's radius times delta phi"; "it gets its own letter. We call it a." DM01 a = 6371 km |
| s06 S10 | Part 4's puck, gliding over a smooth (non-spinning) Earth with nothing pushing it, moves along a great circle | OK | Part 4 script s26: "Imagine a puck gliding over a smooth Earth that doesn't spin, with nothing pushing it … The puck goes straight, along a great circle, which we'll meet in Part 6". Physics: force-free motion on a sphere follows a geodesic. |
| s08 S4 | The position arrow comes from Part 3 | OK | Part 3 script: "Two slices give the position arrow …"; "Take the arrow to Brest, but shrink it to length one." |
| s11 S5 | The heading comes from London's east and north arrows (Part 4) and the parts of r̂₂ along them | OK | Part 4 script "I hat points east, j hat points north …"; builder DM20 (F1 rows: e = −0.731, n = 0.654 → 312°) |
| s14 S7–S8 | Part 7 flattens the Earth onto maps and shows what each stretches; the rhumb line is straight on Mercator; grid data need care near the poles | OK | Part 7 script s03–s12 (projections, "stretches east-west by one over cosine phi", "can never show the poles", "Now we can see why a rhumb line is straight on a Mercator map") |
| all | Numbers re-voiced (0.195, 78.7°, 1.3742, 6371, 8755/8756, 1.11, 11 %) | OK | Builder CHECK rows DM09–DM13, DM17 (57/57 pass) |

## 13:28 composition (static): `rt_lib.tsx`, `rt_sA/B/C.tsx`, `kit_rt/SeriesTitle.tsx` (new; a copy of Part 4's), `CoordinatesRoutes.tsx` (doc comment)

**rt_lib.** Ported from Part 4's fr_lib:
- `AT()` timed from the Kokoro word timestamps when `rt_words.py` has found the phrase (otherwise the character estimate);
- `HL()`, the gold glow on a word;
- `Recall`;
- `$…$` maths in `Lbl` / `Keyword` (MathLbl).

**s00.** The `SeriesTitle` layout:
- "Coordinates" (150 px, gradient), pulsing on "coordinates";
- "Part 6 · Routes";
- "great circles" / "and rhumb lines". It is two lines because one line is 1004 px, wider than the 975-px column.
- The old 150-px "Part 6" gradient line and the "Routes" pulse are gone.
- Part B cross-fades on "they're used". The globe and plane animation is unchanged.

**s01.** No picture change. tSail is still S3.

**s02.** The component was removed.

**s03.** Gold "Part 1", "Part 2" and "Part 3" tags (y 565) sit under the three systems' names.

**s04.**
- Recall "s = r Δθ" + "derived in Part 1: arc length" (y 200). "r × the step" moved to y 360.
- Recall "Δy = a Δφ, Δx = a cos φ Δλ" + "derived in Part 3: distances" (y 560).
- "a ≈ 6371 km" (y 720), glowing on "six thousand".
- "1° = 0.01745 rad" and "cos 48.4° ≈ 0.664" glow on their words.
- The CalcStack rows cue on the new words.
- The θ:/φ:/λ: tags are drawn in KaTeX.

**s06.** A teal puck dot glides along the great circle from S10; keyword "Part 4's puck: a great circle" (gold, y 530).

**s07.** "Part 1:" became the series keyword "derived in Part 1: arc length" (gold).

**s08.** Gold "derived in Part 3: position vector" (y 450). The trig inputs glow on their words: cos 51.51° row, sin(−0.13°), LA's cos φ / cos λ / sin λ, and both third parts.

**s09.**
- The products appear on "London's first part" / "then the second parts" / "then the third"; the sum on "add the three products".
- "≈ 0.195" and "σ ≈ 78.7°" glow.
- The keyword is now "rule from the dot product movie".

**s10.** "1° … ≈ 0.01745 rad", 6371 and "≈ 8755 km" glow on their words. The quick-check row cues on "make about eight thousand".

**s11.**
- Recall label "derived in Part 4: local east and north" (y 410, two lines).
- The audit-F1 stack moved to y 540 and is cued on S5's words (î₁ ĵ₁ → e, n → tan β → 312°, which glows). The vertex rows are on S6 (62.4° glows) and the LA rows on S7 (214° glows).
- **Fixed a latent overlap:** the WSW Mercator chart's label "flat map: west-south-west" (y 519) was on screen while the F1 stack's first row sat at y 500. The chart now leaves before S5.

**s12.** "+11 %" glows. tR is cued on "gives about one point".

**s13.** The keyword "Part 7: maps" (was on the cut sentence) is now "why straight: Part 7", 1 s after "a straight line".

**s14.** t[0..8]. The teaser beat is S7–S8; "care near the poles" (y 815) appears on S8.

**s15.** The whole end card fades out with the music over the 75-frame hold (`1 − ramp(LEN − HOLD, LEN − 4)`, = Part 4's s29) (R3).

**Symbol lint C5** (newer than 5f's last pass) had 9 findings; it now has 0.
- σ labels → `$\sigma$`; "r × the step" → `$r\times$ the step`.
- θ:/φ:/λ: → TeX.
- Compass "N": `lint-ok`, because it is the compass letter.

**Data builder.** `CHAPTERS` lost the s02 mark. The two "s02" calls are re-labelled s04 / s08 (Part 3 recalls).
- Run: **57/57 CHECK pass, 0 flags**.
- **rt.json byte-identical** (sha256 bbb80aad…70b5).
- The manifest has refreshed chapter marks (provisional).

**Storyboard** (`checks/r7_storyboard.py`, idempotent): s00 visual; a "REMAKE 2026-11-07:" note on 13 visuals; s04 calc_rows; title_card; `remake_2026_11_07` record; cross_part (Part 4 use, teaser_in / teaser_out); audio.music (chart-voyage, fade); chapter marks without s02; the "letter a" convention.

**Provisional timing** (`rt_r7_splice.py --provisional`): re-used clip lengths, plus the new sentences at 14.64 chars/s.
- **964.129 s + 2.5-s hold = 966.63 s (16:06.6)**, was 17:00.
- 131 sentences, 2386 words, 19 beats, **148.1 wpm** overall (limit 150).

### Static gates (on the provisional timing)
| Gate | Result |
|---|---|
| tsc (whole project) | **0 errors** |
| at_check | **188 refs, 0 failures** |
| swap_check | **164 text elements, 0 text-over-text, 0 swaps < 8 frames**. Three false positives from `$…$` labels were removed by drawing the tags in TeX. |
| cam_speed | **0 above 90 °/s** (s07 peak 57, s13 32) |
| movie_symbol_lint --strict | **0** (1 lint-ok: compass N) |
| eq_check | 6 storyboard equations, 0 missing, 7 constants, 0 unused |
| script_wording_lint | **0** (was 6) |
| r7_text --check / splice --plan | OK, 15 scenes / 110 re-used + 21 new |
| final_timing --recue (dry, on the provisional file with dur = end − start) | cue rules OK. The real run follows `--final`. |

## 13:36 heavy-job tooling (static), then queued
**Tools** (ported from Part 4, names and paths substituted):
- `checks/rt_r7_splice.py`: OLD = dryrun2, dryrun1, mini_s02. One source per scene: dryrun2.
- `checks/final_timing.py`: adapted to this storyboard's `maths_skip.blocks` and top-level `chapter_marks`; the keep line is s11 S0.
- `checks/rt_words.py`.
- `checks/rt_mix.py`: chart-voyage has no scene-timed layers. It refuses if the style ever gains one.
- `sound.yaml` (new): chart-voyage, seed 29, bed −28 LUFS, duck 5 dB, tail 2.5 s, no effects.
- `checks/rt_run.py`: frames / stills / render / join. DENSE = every changed scene.
- `checks/label_stills_rt.mjs`.

**`checks/rt_lockgate.py`.** This is the lock protocol of 2026-11-07, as tightened.
- **voice** may start only if HEAVY.lock is free, or is held by a full render (owner says "render" and none of K6 / still / SSR), with ≥ 8 GB RAM free.
- **heavy** may start only if both HEAVY.lock and VOICE.lock are free.
- **Part 6 goes after Parts 1–5.** While any lock owner names #5a–#5e, the gate says "not yet" and stamps the time. It waits until 15 min pass with no #5a–#5e owner, or until the orchestrator creates `G:/…/scratch/movies/ch00_coordinates_routes/GO`.
- `…/ch00_coordinates_routes/CANCEL` stops it (exit 2) before any lock is taken.

**`checks/r7_queue.sh`** (started detached by `checks/r7_queue_start.ps1` at **13:39:06**, pid 40528; log `G:/…/scratch/movies/ch00_coordinates_routes/r7_queue.log`; it reports "phase V queued 13:39:08"):
- **Phase V, under VOICE.lock:**
  1. any old r7/tts is moved aside;
  2. splice r7;
  3. `final_timing --final`;
  4. `rt_words` (Kokoro word times; AT ±0.5 s);
  5. `--recue --write` (no cue splits a number);
  6. at_check, swap_check, cam_speed, eq_check and the builder on the final timing;
  7. mix into `build1/sound` (any old one moved aside);
  8. ebur128;
  9. the wav is copied into `build1/public`;
  10. disk.
- **Phase H, under HEAVY.lock with VOICE.lock free:**
  1. disk_guard;
  2. SSR 2-D and --3d;
  3. the K6 frame list;
  4. bundle + K6 stills `build1/stills/r7` (2 jobs);
  5. `tools/k6_overlap.py` → `k6.json`;
  6. disk_guard.
- **No render.** CANCEL is checked between steps.

## 13:39 state at hand-back
- Disk: **C: 124.6 GB free, G: 465.7 GB free** (shutil, after the static work).
- K6 table, mix numbers and the final length are **pending**. They are filled in by the queued run, from `r7_queue.log`, `build1/sound/sound.json` and `build1/stills/r7/k6.json`.

**Render (orchestrator, after the queue's phase H passes and the stills are looked at):**
```
.venv/Scripts/python.exe movies/src/ch00_coordinates_routes/checks/rt_run.py render --conc 2
.venv/Scripts/python.exe movies/src/ch00_coordinates_routes/checks/rt_run.py join --mb 150
.venv/Scripts/python.exe tools/movie_qa.py "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_routes/build1/build1_1080.mp4" --storyboard movies/ch00/ch00_coordinates_routes/storyboard.yaml
```
- Composition `Ch00CoordinatesRoutes`; 4000-frame chunks into `build1/render/`; TEMP on G:; it stops below 45 GB on C:.
- It needs `build1/bundle/public/narration_music_rt.wav`, which phase V and phase H's bundle provide.
