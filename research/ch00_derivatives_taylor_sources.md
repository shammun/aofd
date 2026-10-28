# ch00_derivatives_taylor (#4): fact check of external claims          2026-10-28

Scope: every external (non-computed) factual or dated claim in `movies/ch00/ch00_derivatives_taylor/{script.md,
data_needs.md, storyboard.yaml}`. Numbers the build script computes from A1 to A3 and D1 to D4 (Brest, ERA5, Trappes,
thermodynamic routes, Taylor sums, finite differences) are **not** re-checked here. Those are CHECK rows DT01 to DT72.
Quotes are short and from primary sources where they could be reached. **ipcc.ch, archive.ipcc.ch, AMS journals and
Wiley returned HTTP 403 to WebFetch today**, so the IPCC wording comes from search-engine extracts of the official
pages. Those rows are marked "(search extract)". Before release, re-check them in a browser against the PDF page cited.

Verdicts: **VERIFIED** (the source supports it as worded) · **CORRECTED** (wrong or out of date; new wording given) ·
**SOFTEN** (true at its core but overstated; softer wording given) · **UNVERIFIED** (could not confirm today).

## 1. Summary table

| # | Scene | Claim as narrated | Verdict | Fix (spoken text) |
|---|---|---|---|---|
| 1 | s41 | "The world has warmed by about one point one degrees since the late eighteen hundreds." | **CORRECTED** (out of date) | "…by about one and a quarter degrees since the late eighteen hundreds." (Forster et al. 2026: 1.26 [1.13 to 1.36] °C for 2016–2025 against 1850–1900.) If the AR6 number is kept, it must be dated: "by the 2010s, about one point one degrees". |
| 2 | s41 | "By the seven percent rule, the air can now hold about eight percent more water vapour" | **CORRECTED** (follows from #1), plus SOFTEN | With 1.26 °C × 7.08 %/K the answer is 8.9 %: "…about nine percent more water vapour". Update DT54 (1.26 × 7.08 % = 8.9 %). See #3 for the "hold" wording. |
| 3 | s39, s40, s41, title | "Air … holds water vapour"; "as much vapour as it can"; "air can hold about seven percent more" | **SOFTEN** (a known misconception) | The saturation vapour pressure is set by the temperature of the water and the vapour. The air does not "hold" it (a vacuum has the same e_s). Suggest for s39: "When the vapour is in balance with liquid water, we say the air is saturated…". In s40 and s41, "air can hold" could become "the saturation vapour pressure rises by about seven percent". The everyday phrase can stay once if it is flagged as shorthand. |
| 4 | s41 | "the reanalysis shows the water vapour in the whole atmosphere rising since nineteen seventy nine" | **VERIFIED** in substance, with a data caveat | AR6 WG1 Ch. 2 rates positive global TCWV trends "very likely since 1979". But Allan et al. 2022 found that ERA5's low-level tropical water vapour falls before about 1993, which does not match simulations or satellites. The builder should check that the ERA5 trend holds when it starts in 1988 or 1993. Optional fallback wording: "rising over the last four decades". |
| 5 | s41 | "The IPCC assesses that the heaviest daily rainfall becomes about seven percent more intense for each degree of global warming." | **VERIFIED** (search extract), slight SOFTEN | SPM B.2.4 is a projection at the global scale: "is projected to become". Suggest "…assesses that, worldwide, the heaviest daily rainfall is expected to become about seven percent more intense for each degree of global warming." |
| 6 | s42 | "Satellites measure Earth giving off about two hundred and forty watts per square metre" | **VERIFIED** | Builder still asserts DT61 (CERES 235–245). |
| 7 | s42 | σ = 5.67 × 10⁻⁸; T_e = 255 K ≈ −18 °C | **VERIFIED** (σ exact, CODATA 2022); T_e is our own computation | data_needs says "CODATA 2018". The value is unchanged in CODATA 2022, so cite 2022. |
| 8 | s43 | "Doubling the carbon dioxide in the air traps about three point nine extra watts per square metre." | **VERIFIED** (3.93 ± 0.47 W m⁻²), slight SOFTEN | "traps" is fine for a lay audience. More exact: "adds about three point nine watts per square metre of heating". |
| 9 | s43 | "The Intergovernmental Panel's careful estimate of the real Planck response is … about three point two, which gives about one point two degrees." | **VERIFIED** (−3.22 [−3.4 to −3.0] W m⁻² K⁻¹, Table 7.10, from secondary quotes; Fig. 7.20 caption 3.2, search extract) | No change. 3.93/3.22 = 1.22 K is our own arithmetic. |
| 10 | s46 | "Today's best global forecast models have grid points about nine kilometres apart" | **VERIFIED** for ECMWF (still about 9 km after IFS Cy50r1, 12 May 2026), slight SOFTEN | "best" is a judgement, and km-scale research and Destination-Earth runs are finer. Suggest "The leading global forecast models today, like the European Centre's, have grid points about nine kilometres apart". |
| 11 | s46 | "early climate models had points a few hundred kilometres apart" | **VERIFIED** | IPCC FAR-era models (1990) had about 500 km. Optional history line: the first computer forecast (ENIAC, 1950) used a grid interval of 736 km. |
| 12 | s07, s46 | "every quarter of a degree … about eighteen kilometres apart"; "With ERA5's grid points eighteen kilometres apart" | **CORRECTED** (model resolution vs delivered grid) | ERA5's own model grid is about 31 km (Hersbach et al. 2020). The 0.25° latitude–longitude grid is an interpolation, 18.4 km east–west at 48.5° N but 27.8 km north–south. s07: "the ERA5 data come on a grid every quarter of a degree, which here is about eighteen kilometres apart going east". s46: "With the data points eighteen kilometres apart going east…". This keeps the sentence honest next to the "9 km" claim. |
| 13 | s21 | "Meteorologists often use pressure instead of height … because a balloon measures pressure directly." | **SOFTEN** (overstated) | Modern GPS sondes often have no pressure sensor. The Meteomodem M10 (flown at Trappes, two flights a day) gives "Pressure calculated from GNSS". The US NWS sondes do carry a pressure cell. The main modern reason is that the equations become simpler in pressure. Suggest: "…because weather balloons have long reported pressure, and because many of the equations become simpler that way." |
| 14 | s09 | "Twice a day, at stations all over the world, a balloon carries … a radiosonde" | **SOFTEN** | Standard times are 00 and 12 UTC, but some stations launch only once a day. About 800 stations report in near real time (IGRA2). Suggest: "Once or twice a day, at about eight hundred stations around the world…". Trappes itself flies twice a day (secondary). |
| 15 | s34 | "Pilots and aircraft altimeters use this rule of thumb near the ground." (1 hPa per 8.6 m) | **SOFTEN** | Pilots use about 27–30 ft per hPa (8.2–9.1 m), which matches our 8.6 m. Altimeters are calibrated to the full (non-linear) standard-atmosphere formula, not the linear rule. Suggest: "Pilots use this rule of thumb, about thirty feet per hectopascal, near the ground." |
| 16 | s08 | "a fall of five hectopascals in one hour, a sign of a deep storm coming" | **VERIFIED** (qualitative) | The shipping-forecast top category, "falling very rapidly", is more than 6 hPa in 3 h. Five hPa in one hour is far beyond it. |
| 17 | s02 | Storm Ciarán's warm air reached Brest on the evening of 1 November 2023 | **VERIFIED** (date and place) | Brest set its all-time gust record (156 km/h) in that storm. The station is Brest-Guipavas, at the airport inland of the port. "At Brest" is fine. |
| 18 | s04 | ERA5 "a reanalysis: a best estimate of the whole atmosphere, built from observations and a weather model" | **VERIFIED** | Cite Hersbach et al. 2020. |
| 19 | s39, s40 | L ≈ 2.44 × 10⁶ J kg⁻¹; R_v = 462 J kg⁻¹ K⁻¹ | **VERIFIED, with a note** | 2.442 × 10⁶ is L at 25 °C. At 0 °C it is 2.501 × 10⁶. With L(0 °C) the fractional rate at 0 °C is 7.25 %/K instead of 7.08 %/K. "About seven percent" holds either way. Optional in the notebook: say "L at about 25 °C". |
| 20 | s39 | e_s ≈ 6 / 17 / 42 hPa at 0 / 15 / 30 °C | **VERIFIED** (rounded) | Standard tables give 6.11, 17.04 and 42.4 hPa. Our constant-L formula gives 6.19, 16.92 and 41.91, and the spoken rounding covers both. |
| 21 | s40 | "the famous seven percent rule" | **VERIFIED** | AR6 Technical Summary (search extract): moisture capacity "about 7% per 1ºC". Observed near-surface water vapour rises only about 4–5 % per °C of *global* warming (Allan et al. 2022). Do not imply that the observed rise equals the rule. |
| 22 | s36 | tropopause about 13 km, "the lid on the weather layer"; above it "the air gets a little warmer" | **VERIFIED** as a description; the height is our own computation (DT45) | No change. Just above a midlatitude tropopause the air is often near-isothermal before it warms, so the builder should check that the profile above 13 km really warms (else say "stops cooling"). |
| 23 | s43 | "The full warming is larger, because of feedbacks: … water vapour traps heat too." | **VERIFIED** (qualitative) | AR6 Ch. 7: the feedbacks amplify the Planck response "by about 2.8 [1.9 to 5.9] times" (search extract). No number is spoken, so no change. |

Overstatements flagged: #3 ("air holds"), #10 ("best"), #12 (ERA5 grid = model grid), #13 (balloons measure pressure
directly), #14 ("twice a day … all over the world"), #15 ("aircraft altimeters use this rule"), #5 (projection stated as
present fact). Out of date: #1, and #2 follows from it.

## 2. Evidence per claim (source · short quote or number · URL/DOI · how verified today)

### IPCC AR6 and recent updates
| Claim | Source | Quote / number | URL / DOI | Verified how |
|---|---|---|---|---|
| Observed warming (AR6) | IPCC AR6 WG1 SPM A.1.2 (2021) | "1.09 [0.95 to 1.20] °C higher in 2011–2020 than 1850–1900" | https://www.ipcc.ch/report/ar6/wg1/chapter/summary-for-policymakers/ · DOI 10.1017/9781009157896.001 | search extract and secondary copies (HKO page). ipcc.ch gave 403 |
| Observed warming (latest) | Forster et al. 2026, *Indicators of Global Climate Change 2025*, ESSD 18, 3889–3933 | 2016–2025: "observed warming relative to 1850–1900 was 1.26 [1.13 to 1.36] °C"; human-induced 1.24 [1.0 to 1.5] °C; human-induced reached 1.37 °C in 2025 | https://essd.copernicus.org/articles/18/3889/2026/essd-18-3889-2026.html · DOI 10.5194/essd-18-3889-2026 | fetched today |
| Previous edition | Forster et al. 2025, ESSD 17, 2641–2680 | 2015–2024: 1.24 [1.11 to 1.35] °C observed | https://essd.copernicus.org/articles/17/2641/2025/essd-17-2641-2025.html | search extract |
| Heavy precipitation 7 %/°C | AR6 WG1 SPM B.2.4 | "At the global scale, extreme daily precipitation events are projected to intensify by about 7% for each 1°C of global warming (*high confidence*)." | SPM URL above | search extract (extended mode) |
| Moisture capacity 7 %/°C | AR6 WG1 Technical Summary | "near-surface atmospheric moisture capacity of about 7% per 1ºC of warming" | https://www.ipcc.ch/report/ar6/wg1/chapter/technical-summary/ | search extract |
| Observed extremes range | Carbon Brief explainer, quoting AR6 Ch. 11 | extremes intensify by a magnitude that "varies between 4% and 8% per degree celsius" | https://www.carbonbrief.org/explainer-what-the-new-ipcc-report-says-about-extreme-weather-and-climate-change/ | fetched today |
| TCWV since 1979 | AR6 WG1 Ch. 2 §2.3.1.3.3 | "positive trends in global total column water vapour are *very likely* since 1979" | https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-2/ | search extract |
| TCWV rate and ERA5 caveat | Allan, Willett, John & Trent 2022, JGR Atmos. 127, e2022JD036728 | about 1 %/decade (1988–2014); near-surface water vapour about 4–5 % per °C of global warming; ERA5 low-level tropical decreases before about 1993 inconsistent | DOI 10.1029/2022JD036728 | search extracts of the abstract (Wiley and Reading gave 403) |
| 2×CO₂ ERF | AR6 WG1 Ch. 7 (Forster et al. 2021) | "The assessed ERF for a doubling of carbon dioxide compared to 1750 levels (3.93 ± 0.47 W m–2) is larger than in AR5." | https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-7/ · DOI 10.1017/9781009157896.009 | search extract |
| Planck response | AR6 WG1 Ch. 7 Table 7.10 | −3.22 [−3.4 to −3.0] W m⁻² °C⁻¹; Fig. 7.20 caption uses magnitude 3.2 | chapter URL above | **secondary**: Copernicus EGUsphere 2025-342 supplement cites "−3.22 … Table 7.10", CNRM lecture (Cattiaux) gives the range, and a search extract gives the Fig. 7.20 caption. Re-check Table 7.10 in the PDF |
| Feedback amplification | AR6 WG1 Ch. 7 | feedbacks "amplify the Planck temperature response by about 2.8 [1.9 to 5.9] times" | chapter URL above | search extract |
| Planck: model vs blackbody | Cronin & Dutta 2023, JAMES, "How well do we understand the Planck feedback?" | climate models average about −3.3 W m⁻² K⁻¹. A simple blackbody estimate (our 4σT_e³ = 3.76) is larger in magnitude by about 0.5 | https://ui.adsabs.harvard.edu/abs/2023JAMES..1503729C | search extract (ADS gave 405). This supports s43's "a little lower". Useful for the notebook's Like…/Unlike… card |

### Energy budget
| Claim | Source | Quote / number | URL / DOI | Verified how |
|---|---|---|---|---|
| About 240 W m⁻² absorbed | NASA Earth Observatory, *Climate and Earth's Energy Budget* | "340 watts per square meter of solar energy arrives at the top of the atmosphere"; Earth "absorbs an average of about 240 watts of solar power per square meter"; balanced by "an equal amount of energy radiating into space" | https://science.nasa.gov/earth/earth-observatory/climate-and-earths-energy-budget | fetched today. Note: this page gives an effective temperature of about −20 °C. Our σ-based 255.06 K = −18.1 °C is the standard textbook value |
| OLR about 239.7 ± 3.3 | Stephens et al. 2012, Nat. Geosci. 5, 691–696 | OLR 239.7 ± 3.3 W m⁻² (2000–2010) | DOI 10.1038/NGEO1580 | number from a search extract. The PDF could not be parsed (unverified as a quote) |
| CERES EBAF reference | Loeb et al. 2018, J. Climate 31, 895–918 (EBAF Ed4.0) | data source for D4 | DOI 10.1175/JCLI-D-17-0208.1 | DOI read from the PDF metadata today |
| σ | NIST CODATA 2022 | "5.670 374 419... x 10-8 W m-2 K-4", exact | https://physics.nist.gov/cgi-bin/cuu/Value?sigma | fetched today |

### Forecast and climate model grids
| Claim | Source | Quote / number | URL / DOI | Verified how |
|---|---|---|---|---|
| ECMWF 9 km now | ECMWF Confluence, *Implementation of IFS Cycle 50r1* | implemented "on 12 May 2026 from the 06 UTC run"; TCo1279 / O1280, "~9 km" before and after; "no change in vertical or horizontal resolution"; ex-HRES and ENS Control merged, "now producing only one which we refer as the ENS Control" | https://confluence.ecmwf.int/display/FCST/Implementation+of+IFS+Cycle+50r1 | fetched today |
| ECMWF 9 km since 2016 | ECMWF, IFS Cy41r2 (8 March 2016) | HRES TCo1279 about 9 km; ENS then about 18 km | https://confluence.ecmwf.int/spaces/FCST/pages/51725856/Implementation+of+IFS+cycle+41r2 | search extract |
| ENS to 9 km 2023 | ECMWF Newsletter 176 (Cy48r1, 27 June 2023) | ENS raised to TCo1279 (9 km) | https://www.ecmwf.int/en/newsletter/176/earth-system-science/ifs-upgrade-brings-many-improvements-and-unifies-medium · DOI 10.21957/slk503fs2i | search extract |
| Climate model history | Climate Change in Australia (CSIRO/BoM), *Resolution* | "Resolution improved from about 500km in 1990 (FAR …), to as fine as 110km in 2007" | https://www.climatechangeinaustralia.gov.au/en/learning-support/climate-models/resolution/ | fetched today. The primary is IPCC AR4 WG1 Fig. 1.4 (https://archive.ipcc.ch/publications_and_data/ar4/wg1/en/figure-1-4.html, 403 today) |
| First NWP grid | Lynch, *Forecasts by PHONIAC* (on the 1950 ENIAC forecast) | "discretised to a grid of 19 by 16 points, with grid interval of 736 km" | https://maths.ucd.ie/~plynch/Publications/PHONIAC.html | fetched today |
| First NWP paper | Charney, Fjørtoft & von Neumann 1950, Tellus 2, 237–254 | barotropic vorticity equation on ENIAC | DOI 10.1111/j.2153-3490.1950.tb00336.x | ADS record via search |
| ERA5 model grid | Hersbach et al. 2020, QJRMS 146, 1999–2049 | "enhanced horizontal resolution of 31 km, compared to 80 km for ERA-Interim, ERA5 has hourly output" | DOI 10.1002/qj.3803 | search extract of the abstract |

### Radiosondes, pressure, aviation
| Claim | Source | Quote / number | URL / DOI | Verified how |
|---|---|---|---|---|
| Launch times | NWS Sterling (LWX) upper-air tour | "Balloon flights occur at midnight and noon Greenwich time, or 00 UTC and 12 UTC"; the US sonde has "a pressure cell located inside the packaging" | https://www.weather.gov/lwx/onlinetour_uprair1 | fetched today |
| Station count | NOAA NCEI IGRA page | "more than 2,800 globally distributed stations"; about 800 report in near real time | https://www.ncei.noaa.gov/products/weather-balloon/integrated-global-radiosonde-archive | fetched today |
| IGRA2 citation | Durre et al. 2018, JTECH 35, 1753–1770 | IGRA v2 | DOI 10.1175/JTECH-D-17-0223.1 | from the NCEI page |
| GPS-derived pressure | Meteomodem M10 product page | "Pressure calculated from GNSS" | https://www.meteomodem.com/m10 | fetched today |
| Trappes flies M10, 2/day | SIRTA JSS2019 poster (Dupont) | Météo-France / Meteomodem M10, 00 and 12 UTC | https://sirta.ipsl.polytechnique.fr/documents/JSS2019/posters/JSS2019_P20_Dupont.pdf | **search extract only (403)**. Which sonde Trappes flies in 2026 is unverified (it may be the M20, which has a barometer) |
| Altimeter rule | SKYbrary bookshelf docs; pilot forums | 10 hPa ≈ 300 ft (≈ 30 ft/hPa); forums give 27 ft/hPa near the standard | https://skybrary.aero/sites/default/files/bookshelf/854.pdf | search extract |
| Rapid pressure fall | RMetS MetLink shipping-forecast handout | "falling very rapidly": more than 6.0 hPa in the preceding 3 h | https://www.metlink.org/wp-content/uploads/2020/12/shipping_forecast_tasks.pdf | search extract |

### Storm Ciarán, water vapour physics
| Claim | Source | Quote / number | URL / DOI | Verified how |
|---|---|---|---|---|
| Ciarán, night of 1–2 Nov 2023 | Reporterre / Figaro Nautisme (Météo-France values) | Brest all-time gust record 156 km/h; 193 km/h at Plougonvelin | https://reporterre.net/Rafales-et-vagues-immenses-La-tempete-Ciaran-secoue-la-France | search extract. Primary: Météo-France BCMR 11/2023 bulletin, https://donneespubliques.meteofrance.fr/donnees_libres/bulletins/BCMR/BCMR_12_202311.pdf (not opened) |
| L(T) | U. Alberta EAS327 tables | L_v = 2.501 × 10⁶ J kg⁻¹ at 0 °C, 2.442 × 10⁶ at 25 °C | https://faculty.eas.ualberta.ca/jdwilson/EAS327/eas327_tables.html | search extract |
| "Air holds water" myth | S. Babin, UMD, *Water vapor myths* | equilibrium vapour pressure set by temperature alone. Air is an inert background | https://www2.atmos.umd.edu/~stevenb/vapor | search extract |
| Hydrological response | Held & Soden 2006, J. Climate 19, 5686–5699 | the robust responses trace back to more lower-tropospheric vapour (about 7 %/K, the C–C rate) | DOI 10.1175/JCLI3990.1 | bibliographic details verified. The "7 %/K" wording is in the paper's text but was not seen today |

## 3. Notes for the builder and the manifest
- **DT54** changes to 1.26 × 7.08 % = 8.9 % ("about nine percent") if #1 is accepted. **The s41 keyword** "+1.1 °C since
  1850–1900" changes to "+1.26 °C (2016–2025)" and the CalcStack to "1.26 × 7 % ≈ 9 %". Re-measure s41.
- **DT53** (ERA5 TCWV trend > 0 at 3 SE) should also be run from 1993 because of the ERA5 issue Allan et al. 2022 found.
  Record both trends in the manifest.
- **Manifest citations**: AR6 SPM A.1.2 (if kept) or Forster et al. 2026; AR6 SPM B.2.4; AR6 Ch. 7 §7.3.2.1 and
  Table 7.10; ECMWF Cy50r1 page (dated 12 May 2026); CCiA/AR4 Fig. 1.4; Hersbach et al. 2020; Durre et al. 2018;
  Loeb et al. 2018; NIST CODATA 2022 σ.
- s07, s46: say "data points" or "data grid", not "ERA5's grid points" (31 km model vs 0.25° product).
- s36: confirm that T rises above the 13.07 km tropopause in the 2026-09-30 profile before saying "gets a little warmer".
- `reference/ch00/SOURCES.md`: copy §2 rows (value · source · DOI/URL · how obtained · 2026-10-28).

## 4. Unverified items (need a browser check before release)
1. Exact wording of AR6 SPM A.1.2 and B.2.4 and of Ch. 7 Table 7.10 (ipcc.ch returns 403 to WebFetch). The values are
   consistent across several search extracts and secondary copies.
2. Planck response −3.22 [−3.4 to −3.0]: seen only in secondary citations, plus the Fig. 7.20 caption "3.2" as a search extract.
3. Stephens et al. 2012 OLR 239.7 ± 3.3 W m⁻² (number from a search extract; the PDF could not be parsed).
4. Which radiosonde Trappes flies in 2026 (M10 with GNSS pressure, or M20 with a barometer).
5. The IPCC AR4 Fig. 1.4 caption itself (archive.ipcc.ch 403). The 500 km / 110 km figures come from a CSIRO/BoM page.
6. Allan et al. 2022 abstract wording (search extracts only).
7. Whether any operational global NWP model is finer than about 9 km in October 2026. None found, but not searched
   exhaustively. Hence the "leading" wording in #10.
