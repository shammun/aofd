# GFS-ANL-jet250 — GFS 0.25° analysis, 250 and 300 hPa wind over the North Atlantic, latest cycle 2026-10-28 18Z (movie #1a D4)

- **Route**: Unidata THREDDS NetCDF Subset Service (anonymous HTTPS).
  - Called as `fluidpy.data.gfs.fetch_analysis(cycle, variables=(u-component_of_wind_isobaric, v-component_of_wind_isobaric),
    level=250 | 300)`, which goes through `fluidpy.data.fetch` and the disk guard (6 MB estimate per variable; the server
    sends no Content-Length).
  - The catalogue held 28 cycles, 2026-10-22 00Z to 2026-10-28 18Z. The latest one was used.
  - 250 hPa: 3,975,346 B in 9.6 s, sha256 `f7d54513…b4c2`. 300 hPa: 3,966,754 B in 21.4 s, sha256 `4bfd1d46…583e`.
- **Product**: `gfs_jet_250-300hPa_2026-10-28T18_natl.nc` (1,492,028 B, sha256 `208f3481…b0c6`). On G: and in the repo.
  - Dims: (level 250, 300; lat 20…75 S→N; lon −100…20).
  - Variables: u, v, speed = hypot(u, v) [m s⁻¹]. Valid time 2026-10-28T18Z (analysis, forecast hour 0).
- **Check VI41**:
  - Jet maximum at 250 hPa: **66.1 m/s at 40.0° N 51.75° W**, u = 61.3, v = −24.6. It is the same point for the whole box
    and for 30–65° N 70–10° W.
  - At 300 hPa: 63.8 m/s at 46.75° N 52.25° W.
  - The plan says "about seventy", but **the data say about sixty-five**. s12a should be reworded to the data and
    re-measured.
  - The airliner thought example (250 ± 50) is unaffected.
- **Quick look**: `outputs/ch00/data/ql_gfs_jet250.png`. A wavy jet runs from the US east coast through 40° N 50° W, with a
  ridge toward 55° N 30° W.
- **Licence verdict**: US Government work (NOAA/NCEP), public domain. **Redistributable: yes.**
- **Pitfall**: the THREDDS window keeps about 7 days, so the raw file cannot be downloaded again after about 2026-11-04
  (`redownloadable: false`). Archive routes: NCAR RDA ds084.1 or AWS `noaa-gfs-bdp-pds` (GRIB-2). Keep the derived
  product.
- **Colab**: loads the committed product.
- **Disk**: before C: 67.4 GB, G: 543.2 GB free; after C: 68.0 GB, G: 543.1 GB free. Nothing evicted.
