// House kit: promoted 2026-10-29 (weather basics UF2) from ch00_weather_basics/kit_wb/three3d.tsx (= ch00/kit_cp).
// WebGL building blocks for the cross-product movie (kit_cp): View3D (ThreeCanvas + frame-driven camera), Arrow3D,
// Rod3D, Plane3D, Quad3D. Everything is a pure function of props (no useFrame, no rAF, no Math.random). Sizes of
// arrows are given in screen px and converted with the camera, so a zoom keeps the house strokes (10-px shafts,
// 40-px heads; results 14 px).
import React, { createContext, useContext, useId, useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CamState, Projector, V3, add3, applyCam, len3, norm3, projector, sub3 } from "./cam";
import { PROBE, probe3, probeOff } from "./probe";

type Ctx = { st: CamState; W: number; H: number; pr: Projector };
const View3DCtx = createContext<Ctx | null>(null);
export const useView3D = () => {
  const c = useContext(View3DCtx);
  if (!c) throw new Error("3-D component used outside View3D");
  return c;
};

const CamRig: React.FC<{ st: CamState; W: number; H: number }> = ({ st, W, H }) => {
  const set = useThree((s) => s.set);
  const persp = useMemo(() => { const c = new THREE.PerspectiveCamera(); (c as unknown as { manual: boolean }).manual = true; return c; }, []);
  const orth = useMemo(() => { const c = new THREE.OrthographicCamera(); (c as unknown as { manual: boolean }).manual = true; return c; }, []);
  useLayoutEffect(() => {
    const c = st.ortho ? orth : persp;
    applyCam(c, st, W, H);
    set({ camera: c });
  });
  return null;
};

/** A transparent ThreeCanvas at (x, y) of size w × h, camera from `st`, house lights (ambient + one key light). */
export const View3D: React.FC<{ st: CamState; x?: number; y?: number; w?: number; h?: number; o?: number; children: React.ReactNode;
  key3?: V3; amb?: number; dir?: number; style?: React.CSSProperties }> = ({ st, x = 0, y = 0, w = 1920, h = 1080, o = 1, children,
  key3 = [-4, -6, 9], amb = 1.15, dir = 2.0, style }) => {
  const pr = useMemo(() => projector(st, w, h, x, y), [st, w, h, x, y]);
  if (o <= 0) return null;
  return (
    <ThreeCanvas width={w} height={h} style={{ position: "absolute", left: x, top: y, opacity: o, ...style }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }} camera={{ position: [0, 0, 10], fov: st.fov }}>
      <CamRig st={st} W={w} H={h} />
      <ambientLight intensity={amb} />
      <directionalLight position={key3} intensity={dir} />
      <directionalLight position={[6, 4, -3]} intensity={0.45} />
      <View3DCtx.Provider value={{ st, W: w, H: h, pr }}>{children}</View3DCtx.Provider>
    </ThreeCanvas>
  );
};

// ------------------------------------------------------------------------------------------------ shared geometry
const GEO = {
  cyl: new THREE.CylinderGeometry(1, 1, 1, 20, 1),
  cone: new THREE.ConeGeometry(1, 1, 24, 1),
  sph: new THREE.SphereGeometry(1, 24, 16),
};
const Y = new THREE.Vector3(0, 1, 0);
const quatTo = (d: V3) => new THREE.Quaternion().setFromUnitVectors(Y, new THREE.Vector3(...norm3(d)));

/** a material per (colour, opacity) use; emissive keeps the house hue under the lights */
export const useMat = (color: string, o = 1, emiss = 0.42, rough = 0.55) => {
  const m = useMemo(() => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, transparent: true }), [color, rough]);
  m.emissive.set(color).multiplyScalar(emiss);
  m.opacity = o;
  m.depthWrite = o > 0.98;
  return m;
};

/** A solid rod (cylinder) between two points, width in screen px at its midpoint. */
export const Rod3D: React.FC<{ a: V3; b: V3; px?: number; color: string; o?: number; r?: number }> = ({ a, b, px = 6, color, o = 1, r }) => {
  const { pr } = useView3D();
  const id = useId();
  const mat = useMat(color, o);
  const d = sub3(b, a), L = len3(d);
  if (L < 1e-6 || o <= 0) { probeOff(id); return null; }
  const mid = add3(a, d, 0.5);
  const rad = r ?? (px / 2) * pr.wpp(mid);
  if (PROBE.on) probe3(id, { k: "rod3d", c: color, w: (2 * rad) / pr.wpp(mid), o, pts: [pr.p(a), pr.p(b)], closed: false });
  return <mesh geometry={GEO.cyl} material={mat} position={mid} quaternion={quatTo(d)} scale={[rad, L, rad]} />;
};

/** A ball (e.g. an air parcel) of diameter px. */
export const Ball3D: React.FC<{ at: V3; px?: number; color: string; o?: number; r?: number }> = ({ at, px = 16, color, o = 1, r }) => {
  const { pr } = useView3D();
  const id = useId();
  const mat = useMat(color, o, 0.3);
  if (o <= 0) { probeOff(id); return null; }
  const rad = r ?? (px / 2) * pr.wpp(at);
  if (PROBE.on) {
    const c0 = pr.p(at), rp = rad / pr.wpp(at);
    probe3(id, { k: "ball3d", c: color, w: 0, o, closed: true, pts: Array.from({ length: 24 }, (_, i) => [c0[0] + rp * Math.cos((i * Math.PI) / 12), c0[1] + rp * Math.sin((i * Math.PI) / 12)]) });
  }
  return <mesh geometry={GEO.sph} material={mat} position={at} scale={[rad, rad, rad]} />;
};

/**
 * Arrow3D: cylinder shaft + cone head from `from` to `to`; px = shaft width, head = head length (screen px at the
 * arrow's middle). `grow` 0..1 draws it from the tail. `dash` = segmented shaft (negative results, with a rose "−"
 * glyph added by the overlay). Sizes follow the SVG house Arrow: head ≤ 0.6 L, head half-width 0.42 × head.
 */
export const Arrow3D: React.FC<{ from: V3; to: V3; color: string; px?: number; head?: number; o?: number; grow?: number; dash?: boolean;
  scaleAt?: V3; onTop?: boolean }> = ({ from, to, color, px = 10, head = 40, o = 1, grow = 1, dash = false, scaleAt, onTop = false }) => {
  const { pr } = useView3D();
  const id = useId();
  const mat = useMat(color, o);
  mat.depthTest = !onTop;
  const tip = add3(from, sub3(to, from), Math.max(0, Math.min(1, grow)));
  const d = sub3(tip, from), L = len3(d);
  if (L < 1e-5 || o <= 0 || grow <= 0) { probeOff(id); return null; }
  const u = norm3(d);
  const w = pr.wpp(scaleAt ?? add3(from, d, 0.5));
  const h = Math.min(head * w, 0.6 * L), hr = 0.42 * (h / w) * w;
  const shaftEnd = add3(tip, u, -h * 0.7);
  const rs = (px / 2) * w, q = quatTo(u);
  const conePos = add3(tip, u, -h / 2);
  const shafts: React.ReactNode[] = [];
  const SL = len3(sub3(shaftEnd, from));
  if (PROBE.on) {
    const T = pr.p(tip), Bc = pr.p(add3(tip, u, -h)), S0 = pr.p(from), S1 = pr.p(shaftEnd);
    const hx = Bc[0] - T[0], hy = Bc[1] - T[1], hl = Math.hypot(hx, hy) || 1, hp = (hr / pr.wpp(add3(tip, u, -h)));
    const nx = -hy / hl, ny = hx / hl;
    probe3(id, { k: "arrow3d", c: color, w: px, o, closed: false, pts: [S0, S1],
      head: [T, [Bc[0] + nx * hp, Bc[1] + ny * hp], [Bc[0] - nx * hp, Bc[1] - ny * hp]] });
  }
  if (!dash) {
    shafts.push(<mesh key="s" geometry={GEO.cyl} material={mat} position={add3(from, u, SL / 2)} quaternion={q} scale={[rs, SL, rs]} />);
  } else {
    const on = 22 * w, off = 14 * w;
    let s = 0, k = 0;
    while (s < SL - 1e-6) {
      const e = Math.min(SL, s + on);
      shafts.push(<mesh key={k++} geometry={GEO.cyl} material={mat} position={add3(from, u, (s + e) / 2)} quaternion={q} scale={[rs, e - s, rs]} />);
      s = e + off;
    }
  }
  return (
    <group renderOrder={onTop ? 20 : 0}>
      {shafts}
      <mesh geometry={GEO.cone} material={mat} position={conePos} quaternion={q} scale={[hr, h, hr]} />
    </group>
  );
};

/** A flat filled polygon (convex quad or triangle fan) in 3-D, e.g. the violet parallelogram at 18 %. */
export const Quad3D: React.FC<{ pts: V3[]; color: string; o?: number; side?: THREE.Side }> = ({ pts, color, o = 0.18, side = THREE.DoubleSide }) => {
  const { pr } = useView3D();
  const id = useId();
  if (PROBE.on) { if (o > 0) probe3(id, { k: "quad3d", c: color, w: 0, o, closed: true, pts: pts.map((v) => pr.p(v)) }); else probeOff(id); }
  const geo = useMemo(() => new THREE.BufferGeometry(), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color, transparent: true, side, depthWrite: false }), [color, side]);
  mat.opacity = o;
  const pos: number[] = [];
  for (let i = 1; i < pts.length - 1; i++) pos.push(...pts[0], ...pts[i], ...pts[i + 1]);
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.computeBoundingSphere();
  if (o <= 0) return null;
  return <mesh geometry={geo} material={mat} renderOrder={2} />;
};

/** A translucent floor plane (for the view from below, s17) */
export const Plane3D: React.FC<{ x0: number; x1: number; y0: number; y1: number; z?: number; color?: string; o?: number }> = ({
  x0, x1, y0, y1, z = 0, color = "#171f33", o = 0.25 }) => (o <= 0 ? null : (
  <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, z - 0.002]} renderOrder={1}>
    <planeGeometry args={[x1 - x0, y1 - y0]} />
    <meshBasicMaterial color={color} transparent opacity={o} side={THREE.DoubleSide} depthWrite={false} />
  </mesh>));
