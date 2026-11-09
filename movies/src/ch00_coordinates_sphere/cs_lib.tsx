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
import { CalcRow, CalcStack as HCalcStack, Layered as HLayered, Part, Layer, TeX as HTeX, plainOf, texHtml, KX } from "../house/kit/tex";
import { GlobeCam, GProj, coastPath, globeCam, globeProj, useTex, ll, llPath } from "./kit_cs/globe";
import { SourceBelow as HSourceBelow } from "../house/kit/frame";
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
export const RAD = C.ink;                 // the radius a and the position arrow (Part 1 lessons D1: ink, never teal; teal = round/tangential)
export const XC = 1100;                   // left edge of the maths column
export const XZ = 1190;                   // text column on the darkened panel of a zoomed globe

export const Scene: React.FC<{ children: React.ReactNode; fadeIn?: boolean }> = ({ children, fadeIn = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.bg, opacity: fadeIn ? ramp(f, 0, XF) : 1 }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- p3c: the scene-start gate (exit before entry, every scene start)
// k6p3a/k6p3b (2026-11-09): during the XF-frame cross-fade the previous scene's Sequence is still drawn at full strength under the new
// scene's fading veil, so ANY text of the new scene shown before the old one has gone can sit on the old scene's text (the probe sees
// the new text at 0.97 and the old at 1: no cross-fade exemption). CoordinatesSphere wraps every scene after s00 in SceneGate
// {text: XIN, src: XF}: every text primitive of this movie (TeX, Lbl incl. $…$ labels, Keyword, Layered, CalcStack, Recall, and through
// them KeepLine, SideCallout, plab, FaceTex, ColourBar, SkipChip) fades in from XIN = XF + 8 (8 frames after the old scene has gone), and
// every source line (SourceBelow, GSrc, TwoView's credit) from XF (the old credit holds the line until then). Pictures are not gated
// (HOUSE_STYLE §5: the picture is there from the scene's first frame). s00 has no previous scene: no gate.
type Gate = { text: number; src: number };
const GateCtx = React.createContext<Gate>({ text: 0, src: 0 });
export const SceneGate = GateCtx.Provider;
const useGate = (kind: keyof Gate) => {
  const f = useCurrentFrame(), a = React.useContext(GateCtx)[kind];
  return a <= 0 ? 1 : ramp(f, a, a + 8);
};
/** the house source line with the scene-start gate (enters at XF in every scene after s00) */
export const SourceBelow: React.FC<React.ComponentProps<typeof HSourceBelow>> = (p) => {
  const g = useGate("src");
  return g <= 0 ? null : <HSourceBelow {...p} o={(p.o ?? 1) * g} />;
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
/** pass 2 (user 2026-11-07): a cut Earth shows no Natural Earth coastline, so its credit names only the image */
export const SRC_BM = "Image: NASA Blue Marble Next Generation";

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
  const g = useGate("text");
  const w = texW(p.s, p.size ?? 68), ax = p.ax ?? 0;
  guard(p.s, p.x - ax * w, w);
  return g <= 0 ? null : <HTeX {...p} o={(p.o ?? 1) * g} />;
};
export const Layered: React.FC<{ parts: Part[]; layers: Layer[]; x: number; y: number; size?: number; ax?: number; ay?: number; o?: number }> = (p) => {
  const g = useGate("text");
  const w = texW(plainOf(p.parts), p.size ?? 84), ax = p.ax ?? 0;
  guard(plainOf(p.parts), p.x - ax * w, w);
  return g <= 0 ? null : <HLayered {...p} o={(p.o ?? 1) * g} />;
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
export const CalcStack: React.FC<React.ComponentProps<typeof HCalcStack>> = (p0) => {
  const g = useGate("text");
  const p = { ...p0, o: (p0.o ?? 1) * g };
  p.rows.forEach((r) => guard(sideStr(r.rhs), p.x, texW(sideStr(r.rhs), r.size ?? p.size ?? 68)));
  const rows = withFracH(p.rows, p.size ?? 68);
  stackBottomGuard(rows, p.y, p.size ?? 68, p.maxLines ?? 3);
  return g <= 0 ? null : <HCalcStack {...p} rows={rows} />;
};
// ---------------------------------------------------------------- maths inside labels (fix loop 1, review 1 S13 / calc audit S6)
// A label's maths goes in $…$ and is drawn by KaTeX (the sans font drew φ, λ, Ω, ×, cos as plain text); the words stay in the house
// sans font. Ported from Part 2 (src/ch00_coordinates_storm/cs_lib.tsx): an HTML label in a foreignObject with the same font, size,
// weight, colour, anchor and dark halo as the SVG label, so it can stay inside any <Svg> group. tools/movie_symbol_lint.py --strict
// (rule C5) flags maths left outside the dollars.
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
/** the house SVG label with the right-edge guard; $…$ parts are KaTeX */
export const Lbl: React.FC<React.ComponentProps<typeof HLbl>> = (p0) => {
  const g = useGate("text");
  const p = { ...p0, o: (p0.o ?? 1) * g };
  const s = p.s ?? 54, m = p.t.includes("$"), w = m ? mixW(p.t, s) : textW(p.t, s), a = p.a ?? "start";
  guard(p.t, a === "start" ? p.x : a === "end" ? p.x - w : p.x - w / 2, w * 0.97);
  if (g <= 0) return null;
  return m ? <MathLbl {...p} /> : <HLbl {...p} />;
};
/** the house Keyword with the right-edge guard; with $…$ maths: the same rise / fade, gold target links as CurvedLinks */
export const Keyword: React.FC<React.ComponentProps<typeof HKeyword>> = (p0) => {
  const g = useGate("text");
  const p = { ...p0, o: (p0.o ?? 1) * g };
  const s = p.s ?? 54, m = p.text.includes("$"), w = m ? mixW(p.text, s) : textW(p.text, s), a = p.a ?? "start";
  const x0 = a === "start" ? p.at[0] : a === "end" ? p.at[0] - w : p.at[0] - w / 2;
  guard(p.text, x0, w * 0.97);
  if (g <= 0) return null;
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
/** p3a: is longitude lo inside the arc a → b (going east)? */
export const inLon = (lo: number, a: number, b: number) => ((((lo - a) % 360) + 360) % 360) <= b - a + 1e-9;
/** p3a: split flat [lon, lat, …] polylines into the runs whose points pass `keep` (a coastline on the kept part of a cut Earth) */
const keepRuns = (lines: number[][], keep: (lo: number) => boolean): number[][] => {
  const out: number[][] = [];
  for (const ln of lines) {
    let cur: number[] = [];
    for (let k = 0; k < ln.length; k += 2) {
      if (keep(ln[k])) cur.push(ln[k], ln[k + 1]);
      else { if (cur.length >= 4) out.push(cur); cur = []; }
    }
    if (cur.length >= 4) out.push(cur);
  }
  return out;
};
export const Earth: React.FC<{ cam: GlobeCam; box?: Box; cut?: Cut; alpha?: number; coast?: number; borders?: number; grat?: number; gratStep?: number;
  o?: number; over?: (G: GProj) => React.ReactNode; three?: React.ReactNode; clip?: boolean; cutCoast?: boolean }> = ({
  cam, box = GB, cut = { kind: "whole" }, alpha = 1, coast = 0.45, borders = 0, grat = 0, gratStep = 30, o = 1, over, three, clip = true, cutCoast = false }) => {
  const tex = useTex(IMGS.bmng);
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  const G = globeProj(st, box.w, box.h, box.x, box.y);
  if (o <= 0) return null;
  const id = `ec${box.x}_${box.y}_${box.w}_${box.h}`;
  // pass 2: a meridian cut that has not opened yet (slide 0) is still the whole Earth (its coastline is drawn, as the credit says)
  const whole = cut.kind === "whole" || (cut.kind === "mer" && cut.slide <= 0.001) || (cut.kind === "wedge" && cut.open <= 0.001);
  // p3a (s20, s25, s29): `cutCoast` keeps the Natural Earth coastline on the part of a meridian / wedge cut Earth that is still there (the
  // removed part's coast fades with it), so the credit "Blue Marble · Natural Earth" stays true while the Earth is cut open
  const cc = cutCoast && !whole && (cut.kind === "mer" || cut.kind === "wedge");
  const keepFn = (lo: number) => (cut.kind === "mer" ? inLon(lo, cut.lon0, cut.lon0 + 180) : cut.kind === "wedge" ? !inLon(lo, cut.l0, cut.l1) : true);
  const goneO = cut.kind === "mer" ? 1 - clamp(cut.slide * 4, 0, 1) : cut.kind === "wedge" ? 1 - clamp(cut.open * 4, 0, 1) : 0;
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
          {coast > 0 && cc ? <path d={coastPath(G, keepRuns(D.lines.globe110, keepFn))} fill="none" stroke={C.key} strokeOpacity={coast * alpha} strokeWidth={1.6} /> : null}
          {coast > 0 && cc && goneO > 0 ? <path d={coastPath(G, keepRuns(D.lines.globe110, (lo) => !keepFn(lo)))} fill="none" stroke={C.key} strokeOpacity={coast * alpha * goneO} strokeWidth={1.6} /> : null}
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
  for (let lo = -180; lo < 180; lo += step) { const pts: [number, number][] = []; for (let la = -90; la <= 90; la += 2) pts.push([la, lo]); d += llPath(G, pts); }   // pass 2 (user): meridians end at both poles
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
export const plab = (G: GProj, la: number, lo: number, t: string, o = 1, dx = 16, dy = 0, a: "start" | "middle" | "end" = "start", italic = false, rad = 1) => {
  if (o <= 0 || !G.vis(la, lo, rad)) return null;
  // still review k6r2: a map label never starts left of the x 60 margin (s12's "15° N" started at x 45)
  const x = G.p(la, lo, rad)[0] + dx, w = textW(t, T.floor), left = a === "start" ? x : a === "end" ? x - w : x - w / 2;
  return <g data-lc-maplabel="1"><Lbl x={x + Math.max(0, 60 - left)} y={G.p(la, lo, rad)[1] + dy} t={t} c={C.key} s={T.floor} a={a} o={o} italic={italic} /></g>;
};
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
  // a 1-s emphasis ring (like the house Keyword pulse ring that the K6 probe skips): data-lc-ok keeps it out of the overlap shapes
  return <g data-lc-ok="1"><circle cx={p[0]} cy={p[1]} r={22 + 18 * u} fill="none" stroke={C.gold} strokeWidth={4} opacity={0.9 * Math.sin(Math.PI * u)} /></g>;
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
  LL.forEach((t) => guard(t, at[0], mixW(t, s) * 0.97));
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
// Part 1 lessons E1: the chip reads "every step · optional / skip to mm:ss" (Part 1's words; "not needed …" is spoken in the lead-in)
const CHIP_LINES = (to: string) => ["every step · optional", `skip to ${to}`];
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
  return { x: 1836 - w, y: 54, w, h: CHIP_LINES(to).length * CHIP_LH + 2 * CHIP_PAD - 8 };
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
export const KeepLine: React.FC<{ f: number; k: number; lines: string[]; last?: number; x?: number; y?: number; a0?: number }> = ({ f, k, lines, last = 1, x = XC, y = 110, a0 = 0 }) => {
  const a = a0, b = SE(k, last);   // p3b: a0 = XF + 8 where the previous scene's text sits in the same slot (exit before entry)
  const o = ramp(f, a, a + 8) * (1 - ramp(f, b, b + 10)) * useGate("text");   // p3c: the underline is gated with its words
  if (o <= 0) return null;
  const wl = mixW(lines[lines.length - 1], T.key);
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
/** p3b (k6p3a cross-fade faults): the frame from which a scene's first text may enter when the previous scene had text or a credit in
 * the same place: the previous scene's Sequence runs XF frames into this one, so entry waits until it has gone, plus the 8-frame swap gap */
export const XIN = XF + 8;
/** the frame at which the keep line has gone (for the next text in the top slot: keep the 8-frame swap gap) */
export const keepGone = (k: number, last = 1) => SE(k, last) + 10;

/** Part 1 lessons B4 (2026-11-05): the "If you skipped, here's what to keep" line shows its OWN picture (the key idea), not what is left
 * of the optional block. Schematic, illustrative; Brest's latitude 48.4° from data. c = the centre (Earth's centre for the slices), R = px.
 *  swap  (s09): one meridian triangle: φ at the centre, 90° − φ at Brest's end; next and opposite swap, sin φ = cos(90° − φ).
 *  slice (s21): the same slice: height a sin φ, distance from the axis a cos φ, Brest carried east (out of the screen, ⊙) at Ω a cos φ.
 *  steps (s25): a globe: one degree north (gold) is the same everywhere; one degree east (orange) shrinks with cos φ.
 *  band  (s34): a globe: the band 30° S - 30° N is half the area; the same box in degrees is narrower towards the pole. */
export const KeepPic: React.FC<{ kind: "swap" | "slice" | "steps" | "band"; c: Pt; R: number; o: number }> = ({ kind, c, R, o }) => {
  if (o <= 0) return null;
  const ph = BREST[0] * D2R, Bt: Pt = [c[0] + R * Math.cos(ph), c[1] - R * Math.sin(ph)], F: Pt = [Bt[0], c[1]];
  const slice = kind === "swap" || kind === "slice";
  if (slice) {
    const top: Pt = [c[0], c[1] - 1.18 * R];
    return <>
      <Svg o={o}>
        <line x1={c[0]} y1={c[1] + 10} x2={top[0]} y2={top[1]} stroke={C.local} strokeWidth={4} strokeDasharray="12 8" />
        <line x1={c[0] - 10} y1={c[1]} x2={c[0] + 1.22 * R} y2={c[1]} stroke={C.local} strokeWidth={4} />
        <Lbl x={c[0] + 1.22 * R} y={c[1] + 40} t="equator" c={C.muted} s={T.floor} a="end" b={false} />
        <Lbl x={top[0] + 18} y={top[1] + 10} t="axis" c={C.muted} s={T.floor} b={false} />
        {kind === "swap" ? <>
          <line x1={c[0]} y1={c[1]} x2={F[0]} y2={F[1]} stroke={C.second} strokeWidth={7} />
          <line x1={F[0]} y1={F[1]} x2={Bt[0]} y2={Bt[1]} stroke={C.second} strokeWidth={7} strokeDasharray="14 8" />
          <path d={arcD(c, 0.5 * R, BREST[0], 90)} fill="none" stroke={C.local} strokeWidth={6} />
        </> : <>
          <line x1={F[0]} y1={F[1]} x2={Bt[0]} y2={Bt[1]} stroke={C.second} strokeWidth={7} strokeDasharray="14 8" />
          <line x1={c[0]} y1={Bt[1]} x2={Bt[0]} y2={Bt[1]} stroke={C.second} strokeWidth={7} strokeDasharray="14 8" />
          <path d={`M ${c[0] - 46} ${top[1] + 40} A 46 13 0 1 0 ${c[0] + 46} ${top[1] + 40}`} fill="none" stroke={VIOLET} strokeWidth={5} />
          <Arrow p={[c[0] + 40, top[1] + 46]} q={[c[0] + 48, top[1] + 38]} color={VIOLET} w={5} head={18} halo={false} />
        </>}
        <path d={arcD(c, 0.3 * R, 0, BREST[0])} fill="none" stroke={C.gold} strokeWidth={7} />
        <Arrow p={c} q={Bt} color={RAD} w={7} head={26} />
        <circle cx={c[0]} cy={c[1]} r={9} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        {kind === "slice" ? <g>
          {/* east at Brest is out of the screen on this slice: ⊙ (Part 1 lessons B7), never an up-arrow */}
          <circle cx={Bt[0]} cy={Bt[1]} r={17} fill={C.bg} stroke={C.first} strokeWidth={5} />
          <circle cx={Bt[0]} cy={Bt[1]} r={5} fill={C.first} />
          <Lbl x={Bt[0] + 30} y={Bt[1] - 60} t="east:" c={C.first} s={T.floor} />
          <Lbl x={Bt[0] + 30} y={Bt[1] - 14} t="out of the screen" c={C.first} s={T.floor} />
        </g> : null}
      </Svg>
      <TeX s={String.raw`\varphi`} x={c[0] + 0.42 * R * Math.cos(ph / 2)} y={c[1] - 0.42 * R * Math.sin(ph / 2)} size={50} c={C.gold} ax={0.5} o={o} halo />
      <TeX s="a" x={(c[0] + Bt[0]) / 2 - 26} y={(c[1] + Bt[1]) / 2 - 16} size={50} c={RAD} ax={1} o={o} halo />
      {kind === "swap" ? <>
        <TeX s={String.raw`90^\circ-\varphi`} x={c[0] + 14} y={c[1] - 0.7 * R * Math.sin(72 * D2R)} size={44} c={C.local} o={o} halo />
        <TeX s={String.raw`\sin\varphi`} x={Bt[0] + 18} y={(Bt[1] + F[1]) / 2 + 30} size={50} c={C.second} o={o} halo />
        <TeX s={String.raw`\cos\varphi`} x={(c[0] + F[0]) / 2} y={c[1] + 50} size={50} c={C.second} ax={0.5} o={o} halo />
        <TeX s={String.raw`\sin\varphi=\cos(90^\circ-\varphi)`} x={c[0]} y={c[1] - 1.18 * R - 70} size={50} c={C.key} o={o} />
      </> : <>
        <TeX s={String.raw`a\sin\varphi`} x={Bt[0] + 18} y={(Bt[1] + F[1]) / 2 + 40} size={50} c={C.second} o={o} halo />
        <TeX s={String.raw`a\cos\varphi`} x={(c[0] + Bt[0]) / 2} y={Bt[1] - 40} size={50} c={C.second} ax={0.5} o={o} halo />
        <TeX s={String.raw`\Omega\,a\cos\varphi`} x={Bt[0] + 30} y={Bt[1] + 40} size={50} c={C.first} o={o} halo />
        <TeX s={String.raw`\Omega`} x={c[0] - 24} y={top[1]} size={46} c={VIOLET} ax={1} o={o} halo />{/* K6 k6r1: left of the axis, above its spin arc (it sat on the a cos φ tag) */}
      </>}
    </>;
  }
  // globe pictures (orthographic-like, tilted 20°): a parallel at latitude L is an ellipse
  const ry = 0.2, par = (L: number) => ({ y: c[1] - R * Math.sin(L * D2R) * Math.cos(20 * D2R), rx: R * Math.cos(L * D2R), ry: R * ry * Math.cos(L * D2R) });
  const front = (L: number, lo: number): Pt => { const p = par(L); return [c[0] + p.rx * Math.sin(lo * D2R), p.y + p.ry * Math.cos(lo * D2R)]; };
  const run = (L: number, a: number, b: number) => poly(Array.from({ length: 21 }, (_, i) => front(L, a + ((b - a) * i) / 20)));
  const id = `keepband${Math.round(c[0])}`;
  return (
    <Svg o={o}>
      <defs><clipPath id={id}><circle cx={c[0]} cy={c[1]} r={R} /></clipPath></defs>
      {kind === "band" ? <rect x={c[0] - R} y={par(30).y} width={2 * R} height={par(-30).y - par(30).y} fill={C.gold} fillOpacity={0.3} clipPath={`url(#${id})`} /> : null}
      <circle cx={c[0]} cy={c[1]} r={R} fill="none" stroke={C.muted} strokeWidth={4} />
      {[0, ...(kind === "band" ? [30, -30, 70] : [BREST[0]])].map((L) => { const p = par(L);
        return <ellipse key={L} cx={c[0]} cy={p.y} rx={p.rx} ry={p.ry} fill="none" stroke={L === 0 ? C.local : C.second} strokeWidth={3} opacity={0.8} />; })}
      {kind === "steps" ? <>
        <path d={run(0, -12, 12)} fill="none" stroke={C.second} strokeWidth={12} />
        <path d={run(BREST[0], -12, 12)} fill="none" stroke={C.second} strokeWidth={12} />
        <line x1={front(0, 0)[0] - 0.62 * R} y1={front(0, 0)[1]} x2={front(0, 0)[0] - 0.62 * R} y2={front(0, 0)[1] - 0.34 * R} stroke={C.gold} strokeWidth={12} />
        {/* K6 k6r1: "north" left of the sphere (it sat on the equator ellipse), "east × cos φ" right of it (it crossed the outline) */}
        <Lbl x={c[0] - R - 16} y={front(0, 0)[1] - 0.17 * R} t="north" c={C.gold} s={T.floor} a="end" />
        <Lbl x={front(0, 14)[0] + 16} y={front(0, 14)[1] + 30} t="east" c={C.second} s={T.floor} />
        <Lbl x={c[0] + R + 16} y={front(BREST[0], 14)[1] + 6} t="east" c={C.second} s={T.floor} />
        <Lbl x={c[0] + R + 16} y={front(BREST[0], 14)[1] + 58} t="$\times\cos\varphi$" c={C.second} s={T.floor} />
      </> : <>
        <rect x={c[0] - 0.12 * R} y={par(0).y + par(0).ry - 0.1 * R} width={0.24 * R} height={0.1 * R} fill={C.gold} stroke={C.gold} strokeWidth={3} />
        <rect x={c[0] - 0.12 * R * Math.cos(70 * D2R)} y={par(70).y + par(70).ry - 0.1 * R * 0.6} width={0.24 * R * Math.cos(70 * D2R)} height={0.1 * R * 0.6} fill={C.gold} stroke={C.gold} strokeWidth={3} />
        <Lbl x={c[0] + R + 20} y={par(30).y} t="30° N" c={C.key} s={T.floor} />
        <Lbl x={c[0] + R + 20} y={par(-30).y} t="30° S" c={C.key} s={T.floor} />
        <Lbl x={c[0] + R + 20} y={(par(30).y + par(-30).y) / 2} t="half the area" c={C.gold} s={T.floor} />
      </>}
    </Svg>
  );
};

/** Part 1 lessons B1 (2026-11-05): a magnified inset shows what it magnifies. A gold ring round the source on the wide view, a dashed gold
 * leader from that ring to the inset's rim, and the label "magnified · drawn N× larger" above the inset (muted, 44 px). Place in <Svg>. */
export const Magnify: React.FC<{ src: Pt; srcR?: number; at: Pt; r: number; label: string; o: number; lx?: number; ly?: number; a?: "start" | "middle" | "end" }> = ({
  src, srcR = 28, at, r, label, o, lx, ly, a = "middle" }) => {
  if (o <= 0) return null;
  const dx = at[0] - src[0], dy = at[1] - src[1], n = Math.hypot(dx, dy) || 1, u: Pt = [dx / n, dy / n];
  const p: Pt = [src[0] + u[0] * (srcR + 4), src[1] + u[1] * (srcR + 4)], q: Pt = [at[0] - u[0] * (r + 6), at[1] - u[1] * (r + 6)];
  return (
    <g opacity={o} data-lc-own="magnify">
      <circle cx={src[0]} cy={src[1]} r={srcR} fill="none" stroke={C.gold} strokeWidth={4} />
      <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={C.gold} strokeWidth={3} strokeDasharray="10 8" />
      <Lbl x={lx ?? at[0]} y={ly ?? at[1] - r - 40} t={label} c={C.muted} s={T.floor} a={a} b={false} />
    </g>
  );
};

// ---------------------------------------------------------------- colour bar (beside the picture, in the text column)
export const ColourBar: React.FC<{ x: number; y: number; w: number; lut: string[]; ticks: { v: number; t: string }[]; lo: number; hi: number; unit?: string; o?: number;
  title?: string; lowArrow?: boolean; tickS?: number }> = ({ x, y, w, lut, ticks, lo, hi, unit, o = 1, title, lowArrow = false, tickS = 48 }) =>
  o <= 0 ? null : (
    <g opacity={o} data-k6-cbar="1">
      {title ? <Lbl x={x} y={y - 34} t={title} c={C.muted} s={44} b={false} /> : null}
      {Array.from({ length: 60 }, (_, i) => <rect key={i} x={x + (i * w) / 60} y={y} width={w / 60 + 0.8} height={24} fill={lutCss(lut, (i + 0.5) / 60)} />)}
      <rect x={x} y={y} width={w} height={24} fill="none" stroke={C.muted} strokeWidth={2} />
      {/* fix loop 1 (review 1 S7): an end arrow in the lowest colour when values below `lo` are clipped */}
      {lowArrow ? <path d={`M${x - 2} ${y - 2}L${x - 26} ${y + 12}L${x - 2} ${y + 26}Z`} fill={lutCss(lut, 0)} stroke={C.muted} strokeWidth={2} /> : null}
      {ticks.map((tk) => <Lbl key={tk.t} x={x + ((tk.v - lo) / (hi - lo)) * w} y={y + 30 + tickS / 2} t={tk.t} c={C.muted} s={tickS} a="middle" b={false} />)}
      {unit ? <Lbl x={x + w + 18} y={y + 12} t={unit} c={C.muted} s={tickS} b={false} /> : null}
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

/** remake 2026-11-07 (master plan R16, HOUSE_STYLE §3 "Series parts"): an earlier part's result recalled at its point of use: the
 *  equation (KaTeX, exactly as that part writes it) and the gold keyword "derived in Part K: <name>" under it (two lines when too
 *  wide). Port of Part 2's Recall (src/ch00_coordinates_storm/cs_lib.tsx) with a verb ("derived", "defined", "met") for things a part
 *  defined rather than derived. Label and equation share one data-lc-own group (K6 ownership). */
export const Recall: React.FC<{ f: number; tex: string; name: string; x: number; y: number; appear: number; out?: number; size?: number; c?: string; part?: number;
  verb?: string; gap?: number; side?: boolean }> = ({ f, tex, name, x, y, appear, out, size = 50, c = C.ink, part = 1, verb = "derived", gap, side = false }) => {
  const g = useGate("text");
  const o = ramp(f, appear, appear + 10) * (out !== undefined ? 1 - ramp(f, out, out + 10) : 1) * g;
  const lab = `${verb} in Part ${part}: ${name}`;
  const two = x + textW(lab, T.floor) > 1842;
  if (side) {   // the gold keyword in two lines right of the equation (where there is no room below)
    const xs = x + texW(tex, size) + 36;
    if (xs + Math.max(textW(`${verb} in Part ${part}:`, T.floor), textW(name, T.floor)) > 1842) throw new Error(`Recall "${name}" (side) ends past 1842`);
    if (o <= 0) return null;
    return (
      <>
        <TeX s={tex} x={x} y={y} size={size} c={c} o={o} />
        <Svg o={o}><g data-lc-own="recall"><HLbl x={xs} y={y - 8} t={`${verb} in Part ${part}:`} c={C.gold} s={T.floor} />
          <HLbl x={xs} y={y + 44} t={name} c={C.gold} s={T.floor} /></g></Svg>
      </>
    );
  }
  if (two && x + textW(name, T.floor) > 1842) throw new Error(`Recall "${name}" ends past 1842`);
  if (o <= 0) return null;
  const dy = gap ?? (FRAC_ROW.test(tex) ? size * 1.25 : size * 0.85) + 18;
  return (
    <>
      <TeX s={tex} x={x} y={y} size={size} c={c} o={o} />
      <Svg o={o}><g data-lc-own="recall">{two ? <><HLbl x={x} y={y + dy} t={`${verb} in Part ${part}:`} c={C.gold} s={T.floor} />
        <HLbl x={x} y={y + dy + 52} t={name} c={C.gold} s={T.floor} /></> : <HLbl x={x} y={y + dy} t={lab} c={C.gold} s={T.floor} />}</g></Svg>
    </>
  );
};
