// UF1 3-D pieces for weather basics (R3 "3-D for space"): translucent boxes (air columns, slabs, a cubic metre), their
// gold edges, a wedge-cut Earth (s02 radius), an expanding parcel sphere and a textured slice wall. Pure functions of
// props (no RNG, no rAF). Proposed for the house kit after this movie: Box3D, BoxEdges3D, WedgeEarth.
import React, { useMemo } from "react";
import * as THREE from "three";
import { V3 } from "./cam";
import { Rod3D } from "./three3d";
import { ll, sphereGeo } from "./globe";

/** a translucent axis-aligned box [x0,x1]×[y0,y1]×[z0,z1] (Z up). `fade` > 0 makes the faces fade with height (the
 * box is drawn as `bands` stacked sleeves whose opacity falls from o at z0 to o·(1 − fade) at z1, or follows `oz`). */
export const Box3D: React.FC<{ a: V3; b: V3; color: string; o?: number; fade?: number; bands?: number; top?: boolean; bottom?: boolean;
  oz?: (t: number) => number; order?: number }> = ({ a, b, color, o = 0.35, fade = 0, bands = 1, top = true, bottom = true, oz, order = 3 }) => {
  const mats = useMemo(() => Array.from({ length: Math.max(1, bands) + 2 }, () => new THREE.MeshBasicMaterial({ color, transparent: true, depthWrite: false, side: THREE.DoubleSide })), [color, bands]);
  if (o <= 0) return null;
  const [x0, y0, z0] = a, [x1, y1, z1] = b, n = Math.max(1, bands);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const za = z0 + ((z1 - z0) * i) / n, zb = z0 + ((z1 - z0) * (i + 1)) / n, t = (i + 0.5) / n;
    const m = mats[i];
    m.opacity = o * (oz ? oz(t) : 1 - fade * t);
    if (m.opacity <= 0.003) continue;
    const h = zb - za, cz = (za + zb) / 2;
    out.push(
      <group key={i}>
        <mesh material={m} position={[(x0 + x1) / 2, y0, cz]} rotation={[Math.PI / 2, 0, 0]} renderOrder={order}><planeGeometry args={[x1 - x0, h]} /></mesh>
        <mesh material={m} position={[(x0 + x1) / 2, y1, cz]} rotation={[Math.PI / 2, 0, 0]} renderOrder={order}><planeGeometry args={[x1 - x0, h]} /></mesh>
        <mesh material={m} position={[x0, (y0 + y1) / 2, cz]} rotation={[Math.PI / 2, Math.PI / 2, 0]} renderOrder={order}><planeGeometry args={[y1 - y0, h]} /></mesh>
        <mesh material={m} position={[x1, (y0 + y1) / 2, cz]} rotation={[Math.PI / 2, Math.PI / 2, 0]} renderOrder={order}><planeGeometry args={[y1 - y0, h]} /></mesh>
      </group>);
  }
  const mt = mats[n], mb = mats[n + 1];
  mt.opacity = o * (oz ? oz(1) : 1 - fade) * 1.1; mb.opacity = o;
  return (
    <group>
      {out}
      {top && mt.opacity > 0.003 ? <mesh material={mt} position={[(x0 + x1) / 2, (y0 + y1) / 2, z1]} renderOrder={order}><planeGeometry args={[x1 - x0, y1 - y0]} /></mesh> : null}
      {bottom ? <mesh material={mb} position={[(x0 + x1) / 2, (y0 + y1) / 2, z0 + 0.001]} renderOrder={order}><planeGeometry args={[x1 - x0, y1 - y0]} /></mesh> : null}
    </group>
  );
};

/** the 12 edges of a box as solid rods (px wide on screen); `skipTop` leaves the top square open (a column fading out) */
export const BoxEdges3D: React.FC<{ a: V3; b: V3; color: string; px?: number; o?: number; skipTop?: boolean; vert?: number }> = ({ a, b, color, px = 4, o = 1, skipTop = false, vert = 1 }) => {
  if (o <= 0) return null;
  const [x0, y0, z0] = a, [x1, y1, z1] = b;
  const c = (x: number, y: number, z: number): V3 => [x, y, z];
  const zt = z0 + (z1 - z0) * vert;
  const segs: [V3, V3][] = [
    [c(x0, y0, z0), c(x1, y0, z0)], [c(x1, y0, z0), c(x1, y1, z0)], [c(x1, y1, z0), c(x0, y1, z0)], [c(x0, y1, z0), c(x0, y0, z0)],
    [c(x0, y0, z0), c(x0, y0, zt)], [c(x1, y0, z0), c(x1, y0, zt)], [c(x1, y1, z0), c(x1, y1, zt)], [c(x0, y1, z0), c(x0, y1, zt)],
  ];
  if (!skipTop) segs.push([c(x0, y0, z1), c(x1, y0, z1)], [c(x1, y0, z1), c(x1, y1, z1)], [c(x1, y1, z1), c(x0, y1, z1)], [c(x0, y1, z1), c(x0, y0, z1)]);
  return <group>{segs.map(([p, q], i) => <Rod3D key={i} a={p} b={q} px={px} color={color} o={o} />)}</group>;
};

/** a flat square plate on the ground (fill + rods) */
export const Plate3D: React.FC<{ a: V3; b: V3; fill: string; fo?: number; edge: string; px?: number; o?: number }> = ({ a, b, fill, fo = 0.5, edge, px = 5, o = 1 }) => {
  const m = useMemo(() => new THREE.MeshBasicMaterial({ color: fill, transparent: true, depthWrite: false, side: THREE.DoubleSide }), [fill]);
  if (o <= 0) return null;
  m.opacity = fo * o;
  const z = a[2];
  return (
    <group>
      <mesh material={m} position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z]} renderOrder={1}><planeGeometry args={[b[0] - a[0], b[1] - a[1]]} /></mesh>
      <BoxEdges3D a={[a[0], a[1], z]} b={[b[0], b[1], z]} color={edge} px={px} o={o} skipTop vert={0} />
    </group>
  );
};

/** the Earth with a quarter wedge (longitudes lon0 … lon0 + 90) pulled out towards `dir` by `slide` (0..1) and faded,
 * showing the two cut faces (dark rock) — so a radius from the centre to the surface lies in the picture (s02, U-WB-04) */
export const WedgeEarth: React.FC<{ tex: THREE.Texture | null; lon0: number; slide: number }> = ({ tex, lon0, slide }) => {
  const rest = useMemo(() => sphereGeo(lon0 + 90, lon0 + 360, 270, 180), [lon0]);
  const wedge = useMemo(() => sphereGeo(lon0, lon0 + 90, 90, 180), [lon0]);
  const faces = useMemo(() => [lon0, lon0 + 90].map((lo) => {
    const m = ll(0, lo), pos: number[] = [0, 0, 0], n = 96;
    for (let i = 0; i <= n; i++) { const t = -Math.PI / 2 + (Math.PI * i) / n; pos.push(0.999 * Math.cos(t) * m[0], 0.999 * Math.sin(t), 0.999 * Math.cos(t) * m[2]); }
    const idx: number[] = []; for (let i = 1; i <= n; i++) idx.push(0, i, i + 1);
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); return g;
  }), [lon0]);
  const mR = useMemo(() => new THREE.MeshBasicMaterial({}), []);
  const mW = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true }), []);
  const mF = useMemo(() => new THREE.MeshBasicMaterial({ color: "#3a3f4b", side: THREE.DoubleSide }), []);
  // the rest-of-globe longitudes run past +180 (u > 1): the shared Earth texture must repeat in u
  if (tex && tex.wrapS !== THREE.RepeatWrapping) { tex.wrapS = THREE.RepeatWrapping; tex.needsUpdate = true; }
  if (mR.map !== tex) { mR.map = tex; mR.needsUpdate = true; }
  if (mW.map !== tex) { mW.map = tex; mW.needsUpdate = true; }
  const s = Math.max(0, Math.min(1, slide));
  const mid = ll(0, lon0 + 45);
  mW.opacity = 1 - s; mW.depthWrite = s < 0.01; // UF1 fix 1 (S6): the slid-out quarter fades away completely (no texture strip behind the cut)
  return (
    <group>
      <mesh geometry={rest} material={mR} />
      {s > 0.002 ? faces.map((g, i) => <mesh key={i} geometry={g} material={mF} />) : null}
      {s < 0.995 ? <mesh geometry={wedge} material={mW} position={[mid[0] * 0.9 * s, 0, mid[2] * 0.9 * s]} renderOrder={4} /> : null}
    </group>
  );
};

/** a lit translucent sphere (an air parcel) of world radius r, colour c */
export const Sphere3D: React.FC<{ at: V3; r: number; color: string; o?: number; emiss?: number }> = ({ at, r, color, o = 0.6, emiss = 0.35 }) => {
  const geo = useMemo(() => new THREE.SphereGeometry(1, 40, 28), []);
  const m = useMemo(() => new THREE.MeshPhongMaterial({ transparent: true, shininess: 40 }), []);
  m.color.set(color); m.emissive.set(color).multiplyScalar(emiss); m.opacity = o; m.depthWrite = o > 0.95;
  if (o <= 0) return null;
  return <mesh geometry={geo} material={m} position={at} scale={[r, r, r]} renderOrder={6} />;
};

/** a vertical textured wall standing on the X axis (y = 0) from x0 to x1, z0 to z1 (the ERA5 slice, s47-s48); `rise` 0..1
 * lifts it out of the ground (its top edge grows from z0) */
export const SliceWall: React.FC<{ tex: THREE.Texture | null; x0: number; x1: number; z0: number; z1: number; rise?: number; o?: number }> = ({ tex, x0, x1, z0, z1, rise = 1, o = 1 }) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const m = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false }), []);
  if (m.map !== tex) { m.map = tex; m.needsUpdate = true; }
  m.opacity = o;
  const r = Math.max(0.001, Math.min(1, rise)), h = (z1 - z0) * r;
  if (!tex || o <= 0) return null;
  return <mesh geometry={geo} material={m} position={[(x0 + x1) / 2, 0, z0 + h / 2]} rotation={[Math.PI / 2, 0, 0]} scale={[x1 - x0, h, 1]} renderOrder={4} />;
};
