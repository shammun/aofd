# ch00_weather_basics — UF2 plan (user feedback round 2), movie-director, 2026-10-29

**What this is.** The full plan for the next build (UF2, storyboard version 5), with exact replacement text. Apply it
**after** the fix-loop-1 builder has finished syncing `storyboard.yaml` and `script.md`. This file does not touch either
of them. Everything here is planned against the working-tree storyboard and script (v4 plus the fix-loop-1 sentence
changes in s47/s48), as they stood on 2026-10-29.

**Inputs read.**
- `reports/ch00_weather_basics_user_feedback_round2.md` (U2-01…U2-23, G1–G6).
- The user's own words: `outputs/viewing_2026-10-29/weather_basics/prompt.docx`, plus `1.png`.
- `movies/HOUSE_STYLE.md` (§5b is new).
- The current `storyboard.yaml`, `script.md`, `manifest.json`, `timing.json` (v4) and `data_needs.md`.
- "v4 — review 1" in `reports/ch00_movies.md`. Its M1–M4 and S1–S10 are being fixed now, so they are not repeated here.
- The layer-stack capability test `captests/X3_stacked_levels`; its source is `movies/src/captests/comps3d.tsx → X3Stack`.
- The cross-product globe frame: `movies/src/ch00/CrossProductWhy.tsx` → `GlobeView` + `Vignette`, and `HalfEarthView`
  (`fadeBelow`) with an edge mask.

**Measured length (tools/tts.py dry run, Kokoro af_bella 1.0): 3520.50 s = 58:40.5, including U2-28** (+7.6 min on v4's 51:00). It is
148.9 words per minute, with 74 scenes and 497 sentences. Trim options down to 56:40 or 55:12 are in §9.

**Coordinator input (2026-10-29, folded in; see `movies/ch00/retrofit_5b_plan.md` §9):**
1. Q1 = (b), as clarified by the user: **nothing is removed.** Titles, dates, keywords, calculations, readouts, colour
   bars and source lines all stay in the movie, placed **beside or below** the map, image or globe, never on top of it.
   Only short labels that point at a spot on the map itself may sit on it: place names, H/L, fronts and station plots.
   §4.1 and §4.2 apply this scene by scene. Every "K3 callout" below is the same text, moved beside the picture with a
   gold link to its spot. Nothing is deleted except the ×40 circle, which the user asked to remove (U2-02).
2. Weather basics does **not** stack the 10-level Ciarán file (`ERA5-ARCO-ciaran2023-10lev`); #69 uses it for its thickness
   stack. All three WB stacks use new fetches with a different variable, place or idea (§6.1, §7.1). The temperature stack
   is now an **equator-to-pole** sector, so it is not Ciarán's Europe box.
3. UF2 builds the shared §5b house kit (K1 `GlobeFrame`, K2 `SourceBelow`, K3 `Callout`, K4 slab/column edges, K5
   `LayerStack3D` + `_stack.py`, K6 movie_qa `overlap` gate), and every spec below uses it. The fixed-y-852 `SrcLine` is
   deleted, not carried over.

---

## 0. Summary of the changes

| # | Item | Scene(s) (v4 time) | Change |
|---|---|---|---|
| U2-01, U2-03, U2-19, G1–G3 | globe framing, edge fades, source lines | every globe scene (§4) house kit K1 `GlobeFrame` (large frame, soft four-edge fades while zoomed), K2 `SourceBelow` (credit ≥ 16 px under the picture's box), K3 `Callout` for every readout (Q1 (b)) |
| U2-02 | "× 40" circle | s02 (0:33) | **removed**. Replaced by "how pictures draw it → true thickness": a thick blue halo shrinks to a hair-line on S3, then the 12-km bracket on S4 and the ×50 shell on S10 (as now) |
| U2-04…06 | parcel | s03 (2:28) | trail removed; 160 molecule dots jostle inside the 3-D box; the wind arrows flow (marching dashes) |
| §5b wind rule (coordinator) | every wind arrow moves | s01, s03, s32, s33, s35, s43, s44, s46–s49, s53, s55, s57, s58, s60 (§4.4) | house kit K7 `AnimatedWindArrow` (marching dashes or pulses, speed ∝ wind) + `FlowParticles` (advected tracks, stated time scale); direction and length from the data |
| U2-24 | recap air slab drawn wrong | s60 S2 (49:37) | the recap uses the **same 3-D column** as s05 (house K4 `ColumnFaces`: 1 m × 1 m base, ground to `COLTOP`, every edge to the top), live and animated, not a thumbnail |
| U2-25 | "climate is what you expect…" rushed | s36 (34:12) | S6–S7 replaced by S6–S12: the band = climate (usual range for that day, 1991–2020), the line = weather (what happened each day of 2023), each with a gold link on its words, then 287 of 365 days inside, then the saying |
| U2-26 | the saying sits on the figure | s36 | the saying goes **below the figure** in bold gold, clear of everything |
| U2-27 | average winds in the cross-product s33 style | s53 (45:36 = s53 S1 at 2736.2 s in v4 UF1) | s53's own NCEP 1991–2020 mean 10-m wind data, drawn the cross-product v5 `s33_trades` way: moving streaklines brightened in the belt being named, dashed gold belt circles and gold direction chevrons; a large K1 globe that flies to and hovers over each belt on its words, with soft edge fades |
| U2-28 + house rule | westerlies with their own flights; every globe in the v5 look | s53, every globe scene | s53: separate flight + hover for the North Atlantic and Southern Ocean westerlies (+1 sentence, +7.05 s measured); K1 reproduces cross-product v5 56:35–57:54 (large globe, streaks, hovers, soft fades, keywords and numbers allowed on the faded rim only, titled colour bar always, source line always below) |
| U2-07, G5 | column and slab edges | s05, s13–s15, s18, s18b, s20c, s20f, s20g, s22, s60 | all four vertical edges run to the top of the drawn column (bug: `ColumnFaces` stops the rods at `top*0.55` = 20 km) |
| U2-08 | equation off screen | s15 (10:35) | `∂p/∂z = −ρg` (96 px) and its underbraces fit inside x 1080–1840, checked by the K6 overlap gate |
| **U2-09…15** | **scale-height section** | **s18–s20c (12:00–18:40)** | **rewritten slowly. s18 and s18b are trimmed; s19 and s20 are adjusted; three new scenes: s20e tangent, s20f "a scale, not a lid", s20g the uniform-density block; s20b is rebuilt; s20c S1 is reworded** |
| U2-16 | source line on the image | s21 (20:34) | the plate ends at y ≤ 815; the source line sits below it |
| U2-17 | "from its drift we get wind" | s21 S4 | "from how the balloon drifts, we get the wind at each height" |
| U2-18 | "our car 5.8 km" | s22 (22:18) | s22 now uses the **Trappes balloon (IGRA, NOAA NCEI)** as the measurement: half of 1013 hPa at about 5.5 km, a bit lower than **our estimate**, 5.8 km. The labels are spelled out |
| U2-20, G4 | text over text and images | s27b (27:07) and every frame | s27b gets a slot layout (§3); K6 `overlap` gate in movie_qa on every 0.5 s (§4.3) |
| U2-21 | dull thermals | s31 (30:25) | a real **Copernicus Sentinel-2** ground (22 Aug 2024, the Beauce plain round Trappes) on a tilted 3-D plate, with thermals rising and flat-based clouds forming at the computed cloud base |
| U2-22 | front slice | s47 (41:29) | **kept as it is** |
| U2-23, G6 | layer stacks | new s27c, s38b, s48b | three stacks on K5 `LayerStack3D`, each different and none from the 10-level Ciarán file: humidity over the tropical Atlantic (vapour hugs the ground), temperature on curved shells from the equator to the pole (the tropopause is higher in the tropics), the cold front level by level (a front is a sloping surface) |

Scene count 68 → 74. New CHECK rows W78–W93 (§7.3, §4.4, s53). Two new fluidpy functions (§7.2). Three new data fetches (§7.1).

## 1. Feedback times mapped to the v4 scenes (timing.json v4)

| v4 time | s | scene, sentence |
|---|---|---|
| 0:32–0:33 | 32.6 | s02 S3 "It's much thinner than most pictures suggest." (the × 40 circle and the source line on the globe) |
| 2:28–2:30 | 148–150 | s03 S7–S8 (Brittany parcel) |
| 3:26 | 206 | s05 S3 (column, corner rods stop at 20 km) |
| 10:35 | 635 | s15 S8 "So partial p by partial z equals minus rho g." |
| 12:45 | 765 | s18 S9 "…it would reach zero after a climb of exactly H" → S10–S11 |
| 13:19 | 799 | s18 S12 + the keyword "H = how deep the air is" |
| 13:38–13:48 | 818–828 | s18b S4–S6 ("T is fifteen degrees", "H = 8.43 km") |
| 13:48–14:30 | 828–870 | s18b S7–S11 (the "squashing" block) |
| 17:37 | 1057 | s20b S2–S4 ("each metre takes away 1/H", "1 km / 8.43 km", "1 − e^(−1/8.43)") |
| 18:34 | 1114.7 | s20c S1 "…why the curve bends." |
| 20:34 | 1234 | s21 S3 (source line on the map plate) |
| 20:45 | 1245 | s21 S4 "…from its drift we get the wind." |
| 22:18 | 1338 | s22 S7 "That's a little lower than our five point eight kilometres…" (label "our curve: 5.8 km" read as "our car") |
| 27:01–27:07 | 1621–1627 | s27b S7–S8 (zoomed globe cut; source on the globe; 29/18 over "1 kg of vapour") |
| 30:25 | 1825 | s31 S4 (the side-view thermals) |
| 41:29 | 2489 | s47 S1–S2 (the slice; kept) |

## 2. Narration (exact text)

Rules kept: S<k> = sentence k of the **new** voiceover; `[beat]` = 1.5-s hold after a worked number. Every number on
screen is spoken. Scenes not listed here keep their current (post-fix-loop-1) narration word for word.

### 2.1 The scale-height section, U2-09…U2-15 (12:00–18:40)

**Teaching order (why it is built this way).** The user was lost because v4 talked about what H *means* before any
picture could show it. The tangent was spoken before the curve existed. "How deep the air is" sounded like a lid. "15 °C"
had no owner. The uniform column was described as "squashing" and then growing.

UF2 changes the order:
1. Define H and find its units (s18).
2. Choose the one temperature and say why (s18b). This is the same assumption that s19 needs, so it is said once.
3. Compute H = 8.43 km (s18b).
4. Solve the rule and draw the curve (s19, s19b, unchanged).
5. Only then read the curve:
   - 37 % per H (s20);
   - the tangent at the ground reaches zero at H, but the real pressure falls more slowly because the fall is p/H (s20e);
   - H is a scale, not a lid, from any height; warm against cold air (s20f);
   - the uniform-density block, with no squashing, is the same 8.43 km and the same straight line (s20g);
   - where "Δz/H per climb" comes from, as a pure number (s20b).
6. Then the equal-mass slabs, the halving height and the balloon (s20c, s20d, s21, s22).

The five pictures support each other:
- the tangent's slope, −p₀/H ≈ −12 Pa/m, equals the s16 number ρ₀g;
- the block loses those same 12 Pa in every metre, so its p(z) **is** the tangent line;
- Δz/H is the slope rule written for a small step.

**s18_scale_height** (replaces the whole voiceover; S1–S7 are unchanged, old S8–S12 are deleted, S8–S9 are new)
1. Look at the new rule: the three numbers R, T and g always appear together, as g over R T.
2. So let's give the upside-down group, R T over g, its own name: the scale height, capital H.
3. With it, our rule becomes much simpler: partial p by partial z equals minus p over H.
4. What kind of quantity is H?
5. Let's check its units.
6. R is in joules per kilogram per kelvin, and a joule per kilogram is a metre squared per second squared.
7. Multiply by T in kelvin, divide by g in metres per second squared, and we're left with metres: a height.
8. So H is a height, measured in metres.
9. Next, let's put in real numbers, and then find out what this height means.

**s18b_scale_height_number** (replaces the whole voiceover; the old block S7–S13 moves to the new s20g, rewritten)
1. So how big is H for real air?
2. H contains the temperature, so first we have to choose one.
3. Real air gets colder as we go up, as we'll see later in this video.
4. But to keep the sum simple, let's pretend that our whole column of air has just one temperature, from the ground all the way up: fifteen degrees Celsius, a typical temperature near the ground.
5. In kelvin, that's two hundred and eighty-eight point one five.
6. With R, two hundred and eighty-seven for dry air, and g, nine point eight one, H is two hundred and eighty-seven times two hundred and eighty-eight point one five, divided by nine point eight one.
7. That's about eight thousand four hundred and thirty metres, or eight point four three kilometres. [beat]
8. To see what this height means, let's first solve our rule, to find the pressure at every height.

**s19_exponential** (S1–S3 replaced; S4–S7 unchanged)
1. Here's our rule again: partial p by partial z equals minus p over H.
2. Because our column has one temperature all the way up, H is one fixed number, the same at every height.
3. That's a simplification, but it gives us a clean formula that makes a good first guess.
4. First, divide both sides by p: one over p, times partial p by partial z, equals minus one over H. *(unchanged)*
5. Here's a useful fact from calculus: the slope of the natural log of p is one over p. *(unchanged)*
6. So, by the chain rule, the left side is just the rate of change of the natural log of p with height. *(unchanged)*
7. That means the log of p falls by the same amount, one over H, for every metre we climb. *(unchanged)*

**s19b_integrate**: unchanged.

**s20_exponential_meaning** (replaces the whole voiceover; this is item (d))
1. Here's our formula drawn as a line, for our column at fifteen degrees: height goes up, and pressure goes across.
2. Let's climb exactly one scale height, so z equals H.
3. Then the power is minus H over H, which is minus one, and e to the minus one is one divided by e: about zero point three seven.
4. So when we climb eight point four three kilometres, the pressure falls to about thirty-seven percent of its ground value: from one thousand and thirteen hectopascals to about three hundred and seventy-three. [beat]
5. Climb another eight point four three kilometres, to sixteen point nine, and it falls to thirty-seven percent of that again: about one hundred and thirty-seven hectopascals, or fourteen percent of the ground value. [beat]

**s20e_tangent** (NEW, after s20; item (a). "curve" always points at the drawn slate line, item (g))
1. This picture shows H in a second way, starting at the ground.
2. There, our rule says the pressure falls by p zero over H for every metre: one hundred and one thousand three hundred and twenty-five pascals, divided by eight thousand four hundred and thirty metres, which is about twelve pascals per metre. [beat]
3. That's the same rate we found from hydrostatic balance.
4. Now suppose the pressure kept falling at this starting rate all the way up.
5. Then it would follow this straight gold line, which leaves the slate curve at the ground pointing exactly the same way.
6. A straight line like this, which touches a curve at one point and points the same way there, is called a tangent.
7. Losing p zero over H every metre, the gold line has lost all of p zero after a climb of H, so it reaches zero at exactly eight point four three kilometres.
8. The slate curve, the real pressure, falls by p over H per metre, using the pressure where we are, not at the ground.
9. As we climb, p gets smaller, so the fall per metre gets smaller too, and the slate curve moves away from the gold line, to the side of higher pressure.
10. At the height H, where the gold line reaches zero, the slate curve is still at thirty-seven percent of p zero.

**s20f_not_a_lid** (NEW; item (b) and the old s18 S12, warm against cold air)
1. So is H the top of the atmosphere? No, it isn't.
2. The pressure at any height is the weight of the air above it, so at H, where thirty-seven percent of the pressure is left, thirty-seven percent of the air is still above us.
3. The air goes on far above H, getting thinner and thinner, with no sharp top at all.
4. So H isn't a lid: it's a scale, the size of climb over which the pressure falls to thirty-seven percent.
5. That works from any height: in our column, climbing one H from five kilometres up also leaves thirty-seven percent of the pressure we had there.
6. And because T is on top of the fraction, warmer air has a bigger scale height: about seven point seven kilometres at minus ten degrees, and about eight point nine at thirty degrees.
7. So in warmer air, the pressure falls more slowly as we climb.

**s20g_uniform_block** (NEW; item (e). It does not use "squash", "squeeze" or "expand". It is a thought experiment, said as such)
1. Here's one more way to picture H: a thought experiment.
2. Our column of air on one square metre weighs one hundred and one thousand three hundred and twenty-five newtons: that's what a sea-level pressure of one hundred and one thousand three hundred and twenty-five pascals means.
3. In the real column, the air gets thinner and thinner as we go up.
4. Now let's pretend that the air had the same density at every height: the sea-level density, one point two two five kilograms per cubic metre, which we found with the gas law.
5. Let's build a block of this pretend air on the same square metre, one metre at a time, like a stack of identical bricks.
6. Each metre weighs one point two two five times nine point eight one: about twelve newtons. [beat]
7. How tall must the block be, to weigh the same as the real column?
8. Its weight is rho zero g times its height, and that must equal p zero, so its height is p zero over rho zero g.
9. That's one hundred and one thousand three hundred and twenty-five, divided by one point two two five times nine point eight one, which is about eight point four three kilometres. [beat]
10. That's the scale height again, and it's no accident: by the gas law, p zero is rho zero R T, so p zero over rho zero g is R T over g.
11. It also matches the gold line: the block loses the same twelve pascals in every metre, so its pressure reaches zero exactly at its top.
12. So H is the height our air would have if all of it had its sea-level density.
13. But the real air has no single density and no top: the block is only a way to picture H.

**s20b_per_km** (replaces the whole voiceover; item (f))
1. Now let's look at a single kilometre near the ground, and ask what fraction of the pressure it takes away.
2. Our rule says that on a small climb, delta z, the pressure changes by about minus p over H, times delta z.
3. So the fraction of the pressure that we lose is that loss divided by p: just delta z over H.
4. Delta z and H are both heights, so their metres cancel, and delta z over H is a plain number: a fraction, not a pressure.
5. For a whole kilometre, this estimate gives one kilometre divided by eight point four three kilometres: about zero point one two, or twelve percent.
6. But it uses the pressure at the bottom of the kilometre for the whole climb, and the pressure shrinks as we climb, so each metre really takes away a little less than the one before.
7. To get the exact loss, we use our formula: after one kilometre, p over p zero is e to the minus one over eight point four three, which is about zero point eight eight eight.
8. So the share we lose is one minus zero point eight eight eight, about zero point one one, or eleven percent: a bit less than twelve, as expected. [beat]
9. Eleven percent of what?
10. Of the pressure at the bottom of that kilometre.
11. So the first kilometre takes one thousand and thirteen hectopascals down to about nine hundred, and the next takes nine hundred down to about eight hundred.
12. Each kilometre takes away the same fraction, so the drops get smaller as we go up: about a hundred and thirteen hectopascals in the first kilometre, but only about a hundred and one in the second.

**s53_trades_westerlies** (U2-28): one new sentence after S5. Old S6 and S7 become S7 and S8.
- + S6 "Over the Southern Ocean, where little land slows them down, the westerlies blow strongest of all."
- Measured: 6.70 s clip + 0.35 s gap = **+7.05 s** (`dryrun_uf2/supp2/`).
- CHECK W93 adds: the NCEP 1991–2020 mean 10-m speed averaged over 45–60°S exceeds that over 40–55°N.

**s20c_equal_slabs**: only S1 changes (U2-15). The other sentences are unchanged.
- − "Here's another way to see why the curve bends."
- + "Here's another way to see why the pressure falls more slowly higher up."

**s20d_halving**: unchanged.

### 2.2 The balloon and the half-pressure height (U2-17, U2-18)

**s21_balloon_pressure**: only S4 changes.
- − "As it rises, it radios back the pressure, the temperature and the humidity, and from its drift we get the wind."
- + "As it rises, it radios back the pressure, the temperature and the humidity, and from how the balloon drifts, we get the wind at each height."

**s22_mass_below** (replaces the whole voiceover; S1–S3 are unchanged; the source is now the Trappes balloon, not the standard atmosphere)
1. Since pressure is the weight of the air above, the pressure at any height also tells us how much air is left above it.
2. At the ground, the pressure p zero is the weight of the whole column, and at height z, the pressure p is the weight of only the air above z.
3. So p over p zero is the share of all the air that's above us, and the share below is one minus p over p zero.
4. This time, let's use a real measurement: the weather balloon from Trappes that we just met.
5. It measured half of one thousand and thirteen hectopascals, about five hundred and seven, at about five and a half kilometres up.
6. So there, p over p zero is a half, and one minus a half is a half: half of all the air is below that height. [beat]
7. Our own estimate from the scale height was five point eight kilometres, so the measured height is a bit lower than our estimate, because the real air up there is colder than the fifteen degrees we assumed.
8. At sixteen kilometres, the balloon measured about one tenth of one thousand and thirteen hectopascals, so nine tenths of the air is below.
9. And a little above thirty kilometres, ninety-nine percent of the air is below.
10. That's why the atmosphere is such a thin shell.

The numbers come from the IGRA v2 Trappes sounding (00 UTC 1 Nov 2023, `data/soundings.json → trappes`), interpolated
linearly in ln p with `fluidpy.diag.sounding.level_crossing(z, ln p, value)`:
- p₀/2 = 506.6 hPa at **5.452 km**;
- p₀/10 = 101.3 hPa at **16.005 km**;
- p₀/100 = 10.1 hPa at **30.507 km**.

The sounding's top is 33.94 km, so all three are measured, not extrapolated. Our isothermal estimate is 5.846 km (W63).
As a cross-check, the 1976 standard atmosphere gives 5.482 km (W64, kept as a recorded cross-check and not spoken).

### 2.3 The three layer stacks (G6)

**s27c_vapour_stack** (NEW, after s27b)
1. So where in the air is all this vapour?
2. Let's lift the humidity off the globe and look at it at ten heights at once, from the sea surface up to about nine kilometres.
3. Near the sea, the tropical air has up to about twenty grams of vapour per kilogram, but three kilometres up, only a few grams, and at nine kilometres, almost none.
4. In fact, about half of all the vapour here lies in the lowest one and a half kilometres. [beat]
5. That's because the air higher up is much colder, and as we'll see next, the colder it is, the less vapour there can be before it turns into drops.

**s38b_reanalysis_stack** (NEW, after s38)
1. Because the reanalysis covers every height, we can also look at the air in layers.
2. Here is its temperature from the equator to the North Pole, over Africa and Europe, at midday on the second of November, at sixteen heights, from near the ground up to about forty-five kilometres, all in the same colours.
3. Going up, each layer is colder than the one below, until we reach the tropopause, where the cooling stops.
4. Over Europe, that happens at about ten kilometres, at about minus fifty degrees.
5. Over the tropics, the cooling goes on to about sixteen kilometres, where the air is colder still, below minus seventy-five degrees, just as the Singapore balloon showed.
6. Above about twenty-five kilometres, the layers get warmer again, in the stratosphere.
7. A balloon measures just one column of all this, and the reanalysis fills in the rest.

**s48b_front_stack** (NEW, after s48, before s49)
1. Now let's put the two side views back into the air around them.
2. Here is the temperature at eleven heights, up to about five and a half kilometres, at six in the evening on the first of November, coloured like the slices.
3. On every layer, a gold line marks the edge of the cold air: the cold front at that height.
4. Watch the gold lines as we climb: each one sits a little further back, towards the cold air, about a hundred and thirty kilometres back between one and a half and four kilometres up. [beat]
5. Stacked together, the lines trace one sloping surface: the cold wedge we saw from the side.
6. So a front isn't just a line on a map: it's a sloping boundary between two air masses.

**Data rule for the stacks (data_needs §D).** The stack numbers are planning values. They come from the 2 Nov 12 UTC
10-level file on G: and the 46.5°N slope W70 = 1:49.9. CHECK rows W84–W86 assert them on the new fetches. If a value
falls outside its range, the sentence follows the data. Each W row says which rounding goes with which words.

### 2.4 Weather and climate (U2-25)

**s36_weather_climate**: S1–S5 are unchanged. Old S6–S7 are replaced by S6–S12.
- − S6 "The weather line jumps around from day to day, but most of the time it stays inside the band."
- − S7 "Climate is what you expect; weather is what you get."
- New:
  6. Let's read this picture one part at a time.
  7. The shaded band is the climate: for each day of the year, it's the usual range of temperatures on that day, taken from the thirty years nineteen ninety-one to twenty twenty.
  8. The thin line in the middle of the band is the average for that day.
  9. The orange line is the weather: what the temperature actually was at Brest on each day of twenty twenty-three.
  10. It jumps around from day to day, and now and then it breaks out of the band, in a warm spell or a cold snap.
  11. But in twenty twenty-three, it stayed inside the band on two hundred and eighty-seven days out of three hundred and sixty-five, close to the usual eight in ten. [beat]
  12. That's what people mean by a well-known saying: climate is what you expect, and weather is what you get.

The numbers come from `data/brest_climate.json`: `inside_2023` = 287, `share_2023` = 0.786 and `share_base` = 0.804 (the
10–90 % band, pooled ±7 days, from `fluidpy.diag.climatology.daily_climatology` / `band_share`). The CHECK is W91 (§7.3).

### 2.5 Recap (keeps it consistent with the new meaning of H)

**s60_recap**: only S3 changes.
- − "By hydrostatic balance, it falls with height, roughly exponentially, with a scale height of about eight kilometres."
- + "By hydrostatic balance, it falls with height, roughly exponentially: every climb of one scale height, about eight point four kilometres, leaves about thirty-seven percent of the pressure."

The recap picture changes from "H ≈ 8 km" to "H ≈ 8.4 km → 37 % left".

### 2.6 Unchanged narration
All other scenes keep their words: s00–s17, s19b, s20c (except S1), s20d, s21 (except S4), s23–s27b, s28–s35, s36 (S1–S5), s37–s48, s49–s59,
s60 (except S3), s61. U2-02, 04–08, 16, 19–21 change only the picture.

## 3. Visual specs (changed and new scenes)

General rules for every scene below:
- house-dark-v1; picture zone x 80–1000, maths zone x 1060–1840, content y 40–860, caption band 880–1040 empty;
- 44-px floor;
- every reveal sits on its words (AT(k, "…"));
- the K6 overlap gate (§4.3) passes on every frame;
- every credit is a K2 `SourceBelow` on the picture's box, and every readout about a picture is a K3 `Callout`.

**s02_thin_shell (U2-02, U2-03, G1).**
- Delete the gold ×40 zoom circle and its "× 40" label, everywhere.
- **S3** "much thinner than most pictures suggest":
  - On AT(3, "most pictures") a soft sky-blue halo 70 px thick (about how textbook globes draw the air) appears round the
    limb. Keyword "how pictures draw it" (54 px, maths zone) with a gold pointer to the halo's edge.
  - On AT(3, "much thinner") the halo shrinks over 1.5 s (easeIO) to the true thickness. At this silhouette radius 12 km is
    0.7 px, so it is drawn as a 2-px sky-blue hair-line, and the 2-px minimum is listed in `exaggeration`. The keyword
    becomes "true thickness" (pointer re-targets to the hair-line).
  - The camera stays whole-globe here (dist 3.8), so no fades are needed.
- **S4–S9** as v4: the wedge, the orange radius rod, the desk globe, the CalcStack. Hide the texture strip behind the wedge
  (fix-loop S6).
- **S10** ×50 shell as now.
- **Source line:** "Image: NASA VIIRS true colour (NASA GIBS) · 2 Nov 2023" as K2 `SourceBelow` on the K1 frame box
  (x 80–1000, y 40–820). The globe silhouette stays inside the box at every camera key (whole-globe radius ≈ 380 px).

**s03_air_parcel (U2-04, U2-05, U2-06, G1, G3).** This is the Brittany close-up as built (three.js terrain, the builder's
accepted deviation), after the fix-loop-1 S2 fixes (cross-fade, place names, no tile edge, the box travels).
- **No trail.** Delete the teal trail polyline and its 3-s tail.
- **A parcel that reads as a parcel:**
  - The box faces are teal #2aa198 at 22 % (was 35 %), with teal edges of 3 px on all 12 edges.
  - Inside are 160 molecule dots, instanced points of 6 px with no size attenuation. 140 are warm white #f4ecd2 and 20 are
    teal-light #7fe3d6.
  - The dots move in the **box's own frame**: seeded straight-line motion with mirror bounces off the six faces. They use
    the same seeded generator as the s03 S4 molecule box, so the viewer sees "the same molecules" now inside the parcel.
  - Speed: a dot crosses the box in about 1.0–1.6 s. Positions are an analytic function of the frame (`random(seed)`), so
    no state is carried between frames.
  - The dots ride with the box along the ERA5 track (W75). Listed as illustrative in `exaggeration`.
- **Flowing wind arrows.** Each of the 20 arrows on the 0.5° grid keeps its direction and length from the hour-interpolated
  u10/v10, as now, and is drawn with house kit **K7 `AnimatedWindArrow`** in `dash` mode (§4.4: marching dashes at the
  house k = 6 px s⁻¹ per m s⁻¹, solid head), at opacity 0.85. On AT(8, "Wherever the wind goes"), the 6 arrows nearest the
  box brighten for 1 s, so the parcel is seen moving with them.
- **Frame and source.** The globe flight and the terrain sit in a K1 `GlobeFrame`, with four-edge fades while zoomed, so
  the tile edge is never seen. The credit is K2 `SourceBelow` under the frame box. "Brittany", "Brest" and "English
  Channel" stay as outlined place labels. "air parcel" becomes a K3 `Callout` in the maths zone with a gold link to the
  moving box; the link follows the box's projected centre.

**s05, s13, s14, s15, s18, s20c, s22, s60 (U2-07, G5).**
- In `ColumnFaces` (WeatherBasics.tsx ≈ line 812) the four corner `Rod3D` run from z 0 to **z = top** (`COLTOP`), not
  `top*0.55`.
- Opacity is constant at 0.7, with a slightly brighter colour #9fd3ff and px 3. Only the faces fade with density.
- The column box itself is drawn to `COLTOP`, at or above the top edge of the picture, so the edges leave the frame at the top.
- The same applies to every other column or slab frame:
  - the s13–s15 slab (its four vertical edges plus the column's);
  - the s20c ten slabs (column edges full height; slab tops are horizontal gold rings, as now);
  - the s20f two columns and the s20g real column;
  - the s22 column;
  - the s60 mini column.
- **The s20g pretend block is the only box with a top.** Its sharp top at 8.43 km is the point of the thought experiment.
  The storyboard says so, so reviewers do not flag it.
- These come from house kit K4 (the kit_wb `col3d` pieces promoted). The K6 gate gets a geometry assert: every column's vertical edges reach `COLTOP`.

**s15_hydrostatic (U2-08).**
- The main equation `\dfrac{\partial p}{\partial z} = -\rho\, g` at 96 px is placed with its left edge at x 1120 (≈ 400 px wide).
- Underbraces: "how fast p" / "changes with height" under ∂p/∂z, and "weight of" / "each m³" under −ρg, each two lines at
  44 px and ≤ 360 px wide.
- The CalcStack rows above are right-limited to x 1840. A row wider than 760 px at 68 px drops to 60 px, which keeps the
  44-px floor. If it is still too wide, it splits at "=".
- The K6 gate asserts that every text block has right ≤ 1840.

**s18_scale_height (U2-09, U2-10).**
- Remove the S8–S12 graph, the tangent, the keyword "H = how deep the air is" and the colder/warmer columns. They move to
  s20e and s20f, rebuilt.
- Picture: the s05 3-D column with its z axis, as v4. Its edges now go to the top.
- Maths zone as v4 for S1–S7 (fix-loop M2 keyword position applies).
- S8: under the units line, the keyword "H: a height (metres)" with a gold underline on "m".
- S9: the keyword "next: numbers, then meaning" (slate, 44 px).

**s18b_scale_height_number (U2-11, U2-12).**
- Picture: the same 3-D column.
- S3 "Real air gets colder": a faint slate ribbon beside the column, drawn from `ussa` T(z) 0–12 km, cooling to −56 °C, with
  the keyword "real air: colder higher up" (slate).
- S4 "pretend…one temperature": the column takes one uniform warm tint (#e8833a at 25 %). A thermometer icon at the column's
  base and one at its top both read "15 °C". Keyword "pretend: one temperature, 15 °C, ground to top" in two lines.
- S5: "T = 15 °C = 288.15 K" (68 px).
- S6: CalcStack line 1 `H = \dfrac{R\,T}{g} = \dfrac{287 \times 288.15}{9.81}`, with gold underbraces "dry air" under 287,
  "15 °C" under 288.15 and "gravity" under 9.81.
- S7: line 2 `\approx 8430\ \mathrm{m} = 8.43\ \mathrm{km}` (gold underline), then [beat].
- S8: a gold tick "8.43 km" appears on the column's z axis. The keyword "what does it mean?" is the hand-off.
- No uniform block in this scene.

**s19_exponential.** As v4, plus fix-loop items. Change the S2 keyword to "one temperature → H fixed" and the S3 keyword to
"a simplification" (slate).

**s20_exponential_meaning (U2-12).**
- The p(z) graph: height 0–18 km up, pressure 0–1050 hPa across, ticks 52 px. The slate curve p₀e^{−z/H} with H = 8.43 km.
- S1: the axis titles pulse on "height goes up" and "pressure goes across".
- S2: a gold marker climbs the curve to z = H.
- S3: CalcStack `e^{-H/H} = e^{-1} = \dfrac{1}{e} \approx 0.37`.
- S4: TipLabels "1013 hPa" at the ground and "373 hPa · 37 %" at 8.43 km, with a gold "× 0.37" arrow between them, then [beat].
- S5: the marker climbs to 16.9 km, "137 hPa · 14 %", a second "× 0.37" arrow, then [beat].

**s20e_tangent (NEW; U2-09, U2-15).** Same axes as s20 and same camera, with no cut, only a 10-frame cross-fade of the
maths zone.
- S1: a gold ring at the ground point (1013 hPa, 0).
- S2: maths zone CalcStack:
  - `\text{fall per metre at the ground} = \dfrac{p_0}{H}` (keyword row, 54 px);
  - `= \dfrac{101\,325\ \mathrm{Pa}}{8430\ \mathrm{m}} \approx 12\ \mathrm{Pa/m}`, then [beat].
- S3: a gold `CurvedLink` from "12 Pa/m" to a small faint thumbnail of the s16 line "ρ g ≈ 12 Pa/m", with the keyword "same
  as hydrostatic balance".
- S5: on AT(5, "straight gold line") the gold dashed line, 6 px, grows from the ground point upwards and to the left over
  2.5 s. It is the tangent p = p₀(1 − z/H), stopping at (0 hPa, 8.43 km). The slate curve pulses once on "slate curve".
- S6: keyword "tangent" with a gold pointer to the touching point, plus a short highlight band on the first 1 km where
  line and curve overlap.
- S7: maths zone `p_0 - \dfrac{p_0}{H}\,z = 0 \;\;\text{at}\;\; z = H`. On "zero at exactly", the gold line's top end gets
  the tick "H = 8.43 km" on the height axis.
- S8: three small slate "fall per metre" arrows along the slate curve, at z 0, 4 and 8 km. Their length is proportional to
  p/H and they get shorter going up; they carry no numbers.
- S9: the gap between gold line and slate curve fills with a faint gold band that grows with height. Keyword "falls more
  slowly higher up".
- S10: at z = H, a gold dot on the gold line labelled "0" and a slate dot on the curve labelled "37 %", joined by a gold
  bracket.

**s20f_not_a_lid (NEW; U2-10).**
- S1–S4: the s20 graph extends upwards. The height axis rescales to 0–40 km over 1.5 s (MapCamera-style re-label); the curve
  continues thinning towards p = 0 and never touches it. The region left of the curve and above z = H is shaded teal-light
  at 25 % with the label "37 % of the air: still above H". A gold dashed horizontal line at H carries the keyword "H: a
  scale, not a lid".
- S5: the marker jumps to z = 5 km, a gold bracket spans 5 → 13.43 km with "× 0.37" beside it, and the keyword "from any
  height".
- S6–S7: the graph cross-fades to two 3-D columns (View3D, s05 family) on 1 m² bases. Left is slate "−10 °C", right is
  orange "30 °C". Both fade with height at their own e-folding (`isothermal_pressure` with T = 263.15 and 303.15 K) and both
  have edges to the top. Gold ticks on each at its H: "7.7 km" and "8.9 km". The keyword "warmer → bigger H" goes in the
  maths zone, and `H = \dfrac{R\,T}{g}` (84 px) with T pulsing.
- S7: both columns show a teal fill below their H, so the warm one visibly holds its air higher.

**s20g_uniform_block (NEW; U2-13).**
- Picture zone: two 3-D boxes side by side on 1 m² bases, each labelled "1 m²" and "1 m" on its edges. Camera el 20°, az 25°
  with a slow orbit of +8°.
- Height axis 0–12 km at the left, ticks 0, 4, 8, 12 at 52 px.
- **Left box "real column"**: it fades with height (`ussa_rho`, as s05), its edges run to the top, and its top fades out.
- **Right box "pretend block"**: a uniform sky-blue at 55 %.
- S2: a brown weight arrow under the real column with the label "101 325 N", and the keyword "1 m² × 101 325 Pa = 101 325 N"
  in the maths zone.
- S3: the real column's fading is highlighted (a gold bracket along its side, "thinner going up").
- S4: the right base fills with one 1-m-tall uniform slab. Keyword "pretend: same density everywhere", then
  `\rho_0 = 1.225\ \mathrm{kg/m^3}` (68 px) with "sea-level density (gas law)".
- S5: a 1-m slab stacks quickly. A zoom inset (lower right of the picture zone, 300 × 260 px, gold frame line, not a box
  fill) shows ten identical 1-m bricks, with the keyword "like identical bricks". The block then grows continuously.
- S6: CalcStack `1.225 \times 9.81 \approx 12\ \mathrm{N}` with the label "each metre". The inset's top brick shows "12 N",
  then [beat].
- S7: keyword "same weight?" and two equal brown arrows under both bases.
- S8: `\rho_0\, g\, h = p_0 \;\Rightarrow\; h = \dfrac{p_0}{\rho_0\, g}`.
- S9: `= \dfrac{101\,325}{1.225 \times 9.81} \approx 8.43\ \mathrm{km}`. The block's top meets a gold dashed line at 8.43 km
  on the axis, then [beat].
- S10: `\dfrac{p_0}{\rho_0\, g} = \dfrac{\rho_0 R T}{\rho_0\, g} = \dfrac{R\,T}{g} = H`, with the two ρ₀ struck, and a gold
  `CurvedLink` to the s18b result "H ≈ 8.43 km".
- S11: a small p(z) inset beside the block, the s20e axes in miniature. The block's pressure is a straight gold line
  falling 12 Pa per metre to 0 at 8.43 km, the same line as the tangent. Keyword "= the gold line".
- S12: keyword "H = height at sea-level density".
- S13: the pretend block fades to 30 % and the real column brightens. Keyword "real air: no single density, no top" (slate).

**s20b_per_km (U2-14).**
- Graph zoom onto the lowest 2 km, as v4: height 0–2 km, pressure 750–1050 hPa.
- S2: a small step Δz highlighted on the curve near 0.5 km, with gold brackets "Δz" (vertical) and "Δp" (horizontal).
  Maths `\Delta p \approx -\dfrac{p}{H}\,\Delta z`.
- S3: `\dfrac{\text{pressure lost}}{p} = \dfrac{\Delta z}{H}` (84 px).
- S4: below it, `\dfrac{\mathrm{m}}{\mathrm{m}}` with both m struck (`Strike`), and the keyword "a plain number: a fraction".
- S5: `\dfrac{1\ \mathrm{km}}{8.43\ \mathrm{km}} \approx 0.12` with "estimate: 12 %". The km struck the same way.
- S6: on the 0–1 km stretch, a short gold tangent at the bottom of the kilometre against the slate curve, plus the keyword
  "uses the bottom's p for the whole km" (two lines, 44 px). Three "fall per metre" ticks along the km shrink slightly.
- S7: `\dfrac{p(1\ \mathrm{km})}{p_0} = e^{-1/8.43} \approx 0.888`.
- S8: `1 - 0.888 \approx 0.11` with "exact: 11 % (a bit less than 12 %)", then [beat].
- S9–S12 as v4: "11 % of the pressure at the bottom of that kilometre", the bracket 0–1 km; 1013 → 900 → 800 hPa; the bars
  −113 hPa and −101 hPa. The second bar is labelled "2nd km" (fix-loop S10).

**s20c_equal_slabs.** As v4 plus fix-loop S7. Column edges to the top (G5). Nothing else changes.

**s21_balloon_pressure (U2-16, U2-17).**
- The tilted 3-D map plate is scaled and positioned so that its lowest projected point is at y ≤ 815 on every camera key.
  The plate sits in a K1 `GlobeFrame` with soft edge fades.
- The credit is K2 `SourceBelow` on the plate's projected box (≥ 16 px gap).
- The readout chips "p · T · humidity · wind" become K3 callouts in the maths zone.
- S4: the keyword "wind at each height ← drift" (54 px). A short teal drift arrow on the balloon's path aloft, with a gold
  pointer from the keyword.
- Balloon gondola non-gold (fix-loop S8).

**s22_mass_below (U2-18).**
- The 3-D column, 0–35 km, edges to the top.
- The **Trappes balloon points** (teal dots, IGRA, every reported level) stand along the column's left edge as a vertical
  strip, with the label "Trappes balloon" (54 px teal) on S4.
- S5: a teal marker at 5.45 km with the TipLabel "measured: half at 5.5 km". The CalcStack shows `\dfrac{1013}{2} \approx 507\ \mathrm{hPa}`.
- S6: `1 - \dfrac{507}{1013} \approx 0.50` and "half the air below", then [beat].
- S7: a slate tick just above, at 5.85 km, "our estimate: 5.8 km", and a gold bracket between the two marks with "a bit
  lower" (44 px). **No abbreviations**: "our curve" and "ours" are gone.
- S8: marker at 16.0 km, "16 km: 90 % below", `1 - 0.10 = 0.90`.
- S9: marker at 30.5 km, "just above 30 km: 99 % below" (on the column diagram, which is not an image).
- S10: the ×50-shell globe zoom onto the limb with a gold line at 30.5 km. G1 fades while zoomed.
- **Source line** (replaces both v4 lines): "Data: IGRA v2 radiosonde (NOAA NCEI) · Trappes, near Paris · 1 Nov 2023, 00 UTC"
  from AT(4, "a real measurement"), and on S10 "Image: NASA VIIRS true colour (NASA GIBS) · 2 Nov 2023".

**s27b_vapour_pressure (U2-19, U2-20; slot layout).**
- The globe takes the main space while it is zoomed on the tropics (G1, G2):
  - K1 `GlobeFrame` in the v5 look (large globe, soft fades, right panel while zoomed);
  - colour bar in the maths zone at x 1120, y 760 (title above it at y 726), off the globe;
  - the ring label "q ≈ 20 g/kg" is a K3 callout in the maths zone linked to the ring;
  - credit: K2 `SourceBelow` on the frame box.
- **Slot grid for the maths zone**: rows at y = 150, 260, 370, 480, 590, 700. A 54–68-px line takes one row; an 84-px
  equation takes two. An item may enter a row only after the previous occupant has faded (fout ≥ 8 frames before).
  - S2–S4: `e \approx 1.61\, q\, p` takes rows 150–260; the underbraces take row 370, each label ending at least 12 px
    before the next. The gold pointers **end at the label's edge**, never crossing its text. "this e: vapour pressure, not
    2.72" takes row 480.
  - S5–S9: the globe frame fades out completely, so nothing is drawn over the image, and the two "1 kg" boxes come into the **picture zone** (x 120–940, y 180–560), side by
    side, 340 px each, 100 and 161 dots.
    - Their labels "1 kg of air" and "1 kg of vapour" sit under the boxes at y 610, with "29" and "18" under them at y 690.
    - In the maths zone, `\dfrac{29}{18} \approx 1.61` takes rows 150–260.
    - Then "molecule share" / "= 1.61 × mass share" take rows 370 and 480.
  - S10–S11: the boxes fade, the globe returns to full and the gold ring "q ≈ 20 g/kg" appears on the globe. The CalcStack
    takes rows 150–480.

**s31_cloud_base (U2-21, the real ground).**
- **Picture zone**: a tilted 3-D plate (kit_wb `MapPlane`, as s26) covering 48.05–48.85°N, 1.20–2.40°E. That is about
  89 km × 89 km of the Beauce plain south-west of Paris, with Trappes (48.77°N 2.01°E) inside.
  - The texture is the **Copernicus Sentinel-2 L2A true colour** of **22 Aug 2024, 10:58 UTC** (tiles 31UCP and 31UDP, cloud
    0.49 % and 0.0 %), warped to 2560 × 1707 px in EPSG:4326 (§7.1, D-UF2-3).
  - Late-summer harvested fields are golden and bare, which is where thermals start.
  - Heights are ×20, as in s26 (listed).
  - Camera: oblique, el 18°, az −25° → +10° slowly, rising to el 26° on S6.
  - A small gold dot "Trappes" marks the s21 balloon site (place label, on-picture tag).
- **Thermals.** 14 translucent parcels (Sphere3D, Phong) rise from 14 seed cells: the 14 brightest 2-km cells of the image,
  computed by the builder (W87).
  - Each parcel's colour follows `dry_parcel_ascent` from 25 °C on the s26 warm→cool ramp; its radius follows (V/V₀)^{1/3}
    with the change drawn ×5, as s26 and W69.
  - Each leaves a faint heat-shimmer ribbon below it: a vertical translucent quad with slowly scrolling seeded noise, opacity 0.15.
  - The parcels start staggered, one every 0.4 s, and rise in 6 s to the LCL plane.
- **The cloud base.** On reaching the computed cloud base (`lifting_condensation_level(25 °C, 13.1 °C)` ≈ 1.5 km, the s31
  number), each parcel's top turns into a white cumulus puff (6–9 instanced soft sprites, seeded) with a **flat bottom on
  the plane**.
  - S5: a translucent gold plane appears at 1.5 km (×20). "cloud base ≈ 1.5 km" is a K3 callout in the maths zone,
    linked to the plane's edge.
  - S7: the puffs stand in a row on that plane. "same height → flat bases" is a K3 callout.
  - The last 3 s of S7: the plate texture cross-fades to the 24 Jun 2024 MODIS Aqua 250-m image of the same box (crop of
    the s26 product), showing a real flat-based cumulus field from space, while the drawn puffs fade.
- **Maths zone**: the T and Td graph and `12 \div 8 \approx 1.5\ \mathrm{km}` as v4 (unchanged numbers).
- **Source lines** (K2 `SourceBelow` on the plate's projected box; the plate sits in a K1 frame):
  - from S1: "Image: contains modified Copernicus Sentinel-2 data (ESA) · 22 Aug 2024, 10:58 UTC · Beauce, south-west of Paris";
  - from the MODIS cross-fade: "Image: NASA MODIS Aqua 250 m (NASA GIBS) · 24 Jun 2024, about 13:20 UTC · same area".

**s53_trades_westerlies (U2-27: the cross-product s33 style).**
- **Reference.** Cross-product v5 `s33_trades` (56:35 in `0.2_cross_product_v5_full_FINAL.mp4`; `CrossProductWhy.tsx`
  `S33`, ≈ line 4595):
  - `GlobeView` with `Streaks` of the global mean-wind trails, with `bright(lat)` raising the named belt (×1.4) and dimming
    the rest (×0.45);
  - `globePath` keys with dist 2.4 hovers and a `hop` between oceans;
  - dashed gold `LatCircle`s at the belt edges;
  - gold chevrons along the belt pointing the way the wind blows;
  - `Vignette` while zoomed;
  - keywords beside the globe.
- **Shared kit.** Promote these pieces to the house kit:
  - `Streaks` + `bright` + `decodeTrails` become **K7 `FlowParticles` (globe mode)**;
  - the chevron row becomes **K7 `BeltChevrons`** (lat, lon range, spacing 10°, direction from the data);
  - `globePath` with `hop` becomes **`house/kit/globecam.ts`**.
  - The cross-product movie then imports them back (retrofit plan).
- **Data: unchanged.** These are s53's own NCEP/NCAR R1 1991–2020 mean 10-m u/v (A5) and its `advect_on_sphere`
  streaklines, plus the ERA5 Ciarán track. The 5° arrow grid is replaced by the streaklines. The "5 m/s" scale is kept as
  a K3 callout beside the globe: an animated K7 `dash` arrow of 5 m/s length, with its label.
- **Frame.** K1 `GlobeFrame` in the v5 look (§4.1). The whole globe has radius ≈ 390 px; the hovers at dist 2.4 fill
  x 40–1360 with soft fades and the right panel, as in 2.png. Callouts sit in the maths zone. The credit is K2 under the box:
  "Data: NCEP/NCAR Reanalysis 1 (NOAA PSL) · 1991–2020 mean 10-m wind · storm track: ERA5 (Copernicus C3S)".
- **Camera keys** (`globePath`, easeIO; hold = hover with a 2°/s slow drift east so the flow keeps moving under the camera):

| Sentence (words) | Key | Picture |
|---|---|---|
| S1 "The winds near the ground follow these belts." | f 0 {lat 15, lon −30, dist 3.8} (= s52 end) | whole globe, no fade; streaklines fade in over 20 frames; dashed gold circles at 30°N and 30°S and a faint gold band at the equator (s52's belts) |
| S2 AT "Between the subtropical highs" | → {15, −35, 2.4} over 45 frames, then hover | fly to the tropical North Atlantic between the Azores "H" and the equator; `bright` = 1.4 for \|lat\| ≤ 30, 0.45 elsewhere; callouts "trade winds" on AT(2, "called the trade winds") and "sailing ships" with a small ship icon on its words |
| S3 AT "North of the equator" | hover {15, −40, 2.4} | `BeltChevrons` along 15°N, 60°W–10°W, pointing towards the south-west (from the north-east); callout "north-east trades" |
| S4 AT "South of it" | → {−15, −20, 2.4} over 50 frames | glide across the equator to the South Atlantic (the St Helena high "H"); chevrons along 15°S pointing north-west; callout "south-east trades" |
| S5 AT "Poleward of the subtropical highs" | hop → {48, −30, 2.4} over 60 frames (hop 0.6), then hover | **westerlies, own flight and hover (U2-28)**: the North Atlantic between the Azores high and Brest; `bright` = 1.4 for 35–65°, 0.45 elsewhere (as `S34`); dashed gold circle at 45°N; chevrons along 45°N pointing east; callouts on the faded rim: "westerlies", "named from where they blow", a gold arrow "from the west", "towards the east" |
| S6 (new) AT "Over the Southern Ocean" | hop → {−50, 30, 2.4} over 60 frames, then hover | **a second westerly belt with its own flight and hover**: circles at 45°S and 55°S, chevrons east, the brightest and fastest streaks of the scene; callout "Southern Ocean: strongest" |
| S7 AT "That's why storms like Ciarán" | → {47, −12, 2.8} over 70 frames | back over the Bay of Biscay; the ERA5 Ciarán track as a gold K7 `pulse` arrow west → east to Brest (outlined "Brest"); callout "storms travel west → east" |
| S8 AT "Why the winds bend" | → {40, −20, 3.4} by scene end (= s54 start) | pull back; fades release as the globe returns inside the box; callout "Coriolis →" |

- **CHECK W93:**
  - the chevron directions come from the data: the area-mean wind over 10–20°N, 60–10°W blows from 30–75° (north-east);
    over 10–20°S, 30°W–10°E from 105–150° (south-east); over 40–55°N, 60°W–0° and 45–55°S from 240–300° (west);
  - the brightened bands' streak speeds are the data's;
  - the Ciarán track is the W-tracked low (continuity, HOUSE_STYLE §7).

**s47_cold_front.** Unchanged (U2-22: keep as it is).

**s48b_front_stack, s38b_reanalysis_stack, s27c_vapour_stack.** See §6.

**s36_weather_climate (U2-25, U2-26).**
- Keep the full-width TimeGraph, but its box shrinks to y 110–680 so there is room below it:
  - the K2 `SourceBelow` credit goes under the box (≈ y 700–730);
  - the saying goes below that.
- S6: the band and the line each dim to 50 % and come back, then the band lights first.
- S7: on AT(7, "The shaded band is the climate"), the band brightens and the K3 callout "climate: usual range for this day
  (1991–2020)" (54 px warm white, beside the graph's top right, outside the plot area) gets a gold `CurvedLink` to the band
  in late June, where it is widest.
- S8: on "the average for that day", the warm-white mean line pulses, with the callout "average".
- S9: on AT(9, "The orange line is the weather"), the 2023 line brightens, with the callout "weather: what actually
  happened, 2023" and a gold link to a peak of the line.
- S10: one warm-spell excursion above the band and one cold-snap excursion below it get gold rings. They are picked by W91
  (the largest exceedance above q90 and below q10).
- S11: "287 of 365 days inside the band" (54 px) goes beside the graph, linked to the band; then [beat].
- S12 (U2-26): the saying "climate is what you expect · weather is what you get" goes **below the figure and its source
  line**:
  - centred at x 960, baseline y 812, 60 px, **bold 800, gold #d8b23a**;
  - nothing else within 24 px;
  - it never touches the graph or its tick labels; the K6 gate checks it.
  - It appears on AT(12, "climate is what you expect"), and its second half brightens on "weather is what you get".
- The keyword that sat on the month ticks (fix-loop M2) is replaced by this.
- The y axis gets "°C" (fix-loop S10).

**s60_recap (U2-24).**
- S2 "Air pressure is the weight of the air above each square metre…": the mini picture is the **same live 3-D column as s05**,
  not a re-render thumbnail:
  - house K4 `ColumnFaces`, a 1 m × 1 m base plate with "1 m" edge ticks;
  - faces fading with density and **all four vertical edges from the ground to `COLTOP`**, leaving the top of the frame;
  - "1013 hPa" on the base.
- It sits in the picture zone at 75 % of the s05 size, with the s05 end camera and a slow orbit of +12° across S2.
- A brown weight arrow grows down the column on "weight of the air", and a gold highlight sweeps up the column from the
  ground to the top on "above each square metre".
- S3 mini picture: the curve with "H ≈ 8.4 km → 37 % left". Its column (if shown) is the same K4 column.
- The mini globes are unzoomed, so they need no fades. The recap source line goes below the lowest mini picture.

## 4. G1–G4: globes, images and text (every scene), built on the shared §5b house kit

UF2 also builds the shared kit from `movies/ch00/retrofit_5b_plan.md` §2 in `movies/src/house/kit/`, and every scene below
uses it. No scene keeps the kit_wb forks.

| Kit | Component | Used in UF2 for |
|---|---|---|
| K1 | `GlobeFrame` (`house/kit/frame.tsx`) | every globe, terrain, satellite plate and stack scene: the frame box, soft fades on all four edges while zoomed or cut, the "behind" mode for text (G2) |
| K2 | `SourceBelow` | every data scene: the source line ≥ 16 px under the **picture's own box**, never at a fixed y |
| K3 | `Callout` | every title, date, keyword, readout or colour-bar caption that refers to a feature of a picture: placed in the free zone with a gold `CurvedLink` to the feature |
| K4 | `col3d` slab/column edges (promoted from kit_wb) | s05, s13–s15, s18, s18b, s20c, s20f, s20g, s22, s60 |
| K5 | `LayerStack3D` (`house/kit/stack3d.tsx`) + `movies/data/_stack.py` | s27c, s38b, s48b |
| K6 | QA gate `overlap` in `tools/movie_qa.py` | the whole movie, every 0.5 s |

### 4.1 Frame and placement rules (Q1 decided (b), coordinator 2026-10-29)
- **Nothing is removed; it moves beside or below the picture** (user clarification, 2026-10-29). Nothing that is not a spot label goes on a picture. "Picture" means a map, satellite image, globe, terrain, stack
  layer or reanalysis field. Titles, dates, keywords, calculations, readouts, colour bars, colour-bar titles, insets and
  source lines stay off it.
- **Allowed on a picture:** short outlined labels (3-px dark outline) that point at a spot on the map itself: place names
  (Brest, Trappes, Brittany, English Channel), H and L, fronts and front symbols, and station plots.
- **Readouts move beside the picture, they are not dropped.** Anything with a number or a sentence ("L 956 hPa", "q ≈ 20 g/kg", "≈ 130 km", "cloud base ≈ 1.5 km",
  "Storm Ciarán · 2 Nov 2023", "air parcel") becomes a `Callout` in the free zone with a gold link to its feature. "L"
  alone may stay on the map.
- **GlobeFrame = the cross-product v5 look (new house rule, user 2026-10-29).** The reference for **every** 3-D globe is
  cross-product v5 56:35–57:54: `S33` trades, then `S34` westerlies (`CrossProductWhy.tsx` ≈ lines 4595–4685); the frame is
  `outputs/viewing_2026-10-29/weather_basics/2.png`. K1 must reproduce it:
  - **A large globe.** A full-frame canvas (as `GlobeView`, GW 1920 × GH 1080).
    - Zoomed or hovering, the sharp globe fills about x 40–1360, y 40–820.
    - The whole globe (unzoomed) has a silhouette radius ≈ 390 px with its centre near (600, 440).
  - **Soft edge fades** (the `Vignette` recipe):
    - top 0–60 and left 0–60 gradients;
    - a bottom gradient that ends by y 830;
    - a right gradient 1160 → about 1360 into a background panel at 82 %, ramped in over 1 s when a zoom or hover starts
      (`right` = fin(…, 30)) and out when it ends.
    - An unzoomed whole globe needs no fades.
  - **Animated wind streaks** wherever the scene shows wind (K7 `FlowParticles` globe mode = `Streaks` + `bright(lat)`).
  - **Camera moves and hovers** with `globecam.ts` (`globePath` keys with `hop`). A hover is a held key with a 2°/s slow
    drift, so the picture never freezes.
  - **Text placement:**
    - Keywords and numbers **may sit on the faded rim**: the right panel, or the outer 60 px of the top and left fades, where
      the globe shows at ≤ 40 % brightness. This is as in 2.png ("trade winds", "≈ 5–7 m/s").
    - They **never** sit on the sharp, unfaded globe. Outlined spot labels (place names, H/L, fronts) are the only text
      allowed there.
    - K6 uses the K1 **sharp mask** (where the fade alpha is > 0.4) as the no-text region.
  - **A coloured globe always has its titled colour bar** (title + units, 52-px ticks), on the faded right panel or below the
    globe. It stays on screen through zooms.
  - **The source line always sits below the globe**: K2 `SourceBelow` on the bottom of the sharp mask (≥ 16 px gap), at
    about y 836–866, and never on the sharp globe.
- **Source lines (K2).** `SourceBelow` gets the picture's bounding box and puts the line at least 16 px under it. The fixed
  `SrcLine` at y 852 in `WeatherBasics.tsx` (≈ line 393) is **deleted**, and every call is replaced.
  - Every picture box must therefore end at y ≤ 820. K2 throws above 856, so any layout that would print a credit on a
    picture fails at render time.
  - Flat maps (MapBox, cartopy PNGs) are scaled to end at y ≤ 820.
  - Tilted 3-D plates (s03, s21, s26, s31) and stacks pass the bounding box of their **projected** quad, or of the GlobeFrame
    box when that is smaller. The plates are sized so the box ends at y ≤ 820 on every camera key.
  - Two pictures side by side (s25 chart + globe, s36 locator + chart) each get their own `SourceBelow` in their own column.
- **Colour bars** sit in the maths zone (x 1100–1800, typically y 700–790), on a globe's faded rim, or under the picture box. They are never on the sharp picture.
  During a zoom they stay on screen, beside the frame. They are not hidden; where the frame widens (G2), the colour bar moves
  below it.

### 4.2 Per-scene list (what changes)
| Scene | Picture | Zoom / flight? | Change (K1 frame · K2 source · K3 callouts) |
|---|---|---|---|
| s00 | title right column: Part A globe + balloon, Part B Ciarán map | Part A zooms to Ciarán | K1 box = the title's animation box (x 1080–1840, y 180–636) with fades while zoomed; K2 under that box; the Brest pressure readout as a K3 callout beside the box, not on the map |
| s01 | globe | yes (dist 3.8 → 2.5) | K1 v5 look: large globe, fades and the right panel while dist < 3.2; the four keywords stay at x 1250–1800 on the faded right panel (allowed: faded rim), never on the sharp globe; "Storm Ciarán · 2 Nov 2023" is a K3 callout at x 1100–1800 linked to the gold ring; K2 |
| s02 | globe + wedge | the ×40 circle and its zoom are removed; whole globe | no fade; "how pictures draw it" / "true thickness" keywords in the maths zone with gold pointers (K3) to the limb; K2 (U2-03) |
| s03 | globe → flight → Brittany terrain | yes | K1 fades during the flight and on the terrain (tile edge never seen); "air parcel" becomes a K3 callout; Brittany, Brest and English Channel stay as outlined place labels; K2 |
| s21 | globe zoom → tilted map plate | yes | K1; plate box ends at y ≤ 820; K2 (U2-16); the readouts beside the balloon (p · T · humidity · wind) become K3 callouts in the maths zone |
| s22 | 3-D column → ×50 globe limb (S10) | yes | K1 on S10; the "30.5 km" readout as a K3 callout; K2 |
| s25 | chart + half-screen globe | to Singapore and the pole | K1 for the globe in its own column; one K2 under each picture; "Paris ≈ 11 km", "Singapore ≈ 16–17 km" stay on the chart (a chart, not an image) |
| s26 | tilted MODIS plate | orbit | K1 plate fades; "24 June 2024, morning", "thermals" and "−10 °C per km" become K3 callouts; K2 |
| s27 | Blue Marble → q globe | spin, pole | whole-globe K1; the colour bar in the maths zone (it is already at x 1120, y 720); K2 |
| s27b | q globe zoomed on the tropics | yes (U2-19) | K1 v5 look (large globe, fades, right panel); the titled colour bar on the faded right panel at y 760; the ring label "q ≈ 20 g/kg" becomes a K3 callout; slot layout (§3); K2 |
| s27c | humidity stack (new) | inside the stack | K1 + K5; all readouts are K3 callouts; colour bar in the maths zone; K2 |
| s31 | Sentinel-2 plate (new) | orbit | K1; "cloud base ≈ 1.5 km" and "same height → flat bases" are K3 callouts; "Trappes" stays as a place label; K2 |
| s32, s35, s44, s55–s58 | flat MapBox maps | MapCamera zooms | the map box ends at y ≤ 820; K1 fades when zoomed; wind readouts ("13 m/s from 155°") and "−35 hPa in 13 h" are already on the graphs or move to K3; K2 (fix-loop S4) |
| s34 | globe + meridian arc | small zoom | K1; "1° = 60 nautical miles" and "1852 m" become K3 callouts; K2 |
| s36 | relief locator + chart | — | K2 under each; the keyword moves above the graph (fix-loop M2) |
| s37, s38 | station globe, ERA5 T globe | rotation | whole-globe K1; colour bar in the maths zone; K2 |
| s38b | temperature shells (new) | flight | K1 + K5; callouts; K2 |
| s39 | surface-pressure globe → Tibet close-up | yes | K1 on the zoom and the close-up frames; "< 600 hPa" becomes a K3 callout; "Himalayas", "Andes" and "Rockies" stay as place labels; K2 |
| s41, s42 | MSLP globe; GFS map | Ciarán close-up | K1 when zoomed; "L 956 hPa", "H ≈ 1030 hPa" and the typhoon/North-Atlantic readouts become K3 callouts, with bare "L"/"H" on the map; the GFS map box ends at y ≤ 820; K2 |
| s43, s46, s49, s50, s59 | cartopy maps and satellite | — | box ends at y ≤ 820; colour bars move off the maps into the maths zone (fix-loop M3 moot); keywords such as "front ≈ 100 km", "warm tongue", "tropical maritime" become K3 callouts; front symbols stay; K2 |
| s45 | globe → 850-hPa map | yes | K1; "polar maritime" / "tropical maritime" become K3 callouts; the four names in the maths zone (fix-loop S3); K2 |
| s47, s48, s48b | slice walls, front stack | dolly | K1 frame fades; "cold wedge", the slope triangle numbers and "Brest" use K3 (the slope triangle is a diagram on the wall: its numbers move off the wall, linked); s47 otherwise unchanged (U2-22); K2 |
| s51–s53 | globe with the sun beam and mean fields | s53 track | whole-globe K1; "1 m" / "2 m" patch labels, "subtropical highs", "ITCZ", "trades" and "westerlies" become K3 callouts with routed links (fix-loop M2); K2 |
| s54 | globe flight → map | yes | K1; "Storm Ciarán · 1 Nov 2023" and "UTC = universal time" become K3 callouts; "Brest" stays; K2 |
| s59 | MODIS + isobars | — | "reading weather maps →" and "why the wind circles →" in the maths zone; K2 |
| s60 | mini pictures | — | one K2 below the lowest picture |

### 4.3 G3/G4 gate: K6 `overlap` in `tools/movie_qa.py`
The new movie_qa gate (retrofit plan K6) replaces the ad-hoc label probe for this movie. It runs every 0.5 s over the whole
movie, plus every sentence end.
- It compares the text bounding boxes (from the existing `kit_wb/bbox.tsx` probe, moved to house/kit) with each other, and
  with the picture masks that K1, K2 and K5 publish: the globe silhouette, image and map boxes, projected plate, slice and
  stack quads.
- **FAIL** on:
  - text against text;
  - must-class text (everything except outlined feature labels) inside a picture mask;
  - text against filled shapes, arrows, arcs and links;
  - any text with right > 1840 or bottom > 872;
  - a K2 source line closer than 16 px to its picture.
- It also covers the U2-08 s15 check (right ≤ 1840) and the G5 geometry assert (column edges reach `COLTOP`, from the K4
  geometry dump).
- The builder fixes every hit before the full render. qa.json records the count, and the target is 0.

### 4.4 Every wind arrow moves (new HOUSE_STYLE §5b rule, coordinator 2026-10-29)
**The rule.** Every wind arrow on a map or globe is animated, so the viewer sees the air moving. The direction and length
still come from the data, exactly as now; only the inside of the arrow moves. UF2 adds the shared house-kit component **K7**
`movies/src/house/kit/wind.tsx`, which every movie uses from now on.

**K7 `AnimatedWindArrow`** (SVG, for maps, globes through the projector, and graph rows).
- **Props:**
  - `from` and `to` (screen points from the data vector, as now);
  - `speed` (m/s);
  - `mode: "dash" | "pulse"`;
  - `scale` (screen seconds per real second, recorded);
  - `colour`, `px`, `head`;
  - `o`.
- **`dash` (default):**
  - The shaft is drawn as dashes 0.18 L long with 0.12 L gaps (L = arrow length, minimum 8 px dashes).
  - The dashes march from tail to head at a screen speed of `v_screen = k · speed`. One house constant, k = 6 px s⁻¹ per
    m s⁻¹, means a 10 m/s arrow's dashes move 60 px per second. It is the same for every arrow in a scene, so faster wind
    is visibly faster.
  - The head stays solid.
  - The phase is `(frame / fps) · v_screen mod period`, a pure function of the frame, so there is no state and renders are
    deterministic.
- **`pulse`** (short arrows under 60 px, and graph-row arrows): a bright bead (1.6 × shaft width, warm white at 70 %)
  travels tail → head every `max(0.6, 12 / speed)` s, and the head brightens briefly as the bead arrives.

**K7 `FlowParticles`** (three.js, or SVG for small counts). These are particles drifting along the flow at a stated scale.
- **Inputs:** precomputed tracks from `fluidpy.diag.trajectories.advect_on_sphere` (or `in_section_tracks` for slices),
  written as a `.bin` by the builder, as s49 does now.
- **Drawing:**
  - seeded, recycled particles;
  - a fading tail of 6–14 steps;
  - the frame → time mapping fixed per scene and recorded in the manifest as time compression, e.g. "1 s of screen = 30 min".
- **CHECK:** the mean particle speed equals the mean field speed along the tracks within ±5 % (the W74 pattern), so the
  drift scale is honest.

**Where it applies in weather basics.** Every scene is listed. "Arrows" means the data arrows already in the v4 build.

| Scene | Wind arrows / flow on the picture | Animation (K7) | Scale (manifest) |
|---|---|---|---|
| s01 | the "wind" keyword icon (an icon, not data) | `pulse` on AT(2, "wind"), once | — |
| s03 | 20 ERA5 10-m arrows on the 0.5° grid under the parcel | `dash` (as in §3; this replaces the earlier s03-only spec), on the hour-interpolated u10/v10 | dashes k = 6 px s⁻¹ per m s⁻¹; parcel 6 h in ≈ 9 s |
| s32 | the Brittany map's real 10-m arrows (12 UTC 1 Nov), then the (8, 6) vector | the map arrows use `dash`; the teal (8, 6) teaching vector uses `pulse` while u and v are named, then `dash` | k as above |
| s33 | the compass "westerly" arrow and "our wind" arrow (diagram) | `dash` from where the wind comes to where it goes, which shows "from the west → towards the east" | — |
| s35 | the high → low push arrow (diagram), then the real ERA5 10-m streaklines circling Ciarán on the MODIS image | push arrow `pulse`; streaklines become `FlowParticles` (≈ 1500) on the image, with arrows in `dash` | ≈ 1.5 h in 3 s (already listed) |
| s43 | side-view inset arrows (low: in and up; high: down and out) | `dash` along each arrow, so the in-up and down-out motion is visible | schematic |
| s44 | ERA5 10-m arrows on a 1.5° grid + streaklines round the low and the high | arrows `dash`; streaklines `FlowParticles` from the same tracks; the gold anticlockwise and clockwise arcs `pulse` once on "anticlockwise" and "clockwise" | 1.5 h in ≈ 3 s |
| s46 | two small wind arrows either side of the front step | `pulse` (short arrows); the turn is visible | — |
| s47 | in-slice particles (already moving); two ground arrows "before: from SW", "after: from W/NW" | particles unchanged (U2-22: keep); the two ground arrows `dash` | 1 s = 30 min (W73) |
| s48 | same particles; ground arrows "before: from SE", "after: from S/SW" | ground arrows `dash` | as s47 |
| s48b | (new stack) no wind arrows | — | — |
| s49 | ≈ 3000 particles over the 850-hPa chart (already moving) + 850-hPa arrows on a 1° grid | particles unchanged; arrows `dash` | as built (W74) |
| s50 | particles at 40 % continue; the front symbols | particles unchanged | — |
| s53 | U2-27: the cross-product s33 style (§3): streaklines + belt chevrons; the 5° arrow grid is replaced by streaklines; the 5-m/s scale arrow is kept as a callout; Ciarán track arrow | streaklines `FlowParticles` (globe mode, `bright` per belt); chevrons `BeltChevrons` (static direction marks; the streaks move); scale arrow `dash`; track arrow `pulse` west → east | streaklines as built (time compressed, listed) |
| s55 | the hourly 10-m wind arrows on the Ciarán loop | `dash`, re-oriented each hour as now (interpolated in time) | k as above; loop clock as built |
| s56 | small map thumbnail with the L passing | no wind arrows (none drawn); unchanged | — |
| s57 | the row of hourly Brest wind arrows in the TimeGraph; the Brest arrow on the map (18 → 20 UTC) | graph-row arrows `pulse`; the map arrow `dash`, turning from 155° to 204° as the hours run | k as above |
| s58 | Brest arrows at 00 UTC (19 m/s, 221°) and 03 UTC (23 m/s, 271°) | `pulse` in the graph row; the 03 UTC arrow's bead runs fastest (23 m/s) | — |
| s60 | recap compass "233° south-westerly" | `pulse` once | — |
| s51 | orange poleward arrows (heat transport, **not wind**) | `pulse` (same component; it is the flow of heat), recorded as not wind | — |

**CHECKs.**
- **W91 (s36):**
  - `inside_2023` = 287 of 365 ("two hundred and eighty-seven… three hundred and sixty-five");
  - `share_2023` = 0.786, rounding to "eight in ten", with `share_base` = 0.804 ("the usual eight in ten");
  - the base period is 1991–2020 ("nineteen ninety-one to twenty twenty");
  - at least one 2023 day above q90 and at least one below q10 ("warm spell", "cold snap"); if either is missing, S10
    follows the data;
  - the ringed days are the largest exceedances.
- **W92 (s60):** the recap column's four edges reach `COLTOP` (the K4 geometry dump), with a 1 m × 1 m base.
- **W90:**
  - every K7 arrow's direction and length equal the data vector it was drawn from (angle error < 1°, length error < 1 px);
  - the dash speed is `k · speed` with the house k;
  - `FlowParticles` mean speed / field speed lies in 0.95–1.05 for s35, s44 and s53 (s49 already W74).
- **The K6 gate** treats animated arrows as shapes (text must not sit on them).

## 5. G5 slab and column edges
Done in §3: the `ColumnFaces` rods go to `COLTOP`, and the rule applies to every column or slab scene listed there. QA asserts
it via the K4 geometry dump checked by the K6 gate.

## 6. G6 layer stacks: choices, reasons, specs

### 6.1 Where a variable changes with height in this movie, and the decision
| Candidate | Where | Decision | Why |
|---|---|---|---|
| **Humidity with height** | after s27b (q, vapour pressure) | **Stack B, s27c** | New knowledge the movie never states: vapour is concentrated in the lowest kilometres (about half below 1.5 km). It also explains why clouds and rain stay in the troposphere. It bridges to s28 (cold → less vapour before drops). |
| **Temperature with height, equator to pole** | s23–s25 (Trappes and Singapore balloons), s38 (reanalysis) | **Stack A, s38b, curved shells over a 0–80°N sector of the globe** | The balloons give two columns. The shells show the layering everywhere, and that the tropopause, where the cooling stops, lies near 10 km over Europe but near 16 km (and colder than −75 °C) over the tropics. This links s24 and s25 in one picture and makes "every place and height" (s38 S4) literal. Drawn as curved shells at the movie's ×50 air scale, so it looks different from the flat stacks B and C and needs no new exaggeration. **Not** a Europe/Ciarán box and not the 10-level file (#69), and not #4's Trappes lapse-rate stack (2026, ∂T/∂z, one site). |
| **Fronts level by level** | after the slices s47/s48 (user: optional, "after it") | **Stack C, s48b** | It turns the side view into 3-D. The front line moves back towards the cold air at each height, which is the slope seen in plan view, measured as about 130 km over 2.5 km (W70 1:50). It ends top-down on the 850-hPa layer, which **is** the s49 map, so the hand-off is seamless. |
| Pressure with height | s18–s22 | no stack | The pressure picture is the 1-D curve plus the column. On height levels, a stack would show every layer uniformly paler with tiny horizontal differences, so it adds nothing. It would also lengthen the section the user found hard. |
| Wind speeding up to the jet | s35/s53 mention winds | no stack (left to `ch00_reading_weather_maps`) | Weather basics never teaches the jet stream. RWM owns the 250-hPa jet (2 Nov 12 UTC 6-level data, s47–s54), so a WB wind stack would duplicate RWM's data and place (G6: no monotony). |

**Across movies (G6, no monotony).** WB claims three stacks:
- the temperature shells (0–80°N, 25°W–35°E sector, 2 Nov 12 UTC, 16 levels to 1 hPa; new fetch D-UF2-1);
- the tropical-Atlantic humidity stack (2 Nov 12 UTC; new fetch D-UF2-1);
- the Biscay cold-front stack (1 Nov 18 UTC, T anomaly + front lines; new fetch D-UF2-2).

None uses `ERA5-ARCO-ciaran2023-10lev`, which #69 owns for its thickness stack. #6's front stack (retrofit §4.3) uses a case
outside NW Europe 2023, so it does not repeat s48b. #26 (atmospheric river) and the climate-change stack use other places
and dates.

Recommend recording these claims in `knowledge/movie_patterns.md`. RWM, if it adds a stack, should use height/wind for the
jet. The vector, dot-product and cross-product decisions are outside this plan.

### 6.2 Shared component: house kit K5 `LayerStack3D` (`movies/src/house/kit/stack3d.tsx`) + `movies/data/_stack.py`
UF2 builds K5 once, for every later movie (retrofit plan §2). It is based on the captests pattern
(`movies/src/captests/comps3d.tsx → X3Stack`: `TexPlane`, `Stage`, `orbit`).

**`_stack.py` (builder side).** It turns a level list into:
- Float32 fields;
- area-mean geopotential heights z̄;
- the colour range;
- the vertical exaggeration;
- the manifest rows.

**Props:**
- `layers: {field, lut, lo, hi, z, opacity, alphaRamp?}[]`;
- footprint in km;
- `curved?: {R, lat0, lat1, lon0, lon1}` for globe shells;
- `lines: {level, pts[]}[]` (3-D polylines);
- optional `walls` (the slice textures);
- `sep` (0 = all layers flat on the bottom, 1 = at real heights);
- `reveal[i]` (per-layer fade-in frame).

**Camera presets** (frame-keyed): `orbit`, `flyThrough` (between two layers), `inside`, `below` (look up), `topDown`.
Each stack below names the preset per sentence.

**Rendering:**
- The colour map is applied in the shader with the same LUT as the matching globe, and there is one shared colour bar
  (52-px ticks, titled with units) in the **maths zone, never on the stack**, and it stays on screen through the fly-through.
- `DoubleSide`, `depthWrite: false`, renderOrder by camera distance.
- Coastlines (NE 50 m) on every layer, warm white at 35 %, 1.5 px.
- A height rod with km ticks beside the stack (ticks are axis labels of a diagram element, off the layers).
- Fully frame-driven.
- The stack sits in a K1 `GlobeFrame` (soft fades whenever the camera is close or inside) and publishes its projected
  layer quads as picture masks for K6.
- All readouts are K3 callouts; the credit is K2 under the frame.

### 6.3 Stack B: s27c_vapour_stack (humidity)
- **Data:** ERA5 2023-11-02 12 UTC (same hour as the s27/s27b globe), `specific_humidity` and `geopotential` on 10 levels:
  1000, 950, 900, 850, 800, 700, 600, 500, 400, 300 hPa (≈ 0.1–9.6 km).
- **Region:** centred on the s27b ring (the 2 Nov 12 UTC tropical-Atlantic q maximum) ±12° latitude and ±18° longitude,
  clipped to 0–40°N. The builder writes the box into `stack_q.json`.
- **Heights:** true area-mean geopotential heights, drawn ×150 (footprint ≈ 2700 × 3900 km; listed in `exaggeration`).
- **Colours:** the **same LUT and range as the s27 globe** (`LUT_HALINE`, 0–20 g/kg). Per-layer alpha is 0.30 + 0.70·q/20,
  so dry layers look sparse and the top layers almost vanish. Colour bar "specific humidity (g/kg)" at 0, 5, 10, 15, 20,
  in the maths zone.
- **Camera:**
  1. S1: start at the s27b camera (globe dist 2.6 on the ring). On a matched view the globe patch cross-fades into the
     bottom layer, seen top-down.
  2. S2: the layers rise one by one from the bottom (`sep` 0 → 1 over 3 s, reveal on "ten heights"). The camera tilts to
     el 22°, az −30°, **orbiting round**.
  3. S3: the camera flies **up through** the stack along a vertical line at the box centre, crossing layers 1 → 10 between
     "near the sea" and "nine kilometres"; the 700 and 300 hPa layers flash a gold outline on their words.
  4. S4: it comes out above and swings **below** the stack (el −15°) to look up through the lowest four layers. A gold
     bracket on the height rod from the sea to 1.5 km reads "half the vapour", then [beat].
  5. S5: it dives down to the sea surface under the bottom layer. On a matched frame it cross-fades to s28's water surface.
- **Words on screen:** all as K3 callouts in the maths zone, each with a gold link to its layer or bracket: "≈ 20 g/kg"
  (to the bottom layer's maximum), "3 km: a few g/kg", "9 km: almost none", "half the vapour below 1.5 km". Every number
  is spoken.
- **Presets:** S1 `topDown` → S2 `orbit` → S3 `flyThrough` (upwards through all ten) → S4 `below` → S5 `inside` (down to the
  sea surface).
- **Source line:** "Data: ERA5 specific humidity on pressure levels (Copernicus C3S) · 2 Nov 2023, 12 UTC · tropical Atlantic".

### 6.4 Stack A: s38b_reanalysis_stack (temperature shells, equator to pole)
- **Data:** ERA5 2023-11-02 12 UTC (the s38 globe's hour), `temperature` and `geopotential` on 16 levels: 1000, 850, 700,
  500, 300, 250, 200, 150, 100, 70, 50, 30, 20, 10, 5, 1 hPa (≈ 0.1–46 km). New fetch D-UF2-1, **not** the 10-level
  Ciarán file.
- **Region:** a meridional sector 0–80°N, 25°W–35°E (Gulf of Guinea and Africa → Europe → the Arctic).
- **Geometry:** each layer is a spherical patch (`curved`) at radius 1 + 50·z̄/6371. The patch is split into latitude
  strips, each at its own strip-mean z̄(φ), so the tropical tropopause visibly bulges upward. This is the movie's **×50 air**,
  said in s02, so it needs no new exaggeration. The 1-hPa shell sits about 0.36 Earth radii above the ground.
- **Colours:** one perceptual sequential LUT for all layers, cmocean `thermal`, −85…+30 °C. Colour bar "temperature (°C)"
  at −80, −60, −40, −20, 0, 20, in the maths zone.
- **Camera (presets):**
  1. S1 `topDown`: from the s38 globe camera; the 2-m field fades as the 1000-hPa shell lifts off it.
  2. S2 `orbit`: the 16 shells peel up one by one (60 ms stagger); the camera orbits from the west, looking along the
     sector from the equator (az −40° → +10°, el 25°).
  3. S3 `flyThrough`: it rises through the shells over the Sahara.
  4. S4: it turns to Europe. The 250-hPa shell's European part gets a gold rim, with the K3 callout "Europe: ≈ 10 km,
     ≈ −50 °C".
  5. S5: it moves south. The 100-hPa shell's tropical part gets a gold rim, with the callout "tropics: ≈ 16 km, below
     −75 °C", and a gold link to the s25 Singapore thumbnail in the maths zone.
  6. S6: the 10–1-hPa shells brighten, with the callout "warmer again: stratosphere" and "≈ 45 km" linked to the top shell.
  7. S7 `inside` → `below`: the camera flies down inside the stack along a gold vertical rod at 48.8°N 2.0°E ("one column",
     Trappes) passing every shell. It ends below the patch looking up (el −20°), then pulls back to the s39 globe camera.
- **Frame:** K1 `GlobeFrame`. The credit is K2: "Data: ERA5 temperature on pressure levels (Copernicus C3S) · 2 Nov 2023,
  12 UTC · 0–80°N, 25°W–35°E".
- **CHECK W84** (§7.3).

### 6.5 Stack C: s48b_front_stack (the cold front level by level)
- **Data:** ERA5 2023-11-01 18 UTC (the slices' hour), `temperature`, `geopotential`, `u` and `v` on 11 levels: 1000, 950,
  900, 850, 800, 750, 700, 650, 600, 550, 500 hPa.
- **Region:** 40–56°N, 25°W–8°E. Both slice lines (46.5°N 18°W–0°, 48.5°N 18°W–4°E) are inside.
- **Field:** temperature anomaly, T minus the level's area-weighted box mean (`fluidpy.diag.climatology.global_mean` over the
  box). This is the same meaning and the **same diverging LUT and range as the s47/s48 slices** ("warmer or colder than the
  average at the same height"). The slice colour bar is re-used and titled.
- **Front lines:**
  - Use `fluidpy.diag.fronts.front_lines` (the s49 parameters: Hewson TFP, 100-km smoothing) on each level.
  - Trace the cold front **level by level** from the s49 850-hPa cold front attached to the tracked low, with the new
    `front_by_level` (§7.2): nearest line within 80 km per level step. This keeps the storm-tracker rule (HOUSE_STYLE §7).
  - Draw it as a gold 3-D polyline, 4 px, on each layer where it is found.
- **Heights:** true level heights drawn **×80, the same as the slices** (W72). The s48 narration already said "eighty times
  taller", so the stack and the walls line up.
- **Walls:** the two slice textures (s47, s48) stay standing in the stack at 45 % opacity.
- **Camera:**
  1. S1: start at the s48 end camera (side view along the 48.5°N wall). Pull back and up; the layers fade in round the walls.
  2. S2: **orbit** from the south-west, el 30°, az 200° → 240°.
  3. S3: the gold lines appear bottom-up on "gold line", 8 frames apart.
  4. S4: the camera goes **inside** the stack. It flies west between the layers along the 46.5°N wall near the cold front,
     then rises to look straight down. The lines appear as a fan stepping west. A gold bracket along 46.5°N between the 850-
     and 600-hPa lines carries the K3 callout "≈ 130 km" (the W86 number rounded to 10 km) in the free zone, then [beat].
     Presets: S1 `orbit` from the s48 camera, S2 `orbit`, S4 `inside` → `topDown`, S6 `below` → `topDown`.
  5. S5: a translucent gold surface lofted through the lines (ruled surface between consecutive lines, 25 %) = "one sloping surface".
  6. S6: the camera dips **below** the stack, looking up through the cold wedge. Then it rises to top-down over the 850-hPa
     layer while the other layers fade. This matched frame cross-fades into s49's 850-hPa map (same box and framing).
- **Source line:** "Data: ERA5 on pressure levels (Copernicus C3S) · 1 Nov 2023, 18 UTC · fronts computed from it".

## 7. Data, library and checks

### 7.1 Data (every fetch through `fluidpy.data.fetch` / `fluidpy.data.era5_arco.fetch_box` → `tools/disk_guard.py`; report C:/G: before and after)
| Id | Dataset (registry key, new) | Subset | Size | Licence / credit | Scenes |
|---|---|---|---|---|---|
| D-UF2-1 | ARCO-ERA5 pressure levels (`ERA5-ARCO-wb-stacks-20231102T12`), a new fetch, not `ERA5-ARCO-ciaran2023-10lev` | 2023-11-02T12; `temperature`, `specific_humidity`, `geopotential`; levels 1000, 950, 900, 850, 800, 700, 600, 500, 400, 300, 250, 200, 150, 100, 70, 50, 30, 20, 10, 5, 1 hPa (21); box 0–80°N, 65°W–35°E, 0.25° (the humidity box and the temperature sector are cut from it) | ≈ 40 MB raw on G:; products ≈ 2 MB | CC-BY 4.0 Copernicus (attribution as ERA5-ARCO-ciaran2023-10lev) | s27c, s38b |
| D-UF2-2 | ARCO-ERA5 pressure levels (`ERA5-ARCO-wb-front-20231101T18`) | 2023-11-01T18; `temperature`, `geopotential`, `u`, `v` (+ `specific_humidity`); levels 1000, 950, 900, 850, 800, 750, 700, 650, 600, 550, 500 hPa (11); box 40–56°N, 25°W–8°E | ≈ 4 MB raw; product ≈ 0.6 MB | CC-BY 4.0 Copernicus | s48b |
| D-UF2-3 | Copernicus Sentinel-2 L2A `visual` COG via Earth Search STAC (`Sentinel2-L2A-beauce-20240822`), through the map-toolkit STAC adapter (`tools/maptools/adapters/stac_adapter.py`, `.venv-maps`; archived on G: by request hash) | items `S2B_31UCP_20240822_0_L2A` (cloud 0.49 %) and `S2B_31UDP_20240822_0_L2A` (0.0 %), 10:57:46 UTC; bbox 1.20–2.40°E, 48.05–48.85°N; warped to 2560 × 1707 px EPSG:4326 | ≈ 60 MB COG reads; jpg ≈ 3 MB | Copernicus Sentinel data, free and open (ESA); credit "contains modified Copernicus Sentinel data 2024" | s31 |

- **Fallbacks:**
  - D-UF2-2: the existing `data/derived/ch00/era5_ciaran_2023_section_48p5N_18UTC.nc` (46–51°N, 20°W–6°E, 20 levels, t/q/u/v/w/z).
    It is narrower but already on disk. The CHECK asserts that D-UF2-2 equals it in the overlap (|ΔT| < 1e-3 K).
  - D-UF2-3: the Landsat 9 C2 L2 scene `LC09_L2SP_199027_20240607_02_T1` (7 Jun 2024, 2.1 % cloud, 30 m).
- **Re-used:**
  - `data/soundings.json → trappes` (s22);
  - the 24 Jun 2024 MODIS Aqua 250-m product `data/derived/ch00/cumulus_france_2024-06-24_modis_aqua_250m.jpg` (s31 end crop);
  - NE 50 m coast (stack coastlines);
  - `fronts.json` (the s49 850-hPa cold front seed);
  - the slice textures (s48b walls).
- **Movie products** (`movies/data/build_ch00_weather_basics.py`, new functions `uf2_*`):
  - `data/stack_t.{json,bin}`: 16 levels on the 0–80°N 25°W–35°E sector at 0.5° (161 × 121), °C, plus z̄ per level and per latitude strip, and the LUT range (via `_stack.py`);
  - `data/stack_q.{json,bin}`: 10 levels, g/kg, plus z̄ and the vapour fractions;
  - `data/stack_front.{json,bin}`: 11 levels of anomaly in K, plus per-level cold-front polylines and z̄;
  - `data/s2_beauce.{jpg,json}`: the bounds, the item ids and the 14 thermal seed cells;
  - `data/s31_modis_crop.jpg`;
  - `data/uf2.json`: the s20e/s20f/s20g/s20b/s22 numbers.
- **Registry rows:** add the three keys with the citation, attribution and the derived files. Sentinel-2's citation is the
  ESA Copernicus Sentinel-2 L2A product with the Earth Search catalogue.
- **Manifest credits:** add ESA Copernicus Sentinel-2, and keep ERA5, IGRA and GIBS.

### 7.2 Library (fluidpy; implementer writes these with tests; the full fluidpy suite must stay green)
| Id | Function | Formula / method | Lives in | Tests |
|---|---|---|---|---|
| F-UF2-1 | `column_integral(q, p, p_bottom=None, p_top=None, g=G0)` → kg m⁻² | ∫ q dp / g between two pressures (trapezoid in p; the hydrostatic mass element dm = −dp/g per m², Vallis (1.51), page `chapters/pages/ch01/p032.png`); used for the vapour below 850 hPa / the whole column | `fluidpy/diag/sounding.py` | V1 constant q → q Δp/g exactly; V1 additivity (bottom→mid + mid→top = total); V2 sympy for q linear in p; V7 p_bottom = p_top → 0; works on (level, lat, lon) arrays |
| F-UF2-2 | `front_by_level(T, u, v, lat, lon, levels, seed_level, seed_line, max_step_km=80, **front_lines_kw)` → {level: polyline} | apply `front_lines` on each level; from the seed line at `seed_level`, keep on the next level the line nearest to the current one (mean distance ≤ max_step_km), going up and down; promotes the inline tracing in `build_ch00_weather_basics.py` (W70, ≈ line 1700) into the library | `fluidpy/diag/fronts.py` | V1 synthetic tilted front T = T₀ + a·tanh((x − s·z)/L): recovered shift per level = s·Δz within 2 %; V7 no gradient → empty dict; V1 a second, unrelated front is not picked; the W70 slice slope is reproduced from the D-UF2-2 box (1:40–1:60) |

**No new functions are needed for:**
- the half-pressure heights: `fluidpy.diag.sounding.level_crossing(z, ln p, ln p*, "down")`, which exists and is tested;
- the box means: `fluidpy.diag.climatology.global_mean` on the box with cos-lat weights;
- s20e/s20f/s20g/s20b: `fluidpy.geo.atmos.scale_height`, `fluidpy.core.statics.isothermal_pressure`,
  `fluidpy.geo.atmos.pressure_height`, and sympy for the tangent and block identities;
- s31: `lifting_condensation_level` and `dry_parcel_ascent` (both exist).

**Equation pages.** No new book equations go on screen. The new lines are our steps from (1.51) and (1.53), and the text
after (1.186): `chapters/pages/ch01/p032.png`, `p033.png` and `p062.png`, as the v4 provenance already lists (pages exist;
provenance only, never drawn).

### 7.3 New CHECK rows (builder asserts; W78–W89)
| Id | Asserts (spoken words) | Planning value |
|---|---|---|
| W78 | s20e: p₀/H with the spoken values = 101 325 / 8430.1 = 12.019 Pa/m ("about twelve pascals per metre"); with `scale_height(288.15)` 12.013; both equal ρ₀g = 12.017 within 0.1 % (s16, W11) ("the same rate"); sympy: the tangent p₀(1 − z/H) has slope −p₀/H and is 0 at z = H (re-uses W58) | 12.02 |
| W79 | s20/s20e/s20f: p(H)/p₀ = e⁻¹ = 0.3679 ("thirty-seven percent"); 1013.25·e⁻¹ = 372.8 hPa ("about three hundred and seventy-three"); p(2H)/p₀ = e⁻² = 0.1353 → round(100·0.1353) = 14 ("fourteen percent"), 137.1 hPa (W18, W60); share of the air above H = p(H)/p₀ (same number, s20f S2) | 0.368, 0.135 |
| W80 | s20f: `isothermal_pressure(5 km + H)/isothermal_pressure(5 km)` = e⁻¹ within 1e-12 ("from any height"); `scale_height(263.15)` = 7703 m ("seven point seven"), `scale_height(303.15)` = 8874 m ("eight point nine"); the share above z is larger for the larger H at every z > 0 | 7.70, 8.87 km |
| W81 | s20g: ρ₀g × 1 m = 1.225 × 9.81 = 12.017 N ("about twelve newtons"); p₀ × 1 m² = 101 325 N; h = p₀/(ρ₀g) = 8431.6 m ("about eight point four three") (W57); sympy: p₀/(ρ₀g) = RT/g when ρ₀ = p₀/(RT); the block's p(z) = p₀ − ρ₀gz equals the s20e tangent identically | 8431.6 m |
| W82 | s20b: for Δz = 1 m, [p(z) − p(z+Δz)]/p(z) × H = 1 within 1e-4 ("fraction = Δz/H"); 1 km/8.43 km = 0.1186 ("zero point one two, twelve percent"); e^{−1/8.43} = 0.8881 ("zero point eight eight eight"); 1 − 0.888 = 0.112 → "zero point one one, eleven percent"; the estimate > the exact value (0.1186 > 0.1119) ("a bit less") (W61 kept) | 0.888, 0.112 |
| W83 | s22: IGRA Trappes 2023-11-01 00 UTC, `level_crossing(z, ln p, ln(p₀/2), "down")` = 5.452 km ("about five and a half"); p₀/2 = 506.6 hPa ("about five hundred and seven"); 5.452 < 5.846 (W63) ("a bit lower than our estimate"); p₀/10 at 16.005 km ("sixteen"); p₀/100 at 30.507 km ("a little above thirty"); sounding top 33.94 km > 30.51 (measured, not extrapolated); USSA 5.482 km within 0.05 km of the balloon (recorded cross-check, W64) | 5.45, 16.0, 30.5 km |
| W84 | s38b (D-UF2-1, sector 0–80°N 25°W–35°E): over 38–58°N, the area-mean T decreases monotonically 1000 → 250 hPa ("each layer colder"); the WMO tropopause (`lapse_rate_tropopause` on each strip-mean profile) is in 9–12 km at 45–55°N ("about ten kilometres") with T in −57…−45 °C ("about minus fifty"), and in 15–17.5 km at 0–10°N ("about sixteen") with T < −75 °C ("below minus seventy-five"); the tropical tropopause is higher than the European one by ≥ 4 km; T̄(1 hPa) − T̄(20 hPa) > +15 K with the minimum between 15 and 27 km ("above about twenty-five, warmer"); z̄(1 hPa) in 43–48 km ("about forty-five"); 16 layers ("sixteen heights"); shell radius 1 + 50·z̄/a (×50, as s02); the fetch's provenance is not `ERA5-ARCO-ciaran2023-10lev` (registry assert) | planning: Trappes column 250 hPa −54 °C at 10.2 km; Singapore column 100 hPa −78.6 °C at 16.6 km; 1 hPa −24/−8 °C at 46–48 km |
| W85 | s27c (D-UF2-1, the s27b box): max q(1000) in 18–22 g/kg ("about twenty"); z̄(700) in 2.8–3.3 km with area-mean q(700) in 2–6 g/kg ("three kilometres", "a few grams"); z̄(300) in 8.5–9.7 km ("about nine") with q̄(300) < 0.5 g/kg ("almost none"); z̄(850) in 1.3–1.7 km ("one and a half"); area-weighted `column_integral` below 850 hPa / whole column in 0.40–0.60 ("about half"); 10 layers ("ten heights"); LUT = the s27 globe's (`LUT_HALINE`, 0–20) | planning only (to be fetched) |
| W86 | s48b (D-UF2-2): cold front traced by `front_by_level` on ≥ 8 of 11 levels, seeded on the s49 850-hPa cold front attached to the tracked low; along 46.5°N the line's longitude moves west with height at every step; displacement between z̄(850) and z̄(600) along 46.5°N in 100–160 km, spoken = rounded to 10 km ("about a hundred and thirty"); implied slope 1:40–1:60, consistent with W70 (1:49.9); z̄(850) ≈ 1.5, z̄(600) ≈ 4.0–4.3 km ("one and a half and four"); z̄(500) in 5.3–5.8 km ("about five and a half"); each level's anomaly has zero box mean; overlap with the section file \|ΔT\| < 1e-3 K | 1:50 × 2.6 km ≈ 130 km |
| W87 | s31: the Sentinel-2 items' cloud cover ≤ 1 % and the image covers the bbox (no-data < 0.5 %); the 14 seed cells lie inside the plate; parcel tops stop at `lifting_condensation_level(25 °C, 13.1 °C, 1013.25 hPa)` = the s31 cloud base (≈ 1.5 km, existing W row); parcel colours and radii from `dry_parcel_ascent` (W69); the MODIS crop has the same bounds | — |
| W88 | G1–G3: for every globe camera key, K1 fades are on whenever the silhouette leaves the frame box, and off for the whole-globe keys; every picture box ends at y ≤ 820; every K2 line is ≥ 16 px below its picture and above y 872; K6 `overlap` reports 0 hits | — |
| W89 | exaggerations recorded in the manifest: stack B heights ×150; stack A ×50 (= s02); stack C ×80 (= W72); s02 hair-line 2-px minimum; s31 heights ×20 (= s26) | — |

**Retired or changed:**
- W64 is no longer spoken (s22 uses the balloon). It is kept as the recorded cross-check inside W83.
- W56's "S12 warmer air…" row moves to s20f (W80).
- W58 (the tangent) moves from s18 to s20e.

## 8. Honesty notes, quiz, lexicon
- **honesty_notes (add):**
  - "s18b–s20g use a pretend column with one temperature (15 °C) everywhere, and the narration says so; the real air
    cools upward (s23)."
  - "s20g's uniform block is a thought experiment, said as such; it has a sharp top only because it is pretend."
  - "s22's half-pressure, tenth and hundredth heights are measured by one balloon (Trappes, 00 UTC 1 Nov 2023), and
    the narration names it."
  - "the stacks' heights are exaggerated (×50 shells, ×150 humidity, ×80 front, as in the slices)."
  - "the s31 ground is a cloud-free Sentinel-2 image from 22 Aug 2024 (its date is in the source line); the thermals' start
    points come from the image's brightest fields, but their exact positions are illustrative; the cloud base is computed."
  - "s03 molecules inside the parcel are illustrative."
- **quiz_hook (keep the current one; optional second):** "If a column has a scale height of 7 km, what share of the ground
  pressure is left 7 km up, and is there any air above that height? (37 %; yes, 37 % of the air.)"
- **Lexicon:** no new spoken hard words. Trappes, ERA5 and Ciarán are already in `movies/lexicon.yaml`. "Beauce",
  "Sentinel" and "Copernicus" appear only in source lines, which are not spoken. "tangent", "stratosphere" and
  "tropopause" are read correctly by Kokoro (they were in the UF1 audio or are plain English).

## 9. Measured length (tools/tts.py dry run) and cost
Run: `.venv-tts/Scripts/python.exe tools/tts.py <G:>/scratch/movies/ch00_weather_basics/dryrun_uf2/script_uf2.md --out <same>`.
The script was generated from the current script.md plus §2, by `make_uf2_script.py` (kept in the session scratchpad; its
output `script_uf2.md` is on G:).

**Run 1: the full UF2 script.** `dryrun_uf2/` on G:: 74 scenes, 491 sentences, **3455.325 s** of audio, 866 caption cues;
self-check diff 0.0 ms, `len_ok` and `cues_ok` true, no warnings; synthesis took 3012.5 s. This run used the earlier s36
(unchanged) and the earlier s38b (Europe) text.

**Run 2: supplement.** `dryrun_uf2/supp/` re-measures the two scenes whose text changed after run 1 started: s36 with
U2-25, and s38b moved to the equator-to-pole sector. 20 sentences, 156.57 s, self-check OK. The deltas are taken on the
scene durations, including the 0.8-s scene gap: s36 53.7 → 96.2 s and s38b 45.3 → 58.4 s, a total of **+55.6 s**.

**UF2 measured length: 3510.95 s of narration + 2.5-s end hold = 3513.45 s = 58:33.5.** With the U2-28 sentence
(+7.05 s, measured separately) it is **3520.50 s = 58:40.5**, with 8730 words and 498 sentences.
- 8714 words, 497 sentences, 33 beats;
- speech 3268.7 s;
- **148.9 words per minute overall** (≤ 150 ✓), 160.0 while speaking.

**Against v4** (timing.json 3059.9 s, 51:00): **+453.6 s, +7.6 min.**

| Scene | v4 s | UF2 s | Δ s | words | sentences |
|---|---|---|---|---|---|
| s18_scale_height | 80.8 | 51.4 | −29.4 | 127 | 9 |
| s18b_scale_height_number | 88.8 | 58.3 | −30.5 | 146 | 8 |
| s19_exponential | 52.2 | 49.1 | −3.1 | 129 | 7 |
| s20_exponential_meaning | 40.0 | 52.5 | +12.5 | 123 | 5 |
| s20e_tangent (new) | — | 84.9 | +84.9 | 225 | 10 |
| s20f_not_a_lid (new) | — | 56.8 | +56.8 | 151 | 8 |
| s20g_uniform_block (new) | — | 111.5 | +111.5 | 295 | 13 |
| s20b_per_km | 62.2 | 107.4 | +45.2 | 284 | 12 |
| s20c_equal_slabs | 53.2 | 54.8 | +1.6 | 144 | 7 |
| s21_balloon_pressure | 58.3 | 59.6 | +1.4 | 153 | 9 |
| s22_mass_below | 76.2 | 82.5 | +6.2 | 226 | 10 |
| s27c_vapour_stack (new) | — | 40.7 | +40.7 | 111 | 5 |
| s36_weather_climate | 53.7 | 96.2 | +42.5 | 253 | 12 |
| s38b_reanalysis_stack (new) | — | 58.4 | +58.4 | 141 | 7 |
| s48b_front_stack (new) | — | 47.9 | +47.9 | 129 | 6 |
| s60_recap | 64.5 | 68.9 | +4.4 | 162 | 8 |

**Where the time goes:**
- the scale-height rewrite, s18–s22: **+257 s** (the core of U2-09…15);
- the three stacks: +147 s;
- s36 (U2-25): +42.5 s;
- the recap: +4 s.

**Options to come closer to 55 min.** Every value is measured, so subtracting it gives the exact result.

| Option | Saves | Result | Comment |
|---|---|---|---|
| keep everything | — | **58:33** | the teaching as planned; the user prefers more scenes to confusion (HOUSE_STYLE §1) |
| drop s20c equal slabs | 54.8 s | 57:39 | it is now the fourth picture of "falls more slowly higher up" (after s20e, s20f, s20g); the reviewer liked it in v4 |
| drop s38b temperature stack | 58.4 s | 57:35 | s24 and s25 already compare Paris and Singapore; the stack adds the 3-D view and "the reanalysis fills in the rest" |
| **drop s20c and s38b (recommended if ≈ 55 is firm)** | 113.2 s | **56:40** | keeps the whole scale-height rewrite, U2-25 and the two stacks with new facts (vapour near the ground; the front as a sloping surface) |
| also drop s27c | 153.9 s | 55:59.5 | loses the "half the vapour below 1.5 km" fact |
| also drop s48b | 201.8 s | 55:11.6 | loses the user's own stack idea; leaves G6 unanswered in this movie |

**Cost** (render basis from retrofit plan §2):
- **Render.** Every scene after s18 shifts in time, so this is a full re-render: ≈ 105 400 frames at ≈ 15 fps (2-D) and
  about half that in three.js scenes. That is ≈ 3–4 h of chunked rendering, plus ≈ 30 min splice and QA.
- **File size.** About 165 MB at the v4 bit rate (v4: 143 MB for 51 min). That is over the old 160-MB cap, so it needs
  crf 24 or a larger cap.
- **Builder time.** The shared kit K1–K7 is ≈ 1 day (shared with the retro-fits). The scale-height scenes, s31, s36 and s53
  are ≈ 1 day. The three stacks are ≈ 1 day. Fetches and fluidpy F-UF2-1/2 with tests are ≈ ½ day. Then the final TTS,
  sound and a fresh review.
- **Disk.** C: 53 GB free and G: 523 GB free before the dry run. The dry-run audio (≈ 170 MB) is on G: scratch.

## 10. How to apply (orchestrator, after the fix-loop-1 builder finishes)
1. Back up `storyboard.yaml` and `script.md` to G: (`storyboard_before_uf2.yaml`).
2. **storyboard.yaml → version 5.** Do the following:
   - Replace `voiceover` for s18, s18b, s19, s20, s20b, s22 (§2).
   - Edit one sentence each in s20c S1, s21 S4 and s60 S3.
   - Insert s20e, s20f and s20g after s20; s27c after s27b; s38b after s38; s48b after s48. Each needs `beat`, `visual` (§3/§6),
     `on_screen_eq` (latex + `vallis_eq` "our step from (1.51)/(1.53)" + `page_png` as listed), `physics_source` (§7),
     `exaggeration`, `source_line` and `uf2: [U2-…]`.
   - Append a "UF2:" paragraph to the `visual` of s02, s03, s05, s13–s15, s18, s18b, s20c, s21, s22, s27b, s31, s60 and
     every globe scene in §4.2.
   - Update `honesty_notes`, `revision`, `dry_run` (§9) and `measured_*` after the builder's final TTS.
3. **script.md:** apply §2 and add a "UF2 change log" block in the same style as the UF1 block ('−' old, '+' new).
4. **data_needs.md:** add §H = §7 of this plan.
5. **Builder order:**
   1. fetch D-UF2-1…3 (disk guard);
   2. implement F-UF2-1/2 with tests, full fluidpy suite green;
   3. `build_ch00_weather_basics.py` `uf2_*` products and W78–W89;
   4. the shared house kit K1–K7 (K7 = `AnimatedWindArrow` / `FlowParticles` / `BeltChevrons`, plus `globecam.ts`, §4.4; `GlobeFrame`, `SourceBelow`, `Callout`, col3d edges, `LayerStack3D` + `_stack.py`, movie_qa `overlap`), with the kit_wb `Globe` and `SrcLine` replaced by K1/K2;
   5. scene work;
   6. the K6 overlap gate at every 0.5 s;
   7. final TTS, sound cues and music re-timed;
   8. render in chunks;
   9. QA 13 gates plus `overlap`;
   10. a fresh review, with frames at 1 fps through s02, s03, s18–s22, s27b–s27c, s31, s38b and s48b.

## Orchestrator decisions (2026-10-29)
- Length: keep everything the user asked for (the scale-height rewrite, all three stacks, s36). **Drop only s20c**: it is the fourth picture of one idea, and the planner rated it redundant. That gives about 57:30. The user asked for clarity and detail over brevity.
- Also do U2-28: the westerlies as well as the trades in s53, with a camera flight and hover per belt. House globe = cross-product v5 56:35–57:54. Text may sit on the faded rim only. The source line goes below the globe.
- Size: stay under the 160 MB hard cap by encoding (crf 24 or 2-pass at a lower bitrate); do not raise the cap.
- User, 2026-10-29: **do not add new titles to globes or maps.** They take space. The globe rule only covers how a globe renders when it zooms or moves between places. Keep the weather movie's existing titles as they are now. Keep the colour bar with its label as it is now.
- 2026-10-29 (user): a source line goes below the image, globe, map or figure, or beside it where that fits. It must never lie on the globe or map.
- 2026-10-29 (user): ZOOM-REVEAL is the house rule for every globe zoom in every movie, finished or future (HOUSE_STYLE §5b; frames weather_basics/3.png → 4.png). Unzoomed: the globe stays separate from the text. Zoomed: the globe grows and its faded right part runs behind the text. Re-open every movie whose globe zooms; weather basics comes first.
- 2026-10-29: the zoom-reveal numbers are measured from the v5 s33 code and are now in HOUSE_STYLE §5b: full-bleed globe; right side darkened 0→82 % over x 980–1160, then 82 % (not blurred); 60-px fades at the top, left and right frame edges; bottom fade moved up to y 760–830 so the source line at y 852 sits on solid background. The K1 GlobeFrame must reproduce exactly this.
