# GOES16-ABI-M1-ian2022: GOES-16 ABI mesoscale M1, 2022-09-28 18:01 UTC (Hurricane Ian near landfall)

Registry entry `GOES16-ABI-M1-ian2022` (provenance audit, 2026-11-07). This is separate from `GOES16-ABI-ian2022`, which holds the CONUS scan.
Research: `reports/data/ch00_coordinates_research.md` §1c, §2.

- **Files** (`raw/GOES16-ABI/`, from the NODD bucket `noaa-goes16/ABI-L2-CMIPM/2022/271/18/`, fetched 2026-11-05 through `fetch()`):

  | Band | Bytes | Use |
  |---|---|---|
  | C01 | 1,164,962 | true colour (movie) |
  | C02 (0.5 km) | 5,496,246 | true colour (movie) |
  | C03 | 1,228,982 | true colour (movie) |
  | C13 | 393,256 | research: eye centroid from brightness temperature |

  The sha256 of each file is in the registry.
- **Processing**: `fluidpy.data.goes.to_latlon`, then true colour from C01–C03, then a contrast stretch. The image is cropped round the radar eye.
- **Checks (DS13)**: the eye pixels are darker than the eyewall ring.
  The C13 > 270 K eye centroid is at 26.597 N, 82.445 W, 17 km from the radar eye; this offset comes from cloud-top parallax (≈ 9 km NW).
- **Licence verdict**: NOAA, U.S. Government work, public domain (NODD). **redistributable: yes.**
  Credit: "NOAA GOES-16 ABI L2 CMIPM (public domain), true colour and contrast stretch by our code".
- **Derived**: `movies/ch00/ch00_coordinates_storm/data/img/goes_eye.jpg` (s15–s16). Research copy: `research/ian_goes_meso.npz` on G: scratch.
- **Disk**: no download in this task. 2026-11-07: C: 112.4 GB, G: 472.8 GB free. Not evictable (no `derived_on_root`).
