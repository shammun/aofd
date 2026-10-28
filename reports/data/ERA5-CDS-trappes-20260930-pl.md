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
