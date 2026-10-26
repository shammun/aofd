// Hand3D: a procedural RIGHT hand from primitives (no external model), for the right-hand-rule scenes.
// Local frame: X = fingers, Y = palm normal (out of the palm) = thumb × fingers, Z = thumb. The hand's orientation is a
// proper rotation (det = +1) built from (fingers, thumb) - it is NEVER mirrored (no negative scale); a left-handed
// basis throws. Fingers curl about local +Z, i.e. their tips sweep from X towards the palm normal Y - for fingers on
// the first arrow and the thumb on first × second, that is towards the second arrow (checked in rhr.json, det rows).
import React, { useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { V3, cross3, dot3, norm3 } from "./cam";

const SKIN = "#f4ecd2";
const LINE = "#56607a";

/** proper rotation taking local (X fingers, Y palm normal, Z thumb) to world; throws on a left-handed basis */
export const handQuat = (fingers: V3, thumb: V3): THREE.Quaternion => {
  const f = norm3(fingers);
  // make the thumb exactly perpendicular to the fingers (Gram-Schmidt), then palm normal n = t × f
  const t0 = norm3(thumb), tt = norm3([t0[0] - f[0] * dot3(t0, f), t0[1] - f[1] * dot3(t0, f), t0[2] - f[2] * dot3(t0, f)]);
  const n = cross3(tt, f);
  const det = dot3(f, cross3(n, tt));
  if (!(det > 0.999)) throw new Error(`Hand3D: basis is not right-handed (det ${det})`);
  const m = new THREE.Matrix4().makeBasis(new THREE.Vector3(...f), new THREE.Vector3(...n), new THREE.Vector3(...tt));
  return new THREE.Quaternion().setFromRotationMatrix(m);
};
export const slerpQ = (a: THREE.Quaternion, b: THREE.Quaternion, t: number) => a.clone().slerp(b, Math.max(0, Math.min(1, t)));
/** local → world for a hand point (for overlays: e.g. where the thumb tip is) */
export const handPoint = (q: THREE.Quaternion, at: V3, s: number, local: V3): V3 => {
  const v = new THREE.Vector3(...local).multiplyScalar(s).applyQuaternion(q);
  return [at[0] + v.x, at[1] + v.y, at[2] + v.z];
};

// finger layout: base z (index side = +Z, next to the thumb), segment lengths, radii (tapered)
const FINGERS = [
  { z: 0.30, L: [0.40, 0.25, 0.20], r: [0.092, 0.084, 0.076] },  // index
  { z: 0.10, L: [0.44, 0.28, 0.21], r: [0.095, 0.087, 0.078] },  // middle
  { z: -0.10, L: [0.41, 0.26, 0.20], r: [0.090, 0.082, 0.074] }, // ring
  { z: -0.29, L: [0.32, 0.21, 0.17], r: [0.080, 0.073, 0.066] }, // little
];
// the thumb: a thick metacarpal mound on the palm side of the index edge, then two short phalanges pointing up (+Z)
const THUMB = { base: [-0.1, 0.1, 0.38] as V3, dirs: [[0.22, 0.12, 1], [0.12, 0.04, 1]] as V3[], L: [0.3, 0.25], r: [0.135, 0.118] };
export const FINGER_BASE_X = 0.45;

export type HandAngles = number[][]; // [finger][joint] degrees (MCP, PIP, DIP), bending towards the palm normal
export const POSE = {
  open: (): HandAngles => FINGERS.map(() => [0, 0, 0]),
  /** a readable curl: the fingers wrap round (not a closed fist) so the curl direction shows */
  curl: (c: number): HandAngles => FINGERS.map((_, i) => [(58 + 4 * i) * c, (78 + 3 * i) * c, 48 * c]),
  /** index straight along the first arrow, middle bent at its knuckle by `mid` degrees (towards the second), ring and
   * little folded into the palm */
  flat: (mid: number): HandAngles => [[0, 0, 0], [mid, 0, 0], [78, 102, 70], [78, 102, 70]],
  mix: (a: HandAngles, b: HandAngles, t: number): HandAngles => a.map((f, i) => f.map((x, j) => x + (b[i][j] - x) * Math.max(0, Math.min(1, t)))),
};

const rotZ = (deg: number): V3 => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180), 0];
const UPY = new THREE.Vector3(0, 1, 0);

const Seg: React.FC<{ a: V3; b: V3; r: number; geo: THREE.CapsuleGeometry; mat: THREE.Material; line: THREE.Material; noLine?: boolean }> = ({ a, b, r, geo, mat, line, noLine }) => {
  const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const L = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(UPY, d.clone().normalize());
  const mid: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  const sl = L / (geo.parameters.height + 2 * r);
  return (
    <group position={mid} quaternion={q}>
      <mesh geometry={geo} material={mat} scale={[1, sl, 1]} />
      {noLine ? null : <mesh geometry={geo} material={line} scale={[1.08, sl * (1 + 0.05 / Math.max(sl, 0.2)), 1.08]} />}
    </group>
  );
};

/**
 * The hand. `q` from handQuat(fingers, thumb); `at` = world position of the local origin (palm centre); `s` = size
 * (1 → about 1.9 world units from wrist to the middle fingertip). `glow` recolours parts (index, middle, thumb, all).
 */
export const Hand3D: React.FC<{ q: THREE.Quaternion; at: V3; s?: number; angles: HandAngles; o?: number;
  glow?: { index?: string; middle?: string; thumb?: string; all?: string }; glowK?: number; thumb?: number }> = ({ q, at, s = 1, angles, o = 1, glow = {}, glowK = 1, thumb = 1 }) => {
  const skin = useMemo(() => new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.62, metalness: 0, transparent: true }), []);
  const line = useMemo(() => new THREE.MeshBasicMaterial({ color: LINE, side: THREE.BackSide, transparent: true }), []);
  const gMats = useMemo(() => ({} as Record<string, THREE.MeshStandardMaterial>), []);
  skin.emissive.set("#5a4a3a").multiplyScalar(0.25);
  skin.opacity = o; line.opacity = o; skin.depthWrite = o > 0.98; line.depthWrite = o > 0.98;
  const matFor = (part: "index" | "middle" | "thumb" | "other") => {
    const c = (part !== "other" ? glow[part] : undefined) ?? glow.all;
    if (!c) return skin;
    const key = `${c}`;
    if (!gMats[key]) gMats[key] = new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, metalness: 0, transparent: true });
    const m = gMats[key];
    m.color.set(SKIN).lerp(new THREE.Color(c), 0.85 * glowK);
    m.emissive.set(c).multiplyScalar(0.35 * glowK);
    m.opacity = o;
    return m;
  };
  const geos = useMemo(() => ({
    palm: new RoundedBoxGeometry(1.0, 0.4, 0.9, 6, 0.19),
    wrist: new THREE.CapsuleGeometry(0.25, 0.22, 8, 20),
    mound: new THREE.SphereGeometry(1, 24, 16),
    knuck: new THREE.SphereGeometry(1, 16, 12),
    fing: FINGERS.map((F) => F.L.map((L, j) => new THREE.CapsuleGeometry(F.r[j], Math.max(0.01, L - 0.02), 6, 16))),
    thumb: THUMB.L.map((L, j) => new THREE.CapsuleGeometry(THUMB.r[j], Math.max(0.01, L - 0.02), 6, 16)),
  }), []);
  if (o <= 0) return null;
  const parts: React.ReactNode[] = [];
  FINGERS.forEach((F, i) => {
    let p: V3 = [FINGER_BASE_X - 0.05, 0.02, F.z];
    let ang = 0;
    const m = matFor(i === 0 ? "index" : i === 1 ? "middle" : "other");
    F.L.forEach((L, j) => {
      ang += angles[i][j];
      const d = rotZ(ang);
      const nx: V3 = [p[0] + d[0] * L, p[1] + d[1] * L, p[2]];
      parts.push(<Seg key={`f${i}${j}`} a={p} b={nx} r={F.r[j]} geo={geos.fing[i][j]} mat={m} line={line} />);
      parts.push(<mesh key={`k${i}${j}`} geometry={geos.knuck} material={m} position={p} scale={[F.r[j] * 1.04, F.r[j] * 1.04, F.r[j] * 1.04]} />);
      p = nx;
    });
  });
  let tp: V3 = THUMB.base;
  THUMB.L.forEach((L, j) => {
    // thumb = 0: lying along the side of the index finger (open flat hand); 1: straight up (the thumb's direction)
    const flatDir: V3 = j === 0 ? [0.75, 0.12, 0.45] : [1, 0.05, 0.12];
    const tw = Math.max(0, Math.min(1, thumb));
    const d = norm3([flatDir[0] + (THUMB.dirs[j][0] - flatDir[0]) * tw, flatDir[1] + (THUMB.dirs[j][1] - flatDir[1]) * tw, flatDir[2] + (THUMB.dirs[j][2] - flatDir[2]) * tw]);
    const nx: V3 = [tp[0] + d[0] * L, tp[1] + d[1] * L, tp[2] + d[2] * L];
    parts.push(<Seg key={`t${j}`} a={tp} b={nx} r={THUMB.r[j]} geo={geos.thumb[j]} mat={matFor("thumb")} line={line} noLine={j > 0} />);
    if (j > 0) parts.push(<mesh key={`tk${j}`} geometry={geos.knuck} material={matFor("thumb")} position={tp} scale={[THUMB.r[j] * 1.08, THUMB.r[j] * 1.08, THUMB.r[j] * 1.08]} />);
    tp = nx;
  });
  return (
    <group position={at} quaternion={q} scale={[s, s, s]}>
      <mesh geometry={geos.palm} material={matFor("other")} position={[-0.05, 0, 0]} />
      <mesh geometry={geos.palm} material={line} position={[-0.05, 0, 0]} scale={[1.035, 1.1, 1.04]} />
      {/* thenar mound: the fleshy base of the thumb on the palm side of the index edge */}
      <mesh geometry={geos.mound} material={matFor("thumb")} position={[-0.2, 0.1, 0.3]} scale={[0.3, 0.17, 0.2]} />
      <mesh geometry={geos.mound} material={line} position={[-0.2, 0.1, 0.3]} scale={[0.315, 0.185, 0.215]} />
      <group position={[-0.68, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.66, 1, 1.25]}>
        <mesh geometry={geos.wrist} material={matFor("other")} />
        <mesh geometry={geos.wrist} material={line} scale={[1.07, 1.03, 1.07]} />
      </group>
      {parts}
    </group>
  );
};
/** local position of finger i's tip for the given joint angles (the same forward kinematics as Hand3D) */
export const fingerTipLocal = (angles: HandAngles, i: number): V3 => {
  const F = FINGERS[i];
  let p: V3 = [FINGER_BASE_X - 0.05, 0.02, F.z];
  let ang = 0;
  F.L.forEach((L, j) => {
    ang += angles[i][j];
    const d = rotZ(ang);
    p = [p[0] + d[0] * L, p[1] + d[1] * L, p[2]];
  });
  return p;
};
/** local positions of useful points (for overlays and anchoring) */
export const HAND_PTS = {
  thumbTip: [THUMB.base[0] + 0.06, THUMB.base[1] + 0.05, THUMB.base[2] + 0.5] as V3,
  thumbBase: THUMB.base,
  indexTip: [FINGER_BASE_X + 0.8, 0, 0.31] as V3,
};
