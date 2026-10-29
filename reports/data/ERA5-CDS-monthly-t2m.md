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
