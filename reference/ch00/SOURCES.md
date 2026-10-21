# Chapter 0 PoC — benchmark sources (verified 2026-10-21)

Used by `../Fluid Dynamics/tests/geo/test_{frames,atmos}.py`; written to `benchmarks_poc.json` by `make_refs.py`.

| Benchmark | Value | Source | URL | How obtained | Verified |
|---|---|---|---|---|---|
| Earth rotation rate Ω | 7 292 115 × 10⁻¹¹ rad s⁻¹ | NGA, *World Geodetic System 1984* (TR8350.2), defining parameter | https://earth-info.nga.mil/GandG/wgs84/ ; https://ahrs.readthedocs.io/en/latest/wgs84.html | web search of the parameter table | 2026-10-21 |
| Inertial period at 45° | ≈ 16.9 h (table, 0.1 h precision); "≈ 17 h at mid-latitudes" | cleonis.nl inertial-oscillation simulation table; Charles University hydrodynamics exercise 10 (solution) | https://cleonis.nl/physics/ejs/inertial_oscillation_simulation.php ; https://www2.karlin.mff.cuni.cz/~prochazkova/documents/hydrodynamika2526/cviceni10-reseni.pdf | web search | 2026-10-21 |
| Pressure scale height, sea level | 8435 m | U.S. Standard Atmosphere 1976 (NASA-TM-X-74335), tabulated by PDAS "bigtables" Table 2 | https://www.pdas.com/bigtables.html ; https://ntrs.nasa.gov/citations/19770009539 | WebFetch of the table | 2026-10-21 |
| Pressure scale height, 20 km geometric | 6382 m (local g) | same, Table 2 | https://www.pdas.com/bigtables.html | WebFetch | 2026-10-21 |
| 5 km geometric: T, p | 255.676 K, 5.4048 × 10⁴ Pa (geopotential 4996.07 m, r₀ = 6 356 766 m) | same, Table 1 | https://www.pdas.com/bigtables.html | WebFetch | 2026-10-21 |
