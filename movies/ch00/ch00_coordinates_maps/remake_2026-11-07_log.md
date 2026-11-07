# ch00_coordinates_maps (#5g, Coordinates Part 7, the LAST part): remake 2026-11-07 log

**Brief.** These sources were read:
- `movies/ch00/coordinates_series/master_plan_2026-11-07.md` (R1, R3, R16, R19, §C);
- `continuity_plan.md` (§3: the 5g recall table and teaser; §5 titles; §6 endings; §7: the 5g work list);
- `fact_check_2026-11-07.md` (Part 7: one non-OK row, summary row 7, s19 "about a hundred" → "a few hundred");
- `user_feedback_2026-11-06.md`;
- `movies/HOUSE_STYLE.md` §3 (series parts, natural openings, ending), §4, §6 (show the arithmetic, voice the meaning; label numbers; say and highlight non-obvious inputs; no clutter);
- the memory rules (no opening recaps, natural openings, verify every fact, movie spoken wording, show every calculation).

**Reference.** Part 6's remake (`ch00_coordinates_routes/remake_2026-11-07_log.md`, commit 24a43b1) and its tools in
`movies/src/ch00_coordinates_routes/checks/`; its teaser into this part (s14 S7–S8): "In Part 7, we'll flatten the Earth onto
maps, and work out exactly what each map stretches. That explains why the rhumb line comes out straight on the most famous map of
all, and why weather data on a grid need care near the poles." This part's s01 lead-in picks that up (flat square map / weather
data on a grid, Mercator's map where the rhumb line is straight, equal-area maps).

**Start state.** The light-phase build of 2026-11-05 (calc audit, Part 1 lessons) + the 2026-11-06 opening-line fix (commit 587f71e).
- timing.json PROVISIONAL (dryrun3_spliced + 7 estimated sentences, 1948.93 s). **No final TTS, no mix, no stills, no render ever.**
- Dry runs on G:: `dryrun3` (full script, with narration.wav), `dryrun1` (with wav), `mini_s02` (s02 alone, with wav), `dryrun2` (log only),
  `dryrun3_spliced` (timing only, no wav).
- s00 still drew 'Coordinates · Part 7' small, 'Maps' 150 px and a pulsing **'made easy'** (88 px).

Nothing is committed, rendered or deleted by this session. Pre-remake copies: session scratchpad `mp_before_r7/` (script, storyboard,
timing, manifest, the TSX files, mp_eq.ts, the builder); git HEAD holds them too.

## 13:45 start
- Disk (shutil): **C: 124.6 GB free, G: 465.6 GB free**. (`tools/disk_guard.py --report` started; slow, see below.)
- Locks: HEAVY.lock held by "#5b r8 SSR + K6 k6z1" (13:29); VOICE.lock free. Part 6's queue (`ch00_coordinates_routes/r7_queue.log`)
  says "phase V queued 13:39:08" (waiting for #5a–#5e to finish). So all of this session is static work.
- **Old render chunks:** `G:/…/scratch/movies/ch00_coordinates_maps/build1/` holds `public/` (the 10 image/bin assets) and `tmp/` only.
  **There is no `render/` folder and there are no old chunks** (5g was never rendered).
- `tools/disk_guard.py --report` (13:45, finished later): **C: 116.0 GB free (floor 40), G: 433.7 GB free (floor 50)** (GiB); project data
  152.55 GB of 150 (scratch 112.51). Per the no-G:-cleanup rule, nothing was cleaned.

## 13:50 narration (`checks/r7_text.py`, idempotent; script.md + storyboard voiceovers)
`tools/script_wording_lint.py` found **13 findings (the 9 voiced-arithmetic lines, with repeats, + "how meteorology uses") → 0**.

| Scene | Change | Rule |
|---|---|---|
| s00 | "In this video, we'll learn how coordinates flatten our round Earth into maps, and see how they're used to draw weather maps, and to read the winds high above the North Pole." (was "…map projections, and see how meteorology uses them …") | R1, natural openings |
| s01 S2 | "Now let's dive into the maps themselves: the flat square map that weather data come on, Mercator's map, where the rhumb line comes out straight, and maps that keep areas true, with exactly what each one stretches." (picks up Part 6's teaser; S0, S1, S3 re-used) | natural openings |
| s02_part6_recap | **Cut.** Its facts are recalled at their point of use (below). | §C, no-opening-recaps |
| s04 S6 | the letter a where first used: "…which, as in Part 3, we write as the letter a, about 6371 km, so the equator is about forty thousand kilometres long." | R16; input said |
| s04 S8, S12 | "That's the arc rule, which we found in Part 1." / "That's the distance north, which we found in Part 3." | R16 |
| s04 S14 | Brest introduced: "the port city at the western tip of France that we met in Part 3" | introduce every place |
| s04 S16–S17 | "So x, the Earth's radius times lambda, comes to about minus five hundred kilometres …" (no "6371 times −0.0785"); y alike | show it, don't voice it |
| s05 S4, S6 | "So its true length, two pi times that radius, is about 26 580 km." / "…stretched: dividing the drawn length by the true length gives about one point five." | show it, don't voice it |
| s05 S10–S12 | the cosines voiced as inputs, the divisions not ("At Brest, the cosine of phi is 0.664, so k is about one point five."); Longyearbyen introduced ("the Arctic town on Svalbard that we met in Part 3") | inputs said; show it |
| s06 new S3 | "In Part 6, we called the distance walked for each radian of a coordinate its scale factor: the Earth's radius for latitude, and the radius times cosine phi for longitude." | R16 (the scale factors were only in the cut recap) |
| s06 S7 | "So we divide by the true distance east, 73.8 km, as we found in Part 3, not by the 111.2 km of a degree north." | R16 |
| s08 S10 | "At Brest, where the stretch is 1.506, Mercator draws it about 167.4 km long." | show it; input said |
| s09 S6 | "So the first drawn step, ten degrees in radians times that stretch, is about 0.175 Earth radii, or about 1116 km." | show it, don't voice it |
| s10 S9, S13 | "adding half the latitude to forty five degrees gives seventy five degrees" / "forty five degrees plus half its latitude gives 69.2 degrees" | show it, don't voice it |
| s10 S10, S15 | "…and the l n of that is 1.317" / "Brest sits 0.968 Earth radii above the equator" | show it, don't voice it |
| s11 S6, S13 | "Dividing the difference by that step gives about two point zero zero." / "3.13 Earth radii" | show it, don't voice it |
| s12 S3, S7 | "A rhumb line, as we saw in Part 6, keeps one compass bearing." / "For Part 6's rhumb line from London to Los Angeles, at 258.5°, …" | R16 |
| s13 S3, S5, S7, S10 | "Its area is ten thousand square kilometres." / "two hundred kilometres wide and two hundred tall, an area of 40 000 km²" / "k is about 4.9, and squaring it gives about 24, so areas there are drawn about 24 times too big" / "Dividing Africa's area by Greenland's gives about fourteen" | show it, don't voice it |
| s19 S1, S2 | "…draw its local east and north arrows, as in Part 4." / "it's exactly the theta hat of Part 1 at that point." | R16 |
| s19 S9 | "…thousands of kilometres across, instead of a few hundred." | R19, fact row 7 |
| s20 S9–S11, S14 | Pythagoras in words / "divide each leg by that distance" / "As in Part 1, the radial wind is the dot product of the wind with r hat: we multiply u by r hat's first part and v by its second, and add them, which gives about minus four and a half." / "Doing the same with theta hat's two parts gives about 8.9." | show it, don't voice it; R16 |
| s21 S3 | "…split the wind at each point on it into its round and in and out parts with the pole as the origin, and average round the ring, as in Part 1." | R16 |
| s22 | 8 → 10 sentences: the recap carries its numbers (1.5 at Brest, 73.8 km, Brest 6167 km up Mercator's map, 24 times at Svalbard); S7 closes the series ("With that, our seven parts on coordinates are complete, from arrows on a flat map to winds over the whole round Earth."); S8–S9 the teaser ("Next in this series comes the gradient: how fast, and in which direction, temperature or pressure changes across a map. It's where the one over the Earth's radius times cosine phi that we met here does its real work.") | R3, continuity §3/§6 |

Unchanged scenes: s03, s07, s14, s15, s16, s17, s18, s23 (s17 S12 and s18 S10 were re-worded after the 2026-11-05 dry run and are
voiced new in the splice).

**Splice plan** (`checks/mp_r7_splice.py --plan`): 23 scenes, 281 sentences; **232 re-used** measured clips (dryrun3 / dryrun1 /
mini_s02) and **49 new** (incl. the 7 previously only-estimated sentences and the two post-dry-run rewordings).

### Fact table (new or changed claims, checked before TTS)
| Scene | Claim | Verdict | Source |
|---|---|---|---|
| s00, s01 | weather data come on the flat square (lat-lon) grid; the rhumb line is straight on Mercator's map; equal-area maps keep areas | OK | fact_check Part 7 rows script.md:164, :214 (OK); this part's s12 derivation |
| s04 S6 | Part 3 named the Earth's radius a, 6371 km | OK | Part 3 script ("We call it a."); builder DM00 EARTH_RADIUS = 6371 km |
| s04 S8 | Part 1 found the arc rule | OK | Part 1 script ("the arc length, is the radius times the angle") |
| s04 S12, s08 S4 | Part 3 found the distance north = a Δφ | OK | Part 3 script ("delta y, the distance north, equals the Earth's radius times delta phi") |
| s04 S14 | Brest is a port city at the western tip of France, met in Part 3 | OK | Brest, Finistère (Brittany), major port at France's western tip; Part 3 uses Brest throughout |
| s05 S12 | Longyearbyen is an Arctic town on Svalbard, met in Part 3 | OK | Longyearbyen 78.22 N 15.65 E, Svalbard (Norway); Part 3 README |
| s06 S3 | Part 6 called the metres walked per radian of a coordinate its scale factor: a for latitude, a cos φ for longitude | OK | Part 6 script s04 ("That multiplier … is called a scale factor"; "the scale factor of latitude is the Earth's radius"; "…of longitude is the Earth's radius times cosine phi") |
| s06 S7 | Part 3 found 73.8 km per degree east at Brest (111.2 km per degree north) | OK | Part 3 script ("…about seventy three point eight kilometres"); builder DM01 (arc_lengths 111.19 / 73.84) |
| s10 S0 | Part 3 met integration as adding up | OK | Part 3 script ("This adding up of thinner and thinner strips has a name: integration.") |
| s12 S3, S7 | Part 6's rhumb line London–Los Angeles holds 258.5° | OK | Part 6 script s12; builder DM13 258.49° |
| s19 S1 / S2 | Part 4 drew local east and north arrows; θ̂ is Part 1's | OK | Part 4 script ("I hat points east, j hat points north …"); Part 1 polar unit vectors |
| s19 S9 | a hurricane is a few hundred km across | OK (fact_check summary row 7 applied) | NHC TCR AL092022 (Ian): tropical-storm winds ≈ 140 n mi (≈ 260 km) from the centre |
| s20 S11 | Part 1: components as dot products with r̂, θ̂ | OK | Part 1 script (u_r = u cos θ + v sin θ = u · r̂) |
| s21 S3 | Part 1 split the wind round a ring and averaged it | OK | Part 1 script ("Then we average each part round the ring: we add up the seventy two values, and divide by seventy two.") |
| s22 S7 | the seven parts run from arrows on a flat map (Part 1) to winds over the whole Earth (Parts 3–7) | OK | series plan v6 #5a–#5g |
| s22 S8–S9 | the gradient (#6) is how fast and in which direction T or p changes across a map; it uses 1/(a cos φ) ∂/∂λ | OK | #6 script s22 (eastward slope on the sphere, recalled from "Coordinates, Part 7"); continuity_plan §3 |
| all | numbers re-voiced (6371, 0.664, 0.5, 0.204, 1.506, 167.4, 0.175, 1116, 75°, 3.732, 1.317, 69.2°, 0.968, 6167, 2.00, 3.13, 19 950, 10 000, 40 000, 24, 14, 1118, 0.447, 0.894, −4.5, 8.9, 73.8, 111.2, 258.5) | OK | builder CHECK rows (122/122 pass) and CHECK_A/B/C in the scene files |

## 13:55 composition (static): `mp_lib.tsx`, `mp_sA/B/C.tsx`, `kit_mp/SeriesTitle.tsx` (new; a copy of Part 6's), `CoordinatesMaps.tsx` (doc comment)
**mp_lib.** Ported from Part 6's rt_lib: `AT()` timed from Kokoro word timestamps when `mp_words.py` has found the phrase (else the
character estimate); `HL()` gold glow; `Recall`; `$…$` maths in `Lbl` / `Keyword` (MathLbl); `SideCallout`'s width guard uses `mixW`.

**s00.** `SeriesTitle`: "Coordinates" (150 px, gradient) pulsing on "coordinates"; "Part 7 · Maps"; "map projections" / "and the view
from the pole". The old 'Coordinates · Part 7' (64 px), 'Maps' (150 px) and the pulsing 'made easy' (88 px) are gone. Part B cross-fades
on "they're used"; the Part A morph (globe → gores → plate carrée → Mercator) is time-scaled to finish before it.
**s01.** No picture change; the Mercator map's pulse cues on "Mercator's map". **s02.** The component was removed (PartThumb exported).
**s04.** Recall 'a ≈ 6371 km' + 'from Part 3: the Earth's radius' (y 520, glow on "six thousand"); Recall 's = r θ' + 'derived in Part 1:
arc length' (y 330; 'θ → λ, r → a' moved to x XC+260); Recall 'Δy = a Δφ' + 'derived in Part 3: distance north' (y 330); the radians row
glows on "zero point". **s05.** 'derived in Part 3: radius of a parallel' (y 610); the division row cues on "dividing"; '1/0.664',
'1/0.5', '1/0.204' appear and glow on their cosine words. **s06.** New S3, so every later cue shifted by one sentence (tR = the new S3;
t3…t11 keep their old meaning); Recall 'h_φ = a, h_λ = a cos φ' (the former s02 equation EQ_S02) + 'derived in Part 6: scale factors'
(y 420); Recall 'Δx = a cos φ Δλ ≈ 73.8 km' + 'derived in Part 3: distances' (y 420, glow on "seventy three"). **s08.** 'derived in
Part 3: distance north' (y 480); the Brest row cues on "where the stretch" and glows on "one point five zero six". **s09.** The table
head '1/cos' in TeX. **s10.** 'derived in Part 3: integration' (y 250); rows '45° + 60°/2 = 75°', '45° + 48.4°/2 = 69.2°' (the half
latitude labelled); the tangent rows glow. **s12.** 'derived in Part 6: rhumb line, one bearing' (y 110, two lines) replaces the
keyword. **s13.** Cues on "two hundred kilometres wide" / "squaring it"; '40 000 km²: 4 times' (x Bp+190). **s19.** 'derived in Part 4:
east, north' (y 480); Recall 'θ̂, r̂' + 'derived in Part 1: polar unit vectors' (y 560); the bar label 'hurricane: a few hundred km'
(bar 52 px, was 12). **s20.** Cues on "divide each leg" / "we multiply u" / S14; 'derived in Part 1: components' (y 120). **s21.**
Recall 'ū = (1/N) Σ u_i' + 'derived in Part 1: ring averages' (y 580, size 46). **s22.** 10 beats: '× 1.5 at Brest' on the
flat-square mini; 'Brest ≈ 6167 km' on the ladder; 'Mercator: × 24 at Svalbard' under the Equal Earth mini; S7 the seven part thumbnails
(all lit) + 'coordinates: all seven parts'; S8–S9 the isotherm picture, 'next: The gradient', and '1/(a cos φ) ∂T/∂λ' (gold, glowing on
"one over"). **s23.** The whole end card fades out with the music over the 75-frame hold (`1 − ramp(LEN − HOLD, LEN − 4)`) (R3).

**Symbol lint C5** (newer than 5g's last pass): **33 findings → 0** (σ/φ/π/Δ/cos/×/x/e/T/r labels → `$…$`; the '1/cos' head in TeX).
Two swap-check false positives from the wider `$…$` source strings were removed (TeX head; the s13 label moved 60 px right).

**Data builder.** `CHAPTERS` lost the s02 mark; the s02 calls are re-labelled s06 / s12 (Part 3 / Part 6 recalls). Run: **122/122
CHECK pass, 2 flags (F1, F4: pre-existing notes, unchanged)**; **mp.json byte-identical** (sha256 a8a38115…cbfa); the manifest has
refreshed chapter marks (provisional).

**Storyboard** (`checks/r7_storyboard.py`, idempotent): s00 visual; a "REMAKE 2026-11-07:" note on 15 visuals; calc_rows of s04, s06,
s10, s21; title_card; `remake_2026_11_07` record; cross_part (Part 4 use, teaser_in / teaser_out); audio.music (polar-chart; its s16
layers moved by mp_mix; fade); the s18 effect candidate dropped; chapter marks without s02 (16); maths_skip keep lines 'S0 of …';
target_duration_s provisional 1973.5.

**Provisional timing** (`mp_r7_splice.py --provisional`): re-used clip lengths + new sentences at 14.27 chars/s.
**1971.000 s + 2.5-s hold = 1973.5 s (32:53.5)** (dry run 32:31.6). 281 sentences, 4785 words, **145.5 wpm** overall (limit 150).

### Static gates (on the provisional timing)
| Gate | Result |
|---|---|
| tsc (whole project) | **0 errors** |
| at_check | **431 refs, 0 failures** |
| swap_check | **289 text elements, 0 text-over-text, 0 swaps < 8 frames** (37 not evaluable on some frames, as before) |
| cam_speed | **0 above 90 °/s** (s16 peak 41) |
| movie_symbol_lint --strict | **0** (was 33) |
| eq_check | 12 storyboard equations, 0 missing; 13 constants, 0 unused (EQ_S02 now used by the s06 recall) |
| script_wording_lint | **0** (was 13) |
| KaTeX (node, every new TeX / `$…$` string) | 25 strings, 0 errors |
| r7_text --check / splice --plan | OK; 23 scenes / 232 re-used + 49 new |
| final_timing --recue (dry, provisional) | cue rules OK, 482 cues; 1 cue above 17 cps: s19 S3 "The north arrow points straight at the middle, towards the pole." (17.3 cps, a re-used dryrun3 clip; the dry run already warned) → handled in the splice (below) |
| SSR 2-D / --3d, K6 stills | **queued** (HEAVY.lock rule) |

Not checked statically: the Recall items (swap_check does not model them); their places were worked out against every element on
screen at the same time (see above) and are in the K6 frame list (DENSE = every changed scene, every 0.5 s).

## 14:00 heavy-job tooling (static), queue written
**Tools** (ported from Part 6, names and paths substituted):
- `checks/mp_r7_splice.py`: OLD = dryrun3, dryrun1, mini_s02; one source per scene: dryrun3. **New for Part 7:** a sentence Kokoro speaks
  faster than 17 chars/s gets a tail of silence of at most 0.6 s so its caption cue meets 16.95 chars/s (listed as `cps_pad` in
  timing.json's self_check); a bigger shortfall still stops `final_timing.py --final`.
- `checks/final_timing.py`: Part 6's, plus: the recue uses end − start (the 4-dp rounded `dur` overshot `end` by 1e-4 on 7 sentences of
  the provisional file: "cue leaves its sentence"); a missing en.vtt counts as no old cues (5g never had captions).
- `checks/mp_words.py` (Kokoro word times, AT ±0.5 s); `checks/mp_mix.py` (polar-chart: its three s16 layer times and the pad thinning
  moved from the pre-remake 1310.0 s to the final s16 start; −16 ± 0.5 LUFS / ≤ −1.5 dBTP check); `sound.yaml` (new: polar-chart, seed 31,
  bed −28 LUFS, duck 5 dB, tail 2.5 s, no effects); `checks/mp_run.py` (frames / stills / render / join; DENSE = the 16 changed scenes);
  `checks/label_stills_mp.mjs`; `checks/mp_static.sh` (Part 6's set + the wording lint; `--no-ssr`).

**`checks/mp_lockgate.py`** (lock protocol 2026-11-07, tightened):
- nothing starts until Part 6's queue has written `G:/…/scratch/movies/ch00_coordinates_routes/build1/stills/r7/k6.json`, or the
  orchestrator creates `G:/…/scratch/movies/ch00_coordinates_maps/GO`;
- **voice** only if HEAVY.lock is free, or held by a full render (owner says "render" and none of K6 / still / SSR), with ≥ 8 GB RAM free;
- **heavy** only if both HEAVY.lock and VOICE.lock are free;
- `G:/…/scratch/movies/ch00_coordinates_maps/CANCEL` stops it (exit 2) before any lock is taken; CANCEL is also checked between steps.

**`checks/r7_queue.sh`** (log `G:/…/scratch/movies/ch00_coordinates_maps/r7_queue.log`):
- **Phase V, under VOICE.lock:** any old r7/tts moved aside → splice r7 (49 new clips) → `final_timing --final` → `mp_words` →
  `--recue --write` → at_check, swap_check, cam_speed, eq_check, wording lint and the builder on the final timing → mix into
  `build1/sound` (an old one moved aside) → ebur128 → the wav copied into `build1/public` → disk.
- **Phase H, under HEAVY.lock with VOICE.lock free:** disk_guard → tsc → SSR 2-D and --3d → K6 frame list → bundle + K6 stills
  `build1/stills/r7` (2 jobs) → `tools/k6_overlap.py` → `k6.json` → disk_guard.
- **No render, no delete.**

## 14:07 queue NOT started (permission)
Starting the detached queue the way Part 6 did (`powershell -NoProfile -ExecutionPolicy Bypass -File
movies/src/ch00_coordinates_maps/checks/r7_queue_start.ps1`) was **denied by the session's auto-mode permission classifier**. Nothing
was started, and no workaround was tried. The orchestrator (or the user with `!`) starts it with that exact command; it then waits on its
own for Part 6's k6.json. At 14:07 Part 6's queue still said "phase V queued 13:39:08", and HEAVY.lock was held by "#5b r8 SSR + K6 k6z1".

## 14:08 state at hand-back
- Disk (shutil): **C: 124.6 GB free, G: 465.4 GB free** (start: 124.6 / 465.6).
- K6 table, mix numbers and the final length are **pending**. The queued run fills them in (`r7_queue.log`, `build1/sound/sound.json`,
  `build1/stills/r7/k6.json`).

**Render (orchestrator, after the queue's phase H passes and the stills are looked at):**
```
.venv/Scripts/python.exe movies/src/ch00_coordinates_maps/checks/mp_run.py render --conc 2
.venv/Scripts/python.exe movies/src/ch00_coordinates_maps/checks/mp_run.py join --mb 150
.venv/Scripts/python.exe tools/movie_qa.py "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_maps/build1/build1_1080.mp4" --storyboard movies/ch00/ch00_coordinates_maps/storyboard.yaml
```
- Composition `Ch00CoordinatesMaps`; 4000-frame chunks into `build1/render/` (15 chunks for ≈ 59 200 frames); TEMP on G:; it stops
  below 45 GB on C:. It needs `build1/bundle/public/narration_music_mp.wav`, which phase V and phase H's bundle provide.
