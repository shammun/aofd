// House kit K5 (UF2, 2026-10-29; HOUSE_STYLE §5b "layer stacks"): LayerStack3D — many horizontal layers of one field,
// each at its own (exaggerated) height, coloured in the shader-free way (an RGBA DataTexture per layer from the same LUT as
// the matching globe/map), flat on a footprint or curved as spherical shells. Built on captests X3Stack (TexPlane, Stage,
// orbit) with many more layers. Used inside a house View3D; the caller owns the camera (orbitPath keys, `stackCam`
// presets: orbit / inside / below / topDown; flyThrough retired, §5b). Builder side: movies/data/_stack.py writes the Float32 layers,
// the area-mean heights z̄, the colour range and the exaggeration (manifest rows).
// Rules: the colour bar lives in the maths zone (never on the stack), readouts are K3 Callouts, the credit is K2 under the
// frame box, and the stack sits in a K1 GlobeFrame whenever the camera is close or inside. Pure function of props.
import React, { useMemo } from "react";
import * as THREE from "three";
import { Orbit, V3 } from "./cam";
import { ll } from "./globecam";
import { Rod3D, useView3D } from "./three3d";
import { PROBE, probe3, probeOff } from "./probe";

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
/** convex hull (monotone chain) of screen points */
const hull2 = (P: number[][]): number[][] => {
  const p = [...P].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: number[][] = [], up: number[][] = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...p].reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};
/** clip a polygon to x ≤ X (the part under a K1 right panel is the faded rim, where text may sit) */
const clipX2 = (P: number[][], X: number): number[][] => {
  const out: number[][] = [];
  P.forEach((a, i) => { const b = P[(i + 1) % P.length], ia = a[0] <= X, ib = b[0] <= X;
    if (ia) out.push(a);
    if (ia !== ib) { const t = (X - a[0]) / (b[0] - a[0]); out.push([X, a[1] + t * (b[1] - a[1])]); } });
  return out;
};

export const LayerStack3D: React.FC<{ layers: StackLayer[]; foot?: { x0: number; x1: number; y0: number; y1: number }; curved?: Curved; sep?: number;
  reveal?: number[]; lines?: StackLine[]; o?: number; children?: React.ReactNode; mask?: { name?: string; clipX?: number; clipY?: number } }> = ({ layers, foot, curved, sep = 1, reveal, lines = [], o = 1, children, mask }) => {
  const plane = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  // UF2 fix 1 (K6 tuning, review "K5 must publish its projected stack mask"): in bbox mode the stack's projected outline (hull of
  // its corners at the bottom and top layer heights) is a K6 sharp-picture mask, so text or a colour bar ON the stack fails
  const { pr } = useView3D();
  const mid = React.useId();
  if (PROBE.on) {
    const vis = layers.map((_, i) => o * (reveal ? Math.max(0, Math.min(1, reveal[i] ?? 1)) : 1)).filter((v) => v > 0.2).length;
    if (vis > 0) {
      const ztop = Math.max(...layers.map((L) => L.z)) * sep, zbot = Math.min(...layers.map((L) => L.z)) * sep;
      const pts3: [number, number, number][] = [];
      if (curved) {
        const kTop = layers.length - 1;
        for (const la of [curved.lat0, (curved.lat0 + curved.lat1) / 2, curved.lat1]) for (const lo of [curved.lon0, (curved.lon0 + curved.lon1) / 2, curved.lon1]) {
          const rT = 1 + sep * (curved.r(la, kTop) - 1);
          pts3.push(ll(la, lo, 1) as [number, number, number], ll(la, lo, rT) as [number, number, number]);
        }
      } else if (foot) {
        for (const x of [foot.x0, foot.x1]) for (const y of [foot.y0, foot.y1]) for (const z of [zbot, ztop]) pts3.push([x, y, z]);
      }
      // a camera INSIDE the stack (a fly-through, retired) sees the stack over the whole frame
      const cp = pr.st.pos, rc = Math.hypot(cp[0], cp[1], cp[2]);
      const inside = curved
        ? (() => { const la = (Math.asin(cp[1] / rc) * 180) / Math.PI, lo = (Math.atan2(cp[0], cp[2]) * 180) / Math.PI;
          const rT = 1 + sep * (curved.r(la, layers.length - 1) - 1);
          return rc > 1 && rc < rT && la > curved.lat0 && la < curved.lat1 && lo > curved.lon0 && lo < curved.lon1; })()
        : !!foot && cp[0] > foot.x0 && cp[0] < foot.x1 && cp[1] > foot.y0 && cp[1] < foot.y1 && cp[2] > zbot && cp[2] < ztop;
      let pts = inside ? [[0, 0], [1920, 0], [1920, 1080], [0, 1080]] : hull2(pts3.filter((q) => pr.vis(q)).map((q) => pr.p(q)));
      if (mask?.clipX !== undefined) pts = clipX2(pts, mask.clipX);
      if (mask?.clipY !== undefined) pts = clipX2(pts.map((q) => [q[1], q[0]]), mask.clipY).map((q) => [q[1], q[0]]); // y ≤ clipY (K1 bottom fade)
      if (pts.length >= 3) probe3(mid, { k: "mask3d", c: "", w: 0, o, pts, closed: true, name: mask?.name ?? "stack" });
      else probeOff(mid);
    } else probeOff(mid);
  }
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
  /** below: under the bottom layer looking up through it — like `inside`, only for the ≤ 5-6-s close look (house §5b) */
  below: (target: V3, az: number, dist: number, el = -18): Orbit => ({ az, el, dist, target }),
  /** RETIRED (HOUSE_STYLE §5b, user 2026-10-30: strictly no fly-throughs; UF2 review 1 M6): throws if called */
  flyThrough: (..._a: number[]): Orbit => { throw new Error("stackCam.flyThrough is retired (HOUSE_STYLE §5b: the camera never passes through the layers)"); },
  /** inside: between layers, looking along the stack — ONLY for the one short side close look (≤ 5-6 s, ground and levels both
   * in view, not deep inside; house §5b); every move into and out of it is made from outside */
  inside: (x: number, y: number, z: number, az: number, dist = 0.8): Orbit => ({ az, el: 4, dist, target: [x, y, z] }),
} as const;
