# ch00_reading_weather_maps — data needs, new functions and CHECK rows (movie-director, 2026-10-27)

Every download goes through `fluidpy.data.fetch()` and `tools/disk_guard.py` (G: floor 50 GB, project cap 150 GB, C:
floor 40 GB); Earth Engine / GIBS / STAC responses are archived under `G:/…/aofd-data/raw/<GEE|GIBS|STAC>/…` (map-toolkit
§5b, never on C:). Movie products go to `movies/ch00/ch00_reading_weather_maps/data/` (small JSON/bin) or
`data/derived/ch00/` (re-usable, ≤ 10 MB each). Credits go to `manifest.json` and the registry, never on screen.
Disk at planning time (2026-10-27 ~22:30): **C: 62 GB free, G: 557 GB free.**

## A. Already on disk (re-use, no download)
| Id | What | Where | Scenes |
|---|---|---|---|
| A1 | ERA5 hourly u10, v10, msl, t2m, 1 Nov 00 UTC → 2 Nov 23 UTC 2023, 35–70° N, 50° W–10° E | `G:/…/raw/ERA5-ARCO/era5_ciaran_2023_u10-v10-msl-t2m_2023-11-01T00_2023-11-02T23_1h.nc` | s37, s42, s49 (03 UTC), s48 |
| A2 | ERA5 Ciarán 09/12/13/15 UTC 2 Nov: sfc msl, u10, v10, t2m, land; 850/500 hPa z, u, v (0.25°, 35–70° N, 50° W–15° E) | `data/derived/ch00/ciaran_2023_{sfc,upper}_1102.{bin,json}` | s21–s27, s30, s31, s48, s50 |
| A3 | ERA5 850 hPa t, q, u, v hourly 12 UTC 1 Nov → 12 UTC 2 Nov (30–65° N, 40° W–15° E) | `data/derived/ch00/era5_ciaran_2023_850hPa_1h.nc` | s38, s42 (objective fronts at 03 UTC) |
| A4 | MODIS Aqua true colour 2 Nov 2023 | `data/derived/ch00/ciaran_modis_aqua_truecolour_2023-11-02.{jpg,json}` | s21, s43 |
| A5 | Natural Earth 10m coast, admin-0, admin-1 lines (Ciarán box); NE 10m places; NE 50m land; NE 10m admin (raw) | `data/derived/ch00/ciaran_*_10m.geojson`, `G:/…/raw/NE-10m-places/`, `NE-10m-admin/`, `NE-50m-land/` | all maps; s15 (Greenland/Africa from admin-0) |
| A6 | Blue Marble NG 2004 (topo, topo+bathy) 5400×2700 and 21600 | `movies/ch00/ch00_cross_product_why/data/real/globe_bmng_*.jpg`, `G:/…/raw/BMNG-2004/` | s00–s20 globes and morphs |
| A7 | GFS 0.25° MSLP analyses 12 UTC 26 Oct and 00 UTC 27 Oct 2026, with extrema | `data/derived/ch00/gfs_mslp_latest.nc` | s51 (typhoon 934.9 hPa at 14.5° N 162.5° E; southern low 944.7 hPa at 60.25° S 148.0° E, both 00 UTC 27 Oct) |

Planning numbers read from A2 (12 UTC 2 Nov 2023), to be re-asserted by the CHECK rows below: ERA5 low 955.9 hPa at
52.5° N 1.75° E; box maximum 1029.8 hPa at 35° N 32.75° W; tightest isobars over the sea 7.48 hPa/100 km at 50.25° N
1.75° W with a 10-m wind of 21.7 m/s; near the Azores high < 0.5 hPa/100 km and 2.9–3.7 m/s; z500 minimum 5114 m at
52.5° N 1.25° E, maximum 5968 m (35° N 41.75° W); strongest 500-hPa wind 68.65 m/s at 40.5° N 8.5° W; 500-hPa trough
axis from 55° N 1.75° E to 40° N 5.5° W.

## B. New downloads (preferred open source first; ⚠ = rolling archive, fetch at once)
| Id | Dataset (registry key) | Subset | Size (est.) | Licence / credit | Scenes | Why |
|---|---|---|---|---|---|---|
| D1 | **NOAA NCEI Global Hourly (ISD)** (new key `ISD`) via the NCEI Access Data Service `https://www.ncei.noaa.gov/access/services/data/v1?dataset=global-hourly&…` (checked 2026-10-27: returns CSV for a station list or `boundingBox` and a time window); station positions from `isd-history.csv` | (a) Brest-Guipavas `07110099999` 1 Nov 12 UTC → 2 Nov 09 UTC 2023 (FM-12 SYNOP with the raw `REM` "SYN…" string, FM-15 METAR with the raw "METAR LFRB …" string); (b) every FM-12 report at 03 UTC 2 Nov 2023 in 45–55° N, 10° W–5° E (~60 stations) | < 2 MB | US Government (NOAA NCEI), public domain; non-US station data are WMO Resolution 40 exchanges ("not for commercial use"): allowed, the movies are non-monetised; credit "NOAA NCEI Global Hourly / ISD" | s32–s38, s42, s49, s57 | real METAR and SYNOP strings, real station models, hand analysis |
| D2 | (optional) Iowa Environmental Mesonet ASOS/METAR archive (key `IEM-METAR`) | runner-up for D1(a) METAR text | tiny | IEM: free to use (NWS/FAA data); credit "Iowa Environmental Mesonet" | s32 | cross-check of the METAR string |
| D3 | ARCO-ERA5 (key `ERA5-ARCO`) | global `geopotential` at 500 hPa, 12 UTC 2 Nov 2023, 0.5° | ~2 MB | CC BY 4.0, "Contains modified Copernicus Climate Change Service information" | s27 inset | hemispheric 500-hPa waves (polar stereographic) |
| D6 ⚠ | **GFS 0.25° analysis** (key `GFS-ANL`, Unidata THREDDS NCSS; keeps ~7–8 days → **fetch before ≈ 3 Nov 2026**) | 18 UTC 27 Oct 2026: `Pressure_reduced_to_MSL_msl`, `u/v-component_of_wind_height_above_ground` (10 m), `Geopotential_height_isobaric` (500 hPa); 00 UTC 27 Oct 2026: 10-m u, v (s51–s52) | ~30 MB raw → ~6 MB product | US public domain (NOAA/NCEP via UCAR/Unidata) | s01, s23, s51–s56 | the latest analysis under the forecaster's fronts |
| D7 | **WPC coded surface bulletin** CODSUS (new key `WPC-CODSUS`), from the IEM AFOS text archive `https://mesonet.agron.iastate.edu/cgi-bin/afos/retrieve.py?pil=CODSUS&fmt=text` (checked 2026-10-27; parsed with `metpy.io.parse_wpc_surface_bulletin`) | valid 18 UTC 27 Oct 2026 (the high-resolution variant with 4-digit positions where available) | ~10 kB | US Government (NOAA/NWS WPC), public domain; credit "NOAA NWS Weather Prediction Center" | s00, s01, s23, s40, s41, s53–s57 | real, human-drawn fronts, H/L and troughs |
| D8 | IEM METAR archive (key `IEM-METAR`) | all reports 17:50–18:10 UTC 27 Oct 2026 in 30–50° N, 85–65° W (+ station list for s58) | < 1 MB | as D2 | s01, s56, s58 | station models either side of the coastal cold front |
| D9 | **GOES-19 (GOES-East) ABI** via Earth Engine `NOAA/GOES/19/MCMIPF` (`ee.data.computePixels`, archived under `raw/GEE/`) | bands CMI_C02 (0.64 µm), CMI_C08 (6.2 µm water vapour), CMI_C13 (10.3 µm IR) at 18:00 UTC 27 Oct 2026, plus C02 and C13 hourly 18 UTC 27 Oct → 06 UTC 28 Oct, box 25–65° N, 85–10° W at ~4 km | ~150 MB raw → ~30 MB PNG sequence | US public domain (NOAA); credit "NOAA GOES-19 ABI, via Google Earth Engine" | s00, s01, s46, s47, s53, s56 | one scan in three channels; day-to-night IR loop |
| D10 | **NASA GIBS** `MODIS_Aqua_Brightness_Temp_Band31_Day`, 2 Nov 2023, same box and size as A4, **plus its colormap XML** (`https://gibs.earthdata.nasa.gov/colormaps/v1.3/MODIS_Aqua_Brightness_Temp_Band31_Day.xml` or the layer's `ColorMap` link in GetCapabilities) | ~5 MB | NASA open; credit "NASA EOSDIS GIBS / Worldview" | s44, s45 | infrared of the same pass as the visible image (values recovered from the palette, re-coloured grey) |
| D11 ⚠ | **NASA GIBS** `Himawari_AHI_Band13_Clean_Infrared`, 00:00 UTC 27 Oct 2026, EPSG:4326, 80° S–80° N, 60° E–140° W (rolling archive: the capabilities file on 2026-10-27 lists times back to mid-Sep 2026 → **fetch within ~6 weeks**) | ~10 MB | NASA GIBS (JMA Himawari-9 data via NOAA/NASA), open; credit "NASA EOSDIS GIBS; JMA Himawari-9" | s51 | both hemispheres in one real image |
| D12 | (optional, runner-up for D9) NOAA AWS `noaa-goes19` `ABI-L2-CMIPF` bands 2, 8, 13 for the same times | 3 × ~25 MB per time | US public domain | s46, s47 | if Earth Engine quota or the asset fails |
| D13 | (optional) GIBS `GOES-East_ABI_Band2_Red_Visible_1km`, `GOES-East_ABI_Band13_Clean_Infrared` 18:00 UTC 27 Oct 2026 ⚠ (rolling) | ~10 MB | NASA GIBS / NOAA | s47 | GIBS runner-up for visible and IR (no water-vapour band exists in GIBS; checked 2026-10-27) |

Checked on 2026-10-27 (GIBS GetCapabilities): geostationary layers in GIBS are `GOES-East/West_ABI_{Band2_Red_Visible_1km,
Band13_Clean_Infrared, GeoColor, Air_Mass, Dust, FireTemp}` and `Himawari_AHI_{Band3_Red_Visible_1km,
Band13_Clean_Infrared, Air_Mass}`; **no water-vapour band** (hence D9). MODIS band-31 brightness-temperature layers go back
to 2002. The ISD file for Brest 2023 has SYNOP at 12–22 UTC 1 Nov and 03–08 UTC 2 Nov (no SYNOP at 23–02 UTC; METARs
every 30 min): the s34 model is therefore the 03 UTC SYNOP and the s32 message the 00 UTC METAR.

Real station numbers read from D1(a) during planning (re-asserted by CHECK rows):
| UTC | report | wind | T / Td °C | pressure | tendency | weather |
|---|---|---|---|---|---|---|
| 1 Nov 18 | SYNOP `81518 10103 20098 39718 49833 58103 765//` | 150° 18 kt (8/8 cloud) | 10.3 / 9.8 | SLP 983.3 hPa | a = 8, −10.3 hPa in 3 h | ww 65 heavy continuous rain |
| 2 Nov 00 | METAR `LFRB 020000Z AUTO 22042G61KT 2400 RA BR BKN014/// OVC022/// //////TCU 11/10 Q0963 TEMPO …` | 220° 42 kt G61 | 11 / 10 | QNH 963 | — | rain, mist |
| 2 Nov 01 | METAR | 240° 44 kt G66 | 11 / 9 | QNH 962 (station minimum; ERA5 grid point 962.1) | — | rain, mist |
| 2 Nov 03 | SYNOP `82739 10092 20075 39582 49696 53055 763// 333 … 91084 90710 91184` | 270° 39 kt (8/8) | 9.2 / 7.5 | SLP 969.6 hPa | a = 3, +5.5 hPa | ww 63 moderate continuous rain; gust group 911 = 84 kt |

## C. New functions (fluidpy; the implementer writes them with tests; never in the TSX)
| Id | Function | Formula / method | Lives in | Tests |
|---|---|---|---|---|
| F1 | `unit_vector`, `parallel_points`, `meridian_points`, `wrap_lon`, `arc_lengths(lat, dlat, dlon, a)`, `great_circle_distance`, `great_circle_points`, `initial_bearing`, `rhumb_line` (distance, bearing, points), `polygon_area` (spherical excess), `gradient(F, lat, lon, a)` | δx = a cos φ δλ, δy = a δφ (Vallis §2.2.2 text, p. 61, `chapters/pages/ch02/p081.png`); haversine; rhumb via Mercator ψ = ln tan(π/4 + φ/2) | `fluidpy/geo/sphere.py` (new) | V1 1° = 111.19 km; parallel radius a cos φ; V5 distances, bearings and areas vs `pyproj.Geod(a=b=6371 km)` to 1e-9; V7 wrap_lon round trip; gradient of a known analytic field |
| F2 | `forward(name, lat, lon, **p)` for `platecarree`, `mercator`, `equalearth`, `polar_stereographic` (lat_ts), `lcc` (lat_1, lat_2), `gores` (interrupted sinusoidal, n lobes); `scale_factors(name, lat, lon, **p)` → h, k, areal, ω; `tissot_ellipses(name, centres, radius_km)` | Snyder (1987) USGS PP 1395: Mercator (7-1, 7-2), stereographic (21-x), LCC (15-1…15-4); Equal Earth (Šavrič et al. 2019, eqs 1–2); h, k by finite differences of `forward` on the sphere | `fluidpy/geo/mapproj.py` (new) | V1 Mercator h = k = sec φ; V2 sympy d/dφ ln tan(π/4 + φ/2) = sec φ; V3 Mercator y vs quadrature of sec; V5 all five vs `pyproj` `get_factors` (rtol 1e-6); V1 Equal Earth areal = 1; V1 LCC k = 1 on both standard parallels; gores areal = 1. A JS mirror (ES module) for the three.js ProjectionMorph with `selftest()` rows against these values |
| F3 | `decode_metar(text)`, `decode_synop(text)` | WMO FM 15 METAR and FM 12 SYNOP groups used here: Nddff, 1sTTT, 2sTTT, 3PPPP, 4PPPP, 5appp, 7wwW1W2, 333 910ff/911ff; METAR wind/gust, visibility, weather, cloud layers, T/Td, QNH | `fluidpy/diag/station.py` (new) | V1 the four real Brest reports above decode to the table; V5 METAR vs `metpy.io.parse_metar_to_dataframe` |
| F4 | `barb_parts(speed_kt)` → (pennants, full, half) after rounding to 5 kt; `plot_pressure_code(slp_hPa)` / `decode_plot_pressure(code)`; `tendency_code(a, ppp)` → glyph id and "+55" | WMO / NOAA WPC station-plot conventions | `fluidpy/diag/station.py` | V1 135 kt → (2, 3, 1); 15 → (0, 1, 1); 39 → 40 → (0, 4, 0); 18 → 20 → (0, 2, 0); 2 kt → calm; 969.6 ↔ '696', 1001.2 ↔ '012', 1033.0 ↔ '330' |
| F5 | `interpolate_isobars(lat, lon, slp, levels)` | Delaunay triangulation of the stations, linear interpolation on each triangle, contour lines (the hand-analysis rule "the 970 line passes halfway") | `fluidpy/diag/station.py` | V1 a planar pressure field is reproduced exactly; V7 two stations 966/974 → 970 at the midpoint |
| F6 | `fetch(box, start, end)` IEM ASOS/METAR | IEM `cgi-bin/request/asos.py` (raw METAR text) | `fluidpy/data/metar.py` (new, key `IEM-METAR`) | V1 parse of a stored response; provenance fields |
| F7 | `bulletin(valid)` → DataFrame (feature, strength, geometry) with provenance | IEM AFOS archive (pil CODSUS) → `metpy.io.parse_wpc_surface_bulletin` (bytes) | `fluidpy/data/wpc.py` (new, key `WPC-CODSUS`) | V1 the stored 18 UTC 27 Oct 2026 bulletin: 20 lows, 19 highs, 16 cold, 9 warm, 4 occluded, 12 stationary, 38 troughs (low-resolution variant; counts re-measured for the high-resolution variant) |
| F8 | `goes.cmi_grid(satellite, band, time, box, res)` (Earth Engine `computePixels` or AWS `noaa-goes19`) and a `satellite=` option in `fluidpy.data.goes` (it is hard-wired to `noaa-goes16`, which is no longer GOES-East); `gibs.fetch_wms(..., time=)` for the 10-minute geostationary layers | ABI fixed-grid → lat/lon (existing `to_latlon`) | `fluidpy/data/goes.py`, `fluidpy/data/gibs.py` | V1 band 13 BT in 180–320 K; V1 time stamp of the scan within 10 min of the request |
| F9 | `gibs.colormap_values(layer, rgb)` | read the GIBS colormap XML (`ColorMapEntry rgb, value/label`), map each palette colour back to its value class (exact, nearest-colour within 2/255) | `fluidpy/data/gibs.py` | V1 every palette entry round-trips; unmatched pixels → NaN and counted |
| F10 | `trough_ridge_axes(field, lat, lon, smooth_km=300)` | per latitude row, local minima (troughs) / maxima (ridges) of the smoothed field in longitude, chained across rows within a distance limit | `fluidpy/diag/axes.py` (new) | V1 z = −cos(k(λ − λ₀)) cos φ gives troughs at λ₀ + 2πn/k; V7 shift invariance |
| F11 | `isd.fetch(stations | box, start, end)` and `isd.history()` | NCEI Access Data Service (global-hourly), `isd-history.csv` | `fluidpy/data/isd.py` (new, key `ISD`) | V1 parse of a stored response; the Brest SYNOP REM strings round-trip into F3 |
| F12 | `gfs.fetch_analysis(..., vars=…, level=…, height=…)` | NCSS `vertCoord` for isobaric and height-above-ground variables | `fluidpy/data/gfs.py` | V1 500-hPa height in 4.8–6.0 km; 10-m wind present |

Existing functions used: `fluidpy.geo.atmos.{hypsometric_thickness, wind_direction_from, wind_components, scale_height}`,
`fluidpy.geo.constants.{KNOT, EARTH_RADIUS}`, `fluidpy.geo.vectors.{norm, angle_between}`, `fluidpy.diag.fronts.front_lines`,
`fluidpy.diag.cyclone.storm_centre`, `fluidpy.diag.trajectories`, `fluidpy.data.{era5_arco, gibs, gfs, naturalearth,
nasa_bmng}`, `fluidpy.core.statics.isothermal_pressure`.

## D. CHECK rows the builder must assert (RM-ids used in the storyboard)
RM01 1° latitude = 111.19 km · RM02 111.19 / 73.84 / 55.60 / 0.00 km per degree of longitude at 0 / 48.39 / 60 / 90° ·
RM03 New York–Tokyo great circle 10 850 km, highest latitude 69.8° N · RM04 plate carrée k_east = 1, 2.000, h = 1 ·
RM05 Tissot widths ×2.00 at 60°, ×3.86 at 75° (manifest only) · RM06 Mercator h = k = 2.000, areal 4.000 at 60° ·
RM07 Mercator y/a = 3.1313 at 85° · RM08 Africa/Greenland true area ratio 13.5–14.5 (30.37 vs 2.166 million km²),
Mercator-drawn ratio 0.8–1.5, sec² at Greenland's area-weighted latitude 8.5–10.5 · RM09 rhumb 12 788 km, great circle
10 850 km, difference 1 938 km · RM10 Equal Earth areal = 1 ± 1e-6, ω = 17° / 30° / 58° · RM11 polar stereographic
k = 0.933 / 1.000 / 1.866 · RM12 LCC (40/60) k = 1.018 … 0.985 … 1.023 over 35–65° N, scale-bar stretch 3.8 % 50→65° N ·
RM13 L 955.9 hPa at 52.5° N 1.75° E → '956', H '1030' · RM14 |∇p| 7.48 and < 0.5 hPa/100 km; 21.7 and 2.9–3.7 m/s ·
RM15 the shown WPC trough within 150 km of a computed trough axis · RM16 p(5.8 km) ≈ 507 hPa; z500 box mean 5.4–5.6 km ·
RM17 z500 min 5114 m, max 5968 m, levels multiples of 60 m · RM18 z500 5071 m (250 K), 5477 m (270 K), Δ 406 m ·
RM19 trough axis 55° N → 40° N 5.5° W, max |v500| 68.65 m/s, median wind–contour angle < 15° where |v| > 20 m/s ·
RM20 68.65 m/s = 133.5 kt → 135 → (2, 3, 1) · RM21 15 kt → (0, 1, 1) · RM22 barbs with ≥ 4 long feathers lie where
|∇p| > 3 hPa/100 km · RM23 METAR 00 UTC decode · RM24 SYNOP 03 UTC decode · RM25 '696' ↔ 969.6, '+55' · RM26 SYNOP
18 UTC decode · RM27 hand isobars: the spoken station pair is real; RMS(station SLP − ERA5 msl) ≤ 1.5 hPa · RM28 front
transect: wind veer ≥ 30°, T drop ≥ 1.5 °C, brackets the TFP cold front within 100 km · RM29 OCFNT starts at the
972-hPa low · RM30 STNRY/TROF segments exist · RM31 L 953.7 hPa at 03 UTC → '954'; ≥ 1 cold and ≥ 1 warm segment ·
RM32 sea pixels 280–290 K in band 31 · RM33 cloud −60…−40 °C, sea 10…15 °C, height 8–11 km · RM34 band-8 BT 200–260 K,
a dry tongue (BT > 245 K) within 800 km SW of the 982-hPa low · RM35 frames complete; day/night band-2 thresholds ·
RM36 ≥ 80 % of grid points within 1500 km of the low have it 45–135° left of downwind · RM37 Brest → low 179 km,
bearing 15.5°, 74.5° left of facing east · RM38 500-hPa median wind–contour angle < 10° · RM39 934.9 / 944.7 hPa;
10-m vorticity sign + NH / − SH · RM40 cross-isobar angle > 45° within 8° of the equator, < 30° poleward of 30° ·
RM41 bulletin 18Z, GFS 18Z · RM42 L 982 at 43° N 43° W, H 1033 at 48° N 79° W, L 961 at 66° N 11° W · RM43 tightest
gradient side of the 982 low · RM44 fronts of the 982 low; IR BT < 240 K along ≥ 60 % of the cold front; METAR wind
turn ≥ 40° across the coastal cold front · RM45 84 kt × 1.852 = 155.6 km/h.

**Rule.** If a CHECK fails, the narration changes to the data (never the reverse); the director re-runs the TTS dry run
for the changed sentences. Scenes with a stated fallback (s38, s46, s56, s57) cut or re-word the named sentence.

## E. Cited facts (the research scout verifies each before the build; source into the manifest, nothing on screen)
| Id | Claim (scene) | Source to check |
|---|---|---|
| C1 | ≈ 1.2 million homes in France lost power during Ciarán (s57) | Enedis press releases 2 Nov 2023; else cut the clause |
| C2 | Synoptic weather maps became possible with the telegraph in the 1850s (s58) | Météo-France history (Le Verrier's telegraph network after the 14 Nov 1854 Black Sea storm); Met Office history (FitzRoy, 1861) |
| C3 | Buys Ballot published the rule in 1857 (s48) | KNMI history page / Buys Ballot (1857), *Comptes Rendus* 45 |
| C4 | Mercator's projection 1569; Equal Earth published 2018 (online; IJGIS 33(3) 2019); Tissot's indicatrix (N. A. Tissot, 1859/1881) (s11, s12, s17) | Snyder 1987; Šavrič, Patterson & Jenny, doi:10.1080/13658816.2018.1504949 |
| C5 | Africa 30.37 and Greenland 2.166 million km² (s15) | CIA World Factbook / Britannica; cross-checked by `sphere.polygon_area` on Natural Earth (RM08) |
| C6 | Brest gust 84 kt = 156 km/h (s57): ISD SYNOP group 911ff | verify the 911ff meaning (highest gust in the period) and Météo-France's reported Brest-Guipavas gust; else say "gusts of more than sixty knots" from the METARs (G61–G75) |
| C7 | WMO conventions: barbs 5/10/50 kt, station-model layout, front symbols, polar stereographic true at 60° (s29, s34, s39–s41, s18) | WMO GDPFS Manual App. II-4; NOAA WPC station-plot guide; NWS Unified Surface Analysis Manual 2006 (cartography skill §8) |

## F. Credits (manifest and movie page; nothing on screen)
ERA5 (CC BY 4.0, Copernicus/ECMWF) · NOAA NCEP GFS via UCAR/Unidata THREDDS (public domain) · NOAA NWS WPC coded surface
bulletin via the Iowa Environmental Mesonet AFOS archive · NOAA NCEI Global Hourly (ISD) · Iowa Environmental Mesonet
METAR archive · NOAA GOES-19 ABI via Google Earth Engine (noncommercial Community/Free tier, allowed: non-monetised) ·
NASA EOSDIS GIBS / Worldview (MODIS Aqua, Himawari-9 via GIBS; JMA) · NASA Blue Marble NG · Natural Earth (public
domain) · music and effects: tools/sound (our own, CC0).

## Orchestrator decisions (2026-10-27)
1. Freeze the "latest" chart at 18 UTC / 00 UTC 27 Oct 2026; fetch the rolling-archive items (D6, D11, D13) now.
2. Latitude symbol φ in Chapter 0 movies (chapter movies bridge to Vallis's ϑ in one line); provenance keeps ϑ.
3. Keep the Mercator calculus (s13–s14).
4. Water vapour via Earth Engine (authenticated, project uhiphd; archived on G:); `fluidpy.data.goes` gets the satellite option anyway.
5. Do not show the WPC chart image; render from the coded bulletin in house style.
6. s57 impacts: verify both (Enedis ~1.2 M homes; 84-kt gust ≈ 156 km/h) with cited sources; cut the clause if either fails (fallback "gusts of more than sixty knots").
7. Length 34:49 kept.
8. Library order: implementer F1, F2, F3–F5, F10 (geo/diag); data-scout F6, F7, F8, F9, F11, F12 (data) with the fetches.
Lexicon entries (Buys Ballot, Tissot, Himawari, METAR, decametres) are applied at build time (the weather-basics builder owns the lexicon file now).

## Library results vs plan (implementer, 2026-10-27) — narration follows the data
- RM12 LCC k at 65° N = 1.022 (not 1.023). RM18 z500 = 5072 / 5478 m (R_D 287.05; difference 406 m unchanged).
- RM19 trough axis endpoints depend on smoothing (±50–90 km): do not quote them to 0.1°. RM20 68.65 m/s = 133.4 kt (barb still 135).
- RM10 "ω = 58°": name the point (60° N 150° E gives 57.7°). RM05 drawn 500-km circles are ×2.005 / ×3.919 wide (local k 2.00 / 3.86).
- RM23: MetPy parse_metar fails on the real Brest `//////TCU` METAR; use it as a benchmark only on reports without such groups.
- This movie is now #69 (last) in the approved plan v2; the library (sphere, mapproj) also serves #5 (coordinates).

## Verifier notes (orchestrator, 2026-10-28; reports/ch00_rwm_verification.md)
- RM19: on the 12 UTC 2 Nov z500 map the trough axis is at 4.9–6.8° W only south of 48.5° N; north of 49° N it bends east to ≈ 0° (the cut-off low). Draw the axis from `diag.axes`, never a straight 5.5° W line to 55° N.
- ISD SYNOPs carry no iw: for Irish, Dutch and Belgian stations call `decode_synop(..., wind_unit="m/s")` (or use ISD's decoded speed), otherwise speeds are 1.94× too small.
