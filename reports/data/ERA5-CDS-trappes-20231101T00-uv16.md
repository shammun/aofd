# ERA5-CDS-trappes-20231101T00-uv16 — ERA5 wind on 16 levels above Trappes, 1 Nov 2023 00 UTC (movie #1a K1A stack)

- **Why**: retrofit plan §3.6. The K1A stack shows the wind above Trappes as 16 layers. The registered IGRA2 sonde
  has only **14** wind levels from the surface to 200 hPa (21 to 100 hPa), so it cannot fill 16 layers on its own.
  An ERA5 field gives a full 16-level stack and a map of arrows on every layer.
- **Route**: CDS API through `fluidpy.data.cds.retrieve` (disk guard).
  - `reanalysis-era5-pressure-levels`: u, v, z, t on all 27 levels from 1000 to 100 hPa, 2023-11-01 00:00, area
    [52, −2, 45, 8], 0.25°. 300,894 B, 55.6 s transfer (109 s with the queue), sha256 `ea7a2f9c…af86`.
  - `reanalysis-era5-single-levels`: sp, same area and time. 27,853 B, 27.0 s (82 s with the queue), sha256 `b7befca8…5688`.
  - The data is final ERA5 (expver 0001), so the files are fixed.
  - The plan proposed ARCO and the key `ERA5-ARCO-trappes-20231101T00-uv16`. The CDS serves the same ERA5 data as a
    server-side subset of 0.3 MB. ARCO would need about 4 global 37-level chunks (about 0.4 GB of network), so I used the
    CDS and named the key after the route.
- **Products** (`fluidpy.data.stack.stack_product`; float32, zlib, provenance):
  - `era5_trappes_stack16_u-v-z-t_2023-11-01T00.nc`: 228,019 B, sha256 `499e566c…a48`, on G: **and in the repo**
    (`data/derived/ch00/`).
    - Levels 975, 950, 900, 850, 800, 750, 700, 650, 600, 550, 500, 400, 350, 300, 250, 200 hPa, ordered bottom to top.
    - Variables u, v [m/s], t [K], z [m²/s²], zg [m], sp [Pa], below_ground (int8).
    - Dims (level 16, lat 29 S→N, lon 41).
  - `era5_trappes_stack27_u-v-z-t_2023-11-01T00.nc`: 348,052 B, sha256 `c569d467…4985`, all 27 levels, **G: only**.
- **Why 975 hPa and not 1000 hPa**: 1000 hPa is below the ground at Trappes (sp 991.9 hPa) and in 82.3 % of the box.
  At 975 hPa the share is 28.3 % (the high ground in the south-east corner). Mask it with `below_ground`.
- **Checks**:
  - **ERA5 against the IGRA sonde** (speed in m/s / direction FROM, in degrees):

    | Level (hPa) | ERA5 | IGRA |
    |---|---|---|
    | 925 | 17.8/225 | 18/230 |
    | 850 | 17.2/240 | 17/235 |
    | 700 | 14.5/228 | 15/235 |
    | 500 | 16.8/248 | 17/255 |
    | 400 | 20.0/252 | 21/260 |
    | 300 | 26.9/249 | 26/255 |
    | 250 | 26.6/247 | 28/255 |
    | 200 | 25.6/249 | 24/250 |

    Every level agrees within 1.5 m/s and 8°: **PASS**.
  - **Turning sense** (bilinear at Trappes; Northern Hemisphere; seen from above):
    - From 975 to 200 hPa the wind turns 37.8° clockwise in total (direction 212° → 249°). **PASS** for "clockwise going up".
    - From 850 to 500 hPa it turns only 8.3°. The sonde gives 20° (235° → 255°).
    - Between neighbouring levels, the cross product is negative (clockwise) in 10 of 15 gaps. The wind backs
      (turns anticlockwise) at 800 → 700 hPa and from 350 to 250 hPa.
    - Over the box, the 850 → 500 hPa turn is clockwise in 90.5 % of the 1189 columns.
  - **Speed**: 11.5 m/s at 975 hPa → 25.6 m/s at 200 hPa. It does not rise at every step: 18.6 m/s at 900 hPa falls to
    14.4 m/s at 650 hPa.
  - **Narration consequence** (plan §3.6 draft): "the arrows grow longer as we climb" and "going up, the arrows turn
    clockwise" hold overall, from the bottom to the top. They do not hold level by level. Suggested wording: "overall,
    from the bottom to the top, the arrows get longer and turn clockwise, seen from above".
- **Licence verdict**: CC-BY 4.0 (Copernicus). **Redistributable: yes.** Credit line: "Contains modified Copernicus
  Climate Change Service information 2026 …".
- **Colab**: loads the committed 16-level product. No keys needed.
- **Quick-look**: `outputs/ch00/data/trappes_stack16_uv_2023-11-01T00.png` (ERA5 and IGRA hodographs; arrows at 850,
  500 and 200 hPa). Orientation is checked: lat S→N, and the westerlies point east.
- **Disk**: before the downloads, C: 52.9 GB and G: 521.9 GB free. After them, C: 52.9 GB and G: 521.9 GB free.
  Project data is 68.42 GB of 150. Nothing was evicted.
