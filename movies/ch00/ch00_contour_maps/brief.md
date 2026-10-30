# ch00_contour_maps — brief (movie-director, 2026-10-30)

Series plan v3 (`movies/ch00/series_plan_v3_proposal.md`) **M01 "Contour maps and isolines"**. **Re-scoped on 2026-10-30 by the
coordinator** (series re-plan v4: weather understanding before map reading): keep it to **contours and isolines as a concept**
(height on contour maps, isobars, isotherms, terrain) with **no forecasting claims**; v4 sets its place in the order. So the v3
scope items isohyets, isotachs and isopycnals are **named only** (s23, with their Greek roots), and no forecaster's reading
(weather along troughs, fair weather under ridges, "watch this") is said anywhere.

Prerequisites it may use: #5 coordinates (latitude, longitude, projections), #6 gradient (gradient ⟂ contours, spacing →
strength, pressure-gradient force), 0.3 weather basics (pressure, sea-level pressure, isobars named, reanalysis). It stands on
its own: each is recalled in a sentence where it is used.

House style `movies/HOUSE_STYLE.md` is binding, including §5b: house globe with the v5 zoom-reveal numbers for the two zoom
tours (s06 Fuji, s11 Everest; each names the place and its surroundings, centres and labels every named place within 1 s,
and zooms back out); source lines below pictures; colour bars beside maps; every wind streak animated; no text over pictures or
text; no extra titles. **Layer stack: none.** The two 3-D moments (Fuji sliced into contours, the 500-hPa sheet sliced into
isohypses) are single surfaces cut into lines; a stack would add length, not insight. Ending: the weather/climate ending
(§3), word for word, with "contour maps" as the concept.

## The promise (s00)
"In this video, we'll learn contour maps and isolines the easy way, and see how meteorology uses them to draw pressure,
temperature and height on a map." Title 'Contour' / 'maps' / 'made easy' / 'and how meteorology uses them'.

## Real moments (data on disk unless marked; numbers read 2026-10-30, every one a CHECK row)
1. **ERA5, 2 Nov 2023 12 UTC, North America and the western Atlantic** (12-68 N, 130-20 W; Ciarán, over Europe, is outside
   the frame): H 1034 near Virginia, H 1030 Azores, L 985 Hudson Bay, L 991 east of Newfoundland; a clean **col south-east of
   Bermuda at about 1018 hPa** with a 3 m/s wind; 6.4 vs 1.1 hPa per 100 km and 18 vs 7 m/s for crowded vs open isobars.
2. **The same hour at 500 hPa**: heights from 4916 m (Hudson Bay) to 5973 m (subtropical Atlantic); trough over eastern North
   America, ridges west and over the Atlantic.
3. **Mount Fuji and Suruga Bay** (new: Copernicus DEM GLO-30, ETOPO 2022 15″): slicing into 500-m contours; 200-m spacing
   ≈ 350 m near the summit vs ≈ 2 km low down (planning values, measured by the builder); the coast as the zero contour; Suruga
   Bay to about −2500 m within 100 km of a 3776-m summit.
4. **Everest, Lhotse, the South Col and the Khumbu valleys** (new: Copernicus DEM): peak, ridge, valley, col (≈ 7900 m).
5. **ERA5 January 2-m temperature, 1991-2020** (new: CDS monthly means): the 0 °C isotherm at about 40° N over the US Midwest
   and about 70° N off Norway.

## What is taught (28 scenes; measured 21:17.3)
| Block | Scenes | Idea |
|---|---|---|
| Title, hook | s00-s01 | promise; question |
| Building blocks | s02-s05 | a field as numbers → colour or lines; the isoline built by interpolation (½, ¼); four rules; contour interval, values between lines, 1 / 4 / 10 hPa, filled bands + stepped colour bar |
| Intuition (terrain) | s06-s13 | globe tour to Fuji; slicing a real mountain; spacing = steepness and the walker; a profile from contours; the gradient from interval / spacing (link to #6); coast = zero contour and isobaths; globe tour to Everest; peaks, ridges, valleys, basins; the South Col (saddle) |
| Why | s14 | three good reasons: whole shape at a glance, gradient for free, room for more fields |
| Application (concept) | s15-s22 | the chart; isobars; highs and lows; ridges and troughs; a col of pressure; crowded isobars and strong winds; a practice read with a prediction pause; isotherms (January climate); isohypses on the 500-hPa surface (3-D sheet sliced as at Fuji) |
| Names, recap, end | s23-s25 | the iso- family with Greek roots; "To sum up"; weather/climate end card |

## Why motion beats a still figure here
The idea of a contour is a *cut*: watching level sheets slice a real mountain and the lines lift off is the one picture that
makes every later contour map readable; the same move on the 500-hPa sheet turns "geopotential height" into "terrain in the
sky". Animated interpolation ticks (½, ¼) show how a line is built from grid numbers, and the globe tours tie each map to a
real place.

## Reused code and kit
`movies/src/house/kit/{frame,bbox,col3d,stack3d,wind,globecam,three3d,title,tex,notes,extras,icons}`; the house globe from the
cross-product v5 s33 (`GlobeView` + `Vignette`); `tools/maptools/cartostyle.py` for the chart (isobar labels, H/L, colour
bars); map-toolkit recipes for the relief maps (cartopy primary, PyGMT runner-up).

## Open questions for the orchestrator
1. Place in the v4 order, and whether M01 keeps the v3 map-block id (the end card names no position, so nothing changes).
2. Terrain drape: hypsometric tint + hillshade (planned, clearest for contours) or a Sentinel-2 photo drape (D4, optional).
3. Lexicon: the proposed entries in data_needs.md §E (Suruga, Lhotse, Khumbu, iso- words) after one listening check.
