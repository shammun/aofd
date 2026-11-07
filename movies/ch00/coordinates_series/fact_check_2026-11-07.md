# Fact check — Chapter 0 Coordinates series (Parts 1–7) + The gradient — 2026-11-07

Scope: spoken narration (`script.md`) of `ch00_coordinates_{flat,storm,sphere,frames,moving,routes,maps}` and `ch00_gradient`;
on-screen text (`source_line`, keywords, labels quoted in `visual:`) of each `storyboard.yaml`, cross-checked against the
rendered strings in `movies/src/**.tsx` where the two differ; `ch00_coordinates_storm/manifest.json → credits`.
Line numbers are `script.md` lines (one scene paragraph per line) unless the file is named.
Verdicts: **OK** · **WRONG** · **MISLEADING** · **UNVERIFIABLE**. Numbers the builders compute from data (ring averages, gauge
residuals, ERA5/GFS/OISST values, distances from IBTrACS tracks) got a consistency check against `data/*.json` and the
builder's `row(...)` checks, not a web check. Pure maths/arithmetic in the derivations is out of scope (all spot-checked rows agree).

Nothing else was edited.

---

## Summary — every non-OK row, most serious first

| # | Movie · file:line | Claim (quoted) | Verdict | Proposed exact rewrite |
|---|---|---|---|---|
| 1 | storm · script.md:257 (s21) | "On the eighteenth of May, it became a super cyclonic storm, the strongest class there, and the first in the Bay of Bengal since nineteen ninety nine." | **MISLEADING** (facts true, framing not) | "On the eighteenth of May, its winds reached the top class on the India Meteorological Department's scale, called a super cyclonic storm. No storm in the Bay of Bengal had reached that class since nineteen ninety nine. That class measures only the strongest wind over the sea, not the harm on land. In between, weaker storms hit Bangladesh very hard: Cyclone Sidr in two thousand and seven killed thousands of people, and Cyclone Aila in two thousand and nine flooded Khulna and Satkhira for months." (On-screen keyword at s21 S5: change ''super cyclonic storm'' → ''IMD's top wind class: super cyclonic storm''.) |
| 2 | storm · script.md:257 (s21) | "Its centre then passed close to Kolkata, about forty five kilometres west of Satkhira, and about seventy nine kilometres west of Khulna." | **MISLEADING** (heard as "Kolkata is 45 km west of Satkhira"; Kolkata is ≈ 74 km from Satkhira) | "Its centre then passed close to Kolkata. It passed about forty five kilometres west of Satkhira, and about seventy nine kilometres west of Khulna, both in Bangladesh." |
| 3 | gradient · script.md:248 (s35) | "Here is the coast of Normandy … at one in the afternoon on the twenty fourth of June twenty twenty four." | **MISLEADING** (data are 13 UTC = 15:00 local summer time; a sea-breeze story heard as local 1 pm) | "Here is the coast of Normandy, in northern France, at one in the afternoon, universal time, which is three in the afternoon in France, on the twenty fourth of June twenty twenty four." |
| 4 | storm · manifest.json credits[8] | "Fischer, Rogers, Reasor and Gamache 2022, Mon. Wea. Rev. 150, 2255-2278, doi:10.1175/MWR-D-21-0223.1" | **WRONG** (author order) | "Fischer, Reasor, Rogers and Gamache 2022, Mon. Wea. Rev. 150, 2255–2278, doi:10.1175/MWR-D-21-0223.1" |
| 5 | sphere · script.md:194 (s07) | "Brest's parallel runs east through central Europe, Ukraine, Kazakhstan and Mongolia. Then it runs on round through the northern United States and eastern Canada" | **MISLEADING** (omits southern Russia, China twice, Russia's Far East and western Canada; on-screen labels same list, storyboard l.1188–1190) | "Brest's parallel runs east through central Europe, Ukraine, southern Russia, Kazakhstan, the far west of China, Mongolia, north-east China and Russia's Far East. Then it crosses the Pacific, the southern tip of Vancouver Island, the northern United States and eastern Canada, and comes back across the Atlantic to Brest." (Labels: add ''Russia'', ''China''.) |
| 6 | sphere · script.md:259 (s19) | "Let's do the same for a city on the other side of Asia. Khulna is … close to where Cyclone Amphan, from Part 2, came ashore in May twenty twenty." | **MISLEADING** (Khulna is in South Asia, not "the other side of Asia"; landfall near Bakkhali is ≈ 185–220 km SW of Khulna; the track passed 79 km west) | "Let's do the same for a city far to the south-east, in South Asia. Khulna is in the southwest of Bangladesh, near the Sundarbans, the world's largest mangrove forest. In May twenty twenty, the centre of Cyclone Amphan, from Part 2, passed about seventy nine kilometres to its west." |
| 7 | maps · script.md:241 (s16b) | "it's far wider: thousands of kilometres across, instead of about a hundred." | **MISLEADING** (a hurricane is several hundred km across; Ian's tropical-storm winds reached ≈ 260 km from the centre; only the eye + eyewall is ~100 km) | "it's far wider: thousands of kilometres across, instead of a few hundred." |
| 8 | gradient · script.md:134 (s17) | "Over the tropics it sits much higher than over Europe, where it's usually somewhere between about ten and thirteen kilometres up." | **MISLEADING** (European tropopause is typically ≈ 8–12 km; 13 km is rare outside subtropical air) | "Over the tropics it sits much higher than over Europe, where it's usually somewhere between about eight and twelve kilometres up." |
| 9 | storm · script.md:293 (s28) | "What did satellites see of Ian's surge? Nothing at all. The surge drained back to the sea within hours, before any satellite or survey plane passed overhead." | **UNVERIFIABLE** (absolute claim; commercial radar satellites and NOAA survey flights imaged SW Florida from 29 Sep; no image of the surge at its peak is known to us, but "nothing at all … any satellite" cannot be shown) | "What did satellites see of Ian's surge? Almost nothing. The surge peaked in the evening, under the storm's clouds, and drained back to the sea within hours, so the pictures taken from space and from survey planes in the next days show the damage, not the surge itself." |
| 10 | storm · script.md:311 (s31) | "The clearest flood pictures from space of any cyclone in the Bay of Bengal come from Cyclone Nargis" | **UNVERIFIABLE** (superlative, no ranking exists) | "Some of the best-known flood pictures from space of a Bay of Bengal cyclone come from Cyclone Nargis, in May two thousand and eight." |
| 11 | gradient · script.md:86, :200, :230 | "six in the evening on the first of November twenty twenty three"; "three in the morning on the second of November" | **MISLEADING** (minor: UTC times said without "universal time"; local France time is 19:00 and 04:00) | Add ", universal time," after each time: "It's six in the evening, universal time, on the first of November …"; "Storm Ciarán at three in the morning, universal time, on the second of November …"; l.230 "at six in the evening, universal time, on the first of November". |
| 12 | storm · storyboard.yaml:2726; frames · storyboard.yaml:92, :175, script.md:66 (README) | "≈ 78 km" (Amphan west of Khulna) | **WRONG** (stale text only; data `cs.json → amphan.close.Khulna.km` = 79.36, narration and rendered labels `cs_sC.tsx:100`, `fr_sA.tsx:607` say 79) | Change the storyboard/README text to "≈ 79 km" (nothing on screen changes). |
| 13 | gradient · storyboard.yaml:2156 (s36 visual) | "Sources below: 'Data: ERA5 monthly (Copernicus C3S) · Nov 2023'" | **WRONG** (stale text only; the rendered line `gr_sD.tsx:464` and narration say September 2026) | "'Data: ERA5 monthly means (Copernicus C3S) · Sep 2026 · zonal mean'" |

Counts (rows in the per-movie tables below, 169 checked claims): **OK 152 · MISLEADING 11 (8 distinct issues) · WRONG 4 (3 distinct; two of them stale storyboard text that is not rendered) · UNVERIFIABLE 2**. Four MISLEADING rows have correct numbers and only a wording/time-zone problem.

### Item 1 in detail (the user's finding)

* **What is true.** IMD (RSMC New Delhi) upgraded Amphan to a Super Cyclonic Storm (SuCS, ≥ 120 kt 3-min mean, the top of IMD's
  scale) around 12 UTC on 18 May 2020; IMD peak 130 kt (240 km/h), 920 hPa (IBTrACS `newdelhi`, project row DS19). IMD's own
  report calls it the first SuCS over the Bay of Bengal since the 1999 Odisha super cyclone. It crossed the West Bengal–Bangladesh
  coast near Bakkhali / the Sundarbans as a Very Severe Cyclonic Storm (155–165 km/h gusting 185 km/h) between 1530 and 1730 IST
  (10–12 UTC) on 20 May.
* **Why it misleads.** "The strongest class … the first since 1999" is a statement about peak wind over the open Bay two days before
  landfall. A Bangladeshi listener hears "the biggest event since 1999", but:
  * **Cyclone Sidr**, 15 Nov 2007 (landfall ≈ 17 UTC, Bangladesh coast): IMD peak 115 kt / 215 km/h, 944 hPa — one class
    below SuCS (today's name: Extremely Severe Cyclonic Storm); JTWC 1-min 140 kt (Cat 5-equivalent). ≥ 3,447 deaths in Bangladesh
    (estimates to 10,000+), US$ 2.3 bn damage — far deadlier in Bangladesh than Amphan.
  * **Cyclone Aila**, 25 May 2009 (landfall 08–09 UTC, West Bengal–Bangladesh coast): IMD Severe Cyclonic Storm, 60 kt, 967–968 hPa;
    ≈ 3 m surge, embankment breaches, 190 deaths and 7,000+ injured in Khulna and Satkhira; ≥ 339 deaths in all; US$ 1.8 bn.
  * Amphan itself: 128–133 deaths (≈ 26 in Bangladesh), ≈ US$ 13–15 bn — among the costliest North Indian Ocean cyclones, because it
    hit densely built West Bengal/Kolkata, not because of its SuCS label.
  * (Nargis 2008, which the same movie shows later, killed ≈ 138,000 in Myanmar and was IMD VSCS 90 kt.)
* **Rewrite rule.** Say it is IMD's top **wind** class, say it is not a damage scale, and name Sidr/Aila so nothing implies no worse
  storm hit Bangladesh after 1999. The rewrite in row 1 adds no new numbers needing on-screen arithmetic.

---

## Part 1 — `ch00_coordinates_flat`

| file:line | Claim (quoted) | Verdict | Source |
|---|---|---|---|
| script.md:118 | "Cartesian coordinates, after the French thinker René Descartes" | OK | Descartes (1596–1650), French; *La Géométrie* 1637 (standard history). |
| script.md:128 | "A weather radar measures exactly this pair: how far away … and in which direction" | OK | Radar range + azimuth (NOAA NEXRAD docs). |
| script.md:138 | compass bearing from north, clockwise; wind direction = where it blows from | OK | WMO/NWS convention. |
| script.md:143 | "one radian is … about fifty seven degrees" | OK | 360/2π = 57.3°. |
| script.md:214 | "Hurricane Ian on the twenty eighth of September, twenty twenty-two, at six in the evening, universal time, an hour before it came ashore on the southwest coast of Florida" | OK | NHC TCR AL092022 (https://www.nhc.noaa.gov/data/tcr/AL092022_Ian.pdf): landfall Cayo Costa 1905 UTC 28 Sep, 130 kt. |
| script.md:214 | "a weather model analysis with grid points every three kilometres" | OK | HRRR is a 3-km CONUS model (NOAA GSL; data from the Utah HRRR-zarr archive). |
| script.md:214 | "over the warm Gulf of Mexico, with the flat, low land of southwest Florida to its east" | OK | Best track 18 UTC 26.6 N 82.4 W (TCR table). |
| script.md:220 | ring mean u_θ ≈ 34.8, u_r ≈ −13.3 m/s at 25 km | OK (consistency) | Builder data `cf.json`; summed values 2506/72, −957/72 match. |
| script.md:220 | "The official estimate of its strongest wind at that hour, averaged over a minute, is about a hundred and thirty five knots … about sixty nine metres per second" | OK | TCR best track 28/1800: 135 kt, 938 mb; 135 × 0.5144 = 69.4 m/s. |
| script.md:220 | "as in every northern hemisphere hurricane" (anticlockwise seen from above) | OK | Cyclonic = anticlockwise in NH. |
| script.md:238 | u_θ 17–47, u_r −40…+14, negative at 58 of 72 points | OK (consistency) | `cf.json` ring arrays. |
| script.md:244 | inflow angle ≈ 21° | OK (consistency) | atan(13.3/34.8) = 20.9°. |
| storyboard s14 source_line | "Data: … (NOAA) · GOES-16 (NOAA, contrast enhanced) · 28 Sep 2022, 18 UTC" | OK | GOES-16 was GOES-East in 2022. |

## Part 2 — `ch00_coordinates_storm`

| file:line | Claim (quoted) | Verdict | Source / proposed rewrite |
|---|---|---|---|
| script.md:154 | "Near America it's called a hurricane, and near India and Bangladesh it's called a cyclone" | OK | WMO regional naming (Atlantic/NE Pacific hurricane; North Indian Ocean cyclone). |
| script.md:154 | "Hurricane Ian, which hit Florida in twenty twenty two … Cyclone Amphan, which hit India and Bangladesh in twenty twenty … Nargis in Myanmar and Idai in Mozambique" | OK | TCR AL092022; IMD Amphan report; Wikipedia Nargis/Idai (below). |
| script.md:222 | "The Earth's spin pushes the other way, a little outward, about twenty times weaker" | OK (consistency) | f = 2Ω sin 26.5° = 6.5e-5 s⁻¹; f v = 0.0023; 0.048/0.0023 ≈ 21. |
| script.md:227 | outflow "about twelve to fifteen kilometres up" | OK | Standard TC structure (upper-tropospheric outflow 150–200 hPa). |
| script.md:227 | "Ian from above, seen by a weather satellite at six in the evening, universal time" / on-screen "NOAA GOES-16 ABI mesoscale · 28 Sep 2022, 18:01 UTC" | OK | GOES-16 mesoscale sector over Ian (credits: L2 CMIPM). |
| script.md:237 | "A weather radar on the coast near Tampa" / "NOAA NEXRAD … Tampa Bay (KTBW) … lowest beam, tilted 0.5°" | OK | KTBW is at Ruskin on Tampa Bay; 0.5° lowest tilt. |
| script.md:237 | eyewall ≈ 30 km radius; model centre 17 km WSW; model 960 hPa | OK (consistency) | `cs.json s17`: r_fit 31.4, d_eye 17.0, brg 252.5 (WSW), pmin 960.3. |
| script.md:237 | "the official estimate is nine hundred and thirty eight" | OK | TCR 28/1800: 938 mb. |
| script.md:237 | "a model with grid points every three kilometres" | OK | HRRR 3 km. |
| script.md:242 | 925 hPa ≈ 0.7 km … 150 hPa ≈ 14 km; sea-level pressure < 975 hPa near the eye | OK (consistency) | HRRR geopotential (storyboard labels 0.7/1.4/5.8/12.4/14.3 km). |
| script.md:252 | ring-mean inflow −16 m/s at 30 km, 0.7 km; outflow +9; u_θ max 55 m/s at 1.4 km | OK (consistency) | Builder DS rows; `cs.json`. |
| script.md:252 | "radar on a hurricane-hunter aircraft measured it: about three metres per second, eight and a half kilometres up, with single towers near ten" | OK (consistency) | NOAA P-3 TDR mission 20220928H1 ≈ 10:23 UTC (`cs.json w.tdr.time_utc`): ring-mean peak 3.3 m/s at 8.5 km, single updraughts 11.6 m/s (storyboard l.605). |
| script.md:257 | "the Bay of Bengal, between India and Myanmar, with Bangladesh at its northern end" | OK | Geography. |
| script.md:257 | "In May twenty twenty, Cyclone Amphan formed in the south of the Bay" | OK | IMD: depression 16 May over the south-east Bay (odishabytes summary of IMD report, https://odishabytes.com/imd-report-on-amphan-first-super-cyclonic-storm-since-1999-odisha-sucs/amp). |
| script.md:257 | "On the eighteenth of May, it became a super cyclonic storm, the strongest class there, and the first in the Bay of Bengal since nineteen ninety nine." | **MISLEADING** | See summary row 1 and "Item 1 in detail". Sources: IMD report via odishabytes (above); https://en.wikipedia.org/wiki/Cyclone_Amphan (IMD peak 240 km/h, 920 hPa, 18 May); https://en.wikipedia.org/wiki/Cyclone_Sidr (IMD 215 km/h, 944 hPa; ≥ 3,447 deaths in Bangladesh); https://en.wikipedia.org/wiki/Cyclone_Aila (IMD SCS 110 km/h, 968 hPa; 190 deaths in Khulna/Satkhira). |
| script.md:257 | "On the twentieth, it came ashore in the Sundarbans … on the border between India's state of West Bengal and Bangladesh" | OK | IMD: crossed the West Bengal–Bangladesh coast near the Sundarbans (Bakkhali), 1530–1730 IST 20 May, VSCS 155–165 km/h. |
| script.md:257 | "Its centre then passed close to Kolkata, about forty five kilometres west of Satkhira, and about seventy nine kilometres west of Khulna." | **MISLEADING** (wording) | Distances OK vs `cs.json amphan.close` (Kolkata 17 km, track east of it; Satkhira 45.2 km W; Khulna 79.4 km W); the sentence parses as "Kolkata, 45 km west of Satkhira". Rewrite in summary row 2. |
| script.md:257 | "So the Khulna and Satkhira districts of Bangladesh took much of its flooding." | OK | Wikipedia Amphan: 2.7 m surge breached ≈ 150 km of embankments; Satkhira winds 151 km/h; Khulna and Barisal divisions worst hit. |
| script.md:262 | "Amphan on the eighteenth of May … seen by a NASA satellite … a pinhole eye" / "NASA Worldview (MODIS Terra) · 18 May 2020" | OK | Image is MODIS Terra 18 May (eye fix `cs.json amphan.modis.eye` 13.4 N 86.1 E = IBTrACS 13.4 N 86.2 E); Amphan had a small eye during rapid intensification 17–18 May (Wikipedia). |
| script.md:267 | "ERA5 … Its grid boxes are about twenty eight kilometres wide" | OK | ERA5 on 0.25° grid: 0.25 × 111.2 = 27.8 km (ECMWF ERA5 docs). |
| script.md:267 | "six in the morning, universal time, on the twentieth of May, about four hours before landfall" | OK | IMD landfall 10–12 UTC; IBTrACS fix 09 UTC 21.4 N 88.1 E. |
| script.md:267 | "The official estimate at that hour, averaged over three minutes, was about ninety knots … and a lowest pressure of nine hundred and fifty six hectopascals" | OK | IBTrACS v04r01 WMO (= RSMC New Delhi, 3-min) 06 UTC 20 May: 90 kt, 956 hPa (`cs.json amphan.best06`). |
| script.md:267 | ERA5 min 967 hPa; ring 50 km: u_θ 20, u_r −6; inflow ≈ 17° | OK (consistency) | `cs.json amphan.msl` 966.9, vt10 20.08, vr10 −5.97, inflow 16.5°. |
| script.md:267 | "both storms are in the northern hemisphere" → anticlockwise | OK | |
| script.md:272 | Amphan section: inflow −11 m/s at 100 km; outflow +6 | OK (consistency) | `cs.json amphan.sec.min/max`. |
| script.md:282 | "At eight in the evening, universal time, about an hour after landfall, the model's wind at Fort Myers Beach was about thirty three metres per second, from the south-west" | OK | Landfall 1905 UTC (TCR); HRRR 20 UTC value (frames `fr` data 22.2, 24.3 m/s → 32.9 m/s). |
| script.md:282 | "The coast there runs towards the north-north-west" | OK | Computed 329° (Naples→Englewood, Part 4); NNW sector. |
| script.md:287 | "the sea rises by about one centimetre for every hectopascal" | OK | Inverse-barometer effect ≈ 1 cm/hPa (standard oceanography). |
| script.md:287 | "Ian's centre was about seventy five hectopascals below normal" | OK | 1013 − 938 = 75 (TCR 18 UTC). |
| script.md:287 | "At Fort Myers Beach, the official report found water ten to fifteen feet above the ground: about three to four and a half metres" / on-screen "NHC: 3-4.5 m above the ground at Fort Myers Beach" | OK | TCR p. 9: "Peak storm surge inundation levels of 10 to 15 ft above ground level (AGL) occurred in Fort Myers Beach". 10–15 ft = 3.0–4.6 m. |
| script.md:287 | "A tide gauge up the river, at Fort Myers, measured the water about two point two metres above the normal tide" | OK | NOAA CO-OPS 8725520 (Caloosahatchee River, downtown Fort Myers); residual peak 2.209 m (`cs.json coast.gauges`); TCR: 7.26 ft above MHHW at this gauge. |
| script.md:287 | "about a hundred and sixty kilometres north, to Tampa Bay" | OK | Fort Myers Beach (26.45 N, 81.95 W) → St Petersburg gauge (27.76 N, 82.63 W) ≈ 160 km. |
| script.md:287 | "the gauge at Saint Petersburg read about one point eight metres below the normal tide" | OK | CO-OPS 8726520 residual min −1.755 m (`cs.json`); TCR: Tampa Bay "receded below normal levels … offshore winds". |
| script.md:293 | "What did satellites see of Ian's surge? Nothing at all. … before any satellite or survey plane passed overhead." | **UNVERIFIABLE** | See summary row 9. |
| script.md:293 | "tide gauges … measure the water level every few minutes" | OK | CO-OPS 6-minute water levels. |
| script.md:299 | "Off the Sundarbans, the sea stays shallower than twenty metres for about thirty three kilometres from the coast" | OK (consistency) | `cs.json flood.shelf.89.0E.km_to_20m` = 32.8 (ETOPO 2022). |
| script.md:306 | "thick clouds covered the ground … coarse pixels … two hundred and fifty metres wide" | OK | MODIS cloud fraction 1.0 (21 May), 0.65 (22 May) in the S1 box; MODIS bands 1–2 are 250 m. |
| script.md:306 | "The Sentinel-1 radar satellite sends out microwaves … Calm water reflects the microwaves away … water looks dark" | OK | ESA Sentinel-1 C-band SAR; specular reflection from calm water. |
| script.md:306 | "on the sixteenth of May, before Amphan, and on the twenty second, two and a half days after landfall" | OK | S1 acquisitions 2020-05-16T23:55 and 2020-05-22T23:55 UTC, relative orbit 150 (`cs.json amphan_s1`); landfall ≈ 10–12 UTC 20 May → 2.5 days. (Note: 22 May 23:55 UTC is 23 May morning in Bangladesh.) |
| script.md:306 | ≈ 34,700 pixels × 60 m pixels → ≈ 125 km² of new water | OK (consistency) | `n_new_px` 34,675; `px_m` 60.02; `new_km2` 124.9 (pixels resampled from 10-m GRD; JRC permanent water removed). |
| script.md:311 | "The clearest flood pictures from space of any cyclone in the Bay of Bengal come from Cyclone Nargis" | **UNVERIFIABLE** | Superlative; see summary row 10. |
| script.md:311 | "Irrawaddy River, which Myanmar calls the Ayeyarwady" | OK | Official name Ayeyarwady since 1989. |
| script.md:311 | "the Irrawaddy delta … most of it only a few metres above the sea" / on-screen "mostly ≤ 5 m above the sea" | OK (consistency) | ETOPO 2022: 90 % of the delta box ≤ 5 m, median 2.4 m (`cs.json nargis.low_share5`). |
| script.md:311 | "Nargis formed in the south of the Bay in late April. It moved west, then north, then turned east" | OK (simplified) | https://en.wikipedia.org/wiki/Cyclone_Nargis: IMD depression 27 Apr; moved west, then north-west, near-stationary 28 Apr, north-east, due east from 1 May. |
| script.md:311 | "On the second of May, it came ashore at the delta's south-western corner, with winds of about ninety knots, averaged over three minutes" | OK | Wikipedia: landfall ≈ 12 UTC 2 May, Ayeyarwady Division, IMD 165 km/h (≈ 89 kt) 3-min, 962 hPa; IBTrACS WMO fix 16.0 N 94.1 E, 90 kt. |
| script.md:311 | "A knot is one point eight five two kilometres per hour" | OK | 1 kn = 1.852 km/h exactly. |
| script.md:311 | "Then it crossed the whole delta, eastward, towards Yangon, the country's largest city" | OK | Wikipedia: passed just north of Yangon; Yangon is Myanmar's largest city (capital Naypyidaw). |
| script.md:311 | "seen by a NASA satellite a few hours before landfall" / "NASA MODIS (Aqua, 2 May; Terra, 21 Apr)" | OK | Aqua daytime pass ≈ 07 UTC; landfall ≈ 12 UTC. |
| script.md:315 | "the twenty first of April, eleven days before landfall … the fifth of May, about three days after" | OK | Dates in `cs.json flood.nargis`. |
| script.md:315 | false colour: SWIR and NIR painted red and green, red light blue (bands 7-2-1) | OK | MODIS 7-2-1 composite (NASA Worldview description). |
| script.md:320 | "In March twenty nineteen, Cyclone Idai grew strong in the Mozambique Channel, between Madagascar and Mozambique" | OK | https://en.wikipedia.org/wiki/Cyclone_Idai |
| script.md:320 | "South of the equator, a tropical cyclone turns clockwise as seen from above" | OK | |
| script.md:320 | "It reached the coast near the city of Beira around midnight, between the fourteenth and the fifteenth, with winds of about eighty five knots, averaged over ten minutes" | OK (note) | IBTrACS WMO (RSMC La Réunion, 10-min) fix 21 UTC 14 Mar: 85 kt, 960 hPa; Wikipedia (MFR operational): landfall 00 UTC 15 Mar, 165 km/h (≈ 89 kt). 21–00 UTC = 23:00–02:00 local, so "around midnight" holds. |
| script.md:320 | "Beira and the town of Buzi sit on low, flat land where two big rivers reach the sea" | OK | Beira at the Pungwe–Buzi estuary; Wikipedia: Buzi and Pungwe rivers flooded, Búzi town flooded to 20 Mar. |
| script.md:324 | "the eleventh of March, three and a half days before landfall, and … the twenty fifth, about ten days after" | OK | Terra ≈ 08 UTC 11 Mar → 21–00 UTC 14/15 Mar ≈ 3.5 days. |
| storyboard l.2765 | "IBTrACS v04r01 (NOAA NCEI) · Cyclone Amphan, 16-21 May 2020" | OK | |
| storyboard l.3360 | "ESA Copernicus Sentinel-1 radar · 16 and 22 May 2020 \| Images: NASA Worldview (MODIS Terra) · 21 and 22 May 2020" | OK | `cs.json amphan_s1`. |
| storyboard l.3427 | "IBTrACS … Cyclone Nargis, 25 Apr-3 May 2008" | OK | Disturbance from 25 Apr, dissipated 3 May (Wikipedia). |
| storyboard l.3510, 3611 | MODIS bands 7-2-1; natural colour bands 1-4-3 | OK | MODIS true colour = bands 1-4-3. |
| storyboard l.3563 | "Cyclone Idai, 9-16 Mar 2019 · NASA VIIRS (Suomi NPP), 14 Mar 2019" | OK | |
| storyboard l.2726 | "≈ 78 km" (Khulna) | **WRONG** (stale, not rendered) | Summary row 12. |
| manifest credits[0–7, 9–14] | HRRR (Utah HRRR-zarr), NEXRAD KTBW, GOES-16 ABI L2 CMIPM, ERA5 Copernicus wording, GIBS MODIS, IBTrACS v04r01, CO-OPS, NHC TCR AL092022, ETOPO 2022/ETOPO1, MOD09/MYD09/MCD43A4 via GEE, Blue Marble NG, Natural Earth, Sentinel-1 wording, JRC GSW v1.4 | OK | Product names/licences as published by each agency; Ian = AL092022 (TCR title page). |
| manifest credits[8] | "Fischer, Rogers, Reasor and Gamache 2022, Mon. Wea. Rev. 150, 2255-2278, doi:10.1175/MWR-D-21-0223.1" | **WRONG** | Crossref https://api.crossref.org/works/10.1175/MWR-D-21-0223.1: authors Fischer, **Reasor, Rogers**, Gamache; title "An Analysis of Tropical Cyclone Vortex and Convective Characteristics in Relation to Storm Intensity Using a Novel Airborne Doppler Radar Database", MWR 150(9), 2255–2278. Rewrite in summary row 4. |

## Part 3 — `ch00_coordinates_sphere`

| file:line | Claim (quoted) | Verdict | Source / proposed rewrite |
|---|---|---|---|
| script.md:184 | "Brest, a port at the western tip of France" | OK | Brest 48.39 N, 4.49 W (Finistère). |
| script.md:184 | Earth radius "six thousand three hundred and seventy one" km | OK | IUGG mean radius 6371.0 km. |
| script.md:189 | "Brest is at forty eight point four degrees north" | OK | |
| script.md:194 | "Brest's parallel runs east through central Europe, Ukraine, Kazakhstan and Mongolia. Then … the northern United States and eastern Canada" | **MISLEADING** | Natural Earth 1:110m intersection of 48.4 N (computed here): France, Germany, Austria, Slovakia, Hungary, Ukraine, Moldova, **Russia**, Kazakhstan, **China**, Mongolia, **China**, **Russia**, Canada (Vancouver I.), USA, Canada. Rewrite in summary row 5. |
| script.md:209 | meridian: "the Sun is highest in the sky at the same moment, at midday, and that's where the name comes from" | OK | Latin *meridies*, midday. |
| script.md:214 | "It passes through Greenwich, in London, and it was agreed at an international meeting in eighteen eighty four" | OK | https://en.wikipedia.org/wiki/Prime_meridian_(Greenwich): International Meridian Conference, Washington, Oct 1884. |
| script.md:214 | route: Arctic Ocean; between Greenland and Norway; Norwegian Sea, North Sea; ashore in Yorkshire; Greenwich; leaves near Brighton; Normandy to the Pyrenees; east Spain, Mediterranean a little north of Valencia; Algeria, Mali, Burkina Faso; "a short way along the border between Togo and Ghana, then through Ghana, to the coast near the capital, Accra"; Gulf of Guinea; equator; South Atlantic, Southern Ocean; Antarctica | OK | Same Wikipedia page: countries UK, France, Spain, Algeria, Mali, Burkina Faso, Togo, Ghana; EEZs of Greenland and Norway; Antarctica at Queen Maud Land. Landfall at Tunstall (East Riding of Yorkshire), exit at Peacehaven by Brighton, Spain exit near Castellón (≈ 65 km N of Valencia), Ghana coast at Tema near Accra (standard atlas facts). |
| script.md:219 | Brest λ = −4.5°, or 355.5° on a 0–360 grid | OK | |
| script.md:229 | x axis to the Gulf of Guinea; y axis to 0 N 90 E "in the Indian Ocean, south of the Bay of Bengal" | OK | |
| script.md:259 | "a city on the other side of Asia … close to where Cyclone Amphan … came ashore" | **MISLEADING** | Summary row 6. Distances: Khulna (22.84 N, 89.56 E) to IMD landfall (≈ 21.65 N, 88.3 E) ≈ 185 km; to IBTrACS fix (21.4 N, 88.1 E) ≈ 220 km. |
| script.md:259 | "Khulna is in the southwest of Bangladesh, near the Sundarbans, the world's largest mangrove forest … about twenty two point eight degrees north, and eighty nine point six degrees east" | OK | Khulna 22.82 N, 89.55 E; Sundarbans = largest mangrove forest (UNESCO). |
| script.md:264 | "the Earth turns once every twenty three hours, fifty six minutes and four seconds … four minutes shorter than a day from noon to noon" | OK | Sidereal day 86,164.1 s (IERS). |
| script.md:269 | Ω ≈ 7.292 × 10⁻⁵ rad/s; equator 464.6 m/s ≈ 1670 km/h | OK | 7.2921 × 10⁻⁵ × 6.371 × 10⁶ = 464.6. |
| script.md:269 | "A passenger jet flies at about nine hundred kilometres per hour" | OK | Typical cruise ≈ 850–950 km/h. |
| script.md:269 | "Singapore, at one point three five degrees north" | OK | Singapore 1.35 N. |
| script.md:269 | "Longyearbyen, on the Arctic islands of Svalbard, seventy eight point two degrees north" | OK | 78.22 N. |
| script.md:279 | "One minute of latitude … about one point eight five kilometres. That's the nautical mile" | OK | Nautical mile = 1852 m by definition (1929), historically one minute of latitude. |
| script.md:294 | "ERA5 … on a grid of latitude and longitude, every quarter of a degree" | OK | ERA5 0.25° regular grid (ECMWF/C3S). |
| script.md:294 | "many modern weather models use other kinds of grid, which don't crowd together at the poles" | OK | e.g. ECMWF octahedral reduced Gaussian, ICON icosahedral, FV3 cubed sphere. |
| script.md:324 | Earth area ≈ 510 million km²; hemisphere ≈ 255 | OK | 4πa² = 510.1 × 10⁶ km². |
| script.md:329 | "found by Archimedes more than two thousand years ago" | OK | *On the Sphere and Cylinder*, c. 225 BC. |
| script.md:334 | ERA5 2-m temperature, September 2026: plain mean 7.1 °C, cos-weighted 16.3 °C | OK (consistency) | Builder data; 16.3 °C is in the range of recent Septembers in ERA5 (C3S bulletins ≈ 16.2–16.4 °C for Sept 2023–24). |
| storyboard l.1188–1190 | labels "central Europe", "Ukraine", "Kazakhstan", "Mongolia", "United States", "Canada" | **MISLEADING** (same as l.194) | Add ''Russia'', ''China''. |
| storyboard l.1538–1543 | prime-meridian labels incl. ''Togo'', ''Accra'', ''Valencia'', ''Brighton'', ''Yorkshire'' | OK | As above. |

## Part 4 — `ch00_coordinates_frames`

| file:line | Claim (quoted) | Verdict | Source |
|---|---|---|---|
| script.md:119 | "Brest sits at the western tip of Brittany, in France, with the Atlantic Ocean on three sides" | OK | Finistère peninsula; Iroise Sea / Atlantic W, N and S. |
| script.md:119 | local ENU frame; "every weather report uses this frame" | OK | |
| script.md:144 | "Trappes, near Paris, is four hundred and eighty kilometres east of Brest" | OK | Trappes (IGRA 07145, 48.77 N, 2.01 E) – Brest great-circle ≈ 480 km (computed). |
| script.md:144 | Singapore's up (−0.239, 0.971, 0.024); angle with Brest's up ≈ 101° | OK (consistency) | 103.8 E, 1.35 N. |
| script.md:149 | "Khulna lies on the rivers of the Ganges delta, just north of the Sundarbans … to the west, across the border, is Kolkata" | OK | |
| script.md:149 | "the centre of Cyclone Amphan passed about seventy nine kilometres west of Khulna" | OK | `cs.json amphan.close.Khulna.km` 79.4 (IBTrACS NI, interpolated). |
| script.md:154 | "the south-west coast of Florida, where Hurricane Ian came ashore in September twenty twenty two" | OK | TCR. |
| script.md:159 | Naples 26.10 N 81.80 W; Englewood 26.92 N 82.35 W (Natural Earth coast points) | OK | Naples FL 26.14 N 81.79 W; Englewood FL 26.96 N 82.35 W — coast points near both towns. |
| script.md:164 | coast bearing 329°, "north-north-west" | OK | 329° lies between NW (315°) and NNW (337.5°), nearer NNW. |
| script.md:174 | "At eight in the evening, universal time … about an hour after Ian came ashore … about thirty three metres per second, from the south-west" | OK | Landfall 1905 UTC; HRRR (22.2, 24.3) m/s. |
| script.md:174 | "the storm surge that flooded Fort Myers Beach that afternoon" | OK | 20 UTC = 4 pm EDT; TCR 10–15 ft AGL at Fort Myers Beach. |
| script.md:239 | Ω, f at 45° = 1.03 × 10⁻⁴ s⁻¹; metric term ≈ 66× smaller | OK | |
| storyboard l.92, l.175; script.md:66 (README) | "Amphan 78 km W" | **WRONG** (stale, not rendered) | Summary row 12. |

## Part 5 — `ch00_coordinates_moving`

| file:line | Claim (quoted) | Verdict | Source |
|---|---|---|---|
| script.md:104 | "a Galilean transformation, after Galileo Galilei" | OK | |
| script.md:109 | "it speeds up downwards by nine point eight metres per second every second" | OK | g ≈ 9.81 m/s². |
| script.md:124 | "Storm Ciarán crossed the English Channel in the night from the first to the second of November, twenty twenty three" | OK | Met Office / Météo-France storm reports; https://www.meteo-paris.com/actualites/bilan-de-la-tempete-ciaran-jusqu-a-207-km-h-et-gros-degats-entre-bretagne-et-manche |
| script.md:124 | "At midnight, universal time, its centre was just off the tip of Cornwall, at nine hundred and fifty four and a half hectopascals"; motion 71°, 14.6 m/s | OK (consistency) | ERA5 hourly tracking in builder (`build_ch00_coordinates_moving.py`); Met Office quoted ≈ 953 hPa minimum. |
| script.md:129–144 | ring winds 18/7 m/s, storm-relative 5/20, ring mean 14.1/13.8, inflow ≈ 6 | OK (consistency) | Builder rows. |
| script.md:144 | "That night, the weather station at Brest measured a gust of eighty four knots, about a hundred and fifty six kilometres per hour" | OK | ISD SYNOP Brest 03 UTC 2 Nov 911-group 84 kt (builder DC55); Météo-France/press: 156 km/h at Brest-Guipavas, a station record (https://www.futura-sciences.com/planete/actualites/meteorologie-sting-jet-fait-exploser-puissance-tempete-ciaran-108852/). |
| script.md:149 | "Plymouth, on England's south coast" | OK | |
| script.md:159 | Plymouth 964.1 → 956.5 hPa (23–01 UTC); 123 km NE of the low; 0.061 hPa/km | OK (consistency) | Builder `say` block. |
| script.md:164 | centre 954.9 → 954.0 hPa | OK (consistency) | |

## Part 6 — `ch00_coordinates_routes`

| file:line | Claim (quoted) | Verdict | Source |
|---|---|---|---|
| script.md:139 | London 51.5 N "almost on the prime meridian"; Los Angeles 34 N, 118 W | OK | 51.51 N 0.13 W; 34.05 N 118.24 W. |
| script.md:154–159 | σ ≈ 78.74°, d ≈ 8755 km | OK | Recomputed here: 78.738°, 8755.3 km. |
| script.md:159 | "At a cruising speed of about nine hundred kilometres per hour, that's nearly ten hours" | OK | 9.7 h (real LHR–LAX ≈ 11 h block time incl. winds/taxi). |
| script.md:164 | initial bearing ≈ 312°, vertex ≈ 62.4 N "near the south-west coast of Greenland", arrival bearing ≈ 214° | OK | Recomputed: 311.8°, vertex 62.37 N 48.96 W (Paamiut area, SW Greenland), 214.0°. |
| script.md:164 | "That's why flights from Europe to California pass over Greenland and Canada" | OK | Standard great-circle routing. |
| script.md:169 | rhumb bearing ≈ 258.5°, 9733 km, ≈ 11 % longer, +978 km | OK | Recomputed: 258.49°, 9732.8 km. |
| script.md:169 | "Sailors used a different route for centuries" (rhumb line); spirals to a pole | OK | Loxodrome history (Nunes, 1537). |
| script.md:174 | "From Brest to Lisbon, about one thousand one hundred and thirty eight kilometres, the rhumb line is only about a hundred and fifty metres longer" | OK | Recomputed: 1138.1 km; difference 149 m. |
| script.md:174 | "On the most famous flat map, the Mercator map, a rhumb line is a straight line … long voyages were often split into a few rhumb-line legs" | OK | Composite/great-circle sailing by rhumb legs (standard navigation texts). |

## Part 7 — `ch00_coordinates_maps`

| file:line | Claim (quoted) | Verdict | Source |
|---|---|---|---|
| script.md:149 | "Why does Greenland look as big as Africa on so many maps" | OK | Mercator area factor at ≈ 72 N ≈ 10×. |
| script.md:164 | "the plate carrée, French for flat square, and most weather data come on exactly this kind of grid" | OK | Regular lat–lon grids (ERA5, GFS, NCEP R1 distributions). |
| script.md:179 | "In fifteen sixty nine, the map maker Gerardus Mercator" | OK | Mercator's world map, Duisburg 1569. |
| script.md:189 | "in fifteen ninety nine, the English mathematician Edward Wright published a table made by adding up such steps, one minute of latitude at a time" | OK | *Certaine Errors in Navigation* (1599): table of meridional parts summing secants at 1′ intervals (https://en.wikipedia.org/wiki/Edward_Wright_(mathematician)). |
| script.md:199 | "Mercator maps are always cut off before the poles, usually somewhere past eighty degrees" | OK | Web Mercator 85.05°; atlases ≈ 80–85°. |
| script.md:209 | "Greenland covers about two point one seven million square kilometres, and Africa about thirty point four million … about fourteen times bigger" | OK | Greenland 2,166,086 km²; Africa ≈ 30.37 × 10⁶ km²; ratio 14.0. |
| script.md:214 | "the Equal Earth map, from twenty eighteen" | OK | Šavrič, Patterson & Jenny (2018), *IJGIS*. |
| script.md:214 | anomaly vs "the average from nineteen ninety one to twenty twenty" | OK | WMO current normal 1991–2020; source line "ERA5 · Sep 2026 vs 1991–2020". |
| script.md:214 | "at sixty degrees north and thirty degrees east, angles can be off by about thirty one degrees" | OK | pyproj `eqearth` factors at (30 E, 60 N): angular distortion 31.1°, areal scale 1.000 (computed here). |
| script.md:224 | "polar stereographic, and this one is drawn true to scale at sixty degrees north, like many weather charts of the pole" | OK | NCEP/NWS polar-stereographic charts true at 60 N. |
| script.md:229 | Brest 48.4 N 4.5 W; Iceland ≈ 65 N 19 W; Greenland ≈ 72 N 40 W; Longyearbyen 78.2 N 15.6 E; Barents Sea ≈ 75 N 40 E; Bering Strait "near a hundred and eighty"; Alaska ≈ 65 N 150 W; Hudson Bay ≈ 60 N; LA 34 N 118 W | OK | Atlas positions (Bering Strait 66 N 169 W — "near 180" is fair on a polar map). |
| script.md:235 | "About thirty kilometres up, in the stratosphere … ten hectopascals, about a hundredth of the pressure at the ground" | OK | 10 hPa ≈ 31 km (US Std Atm). |
| script.md:235 | 21 Jan 2026 10-hPa heights 28.6 km min over the Barents Sea, 30.7 km at 30 N; winds ≈ 80 m/s over Siberia | OK (consistency) | NCEP/NCAR R1 (source line), builder rows. |
| script.md:241 | "far wider: thousands of kilometres across, instead of about a hundred" | **MISLEADING** | Summary row 7. TCR: Ian RMW 20 n mi at landfall with a "large storm size"; tropical-storm winds extended ≈ 140 n mi. |
| script.md:241 | polar vortex "forms because the polar stratosphere cools in the long winter night" | OK | Standard (radiative cooling in polar night). |
| script.md:251 | vortex centre 72.9 N 44.3 E, ≈ 1900 km from the pole; ring ratios 1.9 / 0.4 | OK (consistency) | Builder rows. |

## The gradient — `ch00_gradient`

| file:line | Claim (quoted) | Verdict | Source / proposed rewrite |
|---|---|---|---|
| script.md:86 | ERA5 850 hPa over Brittany, "six in the evening on the first of November twenty twenty three, as Storm Ciarán approaches"; ∂T/∂x −3.2, ∂T/∂y −2.5 °C/100 km; 4.1; 230° | OK (numbers, consistency) / **MISLEADING** (time zone, minor) | Data `build_ch00_gradient.py`. Add "universal time" (summary row 11). |
| script.md:122 | "Mont Blanc, the highest peak in the Alps, on the border of France and Italy" | OK | (Summit border is disputed between France and Italy; "on the border" is the usual phrasing.) |
| script.md:122 | "Chamonix sits at about one thousand and thirty five metres. The summit, at about four thousand eight hundred and six metres, is about ten kilometres to the south" | OK | Builder cites the 2021 survey 4805.59 m; Chamonix ≈ 1035 m; Chamonix (45.92 N) → summit (45.83 N) ≈ 9.7 km S. |
| script.md:122 | on-screen "Terrain: ETOPO 2022 (NOAA) · imagery: Copernicus Sentinel-2 · 26 Sep 2023" | OK | |
| script.md:128 | "the Ganges plain, about fifty metres above sea level, to the Tibetan plateau, almost five thousand metres up" | OK | Plateau mean ≈ 4500–5000 m; plain near Nepal ≈ 50–100 m. |
| script.md:134 | "launched from Singapore, an island city at the southern tip of the Malay Peninsula … half past seven in the morning, local time, on the first of November, twenty twenty-three … thirty three metres above sea level … twenty seven point seven … sixteen point two kilometres … minus eighty one point three" | OK (consistency) | IGRA v2 Singapore Changi 48698, 00 UTC sounding (released ≈ 23:30 UTC = 07:30 SGT); builder row DG15s (33 m, 27.7 °C, 1008.5 hPa). |
| script.md:134 | "over Europe, where it's usually somewhere between about ten and thirteen kilometres up" | **MISLEADING** | Summary row 8 (mid-latitude tropopause ≈ 10–12 km, polar-side Europe ≈ 8–9 km in winter). |
| script.md:176 | "At sea level it's about a thousand and thirteen hectopascals" | OK | Standard atmosphere 1013.25 hPa. |
| script.md:200 | "Storm Ciarán at three in the morning on the second of November … centre, at about nine hundred and fifty four hectopascals … about two hundred kilometres north of Brest … isobars … thirty one kilometres apart" | OK (consistency) / **MISLEADING** (time zone, minor) | ERA5 msl 03 UTC, centre 953.6 hPa (storyboard l.106). Add "universal time" (row 11). |
| script.md:206 | "At Brest airport that same hour, a gust of eighty four knots was measured, about a hundred and fifty six kilometres per hour" | OK | ISD Brest 03 UTC 911-group 84 kt (builder DG26); 156 km/h at Brest-Guipavas (Météo-France via press, above). |
| script.md:206 | "More than a million homes in France lost power" | OK | Enedis: ≈ 1.2 million homes without power (builder note; widely reported 2–3 Nov 2023). |
| script.md:212 | Coriolis to the right in NH; geostrophic balance; friction lets the wind cross towards the low | OK | |
| script.md:218 | GFS 18 UTC 27 Oct 2026, low ≈ 961 hPa just east of Iceland; ≈ 10 hPa/100 km; ≈ 25 m/s | OK (consistency) | Builder data (NOAA NCEP GFS analysis). |
| script.md:224 | upward ∂p/∂z ≈ 0.11 hPa/m; ρ ≈ 1.17; ρg ≈ 11.5 Pa/m; ≈ 850× / ≈ 10,000× | OK | |
| script.md:230 | front gradient ≈ 11 °C/100 km vs ≈ 1 | OK (consistency) / **MISLEADING** (time zone, minor) | Builder row DG32 (max 11.37 at 49.0 N 12.5 W). Add "universal time" (row 11). |
| script.md:236 | "a strong cold front over the central United States, on the twenty second of December twenty twenty two" | OK | The Arctic front of the 21–23 Dec 2022 North American winter storm (NWS); source line "ERA5 · 22 Dec 2022, 12 UTC". |
| script.md:242 | Brest wind 34 m/s, 138° to ∇T, −3.7 °C/h advection → warming | OK (consistency) | |
| script.md:248 | Normandy coast, "one in the afternoon on the twenty fourth of June twenty twenty four"; 24.6 °C vs 16.1 °C, 55 km | OK (numbers) / **MISLEADING** (time) | Source line "MODIS Aqua (GIBS) · data: ERA5 · 24 Jun 2024, 13 UTC" = 15:00 CEST. Summary row 3. |
| script.md:248 | sea-breeze mechanism | OK | |
| script.md:254 | Sep 2026 zonal mean: strongest poleward temperature drop near 45 N, ≈ 6 °C/1000 km; jet ≈ 12 km, ≈ 26 m/s; GFS 28 Oct 2026 jet 66 m/s ≈ 240 km/h | OK (consistency) | Rendered source lines `gr_sD.tsx:464–465`. |
| script.md:260 | "the Gulf Stream carries warm water from the tropics towards the north-east … on the twenty ninth of October twenty twenty six, the sea-surface temperature dropped by about six and a half degrees in about thirty five kilometres. That's one of the sharpest temperature gradients in the open ocean. Winter storms often deepen fastest near it" | OK | NOAA OISST v2.1 29 Oct 2026 (builder); Gulf Stream north wall is the textbook sharpest open-ocean SST front; explosive cyclogenesis maxima lie over it (Sanders & Gyakum 1980). |
| storyboard l.2156 | "'Data: ERA5 monthly (Copernicus C3S) · Nov 2023'" | **WRONG** (stale, not rendered) | Summary row 13. |

---

### Method notes

* Web sources used: NHC TCR AL092022 (PDF, text extracted locally), IMD Amphan report (via odishabytes summary), Wikipedia
  (Amphan, Sidr, Aila, Nargis, Idai, Prime meridian), Crossref (DOI metadata), Météo-France/press on Ciarán gusts.
  IBTrACS values were read from the project's own `cs.json` (WMO column = RSMC New Delhi 3-min for the North Indian Ocean,
  RSMC La Réunion 10-min for Idai).
* Computed here: great-circle/rhumb numbers (London–Los Angeles, Brest–Lisbon, vertex), 48.4 N country crossings
  (Natural Earth 1:110m via cartopy), Equal Earth angular distortion (pyproj), distances Khulna–landfall, Fort Myers Beach–St Petersburg.
* Not checked: derivation arithmetic; old pre-fix numbers quoted in storyboard `feedback:` history (e.g. flat ''37 m/s'', ''12.5 in''), which the
  rendered `.tsx` no longer uses.
