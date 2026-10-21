# NE-10m-bathy-3000 — Natural Earth 1:10m bathymetry band H_3000 (PoC C, Fig. 21.23)

- **Route**: HTTPS `https://naturalearth.s3.amazonaws.com/10m_physical/ne_10m_bathymetry_H_3000.zip`, the one band
  needed. It is 2,528,623 bytes, downloaded in 7.5 s, against 15.6 MB for `ne_10m_bathymetry_all.zip`. sha256
  `5f0d480f…d98a` (pinned). The polygons mark sea floor deeper than 3000 m.
- **Licence verdict**: public domain (Natural Earth terms of use). **Redistributable: yes.**
- **Derived product**: `data/derived/ch21/fig_21_23_bathy3000_mask.nc` (33,795 bytes). It holds `depth_class` int8
  on a 0.25° grid from 90°S to 30°S: 0 = deeper than 3000 m, 1 = shallower than 3000 m, 2 = land (NE 50 m). Each
  value is sampled at the cell centre with `shapely.contains_xy`. Counts: 178,811 / 61,296 / 105,493. Checks:
  Drake Passage (62°W, 58.5°S) = 0, Kerguelen Plateau (70°E, 49°S) = 1, pole = 2.
  Quick-look: `outputs/ch21/data/ql_fig_21_23_inputs.png`.
- **Alternative**: ETOPO 2022 60″ coarsened to 0.25° (about 0.5 GB raw), only if a finer contour is ever needed.
- **Disk**: before C: 90.8 GB, G: 589.6 GB free; after C: 90.8 GB, G: 589.6 GB.
