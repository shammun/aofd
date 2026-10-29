# Chapter 0 PoC — benchmark sources (verified 2026-10-21)

Used by `../Fluid Dynamics/tests/geo/test_{frames,atmos}.py`; written to `benchmarks_poc.json` by `make_refs.py`.

| Benchmark | Value | Source | URL | How obtained | Verified |
|---|---|---|---|---|---|
| Earth rotation rate Ω | 7 292 115 × 10⁻¹¹ rad s⁻¹ | NGA, *World Geodetic System 1984* (TR8350.2), defining parameter | https://earth-info.nga.mil/GandG/wgs84/ ; https://ahrs.readthedocs.io/en/latest/wgs84.html | web search of the parameter table | 2026-10-21 |
| Inertial period at 45° | ≈ 16.9 h (table, 0.1 h precision); "≈ 17 h at mid-latitudes" | cleonis.nl inertial-oscillation simulation table; Charles University hydrodynamics exercise 10 (solution) | https://cleonis.nl/physics/ejs/inertial_oscillation_simulation.php ; https://www2.karlin.mff.cuni.cz/~prochazkova/documents/hydrodynamika2526/cviceni10-reseni.pdf | web search | 2026-10-21 |
| Pressure scale height, sea level | 8435 m | U.S. Standard Atmosphere 1976 (NASA-TM-X-74335), tabulated by PDAS "bigtables" Table 2 | https://www.pdas.com/bigtables.html ; https://ntrs.nasa.gov/citations/19770009539 | WebFetch of the table | 2026-10-21 |
| Pressure scale height, 20 km geometric | 6382 m (local g) | same, Table 2 | https://www.pdas.com/bigtables.html | WebFetch | 2026-10-21 |
| 5 km geometric: T, p | 255.676 K, 5.4048 × 10⁴ Pa (geopotential 4996.07 m, r₀ = 6 356 766 m) | same, Table 1 | https://www.pdas.com/bigtables.html | WebFetch | 2026-10-21 |

## ch00_weather_basics (verified 2026-10-27)

Used by `../Fluid Dynamics/tests/geo/test_moist.py`, `tests/geo/test_atmos_weather.py`, `tests/diag/test_fronts.py`,
`tests/diag/test_climatology.py`. Values are formulae or definitions coded in the tests (no table digitised).

| Benchmark | Value | Source | URL | How obtained | Verified |
|---|---|---|---|---|---|
| Saturation vapour pressure over water | e_s = 6.112 exp(17.67 t/(t + 243.5)) hPa, t in °C; 0.1 % of Wexler for −30…35 °C | Bolton, D., 1980: The computation of equivalent potential temperature. *Mon. Wea. Rev.* 108, 1046–1053, doi:10.1175/1520-0493(1980)108<1046:TCOEPT>2.0.CO;2, Eq. (10) | https://cires1.colorado.edu/~voemel/vp.html ; https://pyrcel.readthedocs.io/en/latest/generated/pyrcel.thermo.es.html | web search (formula identical in both; accuracy statement from the second, secondary) | 2026-10-27 |
| Nautical mile, knot | 1852 m exactly; 1 kn = 1852/3600 m s⁻¹ | BIPM SI Brochure, non-SI units table (International Hydrographic Conference 1929) | https://www.bipm.org/en/-/2026-06-04-updated-si-brochure-clarifies-the-status-of-non-si-units ; https://en.wikipedia.org/wiki/Knot_(unit) | web search (exact definitions; cross-checked with pint's registry in the test) | 2026-10-27 |
| WMO first tropopause | lowest level where −dT/dz ≤ 2 K/km and the mean lapse to every level within 2 km above stays ≤ 2 K/km | WMO, 1957: Meteorology — a three-dimensional science. *WMO Bulletin* 6, 134–138 | (definition) | definition coded in an independent dense re-implementation in the test | 2026-10-27 |
| Tropopause in USSA-1976 | 11.000 km geopotential, 216.65 K | U.S. Standard Atmosphere 1976, NASA-TM-X-74335 (as above) | https://ntrs.nasa.gov/citations/19770009539 | `fluidpy.core.statics.standard_atmosphere` layer table | 2026-10-27 |
| Espy cloud-base rule | ≈ 125 m per K of dew-point depression | rule of thumb; re-derived in the test from (18.27), (18.11), (2.246): 1/(g/c_p − g R^v T/(L R)) = 126.6 m/K at 288 K | — | V2 derivation (sympy) | 2026-10-27 |
| Thermal front parameter, front lines | TFP = −∇\|∇τ\|·∇τ/\|∇τ\|; front at TFP max; K1 = 0.33 K/(100 km)², K2 = 1.49 K/100 km | Renard & Clarke 1965, *Mon. Wea. Rev.* 93, 547–556; Hewson 1998, *Meteorol. Appl.* 5, 37–65 | (papers) | analytic tanh-front truth in the tests (TFP max at tanh = 1/√3) | 2026-10-27 |

## ch00 reading weather maps (#69), vectors 1a/1b, cross product #2, dot product 0.1b — library batches (verified 2026-10-28)

Used by `../Fluid Dynamics/tests/geo/{test_sphere,test_mapproj,test_atmos_1a,test_vectors_1a1b,test_polygon_laea,test_terrain}.py`
and `tests/diag/{test_station,test_axes,test_advection,test_monthly_anomaly,test_pattern_correlation}.py`. Independent
implementations are run at test time (no table digitised); real report strings come from AOFD `data/derived/ch00/rwm_*`.

| Benchmark | Value | Source | URL | How obtained | Verified |
|---|---|---|---|---|---|
| Geodesics on a sphere (distance, azimuth, forward, npts, polygon area) | `pyproj.Geod(a=b=6 371 000 m)` | Karney, C. F. F., 2013: Algorithms for geodesics. *J. Geodesy* 87, 43–55, doi:10.1007/s00190-012-0578-z; pyproj 3.8.0 / PROJ 9.8.1 | https://pyproj4.github.io/pyproj/ | run in the tests | 2026-10-28 |
| Map projections (eqc, merc, eqearth, stere, lcc, sinu, laea; sphere `+R=`) and `get_factors` | PROJ forward equations and scale factors | PROJ 9.8.1 through pyproj 3.8.0; Snyder 1987 USGS PP 1395; Šavrič et al. 2019 doi:10.1080/13658816.2018.1504949 | https://proj.org | run in the tests | 2026-10-28 |
| METAR decoding | 41 LFRB + 669 US/Canadian reports vs IEM decoded columns | Iowa Environmental Mesonet ASOS/METAR archive (python-metar decoder) | https://mesonet.agron.iastate.edu/request/download.phtml | stored derived product (data-scout, 2026-10-27) | 2026-10-28 |
| SYNOP decoding | 263 reports vs NCEI ISD decoded mandatory fields | Smith, Lott & Vose 2011, *BAMS* 92, 704–708, doi:10.1175/2011BAMS3015.1 (ISD) | https://www.ncei.noaa.gov/access/services/data/v1 | stored derived product | 2026-10-28 |
| METAR decoding (second decoder) | MetPy 1.7.1 `metpy.io.metar.parse_metar` | May et al., MetPy, doi:10.5065/D6WW7G29 | https://unidata.github.io/MetPy/ | run in the tests | 2026-10-28 |
| ω → w | MetPy 1.7.1 `metpy.calc.vertical_velocity` (mixing-ratio route to T_v) | MetPy (as above) | https://unidata.github.io/MetPy/latest/api/generated/metpy.calc.vertical_velocity.html | run in the tests (rtol 1e-12 with MetPy's constants) | 2026-10-28 |
| Station SLP vs reanalysis | RMS(decoded SYNOP SLP − ERA5 msl) = 0.87 hPa (214 stations, 03 UTC 2 Nov 2023) | ERA5 (Hersbach et al. 2020, doi:10.1002/qj.3803), ARCO-ERA5, CC-BY 4.0 | gs://gcp-public-data-arco-era5 | stored derived product | 2026-10-28 |
| Hillshade algorithm | Hillshade = cos Zen cos Slope + sin Zen sin Slope cos(Az − Aspect); Az_math = 360 − Az + 90; Aspect = atan2(dz/dy, −dz/dx); Horn a…i stencil | Esri ArcGIS Pro, "How Hillshade works" (Burrough & McDonnell 1998); Horn 1981, *Proc. IEEE* 69, 14–47 | https://doc.esri.com/en/arcgis-pro/latest/tool-reference/3d-analyst/how-hillshade-works.html | WebFetch, transcribed into the test | 2026-10-28 |
| Pattern correlation | centred R = Pearson over space | Taylor, K. E., 2001, *JGR* 106(D7), 7183–7192, Eq. (1); numpy `corrcoef` | — | run in the tests | 2026-10-28 |

## ch00_derivatives_taylor (#4) — library batch: calculus, radiation, cc_fractional_rate, sounding, global_mean, linear_trend (verified 2026-10-28)

Used by `../Fluid Dynamics/tests/geo/test_{calculus,radiation,moist_cc_rate}.py` and `tests/diag/test_{sounding,global_mean_trend}.py`;
numeric values written to `benchmarks_derivatives.json` by `make_refs.py`.

| Benchmark | Value | Source | URL | How obtained | Verified |
|---|---|---|---|---|---|
| Stefan–Boltzmann constant σ | 5.670 374 419… × 10⁻⁸ W m⁻² K⁻⁴, exact (2π⁵k⁴/(15h³c²) with the exact SI h, k, c) | CODATA 2022 (NIST CUU); unchanged since the 2019 SI (CODATA 2018) | https://physics.nist.gov/cgi-bin/cuu/Value?sigma | WebFetch; also `scipy.constants.Stefan_Boltzmann` | 2026-10-28 |
| Trend standard error with lag-1 autocorrelation | s{b} = (s_e²/Σ(t − t̄)²)^½, s_e² = Σe²/(n_t − 2); n_e = n_t (1 − r₁)/(1 + r₁), r₁ = lag-1 autocorrelation of the regression residuals e(t); n_e − 2 replaces n_t − 2 | Santer, B. D., et al., 2008, *Int. J. Climatol.* 28, 1703–1722, doi:10.1002/joc.1756, Eqs. (4)–(6) ("following Santer et al. (2000a)": *JGR* 105(D6), 7337–7356) | https://www.image.ucar.edu/idag/Papers/santer_IJoC_published_2008.pdf | WebFetch of the PDF, text extracted | 2026-10-28 |
| OLS slope and standard error | — | SciPy 1.18.1 `scipy.stats.linregress` | https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.linregress.html | run in the tests | 2026-10-28 |
| Latent heat of vaporisation, T-dependent | L = (2.501 − 0.00237 t) × 10⁶ J kg⁻¹, t in °C | Stull, R. B., 1988, *An Introduction to Boundary Layer Meteorology* (as tabulated in the R `bigleaf` documentation; secondary) | https://search.r-project.org/CRAN/refmans/bigleaf/html/latent.heat.vaporization.html | web search | 2026-10-28 |
| Saturation vapour pressure, rigorous Clausius–Clapeyron | e = e_s0 (T0/T)^((c_pl − c_pv)/R_v) exp(L0/(R_v T0) − L/(R_v T)), L = L0 − (c_pl − c_pv)(T − T0) | Ambaum, M. H. P., 2020, *Q. J. R. Meteorol. Soc.* 146, 4252–4258, doi:10.1002/qj.3899, Eq. 13 (from the equality of Gibbs functions; equivalent to Clausius–Clapeyron with the Kirchhoff L(T)); implemented in MetPy 1.7.1 `metpy.calc.saturation_vapor_pressure` (MetPy ≥ 1.6 no longer uses Bolton) | https://unidata.github.io/MetPy/latest/api/generated/metpy.calc.saturation_vapor_pressure.html | MetPy source read (`inspect`), run in the tests | 2026-10-28 |
| Wind components (meteorological "from" direction) | u = −s sin(dir), v = −s cos(dir) | MetPy 1.7.1 `metpy.calc.wind_components` | https://unidata.github.io/MetPy/latest/api/generated/metpy.calc.wind_components.html | run in the tests | 2026-10-28 |
| Global-mean surface air temperature, November 2023 (ERA5) | 14.22 °C (plausibility check of one 12 UTC hour only, ±1 K) | Copernicus C3S monthly climate bulletin, Nov 2023 | https://climate.copernicus.eu/copernicus-november-2023-remarkable-year-continues-warmest-boreal-autumn-2023-will-be-warmest-year | web search (several outlets agree) | 2026-10-28 |

## ch00_coordinates (#5) — library batch: enu_basis, band_area/band_fraction, unit_vector_rates, metric_terms, track_by_continuity, translation_velocity (verified 2026-10-28)

Used by `../Fluid Dynamics/tests/geo/test_sphere_enu_band.py`, `tests/geo/test_frames_unit_vector_rates.py` and
`tests/diag/test_cyclone_track.py`. Software benchmarks run at test time; no table digitised.

| Benchmark | Value | Source | URL | How obtained | Verified |
|---|---|---|---|---|---|
| Local east-north-up basis | ECEF → ENU rotation from PROJ `+proj=topocentric` on a sphere `+R=6371000` (agreement 1.2e-14) | PROJ 9.8.1 through pyproj 3.8.0, "Topocentric conversion" | https://proj.org/en/stable/operations/conversions/topocentric.html | run in the tests | 2026-10-28 |
| Geodesics and polygon areas on a sphere | `pyproj.Geod(a=b=6 371 000 m)` fwd/inv/npts/polygon_area_perimeter | Karney 2013, *J. Geodesy* 87, 43–55, doi:10.1007/s00190-012-0578-z | https://pyproj4.github.io/pyproj/ | run in the tests | 2026-10-28 |
| Storm Ciarán record low pressure | 953.3 hPa mean-sea-level pressure at Plymouth (Kinterbury Point), 2 Nov 2023 — November record for England (previous 959.7 hPa, Teignmouth 1916) | Met Office statement of 2 Nov 2023, as reported by Totnes Times / Tavistock Times and Weatherzone | https://totnes-today.co.uk/news/storm-ciaran-sets-new-record-in-plymouth-for-lowest-barometric-pressure-647807 ; https://www.weatherzone.com.au/news/deadly-storm-ciaran-breaks-records-in-france-and-uk/1599138 | WebFetch / web search (secondary reports of the Met Office statement; primary Met Office post not retrieved) | 2026-10-28 |
| Storm Ciarán explosive deepening | central pressure fell by more than 24 hPa in 24 h | Met Office statement (as above) | as above | web search | 2026-10-28 |
| ERA5 hourly msl, Storm Ciarán | derived product `era5_ciaran_2023_sfc.nc` (35–70° N, 50° W–10° E, 0.25°, 1–2 Nov 2023) | Hersbach et al. 2020, *QJRMS* 146, 1999–2049, doi:10.1002/qj.3803; ARCO-ERA5, CC-BY 4.0 | gs://gcp-public-data-arco-era5 | stored derived product (data drive) | 2026-10-28 |

## ch00_gradient (#6) — library batch: pressure_gradient_force (+cartesian), binned_mean, descent_path (verified 2026-10-28)

Used by `../Fluid Dynamics/tests/geo/test_atmos_pgf.py`, `tests/diag/test_binned_mean.py` and
`tests/geo/test_terrain_descent.py`. Software benchmarks run at test time; no table digitised; no book values.

| Benchmark | Value | Source | URL | How obtained | Verified |
|---|---|---|---|---|---|
| Binned (conditional) mean and counts | `scipy.stats.binned_statistic(statistic="mean" / "count")` and `np.histogram` (half-open bins, last bin closed) | SciPy 1.18.1 / NumPy 2.5.4 reference implementations | https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.binned_statistic.html | run in the tests | 2026-10-28 |
| Geostrophic consistency (G1, corrected sign) | f k × u_g = −(1/ρ)∇p = +F, Vallis (2.198); u_g from `geostrophic_wind_from_msl` (itself V1/V2/V3-tested in `tests/geo/test_atmos.py`) | Vallis 2017 §2.8.1 (equation only) | — | run in the tests | 2026-10-28 |
| ERA5 hourly msl, u10, v10 + NE 50 m land mask, Storm Ciarán | `era5_ciaran_2023_sfc.nc`, `era5_ciaran_2023_sfc_1102.nc` (`land`) | Hersbach et al. 2020, *QJRMS* 146, 1999–2049, doi:10.1002/qj.3803; ARCO-ERA5, CC-BY 4.0; Natural Earth (public domain) | gs://gcp-public-data-arco-era5 | stored derived products (data drive) | 2026-10-28 |
| ETOPO 2022 60″ surface elevation, Alps subset | `etopo2022_60s_alps_43-49N_4-17E.nc` | NOAA NCEI 2022, ETOPO 2022 15 Arc-Second Global Relief Model, doi:10.25921/fd45-gt74 (public domain) | https://www.ncei.noaa.gov/products/etopo-global-relief-model | stored raw subset (data drive) | 2026-10-28 |
| Mont Blanc summit position used as the start | 45.8326° N, 6.8652° E (data_needs DG13; "to confirm" by the research-scout — the test only needs a point in the summit region) | data_needs.md §A planning table | — | as listed | 2026-10-28 |
| Molar mass of water (UF1 F12) | 18.0153 g/mol (our 18.01528 g/mol = 2 × 1.00794 + 15.9994, IUPAC 2005 atomic weights) | NIST Chemistry WebBook, SRD 69, Water (CAS 7732-18-5) | https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185&Mask=4 | page fetched, value read | 2026-10-29 |
| Mean molar mass of dry air (UF1 F12) | 28.9644 g/mol; recomputed as Σ M_i f_i of the USSA-1976 composition table (fluidpy `reference/ch01/ussa1976_constants.json`) | NASA-TM-X-74335 (1976), U.S. Standard Atmosphere | https://ntrs.nasa.gov/api/citations/19770009539/downloads/19770009539.pdf | sum computed in the test | 2026-10-29 |
| USSA-1976 pressures at geometric Z = 5…50 km (UF1 `pressure_height_standard` V5) | PDAS Table 1 (fluidpy `reference/ch01/ussa1976_table1.csv`, 4–5 significant figures) | Public Domain Aeronautical Software, "Tables of the U.S. Standard Atmosphere, 1976" | https://www.pdas.com/bigtables.html | reused (fetched 2026-09-12) | 2026-10-29 |
| Dry adiabat, θ, isothermal thickness (UF1 `dry_parcel_ascent`, `pressure_height` V5) | `metpy.calc.dry_lapse`, `potential_temperature`, `thickness_hydrostatic` (MetPy 1.7.1, its own R_d and c_pd passed to fluidpy) | May et al., MetPy, doi:10.5065/D6WW7G29 | https://unidata.github.io/MetPy/ | run in the tests | 2026-10-29 |
| Great-circle azimuth (UF1 `along_section_wind` V5) | `pyproj.Geod(a=b=6.371e6).inv` forward azimuths (pyproj 3.8.0) | PROJ / GeographicLib (Karney 2013, doi:10.1007/s00190-012-0578-z) | https://pyproj4.github.io/pyproj/ | run in the tests | 2026-10-29 |
| ERA5 pressure levels round Storm Ciarán, 2023-11-01 18 UTC (UF1 sections, real-data tests) | `data/derived/ch00/era5_ciaran_2023_section_48p5N_18UTC.nc` (t, q, u, v, w, z; 20 levels) | Hersbach et al. 2020, *QJRMS* 146, 1999–2049, doi:10.1002/qj.3803; Copernicus CDS, CC-BY 4.0 | https://cds.climate.copernicus.eu | stored derived product (repo) | 2026-10-29 |

## ch00_reading_weather_maps v2 (#69, verified 2026-10-29)

Used by `../Fluid Dynamics/tests/diag/test_{radar,ensemble,sounding_skewt,axes_saddle,station_remarks}.py` and
`tests/geo/test_{orbits,atmos_layer_mean}.py`. Small tables are coded in the tests (public sources; no book values).

| Benchmark | Value | Source | URL | How obtained | Verified |
|---|---|---|---|---|---|
| WSR-88D beam centreline heights, 11 elevations 0.48–9.98°, slant range 1–60 km | e.g. 0.48°: 8.5 / 90.9 / 311.5 / 739.7 m at 1 / 10 / 30 / 60 km; fits H = r sin φ + r²/(2·1.21·6371 km) to 0.05 m | NWS Radar Operations Center, "WSR-88D Beam Height Tables" (heights relative to the feed horn) | https://www.weather.gov/media/roc/windfarm/WSR88D_Beam_Height_Tables.pdf | WebFetch + pymupdf text extraction; 44 rows coded | 2026-10-29 |
| Marshall–Palmer drop-size distribution | N(D) = 8000 e^(−ΛD) m⁻³ mm⁻¹, Λ = 4.1 R^−0.21 mm⁻¹ (→ Z = 296 R^1.47 by integration); Z = 200 R^1.6 is the relation commonly attributed to the paper | Marshall, J. S. and W. McK. Palmer, 1948, *J. Meteor.* 5, 165–166, doi:10.1175/1520-0469(1948)005<0165:TDORWS>2.0.CO;2 | https://phaustin.github.io/a301_eoas/notebooks/week9/marshall_palmer.html | web search (secondary summaries; the original's own Z–R wording not seen) | 2026-10-29 |
| Geostationary radius / altitude | Kepler radius for the sidereal day 42 164.172 km; oblateness +0.522 km → 42 164.697 km; nominal altitude 35 786 km, speed 3.075 km/s | Nelson, R. A., 2001: What is the radius of the geostationary orbit? *Via Satellite*, 10 Sep 2001 | https://www.satellitetoday.com/uncategorized/2001/09/10/what-is-the-radius-of-the-geostationary-orbit/ | WebFetch | 2026-10-29 |
| WGS-84 constants | GM = 3.986004418e14 m³ s⁻², a = 6 378 137 m, ω = 7.292115e-5 rad s⁻¹ | NIMA TR8350.2 (2000); IERS Conventions (2010) Table 1.1 | https://earth-info.nga.mil/GandG/wgs84/ | (Ω verified 2026-10-21 above; GM, a as published) | 2026-10-29 |
| NASA Aqua orbit | 705 km, 98.8 min, inclination 98.2° | NASA Aqua mission page | https://science.nasa.gov/mission/aqua/about-aqua-spacecraft-and-instruments/ | web search | 2026-10-29 |
| WMO code table 4677 (ww) | rows 00–99 (e.g. 80/81/82 rain showers slight / moderate or heavy / violent; 36–39 drifting/blowing snow; 76 diamond dust) | WMO-No. 306 Manual on Codes Vol. I.1, code table 4677 (NOAA NODC copy) | https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM | WebFetch | 2026-10-29 |
| METAR remark groups | SLPppp, TsnTTTsnTdTdTd, 1/2snTTT, 4snTTTsnTTT, 5appp, Prrrr, 6RRRR, 7RRRR, 4/sss | FMH-1 (2019) §12.7; IEM decoded columns (mslp, tmpf, dwpf, p01i, snowdepth) for 4 876 reports 17:50–18:10 UTC 27 Oct 2026 | https://mesonet.agron.iastate.edu/request/download.phtml | raw CSV on G: (`raw/IEM-METAR/`), registry `IEM-METAR` | 2026-10-29 |
| MetPy METAR → ww and skew-T transform | `metpy.plots.wx_symbols.wx_code_map`; `metpy.plots.SkewT(rotation=ρ)` ⇔ isotherm angle 90° − ρ | MetPy 1.7.1, doi:10.5065/D6WW7G29 | https://unidata.github.io/MetPy/ | run in the tests | 2026-10-29 |
| IGRA2 Trappes 00 UTC 2 Nov 2023 | 850 hPa 1247 m 276.55 K; 700 hPa 2805 m 270.65 K → freezing level 2144.8 m | NOAA NCEI IGRA v2 (Durre et al. 2006), station FRM00007145 | https://www.ncei.noaa.gov/products/weather-balloon/integrated-global-radiosonde-archive | raw file on G: (`raw/IGRA2/`) | 2026-10-29 |
