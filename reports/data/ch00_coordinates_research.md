# ch00_coordinates (#5) — data research for the revision (data-scout, 2026-11-05)

Research only. Nothing in the movie source was changed, Remotion was not run, and nothing was committed. All images
below are on G: under `R = G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates/research/`.
The scripts that made them are in `R/_scripts/` (each prints its numbers, and every download goes through
`fluidpy.data.fetch()`).

## 0. Verdicts in one screen
| Question | Answer |
|---|---|
| Is Ian shown correctly? | **The physics pattern is right; three things are wrong.** (a) The **stripes** are our own hatch (`rgba_png(hatch_neg=True)`), not data. (b) The **eye marker** is the HRRR pressure minimum, which is 5 km from HRRR's own calm centre and **11–16 km SW of the radar eye**. (c) The **s14/s14b layers are ERA5 0.25°**: an Ian of 979.6 hPa / 28.7 m/s against 938 hPa / 135 kt in the best track, with the whole eye smaller than one grid cell. |
| Better Ian data | **NEXRAD KTBW radar** for the eye. **GOES-16 mesoscale 0.5-km** for the satellite plate. **HRRR 3-km pressure levels** for the layers and the r–z section. **Sentinel-2 + NOAA NGS aerial** for the surge slider. |
| Which Bay of Bengal storm? | **Amphan 2020.** It has the best data (same-orbit Sentinel-1 pair, ERA5 closest to the best track, GPM, Himawari, GEE). Its clear "pinhole" eye is visible on 18 May. Landfall was in the Sundarbans, at the West Bengal–Bangladesh border, 10–12 UTC on 20 May. Its flooding hit Khulna/Satkhira. Sidr 2007 is the runner-up (direct Bangladesh landfall and a clear eye, but no Sentinel/Landsat imagery and a weak ERA5). |
| GEE slider | **Works** (project `uhiphd`). Ian: Sentinel-2 25 Sep vs 30 Sep, plus NAIP 2021 vs NGS aerial 30 Sep. Amphan: Sentinel-1 VV 16 vs 22 May, same orbit, **147 km² of new water**. |
| Best tools | A 2-D map looks almost the same in mpl, PyGMT, MapLibre and GeoVista: the data decides. **mpl** wins on speed and determinism; **three.js** stays for camera moves; **PyVista** for 3-D prototypes; GEE → Remotion slider. |

## 1. Is Ian shown correctly?

### 1a. Which product, time and level makes each picture
From `movies/data/build_ch00_coordinates.py` and the build-1 frames in `R/frames/`.
| Scene (time in build 1) | Product | Time | Level | Grid as drawn |
|---|---|---|---|---|
| s11/s12 map + particles (8:38–10:20) | NOAA HRRR analysis (`hrrr_ian_2022.nc`, HRRR-zarr sfc) under GOES-16 true colour (opacity 0.6) | 2022-09-28 18 UTC | 10-m wind, MAPS MSLP | regridded to 0.03° (griddata linear), PNG ×2 |
| s11 eye marker (gold dot) | `storm_centre` = sub-grid **MSLP minimum of HRRR**: 26.456 N 82.399 W, 960.3 hPa | 18 UTC | MSL | — |
| s14 GOES plate (12:20) | GOES-16 ABI **CONUS** MCMIPC (2-km bands, true colour), crop 1.2° × 1.3° centred on IBTrACS 26.6 N 82.4 W, stretched, ×4 | scan 18:01:17 | — | 0.02° → 65 × 60 px → ×4 |
| s14b layer maps / stack (13:20–14:42) | **ERA5** via ARCO (`era5_ian_2022-09-28T18_pl.nc`); u_r about the ERA5 MSLP centre 26.454 N 82.391 W | 18 UTC | 975, 850, 500, 200, 125 hPa | 24 × 21 cells × 8 = **192 × 168 px**, stretched to ≈ 1100 px |
| s39/s40 coast + surge (40:20–40:45) | HRRR 20 UTC wind; NOAA CO-OPS gauges | 20 UTC | 10 m | as s11 |

### 1b. The stripes at ~13:20 — what they are
- **Verdict: our own colour encoding, not interpolation, projection, HRRR aliasing or rain bands.**
- `rgba_png(..., hatch_neg=True)` darkens every pixel with `((x + y) // 6) % 3 == 0` to ×0.55 wherever u_r < −0.5 m/s. That is a 6-px band every 18 px, diagonal in image space.
- A row of `img/stack_ur_975.png` shows exactly this pattern: runs of 6 pixels at about half brightness, every 18 px.
- In the tilted three.js stack these bands read as parallel stripes over all the inflow regions. They were never explained on screen.
- Evidence: `R/stripes_demo.png`. Its panels show the shipped PNG; the same ERA5 field with no hatch (diverging cmocean `balance`, symmetric ±12 m/s, zero contour); and the native 0.25° cells.
- Orientation of the shipped PNG is correct: the positive lobe is in the SW in both. The inflow share at 50–300 km (975 hPa) is 0.91.
- **Fix:**
  1. Drop the hatch.
  2. Use a diverging map centred on 0 with a symmetric range, plus a bold zero contour.
  3. Build the layers from **HRRR 3-km pressure levels** instead of ERA5. The current PNG is 24 × 21 data cells; the eye of Ian (≈ 35–50 km across) is smaller than a single 0.25° cell.
  4. Ship the texture at ≥ 1024 px.

### 1c. The eye "not at the centre" at 8:38
Centres at 18 UTC, measured in this research (`R/ian_centre_diag.png`, `R/ian_nexrad.png`). Distances are to the radar eye.
| Centre | lat N | lon W | Distance to the radar eye |
|---|---|---|---|
| **NEXRAD KTBW 0.5° reflectivity, eyewall-circle fit (≥ 35 dBZ), 18:01:48** | **26.552** | **82.278** | 0 (eyewall radius 29.7 km, beam ≈ 2.3 km up) |
| same radar, eye-hole centre by eye | ≈ 26.57 | ≈ 82.35 | ≈ 7 km |
| IBTrACS 18 UTC fix (0.1° precision) | 26.6 | 82.4 | 12.6 km |
| IBTrACS line 15 UTC → 19:05 UTC Cayo Costa landfall, at 18 UTC | 26.59 | 82.33 | 6 km |
| GOES-16 C13 > 270 K eye centroid (cloud-top, parallax ≈ 9 km NW for 15-km tops, VZA 32°) | 26.597 | 82.445 | 17 km |
| HRRR 10-m wind-speed minimum | 26.506 | 82.441 | 17 km |
| HRRR 850-hPa max-v_t centre | 26.48 | 82.39 | 13.5 km |
| **HRRR MSLP minimum = the movie's marker** | **26.456** | **82.399** | **16 km** |
| ERA5 MSLP minimum (s14b) | 26.454 | 82.391 | 16 km |

- **What the user saw.** The s11 zoom is ≈ 700 px per degree. HRRR's calm centre lies 5.0 km NW of the marker, so the light-yellow calm blob appears about 35 px up-left of the dot. The user's reading is correct for the picture on screen.
- **What is really wrong.** HRRR's analysed vortex itself sits about 11–16 km south-west of the real (radar) eye, and it is 22 hPa too weak (960.3 vs 938 hPa in the best track). HRRR has no tropical-cyclone vortex relocation.
- **Fix, either way.**
  - If an HRRR field is drawn, put the marker at HRRR's own wind centre (the calm). The ring numbers then become v_t(25 km) = 34.8 and v_r = −13.3 m/s, instead of 37.1 / −12.5.
  - Say on the source line that the model's vortex is ≈ 15 km from the radar eye.
  - Better: use **radar or GOES-mesoscale** for "where the eye is", and keep HRRR only for the wind numbers.
  - Never mix the two centres in one picture. The s14 GOES crop is centred on IBTrACS, so the eye sits low in the crop (`R/ian_goes_eye_compare.png`).
- **Check also:** the s14b callout at 13:55, "inflow almost gone ≈ −6 m/s", points at a ring above the bottom layer. The manifest values are v_r(200 km) = −6.1 at **975** hPa and −0.4 at **850** hPa, so either the label or the ring is mismatched.

### 1d. Vertical structure: HRRR vs ERA5 (`R/ian_sections.png`, `R/ian_hrrr_layers.png`)
| Quantity | HRRR 3 km (9 levels, 975–125 hPa) | ERA5 0.25° (18 levels) | Best track |
|---|---|---|---|
| max ring-mean v_t | **56.8 m/s at r = 30 km** (850 hPa) | 33.9 m/s at r = 75 km | 135 kt = 69 m/s (1-min sfc), RMW 20 nmi = 37 km |
| min ring-mean v_r (inflow) | −16 m/s below ~1.5 km, r 20–80 km | −10 m/s | — |
| max 10-m wind in box | 50.8 m/s | 28.7 m/s | — |
| min MSLP | 960.3 hPa | 979.6 hPa | 938 hPa |

- HRRR shows the textbook "in–up–out" circulation: a shallow inflow layer, an eyewall-hugging v_t maximum that leans outward with height, and outflow above ≈ 12 km.
- **Two pitfalls for the movie.**
  - Near the core, surface pressure is below 975 hPa, so HRRR's 975-hPa field is **extrapolated below ground** there. Mask p > p_sfc, or use 950/925 hPa as the "bottom" layer.
  - The 500-hPa u_r has a ±10 m/s dipole. This is vortex tilt plus storm motion. Use per-level centres or storm-relative winds before calling it "inflow/outflow".

## 2. Better sources: compared and tested
| Source | Route (anon/login) | Licence (public movie?) | Tested here | Eye | In/out layers | Vertical | Verdict |
|---|---|---|---|---|---|---|---|
| ERA5 / ARCO-ERA5 | gs ARCO zarr (anon) | CC-BY 4.0, attribution | yes (Ian, Amphan, Sidr) | no (eye < 1 cell) | yes, smoothed | 37 levels | pattern only; best for the BoB storms (no HRRR there) |
| **HRRR** sfc + **prs** | s3 hrrrzarr (anon) | public domain | yes (36 subsets, 3.3 MB) | model eye ~15 km off | **yes, sharp** | 40 levels, 3 km | **best gridded Ian** (CONUS only) |
| GFS/GDAS analysis | AWS noaa-gfs-bdp-pds / NCEI (anon) | public domain | no (screened) | no (0.25°) | yes | 0.25° | no gain over ERA5 for teaching |
| IMERG V07 | GEE `NASA/GPM_L3/IMERG_V07` | NASA open | yes (`R/imerg_sheet.jpg`) | 1–2 px hint | rain only | — | supporting rain layer (peaks 39–40 mm/h) |
| **GOES-16 ABI mesoscale M1** (L2 CMIPM, 0.5 km C02, 1 min) | s3 noaa-goes16 (anon) | public domain | yes (8.3 MB) | **yes** (with stretch / sandwich) | cloud tops only | — | **satellite plate** (`R/plate_options.png`) |
| **NEXRAD Level-II** KTBW | s3 **unidata-nexrad-level2** (anon) | public domain | yes (19.4 MB, MetPy reader) | **best** (eye ≈ 35–50 km, eyewall) | rain bands | 23 tilts → 3-D | **eye truth + 3-D reflectivity** (`R/ian_nexrad.png`) |
| Himawari-8 (Amphan) | s3 noaa-himawari8 (anon) | public domain (NOAA NODD) | listed (B03 ≈ 4–9 MB per segment) | yes, but VZA ≈ 64° at 88 E | — | — | oblique; runner-up |
| INSAT-3D (Amphan) | MOSDAC, registration + approval | MOSDAC terms (not verified) | no | best geometry (82 E) | — | — | needs an account; ask the user |
| Meteosat-8 IODC (Amphan) | EUMETSAT Data Store (account) | EUMETSAT licence | no | VZA ≈ 58° | — | — | needs an account (on the reminders list) |
| MODIS/VIIRS true colour | NASA GIBS WMS (anon) | NASA CC0, credit Worldview | yes (`R/bob_gibs_sheet.png`, `R/bob_eye_zoom.png`) | Amphan 18 May, Sidr 15 Nov: **yes** | — | — | **BoB eye stills** |
| IBTrACS v04r01 | NCEI (anon) | public domain | yes (NI basin 3.0 MB) | track | — | — | tracks, landfall, IMD/JTWC values |

The tool contact sheets are in `R/compare/`: `sheet_ian_layer.png`, `sheet_amphan_layer.png` and `sheet_stack3d.jpg`.

## 3. Which Bay of Bengal cyclone? → **Amphan (May 2020)**
Values from IBTrACS v04r01 (NI basin, sid `2020136N10088`, `2009143N17089`, `2007314N10093`). Times are UTC.
| | Amphan 2020 | Sidr 2007 | Aila 2009 |
|---|---|---|---|
| Landfall | Sundarbans, West Bengal–Bangladesh coast, 21.4 N 88.1 E (09 UTC fix, land 0); IMD: VSCS crossed **10:00–12:00 UTC 20 May** (1530–1730 IST), 155–165 km/h | Bangladesh coast, Baleshwar river / Patharghata (Barguna), IBTrACS 15 UTC 21.6 N 89.6 E; literature ≈ 17 UTC 15 Nov | near Sagar Island, West Bengal, 21.6 N 88.2 E, 06 UTC 25 May |
| Track after landfall | 22.1 N 88.4 E (12 UTC) → 22.8 N 88.6 E (15) → 23.5 N 89.1 E (18) → 24.6 N 89.6 E (00 UTC 21 May) | 22.5 N 90.4 E (18) → 23.5 N 90.8 E (21) | due north along 88.2 E over Kolkata |
| Closest approach | Kolkata 17 km (~12:50 UTC); Satkhira 45 km W (~14:40); **Khulna 78 km W (~15:50)** | Patharghata 4 km (~16:30); Barisal 12 km (~18:30); Bagerhat 59 km; Khulna 93 km | Kolkata 17 km; Satkhira 89 km; Khulna 137 km |
| Peak (JTWC / IMD) | 140 kt, 910 hPa / 130 kt, 920 hPa (18 May) | 140 kt, 918 hPa / 115 kt, 944 hPa | 65 kt / 60 kt, 968 hPa |
| Clear eye in open imagery | **yes, 18 May** (MODIS Terra pinhole eye); 20 May none | **yes, 15 Nov** (MODIS Aqua, ≈ 9 h before landfall) | no |
| ERA5 min MSLP vs best track | 966.9 vs 953–960 hPa (06 UTC 20 May) | 989.7 vs 926–944 hPa | — |
| Before/after imagery | **Sentinel-1 16 & 22 May (orbit 150)**, S2 16 May (cloudy after), Landsat 8 | none (no S1/S2; no Landsat-5 over the coast in GEE) | Landsat-5 10 May / 11 Jun (hazy, cloudy) |
| GPM / IMERG | DPR orbits 18–20 May; IMERG | IMERG V07 (TRMM era) | IMERG |
| Licences | all open (Copernicus attribution, NASA, NOAA) | NASA, NOAA, C3S | USGS, NASA, C3S |

- **Recommendation: Amphan** for data, honesty and licence.
  - Its flood picture is validated independently: ICIMOD/SERVIR used the same Sentinel-1 16 and 22 May pair, with Shyamnagar ≈ 208 km² and Paikgachha ≈ 192 km² flooded.
  - Say on screen that **its centre crossed the coast on the Indian side and passed ≈ 45 km west of Satkhira and ≈ 78 km west of Khulna**; Khulna and Satkhira districts took the flooding.
  - Show the eye with the 18 May MODIS image ("two days before landfall").
- **If the user wants "a cyclone that crossed Bangladesh itself"**, Sidr is the only one of the three. But there are no Sentinel-1/2 pairs and ERA5 is very weak (989.7 hPa).
- **Coordinates for "Brest, Singapore, then Bangladesh"** (Natural Earth 10 m populated places):
  - Khulna 22.8419 N, 89.5581 E (Satkhira 22.72 N 89.07 E).
  - Brest 48.3904 N, −4.4950 E; Singapore 1.2950 N, 103.8539 E.
  - Angle between Brest's and Khulna's local "up" (r̂·r̂): 75.7°.

## 4. GEE inundation slider (`R/before_after/`)
GEE access works (project `uhiphd`, `.venv-maps`, earthengine-api). Every thumbnail went through `fetch(retrieve=…)`. The archives are in `G:/…/raw/GEE/` with `.request.json` next to each.
| Pair | Before | After | Region (W, S, E, N) | What it shows | Credit |
|---|---|---|---|---|---|
| `ian_s2_*` (+ `_water` NDWI outline) | S2 L2A 2022-09-25 (clouds over the mainland) | **S2 2022-09-30 (tile T17RMK 0 % cloud)** | −82.22, 26.34, −81.78, 26.57 (1920 × 1005) | sediment plume, overwash on Estero Island and Sanibel, salt-browned mangroves, broken Sanibel Causeway | "Contains modified Copernicus Sentinel data 2022, processed in Google Earth Engine" |
| `ian_s1_*` | S1 VV 2022-09-25 (orbit 121) | S1 VV 2022-10-07 (orbit 121) | same | almost no change: water 666 → 591 km², new 8 km². **The surge drained within hours**, so SAR cannot show it | same |
| `fmb_aerial_*` (1400²) | USDA **NAIP 2021-12-23** (60 cm, public domain) | **NOAA NGS ERI 2022-09-30** (≈ 25 cm, public domain, s3 noaa-eri-pds, tile `20220930bC0815700w262700n`) | −81.9501, 26.4374, −81.9374, 26.4501 | sand over the streets, destroyed houses; **the most striking Ian slider** (pick a tile 1 km NE with more town) | "USDA NAIP; NOAA NGS Emergency Response Imagery" |
| `amphan_s1_*` (+ `_water`, cyan water, **red = new water**) | S1 VV 2020-05-16 (orbit 150) | **S1 VV 2020-05-22 (orbit 150)** | 88.9, 22.1, 89.6, 22.5 | water 648 → 714 km², **new water 147 km²** in the Koyra/Shyamnagar polders | "Contains modified Copernicus Sentinel data 2020…" |
| `aila_l5_*` | Landsat 5 2009-05-10 | 2009-06-11 | same as Amphan | hazy, cloudy, weak | USGS |

- SAR water = VV < −18 dB after a 30-m focal median, the usual first-guess threshold. Shrimp ponds count as water in both images.
- Fallbacks (not needed): STAC Earth Search Sentinel-2 / Copernicus Browser.

## 5. Which tool gives the best maps? (`R/compare/`)
Same recipe, same prepared grid. Times on this machine:
| Frame | mpl/cartopy | PyGMT | GeoVista | MapLibre (chrome-headless-shell) |
|---|---|---|---|---|
| Ian HRRR 10-m speed + arrows + coast, 1920 × 1080 | 6.9 s | 106.6 s | 24.4 s (no arrows) | 11.9 s |
| Amphan ERA5 10-m speed + arrows + coast/borders (0.25° grid, small) | 5.3 s | 5.2 s | 7.9 s | 7.4 s |

- For 2-D field maps the four renders are nearly identical: the data and the colour map decide, not the tool.
- 3-D stack (HRRR u_r, 4 layers, ×15 vertical):
  - PyVista offscreen took 7.5 s, with correct depth ordering and smooth shading.
  - matplotlib mplot3d took 1.6 s but has depth-sort faults.
  - Neither replaces three.js for an orbiting camera.

| Visual kind | Recommendation | Runner-up |
|---|---|---|
| Satellite plate | GOES-16 **mesoscale** 0.5-km C02, percentile stretch or VIS/IR "sandwich" → PNG → three.js unlit quad (or Remotion `<Img>`) | NEXRAD 0.5° PPI with the eye ring; MODIS (GIBS) for BoB |
| Layer maps | **HRRR prs** (Ian) / ERA5 (Amphan) → mpl texture (diverging, zero contour, no hatch, ≥ 1024 px) | MapLibre (same look, GPU) |
| 3-D vertical stack | three.js stack fed by mpl textures + **radius–height curtain** (`ian_sections.png` style), orbiting camera | PyVista for stills and prototyping |
| Inundation slider | GEE / NGS PNG pair → Remotion slider (house `Slider`) | STAC Sentinel-2 |
| Polar map with wind particles | three.js / Remotion particles from Python RK tracks (`advect_on_sphere`), cartopy polar-stereo texture | deck.gl TripsLayer |

## 6. Other geo software and data (coordinator's list), screened per part
| Item | Open? Licence for a public movie | Tested | Verdict |
|---|---|---|---|
| NEXRAD Level-II KTBW/KBYX | anon (`unidata-nexrad-level2`; the old `noaa-nexrad-level2` bucket denies listing); public domain | **yes** | **use**: eye, rain bands, 3-D reflectivity (23 tilts) |
| GPM GMI/DPR 3-D | Earthdata (login exists); NASA open | search only | Ian orbit 29 Sep 04:01 (after landfall); Amphan orbits 18–20 May (incl. 20 May 05:28). Granules 370–750 MB → needs an OPeNDAP subset: **later, Amphan 3-D rain** |
| CIMSS MIMIC-TC | public web images; no explicit licence found | no | **avoid** until CIMSS confirms |
| NOAA NGS post-storm aerial (Ian) | anon (s3 noaa-eri-pds); public domain | **yes** (70 MB tile) | **use** for the Fort Myers Beach slider |
| USGS STN high-water marks | public domain | **failed**: `STNServices/Events.json` now returns the web app's HTML | find the new API, or cite NHC TCR values |
| NOAA CO-OPS gauges | public domain | already in build 1 | keep |
| Copernicus EMS / UNOSAT (Amphan) | no EMSR/UNOSAT product found; Disasters Charter activation 652 and ICIMOD maps exist | web | use our own S1 pair; cite ICIMOD as a cross-check |
| NASA GIBS MODIS/VIIRS | anon; CC0, credit Worldview | **yes** | **use** for BoB eye stills |
| Himawari-8 (Amphan) | anon; public domain | listed | oblique (VZA ≈ 64°); runner-up |
| INSAT-3D (Amphan) | MOSDAC registration + approval; terms not verified | no | best view, but needs the user's account |
| GEBCO / ETOPO 2022 | open (ETOPO public domain, GEBCO attribution) | in fluidpy already | use for the surge "shallow shelf" story |
| ParaView / PyVista | BSD | PyVista yes | prototypes and stills; ParaView not needed |
| Blender + BlenderGIS | GPL tool, outputs free | no | cinematic but off-pipeline (not deterministic with Remotion); skip |
| CesiumJS (no Ion) | Apache-2 | earlier §12 tests | heavier than three.js; no gain here |
| QGIS / GMT | GPL / LGPL | GMT yes (106 s) | QGIS for prep only; GMT for print-quality stills |
| Kepler.gl / deck.gl | MIT | deck.gl in §12 | deck.gl for trails/terrain pages only |
| Natural Earth + Blue Marble | public domain / NASA | in use | keep for the globe/graticule/prime-meridian tour |

### Part → visual → best data + tool → runner-up → why
| Part | Visual | Best data + tool | Runner-up | Why |
|---|---|---|---|---|
| 1 flat | Ian ring winds (s11/s12) | HRRR 10-m 18 UTC, marker at **HRRR wind centre**, mpl texture + three/SVG particles | radar PPI underlay | the numbers come from the same field as the picture |
| 1 flat | "where is the eye" still | **NEXRAD KTBW 0.5° PPI** (or GOES M1 sandwich) | GOES M1 stretched | the eye is directly visible; position to ~1 km |
| 2 3-D | Ian satellite plate | GOES-16 M1 0.5 km, stretched, centred on the radar eye | MODIS Aqua (GIBS) | 4× sharper than build 1; true eye centre |
| 2 3-D | layer stack + curtain | **HRRR prs** (950/850/500/150 hPa, masked below ground) in three.js + r–z section | ERA5 (pattern only) | HRRR resolves the 30-km RMW and the −16 m/s inflow layer |
| 2 3-D | 3-D rain | NEXRAD volume (23 tilts) → gridded CAPPI → three.js | GPM DPR (Amphan) | open, public domain, real eyewall towers |
| 2 3-D | Amphan | ERA5 ARCO 06 UTC 20 May (layers) + MODIS 18 May (eye) + IBTrACS track | Himawari-8 | only ERA5 covers the BoB on levels; state the time gap |
| 2 3-D | flood slider | **Amphan S1 16/22 May (new water red)**; Ian NAIP vs NGS aerial | Ian S2 25/30 Sep | water truly visible (Amphan); Ian surge drained, so show its damage |
| 3 sphere | globe, graticule, prime meridian | Natural Earth + Blue Marble in three.js | CesiumJS (no Ion) | already in the house kit |
| 4 frames | storm-relative winds (Ciarán) | ERA5 (as build 1) | — | unchanged |
| 5 maps | polar stereo + particles | ERA5/NCEP 10 hPa, Python RK tracks → three.js trails | deck.gl | matches the weather-basics look the user liked |

## 7. What is not possible here, and why
- **No open source shows Ian's storm-surge water** at the moment of peak surge. The surge drained within hours, and SAR passes are 25 Sep and 2/7 Oct. Show the damage (S2, NGS aerial) and the gauge curve instead.
- **No GEO imagery of Amphan at good geometry without an account.** INSAT-3D needs MOSDAC registration; Meteosat-8 IODC needs EUMETSAT. Himawari-8 is anonymous but at VZA ≈ 64°.
- **Sidr has no Sentinel/Landsat before/after** in GEE.
- **USGS STN API**: the JSON endpoint moved (it returns HTML), so the high-water marks were not obtained.
- **GPM DPR**: full-orbit granules (370–750 MB) are too big for this pass; an OPeNDAP subset is needed.
- **The ERA5 "eye"**: ERA5 cannot show any of these eyes (0.25° cells against an eye of 35–50 km).

## 8. Downloads, registry, disk
- Downloads, all through `fetch()`:
  - IBTrACS NI 3.02 MB; GOES-16 M1 C01/C02/C03/C13 8.3 MB
  - HRRR prs 36 subsets 3.3 MB (≈ 75 s each, mostly remote metadata)
  - ERA5 ARCO Amphan/Sidr/Ian sfc + 10 levels 97 MB on disk (≈ 1.2 GB transferred: whole chunks)
  - GIBS 9 images ≈ 30 MB (folder 180 MB incl. earlier work)
  - GEE thumbnails ≈ 60 MB; NEXRAD 19.4 MB; NGS tile 70.1 MB
  - `downloads.log` lines dated today: 78 files, 158.7 MB.
- Not through `fetch()`: cartopy wrote its Natural Earth 10 m cache (land, coast, boundaries, populated places, ≈ 20 MB new) to `C:/Users/sislam27/.local/share/cartopy`, because `CARTOPY_DATA_DIR` was not set in my runs.
- An 8-kB HTML file from the USGS STN endpoint was removed (my own non-data response).
- **Registry: no change.** These are research subsets. If adopted, add entries for:
  - `NEXRAD-L2-KTBW-ian2022`, `NOAA-ERI-ian2022`, `GOES16-ABI-M1-ian2022`, `HRRR-zarr-prs-ian2022`;
  - `GEE-S1-amphan2020`, `GEE-S2-ian2022`, `GEE-NAIP-fmb2021`;
  - `ERA5-ARCO-amphan2020`, `IBTrACS-NI`.
- **One small fluidpy addition would help:** `hrrr.fetch_fields(store="prs", levels=…)`. The route is the same; only the store path differs.
- Disk:
  - Before: **C: 47.8 GB, G: 465.8 GB** free (project data 121.12 GB of 150).
  - After: **C: 48.3 GB, G: 496.2 GB** (project data 90.82 GB).
  - G: grew because **another session's cleanup** removed ≈ 30 GB of `scratch/movies/ch00_derivatives_taylor` (`logs/cleanup.log`, 01:02); not this agent.
  - Research folder: 75 MB. No evictions.

Sources:
- [IMD Amphan report summary (odishabytes)](https://odishabytes.com/imd-report-on-amphan-first-super-cyclonic-storm-since-1999-odisha-sucs/amp)
- [ICIMOD/SERVIR Amphan flood mapping](https://servir.icimod.org/news/mapping-floods-in-bangladesh-caused-by-cyclone-amphan-to-support-humanitarian-response/)
- [Disasters Charter activation 652](https://www.disasterscharter.org/web/guest/activations/-/article/flood-large-in-bangladesh-activation-652-)
- [Cyclone Sidr (Wikipedia)](https://en.wikipedia.org/wiki/Cyclone_Sidr)
- [Prothom Alo on Sidr](https://en.prothomalo.com/bangladesh/14-years-since-dreadful-day-of-cyclone-sidr)
- [CIMSS MIMIC-TC](https://tropic.ssec.wisc.edu/real-time/mimtc2/tc.shtml)
- [MOSDAC](https://www.mosdac.gov.in/node/69)
