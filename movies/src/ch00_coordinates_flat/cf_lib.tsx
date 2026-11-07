// Shared pieces of the ch00_coordinates_flat movie (#5a, Coordinates Part 1): timing from timing.json (SS/SE/AT as in the
// reference movie DotProductWhy.tsx), the scene wrapper, the data (cf.json from movies/data/build_ch00_coordinates_flat.py,
// 58 CHECK rows), the flat local plane round the station, flat lat/lon map frames (local equirectangular, true local shape),
// x-y charts (house ticks), SideCallout, colour bar, small code-drawn icons. Adapted from build 1 (src/ch00_coordinates/co_lib.tsx)
// without the globe. Everything is a pure function of the frame and the data.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { PoleThermometer, ramp } from "../house";
import timing from "../../ch00/ch00_coordinates_flat/timing.json";
import cfJ from "../../ch00/ch00_coordinates_flat/data/cf.json";
import wordsJ from "../../ch00/ch00_coordinates_flat/words.json";
import { C, FONT, T } from "../house/kit/type";
import { Arrow, Lbl as HLbl, Pt, Svg, clamp } from "../house/kit/draw";
import { Keyword as HKeyword } from "../house/kit/notes";
import { CurvedLink } from "../house/kit/extras";
import { KX, texHtml } from "../house/kit/tex";

export const FPS = 30;
type Snt = { text: string; start: number; end: number };
type Scn = { id: string; start: number; end: number; sentences: Snt[] };
export const sc = (timing as unknown as { scenes: Scn[]; total_frames: number }).scenes;
export const HOLD = 75;
export const XF = 10;
export const CF_FRAMES = (timing as unknown as { total_frames: number }).total_frames + HOLD;
const IDS = sc.map((s) => s.id);
export const K = (id: string) => { const k = IDS.indexOf(id); if (k < 0) throw new Error(`no scene ${id}`); return k; };
export const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
export const END = [...CUT.slice(1), CF_FRAMES];
export const LEN = (k: number) => END[k] - CUT[k];
export const SS = (k: number, j: number) => { const s = sc[k].sentences[j]; if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`); return Math.round(s.start * FPS) - CUT[k]; };
export const SE = (k: number, j: number) => { const s = sc[k].sentences[j]; if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`); return Math.round(s.end * FPS) - CUT[k]; };
// fix 1 after fb1 (review 2 Should 11): Kokoro token start times per timing entry (words.json, written by checks/cf_fix1107_splice.py)
type WEnt = { text: string; w: [number, string][] };
const WORDS = (wordsJ as unknown as { scenes: Record<string, Record<string, WEnt>> }).scenes;
const wnorm = (x: string) => x.toLowerCase().replace(/[^a-z0-9']/g, "");
/** seconds from the sentence start at which `phrase` is spoken, from the Kokoro word times; null if no word times for this text */
export const wordTime = (k: number, j: number, phrase: string): number | null => {
  const e = WORDS[sc[k].id]?.[String(j)];
  if (!e || e.text !== sc[k].sentences[j].text) return null;
  const toks = e.w.map(([t, x]) => [t, wnorm(x)] as [number, string]).filter(([, x]) => x);
  const ph = phrase.split(/\s+/).map(wnorm).filter((x) => x);
  // AT uses the first occurrence of the phrase in the text, so the first token match
  for (let i = 0; i + ph.length <= toks.length; i++) if (ph.every((x, q) => toks[i + q][1] === x)) return toks[i][0];
  return null;
};
/** frame (scene-relative) at which the quoted words are spoken inside sentence j: the Kokoro word time when known, else
 *  character-proportional (the house AT) */
export const AT = (k: number, j: number, phrase: string) => {
  const s = sc[k].sentences[j];
  if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`);
  const i = s.text.indexOf(phrase);
  if (i < 0) throw new Error(`phrase "${phrase}" not in ${sc[k].id} sentence ${j}: ${s.text}`);
  const w = wordTime(k, j, phrase);
  if (w !== null) return Math.round((s.start + w) * FPS) - CUT[k];
  return Math.round((s.start + ((s.end - s.start) * i) / s.text.length) * FPS) - CUT[k];
};
export const fin = (f: number, a: number, n = 12) => ramp(f, a, a + n);
/** fix 1 after fb1 (user 2026-11-07): a non-obvious input is highlighted on its spoken word: gold for 45 frames, size +8 % at the peak */
export const hiOn = (f: number, t: number) => f >= t - 2 && f <= t + 45;
export const hiSize = (f: number, t: number, s: number) => s * (1 + 0.08 * Math.sin(Math.PI * clamp((f - t + 2) / 47, 0, 1)));
export const fout = (f: number, a: number, n = 10) => 1 - ramp(f, a, a + n);
export const win = (f: number, a: number, b: number, n = 10) => fin(f, a, n) * fout(f, b, n);
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => { const x = clamp(t, 0, 1); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const prog = (f: number, a: number, b: number) => ease((f - a) / Math.max(1, b - a));
export const poly = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
/** a number with a true minus sign and fixed decimals */
export const nf = (v: number, d = 1, plus = false) => `${v < 0 ? "−" : plus && v > 0 ? "+" : ""}${Math.abs(v).toFixed(d)}`;
export const D2R = Math.PI / 180;
/** rotate a screen vector by deg (maths sense: anticlockwise on screen) */
export const rotS = (v: Pt, deg: number): Pt => { const a = deg * D2R, c = Math.cos(a), s = Math.sin(a); return [v[0] * c + v[1] * s, -v[0] * s + v[1] * c]; };
/** rotate a screen point p about centre o by deg (maths sense) */
export const rotP = (p: Pt, o: Pt, deg: number): Pt => { const v = rotS([p[0] - o[0], p[1] - o[1]], deg); return [o[0] + v[0], o[1] + v[1]]; };

export const Scene: React.FC<{ children: React.ReactNode; fadeIn?: boolean }> = ({ children, fadeIn = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.bg, opacity: fadeIn ? ramp(f, 0, XF) : 1 }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- data and assets
/* eslint-disable @typescript-eslint/no-explicit-any */
export const D = cfJ as any;
export const IAN = D.ian, PL = D.plane, SAY = D.say;
export const IMGS = { ian: staticFile("cf_ian_speed_18.png") };
export const ASSET_NAMES = ["cf_ian_speed_18.png"];
export const LUT_SPEED = D.luts.speed as string[];
/** the source line of every Ian picture (data report §1c: the marker is the model's own calm centre) */
/** fix 1 (review 1 Should 14): shortened so the centre part never wraps into an orphaned "eye" (≤ 2 lines at 620 px) */
export const IAN_SRC = "Data: HRRR analysis (NOAA) · 28 Sep 2022, 18 UTC · centre: model's calm eye, ≈ 17 km SW of radar eye";
export const IAN_SRC_SHORT = "Data: HRRR analysis (NOAA) · 28 Sep 2022, 18 UTC";

export const lutCss = (lut: string[], t: number) => lut[Math.max(0, Math.min(lut.length - 1, Math.round(t * (lut.length - 1))))];

// ---------------------------------------------------------------- the flat local plane round the station (km)
export const PO: Pt = [300, 700], PU = 100;                  // origin on screen, px per km
export const pp = (x: number, y: number): Pt => [PO[0] + x * PU, PO[1] - y * PU];
export const BAL = pp(3, 4);
export const Ground: React.FC<{ o?: number; grid?: number }> = ({ o = 1, grid = 0.5 }) => o <= 0 ? null : (
  <g opacity={o}>
    <rect x={110} y={60} width={880} height={780} rx={18} fill="#22304a" stroke="#4a5677" strokeWidth={3} />
    {Array.from({ length: 9 }, (_, i) => i - 1).map((i) => <line key={`v${i}`} x1={pp(i, 0)[0]} y1={70} x2={pp(i, 0)[0]} y2={830} stroke={C.grid} strokeWidth={1.5} opacity={grid} />)}
    {Array.from({ length: 8 }, (_, j) => j - 1).map((j) => <line key={`h${j}`} x1={120} y1={pp(0, j)[1]} x2={980} y2={pp(0, j)[1]} stroke={C.grid} strokeWidth={1.5} opacity={grid} />)}
  </g>
);
export const Station: React.FC<{ o?: number; at?: Pt; s?: number }> = ({ o = 1, at = PO, s = 0.9 }) => <PoleThermometer x={at[0]} y={at[1]} s={s} o={o} />;
/** east and north axes; `c` = axis colour (fix 1 Should 9: muted in s03 so the orange unit vectors stand out) */
export const AxesEN: React.FC<{ f: number; at: number; o?: number; c?: string }> = ({ f, at, o = 1, c = C.second }) => {
  const g = prog(f, at, at + 30);
  if (g <= 0 || o <= 0) return null;
  return (
    <g opacity={o}>
      <Arrow p={pp(-1.5, 0)} q={[mix(PO[0], 960, g), PO[1]]} color={c} w={6} head={30} />
      <Arrow p={pp(0, -1.2)} q={[PO[0], mix(PO[1], 90, g)]} color={c} w={6} head={30} />
      <Lbl x={952} y={PO[1] - 44} t="east" c={C.key} s={T.floor} a="end" o={fin(f, at + 24)} />
      <Lbl x={PO[0] + 20} y={110} t="north" c={C.key} s={T.floor} o={fin(f, at + 24)} />
    </g>
  );
};
export const KmTicks: React.FC<{ o: number }> = ({ o }) => o <= 0 ? null : (
  <g opacity={o}>
    {[1, 2, 3, 4, 5, 6].map((i) => <g key={`x${i}`}><line x1={pp(i, 0)[0]} y1={PO[1] - 10} x2={pp(i, 0)[0]} y2={PO[1] + 10} stroke={C.muted} strokeWidth={3} />
      <Lbl x={pp(i, 0)[0]} y={PO[1] + 40} t={`${i}`} c={C.muted} s={T.floor} a="middle" b={false} /></g>)}
    {[1, 2, 3, 4, 5].map((j) => <g key={`y${j}`}><line x1={PO[0] - 10} y1={pp(0, j)[1]} x2={PO[0] + 10} y2={pp(0, j)[1]} stroke={C.muted} strokeWidth={3} />
      <Lbl x={PO[0] - 22} y={pp(0, j)[1]} t={`${j}`} c={C.muted} s={T.floor} a="end" b={false} /></g>)}
    <Lbl x={pp(6, 0)[0] + 24} y={PO[1] + 40} t="km" c={C.muted} s={T.floor} b={false} />
  </g>
);

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
/** a map frame: clip + background + the caller's layers (children get the projector); soft edges while `fade` > 0.
 * The map body sits in an overflow-hidden <div> of the map box (build-1 K6 lesson: BoxProbe crops images to overflow-hidden
 * ancestors, not to SVG clip-paths). */
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
export const Place: React.FC<{ p: Pt; t?: string; o?: number; dx?: number; dy?: number; a?: "start" | "middle" | "end"; c?: string; r?: number; s?: number; italic?: boolean }> = ({
  p, t, o = 1, dx = 20, dy = -34, a = "start", c = C.gold, r = 11, s = T.floor, italic }) =>
  o <= 0 ? null : (
    <g opacity={o} data-lc-maplabel="1">
      {r > 0 ? <circle cx={p[0]} cy={p[1]} r={r} fill={c} stroke={C.bg} strokeWidth={4} /> : null}
      {t ? <Lbl x={p[0] + dx} y={p[1] + dy} t={t} c={C.key} s={s} a={a} italic={italic} /> : null}
    </g>
  );

/** a readout in the text column with a gold link that always leaves from the text's LEFT edge (build-1 K6 lesson: links never
 * run up through the label above). Lines stack downward at 1.25 × size; anchor start. Place inside <Svg>. */
export const SideCallout: React.FC<{ f: number; lines: string[] | string; at: Pt; appear: number; out?: number; target: Pt | null; s?: number; c?: string;
  bend?: number; ctl?: Pt }> = ({ f, lines, at, appear, out, target, s = 54, c = C.key, bend = 30, ctl }) => {
  const L = Array.isArray(lines) ? lines : [lines];
  const op = ramp(f, appear, appear + 8) * (out !== undefined ? 1 - ramp(f, out, out + 10) : 1);
  if (op <= 0) return null;
  return (
    <g opacity={op}>
      {L.map((t, k) => <Lbl key={k} x={at[0]} y={at[1] + k * 1.25 * s} t={t} c={c} s={s} />)}
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
/** The skip chip (an explicit user exception to "no boxes"): shown while the two skip sentences (S0-S1) are spoken, in the
 * empty lower part of the maths zone: "every step · optional" / "skip to mm:ss" (fix 1, review 1 Should 5: the user's word
 * "optional"). Place inside <Svg>. */
export const SkipChip: React.FC<{ f: number; k: number; to: string; x0?: number }> = ({ f, k, to, x0 = 1070 }) => {
  const a = SS(k, 0), b = SE(k, 1) + 20;
  const o = ramp(f, a, a + 10) * (1 - ramp(f, b, b + 10));
  if (o <= 0) return null;
  return (
    <g opacity={o} data-lc-own="skipchip">
      <rect x={x0} y={740} width={640} height={116} rx={22} fill="#1f2a44" stroke={C.gold} strokeWidth={3} />
      <Lbl x={x0 + 30} y={774} t="every step · optional" c={C.key} s={T.floor} />
      <Lbl x={x0 + 30} y={826} t={`skip to ${to}`} c={C.gold} s={T.floor} />
    </g>
  );
};

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
export const SpeedBar: React.FC<{ x: number; y: number; o?: number; w?: number }> = ({ x, y, o = 1, w = 300 }) =>
  <ColourBar x={x} y={y} w={w} lut={LUT_SPEED} lo={0} hi={50} unit="m/s" o={o} title="wind speed"
    ticks={[{ v: 0, t: "0" }, { v: 25, t: "25" }, { v: 50, t: "50" }]} />;
/** a compact wind-speed bar for small data pictures (fix 1, review 1 Must 3: the s00 title map, the s03 thumbnail): bar y-9..y+9,
 * ticks 0 / 25 / 50 below (44 px, centre y+42), "wind speed (m/s)" to the right of the bar. Height ≈ 70 px. Place inside <Svg>. */
export const SpeedBarCompact: React.FC<{ x: number; y: number; o?: number; w?: number }> = ({ x, y, o = 1, w = 200 }) =>
  o <= 0 ? null : (
    <g opacity={o} data-k6-cbar="1">
      {Array.from({ length: 40 }, (_, i) => <rect key={i} x={x + (i * w) / 40} y={y - 9} width={w / 40 + 0.8} height={18} fill={lutCss(LUT_SPEED, (i + 0.5) / 40)} />)}
      <rect x={x} y={y - 9} width={w} height={18} fill="none" stroke={C.muted} strokeWidth={2} />
      {[0, 25, 50].map((v) => <Lbl key={v} x={x + (v / 50) * w} y={y + 42} t={`${v}`} c={C.muted} s={T.floor} a="middle" b={false} />)}
      <Lbl x={x + w + 18} y={y} t="wind speed (m/s)" c={C.muted} s={T.floor} b={false} />
    </g>
  );

// ---------------------------------------------------------------- x-y charts
export type Ax = { x: number; y: number; w: number; h: number; xr: [number, number]; yr: [number, number] };
export const axX = (A: Ax) => (v: number) => A.x + ((v - A.xr[0]) / (A.xr[1] - A.xr[0])) * A.w;
export const axY = (A: Ax) => (v: number) => A.y + A.h - ((v - A.yr[0]) / (A.yr[1] - A.yr[0])) * A.h;
export const axP = (A: Ax) => (x: number, y: number): Pt => [axX(A)(x), axY(A)(y)];
export const Axes: React.FC<{ A: Ax; xt: number[]; yt: number[]; xl?: string; yl?: string; o?: number; xf?: (v: number) => string; yf?: (v: number) => string;
  zero?: boolean }> = ({ A, xt, yt, xl, yl, o = 1, xf = (v) => nf(v, 0), yf = (v) => nf(v, 0), zero = false }) => {
  if (o <= 0) return null;
  const X = axX(A), Y = axY(A);
  return (
    <g opacity={o}>
      {yt.map((v) => <line key={`gy${v}`} x1={A.x} y1={Y(v)} x2={A.x + A.w} y2={Y(v)} stroke={C.grid} strokeWidth={1.5} />)}
      {zero ? <line x1={A.x} y1={Y(0)} x2={A.x + A.w} y2={Y(0)} stroke={C.muted} strokeWidth={3} /> : null}
      <line x1={A.x} y1={A.y + A.h} x2={A.x + A.w + 8} y2={A.y + A.h} stroke={C.muted} strokeWidth={3} />
      <line x1={A.x} y1={A.y - 8} x2={A.x} y2={A.y + A.h} stroke={C.muted} strokeWidth={3} />
      {xt.map((v) => <Lbl key={`x${v}`} x={X(v)} y={A.y + A.h + 34} t={xf(v)} c={C.muted} s={44} a="middle" b={false} />)}
      {yt.map((v) => <Lbl key={`y${v}`} x={A.x - 14} y={Y(v)} t={yf(v)} c={C.muted} s={44} a="end" b={false} />)}
      {xl ? <Lbl x={A.x + A.w} y={A.y + A.h + 84} t={xl} c={C.muted} s={44} a="end" b={false} /> : null}
      {yl ? <Lbl x={A.x + 16} y={A.y - 34} t={yl} c={C.muted} s={44} a="start" b={false} /> : null}
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

// ---------------------------------------------------------------- icons (code-drawn, illustrative)
export const Balloon: React.FC<{ p: Pt; s?: number; o?: number }> = ({ p, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <ellipse cx={p[0]} cy={p[1] - 62 * s} rx={26 * s} ry={30 * s} fill="#eef2f8" stroke={C.bg} strokeWidth={3} />
    <ellipse cx={p[0] - 9 * s} cy={p[1] - 72 * s} rx={6 * s} ry={9 * s} fill="#ffffff" opacity={0.7} />
    <line x1={p[0]} y1={p[1] - 32 * s} x2={p[0]} y2={p[1] - 8 * s} stroke={C.ink} strokeWidth={2.5} />
    <rect x={p[0] - 10 * s} y={p[1] - 8 * s} width={20 * s} height={16 * s} fill={C.second} stroke={C.bg} strokeWidth={2} />
  </g>
);
/** a small dot for the balloon on diagram scenes (the full icon is too big next to unit arrows) */
export const BDot: React.FC<{ p: Pt; o?: number; r?: number }> = ({ p, o = 1, r = 13 }) => o <= 0 ? null :
  <circle cx={p[0]} cy={p[1]} r={r} fill={C.key} stroke={C.bg} strokeWidth={4} opacity={o} />;
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
export const ClockText: React.FC<{ x: number; y: number; t: string; min: number; o?: number; s?: number }> = ({ x, y, t, min, o = 1, s = T.key }) => {
  if (o <= 0) return null;
  const a = (min / 60) * 2 * Math.PI, r = 30;
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={C.ink} strokeWidth={4} />
      <line x1={x} y1={y} x2={x + Math.sin(a) * r * 0.75} y2={y - Math.cos(a) * r * 0.75} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      <Lbl x={x + 46} y={y} t={t} c={C.key} s={s} />
    </g>
  );
};
// ---------------------------------------------------------------- maths inside labels (feedback 2026-11-06, lint rule C5)
// A label's maths goes in $…$ and is drawn by KaTeX (the sans font drew θ, α, ×, cos as plain text); the words stay in the house sans
// font. Ported from Part 3 (src/ch00_coordinates_sphere/cs_lib.tsx MathLbl / Keyword): an HTML label in a foreignObject with the same
// font, size, weight, colour, anchor and dark halo as the SVG label, so it can stay inside any <Svg> group. Strings without "$" are
// drawn by the unchanged house Lbl / Keyword.
const segs = (t: string) => t.split("$");
const MathLbl: React.FC<{ x: number; y: number; t: string; c?: string; s?: number; a?: "start" | "middle" | "end"; o?: number; b?: boolean }> = (
  { x, y, t, c = C.ink, s = 54, a = "start", o = 1, b = true }) => {
  if (s < 44) throw new Error(`label "${t}" below 44 px`);
  if (o <= 0) return null;
  const tx = a === "start" ? 0 : a === "middle" ? -50 : -100, hw = Math.max(2, 0.07 * s);
  const halo = [[1, 0], [-1, 0], [0, 1], [0, -1], [0.7, 0.7], [-0.7, 0.7], [0.7, -0.7], [-0.7, -0.7]].map(([u, v]) => `${u * hw}px ${v * hw}px 0 ${C.bg}`).join(",");
  return (
    <foreignObject x={0} y={0} width={1920} height={1080} opacity={o} style={{ overflow: "visible", pointerEvents: "none" }}>
      <div style={{ position: "relative", width: 1920, height: 1080 }}>
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(${tx}%, -50%)`, whiteSpace: "nowrap", fontFamily: FONT, fontSize: s,
          fontWeight: b ? 650 : 500, color: c, lineHeight: 1.15, textShadow: halo }}>
          {segs(t).map((q, i) => (i % 2 ? <span key={i} style={{ fontSize: s / KX }} dangerouslySetInnerHTML={{ __html: texHtml(String.raw`\textstyle ` + q) }} />
            : <span key={i} style={{ whiteSpace: "pre" }}>{q}</span>))}
        </div>
      </div>
    </foreignObject>
  );
};
/** the house SVG label; $…$ parts are KaTeX */
export const Lbl: React.FC<React.ComponentProps<typeof HLbl>> = (p) => (p.t.includes("$") ? <MathLbl {...p} /> : <HLbl {...p} />);
/** the house Keyword; with $…$ maths the same rise / fade (this movie's maths keywords have no pointer targets) */
export const Keyword: React.FC<React.ComponentProps<typeof HKeyword>> = (p) => {
  if (!p.text.includes("$")) return <HKeyword {...p} />;
  const { f, text, at, c = C.key, appear, out, o = 1, s = 54, a = "start" } = p;
  if ((p.targets ?? []).length) throw new Error(`Keyword "${text}": maths keyword with targets`);
  const oT = ramp(f, appear, appear + 8) * (out !== undefined ? 1 - ramp(f, out, out + 10) : 1) * o;
  if (oT <= 0) return null;
  const rise = 12 * (1 - ramp(f, appear, appear + 8));
  return <g opacity={oT}><MathLbl x={at[0]} y={at[1] + rise} t={text} c={c} s={s} a={a} /></g>;
};
export { Arrow, Svg, clamp };

