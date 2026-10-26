# ERA5-ARCO-ciaran2023 — Storm Ciarán, ERA5 MSLP, 10 m wind, 850/500 hPa height and wind (movie ch00_cross_product_why, scene 11)

- **Why Ciarán** (case choice):
  - It is a deep, compact, classic Norwegian-type low with closed, tightly packed isobars, moving from the open
    Atlantic (1 Nov) into the English Channel (2 Nov 2023).
  - It is widely known and recent (named by the Met Office).
  - The Met Office reported a record-low November MSLP for England and Wales: 953.3 hPa at Plymouth (Met Office,
    2 Nov 2023). ERA5's minimum, 953.7 hPa at 2023-11-02T04 at 50.25°N 3.0°W, matches it within 0.4 hPa.
  - At 2023-11-01T18 and 11-02T00 the low is over the sea west of Brittany and Cornwall, with a strong, almost straight
    flow on its south and west flanks over the ocean: a clean place to compare geostrophic and actual wind.
- **Route**: ARCO-ERA5 zarr (anonymous). The box 35–70°N, 50°W–10°E crosses 0°E, so store longitudes 310…359.75 and
  0…10 are selected as one array.
  - **Surface**: `u10`, `v10`, `msl`, `t2m` (t2m only for the near-surface density), 2023-11-01T00 to 11-02T23 hourly
    (48 times), 141 × 241. Guard size 26.1 MB; file 16,445,955 B in 71.5 s; transfer about 0.53 GB.
  - **Upper**: `z` (geopotential/9.80665), `u`, `v` at 850 and 500 hPa, at 2023-11-01T12, 18, 11-02T00, 06. Guard
    size 3.26 MB; file 2,194,021 B in 202.6 s; transfer about 1.2 GB. In ARCO one pressure-level chunk holds all 37
    levels of one hour (80–120 MB), so upper-air fields should be fetched at a few times only. For long upper-air
    series, use the CDS with `pressure_level` and `area` instead.
- **Licence verdict**: Copernicus licence / CC-BY 4.0, attribution required. **Redistributable: yes, with the credit
  line.**
- **Derived products** (G: `derived/ch00/`):
  - `era5_ciaran_2023_sfc.nc` (16.3 MB, hourly, float32 zlib).
  - `era5_ciaran_2023_upper.nc` (2.2 MB).
- **Movie copies**:
  - `ciaran_2023_sfc.bin` (6,524,352 B; **3-hourly**, 16 times; msl, u10, v10) plus `.json`.
  - `ciaran_2023_upper.bin` (3,262,176 B; z, u, v at 4 times × 2 levels) plus `.json`.
  - Both are in `movies/ch00/ch00_cross_product_why/data/real/`.
- **Track (MSLP minimum in the box)**:
  - **Before 2023-11-01T15** the deepest low in the box is the **old parent low near 56°N 25°W** (965 hPa), not Ciarán.
  - From 15 UTC Ciarán is the deepest: 48.5°N 14.25°W 964.3 hPa → 01T18 48.75°N 11.75°W 960.7 → 02T00 49.75°N 5.75°W
    954.6 → 02T03 50.0°N 3.75°W 953.7 → 02T06 50.5°N 1.5°W 954.0 → 02T12 52.5°N 1.75°E 955.9.
  - Use times ≥ 2023-11-01T15 for Ciarán, or restrict the search box.
- **Geostrophic check** (`fluidpy.geo.atmos.geostrophic_wind_from_height`, Vallis Eq. (2.215) on the sphere, f = 2Ω sin ϑ):
  - **Method**: averaged over 1° × 1° (5 × 5 points). For MSLP the function gets Z = p/g₀ and the result is divided
    by the local near-surface density ρ = p/(R_d T₂ₘ) ≈ 1.20–1.24 kg m⁻³. Angles are actual minus geostrophic,
    positive = turned anticlockwise, which is toward low pressure in the NH.

  | time (UTC) | point | 850 hPa geostrophic (u, v), speed | 850 hPa actual | angle |
  |---|---|---|---|---|
  | 11-01T18 | W flank 48.75°N 21.75°W | (19.1, −9.9), 21.5 m s⁻¹ | (18.6, −9.1), 20.7 | +1.3° |
  | 11-01T18 | S flank 42.75°N 11.75°W | (39.6, 3.9), 39.8 | (36.3, 6.1), 36.8 | +3.9° |
  | 11-02T00 | W flank 49.75°N 15.75°W | (20.0, −11.0), 22.8 | (19.3, −9.5), 21.5 | +2.6° |
  | 11-02T00 | S flank 43.75°N 5.75°W | (26.6, −2.5), 26.7 | (28.1, −0.6), 28.1 | +4.1° |

  At 850 hPa over the ocean, the actual wind is within 4–8 % of geostrophic in speed and 1–4° in direction.
  - **Surface (MSLP-geostrophic vs 10 m wind)**:
    - 11-02T00, W flank: geostrophic 24.1 m s⁻¹, 10 m wind 15.5 m s⁻¹ (64 %), crossing the isobars by 13° toward
      the low.
    - 11-02T00, S flank: 25.5 vs 13.2 m s⁻¹ (52 %), 21° toward the low.
    - 11-01T18, W flank: 20.6 vs 15.5 m s⁻¹, 14°.

    This is the expected friction signature: slower than geostrophic, turned toward low pressure.
  - **500 hPa**: 11-01T18 W flank 26.4 vs 25.3 m s⁻¹, 8°; 11-02T00 W flank 19.4 vs 18.9 m s⁻¹, −0.7°. Near the jet
    core (S flank, about 50–60 m s⁻¹) the actual wind is 10–15 % sub-geostrophic, because flow curvature makes it
    gradient-wind rather than geostrophic.
  - **Points near or over land** (SE of the centre, Biscay/France) are poor: 17–64° off. Do not use them.
- **Recommendation for scene 11**: draw the **MSLP isobars** (the familiar weather map) for 2023-11-02T00 UTC. Put the
  arrows **at 850 hPa (about 1.5 km up), labelled as such**, and compare them with the geostrophic arrows from the
  850 hPa height field. They agree within a few degrees and a few per cent over the sea. The 10 m wind can then show
  the friction-induced cross-isobar turning (13–25°) as an extra.
  - 500 hPa is also close to geostrophic, but its trough is tilted upstream of the surface low, so it does not sit
    on the surface isobars.
  - Avoid points over land and the T12 time (wrong low).
- **Quick-look**: `outputs/ch00/data/p4_ciaran.png` (MSLP + 10 m wind; 850 hPa height with actual and geostrophic
  arrows).
- **Credit line**: "Contains modified Copernicus Climate Change Service information 2026. Neither the European
  Commission nor ECMWF is responsible for any use that may be made of the Copernicus information or data it contains.
  ERA5 (Hersbach et al. 2020) via ARCO-ERA5 (Google Research)."
- **Disk**: before, C: 76.6 GB and G: 583.3 GB free. After, C: 78.7 GB and G: 583.2 GB. Project data went from 6.30
  to 6.34 GB.
