# FRONTS-orsi1995 — Orsi et al. (1995) ACC fronts (PoC C, Fig. 21.23)

- **Record**: AADC "Fronts of the Antarctic Circumpolar Current - GIS data"
  (https://data.aad.gov.au/metadata/antarctic_circumpolar_current_fronts), licence **CC-BY 4.0**.
- **Problem — the AADC download needs an e-mail address**. `https://data.aad.gov.au/eds/4892/download` is a JS app:
  `POST /eds/api/dataset/<uuid>/download {email_address}` returns a 2-hour zip link, and the object API answers
  401. I did **not** submit the user's e-mail without consent.
- **Route used**: the same original Orsi files are read from the Australian Antarctic Division's own GitHub package
  `AustralianAntarcticDivision/orsifronts`, pinned to commit `76d4f6d`
  (`https://raw.githubusercontent.com/AustralianAntarcticDivision/orsifronts/76d4f6d…/data-raw/{stf,saf,pf,saccf,sbdy}.txt`).
  Their byte sizes match AADC's `data from Alejandro Orsi/*.asc` within 1 byte each. Five files, 85,249 bytes in
  total, 1.6–4.5 s each, every sha256 pinned (`sha256_files` in the registry). The mirror lacks AADC's two tiny
  SACCF loop files (`saccf_loop1/2.asc`, 1.9 kB). To use the official zip, submit an e-mail on the AADC page and
  read the shapefile with `fluidpy.data.fronts.read_shapefile()` (pyshp + shapely).
- **Licence verdict**: the data are CC-BY 4.0 per the AADC record. The R package code is GPL-3 and we do not use it.
  **Redistributable: yes, with attribution**: "ACC fronts: Orsi et al. (1995), via the Australian Antarctic Data
  Centre (CC BY 4.0)".
- **Derived product**: `data/derived/ch21/fig_21_23_fronts_orsi.npz` (24,261 bytes). Keys `<front>_lon/_lat` hold
  NaN-separated polylines, float32, with lon from −180 to 180, plus a JSON `attrs` provenance.
- **Checks at 20°E**: PF 49.7°S (brief: about 50°S ✓); SAF 47.6°S (brief: about 45°S; Orsi's SAF sits at 46–48°S
  south of Africa, so the test band is 44–49°S); STF 43.1°S; SACCF 51.6°S; SB 53.3°S. At 65°W: SAF 57.5°S,
  PF 59.7°S.
- **Disk**: before C: 90.8 GB, G: 589.6 GB free; after C: 90.8 GB, G: 589.6 GB.
