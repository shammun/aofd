---
name: from-scratch-code
description: The aofd equation-code rule - every computable numbered equation (Vallis, Kundu K-recaps, Kundu Appendix B in Chapter 0A) gets a from-scratch Python cell (inputs with units, one operation per line, a novice comment per line, numpy basics, loops first then vectorised, no hidden library call) followed by the fluidpy library call and an np.testing.assert_allclose with a justified tolerance; which equations count as computable, sympy checks for the non-computable ones, cell tags eq:N.M, the equation-code ledger and design Part G table, and what coverage_check and the code-reviewer enforce. Load when designing the equation-code table, building notebook cells, or reviewing code that readers will read.
---

# from-scratch-code — every equation as code people can read

Goal (PLANNING §0 item 3): the reader sees **the mechanics** of every equation, line by line, and then sees that the
tested library does exactly the same. Kundu coded only the A items; here every computable numbered equation is coded.

## 1. Which equations count
| Kind | Treatment |
|---|---|
| **Computable**: maps numbers to numbers (a formula, a dispersion relation, a balance solved for one variable, an integral, an ODE/PDE with a solution we can evaluate) | scratch cell + library call + assert |
| **Identity / definition / operator statement** (e.g. ∇·(∇×A) = 0, the vector-invariant form of (u·∇)u, a change of variables) | sympy check (symbolic) **and** a numerical check on a random smooth field (finite differences) |
| **Pure statement** (an assumption, a scaling relation with "~", an inequality condition) | no code; the ledger row says `n/a: statement` with the reason |
The curator lists every numbered equation in the equation-code plan; the designer's **Part G table** maps
`eq → scratch spec → library fn → assert (rtol + why)`; the notebook-builder implements it; `tools/coverage_check.py`
fails if a computable equation has no `eq:` cell or a cell has no assert.

## 2. Scratch-cell anatomy (`nb.scratch_vs_lib`, tag `eq:2.12`)
```python
# 🐍 From scratch — eq (2.12): geostrophic wind from a pressure gradient
# u_g = -(1/(rho0 f)) dp/dy ,  v_g = (1/(rho0 f)) dp/dx
Omega = 7.292e-5            # Earth's rotation rate Ω [rad/s]
lat = np.deg2rad(45.0)      # latitude φ = 45° converted to radians
f = 2 * Omega * np.sin(lat) # Coriolis parameter f = 2Ω sin φ [1/s]  (≈ 1.03e-4)
rho0 = 1.2                  # air density ρ0 [kg/m^3]
dpdx = 0.0                  # no east-west pressure change [Pa/m]
dpdy = -100 / 100e3         # pressure falls 1 hPa (100 Pa) over 100 km northward [Pa/m]
u_g = -dpdy / (rho0 * f)    # eastward wind: minus the northward gradient over ρ0 f [m/s]
v_g = dpdx / (rho0 * f)     # northward wind: the eastward gradient over ρ0 f [m/s]
print(f"u_g = {u_g:.2f} m/s, v_g = {v_g:.2f} m/s")   # ≈ 8 m/s eastward
```
```python
# 🐍 The library — the same numbers through the tested function
u_lib, v_lib = fluidpy.geo.balance.geostrophic_velocity(dpdx, dpdy, f, rho0)
np.testing.assert_allclose([u_g, v_g], [u_lib, v_lib], rtol=1e-12)   # exact same formula → round-off only
```
Rules:
- **Inputs first, each with its unit and meaning**; then **one operation per line**; a comment per line for a novice
  (meaning + unit + equation part), never Python syntax noise.
- **Names match the symbols** (`f`, `rho0`, `N2`, `beta`), Greek spelled out; SI units.
- Allowed in scratch: Python arithmetic, `math`, numpy basics (`np.sin`, `np.sqrt`, arrays, `np.sum`, slicing,
  `np.gradient` only after its primer). **Loops first** where the loop *is* the idea (a sum, a time step, a Riemann
  integral), then the vectorised line ("the same thing, all at once").
- **No hidden library call**: scratch never imports `fluidpy` or `aofd` (directly or via a helper). The code-reviewer
  greps for it.
- Arrays: show one element first ("at x = 0 that is …"), then the array.
- Print the result with its unit and the easy | exact pair when it helps.

## 3. The assert recipe — tolerance justified in a comment
| Comparison | rtol | Why |
|---|---|---|
| same closed-form formula, different code | `1e-12` | round-off only |
| scratch quadrature / finite differences vs library analytic | `1e-8` (or set by the step size, stated) | discretisation error ∝ h², shown |
| scratch solver vs library solver | from a convergence run (halve dt, error drops ×4 → set rtol 10× the finer error) | both are approximations |
| float32 data or GPU read-back | `1e-5`–`1e-4` | single precision |
Use `atol` (stated) when the true value is 0. **Never loosen a tolerance to pass** — a failure means one of the two is
wrong; find out which.

## 4. Non-computable equations: sympy + numbers
```python
# 🐍 Check identity (B.3.12): the divergence of a curl is zero
x, y, z = sp.symbols('x y z')                       # coordinates as symbols
A = sp.Matrix([sp.sin(y*z), x**2*z, sp.exp(x)*y])   # any smooth vector field A
curlA = sp.Matrix([sp.diff(A[2], y) - sp.diff(A[1], z),
                   sp.diff(A[0], z) - sp.diff(A[2], x),
                   sp.diff(A[1], x) - sp.diff(A[0], y)])      # ∇×A by components
div_curlA = sp.diff(curlA[0], x) + sp.diff(curlA[1], y) + sp.diff(curlA[2], z)   # ∇·(∇×A)
assert sp.simplify(div_curlA) == 0                  # exactly zero, for this (and any) smooth A
```
then the same on a grid with finite differences (residual small and shrinking with h), and the library operator
(`fluidpy.core.operators` / `fluidpy.geo.vectors`) on the same grid.

## 5. Ledger and evidence
- End of each section: an **equation-code ledger** table (eq · what it is · cell tag · status `scratch+lib+assert` /
  `sympy+numeric` / `n/a: statement`), checked by `coverage_check.py`.
- **Parity is pedagogy, not evidence**: scratch and library may share a mistake (same misread equation). The library's
  evidence comes from the V-ladder in fluidpy tests (`verify-implementation`); the scratch cell shows the mechanics.
- The code-reviewer (pass 2) reads every scratch cell: one idea per line, comments a novice understands, names match
  symbols, no hidden library call, asserts meaningful and tolerances justified.
