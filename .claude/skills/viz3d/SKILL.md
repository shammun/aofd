---
name: viz3d
description: The aofd three.js 3-D kit (assets/viz3d.js, Viz3D on three.js 0.186.1 ES modules via an import map) for 3-D views inside explainers and standalone full-window scenes - the Viz3D.scene lifecycle (lazy, dispose, context loss, audit mode), layers (globe, betaPlane, tank, layerStack, particles, fieldSurface, isosurface, cutPlane, streamtubes, vectorField, vectorGlyph, trajectory, labels, legend, cameraPresets, lut, selftestRows), the fallback ladder to Viz.proj3, the dot/cross/curl/balance glyph language and the where-from/where-to probe, one fixed-dt clock bound to the transport, physics parity (JS ↔ Python, GPU ↔ CPU, drawing invariants, data spot values), performance and honesty rules, the tools/shot.py --3d audit and the 3-D review checklist. Load when deciding, specifying, building, integrating, auditing or reviewing any 3-D view or scene, or a movie scene shared with @remotion/three.
---

# viz3d — honest, fast 3-D inside the Kundu format

Source: research note R2 (§2.2, §3, §4, §5, §6, §8). **`assets/viz3d.js` is being built in setup step 8; §3 below is the
contract it implements** — if a layer named here is missing in the kit, the builder writes it as a candidate layer
with a note for the knowledge-keeper (never raw three.js scattered through an explainer).

## 1. Architecture
- `assets/viz3d.js` + `assets/viz3d.css`: a **classic script** inlined by `tools/viz_inline.py` only into files with
  `<meta name="viz:3d" content="1">` (explainers) or into `scenes/chNN/*.html`. It depends on `viz_lib.js` (views, state,
  colours, `Viz.fmt`) and lazily `import()`s three.js 0.186.1 and the needed addons.
- The old `Viz.three` (r128 UMD) stays for fluidpy-era templates (`templates/viz_example_3d.html` must keep passing);
  **new work uses `Viz3D`**. `Viz.proj3(view, {theta, phi, scale})` (canvas projector) is promoted into `viz_lib.js` as
  the guaranteed fallback for line/point layers.
- Scenes are **declarative** (layers with data + params) so the kit can rebuild after context loss, draw a degraded
  `proj3` version, and dispose cleanly.

## 2. Import map and loading (written by `viz_inline.py` into `<head>`, one per document, before any module load)
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
`Viz3D.load()` caches one promise: `import('three')` + `OrbitControls` + `CSS2DRenderer` (optional addons such as
`MarchingCubes`, `Line2`, `GPUComputationRenderer` only when a layer asks), with a 12 s timeout → `null` → fallback.
**One CDN (jsDelivr) for core and addons** (two cores break `instanceof`). Works in `srcdoc` iframes (local Jupyter)
and `src` iframes (Colab/Pages). Default renderer: **WebGLRenderer (WebGL 2) + GLSL** — WebGPU/TSL is opt-in only.
Fallback ladder: WebGL2 → WebGL1 → `Viz.proj3` (lines/points, no surfaces) → static note; every tab still teaches.

## 3. API (the contract)
```js
Viz3D.scene(view, {
  backend: 'webgl', camera: { fov: 35, up: 'z', near: 0.01, far: 100 },
  controls: { orbit: true, pan: 'desktop', minPolar: 0.05, maxPolar: Math.PI - 0.05, damping: 0.1 },
  background: 'token:--viz-bg', lazy: true, fallback: 'proj3',
  exaggeration: { z: 1000, label: 'vertical ×1000' }, provenance: true, audit: Viz3D.auditFromUrl()
}).then(S => { /* S = null only if neither WebGL nor fallback */ });
S.add(layer) / S.remove(id) / S.set(id, params) / S.render() / S.dispose()
S.loop({ dt, step(dt), stepsPerFrameMax, onTime(t) })   // fixed-dt loop owned by the app transport
S.pick(ev) → { layer, id, point, lonlat?, value? }       // raycast; write app state in onPick
S.toScreen(v3) → { x, y, visible }                       // for 2-D overlays on the view canvas
S.on('ready' | 'contextlost' | 'contextrestored' | 'frame', fn);  S.goto(presetName)
```
Layers:
| Layer | Use |
|---|---|
| `Viz3D.globe({radius, field:{data,w,h,scale,offset,nan,units}, lut, range, coast, graticule: 30, rotate:{omega, frame}, latLabels})` | equirectangular DataTexture field + LUT shader, graticule, Natural Earth coast (int16, lifted 0.2 %); exposes `lonlatToXYZ`, `xyzToLonlat` |
| `Viz3D.betaPlane({Lx, Ly, f0, beta, grid, axes:'east,north,up', scaleBar})` | tangent-plane patch with E/N/U triad |
| `Viz3D.tank({shape:'cylinder'|'annulus'|'box', R, Rin, H, omega, lid, walls, water:{alpha}})` | rotating-tank experiments (Weather in a Tank twins) |
| `Viz3D.layerStack({surfaces:[{height, label}], cutaway:'wedge', lut, exaggeration})` | isopycnal / isentropic sheets, sorted transparency |
| `Viz3D.particles({n, mode:'cpu'|'gpgpu', velocity, integrator:'rk2', seed, lifetime, spawn, colorBy, trails, size, onSphere})` | tracers; CPU ≤ 5·10⁴, GPGPU 10⁵–10⁶ |
| `Viz3D.fieldSurface({grid, domain, height: fn | 'glsl:<expr>', uniforms, exaggeration, color:{lut, range, symmetric}, contours:{step}})` | vertex-displaced surfaces (η, ψ, thermocline depth), shader normals, AA isolines |
| `Viz3D.isosurface({volume, dims, bounds, iso, method:'marching'|'precomputed', mesh, color, opacity, twoSided})` | PV / density blobs (precomputed via skimage preferred) |
| `Viz3D.cutPlane({normal, offset, field3d, lut, draggable, link:'section'})` | section plane linked to a 2-D section view |
| `Viz3D.streamtubes({seeds, velocity, steps, ds, radius, beads:{speedScale}})` | overturning pathways; beads move ∝ |u| |
| `Viz3D.vectorField({points, vectors | fn, scale, colorBy:'magnitude', maxArrows: 4000})` | InstancedMesh arrows |
| `Viz3D.vectorGlyph({at, op:'dot'|'cross'|'curl'|'balance', a:{v,label,color}, b:{…}, showParallelogram, showArc, showShadow, readout})` | the glyph language (§4); returns the live result for parity |
| `Viz3D.trajectory({from, velocity, back, fwd, ticks})` | where-from (dashed) / where-to (solid) probe, yearly ticks |
| `Viz3D.labels([{at, tex, priority}], {maxVisible:'auto'})` | CSS2D + KaTeX, ≤ 6 visible (fewer on phones), sized from the view |
| `Viz3D.legend({lut, range, units, title})` | theme-aware 2-D strip from the same LUT |
| `Viz3D.cameraPresets({space, equator, wbc, slice}, {tween: 700, reducedMotion: 'cut'})` | story beats; `S.goto('wbc')` from walkthrough steps |
| `Viz3D.lut(name)` → DataTexture | tables from `assets/luts.json` (`tools/make_luts.py`: cmocean thermal/haline/dense/deep/speed/balance/curl/delta, viridis, cividis) |
| `Viz3D.selftestRows(S)` → rows | GPU read-back probes, glyph orthogonality, data spot values |
Walkthrough step example: `{title:'Curl lifts the water', camera:'under', show:['wind','loop','pumping'], set:{tauCurl:-1e-7}, eq: String.raw`w_E = \frac{1}{\rho_0}\hat{\mathbf z}\cdot\nabla\times(\boldsymbol\tau/f)`}`.

## 4. Glyph language (every chapter — the "where does the water go" layer)
| Operation | Glyph | Rule |
|---|---|---|
| **a · b** (u·∇b) | a teal, b orange from one point; **shadow** of a on b's line as a thick segment; signed bar | bar = a·b in units; zero when a ⟂ b ("along the isopycnal: adiabatic") |
| **a × b** (−f ẑ×u, τ×ẑ/ρ₀f) | translucent **parallelogram**, curled **arc** from a to b, result arrow ⟂ plane, length = area | right-hand rule; readout \|a\|\|b\| sin θ with live θ; hemisphere flip → f sign → result flips |
| **∇×τ** (Ekman pumping) | square loop with τ arrows on its sides, ∮τ·dl coloured along the loop, vertical arrow at centre (up = upwelling) | shrinking the loop → the curl (Stokes); w_E sign at many columns |
| **∇b** with isosurface | normal arrows on an isopycnal sheet | "up-gradient"; with u arrows, explains cross-isopycnal flow |
| **balance** (geostrophy) | pressure-gradient and Coriolis arrows head-to-tail, residual = acceleration | term bars at the picked point |
Where-from / where-to: click a point → integrate backward (dashed, "came from") and forward (solid, "goes to") through
the steady field, ticks every year of travel.

## 5. One clock, determinism, linking
- **The transport owns model time**; the scene renders the state that time implies. Fixed-dt loop
  (`acc += wall·speed·SIM_PER_SEC; while (acc ≥ DT) step(DT)`, wall clamped to 0.1 s, `app.set({t}, {silent:true})`).
  Closed-form scenes are f(t) (exact scrubbing). Integrated scenes keep checkpoints every K steps; if the simulation
  lags, the status says "computing … t = …" — never three clocks.
- Seeded RNG (`mulberry32`), fixed t in audit mode. Pause when hidden (IntersectionObserver, `document.hidden`); render
  on demand when paused — no idle 60 fps.
- One state object drives 2-D and 3-D; picking writes state; a 2-D cursor moves a 3-D marker (ch13 Ekman one-cursor
  pattern). Explain and Code numbers come from the same JS functions as the scene.
- `prefers-reduced-motion`: no auto-rotate, cuts instead of tweens, particles start paused.

## 6. Physics parity (fluidpy contract + two new legs)
1. Every formula is a **pure JS function** with the same name and argument order as its Python twin
   (`rossbyOmega(k, l, beta, Ld)` ↔ `fluidpy.geo.waves.rossby.omega(...)` / `fluidpy.core.gfd.*`).
2. `selftest()` rows `{name, js, py, rtol}` evaluated by `tools/shot.py` (rtol stated).
3. **GPU ↔ CPU**: render N steps, read back probe texels (`readRenderTargetPixels`, FloatType), compare to the CPU
   mirror; float32 rtol 1e-4–1e-5 stated; never loosened.
4. **Drawing invariants**: cross result ⟂ inputs (|r·a| < 1e-9), Ekman transport at 90° to the wind, isosurface volume
   vs Python ±2 %.
5. **Data spot values**: decoded texture values at known points vs the Python array (catches quantisation and the classic
   flipped latitude — e.g. warm-pool maximum near 150°E).

## 7. Performance and robustness
DPR ≤ 2 (1.5 on phones with many particles); ≤ 50 draw calls (InstancedMesh, merged statics, one `Points`);
`renderer.compile` at init; globe in units of Earth radius, physics in SI on the CPU. **Dispose** geometries,
materials, textures, render targets and the renderer on teardown/mode rebuild; audit `renderer.info.memory` → 0.
**Context loss**: `webglcontextlost` → `preventDefault`, stop loop, "3-D paused — tap to restore"; restore rebuilds from
the declarative description (test with `forceContextLoss()`). **One renderer per explainer**, created on first
visibility (`rootMargin: 200px`), released after 30 s off-screen (Chrome keeps ~16 live contexts). Inlined data
≤ 150 KB, file ≤ 600 KB; bigger data as `viz/data/*.bin` (≤ 2 MB) with an offline note. Mobile: OrbitControls touch,
`touch-action: none` on the canvas only, counts scaled to viewport area, no bloom.

## 8. Design rules — catchy but honest
1. **Earn the third dimension** (Coriolis on a sphere, Ekman spiral, overturning, PV volumes); a non-height field drawn
   as height says so ("surface height = ψ, not sea level").
2. **Label exaggeration** ("vertical ×1000 (4 km deep, 4000 km wide)"), with a true-scale toggle where it teaches; time
   ("1 s = 5 days") and tracer speed scaling too.
3. **Provenance chips** per layer: *computed* (function name) · *schematic* · *data* (dataset, period, resolution, licence).
4. Camera presets as story beats; free orbit + "reset view" always; rotate the camera **or** the planet, never both.
5. Progressive reveal: one layer per walkthrough step with its equation in full; last step asks for a prediction.
6. ≤ 6 labels in the scene, E/N/U triad, scale bar. 7. Colour with meaning, CVD-safe: cmocean/viridis, diverging centred,
   legend with units, never jet; sign also by direction or dash. 8. Motion tells the truth; glow only marks selection.
9. Phone first: one 3-D + one 2-D view. 10. Fail gracefully (proj3).
Lighting: unlit LUT colour + subtle shading term for data surfaces (lighting must not change a data colour);
`MeshStandardMaterial` roughness 0.6–0.8 for objects; no shadows; water alpha 0.12–0.2 rendered last; `SRGBColorSpace`;
background from the `--viz-bg` token (light and dark themes).

## 9. Audit: `tools/shot.py --3d <file>`
Launches Edge/Chrome with `--use-angle=swiftshader --enable-unsafe-swiftshader` (audit only), loads `?audit=1`
(`preserveDrawingBuffer`, paused after the first frame, emits `viz3d:ready`), and at every size checks: context alive,
canvas **not blank** (pixel variance), real drags and wheel change the picture, forced context loss → message →
restore, `renderer.info.memory` → 0 after dispose; then reruns with WebGL disabled and checks the `proj3` fallback and
all tabs. Page audits count live WebGL contexts (≤ 8). The normal `shot.py` (8 sizes, every tab/step, parity rows) runs
too. Record fps, particle count, draw calls, data bytes and GPU vs SwiftShader in the perf note.

## 10. 3-D review checklist (viz-reviewer, R2 §8.4)
**Physics and honesty** — [ ] every moving/coloured quantity traces to a named function or cited dataset; chip present ·
[ ] parity rows pass (JS↔Py, GPU↔CPU, drawing invariants) with tolerances stated · [ ] exaggeration, time and particle
speed scaling labelled; true-scale toggle where it teaches · [ ] signs and frames: hemisphere flip changes f and the
deflection; E/N/U triad; lat not flipped (data row) · [ ] every equation shown is written in full with its number.
**Teaching** — [ ] 3-D linked to ≥ 1 2-D reading by one state · [ ] walkthrough 4–8 steps, each a camera preset + one new
layer, last asks for a prediction · [ ] glyphs follow §4 · [ ] Explain reproduces the numbers on screen; Code runs.
**Visual** — [ ] legend with units per colour layer; cmocean/viridis; no jet; sign not by hue alone · [ ] labels ≥ 12 px,
≤ 6 on phones, no overlap with controls; theme correct · [ ] no z-fighting, sorted transparency, no flicker · [ ] no
scrolling at 360×640 … 1920×1080 and in a notebook frame; canvas resizes without stretching.
**Robustness** — [ ] ≥ 50 fps laptop iGPU, ≥ 30 fps mid phone; DPR ≤ 2; ≤ 50 draw calls · [ ] lazy init/release on the
published page (≤ 8 live contexts); forced context loss restores · [ ] `dispose()` → memory 0 · [ ] no-WebGL `proj3`
fallback; all tabs work · [ ] reduced motion respected · [ ] inlined data ≤ 150 KB, file ≤ 600 KB; three.js pinned to the
import-map version; no extra CDNs · [ ] headless audit used the GL flags and verified non-blank WebGL output at every size.

## 11. Movies share scene modules
Physics functions and geometry builders are plain ES-module functions so `@remotion/three` compositions import the same
code (skill `motion-graphics`); in Remotion everything is a function of `useCurrentFrame()` (never rAF/`useFrame`).

## 12. Lessons (the knowledge-keeper appends; one line each, dated by chapter)
