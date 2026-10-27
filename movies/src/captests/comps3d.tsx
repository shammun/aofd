// 3-D capability-test compositions (three.js via @remotion/three): globes (G1, G2, C2, O1), terrain (T1, T2, T3, C4),
// sections and stacks (X1, X2, X3), map -> 3-D plate (C1), particles (A2), and the heavy combination (P1).
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { Cam, D2R, Globe, K, Label, Stage, TexPlane, Terrain, ease, globeCam, lerp, ll, ramp, terrainSize, useBin, useJson, useTex } from "./kit";

type Meta = { heights: Record<string, { nx: number; ny: number; zmin: number; zmax: number; bounds: number[] }>; bm_bounds: Record<string, number[]> };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (i: number) => String(i).padStart(2, "0");

// ------------------------------------------------------------------ globes
export const G1Globe: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage cam={globeCam(25, -20 + f * 0.33, 4.9)} assets={["g1_t2m.png"]}><Globe a="g1_t2m.png" /></Stage>
      <Label x={90} y={60} s={54}>ERA5 2-m temperature · 12 UTC 2 Nov 2023</Label>
    </AbsoluteFill>
  );
};
const SeqGlobe: React.FC<{ prefix: string; n: number; per: number; lat: number; lon0: number; dlon: number; label: (i: number) => string; title: string }> =
  ({ prefix, n, per, lat, lon0, dlon, label, title }) => {
    const f = useCurrentFrame();
    const x = Math.min(n - 1.0001, f / per), i = Math.floor(x), w = ease((x - i - 0.5) / 0.5);
    return (
      <AbsoluteFill style={{ background: K.bg }}>
        <Stage cam={globeCam(lat, lon0 + f * dlon, 4.9)} assets={Array.from({ length: n }, (_, k) => `${prefix}_${pad(k)}.png`)}><Globe a={`${prefix}_${pad(i)}.png`} b={`${prefix}_${pad(i + 1)}.png`} mix={w} /></Stage>
        <Label x={90} y={60} s={54}>{title}</Label>
        <Label x={1830} y={60} s={68} anchor="end">{label(i)}</Label>
      </AbsoluteFill>
    );
  };
export const G2Globe: React.FC = () => <SeqGlobe prefix="g2_t2m" n={24} per={15} lat={20} lon0={30} dlon={-0.25} title="ERA5 2-m temperature, hourly"
  label={(i) => `2 Nov ${pad(i)}:00 UTC`} />;
export const O1Globe: React.FC = () => <SeqGlobe prefix="o1_sst" n={12} per={30} lat={5} lon0={-150} dlon={0.1} title="OISST sea-surface temperature, monthly"
  label={(i) => `${MONTHS[i]} 2023`} />;
export const C2Globe: React.FC = () => {
  const f = useCurrentFrame();
  const m = ramp(f, 150, 210);
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage cam={globeCam(0, -140 + f * 0.12, 4.7)} assets={["c2_anom.png", "c2_gee_thumb.png"]}><Globe a="c2_anom.png" b="c2_gee_thumb.png" mix={m} /></Stage>
      <Label x={90} y={60} s={54}>{m < 0.5 ? "OISST anomaly Dec 2023 · GEE grid, our cmocean colours" : "the same month · GEE server-rendered thumbnail"}</Label>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ terrain
const TerrainShot: React.FC<{ key3: string; drape: string; exag: number; cam: (f: number, W: number, H: number) => Cam; label: string; floor?: number; step?: number }> =
  ({ key3, drape, exag, cam, label, floor = 0, step = 1 }) => {
    const f = useCurrentFrame();
    const meta = useJson<Meta>("meta.json");
    if (!meta) return null;
    const h = meta.heights[key3];
    const { W, H } = terrainSize(h.bounds);
    return (
      <AbsoluteFill style={{ background: K.bg }}>
        <Stage cam={cam(f, W, H)} sun={[-300, 500, 600]} assets={[`h_${key3}.bin`, drape]}>
          <group rotation={[-Math.PI / 2, 0, 0]}><Terrain bin={`h_${key3}.bin`} nx={h.nx} ny={h.ny} bounds={h.bounds} drape={drape} exag={exag} floor={floor} step={step} /></group>
        </Stage>
        <Label x={90} y={60} s={54}>{label}</Label>
      </AbsoluteFill>
    );
  };
const orbit = (az: number, el: number, dist: number, tgt: [number, number, number] = [0, 0, 0], fov = 35): Cam => {
  const a = az * D2R, e = el * D2R;
  return { pos: [tgt[0] + dist * Math.cos(e) * Math.sin(a), tgt[1] + dist * Math.sin(e), tgt[2] + dist * Math.cos(e) * Math.cos(a)], look: tgt, fov };
};
export const T1Terrain: React.FC = () => <TerrainShot key3="alps" drape="bm_alps.jpg" exag={6} label="Alps · ETOPO 2022 + Blue Marble · height ×6"
  cam={(f, W) => orbit(lerp(-25, 25, f / 300), 32, W * 0.95)} />;
export const T2Fly: React.FC = () => <TerrainShot key3="tibet" drape="t2_sp.png" exag={4} step={2} label="Tibet · ERA5 surface pressure colours · height ×4"
  cam={(f, W, H) => { const t = ease(f / 450); const x = lerp(-0.42 * W, 0.2 * W, t), z = lerp(0.62 * H, 0.05 * H, t), y = lerp(330, 170, t);
    return { pos: [x, y, z], look: [x + 520, 0, z - 620], fov: 50 }; }} />;
export const C4Terrain: React.FC = () => {
  const f = useCurrentFrame();
  const meta = useJson<Meta>("meta.json");
  const ct = useJson<{ l: number; c: number[][] }[]>("c4_contours.json");
  const buf = useBin("h_alps.bin");
  const lines = useMemo(() => {
    if (!meta || !ct || !buf) return null;
    const h = meta.heights.alps, z = new Float32Array(buf), b = h.bounds;
    const { W, H } = terrainSize(b);
    const pts: number[] = [];
    for (const c of ct) {
      if ((c.l ?? 0) < 1500) continue;
      for (let k = 1; k < c.c.length; k++) for (const q of [c.c[k - 1], c.c[k]]) {
        const fx = (q[0] - b[0]) / (b[2] - b[0]), fy = (b[3] - q[1]) / (b[3] - b[1]);
        const zz = z[Math.min(h.ny - 1, Math.round(fy * (h.ny - 1))) * h.nx + Math.min(h.nx - 1, Math.round(fx * (h.nx - 1)))];
        pts.push((fx - 0.5) * W, (0.5 - fy) * H, Math.max(0, zz) / 1000 * 6 + 0.4);
      }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [meta, ct, buf]);
  if (!meta || !lines) return null;
  const h = meta.heights.alps; const { W } = terrainSize(h.bounds);
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage cam={orbit(lerp(20, -20, f / 300), 38, W * 0.9)} sun={[-300, 500, 600]} assets={["h_alps.bin", "c4_hs.png"]}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Terrain bin="h_alps.bin" nx={h.nx} ny={h.ny} bounds={h.bounds} drape="c4_hs.png" exag={6} />
          <lineSegments geometry={lines}><lineBasicMaterial color={K.gold} transparent opacity={ramp(f, 60, 120)} /></lineSegments>
        </group>
      </Stage>
      <Label x={90} y={60} s={54}>QGIS hillshade + 500-m contours on our three.js terrain</Label>
    </AbsoluteFill>
  );
};

/** T3: globe (Blue Marble) -> Europe -> Brittany terrain with a 500-m Blue Marble drape, ending on Brest. */
export const T3Zoom: React.FC = () => {
  const f = useCurrentFrame();
  const meta = useJson<Meta>("meta.json");
  if (!meta) return null;
  const t = ease(f / 260);
  const d = Math.exp(lerp(Math.log(4.2), Math.log(1.06), t));
  const cam = globeCam(lerp(30, 48.4, t), lerp(-40, -4.5, t), d, 30);
  const sw = ramp(f, 255, 300);
  const h = meta.heights.brittany; const { W, H } = terrainSize(h.bounds);
  const bx = (-4.49 - h.bounds[0]) / (h.bounds[2] - h.bounds[0]) - 0.5, by = 0.5 - (h.bounds[3] - 48.39) / (h.bounds[3] - h.bounds[1]);
  const u = ease((f - 255) / 195);
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      {sw < 1 ? <div style={{ position: "absolute", inset: 0, opacity: 1 - sw }}><Stage cam={cam} assets={["bmng_5400.jpg"]}><Globe a="bmng_5400.jpg" lit /></Stage></div> : null}
      {sw > 0 ? <div style={{ position: "absolute", inset: 0, opacity: sw }}>
        <Stage cam={{ pos: [bx * W, lerp(420, 60, u), -by * H + lerp(200, 90, u)], look: [bx * W, 0, -by * H], fov: 40 }} sun={[-300, 500, 600]} assets={["h_brittany.bin", "bm_brittany.jpg"]}>
          <group rotation={[-Math.PI / 2, 0, 0]}><Terrain bin="h_brittany.bin" nx={h.nx} ny={h.ny} bounds={h.bounds} drape="bm_brittany.jpg" exag={8} floor={-30} /></group>
        </Stage></div> : null}
      {f > 330 ? <Label x={960} y={470} s={68} anchor="middle" o={ramp(f, 330, 360)}>Brest</Label> : null}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ X1 section lifted out of the map
type X1 = { A: number[]; B: number[]; map_bounds: number[] };
export const X1Section: React.FC = () => {
  const f = useCurrentFrame();
  const d = useJson<X1>("x1.json");
  if (!d) return null;
  const [w, s, e, n] = d.map_bounds;
  const mlat = (s + n) / 2;
  const sc = 1 / 1000; // km -> units
  const Wm = (e - w) * 111.32 * Math.cos(mlat * D2R) * sc, Hm = (n - s) * 110.57 * sc;
  const P = (lo: number, la: number): [number, number] => [((lo - w) / (e - w) - 0.5) * Wm, -(((la - s) / (n - s)) - 0.5) * Hm];
  const a = P(d.A[0], d.A[1]), b = P(d.B[0], d.B[1]);
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(-(b[1] - a[1]), b[0] - a[0]);
  const lift = ramp(f, 60, 200);
  const Hs = 1.0; // section height (units) for 1000 -> 200 hPa, stated "not to scale" in the notes
  const cam = orbit(lerp(10, 35, f / 360), lerp(55, 22, ramp(f, 0, 220)), 4.8, [0, 0.4, 0]);
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage cam={cam} light={false} assets={["x1_t850.png", "x1_section.png"]}>
        <TexPlane tex="x1_t850.png" w={Wm} h={Hm} rot={[-Math.PI / 2, 0, 0]} />
        <group position={[(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2]} rotation={[0, ang, 0]}>
          <TexPlane tex="x1_section.png" w={L} h={Hs * lift + 0.001} pos={[0, (Hs * lift) / 2, 0]} opacity={0.4 + 0.6 * lift} />
        </group>
      </Stage>
      <Label x={90} y={60} s={54}>850 hPa temperature map → section 1000–200 hPa</Label>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ X2 sounding column with a rising balloon
type X2 = { z: number[]; T: number[]; p: number[]; lat: number; lon: number; trop_z: number };
const tcol = (T: number) => { const c = new THREE.Color(); const x = Math.max(0, Math.min(1, (T + 60) / 75)); c.setHSL(0.66 - 0.66 * x, 0.75, 0.55); return c; };
export const X2Sounding: React.FC = () => {
  const f = useCurrentFrame();
  const d = useJson<X2>("x2.json");
  if (!d) return null;
  const w = -6, s = 41, e = 10, n = 52, mlat = 46.5, sc = 1 / 1000;
  const Wm = (e - w) * 111.32 * Math.cos(mlat * D2R) * sc, Hm = (n - s) * 110.57 * sc;
  const px = ((d.lon - w) / (e - w) - 0.5) * Wm, pz = -(((d.lat - s) / (n - s)) - 0.5) * Hm;
  const zk = 0.05; // 1 km of height = 0.05 units = 50 km on the map: vertical x50 (stated in notes)
  const zTop = Math.min(16000, d.z[d.z.length - 1]);
  const zb = lerp(0, zTop, ramp(f, 40, 320));
  let k = 0; while (k < d.z.length - 1 && d.z[k + 1] <= zb) k++;
  const Tb = k < d.z.length - 1 ? lerp(d.T[k], d.T[k + 1], (zb - d.z[k]) / Math.max(1, d.z[k + 1] - d.z[k])) : d.T[k];
  const segs: React.ReactNode[] = [];
  for (let i = 1; i < d.z.length && d.z[i] <= zb + 1; i++) {
    const z0 = d.z[i - 1] / 1000 * zk, z1 = d.z[i] / 1000 * zk;
    segs.push(<mesh key={i} position={[px, (z0 + z1) / 2, pz]}><cylinderGeometry args={[0.03, 0.03, Math.max(1e-4, z1 - z0), 16]} /><meshBasicMaterial color={tcol(d.T[i])} /></mesh>);
  }
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage cam={orbit(lerp(-30, 10, f / 360), 18, 2.4, [px, 0.35, pz])} assets={["x2_france.png"]}>
        <TexPlane tex="x2_france.png" w={Wm} h={Hm} rot={[-Math.PI / 2, 0, 0]} />
        {segs}
        <mesh position={[px, zb / 1000 * zk + 0.02, pz]}><sphereGeometry args={[0.035, 24, 16]} /><meshStandardMaterial color={K.key} /></mesh>
      </Stage>
      <Label x={90} y={60} s={54}>Trappes sounding · 00 UTC 1 Nov 2023 (IGRA)</Label>
      <Label x={1830} y={60} s={68} anchor="end">{`${(zb / 1000).toFixed(1)} km   ${Tb >= 0 ? "" : "−"}${Math.abs(Tb).toFixed(0)} °C`}</Label>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ X3 stacked pressure levels
export const X3Stack: React.FC = () => {
  const f = useCurrentFrame();
  const Wm = 56 * 111.32 * Math.cos(50 * D2R) / 1000, Hm = 38 * 110.57 / 1000;
  const sep = lerp(0.02, 0.9, ramp(f, 30, 180));
  const lv = [["x3_850.png", 0, "850 hPa temperature"], ["x3_500.png", 1, "500 hPa height"], ["x3_250.png", 2, "250 hPa wind speed"]] as const;
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage cam={orbit(lerp(-25, 15, f / 300), 26, 7.2, [0, 0.9, 0])} light={false} assets={["x3_850.png", "x3_500.png", "x3_250.png"]}>
        {lv.map(([t, i]) => <TexPlane key={t} tex={t} w={Wm} h={Hm} pos={[0, i * sep, 0]} rot={[-Math.PI / 2, 0, 0]} opacity={i === 0 ? 1 : 0.92} />)}
      </Stage>
      <Label x={90} y={60} s={54}>Ciarán 12 UTC 2 Nov · three pressure levels</Label>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ C1 static map -> 3-D plate (pressure as height)
export const C1Plate: React.FC = () => {
  const f = useCurrentFrame();
  const meta = useJson<{ nx: number; ny: number; min: number; max: number; bounds: number[] }>("c1.json");
  const buf = useBin("c1_msl.bin");
  const tex = useTex("drape_s1.png");
  const dep = ramp(f, 90, 200);
  const geo = useMemo(() => {
    if (!meta || !buf) return null;
    const z = new Float32Array(buf);
    const Wm = 55 * 111.32 * Math.cos(49.5 * D2R) / 1000, Hm = 33 * 110.57 / 1000;
    const g = new THREE.PlaneGeometry(Wm, Hm, meta.nx - 1, meta.ny - 1);
    return { g, z };
  }, [meta, buf]);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.9, side: THREE.DoubleSide }), []);
  if (!geo || !tex || !meta) return null;
  const pos = geo.g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, (geo.z[i] - 1013) / 60 * dep);
  pos.needsUpdate = true; geo.g.computeVertexNormals();
  mat.map = tex; mat.needsUpdate = true;
  const tilt = lerp(90, 30, ramp(f, 20, 120));
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage cam={orbit(lerp(0, 18, f / 300), tilt, 5.6)} sun={[-3, 6, 4]} assets={["drape_s1.png", "c1_msl.bin"]}>
        <mesh geometry={geo.g} material={mat} rotation={[-Math.PI / 2, 0, 0]} />
      </Stage>
      <Label x={90} y={60} s={54}>the S1 map as a plate · low pressure pushed down</Label>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ A2 particles with trails over the map
export const A2Particles: React.FC = () => {
  const f = useCurrentFrame();
  const buf = useBin("a2_tracks.bin");
  const info = useJson<{ steps: number; n: number }>("a2_tracks.json");
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const pts = useMemo(() => new THREE.BufferGeometry(), []);
  if (!buf || !info) return null;
  const tr = new Float32Array(buf);
  const w = -40, s = 36, e = 10, n = 65, mlat = 50.5;
  const Wm = (e - w) * 111.32 * Math.cos(mlat * D2R) / 1000, Hm = (n - s) * 110.57 / 1000;
  const X = (lo: number) => ((lo - w) / (e - w) - 0.5) * Wm, Z = (la: number) => -(((la - s) / (n - s)) - 0.5) * Hm;
  const step = Math.min(info.steps - 1, Math.floor(f / 360 * (info.steps - 1)));
  const tail = 14;
  const seg: number[] = [], p: number[] = [];
  for (let i = 0; i < info.n; i++) {
    const age = (i * 7) % 40;  // staggered release so trails do not all start together (deterministic)
    if (step < age) continue;
    for (let k = Math.max(age, step - tail) + 1; k <= step; k++) {
      const a = ((k - 1) * info.n + i) * 2, b = (k * info.n + i) * 2;
      seg.push(X(tr[a]), 0.01, Z(tr[a + 1]), X(tr[b]), 0.01, Z(tr[b + 1]));
    }
    const c = (step * info.n + i) * 2;
    p.push(X(tr[c]), 0.012, Z(tr[c + 1]));
  }
  geo.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
  pts.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
  const hrs = (step * 15) / 60;
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage cam={orbit(0, lerp(88, 60, ramp(f, 0, 360)), 4.0)} light={false} assets={["a2_base.png"]}>
        <TexPlane tex="a2_base.png" w={Wm} h={Hm} rot={[-Math.PI / 2, 0, 0]} opacity={0.55} />
        <lineSegments geometry={geo}><lineBasicMaterial color="#7fe3d6" transparent opacity={0.95} /></lineSegments>
        <points geometry={pts}><pointsMaterial color={K.key} size={6} sizeAttenuation={false} /></points>
      </Stage>
      <Label x={90} y={60} s={54}>10-m wind · air parcels carried by ERA5 hourly winds</Label>
      <Label x={1830} y={60} s={68} anchor="end">{`+${hrs.toFixed(1)} h`}</Label>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ P1 heaviest combination (three canvases)
export const P1Heavy: React.FC = () => {
  const f = useCurrentFrame();
  const x = Math.min(22.999, f / 13), i = Math.floor(x);
  const meta = useJson<Meta>("meta.json");
  if (!meta) return null;
  const h = meta.heights.tibet; const { W } = terrainSize(h.bounds);
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage cam={globeCam(20, 30 - f * 0.3, 4.9)} W={960} H={1080} assets={Array.from({ length: 24 }, (_, k) => `g2_t2m_${pad(k)}.png`)}><Globe a={`g2_t2m_${pad(i)}.png`} b={`g2_t2m_${pad(i + 1)}.png`} mix={x - i} lit /></Stage>
      <Stage cam={orbit(lerp(-20, 20, f / 300), 30, W * 0.9)} W={960} H={1080} x={960} sun={[-300, 500, 600]} assets={["h_tibet.bin", "bm_tibet.jpg"]}>
        <group rotation={[-Math.PI / 2, 0, 0]}><Terrain bin="h_tibet.bin" nx={h.nx} ny={h.ny} bounds={h.bounds} drape="bm_tibet.jpg" exag={4} /></group>
      </Stage>
      <Label x={60} y={60} s={48}>P1 · globe sequence + full-res terrain in one frame</Label>
    </AbsoluteFill>
  );
};
export { ll };
