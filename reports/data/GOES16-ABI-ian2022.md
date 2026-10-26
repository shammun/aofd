# GOES16-ABI-ian2022 — GOES-16 ABI images of Hurricane Ian, 2022-09-28 18:01 UTC

- **Route**: HTTPS through `fluidpy.data.fetch` (`fluidpy.data.goes.fetch_abi`). File names come from an anonymous
  s3fs listing of `noaa-goes16`.
  - `ABI-L2-MCMIPC/2022/271/18/OR_ABI-L2-MCMIPC-M6_G16_s20222711801174_…nc`: all 16 bands at 2 km, 67,548,846 B,
    29.8 s.
  - `ABI-L2-CMIPC/…-M6C13_G16_s20222711801174_…nc`: band 13 (10.3 µm), 4,535,524 B, 2.6 s.
  - The scan starts at 18:01:17 UTC, about 1 h before the 19:05 landfall, in daylight.
- **Processing**: nearest-neighbour reprojection from the geostationary fixed grid (pyproj `geos`, sweep x, 75.2°W)
  to a 0.02° lat/lon grid over 18–32°N, 92–74°W (700 × 900 px, row 0 = 32°N).
  - **True colour**: R = C02, B = C01, G = 0.45 R + 0.1 C03 + 0.45 B (the CIMSS "simple hybrid green"), gamma 2.2.
  - **IR**: grey = (310 K − BT)/130 K, so cold cloud tops are bright.
- **Products** (movie folder plus G: `derived/ch00/`):
  - `ian_goes16_truecolour_20220928T1801.jpg` (171 kB);
  - `ian_goes16_ir13_20220928T1801.png` (262 kB);
  - `ian_goes16_20220928T1801.json` (grid, mapping, source URLs, credit).
- **Checks**:
  - Coastlines of Florida, Cuba and Yucatán fall where expected.
  - BT range 194–308 K.
  - The eye is clear in IR: 291.5 K at 26.55°N 82.45°W (NHC 18Z fix 26.6°N 82.4°W), surrounded by eyewall cloud tops
    of 198 K.
  - No parallax correction: cloud tops at about 15 km appear displaced by a few km, which is negligible at 2 km.
- **Licence verdict**: NOAA data, public domain (NODD). **Redistributable: yes.** Cite the GOES-R ABI L2 CMI product,
  doi:10.7289/V5736P36.
- **Options**:
  - A 1-km true colour (C02 is 0.5 km native in `ABI-L2-CMIPC-M6C02`, 78 MB per file) or a short 5-minute loop
    (about 68 MB per frame through the guard, reduced at once) can be made if the movie wants motion.
- **Credit line**: "NOAA GOES-16 ABI imagery (public domain), NOAA Open Data Dissemination on AWS."
- **Disk**: before, C: 84.2 GB and G: 583.2 GB free. After, C: 84.2 GB and G: 583.1 GB. Project data went from 6.37 to
  6.44 GB. The 67.5 MB raw file is registered and evictable.
