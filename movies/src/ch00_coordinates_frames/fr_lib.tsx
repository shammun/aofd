// Shared pieces of the ch00_coordinates_frames movie (#5d, Coordinates Part 4 "Turning frames"): timing from timing.json
// (SS/SE/AT as in the reference movie DotProductWhy.tsx), the scene wrapper, the data (fr.json from
// movies/data/build_ch00_coordinates_frames.py, 66 CHECK rows), the WebGL globe (kit_fr, copied from build 1's kit_co) with
// whole / quarter-cut / half-Earth meshes, local tripods projected through the same camera, flat lat/lon maps (local
// equirectangular), the two derivation diagrams (top view from above the North Pole, meridian slice), Part 2's circle,
// SideCallout, the skip chip, colour bar, a KaTeX width guard (text ends before x 1842) and small code-drawn icons.
// Adapted from build 1 (src/ch00_coordinates/co_lib.tsx) and Part 1 (src/ch00_coordinates_flat/cf_lib.tsx).
// Everything is a pure function of the frame and the data.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { ramp } from "../house";
import timing from "../../ch00/ch00_coordinates_frames/timing.json";
import frJ from "../../ch00/ch00_coordinates_frames/data/fr.json";
import { C, FONT, T } from "../house/kit/type";
import { Arrow, Lbl as HLbl, Pt, Svg, clamp, textW } from "../house/kit/draw";
import { Keyword as HKeyword } from "../house/kit/notes";
import { CurvedLink } from "../house/kit/extras";
import { SourceBelow as HSourceBelow } from "../house/kit/frame";
import { CalcRow, CalcStack as HCalcStack, Layered as HLayered, Part, Layer, TeX as HTeX, plainOf, texHtml, KX } from "../house/kit/tex";
import { GlobeCam, GlobeMesh, GProj, HalfEarthMesh, coastPath, globeCam, globeProj, useTex, Graticule, enAt, ll, llPath } from "./kit_fr/globe";
import { View3D } from "./kit_fr/three3d";
import { V3, add3 } from "./kit_fr/cam";

export const FPS = 30;
type Snt = { text: string; start: number; end: number };
type Scn = { id: string; start: number; end: number; sentences: Snt[] };
export const sc = (timing as unknown as { scenes: Scn[]; total_frames: number }).scenes;
export const HOLD = 75;
export const XF = 10;
/** r8d (2026-11-09, ported from Part 3 p3c): text of every scene after s00 enters 8 frames after the previous scene has gone */
export const XIN = XF + 8;
export const FR_FRAMES = (timing as unknown as { total_frames: number }).total_frames + HOLD;
const IDS = sc.map((s) => s.id);
export const K = (id: string) => { const k = IDS.indexOf(id); if (k < 0) throw new Error(`no scene ${id}`); return k; };
export const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
export const END = [...CUT.slice(1), FR_FRAMES];
export const LEN = (k: number) => END[k] - CUT[k];
export const SS = (k: number, j: number) => { const s = sc[k].sentences[j]; if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`); return Math.round(s.start * FPS) - CUT[k]; };
export const SE = (k: number, j: number) => { const s = sc[k].sentences[j]; if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`); return Math.round(s.end * FPS) - CUT[k]; };
/** frame (scene-relative) at which the quoted words are spoken inside sentence j (character-proportional) */
export const AT = (k: number, j: number, phrase: string) => {
  const s = sc[k].sentences[j];
  if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`);
  const i = s.text.indexOf(phrase);
  if (i < 0) throw new Error(`phrase "${phrase}" not in ${sc[k].id} sentence ${j}: ${s.text}`);
  // remake 2026-11-07: timed from Kokoro word timestamps when checks/fr_words.py found the phrase (else the character estimate)
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
export const fin = (f: number, a: number, n = 12) => ramp(f, a, a + n);
/** house rule 2026-11-07: the gold highlight of an input / answer on its word (≈ 1.2 s glow, starting 3 frames before the word) */
export const HL = (f: number, a: number) => (f < a - 3 || f > a + 33 ? 0 : Math.sin((Math.PI * (f - a + 3)) / 36));
export const fout = (f: number, a: number, n = 10) => 1 - ramp(f, a, a + n);
export const win = (f: number, a: number, b: number, n = 10) => fin(f, a, n) * fout(f, b, n);
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => { const x = clamp(t, 0, 1); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const prog = (f: number, a: number, b: number) => ease((f - a) / Math.max(1, b - a));
export const poly = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
/** a number with a true minus sign and fixed decimals */
export const nf = (v: number, d = 1, plus = false) => `${v < 0 ? "−" : plus && v > 0 ? "+" : ""}${Math.abs(v).toFixed(d)}`;
export const D2R = Math.PI / 180;
export const BROWN = "#a0784e";           // gravity (storyboard colour contract)
export const VIOLET = "#8e6fd8";          // Coriolis (storyboard colour contract)
export const XC = 1100;                   // left edge of the maths column
export const XMAX = 1840;                 // text must end before x 1842

export const Scene: React.FC<{ children: React.ReactNode; fadeIn?: boolean }> = ({ children, fadeIn = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.bg, opacity: fadeIn ? ramp(f, 0, XF) : 1 }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------- r8d: the scene-start gate (exit before entry, every scene start)
// Ported from Part 3's fix loop p3c (src/ch00_coordinates_sphere/cs_lib.tsx, commit 73e5576). k6r8c (2026-11-09): during the XF-frame
// cross-fade the previous scene's Sequence is still drawn under the new scene's fading veil, so any text of the new scene shown before
// the old one has gone sits on the old scene's text or picture (17 of k6r8c's 28 faults were at scene start + 9). CoordinatesFrames
// wraps every scene after s00 in SceneGate {text: XIN, src: XF}: every text primitive of this movie (TeX, Lbl incl. $…$ labels, Keyword,
// Layered, CalcStack, Recall, and through them Place, SideCallout, SkipChip, ColourBar, plab) fades in from XIN = XF + 8, and every
// source line (SourceBelow, GSrc) from XF (the old credit holds the line until then). Pictures are not gated (HOUSE_STYLE §5: the
// picture is there from the scene's first frame). s00 has no previous scene: no gate.
// r8e (k6r8d, ported from Part 3 p3d, commit 2cbc928): the OTHER side of the cross-fade. A scene's text stays at full strength until its
// Sequence ends, under the next scene's picture, which is there from the next scene's first frame (pictures are never gated) and at 0.97
// on its frame 9 (s01 f362 title, s07 f12425 "φ = 48.4°", s23 f46205 / s26 f53621 the keep pictures' labels). `exit` = the scene's own
// length: its text and credits are dropped on the LAST overlap frame (exit + XF − 1, where the new veil is at 0.97 and hides them anyway).
// A gradual fade would not do: k6_overlap exempts an old/new pair only while exactly one side is >= 0.95 (text-picture) or one side
// <= 0.55 (text-text), so the old text must be full until frame 8 of the overlap and gone on frame 9.
type Gate = { text: number; src: number; exit: number };
const GateCtx = React.createContext<Gate>({ text: 0, src: 0, exit: 0 });
export const SceneGate = GateCtx.Provider;
const useGate = (kind: "text" | "src") => {
  const f = useCurrentFrame(), g = React.useContext(GateCtx), a = g[kind];
  return (a <= 0 ? 1 : ramp(f, a, a + 8)) * (g.exit > 0 && f >= g.exit + XF - 1 ? 0 : 1);
};
/** r8e: the gate for text drawn outside the wrappers (s00's SeriesTitle / RiseText: no entry gate, but its exit on the last overlap frame) */
export const useTextGate = () => useGate("text");
/** the house source line with the scene-start gate (enters at XF in every scene after s00) */
export const SourceBelow: React.FC<React.ComponentProps<typeof HSourceBelow>> = (p) => {
  const g = useGate("src");
  return g <= 0 ? null : <HSourceBelow {...p} o={(p.o ?? 1) * g} />;
};

// ---------------------------------------------------------------- data and assets
/* eslint-disable @typescript-eslint/no-explicit-any */
export const D = frJ as any;
export const IMGS = { bmng: staticFile("fr_bmng.jpg"), ian: staticFile("fr_ian_speed_20.png") };
export const ASSET_NAMES = ["fr_bmng.jpg", "fr_ian_speed_20.png"];
export const LUT_SPEED = D.luts.speed as string[];
export const BREST: [number, number] = D.brest.ll, TRAPPES: [number, number] = D.trappes.ll, SING: [number, number] = D.sing.ll, KHULNA: [number, number] = D.khulna.ll;
export const lutCss = (lut: string[], t: number) => lut[Math.max(0, Math.min(lut.length - 1, Math.round(t * (lut.length - 1))))];
/** hats in KaTeX (review 1 Should 2: never a combining hat in a text label) */
export const H = {
  i: String.raw`\hat{\mathbf i}`, j: String.raw`\hat{\mathbf j}`, k: String.raw`\hat{\mathbf k}`, R: String.raw`\hat{\mathbf R}`,
  x: String.raw`\hat{\mathbf x}`, y: String.raw`\hat{\mathbf y}`, z: String.raw`\hat{\mathbf z}`, r: String.raw`\hat{\mathbf r}`, th: String.raw`\hat{\boldsymbol\theta}`,
  xp: String.raw`\hat{\mathbf x}'`, yp: String.raw`\hat{\mathbf y}'`, v: String.raw`\mathbf v`,
};

// ---------------------------------------------------------------- KaTeX width guard (text ends before x 1842)
/** a rough, slightly generous width of a KaTeX string at effective size s (letters ≈ 0.55 em, binary operators with their
 * spaces ≈ 1.15 em, \dfrac = the wider of its two parts, \text{…} per character, hats free); used only as a layout guard */
export const texW = (src: string, s: number): number => {
  let i = 0;
  const str = src.replace(/\\displaystyle|\\left|\\right|\\Big|\\big/g, "");
  const group = (): number => { // parse {...} after a command
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
      if (cmd === "approx" || cmd === "equiv" || cmd === "neq" || cmd === "Rightarrow" || cmd === "to" || cmd === "longrightarrow" || cmd === "times" || cmd === "cdot") return 1.3;
      if (cmd === "parallel") return 0.9;
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
// ---------------------------------------------------------------- maths inside labels (remake 2026-11-07; symbol lint C5)
// A label's maths goes in $…$ and is drawn by KaTeX; the words stay in the house sans font. Ported verbatim from Part 3
// (src/ch00_coordinates_sphere/cs_lib.tsx, itself from Part 2): an HTML label in a foreignObject with the same font, size, weight, colour,
// anchor and dark halo as the SVG label, so it can stay inside any <Svg> group.
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

// ---------------------------------------------------------------- recalls of earlier parts (remake 2026-11-07, HOUSE_STYLE §3 series parts, R16)
/** An earlier part's result at its point of use (= Part 2's cs_lib Recall): the equation (TeX, left edge at x, centre at y) and, under it,
 * the gold keyword "derived in Part K: <name>" (or `lab`, e.g. "found in Part 2: …"); two lines when one is too wide. `tex` may be "" (label
 * only, under an equation drawn elsewhere). Place OUTSIDE an <Svg>. */
export const Recall: React.FC<{ f: number; tex: string; name: string; x: number; y: number; appear: number; out?: number; size?: number; c?: string; part?: number;
  gap?: number; lab?: string; glow?: number }> = ({ f, tex, name, x, y, appear, out, size = 54, c = C.ink, part = 1, gap, lab, glow = 0 }) => {
  const g = useGate("text");
  const o = ramp(f, appear, appear + 10) * (out !== undefined ? 1 - ramp(f, out, out + 10) : 1) * g;
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

// ---------------------------------------------------------------- globe (three.js, kit_fr)
export const GB = { x: 60, y: 28, w: 960, h: 790 };   // the house globe frame for the unzoomed scenes (globe ≥ 760 px across at dist 3.4)
export const GFULL = { x: 0, y: 0, w: 1920, h: 1080 };
/** Earth axes (x̂ to 0 N 0 E, ŷ to 0 N 90 E, ẑ to the North Pole) → the kit's Y-up globe coordinates */
export const e2g = (v: number[]): V3 => [v[1], v[2], v[0]];
export const globeG = (cam: GlobeCam, box = GB): GProj => {
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  return globeProj(st, box.w, box.h, box.x, box.y);
};
export type MeshKind = "whole" | "cut" | { half: number; slide: number; whole?: number };
export const Globe: React.FC<{ cam: GlobeCam; box?: { x: number; y: number; w: number; h: number }; coast?: number; o?: number; dim?: number; grat?: number;
  over?: (G: GProj) => React.ReactNode; mesh?: MeshKind; gratStep?: number; extraLines?: number[][]; extraO?: number }> = ({
  cam, box = GB, coast = 0.45, o = 1, dim = 1, over, grat = 0, mesh = "whole", gratStep = 30, extraLines, extraO = 1 }) => {
  const tex = useTex(IMGS.bmng);
  const st = globeCam({ ...cam, pp: cam.pp ?? [box.w / 2, box.h / 2] }, [box.w / 2, box.h / 2]);
  const G = globeProj(st, box.w, box.h, box.x, box.y);
  if (o <= 0) return null;
  const id = `gc${box.x}_${box.y}_${box.w}`;
  const half = typeof mesh === "object" ? mesh : null;
  return (
    <AbsoluteFill>
      {/* the SSR check (--3d) renders the 3-D tree without a texture so the THREE-tag guard sees it */}
      <View3D st={st} x={box.x} y={box.y} w={box.w} h={box.h} o={tex || (globalThis as { __R3?: number }).__R3 ? o : 0} key3={st.pos} amb={1.6} dir={1.4}>
        {half ? <HalfEarthMesh tex={tex} lon0={half.half} slide={half.slide} whole={half.whole ?? 0} /> : <GlobeMesh tex={tex} dim={dim} cut={mesh === "cut"} />}
      </View3D>
      <Svg o={o}>
        <defs><clipPath id={id}><rect x={box.x} y={box.y} width={box.w} height={box.h} /></clipPath></defs>
        <g clipPath={`url(#${id})`}>
          {grat > 0 ? <Graticule G={G} step={gratStep} o={grat} /> : null}
          {coast > 0 && !half ? <path d={coastPath(G, D.lines.globe110)} fill="none" stroke={C.key} strokeOpacity={coast} strokeWidth={1.6} /> : null}
          {extraLines && extraO > 0 ? <path d={coastPath(G, extraLines)} fill="none" stroke={C.key} strokeOpacity={0.8 * extraO} strokeWidth={2.2} /> : null}
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
/** a straight segment between two globe-coordinate points (projected) */
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
/** the tripod (east i, north j: orange; up k: teal) at (lat, lon), arrow length L in Earth radii: screen points */
export const tripod = (G: GProj, la: number, lo: number, L: number) => {
  const e = enAt(la, lo), b = ll(la, lo);
  const tip = (v: V3, s: number): V3 => [b[0] + v[0] * s, b[1] + v[1] * s, b[2] + v[2] * s];
  return { b: G.pw(b), i: G.pw(tip(e.e, L)), j: G.pw(tip(e.n, L)), k: G.pw(tip(e.u, L * 1.15)) };
};
export const Tripod: React.FC<{ G: GProj; la: number; lo: number; L: number; o?: number; up?: boolean; w?: number; head?: number }> = ({ G, la, lo, L, o = 1, up = true, w = 8, head = 30 }) => {
  if (o <= 0 || !G.vis(la, lo)) return null;
  const t = tripod(G, la, lo, L);
  return (
    <g opacity={o}>
      <Arrow p={t.b} q={t.i} color={C.second} w={w} head={head} />
      <Arrow p={t.b} q={t.j} color={C.second} w={w} head={head} />
      {up ? <Arrow p={t.b} q={t.k} color={C.first} w={w} head={head} /> : null}
      <circle cx={t.b[0]} cy={t.b[1]} r={8} fill={C.gold} stroke={C.bg} strokeWidth={3} />
    </g>
  );
};
/** KaTeX hat labels at the tips of a tripod (HTML, placed over the WebGL + SVG layers); offsets push them past the heads */
export const TripodTips: React.FC<{ G: GProj; la: number; lo: number; L: number; o?: number; size?: number; up?: boolean }> = ({ G, la, lo, L, o = 1, size = 54, up = true }) => {
  if (o <= 0 || !G.vis(la, lo)) return null;
  const t = tripod(G, la, lo, L);
  const off = (q: Pt): Pt => { const dx = q[0] - t.b[0], dy = q[1] - t.b[1], n = Math.hypot(dx, dy) || 1; return [q[0] + (dx / n) * 34, q[1] + (dy / n) * 34]; };
  const pi = off(t.i), pj = off(t.j), pk = off(t.k);
  return <>
    <TeX s={H.i} x={pi[0]} y={pi[1]} size={size} c={C.second} ax={0.5} o={o} halo />
    <TeX s={H.j} x={pj[0]} y={pj[1]} size={size} c={C.second} ax={0.5} o={o} halo />
    {up ? <TeX s={H.k} x={pk[0]} y={pk[1]} size={size} c={C.first} ax={0.5} o={o} halo /> : null}
  </>;
};
export { enAt, ll };

// ---------------------------------------------------------------- build 2 (2026-11-10): the globe companion
// User request (Part 4 build 2): whenever the main picture is a 2-D diagram (the top view in s05 / s18 / s21, the meridian slice in
// s06 / s20), a small oblique 3-D globe at Brest stays beside it, so the viewer always sees how the diagram's arrows sit on the real
// Earth (and k̂, which no top view can show). A zoomed inset in the lower-left of the picture zone, no box and no border: its four
// edges fade to the background (house §5b: the box of a zoomed 3-D area is never visible); it publishes a K6 sharp mask (its interior
// minus the fades) so no must-class text may sit on it; the arrow-tip glyphs (î, ĵ, k̂, R̂) are spot labels. Source line below it
// (or the scene's own NASA line under the main globe box, which also sits below the inset).
export const INSET = { x: 60, y: 600, w: 400, h: 218 };   // bottom 818 = the house GB box's bottom: its credit sits on the same line as every globe credit
/** The inset camera: the regular far globe camera (dist 3.4, looking at the centre, north up) from lat 50 and 60° east of Brest, with a
 * narrow field of view (10°: the Earth's limb shows in the lower-left corner, so k̂ visibly points out into space) and the principal
 * point shifted so `at` sits at the box centre. From there Brest's k̂ keeps 62 % of its
 * length on screen and the parallel is a near-circle (the Earth's axis is 77 % face-on), so both the "up" arrow and the turns about
 * the axis read. (A camera above Brest's own meridian would look straight down k̂ and hide it.) The pp shift is a pure translation of
 * the image, so every projected overlay stays exact. */
export const insetCam = (lat: number, lon: number, at: [number, number], fov = 10, box = INSET, dist = 3.4): GlobeCam => {
  const c0: GlobeCam = { lat, lon, dist, fov, pp: [box.w / 2, box.h / 2] };
  const p = globeG(c0, box).p(at[0], at[1]);
  return { ...c0, pp: [box.w + box.x - p[0], box.h + box.y - p[1]] };
};
export const CAM_INSET: GlobeCam = insetCam(50, BREST[1] + 60, BREST);
export const InsetGlobe: React.FC<{ id: string; o: number; cam?: GlobeCam; box?: typeof INSET; over?: (G: GProj) => React.ReactNode; src?: boolean; edge?: number }> = ({
  id, o, cam = CAM_INSET, box = INSET, over, src = false, edge = 40 }) => {
  if (o <= 0) return null;
  const { x, y, w, h } = box;
  const grad = (k: string, x1: number, y1: number, x2: number, y2: number) => (
    <linearGradient key={k} id={`${id}${k}`} x1={x1} y1={y1} x2={x2} y2={y2}><stop offset="0" stopColor={C.bg} stopOpacity={1} /><stop offset="1" stopColor={C.bg} stopOpacity={0} /></linearGradient>);
  const mask = o >= 0.5 ? { name: id, k: "rect", r: [x + edge * 0.6, y + edge * 0.6, x + w - edge * 0.6, y + h - edge * 0.6] } : null;
  return <>
    <Globe cam={cam} box={box} o={o} coast={0.6} grat={0.2} gratStep={10} dim={1.35} over={over} />
    <Svg o={o}>
      <defs>{grad("L", 0, 0, 1, 0)}{grad("R", 1, 0, 0, 0)}{grad("T", 0, 0, 0, 1)}{grad("B", 0, 1, 0, 0)}</defs>
      <rect x={x} y={y} width={edge} height={h} fill={`url(#${id}L)`} />
      <rect x={x + w - edge} y={y} width={edge} height={h} fill={`url(#${id}R)`} />
      <rect x={x} y={y} width={w} height={edge} fill={`url(#${id}T)`} />
      <rect x={x} y={y + h - edge} width={w} height={edge} fill={`url(#${id}B)`} />
      {mask ? <g data-k6-mask={JSON.stringify(mask)} /> : null}
    </Svg>
    {src ? <SourceBelow text="Image: NASA Blue Marble Next Generation · Natural Earth" pic={box} w={960} o={o} name={`${id} src`} /> : null}
  </>;
};
/** a unit arrow of length L (Earth radii) at surface point b in direction d, projected (house SVG arrow) */
export const uarrow = (G: GProj, b: V3, d: V3, L: number, c: string, o = 1, w = 8, head = 30) => garrow(G, b, add3(b, d, L), c, w, head, o);
/** the label position just past the tip of such an arrow */
export const gtip = (G: GProj, b: V3, d: V3, L: number, off = 30): Pt => {
  const p0 = G.pw(b), p1 = G.pw(add3(b, d, L)), dx = p1[0] - p0[0], dy = p1[1] - p0[1], n = Math.hypot(dx, dy) || 1;
  return [p1[0] + (dx / n) * off, p1[1] + (dy / n) * off];
};
/** a direction rigidly turned by `deg` from d0 towards d1 (unit, perpendicular): the 3-D twin of fr_dia's `turned` */
export const turned3 = (d0: V3, d1: V3, deg: number): V3 => { const a = deg * D2R; return [Math.cos(a) * d0[0] + Math.sin(a) * d1[0], Math.cos(a) * d0[1] + Math.sin(a) * d1[1], Math.cos(a) * d0[2] + Math.sin(a) * d1[2]]; };
/** the gold turn arc in 3-D (fr_dia's AngleArc on the globe): about surface point b, from direction d0 towards d1, radius r (Earth
 * radii), swept `deg` degrees, with an open chevron at its end */
export const GArc: React.FC<{ G: GProj; b: V3; d0: V3; d1: V3; r: number; deg: number; o?: number; col?: string }> = ({ G, b, d0, d1, r, deg, o = 1, col = C.gold }) => {
  if (o <= 0 || deg < 2) return null;
  const n = 24, pts: Pt[] = [];
  for (let i = 0; i <= n; i++) pts.push(G.pw(add3(b, turned3(d0, d1, (deg * i) / n), r)));
  const e = pts[n], q = pts[n - 1], dx = e[0] - q[0], dy = e[1] - q[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, s = 16;
  const h1: Pt = [e[0] - s * (ux * 0.87 - uy * 0.5), e[1] - s * (uy * 0.87 + ux * 0.5)], h2: Pt = [e[0] - s * (ux * 0.87 + uy * 0.5), e[1] - s * (uy * 0.87 - ux * 0.5)];
  return (
    <g opacity={o}>
      <path d={poly(pts)} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" />
      <polyline points={`${h1[0]},${h1[1]} ${e[0]},${e[1]} ${h2[0]},${h2[1]}`} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};
/** R̂ at (lat, lon): level, straight away from the Earth's axis (Earth axes (cos λ, sin λ, 0) → globe coordinates) */
export const rhatAt = (lon: number): V3 => [Math.sin(lon * D2R), 0, Math.cos(lon * D2R)];
/** a meridian (pole to pole through lon) on a projected globe */
export const meridianPath = (G: GProj, lon: number, r = 1.002) => llPath(G, Array.from({ length: 61 }, (_, i) => [-90 + 3 * i, lon] as [number, number]), r);
export { add3 };

// ---------------------------------------------------------------- the two derivation diagrams (SVG, schematic)
/** Top view from far above the North Pole. The camera rose along Brest's meridian, so x̂ (to 0 N 0 E) points DOWN the screen
 * and ŷ (to 0 N 90 E) to the RIGHT; longitude λ grows anticlockwise as seen from above. */
export type TopV = { c: Pt; r: number };
export const tvDir = (lam: number): Pt => [Math.sin(lam * D2R), Math.cos(lam * D2R)];           // R̂ on screen
export const tvEast = (lam: number): Pt => [Math.cos(lam * D2R), -Math.sin(lam * D2R)];         // î = R̂ turned +90° (anticlockwise seen from above)
export const tvP = (V: TopV, lam: number, r = V.r): Pt => [V.c[0] + r * tvDir(lam)[0], V.c[1] + r * tvDir(lam)[1]];
/** Meridian slice (half-Earth face): ẑ up the screen, R̂ to the right; a place at latitude φ sits at angle φ above R̂. */
export type SliceV = { c: Pt; r: number };
export const svUp = (phi: number): Pt => [Math.cos(phi * D2R), -Math.sin(phi * D2R)];         // k̂ on screen
export const svNorth = (phi: number): Pt => [-Math.sin(phi * D2R), -Math.cos(phi * D2R)];      // ĵ = k̂ turned +90° towards the pole
export const svP = (V: SliceV, phi: number, r = V.r): Pt => [V.c[0] + r * svUp(phi)[0], V.c[1] + r * svUp(phi)[1]];
export const add = (p: Pt, v: Pt, s = 1): Pt => [p[0] + v[0] * s, p[1] + v[1] * s];
/** an arc of radius r about c from screen angle a0 to a1 (degrees, maths sense on screen: anticlockwise = negative SVG y) */
export const arcD = (c: Pt, r: number, a0: number, a1: number, n = 40) => {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) { const a = (a0 + ((a1 - a0) * i) / n) * D2R; pts.push([c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)]); }
  return poly(pts);
};
/** screen angle (maths sense, degrees) of a screen direction */
export const sang = (v: Pt) => Math.atan2(-v[1], v[0]) / D2R;
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
/** a short gold "this way" arrow from an arrow's tip (the tip's motion when the arrow turns) */
export const Nudge: React.FC<{ from: Pt; dir: Pt; len?: number; o?: number }> = ({ from, dir, len = 70, o = 1 }) =>
  o <= 0 ? null : <Arrow p={from} q={add(from, dir, len)} color={C.gold} w={6} head={24} o={o} />;

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

/** a readout in the text column with a gold link that always leaves from the text's LEFT edge (build-1 K6 lesson: links never
 * run up through the label above). Lines stack downward at 1.25 × size; anchor start. Place inside <Svg>. */
export const SideCallout: React.FC<{ f: number; lines: string[] | string; at: Pt; appear: number; out?: number; target: Pt | null; s?: number; c?: string;
  bend?: number; ctl?: Pt }> = ({ f, lines, at, appear, out, target, s = 54, c = C.key, bend = 30, ctl }) => {
  const LL = Array.isArray(lines) ? lines : [lines];
  LL.forEach((t) => guard(t, at[0], (t.includes("$") ? mixW(t, s) : textW(t, s)) * 0.97));   // r8d: $…$ maths measured as KaTeX (as Lbl does)
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
 * lower part of the maths zone (as Part 1), from the words "skip ahead" for 6 s and at least until that sentence ends. */
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
    <g opacity={o} data-lc-own="skipchip">
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

// ---------------------------------------------------------------- icons (code-drawn, illustrative)
export const PlaneIcon: React.FC<{ p: Pt; a?: number; s?: number; o?: number; c?: string }> = ({ p, a = 0, s = 1, o = 1, c = C.ink }) => o <= 0 ? null : (
  <g opacity={o} transform={`translate(${p[0]} ${p[1]}) rotate(${-a}) scale(${s})`}>
    <path d="M 34 0 L 12 -4 L -2 -28 L -11 -28 L -4 -4 L -22 -4 L -28 -15 L -34 -15 L -30 0 L -34 15 L -28 15 L -22 4 L -4 4 L -11 28 L -2 28 L 12 4 Z"
      fill={c} stroke={C.bg} strokeWidth={3} />
  </g>
);
export const ParcelDot: React.FC<{ p: Pt; o?: number; r?: number }> = ({ p, o = 1, r = 13 }) => o <= 0 ? null :
  <circle cx={p[0]} cy={p[1]} r={r} fill={C.key} stroke={C.bg} strokeWidth={4} opacity={o} />;
export { Arrow, Svg, clamp, textW };
