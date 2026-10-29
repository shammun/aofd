# ERA5-ARCO-wb-front-20231101T18: ERA5 on 11 levels (1000–500 hPa) round the Biscay cold front, 18 UTC 1 Nov 2023 (weather-basics UF2, D-UF2-2)

- **Route**: ARCO-ERA5 zarr (anonymous) through `fluidpy.data.movie_wb.fetch_front()` → `era5_arco.fetch_box` → `fluidpy.data.fetch` (disk guard).
  - Fetched 2026-10-29: guard estimate 1,937,000 B; **1,328,250 B** in **88.9 s**; sha256 `e28bf170…dd51` (informational).
  - Variables t, z, u, v, q on 1000, 950, 900, 850, 800, 750, 700, 650, 600, 550, 500 hPa, plus sp; box 40–56° N, 25° W–8° E, 0.25° (65 × 133).
- **Licence**: Copernicus licence / CC-BY 4.0, attribution as ERA5. **Redistributable: yes.**
- **Products** (`fluidpy.data.movie_wb.front_product` → `stack.stack_product(..., source="arco")`):

  | File | Where | Size (B) | sha256 |
  |---|---|---|---|
  | `era5_wb_front_11lev_2023-11-01T18.nc` (with z) | G: `derived/ch00/` | 1,548,263 | `590a0507…7764` |
  | `era5_wb_front_11lev_2023-11-01T18.nc` (t q u v zg sp below_ground; no z) | repo `data/derived/ch00/` | 1,329,072 | `84af8a6c…99fa` |

  Dims are (level bottom→top, lat S→N, lon −25…8).
- **Checks**:
  - **Overlap with the section file** `era5_ciaran_2023_section_48p5N_18UTC.nc` (CDS route; 11 common levels, 46–51° N, 20° W–6° E, 24,255 points): max |ΔT| = **6.4 × 10⁻⁴ K**, mean 2.6 × 10⁻⁴ K. This is below 1e-3 K, so the two routes agree.
  - **Cold front along 46.5° N**: `fluidpy.diag.fronts.front_lines`, locate = "centre", Hewson TFP, 100-km smoothing, cold segments, crossings between 13° W and 3° W. Traced level by level from 850 hPa, nearest crossing, at most 80 km per step. The rule is the same as the builder's W70 and the planned `front_by_level`. The result is the same for min_length 250 km and 100 km.

    | Level | z̄ (box mean) | Cold-front longitude at 46.5° N |
    |---|---|---|
    | 900 hPa | 0.82 km | 7.99° W (the low-level "nose" leans east) |
    | 850 hPa | **1.29 km** | **7.39° W** (= the s49 map front, 0.0 km apart) |
    | 800 hPa | 1.78 km | 7.79° W |
    | 750 hPa | 2.30 km | 7.98° W |
    | 700 hPa | 2.85 km | 8.14° W |
    | 650 hPa | 3.43 km | 8.74° W |
    | 600 hPa | **4.04 km** | 9.98° W, **not traced**: a 95-km step from 650 hPa, over the 80-km limit |
    | 550 hPa | 4.71 km | 11.99° W (not traced) |
    | 1000, 950, 500 hPa | 500 hPa: **5.42 km** | no cold crossing |

    - Traced on **6 of 11 levels** (900–650 hPa). W86 asks for ≥ 8 of 11, so it fails with an 80-km step.
    - Westward with height at every step from 850 hPa upward.
    - Least-squares slope from 850 to 650 hPa: **1:43.9** (r = −0.976), i.e. **110 km per 2.5 km** (1.5 → 4 km).
    - Direct steps: 850 → 650 hPa = 103 km over 2.13 km. 850 → 600 hPa = **198 km over 2.75 km (1:72)**, if 600 hPa is accepted.
    - The planner's "≈ 130 km" lies between the fitted 110 km and the 850→600 direct 198 km. Recommended words: **"about a hundred kilometres"** (the fit, consistent with the 1:50 W70 slope), or raise `max_step_km` to 100 km so that 600 hPa (and maybe 550) is traced and the number is about 200 km.
    - Box-mean z̄(850) is 1.29 km, not the planner's 1.5 km, because Ciarán's low sits in the box. Box-mean z̄(600) is 4.04 km and z̄(500) is 5.42 km (both in their ranges).
- **Quick-look**: `outputs/ch00/data/ql_wb_front_11lev.png`.
  - T anomaly minus the box mean at 950/850/700/600 hPa, with winds.
  - The warm seclusion and the cold-front tongue cross 46.5° N near 8° W. The cold air deepens westward with height.
- **Fallback**: the section file was not needed.
- **Colab route**: the repo `.nc` (no keys).
- **Disk**: before C: 52.7 GB free, G: 520.1 GB free; after C: 52.7 GB, G: 520.1 GB. Nothing evicted.
