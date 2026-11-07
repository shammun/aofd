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
