# Notebook Plan: ch00_1a_vectors_index_notation

**Source movie:** `movies/ch00/ch00_vectors_index_notation/` — v2  
**Series position:** Stage 1 #1a (viewing order: before the dot-product and cross-product movies)  
**Duration:** ~35:15, ~63,381 frames  
**Status:** Final (review 3 PASS; §5b retro-fit: 5 musts + wind layer stack pending)

---

## 1. Video Summary

The notation movie — made after the dot- and cross-product movies but placed first in the viewing order — teaches how to write wind and other fluid quantities without ambiguity. It covers scalars vs vectors, components and basis vectors (Kundu K 2.1–2.2), vector addition tip-to-tail and parallelogram rule, the Einstein summation convention, and the Kronecker delta. The movie ends with a real warm-air-pushing-north scene on an ERA5 map (s24) and a nine-term grid filling cell by cell (s28). No external data beyond ERA5 for the wind scene.

Music: index-lattice style (NEW — to add to `tools/sound/styles.py`), E-flat major 9/8 at 66 dotted-quarter, celesta + marimba, seed 11.

---

## 2. Concepts Covered

| ID | Concept | Equation ref |
|----|---------|-------------|
| — | Scalars vs vectors; components (u₁, u₂, u₃) | Kundu K 2.1–2.2 |
| — | Basis vectors ê₁, ê₂, ê₃; **u** = uᵢêᵢ | Kundu K 2.2 |
| — | Vector addition (tip-to-tail, parallelogram, components) | — |
| — | Vector subtraction (**p** − **q** = **p** + (−**q**)) | user addition 2026-10-27 |
| — | Einstein summation convention; free and dummy indices | Kundu K 2.2 |
| — | Kronecker delta δᵢⱼ | Kundu K 2.16–2.17; App. B B.3.1, B.3.4 |
| — | Vector magnitude |**u**| = √(uᵢuᵢ) | — |
| — | Dot product as uᵢvᵢ (summed) | — |

**Key equations:**

$$\mathbf{u} = u_i \hat{e}_i = u_1\hat{e}_1 + u_2\hat{e}_2 + u_3\hat{e}_3 \quad \text{(summation convention)}$$

$$\delta_{ij} = \begin{cases}1 & i = j \\ 0 & i \neq j\end{cases}$$

$$|\mathbf{u}|^2 = u_i u_i = u_1^2 + u_2^2 + u_3^2$$

$$\mathbf{u} \cdot \mathbf{v} = u_i v_i \quad \text{(one dummy index; nine terms → three)}$$

---

## 3. Data Sources

| Source | Provider | Access | Variables | Region/Time | Use |
|--------|----------|--------|-----------|-------------|-----|
| ERA5 reanalysis | ECMWF / Copernicus | ARCO-ERA5 zarr (anonymous) | u10, v10, t2m at surface | 35–70°N, 50°W–10°E; 2023-11-01/02 | s24 real-map scene: warm air pushing north |

**Credit:** "Contains modified Copernicus Climate Change Service information 2026. ERA5 (Hersbach et al. 2020) via ARCO-ERA5 (Google Research)."

Shared derived file: `data/derived/ch00/era5_ciaran_2023_sfc.nc` (see `ch00_01_dot_product.md §3`).

---

## 4. Visualizations Per Scene

| Scene | What it shows | TSX / component | Sound cue |
|-------|--------------|-----------------|-----------|
| s00_title | Title frame | `house/kit/title.tsx` | — |
| s05_vector_field | Southerly wind stream, arrows drawn | `vi_s05.tsx` | wind_gentle (0.2) |
| s12a_add_tip_to_tail | Aircraft glyph on a route, tip-to-tail addition | `vi_s12a.tsx` | whoosh (0.12) |
| s12g_shear_hodograph | Balloon rising through a shear column; hodograph | `vi_s12g.tsx` | wind_gentle (0.12) |
| s24_real_map | ERA5 850 hPa T and u10/v10; warm air pushing north | `vi_s24.tsx` | wind_gentle (0.15) |
| s28_nine_terms | 3×3 grid of uᵢvⱼ terms filling cell by cell | `vi_s28.tsx` | tick (0.1) |
| s35 | Series end card | `house/kit/end_card.tsx` | — |

---

## 5. Methodologies & Equations

### Einstein summation — explicit nine terms vs summation
```python
import numpy as np

def dot_nine_terms(u, v):
    # write all 9 terms first, then show which 6 are zero
    result = 0.0
    for i in range(3):
        for j in range(3):
            result += u[i] * v[j] * (1.0 if i == j else 0.0)  # Kronecker delta
    return result

u = np.array([3.0, 4.0, 0.0])
v = np.array([1.0, 2.0, 0.0])
assert dot_nine_terms(u, v) == np.dot(u, v)
```

### Kronecker delta
```python
import numpy as np

delta = np.eye(3)  # δᵢⱼ

# Contraction: δᵢⱼ uⱼ = uᵢ
u = np.array([3.0, 4.0, 0.0])
np.testing.assert_allclose(delta @ u, u, rtol=1e-12)
```

### Vector magnitude
```python
import numpy as np

def norm_scratch(u): return np.sqrt(np.sum(np.array(u)**2))

from fluidpy.geo.vectors import norm
u = np.array([3.0, 4.0, 0.0])
np.testing.assert_allclose(norm_scratch(u), norm(u), rtol=1e-12)
# 5.0 exactly
```

---

## 6. How to Replicate

1. **ERA5 Ciarán data** already downloaded by the dot-product notebook. Verify:
   ```python
   import xarray as xr
   ds = xr.open_dataset('data/derived/ch00/era5_ciaran_2023_sfc.nc')
   print(ds)
   ```

2. **Run fluidpy vector tests:**
   ```bash
   .venv/Scripts/python.exe -m pytest "../Fluid Dynamics/tests/geo/test_vectors.py" -q
   ```

3. **Execute the notebook** (`notebooks/ch00a_vectors_index.ipynb`), kernel `aofd-venv`.

---

## 7. Notebook Outline

```
[MD]  # Chapter 0A · Vectors and index notation
[MD]  ## Scalars and vectors: what's the difference? (plain words)
[CODE] # Wind components: u = (u1, u2, u3); print basis-vector decomposition
[MD]  ## Vector addition and subtraction
[CODE] # Tip-to-tail addition: p + q; parallelogram; components add
[CODE] # Subtraction: p - q = p + (-q); direction from q to p
[MD]  ## The Einstein summation convention
[CODE] # Show all 9 terms of uᵢvⱼ; mark which survive for the dot product
[CODE] # From-scratch dot product as uᵢvᵢ + assert fluidpy.geo.vectors.dot
[MD]  ## The Kronecker delta δᵢⱼ
[CODE] # δ as eye(3); contraction δᵢⱼ uⱼ = uᵢ
[CODE] # Orthonormality of basis: êᵢ · êⱼ = δᵢⱼ
[MD]  ## Vector magnitude
[CODE] # |u|² = uᵢuᵢ from scratch + assert fluidpy.geo.vectors.norm
[MD]  *Reading card:* what does the ERA5 850 hPa wind map tell us?
[CODE] # ERA5 Ciarán: plot u10, v10; compute |wind|; show warm air advection
```
