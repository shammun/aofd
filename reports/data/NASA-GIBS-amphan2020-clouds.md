# NASA-GIBS-amphan2020-clouds: NASA GIBS MODIS Terra and Aqua Corrected Reflectance true colour, 21-23 May 2020, 21.45-23.35N 87.6-90.8E (the Sundarbans after Cyclone Amphan, cloud-covered)

Written 2026-11-06 by the data agent from the registry entry (the data were fetched earlier by the 5b builder/flood research; no new download).

- **Route**: WMS GetMap (anonymous) through fluidpy.data.gibs.fetch_wms and the disk guard (2026-11-06; six images, 0.50 MB)
- **Fetcher**: `fluidpy.data.gibs.fetch_wms`; login: none
- **Licence**: NASA EOSDIS: NASA-led mission data CC0, no use restrictions; credit NASA; no endorsement implied (https://www.earthdata.nasa.gov/engage/open-data-services-software-policies/data-use-guidance). **Redistributable: yes.**
- **Credit line**: Imagery from the NASA Worldview application (https://worldview.earthdata.nasa.gov), part of the NASA Earth Science Data and Information System (ESDIS)
- **Citation**: NASA EOSDIS GIBS / Worldview, layers MODIS_Terra_CorrectedReflectance_TrueColor and MODIS_Aqua_CorrectedReflectance_TrueColor
- **Size**: 500,954 B; fetched 2026-11-06; raw on G: under the data root: `raw/NASA-GIBS/gibs_amphan_after_clouds_MODIS_Terra_CorrectedReflectance_TrueColor_2020-05-21.jpg`, `raw/NASA-GIBS/gibs_amphan_after_clouds_MODIS_Terra_CorrectedReflectance_TrueColor_2020-05-22.jpg`, `raw/NASA-GIBS/gibs_amphan_after_clouds_MODIS_Terra_CorrectedReflectance_TrueColor_2020-05-23.jpg`, `raw/NASA-GIBS/gibs_amphan_after_clouds_MODIS_Aqua_CorrectedReflectance_TrueColor_2020-05-21.jpg`, `raw/NASA-GIBS/gibs_amphan_after_clouds_MODIS_Aqua_CorrectedReflectance_TrueColor_2020-05-22.jpg`, `raw/NASA-GIBS/gibs_amphan_after_clouds_MODIS_Aqua_CorrectedReflectance_TrueColor_2020-05-23.jpg`
- **Coordinates**: EPSG:4326, 1000 x 594 px, row 0 = north
- **Checks**: bright (cloud) share of the radar box: Terra 21 May 1.00, 22 May 0.65 (DS35)
- **Used by**: movie ch00_coordinates_storm s30 (why Amphan has no ordinary before/after; user notes 2026-11-06 item 11)
- **Colab route**: the movie's committed derived images / JSON (no keys); refreshing needs the source route above.
- **Archive**: see `reports/data/ch00_storm_events_archive.md` for reuse in later cyclone movies.
- **Disk**: no download in this session (C: 108.2 GB, G: 456.0 GB free on 2026-11-06).
