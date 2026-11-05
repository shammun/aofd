# ch00_coordinates (#5b `ch00_coordinates_storm`) — flood visuals v2: data, colours, swipe, zoom (data-scout, 2026-11-05)

Follow-up to `reports/data/ch00_coordinates_research.md` §4. The user found the v1 before/after pictures weak and asked for
the captests A5 look (wide MODIS false-colour pair, gliding swipe line), honest flood mapping, and a zoom flight to the
Sundarbans like T2/T3/F1. Everything below is research scratch under
`G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates/research/flood_v2/` (short: `V2/`). No movie
source touched, nothing committed, registry unchanged.

## 0. Verdicts in one screen

| Visual | Recommended (data · bands/colours · tool) | Runner-up | Why |
|---|---|---|---|
| **Regional swipe** (Kolkata → Khulna, 190 × 160 km) | MODIS **7-2-1**: Terra 16 May vs Aqua **29 May 2020** (first usable clear look), one fixed stretch; Python/Pillow frames → ffmpeg now, Remotion `Slider` in production | clear-pixel median composites 1–19 May vs 21 May–3 Jun (softer, 11 % holes) | The "NASA look" orients the viewer (water dark blue, plants green). **Honest limit:** monsoon cumulus after landfall and a flood that is small at this scale; it does **not** give the Indus-style shock. Use it as the orientation shot that hands over to the radar close-up (gold box). |
| **Close-up swipe** (breached polders, 115 × 70 km) | **Sentinel-1 VV**, same relative orbit 150: 16 May 23:56 UTC vs 22 May 23:55 UTC, 50 m focal median, grey −24…0 dB | S1 RGB change composite (R = before, G = B = after: new water red) | No cloud-free optical image exists within 2 weeks (S2 3 Jun = sun glint; L8 24 May = 56 % cloud). Radar sees through cloud and the change is unambiguous. |
| **New-water overlay** (pass after the swipe) | new water (after < −18 dB, before ≥ −18 dB, drop ≤ −3 dB, JRC seasonality ≥ 10 mo removed, ≥ 9 px blobs) in **#F26B1D vermilion-orange**, normal water (JRC) in **#2F6DB5 blue** at 45–55 %, over the **greyed, dimmed** after image; legend + "≈ 125 km² new water" | the RGB change composite as the overlay | Follows UN-SPIDER and CEMS GFM (flood ≠ reference water); blue/orange is the most colour-blind-robust pair and they differ in lightness; the number is computed, not quoted. |
| **Zoom flight** (globe → Bay → Sundarbans, track, landfall) | **three.js globe + nested equirect sphere patches** (Blue Marble 8K → Bay patch: MODIS NBAR land + ETOPO depth tint with 20/200 m isobaths → the regional 7-2-1 image), IBTrACS track and labels as screen-space overlay; **in Remotion** (`flight()` + `Patch` from `movies/src/captests/flights.tsx`) | MapLibre globe → raster (T3 route) | Same camera maths as the house globe and the movie pipeline; ~0.07–0.1 s/frame in Remotion (P1) vs 0.66 s in MapLibre (T3) and MapLibre steep pitch is not reproducible (captests drop list). Prototype captured from a plain three.js page with Remotion's own chrome-headless-shell. |
| **Ian (if kept)** | **Aerial NAIP 23 Dec 2021 vs NOAA NGS ERI 30 Sep 2022** over Times Square / pier / Matanzas Pass bridge (tile `20220930bC0815745w262745n`) | S2 SWIR 25 vs 30 Sep 2022 (plume, browned vegetation) | The aerial pair shows the surge's work directly (houses gone, sand in streets, pier gone); public domain both. |

Prototype clips (1920 × 1080, 30 fps, H.264): `V2/clips/amphan_modis_regional_swipe.mp4` (16.1 s),
`V2/clips/amphan_s1_close_swipe.mp4` (16.1 s, with overlay pass), `V2/clips/ian_aerial_swipe.mp4` (10.6 s),
`V2/clips/ian_s2swir_swipe.mp4` (10.6 s), `V2/clips/amphan_zoom_flight_threejs.mp4` (18 s). Stills next to each
(`*_hold/_mid/_settle/_overlay.png`, `amphan_zoom_flight_fNNN.png`). Contact sheet: `V2/contact_sheet_flood_v2.jpg`.

## 1. How flood mapping is shown accurately from satellites (research) and what is honest for us

**SAR (Sentinel-1) change detection — UN-SPIDER recommended practice (GEE).** Same pass direction before/after; speckle
smoothing with 50 m circles; change = after ÷ before (ratio), flood where the ratio > 1.25 (on VH, which they recommend;
VV is better at delineating open water); then remove permanent water (JRC Global Surface Water pixels wet > 10 months a
year), slopes > 5 % (HydroSHEDS) and blobs connected to ≤ 8 neighbours. Their listed limits: false positives from land
change and from mixing relative orbits, no detection in towns and dense vegetation, and the flood peak is usually missed
because of the 6–12-day revisit.

**Copernicus EMS — Global Flood Monitoring (GFM) conventions.** "Observed flood extent" explicitly excludes pixels that
are normally water (the monthly *Reference Water Mask*, permanent + seasonal); an *Exclusion Mask* removes areas where SAR
cannot see floods (urban, dense vegetation, radar shadow, water look-alikes such as sand and tarmac). In the product
manual figures the flood layer is drawn in a saturated **magenta-red** over a light base map and the reference water in
**blue** (permanent darker, seasonal lighter). Permanent water is usually a water-occurrence threshold of 85–90 %
(Pekel et al. 2016).

**NASA Earth Observatory / Worldview style — MODIS/VIIRS bands 7-2-1.** SWIR 2.1 µm → red, NIR 0.86 µm → green, red
0.65 µm → blue: vegetation is **bright green**, open water **dark blue to black** (sediment-laden water dark blue), bare or
fallow ground brown/tan, **snow, ice and ice clouds bright cyan/turquoise**, water clouds white. Worldview also has a
"Flood (3-day window)" layer that needs water on three days before it calls a pixel flooded (cloud/shadow false alarms).

**Sentinel-2 SWIR false colour (B12/B8A/B4) and water indices.** Same physics as 7-2-1 at 10–20 m: water black/dark
blue, plants green, soil and towns brown-pink. NDWI (McFeeters 1996, green/NIR) over-detects water near buildings; MNDWI
(Xu 2006, green/SWIR) suppresses built-up, soil and vegetation noise; published flood thresholds range from 0 to about
0.5, so a threshold must be stated, not implied.

**SAR RGB change composite.** ESA's Eduspace flood exercise builds multi-date RGBs and shows that the channel assignment
decides the colour of flooded land. With **before → R, after → G and B**, ground that turned dark (water) keeps only red
⇒ **new water is red**; ground that turned bright is cyan; unchanged ground is grey; permanent water is dark in all three
⇒ dark. (The red result is the logic of that exercise, checked here on Amphan: `V2/s1/close_o150_2020-05-22_rgb_change.png`.)
NASA Disasters uses the difference dVV = VV_after − VV_before for the same purpose.

**Clouds.** Optical: mask with QA bits (MODIS `state_1km`: cloud state, shadow, cirrus, adjacent-to-cloud) or
s2cloudless probability (GEE tutorial: threshold the probability, join on `system:index`); composites of clear pixels
only, with the date span stated. Radar: no cloud problem. **New pitfall found here:** Sentinel-2 on 3 June 2020 at 22° N
(sun almost overhead near the solstice) shows **sun glint**: every pond and river is bright white, so water indices fail
(`V2/ql/close_s2_2020-06-03_tc.png`).

**Colour.** Crameri, Shephard & Heron (2020, *Nat. Commun.* 11, 5444): avoid rainbow and red–green maps, use perceptually
ordered, colour-vision-deficiency-safe colours. Red/green and green/blue pairs fail for many readers; blue/orange (and
blue/red) are the safe pairs; vary lightness, not just hue.

**What is scientifically honest for us**
1. Before/after must be the **same sensor, same stretch** (fixed from the before image), and for SAR the **same relative
   orbit**; dates and times on screen (UTC on the source line).
2. **"New water" ≠ "flood"** in a delta full of shrimp ponds: remove reference water (JRC seasonality ≥ 10 months) and say
   so; call it "new water", not "flood depth" or "surge".
3. Show the **date gap** (radar 2.5 days after landfall; MODIS 9 days) — the peak surge (≈ 20 May, 10–17 UTC) is not
   observed by any open sensor.
4. Clouds stay visible (no infilling from other dates without saying "composite, 21 May–3 Jun").
5. New water in vermilion-orange over a desaturated base; reference water in blue at lower opacity; legend with words;
   the area number computed from the mask in that frame.
6. Radar footprint edges shown where the mask ends (no-data must not read as "dry").

## 2. Amphan: what was tried (all through `fetch()` → disk guard; GEE project uhiphd)

| Option | Dates (UTC) | Clear / usable | Verdict |
|---|---|---|---|
| MODIS Terra/Aqua daily 7-2-1, 250 m (b1, b2) + 500 m (b7) | before 9 & 16 May; after 23 May, 29 May, 3 Jun | wide-box clear (state_1km): 16 May 83 %; 23 May 43 %; 29 May 40 % (polders mostly clear); 3 Jun 36 % | **16 May vs 29 May** chosen. 23 May: cumulus everywhere. |
| MOD09A1 8-day | 8–15 May, 24–31 May, 1–8 Jun | composites smeared with cloud | rejected |
| MOD+MYD09GA clear-pixel median (ours) | 1–19 May vs 21 May–3 Jun | after: median 2 clear looks, **11.5 % no clear look** | runner-up only (500 m, hazy) |
| VIIRS VNP09GA | 23 May 57 % clear (survey only) | not fetched | same look as MODIS at 500 m in GEE |
| Sentinel-2 L2A | 14/16 May excellent; after: 24 May 64–68 % cloud, 29 May 54–90 %, **3 Jun 2–23 % cloud but sun glint** | — | before only; no usable after |
| Landsat 8 L2 (path 138) | 8 May (9 % cloud) vs 24 May (56 % cloud) | — | rejected |
| **Sentinel-1 GRD IW** | orbit 150: 16 May 23:56, 22 May 23:55, 28 May 23:56; orbit 48: 16/22 May 00:03–00:04, 3 Jun | orbit 48 covers only 426 km² of the close-up box | **orbit 150 pair chosen** |

**Numbers (close-up box 88.80–89.92 E, 22.12–22.75 N, 60 m pixels, 8 079 km² valid):** water 1 225 → 1 522 km²;
**new water 124.9 km²** (116.4 km² with JRC occurrence ≥ 50 % as the mask instead); on **28 May still 64.0 km²**
(water stayed in the breached polders). Otsu threshold of the after image −13.8 dB (we keep the conventional −18 dB,
which is stricter). At the regional crop with 206 m pixels the same rule gives only 37.7 km² (small polders vanish under
the 9-pixel rule) — another reason the radar close-up carries the flood story. Consistency: ICIMOD/SERVIR mapped the
same 16/22 May pair (Shyamnagar ≈ 208 km², Paikgachha ≈ 192 km² flooded, upazila totals incl. ponds; v1 report).

**Shelf (ETOPO1, along 89.0° E):** under 10 m deep for 8 km, under 20 m for **≈ 33 km**, 50 m at 64 km, 200 m at 92 km
from the coast (88.5° E: 33 / 72 / 137 km; 89.5° E is the Swatch-of-No-Ground canyon: 200 m at 60 km). This number is on
screen in the zoom prototype.

## 3. Ian

- **Aerial NAIP 2021 | NGS ERI 30 Sep 2022**, tile `20220930bC0815745w262745n` (132 MB GeoTIFF, s3 noaa-eri-pds,
  public domain; NAIP via GEE, public domain). Chosen with a NAIP overview of the 3 tiles along the island
  (`V2/ql/ian_naip_overview.png`): this tile has Times Square, the pier and the Matanzas Pass bridge. Cropped to 16:9
  (rows 650–1860 of 2160). `V2/clips/ian_aerial_swipe_mid.png`. **Strongest Ian pair.**
- **S2 SWIR 25 vs 30 Sep 2022** (box −82.20…−81.80, 26.36…26.56; 25 Sep 16 % cloud, 30 Sep 0.4 %): the after image shows
  the sediment plume (sea turns blue), browned vegetation on Sanibel and the broken causeway. Good runner-up.
- Ian SAR (v1): no surge water left by 7 Oct — not repeated.

## 4. Swipe prototype (`V2/_scripts/swipe.py`)

Python + Pillow frames piped to ffmpeg (libx264 crf 17, yuv420p), 1920 × 1080, 30 fps, house-dark-v1 (`#171f33`, ink
`#e8ecf4`, keywords `#f4ecd2`, gold line `#d8b23a`). Timeline as captests A5 `Slider` (re-timed): hold on BEFORE 1.2 s →
glide right-to-left to AFTER (3.2 s) → pause 1 s → reverse to 62 % → pause → settle at 50 % → optional overlay pass (the
image cross-fades to the new-water map; the date labels give way to the legend and the km² number). Labels
"before · 16 May 2020" | "after · 22 May 2020" at the top of each half (each dims when its side is hidden), gold place
dots with haloed 44-px names (Kolkata, Khulna, Satkhira, landfall / Satkhira, Shyamnagar, Koyra, Paikgachha, Mongla,
Sundarbans, "Khulna 10 km ↑"), scale bar + north arrow, source line (28 px, muted) wrapped below the image.
Render cost: 46–96 s per 10–16 s clip; Remotion was not needed (no Remotion source touched). Port to Remotion: the
`Slider` in `movies/src/captests/flights.tsx` already has the keys; add the place/scale/legend layers.

## 5. Zoom flight prototype (`V2/zoom/flight.html`, captured by `V2/_scripts/zoom_capture.py`)

- three.js 0.186.1 (copied from `movies/node_modules`), unlit globe with Blue Marble NG Sept 2004 (8192 × 4096 from the
  21600 file), two sphere patches with exact equirect UVs (the `Patch` of flights.tsx): Bay of Bengal 84–94 E, 15–25 N
  (land: MODIS MCD43A4 NBAR 1–8 Feb 2020, 1400 px; sea: ETOPO1 depth on one light-to-dark blue ramp with 20 m (white)
  and 200 m isobaths; alpha edge ramps) and the regional swipe's 7-2-1 before image (88.05–89.95 E, 21.55–23.0 N).
- Camera = `flight()` of flights.tsx (great-circle slerp, log-eased distance, tilt). 18 s: globe (Indian Ocean) → Bay
  (track draws on with a UTC date readout, IBTrACS 3-hourly) → shelf (landfall ring, "shallow shelf: under 20 m deep for
  ≈ 33 km offshore") → tilted delta view (places) → top-down over the swipe frame, cross-fading to the 7-2-1 image so the
  last frame is the swipe's first frame. Edge fades 60 px top/left; source line below.
- Captured frame-stepped with Remotion's chrome-headless-shell (ANGLE D3D11, RTX A1000) via
  `tools/maptools/adapters/_browser.py`; no other chrome-headless-shell was running (checked with `tasklist`). 540
  frames in 736 s (1.36 s/frame: PNG screenshots, not the renderer); clip 18.0 s, 16.65 MB. Last frame = swipe's first
  frame (outside the 7-2-1 rectangle fades to the background, f445–490). One stale 56 kB headless process from my own
  stills run lingered for a few minutes; the capture script ignored only that PID (`--ignore-pid`), then it exited.
- **Stack recommendation:** three.js in Remotion. Quality is equal to MapLibre for this case because Bangladesh is flat
  (terrain adds nothing) and the patches are sharp at their own scale; Remotion renders at 0.07–0.1 s/frame (captests P1)
  against 0.66 s (MapLibre T3), deterministically, inside the movie pipeline, and the house globe already uses it.
  MapLibre is the runner-up for an *interactive* web page (tiles, smooth LOD) or if street-level zoom (< 1 km) is needed.
- Prototype weaknesses to fix in production: isobaths are raster-stepped (draw them as vector lines from a contour of
  ETOPO 2022 15″); the NBAR land is slightly greener than Blue Marble at the patch edge (match with a colour transfer or
  use one source); the 8-day NBAR has cloud gaps (now transparent); a 16 May S2 SWIR patch (10 m) could add a third,
  sharper level before the hand-off.

## 6. Contact sheet

`V2/contact_sheet_flood_v2.jpg` — five rows: regional optical options, close-up optical (why it fails), close-up radar
(pair, RGB change, overlay, 28 May persistence, swipe frame), Ian options, zoom-flight frames vs the T2 MapLibre capture.
Each tile has a one-word verdict (green good · amber usable · red rejected).

## 7. What is not possible (and why)

- **An Indus-style regional optical "shock" for Amphan:** the flood is local (polders, ~10² km²), and the monsoon onset
  covered the delta: no clear MODIS day until 29 May, composites smear clouds.
- **A cloud-free optical close-up after landfall within two weeks:** S2 24/26/29/31 May 54–99 % cloud; 3 June sun glint;
  Landsat 8 24 May 56 % cloud; Landsat 7 has SLC-off stripes.
- **The surge itself:** no open sensor imaged the delta between ~10 UTC 20 May and 23:55 UTC 22 May (S1 orbit 48 on
  22 May 00:04 covers only the box's eastern margin).
- **A wider radar regional swipe that "fills the picture":** orbit 150 covers 82 % of the regional crop; at 200 m pixels
  new water is specks (37.7 km²).
- **MCD43A4 three-month median** over 10° × 10° hit the GEE "user memory limit" in `computePixels`; an 8-day window was
  used (an Export task would allow the long median).
- **Remotion render of the prototypes** was not attempted: it would need new source in `movies/src` (not allowed here).
- Remaining blemishes in the prototypes: a few MODIS pixels at the valid minimum (−100) still show as dark-red/grey specks
  in the sea of the 7-2-1 images; Satkhira and the small upazila towns use approximate GeoNames-style coordinates
  (Natural Earth 10 m has only Kolkata, Khulna, Dhaka here) — check before production.

## 8. Downloads, disk, registry

- 20 guarded fetches (`logs/downloads.log`): 19 GEE `computePixels` NPY/NPZ bundles (≈ 441 MB on disk) + 1 NOAA ERI tile
  (132.1 MB); total **≈ 573 MB**, ≈ 220 s of transfer. Each `fetch()` spends ≈ 40 s in the disk report (it walks the data
  root), so later requests were **bundled** (one fetch, several images). Raw archive: `G:/…/raw/GEE/ch00_flood_v2/`
  (531 MB) + `raw/NOAA-ERI/20220930bC0815745w262745n.tif`. Research folder `V2/` 237 MB (frames are not kept; only
  clips, stills, inputs).
- GEE request limit: `computePixels` ≤ 50 331 648 bytes per request (hit twice; fixed by smaller grids/uint16).
- Disk before: **C: 48.2 GB, G: 496.2 GB** free (project data 90.83 GB / 150). After: **C: 64.9 GB, G: 493.7 GB** free (project data 93.54 GB / 150). C: rose because of another session's cleanup, not this work; everything of mine is on G:.
- TEMP/TMP set to `G:/…/scratch/tmp` for every run. No evictions. Registry: no change (research subsets). If adopted, add
  `GEE-S1-amphan2020-o150`, `GEE-MODIS-721-amphan2020`, `GEE-JRC-GSW14`, `NOAA-ERI-ian2022-C0815745w262745n`,
  `GEE-NAIP-fmb2021`, `GEE-S2-ian2022-swir`, `GEE-MCD43A4-bay2020`, `GEE-ETOPO1-bay`.
- Licences: Copernicus Sentinel (free, attribution: "Contains modified Copernicus Sentinel data 2020/2022"); NASA MODIS
  and Blue Marble (NASA open); JRC GSW (CC-BY 4.0, Pekel et al. 2016); USGS Landsat, USDA NAIP, NOAA NGS ERI, NOAA ETOPO1,
  IBTrACS (public domain); Natural Earth (public domain); three.js (MIT). All redistributable as derived frames.

Sources:
- [UN-SPIDER Recommended Practice: Flood Mapping and Damage Assessment Using Sentinel-1 SAR Data in GEE — In Detail](https://un-spider.org/advisory-support/recommended-practices/recommended-practice-google-earth-engine-flood-mapping/in-detail)
- [UN-SPIDER — Step-by-Step (thresholds, masks, smoothing)](https://un-spider.org/advisory-support/recommended-practices/recommended-practice-google-earth-engine-flood-mapping/step-by-step)
- [UN-SPIDER Recommended Practice: Flood Mapping with Sentinel-1 and Sentinel-2](https://un-spider.org/es/node/13488)
- [Copernicus EMS GFM Product User Manual (2025)](https://extwiki.eodc.eu/gfm_assets/gfm4.0_pum_2025.pdf)
- [GFM technical description, DLR](https://elib.dlr.de/196316/1/gfm_pum_v20231005_compressed.pdf)
- [Copernicus EMS Mapping Guidelines (2013)](https://core.ac.uk/download/38628648.pdf)
- [NASA Worldview image archive: Flooding near Tokyo (7-2-1 colours)](https://earthdata.nasa.gov/news/worldview-image-archive/flooding-near-tokyo-japan)
- [NASA Worldview image archive: Mississippi River (7-2-1)](https://www.earthdata.nasa.gov/news/worldview-image-archive/mississippi-river-usa)
- [CIMSS: MODIS false-colour flooding, Missouri/Mississippi/Ohio](https://cimss.ssec.wisc.edu/satellite-blog/archives/20382)
- [NASA Earth Observatory: Floods in the Ohio River Valley](https://earthobservatory.nasa.gov/images/14530/floods-in-the-ohio-river-valley)
- [NASA Worldview: Los Glaciares (ice/snow turquoise in 7-2-1)](https://www.earthdata.nasa.gov/worldview/worldview-image-archive/los-glaciares-national-park-argentina)
- [Sentinel Hub: simple RGB composites (Sentinel-2)](https://custom-scripts.sentinel-hub.com/sentinel-2/composites)
- [Sentinel Hub: HLS SWIR composite](https://custom-scripts.sentinel-hub.com/hls/swir)
- [Flood coverage with NDWI/MNDWI (Logos, AMU)](https://pressto.amu.edu.pl/index.php/logos/article/download/logos-2019-0026/30340/75050)
- [GeoHazards 2024: NDWI vs MNDWI accuracy](https://doaj.org/article/cebcb21175464339a28e232743adc40a)
- [ESA Eduspace: multi-temporal SAR flood exercise](https://esa.int/SPECIALS/Eduspace_Disasters_EN/SEMYTG826KH_2.html)
- [NASA Disasters: Sentinel-1 flood products (dVV)](https://maps.disasters.nasa.gov/ags04/rest/services/hurricane_helene_2024/sentinel1/MapServer)
- [ISPRS Annals 2026: Sentinel-1B multitemporal RGB flood mapping](https://isprs-annals.copernicus.org/articles/XI-3-2026/441/2026/)
- [GEE catalogue: JRC Global Surface Water v1.4](https://developers.google.com/earth-engine/datasets/catalog/JRC_GSW1_4_GlobalSurfaceWater)
- [GEE tutorial: Sentinel-2 cloud masking with s2cloudless](https://developers.google.com/earth-engine/tutorials/community/sentinel-2-s2cloudless)
- [Crameri, Shephard & Heron 2020, The misuse of colour in science communication](https://pmc.ncbi.nlm.nih.gov/articles/PMC7595127)
- [Volcanic hazard maps: colour and design](https://volcanichazardmaps.org/map-design/)
- [Geography Realm: making colour-blind-friendly maps](https://www.geographyrealm.com/making-color-blind-friendly-maps/)
- [Visualising Data: colour alternatives to green and red](https://visualisingdata.com/2015/11/colour-swatch-alternatives-to-green-and-red/)
- [ICIMOD/SERVIR Amphan flood mapping](https://servir.icimod.org/news/mapping-floods-in-bangladesh-caused-by-cyclone-amphan-to-support-humanitarian-response/)

---

## v3 (2026-11-05, after the user rejected every v2 clip: "they look wrong and I see no flood")

Folder `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates/research/flood_v3/` (short: `V3/`).
The coordinator relayed the new brief: find **one event whose flood is obvious in a plain before/after image** (it need
not be Amphan); no inundation overlay; a plain MODIS 7-2-1 pair with the same stretch and a gliding line, as in captests A5.
The "after" image should be the first clear view after landfall and the "before" image a few days earlier. An optional
middle frame shows the storm itself on landfall day. If Ian's inland flooding does not read, Ian drops the swipe and keeps
the gauge water-level chart.

### v3.1 How the events were ranked
Step 1: a metadata survey (`V3/survey_events.json`) of the daily MODIS Terra/Aqua clear fraction (`state_1km`), from
landfall −12 d to +14 d. Step 2: 7-2-1 pairs fetched for the best dates (`fetch()`, GEE, one stretch for every event:
R 0–0.32, G 0–0.42, B 0–0.20). Step 3: each pair checked by eye.

| Rank | Event (landfall UTC, source) | Before (gap) | After (gap) | Does the flood read in 2 s? |
|---|---|---|---|---|
| **1** | **Nargis**, Irrawaddy delta, ≈ 10–12 UTC 2 May 2008 (IBTrACS: 16.0 N 94.1 E at 09 UTC, 10 km from land; 16.0 N 94.5 E at 12 UTC, over land) | Terra **21 Apr** (−11 d; 80 % clear; popcorn cumulus); alt. 15 Apr (−17 d; 92 % clear; NASA's before date; sun-glint patch in the sea) | Terra **5 May** (+66 h; 61 % clear) | **Yes.** The pink-and-green delta turns dark blue almost everywhere south of Pathein–Yangon. This is NASA Earth Observatory's flagship pair: ≈ 14 400 km² flooded per their UMD estimate. |
| 2 | **Idai**, Beira, ≈ 23 UTC 14 Mar 2019 (IBTrACS: 19.8 S 35.2 E at 21 UTC, 15 km offshore) | Aqua 11 Mar (−84 h; 61 % clear; dense cumulus) | Terra 25 Mar (+10 d; first clear view) | **Yes in the after image** (the "inland sea" of the Buzi plain), but the before image is cloud-speckled. Sentinel-2 10/25 Mar is cloud-free but its swath misses Beira and Buzi. |
| 3 | **Harvey**, 03 UTC 26 Aug 2017 (NHC, Rockport, 230 km SW of the frame) | Terra 22 Aug (−82 h) | Terra 31 Aug (+134 h) | Partly: flooded river floodplains east of Houston; the city itself reads poorly. |
| 4 | **Ian** inland (Peace, Myakka), 19 UTC 28 Sep 2022 | Terra 23 Sep (−5 d; 95 % clear) | Terra 30 Sep (+29 h; 94 % clear) | **No.** The rivers widen only slightly at 250 m. Evidence: `V3/clips/ian2022_inland_modis721_swipe_settle.png`. **→ Ian keeps the NOAA CO-OPS gauge water-level chart** (build-1 s40, with the review-1 fixes). |
| 5 | **Amphan**, ≈ 10–11 UTC 20 May 2020 | 16 May (−4 d) | first clear day 29 May (+9 d, cumulus) | **No** (the polder flood is small; monsoon clouds). |
| – | Yaas 2021 / Remal 2024 / Florence 2018 | survey only | Yaas first clear look 4 Jun (+9 d); Remal none above 56 % until 5 Jun; Florence 19 Sep (+5 d, 90 %) | Yaas and Remal have no clear "after" within a week; Florence was fetched but not rendered. |

### v3.2 Recommendation
- **Use Nargis 2008** for the #5b swipe: MODIS Terra 7-2-1, **21 Apr (−11 d) | 5 May (+66 h)**, one fixed stretch.
  - The sequence is before → **landfall day, 2 May, Aqua true colour ≈ 07 UTC (−3 h)**, showing the whole storm, its eye,
    and the swipe box in gold → after → swipe.
  - No clear day exists between 22 Apr and landfall.
- **Runner-up: Idai 2019.**
- **Ian:** no swipe; keep the gauge chart. **Amphan:** zoom, track, landfall and shelf only.

### v3.3 Clips (Python/Pillow → ffmpeg, 1920×1080, 30 fps)
In `G:/Geophysical Fluid Dynamics/aofd-data/archive/movies/viewing_2026-10-29/viewing_2026-10-29/flood_prototypes_v3/`:
- `1_nargis2008_sequence_before_storm_after_swipe.mp4`: 19 s, recommended.
- `1b_nargis2008_swipe_only.mp4`.
- `1c_nargis2008_sequence_15apr_before.mp4`.
- `2_idai2019_swipe_runnerup.mp4`.
- `3_harvey2017_swipe.mp4`.
- `4_ian2022_inland_evidence_no_flood.png`.
- `contact_sheet_flood_v3.jpg`.

Rules applied:
- Date labels give the exact date and the time from landfall.
- The landfall marker and track come from IBTrACS.
- The source line sits below the image.

Processing notes:
- MODIS b7 gaps (−32768; Harvey ≤ 13.6 %, Idai 6.8 %, mostly over the sea) are filled from the nearest valid pixel.

Known blemishes:
- The Idai and Ian frames have some overlapping labels.

### v3.4 Landfall check
IBTrACS has Amphan at 21.4 N 88.1 E at 09 UTC (24 km from land) and 22.1 N 88.4 E at 12 UTC (over land), so landfall
≈ 10–11 UTC is at ≈ 21.7 N 88.2 E. A press caption quoting IMD gives 21.65 N 88.3 E (not verified in an IMD document).
**The v2 marker at 21.65 N 88.25 E was correct.** It only looked odd because that frame was centred on Khulna, 140 km NE.

### v3.5 Not done
- **Full S1 acquisition table and change composite:** dropped per the coordinator's second message.
- **Published Amphan products:** no UNOSAT, ARIA or Charter value-added products found. ICIMOD gives Shyamnagar
  ≈ 20 790 ha flooded (16/22 May S1). Zenodo 10.5281/zenodo.4390084 has S1 inundation rasters.
- **Browser capture:** not used in v3. Many chrome-headless-shell processes from the Part 1 builder were running.

### v3.6 Disk
- All downloads went through `fetch()` (GEE bundles ≈ 0.3 GB, GIBS 0.4 MB).
- `V3/` is 142 MB; the archive copy is 27 MB. TEMP was on G:. No evictions; nothing committed.

Sources (v3):
- [NASA EO: Cyclone Nargis Floods Burma](https://earthobservatory.nasa.gov/images/19876/cyclone-nargis-floods-burma-myanmar)
- [NASA EO: Floodwaters in Burma](https://earthobservatory.nasa.gov/images/8750/floodwaters-in-burma)
- [IMD press release, 19 May 2020](https://mausam.imd.gov.in/backend/assets/press_release_pdf/PRESS_RELEASE_dated_19th_May_2020_1600_hrs_IST.pdf)
- [ICIMOD Amphan flood mapping](https://www.icimod.org/article/mapping-floods-in-bangladesh-caused-by-cyclone-amphan-to-support-humanitarian-response/)
- [Zenodo Amphan inundation dataset](https://zenodo.org/records/4390084)
