# NE-10m-admin — Natural Earth 1:10m administrative boundaries and coastline, clipped to the Storm Ciarán box (movie ch00_cross_product_why v4, s45, UV2-31)

- **Route**: HTTPS (pooch) through `fluidpy.data.fetch` (`naturalearth.fetch_10m`). Four zips from
  `naturalearth.s3.amazonaws.com`:

  | File | Size | Time |
  |---|---|---|
  | `10m_cultural/ne_10m_admin_0_countries.zip` | 4,930,492 B | 6.1 s |
  | `…/ne_10m_admin_0_boundary_lines_land.zip` | 1,036,202 B | 2.5 s |
  | `…/ne_10m_admin_1_states_provinces.zip` | 14,909,524 B | 15.2 s |
  | `10m_physical/ne_10m_coastline.zip` | 3,069,451 B | 3.8 s |

  sha256 values are in the registry.
- **Why 10 m**: the NE 1:50m admin-1 file covers only a few large countries (US, Canada, Brazil, Australia…), with no
  European units.
- **Reduction** (`naturalearth.admin_box_geojson`):
  - Clipped to 35–70°N, 50°W–10°E.
  - Douglas–Peucker simplification at 0.01° (about 1 km, half a pixel of the 0.02° satellite image), topology
    preserved; coordinates rounded to 0.001°.
  - Admin-1 is dissolved per country into readable units:
    - **UK**: the 4 nations.
    - **France**: 13 metropolitan regions.
    - **Spain**: autonomous communities (18 in the box, incl. Ceuta/Melilla, Baleares).
    - **Belgium**: 3 regions.
    - **Ireland**: 30 counties/city councils in the box (as NE stores them).
    - **Netherlands**: 12 provinces.
    - **Luxembourg**: 3 districts.
    - **Portugal**: 18 districts + the Azores.
  - The internal admin-1 lines file removes each country's coast and borders, so it can be drawn on top of the
    coastline without doubling it.
- **Products** (G: `derived/ch00/ciaran_admin/` and repo `data/derived/ch00/`), GeoJSON in (lon, lat) order:

  | File | Size | Features |
  |---|---|---|
  | `ciaran_admin0_10m.geojson` | 209,999 B | 27 country polygons (`name`, `name_long`, `iso_a3`) |
  | `ciaran_borders_10m.geojson` | 28,284 B | 38 land-border lines |
  | `ciaran_admin1_10m.geojson` | 192,332 B | 102 admin-1 polygons (`name`, `country`, `iso_a3`) |
  | `ciaran_admin1_lines_10m.geojson` | 46,922 B | 8 MultiLineStrings, one per country |
  | `ciaran_coast_10m.geojson` | 196,254 B | 242 coastline pieces |

  Total 673,791 B. Each file carries a provenance block (`metadata`: dataset key, URL, licence, citation, processing,
  fluidpy commit).
- **Pitfall**: the admin-1 DBF declares UTF-8 (`.cpg`), but European names are stored as cp1252 bytes (Bragança, Côte,
  Île). pyshp then returns U+FFFD. `naturalearth.read_records` reads latin-1 and re-decodes each field as UTF-8, falling
  back to cp1252 (test `test_fix_text_mixed_encodings`).
- **Licence verdict**: Natural Earth is public domain (naturalearthdata.com/about/terms-of-use). **Redistributable:
  yes.** Credit (optional): "Made with Natural Earth."
- **Check**: `outputs/ch00/data/ciaran_truecolour_quicklook.png` shows the lines over the MODIS image. They line up.
- **Colab route**: committed GeoJSON (no keys).
- **Disk**: C: 76.8 GB and G: 578.9 GB free, both before and after. Project data went from 10.67 to 10.69 GB.
