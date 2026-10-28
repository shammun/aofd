# ERA5-CDS-ciaran2023-pl — ERA5 925/850/700 hPa round Storm Ciarán, 17–19 UTC 1 Nov 2023 (movies #1a D1, #1b D1)

- **Route**: CDS API through `fluidpy.data.cds.retrieve` → `fluidpy.data.fetch(retrieve=…)` (disk guard).
  - Request: `reanalysis-era5-pressure-levels`, reanalysis, `vertical_velocity` (ω), `temperature`, `u/v_component_of_wind`,
    `geopotential`, `specific_humidity`; 925, 850, 700 hPa; 2023-11-01 17:00, 18:00, 19:00; area [58, −15, 40, 5] (N, W, S, E),
    native 0.25°; netCDF unarchived.
  - 715,437 B in 42.7 s transfer (108 s including the queue), sha256 `70171bb3…8323`.
  - **Route change from the plan**: data_needs named ARCO-ERA5 for D1. ARCO stores all 37 levels of a variable-hour in one
    chunk (~100 MB each), so 6 variables × 3 hours would have moved about 1.8 GB over the network. The CDS cut the same
    ERA5 fields on the server and sent 0.7 MB. The two routes were already shown to agree to GRIB packing precision on
    2026-10-27 (registry `ERA5-CDS-ciaran2023-850`). Here, too, the 850 hPa t/u/v/q at 18 UTC equal the A1 product exactly
    (difference 0.0).
- **Product**: `era5_ciaran_2023_pl_925-850-700_17-19UTC.nc` (784,487 B, sha256 `cfd5708e…947c`). It is on G:
  `derived/ch00/` and in the repo `data/derived/ch00/`.
  - Dims: (time 3, level 3, lat 73 S→N 40…58, lon 81 −15…5).
  - Variables: `w` = ω [Pa s⁻¹] (negative = rising), `t` [K], `u`, `v` [m s⁻¹], `z` geopotential [m² s⁻²], `zh` = z/9.80665 [m],
    `q` [kg kg⁻¹].
- **Checks at Brest's grid point, 48.5° N 4.5° W, 18 UTC**:

  | Row | What | Value | Needed | Result |
  |---|---|---|---|---|
  | VI06 | 850 hPa u, v, T | u 5.85, v 33.49 m/s; T 5.12 °C | u 5.7–6.0, v 33.3–33.7, T 5.0–5.3 °C | PASS |
  | VI16 | w at 850 hPa | ω −0.986 Pa/s → w = +0.095 m/s (`fluidpy.geo.atmos.omega_to_w`, with T_v) | 0.05–0.3 m/s | PASS (about 10 cm/s) |
  | VI17 | z₈₅₀ | 1195 m | 1.0–1.4 km | PASS |
  | VI29 | ρ₈₅₀ = p/(R_d T) | 1.064 kg m⁻³ (1.060 with T_v) | 1.03–1.09 | PASS |
  | s24 | shear 925 → 850 | (Δu, Δv) = (+11.9, +6.9) m/s over Δz = 696 m | — | — |

  - Hourly values at 850 hPa: 17 UTC 2.38 °C, (7.64, 23.33) m/s; 19 UTC 8.23 °C, (24.24, 29.62) m/s.
    These match VI08 and VI14.
  - w at 850 hPa: −0.020 m/s at 17 UTC (sinking), +0.095 m/s at 18 UTC, +0.188 m/s at 19 UTC.
  - At 700 hPa, 18 UTC: ω −2.81 Pa/s → w = +0.32 m/s.
- **Quick look**: `outputs/ch00/data/ql_era5_ciaran_pl_850_18UTC.png`. The rising band (ω < 0) lies along the cold front
  and the warm conveyor belt through Brest. The warm tongue is south-west of Brest. North is up.
- **Licence verdict**: CC-BY 4.0 (Copernicus). **Redistributable: yes**, with the attribution "Contains modified Copernicus
  Climate Change Service information 2026 …".
- **Colab**: loads the committed product. No key needed.
- **Disk**: before C: 68.0 GB, G: 543.9 GB free; after C: 68.0 GB, G: 543.3 GB free. Nothing evicted.
