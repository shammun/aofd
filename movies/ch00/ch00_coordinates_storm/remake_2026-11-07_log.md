# ch00_coordinates_storm (#5b, Coordinates Part 2): remake 2026-11-07 log

Brief: `movies/ch00/coordinates_series/master_plan_2026-11-07.md` (R1, R3, R10–R16, R14b, R19), the user's feedback paragraphs 8–11
(`user_feedback_2026-11-06.md`; the file holds 11 paragraphs: paragraph 12 is not in it, its asks are quoted in the master plan rows
R7–R12 and were followed from there), `continuity_plan.md` §2a–§2c, §3 (5b), §5, §6, `fact_check_2026-11-07.md` (5b rows), and the
coordinator's course correction of 2026-11-07 (user, firm: **no movie opens with a recap**; cut `s02_part1_recap`; R10 = 1–2 sentences).
Start state: notes-2 checkpoint ba626e2 (48:50, 712 cues). Nothing committed, nothing rendered, nothing deleted.

## What was built (files)
| File | What |
|---|---|
| `movies/data/build_ch00_coordinates_storm.py` | new `--remake1107-patch` fast path: `cs.json → shore` from `fluidpy.data.movie_shore` (coast_axes, shore_components, seaward_check, era5_event, inverse_barometer) on the same inputs as the derived product; shown arithmetic computed from the shown (rounded) inputs; ERA5 speed maps `img/{amphan,nargis,idai}_wind.png` + arrows; CHECK DS40–DS47 (25 rows, all pass); 16 parity entries; manifest credit fixes (author order Fischer, Reasor, Rogers & Gamache 2022; ERA5 credit line) |
| `movies/src/ch00_coordinates_storm/cs_sD.tsx` | new scenes s26–s31 (coast block) and s33 / s36 / s39 (event winds, one `EventWind` component) |
| `cs_sA/B/C.tsx`, `cs_lib.tsx`, `cs_eq.ts`, `CoordinatesStorm.tsx`, `kit_cs/SeriesTitle.tsx` | title layout, s01 R10 lines, recalls (`Recall` component), s09 / s15 / s16 / s20 / s21 / s23 changes, renamed scenes, recap, end-card fade |
| `checks/r7_script.py`, `checks/r7_storyboard.py`, `checks/cst_r7_splice.py` | script rebuild (numbers read from cs.json), storyboard sync, re-voice splice (OLD = n2) |
| `checks/{at_check,swap_check,cam_speed}.mjs`, `eq_check.py`, `ssr/entry.jsx`, `cst_run.py` | now include cs_sD / the renamed ids |
| `script.md`, `storyboard.yaml`, `sound.yaml`, `manifest.json`, `data/cs.json`, `data/img/*_wind.png` | narration source, contract, cue sheet (surf → s30), data |

## Result
- **Narration**: 42 scenes, 532 sentences, 9090 words; audio 3755.750 s + 2.5-s hold = **62:38** (3758.25 s; 112 673 + 75 frames);
  145 words per minute; 405 sentences re-used from the n2 narration, 127 new or changed (Kokoro af_bella × 1.0, loudness-matched to their
  neighbours, all within 0.5 LU, TP ≤ −1.5 dBTP; resynth correlation 0.9945); 41 n2 sentences dropped. The first run stopped on the
  level check (one 16-s Idai sentence lost 0.5 LU in the limiter); the long bearing sentence of each event was split in two and re-voiced.
- **Captions**: 915 cues (`make_timing.py --final` + `--recue --write`), 0 above 17 cps, ≤ 2 × 42 characters, text = script.
- **Mix** (`tools/sound/mix.py`, eyewall-spiral seed 31, bed −28 LUFS, duck 5 dB; surf cue moved to s30): −16.01 LUFS, true peak
  −3.52 dBTP → PASS; `tools/sound/check.py --kind mix`: I −16.0, LRA 4.6, TP −3.5, verdict OK (the click counter reports 7474, as it
  reported 5901 on the n2 mix: the narration's plosives; nothing new). Output `G:/…/ch00_coordinates_storm/build1/sound_r7/narration_music.wav`
  (not installed into the bundle; nothing rendered).
- **Static gates** (final timing): tsc 0 · at_check 557 refs / 0 failures · swap_check 447 elements, 0 overlaps, 0 swaps < 8 frames ·
  cam_speed 0 > 90°/s · eq_check 19 / 0 missing / 0 unused · SSR 13 241 scene-frames, 0 errors, NaN 0 · SSR --3d 0 errors (THREE guard 979
  frames) · stack_frame ok · `movie_symbol_lint --strict` 0 findings (13 lint-ok exemptions, all pre-existing "m is the unit metre") ·
  `script_wording_lint` 0.
- **Data**: `--remake1107-patch` 25 CHECK rows DS40–DS47 pass; 16 parity entries (fluidpy.data.movie_shore at fluidpy 1823b5f);
  manifest credits: author order fixed, ERA5 credit line added.

## Scene list (final timing)
| # | Scene | Start | What changed |
|---|---|---|---|
| 0 | s00_title | 0:00 | series title layout, no "made easy" (R1); one sentence, "Coordinates" pulses on "cylindrical coordinates" |
| 1 | s01_hook | 0:14 | S0–S5 kept; S6–S7 (R10, 2 sentences): what Part 1 gave, what Part 2 adds; the old preview S6–S10 cut |
| — | ~~s02_part1_recap~~ | — | **cut** (user 2026-11-07: no recap scene); its contents recalled at the point of use |
| 2–7 | s03–s08 | 1:14 | unchanged voice; recalls on screen: r̂ (s03 S8), arc length (S13), θ̂ (S18), quarter turn (s06 S14) |
| 8 | s09_dtheta_dt | 13:28 | S1–S7 new: Part 1's u_r / u_θ lines, the worked point (east wind 10 m/s → 6, −8), the 72-point ring average 34.8; "v" redefined as the speed |
| 9–13 | s10–s14 | 16:12 | unchanged |
| 14 | s15_cylinder | 23:19 | S7–S10 new (R11): polar = (r, θ) on the flat map; + height z; "polar + height = cylindrical"; x = r cos θ, y = r sin θ, z = z (derived in Part 1); 3-D grid lifted |
| 15 | s16_three_parts | 24:32 | recall of the u_r / u_θ lines on screen |
| 16–19 | s17–s20 | 25:21 | s20: "derived in Part 1: ring average" |
| 20 | s21_amphan_intro | 31:33 | fact rows 1–2 (IMD wind class, 1999, not a damage scale, Sidr 2007 / Aila 2009; Kolkata line split) |
| 21–24 | s22–s25 | 32:59 | s23: "derived in Part 1: inflow angle" keyword |
| 25 | **s26_coast_axes** | 37:22 | B1: Ian "the storm we measured in Part 1"; Part 1's x̂′, ŷ′, x′, y′, matrix recalled exactly; the wind form along / across; ŷ′ to sea; sign meaning |
| 26 | **s27_coast_angle** | 39:08 | B2: flat km map, 91.5 N / 55.0 W, tan 0.601, 31°, 329° (derived in Part 1: bearings), α 121°, x̂′, ŷ′ |
| 27 | **s28_fmb_calc** | 41:06 | B3: along 9.4, across −31.5 (onto the land), check √1081 ≈ 32.9 ≈ 33 |
| 28 | **s29_stp_calc** | 42:45 | B4: StP 55.7 N / 6.8 W, 7°, 353°, α 97°, across +12.1 (out to sea), along −14.7; opposing arrows |
| 29 | **s30_onshore_piles** | 44:31 | B5: reasoning before evidence; shelf; 1 cm per hPa; 941 hPa → 72 cm; the prediction |
| 30 | **s31_gauges** | 45:30 | B6: the gauge chart laid out like the original (41:00–41:20), lines gold-linked to the across arrows; "almost nothing" (fact row 9) |
| 31 | s32_flood_flight | 46:44 | (was s29) unchanged |
| 32 | **s33_amphan_wind** | 47:28 | R14/R14b: ERA5 09 UTC, coast 257°, α 193°, across −22.4 onto the land; 960 hPa → 53 cm; no gauge record in our data |
| 33 | s34_amphan_radar | 49:40 | (was s30) unchanged |
| 34 | s35_nargis_intro | 51:12 | S0 fact row 10; S12 leads to the wind |
| 35 | **s36_nargis_wind** | 52:48 | ERA5 11 UTC, 279°, α 171°, across −17.8; 962 hPa → 51 cm; no gauge record; "Let's zoom in" |
| 36–37 | s37_nargis_swipe, s38_idai_intro | 54:52 | (were s32, s33) unchanged |
| 38 | **s39_idai_wind** | 57:21 | ERA5 19 UTC, 236°, α 214°, across −21.0; 955 hPa → 58 cm; no gauge record |
| 39 | s40_idai_swipe | 59:29 | (was s34) unchanged |
| 40 | s41_recap | 60:06 | S7–S10 the coast numbers, S12–S13 two-sentence teaser to Part 3 |
| 41 | s42_end | 62:13 | (was s36) the picture fades with the music over the 2.5-s hold |

## R-item → change → evidence
| Item | Change | Evidence |
|---|---|---|
| R1 | s00: "made easy" and its pulse removed; series title layout (`kit_cs/SeriesTitle.tsx`, a copy of Part 1's); new sentence without "easy" | lint 0; still f00300 (title frame) looked at |
| R3 | s41: S7–S10 the coast numbers (−31.5 / +2.2 m, +12.1 / −1.8 m, events −22.4 / −17.8 / −21.0), S12–S13 teaser (Part 3: the Earth; latitude and longitude → km, the rule behind today's km maps); s42 picture fades over the 75-frame hold with the music's 2.5-s tail | timing s41 60:06, teaser 61:57; SSR 0 errors |
| R10 + user 2026-11-07 (no recap) | `s02_part1_recap` cut (67 s); s01 S6 "Part 1 gave us polar coordinates, with their two arrows, r hat and theta hat, which turn as we go round." S7 "In this part, we find out how fast they turn, add a height … and then use Part 1's turned axes to see, on real maps, how a storm's wind pushes the sea onto the coast." | 0:52, 1:00; still f01942 |
| R11 | s15 S7–S10: polar = two numbers on the flat map; + height z; "polar + height = cylindrical"; x = r cos θ, y = r sin θ, z = z "derived in Part 1: polar coordinates"; three.js: the polar grid on the sea, a point lifted by z, grid copies at heights, the cylinder on S11 (s16 says ẑ never turns) | 23:56–24:32 |
| R12 / R16 | recalls with "derived in Part 1": r̂ (s03 S8), arc length (s03 S13), θ̂ (s03 S18), quarter turn (s06 S14), u_r / u_θ + worked point + 72-point average (s09 S1–S7, voiced), u_r / u_θ (s16), ring average (s20), inflow angle (s23), turned axes x′, y′ + matrix (s26, voiced), bearings (s27, voiced) | stills f03712, f05302, f13690 |
| R13 | coast block s26–s31 (B1–B6) | DS40–DS43; s26 37:22 … s31 45:30 |
| R14 / R14b | s33 / s36 / s39: event wind (ERA5), coast angle, across-shore calculation with the equation and named inputs, arrows, "onto the land", pressure + inverse barometer, then (no gauge record in our data, said) the before/after | DS44–DS47 |
| R15 | the worked coast calculation now lives in 5b (5d keeps a recall; 5d is not touched here) | — |
| R19 | fact rows 1 (Amphan IMD class + Sidr/Aila), 2 (Kolkata split), 4 (manifest author order), 9 ("almost nothing"), 10 ("some of the best-known"), 12 (78 → 79 km in the storyboard text) | script s21, s31, s35; manifest credits; storyboard |
| user 2026-11-07 (gauge chart) | s26 S0 "Hurricane Ian, the storm we measured in Part 1"; s31 chart laid out like the original's 41:00–41:20 frame (map + across arrows left; two lines over 36 h, "water above the normal tide (m)", landfall marker, station legend right; each line gold-linked to its station's across arrow); events: "There's no tide-gauge record of the water there in our data, so next come the pictures from space." (archive: no gauge for Amphan, Nargis, Idai) | original frames grabbed at 40:10 / 41:12 |
| notes-2 fixes | kept (all n2 visuals and sentences re-used unchanged; the n2 K6 / render that never ran are replaced by this remake's K6) | — |

## Fact table (new claims, checked before TTS)
| Scene | Claim | Verdict | Source |
|---|---|---|---|
| s30 | Ian's centre ≈ 941 hPa at landfall (19:05 UTC 28 Sep 2022), 72 below 1013 → ≈ 72 cm | OK | IBTrACS v04r01 USA (NHC best track) row 2022-09-28 19:05, 941 hPa (derived JSON `best_track_landfall`); inverse barometer 0.995 cm/hPa |
| s28 | HRRR 20 UTC wind at FMB 32.9 m/s from the SW (222°) | OK | cs.json coast.uF; DS24 |
| s29 | StP ~160 km north, on Tampa Bay; Gulf coast St Pete Beach → Tarpon Springs runs almost due north (353°) | OK | fact check row (160 km); NE 10 m segment (data report §1) |
| s29 | HRRR wind at StP ≈ 19 m/s from the NNE (from 32.6°) | OK | cs.json coast.uS |
| s31 | Fort Myers +2.2 m, St. Petersburg −1.8 m vs predicted tide, within hours of landfall; "almost nothing" from satellites | OK | CO-OPS 8725520 / 8726520 residuals; fact row 9 rewrite |
| s33 | ERA5 09 UTC 20 May 2020 "as Amphan reached the coast" | OK | IBTrACS first land fix 09 UTC 21.4 N 88.1 E (DS19); IMD crossing 10–12 UTC |
| s33 | ERA5 strongest wind ≈ 6/10 of the official estimate | OK | 27.5 / 46.3 m/s = 0.59 (IMD 90 kt) |
| s33 | official lowest pressure ≈ 960 hPa at that hour → 53 cm | OK | IBTrACS newdelhi 09 UTC 960 hPa |
| s33 | point on the Sundarbans shore of Bangladesh, east of the centre | OK | 21.644 N 89.229 E; ERA5 centre 21.5 N 88.0 E |
| s36 | ERA5 11 UTC 2 May 2008 "around the time of landfall"; ≈ half of the official wind; 962 hPa → 51 cm; point south of Bogale | OK | IBTrACS WMO landfall fix 09 UTC, ≈ 12 UTC (Wikipedia/IMD); 0.55; IBTrACS newdelhi 12 UTC 962 hPa; Bogale 16.29 N 95.40 E vs point 15.78 N |
| s39 | ERA5 19 UTC 14 Mar 2019 "a few hours before landfall"; ≈ 2/3 of the official wind; 955 hPa → 58 cm | OK | IBTrACS landfall fix 21 UTC; 0.66; RSMC La Réunion 18 UTC 955 hPa |
| s39 | Idai turns clockwise (seen from above); Beira on its western side; wind there from the sea (SSE, 162°) | OK | ERA5 centre 19.75 S 35.25 E vs Beira 34.84–34.94 E; u −6.7, v +20.9 |
| s33/s36/s39 | "There's no tide-gauge record of the water there in our data" | OK (scoped to our data) | `reports/data/ch00_storm_events_archive.md` (water evidence: none for Amphan / Idai; only ETOPO heights for Nargis) |
| s21 | IMD top wind class, 1999, not a damage scale, Sidr 2007 / Aila 2009 | OK | fact check row 1 (IMD report, Wikipedia Sidr / Aila) |
| s41 | Part 3 turns latitude and longitude into km | OK | continuity plan §3 5c (Δy = a Δφ, Δx = a cos φ Δλ); 5d uses it for the same legs |

## The user's paragraphs (acceptance test), ticked with timestamps (final timing)
The feedback file holds paragraphs 1–11; the 5b asks are in 8–11 and in the master-plan rows that quote paragraph 12 (R7–R12).
- [x] **Para 9 — cylindrical said clearly, how it differs from polar, "nothing changes, just the vertical one"**: s15 23:52 "On the flat map, polar
  coordinates use two numbers …", 23:59 "we add a third number: the height z", 24:06 "Polar coordinates plus this height are called cylindrical
  coordinates: r, theta and z", 24:12 "Nothing else changes: r and theta mean exactly what they meant in Part 1, so x is still r cosine theta …";
  3-D grid lifted, z axis from the eye, the cylinder (24:24); s16 24:32–25:21 ẑ never turns.
- [x] **Para 9 — the along / across calculation as in the original (~40 min), before the gauges**: s26 37:22–39:08 (turned axes recalled),
  s27 39:08–41:05 (coast angle), s28 41:06 (FMB along 9.4 / across −31.5), s29 42:45 (StP +12.1 out to sea, opposing arrows 44:19).
- [x] **Para 9 — Fort Myers and St. Petersburg data like the original**: s31 45:30 the two gauge lines (+2.2 / −1.8 m) laid out like the
  original 41:00–41:20 frame, each line gold-linked to its station's across-shore arrow.
- [x] **Para 9 — wind data and an across-shore calculation for each satellite event; "more across-shore → more water inland" reasoning**:
  reasoning s30 44:33 ("Wind blowing onto the land drags the sea surface …") before the gauges; Amphan s33 47:28 (across −22.4 at 49:08),
  Nargis s36 52:48 (−17.8 at 54:15), Idai s39 57:21 (−21.0 at 58:58), each before its before/after (s34 49:40, s37 54:52, s40 59:29).
- [x] **Para 9 — does it belong to 5b?** Yes (continuity plan §2): the turned axes are derived in Part 1; 5b recalls them (s26) and reads the
  coast legs off a flat km map; the lat/lon → km rule stays in Part 3 (said in the teaser 62:03).
- [x] **Para 10 — x′ = x cos α + y sin α, y′ = −x sin α + y cos α covered before the flood scenes**: on screen with "derived in Part 1: turned
  axes" at s26 38:11 (voiced), matrix form 38:24, then applied to the wind 38:30–38:48.
- [x] **Para 11 — show those equations before the flood scenes, stress that they give along / across, opposing arrow for St. Petersburg**:
  s26 (38:11), s28 (41:06), s29 (42:45; opposing arrows 44:19); recalled again with each event (s33 / s36 / s39 "derived in Part 1" rows).
- [x] **Para 8 — the floods' place in the sequence**: kept in 5b, now after their wind calculations (R15).
- [x] **Para 12 (master plan R10) — the opening says what Part 1 covered and what Part 2 covers, 5b only, no recap scene**: s01 0:52 and 1:00.
- [x] **Para 12 (R12) — refer back to u_r and u_θ and show how they were calculated**: s09 13:36–14:31 (lines, Part 1's worked point 6 / −8,
  the 72-point average 34.8); s16 24:36 on screen.
- [x] **Chat — no "easy"; smooth ending**: s00 0:00; recap 60:06 with the numbers, teaser 61:57–62:12, end card 62:13, picture and music fade
  over the 2.5-s hold.

## K6 overlap (house gate, `tools/k6_overlap.py`; stills `cst_run.py stills <tag> --bundle --jobs 2`, under HEAVY.lock)
| Tag | Frames | Hits | What was fixed after it |
|---|---|---|---|
| k6y1 | 3206 (changed scenes) | 1995 | matrix TeX (`\` lost), s26 diagram bands clipped / labels, s27 labels, s28 rows split (three rows each, no lhs column), labels, link removed, s29 arrow scale / labels / the across part as two named products, s30 labels, s31 chart relaid out like the original (legend links, labels), events: source lines, centre label → column, link removed, rows as named products, s09 / s15 / s41 placements |
| k6y2 | 1831 (scenes with hits) | 327 | s26 band labels, fade order; s27 β label; events rows x, pressure rows, across label side; s41 'along' |
| **k6y3** | **6137 (whole movie)** | 185, all in s27 / s33 / s36 / s39 | s27 β label removed from the map (arc stays, value in the rows); events: pressure rows clear of the colour bar; Idai across label side |
| k6y4 | 297 (s27, s33, s36, s39) | 20 (s39 only) | Idai across label right of both arrows |
| **k6y5** | 78 (s39) | **0** | — |
Result: the whole movie has been through K6 (k6y3), and every scene with a hit there was re-shot until 0 (k6y4, k6y5). No other scene changed after k6y3.

## Stills looked at (half-size, `G:/…/build1/stills/k6y*/f<frame>.jpg`)
f00300 (title), f01942 / f02137 (s01 Part 1 → Part 2), f03712 / f05302 (s03 recalls), f13690 (s06 quarter turn), f25882 / f26522 (s09 worked
point, ring average), f43919 / f44129 (s15 cylindrical), f58480 / f59166 (s21 IMD class, Sidr/Aila, distances), f67905 / f69285 / f70410 (s26),
f71936 / f72657 (s27), f75979 / f76451 (s28), f79741 / f80101 (s29), f80813 / f81743 (s30), f82581 / f82789 / f82916 (s31), f87452 / f88669 (s33),
f97828 (s36), f104096 / f106112 / f106342 (s39); original movie frames 40:10, 41:12 for the s31 layout.
Seen, not changed: the title frame's lower half is empty below the subtitle (as Part 1's layout); s21's pre-existing Satkhira/Khulna labels sit
close together (unchanged n2 visual).

## Render (not run — orchestrator / next step)
```
# one heavy job, under the lock; bundle = the k6y5 bundle (current sources)
cp "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/sound_r7/narration_music.wav" "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/bundle/public/narration_music_cst.wav"
mkdir -p "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/sound" && cp "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/sound_r7/narration_music.wav" "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/sound/narration_music_cst.wav"
.venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/cst_run.py render --conc 2      # 112 748 frames, 29 chunks of 4000
.venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/cst_run.py join --mb 150
.venv/Scripts/python.exe tools/movie_qa.py "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/build1_1080.mp4" --storyboard movies/ch00/ch00_coordinates_storm/storyboard.yaml
```

## Not done / open
- Full render, movie_qa, reviews: not run (instruction). The n2 render / K6 that never ran are superseded.
- 5d still carries the FMB calculation (continuity plan §2c says 5d keeps a recall): 5d not touched here.
- The scene ids have a gap (s01 → s03) after cutting s02; harmless, kept so the maths-skip and chapter-mark code stays as it is.
- `data/registry.yaml` entries for the CO-OPS / GEE / IBTrACS-NI sources (continuity plan §2b note) — data agent.
- Proposed for the house kit (not edited): `kit_cs/SeriesTitle.tsx` (= Part 1's), `Recall` in `cs_lib.tsx` ("derived in Part K: <name>", two lines when too wide).

## Disk
Before: C: 107.7 GB free, G: 456.0 GB free (project data 131.61 GB of 150; `disk_guard --report`). After: C: 105 GB, G: 440 GB free (`df`; the
K6 stills k6y1–k6y5 and the r7 TTS/mix on G: scratch, kept — nothing deleted, per instruction and the user's no-G:-cleanup rule).

## Pass r8 — "show it, don't voice it" (2026-11-07, 11:45–16:40 EST)
Rules applied (user 2026-11-07, in the order they arrived): (1) simple arithmetic stays on screen, the voice does not read it; (1a) the voice
RELATES the numbers (what is combined, where each number comes from) and gives the result; (1b) squares, roots and lengths likewise
("we square …, add them, and take the square root, which gives …"); (2) opening: "see how they're used to …", not "how meteorology uses
them"; (3) every number in an on-screen calculation says what it is and every result carries its symbol, but only where not obvious
(balance rule: never clutter); (4) inputs a viewer can't see at a glance (cos α, sin α, α, 1 cm per hPa, u, v, v and r) are said and
highlighted (gold glow) on their word, and the scene's answer is highlighted; (5) reveals timed from Kokoro word timestamps (±0.5 s), and
no caption cue splits a number. Tools: `checks/r8_script.py` (table below; scene sentence counts unchanged so SS/SE stay valid),
`checks/r8_storyboard.py`, `checks/cst_r8_splice.py` (OLD = r7 narration; saves word timestamps), `checks/r8_words_extra.py`
(word timestamps of re-used sentences that carry a reveal in s09, s13, s27–s30, s33, s36, s39; re-synthesis length = clip length ±0.05 s,
39 / 39 accepted), `checks/r8_words.py` → `movies/src/ch00_coordinates_storm/at_words.json` (189 entries; cs_lib `AT()` and
`at_check.mjs` use an entry only while its sentence text is unchanged), `make_timing.py --recue` (new: no cue boundary inside a spoken
number; the sentence is re-split with each boundary as near as possible to where it was).

### Result
- **Length**: narration 3755.750 → **3670.000 s** (−85.75 s); movie 62:38.25 → **61:12.50** (110 100 + 75 frames). 532 sentences (unchanged),
  9090 → 8867 words; 53 sentences re-voiced (Kokoro af_bella × 1.0, loudness-matched to neighbours, all within 0.5 LU, TP ≤ −1.5 dBTP;
  resynth correlation 0.9951), 479 re-used. One clip (s13 S2) failed the level gate by 0.05 LU on the first run; "and divide" → "then
  divide" re-voiced and passed (−16.03 vs −16.01 target).
- **Captions**: 888 cues, 0 above 17 cps, ≤ 2 × 42, text = script, 0 cue boundaries inside a number (26 cues re-split; the r7 track had
  ~20 such splits, e.g. "nine hundred and | seventy five").
- **Reveal timing**: 189 word-timed entries; 24 of them were > 0.5 s off with the character share (worst s08 S16 "zero point" 1.00 s,
  s36 S0 "eleven" 0.90 s, s09 S13 "divided by" 0.88 s).
- **Per-scene change (s)**: s00 −1.07 · s03 −2.25 · s04 −7.45 · s07 −1.80 · s08 −12.08 · s09 −3.27 · s13 +0.25 · s14 −4.83 · s20 −0.47 ·
  s23 +0.45 · s27 −5.32 · s28 −8.48 · s29 −6.32 · s33 −9.35 · s34 −4.25 · s36 −8.43 · s38 −1.15 · s39 −9.93.
- **Chapter marks** (final): 0:00 · 1:13 s03 · 10:21 s08 · 19:40 s13 · 22:45 s15 · 24:48 s17 · 26:02 s18 · 28:33 s20 · 31:00 s21 · 35:57 s25 ·
  36:48 s26 · 40:27 s28 · 43:38 s30 · 45:51 s32 · 50:05 s35 · 55:03 s38 · 58:40 s41; skip chips B1 → 10:21, B2 → 19:40.

### Sentences changed (old → new)
| Scene | S | Old | New | Why |
|---|---|---|---|---|
| s00_title | 0 | In this video, we'll learn how turning arrows and cylindrical coordinates work, and see how meteorology uses them to look inside a tropical cyclone, and to measure how its winds push the sea onto the coast. | In this video, we'll learn how turning arrows and cylindrical coordinates work, and see how they're used to look inside a tropical cyclone, and to measure how its winds push the sea onto the coast. | user rule for openings 2026-11-07: 'see how they're used to …', not 'how meteorology uses them' |
| s03_tip_on_circle | 14 | So the tip slides a distance of one times delta theta, which is just delta theta. | So the tip slides a distance of just delta theta. | one × Δθ not read out (radius one said in S13) |
| s04_slopes_sin_cos | 12 | The cosine drops from zero point six zero zero to zero point five nine two, a change of minus zero point zero zero eight. | The cosine drops from zero point six zero zero to zero point five nine two. | the subtraction stays on screen |
| s04_slopes_sin_cos | 13 | Divided by zero point zero one, that's minus zero point eight: minus the sine. | Its change, divided by the turn, is minus zero point eight: minus the sine. | relates: change ÷ turn, then the result |
| s04_slopes_sin_cos | 14 | The sine grows from zero point eight zero zero to zero point eight zero six, a change of zero point zero zero six. | The sine grows from zero point eight zero zero to zero point eight zero six. | the subtraction stays on screen |
| s04_slopes_sin_cos | 15 | Divided by zero point zero one, that's zero point six: the cosine. | Its change, divided by the turn, is zero point six: the cosine. | relates: change ÷ turn, then the result |
| s07_toward_centre | 15 | Now divide each number by delta theta, zero point zero one, and we get minus zero point six, minus zero point eight. | Now divide each number by delta theta, and we get minus zero point six, minus zero point eight. | Δθ = 0.01 named in S11; not repeated as a divisor |
| s08_product_rule | 11 | The product is now eleven times that, which is ten point nine four five, one point one. | The new speed times the new arrow is about ten point nine four five, one point one. | relates the two factors; 11 × (0.995, 0.1) on screen |
| s08_product_rule | 15 | First, the change in the number, times the old arrow: one times one, zero, which is one, zero. | First, the change in the number, times the old arrow, gives one, zero. | 1 × (1, 0) on screen |
| s08_product_rule | 16 | Second, the old number times the change in the arrow, which went from one, zero to zero point nine nine five, zero point one, a change of minus zero point zero zero five, zero point one: ten times that is minus zero point zero five, one. | Second, the old number times the change in the arrow: the arrow changed by minus zero point zero zero five, zero point one, so this piece is minus zero point zero five, one. | subtraction and 10 × (…) on screen; the arrow's change and the piece named |
| s08_product_rule | 17 | Third, the two changes multiplied together: one times minus zero point zero zero five, zero point one, which is minus zero point zero zero five, zero point one. | Third, the two changes multiplied together give minus zero point zero zero five, zero point one. | 1 × (…) on screen |
| s09_dtheta_dt | 5 | Then u sub r is ten times zero point six, which is six, and u sub theta is minus ten times zero point eight, which is minus eight. | Multiplying the wind's parts by the cosine and the sine, as the two formulas say, u sub r is six, and u sub theta is minus eight. | the user's own example (−10 × 0.8): products on screen, voice relates and gives the results |
| s09_dtheta_dt | 6 | Round Ian's ring, we did this at seventy two points, one every five degrees, and averaged them: the sum of the seventy two values of u sub theta, divided by seventy two, is about thirty four point eight metres per second. | Round Ian's ring, we did this at seventy two points, one every five degrees, and the average of the seventy two values of u sub theta is about thirty four point eight metres per second. | sum ÷ 72 on screen (the ring-average equation) |
| s09_dtheta_dt | 17 | Thirty four point eight metres per second, divided by twenty five thousand metres, is about zero point zero zero one three nine radians per second. | The speed, thirty four point eight metres per second, divided by the radius, twenty five thousand metres, is about zero point zero zero one three nine radians per second. | v and r named with their numbers on screen (S16 rows) and in S0 / S6 |
| s09_dtheta_dt | 20 | So one full lap, two pi radians, takes two pi divided by zero point zero zero one three nine. | So one full lap, two pi radians, takes two pi divided by this rate. | relates: lap angle ÷ rate |
| s13_acceleration_numbers | 2 | Thirty four point eight squared is about twelve hundred and eleven. | For Ian's ring, we square the speed, thirty four point eight metres per second, then divide by the radius, twenty five thousand metres. | 34.8² and ÷ 25 000 on screen; voice says what is combined |
| s13_acceleration_numbers | 3 | Divided by twenty five thousand metres, that's about zero point zero four eight metres per second squared. | That gives about zero point zero four eight metres per second squared. | result only |
| s13_acceleration_numbers | 4 | With easy numbers, thirty five squared over twenty five thousand is about zero point zero four nine, almost the same. | Rounding the speed to thirty five gives about zero point zero four nine, almost the same. | 35² / 25 000 on screen; also drops 'easy' |
| s14_steady_but_turning | 4 | In one minute, theta grows by zero point zero zero one three nine times sixty, which is about zero point zero eight four radians, or about five degrees. | In one minute, theta grows by its rate times sixty seconds: about zero point zero eight four radians, or about five degrees. | relates rate × 60 s; product on screen |
| s14_steady_but_turning | 11 | So by the arc rule, it's about thirty four point eight times zero point zero eight four, which is about two point nine metres per second. | So by the arc rule, radius times angle, it's about two point nine metres per second. | 34.8 × 0.084 on screen |
| s20_ian_curtain | 14 | All of it has to leave through the cylinder's lid, which is a much bigger area, so it rises more slowly: two times one thousand times sixteen, divided by thirty thousand, is about one metre per second. | All of it has to leave through the cylinder's lid, which is a much bigger area, so it rises more slowly: twice the depth times the inflow speed, divided by the radius, is about one metre per second. | 2 × 1000 × 16 / 30 000 on screen; voice names the quantities |
| s23_amphan_ring | 11 | Six over twenty is zero point three, so Amphan's inflow angle is about seventeen degrees, close to Ian's twenty one. | The radial wind over the tangential wind gives Amphan an inflow angle of about seventeen degrees, close to Ian's twenty one. | 6 / 20 = 0.3 on screen; voice relates the two winds |
| s27_coast_angle | 3 | So the coast leans west of north, by an angle whose tangent is the opposite side over the adjacent side: fifty five over ninety one point five. | So the coast leans west of north, by an angle whose tangent is the opposite side, the west leg, over the adjacent side, the north leg. | 55 / 91.5 on screen; voice says which leg goes where |
| s27_coast_angle | 5 | So the coast runs thirty one degrees west of north: a compass bearing of three hundred and sixty minus thirty one, which is three hundred and twenty nine degrees. | So the coast runs thirty one degrees west of north: measured clockwise from north, that's a compass bearing of three hundred and twenty nine degrees. | 360 − 31 on screen |
| s27_coast_angle | 7 | So alpha is ninety minus three hundred and twenty nine, which is minus two hundred and thirty nine degrees, and adding a full turn, three hundred and sixty, gives a hundred and twenty one degrees. | So alpha is ninety degrees minus the bearing, which comes out negative, and adding a full turn gives a hundred and twenty one degrees. | 90 − 329 = −239 and +360 on screen; the full-turn idea kept |
| s28_fmb_calc | 3 | The part along the shore is u cosine alpha plus v sine alpha: twenty two point two times minus zero point five one five, plus twenty four point three times zero point eight five seven. | The part along the shore is u cosine alpha plus v sine alpha: we multiply the east part, u, by the cosine of alpha, minus zero point five one five, and the north part, v, by its sine, zero point eight five seven. | the user's clarification example: relate, don't read the products |
| s28_fmb_calc | 4 | That's about minus eleven point four, plus twenty point eight, which is about nine point four metres per second. | Adding the two products gives about nine point four metres per second. | −11.4 + 20.8 on screen |
| s28_fmb_calc | 5 | The part across the shore is minus u sine alpha plus v cosine alpha: minus twenty two point two times zero point eight five seven, plus twenty four point three times minus zero point five one five. | The part across the shore is minus u sine alpha plus v cosine alpha: now u goes with minus the sine, and v with the cosine. | relate, don't read the products |
| s28_fmb_calc | 6 | That's about minus nineteen, minus twelve point five, which is about minus thirty one point five metres per second. | Adding these two products gives about minus thirty one point five metres per second. | −19 − 12.5 on screen |
| s28_fmb_calc | 9 | Let's check that it's the same wind: nine point four squared plus thirty one point five squared is about a thousand and eighty one, and its square root is about thirty two point nine, the thirty three metres per second we started with. | Let's check that it's the same wind: we square the along and across parts, add them, and take the square root, which gives about thirty two point nine, the thirty three metres per second we started with. | 9.4² + 31.5² = 1081 and √ on screen; voice: square, add, root (user 2026-11-07 squares rule) |
| s29_stp_calc | 2 | Six point eight over fifty five point seven is about zero point one two two, so the coast leans only about seven degrees west of north, a bearing of about three hundred and fifty three degrees. | With the same tangent rule, west leg over north leg, the coast leans only about seven degrees west of north, a bearing of about three hundred and fifty three degrees. | 6.8 / 55.7 on screen |
| s29_stp_calc | 3 | So alpha is ninety minus three hundred and fifty three, plus three hundred and sixty, which is about ninety seven degrees, with a cosine of about minus zero point one two two and a sine of about zero point nine nine three. | So alpha, ninety degrees minus the bearing, plus a full turn, is about ninety seven degrees, with a cosine of about minus zero point one two two and a sine of about zero point nine nine three. | 90 − 353 + 360 on screen |
| s29_stp_calc | 5 | Across the shore, minus u sine alpha is about ten point one, and v cosine alpha is about two. | Across the shore, we take minus u sine alpha, and v cosine alpha, and add them. | the two products on screen |
| s29_stp_calc | 8 | Along the shore, u cosine alpha plus v sine alpha is about one point two, minus fifteen point nine, which is minus fourteen point seven, so it also ran down the coast, towards the south. | Along the shore, u cosine alpha plus v sine alpha comes to about minus fourteen point seven, so the wind also ran down the coast, towards the south. | 1.2 − 15.9 on screen |
| s33_amphan_wind | 5 | Twenty one point nine over ninety two point nine is about zero point two three six, so the coast runs about thirteen degrees south of west. | The south leg over the west leg gives the tangent, so the coast runs about thirteen degrees south of west. | 21.9 / 92.9 on screen |
| s33_amphan_wind | 6 | That's a bearing of two hundred and seventy minus thirteen, which is two hundred and fifty seven degrees. | Measured clockwise from north, that's a bearing of two hundred and fifty seven degrees. | 270 − 13 on screen |
| s33_amphan_wind | 7 | So alpha is ninety minus two hundred and fifty seven, plus three hundred and sixty, which is about a hundred and ninety three degrees, with a cosine of about minus zero point nine seven four and a sine of about minus zero point two two five. | So alpha, ninety degrees minus the bearing, plus a full turn, is about a hundred and ninety three degrees, with a cosine of about minus zero point nine seven four and a sine of about minus zero point two two five. | 90 − 257 + 360 on screen |
| s33_amphan_wind | 10 | Across the shore, minus u sine alpha is about minus one point nine, and v cosine alpha is about minus twenty point five. | Across the shore, we take minus u sine alpha, and v cosine alpha, and add them. | the two products on screen |
| s33_amphan_wind | 12 | The official lowest pressure was about nine hundred and sixty hectopascals, fifty three below normal, so the sea under the eye rose about fifty three centimetres. | The official lowest pressure was about nine hundred and sixty hectopascals, so the sea under the eye rose about fifty three centimetres. | 1013 − 960 on screen; the cm-per-hPa rule was said in s30 |
| s36_nargis_wind | 4 | Ten point eight over sixty nine point five is about zero point one five five, so the coast runs about nine degrees north of west. | The north leg over the west leg gives the tangent, so the coast runs about nine degrees north of west. | 10.8 / 69.5 on screen |
| s36_nargis_wind | 5 | That's a bearing of two hundred and seventy plus nine, which is two hundred and seventy nine degrees. | Measured clockwise from north, that's a bearing of two hundred and seventy nine degrees. | 270 + 9 on screen |
| s36_nargis_wind | 6 | So alpha is ninety minus two hundred and seventy nine, plus three hundred and sixty, which is about a hundred and seventy one degrees, with a cosine of about minus zero point nine eight eight and a sine of about zero point one five six. | So alpha, ninety degrees minus the bearing, plus a full turn, is about a hundred and seventy one degrees, with a cosine of about minus zero point nine eight eight and a sine of about zero point one five six. | 90 − 279 + 360 on screen |
| s36_nargis_wind | 9 | Across the shore, minus u sine alpha is about minus one point five, and v cosine alpha is about minus sixteen point three. | Across the shore, we take minus u sine alpha, and v cosine alpha, and add them. | the two products on screen |
| s36_nargis_wind | 11 | The official lowest pressure was about nine hundred and sixty two hectopascals, fifty one below normal, so the sea under the eye rose about fifty one centimetres. | The official lowest pressure was about nine hundred and sixty two hectopascals, so the sea under the eye rose about fifty one centimetres. | 1013 − 962 on screen |
| s39_idai_wind | 5 | Thirty five point nine over fifty two point three is about zero point six eight six, so the coast runs about thirty four degrees south of west. | The south leg over the west leg gives the tangent, so the coast runs about thirty four degrees south of west. | 35.9 / 52.3 on screen |
| s39_idai_wind | 6 | That's a bearing of two hundred and seventy minus thirty four, which is two hundred and thirty six degrees. | Measured clockwise from north, that's a bearing of two hundred and thirty six degrees. | 270 − 34 on screen |
| s39_idai_wind | 7 | So alpha is ninety minus two hundred and thirty six, plus three hundred and sixty, which is about two hundred and fourteen degrees, with a cosine of about minus zero point eight two nine and a sine of about minus zero point five five nine. | So alpha, ninety degrees minus the bearing, plus a full turn, is about two hundred and fourteen degrees, with a cosine of about minus zero point eight two nine and a sine of about minus zero point five five nine. | 90 − 236 + 360 on screen |
| s39_idai_wind | 10 | Across the shore, minus u sine alpha is about minus three point seven, and v cosine alpha is about minus seventeen point three. | Across the shore, we take minus u sine alpha, and v cosine alpha, and add them. | the two products on screen |
| s39_idai_wind | 12 | The official lowest pressure was about nine hundred and fifty five hectopascals, fifty eight below normal, so the sea under the eye rose about fifty eight centimetres. | The official lowest pressure was about nine hundred and fifty five hectopascals, so the sea under the eye rose about fifty eight centimetres. | 1013 − 955 on screen |
| s34_amphan_radar | 9 | Each pixel is a square sixty metres on each side, so it covers three thousand six hundred square metres, or zero point zero zero three six square kilometres. | Each pixel is a square sixty metres on each side, so it covers zero point zero zero three six square kilometres. | 60 × 60 = 3600 m² on screen |
| s34_amphan_radar | 10 | Thirty four thousand seven hundred times zero point zero zero three six is about a hundred and twenty five square kilometres of new water. | The number of dark pixels times the area of one pixel is about a hundred and twenty five square kilometres of new water. | 34 700 × 0.0036 on screen; voice relates count × area |
| s38_idai_intro | 5 | Times one point eight five two, that's about a hundred and fifty seven kilometres per hour. | With the knot converted as for Nargis, that's about a hundred and fifty seven kilometres per hour. | × 1.852 on screen (the conversion idea was said in s35) |
| s38_idai_intro | 6 | Divided by three point six, it's about forty four metres per second. | And in metres per second, it's about forty four. | ÷ 3.6 on screen (said in s35) |

### On screen (no content removed; placement / labels / highlights only)
| Scene | Change |
|---|---|
| s00 | picture swap cue "meteorology" → "they're used" |
| s04 | subtraction rows on "Its change", division rows on "divided by" (were on the voiced "a change of" / sentence start) |
| s08 S16 | rows on "the change in the arrow", "the arrow changed by", "so this piece" |
| s09 | r and v rows glow on their spoken words (S17); lap row labelled "lap =" |
| s13 | lhs "v² = 34.8²", "v²/r = 1211/25 000", "v ≈ 35:"; ÷ row on "divide by the radius"; v glows on its word, answer 0.048 glows |
| s14 | arc-rule numbers row on "radius times angle" |
| s20 | numbers row on "twice the depth" |
| s27 | "α = −239° + 360° = 121°" (was without α); α, cos α, sin α glow on their words |
| s28 | "along ≈ …", "across ≈ …" results with symbols; check stack "speed = √(along² + across²) = √(9.4² + 31.5²) = √1081", "speed ≈ 32.9 ≈ 33 m/s"; u, v and cos α, sin α glow on their words; across = −31.5 glows; substituted rows on "we multiply" / "now u goes" |
| s29 | "tan β = 6.8/55.7 ≈ 0.122 ⇒ β ≈ 7°" + "bearing ≈ 353°" row on "a bearing of about"; "across ≈ …"; α, cos/sin, u/v glow; +12.1 glows; coast-leg names fade before the across label (K6) |
| s30 | "⇒ rise ≈ 72 cm" (44 px); the 1 cm/hPa row glows on "one centimetre", 72 cm on its word |
| s33/36/39 | "tan β = … ⇒ β ≈ …°" + "bearing ≈ …°" row on "Measured clockwise"; "across ≈ …"; pressure row "⇒ rise ≈ … cm" at 44 px; α, cos/sin, u/v glow; across answer glows; "white circle" label y 625 → 690 (K6) |
| s38 | ×1.852 / ÷3.6 rows on "With the knot" / "in metres per second" |
Dropped under the balance rule after stills/SSR: "Δh =" on the s30 fraction (units say it; ran past x 1842), "dθ/dt =" on the s09 rate row
(taller row touched the next), "1013_normal" subscript on the event pressure rows (below the 44-px floor and too wide; 1013 is labelled in s30).

### Gates (final sources)
tsc 0 · at_check 585 refs / 0 failures (74 literal AT refs from word times) · swap_check 448 elements, 0 overlaps, 0 swaps < 8 frames ·
cam_speed 0 > 90°/s · eq_check 19 / 0 missing / 0 unused · stack_frame ok · SSR 13 000 scene-frames, 0 errors, NaN 0 · SSR --3d 0 errors
(THREE guard 979) · movie_symbol_lint --strict 0 (13 pre-existing lint-ok) · script_wording_lint 0 (incl. the voiced-arithmetic,
squares/roots and opening rules) · storyboard voiceovers = script (42 / 42) · manifest: `narration_r8_2026_11_07` note (no data or number
changed; data hashes untouched).

### K6 (house list, ONE tag folder `build1/stills/k6z1`, `cst_run.py stills … --jobs 2`, under HEAVY.lock)
| Run | Frames | Hits | Fixed after it |
|---|---|---|---|
| k6z1 (whole list) | 6106 listed, 5863 shot | 13 (s30 edge 9, s09 text-text 3, s29 text-text 1) | 243 event frames had thrown on the 42-px pressure row (SSR caught it too) → 44 px, subscript dropped; s30 Δh / rise rows; s09 label; s29 coast-leg names fade |
| k6z1 re-shoot s09 s29 s30 s33 s36 s39 (668 frames, same folder) | 6106 | 21 (events: "white circle" label × cos/sin row, the stack is one row taller) | label y 625 → 690 |
| k6z1 re-shoot s33 s36 s39 (250 frames, same folder) | **6106** | **0** | — |

### Stills looked at (half size, `build1/stills/k6z1/`)
f00225 (s00), f08732 (s04 check), f21976 (s08 pieces), f27536 (s09 rate), f36512 (s13), f71861 (s27), f73978 / f74644 / f75510 (s28 along,
across, speed check), f77676 / f78246 (s29), f80164 (s30), f85954 / f86080 / f87113 (s33), f100626 (s38), f103756 (s39). Seen, not
changed: the s13 "v ≈ 35:" lhs is a little long but reads; the event "white circle" label now sits 30 px above the colour-bar title.

### Mix (sound_r8)
`tools/sound/mix.py` (cue sheet unchanged: eyewall-spiral seed 31, bed −28 LUFS, duck 5 dB; effects are scene-relative and s15 / s30 have no
changed sentences) on the r8 narration, under VOICE.lock (HEAVY.lock free and 17 GB RAM free when it started): **−16.01 LUFS, true peak
−3.37 dBTP → PASS**; `tools/sound/check.py --kind mix`: I −16.0, LRA 4.6, TP −3.4, verdict OK (clicks 7354, the narration's plosives; r7
reported 7474). Output `G:/…/ch00_coordinates_storm/build1/sound_r8/narration_music.wav` (soundtrack 3672.5 s). Not installed into the bundle.

### Render (not run; orchestrator)
```
# under HEAVY.lock; the bundle in build1/bundle is the final k6z1 bundle (current sources)
cp "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/sound_r8/narration_music.wav" "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/bundle/public/narration_music_cst.wav"
mkdir -p "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/sound" && cp "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/sound_r8/narration_music.wav" "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/sound/narration_music_cst.wav"
.venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/cst_run.py render --conc 2      # 110 175 frames, 28 chunks of 4000
.venv/Scripts/python.exe movies/src/ch00_coordinates_storm/checks/cst_run.py join --mb 150
.venv/Scripts/python.exe tools/movie_qa.py "G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates_storm/build1/build1_1080.mp4" --storyboard movies/ch00/ch00_coordinates_storm/storyboard.yaml
```
`build1/render/` is empty (r7-era chunks were moved to render_n2_old_20261107); the old `build1/build1_1080.mp4` from an earlier build
is still there and is overwritten by the join.

### Disk (pass r8)
Before: C: 116.2 GB, G: 437.3 GB free (project data 148.87 GB of 150). After (`disk_guard --report`, 16:45): C: 112.0 GB, G: 430.6 GB free; **project data 155.51 GB of 150 — over the cap** (scratch 115.48 GB, all movies; this pass added the r8 TTS, the k6z1 stills and sound_r8, roughly 1–2 GB). Nothing deleted (K6 stills
k6z1, r8 TTS, sound_r8 on G: scratch, kept per the no-G:-cleanup rule).

## Fix loop 1 (after the r8 reviews, 2026-11-07)
Inputs: `reports/ch00_movies.md` "r8 review 1" (3 Must, 12 Should) and "r8 review 2: calc & sync audit" (1 Must, 13 Should, 7 Nit); Part 1's fix 2
(`ch00_coordinates_flat/fix2_2026-11-07_log.md`: every AT on Kokoro word times, exitFirst, tailIn, gold on the word). Review 1 Must 1 / review 2 Must 1
(physics gate SKIP) was resolved by the orchestrator (QA re-run with --manifest): skipped here. Locks: RENDER2.lock held (orchestrator 5c r7 full render);
renders first. Nothing rendered, committed or deleted.

### Progress
- 2026-11-07 21:30 · started; read both reviews, the remake log, Part 1 fix 2, memory (dont-voice-simple-arithmetic, natural-openings, verify-every-fact). Disk: C: 111.0 GB, G: 424.1 GB free (project data 162.14 GB of 250).
- 2026-11-07 21:40 · facts checked against IBTrACS v04r01 on G: (agency columns): Amphan 20 May 2020 09 UTC newdelhi 960 hPa (lifetime min 920 on 18 May); Nargis 2 May 2008 09/12 UTC 962 hPa (= lifetime min); Idai 14 Mar 2019 18 UTC reunion 955 hPa, 21 UTC 958 (lifetime min 940). So "official centre pressure at that hour" is right for all three (Nargis 11 UTC and Idai 19 UTC lie between two fixes of 962 / 955-958). ERA5 grid-minimum msl at the white circle (cs.json shore.*.pmin): 965.4 / 982.1 / 980.8 hPa. Sea water 1025 kg/m³, g 9.81 → 100 Pa / (ρg) = 0.0099 m. Ian's ring latitude 26.5° N (cs.json). TDR single-tower maximum 11.6 m/s.
- 2026-11-07 21:42 · `checks/fix1_script.py --write`: 9 replacements, 14 new clips (3 scenes gain one sentence: s14, s30, and each event); `script_wording_lint` 0 findings. TTS (`checks/fix1_voice.sh tts` = `fix1_splice.py` + `fix1_words_all.py`) queued for VOICE.lock.
- 2026-11-07 22:02 · TTS done under VOICE.lock (21:43–22:02): `fix1_splice.py` 14 new clips, 523 re-used (resynth correlation 0.9948; every clip within 0.05 LU of its neighbours' target, TP ≤ −1.68 dBTP); narration 3670.000 → **3737.800 s** (+67.8 s; movie 62:20.3, 112 134 + 75 frames). `fix1_words_all.py`: Kokoro token times for **537 / 537** sentences (224 from the r8 tables and the auditor's kw.json, 313 re-synthesised, every one = its clip length ±0.05 s).
- 2026-11-07 22:10 · `fix1_storyboard.py` (voiceovers = script, 0 mismatches; `fix_loop_1_2026_11_07` block), `make_timing.py --final` (cue-layout warnings of the splice are superseded by --recue), `--recue --write` with two new rules: the two-line wrap never breaks inside a number, and a cue whose only break would be inside a number is re-split (as strict as the auditor's capcheck: "and" beside a number word counts). **910 cues**, 0 > 17 cps, 0 > 2 × 42, 0 outside 1–7 s, 0 cue splits and 0 line breaks inside a number (auditor's capcheck, fix1 copy). Manifest note `fix_loop_1_2026_11_07` (no data or number changed).
- 2026-11-07 22:40 · code: `cs_lib.tsx` AT() on `words.json` (token search), `ATP()`, `goldAt / tailIn / hiOn / hiSize / exitFirst` (Part 1 fix 2 helpers); scene edits below. Static: tsc 0 · at_check 701 refs, **305 AT/ATP anchors on word times, 0 character share**, 0 failures · swap_check (now also covers cs_sD) 560 elements, 0 overlaps, 0 swaps < 8 frames (3 old s26 swaps widened) · cam_speed 0 · eq_check 19/19 · stack_frame ok · movie_symbol_lint --strict 0 (17 lint-ok: 13 old + the compass names) · script_wording_lint 0. Auditor's tools (fix1 copies in the session scratchpad `fix1s/`): sync.py **163 probes, 163 within ±0.5 s**, anchors2.py 215 literal anchors, 0 char share, max |code − real| 0.02 s, capcheck 0 / 0.
- 2026-11-07 22:45 · heavy pass queued (`checks/fix1_heavy.sh k6f1`: HEAVY.lock when VOICE free + RAM ≥ 12 GB; SSR, SSR --3d, bundle, `fix1_frames.py` = whole house list 6160 + 1637 frames in the changed scenes = 7797 stills into ONE tag folder k6f1, k6_overlap). Mix queued (`checks/fix1_voice.sh mix` → build1/sound_fix1 when RENDER2.lock and HEAVY.lock are both free, RAM ≥ 14 GB).
- 2026-11-07 23:45 · heavy pass k6f1 (HEAVY.lock 22:26–23:45): SSR 13 224 scene-frames, 0 errors, NaN 0; SSR --3d 0 errors (THREE guard 988); **7856 stills** in ONE folder `build1/stills/k6f1` (6160 house list + 1696 changed-scene frames incl. 63 look frames). K6: FAIL, 948 hits in 9 unique faults: the event "white circle" legend at y 712 on the colour-bar title (779, s33/s36/s39); the event working rows at x 1100 past the right edge (57) and s29 "u, v … (east, north)" past the edge (108); s30 941-hPa label growing past the edge on its gold pulse (2); s14 stack A / stack B overlap at the swap (2). Fixed: legend back to y 690 with the second event stack at x 1076, y 276 (6 rows end ≈ 650); s29 "(east, north)" dropped; the 941 label keeps its size (gold only); s14 stack A fades 20 frames before stack B. tsc 0, at_check 0 char share / 0 failures, swap_check 0 / 0 after the fixes. Look sheets `reports/movies/ch00_coordinates_storm/fix1/look_00–15.jpg` read (s09, s13, s14, s20, s21, s23, s26–s31, s37, s40, s41 as intended; the event scenes' sheets show the pre-fix legend).
- 2026-11-08 00:0x · the re-shoot of s14/s29/s30/s33/s36/s39 (`fix1_heavy.sh k6f1 build1/k6f1b_frames.txt`, 1652 frames into the same folder) and the queued mix were **stopped by Claude Code's low-memory reaper while still waiting for their locks** (neither had started: no lock was taken, no output written). Not restarted (instruction). OPEN: re-shoot + K6 on the whole k6f1 folder → 0 hits; the mix sound_fix1.
