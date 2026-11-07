# ETOPO2022-60s-irrawaddy: ETOPO 2022 60 arc-second surface elevation, 15.6-17.6N 94-96.6E (the Irrawaddy delta)

Written 2026-11-06 by the data agent from the registry entry (the data were fetched earlier by the 5b builder/flood research; no new download).

- **Route**: OPeNDAP server-side subset (pydap) through fluidpy.data.fetch and the disk guard (2026-11-06)
- **Fetcher**: `fluidpy.data.fetch (subset)`; login: none
- **Licence**: NOAA NCEI, US Government work, public domain (https://www.ncei.noaa.gov/products/etopo-global-relief-model). **Redistributable: yes.**
- **Credit line**: ETOPO 2022 (NOAA NCEI, public domain)
- **Citation**: NOAA National Centers for Environmental Information (2022): ETOPO 2022 15 Arc-Second Global Relief Model. doi:10.25921/fd45-gt74
- **Size**: 75,893 B; fetched 2026-11-06; raw on G: under the data root: `raw/ETOPO2022-60s/etopo2022_60s_irrawaddy_15.6-17.6N_94-96.6E.nc`
- **Coordinates**: lat/lon [deg]
- **Checks**: land in 15.7-17.1 N, 94.6-96.0 E: 90 % at or below 5 m, median 2.4 m (DS32)
- **Used by**: movie ch00_coordinates_storm s31 ('most of it only a few metres above the sea')
- **Colab route**: the movie's committed derived images / JSON (no keys); refreshing needs the source route above.
- **Archive**: see `reports/data/ch00_storm_events_archive.md` for reuse in later cyclone movies.
- **Disk**: no download in this session (C: 108.2 GB, G: 456.0 GB free on 2026-11-06).
