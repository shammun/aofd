// Shared pieces of the ch00_coordinates_moving movie (#5e, Coordinates Part 5 "Moving frames"): timing from timing.json
// (SS/SE/AT as in the reference movie DotProductWhy.tsx), the scene wrapper, the data (mv.json from
// movies/data/build_ch00_coordinates_moving.py, CHECK rows DC50-DC56, DP29-DP42), the WebGL globe (kit_mv, copied from Part 4's
// kit_fr) for the s02 recap mini, flat lat/lon maps (local equirectangular) with Ciarán's hourly ERA5 rasters, isobars and
// animated streaks, SideCallout, the skip chip, colour bars, x-y charts, a KaTeX width guard (text ends before x 1842) and small
// code-drawn icons (train, walker, barometer, anemometer, rider, person, house). Adapted from Part 4 (fr_lib.tsx) and build 1
// (co_lib.tsx). Everything is a pure function of the frame and the data.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { ramp } from "../house";
import timing from "../../ch00/ch00_coordinates_moving/timing.json";
import mvJ from "../../ch00/ch00_coordinates_moving/data/mv.json";
import { C, T } from "../house/kit/type";
import { Arrow, Lbl as HLbl, Pt, Svg, clamp, textW } from "../house/kit/draw";
import { Keyword as HKeyword } from "../house/kit/notes";
import { CurvedLink } from "../house/kit/extras";
import { FlowParticles } from "../house/kit/wind";
import { CalcRow, CalcStack as HCalcStack, Layered as HLayered, Part, Layer, TeX as HTeX, plainOf } from "../house/kit/tex";
import { GlobeCam, GlobeMesh, GProj, coastPath, globeCam, globeProj, useTex, Graticule, enAt, ll } from "./kit_mv/globe";
import { View3D } from "./kit_mv/three3d";
import { V3 } from "./kit_mv/cam";

export const FPS = 30;
type Snt = { text: string; start: number; end: number };
type Scn = { id: string; start: number; end: number; sentences: Snt[] };
export const sc = (timing as unknown as { scenes: Scn[]; total_frames: number }).scenes;
export const HOLD = 75;
export const XF = 10;
export const MV_FRAMES = (timing as unknown as { total_frames: number }).total_frames + HOLD;
const IDS = sc.map((s) => s.id);
export const K = (id: string) => { const k = IDS.indexOf(id); if (k < 0) throw new Error(`no scene ${id}`); return k; };
export const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
export const END = [...CUT.slice(1), MV_FRAMES];
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
/** linear progress (constant rate, for clocks and sliding patterns that move at one speed) */
export const lin = (f: number, a: number, b: number) => clamp((f - a) / Math.max(1, b - a), 0, 1);
export const poly = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
/** a number with a true minus sign and fixed decimals */
export const nf = (v: number, d = 1, plus = false) => `${v < 0 ? "−" : plus && v > 0 ? "+" : ""}${Math.abs(v).toFixed(d)}`;
export const D2R = Math.PI / 180;
export const BROWN = "#a0784e";           // gravity (storyboard colour contract)
export const XC = 1100;                   // left edge of the maths column
export const XMAX = 1840;                 // text must end before x 1842

export const Scene: React.FC<{ children: React.ReactNode; fadeIn?: boolean }> = ({ children, fadeIn = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.bg, opacity: fadeIn ? ramp(f, 0, XF) : 1 }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- data and assets
/* eslint-disable @typescript-eslint/no-explicit-any */
export const D = mvJ as any;
export const CI = D.ciaran;
const pad2 = (i: number) => `${i < 10 ? "0" : ""}${i}`;
export const IMGS = {
  bmng: staticFile("mv_bmng.jpg"),
  speed: (i: number) => staticFile(`mv_cia_speed_${pad2(i)}.png`),
  msl: (i: number) => staticFile(`mv_cia_msl_${pad2(i)}.png`),
};
export const LUT_SPEED = D.luts.speed as string[];
export const LUT_P = D.luts.p as string[];
export const BREST: [number, number] = D.brest.ll;
export const PLY: [number, number] = CI.ply.p;
export const lutCss = (lut: string[], t: number) => lut[Math.max(0, Math.min(lut.length - 1, Math.round(t * (lut.length - 1))))];
/** hats in KaTeX (review 1 Should 2: never a combining hat in a text label) */
export const H = {
  i: String.raw`\hat{\mathbf i}`, j: String.raw`\hat{\mathbf j}`, k: String.raw`\hat{\mathbf k}`,
  xp: String.raw`\hat{\mathbf x}'`, yp: String.raw`\hat{\mathbf y}'`, v: String.raw`\mathbf v`, U: String.raw`\mathbf U`, vp: String.raw`\mathbf v'`,
};

// ---------------------------------------------------------------- KaTeX width guard (text ends before x 1842)
/** a rough, slightly generous width of a KaTeX string at effective size s (letters ≈ 0.55 em, binary operators with their
 * spaces ≈ 1.15 em, \dfrac = the wider of its two parts, \text{…} per character, hats free); used only as a layout guard */
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
      if (cmd === "frac" || cmd === "dfrac" || cmd === "tfrac") { const a = group(), b = group(); return (Math.max(a, b) + 0.2) * (cmd === "tfrac" ? 0.75 : 1); }
      if (cmd === "text" || cmd === "mathrm") { const j = str.indexOf("}", i); const t = str.slice(i + 1, j); i = j + 1; return t.length * 0.5; }
      if (cmd === "hat" || cmd === "mathbf" || cmd === "boldsymbol" || cmd === "underbrace" || cmd === "cancel" || cmd === "textcolor") {
        if (cmd === "textcolor") { group(); } return group(); }
      if (cmd === "qquad") return 2; if (cmd === "quad") return 1; if (cmd === ",") return 0.17; if (cmd === " " || cmd === ";") return 0.28;
      if (cmd === "approx" || cmd === "equiv" || cmd === "neq" || cmd === "Rightarrow" || cmd === "Longrightarrow" || cmd === "to" || cmd === "longrightarrow" || cmd === "times" || cmd === "cdot") return 1.3;
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
const guard = (what: string, x0: number, w: number) => { if (x0 + w > 1842) throw new Error(`text "${what.slice(0, 50)}" ends at x ${Math.round(x0 + w)} (> 1842)`); };
/** split a TeX string before each separator (the separator starts the next piece); every separator must exist in order */
export const pieces = (s: string, seps: string[]): string[] => {
  const out: string[] = []; let rest = s;
  for (const sp of seps) { const i = rest.indexOf(sp); if (i <= 0) throw new Error(`pieces: "${sp}" not in "${rest}"`); out.push(rest.slice(0, i)); rest = rest.slice(i); }
  out.push(rest); return out;
};
/** house TeX with the right-edge guard (ax = 0 or 0.5 or 1 as in the house component) */
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
  const rows = withFracH(p.rows, p.size ?? 68);
  stackBottomGuard(rows, p.y, p.size ?? 68, p.maxLines ?? 3);
  return <HCalcStack {...p} rows={rows} />;
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

// ---------------------------------------------------------------- globe (three.js, kit_mv): the s02 recap mini only
export type Box = { x: number; y: number; w: number; h: number };
export const globeG = (cam: GlobeCam, box: Box): GProj => {
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  return globeProj(st, box.w, box.h, box.x, box.y);
};
export const Globe: React.FC<{ cam: GlobeCam; box: Box; coast?: number; o?: number; grat?: number; over?: (G: GProj) => React.ReactNode }> = ({
  cam, box, coast = 0.45, o = 1, over, grat = 0 }) => {
  const tex = useTex(IMGS.bmng);
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  const G = globeProj(st, box.w, box.h, box.x, box.y);
  if (o <= 0) return null;
  const id = `gc${box.x}_${box.y}_${box.w}`;
  return (
    <AbsoluteFill>
      <View3D st={st} x={box.x} y={box.y} w={box.w} h={box.h} o={tex ? o : 0} key3={st.pos} amb={1.6} dir={1.4}>
        <GlobeMesh tex={tex} />
      </View3D>
      <Svg o={o}>
        <defs><clipPath id={id}><rect x={box.x} y={box.y} width={box.w} height={box.h} /></clipPath></defs>
        <g clipPath={`url(#${id})`}>
          {grat > 0 ? <Graticule G={G} step={30} o={grat} /> : null}
          {coast > 0 ? <path d={coastPath(G, D.lines.globe110)} fill="none" stroke={C.key} strokeOpacity={coast} strokeWidth={1.6} /> : null}
          {over ? over(G) : null}
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
/** the silhouette disc of a globe view (for placing the text column clear of it) */
export const discOf = (cam: GlobeCam, box: Box): { c: Pt; r: number } => {
  const G = globeG(cam, box);
  const c = G.pw([0, 0, 0]);
  const fov = cam.fov ?? 35, r = (box.h / 2) * Math.tan(Math.asin(1 / Math.max(1.0001, cam.dist))) / Math.tan((fov / 2) * D2R);
  return { c, r };
};
/** the tripod (east i, north j: orange; up k: teal) at (lat, lon), arrow length L in Earth radii: screen points */
export const tripod = (G: GProj, la: number, lo: number, L: number) => {
  const e = enAt(la, lo), b = ll(la, lo);
  const tip = (v: V3, s: number): V3 => [b[0] + v[0] * s, b[1] + v[1] * s, b[2] + v[2] * s];
  return { b: G.pw(b), i: G.pw(tip(e.e, L)), j: G.pw(tip(e.n, L)), k: G.pw(tip(e.u, L * 1.15)) };
};
export const Tripod: React.FC<{ G: GProj; la: number; lo: number; L: number; o?: number; w?: number; head?: number }> = ({ G, la, lo, L, o = 1, w = 8, head = 30 }) => {
  if (o <= 0 || !G.vis(la, lo)) return null;
  const t = tripod(G, la, lo, L);
  return (
    <g opacity={o}>
      <Arrow p={t.b} q={t.i} color={C.second} w={w} head={head} />
      <Arrow p={t.b} q={t.j} color={C.second} w={w} head={head} />
      <Arrow p={t.b} q={t.k} color={C.first} w={w} head={head} />
      <circle cx={t.b[0]} cy={t.b[1]} r={8} fill={C.gold} stroke={C.bg} strokeWidth={3} />
    </g>
  );
};
export { enAt, ll };

// ---------------------------------------------------------------- flat lat/lon maps (local equirectangular: true local shape)
export type MapBox = { lat0: number; lat1: number; lon0: number; lon1: number; x: number; y: number; w: number; h: number };
export type Proj = (lat: number, lon: number) => Pt;
export const mapP = (B: MapBox): Proj => (lat, lon) => [B.x + ((lon - B.lon0) / (B.lon1 - B.lon0)) * B.w, B.y + ((B.lat1 - lat) / (B.lat1 - B.lat0)) * B.h];
/** a box of true local aspect centred on (latC, lonC) with height `dlat` degrees, drawn at x, y, w, h */
export const boxAt = (latC: number, lonC: number, dlat: number, x: number, y: number, w: number, h: number): MapBox => {
  const c = Math.cos(latC * D2R), dlon = (dlat * (w / h)) / c;
  return { lat0: latC - dlat / 2, lat1: latC + dlat / 2, lon0: lonC - dlon / 2, lon1: lonC + dlon / 2, x, y, w, h };
};
export const kmPx = (B: MapBox, km: number) => (km / 111.2 / (B.lat1 - B.lat0)) * B.h;
/** flat [lon, lat, …] polylines → SVG path */
export const linesPath = (P: Proj, lines: number[][]): string => {
  let d = "";
  for (const ln of lines) {
    for (let k = 0; k < ln.length; k += 2) { const [x, y] = P(ln[k + 1], ln[k]); d += `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`; }
  }
  return d;
};
export const GeoImg: React.FC<{ P: Proj; href: string; box: number[]; o?: number }> = ({ P, href, box, o = 1 }) => {
  if (o <= 0) return null;
  const a = P(box[1], box[2]), b = P(box[0], box[3]);
  return <image href={href} x={a[0]} y={a[1]} width={b[0] - a[0]} height={b[1] - a[1]} preserveAspectRatio="none" opacity={o} />;
};
/** a map frame: the map body sits in an overflow-hidden <div> of the map box as well as its clip-path (build-1 K6 lesson);
 * `over` layers (labels, links) in a full-frame SVG on top */
export const GeoMap: React.FC<{ id: string; B: MapBox; o?: number; children: (P: Proj) => React.ReactNode; over?: (P: Proj) => React.ReactNode;
  frame?: number; sea?: string }> = ({ id, B, o = 1, children, over, frame = 1, sea = "#1d2a44" }) => {
  if (o <= 0) return null;
  const P = mapP(B);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: B.x, top: B.y, width: B.w, height: B.h, overflow: "hidden" }}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: -B.x, top: -B.y }}>
          <defs><clipPath id={`clip_${id}`}><rect x={B.x} y={B.y} width={B.w} height={B.h} /></clipPath></defs>
          <g clipPath={`url(#clip_${id})`}>
            <rect x={B.x} y={B.y} width={B.w} height={B.h} fill={sea} />
            {children(P)}
          </g>
        </svg>
      </div>
      <Svg>
        {frame > 0 ? <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="none" stroke={C.grid} strokeWidth={3} opacity={frame} /> : null}
        {over ? over(P) : null}
      </Svg>
    </AbsoluteFill>
  );
};
export const Place: React.FC<{ p: Pt; t?: string; o?: number; dx?: number; dy?: number; a?: "start" | "middle" | "end"; c?: string; r?: number; italic?: boolean }> = ({
  p, t, o = 1, dx = 20, dy = -34, a = "start", c = C.gold, r = 11, italic }) =>
  o <= 0 ? null : (
    <g opacity={o} data-lc-maplabel="1">
      {r > 0 ? <circle cx={p[0]} cy={p[1]} r={r} fill={c} stroke={C.bg} strokeWidth={4} /> : null}
      {t ? <Lbl x={p[0] + dx} y={p[1] + dy} t={t} c={C.key} s={T.floor} a={a} italic={italic} /> : null}
    </g>
  );

// ---------------------------------------------------------------- Storm Ciarán (ERA5 hourly 21 -> 06 UTC; index 0 = 21 UTC)
export const CIA_MAP: MapBox = boxAt(50.3, -4.6, 9.0, 80, 40, 920, 720);   // picture zone x 80-1000, y 40-760 (source line below)
export const CIA_PIC = { x: 80, y: 40, w: 920, h: 720 };
export const HOUR = ["21", "22", "23", "00", "01", "02", "03", "04", "05", "06"];
export const TRK = CI.track as [string, number, number, number][];
export const isoD = (P: Proj, levels: { level: number; lines: number[][] }[]) => levels.map((L) => linesPath(P, L.lines)).join("");
/** the map at hour index h (0 = 21 UTC … 9 = 06 UTC; fractional = a cross-fade between two hours): wind-speed (or msl) raster,
 * coast, isobars every 4 hPa, animated streaks through the frozen 03 UTC wind (time compression stated in the manifest) */
export const CiaMap: React.FC<{ f: number; h: number; B?: MapBox; o?: number; field?: "speed" | "msl"; parts?: number; iso?: number;
  children?: (P: Proj) => React.ReactNode; over?: (P: Proj) => React.ReactNode; id?: string }> = ({ f, h, B = CIA_MAP, o = 1, field = "speed", parts = 1, iso = 1, children, over, id = "cia" }) => {
  const hh = clamp(h, 0, 9), a = Math.floor(hh), b = Math.min(9, a + 1), w = hh - a;
  const href = field === "speed" ? IMGS.speed : IMGS.msl;
  return (
    <GeoMap id={id} B={B} o={o} over={over}>
      {(P) => <>
        <GeoImg P={P} href={href(a)} box={CI.sbox} o={0.9} />
        {w > 0.01 ? <GeoImg P={P} href={href(b)} box={CI.sbox} o={0.9 * w} /> : null}
        <path d={linesPath(P, CI.coast)} fill="none" stroke={C.key} strokeOpacity={0.85} strokeWidth={2} />
        {iso > 0 ? <path d={isoD(P, CI.frames[w > 0.5 ? b : a].iso)} fill="none" stroke={C.key} strokeWidth={2.4} opacity={0.85 * iso} /> : null}
        {parts > 0 ? <FlowParticles P={(la, lo) => P(la, lo)} tracks={CI.tracks} fr={f / 2} tail={10} w={2} o={parts} vmax={25} /> : null}
        {children ? children(P) : null}
      </>}
    </GeoMap>
  );
};
/** the 200-km ring at 03 UTC as a path */
export const ringD = (P: Proj) => poly((CI.ring.lat as number[]).map((la, i) => P(la, CI.ring.lon[i]))) + "Z";
/** a ring sector (indices) as a path */
export const sectorD = (P: Proj, idx: number[]) => {
  const s = [...idx].sort((x, y) => x - y);
  // sectors may wrap past index 71 -> 0: rotate so the run is continuous
  let cut = 0; for (let i = 1; i < s.length; i++) if (s[i] - s[i - 1] > 1) cut = i;
  const run = [...s.slice(cut), ...s.slice(0, cut)];
  return poly(run.map((i) => P(CI.ring.lat[i], CI.ring.lon[i])));
};
export const SRC_CIA = "Data: ERA5 (Copernicus C3S) · 1–2 Nov 2023, hourly";
export const SRC_CIA3 = "Data: ERA5 (Copernicus C3S) · 2 Nov 2023, 03 UTC";

// ---------------------------------------------------------------- readouts with links
/** a readout in the text column with a gold link that always leaves from the text's LEFT edge (build-1 K6 lesson: links never
 * run up through the label above). Lines stack downward at 1.25 × size; anchor start. Place inside <Svg>. */
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

// ---------------------------------------------------------------- maths-skip guidance (user rule 2026-11-05)
/** mm:ss of the start of the LAST sentence of scene `id` (the "If you skipped, here's what to keep" line) */
export const keepTime = (id: string) => {
  const s = sc[K(id)], q = s.sentences[s.sentences.length - 1];
  if (!q.text.startsWith("If you skipped")) throw new Error(`${id}: last sentence is not the keep line`);
  const t = Math.floor(q.start), m = Math.floor(t / 60), ss = t % 60;
  return `${m}:${ss < 10 ? "0" : ""}${ss}`;
};
/** The skip chip (the user's explicit exception to "no boxes"; storyboard skip_guidance): warm-white words, gold outline, in the
 * lower part of the maths zone (as Parts 1 and 4), from the words "skip ahead" for 6 s and at least until that sentence ends. */
export const SkipChip: React.FC<{ f: number; k: number; to: string }> = ({ f, k, to }) => {
  const j = sc[k].sentences.findIndex((s) => s.text.includes("skip ahead"));
  if (j < 0) throw new Error(`${sc[k].id}: no "skip ahead" sentence`);
  const a = AT(k, j, "skip ahead"), b = Math.max(a + 180, SE(k, j));
  // Part 1 lessons E1: Part 1's chip words, "every step · optional" / "skip to mm:ss" ("not needed for …" is spoken in the lead-in)
  const lines = ["every step · optional", `skip to ${to}`];
  lines.forEach((t) => guard(t, 1100, textW(t, T.floor)));
  const o = ramp(f, a, a + 10) * (1 - ramp(f, b, b + 10));
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      <rect x={1076} y={740} width={760} height={116} rx={22} fill="#1f2a44" stroke={C.gold} strokeWidth={3} />
      {lines.map((t, i) => <Lbl key={i} x={1100} y={774 + i * 52} t={t} c={i === 1 ? C.gold : C.key} s={T.floor} />)}
    </g>
  );
};
/** the chip's lifetime (so the scene can keep its lower column free meanwhile) */
export const chipSpan = (k: number): [number, number] => {
  const j = sc[k].sentences.findIndex((s) => s.text.includes("skip ahead"));
  const a = AT(k, j, "skip ahead"), b = Math.max(a + 180, SE(k, j));
  return [a, b + 10];
};

// ---------------------------------------------------------------- colour bars (beside the picture, in the text column)
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
/** 10-m wind speed, 0-30 m/s (cmocean speed, the rasters' own LUT and range) */
export const SpeedBar: React.FC<{ x: number; y: number; o?: number; w?: number }> = ({ x, y, o = 1, w = 300 }) =>
  <ColourBar x={x} y={y} w={w} lut={LUT_SPEED} lo={0} hi={30} unit="m/s" o={o} title="wind speed"
    ticks={[{ v: 0, t: "0" }, { v: 15, t: "15" }, { v: 30, t: "30" }]} />;
/** sea-level pressure, 950-1010 hPa (cividis, the rasters' own LUT and range) */
export const PBar: React.FC<{ x: number; y: number; o?: number; w?: number }> = ({ x, y, o = 1, w = 300 }) =>
  <ColourBar x={x} y={y} w={w} lut={LUT_P} lo={950} hi={1010} unit="hPa" o={o} title="pressure"
    ticks={[{ v: 950, t: "950" }, { v: 980, t: "980" }, { v: 1010, t: "1010" }]} />;

// ---------------------------------------------------------------- x-y charts
export type Ax = { x: number; y: number; w: number; h: number; xr: [number, number]; yr: [number, number] };
export const axX = (A: Ax) => (v: number) => A.x + ((v - A.xr[0]) / (A.xr[1] - A.xr[0])) * A.w;
export const axY = (A: Ax) => (v: number) => A.y + A.h - ((v - A.yr[0]) / (A.yr[1] - A.yr[0])) * A.h;
export const axP = (A: Ax) => (x: number, y: number): Pt => [axX(A)(x), axY(A)(y)];
export const Axes: React.FC<{ A: Ax; xt: number[]; yt: number[]; xl?: string; yl?: string; o?: number; xf?: (v: number) => string; yf?: (v: number) => string }> = ({
  A, xt, yt, xl, yl, o = 1, xf = (v) => nf(v, 0), yf = (v) => nf(v, 0) }) => {
  if (o <= 0) return null;
  const X = axX(A), Y = axY(A);
  return (
    <g opacity={o}>
      {yt.map((v) => <line key={`gy${v}`} x1={A.x} y1={Y(v)} x2={A.x + A.w} y2={Y(v)} stroke={C.grid} strokeWidth={1.5} />)}
      <line x1={A.x} y1={A.y + A.h} x2={A.x + A.w + 8} y2={A.y + A.h} stroke={C.muted} strokeWidth={3} />
      <line x1={A.x} y1={A.y - 8} x2={A.x} y2={A.y + A.h} stroke={C.muted} strokeWidth={3} />
      {xt.map((v) => <Lbl key={`x${v}`} x={X(v)} y={A.y + A.h + 32} t={xf(v)} c={C.muted} s={44} a="middle" b={false} />)}
      {yt.map((v) => <Lbl key={`y${v}`} x={A.x - 14} y={Y(v)} t={yf(v)} c={C.muted} s={44} a="end" b={false} />)}
      {xl ? <Lbl x={A.x + A.w} y={A.y + A.h + 80} t={xl} c={C.muted} s={44} a="end" b={false} /> : null}
      {yl ? <Lbl x={A.x + 12} y={A.y - 34} t={yl} c={C.muted} s={44} a="start" b={false} /> : null}
    </g>
  );
};
export const curveD = (A: Ax, xs: number[], ys: number[]) => poly(xs.map((x, i) => axP(A)(x, ys[i])));

// ---------------------------------------------------------------- the two derivation helpers (arc, chevron)
export const add = (p: Pt, v: Pt, s = 1): Pt => [p[0] + v[0] * s, p[1] + v[1] * s];
export const arcD = (c: Pt, r: number, a0: number, a1: number, n = 40) => {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) { const a = (a0 + ((a1 - a0) * i) / n) * D2R; pts.push([c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)]); }
  return poly(pts);
};

// ---------------------------------------------------------------- icons (code-drawn, illustrative)
export const Train: React.FC<{ x: number; y: number; w?: number; o?: number }> = ({ x, y, w = 560, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <rect x={x} y={y - 110} width={w} height={96} rx={18} fill="#3a4766" stroke={C.local} strokeWidth={4} />
    {Array.from({ length: Math.floor(w / 120) }, (_, i) => <rect key={i} x={x + 30 + i * 120} y={y - 92} width={80} height={40} rx={6} fill="#cfe3ff" opacity={0.55} />)}
    {[0.15, 0.85].map((q) => <circle key={q} cx={x + w * q} cy={y - 8} r={16} fill="#2a3149" stroke={C.local} strokeWidth={4} />)}
  </g>
);
export const Walker: React.FC<{ x: number; y: number; s?: number; o?: number; c?: string }> = ({ x, y, s = 1, o = 1, c = C.first }) => o <= 0 ? null : (
  <g opacity={o} stroke={c} strokeWidth={6 * s} strokeLinecap="round" fill="none">
    <circle cx={x} cy={y - 74 * s} r={11 * s} fill={c} />
    <line x1={x} y1={y - 62 * s} x2={x} y2={y - 30 * s} /><line x1={x} y1={y - 30 * s} x2={x - 12 * s} y2={y} /><line x1={x} y1={y - 30 * s} x2={x + 12 * s} y2={y} />
    <line x1={x} y1={y - 54 * s} x2={x + 14 * s} y2={y - 40 * s} /><line x1={x} y1={y - 54 * s} x2={x - 12 * s} y2={y - 42 * s} />
  </g>
);
/** a person standing still (slate): the observer beside the track / on the shore */
export const Person: React.FC<{ x: number; y: number; s?: number; o?: number; c?: string }> = ({ x, y, s = 1, o = 1, c = C.local }) => o <= 0 ? null : (
  <g opacity={o} stroke={c} strokeWidth={6 * s} strokeLinecap="round" fill="none">
    <circle cx={x} cy={y - 74 * s} r={11 * s} fill={c} />
    <line x1={x} y1={y - 62 * s} x2={x} y2={y - 30 * s} /><line x1={x} y1={y - 30 * s} x2={x - 9 * s} y2={y} /><line x1={x} y1={y - 30 * s} x2={x + 9 * s} y2={y} />
    <line x1={x} y1={y - 54 * s} x2={x - 14 * s} y2={y - 34 * s} /><line x1={x} y1={y - 54 * s} x2={x + 14 * s} y2={y - 34 * s} />
  </g>
);
/** the rider (orange): a small figure on a disc, riding with the storm / the pattern */
export const Rider: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <ellipse cx={x} cy={y} rx={30 * s} ry={9 * s} fill={C.second} stroke={C.bg} strokeWidth={3} />
    <g stroke={C.second} strokeWidth={6 * s} strokeLinecap="round" fill="none">
      <circle cx={x} cy={y - 64 * s} r={10 * s} fill={C.second} />
      <line x1={x} y1={y - 53 * s} x2={x} y2={y - 26 * s} /><line x1={x} y1={y - 26 * s} x2={x - 10 * s} y2={y - 6 * s} /><line x1={x} y1={y - 26 * s} x2={x + 10 * s} y2={y - 6 * s} />
      <line x1={x} y1={y - 46 * s} x2={x - 18 * s} y2={y - 52 * s} /><line x1={x} y1={y - 46 * s} x2={x + 18 * s} y2={y - 52 * s} />
    </g>
  </g>
);
export const Barometer: React.FC<{ x: number; y: number; r?: number; hPa: number; o?: number }> = ({ x, y, r = 56, hPa, o = 1 }) => {
  if (o <= 0) return null;
  const a = ((hPa - 980) / 40) * 1.6;
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r} fill="#1d2740" stroke={C.local} strokeWidth={5} />
      {Array.from({ length: 9 }, (_, i) => { const t = -2 + i * 0.5; return <line key={i} x1={x + Math.sin(t) * r * 0.72} y1={y - Math.cos(t) * r * 0.72} x2={x + Math.sin(t) * r * 0.9} y2={y - Math.cos(t) * r * 0.9} stroke={C.muted} strokeWidth={3} />; })}
      <line x1={x} y1={y} x2={x + Math.sin(a) * r * 0.78} y2={y - Math.cos(a) * r * 0.78} stroke={C.local} strokeWidth={5} strokeLinecap="round" />
      <circle cx={x} cy={y} r={6} fill={C.ink} />
    </g>
  );
};
/** a cup anemometer on a pole (slate): the wind meter that never moves; cups turn at a rate set by `spin` (frames → turns) */
export const Anemometer: React.FC<{ x: number; y: number; s?: number; o?: number; spin?: number }> = ({ x, y, s = 1, o = 1, spin = 0 }) => o <= 0 ? null : (
  <g opacity={o}>
    <line x1={x} y1={y} x2={x} y2={y - 110 * s} stroke={C.local} strokeWidth={6 * s} strokeLinecap="round" />
    {[0, 1, 2].map((i) => { const a = spin * 2 * Math.PI + (i * 2 * Math.PI) / 3, cx = x + Math.cos(a) * 34 * s;
      return <g key={i}><line x1={x} y1={y - 110 * s} x2={cx} y2={y - 110 * s + Math.sin(a) * 8 * s} stroke={C.local} strokeWidth={4 * s} />
        <circle cx={cx} cy={y - 110 * s + Math.sin(a) * 8 * s} r={10 * s} fill={C.local} stroke={C.bg} strokeWidth={2} /></g>; })}
  </g>
);
export const HouseIcon: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -22 0 L -22 -26 L 0 -44 L 22 -26 L 22 0 Z" fill="#e8ecf4" stroke={C.bg} strokeWidth={3} />
    <rect x={-6} y={-16} width={12} height={16} fill={C.local} />
  </g>
);
export const ClockText: React.FC<{ x: number; y: number; t: string; h: number; o?: number; s?: number }> = ({ x, y, t, h, o = 1, s = T.key }) => {
  if (o <= 0) return null;
  const a = (h / 12) * 2 * Math.PI, r = 30;
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={C.ink} strokeWidth={4} />
      <line x1={x} y1={y} x2={x + Math.sin(a * 12) * r * 0.72} y2={y - Math.cos(a * 12) * r * 0.72} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      <line x1={x} y1={y} x2={x + Math.sin(a) * r * 0.48} y2={y - Math.cos(a) * r * 0.48} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      <Lbl x={x + 46} y={y} t={t} c={C.key} s={s} />
    </g>
  );
};
export const ParcelDot: React.FC<{ p: Pt; o?: number; r?: number }> = ({ p, o = 1, r = 13 }) => o <= 0 ? null :
  <circle cx={p[0]} cy={p[1]} r={r} fill={C.key} stroke={C.bg} strokeWidth={4} opacity={o} />;
/** a ruler with ticks every `step` px (origin at x0), drawn from xa to xb */
export const Ruler: React.FC<{ x0: number; y: number; xa: number; xb: number; step?: number; c: string; o?: number }> = ({ x0, y, xa, xb, step = 100, c, o = 1 }) => {
  if (o <= 0) return null;
  const t0 = Math.ceil((xa - x0) / step), t1 = Math.floor((xb - x0) / step);
  return (
    <g opacity={o}>
      <line x1={xa} y1={y} x2={xb} y2={y} stroke={c} strokeWidth={4} />
      {Array.from({ length: Math.max(0, t1 - t0 + 1) }, (_, i) => { const x = x0 + (t0 + i) * step; return <line key={i} x1={x} y1={y - 14} x2={x} y2={y + 14} stroke={c} strokeWidth={x === x0 ? 6 : 3} />; })}
    </g>
  );
};
export { Arrow, Svg, clamp, textW };
