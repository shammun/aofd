# NE-lines and NE-SR-50m — Natural Earth coastlines, country borders, shaded relief (movie ch00_cross_product_why)

- **Route**: HTTPS through `fluidpy.data.fetch` (`fluidpy.data.naturalearth.fetch_lines`, `polylines_json`,
  `shaded_relief_png`), from `https://naturalearth.s3.amazonaws.com/`. sha256 values are pinned in the registry.

  | file | bytes | time |
  |---|---|---|
  | `50m_physical/ne_50m_coastline.zip` | 455,936 | 3.3 s |
  | `110m_physical/ne_110m_coastline.zip` | 85,352 | 1.6 s |
  | `50m_cultural/ne_50m_admin_0_boundary_lines_land.zip` | 309,389 | 1.9 s |
  | `110m_cultural/ne_110m_admin_0_boundary_lines_land.zip` | 57,325 | 1.4 s |
  | `50m_raster/SR_50M.zip` (key `NE-SR-50m`) | 11,380,369 | 31 s |

- **Licence verdict**: public domain (https://www.naturalearthdata.com/about/terms-of-use/). **Redistributable: yes.**
  Credit is optional: "Made with Natural Earth."
- **Products** (in `movies/ch00/ch00_cross_product_why/data/real/`, copies on G: `derived/ch00/`):
  - `ne_lines_50m.json` (1,015,977 B):
    - `{"coastline": [[lon, lat, lon, lat, ...], ...], "borders": [...]}`;
    - 1429 coastline polylines (60,392 points) and 392 border polylines (19,735 points);
    - rounded to 0.01° (about 1 km), with consecutive duplicates dropped.
  - `ne_lines_110m.json` (103,357 B): the same format, for distant globe views.
  - `globe_ne_shaded_relief_5400x2700.png` (2,761,514 B): the SR_50M 10800 × 5400 GeoTIFF resized (Lanczos) to
    5400 × 2700, 8-bit grey; column 0 = 180°W, row 0 = 90°N. It is optional: the BMNG topography texture already has
    relief.
- **Pitfalls**: the borders are land boundaries only (no maritime lines). Lines that cross the antimeridian are split
  by Natural Earth already.
- **Credit line**: "Made with Natural Earth (public domain)."
- **Disk**: C: 78.9 GB and G: 583.2 GB free, both before and after P5. Project data went from 6.34 to 6.36 GB.
