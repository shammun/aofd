// Copied 2026-11-04 into kit_gr (ch00_gradient, #6) from kit_co (#5) unchanged except this line, so this movie bundles independently.
// Copied 2026-11-04 into kit_co (ch00_coordinates) unchanged except this line, so this movie bundles independently.
// Copied 2026-10-28 from movies/src/ch00_weather_basics/kit_wb (unchanged) so this movie bundles independently.
// Camera maths for the cross-product movie's 3-D scenes (kit_cp). Pure functions of their inputs (deterministic).
// One camera description drives BOTH the WebGL render (View3D) and the SVG overlays (projector), so labels, floor grids,
// arcs and tracks drawn in SVG sit exactly on the 3-D objects.
import * as THREE from "three";

export type V3 = [number, number, number];
export type Pt = [number, number];

/** A resolved camera: position, look-at target, up vector, vertical fov (perspective) or visible world height
 * (orthographic), and the principal point pp (screen px inside the canvas) where the target is drawn. */
export type CamState = { pos: V3; target: V3; up: V3; fov: number; ortho?: number; pp: Pt };

export const D2R = Math.PI / 180;
export const add3 = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
export const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul3 = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
export const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const len3 = (a: V3) => Math.hypot(a[0], a[1], a[2]);
export const norm3 = (a: V3): V3 => { const L = len3(a) || 1; return [a[0] / L, a[1] / L, a[2] / L]; };
export const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const easeIO = (t: number) => { const x = clamp01(t); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

/** Orbit camera in a Z-up world: azimuth from +x towards +y, elevation above the floor, distance from the target.
 * The default up vector is ∂(position)/∂el, continuous through el = ±90° (straight above it points from the camera
 * towards the target horizontally, so az 270° straight above shows x to the right and y up the screen). */
export type Orbit = { az: number; el: number; dist: number; target: V3; fov?: number; up?: V3; ortho?: number; pp?: Pt };
export const orbitCam = (o: Orbit, ppDefault: Pt): CamState => {
  const a = o.az * D2R, e = o.el * D2R;
  const d: V3 = [Math.cos(e) * Math.cos(a), Math.cos(e) * Math.sin(a), Math.sin(e)];
  const up: V3 = o.up ?? [-Math.sin(e) * Math.cos(a), -Math.sin(e) * Math.sin(a), Math.cos(e)];
  return { pos: add3(o.target, d, o.dist), target: o.target, up, fov: o.fov ?? 35, ortho: o.ortho, pp: o.pp ?? ppDefault };
};

/** Keyframed orbit path: keys at frames f (scene-relative), eased in-out between keys; azimuth goes the short way
 * unless the later key has `orbit` (then az runs linearly by that many degrees, e.g. +360). Explicit `up` vectors are
 * interpolated and re-normalised. */
export type OrbitKey = Orbit & { f: number; orbit?: number; linear?: boolean };
export const orbitPath = (keys: OrbitKey[], f: number): Orbit => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const A = keys[i - 1], B = keys[i];
    if (f <= B.f) {
      const raw = (f - A.f) / Math.max(1, B.f - A.f);
      const t = B.orbit !== undefined || B.linear ? clamp01(raw) : easeIO(raw);
      let daz = B.az - A.az;
      if (B.orbit !== undefined) daz = B.orbit;
      else { daz = ((daz % 360) + 540) % 360 - 180; }
      const fovA = A.fov ?? 35, fovB = B.fov ?? 35;
      const up = A.up || B.up ? (() => {
        const ua = A.up ?? orbitCam(A, [0, 0]).up, ub = B.up ?? orbitCam(B, [0, 0]).up;
        return norm3(lerp3(ua, ub, t));
      })() : undefined;
      const ppA = A.pp, ppB = B.pp;
      return { az: A.az + daz * t, el: lerpN(A.el, B.el, t), dist: lerpN(A.dist, B.dist, t), target: lerp3(A.target, B.target, t),
        fov: lerpN(fovA, fovB, t), up, ortho: B.ortho ?? A.ortho, pp: ppA && ppB ? [lerpN(ppA[0], ppB[0], t), lerpN(ppA[1], ppB[1], t)] : ppB ?? ppA };
    }
  }
  const last = keys[keys.length - 1];
  return last.orbit !== undefined ? { ...last, az: keys[keys.length - 2].az + last.orbit } : last;
};

/** Apply a CamState to a three.js camera for a W × H canvas, shifting the principal point to st.pp. */
export const applyCam = (c: THREE.PerspectiveCamera | THREE.OrthographicCamera, st: CamState, W: number, H: number) => {
  if ((c as THREE.PerspectiveCamera).isPerspectiveCamera) {
    const p = c as THREE.PerspectiveCamera;
    p.fov = st.fov; p.aspect = W / H; p.near = 0.01; p.far = 200;
  } else {
    const o = c as THREE.OrthographicCamera;
    const hh = (st.ortho ?? 10) / 2, hw = (hh * W) / H;
    o.left = -hw; o.right = hw; o.top = hh; o.bottom = -hh; o.near = -100; o.far = 200;
  }
  c.position.set(...st.pos);
  c.up.set(...st.up);
  c.lookAt(...st.target);
  c.updateMatrixWorld(true);
  c.updateProjectionMatrix();
  const dx = (st.pp[0] - W / 2) / (W / 2), dy = -(st.pp[1] - H / 2) / (H / 2);
  const e = c.projectionMatrix.elements;
  if ((c as THREE.PerspectiveCamera).isPerspectiveCamera) { e[8] = -dx; e[9] = -dy; } else { e[12] += dx; e[13] += dy; }
  c.projectionMatrixInverse.copy(c.projectionMatrix).invert();
};

const _pc = new THREE.PerspectiveCamera(), _oc = new THREE.OrthographicCamera();
const _v = new THREE.Vector3();
/** Screen projector for overlays: world point → [x, y] in page px (canvas offset ox, oy), plus visibility. */
export type Projector = { p: (v: V3) => Pt; vis: (v: V3) => boolean; depth: (v: V3) => number; wpp: (v: V3) => number; st: CamState };
export const projector = (st: CamState, W: number, H: number, ox = 0, oy = 0): Projector => {
  const c = st.ortho ? _oc : _pc;
  applyCam(c, st, W, H);
  const m = c.projectionMatrix.clone().multiply(c.matrixWorldInverse);
  const fwd = norm3(sub3(st.target, st.pos));
  const p = (v: V3): Pt => {
    _v.set(v[0], v[1], v[2]).applyMatrix4(m);
    return [ox + ((_v.x + 1) / 2) * W, oy + ((1 - _v.y) / 2) * H];
  };
  const depth = (v: V3) => dot3(sub3(v, st.pos), fwd);
  const wpp = (v: V3) => (st.ortho ? st.ortho / H : (2 * Math.max(0.05, depth(v)) * Math.tan((st.fov * D2R) / 2)) / H);
  return { p, vis: (v) => st.ortho !== undefined || depth(v) > 0.02, depth, wpp, st };
};
