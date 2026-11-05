// Shared pieces of the ch00_gradient movie (#6): timing from timing.json (SS/SE/AT as in the reference movie DotProductWhy.tsx),
// the scene wrapper, the data (gr.json from movies/data/build_ch00_gradient.py, 98 CHECK rows), flat lat/lon map frames (local
// equirectangular, true local shape; the #5 GeoMap with its overflow clip), the idealised hillside frame, x-y charts (house ticks),
// the WebGL globe (kit_gr, copied from #5's kit_co), the SideCallout (links always leave from the label's left edge), colour bars,
// small code-drawn icons and the source-line plumbing. Everything is a pure function of the frame and the data.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { ramp } from "../house";
import timing from "../../ch00/ch00_gradient/timing.json";
import grJ from "../../ch00/ch00_gradient/data/gr.json";
import { C, T } from "../house/kit/type";
import { Arrow, Lbl, Pt, Svg, clamp, textW } from "../house/kit/draw";
import { GlobeCam, GlobeMesh, GProj, Drape, coastPath, globeCam, globeProj, useTex, Graticule } from "./kit_gr/globe";
import { View3D } from "./kit_gr/three3d";
import { lutCss } from "./kit_gr/wb";
import { CurvedLink } from "../house/kit/extras";

export const FPS = 30;
type Snt = { text: string; start: number; end: number };
type Scn = { id: string; start: number; end: number; sentences: Snt[] };
export const sc = (timing as unknown as { scenes: Scn[]; total_frames: number }).scenes;
export const HOLD = 75;
export const XF = 10;
export const GR_FRAMES = (timing as unknown as { total_frames: number }).total_frames + HOLD;
const IDS = sc.map((s) => s.id);
export const K = (id: string) => { const k = IDS.indexOf(id); if (k < 0) throw new Error(`no scene ${id}`); return k; };
export const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
export const END = [...CUT.slice(1), GR_FRAMES];
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
/** text right edge rule (K6 lesson from #5): every text column must end before x 1842 — throws, so the SSR gate fails */
export const fitX = (x: number, t: string, s: number, a: "start" | "middle" | "end" = "start", what = "") => {
  const w = textW(t, s), x1 = a === "start" ? x + w : a === "end" ? x : x + w / 2;
  if (x1 > 1842) throw new Error(`text "${t}" ${what} ends at x ${x1.toFixed(0)} (> 1842)`);
  return x;
};

export const Scene: React.FC<{ children: React.ReactNode; fadeIn?: boolean }> = ({ children, fadeIn = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.bg, opacity: fadeIn ? ramp(f, 0, XF) : 1 }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- data and assets
/* eslint-disable @typescript-eslint/no-explicit-any */
export const D = grJ as any;
export const BROWN = "#a0784e";            // gravity (storyboard colour contract)
export const VIOLET = "#8e6fd8";           // Coriolis (s30 only)
export const PGF = "#f2b27a";              // the pressure-gradient FORCE: light orange, hollow head (never confused with ∇p)
export const IMG = (n: string) => staticFile(`gr_${n}`);
/** every render asset the composition asks for (the SSR gate compares the staticFile calls with the public dir) */
export const ASSET_NAMES = ["bmng.jpg", "mb_s2.jpg", "mb_height.png", "alps_slope.png", "him_blocks.png", "t850.png", "gradt850.png", "cia_speed.png",
  "gfs_speed.png", "sing_floor.jpg", "front_850.png", "front_700.png", "front_500.png", "front_300.png", "sb_modis.jpg", "jet250.png", "sst.png"].map((n) => `gr_${n}`);
export const LUT_TH = D.luts.thermal as string[];
export const LUT_SP = D.luts.speed as string[];
export const LUT_AMP = D.luts.amp as string[];
export const LUT_H = D.luts.height as string[];
export const BREST: [number, number] = D.t850.brest.gp;

// ---------------------------------------------------------------- flat lat/lon maps (local equirectangular: true local shape)
export type MapBox = { lat0: number; lat1: number; lon0: number; lon1: number; x: number; y: number; w: number; h: number };
export type Proj = (lat: number, lon: number) => Pt;
export const mapP = (B: MapBox): Proj => (lat, lon) => [B.x + ((lon - B.lon0) / (B.lon1 - B.lon0)) * B.w, B.y + ((B.lat1 - lat) / (B.lat1 - B.lat0)) * B.h];
/** a box of true local aspect centred on (latC, lonC) with height `dlat` degrees, drawn at x, y, w, h */
export const boxAt = (latC: number, lonC: number, dlat: number, x: number, y: number, w: number, h: number): MapBox => {
  const c = Math.cos(latC * D2R), dlon = (dlat * (w / h)) / c;
  return { lat0: latC - dlat / 2, lat1: latC + dlat / 2, lon0: lonC - dlon / 2, lon1: lonC + dlon / 2, x, y, w, h };
};
export const lerpBox = (A: MapBox, B: MapBox, t: number): MapBox => ({
  lat0: mix(A.lat0, B.lat0, t), lat1: mix(A.lat1, B.lat1, t), lon0: mix(A.lon0, B.lon0, t), lon1: mix(A.lon1, B.lon1, t),
  x: mix(A.x, B.x, t), y: mix(A.y, B.y, t), w: mix(A.w, B.w, t), h: mix(A.h, B.h, t) });
/** a zoom between two boxes in log-scale of the box height (constant apparent zoom speed) */
export const zoomBox = (A: MapBox, B: MapBox, t: number): MapBox => {
  const hA = A.lat1 - A.lat0, hB = B.lat1 - B.lat0, h = Math.exp(mix(Math.log(hA), Math.log(hB), t));
  const s = Math.abs(hB - hA) < 1e-9 ? t : (h - hA) / (hB - hA);
  return lerpBox(A, B, s);
};
/** flat [lon, lat, …] polylines → SVG path */
export const linesPath = (P: Proj, lines: number[][]): string => {
  let d = "";
  for (const ln of lines) {
    for (let k = 0; k < ln.length; k += 2) { const [x, y] = P(ln[k + 1], ln[k]); d += `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`; }
  }
  return d;
};
/** a raster on a [lat0, lat1, lon0, lon1] box (cell edges) */
export const GeoImg: React.FC<{ P: Proj; href: string; box: number[]; o?: number; pixel?: boolean }> = ({ P, href, box, o = 1, pixel = false }) => {
  if (o <= 0) return null;
  const a = P(box[1], box[2]), b = P(box[0], box[3]);
  return <image href={href} x={a[0]} y={a[1]} width={b[0] - a[0]} height={b[1] - a[1]} preserveAspectRatio="none" opacity={o}
    style={pixel ? { imageRendering: "pixelated" } : undefined} />;
};
/** grid-centre box → cell-edge box for a 0.25° product */
export const edges = (b: number[], h = 0.125) => [b[0] - h, b[1] + h, b[2] - h, b[3] + h];
/** a map frame: clip + background + the caller's layers (children get the projector); soft edges while `fade` > 0.
 * #5 K6 clean-up kept: the map body sits in an overflow-hidden <div> of the map box (as well as its clip-path), so the house
 * BoxProbe measures a raster at its visible size. */
export const GeoMap: React.FC<{ id: string; B: MapBox; o?: number; children: (P: Proj) => React.ReactNode; over?: (P: Proj) => React.ReactNode;
  fade?: number; frame?: number; sea?: string }> = ({ id, B, o = 1, children, over, fade = 0, frame = 1, sea = "#1d2a44" }) => {
  if (o <= 0) return null;
  const P = mapP(B);
  const F = 60 * fade;
  return (
    <AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: B.x, top: B.y, width: B.w, height: B.h, overflow: "hidden" }}>
    <svg width={1920} height={1080} style={{ position: "absolute", left: -B.x, top: -B.y }}>
      <defs>
        <clipPath id={`clip_${id}`}><rect x={B.x} y={B.y} width={B.w} height={B.h} /></clipPath>
        {F > 0 ? <linearGradient id={`fx_${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="white" stopOpacity={0} /><stop offset={F / B.w} stopColor="white" />
          <stop offset={1 - F / B.w} stopColor="white" /><stop offset="1" stopColor="white" stopOpacity={0} /></linearGradient> : null}
        {F > 0 ? <linearGradient id={`fy_${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="white" stopOpacity={0} /><stop offset={F / B.h} stopColor="white" />
          <stop offset={1 - F / B.h} stopColor="white" /><stop offset="1" stopColor="white" stopOpacity={0} /></linearGradient> : null}
        {F > 0 ? <mask id={`m_${id}`}><rect x={B.x} y={B.y} width={B.w} height={B.h} fill={`url(#fx_${id})`} /></mask> : null}
        {F > 0 ? <mask id={`m2_${id}`}><rect x={B.x} y={B.y} width={B.w} height={B.h} fill={`url(#fy_${id})`} /></mask> : null}
      </defs>
      <g mask={F > 0 ? `url(#m_${id})` : undefined}><g mask={F > 0 ? `url(#m2_${id})` : undefined}><g clipPath={`url(#clip_${id})`}>
        <rect x={B.x} y={B.y} width={B.w} height={B.h} fill={sea} />
        {children(P)}
      </g></g></g>
    </svg>
    </div>
    <Svg>
      {frame * (1 - fade) > 0 ? <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="none" stroke={C.grid} strokeWidth={3} opacity={frame * (1 - fade)} /> : null}
      {over ? over(P) : null}
    </Svg>
    </AbsoluteFill>
  );
};
/** an outlined map label (a place name / H / L at a spot): the K6 spot-label class (data-lc-maplabel) — never a readout */
export const Place: React.FC<{ p: Pt; t?: string; o?: number; dx?: number; dy?: number; a?: "start" | "middle" | "end"; c?: string; r?: number; s?: number; italic?: boolean;
  tc?: string }> = ({ p, t, o = 1, dx = 20, dy = -34, a = "start", c = C.gold, r = 11, s = T.floor, italic, tc = C.key }) =>
  o <= 0 ? null : (
    <g opacity={o} data-lc-maplabel="1">
      {r > 0 ? <circle cx={p[0]} cy={p[1]} r={r} fill={c} stroke={C.bg} strokeWidth={4} /> : null}
      {t ? <Lbl x={p[0] + dx} y={p[1] + dy} t={t} c={tc} s={s} a={a} italic={italic} /> : null}
    </g>
  );

/** #5 K6 clean-up: a readout in the text column with a gold link that always leaves from the text's LEFT edge (links never start
 * on a label's top edge, so stacked callouts never cross). Lines stack downward at 1.25 × size; anchor start. Inside <Svg>. */
export const SideCallout: React.FC<{ f: number; lines: string[] | string; at: Pt; appear: number; out?: number; target: Pt | null; s?: number; c?: string;
  bend?: number; ctl?: Pt }> = ({ f, lines, at, appear, out, target, s = 54, c = C.key, bend = 30, ctl }) => {
  const L = Array.isArray(lines) ? lines : [lines];
  L.forEach((t) => fitX(at[0], t, s, "start", "(SideCallout)"));
  const op = ramp(f, appear, appear + 8) * (out !== undefined ? 1 - ramp(f, out, out + 10) : 1);
  if (op <= 0) return null;
  return (
    <g opacity={op}>
      {L.map((t, k) => <Lbl key={k} x={at[0]} y={at[1] + k * 1.25 * s} t={t} c={c} s={s} />)}
      {target ? <CurvedLink f={f} from={[at[0] - 14, at[1]]} to={target} start={appear + 6} bend={bend} ctl={ctl} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- colour bar (beside the picture, in the text column)
export const ColourBar: React.FC<{ x: number; y: number; w: number; lut: string[]; ticks: { v: number; t: string }[]; lo: number; hi: number; unit?: string; o?: number;
  title?: string | string[] }> = ({ x, y, w, lut, ticks, lo, hi, unit, o = 1, title }) => {
  if (unit) fitX(x + w + 18, unit, 48, "start", "(colour-bar unit)");
  if (o <= 0) return null;
  return (
    <g opacity={o} data-k6-cbar="1">
      {title ? (Array.isArray(title) ? title : [title]).map((tl, i, arr) => <Lbl key={i} x={x} y={y - 34 - (arr.length - 1 - i) * 52} t={tl} c={C.muted} s={44} b={false} />) : null}
      {Array.from({ length: 60 }, (_, i) => <rect key={i} x={x + (i * w) / 60} y={y} width={w / 60 + 0.8} height={24} fill={lutCss(lut, (i + 0.5) / 60)} />)}
      <rect x={x} y={y} width={w} height={24} fill="none" stroke={C.muted} strokeWidth={2} />
      {ticks.map((tk) => <Lbl key={tk.t} x={x + ((tk.v - lo) / (hi - lo)) * w} y={y + 56} t={tk.t} c={C.muted} s={48} a="middle" b={false} />)}
      {unit ? <Lbl x={x + w + 18} y={y + 12} t={unit} c={C.muted} s={48} b={false} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- x-y charts
export type Ax = { x: number; y: number; w: number; h: number; xr: [number, number]; yr: [number, number] };
export const axX = (A: Ax) => (v: number) => A.x + ((v - A.xr[0]) / (A.xr[1] - A.xr[0])) * A.w;
export const axY = (A: Ax) => (v: number) => A.y + A.h - ((v - A.yr[0]) / (A.yr[1] - A.yr[0])) * A.h;
export const axP = (A: Ax) => (x: number, y: number): Pt => [axX(A)(x), axY(A)(y)];
export const Axes: React.FC<{ A: Ax; xt: number[]; yt: number[]; xl?: string; yl?: string; o?: number; grid?: boolean; xf?: (v: number) => string; yf?: (v: number) => string;
  zero?: boolean }> = ({ A, xt, yt, xl, yl, o = 1, grid = true, xf = (v) => nf(v, 0), yf = (v) => nf(v, 0), zero = false }) => {
  if (o <= 0) return null;
  const X = axX(A), Y = axY(A);
  return (
    <g opacity={o}>
      {grid ? yt.map((v) => <line key={`gy${v}`} x1={A.x} y1={Y(v)} x2={A.x + A.w} y2={Y(v)} stroke={C.grid} strokeWidth={1.5} />) : null}
      {zero ? <line x1={A.x} y1={Y(0)} x2={A.x + A.w} y2={Y(0)} stroke={C.muted} strokeWidth={3} /> : null}
      <line x1={A.x} y1={A.y + A.h} x2={A.x + A.w + 8} y2={A.y + A.h} stroke={C.muted} strokeWidth={3} />
      <line x1={A.x} y1={A.y - 8} x2={A.x} y2={A.y + A.h} stroke={C.muted} strokeWidth={3} />
      {xt.map((v) => <Lbl key={`x${v}`} x={X(v)} y={A.y + A.h + 32} t={xf(v)} c={C.muted} s={44} a="middle" b={false} />)}
      {yt.map((v) => <Lbl key={`y${v}`} x={A.x - 14} y={Y(v)} t={yf(v)} c={C.muted} s={44} a="end" b={false} />)}
      {xl ? <Lbl x={A.x + A.w} y={A.y + A.h + 80} t={xl} c={C.muted} s={44} a="end" b={false} /> : null}
      {yl ? <Lbl x={A.x + 12} y={A.y - 34} t={yl} c={C.muted} s={44} a="start" b={false} /> : null}
    </g>
  );
};
export const Curve: React.FC<{ A: Ax; xs: number[]; ys: number[]; c: string; w?: number; o?: number; dash?: string; upto?: number }> = ({
  A, xs, ys, c, w = 6, o = 1, dash, upto = 1 }) => {
  if (o <= 0 || upto <= 0) return null;
  const P = axP(A), n = Math.max(2, Math.round(xs.length * clamp(upto, 0, 1)));
  const pts: Pt[] = [];
  for (let i = 0; i < Math.min(n, xs.length); i++) if (Number.isFinite(ys[i])) pts.push(P(xs[i], ys[i]));
  return <path d={poly(pts)} fill="none" stroke={c} strokeWidth={w} strokeDasharray={dash} opacity={o} strokeLinejoin="round" strokeLinecap="round" />;
};

// ---------------------------------------------------------------- the idealised hillside (s03-s06, s10-s13, s19-s20): a plan view in km
/** hillside plan frame: origin (the walker) at O, u px per km, x east, y north (screen y down) */
export const HO: Pt = [520, 470];
export const HU = 150;
export const hp = (x: number, y: number): Pt => [HO[0] + x * HU, HO[1] - y * HU];
/** faint contour lines of h = 30 x + 40 y every `dh` m inside the square |x|, |y| ≤ R km (the plan view's ground) */
export const PlaneContours: React.FC<{ o?: number; dh?: number; R?: number; c?: string }> = ({ o = 1, dh = 10, R = 2.6, c = C.key }) => {
  if (o <= 0) return null;
  const out: React.ReactNode[] = [];
  for (let h = -200; h <= 200; h += dh) {
    // 30x + 40y = h: parametrise along the direction (−0.8, 0.6), clipped to the square by sampling
    const pts: Pt[] = [];
    for (let s = -6; s <= 6.001; s += 0.05) {
      const x0 = (h * 30) / 2500, y0 = (h * 40) / 2500, x = x0 - 0.8 * s, y = y0 + 0.6 * s;
      if (Math.abs(x) <= R && Math.abs(y) <= R) pts.push(hp(x, y));
    }
    if (pts.length > 1) out.push(<path key={h} d={poly(pts)} fill="none" stroke={c} strokeWidth={h === 0 ? 2.5 : 2} strokeOpacity={h === 0 ? 0.45 : 0.35} />);
  }
  return <g opacity={o}>{out}</g>;
};
export const HillGround: React.FC<{ o?: number; R?: number }> = ({ o = 1, R = 2.6 }) => o <= 0 ? null : (
  <g opacity={o}>
    <rect x={hp(-R, R)[0]} y={hp(-R, R)[1]} width={2 * R * HU} height={2 * R * HU} rx={22} fill="#22304a" />
  </g>
);
/** house E/N axes on the hillside plan ("east" under the right end of the axis: K6 r1, labels and links near the triangle legs kept it busy above) */
export const AxesEN: React.FC<{ o?: number; R?: number }> = ({ o = 1, R = 2.45 }) => o <= 0 ? null : (
  <g opacity={o}>
    <line x1={hp(-R, 0)[0]} y1={HO[1]} x2={hp(R, 0)[0]} y2={HO[1]} stroke={C.muted} strokeWidth={2.5} strokeDasharray="10 8" />
    <line x1={HO[0]} y1={hp(0, -R)[1]} x2={HO[0]} y2={hp(0, R)[1]} stroke={C.muted} strokeWidth={2.5} strokeDasharray="10 8" />
    <Lbl x={hp(R, 0)[0] - 4} y={HO[1] + 34} t="east" c={C.muted} s={T.floor} a="end" b={false} />
    <Lbl x={HO[0] + 18} y={hp(0, R)[1] + 26} t="north" c={C.muted} s={T.floor} b={false} />
  </g>
);

// ---------------------------------------------------------------- globe (three.js, kit_gr)
export const GB = { x: 60, y: 28, w: 960, h: 790 };   // the house globe frame for the unzoomed scenes (globe ≥ 760 px across at dist 3.4)
export const GFULL = { x: 0, y: 0, w: 1920, h: 1080 };
export const globeG = (cam: GlobeCam, box = GB): GProj => {
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  return globeProj(st, box.w, box.h, box.x, box.y);
};
export const Globe: React.FC<{ cam: GlobeCam; box?: { x: number; y: number; w: number; h: number }; coast?: number; o?: number; dim?: number; grat?: number;
  over?: (G: GProj) => React.ReactNode; meshO?: number; gratStep?: number; gratC?: string; drapes?: Drape[] }> = ({
  cam, box = GB, coast = 0.45, o = 1, dim = 1, over, grat = 0, meshO = 1, gratStep = 30, gratC, drapes = [] }) => {
  const tex = useTex(IMG("bmng.jpg"));
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  const G = globeProj(st, box.w, box.h, box.x, box.y);
  if (o <= 0) return null;
  const id = `gc${box.x}_${box.y}_${box.w}`;
  return (
    <AbsoluteFill>
      <View3D st={st} x={box.x} y={box.y} w={box.w} h={box.h} o={tex ? o * meshO : 0} key3={st.pos} amb={1.6} dir={1.4}>
        <GlobeMesh tex={tex} dim={dim} drapes={drapes} />
      </View3D>
      <Svg o={o}>
        <defs><clipPath id={id}><rect x={box.x} y={box.y} width={box.w} height={box.h} /></clipPath></defs>
        <g clipPath={`url(#${id})`}>
          {grat > 0 ? <Graticule G={G} step={gratStep} o={grat} c={gratC} /> : null}
          {coast > 0 ? <path d={coastPath(G, D.lines.globe_coast_110m)} fill="none" stroke={C.key} strokeOpacity={coast} strokeWidth={1.6} /> : null}
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

/** soft edges round a picture box (a 3-D view or image in its own frame: no hard box, HOUSE_STYLE §5b) */
export const SoftEdges: React.FC<{ id: string; box: { x: number; y: number; w: number; h: number }; px?: number; o?: number }> = ({ id, box, px = 50, o = 1 }) => o <= 0 ? null : (
  <Svg o={o}>
    <defs>
      {([["t", 0, 1, 0, 0], ["b", 0, 0, 0, 1], ["l", 1, 0, 0, 0], ["r", 0, 0, 1, 0]] as [string, number, number, number, number][]).map(([n, x1, y1, x2, y2]) => (
        <linearGradient key={n} id={`se_${id}_${n}`} x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0" stopColor={C.bg} stopOpacity={0} /><stop offset="1" stopColor={C.bg} stopOpacity={1} /></linearGradient>))}
    </defs>
    <rect x={box.x} y={box.y} width={box.w} height={px} fill={`url(#se_${id}_t)`} />
    <rect x={box.x} y={box.y + box.h - px} width={box.w} height={px} fill={`url(#se_${id}_b)`} />
    <rect x={box.x} y={box.y} width={px} height={box.h} fill={`url(#se_${id}_l)`} />
    <rect x={box.x + box.w - px} y={box.y} width={px} height={box.h} fill={`url(#se_${id}_r)`} />
  </Svg>
);

// ---------------------------------------------------------------- icons (code-drawn, illustrative)
export const Walker: React.FC<{ x: number; y: number; s?: number; o?: number; c?: string }> = ({ x, y, s = 1, o = 1, c = C.first }) => o <= 0 ? null : (
  <g opacity={o} stroke={c} strokeWidth={6 * s} strokeLinecap="round" fill="none">
    <circle cx={x} cy={y - 74 * s} r={11 * s} fill={c} />
    <line x1={x} y1={y - 62 * s} x2={x} y2={y - 30 * s} /><line x1={x} y1={y - 30 * s} x2={x - 12 * s} y2={y} /><line x1={x} y1={y - 30 * s} x2={x + 12 * s} y2={y} />
    <line x1={x} y1={y - 54 * s} x2={x + 14 * s} y2={y - 40 * s} /><line x1={x} y1={y - 54 * s} x2={x - 12 * s} y2={y - 42 * s} />
  </g>
);
export const ClockText: React.FC<{ x: number; y: number; t: string; h: number; o?: number; s?: number }> = ({ x, y, t, h, o = 1, s = T.key }) => {
  fitX(x + 46, t, s, "start", "(clock)");
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
/** an arc of radius r about c from angle a0 to a1 (degrees, maths sense: anticlockwise on screen = negative SVG y) */
export const arcD = (c: Pt, r: number, a0: number, a1: number, n = 40) => {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) { const a = (a0 + ((a1 - a0) * i) / n) * D2R; pts.push([c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)]); }
  return poly(pts);
};
/** an open arrow head at the end of an arc (house chevron) */
export const ArcHead: React.FC<{ c: Pt; r: number; a: number; dir: 1 | -1; col: string; o?: number; s?: number }> = ({ c, r, a, dir, col, o = 1, s = 22 }) => {
  if (o <= 0) return null;
  const t = a * D2R, p: Pt = [c[0] + r * Math.cos(t), c[1] - r * Math.sin(t)];
  const tg: Pt = [-Math.sin(t) * dir, -Math.cos(t) * dir];
  const rot = (v: Pt, q: number): Pt => [v[0] * Math.cos(q) - v[1] * Math.sin(q), v[0] * Math.sin(q) + v[1] * Math.cos(q)];
  const h1 = rot([-tg[0], -tg[1]], 0.5), h2 = rot([-tg[0], -tg[1]], -0.5);
  return <polyline points={`${p[0] + h1[0] * s},${p[1] + h1[1] * s} ${p[0]},${p[1]} ${p[0] + h2[0] * s},${p[1] + h2[1] * s}`} fill="none" stroke={col} strokeWidth={5}
    strokeLinecap="round" strokeLinejoin="round" opacity={o} />;
};
/** the pressure-gradient-FORCE arrow: light orange, hollow head (the storyboard colour contract) */
export const ForceArrow: React.FC<{ p: Pt; q: Pt; o?: number; w?: number; head?: number }> = ({ p, q, o = 1, w = 9, head = 38 }) => {
  const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
  if (L < 2 || o <= 0) return null;
  const ux = dx / L, uy = dy / L, h = Math.min(head, 0.6 * L), hw = 0.42 * h, bx = q[0] - ux * h, by = q[1] - uy * h;
  const tri = `${q[0]},${q[1]} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}`;
  return (
    <g opacity={o}>
      <line x1={p[0]} y1={p[1]} x2={bx} y2={by} stroke={C.bg} strokeWidth={w + 6} strokeLinecap="round" />
      <line x1={p[0]} y1={p[1]} x2={bx} y2={by} stroke={PGF} strokeWidth={w} strokeLinecap="round" />
      <polygon points={tri} fill={C.bg} stroke={PGF} strokeWidth={5} strokeLinejoin="round" />
    </g>
  );
};
/** a small code-drawn barometer dial (slate: a fixed observer) */
export const BaroIcon: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 42, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <circle cx={x} cy={y} r={r} fill="#1d2740" stroke={C.local} strokeWidth={5} />
    {Array.from({ length: 7 }, (_, i) => { const t = -1.5 + i * 0.5; return <line key={i} x1={x + Math.sin(t) * r * 0.7} y1={y - Math.cos(t) * r * 0.7} x2={x + Math.sin(t) * r * 0.9} y2={y - Math.cos(t) * r * 0.9} stroke={C.muted} strokeWidth={3} />; })}
    <line x1={x} y1={y} x2={x + Math.sin(0.6) * r * 0.75} y2={y - Math.cos(0.6) * r * 0.75} stroke={C.local} strokeWidth={5} strokeLinecap="round" />
  </g>
);
export const ThermoIcon: React.FC<{ x: number; y: number; s?: number; o?: number; c?: string }> = ({ x, y, s = 1, o = 1, c = C.local }) => o <= 0 ? null : (
  <g opacity={o}>
    <rect x={x - 10 * s} y={y - 70 * s} width={20 * s} height={70 * s} rx={10 * s} fill="#1d2740" stroke={c} strokeWidth={4} />
    <circle cx={x} cy={y + 6 * s} r={16 * s} fill={C.neg} stroke={c} strokeWidth={4} />
    <rect x={x - 4 * s} y={y - 40 * s} width={8 * s} height={44 * s} fill={C.neg} />
  </g>
);
export const HillIcon: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <path d={`M ${x - 60 * s} ${y} Q ${x - 10 * s} ${y - 90 * s} ${x + 10 * s} ${y - 70 * s} Q ${x + 40 * s} ${y - 40 * s} ${x + 60 * s} ${y} Z`} fill="#5d6677" stroke={C.key} strokeWidth={3} />
    <Arrow p={[x - 30 * s, y - 20 * s]} q={[x - 2 * s, y - 64 * s]} color={C.second} w={6} head={20} />
  </g>
);
export { Arrow, Lbl, Svg, clamp };
