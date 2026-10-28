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
