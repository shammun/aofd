# ERA5-CDS-monthly-tcwv — ERA5 monthly total column water vapour, 1979-01 → 2026-09, global (movie #4 D3, DT53)

- **Route**: CDS API through `fluidpy.data.cds.retrieve`, in two requests so that no month is asked for before it exists.
  - (a) `reanalysis-era5-single-levels-monthly-means`, `total_column_water_vapour`, 1979–2025 × 12 months, grid 1° × 1°
    (server-side): 66,867,786 B in 186.6 s transfer (251 s including the queue), sha256 `61616743…f83b`.
  - (b) 2026-01 … 2026-09 (the latest complete month): 1,035,222 B in 86.3 s, sha256 `0d07421d…701a`.
- **Product**: `era5_tcwv_global_1979-2026-09.nc` (87,689 B, sha256 `dee652e3…9803`). On G: and in the repo.
  - `tcwv_gm`: monthly global mean, 573 months [kg m⁻²].
  - `tcwv_gm_anom`: deseasonalised against the 1991–2020 monthly climatology.
  - `tcwv_gm_annual`: calendar years 1979–2025.
  - `tcwv_trend_pct_per_decade_2deg`: per-cell OLS trend of annual means 1979–2025, every second 1° point, in % per
    decade of the cell's 1991–2020 mean.
  - Attributes: `trends` (JSON, both periods) and `reference_mean_kg_m2`.
  - Global means use `fluidpy.diag.climatology.global_mean` (cos ϑ weights). Trends use
    `fluidpy.diag.climatology.linear_trend` (OLS SE; AR(1) variant after Santer et al. 2008).
- **DT53** (reference mean 1991–2020 = 24.290 kg m⁻²):

  | Period | Annual means, OLS | AR(1) SE | Monthly anomalies, AR(1) | > 3 SE? |
  |---|---|---|---|---|
  | 1979–2025 | **+0.839 ± 0.136 %/decade** (+0.204 kg m⁻²/decade; t = 6.2) | ± 0.255 (t = 3.3) | +0.874 ± 0.171 (t = 5.1), to 2026-09 | **PASS** |
  | 1993–2025 | **+1.667 ± 0.175 %/decade** (+0.405 kg m⁻²/decade; t = 9.5) | ± 0.213 (t = 7.8) | +1.695 ± 0.202 (t = 8.4), to 2026-09 | **PASS** |

  - Both periods pass, also with the AR(1) inflation, so s41 sentence 5 can keep its wording (it names no number).
  - Annual global mean: 24.23 kg m⁻² (1979) → 24.97 (2025). The highest year is 2024.
  - The 1979 slope is about half the 1993 slope. This fits the Allan et al. (2022) caveat that ERA5 low-level tropical
    vapour is inconsistent before about 1993.
  - The per-cell trend routine was checked against `linear_trend` at one cell: relative difference 1.5 × 10⁻⁵ (from
    slightly different decimal-year conventions).
- **Quick look**: `outputs/ch00/data/ql_era5_tcwv.png`. The seasonal cycle peaks in July (NH summer). Moistening is strongest
  over the Arctic, North Africa and the Middle East. There is a drying band in the subtropical South-East Pacific.
- **Licence verdict**: CC-BY 4.0 (Copernicus). **Redistributable: yes.** The raw 1° files stay on G: (68 MB) and are
  evictable once the build is final.
- **Runner-up not needed**: NCEP R1 `pr_wtr.eatm.mon.mean.nc`.
- **Colab**: loads the committed product.
- **Disk**: before (a) C: 68.0 GB, G: 543.9 GB free; after C: 67.4 GB, G: 543.2 GB free. Nothing evicted.
