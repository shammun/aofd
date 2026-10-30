// House kit K5 (UF2, 2026-10-29; HOUSE_STYLE §5b "layer stacks"): LayerStack3D — many horizontal layers of one field,
// each at its own (exaggerated) height, coloured in the shader-free way (an RGBA DataTexture per layer from the same LUT as
// the matching globe/map), flat on a footprint or curved as spherical shells. Built on captests X3Stack (TexPlane, Stage,
// orbit) with many more layers. Used inside a house View3D; the caller owns the camera (orbitPath keys, `stackCam`
// presets: orbit / flyThrough / inside / below / topDown). Builder side: movies/data/_stack.py writes the Float32 layers,
// the area-mean heights z̄, the colour range and the exaggeration (manifest rows).
// Rules: the colour bar lives in the maths zone (never on the stack), readouts are K3 Callouts, the credit is K2 under the
// frame box, and the stack sits in a K1 GlobeFrame whenever the camera is close or inside. Pure function of props.
import React, { useMemo } from "react";
import * as THREE from "three";
import { Orbit, V3 } from "./cam";
import { ll } from "./globecam";
import { Rod3D } from "./three3d";

const hexRGB = (h: string): [number, number, number] => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
/** LUT colour (hex list) at t ∈ [0, 1], linear between entries */
export const lutRGB = (lut: string[], t: number): [number, number, number] => {
  const x = Math.max(0, Math.min(1, t)) * (lut.length - 1), i = Math.min(lut.length - 2, Math.floor(x)), w = x - i;
  const a = hexRGB(lut[i]), b = hexRGB(lut[i + 1]);
  return [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w, a[2] + (b[2] - a[2]) * w];
};

/**
 * One layer's texture: F (ny × nx, row 0 = SOUTH edge, NaN = no data → transparent) through `lut` over [lo, hi];
 * `alpha(v)` per-value opacity (e.g. 0.30 + 0.70·q/20 so dry layers look sparse). Cached per (F, lut, lo, hi).
 */
export const useLayerTex = (F: Float32Array | null | undefined, ny: number, nx: number, lut: string[], lo: number, hi: number, alpha?: (v: number) => number) =>
  useMemo(() => {
    if (!F) return null;
    const d = new Uint8Array(ny * nx * 4);
    for (let i = 0; i < ny * nx; i++) {
      const v = F[i];
      if (!Number.isFinite(v)) { d[4 * i + 3] = 0; continue; }
      const c = lutRGB(lut, (v - lo) / (hi - lo));
      d[4 * i] = c[0]; d[4 * i + 1] = c[1]; d[4 * i + 2] = c[2];
      d[4 * i + 3] = Math.round(255 * Math.max(0, Math.min(1, alpha ? alpha(v) : 1)));
    }
    const t = new THREE.DataTexture(d, nx, ny, THREE.RGBAFormat);
    t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearFilter; t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true;
    return t;
  }, [F, ny, nx, lut, lo, hi]); // eslint-disable-line react-hooks/exhaustive-deps

export type StackLayer = { tex: THREE.Texture | null; z: number; o?: number; outline?: string; outlineO?: number };
export type StackLine = { pts: V3[]; color?: string; px?: number; o?: number };
export type Curved = { lat0: number; lat1: number; lon0: number; lon1: number; r: (lat: number, layer: number) => number; nLat?: number; nLon?: number };

/** a spherical patch geometry (Y-up globe coordinates) whose radius may vary with latitude (strip-mean heights) */
const patchGeo = (c: Curved, layer: number) => {
  const nLat = c.nLat ?? 40, nLon = c.nLon ?? 40, pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let i = 0; i <= nLat; i++) {
    const v = i / nLat, la = c.lat0 + (c.lat1 - c.lat0) * v, r = c.r(la, layer);
    for (let j = 0; j <= nLon; j++) { const u = j / nLon, p = ll(la, c.lon0 + (c.lon1 - c.lon0) * u, r); pos.push(...p); uv.push(u, v); }
  }
  for (let i = 0; i < nLat; i++) for (let j = 0; j < nLon; j++) { const a = i * (nLon + 1) + j; idx.push(a, a + 1, a + nLon + 1, a + 1, a + nLon + 2, a + nLon + 1); }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  return g;
};

/**
 * LayerStack3D: `layers` bottom → top. Flat mode: each layer a plane over `foot` {x0, x1, y0, y1} (Z up) at height
 * z·sep (sep 0 = all on the ground, 1 = real exaggerated heights). Curved mode (`curved`): each layer a spherical patch at
 * radius curved.r(lat, i) (globe coordinates, Y up) — sep blends the radius from 1 to r. `reveal[i]` 0..1 fades layer i in.
 * `lines` are 3-D polylines (gold front lines, a column rod) drawn as rods; `walls` optional children (slice walls).
 * DoubleSide, no depth writes, render order by layer (bottom first) so the translucent layers stack correctly.
 */
export const LayerStack3D: React.FC<{ layers: StackLayer[]; foot?: { x0: number; x1: number; y0: number; y1: number }; curved?: Curved; sep?: number;
  reveal?: number[]; lines?: StackLine[]; o?: number; children?: React.ReactNode }> = ({ layers, foot, curved, sep = 1, reveal, lines = [], o = 1, children }) => {
  const plane = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const geos = useMemo(() => (curved ? layers.map((_, i) => patchGeo({ ...curved, r: (la, k) => 1 + (curved.r(la, k) - 1) * 1 }, i)) : []), [curved, layers.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const mats = useMemo(() => layers.map(() => new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false })), [layers.length]); // eslint-disable-line react-hooks/exhaustive-deps
  if (o <= 0) return null;
  return (
    <group>
      {layers.map((L, i) => {
        const m = mats[i];
        if (m.map !== L.tex) { m.map = L.tex; m.needsUpdate = true; }
        m.opacity = o * (L.o ?? 1) * (reveal ? Math.max(0, Math.min(1, reveal[i] ?? 1)) : 1);
        if (!L.tex || m.opacity <= 0.003) return null;
        if (curved) {
          const s = 1 + (sep - 1) * 1; // radius blend done by scaling about the centre: r' = 1 + sep·(r − 1)
          const rMid = curved.r((curved.lat0 + curved.lat1) / 2, i), k = (1 + sep * (rMid - 1)) / rMid;
          void s;
          return <mesh key={i} geometry={geos[i]} material={m} scale={[k, k, k]} renderOrder={10 + i} />;
        }
        const F = foot!;
        return <mesh key={i} geometry={plane} material={m} position={[(F.x0 + F.x1) / 2, (F.y0 + F.y1) / 2, L.z * sep]} scale={[F.x1 - F.x0, F.y1 - F.y0, 1]} renderOrder={10 + i} />;
      })}
      {/* lines (and children) are sorted after the layers (group renderOrder), so they read through the translucent stack */}
      <group renderOrder={100}>
        {lines.map((ln, j) => (ln.o ?? 1) * o <= 0 ? null : ln.pts.slice(1).map((q, i) => <Rod3D key={`${j}_${i}`} a={ln.pts[i]} b={q} px={ln.px ?? 4} color={ln.color ?? "#d8b23a"} o={(ln.o ?? 1) * o} />))}
      </group>
      {children}
    </group>
  );
};

/** Camera presets for a stack (Z-up flat stacks; orbit around `target`): build orbitPath keys from these. */
export const stackCam = {
  /** round: orbit at elevation el, azimuth az */
  orbit: (target: V3, az: number, el: number, dist: number): Orbit => ({ az, el, dist, target }),
  /** topDown: straight down onto a layer (north up the screen) */
  topDown: (target: V3, dist: number): Orbit => ({ az: 270, el: 89.5, dist, target }),
  /** below: under the bottom layer looking up through it */
  below: (target: V3, az: number, dist: number, el = -18): Orbit => ({ az, el, dist, target }),
  /** flyThrough: a camera close to the stack, its target at height z (sweep z between layers to fly through them) */
  flyThrough: (x: number, y: number, z: number, az: number, el = 12, dist = 1.2): Orbit => ({ az, el, dist, target: [x, y, z] }),
  /** inside: between layers, looking along the stack */
  inside: (x: number, y: number, z: number, az: number, dist = 0.8): Orbit => ({ az, el: 4, dist, target: [x, y, z] }),
} as const;
