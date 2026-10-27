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
