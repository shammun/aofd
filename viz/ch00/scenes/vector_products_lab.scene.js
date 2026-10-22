/* ======================================================================================================
   vector_products_lab.scene.js — the 3-D view `v3d` of the Ch. 0A explainer viz/ch00/vector_products_lab.html
   (analysis/ch00_poc_design.md Part H · H1; reworked after the user's PoC feedback, reports/ch00_poc_user_feedback.md
   section A, plan P-A.1 … P-A.6). Inlined by tools/viz_inline.py between the SCENE_JS BEGIN/END markers.

   What the scene teaches (one idea per layer):
     · a·b is a NUMBER: drawn as a flat RECTANGLE in the a–b plane, built on a's shadow along b's line, other side |b|
       (signed area = a·b; rose, dashed and hatched when negative). Never an arrow in space (F-A.2).
     · a×b is an ARROW: the violet parallelogram (area = |a×b|, height |b| sin θ marked), the curl arc a → b with an
       arrowhead, and the result arrow ⟂ the plane with its value written next to its tip (F-A.3).
     · the right-hand rule: an animated right hand (our own geometry: palm, three-segment fingers, thumb, cuff) oriented
       from first, second and first×second, so it is right for ANY pair; fingers start along the first arrow and curl
       toward the second through θ while the thumb rises along first×second; swap (b×a) flips it; hidden for parallel
       pairs ("no turning, no thumb").
     · f k×u mode: k̂ (teal, length 1, local up), u (orange, the wind, horizontal), k×u (solid violet, 90° left of u),
       −f k×u ×10⁴ (beaded light violet, in m/s²), an arc "90° left"; axis labels E/N/U only here (x/y/z otherwise).

   Contract with the explainer:
     window.SCENE_vector_products_lab = {
       create(view, app) → Promise<S>   app.state = sceneState(app.state) (flat numbers, see below); never writes state
       update(S, state)                 from stage.draw; cheap when nothing changed; re-fits camera presets on resize and
                                        re-applies the current preset unless the user dragged the camera since (P-A.6)
       goto(S, name)                    camera presets: iso · faceOn · tip · edgeOn · top (cut under reduced motion)
       selftestRows(S) → rows           parity (py:), drawn read-backs (rectangle, result arrow, hand, ghost), cameras
       physics, describe, handPose, dotRect, cameraPresetsFor, fillFraction, STEP_CAMERAS }
   State keys read: ax ay az, bx by bz (the DRAWN arrows: b already turned by the explainer's "turn b by"),
     show ('arrows' | 'shadow' | 'dot' | 'cross' | 'both'), swap (bool: draw b×a), hand (bool), curl (0…1),
     kmode (bool: a = k̂, b = u), lat (deg).
   Layer ids: grid (host) · axisLabels · arrows · dotGlyph (host) · crossGlyph (host) · hand (host) · ghostCoriolis ·
     tags · cams.  "Host" = a kit vectorField with no arrows whose group carries this module's own meshes (the kit's
     layer contract: built lazily, rebuilt after context loss / release / theme change, disposed with the layer).
   Every drawn number comes from the pure functions below (mirrors of fluidpy.geo.vectors / fluidpy.geo.frames).
   ====================================================================================================== */
(function (global) {
  'use strict';

  /* ---------- physics: pure mirrors of fluidpy.geo.vectors / fluidpy.geo.frames ---------- */
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
  /** fluidpy.geo.vectors.k_cross(u) = (−u_y, u_x, 0) — u turned 90° to the left (the k×u of Vallis (2.55)). */
  function k_cross(u) { return [-u[1], u[0], 0]; }
  var OMEGA = 7.292115e-5;                       // fluidpy.geo.constants.OMEGA [rad/s]
  /** fluidpy.geo.frames.coriolis_parameter(lat, Omega) — f ≡ 2Ω sin ϑ (Vallis (2.55)), lat in radians. */
  function coriolis_parameter(lat, Omega) { return 2 * (Omega === undefined ? OMEGA : Omega) * Math.sin(lat); }
  /** fluidpy.geo.frames.inertial_circle(U, f)['period'] = 2π/|f| [s]. */
  function inertial_period(f) { return 2 * Math.PI / Math.abs(f); }

  var physics = { dot: dot, cross: cross, norm: norm, angle_between: angle_between, scalar_projection: scalar_projection,
    projection: projection, parallelogram_area: parallelogram_area, triple_scalar: triple_scalar, k_cross: k_cross,
    coriolis_parameter: coriolis_parameter, inertial_period: inertial_period, OMEGA: OMEGA };

  /* ---------- small vector helpers ---------- */
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function scl(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }
  function unit(v) { var n = norm(v); return n > 0 ? [v[0] / n, v[1] / n, v[2] / n] : [0, 0, 1]; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  var D2R = Math.PI / 180;
  function fmt(v, sig) {
    if (Math.abs(v) < 1e-12) v = 0;
    return global.Viz && Viz.fmt ? Viz.fmt(v, { sig: sig || 3 }) : String(Math.round(v * 1000) / 1000);
  }
  function vtxt(v) { return '(' + v.map(function (x) { return fmt(x, 3); }).join(', ') + ')'; }

  /* ---------- colours: glyph pair teal/orange, Coriolis/rotation violet, negative rose, axes neutral (R4 §1.3) ---------- */
  var TEAL = '#0fa39c', ORANGE = '#f97316', VIOLET = '#7c3aed', ROSE = '#e11d6a', GHOST = '#b197fc';
  var NEUTRAL = '#5b6475', HANDC = '#dfe4ec', CUFF = '#8b95a7';
  var GHOST_DASHES = 7, FOV = 35, GHOST_SCALE = 1e4;
  /* walkthrough steps 1–8: arrows · shadow · rectangle · sign · parallelogram · right hand · f k×u · your turn */
  var STEP_CAMERAS = ['iso', 'faceOn', 'faceOn', 'faceOn', 'iso', 'iso', 'iso', 'iso'];
  var ISO_DIR = [6, -7, 5];
  function isDark() { return global.document && document.documentElement.getAttribute('data-theme') === 'dark'; }
  function textColor() { return isDark() ? '#cbd5e1' : '#334155'; }

  function vecA(s) { return [+s.ax || 0, +s.ay || 0, +s.az || 0]; }
  function vecB(s) { return [+s.bx || 0, +s.by || 0, +s.bz || 0]; }

  /** Unit normal of the a–b plane, chosen on the upper side (n_z ≥ 0) so face-on views look from above the grid.
      Parallel / zero pairs have no plane: k for a horizontal line, x if the line is vertical (said on screen). */
  function planeNormal(a, b) {
    var c = cross(a, b), n = norm(c);
    if (!(n > 1e-9 * Math.max(1e-30, norm(a) * norm(b)))) {
      var ua = norm(a) > 0 ? unit(a) : unit(b);
      c = Math.abs(ua[2]) > 0.9 ? [1, 0, 0] : cross(cross(ua, [0, 0, 1]), ua);
      if (!(norm(c) > 1e-9)) c = [0, 0, 1];
    }
    var u = unit(c);
    return u[2] < 0 ? [-u[0], -u[1], -u[2]] : u;
  }

  /** The a·b rectangle (P-A.1): on b's line from the origin to the foot of a's shadow (signed length sp), the other side
      |b| long, at right angles to b inside the a–b plane, on the side away from a. Signed area = sp·|b| = a·b. */
  function dotRect(a, b) {
    var nb = norm(b); if (!(nb > 0)) return null;
    var bh = scl(b, 1 / nb), sp = dot(a, bh), foot = scl(bh, sp), n = planeNormal(a, b), e = unit(cross(n, bh));
    if (dot(a, e) > 0) e = scl(e, -1);                                   // away from a (a ∥ b: either side; we keep n×b̂)
    var side = scl(e, nb);
    return { bh: bh, sp: sp, foot: foot, e: e, n: n, side: side, area: sp * nb, long: nb,
      corners: [[0, 0, 0], foot, add(foot, side), side.slice()] };
  }

  /** Orthonormal frame of the right-hand rule for the product first × second: e1 along first, e2 in the plane toward
      second, n = e1 × e2 = unit(first × second). ok = false when the pair is parallel or zero (no turning). */
  function handFrame(first, second) {
    var c = cross(first, second), nf = norm(first), ns = norm(second);
    if (!(nf > 0) || !(ns > 0) || !(norm(c) > 1e-9 * nf * ns)) return { ok: false };
    var e1 = unit(first), n = unit(c), e2 = cross(n, e1);
    return { ok: true, e1: e1, e2: e2, n: n, theta: Math.atan2(norm(c), dot(first, second)) };
  }
  /** Pose of the stylised right hand (pure; the 3-D build and the selftest use it). curl 0 = flat hand, fingers along
      first, thumb alongside; curl 1 = fingertips along second (the fingers turned through θ about n), thumb along n. */
  function handPose(first, second, curl, size) {
    var F = handFrame(first, second); if (!F.ok) return null;
    var s = size, c = clamp(curl, 0, 1), th = F.theta;
    function P(x, y, z) { return add(add(scl(F.e1, x), scl(F.e2, y)), scl(F.n, z)); }   // local → world
    var offs = [0.28, 0.09, -0.10, -0.28], lens = [0.86, 0.96, 0.90, 0.72], frac = [0.45, 0.31, 0.24];
    var fingers = offs.map(function (o, i) {
      var p = P(0, 0, o * s), pts = [p];
      for (var k = 1; k <= 3; k++) {
        var ph = c * th * k / 3, dir = add(scl(F.e1, Math.cos(ph)), scl(F.e2, Math.sin(ph)));
        p = add(p, scl(dir, lens[i] * frac[k - 1] * s)); pts.push(p);
      }
      return pts;
    });
    var psi = c * Math.PI / 2, td = add(scl(F.e1, Math.cos(psi)), scl(F.n, Math.sin(psi)));
    var t0 = P(-0.40 * s, 0.02 * s, 0.40 * s), t1 = add(t0, scl(td, 0.36 * s)), t2 = add(t1, scl(td, 0.34 * s));
    var tipDir = add(scl(F.e1, Math.cos(c * th)), scl(F.e2, Math.sin(c * th)));
    return { F: F, s: s, fingers: fingers, thumb: [t0, t1, t2], thumbDir: td, tipDir: tipDir,
      palm: { c: P(-0.47 * s, 0, 0), dims: [0.92 * s, 0.26 * s, 0.80 * s] }, cuff: [P(-0.90 * s, 0, 0), P(-1.35 * s, 0, 0)],
      rf: 0.085 * s, rt: 0.10 * s };
  }

  /** Everything the scene draws, as plain numbers (also the selftest source). */
  function describe(s) {
    var a = vecA(s), b = vecB(s), K = !!s.kmode, show = s.show || 'both', swap = !!s.swap && !K;
    var first = swap ? b : a, second = swap ? a : b, nmA = K ? 'k' : 'a', nmB = K ? 'u' : 'b';
    var na = norm(a), nb = norm(b), cr = cross(first, second), area = norm(cr);
    var deg = !(na > 0 && nb > 0 && area > 1e-9 * na * nb);
    var dotOn = !K && (show === 'shadow' || show === 'dot' || show === 'both'), rectOn = !K && (show === 'dot' || show === 'both');
    var crossOn = K || show === 'cross' || show === 'both';
    var hand = !!s.hand && !K && crossOn, curl = s.curl === undefined ? 1 : clamp(+s.curl, 0, 1);
    var lat = (s.lat === undefined ? 45 : +s.lat) * D2R, f = coriolis_parameter(lat), kxu = k_cross(b);
    var ghost = K ? scl(kxu, -f * GHOST_SCALE) : [0, 0, 0];
    var R = nb > 0 ? dotRect(a, b) : null, d0 = dot(a, b), th = angle_between(a, b);
    var pts = [[0, 0, 0], a, b];
    if (K) {
      var M = Math.max(nb, norm(ghost)) * 1.06;
      for (var k8 = 0; k8 < 8; k8++) pts.push([M * Math.cos(k8 * Math.PI / 4), M * Math.sin(k8 * Math.PI / 4), 0]);   // u turns: fit the whole circle
      pts.push([0, 0, 1.25]);
    } else {
      if (rectOn && R) pts = pts.concat(R.corners);
      if (dotOn && R) pts.push(R.foot);
      if (crossOn) pts.push(add(a, b));
      if (crossOn && !deg) pts.push(cr, scl(cr, 1.1));
    }
    var Lmax = Math.max.apply(null, pts.map(norm).concat([1]));
    var radius = 0.045 * clamp(Lmax / 5, 1, 3);
    var hs = clamp(0.75 * Math.min(norm(first), norm(second)), 0.5, 2.2);
    var pose = hand && !deg ? handPose(first, second, curl, hs) : null;
    if (pose) pts.push(pose.cuff[1], pose.thumb[2], add(pose.palm.c, scl(pose.F.n, -0.45 * hs)), add(pose.palm.c, scl(pose.F.n, 0.45 * hs)));
    var mxy = Math.max.apply(null, pts.map(function (p) { return Math.max(Math.abs(p[0]), Math.abs(p[1])); }));
    var G2 = Math.max(3, Math.ceil(mxy) + 1);
    /* the x/y/z (E/N/U) triad sits just off the lower-left corner of the drawing and is part of the camera fit */
    var lox = Math.min.apply(null, pts.map(function (p) { return p[0]; })), loy = Math.min.apply(null, pts.map(function (p) { return p[1]; }));
    var span = Math.max(2, mxy), TL = 0.22 * span, triAt = [lox - 0.3 * span, loy - 0.3 * span, 0], TA = triAt[0] + 100 * triAt[1];
    pts.push(triAt, add(triAt, [TL * 1.3, 0, 0]), add(triAt, [0, TL * 1.3, 0]), add(triAt, [0, 0, TL * 1.3]));
    G2 = Math.max(G2, Math.ceil(Math.max(Math.abs(triAt[0]), Math.abs(triAt[1]))) + 1);
    var d = { a: a, b: b, K: K, show: show, swap: swap, first: first, second: second, nmA: nmA, nmB: nmB, na: na, nb: nb,
      cr: cr, area: area, deg: deg, dotOn: dotOn, rectOn: rectOn, crossOn: crossOn, hand: hand, curl: curl, pose: pose,
      lat: lat, f: f, kxu: kxu, ghost: ghost, R: R, dot: d0, th: th, pts: pts, radius: radius, G2: G2, hs: hs, triAt: triAt, TL: TL };
    d.tags = tagItems(d);
    d.keys = {
      grid: [G2, K, radius.toFixed(3), TA.toFixed(3)].join('|'),
      dotGlyph: [a, b, dotOn, rectOn, radius.toFixed(3)].join('|'),
      crossGlyph: [first, second, crossOn, K, radius.toFixed(3)].join('|'),
      hand: [first, second, hand, curl.toFixed(4)].join('|')
    };
    d.key = [d.keys.grid, d.keys.dotGlyph, d.keys.crossGlyph, first, second, hand, curl.toFixed(1), show, swap, s.lat].join('#');
    return d;
  }

  /** Scene labels (≤ 6, fewer on small views; full text → short text for views under 420 × 200 px). */
  function tagItems(d) {
    var it = [], A = d.nmA, B = d.nmB;
    if (d.K) {
      it.push({ at: [0.18, 0, 1.2], text: 'k̂ (up)', color: TEAL, priority: 0, short: 'k̂' });
      it.push({ at: scl(d.b, 1.06), text: 'u (wind)', color: ORANGE, priority: 1, short: 'u' });
      it.push({ at: scl(d.kxu, 1.08), text: 'k×u: 90° left of u', color: VIOLET, priority: 2, short: 'k×u' });
      var side = d.f > 0 ? 'right of u (NH)' : d.f < 0 ? 'left of u (SH)' : 'zero (equator)';
      if (norm(d.ghost) > 0) it.push({ at: scl(d.ghost, 1.1), text: '−f k×u ×10⁴: ' + side, color: VIOLET, priority: 3, short: '−f k×u' });
      return it;
    }
    it.push({ at: scl(d.a, 1.1), tex: String.raw`\mathbf a`, text: 'a', color: TEAL, priority: 0 });
    it.push({ at: scl(d.b, 1.08), tex: String.raw`\mathbf b`, text: 'b', color: ORANGE, priority: 1 });
    var R = d.R;
    if (d.dotOn && R) {
      if (d.rectOn) {
        var cen = scl(add(R.foot, R.side), 0.5);
        var txt = Math.abs(R.sp) < 1e-9 ? 'a·b = 0: no shadow, no rectangle'
          : 'a·b = shadow × |b| = ' + fmt(R.sp) + ' × ' + fmt(R.long) + ' = ' + fmt(d.dot);
        it.push({ at: cen, text: txt, color: d.dot < 0 ? ROSE : TEAL, priority: 2, short: 'a·b = ' + fmt(d.dot) });
      } else {
        it.push({ at: add(scl(R.foot, 0.55), scl(R.e, 0.45)), text: 'shadow ' + fmt(R.sp), color: R.sp < 0 ? ROSE : TEAL, priority: 2, short: fmt(R.sp) });
      }
    }
    if (d.crossOn) {
      var P = d.first, Q = d.second, nm = d.swap ? 'b×a' : 'a×b';
      if (d.deg) it.push({ at: add(scl(d.a, 0.5), [0, 0, 0.6]), text: nm + ' = 0: parallel, no area', color: VIOLET, priority: 2, short: nm + ' = 0' });
      else {
        it.push({ at: scl(d.cr, 1.07), text: nm + ' = ' + vtxt(d.cr), color: VIOLET, priority: d.rectOn ? 3 : 2, short: nm });
        it.push({ at: scl(add(P, Q), 0.5), text: 'area = |' + nm + '| = ' + fmt(d.area), color: VIOLET, priority: d.rectOn ? 4 : 3, short: 'area ' + fmt(d.area) });
      }
    }
    if (d.hand && d.deg) it.push({ at: add(scl(d.a, 0.5), [0, 0, 1.0]), text: 'parallel: no turning, no thumb', color: NEUTRAL, priority: 2, short: 'no turning' });
    if (d.pose) it.push({ at: add(add(d.pose.thumb[2], scl(d.pose.F.n, 0.1 * d.hs)), scl(d.pose.F.e1, -0.7 * d.hs)), text: 'thumb → ' + (d.swap ? 'b×a' : 'a×b'), color: NEUTRAL, priority: 4, short: 'thumb' });
    return it;
  }

  /* ---------- camera presets (fitted to what is drawn: same rule as the PoC, plus 'tip') ---------- */
  function frame(P, w, h) {
    var d = unit([P.pos[0] - P.target[0], P.pos[1] - P.target[1], P.pos[2] - P.target[2]]), f = [-d[0], -d[1], -d[2]];
    var r = cross(f, [0, 0, 1]); r = norm(r) > 1e-9 ? unit(r) : [1, 0, 0];
    var small = w < 420 || h < 200, padY = small ? 26 : (P.padY || 46), tv = Math.tan(FOV / 2 * Math.PI / 180);
    return { d: d, r: r, u: cross(r, f), tv: tv * Math.max(0.45, 1 - 2 * padY / h), th: tv * w / h * Math.max(0.5, 1 - 2 * 40 / w) };
  }
  function fitPreset(P, pts, w, h) {
    var lo = [0, 1, 2].map(function (i) { return Math.min.apply(null, pts.map(function (p) { return p[i]; })); });
    var hi = [0, 1, 2].map(function (i) { return Math.max.apply(null, pts.map(function (p) { return p[i]; })); });
    var c = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2], F = frame(P, w, h), d = F.d, D = 1;
    pts.forEach(function (p) {
      var v = [p[0] - c[0], p[1] - c[1], p[2] - c[2]], z = dot(v, d);
      D = Math.max(D, z + Math.abs(dot(v, F.r)) / F.th, z + Math.abs(dot(v, F.u)) / F.tv);
    });
    return { pos: [c[0] + D * d[0], c[1] + D * d[1], c[2] + D * d[2]], target: c, normal: P.normal, fitted: true, padY: P.padY };
  }
  /** Fraction of the usable half-width / half-height reached by the farthest drawn point (≤ 1: all inside). */
  function fillFraction(P, pts, w, h) {
    var F = frame(P, w, h), D = norm([P.pos[0] - P.target[0], P.pos[1] - P.target[1], P.pos[2] - P.target[2]]);
    return Math.max.apply(null, pts.map(function (p) {
      var v = [p[0] - P.target[0], p[1] - P.target[1], p[2] - P.target[2]], z = D - dot(v, F.d);
      return Math.max(Math.abs(dot(v, F.r)) / (z * F.th), Math.abs(dot(v, F.u)) / (z * F.tv));
    }));
  }
  function nudge(n) { return Math.abs(n[2]) > 0.9995 ? unit([n[0], n[1] - 0.012, n[2]]) : n; }
  function presetDirections(d) {
    var a = d.a, b = d.b, n = planeNormal(a, b), T = [0, 0, 0];
    var ua = norm(a) > 0 ? unit(a) : unit(b), ub0 = norm(b) > 0 ? unit(b) : ua;
    var bis = add(ua, ub0); if (norm(bis) < 1e-6) bis = ua;
    var e = cross(n, bis); if (norm(e) < 1e-9) e = cross(n, [1, 0, 0]); if (norm(e) < 1e-9) e = cross(n, [0, 1, 0]);
    e = unit(e); if (e[2] < -0.2) e = scl(e, -1);
    var tipN = d.deg ? n : unit(d.cr);
    return {
      iso: { pos: unit(ISO_DIR), target: T },
      faceOn: { pos: nudge(n), target: T, normal: n },
      tip: { pos: nudge(tipN), target: T, normal: tipN },
      edgeOn: { pos: e, target: T, normal: n },
      top: { pos: unit([0, -0.08, 1]), target: T }
    };
  }
  function cameraPresetsFor(d, fit) {
    var P = presetDirections(d);
    Object.keys(P).forEach(function (k) { P[k].padY = d.K ? 78 : 46; });   // k-mode: badge + legend HUD at the top
    Object.keys(P).forEach(function (k) {
      if (fit && fit.pts && fit.w > 0 && fit.h > 0) P[k] = fitPreset(P[k], fit.pts, fit.w, fit.h);
      else P[k] = { pos: scl(P[k].pos, 14), target: [0, 0, 0], normal: P[k].normal };
    });
    return P;
  }

  /* ---------- three.js geometry helpers (all materials Lambert/Basic: dispose → renderer memory 0) ---------- */
  function V3(T, p) { return new T.Vector3(p[0], p[1], p[2]); }
  function cylGeo(T, p0, p1, r, seg) {
    var v = sub(p1, p0), L = norm(v); if (!(L > 1e-9)) return null;
    var g = new T.CylinderGeometry(r, r, L, seg || 12, 1, true); g.translate(0, L / 2, 0);
    var m = new T.Matrix4().compose(V3(T, p0), new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), V3(T, unit(v))), new T.Vector3(1, 1, 1));
    g.applyMatrix4(m); g.userData.m = m; return g;
  }
  function coneGeo(T, base, dir, r, h) {
    var g = new T.ConeGeometry(r, h, 14, 1); g.translate(0, h / 2, 0);
    g.applyMatrix4(new T.Matrix4().compose(V3(T, base), new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), V3(T, unit(dir))), new T.Vector3(1, 1, 1)));
    return g;
  }
  function sphGeo(T, p, r) { var g = new T.SphereGeometry(r, 12, 8); g.translate(p[0], p[1], p[2]); return g; }
  /** Merge geometries (positions + normals) into one: one draw call per material. */
  function mergeGeos(T, parts) {
    var arrs = [], nors = [], n = 0;
    parts.forEach(function (g) {
      if (!g) return; var gg = g.index ? g.toNonIndexed() : g;
      if (!gg.attributes.normal) gg.computeVertexNormals();
      arrs.push(gg.attributes.position.array); nors.push(gg.attributes.normal.array); n += gg.attributes.position.array.length;
      if (gg !== g) gg.dispose(); g.dispose();
    });
    var pos = new Float32Array(n), nor = new Float32Array(n), o = 0;
    arrs.forEach(function (a, i) { pos.set(a, o); nor.set(nors[i], o); o += a.length; });
    var geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('normal', new T.BufferAttribute(nor, 3));
    return geo;
  }
  function lambert(T, col, opt) { opt = opt || {}; return new T.MeshLambertMaterial({ color: new T.Color(col), transparent: !!opt.opacity, opacity: opt.opacity || 1, side: opt.side ? T.DoubleSide : T.FrontSide }); }
  function line(T, pts, col, opt) {
    opt = opt || {};
    var g = new T.BufferGeometry().setFromPoints(pts.map(function (p) { return V3(T, p); }));
    var mat = opt.dash ? new T.LineDashedMaterial({ color: new T.Color(col), dashSize: opt.dash[0], gapSize: opt.dash[1], transparent: opt.opacity !== undefined, opacity: opt.opacity === undefined ? 1 : opt.opacity })
      : new T.LineBasicMaterial({ color: new T.Color(col), transparent: opt.opacity !== undefined, opacity: opt.opacity === undefined ? 1 : opt.opacity });
    var l = opt.segments ? new T.LineSegments(g, mat) : new T.Line(g, mat); if (opt.dash) l.computeLineDistances();
    return l;
  }
  function quad(T, c, col, opacity) {
    var pos = new Float32Array([].concat(c[0], c[1], c[2], c[0], c[2], c[3]));
    var g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3));
    return new T.Mesh(g, new T.MeshBasicMaterial({ color: new T.Color(col), transparent: true, opacity: opacity, side: T.DoubleSide, depthWrite: false }));
  }
  /** A tube arc from u1 (unit) turning toward u2 (unit, ⟂ u1) by angle th at radius r, with a cone arrowhead. */
  function arcMesh(T, u1, u2, th, r, rad, col) {
    var n = Math.max(8, Math.ceil(th / (Math.PI / 36))), parts = [], pts = [], head = Math.min(r * 0.45, rad * 7), stop = th - head / r;
    for (var k = 0; k <= n; k++) { var ph = Math.max(0, stop) * k / n; pts.push(add(scl(u1, r * Math.cos(ph)), scl(u2, r * Math.sin(ph)))); }
    for (var j = 0; j + 1 < pts.length; j++) parts.push(cylGeo(T, pts[j], pts[j + 1], rad, 8));
    var end = pts[pts.length - 1], tang = add(scl(u1, -Math.sin(Math.max(0, stop))), scl(u2, Math.cos(Math.max(0, stop))));
    parts.push(coneGeo(T, end, tang, rad * 2.8, head));
    return new T.Mesh(mergeGeos(T, parts), lambert(T, col));
  }
  function disposeTree(o) {
    o.traverse(function (c) { if (c.geometry) c.geometry.dispose(); if (c.material) (Array.isArray(c.material) ? c.material : [c.material]).forEach(function (m) { m.dispose(); }); });
    if (o.parent) o.parent.remove(o);
  }

  /* ---------- host builders: each returns a THREE.Group for the current description d ---------- */
  var BUILD = {
    grid: function (S, d) {
      var T = S.THREE, g = new T.Group(), G = d.G2, seg = [];
      for (var i = -G; i <= G; i++) { seg.push([i, -G, 0], [i, G, 0], [-G, i, 0], [G, i, 0]); }
      g.add(line(T, seg, isDark() ? '#64748b' : '#9aa3b2', { segments: true, opacity: 0.45 }));
      var pl = quad(T, [[-G, -G, 0], [G, -G, 0], [G, G, 0], [-G, G, 0]], '#2563eb', 0.05); g.add(pl);
      var at = d.triAt, L = d.TL, r = 0.03 * clamp(G / 4, 1, 3), parts = [];
      [[L, 0, 0], [0, L, 0], [0, 0, L]].forEach(function (v) { parts.push(cylGeo(T, at, add(at, scl(v, 0.82)), r, 8), coneGeo(T, add(at, scl(v, 0.82)), v, r * 2.6, L * 0.18)); });
      g.add(new T.Mesh(mergeGeos(T, parts), lambert(T, NEUTRAL)));
      g.userData.triadAt = at; g.userData.triadL = L;
      return g;
    },
    dotGlyph: function (S, d) {
      var T = S.THREE, g = new T.Group(), R = d.R; if (!d.dotOn || !R) return g;
      var neg = R.sp < 0, col = neg ? ROSE : TEAL, rad = d.radius;
      if (Math.abs(R.sp) > 1e-9) {
        /* the shadow: a thick segment ON b's line, nudged 2.2 shaft radii toward the rectangle side so it never hides a
           (anti-parallel: a lies on b's line itself) — F-A.12 */
        var off = scl(R.e, rad * 2.2);
        g.add(new T.Mesh(mergeGeos(T, [cylGeo(T, off, add(R.foot, off), rad * 1.7, 10), sphGeo(T, add(R.foot, off), rad * 2.2)]), lambert(T, col)));
      }
      var da = sub(d.a, R.foot);
      if (norm(da) > 1e-6) {
        g.add(line(T, [d.a, R.foot], textColor(), { dash: [0.12, 0.09], opacity: 0.8 }));
        var t = Math.min(0.28, 0.25 * norm(da), 0.25 * Math.max(Math.abs(R.sp), 0.4)), u1 = scl(R.bh, R.sp >= 0 ? -1 : 1), u2 = unit(da);
        g.add(line(T, [add(R.foot, scl(u1, t)), add(add(R.foot, scl(u1, t)), scl(u2, t)), add(R.foot, scl(u2, t))], textColor(), { opacity: 0.9 }));
      }
      if (d.rectOn && Math.abs(R.sp) > 1e-9) {
        var q = quad(T, R.corners, col, neg ? 0.16 : 0.22); g.add(q); g.userData.rect = q;
        var loop = R.corners.concat([R.corners[0]]);
        g.add(line(T, loop, col, neg ? { dash: [0.18, 0.12] } : {}));
        if (neg) {                                                    // hatching: negative area, not only by hue
          var hs = [], nH = 7;
          for (var k = 1; k < nH; k++) { var f = k / nH; hs.push(scl(R.foot, f), scl(R.side, f), add(R.foot, scl(R.side, f)), add(R.side, scl(R.foot, f))); }
          g.add(line(T, hs, ROSE, { segments: true, opacity: 0.55 }));
        }
        /* the long side marked |b| (the rectangle's other side is the shadow) */
        g.add(line(T, [R.corners[3], R.corners[2]], col, { opacity: 0.9 }));
      }
      return g;
    },
    crossGlyph: function (S, d) {
      var T = S.THREE, g = new T.Group(); if (!d.crossOn) return g;
      var rad = d.radius;
      if (d.K) {                                                       // f k×u mode: the 90°-left turn from u to k×u
        var U = norm(d.b); if (!(U > 0)) return g;
        g.add(arcMesh(T, unit(d.b), unit(d.kxu), Math.PI / 2, 0.32 * U, rad * 0.7, GHOST));
        return g;
      }
      if (d.deg) return g;
      var P = d.first, Q = d.second, c = [[0, 0, 0], P, add(P, Q), Q];
      var pm = quad(T, c, VIOLET, 0.16); g.add(pm); g.userData.para = pm;
      g.add(line(T, [P, add(P, Q), Q], VIOLET, { opacity: 0.7 }));
      var hf = projection(Q, P);                                       // height: from the second arrow's tip to the base line
      if (norm(sub(Q, hf)) > 1e-6) {
        g.add(line(T, [Q, hf], VIOLET, { dash: [0.14, 0.1], opacity: 0.9 }));
        var t = Math.min(0.25, 0.2 * norm(sub(Q, hf))), u1 = unit(scl(P, dot(hf, P) >= 0 ? -1 : 1)), u2 = unit(sub(Q, hf));
        if (norm(hf) < 1e-6) u1 = unit(P);
        g.add(line(T, [add(hf, scl(u1, t)), add(add(hf, scl(u1, t)), scl(u2, t)), add(hf, scl(u2, t))], VIOLET, { opacity: 0.9 }));
      }
      var F = handFrame(P, Q);                                         // the curl arc first → second, arrowhead at second
      if (F.ok) g.add(arcMesh(T, F.e1, F.e2, F.theta, 0.3 * Math.min(norm(P), norm(Q)), rad * 0.55, textColor()));
      return g;
    },
    hand: function (S, d) {
      var T = S.THREE, g = new T.Group(), H = d.pose; if (!H) return g;
      var parts = [];
      var pb = new T.BoxGeometry(H.palm.dims[0], H.palm.dims[1], H.palm.dims[2]);
      var F = H.F, mb = new T.Matrix4().makeBasis(V3(T, F.e1), V3(T, F.e2), V3(T, F.n)); mb.setPosition(V3(T, H.palm.c)); pb.applyMatrix4(mb); parts.push(pb);
      H.fingers.forEach(function (f) {
        for (var k = 0; k < 3; k++) parts.push(cylGeo(T, f[k], f[k + 1], H.rf, 10));
        f.forEach(function (p) { parts.push(sphGeo(T, p, H.rf * 1.02)); });
      });
      var tc1 = cylGeo(T, H.thumb[0], H.thumb[1], H.rt, 10), tc2 = cylGeo(T, H.thumb[1], H.thumb[2], H.rt * 0.95, 10);
      var thumbM = tc2 ? tc2.userData.m.clone() : null;
      parts.push(tc1, tc2); H.thumb.forEach(function (p, i) { parts.push(sphGeo(T, p, (i ? 0.97 : 1.15) * H.rt)); });
      var hm = new T.Mesh(mergeGeos(T, parts), lambert(T, HANDC)); g.add(hm);
      g.add(new T.Mesh(mergeGeos(T, [cylGeo(T, H.cuff[0], H.cuff[1], 0.3 * H.s, 14)]), lambert(T, CUFF)));
      if (thumbM) { var y = new T.Vector3().setFromMatrixColumn(thumbM, 1).normalize(); g.userData.thumbAxis = [y.x, y.y, y.z]; }
      var lf = H.fingers[1], dv = sub(lf[3], lf[2]); g.userData.tipDir = unit(dv);
      return g;
    }
  };
  var HOSTS = ['grid', 'dotGlyph', 'crossGlyph', 'hand'];

  /** Attach this module's meshes to the host layers whose kit group is new or out of date. Returns true if it built. */
  function attach(S) {
    var d = S._vpl && S._vpl.d; if (!d || !S.active || !S.THREE) return false;
    var did = false, th = isDark() ? 'd' : 'l';
    HOSTS.forEach(function (id) {
      var L = S.get(id); if (!L || !L.obj) return;
      var key = d.keys[id] + '|' + th;
      if (L.obj.userData.vplKey === key) return;
      var old = L.obj.userData.vplGroup; if (old) disposeTree(old);
      var grp = BUILD[id](S, d); L.obj.add(grp); L.obj.userData.vplGroup = grp; L.obj.userData.vplKey = key; did = true;
    });
    return did;
  }
  function host(id, prov, visible) { return global.Viz3D.vectorField({ id: id, points: [], vectors: [], pick: false, visible: visible, provenance: prov }); }

  function arrowData(d) {
    var pts = [[0, 0, 0], [0, 0, 0]], vs = [d.a, d.b], cols = [TEAL, ORANGE];
    if (d.crossOn && !d.deg) { pts.push([0, 0, 0]); vs.push(d.cr); cols.push(VIOLET); }
    return { points: pts, vectors: vs, color: function (i) { return cols[i]; }, radius: d.radius };
  }
  function ghostBeads(g) {
    var pts = [], vs = [], n = GHOST_DASHES;
    for (var i = 0; i < n; i++) {
      var s0 = i / n, len = i === n - 1 ? 1 / n : 0.6 / n;
      pts.push([g[0] * s0, g[1] * s0, g[2] * s0]); vs.push([g[0] * len, g[1] * len, g[2] * len]);
    }
    return { points: pts, vectors: vs };
  }
  function axisItems(d) {
    var at = d.triAt, L = d.TL, lab = d.K ? ['E', 'N', 'U'] : ['x', 'y', 'z'];          // E/N/U explained in the HUD legend
    return [[L, 0, 0], [0, L, 0], [0, 0, L]].map(function (v, i) { return { at: add(at, scl(v, 1.18)), text: lab[i], color: NEUTRAL, priority: i, short: lab[i].charAt(0) }; });
  }
  var GHOST_LABEL = '−f k×u drawn ×10⁴, in m/s² (k×u is in m/s)';

  function create(view, app) {
    var Viz3D = global.Viz3D;
    var s0 = (app && app.state) || {}, d = describe(s0);
    return Viz3D.scene(view, {
      camera: { fov: FOV, up: 'z', near: 0.05, far: 300, position: [9, -10.5, 8], target: [0, 0, 1] },
      controls: { orbit: true, pan: 'desktop', damping: 0.1, minPolar: 0.01, maxPolar: Math.PI - 0.01 },
      background: 'token:--viz-bg', lazy: true, fallback: 'proj3', provenance: true, audit: Viz3D.auditFromUrl(),
      proj3Scale: 0.28
    }).then(function (S) {
      if (!S) return null;
      S._vpl = { d: d, key: '', ck: '', fit: null, state: Object.assign({}, s0), cam: 'iso', userCam: false, wh: '', short: {} };
      S.add(host('grid', { kind: 'schematic', text: 'grid z = 0, 1 unit' }, true));
      S.add(Viz3D.labels(axisItems(d), { id: 'axisLabels', maxVisible: 3 }));
      var ad = arrowData(d);
      S.add(Viz3D.vectorField({ id: 'arrows', points: ad.points, vectors: ad.vectors, color: ad.color, radius: ad.radius, scale: 1,
        provenance: { kind: 'computed', text: 'fluidpy.geo.vectors.cross' } }));
      S.add(host('dotGlyph', { kind: 'computed', text: 'vectors.scalar_projection × norm' }, d.dotOn));
      S.add(host('crossGlyph', { kind: 'computed', text: 'vectors.parallelogram_area' }, d.crossOn));
      S.add(host('hand', { kind: 'schematic', text: 'right hand (our geometry)' }, !!d.pose));
      var gb = ghostBeads(d.ghost);
      S.add(Viz3D.vectorField({ id: 'ghostCoriolis', points: gb.points, vectors: gb.vectors, scale: 1, radius: d.radius * 0.8, color: GHOST,
        visible: d.K, exaggeration: true, exaggerationLabel: GHOST_LABEL, pick: false,
        provenance: { kind: 'computed', text: 'vectors.k_cross · frames.coriolis_parameter' } }));
      S.add(Viz3D.labels(d.tags, { id: 'tags' }));
      S.add(Viz3D.cameraPresets(cameraPresetsFor(d, null), { id: 'cams', tween: 700, reducedMotion: 'cut' }));
      S.on('frame', function () {
        if (S.controls && !S.controls._vplHooked) {                    // a real drag: keep the user's camera on resize
          S.controls._vplHooked = true;
          S.controls.addEventListener('start', function () { if (S._vpl) S._vpl.userCam = true; });
        }
        if (attach(S)) S.render();
        shortLabels(S);
      });
      if ('ResizeObserver' in global) {
        var pend = false;
        S._vplRO = new ResizeObserver(function () {
          if (S._disposed) { S._vplRO.disconnect(); return; }
          if (pend) return; pend = true;
          global.requestAnimationFrame(function () { pend = false; if (!S._disposed) update(S, S._vpl.state); });
        });
        S._vplRO.observe(S.holder);
      }
      update(S, s0);
      return S;
    });
  }
  /** Small views (< 420 × 200 px): each label switches to its short text (and back). */
  function shortLabels(S) {
    var small = S.holder.clientWidth < 420 || S.holder.clientHeight < 200, map = S._vpl.short;
    ['tags', 'axisLabels'].forEach(function (id) {
      var L = S.get(id); if (!L || !L.obj) return;
      L.obj.traverse(function (o) {
        if (!o.isCSS2DObject) return; var e = o.element;
        if (!e.dataset.full) e.dataset.full = e.textContent;
        var t = small && map[e.dataset.full] ? map[e.dataset.full] : e.dataset.full;
        if (e.textContent !== t && !e.querySelector('.katex')) e.textContent = t;
      });
    });
  }

  function fitFor(S, d) { return { pts: d.pts, w: (S.holder && S.holder.clientWidth) || 640, h: (S.holder && S.holder.clientHeight) || 360 }; }
  function bboxKey(pts) {
    var lo = [0, 1, 2].map(function (i) { return Math.min.apply(null, pts.map(function (p) { return p[i]; })).toFixed(3); });
    var hi = [0, 1, 2].map(function (i) { return Math.max.apply(null, pts.map(function (p) { return p[i]; })).toFixed(3); });
    return lo.join(',') + '/' + hi.join(',');
  }

  function update(S, state) {
    if (!S || !S._vpl) return;
    var V = S._vpl, d = describe(state || {});
    V.state = Object.assign({}, state); V.d = d;
    var fit = fitFor(S, d), wh = fit.w + 'x' + fit.h, ck = bboxKey(d.pts) + '|' + d.show + '|' + d.swap + '|' + wh;
    if (ck !== V.ck) {
      var resized = V.wh && V.wh !== wh;
      V.ck = ck; V.fit = fit; V.wh = wh;
      S.remove('cams'); S.add(global.Viz3D.cameraPresets(cameraPresetsFor(d, fit), { id: 'cams', tween: 700, reducedMotion: 'cut' }));
      /* P-A.6: the holder changed size (⤢ maximise, Esc, window resize): re-apply the current preset so the bigger view
         is used — unless the reader has dragged the camera since the last preset */
      if (resized && !V.userCam && S.presets[V.cam]) S.goto(V.cam, 0);
    }
    if (d.key === V.key) { if (attach(S)) S.render(); return; }
    V.key = d.key;
    d.tags.concat(axisItems(d)).forEach(function (it) { if (it.short) V.short[it.text] = it.short; });
    var ad = arrowData(d);
    S.set('arrows', { points: ad.points, vectors: ad.vectors, color: ad.color, radius: ad.radius });
    var ax = axisItems(d), axk = JSON.stringify(ax), tgk = JSON.stringify(d.tags), relabel = false;
    if (axk !== V.axk) { V.axk = axk; S.set('axisLabels', { items: ax }); relabel = true; }
    if (tgk !== V.tgk) { V.tgk = tgk; S.set('tags', { items: d.tags }); relabel = true; }
    var gb = ghostBeads(d.ghost);
    S.set('ghostCoriolis', { points: gb.points, vectors: gb.vectors, radius: d.radius * 0.8 });
    [['dotGlyph', d.dotOn], ['crossGlyph', d.crossOn], ['hand', !!d.pose], ['ghostCoriolis', d.K]].forEach(function (x) {
      var L = S.get(x[0]); if (L && (L.opts.visible !== false) !== x[1]) S.set(x[0], { visible: x[1] });
    });
    attach(S);
    /* a rebuilt label layer has its DOM elements appended only by the next CSS2D render: render now, in the same task, or
       labels vanish while the transport plays (the app's frame rebuilt them after every render) */
    if (relabel && S.active) S.renderNow(); else S.render();
  }

  function goto(S, name) {
    if (!S) return Promise.resolve();
    if (S._vpl) { S._vpl.cam = name; S._vpl.userCam = false; S._vpl.lastGoto = Date.now(); }
    return S.presets[name] ? S.goto(name) : Promise.resolve();
  }
  /** After a preset / typed values changed what is drawn: cut to the current camera preset, re-fitted — unless the reader
      dragged the camera since, or a walkthrough step just started its own (tweened) camera move. */
  function refit(S) {
    var V = S && S._vpl; if (!V || V.userCam || !S.presets[V.cam]) return;
    if (V.lastGoto && Date.now() - V.lastGoto < 900) return;
    S.goto(V.cam, 0);
  }

  /* ---------- selftest rows ---------- */
  function lit(v) { return Array.isArray(v) ? '[' + v.map(lit).join(', ') + ']' : (Number.isInteger(v) ? v.toFixed(1) : String(v)); }
  function readArrow(S, id, i) {        // instance i of a vectorField: full drawn length and direction
    var L = S.get(id); if (!S.active || !L || !L.obj || !S.THREE) return null;
    var T = S.THREE, m = new T.Matrix4(), sh = L.obj.userData.shaft, hd = L.obj.userData.head;
    if (!sh || i >= sh.count) return null;
    sh.getMatrixAt(i, m); var p0 = new T.Vector3().setFromMatrixPosition(m);
    hd.getMatrixAt(i, m); var tip = new T.Vector3(0, 1, 0).applyMatrix4(m);
    return { len: tip.distanceTo(p0), dir: tip.clone().sub(p0).normalize().toArray(), tip: tip.toArray() };
  }
  function hostGroup(S, id) { var L = S.get(id); return L && L.obj ? L.obj.userData.vplGroup : null; }

  function selftestRows(S) {
    var V = 'fluidpy.geo.vectors.', rows = [];
    var cases = [
      { n: 'start preset', a: [2, 1, 0], b: [2, 4, 0] },
      { n: 'tilted preset', a: [1, 2, 2], b: [3, 0, 0] },
      { n: 'anti-parallel', a: [2, 1, 0], b: [-4, -2, 0] },
      { n: 'general 3-D', a: [1.2, -0.7, 2.3], b: [-0.4, 1.9, 0.6] },
      { n: 'nearly parallel (atan2)', a: [1, 1e-7, 0], b: [1, 0, 0] }
    ];
    cases.forEach(function (c) {
      var A = lit(c.a), B = lit(c.b), x = cross(c.a, c.b);
      rows.push({ name: 'scene dot ' + c.n + ' (K 2.2)', js: dot(c.a, c.b), py: V + 'dot(' + A + ', ' + B + ')', rtol: 1e-12, atol: 1e-15 });
      [0, 1, 2].forEach(function (i) { rows.push({ name: 'scene cross[' + i + '] ' + c.n + ' (K 2.20)', js: x[i], py: V + 'cross(' + A + ', ' + B + ')[' + i + ']', rtol: 1e-12, atol: 1e-15 }); });
      rows.push({ name: 'scene angle_between ' + c.n + ' (atan2, rad)', js: angle_between(c.a, c.b), py: V + 'angle_between(' + A + ', ' + B + ')', rtol: 1e-12, atol: 1e-15 });
      rows.push({ name: 'scene scalar_projection ' + c.n, js: scalar_projection(c.a, c.b), py: V + 'scalar_projection(' + A + ', ' + B + ')', rtol: 1e-12, atol: 1e-15 });
      rows.push({ name: 'scene parallelogram_area ' + c.n + ' (0A.2)', js: parallelogram_area(c.a, c.b), py: V + 'parallelogram_area(' + A + ', ' + B + ')', rtol: 1e-12, atol: 1e-15 });
      var R = dotRect(c.a, c.b);
      rows.push({ name: 'rectangle model: signed area = a·b ' + c.n, js: R.area, expect: dot(c.a, c.b), rtol: 1e-12, atol: 1e-12 });
      rows.push({ name: 'rectangle model: long side = |b| ' + c.n, js: norm(R.side), expect: norm(c.b), rtol: 1e-12 });
      rows.push({ name: 'rectangle model: in the a–b plane (corners·n = 0) ' + c.n, js: Math.max.apply(null, R.corners.map(function (p) { return Math.abs(dot(p, R.n)); })), expect: 0, atol: 1e-12 });
    });
    rows.push({ name: 'scene triple_scalar e_x·(e_y×e_z) (K 2.21)', js: triple_scalar([1, 0, 0], [0, 1, 0], [0, 0, 1]), py: V + 'triple_scalar([1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0])', rtol: 1e-12 });
    rows.push({ name: 'scene k_cross(8, 6, 0)[0]', js: k_cross([8, 6, 0])[0], py: V + 'k_cross([8.0, 6.0, 0.0])[0]', rtol: 1e-12 });
    rows.push({ name: 'scene coriolis_parameter(45°)', js: coriolis_parameter(Math.PI / 4), py: 'fluidpy.geo.frames.coriolis_parameter(math.pi / 4)', rtol: 1e-12 });
    rows.push({ name: 'hand model: i×j = k (east × north = up): thumb up', js: handPose([1, 0, 0], [0, 1, 0], 1, 1).thumbDir[2], expect: 1, atol: 1e-12 });
    rows.push({ name: 'hand model: curl 1 puts the fingertips along b', js: dot(handPose([2, 1, 0], [2, 4, 0], 1, 1).tipDir, unit([2, 4, 0])), expect: 1, atol: 1e-12 });
    rows.push({ name: 'hand model: curl 0 puts the fingertips along a', js: dot(handPose([2, 1, 0], [2, 4, 0], 0, 1).tipDir, unit([2, 1, 0])), expect: 1, atol: 1e-12 });
    rows.push({ name: 'hand model: parallel pair → no hand', js: handPose([2, 1, 0], [4, 2, 0], 1, 1) === null ? 1 : 0, expect: 1 });

    if (!S || !S._vpl) return rows;
    var keep = Object.assign({}, S._vpl.state), keepCam = S._vpl.cam;

    /* drawn read-backs: switch the scene to known states synchronously, read the GPU-side geometry, then restore */
    function drawn(state, fn) { update(S, state); attach(S); try { fn(S._vpl.d); } catch (e) { rows.push({ name: 'drawn read-back threw: ' + e.message, js: NaN, expect: 0 }); } }
    var base = { ax: 2, ay: 1, az: 0, bx: 2, by: 4, bz: 0, kmode: false, lat: 45, curl: 1 };
    if (S.active) {
      drawn(Object.assign({}, base, { show: 'dot' }), function (d) {
        var g = hostGroup(S, 'dotGlyph'), q = g && g.userData.rect;
        if (!q) { rows.push({ name: 'drawn rectangle exists (start preset)', js: 0, expect: 1 }); return; }
        var p = q.geometry.attributes.position.array, c0 = [p[0], p[1], p[2]], c1 = [p[3], p[4], p[5]], c3 = [p[15], p[16], p[17]];
        var e1 = sub(c1, c0), e2 = sub(c3, c0), sg = Math.sign(dot(e1, d.b));
        rows.push({ name: 'drawn rectangle: signed area = a·b = 8 (float32)', js: sg * norm(cross(e1, e2)), expect: dot(d.a, d.b), rtol: 1e-5 });
        rows.push({ name: 'drawn rectangle: long side = |b| (float32)', js: norm(e2), expect: norm(d.b), rtol: 1e-5 });
        rows.push({ name: 'drawn rectangle: short side = shadow a·b/|b| (float32)', js: norm(e1), expect: scalar_projection(d.a, d.b), rtol: 1e-5 });
        rows.push({ name: 'drawn rectangle lies in the a–b plane (float32)', js: Math.max(Math.abs(dot(e1, unit(cross(d.a, d.b)))), Math.abs(dot(e2, unit(cross(d.a, d.b))))), expect: 0, atol: 1e-5 });
        rows.push({ name: 'drawn rectangle is on the side away from a', js: dot(e2, d.a) <= 1e-9 ? 1 : 0, expect: 1 });
        var ar = readArrow(S, 'arrows', 2);
        rows.push({ name: 'no a·b arrow in space: arrows layer holds only a and b in dot mode', js: S.get('arrows').obj.userData.shaft.count, expect: 2 });
        rows.push({ name: 'dot mode: no result arrow drawn', js: ar ? 1 : 0, expect: 0 });
      });
      drawn(Object.assign({}, base, { bx: -4, by: -2, show: 'dot' }), function (d) {
        var g = hostGroup(S, 'dotGlyph'), q = g && g.userData.rect;
        if (!q) { rows.push({ name: 'drawn rectangle exists (anti-parallel)', js: 0, expect: 1 }); return; }
        var p = q.geometry.attributes.position.array, c0 = [p[0], p[1], p[2]], c1 = [p[3], p[4], p[5]], c3 = [p[15], p[16], p[17]];
        var e1 = sub(c1, c0), e2 = sub(c3, c0), sg = Math.sign(dot(e1, d.b));
        rows.push({ name: 'drawn rectangle anti-parallel: signed area = −10 (float32)', js: sg * norm(cross(e1, e2)), expect: -10, rtol: 1e-5 });
        rows.push({ name: 'anti-parallel: the shadow foot is a itself (behind the origin on b’s line)', js: norm(sub(d.R.foot, d.a)), expect: 0, atol: 1e-12 });
      });
      drawn(Object.assign({}, base, { show: 'cross', hand: true, swap: false }), function (d) {
        var r = readArrow(S, 'arrows', 2), g = hostGroup(S, 'crossGlyph'), h = hostGroup(S, 'hand');
        rows.push({ name: 'drawn a×b arrow ⟂ a (float32)', js: dot(r.dir, unit(d.a)), expect: 0, atol: 1e-5 });
        rows.push({ name: 'drawn a×b arrow ⟂ b (float32)', js: dot(r.dir, unit(d.b)), expect: 0, atol: 1e-5 });
        rows.push({ name: 'drawn a×b arrow length = area = 6 (float32)', js: r.len, expect: 6, rtol: 1e-5 });
        if (g && g.userData.para) {
          var p = g.userData.para.geometry.attributes.position.array, e1 = [p[3] - p[0], p[4] - p[1], p[5] - p[2]], e2 = [p[15] - p[0], p[16] - p[1], p[17] - p[2]];
          rows.push({ name: 'drawn parallelogram area = |a×b| = 6 (float32)', js: norm(cross(e1, e2)), expect: 6, rtol: 1e-5 });
        }
        var ta = h && h.userData.thumbAxis;
        rows.push({ name: 'drawn hand: thumb ∥ a×b (cos > 0.999)', js: ta ? (dot(ta, unit(d.cr)) > 0.999 ? 1 : 0) : 0, expect: 1 });
        rows.push({ name: 'drawn hand: fingertips end along b (cos > 0.999)', js: h && h.userData.tipDir ? (dot(h.userData.tipDir, unit(d.b)) > 0.999 ? 1 : 0) : 0, expect: 1 });
        S._vplThumbAB = ta;
      });
      drawn(Object.assign({}, base, { show: 'cross', hand: true, swap: true }), function (d) {
        var h = hostGroup(S, 'hand'), ta = h && h.userData.thumbAxis, r = readArrow(S, 'arrows', 2);
        rows.push({ name: 'swap: drawn thumb ∥ b×a (cos > 0.999)', js: ta ? (dot(ta, unit(cross(d.b, d.a))) > 0.999 ? 1 : 0) : 0, expect: 1 });
        rows.push({ name: 'swap flips the thumb: thumb(a×b)·thumb(b×a) = −1', js: ta && S._vplThumbAB ? dot(ta, S._vplThumbAB) : NaN, expect: -1, atol: 1e-5 });
        rows.push({ name: 'swap: drawn result arrow = b×a = (0, 0, −6) (z, float32)', js: r ? r.tip[2] : NaN, expect: -6, rtol: 1e-5 });
      });
      drawn(Object.assign({}, base, { bx: 4, by: 2, show: 'cross', hand: true }), function (d) {
        rows.push({ name: 'parallel: the hand is hidden (no turning, no thumb)', js: S.get('hand').opts.visible === false ? 1 : 0, expect: 1 });
        rows.push({ name: 'parallel: the note "no turning" is a label', js: d.tags.some(function (t) { return /no turning/.test(t.text); }) ? 1 : 0, expect: 1 });
      });
      [0, 60, 200].forEach(function (turn) {
        var u = [8 * Math.cos(turn * D2R) - 6 * Math.sin(turn * D2R), 8 * Math.sin(turn * D2R) + 6 * Math.cos(turn * D2R), 0];
        drawn({ ax: 0, ay: 0, az: 1, bx: u[0], by: u[1], bz: 0, kmode: true, lat: 45, show: 'cross' }, function (d) {
          var ru = readArrow(S, 'arrows', 1), rk = readArrow(S, 'arrows', 2), gh = readArrow(S, 'ghostCoriolis', GHOST_DASHES - 1);
          rows.push({ name: 'k-mode turn ' + turn + '°: drawn u stays horizontal (u_z, float32)', js: ru.dir[2], expect: 0, atol: 1e-6 });
          rows.push({ name: 'k-mode turn ' + turn + '°: drawn |u| = 10 m/s (float32)', js: ru.len, expect: 10, rtol: 1e-5 });
          rows.push({ name: 'k-mode turn ' + turn + '°: drawn k×u ⟂ u (float32)', js: dot(rk.dir, ru.dir), expect: 0, atol: 1e-5 });
          rows.push({ name: 'k-mode turn ' + turn + '°: drawn k×u is 90° LEFT of u ((u×(k×u))_z > 0)', js: cross(ru.dir, rk.dir)[2], expect: 1, atol: 1e-5 });
          if (gh) rows.push({ name: 'k-mode turn ' + turn + '°: drawn −f k×u (last bead) points right of u at 45°N', js: dot(gh.dir, rk.dir), expect: -1, atol: 1e-5 });
          rows.push({ name: 'k-mode turn ' + turn + '°: no a·b label in the scene', js: d.tags.some(function (t) { return /a·b|k·u/.test(t.text); }) ? 1 : 0, expect: 0 });
        });
      });
      drawn({ ax: 0, ay: 0, az: 1, bx: 8, by: 6, bz: 0, kmode: true, lat: 45, show: 'cross' }, function () {
        var GL = S.get('ghostCoriolis'), d = S._vpl.d, m4 = new S.THREE.Matrix4(), tipv = new S.THREE.Vector3(0, 1, 0);
        GL.obj.userData.head.getMatrixAt(GHOST_DASHES - 1, m4); tipv.applyMatrix4(m4);
        rows.push({ name: 'drawn ghost: last bead ends at −f k×u ×10⁴ (float32)', js: tipv.distanceTo(new S.THREE.Vector3().fromArray(d.ghost)), expect: 0, atol: 1e-4 * Math.max(1, norm(d.ghost)) });
        rows.push({ name: 'ghost is beaded (' + GHOST_DASHES + ' dashes), not one solid arrow', js: GL.obj.userData.shaft.count, expect: GHOST_DASHES });
        rows.push({ name: 'k-mode badge says ×10⁴ and the different units', js: /×10⁴/.test(S.badge.textContent) && /m\/s²/.test(S.badge.textContent) ? 1 : 0, expect: 1 });
      });
    }
    /* restore the reader's state and camera, then the camera rows for that state */
    update(S, keep); attach(S);
    var d = S._vpl.d, fit = S._vpl.fit || fitFor(S, d), P = cameraPresetsFor(d, fit);
    Object.keys(P).forEach(function (k) {
      var fr = fillFraction(P[k], fit.pts, fit.w, fit.h);
      rows.push({ name: 'camera "' + k + '" fits every drawn tip inside the view (fraction ≤ 1)', js: fr <= 1 + 1e-9 ? 1 : 0, expect: 1 });
    });
    STEP_CAMERAS.forEach(function (c, i) { rows.push({ name: 'walkthrough step ' + (i + 1) + ' camera "' + c + '" is a preset', js: S.presets[c] ? 1 : 0, expect: 1 }); });
    function rel(p) { return unit(sub(p.pos, p.target)); }
    rows.push({ name: 'faceOn looks along the a–b normal (|cos| > cos 1°)', js: Math.abs(dot(rel(P.faceOn), P.faceOn.normal)) > Math.cos(Math.PI / 180) ? 1 : 0, expect: 1 });
    if (!d.deg) rows.push({ name: 'tip view looks down from the tip of the result (cos > cos 1°)', js: dot(rel(P.tip), unit(d.cr)) > Math.cos(Math.PI / 180) ? 1 : 0, expect: 1 });
    rows.push({ name: 'edgeOn lies in the a–b plane (cos = 0)', js: dot(rel(P.edgeOn), P.edgeOn.normal), expect: 0, atol: 1e-12 });
    if (S.active && global.Viz3D.reducedMotion) {
      Object.keys(P).forEach(function (k) {
        S.goto(k); var cs = S.cameraState(), pp = S.presets[k].pos;
        rows.push({ name: 'goto("' + k + '") lands on the preset (camera read-back)', js: Math.hypot(cs.pos[0] - pp[0], cs.pos[1] - pp[1], cs.pos[2] - pp[2]), expect: 0, atol: 1e-4 });
      });
      if (S.presets[keepCam]) S.goto(keepCam);
    }
    return rows;
  }

  global.SCENE_vector_products_lab = { create: create, update: update, selftestRows: selftestRows, goto: goto, refit: refit, ghostBeads: ghostBeads,
    fillFraction: fillFraction, physics: physics, STEP_CAMERAS: STEP_CAMERAS, cameraPresetsFor: cameraPresetsFor, describe: describe,
    handPose: handPose, handFrame: handFrame, dotRect: dotRect, planeNormal: planeNormal, GHOST_LABEL: GHOST_LABEL };
})(window);
