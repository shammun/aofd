# ERA5-ARCO-wb-stacks-20231102T12: ERA5 t, q, z on 21 levels (1000–1 hPa), 12 UTC 2 Nov 2023 (weather-basics UF2, D-UF2-1)

- **Route**: ARCO-ERA5 zarr (anonymous) through `fluidpy.data.movie_wb.fetch_stacks()` → `era5_arco.fetch_box` → `fluidpy.data.fetch` (disk guard).
  - Fetched 2026-10-29: guard estimate 32,956,000 B; **17,282,257 B** on disk (zlib) in **46.6 s**; sha256 `3fd9f119…1df9` (informational; netCDF subsets are not byte-stable).
  - The network transfer is larger: one zarr chunk = one global hour per variable (≈ 100 MB for each of t, q, z; ≈ 3 MB for sp).
  - Variables t, q, z on 1000, 950, 900, 850, 800, 700, 600, 500, 400, 300, 250, 200, 150, 100, 70, 50, 30, 20, 10, 5, 1 hPa, plus surface pressure; box 0–80° N, 65° W–35° E, 0.25°.
  - All 21 levels exist in the 37-level store. The store has latitude N→S and longitude 0…359.75; the products have latitude S→N and longitude −180…180.
- **Licence**: Copernicus licence / CC-BY 4.0. Attribution: "Contains modified Copernicus Climate Change Service information 2026 …". **Redistributable: yes.**
- **Products** (`fluidpy.data.movie_wb.stack_products`, which uses `fluidpy.data.stack.stack_product(..., source="arco")`; the `source` argument is new in this step):

  | File | Where | Content | Size (B) | sha256 |
  |---|---|---|---|---|
  | `era5_wb_stacks_21lev_2023-11-02T12.nc` | G: `derived/ch00/` | 21 levels, whole box, t q z zg sp below_ground | 22,075,864 | `6dca72f5…7f2f` |
  | `era5_wb_stack_t16_2023-11-02T12_0p5.nc` | repo `data/derived/ch00/` | s38b: 16 levels 1000…1 hPa, 0–80° N 25° W–35° E, point-subsampled to 0.5° (161 × 121), t zg below_ground | 1,307,781 | `8cf49808…5e88` |
  | `era5_wb_stack_q10_2023-11-02T12.nc` | repo `data/derived/ch00/` | s27c: 10 levels 1000…300 hPa, 0–24° N 34° W–2° E at 0.25° (97 × 145), q t zg below_ground sp | 1,027,108 | `8177f204…af7` |

  - The q10 box is the plan's: the s27b ring (2-m q maximum at 12° N 16° W, `uf1.json → vapour.qmax`) ± 12° latitude and ± 18° longitude.
  - The 0.5° cut takes every second grid point; it does not average.
  - `zg` is geopotential height (z / 9.80665). At 1 hPa the geometric height is about 0.35 km more.
  - `below_ground` = 1 where the level pressure is greater than the surface pressure. ERA5 values there are extrapolated, not air. 31.7 % of the q10 box at 1000 hPa is below ground (West Africa).
- **Checks**:
  - Tropopause = WMO lapse-rate tropopause (`fluidpy.geo.atmos.lapse_rate_tropopause`) on cos-latitude strip-mean profiles over 25° W–35° E. The 16- and 21-level results are identical.

    | Strip | Tropopause height | T | Level | Planner |
    |---|---|---|---|---|
    | Europe 45–55° N | **10.14 km** | **−52.0 °C** | 250 hPa | ≈ 10 km, ≈ −50 °C ✔ |
    | Tropics 0–10° N | **16.61 km** | **−76.7 °C** | 100 hPa | ≈ 16 km, below −75 °C ✔ |
    | 38–58° N | 10.27 km | −51.3 °C | 250 hPa | — |

    - The tropical tropopause is 6.5 km higher than the European one (W84 asks for ≥ 4 km).
    - Over 38–58° N the mean T falls at every step from 1000 to 250 hPa.
    - Sector mean: T(1 hPa) − T(20 hPa) = **+39.6 K**; z̄(1 hPa) = **47.1 km** (≈ 47.4 km geometric; W84 range 43–48). The sector-mean minimum is at 100 hPa (16.4 km).
    - Europe's strip minimum is at 20 hPa (26.3 km, −57.8 °C). The 45–55° N column is almost isothermal from 250 to 20 hPa (−52 → −58 °C), so "warmer again" holds only above about 25 km there.
    - The single grid column at Trappes is different: 250 hPa is at 9.97 km and −44.4 °C, and the tropopause is at 8.75 km and −46.4 °C, because the Ciarán trough lowers it. The planner's "Trappes 250 hPa −54 °C" was a planning value. Narrate the **strip** numbers.
  - Humidity box (cos-lat area means; below-ground points masked):

    | Level | z̄ | q̄ |
    |---|---|---|
    | 1000 hPa | 0.12 km | 16.1 g/kg |
    | 850 hPa | **1.54 km** | 8.2 g/kg |
    | 700 hPa | **3.19 km** | **5.1 g/kg** |
    | 500 hPa | 5.89 km | 2.0 g/kg |
    | 300 hPa | **9.70 km** | **0.33 g/kg** |

    - Maximum q(1000 hPa) is **19.9 g/kg at 12.5° N 18.5° W** ("about twenty").
    - z̄(300) = 9.70 km is exactly at the top of W85's range of 8.5–9.7 km. It says "about ten" better than "about nine".
  - Vapour fraction: column water by the trapezoid rule in p, divided by g. This is a check-only calculation; the library version is `diag.sounding.column_integral`, which another agent is writing.
    - 1000–850 hPa / 1000–300 hPa = **0.459** (all columns, area-weighted).
    - **0.466** for the columns fully above ground. **0.457** if the whole column goes to 1 hPa.
    - **0.495** when the surface-to-1000 hPa layer is added over the ocean (q held at its 1000-hPa value).
    - So "about half below 1.5 km" holds (W85 range 0.40–0.60). The box-mean column from 1000 to 300 hPa is 36.0 kg m⁻².
- **Quick-looks**: `outputs/ch00/data/ql_wb_stack_t16.png` and `ql_wb_stack_q10.png`.
  - Latitude runs S→N. The Ciarán cold trough shows over Biscay at 500 and 250 hPa.
  - The cold tropical tropopause shows at 100 hPa and the warm stratopause at 1 hPa.
  - Humidity is 15–20 g/kg over the tropical Atlantic at 1000 hPa and drops to < 1 g/kg at 300 hPa.
- **Provenance**: dataset key in the attrs. This is a new fetch, not `ERA5-ARCO-ciaran2023-10lev` (registry `provenance_not`, W84).
- **Colab route**: the two repo `.nc` files (no keys). Refresh: `movie_wb.fetch_stacks()` (anonymous).
- **Pitfalls**:
  - The ARCO transfer is about 300 MB for 17 MB on disk.
  - Geopotential vs geometric height at 1 hPa (+0.35 km).
  - Below-ground extrapolated values over Africa at 1000/950 hPa: mask them.
- **Disk**: before C: 52.7 GB free, G: 520.1 GB free; after C: 52.7 GB, G: 520.1 GB. Project data 70.25 → 70.26 GB of 150. Nothing evicted.
