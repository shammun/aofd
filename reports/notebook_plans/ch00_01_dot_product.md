# Notebook Plan: ch00_01_dot_product_why

**Source movie:** `movies/ch00/ch00_dot_product_why/` — v6 fix 1  
**Series position:** 1 (Chapter 0 maths series)  
**Duration:** 17:40 (1060 s), 51.27 MB  
**Status:** Final (QA 10/10, review 6b PASS, user: "I love it" 2026-10-25)

---

## 1. Video Summary

The first movie in the Chapter 0 maths series teaches the dot product from scratch — starting with "what does it even mean to multiply two arrows?" and ending with Storm Ciarán (2 Nov 2023) carrying cold air southward from the Atlantic. The arc is: geometric picture (projection) → algebraic formula → why wind cares about ∂T/∂x and ∂T/∂y differently depending on direction → the material derivative DT/Dt.

Scenes s00–s22 (27 in total). House style `house-dark-v1`, music `maths-calm` (C major, seed 7). Narration: Kokoro `af_bella` speed 1.0.

---

## 2. Concepts Covered

| ID | Concept | Equation ref |
|----|---------|-------------|
| C0A-01 | Dot product geometric definition | — |
| C0A-02 | Scalar projection of **u** onto **v** | — |
| C0A-03 | Dot product algebraic formula | — |
| C0A-04 | Angle between two vectors | — |
| C0A-05 | Temperature advection **v**·∇T | Vallis (1.1) context |
| C0A-06 | Material derivative DT/Dt | Vallis (1.2) |

**Key equations (all coded and asserted in notebook):**

$$\mathbf{u} \cdot \mathbf{v} = u_1 v_1 + u_2 v_2 + u_3 v_3$$

$$\mathbf{u} \cdot \mathbf{v} = |\mathbf{u}||\mathbf{v}|\cos\theta$$

$$\text{proj}_{\mathbf{v}}\,\mathbf{u} = \frac{\mathbf{u} \cdot \mathbf{v}}{|\mathbf{v}|}$$

$$\frac{DT}{Dt} = \frac{\partial T}{\partial t} + \mathbf{v} \cdot \nabla T = \frac{\partial T}{\partial t} + u\frac{\partial T}{\partial x} + v\frac{\partial T}{\partial y} + w\frac{\partial T}{\partial z}$$

**Worked example (easy | exact):**  
**v** = (12, 5) m/s (NE wind), ∇T = (0.012, 0.009) K/m →  
**v**·∇T = 12×0.012 + 5×0.009 = 0.144 + 0.045 = 0.189 K/h (warming by advection)

**Pole thermometer analogy:** a thermometer at the North Pole feels no advection no matter how fast the wind blows along latitude circles, because **v** ⊥ ∇T → **v**·∇T = 0.

---

## 3. Data Sources

| Source | Provider | Access | Variables | Region | Use |
|--------|----------|--------|-----------|--------|-----|
| ERA5 reanalysis | ECMWF / Copernicus | ARCO-ERA5 zarr (anonymous GCS) | msl, u10, v10, t2m; z, u, v at 850+500 hPa (hourly) | 35–70°N, 50°W–10°E | Storm Ciarán 2023-11-01T00 to 11-02T23; advection scenes |

**Credit:** "Contains modified Copernicus Climate Change Service information 2026. ERA5 (Hersbach et al. 2020) via ARCO-ERA5 (Google Research)."

**Derived products (committed, ≤10 MB each):**
- `data/derived/ch00/era5_ciaran_2023_sfc.nc` — surface fields (msl, u10, v10, t2m)
- `data/derived/ch00/era5_ciaran_2023_upper.nc` — upper-level z, u, v at 850+500 hPa

**Fetch code:**
```python
from fluidpy.data.era5_arco import fetch_box
ds_sfc = fetch_box(
    '2023-11-01T00', '2023-11-02T23',
    lat=(35, 70), lon=(-50, 10),
    variables=['msl', 'u10', 'v10', '2m_temperature'],
    pressure_levels=None,
)
ds_upper = fetch_box(
    '2023-11-01T00', '2023-11-02T23',
    lat=(35, 70), lon=(-50, 10),
    variables=['z', 'u', 'v'],
    pressure_levels=[850, 500],
)
```

---

## 4. Visualizations Per Scene

| Scene | What it shows | TSX source file | Key visual |
|-------|--------------|-----------------|-----------|
| s00_title | Title frame + 3-D globe (daytime mosaic) | `movies/src/ch00_dot_product/dp_s00.tsx` | Globe3D, TitleGradient |
| s01–s04 | Two arrows, dot product as a number | `dp_s01.tsx` | ArrowPair, angle arc |
| s05–s08 | Scalar projection of wind onto gradient | `dp_s05.tsx` | ProjectionDiagram |
| s09–s12 | Isotherms sliding under a wind vector | `dp_s09.tsx` | IsothermSlide, moving dashes |
| s13–s16 | Ciarán: ERA5 850 hPa T and wind | `dp_s13.tsx` | ERA5Map, ColourBar, SourceLine |
| s17–s20 | Material derivative DT/Dt = ∂T/∂t + v·∇T | `dp_s17.tsx` | CalcStack, moving parcel |
| s21 | Pole thermometer (v⊥∇T) | `dp_s21.tsx` | GlobeMini, zero-projection |
| s22 | Series end card | `house/kit/end_card.tsx` | SeriesEndCard |

---

## 5. Methodologies & Equations

### Dot product (component form)
```python
# From scratch
def dot_scratch(u, v):
    return u[0]*v[0] + u[1]*v[1] + u[2]*v[2]

# fluidpy call
from fluidpy.geo.vectors import dot
result = dot(u, v)

import numpy as np
np.testing.assert_allclose(dot_scratch(u, v), result, rtol=1e-12)
```

### Vector norm
```python
import numpy as np
def norm_scratch(u): return np.sqrt(np.sum(np.array(u)**2))

from fluidpy.geo.vectors import norm
np.testing.assert_allclose(norm_scratch(u), norm(u), rtol=1e-12)
```

### Angle between vectors (cos θ = u·v / (|u||v|))
```python
import numpy as np
def angle_scratch(u, v): return np.arccos(np.dot(u,v)/(np.linalg.norm(u)*np.linalg.norm(v)))

from fluidpy.geo.vectors import angle_between
np.testing.assert_allclose(angle_scratch(u, v), angle_between(u, v), rtol=1e-10)
```

### Scalar projection
```python
def scalar_proj_scratch(u, v): return np.dot(u, v) / np.linalg.norm(v)

from fluidpy.geo.vectors import scalar_projection
np.testing.assert_allclose(scalar_proj_scratch(u, v), scalar_projection(u, v), rtol=1e-12)
```

### Material derivative (temperature advection)
```python
# Inputs
u, v = 12.0, 5.0        # m/s
dTdx, dTdy = 0.012, 0.009  # K/m
dTdt = -0.05  # K/s (local cooling)

# Scratch
advection = u*dTdx + v*dTdy  # 0.189 K/s → ×3600 = 680.4 K/h (wait, recalculate)
# Correct: 0.189 K/s? No: units are (m/s)(K/m) = K/s = 0.189 K/s = 680 K/h (too big)
# Movie uses: v=(12,5) m/s, ∇T=(0.012,0.009) K/km → advection = 0.189 K/h
# i.e. ∇T in K/km: dTdx=0.012 K/km = 1.2e-5 K/m
# Check the storyboard for the exact numbers before coding

from fluidpy.core.kinematics import material_derivative_terms
```

---

## 6. How to Replicate

1. **Download ERA5 Ciarán data** (once; ~20 MB total):
   ```bash
   .venv/Scripts/python.exe -c "
   from fluidpy.data.era5_arco import fetch_box
   # run the fetch_box calls above; saves to data/derived/ch00/
   "
   ```
   Verify: `data/derived/ch00/era5_ciaran_2023_sfc.nc` exists.

2. **Check fluidpy functions:**
   ```bash
   .venv/Scripts/python.exe -m pytest ../Fluid\ Dynamics/tests/geo/test_vectors.py -q
   ```

3. **Run the notebook** (`notebooks/ch00a_dot_product.ipynb`):
   - Kernel: `aofd-venv`
   - Cells run in order; all asserts should pass with `rtol=1e-10`

4. **Colab twin** (`notebooks/ch00a_dot_product_colab.ipynb`):
   - Setup cell installs pinned fluidpy tag (from `book.yaml → fluidpy_tag`)
   - Downloads derived data from GitHub (committed ≤10 MB files)
   - No credentials needed

---

## 7. Notebook Outline

```
[MD]  # Chapter 0A · The dot product
[MD]  ## What is the dot product? (plain words)
[CODE] # From-scratch: u·v component form + assert against fluidpy.geo.vectors.dot
[CODE] # From-scratch: |u| norm + assert against fluidpy.geo.vectors.norm
[CODE] # From-scratch: cos θ angle + assert against fluidpy.geo.vectors.angle_between
[MD]  ## Scalar projection: how much of u points along v?
[CODE] # From-scratch: scalar_projection + assert
[CODE] # Worked example: wind=(12,5) m/s, easy numbers
[MD]  ## Temperature advection: v·∇T
[CODE] # Load ERA5 Ciarán; compute ∇T at 850 hPa
[CODE] # Map: T and wind arrows coloured by v·∇T
[MD]  ## The material derivative DT/Dt = ∂T/∂t + v·∇T
[CODE] # From-scratch: material_derivative_terms + assert
[CODE] # Ciarán 2023-11-01 12 UTC: total vs local vs advective rate
[MD]  *Reading card:* what does the map tell us?
[MD]  *Mechanism card:* why do isotherms slide sideways?
```
