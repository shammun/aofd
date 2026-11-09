# ch00_coordinates_frames (#5d, Coordinates Part 4): remake 2026-11-07 log

Brief: `movies/ch00/coordinates_series/master_plan_2026-11-07.md` (R1, R3, R15, R16, R19, §B, §C), `continuity_plan.md` (§2c, §3 5d recall
table + teaser, §5 titles, §6 endings, §7 5d work list), `fact_check_2026-11-07.md` (Part 4 rows + summary row 12),
`series_audit_2026-11-07.md` (P5: spoken "Step one … six" in 5d s18–s19), `user_feedback_2026-11-06.md` (12 paragraphs), HOUSE_STYLE §3,
memory rules (no-opening-recaps, verify-every-fact, movie-spoken-wording, show-every-calculation, coordinates-series-continuity).
Reference: Part 1 (`kit_cf/SeriesTitle.tsx`), Part 2 remake (`kit_cs/SeriesTitle.tsx`, `Recall` in `cs_lib.tsx`, `checks/cst_r7_splice.py`,
`remake_2026-11-07_log.md`); Part 2's shown numbers (coast 329°, α 121°, FMB along 9.4 / across −31.5).
Start state: the calc-fix + Part 1 lessons build (2026-11-05/06): **no final TTS ever ran for 5d**. timing.json is PROVISIONAL
(measured dry runs dryrun1 / splice2 / splice3 + 6 estimated re-voiced sentences, `checks/revoice.py`), 2362.087 s; no mix, no stills, no render.
Nothing committed, nothing rendered, nothing deleted.

## 09:27 start
- Disk (`tools/disk_guard.py --report`): **C: 103.9 GB free, G: 439.4 GB free**, project data 146.72 GB of 150 (scratch 106.81).
- HEAVY.lock held by "orchestrator 5a fb1 render (fresh chunks) Sat Nov 7 09:09:38": static work first.
- **Old render chunks**: `G:/…/scratch/movies/ch00_coordinates_frames/build1/` holds `build.log`, `modload/`, `public/`, `tmp/` only —
  **no `render/` folder, no old chunks** (5d was never rendered).

## 09:36 narration text (static; `checks/r7_text.py`, idempotent; script.md + storyboard voiceovers)
- Backups of the pre-remake script / storyboard / timing in the session scratchpad (`fr_*_before_r7.*`); git HEAD holds them too.
- **Cut**: s02_part3_recap (R16/§C: no opening recap), s12_coast_angle, s13_alpha, s14_along_across (R15/§2c: the worked coast calculation is in Part 2).
- **Changed** (26 scenes left): s00 S0 (R1), s01 S4 (no "fit a coast"), s04 S3 (Part 3's Earth axes), S7 (φ = latitude, λ = longitude),
  s09 S3 ("Amphan, which we met in Part 2"), s10 rewritten (10 sentences: recall of Part 2 + the 3-D point + the question for s11; S3/S4 are the
  old S4/S5, re-usable clips), s11 +S14 (Part 2's bearing: 55/91.5 = 0.601 → 31° → 329°; the old s12's round-Earth bearing, a Part 6 tool, is cut),
  s15 S4 ("As we found in Part 3"), s18 S3/S6/S8 and s19 S5/S6/S11 (no "Step one … six": First / Next / Now / Next / Then / Now), s28 S3 (lat/lon →
  the legs behind Part 2's 329°) + S7–S8 two-sentence teaser naming Part 5 (ride along with a storm across the English Channel; storm's own spin
  vs its motion; what a barometer sees).
- `tools/script_wording_lint.py` → **0 findings**.
- Fact row 12 applied: storyboard l.92, l.175, l.972, l.1002 and the script README "78 km" → "79 km" (data 79.4).

### Fact table (new / changed claims, checked before TTS)
| Scene | Claim | Verdict | Source |
|---|---|---|---|
| s00 | local frames are "the coordinates every weather station uses" | OK | east/north/up is the frame of every surface wind report (direction from north, clockwise; Part 4 s03 fact row "every weather report uses this frame" OK) |
| s04 | Part 3's Earth axes: x̂ to (0°, 0°), ŷ to (0°, 90° E), ẑ to the North Pole | OK | Part 3 script ("The arrows of length one along them are called x hat, y hat and z hat"); 5d storyboard cross_part.from_part3 |
| s09 | Amphan "which we met in Part 2" | OK | Part 2 s21–s24, s33–s34 (22 mentions) |
| s10 | Part 2 worked Ian at Fort Myers Beach, SW Florida, with Part 1's turned axes; coast bearing 329°, α = 121°, ŷ′ out to sea; along ≈ 9.4, across ≈ −31.5 m/s (onto the land) | OK | Part 2 script s26–s28 (cs.json shore.fmb; DS40); 5d fr.json coast/ian (−31.54, 9.4) |
| s10 | Part 2 read the legs 91.5 km N / 55 km W off a flat km map | OK | Part 2 s27 ("Here's the coast on a flat map marked in kilometres … ninety one point five … fifty five"); Part 2 teaser → Part 3 |
| s11 | 55 / 91.5 = 0.601; tan⁻¹ 0.601 = 31.0°; 360 − 31 = 329° | OK | arithmetic (fr.json coast.tanb 0.601, beta 31.0, brg 329.1 on the sphere) |
| s15 | "As we found in Part 3, at Brest one degree of longitude is about 74 km" | OK | Part 3 script: "about seventy four kilometres per degree at Brest"; fr.json 73.8 |
| s28 | teaser: Part 5 rides along with a storm crossing the English Channel; storm's own spin vs its motion; a barometer as the storm passes | OK | Part 5 script s00/s01/s08–s15 (Storm Ciarán, 1–2 Nov 2023; Plymouth barometer); 5e fact rows OK |

## 09:44 composition (static) — `fr_lib.tsx`, `fr_sA/B/C.tsx`, `fr_eq.ts`, `kit_fr/SeriesTitle.tsx` (new, copy of Part 2's = Part 1's)
- New tools: `checks/r7_text.py` (narration), `checks/fr_r7_splice.py` (`--plan`, `--provisional`, full splice; OLD = the three measured dry runs,
  per-scene source from the storyboard), provisional timing.json written (re-used clip lengths + new sentences at the measured 13.39 chars/s):
  26 scenes, 2117.6 s. Splice plan: **276 sentences re-used, 28 new** (incl. the 6 calc-audit sentences that were only estimated and the
  2 "seventy five point eight" re-wordings, which had never been voiced).
- fr_lib: `Recall` (= Part 2's, + `lab` for "found in Part 2:"), `$…$` maths in `Lbl` / `Keyword` (ported from Part 3 / Part 2, symbol lint C5).
- s00: `SeriesTitle` "Coordinates" / "Part 4 · Turning frames" / "local axes and how they turn"; "made easy" gone; pulse on "coordinates";
  Part B (on "meteorology") is now a parcel sliding east along Brest's parallel seen from above the pole, its east arrow swinging (faint copies
  left behind), no coast (the coast frame is Part 2's); one BMNG source line.
- s01: keyword "different at every place" (mini: two tripods pointing different ways) replaces "turned to a coast".
- s02: removed. s04: x̂, ŷ, ẑ arrows on their words; Recall "derived in Part 3: Earth axes"; k̂ formula + "derived in Part 3: position vector";
  "φ: latitude, λ: longitude" on "where phi"; CalcStack moved to y 390.
- s05: "(p, q) → (−q, p)" + "derived in Part 1: quarter turn" (leaves 20 frames before î's line); s06 "Part 1:" gold.
- s08: "derived in Part 1: arc length" under 480/6371.
- s10: rewritten in three phases (flat map: axes turn by α, Part 1's equations "derived in Part 1: turned axes", coast 329°, α = 90° − 329°
  ≡ 121°, along ≈ 9.4 / across ≈ −31.5 onto the land "found in Part 2: Fort Myers Beach", wind arrow + bands; zoomed globe at Fort Myers Beach:
  î, ĵ turn about k̂ by 121°, "k̂ unchanged"; s11's map with Naples / Englewood and the two legs "91.5 km ?", "55 km ?").
- s11: EQ_S11 as Recall "derived in Part 3: distances"; on the new S14 the stack leaves and tan β = 55.0/91.5 = 0.601, β ≈ 31°,
  bearing = 360° − 31° = 329° (EQ_S12) + "found in Part 2: the coast's bearing"; a north arrow and the β arc at Naples.
- s12 / s13 / s14: removed (EQ_S14 constant removed; EQ_S12 now in s11, EQ_S13 in s10).
- s15: Recall "Δx = a cos φ Δλ ≈ 74 km per 1°" "derived in Part 3: distances" on "As we found". s16: "derived in Part 2" beside dθ/dt = v/r.
- s23: "derived in Part 2: product rule" (gold). s24: Recall "part along î = A·î" "derived in Part 1: components".
- s28: S3 picture = Naples → Englewood legs ("latitude, longitude → km", "91.5 km north · 55 km west", "Part 2's coast: 329°"); teaser
  picture through S7–S8 with "riding along with a storm", "its own spin · its motion", "what a barometer sees".
- s29: the picture fades with the music over the 75-frame hold (R3; = Part 2's s42).
- Symbol lint (C5 is newer than 5d's last pass): 9 findings, all fixed with `$…$` (s06 keyword φ, s19 step-4 chip, s21 sin/cos = tan, s27 "≈ 66 ×",
  "tan = 1", s28 "66 ×").
- Static gates on the provisional timing: tsc 0 · at_check 338 refs / 0 failures · swap_check 350 elements, 0 overlaps, 0 tight swaps (after
  moving the s05 label out 8 frames earlier and the s10 phase keywords 18 frames later) · cam_speed 0 > 90 °/s · eq_check 18 / 0 missing /
  0 unused · `movie_symbol_lint --strict` 0 · `script_wording_lint` 0.

## 09:48 heavy-job tooling (static), then waiting for the lock
- Storyboard contract synced (`checks/r7_storyboard.py`): visuals / beats / calc rows / data / layout of s00, s01, s04, s10, s11, s15, s28, s29;
  top-level `remake_2026_11_07` record; `effects_candidates: []` (the only candidate was s14's waves); data_block / handed_to_part5 teaser updated.
- `checks/final_timing.py` (`--final <tts dir>`: timing.json, en.vtt/srt, storyboard t / sentence_times / measured / skip_guidance /
  target, `final_tts` record; `--recue [--write]`: Part 2's within-sentence cue merge). `make_timing.py` (old provisional path) kept; `fr_static.sh`
  no longer calls it.
- `checks/label_stills_fr.mjs` + `checks/fr_run.py` (frames / stills / render / join; = Part 2's cst_run.py for Part 4; K6 list = the house list +
  sentence start −4/+3 + every 0.5 s through 13 dense/changed scenes): 3636 frames on the provisional timing.
- `sound.yaml` (new: frame-drift, seed 41, bed −28 LUFS, duck 5 dB, tail 2.5 s, no effects) + `checks/fr_mix.py` (tools/sound/mix.py build();
  the style's two "from s28" layers carry the pre-remake s28 start 2260.8 s in tools/sound/styles.py → set in-process to the final s28 start;
  the shared tool is not edited — proposed to the orchestrator).
- s10: "minus: onto the land" moved under the across row (it ran into the row); "found in Part 2" keyword at y 815.
- `checks/r7_heavy1.sh` started in the background 09:47: waits for HEAVY.lock (held by "orchestrator 5a fb1 render"), then splice → final
  timing → recue → mix, releases the lock.
- 09:48: the 5a render has 10 of ~21 chunks (≈ 3 min each); the lock should free around 10:25.

## 11:24–11:45 heavy 1 (r7) — lock taken 11:24:46 after the 5a render
- Disk at start: C: 116.6 GB, G: 439.7 GB free.
- Splice r7: 276 re-used, 28 new; re-synthesis correlation dryrun1 0.9891, splice2 0.9895, splice3 0.9887; every new clip within 0.5 LU of
  its target and 1.5 LU of its neighbours (−15.77 … −16.83 LUFS), TP ≤ −1.53 dBTP. Total 2095.350 s (62 861 frames), 487 cues, 0 warnings.
- final_timing --final: 26 scenes, 304 sentences, 5112 words, 146.2 wpm, movie 34:57.85; skip chips A 2:08→8:02, B 16:30→25:55, C 26:15→30:01.
  --recue: 489 cues, 0 above 17 cps.
- Mix r7 (`fr_mix.py`, frame-drift seed 41, s28 layers at 1979.975 s): −16.01 LUFS, TP −3.41 dBTP → PASS (`build1/sound_r7/`).

## 11:46 coordinator: NEW USER RULE "show it, don't voice it" (HOUSE_STYLE §calculations; memory dont-voice-simple-arithmetic)
Whole-script sweep for voiced plain-number arithmetic (`r7_text.py` ARITH, applied after EDIT; symbolic steps — equations, product /
chain rule, the arc rule — stay voiced as genuinely new steps; every on-screen CalcStack row is unchanged). Old → new:
| Scene S | Old (voiced arithmetic) | New |
|---|---|---|
| s04 S12 | "…zero point six six four times zero point nine nine seven, which is zero point six six two." | "Multiplying these out, the first part of k hat is about zero point six six two." |
| s04 S13 | "…zero point six six four times minus zero point zero seven eight, which is minus zero point zero five two." | "The second is about minus zero point zero five two." |
| s07 S1 | "…zero point zero seven eight squared, plus zero point nine nine seven squared, is one." | "For i hat, the squares of its parts add up to one." |
| s07 S2 | "…zero point zero seven eight times minus zero point seven four five, plus … plus zero." | "Next, the dot product of i hat and j hat: we multiply the matching parts, and add them." |
| s07 S3 | "That's minus zero point zero five eight, plus zero point zero five nine: zero, up to rounding." | "That gives zero, up to rounding." |
| s08 S5 | "…divided by the radius: four hundred and eighty over six thousand three hundred and seventy one." | "By the arc rule, that's the distance divided by the Earth's radius." |
| s08 S12 | "That's minus 0.158, minus 0.050, plus 0.018, which is minus 0.191." | "That gives minus zero point one nine one." |
| s09 S6 | "…that's 0.004, minus 0.048, plus 0.290: 0.246." | "Dotted with Brest's up, that gives zero point two four six." |
| s11 S9 | "…so the step north is six thousand three hundred and seventy one times zero point zero one four three six: about 91.5 km." | "In radians, 0.823° is 0.01436, so the step north is the radius times that: about ninety one and a half kilometres." |
| s11 S12 | "So the step east is 6371, times 0.895, times −0.00965: about −55 km." | "With the change in longitude, −0.00965 radians, the step east comes out at about minus fifty five kilometres." |
| s11 S14 | "…fifty five over ninety one and a half is 0.601, … three hundred and sixty minus thirty one, which is 329°." | "…their ratio, 0.601, is the tangent of thirty one degrees, so the coast runs thirty one degrees west of north, a bearing of 329°." |
| s15 S3 | "…two hundred and fifty times three thousand six hundred metres: nine hundred kilometres." | "In one hour, it covers nine hundred kilometres." |
| s15 S4 | "…so that's nine hundred divided by seventy four: about twelve degrees of longitude." | "…so that's about twelve degrees of longitude." |
| s20 S9 | "…divided by six thousand three hundred and seventy one kilometres, is 0.0175 radians…" | "…over the Earth's radius, is about 0.0175 radians…" |
| s27 S2 | "U v tangent phi over the radius is ten times ten times one, divided by 6.371 million metres." | "Let's put these numbers into u v tangent phi over the radius, with the Earth's radius, 6.371 million metres." |
| s27 S3 | "That's about 1.6 × 10⁻⁵ m/s²." | "That gives about …" |
| s27 S5 | "Two times 7.29 × 10⁻⁵, times 0.707, is 1.03 × 10⁻⁴ per second." | "With the Earth's spin rate, Omega, 7.29 × 10⁻⁵ per second, f at forty five degrees is about 1.03 × 10⁻⁴ per second." |
| s27 S6 | "Times ten metres per second, that's about 1.0 × 10⁻³." | "Multiplying by the northward wind, ten metres per second, gives about 1.0 × 10⁻³." |
Kept voiced (results or new rules, not operations): s07 S6 (i × j result), s08/s09 "the angle whose cosine is …", s19 S15 (the u/(a cos φ) formula
with named quantities), all symbolic equations. Sentence counts unchanged, so every SS() index holds; AT() cues re-pointed so each on-screen row
still appears in order on its words: s04 rows → "zero point six six two" / "minus zero point"; s07 → "the squares", "we multiply", "and add them";
s08 "= −0.191" → "minus zero point"; s09 row → "that gives"; s11 Δφ row → "zero point zero one four three six", Δx row → "the step east comes",
tan → "their ratio", 329° → "a bearing of". Wording lint 0. Splice plan r8 (`fr_r7_splice.py --pass r8`, OLD = dry runs + the r7 splice):
286 re-used, 18 new. `checks/r8_heavy1b.sh` = splice r8 → final timing → recue → mix (sound_r8); queued after heavy 1 releases the lock.

## 11:50 coordinator clarification: RELATE the numbers in the voice (what is combined, where each comes from), no read-out products / sums
`r7_text.py` ARITH2 (applied after ARITH; idempotent across EDIT → ARITH → ARITH2):
| Scene S | ARITH text | Now |
|---|---|---|
| s04 S12 | "Multiplying these out, the first part of k hat is about 0.662." | "The first part of k hat is cosine phi times cosine lambda, which comes to about zero point six six two." |
| s04 S13 | "The second is about −0.052." | "The second, cosine phi times sine lambda, comes to about minus zero point zero five two." |
| s07 S1 | "…the squares of its parts add up to one." | "For i hat, the squares of its east and north parts add up to one." |
| s07 S2 | "…we multiply the matching parts, and add them." | "…we multiply their first parts, their second parts and their third parts, and add them." |
| s08 S12 | "That gives −0.191." | "Those three products add up to minus zero point one nine one." |
| s09 S6 | "Dotted with Brest's up, that gives 0.246." | "Dotted with Brest's up, part by part, that gives zero point two four six." |
| s11 S12 | "…the step east comes out at about −55 km." | "…the step east, the radius times cosine phi times that, comes to about minus fifty five kilometres." |
| s15 S3 | "In one hour, it covers 900 km." | "In one hour, which is three thousand six hundred seconds, it covers nine hundred kilometres." |
Wording lint 0. r8 plan: 18 new sentences (all ARITH / ARITH2), 286 re-used.
- **Word timing** (coordinator rule): `checks/fr_words.py` (heavy, Kokoro) re-synthesises every sentence an AT() is cued on, keeps the token start
  times (scaled to the clip used) in timing.json `sentences[*].words`; `fr_lib.AT()` now uses the word time when the phrase is found, else the
  character estimate. It lists every cue whose estimate was > 0.5 s off.
- **Captions**: `final_timing.py --recue` no longer lets a cue boundary fall inside a spoken number (incl. "minus …", "… hundred and …"); the
  boundary moves to the number's start or end (still ≤ 2 × 42). Dry run on the r7 timing: 10 boundaries moved, 489 cues, 0 above 17 cps.
- `checks/r8_heavy1b.sh` (splice r8 → final timing → fr_words → recue → mix sound_r8) queued 11:51; r7_heavy1 still finishing its closing
  disk report under the lock.

## 12:05 coordinator: NEW opening rule (no "how meteorology uses them"; no robotic "Let's see what X is" lead-in)
- s00 S0: "… and see how meteorology uses them to follow the wind …" → "In this video, we'll learn local frames, the coordinates every weather station
  uses, and see how they're used to follow the wind as the air moves over the round Earth." Part B of the title animation now cues on "they're used".
- s01 S4: "Let's see what local frames are, how they differ from place to place, …" → "Now let's dive into local frames: how they differ from place
  to place, how they turn by themselves as the air moves, and why that matters for the wind." (AT cues "local frames", "differ from place to place",
  "by themselves" unchanged.)
- `script_wording_lint` 0; storyboard s00 visual re-synced. The queued r8 pass voices these two as well (20 new sentences in all).
- 11:51 the lock went to "orchestrator 5b remake render", 12:04 to "#5c remake r7 SSR"; r8_heavy1b still waiting in the queue.

## 12:25 coordinator: arithmetic rule covers squares / roots / lengths
- `script_wording_lint` (updated rule) → 0 findings. Read-through of every "squared / square root / squares / length / speed is" sentence:
  s07 S1 "For i hat, the squares of its east and north parts add up to one" (already the combined form; no single square voiced),
  s19 S8 cos²φ + sin²φ = 1 (a symbolic identity, a genuinely new step: kept), s27 S3 "metres per second squared" (a unit),
  s04 S15 / s03 / s08 / s22 "length one" (statements, no arithmetic), s26 S9 "its speed is still fourteen point one" (result only; the
  √(11.5² + 8.2²) row stays on screen, unvoiced). The old s14 "nine point four squared, plus thirty one point five squared …" left with s14.
  No further text change; the r8 pass is unchanged (20 new sentences).

## 12:40 coordinator: calc labels (every number says what it is, every result its symbol; balance: only where not obvious) + input highlighting
**Labels (placement only; widths estimated with fr_lib's texW port, all ≤ 1842):** s04 CalcStack "Brest: φ = 48.4°, λ = −4.5°", "1st"/"2nd" → k_x / k_y;
s08 "Δλ = 2.01° + 4.49° = 6.50°", "Δx = 6.50 × 73.8 km ≈ 480 km", "θ = 480/6371 ≈ 0.075 rad ≈ 4.3°" (46 px) and the column note "ups' angle θ =
centre angle"; s19 stack lhs "rate" (its value row kept with it, `cont`), "1 day", "turn" (stack y 590 so the bottom stays above 878); s26
"Δu: × 86 400 s ≈ 1.4 m/s", "|v| = √(11.5² + 8.2²) ≈ 14.1" + muted "at the start: √(10² + 10²) ≈ 14.1" (y 800); s27 "f ≈ 1.03 × 10⁻⁴ s⁻¹",
"ratio = 1.03 × 10⁻³ / 1.57 × 10⁻⁵ ≈ 66". Skipped as obvious from the frame: s09 Khulna rows (under "22.8° N, 89.6° E" and k̂_K), s15 (the
plane label above), s20 111.2 km / 6371 km (units say it), s27 f v rows.
**Inputs said + highlighted (gold glow, `HL()` in fr_lib, ~1.2 s on the word, timed by AT() = Kokoro word times):**
- voice additions (r7_text ARITH2): s09 S5 "There, cosine phi is zero point nine two two, sine phi zero point three eight eight, cosine lambda zero
  point zero zero seven and sine lambda almost exactly one, so its up arrow is …"; s11 S9 "One degree is zero point zero one seven four five radians,
  so zero point eight two three degrees is zero point zero one four three six radians, and the step north is the radius times that …"; s27 S5 "… and
  the sine of forty five degrees, about zero point seven zero seven, f is about …".
- highlights: s04 cos φ / sin φ and cos λ / sin λ rows; s09 the two trig rows; s11 1° = 0.01745 rad and cos 26.5° = 0.895; s15 74 km per 1°; s19
  4 230 000 m (in the rate row); s27 Ω = 7.29 × 10⁻⁵ s⁻¹ and sin 45° ≈ 0.707 (new, top left above the bars). Answers: s04 k̂, s08 −0.191 ⇒ 101°,
  s09 75.8° and 94°, s11 bearing 329°, s19 ≈ 12°, s27 ratio ≈ 66.
- Not done (noted): s08's 73.8 km per degree for Trappes stays an unvoiced, muted support row (voice gives the 480 km as a fact).
- tsc 0 · symbol lint --strict 0 · swap_check 0 / 0 · wording lint 0. r8 (still queued) now voices 23 sentences.

## 13:18 coordinator: two-slot lock protocol (HEAVY.lock = renders / K6 / stills / SSR; VOICE.lock = TTS splices and mixes)
- The queued r8 job (waiting on HEAVY.lock, never acquired it; its log is empty) was stopped and re-pointed: `r8_heavy1b.sh` now takes
  VOICE.lock, and only when HEAVY.lock is free or held by a render (owner.txt contains "render", none of k6 / still / ssr) with ≥ 8 GB RAM free
  (psutil; 16.9 GB free at 13:18). The slow `disk_guard --report` inside the lock is replaced by a quick C:/G: free-space print. Restarted 13:19.
- r7_heavy2.sh (SSR + K6 stills) stays on HEAVY.lock.
- 13:35 coordinator: K6 / stills / SSR wait until VOICE.lock is free (r7_heavy2.sh checks it before and right after taking HEAVY.lock); VOICE jobs only when HEAVY.lock is free or a full render with ≥ 8 GB free (r8_heavy1b.sh already does). r7_heavy2's slow disk_guard inside the lock replaced by a quick free-space print.
- 14:39 memory rule (mix ≈ 11.5 GB): r8 re-split into `checks/r8_voice.sh` — phase 1 TTS under VOICE.lock (HEAVY free or a render, ≥ 8 GB), phase 2 mix under VOICE.lock only with HEAVY.lock free and ≥ 14 GB; the unstarted r8_heavy1b job was stopped again (it never took a lock). Started in the background.

## 15:24–15:32 r8 TTS phase (VOICE.lock; HEAVY held by a render, RAM 19 GB free)
- Splice r8 (OLD = dry runs + r7 splice): **283 re-used, 21 new** (all the arithmetic / relating / opening / input sentences); re-synthesis
  correlation r7 0.9884; every new clip −15.81 … −16.75 LUFS, within 0.5 LU of target and 1.5 LU of its neighbours, TP ≤ −1.61 dBTP.
- **Final timing: 26 scenes, 304 sentences, 5066 words, 146.2 wpm; audio 2076.575 s (62 298 frames); movie 34:39.1 with the 2.5-s hold.**
  Skip chips: A 2:07 → 7:47, B 16:06 → 25:28, C 25:49 → 29:34.
- `fr_words.py`: Kokoro word times for 71 cued sentences / 115 AT() cues, 0 phrases unmatched; 14 character estimates were > 0.5 s off and are now
  word-timed (largest: s05 'cosine lambda' +0.97 s, s07 'we multiply' −0.89 s, s09 'Kolkata' +0.83 s, s10 'ninety one' −0.80 s).
- Recue: 488 cues, 0 above 17 cps, no cue boundary inside a spoken number (the check FAILs otherwise).
- Static gates on the final timing (16:28): tsc 0 · at_check 361 refs / 0 failures · swap_check 353 elements, 0 overlaps, 0 tight swaps · cam_speed 0 ·
  eq_check 18 / 0 / 0 · symbol lint --strict 0 · wording lint 0.

## 16:27 coordinator: no lock until the 5a fix1 full render is running; no mix / SSR / K6 until it ends
- The r8 mix waiter (phase 2 of r8_voice.sh, holding no lock) was stopped. `checks/r8_after5a.sh` (background) waits to see "5a fix1 full render"
  in HEAVY.lock/owner.txt, waits for it to end, then runs the mix (`r8_voice.sh mix`: VOICE.lock, HEAVY free, ≥ 14 GB) and then SSR + K6 stills of
  the whole house list into one tag folder k6r8a (`r7_heavy2.sh`: HEAVY.lock, VOICE free).
- 17:06 coordinator: RENDER2.lock for full renders (5a now, 5b next). The r8_after5a watcher (no lock held) stopped; `checks/r8_next.sh` runs K6/SSR first (r7_heavy2.sh: HEAVY.lock, VOICE free, ≥ 12 GB; may overlap a render), then the mix (r8_voice.sh mix: no RENDER2.lock, HEAVY free, VOICE.lock, ≥ 14 GB). Started in the background.

## 17:00–17:42 SSR + K6 k6r8a (HEAVY.lock, run by r8_next.sh in parallel with the 5a render under RENDER2) — FAIL, fixes made
- SSR 7387 scene-frames / --3d 5322 (THREE guard 2061): **1 error**, s10 "α = 90° − 329° = −239° ≡ 121°" ends at x 1881 at 50 px (the guard
  throws, so the s10 stills were not written: 3318 of 3556 K6 stills).
- K6 k6r8a (3318 frames): **1915 hits** (text-text 1426, text-picture 107, text-fill 52, text-stroke 254, edge 69, link-axis 7). This was the first
  K6 Part 4 ever had: most hits are in scenes the remake did not touch.
- Fixes (00:10, static; tsc 0, at_check 364 / 0, swap_check 0 / 0, symbol lint 0): s10 α line 44 px; skip chip `data-lc-own` (s04, s16, s23
  text-fill); s03 the −k̂ tip label removed (sat on "Brest" and the globe; gravity's −k̂ is in the column); s04 x̂ / ŷ / ẑ tip labels leave before
  Brest's numbers; s05 —; s06 the two leg labels ("up the axis" crossed k̂, "in towards it" was cut by the top edge) moved into the column on the
  last sentence, the 4-decimal rows leaving first; s07 "so = k̂" on its own line (y 680), "right-handed at Brest" to y 770; s09 closer zoom (dist
  1.55 → 1.25) so Khulna / Bangladesh / India / Kolkata labels separate, stack x 1235 so its left column is clear of the sharp picture (x > 1068);
  s11 side callouts to y 740 / 825 (below the lowered stack); s15 "≈ 12° round the axis" to y 445; s18 R̂ label kept above y 830; s19 "cos φ k̂" leg
  label removed (it sat on ĵ; the column's R̂ = cos φ k̂ − sin φ ĵ names the legs), "step 6" to y 262, EQ_S19 50 px (ended at 1854), rate row
  h 112; s20 / s21 second equation 15 px lower; s22 line spacing 105 → 118; s24 product lines spaced; s25 "metric terms" 55 px below "change of
  u", the three full rows 100 px apart; s26 the u-callout link removed (it crossed an axis); s28 the storm ring stops 300 px into its slide (it ran
  into the teaser text). s05 "R̂ × λ = −4.5°" (171 frames) is NOT yet fixed — see open items.
- 16:30–00:00: the background driver r8_next.sh was stopped by the system for low memory after the K6 step; the mix waiter it had started (no
  lock held) was stopped too. Per instruction it is not restarted on my own.
- Disk 00:12: C: 118.7 GB free, G: 453.0 GB free.
- s05: λ = −4.5° label moved right of the R̂ line (y c + 0.22 r), clear of R̂ (171 frames in k6r8a). All fixes need the SSR + K6 re-shoot (k6r8b) and then the r8 mix; neither is started (memory stop; see the report).

## 2026-11-09 fix loop r8c (source only; after the k6r8b re-shoot FAILED)
**k6r8b** (`build1/k6r8b_heavy_20261109_0301.log`, 03:01-03:36): SSR 2-D 7387 scene-frames / 3-D 5322, **2 errors** each (s10 "anticlockwise,
seen from above" ends at x 1857 from scene f1949; s19 CalcStack at y 590 ends at y 889, into the caption band, from f0), so 3430 of 3556 K6
stills (s10 after f1949 and all of s19 missing). K6: **FAIL, 381 hits** (text-text 345, text-stroke 34, text-picture 2) = **11 unique faults**
(summary `build1/k6sum.py`, copied from the storm build):
| Scene | Fault (frames, sampled hits) | Cause | Fix |
|---|---|---|---|
| s05 | λ = −4.5° over the globe (f7688, 1) | entered on the globe→top-view cross-fade | enters at tP1 + 22 (globe gone) |
| s05 | λ = −4.5° × gold dashed line (f9322-9693, 34) | the î→ŷ dashed line (tY) runs through the label's end | label leaves at tY − 12 (exit before entry) |
| s09 | "even east is different" × k̂_K row (f18868, 1) | CalcStack pushes the k̂_K line up through y 110 as î_K slides in | every pushed-out line gets `out` = next line − 10 (rows: trig 1 → tDot−10, trig 2 → t76−10, k̂_K → tIk−10, k̂_B·k̂_K → t94−10, cos⁻¹ 75.8° → t94+45) |
| s09 | î_B·î_K row over the globe (f19528, 1) | on the zoom back out the disc (zf < 0.5 → circle mask) still reached x > 1105 | GlobeFrame zoom/right = max(zf, clamp((disc right − 1000)/60)): fades + right panel held until the disc ends left of x 1060 |
| s10 | Fort Myers Beach × Gulf of Mexico × ŷ′ (f20213-21505, 105 / 92 / 92) | name end-anchored below-left of the dot, Gulf at (300, 560), ŷ′ turns down-left onto both | name below-right on the land (dx 40, dy 72, start; ends ≈ x 976 < map edge 1000), Gulf at (140, 700) in the open sea |
| s10 SSR | "anticlockwise, seen from above" ends at x 1857 | 30 chars from XZ 1190 | "anticlockwise, from above" (viewpoint kept; ends ≈ 1746) |
| s15 | "≈ 12° round the axis" × "like θ̂ round a circle" / "111 km north ⇒ k̂ tilts 1°" (f27505-28105, 7 / 36) | Lbl at y 445 (54 px), TeX lines at y 500 | TeX lines 500 → 545, "keep changing" 590 → 630 (Recall at 700 is gone by then; D/Dt at 620 enters after they leave) |
| s19 SSR | CalcStack bottom 889.5 > 878 | y 590 + 112 + 62.5 + 62.5 + 62.5 | stack y 578 (bottom 877.5); "u = 10 m/s at Brest" 560 → 538 |
| s22 | bottom-right "none" × Ω × B (f45428-45852, 9) | Ω × B label at (720, 650) and the ring's violet arrow (to y 690) inside the grid (ends y 720) | ring cy 790 → 822 (ry 34), arrows to y 748 / (840, 804), label at (885, 772) right of the ring (ends < 1060) |
| s25 | "metric terms" × first full row (f52923-53174, 3) | label y 475, rows at 520 (dfrac) | rows 520 → 580 (+100 each, last ends ≈ 830 < 880, gone before "what to keep"); brackets y0+70 → +80 (they touched Dt), labels +10 |
- Static gates (2026-11-09): tsc 0 · at_check 364 refs / 0 failures · swap_check 351 elements, 0 overlaps, 0 tight swaps · cam_speed 0 above 90 °/s
  (s09 peak 75) · symbol lint --strict 0 · eq_check 18 / 0 / 0 · script_wording_lint 0 · tex_escape_lint 0. SSR not run (another heavy job
  holds HEAVY.lock: #5c p3b). Script text unchanged (no TTS / mix needed).
- **Re-shoot prepared, NOT started:** `checks/r8c_heavy.sh` (tag k6r8c): frame list = house K6 list (3556) + every frame of s05 s09 s10 s15 s19 s22
  s25 ±15 = **22 917 frames** (≈ 2-3 h of stills at 3 jobs); gate RENDER2 / HEAVY / VOICE free + ≥ 9 GB RAM, takes HEAVY.lock (mkdir + owner.txt);
  SSR 2-D + 3-D must be 0 errors (else release + exit 2, no K6); fresh bundle (old moved aside), stills into the fresh folder `stills/k6r8c`
  (refuses a non-empty one), K6 ports 8447 / 8477 / 8507; then k6_overlap + a per-scene summary ending "N unique faults"; own log
  `build1/k6r8c_heavy_<date>.log`. Never renders, mixes, commits or deletes. Start: `nohup bash movies/src/ch00_coordinates_frames/checks/r8c_heavy.sh > /dev/null 2>&1 &`.
- Still open after r8c passes: the r8 mix (`r8_voice.sh mix`), then the full render.
- Disk 2026-11-09: C: 102.6 GB free, G: 439.2 GB free.

## 2026-11-09 fix loop r8d (source only; after k6r8c)
**k6r8c** (`build1/k6r8c_heavy_20261109_044219.log`, lock 04:42-06:47): SSR 2-D 7387 / 3-D 5322 scene-frames, **0 errors** (the s10 / s19 r8c
fixes hold); 22 917 of 22 917 stills; K6 **FAIL, 436 hits** (text-text 52, text-picture 384) = **28 unique faults**:
- **17 at scene start + 9** (one cross-fade frame; s05 f6857, s06 f9706, s09 f16657, s10 f19577, s11 f22402, s15 f26209 ×2, s16 f28767, s19
  f35060 ×2, s22 f42945, s23 f46205 ×4, s25 f50817, s26 f53621 ×3): new-scene text (keywords appearing at 0, column TeX, "moving east",
  "ĵ ⊙ (out of the screen)") over the old scene's text / globe / credit, and new credits over old ones.
  **Fix: ONE SceneGate** (ported from Part 3 p3c, commit 73e5576): `fr_lib` gets `XIN = XF + 8`, `SceneGate` (context) and `useGate`;
  TeX, Layered, CalcStack, Lbl (incl. $…$ labels), Keyword, Recall (and through them Place, SideCallout, SkipChip, ColourBar, plab) fade in
  from XIN; `SourceBelow` (now exported gated by fr_lib; fr_sA/B/C import it from there, GSrc included) from XF. `CoordinatesFrames`
  wraps every scene after s00 in `SceneGate {text: XIN, src: XF}`. Pictures are not gated.
- **s10 phase changes** (f21520-21526 ×6: phase-1 credit / x̂′, ŷ′ equations / "derived in Part 1: turned axes" under phase 2's credit and
  equations at XZ; f21882-21888: phase-2 credit vs phase-3 credit): the pictures cross-fade (o1/o2/o3) but phase-2 text and credit now use
  `o2t = fin(t3D + 12)` (phase 1's text is gone at t3D + 10) and phase 3's credit `o3t = fin(tLegs + 12)`.
- **s10 x̂′ / ŷ′ tip labels on the sharp zoomed globe** (f21523-21885, 190 + 190; 3-glyph labels are not K6 spot labels): the tips keep î / ĵ
  (spot glyphs) and leave as the turn starts (tTurn3); after the turn the arrows are named in the column by two SideCallouts with gold links to
  the tips: "x̂′ along the coast" (XZ, 630, from tTurn3 + 62) and "ŷ′ out to sea" (XZ, 720, + 70), in the arrows' orange. `SideCallout`'s width
  guard now measures $…$ maths with mixW (as Lbl does; textW counted the TeX source and would have thrown at x ≈ 1855).
- Static gates: tsc 0 · at_check 364 / 0 · swap_check 353 elements, 0 overlaps, 0 tight swaps · cam_speed 0 · symbol lint --strict 0 ·
  eq_check 18 / 0 / 0 · script_wording_lint 0 · tex_escape_lint 0. SSR not run (heavy work not allowed in this loop).
- **Re-shoot prepared, NOT started:** `checks/r8d_heavy.sh` (tag k6r8d): list = every frame of every scene start −15 … +30 (26 starts) + every
  frame of s10 ±15 = **3960 frames**; copies every k6r8c still / box file outside that list into the fresh `stills/k6r8d` (one scandir pass);
  gate RENDER2 / HEAVY / VOICE free + ≥ 9 GB RAM, HEAVY.lock (mkdir + owner.txt); SSR 2-D + 3-D must be 0 (else release + exit 2); fresh bundle;
  ports 8447 / 8477 / 8507; then ONE Python pass prints "stills written: N of M" (re-shoot list) + whole-movie coverage (k6r8c ∪ k6r8d lists) —
  no per-file stat from bash; then k6_overlap and the summary ending "N unique faults". Own log `build1/k6r8d_heavy_<date>.log`. Never renders,
  mixes, commits or deletes. Start: `nohup bash movies/src/ch00_coordinates_frames/checks/r8d_heavy.sh > /dev/null 2>&1 &`.
