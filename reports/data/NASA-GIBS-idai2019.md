# NASA-GIBS-idai2019 — VIIRS true-colour images of Tropical Cyclone Idai, 13 and 14 March 2019

- **Route**: NASA GIBS WMS 1.3.0 GetMap (anonymous) through `fluidpy.data.fetch` (`fluidpy.data.gibs.fetch_wms`).
  - Request: EPSG:4326, BBOX 30–10°S, 30–50°E, 2000 × 2000 px (0.01°), JPEG.
  - The server sends no Content-Length, so the guard used a 4 MB estimate per image. Each image is about 0.9 MB and
    takes 4–5 s.
  - Six images were fetched: MODIS Terra, MODIS Aqua and VIIRS SNPP, each for both days. The **MODIS images have
    black swath gaps** across the box, so they were deleted (my own unregistered downloads from this step).
  - **VIIRS SNPP has no gaps**. On 13 March the eye is mid-channel; on 14 March the storm is near the Mozambique
    coast. Both were kept.
  - VIIRS crosses at about 13:30 local time, i.e. about 11–12 UTC.
- **Products**: `idai_viirs_truecolour_2019-03-13.jpg` (973,520 B) and `idai_viirs_truecolour_2019-03-14.jpg`
  (920,463 B) in the movie folder and G: `derived/ch00/`. Row 0 = 10°S, column 0 = 30°E, 0.01° per pixel.
- **Licence verdict**: NASA EOSDIS data-use guidance: data from NASA-led missions are CC0, with no use restrictions.
  Credit NASA and imply no endorsement. **Redistributable: yes.**
- **Credit line**: "Imagery from the NASA Worldview application (https://worldview.earthdata.nasa.gov), part of the
  NASA Earth Science Data and Information System (ESDIS)." VIIRS Corrected Reflectance, NASA LANCE.
- **Note**: no anonymous geostationary archive covers Idai the way GOES covers Ian (Meteosat-8 over the Indian Ocean is
  EUMETSAT, which needs a login and has its own licence). Polar-orbiter mosaics are the open choice.
- **Disk**: C: 84.2 GB and G: 583.0–583.1 GB free, both before and after. Project data went from 6.44 to 6.45 GB.
