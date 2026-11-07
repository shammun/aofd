# ch00_coordinates_moving (#5e, Coordinates Part 5): remake 2026-11-07 log

Brief: `movies/ch00/coordinates_series/master_plan_2026-11-07.md` (R1, R3, R16, R19, §C), `continuity_plan.md` (§3 5e recall table + teaser,
§5 titles, §6 endings, §7 5e work list), `fact_check_2026-11-07.md` (Part 5 rows), `series_audit_2026-11-07.md` (P5: spoken "Step one … five"
in s04, s05, s14; §3a: s10 recall of the vectors movie's storm-relative wind, s14 recall of grad p), `user_feedback_2026-11-06.md`,
HOUSE_STYLE §3/§4/§6 incl. the rules of 2026-11-07 (no opening recap; natural openings; show the arithmetic, voice the meaning; label numbers
without clutter; say + highlight non-obvious inputs; word-timed reveals; no caption cue splits a number). Memory rules: dont-voice-simple-
arithmetic, natural-openings, no-opening-recaps, verify-every-fact, movie-spoken-wording. Pattern: Part 4's remake (`…frames/remake_2026-11-07_log.md`,
`src/ch00_coordinates_frames/checks/`), Part 2's `kit_cs/SeriesTitle.tsx` and `Recall`.
Start state: the calc-audit + Part 1-lessons build of 2026-11-05/06. **No final TTS ever ran for 5e**: timing.json was PROVISIONAL (dry runs
dryrun1 / splice2 / splice3 in Part 4's scratch + 5 estimated sentences), 1327.744 s. No mix, no stills, no render.
PHASE = source work only. Nothing rendered, nothing committed, nothing deleted (pre-remake copies in the session scratchpad `mv_before_r7/`; git HEAD has them too).

## 13:22 start
- Disk (`tools/disk_guard.py --report`): **C: 116.1 GB free, G: 434.4 GB free**; project data 151.68 GB of 150 (scratch 111.62; over the cap
  because of scratch; user rule: no G: cleanup).
- Locks: HEAVY.lock "#5a fix1107 TTS splice + word times" (13:15), later "#5b r8 SSR + K6"; VOICE.lock "#5a fix1107 sound10 mix".
- **Old render chunks: none.** `G:/…/scratch/movies/ch00_coordinates_moving/build1/` holds `public/` (21 render assets mv_*), `tmp/` only —
  **no `render/` folder** (5e was never rendered). The dry-run clips live in `…/ch00_coordinates_frames/{dryrun1,splice2,splice3}`.
- Found: s00 still drew **'made easy'** (88 px, pulsing) although continuity_plan §5 lists 5e's title as clean — fixed below (R1).

## 13:28 narration (static; `checks/r7_text.py`, idempotent; script.md + storyboard voiceovers)
- **Cut** s02_part4_recap (§C, no opening recap). Its content is recalled at the point of use: D/Dt and the traveller's rate (s06, s14),
  Part 4's i, j (s08), the coast frame (dropped, it is Part 2's).
- **Changed** (16 of 18 scenes; s06, s11, s13 and s18 keep their words):
  - s00 (R1, opening rule): "In this video, we'll learn moving frames, coordinates that travel along with a train or a storm, and see how they're used to find a storm's own winds, and what a barometer sees as it passes."
  - s01 S3/S4 (opening rule): "Now let's dive into moving frames: what changes, and what stays the same, when the frame itself moves." / "Then we'll ride along with a real storm, and see what a barometer on the coast saw as it passed."
  - "Step one …" removed (P5): s04 S5/S6, s05 S3/S4/S6/S7/S9, s14 S3/S6/S8 → "the sum of the two" / Next / First / Then / Now / Finally.
  - Show it, don't voice it: s03 S3, s04 S10, s07 S5/S6/S10/S11/S12, s10 S7, s15 S2/S6/S8, s16 S0 (table below).
  - Recalls (R16): s08 S5-S8 (Part 1 bearing rule, Part 4 local arrows), s09 S1 (Part 1 formulas), s10 S1 (vectors movie), s12 S2 (Part 1 ring
    average), s14 S5 (grad p, cross product movie). s06 and s14 S4 already said "In the derivatives movie, we found …" (kept).
  - s08 S7 says the trig inputs (house rule: say + highlight): "Sine seventy one degrees is about zero point nine four six, and cosine seventy one degrees about zero point three two six, …".
  - s17 S9-S10 (R3) two-sentence teaser: "In Part 6, we'll find the shortest way between two places on the round Earth: the great circle, and the rhumb line that sailors steered for centuries." / "The great circle explains why flights from Europe to California pass over Greenland."
- `tools/script_wording_lint.py` → **0 findings** (before: 11, all "how meteorology uses" / "Step …"). The lint does not catch 5e's voiced
  sums (forms like "X minus Y, over two hours", "add them: …"), so the arithmetic sweep below was done by reading every number sentence.

### Show it, don't voice it: old → new
| Scene S | Old (voiced arithmetic) | New (what is combined + the result) |
|---|---|---|
| s03 S3 | "…sees you moving at twenty plus one and a half: twenty one and a half…" | "…sees your speed and the train's speed added together: twenty one and a half metres per second." |
| s04 S10 | "With our numbers, one and a half plus twenty is twenty one and a half." | "With our numbers, your walking speed plus the train's speed gives twenty one and a half metres per second again." |
| s07 S5 | "…moves east at thirteen point five four minus ten: three point five four…" | "…moves east at the wind's speed minus the pattern's speed: three point five four metres per second, or twelve point seven kilometres per hour." |
| s07 S6 | "…the advection is twelve point seven kilometres per hour, times zero point one one one…" | "…the advection is that speed times the slope of the wind, zero point one one one metres per second per kilometre." |
| s07 S10 | "…a local change of minus thirty six times zero point one one one: minus four point zero…" | "…a local change of minus the pattern's speed times the slope: minus four point zero metres per second, every hour." |
| s07 S11 | "The advection, with the full wind of forty eight point seven kilometres per hour, is plus five point four." | "The advection now uses the full wind, forty eight point seven kilometres per hour, times the same slope, which gives plus five point four." |
| s07 S12 | "Add them: minus four point zero, plus five point four, is plus one point four, …" | "Adding the local change and the advection gives plus one point four, the same as for the rider." |
| s08 S5-S6 | "…its east part is fourteen point six times sine seventy one degrees, about thirteen point eight. Its north part is fourteen point six times cosine …" | S5 Part 1's rule; S6 "the storm's east part is its speed times the sine of seventy one degrees, …"; S7 the trig values (inputs) and the results |
| s10 S7 | "Take away thirteen point eight east and four point eight north, and the rider feels …" | "Take away the storm's velocity, part by part, and the rider feels …" |
| s15 S2 | "…was nine hundred and fifty six point five minus nine hundred and sixty four point one, over two hours: about minus three point eight…" | "…is the later reading minus the earlier one, divided by the two hours between them: about minus three point eight hectopascals per hour." |
| s15 S6 | "…is fifty two and a half times zero point zero six one: about three point two…" | "…is the storm's speed times that slope: about three point two hectopascals per hour." |
| s15 S8 | "That's minus three point eight plus three point two: about minus zero point six…" | "Adding the barometer's rate and the sliding term gives about minus zero point six hectopascals per hour." |
| s16 S0 | "…minus three point eight equals minus zero point six, from the storm changing, minus three point two, …" | "…the barometer's fall of three point eight hectopascals per hour splits into zero point six from the storm changing, and three point two from the pattern sliding past." |
Kept (results, data values or conversions said as facts, not operations): s05 S11 speeds 1.5 → 2 and 21.5 → 22; s07 S9 "thirty six kilometres per hour";
s12 S10 "84 knots, about 156 km/h"; s14 S14 the units story "kilometres per hour, times hectopascals per kilometre, gives hectopascals per hour" (HOUSE_STYLE §6 units story);
s15 S5 "14.6 m/s, which is 52.5 km/h"; s16 S4 the tracked-centre values.

### Fact table (R19; every Part 5 row of fact_check_2026-11-07.md is OK, nothing to apply; the new claims, checked before TTS)
| Scene | Claim | Verdict | Source |
|---|---|---|---|
| s08 S5 | Part 1: maths angle = 90° − bearing; east / north = length × cos / sin of the maths angle | OK | Part 1 script s05_polar_back ("x equals r cosine theta, and y equals r sine theta"), s06_bearings ("ninety minus fifty three … thirty seven degrees") |
| s08 S7 | sin 71° ≈ 0.946, cos 71° ≈ 0.326; 14.6 × 0.946 ≈ 13.8, 14.6 × 0.326 ≈ 4.8 | OK | builder DP44 (0.945519, 0.325568, 13.81, 4.76); translation_velocity 13.78 / 4.75 |
| s08 S8 | i hat = local east, j hat = local north "from Part 4" | OK | Part 4 script s28 ("i hat east, j hat north and k hat up") |
| s09 S1 | Part 1 split u_r = u cos θ + v sin θ, u_θ = −u sin θ + v cos θ | OK | Part 1 script ("u sub r is u cosine theta plus v sine theta"; "u sub theta is minus u sine theta plus v cosine theta") |
| s10 S1 | "we met it briefly in the vectors movie, as the wind minus the storm's velocity" | OK | vectors movie script l.155 ("The wind relative to the storm is u minus c", Ciarán, same night) |
| s12 S2 | Part 1 built the ring average (1/N) Σ, N = 72 | OK | Part 1 script ("Here N is seventy two, one point every five degrees round the ring"); 5e ring n_az = 72 (builder) |
| s14 S5 | grad p "as in the cross product movie, points the way the pressure increases fastest" | OK | cross product movie script l.499 ("The pressure gradient, grad p, points the way the pressure increases fastest") |
| s17 S9-S10 | rhumb line steered by sailors for centuries; flights Europe → California pass over Greenland (great circle) | OK | fact_check_2026-11-07.md Part 6 rows (script.md:164, :169) |
| s00 | moving frames = coordinates that travel along with a train or a storm | OK | the movie's own content (s03 train, s10/s13 storm frame) |

## 13:30 provisional timing (no audio; `checks/mv_r7_splice.py --plan / --provisional`)
- Splice plan: **150 sentences re-used, 38 new** (incl. the 3 calc-audit sentences that were only estimated before: s07 S2, s04 S2, s14 S2).
  OLD = Part 4's scratch runs (Part 5 was voiced inside the single script: dryrun1/splice2 number it s28 … s43, splice3 `M_*`); new clips go to
  `G:/…/ch00_coordinates_moving/r7/tts`.
- Provisional timing.json: 18 scenes, **1348.686 s** + 2.5-s hold = **22:31.2** (40 461 + 75 frames); 3210 words, 142.5 wpm overall; new
  sentences at the measured 14.03 chars/s.

## 13:31 composition (static) — `mv_lib.tsx`, `mv_sA/B/C.tsx`, `kit_mv/SeriesTitle.tsx` (new, copy of Part 4's = Part 2's = Part 1's)
- mv_lib (ported from Part 4's fr_lib): `AT()` timed from Kokoro word times when timing.json has them (`checks/mv_words.py`), else the character
  estimate; `HL()` gold glow (≈ 1.2 s on the word); `$…$` maths in `Lbl` / `Keyword` (MathLbl); `Recall` ("derived in Part K: …" / `lab`).
- s00: `SeriesTitle` "Coordinates" / "Part 5 · Moving frames" / "storm-relative winds"; pulse on AT(0,"coordinates"); Part B cross-fades on
  AT(0,"they're used"); 'made easy' gone (R1). Part A (train) and Part B (Ciarán, ring, Plymouth barometer) unchanged.
- s02 removed (component and SCENES_A entry; the globe import goes; the mv_bmng asset is still staged).
- s04: result row `u = 1.5 + 20 = 21.5 m/s` (result with its symbol).
- s06: gold "from the derivatives movie" under the recalled DT/Dt (y 312, below the underbraces) from AT(1,"derivatives movie") to "put u in place of T".
- s07: cues re-pointed to the re-worded sentences; the data inputs 13.54 m/s and 0.111 (m/s)/km glow on their words; last row `sum = −4.0 + 5.4 = +1.4`.
- s08: S5 Recall "θ = 90° − bearing" + "derived in Part 1: polar coordinates, bearings", then "east = |U| cos θ, north = |U| sin θ"; S6-S7 CalcStack
  `east = |U| sin 71°`, `north = |U| cos 71°`, **`sin 71° ≈ 0.946, cos 71° ≈ 0.326` (gold, glowing on their words)**, `east = 14.6 × 0.946 ≈ 13.8 m/s`,
  `north = 14.6 × 0.326 ≈ 4.8 m/s`; S8 EQ_S08 (U ≈ (13.8, 4.8)) + Recall `U = 13.8 î + 4.8 ĵ` "from Part 4: local east and north arrows". The old
  x 1270 stack is gone; the S4 track calculation and the map are unchanged.
- s09: S1 `u_r = u cos θ + v sin θ`, `u_θ = −u sin θ + v cos θ`, "derived in Part 1: radial and tangential wind" (leaves before the side values).
- s10: "met in the vectors movie" (gold, S1 → S4) in the slot the "−U" keyword takes on S4.
- s12: S2 Recall `ū_θ = (1/N) Σ u_θ,i, N = 72` "derived in Part 1: ring averages" (until "That's no accident").
- s14: S4 Recall `dT/dt = ∂T/∂t + speed × slope` "from the derivatives movie: the traveller's rate" (y 470, until S8); S5 "∇p · cross product movie" (y 690).
- s15: cues re-pointed; the 0.061 hPa/km input row and the answer row ∂p/∂τ ≈ −0.6 glow on their words.
- s16: the bars rise on "three point eight" / "zero point six" / "three point two"; EQ_S16 on "splits into".
- s17: n = 11 beats; beat 9 (Part 6 picture + "Part 6: great circles, rhumb lines") stays through S10, "flights cross Greenland" joins on S10.
- s18 (R3): the whole end card fades out with the music over the 75-frame silent hold (= Parts 2 and 4).
- CHECK rows added in the TSX: sin 71°, cos 71°, 14.6 × 0.946, 14.6 × 0.326, round(bearing) = 71, ring N = 72.
- Symbol lint (C5 is newer than 5e's last pass): 4 old findings fixed (`$x$: from the station`, `insets: 1.5$\times$ larger`,
  `speed $\times$ slope along $\mathbf U$`, a `lint-ok` for the "h" hours unit). `checks/swap_check.mjs` now measures a `$…$` label by its
  rendered characters (it counted the raw `$\times$` and reported a false overlap).

## 13:33 static gates (provisional timing)
| Gate | Result |
|---|---|
| tsc (movies) | **0** errors |
| at_check | **309** timing references, **0** failures |
| swap_check | 186 text elements, **0** text-over-text, **0** swaps < 8 frames (29 not evaluable on some frames; the new Recall/TeX blocks are not modelled — K6 is the gate for them) |
| cam_speed | **0** cameras > 90 °/s |
| movie_symbol_lint --strict | **0** findings (1 lint-ok) |
| eq_check | 10 storyboard equations, none missing, none unused |
| script_wording_lint | **0** findings |
| r7_widths (new) | every new TeX / mixed label ends before x 1842 (widest 1790: s08 "east = \|U\| cos θ, north = \|U\| sin θ"); the four long Recall labels split into two lines as designed |
| builder | **65 / 65** CHECK rows pass (DP44 new: trig inputs, products, U parts), 0 flags, 15 s; only mv.json changed (images byte-identical) |
| storyboard sync (`r7_storyboard.py`) | idempotent: 16 visual notes, 6 calc_rows blocks, top-level `remake_2026_11_07`, title card, music, teaser; README remake block |

## 13:36 storyboard + builder
- `checks/r7_storyboard.py`: title card line1 'Coordinates' / line2 'Part 5 · Moving frames'; a "REMAKE 2026-11-07:" note on each changed scene's
  visual; new calc rows (s04, s07, s08, s09, s12, s14; s08's two old right-column rows dropped); music style recorded as existing
  (passing-front); cross_part.handed_to_part6 = the two-sentence teaser; top-level `remake_2026_11_07` record. The script README gains a remake
  block (scene table + length; marked PROVISIONAL until the final splice re-runs the tool).
- Builder: CHAPTERS without s02; screen_deviations (series title) and exaggerations (no s02) updated; DP44 rows; `say.ciaran.sin71 / cos71`.

## 13:38 heavy-phase tooling (static), queued
- New: `checks/mv_r7_splice.py` (= Part 4's, OLD runs in Part 4's scratch, scene-number map), `mv_final_timing.py` (`--final`, `--recue` with
  the no-number-split rule), `mv_words.py` (Kokoro word times), `mv_mix.py` + `sound.yaml` (passing-front seed 43; the style's "from s08" wind
  layer moved in-process to the final s08 start; one wind_gusty bed under s08 S1-S3 at −29 LUFS), `mv_run.py` + `label_stills_mv.mjs`
  (frames / stills / render / join; DENSE = the 13 changed or moving scenes), `r7_gate.py` (lock protocol), `r7_heavy.sh` (the queue).
- K6 frame list on the provisional timing: 2813 frames (regenerated after the final timing inside the queue).
- **Queue** `checks/r7_heavy.sh all` launched 13:39 (nohup, PID 74592; log `G:/…/scratch/movies/ch00_coordinates_moving/r7_heavy.log`):
  1. VOICE slot: waits until no Parts 1-4 queue/run script is alive, HEAVY.lock is free or held by a full render, RAM ≥ 8 GB, no CANCEL file;
     then splice → final timing → word times → re-cue → static gates → builder → storyboard README → mix → copy the mix to build1/public.
  2. HEAVY slot: waits until VOICE.lock is free (and Parts 1-4 done, no CANCEL); SSR 2-D + 3-D → K6 frames → stills r7k1 (one bundle, 2 jobs) → k6_overlap.
  It never renders. Cancel: create `G:/…/scratch/movies/ch00_coordinates_moving/CANCEL` (checked before each lock).
- 13:39 first gate answer: waiting — "Parts 1-4 first: 13 queue/run processes alive; HEAVY.lock held by #5b r8 SSR + K6".
- Disk at hand-off: **C: 124.6 GB free, G: 465.7 GB free**.

## Pending (filled by the queue; this log is not updated by it — read r7_heavy.log)
- Final length, cue count, wpm (mv_final_timing --final), words > 0.5 s off (mv_words), cps after recue, mix LUFS / TP, SSR, K6 table.
- Then: look at the K6 stills of every changed scene (s00, s06-s10, s12, s14-s18), ≤ 3 fix loops, render:
  `.venv/Scripts/python.exe movies/src/ch00_coordinates_moving/checks/mv_run.py render --conc 2` (needs `stills … --bundle` first and
  `build1/bundle/public/narration_music_mv.wav`), then `mv_run.py join`, then `tools/movie_qa.py … --storyboard movies/ch00/ch00_coordinates_moving/storyboard.yaml`.
