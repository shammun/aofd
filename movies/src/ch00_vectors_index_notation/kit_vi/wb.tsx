// Copied 2026-10-28 from movies/src/ch00_weather_basics/kit_wb (unchanged) so this movie bundles independently.
// Weather-basics kit (kit_wb): data loading (Float32 bins + JSON headers), colour maps as THREE textures, a flat
// plate-carrée map frame (SVG) and a "map in 3-D" frame (a tilted textured plane with a camera), a translucent air
// shell, terrain relief and helpers for isolines and polylines. Everything is a pure function of the frame and the data
// (no RNG at render, no rAF). Proposed for the house kit after this movie: MapFrame, FieldTexture, Map3D, ShellMesh.
import React, { useMemo } from "react";
import * as THREE from "three";
import { Pt, V3 } from "./cam";
import { useBin } from "./globe";

// ------------------------------------------------------------------------------------------------ bins
export type BinHeader = { variables: { name: string; shape: number[]; offset_bytes: number; count: number }[] };
/** Float32 views of every variable of a bin + header, or null while loading (delayRender inside useBin) */
export const useVars = (url: string, hdr: BinHeader): Record<string, Float32Array> | null => {
  const buf = useBin(url);
  return useMemo(() => {
    if (!buf) return null;
    const out: Record<string, Float32Array> = {};
    for (const v of hdr.variables) out[v.name] = new Float32Array(buf, v.offset_bytes, v.count);
    return out;
  }, [buf, hdr]);
};

// ------------------------------------------------------------------------------------------------ colour maps
export const hexRGB = (h: string): [number, number, number] => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const lutAt = (lut: string[], t: number): [number, number, number] => {
  const x = Math.max(0, Math.min(1, t)) * (lut.length - 1), i = Math.min(lut.length - 2, Math.floor(x)), w = x - i;
  const a = hexRGB(lut[i]), b = hexRGB(lut[i + 1]);
  return [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w, a[2] + (b[2] - a[2]) * w];
};
export const lutCss = (lut: string[], t: number) => { const c = lutAt(lut, t); return `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`; };

/** RGBA texture of a field on a (ny, nx) grid, row 0 = the first latitude (ascending → bottom of the texture, v = 0).
 * Values outside [lo, hi] are clamped; NaN is transparent; `alpha` is the opacity of every valid texel (0..1). */
export const fieldTexture = (F: Float32Array, ny: number, nx: number, lut: string[], lo: number, hi: number, alpha = 1, wrap = false): THREE.DataTexture => {
  const nxx = wrap ? nx + 1 : nx;
  const d = new Uint8Array(ny * nxx * 4);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nxx; i++) {
    const v = F[j * nx + (i % nx)], k = 4 * (j * nxx + i);
    if (!Number.isFinite(v)) { d[k + 3] = 0; continue; }
    const c = lutAt(lut, (v - lo) / (hi - lo));
    d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = Math.round(255 * alpha);
  }
  const t = new THREE.DataTexture(d, nxx, ny, THREE.RGBAFormat);
  t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearFilter; t.needsUpdate = true;
  return t;
};
export const useFieldTex = (F: Float32Array | null | undefined, ny: number, nx: number, lut: string[], lo: number, hi: number, alpha = 1, wrap = false) =>
  useMemo(() => (F ? fieldTexture(F, ny, nx, lut, lo, hi, alpha, wrap) : null), [F, ny, nx, lut, lo, hi, alpha, wrap]);

// ------------------------------------------------------------------------------------------------ flat map frame
/** A plate-carrée frame: box [lat0, lat1, lon0, lon1] → screen rectangle (x, y, w, h); x scaled by cos(mid-latitude)
 * is NOT applied (the frame keeps the box's aspect given by w, h; callers choose w/h ≈ Δlon·cos φ / Δlat). */
export type MapBox = { lat0: number; lat1: number; lon0: number; lon1: number; x: number; y: number; w: number; h: number };
export const mapP = (B: MapBox) => (lat: number, lon: number): Pt => [B.x + ((lon - B.lon0) / (B.lon1 - B.lon0)) * B.w, B.y + ((B.lat1 - lat) / (B.lat1 - B.lat0)) * B.h];
/** zoom/pan between two boxes (t 0..1) */
export const lerpBox = (A: MapBox, B: MapBox, t: number): MapBox => ({
  lat0: A.lat0 + (B.lat0 - A.lat0) * t, lat1: A.lat1 + (B.lat1 - A.lat1) * t, lon0: A.lon0 + (B.lon0 - A.lon0) * t, lon1: A.lon1 + (B.lon1 - A.lon1) * t,
  x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t, w: A.w + (B.w - A.w) * t, h: A.h + (B.h - A.h) * t });
/** flat [lon, lat, …] polylines → SVG path in a map frame (clipped by the caller's clipPath) */
export const linesPath = (P: (la: number, lo: number) => Pt, lines: number[][], step = 1): string => {
  let d = "";
  for (const ln of lines) {
    let pen = false;
    for (let k = 0; k < ln.length; k += 2 * step) {
      const [x, y] = P(ln[k + 1], ln[k]);
      d += `${pen ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
      pen = true;
    }
  }
  return d;
};
/** [lat[], lon[]] polyline → path */
export const llLine = (P: (la: number, lo: number) => Pt, lat: number[], lon: number[], upto = 1): string => {
  const n = Math.max(2, Math.round(lat.length * upto));
  return lat.slice(0, n).map((la, i) => { const [x, y] = P(la, lon[i]); return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`; }).join("");
};
/** an image in geographic box [lat0, lat1, lon0, lon1] placed into a map frame (SVG <image>, stretched) */
export const GeoImage: React.FC<{ P: (la: number, lo: number) => Pt; href: string; box: [number, number, number, number]; o?: number; filter?: string }> = ({ P, href, box, o = 1, filter }) => {
  const [a, b] = [P(box[1], box[2]), P(box[0], box[3])];
  return o <= 0 ? null : <image href={href} x={a[0]} y={a[1]} width={b[0] - a[0]} height={b[1] - a[1]} preserveAspectRatio="none" opacity={o} style={{ filter }} />;
};
/** a field raster in a map frame: draws the (ny, nx) grid as an <image> made from a canvas data URL (memoised) */
export const useFieldURL = (F: Float32Array | null | undefined, ny: number, nx: number, lut: string[], lo: number, hi: number, flipY = true) =>
  useMemo(() => {
    if (!F || typeof document === "undefined") return null;
    const cv = document.createElement("canvas");
    cv.width = nx; cv.height = ny;
    const ctx = cv.getContext("2d")!;
    const im = ctx.createImageData(nx, ny);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const v = F[j * nx + i], row = flipY ? ny - 1 - j : j, k = 4 * (row * nx + i);
      if (!Number.isFinite(v)) continue;
      const c = lutAt(lut, (v - lo) / (hi - lo));
      im.data[k] = c[0]; im.data[k + 1] = c[1]; im.data[k + 2] = c[2]; im.data[k + 3] = 255;
    }
    ctx.putImageData(im, 0, 0);
    return cv.toDataURL("image/png");
  }, [F, ny, nx, lut, lo, hi, flipY]);
/** sub-array of a (…, ny, nx) Float32 field: time slice k */
export const slice2 = (F: Float32Array, k: number, ny: number, nx: number) => F.subarray(k * ny * nx, (k + 1) * ny * nx);
/** isoline JSON ({level, lines}) → one SVG path per level */
export type IsoLevel = { level: number; lines: number[][] };
export const IsoPaths: React.FC<{ P: (la: number, lo: number) => Pt; levels: IsoLevel[]; c?: string; w?: number; o?: number; bold?: number; boldW?: number; boldC?: string }> = ({
  P, levels, c = "#f4ecd2", w = 2.5, o = 0.8, bold, boldW = 5, boldC = "#d8b23a" }) => (o <= 0 ? null : (
  <g opacity={o} fill="none">
    {levels.map((L) => <path key={L.level} d={linesPath(P, L.lines)} stroke={L.level === bold ? boldC : c} strokeWidth={L.level === bold ? boldW : w}
      strokeLinejoin="round" />)}
  </g>));

// ------------------------------------------------------------------------------------------------ 3-D pieces
/** a translucent air shell around the unit globe at radius 1 + h (h in Earth radii; 12 km × 50 → 0.094) */
export const ShellMesh: React.FC<{ h: number; o?: number; color?: string }> = ({ h, o = 0.3, color = "#7cc4ff" }) => {
  const geo = useMemo(() => new THREE.SphereGeometry(1, 96, 64), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color, transparent: true, depthWrite: false, side: THREE.BackSide }), [color]);
  mat.opacity = o;
  if (o <= 0 || h <= 0) return null;
  return <mesh geometry={geo} material={mat} scale={[1 + h, 1 + h, 1 + h]} renderOrder={8} />;
};
/** a textured flat map plane in a Z-up world: X east, Y north (km/1000 = world units), image box → [x0, x1] × [y0, y1] */
export const MapPlane: React.FC<{ tex: THREE.Texture | null; x0: number; x1: number; y0: number; y1: number; z?: number; o?: number; dim?: number }> = ({
  tex, x0, x1, y0, y1, z = 0, o = 1, dim = 1 }) => {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide }), []);
  if (mat.map !== tex) { mat.map = tex; mat.needsUpdate = true; }
  mat.opacity = o; mat.color.setScalar(dim);
  if (!tex || o <= 0) return null;
  return (
    <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, z]} material={mat}>
      <planeGeometry args={[x1 - x0, y1 - y0]} />
    </mesh>
  );
};
/** a terrain surface: heights H (ny, nx; lat ascending) over [x0, x1] × [y0, y1], z = H·zs, coloured by a texture */
export const Terrain: React.FC<{ H: Float32Array; ny: number; nx: number; x0: number; x1: number; y0: number; y1: number; zs: number; tex: THREE.Texture | null;
  rise?: number }> = ({ H, ny, nx, x0, x1, y0, y1, zs, tex, rise = 1 }) => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(x1 - x0, y1 - y0, nx - 1, ny - 1);
    return g;
  }, [nx, ny, x0, x1, y0, y1]);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    // PlaneGeometry rows run top (y max) → bottom; our H rows run south → north
    const v = H[(ny - 1 - j) * nx + i];
    pos.setZ(j * nx + i, Math.max(0, Number.isFinite(v) ? v : 0) * zs * rise);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0 }), []);
  if (mat.map !== tex) { mat.map = tex; mat.needsUpdate = true; }
  return <mesh geometry={geo} material={mat} position={[(x0 + x1) / 2, (y0 + y1) / 2, 0]} />;
};
/** a vertical textured wall (cross-section) between two ground points a, b (world XY), from z0 to z1 */
export const Wall: React.FC<{ a: Pt; b: Pt; z0: number; z1: number; tex: THREE.Texture | null; o?: number; color?: string }> = ({ a, b, z0, z1, tex, o = 1, color }) => {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([a[0], a[1], z0, b[0], b[1], z0, b[0], b[1], z1, a[0], a[1], z1], 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    return g;
  }, [a[0], a[1], b[0], b[1], z0, z1]);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false }), []);
  if (mat.map !== tex) { mat.map = tex; mat.needsUpdate = true; }
  if (color) mat.color.set(color);
  mat.opacity = o;
  if (o <= 0) return null;
  return <mesh geometry={geo} material={mat} renderOrder={4} />;
};
export const v3 = (x: number, y: number, z = 0): V3 => [x, y, z];
