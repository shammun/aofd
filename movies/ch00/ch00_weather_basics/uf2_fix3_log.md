# ch00_weather_basics UF2 — fix loop 3 (2026-11-04)

Source commit before the loop: ff42422. Inputs: review 3 (`reports/ch00_movies.md`, "UF2 — review 3", 4 Must + 18 Should) and the
series-audit narration change (coordinator, 2026-11-04). No Remotion or Chrome job was run in this loop (another movie held the
machine); every check below is static (TypeScript, the two new source checkers, and the TTS/mix tools). The K6 stills, the render
and QA are still to run (commands at the end).

Line numbers are `movies/src/ch00_weather_basics/WeatherBasics.tsx` after the loop.

## New checks (no browser)
| tool | what it does | result |
|---|---|---|
| `tools/movie_wb/swap_check.mjs` | evaluates every scene's `const` declarations against timing.json and simulates, frame by frame, the opacity and box of every `Keyword`, `Callout`, `Lbl` and `TeX` (with their `<g opacity>` / `<Svg o>` wrappers); flags two blocks on one spot that are visible together (OVERLAP) or swap with < 8 invisible frames between them (TIGHT) | before: 61 OVERLAP + 13 TIGHT (it reproduces review 3's 41:08.7, 41:35.5 and 49:33.4); after: 0 TIGHT, 1 OVERLAP left = s20g "same weight?" over the `h = p0/(ρ0 g)` row, a static 2-px overlap of the width/height estimate (both on screen for 33 s; earlier K6 passes found no hit) |
| `tools/movie_wb/cam_speed.mjs` | evaluates every `globePath` / `orbitPath` camera per frame and reports its angular rate (°/s) | before: s39 1221 °/s (42:09.1–09.6 and 42:12.3–12.5, review 3's times), s02 166, s42 152, s53 152/134/94; after: max 83 °/s (s53), s39 82, s42 61, s02 42; 0 above 90 °/s |
| `tools/movie_wb/k6_fix3_frames.py` | K6 still list with the mid-swap frames the old list missed (sentence start −4 and +3) plus every 0.5 s through s38b, s39, s47, s48, s48b, s57, s58 | 3343 frames (old K6 list 1198) |

## Must
| # | finding | change | where |
|---|---|---|---|
| R3-M1 | s48 slope triangle tiny (horizontal leg ≈ 40 px) and "50 km" on the thick line | the camera zooms in on the triangle while S2 reads it (dist 10.5 → 7.0 over 3.7 s, back out over 2 s at the end of S2): horizontal leg 44 → 66 px, vertical 68 → 103 px (projector probe with the kit's `orbitCam`/`projector`); the triangle fades with the zoom-out; "50 km" end-anchored 16 px short of the leg's far end, about 21 px from the line (perpendicular) | L3548–3556 (keys), L3615 (opacity), L3626–3627 (label) |
| R3-M2 | keyword cross-fades double-expose text (s38b 41:08.67, 41:35.53; s48b 49:33.3) | every old block on a shared spot now finishes its fade ≥ 8 frames before the new one starts (old `out` = new start − 17/−18). Applied everywhere `swap_check.mjs` found the pattern — 68 old blocks in 35 scenes (+ s17's equation (15) → (17) swap): s02 (3), s05 (2), s08 (1), s14 (1), s18 (1), s18b (3), s19 (2), s19b (2), s20e (3), s20f (4), s20g (3, incl. `zoneA`), s20b (2, incl. `A2`), s20d (2), s22 (3), s26 (2), s27b (2, incl. `A1`), s27c (2), s29 (1), s31 (1), s32 (1), s35 (1), s36 (1), s38 (1), s38b (3), s39 (1), s40 (1), s42 (1; the H and L groups and both name keywords leave together), s44 (1), s45 (3), s47 (2), s48b (4), s53 (1), s54 (1), s58 (1), s60 (5; new `beatT`: the text rows and the two equations leave 12 frames before the pictures, which keep their cross-fade) | e.g. L1360, L1564, L1760, L1827, L2451, L3096–3104 (s38b), L3311–3316, L3699–3708 (s48b), L4294–4320 (s60) |
| R3-M3 | s39 whip pan (Tibet → Americas 150° in 0.6 s; snap back in 0.2 s) | new module helper `swarp` (L93–101) turns a globePath segment's cubic ease (peak 3× mean) into a sine ease (1.57×); s39: hop starts on "and the Andes" (f 626) and lands at f 707 (2.7 s); return from f 728 to f 809 (2.7 s, beside the Tibet close-up); peak 82 °/s. The "Tibet < 600 hPa" callout leaves before the turn. Same rule applied to the other three fast cameras: s02 cut-face turn 20 → 46 frames, s42 typhoon → North Atlantic 60 → 81 frames, s53 three hops 60–70 → 75–90 frames | L3137–3146, L634, L3280, L3976 |
| R3-M4 | s47 two colour bars on top of each other for 1.5 s ("−85", "158") | the 850-hPa bar fades out over 18 frames from the start of the rise; the slice bar fades in 8 frames later (`gOut`, `cbNew`); the 850-hPa map's colours leave with its bar (see S5) | L3536–3538, L3631–3633 |

## Should
| # | finding | change | where |
|---|---|---|---|
| S1 | s38b: bar on the darkened zoomed globe; hard cut at 41:47 | partly: the globe's 2-m temperature used −30…35 °C under the scene's only bar (−85…30 °C) — now the same −85…30 scale (honesty fix). The bar on the K1-dimmed globe and the K1 gradient edge are not changed (house `GlobeFrame`; see "not fixed") | L3063 |
| S2 | s39 true-colour globe uncredited 41:48–41:51 | the VIIRS credit (s02's storyboard line) shows until the ERA5 field arrives, 8 frames before the ERA5 line | L3185 |
| S3 | e_s curve leaves its graph (s28–s30, recap) | the curve stops at the 50-hPa top, interpolated (≈ 32.9 °C) | L2593–2597 |
| S4 | s05 column cut flat at y 40; "km 30" clipped | a 110-px background gradient over the top of the column box (fades the column out by y 150); tick labels within 70 px of the frame top fade out (all `HeightTicks`) | L907–909, L496–497 |
| S5 | s47/s48 850-hPa map coloured with no bar | the map turns into plain grey ground (`#2b3346`, 37 m below the map plane) as its bar leaves in s47; s48 grey from the start | L3602–3605 |
| S6 | s57/s58 readouts across the map edge; "−2 °C" | readouts at y 792 (map ends at 740; source line from 836); "−2 °C" → "2 °C" / "colder" (two rows right of the drop; the narration says "drops by about two degrees, to ten and a half") | L4223–4231, L4251–4253, L4266–4267 |
| S7 | "warm sector" on screen 1.3 s | arrives on "the warm air behind it" and stays on into s58 S1 | L4227, L4260 |
| S9 | s25 "Singapore ≈ 16.6 km, below −75 °C" mixes the Nov mean with a balloon value | "Singapore, Nov mean ≈ 16.6 km" | L2309–2310 |
| S10 | s22 "our estimate: 5.8 km" twice | the text-column row is gone; the label on the zoomed column stays | L2054 |
| S12 | s12 stacked fractions touch | fraction rows 2.6 × 62 px (were 2.35 ×), ρ = p/RT 48 px lower, "warm rises · cold sinks" at y 826 | L1133–1136, L1155–1157 |
| S13 | "Brittany" dim | the place names are drawn after the K1 frame (were under its right-hand dark panel) | L782–786 |
| S15 | K6-exempt real contacts | s22: the balloon-level dots run between the axis rod and the column edge (were on the tick labels, "km 30"). s13/s14 "1 m" on the slab edge: not moved (the camera's handedness differs between the scenes; a blind move risked a new collision) — the K6 pass below must show it; no exemption was added | L2027 |
| S16 | s40 "1609 m" 320 px from the summit | dashed level line from the label to the summit town | L3214–3215 |
| S17 | QA record | commands below use `--hard-mb 160 --budget-mb 160 --duration-window 120,3600 --composition` | — |

## Series audit (coordinator): map reading is not "the next video"
| scene | old | new |
|---|---|---|
| s50 S3 | "You'll learn to read these maps in detail in the next video." | "Later in this series, you'll learn to read these maps in detail." |
| s59 S2 | "In the next video, we'll learn to read weather maps like this one in detail." | "Later in this series, we'll learn to read weather maps like this one in detail." |
On screen: s50 and s59 keyword "weather maps →" → "weather maps: later" (44 px) (L3863, L4276); storyboard / script screen notes updated.
The Coriolis "later video(s)" lines are unchanged.

Splice (`tools/movie_wb/splice_uf2fix3.py`, `.venv-tts`, Kokoro af_bella 1.0, method of fix 2): resynth correlation 0.9637;
s50 S3 neighbour −17.13 → final −17.15 LUFS, TP −1.88 dBTP; s59 S2 neighbours −15.53/−16.80 → −16.15 LUFS, TP −1.94 dBTP; both
within ±1.5 LU. s50 +0.375 s, s59 +0.075 s: narration 3483.50 → 3483.95 s, **104 505 → 104 519 frames (+14)**; 874 cues, 0 warnings.
Then `retime_sound_uf2fix1.py` (storm-tense 3204.625 → 3389.475 s; 22 effects, offsets unchanged) and
`sync_storyboard_uf2fix3.py` (target 3486.45 s, 8640 words, 492 sentences). **The sound mix (`sound_mix.py` → `uf2/fix3/sound/`)
is NOT done**: try 1 died of memory (4.6 GiB STFT allocation while the #4 render ran); try 2 was stopped on the coordinator's
"hold heavy jobs" order after music.wav and sfx.wav (partial outputs deleted). Rerun when the machine is free.

## Not fixed (and why)
- S1 bar on the dimmed zoomed globe and the K1 gradient's hard vertical edge (≈ x 1090): needs a house `GlobeFrame` change or a
  different bar place for zoomed stack views (proposal below).
- S1 41:47 shells cut straight along 0°N: the data domain edge (0–80°N); needs a fade of the stack's southern rim (LayerStack3D).
- S8 s35 credit: the 10-m wind *is* drawn (teal streaklines from S3); the isobars need "and mean sea-level pressure" in the
  storyboard `source_line` → builder rerun (uf1.json hash), not done blind.
- S11 small text: every item is at or above the kit's 44-px floor (the kit throws below); KaTeX rows read small. Not resized blind.
- S12 s18 link into the struck "s²" and s10 "same step": need frames.
- S14 s27c "lowest 1.5 km" bracket: depends on the 3-D view; needs frames.
- S15 s13/s14 "1 m" on the slab edge: see above.
- S18 fluidpy W85/W86 tests uncommitted: a fluidpy commit (orchestrator).
