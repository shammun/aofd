/* ======================================================================================================
   vector_products_lab.scene.js — the 3-D view `v3d` of the Ch. 0A explainer viz/ch00/vector_products_lab.html
   (analysis/ch00_poc_design.md Part H · H1). Inlined by tools/viz_inline.py between the SCENE_JS BEGIN/END markers
   (path viz/ch00/scenes/vector_products_lab.scene.js), after assets/viz3d.js.

   Contract with the explainer (viz-integrator):
     window.SCENE_vector_products_lab = {
       create(view, app) → Promise<S>   view = g.view('v3d') (or a bare element); app.state is read, never written
       update(S, state)                 call from stage.draw(g, s); cheap when a, b and the toggles did not change
       selftestRows(S) → rows           JS ↔ Python (py:), drawing invariants, camera presets of every walkthrough step
       goto(S, name)                    camera preset: iso · faceOn · edgeOn · top · alongB (Part H; cut under reduced motion)
       physics: { dot, cross, norm, angle_between, scalar_projection, projection, parallelogram_area, triple_scalar,
                  k_cross, coriolis_parameter }   — same names / argument order as fluidpy.geo.vectors / .frames
       STEP_CAMERAS: ['iso','faceOn','faceOn','iso','iso','edgeOn','top','iso']           (walkthrough steps 1–8)
     }
   State keys read: ax ay az bx by bz (components), showDot showCross (booleans);
     optional: showCoriolis (bool, the "f k×u" preset: ghost −f k×u arrow ×10⁴), lat (deg, default 45).
   Layer ids: grid · glyphDot · glyphCross · signedBar · barLabel · ghostCoriolis · cams (+ triad in the proj3 fallback).
   Every drawn quantity comes from the pure functions below (mirrors of fluidpy.geo.vectors); only Viz3D layers are used.
   Candidate kit features (not drawn here, noted for the knowledge-keeper): right-angle tick at the shadow foot
   (vectorGlyph showShadow), arc + arrowhead in the proj3 fallback of op:'cross', dashed vectorField arrows (ghost).
   ====================================================================================================== */
(function (global) {
  'use strict';

  /* ---------- physics: pure mirrors of fluidpy.geo.vectors (3-vectors, components on the last axis) ---------- */
  /** fluidpy.geo.vectors.dot(a, b) — Eq. (K 2.2): a_i b_i. */
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  /** fluidpy.geo.vectors.cross(a, b) — Eq. (K 2.20). */
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  /** fluidpy.geo.vectors.norm(a) = sqrt(a·a). */
  function norm(a) { return Math.sqrt(dot(a, a)); }
  /** fluidpy.geo.vectors.angle_between(a, b, degrees) — θ = atan2(|a×b|, a·b); NaN if either vector is zero. */
  function angle_between(a, b, degrees) {
    if (!(norm(a) > 0) || !(norm(b) > 0)) return NaN;
    var th = Math.atan2(norm(cross(a, b)), dot(a, b));
    return degrees ? th * 180 / Math.PI : th;
  }
  /** fluidpy.geo.vectors.scalar_projection(a, b) = a·b/|b| (signed length of a's shadow on b); NaN if |b| = 0. */
  function scalar_projection(a, b) { var nb = norm(b); return nb > 0 ? dot(a, b) / nb : NaN; }
  /** fluidpy.geo.vectors.projection(a, b) = (a·b/|b|²) b. */
  function projection(a, b) { var bb = dot(b, b), k = bb > 0 ? dot(a, b) / bb : NaN; return [k * b[0], k * b[1], k * b[2]]; }
  /** fluidpy.geo.vectors.parallelogram_area(a, b) = |a×b| — (0A.2). */
  function parallelogram_area(a, b) { return norm(cross(a, b)); }
  /** fluidpy.geo.vectors.triple_scalar(a, b, c) = a·(b×c) — Eq. (K 2.21). */
  function triple_scalar(a, b, c) { return dot(a, cross(b, c)); }
  /** fluidpy.geo.vectors.k_cross(u) = (−u_y, u_x, 0) — Vallis (2.79): u turned 90° to the left. */
  function k_cross(u) { return [-u[1], u[0], 0]; }
  var OMEGA = 7.292115e-5;                       // fluidpy.geo.constants.OMEGA [rad/s]
  /** fluidpy.geo.frames.coriolis_parameter(lat, Omega) — Vallis (2.80): f = 2Ω sin ϑ, lat in radians. */
  function coriolis_parameter(lat, Omega) { return 2 * (Omega === undefined ? OMEGA : Omega) * Math.sin(lat); }

  var physics = { dot: dot, cross: cross, norm: norm, angle_between: angle_between, scalar_projection: scalar_projection,
    projection: projection, parallelogram_area: parallelogram_area, triple_scalar: triple_scalar, k_cross: k_cross,
    coriolis_parameter: coriolis_parameter, OMEGA: OMEGA };

  /* ---------- scene description (declarative: the kit rebuilds it after context loss / release) ---------- */
  var TEAL = '#0fa39c', ORANGE = '#f97316', VIOLET = '#7c3aed', ROSE = '#e11d6a';
  var BAR_AT = [-0.6, -0.6, 0], BAR_SCALE = 0.2;          // signed bar: 0.2 scene units per unit of a·b
  var GHOST_SCALE = 1e4;                                   // −f k×u drawn ×10⁴ (exaggeration badge)
  var STEP_CAMERAS = ['iso', 'faceOn', 'faceOn', 'iso', 'iso', 'edgeOn', 'top', 'iso'];
  var DIST = 13;
  // iso: Part H asks (6, −7, 5) → 0; pulled back and aimed 1.5 up so a 5-long result arrow and the triad fit the view
  var ISO_POS = [9, -10.5, 8], ISO_TARGET = [0, 0, 1.2];

  function vecA(s) { return [+s.ax || 0, +s.ay || 0, +s.az || 0]; }
  function vecB(s) { return [+s.bx || 0, +s.by || 0, +s.bz || 0]; }
  function unit(v) { var n = norm(v); return n > 0 ? [v[0] / n, v[1] / n, v[2] / n] : [0, 0, 1]; }
  function fmt(v) { return global.Viz && Viz.fmt ? Viz.fmt(v, { sig: 3 }) : String(Math.round(v * 1000) / 1000); }

  /** Unit normal of the a–b plane, chosen on the upper side (n_z ≥ 0) so face-on views look from above the grid. */
  function planeNormal(a, b) {
    var c = cross(a, b), n = norm(c);
    if (!(n > 1e-9 * Math.max(1e-30, norm(a) * norm(b)))) {            // parallel / zero pair: the plane is not defined
      var ua = norm(a) > 0 ? unit(a) : unit(b);
      c = Math.abs(ua[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];               // Part H: "for parallel pairs along k" (x if a ∥ k)
    }
    var u = unit(c);
    return u[2] < 0 ? [-u[0], -u[1], -u[2]] : u;
  }
  /** Camera presets (Part H): pos/target from a and b; recomputed whenever a or b changes. */
  function cameraPresetsFor(a, b) {
    var n = planeNormal(a, b), T = [0, 0, 0];
    var mid = [(a[0] + b[0]) / 3, (a[1] + b[1]) / 3, (a[2] + b[2]) / 3];   // aim near the parallelogram's centre (in the a–b plane)
    function along(v, L) { return [mid[0] + L * v[0], mid[1] + L * v[1], mid[2] + L * v[2]]; }
    // face-on: along n; nudge off the exact pole so OrbitControls (up = z) keeps a defined azimuth
    var f = Math.abs(n[2]) > 0.9995 ? unit([n[0], n[1] - 0.012, n[2]]) : n;
    // edge-on: in the a–b plane, perpendicular to the bisector of a and b, so the parallelogram is a line
    var ua = norm(a) > 0 ? unit(a) : unit(b), ub0 = norm(b) > 0 ? unit(b) : ua;
    var bis = [ua[0] + ub0[0], ua[1] + ub0[1], ua[2] + ub0[2]];
    if (norm(bis) < 1e-6) bis = ua;                                   // anti-parallel: no bisector, use a's line
    var e = cross(n, bis); if (norm(e) < 1e-9) e = cross(n, [1, 0, 0]); if (norm(e) < 1e-9) e = cross(n, [0, 1, 0]);
    e = unit(e);
    var ub = unit(b);
    return {
      iso: { pos: ISO_POS, target: ISO_TARGET },
      faceOn: { pos: along(f, DIST), target: mid, normal: n },
      edgeOn: { pos: along(e, DIST), target: mid, normal: n },
      top: { pos: [mid[0], mid[1] - 1.2, 15], target: [mid[0], mid[1], 0] },
      alongB: { pos: [-8 * ub[0] + 1.5 * n[0], -8 * ub[1] + 1.5 * n[1], -8 * ub[2] + 1.5 * n[2] + 2.5], target: [ub[0], ub[1], ub[2]] }
    };
  }

  function describe(s) {          // everything the scene draws, as plain numbers (also the selftest source)
    var a = vecA(s), b = vecB(s), d = dot(a, b), coriolis = !!s.showCoriolis;
    var lat = (s.lat === undefined ? 45 : +s.lat) * Math.PI / 180, f = coriolis_parameter(lat);
    var kxu = k_cross(b), ghost = [-f * kxu[0] * GHOST_SCALE, -f * kxu[1] * GHOST_SCALE, 0];
    var showDot = s.showDot !== false, showCross = s.showCross !== false;
    return { a: a, b: b, dot: d, showDot: showDot, showCross: showCross, coriolis: coriolis, f: f, ghost: ghost,
      bar: [0, 0, BAR_SCALE * d], key: [a, b, showDot, showCross, coriolis, lat].join('|'),
      la: coriolis ? String.raw`\hat{\mathbf k}` : String.raw`\mathbf a`, lb: coriolis ? String.raw`\mathbf u` : String.raw`\mathbf b` };
  }

  function glyphParams(d, which) {
    // the cross glyph carries the a, b labels when it is visible; the dot glyph always draws the arrows otherwise
    var crossOn = d.showCross, dotOn = d.showDot || !d.showCross, lab = which === 'cross' ? crossOn : !crossOn;
    return {
      a: { v: d.a, label: lab ? d.la : null, color: TEAL }, b: { v: d.b, label: lab ? d.lb : null, color: ORANGE },
      visible: which === 'cross' ? crossOn : dotOn,
      showShadow: d.showDot
    };
  }

  function create(view, app) {
    var Viz3D = global.Viz3D;
    var s0 = (app && app.state) || {}, d = describe(s0);
    return Viz3D.scene(view, {
      camera: { fov: 35, up: 'z', near: 0.05, far: 200, position: ISO_POS, target: ISO_TARGET },
      controls: { orbit: true, pan: 'desktop', damping: 0.1, minPolar: 0.01, maxPolar: Math.PI - 0.01 },
      background: 'token:--viz-bg', lazy: true, fallback: 'proj3', provenance: true, audit: Viz3D.auditFromUrl(),
      proj3Scale: 0.28
    }).then(function (S) {
      if (!S) return null;
      S.add(Viz3D.betaPlane({ id: 'grid', size: [10, 10], grid: [10, 10], axes: 'x east,y north,z up', color: '#697386',
        provenance: { kind: 'schematic', text: 'grid z = 0, 1 unit' } }));
      if (S.fallback) S.add(Viz3D.axesTriad({ id: 'triad', at: [-5, -5, 0], length: 2.2, labels: ['x east', 'y north', 'z up'] }));
      var gc = glyphParams(d, 'cross'), gd = glyphParams(d, 'dot');
      S.add(Viz3D.vectorGlyph({ id: 'glyphCross', at: [0, 0, 0], op: 'cross', a: gc.a, b: gc.b, showParallelogram: true, showArc: true,
        readout: true, resultColor: VIOLET, visible: gc.visible, radius: 0.045,
        provenance: { kind: 'computed', text: 'fluidpy.geo.vectors.cross' } }));
      S.add(Viz3D.vectorGlyph({ id: 'glyphDot', at: [0, 0, 0], op: 'dot', a: gd.a, b: gd.b, showShadow: gd.showShadow, readout: false,
        visible: gd.visible, radius: 0.045, provenance: { kind: 'computed', text: 'fluidpy.geo.vectors.dot' } }));
      S.add(Viz3D.vectorField({ id: 'signedBar', points: [BAR_AT], vectors: [d.bar], scale: 1, radius: 0.07,
        color: d.dot >= 0 ? TEAL : ROSE, visible: d.showDot, pick: false,
        provenance: { kind: 'computed', text: 'fluidpy.geo.vectors.dot' } }));
      S.add(Viz3D.labels([barLabelItem(d)], { id: 'barLabel', visible: d.showDot }));
      S.add(Viz3D.vectorField({ id: 'ghostCoriolis', points: [[0, 0, 0]], vectors: [d.ghost], scale: 1, radius: 0.035, color: VIOLET,
        visible: d.coriolis, exaggeration: true, exaggerationLabel: '−f k×u ×10⁴ for visibility', pick: false,
        provenance: { kind: 'computed', text: 'fluidpy.geo.vectors.k_cross · frames.coriolis_parameter' } }));
      S.add(Viz3D.cameraPresets(cameraPresetsFor(d.a, d.b), { id: 'cams', tween: 700, reducedMotion: 'cut' }));
      S._vpl = { key: d.key, ab: d.a.join(',') + '|' + d.b.join(','), state: Object.assign({}, s0) };
      return S;
    });
  }

  function barLabelItem(d) {
    return { at: [BAR_AT[0], BAR_AT[1], d.bar[2] + (d.dot >= 0 ? 0.25 : -0.25)], text: 'a·b = ' + fmt(d.dot), color: d.dot >= 0 ? TEAL : ROSE, priority: 0 };
  }

  function update(S, state) {
    if (!S || !S._vpl) return;
    var d = describe(state || {});
    S._vpl.state = Object.assign({}, state);
    if (d.key === S._vpl.key) return;
    S._vpl.key = d.key;
    var gc = glyphParams(d, 'cross'), gd = glyphParams(d, 'dot');
    // data first, then visibility alone (a visibility-only S.set also refreshes the provenance chips and the badge)
    S.set('glyphCross', { a: gc.a, b: gc.b });
    S.set('glyphDot', { a: gd.a, b: gd.b, showShadow: gd.showShadow });
    S.set('signedBar', { vectors: [d.bar], color: d.dot >= 0 ? TEAL : ROSE });
    S.set('barLabel', { items: [barLabelItem(d)] });
    S.set('ghostCoriolis', { vectors: [d.ghost] });
    [['glyphCross', gc.visible], ['glyphDot', gd.visible], ['signedBar', d.showDot], ['barLabel', d.showDot], ['ghostCoriolis', d.coriolis]]
      .forEach(function (x) { S.set(x[0], { visible: x[1] }); });
    var ab = d.a.join(',') + '|' + d.b.join(',');
    if (ab !== S._vpl.ab) { S._vpl.ab = ab; S.remove('cams'); S.add(global.Viz3D.cameraPresets(cameraPresetsFor(d.a, d.b), { id: 'cams', tween: 700, reducedMotion: 'cut' })); }
  }

  function goto(S, name) { return S ? S.goto(name) : Promise.resolve(); }

  /* ---------- selftest rows ---------- */
  function lit(v) { return Array.isArray(v) ? '[' + v.map(lit).join(', ') + ']' : (Number.isInteger(v) ? v.toFixed(1) : String(v)); }
  function readArrow(S, id) {        // the drawn arrow of a one-arrow vectorField: full length (shaft + head) and direction
    var L = S.get(id); if (!S.active || !L || !L.obj || !S.THREE) return null;
    var T = S.THREE, m = new T.Matrix4(), sh = L.obj.userData.shaft, hd = L.obj.userData.head;
    sh.getMatrixAt(0, m); var p0 = new T.Vector3().setFromMatrixPosition(m);
    hd.getMatrixAt(0, m); var hp = new T.Vector3().setFromMatrixPosition(m), tip = new T.Vector3(0, 1, 0).applyMatrix4(m);
    return { len: tip.distanceTo(p0), dir: tip.clone().sub(p0).normalize().toArray(), base: p0.toArray(), headBase: hp.toArray() };
  }

  function selftestRows(S) {
    var V = 'fluidpy.geo.vectors.', rows = [];
    var cases = [
      { n: '45° preset', a: [2, 1, 0], b: [1, 3, 0] },
      { n: 'tilted preset', a: [1, 2, 2], b: [3, 0, 0] },
      { n: 'anti-parallel', a: [2, 1, 0], b: [-4, -2, 0] },
      { n: 'general 3-D', a: [1.2, -0.7, 2.3], b: [-0.4, 1.9, 0.6] },
      { n: 'nearly parallel (atan2)', a: [1, 1e-7, 0], b: [1, 0, 0] }
    ];
    var st = (S && S._vpl && S._vpl.state) || {}, cur = { n: 'current state', a: vecA(st), b: vecB(st) };
    if (norm(cur.a) > 0 && norm(cur.b) > 0) cases.push(cur);
    cases.forEach(function (c) {
      var A = lit(c.a), B = lit(c.b), x = cross(c.a, c.b);
      rows.push({ name: 'dot ' + c.n + ' (K 2.2)', js: dot(c.a, c.b), py: V + 'dot(' + A + ', ' + B + ')', rtol: 1e-12, atol: 1e-15 });
      [0, 1, 2].forEach(function (i) { rows.push({ name: 'cross[' + i + '] ' + c.n + ' (K 2.20)', js: x[i], py: V + 'cross(' + A + ', ' + B + ')[' + i + ']', rtol: 1e-12, atol: 1e-15 }); });
      rows.push({ name: 'norm(a) ' + c.n, js: norm(c.a), py: V + 'norm(' + A + ')', rtol: 1e-12 });
      rows.push({ name: 'angle_between ' + c.n + ' (atan2, rad)', js: angle_between(c.a, c.b), py: V + 'angle_between(' + A + ', ' + B + ')', rtol: 1e-12, atol: 1e-15 });
      rows.push({ name: 'scalar_projection ' + c.n, js: scalar_projection(c.a, c.b), py: V + 'scalar_projection(' + A + ', ' + B + ')', rtol: 1e-12, atol: 1e-15 });
      rows.push({ name: 'parallelogram_area ' + c.n + ' (0A.2)', js: parallelogram_area(c.a, c.b), py: V + 'parallelogram_area(' + A + ', ' + B + ')', rtol: 1e-12, atol: 1e-15 });
      // CPU drawing invariants in float64: the result arrow is ⟂ both inputs; |a×b| = |a||b| sin θ; Lagrange
      var sc = norm(c.a) * norm(c.b) * Math.max(norm(c.a), norm(c.b));
      rows.push({ name: 'invariant |(a×b)·a| < 1e-9 ' + c.n, js: dot(x, c.a) / Math.max(1, sc), expect: 0, atol: 1e-9 });
      rows.push({ name: 'invariant |(a×b)·b| < 1e-9 ' + c.n, js: dot(x, c.b) / Math.max(1, sc), expect: 0, atol: 1e-9 });
      rows.push({ name: 'invariant |a×b| = |a||b| sin θ ' + c.n, js: norm(x), expect: norm(c.a) * norm(c.b) * Math.sin(angle_between(c.a, c.b)), rtol: 1e-12, atol: 1e-12 });
      rows.push({ name: 'invariant (a·b)² + |a×b|² = |a|²|b|² ' + c.n, js: dot(c.a, c.b) * dot(c.a, c.b) + dot(x, x), expect: dot(c.a, c.a) * dot(c.b, c.b), rtol: 1e-12 });
    });
    rows.push({ name: 'triple_scalar e_x·(e_y×e_z) (K 2.21)', js: triple_scalar([1, 0, 0], [0, 1, 0], [0, 0, 1]), py: V + 'triple_scalar([1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0])', rtol: 1e-12 });
    [0, 1, 2].forEach(function (i) { rows.push({ name: 'k_cross(8, 6, 0)[' + i + '] (2.79)', js: k_cross([8, 6, 0])[i], py: V + 'k_cross([8.0, 6.0, 0.0])[' + i + ']', rtol: 1e-12, atol: 1e-15 }); });
    rows.push({ name: 'coriolis_parameter(45°) (2.80)', js: coriolis_parameter(Math.PI / 4), py: 'fluidpy.geo.frames.coriolis_parameter(math.pi / 4)', rtol: 1e-12 });
    rows.push({ name: 'k_cross(u) ⟂ u (Coriolis does no work)', js: dot(k_cross([8, 6, 0]), [8, 6, 0]), expect: 0, atol: 1e-12 });

    if (!S || !S._vpl) return rows;
    var d = describe(st);
    // the kit's own glyph rows (drawn result ⟂ a, b; right-hand rule; drawn parallelogram area; drawn shadow length)
    // For a parallel / anti-parallel / zero pair the kit's |a×b| = |a||b| sin θ row (θ from acos, error ~1e-8 rad) and its
    // right-hand-rule row (no direction for a zero result) are undefined; they are skipped there and replaced by the
    // exact float64 rows above (angle_between uses atan2). Reported to the knowledge-keeper as a kit fix.
    var degenerate = !(parallelogram_area(d.a, d.b) > 1e-9 * norm(d.a) * norm(d.b));
    rows = rows.concat(global.Viz3D.selftestRows(S).filter(function (r) {
      return !(degenerate && /\|a×b\| = \|a\|\|b\| sin θ|right-hand rule|drawn result arrow ⟂/.test(r.name));
    }));
    if (degenerate) rows.push({ name: 'degenerate pair: drawn result arrow has zero area (kit acos/RHR rows skipped)', js: parallelogram_area(d.a, d.b), expect: 0, atol: 1e-12 });
    var gd = S.get('glyphDot'), gc = S.get('glyphCross');
    if (gd && gd.values && norm(d.b) > 0) rows.push({ name: 'shadow length (kit glyph) = scalar_projection', js: gd.values.proj, expect: scalar_projection(d.a, d.b), rtol: 1e-12, atol: 1e-15 });
    if (gc && gc.values) rows.push({ name: '|result arrow| (kit glyph) = parallelogram_area', js: gc.values.crossMag, expect: parallelogram_area(d.a, d.b), rtol: 1e-12, atol: 1e-15 });
    var bar = readArrow(S, 'signedBar');
    if (bar && d.showDot) {
      rows.push({ name: 'drawn signed bar height = 0.2 |a·b| (float32)', js: bar.len, expect: BAR_SCALE * Math.abs(d.dot), rtol: 1e-5, atol: 2e-6 });
      if (Math.abs(d.dot) > 1e-6) rows.push({ name: 'drawn signed bar points up iff a·b > 0', js: bar.dir[2], expect: Math.sign(d.dot), atol: 1e-5 });
    }
    var gh = readArrow(S, 'ghostCoriolis');
    if (gh && d.coriolis && norm(d.b) > 0) rows.push({ name: 'drawn −f k×u ⟂ u (float32)', js: dot(gh.dir, unit(d.b)), expect: 0, atol: 1e-5 });
    // camera presets: one per walkthrough step, and the face-on / edge-on geometry
    var P = cameraPresetsFor(d.a, d.b);
    STEP_CAMERAS.forEach(function (c, i) { rows.push({ name: 'walkthrough step ' + (i + 1) + ' camera "' + c + '" is a preset', js: S.presets[c] ? 1 : 0, expect: 1 }); });
    function rel(p) { return unit([p.pos[0] - p.target[0], p.pos[1] - p.target[1], p.pos[2] - p.target[2]]); }
    var fo = rel(P.faceOn), eo = rel(P.edgeOn);
    rows.push({ name: 'faceOn looks along the a–b normal (|cos| > cos 1°)', js: Math.abs(dot(fo, P.faceOn.normal)) > Math.cos(Math.PI / 180) ? 1 : 0, expect: 1 });
    rows.push({ name: 'edgeOn lies in the a–b plane (cos = 0)', js: dot(eo, P.edgeOn.normal), expect: 0, atol: 1e-12 });
    if (S.active && global.Viz3D.reducedMotion) {       // audit / reduced motion: goto is a cut, so it can be read back now
      Object.keys(P).forEach(function (k) {
        S.goto(k); var cs = S.cameraState(), pp = P[k].pos;
        rows.push({ name: 'goto("' + k + '") lands on the preset (camera read-back)', js: Math.hypot(cs.pos[0] - pp[0], cs.pos[1] - pp[1], cs.pos[2] - pp[2]), expect: 0, atol: 1e-4 });
      });
      S.goto('iso');
    }
    return rows;
  }

  global.SCENE_vector_products_lab = { create: create, update: update, selftestRows: selftestRows, goto: goto,
    physics: physics, STEP_CAMERAS: STEP_CAMERAS, cameraPresetsFor: cameraPresetsFor, describe: describe };
})(window);
