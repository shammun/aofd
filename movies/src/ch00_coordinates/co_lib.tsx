// Shared pieces of the ch00_coordinates movie (#5): timing from timing.json (SS/SE/AT as in the reference movie
// DotProductWhy.tsx), the scene wrapper, the data (co.json from movies/data/build_ch00_coordinates.py, 115 CHECK rows), flat
// lat/lon map frames (local equirectangular, true local shape), projected world maps (precomputed x/a, y/a from
// fluidpy.geo.mapproj.forward; morphs only interpolate), x-y charts (house ticks), the WebGL globe (kit_co, copied from the
// #4 kit), small code-drawn icons (balloon, station, plane, train, house, barometer) and the source-line plumbing.
// Everything is a pure function of the frame and the data.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { ramp } from "../house";
import timing from "../../ch00/ch00_coordinates/timing.json";
import coJ from "../../ch00/ch00_coordinates/data/co.json";
import { C, T } from "../house/kit/type";
import { Arrow, Lbl, Pt, Svg, clamp } from "../house/kit/draw";
import { GlobeCam, GlobeMesh, GProj, coastPath, globeCam, globeProj, useTex, Graticule } from "./kit_co/globe";
import { View3D } from "./kit_co/three3d";
import { lutCss } from "./kit_co/wb";
import { CurvedLink } from "../house/kit/extras";

export const FPS = 30;
type Snt = { text: string; start: number; end: number };
type Scn = { id: string; start: number; end: number; sentences: Snt[] };
export const sc = (timing as unknown as { scenes: Scn[]; total_frames: number }).scenes;
export const HOLD = 75;
export const XF = 10;
export const CO_FRAMES = (timing as unknown as { total_frames: number }).total_frames + HOLD;
const IDS = sc.map((s) => s.id);
export const K = (id: string) => { const k = IDS.indexOf(id); if (k < 0) throw new Error(`no scene ${id}`); return k; };
export const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
export const END = [...CUT.slice(1), CO_FRAMES];
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

export const Scene: React.FC<{ children: React.ReactNode; fadeIn?: boolean }> = ({ children, fadeIn = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.bg, opacity: fadeIn ? ramp(f, 0, XF) : 1 }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- data and assets
/* eslint-disable @typescript-eslint/no-explicit-any */
export const D = coJ as any;
export const BROWN = "#a0784e";            // gravity (storyboard colour contract)
const pad2 = (i: number) => (i < 10 ? `0${i}` : `${i}`);
export const IMGS = {
  bmng: staticFile("co_bmng.jpg"), goes: staticFile("co_goes.jpg"), ian: (h: 18 | 20) => staticFile(`co_ian_speed_${h}.png`),
  goesEye: staticFile("co_goes_eye.jpg"), goesStack: staticFile("co_goes_stack.jpg"), stack: (lv: number) => staticFile(`co_stack_ur_${lv}.png`),
  bm: (k: string) => staticFile(`co_bm_${k}.jpg`), bmA: (k: string) => staticFile(`co_bm_${k}_a.png`), t2m: (k: string) => staticFile(`co_t2m_${k}.png`),
  cia: (i: number) => staticFile(`co_cia_speed_${pad2(i)}.png`),
};
/** every render asset the composition asks for (checked against the public dir by checks/assets_check.mjs) */
export const ASSET_NAMES = ["co_bmng.jpg", "co_goes.jpg", "co_ian_speed_18.png", "co_ian_speed_20.png", "co_goes_eye.jpg", "co_goes_stack.jpg",
  ...[975, 850, 500, 200, 125].map((l) => `co_stack_ur_${l}.png`), ...["pc", "mc", "ee", "go", "ps"].map((k) => `co_bm_${k}.jpg`),
  ...["ee", "go", "ps"].map((k) => `co_bm_${k}_a.png`), "co_t2m_mc.png", "co_t2m_ee.png", ...Array.from({ length: 10 }, (_, i) => `co_cia_speed_${pad2(i)}.png`)];
export const LUT_SPEED = D.luts.speed as string[];
export const LUT_BAL = D.luts.balance as string[];
export const LUT_RAD = D.luts.radial as string[];
export const BREST: [number, number] = D.sphere.brest;
export const LYB: [number, number] = D.sphere.lyb;

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
export const GeoImg: React.FC<{ P: Proj; href: string; box: number[]; o?: number }> = ({ P, href, box, o = 1 }) => {
  if (o <= 0) return null;
  const a = P(box[1], box[2]), b = P(box[0], box[3]);
  return <image href={href} x={a[0]} y={a[1]} width={b[0] - a[0]} height={b[1] - a[1]} preserveAspectRatio="none" opacity={o} />;
};
/** a map frame: clip + background + the caller's layers (children get the projector); soft edges while `fade` > 0 */
export const GeoMap: React.FC<{ id: string; B: MapBox; o?: number; children: (P: Proj) => React.ReactNode; over?: (P: Proj) => React.ReactNode;
  fade?: number; frame?: number; sea?: string }> = ({ id, B, o = 1, children, over, fade = 0, frame = 1, sea = "#1d2a44" }) => {
  if (o <= 0) return null;
  const P = mapP(B);
  const F = 60 * fade;
  // K6 clean-up: the map body sits in an overflow-hidden <div> of the map box (as well as its clip-path), so the house BoxProbe —
  // which crops <image> boxes to overflow-clipping ancestors but not to SVG clip-paths — measures a raster at its visible size
  // (build-1 K6: 120 false text-img hits from the full, unclipped HRRR / GOES image extents). The drawing is unchanged.
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
export const Place: React.FC<{ p: Pt; t?: string; o?: number; dx?: number; dy?: number; a?: "start" | "middle" | "end"; c?: string; r?: number; s?: number; italic?: boolean }> = ({
  p, t, o = 1, dx = 20, dy = -34, a = "start", c = C.gold, r = 11, s = T.floor, italic }) =>
  o <= 0 ? null : (
    <g opacity={o} data-lc-maplabel="1">
      {r > 0 ? <circle cx={p[0]} cy={p[1]} r={r} fill={c} stroke={C.bg} strokeWidth={4} /> : null}
      {t ? <Lbl x={p[0] + dx} y={p[1] + dy} t={t} c={C.key} s={s} a={a} italic={italic} /> : null}
    </g>
  );

// ---------------------------------------------------------------- projected world maps (x/a, y/a from mapproj.forward)
export type PBox = { x: number; y: number; w: number; h: number };
/** page px of map coordinates (x/a, y/a) in a box that fits an extent (xm, ym) */
export const pmap = (B: PBox, ext: [number, number]) => {
  const s = Math.min(B.w / (2 * ext[0]), B.h / (2 * ext[1])), cx = B.x + B.w / 2, cy = B.y + B.h / 2;
  const p = (x: number, y: number): Pt => [cx + x * s, cy - y * s];
  return { p, s, cx, cy, ext };
};
export const xyPath = (p: (x: number, y: number) => Pt, flat: number[], close = false) => {
  let d = "";
  for (let k = 0; k < flat.length; k += 2) { const q = p(flat[k], flat[k + 1]); d += `${k ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`; }
  return close ? `${d}Z` : d;
};
/** the same polyline in two projections, mixed by t (the same points, interpolated: a morph, never new physics) */
export const xyMix = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);
/** the Blue Marble raster of a projection inside its map box (with the projection's alpha mask where it has one) */
export const BmRaster: React.FC<{ id: string; kind: string; B: PBox; o?: number; masked?: boolean; ext: [number, number] }> = ({ id, kind, B, o = 1, masked = false, ext }) => {
  if (o <= 0) return null;
  const { p } = pmap(B, ext);
  const a = p(-ext[0], ext[1]), b = p(ext[0], -ext[1]);
  const w = b[0] - a[0], h = b[1] - a[1];
  return (
    <g opacity={o}>
      {masked ? <defs><mask id={`bm_${id}`}><image href={IMGS.bmA(kind)} x={a[0]} y={a[1]} width={w} height={h} preserveAspectRatio="none" /></mask></defs> : null}
      <image href={IMGS.bm(kind)} x={a[0]} y={a[1]} width={w} height={h} preserveAspectRatio="none" mask={masked ? `url(#bm_${id})` : undefined} />
    </g>
  );
};

/** K6 clean-up: a readout in the text column with a gold link that always leaves from the text's LEFT edge (the house K3
 * Callout starts its link on the box edge facing the target, which for a wide label below another label is the top edge:
 * the link then runs up through the label above). Lines stack downward at 1.25 × size; anchor start. Place inside <Svg>. */
export const SideCallout: React.FC<{ f: number; lines: string[] | string; at: Pt; appear: number; out?: number; target: Pt | null; s?: number; c?: string;
  bend?: number }> = ({ f, lines, at, appear, out, target, s = 54, c = C.key, bend = 30 }) => {
  const L = Array.isArray(lines) ? lines : [lines];
  const op = ramp(f, appear, appear + 8) * (out !== undefined ? 1 - ramp(f, out, out + 10) : 1);
  if (op <= 0) return null;
  return (
    <g opacity={op}>
      {L.map((t, k) => <Lbl key={k} x={at[0]} y={at[1] + k * 1.25 * s} t={t} c={c} s={s} />)}
      {target ? <CurvedLink f={f} from={[at[0] - 14, at[1]]} to={target} start={appear + 6} bend={bend} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- colour bar (beside the picture, in the text column)
export const ColourBar: React.FC<{ x: number; y: number; w: number; lut: string[]; ticks: { v: number; t: string }[]; lo: number; hi: number; unit?: string; o?: number;
  title?: string | string[] }> = ({ x, y, w, lut, ticks, lo, hi, unit, o = 1, title }) =>
  o <= 0 ? null : (
    <g opacity={o} data-k6-cbar="1">
      {title ? (Array.isArray(title) ? title : [title]).map((tl, i, arr) => <Lbl key={i} x={x} y={y - 34 - (arr.length - 1 - i) * 52} t={tl} c={C.muted} s={44} b={false} />) : null}
      {Array.from({ length: 60 }, (_, i) => <rect key={i} x={x + (i * w) / 60} y={y} width={w / 60 + 0.8} height={24} fill={lutCss(lut, (i + 0.5) / 60)} />)}
      <rect x={x} y={y} width={w} height={24} fill="none" stroke={C.muted} strokeWidth={2} />
      {ticks.map((tk) => <Lbl key={tk.t} x={x + ((tk.v - lo) / (hi - lo)) * w} y={y + 56} t={tk.t} c={C.muted} s={48} a="middle" b={false} />)}
      {unit ? <Lbl x={x + w + 18} y={y + 12} t={unit} c={C.muted} s={48} b={false} /> : null}
    </g>
  );
export const SpeedBar: React.FC<{ x: number; y: number; o?: number; hi?: number; w?: number }> = ({ x, y, o = 1, hi = 50, w = 330 }) =>
  <ColourBar x={x} y={y} w={w} lut={LUT_SPEED} lo={0} hi={hi} unit="m/s" o={o} title="wind speed"
    ticks={hi === 50 ? [{ v: 0, t: "0" }, { v: 25, t: "25" }, { v: 50, t: "50" }] : [{ v: 0, t: "0" }, { v: 15, t: "15" }, { v: 30, t: "30" }]} />;

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

// ---------------------------------------------------------------- globe (three.js, kit_co)
export const GB = { x: 60, y: 28, w: 960, h: 790 };   // the house globe frame for the unzoomed scenes (globe ≥ 760 px across at dist 3.4)
export const GFULL = { x: 0, y: 0, w: 1920, h: 1080 };
export const globeG = (cam: GlobeCam, box = GB): GProj => {
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  return globeProj(st, box.w, box.h, box.x, box.y);
};
export const Globe: React.FC<{ cam: GlobeCam; box?: { x: number; y: number; w: number; h: number }; coast?: number; o?: number; dim?: number; grat?: number;
  over?: (G: GProj) => React.ReactNode; cut?: boolean; meshO?: number; gratStep?: number }> = ({
  cam, box = GB, coast = 0.45, o = 1, dim = 1, over, grat = 0, cut = false, meshO = 1, gratStep = 30 }) => {
  const tex = useTex(IMGS.bmng);
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  const G = globeProj(st, box.w, box.h, box.x, box.y);
  if (o <= 0) return null;
  const id = `gc${box.x}_${box.y}_${box.w}`;
  return (
    <AbsoluteFill>
      <View3D st={st} x={box.x} y={box.y} w={box.w} h={box.h} o={tex ? o * meshO : 0} key3={st.pos} amb={1.6} dir={1.4}>
        <GlobeMesh tex={tex} dim={dim} cut={cut} />
      </View3D>
      <Svg o={o}>
        <defs><clipPath id={id}><rect x={box.x} y={box.y} width={box.w} height={box.h} /></clipPath></defs>
        <g clipPath={`url(#${id})`}>
          {grat > 0 ? <Graticule G={G} step={gratStep} o={grat} /> : null}
          {coast > 0 ? <path d={coastPath(G, D.lines.globe_coast_110m.map((l: number[][]) => l.flat()))} fill="none" stroke={C.key} strokeOpacity={coast} strokeWidth={1.6} /> : null}
          {over ? over(G) : null}
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
/** A spinning-globe camera path: lat/dist eased per segment; longitude unwrapped (no slerp, so a segment may run past 180°) and,
 * on a key with `spin: r`, interpolated with a trapezoidal speed profile (ramps of r of the segment at each end, constant speed
 * between) — the Earth's turn under a fixed camera without stop-go easing. Checked by checks/cam_speed.mjs (same code). */
export type SpinKey = { f: number; lat: number; lon: number; dist: number; spin?: number };
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
      return { lat: mix(A.lat, B.lat, e), lon: mix(A.lon, B.lon, tl), dist: mix(A.dist, B.dist, e) };
    }
  }
  return keys[keys.length - 1];
};

/** the silhouette disc of a globe view (for the K1 mask and for placing the text column clear of it) */
export const discOf = (cam: GlobeCam, box = GB): { c: Pt; r: number } => {
  const G = globeG(cam, box);
  const c = G.pw([0, 0, 0]);
  const fov = cam.fov ?? 35, r = (box.h / 2) * Math.tan(Math.asin(1 / Math.max(1.0001, cam.dist))) / Math.tan((fov / 2) * D2R);
  return { c, r };
};

// ---------------------------------------------------------------- icons (code-drawn, illustrative)
export const Balloon: React.FC<{ p: Pt; s?: number; o?: number }> = ({ p, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <ellipse cx={p[0]} cy={p[1] - 62 * s} rx={26 * s} ry={30 * s} fill="#eef2f8" stroke={C.bg} strokeWidth={3} />
    <ellipse cx={p[0] - 9 * s} cy={p[1] - 72 * s} rx={6 * s} ry={9 * s} fill="#ffffff" opacity={0.7} />
    <line x1={p[0]} y1={p[1] - 32 * s} x2={p[0]} y2={p[1] - 8 * s} stroke={C.ink} strokeWidth={2.5} />
    <rect x={p[0] - 10 * s} y={p[1] - 8 * s} width={20 * s} height={16 * s} fill={C.second} stroke={C.bg} strokeWidth={2} />
  </g>
);
export const PlaneIcon: React.FC<{ p: Pt; a?: number; s?: number; o?: number; c?: string }> = ({ p, a = 0, s = 1, o = 1, c = C.ink }) => o <= 0 ? null : (
  <g opacity={o} transform={`translate(${p[0]} ${p[1]}) rotate(${-a}) scale(${s})`}>
    <path d="M 34 0 L 12 -4 L -2 -28 L -11 -28 L -4 -4 L -22 -4 L -28 -15 L -34 -15 L -30 0 L -34 15 L -28 15 L -22 4 L -4 4 L -11 28 L -2 28 L 12 4 Z"
      fill={c} stroke={C.bg} strokeWidth={3} />
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
export const HouseIcon: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -22 0 L -22 -26 L 0 -44 L 22 -26 L 22 0 Z" fill="#e8ecf4" stroke={C.bg} strokeWidth={3} />
    <rect x={-6} y={-16} width={12} height={16} fill={C.local} />
  </g>
);
/** a code-drawn train car (slate) with a walker on it */
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
  const tg: Pt = [-Math.sin(t) * dir, -Math.cos(t) * dir];   // screen tangent in the turning direction
  const rot = (v: Pt, q: number): Pt => [v[0] * Math.cos(q) - v[1] * Math.sin(q), v[0] * Math.sin(q) + v[1] * Math.cos(q)];
  const h1 = rot([-tg[0], -tg[1]], 0.5), h2 = rot([-tg[0], -tg[1]], -0.5);
  return <polyline points={`${p[0] + h1[0] * s},${p[1] + h1[1] * s} ${p[0]},${p[1]} ${p[0] + h2[0] * s},${p[1] + h2[1] * s}`} fill="none" stroke={col} strokeWidth={5}
    strokeLinecap="round" strokeLinejoin="round" opacity={o} />;
};
export { Arrow, Lbl, Svg, clamp };
