---
name: python-viz
description: Figures, animations and Python-side interactive plots for AOFD (Vallis) notebooks - the house matplotlib style, when to use a static figure vs a matplotlib animation vs a plotly slider/animation figure (works on the published page) vs ipywidgets (kernel only), size budgets, the helper calls in fluidpy.core.style / anim / interact, plus maps and data figures - cartopy projections, cmocean colour maps, contour conventions, and plotly 3-D (Isosurface, Cone, Mesh3d) size limits. Load when writing any figure, animation or interactive cell.
---

# python-viz — pictures that teach, in every host

## 1. Choose the right kind
| The reader needs to… | Use | Works on the web page? |
|---|---|---|
| see one relationship | static matplotlib figure + What you see / How to read it / What would change if | yes |
| read a data map or section | cartopy/matplotlib figure from `figs/chNN/fig_NN_MM.py` + 🗺️ reading card **before** the interpretation (skill `figure-reproduction`) | yes |
| see how a curve changes with one parameter | `slider_figure` (plotly; every slider position precomputed) | **yes** |
| watch something evolve in time | `animate` + `show_animation(player="video")` | yes |
| step through discrete stages | `show_animation(player="frames")` or `animate_figure` (plotly) | yes |
| see a static 3-D object (isosurface, cone field) | plotly `Isosurface` / `Mesh3d` / `Cone`, decimated (§5) | yes |
| explore 2+ parameters freely | `live(...)` ipywidgets, **plus** a slider_figure for the page | kernel only |
| manipulate a phenomenon with a guided story, or orbit a rich 3-D scene | an explainer or standalone scene (skills `interactive-viz`, `viz3d`) | yes |

## 2. House style (`fluidpy.core.style`)
- The setup cell calls `setup_notebook()` → `use_style()` (palette shared with the explainers), the plotly renderer
  (Colab: `colab`; elsewhere `plotly_mimetype+notebook_connected`), numpy print options; returns `FAST`.
- **Project term colours** (R4 §1.3, same in LaTeX `\color{}`, bars, curves, legends): tendency ∂/∂t slate · advection
  teal · Coriolis/rotation violet · pressure gradient orange · gravity/buoyancy brown · friction/diffusion rose ·
  forcing/heating gold · β indigo. Glyph pairs a/b: teal/orange.
- Axis labels carry units: `ax.set_xlabel("latitude [°N]")`, `"pressure [hPa]"`. Titles say the message ("The jet sits
  above the strongest temperature contrast"). Legends name parameter values.
- Save reusable figures: `savefig(fig, "ch02", "thermal_wind")` → `outputs/ch02/thermal_wind.png` (git-ignored).
- One idea per figure; two panels only when comparing.

## 3. Maps, sections and colour (AOFD)
- **Projections used** (cartopy): `SouthPolarStereo` / `NorthPolarStereo` (vortex, sea ice, Southern Ocean — with the
  circular boundary `mpath.Path` recipe), `Robinson` and `Mollweide` (whole globe; Mollweide is equal-area),
  `Orthographic(central_longitude, central_latitude)` (globe view, ocean basins), `PlateCarree` (lat–lon; always pass
  `transform=ccrs.PlateCarree()` for data). Coastlines from Natural Earth through cartopy (cache in `CARTOPY_DATA_DIR`
  on G:). Gridlines labelled, every 30° (15° for regional).
- **Colour maps**: perceptually uniform only. Sequential `cmocean.cm.thermal / haline / dense / deep / speed / amp` or
  `viridis / cividis`; diverging `cmocean.cm.balance / curl / delta` **centred on 0 with a symmetric range** for anomalies,
  streamfunctions and winds. Never `jet`, `rainbow`, `hsv` (except the labelled bad example in Ch. 0, `viz:badexample`).
  Never encode sign by hue alone: negative contours dashed, the zero contour bold, interval stated in the caption.
- **Vertical axes**: pressure decreasing upward (`ax.invert_yaxis()`), log-p with a right-hand z* = −H ln(p/p₀) axis
  (H = 7 km stated); ocean depth downward; latitude S→N left to right.
- **Captions** state product, period, base period (anomalies), unit, projection, streamfunction sign convention, and end
  with the registry credit line; substitutions say "observed analogue" / "model analogue"; pseudo-data figures carry the
  stamp "ILLUSTRATIVE — synthetic data".
- Hemisphere: never write "clockwise" without the hemisphere and viewpoint; prefer cyclonic/anticyclonic.

## 4. Animations (`fluidpy.core.anim`)
```python
from fluidpy.core.anim import animate, show_animation
fig, ax = plt.subplots(figsize=(6.5, 3.2))              # keep ≤ 7×4 in
(line,) = ax.plot(x, eta(x, 0))                         # draw the first frame once
def update(i):                                          # called for every frame i
    line.set_ydata(eta(x, i * dt))                      # move the surface to time t = i·dt
    return (line,)
show_animation(animate(update, frames=60 if not FAST else 30, fig=fig, interval=50))
```
- `player="video"` (MP4, ~10× smaller) for smooth transients; `player="frames"` when stepping matters.
- ≤ 120 frames, dpi ≤ 80, fixed axis limits, one idea per cell; follow with What you see / How to read it / What would
  change if. For a 2–3-minute narrated story, that is a movie (skill `motion-graphics`), not a notebook animation.

## 5. Plotly figures that survive publishing (`fluidpy.core.interact`)
- `slider_figure(...)`: ≤ 40 steps × ≤ 4 traces × ≤ 400 points (~200 kB); fixed axis ranges.
- `animate_figure(frame_fn, times, …)` gives Play/Pause + a time slider without a kernel.
- **3-D size limits**: `go.Isosurface` / `go.Volume` on ≤ 40³ points (or precompute with
  `skimage.measure.marching_cubes` and ship a `go.Mesh3d` decimated to ≤ 20 k triangles); `go.Cone` ≤ 1 500 arrows;
  `go.Surface` ≤ 150 × 150; **≤ 3 MB per figure** and ≤ 2 such figures per page; `height=520`. Base map on a 3-D surface
  from the cartopy Natural Earth raster (public domain). When orbiting and linked views matter, use a three.js scene
  instead (skill `viz3d`).

## 6. Live widgets (kernel only)
`nb.live(src)` tags the cell `live-only`; inside use `fluidpy.core.interact.live(fn, a=(0, 1, 0.05), …)` with
`continuous_update=False`. The page shows a "run it in Colab" note, so never make a live cell the only way to see an idea.

## 7. Budgets
Whole notebook < 6 min on the laptop (use `FAST`), page < 15 MB, each animation < 6 MB, plotly 3-D < 3 MB, derived data
read by figures ≤ 10 MB per file. No base64 data blobs other than figures/animations.

## 8. Lessons (the knowledge-keeper appends; one line each, dated by chapter)
- (fluidpy ch01) A `live` widget is always paired with a static figure or a `slider_figure` carrying the same idea.
- (fluidpy ch01) When a quantity has two sign conventions, put both values in the trace name or legend
  ("dT/dz = −6.5 K/km ⇔ Γ_met = 6.5 K/km") so they move together — AOFD rule: compute with Kundu Γ = dT/dz, always
  show met Γ = −dT/dz too.
- (fluidpy ch01) Look at every saved figure image before the review (overlapping labels, unexplained letters).
- (fluidpy ch01) `player="frames"` for processes the reader should stop at; `"video"` for smooth transients; dpi ≤ 80.
