# ERA5-CDS-monthly-t2m: ERA5 September 2026 2 m temperature anomaly from 1991–2020 (movie #5 D4, s34)

- **Route**: CDS API through `fluidpy.data.cds.retrieve`.
  - Request: `reanalysis-era5-single-levels-monthly-means`, `2m_temperature`, month 09 of 1991–2020 and 2026, grid 1° × 1° (server-side), netCDF unarchived.
  - Result: 3,144,777 B in 46.7 s of transfer (101 s including the queue), sha256 `1a1efd4c…65c3`.
  - September 2026 is the latest complete month. October 2026 data appear in early November.
- **Licence**: CC-BY 4.0 (Copernicus), attribution line required. **Redistributable: yes.**
- **Product**: `era5_t2m_anom_2026-09_1deg.nc` (436,896 B, sha256 `c5335076…8824`), on G: and in the repo.
  - `t2m_anom`, `t2m_clim` and `t2m` on (181 lat S→N, 360 lon −179…180).
  - Built by the new `fluidpy.data.cds.monthly_anomaly_product`, which uses `fluidpy.diag.climatology.monthly_anomaly` and `global_mean`.
- **Numbers** (no number is spoken in s34):
  - 30 base years.
  - Global-mean anomaly (cos-lat weighted): **+0.823 K**. Range −8.5 to +14.7 K.
  - Arctic (≥ 66.5° N) mean: +1.07 K.
  - **Area honesty**: 82.0 % of the Earth's area was warmer than in 1991–2020, but warm anomalies cover only 68.7 % of a
    Mercator map (clipped at 85°), because Mercator inflates the polar regions, where anomalies of both signs sit.
    These numbers are useful for the builder's CHECK row on the Mercator/Equal Earth pair.
- **Pitfall**: September 2026 may still be ERA5T (preliminary). The final ERA5 can replace it after 2–3 months; the change is usually negligible.
- **Colab route**: the repo product (no keys). Refresh needs CDS Secrets.
- **Disk**:

  | | C: free | G: free | Project data |
  |---|---|---|---|
  | Before | 68.2 GB | 535.7 GB | 54.70 GB |
  | After | 68.2 GB | 535.7 GB | 54.70 GB |

  Nothing was evicted.

## Extension 2026-10-30: January 1991–2020 (movie M01 D1, s21)

- **Route**: `fluidpy.data.cds.retrieve`, January of 30 years, 2t, area 85° N 170° W 20° N 60° E, native 0.25°; 10,521,553 B in 48.9 s.
- **Product**: `era5_t2m_jan_clim_1991-2020_20-85N_170W-60E.nc`, 1,018,412 B, on G: and in the repo. `t2m_clim` [K], `t2m_clim_c` [°C], 261 × 921.
- **DM21, measured**:

  | Quantity | Measured | Plan | Verdict |
  |---|---|---|---|
  | 0 °C isotherm, 100–85° W | 37.8–38.9° N | 40 ± 3 | PASS, but "about thirty eight" is closer |
  | 0 °C isotherm, 5–15° E, over sea | 72.6–73.7° N (71.7° N at 0° E) | ≥ 68 | PASS |
  | Difference | **3929 km** (38.4 → 73.7° N) | 3300 ± 300 | **FAIL** |
  | Largest |∇T| of the frame along the N. American east coast | **no**: Sierra Nevada 28.8, SW Greenland coast 25.2 K/100 km | within 300 km of the coast | **FAIL** |

  The east coast does crowd: box 30–45° N, 80–65° W has 90th percentile 4.0 and maximum 9.1 K/100 km against 1.0 for the frame median and 0.44 in the open Atlantic. The sentence "where the isotherms crowd together, like along the east coast of North America" is fair as an example, but it is not the frame's maximum.
- **Affects s21**: "about forty degrees north", "to about seventy degrees north", "about three thousand three hundred kilometres further north". Measured wording: "about thirty eight", "more than seventy", "almost four thousand kilometres".
- **Disk**: whole session, C: 60.4 → 61.0 GB free, G: 492.1 → 491.1 GB free, project data 98.07 → 99.01 GB. Render scratch moves these too. Nothing evicted.
