# ERA5-CDS-trappes-20260930-pl — ERA5 850/700/500 hPa round Trappes, 30 Sep 2026 00 and 12 UTC (movie #4 D2)

- **Route**: CDS API through `fluidpy.data.cds.retrieve`.
  - Request: `reanalysis-era5-pressure-levels`, t, u, v; 850, 700, 500 hPa; 2026-09-30 00:00 and 12:00; area
    [52, −3, 45, 7]; 0.25°.
  - 94,816 B in 57.4 s transfer (121 s including the queue), sha256 `bfe32de8…a39d`.
  - These fields are ERA5T, the preliminary near-real-time stream. ECMWF may revise them in the final ERA5 release,
    which is rare.
  - The date stays 30 Sep 2026 because the IGRA2 refresh has no newer Trappes sounding (IGRA2.md). The GFS archive
    fallback (F7 `gfs.fetch_archive`) was **not needed and not written**.
- **Product**: `era5_trappes_pl_t-u-v_850-700-500_2026-09-30T00-12.nc` (74,308 B, sha256 `38046cb1…9f71`). On G: and in the
  repo.
  - Dims: (time 2, level 3, lat 29 S→N 45…52, lon 41 −3…7). Variables: t [K], u, v [m s⁻¹].
- **Checks**:
  - ERA5 T at Trappes (48.7745° N 2.0098° E, bilinear), 12 UTC: 850 hPa 13.15 °C, 500 hPa −11.27 °C. The sonde measured
    12.3 / −11.8 °C, so the differences are +0.85 K and +0.53 K, which is acceptable for a 0.25° reanalysis.
  - ERA5 ∂T/∂t at 500 hPa from 00 to 12 UTC is −1.47 K (sonde pair −2.59 K).
  - **DT26**: sideways term −u·∇T (`fluidpy.diag.advection.advection`, 0.25° centred differences), interpolated along the
    drift (Trappes → 7.8 km E, 14.6 km N), 12 UTC:

    | Level | −u·∇T |
    |---|---|
    | 850 hPa | +3.8 × 10⁻⁵ K/s |
    | 700 hPa | +6.8 × 10⁻⁵ K/s |
    | 500 hPa | −0.2 × 10⁻⁵ K/s |

    - Mean magnitude ≈ 3.6 × 10⁻⁵ K/s (0.13 K/h), at the low end of 0.3–3 × 10⁻⁴ K/s.
    - 850 and 700 hPa are inside the range; 500 hPa is below it. **Borderline PASS.**
    - Suggested wording for s19 sentence 8: "a few hundred-thousandths of a degree per second, about a tenth of a degree
      per hour".
  - **DT27**: the sideways share is ≈ 3.6 × 10⁻⁵ / 2.68 × 10⁻² ≈ 0.13 %, so the rising share is ≈ 99.9 % (needed ≥ 98 %):
    **PASS**.
- **Licence verdict**: CC-BY 4.0 (Copernicus). **Redistributable: yes.**
- **Colab**: loads the committed product.
- **Disk**: before C: 68.0 GB, G: 543.9 GB free; after C: 68.0 GB, G: 543.3 GB free. Nothing evicted.

## Extension 2026-10-29: 16-level stack for #4 K4 (retrofit plan §3.7)

- **Route**: CDS through `fluidpy.data.cds.retrieve` (disk guard), same area [52, −3, 45, 7], 0.25°, 00 and 12 UTC.
  - `reanalysis-era5-pressure-levels`: t and z on all 27 ERA5 levels from 1000 to 100 hPa. 241,903 B, 39.6 s transfer
    (88 s with the queue), sha256 `2307299e…dddd`.
  - `reanalysis-era5-single-levels`: sp. 29,981 B, 27.3 s (82 s with the queue), sha256 `1f7ddf76…1bb3`.
  - The data is still ERA5T (expver 0005), so ECMWF may revise it in the final release.
- **Products** (`fluidpy.data.stack.stack_product`; float32, zlib, provenance):
  - `era5_trappes_stack16_t-z_2026-09-30T12.nc`: 135,361 B, sha256 `ff102c8c…f1fd`, on G: **and in the repo**.
    - Levels 1000, 950, 900, 850, 800, 700, 600, 500, 400, 300, 250, 200, 175, 150, 125, 100 hPa, ordered bottom to top.
      I chose 175 and 125 hPa (not 750/650) so the gaps resolve the tropopause.
    - Variables t [K], z [m²/s²], zg [m], sp [Pa], below_ground (int8). Dims (level 16, lat 29 S→N, lon 41).
  - `era5_trappes_stack27_t-z_2026-09-30T12.nc` (203,366 B) and `…T00.nc` (201,793 B): all 27 levels, **G: only**.
- **Checks**:
  - **Overlap**: the new t at 850, 700 and 500 hPa, at 00 and 12 UTC, is identical to the 3-level file (max |ΔT| = 0.0 K
    over 7134 values). **PASS**.
  - **Tropopause at Trappes, 12 UTC** (`fluidpy.geo.atmos.lapse_rate_tropopause`, WMO rule): 13,004 m, 208.2 K (−65.0 °C),
    at 175 hPa. The 27- and 16-level profiles give the same value. The IGRA sonde gives 13,072 m and 206.85 K. **PASS**.
  - **Gaps at Trappes** (ΔT/Δz, in K/km; Kundu sign, so negative means colder going up):

    | Gap (hPa) | 1000–950 | 950–900 | 900–850 | 850–800 | 800–700 | 700–600 | 600–500 | 500–400 |
    |---|---|---|---|---|---|---|---|---|
    | ΔT/Δz | −7.42 | −5.21 | −4.28 | −5.97 | −7.08 | −4.65 | −5.53 | −6.44 |

    | Gap (hPa) | 400–300 | 300–250 | 250–200 | 200–175 | 175–150 | 150–125 | 125–100 |
    |---|---|---|---|---|---|---|---|
    | ΔT/Δz | −7.51 | −7.79 | −9.10 | −5.92 | **+2.01** | +0.63 | +0.84 |

    - Temperature falls in every gap up to 175 hPa (13.0 km), then rises: **PASS**.
    - The sign changes between the 200–175 and 175–150 hPa gaps. The plan said 200–150 hPa, which still contains it.
  - **Heights**: zg at Trappes runs from 140 m (1000 hPa) to 16,452 m (100 hPa). Over the box, 100 hPa lies at
    16,364–16,487 m. So "about sixteen kilometres up" holds.
  - **Over the box** (1189 columns):
    - Every column has a tropopause, between 11,970 and 13,077 m (median 13,011 m). 100 hPa is at least 3.4 km above it,
      so the stack's top layer is in the stratosphere everywhere.
    - Every above-ground gap below the tropopause cools upward (100 %; mean −6.63 K/km, weakest −0.88 K/km).
    - Of the gaps at or above the tropopause, 95 % have ΔT/Δz ≥ −2 K/km and 75 % warm.
  - **Below the ground**: 1000 hPa is below the ground in 44.0 % of the columns (not at Trappes, where sp is
    1001.8 hPa). The shares are 7.9 % at 950 hPa and 1.3 % at 850 hPa, in the Alps and Massif Central corner. The movie
    must mask these points with `below_ground`.
- **Licence**: CC-BY 4.0. **Redistributable: yes.**
- **Colab**: loads the committed 16-level product.
- **Quick-look**: `outputs/ch00/data/trappes_stack16_t_2026-09-30T12.png` (Trappes profile and tropopause; T maps at
  850 and 150 hPa). Orientation is checked: lat S→N; at 850 hPa the warm air is in the south-east.
- **Disk**: before, C: 52.9 GB and G: 521.9 GB free. After, C: 52.9 GB and G: 521.9 GB free. Nothing was evicted.
