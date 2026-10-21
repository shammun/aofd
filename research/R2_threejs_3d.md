# R2 · three.js 3-D for the Vallis (AOFD 2nd ed.) explainers

*Research note, 2026-10-20. Scope: what 3-D the fluidpy machinery has today, what three.js offers now, how to build
each phenomenon the user listed, how to couple it to tested physics, how to keep it fast and auditable, and a proposed
scene-kit (`assets/viz3d.js`) with two agent roles and a review checklist. Nothing here copies book content: book
figures are referred to by number only, and every proposed scene is our own drawing generated from equations or data.*

---

## 0 · Summary

1. fluidpy's 3-D hook `Viz.three` is used by 3 of ~136 explainers; 5 more chose a 2-D canvas projector (offline-safe).
2. It loads three.js **r128 (2021) as a UMD global**: no modern addons, no dispose, no context-loss handling, no lazy init.
3. Current three.js is **0.186.1** (24 Sep 2026), ES modules only; load via an **import map** pinned to jsDelivr.
4. Default to **WebGLRenderer + GLSL**; WebGPURenderer + TSL is opt-in for 10^6-particle compute (auto WebGL2 fallback).
5. All wish-list phenomena reduce to: globe + DataTexture field, InstancedMesh arrows, Points tracers, displaced
   surfaces, ping-pong GPGPU, streamtubes, marching cubes, cut planes, CSS2D labels.
6. Honesty as in fluidpy: JS/GLSL physics mirrors a tested Python function, proved by `selftest()` parity rows
   (+ GPU read-back rows).
7. One context per explainer, lazy via IntersectionObserver, released off-screen (~16 live contexts per process).
8. Headless audits need `--use-angle=swiftshader --enable-unsafe-swiftshader` now (no silent SwiftShader fallback).
9. Catchy-but-honest: camera-preset stories, labelled vertical exaggeration, provenance chips, cmocean LUTs, CVD-safe.
10. Proposed `assets/viz3d.js` kit + `viz3d-builder` / `viz-integrator` agents + a 3-D review checklist (§8).

---

## 1 · Current fluidpy 3-D state and lessons

### 1.1 What exists

- **`Viz.loadThree()` / `Viz.three(view, opt)`** (`assets/viz_lib.js` §6c, ≈ line 723): injects `three.js/r128/three.min.js`
  (cdnjs, then jsDelivr `three@0.128.0`, 10 s timeout); puts a WebGL canvas under the view's 2-D canvas (2-D stays on top
  for labels); `WebGLRenderer({antialias, alpha})`, DPR ≤ 2, ambient + directional light, a hand-written θ/φ/r orbit
  with wheel zoom, `pick(ev)` (Raycaster), `project(v3)` → pixels, ResizeObserver; render on demand. Offline →
  `.viz-3d-fallback` note, the rest of the explainer still works.
- **Reference** `templates/viz_example_3d.html`: vibrating membrane (vertex Y displacement + `computeVertexNormals()`),
  click-to-pick → `app.set({px, py})`, linked 2-D cross-section, transport, presets, inspector, selftest rows.
- **Users:** only `viz/ch05/vortex_tubes_cannot_end.html` and `viz/ch16/dean_curved_pipe.html` (the 136 `grep THREE` hits
  are the inlined library).
- **Canvas projector (no WebGL)**, local copies in `ch05/kelvin_material_loop`, `ch05/vorticity_stretching_tilting`,
  `ch11/lorenz_attractor` (`projector`), `ch13/ekman_spiral` (`drawSpiral`), `ch14/downwash_induced_drag` (`makeCam`):
  rotate → orthographic project → depth-sort → draw on the 2-D canvas with drag-to-orbit.

### 1.2 Lessons recorded in `knowledge/viz_patterns.md` (relevant to 3-D)

- **Canvas projector beats WebGL for line scenes** (ch11 E9, ch14 E6: "no WebGL dependency, no fallback page, the same
  picture in the notebook frame"). It was proposed for promotion four times (`Viz.proj3(view, {theta, phi, scale})`,
  "the offline path of `Viz.three`") and never promoted — **promote it as the guaranteed fallback** of the new kit.
- **One cursor, several linked views** (ch13 E3 Ekman: a depth cursor moving down the 3-D spiral, the hodograph and the
  transport integral) is the best-rated 3-D-ish pattern: the 3-D view earns its place only when linked to 2-D readings.
- **Labels sized from the view, not the window** (ch15 open item: "size decisions from `v.w`/`v.h`… on views < 420 px
  keep one label"). In 3-D: label count must depend on projected size.
- **Three clocks disagreed while a solver spun up** (ch10 E7): transport time, view title and readout must be one
  clock — critical for GPU simulations that lag.
- **Live TeX strings: `String.raw` for every TeX-bearing JS string** (ch16; `\f`, `\r` ate equations silently).
- **No live `eq` card in a walkthrough step on portrait phones** (re-measure after live fill) — a 3-D view resizing
  under a pager is the same hazard.
- **Three stacked views do not fit a 360×640 phone** — show the 3-D view plus one 2-D view, swap by step.
- **A reviewer drives the walkthrough with real clicks** (ch14) — for 3-D also real drags/wheels.

### 1.3 Gaps to close before ambitious 3-D

| Gap | Consequence |
|---|---|
| r128 UMD global | No modern addons, no WebGPU/TSL, no `three/addons/*`; stuck on a 5-year-old API (colour management, lights in physical units changed in r155) |
| Render on demand only, no rAF ownership | Fine for static scenes; particle/GPGPU scenes need a fixed-step loop that the transport owns |
| No `dispose()` / `webglcontextlost` handler | Leaks on page with 10 explainers; a lost context leaves a black rectangle |
| No lazy init | All explainers on a published page would create contexts at load if 3-D becomes common |
| Hand-made orbit | No damping, no pan, no touch pinch, no keyboard; reinventing OrbitControls |
| `tools/shot.py` launches headless Edge/Chrome with no GL flags | On Chrome 139+/Edge 144+ WebGL may fail headless → audits screenshot the fallback note and still PASS |
| No audit of "is the 3-D actually drawn" | A blank canvas passes lint and shot |

---

## 2 · three.js today

### 2.1 Version and packaging (checked against the npm registry and jsDelivr on 2026-10-20)

- **Latest stable: `three@0.186.1`** (released 2026-09-24; 0.186.0 on 2026-09-08; 0.185.1 on 2026-07-01). It satisfies
  the project rule "exact version at least two weeks old". Pin `0.186.1` and bump deliberately once per book part.
- `build/` now ships **ES modules only**: `three.module.js` (663 KB, imports `./three.core.js`, 1.46 MB),
  `three.webgpu.js` (2.3 MB, also imports `./three.core.js`, so WebGL and WebGPU builds share one core),
  `three.tsl.js`, `three.webgpu.nodes.js`, and a 631-byte `three.cjs` stub. jsDelivr auto-minifies
  (`three.module.min.js` ≈ 393 KB raw / 90 KB gzip; `three.core.min.js` ≈ 416 KB / 105 KB gzip).
- **cdnjs** has `three.js/0.186.1/` with the ten build files only (no `examples/jsm`), so addons must come from
  **jsDelivr** (`cdn.jsdelivr.net/npm/three@0.186.1/examples/jsm/…`) or unpkg. Use one CDN for both core and addons, or
  two copies of the core will load and `instanceof` checks fail.
- Addons import the bare specifier `'three'` (e.g. OrbitControls: `import {…} from 'three'`), hence the **import map**.

Sources: <https://www.npmjs.com/package/three>, <https://www.jsdelivr.com/package/npm/three>,
<https://cdnjs.com/libraries/three.js>, installation manual <https://threejs.org/manual/#en/installation>.

### 2.2 Import map and loading from a classic script

viz_lib is a classic (non-module) script inlined into each explainer. A classic script may call dynamic `import()`, and
the import map resolves the bare names. The map must exist in the document **before the first module load**, so
`tools/viz_inline.py` should write it into `<head>` of every explainer that declares `<meta name="viz:3d" content="1">`:

```html
<script type="importmap">
{ "imports": {
  "three":         "https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.min.js",
  "three/webgpu":  "https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.webgpu.min.js",
  "three/tsl":     "https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.tsl.min.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.186.1/examples/jsm/"
} }
</script>
```

```js
// inside viz3d.js (classic script): load once, cache the promise, time out to the canvas fallback
Viz3D.load = () => P || (P = Promise.race([
  Promise.all([import('three'), import('three/addons/controls/OrbitControls.js'),
               import('three/addons/renderers/CSS2DRenderer.js')])
    .then(([THREE, oc, css]) => ({ THREE, OrbitControls: oc.OrbitControls, CSS2DRenderer: css.CSS2DRenderer })),
  new Promise(r => setTimeout(() => r(null), 12000))]).catch(() => null));
```

Notes: import maps work in `srcdoc` iframes (the local Jupyter path of `show_viz`) and in Colab's `src` iframes; only
one map per document is honoured reliably, so the kit owns it. Load optional addons lazily (`MarchingCubes` only
when an isosurface is requested). Keep the **`Viz.three` r128 path for the old chapters** (no regressions) and make the
new kit a separate opt-in.

### 2.3 Addons relevant to us (all present in 0.186.1 `examples/jsm/`)

| Addon | Use here |
|---|---|
| `controls/OrbitControls.js` (Arcball/Trackball too) | Replace the hand-made orbit: damping, pinch, keys, polar clamp; no pan on phones |
| `lines/Line2.js`, `LineSegments2`, `LineMaterial` (+ `lines/webgpu/`) | Fat pixel-width lines: coastlines, streamlines, the Ekman spiral (WebGL lines are 1 px) |
| `renderers/CSS2DRenderer.js` | HTML/KaTeX labels pinned to 3-D points |
| `postprocessing/EffectComposer.js`, `UnrealBloomPass`, `OutputPass` | Subtle highlight of the selected object only (WebGL path) |
| `misc/GPUComputationRenderer.js` | Ping-pong float textures: tracers, shallow water, dye (WebGL only) |
| `objects/MarchingCubes.js` | Live isosurfaces (PV, density), res 28–64 |
| `shaders/VolumeShader.js` + core `Data3DTexture` | Ray-marched "fog" volumes; slice planes |
| `math/Lut.js`, `utils/BufferGeometryUtils.js` | Colour LUT helper; merging static glyphs |
| `capabilities/WebGL.js`, `WebGPU.js`; `inspector/` | Fallback ladder checks; dev-time draw-call inspector |

Core classes: `BufferGeometry`, `InstancedMesh`, `BatchedMesh`, `Points`, `ShaderMaterial`, `DataTexture`,
`WebGLRenderTarget` (float), `TubeGeometry`, `Raycaster`, `Timer` (now in core). Avoid `TextGeometry` (heavy fonts).

### 2.4 WebGPU vs WebGL, and TSL

- **Browser status (late 2025 → 2026):** WebGPU on by default in Chrome/Edge desktop (since 113) and Android 12+
  (since 121, Qualcomm/ARM GPUs); Safari 26 (macOS Tahoe, iOS/iPadOS 26); Firefox 141+ on Windows and 145+ on Apple
  Silicon macOS; Linux is still partial (Chromium on Intel Gen12+, Firefox pending) — sources
  <https://web.dev/blog/webgpu-supported-major-browsers>, <https://github.com/gpuweb/gpuweb/wiki/implementation-status>.
- **three.js:** `WebGPURenderer` (from `three/webgpu`) is production-usable and **falls back automatically to a WebGL 2
  backend** when WebGPU is missing (`new WebGPURenderer({ forceWebGL: true })` forces it — the source has
  `getFallback`). Initialise with `await renderer.init()`; `renderAsync()` is deprecated since r181; post-processing
  is `THREE.RenderPipeline` (the old `PostProcessing` was renamed in r183).
- **TSL (Three Shading Language)** writes shaders as JS node graphs (`import { Fn, uniform, texture, vec3, … } from
  'three/tsl'`) and compiles to WGSL or GLSL; compute shaders (`Fn(...)().compute(N)`, storage buffers) give real GPU
  compute for 10^6 particles on WebGPU. Docs: <https://threejs.org/docs/pages/TSL.html>,
  <https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language>; example
  <https://threejs.org/examples/webgpu_compute_particles.html>.
- **Classic GLSL `ShaderMaterial` does not run on WebGPURenderer** (it needs node materials), and
  `GPUComputationRenderer`/`EffectComposer` are WebGL-only. So the choice is per kit, not per scene.

**Decision for AOFD:** default to **WebGLRenderer (WebGL 2)** with GLSL ShaderMaterials and GPUComputationRenderer:
it runs in every target (old lab laptops, Colab iframes, headless SwiftShader audits), its GLSL is easy for reviewers
to read next to the maths, and 10^5 tracers are well within its reach. Write the kit so a scene module could be
re-implemented in TSL later (keep the physics in small pure functions, keep shaders short). Revisit WebGPU-by-default
when Linux/Firefox ship and headless WebGPU is reliable.

**Fallback ladder:** WebGL2 → WebGL1 (rare) → `Viz.proj3` canvas projector drawing the same lines/points (no surfaces)
→ static note. The explainer's 2-D views, Explain, Derivation, Code and quiz work at every rung.

---

## 3 · Technique per phenomenon

Common building blocks (kit names in brackets, §8):

- **Globe** [`globe`]: `SphereGeometry(1, 192, 96)` (u ↔ longitude, v ↔ latitude), field as an equirectangular
  `DataTexture` (Float or `UnsignedByte` + scale/offset uniforms) sampled through a 1-D **LUT texture**; graticule as
  `LineSegments` every 30°; coastlines from Natural Earth via `world-atlas@2.0.2/land-110m.json` (55 KB TopoJSON,
  21 KB gzip; decode with `topojson-client@3.1.0` once in Python and embed as quantised int16 lon/lat pairs ≈ 25 KB)
  drawn with `Line2` lifted 0.2 % above the surface. 50 m data (545 KB) is too heavy to inline.
- **Arrows** [`vectorGlyph`]: one `InstancedMesh` of a merged cone+cylinder unit arrow; per instance set
  position/orientation (quaternion from +Y to v̂)/length (scale) and colour (`setColorAt`). 10^3–10^4 arrows at 60 fps.
- **Tracers** [`particles`]: `Points` + `ShaderMaterial` with attributes `position`, `age`, `seed`; CPU RK2/RK4 for
  ≤ 5·10^4, GPGPU (positions in a float texture, `GPUComputationRenderer`) for 10^5–10^6; trails by fading an
  accumulation render target (the mapbox `webgl-wind` trick) or by short history ribbons.
- **Surfaces** [`fieldSurface`]: plane or sphere grid with vertex displacement in the vertex shader from a field texture
  (η, thermocline depth, isopycnal height); normals by finite differences in the shader so no CPU `computeVertexNormals`.
- **Volumes** [`isosurface`, `cutPlane`]: `MarchingCubes` (CPU, res ≤ 64) for one or two isovalues; `Data3DTexture` +
  slice planes (a plane mesh whose fragment shader samples the 3-D texture) for sections; ray-march only for "fog".
- **Layers** [`layerStack`]: N translucent isopycnal sheets (vertex-displaced planes) with `depthWrite=false` and sorted
  draw order; or opaque sheets with a cut-away wedge.
- **Labels** [`labels`]: CSS2DRenderer for KaTeX labels (≤ 8 visible), canvas-texture sprites for many small tags.

### 3.1 Table: phenomenon → technique → the interaction that teaches

| # | Phenomenon (Vallis topic) | Scene and technique | Interaction that makes it click |
|---|---|---|---|
| 1 | **Coriolis on a rotating globe** (Ch. 2) | Spinning globe, a puck launched north; inertial path vs Earth-frame path (`Line2`) from the rotating-frame ODE in JS | Toggle **inertial ↔ co-rotating** camera with the same launch; latitude slider shows f = 2Ω sin φ → 0 at the equator; Ω × u cross-product glyph at the puck (§3.3) |
| 2 | **Taylor columns** (Ch. 2–3) | Rotating cylinder tank (alpha 0.15), floor obstacle, dye particles diverted around the column; flow from a Proudman/QG model extruded in z | Rossby-number slider: column sharp at Ro ≪ 1, smeared as Ro grows; identical arrows on 3 stacked planes = ∂u/∂z = 0 |
| 3 | **Rossby waves** (Ch. 6) | β-plane `fieldSurface`, ψ evaluated in the vertex shader with ω = −βk/(k² + l² + L_d⁻²); Gaussian packet envelope | Crests drift west while a short-wave packet goes east; linked 2-D ω(k) diagram with c_p and c_g arrows |
| 4 | **Kelvin waves** (Ch. 3) | η = η₀ e^{−y/L_d} cos(kx − ct) on a coastal strip or equatorial band; along-shore-only arrows | Hemisphere toggle (coast stays on the right in the NH); the refused direction drawn growing offshore (ch13 pattern) |
| 5 | **Poincaré waves / inertial oscillations** (Ch. 3) | Displaced sheet + particle orbit ellipses from the linear solution | k slider morphs gravity orbits into inertial circles; term bars for ω² = f² + gHk² |
| 6 | **Rotating-annulus baroclinic instability** (Ch. 9) | Annulus, warm outer / cold inner wall; two-layer QG on a polar grid (or Eady modes) as interface surface + dye | Rotation slider walks a 2-D regime diagram (axisymmetric → steady waves → irregular); link to the MIT tank movies |
| 7 | **Hadley/Ferrel cells, jets** (Ch. 11, 14–15) | Globe with a cut-away wedge: ψ(φ, p) on the face (reanalysis or Held–Hou); jets as `TubeGeometry` coloured by u; tracers circulating | Season slider shifts the ITCZ and cell strengths; Held–Hou angular-momentum u(φ) vs observed jet latitude |
| 8 | **Gyres + western boundary currents** (Ch. 19) | β-plane basin with Stommel/Munk ψ per vertex, 10^4 CPU tracers, wind-stress arrows above, δ_M = (A_H/β)^{1/3} strip highlighted | β → 0 removes the WBC; curl glyphs per column show the Sverdrup interior |
| 9 | **Ekman spiral & pumping** (Ch. 5) | Spiral of arrows with depth (`Line2` + InstancedMesh), live transport vector; columns with w_E = ẑ·∇×(τ/ρ₀f) up/down | The proven ch13 one-cursor pattern in true 3-D; a cyclonic wind patch lifts the thermocline surface below |
| 10 | **Thermal wind** (Ch. 2, 5) | Sloping isotherm sheets + zonal arrows growing with height, from ∂u/∂z = −(g/fT₀)∂T/∂y | Steepen ∂T/∂y → shear grows; vector-form glyph ẑ × ∇T |
| 11 | **Isopycnals & stratification** (Ch. 2, 21) | `layerStack` from WOA climatology or a model: doming in gyres, outcropping in the Southern Ocean, N² colouring | Peel layers; a parcel moving along vs across an isopycnal (adiabatic vs diapycnal) |
| 12 | **PV isosurfaces / polar-vortex split** (Ch. 4, 17) | Marching cubes on a lon–lat–θ PV volume (72×18×12 uint8 ≈ 15 KB per day) over a sudden-warming event; θ-surface cut plane | Scrub the days and watch one lobe become two; grid/smoothing stated |
| 13 | **ENSO thermocline tilt** (Ch. 22) | Equatorial Pacific slab: SST on top, 20 °C isotherm surface below, trade-wind arrows; Kelvin pulse as a moving bump | La Niña / neutral / El Niño composites; wind slider relaxes the tilt; Bjerknes loop in 4 steps |
| 14 | **3-D overturning pathways** (Ch. 21) | Our own 3-D residual-overturning scene (cf. Fig. 21.30, not copied): Atlantic basin + Southern Ocean channel, upper/lower cells as streamtubes from the `aofd` residual ψ(y, z) extruded zonally, tracers seeded at outcrops; plus the Stommel two-box model (cf. Fig. 21.6) as two stirred tanks with overflow/capillary pipes and a Ψ arrow that flips | Click a surface point: u·∇b sign (gain/loss), Ekman transport τ × ẑ/ρ₀f and the "where from / where to" trajectory; two-box Ψ linked to its bifurcation diagram |
| 15 | **Data maps on a globe** | Monthly reanalysis DataTexture (144×73 uint8 ≈ 10.5 KB), LUT shader, wind particles in lon–lat with the cos φ metric | Month slider, anomaly ↔ total, hover inspector with value, units, source |

### 3.2 Recipes for the heavy techniques

- **DataTexture fields.** Quantise to `Uint8`/`Uint16` with `scale`/`offset` uniforms and a NaN code for land;
  `RepeatWrapping` in longitude, clamp in latitude, linear filtering. Pack months into an atlas and lerp two months in
  the shader for smooth scrubbing with no CPU work.
- **Colour maps as shader LUTs.** Export 256×1 RGB tables at build time from `cmocean` (thermal, haline, dense, deep,
  speed; diverging balance, curl, delta) and matplotlib (viridis, cividis) — 768 bytes each — upload as `DataTexture`
  (sRGB) and sample `texture2D(lut, vec2(clamp((v-lo)/(hi-lo),0.,1.),.5))`. The legend strip uses the same table.
- **Points tracers (10^4–10^5, CPU).** `Float32Array` positions updated per fixed step (RK2 in the analytic field),
  round sprites via `gl_PointCoord`, colour by age or carried tracer, randomised lifetimes, `setDrawRange` instead of
  reallocating. Gridded bilinear velocity at 10^5 is too slow on phones → GPGPU.
- **GPGPU advection (10^5–10^6).** `GPUComputationRenderer` position texture (512² ≈ 2.6·10^5 particles), velocity as
  `DataTexture`/`Data3DTexture`, RK2 in the fragment shader, hash-based respawn; `Points` read positions in the vertex
  shader; trails by fading an accumulation target (×0.96 per frame) as in mapbox `webgl-wind`. On a globe store (λ, φ)
  with dλ/dt = u/(a cos φ), dφ/dt = v/a, or advect in 3-D Cartesian to avoid the pole singularity.
- **Ping-pong shallow-water solver.** Two float render targets for (h, u, v); a momentum pass
  (u ← u + Δt(fv − g ∂h/∂x), …) and a continuity pass; f, β as uniforms; sponge boundaries; rendered as a
  `fieldSurface`. Kernels of ~30 GLSL lines sit next to the equations. Parity: the same scheme on a small CPU grid in JS
  and Python, plus GPU read-back at 3–5 probes (`readRenderTargetPixels`, FloatType).
- **Vertex-displacement surfaces.** `position + normal * field(uv) * exag` in the vertex shader, normals by central
  differences in the shader, LUT colour, and anti-aliased isolines in the fragment shader (`fract(v/Δ)` with `fwidth`).
- **Streamtubes.** RK4 streamline at fixed arc length → `CatmullRomCurve3` → `TubeGeometry`; beads moving at a speed
  ∝ |u| (the honest cue for fast flow). For residual overturning, tubes follow ψ contours with a small zonal drift.
- **Isosurfaces.** `MarchingCubes` (res ≤ 64) when the isovalue or time changes; for fixed volumes precompute with
  `skimage.measure.marching_cubes` in Python and ship indexed triangles (20–60 KB) — cheaper and parity-checkable
  (enclosed volume or area as a selftest row).
- **Globe grid and coastlines.** Graticule every 30°, equator emphasised, CSS2D labels on the limb; coastlines as
  `LineSegments2` lifted 0.2 % above the surface. Rotate the camera (OrbitControls), and the planet only when the physics
  says so — never both, or the reader cannot tell the frame.
- **Cut planes.** `localClippingEnabled` + `clippingPlanes` on solids, plus a separate plane mesh textured with the
  section field so the interior reads as data, linked to a 2-D section view with axes and units.

### 3.3 Vector glyphs for dot and cross products (the "where does the water go" layer)

The user's key ask: dot and cross products visibly showing flow. A uniform glyph language, used in every chapter:

| Operation | Glyph | Visual rule |
|---|---|---|
| **a · b** (e.g. advective tendency u·∇b) | Arrows a (teal) and b (orange) from one point; the **shadow** of a on b's line drawn as a thick segment; a signed bar beside it | Bar length = a·b in units; green if it moves water toward higher b (lighter), purple if toward denser; zero when a ⟂ b (flow along an isopycnal: "adiabatic") |
| **a × b** (e.g. Coriolis −f ẑ × u, Ekman transport τ × ẑ / ρ₀f) | a, b arrows; translucent **parallelogram** spanned by them; a curled arc from a to b (the "fingers"); result arrow ⟂ to the plane, length = area | Hand icon optional; arc direction + result direction obey the right-hand rule; magnitude readout = |a||b| sin θ with the live θ; flip the hemisphere → f changes sign → result flips |
| **∇ × τ** (wind-stress curl → Ekman pumping) | A small square loop on the surface with τ arrows on its four sides; the circulation ∮τ·dl coloured along the loop; a vertical arrow at the centre (up = upwelling) | Shrinking the loop converges to the curl (Stokes); w_E = curl_z(τ/ρ₀f) sign shown at many columns of an InstancedMesh |
| **∇b** with isosurface | Normal arrows on an isopycnal sheet | Shows "up-gradient"; with u arrows, the dot-product glyph above explains cross-isopycnal flow |
| **f × u balance** (geostrophy) | Pressure-gradient arrow and Coriolis arrow head-to-tail, summing to ~0 (residual arrow = acceleration) | Term bars as in ch13 E1 but in 3-D at a picked point |

Implementation: one `VectorGlyph` class owning 2–4 arrows (InstancedMesh shared with the field arrows), a parallelogram
`BufferGeometry` (4 vertices, updated), an arc (`Line2` of 24 points), and a CSS2D label with KaTeX for the formula with
live numbers, e.g. $\mathbf{u}\cdot\nabla b = 0.12 \times 3.1\times10^{-5}\cos 72^\circ$. The same glyph drives a
"**where from / where to**" probe: click a point → integrate a trajectory backward (dashed, "came from") and forward
(solid, "goes to") through the steady residual field, with ticks every year of travel time.

### 3.4 Lighting and materials

- Use `MeshStandardMaterial` with `roughness 0.6–0.8`, `metalness 0`; one hemisphere light (sky/ground tints) + one
  directional key light; avoid shadows (cost, and they add false "depth cues" in data scenes).
- For data surfaces prefer **unlit** colour (`MeshBasicMaterial` or a custom shader) plus a subtle shading term
  (`0.75 + 0.25·max(dot(n, L), 0)`) so colour stays faithful to the LUT and legend. Lighting that changes perceived
  colour of a data value is dishonest.
- Water in tanks: alpha 0.12–0.2, `depthWrite=false`, rendered last; dye/tracers additive-blended only on dark
  backgrounds (on light theme use normal blending, or additive saturates to white).
- Colour management: `renderer.outputColorSpace = SRGBColorSpace` (default since r152); LUT textures marked sRGB.
- Theme: read the viz CSS tokens (`--viz-bg`, `--viz-ink`) at init and on theme toggle; background colour from the
  token, never hard-coded black (the explainers have light and dark themes).

---

## 4 · Coupling physics to visuals

### 4.1 Parity: JS/GLSL physics mirrors a tested Python function

The fluidpy contract carries over unchanged (`aofd/` package instead of `fluidpy/`):

1. Every formula in a scene is a **pure JS function** with the same name and argument order as its Python twin, e.g.
   `rossbyOmega(k, l, beta, Ld)` ↔ `aofd.ch06_rossby.rossby_omega(k, l, beta, Ld)`, `ekmanVelocity(z, tau, f, Az)` ↔
   `aofd.ch05_ekman.ekman_velocity(...)`, `munkPsi(x, y, ...)`.
2. `selftest()` rows: `{name, js: rossbyOmega(1e-6, 0, 2e-11, 1e6), py: 'ch06.rossby_omega(1e-6, 0, 2e-11, 1e6)', rtol: 1e-9}`
   — evaluated by `tools/shot.py` as today.
3. **GPU physics gets a third leg**: a selftest row that renders N steps on the GPU and reads back probe texels
   (`readRenderTargetPixels`, FloatType) and compares to the CPU JS mirror (which is itself matched to Python). Float32 on
   GPU → rtol 1e-4 – 1e-5, stated in the row; never loosen to pass.
4. **Drawing selftests** (ch14 E9 lesson): rows that test the picture — e.g. the cross-product glyph's result arrow is
   orthogonal to both inputs (|r·a| < 1e-9), the Ekman transport arrow is at 90° to the wind, the isosurface encloses
   the volume computed in Python ±2 %.
5. Data scenes: a row checks a few field values decoded from the embedded texture against the Python array (catches
   quantisation and orientation bugs — lat flipped is the classic one).

### 4.2 Time: fixed-dt stepping decoupled from requestAnimationFrame

```js
// one clock: the transport owns model time; the scene renders whatever state that time implies
let acc = 0, last = performance.now();
function frame(now) {
  const wall = Math.min((now - last) / 1000, 0.1); last = now;      // clamp after tab switch
  if (app.playing) acc += wall * app.state.speed * SIM_PER_SEC;       // model seconds owed
  while (acc >= DT && steps++ < MAX_STEPS_PER_FRAME) { step(DT); acc -= DT; t += DT; }
  app.set({ t }, { silent: true });                                   // transport + readouts read the same t
  if (dirty) renderer.render(scene, camera);
  raf = requestAnimationFrame(frame);
}
```

- **Closed-form scenes** (waves, Ekman, Munk gyre, thermal wind): state = f(t), so scrubbing is exact and free.
- **Integrated scenes** (particles, shallow water, annulus): keep **checkpoints** every K steps (positions/fields
  copied into a ring buffer, or GPU targets copied) so scrubbing backward re-simulates from the nearest checkpoint;
  if the simulation lags the transport, the status says "computing … t = …" (ch10 E7 lesson) — never three clocks.
- **Deterministic seeds** (`mulberry32(seed)`) for particle spawns so screenshots and selftests are reproducible.
- Pause the loop when the view is hidden (tab not active, IntersectionObserver says off-screen, `document.hidden`);
  render on demand when paused (orbit, slider) — no idle 60 fps burn.

### 4.3 Linking 3-D to 2-D plots and sliders

- **One state object** (`app.state`) drives everything; the 3-D scene subscribes via `draw(g, s)` like the 2-D views.
- **Picking** writes state (`app.set({lon, lat})` or `{px, py}`), which updates a 2-D section/profile and the
  inspector; the 2-D view's cursor drag writes the same state, which moves a 3-D marker (ch13 "one cursor" pattern).
- **Walkthrough steps** can set camera presets (`camera: 'eastward-slice'`), visibility of layers, and the glyph shown;
  tweens of 600–900 ms with `prefers-reduced-motion` → instant cut.
- **Explain tab** numbers come from the same functions as the scene (one source of truth); the Code tab shows the
  Python call that reproduces the visible numbers (`{{K}}`-style live substitution, as in ch16 `dean_curved_pipe`).

---

## 5 · Performance and robustness

| Concern | Rule |
|---|---|
| Pixel ratio, draw calls | `setPixelRatio(min(DPR, 2))`, 1.5 on phones with many particles; ≤ 50 draw calls (InstancedMesh, merged statics, one `Points`) |
| Render on demand | Render on state/camera change; keep rAF only while playing or while OrbitControls damping is settling |
| Dispose | Traverse the scene disposing geometries, materials and their textures; dispose render targets and the renderer on teardown and on mode rebuilds; audit `renderer.info.memory` → 0 |
| Context loss | `webglcontextlost` → `preventDefault()`, stop loop, show "3-D paused — tap to restore"; `webglcontextrestored` → rebuild from the declarative scene description; test with `renderer.forceContextLoss()` |
| Many explainers per page | The chapter page embeds 5–10 explainers as `<iframe loading="lazy">` with an IntersectionObserver (`tools/publish_notebook.py`); same-origin iframes share a renderer process and Chrome keeps about **16 live WebGL contexts** (fewer on Android) before killing the oldest. So: one renderer per explainer (several 3-D views via `setViewport`/`setScissor`), created on first visibility (`rootMargin: 200px`), released (`dispose` + `forceContextLoss`) after 30 s off-screen |
| Notebook frames | `show_viz` uses `srcdoc` locally and GitHub Pages `src` on Colab; import maps and `import()` work in both; no CDN → canvas fallback |
| Mobile | OrbitControls touch, `touch-action: none` on the canvas only, particle count and marching-cubes resolution scaled to viewport area and `hardwareConcurrency`, no bloom |
| Headless audits | Chrome ≥ 139 / Edge ≥ 144 no longer fall back to SwiftShader silently: launch audit browsers with `--use-angle=swiftshader --enable-unsafe-swiftshader` (audit only); under `?audit=1` create renderers with `preserveDrawingBuffer: true`, pause after the first frame, emit `viz3d:ready`; assert context alive and canvas not blank (pixel variance), so a fallback note can no longer PASS |
| Determinism | Seeded RNG, fixed t in audit mode; compare SwiftShader shots by eye, not pixel-exact |
| Reduced motion | `prefers-reduced-motion` → no auto-rotate, camera cuts instead of tweens, particles start paused |
| Size budget | Explainers are already 180–245 KB inlined; three.js stays on the CDN (~200 KB gzip, cached once per page). Inlined data ≤ 150 KB (coast 25 KB, LUTs 2 KB, 12 months at 2.5° uint8 ≈ 126 KB + base64), file ≤ 600 KB; larger data as `viz/data/*.bin` fetched with an offline note |
| Hitches, precision | `renderer.compile(scene, camera)` at init; `highp` in compute shaders; globe in units of Earth radius (float32 jitter), physics in SI on the CPU |

## 6 · Design guidance: catchy but honest scientific 3-D

1. **Earn the third dimension**: use 3-D where the physics is 3-D (Taylor columns, Ekman spiral, overturning, PV
   volumes, Coriolis on a sphere). A non-height field drawn as height says so ("surface height = ψ, not sea level").
2. **Label the exaggeration**: badge "vertical ×1000 (4 km deep, 4000 km wide)" with a true-scale toggle for one
   wow-moment; likewise "1 s = 5 days" and "tracers 10⁵× faster than the water".
3. **Provenance chips** per layer: *computed* (aofd function name), *schematic* (ours, idealised), *data* (dataset,
   period, resolution, licence).
4. **Camera presets as story beats** ("from space", "along the equator", "into the western boundary", "under the
   surface", "meridional slice"), eased tweens in the walkthrough, free orbit + "reset view" always; auto-rotate only on
   the cover state.
5. **Progressive reveal**: one layer per walkthrough step, each with its equation in full (LaTeX + number); last step
   asks for a prediction before releasing a slider.
6. **Annotate in the scene**: ≤ 6 CSS2D labels (fewer on phones), east/north/up triad, scale bar.
7. **Colour with meaning, CVD-safe**: sequential cmocean/viridis, diverging centred on 0, legend with units, never jet;
   glyph pairs teal/orange; sign also by direction or dash; check with DevTools vision-deficiency emulation.
8. **Motion tells the truth**: particles move with the computed (scaled, labelled) velocity; glow only marks selection;
   no decorative turbulence unless labelled "illustrative".
9. **Phone first**: one 3-D + one 2-D view, big preset chips, no text below 12 px, one key number in the status.
10. **Fail gracefully**: without WebGL the canvas projector draws the key lines and every tab still teaches.

---

## 7 · Inspiring references

- **earth** (Beccario) <https://earth.nullschool.net> — wind/ocean particles on a globe, minimal UI, legends with units.
- **mapbox webgl-wind** <https://github.com/mapbox/webgl-wind> — GPU particles with fading trails; our tracer template.
- **NASA SVS** <https://svs.gsfc.nasa.gov>: *Perpetual Ocean* <https://svs.gsfc.nasa.gov/3827>, *Gulf Stream currents
  and SST* <https://svs.gsfc.nasa.gov/3913> — flow + scalar, camera choreography. **NOAA Science On a Sphere**
  <https://sos.noaa.gov>.
- **Weather in a Tank** (MIT, Marshall & Illari) <https://weathertank.mit.edu> — Taylor columns, Ekman layers,
  baroclinic annulus, general circulation: our tank scenes should mirror and link to these.
- **three.js examples** <https://threejs.org/examples/webgl_gpgpu_water.html>,
  <https://threejs.org/examples/webgpu_compute_particles.html> (also gpgpu birds/protoplanet).
- **WebGL Water** (Evan Wallace) <https://madebyevan.com/webgl-water/>; **WebGL Fluid Simulation** (Dobryakov)
  <https://github.com/PavelDoGreat/WebGL-Fluid-Simulation>; **Shadertoy** <https://www.shadertoy.com> (study only).
- **globe.gl** <https://globe.gl> — globe-layer API ergonomics; **Observable d3 globes**
  <https://observablehq.com/@d3/world-tour>; **Climate Reanalyzer** <https://climatereanalyzer.org>.
- Data: **Natural Earth** <https://www.naturalearthdata.com> (public domain;
  <https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json>), **cmocean** <https://matplotlib.org/cmocean/>,
  NOAA PSL reanalysis/OISST (public domain) <https://psl.noaa.gov>, ERA5 (Copernicus licence, attribution)
  <https://cds.climate.copernicus.eu>, World Ocean Atlas (NOAA NCEI). Embed only small derived fields with a source chip.
- Platform: TSL <https://threejs.org/docs/pages/TSL.html>; WebGPU status <https://web.dev/blog/webgpu-supported-major-browsers>,
  <https://github.com/gpuweb/gpuweb/wiki/implementation-status>; SwiftShader
  <https://chromium.googlesource.com/chromium/src/+/main/docs/gpu/swiftshader.md>, deprecation
  <https://groups.google.com/a/chromium.org/g/blink-dev/c/yhFguWS_3pM/m/oLrB5up_BwAJ>,
  <https://discourse.threejs.org/t/swiftshader-is-going-away-what-to-do/76140>; Playwright launch args
  <https://playwright.dev/docs/api/class-browsertype>.


## 8 · Proposal: `assets/viz3d.js`, two agents, and a 3-D review checklist

### 8.1 Architecture

- `assets/viz3d.js` (+ `assets/viz3d.css`) is a classic script inlined by `tools/viz_inline.py` **only** into explainers
  with `<meta name="viz:3d" content="1">`; the inliner also writes the import map (§2.2). It depends on `viz_lib.js`
  (views, app state, colours, fmt) and lazily imports three.js 0.186.1 and the needed addons.
- `Viz.three` (r128) stays for chapters 1–16 of fluidpy; the new kit is `Viz3D`. `Viz.proj3` is promoted into viz_lib as
  the fallback renderer for line/point layers.
- Every scene is described **declaratively** (layers with data + parameters) so the kit can rebuild it after context
  loss, draw a degraded version with `Viz.proj3`, and dispose it cleanly.

### 8.2 API sketch

```js
// ---------- lifecycle ----------
Viz3D.scene(view, {
  backend: 'webgl',                    // 'webgl' (default) | 'webgpu' (TSL scenes, auto-falls back to WebGL2)
  camera: { fov: 35, up: 'z', near: 0.01, far: 100 },
  controls: { orbit: true, pan: 'desktop', minPolar: 0.05, maxPolar: Math.PI - 0.05, damping: 0.1 },
  background: 'token:--viz-bg',        // follows light/dark theme
  lazy: true,                          // create GL context on first visibility; release after 30 s off-screen
  fallback: 'proj3',                   // 'proj3' | 'note'
  exaggeration: { z: 1000, label: 'vertical ×1000' },   // always rendered as a badge if != 1
  provenance: true,                    // show chips per layer
  audit: Viz3D.auditFromUrl()          // ?audit=1 → preserveDrawingBuffer, paused loop, viz3d:ready event
}).then(S => { /* S = null if neither WebGL nor fallback */ });

S.add(layer) / S.remove(id) / S.set(id, params) / S.render() / S.dispose()
S.loop({ dt, step(dt), stepsPerFrameMax, onTime(t) })   // fixed-dt loop bound to app transport (§4.2)
S.pick(ev) → { layer, id, point, lonlat?, value? }       // raycast; writes app state via onPick
S.toScreen(v3) → {x, y, visible}                         // for 2-D overlays
S.on('ready' | 'contextlost' | 'contextrestored' | 'frame', fn)

// ---------- layers ----------
Viz3D.globe({ radius: 1, field: { data: U8, w: 144, h: 73, scale, offset, nan: 255, units: 'K' },
  lut: 'cmocean.thermal', range: [240, 310], coast: COAST_I16, graticule: 30, rotate: { omega: 0, frame: 'earth' },
  latLabels: true })                                        // → also exposes lonlatToXYZ, xyzToLonlat
Viz3D.betaPlane({ Lx, Ly, f0, beta, grid: [nx, ny], axes: 'east,north,up', scaleBar: true })
Viz3D.tank({ shape: 'cylinder' | 'annulus' | 'box', R: 1, Rin: 0.3, H: 0.4, omega, lid: false,
  walls: { inner: 'cold', outer: 'warm' }, water: { alpha: 0.15 } })
Viz3D.layerStack({ surfaces: [{ height: fn | U8, label: '\\sigma_\\theta = 27.0' }, …], cutaway: 'wedge',
  lut: 'cmocean.dense', exaggeration: 1000 })
Viz3D.particles({ n: 2e4, mode: 'cpu' | 'gpgpu', velocity: fn | { texture, w, h, d? }, integrator: 'rk2',
  seed: 42, lifetime: [2, 6], spawn: fn | 'uniform' | { region }, colorBy: 'age' | 'tracer' | fn,
  trails: { fade: 0.96 } | false, size: 2, onSphere: false })
Viz3D.fieldSurface({ grid: [nx, ny], domain, height: fn(x, y, t, p) | 'glsl:<expr>', uniforms, exaggeration,
  color: { lut: 'cmocean.balance', range: [-1, 1], symmetric: true }, contours: { step: 0.2 } })
Viz3D.isosurface({ volume: U8, dims: [nx, ny, nz], bounds, iso: 0.5, method: 'marching' | 'precomputed',
  mesh: { positions, indices } /* precomputed */, color, opacity, twoSided: true })
Viz3D.cutPlane({ normal: [1, 0, 0], offset, field3d, lut, draggable: true, link: 'section' })
Viz3D.streamtubes({ seeds, velocity: fn, steps, ds, radius: s => r, beads: { speedScale } })
Viz3D.vectorField({ points, vectors | fn, scale, colorBy: 'magnitude', maxArrows: 4000 })   // InstancedMesh
Viz3D.vectorGlyph({ at: [x, y, z], op: 'dot' | 'cross' | 'curl' | 'balance',
  a: { v, label: '\\mathbf{u}', color: 'teal' }, b: { v, label: '\\nabla b', color: 'orange' },
  showParallelogram: true, showArc: true, showShadow: true, readout: true })  // returns live result for parity
Viz3D.trajectory({ from: point, velocity: fn, back: 2 * YEAR, fwd: 5 * YEAR, ticks: YEAR })  // where from / where to
Viz3D.labels([{ at, tex: String.raw`\tau_x`, priority: 1 }], { maxVisible: 'auto' })        // CSS2D + KaTeX
Viz3D.legend({ lut, range, units, title })                                                    // 2-D strip, theme-aware
Viz3D.cameraPresets({ space: {pos, target}, equator: {…}, wbc: {…}, slice: {…} },
  { tween: 700, reducedMotion: 'cut' })                     // S.goto('wbc'), used by walkthrough steps
Viz3D.lut('cmocean.thermal' | 'viridis' | …) → DataTexture  // tables generated by tools/make_luts.py
Viz3D.selftestRows(S) → rows                                 // GPU read-back probes, glyph orthogonality, etc.
```

Example (Ekman pumping step of a walkthrough):

```js
tour: [{ title: 'Curl lifts the water', camera: 'under',
  show: ['wind', 'loop', 'pumping'], set: { tauCurl: -1e-7 },
  eq: String.raw`w_E = \frac{1}{\rho_0}\,\hat{\mathbf z}\cdot\nabla\times\!\left(\frac{\boldsymbol\tau}{f}\right)` }]
```

### 8.3 Agent roles

**`viz3d-builder`** (one per 3-D scene; writes only `viz/chNN/<slug>.scene.js` during the build, inlined later, or
the scene section of the explainer file):
- Reads the storyboard's 3-D spec, `knowledge/viz_patterns.md` (3-D section), and the `aofd` function it mirrors.
- Builds the scene with `Viz3D` layers only (no raw three.js unless a layer is missing — then writes it as a candidate
  layer with a note for the knowledge-keeper); defines camera presets, layer ids, exaggeration and provenance.
- Delivers: scene module, its JS physics mirrors, `selftestRows` (CPU ↔ Python, GPU ↔ CPU, drawing invariants),
  screenshots at the five standard sizes with `--3d`, a perf note (fps on the audit machine, particle count, draw calls,
  data bytes), and the `Viz.proj3` fallback rendering.

**`viz-integrator`** (one per explainer; after the scene exists):
- Wires the scene into `Viz.app`: views and layout (3-D + one 2-D linked view, portrait swap), params and presets,
  transport ↔ `S.loop`, picking ↔ inspector, walkthrough steps (camera preset + layer reveal + equation shown in full),
  Explain tab (numbered sections with the reader's numbers), Derivation tab, synced Code tab, quiz.
- Runs `tools/viz_lint.py`, `tools/shot.py --3d` (GL flags, `?audit=1`, blank-canvas and context checks, real drag and
  wheel events, a forced context loss and restore), the parity rows, and the published-page audit with all explainers
  of the chapter to check context counts.
- The existing `viz-reviewer` then judges by eye with the checklist below.

### 8.4 3-D review checklist

**Physics and honesty**
- [ ] Every moving or coloured quantity traces to a named `aofd` function or a cited dataset; provenance chip present.
- [ ] Parity rows pass: JS ↔ Python (rtol stated), GPU ↔ CPU read-back (float32 tolerance stated), drawing invariants
      (cross result ⟂ inputs, Ekman transport ⟂ wind, isosurface area/volume vs Python).
- [ ] Vertical exaggeration, time scaling and particle speed scaling are labelled on screen; a true-scale toggle exists
      where it teaches.
- [ ] Signs and frames: hemisphere flip changes f and the deflection direction; east/north/up triad visible; lat not
      flipped in textures (a data row checks a known point, e.g. warm pool max near 150°E).
- [ ] Every equation shown in the scene, walkthrough or labels is written in full with its number.

**Teaching**
- [ ] The 3-D view is linked to at least one 2-D reading (section, profile, dispersion diagram) by one shared state.
- [ ] Walkthrough 4–8 steps, each with a camera preset and one new layer; the last step asks for a prediction.
- [ ] Dot/cross/curl glyphs follow the shared language (teal/orange, shadow, parallelogram, arc, signed bar).
- [ ] Explain tab reproduces the numbers on screen; Code tab runs and gives them.

**Visual quality**
- [ ] Legend with units for every colour layer; LUT is cmocean/viridis family; no jet; sign not encoded by hue alone.
- [ ] Labels ≥ 12 px, ≤ 6 visible on phones, no overlap with controls; theme (light/dark) correct, background from tokens.
- [ ] No z-fighting (coastlines lifted), transparent layers sorted, no flicker when orbiting.
- [ ] No scrolling at 360×640 … 1920×1080 and in a notebook frame; canvas resizes without stretching.

**Robustness and performance**
- [ ] ≥ 50 fps on a laptop iGPU and ≥ 30 fps on a mid phone at default settings; DPR ≤ 2; draw calls ≤ 50.
- [ ] Lazy init and release work on the published page with all of the chapter's explainers (≤ 8 live contexts after
      scrolling top to bottom); forced context loss → message → restore rebuilds the scene.
- [ ] `dispose()` leaves `renderer.info.memory.geometries/textures` at 0.
- [ ] Offline/no-WebGL: `Viz.proj3` fallback draws the key lines; all tabs still work.
- [ ] `prefers-reduced-motion`: no auto-rotation, no tweens, particles paused.
- [ ] Inlined data ≤ 150 KB (file ≤ 600 KB); three.js pinned to the import-map version; no extra CDNs.
- [ ] Headless audit used the GL flags and verified non-blank WebGL output (not the fallback note) at every size.

### 8.5 Suggested first steps (when the AOFD project starts)

1. Port the r128 `Viz.three` contract to a new `Viz3D.scene` on 0.186.1 with OrbitControls, lazy init, dispose,
   context-loss handling, audit mode; promote `Viz.proj3`.
2. Extend `tools/shot.py` with `--3d` (GL flags, `viz3d:ready`, blank-canvas check, real drags) and
   `tools/viz_inline.py` with the import map; add a `templates/viz_example_globe.html` (Coriolis on a globe) and a
   `templates/viz_example_gpgpu.html` (Munk gyre tracers) as references, each with parity rows.
3. Add `tools/make_luts.py` (cmocean + viridis → JSON) and `tools/make_coast.py` (world-atlas 110 m → int16 arrays),
   both cached and licence-noted.
4. Build the glyph language (`vectorGlyph`) once with its own self-test page before any chapter uses it.
