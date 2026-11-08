# ch00_coordinates_sphere (#5c, Coordinates Part 3): remake 2026-11-07 log

Brief: `movies/ch00/coordinates_series/master_plan_2026-11-07.md` (R1, R3, R16, R19, §C), `continuity_plan.md` (§3 5c recall table and
teaser, §5 titles, §6 endings, §7 5c work list), `fact_check_2026-11-07.md` (Part 3 rows 5 and 6), `user_feedback_2026-11-06.md`,
HOUSE_STYLE §3, memory rules (no-opening-recaps, verify-every-fact, movie-spoken-wording, show-every-calculation, coordinates-series-continuity).
Reference: Part 2 remake (`movies/src/ch00_coordinates_storm/`, `kit_cs/SeriesTitle.tsx`, `Recall` in cs_lib.tsx, `checks/cst_r7_splice.py`).
Start state: rf1 (fix loop 1) narration, timing.json 2991.65 s = 49:51.65, 37 scenes, 735 cues. Nothing committed, nothing rendered, nothing deleted.

## 09:10 start
- Disk (`tools/disk_guard.py --report`): **C: 104.1 GB free, G: 439.7 GB free**, project data 146.61 GB of 150 (scratch 106.8).
- HEAVY.lock held by "orchestrator 5a fb1 render (fresh chunks) Sat Nov 7 09:09:38": static work first.
- **Stale render chunks**: `G:/…/ch00_coordinates_sphere/build1/render/` holds 31 files (c00.mp4 … with try logs) from the old build-1 / fix-1
  render. They must be moved aside by the orchestrator before the next render (cs_run.py render re-uses existing chunks silently).

## 09:12–09:30 source / script / storyboard / TSX (static work, no lock)
- **script.md**: s02_part2_recap cut (9 sentences); s06 S5–S6 fact-check row 5; s16 new S7 (cylindrical recall); s18 S12 "just as in Part 1, on
  the flat map"; s19 S0–S2 fact-check row 6 (S1 split, later sentences +1); s35 S10 + "about seventy four kilometres per degree at Brest",
  new S13 (ERA5 7.1 → 16.3), S14–S15 two-sentence teaser to Part 4. `tools/script_wording_lint.py` → **0 findings**.
  Backups (not deleted): `G:/…/ch00_coordinates_sphere/{script_rf1_before_r7.md, storyboard_rf1_before_r7.yaml, timing_rf1_before_r7.json}`.
- **TSX**: `kit_cs/SeriesTitle.tsx` (copy of Part 2's = Part 1's); s00 uses it (no "made easy", "Coordinates" pulses on its word);
  `S02` + `MiniPolar` removed from cs_sA and the scene map; `Recall` in cs_lib (port of Part 2's, + `verb`, + `side` layout);
  recalls in s08, s11, s16, s17 (replaces the keyword "Part 1: polar"), s18, s20 (replaces the plain "speed = radius × turning rate" label),
  s22 (replaces the bare `s = r θ`), s24, s30; s06 13 labels from cs.json par48 (the added ones at the middle of their Natural Earth
  crossing segment); s19 index shift +1 and keywords "Amphan's centre:" / "≈ 79 km to the west"; s35 16 sentences / 15 pictures (new ERA5
  bars mini with a source line, "Brest: ≈ 74 km per degree", teaser labels). tsc: **0 errors**.
- **storyboard.yaml** (`checks/r7_storyboard.py`, idempotent): s02 block removed; every voiceover = script paragraph; `recalls` and
  `remake_2026_11_07` notes on the changed scenes; s00 visual without "made easy"; s06 labels; top-level `remake_2026_11_07` block.
- **Splice tool** `checks/cs_r7_splice.py` (copy of Part 2's cst_r7_splice.py; OLD = build1/rf1/tts, which equals the current timing.json:
  454 sentences, 2989.15 s). `--plan`: 36 scenes, **438 sentences re-used, 11 new, 16 dropped** (s02 ×9, s06 ×2, s18 ×1, s19 ×2, s35 ×2).

### Fact table (new or changed claims, checked before TTS)
| Scene | Claim | Verdict | Source |
|---|---|---|---|
| s06 | 48.4° N runs through central Europe, Ukraine, southern Russia, Kazakhstan, the far west of China, Mongolia, north-east China, Russia's Far East; then the Pacific, the southern tip of Vancouver Island, the northern United States, eastern Canada, back across the Atlantic | OK | fact-check row 5 rewrite; Natural Earth crossings in cs.json `par48.seg`: Russia 39.9–46.5° E, China 85.8–88.4° E and 115.8–130.8° E, Mongolia 88.5–115.8° E, Russia 130.8–140.1° E (+ Sakhalin 142.1–142.7° E), Canada −124.0 to −123.5 (Vancouver I.; Victoria 48.43° N), USA −122.6 to −92.5, Canada −92.5 to −53.1 |
| s19 | Khulna is "much farther east and south" than Brest, "in South Asia" | OK | Khulna 22.8° N 89.6° E vs Brest 48.4° N 4.5° W; Bangladesh is in Southern Asia (UN M49) |
| s19 | "the centre of Cyclone Amphan … passed about seventy nine kilometres to its west" (May 2020) | OK | fact-check row 6 rewrite; Part 2 `cs.json amphan.close.Khulna` 79.36 km, west: true, 2020-05-20 16:50 UTC (IBTrACS v04r01 NI, interpolated) |
| s16 | Part 2's cylindrical coordinates = a distance out from an axis and a height along it | OK | Part 2 s15 (`(r, θ, z)`, "polar coordinates plus this height") |
| s18 | r hat was met in Part 1 on the flat map | OK | Part 1 cf_eq.ts EQ_S08 `r̂ = (r cos θ, r sin θ)/r` |
| s35 | one degree east at Brest ≈ 74 km | OK | cs.json `deg.dx1[3]` = 73.83 km (s24 says 73.8) |
| s35 | ERA5 2-m temperature, Sep 2026: plain mean ≈ 7.1 °C, cos φ-weighted ≈ 16.3 °C | OK | cs.json `t2m` plain 7.114, weighted 16.272 (fact-check Part 3 row script.md:334, OK) |
| s35 | Part 4: a weather station's own east, north and up arrows; they turn by themselves as the air moves; that turning adds extra terms to how the wind changes | OK | `movies/ch00/ch00_coordinates_frames/script.md` s00/s01, s15 (arrows turn), s24–s25 (dot with î: extra terms); continuity plan §3 teaser |
| recalls | x = r cos θ, y = r sin θ; s = r θ (θ in radians); r̂ = (r cos θ, r sin θ)/r; dθ/dt = v/r (shown as v = r dθ/dt); d(sin θ)/dθ = cos θ | OK | Part 1 cf_eq.ts EQ_S05, EQ_S07, EQ_S08; Part 2 cs_eq.ts EQ_S09, EQ_S04 |
- 09:30 s36 end card: the picture fades over the 75-frame hold (`1 − ramp(LEN − HOLD, LEN − 4)`, as Part 2's s42); symbol lint `--strict`
  **0 findings**; eq_check **24/24**, 0 missing, 0 unused; tsc 0. `cs_run.py stills --bundle` now moves the old bundle aside
  (`bundle_prev_<time>`) instead of deleting it. Wrapper scripts `checks/r7_tts.sh`, `checks/r7_mix.sh` (take / release the lock).
  s18 recall moved to y 750 after checking the old k6f1 stills (the Pythagoras rows reach y ≈ 668 during S12).
- 09:30 waiting for HEAVY.lock (orchestrator 5a render).
- 09:40 dry static check against an ESTIMATED timing (`G:/…/ch00_coordinates_sphere/r7_estimated_timing.json`: re-used clips at their
  rf1 lengths, new sentences at 0.0703 s per character → 2975.3 s; `at_check.mjs` reads `CS_TIMING`, swap_check / cam_speed `--timing`):
  at_check 489 refs / 0 failures · swap_check 325 elements, 0 overlaps, 1 tight swap (s35 teaser labels, 4 frames) → fixed (first label out
  14 frames before S15) → 0 · cam_speed 0 > 90 °/s (s06 tour 8–30 °/s between labels, computed by hand: spinPath is not in cam_speed).
  s06: the 13 names come up to 19 frames apart, so they now alternate above / below the parallel, each gone 8 frames before the next name on
  its own side. tsc 0.

## 11:49 user rule "show it, don't voice it" (coordinator 11:2x; clarified: keep RELATING the numbers in the voice)
Whole-script sweep (`checks/r7_arith.py`, idempotent; the list below is its ARITH table): 30 sentences in 20 scenes. On-screen rows unchanged;
the voice says what is combined and where it comes from, then the result. Re-cued AT() phrases: s11 S12, s15 S8, s16 S3, s20 S11, s21 S8/S12,
s23 S1/S4, s24 S8, s28 S3/S5/S6, s31 S7 (rows at SS+15/+40/+65)/S8, s34 S8. at_check (estimated timing) 489 refs / 0 failures, swap_check 0/0.
Splice plan now: 408 sentences re-used, 41 new, 46 dropped. Word-timestamp check (±0.5 s) and the number-split caption check run after the TTS.

| Scene | Old (voiced arithmetic) | New |
|---|---|---|
| s07_colatitude | For Brest, it's ninety minus forty eight point four, which is forty one point six degrees. | For Brest, taking its latitude away from ninety degrees leaves forty one point six degrees. |
| s11_longitude | Then Brest is at three hundred and sixty minus four point five, which is three hundred and fifty five point five degrees. | Then Brest, four and a half degrees short of a full turn, is at three hundred and fifty five point five degrees. |
| s15_brest_z | So z is six thousand three hundred and seventy one times zero point seven four seven eight, which is about four thousand seven hundred and sixty four kilometres. | Multiplying the two, z is about four thousand seven hundred and sixty four kilometres. |
| s15_brest_z | With easy numbers, six thousand four hundred times three quarters is four thousand eight hundred: about the same. | With easy numbers, it comes out at four thousand eight hundred: about the same. |
| s16_brest_axis_distance | So the distance from the axis is six thousand three hundred and seventy one times zero point six six three nine, which is about four thousand two hundred and thirty kilometres. | Times the Earth's radius, the distance from the axis is about four thousand two hundred and thirty kilometres. |
| s16_brest_axis_distance | With easy numbers, six thousand four hundred times two thirds is about four thousand two hundred and seventy: close. | With easy numbers, it's about four thousand two hundred and seventy: close. |
| s17_brest_top | So x is four thousand two hundred and thirty times zero point nine nine six nine, about four thousand two hundred and seventeen kilometres. | So x, the distance from the axis times this cosine, is about four thousand two hundred and seventeen kilometres. |
| s17_brest_top | So y is four thousand two hundred and thirty times minus zero point zero seven eight five, about minus three hundred and thirty two kilometres. | So y, the distance from the axis times this sine, is about minus three hundred and thirty two kilometres. |
| s18_position_vector | Then Pythagoras in the side view: the square root of four thousand two hundred and thirty squared, plus z squared, gives six thousand three hundred and seventy one. | Then Pythagoras in the side view, with that distance and z, gives six thousand three hundred and seventy one. |
| s19_khulna | So Khulna's height above the equator plane is six thousand three hundred and seventy one times zero point three eight seven five, about two thousand four hundred and sixty nine kilometres. | So Khulna's height above the equator plane, the Earth's radius times this sine, is about two thousand four hundred and sixty nine kilometres. |
| s20_spin_rate | A day of twenty four hours is one thousand four hundred and forty minutes, and one thousand four hundred and forty divided by three hundred and sixty is four minutes for each degree. | A day has one thousand four hundred and forty minutes, so each degree of turn takes four minutes. |
| s21_ground_speeds | So capital Omega is two pi divided by eighty six thousand one hundred and sixty four, which is about seven point two nine two times ten to the minus five radians per second. | So capital Omega, two pi divided by capital T, is about seven point two nine two times ten to the minus five radians per second. |
| s21_ground_speeds | So the ground moves at seven point two nine two times ten to the minus five, times six point three seven one million metres, which is about four hundred and sixty four point six metres per second. | So the ground moves at capital Omega times the Earth's radius, which is about four hundred and sixty four point six metres per second. |
| s21_ground_speeds | With easy numbers, the equator is two pi times six thousand four hundred kilometres, which is about forty thousand kilometres round. | With easy numbers, the equator is about forty thousand kilometres round. |
| s21_ground_speeds | Four hundred and sixty four point six times three point six is also about one thousand six hundred and seventy. | So four hundred and sixty four point six metres per second is also about one thousand six hundred and seventy kilometres per hour. |
| s21_ground_speeds | A passenger jet flies at about nine hundred kilometres per hour, and one thousand six hundred and seventy divided by nine hundred is about one point nine, so the ground at the equator moves almost twice as fast. | A passenger jet flies at about nine hundred kilometres per hour, so the ground at the equator moves almost twice as fast. |
| s22_distance_north | Times six thousand three hundred and seventy one kilometres, that's about one hundred and eleven point two kilometres. | Times the Earth's radius, that's about one hundred and eleven point two kilometres. |
| s22_distance_north | With easy numbers, six thousand four hundred times zero point zero one seven five is one hundred and twelve: about the same. | With easy numbers, it's about one hundred and twelve: about the same. |
| s23_north_examples | One minute of latitude is a sixtieth of a degree, so it's one hundred and eleven point two divided by sixty, which is about one point eight five kilometres. | One minute of latitude is a sixtieth of a degree: about one point eight five kilometres. |
| s23_north_examples | Forty eight point four degrees, times one hundred and eleven point two kilometres per degree, is about five thousand three hundred and eighty two kilometres. | At one hundred and eleven point two kilometres per degree, Brest's forty eight point four degrees come to about five thousand three hundred and eighty two kilometres. |
| s24_distance_east | For one degree at Brest, that's four thousand two hundred and thirty kilometres times zero point zero one seven four five, which is about seventy three point eight kilometres. | For one degree at Brest, the radius of its parallel times one degree in radians gives about seventy three point eight kilometres. |
| s28_box_areas | The radius squared is six thousand three hundred and seventy one squared, about forty point six million square kilometres. | The radius squared is about forty point six million square kilometres. |
| s28_box_areas | Times zero point zero zero four three six, and times zero point zero zero four three six again, that's about seven hundred and seventy three square kilometres, for a box on the equator. | Times that quarter degree in radians, twice, that's about seven hundred and seventy three square kilometres, for a box on the equator. |
| s28_box_areas | At Khulna, seven hundred and seventy three times zero point nine two one nine is about seven hundred and twelve square kilometres. | At Khulna, where cosine phi is zero point nine two one nine, it's about seven hundred and twelve square kilometres. |
| s28_box_areas | At Brest, times zero point six six three nine, it's about five hundred and thirteen. | At Brest, the equator box times Brest's cosine phi is about five hundred and thirteen. |
| s28_box_areas | At Longyearbyen, times zero point two zero four five, it's only about a hundred and fifty eight. | At Longyearbyen, with its much smaller cosine phi, it's only about a hundred and fifty eight. |
| s30_slope_of_sine | So cosine phi times delta phi is zero point nine zero six times zero point one seven four five, about zero point one five eight. | So cosine phi times delta phi is about zero point one five eight. |
| s31_adding_strips | Their steps in sine phi are zero point one seven four, zero point one six eight, and zero point one five eight. | Each strip's step is the sine at its top minus the sine at its bottom. |
| s31_adding_strips | They add up to zero point five, which is exactly the sine of thirty degrees. | Together, they add up to zero point five, which is exactly the sine of thirty degrees. |
| s34_global_mean | So the area-weighted average is thirty times one, plus zero times one half, all divided by one and a half. | So the area-weighted average multiplies each temperature by its weight, adds them up, and divides by the sum of the weights. |
- 11:49 `checks/r7_tts.sh` queued in the background (waits on HEAVY.lock, held by #5d r7 heavy 1): splice → make_timing --final → `checks/r7_wordtimes.py` (Kokoro word times of every reveal cued in a new sentence, ±0.5 s; caption cues must not split a number). Log `G:/…/ch00_coordinates_sphere/r7_tts.log`.

## 11:58 TTS splice (under HEAVY.lock, `checks/r7_tts.sh`, 11:4x–11:58)
- `cs_r7_splice.py`: resynth correlation OK; **408 re-used, 41 new** clips, each within 0.5 LU of its target and 1.5 LU of its neighbours
  (−15.91 … −16.65 LUFS), TP ≤ −1.67 dBTP. Narration **2900.325 s** (87 010 frames) + 2.5-s hold = **2902.825 s = 48:22.8** (was 49:51.65,
  −88.8 s); 36 scenes, 449 sentences, 6992 words, **712 cues**, TTS warnings none. `make_timing.py --final r7/tts`: chips K1 7:57, K2 24:51,
  K3 31:24, K4 43:33; chapter marks re-synced.
- `r7_wordtimes.py` (Kokoro word times of the 35 reveals cued inside new sentences): 30 within ±0.5 s, 5 outside → re-cued by the measured
  offset: s21 S5 Ω row +17 fr, s21 S7 U_eq +15, s28 S3 equator box +19, s35 S10 "Brest: ≈ 74 km" +28, s35 S14 teaser label −18.
- Caption number split: 1 (s35 S13 "about seven | point one") → `checks/r7_cuefix.py` moves the boundary before "about seven"
  (en.vtt / en.srt and the r7 copies; 13.9 cps); re-check 0 splits. NOTE: re-run r7_cuefix.py after any later `make_timing.py --final`.
- Light gates on the final timing: tsc 0 · at_check 489 refs / 0 failures · swap_check 325 elements, 0 overlaps, 0 tight swaps ·
  cam_speed 0 > 90 °/s · symbol lint --strict 0 · eq_check 24/24 · wording lint 0.
- Process note: `cs_static.sh` started its SSR step while #5b held the lock (my mistake, 11:59); stopped at once (killed), SSR re-run under the lock below.
- 12:03 disk before heavy jobs: C: 116.2 GB, G: 437.2 GB free; project data 148.91 GB of the 150-GB cap (scratch 108.86) — floors fine; the K6 stills and the r7 mix add ≈ 1.5 GB of scratch, so the cap will be crossed slightly (scratch only; nothing deleted per instruction). Queued `checks/r7_heavy.sh k6r7a` (SSR → mix → K6 whole list, lock taken and released per job).

## 12:06 opening rule (coordinator, 2026-11-07) + SSR finding
- s00 S0 "…see how meteorology uses them to measure distances and areas on its weather grids." → "…see how they're used to measure distances
  and areas on weather grids." · s01 S2 "Let's see how latitude and longitude are built, and how they turn into kilometres." → "Now let's dive
  into latitude and longitude, and how they turn into kilometres." Wording lint 0. s00 cross-fade cue now AT(0,"to measure") (in both texts).
- SSR (12:04, under the lock): 10 367 scene-frames, NaN 0, **1 error**: s08 recall `x = r cos θ, y = r sin θ` ended at x 1862 → moved to x 1372.
- The heavy chain k6r7a could not be stopped (kill denied by the session's permission guard), so its mix and K6 run on the pre-opening-rule
  timing: used only as an early look; the final mix and the final K6 come after the second TTS pass (r7_tts.sh now backs up r7/tts to
  r7/tts_pass1 first and runs r7_cuefix.py after make_timing).
- 12:24 squares/roots rule (coordinator): only s18 S7 voiced one ("the square root of x squared plus y squared …") → "squaring x and y, adding them and taking the square root gives back …" (added to r7_arith.py, 31 rows); its reveal cue "gives back" unchanged. Every other 'squared' is a formula name (radius squared) or a result. Wording lint 0. Folded into the second TTS pass (queued, waiting on the lock held by my own k6r7a stills).

## 12:3x house rule "every number says what it is" (coordinator)
Calculation rows that showed bare numbers now carry their symbol / name in the row (rhs prefix, so nothing grows left into the picture):
s15 easy row `z ≈ 6400 × ¾`; s16 `a cos φ ≈ 6400 × ⅔`; s18 `a cos φ = √(4217² + 332²)`, `a = √(4230² + 4764²)`; s19 `a² = 41² + …`,
`a = √40 589 771`; s21 `equator ≈ 2π × 6400 km`, `U_eq ≈ 40 000 km ÷ 24 h`, `U_eq = 464.6 m/s × 3.6`, `ground ÷ jet = 1670 ÷ 900`,
`U_Singapore / U_Khulna / U_Brest / U_Longyearbyen = 464.6 × cos φ`; s22 `Δy ≈ 6400 × 0.0175`; s23 `1′ = 111.2 km ÷ 60`, `Δy = 48.4 × 111.2 km`;
s28 `ΔA_eq = 40.59 × 10⁶ × 0.0043633`, `ΔA_Khulna / ΔA_Brest / ΔA_Longyearbyen = 772.8 × cos φ` (the intermediate 712.4 / 513.1 / 158.0
dropped for width); s30 `Δφ = 10° = … ≈ 0.1745 rad`, `cos φ Δφ ≈ 0.906 × 0.1745`, `Δ(sin φ) = sin 30° − sin 20°` / `= 0.5 − 0.342 = 0.158`;
s31 label "steps in sin φ, one per strip" over the step rows; s34 `weighted = 30 ÷ 1.5 = 20 °C`. Rows already labelled (T, Ω, cos 0°, U_eq,
1 m/s, noon to noon, a day, sin/cos values, place rows, a², 2πa², 4πa², plain / weights) unchanged. tsc 0, symbol lint --strict 0;
width guards checked by the SSR after the second TTS pass.

## 12:4x house rule "say and highlight the inputs" (coordinator) + label balance
- Inputs a viewer can't see at a glance are said and pulse gold (CalcStack row `glow: pulse(f, <word>, 30)`, ≈ 1 s) on the word that says
  them; the scene's answer pulses on its result word: s15 a = 6371, sin 48.4°, z; s16 cos 48.4°, the radius row, ≈ 4230; s17 cos(−4.5°),
  sin(−4.5°), x, y; s19 sin 22.8°, cos 22.8°, cos 89.6°, sin 89.6°; s21 T, U_eq, Singapore / Khulna / Brest / Longyearbyen cos φ rows;
  s22 1° in rad, the radius row; s24 the Δx answer line; s28 the quarter degree in rad, ΔA_eq, Khulna; s30 Δφ, cos 25°, cos φ Δφ (28 rows + 1 line).
- The Earth's radius is said again where it is the input: s16 S3 and s22 S12 "Times the Earth's radius, six thousand three hundred and
  seventy one kilometres, …" (2 more re-voiced sentences in the second TTS pass).
- `r7_wordtimes.py` now also checks every highlight cue (re-used sentences included) against Kokoro word times (±0.5 s).
- Label balance (coordinator): the Singapore and Longyearbyen U rows keep a bare `U` (the place is on the row above); the stills decide the rest.
- 13:06 **K6 early look k6r7a** (whole house list, 4622 frames, pre-opening-rule timing, bundle of 12:23): **1 hit** — s21 f46252 text-text: the paging T row slides under `U = Ω a cos φ` → stack y 230 → 252. r7 mix of that timing: −16.01 LUFS, TP −3.0 dBTP (superseded by the final mix).
- 13:17 lock protocol (two slots): TTS pass 2 now runs under VOICE.lock (`checks/r7_tts_voice.sh`; waits while HEAVY.lock is K6/stills/SSR; free RAM 15.8 GB ≥ 8); `r7_mix.sh` switched to VOICE.lock the same way. NOTE: the older queued `r7_tts.sh` (waiting on HEAVY.lock since 12:06; the kill was denied) will re-run the same splice when it gets HEAVY.lock — deterministic (cached clips, same script), so it rewrites identical outputs; harmless but it occupies HEAVY for ≈ 2 min.

## 13:24 TTS pass 2 (VOICE.lock): opening rule + squares rule + radius values
- Splice vs rf1: 406 re-used, 45 new (the 41 of pass 1 from the cache + s00 S0, s01 S2, s16 S3, s18 S7, s22 S12 re-voiced; level checks OK).
  Narration **2906.700 s** (87 201 frames) + 2.5-s hold = **2909.2 s = 48:29.2**; 36 scenes, 449 sentences, **712 cues**, warnings none;
  chips K1 7:56, K2 24:50, K3 31:31, K4 43:39. `r7_cuefix.py`: s35 S13 boundary moved again → **0 number splits**.
- Word times (`r7_wordtimes.py`, 59 reveals: every cue in a new sentence + every highlight): 47 within ±0.5 s; the 5 re-cued in pass 1
  keep their measured offsets (the checker reports raw AT); 7 more re-cued by their measured offset: s01 "kilometres" −16 fr, s16 radius
  +17, s19 cos 22.8° +15, s21 Khulna +16 / Brest +16 / Longyearbyen −16, s22 radius +16.
- Light gates (final timing): tsc 0 · at_check 510 refs / 0 failures · swap_check 326 elements, 0 overlaps, 0 tight swaps · cam_speed 0 >
  90 °/s · symbol lint --strict 0 · eq_check 24/24 · wording lint 0 · captions max 16.8 cps, max line 42 chars, order OK.
- 13:32 tightened lock protocol applied: `checks/voice_ok.py` (HEAVY free or a full render, RAM ≥ 8 GB) gates the r7 mix after it takes VOICE.lock (VOICE released while it waits, so no deadlock); `cs_run.py` (stills / K6) and `ssr/run.mjs` now wait while VOICE.lock exists.
- 14:39 memory rule: the r7 mix running now overlapped a HEAVY job (≈ 11.5 GB; it started under the previous rule). Future mixes: `voice_ok.py --mix` = HEAVY.lock free and ≥ 14 GB free at start (r7_mix.sh updated).

## 15:27 final mix + SSR + K6 k6r7b
- **Mix** (`r7_mix.sh` → `G:/…/build1/sound_r7/narration_music_cs.wav`, meridian-glass seed 31, bed −28, duck 5 dB, 2.5-s tail):
  **−16.01 LUFS, true peak −3.32 dBTP → PASS**; `sound/check.py --kind mix`: I −16.0, LRA 4.6, TP −3.3, OK (clicks counter 6039 = narration
  plosives, as the rf1 mix). Soundtrack 2909.2 s.
- **SSR** (under HEAVY): 10 418 scene-frames, NaN 0, **5 errors** — the new number labels ran past x 1842 in s16 (easy row), s21 (equator
  row), s23 (1′ row), s28 (ΔA rows), s30 (Δφ row); the same in SSR --3d (7544 frames). Those scenes' stills failed in K6.
- **K6 k6r7b** (4622 listed, 3766 rendered because of the 5 scenes above): 6 hits, all s31 — the new "steps in sin φ" label sat on the
  0° / 30° / 60° axis ticks.
- Fixes (label balance: least-needed labels dropped first): s16 easy row back to `6400 × ⅔ ≈ 4270` (the a cos φ row is right above);
  s21 `equator ≈ 2π × 6400 ≈ 40 000 km`; s23 `1′ = 111.2 ÷ 60 ≈ 1.85 km`; s28 `ΔA = 772.8 × cos φ` (place names are on the tiles);
  s30 `Δφ = 10 × π/180 ≈ 0.1745 rad` (Δφ as lhs, "10°" dropped: the voice and the 20°/30° tags carry it); s31 label removed (the staircase
  and the row text say it). tsc 0. K6 frame list regenerated for the final timing (k6r7_frames.txt).
- 15:30 series order (orchestrator: Part 1 first on HEAVY): `cs_run.py` stills now honours `<S>/WAIT_5A` — it hands our HEAVY.lock back,
  waits until a "#5a" hold has come and gone (and an "orchestrator 5a … render" after it), re-takes HEAVY, then builds the bundle and
  shoots k6r7c. WAIT_5A is set. SSR k6r7c (15:28) holds HEAVY while waiting for VOICE (#5d TTS), per the tightened rule.
- Looked at k6r7b stills (sheets of s00, s01, s06 ×2, s08, s11, s17, s18, s19, s20, s22, s24, s29, s35 ×2, s36): title layout as Parts 1–2,
  no "made easy"; s06 names alternate above / below the parallel (Russia above, Ukraine below; Pacific on the limb); recalls readable and
  clear of pictures (s08 right of the flat face, s11 above the magnifier, s17 / s18 / s20 side layout / s22 / s24); s19 keywords; s35 teaser
  icon + "Part 4: turning frames"; end card. Fixed after looking: s35 ERA5 bars were thin and the labels sat on them → bars 28 px/°C × 80 px,
  labels 35 px above. The "12 reveals outside ±0.5 s" of the pass-2 report = 5 already re-cued in pass 1 (the checker prints raw AT) + 7
  re-cued at 13:24: all 12 now within ±0.5 s by measurement.
- 16:27 SSR k6r7c (15:28–15:36): 10 418 + 7544 scene-frames, NaN 0, **2 errors** (width): s23 `Δy = 48.4 × 111.2 km…` (x 1976) → Δy as the row's lhs; s30 `cos φ Δφ ≈ 0.906 × 0.1745` (x 1981) → back to the bare product (cos 25° and Δφ are the two rows right above it: the label was clutter). These two scenes' stills fail in k6r7c (bundle built 16:25, before the fix). #5a K6 came and went 15:36–16:25; k6r7c shooting since 16:25.
- 17:07 RENDER2 slot: `voice_ok.py --heavy` (≥ 12 GB free while RENDER2.lock exists) now gates cs_run.py stills and the r7_heavy SSR step; `--mix` also requires no RENDER2.lock. k6r7c (running since 16:25) passes the 12-GB check at this moment.

## 17:09 K6 k6r7c (whole house list, final timing; bundle of 16:25)
- **PASS: 4506 frames, 0 hits** (1909 INFO owner / end-label exemptions). 112 listed frames missing = s23 and s30 (their width errors were
  fixed after the bundle was built). The end-of-chain "syntax error" line is from editing r7_heavy.sh while it ran (after K6; harmless).
- Queued `checks/r7_k6fill.sh`: SSR re-check, then the 112 missing frames shot INTO k6r7c (new bundle; k6r7c logs of pass 1 kept in
  `_logs_pass1/`), then k6_overlap over the whole k6r7c folder = the whole house list in ONE tag folder.
- 17:51 fill 1 (17:43–17:51): SSR 1 error left (s23 row with Δy lhs still x 1908) → s23 row back to the original `48.4 × 111.2 km ≈ 5382 km` (label balance: the voice and the 1′ row above make it obvious); k6r7c now 4572 frames, **0 hits**; s23's 46 frames still to shoot (fill 2).

## 17:59 DONE (no render, no commit, nothing deleted)
- Fill 2 (17:51–17:59): **SSR 10 418 + 7544 scene-frames, 0 errors, NaN 0**; **K6 k6r7c = 4618 / 4618 frames of the house list, 0 hits**
  (2042 INFO exemptions) — one tag folder.
- Looked at the k6r7c stills of s15, s16 (cylindrical recall), s21 ×2, s23, s28, s30 ×2, s31, s34, s35 (ERA5 bars), s36: clean.
- Final: 48:29.2 (2906.700 s + 2.5-s hold), 36 scenes, 449 sentences, 712 cues; mix −16.01 LUFS / −3.32 dBTP.
- Disk after: C: 111.7 GB, G: 429.4 GB free; project data 156.53 GB (scratch 116.48; the guard now reports a 250-GB cap).
- Render dir `build1/render/` still holds 31 old chunk files (rf1 / build 1): **move aside before rendering**.

## Pass 2 (user feedback 2026-11-07 22:20)
Brief: `user_feedback_2026-11-07.md` (verbatim) + orchestrator notes (the old frames, 31:40/28:23 judgement, meridians end at both poles).
The user watched `5c_coordinates_sphere_build1.mp4` = 2902.87 s = the **d27c24f** timing (48:22.9), not fix1; old times mapped with that
timing.json (`git show d27c24f:…/timing.json`). Narration unchanged (no re-voice): timing.json, en.vtt / en.srt, script.md identical to HEAD;
the r7 mix (`build1/sound_r7/narration_music_cs.wav`, −16.01 LUFS / −3.32 dBTP) stays valid.

### 22:40–23:50 source (no lock)
- Disk before: **C: 110.5 GB, G: 423.5 GB free** (project data 162.4 of 250 GB).
- `cs_run.py`: the render path no longer calls `guard()` (no lock / memory gate between chunks; the r7 render deadlocked there). New
  `disk_only()` (C: ≥ 45 GB, G: ≥ 50 GB, TEMP on G:) once before render / join; `guard()` only for stills.
- Backups (moved copies, nothing deleted): `G:/…/ch00_coordinates_sphere/p2_backup/` (cs.json, manifest.json, img/, script, storyboard, timing, vtt, srt).

| User point (old time, d27c24f) | Scene → r7 time | Cause seen in the old frame | Change |
|---|---|---|---|
| 5:59–8:49 "not the Earth, a blank circle" + wrong credit | s07 4:57.9, s08 5:49.3 (and s05, s14–s16, s19, s22, s23) | `camFace` looked at the cut face 15° from frontal; the kept textured half lies BEHIND the face, so only the brown section showed; the credit named Natural Earth but no coastline is drawn on a cut Earth | `camFace` 50° from frontal, 12° up (cross-product Part 2 half-Earth: 38°/12°); Europe/Africa show as a crescent beside Brest's rim. First look (40°/18°) gave a thin sliver → 50°/12°. Title, s04, s06 cameras the same. Credits: `SRC_BM` "Image: NASA Blue Marble Next Generation" on cut Earths (TwoView, s05, s07, s13); s04/s06 swap credits with the coastline (8-frame gaps) |
| 15:22 slide-away | s14 14:04.8 S4 | the removed half travelled 2.2 radii and was cut by the 3-D frame's edge | it moves 0.2 radii (inside the frame's spare room) and fades (`(1−s)²`) |
| 14:13–16:00 "slice along x, y, z … a little hollow … x, y, z start at the middle" | s13 12:52.0 | translucent globe, axes as SVG lines | `kit_cs/earth.tsx` `OctantEarth`: three coordinate planes cut the Earth into 8 textured pieces with their quarter-disc faces, 0.05-radius gaps opening on S2 "all starting at the Earth's centre"; the 0–90° E northern piece lifts out and fades → a corner hollow where the 3-D axis rods meet at the gold centre; Brest's arrow (S10, `octShift`) follows its piece. Labels: Gulf of Guinea under its dot, Indian Ocean above-left, "Bay of Bengal" dropped (said, least needed); axis letters leave before the camera swings back (they sat on the column); return swing 56 °/s |
| 24:55–25:20 "straight line … going inside the Earth" | s20 22:45.5 | the spin axis an SVG dashed line across an opaque globe; the far half of the parallel drawn over the globe | `Axis3D` (depth-tested rod: visible outside, hidden inside); during S1–S12 (the parallel and its radius a cos φ, which runs inside) the Earth is half see-through (alpha 0.5) and the radius is a 3-D rod; far half of the ring only while see-through; "axis" label at its top end on "round its axis" |
| 26:03 "middle line … inside the globe" | s21 24:54.8 | same SVG axis | `Axis3D` hidden inside the opaque Earth |
| (same class, not named) | s25, s29, s06 | SVG axis / strip radius over the globe; s06 centre/axis marks stayed on the closed globe | s25 `Axis3D` through its translucent globe; s29 axis + strip radius as 3-D rods, Earth half see-through from S7; s06 inside marks + their callouts leave when the cap closes (`tSoon`) |
| 28:23 (consider 3-D) | s22 27:51.5 S4 | the face-on disc | covered by the new `camFace`: the meridian circle is drawn on a visibly cut 3-D Earth |
| 29:39–29:46 blank circle + credit | s22 S14–S15 | as 5:59 | as 5:59 |
| 31:40 (user unsure) | s24 30:25.0 S8 | already a 3-D slice: the cap lifted off Brest's parallel and its disc seen from above | **kept** (a first-time learner sees the parallel's own disc and centre on the axis; a different view would add nothing); look still f52939 |
| meridians end at both poles (orchestrator) | s09, s10, s12, graticule | graticule meridians −88…88°; s10's gold prime meridian shrank back with the camera's latitude (to ≈ 50° S) during the zoom-out | graticule −90…90°; s10 line stays at the South Pole once reached. No continuation / opposite meridian drawn or voiced (user cancel) |
| 45:22 horizontal lines on the ERA5 map | s34 43:39.6 S11 | **cause:** Natural Earth ends the lines that meet the antimeridian (Chukotka, Wrangel Island, Fiji, Antarctica) with a point at exactly lon = +180°; `fluidpy.geo.mapproj.forward("equalearth", …)` wraps +180° to −180°, so that one point landed on the far-left edge and its segment ran across the whole map (7 such steps: y ≈ +0.91, +0.87, −0.25, −0.99 of the half-height) | fixed at the source in `movies/data/build_ch00_coordinates_sphere.py`: every ±180° point keeps the side of its own line (sign of its neighbour, 1e-6° inside) and any real ±180° step would split the line; new CHECK DS29 "15 points at ±180° kept on their own side, 0 lines split; max step 0.037 < 0.3" (76/76 PASS). The dashed lines at ±60° are the labelled polar-cap marks ("60–90° N and S"), kept |

- Data rebuild: only `t2m.coast_ee` lines 93/94/98/101/102 changed, plus `skips` (now the r7 times; the TSX reads timing.json anyway); images
  byte-identical; manifest rehashed.
- Fact check: no new claim (no voice change).
- 23:45 look 1 (`stills/p2look1`, 39 frames) → 40°/18° sliver, s13 labels, s00 title still face-on, s06 end → fixed; 23:49 look 2 (`stills/p2look2`, 24 frames): clean.
- Static gates (final source): tsc 0 · at_check 512 refs / 0 failures · swap_check 327 elements, 0 overlaps, 0 tight swaps · cam_speed 0 > 90 °/s
  (s00 camA 43, s04 31, s13 56, s21 26 °/s) · symbol lint --strict 0 · eq_check 24/24 · wording lint 0.
- 23:51 SSR + K6 `k6p2a` started under HEAVY; **stopped at the orchestrator's request (renders first)** during SSR, HEAVY released, nothing
  shot. Re-queued as `checks/p2_heavy.sh k6p2b` (waits for RENDER2 = "orchestrator 5a fix2 full render", HEAVY + VOICE free, ≥ 12 GB).
- 00:0x (11-08) the queued `p2_heavy.sh k6p2b` was **killed by the session's memory-pressure reaper while it was still waiting** for RENDER2 (it
  never took HEAVY.lock, shot nothing, left no lock). Not restarted (reaper rule): the orchestrator re-runs it (command in the hand-off).
  Disk after: **C: 111 GB, G: 424 GB free**. No render, no commit, nothing deleted.
