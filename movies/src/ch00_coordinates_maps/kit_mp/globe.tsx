// Copied 2026-11-05 into kit_mp (ch00_coordinates_maps) from kit_fr unchanged except this line, so this movie bundles independently.
// Copied 2026-10-28 from movies/src/ch00_weather_basics/kit_wb (unchanged) so this movie bundles independently.
// Globe3D for the cross-product movie (kit_cp): Blue Marble on a unit sphere (Y-up, house Globe lonlatToXYZ), image
// drapes (GOES-16 / VIIRS) with feathered edges, an optional quarter cut-away, and SVG overlays projected through the
// same camera with horizon culling: coastlines, graticule, latitude circles, tracks, great-circle arrows, streaklines.
// Textures and binaries load with delayRender/continueRender. Everything is a function of the frame (no RNG at render).
import React, { useEffect, useMemo, useState } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";
import * as THREE from "three";
import { CamState, D2R, Pt, V3, add3, dot3, lerpN, norm3, projector, sub3, easeIO, clamp01 } from "./cam";

export const ll = (lat: number, lon: number, r = 1): V3 => {
  const la = lat * D2R, lo = lon * D2R;
  return [r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo)];
};
/** local east / north unit vectors at (lat, lon) in globe coordinates */
export const enAt = (lat: number, lon: number): { e: V3; n: V3; u: V3 } => {
  const la = lat * D2R, lo = lon * D2R;
  return { e: [Math.cos(lo), 0, -Math.sin(lo)], n: [-Math.sin(la) * Math.sin(lo), Math.cos(la), -Math.sin(la) * Math.cos(lo)], u: ll(lat, lon) };
};

// ------------------------------------------------------------------------------------------------ loaders
const texCache = new Map<string, THREE.Texture>();
const texWait = new Map<string, Promise<THREE.Texture>>();
export const useTex = (url: string | null): THREE.Texture | null => {
  const [tex, setTex] = useState<THREE.Texture | null>(() => (url ? texCache.get(url) ?? null : null));
  const [handle] = useState(() => (url && !texCache.has(url) ? delayRender(`texture ${url}`, { timeoutInMilliseconds: 120000 }) : null));
  useEffect(() => {
    if (!url || texCache.has(url)) { if (url && !tex) setTex(texCache.get(url)!); if (handle !== null) continueRender(handle); return; }
    let p = texWait.get(url);
    if (!p) {
      p = new Promise<THREE.Texture>((res, rej) => new THREE.TextureLoader().load(url, (t) => {
        t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter;
        // partial-sphere UV fix: lon ranges that cross ±180 produce u > 1; RepeatWrapping avoids the last-column streak
        t.wrapS = THREE.RepeatWrapping;
        texCache.set(url, t); res(t);
      }, undefined, (e) => rej(e)));
      texWait.set(url, p);
    }
    p.then((t) => setTex(t)).catch((e) => cancelRender(e));
  }, [url, handle, tex]);
  // release the frame only after the texture is in state (and so in the next commit)
  useEffect(() => { if (tex && handle !== null) continueRender(handle); }, [tex, handle]);
  return tex;
};
const binCache = new Map<string, ArrayBuffer>();
const binWait = new Map<string, Promise<ArrayBuffer>>();
export const useBin = (url: string | null): ArrayBuffer | null => {
  const [buf, setBuf] = useState<ArrayBuffer | null>(() => (url ? binCache.get(url) ?? null : null));
  const [handle] = useState(() => (url && !binCache.has(url) ? delayRender(`bin ${url}`, { timeoutInMilliseconds: 120000 }) : null));
  useEffect(() => {
    if (!url || binCache.has(url)) { if (url && !buf) setBuf(binCache.get(url)!); if (handle !== null) continueRender(handle); return; }
    let p = binWait.get(url);
    if (!p) { p = fetch(url).then((r) => r.arrayBuffer()).then((b) => { binCache.set(url, b); return b; }); binWait.set(url, p); }
    p.then((b) => setBuf(b)).catch((e) => cancelRender(e));
  }, [url, handle, buf]);
  useEffect(() => { if (buf && handle !== null) continueRender(handle); }, [buf, handle]);
  return buf;
};

// ------------------------------------------------------------------------------------------------ camera
/** Globe camera: eye above (lat, lon) at `dist` (Earth radii from the centre), looking at the centre (or at `look`),
 * north up the screen; `pp` = where the look point is drawn; `tilt` lowers the view towards the horizon by that many
 * degrees (oblique view of a storm), `yaw` turns the view about the local vertical. */
export type GlobeCam = { lat: number; lon: number; dist: number; fov?: number; pp?: Pt; tilt?: number; yaw?: number; hop?: number };
export const globeCam = (g: GlobeCam, ppDef: Pt): CamState => {
  const { e, n, u } = enAt(g.lat, g.lon);
  const surf = ll(g.lat, g.lon);
  const h = g.dist - 1, el = (90 - (g.tilt ?? 0)) * D2R, yw = (g.yaw ?? 0) * D2R;
  const back = norm3(add3(mul(n, -Math.cos(yw)), mul(e, -Math.sin(yw))));
  const dir = norm3(add3(mul(u, Math.sin(el)), mul(back, Math.cos(el))));
  return { pos: add3(surf, dir, h), target: surf, up: n, fov: g.fov ?? 35, pp: g.pp ?? ppDef };
};
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
/** keyframed globe camera: the sub-camera point moves along the great circle (slerp), dist/fov/tilt/yaw eased;
 * `hop` on a key adds hop × sin(πt) to the distance on the way to that key (the camera rises and comes down) */
export const globePath = (keys: (GlobeCam & { f: number })[], f: number): GlobeCam => {
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

/** globe-to-world transform (spin about the polar axis, then a tilt of the axis about the view's z) */
export const globeMatrix = (spin = 0, tiltDeg = 0, tiltAxis: V3 = [0, 0, 1]) =>
  new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(...tiltAxis).normalize(), tiltDeg * D2R).multiply(new THREE.Matrix4().makeRotationY(spin));

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

// ------------------------------------------------------------------------------------------------ WebGL globe
export const sphereGeo = (lon0: number, lon1: number, nLon: number, nLat: number, r = 1, lat0 = -90, lat1 = 90) => {
  const pos: number[] = [], uv: number[] = [], idx: number[] = [], nrm: number[] = [];
  for (let j = 0; j <= nLat; j++) {
    const lat = lat0 + ((lat1 - lat0) * j) / nLat;
    for (let i = 0; i <= nLon; i++) {
      const lon = lon0 + ((lon1 - lon0) * i) / nLon;
      const p = ll(lat, lon, r);
      pos.push(...p); nrm.push(...ll(lat, lon, 1));
      uv.push((((lon + 180) % 360) + 360) % 360 / 360 + (lon >= 180 ? 0 : 0), (lat + 90) / 180);
    }
  }
  // fix the u seam: recompute u continuously along each row
  for (let j = 0; j <= nLat; j++) for (let i = 0; i <= nLon; i++) {
    const lon = lon0 + ((lon1 - lon0) * i) / nLon;
    uv[2 * (j * (nLon + 1) + i)] = (lon + 180) / 360;
  }
  for (let j = 0; j < nLat; j++) for (let i = 0; i < nLon; i++) {
    const a = j * (nLon + 1) + i, b = a + 1, c = a + nLon + 1, d = c + 1;
    idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nrm, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
};
const halfDisc = (lon: number) => {
  const pos: number[] = [0, 0, 0];
  const n = 96;
  for (let i = 0; i <= n; i++) pos.push(...ll(-90 + (180 * i) / n, lon, 0.999));
  const idx: number[] = [];
  for (let i = 1; i <= n; i++) idx.push(0, i, i + 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};
const featherMask = (() => {
  let t: THREE.DataTexture | null = null;
  return () => {
    if (t) return t;
    const n = 128, d = new Uint8Array(n * n * 4);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const fx = Math.min(i, n - 1 - i) / (n * 0.16), fy = Math.min(j, n - 1 - j) / (n * 0.16);
      const sm = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
      const a = Math.round(255 * sm(fx) * sm(fy));
      const k = 4 * (j * n + i); d[k] = d[k + 1] = d[k + 2] = a; d[k + 3] = 255;
    }
    t = new THREE.DataTexture(d, n, n); t.needsUpdate = true; t.magFilter = THREE.LinearFilter;
    return t;
  };
})();

export type Drape = { tex: THREE.Texture | null; lat: [number, number]; lon: [number, number]; o: number; r?: number };
/** the textured Earth (+ drapes, + optional cut-away); `M` = globeMatrix(spin, tilt) */
export const GlobeMesh: React.FC<{ tex: THREE.Texture | null; M?: THREE.Matrix4; cut?: boolean; drapes?: Drape[]; dim?: number }> = ({
  tex, M, cut = false, drapes = [], dim = 1 }) => {
  const geo = useMemo(() => (cut ? sphereGeo(90, 360, 270, 180) : sphereGeo(-180, 180, 360, 180)), [cut]);
  const discs = useMemo(() => (cut ? [halfDisc(0), halfDisc(90)] : []), [cut]);
  // UV2-14: the daytime Blue Marble at full brightness everywhere: unlit (no terminator, no dark limb)
  const mat = useMemo(() => new THREE.MeshBasicMaterial({}), []);
  const cutMat = useMemo(() => { const m = new THREE.MeshStandardMaterial({ color: "#3a4766", roughness: 0.9, side: THREE.DoubleSide }); m.emissive.set("#2b3550").multiplyScalar(0.5); return m; }, []);
  if (mat.map !== tex) { mat.map = tex; mat.needsUpdate = true; }
  mat.color.setScalar(dim);
  const dGeos = useMemo(() => drapes.map((d) => {
    const g = sphereGeo(d.lon[0], d.lon[1], 120, 120, d.r ?? 1.0015, d.lat[0], d.lat[1]);
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let j = 0; j <= 120; j++) for (let i = 0; i <= 120; i++) uv.setXY(j * 121 + i, i / 120, j / 120);
    return g;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [drapes.map((d) => `${d.lat}${d.lon}`).join("|")]);
  const dMats = useMemo(() => drapes.map(() => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, alphaMap: featherMask() })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
    [drapes.length]);
  drapes.forEach((d, k) => { const m = dMats[k]; if (m.map !== d.tex) { m.map = d.tex; m.needsUpdate = true; } m.opacity = d.o; });
  const mat4 = M ?? new THREE.Matrix4();
  return (
    <group matrixAutoUpdate={false} matrix={mat4}>
      <mesh geometry={geo} material={mat} />
      {discs.map((g, i) => <mesh key={i} geometry={g} material={cutMat} />)}
      {drapes.map((d, k) => (d.o > 0 && d.tex ? <mesh key={k} geometry={dGeos[k]} material={dMats[k]} renderOrder={5} /> : null))}
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ SVG overlays
/** polyline of lat/lon points → SVG path string, split where it goes over the horizon */
export const llPath = (G: GProj, pts: [number, number][], r = 1.001): string => {
  let d = "", pen = false;
  for (const [la, lo] of pts) {
    if (!Number.isFinite(la) || !Number.isFinite(lo) || !G.vis(la, lo, r)) { pen = false; continue; }
    const [x, y] = G.p(la, lo, r);
    d += `${pen ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    pen = true;
  }
  return d;
};
/** flat [lon, lat, lon, lat, …] polylines (Natural Earth JSON) → one path string, culled at the horizon */
export const coastPath = (G: GProj, lines: number[][], box?: [number, number, number, number], r = 1.001): string => {
  let d = "";
  for (const ln of lines) {
    let pen = false, last: Pt | null = null;
    for (let k = 0; k < ln.length; k += 2) {
      const lo = ln[k], la = ln[k + 1];
      if (box && (la < box[0] || la > box[1] || lo < box[2] || lo > box[3])) { pen = false; continue; }
      if (!G.vis(la, lo, r)) { pen = false; continue; }
      const [x, y] = G.p(la, lo, r);
      if (pen && last && Math.abs(x - last[0]) + Math.abs(y - last[1]) < 1.2) continue;
      d += `${pen ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
      pen = true; last = [x, y];
    }
  }
  return d;
};
export const Graticule: React.FC<{ G: GProj; step?: number; o?: number; c?: string; w?: number }> = ({ G, step = 30, o = 0.25, c = "#9aa6bd", w = 1.5 }) => {
  if (o <= 0) return null;
  let d = "";
  for (let la = -90 + step; la < 90; la += step) { const pts: [number, number][] = []; for (let lo = -180; lo <= 180; lo += 3) pts.push([la, lo]); d += llPath(G, pts); }
  for (let lo = -180; lo < 180; lo += step) { const pts: [number, number][] = []; for (let la = -88; la <= 88; la += 3) pts.push([la, lo]); d += llPath(G, pts); }
  return <path d={d} fill="none" stroke={c} strokeOpacity={o} strokeWidth={w} />;
};
export const LatCircle: React.FC<{ G: GProj; lat: number; c: string; o?: number; w?: number; dash?: string }> = ({ G, lat, c, o = 1, w = 4, dash }) => {
  if (o <= 0) return null;
  const pts: [number, number][] = [];
  for (let lo = -180; lo <= 180; lo += 2) pts.push([lat, lo]);
  return <path d={llPath(G, pts, 1.002)} fill="none" stroke={c} strokeOpacity={o} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" />;
};

/** destination point on the sphere from (lat, lon) along azimuth az (deg from north, clockwise) for an arc of d degrees */
export const gcDest = (lat: number, lon: number, az: number, d: number): [number, number] => {
  const la = lat * D2R, lo = lon * D2R, a = az * D2R, dd = d * D2R;
  const la2 = Math.asin(Math.sin(la) * Math.cos(dd) + Math.cos(la) * Math.sin(dd) * Math.cos(a));
  const lo2 = lo + Math.atan2(Math.sin(a) * Math.sin(dd) * Math.cos(la), Math.cos(dd) - Math.sin(la) * Math.sin(la2));
  return [la2 / D2R, ((lo2 / D2R + 540) % 360) - 180];
};
/** a curved arrow hugging the sphere: starts at (lat, lon) heading `az`, length `d` degrees of arc; the second half
 * turns by `bend` degrees (+ = to the right, clockwise seen from above); drawn `grow` 0..1 */
export const gcArrowPts = (lat: number, lon: number, az: number, d: number, bend = 0, grow = 1, n = 40): [number, number][] => {
  const pts: [number, number][] = [[lat, lon]];
  let p: [number, number] = [lat, lon], heading = az;
  const steps = Math.max(1, Math.round(n * grow));
  for (let i = 1; i <= steps; i++) {
    const s = i / n;
    const turn = s > 0.45 ? bend * Math.min(1, (s - 0.45) / 0.4) : 0;
    const q = gcDest(p[0], p[1], heading + turn, d / n);
    // keep the heading continuous along the great circle (forward azimuth at the new point)
    const back = Math.atan2(Math.sin((p[1] - q[1]) * D2R) * Math.cos(p[0] * D2R),
      Math.cos(q[0] * D2R) * Math.sin(p[0] * D2R) - Math.sin(q[0] * D2R) * Math.cos(p[0] * D2R) * Math.cos((p[1] - q[1]) * D2R)) / D2R;
    heading = (back + 180) - turn;
    pts.push(q);
    p = q;
  }
  return pts;
};
/** an SVG arrow along projected lat/lon points (house stroke: 10-px shaft, 40-px head) */
export const SurfArrow: React.FC<{ G: GProj; pts: [number, number][]; c: string; w?: number; head?: number; o?: number; dash?: string; r?: number }> = ({
  G, pts, c, w = 10, head = 40, o = 1, dash, r = 1.004 }) => {
  if (o <= 0 || pts.length < 2) return null;
  const sp = pts.filter(([la, lo]) => G.vis(la, lo, r)).map(([la, lo]) => G.p(la, lo, r));
  if (sp.length < 2) return null;
  const tip = sp[sp.length - 1];
  let k = sp.length - 2;
  while (k > 0 && Math.hypot(tip[0] - sp[k][0], tip[1] - sp[k][1]) < head * 0.8) k--;
  const ux = tip[0] - sp[k][0], uy = tip[1] - sp[k][1], L = Math.hypot(ux, uy) || 1;
  const dx = ux / L, dy = uy / L, h = Math.min(head, L * 0.9), hw = 0.42 * h;
  const bx = tip[0] - dx * h, by = tip[1] - dy * h;
  const shaft = sp.slice(0, k + 1).concat([[tip[0] - dx * h * 0.7, tip[1] - dy * h * 0.7]]);
  const d = shaft.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join("");
  return (
    <g opacity={o}>
      <path d={d} fill="none" stroke="#171f33" strokeWidth={w + 6} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />
      <polygon points={`${tip[0]},${tip[1]} ${bx - dy * hw},${by + dx * hw} ${bx + dy * hw},${by - dx * hw}`} fill={c} stroke="#171f33" strokeWidth={2} />
    </g>
  );
};

/** decoded trails: Int16 (lat, lon) × 100 [N, L, 2] then Uint8 speed × 4 [N, L] */
export type Trails = { n: number; L: number; ll: Int16Array; sp: Uint8Array };
export const decodeTrails = (buf: ArrayBuffer | null, n: number, L: number): Trails | null => {
  if (!buf) return null;
  return { n, L, ll: new Int16Array(buf, 0, n * L * 2), sp: new Uint8Array(buf, n * L * 4, n * L) };
};
/**
 * Streaklines: at frame `fr` each seed i shows its samples (fr + phase_i) mod L back `tail` samples as a fading line
 * (warm white, alpha by speed and age); `bright(lat)` multiplies the alpha (band highlighting); `stride` thins the
 * seeds. Drawn as a few SVG paths bucketed by tail age and speed (one path per bucket).
 */
export const Streaks: React.FC<{ G: GProj; T: Trails | null; fr: number; tail?: number; o?: number; c?: string; w?: number;
  bright?: (lat: number) => number; stride?: number; vmax?: number; r?: number; only?: number[] }> = ({
  G, T, fr, tail = 12, o = 1, c = "#f4ecd2", w = 2, bright, stride = 1, vmax = 10, r = 1.003, only }) => {
  if (!T || o <= 0) return null;
  const NB = 4, NS = 3;
  const paths: string[][] = Array.from({ length: NB * NS }, () => []);
  const L = T.L;
  const seeds = only ?? Array.from({ length: Math.floor(T.n / stride) }, (_, k) => k * stride);
  for (const i of seeds) {
    const ph = (i * 37 + (i % 7) * 11) % L;
    const h = (Math.floor(fr) + ph) % L;
    const base = i * L;
    const life = Math.min(h, L - 1 - h);
    const lifeA = Math.min(1, life / 6);
    if (lifeA <= 0) continue;
    let prev: Pt | null = null;
    for (let k = 0; k <= tail && h - k >= 0; k++) {
      const s = base + h - k;
      const la = T.ll[2 * s] / 100, lo = T.ll[2 * s + 1] / 100;
      if (T.ll[2 * s] === -32768 || !G.vis(la, lo, r)) { prev = null; continue; }
      const q = G.p(la, lo, r);
      if (prev && k > 0) {
        if (Math.abs(q[0] - prev[0]) + Math.abs(q[1] - prev[1]) < 60) {
          const spd = T.sp[s] / 4;
          const sb = Math.min(NS - 1, Math.floor((spd / vmax) * NS));
          const ab = Math.min(NB - 1, Math.floor(((k - 1) / tail) * NB));
          const bb = bright ? bright(la) : 1;
          if (bb * lifeA > 0.15) paths[ab * NS + sb].push(`M${prev[0].toFixed(1)} ${prev[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`);
        }
      }
      prev = q;
    }
  }
  return (
    <g opacity={o}>
      {paths.map((ps, k) => {
        if (!ps.length) return null;
        const ab = Math.floor(k / NS), sb = k % NS;
        const a = (0.35 + 0.6 * ((sb + 0.5) / NS)) * (1 - ab / NB);
        // UV2-14: a 1-px dark edge under each streak so it reads over bright land and cloud-free ocean alike
        return <g key={k}><path d={ps.join("")} fill="none" stroke="#0b1020" strokeOpacity={0.55 * a} strokeWidth={w + 2} strokeLinecap="round" />
          <path d={ps.join("")} fill="none" stroke={c} strokeOpacity={a} strokeWidth={w} strokeLinecap="round" /></g>;
      })}
    </g>
  );
};
/** the brightness of a streakline sample from a latitude band mask: 1 inside [a, b] (either hemisphere if sym), dim outside */
export const band = (a: number, b: number, inside: number, outside: number, sym = true) => (lat: number) =>
  (lat >= a && lat <= b) || (sym && -lat >= a && -lat <= b) ? inside : outside;

// ------------------------------------------------------------------------------------------------ v4 additions
/** UV2-19: the spin axis as dashed gold rods in the SAME transform as the textured sphere (child of the globe's matrix),
 * from (0, -L, 0) to (0, +L, 0) in globe coordinates, so it leaves the sphere exactly at the texture's poles; drawn with the
 * depth test on, so the part inside the globe and the part behind it are hidden by the opaque sphere. */
export const Axis3D: React.FC<{ M?: THREE.Matrix4; L?: number; o?: number; r?: number; color?: string }> = ({ M, L = 1.35, o = 1, r = 0.012, color = "#d8b23a" }) => {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color, transparent: true }), [color]);
  mat.opacity = o;
  const geo = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 12, 1), []);
  if (o <= 0) return null;
  const segs: React.ReactNode[] = [];
  const on = 0.075, off = 0.05;
  for (let y = -L, i = 0; y < L - 1e-6; y += on + off, i++) {
    const e = Math.min(L, y + on);
    segs.push(<mesh key={i} geometry={geo} material={mat} position={[0, (y + e) / 2, 0]} scale={[r, e - y, r]} />);
  }
  return <group matrixAutoUpdate={false} matrix={M ?? new THREE.Matrix4()}>{segs}</group>;
};
/** the meridian-plane disc through longitude lon0 (contains the polar axis), radius rr, as a flat mesh */
export const faceDisc = (lon0: number, rr = 0.999) => {
  const m = ll(0, lon0);
  const pos: number[] = [0, 0, 0];
  const n = 128;
  for (let i = 0; i <= n; i++) {
    const a = (2 * Math.PI * i) / n;
    pos.push(rr * (Math.cos(a) * m[0]), rr * Math.sin(a), rr * (Math.cos(a) * m[2]));
  }
  const idx: number[] = [];
  for (let i = 1; i <= n; i++) idx.push(0, i, i + 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  return g;
};
/** HalfEarth (UV2-20): the half of the globe WEST of the meridian plane through lon0 (textured outside), its flat face the
 * meridian-plane disc (slate, 90 %); the eastern half slides away by `slide` (0..1 → 0.6 units along local east) and fades.
 * The axis and r are drawn on the face by the caller. */
export const HalfEarthMesh: React.FC<{ tex: THREE.Texture | null; lon0: number; slide?: number; whole?: number }> = ({ tex, lon0, slide = 1, whole = 0 }) => {
  const west = useMemo(() => sphereGeo(lon0 - 180, lon0, 180, 180), [lon0]);
  const east = useMemo(() => sphereGeo(lon0, lon0 + 180, 180, 180), [lon0]);
  const disc = useMemo(() => faceDisc(lon0), [lon0]);
  const mW = useMemo(() => new THREE.MeshBasicMaterial({ side: THREE.FrontSide }), []);
  const mE = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, side: THREE.FrontSide }), []);
  const mF = useMemo(() => new THREE.MeshBasicMaterial({ color: "#2b3550", transparent: true, opacity: 0.94, side: THREE.DoubleSide }), []);
  if (mW.map !== tex) { mW.map = tex; mW.needsUpdate = true; }
  if (mE.map !== tex) { mE.map = tex; mE.needsUpdate = true; }
  const e = [Math.cos(lon0 * D2R), 0, -Math.sin(lon0 * D2R)];
  const s = Math.max(0, Math.min(1, slide));
  mE.opacity = Math.max(whole, 1 - s);
  mF.opacity = 0.94 * Math.min(1, s * 3) * (1 - whole);
  return (
    <group>
      <mesh geometry={west} material={mW} />
      {mE.opacity > 0.01 ? <mesh geometry={east} material={mE} position={[e[0] * 0.6 * s, 0, e[2] * 0.6 * s]} renderOrder={3} /> : null}
      {mF.opacity > 0.01 ? <mesh geometry={disc} material={mF} position={[e[0] * 0.002, 0, e[2] * 0.002]} renderOrder={2} /> : null}
    </group>
  );
};
