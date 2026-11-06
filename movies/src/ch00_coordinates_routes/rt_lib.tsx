// Shared pieces of the ch00_coordinates_routes movie (#5f, Coordinates Part 6 "Routes"): timing from timing.json (SS/SE/AT as
// in the reference movie DotProductWhy.tsx), the scene wrapper, the data (rt.json from movies/data/build_ch00_coordinates_routes.py,
// 42 CHECK rows), the WebGL globe (kit_rt, copied from Part 4's kit_fr) with whole / half-Earth meshes, overlays projected through
// the same camera, an SVG orthographic mini globe (recap, thumbnails), the Mercator chart (NE 50 m land), compass dials, the
// SideCallout, the maths-skip chip and its corner tag, a KaTeX width guard (text ends before x 1842) and code-drawn icons.
// Adapted from Part 4 (src/ch00_coordinates_frames/fr_lib.tsx). Everything is a pure function of the frame and the data.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { ramp } from "../house";
import timing from "../../ch00/ch00_coordinates_routes/timing.json";
import rtJ from "../../ch00/ch00_coordinates_routes/data/rt.json";
import { C, T } from "../house/kit/type";
import { Arrow, Lbl as HLbl, Pt, Svg, clamp, textW } from "../house/kit/draw";
import { Keyword as HKeyword } from "../house/kit/notes";
import { CurvedLink } from "../house/kit/extras";
import { CalcRow, CalcStack as HCalcStack, Layered as HLayered, Part, Layer, TeX as HTeX, plainOf } from "../house/kit/tex";
import { GlobeCam, GlobeMesh, GProj, HalfEarthMesh, coastPath, globeCam, globeProj, useTex, Graticule, llPath, ll, enAt } from "./kit_rt/globe";
import { View3D } from "./kit_rt/three3d";
import { V3 } from "./kit_rt/cam";

export const FPS = 30;
type Snt = { text: string; start: number; end: number };
type Scn = { id: string; start: number; end: number; sentences: Snt[] };
export const sc = (timing as unknown as { scenes: Scn[]; total_frames: number }).scenes;
export const HOLD = 75;
export const XF = 10;
export const RT_FRAMES = (timing as unknown as { total_frames: number }).total_frames + HOLD;
const IDS = sc.map((s) => s.id);
export const K = (id: string) => { const k = IDS.indexOf(id); if (k < 0) throw new Error(`no scene ${id}`); return k; };
export const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
export const END = [...CUT.slice(1), RT_FRAMES];
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
export const poly = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
/** a number with a true minus sign and fixed decimals */
export const nf = (v: number, d = 1, plus = false) => `${v < 0 ? "−" : plus && v > 0 ? "+" : ""}${Math.abs(v).toFixed(d)}`;
export const D2R = Math.PI / 180;
export const XC = 1100;                   // left edge of the maths column
export const XMAX = 1840;                 // text must end before x 1842

export const Scene: React.FC<{ children: React.ReactNode; fadeIn?: boolean }> = ({ children, fadeIn = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.bg, opacity: fadeIn ? ramp(f, 0, XF) : 1 }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- data and assets
/* eslint-disable @typescript-eslint/no-explicit-any */
export const D = rtJ as any;
export const IMGS = { bmng: staticFile("rt_bmng.jpg") };
export const ASSET_NAMES = ["rt_bmng.jpg"];
export const LON: [number, number] = D.places.london, LAX: [number, number] = D.places.la, BREST: [number, number] = D.places.brest,
  LIS: [number, number] = D.places.lisbon, LYB: [number, number] = D.places.lyb;
export const RO = D.route, RH = D.rhumb;
export type LL = [number, number];
export const GC: LL[] = (RO.gc[0] as number[]).map((la, i) => [la, RO.gc[1][i]] as LL);
export const RHP: LL[] = (RH.lat as number[]).map((la, i) => [la, RH.lon[i]] as LL);
export const SLATE = C.local;             // the rhumb line (storyboard colour contract)
export const SRC_G = "Image: NASA Blue Marble Next Generation";
/** hats in KaTeX (never a combining hat in a text label) */
export const H = {
  r: String.raw`\hat{\mathbf r}`, r1: String.raw`\hat{\mathbf r}_1`, r2: String.raw`\hat{\mathbf r}_2`, th: String.raw`\hat{\boldsymbol\theta}`,
  i: String.raw`\hat{\mathbf i}`, j: String.raw`\hat{\mathbf j}`, k: String.raw`\hat{\mathbf k}`,
};

// ---------------------------------------------------------------- KaTeX width guard (text ends before x 1842)
/** a rough, slightly generous width of a KaTeX string at effective size s (as fr_lib); used only as a layout guard */
export const texW = (src: string, s: number): number => {
  let i = 0;
  const str = src.replace(/\\displaystyle|\\left|\\right|\\Big|\\big/g, "");
  const group = (): number => {
    if (str[i] !== "{") { const w0 = atom(); return w0; }
    i++; let w = 0; while (i < str.length && str[i] !== "}") w += atom(); i++; return w;
  };
  const atom = (): number => {
    const ch = str[i];
    if (ch === "\\") {
      const m = /^\\([a-zA-Z]+|.)/.exec(str.slice(i)); const cmd = m ? m[1] : ""; i += cmd.length + 1;
      if (cmd === "frac" || cmd === "dfrac") { const a = group(), b = group(); return Math.max(a, b) + 0.2; }
      if (cmd === "text" || cmd === "mathrm") { const j = str.indexOf("}", i); const t = str.slice(i + 1, j); i = j + 1; return t.length * 0.5; }
      if (cmd === "hat" || cmd === "mathbf" || cmd === "boldsymbol" || cmd === "underbrace" || cmd === "cancel" || cmd === "textcolor") {
        if (cmd === "textcolor") { group(); } return group(); }
      if (cmd === "qquad") return 2; if (cmd === "quad") return 1; if (cmd === ",") return 0.17; if (cmd === " " || cmd === ";") return 0.28;
      if (cmd === "approx" || cmd === "equiv" || cmd === "neq" || cmd === "Rightarrow" || cmd === "to" || cmd === "longrightarrow" || cmd === "times" || cmd === "cdot" || cmd === "div" || cmd === "leftrightarrow") return 1.3;
      if (cmd === "cos" || cmd === "sin" || cmd === "tan") return 1.5;
      if (cmd === "sqrt") return group() + 0.9;
      if (cmd === "rm") return 0;
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
export const guard = (what: string, x0: number, w: number) => {
  if (x0 + w > 1842) throw new Error(`text "${what.slice(0, 50)}" ends at x ${Math.round(x0 + w)} (> 1842)`);
  if (x0 < 38) throw new Error(`text "${what.slice(0, 50)}" starts at x ${Math.round(x0)} (< 38)`);
};
/** split a TeX string before each separator (the separator starts the next piece); every separator must exist in order */
export const pieces = (s: string, seps: string[]): string[] => {
  const out: string[] = []; let rest = s;
  for (const sp of seps) { const i = rest.indexOf(sp); if (i <= 0) throw new Error(`pieces: "${sp}" not in "${rest}"`); out.push(rest.slice(0, i)); rest = rest.slice(i); }
  out.push(rest); return out;
};
/** house TeX with the edge guard (ax = 0 or 0.5 or 1 as in the house component) */
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
// Part 1 lessons C2 (2026-11-05): every fraction is a \dfrac (display size, >= 44 px). A row whose TeX has a \dfrac and no explicit
// `h` is ~2.4x its type size tall, not the house 1.42x (Part 2's K6 found fraction rows printed over the next row). The regex tests the
// literal backslash (`\\` in a JS regex; checklist C4). Static guard: the stack's lowest visible line must end above the caption band.
const FRAC_ROW = /\\dfrac/;
const rowTex = (r: CalcRow) => `${r.lhs ? sideStr(r.lhs) : ""}${sideStr(r.rhs)}`;
const withFracH = (rows: CalcRow[], size: number): CalcRow[] => rows.map((r) => (r.h !== undefined || !FRAC_ROW.test(rowTex(r)) ? r : { ...r, h: (r.size ?? size) * 2.4 }));
const stackBottomGuard = (rows: CalcRow[], y: number, size: number, maxLines: number) => {
  const H: number[] = [];
  rows.forEach((r, i) => { const h = r.h ?? (r.size ?? size) * 1.42; if (i === 0 || !r.cont) H.push(h); else H[H.length - 1] += h; });
  for (let j = 0; j < H.length; j++) {
    const bottom = y + H.slice(Math.max(0, j - maxLines + 1), j + 1).reduce((s, h) => s + h, 0);
    if (bottom > 878) throw new Error(`CalcStack at y ${y}: line ${j} ("${rowTex(rows.filter((r, i) => i === 0 || !r.cont)[j]).slice(0, 40)}") ends at y ${Math.round(bottom)} (caption band from 880)`);
  }
};
/** house CalcStack with the right-edge guard (row rhs starts at x) */
export const CalcStack: React.FC<React.ComponentProps<typeof HCalcStack>> = (p) => {
  p.rows.forEach((r) => guard(sideStr(r.rhs), p.x, texW(sideStr(r.rhs), r.size ?? p.size ?? 68)));
  p.rows.forEach((r) => { if (r.lhs) { const ls = sideStr(r.lhs), w = texW(ls, r.size ?? p.size ?? 68); guard(ls, p.x - w - 14, w); } });
  const rows = withFracH(p.rows, p.size ?? 68);
  stackBottomGuard(rows, p.y, p.size ?? 68, p.maxLines ?? 3);
  return <HCalcStack {...p} rows={rows} />;
};
/** the house SVG label with the edge guard */
export const Lbl: React.FC<React.ComponentProps<typeof HLbl>> = (p) => {
  const s = p.s ?? 54, w = textW(p.t, s), a = p.a ?? "start";
  guard(p.t, a === "start" ? p.x : a === "end" ? p.x - w : p.x - w / 2, w * 0.97);
  return <HLbl {...p} />;
};
/** the house Keyword with the edge guard */
export const Keyword: React.FC<React.ComponentProps<typeof HKeyword>> = (p) => {
  const s = p.s ?? 54, w = textW(p.text, s), a = p.a ?? "start";
  guard(p.text, a === "start" ? p.at[0] : a === "end" ? p.at[0] - w : p.at[0] - w / 2, w * 0.97);
  return <HKeyword {...p} />;
};

// ---------------------------------------------------------------- globe (three.js, kit_rt)
export const GB = { x: 60, y: 28, w: 960, h: 790 };   // the house globe frame for unzoomed scenes (globe ≥ 760 px across at dist 3.4)
/** Earth axes (x̂ to 0 N 0 E, ŷ to 0 N 90 E, ẑ to the North Pole) → the kit's Y-up globe coordinates */
export const e2g = (v: number[]): V3 => [v[1], v[2], v[0]];
export const globeG = (cam: GlobeCam, box = GB): GProj => {
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  return globeProj(st, box.w, box.h, box.x, box.y);
};
export type MeshKind = "whole" | { half: number; slide: number; whole?: number };
export const Globe: React.FC<{ cam: GlobeCam; box?: { x: number; y: number; w: number; h: number }; coast?: number; o?: number; meshO?: number; dim?: number; grat?: number;
  over?: (G: GProj) => React.ReactNode; mesh?: MeshKind; gratStep?: number }> = ({
  cam, box = GB, coast = 0.4, o = 1, meshO = 1, dim = 1, over, grat = 0, mesh = "whole", gratStep = 30 }) => {
  const tex = useTex(IMGS.bmng);
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  const G = globeProj(st, box.w, box.h, box.x, box.y);
  if (o <= 0) return null;
  const id = `gc${box.x}_${box.y}_${box.w}`;
  const half = typeof mesh === "object" ? mesh : null;
  return (
    <AbsoluteFill>
      {/* the SSR check (--3d) renders the 3-D tree without a texture so the THREE-tag guard sees it */}
      <View3D st={st} x={box.x} y={box.y} w={box.w} h={box.h} o={(tex || (globalThis as { __R3?: number }).__R3 ? o : 0) * meshO} key3={st.pos} amb={1.6} dir={1.4}>
        {half ? <HalfEarthMesh tex={tex} lon0={half.half} slide={half.slide} whole={half.whole ?? 0} /> : <GlobeMesh tex={tex} dim={dim} />}
      </View3D>
      <Svg o={o}>
        <defs><clipPath id={id}><rect x={box.x} y={box.y} width={box.w} height={box.h} /></clipPath></defs>
        <g clipPath={`url(#${id})`}>
          {grat > 0 ? <Graticule G={G} step={gratStep} o={grat} /> : null}
          {coast > 0 && !half ? <path d={coastPath(G, D.lines.globe110)} fill="none" stroke={C.key} strokeOpacity={coast} strokeWidth={1.6} /> : null}
          {over ? over(G) : null}
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
/** the silhouette disc of a globe view (for the K1 mask and for placing the text column clear of it) */
export const discOf = (cam: GlobeCam, box = GB): { c: Pt; r: number } => {
  const G = globeG(cam, box);
  const c = G.pw([0, 0, 0]);
  const fov = cam.fov ?? 35, r = (box.h / 2) * Math.tan(Math.asin(1 / Math.max(1.0001, cam.dist))) / Math.tan((fov / 2) * D2R);
  return { c, r };
};
/** a surface dot on the globe (hidden behind the limb) */
export const gdot = (G: GProj, la: number, lo: number, c: string = C.gold, r = 10, o = 1) => (o <= 0 || !G.vis(la, lo) ? null :
  <circle cx={G.p(la, lo)[0]} cy={G.p(la, lo)[1]} r={r} fill={c} stroke={C.bg} strokeWidth={4} opacity={o} />);
export const gseg = (G: GProj, a: V3, b: V3, c: string, w = 8, o = 1, dash?: string) => o <= 0 ? null :
  <line x1={G.pw(a)[0]} y1={G.pw(a)[1]} x2={G.pw(b)[0]} y2={G.pw(b)[1]} stroke={c} strokeWidth={w} strokeLinecap="round" opacity={o} strokeDasharray={dash} />;
export const garrow = (G: GProj, a: V3, b: V3, c: string, w = 8, head = 30, o = 1) => <Arrow p={G.pw(a)} q={G.pw(b)} color={c} w={w} head={head} o={o} />;
/** an outlined place name at a spot on the globe (house K6 spot-label class) */
export const plab = (G: GProj, la: number, lo: number, t: string, o = 1, dx = 16, dy = 0, a: "start" | "middle" | "end" = "start", italic = false) =>
  o <= 0 || !G.vis(la, lo) ? null : <g data-lc-maplabel="1"><Lbl x={G.p(la, lo)[0] + dx} y={G.p(la, lo)[1] + dy} t={t} c={C.key} s={T.floor} a={a} o={o} italic={italic} /></g>;
/** how squarely a surface point faces the camera (1 ≥ 25° above the limb, 0 at 5°): labels leave before their point does */
export const facing = (G: GProj, la: number, lo: number): number => {
  const q = G.w(la, lo), c = G.camPos, d: V3 = [c[0] - q[0], c[1] - q[1], c[2] - q[2]], n = Math.hypot(...d) || 1;
  return clamp(((q[0] * d[0] + q[1] * d[1] + q[2] * d[2]) / n - 0.09) / 0.33, 0, 1);
};
/** a route (lat/lon points) on the globe, drawn up to `upto` (0..1), hidden behind the limb; back part optional (faint dash) */
export const Route: React.FC<{ G: GProj; pts: LL[]; c: string; w?: number; o?: number; upto?: number; dash?: string; r?: number }> = ({ G, pts, c, w = 7, o = 1, upto = 1, dash, r = 1.004 }) => {
  if (o <= 0 || upto <= 0) return null;
  const n = Math.max(2, Math.round(pts.length * clamp(upto, 0, 1)));
  const d = llPath(G, pts.slice(0, n), r);
  return <g opacity={o}><path d={d} fill="none" stroke={C.bg} strokeWidth={w + 5} strokeLinecap="round" strokeOpacity={0.6} />
    <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} /></g>;
};
/** points along a route at fraction t (0..1), with the screen heading of the plane glyph (maths sense, degrees) */
export const along = (G: GProj, pts: LL[], t: number): { p: Pt; a: number; vis: boolean } => {
  const n = pts.length - 1, x = clamp(t, 0, 1) * n, i = Math.min(n - 1, Math.floor(x)), u = x - i;
  const la = mix(pts[i][0], pts[i + 1][0], u), lo = mix(pts[i][1], pts[i + 1][1], u);
  const p = G.p(la, lo, 1.012), q = G.p(pts[i + 1][0], pts[i + 1][1], 1.012), b = G.p(pts[i][0], pts[i][1], 1.012);
  return { p, a: Math.atan2(-(q[1] - b[1]), q[0] - b[0]) / D2R, vis: G.vis(la, lo) };
};
export { enAt, ll, llPath };

// ---------------------------------------------------------------- SVG orthographic mini globe (recap, thumbnails, s03)
export type Ortho = { c: Pt; R: number; p: (la: number, lo: number) => Pt; vis: (la: number, lo: number) => boolean; pv: (v: number[]) => Pt };
/** orthographic view centred on (lat0, lon0), north up: screen x = east, y = down */
export const ortho = (lat0: number, lon0: number, c: Pt, R: number): Ortho => {
  const p0 = lat0 * D2R, l0 = lon0 * D2R;
  const E = [-Math.sin(l0), Math.cos(l0), 0], N = [-Math.sin(p0) * Math.cos(l0), -Math.sin(p0) * Math.sin(l0), Math.cos(p0)],
    U = [Math.cos(p0) * Math.cos(l0), Math.cos(p0) * Math.sin(l0), Math.sin(p0)];
  const xyz = (la: number, lo: number) => [Math.cos(la * D2R) * Math.cos(lo * D2R), Math.cos(la * D2R) * Math.sin(lo * D2R), Math.sin(la * D2R)];
  const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const pv = (v: number[]): Pt => [c[0] + R * dot(v, E), c[1] - R * dot(v, N)];
  return { c, R, pv, p: (la, lo) => pv(xyz(la, lo)), vis: (la, lo) => dot(xyz(la, lo), U) > 0.01 };
};
export const opath = (O: Ortho, pts: LL[]): string => {
  let d = "", pen = false;
  for (const [la, lo] of pts) { if (!O.vis(la, lo)) { pen = false; continue; } const q = O.p(la, lo); d += `${pen ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`; pen = true; }
  return d;
};
export const OrthoGlobe: React.FC<{ O: Ortho; o?: number; grat?: number; coast?: number; stroke?: string }> = ({ O, o = 1, grat = 0.35, coast = 0.7, stroke = C.grid }) => {
  if (o <= 0) return null;
  let g = "";
  for (let la = -60; la <= 60; la += 30) g += opath(O, Array.from({ length: 73 }, (_, i) => [la, -180 + 5 * i] as LL));
  for (let lo = -180; lo < 180; lo += 30) g += opath(O, Array.from({ length: 37 }, (_, i) => [-90 + 5 * i, lo] as LL));
  let cst = "";
  for (const ln of D.lines.globe110 as number[][]) { const pts: LL[] = []; for (let q = 0; q < ln.length; q += 2) pts.push([ln[q + 1], ln[q]]); cst += opath(O, pts); }
  return (
    <g opacity={o}>
      <circle cx={O.c[0]} cy={O.c[1]} r={O.R} fill="#1f2c48" stroke={stroke} strokeWidth={3} />
      <path d={g} fill="none" stroke={C.muted} strokeOpacity={grat} strokeWidth={1.5} />
      <path d={cst} fill="none" stroke={C.key} strokeOpacity={coast} strokeWidth={1.8} />
    </g>
  );
};

// ---------------------------------------------------------------- the Mercator chart (NE 50 m land, data in rt.json: x = λ, y = ψ, a = 1)
export type MBox = { x: number; y: number; w: number; h: number };
export type MExt = { x0: number; x1: number; y0: number; y1: number };     // radians of longitude, ψ
/** uniform-scale Mercator projector into a box (conformal: the same scale both ways; the box height follows the extent) */
export const mercP = (B: MBox, E: MExt) => {
  const s = B.w / (E.x1 - E.x0);
  return { s, h: (E.y1 - E.y0) * s, P: (x: number, y: number): Pt => [B.x + (x - E.x0) * s, B.y + (E.y1 - y) * s] };
};
export const flatPath = (P: (x: number, y: number) => Pt, flat: number[], close = false) => {
  let d = ""; for (let i = 0; i < flat.length; i += 2) { const q = P(flat[i], flat[i + 1]); d += `${i ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`; }
  return close ? d + "Z" : d;
};
export const MercMap: React.FC<{ id: string; B: MBox; E: MExt; o?: number; over?: (P: (x: number, y: number) => Pt) => React.ReactNode; inside?: (P: (x: number, y: number) => Pt) => React.ReactNode }> = ({
  id, B, E, o = 1, over, inside }) => {
  if (o <= 0) return null;
  const M = mercP(B, E), h = M.h;
  const land = (D.mc.land as number[][]).filter((f) => { for (let i = 0; i < f.length; i += 2) if (f[i] > E.x0 - 0.3 && f[i] < E.x1 + 0.3 && f[i + 1] > E.y0 - 0.3 && f[i + 1] < E.y1 + 0.3) return true; return false; });
  let grat = "";
  for (let lo = -180; lo <= 180; lo += 30) { const x = lo * D2R; if (x > E.x0 && x < E.x1) { const a = M.P(x, E.y0), b = M.P(x, E.y1); grat += `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`; } }
  for (let la = -60; la <= 75; la += 15) { const y = Math.log(Math.tan(Math.PI / 4 + (la * D2R) / 2)); if (y > E.y0 && y < E.y1) { const a = M.P(E.x0, y), b = M.P(E.x1, y); grat += `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`; } }
  return (
    <g opacity={o}>
      <defs><clipPath id={`mc_${id}`}><rect x={B.x} y={B.y} width={B.w} height={h} /></clipPath></defs>
      <rect x={B.x} y={B.y} width={B.w} height={h} fill="#1d2a44" />
      <g clipPath={`url(#mc_${id})`}>
        {land.map((f, i) => <path key={i} d={flatPath(M.P, f, true)} fill="#33405e" stroke={C.key} strokeOpacity={0.55} strokeWidth={1.4} />)}
        <path d={grat} fill="none" stroke={C.muted} strokeOpacity={0.25} strokeWidth={1.2} />
        {inside ? inside(M.P) : null}
      </g>
      <rect x={B.x} y={B.y} width={B.w} height={h} fill="none" stroke={C.grid} strokeWidth={3} />
      {over ? over(M.P) : null}
    </g>
  );
};
export const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * D2R) / 2));
/** the box of a Mercator chart (for SourceBelow and layout) */
export const mercBox = (B: MBox, E: MExt): MBox => ({ ...B, h: mercP(B, E).h });

// ---------------------------------------------------------------- compass dial (bearing clockwise from north, as seen from above)
export const Compass: React.FC<{ c: Pt; r: number; brg: number; o?: number; col?: string; arc?: boolean; label?: boolean }> = ({ c, r, brg, o = 1, col = C.gold, arc = true, label = true }) => {
  if (o <= 0) return null;
  const dir = (b: number): Pt => [Math.sin(b * D2R), -Math.cos(b * D2R)];
  const tip: Pt = [c[0] + dir(brg)[0] * r * 0.86, c[1] + dir(brg)[1] * r * 0.86];
  const ap = (b: number, rr: number): Pt => [c[0] + dir(b)[0] * rr, c[1] + dir(b)[1] * rr];
  const steps = Math.max(2, Math.round(brg / 4));
  const arcD = Array.from({ length: steps + 1 }, (_, i) => ap((brg * i) / steps, r * 0.42)).map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join("");
  return (
    <g opacity={o}>
      <circle cx={c[0]} cy={c[1]} r={r} fill="#1f2a44" stroke={C.muted} strokeWidth={3} />
      {[0, 90, 180, 270].map((b) => { const a = ap(b, r * 0.82), q = ap(b, r); return <line key={b} x1={a[0]} y1={a[1]} x2={q[0]} y2={q[1]} stroke={C.muted} strokeWidth={3} />; })}
      {label ? <Lbl x={c[0]} y={c[1] - r - 30} t="N" c={C.muted} s={T.floor} a="middle" /> : null}
      {arc ? <path d={arcD} fill="none" stroke={C.gold} strokeWidth={5} /> : null}
      <Arrow p={c} q={tip} color={col} w={7} head={24} />
      <circle cx={c[0]} cy={c[1]} r={6} fill={C.key} />
    </g>
  );
};

// ---------------------------------------------------------------- the face-on slice (Part 1's circle): centre, radius, arrow angles
export type DiscV = { c: Pt; R: number; a1: number; a2: number };   // a1, a2 = screen angles (maths sense, degrees) of r̂₁, r̂₂
export const dP = (V: DiscV, a: number, r = V.R): Pt => [V.c[0] + r * Math.cos(a * D2R), V.c[1] - r * Math.sin(a * D2R)];
/** an arc of radius r about c from screen angle a0 to a1 (maths sense) */
export const arcD = (c: Pt, r: number, a0: number, a1: number, n = 48) => {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) { const a = (a0 + ((a1 - a0) * i) / n) * D2R; pts.push([c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)]); }
  return poly(pts);
};
/** the face-on disc: rim (gold), centre dot, r̂₁ (ink, Part 1 lessons D1) and r̂₂ (orange) to the rim; σ arc and the route arc optional */
export const Disc: React.FC<{ V: DiscV; o?: number; a1o?: number; a2o?: number; sig?: number; route?: number; rim?: number; fill?: number; sw?: number }> = ({
  V, o = 1, a1o = 1, a2o = 1, sig = 0, route = 0, rim = 1, fill = 0.12, sw = 1 }) => {
  if (o <= 0) return null;
  const da = V.a2 - V.a1;
  return (
    <g opacity={o}>
      <circle cx={V.c[0]} cy={V.c[1]} r={V.R} fill={C.key} fillOpacity={fill} stroke={C.gold} strokeWidth={4 * sw} strokeOpacity={rim} />
      {route > 0 ? <path d={arcD(V.c, V.R, V.a1, V.a1 + da * clamp(route, 0, 1))} fill="none" stroke={C.gold} strokeWidth={12 * sw} strokeLinecap="round" /> : null}
      {a1o > 0 ? <Arrow p={V.c} q={dP(V, V.a1)} color={C.ink} w={10 * sw} head={40 * sw} o={a1o} /> : null}
      {a2o > 0 ? <Arrow p={V.c} q={dP(V, V.a2)} color={C.second} w={10 * sw} head={40 * sw} o={a2o} /> : null}
      {sig > 0 ? <path d={arcD(V.c, V.R * 0.3, V.a1, V.a1 + da * clamp(sig, 0, 1))} fill="none" stroke={C.gold} strokeWidth={6 * sw} /> : null}
      <circle cx={V.c[0]} cy={V.c[1]} r={9 * sw} fill={C.key} stroke={C.bg} strokeWidth={3} />
    </g>
  );
};
export const scaleDisc = (V: DiscV, c: Pt, R: number): DiscV => ({ c, R, a1: V.a1, a2: V.a2 });

// ---------------------------------------------------------------- SideCallout (links always from the text's LEFT edge; build-1 K6 lesson)
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

// ---------------------------------------------------------------- maths-skip guidance (user rule 2026-11-05; storyboard maths_skip)
/** mm:ss of the start of the takeaway scene (its FIRST sentence is the "If you skipped" keep line) */
export const skipTo = (id: string) => {
  const s = sc[K(id)];
  if (!s.sentences[0].text.startsWith("If you skipped")) throw new Error(`${id}: first sentence is not the keep line`);
  const t = Math.floor(s.start), m = Math.floor(t / 60), ss = t % 60;
  return `${m}:${ss < 10 ? "0" : ""}${ss}`;
};
export const CHIP = { x0: 1330, x1: 1836, y0: 40, y1: 156 };     // the full chip (two lines at the 44-px floor; one line does not fit 340 px)
export const TAG = { x0: 1486, x1: 1836, y0: 46, y1: 110 };      // the small corner tag for the rest of the block
/** The skip chip (the user's explicit exception to "no boxes"): top-right of the column from the words "skip ahead" for 6 s
 * (and at least until that sentence ends), then it shrinks into the corner tag "optional maths", kept until the block ends. */
export const SkipChip: React.FC<{ f: number; k: number; to: string; tagTo?: number }> = ({ f, k, to, tagTo }) => {
  const j = sc[k].sentences.findIndex((s) => s.text.includes("skip ahead"));
  if (j < 0) throw new Error(`${sc[k].id}: no "skip ahead" sentence`);
  const a = AT(k, j, "skip ahead"), b = Math.max(a + 180, SE(k, j));
  const lines = ["every step · optional", `skip to ${to}`];
  lines.forEach((t) => guard(t, CHIP.x0 + 22, textW(t, T.floor)));
  if (textW(lines[0], T.floor) > CHIP.x1 - CHIP.x0 - 40) throw new Error("skip chip text wider than the chip");
  const oC = ramp(f, a, a + 10) * (1 - ramp(f, b, b + 10));
  return <>
    {oC > 0 ? <g opacity={oC}>
      <rect x={CHIP.x0} y={CHIP.y0} width={CHIP.x1 - CHIP.x0} height={CHIP.y1 - CHIP.y0} rx={20} fill="#1f2a44" stroke={C.gold} strokeWidth={3} />
      {lines.map((t, i) => <Lbl key={i} x={CHIP.x0 + 22} y={CHIP.y0 + 34 + i * 50} t={t} c={i === 1 ? C.gold : C.key} s={T.floor} />)}
    </g> : null}
    <OptionalTag f={f} from={b + 6} to={tagTo} />
  </>;
};
export const chipSpan = (k: number): [number, number] => {
  const j = sc[k].sentences.findIndex((s) => s.text.includes("skip ahead"));
  const a = AT(k, j, "skip ahead"), b = Math.max(a + 180, SE(k, j));
  return [a, b + 10];
};
/** the corner tag "optional maths" (s08 after the chip, all of s09 and s10) */
export const OptionalTag: React.FC<{ f: number; from: number; to?: number }> = ({ f, from, to }) => {
  const o = ramp(f, from, from + 10) * (to !== undefined ? 1 - ramp(f, to, to + 10) : 1);
  if (o <= 0) return null;
  guard("optional maths", TAG.x0 + 18, textW("optional maths", T.floor));
  return (
    <g opacity={o}>
      <rect x={TAG.x0} y={TAG.y0} width={TAG.x1 - TAG.x0} height={TAG.y1 - TAG.y0} rx={16} fill="#1f2a44" stroke={C.gold} strokeWidth={2.5} />
      <Lbl x={TAG.x0 + 18} y={(TAG.y0 + TAG.y1) / 2} t="optional maths" c={C.key} s={T.floor} />
    </g>
  );
};

// ---------------------------------------------------------------- icons (code-drawn, illustrative)
export const PlaneIcon: React.FC<{ p: Pt; a?: number; s?: number; o?: number; c?: string }> = ({ p, a = 0, s = 1, o = 1, c = C.ink }) => o <= 0 ? null : (
  <g opacity={o} transform={`translate(${p[0]} ${p[1]}) rotate(${-a}) scale(${s})`}>
    <path d="M 34 0 L 12 -4 L -2 -28 L -11 -28 L -4 -4 L -22 -4 L -28 -15 L -34 -15 L -30 0 L -34 15 L -28 15 L -22 4 L -4 4 L -11 28 L -2 28 L 12 4 Z"
      fill={c} stroke={C.bg} strokeWidth={3} />
  </g>
);
export const ClockIcon: React.FC<{ c: Pt; r?: number; o?: number }> = ({ c, r = 34, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <circle cx={c[0]} cy={c[1]} r={r} fill="#1f2a44" stroke={C.key} strokeWidth={4} />
    <line x1={c[0]} y1={c[1]} x2={c[0]} y2={c[1] - r * 0.7} stroke={C.key} strokeWidth={4} strokeLinecap="round" />
    <line x1={c[0]} y1={c[1]} x2={c[0] + r * 0.5} y2={c[1] + r * 0.2} stroke={C.key} strokeWidth={4} strokeLinecap="round" />
  </g>
);
/** a three-legged stool (s06: three points fix one flat sheet) */
export const Stool: React.FC<{ c: Pt; s?: number; o?: number }> = ({ c, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o} transform={`translate(${c[0]} ${c[1]}) scale(${s})`}>
    <ellipse cx={0} cy={-40} rx={70} ry={18} fill="#3a4766" stroke={C.key} strokeWidth={4} />
    <line x1={-52} y1={-32} x2={-66} y2={50} stroke={C.key} strokeWidth={6} strokeLinecap="round" />
    <line x1={52} y1={-32} x2={66} y2={50} stroke={C.key} strokeWidth={6} strokeLinecap="round" />
    <line x1={0} y1={-24} x2={0} y2={60} stroke={C.key} strokeWidth={6} strokeLinecap="round" />
    {[[-66, 50], [66, 50], [0, 60]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill={C.gold} />)}
  </g>
);
/** pencil + table (s13: a lot of calculation) */
export const TableIcon: React.FC<{ c: Pt; o?: number }> = ({ c, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <rect x={c[0] - 70} y={c[1] - 50} width={120} height={100} rx={8} fill="#1f2a44" stroke={C.muted} strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={c[0] - 60} y1={c[1] - 28 + i * 22} x2={c[0] + 40} y2={c[1] - 28 + i * 22} stroke={C.muted} strokeWidth={3} />)}
    <line x1={c[0] - 20} y1={c[1] - 50} x2={c[0] - 20} y2={c[1] + 50} stroke={C.muted} strokeWidth={3} />
    <g transform={`translate(${c[0] + 60} ${c[1] - 10}) rotate(35)`}>
      <rect x={-8} y={-60} width={16} height={90} fill={C.gold} stroke={C.bg} strokeWidth={2} />
      <polygon points="-8,30 8,30 0,48" fill={C.key} />
    </g>
  </g>
);
export const Magnifier: React.FC<{ c: Pt; r?: number; o?: number }> = ({ c, r = 40, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={C.key} strokeWidth={5} />
    <line x1={c[0] + r * 0.7} y1={c[1] + r * 0.7} x2={c[0] + r * 1.5} y2={c[1] + r * 1.5} stroke={C.key} strokeWidth={9} strokeLinecap="round" />
  </g>
);
export const sang = (v: Pt) => Math.atan2(-v[1], v[0]) / D2R;
export const add = (p: Pt, v: Pt, s = 1): Pt => [p[0] + v[0] * s, p[1] + v[1] * s];
export { Arrow, Svg, clamp, textW };
