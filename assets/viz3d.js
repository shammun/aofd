/* ======================================================================================================
   viz3d.js — the AOFD three.js 3-D kit (R2 §8). A classic script, inlined by tools/viz_inline.py ONLY into pages
   with <meta name="viz:3d" content="1">, after viz_lib.js (it needs window.Viz). three.js 0.186.1 is NOT inlined:
   it is loaded lazily as ES modules from jsDelivr through the import map that viz_inline.py writes into <head>.

     Viz3D.scene(view, {camera:{fov, position, target, up:'z'}, controls:{orbit, pan, damping, minPolar, maxPolar},
                        lazy, fallback:'proj3'|'note', exaggeration:{label}, provenance:true, onPick(hit)})
       → Promise<S>. S works before WebGL exists (layers are declarative and are (re)built whenever a context is
       created, restored or re-created after an off-screen release). S.fallback === true → Viz.proj3 canvas
       projector draws each layer's key lines (no WebGL / no CDN). Resolves null only if neither is possible.
     S.add(layer) · S.remove(id) · S.set(id, params) · S.get(id) · S.render() · S.renderNow() · S.dispose()
     S.loop({dt, step(dt), playing(), stepsPerFrameMax, onTime(t)}) · S.pick(ev) · S.toScreen([x,y,z]) · S.goto(name)
     S.on('ready'|'contextlost'|'contextrestored'|'frame'|'pick', fn) · S.selftestRows() · S.renderer · S.THREE
   Layers (descriptors; z is up, globe radius 1): Viz3D.vectorField, vectorGlyph, labels, legend, cameraPresets,
     globe, fieldSurface, particles, trajectory, betaPlane, axesTriad, tank, layerStack, isosurface (precomputed),
     streamtubes. Candidate layers that throw a clear error: cutPlane, isosurface({method:'marching'}),
     particles({mode:'gpgpu'}).
   Helpers: Viz3D.load() · Viz3D.lut(name) → DataTexture · Viz3D.lutRGB(name) → Uint8Array(768) ·
     Viz3D.lutCss(name, t) · Viz3D.coast() → [[lon,lat]…][] · Viz3D.lonlatToXYZ(lon, lat, r) · Viz3D.xyzToLonlat(p) ·
     Viz3D.math (dot, cross, norm, add, sub, scale, rk2, rk4, rng) · Viz3D.selftestRows(S).
   Robustness (R2 §5): DPR ≤ 2, render on demand, lazy create via IntersectionObserver (rootMargin 200 px), release
   after 30 s off-screen, webglcontextlost → "3-D paused — tap to restore" → declarative rebuild, dispose() →
   renderer.info.memory 0. Audit mode (?audit=1): preserveDrawingBuffer, no damping/tweens, no lazy, window event
   'viz3d:ready'. Audit hooks: window.VIZ3D = {isReady(), info(), variance(i), forceLoss(i), restore(i),
   disposeCheck(i), cameraState(i)} (tools/shot.py --3d).
   Honesty (R2 §6): exaggeration badge, provenance chips (computed · schematic · data), theme tokens (--viz-bg,
   --viz-text), unlit LUT colour with a subtle shading term, no jet (LUT 'jet' only on viz:badexample pages).
   ====================================================================================================== */
/* VIZ3D_JS:BEGIN */
(function (global) {
  'use strict';
  var Viz = global.Viz, doc = global.document;
  var Viz3D = { version: '0.1.0', three: '0.186.1', scenes: [], THREE: null };
  var LIB = null, loadP = null, nLayer = 0;

  function q(name) { try { return new URLSearchParams(global.location.search).get(name); } catch (e) { return null; } }
  var AUDIT = q('audit') === '1' || !!global.VIZ3D_AUDIT;
  var REDUCED = AUDIT || !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
  Viz3D.audit = AUDIT; Viz3D.reducedMotion = REDUCED;
  Viz3D.auditFromUrl = function () { return AUDIT; };
  function isFn(f) { return typeof f === 'function'; }
  function el(tag, cls, text) { var e = doc.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  function css(name, fb) { var v = getComputedStyle(doc.documentElement).getPropertyValue('--viz-' + name).trim(); return v || fb; }

  /* ---------- pure maths (mirrored by Python where a scene's physics needs parity) ---------- */
  var M = {
    dot: function (a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; },
    cross: function (a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; },
    norm: function (a) { return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]); },
    add: function (a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; },
    sub: function (a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; },
    scale: function (a, s) { return [a[0] * s, a[1] * s, a[2] * s]; },
    unit: function (a) { var n = M.norm(a) || 1; return [a[0] / n, a[1] / n, a[2] / n]; },
    angle: function (a, b) { var c = M.dot(a, b) / ((M.norm(a) * M.norm(b)) || 1); return Math.acos(Math.max(-1, Math.min(1, c))); },
    rk2: function (f, p, t, dt) { var k1 = f(p, t), mid = M.add(p, M.scale(k1, dt / 2)); return M.add(p, M.scale(f(mid, t + dt / 2), dt)); },
    rk4: function (f, p, t, dt) {
      var k1 = f(p, t), k2 = f(M.add(p, M.scale(k1, dt / 2)), t + dt / 2), k3 = f(M.add(p, M.scale(k2, dt / 2)), t + dt / 2), k4 = f(M.add(p, M.scale(k3, dt)), t + dt);
      return [0, 1, 2].map(function (i) { return p[i] + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]); });
    },
    rng: function (seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  };
  Viz3D.math = M;
  var D2R = Math.PI / 180;
  Viz3D.lonlatToXYZ = function (lon, lat, r) { r = r || 1; var cl = Math.cos(lat * D2R); return [r * cl * Math.cos(lon * D2R), r * cl * Math.sin(lon * D2R), r * Math.sin(lat * D2R)]; };
  Viz3D.xyzToLonlat = function (p) { var r = M.norm(p) || 1; return [Math.atan2(p[1], p[0]) / D2R, Math.asin(Math.max(-1, Math.min(1, p[2] / r))) / D2R]; };

  /* ---------- colour tables (assets/luts.json, inlined as window.VIZ3D_LUTS) ---------- */
  var rgbCache = {};
  Viz3D.lutRGB = function (name) {
    if (rgbCache[name]) return rgbCache[name];
    var L = global.VIZ3D_LUTS, b64 = L && L.tables && (L.tables[name] || L.tables['cmocean.' + name]);
    if (!b64) throw new Error('Viz3D.lut: unknown or not inlined colour table "' + name + '" (add the VIZ3D_LUTS block)');
    if (name === 'jet' && !doc.querySelector('meta[name="viz:badexample"]')) throw new Error('Viz3D.lut: jet is allowed only on a viz:badexample page');
    var s = global.atob(b64), out = new Uint8Array(768);
    for (var i = 0; i < 768; i++) out[i] = s.charCodeAt(i);
    return (rgbCache[name] = out);
  };
  Viz3D.lutCss = function (name, t) { var c = Viz3D.lutRGB(name), i = 3 * Math.max(0, Math.min(255, Math.round(t * 255))); return 'rgb(' + c[i] + ',' + c[i + 1] + ',' + c[i + 2] + ')'; };
  Viz3D.lut = function (name) {
    var T = Viz3D.THREE; if (!T) throw new Error('Viz3D.lut needs three.js: call after Viz3D.load()');
    var c = Viz3D.lutRGB(name), d = new Uint8Array(1024);
    for (var i = 0; i < 256; i++) { d[4 * i] = c[3 * i]; d[4 * i + 1] = c[3 * i + 1]; d[4 * i + 2] = c[3 * i + 2]; d[4 * i + 3] = 255; }
    var tex = new T.DataTexture(d, 256, 1, T.RGBAFormat, T.UnsignedByteType);
    tex.colorSpace = T.NoColorSpace;               // bytes go to the screen unchanged: colour == legend colour
    tex.magFilter = T.LinearFilter; tex.minFilter = T.LinearFilter; tex.wrapS = T.ClampToEdgeWrapping; tex.needsUpdate = true;
    tex.userData.lut = name;
    return tex;
  };
  /* ---------- coastlines (assets/coast110.json, inlined as window.VIZ3D_COAST) ---------- */
  var coastCache = null;
  Viz3D.coast = function () {
    if (coastCache) return coastCache;
    var C = global.VIZ3D_COAST; if (!C) throw new Error('Viz3D.coast: add the VIZ3D_COAST data block (tools/viz_inline.py)');
    var s = global.atob(C.data), n = s.length / 2, v = new Int16Array(n);
    for (var i = 0; i < n; i++) { var lo = s.charCodeAt(2 * i), hi = s.charCodeAt(2 * i + 1); v[i] = (hi << 8 | lo) << 16 >> 16; }
    var lines = [], st = C.starts.concat([n / 2]);
    for (var k = 0; k + 1 < st.length; k++) { var line = []; for (var j = st[k]; j < st[k + 1]; j++) line.push([v[2 * j] / C.scale, v[2 * j + 1] / C.scale]); lines.push(line); }
    return (coastCache = lines);
  };

  /* ---------- loading three.js (import map → jsDelivr three@0.186.1) ---------- */
  Viz3D.load = function () {
    if (loadP) return loadP;
    if (Viz3D.disabled || !doc.querySelector('script[type="importmap"]')) { loadP = Promise.resolve(null); return loadP; }
    loadP = Promise.race([
      Promise.all([import('three'), import('three/addons/controls/OrbitControls.js'), import('three/addons/renderers/CSS2DRenderer.js')])
        .then(function (m) { LIB = { THREE: m[0], OrbitControls: m[1].OrbitControls, CSS2DRenderer: m[2].CSS2DRenderer, CSS2DObject: m[2].CSS2DObject }; Viz3D.THREE = m[0]; return LIB; }),
      new Promise(function (r) { setTimeout(function () { r(null); }, 12000); })
    ]).catch(function () { return null; });
    return loadP;
  };
  function webglOK() { try { var c = doc.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }

  /* ---------- layer registry ---------- */
  var IMPL = {};
  function layer(type, opts) { opts = opts || {}; return { type: type, id: opts.id || (type + '-' + (++nLayer)), opts: opts, obj: null, values: {} }; }
  function candidate(name) { return function () { throw new Error('Viz3D.' + name + ': candidate layer — not yet implemented (see skill viz3d; write it as a new layer and tell the knowledge-keeper)'); }; }

  function disposeObj(o) {
    if (!o) return;
    o.traverse(function (c) {
      if (c.geometry) c.geometry.dispose();
      var mats = c.material ? (Array.isArray(c.material) ? c.material : [c.material]) : [];
      mats.forEach(function (m) {
        Object.keys(m).forEach(function (k) { var v = m[k]; if (v && v.isTexture) v.dispose(); });
        if (m.uniforms) Object.keys(m.uniforms).forEach(function (k) { var v = m.uniforms[k].value; if (v && v.isTexture) v.dispose(); });
        m.dispose();
      });
      if (c.isCSS2DObject && c.element && c.element.parentNode) c.element.parentNode.removeChild(c.element);
      if (c.dispose && c.isInstancedMesh) c.dispose();
    });
    if (o.parent) o.parent.remove(o);
  }

  /* ======================================================================================================
     Scene
     ====================================================================================================== */
  function Scene(view, opts) {
    this.view = view && view.holder ? view : null;
    this.holder = view && view.holder ? view.holder : view;
    this.opts = opts || {};
    this.layers = []; this.handlers = {}; this.presets = {}; this.fallback = false; this.ready = false;
    this.lost = false; this.active = false; this.renderer = null; this.THREE = null; this.frames = 0; this._raf = 0;
    if (getComputedStyle(this.holder).position === 'static') this.holder.style.position = 'relative';
    this.ui = el('div', 'v3d-ui'); this.holder.appendChild(this.ui);
    this.badge = el('div', 'v3d-badge'); this.chips = el('div', 'v3d-chips'); this.ui.appendChild(this.badge); this.ui.appendChild(this.chips);
    this.paused = el('button', 'v3d-paused', '3-D paused — tap to restore'); this.paused.type = 'button'; this.paused.hidden = true;
    var S = this; this.paused.onclick = function () { S.restore(); };
    this.ui.appendChild(this.paused);
  }
  var SP = Scene.prototype;
  SP.on = function (ev, fn) { (this.handlers[ev] = this.handlers[ev] || []).push(fn); return this; };
  SP.emit = function (ev, x) { var S = this; (this.handlers[ev] || []).forEach(function (f) { try { f(x, S); } catch (e) { console.error('VIZ-ERROR viz3d ' + ev, e); } }); };

  SP._init = function () {
    var S = this;
    return Viz3D.load().then(function (lib) {
      if (!lib || !webglOK()) return S._toFallback(lib ? 'WebGL is not available' : 'three.js could not load (offline?)');
      S.THREE = lib.THREE;
      var lazy = S.opts.lazy !== false && !AUDIT && 'IntersectionObserver' in global;
      S._observe(lazy);
      if (!lazy) { try { S._createGL(); } catch (e) { console.warn('viz3d: WebGL renderer failed, using the canvas projector', e); return S._toFallback('WebGL failed to start'); } }
      return S;
    });
  };
  SP._observe = function (lazy) {
    var S = this; if (!('IntersectionObserver' in global)) return;
    var off = null;
    S._io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) { if (off) { clearTimeout(off); off = null; } if (!S.active && !S.fallback && !S._disposed) { try { S._createGL(); } catch (err) { S._toFallback('WebGL failed to start'); } } }
        else if (S.active && !AUDIT) { off = setTimeout(function () { S._release(); }, S.opts.releaseAfter || 30000); }
      });
    }, { rootMargin: '200px' });
    S._io.observe(S.holder);
    if (!lazy) return;
  };
  SP._toFallback = function (why) {
    var S = this;
    if (S.opts.fallback === 'note' || !Viz.proj3) {
      var n = el('div', 'viz-3d-fallback', 'The 3-D view needs WebGL (' + why + '). Everything else in this explainer still works.');
      S.holder.appendChild(n); S.fallback = true; S.ready = true; S.note = n; S.emit('ready'); fireReady(); return S;
    }
    S.fallback = true; S.fallbackWhy = why;
    var cam = S.opts.camera || {}, pos = cam.position || [3, -4, 2.5], tg = cam.target || [0, 0, 0], d = M.sub(pos, tg);
    S.P = Viz.proj3(S.view || S.holder, { theta: Math.atan2(d[1], d[0]), phi: Math.asin(d[2] / (M.norm(d) || 1)), target: tg, scale: S.opts.proj3Scale || 0.75 / Math.max(0.5, M.norm(d) / 5) });
    var note = el('div', 'v3d-chip v3d-fallback-chip', '2-D projection: ' + why); note.setAttribute('data-kind', 'fallback'); S.chips.appendChild(note);
    S._decor(); S.renderNow(); S.ready = true; S.emit('ready'); fireReady();
    return S;
  };

  SP._createGL = function () {
    var S = this, T = LIB.THREE, o = S.opts, cam = o.camera || {}, ctl = o.controls || {};
    var canvas = el('canvas', 'viz-3d-canvas v3d-canvas'); canvas.style.position = 'absolute'; canvas.style.inset = '0';
    canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.style.touchAction = 'none';
    S.holder.insertBefore(canvas, S.holder.firstChild);
    if (S.view && S.view.canvas) S.view.canvas.style.pointerEvents = 'none';
    var R = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, preserveDrawingBuffer: AUDIT });
    R.setPixelRatio(Math.min(global.devicePixelRatio || 1, 2)); R.outputColorSpace = T.SRGBColorSpace;
    S.renderer = R; S.canvas = canvas; S.THREE = T;
    S.scene = new T.Scene(); S.scene.background = new T.Color(css('bg', '#f5f6fb'));
    S.camera = new T.PerspectiveCamera(cam.fov || 35, 1, cam.near || 0.01, cam.far || 100);
    if ((cam.up || 'z') === 'z') S.camera.up.set(0, 0, 1);
    S.camera.position.fromArray(S._camPos || cam.position || [3, -4, 2.5]);
    S.scene.add(new T.HemisphereLight(0xffffff, 0x445566, 1.6));
    var key = new T.DirectionalLight(0xffffff, 1.2); key.position.set(3, -2, 5); S.scene.add(key);
    S.controls = new LIB.OrbitControls(S.camera, canvas);
    S.controls.target.fromArray(S._camTarget || cam.target || [0, 0, 0]);
    S.controls.enableDamping = ctl.damping !== false && !REDUCED; S.controls.dampingFactor = ctl.damping || 0.1;
    S.controls.enablePan = ctl.pan === undefined ? !('ontouchstart' in global) : !!ctl.pan;
    S.controls.minPolarAngle = ctl.minPolar || 0.05; S.controls.maxPolarAngle = ctl.maxPolar || Math.PI - 0.05;
    if (ctl.minDistance) S.controls.minDistance = ctl.minDistance; if (ctl.maxDistance) S.controls.maxDistance = ctl.maxDistance;
    S.controls.update();
    var spinning = false;
    function spin() { if (!S.active) { spinning = false; return; } var ch = S.controls.update(); if (ch || S._interacting) { S.renderNow(); global.requestAnimationFrame(spin); } else spinning = false; }
    S.controls.addEventListener('start', function () { S._interacting = true; if (S.controls.enableDamping && !spinning) { spinning = true; global.requestAnimationFrame(spin); } });
    S.controls.addEventListener('end', function () { S._interacting = false; });
    S.controls.addEventListener('change', function () { if (!spinning) S.render(); });
    S.css2d = new LIB.CSS2DRenderer(); S.css2d.domElement.className = 'v3d-labels'; S.holder.appendChild(S.css2d.domElement);
    S.raycaster = new T.Raycaster();
    var down = null;
    canvas.addEventListener('pointerdown', function (e) { down = [e.clientX, e.clientY]; });
    canvas.addEventListener('pointerup', function (e) { if (down && Math.abs(e.clientX - down[0]) + Math.abs(e.clientY - down[1]) < 5) { var hit = S.pick(e); if (hit) { S.emit('pick', hit); if (isFn(o.onPick)) o.onPick(hit, e); } } down = null; });
    /* A context lost by the browser / GPU driver (not by forceContextLoss) is often never handed back, so a tap — and an
       automatic retry 1.5 s later — throws the dead canvas away and builds a fresh one (AOFD, PoC A user report 2026-10-21). */
    canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault(); if (canvas._v3dTearing || S.canvas !== canvas) return;
      S.lost = true; S.paused.hidden = false; S.emit('contextlost');
      clearTimeout(S._autoRestore);
      var now = Date.now(); S._lossTimes = (S._lossTimes || []).filter(function (t) { return now - t < 60000; }); S._lossTimes.push(now);
      if (S._lossTimes.length <= 3 && !S._disposed) S._autoRestore = setTimeout(function () { if (S.lost && S.canvas === canvas) S._recreate(); }, 1500);
    });
    canvas.addEventListener('webglcontextrestored', function () { if (S.canvas !== canvas) return; clearTimeout(S._autoRestore); S.lost = false; S.paused.hidden = true; S._rebuild(); S.renderNow(); S.emit('contextrestored'); });
    if ('ResizeObserver' in global) { S._ro = new ResizeObserver(function () { S.render(); }); S._ro.observe(S.holder); }
    if ('MutationObserver' in global) { S._mo = new MutationObserver(function () { S._theme(); }); S._mo.observe(doc.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); }
    S.active = true; S.lost = false; S.paused.hidden = true;     // a fresh canvas is never "paused"
    S.layers.forEach(function (L) { S._build(L); });
    S._decor();
    S.renderNow();
    if (!S.ready) { S.ready = true; S.emit('ready'); fireReady(); }
  };
  SP._release = function () {             // off-screen for 30 s: free the GL context, keep the layer descriptions
    var S = this; if (!S.active) return;
    S._camPos = S.camera.position.toArray(); S._camTarget = S.controls.target.toArray();
    S.layers.forEach(function (L) { disposeObj(L.obj); L.obj = null; });
    S._teardownGL();
  };
  SP._teardownGL = function () {
    var S = this; if (!S.renderer) return;
    S.active = false;
    if (S._ro) S._ro.disconnect(); if (S._mo) S._mo.disconnect();
    S.controls.dispose(); S.renderer.renderLists.dispose(); S.renderer.dispose();
    S.canvas._v3dTearing = true;          // our own release: its webglcontextlost must not show "3-D paused"
    try { S.renderer.forceContextLoss(); } catch (e) { /* already lost */ }
    if (S.canvas.parentNode) S.canvas.parentNode.removeChild(S.canvas);
    if (S.css2d.domElement.parentNode) S.css2d.domElement.parentNode.removeChild(S.css2d.domElement);
    S.renderer = null; S._luts = {};
  };
  SP._theme = function () { var S = this; if (S.scene) S.scene.background = new S.THREE.Color(css('bg', '#f5f6fb')); S._rebuild(); S.render(); };
  SP._rebuild = function () { var S = this; S.layers.forEach(function (L) { disposeObj(L.obj); L.obj = null; if (S.active) S._build(L); }); };
  SP._build = function (L) {
    var S = this, impl = IMPL[L.type];
    if (!impl || !impl.build) return;
    var o = impl.build(S, L);
    if (o) { o.userData.layerId = L.id; o.name = L.id; o.visible = L.opts.visible !== false; S.scene.add(o); }
    L.obj = o;
  };
  SP._lutTex = function (name) { var S = this; S._luts = S._luts || {}; return S._luts[name] || (S._luts[name] = Viz3D.lut(name)); };
  SP._decor = function () {
    var S = this, ex = S.opts.exaggeration, labels = [];
    if (ex && ex.label) labels.push(ex.label);
    S.layers.forEach(function (L) {
      if (L.opts.visible === false) return;
      if (L.opts.exaggeration && L.opts.exaggerationLabel) labels.push(L.opts.exaggerationLabel);
      if (L.opts.displace && (L.opts.displace.exaggeration || 1) !== 1) labels.push(L.opts.displace.label || ('height ×' + L.opts.displace.exaggeration));
    });
    S.badge.textContent = labels.length ? labels.join(' · ') + ' — not to scale' : '';
    S.badge.hidden = !labels.length;
    Array.prototype.slice.call(S.chips.querySelectorAll('.v3d-chip:not(.v3d-fallback-chip)')).forEach(function (c) { c.remove(); });
    if (S.opts.provenance === false) return;
    var seen = {};
    S.layers.forEach(function (L) {
      var p = L.opts.provenance; if (!p || L.opts.visible === false) return;
      var kind = p.kind || 'computed', key = kind + '|' + (p.text || '');
      if (seen[key]) return; seen[key] = 1;
      var c = el('span', 'v3d-chip', kind + (p.text ? ' · ' + p.text : '')); c.setAttribute('data-kind', kind); c.title = p.title || '';
      S.chips.appendChild(c);
    });
  };

  SP.add = function (L) {
    if (!L || !L.type) throw new Error('Viz3D: S.add expects a layer from Viz3D.<layer>(…)');
    if (L.type === 'cameraPresets') { Object.assign(this.presets, L.opts.presets || {}); }
    this.layers.push(L);
    if (IMPL[L.type] && IMPL[L.type].dom) IMPL[L.type].dom(this, L);
    if (this.active) this._build(L);
    this._decor(); this.render();
    return L;
  };
  SP.get = function (id) { return this.layers.filter(function (L) { return L.id === id; })[0] || null; };
  SP.remove = function (id) {
    var L = this.get(id); if (!L) return;
    disposeObj(L.obj); if (L.dom && L.dom.parentNode) L.dom.parentNode.removeChild(L.dom);
    this.layers.splice(this.layers.indexOf(L), 1); this._decor(); this.render();
  };
  SP.set = function (id, params) {
    var L = this.get(id); if (!L) throw new Error('Viz3D: no layer "' + id + '"');
    Object.assign(L.opts, params || {});
    var impl = IMPL[L.type], keys = Object.keys(params || {});
    if (L.dom) L.dom.hidden = L.opts.visible === false;
    if (keys.length === 1 && keys[0] === 'visible') { if (L.obj) L.obj.visible = L.opts.visible !== false; this._decor(); this.render(); return L; }
    if (this.active) {
      if (impl.update && L.obj) impl.update(this, L, params || {}); else { disposeObj(L.obj); L.obj = null; this._build(L); }
    } else if (impl.values) impl.values(L);
    if (impl.dom) impl.dom(this, L);
    this.render();
    return L;
  };
  SP.render = function () {
    var S = this; if (S._raf) return;
    S._raf = global.requestAnimationFrame(function () { S._raf = 0; S.renderNow(); });
  };
  SP.renderNow = function () {
    var S = this, w = S.holder.clientWidth, hgt = S.holder.clientHeight;
    if (S.fallback) { if (S.P) S.P.draw(S._prims()); S.frames++; return; }
    if (!S.active || S.lost || !w || !hgt) return;
    var sz = S.renderer.getSize(new S.THREE.Vector2());
    if (sz.x !== w || sz.y !== hgt) { S.renderer.setSize(w, hgt, false); S.camera.aspect = w / hgt; S.camera.updateProjectionMatrix(); S.css2d.setSize(w, hgt); }
    S.layers.forEach(function (L) { var impl = IMPL[L.type]; if (impl.frame && L.obj) impl.frame(S, L); });
    S.renderer.render(S.scene, S.camera); S.css2d.render(S.scene, S.camera);
    S.frames++; S.emit('frame');
  };
  SP._prims = function () {
    var S = this, out = { lines: [], points: [], arrows: [], polys: [], labels: [] };
    S.layers.forEach(function (L) {
      var impl = IMPL[L.type]; if (!impl.proj3 || L.opts.visible === false) return;
      if (impl.values) impl.values(L);
      var p = impl.proj3(S, L) || {};
      Object.keys(out).forEach(function (k) { if (p[k]) out[k] = out[k].concat(p[k]); });
    });
    return out;
  };
  SP.pick = function (ev) {
    var S = this; if (!S.active) return null;
    var r = S.canvas.getBoundingClientRect(), T = S.THREE;
    S.raycaster.setFromCamera(new T.Vector2((ev.clientX - r.left) / r.width * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1), S.camera);
    var objs = S.layers.filter(function (L) { return L.obj && L.opts.pick !== false && IMPL[L.type].pickable; }).map(function (L) { return L.obj; });
    var hit = S.raycaster.intersectObjects(objs, true)[0]; if (!hit) return null;
    var o = hit.object; while (o && !o.userData.layerId) o = o.parent;
    var p = hit.point.toArray(), out = { layer: o ? o.userData.layerId : null, point: p, instanceId: hit.instanceId, object: hit.object };
    var L = out.layer && S.get(out.layer);
    if (L && L.type === 'globe') { var g = L.obj, inv = g.matrixWorld.clone().invert(), lp = hit.point.clone().applyMatrix4(inv).toArray(); out.lonlat = Viz3D.xyzToLonlat(lp); }
    return out;
  };
  SP.toScreen = function (v) {
    var S = this;
    if (S.fallback) { var a = S.P.project(v); return { x: a.x, y: a.y, visible: true }; }
    if (!S.active) return { x: 0, y: 0, visible: false };
    var p = new S.THREE.Vector3().fromArray(v).project(S.camera);
    return { x: (p.x + 1) / 2 * S.holder.clientWidth, y: (1 - p.y) / 2 * S.holder.clientHeight, visible: p.z > -1 && p.z < 1 };
  };
  SP.goto = function (name, ms) {
    var S = this, P = S.presets[name]; if (!P) throw new Error('Viz3D: no camera preset "' + name + '"');
    if (S.fallback) { var d = M.sub(P.pos, P.target || [0, 0, 0]); S.P.set({ theta: Math.atan2(d[1], d[0]), phi: Math.asin(d[2] / (M.norm(d) || 1)) }); return Promise.resolve(); }
    if (!S.active) { S._camPos = P.pos; S._camTarget = P.target || [0, 0, 0]; return Promise.resolve(); }
    var p0 = S.camera.position.toArray(), t0 = S.controls.target.toArray(), p1 = P.pos, t1 = P.target || [0, 0, 0];
    var dur = REDUCED ? 0 : (ms === undefined ? 700 : ms), start = global.performance.now();
    return new Promise(function (res) {
      function step(now) {
        var u = dur ? Math.min(1, (now - start) / dur) : 1, e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        S.camera.position.set(p0[0] + (p1[0] - p0[0]) * e, p0[1] + (p1[1] - p0[1]) * e, p0[2] + (p1[2] - p0[2]) * e);
        S.controls.target.set(t0[0] + (t1[0] - t0[0]) * e, t0[1] + (t1[1] - t0[1]) * e, t0[2] + (t1[2] - t0[2]) * e);
        S.controls.update(); S.renderNow();
        if (u < 1) global.requestAnimationFrame(step); else res();
      }
      if (!dur) step(start); else global.requestAnimationFrame(step);
    });
  };
  /** Fixed-dt loop bound to the app's transport (R2 §4.2): one clock, steps owed accumulate, clamped after a tab switch. */
  SP.loop = function (cfg) {
    var S = this, acc = 0, last = null, t = cfg.t0 || 0, DT = cfg.dt, maxN = cfg.stepsPerFrameMax || 20;
    S.loopStop();
    function frame(now) {
      if (doc.hidden || (cfg.playing && !cfg.playing())) { last = null; S._loop = global.requestAnimationFrame(frame); return; }
      var wall = last === null ? 0 : Math.min((now - last) / 1000, 0.1); last = now;
      acc += wall * (cfg.speed ? cfg.speed() : 1) * (cfg.simPerSec || 1);
      var n = 0; while (acc >= DT && n++ < maxN) { cfg.step(DT, t); acc -= DT; t += DT; }
      if (n > 0) { if (cfg.onTime) cfg.onTime(t); S.renderNow(); }
      S._loop = global.requestAnimationFrame(frame);
    }
    S._loop = global.requestAnimationFrame(frame);
    return { stop: function () { S.loopStop(); }, time: function () { return t; }, reset: function (t0) { t = t0 || 0; acc = 0; } };
  };
  SP.loopStop = function () { if (this._loop) global.cancelAnimationFrame(this._loop); this._loop = 0; };
  /** Tap on "3-D paused": always rebuild on a fresh canvas (forceContextRestore only revives a context WE lost on purpose). */
  SP.restore = function () { var S = this; if (S.lost || (!S.active && !S.fallback && !S._disposed)) S._recreate(); };
  SP._recreate = function () {
    var S = this; if (S._disposed || S.fallback) return;
    clearTimeout(S._autoRestore);
    if (S.renderer) {
      S._camPos = S.camera.position.toArray(); S._camTarget = S.controls.target.toArray();
      S.layers.forEach(function (L) { disposeObj(L.obj); L.obj = null; });
      S._teardownGL();
    }
    S.lost = false; S.paused.hidden = true;
    try { S._createGL(); } catch (e) { console.warn('viz3d: could not rebuild the 3-D view, using the canvas projector', e); S._toFallback('WebGL could not be restarted'); return; }
    S.emit('contextrestored');
  };
  /** Dispose everything; returns renderer.info.memory measured after the layers were freed (audit: must be 0, 0). */
  SP.dispose = function () {
    var S = this; S.loopStop(); S._disposed = true;
    if (S._io) S._io.disconnect();
    var mem = null;
    S.layers.forEach(function (L) { disposeObj(L.obj); L.obj = null; if (L.dom && L.dom.parentNode) L.dom.parentNode.removeChild(L.dom); });
    if (S._luts) Object.keys(S._luts).forEach(function (k) { S._luts[k].dispose(); });
    if (S.renderer) { S.renderer.renderLists.dispose(); mem = { geometries: S.renderer.info.memory.geometries, textures: S.renderer.info.memory.textures }; S._teardownGL(); }
    if (S.P) S.P.dispose();
    if (S.ui.parentNode) S.ui.parentNode.removeChild(S.ui);
    var i = Viz3D.scenes.indexOf(S); if (i >= 0) Viz3D.scenes.splice(i, 1);
    return mem;
  };
  SP.selftestRows = function () {
    var S = this, rows = [];
    S.layers.forEach(function (L) { var impl = IMPL[L.type]; if (impl.selftest) { try { rows = rows.concat(impl.selftest(S, L) || []); } catch (e) { rows.push({ name: L.id + ': selftest threw ' + e.message, js: NaN, expect: 0 }); } } });
    return rows;
  };
  /** GPU read-back: sample a texture at (u, v) on the GPU into a 1×1 float target and read it (R2 §4.1 third leg). */
  SP.gpuSample = function (tex, u, v) {
    var S = this, T = S.THREE; if (!S.active) return NaN;
    var float = !!S.renderer.extensions.get('EXT_color_buffer_float');
    var rt = new T.WebGLRenderTarget(1, 1, { type: float ? T.FloatType : T.UnsignedByteType, format: T.RGBAFormat });
    var mat = new T.ShaderMaterial({ uniforms: { tex: { value: tex }, uv0: { value: new T.Vector2(u, v) } },
      vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: 'uniform sampler2D tex; uniform vec2 uv0; void main(){ gl_FragColor = vec4(texture2D(tex, uv0).r, 0.0, 0.0, 1.0); }' });
    var geo = new T.PlaneGeometry(2, 2), sc = new T.Scene(), cam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    sc.add(new T.Mesh(geo, mat));
    var prev = S.renderer.getRenderTarget(); S.renderer.setRenderTarget(rt); S.renderer.render(sc, cam);
    var buf = float ? new Float32Array(4) : new Uint8Array(4); S.renderer.readRenderTargetPixels(rt, 0, 0, 1, 1, buf); S.renderer.setRenderTarget(prev);
    rt.dispose(); geo.dispose(); mat.dispose();
    return float ? buf[0] : buf[0] / 255;
  };
  SP.cameraState = function () {
    var S = this;
    if (S.fallback) return { theta: S.P.state.theta, phi: S.P.state.phi, zoom: S.P.state.zoom };
    if (!S.active) return null;
    var p = S.camera.position, t = S.controls.target;
    return { pos: [p.x, p.y, p.z], target: [t.x, t.y, t.z], dist: p.distanceTo(t) };
  };
  SP.variance = function () {            // pixel variance of what is on screen: 0 = blank canvas (audit)
    var S = this, src = S.fallback ? (S.P && S.P.canvas) : S.canvas;
    if (!src || !src.width || !src.height) return 0;
    if (!S.fallback) S.renderNow();
    var c = el('canvas'); c.width = 64; c.height = 64; var x = c.getContext('2d');
    if (S.fallback) { x.fillStyle = css('bg', '#f5f6fb'); x.fillRect(0, 0, 64, 64); }
    x.drawImage(src, 0, 0, 64, 64);
    var d = x.getImageData(0, 0, 64, 64).data, n = 0, s = 0, s2 = 0;
    for (var i = 0; i < d.length; i += 4) { var l = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; s += l; s2 += l * l; n++; }
    return s2 / n - (s / n) * (s / n);
  };

  Viz3D.scene = function (view, opts) {
    var S = new Scene(view, opts); Viz3D.scenes.push(S);
    return S._init().then(function (x) { return x; }, function (e) { console.error('VIZ-ERROR viz3d scene', e); return null; });
  };
  Viz3D.selftestRows = function (S) { return S ? S.selftestRows() : []; };

  /* ---------- audit hooks (tools/shot.py --3d) ---------- */
  var readyFired = false;
  function fireReady() {
    if (readyFired || !Viz3D.scenes.length || !Viz3D.scenes.every(function (S) { return S.ready; })) return;
    readyFired = true;
    try { global.dispatchEvent(new CustomEvent('viz3d:ready', { detail: { scenes: Viz3D.scenes.length } })); } catch (e) { /* old browser */ }
  }
  global.VIZ3D = {
    kit: Viz3D,
    isReady: function () { return Viz3D.scenes.length > 0 && Viz3D.scenes.every(function (S) { return S.ready && (S.fallback || S.frames > 0 || !S.holder.clientWidth); }); },
    info: function () {
      return Viz3D.scenes.map(function (S) {
        var gl = S.renderer && S.renderer.getContext(), dbg = gl && gl.getExtension('WEBGL_debug_renderer_info');
        return { fallback: S.fallback, why: S.fallbackWhy || null, active: S.active, lost: S.lost, frames: S.frames,
                 visible: !!S.holder.offsetParent && S.holder.clientWidth > 0 && S.holder.clientHeight > 0,
                 w: S.holder.clientWidth, h: S.holder.clientHeight, webgl2: !!(S.renderer && S.renderer.capabilities.isWebGL2),
                 contextLost: gl ? gl.isContextLost() : null, gpu: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : null,
                 layers: S.layers.map(function (L) { return L.type; }), chips: S.chips.children.length, badge: S.badge.textContent };
      });
    },
    variance: function (i) { return Viz3D.scenes[i].variance(); },
    cameraState: function (i) { return Viz3D.scenes[i].cameraState(); },
    canvasRect: function (i) { var S = Viz3D.scenes[i], c = S.fallback ? S.P.canvas : S.canvas, r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; },
    forceLoss: function (i) { var S = Viz3D.scenes[i]; S.renderer.forceContextLoss(); return true; },
    pausedShown: function (i) { var S = Viz3D.scenes[i]; return !S.paused.hidden && S.paused.offsetParent !== null; },
    restore: function (i) { Viz3D.scenes[i].restore(); return true; },
    disposeCheck: function (i) { return Viz3D.scenes[i].dispose(); },
    selftest: function () { return Viz3D.scenes.reduce(function (a, S) { return a.concat(S.selftestRows()); }, []); }
  };

  /* ======================================================================================================
     Layers
     ====================================================================================================== */
  function color(T, c, fb) {             // '#hex' | 'rgb(…)' | '--viz-text' | 'token:--viz-bg' (theme tokens)
    if (!c) return new T.Color(fb);
    var tok = c.indexOf('token:') === 0 ? c.slice(6) : c;
    if (tok.indexOf('--viz-') === 0) tok = css(tok.slice(6), fb || '#697386');
    return new T.Color(tok);
  }
  var TEAL = '#0fa39c', ORANGE = '#f97316', VIOLET = '#7c3aed', POS = '#16a34a', NEG = '#9333ea';

  /* ---- arrows: two InstancedMeshes (shaft + head) sharing one placement rule ---- */
  function arrowMeshes(S, n, radius) {
    var T = S.THREE, r = radius || 0.025;
    var shaft = new T.CylinderGeometry(r, r, 1, 10, 1); shaft.translate(0, 0.5, 0);                   // 0 → 1 along +Y
    var head = new T.ConeGeometry(r * 2.6, 1, 14, 1); head.translate(0, 0.5, 0);                      // 0 → 1 along +Y
    var mat = new T.MeshLambertMaterial();
    var a = new T.InstancedMesh(shaft, mat, n), b = new T.InstancedMesh(head, mat.clone(), n);
    a.instanceMatrix.setUsage(T.DynamicDrawUsage); b.instanceMatrix.setUsage(T.DynamicDrawUsage);
    var g = new T.Group(); g.add(a); g.add(b); g.userData.shaft = a; g.userData.head = b; g.userData.r = r;
    return g;
  }
  function setArrow(S, g, i, from, vec, col, headLen) {
    var T = S.THREE, a = g.userData.shaft, b = g.userData.head, L = M.norm(vec), r = g.userData.r;
    var hl = Math.min(headLen || r * 7, L * 0.45), Ls = Math.max(L - hl, 1e-6);
    var dir = L > 0 ? new T.Vector3(vec[0] / L, vec[1] / L, vec[2] / L) : new T.Vector3(0, 0, 1);
    var qt = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), dir), m = new T.Matrix4();
    m.compose(new T.Vector3().fromArray(from), qt, new T.Vector3(1, L > 0 ? Ls : 1e-6, 1)); a.setMatrixAt(i, m);
    m.compose(new T.Vector3(from[0] + dir.x * Ls, from[1] + dir.y * Ls, from[2] + dir.z * Ls), qt, new T.Vector3(L > 0 ? 1 : 1e-6, L > 0 ? hl : 1e-6, L > 0 ? 1 : 1e-6)); b.setMatrixAt(i, m);
    var c = color(T, col, VIOLET); a.setColorAt(i, c); b.setColorAt(i, c);
    a.instanceMatrix.needsUpdate = true; b.instanceMatrix.needsUpdate = true;
    if (a.instanceColor) a.instanceColor.needsUpdate = true; if (b.instanceColor) b.instanceColor.needsUpdate = true;
  }
  function drawnArrowDir(S, g, i) {      // read the placed head back: the direction actually drawn (drawing selftest)
    var T = S.THREE, m = new T.Matrix4(); g.userData.head.getMatrixAt(i, m);
    var y = new T.Vector3(0, 1, 0).applyMatrix4(m).sub(new T.Vector3().setFromMatrixPosition(m)).normalize();
    return [y.x, y.y, y.z];
  }
  function label3(S, at, html, cls) {
    var e = el('div', 'v3d-label' + (cls ? ' ' + cls : '')); e.innerHTML = html;
    var o = new LIB.CSS2DObject(e); o.position.fromArray(at); return o;
  }
  function texLabel(S, at, tex, text, colr) {
    var e = el('div', 'v3d-label'); if (colr) e.style.color = colr;
    if (tex) Viz.renderTex(e, tex, false); else e.textContent = text || '';
    var o = new LIB.CSS2DObject(e); o.position.fromArray(at); return o;
  }
  function lineObj(S, pts, colr, opt) {
    opt = opt || {}; var T = S.THREE, g = new T.BufferGeometry().setFromPoints(pts.map(function (p) { return new T.Vector3(p[0], p[1], p[2]); }));
    var mat = opt.dash ? new T.LineDashedMaterial({ color: color(T, colr, '#697386'), dashSize: opt.dash[0], gapSize: opt.dash[1], transparent: opt.opacity !== undefined, opacity: opt.opacity === undefined ? 1 : opt.opacity })
      : new T.LineBasicMaterial({ color: color(T, colr, '#697386'), transparent: opt.opacity !== undefined, opacity: opt.opacity === undefined ? 1 : opt.opacity });
    var l = opt.segments ? new T.LineSegments(g, mat) : new T.Line(g, mat); if (opt.dash) l.computeLineDistances();
    return l;
  }

  // vectorField({points, vectors | fn(p) → v, scale, color | colorBy:'magnitude', lut, range, radius, maxArrows})
  Viz3D.vectorField = function (o) { return layer('vectorField', o); };
  function vfData(L) {
    var o = L.opts, pts = (o.points || []).slice(0, o.maxArrows || 4000);
    var vs = pts.map(function (p, i) { return isFn(o.vectors) ? o.vectors(p, i) : o.vectors[i]; });
    return { pts: pts, vs: vs.map(function (v) { return M.scale(v, o.scale || 1); }) };
  }
  IMPL.vectorField = {
    pickable: true,
    build: function (S, L) {
      var o = L.opts, d = vfData(L), g = arrowMeshes(S, Math.max(1, d.pts.length), o.radius);
      var mags = d.vs.map(M.norm), mx = Math.max.apply(null, mags.concat([1e-30])), rg = o.range || [0, mx];
      d.pts.forEach(function (p, i) {
        var c = o.colorBy === 'magnitude' ? Viz3D.lutCss(o.lut || 'viridis', (mags[i] - rg[0]) / ((rg[1] - rg[0]) || 1)) : (isFn(o.color) ? o.color(i) : o.color || TEAL);
        setArrow(S, g, i, p, d.vs[i], c);
      });
      g.userData.shaft.count = g.userData.head.count = d.pts.length;
      return g;
    },
    proj3: function (S, L) { var d = vfData(L); return { arrows: d.pts.map(function (p, i) { return { from: p, to: M.add(p, d.vs[i]), color: isFn(L.opts.color) ? L.opts.color(i) : L.opts.color || TEAL }; }) }; }
  };

  // vectorGlyph({at, op:'dot'|'cross', a:{v, label, color}, b:{v, label, color}, showParallelogram, showArc, showShadow, readout})
  Viz3D.vectorGlyph = function (o) { return layer('vectorGlyph', o); };
  function glyphValues(L) {
    var o = L.opts, a = o.a.v, b = o.b.v, at = o.at || [0, 0, 0], th = M.angle(a, b);
    var v = { op: o.op || 'cross', a: a, b: b, at: at, angleDeg: th / D2R, na: M.norm(a), nb: M.norm(b), dot: M.dot(a, b) };
    v.proj = v.dot / (v.nb || 1);                                                  // signed length of a's shadow on b
    v.foot = M.add(at, M.scale(M.unit(b), v.proj));
    v.cross = M.cross(a, b); v.crossMag = M.norm(v.cross); v.area = v.na * v.nb * Math.sin(th);
    L.values = v; return v;
  }
  IMPL.vectorGlyph = {
    pickable: true, values: glyphValues,
    build: function (S, L) {
      var T = S.THREE, o = L.opts, v = glyphValues(L), at = v.at, g = new T.Group();
      var ca = o.a.color || TEAL, cb = o.b.color || ORANGE, ar = arrowMeshes(S, 3, o.radius || 0.03);
      setArrow(S, ar, 0, at, v.a, ca); setArrow(S, ar, 1, at, v.b, cb);
      ar.userData.shaft.count = ar.userData.head.count = v.op === 'cross' ? 3 : 2;
      if (v.op === 'cross') setArrow(S, ar, 2, at, v.cross, o.resultColor || VIOLET);
      g.add(ar); g.userData.arrows = ar;
      if (v.op === 'cross' && o.showParallelogram !== false) {
        var P = [at, M.add(at, v.a), M.add(M.add(at, v.a), v.b), M.add(at, v.b)], pos = new Float32Array([].concat(P[0], P[1], P[2], P[0], P[2], P[3]));
        var pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pos, 3));
        var pm = new T.Mesh(pg, new T.MeshBasicMaterial({ color: color(T, o.resultColor || VIOLET), transparent: true, opacity: 0.18, side: T.DoubleSide, depthWrite: false }));
        g.add(pm); g.userData.para = pm;
        g.add(lineObj(S, [P[1], P[2], P[3]], o.resultColor || VIOLET, { opacity: 0.6 }));
      }
      if (v.op === 'cross' && o.showArc !== false && v.na > 0 && v.nb > 0) {
        var ua = M.unit(v.a), ub = M.unit(v.b), e = M.unit(M.sub(ub, M.scale(ua, M.dot(ua, ub)))), th = v.angleDeg * D2R, rr = Math.min(v.na, v.nb) * 0.35, arc = [];
        for (var k = 0; k <= 24; k++) { var s = th * k / 24; arc.push(M.add(at, M.add(M.scale(ua, rr * Math.cos(s)), M.scale(e, rr * Math.sin(s))))); }
        g.add(lineObj(S, arc, '-' + '-viz-text', { opacity: 0.85 }));
      }
      if (v.op === 'dot' && o.showShadow !== false) {
        var sc = v.dot >= 0 ? POS : NEG, sh = arrowMeshes(S, 1, (o.radius || 0.03) * 1.6);
        sh.userData.head.visible = false; setArrow(S, sh, 0, at, M.sub(v.foot, at), sc, 1e-6); g.add(sh); g.userData.shadow = sh;
        g.add(lineObj(S, [M.add(at, v.a), v.foot], '-' + '-viz-muted', { dash: [0.05, 0.04] }));
      }
      var la = o.a.label, lb = o.b.label;
      if (la) g.add(texLabel(S, M.add(at, M.scale(v.a, 1.08)), la, null, ca));
      if (lb) g.add(texLabel(S, M.add(at, M.scale(v.b, 1.08)), lb, null, cb));
      if (o.readout !== false) {
        var txt = v.op === 'cross' ? '|a×b| = ' + Viz.fmt(v.crossMag, { sig: 3 }) + ' (θ = ' + Viz.fmt(v.angleDeg, { sig: 3 }) + '°)'
          : 'a·b = ' + Viz.fmt(v.dot, { sig: 3 }) + ' (θ = ' + Viz.fmt(v.angleDeg, { sig: 3 }) + '°)';
        var bar = '<span class="v3d-bar" style="width:' + Math.min(60, Math.abs(v.op === 'cross' ? v.crossMag : v.dot) * 20) + 'px;background:' + (v.op === 'cross' ? VIOLET : (v.dot >= 0 ? POS : NEG)) + '"></span>';
        g.add(label3(S, M.add(at, v.op === 'cross' ? M.scale(v.cross, 1.12) : [0, 0, -0.25]), Viz.esc(txt) + bar, 'v3d-readout'));
      }
      return g;
    },
    proj3: function (S, L) {
      var v = glyphValues(L), at = v.at, o = L.opts, out = { arrows: [{ from: at, to: M.add(at, v.a), color: o.a.color || TEAL }, { from: at, to: M.add(at, v.b), color: o.b.color || ORANGE }], polys: [], lines: [], labels: [] };
      if (v.op === 'cross') { out.arrows.push({ from: at, to: M.add(at, v.cross), color: VIOLET }); out.polys.push({ pts: [at, M.add(at, v.a), M.add(M.add(at, v.a), v.b), M.add(at, v.b)], fill: VIOLET, alpha: 0.18 }); }
      else { out.lines.push({ pts: [at, v.foot], color: v.dot >= 0 ? POS : NEG, width: 5 }, { pts: [M.add(at, v.a), v.foot], color: '#697386', dash: [4, 4] }); }
      out.labels.push({ p: M.add(at, M.scale(v.a, 1.08)), text: 'a' }, { p: M.add(at, M.scale(v.b, 1.08)), text: 'b' });
      return out;
    },
    selftest: function (S, L) {
      var v = glyphValues(L), rows = [], id = L.id;
      if (v.op === 'cross') {
        rows.push({ name: id + ': |a×b| = |a||b| sin θ', js: v.crossMag, expect: v.area, rtol: 1e-9 });
        if (S.active && L.obj) {
          var d = drawnArrowDir(S, L.obj.userData.arrows, 2);
          rows.push({ name: id + ': drawn result arrow ⟂ a (drawing invariant)', js: M.dot(d, M.unit(v.a)), expect: 0, atol: 1e-6 });
          rows.push({ name: id + ': drawn result arrow ⟂ b (drawing invariant)', js: M.dot(d, M.unit(v.b)), expect: 0, atol: 1e-6 });
          rows.push({ name: id + ': drawn result follows the right-hand rule', js: M.dot(d, M.unit(v.cross)), expect: 1, atol: 1e-6 });
          if (L.obj.userData.para) {
            var p = L.obj.userData.para.geometry.attributes.position.array, e1 = [p[3] - p[0], p[4] - p[1], p[5] - p[2]], e2 = [p[15] - p[0], p[16] - p[1], p[17] - p[2]];
            rows.push({ name: id + ': drawn parallelogram area = |a×b| (float32)', js: M.norm(M.cross(e1, e2)), expect: v.crossMag, rtol: 1e-5 });
          }
        }
      } else {
        rows.push({ name: id + ': a·b = |a||b| cos θ', js: v.dot, expect: v.na * v.nb * Math.cos(v.angleDeg * D2R), rtol: 1e-9, atol: 1e-12 });
        if (S.active && L.obj && L.obj.userData.shadow) {
          var m = new S.THREE.Matrix4(); L.obj.userData.shadow.userData.shaft.getMatrixAt(0, m);
          var len = new S.THREE.Vector3(0, 1, 0).applyMatrix4(m).sub(new S.THREE.Vector3().setFromMatrixPosition(m)).length();
          rows.push({ name: id + ': drawn shadow length = |a·b|/|b| (float32)', js: len, expect: Math.abs(v.proj), rtol: 1e-5, atol: 1e-6 });
        }
      }
      return rows;
    }
  };

  // labels([{at, tex | text, priority, color}], {maxVisible:'auto' | n})
  Viz3D.labels = function (items, o) { o = o || {}; o.items = items; return layer('labels', o); };
  IMPL.labels = {
    build: function (S, L) {
      var T = S.THREE, g = new T.Group();
      L.opts.items.forEach(function (it, i) { var o = texLabel(S, it.at, it.tex, it.text, it.color); o.userData.priority = it.priority === undefined ? i : it.priority; g.add(o); });
      return g;
    },
    frame: function (S, L) {
      var w = S.holder.clientWidth, mv = L.opts.maxVisible, n = mv === undefined || mv === 'auto' ? (w < 420 ? 3 : 6) : mv;
      L.obj.children.slice().sort(function (a, b) { return a.userData.priority - b.userData.priority; }).forEach(function (o, i) { o.visible = i < n; });
    },
    proj3: function (S, L) { return { labels: L.opts.items.map(function (it) { return { p: it.at, text: it.text || String(it.tex || '').replace(/\\[a-zA-Z]+|[{}]/g, '') }; }) }; }
  };

  // legend({lut, range, units, title}) — a 2-D strip in the corner (DOM, theme-aware); also works in the fallback
  Viz3D.legend = function (o) { return layer('legend', o); };
  IMPL.legend = {
    dom: function (S, L) {
      var o = L.opts; if (L.dom && L.dom.parentNode) L.dom.parentNode.removeChild(L.dom);
      var box = el('div', 'v3d-legend'), cv = el('canvas'); cv.width = 128; cv.height = 10;
      var x = cv.getContext('2d'); for (var i = 0; i < 128; i++) { x.fillStyle = Viz3D.lutCss(o.lut || 'viridis', i / 127); x.fillRect(i, 0, 1, 10); }
      box.appendChild(el('div', 'v3d-legend-title', (o.title || '') + (o.units ? ' [' + o.units + ']' : '')));
      box.appendChild(cv);
      var ends = el('div', 'v3d-legend-ends'); ends.appendChild(el('span', '', Viz.fmt(o.range[0], { sig: 3 }))); ends.appendChild(el('span', '', Viz.fmt(o.range[1], { sig: 3 }))); box.appendChild(ends);
      S.ui.appendChild(box); L.dom = box; box.hidden = o.visible === false;
    }
  };

  // cameraPresets({name: {pos, target}}, {tween}) — S.goto(name)
  Viz3D.cameraPresets = function (presets, o) { o = o || {}; o.presets = presets; return layer('cameraPresets', o); };
  IMPL.cameraPresets = {};

  // axesTriad({at, length, labels:['E','N','U']})
  Viz3D.axesTriad = function (o) { return layer('axesTriad', o); };
  function triadData(o) { var at = o.at || [0, 0, 0], l = o.length || 0.4; return { at: at, v: [[l, 0, 0], [0, l, 0], [0, 0, l]], lab: o.labels || ['x', 'y', 'z'], col: ['#e11d6a', '#0fa39c', '#2563eb'] }; }
  IMPL.axesTriad = {
    build: function (S, L) {
      var T = S.THREE, d = triadData(L.opts), g = new T.Group(), ar = arrowMeshes(S, 3, (L.opts.length || 0.4) * 0.03);
      d.v.forEach(function (v, i) { setArrow(S, ar, i, d.at, v, d.col[i]); g.add(texLabel(S, M.add(d.at, M.scale(v, 1.15)), null, d.lab[i], d.col[i])); });
      g.add(ar); return g;
    },
    proj3: function (S, L) { var d = triadData(L.opts); return { arrows: d.v.map(function (v, i) { return { from: d.at, to: M.add(d.at, v), color: d.col[i] }; }), labels: d.v.map(function (v, i) { return { p: M.add(d.at, M.scale(v, 1.15)), text: d.lab[i] }; }) }; }
  };

  // betaPlane({size:[sx, sy], Lx, Ly (m, for the scale bar), f0, beta, grid:[nx, ny], axes:'east,north,up', scaleBar:{km}})
  Viz3D.betaPlane = function (o) { return layer('betaPlane', o); };
  function bpData(o) {
    var sz = o.size || [2, 2], nx = (o.grid || [8, 8])[0], ny = (o.grid || [8, 8])[1], lines = [], i;
    for (i = 0; i <= nx; i++) { var x = -sz[0] / 2 + sz[0] * i / nx; lines.push([[x, -sz[1] / 2, 0], [x, sz[1] / 2, 0]]); }
    for (i = 0; i <= ny; i++) { var y = -sz[1] / 2 + sz[1] * i / ny; lines.push([[-sz[0] / 2, y, 0], [sz[0] / 2, y, 0]]); }
    var bar = null;
    if (o.scaleBar && o.Lx) { var km = o.scaleBar.km || 1000, len = km * 1000 / o.Lx * sz[0]; bar = { pts: [[-sz[0] / 2, -sz[1] / 2 - 0.08, 0], [-sz[0] / 2 + len, -sz[1] / 2 - 0.08, 0]], text: km + ' km' }; }
    return { sz: sz, lines: lines, bar: bar };
  }
  IMPL.betaPlane = {
    pickable: true,
    build: function (S, L) {
      var T = S.THREE, o = L.opts, d = bpData(o), g = new T.Group();
      var pl = new T.Mesh(new T.PlaneGeometry(d.sz[0], d.sz[1]), new T.MeshBasicMaterial({ color: color(T, o.color || '#2563eb'), transparent: true, opacity: 0.08, side: T.DoubleSide, depthWrite: false }));
      g.add(pl);
      var seg = []; d.lines.forEach(function (l) { seg.push(l[0], l[1]); });
      g.add(lineObj(S, seg, '-' + '-viz-muted', { segments: true, opacity: 0.45 }));
      var labs = (o.axes || 'east,north,up').split(','), tri = IMPL.axesTriad.build(S, { opts: { at: [-d.sz[0] / 2, -d.sz[1] / 2, 0], length: Math.min(d.sz[0], d.sz[1]) * 0.22, labels: labs } });
      g.add(tri);
      if (d.bar) { g.add(lineObj(S, d.bar.pts, '-' + '-viz-text')); g.add(texLabel(S, [(d.bar.pts[0][0] + d.bar.pts[1][0]) / 2, d.bar.pts[0][1] - 0.08, 0], null, d.bar.text)); }
      return g;
    },
    proj3: function (S, L) { var d = bpData(L.opts), out = { lines: d.lines.map(function (l) { return { pts: l, color: '#697386', width: 1 }; }), labels: [] }; if (d.bar) { out.lines.push({ pts: d.bar.pts, color: '#1a1f36', width: 2 }); out.labels.push({ p: d.bar.pts[1], text: d.bar.text }); } return out; }
  };

  // globe({radius, field:{data, w, h, scale, offset, nan, latOrder:'S->N'|'N->S', lon0, units, check:[{lon, lat, value}]},
  //        lut, range, coast, graticule, angle, color, opacity, latLabels})
  Viz3D.globe = function (o) { return layer('globe', o); };
  /** Bilinear value of a lon–lat grid {data, w, h, scale, offset, nan, latOrder, lon0} at (lon, lat), in data units.
      Grid cells are centred (texel j covers lat −90 + 180 j/h … +180/h); longitude wraps; NaN where a corner is nan. */
  function gridSample(f, lon, lat) {
    var lon0 = f.lon0 === undefined ? -180 : f.lon0, isF = f.data instanceof Float32Array;
    var x = ((((lon - lon0) % 360) + 360) % 360) / 360 * f.w - 0.5, y = Math.max(0, Math.min(f.h - 1, (lat + 90) / 180 * f.h - 0.5));
    var i0 = Math.floor(x), fx = x - i0, j0 = Math.floor(y), fy = y - j0, j1 = Math.min(f.h - 1, j0 + 1);
    function at(i, j) {
      i = ((i % f.w) + f.w) % f.w; var jj = f.latOrder === 'N->S' ? f.h - 1 - j : j, raw = f.data[jj * f.w + i];
      if (f.nan !== undefined && raw === f.nan) return NaN;
      return isF ? raw : raw * (f.scale === undefined ? 1 : f.scale) + (f.offset || 0);
    }
    return (1 - fy) * ((1 - fx) * at(i0, j0) + fx * at(i0 + 1, j0)) + fy * ((1 - fx) * at(i0, j1) + fx * at(i0 + 1, j1));
  }
  Viz3D.gridSample = gridSample;
  /** Radius of a displaced globe at value v: r (1 + exaggeration · v / unitRadius), unitRadius = Earth radius in the
      field's length unit (default 6.371e6 m), so a 400 m height anomaly ×200 lifts the surface by 1.3 % of the radius. */
  function dispRadius(r, d, v) { return isFinite(v) ? r * (1 + (d.exaggeration || 1) * v / (d.unitRadius || 6.371e6)) : r; }
  function globeGeo(S, r, nLon, nLat, disp) {
    var T = S.THREE, pos = [], uv = [], nor = [], idx = [], val = [], nan = [];
    for (var j = 0; j <= nLat; j++) for (var i = 0; i <= nLon; i++) {
      var lon = -180 + 360 * i / nLon, lat = -90 + 180 * j / nLat, v = disp ? gridSample(disp, lon, lat) : 0;
      var p = Viz3D.lonlatToXYZ(lon, lat, disp ? dispRadius(r, disp, v) : r), u = Viz3D.lonlatToXYZ(lon, lat, 1);
      pos.push(p[0], p[1], p[2]); nor.push(u[0], u[1], u[2]); uv.push(i / nLon, j / nLat); val.push(isFinite(v) ? v : 0); nan.push(isFinite(v) ? 0 : 1);
    }
    for (j = 0; j < nLat; j++) for (i = 0; i < nLon; i++) { var a = j * (nLon + 1) + i, b = a + nLon + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3));
    g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
    if (disp) { g.setAttribute('aVal', new T.Float32BufferAttribute(val, 1)); g.setAttribute('aNan', new T.Float32BufferAttribute(nan, 1)); g.computeVertexNormals(); }
    return g;
  }
  function graticule(o) {
    var r = (o.radius || 1) * 1.001, step = o.graticule === undefined ? 30 : o.graticule, lines = [];
    if (!step) return lines;
    for (var lat = -90 + step; lat < 90; lat += step) { var l = []; for (var lo = -180; lo <= 180; lo += 3) l.push(Viz3D.lonlatToXYZ(lo, lat, r)); lines.push({ pts: l, eq: lat === 0 }); }
    for (var lon = -180; lon < 180; lon += step) { var m = []; for (var la = -90; la <= 90; la += 3) m.push(Viz3D.lonlatToXYZ(lon, la, r)); lines.push({ pts: m }); }
    return lines;
  }
  function fieldDecode(f, lon, lat) {   // CPU decode of the field at the texel containing (lon, lat), in data units
    var lon0 = f.lon0 === undefined ? -180 : f.lon0, i = Math.floor((((lon - lon0) % 360) + 360) % 360 / 360 * f.w) % f.w;
    var j = Math.min(f.h - 1, Math.floor((lat + 90) / 180 * f.h)); if (f.latOrder === 'N->S') j = f.h - 1 - j;
    var raw = f.data[j * f.w + i];
    return { i: i, j: j, raw: raw, value: f.data instanceof Float32Array ? raw : raw * (f.scale === undefined ? 1 : f.scale) + (f.offset || 0) };
  }
  IMPL.globe = {
    pickable: true,
    build: function (S, L) {
      var T = S.THREE, o = L.opts, r = o.radius || 1, g = new T.Group(), f = o.field, mat;
      if (f) {
        var isF = f.data instanceof Float32Array;
        var tex = new T.DataTexture(f.data, f.w, f.h, T.RedFormat, isF ? T.FloatType : T.UnsignedByteType);
        tex.magFilter = tex.minFilter = isF ? T.NearestFilter : T.LinearFilter; tex.wrapS = T.RepeatWrapping; tex.wrapT = T.ClampToEdgeWrapping;
        tex.colorSpace = T.NoColorSpace; tex.needsUpdate = true; L.fieldTex = tex;
        var rg = o.range || f.range || [0, 1];
        mat = new T.ShaderMaterial({
          uniforms: { field: { value: tex }, lut: { value: S._lutTex(o.lut || 'viridis') }, lo: { value: rg[0] }, hi: { value: rg[1] },
            scl: { value: isF ? 1 : 255 * (f.scale === undefined ? 1 : f.scale) }, off: { value: isF ? 0 : (f.offset || 0) },
            nanRaw: { value: f.nan === undefined ? -1 : f.nan / (isF ? 1 : 255) }, flipV: { value: f.latOrder === 'N->S' ? 1 : 0 },
            lonShift: { value: ((-180 - (f.lon0 === undefined ? -180 : f.lon0)) / 360) }, nanCol: { value: color(T, o.landColor || '#c9c3b6') }, L: { value: new T.Vector3(0.5, -0.4, 0.75).normalize() } },
          vertexShader: 'varying vec2 vUv; varying vec3 vN; void main(){ vUv = uv; vN = normalize(normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
          fragmentShader: [
            'uniform sampler2D field; uniform sampler2D lut; uniform float lo, hi, scl, off, nanRaw, flipV, lonShift; uniform vec3 nanCol; uniform vec3 L;',
            'varying vec2 vUv; varying vec3 vN;',
            'void main(){',
            '  vec2 uv = vec2(fract(vUv.x + lonShift), flipV > 0.5 ? 1.0 - vUv.y : vUv.y);',
            '  float raw = texture2D(field, uv).r;',
            '  float shade = 0.75 + 0.25 * max(dot(normalize(vN), L), 0.0);',
            '  if (nanRaw >= 0.0 && abs(raw - nanRaw) < 0.5 / 255.0) { gl_FragColor = vec4(nanCol * shade, 1.0); return; }',
            '  float val = raw * scl + off; float t = clamp((val - lo) / (hi - lo), 0.0, 1.0);',
            '  gl_FragColor = vec4(texture2D(lut, vec2(t, 0.5)).rgb * shade, 1.0);',
            '}'].join('\n')
        });
      } else if (o.displace) {
        var dr = o.range || o.displace.range || [-1, 1], dstep = (o.contours && o.contours.step) || 0;
        mat = new T.ShaderMaterial({
          uniforms: { lut: { value: S._lutTex(o.lut || 'cmocean.balance') }, lo: { value: dr[0] }, hi: { value: dr[1] }, step: { value: dstep },
            ink: { value: color(T, '--viz-text') }, nanCol: { value: color(T, o.landColor || '#c9c3b6') }, L: { value: new T.Vector3(0.5, -0.4, 0.75).normalize() } },
          vertexShader: 'attribute float aVal; attribute float aNan; varying float vVal; varying float vNan; varying vec3 vN; void main(){ vVal = aVal; vNan = aNan; vN = normalize(normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
          fragmentShader: [
            'uniform sampler2D lut; uniform float lo, hi, step; uniform vec3 ink, nanCol, L; varying float vVal; varying float vNan; varying vec3 vN;',
            'void main(){',
            '  float shade = 0.75 + 0.25 * max(dot(normalize(vN), L), 0.0);',
            '  if (vNan > 0.5) { gl_FragColor = vec4(nanCol * shade, 1.0); return; }',
            '  vec3 c = texture2D(lut, vec2(clamp((vVal - lo) / (hi - lo), 0.0, 1.0), 0.5)).rgb * shade;',
            '  if (step > 0.0) { float f = vVal / step; float w = fwidth(f); float line = 1.0 - smoothstep(0.0, 1.5 * w, abs(fract(f - 0.5) - 0.5)); c = mix(c, ink, 0.55 * line); }',
            '  gl_FragColor = vec4(c, 1.0);',
            '}'].join('\n')
        });
      } else mat = new T.MeshLambertMaterial({ color: color(T, o.color || '#9fc5e8'), transparent: o.opacity !== undefined, opacity: o.opacity === undefined ? 1 : o.opacity });
      var mesh = new T.Mesh(globeGeo(S, r, o.nLon || 192, o.nLat || 96, o.displace), mat); g.add(mesh); g.userData.mesh = mesh;
      var grat = o.displace ? graticule(o).map(function (l) { return { eq: l.eq, pts: l.pts.map(function (q) { var ll = Viz3D.xyzToLonlat(q); return Viz3D.lonlatToXYZ(ll[0], ll[1], dispRadius(r, o.displace, gridSample(o.displace, ll[0], ll[1])) * 1.001); }) }; }) : graticule(o), seg = [], eq = [];
      grat.forEach(function (l) { for (var k = 0; k + 1 < l.pts.length; k++) (l.eq ? eq : seg).push(l.pts[k], l.pts[k + 1]); });
      if (seg.length) g.add(lineObj(S, seg, '-' + '-viz-text', { segments: true, opacity: 0.25 }));
      if (eq.length) g.add(lineObj(S, eq, '-' + '-viz-text', { segments: true, opacity: 0.7 }));
      if (o.coast !== false && global.VIZ3D_COAST) {
        var cr = function (q) { return Viz3D.lonlatToXYZ(q[0], q[1], (o.displace ? dispRadius(r, o.displace, gridSample(o.displace, q[0], q[1])) : r) * 1.002); };   // coast rides on the (displaced) surface
        var cs = []; Viz3D.coast().forEach(function (line) { for (var k = 0; k + 1 < line.length; k++) cs.push(cr(line[k]), cr(line[k + 1])); });
        g.add(lineObj(S, cs, '-' + '-viz-text', { segments: true, opacity: 0.8 }));
      }
      if (o.latLabels) [-60, -30, 0, 30, 60].forEach(function (la) { g.add(texLabel(S, Viz3D.lonlatToXYZ(o.labelLon || -30, la, r * 1.04), null, (la === 0 ? 'Eq' : Math.abs(la) + '°' + (la > 0 ? 'N' : 'S')))); });
      g.rotation.z = (o.angle || 0);
      return g;
    },
    update: function (S, L, p) {
      var o = L.opts, g = L.obj;
      if ('angle' in p) g.rotation.z = o.angle || 0;
      if (p.range && L.fieldTex) { g.userData.mesh.material.uniforms.lo.value = o.range[0]; g.userData.mesh.material.uniforms.hi.value = o.range[1]; }
      var other = Object.keys(p).filter(function (k) { return k !== 'angle' && k !== 'range'; });
      if (other.length) { disposeObj(L.obj); L.obj = null; S._build(L); }
    },
    proj3: function (S, L) {
      var o = L.opts, out = { lines: [] }, rot = o.angle || 0, c = Math.cos(rot), s = Math.sin(rot);
      function R(p) { return [c * p[0] - s * p[1], s * p[0] + c * p[1], p[2]]; }
      if (o.displace) {          // a few displaced latitude rings show the sag without WebGL
        for (var la = -75; la <= 75; la += 15) { var ring = []; for (var lo = -180; lo <= 180; lo += 4) ring.push(R(Viz3D.lonlatToXYZ(lo, la, dispRadius(o.radius || 1, o.displace, gridSample(o.displace, lo, la)) * 1.001))); out.lines.push({ pts: ring, color: '#6c5ce7', width: la === 0 ? 1.6 : 1.1 }); }
      } else graticule(o).forEach(function (l) { out.lines.push({ pts: l.pts.map(R), color: '#697386', width: l.eq ? 1.5 : 0.7 }); });
      if (o.coast !== false && global.VIZ3D_COAST) Viz3D.coast().forEach(function (line) { out.lines.push({ pts: line.filter(function (_, k) { return k % 2 === 0 || k === line.length - 1; }).map(function (q) { return R(Viz3D.lonlatToXYZ(q[0], q[1], (o.radius || 1) * 1.002)); }), color: '#1a1f36', width: 1 }); });
      return out;
    },
    selftest: function (S, L) {
      var f = L.opts.field, rows = [], d = L.opts.displace;
      if (d && d.check) d.check.forEach(function (c) {
        var v = gridSample(d, c.lon, c.lat);
        rows.push({ name: L.id + ': displacement field at ' + c.lon + '°, ' + c.lat + '° (CPU bilinear; lat orientation)', js: v, expect: c.value, rtol: c.rtol || 1e-6, atol: c.atol === undefined ? (d.scale || 0) + 1e-9 : c.atol });
        if (S.active && L.obj) {
          var g = L.obj.userData.mesh.geometry, nLon = L.opts.nLon || 192, nLat = L.opts.nLat || 96;
          var ii = Math.round((c.lon + 180) / 360 * nLon), jj = Math.round((c.lat + 90) / 180 * nLat), k = jj * (nLon + 1) + ii;
          var lon = -180 + 360 * ii / nLon, lat = -90 + 180 * jj / nLat, P = [g.attributes.position.getX(k), g.attributes.position.getY(k), g.attributes.position.getZ(k)];
          rows.push({ name: L.id + ': drawn radius at vertex ' + lon.toFixed(1) + '°, ' + lat.toFixed(1) + '° = r(1 + ex·v/a) (float32)', js: M.norm(P), expect: dispRadius(L.opts.radius || 1, d, gridSample(d, lon, lat)), rtol: 1e-6 });
        }
      });
      if (!f || !f.check) return rows;
      f.check.forEach(function (c) {
        var d = fieldDecode(f, c.lon, c.lat), isF = f.data instanceof Float32Array, q = isF ? 0 : (f.scale === undefined ? 1 : f.scale);
        rows.push({ name: L.id + ': field at ' + c.lon + '°, ' + c.lat + '° (CPU decode; lat orientation)', js: d.value, expect: c.value, rtol: c.rtol || 1e-6, atol: c.atol === undefined ? q * 0.5 + 1e-12 : c.atol });
        if (S.active && L.fieldTex) {
          var u = (d.i + 0.5) / f.w, v = (d.j + 0.5) / f.h, g = S.gpuSample(L.fieldTex, u, v);
          var gv = isF ? g : g * 255 * q + (f.offset || 0);
          rows.push({ name: L.id + ': field at ' + c.lon + '°, ' + c.lat + '° (GPU read-back = CPU)', js: gv, expect: d.value, rtol: 1e-6, atol: 0 });     // the texel itself, sampled at its centre: float32 rounding only
        }
      });
      return rows;
    }
  };

  // fieldSurface({grid:[nx, ny], domain:[x0, x1, y0, y1], height: fn(x, y, p) | Float32Array, params, exaggeration,
  //               exaggerationLabel, z0, color:{lut, range, symmetric}, contours:{step}, opacity})
  Viz3D.fieldSurface = function (o) { return layer('fieldSurface', o); };
  function fsValues(L) {
    var o = L.opts, nx = o.grid[0], ny = o.grid[1], dm = o.domain || [-1, 1, -1, 1], vals = new Float32Array((nx + 1) * (ny + 1)), k = 0;
    for (var j = 0; j <= ny; j++) for (var i = 0; i <= nx; i++) {
      var x = dm[0] + (dm[1] - dm[0]) * i / nx, y = dm[2] + (dm[3] - dm[2]) * j / ny;
      vals[k] = isFn(o.height) ? o.height(x, y, o.params || {}) : o.height[k]; k++;
    }
    return vals;
  }
  function fsRange(o, vals) {
    if (o.color && o.color.range) return o.color.range;
    var lo = Infinity, hi = -Infinity; for (var i = 0; i < vals.length; i++) { lo = Math.min(lo, vals[i]); hi = Math.max(hi, vals[i]); }
    if (o.color && o.color.symmetric) { var m = Math.max(Math.abs(lo), Math.abs(hi)) || 1; return [-m, m]; }
    return hi > lo ? [lo, hi] : [lo - 1, lo + 1];
  }
  IMPL.fieldSurface = {
    pickable: true,
    build: function (S, L) {
      var T = S.THREE, o = L.opts, nx = o.grid[0], ny = o.grid[1], dm = o.domain || [-1, 1, -1, 1], vals = fsValues(L), ex = o.exaggeration || 1, z0 = o.z0 || 0;
      var pos = new Float32Array(vals.length * 3), idx = [], k = 0;
      for (var j = 0; j <= ny; j++) for (var i = 0; i <= nx; i++) { pos[3 * k] = dm[0] + (dm[1] - dm[0]) * i / nx; pos[3 * k + 1] = dm[2] + (dm[3] - dm[2]) * j / ny; pos[3 * k + 2] = z0 + vals[k] * ex; k++; }
      for (j = 0; j < ny; j++) for (i = 0; i < nx; i++) { var a = j * (nx + 1) + i, b = a + nx + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
      var g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('aVal', new T.BufferAttribute(vals, 1)); g.setIndex(idx); g.computeVertexNormals();
      var rg = fsRange(o, vals), step = o.contours && o.contours.step;
      var mat = new T.ShaderMaterial({
        uniforms: { lut: { value: S._lutTex((o.color && o.color.lut) || 'viridis') }, lo: { value: rg[0] }, hi: { value: rg[1] }, step: { value: step || 0 }, ink: { value: color(T, '-' + '-viz-text') }, L: { value: new T.Vector3(0.4, -0.5, 0.8).normalize() }, opacity: { value: o.opacity === undefined ? 1 : o.opacity } },
        vertexShader: 'attribute float aVal; varying float vVal; varying vec3 vN; void main(){ vVal = aVal; vN = normalize(normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader: [
          'uniform sampler2D lut; uniform float lo, hi, step, opacity; uniform vec3 ink; uniform vec3 L; varying float vVal; varying vec3 vN;',
          'void main(){',
          '  float t = clamp((vVal - lo) / (hi - lo), 0.0, 1.0); vec3 c = texture2D(lut, vec2(t, 0.5)).rgb;',
          '  c *= 0.75 + 0.25 * abs(dot(normalize(vN), L));',
          '  if (step > 0.0) { float f = vVal / step; float w = fwidth(f); float line = 1.0 - smoothstep(0.0, 1.5 * w, abs(fract(f - 0.5) - 0.5)); c = mix(c, ink, 0.55 * line); }',
          '  gl_FragColor = vec4(c, opacity);',
          '}'].join('\n'),
        side: T.DoubleSide, transparent: (o.opacity !== undefined && o.opacity < 1)
      });
      var mesh = new T.Mesh(g, mat); L.vals = vals;
      return mesh;
    },
    update: function (S, L) {
      var o = L.opts, mesh = L.obj, vals = fsValues(L), pos = mesh.geometry.attributes.position, av = mesh.geometry.attributes.aVal, ex = o.exaggeration || 1, z0 = o.z0 || 0;
      if (av.count !== vals.length) { disposeObj(L.obj); L.obj = null; S._build(L); return; }
      for (var k = 0; k < vals.length; k++) { av.array[k] = vals[k]; pos.array[3 * k + 2] = z0 + vals[k] * ex; }
      av.needsUpdate = true; pos.needsUpdate = true; mesh.geometry.computeVertexNormals(); L.vals = vals;
      var rg = fsRange(o, vals); mesh.material.uniforms.lo.value = rg[0]; mesh.material.uniforms.hi.value = rg[1];
    },
    proj3: function (S, L) {
      var o = L.opts, nx = o.grid[0], ny = o.grid[1], dm = o.domain || [-1, 1, -1, 1], vals = fsValues(L), ex = o.exaggeration || 1, z0 = o.z0 || 0, out = { lines: [] };
      var P = function (i, j) { return [dm[0] + (dm[1] - dm[0]) * i / nx, dm[2] + (dm[3] - dm[2]) * j / ny, z0 + vals[j * (nx + 1) + i] * ex]; }, sx = Math.max(1, Math.round(nx / 12)), sy = Math.max(1, Math.round(ny / 12)), i, j, l;
      for (j = 0; j <= ny; j += sy) { l = []; for (i = 0; i <= nx; i++) l.push(P(i, j)); out.lines.push({ pts: l, color: '#6c5ce7', width: 1 }); }
      for (i = 0; i <= nx; i += sx) { l = []; for (j = 0; j <= ny; j++) l.push(P(i, j)); out.lines.push({ pts: l, color: '#6c5ce7', width: 1 }); }
      return out;
    },
    selftest: function (S, L) {
      if (!S.active || !L.obj) return [];
      var o = L.opts, nx = o.grid[0], ny = o.grid[1], dm = o.domain || [-1, 1, -1, 1], k = Math.floor(ny / 3) * (nx + 1) + Math.floor(nx / 3), i = k % (nx + 1), j = Math.floor(k / (nx + 1));
      var want = isFn(o.height) ? o.height(dm[0] + (dm[1] - dm[0]) * i / nx, dm[2] + (dm[3] - dm[2]) * j / ny, o.params || {}) : o.height[k];
      return [{ name: L.id + ': drawn height at node (' + i + ', ' + j + ') = field × exaggeration (float32)', js: L.obj.geometry.attributes.position.getZ(k), expect: (o.z0 || 0) + want * (o.exaggeration || 1), rtol: 1e-6, atol: 1e-7 }];
    }
  };

  // particles({n, velocity: fn(p, t) → v, seed, spawn: fn(rng) → p | {region:[x0,x1,y0,y1,z0,z1]}, lifetime:[a, b], size, color, mode})
  Viz3D.particles = function (o) { o = o || {}; if (o.mode === 'gpgpu') candidate('particles({mode:"gpgpu"})')(); return layer('particles', o); };
  function pSpawn(o, rng) {
    if (isFn(o.spawn)) return o.spawn(rng);
    var r = (o.spawn && o.spawn.region) || [-1, 1, -1, 1, 0, 0];
    return [r[0] + (r[1] - r[0]) * rng(), r[2] + (r[3] - r[2]) * rng(), r[4] + (r[5] - r[4]) * rng()];
  }
  function pState(L) {
    if (L.ps) return L.ps;
    var o = L.opts, n = o.n || 1000, rng = M.rng(o.seed || 42), lt = o.lifetime || [1e9, 1e9], P = [], age = [], life = [];
    for (var i = 0; i < n; i++) { P.push(pSpawn(o, rng)); age.push(0); life.push(lt[0] + (lt[1] - lt[0]) * rng()); }
    return (L.ps = { P: P, age: age, life: life, rng: rng, t: 0 });
  }
  IMPL.particles = {
    build: function (S, L) {
      var T = S.THREE, o = L.opts, ps = pState(L), n = ps.P.length, pos = new Float32Array(3 * n);
      for (var i = 0; i < n; i++) { pos[3 * i] = ps.P[i][0]; pos[3 * i + 1] = ps.P[i][1]; pos[3 * i + 2] = ps.P[i][2]; }
      var g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3));
      return new T.Points(g, new T.PointsMaterial({ color: color(T, o.color || '#2563eb'), size: o.size || 3, sizeAttenuation: false }));
    },
    proj3: function (S, L) { var ps = pState(L), c = L.opts.color || '#2563eb'; return { points: ps.P.filter(function (_, i) { return i % Math.max(1, Math.round(ps.P.length / 400)) === 0; }).map(function (p) { return { p: p, r: 1.5, color: c }; }) }; }
  };
  /** Advance a particle layer by dt (RK2 in the layer's velocity; respawn on age > lifetime; seeded, so reproducible). */
  SP.step = function (id, dt) {
    var L = this.get(id), o = L.opts, ps = pState(L), f = o.velocity;
    for (var i = 0; i < ps.P.length; i++) {
      ps.P[i] = M.rk2(f, ps.P[i], ps.t, dt); ps.age[i] += dt;
      if (ps.age[i] > ps.life[i]) { ps.P[i] = pSpawn(o, ps.rng); ps.age[i] = 0; }
    }
    ps.t += dt;
    if (L.obj) { var a = L.obj.geometry.attributes.position; for (i = 0; i < ps.P.length; i++) a.setXYZ(i, ps.P[i][0], ps.P[i][1], ps.P[i][2]); a.needsUpdate = true; }
    return ps.t;
  };

  // trajectory({from, velocity: fn(p, t) → v, back, fwd, dt, ticks, color}) — where from (dashed) / where to (solid)
  Viz3D.trajectory = function (o) { return layer('trajectory', o); };
  function trajData(L) {
    var o = L.opts, dt = o.dt || ((o.fwd || 1) / 200), back = [o.from], fwd = [o.from], ticks = [], p, t, nb = Math.round((o.back || 0) / dt), nf = Math.round((o.fwd || 0) / dt), tk = o.ticks ? Math.max(1, Math.round(o.ticks / dt)) : 0, k;
    var neg = function (q, tt) { return M.scale(o.velocity(q, tt), -1); };
    for (p = o.from, t = 0, k = 1; k <= nb; k++) { p = M.rk4(neg, p, t, dt); t += dt; back.push(p); if (tk && k % tk === 0) ticks.push(p); }
    for (p = o.from, t = 0, k = 1; k <= nf; k++) { p = M.rk4(o.velocity, p, t, dt); t += dt; fwd.push(p); if (tk && k % tk === 0) ticks.push(p); }
    L.values = { from: o.from, endFwd: fwd[fwd.length - 1], endBack: back[back.length - 1], nTicks: ticks.length };
    return { back: back, fwd: fwd, ticks: ticks };
  }
  IMPL.trajectory = {
    values: trajData,
    build: function (S, L) {
      var T = S.THREE, o = L.opts, d = trajData(L), g = new T.Group(), c = o.color || '#e11d6a';
      if (d.back.length > 1) g.add(lineObj(S, d.back, c, { dash: [0.04, 0.03] }));
      if (d.fwd.length > 1) g.add(lineObj(S, d.fwd, c));
      if (d.ticks.length) {
        var im = new T.InstancedMesh(new T.SphereGeometry(0.012, 8, 6), new T.MeshBasicMaterial({ color: color(T, c) }), d.ticks.length), m = new T.Matrix4();
        d.ticks.forEach(function (p, i) { m.makeTranslation(p[0], p[1], p[2]); im.setMatrixAt(i, m); }); g.add(im);
      }
      var st = new T.Mesh(new T.SphereGeometry(0.025, 12, 8), new T.MeshBasicMaterial({ color: color(T, c) })); st.position.fromArray(o.from); g.add(st);
      return g;
    },
    proj3: function (S, L) { var d = trajData(L), c = L.opts.color || '#e11d6a'; return { lines: [{ pts: d.back, color: c, dash: [5, 4], width: 2 }, { pts: d.fwd, color: c, width: 2 }], points: d.ticks.map(function (p) { return { p: p, r: 2, color: c }; }).concat([{ p: L.opts.from, r: 4, color: c }]) }; }
  };

  // tank({shape:'cylinder'|'annulus'|'box', R, Rin, H, size:[x,y,z], water:{alpha}, color})
  Viz3D.tank = function (o) { return layer('tank', o); };
  function tankRims(o) {
    var out = [], R = o.R || 1, H = o.H || 0.4, k, l;
    if ((o.shape || 'cylinder') === 'box') { var s = o.size || [2, 1, 0.5], x = s[0] / 2, y = s[1] / 2; [0, s[2]].forEach(function (z) { out.push([[-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z], [-x, -y, z]]); }); return out; }
    [R].concat(o.shape === 'annulus' ? [o.Rin || 0.3] : []).forEach(function (r) { [0, H].forEach(function (z) { l = []; for (k = 0; k <= 64; k++) l.push([r * Math.cos(2 * Math.PI * k / 64), r * Math.sin(2 * Math.PI * k / 64), z]); out.push(l); }); });
    return out;
  }
  IMPL.tank = {
    build: function (S, L) {
      var T = S.THREE, o = L.opts, g = new T.Group(), alpha = (o.water && o.water.alpha) || 0.15, geo;
      var mat = new T.MeshBasicMaterial({ color: color(T, o.color || '#2563eb'), transparent: true, opacity: alpha, depthWrite: false, side: T.DoubleSide });
      if ((o.shape || 'cylinder') === 'box') { var s = o.size || [2, 1, 0.5]; geo = new T.BoxGeometry(s[0], s[1], s[2]); geo.translate(0, 0, s[2] / 2); }
      else { geo = new T.CylinderGeometry(o.R || 1, o.R || 1, o.H || 0.4, 64, 1, true); geo.rotateX(Math.PI / 2); geo.translate(0, 0, (o.H || 0.4) / 2); }
      var m = new T.Mesh(geo, mat); m.renderOrder = 10; g.add(m);
      if (o.shape === 'annulus') { var gi = new T.CylinderGeometry(o.Rin || 0.3, o.Rin || 0.3, o.H || 0.4, 48, 1, true); gi.rotateX(Math.PI / 2); gi.translate(0, 0, (o.H || 0.4) / 2); g.add(new T.Mesh(gi, mat.clone())); }
      var seg = []; tankRims(o).forEach(function (l) { for (var k = 0; k + 1 < l.length; k++) seg.push(l[k], l[k + 1]); });
      g.add(lineObj(S, seg, '-' + '-viz-text', { segments: true, opacity: 0.5 }));
      return g;
    },
    proj3: function (S, L) { return { lines: tankRims(L.opts).map(function (l) { return { pts: l, color: '#2563eb', width: 1.2 }; }) }; }
  };

  // layerStack({surfaces:[{height: fn(x, y) | z, label, color}], grid:[nx, ny], domain, exaggeration, lut, alpha})
  Viz3D.layerStack = function (o) { return layer('layerStack', o); };
  IMPL.layerStack = {
    build: function (S, L) {
      var T = S.THREE, o = L.opts, g = new T.Group(), n = o.surfaces.length;
      o.surfaces.forEach(function (sf, k) {
        var sub = { opts: { grid: o.grid || [40, 40], domain: o.domain, height: isFn(sf.height) ? sf.height : function () { return sf.height; }, exaggeration: o.exaggeration || 1, color: { lut: o.lut || 'cmocean.dense', range: [-1e9, 1e9] }, opacity: o.alpha || 0.55 } };
        var mesh = IMPL.fieldSurface.build(S, sub), c = sf.color ? color(T, sf.color) : null;
        mesh.material.uniforms.lo.value = -1; mesh.material.uniforms.hi.value = 2 * n - 1; mesh.geometry.attributes.aVal.array.fill(c ? 0 : k * 2 + 0.5); mesh.geometry.attributes.aVal.needsUpdate = true;
        mesh.material.uniforms.step.value = 0; mesh.material.transparent = true; mesh.material.depthWrite = false; mesh.renderOrder = 5 + k;
        g.add(mesh);
        if (sf.label) g.add(texLabel(S, [(o.domain || [-1, 1])[1], (o.domain || [-1, 1, -1, 1])[3], (isFn(sf.height) ? sf.height((o.domain || [-1, 1])[1], (o.domain || [-1, 1, -1, 1])[3]) : sf.height) * (o.exaggeration || 1)], sf.label, null));
      });
      return g;
    },
    proj3: function (S, L) { var o = L.opts, out = { lines: [] }; o.surfaces.forEach(function (sf) { var sub = { opts: { grid: [12, 12], domain: o.domain, height: isFn(sf.height) ? sf.height : function () { return sf.height; }, exaggeration: o.exaggeration || 1 } }; out.lines = out.lines.concat(IMPL.fieldSurface.proj3(S, sub).lines); }); return out; }
  };

  // isosurface({method:'precomputed', mesh:{positions, indices}, color, opacity}); 'marching' is a candidate
  Viz3D.isosurface = function (o) { o = o || {}; if (o.method === 'marching') candidate('isosurface({method:"marching"})')(); return layer('isosurface', o); };
  IMPL.isosurface = {
    pickable: true,
    build: function (S, L) {
      var T = S.THREE, o = L.opts, g = new T.BufferGeometry();
      g.setAttribute('position', new T.BufferAttribute(o.mesh.positions instanceof Float32Array ? o.mesh.positions : new Float32Array(o.mesh.positions), 3));
      if (o.mesh.indices) g.setIndex(Array.from(o.mesh.indices)); g.computeVertexNormals();
      return new T.Mesh(g, new T.MeshLambertMaterial({ color: color(T, o.color || '#2563eb'), transparent: (o.opacity || 1) < 1, opacity: o.opacity || 1, side: o.twoSided === false ? T.FrontSide : T.DoubleSide }));
    }
  };
  // streamtubes({seeds, velocity: fn(p) → v, steps, ds, radius, color})
  Viz3D.streamtubes = function (o) { return layer('streamtubes', o); };
  function tubePaths(o) {
    return o.seeds.map(function (s) { var p = s, pts = [p], f = function (q) { var v = o.velocity(q, 0), n = M.norm(v) || 1; return M.scale(v, 1 / n); }; for (var k = 0; k < (o.steps || 100); k++) { p = M.rk4(f, p, 0, o.ds || 0.02); pts.push(p); } return pts; });
  }
  IMPL.streamtubes = {
    build: function (S, L) {
      var T = S.THREE, o = L.opts, g = new T.Group();
      tubePaths(o).forEach(function (pts) { var cv = new T.CatmullRomCurve3(pts.map(function (p) { return new T.Vector3(p[0], p[1], p[2]); })); g.add(new T.Mesh(new T.TubeGeometry(cv, pts.length * 2, o.radius || 0.012, 8, false), new T.MeshLambertMaterial({ color: color(T, o.color || '#0fa39c') }))); });
      return g;
    },
    proj3: function (S, L) { return { lines: tubePaths(L.opts).map(function (p) { return { pts: p, color: L.opts.color || '#0fa39c', width: 2 }; }) }; }
  };
  Viz3D.cutPlane = candidate('cutPlane');

  global.Viz3D = Viz3D;
})(typeof window !== 'undefined' ? window : this);
/* VIZ3D_JS:END */
