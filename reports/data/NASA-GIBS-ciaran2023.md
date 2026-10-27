# NASA-GIBS-ciaran2023 — MODIS Aqua true-colour image of Storm Ciarán, 2 November 2023 (movie ch00_cross_product_why v4, s45, UV2-31)

- **Route**: NASA GIBS WMS 1.3.0 GetMap (anonymous) through `fluidpy.data.fetch` (`fluidpy.data.gibs.fetch_wms`).
  - Request: EPSG:4326, BBOX 35–70°N, 50°W–10°E (the s45 ERA5 box), 3000 × 1750 px (0.02°), JPEG, TIME=2023-11-02.
  - The server sends no Content-Length, so the guard used a 6 MB estimate per image. Each image took 4–5 s.
  - Four layers were fetched for the day. Empty fraction = all channels ≤ 8:

    | Layer | Size | Empty | Verdict |
    |---|---|---|---|
    | MODIS Aqua (~13:30 local) | 1,447,772 B | 0.25 % (isolated dark-ocean pixels, no gap; largest dark cluster 1,393 px) | **kept, unchanged** |
    | VIIRS NOAA-20 (~13:30) | 1,229,085 B | 14 % (black band north of ~66°N) | backup |
    | MODIS Terra (~10:30) | 1,440,559 B | 0.1 % | complete, but 3 h earlier with a visible bluish seam |
    | VIIRS SNPP (~13:30) | 377,025 B | **68 %** (no data east of ~32°W that day) | rejected |

  - A fill mosaic (Aqua + NOAA-20 + Terra) was tried. It only replaced dark ocean pixels, so the final image is Aqua
    alone, copied byte for byte (no re-encoding).
- **Time**: Aqua's daily mosaic is built from daytime ascending orbits (about 13:30 local solar time). That is about
  12:50 UTC at 10°E, 13:20 UTC at the storm (2°E), 13:50 UTC at 5°W and 16:50 UTC at 50°W. Neighbouring orbits are
  about 99 min apart, so the mosaic has small time jumps at orbit seams. These are visible near 35–40°W north
  of 55°N, and near 5°W–0° and 8–10°E south of 45°N. None crosses the storm spiral, which is centred near 53°N 2.5°E.
- **Mismatch with the movie map**: s45 shows ERA5 at **2023-11-02T00 UTC**, which is night, so no visible image exists
  for that time. In the image (about 13 UTC) the ERA5 MSLP minimum is at 52.5°N 1.75°E (12 UTC) to 53.5°N 2.5°E
  (15 UTC), over East Anglia and the southern North Sea. That is about 600 km ENE of the 00 UTC low (49.75°N 5.75°W).
  The comma-shaped cloud spiral in the image is centred there. The caption or narration should say "the same storm
  about 13 hours later" or "early afternoon on 2 November", or the map should switch to the ERA5 12 or 15 UTC field
  (MSLP and 10 m wind are already in `ciaran_2023_sfc.bin`, but the 850 hPa file `ciaran_2023_upper.bin` ends at
  02T06, so geostrophic arrows at 12 UTC would need a new ARCO fetch).
- **Orientation check**: `outputs/ch00/data/ciaran_truecolour_quicklook.png` shows NE 10 m coastlines, borders and
  admin-1 lines over the image, plus the ERA5 lows. Ireland, Iceland, Greenland, Iberia and Brittany line up to within
  a pixel. Row 0 = 70°N, column 0 = 50°W.
- **Products**:
  - `ciaran_modis_aqua_truecolour_2023-11-02.jpg`: 1,447,772 B, 3000 × 1750, sha256 `6af7d78f…f08559`.
  - `.json` sidecar: `lat_edges [35, 70]`, `lon_edges [-50, 10]`, `shape [1750, 3000]`, grid text, overpass times,
    ERA5 note, licence, credit, citation. It follows the same pattern as `ian_goes16_20220928T1801.json`.
  - Locations: G: `derived/ch00/` and repo `data/derived/ch00/`. The movie copy (`movies/public/cp/…`) is the movie
    builder's job.
- **Licence verdict**: NASA EOSDIS data-use guidance says data from NASA-led missions are CC0, with no use
  restrictions. Credit NASA and imply no endorsement. **Redistributable: yes.**
- **Credit line**: "Imagery from the NASA Worldview application (https://worldview.earthdata.nasa.gov), part of the
  NASA Earth Science Data and Information System (ESDIS). MODIS Aqua Corrected Reflectance, NASA LANCE."
- **Geostationary option (not taken)**: GIBS has no Meteosat layers, and GOES-East does not usefully cover Europe at
  50°N. EUMETSAT SEVIRI imagery has its own licence (credit "© EUMETSAT", re-use conditions), so it is not
  CC0-redistributable without a check. A single polar mosaic is the open choice.
- **Colab route**: load the committed JPEG + sidecar (no keys). Refresh with `gibs.fetch_wms` (anonymous).
- **Disk**: C: 76.8 GB and G: 578.9 GB free, both before and after the four images. Project data stayed at 10.67 GB.
