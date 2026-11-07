# HRD-TDR: NOAA P-3 tail Doppler radar, Hurricane Ian mission 20220928H1 (analysis 220928H1_1023)

Registry entry `HRD-TDR` (added by the provenance audit, 2026-11-07). The full research write-up is in
`reports/data/ch00_coordinates_vertical_motion.md` (2026-11-05).

- **Route**: anonymous FTP `ftp.aoml.noaa.gov/pub/hrd/data/radar/level2/2022/ian/20220928H1/`.
  - Downloaded with `fluidpy.data.fetch(ftp://…, retrieve=<ftplib RETR>, expected_bytes=<FTP SIZE>)`, so the disk guard and the log both ran.
  - The HTTPS tree `www.aoml.noaa.gov/ftp/…` still redirects (302) to the placeholder `temp.aoml.oarcloud.noaa.gov` (re-checked 2026-11-07).
  - The movie builder uses the same callable (`movies/data/build_ch00_coordinates_storm.py::tdr_retriever`). Its runs are cache hits.
- **Files** (`raw/HRD-TDR/`):

  | File | Bytes | sha256 |
  |---|---|---|
  | `220928H1_1023_xy.nc.gz` | 8,266,017 | `a36e853f…3a3d` |
  | `220928H1_1023_vert_inbound.nc.gz` | 108,128 | `063ffc83…3aea` |
  | `TC_RADAR_README.pdf` | 1,045,473 | `895c723c…0862` |

- **Contents**:
  - Dimensions `(x, y, level, time)`. The order is transposed, so call `.transpose('level','y','x')` before plotting.
  - x and y run from −249 to 249 km every 2 km about the HRD storm centre (25.79 N, 82.86 W). Levels are 0–18 km every 0.5 km.
  - Variables: W, U, V, RADIAL_WIND, TANGENTIAL_WIND, WIND_SPEED (m s⁻¹, storm-relative), REFLECTIVITY and VORT. Missing values are ≤ −900.
- **Licence verdict**: **redistributable: no** for the original files.
  - TC-RADAR README §6 (read 2026-11-07 from the local copy) says users are free to download the data, but HRD asks to be told about the project:
    *"we request users notify the HRD radar team lead … of the nature of the research project to ensure proper usage."*
  - The README grants no redistribution right. So the raw and decompressed files are never committed or shipped.
  - Derived ring means and pictures, with the credit line, are fine.
  - Credit line: "Vertical wind: NOAA P-3 hurricane-hunter tail Doppler radar, 28 Sep 2022 ≈ 10 UTC — NOAA AOML Hurricane Research Division".
- **Derived products**:
  - Repo: `movies/ch00/ch00_coordinates_storm/data/img/tdr_w.png` (39,965 B), plus the TDR rows of `cs.json` (DS29).
  - G: scratch: `scratch/movies/ch00_coordinates/research/vertical_motion/tdr_rz.nc` (48,667 B ring means) and the decompressed working copy.
  - Nothing is under `derived/`, so the guard never evicts the raw file.
- **Checks (DS29)**:
  - Peak ring-mean w is 3.3 m/s at 8–9.5 km height, r ≈ 45 km.
  - Strongest single updraught: 11.6 m/s at 13 km.
  - No data inside ≈ 22 km (the clear eye has no radar echoes).
- **Only the user can do**: send the courtesy note to the HRD radar team lead (address in `TC_RADAR_README.pdf` §6) before the movie is published.
- **Colab route**: none. The movie ships only the derived picture.
- **Disk**: no download in this task. Original fetch (2026-11-05): C: 115.2 → 115.2 GB, G: 489.4 → 489.3 GB.
  2026-11-07: C: 112.4 GB, G: 472.8 GB. No evictions.
