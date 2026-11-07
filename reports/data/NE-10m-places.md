# NE-10m-places: Natural Earth 1:10m populated places (simple)

The registry entry `NE-10m-places` already existed. This report was written by the provenance audit on 2026-11-07, from the
file on disk (opened with pyshp).

- **Route**: HTTPS, whole file, through `fluidpy.data.fetch()`.
  - The log shows `https://naturalearth.s3.amazonaws.com/10m_cultural/ne_10m_populated_places_simple.zip`, fetched 2026-10-27 15:46:57.
  - The registry `raw_url` gives the naciscdn mirror; both serve the same file.
- **File**: `raw/NE-10m-places/ne_10m_populated_places_simple.zip`, 652,145 B, sha256 `2963ee08…2b251` (matches the registry).
  - Inside: `.shp` (205,676 B), `.dbf` (11,146,182 B), `.shx`, `.prj`, `.cpg`, README and VERSION.
- **Contents**: 7,342 point features in WGS84 lon/lat. The 31 attributes include `name`, `nameascii`, `adm0name`, `adm1name`,
  `latitude`, `longitude`, `pop_max`, `pop_min`, `scalerank`, `labelrank`, `worldcity`, `megacity` and `min_zoom`.
  - Spot values read today:

    | Place | Latitude | Longitude | Country | scalerank |
    |---|---|---|---|---|
    | Khulna | 22.841933 | 89.558055 | Bangladesh | 4 |
    | Kolkata | 22.496915 | 88.32273 | India | 0 |
    | Brest | 48.390443 | −4.495008 | France | 7 |
    | Singapore | 1.294979 | 103.853875 | Singapore | 0 |

    These match the coordinates quoted in `ch00_coordinates_research.md` §3.
- **Pitfalls**:
  - **Names are not unique.** "Brest" also matches Brest, Belarus (52.10 N, 23.70 E). Always filter on `adm0name`, or on the expected latitude.
  - Small towns are missing at this scale (Satkhira and Shyamnagar are not in the file; see `ch00_coordinates_flood_visuals.md` §7).
  - The registry `variables` field says `name_en`, but this "simple" file has `name` and `nameascii` and no `name_en`.
- **Licence verdict**: public domain (Natural Earth terms of use). **redistributable: yes.** Credit: "Made with Natural Earth."
- **Used by**:
  - `movies/data/build_ch00_coordinates_sphere.py` and `build_ch00_coordinates_frames.py` (`F_NE10P`: place positions on the globe).
  - `tools/maptools/cartostyle.py load_places` (map labels).
- **Colab route**: no keys needed. The zip can be fetched anonymously, or the movies' own data JSON can be used.
- **Disk**: no download in this task. 2026-11-07: C: 112.4 GB free, G: 472.8 GB free. No evictions.
  The entry has no `derived_on_root`, so the file is not evictable.
