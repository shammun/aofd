// Shared pieces of the ch00_coordinates_sphere movie (#5c, Coordinates Part 3 "Our round Earth"): timing from timing.json
// (SS/SE/AT as in the reference movie DotProductWhy.tsx), the scene wrapper, the data (cs.json from
// movies/data/build_ch00_coordinates_sphere.py, CHECK rows DS01-DS29), the WebGL Earth (kit_cs: whole, translucent, cut along a
// meridian or across a latitude) with SVG overlays projected through the same camera, the face toolkit behind TwoViewSlice (one
// item list drawn on the 3-D cut face and on the same face drawn flat), the band tint, SideCallout, the skip chip and the keep
// line (maths-skip rule 2026-11-05), colour bar, a text width guard (text ends before x 1842) and small code-drawn icons.
// Adapted from Part 4 (src/ch00_coordinates_frames/fr_lib.tsx) and build 1 (src/ch00_coordinates/co_lib.tsx).
// Everything is a pure function of the frame and the data.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { ramp } from "../house";
import timing from "../../ch00/ch00_coordinates_sphere/timing.json";
import csJ from "../../ch00/ch00_coordinates_sphere/data/cs.json";
import { C, FONT, T } from "../house/kit/type";
import { Arrow, Lbl as HLbl, Pt, Svg, clamp, textW } from "../house/kit/draw";
import { Keyword as HKeyword } from "../house/kit/notes";
import { CurvedLink } from "../house/kit/extras";
import { CalcRow, CalcStack as HCalcStack, Layered as HLayered, Part, Layer, TeX as HTeX, plainOf } from "../house/kit/tex";
import { GlobeCam, GProj, coastPath, globeCam, globeProj, useTex, ll, llPath } from "./kit_cs/globe";
import { View3D } from "./kit_cs/three3d";
import { V3 } from "./kit_cs/cam";
import { Cut, EarthMesh } from "./kit_cs/earth";

export const FPS = 30;
type Snt = { text: string; start: number; end: number };
type Scn = { id: string; start: number; end: number; sentences: Snt[] };
export const sc = (timing as unknown as { scenes: Scn[]; total_frames: number }).scenes;
export const HOLD = 75;
export const XF = 10;
export const CS_FRAMES = (timing as unknown as { total_frames: number }).total_frames + HOLD;
const IDS = sc.map((s) => s.id);
export const K = (id: string) => { const k = IDS.indexOf(id); if (k < 0) throw new Error(`no scene ${id}`); return k; };
export const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
export const END = [...CUT.slice(1), CS_FRAMES];
export const LEN = (k: number) => END[k] - CUT[k];
export const SS = (k: number, j: number) => { const s = sc[k].sentences[j]; if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`); return Math.round(s.start * FPS) - CUT[k]; };
export const SE = (k: number, j: number) => { const s = sc[k].sentences[j]; if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`); return Math.round(s.end * FPS) - CUT[k]; };
/** frame (scene-relative) at which the quoted words are spoken inside sentence j (character-proportional) */
export const AT = (k: number, j: number, phrase: string) => {
  const s = sc[k].sentences[j];
  if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`);
  const i = s.text.indexOf(phrase);
  if (i < 0) throw new Error(`phrase "${phrase}" not in ${sc[k].id} sentence ${j}: ${s.text}`);
  return Math.round((s.start + ((s.end - s.start) * i) / s.text.length) * FPS) - CUT[k];
};
export const fin = (f: number, a: number, n = 12) => ramp(f, a, a + n);
export const fout = (f: number, a: number, n = 10) => 1 - ramp(f, a, a + n);
export const win = (f: number, a: number, b: number, n = 10) => fin(f, a, n) * fout(f, b, n);
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => { const x = clamp(t, 0, 1); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const prog = (f: number, a: number, b: number) => ease((f - a) / Math.max(1, b - a));
export const lin = (f: number, a: number, b: number) => clamp((f - a) / Math.max(1, b - a), 0, 1);
export const poly = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
/** a number with a true minus sign and fixed decimals */
export const nf = (v: number, d = 1, plus = false) => `${v < 0 ? "−" : plus && v > 0 ? "+" : ""}${Math.abs(v).toFixed(d)}`;
export const D2R = Math.PI / 180;
export const VIOLET = "#8e6fd8";          // Ω (rotation family, storyboard colour contract)
export const XC = 1100;                   // left edge of the maths column
export const XZ = 1190;                   // text column on the darkened panel of a zoomed globe

export const Scene: React.FC<{ children: React.ReactNode; fadeIn?: boolean }> = ({ children, fadeIn = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.bg, opacity: fadeIn ? ramp(f, 0, XF) : 1 }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- data and assets
/* eslint-disable @typescript-eslint/no-explicit-any */
export const D = csJ as any;
export const IMGS = { bmng: staticFile("cs_bmng.jpg"), panel: (k: string) => staticFile(`cs_panel_${k}.jpg`), t2mEE: staticFile("cs_t2m_ee.png"),
  t2mPolar: staticFile("cs_t2m_pc_polar.png") };
export const ASSET_NAMES = ["cs_bmng.jpg", ...["sing", "khulna", "brest", "lyb"].map((k) => `cs_panel_${k}.jpg`), "cs_t2m_ee.png", "cs_t2m_pc_polar.png"];
export const BREST: [number, number] = D.places.brest, KHULNA: [number, number] = D.places.khulna, SING: [number, number] = D.places.sing,
  LYB: [number, number] = D.places.lyb, GREENWICH: [number, number] = D.places.greenwich;
export const LUT_T = D.luts.thermal as string[];
export const lutCss = (lut: string[], t: number) => lut[Math.max(0, Math.min(lut.length - 1, Math.round(t * (lut.length - 1))))];
/** hats in KaTeX (review 1 Should 2: never a combining hat in a text label) */
export const H = { x: String.raw`\hat{\mathbf x}`, y: String.raw`\hat{\mathbf y}`, z: String.raw`\hat{\mathbf z}`, r: String.raw`\hat{\mathbf r}` };
/** Earth axes (x̂ to 0 N 0 E, ŷ to 0 N 90 E, ẑ to the North Pole) → the kit's Y-up globe coordinates */
export const e2g = (v: number[]): V3 => [v[1], v[2], v[0]];
export const SRC_G = "Image: NASA Blue Marble Next Generation · Natural Earth";

// ---------------------------------------------------------------- text width guard (text ends before x 1842)
/** a rough, slightly generous width of a KaTeX string at effective size s; used only as a layout guard */
export const texW = (src: string, s: number): number => {
  let i = 0;
  const str = src.replace(/\\displaystyle|\\left|\\right|\\Big|\\big|\\!/g, "");
  const group = (): number => {
    if (str[i] !== "{") { const w0 = atom(); return w0; }
    i++; let w = 0; while (i < str.length && str[i] !== "}") w += atom(); i++; return w;
  };
  const atom = (): number => {
    const ch = str[i];
    if (ch === "\\") {
      const m = /^\\([a-zA-Z]+|.)/.exec(str.slice(i)); const cmd = m ? m[1] : ""; i += cmd.length + 1;
      if (cmd === "frac" || cmd === "dfrac" || cmd === "tfrac") { const a = group(), b = group(); return Math.max(a, b) * (cmd === "tfrac" ? 0.7 : 1) + 0.2; }
      if (cmd === "text" || cmd === "mathrm") { const j = str.indexOf("}", i); const t = str.slice(i + 1, j); i = j + 1; return t.length * 0.5; }
      if (cmd === "textcolor") { group(); return group(); }
      if (cmd === "underbrace" || cmd === "underset") { const w0 = group(); if (str[i] === "_") { i++; group(); } return w0; }
      if (cmd === "hat" || cmd === "mathbf" || cmd === "boldsymbol" || cmd === "overline" || cmd === "cancel") return group();
      if (cmd === "qquad") return 2; if (cmd === "quad") return 1; if (cmd === ",") return 0.17; if (cmd === " " || cmd === ";") return 0.28;
      if (["approx", "equiv", "neq", "Rightarrow", "to", "longrightarrow", "times", "cdot", "div", "le", "ge", "leftrightarrow"].includes(cmd)) return 1.3;
      if (cmd === "cos" || cmd === "sin" || cmd === "tan") return 1.5;
      if (cmd === "sqrt") return group() + 0.9;
      if (cmd === "sum" || cmd === "int") return 1.1;
      if (cmd === "circ") return 0.3;
      return 0.62;
    }
    if (ch === "^" || ch === "_") { i++; return group() * 0.7; }
    if (ch === "{") return group();
    i++;
    if (ch === " ") return 0;
    if ("=+-<>".includes(ch)) return 1.3;
    if (",;".includes(ch)) return 0.45;
    if ("()[]|'".includes(ch)) return 0.4;
    if (".".includes(ch)) return 0.28;
    return 0.56;
  };
  let w = 0; while (i < str.length) w += atom();
  return w * s * 1.04;
};
const guard = (what: string, x0: number, w: number) => { if (x0 + w > 1842) throw new Error(`text "${what.slice(0, 50)}" ends at x ${Math.round(x0 + w)} (> 1842)`); };
/** house TeX with the right-edge guard */
export const TeX: React.FC<React.ComponentProps<typeof HTeX>> = (p) => {
  const w = texW(p.s, p.size ?? 68), ax = p.ax ?? 0;
  guard(p.s, p.x - ax * w, w);
  return <HTeX {...p} />;
};
export const Layered: React.FC<{ parts: Part[]; layers: Layer[]; x: number; y: number; size?: number; ax?: number; ay?: number; o?: number }> = (p) => {
  const w = texW(plainOf(p.parts), p.size ?? 84), ax = p.ax ?? 0;
  guard(plainOf(p.parts), p.x - ax * w, w);
  return <HLayered {...p} />;
};
const sideStr = (s: CalcRow["rhs"]): string => (typeof s === "string" ? s : "raw" in s ? s.raw[0].s : plainOf(s.parts));
/** house CalcStack with the right-edge guard (row rhs starts at x) */
export const CalcStack: React.FC<React.ComponentProps<typeof HCalcStack>> = (p) => {
  p.rows.forEach((r) => guard(sideStr(r.rhs), p.x, texW(sideStr(r.rhs), r.size ?? p.size ?? 68)));
  return <HCalcStack {...p} />;
};
/** the house SVG label with the right-edge guard */
export const Lbl: React.FC<React.ComponentProps<typeof HLbl>> = (p) => {
  const s = p.s ?? 54, w = textW(p.t, s), a = p.a ?? "start";
  guard(p.t, a === "start" ? p.x : a === "end" ? p.x - w : p.x - w / 2, w * 0.97);
  return <HLbl {...p} />;
};
/** the house Keyword with the right-edge guard */
export const Keyword: React.FC<React.ComponentProps<typeof HKeyword>> = (p) => {
  const s = p.s ?? 54, w = textW(p.text, s), a = p.a ?? "start";
  guard(p.text, a === "start" ? p.at[0] : a === "end" ? p.at[0] - w : p.at[0] - w / 2, w * 0.97);
  return <HKeyword {...p} />;
};
/** split a TeX constant at a separator that must exist (the pieces stay derived from the verbatim storyboard string) */
export const cutAt = (s: string, at: string): string[] => { if (!s.includes(at)) throw new Error(`cutAt: ${at} not in ${s}`); return s.split(at); };
export const rep = (s: string, a: string, b: string) => { if (!s.includes(a)) throw new Error(`rep: "${a}" not in "${s}"`); return s.split(a).join(b); };

// ---------------------------------------------------------------- globe (three.js, kit_cs)
export const GB = { x: 60, y: 28, w: 960, h: 790 };   // the house globe frame for the unzoomed scenes (globe ≥ 760 px across at dist 3.4)
export const GFULL = { x: 0, y: 0, w: 1920, h: 1080 };
export const TV3 = { x: 40, y: 40, w: 900, h: 780 };   // TwoViewSlice: the 3-D view (x 80-940)
export type Box = { x: number; y: number; w: number; h: number };
export const globeG = (cam: GlobeCam, box: Box = GB): GProj => {
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  return globeProj(st, box.w, box.h, box.x, box.y);
};
/** The Earth: WebGL Blue Marble (whole, translucent or cut) in `box`, then SVG overlays through the same camera: graticule,
 * Natural Earth coast (only on a whole globe: a cut globe shows the face), the caller's `over(G)`; `three` = extra R3F children
 * (THREE tags only). Coast and overlays are clipped to the box. */
export const Earth: React.FC<{ cam: GlobeCam; box?: Box; cut?: Cut; alpha?: number; coast?: number; borders?: number; grat?: number; gratStep?: number;
  o?: number; over?: (G: GProj) => React.ReactNode; three?: React.ReactNode; clip?: boolean }> = ({
  cam, box = GB, cut = { kind: "whole" }, alpha = 1, coast = 0.45, borders = 0, grat = 0, gratStep = 30, o = 1, over, three, clip = true }) => {
  const tex = useTex(IMGS.bmng);
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  const G = globeProj(st, box.w, box.h, box.x, box.y);
  if (o <= 0) return null;
  const id = `ec${box.x}_${box.y}_${box.w}_${box.h}`;
  const whole = cut.kind === "whole";
  return (
    <AbsoluteFill>
      <View3D st={st} x={box.x} y={box.y} w={box.w} h={box.h} o={tex || (globalThis as { __R3?: number }).__R3 ? o : 0} key3={st.pos} amb={1.6} dir={1.4}>
        <EarthMesh tex={tex} alpha={alpha} cut={cut} />
        {three}
      </View3D>
      <Svg o={o}>
        <defs><clipPath id={id}><rect x={box.x} y={box.y} width={box.w} height={box.h} /></clipPath></defs>
        <g clipPath={clip ? `url(#${id})` : undefined}>
          {grat > 0 ? <Grat G={G} step={gratStep} o={grat} /> : null}
          {coast > 0 && whole ? <path d={coastPath(G, D.lines.globe110)} fill="none" stroke={C.key} strokeOpacity={coast * alpha} strokeWidth={1.6} /> : null}
          {borders > 0 && whole ? <path d={coastPath(G, D.lines.borders110)} fill="none" stroke={C.key} strokeOpacity={borders * alpha} strokeWidth={1.2} /> : null}
          {over ? over(G) : null}
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
export const Grat: React.FC<{ G: GProj; step?: number; o?: number; c?: string; w?: number }> = ({ G, step = 30, o = 0.25, c = "#9aa6bd", w = 1.5 }) => {
  if (o <= 0) return null;
  let d = "";
  for (let la = -90 + step; la < 90; la += step) { const pts: [number, number][] = []; for (let lo = -180; lo <= 180; lo += 3) pts.push([la, lo]); d += llPath(G, pts); }
  for (let lo = -180; lo < 180; lo += step) { const pts: [number, number][] = []; for (let la = -88; la <= 88; la += 2) pts.push([la, lo]); d += llPath(G, pts); }
  return <path d={d} fill="none" stroke={c} strokeOpacity={o} strokeWidth={w} />;
};
/** a parallel (front part only) */
export const parPath = (G: GProj, lat: number, lo0 = -180, lo1 = 180, r = 1.002) => { const pts: [number, number][] = []; for (let lo = lo0; lo <= lo1 + 1e-9; lo += 1.5) pts.push([lat, lo]); return llPath(G, pts, r); };
/** a meridian (front part only) from lat a to b */
export const merPath = (G: GProj, lon: number, a = -90, b = 90, r = 1.002) => {
  const pts: [number, number][] = []; const n = Math.max(2, Math.ceil(Math.abs(b - a) / 1.5));
  for (let i = 0; i <= n; i++) pts.push([a + ((b - a) * i) / n, lon]); return llPath(G, pts, r);
};
/** a tinted latitude band lat a … b on the globe: many parallels in ONE path, thick enough to overlap (no alpha build-up) */
export const BandTint: React.FC<{ G: GProj; a: number; b: number; c: string; o?: number; step?: number; w?: number }> = ({ G, a, b, c, o = 0.35, step = 0.75, w = 9 }) => {
  if (o <= 0 || b <= a) return null;
  let d = "";
  for (let la = a + step / 2; la < b; la += step) d += parPath(G, la);
  return <path d={d} fill="none" stroke={c} strokeWidth={w} strokeOpacity={o} strokeLinecap="round" />;
};
/** the silhouette disc of a globe view (for the K1 mask and for placing the text column clear of it) */
export const discOf = (cam: GlobeCam, box: Box = GB): { c: Pt; r: number } => {
  const G = globeG(cam, box);
  const c = G.pw([0, 0, 0]);
  const fov = cam.fov ?? 35, r = (box.h / 2) * Math.tan(Math.asin(1 / Math.max(1.0001, cam.dist))) / Math.tan((fov / 2) * D2R);
  return { c, r };
};
/** a surface dot on the globe (hidden behind the limb) */
export const gdot = (G: GProj, la: number, lo: number, c: string = C.gold, r = 10, o = 1, rad = 1) => (o <= 0 || !G.vis(la, lo, rad) ? null :
  <circle cx={G.p(la, lo, rad)[0]} cy={G.p(la, lo, rad)[1]} r={r} fill={c} stroke={C.bg} strokeWidth={4} opacity={o} />);
/** a straight segment between two globe-coordinate points (projected) */
export const gseg = (G: GProj, a: V3, b: V3, c: string, w = 8, o = 1, dash?: string) => o <= 0 ? null :
  <line x1={G.pw(a)[0]} y1={G.pw(a)[1]} x2={G.pw(b)[0]} y2={G.pw(b)[1]} stroke={c} strokeWidth={w} strokeLinecap="round" opacity={o} strokeDasharray={dash} />;
export const garrow = (G: GProj, a: V3, b: V3, c: string, w = 8, head = 30, o = 1) => <Arrow p={G.pw(a)} q={G.pw(b)} color={c} w={w} head={head} o={o} />;
/** an outlined place name at a spot on the globe (house K6 spot-label class) */
export const plab = (G: GProj, la: number, lo: number, t: string, o = 1, dx = 16, dy = 0, a: "start" | "middle" | "end" = "start", italic = false, rad = 1) =>
  o <= 0 || !G.vis(la, lo, rad) ? null : <g data-lc-maplabel="1"><Lbl x={G.p(la, lo, rad)[0] + dx} y={G.p(la, lo, rad)[1] + dy} t={t} c={C.key} s={T.floor} a={a} o={o} italic={italic} /></g>;
/** how squarely a surface point faces the camera (1 ≥ 25° above the limb, 0 at 5°): labels leave before their point does */
export const facing = (G: GProj, la: number, lo: number): number => {
  const q = G.w(la, lo), c = G.camPos, d: V3 = [c[0] - q[0], c[1] - q[1], c[2] - q[2]], n = Math.hypot(...d) || 1;
  return clamp(((q[0] * d[0] + q[1] * d[1] + q[2] * d[2]) / n - 0.09) / 0.33, 0, 1);
};
/** local east at (lat, lon) in globe coordinates */
export const eastAt = (lo: number): V3 => [Math.cos(lo * D2R), 0, -Math.sin(lo * D2R)];
export { ll };

/** A spinning-globe camera path: lat/dist eased per segment; longitude unwrapped (no slerp, so a segment may run past 180°) and,
 * on a key with `spin: r`, interpolated with a trapezoidal speed profile (ramps of r of the segment at each end). Checked by
 * checks/cam_speed.mjs (same code). */
export type SpinKey = { f: number; lat: number; lon: number; dist: number; spin?: number; pp?: Pt };
export const trap = (u: number, r: number) => {
  const x = clamp(u, 0, 1), v = 1 / (1 - r);
  if (x < r) return (0.5 * v * x * x) / r;
  if (x > 1 - r) return 1 - (0.5 * v * (1 - x) * (1 - x)) / r;
  return v * (x - r / 2);
};
export const spinPath = (keys: SpinKey[], f: number): GlobeCam => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const A = keys[i - 1], B = keys[i];
    if (f <= B.f) {
      const u = (f - A.f) / Math.max(1, B.f - A.f), e = ease(u), tl = B.spin !== undefined ? trap(u, B.spin) : e;
      const pp: Pt | undefined = A.pp && B.pp ? [mix(A.pp[0], B.pp[0], e), mix(A.pp[1], B.pp[1], e)] : B.pp ?? A.pp;
      return { lat: mix(A.lat, B.lat, e), lon: mix(A.lon, B.lon, tl), dist: mix(A.dist, B.dist, e), pp };
    }
  }
  return keys[keys.length - 1];
};

// ---------------------------------------------------------------- face toolkit (TwoViewSlice: one item list, two views)
/** a flat face in globe coordinates: origin O, in-plane unit vectors U (screen right on the flat view) and V (screen up) */
export type Face = { O: V3; U: V3; V: V3 };
export const facePt = (F: Face, u: number, v: number): V3 => [F.O[0] + u * F.U[0] + v * F.V[0], F.O[1] + u * F.U[1] + v * F.V[1], F.O[2] + u * F.U[2] + v * F.V[2]];
/** the meridian face through lon (u along the equator line under lon, v up the axis) */
export const merFace = (lon: number): Face => ({ O: [0, 0, 0], U: ll(0, lon), V: [0, 1, 0] });
/** the equator face seen from above the North Pole (u towards x̂ = 0 N 0 E, v towards ŷ = 0 N 90 E) */
export const eqFace: Face = { O: [0, 0, 0], U: e2g([1, 0, 0]), V: e2g([0, 1, 0]) };
/** the disc of the parallel at lat (centre on the axis; u towards lon, v towards lon + 90 = east) */
export const latFace = (lat: number, lon: number): Face => ({ O: [0, Math.sin(lat * D2R), 0], U: ll(0, lon), V: ll(0, lon + 90) });
export type FP = (u: number, v: number) => Pt;
/** projector of a face for the 3-D view (through the globe camera) */
export const face3 = (G: GProj, F: Face): FP => (u, v) => G.pw(facePt(F, u, v));
/** projector of the same face drawn flat: centre c, radius R px for unit length */
export const faceFlat = (c: Pt, R: number): FP => (u, v) => [c[0] + u * R, c[1] - v * R];
/** an arc in face coordinates (angles from +u towards +v, degrees) */
export const faceArc = (P: FP, cu: number, cv: number, r: number, a0: number, a1: number, n = 48): string => {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) { const a = (a0 + ((a1 - a0) * i) / n) * D2R; pts.push(P(cu + r * Math.cos(a), cv + r * Math.sin(a))); }
  return poly(pts);
};
export const faceWedge = (P: FP, r: number, a0: number, a1: number, n = 48): string => `${faceArc(P, 0, 0, r, a0, a1, n)}L${P(0, 0)[0].toFixed(1)} ${P(0, 0)[1].toFixed(1)}Z`;
/** a right-angle tick at face point (u, v) between directions d1 and d2 (face units), size s (face units) */
export const faceTick = (P: FP, u: number, v: number, d1: [number, number], d2: [number, number], s: number): string => {
  const a = P(u + d1[0] * s, v + d1[1] * s), b = P(u + (d1[0] + d2[0]) * s, v + (d1[1] + d2[1]) * s), c = P(u + d2[0] * s, v + d2[1] * s);
  return `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}L${c[0].toFixed(1)} ${c[1].toFixed(1)}`;
};
/** the gold "same" pulse round the newest item, in both views at once (1 s) */
export const SameMark: React.FC<{ f: number; at: number; p: Pt }> = ({ f, at, p }) => {
  const u = (f - at) / 30;
  if (u < 0 || u > 1) return null;
  return <circle cx={p[0]} cy={p[1]} r={22 + 18 * u} fill="none" stroke={C.gold} strokeWidth={4} opacity={0.9 * Math.sin(Math.PI * u)} />;
};

// ---------------------------------------------------------------- arcs and arrow heads (SVG)
export const add = (p: Pt, v: Pt, s = 1): Pt => [p[0] + v[0] * s, p[1] + v[1] * s];
/** an arc of radius r about c from screen angle a0 to a1 (degrees, maths sense on screen: anticlockwise = negative SVG y) */
export const arcD = (c: Pt, r: number, a0: number, a1: number, n = 40) => {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) { const a = (a0 + ((a1 - a0) * i) / n) * D2R; pts.push([c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)]); }
  return poly(pts);
};
export const sang = (v: Pt) => Math.atan2(-v[1], v[0]) / D2R;
/** an open chevron head at the end of a path whose last direction is `dir` (screen) */
export const Chevron: React.FC<{ at: Pt; dir: Pt; c: string; o?: number; s?: number; w?: number }> = ({ at, dir, c, o = 1, s = 22, w = 5 }) => {
  if (o <= 0) return null;
  const n = Math.hypot(dir[0], dir[1]) || 1, ux = dir[0] / n, uy = dir[1] / n;
  const rot = (q: number): Pt => [-ux * Math.cos(q) + uy * Math.sin(q), -ux * Math.sin(q) - uy * Math.cos(q)];
  const h1 = rot(0.5), h2 = rot(-0.5);
  return <polyline points={`${at[0] + h1[0] * s},${at[1] + h1[1] * s} ${at[0]},${at[1]} ${at[0] + h2[0] * s},${at[1] + h2[1] * s}`} fill="none" stroke={c}
    strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={o} />;
};

/** a readout in the text column with a gold link that always leaves from the text's LEFT edge (build-1 K6 lesson). Lines stack
 * downward at 1.25 × size; anchor start. Place inside <Svg>. Order several of them like their targets (top to bottom). */
export const SideCallout: React.FC<{ f: number; lines: string[] | string; at: Pt; appear: number; out?: number; target: Pt | null; s?: number; c?: string;
  bend?: number; ctl?: Pt }> = ({ f, lines, at, appear, out, target, s = 54, c = C.key, bend = 30, ctl }) => {
  const LL = Array.isArray(lines) ? lines : [lines];
  LL.forEach((t) => guard(t, at[0], textW(t, s) * 0.97));
  const op = ramp(f, appear, appear + 8) * (out !== undefined ? 1 - ramp(f, out, out + 10) : 1);
  if (op <= 0) return null;
  return (
    <g opacity={op}>
      {LL.map((t, k) => <Lbl key={k} x={at[0]} y={at[1] + k * 1.25 * s} t={t} c={c} s={s} />)}
      {target ? <CurvedLink f={f} from={[at[0] - 14, at[1]]} to={target} start={appear + 6} bend={bend} ctl={ctl} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- maths-skip guidance (user rule 2026-11-05; storyboard skip_blocks)
/** mm:ss of the start of the FIRST sentence of scene `id` (the "If you skipped, here's what to keep" line) */
export const keepTime = (id: string) => {
  const q = sc[K(id)].sentences[0];
  if (!q.text.startsWith("If you skipped")) throw new Error(`${id}: first sentence is not the keep line`);
  const t = Math.floor(q.start), m = Math.floor(t / 60), ss = t % 60;
  return `${m}:${ss < 10 ? "0" : ""}${ss}`;
};
const CHIP_LINES = (to: string) => ["every step: optional", "not needed for the intuition", `skip to ${to}`];
const CHIP_S = T.floor, CHIP_LH = 52, CHIP_PAD = 18;
/** the chip's lifetime [appear, gone] (8 s from the words "skip ahead", 0.5-s fade) and its box */
export const chipSpan = (k: number): [number, number] => {
  const j = sc[k].sentences.findIndex((s) => s.text.includes("skip ahead"));
  if (j < 0) throw new Error(`${sc[k].id}: no "skip ahead" sentence`);
  const a = AT(k, j, "skip ahead");
  return [a, a + 240 + 15];
};
export const chipBox = (to: string) => {
  const w = Math.max(...CHIP_LINES(to).map((t) => textW(t, CHIP_S))) + 2 * CHIP_PAD;
  return { x: 1836 - w, y: 54, w, h: 3 * CHIP_LH + 2 * CHIP_PAD - 8 };
};
/** The skip chip (the user's one explicit exception to "no boxes"): top-right of the column, 44 px warm white on a 20 % gold fill,
 * no border, three lines, on the words "skip ahead" for 8 s, 0.5-s fade. Never over the picture (the column only). */
export const SkipChip: React.FC<{ f: number; k: number; to: string }> = ({ f, k, to }) => {
  const [a] = chipSpan(k);
  const L = CHIP_LINES(to), B = chipBox(to);
  const o = ramp(f, a, a + 15) * (1 - ramp(f, a + 240, a + 255));
  if (o <= 0) return null;
  return (
    <Svg>
      <g opacity={o}>
        <rect x={B.x} y={B.y} width={B.w} height={B.h} rx={22} fill={C.gold} fillOpacity={0.2} />
        {L.map((t, i) => <Lbl key={i} x={B.x + CHIP_PAD} y={B.y + CHIP_PAD + 22 + i * CHIP_LH} t={t} c={C.key} s={CHIP_S} />)}
      </g>
    </Svg>
  );
};
/** The keep line's takeaway keyword (storyboard skip_blocks takeaway_keyword): at the top of the column during the "If you skipped"
 * sentences (S0-S`last`), 54 px warm white with a gold underline under its last line; it then fades out (≥ 8 frames before the
 * next text in its slot). */
export const KeepLine: React.FC<{ f: number; k: number; lines: string[]; last?: number; x?: number; y?: number }> = ({ f, k, lines, last = 1, x = XC, y = 110 }) => {
  const a = 0, b = SE(k, last);
  const o = ramp(f, a, a + 8) * (1 - ramp(f, b, b + 10));
  if (o <= 0) return null;
  const wl = textW(lines[lines.length - 1], T.key);
  const yl = y + (lines.length - 1) * 68 + 36;
  return (
    <Svg>
      <g opacity={o}>
        {lines.map((t, i) => <Lbl key={i} x={x} y={y + i * 68} t={t} c={C.key} s={T.key} />)}
        <line x1={x} y1={yl} x2={x + wl * clamp((f - a - 6) / 14, 0, 1)} y2={yl} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
      </g>
    </Svg>
  );
};
/** the frame at which the keep line has gone (for the next text in the top slot: keep the 8-frame swap gap) */
export const keepGone = (k: number, last = 1) => SE(k, last) + 10;

// ---------------------------------------------------------------- colour bar (beside the picture, in the text column)
export const ColourBar: React.FC<{ x: number; y: number; w: number; lut: string[]; ticks: { v: number; t: string }[]; lo: number; hi: number; unit?: string; o?: number;
  title?: string }> = ({ x, y, w, lut, ticks, lo, hi, unit, o = 1, title }) =>
  o <= 0 ? null : (
    <g opacity={o} data-k6-cbar="1">
      {title ? <Lbl x={x} y={y - 34} t={title} c={C.muted} s={44} b={false} /> : null}
      {Array.from({ length: 60 }, (_, i) => <rect key={i} x={x + (i * w) / 60} y={y} width={w / 60 + 0.8} height={24} fill={lutCss(lut, (i + 0.5) / 60)} />)}
      <rect x={x} y={y} width={w} height={24} fill="none" stroke={C.muted} strokeWidth={2} />
      {ticks.map((tk) => <Lbl key={tk.t} x={x + ((tk.v - lo) / (hi - lo)) * w} y={y + 56} t={tk.t} c={C.muted} s={48} a="middle" b={false} />)}
      {unit ? <Lbl x={x + w + 18} y={y + 12} t={unit} c={C.muted} s={48} b={false} /> : null}
    </g>
  );

// ---------------------------------------------------------------- icons (code-drawn, illustrative)
export const Balloon: React.FC<{ p: Pt; s?: number; o?: number }> = ({ p, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <ellipse cx={p[0]} cy={p[1] - 62 * s} rx={26 * s} ry={30 * s} fill="#eef2f8" stroke={C.bg} strokeWidth={3} />
    <line x1={p[0]} y1={p[1] - 32 * s} x2={p[0]} y2={p[1] - 8 * s} stroke={C.ink} strokeWidth={2.5} />
    <rect x={p[0] - 10 * s} y={p[1] - 8 * s} width={20 * s} height={16 * s} fill={C.second} stroke={C.bg} strokeWidth={2} />
  </g>
);
export const Thermo: React.FC<{ x: number; y: number; level: number; c: string; o?: number }> = ({ x, y, level, c, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <rect x={x - 12} y={y - 110} width={24} height={110} rx={12} fill="#1d2740" stroke={C.ink} strokeWidth={3} />
    <rect x={x - 6} y={y - 10 - 90 * level} width={12} height={90 * level + 10} rx={6} fill={c} />
    <circle cx={x} cy={y + 8} r={20} fill={c} stroke={C.ink} strokeWidth={3} />
  </g>
);
/** a small code-drawn station: a mast with three arrows (east, north, up) and a question mark (the Part 4 teaser) */
export const PlaneIcon: React.FC<{ p: Pt; a?: number; s?: number; o?: number; c?: string }> = ({ p, a = 0, s = 1, o = 1, c = C.ink }) => o <= 0 ? null : (
  <g opacity={o} transform={`translate(${p[0]} ${p[1]}) rotate(${-a}) scale(${s})`}>
    <path d="M 34 0 L 12 -4 L -2 -28 L -11 -28 L -4 -4 L -22 -4 L -28 -15 L -34 -15 L -30 0 L -34 15 L -28 15 L -22 4 L -4 4 L -11 28 L -2 28 L 12 4 Z"
      fill={c} stroke={C.bg} strokeWidth={3} />
  </g>
);
export const textPx = (t: string, s: number) => textW(t, s);
export { Arrow, Svg, clamp, textW, FONT };

/** split a 3-D polyline on the sphere into runs facing the camera (front) and hidden behind the globe (back) */
export const splitVis = (G: GProj, pts: V3[]): { front: Pt[][]; back: Pt[][] } => {
  const front: Pt[][] = [], back: Pt[][] = [];
  let cur: Pt[] = [], curV: boolean | null = null;
  const c = G.camPos;
  for (const q of pts) {
    const v = q[0] * (c[0] - q[0]) + q[1] * (c[1] - q[1]) + q[2] * (c[2] - q[2]) > 0.002;
    const s = G.pw(q);
    if (curV === null || v === curV) cur.push(s);
    else { cur.push(s); (curV ? front : back).push(cur); cur = [s]; }
    curV = v;
  }
  if (cur.length > 1 && curV !== null) (curV ? front : back).push(cur);
  return { front, back };
};
