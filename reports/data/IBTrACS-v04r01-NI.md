# IBTrACS-v04r01-NI: IBTrACS v04r01 best tracks, North Indian basin file (Cyclone Amphan 2020, Cyclone Nargis 2008)

Written 2026-11-06 by the data agent from the registry entry (the data were fetched earlier by the 5b builder/flood research; no new download).

- **Route**: HTTPS whole basin netCDF through fluidpy.data.fetch; rebuilt weekly by NCEI, so not hash-pinned
- **Fetcher**: `fluidpy.data.ibtracs.storm_table`; login: none
- **Licence**: NOAA NCEI, US Government work, public domain (https://www.ncei.noaa.gov/products/international-best-track-archive). **Redistributable: yes.**
- **Credit line**: IBTrACS v04r01 best tracks (Knapp et al. 2010), NOAA NCEI (public domain)
- **Citation**: Knapp, K. R., M. C. Kruk, D. H. Levinson, H. J. Diamond, C. J. Neumann, 2010: The International Best Track Archive for Climate Stewardship (IBTrACS). Bull. Amer. Meteor. Soc., 91, 363-376, doi:10.1175/2009BAMS2755.1; IBTrACS v04r01, NOAA NCEI, doi:10.25921/82ty-9e16
- **Size**: 3,021,493 B; fetched 2026-11-05; raw on G: under the data root: `raw/IBTrACS-v04r01/IBTrACS.NI.v04r01.nc`
- **Coordinates**: storm x date_time; lat/lon [deg]; times UTC (3-hourly)
- **Checks**: -
- **Used by**: movie ch00_coordinates_storm s21-s23, s29 (Amphan), s31 (Nargis track, landfall 90 kt), s33 (Idai from the SI file)
- **Colab route**: the movie's committed derived images / JSON (no keys); refreshing needs the source route above.
- **Archive**: see `reports/data/ch00_storm_events_archive.md` for reuse in later cyclone movies.
- **Disk**: no download in this session (C: 108.2 GB, G: 456.0 GB free on 2026-11-06).
