// Copied 2026-10-29 into kit_dt (ch00_derivatives_taylor) unchanged except this line, so this movie bundles independently.
// Fix loop 1 (review 1 M10, user rule U-WB-R3 "air parcels in three.js, with visible x, y, z"): the air parcel as a real
// three.js box. BoxEdges3D is copied from movies/src/ch00_weather_basics/kit_wb/col3d.tsx (unchanged) so this movie bundles
// independently; LitBox3D is a translucent box whose faces are lit (MeshStandardMaterial), so the three visible faces read
// as three shades; ParcelBox3D is a small self-contained View3D (its own camera) that drops a parcel at a screen point of
// a flat diagram (s12c, s23); MapSlab3D is a textured map rectangle on z = 0 (s21). Pure functions of props.
import React, { useMemo } from "react";
import * as THREE from "three";
import { V3, orbitCam } from "./cam";
import { Rod3D, View3D, useMat } from "./three3d";

/** the 12 edges of a box as solid rods (px wide on screen) */
export const BoxEdges3D: React.FC<{ a: V3; b: V3; color: string; px?: number; o?: number }> = ({ a, b, color, px = 4, o = 1 }) => {
  if (o <= 0) return null;
  const [x0, y0, z0] = a, [x1, y1, z1] = b;
  const c = (x: number, y: number, z: number): V3 => [x, y, z];
  const segs: [V3, V3][] = [
    [c(x0, y0, z0), c(x1, y0, z0)], [c(x1, y0, z0), c(x1, y1, z0)], [c(x1, y1, z0), c(x0, y1, z0)], [c(x0, y1, z0), c(x0, y0, z0)],
    [c(x0, y0, z0), c(x0, y0, z1)], [c(x1, y0, z0), c(x1, y0, z1)], [c(x1, y1, z0), c(x1, y1, z1)], [c(x0, y1, z0), c(x0, y1, z1)],
    [c(x0, y0, z1), c(x1, y0, z1)], [c(x1, y0, z1), c(x1, y1, z1)], [c(x1, y1, z1), c(x0, y1, z1)], [c(x0, y1, z1), c(x0, y0, z1)],
  ];
  return <group>{segs.map(([p, q], i) => <Rod3D key={i} a={p} b={q} px={px} color={color} o={o} />)}</group>;
};

/** a translucent lit box [a, b] (faces shade differently under the house lights) */
export const LitBox3D: React.FC<{ a: V3; b: V3; color: string; o?: number }> = ({ a, b, color, o = 0.4 }) => {
  const mat = useMat(color, o, 0.18, 0.7);
  mat.side = THREE.DoubleSide;
  mat.depthWrite = false;
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  if (o <= 0) return null;
  return <mesh geometry={geo} material={mat} position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]}
    scale={[Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2])]} renderOrder={6} />;
};

/** the house air parcel: lit translucent box + ink edges */
export const Parcel3D: React.FC<{ c: V3; s?: number; h?: number; color?: string; o?: number; edge?: string; px?: number }> = ({
  c, s = 0.5, h, color = "#7cc4ff", o = 1, edge = "#e8ecf4", px = 3 }) => {
  if (o <= 0) return null;
  const hh = h ?? s * 0.8;
  const a: V3 = [c[0] - s / 2, c[1] - s / 2, c[2] - hh / 2], b: V3 = [c[0] + s / 2, c[1] + s / 2, c[2] + hh / 2];
  return (
    <group>
      <LitBox3D a={a} b={b} color={color} o={0.42 * o} />
      <BoxEdges3D a={a} b={b} color={edge} px={px} o={o} />
    </group>
  );
};

/** one parcel drawn in its own small WebGL view (size px square) centred on screen point p: the same box, seen from the
 * south-west and a little above (az −125°, el 24°), for flat diagrams (s12c forces, s23 arriving parcels) */
export const ParcelBox3D: React.FC<{ p: [number, number]; size?: number; o?: number; color?: string; turn?: number }> = ({
  p, size = 120, o = 1, color = "#7cc4ff", turn = 0 }) => {
  if (o <= 0) return null;
  const st = orbitCam({ az: -125 + turn, el: 24, dist: 4.2, target: [0, 0, 0], fov: 30 }, [size / 2, size / 2]);
  return (
    <View3D st={st} x={p[0] - size / 2} y={p[1] - size / 2} w={size} h={size} o={o} amb={1.1} dir={1.6} key3={[-3, -5, 8]}>
      <Parcel3D c={[0, 0, 0]} s={1.25} h={1.0} color={color} px={Math.max(2, size / 45)} />
    </View3D>
  );
};

/** a textured map rectangle on z = 0 over world [x0, x1] × [y0, y1], showing the texture window [u0, u1] × [v0, v1]
 * (v = 0 at the image bottom) */
export const MapSlab3D: React.FC<{ tex: THREE.Texture | null; x0: number; x1: number; y0: number; y1: number;
  u0: number; u1: number; v0: number; v1: number; o?: number; z?: number }> = ({ tex, x0, x1, y0, y1, u0, u1, v0, v1, o = 1, z = 0 }) => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1, 1);
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) < 0.5 ? u0 : u1, uv.getY(i) < 0.5 ? v0 : v1);
    uv.needsUpdate = true;
    return g;
  }, [u0, u1, v0, v1]);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide }), []);
  if (mat.map !== tex) { mat.map = tex; mat.needsUpdate = true; }
  mat.opacity = o;
  // opaque when fully shown, so translucent arrows and the parcel drawn later are not painted over by the slab
  if (mat.transparent !== o < 1) { mat.transparent = o < 1; mat.needsUpdate = true; }
  if (!tex || o <= 0) return null;
  return <mesh geometry={geo} material={mat} position={[(x0 + x1) / 2, (y0 + y1) / 2, z]} scale={[x1 - x0, y1 - y0, 1]} renderOrder={-1} />;
};
