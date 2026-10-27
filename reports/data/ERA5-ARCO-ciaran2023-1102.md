# ERA5-ARCO-ciaran2023-1102 — Storm Ciarán on 2 Nov 2023, 09/12/13/15 UTC: 850/500 hPa height and wind, MSLP, 10 m wind, NE 50m land mask (movie ch00_cross_product_why v4, P4b + P7, scenes s45/s46)

- **Why a sibling and not an extension**: the existing `era5_ciaran_2023_upper.nc` (and its `ciaran_2023_upper.bin`)
  has a fixed shape (4 times × 2 levels × 141 × 241, 50°W–10°E) and the v3 builder reads it at 11-02T00. Changing its
  times or box would break that reader. The new files share the same format (same `box_product` / `write_bin_json`
  code, same variables and units, lat S→N, lon −180…180) and differ only in times and in a box extended east to
  15°E, to cover the satellite base map (25°W–15°E) and the North Sea and Low Countries east of the low.
  **Builder: read the sibling `ciaran_2023_{upper,sfc}_1102` for s45/s46. The old files stay as they are.**
- **Route**: ARCO-ERA5 zarr (anonymous), `fluidpy.data.era5_arco.fetch_box` → `fluidpy.data.fetch` (disk guard) →
  `box_product`. The box crosses 0°E, so store longitudes 310…359.75 and 0…15 are selected as one array.
  - **Surface**: `msl`, `u10`, `v10`, `t2m` at 2023-11-02T09, 12, 13, 15. Guard size 2.36 MB; raw file 1,533,200 B
    in 6.4 s (22.9 s with the guard and open).
  - **Upper**: `z` (= geopotential / 9.80665), `u`, `v` at 850 and 500 hPa, at the same 4 times. Guard size 3.54 MB;
    raw file 2,399,549 B in 209 s. The network transfer is about 1.2 GB, because one ARCO pressure-level chunk holds
    all 37 levels of one hour. 500 hPa costs no extra transfer and is included for format parity.
  - 13 UTC was added at the orchestrator's request: the MODIS Aqua overpass is at about 13:20 UTC over the storm.
    A first pass without it (09/12/15 only) left two `_3t_` raw files, which are superseded and evictable.
- **Licence verdict**: Copernicus licence / CC-BY 4.0, attribution required. **Redistributable: yes, with the credit
  line.** Natural Earth is public domain.
- **Derived products**:

  | File | Where | Size | Content |
  |---|---|---|---|
  | `era5_ciaran_2023_upper_1102.nc` | G: `derived/ch00/` | 2,401,646 B | z, u, v (time 4, level 2, lat 141, lon 261), float32 zlib, provenance |
  | `era5_ciaran_2023_sfc_1102.nc` | G: `derived/ch00/` | 1,533,587 B | msl, u10, v10, t2m (time 4, lat, lon) + `land` (lat, lon) |
  | `ciaran_2023_upper_1102.bin/.json` | repo `data/derived/ch00/` | 3,532,896 B + 9,528 B | z, u, v: render-ready float32 LE |
  | `ciaran_2023_sfc_1102.bin/.json` | repo `data/derived/ch00/` | 2,502,468 B + 10,169 B | msl, u10, v10, t2m, land |
  | `ciaran_land_50m.geojson` | repo `data/derived/ch00/` (copy on G: `derived/ch00/ciaran_admin/`) | 51,804 B | NE 50m land clipped to 35–70°N 50°W–15°E, 98 polygons, simplified 0.02°, rounded 0.001° |

  - The builder copies the repo files to `movies/ch00/ch00_cross_product_why/data/real/`. The data-scout does not
    write under `movies/`.
  - The `land` variable is NE 50m land at the grid-cell centres (1 = land; 22.6 % of the box). It is the same test as
    `land_mask()` in `movies/data/build_ch00_cross_product_why.py`.
  - Spot checks: Paris = land; Bay of Biscay 45.5°N 4°W = sea; North Sea 54°N 3°E = sea; Birmingham = land;
    50°N 20°W = sea.
- **Checks**:
  - **MSLP minimum** (box 50°W–15°E):

    | Time (UTC) | Position | Minimum |
    |---|---|---|
    | 09 | 51.5°N 0.75°E | 955.37 hPa |
    | 12 | 52.5°N 1.75°E | **955.93 hPa** |
    | 13 | 53.0°N 1.75°E | **956.12 hPa** |
    | 15 | 53.5°N 2.5°E | 956.33 hPa |

    The 12 UTC value matches the director's 955.9 hPa at 52.5°N 1.75°E.
  - **Consistency**: the 12 and 13 UTC MSLP is identical (max |Δ| = 0.0 Pa) to `era5_ciaran_2023_sfc.nc` on the
    shared 50°W–10°E box.
  - **850 hPa height low**: 12 UTC 973.4 m at 52.5°N 1.75°E, the **same grid point** as the MSLP minimum. 13 UTC
    974.2 m at 53.0°N 2.0°E (17 km away). 09 UTC 968.0 m and 15 UTC 976.3 m, also co-located.
  - **500 hPa low**: 12 UTC 5114 m at 52.5°N 1.25°E. The system is vertically stacked (mature, occluded): unlike
    the 11-02T00 case, the 500 hPa trough no longer lies upstream.
  - **Geostrophic vs actual wind at 850 hPa** (`fluidpy.geo.atmos.geostrophic_wind_from_height`, sea points 300–1500 km
    from the MSLP centre, |u_g| > 5 m s⁻¹):

    | Time (UTC) | Sea points | Median speed ratio actual/geo | Share with \|ratio − 1\| ≤ 0.10 | Median \|angle\| | Share with \|angle\| ≤ 10° |
    |---|---|---|---|---|---|
    | 12 | 7499 | 0.857 | 32 % | 6.8° | 70 % |
    | 13 | 7585 | 0.852 | 32 % | 6.4° | 75 % |

    - The ratio rises with distance from the centre (12 UTC): 0.80 at 300–700 km, 0.86 at 700–1100 km, 0.88 at
      1100–1500 km.
    - Averaging over 1° × 1° changes these numbers by less than 0.01.
  - **Candidate check points** (12 UTC, 1° means; geostrophic speed → actual speed, angle actual minus geo,
    + = anticlockwise):
    - Western Approaches 49°N 7°W: 21.6 → 18.7 m s⁻¹ (0.86), +2.7°.
    - Celtic Sea 50.5°N 9°W: 18.7 → 16.5 (0.88), +7.3°.
    - Biscay 46°N 5°W: 20.5 → 17.2 (0.84), −0.7°.
    - North Sea 57°N 2°E: 27.4 → 22.4 (0.82), −1.5°.
    - North Sea 56°N 4°E: 27.3 → 19.8 (0.72), −8.8°.
    - At 13 UTC: Celtic Sea 50.5°N 9°W 16.6 → 16.6 (1.00), +7.5°; Western Approaches 0.92, +9.5°; North Sea
      57°N 2°E 0.80, −4.2°.
  - **10 m wind vs MSLP-geostrophic**, using the density ρ = p/(R_d T₂ₘ):
    - 12 UTC: median speed ratio 0.63, median turning 12.6° toward the low, and 90 % of sea points turned toward the
      low.
    - 13 UTC: 0.63, 12.4°, 91 %.
    - The friction signature is clear.
- **Problem for the storyboard CHECK `speed_850`** (s46: |speed_act/speed_geo − 1| ≤ 0.10 at both points and for the
  median): **at 12 and 13 UTC the median FAILS** (actual ≈ 0.85 × geostrophic), and most North Sea points fail too.
  - **Direction passes**: the median |angle| is 6–7°, and the Biscay/Western Approaches points are within 10°.
  - **Cause**: the low is mature, compact and strongly curved. Cyclonic curvature makes the balanced wind the
    *gradient* wind, which is slower than geostrophic.
  - A rough check with the radius of curvature taken as the distance from the centre, V = −fR/2 + √(f²R²/4 + fRV_g):
    - Biscay 46°N 5°W (R = 855 km): 17.2 m s⁻¹ predicted vs 17.2 actual.
    - North Sea 57°N 2°E (R = 500 km): 20.5 vs 22.4.
  - The 11-02T00 case in the v3 report gave 4–8 % because its points were on straighter flanks.
  - **Options for the director**:
    1. Choose a point where the speed passes (Celtic Sea 50.5°N 9°W at 13 UTC is 1.00, +7.5°; at 12 UTC the best
       sea points are about 0.88). Note that no North Sea point passes 10 %.
    2. Loosen the speed CHECK to about 20 %, with the curvature explanation (keeps "closely").
    3. Say "a little slower where the isobars curve tightly", or use 11-02T00 for the speed comparison.

  This is the director's call; the data are not tuned.
- **Quick-look**: `outputs/ch00/data/p4b_ciaran_1102_12utc.png` (12 UTC MSLP every 4 hPa with NE 50m land; z850
  every 40 m with geostrophic (violet) and actual (teal) arrows at every-1.5° sea points). Orientation is correct
  (north up, Greenland top left, Iberia bottom right). The low is over the southern North Sea off East Anglia.
- **Pitfalls**:
  - Before 11-01T15 the deepest low in a large box is the old parent low (see `ERA5-ARCO-ciaran2023.md`). On 2 Nov the
    box minimum is Ciarán.
  - A second, weaker closed low of about 972 hPa sits near 55°N 11°W at 12 UTC. Do not put the "L" there.
  - The z850 minimum is about 973 m, far below the standard-atmosphere value of about 1460 m.
- **Colab route**: load the committed `data/derived/ch00/ciaran_2023_{upper,sfc}_1102.{bin,json}` (no keys). Refresh
  with `fluidpy.data.era5_arco.fetch_box(..., lat=(35, 70), lon=(-50, 15), times=[...], levels=[850, 500])`
  (anonymous, but about 1.2 GB of transfer for the upper fields).
- **Recipe** (one-off driver, not committed):
  1. `fetch_box("", "", (35, 70), (-50, 15), ("u10", "v10", "msl", "t2m"), tag="ciaran_2023_1102", times=T)` and
     `fetch_box(..., ("z", "u", "v"), levels=[850, 500], ...)`.
  2. `box_product(raw, "ciaran_2023_{sfc,upper}_1102", ...)`.
  3. Add `land = naturalearth.land_mask_grid(lat, lon)` to the surface product.
  4. `write_bin_json(...)`.
  5. `naturalearth.land_box_geojson((35, 70), (-50, 15), out)`.
- **Credit line**: "Contains modified Copernicus Climate Change Service information 2026. Neither the European
  Commission nor ECMWF is responsible for any use that may be made of the Copernicus information or data it contains.
  ERA5 (Hersbach et al. 2020) via ARCO-ERA5 (Google Research). Land: Made with Natural Earth."
- **Disk**:
  - Before: C: 75.7 GB and G: 578.7 GB free (project data 10.85 GB).
  - After: C: 75.5 GB and G: 578.7 GB free (project data 10.86 GB; raw 0.28 GB).
  - Nothing was evicted.
