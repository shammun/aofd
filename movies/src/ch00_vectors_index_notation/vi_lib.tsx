// Shared pieces of the ch00_vectors_index_notation movie (#1a): timing from timing.json (SS/SE/AT as in the reference
// movie DotProductWhy.tsx), the scene wrapper, the data (vi.json from movies/data/build_ch00_vectors_index_notation.py),
// flat map frames (plate carrée boxes with real images/textures, isolines, wind arrows), the WebGL globe (kit_vi, copied
// from the weather-basics kit) and an orthographic SVG 3-D projector for the axis diagrams (east, north, up).
// Everything is a pure function of the frame and the data.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { ramp } from "../house";
import timing from "../../ch00/ch00_vectors_index_notation/timing.json";
import viJ from "../../ch00/ch00_vectors_index_notation/data/vi.json";
import { C, FONT, T } from "../house/kit/type";
import { Arrow, Lbl, Pt, Svg, clamp } from "../house/kit/draw";
import { GlobeCam, GlobeMesh, GProj, coastPath, globeCam, globeProj, sphereGeo, useTex, Graticule } from "./kit_vi/globe";
import { View3D } from "./kit_vi/three3d";
import { IsoLevel, MapBox, linesPath, lutCss, mapP } from "./kit_vi/wb";

export const FPS = 30;
type Snt = { text: string; start: number; end: number };
type Scn = { id: string; start: number; end: number; sentences: Snt[] };
export const sc = (timing as unknown as { scenes: Scn[]; total_frames: number }).scenes;
export const HOLD = 75;
export const XF = 10;
export const VI_FRAMES = (timing as unknown as { total_frames: number }).total_frames + HOLD;
const IDS = sc.map((s) => s.id);
export const K = (id: string) => { const k = IDS.indexOf(id); if (k < 0) throw new Error(`no scene ${id}`); return k; };
export const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
export const END = [...CUT.slice(1), VI_FRAMES];
export const LEN = (k: number) => END[k] - CUT[k];
export const SS = (k: number, j: number) => { const s = sc[k].sentences[j]; if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`); return Math.round(s.start * FPS) - CUT[k]; };
export const SE = (k: number, j: number) => { const s = sc[k].sentences[j]; if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`); return Math.round(s.end * FPS) - CUT[k]; };
/** frame (scene-relative) at which the quoted words are spoken inside sentence j (character-proportional) */
export const AT = (k: number, j: number, phrase: string) => {
  const s = sc[k].sentences[j];
  if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`);
  const i = s.text.indexOf(phrase);
  if (i < 0) throw new Error(`phrase "${phrase}" not in ${sc[k].id} sentence ${j}`);
  return Math.round((s.start + ((s.end - s.start) * i) / s.text.length) * FPS) - CUT[k];
};
export const fin = (f: number, a: number, n = 12) => ramp(f, a, a + n);
export const fout = (f: number, a: number, n = 10) => 1 - ramp(f, a, a + n);
export const win = (f: number, a: number, b: number, n = 10) => fin(f, a, n) * fout(f, b, n);
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const fmt = (v: number, d = 0) => v.toFixed(d);
export const ease = (t: number) => { const x = clamp(t, 0, 1); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const poly = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");

export const Scene: React.FC<{ children: React.ReactNode; fadeIn?: boolean }> = ({ children, fadeIn = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.bg, opacity: fadeIn ? ramp(f, 0, XF) : 1 }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- data
/* eslint-disable @typescript-eslint/no-explicit-any */
export const D = viJ as any;
export const VIOLET = "#8e6fd8";     // the Coriolis push (TERM.coriolis), as in the cross-product movie
export const LOW_C = "#ff7a8a";      // the house 'L' (weather-basics cartostyle)
export const SUMC = C.key;           // a sum / difference / change arrow: warm white
export const IMGS = {
  globe: staticFile("vi_globe_tc_20231101.jpg"), bmng: staticFile("vi_bmng.jpg"), tc: staticFile("vi_tc_20231101.jpg"),
  t2m: staticFile("vi_t2m_global.png"), relief: staticFile("vi_relief_brittany.png"), jet: staticFile("vi_gfs250_speed.png"),
  t850: (h: number) => staticFile(`vi_t850_${h}.png`),
};
export const BREST: [number, number] = [D.brest.lat, D.brest.lon];
export const BGP: [number, number] = [48.5, -4.5];
export const LUT_T = D.luts.thermal as string[];
export const LUT_S = D.luts.speed as string[];
export const LUT_H = D.luts.haline as string[];
const edges = (o: any): [number, number, number, number] => [o.lat_edges[0], o.lat_edges[1], o.lon_edges[0], o.lon_edges[1]];
export const BOX = {
  tc: edges(D.images.truecolour_1101), relief: edges(D.relief), t850: edges(D.e850.t850["18"].tex), jet: edges(D.jet.tex),
};

// ---------------------------------------------------------------- flat maps
export type Proj = (lat: number, lon: number) => Pt;
/** a geo image stretched into the map frame (SVG <image>) */
export const GeoImg: React.FC<{ P: Proj; href: string; box: [number, number, number, number]; o?: number }> = ({ P, href, box, o = 1 }) => {
  if (o <= 0) return null;
  const a = P(box[1], box[2]), b = P(box[0], box[3]);
  return <image href={href} x={a[0]} y={a[1]} width={b[0] - a[0]} height={b[1] - a[1]} preserveAspectRatio="none" opacity={o} />;
};
export type MapLayers = { tc?: number; relief?: number; t850?: { h: number; o: number }[]; jet?: number; coast?: number; borders?: number;
  dim?: number; frame?: number };
/** A map frame: layers in order (true colour / relief / T850 / jet speed), Natural Earth lines, then the caller's SVG
 * drawn with the same projection. Everything is clipped to the frame box. */
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
        <GeoImg P={P} href={IMGS.relief} box={BOX.relief} o={L.relief ?? 0} />
        {(L.t850 ?? []).map((t) => <GeoImg key={t.h} P={P} href={IMGS.t850(t.h)} box={BOX.t850} o={t.o} />)}
        <GeoImg P={P} href={IMGS.jet} box={BOX.jet} o={L.jet ?? 0} />
        {L.dim ? <rect x={B.x} y={B.y} width={B.w} height={B.h} fill={C.bg} opacity={L.dim} /> : null}
        {(L.coast ?? 0.8) > 0 ? <path d={linesPath(P, D.lines.coast_10m)} fill="none" stroke={C.key} strokeOpacity={L.coast ?? 0.8} strokeWidth={2} strokeLinejoin="round" /> : null}
        {(L.borders ?? 0) > 0 ? <path d={linesPath(P, D.lines.borders_10m)} fill="none" stroke={C.key} strokeOpacity={L.borders} strokeWidth={1.5} strokeDasharray="8 6" /> : null}
        {children ? children(P) : null}
      </g>
      {(L.frame ?? 1) > 0 ? <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="none" stroke={C.grid} strokeWidth={3} opacity={L.frame ?? 1} /> : null}
      {over ? over(P) : null}
    </Svg>
  );
};
/** w/h of a box for a true local aspect at its mid-latitude */
export const boxFor = (lat0: number, lat1: number, lonC: number, x: number, y: number, h: number, w?: number): MapBox => {
  const c = Math.cos(((lat0 + lat1) / 2) * Math.PI / 180);
  if (w === undefined) {
    const dlon = 0; void dlon;
    return { lat0, lat1, lon0: lonC, lon1: lonC, x, y, w: h, h };
  }
  const dlon = ((lat1 - lat0) * (w / h)) / c;
  return { lat0, lat1, lon0: lonC - dlon / 2, lon1: lonC + dlon / 2, x, y, w, h };
};
/** isolines with optional in-line labels at the middle of the longest piece of each level */
export const Iso: React.FC<{ P: Proj; levels: IsoLevel[]; c?: string; w?: number; o?: number; labels?: boolean; fmtL?: (v: number) => string;
  B?: MapBox; draw?: number }> = ({ P, levels, c = C.key, w = 2.5, o = 0.85, labels = false, fmtL = (v) => fmt(v), B, draw = 1 }) => {
  if (o <= 0) return null;
  return (
    <g opacity={o} fill="none">
      {levels.map((L) => <path key={L.level} d={linesPath(P, L.lines)} stroke={c} strokeWidth={w} strokeLinejoin="round" pathLength={draw < 1 ? 1 : undefined}
        strokeDasharray={draw < 1 ? `${draw} 1` : undefined} />)}
      {labels ? levels.map((L) => {
        const ln = L.lines.reduce((a, b) => (b.length > a.length ? b : a), [] as number[]);
        if (ln.length < 8) return null;
        const m = 2 * Math.floor(ln.length / 4);
        const p = P(ln[m + 1], ln[m]);
        if (B && (p[0] < B.x + 40 || p[0] > B.x + B.w - 40 || p[1] < B.y + 30 || p[1] > B.y + B.h - 30)) return null;
        return <Lbl key={`l${L.level}`} x={p[0]} y={p[1]} t={fmtL(L.level)} c={c} s={T.floor} a="middle" />;
      }) : null}
    </g>
  );
};
/** wind arrows [lat, lon, u, v] at `px` per m/s, every arrow with the house halo */
export const Winds: React.FC<{ P: Proj; list: number[][]; px: number; c?: string; w?: number; head?: number; o?: number; grow?: number;
  keep?: (r: number[]) => boolean }> = ({ P, list, px, c = C.first, w = 4, head = 16, o = 1, grow = 1, keep }) => {
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      {list.filter((r) => (keep ? keep(r) : true)).map((r, i) => {
        const p = P(r[0], r[1]), g = clamp(grow * 1.6 - (i % 7) * 0.08, 0, 1);
        const q: Pt = [p[0] + r[2] * px * g, p[1] - r[3] * px * g];
        return <Arrow key={i} p={p} q={q} color={c} w={w} head={head} />;
      })}
    </g>
  );
};
export const Place: React.FC<{ p: Pt; t?: string; o?: number; dx?: number; dy?: number; a?: "start" | "middle" | "end"; c?: string; r?: number; s?: number }> = ({
  p, t, o = 1, dx = 20, dy = -34, a = "start", c = C.gold, r = 11, s = T.key }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <circle cx={p[0]} cy={p[1]} r={r} fill={c} stroke={C.bg} strokeWidth={4} />
      {t ? <Lbl x={p[0] + dx} y={p[1] + dy} t={t} c={C.key} s={s} a={a} /> : null}
    </g>
  );
/** horizontal colour bar with 52-px labels */
export const ColourBar: React.FC<{ x: number; y: number; w: number; lut: string[]; ticks: { v: number; t: string }[]; lo: number; hi: number; unit?: string; o?: number }> = ({
  x, y, w, lut, ticks, lo, hi, unit, o = 1 }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      {Array.from({ length: 60 }, (_, i) => <rect key={i} x={x + (i * w) / 60} y={y} width={w / 60 + 0.8} height={24} fill={lutCss(lut, (i + 0.5) / 60)} />)}
      <rect x={x} y={y} width={w} height={24} fill="none" stroke={C.muted} strokeWidth={2} />
      {ticks.map((tk) => <Lbl key={tk.t} x={x + ((tk.v - lo) / (hi - lo)) * w} y={y + 56} t={tk.t} c={C.muted} s={52} a="middle" b={false} />)}
      {unit ? <Lbl x={x + w + 18} y={y + 12} t={unit} c={C.muted} s={52} b={false} /> : null}
    </g>
  );
/** the 'L' of a low (house red, bold, dark halo) */
export const LowMark: React.FC<{ p: Pt; o?: number; s?: number; hPa?: string }> = ({ p, o = 1, s = 96, hPa }) => o <= 0 ? null : (
  <g opacity={o}>
    <text x={p[0]} y={p[1]} fill={LOW_C} fontSize={s} fontWeight={800} textAnchor="middle" dominantBaseline="central" stroke={C.bg} strokeWidth={10}
      paintOrder="stroke" fontFamily="'Segoe UI', Arial, sans-serif">L</text>
    {hPa ? <Lbl x={p[0]} y={p[1] + s * 0.75} t={hPa} c={LOW_C} s={T.floor} a="middle" /> : null}
  </g>
);

// ---------------------------------------------------------------- globe (three.js, kit_vi)
const FieldSphere: React.FC<{ tex: THREE.Texture | null; o: number; r?: number }> = ({ tex, o, r = 1.002 }) => {
  const geo = React.useMemo(() => sphereGeo(-180, 180, 240, 120, r), [r]);
  const mat = React.useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false }), []);
  if (mat.map !== tex) { mat.map = tex; mat.needsUpdate = true; }
  mat.opacity = o;
  if (!tex || o <= 0) return null;
  return <mesh geometry={geo} material={mat} renderOrder={6} />;
};
export const GBOX = { x: 80, y: 40, w: 920, h: 780 };   // fix 1 (M1): pictures end at y 820
/** the globe projection a <Globe> with this camera and box uses (for links drawn outside its over() layer) */
export const globeG = (cam: GlobeCam, box = GBOX): GProj => {
  const st = globeCam({ ...cam, pp: [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  return globeProj(st, box.w, box.h, box.x, box.y);
};
export const Globe: React.FC<{ cam: GlobeCam; box?: { x: number; y: number; w: number; h: number }; img?: string; field?: string | null; fieldO?: number;
  coast?: number; o?: number; dim?: number; over?: (G: GProj) => React.ReactNode; grat?: number }> = ({
  cam, box = GBOX, img = IMGS.globe, field = null, fieldO = 0, coast = 0.45, o = 1, dim = 1, over, grat = 0 }) => {
  const tex = useTex(img);
  const ftex = useTex(field);
  const st = globeCam({ ...cam, pp: [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  const G = globeProj(st, box.w, box.h, box.x, box.y);
  if (o <= 0) return null;
  const id = `gc${box.x}_${box.y}_${box.w}`;
  return (
    <>
      <View3D st={st} x={box.x} y={box.y} w={box.w} h={box.h} o={tex ? o : 0} key3={st.pos} amb={1.6} dir={1.4}>
        <GlobeMesh tex={tex} dim={dim} />
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
/** billboard fade at the limb (1 facing the camera, 0 at the limb) */
export const limb = (G: GProj, lat: number, lon: number) => {
  const q = G.w(lat, lon), c = G.camPos, d = [c[0] - q[0], c[1] - q[1], c[2] - q[2]], L = Math.hypot(d[0], d[1], d[2]) || 1, n = Math.hypot(q[0], q[1], q[2]) || 1;
  return clamp(((q[0] * d[0] + q[1] * d[1] + q[2] * d[2]) / (L * n) - 0.05) / 0.15, 0, 1);
};

// ---------------------------------------------------------------- orthographic SVG 3-D (x east, y north, z up)
export type V3 = [number, number, number];
export type P3 = { p: (v: V3) => Pt; depth: (v: V3) => number; s: number; az: number; el: number; O: Pt };
/** camera at compass bearing `az` (deg, clockwise from north) and elevation `el` above the floor, looking at the
 * origin; `s` px per world unit; origin drawn at O */
export const proj3 = (az: number, el: number, s: number, O: Pt): P3 => {
  const a = (az * Math.PI) / 180, e = (el * Math.PI) / 180;
  const R: V3 = [-Math.cos(a), Math.sin(a), 0];
  const h: V3 = [Math.sin(a), Math.cos(a), 0];
  const U: V3 = [-h[0] * Math.sin(e), -h[1] * Math.sin(e), Math.cos(e)];
  const Dv: V3 = [h[0] * Math.cos(e), h[1] * Math.cos(e), Math.sin(e)];
  const dot = (u: V3, v: V3) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
  return { p: (v) => [O[0] + s * dot(v, R), O[1] - s * dot(v, U)], depth: (v) => dot(v, Dv), s, az, el, O };
};
export const mixP3 = (A: { az: number; el: number; s: number; O: Pt }, B: { az: number; el: number; s: number; O: Pt }, t: number) =>
  proj3(mix(A.az, B.az, t), mix(A.el, B.el, t), mix(A.s, B.s, t), [mix(A.O[0], B.O[0], t), mix(A.O[1], B.O[1], t)]);
/** the relief floor (ETOPO hillshade image) as an affine-mapped SVG image on z = 0 over world [x0, x1] × [y0, y1],
 * showing the geographic patch centred on (lat, lon) with half-widths dlat, dlon */
export const Floor: React.FC<{ P: P3; x0: number; x1: number; y0: number; y1: number; lat: number; lon: number; dlat: number; dlon: number; o?: number; id: string }> = ({
  P, x0, x1, y0, y1, lat, lon, dlat, dlon, o = 1, id }) => {
  if (o <= 0) return null;
  const IW = 990, IH = 540;
  const [la0, la1, lo0, lo1] = BOX.relief;
  const px = (lo: number) => ((lo - lo0) / (lo1 - lo0)) * IW, py = (la: number) => ((la1 - la) / (la1 - la0)) * IH;
  const i0 = px(lon - dlon), i1 = px(lon + dlon), j0 = py(lat + dlat), j1 = py(lat - dlat);
  // image pixel (i, j) -> world (x0 + (i - i0)/(i1 - i0)·(x1 - x0), y1 - (j - j0)/(j1 - j0)·(y1 - y0), 0) -> screen (affine)
  const S0 = P.p([x0, y1, 0]), Sx = P.p([x1, y1, 0]), Sy = P.p([x0, y0, 0]);
  const ai = [(Sx[0] - S0[0]) / (i1 - i0), (Sx[1] - S0[1]) / (i1 - i0)], aj = [(Sy[0] - S0[0]) / (j1 - j0), (Sy[1] - S0[1]) / (j1 - j0)];
  const e = S0[0] - ai[0] * i0 - aj[0] * j0, f2 = S0[1] - ai[1] * i0 - aj[1] * j0;
  return (
    <g opacity={o} transform={`matrix(${ai[0]} ${ai[1]} ${aj[0]} ${aj[1]} ${e} ${f2})`}>
      <defs><clipPath id={`fl_${id}`}><rect x={i0} y={j0} width={i1 - i0} height={j1 - j0} /></clipPath></defs>
      <image href={IMGS.relief} x={0} y={0} width={IW} height={IH} preserveAspectRatio="none" clipPath={`url(#fl_${id})`} />
      <rect x={i0} y={j0} width={i1 - i0} height={j1 - j0} fill="none" stroke={C.grid} strokeWidth={2 / Math.max(0.2, Math.abs(ai[0]) + Math.abs(aj[1]))} />
    </g>
  );
};
/** a 3-D arrow drawn with the house SVG arrow (projected tail and tip) */
export const Arrow3: React.FC<{ P: P3; a: V3; b: V3; c: string; w?: number; head?: number; o?: number; grow?: number; dash?: string }> = ({
  P, a, b, c, w = 10, head = 40, o = 1, grow = 1, dash }) => {
  if (o <= 0 || grow <= 0) return null;
  const bb: V3 = [a[0] + (b[0] - a[0]) * grow, a[1] + (b[1] - a[1]) * grow, a[2] + (b[2] - a[2]) * grow];
  return <Arrow p={P.p(a)} q={P.p(bb)} color={c} w={w} head={head} o={o} dash={dash} />;
};
export const Line3: React.FC<{ P: P3; a: V3; b: V3; c: string; w?: number; o?: number; dash?: string }> = ({ P, a, b, c, w = 4, o = 1, dash }) => {
  if (o <= 0) return null;
  const p = P.p(a), q = P.p(b);
  return <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={c} strokeWidth={w} strokeDasharray={dash} opacity={o} strokeLinecap="round" />;
};
export const add3 = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];

/** small persistent axes glyph (east, north, up) with labels; `lab` = "words" | "digits" */
export const AxesGlyph: React.FC<{ O: Pt; s?: number; lab?: number; o?: number }> = ({ O, s = 110, lab = 0, o = 1 }) => {
  if (o <= 0) return null;
  const P = proj3(225, 25, s, O);
  const ax: [V3, string, string][] = [[[1, 0, 0], "east", "1"], [[0, 1, 0], "north", "2"], [[0, 0, 1], "up", "3"]];
  return (
    <g opacity={o}>
      {ax.map(([v, w1, d1]) => {
        const q = P.p(v), qq = P.p([v[0] * 1.45, v[1] * 1.45, v[2] * 1.38]);
        return (
          <g key={w1}>
            <Arrow p={O} q={q} color={C.second} w={7} head={24} />
            <Lbl x={qq[0]} y={qq[1]} t={w1} c={C.key} s={T.floor} a="middle" o={1 - lab} />
            <Lbl x={qq[0]} y={qq[1]} t={d1} c={C.gold} s={T.key} a="middle" o={lab} />
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------- data-source line (HOUSE_STYLE §5, user 2026-10-28, U-WB-R1)
/** one small muted line at the bottom of the picture on every frame that plots real data: dataset · time · place.
 * 30 px (the rule's floor is 28 px; below the 44-px type floor on purpose, so it is drawn without Lbl's guard), baseline
 * y 860 (ink ≈ 839–866): in its own band under the pictures (which end at y 820, fix loop 1 M1), above the caption band
 * (880-1040); the QA content/halves gates mask y ≥ 835. Not spoken. */
export const SrcLine: React.FC<{ t: string; x?: number; o?: number }> = ({ t, x = 80, o = 1 }) => {
  const f = useCurrentFrame();
  const op = o * ramp(f, 0, XF);
  if (op <= 0 || !t) return null;
  return (
    <Svg>
      <text x={x} y={860} fill={C.muted} fontSize={30} fontFamily={FONT} fontWeight={500} stroke={C.bg} strokeWidth={5}
        strokeLinejoin="round" paintOrder="stroke" opacity={op}>{t}</text>
    </Svg>
  );
};
