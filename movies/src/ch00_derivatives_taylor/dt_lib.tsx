// Shared pieces of the ch00_derivatives_taylor movie (#4): timing from timing.json (SS/SE/AT as in the reference movie
// DotProductWhy.tsx), the scene wrapper, the data (dt.json from movies/data/build_ch00_derivatives_taylor.py), flat map
// frames (plate carrée boxes with the ERA5 850 hPa textures, isolines, coast), x-y charts (house ticks), the
// WebGL globe and terrain (kit_dt, copied from the 1a / weather-basics kits), small code-drawn icons (car, plane, balloon,
// barometer) and the data-source line with wrapping (weather basics). Everything is a pure function of the frame and the data.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { ramp } from "../house";
import timing from "../../ch00/ch00_derivatives_taylor/timing.json";
import dtJ from "../../ch00/ch00_derivatives_taylor/data/dt.json";
import { C, FONT, T } from "../house/kit/type";
import { Arrow, Lbl, Pt, Svg, clamp, textW } from "../house/kit/draw";
import { GlobeCam, GlobeMesh, GProj, coastPath, globeCam, globeProj, sphereGeo, useTex, Graticule, Drape } from "./kit_dt/globe";
import { View3D } from "./kit_dt/three3d";
import { IsoLevel, MapBox, linesPath, lutCss, mapP } from "./kit_dt/wb";

export const FPS = 30;
type Snt = { text: string; start: number; end: number };
type Scn = { id: string; start: number; end: number; sentences: Snt[] };
export const sc = (timing as unknown as { scenes: Scn[]; total_frames: number }).scenes;
export const HOLD = 75;
export const XF = 10;
export const DT_FRAMES = (timing as unknown as { total_frames: number }).total_frames + HOLD;
const IDS = sc.map((s) => s.id);
export const K = (id: string) => { const k = IDS.indexOf(id); if (k < 0) throw new Error(`no scene ${id}`); return k; };
export const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
export const END = [...CUT.slice(1), DT_FRAMES];
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

export const Scene: React.FC<{ children: React.ReactNode; fadeIn?: boolean }> = ({ children, fadeIn = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.bg, opacity: fadeIn ? ramp(f, 0, XF) : 1 }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- data
/* eslint-disable @typescript-eslint/no-explicit-any */
export const D = dtJ as any;
export const SUMC = C.key;
export const BROWN = "#a0784e";            // gravity (storyboard colour contract)
export const IMGS = {
  bmng: staticFile("dt_bmng.jpg"), tc: staticFile("dt_tc_20231101.jpg"), trappes: staticFile("dt_trappes_tc_20260930.jpg"),
  t850: (h: number) => staticFile(`dt_t850_${h}.png`), coarse: (n: number) => staticFile(`dt_t850c_${n}.png`),
  land: staticFile("dt_land_18.png"), hill: staticFile("dt_hill_tint.png"), t500: staticFile("dt_t500_trappes.png"),
  tcwv: staticFile("dt_tcwv_trend.png"), olr: staticFile("dt_olr_latest.png"),
};
export const BREST: [number, number] = [D.brest.lat, D.brest.lon];
export const BGP: [number, number] = [D.brest.gp[0], D.brest.gp[1]];
export const TRAP: [number, number] = [D.snd.lat, D.snd.lon];
export const LUT_T = D.luts.thermal as string[];
export const LUT_B = D.luts.balance as string[];
const edges = (o: any): [number, number, number, number] => [o.lat_edges[0], o.lat_edges[1], o.lon_edges[0], o.lon_edges[1]];
export const BOX = {
  tc: edges(D.images.truecolour_1101), t850: edges(D.e850.t850["18"].tex), coarse: edges(D.fd.tex["1"]), trappes: edges(D.images.trappes_0930),
  t500: edges(D.snd.t500), tcwv: edges(D.cc.tcwv.map), olr: edges(D.rad.tex),
};

// ---------------------------------------------------------------- flat maps
export type Proj = (lat: number, lon: number) => Pt;
export const GeoImg: React.FC<{ P: Proj; href: string; box: [number, number, number, number]; o?: number }> = ({ P, href, box, o = 1 }) => {
  if (o <= 0) return null;
  const a = P(box[1], box[2]), b = P(box[0], box[3]);
  return <image href={href} x={a[0]} y={a[1]} width={b[0] - a[0]} height={b[1] - a[1]} preserveAspectRatio="none" opacity={o} />;
};
export type MapLayers = { tc?: number; t850?: { h: number; o: number }[]; coarse?: { n: number; o: number }[]; coast?: number; borders?: number; dim?: number; frame?: number };
/** a map frame: layers (true colour / T850 hours / coarse-grid T850), Natural Earth lines, then the caller's SVG */
export const MapView: React.FC<{ B: MapBox; L: MapLayers; o?: number; id: string; children?: (P: Proj) => React.ReactNode; over?: (P: Proj) => React.ReactNode }> = ({
  B, L, o = 1, id, children, over }) => {
  if (o <= 0) return null;
  const P = mapP(B);
  return (
    <Svg o={o}>
      <defs><clipPath id={`clip_${id}`}><rect x={B.x} y={B.y} width={B.w} height={B.h} /></clipPath></defs>
      <g clipPath={`url(#clip_${id})`}>
        <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="#1d2a44" />
        <GeoImg P={P} href={IMGS.tc} box={BOX.tc} o={L.tc ?? 0} />
        {(L.t850 ?? []).map((t) => <GeoImg key={t.h} P={P} href={IMGS.t850(t.h)} box={BOX.t850} o={t.o} />)}
        {(L.coarse ?? []).map((t) => <GeoImg key={`c${t.n}`} P={P} href={IMGS.coarse(t.n)} box={BOX.coarse} o={t.o} />)}
        {L.dim ? <rect x={B.x} y={B.y} width={B.w} height={B.h} fill={C.bg} opacity={L.dim} /> : null}
        {(L.coast ?? 0.85) > 0 ? <path d={linesPath(P, D.lines.coast_10m)} fill="none" stroke={C.key} strokeOpacity={L.coast ?? 0.85} strokeWidth={2.2} strokeLinejoin="round" /> : null}
        {(L.borders ?? 0) > 0 ? <path d={linesPath(P, D.lines.borders_10m)} fill="none" stroke={C.key} strokeOpacity={L.borders} strokeWidth={1.5} strokeDasharray="8 6" /> : null}
        {children ? children(P) : null}
      </g>
      {(L.frame ?? 1) > 0 ? <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="none" stroke={C.grid} strokeWidth={3} opacity={L.frame ?? 1} /> : null}
      {over ? over(P) : null}
    </Svg>
  );
};
/** a box of true local aspect centred on (latC, lonC) with height `dlat` degrees, drawn at x, y, w, h */
export const boxAt = (latC: number, lonC: number, dlat: number, x: number, y: number, w: number, h: number): MapBox => {
  const c = Math.cos((latC * Math.PI) / 180), dlon = (dlat * (w / h)) / c;
  return { lat0: latC - dlat / 2, lat1: latC + dlat / 2, lon0: lonC - dlon / 2, lon1: lonC + dlon / 2, x, y, w, h };
};
export const Iso: React.FC<{ P: Proj; levels: IsoLevel[]; c?: string; w?: number; o?: number }> = ({ P, levels, c = C.key, w = 2.5, o = 0.85 }) =>
  o <= 0 ? null : <g opacity={o} fill="none">{levels.map((L) => <path key={L.level} d={linesPath(P, L.lines)} stroke={c} strokeWidth={w} strokeLinejoin="round" />)}</g>;
export const Place: React.FC<{ p: Pt; t?: string; o?: number; dx?: number; dy?: number; a?: "start" | "middle" | "end"; c?: string; r?: number; s?: number }> = ({
  p, t, o = 1, dx = 20, dy = -34, a = "start", c = C.gold, r = 11, s = T.key }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <circle cx={p[0]} cy={p[1]} r={r} fill={c} stroke={C.bg} strokeWidth={4} />
      {t ? <Lbl x={p[0] + dx} y={p[1] + dy} t={t} c={C.key} s={s} a={a} /> : null}
    </g>
  );
/** a colour bar with a title above it (what the colours mean) and 48-px tick labels */
export const ColourBar: React.FC<{ x: number; y: number; w: number; lut: string[]; ticks: { v: number; t: string }[]; lo: number; hi: number; unit?: string; o?: number; title?: string }> = ({
  x, y, w, lut, ticks, lo, hi, unit, o = 1, title }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      {title ? <Lbl x={x} y={y - 34} t={title} c={C.muted} s={44} b={false} /> : null}
      {Array.from({ length: 60 }, (_, i) => <rect key={i} x={x + (i * w) / 60} y={y} width={w / 60 + 0.8} height={24} fill={lutCss(lut, (i + 0.5) / 60)} />)}
      <rect x={x} y={y} width={w} height={24} fill="none" stroke={C.muted} strokeWidth={2} />
      {ticks.map((tk) => <Lbl key={tk.t} x={x + ((tk.v - lo) / (hi - lo)) * w} y={y + 56} t={tk.t} c={C.muted} s={48} a="middle" b={false} />)}
      {unit ? <Lbl x={x + w + 18} y={y + 12} t={unit} c={C.muted} s={48} b={false} /> : null}
    </g>
  );

// ---------------------------------------------------------------- x-y charts
export type Ax = { x: number; y: number; w: number; h: number; xr: [number, number]; yr: [number, number] };
export const axX = (A: Ax) => (v: number) => A.x + ((v - A.xr[0]) / (A.xr[1] - A.xr[0])) * A.w;
export const axY = (A: Ax) => (v: number) => A.y + A.h - ((v - A.yr[0]) / (A.yr[1] - A.yr[0])) * A.h;
export const axP = (A: Ax) => (x: number, y: number): Pt => [axX(A)(x), axY(A)(y)];
/** axes with 48-px ticks and axis words (muted); grid lines faint */
export const Axes: React.FC<{ A: Ax; xt: number[]; yt: number[]; xl?: string; yl?: string; o?: number; grid?: boolean; xf?: (v: number) => string; yf?: (v: number) => string;
  ylx?: number; xly?: number }> = ({ A, xt, yt, xl, yl, o = 1, grid = true, xf = (v) => nf(v, 0), yf = (v) => nf(v, 0), ylx, xly }) => {
  if (o <= 0) return null;
  const X = axX(A), Y = axY(A);
  return (
    <g opacity={o}>
      {grid ? yt.map((v) => <line key={`gy${v}`} x1={A.x} y1={Y(v)} x2={A.x + A.w} y2={Y(v)} stroke={C.grid} strokeWidth={1.5} />) : null}
      {grid ? xt.map((v) => <line key={`gx${v}`} x1={X(v)} y1={A.y} x2={X(v)} y2={A.y + A.h} stroke={C.grid} strokeWidth={1.5} />) : null}
      <line x1={A.x} y1={A.y + A.h} x2={A.x + A.w + 8} y2={A.y + A.h} stroke={C.muted} strokeWidth={3} />
      <line x1={A.x} y1={A.y - 8} x2={A.x} y2={A.y + A.h} stroke={C.muted} strokeWidth={3} />
      {xt.map((v) => <Lbl key={`x${v}`} x={X(v)} y={A.y + A.h + 32} t={xf(v)} c={C.muted} s={44} a="middle" b={false} />)}
      {yt.map((v) => <Lbl key={`y${v}`} x={A.x - 14} y={Y(v)} t={yf(v)} c={C.muted} s={44} a="end" b={false} />)}
      {xl ? <Lbl x={A.x + A.w} y={xly ?? Math.min(A.y + A.h + 76, 806)} t={xl} c={C.muted} s={44} a="end" b={false} /> : null}
      {yl ? <Lbl x={ylx ?? A.x + 12} y={A.y - 30} t={yl} c={C.muted} s={44} a="start" b={false} /> : null}
    </g>
  );
};
/** a polyline through (x, y) pairs in chart A, clipped to the chart box; `upto` draws a fraction of it */
export const Curve: React.FC<{ A: Ax; xs: number[]; ys: number[]; c: string; w?: number; o?: number; dash?: string; upto?: number; clipId?: string }> = ({
  A, xs, ys, c, w = 6, o = 1, dash, upto = 1, clipId }) => {
  if (o <= 0 || upto <= 0) return null;
  const P = axP(A), n = Math.max(2, Math.round(xs.length * clamp(upto, 0, 1)));
  const pts: Pt[] = [];
  for (let i = 0; i < Math.min(n, xs.length); i++) if (Number.isFinite(ys[i])) pts.push(P(xs[i], ys[i]));
  return <path d={poly(pts)} fill="none" stroke={c} strokeWidth={w} strokeDasharray={dash} opacity={o} strokeLinejoin="round" strokeLinecap="round"
    clipPath={clipId ? `url(#${clipId})` : undefined} />;
};
export const ClipRect: React.FC<{ id: string; A: Ax; pad?: number }> = ({ id, A, pad = 0 }) =>
  <defs><clipPath id={id}><rect x={A.x - pad} y={A.y - pad} width={A.w + 2 * pad} height={A.h + 2 * pad} /></clipPath></defs>;

// ---------------------------------------------------------------- icons (code-drawn, illustrative)
export const Plane: React.FC<{ p: Pt; a?: number; s?: number; o?: number; c?: string }> = ({ p, a = 0, s = 1, o = 1, c = C.ink }) => o <= 0 ? null : (
  <g opacity={o} transform={`translate(${p[0]} ${p[1]}) rotate(${-a}) scale(${s})`}>
    <path d="M 34 0 L 12 -4 L -2 -28 L -11 -28 L -4 -4 L -22 -4 L -28 -15 L -34 -15 L -30 0 L -34 15 L -28 15 L -22 4 L -4 4 L -11 28 L -2 28 L 12 4 Z"
      fill={c} stroke={C.bg} strokeWidth={3} />
  </g>
);
export const Car: React.FC<{ p: Pt; s?: number; o?: number; c?: string; flip?: boolean }> = ({ p, s = 1, o = 1, c = C.first, flip = false }) => o <= 0 ? null : (
  <g opacity={o} transform={`translate(${p[0]} ${p[1]}) scale(${flip ? -s : s} ${s})`}>
    <path d="M -46 -8 L -40 -26 Q -36 -34 -26 -34 L 12 -34 Q 22 -34 28 -24 L 36 -12 L 46 -10 Q 52 -8 52 0 L 52 6 L -50 6 L -50 -2 Q -50 -8 -46 -8 Z" fill={c} stroke={C.bg} strokeWidth={3} />
    <path d="M -32 -12 L -28 -27 L -6 -27 L -6 -12 Z M 0 -12 L 0 -27 L 14 -27 L 24 -12 Z" fill="#cfe3ff" opacity={0.85} />
    <circle cx={-28} cy={8} r={11} fill="#2a3149" stroke={C.ink} strokeWidth={3} /><circle cx={30} cy={8} r={11} fill="#2a3149" stroke={C.ink} strokeWidth={3} />
  </g>
);
/** a balloon tied to a radiosonde box; anchor = the box */
export const Sonde: React.FC<{ p: Pt; s?: number; o?: number }> = ({ p, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <ellipse cx={p[0]} cy={p[1] - 62 * s} rx={26 * s} ry={30 * s} fill="#eef2f8" stroke={C.bg} strokeWidth={3} />
    <ellipse cx={p[0] - 9 * s} cy={p[1] - 72 * s} rx={6 * s} ry={9 * s} fill="#ffffff" opacity={0.7} />
    <line x1={p[0]} y1={p[1] - 32 * s} x2={p[0]} y2={p[1] - 8 * s} stroke={C.ink} strokeWidth={2.5} />
    <rect x={p[0] - 10 * s} y={p[1] - 8 * s} width={20 * s} height={16 * s} fill={C.second} stroke={C.bg} strokeWidth={2} />
  </g>
);
/** a dial barometer glyph; needle angle from the pressure (hPa) */
export const Barometer: React.FC<{ x: number; y: number; r?: number; hPa: number; o?: number }> = ({ x, y, r = 56, hPa, o = 1 }) => {
  if (o <= 0) return null;
  const a = ((hPa - 1000) / 40) * 1.6;
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r} fill="#1d2740" stroke={C.ink} strokeWidth={5} />
      {Array.from({ length: 9 }, (_, i) => { const t = -2 + i * 0.5; return <line key={i} x1={x + Math.sin(t) * r * 0.72} y1={y - Math.cos(t) * r * 0.72} x2={x + Math.sin(t) * r * 0.9} y2={y - Math.cos(t) * r * 0.9} stroke={C.muted} strokeWidth={3} />; })}
      <line x1={x} y1={y} x2={x + Math.sin(a) * r * 0.78} y2={y - Math.cos(a) * r * 0.78} stroke={C.neg} strokeWidth={5} strokeLinecap="round" />
      <circle cx={x} cy={y} r={6} fill={C.ink} />
    </g>
  );
};
/** a thermometer with a readout bar level 0..1 */
export const Thermo: React.FC<{ x: number; y: number; h?: number; level: number; c?: string; o?: number }> = ({ x, y, h = 120, level, c = C.neg, o = 1 }) => {
  if (o <= 0) return null;
  const w = h * 0.16, r = h * 0.17, L = clamp(level, 0.05, 1);
  return (
    <g opacity={o}>
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx={w / 2} fill={C.ink} stroke={C.bg} strokeWidth={2} />
      <rect x={x - w * 0.24} y={y - h * L} width={w * 0.48} height={h * L} fill={c} />
      <circle cx={x} cy={y} r={r} fill={c} stroke={C.ink} strokeWidth={3} />
    </g>
  );
};
export const Cross: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o} stroke={C.neg} strokeWidth={9 * s} strokeLinecap="round"><line x1={x - 20 * s} y1={y - 20 * s} x2={x + 20 * s} y2={y + 20 * s} /><line x1={x + 20 * s} y1={y - 20 * s} x2={x - 20 * s} y2={y + 20 * s} /></g>
);
/** a small clock-time readout: clock glyph + text */
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

// ---------------------------------------------------------------- globe (three.js, kit_dt)
export const GBOX = { x: 80, y: 40, w: 920, h: 780 };
export const globeG = (cam: GlobeCam, box = GBOX): GProj => {
  const st = globeCam({ ...cam, pp: [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  return globeProj(st, box.w, box.h, box.x, box.y);
};
const FieldSphere: React.FC<{ tex: THREE.Texture | null; o: number; r?: number }> = ({ tex, o, r = 1.002 }) => {
  const geo = React.useMemo(() => sphereGeo(-180, 180, 240, 120, r), [r]);
  const mat = React.useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false }), []);
  if (mat.map !== tex) { mat.map = tex; mat.needsUpdate = true; }
  mat.opacity = o;
  if (!tex || o <= 0) return null;
  return <mesh geometry={geo} material={mat} renderOrder={6} />;
};
export const Globe: React.FC<{ cam: GlobeCam; box?: { x: number; y: number; w: number; h: number }; img?: string; field?: string | null; fieldO?: number;
  coast?: number; o?: number; dim?: number; over?: (G: GProj) => React.ReactNode; grat?: number; drape?: { href: string; box: [number, number, number, number]; o: number } }> = ({
  cam, box = GBOX, img = IMGS.bmng, field = null, fieldO = 0, coast = 0.45, o = 1, dim = 1, over, grat = 0, drape }) => {
  const tex = useTex(img);
  const ftex = useTex(field);
  const dtex = useTex(drape ? drape.href : null);
  const st = globeCam({ ...cam, pp: [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  const G = globeProj(st, box.w, box.h, box.x, box.y);
  if (o <= 0) return null;
  const id = `gc${box.x}_${box.y}_${box.w}`;
  const drapes: Drape[] = drape && dtex ? [{ tex: dtex, lat: [drape.box[0], drape.box[1]], lon: [drape.box[2], drape.box[3]], o: drape.o }] : [];
  return (
    <>
      <View3D st={st} x={box.x} y={box.y} w={box.w} h={box.h} o={tex ? o : 0} key3={st.pos} amb={1.6} dir={1.4}>
        <GlobeMesh tex={tex} dim={dim} drapes={drapes} />
        <FieldSphere tex={ftex} o={fieldO} />
      </View3D>
      <Svg o={o}>
        <defs><clipPath id={id}><rect x={box.x} y={box.y} width={box.w} height={box.h} /></clipPath></defs>
        <g clipPath={`url(#${id})`}>
          {grat > 0 ? <Graticule G={G} step={30} o={grat} /> : null}
          {coast > 0 ? <path d={coastPath(G, D.lines.globe_coast_110m)} fill="none" stroke={C.key} strokeOpacity={coast} strokeWidth={1.6} /> : null}
          {over ? over(G) : null}
        </g>
      </Svg>
    </>
  );
};

// ---------------------------------------------------------------- data-source line (HOUSE_STYLE §5, U-WB-R1), wrapping as in weather basics
const W30 = (t: string, s: number) => textW(t, s) * 0.92;
const srcLines = (t: string, w: number): { s: number; lines: string[] } => {
  for (const s of [30, 28]) {
    if (W30(t, s) <= w) return { s, lines: [t] };
    const toks = t.split(" · ");
    const lines: string[] = [];
    let cur = "";
    for (const q of toks) { const nxt = cur ? `${cur} · ${q}` : q; if (W30(nxt, s) <= w || !cur) cur = nxt; else { lines.push(cur); cur = q; } }
    if (cur) lines.push(cur);
    if (lines.length <= 2 || s === 28) return { s, lines: lines.slice(0, 2) };
  }
  return { s: 28, lines: [t] };
};
/** one small muted line (two at most) at the bottom of the picture on every frame that plots real data; baseline y 860
 * (pictures end at y 820), above the caption band (880-1040). 30 px (rule floor 28), drawn without Lbl's 44-px guard. */
export const SrcLine: React.FC<{ t: string; x?: number; w?: number; o?: number }> = ({ t, x = 80, w = 1760, o = 1 }) => {
  const f = useCurrentFrame();
  const op = o * ramp(f, 0, XF);
  if (op <= 0 || !t) return null;
  const { s, lines } = srcLines(t, w);
  return (
    <Svg>
      {lines.map((ln, k) => <text key={k} x={x} y={860 - (lines.length - 1 - k) * s * 1.15} fill={C.muted} fontSize={s} fontFamily={FONT} fontWeight={500} stroke={C.bg}
        strokeWidth={5} strokeLinejoin="round" paintOrder="stroke" opacity={op}>{ln}</text>)}
    </Svg>
  );
};
export { Arrow, Lbl, Svg, clamp };
