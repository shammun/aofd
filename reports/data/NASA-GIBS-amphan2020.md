# NASA-GIBS-amphan2020: true-colour images of Cyclone Amphan, 18–20 May 2020 (registered 2026-11-06)

- **Files** (on G: `raw/NASA-GIBS/`, fetched 2026-11-05/06 by `movies/data/build_ch00_coordinates_storm.py` through
  `fluidpy.data.gibs.fetch_wms` and the disk guard): MODIS Terra 18 and 20 May, Aqua 19 May, VIIRS SNPP 20 May, and the wider
  `ch00co_amphan_b` Terra 18 May crop (jpg + png). Total 2,670,581 B; sha256 per file in the registry.
- **Licence**: NASA EOSDIS data-use guidance (NASA-led mission imagery, no restrictions; credit NASA). **Redistributable: yes.**
  Credit: "Imagery from the NASA Worldview application (https://worldview.earthdata.nasa.gov), part of NASA ESDIS".
- **Used by**: 5b s21–s22 (Amphan from space; `cs.json → amphan.modis`, eye 13.38 N 86.12 E vs IBTrACS 13.4 N 86.2 E).
- **Pitfall**: WMS GetMap returns no Content-Length; the guard uses its per-image estimate.
- **Colab route**: the movie's committed derived image; no keys. **Disk**: no download in this session.
