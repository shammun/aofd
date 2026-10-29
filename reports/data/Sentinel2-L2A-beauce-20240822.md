# Sentinel2-L2A-beauce-20240822: Sentinel-2 true colour of the Beauce plain round Trappes, 22 Aug 2024 (weather-basics UF2, D-UF2-3)

- **Route**: the map-toolkit STAC adapter (`tools/maptools/render.py`, `.venv-maps`: pystac-client + rasterio).
  - It searches Element 84 Earth Search (`sentinel-2-l2a`, asset `visual` = the 8-bit TCI COG) and reads the public AWS COGs anonymously.
  - Each item is warped bilinearly onto one EPSG:4326 grid, and gaps are filled from the next item.
  - The mosaic is archived on G: by request hash (`raw/STAC/s2_beauce_20240822/f227b2d3d30a7261a014/`). Nothing went to C:.
  - These are COG range reads, not a file download, so this route does not pass through `fluidpy.data.fetch`. I ran `tools/disk_guard.py --need 300MB` by hand before each run.
  - Recipe (kept in the session scratchpad; copy it to `tools/maptools/recipes/` if wanted):
    ```yaml
    name: s2_beauce_20240822
    tool: stac
    kind: png
    stac: {api: https://earth-search.aws.element84.com/v1, catalog: earth-search, collection: sentinel-2-l2a,
           asset: visual, max_cloud: 4, max_items: 5, date: 2024-08-22, window: "1 day"}
    region: [1.20, 2.40, 48.05, 48.85]
    style: {}
    size: [4096, 2731]
    ```
- **Items**: 22 Aug 2024, all from one Sentinel-2B datatake at 10:57 UTC. They were filled in cloud order:

  | Item | Cloud | What it gives |
  |---|---|---|
  | `S2B_31UDP_20240822_0_L2A` | 0.003 % | plan item |
  | `S2B_31UDQ_20240822_0_L2A` | 0.12 % | the north strip |
  | `S2B_31UCP_20240822_0_L2A` | 0.49 % | plan item |
  | `S2B_30UYU_20240822_0_L2A` | 3.2 % | — |
  | `S2B_31UCQ_20240822_0_L2A` | 3.7 % | the NW corner |

  - **First run** (max_cloud 0.5): **4.9 % no-data** in the NW corner (1.20–1.64° E, 48.74–48.85° N), which lies outside the 31UDP/31UDQ/31UCP granules. That fails W87 (< 0.5 %).
  - **Kept run** (max_cloud 4): **0.0 % no-data**. The corner comes from 31UCQ and is clear: its near-white (> 235) fraction is 0.07 %, against 0.13 % for the rest of the image.
  - W87 says "items ≤ 1 % cloud". That holds for the two plan items. The two corner granules are 3–4 % cloud tile-wide, but there is no cloud in the part used.
- **Licence**: Copernicus Sentinel data legal notice (EU Reg. 377/2014 and Del. Reg. 1159/2013). Access is free, full and open; reproduction, distribution, communication to the public and modification are all allowed.
  - Required notice for modified data: **"Contains modified Copernicus Sentinel data 2024"**.
  - **Redistributable: yes.**
  - The on-screen wording in the plan, "contains modified Copernicus Sentinel-2 data (ESA)", is acceptable only if it **adds the year 2024**. Suggested: "Image: contains modified Copernicus Sentinel data 2024 (ESA Sentinel-2) · 22 Aug 2024, 10:57 UTC · Beauce, south-west of Paris".
- **Products** (`fluidpy.data.movie_wb.s2_texture`):
  - The colour balance is a per-channel dark-object (haze) offset at p0.5: R/G/B = 23/38/25.
  - Then **one** gain (1.487) for all three channels, so the luminance p99.7 maps to 245. Using one gain keeps the golden stubble fields golden; there is no grey-world neutralising.
  - Then gamma 0.92.

  | File | Where | Size (B) | sha256 |
  |---|---|---|---|
  | `s2_beauce_2024-08-22.jpg` (4096 × 2731, q90 4:4:4) | repo `data/derived/ch00/` | 6,501,484 | `c6c8b9a6…b97b` |
  | `s2_beauce_2024-08-22.json` (bounds, items, processing, credit) | repo `data/derived/ch00/` | 1,765 | `cc84a12e…4df8` |
  | `s2_beauce_2024-08-22.png` (lossless) | G: `derived/ch00/` | 22,454,793 | `4a6eea34…e237` |
  | archived raw mosaic `data.png` | G: `raw/STAC/…/f227b2d3d30a7261a014/` | 20,984,411 | `809ee50e…3dd6` |

  - **Grid**: bounds_wsen [1.20, 48.05, 2.40, 48.85]; row 0 is 48.85° N. Each pixel is 0.000293° both ways, i.e. ≈ 21.6 m E–W and 32.6 m N–S on the ground, because the grid is plate carrée. A MapPlane that spans the lon/lat bounds shows it undistorted.
  - Trappes (48.77° N 2.01° E) is at pixel (2764, 273).
  - The PNG texture is 22 MB, too big for the repo, so the repo gets the JPEG (6.5 MB, under 10 MB). A q85 JPEG would be about 5 MB if the budget gets tight.
- **Quick-looks**: `outputs/ch00/data/ql_s2_beauce.png` and `ql_s2_beauce_trappes_crop.png`.
  - Harvested Beauce fields are golden and bare. The forest of Rambouillet is dark green, Chartres sits to the west and the Paris suburbs to the NE.
  - There are no seams and no clouds.
- **Runner-up** (Landsat 9, 7 Jun 2024): not needed.
- **Colab route**: the repo JPEG + JSON (no keys).
- **Disk**:
  - Run 1: C: 53.2 GB free, G: 520.0 GB free before; C: 53.2 GB, G: 519.8 GB after.
  - Run 2: C: 53.2 GB, G: 519.8 GB before. After it the adapter printed **C: 39.7 GB** (below the 40 GB floor) and G: 519.6 GB.
  - The C: drop was **not** this run. Its TEMP and caches are on G:, and the files it wrote are on G:. New `puppeteer_dev_chrome_profile-*` folders appeared in `%TEMP%` during those minutes, which points to a concurrent Remotion/browser render by another process.
  - Within minutes C: was back to 42.4 GB. After the texture step: C: 42.4 GB, G: 521.0 GB. Nothing evicted.
