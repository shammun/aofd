// Capability-test kit (movies/src/captests, own entry): loaders, three.js globe / terrain / textured planes, d3-geo
// helpers, house-dark colours. Everything is a pure function of the frame (no rAF, no Math.random at render).
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export const K = {
  bg: "#171f33", ink: "#e8ecf4", key: "#f4ecd2", gold: "#d8b23a", teal: "#2aa198", orange: "#e8833a",
  rose: "#d9667f", slate: "#aab4c8", muted: "#9aa6bd", font: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
};
export const D2R = Math.PI / 180;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const ease = (t: number) => { const x = clamp01(t); return x * x * (3 - 2 * x); };
export const ramp = (f: number, a: number, b: number) => ease((f - a) / Math.max(1, b - a));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ------------------------------------------------------------------ loaders (delayRender until loaded)
const texCache = new Map<string, THREE.Texture>();
const texWait = new Map<string, Promise<THREE.Texture>>();
export const useTex = (name: string | null): THREE.Texture | null => {
  const url = name ? staticFile(name) : null;
  const [tex, setTex] = useState<THREE.Texture | null>(() => (url ? texCache.get(url) ?? null : null));
  const [h] = useState(() => (url && !texCache.has(url) ? delayRender(`tex ${url}`, { timeoutInMilliseconds: 120000 }) : null));
  useEffect(() => {
    if (!url) return;
    if (texCache.has(url)) { if (!tex) setTex(texCache.get(url)!); return; }
    let p = texWait.get(url);
    if (!p) {
      p = new Promise<THREE.Texture>((res, rej) => new THREE.TextureLoader().load(url, (t) => {
        t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; texCache.set(url, t); res(t);
      }, undefined, rej));
      texWait.set(url, p);
    }
    p.then(setTex).catch((e) => cancelRender(e));
  }, [url, tex]);
  useEffect(() => { if (tex && h !== null) continueRender(h); }, [tex, h]);
  return tex;
};
const binCache = new Map<string, ArrayBuffer>();
export const useBin = (name: string): ArrayBuffer | null => {
  const url = staticFile(name);
  const [buf, setBuf] = useState<ArrayBuffer | null>(() => binCache.get(url) ?? null);
  const [h] = useState(() => (!binCache.has(url) ? delayRender(`bin ${url}`) : null));
  useEffect(() => {
    if (buf) return;
    fetch(url).then((r) => r.arrayBuffer()).then((b) => { binCache.set(url, b); setBuf(b); }).catch((e) => cancelRender(e));
  }, [url, buf]);
  useEffect(() => { if (buf && h !== null) continueRender(h); }, [buf, h]);
  return buf;
};
const jsonCache = new Map<string, unknown>();
export function useJson<T>(name: string): T | null {
  const url = staticFile(name);
  const [d, setD] = useState<T | null>(() => (jsonCache.get(url) as T) ?? null);
  const [h] = useState(() => (!jsonCache.has(url) ? delayRender(`json ${url}`) : null));
  useEffect(() => {
    if (d) return;
    fetch(url).then((r) => r.json()).then((j) => { jsonCache.set(url, j); setD(j as T); }).catch((e) => cancelRender(e));
  }, [url, d]);
  useEffect(() => { if (d && h !== null) continueRender(h); }, [d, h]);
  return d;
}

// ------------------------------------------------------------------ camera rig
export type Cam = { pos: [number, number, number]; look: [number, number, number]; up?: [number, number, number]; fov?: number };
const Rig: React.FC<{ cam: Cam; W: number; H: number }> = ({ cam, W, H }) => {
  const set = useThree((s) => s.set);
  const c = useMemo(() => { const p = new THREE.PerspectiveCamera(); (p as unknown as { manual: boolean }).manual = true; return p; }, []);
  useLayoutEffect(() => {
    c.fov = cam.fov ?? 35; c.aspect = W / H; c.near = 0.001; c.far = 5000;
    c.position.set(...cam.pos); c.up.set(...(cam.up ?? [0, 1, 0])); c.lookAt(...cam.look); c.updateProjectionMatrix();
    set({ camera: c });
  });
  return null;
};
/** Load textures (.png/.jpg) and binaries (.bin) BEFORE the canvas mounts: a texture that arrives after R3F drew the
 * frame would never be drawn (frameloop 'never'), so the canvas is created only when every asset is in the caches. */
export const useAssets = (names: string[]): boolean => {
  const key = names.join("|");
  const [ok, setOk] = useState(() => names.every((n) => (n.endsWith(".bin") ? binCache : texCache).has(staticFile(n))));
  const [h] = useState(() => (ok ? null : delayRender(`assets ${key}`, { timeoutInMilliseconds: 120000 })));
  useEffect(() => {
    if (ok) return;
    Promise.all(names.map((n) => {
      const url = staticFile(n);
      if (n.endsWith(".bin")) {
        return binCache.has(url) ? Promise.resolve() : fetch(url).then((r) => r.arrayBuffer()).then((b) => { binCache.set(url, b); });
      }
      if (texCache.has(url)) return Promise.resolve();
      let p = texWait.get(url);
      if (!p) {
        p = new Promise<THREE.Texture>((res, rej) => new THREE.TextureLoader().load(url, (t) => {
          t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; texCache.set(url, t); res(t);
        }, undefined, rej));
        texWait.set(url, p);
      }
      return p.then(() => undefined);
    })).then(() => setOk(true)).catch((e) => cancelRender(e));
  }, [key, ok]);
  useEffect(() => { if (ok && h !== null) continueRender(h); }, [ok, h]);
  return ok;
};

export const Stage: React.FC<{ cam: Cam; W?: number; H?: number; x?: number; y?: number; children: React.ReactNode; light?: boolean;
  sun?: [number, number, number]; assets?: string[] }> = ({ assets = [], ...p }) => {
  const ok = useAssets(assets);
  return ok ? <StageIn {...p} /> : null;
};
const StageIn: React.FC<{ cam: Cam; W?: number; H?: number; x?: number; y?: number; children: React.ReactNode; light?: boolean;
  sun?: [number, number, number] }> = ({ cam, W = 1920, H = 1080, x = 0, y = 0, children, light = true, sun = [3, 4, 5] }) => (
  <ThreeCanvas width={W} height={H} style={{ position: "absolute", left: x, top: y }}
    gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }} camera={{ position: [0, 0, 3], fov: 35 }}>
    <Rig cam={cam} W={W} H={H} />
    {light ? <><ambientLight intensity={1.6} /><directionalLight position={sun} intensity={1.6} /></> : null}
    {children}
  </ThreeCanvas>
);

/** lon/lat -> unit-sphere point matching THREE.SphereGeometry's equirect UVs (lon 0 at +x, lon +90 at -z, north +y) */
export const ll = (lat: number, lon: number, r = 1): [number, number, number] =>
  [r * Math.cos(lat * D2R) * Math.cos(lon * D2R), r * Math.sin(lat * D2R), -r * Math.cos(lat * D2R) * Math.sin(lon * D2R)];
/** camera above (lat, lon) at distance d (Earth radii from the centre), looking at the centre */
export const globeCam = (lat: number, lon: number, d: number, fov = 30): Cam => ({ pos: ll(lat, lon, d), look: [0, 0, 0], fov });

const SPH = new THREE.SphereGeometry(1, 192, 96);
/** Globe with one texture, or a crossfade of two (a, b, mix). Unlit (honest colours) unless lit=true. */
export const Globe: React.FC<{ a: string; b?: string; mix?: number; lit?: boolean; r?: number; opacity?: number }> = ({ a, b, mix = 0, lit = false, r = 1, opacity = 1 }) => {
  const ta = useTex(a), tb = useTex(b ?? null);
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { ta: { value: null }, tb: { value: null }, m: { value: 0 }, lit: { value: 0 }, op: { value: 1 } },
    transparent: true,
    vertexShader: "varying vec2 vUv; varying vec3 vN; void main(){ vUv = uv; vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} ",
    fragmentShader: "uniform sampler2D ta; uniform sampler2D tb; uniform float m; uniform float lit; uniform float op; varying vec2 vUv; varying vec3 vN;"
      + "void main(){ vec4 a = texture2D(ta, vUv); vec4 b = texture2D(tb, vUv); vec4 c = mix(a, b, m);"
      + " float l = mix(1.0, 0.55 + 0.6*max(dot(vN, normalize(vec3(0.4,0.5,0.8))),0.0), lit); gl_FragColor = vec4(c.rgb*l, op);\n"
      + "#include <colorspace_fragment>\n}",
  }), []);
  if (!ta) return null;
  mat.uniforms.ta.value = ta; mat.uniforms.tb.value = tb ?? ta; mat.uniforms.m.value = tb ? mix : 0;
  mat.uniforms.lit.value = lit ? 1 : 0; mat.uniforms.op.value = opacity;
  return <mesh geometry={SPH} material={mat} scale={[r, r, r]} />;
};

/** Heightfield (north-up float32 grid) in km units: x east, y north, z up (metres/1000 * exag). Drape texture. */
export const Terrain: React.FC<{ bin: string; nx: number; ny: number; bounds: number[]; drape: string; exag: number;
  floor?: number; step?: number; lit?: boolean; flatSea?: boolean }> = ({ bin, nx, ny, bounds, drape, exag, floor = 0, step = 1, lit = true, flatSea = true }) => {
  const buf = useBin(bin);
  const tex = useTex(drape);
  const geo = useMemo(() => {
    if (!buf) return null;
    const z = new Float32Array(buf);
    const mlat = (bounds[1] + bounds[3]) / 2;
    const Wk = (bounds[2] - bounds[0]) * 111.32 * Math.cos(mlat * D2R), Hk = (bounds[3] - bounds[1]) * 110.57;
    const sx = Math.floor((nx - 1) / step), sy = Math.floor((ny - 1) / step);
    const g = new THREE.PlaneGeometry(Wk, Hk, sx, sy);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let j = 0; j <= sy; j++) for (let i = 0; i <= sx; i++) {
      let h = z[(j * step) * nx + i * step];
      if (!isFinite(h)) h = 0;
      if (flatSea && h < floor) h = floor;
      pos.setZ(j * (sx + 1) + i, (h / 1000) * exag);
    }
    g.computeVertexNormals();
    return { g, Wk, Hk };
  }, [buf, nx, ny, bounds, exag, floor, step, flatSea]);
  const mat = useMemo(() => (lit ? new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0 }) : new THREE.MeshBasicMaterial()), [lit]);
  if (!geo || !tex) return null;
  (mat as THREE.MeshStandardMaterial).map = tex; mat.needsUpdate = true;
  return <mesh geometry={geo.g} material={mat} />;
};
export const terrainSize = (bounds: number[]) => {
  const mlat = (bounds[1] + bounds[3]) / 2;
  return { W: (bounds[2] - bounds[0]) * 111.32 * Math.cos(mlat * D2R), H: (bounds[3] - bounds[1]) * 110.57 };
};

/** Textured flat plane (w x h) at a position/rotation; optional opacity. */
export const TexPlane: React.FC<{ tex: string; w: number; h: number; pos?: [number, number, number]; rot?: [number, number, number];
  opacity?: number; side?: THREE.Side }> = ({ tex, w, h, pos = [0, 0, 0], rot = [0, 0, 0], opacity = 1, side = THREE.DoubleSide }) => {
  const t = useTex(tex);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, side }), [side]);
  const geo = useMemo(() => new THREE.PlaneGeometry(w, h), [w, h]);
  if (!t) return null;
  mat.map = t; mat.opacity = opacity; mat.depthWrite = opacity > 0.98; mat.needsUpdate = true;
  return <mesh geometry={geo} material={mat} position={pos} rotation={rot} />;
};

// ------------------------------------------------------------------ text (house floor 44 px)
export const Label: React.FC<{ x: number; y: number; s?: number; c?: string; w?: number; o?: number; anchor?: "start" | "middle" | "end"; children: React.ReactNode }> =
  ({ x, y, s = 54, c = K.key, w = 600, o = 1, anchor = "start", children }) => {
    if (s < 44) throw new Error(`text below 44 px: ${s}`);
    return <div style={{ position: "absolute", left: anchor === "start" ? x : undefined, right: anchor === "end" ? 1920 - x : undefined,
      top: y, transform: anchor === "middle" ? `translateX(-50%)` : undefined, ...(anchor === "middle" ? { left: x } : {}),
      fontFamily: K.font, fontSize: s, fontWeight: w, color: c, opacity: o, whiteSpace: "nowrap", textShadow: "0 2px 8px rgba(0,0,0,0.85)" }}>{children}</div>;
  };

// ------------------------------------------------------------------ billboard labels for globes (cartography skill 2f)
/** Screen-aligned labels at a fixed pixel size, anchored on surface points (lat, lon) of the unit globe and projected
 * with the same camera as the WebGL view; faded out when the anchor turns away (dot(normal, to-camera) < 0.15) or
 * nears the limb. Text is never draped into the texture. */
export type BB = { lat: number; lon: number; text: string; s?: number; c?: string; dx?: number; dy?: number; w?: number; dot?: boolean };
const _pc = new THREE.PerspectiveCamera();
export const Billboards: React.FC<{ cam: Cam; items: BB[]; W?: number; H?: number; o?: number }> = ({ cam, items, W = 1920, H = 1080, o = 1 }) => {
  _pc.fov = cam.fov ?? 35; _pc.aspect = W / H; _pc.near = 0.001; _pc.far = 5000;
  _pc.position.set(...cam.pos); _pc.up.set(...(cam.up ?? [0, 1, 0])); _pc.lookAt(...cam.look);
  _pc.updateMatrixWorld(true); _pc.updateProjectionMatrix();
  // greedy collision pass in priority order (items are given most important first): a label whose box overlaps an
  // already placed one is dropped (cartography skill §4); boxes are estimated from the type size
  const placed: number[][] = [];
  return (
    <>
      {items.map((b, k) => {
        const p = ll(b.lat, b.lon, 1.003);
        const tc = new THREE.Vector3(cam.pos[0] - p[0], cam.pos[1] - p[1], cam.pos[2] - p[2]).normalize();
        const facing = (p[0] * tc.x + p[1] * tc.y + p[2] * tc.z) / Math.hypot(...p);
        const vis = Math.max(0, Math.min(1, (facing - 0.15) / 0.15)) * o;
        if (vis <= 0) return null;
        const v = new THREE.Vector3(...p).project(_pc);
        const x = (v.x + 1) / 2 * W, y = (1 - v.y) / 2 * H;
        if (y < 40 || y > 860 || x < 40 || x > W - 40) return null;
        const s = Math.max(44, b.s ?? 54);
        const bx0 = x + (b.dx ?? 16), by0 = y + (b.dy ?? -s * 1.2), box = [bx0 - 8, by0 - 6, bx0 + b.text.length * s * 0.56 + 8, by0 + s * 1.2 + 6];
        if (placed.some((q) => !(box[2] < q[0] || box[0] > q[2] || box[3] < q[1] || box[1] > q[3]))) return null;
        placed.push(box);
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y, opacity: vis }}>
            {b.dot !== false ? <div style={{ position: "absolute", left: -8, top: -8, width: 16, height: 16, borderRadius: 8, background: K.gold, border: "2px solid #0f1420" }} /> : null}
            <div style={{ position: "absolute", left: b.dx ?? 16, top: (b.dy ?? -s * 1.2), fontFamily: K.font, fontSize: s, fontWeight: b.w ?? 700,
              color: b.c ?? K.key, whiteSpace: "nowrap", WebkitTextStroke: `${Math.round(s * 0.16)}px rgba(15,20,32,0.85)`, paintOrder: "stroke fill" }}>{b.text}</div>
          </div>
        );
      })}
    </>
  );
};
