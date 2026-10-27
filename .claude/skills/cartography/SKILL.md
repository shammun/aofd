---
name: cartography
description: Publication-grade cartography for every aofd map - static maps, animated map frames, maps draped on 3-D globes or terrain, in movies (1920x1080, house-dark), notebooks and print - the pre-flight checklist run on every map, rules per map kind (synoptic chart, satellite + analysis overlay, relief/locator, climatology, anomaly, globe/3-D terrain), movie vs print settings (type sizes, line weights in px, viewing distance), label rules (halos, Imhof position order, priority classes, collision avoidance, label budgets, Natural Earth places with English exonyms, leader lines), projection choice per extent, colour rules (cmocean/ColorBrewer, no rainbow, diverging centred on zero, colour-blind safety), meteorological chart conventions (WMO/NWS fronts, H/L with central pressure, 4-hPa isobars with in-line labels, wind barbs, station models), scale bars, north arrows, graticules, legends and colour bars, insets, generalisation, and how each toolkit tool achieves them (cartopy + tools/maptools/cartostyle.py, PyGMT, QGIS PAL, three.js / Remotion labels, MapLibre symbol layers), with a worked before/after of the S1 Ciarán synoptic map. Load together with map-toolkit for any map.
---

# cartography: maps that read at a glance and survive a professional's eye

The **tool** is chosen with `map-toolkit` (data + tool + why + runner-up). This skill decides **how the map looks
and reads**. The house helper for matplotlib/cartopy is `tools/maptools/cartostyle.py` (API in §9a); the movie look
is `movies/HOUSE_STYLE.md` (it wins on type sizes, colours, layout and "no references on screen").

## 0. When to load
Any map, map frame, map texture, globe or terrain scene: in a movie (`motion-graphics`), explainer or scene
(`interactive-viz`, `viz3d`), data figure (`figure-reproduction`) or notebook (`python-viz`). Also at review: a
reviewer runs §1 on every map frame.

## 1. Pre-flight checklist (run on every map; write the answers in the storyboard or figure notes)
**Purpose**
1. One sentence: *what must the viewer see first, second, third?* (e.g. "the deep low over England; then how tight
   the isobars are; then where Brest is"). Everything else is background or goes.
2. Is a map needed at all? A ranking or time series by region is a chart, not a map.

**Frame and projection**
3. Projection chosen for the extent and purpose (§5) and named in the notes. Conformal for flow/weather, equal-area
   for anything compared by area. Never Web Mercator for a regional or world thematic map.
4. Frame filled: no empty wedge corners or white bars from a conic extent (`cartostyle.new_map(fill_frame=True)`),
   data fetched with a margin so the whole frame has data.
5. Movie: everything that carries meaning sits in the content area y 40-860; the caption band y 880-1040 holds
   **no labels or symbols** (the map itself may bleed under it).

**Hierarchy (figure-ground)**
6. Draw order = importance: field (quiet) < land veil < graticule < coast < borders < barbs < isolines < fronts <
   H/L < labels. The subject has the strongest contrast; reference layers are thinner, lighter, dashed.
7. Land and sea are distinguishable even under a translucent field (land one value step lighter, or a 6-10 %
   white veil above the field on a dark page).
8. Generalisation matches the scale: Natural Earth 1:10m when < ~25 deg longitude spans 1920 px, 1:50m up to
   ~110 deg, 1:110m beyond (`natural_earth_scale`). No 10m coastline wiggle on a hemisphere.

**Labels**
9. Every label >= the type floor (movie 44 px, print 6.5 pt), has a halo, is upright (rotation within +-90 deg),
   is inside the frame, and overlaps nothing (`cartostyle.audit(fig, st)` returns `[]`).
10. Label budget respected (movie: <= 8 place names, <= 10 isoline numbers, <= 1 name per 480x270 px cell).
11. Dropped labels are dropped, never forced; the report says which and why (`LabelReport.dropped`).
12. Place names are English exonyms from Natural Earth; the story's places are promoted (rank < 0).

**Colour and legend**
13. Colour map perceptual and colour-blind safe; no jet/rainbow/turbo/hsv/Spectral (`check_cmap`). Diverging only
    around a meaningful centre (0 for anomalies), with symmetric limits (`centered_limits`).
14. Colour bar present for any shaded field; label "quantity (unit)" (movie: the unit only, horizontal, above the
    bar, because the narration names the quantity); ticks at round values >= the type floor.
15. Meaning never by hue alone: H/L letters, front symbols, dashed negatives, signed numbers.

**Honesty**
16. Scale bar only where the scale varies < ~6 % over the map, labelled with its latitude ("1000 km (at 50 deg N)");
    none on continental/world maps. No north arrow on graticuled or small-scale maps (§7).
17. Exaggerations (vertical x N, "interpolated" frames) recorded in the manifest (movies: said in narration, no
    badge); every layer traces to a dataset or tested function with its credit (sidecar `credit_line`).
18. Open the PNG at 100 % and at 640 px wide and look at it. A map is finished when the exported file was looked
    at, not when the save call returned (adopted from TerraLab `cartography`).

## 2. Rules per map kind

### 2a. Synoptic chart (surface analysis)
- **Isobars every 4 hPa** (NWS Unified Surface Analysis Manual, 2006; intermediate 2-hPa only in weak gradients,
  dashed). Optional heavier 1000 hPa line. In-line labels with the **full value** ("996", not "96": the viewer is a
  beginner), upright, on straight stretches, spaced ~ 0.3-0.4 of the frame width apart, never two on one short
  closed isobar, never on the centre's innermost rings (`isobar_labels`).
- **H and L** centred exactly on the extremum, bold, blue H / red L (NWS/WMO convention; house: `#7fb2ff` /
  `#ff7a8a` on dark), **central pressure directly below** in the same colour (above or right only if blocked).
  These are the top priority labels: places under them are dropped, not the letters.
- **Fronts** (WMO GDPFS Manual App. II-4; NWS): cold = blue line with triangles, warm = red with semicircles,
  occluded = purple with both on the same side, stationary = alternating red semicircles / blue triangles on
  opposite sides, trough = dashed (brown/orange), no text labels on cold/warm/troughs (NWS). Symbols point the way the
  front moves: cold-front triangles into the warm air, warm-front scallops into the cold air (`front_flip` uses an
  850-hPa temperature). Give fronts a dark casing on a coloured field. Fronts are obstacles for labels (names) but
  not for place dots.
- **Wind**: barbs in knots on a regular grid in the *projected* plane (cartopy `regrid_shape`), staff pointing to
  where the wind comes from; half barb 5 kt, full 10 kt, pennant 50 kt (WPC station-plot guide; WMO: 2.5 / 5 /
  25 m/s). Barbs are secondary: muted colour, ~58 px shafts in a movie, ~15x8 across a 1080p frame. For a beginner
  audience prefer **arrows or streamlines** in teaching scenes and keep barbs for "what a forecaster sees" scenes,
  where the narration explains them. Station models only with a legend scene that builds them up.
- Shaded MSLP is optional; if used, it is quiet (alpha 0.45-0.6, 2-hPa bands, no grid artefacts: use `contourf`, not
  translucent `pcolormesh`), with a colour bar.

### 2b. Satellite image + analysis overlay
- Imagery is the subject: no shaded field on top; overlays are lines only.
- Lines and labels on imagery: **white (or a light tint) with a dark semi-transparent halo**
  (`rgba(0,0,0,0.75)`), never black lines/white halos (adopted from MapLibre `maplibre-cartography`).
- Coast at 2-3 px light grey; isobars white 2.5 px at 80 % opacity; fronts keep their colours plus a dark casing.
- Fill no-data swaths (orbit gaps) with the page colour and say "no image" in the notes; never stretch.
- Credit: NASA GIBS/Worldview, GOES/Himawari, Copernicus Sentinel <year>.

### 2c. Relief / locator map
- Hillshade (azimuth 315, altitude 45) multiplied under a hypsometric tint at 40-60 % (cmocean `topo` diverging at
  sea level, or a muted land ramp). Water flat and quiet. Vertical exaggeration stated.
- Labels: settlements upright sans; water features **italic, letter-spaced, light blue** (`label_area`); mountain
  ranges letter-spaced capitals following the range; rivers along the river (curved, never upside down, repeated on
  long rivers).
- A **locator inset** (orthographic globe with the box, `locator_inset`) whenever the viewer may not know where the
  place is; the main map's box drawn in gold.
- Scale bar allowed (large scale); north arrow only if north is not up.

### 2d. Climatology map
- Equal-area projection for global fields (Equal Earth), Albers/LAEA regional.
- Sequential perceptual map (cmocean thermal, haline, rain, dense; viridis family); contour lines at round values
  over the shading with sparse in-line labels; colour bar with units and the **period and base** in the caption
  ("1991-2020 mean").
- Name the big features (Azores High, Icelandic Low, ITCZ) as area labels, letter-spaced, not as point labels.

### 2e. Anomaly map
- Diverging map (cmocean `balance`, ColorBrewer RdBu reversed) **centred on zero with symmetric limits**; white or
  near-page at zero; negative contours dashed, zero contour bold or omitted; the base period stated.
- Colour bar ticks symmetric (-3 ... 0 ... +3) with "+" signs. Saturate (extend arrows) rather than let one extreme set
  the range.

### 2f. Map on a globe or on 3-D terrain
- **Draped** (in the texture): coast, borders, graticule, fields, isolines. Type is *not* draped: draped text shears and
  shrinks on a curved or tilted surface and becomes illegible near the limb or at low elevation angles.
- **Billboarded** (screen-aligned, constant pixel size): place names, H/L, values. Anchor each billboard on the surface
  point, offset it by a fixed screen distance, and hide it (fade, not pop) when its anchor is on the far side
  (dot(normal, view) < 0.15) or occluded by terrain (depth test against the scene, or a ray-cast).
- Exception: a **long feature name** (a mountain range, an ocean) may follow the surface as a draped curve if it
  is large on screen at every camera position of the shot.
- Labels never closer than 6 % of the frame to the globe limb. Re-run the label collision pass **per frame**
  (screen-space boxes), with hysteresis (a label keeps its slot for >= 0.5 s) so labels do not flicker.
- Vertical exaggeration recorded in the manifest and said in narration; the terrain colour ramp keeps its meaning
  (no lighting that inverts valleys).

## 3. Movie vs print settings
| | movie (1920x1080, dpi 100, house-dark) | notebook / web (1600x1000) | print (180 mm, 300 dpi, light) |
|---|---|---|---|
| viewing | laptop at ~60 cm, phone at ~35 cm: 44 px x-height ~0.35-0.5 deg of visual angle | screen ~60 cm | page at ~40 cm |
| type floor | **44 px** (HOUSE_STYLE §5) | 13 pt-equivalent | 6.5 pt |
| H / L letter | 120 px bold, value 54 px bold | 64 / 28 px | 16 / 7.5 pt |
| place names | 50 px semibold (capitals, story places), 44 px regular | 28 / 24 px | 8 / 7 pt |
| isoline numbers | 44 px | 22 px | 6.5 pt |
| colour-bar ticks and label | 52 px | 24 px | 7 pt |
| coast / border / admin-1 | 3.0 / 1.8 dashed / 1.0 dotted px | 1.6 / 1.1 / 0.7 px | 0.5 / 0.35 / 0.25 pt |
| isolines / major | 2.6 / 4.2 px | 1.6 / 2.8 px | 0.6 / 1.0 pt |
| front line / symbol | 5 / 26 px | 3.2 / 16 px | 1.2 / 5 pt |
| barbs | 2.6 px, shaft 58 px | 1.3 px | 0.4 pt |
| graticule | 1.2 px, `#3a4663` | 0.8 px | 0.25 pt |
| halo | 16 % of the type size, page colour at 85 % | same | same, white |
| place-label budget | 8, one per 480x270 px cell | 14 | 14 |
| title / credit on the map | **none** (the movie has no headings; credits go in the manifest and end card) | title in the cell above | title + credit line on the figure |
`cartostyle.style("movie" | "notebook" | "print")` holds these numbers; `st.px(n)` converts pixels to points.

## 4. Label rules
**Halos.** Every label on a map gets a halo: a stroke in the page colour, ~16 % of the type size, 85 % opaque
(`halo(st, size_px)`). Opaque white halos on a varied background look like stickers: keep them semi-transparent
(MapLibre skill). On imagery: white text, dark halo.

**Position order for point labels (Imhof 1975; Yoeli 1972).** Try upper-right first, then lower-right,
upper-left, lower-left, then right, left, above, below. A coastal place keeps its name on the land side when
possible; a name never straddles a coastline or a front if any other slot is free.

**Line labels.** Along the line, upright, on the straightest stretch, centred on a gap cut into the line (inline);
for rivers/fronts curved along the line (QGIS curved placement, GMT quoted lines), repeated every ~0.35 of the frame
on long lines, never on steep (> 60 deg) stretches when a flatter one exists.

**Area labels.** Letter-spaced, centred on the area's visual centre (pole of inaccessibility, not the centroid), spread
along the area's long axis, italic for water.

**Priority classes** (process in this order; each placed label becomes an obstacle for the next class):
1. Fixed furniture: colour bar, title/credit (print), caption band (movie).
2. Data-fixed symbols: H/L letters and values.
3. The story's places (rank < 0): with a **leader line** fallback if no adjacent slot is free.
4. Scale bar (first free corner).
5. Isoline numbers.
6. Other places by Natural Earth `scalerank`, capitals first, then population.
Fronts block names (not dots). Lines (isobars, coast) do not block: the halo handles them.

**Collision avoidance.** Greedy in priority order with real text extents (measured with the renderer), padded by the
halo; a density grid caps names per cell; anything that does not fit is dropped and reported. For dense
labelling in print, a second pass with simulated annealing or `adjustText` may move labels (with leaders);
movies never use force-directed jitter (labels must not move between frames).

**Animated maps.** Labels are placed once per shot on the frame where the map is busiest and then **held**; a label
that must disappear fades over >= 8 frames. Isoline numbers on a changing field are re-placed only at cuts, or
use a few fixed anchor labels that travel with their isoline.

**Places: sources and choices.**
- Natural Earth 1:10m populated places "simple" (`raw/NE-10m-places/ne_10m_populated_places_simple.zip`,
  public domain; `load_places`): the `name` field gives English exonyms for major cities (Munich, Lisbon,
  Naples); fall back to `nameascii`; fix the few local forms by hand (København -> Copenhagen) and list the fixes.
- Admin names from Natural Earth admin-0 / admin-1 (`raw/NE-10m-admin`); physical names (seas, ranges) from Natural
  Earth physical labels when needed.
- English exonyms throughout (Munich, not München), local diacritics kept where English uses them (Reykjavík,
  Ciarán). Disputed names/borders: use Natural Earth's default view and do not draw a border the story does not
  need.
- Never more names than the narration and the reading need. A name that the voice never mentions and that does not
  help locate the story is clutter.

## 5. Projection by extent (`choose_projection(bbox, purpose)`; Snyder 1987; Jenny 2012; Mapsuke skill)
| extent | conformal (weather charts, flow, fronts) | equal-area (climatology, totals, comparison) |
|---|---|---|
| world | none acceptable: use Equal Earth and say shapes are bent | **Equal Earth** (Šavrič et al. 2019); Robinson as compromise |
| hemisphere / continent (> 100 deg longitude) | LAEA centred (accept angle distortion) or polar stereographic | **Lambert azimuthal equal-area** centred |
| polar (reaches > 65 deg, centre > 55 deg) | **polar stereographic**, true scale 60 deg (WMO practice) | polar LAEA |
| mid-latitude region | **Lambert conformal conic**, standard parallels at 1/6 and 5/6 of the latitude range (WMO/JMA, NWS) | **Albers** conic, same parallels |
| tropics (all within +-25 deg) | **Mercator** (WMO practice near the equator) | cylindrical equal-area |
| globe look | orthographic centred on the subject | - |
Web Mercator only for slippy web maps; never for wide thematic maps. State the projection in the notes (print: in the
caption). Centre the projection on the subject (central meridian = the subject's longitude) so north is up there.

## 6. Colour rules
- Sequential: cmocean (`thermal`, `haline`, `dense`, `ice`, `rain`, `speed`, `deep`, `topo`), viridis family,
  ColorBrewer single-hue for classed maps (Harrower & Brewer 2003; Thyng et al. 2016).
- Diverging: cmocean `balance`, `curl`, `diff`; ColorBrewer RdBu/BrBG; centred, symmetric.
- Banned: jet, rainbow, turbo, hsv, nipy_spectral, gist_ncar, Spectral, prism, flag (Crameri et al. 2020; CLAUDE.md
  rule 5). `check_cmap` raises.
- **Dark page:** the emphasised end of a ramp must be the **bright** end (MSLP on house-dark: `ice_r`, low = bright).
  On a light page the emphasised end is dark (MSLP: `dense_r`). `cmap("pressure", st)` picks by page brightness.
- Colour-blind safety: avoid red/green pairs for a distinction; check with a deuteranopia simulation; carry the
  meaning in shape/text too. Text contrast >= 4.5:1 against its halo (WCAG AA; Mapbox and MapLibre skills).
- Reserve hues: front colours (red, blue, purple) are not used for anything else on a synoptic chart; the house
  palette roles (teal first vector, orange second, rose negative, gold pointer) keep their meaning on maps.
- Missing data: its own neutral (page colour or hatching), explained; never the lowest class colour.

## 7. Graticules, scale bars, north arrows, legends, insets, data-ink
- **Graticule**: faint, thin, 4-6 lines across (10 deg on a synoptic map); labels only in print/notebook, outside the
  map frame or at the edges; never in the movie unless a scene teaches latitude.
- **Scale bar**: only on large/medium-scale maps where the scale factor varies < 6 % over the map
  (`scale_bar` refuses otherwise); measured geodesically at a stated latitude; round lengths (500, 1000, 2000 km).
  On a continental or world map a single bar is wrong almost everywhere: omit it (or use a scale graph by latitude).
- **North arrow**: omit when a graticule is shown, when north is up and obvious, and on any small-scale map (on a
  conic or azimuthal map "north" changes direction across the map, so one arrow misleads). Use one only on a rotated
  large-scale map.
- **Legend / colour bar**: every symbol that needs explanation, nothing that does not (no legend entry for the
  coastline). Movie legends are built by the narration (the front symbols are introduced on screen once, in their
  own scene) rather than boxed keys.
- **Insets / locators**: a small globe or regional map with the main frame drawn on it, top-left or top-right
  away from the subject.
- **Data-ink** (Tufte 1983): remove frames, ticks, boxes and grid that carry no data; no drop shadows; one font
  family (house Segoe UI stack), two weights.

## 8. Meteorological chart conventions (summary)
| element | convention | source |
|---|---|---|
| isobars | every 4 hPa, labelled in-line (full value for beginners), 1000 hPa may be heavier | NWS USA manual 2006 |
| H / L | letter on the centre, central pressure in hPa under it, same colour (H blue, L red) | NWS / WMO practice |
| cold / warm / occluded / stationary | blue triangles / red semicircles / purple alternating same side / red-blue alternating opposite sides | WMO GDPFS App. II-4; NWS; MetPy `ColdFront`, `WarmFront`, `OccludedFront`, `StationaryFront` |
| trough, squall line, dry line | dashed; red two-dot-dash; brown scalloped | NWS USA manual |
| wind barbs | staff toward the source; half 5 kt, full 10 kt, pennant 50 kt; calm = circle | WPC station plot; WMO |
| station model | temperature upper-left, dew point lower-left, pressure upper-right (3 digits), sky cover circle | WPC station plot guide |
| projection | LCC mid-latitudes, polar stereographic high latitudes, Mercator tropics | WMO practice; Mapsuke skill |

## 9. How each tool achieves this

### 9a. matplotlib + cartopy (+ MetPy): `tools/maptools/cartostyle.py`
```python
import sys; sys.path.insert(0, "tools/maptools"); import cartostyle as cs
st = cs.style("movie")                                   # or "notebook", "print"
fig, ax, choice = cs.new_map(bbox, st, fit="content")    # projection by extent, frame filled, region in content box
cs.fill_land(ax, land_gj, st); cf = ax.contourf(..., cmap=cs.cmap("pressure", st), alpha=0.6, zorder=1)
cs.fill_land(ax, land_gj, st, color="#ffffff", alpha=0.08, zorder=2)   # land veil (dark page)
cs.draw_lines(ax, coast_gj, st, "coast"); cs.draw_lines(ax, border_gj, st, "border")
cs.wind_barbs(ax, lon, lat, u_kt, v_kt, st)
iso = ax.contour(..., levels=range(948, 1040, 4), colors=[st.colors["contour"]])
used, front_boxes = cs.draw_fronts(ax, fronts_geojson, st, temperature=(lon850, lat850, t850))
cb = cs.colorbar(fig, cf, st, "hPa", ticks=range(950, 1041, 20))
hl = cs.mark_extrema(ax, cs.find_extrema(lon, lat, msl, bbox) or centres, st, obstacles=[...colour bar boxes])
story = cs.label_points(ax, story_places, st, obstacles=hl.boxes, label_obstacles=front_boxes)
sb = cs.scale_bar(ax, st, bbox, obstacles=story.boxes)               # None when it would mislead
iso_rep = cs.isobar_labels(ax, iso, st, obstacles=story.boxes + front_boxes)
rest = cs.label_points(ax, other_places, st, obstacles=iso_rep.boxes, label_obstacles=front_boxes)
assert cs.audit(fig, st) == []; cs.save(fig, out_png, st)            # deterministic PNG
```
Other helpers: `natural_earth_layer(zip, bbox)` (clip any NE shapefile from the G: raw store), `natural_earth_scale`,
`load_places`, `label_area` (water/region), `graticule`, `locator_inset`, `halo`, `line_halo`, `centered_limits`,
`check_cmap`, `barb_length` (barbs grow with length**2: length 7 -> 39 px at dpi 100), `scale_factor_range`.
Pitfalls found: matplotlib `barbs(length=)` is not a length (use `barb_length`); translucent `pcolormesh` shows a
cell-edge grid (use `contourf`); `clabel` may write numbers upside down on cartopy axes (the helper flips them);
an annotation's window extent includes its leader line (measure the text only); `set_extent(lonlat)` on a conic leaves
empty wedges (use `new_map`). `adjustText` is not installed; the greedy placer is deterministic, which movies need.
The `mpl` adapter uses the helper only when a recipe sets `style.cartostyle: movie|notebook|print` (self-test
references are unchanged without it).

### 9b. PyGMT (`pygmt` adapter, GMT 6.7)
- Frame: `fig.basemap(region=..., projection="L-5/50/38.5/60.5/18c", frame=["af", "+n"])` (Lambert conic with the
  1/6-5/6 parallels; `+n` no axes for movies); graticule `frame=["xa10g10", "ya10g10"]` faint via
  `MAP_GRID_PEN_PRIMARY="0.25p,#3a4663"`.
- Fonts and pens: `pygmt.config(FONT_ANNOT_PRIMARY="12p,Helvetica,#e8ecf4", MAP_FRAME_PEN="0.5p")`; a halo is a
  font pen drawn first: `fig.text(x, y, text, font="16p,Helvetica-Bold,#e8ecf4=~2p,#0f1420")` (`=~` outlines
  behind the fill).
- In-line contour labels: `fig.grdcontour(grid, levels=4, annotation="4+f11p,Helvetica,#f4ecd2=~1.5p,#0f1420+u+gwhite",
  label_placement="d8c")` (distance between labels; `+u` adds unit; `+e` for embedded/clipped lines). Quoted
  lines (`plot(style="qd8c:+l<text>+v")`) give curved labels along fronts and rivers.
- Fronts: `fig.plot(x, y, style="f1c/0.25c+l+t", pen="1.5p,blue", fill="blue")` (cold, triangles left),
  `+c` circles for warm, `+r`/`+l` side; occluded alternate with two passes.
- Scale bar: `fig.basemap(map_scale="jBL+w1000k+lkm+c50")` (`+c` = latitude where the scale is true).
- Colour bar: `fig.colorbar(frame=["xa20", "y+lhPa"], position="JMR+o0.5c/0c+w10c/0.4c")`.
- Label collisions: GMT has none for `text`; place with `cartostyle.label_points` on an equivalent cartopy axis
  and pass the chosen positions, or keep names few.

### 9c. QGIS (`qgis` adapter, PAL labelling engine)
```python
s = QgsPalLayerSettings(); s.fieldName = "name"; s.enabled = True
s.placement = Qgis.LabelPlacement.OrderedPositionsAroundPoint              # Imhof order
s.dataDefinedProperties().setProperty(QgsPalLayerSettings.PredefinedPositionOrder,   # 3.34: a data-defined property
                                      QgsProperty.fromValue("TR,BR,TL,BL,R,L,T,B"))
s.priority = 9                                    # 0-10 per layer; data-defined priority from scalerank
fmt = QgsTextFormat(); fmt.setFont(QFont("Segoe UI")); fmt.setSize(44); fmt.setSizeUnit(Qgis.RenderUnit.Pixels)
buf = QgsTextBufferSettings(); buf.setEnabled(True); buf.setSize(7); buf.setSizeUnit(Qgis.RenderUnit.Pixels)
buf.setColor(QColor("#0f1420")); buf.setOpacity(0.85); fmt.setBuffer(buf); s.setFormat(fmt)
s.obstacleSettings().setIsObstacle(True); s.obstacleSettings().setFactor(2.0)   # H/L and fronts: strong obstacles
layer.setLabeling(QgsVectorLayerSimpleLabeling(s)); layer.setLabelsEnabled(True)
```
- Line labels (isobars, rivers, fronts): `s.placement = Qgis.LabelPlacement.Curved` (rivers) or `Line` with
  `lineSettings().setPlacementFlags(Qgis.LabelLinePlacementFlag.OnLine)`, `repeatDistance` for long lines,
  `upsidedownLabels = QgsPalLayerSettings.Upright`, `maxCurvedCharAngleIn/Out = 25`.
  (Names in this section were checked against the installed QGIS 3.34.1 Python API on 2026-10-27.)
- Contour labels: label the contour layer with the level field, `OnLine` + a mask (`QgsTextMaskSettings`) to cut the
  line under the number.
- Engine: `QgsLabelingEngineSettings` -> `setFlag(Qgis.LabelingFlag.DrawUnplacedLabels, False)`,
  `setNumCandidatePositions(...)`; label priorities per layer; "Show all labels" off. The PAL engine is
  deterministic for the same project and canvas size.
- Ruled styling for coast/border/admin-1 hierarchy; hillshade renderer (315/45) with multiply blending.

### 9d. three.js scenes and Remotion (`@remotion/three`, house kit)
- **Billboard labels** = HTML/SVG overlay in Remotion or SDF text in three.js: `troika-three-text`
  (`Text` with `sdfGlyphSize`, `outlineWidth: "16%"`, `outlineColor: "#0f1420"`, `outlineOpacity: 0.85`) or a
  `THREE.Sprite` with a canvas texture rendered at the final pixel size (`sizeAttenuation: false`). Constant pixel
  size, anchored at the surface point, offset in screen space.
- Per frame: project anchors (`vector.project(camera)`), drop anchors behind the globe (dot(normal, toCamera) < 0.15)
  or occluded (raycast against terrain), run the same greedy placement as `label_points` on screen boxes, hold
  winners for >= 0.5 s, fade others over 8 frames. All of this is a pure function of the frame number.
- Draped content (coast, graticule, isolines, fields) goes into the texture (`kind: texture` recipe) or as line
  geometry slightly above the surface (`polygonOffset` / radius x 1.001) to avoid z-fighting; line widths via
  `Line2`/`LineMaterial` in pixels.
- Never drape type onto the globe texture except long, large area names; never let a label cross the limb.
- In Remotion 2-D map scenes (`MapPanel`, `CamTMap`), use the house `placeLabels` with the type scale of
  HOUSE_STYLE §5; numbers are spoken when they appear.

### 9e. MapLibre GL JS (`maplibre` adapter) symbol layers
```js
{ id: "places", type: "symbol", source: "places",
  layout: { "text-field": ["get", "name"], "text-font": ["Segoe UI Semibold"], "text-size": 44,
            "text-variable-anchor": ["bottom-left", "top-left", "bottom-right", "top-right"],   // Imhof order
            "text-radial-offset": 0.6, "symbol-sort-key": ["get", "scalerank"],              // priority
            "text-allow-overlap": false, "text-ignore-placement": false, "text-padding": 6 },
  paint: { "text-color": "#f4ecd2", "text-halo-color": "rgba(15,20,32,0.85)", "text-halo-width": 7 } }
```
- Isoline labels: `"symbol-placement": "line"`, `"text-rotation-alignment": "map"`, `"text-keep-upright": true`,
  `"symbol-spacing": 700`. On imagery: white text, `rgba(0,0,0,0.75)` halo.
- Insert data layers below the first symbol layer (`map.addLayer(layer, firstSymbolId)`); globe projection
  (`projection: {type: "globe"}`) for globe stills; fonts are served locally (no remote glyphs in final frames).
- MapLibre collision detection is per frame: for movie shots fix the label set (`text-allow-overlap: true` on a
  pre-chosen set) so labels do not pop as the camera moves.

## 10. Before vs after: S1 Ciarán synoptic map (12 UTC 2 Nov 2023, ERA5)
Files: `G:/Geophysical Fluid Dynamics/aofd-data/captests/S1_synoptic_map/cartopy_metpy_pro/`
(`s1_pro.py`, `s1_pro_movie.png`, `s1_pro_print.png`, `s1_before_after.png`, `s1_pro_audit.json`).

| problem in the original (`cartopy_metpy/s1_cartopy_metpy.png`) | rule | fix in the helper version |
|---|---|---|
| title clipped at the top edge; a title in a movie at all | §3, HOUSE_STYLE §5 | no title in the movie; print title placed first as an obstacle |
| white side bars and empty conic wedges (map not filling 16:9) | §1.4 | `new_map` fills the frame in projected coordinates |
| a cell-edge grid shows through the translucent `pcolormesh` | §9a | `contourf` 2-hPa bands |
| labels 13-16 px on a 1080p frame (floor 44) | §3 | 44-120 px by role; `audit` returns no problems |
| isobar numbers crowd the centre (956/960/964/968 stacked), some upside down, some cut | §2a, §4 | <= 10 in-line numbers on straight stretches, upright, outside the H/L boxes |
| "956" collides with the isobar labels; the L sits over a label | §4 priority | H/L placed first with their value; isobar numbers and names avoid them |
| barbs everywhere at full ink compete with the isobars | §2a | regridded, muted barbs; isobars lead |
| no place names: a beginner cannot tell where the storm is | §4 | Brest (the story) promoted, then capitals by Natural Earth rank, English exonyms |
| no colour bar, no units | §1.14 | house colour bar ("hPa" above it in the movie) |
| light theme in a dark-themed movie; low pressure dark-on-dark | §6 | house-dark; `ice_r` so the low is the bright subject |
| land and sea indistinguishable under the field | §1.7 | land veil above the field |
| no scale | §7 | "2000 km (at 49 deg N)" bar (scale varies 4.7 % over this LCC map) |
What it does **not** fix (data/analysis, not cartography): the automatic Hewson-TFP fronts are incomplete (a
human analyst would draw the occlusion and the main cold front further east); London and Paris lie under the L
and its value, so they are honestly dropped in the movie; the 1080p frame shows a wide fan of the conic, so
Europe is small (use a tighter region per shot, or zoom with the house `MapCamera`).

## 11. Sources
- Imhof, E. (1975) Positioning names on maps. *The American Cartographer* 2(2):128-144, doi:10.1559/152304075784313304.
- Yoeli, P. (1972) The logic of automated map lettering. *The Cartographic Journal* 9(2):99-108.
- Christensen, J., Marks, J., Shieber, S. (1995) An empirical study of algorithms for point-feature label placement.
  *ACM Transactions on Graphics* 14(3):203-232.
- Brewer, C. A. (2016) *Designing Better Maps*, 2nd ed., Esri Press; Harrower, M., Brewer, C. A. (2003) ColorBrewer.org.
  *The Cartographic Journal* 40(1):27-37; colorbrewer2.org.
- Thyng, K. M. et al. (2016) True colors of oceanography: guidelines for effective and accurate colormap selection.
  *Oceanography* 29(3):9-13, doi:10.5670/oceanog.2016.66.
- Crameri, F., Shephard, G. E., Heron, P. J. (2020) The misuse of colour in science communication. *Nature
  Communications* 11:5444, doi:10.1038/s41467-020-19160-7.
- Snyder, J. P. (1987) *Map Projections: A Working Manual*, USGS Professional Paper 1395, doi:10.3133/pp1395.
- Šavrič, B., Patterson, T., Jenny, B. (2019) The Equal Earth map projection. *IJGIS* 33(3):454-465,
  doi:10.1080/13658816.2018.1504949.
- Jenny, B. (2012) Adaptive composite map projections. *IEEE TVCG* 18(12):2575-2582, doi:10.1109/TVCG.2012.192.
- Tufte, E. R. (1983/2001) *The Visual Display of Quantitative Information*, Graphics Press (data-ink).
- NOAA HPC/OPC/TPC/HFO (2006) *Unified Surface Analysis Manual*,
  https://www.weather.gov/media/rah/NCStateStudents/handout.unified.sfc.analysis.manual.version.pdf (isobars every
  4 mb; front and boundary symbols; no text labels on fronts/troughs).
- WMO, *Manual on the GDPFS*, Appendix II-4 (chart symbols; wind barbs 2.5/5/25 m/s = 5/10/50 kt),
  https://old.wmo.int/extranet/pages/prog/www/ISS/Meetings/IPET-DRMM_Beijing2015/Documents/IPET-DRMM-III_Doc11-5_GDPFS_Manual_Appendix_II-4.pdf
- NOAA WPC station plot guide, https://www.wpc.ncep.noaa.gov/html/stationplot.shtml ; front codes,
  https://www.wpc.ncep.noaa.gov/html/fntcodes2.shtml
- MetPy front path effects, https://unidata.github.io/MetPy/latest/api/generated/metpy.plots.html (Plotting Surface
  Analysis example).
- Natural Earth, https://www.naturalearthdata.com (1:10m/50m/110m; populated places; public domain).
- QGIS User Manual, Labels properties, https://docs.qgis.org/3.34/en/docs/user_manual/style_library/label_settings.html
- MapLibre Style Spec, symbol layer, https://maplibre.org/maplibre-style-spec/layers/#symbol
- GMT `text`, `grdcontour`, quoted lines and fronts, https://docs.generic-mapping-tools.org/latest/
- troika-three-text (SDF text for three.js), https://github.com/protectwise/troika
**Ideas adopted from agent skills (read in full; nothing installed; credited):**
`maplibre/maplibre-agent-skills` `maplibre-cartography` (MIT): halo colour/width by basemap, imagery labels, layer
injection order. `mapbox/mapbox-agent-skills` `mapbox-cartography` (MIT): hierarchy tiers, WCAG text contrast.
`openai/plugins` `geospatial-and-cartographic-visualization` (MIT): "map or not", source/method ledger, screen-stable
vs map-space symbols, exact-location anchor dots. `TerraLabAI/geoai-skills` `cartography` (MIT): look at the exported
file; legend with units. `MIERUNE/mapsuke` `mapsuke-cartography` (GPL-2.0; ideas only, no text reused): projection by
purpose incl. WMO/JMA conformal weather charts, no scale bar/north arrow on small-scale maps, missing data distinct
from zero.
