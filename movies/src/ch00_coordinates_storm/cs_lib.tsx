// Shared pieces of the ch00_coordinates_storm movie (#5b, Coordinates Part 2): timing from timing.json (SS/SE/AT as in the
// reference movie DotProductWhy.tsx), the scene wrapper, the data (cs.json from movies/data/build_ch00_coordinates_storm.py,
// CHECK rows DS01-DS28), the unit-circle and ring diagrams, flat lat/lon map frames (local equirectangular, true local shape),
// x-y charts (house ticks), SideCallout (links from the text's left edge), colour bars, the skip chip, the house globe
// (kit_cs, copied from build 1) and small code-drawn icons. Adapted from Part 1 (src/ch00_coordinates_flat/cf_lib.tsx).
// Everything is a pure function of the frame and the data.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { ramp } from "../house";
import timing from "../../ch00/ch00_coordinates_storm/timing.json";
import csJ from "../../ch00/ch00_coordinates_storm/data/cs.json";
import { C, T } from "../house/kit/type";
import { Arrow, Lbl, Pt, Svg, clamp, textW } from "../house/kit/draw";
import { CurvedLink } from "../house/kit/extras";
import { Drape, GProj, GlobeCam, GlobeMesh, Graticule, coastPath, globeCam, globeProj, useTex } from "./kit_cs/globe";
import { View3D } from "./kit_cs/three3d";

export const FPS = 30;
type Snt = { text: string; start: number; end: number };
type Scn = { id: string; start: number; end: number; sentences: Snt[] };
export const sc = (timing as unknown as { scenes: Scn[]; total_frames: number }).scenes;
export const HOLD = 75;
export const XF = 10;
export const CST_FRAMES = (timing as unknown as { total_frames: number }).total_frames + HOLD;
const IDS = sc.map((s) => s.id);
export const K = (id: string) => { const k = IDS.indexOf(id); if (k < 0) throw new Error(`no scene ${id}`); return k; };
export const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
export const END = [...CUT.slice(1), CST_FRAMES];
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
/** start frame of the FIRST sentence of scene k that contains `phrase` (for slot scenes that get re-voiced: survives an inserted
 * bridging sentence; throws if the phrase is gone, so a re-voice that drops it fails the render) */
export const SSP = (k: number, phrase: string) => {
  const j = sc[k].sentences.findIndex((q) => q.text.includes(phrase));
  if (j < 0) throw new Error(`no sentence of ${sc[k].id} contains "${phrase}"`);
  return SS(k, j);
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
/** a screen point at angle a (degrees, maths sense: anticlockwise on screen) and radius r about c */
export const polar = (c: Pt, r: number, a: number): Pt => [c[0] + r * Math.cos(a * D2R), c[1] - r * Math.sin(a * D2R)];

export const Scene: React.FC<{ children: React.ReactNode; fadeIn?: boolean }> = ({ children, fadeIn = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.bg, opacity: fadeIn ? ramp(f, 0, XF) : 1 }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- data and assets
/* eslint-disable @typescript-eslint/no-explicit-any */
export const D = csJ as any;
export const SAY = D.say, RING = D.ring, STK = D.stack, SEC = D.sec, AMP = D.amphan, CST = D.coast, FLD = D.flood, NAR = D.flood.nargis;
/** measured rising air (DS29-DS30): the P-3 tail Doppler radar ring means (tdr) and the continuity w of the HRRR inflow (cont) */
export const WV = D.w;
export const ASSET_NAMES = ["cst_goes_eye.jpg", "cst_radar_ktbw.png", "cst_hrrr_s17.png", "cst_ur_925.png", "cst_ur_850.png", "cst_ur_500.png", "cst_ur_200.png",
  "cst_ur_150.png", "cst_sec_ian.png", "cst_sec_amphan.png", "cst_amphan_speed.png", "cst_modis_amphan.jpg", "cst_ian_speed_20.png", "cst_bay_patch.png",
  "cst_swipe_before.jpg", "cst_swipe_after.jpg", "cst_nargis_storm.jpg", "cst_bmng.jpg", "cst_tdr_w.png"] as const;
export const IMG = (n: (typeof ASSET_NAMES)[number]) => staticFile(n);
export const LUT_UR = D.luts.ur as string[], LUT_SPEED = D.luts.speed as string[], LUT_DBZ = D.luts.dbz as string[], LUT_DEPTH = D.luts.depth as string[];
export const LUT_W = D.w.tdr.lut as string[];
/** source lines (house §5: name, time, place; never on the picture) */
export const SRC = {
  hrrr18: "Data: NOAA HRRR analysis · 28 Sep 2022, 18 UTC · centre = the model's calm centre",
  hrrrPl: "Data: NOAA HRRR analysis (pressure levels) · 28 Sep 2022, 18 UTC · centre = the model's calm centre",
  hrrrSec: "Data: NOAA HRRR analysis · 28 Sep 2022, 18 UTC · ring averages round the model's calm centre",
  // the measured updraught (user wording 2026-11-05; the ≈ 8-h offset is said here only, never in the voice)
  tdr: "Vertical wind: NOAA P-3 tail Doppler radar, 28 Sep 2022 ≈ 10 UTC — NOAA AOML Hurricane Research Division · Winds: NOAA HRRR (public domain) · the radar pass is ≈ 8 h before the 18 UTC model winds",
  hrrrPlTdr: "Data: NOAA HRRR analysis, 28 Sep 2022, 18 UTC · up arrows: NOAA P-3 tail Doppler radar, ≈ 10 UTC (NOAA AOML HRD)",
  hrrr20: "Data: HRRR (NOAA) · 28 Sep 2022, 20 UTC · Natural Earth coast",
  surge: "Data: HRRR (NOAA) · 28 Sep 2022, 20 UTC · NOAA CO-OPS gauges · NHC report",
  goes: "Image: NOAA GOES-16 ABI mesoscale · 28 Sep 2022, 18:01 UTC · contrast enhanced",
  radar: "Data: NOAA NEXRAD radar KTBW (Tampa Bay) · 28 Sep 2022, 18:02 UTC · lowest scan",
  ibtAmp: "Data: IBTrACS v04r01 (NOAA NCEI) · Cyclone Amphan, 16-21 May 2020 · NASA Blue Marble · Natural Earth",
  modis: "Image: NASA Worldview (MODIS Terra) · 18 May 2020 · Cyclone Amphan",
  era5: "Data: ERA5 (Copernicus C3S) · 20 May 2020, 06 UTC · Cyclone Amphan",
  flight: "Data: NASA Blue Marble · MODIS NBAR · NOAA ETOPO · IBTrACS v04r01 (NOAA NCEI) · Cyclone Amphan, May 2020",
  nargis: "Images: NASA MODIS (Terra) via Google Earth Engine · bands 7-2-1 · Cyclone Nargis, 21 Apr and 5 May 2008",
  nargisStorm: "Image: NASA Worldview (MODIS Aqua) · 2 May 2008 · Cyclone Nargis",
} as const;
export const lutCss = (lut: string[], t: number) => lut[Math.max(0, Math.min(lut.length - 1, Math.round(t * (lut.length - 1))))];

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
export const kmPx = (B: MapBox, km: number) => (km / 111.2 / (B.lat1 - B.lat0)) * B.h;
/** flat [lon, lat, …] polylines → SVG path */
export const linesPath = (P: Proj, lines: number[][]): string => {
  let d = "";
  for (const ln of lines) for (let k = 0; k < ln.length; k += 2) { const [x, y] = P(ln[k + 1], ln[k]); d += `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`; }
  return d;
};
/** an image whose box is [lat0, lat1, lon0, lon1] */
export const GeoImg: React.FC<{ P: Proj; href: string; box: number[]; o?: number }> = ({ P, href, box, o = 1 }) => {
  if (o <= 0) return null;
  const a = P(box[1], box[2]), b = P(box[0], box[3]);
  return <image href={href} x={a[0]} y={a[1]} width={b[0] - a[0]} height={b[1] - a[1]} preserveAspectRatio="none" opacity={o} />;
};
/** a map frame: the map body sits in an overflow-hidden <div> of the map box (build-1 K6 lesson) + a clip-path; frame stroke and
 * `over` in a full-frame SVG */
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
export const Place: React.FC<{ p: Pt; t?: string; o?: number; dx?: number; dy?: number; a?: "start" | "middle" | "end"; c?: string; r?: number; s?: number }> = ({
  p, t, o = 1, dx = 20, dy = -34, a = "start", c = C.gold, r = 11, s = T.floor }) =>
  o <= 0 ? null : (
    <g opacity={o} data-lc-maplabel="1">
      {r > 0 ? <circle cx={p[0]} cy={p[1]} r={r} fill={c} stroke={C.bg} strokeWidth={4} /> : null}
      {t ? <Lbl x={p[0] + dx} y={p[1] + dy} t={t} c={C.key} s={s} a={a} /> : null}
    </g>
  );
/** a cross marker (centres): one centre per data picture (research §1c) */
export const Cross: React.FC<{ p: Pt; c: string; o?: number; s?: number }> = ({ p, c, o = 1, s = 18 }) => o <= 0 ? null : (
  <g opacity={o} stroke={c} strokeWidth={6} strokeLinecap="round">
    <line x1={p[0] - s} y1={p[1] - s} x2={p[0] + s} y2={p[1] + s} stroke={C.bg} strokeWidth={11} /><line x1={p[0] - s} y1={p[1] + s} x2={p[0] + s} y2={p[1] - s} stroke={C.bg} strokeWidth={11} />
    <line x1={p[0] - s} y1={p[1] - s} x2={p[0] + s} y2={p[1] + s} /><line x1={p[0] - s} y1={p[1] + s} x2={p[0] + s} y2={p[1] - s} />
  </g>
);

/** a readout in the text column with a gold link that always leaves from the text's LEFT edge (build-1 K6 lesson: links never
 * run up through the label above). Lines stack downward at 1.25 × size; anchor start. Place inside <Svg>. */
export const SideCallout: React.FC<{ f: number; lines: string[] | string; at: Pt; appear: number; out?: number; target: Pt | null; s?: number; c?: string;
  bend?: number; ctl?: Pt }> = ({ f, lines, at, appear, out, target, s = 54, c = C.key, bend = 30, ctl }) => {
  const L = Array.isArray(lines) ? lines : [lines];
  L.forEach((t) => { if (at[0] + textW(t, s) > 1842) throw new Error(`SideCallout "${t}" ends at ${(at[0] + textW(t, s)).toFixed(0)} > 1842`); });
  const op = ramp(f, appear, appear + 8) * (out !== undefined ? 1 - ramp(f, out, out + 10) : 1);
  if (op <= 0) return null;
  return (
    <g opacity={op}>
      {L.map((t, k) => <Lbl key={k} x={at[0]} y={at[1] + k * 1.25 * s} t={t} c={c} s={s} />)}
      {target ? <CurvedLink f={f} from={[at[0] - 14, at[1]]} to={target} start={appear + 6} bend={bend} ctl={ctl} /> : null}
    </g>
  );
};
/** a plain text line that must end before x 1842 (the right text margin) */
export const Txt: React.FC<{ x: number; y: number; t: string; c?: string; s?: number; o?: number; a?: "start" | "middle" | "end"; b?: boolean }> = ({ x, y, t, c = C.key, s = T.key, o = 1, a = "start", b }) => {
  const w = textW(t, s), x1 = a === "start" ? x + w : a === "end" ? x : x + w / 2;
  if (x1 > 1842) throw new Error(`text "${t}" ends at ${x1.toFixed(0)} > 1842`);
  return <Lbl x={x} y={y} t={t} c={c} s={s} o={o} a={a} b={b} />;
};

// ---------------------------------------------------------------- maths-skip guidance (user rule 2026-11-05)
/** mm:ss of the "If you skipped, here's what to keep" sentence (the FIRST sentence of the target scene) */
export const keepTime = (id: string) => {
  const s = sc[K(id)], q = s.sentences[0];
  if (!q.text.startsWith("If you skipped")) throw new Error(`${id}: first sentence is not the keep line`);
  const t = Math.floor(q.start), m = Math.floor(t / 60), ss = t % 60;
  return `${m}:${ss < 10 ? "0" : ""}${ss}`;
};
/** The skip chip (an explicit user exception to "no boxes"): shown while the skip sentences (S a..b) are spoken, in the empty
 * lower part of the maths zone: "every step, if you want it" / "skip to mm:ss". Place inside <Svg>. */
export const SkipChip: React.FC<{ f: number; k: number; to: string; a?: number; b?: number; y?: number }> = ({ f, k, to, a = 0, b = 1, y = 740 }) => {
  const t0 = SS(k, a), t1 = SE(k, b) + 120;
  const o = ramp(f, t0, t0 + 10) * (1 - ramp(f, t1, t1 + 10));
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      <rect x={1070} y={y} width={700} height={116} rx={22} fill="#1f2a44" stroke={C.gold} strokeWidth={3} />
      <Lbl x={1100} y={y + 34} t="every step, if you want it" c={C.key} s={T.floor} />
      <Lbl x={1100} y={y + 86} t={`not needed for the weather · skip to ${to}`} c={C.gold} s={T.floor} />
    </g>
  );
};

// ---------------------------------------------------------------- colour bars (beside the picture, in the text column)
export const ColourBar: React.FC<{ x: number; y: number; w: number; lut: string[]; ticks: { v: number; t: string }[]; lo: number; hi: number; unit?: string; o?: number;
  title?: string }> = ({ x, y, w, lut, ticks, lo, hi, unit, o = 1, title }) => {
  if (unit && x + w + 18 + textW(unit, 48) > 1842) throw new Error(`colour bar unit ends past 1842`);
  if (o <= 0) return null;
  return (
    <g opacity={o} data-k6-cbar="1">
      {title ? <Lbl x={x} y={y - 38} t={title} c={C.muted} s={44} b={false} /> : null}
      {Array.from({ length: 60 }, (_, i) => <rect key={i} x={x + (i * w) / 60} y={y} width={w / 60 + 0.8} height={24} fill={lutCss(lut, (i + 0.5) / 60)} />)}
      <rect x={x} y={y} width={w} height={24} fill="none" stroke={C.muted} strokeWidth={2} />
      {ticks.map((tk) => <Lbl key={tk.t} x={x + ((tk.v - lo) / (hi - lo)) * w} y={y + 56} t={tk.t} c={C.muted} s={48} a="middle" b={false} />)}
      {unit ? <Lbl x={x + w + 18} y={y + 12} t={unit} c={C.muted} s={48} b={false} /> : null}
    </g>
  );
};
/** the radial-wind bar: rose "− in" ↔ pale ↔ blue "+ out", symmetric ±16 m/s */
export const URBar: React.FC<{ x: number; y: number; o?: number; w?: number; title?: boolean }> = ({ x, y, o = 1, w = 420, title = true }) => o <= 0 ? null : (
  <g opacity={o}>
    <ColourBar x={x} y={y} w={w} lut={LUT_UR} lo={-16} hi={16} unit="m/s" title={title ? "radial wind" : undefined}
      ticks={[{ v: -16, t: "−16" }, { v: 0, t: "0" }, { v: 16, t: "+16" }]} />
    <Lbl x={x} y={y + 112} t="− in" c={C.neg} s={T.floor} />
    <Lbl x={x + w} y={y + 112} t="+ out" c="#8db5e2" s={T.floor} a="end" />
  </g>
);
export const SpeedBar: React.FC<{ x: number; y: number; o?: number; w?: number; hi?: number }> = ({ x, y, o = 1, w = 300, hi = 50 }) =>
  <ColourBar x={x} y={y} w={w} lut={LUT_SPEED} lo={0} hi={hi} unit="m/s" o={o} title="wind speed"
    ticks={[{ v: 0, t: "0" }, { v: hi / 2, t: `${hi / 2}` }, { v: hi, t: `${hi}` }]} />;

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
      {zero ? <line x1={A.x} y1={Y(0)} x2={A.x + A.w} y2={Y(0)} stroke={C.local} strokeWidth={3} /> : null}
      <line x1={A.x} y1={A.y + A.h} x2={A.x + A.w + 8} y2={A.y + A.h} stroke={C.muted} strokeWidth={3} />
      <line x1={A.x} y1={A.y - 8} x2={A.x} y2={A.y + A.h} stroke={C.muted} strokeWidth={3} />
      {xt.map((v) => <Lbl key={`x${v}`} x={X(v)} y={A.y + A.h + 34} t={xf(v)} c={C.muted} s={44} a="middle" b={false} />)}
      {yt.map((v) => <Lbl key={`y${v}`} x={A.x - 14} y={Y(v)} t={yf(v)} c={C.muted} s={44} a="end" b={false} />)}
      {xl ? <Lbl x={A.x + A.w} y={A.y + A.h + 84} t={xl} c={C.muted} s={44} a="end" b={false} /> : null}
      {yl ? <Lbl x={A.x - 14} y={A.y - 40} t={yl} c={C.muted} s={44} a="start" b={false} /> : null}
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

// ---------------------------------------------------------------- the unit circle (s03-s07) and the ring (s09-s14)
/** an arc of radius r about c from angle a0 to a1 (degrees, maths sense) */
export const arcD = (c: Pt, r: number, a0: number, a1: number, n = 40) => {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) pts.push(polar(c, r, a0 + ((a1 - a0) * i) / n));
  return poly(pts);
};
/** an open chevron at the end of an arc (house link head) */
export const ArcHead: React.FC<{ c: Pt; r: number; a: number; dir: 1 | -1; col: string; o?: number; s?: number }> = ({ c, r, a, dir, col, o = 1, s = 22 }) => {
  if (o <= 0) return null;
  const t = a * D2R, p: Pt = [c[0] + r * Math.cos(t), c[1] - r * Math.sin(t)];
  const tg: Pt = [-Math.sin(t) * dir, -Math.cos(t) * dir];
  const rot = (v: Pt, q: number): Pt => [v[0] * Math.cos(q) - v[1] * Math.sin(q), v[0] * Math.sin(q) + v[1] * Math.cos(q)];
  const h1 = rot([-tg[0], -tg[1]], 0.5), h2 = rot([-tg[0], -tg[1]], -0.5);
  return <polyline points={`${p[0] + h1[0] * s},${p[1] + h1[1] * s} ${p[0]},${p[1]} ${p[0] + h2[0] * s},${p[1] + h2[1] * s}`} fill="none" stroke={col} strokeWidth={5}
    strokeLinecap="round" strokeLinejoin="round" opacity={o} />;
};
/** a filled wedge (gold, the small turn Δθ) */
export const Wedge: React.FC<{ c: Pt; r: number; a0: number; a1: number; o?: number; col?: string }> = ({ c, r, a0, a1, o = 1, col = C.gold }) => o <= 0 ? null :
  <path d={`M${c[0]} ${c[1]} ${arcD(c, r, a0, a1).replace(/^M/, "L")} Z`} fill={col} fillOpacity={0.35 * o} stroke={col} strokeWidth={4} opacity={o} />;
/** a small right-angle tick at p between unit directions u1, u2 (screen) */
export const RTick: React.FC<{ p: Pt; u1: Pt; u2: Pt; s?: number; o?: number; c?: string }> = ({ p, u1, u2, s = 26, o = 1, c = C.ink }) => o <= 0 ? null :
  <path d={`M${p[0] + u1[0] * s} ${p[1] + u1[1] * s} L${p[0] + (u1[0] + u2[0]) * s} ${p[1] + (u1[1] + u2[1]) * s} L${p[0] + u2[0] * s} ${p[1] + u2[1] * s}`}
    fill="none" stroke={c} strokeWidth={4} opacity={o} />;
/** the unit circle diagram frame: circle, axes, centre dot */
export const UnitCircle: React.FC<{ c: Pt; R: number; o?: number }> = ({ c, R, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <line x1={c[0] - R - 50} y1={c[1]} x2={c[0] + R + 60} y2={c[1]} stroke={C.grid} strokeWidth={3} />
    <line x1={c[0]} y1={c[1] + R + 50} x2={c[0]} y2={c[1] - R - 50} stroke={C.grid} strokeWidth={3} />
    <circle cx={c[0]} cy={c[1]} r={R} fill="none" stroke={C.local} strokeWidth={5} />
    <circle cx={c[0]} cy={c[1]} r={9} fill={C.local} />
  </g>
);
/** the parcel on a ring (teal dot) */
export const Parcel: React.FC<{ p: Pt; o?: number; r?: number }> = ({ p, o = 1, r = 15 }) => o <= 0 ? null :
  <circle cx={p[0]} cy={p[1]} r={r} fill={C.first} stroke={C.bg} strokeWidth={4} opacity={o} />;
/** a velocity arrow with moving dashes (the measured arrow, teal; house wind rule) */
export const DashArrow: React.FC<{ f: number; p: Pt; q: Pt; c?: string; w?: number; head?: number; o?: number; speed?: number }> = ({ f, p, q, c = C.first, w = 10, head = 40, o = 1, speed = 1 }) => {
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      <Arrow p={p} q={q} color={c} w={w} head={head} />
      <line x1={p[0]} y1={p[1]} x2={q[0] - (q[0] - p[0]) * 0.25} y2={q[1] - (q[1] - p[1]) * 0.25} stroke={C.bg} strokeWidth={3} strokeDasharray="10 22"
        strokeDashoffset={-((f * 1.6 * speed) % 32)} strokeLinecap="round" />
    </g>
  );
};

// ---------------------------------------------------------------- the house globe (kit_cs = build-1 kit_co, the cross-product look)
export const Globe: React.FC<{ cam: GlobeCam; box?: { x: number; y: number; w: number; h: number }; coast?: number; o?: number; grat?: number;
  over?: (G: GProj) => React.ReactNode; lines?: number[][]; drapes?: Drape[] }> = ({ cam, box = { x: 0, y: 0, w: 1920, h: 1080 }, coast = 0.5, o = 1, grat = 0, over, lines = [], drapes = [] }) => {
  const tex = useTex(IMG("cst_bmng.jpg"));
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  const G = globeProj(st, box.w, box.h, box.x, box.y);
  if (o <= 0) return null;
  return (
    <AbsoluteFill>
      <View3D st={st} x={box.x} y={box.y} w={box.w} h={box.h} o={tex ? o : 0} key3={st.pos} amb={1.6} dir={1.4}>
        <GlobeMesh tex={tex} drapes={drapes} />
      </View3D>
      <Svg o={o}>
        {grat > 0 ? <Graticule G={G} step={10} o={grat} /> : null}
        {coast > 0 ? <path d={coastPath(G, lines)} fill="none" stroke={C.key} strokeOpacity={coast} strokeWidth={1.8} /> : null}
        {over ? over(G) : null}
      </Svg>
    </AbsoluteFill>
  );
};
export { Arrow, Lbl, Svg, clamp };
