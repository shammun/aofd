# NEXRAD-L2: NOAA NEXRAD Level-II, KTBW (Tampa Bay), 2022-09-28 18:01:48 UTC — Hurricane Ian's eye

Registry entry `NEXRAD-L2` (added by the provenance audit, 2026-11-07). Research: `reports/data/ch00_coordinates_research.md` §1c, §2, §6.

- **Route**: anonymous HTTPS from the NODD bucket `unidata-nexrad-level2`, through `fluidpy.data.fetch()`.
  - The old `noaa-nexrad-level2` bucket denies listing.
  - URL: `https://unidata-nexrad-level2.s3.amazonaws.com/2022/09/28/KTBW/KTBW20220928_180148_V06`.
  - Read with `metpy.io.Level2File`.
- **File**: `raw/NEXRAD-L2/KTBW20220928_180148_V06`, 19,364,983 B, sha256 `c6f8b6a2…2f67b`, 6.9 s, fetched 2026-11-05.
- **Contents**:
  - One volume scan with 23 tilts. The movie uses the 0.5° tilt's REF (dBZ).
  - Each gate is placed on the map with `fluidpy.diag.radar.beam_ground_range` (4/3-Earth model) and `fluidpy.geo.sphere.destination_point`.
- **Licence verdict**: NOAA NODD, checked 2026-11-07 on the AWS registry page. The terms say NODD data is
  *"open to the public and can be used as desired"*. Credit NOAA, and do not present modified data as original.
  **redistributable: yes.**
  Suggested citation: "NEXRAD on AWS was accessed on 2026-11-05 from https://registry.opendata.aws/noaa-nexrad", plus NCEI doi:10.7289/V5W9574V.
- **Checks (DS15)**:
  - The eyewall-circle fit (≥ 35 dBZ) puts the centre at 26.552 N, 82.278 W, with an eyewall radius of 29.7 km. The beam is ≈ 2.3 km up there.
  - That centre is 12.6 km from the IBTrACS 18 UTC fix and 16 km from the HRRR MSLP minimum.
- **Derived**:
  - `movies/ch00/ch00_coordinates_storm/data/img/radar_ktbw.png` (268,614 B) and the radar-eye fields of `cs.json` (s17).
  - `movies/data/build_ch00_coordinates_flat.py` uses only the eye position as a constant (`RADAR_EYE`). It reads no file.
- **Colab route**: the derived PNG is in the repo. The raw file is not needed.
- **Disk**: no download in this task. Original fetch (2026-11-05): C: 48.3 GB, G: 465.6 GB.
  2026-11-07: C: 112.4 GB, G: 472.8 GB. No evictions.

Source: [NEXRAD on AWS (registry, licence)](https://registry.opendata.aws/noaa-nexrad/)
