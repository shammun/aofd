# IBTrACS-v04r01 — observed best tracks for Hurricane Ian (2022) and Tropical Cyclone Idai (2019)

- **Route**: HTTPS through `fluidpy.data.fetch` (`fluidpy.data.ibtracs.fetch_basin`).
  - Files: `IBTrACS.NA.v04r01.nc` (4,270,868 B, 6.6 s) and `IBTrACS.SI.v04r01.nc` (6,076,994 B, 6.6 s), from NCEI.
  - The basin netCDF files are 10× smaller than the CSVs (58 and 78 MB). They are rebuilt weekly, so the sha256 is
    recorded but not pinned.
  - Storm ids: Ian `2022266N12294` (74 fixes), Idai `2019063S18038` (101 fixes).
- **Licence verdict**: NOAA NCEI, US Government work, public domain. **Redistributable: yes.** Cite Knapp et al.
  (2010) and IBTrACS v04r01, doi:10.25921/82ty-9e16.
- **Products**: `movies/ch00/ch00_cross_product_why/data/real/ibtracs_ian_2022.json` (11.6 kB) and
  `ibtracs_idai_2019.json` (23.6 kB), copies on G: `derived/ch00/`. Each holds every fix with: time, lat/lon,
  distance to land; WMO wind and pressure; per agency, wind [kt], pressure [hPa] and RMW [nmi]; and the 34/50/64-kt
  radii per quadrant (NE, SE, SW, NW) [nmi].
  - Ian: agency `usa` (NHC, HURDAT2).
  - Idai: agency `usa` (JTWC, 1-min winds) and `reunion` (RSMC La Réunion, 10-min winds, the official WMO agency).
    BoM has no data for this storm.
  - RSMC La Réunion gives no 64-kt radii for Idai.
- **Ian (NHC, 1-min sustained)**:
  - **Peak**: 140 kt (72.0 m/s), 937 hPa at 2022-09-28T12 UTC (26.0°N 82.7°W). RMW 20 nmi (37 km). Maximum radii
    R34 = 150, R50 = 80, R64 = 40 nmi.
  - **Cuba landfall**: 2022-09-27T08:30, 110 kt, 947 hPa.
  - **SW Florida landfall (Cayo Costa)**: 2022-09-28T19:05, 130 kt (66.9 m/s), 941 hPa, RMW 20 nmi, R64 = 45 nmi.
  - **Movie window, 6-hourly (kt / hPa)**:

    | time (UTC) | wind (kt) | pressure (hPa) |
    |---|---|---|
    | 09-26T00 | 50 | 991 |
    | 09-26T06 | 65 | 985 |
    | 09-26T12 | 70 | 981 |
    | 09-26T18 | 80 | 976 |
    | 09-27T00 | 85 | 965 |
    | 09-27T06 | 100 | 956 |
    | 09-27T12 | 100 | 963 |
    | 09-27T18 | 105 | 951 |
    | 09-28T00 | 105 | 947 |
    | 09-28T06 | 120 | 945 |
    | 09-28T12 | 140 | 937 |
    | 09-28T18 | 135 | 938 |
    | 09-29T00 | 100 | 960 |
    | 09-29T06 | 65 | 985 |
    | 09-29T12 | 60 | 987 |
    | 09-29T18 | 65 | 986 |

- **Idai**:
  - **RSMC La Réunion (10-min, official)**: peak 105 kt (54 m/s) from 2019-03-13T18 to 03-14T00, minimum pressure
    940 hPa at 2019-03-14T00 (19.7°S 37.9°E). RMW 22 nmi. R34 up to 105 nmi, R50 up to 70 nmi.
  - **JTWC (1-min)**: peak 115 kt (59 m/s) twice:
    - 2019-03-11T03, 947 hPa, at the time a tiny core, RMW 5 nmi;
    - 2019-03-13T18, 948 hPa, RMW 22 nmi.
  - **Beira landfall**: the first fix over land is 2019-03-14T21 (19.8°S 35.2°E): JTWC 100 kt / 964 hPa, RSMC 84 kt /
    958 hPa, RMW 20 nmi. WMO gives landfall at about 23:30 UTC.
  - The JTWC and RSMC winds differ partly by averaging time (1-min vs 10-min; 1-min ≈ 1.1 × 10-min).
- **Comparison with ERA5 (`ERA5-ARCO-ian2022`, `ERA5-ARCO-idai2019`)**:

  | storm | ERA5 (lowest pressure, strongest 10 m wind) | observed |
  |---|---|---|
  | Ian | 972 hPa, 32 m/s | 937 hPa, 72 m/s |
  | Idai | 974 hPa, 32 m/s | 940 hPa, 54–59 m/s |

  ERA5 has about half the peak wind and 35 hPa too little pressure drop, while the track and the rotation sense are
  right.
- **Parametric full-strength vortex (D), feasibility**: feasible and cheap.
  - A scratch Holland (1980) gradient-wind profile was run with the IBTrACS values at 2022-09-28T18: Vmax = 69.4 m/s,
    pc = 938 hPa, environmental pressure (POCI) = 1010 hPa, RMW = 37 km, ρ = 1.15 kg m⁻³, giving B = ρ e Vmax²/Δp = 2.09.
  - It gives R64 = 57 nmi (observed 30–45), R50 = 70 (observed 50–80) and R34 = 93 (observed 100–150). The core is
    right and the outer wind is too weak, as usual for Holland 1980. The Holland et al. (2010) variant can be fitted
    to R34.
  - If built, it belongs in `fluidpy.geo` (physics, with tests), not `fluidpy.data`, and must be labelled "model
    fitted to observed best-track values". I did not build it.
- **Credit line**: "IBTrACS v04r01 best tracks (Knapp et al. 2010), NOAA NCEI (public domain)."
- **Disk**: before, C: 84.2 GB and G: 583.2 GB free. After, the same. Project data went from 6.36 to 6.37 GB.
