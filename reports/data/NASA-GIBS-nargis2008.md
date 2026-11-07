# NASA-GIBS-nargis2008: NASA GIBS MODIS Aqua and Terra Corrected Reflectance true colour, 2008-05-02, 12.6-19.6N 89.5-100.5E (Cyclone Nargis near landfall)

Written 2026-11-06 by the data agent from the registry entry (the data were fetched earlier by the 5b builder/flood research; no new download).

- **Route**: WMS GetMap (anonymous) through fluidpy.data.gibs.fetch_wms and the disk guard
- **Fetcher**: `fluidpy.data.gibs.fetch_wms`; login: none
- **Licence**: NASA EOSDIS: NASA-led mission data CC0, no use restrictions; credit NASA; no endorsement implied (https://www.earthdata.nasa.gov/engage/open-data-services-software-policies/data-use-guidance). **Redistributable: yes.**
- **Credit line**: Imagery from the NASA Worldview application (https://worldview.earthdata.nasa.gov), part of the NASA Earth Science Data and Information System (ESDIS)
- **Citation**: NASA EOSDIS GIBS / Worldview, layers MODIS_Aqua_CorrectedReflectance_TrueColor and MODIS_Terra_CorrectedReflectance_TrueColor
- **Size**: 236,420 B; fetched 2026-11-05; raw on G: under the data root: `raw/NASA-GIBS/gibs_nargis_storm_MODIS_Aqua_CorrectedReflectance_TrueColor_2008-05-02.jpg`, `raw/NASA-GIBS/gibs_nargis_storm_MODIS_Terra_CorrectedReflectance_TrueColor_2008-05-02.jpg`
- **Coordinates**: EPSG:4326, row 0 = north
- **Checks**: the eye (darkest spot) within 30 km of the IBTrACS 06 UTC fix 16.0 N 93.6 E (DS32)
- **Used by**: movie ch00_coordinates_storm s31 (Nargis on 2 May, draped on the globe)
- **Colab route**: the movie's committed derived images / JSON (no keys); refreshing needs the source route above.
- **Archive**: see `reports/data/ch00_storm_events_archive.md` for reuse in later cyclone movies.
- **Disk**: no download in this session (C: 108.2 GB, G: 456.0 GB free on 2026-11-06).
