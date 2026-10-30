// House kit globecam (UF2 K7, 2026-10-29): the globe camera of the house globe (cross-product v5 s33/s34, HOUSE_STYLE §5b).
// Promoted from ch00/kit_cp/globe.tsx (identical copies in ch00_weather_basics/kit_wb/globe.tsx). Pure functions of their
// inputs: one GlobeCam drives both the WebGL view and the SVG overlays (globeProj), so streaks, chevrons and labels sit on
// the sphere exactly. Globe coordinates: unit sphere, Y up (north pole), lon 0 on +Z, lon 90E on +X.
import * as THREE from "three";
import { CamState, D2R, Pt, V3, add3, dot3, easeIO, lerpN, norm3, projector, sub3 } from "./cam";

/** (lat, lon, r) → globe coordinates */
export const ll = (lat: number, lon: number, r = 1): V3 => {
  const la = lat * D2R, lo = lon * D2R;
  return [r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo)];
};
/** local east / north / up unit vectors at (lat, lon) */
export const enAt = (lat: number, lon: number): { e: V3; n: V3; u: V3 } => {
  const la = lat * D2R, lo = lon * D2R;
  return { e: [Math.cos(lo), 0, -Math.sin(lo)], n: [-Math.sin(la) * Math.sin(lo), Math.cos(la), -Math.sin(la) * Math.cos(lo)], u: ll(lat, lon) };
};
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];

/** Globe camera: eye above (lat, lon) at `dist` Earth radii from the centre, north up; `pp` = where the sub-camera point
 * is drawn (px in the canvas); `tilt` leans the view towards the horizon; `yaw` turns it about the local vertical;
 * `hop` (on a path key) raises the camera by hop × sin(πt) on the way to that key. */
export type GlobeCam = { lat: number; lon: number; dist: number; fov?: number; pp?: Pt; tilt?: number; yaw?: number; hop?: number };
export const globeCam = (g: GlobeCam, ppDef: Pt): CamState => {
  const { e, n, u } = enAt(g.lat, g.lon);
  const surf = ll(g.lat, g.lon);
  const h = g.dist - 1, el = (90 - (g.tilt ?? 0)) * D2R, yw = (g.yaw ?? 0) * D2R;
  const back = norm3(add3(mul(n, -Math.cos(yw)), mul(e, -Math.sin(yw))));
  const dir = norm3(add3(mul(u, Math.sin(el)), mul(back, Math.cos(el))));
  return { pos: add3(surf, dir, h), target: surf, up: n, fov: g.fov ?? 35, pp: g.pp ?? ppDef };
};

/** Keyframed globe camera (frame-keyed, scene-relative): the sub-camera point slerps along the great circle, dist / fov /
 * tilt / yaw / pp ease in-out; `hop` on a key lifts the camera on the way there (the v5 ocean-to-ocean hop). */
export type GlobeKey = GlobeCam & { f: number };
export const globePath = (keys: GlobeKey[], f: number): GlobeCam => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const A = keys[i - 1], B = keys[i];
    if (f <= B.f) {
      const t = easeIO((f - A.f) / Math.max(1, B.f - A.f));
      const a = ll(A.lat, A.lon), b = ll(B.lat, B.lon);
      const om = Math.acos(Math.max(-1, Math.min(1, dot3(a, b))));
      let v: V3 = a;
      if (om > 1e-6) { const s = Math.sin(om); v = add3(mul(a, Math.sin((1 - t) * om) / s), b, Math.sin(t * om) / s); }
      const lat = Math.asin(Math.max(-1, Math.min(1, v[1]))) / D2R, lon = Math.atan2(v[0], v[2]) / D2R;
      return { lat, lon, dist: lerpN(A.dist, B.dist, t) + (B.hop ?? 0) * Math.sin(Math.PI * t),
        fov: lerpN(A.fov ?? 35, B.fov ?? 35, t), tilt: lerpN(A.tilt ?? 0, B.tilt ?? 0, t), yaw: lerpN(A.yaw ?? 0, B.yaw ?? 0, t),
        pp: A.pp && B.pp ? [lerpN(A.pp[0], B.pp[0], t), lerpN(A.pp[1], B.pp[1], t)] : B.pp ?? A.pp };
    }
  }
  return keys[keys.length - 1];
};

/** A hover: keys from a list of stops [{f0, f1, cam}] — fly (eased) into each stop over `fly` frames, then hold it with a
 * slow eastward drift of `drift` deg/s (house §5b: "a hover is a held key with a 2°/s drift, so the picture never
 * freezes"). Returns globePath keys; append the zoom-out stop yourself (every tour ends where it started). */
export const hoverKeys = (stops: { f: number; hold: number; cam: GlobeCam }[], fps = 30, drift = 2): GlobeKey[] => {
  const out: GlobeKey[] = [];
  for (const s of stops) {
    out.push({ ...s.cam, f: s.f });
    if (s.hold > 0) out.push({ ...s.cam, lon: s.cam.lon + (drift * s.hold) / fps, f: s.f + s.hold, hop: undefined });
  }
  return out;
};

/** zoom amount of a globe camera for the K1 frame: 0 for a whole globe (dist ≥ d0), 1 when zoomed (dist ≤ d1) */
export const zoomOf = (cam: GlobeCam, d0 = 3.4, d1 = 2.9) => Math.max(0, Math.min(1, (d0 - cam.dist) / (d0 - d1)));

/** apparent silhouette radius (px) of the unit globe at `dist` for a canvas `h` px tall and fov (deg) */
export const silhouetteR = (dist: number, h: number, fov = 35) => (h / 2) * Math.tan(Math.asin(1 / Math.max(1.0001, dist))) / Math.tan((fov / 2) * D2R);

/** globe-to-world transform (spin about the polar axis, then a tilt about `tiltAxis`) */
export const globeMatrix = (spin = 0, tiltDeg = 0, tiltAxis: V3 = [0, 0, 1]) =>
  new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(...tiltAxis).normalize(), tiltDeg * D2R).multiply(new THREE.Matrix4().makeRotationY(spin));

/** SVG projector of a globe camera: p(lat, lon, r) → page px, vis() = in front of the horizon */
export type GProj = { p: (lat: number, lon: number, r?: number) => Pt; vis: (lat: number, lon: number, r?: number) => boolean;
  pw: (w: V3) => Pt; w: (lat: number, lon: number, r?: number) => V3; st: CamState; wpp: (v: V3) => number; camPos: V3 };
export const globeProj = (st: CamState, W: number, H: number, ox = 0, oy = 0, M?: THREE.Matrix4): GProj => {
  const pr = projector(st, W, H, ox, oy);
  const v = new THREE.Vector3();
  const w = (lat: number, lon: number, r = 1): V3 => {
    const q = ll(lat, lon, r);
    if (!M) return q;
    v.set(q[0], q[1], q[2]).applyMatrix4(M);
    return [v.x, v.y, v.z];
  };
  const vis = (lat: number, lon: number, r = 1) => {
    const q = w(lat, lon, r);
    return dot3(q, sub3(st.pos, q)) > 0.002;
  };
  return { p: (lat, lon, r = 1) => pr.p(w(lat, lon, r)), vis, pw: pr.p, w, st, wpp: pr.wpp, camPos: st.pos };
};
