# NE-50m-land — Natural Earth 1:50m land polygons (PoC C, Fig. 21.23)

- **Route**: HTTPS `https://naturalearth.s3.amazonaws.com/50m_physical/ne_50m_land.zip` via `fluidpy.data.fetch`
  (pooch). 457,183 bytes in 3.4 s; sha256 `0b8e670c…f162` (pinned).
- **Licence verdict**: public domain ("All versions of Natural Earth raster + vector map data … are in the public
  domain"; credit optional; https://www.naturalearthdata.com/about/terms-of-use/). **Redistributable: yes.**
  Credit used: "Made with Natural Earth".
- **Use**: the land class (2) of `data/derived/ch21/fig_21_23_bathy3000_mask.nc`. Cartopy's own Natural Earth cache
  serves the land outline drawn in the figure.
- **Pitfalls**: Natural Earth replaces files in place when it releases a new version. A sha mismatch means a new
  release: re-pin it and note the date. Antarctic ice shelves are not land in this layer.
- **Disk**: before C: 90.8 GB, G: 589.6 GB free; after C: 90.8 GB, G: 589.6 GB; project data 0.09 GB.
