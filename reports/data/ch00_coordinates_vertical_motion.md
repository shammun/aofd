# ch00_coordinates (#5b `ch00_coordinates_storm`) — Hurricane Ian's eyewall updraught: diagnosis and sources (data-scout, 2026-11-05)

Question: s19/s20 infer Ian's rising air from inflow below and outflow above, because the build (DS16) found HRRR's
analysed ω ≤ 0.095 Pa/s everywhere. Is that right, and what can the movie honestly *show*?
Scratch folder (short `VM/`): `G:/Geophysical Fluid Dynamics/aofd-data/scratch/movies/ch00_coordinates/research/vertical_motion/`
(scripts in `VM/_scripts/`). No movie source touched, nothing committed, registry unchanged.

## 0. Verdict in one screen

| | |
|---|---|
| **Diagnosis** | Not a window or units bug. The build read the right thing (`s3://hrrrzarr/prs/20220928/20220928_18z_anl.zarr`, `<lev>mb/VVEL`, Pa/s, window 24.5–28.5 N, 84.5–80.5 W, which contains the eyewall). **HRRR's hour-0 analysis has essentially no vertical motion.** The original NOAA GRIB `hrrr.t18z.wrfprsf00` gives the same field, ω ∈ [−0.095, +0.097] Pa/s with only 1 to 6 distinct values per level inside 100 km, so the zarr copy is faithful. The analysis step updates the winds, temperature and moisture but not w, so the hour-0 field is a near-constant residue. It is **not** what the analysed winds imply: by continuity, the same f00 inflow requires ≈ 1 m/s of ring-mean ascent at r ≈ 18–26 km. |
| **Show** | The **measured** updraught: NOAA P-3 tail Doppler radar (TDR), mission 20220928H1, analysis 09:49–12:47 UTC (centre 10:23), research-quality 3-D winds including w. Ring-mean ascent slopes outward with height. **Peak ring mean ≈ 3.3 m/s at 8–9.5 km height, r ≈ 45 km**; ≈ 1.5 m/s at 5 km; eyewall-band (35–60 km) mean peak ≈ 2.4 m/s at ≈ 10 km. Single updraught cores reach **≈ 9–12 m/s** (99.9th percentile 8.9 m/s; maximum 11.6 m/s at 13 km). |
| **Don't** | Don't use HRRR f00 ω (zero). Don't present HRRR f01/f02 w as "the" eyewall: the forecast vortex is spinning down (850-hPa peak speed 65 → 50 → 44 m/s for f00/f01/f02; 925-hPa height minimum 268 → 336 → 386 m), and its ring-mean w is only ≈ 0.6–0.85 m/s. ERA5 (0.25°) gives ≈ 0.3–0.45 m/s, which is too coarse for an eyewall. |
| **Eye sinking** | **Not measurable here.** The eye has no radar echoes, so the TDR has no data inside ≈ 22 km. The −4 to −7 m/s ring means at r ≈ 29 km sit on the inner data edge at 50 % coverage, so I treat them as an artefact. Only the model gives a value (HRRR f01 eye ring mean ≈ −0.3 m/s). Say it in words only, or not at all. |
| **Credit line** | "Vertical wind: NOAA P-3 hurricane-hunter tail Doppler radar, 28 Sep 2022 ≈ 10 UTC — NOAA AOML Hurricane Research Division" (plus the existing HRRR line for u_r and u_θ). |

Contact sheet (best two: TDR section + HRRR diagnosis triptych):
`G:/Geophysical Fluid Dynamics/aofd-data/archive/movies/viewing_2026-10-29/viewing_2026-10-29/vertical_motion/contact_vertical_motion.png`
· Drive: https://drive.google.com/file/d/1jVcSy_KagcPcaj1I1hDlrxErz9SS3OWh/view
(`aofd movies/ch00_coordinates/review/vertical_motion/ian_vertical_motion_contact_2026-11-05.png`).

## 1. Diagnosis of the tiny ω (task 1)

- **What the build read:** the HRRR-zarr **prs** store, analysis (`_anl.zarr`, i.e. forecast hour 0), variable **VVEL** (pressure vertical velocity ω, Pa s⁻¹; there is no DZDT in the prs zarr), at 9 levels (975 … 125 hPa). The window is 172 × 158 points around 26.5 N 82.5 W, so both the HRRR calm centre (26.506 N 82.441 W) and the radar eye (26.552 N 82.278 W) sit well inside it. **The window is not off the eyewall.**
- **The field is quantised to a near-constant.** Inside 100 km of either centre, ω has 6 / 5 / 4 / 3 / 2 / 1 / 1 / 1 / 1 distinct values at 975 / 925 / 850 / 700 / 500 / 300 / 200 / 150 / 125 hPa. A real eyewall would give hundreds.
- **It is HRRR's own f00, not a zarr artefact.** I downloaded the NOAA GRIB `hrrr.t18z.wrfprsf00.grib2` and got the same numbers: ω range −0.095 … +0.097 Pa/s over the whole box and all 37 levels.
- **Why:** HRRR's analysis (GSI hybrid plus radar/cloud analysis) updates u, v, T, q and hydrometeors, not w. The hour-0 file therefore carries no meaningful vertical motion; w spins up in the first forecast hour. The hour-1 field has 600–700 distinct values per level and ω down to −30 Pa/s. *This explanation is inferred from the data (f00 ≈ constant, f01 fully structured), not quoted from HRRR documentation.*

ω and w within 100 km of each file's own wind centre. w = −ω/(ρg) with ρ = p/(R_d T_v) from HRRR T and q:

| HRRR | centre | 850 hPa ω min / max [Pa/s] | 850 w min / max [m/s] | 700 ω | 700 w | 500 ω | 500 w |
|---|---|---|---|---|---|---|---|
| f00 18 UTC (zarr anl = GRIB) | 26.48 N 82.39 W | −0.027 / +0.066 | −0.007 / +0.003 | −0.031 / +0.032 | −0.004 / +0.004 | −0.016 / +0.015 | −0.002 / +0.003 |
| f01 (17 UTC run) valid 18 UTC | 26.35 N 82.42 W | −25.6 / +6.4 | −0.65 / **+2.60** | −30.3 / +7.2 | −0.88 / **+3.65** | −22.5 / +6.4 | −1.03 / **+3.60** |
| f02 (16 UTC run) valid 18 UTC | 26.35 N 82.38 W | −14.1 / +7.8 | −0.81 / +1.43 | −17.4 / +9.0 | −1.09 / +2.09 | −22.2 / +7.7 | −1.24 / +3.54 |

Even f01 stays below the "−5 to −50 Pa/s" expectation for a true 3-km eyewall in the mean. Its strongest point is 4.4 m/s (any level, r ≤ 100 km), because the forecast vortex is already weakening (see §0).

## 2. Sources tested (task 2) — peak w

Radius–height sections are in `VM/vm_*.png`, profiles in `VM/vm_compare.png`, numbers in `VM/stats.json`. "Slanted max" means the strongest ring-mean w at that height (r between 15 and 80 km; ERA5 r ≤ 150 km). Format: value (radius).

| Source | Kind | When | slanted max ring-mean w at 2 / 5 / 8 / 11 km [m/s] | point max | Honest? |
|---|---|---|---|---|---|
| **(a) NOAA P-3 TDR** 220928H1_1023 | **measured** (airborne Doppler, variational 3-D synthesis, continuity-constrained) | 09:49–12:47 UTC, centre 25.79 N 82.86 W | 0.35 (33 km) / 1.51 (49) / **3.33 (45)** / 2.35 (53) | 11.6 m/s (13 km, r 39 km) | **yes**, 8 h before landfall, over the Gulf |
| (b) HRRR f01 (17z run) | model forecast | valid 18 UTC | 0.84 (30) / 0.84 (42) / 0.62 (54) / 0.67 (54) | 4.4 | model, vortex spinning down |
| (b) HRRR f02 (16z run) | model forecast | valid 18 UTC | 0.43 (34) / 0.46 (54) / 0.58 (66) / 0.65 (66) | 4.8 | weaker still |
| HRRR f00 / zarr anl (what the build read) | model analysis | 18 UTC | 0.00 everywhere | 0.01 | **no vertical motion** |
| (c) ERA5 Ian (0.25°, existing product) | reanalysis | 18 UTC | 0.28 (45) / 0.24 (45) / 0.28 (15) / 0.45 (15) | 0.80 | too coarse (RMW 75 km, v_t 34 m/s) |
| (c) ERA5 Amphan (existing product) | reanalysis | 2020-05-20 06 UTC | 0.24 (45) / 0.34 (75) / 0.31 (75) / 0.31 (75) | 1.11 | too coarse; no measured w for Amphan |
| (d) continuity from HRRR **f00** inflow | derived | 18 UTC | 1.01 (18) / 0.76 (22) / 0.88 (26) / 1.07 (26) | — | derived; same winds as s20 |
| (d) continuity from HRRR f01 inflow | derived | valid 18 UTC | 0.63 (30) / 0.64 (42) / 0.44 (42) / 0.69 (42) | — | **agrees with f01's own w** (0.84 / 0.84 / 0.62 / 0.67) |
| (d) continuity from ERA5 Ian / Amphan | derived | | 0.36 / 0.30 / 0.45 / 0.48 (15) · 0.43 / 0.48 / 0.56 / 0.56 (15) | — | coarse |
| (d) continuity from TDR | — | | not possible: no TDR inflow data below ≈ 1.5 km inside 75 km, and the synthesis already enforces continuity | — | — |
| (e) dropsondes | — | | not attempted (optional): sondes give w only through fall-speed anomalies, and the AOML HTTPS tree is down (§5) | — | — |

**Continuity method (d)**, written in cylindrical coordinates, which is the movie's own teaching:

(1/r) ∂(r ρ ū_r)/∂r + ∂(ρ w̄)/∂z = 0 ⇒ ρ w̄(r, z) = −∫₀^z (1/r) ∂(r ρ ū_r)/∂r dz′, with w̄(z = 0) = 0.

Here ū_r and ρ are ring means (4-km bins, 12-km boxcar in r before the r-derivative). The integral uses the trapezoid rule upward over the levels above the sea and is cut at 13 km, where the integration error piles up. Inside 10 km, the 1/r factor amplifies centre error, so those values are dropped. **Cross-check:** for HRRR f01 the continuity w and the model's own w agree to within ≈ 0.2 m/s at every height, which validates the method. For HRRR f00, the inflow shown in s20 implies **≈ 1 m/s** ring-mean ascent at 18–26 km, of the same order as the TDR's 1.5 m/s at 5 km.

**Ring-mean versus point values.** The ring mean averages strong cores with weak or sinking air around the ring. The TDR plan view at 6 km (`VM/tdr_planview.png`) shows the ascent concentrated on the NW–NE side, as expected with shear. So "≈ 3 m/s on average, ≈ 10 m/s in the strongest cores" are both true.

## 3. Recommendation for s19/s20 (task 3)

**Numbers to show and say** (all from the TDR unless stated otherwise):

| Item | Value | Spoken |
|---|---|---|
| Peak ring-mean eyewall updraught | 3.3 m/s at 8–9.5 km, r ≈ 45 km (TDR RMW at 2 km = 33 km, v_t 65 m/s) | "about three metres per second, about nine kilometres up" |
| Mean updraught over the eyewall band 35–60 km | rises from ≈ 0.4 m/s at 2–3 km to ≈ 1.5 m/s at 5 km and ≈ 2.4 m/s at 10 km | "one to three metres per second" |
| Strongest single updraughts | 9–12 m/s (99.9th percentile 8.9; maximum 11.6 at 13 km) | "up to about ten metres per second in the strongest towers" |
| Sinking in the eye | not measured (no radar echoes in the clear eye); model ≈ −0.3 m/s | words only ("in the clear eye the air sinks gently"), no number, or omit |
| Continuity cross-check (D20) | the s20 inflow alone requires ≈ 1 m/s ring-mean rise near 20–30 km | "the inflow alone tells us the air must rise at about a metre per second" |

**Visual (suggestion; the movie source is untouched):**
- **s20:** keep the HRRR u_r section (18 UTC) for in and out. Then cross-fade, or add beside it with the same axes (r 0–100 km, z 0–14 km), the **TDR ring-mean w panel**: colour 0 to +4 m/s, grey eye band labelled "no echoes", and gold upward arrows on the slanted ring (r 35–60 km). This replaces the "must rise" inferred arrows with measured ones. Suggested build order:
  1. Show "the inflow says it must rise" (continuity, a one-line TeX of the equation above).
  2. Bring in "and a radar on a hurricane-hunter aircraft measured it".
  3. Add the 3 m/s and 10 m/s callouts.
- **s19 (3-D stack):** vertical gold arrows on the eyewall ring between layers, with length ∝ TDR ring-mean w at the layer heights: ≈ 0.4 m/s (2 km), 1.5 (5 km), 3.3 (8 km), 2.4 (11 km). Lean the arrows outward 10–15 km per 5 km of height (the slope in `VM/tdr_section.png`).
- **Caveats to state (caption/report, not voice):**
  - The TDR is 8 h before landfall and centred over the Gulf (25.79 N 82.86 W), while the HRRR u_r is at 18 UTC. Both are the same mature eyewall (TDR RMW 33 km; HRRR f00 RMW ≈ 30–34 km).
  - TDR coverage is 60–90 % of each ring between 2 and 11 km, with no data below ≈ 1.5 km inside 75 km and none in the eye.
- **Source line (data frames):** "Vertical wind: NOAA P-3 tail Doppler radar, 28 Sep 2022 ≈ 10 UTC — NOAA AOML Hurricane Research Division · Winds: NOAA HRRR (public domain)".

## 4. Licence verdicts

| Data | Verdict | Attribution / citation |
|---|---|---|
| **HRD TDR Level 2** (`220928H1_1023_xy.nc.gz`, 8,266,017 B, sha256 a36e853f…a3d) | Free to download. HRD asks: acknowledge NOAA/AOML/HRD, cite the methods papers, and (TC-RADAR README §6) **notify the HRD radar team lead** of the project. **Original files: `redistributable: no`.** Derived ring-mean pictures and numbers in the movie are fine with the credit. Do not commit the raw or 3-D files; the 48 kB ring-mean `VM/tdr_rz.nc` stays on G: until the user decides. | "NOAA AOML Hurricane Research Division"; Gamache 1995 / Reasor et al. 2009 (synthesis); Fischer, M. S., R. F. Rogers, P. D. Reasor and J. F. Gamache, 2022, Mon. Wea. Rev., 150, 2255–2278, doi:10.1175/MWR-D-21-0223.1 |
| HRRR GRIB (NOAA NODD, AWS `noaa-hrrr-bdp-pds`) | public domain, `redistributable: yes` | Dowell et al. 2022, Wea. Forecasting 37, 1371–1395 |
| ERA5 (existing products) | CC-BY 4.0 | "Contains modified Copernicus Climate Change Service information 2026" |

**Only the user can do:** send the courtesy note to the HRD radar team lead (address in `raw/HRD-TDR/TC_RADAR_README.pdf` §6) before the movie is published.

## 5. Routes, sizes, pitfalls

- **AOML web tree is down:** every `https://www.aoml.noaa.gov/ftp/...` URL redirects (302) to a placeholder (`temp.aoml.oarcloud.noaa.gov`, then CloudFront 403). **Anonymous FTP `ftp.aoml.noaa.gov/pub/hrd/data/radar/level2/2022/ian/<mission>/` works.**
  - `fetch()` has no FTP downloader, so `VM/_scripts/get_tdr.py` passes a `retrieve=` ftplib callable with `expected_bytes` from FTP `SIZE`. The guard, the log and the before/after report all applied.
  - Other Ian missions with TDR: 20220927H1 (3 analyses), 20220927I1, N1, N2. **20220928H1 is the only one on landfall day.**
  - The Level-3 TC-RADAR merged files are 6–11 GB each; not fetched.
- **TDR file:** dims `(x, y, level, time)`, x/y −249 … 249 km at 2 km (storm-centred), levels 0–18 km every 0.5 km. Variables W, U, V, RADIAL_WIND, TANGENTIAL_WIND, REFLECTIVITY, VORT, WIND_SPEED (m/s, storm-relative). Origin 25.79 N 82.86 W; storm motion 4.46 m/s north, 1.2 m/s east. Fall speed is removed during interpolation. Analysis level 2 (research quality, synthesised 2023-02-03). Note the transposed order (`x, y`) when plotting.
- **HRRR GRIB:**
  - Whole files through `fetch()`; no byte-range door exists. They are reduced at once, message by message with eccodes, to the box: `VM/hrrr_prs_{18z_f00,17z_f01,16z_f02}.nc`, 37 levels 100–1000 hPa, ≈ 10–11 MB each.
  - **The prs zarr store has `_anl` only, no `_fcst`.** The sfc fcst zarr has only 700-hPa DZDT and the hourly max up/down VV, so the forecast pressure-level w needs the GRIB.
  - Winds are grid-relative and were rotated with `fluidpy.data.hrrr.earth_relative`. Pressure levels below the sea (HGT < 0) were dropped.
- **ω → w:** hydrostatic, w = −ω/(ρg), ρ = p/(R_d T_v), T_v = T(1 + 0.608 q) from HRRR T and q. For ERA5 and the zarr anl product (no T), T_v is box-mean from the hypsometric equation.
- **Centres:** each source uses its own wind centre (max 850-hPa ring-mean v_t at 20–40 km): f00 26.48 N 82.39 W; f01 26.35 N 82.42 W; f02 26.35 N 82.38 W. f01/f02 match their own 925-hPa height minima within 3 km, so the f01 centre ≈ 15 km south of f00 is the model's track, not a centre-finding error. The TDR uses its analysis origin (the HRD storm centre).
- **Colab route:** none yet. If adopted, the movie only needs the ring-mean TDR section (≈ 50 kB). Keep it on G: or ship it as a movie data file after the HRD notification. HRRR-derived sections are public domain and small.

## 6. Downloads and disk

| File | Bytes | Time |
|---|---|---|
| `raw/HRD-TDR/220928H1_1023_xy.nc.gz` | 8,266,017 | 8.9 s |
| `raw/HRD-TDR/220928H1_1023_vert_inbound.nc.gz` | 108,128 | 0.9 s |
| `raw/HRD-TDR/TC_RADAR_README.pdf` | 1,045,473 | 2.4 s |
| `raw/HRRR-aws/hrrr.t17z.wrfprsf01.grib2.idx` | 38,091 | 0.5 s |
| `raw/HRRR-aws/hrrr.t17z.wrfprsf01.grib2` | 408,288,101 | 102.5 s |
| `raw/HRRR-aws/hrrr.t18z.wrfprsf00.grib2` | 389,287,328 | 103.8 s |
| `raw/HRRR-aws/hrrr.t16z.wrfprsf02.grib2` | 410,534,112 | 105.0 s |
| **total** | **1,217,567,250** (≈ 1.22 GB) | ≈ 5.4 min |

- Free space before: C: 115.2 GB, G: 489.4 GB (project 97.64 GB of 150).
- Free space after: C: 115.2 GB, G: 487.8 GB (project 99.19 GB of 150; raw 4.62, scratch 70.68).
- `VM/` holds 103 MB, including the 74.5 MB decompressed TDR copy, which can be deleted and re-made from raw.
- **Evictions:** none. The three HRRR GRIBs (1.21 GB) are re-downloadable and their reduced products exist. **They are not in `data/registry.yaml`** (this task may not write it), so the guard cannot evict them automatically. Either register `HRRR-aws` or delete them by hand.
