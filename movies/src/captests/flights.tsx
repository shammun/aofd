// Static map -> 3-D head-to-head (three.js), camera flights on the real-data globe, before/after swipe sliders, and the
// layer-by-layer build of the S1 chart. Pure functions of the frame.
import React, { useMemo } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { Billboards, Cam, D2R, Globe, K, Label, Stage, Terrain, clamp01, ease, lerp, ll, ramp, terrainSize, useJson, useTex } from "./kit";

type V3 = [number, number, number];
const add = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
const norm = (a: V3): V3 => { const L = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / L, a[1] / L, a[2] / L]; };
const northAt = (lat: number, lon: number): V3 => [-Math.sin(lat * D2R) * Math.cos(lon * D2R), Math.cos(lat * D2R), Math.sin(lat * D2R) * Math.sin(lon * D2R)];

/** keyframed globe camera: great-circle slerp of the sub-camera point, eased distance and tilt (deg from vertical) */
type Key = { f: number; lat: number; lon: number; d: number; tilt?: number; fov?: number };
export const flight = (keys: Key[], f: number): Cam => {
  let A = keys[0], B = keys[0], t = 0;
  if (f >= keys[keys.length - 1].f) { A = B = keys[keys.length - 1]; }
  else for (let i = 1; i < keys.length; i++) if (f <= keys[i].f) { A = keys[i - 1]; B = keys[i]; t = ease((f - A.f) / Math.max(1, B.f - A.f)); break; }
  const a = ll(A.lat, A.lon), b = ll(B.lat, B.lon);
  const om = Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
  const p: V3 = om < 1e-6 ? a : norm(add(a.map((x) => x * Math.sin((1 - t) * om) / Math.sin(om)) as V3, b, Math.sin(t * om) / Math.sin(om)));
  const lat = Math.asin(p[1]) / D2R, lon = Math.atan2(-p[2], p[0]) / D2R;
  const d = Math.exp(lerp(Math.log(A.d), Math.log(B.d), t)), tilt = lerp(A.tilt ?? 0, B.tilt ?? 0, t) * D2R;
  const n = northAt(lat, lon), h = d - 1;
  const eye = add(p, add(p.map((x) => x * Math.cos(tilt)) as V3, n, -Math.sin(tilt)), h);
  return { pos: eye, look: tilt > 1e-4 ? p : [0, 0, 0], up: n, fov: lerp(A.fov ?? 30, B.fov ?? 30, t) };
};

/** equirectangular drape on a sphere patch (exact: UVs run linearly in lon and lat) */
export const Patch: React.FC<{ tex: string; b: number[]; r?: number; opacity?: number; tex2?: string; mix?: number }> = ({ tex, b, r = 1.002, opacity = 1, tex2, mix = 0 }) => {
  const t1 = useTex(tex), t2 = useTex(tex2 ?? null);
  const geo = useMemo(() => new THREE.SphereGeometry(r, 160, 120, Math.PI + b[0] * D2R, (b[2] - b[0]) * D2R, (90 - b[3]) * D2R, (b[3] - b[1]) * D2R), [b, r]);
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { a: { value: null }, c: { value: null }, m: { value: 0 }, op: { value: 1 } }, transparent: true, depthWrite: false,
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
    fragmentShader: "uniform sampler2D a; uniform sampler2D c; uniform float m; uniform float op; varying vec2 vUv; void main(){ vec4 x = mix(texture2D(a, vUv), texture2D(c, vUv), m); gl_FragColor = vec4(x.rgb, x.a*op);\n#include <colorspace_fragment>\n}",
  }), []);
  if (!t1) return null;
  mat.uniforms.a.value = t1; mat.uniforms.c.value = t2 ?? t1; mat.uniforms.m.value = t2 ? mix : 0; mat.uniforms.op.value = opacity;
  return <mesh geometry={geo} material={mat} />;
};

/** globe with vertex displacement from an 8-bit height map (ETOPO 10'), lit so relief shows */
const DispGlobe: React.FC<{ tex: string; disp: string; exag: number }> = ({ tex, disp, exag }) => {
  const t = useTex(tex), d = useTex(disp);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0 }), []);
  const geo = useMemo(() => new THREE.SphereGeometry(1, 1440, 720), []);
  if (!t || !d) return null;
  mat.map = t; mat.displacementMap = d; mat.displacementScale = (8000 / 6.371e6) * exag; mat.needsUpdate = true;
  return <mesh geometry={geo} material={mat} />;
};

// ------------------------------------------------------------------ C1 head-to-head, three.js parts
export const H2HGlobe: React.FC = () => {
  const f = useCurrentFrame();
  const cam = flight([{ f: 0, lat: 15, lon: -40, d: 4.6 }, { f: 150, lat: 25, lon: -30, d: 4.2 }, { f: 300, lat: 47, lon: -8, d: 2.1 }], f);
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage cam={cam} assets={["bmng_5400.jpg", "drape_s4.png", "drape_s1_lines.png"]}>
        <Globe a="bmng_5400.jpg" b="drape_s4.png" mix={ramp(f, 20, 80) - ramp(f, 170, 220) * 0.65} lit />
        <Patch tex="drape_s1_lines.png" b={[-35, 33, 20, 66]} opacity={ramp(f, 170, 220)} />
      </Stage>
      <Billboards cam={cam} o={ramp(f, 220, 250)} items={[{ lat: 52.58, lon: 1.57, text: "L 956", c: "#ff7a8a", s: 64 },
        { lat: 48.39, lon: -4.49, text: "Brest", s: 50, dy: 8 }, { lat: 34.8, lon: -32.6, text: "H 1030", c: "#7fb2ff", s: 64 }]} />
      <Label x={90} y={60} s={54}>{f < 170 ? "S4 climatology as a globe texture" : "S1 chart: lines draped, labels as billboards"}</Label>
    </AbsoluteFill>
  );
};
export const H2HTerrain: React.FC = () => {
  const f = useCurrentFrame();
  const meta = useJson<{ heights: Record<string, { nx: number; ny: number; bounds: number[] }> }>("meta.json");
  if (!meta) return null;
  const h = meta.heights.alps; const { W } = terrainSize(h.bounds);
  const a = lerp(-20, 25, f / 300) * D2R, e = lerp(70, 32, ramp(f, 0, 200)) * D2R, dist = W * lerp(0.95, 0.62, ramp(f, 0, 260));
  const tgt: V3 = [lerp(0, -120, ramp(f, 100, 300)), 0, lerp(0, -40, ramp(f, 100, 300))];
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage cam={{ pos: [tgt[0] + dist * Math.cos(e) * Math.sin(a), dist * Math.sin(e), tgt[2] + dist * Math.cos(e) * Math.cos(a)], look: tgt, fov: 35 }}
        sun={[-300, 500, 600]} assets={["h_alps.bin", "drape_s3.png"]}>
        <group rotation={[-Math.PI / 2, 0, 0]}><Terrain bin="h_alps.bin" nx={h.nx} ny={h.ny} bounds={h.bounds} drape="drape_s3.png" exag={4} /></group>
      </Stage>
      <Label x={90} y={60} s={54}>S3 Alps map on three.js terrain · height ×4</Label>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ flights on the real-data globe
const fmtHour = (i: number) => { const h = (12 + i) % 24, d = i < 12 ? 1 : 2; return `${d} Nov ${String(h).padStart(2, "0")}:00 UTC`; };
export const FlightA: React.FC = () => {
  const f = useCurrentFrame();
  const hours = useJson<{ low: [number, number, number] }[]>("a1_hours.json");
  const cam = flight([{ f: 0, lat: 10, lon: -60, d: 5.2 }, { f: 210, lat: 45, lon: -15, d: 2.6 },
    { f: 420, lat: 47.2, lon: -6.0, d: 1.35, tilt: 35 }, { f: 600, lat: 47.8, lon: -4.6, d: 1.12, tilt: 52, fov: 34 }], f);
  const x = Math.min(23.999, f / 25), i = Math.floor(x);
  const names = Array.from({ length: 25 }, (_, k) => `drape_ciaran_h${String(k).padStart(2, "0")}.png`);
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage cam={cam} assets={["bmng_5400.jpg", ...names]}>
        <Globe a="bmng_5400.jpg" lit />
        <Patch tex={names[i]} tex2={names[i + 1]} mix={x - i} b={[-45, 30, 10, 70]} opacity={0.85 * ramp(f, 60, 140)} />
      </Stage>
      {hours ? <Billboards cam={cam} o={ramp(f, 120, 160)} items={[
        { lat: lerp(hours[i].low[1], hours[i + 1].low[1], x - i), lon: lerp(hours[i].low[0], hours[i + 1].low[0], x - i),
          text: `L ${Math.round(lerp(hours[i].low[2], hours[i + 1].low[2], x - i))}`, c: "#ff7a8a", s: 64, dot: false, dx: -40, dy: -40 },
        { lat: 48.39, lon: -4.49, text: "Brest", s: 54, dy: 10 }]} /> : null}
      <Label x={90} y={60} s={54}>Storm Ciarán · ERA5 sea-level pressure, hourly</Label>
      <Label x={1830} y={60} s={68} anchor="end">{fmtHour(i)}</Label>
    </AbsoluteFill>
  );
};
export const FlightB: React.FC = () => {
  const f = useCurrentFrame();
  const cam = flight([{ f: 0, lat: 46.0, lon: -6.5, d: 1.16, tilt: 45 }, { f: 220, lat: 44.6, lon: 8.5, d: 1.14, tilt: 50 },
    { f: 330, lat: 44.0, lon: 10.5, d: 1.13, tilt: 50 }, { f: 600, lat: 26.5, lon: 88, d: 1.2, tilt: 48 }], f);
  const where = f < 150 ? "Brest" : f < 380 ? "the Alps" : "Tibet";
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage cam={cam} sun={[2, 3, 4]} assets={["bmng_5400.jpg", "etopo_disp.png"]}><DispGlobe tex="bmng_5400.jpg" disp="etopo_disp.png" exag={30} /></Stage>
      <Label x={90} y={60} s={54}>ETOPO 2022 relief on the globe · height ×30</Label>
      <Label x={1830} y={60} s={68} anchor="end">{where}</Label>
    </AbsoluteFill>
  );
};
export const FlightC: React.FC = () => {
  const f = useCurrentFrame();
  const cam = flight([{ f: 0, lat: 0, lon: -170, d: 3.0, tilt: 0 }, { f: 160, lat: 8, lon: -100, d: 2.2, tilt: 30 },
    { f: 330, lat: 6, lon: -10, d: 2.2, tilt: 30 }, { f: 480, lat: 12, lon: 80, d: 2.6, tilt: 20 }], f);
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage cam={cam} assets={["drape_s4.png"]}><Globe a="drape_s4.png" /></Stage>
      <Label x={90} y={60} s={54}>Mean sea-level pressure 1991–2020 · the equatorial trough</Label>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ before / after swipe slider
const Slider: React.FC<{ k: string; before: string; after: string; title: string; w: number; h: number; diff: string }> = ({ k, before, after, title, w, h, diff }) => {
  const f = useCurrentFrame();
  // glide in, pause, reverse, settle (eased); then the difference pass
  const keys: [number, number][] = [[0, 0.04], [30, 0.04], [120, 0.96], [160, 0.96], [230, 0.3], [260, 0.3], [300, 0.5], [340, 0.5]];
  let x = keys[keys.length - 1][1];
  for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) { const [f0, a] = keys[i - 1], [f1, b] = keys[i]; x = lerp(a, b, ease((f - f0) / Math.max(1, f1 - f0))); break; }
  const s = Math.min(1500 / w, 760 / h), W = w * s, H = h * s, x0 = (1920 - W) / 2, y0 = 170;
  const dOp = ramp(f, 350, 390);
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Img src={staticFile(after)} style={{ position: "absolute", left: x0, top: y0, width: W, height: H }} />
      <div style={{ position: "absolute", left: x0, top: y0, width: W * x, height: H, overflow: "hidden" }}>
        <Img src={staticFile(before)} style={{ width: W, height: H }} />
      </div>
      <Img src={staticFile(diff)} style={{ position: "absolute", left: x0, top: y0, width: W, height: H, opacity: dOp }} />
      <div style={{ position: "absolute", left: x0 + W * x - 3, top: y0 - 10, width: 6, height: H + 20, background: K.gold, opacity: 1 - dOp,
        boxShadow: "0 0 12px rgba(0,0,0,0.8)" }} />
      <div style={{ position: "absolute", left: x0 + W * x - 22, top: y0 + H / 2 - 22, width: 44, height: 44, borderRadius: 22, background: K.gold, opacity: 1 - dOp }} />
      <Label x={x0 - 40} y={y0 + H / 2 - 70} s={54} c={K.key} anchor="end" o={1 - dOp}>BEFORE</Label>
      <Label x={x0 - 40} y={y0 + H / 2} s={48} c={K.slate} anchor="end" o={1 - dOp}>{k === "indus" ? "Aug–Sep 2021" : "Aug–Sep 2023"}</Label>
      <Label x={x0 + W + 40} y={y0 + H / 2 - 70} s={54} c={K.key} o={1 - dOp}>AFTER</Label>
      <Label x={x0 + W + 40} y={y0 + H / 2} s={48} c={K.slate} o={1 - dOp}>{k === "indus" ? "Aug–Sep 2022" : "Sep–Oct 2023"}</Label>
      <Label x={960} y={y0 - 80} s={48} c={K.key} anchor="middle" o={dOp}>difference · darker red = more change</Label>
      <Label x={90} y={30} s={54}>{title}</Label>
    </AbsoluteFill>
  );
};
export const SliderIndus: React.FC = () => <Slider k="indus" before="sl_indus_before.png" after="sl_indus_after.png" diff="sl_indus_diff.png" w={800} h={800}
  title="Lower Indus floods · MODIS false colour (Earth Engine)" />;
export const SliderDerna: React.FC = () => <Slider k="derna" before="sl_derna_before.png" after="sl_derna_after.png" diff="sl_derna_diff.png" w={900} h={680}
  title="Derna, Libya · Sentinel-2 true colour (STAC)" />;
export { clamp01 };
