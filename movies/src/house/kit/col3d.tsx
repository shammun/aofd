// House kit K4 (UF2, 2026-10-29; HOUSE_STYLE §5b "slabs and columns: every vertical edge runs all the way to the top"):
// 3-D air columns and slabs for View3D scenes. Promoted from ch00_weather_basics/kit_wb/col3d.tsx + the movie's
// ColumnFaces (whose corner rods stopped at 0.55 × top, user U2-07). Z up, base [0,1]×[0,1] = one square metre.
//   Box3D, BoxEdges3D, Plate3D   translucent boxes, their edges as rods, a base plate
//   ColumnFaces                  a column to `top`: faces fading with height (fade(t), t = z/top), FOUR vertical edges
//                                from the ground to `top` (constant opacity), base plate with gold edges
//   columnEdges(top)             the edge segments ColumnFaces draws (the K6/W92 geometry assert reads them)
import React, { useMemo } from "react";
import * as THREE from "three";
import { V3 } from "./cam";
import { Rod3D } from "./three3d";

/** a translucent axis-aligned box [a, b] (Z up); faces drawn as `bands` sleeves whose opacity follows oz(t) or 1 − fade·t */
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

/** the 12 edges of a box as rods (px wide on screen); `skipTop` leaves the top square open; vertical edges always reach b.z */
export const BoxEdges3D: React.FC<{ a: V3; b: V3; color: string; px?: number; o?: number; skipTop?: boolean; vert?: number }> = ({ a, b, color, px = 4, o = 1, skipTop = false, vert = 1 }) => {
  if (o <= 0) return null;
  const [x0, y0, z0] = a, [x1, y1, z1] = b;
  const c = (x: number, y: number, z: number): V3 => [x, y, z];
  const zt = z0 + (z1 - z0) * vert;
  const segs: [V3, V3][] = [
    [c(x0, y0, z0), c(x1, y0, z0)], [c(x1, y0, z0), c(x1, y1, z0)], [c(x1, y1, z0), c(x0, y1, z0)], [c(x0, y1, z0), c(x0, y0, z0)],
  ];
  if (vert > 0) segs.push([c(x0, y0, z0), c(x0, y0, zt)], [c(x1, y0, z0), c(x1, y0, zt)], [c(x1, y1, z0), c(x1, y1, zt)], [c(x0, y1, z0), c(x0, y1, zt)]);
  if (!skipTop) segs.push([c(x0, y0, z1), c(x1, y0, z1)], [c(x1, y0, z1), c(x1, y1, z1)], [c(x1, y1, z1), c(x0, y1, z1)], [c(x0, y1, z1), c(x0, y0, z1)]);
  return <group>{segs.map(([p, q], i) => <Rod3D key={i} a={p} b={q} px={px} color={color} o={o} />)}</group>;
};

/** a flat square plate on the ground (fill + edge rods) */
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

/** the four vertical edges of a column on [x0,x1]×[y0,y1] from the ground to `top` (the geometry K6 / W92 asserts) */
export const columnEdges = (top: number, x0 = 0, x1 = 1, y0 = 0, y1 = 1): [V3, V3][] =>
  [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => [[x, y, 0], [x, y, top]] as [V3, V3]);

/** K6 / W92 geometry assert: every vertical edge of a column reaches its top (throws, so a short edge fails the render) */
export const assertColumnEdges = (top: number, name = "column") => {
  columnEdges(top).forEach(([a, b]) => { if (a[2] !== 0 || Math.abs(b[2] - top) > 1e-12) throw new Error(`${name}: a vertical edge stops at ${b[2]} (top ${top})`); });
  return true;
};

/**
 * ColumnFaces: the house air column on [x0,x1]×[y0,y1] (default one square metre) from the ground to `top` world units.
 *   fade(t)  face opacity at relative height t = z/top (e.g. the air's density e^(−z/H)); faces only — the four vertical
 *            edges keep a constant opacity (0.7, #9fd3ff, 3 px) all the way to `top` (U2-07 / G5)
 *   dim      scales the faces (a dimmed column behind a slab); `tint` recolours the faces (a uniform warm column)
 *   plate    the base plate with gold edges (true)
 */
export const ColumnFaces: React.FC<{ top: number; fade?: (t: number) => number; o?: number; dim?: number; tint?: string; faceO?: number; plate?: boolean;
  x0?: number; x1?: number; y0?: number; y1?: number; edge?: string; edgePx?: number; edgeO?: number; bands?: number }> = ({
  top, fade = () => 1, o = 1, dim = 1, tint = "#7cc4ff", faceO = 0.42, plate = true, x0 = 0, x1 = 1, y0 = 0, y1 = 1, edge = "#9fd3ff", edgePx = 3, edgeO = 0.7, bands = 28 }) => {
  if (o <= 0) return null;
  return (
    <>
      <Box3D a={[x0, y0, 0]} b={[x1, y1, top]} color={tint} o={faceO * o * dim} bands={bands} oz={fade} top={false} />
      {columnEdges(top, x0, x1, y0, y1).map(([a, b], i) => <Rod3D key={i} a={a} b={b} px={edgePx} color={edge} o={edgeO * o} />)}
      {plate ? <Plate3D a={[x0 - 0.02, y0 - 0.02, 0]} b={[x1 + 0.02, y1 + 0.02, 0]} fill="#3a4766" fo={0.85} edge="#d8b23a" px={5} o={o} /> : null}
    </>
  );
};
