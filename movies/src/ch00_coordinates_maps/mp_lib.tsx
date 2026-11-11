// Shared pieces of the ch00_coordinates_maps movie (#5g, Coordinates Part 7 "Maps"): timing from timing.json (SS/SE/AT as in the
// reference movie DotProductWhy.tsx), the scene wrapper, the data (mp.json from movies/data/build_ch00_coordinates_maps.py, 110
// CHECK rows), the JS mirrors of fluidpy.geo.mapproj.forward (plate carrée, Mercator, Equal Earth, gores, polar stereographic)
// asserted against Python at module load, flat projected maps (raster + Natural Earth coast in an overflow-hidden box), the
// polar map (Blue Marble, 10 hPa height field, contours, rings and spokes, wind trails), the WebGL globe (kit_mp, from Part 4's
// kit_fr) and the morphing Earth (kit_mp/morph), SideCallout, the maths-skip chip and tag, colour bar, a KaTeX width guard
// (text ends before x 1842) and small code-drawn icons. Adapted from Part 4 (src/ch00_coordinates_frames/fr_lib.tsx) and
// build 1 (src/ch00_coordinates/co_sC.tsx). Everything is a pure function of the frame and the data.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { ramp } from "../house";
import timing from "../../ch00/ch00_coordinates_maps/timing.json";
import mpJ from "../../ch00/ch00_coordinates_maps/data/mp.json";
import { C, FONT, T } from "../house/kit/type";
import { Arrow, Lbl as HLbl, Pt, Svg, clamp, textW } from "../house/kit/draw";
import { Keyword as HKeyword } from "../house/kit/notes";
import { CurvedLink } from "../house/kit/extras";
import { CalcRow, CalcStack as HCalcStack, Layered as HLayered, Part, Layer, TeX as HTeX, plainOf, texHtml, KX } from "../house/kit/tex";
import { FlowParticles, Trails, decodeTrails } from "../house/kit/wind";
import { GlobeCam, GlobeMesh, GProj, coastPath, globeCam, globeProj, useTex, useBin, Graticule, ll } from "./kit_mp/globe";
import { View3D } from "./kit_mp/three3d";
import { CamState, V3, projector } from "./kit_mp/cam";
import { MorphMesh, PosFn } from "./kit_mp/morph";

export const FPS = 30;
type Snt = { text: string; start: number; end: number };
type Scn = { id: string; start: number; end: number; sentences: Snt[] };
export const sc = (timing as unknown as { scenes: Scn[]; total_frames: number }).scenes;
export const HOLD = 75;
export const XF = 10;
export const MP_FRAMES = (timing as unknown as { total_frames: number }).total_frames + HOLD;
const IDS = sc.map((s) => s.id);
export const K = (id: string) => { const k = IDS.indexOf(id); if (k < 0) throw new Error(`no scene ${id}`); return k; };
export const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
export const END = [...CUT.slice(1), MP_FRAMES];
export const LEN = (k: number) => END[k] - CUT[k];
export const SS = (k: number, j: number) => { const s = sc[k].sentences[j]; if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`); return Math.round(s.start * FPS) - CUT[k]; };
export const SE = (k: number, j: number) => { const s = sc[k].sentences[j]; if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`); return Math.round(s.end * FPS) - CUT[k]; };
/** frame (scene-relative) at which the quoted words are spoken inside sentence j (character-proportional) */
export const AT = (k: number, j: number, phrase: string) => {
  const s = sc[k].sentences[j];
  if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`);
  const i = s.text.indexOf(phrase);
  if (i < 0) throw new Error(`phrase "${phrase}" not in ${sc[k].id} sentence ${j}: ${s.text}`);
  // remake 2026-11-07: timed from Kokoro word timestamps when checks/mp_words.py found the phrase (else the character estimate)
  const w = (s as Snt & { words?: [number, string][] }).words;
  if (w) {
    const nm = (x: string) => x.toLowerCase().replace(/[^a-z0-9']/g, "");
    const toks = w.map(([t, x]) => [t, nm(x)] as [number, string]).filter(([, x]) => x);
    const ph = phrase.split(/\s+/).map(nm).filter(Boolean);
    for (let a = 0; a + ph.length <= toks.length; a++) {
      if (ph.every((p, q) => toks[a + q][1] === p)) return Math.round(toks[a][0] * FPS) - CUT[k];
    }
  }
  return Math.round((s.start + ((s.end - s.start) * i) / s.text.length) * FPS) - CUT[k];
};
/** house rule 2026-11-07: the gold highlight of an input / answer on its word (≈ 1.2 s glow, starting 3 frames before the word) */
export const HL = (f: number, a: number) => (f < a - 3 || f > a + 33 ? 0 : Math.sin((Math.PI * (f - a + 3)) / 36));
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
export const D = mpJ as any;
export const IMGS = {
  bmng: staticFile("mp_bmng.jpg"), pc: staticFile("mp_bm_pc.jpg"), mc: staticFile("mp_bm_mc.jpg"), ee: staticFile("mp_bm_ee.png"), ps: staticFile("mp_bm_ps.jpg"),
  z10: staticFile("mp_z10_ps.png"), t2m_mc: staticFile("mp_t2m_mc.png"), t2m_ee: staticFile("mp_t2m_ee.png"), crop: staticFile("mp_brest_crop.jpg"),
  trails: staticFile("mp_trails.bin"),
};
export const BREST: [number, number] = D.consts.brest, LYB: [number, number] = D.consts.lyb;
export const lutCss = (lut: string[], t: number) => lut[Math.max(0, Math.min(lut.length - 1, Math.round(t * (lut.length - 1))))];
/** hats in KaTeX (never a combining hat in a text label) */
export const H = { r: String.raw`\hat{\mathbf r}`, th: String.raw`\hat{\boldsymbol\theta}`, i: String.raw`\mathbf i`, j: String.raw`\mathbf j` };
export const SRC_BM = "Image: NASA Blue Marble NG · Natural Earth";
export const SRC_VX = "Data: NCEP/NCAR R1 · 21 Jan 2026 · 10 hPa · Image: NASA Blue Marble NG";   // build1 K6: one line from x 40 (s00 names Reanalysis 1 in full)
export const SRC_T2M = "Data: ERA5 (Copernicus C3S) · Sep 2026 vs 1991–2020";

// ---------------------------------------------------------------- KaTeX width guard (text ends before x 1842)
/** a rough, slightly generous width of a KaTeX string at effective size s; used only as a layout guard (Part 4 fr_lib) */
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
      if (cmd === "frac" || cmd === "dfrac" || cmd === "tfrac") { const a = group(), b = group(); return Math.max(a, b) * (cmd === "tfrac" ? 0.75 : 1) + 0.2; }
      if (cmd === "text" || cmd === "mathrm") { const j = str.indexOf("}", i); const t = str.slice(i + 1, j); i = j + 1; return t.length * 0.5; }
      if (cmd === "hat" || cmd === "mathbf" || cmd === "boldsymbol" || cmd === "underbrace" || cmd === "cancel" || cmd === "textcolor" || cmd === "sqrt") {
        if (cmd === "textcolor") { group(); } return group() + (cmd === "sqrt" ? 0.9 : 0); }
      if (cmd === "qquad") return 2; if (cmd === "quad") return 1; if (cmd === ",") return 0.17; if (cmd === " " || cmd === ";") return 0.28;
      if (cmd === "approx" || cmd === "equiv" || cmd === "neq" || cmd === "Rightarrow" || cmd === "to" || cmd === "longrightarrow" || cmd === "times" || cmd === "cdot" || cmd === "div") return 1.3;
      if (cmd === "cos" || cmd === "sin" || cmd === "tan" || cmd === "ln") return 1.5;
      if (cmd === "sum") return 1.2;
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
export const guard = (what: string, x0: number, w: number) => { if (x0 + w > 1842) throw new Error(`text "${what.slice(0, 50)}" ends at x ${Math.round(x0 + w)} (> 1842)`); };
/** split a TeX string before each separator (the separator starts the next piece); every separator must exist in order */
export const pieces = (s: string, seps: string[]): string[] => {
  const out: string[] = []; let rest = s;
  for (const sp of seps) { const i = rest.indexOf(sp); if (i <= 0) throw new Error(`pieces: "${sp}" not in "${rest}"`); out.push(rest.slice(0, i)); rest = rest.slice(i); }
  out.push(rest); return out;
};
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
export const CalcStack: React.FC<React.ComponentProps<typeof HCalcStack>> = (p) => {
  p.rows.forEach((r) => guard(sideStr(r.rhs), p.x, texW(sideStr(r.rhs), r.size ?? p.size ?? 68)));
  const rows = withFracH(p.rows, p.size ?? 68);
  stackBottomGuard(rows, p.y, p.size ?? 68, p.maxLines ?? 3);
  return <HCalcStack {...p} rows={rows} />;
};
// ---------------------------------------------------------------- maths inside labels (remake 2026-11-07; symbol lint C5)
// A label's maths goes in $…$ and is drawn by KaTeX; the words stay in the house sans font. Ported verbatim from Part 6's rt_lib (= Part 4's
// fr_lib = Part 3's cs_lib = Part 2's): an HTML label in a foreignObject with the same font, size, weight, colour, anchor and dark halo.
const segs = (t: string) => t.split("$");
/** width of a label with $…$ maths: sans words + KaTeX segments */
export const mixW = (t: string, s: number) => segs(t).reduce((w, q, i) => w + (i % 2 ? texW(q, s) * 0.95 : textW(q, s)), 0);
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
/** the house SVG label with the edge guard; $…$ parts are KaTeX */
export const Lbl: React.FC<React.ComponentProps<typeof HLbl>> = (p) => {
  const s = p.s ?? 54, m = p.t.includes("$"), w = m ? mixW(p.t, s) : textW(p.t, s), a = p.a ?? "start";
  guard(p.t, a === "start" ? p.x : a === "end" ? p.x - w : p.x - w / 2, w * 0.97);
  return m ? <MathLbl {...p} /> : <HLbl {...p} />;
};
/** the house Keyword with the edge guard; with $…$ maths: the same rise / fade, gold target links as CurvedLinks */
export const Keyword: React.FC<React.ComponentProps<typeof HKeyword>> = (p) => {
  const s = p.s ?? 54, m = p.text.includes("$"), w = m ? mixW(p.text, s) : textW(p.text, s), a = p.a ?? "start";
  const x0 = a === "start" ? p.at[0] : a === "end" ? p.at[0] - w : p.at[0] - w / 2;
  guard(p.text, x0, w * 0.97);
  if (!m) return <HKeyword {...p} />;
  const { f, text, at, c = C.key, appear, out, o = 1, targets = [] } = p;
  const oT = ramp(f, appear, appear + 8) * (out !== undefined ? 1 - ramp(f, out, out + 10) : 1) * o;
  if (oT <= 0) return null;
  const rise = 12 * (1 - ramp(f, appear, appear + 8));
  return (
    <g opacity={oT}>
      {targets.map((tg, kk) => <CurvedLink key={kk} f={f} from={[tg[0] < x0 ? x0 - 12 : x0 + w + 12, at[1]]} to={tg} start={appear + 8 + 4 * kk} bend={40} />)}
      <MathLbl x={at[0]} y={at[1] + rise} t={text} c={c} s={s} a={a} />
    </g>
  );
};

// ---------------------------------------------------------------- recalls of earlier parts (remake 2026-11-07, HOUSE_STYLE §3 series parts, R16)
/** An earlier part's result at its point of use (= Part 6's rt_lib Recall = Part 4's fr_lib): the equation (TeX, left edge at x, centre at y)
 * and, under it, the gold keyword "derived in Part K: <name>" (or `lab`); two lines when one is too wide. `tex` may be "" (label only, at y).
 * Place OUTSIDE an <Svg>. */
export const Recall: React.FC<{ f: number; tex: string; name: string; x: number; y: number; appear: number; out?: number; size?: number; c?: string; part?: number;
  gap?: number; lab?: string; glow?: number }> = ({ f, tex, name, x, y, appear, out, size = 54, c = C.ink, part = 1, gap, lab, glow = 0 }) => {
  const o = ramp(f, appear, appear + 10) * (out !== undefined ? 1 - ramp(f, out, out + 10) : 1);
  const head = lab ?? `derived in Part ${part}:`;
  const full = `${head} ${name}`;
  const two = x + textW(full, T.floor) > 1842;
  guard(two ? head : full, x, textW(two ? head : full, T.floor) * 0.97);
  if (two) guard(name, x, textW(name, T.floor) * 0.97);
  if (o <= 0) return null;
  const dy = tex ? (gap ?? (FRAC_ROW.test(tex) ? size * 1.25 : size * 0.85) + 18) : 0;
  return (
    <>
      {tex ? <TeX s={tex} x={x} y={y} size={size} c={c} o={o} glow={glow} /> : null}
      <Svg o={o}><g data-lc-own="recall">{two ? <><HLbl x={x} y={y + dy} t={head} c={C.gold} s={T.floor} />
        <HLbl x={x} y={y + dy + 52} t={name} c={C.gold} s={T.floor} /></> : <HLbl x={x} y={y + dy} t={full} c={C.gold} s={T.floor} />}</g></Svg>
    </>
  );
};

// ---------------------------------------------------------------- JS mirrors of fluidpy.geo.mapproj.forward (a = 1, degrees in)
export type PName = "pc" | "mc" | "ee" | "go" | "ps";
const EE_A = D.ee.A as number[], EE_M = Math.sqrt(3) / 2, K0 = (1 + Math.sin(60 * D2R)) / 2;
const wrapL = (lam: number) => { const x = (lam + Math.PI) % (2 * Math.PI); return (x < 0 ? x + 2 * Math.PI : x) - Math.PI; };
export const goreCentre = (dlam: number, n = 12) => { const w = (2 * Math.PI) / n; const i = clamp(Math.floor((dlam + Math.PI) / w), 0, n - 1); return -Math.PI + (i + 0.5) * w; };
export const psi = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * D2R) / 2));
export const rhoPS = (lat: number) => 2 * K0 * Math.tan(Math.PI / 4 - (lat * D2R) / 2);
/** (x, y) in Earth radii, as mapproj.forward(name, lat, lon, a=1) (lon_0 = 0; polar_stereographic lat_0 90, lat_ts 60) */
export const proj = (name: PName, lat: number, lon: number): Pt => {
  const phi = lat * D2R, dl = wrapL(lon * D2R);
  if (name === "pc") return [dl, phi];
  if (name === "mc") return [dl, Math.log(Math.tan(Math.PI / 4 + phi / 2))];
  if (name === "go") { const lc = goreCentre(dl); return [lc + (dl - lc) * Math.cos(phi), phi]; }
  if (name === "ps") { const r = 2 * K0 * Math.tan(Math.PI / 4 - phi / 2); return [r * Math.sin(dl), -r * Math.cos(dl)]; }
  const [A1, A2, A3, A4] = EE_A;
  const th = Math.asin(EE_M * Math.sin(phi)), t2 = th * th, t6 = t2 * t2 * t2;
  return [(2 * Math.sqrt(3) * dl * Math.cos(th)) / (3 * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))), th * (A1 + A2 * t2 + t6 * (A3 + A4 * t2))];
};
// JS-mirror selftest rows (the motion-graphics "same formula" rule): 16 points per projection vs Python, |Δ| < 1e-9 a
export const JS_ROWS = (() => {
  const key: Record<string, PName> = { platecarree: "pc", mercator: "mc", equalearth: "ee", gores: "go", polar_stereographic: "ps" };
  const rows: { name: string; n: number; maxErr: number }[] = [];
  for (const [nm, J] of Object.entries(D.jscheck as Record<string, { lat: number[]; lon: number[]; x: number[]; y: number[] }>)) {
    let e = 0;
    J.lat.forEach((la, i) => { const p = proj(key[nm], la, J.lon[i]); e = Math.max(e, Math.abs(p[0] - J.x[i]), Math.abs(p[1] - J.y[i])); });
    if (!(e < 1e-8)) throw new Error(`JS mirror ${nm}: max |Δ| ${e} vs fluidpy.geo.mapproj.forward`);
    rows.push({ name: nm, n: J.lat.length, maxErr: e });
  }
  if (rows.length !== 5) throw new Error("jscheck: expected 5 projections");
  return rows;
})();

// ---------------------------------------------------------------- flat projected maps
export type PV = { cx: number; cy: number; s: number };
export const pv = (v: PV) => (x: number, y: number): Pt => [v.cx + x * v.s, v.cy - y * v.s];
export const mixPV = (a: PV, b: PV, t: number): PV => ({ cx: mix(a.cx, b.cx, t), cy: mix(a.cy, b.cy, t), s: mix(a.s, b.s, t) });
/** screen point of (lat, lon) on map v of projection `name` (optionally blended towards projection `b` by t) */
export const mapPt = (v: PV, name: PName, lat: number, lon: number, b?: PName, t = 0): Pt => {
  const p = proj(name, lat, lon);
  const q = b && t > 0 ? proj(b, lat, lon) : p;
  return pv(v)(mix(p[0], q[0], t), mix(p[1], q[1], t));
};
/** a flat [lat, lon, lat, lon, …] polyline → SVG path on a projected map; the pen lifts across the date line and gore cuts */
export const llD = (v: PV, name: PName, flat: number[], b?: PName, t = 0, latClip = 89.9, close = false): string => {
  let d = "", pen = false, lastLon = 0, lastLobe = 0;
  for (let i = 0; i < flat.length; i += 2) {
    const la = flat[i], lo = flat[i + 1];
    if (!Number.isFinite(la) || Math.abs(la) > latClip) { pen = false; continue; }
    const lobe = goreCentre(wrapL(lo * D2R));
    const jump = pen && (Math.abs(lo - lastLon) > 180 || ((name === "go" || b === "go") && lobe !== lastLobe));
    const q = mapPt(v, name, la, lo, b, t);
    d += `${pen && !jump ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
    pen = true; lastLon = lo; lastLobe = lobe;
  }
  return close && d ? d + "Z" : d;
};
export const coastD = (v: PV, name: PName, b?: PName, t = 0, latClip = 89.9) => (D.coast as number[][]).map((L) => llD(v, name, L, b, t, latClip)).join("");
/** the map box of a projection on view v: x ± xr·s, y ± yr·s (mc: up to latTop) */
export const mapBox = (v: PV, name: PName, latTop = 80): { x: number; y: number; w: number; h: number } => {
  const xr = name === "ee" ? D.ext.ee[0] : name === "ps" ? D.ext.ps[0] : Math.PI;
  const yr = name === "pc" ? Math.PI / 2 : name === "mc" ? psi(latTop) : name === "ee" ? D.ext.ee[1] : D.ext.ps[1];
  return { x: v.cx - xr * v.s, y: v.cy - yr * v.s, w: 2 * xr * v.s, h: 2 * yr * v.s };
};
/** a projection's raster (Blue Marble or a data field) placed by its own extent */
export const RasterImg: React.FC<{ v: PV; name: PName; href: string; o?: number }> = ({ v, name, href, o = 1 }) => {
  if (o <= 0) return null;
  const ext: [number, number] = name === "pc" ? D.ext.pc : name === "mc" ? D.ext.mc : name === "ee" ? D.ext.ee : D.ext.ps;
  const p = pv(v), a = p(-ext[0], ext[1]), b = p(ext[0], -ext[1]);
  return <image href={href} x={a[0]} y={a[1]} width={b[0] - a[0]} height={b[1] - a[1]} preserveAspectRatio="none" opacity={o} />;
};
/** A projected world map in an overflow-hidden box (build-1 K6 lesson): raster(s), coast, then `children` inside the clip;
 * `over` in a full-frame SVG on top (labels, links). `box` defaults to the projection's box (Mercator to ±latTop). */
export const ProjMap: React.FC<{ id: string; v: PV; name: PName; o?: number; img?: string | null; imgO?: number; coast?: number; latTop?: number;
  box?: { x: number; y: number; w: number; h: number }; frame?: number; children?: (p: (lat: number, lon: number) => Pt) => React.ReactNode;
  over?: (p: (lat: number, lon: number) => Pt) => React.ReactNode; sea?: string | null; clipEllipse?: boolean }> = ({
  id, v, name, o = 1, img, imgO = 1, coast = 0.75, latTop = 80, box, frame = 1, children, over, sea = "#1d2a44", clipEllipse = false }) => {
  if (o <= 0) return null;
  const B = box ?? mapBox(v, name, latTop);
  const P = (la: number, lo: number) => mapPt(v, name, la, lo);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: B.x, top: B.y, width: B.w, height: B.h, overflow: "hidden" }}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: -B.x, top: -B.y }}>
          <defs><clipPath id={`clip_${id}`}>{clipEllipse ? <path d={eeOutline(v)} /> : <rect x={B.x} y={B.y} width={B.w} height={B.h} />}</clipPath></defs>
          <g clipPath={`url(#clip_${id})`}>
            {sea ? <rect x={B.x} y={B.y} width={B.w} height={B.h} fill={sea} /> : null}
            {img ? <RasterImg v={v} name={name} href={img} o={imgO} /> : null}
            {coast > 0 ? <path d={coastD(v, name, undefined, 0, name === "mc" ? latTop + 2 : 89.9)} fill="none" stroke={C.key} strokeOpacity={coast} strokeWidth={1.6} /> : null}
            {children ? children(P) : null}
          </g>
        </svg>
      </div>
      <Svg>
        {frame > 0 ? (clipEllipse ? <path d={eeOutline(v)} fill="none" stroke={C.grid} strokeWidth={3} opacity={frame} />
          : <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="none" stroke={C.grid} strokeWidth={3} opacity={frame} />) : null}
        {over ? over(P) : null}
      </Svg>
    </AbsoluteFill>
  );
};
/** the Equal Earth outline (the ±180° meridians and the pole lines) on view v */
export const eeOutline = (v: PV) => {
  const pts: Pt[] = [];
  for (let la = -90; la <= 90; la += 3) pts.push(mapPt(v, "ee", la, 180 - 1e-7));
  for (let la = 90; la >= -90; la -= 3) pts.push(mapPt(v, "ee", la, -180));
  return poly(pts) + "Z";
};
/** a Tissot ring (lat/lon outline traced on the real sphere, a = EARTH_RADIUS) on a projected map, optionally blended */
export const tissotD = (v: PV, name: PName, i: number, b?: PName, t = 0) => {
  const R = D.tissot.ll[i] as number[][], flat: number[] = [];
  R[0].forEach((la, j) => flat.push(la, R[1][j]));
  return llD(v, name, flat, b, t, 89.9, true);
};
/** centre of Tissot ring i on a projected map */
export const tissotC = (v: PV, name: PName, i: number, b?: PName, t = 0) => { const c = D.tissot.centres[i] as number[]; return mapPt(v, name, c[0], c[1], b, t); };
// Tissot ring index by place (data order): 0 (0,0) · 1 Brest · 2 (60,0) · 3 Longyearbyen · 4 (60,30) · 5 (30,60) · 6 (30,−60) · 7 (0,−120) · 8 (0,120) · 9 (−30,20) · 10 (−60,−60) · 11 (60,−100)
export const TIS = { eq: 0, brest: 1, n60: 2, lyb: 3, n60e30: 4 } as const;
// JS mirror vs the Python Tissot outline (first 3 points of every ring, plate carrée / Mercator / Equal Earth)
(() => {
  for (const [key, nm] of [["pc", "pc"], ["mc", "mc"], ["ee", "ee"]] as const) {
    (D.tissot[key].xy3 as number[][]).forEach((L, i) => {
      const R = D.tissot.ll[i] as number[][];
      for (let j = 0; j < 3; j++) { const p = proj(nm, R[0][j], R[1][j]); if (Math.abs(p[0] - L[2 * j]) > 2e-4 || Math.abs(p[1] - L[2 * j + 1]) > 2e-4) throw new Error(`Tissot ${key} ring ${i}: JS ${p} vs Python ${L.slice(2 * j, 2 * j + 2)}`); }
    });
  }
})();

// ---------------------------------------------------------------- the polar map (polar stereographic, lat_ts 60, cut at 20 N)
export const VP: PV = { cx: 540, cy: 430, s: 270 };
export const R_PS = rhoPS(D.ps.edge);
export const VPIC = { x: VP.cx - R_PS * VP.s, y: VP.cy - R_PS * VP.s, w: 2 * R_PS * VP.s, h: 2 * R_PS * VP.s };
export const psP = (v: PV = VP) => (lat: number, lon: number): Pt => mapPt(v, "ps", lat, lon);
export const RINGS = [75, 60, 45, 30];
/** ring label spot: on the 225°-of-screen side (lower left of the pole, between the 0 and 90 W spokes), clear of the land labels */
export const ringLabelAt = (v: PV, la: number): Pt => { const r = rhoPS(la) * v.s; const a = 202 * D2R; return [v.cx + r * Math.cos(a) - 14, v.cy - r * Math.sin(a) + 30]; };
export const spokeEnd = (v: PV, lon: number, r = R_PS): Pt => { const p = proj("ps", 0, lon), n = Math.hypot(p[0], p[1]); return pv(v)((p[0] / n) * r, (p[1] / n) * r); };
/** trails of the frozen 21 Jan 2026 10 hPa wind (advect_on_sphere, 1 frame = 30 min) */
export const useTrails = (): Trails | null => decodeTrails(useBin(IMGS.trails), D.trails.n, D.trails.L);
export const PolarMap: React.FC<{ f: number; v?: PV; o?: number; base?: number; field?: number; cont?: number; rings?: number; spokes?: number; ringLbl?: number;
  spokeLbl?: number; trails?: number; trailFr?: number; bright?: (lat: number) => number; dimBase?: number; children?: (p: (lat: number, lon: number) => Pt) => React.ReactNode;
  over?: (p: (lat: number, lon: number) => Pt) => React.ReactNode; hiRing?: number[]; hiSpoke?: number[]; hiO?: number; id?: string }> = ({
  f, v = VP, o = 1, base = 1, field = 0, cont = 0, rings = 0.55, spokes = 0.45, ringLbl = 0, spokeLbl = 0, trails = 0, trailFr, bright, dimBase = 0.25,
  children, over, hiRing = [], hiSpoke = [], hiO = 0, id = "pm" }) => {
  const TR = useTrails();
  if (o <= 0) return null;
  const P = psP(v), R = R_PS * v.s;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Svg>
        <defs><clipPath id={`${id}c`}><circle cx={v.cx} cy={v.cy} r={R} /></clipPath></defs>
        <g clipPath={`url(#${id}c)`}>
          <rect x={v.cx - R} y={v.cy - R} width={2 * R} height={2 * R} fill="#1a2440" />
          <RasterImg v={v} name="ps" href={IMGS.ps} o={base} />
          <circle cx={v.cx} cy={v.cy} r={R} fill={C.bg} opacity={dimBase * base} />
          <RasterImg v={v} name="ps" href={IMGS.z10} o={0.88 * field} />
          {RINGS.map((la) => <circle key={la} cx={v.cx} cy={v.cy} r={rhoPS(la) * v.s} fill="none" stroke={C.local} strokeWidth={2.5} opacity={rings} />)}
          {Array.from({ length: 12 }, (_, i) => i * 30).map((lo) => { const q = spokeEnd(v, lo); return <line key={lo} x1={v.cx} y1={v.cy} x2={q[0]} y2={q[1]} stroke={C.local} strokeWidth={2} opacity={spokes} />; })}
          {hiO > 0 ? <g opacity={hiO}>
            {hiRing.map((la) => <circle key={la} cx={v.cx} cy={v.cy} r={rhoPS(la) * v.s} fill="none" stroke={C.gold} strokeWidth={5} />)}
            {hiSpoke.map((lo) => { const q = spokeEnd(v, lo); return <line key={lo} x1={v.cx} y1={v.cy} x2={q[0]} y2={q[1]} stroke={C.gold} strokeWidth={5} />; })}
          </g> : null}
          <path d={(D.coast as number[][]).map((L) => llD(v, "ps", L.map((x, i) => (i % 2 === 0 && x < D.ps.edge - 3 ? NaN : x)))).join("")} fill="none" stroke={C.key}
            strokeOpacity={0.55 * Math.max(base, 0.6)} strokeWidth={1.6} />
          {cont > 0 ? <g opacity={cont}>{(D.vortex.contours as { level: number; lines: number[][] }[]).map((c) =>
            <path key={c.level} d={c.lines.map((L) => llD(v, "ps", L)).join("")} fill="none" stroke={C.key} strokeWidth={3} data-lc-contour="1" />)}</g> : null}
          {trails > 0 && TR ? <FlowParticles P={(la, lo) => (la >= D.ps.edge ? P(la, lo) : null)} T={TR} fr={trailFr ?? f} tail={14} o={trails} bright={bright} vmax={60} w={2.6} /> : null}
          {children ? children(P) : null}
        </g>
        <circle cx={v.cx} cy={v.cy} r={R} fill="none" stroke={C.grid} strokeWidth={3} />
        {ringLbl > 0 ? <g opacity={ringLbl} data-lc-maplabel="1">{RINGS.map((la) => { const q = ringLabelAt(v, la); return <Lbl key={la} x={q[0]} y={q[1]} t={`${la}°`} c={C.local} s={T.floor} a="middle" />; })}</g> : null}
        {over ? over(P) : null}
      </Svg>
    </AbsoluteFill>
  );
};
/** spoke labels at the rim, outside the map (0° bottom, 90° E right, 180° top, 90° W left); each with its own opacity */
export const SpokeLabels: React.FC<{ v?: PV; o: [number, number, number, number] }> = ({ v = VP, o }) => {
  const R = R_PS * v.s;
  return <g>
    <Lbl x={v.cx} y={v.cy + R + 28} t="0°" c={C.key} s={T.floor} a="middle" o={o[0]} />
    <Lbl x={v.cx + R + 16} y={v.cy} t="90° E" c={C.key} s={T.floor} o={o[1]} />
    <Lbl x={v.cx} y={v.cy - R - 30} t="180°" c={C.key} s={T.floor} a="middle" o={o[2]} />
    <Lbl x={v.cx - R - 16} y={v.cy} t="90° W" c={C.key} s={T.floor} a="end" o={o[3]} />
  </g>;
};

// ---------------------------------------------------------------- globe (three.js, kit_mp)
export const GB = { x: 60, y: 28, w: 960, h: 790 };
export const globeG = (cam: GlobeCam, box = GB): GProj => {
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  return globeProj(st, box.w, box.h, box.x, box.y);
};
export const Globe: React.FC<{ cam: GlobeCam; box?: { x: number; y: number; w: number; h: number }; coast?: number; o?: number; dim?: number; grat?: number;
  over?: (G: GProj) => React.ReactNode }> = ({ cam, box = GB, coast = 0.45, o = 1, dim = 1, over, grat = 0 }) => {
  const tex = useTex(IMGS.bmng);
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  const G = globeProj(st, box.w, box.h, box.x, box.y);
  if (o <= 0) return null;
  const id = `gc${box.x}_${box.y}_${box.w}`;
  return (
    <AbsoluteFill>
      <View3D st={st} x={box.x} y={box.y} w={box.w} h={box.h} o={tex || (globalThis as { __R3?: number }).__R3 ? o : 0} key3={st.pos} amb={1.6} dir={1.4}>
        <GlobeMesh tex={tex} dim={dim} />
      </View3D>
      <Svg o={o}>
        <defs><clipPath id={id}><rect x={box.x} y={box.y} width={box.w} height={box.h} /></clipPath></defs>
        <g clipPath={`url(#${id})`}>
          {/* build1 K6: the globe's faint graticule is a picture detail, not a graph axis (house §6 "links never cross ticks"): exempt */}
          {grat > 0 ? <g data-lc-ok="globe-graticule"><Graticule G={G} step={30} o={grat} /></g> : null}
          {coast > 0 ? <path d={coastPath(G, (D.coast as number[][]).map((L) => { const o2: number[] = []; for (let i = 0; i < L.length; i += 2) o2.push(L[i + 1], L[i]); return o2; }))}
            fill="none" stroke={C.key} strokeOpacity={coast} strokeWidth={1.6} /> : null}
          {over ? over(G) : null}
        </g>
      </Svg>
    </AbsoluteFill>
  );
};
export const gdot = (G: GProj, la: number, lo: number, c: string = C.gold, r = 10, o = 1) => (o <= 0 || !G.vis(la, lo) ? null :
  <circle cx={G.p(la, lo)[0]} cy={G.p(la, lo)[1]} r={r} fill={c} stroke={C.bg} strokeWidth={4} opacity={o} />);
/** a polyline of lat/lon points on the globe, culled at the horizon */
export const gLine = (G: GProj, lats: number[], lons: number[], c: string, w = 6, o = 1, dash?: string) => {
  if (o <= 0) return null;
  let d = "", pen = false;
  lats.forEach((la, i) => { const lo = lons[i]; if (!G.vis(la, lo, 1.002)) { pen = false; return; } const q = G.p(la, lo, 1.002); d += `${pen ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`; pen = true; });
  return <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" opacity={o} strokeDasharray={dash} />;
};

// ---------------------------------------------------------------- the morphing Earth (kit_mp/morph): globe → gores → plate carrée → Mercator, or → polar map
export type MorphCam = { D: number; pp: Pt; yc?: number; fov?: number };
/** flat-stage camera: on +z at distance D, looking at (0, yc, 0), up +y */
export const flatCam = (c: MorphCam): CamState => ({ pos: [0, c.yc ?? 0, c.D], target: [0, c.yc ?? 0, 0], up: [0, 1, 0], fov: c.fov ?? 35, pp: c.pp });
/** the stage blend s ∈ [0, 3]: 0 globe (spun by `spin` degrees), 1 gores, 2 plate carrée, 3 Mercator (|φ| ≤ 84°); positions in Earth radii */
export const flatPos = (s: number, spin = 0): PosFn => (lat, lon, lc) => {
  const phi = lat * D2R, lam = lon * D2R;
  const sph = ll(lat, lon + spin);
  const go: V3 = [lc + (lam - lc) * Math.cos(phi), phi, 0];
  const pc: V3 = [lam, phi, 0];
  const mc: V3 = [lam, psi(clamp(lat, -84, 84)), 0];
  const m3 = (a: V3, b: V3, t: number): V3 => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
  if (s <= 1) return m3(sph, go, ease(s));
  if (s <= 2) return m3(go, pc, ease(s - 1));
  return m3(pc, mc, ease(Math.min(1, s - 2)));
};
/** the polar blend t ∈ [0, 1]: the globe (spun) → the flat polar stereographic map in the plane y = 1 (lon 0 towards +z) */
export const polarPos = (t: number, spin = 0): PosFn => (lat, lon) => {
  const sph = ll(lat, lon + spin);
  const r = rhoPS(lat), lam = lon * D2R;
  const fl: V3 = [r * Math.sin(lam), 1, r * Math.cos(lam)];
  const e = ease(t);
  return [mix(sph[0], fl[0], e), mix(sph[1], fl[1], e), mix(sph[2], fl[2], e)];
};
/** gore-lobe centre of a longitude (radians), as the mesh lobes */
export const lobeOf = (lon: number) => goreCentre(wrapL(lon * D2R));
export const MorphView: React.FC<{ st: CamState; box: { x: number; y: number; w: number; h: number }; pos: PosFn; o?: number; lat0?: number; lat1?: number;
  clipR?: number | null; dim?: number }> = ({ st, box, pos, o = 1, lat0 = -90, lat1 = 90, clipR = null, dim = 1 }) => {
  const tex = useTex(IMGS.bmng);
  if (o <= 0) return null;
  const style = clipR !== null ? { clipPath: `circle(${clipR.toFixed(1)}px at ${st.pp[0].toFixed(1)}px ${st.pp[1].toFixed(1)}px)` } : undefined;
  return (
    <View3D st={st} x={box.x} y={box.y} w={box.w} h={box.h} o={tex || (globalThis as { __R3?: number }).__R3 ? o : 0} style={style}>
      <MorphMesh tex={tex} pos={pos} lat0={lat0} lat1={lat1} nLat={lat1 - lat0 > 100 ? 60 : 40} dim={dim} />
    </View3D>
  );
};
/** project a lat/lon polyline through a morph position function and the camera: an SVG path (pen lifts at lobe cuts and the
 * date line; `front` hides points on the far side of the globe while it is still round) */
export const morphD = (st: CamState, box: { x: number; y: number; w: number; h: number }, pos: PosFn, flat: number[], front = false, close = false): string => {
  const pr = projector(st, box.w, box.h, box.x, box.y);
  let d = "", pen = false, lastLobe = 0, lastLon = 0;
  for (let i = 0; i < flat.length; i += 2) {
    const la = flat[i], lo = flat[i + 1];
    if (!Number.isFinite(la)) { pen = false; continue; }
    const lc = lobeOf(lo), w = pos(la, lo, lc);
    if (front) { const c = st.pos, v = [c[0] - w[0], c[1] - w[1], c[2] - w[2]]; if (w[0] * v[0] + w[1] * v[1] + w[2] * v[2] < 0.002) { pen = false; continue; } }
    const q = pr.p(w);
    const jump = pen && (lc !== lastLobe || Math.abs(lo - lastLon) > 180);
    d += `${pen && !jump ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
    pen = true; lastLobe = lc; lastLon = lo;
  }
  return close && d ? d + "Z" : d;
};
export const morphPt = (st: CamState, box: { x: number; y: number; w: number; h: number }, pos: PosFn, la: number, lo: number): Pt =>
  projector(st, box.w, box.h, box.x, box.y).p(pos(la, lo, lobeOf(lo)));
export const tissotFlat = (i: number) => { const R = D.tissot.ll[i] as number[][], out: number[] = []; R[0].forEach((la, j) => out.push(la, R[1][j])); return out; };

// ---------------------------------------------------------------- SideCallout (link from the text's LEFT edge; ordered like its targets)
export const SideCallout: React.FC<{ f: number; lines: string[] | string; at: Pt; appear: number; out?: number; target: Pt | null; s?: number; c?: string;
  bend?: number; ctl?: Pt }> = ({ f, lines, at, appear, out, target, s = 54, c = C.key, bend = 30, ctl }) => {
  const LL = Array.isArray(lines) ? lines : [lines];
  LL.forEach((t) => guard(t, at[0], (t.includes("$") ? mixW(t, s) : textW(t, s)) * 0.97));
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
/** m:ss of the start of the FIRST sentence of scene `id` (the "If you skipped, here's what to keep" line) */
export const keepTime = (id: string) => {
  const q = sc[K(id)].sentences[0];
  if (!q.text.startsWith("If you skipped")) throw new Error(`${id}: first sentence is not the keep line`);
  const t = Math.floor(q.start), m = Math.floor(t / 60), ss = t % 60;
  return `${m}:${ss < 10 ? "0" : ""}${ss}`;
};
/** the chip's lifetime in its scene: from "skip ahead" for 6 s and at least to the end of that sentence */
export const chipSpan = (k: number): [number, number] => {
  const j = sc[k].sentences.findIndex((s) => s.text.includes("skip ahead"));
  if (j < 0) throw new Error(`${sc[k].id}: no "skip ahead" sentence`);
  const a = AT(k, j, "skip ahead"), b = Math.max(a + 180, SE(k, j));
  return [a, b];
};
/** The skip chip (the user's explicit exception to "no boxes"): one line at the top of the maths column, warm white on a thin
 * gold outline, 44 px; then (`tag`) the small "optional maths" tag in the top-right corner until the block ends. */
export const SkipChip: React.FC<{ f: number; k: number; to: string }> = ({ f, k, to }) => {
  const [a, b] = chipSpan(k);
  const t = `every step · optional · skip to ${to}`;
  guard(t, 1060, textW(t, T.floor));
  const o = ramp(f, a, a + 10) * (1 - ramp(f, b, b + 10));
  return <>
    {o > 0 ? <g opacity={o} data-lc-own="skipchip">
      <rect x={1046} y={46} width={796} height={68} rx={16} fill="#1f2a44" stroke={C.gold} strokeWidth={3} />
      <Lbl x={1060} y={80} t={t} c={C.key} s={T.floor} />
    </g> : null}
    <OptTag f={f} from={b + 10} />
  </>;
};
/** the small "optional maths" tag (top-right corner) from frame `from` (scene-relative; 0 = the whole scene) */
export const OptTag: React.FC<{ f: number; from?: number; until?: number }> = ({ f, from = -100, until }) => {
  const o = (from <= 0 ? 1 : ramp(f, from, from + 10)) * (until !== undefined ? 1 - ramp(f, until, until + 10) : 1);
  if (o <= 0) return null;
  return <g opacity={o}><Lbl x={1840} y={80} t="optional maths" c={C.gold} s={T.floor} a="end" b={false} /></g>;
};

// ---------------------------------------------------------------- colour bar (beside the picture, in the text column, or under both maps)
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
export const HeightBar: React.FC<{ x: number; y: number; o?: number; w?: number }> = ({ x, y, o = 1, w = 520 }) =>
  <ColourBar x={x} y={y} w={w} lut={D.vortex.lut} lo={28.4} hi={31.2} unit="km" o={o} title="height of the 10 hPa surface"
    ticks={[{ v: 28.5, t: "28.5" }, { v: 29.5, t: "29.5" }, { v: 30.5, t: "30.5" }]} />;

// ---------------------------------------------------------------- icons (code-drawn, illustrative)
/** a simple smiling face in a photo frame, stretched by sx, sy about its centre */
export const Face: React.FC<{ c: Pt; sx?: number; sy?: number; o?: number; r?: number }> = ({ c, sx = 1, sy = 1, o = 1, r = 120 }) => o <= 0 ? null : (
  <g opacity={o} transform={`translate(${c[0]} ${c[1]}) scale(${sx} ${sy})`}>
    <rect x={-r * 1.25} y={-r * 1.25} width={r * 2.5} height={r * 2.5} rx={10} fill="#22304e" stroke={C.local} strokeWidth={4 / Math.max(sx, sy)} />
    <circle cx={0} cy={0} r={r} fill="#e3b98f" stroke={C.bg} strokeWidth={3} />
    <circle cx={-r * 0.36} cy={-r * 0.22} r={r * 0.11} fill={C.bg} /><circle cx={r * 0.36} cy={-r * 0.22} r={r * 0.11} fill={C.bg} />
    <path d={`M ${-r * 0.45} ${r * 0.25} Q 0 ${r * 0.62} ${r * 0.45} ${r * 0.25}`} fill="none" stroke={C.bg} strokeWidth={r * 0.08} strokeLinecap="round" />
  </g>
);
export { Arrow, Svg, clamp, textW, ll, useTex };
