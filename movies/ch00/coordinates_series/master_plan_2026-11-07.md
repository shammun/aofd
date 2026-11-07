# Coordinates series: master plan after the user's feedback (2026-11-06/07)

Sources:
- `user_feedback_2026-11-06.md`: the docx, verbatim, 12 paragraphs.
- The user's chat messages of 2026-11-06/07.
- `continuity_plan.md`: the movie-director's audit. It is used for detail, and **this file overrides it** where they differ (see §C).

Execution order: **5a → 5b → 5c → 5d → 5e → 5f → 5g**, then #6 gradient (revised so ∇T is clear), then M01 and the rest of `series_plan_v6.md`.

Each movie goes through:
1. build;
2. self-check (static gates, K6 overlap check = 0, stills looked at);
3. render;
4. ≥ 2 reviews, one of them the calculation & sync audit;
5. ≤ 3 fix loops;
6. G: viewing folder + Drive.

## A. Every request, traced

| # | User request (where) | Part | Action | Check |
|---|---|---|---|---|
| R1 | No "easy" in any title or first frame; no "the easy way" voiced (chat) | all 7 + #6 | Delete "made easy" and its pulse from every s00. 5a's first sentence: "In this video, we'll learn coordinates on a flat map, and see how meteorology uses them to …". "Tensors made easy" → "our tensors movie" | wording lint flags "made easy"; look at frame 0 and the poster |
| R2 | 5a should start like the others (chat) | 5a | Same title layout as the other parts; same sentence pattern | look at the stills |
| R3 | Every video ends smoothly (chat) | all | Recap, then a teaser naming the next part's content, then the house ending. Picture and music fade together over the hold. No new idea in the last minute | look at the last 90 s; check the audio fade |
| R4 | Keep Part 1's notation; don't change 5a for it (chat, image) | 5a, 5b | 5a stays x′ = cos α x + sin α y, y′ = −sin α x + cos α y (matrix form). **No wind form is added to 5a.** 5b recalls these lines exactly and applies them to (u, v) | compare 5a's frame with 5b's |
| R5 | Q (para 8): does the series expand every equation of the original? | all | Yes, with the exceptions in R9–R12. See `continuity_plan.md` §1 | — |
| R6 | Q (para 8): does 5a explain u_r and u_θ on real maps like the original's 6–10 min? | 5a | It does: r̂ and θ̂ at real HRRR ring points, u and v split, graphs. R7 and R8 make it clearer | review |
| R7 | 5a: individual u_r and u_θ at points; show 2–3 calculations, then "the same for the others", 8 arrows (para 12) | 5a s24 | Three points worked in full, each in sync with the voice: θ, r̂, θ̂, u, v, u_r = u cos θ + v sin θ, u_θ = −u sin θ + v cos θ with the numbers, then arrows. Then 5 more points: no calculation shown (user 2026-11-07), only their arrows drawn, so all 8 u_r / u_θ arrows are on the map. Numbers come from builder rows with CHECK | calc audit |
| R8 | 5a ~32–33 min: how ū_r was computed is unclear (para 12) | 5a s22–s23 | Show the equation ū_r = (1/N) Σ u_r,i and ū_θ alike: N = 72 points every 5°, the first terms plus the total, ÷ 72 = result. Why negative means inflow toward the eye. Link it to R7's worked points | calc audit |
| R9 | 5a ending: point to Part 2; say the wind blowing across the shore brings water; say we'll see examples (para 12) | 5a s25–s27 | At the "eastward, northward, round, in, out" moment (~40:23 in fix 3), say in words that wind across the shore toward land pushes water onto the coast. Teaser: Part 2 finds how fast r̂ and θ̂ turn, adds height (cylindrical), then uses Part 1's turned axes to split coastal winds along and across the shore and see how storms push water onto coasts, with tide gauges and satellite pictures | review |
| R10 | 5b opening: say what 5a covered and what 5b covers (para 12). **Only 5b; not every part** (chat correction) | 5b s01–s02 | Rewrite s02 to about 30–40 s: Part 1 gave r, θ, r̂, θ̂ and u_r, u_θ (equations on screen). This part: how fast r̂ and θ̂ turn, then height (cylindrical), then later what the wind does to the water at the coast, with real maps. Trim the s01 preview so it isn't said twice | review |
| R11 | 5b: introduce cylindrical clearly; how it differs from polar (para 9) | 5b s15–s16 | Polar = 2 numbers (r, θ) on a flat plane; cylindrical = polar + height z, i.e. (r, θ, z). r and θ mean exactly what they did in Part 1, z counts metres up, ẑ never turns. Equations on screen: x = r cos θ, y = r sin θ ("derived in Part 1"), z = z. The flat polar grid lifts into 3-D, a z axis rises from the eye, and the cylinder at fixed r is drawn. Keyword "polar + height = cylindrical" | review |
| R12 | 5b: refer back to u_r and u_θ and show how they were calculated (para 12) | 5b s09, s16, s20, s23 | On first use: u_r = u cos θ + v sin θ, u_θ = −u sin θ + v cos θ and ū = (1/N) Σ, "derived in Part 1", plus one worked point recalled with its numbers | review |
| R13 | 5b: before the gauges and floods, show the turned-axes equations from 5a and the along/across-shore calculation with real data, like the original's ~40–41 min, with opposing arrows at Fort Myers and St. Petersburg (paras 9–11) | 5b new block B1–B6 (`continuity_plan.md` §2a) | Equations "derived in Part 1" → the same for wind (u, v) → coast angle (km map, tan, bearing → α) → FMB along 9.4 / across −31.6 onto land → StP along −15.1 / across +11.5 out to sea → opposing arrows → "onshore wind piles water against the coast" said before the evidence → gauges +2.2 m / −1.8 m | calc audit |
| R14 | 5b: for every event, wind data and an across-shore calculation, then "wind blows water inland", **then** before/after (paras 9, 12) | 5b B8, B11, B14 | Amphan (ERA5 near landfall), Nargis (ERA5, directions only, said honestly), Idai (ERA5): the equations on screen, the coast angle, the calculation with inputs, arrows across the shore, the sign meaning, then the before/after | calc audit; data registry |
| R14b | Wind vectors AND pressure for every event; an event with no wind data is dropped from 5b but archived for later cyclone movies (user 2026-11-07) | 5b + data | Wind + msl per event near landfall. Pressure gives the centre and the inverse-barometer rise (about 1 cm per hPa below about 1013 hPa) at the coastal point. Events without wind data: their before/after is cut from 5b; data, numbers and images are kept in `reports/data/ch00_storm_events_archive.md` + registry for later movies (e.g. Bangladesh cyclones) | data report; archive note |
| R19 | Verify every fact; nothing misleading (user 2026-11-07, Amphan '1999' line vs Sidr 2007 / Aila 2009) | all | Apply every non-OK row of `fact_check_2026-11-07.md` in that movie's remake (5b: the Amphan IMD-class rewrite with Sidr/Aila, Kolkata/Satkhira split, 'almost nothing', 'some of the best-known', the manifest's author order Fischer, Reasor, Rogers & Gamache 2022; 5c: Brest parallel list, Khulna wording; 5g: 'a few hundred km'; #6: tropopause 8–12 km, times in UTC; stale storyboard text). Any new claim gets its own row before TTS | fact-check table re-run per movie |
| R15 | Where do floods fit? (paras 8, 9, 11) | 5b | They stay in 5b (the maths is in 5a; 5b is the water part). The worked coast calculation moves out of 5d into 5b; 5d keeps a recall plus its 3-D and lat/lon→km steps | — |
| R16 | Every part: when an earlier result is used, recall its equation on screen and name the part (para 12) | 5b–5g, #6 | The point-of-use recall tables in `continuity_plan.md` §3: equation + keyword "derived in Part K: <name>" + one sentence, then move on. #6 s22 points to Coordinates Parts 3 and 7 | review per part |
| R17 | Check that Parts 3–7 follow on step by step for a first-time learner (para 12; chat "check whether the seven are designed correctly") | all | §B below; `continuity_plan.md` §1 and §4 gaps fixed (5d s12 S12 forward use; #6 "coordinates movie"; repeats trimmed) | final series check with `deps_v6.py` |
| R18 | After the seven, continue with the remaining movies (chat) | #6 → M01 … | Gradient revision (∇T clear), then the series plan order | — |

**User clarification (2026-11-07).** "I liked most of the contents and frames of the first video. It just needs consistency and linking to the second video, especially the calculation of the wind across and along the shore and the water pushed by it."

So **5a changes are minimal.** Priorities:
1. R1/R2: the title and first sentence.
2. Forward links: wherever 5a shows x′ and y′ or the along/across idea, a short pointer says that Part 2 uses exactly these equations to split coastal winds and to show their effect on the water with gauges and satellite maps.
3. R7/R8: tight additions inside the existing scenes.
4. Consistency fixes.

**User, 2026-11-07, firm: the minimum for 5a.** Keep the frames, which are already approved. Do only these:
- the start: title and first sentence;
- the end: links to 5b, saying wind-driven water will be shown over maps with gauges and satellite images;
- R7/R8 as small additions;
- optionally, borrow a clarifying animation from the original single movie.

The C5 maths-font sweep and the storyboard-text reconciliation are dropped for 5a.

**5b, in turn,** must recall 5a's equations at the right moment, right before each tide-water or flood before/after, and show a few calculations with them there. Each recall comes in where the story needs it, so nothing feels forced.

## B. Is the seven-part design right? (orchestrator's assessment)

- **Order.** 5a flat → 5b storm (turning arrows, cylindrical, water) → 5c sphere → 5d local frames → 5e moving frames → 5f routes → 5g maps. Each part's maths is taught before it is needed, with three exceptions:
  - the 5b coast block reads the coast's km legs off a flat km map, because lat/lon → km comes in 5c (5d later shows where the legs come from);
  - 5d s12 S12 uses a great-circle bearing before 5f: cut it or turn it into a pointer;
  - #6 cites "the coordinates movie": re-point it to Parts 3 and 7.
- **The one real design flaw** was that the application (the shore winds) lived in 5d while its evidence (gauges, floods) was in 5b. Moving it fixes the jump the user felt.
- **Length.** 5b grows by about 6 min (measured later). If that is too long, the first cut is the Nargis wind beat; the next is shortening the Amphan curtain.

## C. Where this overrides `continuity_plan.md`

1. **No wind form added to 5a s20** (plan §7, 5a item 4). The user says 5a's notation is already right and needs no change. 5b recalls 5a's x′, y′ lines and applies them to (u, v), with "along" and "across" said and tagged (not "u prime" alone).
2. **Opening recaps in 5c–5g are not deleted** (plan §3). The user objected to *adding* a "so far" recap to every part, and called most parts "very good". Their existing short recap scenes stay, trimmed only where they repeat what the part says anyway. 5b's opening is rewritten per R10. The point-of-use recalls (R16) are added in every part.
3. **5a's existing worked points** (s24, three points by hand) are kept and made clearer per R7/R8. They are not replaced.
