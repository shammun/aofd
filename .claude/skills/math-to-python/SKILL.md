---
name: math-to-python
description: How to turn textbook mathematics (definitions, theorems, derivations, numbered equations) into faithful, testable Python for the AOFD (Vallis) project — transcription from page images, symbolic-first workflow, numerical methods, grids and boundaries, units, numerical pitfalls, plus the GFD methods Vallis needs: spherical metric terms, f-/β-plane, spectral and pseudo-spectral solvers, sparse elliptic solves (Stommel–Munk, PV inversion), eigenproblems (Charney, Eady), delay ODEs (delayed oscillator). Load before writing or reviewing any implemented code.
---

# math-to-python — coding a book that has no code

## 0. The order of work (do not skip a step)
1. **Transcribe** the equation from the page image into LaTeX in `analysis/chNN.md`. Never from the extracted text
   alone: in this book's extraction `¼` is `=`, `ð…Þ` are parentheses, minus signs vanish, ω prints as `u`, fractions
   are split across lines. Render the defining page: `.venv/Scripts/python.exe tools/render_pages.py chNN --eq N.M`.
2. **Symbolically** state it in sympy and check it against the book's stated special cases (the book almost always
   gives one: "for a flat plate this reduces to …"). If the special case does not come out, your transcription is wrong.
3. **Decide the numerical method** (table below) and what the book leaves unspecified.
4. **Implement** with the book's own symbols and a `# Eq. (n.m)` comment on the line that is the equation.
5. **Validate** (see `verify-implementation`) before you move on. An unvalidated function is a liability for every later
   chapter that reuses it.

## 1. Transcription discipline
- One function per equation, named after what it computes, not after the equation number.
- Keep the book's symbol names in the signature (`nu`, `rho`, `dpdx`, `U_inf`, `Re_x`); add units in the docstring.
- If the book writes a result in a compact form and its expanded form elsewhere, implement the form it *derives* and
  assert the compact form in a test — this catches transcription errors in both places.
- If you suspect a typo in the book (dimensions do not balance, the limit is wrong), do **not** silently fix it: code
  what you believe is correct, and record in the analysis and the report "book prints X; dimensional analysis requires Y;
  implemented Y" with the reasoning.

## 2. Choosing the numerical method
| The book gives you | Implement with | Watch for |
|---|---|---|
| a closed-form expression | direct numpy evaluation, vectorised | cancellation; evaluate the numerically stable form |
| an implicit algebraic equation (Colebrook, normal-shock M₂, Kutta condition) | `scipy.optimize.brentq` with a bracket derived from physics; `newton` only with an analytic derivative | brackets that fail at extreme parameters; always assert the residual |
| an integral (streamfunction, drag, energy) | `scipy.integrate.quad` (adaptive, returns its error estimate — assert it), `simpson` on given samples | improper/singular integrands: substitute or split at the singularity |
| an ODE initial-value problem | `scipy.integrate.solve_ivp(..., rtol=1e-8, atol=1e-10, dense_output=True)`; default `RK45`, `Radau`/`BDF` when stiff | stiffness (chemistry, thin layers); events for shock/separation detection |
| an ODE boundary-value problem (Blasius, Falkner–Skan, Orr–Sommerfeld) | shooting (`brentq` on the missing initial condition) **and** `scipy.integrate.solve_bvp` — implement one, cross-check with the other | infinite domains: truncate at η_max and show the answer is insensitive to it |
| an eigenvalue problem (stability, normal modes) | `scipy.linalg.eig`/`eigh` on the discretised operator; Chebyshev collocation for Orr–Sommerfeld | spurious modes: refine and keep only the modes that converge |
| a PDE with a scheme the book specifies | write that scheme explicitly; do not substitute a library solver | boundary treatment; stability limit |
| a PDE with no scheme specified | pick the simplest that resolves it (2nd-order central in space, RK4 or Crank–Nicolson in time), document the choice, and show grid-independence | say in the docstring that this is *your* choice, not the book's |
| a linear system | `scipy.sparse.linalg.spsolve`/`cg` with a sparse assembly; dense only for n ≲ 2000 | assemble with `lil`/`coo`, solve in `csr`; check the condition number when a result looks odd |
| a series solution | sum with an explicit truncation test (add terms until the increment is < tol), never a fixed term count | slow convergence near the domain edges |
| a statistical/turbulence quantity | numpy/pandas with explicit averaging windows | ensemble vs time vs spatial averaging — say which |

## 3. Grids, fields and boundaries
- Standard layout: `x` varies along the **last** axis, `y` along the second-to-last (`u[j, i]` = `u(y_j, x_i)`), and
  `np.meshgrid(x, y, indexing="xy")`. State it once in `fluidpy/core/grids.py` and never deviate.
- Say in every docstring whether a value lives at a **node** or a **cell face/centre**. Half-cell offsets are the single
  most common discretisation bug; a staggered (MAC) arrangement is worth it for incompressible solvers.
- Boundary conditions are part of the operator, not an afterthought: implement Dirichlet/Neumann/periodic explicitly in
  `core/operators.py` with a `bc=` argument, and unit-test each with a function whose derivative is known.
- `np.gradient` is second-order in the interior and **first-order at the edges** — do not use it inside a scheme whose
  order you are about to measure. Write the difference stencils explicitly.
- Time stepping: expose `dt` and assert the stability criterion (`dt <= CFL*dx/|u|max`, `dt <= dx^2/(2*nu)`), raising a
  clear error rather than producing NaNs.

## 4. Non-dimensionalisation and units
- Implement the non-dimensional equations (that is what the book analyses) and provide a thin dimensional wrapper
  built from the reference scales; never mix.
- Put the reference scales in one place per chapter (a small dataclass `Scales(L, U, rho, mu)` with a
  `nondimensionalise()`/`redimensionalise()` pair) so a change of reference length cannot silently leak.
- `fluidpy/core/units.py` wraps a `pint` registry. Use it in tests (dimensional homogeneity) and at script/notebook
  boundaries; keep the hot numerical paths as plain floats.
- Temperatures in kelvin inside functions. Pressures absolute unless the name says `_gauge`.

## 5. Numerical pitfalls that actually occur in fluid dynamics
- **Cancellation**: `sqrt(1+x) - 1` for small x, `(p - p_inf)/p_inf` for weak flows, `1 - M^2` near M = 1 → use the
  algebraically rearranged form (`x/(sqrt(1+x)+1)`), `np.expm1`, `np.log1p`.
- **Singularities**: potential-flow sources at their own location, the leading edge of a boundary layer, the pipe
  centreline in cylindrical coordinates (`r = 0`), the stagnation point in a log-law. Handle them analytically and test
  the limit explicitly.
- **Stiffness**: near-wall grids, chemical source terms, very low Mach numbers → implicit solver, and say so.
- **Transcendental branches**: `arctan2`, not `arctan`, for angles; `np.unwrap` for phase; watch the branch cut in
  conformal maps (Joukowski).
- **Interpolation**: books plot; you compute. Use `scipy.interpolate` with the same order as the scheme, and never
  interpolate across a shock or a discontinuity.
- **Random anything**: seed it (`np.random.default_rng(0)`) and put the seed in the docstring, or the notebook will not
  reproduce.
- **Floating-point comparison**: no `==` on floats; compare with a tolerance tied to the quantity's scale.
- **Performance**: vectorise first; a 200×200 grid stepped 5000 times in pure Python loops takes minutes and will blow
  the notebook budget. If a loop is unavoidable, isolate it behind a function so it can later be `numba.njit`-ed, and
  cache expensive results to `outputs/`/`reference/` with a documented invalidation rule.

## 6. Figures that match the book
- Reproduce the book's axes, ranges, non-dimensional groups and curve labels — that is what makes the comparison
  meaningful — but draw them with our code and our style: `fluidpy.core.style.use_style()` (palette shared with the
  explainers, explicit axis labels **with units**, legend entries naming the parameter value). Never copy a book figure.
- Never set colours per point for a continuous field without a colourbar.
- Save with `fluidpy.core.style.savefig(fig, "chNN", "fig_<n>_<slug>")` (→ `outputs/chNN/`, git-ignored), and return the
  figure so the notebook can show it. Animations and interactive figures: skill `python-viz`.
- Functions that an explainer mirrors must accept plain floats (scalar-callable) so `selftest()` parity rows can call
  them as `chNN.fn(1.0, 10.0)`.

## 6b. GFD methods the Vallis chapters need (AOFD additions)
Physics goes into `fluidpy.geo` (skill `fluidpy-library`); reuse `fluidpy.core.gfd`, `rotating`, `shallow_water`,
`stratification`, `vertical_modes` first (check `knowledge/kundu_index.yaml`).
- **Spherical coordinates and metric terms.** Vallis uses longitude λ, **latitude φ**, radius r (Kundu uses colatitude
  θ: cos θ ↔ sin φ, ∂/∂θ = −∂/∂φ — write the crosswalk in the docstring). Keep the metric terms explicitly
  (u v tan φ / a, u w / a, …) and test each against sympy's vector module in spherical form; the thin-shell
  approximation r ≈ a is a named switch, not a silent simplification. Grids: `lat` ascending S→N inside fluidpy (PSL
  files run N→S: `sortby("lat")` at load); `lon` 0–360 or −180–180 stated once per module; area weights cos φ.
- **f- and β-plane.** f₀ = 2Ω sin φ₀, β = 2Ω cos φ₀ / a; y = a(φ − φ₀). Ω = 7.2921×10⁻⁵ s⁻¹ (sidereal), a = 6.371×10⁶ m
  from `fluidpy.geo.constants` (one source); state which in every docstring. Test the β-plane error against the full
  f(φ) (`gfd.beta_plane_error`).
- **Spectral / pseudo-spectral** (2-D turbulence, β-plane jets, QG): `numpy.fft.rfft2`, wavenumbers from
  `2π fftfreq(n, d)`, 2/3-rule dealiasing, integrating-factor or ETDRK4 for stiff linear terms; check energy and enstrophy
  budgets (V4) and the inviscid conservation to round-off for the nonlinear term alone. Periodic only — say so.
- **Sparse elliptic solves** (Stommel–Munk gyres, PV inversion): assemble with `scipy.sparse` (5-point Laplacian,
  13-point biharmonic, metric cos φ factors on the sphere), boundary rows for ψ = 0 (and ∂ψ/∂n = 0 for Munk), solve with
  `scipy.sparse.linalg.spsolve` (or `splu` reused across steps); verify on a manufactured solution (V1) and second-order
  convergence (V3); the Munk layer width (A_H/β)^{1/3} must be resolved by ≥ 4 points.
- **Eigenproblems** (Charney, Eady, Phillips, Rayleigh–Kuo, vertical modes): generalised `scipy.linalg.eig(A, B)` on a
  Chebyshev or finite-difference grid; filter spurious modes by convergence (eigenvalue stable under grid doubling);
  normalise modes by a stated rule; compare with the Eady closed form (growth max 0.31 f Λ / N at k L_d ≈ 1.6) before
  trusting the general solver.
- **Delay differential equations** (delayed-oscillator ENSO): method of steps with a history buffer and fixed dt that
  divides the delay; compare with the linear characteristic equation's roots for small amplitude (V1) and check the
  period vs the delay (V7).
- **Rotating-frame ODEs and trajectories** (inertial circles, Coriolis on a sphere): `solve_ivp(method="DOP853",
  rtol=1e-10)`; inertial period 2π/f and circle radius U/f are the V1 checks; integrate in Cartesian 3-D near the poles.
- **Reduced models** (1-D QBO, Held–Hou, box models, advection–condensation): non-dimensional form taken from the book
  page; method of lines; state the CFL/stability limit in the docstring.
- **Seawater**: TEOS-10 through `gsw` only (SA, CT, σ₀/σ₂, N²); never mix practical and absolute salinity silently.

## 7. Lessons learned (append one line per new pitfall; the knowledge-keeper promotes chapter lessons here)
- (ch01) A default that sits on a regime boundary is computed from the boundary function, never typed rounded: a
  "neutral" −9.8e-3 K/m was steeper than Γ_a = −g/C_p = −9.7607e-3 and classified unstable.
- (ch01) When the book and the field use opposite sign conventions, compute in the book's and ship a tested converter
  that returns the verdict *and* the criterion text in either convention (`lapse_rate_convention`,
  `lapse_rate_stability`); never convert silently inside a physics function.
- (ch01) Exact rationals (`fractions.Fraction`) for exponent algebra (Π groups): the JS mirror reproduces them exactly
  and ½ never prints as 0.49999. Wrap scalar results with `core._util.as_scalar_if_0d` so parity rows get floats.
- (ch01) pint: kmol has a [substance] dimension — drop it consistently (with a warning) in dimensional matrices; °C is
  an offset unit — kelvin inside functions, `delta_degC` for differences.
- (ch01) Check the variable conventions of a reference formula before coding it: USSA-1976 uses geopotential altitude
  (`geometric=True` converts), EOS-80 uses IPTS-68 temperature (t68 = 1.00024 t90).
- (ch01) Unbounded ODE growth (N² < 0 parcels): stop `solve_ivp` with a terminal event at a cap and return NaN past it.
- (ch01) Sibling functions must share argument order and tolerance bands (`irreversible_process(kind, T1, v1)` vs
  `path_heat_work_totals(kind, v1, T1)`; neutral bands 1e-9 K/m vs 1e-12 s⁻²); where they do not, call by keyword and
  exclude the band in sweeps.
- (ch01) When a derivation divides by "the density", name whose: the parcel's own density (inertia of the displaced
  body), not the environment's — only an exact invariant of the un-linearised law told the two apart.
- (ch14) Split a quadrature at every kink of the integrand (one Gauss rule across a tapered chord's kink lost 2.2e-6 of
  the area and every coefficient inherited it); choose the root of an inverse map by continuity (distance from the
  circle's centre), not by modulus.
- (ch15) **One gas per call**: a function taking both `gamma` and `gas` takes γ from `gas` and raises on a disagreeing
  `gamma` (γ = 1.4 with a rocket gas's R was 4.1 % off); test every gas- or fluid-carrying function with non-default
  properties.
- (ch15) At a point where a factor vanishes (1/(1 − M²) at M = 1), **form the driver first, then divide** — multiplying
  each term by inf separately turns every zero term into NaN (0·inf) and poisons the sum.
- (ch15) Guard a bare formula in its callers, not by its sign: raise for scalars, return NaN plus a flag for arrays,
  with a stated round-off allowance (asin(1/M) puts M sin σ one ulp below 1 for many M).
- (ch15) Near a branch point write M² − 1 as (M − 1)(M + 1) and switch to the series below a stated |m|; at a
  square-root branch point (a vanishing discriminant) assert the conditioning bound ½(γ + 1)√|D|, never a looser
  tolerance elsewhere.
- (ch15) A printed slip that changes the physics is coded corrected and kept as a named option (`printed_15_47=True`)
  that a test must fail; confirm the correction three ways (finite differences of the closed form, sympy on the
  linearised laws, sympy on the finite laws).
- (ch15) A re-exported function whose bare name means something else in the new chapter (ch04's incompressible
  `stagnation_pressure` in a compressible chapter) gets a warning wrapper and an explicit alias, and a test pins the gap.
- (ch16) **A fitted constitutive law carries its validity range as a guard**: warn and extrapolate for scalars, NaN +
  warning for arrays, a stated round-off allowance at the edge (`collapsible_tube_law`, α ≤ 1); turn "the demo stays in
  range" into a computed criterion (H ≤ 0 ⇔ α_t ≤ (1 − n/2)^{1/n}) and a test.
- (ch16) Prefer a closed form to a bracketed root search: a fixed `brentq(…, 1e-6, 1e6)` bracket raised once the root
  fell below 1e-6 (wide upstream sections); the closed form α* = (ρQ²/(A₀²K_pn))^{1/(2−n)} needs none.
- (ch16) One scalar argument has one meaning across sibling functions, or the function raises (`G` was the n = 1
  amplitude in one Womersley function and the mean G₀ in its sibling, 245× apart).
- (ch16) Evaluate each piece of a piecewise formula only on its own mask — `np.where` evaluates both branches and an
  unused exponential overflowed for tiny RK.
- (ch16) Two time conventions (e^{+iωt} and e^{i(kx − ωt)}) never meet in one function; name the convention in every
  docstring and keep separate constants (i^{3/2} vs e^{iπ/4}); ratios of complex Bessel functions through `jve`.
