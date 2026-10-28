# NASA-GIBS-rwm — Himawari-9 B13 (00Z 27 Oct 2026), GOES-East B13/B2 (18Z 27 Oct 2026), MODIS Aqua B31 (2 Nov 2023) (movie ch00_reading_weather_maps, D10, D11, D13)

- **Route**:
  - WMTS capabilities (`WMTSCapabilities_epsg4326_best_20261027.xml`, 5.3 MB) give each layer's colormap and time list.
  - The colormaps are `colormaps/v1.3/Clean_Longwave_Infrared_Window_Band.xml` (Himawari and GOES B13; units °C,
    238 entries) and `MODIS_Brightness_Temp_Band31.xml` (K, 255 entries). The URLs named after the layer 404.
  - The images are native-resolution **WMTS tiles** (`fluidpy.data.gibs.fetch_wmts_box`), one guarded transfer per box
    (a zip).
  - Himawari is level 4 (0.0352°, 100 tiles; the box crosses 180°, so its longitudes run 60→220 in 0–360 style).
    GOES and MODIS are level 5 (0.0176°; 54 and 40 tiles).
- **Why not WMS**: the WMS GetMap PNGs (fetched first, kept as superseded raw files) interpolate colours, so only 71 % of
  pixels match the palette.
- **Palette inversion** (F9, `gibs.colormap_values`):
  - Matching goes in order: exact, then within 2/255, then (with `blend=3`) projection onto the palette ramp. The
    geostationary layers are reprojected *after* colouring, so 10–16 % of their pixels are blends of two classes.
  - The clean-IR palette passes through grey **twice** (−80…−71 °C cloud tops and −19…+57 °C), so a grey has two
    candidate values. `context=9` resolves those from the 9×9 neighbourhood (two passes).
  - Without that step the first product showed warm specks in typhoon cores and cold pseudo-contours over the sea. Both
    are gone now (quick-look `ql_rwm_himawari_typhoon_crop.png`).
- **Licence verdict**: NASA EOSDIS imagery (CC0 / no restrictions; credit NASA, no endorsement). Himawari-9 is JMA data
  distributed openly through GIBS, with credit to JMA. **Redistributable: yes.** Credit: "Imagery from NASA Worldview /
  GIBS (ESDIS); Himawari-9 AHI courtesy of JMA".
- **Rolling archive**: the geostationary layers keep about 6–10 weeks (Himawari from 2026-09-15 and GOES-East from
  2026-08-04 at fetch), so they are frozen now. MODIS band 31 is permanent (2002–).
- **Downloads**:

  | File | Bytes | Time |
  |---|---|---|
  | `wmts_d11_Himawari…T0000Z_L4.zip` | 14,774,946 | 23.5 s |
  | `wmts_d13ir_GOES-East…B13…T1800Z_L5.zip` | 11,950,741 | 24.5 s |
  | `wmts_d13vis_…Band2…T1800Z_L5.zip` | 8,384,653 | 15.0 s |
  | `wmts_d10_MODIS…B31…2023-11-02_L5.zip` | 4,278,714 | 8.6 s |
  | colormaps | 40,055 + 49,463 | — |
  | capabilities | 5,316,966 | — |

  Superseded, evictable: the four WMS PNGs (22.3 MB) and 54 loose tiles under `raw/NASA-GIBS/wmts/` (12 MB, duplicates
  of the d13ir zip from an aborted first run).
- **Derived products** (`movie_rwm.gibs_bt_products`; 8-bit PNG with `k=0` missing):
  - `rwm_himawari9_b13_bt_2026-10-27T0000.png`, 5,647,865 B, plus `.json`, in the repo. 180–320 K, 4552×4552.
    Match: 77 % exact, 11 % near, 8 % blend; 3.4 % filled from the nearest recovered pixel; 302,971 ambiguous greys
    moved by context. p1 197.6 K, median 270.3 K. The typhoon sits at 14.5°N 162.5°E with a warm (~300 K) clear eye.
  - `rwm_modis_aqua_b31_bt_2023-11-02.png`, 2,210,986 B, plus `.json`, in the repo. 200–310 K on the A4 true-colour
    grid (0.02°, 1750×3000, nearest neighbour). The match is **100 % exact**.
  - `rwm_gibs_goeseast_b13_bt_2026-10-27T1800.png/.json`, on G: only (the runner-up to Earth Engine; 76 % exact).
- **Checks**:
  - **RM32**: sea BT p90/p99 is 282.7/284.9 K in the Bay of Biscay, 290.5/292.7 K west of Iberia and 290.5/293.1 K in
    the mid-Atlantic. So 280–290 K holds north of about 44°N, while the subtropical sea reaches about 292 K.
  - **RM33**: Ciarán's cloud is −52.8 °C (p1) and −41.5 °C (p10), which fits −60…−40 °C.
- **Colab route**: the committed PNGs and JSON.
- **Disk**: before the first WMS fetch, C: 61.9 GB and G: 564.4 GB free. After the WMTS set, C: 48.2 GB and G: 561.4 GB.
  The C: changes are not from these downloads (they went to G:). Nothing evicted.
