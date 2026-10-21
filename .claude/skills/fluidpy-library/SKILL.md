---
name: fluidpy-library
description: How the shared fluidpy library is grown from the AOFD (Vallis) project - the subpackage layout (fluidpy.core untouched, fluidpy.geo physics, fluidpy.data access, fluidpy.diag diagnostics, later fluidpy.ml), where a new function goes, the rule never to break fluidpy.core (the Kundu site imports it), test locations in ../Fluid Dynamics/tests/{geo,data,diag}, the docstring contract, CHANGELOG, editable install, tag/pin policy for Colab, tools/release_check.py and tools/sync_fluidpy.py. Load before writing, moving, testing or releasing any library code.
---

# fluidpy-library — one growing library for every book

`fluidpy` lives in `../Fluid Dynamics` (repo `shammun/fluidpy`, which also hosts the finished Kundu site). The AOFD
venv installs it **editable** (`pip install -e "..\Fluid Dynamics[geo,data,diag]"`), so AOFD always sees the working
tree; Colab installs a **pinned tag** (`book.yaml → project.library_pin`).

## 1. Layout (PLANNING §11.1)
```
fluidpy/
  core/        # Kundu primitives — API frozen: bug fixes only, never a signature change, never a removal
  chNN_*.py    # Kundu chapter modules (unchanged)
  geo/         # Vallis-era GFD: constants, sphere, frames, seawater, thermo_atmos, vertical_coords, balance,
               #   shallow_water, vorticity, qg, ekman, waves/, instability/, wave_mean, turbulence, models/, circulation/
  data/        # registry, fetch() (the one download door → tools/disk_guard.py), fetchers (psl, era5_arco, wb2, cds,
               #   earthdata, woa, mimoc, ecco, fronts, ne, etopo), reduce.py (derived products + provenance), pseudo.py
  diag/        # zonal_mean, anomalies/climatology, streamfunctions (horizontal, MOC, mass), EP flux/TEM on data,
               #   wavenumber–frequency spectra, isentropic/isopycnal remapping
  ml/  (later) # optional extras [ml-torch], [ml-jax] only
```

## 2. Where does a function go?
| It is… | Put it in | Not in |
|---|---|---|
| physics already in `core` (f, β, geostrophy, Ekman, Rossby ω, Eady, N², SW solver, PV …) | **import it** from `fluidpy.core.<mod>` inside `geo` (one implementation) | a re-implementation |
| new GFD physics, reusable by any book | `fluidpy/geo/<topic>.py` | `aofd/` |
| a download, a dataset fetcher, a reduction to a derived product | `fluidpy/data/` (only the `data-scout` writes it) | `geo`, notebooks |
| an operation on gridded fields (zonal mean, spectra, MOC from velocities) | `fluidpy/diag/` | `geo` |
| book glue: parameter sets for Vallis's figures, notebook helpers, figure wrappers | `aofd/chNN_<slug>.py` (AOFD repo) | fluidpy |
| an explainer's JS physics mirror | the explainer / `assets/viz3d.js`, proven by `selftest()` rows against the Python function | — |

Constants have one home: `fluidpy.geo.constants` (Ω = 7.2921×10⁻⁵ s⁻¹ sidereal, a = 6.371×10⁶ m, g = 9.80665 m s⁻²,
R_d, c_p, ρ₀ …), each with its source; it may re-export `core` values.

## 3. Docstring contract (checked by `tools/hooks/post_write.py`)
numpy docstring with: **Vallis §** and **equation number(s)**; **"Kundu: K§ / (K n.m)"** when the idea is shared;
every symbol with its SI unit; assumptions (thin shell, Boussinesq, f-plane, linear …); sign conventions (latitude ϑ — Vallis's symbol; θ is potential temperature —,
ψ sign, lapse-rate sign — compute with Kundu Γ = dT/dz and document met Γ = −dT/dz); validation label (V1–V7 levels
achieved, filled in by the math-verifier). Type hints; SI units everywhere; pure functions; `xarray` in/out only in
`data`/`diag` (geo works on numpy arrays and accepts xarray via `np.asarray`).

## 4. Tests
- Library tests live in the fluidpy repo: `../Fluid Dynamics/tests/geo/`, `tests/data/`, `tests/diag/` (written by the
  `math-verifier`). Chapter-level tests (book-value checks, notebook-facing numbers) live in AOFD `tests/test_chNN.py`.
- Data tests never download in CI: they use a tiny fixture or skip with a reason if the derived product is absent.
- **The full fluidpy suite (every Kundu chapter) must stay green after every library change**:
  `.venv/Scripts/python.exe -m pytest "../Fluid Dynamics/tests" -q -n 8`. A red Kundu test is a regression to fix, not
  to skip.

## 5. Commits, CHANGELOG, tags (PLANNING §11.3)
- Commits in `../Fluid Dynamics` touch only `fluidpy/`, `tests/`, `pyproject.toml`, `CHANGELOG.md` (hooks block the
  Kundu site folders). Message: `geo: <module> — <what> (for aofd chNN)` / `data: …` / `diag: …`; `release: vX.Y.Z`.
- Before 1.0, a minor version may **add** but never remove or rename anything a Kundu notebook or a published AOFD
  chapter imports. SemVer from 1.0.
- Every release (`/release-fluidpy`, the `library-steward` agent): `tools/release_check.py` (full pytest + executes the
  Kundu notebooks ch04 and ch13 headless + `import aofd`), CHANGELOG entry, bump `fluidpy/__init__.__version__`,
  annotated tag `vX.Y.Z`, push `main` + the tag (library paths only; pushing is outward-facing — ask the user the first
  time), then the orchestrator bumps `book.yaml → project.library_pin` and the publisher re-runs the affected Colab twins.
- `tools/sync_fluidpy.py` blocks publishing a chapter whose pin is not a pushed tag or lacks a function the chapter
  imports.
- Roadmap: 0.3.x setup + Ch. 0–5 · 0.4–0.5 Part II · 0.6 Part III · 0.7 Part IV · 1.0 after Vallis (stable API, docs,
  xarray accessors) · 2.x ML extras.

## 6. Lessons (the knowledge-keeper appends; one line each, dated by chapter)
- (setup) netCDF4 1.7.5 on Windows cannot open remote `https://…/dodsC/…` OPeNDAP URLs (TLS CA); `fluidpy.data` uses
  `xr.open_dataset(url, engine="pydap")` for them.
