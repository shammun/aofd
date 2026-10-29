# ERA5-ARCO-ian2022-pl: ERA5 pressure-level winds round Hurricane Ian, 2022-09-28 18 UTC (movie #5 D2, s14, DC14)

- **Route**: ARCO-ERA5 zarr (anonymous) through `fluidpy.data.era5_arco.fetch_box`.
  - u, v, w (`vertical_velocity`, newly mapped as `w`) on 18 levels (1000–100 hPa), plus msl, u10, v10.
  - Box 20–32° N, 90–75° W, one hour.
  - On disk: 527,574 B (69.8 s) + 47,550 B (3.2 s). The network transfer is larger (whole 37-level global chunks, ~0.3 GB).
  - The guard was sized on the selections (0.65 and 0.04 MB).
- **Licence**: CC-BY 4.0 (Copernicus), attribution line required. **Redistributable: yes.**
- **Product**: `era5_ian_2022-09-28T18_pl.nc` (580,264 B, sha256 `7133d65d…5346`), on G: and in the repo.
  - Built by `vertical_ring_product`: one centre for all levels, the sub-grid MSLP minimum, 26.454° N 82.391° W, 979.6 hPa.
  - ERA5 smooths the low: the best track has 938 hPa.
  - Ring means of v_r, v_t and ω on radii 50–500 km, 72 azimuths.
- **DC14: PASS** (v_r at 100 / 200 km, m/s):

  | Level | 1000 hPa | 975 | 925 | 850 | 500 | 200 | 150 | 125 |
  |---|---|---|---|---|---|---|---|---|
  | v_r | −6.4 / −4.8 | −9.2 / −6.1 | −4.4 / −3.4 | −0.8 / −0.4 | +0.3 / +0.5 | +2.2 / +4.2 | +3.4 / +2.5 | +5.1 / +4.4 |

  - The inflow sits **near the sea (1000–925 hPa)**. At 850 hPa it is only marginal, so the narration should not tie
    inflow to 850 hPa. The outflow is strongest at **200–125 hPa**, about 12–15 km up.
  - Ascent: ring-mean ω −2.3 Pa/s at 50 km between 850 and 800 hPa (the eyewall ring).
  - Above 150 hPa beyond 400 km the outflow turns anticyclonic (v_t −6 to −13 m/s).
  - The tangential maximum is only ~33 m/s at 850 hPa, 100 km (the 0.25° grid smooths the eyewall).
- **Pitfall**: ERA5 is coarse for a 20-n-mi RMW hurricane. Use it for the *signs* of the in-up-out circulation, not for the wind speeds (HRRR A3 gives those).
- **Quick look**: `outputs/ch00/data/d2_era5_ian_rings.png`.
- **Colab route**: the repo product (no keys).
- **Disk**:

  | | C: free | G: free |
  |---|---|---|
  | Before | 68.8 GB | 536.2 GB |
  | After | 68.5 GB | 536.0 GB |

  Nothing was evicted.

## Stack check and heights extension, 2026-10-29 (retrofit plan §4.2, #5 K5 stack)

- **Levels**: the product already holds u, v (and ω) on **18** levels (1000, 975, 950, 925, 900, 850, 800, 700, 600,
  500, 400, 300, 250, 200, 175, 150, 125, 100 hPa), on a 49 × 61 grid over 20–32° N, 90–75° W. That meets the plan's
  "≥ 18". No u/v extension was needed.
- **Radial wind**, ring mean at 200 km: inflow from 1000 to 850 hPa (−4.8, −6.1, −5.1, −3.4, −2.1, −0.4 m/s); weak and
  mixed from 800 to 300 hPa (|v_r| ≤ 0.5 m/s); outflow from 250 to 125 hPa (+0.7, +4.2, +4.7, +2.5, +4.4 m/s); −1.3 m/s at
  100 hPa. The lowest sign change is between 850 and 800 hPa (on the 100-km ring, 850 hPa −0.8 and 800 hPa +0.3 m/s).
- **Heights added** (the product had none, and the stack's layer heights and the narration's "sixteen kilometres"
  need them):
  - Source: CDS `reanalysis-era5-pressure-levels` geopotential on the same 18 levels, 2022-09-28 18:00, area
    [32, −90, 20, −75], through `fluidpy.data.cds.retrieve` (raw folder `raw/ERA5-CDS-ian2022-z/`).
  - Raw file: 106,698 B, 42.4 s transfer (887 s with the CDS queue), sha256 `2bd66393…6ecd`. Final ERA5.
  - Product `era5_ian_2022-09-28T18_z18.nc` (`fluidpy.data.stack.stack_product`): 212,045 B, sha256 `214daef5…8b0a`, on
    G: **and in the repo**. Its grid is identical to the u/v product.
  - zg at the centre (26.454° N, 82.391° W):

    | Level (hPa) | 1000 | 975 | 850 | 500 | 200 | 100 |
    |---|---|---|---|---|---|---|
    | zg (m) | −171 | 49 | 1254 | 5680 | 12,422 | 16,647 |

    - At 1000 hPa the height is below sea level, because ERA5 extrapolates under the 979.6 hPa low. The movie should
      start the stack at 975 hPa at the centre, or label that layer.
    - The top is 16.6 km, so "from the sea to about sixteen kilometres" holds.
- **Licence**: CC-BY 4.0. **Redistributable: yes.**
- **Disk**: before, C: 53.4 GB and G: 520.4 GB free. After, C: 52.8 GB and G: 520.3 GB free. Nothing was evicted.
