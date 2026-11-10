# Notebook Plan: ch00_02_cross_product_why

**Source movie:** `movies/ch00/ch00_cross_product_why/` — v5 (split into Parts 1+2)  
**Series position:** 2 (Chapter 0 maths series)  
**Duration:** ~1:09:15 total (Part 1: 32:41, Part 2: 40:57)  
**Status:** Final (review 3 PASS; §5b retro-fit pending ~31 source-line positions)

---

## 1. Video Summary

The cross product movie is the longest in the series. Part 1 builds intuition (right-hand rule, the arrow at right angles, why the magnitude is |u||v|sin θ) and Part 2 derives the full rotating-frame dynamics — **v** = **Ω**×**r**, the Coriolis acceleration −2**Ω**×**u**, the centrifugal acceleration folded into effective gravity g_eff, and the geostrophic wind. Storm Ciarán (2 Nov 2023) illustrates the geostrophic balance on a real ERA5 map. Hurricane Ian (2022) and Cyclone Idai (2019) illustrate the Coriolis deflection of storms in both hemispheres.

Storyboard: `movies/ch00/ch00_cross_product_why/storyboard.yaml` (v5 + U-CF centrifugal 2026-10-29).  
Music: rotation-turning style, B-flat major 6/8, seed 3.

---

## 2. Concepts Covered

| ID | Concept | Equation ref |
|----|---------|-------------|
| C0A-PoC2 | Cross product definition and right-hand rule | Kundu K 2.19–2.20 |
| — | Cross product components (Levi-Civita) | Kundu K 2.21 |
| — | **v** = **Ω**×**r** (rigid-body rotation) | Vallis (2.1) form |
| — | Rotating-frame rule (d**B**/dt)_out = (d**B**/dt)_rider + **Ω**×**B** | Vallis (2.9) |
| — | Coriolis acceleration: a_Cor = −2**Ω**×**u** | Vallis (2.11) |
| — | Centrifugal: a_cf = **Ω**×(**Ω**×**r**) = −Ω²r⊥ → folds into g_eff | Vallis (2.14) |
| — | g_eff = g_grav − Ω²r⊥; equator 9.78 vs poles 9.83 m/s²; 21-km bulge | Vallis §2.2 |
| — | Geostrophic balance: f **k̂**×**u**_g = −∇p/ρ | Vallis (2.38) form |
| — | f = 2Ω sin φ (Coriolis parameter) | Vallis (2.17) |

**Key equations:**

$$(\mathbf{u} \times \mathbf{v})_i = \varepsilon_{ijk}\, u_j\, v_k$$

$$\mathbf{u} \times \mathbf{v} = (u_2 v_3 - u_3 v_2,\; u_3 v_1 - u_1 v_3,\; u_1 v_2 - u_2 v_1)$$

$$|\mathbf{u} \times \mathbf{v}| = |\mathbf{u}||\mathbf{v}|\sin\theta$$

$$\left(\frac{d\mathbf{B}}{dt}\right)_\text{out} = \left(\frac{d\mathbf{B}}{dt}\right)_\text{rider} + \boldsymbol{\Omega} \times \mathbf{B}$$

$$\mathbf{a}_\text{Cor} = -2\boldsymbol{\Omega} \times \mathbf{u}$$

$$f \approx 2\Omega\sin\phi, \quad \Omega = 7.292 \times 10^{-5}\ \text{rad/s}$$

---

## 3. Data Sources

| Source | Provider | Access | Variables | Region/Time | Use |
|--------|----------|--------|-----------|-------------|-----|
| ERA5 reanalysis | ECMWF / Copernicus | ARCO-ERA5 zarr (anonymous) | z (500 hPa), msl, u10, v10, t2m | 35–70°N, 50°W–10°E; 2023-11-01/02 | Ciarán geostrophic balance; true-colour mosaic |
| IBTrACS v04r01 | NOAA NCEI | `fluidpy.data.ibtracs.fetch_basin('NA')` | lat, lon, wind, storm_id | Hurricane Ian: NA basin `2022266N12294` | Storm track, Coriolis deflection |
| IBTrACS v04r01 | NOAA NCEI | `fluidpy.data.ibtracs.fetch_basin('SI')` | lat, lon, wind, storm_id | Cyclone Idai: SI basin `2019063S18038` (JTWC+RSMC La Réunion) | Southern hemisphere contrast |

**Credits:**  
- ERA5: "Contains modified Copernicus Climate Change Service information 2026. ERA5 (Hersbach et al. 2020) via ARCO-ERA5 (Google Research)."  
- IBTrACS: "IBTrACS v04r01 best tracks (Knapp et al. 2010), NOAA NCEI (public domain)."

**Derived products:**
- `movies/ch00/ch00_cross_product_why/data/real/ibtracs_ian_2022.json`
- `movies/ch00/ch00_cross_product_why/data/real/ibtracs_idai_2019.json`

**Fetch code:**
```python
from fluidpy.data.ibtracs import fetch_basin

ian = fetch_basin('NA', storm_id='2022266N12294')   # Hurricane Ian 2022
idai = fetch_basin('SI', storm_id='2019063S18038')  # Cyclone Idai 2019
```

---

## 4. Visualizations Per Scene

| Scene | What it shows | TSX source | Key visual |
|-------|--------------|------------|-----------|
| s00_title | Title frame | `house/kit/title.tsx` | RiseText, Globe3D |
| s09a | Why the cross product exists (area swept by two vectors) | `cp_s09a.tsx` | ParallelogramArea |
| s18a–s22e | The right-hand rule and the right-angle arrow | `cp_s18.tsx` | CrossProductArrow3D (three.js) |
| s25a–s25b | **v** = **Ω**×**r** on a rotating globe | `cp_s25.tsx` | Globe3D + omega arrow |
| s26a1–s26f | Rotating-frame derivation step by step | `cp_s26.tsx` | CalcStack, rotating disc |
| s27b–s27g | Centrifugal: Ω²r⊥, fold into g_eff, 21-km bulge, plumb line | `cp_s27.tsx` | EarthCrossSection, plumb |
| s28a–s28_f | Coriolis −2**Ω**×**u** → −f **k̂**×**u** | `cp_s28.tsx` | CalcStack |
| s39–s44 | Geostrophic balance: one round low, one equation per step | `cp_s39.tsx` | LowPressure2D, ArrowBalance |
| s45–s46 | Storm Ciarán: ERA5 500 hPa Z and geostrophic wind | `cp_s45.tsx` | ERA5Map, ColourBar, SourceLine |
| s47 | End card | `house/kit/end_card.tsx` | SeriesEndCard |

---

## 5. Methodologies & Equations

### Cross product (component form)
```python
import numpy as np

def cross_scratch(u, v):
    return np.array([
        u[1]*v[2] - u[2]*v[1],
        u[2]*v[0] - u[0]*v[2],
        u[0]*v[1] - u[1]*v[0],
    ])

np.testing.assert_allclose(cross_scratch(u, v), np.cross(u, v), rtol=1e-12)
```

### k̂ × u (horizontal Coriolis deflection)
```python
import numpy as np

def k_cross_scratch(u):
    # k̂ × (u, v, 0) = (-v, u, 0)
    return np.array([-u[1], u[0], 0.0])

from fluidpy.geo.vectors import k_cross
np.testing.assert_allclose(k_cross_scratch(u), k_cross(u), rtol=1e-12)
```

### Coriolis parameter
```python
import numpy as np

Omega = 7.292e-5   # rad/s
phi = np.radians(45.0)  # latitude

f_scratch = 2 * Omega * np.sin(phi)   # s⁻¹

# fluidpy
from fluidpy.geo.atmos import coriolis_parameter
f_lib = coriolis_parameter(phi)
np.testing.assert_allclose(f_scratch, f_lib, rtol=1e-6)
```

### Geostrophic wind (from height field)
```python
# u_g = -(g/f) * dZ/dy,  v_g = (g/f) * dZ/dx
from fluidpy.geo.atmos import geostrophic_wind_from_height
ug, vg = geostrophic_wind_from_height(Z_500, lat, lon)
```

---

## 6. How to Replicate

1. **Download IBTrACS data** (~5 MB per basin; cached in `G:/…/raw/`):
   ```bash
   .venv/Scripts/python.exe -c "
   from fluidpy.data.ibtracs import fetch_basin
   fetch_basin('NA'); fetch_basin('SI')
   "
   ```

2. **Download ERA5 Ciarán** (shared with dot-product notebook; skip if already done):
   ```bash
   # see ch00_01_dot_product.md §6 step 1
   ```

3. **Run the fluidpy geo tests:**
   ```bash
   .venv/Scripts/python.exe -m pytest "../Fluid Dynamics/tests/geo/" -q
   ```

4. **Execute the notebook** (`notebooks/ch00a_cross_product.ipynb`), kernel `aofd-venv`.

---

## 7. Notebook Outline

```
[MD]  # Chapter 0A · The cross product
[MD]  ## The right-hand rule and the area it measures (plain words)
[CODE] # From-scratch: u×v components + assert vs np.cross
[CODE] # Magnitude: |u×v| = |u||v|sin θ — verify with angle
[MD]  ## The k̂ × u deflection (horizontal Coriolis)
[CODE] # From-scratch: k_cross + assert against fluidpy.geo.vectors.k_cross
[CODE] # Worked example: Ian at φ=25°N, wind 50 m/s NE → deflection direction
[MD]  ## Rotating frame: (dB/dt)_out = (dB/dt)_rider + Ω×B
[CODE] # Derivation walk-through (symbolic with sympy)
[MD]  ## Coriolis acceleration: a = −2Ω×u
[CODE] # From-scratch f = 2Ω sin φ + assert against fluidpy
[CODE] # Map: Ian track coloured by f-deflection magnitude
[MD]  ## Centrifugal and effective gravity g_eff
[CODE] # Ω²r⊥, g_eff at equator vs poles (9.78 vs 9.83 m/s²)
[MD]  ## Geostrophic wind
[CODE] # From ERA5 500 hPa Z → u_g, v_g over Ciarán
[CODE] # Map: geostrophic vs actual ERA5 wind
[MD]  *Reading card:* how to read a 500 hPa height map
```
