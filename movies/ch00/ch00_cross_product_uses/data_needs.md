# ch00_cross_product_uses (Part 2 of v5) — data needs (movie-director, 2026-10-28, plan 3)

This replaces the 1aa590f data plan for this folder (no aurora, no Ekman/upwelling, no today's-map scene: none of them is
in v5).

- **No download.** Every content scene is v5 s23–s48 and reads the v4 data in
  `movies/ch00/ch00_cross_product_why/data/` and `data/derived/ch00/` (ERA5 Ciarán, NCEP R1 LTM winds, Ian / Idai ERA5
  and HRRR, GOES-16, MODIS, IBTrACS, Blue Marble, Natural Earth) with the v4 manifest rows (121 replayed calls + 12 heavy).
- **New start scenes:** s00_title (s25b globe data, s31 paths, s36 Ian), s01_hook (same), s01a–s01c (v4 examples:
  a = (5, 1, 0), b = (1, 3, 0), a × b = (0, 0, 14), across part 2.75), s01d (v4 kicks data). No new CHECK rows beyond the
  v4 ones; the builder is the v5 builder restricted to these scenes.
- **Computed values kept from v4:** E1 equator ground speed 464.58 m/s (`fluidpy.geo.vectors.cross`), E2 inertial period
  16.92 h at 45° (`fluidpy.core.gfd.inertial_period`).
- **Disk at planning:** C: 74 GB free, G: 556 GB free.
