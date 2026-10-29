# ch00_reading_weather_maps — data needs, new functions and CHECK rows, v2 (movie-director, 2026-10-29)

v2 expands the movie to 85 scenes (user 2026-10-29: very detailed, 40–50 min). Every v1 item that is still used keeps
its id (A1–A7, D1–D13, F1–F12, RM01–RM45, C1–C7); v2 adds **N1–N11** (data), **F13–F22** (functions), **RM46–RM89**
(CHECK rows) and **C8–C19** (cited facts). Scene ids below are the v2 ids (`storyboard.yaml`).

Every download goes through `fluidpy.data.fetch()` and `tools/disk_guard.py` (G: floor 50 GB, project cap 150 GB, C:
floor 40 GB); Earth Engine / GIBS / STAC responses are archived under `G:/…/aofd-data/raw/<GEE|GIBS|STAC>/…`. Movie
products go to `movies/ch00/ch00_reading_weather_maps/data/` (small JSON/bin) or `data/derived/ch00/` (≤ 10 MB each).
Credits go to `manifest.json` and the registry; on screen only the HOUSE_STYLE §5 data-source line.
**Disk at v2 planning (2026-10-29): C: 70 GB free, G: 524 GB free.**

**Director planning reads (2026-10-29, not products).** To keep the narration honest, the director read a few numbers
straight into memory or the session scratchpad (deleted afterwards; nothing written under `aofd-data`, nothing
registered): NCSS subsets of the GFS forecast runs valid 18 UTC 27 Oct 2026 (MSLP, 35–50 KB each) and of the 18 UTC
250-hPa wind; three IEM n0q PNGs (in memory); one IEM ASOS CSV for Oklahoma 20 May 2013 (46 lines); and existing files
on G: (ERA5 A1, the ERA5 ten-level file, IGRA2 Trappes, NCEP R1 LTM, the IEM all-station METAR CSV, Himawari). **The
data-scout must still fetch N2–N7 properly through `fluidpy.data.fetch()` and register them.** The planning numbers are
listed in §D and re-asserted by the CHECK rows; if a CHECK fails, the narration changes to the data.

## A. Already on disk (re-use, no download)
| Id | What | Where | v2 scenes |
|---|---|---|---|
| A1 | ERA5 hourly u10, v10, msl, t2m, 1 Nov 00 → 2 Nov 23 UTC 2023, 35–70° N, 50° W–10° E | `G:/…/raw/ERA5-ARCO/era5_ciaran_2023_u10-v10-msl-t2m_2023-11-01T00_2023-11-02T23_1h.nc` | s17, s19 (tendency 00→03 UTC), s41 (Brest msl shape), s74 (track minimum) |
| A2 | ERA5 Ciarán 09/12/13/15 UTC 2 Nov: msl, u10, v10, t2m; 850/500 hPa z, u, v | `data/derived/ch00/ciaran_2023_{sfc,upper}_1102.{bin,json}` | s08, s12, s14–s16, s45, s50–s51 |
| A3 | ERA5 850 hPa t, q, u, v hourly 12 UTC 1 Nov → 12 UTC 2 Nov | `data/derived/ch00/era5_ciaran_2023_850hPa_1h.nc` | s27, s28 (objective fronts 03 UTC) |
| A4 | MODIS Aqua true colour 2 Nov 2023 | `data/derived/ch00/ciaran_modis_aqua_truecolour_2023-11-02.{jpg,json}` | s58 |
| A5 | Natural Earth coast/admin/places/land | `data/derived/ch00/ciaran_*_10m.geojson`, `G:/…/raw/NE-*` | all maps |
| A6 | Blue Marble NG 2004 | `movies/ch00/ch00_cross_product_why/data/real/globe_bmng_*.jpg`, `G:/…/raw/BMNG-2004/` | globes |
| A7 | GFS 00 UTC 27 Oct 2026 MSLP + orography with extrema (masked and unmasked) | `data/derived/ch00/gfs_mslp_latest.nc` | s11 (Karakoram 1057.8 hPa unmasked), s18 |
| D1 (done) | ISD Brest 1–2 Nov 2023 + 246 SYNOPs at 03 UTC 2 Nov | `data/derived/ch00/rwm_isd_*.json` | s13, s17, s22–s23, s27, s28, s33–s36, s41–s43 |
| D3 (done) | ERA5 global z500 12 UTC 2 Nov 2023 | `data/derived/ch00/rwm_era5_z500_global_*` | s51 (axes check) |
| D6 (done) | GFS 18 UTC 27 Oct 2026 msl, z500, u10, v10; 00 UTC global | `data/derived/ch00/rwm_gfs_2026-10-27T{18_chart,00_global_0p5}.*` | s01, s20, s54, s76–s81 |
| D7 (done) | WPC CODSUS 18 UTC 27 Oct 2026 (hi-res) | `data/derived/ch00/rwm_wpc_codsus_2026-10-27T18.geojson` | s01, s20, s24–s25, s62, s76–s81 |
| D8 (done) | IEM METARs 17:50–18:10 UTC 27 Oct 2026 (box product) + **raw all-station CSV (4 876 reports)** | `data/derived/ch00/rwm_iem_metar_*.json`; `G:/…/raw/IEM-METAR/iem_metar_all_2026-10-27T1750Z_2026-10-27T1810Z.csv` | s29, s32, s36–s37, s54, s66, s79 |
| D9 (done) | GOES-19 bands 2/8/13 at 18:00 UTC + 18–23 UTC loop | `data/derived/ch00/rwm_goes19_*` | s00–s01, s61–s62, s76 |
| D10/D11 (done) | MODIS band 31 BT 2 Nov 2023; Himawari-9 band 13 BT 00 UTC 27 Oct 2026 | `data/derived/ch00/rwm_{modis_aqua_b31,himawari9_b13}_bt_*` | s59–s60, s18, s63 |
| E1 | IGRA2 Trappes period-of-record file (contains 00 UTC 2 Nov 2023, top 18.4 hPa) | `G:/…/raw/IGRA2/FRM00007145-data.txt.zip` | s55–s56 (product N9) |
| E2 | NCEP/NCAR R1 monthly long-term means 1991–2020 (slp) — registry `NCEP1-sfc-ltm` | `G:/…/raw/NCEP1-sfc-ltm/slp.mon.ltm.1991-2020.nc` | s82 (product N10) |
| E3 | ERA5 Brest hourly t2m, d2m, msl 1–2 Nov 2023 (registry `ERA5-CDS-timeseries`) | `data/derived/ch00/era5_brest_2023-11-01_02_t2m_d2m_msl_1h.nc` | s23 (Td 13.0 °C at 20 UTC) |
| E4 | ERA5 monthly t2m anomaly Sep 2026 (registry `ERA5-CDS-monthly-t2m`) | `data/derived/ch00/era5_t2m_anom_2026-09_1deg.nc` | s11 (value vs anomaly thumbnails) |
| E5 | ETOPO 2022 Brittany terrain (weather-basics product) | `movies/ch00/ch00_weather_basics/data/brittany_etopo.{bin,json}` | s13 |

## B. New data for v2 (⚠ = rolling archive, fetch at once)
| Id | Dataset (registry key) | Subset | Size (est.) | Licence / credit | Scenes | Fetch route |
|---|---|---|---|---|---|---|
| **N1** | **ERA5 ten levels round Ciarán, 12 UTC 2 Nov 2023** — already on G: but **not registered** (new key `ERA5-ARCO-ciaran2023-10lev`) | t, z, u, v at 1000, 925, 850, 700, 600, 500, 400, 300, 250, 200 hPa; 30–70° N, 40° W–20° E, 0.25° (`G:/…/raw/ERA5-ARCO/era5_captest_ciaran_upper_t-z-u-v_1000-…-200_2023-11-02T12_2023-11-02T12_1h.nc`, 6 MB) → product: 1000/850/700/500/300/250 hPa, float32 bin ≈ 4.5 MB | 0 (exists) | CC BY 4.0 — "Contains modified Copernicus Climate Change Service information 2023" | s47, s48, s49, s52, s53, s54, s74 | already fetched by `fluidpy.data.era5_arco.fetch_box` (provenance attrs inside the file); write `reports/data/ERA5-ARCO-ciaran2023-10lev.md` + registry entry; product via a new `movie_rwm.era5_ciaran_10lev()` |
| **N2 ⚠** | GFS 0.25° analysis 18 UTC 27 Oct 2026, extra fields (`GFS-ANL`, extends D6) | `Geopotential_height_isobaric` @ 1000 hPa; `Temperature_isobaric`, `u/v-component_of_wind_isobaric` @ 850 hPa; `u/v-component_of_wind_isobaric` @ 250 hPa; 10–80° N, 170° W–10° E | ≈ 4 MB per variable-level raw → ≈ 6 MB product | US Government (NOAA/NCEP), public domain; "NOAA NCEP GFS analysis via Unidata THREDDS" | s54 (thickness at La Grande), s80 (jet, trough) | `fluidpy.data.gfs.fetch_analysis("2026-10-27T18:00", variables=…, level=1000 / 850 / 250)`; **the 18 UTC 27 Oct cycle leaves THREDDS ≈ 3 Nov 2026** (planning read of the 250-hPa wind succeeded on 2026-10-29: max 66.4 m/s at 38.25° N 53.75° W) |
| **N3 ⚠⚠** | **GFS 0.25° forecast runs valid 18 UTC 27 Oct 2026** (new key `GFS-FC`) | runs **18 UTC 22 Oct (T+120)**, 18 UTC 24 Oct (T+0, 24, 48, 72), 18 UTC 26 Oct (T+24), 18 UTC 27 Oct (T+0 = analysis check); `Pressure_reduced_to_MSL_msl`, `Geopotential_height_isobaric` @ 500, 6-h precipitation (`Total_precipitation_surface_6_Hour_Accumulation` or the mixed-interval accumulation — check the run's `dataset.xml`), 10–80° N, 170° W–10° E | ≈ 1–3 MB per field and time | public domain (NOAA/NCEP) | s10, s68, s69, s70, s71, s81 | new `fluidpy.data.gfs.fetch_forecast(init, fhour or valid, variables, level, box)` (F16) on `Global_0p25deg/GFS_Global_0p25deg_<init>.grib2` with `time=<valid>`; **the 22 Oct 18 UTC run is the oldest on THREDDS today (catalogue checked 2026-10-29: 22 Oct 00 UTC … 29 Oct 00 UTC) — fetch it today.** Afterwards only NCAR RDA ds084.1 or AWS `noaa-gfs-bdp-pds` (GRIB2, needs a decoder) |
| **N4** | **GEFS members** (new key `GEFS-AWS`) | `gec00` + `gep01…gep30` (31 members), `pgrb2ap5`, runs 18 UTC 22 Oct (f120) and 18 UTC 26 Oct (f024): `HGT:500 mb`, `PRMSL:mean sea level` via the `.idx` byte ranges (≈ 0.5 MB per field per member) | ≈ 60 MB raw → ≈ 8 MB product (contours + member low centres) | NOAA Open Data Dissemination (NODD), public domain; "NOAA NCEP GEFS via the AWS Open Data Registry" | s72, s73, s81 | AWS `https://noaa-gefs-pds.s3.amazonaws.com/gefs.20261022/18/atmos/pgrb2ap5/gep01.t18z.pgrb2a.0p50.f120` (+ `.idx`; listing checked 2026-10-29); **needs a GRIB2 decoder: `.venv` has none (no cfgrib/eccodes/pygrib). Proposed install: `eccodes` (pip wheel with the bundled library, Apache-2.0) + `cfgrib` (Apache-2.0) into `.venv` — orchestrator decision; report disk before/after.** Permanent archive (not urgent). **Runner-up (no GRIB):** THREDDS "HGEFS Quarter Degree Ensemble Forecast – Statistics" (mean and spread, NCSS netCDF, rolling): s73 then becomes a spread map and loses its spaghetti |
| **N5** | **IEM NEXRAD n0q composite reflectivity** (new key `IEM-N0Q`) | 8-bit PNG + `.wld` (0.005°, 50° N/126° W origin, 12200 × 5400): **2026-10-27 18:00 UTC**; **2020-08-10 15:00–19:00 UTC** (hourly, or 5-min for a smooth loop) | ≈ 1.6 MB per frame | NWS NEXRAD data public domain; IEM asks for credit: "NEXRAD composite via the Iowa Environmental Mesonet (Iowa State University)" | s66, s67 | `https://mesonet.agron.iastate.edu/archive/data/YYYY/MM/DD/GIS/uscomp/n0q_YYYYMMDDHHMM.png` (HTTP 200 checked 2026-10-29 for 2026-10-27 18:00 and 2022-09-28 18:00) through `fluidpy.data.fetch` in a new `fluidpy.data.iem_radar` (F15) |
| N6 (optional) | NEXRAD Level II KDMX 10 Aug 2020 ≈ 16–18 UTC (runner-up for N5 in s67) | one volume per 5 min | ≈ 10 MB each | public domain (NOAA NODD) | s67 | AWS `unidata-nexrad-level2/2020/08/10/KDMX/…` (listing format checked 2026-10-29 on KAKQ/KTBW), read with `metpy.io.Level2File` (MetPy installed) |
| **N7** | IEM ASOS/METAR Oklahoma, 20 May 2013 19:50–20:05 UTC (`IEM-METAR`, extends D8) | network `OK_ASOS` (+ `TX_ASOS` for context), ≈ 50 stations | < 50 kB | as D8 (NWS/FAA public domain; IEM credit) | s26 (dryline) | `fluidpy.data.metar.fetch` with a `network=` option (small F6 extension) — IEM `cgi-bin/request/asos.py?network=OK_ASOS&…&report_type=3` |
| N8 | product from the existing raw all-station METAR CSV (D8) | PAFB, CYAH, ESKS, MDJB (s32, s37); K4R5, KHPT, KCOQ and every RA/SN station in 42–49° N 97–87° W (s66); every station in 34–45° N 80–68° W (s81) | < 100 kB | as D8 (non-US reports WMO Res. 40, non-commercial) | s32, s36–s37, s54, s66, s81 | no download: `fluidpy.data.metar.read` on the raw CSV |
| N9 | product from the existing IGRA2 Trappes file (E1) | the 00 UTC 2 Nov 2023 sounding (52 levels, launch 23:15 UTC) | < 20 kB | NOAA NCEI IGRA2, public domain | s55, s56 | no download: `fluidpy.data.igra.find_sounding` + `fill_heights` |
| N10 | product from the NCEP R1 LTM (E2) | November mean slp, North Atlantic 20–80° N, 80° W–20° E | < 1 MB | NOAA PSL, public domain (PSL acknowledgement) | s82 | no download: `fluidpy.data.psl` reader |
| N11 (optional) | GOES-19 C02/C13 00–06 UTC 28 Oct 2026 (the v1 loop extension, not yet fetched) | as D9 | ≈ 25 MB raw | public domain | s61 loop | `fluidpy.data.goes.fetch_cmi_ee` (Earth Engine keeps the collection) |

Dropped from v1: nothing to undo. The v2 cut of Hurricane Ian radar means no Ian radar fetch; v1 D2/D12/D13 stay optional runners-up.

## C. Library functions
### Existing, verified (reports/ch00_rwm_verification.md, PASS)
F1 `fluidpy.geo.sphere.*` · F2 `fluidpy.geo.mapproj.*` · F3–F5 `fluidpy.diag.station.*` · F10 `fluidpy.diag.axes.*` ·
F6 `fluidpy.data.metar` · F7 `fluidpy.data.wpc` · F8 `fluidpy.data.goes` (GOES-19 + Earth Engine) · F9 `fluidpy.data.gibs.colormap_values` ·
F11 `fluidpy.data.isd` · F12 `fluidpy.data.gfs.fetch_analysis(level=, height=, collection=)`.
Also used: `fluidpy.geo.atmos.{geostrophic_wind_from_msl, hypsometric_thickness, pressure_height_standard, scale_height,
wind_direction_from}`, `fluidpy.diag.advection.advection`, `fluidpy.diag.fronts.front_lines`,
`fluidpy.diag.cyclone.{storm_centre, track_by_continuity}`, `fluidpy.diag.trajectories`, `fluidpy.data.igra.{find_sounding,
fill_heights, wmo_tropopause}`, `fluidpy.data.psl`, `fluidpy.geo.vectors.norm`, `fluidpy.geo.constants.KNOT`.
Known defect to respect: `station.interpolate_stations` returns NaN at hull stations (strict xfail) — the s43 hand
analysis must not query hull stations at their own positions.

### New in v2 (implementer writes them with tests; data-scout the `fluidpy.data` ones)
| Id | Function | Formula / method | Lives in | V-levels (planned) |
|---|---|---|---|---|
| F13 | `decode_metar` remarks: `SLPppp` (sea-level pressure, 9/10 prefix rule), `Tsnnnsnnn` (T, Td in tenths), `5appp` (tendency code + tenths), plus a `remarks` dict | NWS FMH-1 ch. 12 remark groups | `fluidpy/diag/station.py` | V1 the real PAFB report → SLP 1032.9, T 0.9 / Td 0.9, a = 2, +1.2 hPa; V1 KSXT (`SLP194`, `53004`, `T00280022`); V5 SLP and T vs IEM's decoded columns over the 669-report set; V7 sign digits (T1xxx), SLP 9/10 boundary |
| F14 | `fluidpy.diag.radar`: `echo_range(dt, c)`, `dbz_to_z`, `z_to_dbz`, `z_to_rain_rate(Z, a=200, b=1.6)`, `rain_rate_to_z`, `beam_height(r, elev, ke=4/3, a)` | r = cΔt/2; dBZ = 10 log₁₀ Z; Z = a R^b (Marshall & Palmer 1948); h = √(r² + (k a)² + 2 r k a sin θ) − k a (Doviak & Zrnić 1993 eq. 2.28b) | `fluidpy/diag/radar.py` (new) | V1 1 ms → 149.9 km; V1 20/40/50 dBZ → 0.648 / 11.53 / 48.6 mm/h; V7 round trips dBZ ↔ Z ↔ R; V1 beam height flat-Earth limit (a → ∞) and the small-angle form; V5 against the Doviak & Zrnić worked values (cited) |
| F15 | `fluidpy.data.iem_radar.fetch_n0q(time)` + `decode_n0q(png, wld)` → dBZ grid, lat/lon | IEM n0q palette: verify the index → dBZ rule from the IEM documentation (planning assumed dBZ = 0.5 k − 32.5; IEM may state −32.0) | `fluidpy/data/iem_radar.py` (new, key `IEM-N0Q`) | V1 known palette indices; V1 world-file geolocation (a city lands within one pixel); V5 the 2026-10-27 18 UTC composite vs a single NEXRAD Level II scan (N6) within 5 dBZ where both > 20 dBZ |
| F16 | `fluidpy.data.gfs.fetch_forecast(init, fhour=None, valid=None, variables=…, level=None, box=None)` | NCSS on the forecast collection with `time=<valid>`; valid = init + fhour | `fluidpy/data/gfs.py` | V1 valid-time arithmetic; V1 T+0 equals `fetch_analysis(collection="fc")` (same bytes after the subset); V1 6-h precipitation ≥ 0 and the variable's interval metadata = 6 h |
| F17 | `fluidpy.data.gefs.fetch_members(init, fhour, fields, members=31)` (AWS byte ranges via `.idx`) and `fluidpy.diag.ensemble.{spread, probability, member_contours}` | GRIB2 decode (eccodes/cfgrib, if approved); spread = member standard deviation; probability = fraction of members over a threshold; contours by marching squares (matplotlib `contour`) | `fluidpy/data/gefs.py` (new, key `GEFS-AWS`), `fluidpy/diag/ensemble.py` (new) | V1 `.idx` byte-range parse on a stored index; V1 31 members present; V1 probability 12/31 = 0.387; V1 spread of identical members = 0; V7 spread grows with lead time (T+120 > T+24 on the real runs, RM84) |
| F18 | `fluidpy.geo.atmos.layer_mean_temperature(thickness, p1, p2)` | T̄ = g Δz / (R ln(p1/p2)), the inverse of Vallis (2.166) at constant T | `fluidpy/geo/atmos.py` | V1 round trip with `hypsometric_thickness`; V1 Brest 5371 m → 264.7 K; V7 p1 = p2 raises |
| F19 | `fluidpy.diag.sounding.skewt_xy(T, p, skew_deg=45, p_bottom=1050, p_top=100)` and `level_crossing(z, T, value=273.15)` | x = T + skew · ln(p₀/p) scaling, y = −ln p; linear interpolation of the first crossing | `fluidpy/diag/sounding.py` | V1 isotherms are straight lines of the stated slope; V1 equal log-p spacing; V1 crossing of a linear profile exact; V1 Trappes 850/700 hPa → 2.14 km |
| F20 | `fluidpy.diag.axes.saddle_points(field, lat, lon, smooth_km=300)` (cols) | grid points with ∇F ≈ 0 and Hessian determinant < 0 on the smoothed field (metric terms as in `zonal_extrema`) | `fluidpy/diag/axes.py` | V1 z = x² − y² on a sphere patch; V7 maxima/minima rejected; data RM53 |
| F21 | `fluidpy.diag.station.metar_wx_to_ww(wxcodes)` → WMO ww (code table 4677) for the glyph | mapping for −SN/SN/+SN, FG, BR, −DZ/DZ, −RA/RA/+RA, SHRA, TS, TSRA (the codes this movie shows) | `fluidpy/diag/station.py` | V1 table rows vs WMO-No. 306 code table 4677; V1 the four s37 stations |
| F22 | `fluidpy.geo.orbits.geostationary_altitude(GM, Omega_sidereal, a)` | r = (GM / Ω²)^(1/3); altitude = r − a | `fluidpy/geo/orbits.py` (new; or `constants`) | V1 35 786 km within 1 km (Ω = 7.2921×10⁻⁵ s⁻¹, GM = 3.986004418×10¹⁴ m³ s⁻², equatorial a = 6378.137 km) |

## D. CHECK rows the builder must assert (RM-ids in the storyboard `check_rows`)
**Kept from v1 (wording of v1 data_needs §D):** RM01–RM18, RM21–RM45 as written there, with these **v2 updates**:
RM19 — the trough axis comes from `diag.axes.trough_ridge_axes` (verifier): at 4.9–6.8° W south of 48.5° N, bending east
to ≈ 0° at 50–55° N; never a straight line; the narration says "between five and seven degrees west" and "bends east".
RM20 — 83.0 m/s (250 hPa, 46.75° N 19.5° W, 12 UTC 2 Nov 2023) = 161.3 kt → 160 → `barb_parts` = (3 pennants, 1 long,
0 short) [v1's 68.65 m/s → 135 kt barb is no longer shown]. RM27 — Scilly St Mary's (03800099999) excluded (suspect).
RM44 — METAR part FAILED in the data (1° turn): the narration says the Virginia front is weak; IR part 56 % < 240 K →
"much of". RM36–RM37 — now in s17. RM39–RM40 — now in s18.

**New in v2** (planning values from the director's reads on 2026-10-29; ranges are the assertion):
| Id | Scene | Assert |
|---|---|---|
| RM46 | s09 | zoneinfo: Europe/Paris 2023-11-02T03Z = 04:00 (UTC+1); America/New_York 2026-10-27T18Z = 14:00 (UTC−4) |
| RM47 | s10, s68 | GFS run 18Z 24 Oct + 72 h = valid 18Z 27 Oct (file time coordinate) |
| RM48 | s11 | GFS 00Z 27 Oct unmasked MSLP maximum 1057–1059 hPa within 34–38° N 74–79° E (reports/data/GFS-ANL.md: 1057.8 at 36.25° N 76.5° E) |
| RM49 | s13 | Brest 18 UTC 1 Nov SYNOP: station p 971.8, SLP 983.3; R T/(g p) at 10.3 °C, 977.5 hPa = 8.4–8.6 m/hPa; 11.5 × 8.5 = 97–99 m vs ISD elevation 99.06 m |
| RM50 | s12 | ≥ 5 closed 4-hPa isobars round the ERA5 low at 12 UTC 2 Nov |
| RM51 | s16 | ERA5 12 UTC 2 Nov at 44° N 10° W: \|∇p\| 2.9–3.1 hPa/100 km; \|u_g\| (ρ₀ 1.25) 23–25 m/s; \|u₁₀\| 16–18 m/s; ratio 0.65–0.75; isobar curvature small (director read: 3.00 hPa/100 km, 23.7, 16.6, 0.70; directions 288° / 283°) |
| RM52 | s19 | ERA5 00→03 UTC 2 Nov: max fall −10.5…−11.5 hPa at 49.5–51° N 4–1° W (read: −10.9 at 50.25° N 2.5° W); max rise +14…+16 at 48.5–49.5° N 8–6° W (read: +15.0 at 49.0° N 7.0° W); Brest grid +4.9 vs SYNOP +5.5; track 03→12 UTC bearing 40–65° (read: 52°, 473 km) |
| RM53 | s20 | at least one saddle (F20) between two H and two L in the s20 frame; Hessian determinant < 0 |
| RM54 | s23 | ERA5 d2m at Brest 20 UTC 1 Nov 12.5–13.5 °C (ERA5-CDS-timeseries: 13.0) |
| RM55 | s26 | Duncan (DUC) Td 20–22 °C, wind 170–210°; Lawton (LAW) Td 5–7 °C, wind 250–290°; distance 40–48 km (read: 21.0 / 6.1 °C, 190° / 270°, 44 km) |
| RM56 | s29 | ≥ 4 700 distinct stations in the 17:50–18:10 UTC window (reports/data/IEM-METAR.md: 4 730) |
| RM57 | s32, s40 | PAFB 271755Z decodes to 070° 4 kt, 1/8 SM, FG, VV002, A3047 → 1031.8 hPa, SLP 1032.9, T/Td 0.9/0.9 °C, 5appp a = 2 +1.2 hPa; '329' → 1032.9 |
| RM58 | s36 | METAR cover → oktas: FEW 1–2, SCT 3–4, BKN 5–7, OVC 8 (WMO/ICAO) |
| RM59 | s37 | CYAH `-SN` M01/M03; PAFB `FG`; ESKS `-DZ` 09/09; MDJB `TSRA` 23/22, all valid 17:50–18:00 UTC 27 Oct 2026 |
| RM60 | s41 | ERA5 Brest msl 15→18 UTC 1 Nov falls throughout (code 8 shape consistent) and 00→03 UTC 2 Nov falls then rises (code 3) |
| RM62 | s47 | `pressure_height_standard`: 850 → 1457 m, 700 → 3012, 500 → 5574, 300 → 9164, 250 → 10 363 (±5 m) |
| RM63 | s48 | ERA5 850-hPa T 12 UTC 2 Nov: Brest 0.5–1.1 °C (read 0.8); Genoa 9.6–10.6 (10.1); box max 13.2–14.2 at 39.5–41° N 1° W–1° E (13.7 at 40.25° N 0.25° E) |
| RM64 | s49 | at 43.5° N 3.0° E: \|∇T\| 5.0–5.4 K/100 km (5.16); \|v\| 18–19 m/s from 285–300° (18.5, 292°); −v·∇T −3.3…−3.6 K/h (−3.42); angle wind–gradient ≈ 180° |
| RM65 | s51 | ≥ 2 closed 60-m z500 contours round the 5114-m minimum (52.5° N 1.25° E) |
| RM67 | s52 | ERA5 250-hPa max 82–84 m/s at 46–47.5° N 21–18° W (read: 83.0 at 46.75° N 19.5° W, from 319°); 161 kt; 299 km/h; the 70-m/s isotach encloses the streak |
| RM68 | s53 | thickness 1000–500 hPa at Brest 12 UTC 2 Nov 5350–5390 m (5371) → T̄ 264–266 K (264.7), −8.4 °C |
| RM69 | s54 | Brest thickness < 5400 m with SYNOP T 9.2 °C and rain; GFS 18Z 27 Oct thickness at CYAH (53.75° N 73.68° W) < 5350 m (director estimate from msl: ≈ 5250 m; assert with the real z1000 from N2); CYAH METAR `-SN`, M01 |
| RM70 | s55 | Trappes 00 UTC 2 Nov 2023: dew-point depression ≤ 0.4 K from 964 to 554 hPa; launch 23:15 UTC 1 Nov |
| RM71 | s56 | freezing level 2.0–2.2 km (linear 850/700: 2.14 km); WMO tropopause 10.0–10.4 km (10 180 m), −56…−58 °C (216.2 K); winds 925 hPa 180° 21 m/s, 250 hPa 235° 49 m/s |
| RM72 | s57 | geostationary altitude 35 786 ± 1 km (F22); Aqua altitude ≈ 705 km (cited C12); GOES-19 full-disk cadence 10 min (`MCMIPF` timestamps) |
| RM73 | s63 | Himawari B13 within 60 km of 14.5° N 162.5° E: eye max 295–302 K (reports/data/NASA-GIBS-rwm.md: ≈ 300 K); min BT within 200 km 195–199 K (director read in a 2° box: 196.5 K = −76.7 °C); (27 − (−76))/6.5 = 15.8 km |
| RM74 | s64 | `echo_range(1e-3)` = 149.9 km |
| RM75 | s65 | Marshall–Palmer: 20 dBZ → 0.648, 40 → 11.53, 50 → 48.6 mm/h |
| RM76 | s66 | n0q 18:00 UTC 27 Oct 2026: fraction > 20 dBZ in 42–49° N 97–87° W ≥ 3 % (director read 4.3 %) and greater than in 34–45° N 80–68° W (0.0 %); ≥ 3 METARs with RA codes inside the > 20 dBZ area; K4R5 `+RA` |
| RM77 | s67 | n0q 17:00 UTC 10 Aug 2020, 40.5–43.5° N 96.5–90° W: > 40 dBZ ≥ 8 % (read 9.4 %), max ≥ 55 dBZ (63.5); leading edge moves east ≥ 15 m/s over 15–19 UTC |
| RM80 | s69 | all four panels valid 18 UTC 27 Oct 2026; T+0 MSLP = the analysis product within 0.5 hPa |
| RM81 | s70 | tracked from the WPC 982 low (43.0° N 43.0° W) by `track_by_continuity`; planning read (box minimum 34–50° N 58–28° W): T+120 1001.4 hPa at 39.0° N 46.25° W, 477 km SW; T+72 992.7 at 41.0° N 43.0° W, 199 km; T+24 984.7 at 42.25° N 43.25° W, 59 km; analysis 982.1 at 42.75° N 43.5° W. Assert each within ±1.5 hPa and ±60 km of these; the narration follows the tracked values |
| RM82 | s71 | GFS T+24 (init 18Z 26 Oct) 6-h precipitation maximum within 300 km of the WPC cold front of the 982 low or of its centre; else the sentence is re-worded to the data |
| RM83 | s72 | GEFS member count 31 (gec00 + gep01–gep30) |
| RM84 | s73 | mean member spread of z500 along the analysis 5520-m line: T+120 > 2 × T+24 |
| RM85 | s74 | ERA5 12 UTC 2 Nov: msl centre (52.5° N 1.75° E) and z500 minimum (52.5° N 1.25° E) 25–45 km apart (34 km); A1 track minimum 953.7 hPa at 03–04 UTC < 955.9 at 12 UTC |
| RM87 | s80 | GFS z500 18Z 27 Oct: a `diag.axes` trough 6–10° W of the 982 low (read: along ≈ 52° W, 40.5–61.8° N); GFS 250-hPa max 64–68 m/s south of 41° N (read: 66.4 at 38.25° N 53.75° W) |
| RM88 | s81 | METARs in 34–45° N 80–68° W at 18 UTC 27 Oct: no precipitation codes (box product: only HZ and VCSH); n0q fraction > 20 dBZ there < 0.5 %; WPC H 1033 over Quebec |
| RM89 | s82 | NCEP R1 Nov LTM 1991–2020: Icelandic low 998–1000 hPa near 62.5° N 30° W (read 999.1); Azores high 1021–1023 near 35° N 25° W (1021.6) |

Spare ids (scenes cut in the v2 tightening; kept so the numbering stays stable): RM61 (METAR→plot steps), RM66 (hemispheric
500 hPa), RM78 (Ian radar), RM79 (beam height), RM86 (track steps).

**Rule.** If a CHECK fails, the narration changes to the data (never the reverse); the director re-runs the TTS dry run
for the changed sentences.

## E. Cited facts (the research scout verifies each before the build; source into the manifest, nothing on screen)
| Id | Claim (scene) | Source to check | Fallback |
|---|---|---|---|
| C1 | ≈ 1.2 million homes in France lost power (s75) | Enedis press release 2 Nov 2023 (verified per the orchestrator notes) | — |
| C2 | Synoptic charts became possible with the telegraph in the 1850s (s76) | Météo-France history (Le Verrier, after 14 Nov 1854); Met Office history (FitzRoy, 1861) | cut the sentence |
| C3 | Buys Ballot stated the rule in 1857 (s17) | KNMI history; Buys Ballot (1857), *Comptes Rendus* 45 | drop the year |
| C5 | Africa ≈ 14 × Greenland (s06) | CIA World Factbook; `sphere.polygon_area` on Natural Earth (RM08) | — |
| C6 | Brest gust 84 kt = 156 km/h from SYNOP 911ff (s34, s75) | verified (reports/data/ISD.md; Météo-France Bretagne bulletin) | — |
| C7 | WMO/NWS conventions: barbs 5/10/50 kt, station-model layout, front symbols, tendency code table 0200 (s21–s27, s35–s41) | WMO-No. 306 (code tables 0200, 2700, 4677); NWS station-model guide; NWS Unified Surface Analysis Manual | — |
| C8 | A violent tornado struck Moore, Oklahoma, on the afternoon of 20 May 2013 (s26) | NWS Norman event page (EF5, 19:56–20:35 UTC) | say "a tornado" |
| C9 | The 10 Aug 2020 derecho was the costliest thunderstorm event in US records (s67) | NOAA NCEI Billion-Dollar Weather and Climate Disasters (2020 Central US derecho) | "one of the costliest" |
| C10 | Rules of thumb: 1000–500 hPa thickness 5400 m (North America) and ≈ 5280 m (Britain) for rain/snow (s54) | NWS/COMET training material for 540 dam; Met Office / Boyden (1964), *Meteorological Magazine* 93, for 528 dam | "a lower value" for Britain |
| C11 | Z = 200 R^1.6 (s65) | Marshall & Palmer (1948), *J. Meteor.* 5, 165–166 | — |
| C12 | Geostationary ≈ 36 000 km; polar orbiters ≈ 700 km (Aqua 705 km); GOES full disk every 10 min (s57) | F22; NASA Aqua mission page; NOAA GOES-R ABI Mode 6 | — |
| C13 | GEFS has 31 members (s72) | NCEP GEFS v12 documentation; the AWS listing (RM83) | say "about thirty" |
| C14 | Lanvéoc ≈ 170 km/h gust during Ciarán (s75) | Météo-France *Bulletin climatologique mensuel régional, Bretagne*, Nov 2023 (orchestrator note: Lanvéoc 170, Lannion 158) | name Lannion 158 instead |
| C15 | Mature lows whose upper low sits over the surface low have stopped deepening (s74) | standard synoptic texts (e.g. Bluestein 1993, vol. II; Met Office forecaster training); pointer to #42 | soften to "usually" |
| C16 | GFS 00Z 27 Oct 2026 MSLP 1057.8 hPa on the Karakoram is a sea-level-reduction artefact (s11) | reports/data/GFS-ANL.md (data) | — |
| C17 | US station plots write temperature in °F (s35) | NWS station-model guide (WPC) | drop the sentence |
| C18 | Squall line = dashes and pairs of dots; dryline = open half circles (s26) | NWS Unified Surface Analysis Manual (2013) | describe the symbol only on screen |
| C19 | Time zones: Europe/Paris UTC+1 on 2 Nov 2023 (summer time ended 29 Oct 2023); America/New_York UTC−4 on 27 Oct 2026 (ends 1 Nov 2026) (s09) | IANA tz database (RM46) | — |

## F. Credits (manifest and movie page; on screen only the source line)
ERA5 (CC BY 4.0, Copernicus/ECMWF) · NOAA NCEP GFS and GEFS (public domain; via Unidata THREDDS and the AWS Open Data
Registry) · NOAA NWS WPC coded surface bulletin via the Iowa Environmental Mesonet · NOAA NCEI ISD (non-US reports WMO
Res. 40, non-commercial) · Iowa Environmental Mesonet METAR archive and NEXRAD n0q mosaics (NWS data) · NOAA NCEI IGRA2 ·
NOAA GOES-19 ABI via Google Earth Engine · NASA EOSDIS GIBS / Worldview (MODIS Aqua; Himawari-9, JMA) · NCEP/NCAR
Reanalysis 1 (NOAA PSL) · NASA Blue Marble NG · Natural Earth · ETOPO 2022 (NOAA NCEI) · music and effects: tools/sound
(our own, CC0).

## G. Decisions for the orchestrator (v2)
1. **Fetch N3 today** (the 22 Oct 18 UTC GFS run is the oldest on THREDDS) and N2 before ≈ 3 Nov 2026.
2. **GRIB decoder for N4** (GEFS members): install `eccodes` + `cfgrib` in `.venv` (recommended), or accept the HGEFS
   mean/spread runner-up and turn s73 into a spread map.
3. **Mercator calculus** (v1 s13–s14), the great circle and the rhumb line now live only in the coordinates movie (#5);
   orchestrator decision 3 of 2026-10-27 was for the old position (4th in the series). Recommended: keep them out.
4. Register the already-downloaded ERA5 ten-level file (N1).
5. Lexicon: apply the `lexicon_proposed` entries (storyboard) before the build; the dry run used the current lexicon.

## Notes carried from v1 (still binding)
### Orchestrator decisions (2026-10-27)
1. Freeze the "latest" chart at 18 UTC / 00 UTC 27 Oct 2026. 2. Latitude symbol φ in Chapter 0 movies; provenance keeps
ϑ. 3. *(superseded by G3 above)* 4. Water vapour via Earth Engine (project uhiphd; archived on G:). 5. Do not show the WPC
chart image; render from the coded bulletin in house style. 6. Impacts only with cited sources (C1, C6, C14). 7. Length:
now 40–50 min (user 2026-10-29). 8. Library order as before; v2 adds F13–F22.

### Library results vs plan (implementer, 2026-10-27)
RM12 LCC k at 65° N = 1.022; RM18 z500 = 5072 / 5478 m (difference 406 m); RM19 axis endpoints depend on smoothing
(± 50–90 km): do not quote to 0.1°; RM10 ω = 57.7° at 60° N 150° E; RM05 drawn 500-km circles ×2.005 / ×3.919 wide;
RM23 MetPy `parse_metar` fails on the Brest `//////TCU` METAR (benchmark only on reports without such groups).

### Verifier notes (orchestrator, 2026-10-28; reports/ch00_rwm_verification.md)
- RM19: on the 12 UTC 2 Nov z500 map the trough axis is at 4.9–6.8° W only south of 48.5° N; north of 49° N it bends
  east to ≈ 0° (the cut-off low). Draw the axis from `diag.axes`, never a straight 5.5° W line to 55° N. **(v2: s50, s51.)**
- ISD SYNOPs carry no iw: for Irish, Dutch and Belgian stations call `decode_synop(..., wind_unit="m/s")` (or use ISD's
  decoded speed), otherwise speeds are 1.94× too small. **(v2: s27, s28, s43.)**
- Brest 156 km/h is not Ciarán's strongest gust (Lanvéoc 170, Lannion 158); Enedis 1.2 M homes. **(v2: s75.)**
