# ETOPO2022-15s-fuji: ETOPO 2022 15″, Fuji and Suruga Bay (movie M01 D3, s07, s10)

- **Route**: OPeNDAP subset via `fluidpy.data.etopo.fetch_15s`, tile `N45E135`, 272,884 B.
- **Licence**: US Government work, public domain. **Redistributable: yes.**
- **Product**: `etopo2022_15s_fuji_34.4-35.8N_138.1-139.3E.nc`, 264,892 B, on G: and in the repo; 336 × 288.
- **False soundings, a real pitfall**: the raw file holds −8802 m beside −90 m at 34.427° N 138.306° E. The real trough never goes below about −2800 m here. The product replaces 13 such cells on the shelf and records them in `spike_mask`. **Never contour the raw file.**
- **DM10, PASS**: the deepest point north of 34.6° N (the bay mouth) is **−2439 m** at 34.602° N 138.581° E, 18 km from land and 85 km from the summit. Inside the bay the floor is −2044 m at 34.7° N, −1705 m at 34.8° N, −1410 m at 35.0° N. So "about two and a half kilometres" is the mouth, not the inner bay. The box minimum, −2829 m at 34.402° N, is at the southern edge, 108 km from the summit.
- **Pitfall**: Fuji's summit is 3681 m in this grid, so use the DEM for the summit and this grid for land and sea together.
- **Colab route**: the repo product, no keys.
- **Disk**: whole session, C: 60.4 → 61.0 GB free, G: 492.1 → 491.1 GB free, project data 98.07 → 99.01 GB. Render scratch moves these too. Nothing evicted.
