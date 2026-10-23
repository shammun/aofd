import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  BalloonThermometer, EndCard, EqLine, Footnote, GhostArrow, HOUSE, PoleThermometer, ScaleBadge, TERM, ramp, tex,
} from "../house";
import timing from "../../ch00/ch00_dot_product_why/timing.json";
import pair from "../../ch00/ch00_dot_product_why/data/pair.json";
import same from "../../ch00/ch00_dot_product_why/data/same_way.json";
import cheap from "../../ch00/ch00_dot_product_why/data/cheap.json";
import work from "../../ch00/ch00_dot_product_why/data/work.json";
import wx from "../../ch00/ch00_dot_product_why/data/weather.json";

/**
 * Chapter 0A movie "What the dot product measures, and why it multiplies by the other length"
 * (movies/ch00/ch00_dot_product_why/storyboard.yaml, round 4: 21 scenes), 1920×1080, 30 fps, 367.2 s.
 * Every number on screen is read from data/*.json, written by movies/data/build_ch00_dot_product_why.py from the tested
 * fluidpy functions (fluidpy.geo.vectors, fluidpy.core.operators.gradient, fluidpy.core.kinematics). This file only
 * indexes those samples by frame. Scene cuts and reveals come from timing.json (tools/tts.py, af_bella ×1.0).
 * Rules: a scalar is never an arrow (number, gauge, or the shadow × length rectangle); first vector teal, second orange;
 * a shadow takes the colour of the arrow that casts it; negative products rose + hatched + dashed outline.
 * Every frame that shows a labelled equation shows the Footnote strip (text = storyboard `footnotes:`).
 */

export const DPW_FPS = 30;
const FPS = DPW_FPS;
const sc = timing.scenes;
const HOLD = 75; // 2.5-s silent end-card hold
export const DPW_FRAMES = timing.total_frames + HOLD;
const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
const END = [...CUT.slice(1), DPW_FRAMES];
const LEN = (k: number) => END[k] - CUT[k];
/** start / end frame of sentence j of scene k, relative to the scene's first frame */
const SS = (k: number, j: number) => Math.round(sc[k].sentences[j].start * FPS) - CUT[k];
const SE = (k: number, j: number) => Math.round(sc[k].sentences[j].end * FPS) - CUT[k];
/** frame (scene-relative) at which `phrase` is spoken in sentence j of scene k (proportional to characters) */
const AT = (k: number, j: number, phrase: string) => {
  const s = sc[k].sentences[j];
  const i = s.text.indexOf(phrase);
  if (i < 0) throw new Error(`phrase "${phrase}" not in ${sc[k].id} sentence ${j}`);
  return Math.round((s.start + ((s.end - s.start) * i) / s.text.length) * FPS) - CUT[k];
};

// ---------------------------------------------------------------- footnotes (verbatim from the storyboard)
const FN = {
  K22: "(K 2.2) = Kundu, Cohen & Dowling, Fluid Mechanics, 5th ed. (2012), §2.1, eq. (2.2), p. 41",
  A1: "(0A.1) = our label (Chapter 0, Part A); Kundu states u·v = uv cos θ unnumbered, §2.8, p. 52",
  A3: "(0A.3) = our label (Chapter 0, Part A); derived on screen from (0A.1); no book number",
  sym: "a·b = b·a: Kundu §2.8, p. 51 (unnumbered)",
  work: "W = F·d: the school definition of work; no book number",
  V17: "(Vallis 1.7) = Vallis, Atmospheric and Oceanic Fluid Dynamics, 2nd ed. (2017), §1.1.2, eq. (1.7), p. 5",
  grad: "∇T = (∂T/∂x, ∂T/∂y): the gradient, Kundu §2.9, p. 52 (unnumbered, after (K 2.22)); 2-D map, so no z-part",
  dTdt: "∂T/∂t = −v·∇T: derived on screen from (Vallis 1.7) with φ = T and DT/Dt = 0; not a numbered equation",
};

// ---------------------------------------------------------------- equations (verbatim from the storyboard)
const EQ_K22 = String.raw`\mathbf a\cdot\mathbf b = a_1b_1 + a_2b_2 + a_3b_3 \equiv a_ib_i`;
const EQ_0A1 = String.raw`\mathbf a\cdot\mathbf b = |\mathbf a|\,|\mathbf b|\cos\theta = (|\mathbf a|\cos\theta)\,|\mathbf b|`;
const EQ_0A3 = String.raw`|\mathbf a|\cos\theta = \mathbf a\cdot\hat{\mathbf b} = \frac{\mathbf a\cdot\mathbf b}{|\mathbf b|},\qquad \hat{\mathbf b} = \frac{\mathbf b}{|\mathbf b|}`;
const EQ_SYM = String.raw`\mathbf a\cdot\mathbf b = (|\mathbf a|\cos\theta)\,|\mathbf b| = (|\mathbf b|\cos\theta)\,|\mathbf a| = \mathbf b\cdot\mathbf a`;
const EQ_W = String.raw`W = \mathbf F\cdot\mathbf d = |\mathbf F|\,|\mathbf d|\cos\theta`;
const EQ_17 = String.raw`\frac{D\varphi}{Dt} = \frac{\partial\varphi}{\partial t} + (\mathbf v\cdot\nabla)\varphi`;
const EQ_17T = String.raw`\frac{DT}{Dt} = \frac{\partial T}{\partial t} + (\mathbf v\cdot\nabla)T`;
const EQ_TFORM = String.raw`\frac{DT}{Dt} = \frac{\partial T}{\partial t} + \mathbf v\cdot\nabla T`;
const EQ_GRAD = String.raw`\nabla T = \left(\frac{\partial T}{\partial x},\ \frac{\partial T}{\partial y}\right) = (1.00\times10^{-5}\ \mathrm{K\,m^{-1}},\ 0)`;
const EQ_VGT = String.raw`\mathbf v\cdot\nabla T = (|\mathbf v|\cos\theta)\,|\nabla T|`;
const EQ_DTDT = String.raw`\frac{\partial T}{\partial t} = -\,\mathbf v\cdot\nabla T \quad\text{when } \frac{DT}{Dt} = 0`;

const TEAL = HOUSE.glyphA, ORANGE = HOUSE.glyphB, ROSE = TERM.friction, INK = HOUSE.ink, MUTED = HOUSE.muted;
const GOLD = TERM.forcing, SLATE = TERM.tendency, GREY = "#5c6680";
const col = (c: string, s: string) => `\\textcolor{${c}}{${s}}`;
const rep = (s: string, a: string, b: string) => {
  if (!s.includes(a)) throw new Error(`TeX variant: "${a}" not found`);
  return s.replace(a, b);
};
// highlighted variants: colour/box by string replacement, so the plain storyboard TeX stays in this file
const EQ_K22_HL = rep(rep(rep(EQ_K22, "a_1b_1", col(TEAL, "a_1b_1")), "a_2b_2", col(TEAL, "a_2b_2")), "a_3b_3", col(GREY, "a_3b_3"));
const EQ_K22_SUB = String.raw`\mathbf a\cdot\mathbf b = \boxed{a_{${col(GOLD, "1")}}b_{${col(GOLD, "1")}}} + \boxed{a_{${col(GOLD, "2")}}b_{${col(GOLD, "2")}}} + \boxed{a_{${col(GOLD, "3")}}b_{${col(GOLD, "3")}}} \equiv a_ib_i`;
const EQ_K22_IDX = rep(EQ_K22, String.raw`\equiv a_ib_i`, String.raw`\equiv ${col(GOLD, String.raw`\boxed{a_ib_i}`)}`);
const TAIL_0A1 = String.raw`(|\mathbf a|\cos\theta)\,|\mathbf b|`;
const EQ_0A1_DIM = rep(EQ_0A1, `= ${TAIL_0A1}`, col("#4a5574", `= ${TAIL_0A1}`));
const EQ_0A1_BOX = rep(EQ_0A1, TAIL_0A1, String.raw`${col(TEAL, String.raw`\boxed{(|\mathbf a|\cos\theta)}`)}\,${col(ORANGE, String.raw`\boxed{|\mathbf b|}`)}`);
const EQ_17_PHI = EQ_17.replace(/\\varphi/g, col(GOLD, String.raw`\boxed{\varphi}`));
const EQ_17_V = rep(EQ_17_PHI, String.raw`\mathbf v`, col(TEAL, String.raw`\boxed{\mathbf v}`));
const EQ_17_HL = rep(rep(EQ_17, String.raw`\frac{\partial\varphi}{\partial t}`, col(SLATE, String.raw`\frac{\partial\varphi}{\partial t}`)),
  String.raw`(\mathbf v\cdot\nabla)\varphi`, col(TEAL, String.raw`(\mathbf v\cdot\nabla)\varphi`));
const EQ_TFORM_HL = rep(EQ_TFORM, String.raw`\mathbf v\cdot\nabla T`, col(TEAL, String.raw`\mathbf v\cdot\nabla T`));
const EQ_VGT_X = rep(EQ_VGT, String.raw`\,|\nabla T|`, String.raw`\times|\nabla T|`);
const EQ_DTDT_HL = rep(EQ_DTDT, String.raw`-\,\mathbf v\cdot\nabla T`, col(TEAL, String.raw`-\,\mathbf v\cdot\nabla T`));

// ---------------------------------------------------------------- formatting
const minus = (s: string) => s.replace(/^-/, "−");
const fx = (v: number, d = 3) => minus(v.toFixed(d));
const fs = (v: number, d = 3) => (v > 0 && Number(v.toFixed(d)) !== 0 ? "+" : "") + minus(Math.abs(v) < 0.5 * 10 ** -d ? (0).toFixed(d) : v.toFixed(d));
const sup = (n: number) => String(n).replace("-", "⁻").replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]);
const sci = (v: number, d = 2) => {
  const e = Math.floor(Math.log10(Math.abs(v)));
  return `${minus((v / 10 ** e).toFixed(d))}×10${sup(e)}`;
};
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const FONT: React.CSSProperties = { fontFamily: HOUSE.font, color: INK };
/** a quantity's minus sign in rose (signs are read from the data, never hard-coded) */
const sgn = (v: number, txt: string) => <>{v < 0 ? <span style={{ color: ROSE }}>−</span> : null}{txt}</>;

// ---------------------------------------------------------------- drawing kit (SVG, px)
type Pt = [number, number];
const mkP = (ox: number, oy: number, u: number) => (x: number, y: number): Pt => [ox + x * u, oy - y * u];
const lerp = (p: Pt, q: Pt, t: number): Pt => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];

const Arrow: React.FC<{ p: Pt; q: Pt; color: string; w?: number; head?: number; o?: number; halo?: boolean }> = ({
  p, q, color, w = 6, head = 26, o = 1, halo = false,
}) => {
  const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
  if (L < 1) return null;
  const ux = dx / L, uy = dy / L, h = Math.min(head, L * 0.5), nx = -uy, ny = ux;
  const bx = q[0] - ux * h, by = q[1] - uy * h;
  const tri = `${q[0]},${q[1]} ${bx + nx * h * 0.5},${by + ny * h * 0.5} ${bx - nx * h * 0.5},${by - ny * h * 0.5}`;
  return (
    <g opacity={o}>
      {halo ? <g stroke={HOUSE.bg} strokeWidth={5} strokeLinejoin="round" fill={HOUSE.bg}>
        <line x1={p[0]} y1={p[1]} x2={q[0] - ux * h * 0.6} y2={q[1] - uy * h * 0.6} strokeWidth={w + 6} strokeLinecap="round" />
        <polygon points={tri} />
      </g> : null}
      <line x1={p[0]} y1={p[1]} x2={q[0] - ux * h * 0.6} y2={q[1] - uy * h * 0.6} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <polygon points={tri} fill={color} />
    </g>
  );
};

const Lbl: React.FC<{ x: number; y: number; t: string; c?: string; s?: number; a?: "start" | "middle" | "end"; o?: number;
  b?: boolean }> = ({ x, y, t, c = INK, s = 32, a = "start", o = 1, b = false }) => (
  <text x={x} y={y} fill={c} fontSize={s} fontFamily={HOUSE.font} fontWeight={b ? 700 : 500} textAnchor={a}
    dominantBaseline="middle" stroke={HOUSE.bg} strokeWidth={7} strokeLinejoin="round" paintOrder="stroke" opacity={o}>
    {t}
  </text>
);

const Grid: React.FC<{ P: (x: number, y: number) => Pt; xr: [number, number]; yr: [number, number]; o?: number }> = ({ P, xr, yr, o = 1 }) => {
  const ls = [];
  for (let x = xr[0]; x <= xr[1]; x++) {
    const [a, b] = [P(x, yr[0]), P(x, yr[1])];
    ls.push(<line key={`x${x}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={x === 0 ? "#4a5677" : HOUSE.grid} strokeWidth={x === 0 ? 3 : 1.5} />);
  }
  for (let y = yr[0]; y <= yr[1]; y++) {
    const [a, b] = [P(xr[0], y), P(xr[1], y)];
    ls.push(<line key={`y${y}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={y === 0 ? "#4a5677" : HOUSE.grid} strokeWidth={y === 0 ? 3 : 1.5} />);
  }
  return <g opacity={o}>{ls}</g>;
};

/** Thick translucent band on a line: the shadow (colour of the arrow that casts it). */
const Band: React.FC<{ p: Pt; q: Pt; color: string; o?: number; w?: number }> = ({ p, q, color, o = 1, w = 16 }) => (
  Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.5 || o <= 0 ? null :
    <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={color} strokeWidth={w} strokeOpacity={0.7 * o} strokeLinecap="butt" />
);
const Dash: React.FC<{ p: Pt; q: Pt; c?: string; o?: number; w?: number; d?: string }> = ({ p, q, c = INK, o = 1, w = 3, d = "10 9" }) =>
  <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={c} strokeWidth={w} strokeDasharray={d} opacity={o} />;
const RightTick: React.FC<{ at: Pt; u1: Pt; u2: Pt; s?: number; o?: number }> = ({ at, u1, u2, s = 18, o = 1 }) => (
  <polyline points={`${at[0] + u1[0] * s},${at[1] + u1[1] * s} ${at[0] + (u1[0] + u2[0]) * s},${at[1] + (u1[1] + u2[1]) * s} ${at[0] + u2[0] * s},${at[1] + u2[1] * s}`}
    fill="none" stroke={INK} strokeWidth={2.5} opacity={o} />
);
const unit = (p: Pt, q: Pt): Pt => { const L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [(q[0] - p[0]) / L, (q[1] - p[1]) / L]; };

/** Length bracket parallel to p→q, offset by `off` px along the screen normal (−uy, ux). */
const Bracket: React.FC<{ p: Pt; q: Pt; off: number; c: string; label?: string; lo?: number; o?: number; s?: number;
  a?: "start" | "middle" | "end" }> = ({ p, q, off, c, label, lo = 34, o = 1, s = 30, a = "middle" }) => {
  const [ux, uy] = unit(p, q), nx = -uy, ny = ux;
  const P1: Pt = [p[0] + nx * off, p[1] + ny * off], Q1: Pt = [q[0] + nx * off, q[1] + ny * off];
  const t = 10 * Math.sign(off || 1);
  const mid = lerp(P1, Q1, 0.5);
  return (
    <g opacity={o}>
      <polyline points={`${P1[0] - nx * t},${P1[1] - ny * t} ${P1[0]},${P1[1]} ${Q1[0]},${Q1[1]} ${Q1[0] - nx * t},${Q1[1] - ny * t}`}
        fill="none" stroke={c} strokeWidth={3} />
      {label ? <Lbl x={mid[0] + nx * lo * Math.sign(off || 1)} y={mid[1] + ny * lo * Math.sign(off || 1)} t={label} c={c} s={s} a={a} /> : null}
    </g>
  );
};

/** The product rectangle (scalar shown as an area): ink + solid outline when ≥ 0, rose hatched + dashed when < 0. */
const ProdRect: React.FC<{ pts: Pt[]; neg: boolean; o?: number; id: string }> = ({ pts, neg, o = 1, id }) => (
  <g opacity={o}>
    <defs>
      <pattern id={id} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width={14} height={14} fill={ROSE} fillOpacity={0.16} />
        <line x1={0} y1={0} x2={0} y2={14} stroke={ROSE} strokeWidth={4} />
      </pattern>
    </defs>
    <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={neg ? `url(#${id})` : "rgba(232,236,244,0.18)"}
      stroke={neg ? ROSE : INK} strokeWidth={3} strokeDasharray={neg ? "12 8" : undefined} strokeLinejoin="round" />
  </g>
);

/** Arc between world angles a0 → a1 (degrees, anticlockwise) of radius r (world units). */
const Arc: React.FC<{ P: (x: number, y: number) => Pt; a0: number; a1: number; r: number; c?: string; o?: number }> = ({ P, a0, a1, r, c = INK, o = 1 }) => {
  const n = 40, pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    pts.push(P(r * Math.cos(t), r * Math.sin(t)).join(","));
  }
  return <polyline points={pts.join(" ")} fill="none" stroke={c} strokeWidth={3} opacity={o} />;
};

/** Horizontal number-line gauge for a scalar (never an arrow in space). */
const Gauge: React.FC<{ x: number; y: number; w: number; min: number; max: number; step: number; value: number;
  label: string; readout?: string; o?: number; dec?: number; lc?: string }> = ({ x, y, w, min, max, step, value, label, readout, o = 1, dec = 3, lc = MUTED }) => {
  const X = (v: number) => x + ((v - min) / (max - min)) * w;
  const ticks = [];
  const k0 = Math.ceil(min / step - 1e-9), k1 = Math.floor(max / step + 1e-9);
  for (let k = k0; k <= k1; k++) {
    const v = k * step;
    ticks.push(
      <g key={k}>
        <line x1={X(v)} y1={y - (v === 0 ? 16 : 10)} x2={X(v)} y2={y + (v === 0 ? 16 : 10)} stroke={v === 0 ? INK : MUTED} strokeWidth={v === 0 ? 3 : 2} />
        <Lbl x={X(v)} y={y + 36} t={minus(String(v))} c={MUTED} s={28} a="middle" />
      </g>,
    );
  }
  const neg = value < -1e-9;
  const mx = X(clamp(value, min, max));
  return (
    <g opacity={o}>
      {min < 0 ? <line x1={X(min)} y1={y} x2={X(0)} y2={y} stroke={ROSE} strokeWidth={4} strokeDasharray="10 7" /> : null}
      <line x1={X(Math.max(0, min))} y1={y} x2={X(max)} y2={y} stroke={MUTED} strokeWidth={4} />
      {ticks}
      {label ? <Lbl x={x} y={y - 96} t={label} c={lc} s={30} a="start" /> : null}
      <line x1={mx} y1={y - 26} x2={mx} y2={y + 4} stroke={neg ? ROSE : INK} strokeWidth={5} />
      <polygon points={`${mx},${y + 2} ${mx - 13},${y - 22} ${mx + 13},${y - 22}`} fill={neg ? ROSE : INK} />
      <Lbl x={mx} y={y - 50} t={readout ?? fs(value, dec)} c={neg ? ROSE : INK} s={32} a="middle" b />
    </g>
  );
};

const Chip: React.FC<{ text: React.ReactNode; x: number; y: number; color?: string; size?: number; o?: number; w?: number }> = ({
  text, x, y, color = HOUSE.accent, size = 32, o = 1, w,
}) => (
  <div style={{ position: "absolute", left: x, top: y, ...FONT, fontSize: size, background: HOUSE.panel, opacity: o,
    border: `2px solid ${color}`, borderRadius: 10, padding: "8px 18px", maxWidth: w ?? 1200, lineHeight: 1.25 }}>{text}</div>
);
const Txt: React.FC<{ x: number; y: number; w?: number; s?: number; c?: string; o?: number; children: React.ReactNode;
  align?: "left" | "center" | "right"; bold?: boolean }> = ({ x, y, w = 820, s = 32, c = INK, o = 1, children, align = "left", bold }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, ...FONT, fontSize: s, color: c, opacity: o,
    textAlign: align, lineHeight: 1.3, fontWeight: bold ? 700 : 400 }}>{children}</div>
);
/** An EqLine centred in a box (the house EqLine centres in its parent), equation label at the right (30 px). */
const EqBox: React.FC<{ latex: string; x: number; y: number; w: number; h?: number; size?: number; number?: string; o?: number;
  nw?: number }> = ({ latex, x, y, w, h = 120, size = 42, number, o = 1, nw = 190 }) => (
  o <= 0 ? null :
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: number ? w - nw : w, height: h }}>
        <EqLine latex={latex} size={size} y={50} />
      </div>
      {number ? <div style={{ position: "absolute", right: 0, width: nw - 10, top: "50%", transform: "translateY(-50%)",
        ...FONT, fontSize: 30, color: MUTED, textAlign: "right", lineHeight: 1.15 }}>({number})</div> : null}
    </div>
);
const TeX: React.FC<{ s: string; x: number; y: number; size?: number; o?: number; c?: string; w?: number; align?: "left" | "center" }> = ({
  s, x, y, size = 34, o = 1, c = INK, w, align = "left",
}) => (
  o <= 0 ? null :
    <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, fontSize: size, color: c, opacity: o }}
      dangerouslySetInnerHTML={{ __html: tex(s, false) }} />
);
/** House ScaleBadge, enlarged 1.15× (26 → 30 px text); bottom corners sit above the footnote strip (y < 1000). */
const Badge: React.FC<{ detail: string; corner?: "tl" | "tr" | "bl" | "br"; o?: number }> = ({ detail, corner = "tr", o = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: corner[0] === "b" ? 985 : 1080, opacity: o,
    transform: "scale(1.15)", transformOrigin: { tl: "top left", tr: "top right", bl: "bottom left", br: "bottom right" }[corner] }}>
    <ScaleBadge detail={detail} corner={corner} />
  </div>
);
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{children}</svg>
);
const Scene: React.FC<{ children: React.ReactNode; o?: number }> = ({ children, o = 1 }) => (
  <AbsoluteFill style={{ background: HOUSE.bg }}><AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill></AbsoluteFill>
);
const GridNote: React.FC<{ o?: number; y?: number }> = ({ o = 1, y = 950 }) => (
  <Txt x={40} y={y} s={28} c={MUTED} o={o}>1 grid square = 1 unit (equal axes)</Txt>
);

// ---------------------------------------------------------------- data shortcuts (pair)
const A = pair.a as Pt, B = pair.b as Pt;
const NA = pair.norm_a, NB = pair.norm_b, TH = pair.theta_deg, AB = pair.a_dot_b;
const SHAB = pair.shadow_a_on_b, SHBA = pair.shadow_b_on_a;
const PAB = pair.proj_a_on_b as Pt, PBA = pair.proj_b_on_a as Pt;
const BH = pair.b_hat as Pt;
const PHI_A = (Math.atan2(A[1], A[0]) * 180) / Math.PI, PHI_B = (Math.atan2(B[1], B[0]) * 180) / Math.PI;
const nL_B: Pt = [pair.k_cross_b[0] / NB, pair.k_cross_b[1] / NB]; // unit left normal of b (k × b̂)
const nR_A: Pt = [-pair.k_cross_a[0] / NA, -pair.k_cross_a[1] / NA]; // unit right normal of a

// =============================================================== the pair plane (s01-s09, s11)
const P12 = mkP(380, 790, 95);
const PairBase: React.FC<{ g?: number; dim?: number; gridO?: number }> = ({ g = 1, dim = 1, gridO = 1 }) => {
  const P = P12, O = P(0, 0);
  return (
    <g>
      <Grid P={P} xr={[-3, 5]} yr={[-1, 5]} o={gridO} />
      <Dash p={P(-B[0] * 0.33, -B[1] * 0.33)} q={P(B[0] * 1.6, B[1] * 1.6)} c={ORANGE} o={0.35 * g * dim} w={2} />
      <Arrow p={O} q={P(B[0] * g, B[1] * g)} color={ORANGE} o={dim} />
      <Arrow p={O} q={P(A[0] * g, A[1] * g)} color={TEAL} o={dim} />
      <Lbl x={O[0] - 18} y={O[1] + 26} t="O" c={MUTED} s={30} a="end" o={dim} />
      <Lbl x={P(5.2, 1)[0]} y={P(5.2, 1)[1]} t="a" c={TEAL} s={44} b o={g * dim} />
      <Lbl x={P(1.15, 3.3)[0]} y={P(1.15, 3.3)[1]} t="b" c={ORANGE} s={44} b o={g * dim} />
    </g>
  );
};
const PairChips: React.FC<{ o?: number }> = ({ o = 1 }) => (<>
  <Chip text="a = (5, 1)" x={110} y={200} color={TEAL} o={o} />
  <Chip text="b = (1, 3)" x={330} y={200} color={ORANGE} o={o} />
</>);
const PX = 960, PW = 920; // right panel

// ---------------------------------------------------------------- s01 hook
const S01: React.FC = () => {
  const f = useCurrentFrame();
  const g = ramp(f, 0, 30);
  const oCh = ramp(f, 36, 46), slide = ramp(f, 48, 74), oBox = ramp(f, 40, 52);
  const drop = ramp(f, 76, 100), oG = ramp(f, 70, 84);
  const t2 = SS(0, 1), oAg = ramp(f, t2, t2 + 12);
  const box: Pt = [1440, 470];
  const ca: Pt = lerp([1010, 300], [box[0] - 150, box[1] - 30], slide), cb: Pt = lerp([1640, 300], [box[0] + 40, box[1] - 30], slide);
  const GX = 1040, GW = 780, GY = 820;
  const markX = GX + ((AB + 16.1) / 32.2) * GW;
  const num: Pt = lerp([box[0] + 20, box[1] + 90], [markX, GY - 60], drop);
  return (
    <Scene>
      <Svg>
        <PairBase g={g} />
        <Gauge x={GX} y={GY} w={GW} min={-16.1} max={16.1} step={4} value={AB} label="a·b: one number, not an arrow" o={oG * drop} />
        {/* funnel */}
        <path d={`M ${box[0] - 200} ${box[1] - 110} L ${box[0] - 100} ${box[1] - 40} L ${box[0] + 140} ${box[1] - 40} L ${box[0] + 240} ${box[1] - 110}`}
          fill="none" stroke={MUTED} strokeWidth={3} opacity={oBox} />
        {drop < 1 ? <Lbl x={num[0]} y={num[1]} t="8" s={64} b o={ramp(f, 72, 80)} a="middle" /> : null}
      </Svg>
      <div style={{ position: "absolute", left: box[0] - 100, top: box[1] - 40, width: 240, height: 100, background: HOUSE.panel,
        border: `3px solid ${HOUSE.accent}`, borderRadius: 14, opacity: oBox, ...FONT, fontSize: 52, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center" }}>a·b</div>
      <Chip text="a = (5, 1)" x={ca[0]} y={ca[1]} color={TEAL} o={oCh * (1 - ramp(f, 64, 76))} />
      <Chip text="b = (1, 3)" x={cb[0]} y={cb[1]} color={ORANGE} o={oCh * (1 - ramp(f, 64, 76))} />
      <div style={{ position: "absolute", left: 60, top: 30, ...FONT }}>
        <div style={{ fontSize: 64, fontWeight: 700 }}>The dot product</div>
        <div style={{ fontSize: 34, color: MUTED }}>what it measures, and why it multiplies by the other length</div>
      </div>
      <Chip text={"1 · what it is\u00a0\u00a0\u00a0\u00a0 2 · why it’s built this way"} x={60} y={180} o={oAg} size={32} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s02 arrows and components
const S02: React.FC = () => {
  const f = useCurrentFrame(), k = 1;
  const t1 = SS(k, 1), t2 = SS(k, 2), t2b = AT(k, 2, "the numbers are components"), t3 = SS(k, 3);
  const P = P12, O = P(0, 0);
  const oA = ramp(f, t1, t1 + 15), oB = ramp(f, t2, t2 + 15), oCap = ramp(f, t2b, t2b + 12), oPy = ramp(f, t3, t3 + 15);
  const oPy2 = ramp(f, t3 + 45, t3 + 60);
  const off = 0.45;
  return (
    <Scene o={ramp(f, 0, 10)}>
      <Svg>
        <PairBase />
        <g opacity={oA}>
          <Dash p={O} q={P(A[0], 0)} c={TEAL} w={4} d="4 8" />
          <Dash p={P(A[0], 0)} q={P(...A)} c={TEAL} w={4} d="4 8" />
          <Lbl x={P(2.5, -0.4)[0]} y={P(2.5, -0.4)[1]} t="5" c={TEAL} s={36} a="middle" b />
          <Lbl x={P(5.3, 0.5)[0]} y={P(5.3, 0.5)[1]} t="1" c={TEAL} s={36} b />
        </g>
        <g opacity={oB}>
          <Dash p={O} q={P(B[0], 0)} c={ORANGE} w={4} d="2 6" />
          <Dash p={P(B[0], 0)} q={P(...B)} c={ORANGE} w={4} d="4 8" />
          <Lbl x={P(0.5, -0.4)[0]} y={P(0.5, -0.4)[1]} t="1" c={ORANGE} s={36} a="middle" b />
          <Lbl x={P(1.3, 1.6)[0]} y={P(1.3, 1.6)[1]} t="3" c={ORANGE} s={36} b />
        </g>
        <g opacity={oPy}>
          <RightTick at={P(A[0], 0)} u1={[-1, 0]} u2={[0, -1]} />
          <RightTick at={P(B[0], 0)} u1={[-1, 0]} u2={[0, -1]} />
        </g>
        <g opacity={oPy2}>
          <Bracket p={P(nL_B[0] * off, nL_B[1] * off)} q={P(B[0] + nL_B[0] * off, B[1] + nL_B[1] * off)} off={0} c={ORANGE} />
          <Lbl x={P(B[0] * 0.5 + nL_B[0] * 0.85, B[1] * 0.5 + nL_B[1] * 0.85)[0]} y={P(B[0] * 0.5 + nL_B[0] * 0.85, B[1] * 0.5 + nL_B[1] * 0.85)[1]}
            t="|b|" c={ORANGE} s={36} b a="end" />
          <Bracket p={P(-nR_A[0] * 0.4, -nR_A[1] * 0.4)} q={P(A[0] - nR_A[0] * 0.4, A[1] - nR_A[1] * 0.4)} off={0} c={TEAL} />
          <Lbl x={P(2.3, 1.35)[0]} y={P(2.3, 1.35)[1]} t="|a|" c={TEAL} s={36} b a="middle" />
        </g>
      </Svg>
      <Chip text="vector = length + direction" x={40} y={30} o={ramp(f, 0, 12)} />
      <Chip text="a = (5, 1)" x={PX + 20} y={260} color={TEAL} o={oA} size={36} />
      <Chip text="b = (1, 3)" x={PX + 300} y={260} color={ORANGE} o={oB} size={36} />
      <Txt x={PX + 20} y={360} w={PW - 40} s={32} o={oCap}>
        the numbers are the <b>components</b> (parts):<br />
        <span style={{ color: TEAL }}>a₁ = 5, a₂ = 1</span> · <span style={{ color: ORANGE }}>b₁ = 1, b₂ = 3</span>
      </Txt>
      <Txt x={PX + 20} y={500} w={PW - 40} s={30} c={MUTED} o={oPy}>Pythagoras: length² = (x-part)² + (y-part)²</Txt>
      <Txt x={PX + 20} y={560} w={PW - 40} s={38} c={TEAL} o={oPy} bold>|a| = √(5² + 1²) = √{pair.norm_a_sq.toFixed(0)} = {NA.toFixed(3)}</Txt>
      <Txt x={PX + 20} y={630} w={PW - 40} s={38} c={ORANGE} o={oPy2} bold>|b| = √(1² + 3²) = √{pair.norm_b_sq.toFixed(0)} = {NB.toFixed(3)}</Txt>
      <GridNote />
    </Scene>
  );
};

// ---------------------------------------------------------------- s03 definition 1 (K 2.2)
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = 2;
  const t1 = SS(k, 1), t2 = SS(k, 2);
  const oEq = ramp(f, 4, 16), oSub = ramp(f, t1, t1 + 12), oIdx = ramp(f, t2, t2 + 12), oSum = ramp(f, t2 + 40, t2 + 52);
  const eq = f >= t2 ? EQ_K22_IDX : f >= t1 ? EQ_K22_SUB : EQ_K22_HL;
  return (
    <Scene>
      <Svg><PairBase /></Svg>
      <PairChips />
      <Chip text="Definition 1 · multiply matching parts, then add" x={40} y={30} />
      <EqBox latex={eq} x={PX - 20} y={150} w={PW + 20} size={44} number="K 2.2" o={oEq} />
      <Txt x={PX + 20} y={290} w={PW - 40} s={32} c={GOLD} o={oSub}>
        small number = which part: 1 → x, 2 → y, 3 → z<br /><span style={{ color: INK, fontSize: 30 }}>the boxes pair matching parts: a₁ with b₁, a₂ with b₂, a₃ with b₃</span>
      </Txt>
      <Txt x={PX + 20} y={430} w={PW - 40} s={32} o={oIdx}><span style={{ color: GOLD }}>i</span> appears twice → add over i = 1, 2, 3:</Txt>
      <TeX s={String.raw`a_ib_i\ \text{ means }\ \displaystyle\sum_{i=1}^{3} a_ib_i = a_1b_1 + a_2b_2 + a_3b_3`} x={PX + 20} y={490} size={36} o={oSum} />
      <Txt x={PX + 20} y={600} w={PW - 40} s={30} c={MUTED} o={oSum}>≡ : “is defined as” (a shorthand, not a new fact)</Txt>
      <GridNote />
      <Footnote items={[FN.K22]} o={oEq} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s04 how to read the labels
const Pill: React.FC<{ children: React.ReactNode; c: string }> = ({ children, c }) => (
  <div style={{ width: 290, flex: "0 0 auto", textAlign: "center", border: `3px solid ${c}`, borderRadius: 40, padding: "10px 0",
    fontSize: 40, fontWeight: 700, color: c, background: HOUSE.bg }}>{children}</div>
);
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = 3;
  const t1 = SS(k, 1), t2 = SS(k, 2), tF = AT(k, 2, "and the footnote");
  const r = (t: number) => ramp(f, t, t + 14);
  const emph = 0.0 + ramp(f, tF, tF + 15) * (1 - 0.15 * ramp(f, tF + 15, tF + 30));
  const row = (o: number, pill: React.ReactNode, c: string, text: React.ReactNode) => (
    <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: o, minHeight: 150 }}>
      <Pill c={c}>{pill}</Pill>
      <div style={{ fontSize: 44, color: MUTED }}>→</div>
      <div style={{ fontSize: 31, lineHeight: 1.3 }}>{text}</div>
    </div>
  );
  return (
    <Scene>
      <Svg><g opacity={0.2}><PairBase /></g></Svg>
      <Chip text="How to read the equation labels" x={40} y={30} />
      <EqBox latex={EQ_K22} x={PX - 20} y={40} w={PW + 20} h={100} size={38} number="K 2.2" />
      <div style={{ position: "absolute", left: 110, top: 175, width: 1700, background: "rgba(24,32,50,0.95)", borderRadius: 18,
        border: `2px solid ${HOUSE.grid}`, padding: "18px 36px", boxSizing: "border-box", ...FONT, display: "flex",
        flexDirection: "column", gap: 10 }}>
        {row(r(0), "(K 2.2)", INK, <>K = <b>Kundu, Cohen &amp; Dowling, <i>Fluid Mechanics</i></b>, 5th ed. (2012) · equation 2.2</>)}
        {row(r(t1), <span>(<span style={{ border: `3px solid ${GOLD}`, borderRadius: "50%", padding: "0 8px" }}>0</span>A.1)</span>, GOLD,
          <>0A = zero-A, with the <b>digit zero</b> (not the letter O): <b>our label</b> for Chapter 0, Part A (the maths toolkit)
            of this course · <span style={{ color: GOLD }}>not a book number</span></>)}
        {row(r(t2), "(Vallis 1.7)", TEAL, <><b>Vallis, <i>Atmospheric and Oceanic Fluid Dynamics</i></b>, 2nd ed. (2017) · the book this
          course follows · equation 1.7</>)}
      </div>
      <Txt x={196} y={470} w={300} s={28} c={GOLD} o={r(t1)}>↑ digit 0</Txt>
      <Svg>
        <g opacity={r(tF)}>
          <line x1={960} y1={870} x2={960} y2={985} stroke={HOUSE.accent} strokeWidth={4} />
          <polygon points="960,997 948,975 972,975" fill={HOUSE.accent} />
        </g>
      </Svg>
      <Txt x={990} y={895} w={880} s={32} c={HOUSE.accent} o={r(tF)} bold>exact section and page: always in the footnote</Txt>
      <Footnote items={[FN.K22]} emphasis={emph} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s05 worked example
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = 4;
  const t1 = SS(k, 1), t2 = SS(k, 2);
  const oSum = ramp(f, 6, 20), oZ = ramp(f, t1, t1 + 12), oG = ramp(f, t2, t2 + 14);
  const sumTex = String.raw`\boxed{${col(TEAL, "5")}\cdot ${col(ORANGE, "1")}} + \boxed{${col(TEAL, "1")}\cdot ${col(ORANGE, "3")}} + ${col(GREY, "0\\cdot 0")} = ${AB.toFixed(0)}`;
  return (
    <Scene>
      <Svg>
        <PairBase />
        <Gauge x={PX + 60} y={800} w={PW - 120} min={-16.1} max={16.1} step={4} value={AB} label="a·b = 8: a number, not an arrow" lc={INK} o={oG} />
        <GhostArrow x={1640} y={610} len={130} o={0.9 * oG} />
      </Svg>
      <PairChips />
      <Chip text="Try it" x={40} y={30} />
      <EqBox latex={EQ_K22_HL} x={PX - 20} y={150} w={PW + 20} size={44} number="K 2.2" />
      <TeX s={sumTex} x={PX} y={300} w={PW} size={46} align="center" o={oSum} />
      <Txt x={PX} y={385} w={PW} s={30} c={MUTED} o={oZ} align="center">
        {pair.terms.map((t) => t.toFixed(0)).join(" + ")} = {AB.toFixed(0)} · flat picture: the z-parts are 0
      </Txt>
      <GridNote />
      <Footnote items={[FN.K22]} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s06 definition 2 (0A.1)
const CosMini: React.FC<{ x: number; q: Pt; th: number; c: number; label: string }> = ({ x, q, th, c, label }) => {
  const U = 40, O: Pt = [x + 115, 470];
  const P = mkP(O[0], O[1], 1);
  return (
    <g>
      <Arrow p={O} q={[O[0] + 3 * U, O[1]]} color={TEAL} w={5} head={18} />
      <Arrow p={O} q={[O[0] + q[0] * U, O[1] - q[1] * U]} color={ORANGE} w={5} head={18} />
      {th > 0 ? <Arc P={P} a0={0} a1={th} r={th > 100 ? 22 : 30} /> : null}
      <Lbl x={x + 125} y={540} t={label} s={30} a="middle" />
      <Lbl x={x + 125} y={578} t={`= ${fx(c, 0)}`} s={30} a="middle" b />
    </g>
  );
};
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = 5;
  const t1 = SS(k, 1), t2 = SS(k, 2);
  const oA = ramp(f, 0, 14), oCos = ramp(f, t1, t1 + 14), oN = ramp(f, t2, t2 + 14);
  const P = P12, off = 0.45;
  const cr = pair.cos_reminder;
  return (
    <Scene>
      <Svg>
        <PairBase />
        <g opacity={oA}>
          <Arc P={P} a0={PHI_A} a1={PHI_B} r={0.8} />
          <Lbl x={P(0.95, 0.95)[0]} y={P(0.95, 0.95)[1]} t={`θ = ${TH.toFixed(1)}°`} s={32} />
          <Bracket p={P(nR_A[0] * off, nR_A[1] * off)} q={P(A[0] + nR_A[0] * off, A[1] + nR_A[1] * off)} off={0} c={TEAL} />
          <Lbl x={P(2.5 + nR_A[0] * 1.05, 0.5 + nR_A[1] * 1.05)[0]} y={P(2.5 + nR_A[0] * 1.05, 0.5 + nR_A[1] * 1.05)[1]}
            t={`|a| = ${NA.toFixed(3)}`} c={TEAL} s={32} a="middle" b />
          <Bracket p={P(nL_B[0] * off, nL_B[1] * off)} q={P(B[0] + nL_B[0] * off, B[1] + nL_B[1] * off)} off={0} c={ORANGE} />
          <Lbl x={P(B[0] * 0.5 + nL_B[0] * 0.8, B[1] * 0.5 + nL_B[1] * 0.8)[0]} y={P(B[0] * 0.5 + nL_B[0] * 0.8, B[1] * 0.5 + nL_B[1] * 0.8)[1]}
            t={`|b| = ${NB.toFixed(3)}`} c={ORANGE} s={32} a="end" b />
        </g>
        <g opacity={oCos}>
          <rect x={PX} y={380} width={PW} height={220} rx={14} fill={HOUSE.panel} />
          <Lbl x={PX + 20} y={405} t="what cos does" c={MUTED} s={28} />
          <CosMini x={PX + 20} q={cr["0"].q as Pt} th={cr["0"].theta_deg} c={cr["0"].cos} label="cos 0°" />
          <CosMini x={PX + 320} q={cr["90"].q as Pt} th={cr["90"].theta_deg} c={cr["90"].cos} label="cos 90°" />
          <CosMini x={PX + 620} q={cr["180"].q as Pt} th={cr["180"].theta_deg} c={cr["180"].cos} label="cos 180°" />
        </g>
        <Gauge x={PX + 60} y={890} w={PW - 120} min={-16.1} max={16.1} step={4} value={AB} label="" />
      </Svg>
      <Chip text="Definition 2 · lengths and the angle" x={40} y={30} />
      <EqBox latex={EQ_K22} x={PX - 20} y={130} w={PW + 20} h={90} size={34} number="K 2.2" />
      <EqBox latex={EQ_0A1_DIM} x={PX - 20} y={230} w={PW + 20} h={110} size={40} number="0A.1" o={oA} />
      <Txt x={PX + 20} y={630} w={PW - 40} s={34} o={oN}>
        = {NA.toFixed(3)} × {NB.toFixed(3)} × cos {TH.toFixed(1)}°<br />= {NA.toFixed(3)} × {NB.toFixed(3)} × {pair.cos_theta.toFixed(3)} = <b>{AB.toFixed(3)}</b>
      </Txt>
      <Txt x={PX + 20} y={740} w={PW - 40} s={32} c={HOUSE.accent} o={oN} bold>two recipes, one number</Txt>
      <GridNote />
      <Footnote items={[FN.K22, FN.A1]} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s07 how much two arrows point the same way
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = 6;
  const tA = [SS(k, 1), SS(k, 2), AT(k, 2, "backwards")];
  const U = 64, OY = 620;
  const caps = ["same way: positive", "across: zero", "opposite: negative"];
  const lines = ["3·2 + 0·0", "3·0 + 0·2", "3·(−2) + 0·0"];
  const p = same.p as Pt;
  return (
    <Scene o={ramp(f, 0, 10)}>
      <Svg>
        {[0, 1, 2].map((i) => {
          const o = ramp(f, tA[i], tA[i] + 14);
          const x0 = 40 + i * 620, P = mkP(x0 + 290, OY, U), O = P(0, 0);
          const q = same.q[i] as Pt, d = same.p_dot_q[i], nq = same.norm_q[i], sh = same.shadow_p_on_q[i];
          const qh: Pt = [q[0] / nq, q[1] / nq], kq: Pt = [-qh[1] * nq, qh[0] * nq];
          const foot: Pt = [sh * qh[0], sh * qh[1]];
          const rect: Pt[] = [O, P(...foot), P(foot[0] + kq[0], foot[1] + kq[1]), P(kq[0], kq[1])];
          return (
            <g key={i} opacity={o}>
              <Grid P={P} xr={[-4, 4]} yr={[-2, 3]} o={0.8} />
              {Math.abs(d) > 1e-9 ? <ProdRect pts={rect} neg={d < 0} id={`h7${i}`} /> : null}
              <Arrow p={O} q={P(...q)} color={ORANGE} />
              <Arrow p={O} q={P(...p)} color={TEAL} />
              <Lbl x={P(3.2, 0.35)[0]} y={P(3.2, 0.35)[1]} t="p" c={TEAL} s={38} b />
              <Lbl x={P(q[0] * 1.15 + (q[0] === 0 ? 0.35 : 0), q[1] * 1.15 + (q[1] === 0 ? 0.45 : 0))[0]}
                y={P(q[0] * 1.15 + (q[0] === 0 ? 0.35 : 0), q[1] * 1.15 + (q[1] === 0 ? 0.45 : 0))[1]} t="q" c={ORANGE} s={38} b a="middle" />
              <Lbl x={x0 + 290} y={190} t={`q = (${q.map((v) => fx(v, 0)).join(", ")}) · angle ${same.angle_deg[i].toFixed(0)}°`} s={30} a="middle" c={MUTED} />
              <Lbl x={x0 + 290} y={290} t={`${lines[i]} = ${fs(d, 0)}`} s={38} a="middle" b c={d < 0 ? ROSE : INK} />
              <Lbl x={x0 + 290} y={350} t={caps[i]} s={32} a="middle" c={d < 0 ? ROSE : HOUSE.accent} />
              <Gauge x={x0 + 60} y={900} w={460} min={-8} max={8} step={4} value={d} label="p·q" dec={0} />
            </g>
          );
        })}
      </Svg>
      <Chip text="a·b measures how much two arrows point the same way" x={40} y={30} size={34} />
      <Txt x={1300} y={40} w={580} s={28} c={MUTED} o={ramp(f, tA[0], tA[0] + 14)} align="right">p = (3, 0) in every panel · 1 square = 1 unit</Txt>
    </Scene>
  );
};

// ---------------------------------------------------------------- s08 the shadow, derived one move per step
const STRIP8 = [
  { tex: String.raw`\cos\theta = \dfrac{\text{side next to }\theta}{\text{long side}} = \dfrac{\text{shadow}}{|\mathbf a|}`, why: "right triangle: cosine = adjacent ÷ hypotenuse" },
  { tex: String.raw`\text{shadow} = |\mathbf a|\cos\theta`, why: "multiply both sides by |a|" },
  { tex: String.raw`\dfrac{\mathbf a\cdot\mathbf b}{|\mathbf b|} = \dfrac{|\mathbf a|\,|\mathbf b|\cos\theta}{|\mathbf b|}`, why: "divide both sides of (0A.1) by |b|" },
  { tex: String.raw`\dfrac{\mathbf a\cdot\mathbf b}{|\mathbf b|} = |\mathbf a|\cos\theta = \text{shadow}`, why: "|b| cancels on the right" },
  { tex: String.raw`8 \div 3.162 = 2.530`, why: "our numbers" },
  { tex: String.raw`\dfrac{\mathbf a\cdot\mathbf b}{|\mathbf b|} = \mathbf a\cdot\dfrac{\mathbf b}{|\mathbf b|} = \mathbf a\cdot\hat{\mathbf b}`, why: "dividing one arrow by a number divides the dot product by it; b̂ = b shrunk to length 1" },
  { tex: String.raw`\mathbf a\cdot\hat{\mathbf b} = 5 \times ${pair.b_hat[0].toFixed(3)} + 1 \times ${pair.b_hat[1].toFixed(3)} = ${pair.a_bhat_terms[0].toFixed(3)} + ${pair.a_bhat_terms[1].toFixed(3)} = ${pair.a_dot_bhat.toFixed(3)}\ \checkmark`, why: "check with definition 1" },
];
const STRIP8_L3_CANCEL = String.raw`\dfrac{\mathbf a\cdot\mathbf b}{|\mathbf b|} = \dfrac{|\mathbf a|\,${col(ROSE, String.raw`\cancel{|\mathbf b|}`)}\cos\theta}{${col(ROSE, String.raw`\cancel{|\mathbf b|}`)}}`;
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = 7;
  const t = [0, 1, 2, 3, 4, 5, 6, 7].map((j) => SS(k, j));
  const tCancel = AT(k, 4, "it cancels");
  const at = [t[2] + 20, t[3], t[4], tCancel + 10, t[5], t[6] + 20, t[7]];
  const t03 = Math.min(t[7] + 40, LEN(k) - 50);
  const P = P12, O = P(0, 0), aTip = P(...A), foot = P(...PAB);
  const drop = ramp(f, 6, 30), band = ramp(f, t[1], t[1] + 20), tri = ramp(f, t[2], t[2] + 15);
  const oBh = ramp(f, t[6], t[6] + 15);
  const cur = at.reduce((c, a, i) => (f >= a ? i : c), -1);
  const shLabel = f >= t[5] ? `shadow = ${SHAB.toFixed(3)}` : "shadow of a on b";
  return (
    <Scene>
      <Svg>
        <polygon points={[O, foot, aTip].map((p) => p.join(",")).join(" ")} fill={TEAL} fillOpacity={0.14 * tri} />
        <PairBase />
        <Band p={O} q={lerp(O, foot, band)} color={TEAL} o={band > 0 ? 1 : 0} />
        {drop > 0 ? <Dash p={aTip} q={lerp(aTip, foot, drop)} /> : null}
        {drop > 0.99 ? <RightTick at={foot} u1={unit(foot, O)} u2={unit(foot, aTip)} /> : null}
        <Lbl x={P(-0.25, 1.2)[0]} y={P(-0.25, 1.2)[1]} t={shLabel} c={TEAL} s={34} a="end" b o={band} />
        <g opacity={tri}>
          <Arc P={P} a0={PHI_A} a1={PHI_B} r={0.7} />
          <Lbl x={P(0.85, 0.75)[0]} y={P(0.85, 0.75)[1]} t="θ" s={34} />
          <Lbl x={P(-0.25, 1.2)[0]} y={P(-0.25, 1.2)[1] + 42} t="= side next to θ" c={TEAL} s={30} a="end" />
          <Lbl x={P(3.2, 0.25)[0]} y={P(3.2, 0.25)[1] + 46} t={`long side = |a| = ${NA.toFixed(3)}`} c={TEAL} s={30} a="middle" />
        </g>
        <g opacity={oBh}>
          <Arrow p={O} q={P(...BH)} color={ORANGE} w={8} head={20} halo />
          <Lbl x={P(0.4, 1.0)[0] + 6} y={P(0.4, 1.0)[1]} t="b̂" c={ORANGE} s={38} b />
          <Lbl x={110} y={915} t={`b̂ = b ÷ |b| = (${BH[0].toFixed(3)}, ${BH[1].toFixed(3)}), length 1 · “b hat”`} c={ORANGE} s={30} />
        </g>
      </Svg>
      <Chip text="The shadow, step by step" x={40} y={30} />
      <EqBox latex={EQ_0A1} x={930} y={20} w={960} h={90} size={34} number="0A.1" />
      {STRIP8.map((l, i) => {
        const o = ramp(f, at[i], at[i] + 12) * (cur > i ? 0.55 : 1);
        const texS = i === 2 && f >= tCancel ? STRIP8_L3_CANCEL : l.tex;
        const TW = [520, 330, 380, 450, 330, 400, 0][i];
        return o > 0 ? (
          <div key={i} style={{ position: "absolute", left: 930, top: 118 + i * 103, width: 960, height: 100, opacity: o,
            display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ ...FONT, fontSize: 28, color: MUTED, width: 26, flex: "0 0 auto" }}>{i + 1}</div>
            {i === 6 ? (
              <div>
                <div style={{ fontSize: 29, color: INK }} dangerouslySetInnerHTML={{ __html: tex(texS, false) }} />
                <div style={{ ...FONT, fontSize: 28, color: MUTED }}>{l.why}</div>
              </div>
            ) : (<>
              <div style={{ width: TW, flex: "0 0 auto", fontSize: 30, color: INK }} dangerouslySetInnerHTML={{ __html: tex(texS, false) }} />
              <div style={{ ...FONT, fontSize: 28, color: MUTED, lineHeight: 1.08, width: 960 - 26 - 32 - TW }}>{l.why}</div>
            </>)}
          </div>
        ) : null;
      })}
      <EqBox latex={EQ_0A3} x={930} y={845} w={960} h={130} size={36} number="0A.3" o={ramp(f, t03, t03 + 12)} />
      <Footnote items={f >= t03 ? [FN.A1, FN.A3] : [FN.A1]} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s09 the question
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = 8;
  const t1 = SS(k, 1);
  const grow = ramp(f, 10, 45), oQ = ramp(f, t1, t1 + 12);
  const P = P12, O = P(0, 0), foot = P(...PAB);
  const kb = pair.k_cross_b as Pt;
  const rect: Pt[] = [O, foot, P(PAB[0] + kb[0] * grow, PAB[1] + kb[1] * grow), P(kb[0] * grow, kb[1] * grow)];
  const off = 0.35;
  return (
    <Scene>
      <Svg>
        <PairBase />
        {grow > 0 ? <ProdRect pts={rect} neg={false} id="h9" /> : null}
        <Band p={O} q={foot} color={TEAL} />
        <Bracket p={P(-nL_B[0] * off, -nL_B[1] * off)} q={P(B[0] - nL_B[0] * off, B[1] - nL_B[1] * off)} off={0} c={ORANGE} />
        <Lbl x={P(1.15, 1.05)[0]} y={P(1.15, 1.05)[1]} t="|b|" c={ORANGE} s={34} b />
        <Lbl x={P(-1.1, 1.7)[0]} y={P(-1.1, 1.7)[1]} t="area = a·b" s={32} a="middle" b o={grow} />
        <Lbl x={P(0.5, 0.5)[0] + 30} y={P(0.5, 0.5)[1] + 20} t="shadow" c={TEAL} s={30} />
      </Svg>
      <div style={{ position: "absolute", left: 40, top: 30, ...FONT, background: "rgba(24,32,50,0.95)", borderRadius: 12,
        border: `2px solid ${HOUSE.accent}`, padding: "12px 24px", lineHeight: 1.35 }}>
        <div style={{ fontSize: 44, fontWeight: 600 }}>a·b = (<span style={{ color: TEAL }}>shadow of a on b</span>){" "}
          <span style={{ border: `3px solid ${ORANGE}`, borderRadius: 8, padding: "0 8px", color: ORANGE }}>× |b|</span></div>
        <div style={{ fontSize: 38, opacity: oQ, color: HOUSE.accent }}>Why multiply by |b|? Why not stop at the shadow?</div>
      </div>
      <EqBox latex={EQ_0A1_BOX} x={PX - 20} y={190} w={PW + 20} h={120} size={42} number="0A.1" />
      <Txt x={PX + 20} y={350} w={PW - 40} s={32} c={TEAL}>shadow = |a| cos θ = {SHAB.toFixed(3)}</Txt>
      <Txt x={PX + 20} y={400} w={PW - 40} s={32} c={ORANGE}>|b| = {NB.toFixed(3)}</Txt>
      <Txt x={PX + 20} y={470} w={PW - 40} s={36} o={grow} bold>area = {SHAB.toFixed(3)} × {NB.toFixed(3)} = {pair.area_on_b.toFixed(3)} = a·b</Txt>
      <GridNote />
      <Footnote items={[FN.A1]} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s10 reason 1: order
const U3 = 80;
const PL = mkP(400, 560, U3), PR = mkP(1240, 500, U3);
type Pose = { c: Pt; phi: number; w: number; h: number; side: number };
const rectPts = (p: Pose): Pt[] => {
  const t = (p.phi * Math.PI) / 180, bx = Math.cos(t), by = -Math.sin(t);
  const kx = -Math.sin(t) * p.side, ky = -Math.cos(t) * p.side;
  const c = p.c, b: Pt = [c[0] + bx * p.w, c[1] + by * p.w];
  return [c, b, [b[0] + kx * p.h, b[1] + ky * p.h], [c[0] + kx * p.h, c[1] + ky * p.h]];
};
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = 9;
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3);
  const o0 = ramp(f, 0, 12);
  const dL = ramp(f, t1, t1 + 15), sL = ramp(f, t1 + 15, t1 + 35);
  const dR = ramp(f, t2, t2 + 15), sR = ramp(f, t2 + 15, t2 + 35), oCmp = ramp(f, t2 + 40, t2 + 52) * (1 - ramp(f, t3 + 18, t3 + 28));
  const grow = ramp(f, t3, t3 + 15);
  const tray = ramp(f, t3 + 20, t3 + 45);
  const copies = 1 - ramp(f, t3 + 18, t3 + 32);
  const oTray = ramp(f, t3 + 22, t3 + 36), oRead = ramp(f, t3 + 40, t3 + 50), oCap = ramp(f, t3 + 46, t3 + 56);
  const poseL: Pose = { c: PL(0, 0), phi: PHI_B, w: SHAB * U3, h: NB * U3 * grow, side: 1 };
  const poseR: Pose = { c: PR(0, 0), phi: PHI_A, w: SHBA * U3, h: NA * U3 * grow, side: -1 };
  const trayL: Pose = { c: [720, 780], phi: 0, w: SHAB * U3, h: NB * U3, side: 1 };
  const trayR: Pose = { c: [1200, 780], phi: 180, w: SHBA * U3, h: NA * U3, side: -1 };
  const mix = (p: Pose, q: Pose, t: number): Pose => ({ c: lerp(p.c, q.c, t), phi: p.phi + (q.phi - p.phi) * t,
    w: p.w + (q.w - p.w) * t, h: p.h + (q.h - p.h) * t, side: p.side });
  const rL = rectPts(mix(poseL, trayL, tray)), rR = rectPts(mix(poseR, trayR, tray));
  const Copy: React.FC<{ P: (x: number, y: number) => Pt; caster: "a" | "b" }> = ({ P, caster }) => {
    const O = P(0, 0);
    const casterV = caster === "a" ? A : B, ontoV = caster === "a" ? B : A;
    const proj = caster === "a" ? PAB : PBA;
    const d = caster === "a" ? dL : dR, s = caster === "a" ? sL : sR;
    const cTip = P(...casterV), foot = P(...proj);
    const cc = caster === "a" ? TEAL : ORANGE;
    return (
      <g>
        <Grid P={P} xr={caster === "a" ? [-3, 5] : [-1, 6]} yr={caster === "a" ? [-1, 4] : [-5, 4]} o={0.8} />
        <Dash p={P(-ontoV[0] * 0.3, -ontoV[1] * 0.3)} q={P(ontoV[0] * 1.3, ontoV[1] * 1.3)} c={caster === "a" ? ORANGE : TEAL} o={0.35} w={2} />
        <Band p={O} q={lerp(O, foot, s)} color={cc} o={s > 0 ? 1 : 0} />
        <Arrow p={O} q={P(...B)} color={ORANGE} />
        <Arrow p={O} q={P(...A)} color={TEAL} />
        {d > 0 ? <Dash p={cTip} q={lerp(cTip, foot, d)} /> : null}
        {s > 0.99 ? <RightTick at={foot} u1={unit(foot, O)} u2={unit(foot, cTip)} /> : null}
        <Lbl x={P(5.2, 1)[0]} y={P(5.2, 1)[1] - 6} t="a" c={TEAL} s={40} b />
        <Lbl x={P(1.1, 3.2)[0]} y={P(1.1, 3.2)[1]} t="b" c={ORANGE} s={40} b />
        <Lbl x={O[0] - 14} y={O[1] + 24} t="O" c={MUTED} s={28} a="end" />
      </g>
    );
  };
  return (
    <Scene>
      <Svg>
        <g opacity={o0 * copies}>
          <Copy P={PL} caster="a" />
          <Copy P={PR} caster="b" />
          <line x1={960} y1={130} x2={960} y2={960} stroke={HOUSE.grid} strokeWidth={3} />
          <Lbl x={120} y={660} t={`shadow of a on b = ${SHAB.toFixed(3)}`} c={TEAL} s={32} o={sL} b />
          <Lbl x={1400} y={250} t={`shadow of b on a = ${SHBA.toFixed(3)}`} c={ORANGE} s={32} o={sR} b />
          {grow > 0 ? (
            <g>
              <Bracket p={rL[1]} q={rL[2]} off={16} c={ORANGE} label={`|b| = ${NB.toFixed(3)}`} lo={44} s={28} a="end" o={grow} />
              <Lbl x={130} y={710} t={`${SHAB.toFixed(3)} × ${NB.toFixed(3)} = ${pair.area_on_b.toFixed(3)}`} s={34} o={grow} b />
              <Bracket p={rR[1]} q={rR[2]} off={-16} c={TEAL} label={`|a| = ${NA.toFixed(3)}`} lo={22} s={28} a="start" o={grow} />
              <Lbl x={1400} y={300} t={`${SHBA.toFixed(3)} × ${NA.toFixed(3)} = ${pair.area_on_a.toFixed(3)}`} s={34} o={grow} b />
            </g>
          ) : null}
        </g>
        <g opacity={oCmp}>
          <Lbl x={120} y={790} t="same pair, two different shadows" c={MUTED} s={30} />
          <line x1={120} y1={850} x2={120 + SHAB * U3} y2={850} stroke={TEAL} strokeWidth={16} strokeOpacity={0.8} />
          <Lbl x={140 + SHAB * U3} y={850} t={`${SHAB.toFixed(3)}  (a on b)`} c={TEAL} s={30} />
          <line x1={120} y1={910} x2={120 + SHBA * U3} y2={910} stroke={ORANGE} strokeWidth={16} strokeOpacity={0.8} />
          <Lbl x={140 + SHBA * U3} y={910} t={`${SHBA.toFixed(3)}  (b on a)`} c={ORANGE} s={30} />
        </g>
        <g opacity={oTray}>
          {Array.from({ length: 9 }, (_, i) => <line key={`tx${i}`} x1={640 + i * 80} y1={300} x2={640 + i * 80} y2={780} stroke={HOUSE.grid} strokeWidth={1.5} />)}
          {Array.from({ length: 7 }, (_, i) => <line key={`ty${i}`} x1={640} y1={300 + i * 80} x2={1280} y2={300 + i * 80} stroke={HOUSE.grid} strokeWidth={1.5} />)}
          <line x1={620} y1={780} x2={1300} y2={780} stroke={MUTED} strokeWidth={3} />
          <Lbl x={1300} y={330} t="1 square = 1 unit²" c={MUTED} s={28} />
        </g>
        {grow > 0 ? <ProdRect pts={rL} neg={false} id="h10l" /> : null}
        {grow > 0 ? <ProdRect pts={rR} neg={false} id="h10r" /> : null}
        <g opacity={oRead}>
          <Lbl x={821} y={812} t={`${SHAB.toFixed(3)} × ${NB.toFixed(3)}`} c={INK} s={30} a="middle" />
          <Lbl x={1137} y={812} t={`${SHBA.toFixed(3)} × ${NA.toFixed(3)}`} c={INK} s={30} a="middle" />
          <Lbl x={960} y={880} t={`area = a·b = ${AB.toFixed(3)}  (both)`} c={INK} s={40} a="middle" b />
        </g>
      </Svg>
      <Chip text="Reason 1 · order: the same number both ways" x={40} y={30} o={o0} />
      <EqBox latex={EQ_SYM} x={80} y={120} w={1800} size={42} number="0A.1, both ways" o={oTray} nw={290} />
      <Txt x={0} y={228} w={1920} s={38} align="center" c={HOUSE.accent} o={oCap} bold>a·b = b·a: order doesn’t matter</Txt>
      <Footnote items={[FN.A1, FN.sym]} o={oTray} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s11 reason 2: cheap; with a unit arrow it IS the shadow
const Card: React.FC<{ x: number; y: number; w: number; title: string; tc: string; lines: React.ReactNode[]; foot: string; o?: number }> = ({
  x, y, w, title, tc, lines, foot, o = 1,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 300, background: HOUSE.panel, borderRadius: 14,
    border: `2px solid ${tc}`, padding: "12px 22px", boxSizing: "border-box", ...FONT, opacity: o }}>
    <div style={{ fontSize: 36, fontWeight: 700, color: tc }}>{title}</div>
    {lines.map((l, i) => <div key={i} style={{ fontSize: 32, marginTop: 4 }}>{l}</div>)}
    <div style={{ fontSize: 28, color: MUTED, marginTop: 8, lineHeight: 1.15 }}>{foot}</div>
  </div>
);
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = 10;
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3);
  const o0 = ramp(f, 0, 12), oArr = ramp(f, t1, t1 + 12), oEq = ramp(f, t1 + 15, t1 + 27);
  const n = cheap.scales.length - 1;
  const kk = Math.round(clamp((f - t2 - 6) / 45, 0, 1) * n);
  const shrunk = kk === n;
  const bk = cheap.b_series[kk] as Pt, dk = cheap.dot_series[kk], lk = cheap.len_series[kk];
  const oCap = ramp(f, t2 + 55, t2 + 67);
  const wind = ramp(f, t3, t3 + 15);
  const oChip2 = ramp(f, t3 + 45, t3 + 57);
  const P = P12, O = P(0, 0), foot = P(...PAB), aTip = P(...A);
  const gl = kk === 0 ? `a·b = ${dk.toFixed(3)}` : shrunk ? `a·b̂ = ${dk.toFixed(3)} = the shadow` : `a·(shrinking b) = ${dk.toFixed(3)}`;
  const PWm = mkP(250, 860, 60);
  const v = cheap.v as Pt, Ow = PWm(0, 0), vT = PWm(...v), vx = PWm(cheap.v_dot_xhat, 0);
  const X = 1010, W = 870;
  return (
    <Scene>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - wind }}>
        <Svg>
          <Grid P={P} xr={[-3, 5]} yr={[-1, 5]} />
          <Dash p={P(-0.33, -1)} q={P(1.6, 4.8)} c={ORANGE} o={0.4} w={2} />
          <Band p={O} q={foot} color={TEAL} />
          <Arrow p={O} q={P(...bk)} color={ORANGE} />
          <Arrow p={O} q={aTip} color={TEAL} />
          <Dash p={aTip} q={foot} />
          <RightTick at={foot} u1={unit(foot, O)} u2={unit(foot, aTip)} />
          <Lbl x={P(5.2, 1)[0]} y={P(5.2, 1)[1]} t="a" c={TEAL} s={44} b />
          <Lbl x={P(bk[0] + 0.25, bk[1])[0]} y={P(bk[0] + 0.25, bk[1])[1]} t={shrunk ? "b̂, length 1" : kk > 0 ? `length ${lk.toFixed(3)}` : "b"}
            c={ORANGE} s={shrunk || kk > 0 ? 34 : 44} b />
          <Lbl x={P(-0.25, 1.2)[0]} y={P(-0.25, 1.2)[1]} t={`shadow = ${cheap.shadow_series[kk].toFixed(3)}`} c={TEAL} s={34} a="end" b />
          {kk > 0 ? <Lbl x={P(-0.25, 1.2)[0]} y={P(-0.25, 1.2)[1] + 42} t="(does not change)" c={TEAL} s={30} a="end" /> : null}
          <Lbl x={O[0] - 18} y={O[1] + 26} t="O" c={MUTED} s={30} a="end" />
          <g opacity={oArr}>
            <path d="M 1215 405 Q 1440 470 1650 410" fill="none" stroke={HOUSE.accent} strokeWidth={4} />
            <polygon points="1665,402 1640,400 1650,422" fill={HOUSE.accent} />
          </g>
          <Gauge x={X + 40} y={790} w={W - 80} min={-16.1} max={16.1} step={4} value={dk} label={gl} lc={INK} readout={fs(dk)} />
        </Svg>
        <Card x={X} y={95} w={400} title="a·b" tc={TEAL} o={o0}
          lines={["5 × 1 = 5", "1 × 3 = 3", `5 + 3 = ${cheap.a_dot_b.toFixed(0)}  ✓`]} foot="2 multiplications, 1 addition; no angle" />
        <Card x={X + 450} y={95} w={420} title="shadow" tc={TEAL} o={o0}
          lines={["|b| = √(1² + 3²) = √10", `= ${cheap.norm_b.toFixed(3)}`, `${cheap.a_dot_b.toFixed(0)} ÷ ${cheap.norm_b.toFixed(3)} = ${cheap.shadow.toFixed(3)}`]}
          foot="needs a·b first, then 1 square root and 1 division" />
        <Txt x={X} y={445} w={W} s={32} align="center" c={HOUSE.accent} o={oArr} bold>shadow = a·b ÷ |b|  (one division)</Txt>
        <EqBox latex={EQ_0A3} x={X - 40} y={492} w={W + 50} h={115} size={32} number="0A.3" o={oEq} />
        <Txt x={X} y={606} w={W} s={32} align="center" o={oEq}>{cheap.a_dot_b.toFixed(0)} ÷ {cheap.norm_b.toFixed(3)} = {cheap.shadow.toFixed(3)}</Txt>
        <Txt x={X - 40} y={850} w={W + 50} s={32} align="center" c={ORANGE} o={oCap}>
          if |b| = 1, then a·b ÷ |b| = a·b ÷ 1 = a·b,<br /><b>so the dot product equals the shadow: a·b̂ = {cheap.shadow.toFixed(3)}</b>
        </Txt>
        <Chip text="Reason 2 · cheap: no angle, no square root" x={40} y={30} o={o0} />
        <GridNote y={945} />
      </div>
      {wind > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: wind }}>
          <Svg>
            <Grid P={PWm} xr={[-2, 9]} yr={[-1, 10]} />
            <Band p={Ow} q={vx} color={TEAL} />
            <Arrow p={Ow} q={PWm(1, 0)} color={ORANGE} w={7} head={22} />
            <Arrow p={Ow} q={vT} color={TEAL} />
            <Dash p={vT} q={vx} />
            <RightTick at={vx} u1={unit(vx, Ow)} u2={unit(vx, vT)} />
            <Lbl x={PWm(9, -0.1)[0]} y={PWm(9, -0.1)[1] - 26} t="east →" c={MUTED} s={30} a="end" />
            <Lbl x={PWm(-0.25, 9.6)[0]} y={PWm(-0.25, 9.6)[1]} t="north ↑" c={MUTED} s={30} a="end" />
            <Lbl x={600} y={470} a="start" t={`wind v = (6, 8) m/s, |v| = ${cheap.norm_v.toFixed(1)} m/s`} c={TEAL} s={32} b />
            <Lbl x={PWm(0.3, -0.75)[0]} y={PWm(0.3, -0.75)[1]} t="x̂: east, length 1" c={ORANGE} s={30} />
          </Svg>
          <Chip text="Reason 2 · with a unit arrow, the dot product IS the shadow" x={40} y={30} w={1100} size={30} />
          <Txt x={1000} y={300} w={860} s={44} bold c={TEAL}>v·x̂ = 6 × 1 + 8 × 0 = {cheap.v_dot_xhat.toFixed(2)} m/s</Txt>
          <Txt x={1000} y={366} w={860} s={36}>= the eastward part of the wind</Txt>
          <Chip x={1000} y={560} w={860} size={30} color={MUTED} o={oChip2}
            text="Vallis calls the wind v (bold); its eastward part is written u" />
          <Badge detail="wind arrow: 1 grid square = 1 m/s on its own small map (arrow length is not a distance)" corner="tr" />
        </div>
      ) : null}
      <Footnote items={[FN.A3]} o={oEq * (1 - wind)} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s12 reason 3a: work
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = 11;
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), tD = AT(k, 3, "twice as far");
  const o0 = ramp(f, 0, 12), oF = ramp(f, t1, t1 + 15), oSh = ramp(f, t2, t2 + 20), oW = ramp(f, t3, t3 + 20);
  const nd = work.d_m.length - 1;
  const kd = Math.round(clamp((f - tD) / 40, 0, 1) * nd);
  const dm = work.d_m[kd], W = work.W_J[kd];
  const oChip = ramp(f, tD + 30, tD + 42);
  const GY = 470, X0 = 330, FSC = 14, DSC = 40;
  const Fv = work.F as Pt;
  const Ft: Pt = [X0 + Fv[0] * FSC, GY - Fv[1] * FSC];
  const sh: Pt = [X0 + work.shadow_N * FSC, GY];
  const dT: Pt = [X0 + dm * DSC, GY];
  const rect: Pt[] = [[X0, GY], sh, [sh[0], GY + dm * DSC * oW], [X0, GY + dm * DSC * oW]];
  const dl = dm.toFixed(dm % 1 ? 1 : 0);
  return (
    <Scene o={o0}>
      <Svg>
        <line x1={60} y1={GY} x2={1040} y2={GY} stroke="#6b7690" strokeWidth={4} />
        {Array.from({ length: 24 }, (_, i) => <line key={i} x1={70 + i * 40} y1={GY + 4} x2={50 + i * 40} y2={GY + 24} stroke="#3c4660" strokeWidth={2} />)}
        <rect x={130} y={GY - 62} width={190} height={40} rx={8} fill="#3a4766" stroke="#9aa6bd" strokeWidth={3} />
        <path d={`M 120 ${GY - 6} L 330 ${GY - 6} Q 350 ${GY - 6} 345 ${GY - 30}`} fill="none" stroke="#c9d2e3" strokeWidth={5} />
        <line x1={160} y1={GY - 22} x2={160} y2={GY - 6} stroke="#c9d2e3" strokeWidth={4} />
        <line x1={290} y1={GY - 22} x2={290} y2={GY - 6} stroke="#c9d2e3" strokeWidth={4} />
        <Lbl x={225} y={GY - 95} t="sled" c={MUTED} s={30} a="middle" />
        {oW > 0 ? <ProdRect pts={rect} neg={false} o={oW} id="h12" /> : null}
        <Band p={[X0, GY]} q={lerp([X0, GY], sh, oSh)} color={TEAL} o={oSh > 0 ? 1 : 0} />
        <Arrow p={[X0, GY]} q={dT} color={ORANGE} />
        <Arrow p={[X0, GY]} q={Ft} color={TEAL} o={oF} />
        <g opacity={oF}>
          <Arc P={mkP(X0, GY, 1)} a0={0} a1={work.F_deg} r={70} />
          <Lbl x={X0 + 82} y={GY - 32} t={`${work.F_deg.toFixed(0)}°`} s={30} />
          <Lbl x={Ft[0] + 16} y={Ft[1] - 10} t={`F = ${work.F_N.toFixed(0)} N`} c={TEAL} s={34} b />
        </g>
        <Lbl x={dT[0] + 14} y={GY - 26} t={`d = ${dl} m`} c={ORANGE} s={34} b />
        <g opacity={oSh}>
          <Dash p={Ft} q={sh} />
          <RightTick at={sh} u1={[-1, 0]} u2={[0, -1]} />
          <Lbl x={X0 + 10} y={GY + 30} t="shadow" c={TEAL} s={28} o={1 - oW} />
        </g>
        {oW > 0 ? (
          <g opacity={oW}>
            <Bracket p={[sh[0], GY]} q={[sh[0], GY + dm * DSC]} off={-18} c={ORANGE} label={`|d| = ${dl} m`} lo={18} s={30} a="start" />
            <Lbl x={X0 + 70} y={GY + 30} t={`${work.shadow_N.toFixed(1)} N`} c={TEAL} s={28} a="middle" />
            <Lbl x={sh[0] + 30} y={GY + dm * DSC * 0.5 + 50} t={`area = ${work.shadow_N.toFixed(1)} N × ${dl} m = ${W.toFixed(1)} J`} s={32} b />
          </g>
        ) : null}
        <Gauge x={1160} y={760} w={680} min={0} max={120} step={20} value={W} label="work W (J)" readout={`${W.toFixed(1)} J`} o={oW} dec={1} />
      </Svg>
      <Chip text="Reason 3 · physics needs both sizes — (a) work" x={40} y={30} />
      <EqBox latex={EQ_W} x={1100} y={190} w={780} size={44} />
      <Txt x={1130} y={300} w={760} s={30} c={MUTED}>work: a definition from school mechanics (no book number)</Txt>
      <Txt x={1130} y={380} w={760} s={32} c={TEAL} o={oSh}>shadow = 20 cos 60° = {work.shadow_N.toFixed(1)} N<br /><span style={{ fontSize: 30 }}>(still a force)</span></Txt>
      <Txt x={1130} y={500} w={760} s={34} o={oW} bold>W = F·d = {work.shadow_N.toFixed(1)} N × {dl} m = {W.toFixed(1)} J</Txt>
      <Chip text={`twice as far: shadow still ${work.shadow_N_d10.toFixed(1)} N · double either arrow → the product doubles`} x={1130} y={850} color={ORANGE} o={oChip} w={760} size={30} />
      <Badge detail="force (N) and distance (m) drawn on different scales · sled icon illustrative" corner="tr" />
      <Footnote items={[FN.work]} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s13 Vallis (1.7) first
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = 12;
  const t1 = SS(k, 1), t2 = SS(k, 2), t2b = AT(k, 2, "here, temperature"), t3 = SS(k, 3);
  const oEq = ramp(f, t1, t1 + 14), oPhi = ramp(f, t2, t2 + 12), oT = ramp(f, t2b, t2b + 14), oV = ramp(f, t3, t3 + 12);
  const eq = f >= t3 ? EQ_17_V : f >= t2 ? EQ_17_PHI : EQ_17;
  const oTitle = ramp(f, 0, 12) * (1 - ramp(f, t1 - 10, t1 + 4)); // part title while "Now the weather." is spoken
  return (
    <Scene>
      <Chip text="Reason 3 · (b) the weather" x={40} y={30} size={40} />
      <Txt x={0} y={430} w={1920} s={84} o={oTitle} align="center"><b>Part 3 · the weather</b></Txt>
      <Txt x={0} y={560} w={1920} s={40} c={TEAL} o={oTitle} align="center">the same dot product, inside the equation for how temperature changes</Txt>
      <EqBox latex={eq} x={260} y={110} w={1400} h={190} size={64} number="Vallis 1.7" o={oEq} nw={230} />
      <Txt x={0} y={330} w={1920} s={36} c={GOLD} o={oPhi} align="center">φ = any quantity the air carries (temperature, moisture, …)</Txt>
      <Txt x={0} y={385} w={1920} s={36} o={oT} align="center">here <b style={{ color: GOLD }}>φ = T</b>, the temperature:</Txt>
      <EqBox latex={EQ_17T} x={410} y={440} w={1100} h={150} size={54} o={oT} />
      <Txt x={0} y={640} w={1920} s={36} c={TEAL} o={oV} align="center"><b>v</b> = the velocity of the air: the wind (Vallis’s letter, bold v)</Txt>
      <Svg>
        <g opacity={oV}>
          <Arrow p={[880, 820]} q={[1040, 740]} color={TEAL} w={8} />
          <Lbl x={1056} y={736} t="v" c={TEAL} s={48} b />
        </g>
      </Svg>
      <Footnote items={[FN.V17]} o={oEq} />
    </Scene>
  );
};

// ---------------------------------------------------------------- weather maps (s14-s20)
type Geo = { mx: number; my: number; km: number; x0: number; y0: number; w: number; h: number };
const GW: Geo = { mx: 110, my: 180, km: 1.3, x0: 0, y0: 0, w: 600, h: 360 };
const GSM: Geo = { mx: 110, my: 400, km: 1.3, x0: 0, y0: 0, w: 600, h: 360 };
const GZ: Geo = { mx: 110, my: 200, km: 3.875, x0: 180, y0: 105, w: 240, h: 150 };
const gX = (g: Geo, xk: number) => g.mx + (xk - g.x0) * g.km;
const gY = (g: Geo, yk: number) => g.my + (g.h - (yk - g.y0)) * g.km;
const LUT = wx.lut_thermal as string[];
const [T_LO, T_HI] = wx.lut_range_C as [number, number];
const tColor = (T: number) => LUT[Math.round(clamp((T - T_LO) / (T_HI - T_LO), 0, 1) * (LUT.length - 1))];
const VV = wx.v as Pt;
const VANG = (wx.angle_deg * Math.PI) / 180;
const vScr = (us: number): Pt => [wx.speed * us * Math.cos(VANG), -wx.speed * us * Math.sin(VANG)];
const PIN = wx.pin_km as Pt;

/** T(x, t) = T_west + G (x − shift): G and shift from the data file (shift_km = v·x̂ t). Drawn as strips. */
const TMap: React.FC<{ g: Geo; G: number; shiftKm: number; o?: number; tWest?: number; isoStep?: number }> = ({ g, G, shiftKm, o = 1, tWest = wx.T_west }) => {
  const strips = [], n = 120, dx = g.w / n;
  for (let i = 0; i < n; i++) {
    const xk = g.x0 + (i + 0.5) * dx;
    strips.push(<rect key={i} x={gX(g, g.x0 + i * dx)} y={g.my} width={dx * g.km + 0.6} height={g.h * g.km} fill={tColor(tWest + G * (xk - shiftKm) * 1000)} />);
  }
  const iso = [];
  for (let T = 0; T <= 22; T++) {
    const xk = (T - tWest) / G / 1000 + shiftKm;
    if (xk < g.x0 + 2 || xk > g.x0 + g.w - 2) continue;
    const px = gX(g, xk);
    iso.push(<g key={T}><line x1={px} y1={g.my} x2={px} y2={g.my + g.h * g.km} stroke="#ffffff" strokeOpacity={0.45} strokeWidth={2} />
      <Lbl x={px} y={g.my - 22} t={`${T}°`} c={INK} s={28} a="middle" /></g>);
  }
  return <g opacity={o}>{strips}{iso}</g>;
};
const MapFrame: React.FC<{ g: Geo; dx?: number; dy?: number }> = ({ g, dx = 100, dy = 100 }) => {
  const ticks = [];
  for (let x = Math.ceil(g.x0 / dx) * dx; x <= g.x0 + g.w + 1e-6; x += dx)
    ticks.push(<Lbl key={`e${x}`} x={gX(g, x)} y={g.my + g.h * g.km + 26} t={`${x}`} c={MUTED} s={28} a="middle" />);
  for (let y = Math.ceil(g.y0 / dy) * dy; y <= g.y0 + g.h + 1e-6; y += dy)
    ticks.push(<Lbl key={`n${y}`} x={g.mx - 10} y={gY(g, y)} t={`${y}`} c={MUTED} s={28} a="end" />);
  return (
    <g>
      <rect x={g.mx} y={g.my} width={g.w * g.km} height={g.h * g.km} fill="none" stroke={HOUSE.grid} strokeWidth={3} />
      {ticks}
      <Lbl x={g.mx + g.w * g.km} y={g.my + g.h * g.km + 62} t="east (km) →" c={MUTED} s={28} a="end" />
      <g transform={`translate(28 ${g.my + (g.h * g.km) / 2}) rotate(-90)`}><Lbl x={0} y={0} t="north (km) →" c={MUTED} s={28} a="middle" /></g>
    </g>
  );
};
const ColourBar: React.FC<{ g: Geo }> = ({ g }) => {
  const W = g.w * g.km - 130, y = g.my + g.h * g.km + 80;
  return (
    <g>
      {LUT.map((c, i) => <rect key={i} x={g.mx + (i * W) / LUT.length} y={y} width={W / LUT.length + 0.6} height={26} fill={c} />)}
      {[4, 8, 12, 16, 20].map((T) => <Lbl key={T} x={g.mx + ((T - T_LO) / (T_HI - T_LO)) * W} y={y + 48} t={`${T}`} c={MUTED} s={28} a="middle" />)}
      <Lbl x={g.mx + W + 22} y={y + 13} t="T (°C)" c={INK} s={28} />
    </g>
  );
};
const ClipMap: React.FC<{ g: Geo; id: string; children: React.ReactNode }> = ({ g, id, children }) => (
  <>
    <defs><clipPath id={id}><rect x={g.mx} y={g.my} width={g.w * g.km} height={g.h * g.km} /></clipPath></defs>
    <g clipPath={`url(#${id})`}>{children}</g>
  </>
);
const RX = 1110, RW = 780;
const US = 18; // px per (m/s) for the wind arrow (not the map's km scale)
const GL = 150; // ∇T arrow px (not to the km scale)

// ---------------------------------------------------------------- s14 two thermometers
const TERMS14 = [
  { tex: String.raw`\frac{DT}{Dt}`, x: 250, c: INK, label: "balloon’s change" },
  { tex: "=", x: 405, c: INK },
  { tex: String.raw`\frac{\partial T}{\partial t}`, x: 560, c: SLATE, label: "pole’s change" },
  { tex: "+", x: 715, c: INK },
  { tex: String.raw`\mathbf v\cdot\nabla T`, x: 900, c: TEAL, label: "change from crossing the slope" },
];
// the T-form shown term by term is exactly EQ_TFORM (kept whole above for the equation check)
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = 13;
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), tAdv = AT(k, 4, "called advection");
  const oPole = ramp(f, t1, t1 + 14), oBal = ramp(f, t2, t2 + 14), oAdv = ramp(f, t3, t3 + 14), oAn = ramp(f, t4, t4 + 14);
  const oAdvW = ramp(f, tAdv, tAdv + 12);
  const g = GSM;
  // balloon: x(t) = x_pin + v t from the data (1 min per sample), ×1200 → 1 sample per 1.5 frames
  const nb = wx.balloon_x_km.length - 1;
  const ib = clamp((f - t2) / 1.5, 0, nb);
  const i0 = Math.floor(ib), i1 = Math.min(nb, i0 + 1), w = ib - i0;
  const bxk = wx.balloon_x_km[i0] + (wx.balloon_x_km[i1] - wx.balloon_x_km[i0]) * w;
  const byk = wx.balloon_y_km[i0] + (wx.balloon_y_km[i1] - wx.balloon_y_km[i0]) * w;
  const hours = (wx.balloon_t_s[i0] + (wx.balloon_t_s[i1] - wx.balloon_t_s[i0]) * w) / 3600;
  const pin: Pt = [gX(g, PIN[0]), gY(g, PIN[1])], bal: Pt = [gX(g, bxk), gY(g, byk)];
  const vs = vScr(10);
  const box = (on: number, c: string): React.CSSProperties => ({ border: `3px solid ${on > 0 ? c : "transparent"}`, borderRadius: 10, padding: "0 8px" });
  const leadO = 1 - oAn;
  return (
    <Scene>
      <Svg>
        <TMap g={g} G={wx.gradT[0]} shiftKm={0} />
        <MapFrame g={g} />
        {/* path so far */}
        <line x1={pin[0]} y1={pin[1]} x2={bal[0]} y2={bal[1]} stroke={TEAL} strokeWidth={3} strokeDasharray="6 6" opacity={oBal} />
        <Arrow p={pin} q={[pin[0] + vs[0], pin[1] + vs[1]]} color={TEAL} w={6} halo o={oBal} />
        <Lbl x={pin[0] + vs[0] + 10} y={pin[1] + vs[1] - 4} t="v" c={TEAL} s={34} b o={oBal} />
        <PoleThermometer x={pin[0]} y={pin[1]} o={oPole} s={0.7} />
        <Lbl x={pin[0] - 26} y={pin[1] - 40} t="thermometer on a pole:" c={INK} s={28} a="end" o={oPole} b />
        <Lbl x={pin[0] - 26} y={pin[1] - 6} t="one fixed place" c={INK} s={28} a="end" o={oPole} />
        <BalloonThermometer x={bal[0]} y={bal[1]} o={oBal} s={0.6} />
        <Lbl x={bal[0] + 34} y={bal[1] - 70} t="thermometer on a balloon:" c={INK} s={28} o={oBal} b />
        <Lbl x={bal[0] + 34} y={bal[1] - 36} t="rides WITH the air" c={INK} s={28} o={oBal} />
        {/* leaders from the equation terms to the icons (before the anatomy strip) */}
        <Dash p={[560, 240]} q={[pin[0] - 4, pin[1] - 110]} c={SLATE} w={2.5} o={oPole * leadO} d="6 6" />
        <Dash p={[250, 240]} q={[bal[0] - 16, bal[1] - 110]} c={INK} w={2.5} o={oBal * leadO} d="6 6" />
        {/* anatomy strip */}
        <g opacity={oAn}>
          {TERMS14.filter((t) => t.label).map((t) => (
            <g key={t.x}>
              <path d={`M ${t.x - 70} 240 Q ${t.x - 70} 252 ${t.x - 50} 252 L ${t.x - 10} 252 L ${t.x} 262 L ${t.x + 10} 252 L ${t.x + 50} 252 Q ${t.x + 70} 252 ${t.x + 70} 240`}
                fill="none" stroke={t.c} strokeWidth={3} />
              <Lbl x={t.x} y={286} t={t.label!} c={t.c} s={28} a="middle" b />
            </g>
          ))}
          <Lbl x={900} y={324} t="advection = carrying by the wind" c={TEAL} s={28} a="middle" o={oAdvW} />
        </g>
      </Svg>
      <EqBox latex={EQ_17_HL} x={40} y={10} w={880} h={110} size={42} number="Vallis 1.7" nw={220} />
      {TERMS14.map((t, i) => {
        const on = i === 0 ? oBal : i === 2 ? oPole : i === 4 ? oAdv : 0;
        return (
          <div key={i} style={{ position: "absolute", left: t.x, top: 185, transform: "translate(-50%, -50%)", fontSize: 48,
            color: t.c, ...box(on * leadO, t.c) }} dangerouslySetInnerHTML={{ __html: tex(t.tex, false) }} />
        );
      })}
      <Txt x={1000} y={20} w={880} s={30} c={MUTED}>(v·∇)T = v·∇T: the same thing, the dot product of the wind with ∇T</Txt>
      <Chip text={`time ×1200: 1 h of drift in 3 s · t = ${hours.toFixed(1)} h`} x={1000} y={380} size={28} color={MUTED} o={oBal} />
      <Txt x={1000} y={460} w={880} s={30} o={oPole}><b style={{ color: SLATE }}>∂T/∂t</b>: how fast the reading changes at ONE FIXED place</Txt>
      <Txt x={1000} y={560} w={880} s={30} o={oBal}><b>DT/Dt</b>, the material derivative: the change felt riding with the air</Txt>
      <Txt x={1000} y={660} w={880} s={30} o={oAdv}><b style={{ color: TEAL }}>v·∇T</b>: the extra change from moving through a map where T differs from place to place</Txt>
      <Badge detail="time ×1200 · idealised field, illustrative (not data) · icons illustrative · wind arrow not to the km scale" corner="br" />
      <Footnote items={[FN.V17]} />
    </Scene>
  );
};
void EQ_TFORM;

// ---------------------------------------------------------------- s15 grad T
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = 14;
  const tN = AT(k, 0, "and per metre north"), t1 = SS(k, 1), t1b = AT(k, 1, "its length"), t2 = SS(k, 2);
  const oE = ramp(f, 10, 24), oN = ramp(f, tN, tN + 12), oEq = ramp(f, SE(k, 0) - 10, SE(k, 0) + 4);
  const oG = ramp(f, t1, t1 + 18), oL = ramp(f, t1b, t1b + 12), oS = ramp(f, t2, t2 + 14);
  const g = GW, P0: Pt = [gX(g, PIN[0]), gY(g, PIN[1])];
  const step = 50 * g.km;
  return (
    <Scene>
      <Svg>
        <TMap g={g} G={wx.gradT[0]} shiftKm={0} />
        <MapFrame g={g} />
        <ColourBar g={g} />
        <g opacity={oE * (1 - oG)}>
          <Arrow p={P0} q={[P0[0] + step, P0[1]]} color={ORANGE} w={5} head={16} halo />
          <Lbl x={P0[0] + step + 10} y={P0[1] - 26} t="50 km east: +0.5 K" c={INK} s={28} />
        </g>
        <g opacity={oN * (1 - oG)}>
          <Arrow p={P0} q={[P0[0], P0[1] - step]} color={ORANGE} w={5} head={16} halo />
          <Lbl x={P0[0] - 12} y={P0[1] - step - 10} t="50 km north: +0 K" c={INK} s={28} a="end" />
        </g>
        <Arrow p={P0} q={[P0[0] + GL * oG, P0[1]]} color={ORANGE} o={oG} w={8} halo />
        <Lbl x={P0[0] + GL + 14} y={P0[1]} t="∇T" c={ORANGE} s={38} b o={oG} />
        <Bracket p={P0} q={[P0[0] + GL, P0[1]]} off={22} c={ORANGE} label="|∇T|" lo={24} s={30} o={oL} />
        <circle cx={P0[0]} cy={P0[1]} r={7} fill={INK} stroke={HOUSE.bg} strokeWidth={2} />
        <g opacity={oS}>
          <Bracket p={[gX(g, 300), g.my + 40]} q={[gX(g, 400), g.my + 40]} off={0} c={INK} />
          <Lbl x={gX(g, 350)} y={g.my + 70} t="100 km per 1 K" c={INK} s={30} a="middle" b />
        </g>
      </Svg>
      <Chip text="∇T, “grad T”: an arrow made of two slopes" x={40} y={30} />
      <Txt x={RX} y={130} w={RW} s={30} c={ORANGE} o={oE}>∂T/∂x = 1 K per 100 km = {sci(wx.dTdx_K_m)} K/m (going east)</Txt>
      <Txt x={RX} y={215} w={RW} s={30} c={ORANGE} o={oN}>∂T/∂y = 0 (no change going north: the isotherms run north–south)</Txt>
      <EqBox latex={EQ_GRAD} x={RX - 20} y={300} w={RW + 30} h={110} size={32} o={oEq} />
      <Txt x={RX} y={440} w={RW} s={32} c={ORANGE} o={oG}><b>∇T</b> points uphill, towards warmer air</Txt>
      <Txt x={RX} y={500} w={RW} s={32} o={oL}>|∇T| = {sci(wx.norm_gradT)} K/m = how steep the map is</Txt>
      <Txt x={RX} y={590} w={RW} s={30} c={MUTED} o={oS}>isotherms every 1 °C, 100 km apart · 1 K = a step of 1 °C</Txt>
      <Badge detail="∇T arrow not to the map's km scale · idealised field, illustrative (not data)" corner="br" />
      <Footnote items={[FN.grad]} o={oEq} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s16 the calculation
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = 15;
  const t1 = SS(k, 1), t2 = SS(k, 2), e2 = SE(k, 2);
  const oV = ramp(f, 4, 20), oS = ramp(f, t1, t1 + 18);
  const sub = (i: number) => ramp(f, t2 + ((e2 - t2) * i) / 5, t2 + ((e2 - t2) * i) / 5 + 10);
  const oR = sub(0);
  const g = GW, P0: Pt = [gX(g, PIN[0]), gY(g, PIN[1])];
  const vs = vScr(US), vT: Pt = [P0[0] + vs[0], P0[1] + vs[1]], sh: Pt = [P0[0] + wx.shadow_m_s * US, P0[1]];
  const rect: Pt[] = [P0, sh, [sh[0], P0[1] + GL * oR], [P0[0], P0[1] + GL * oR]];
  return (
    <Scene>
      <Svg>
        <TMap g={g} G={wx.gradT[0]} shiftKm={0} />
        <MapFrame g={g} />
        <ColourBar g={g} />
        {oR > 0 ? <ProdRect pts={rect} neg={false} o={oR} id="h16" /> : null}
        <Band p={P0} q={lerp(P0, sh, oS)} color={TEAL} o={oS > 0 ? 1 : 0} />
        <Arrow p={P0} q={[P0[0] + GL, P0[1]]} color={ORANGE} w={7} halo />
        <Arrow p={P0} q={vT} color={TEAL} o={oV} w={7} halo />
        <circle cx={P0[0]} cy={P0[1]} r={7} fill={INK} stroke={HOUSE.bg} strokeWidth={2} />
        <Lbl x={P0[0] + GL + 12} y={P0[1]} t="∇T" c={ORANGE} s={36} b />
        <g opacity={oV}>
          <Arc P={mkP(P0[0], P0[1], 1)} a0={0} a1={wx.angle_deg} r={62} />
          <Lbl x={P0[0] + 70} y={P0[1] - 32} t={`${wx.angle_deg.toFixed(0)}°`} s={30} />
          <Lbl x={vT[0] + 12} y={vT[1] - 6} t={`v: |v| = ${wx.norm_v.toFixed(1)} m/s`} c={TEAL} s={32} b />
        </g>
        {oS > 0 ? <g opacity={oS}><Dash p={vT} q={sh} /><RightTick at={sh} u1={[-1, 0]} u2={[0, -1]} />
          <Lbl x={P0[0] - 12} y={P0[1] + 30} t="shadow" c={TEAL} s={28} a="end" b /></g> : null}
        {oR > 0 ? <g opacity={oR}>
          <Bracket p={sh} q={[sh[0], P0[1] + GL]} off={-16} c={ORANGE} label="|∇T|" lo={18} s={28} a="start" />
          <Lbl x={P0[0] - 14} y={P0[1] + 100} t="area = v·∇T" c={INK} s={30} a="end" b />
        </g> : null}
      </Svg>
      <Chip text="v·∇T: shadow × steepness" x={40} y={30} />
      <EqBox latex={EQ_TFORM_HL} x={RX - 20} y={20} w={RW + 30} h={110} size={36} number="Vallis 1.7" nw={210} />
      <Txt x={RX} y={145} w={RW} s={30} c={TEAL} o={oV}>wind v: |v| = {wx.norm_v.toFixed(1)} m/s, {wx.angle_deg.toFixed(0)}° from ∇T</Txt>
      <Txt x={RX} y={190} w={RW} s={30} c={TEAL} o={oS}>shadow of v on ∇T = 10.0 cos 60° = <b>{wx.shadow_m_s.toFixed(2)} m/s</b></Txt>
      <Txt x={RX} y={255} w={RW} s={32} o={sub(0)}>v·∇T = (shadow of v on ∇T) × |∇T|</Txt>
      <TeX s={EQ_VGT_X} x={RX} y={305} size={36} o={sub(1)} />
      <Txt x={RX} y={365} w={RW} s={32} o={sub(2)}>= (10.0 m/s × cos 60°) × {sci(wx.norm_gradT)} K/m</Txt>
      <Txt x={RX} y={410} w={RW} s={32} o={sub(3)}>= {wx.shadow_m_s.toFixed(2)} m/s × {sci(wx.norm_gradT)} K/m = <b>{sci(wx.v_dot_gradT)} K/s</b></Txt>
      <Txt x={RX} y={455} w={RW} s={32} o={sub(4)}>× 3600 s per hour = <b>{wx.K_per_h.toFixed(3)} K per hour</b></Txt>
      <Txt x={RX} y={520} w={RW} s={30} c={MUTED} o={sub(3)}>units: (<s>m</s>/s) × (K/<s>m</s>) = K/s</Txt>
      <Chip x={RX} y={580} w={RW} size={28} color={MUTED} o={sub(4)}
        text={`definition 1: ${VV[0].toFixed(2)} × ${sci(wx.gradT[0])} + ${VV[1].toFixed(2)} × 0 = ${sci(wx.v_dot_gradT)} ✓`} />
      <Badge detail="wind and ∇T arrows not drawn to the map's km scale · idealised field, illustrative (not data)" corner="br" />
      <Footnote items={[FN.V17, FN.A1]} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s17 a rate in time, not a slope in space
const Lock: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <path d={`M ${x - 12} ${y} v -12 a 12 12 0 0 1 24 0 v 12`} fill="none" stroke={INK} strokeWidth={4} />
    <rect x={x - 18} y={y} width={36} height={28} rx={4} fill={INK} />
  </g>
);
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = 16;
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3);
  const oA = ramp(f, t1, t1 + 14), oB = ramp(f, t2, t2 + 12);
  const run = clamp((f - t2 - 6) / 120, 0, 1); // 1 h in 4 s (×900)
  const ib = run * 60; // samples are 1 min apart; 60 = 1 h
  const i0 = Math.floor(ib), i1 = Math.min(60, i0 + 1), w = ib - i0;
  const bxk = wx.balloon_x_km[i0] + (wx.balloon_x_km[i1] - wx.balloon_x_km[i0]) * w;
  const byk = wx.balloon_y_km[i0] + (wx.balloon_y_km[i1] - wx.balloon_y_km[i0]) * w;
  const g = GZ, P0: Pt = [gX(g, PIN[0]), gY(g, PIN[1])], bal: Pt = [gX(g, bxk), gY(g, byk)];
  const oEnd = ramp(f, t2 + 126, t2 + 138);
  const ck = (i: number) => ramp(f, t3 + i * 18, t3 + i * 18 + 12);
  const xEnd = gX(g, wx.balloon_x_km[60]);
  return (
    <Scene>
      <Svg>
        <TMap g={g} G={wx.gradT[0]} shiftKm={0} />
        <MapFrame g={g} dx={40} dy={30} />
        <line x1={P0[0]} y1={P0[1]} x2={bal[0]} y2={bal[1]} stroke={TEAL} strokeWidth={5} opacity={oB} />
        <circle cx={P0[0]} cy={P0[1]} r={8} fill={INK} stroke={HOUSE.bg} strokeWidth={2} />
        <Lbl x={P0[0] - 14} y={P0[1] + 26} t="start" c={INK} s={28} a="end" />
        <BalloonThermometer x={bal[0]} y={bal[1]} o={oB} s={0.8} />
        <g opacity={oEnd}>
          <Lbl x={(P0[0] + bal[0]) / 2 - 18} y={(P0[1] + bal[1]) / 2 + 10} t={`${wx.km_per_h_along_wind.toFixed(1)} km along the wind`} c={TEAL} s={30} a="end" b />
          <Dash p={[xEnd, bal[1]]} q={[xEnd, P0[1] + 50]} c={INK} w={2} d="5 6" />
          <Bracket p={[P0[0], P0[1] + 50]} q={[xEnd, P0[1] + 50]} off={0} c={ORANGE} />
          <Lbl x={P0[0] - 6} y={P0[1] + 92} t={`${wx.km_per_h_towards_warm.toFixed(1)} km towards warmer air`} c={ORANGE} s={30} b />
          <Lbl x={P0[0] - 6} y={P0[1] + 130} t={`(= the shadow: ${wx.shadow_m_s.toFixed(2)} m/s × 3600 s)`} c={ORANGE} s={28} />
        </g>
        <g opacity={oA}><Lock x={gX(g, g.x0 + g.w) - 40} y={g.my + g.h * g.km - 60} /></g>
        <Lbl x={gX(g, g.x0 + g.w) - 72} y={g.my + g.h * g.km - 44} t="map does not change" c={INK} s={28} a="end" o={oA} b />
      </Svg>
      <Chip text="Does the map warm by 0.180 K per hour as you go east?" x={40} y={30} size={32} />
      <Chip text="No. The map stays put." x={40} y={98} size={32} color={ORANGE} o={oA} />
      <div style={{ position: "absolute", left: RX, top: 150, width: RW, display: "flex", gap: 20, opacity: oA, ...FONT, fontSize: 30, lineHeight: 1.3 }}>
        <div style={{ flex: 1, background: HOUSE.panel, borderTop: `6px solid ${ORANGE}`, borderRadius: 10, padding: "12px 16px" }}>
          <b style={{ color: ORANGE }}>rate in SPACE</b><br />the map’s slope<br /><b>1 K per 100 km</b><br /><span style={{ color: MUTED }}>fixed</span>
        </div>
        <div style={{ flex: 1, background: HOUSE.panel, borderTop: `6px solid ${TEAL}`, borderRadius: 10, padding: "12px 16px" }}>
          <b style={{ color: TEAL }}>rate in TIME</b><br />what the moving air meets<br /><b>{wx.K_per_h.toFixed(3)} K per hour</b>
        </div>
      </div>
      <Txt x={RX} y={440} w={RW} s={30} o={ck(0)}>{wx.shadow_m_s.toFixed(2)} m/s = <b>{wx.km_per_h_towards_warm.toFixed(1)} km per hour</b> towards warmer air</Txt>
      <Txt x={RX} y={530} w={RW} s={30} o={ck(1)}>{wx.km_per_h_towards_warm.toFixed(1)} km × (1 K per 100 km) = <b>{wx.warming_met_K.toFixed(3)} K</b></Txt>
      <Txt x={RX} y={590} w={RW} s={30} o={ck(2)}>map under the balloon: {wx.T_under_balloon[0].toFixed(2)} °C → {wx.T_under_balloon[1].toFixed(2)} °C after 1 h</Txt>
      <Txt x={RX} y={680} w={RW} s={30} c={TEAL} o={ck(3)}>each hour, the air reaches map spots {wx.warming_met_K.toFixed(3)} K warmer than where it was an hour before</Txt>
      <Chip text={`clock: 1 h in 4 s (×900) · t = ${(run).toFixed(2)} h`} x={40} y={880} size={28} color={MUTED} o={oB} />
      <Txt x={540} y={888} w={520} s={28} c={MUTED}>zoomed in: 240 km × 150 km around the start</Txt>
      <Badge detail="time ×900 · idealised field, illustrative (not data) · arrows not to the km scale" corner="br" />
    </Scene>
  );
};

// ---------------------------------------------------------------- s18 DT/Dt = 0 and the one-move algebra
const STRIP18 = [
  { tex: EQ_TFORM, why: "(Vallis 1.7) with φ = T" },
  { tex: String.raw`0 = \frac{\partial T}{\partial t} + \mathbf v\cdot\nabla T`, why: "each parcel keeps its temperature: DT/Dt = 0" },
  { tex: String.raw`0 - \mathbf v\cdot\nabla T = \frac{\partial T}{\partial t} ${col(TEAL, String.raw`\cancel{+ \mathbf v\cdot\nabla T - \mathbf v\cdot\nabla T}`)}`, why: "subtract v·∇T from both sides" },
  { tex: String.raw`\boxed{\frac{\partial T}{\partial t} = ${col(ROSE, "-")}\,\mathbf v\cdot\nabla T}`, why: "what’s left: the pair on the right cancels" },
];
// storyboard derivation_strip line 3, uncancelled: 0 - \mathbf v\cdot\nabla T = \frac{\partial T}{\partial t} + \mathbf v\cdot\nabla T - \mathbf v\cdot\nabla T
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = 17;
  const t1 = SS(k, 1), t2 = SS(k, 2), t2b = AT(k, 2, "partial T by partial t equals");
  const at = [t1, AT(k, 1, "so D T by D t") + 10, t2 + 20, t2b + 10];
  const drift = clamp((f - 15) / 90, 0, 1) * 60; // 1 h in 3 s (×1200)
  const i0 = Math.floor(drift), i1 = Math.min(60, i0 + 1), w = drift - i0;
  const g = GW;
  const shift = (wx.v_x * (drift * 60)) / 1000;
  const cur = at.reduce((c, a, i) => (f >= a ? i : c), -1);
  return (
    <Scene>
      <Svg>
        <ClipMap g={g} id="clip18">
          <TMap g={g} G={wx.gradT[0]} shiftKm={shift} />
          {wx.tags_T.map((T, i) => {
            const xk = wx.tags_x_km[i][i0] + (wx.tags_x_km[i][i1] - wx.tags_x_km[i][i0]) * w;
            const yk = wx.tags_y_km[i][i0] + (wx.tags_y_km[i][i1] - wx.tags_y_km[i][i0]) * w;
            const x = gX(g, xk), y = gY(g, yk);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={11} fill="none" stroke="#ffffff" strokeWidth={2} />
                <circle cx={x} cy={y} r={9} fill={tColor(T)} stroke={HOUSE.bg} strokeWidth={3} />
                <Lbl x={x + 15} y={y} t={T.toFixed(1)} c={INK} s={28} b />
              </g>
            );
          })}
        </ClipMap>
        <MapFrame g={g} />
        <ColourBar g={g} />
      </Svg>
      <Chip text={f >= t1 ? "DT/Dt = 0: the balloon’s reading never changes" : "Suppose each parcel keeps its temperature"} x={40} y={30} size={30} />
      <Txt x={40} y={905} w={1050} s={28} c={MUTED}>each parcel keeps its temperature: no sunshine heating it, no mixing — it carries its temperature like a label (tags never change)</Txt>
      {STRIP18.map((l, i) => {
        const o = ramp(f, at[i], at[i] + 12) * (cur > i ? 0.55 : 1);
        return o > 0 ? (
          <div key={i} style={{ position: "absolute", left: RX - 20, top: 175 + i * 150, width: RW + 30, opacity: o }}>
            <div style={{ fontSize: 40, color: INK }} dangerouslySetInnerHTML={{ __html: tex(l.tex, false) }} />
            <div style={{ ...FONT, fontSize: 28, color: MUTED, marginTop: 6 }}>{i + 1} · {l.why}</div>
          </div>
        ) : null;
      })}
      <EqBox latex={EQ_DTDT_HL} x={RX - 20} y={810} w={RW + 30} h={110} size={34} o={ramp(f, at[3] + 30, at[3] + 42)} />
      <Badge detail="time ×1200 · idealised field, illustrative (not data)" corner="tr" />
      <Footnote items={[FN.V17, FN.dTdt]} o={ramp(f, at[0], at[0] + 12)} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s19-s20 the pole cools; twice as steep
const Weather: React.FC<{ k: number; steepMode: boolean }> = ({ k, steepMode }) => {
  const f = useCurrentFrame();
  const t1 = SS(k, 1);
  const steep = steepMode ? ramp(f, 10, 25) : 0;
  const tStart = steepMode ? 25 : 0;
  const n = wx.t_h.length - 1; // 121 samples over 6 h; 6 s of movie
  const kk = Math.round(clamp((f - tStart) / 180, 0, 1) * n);
  const isB = steepMode && steep >= 1;
  const kA = steepMode ? n : kk; // the first map has finished its 6 h run in s19
  const G = isB ? wx.gradT_steep[0] : wx.gradT[0];
  const tWest = isB ? wx.T_west_steep : wx.T_west;
  const Tpole = isB ? wx.T_pole_steep[kk] : steepMode ? wx.T_pole[n] : wx.T_pole[kk];
  const dKs = isB || steepMode ? wx.dTdt_K_s_steep : wx.dTdt_K_s, dKh = steepMode ? wx.dTdt_K_h_steep : wx.dTdt_K_h;
  const dKd = steepMode ? wx.dTdt_K_day_steep : wx.dTdt_K_day;
  const kp = isB || !steepMode ? kk : kA;
  const g = GW, P0: Pt = [gX(g, PIN[0]), gY(g, PIN[1])];
  const GLk = GL * (1 + steep);
  const parcels = wx.parcels_x_km.map((xs, i) => {
    const x = ((xs[kp] % 600) + 600) % 600;
    const y = ((wx.parcels_y_km[i][kp] % 360) + 360) % 360;
    return <g key={i}><circle cx={gX(g, x)} cy={gY(g, y)} r={12} fill="none" stroke="#ffffff" strokeWidth={2} />
      <circle cx={gX(g, x)} cy={gY(g, y)} r={10} fill={tColor(tWest + G * (x - wx.shift_km[kp]) * 1000)} stroke={HOUSE.bg} strokeWidth={3} /></g>;
  });
  const vs = vScr(US), vT: Pt = [P0[0] + vs[0], P0[1] + vs[1]], sh: Pt = [P0[0] + wx.shadow_m_s * US, P0[1]];
  const back = Math.atan2(-vs[1], -vs[0]), half = (25 * Math.PI) / 180, R = 230;
  const cone = `M ${P0[0]} ${P0[1]} L ${P0[0] + R * Math.cos(back - half)} ${P0[1] + R * Math.sin(back - half)} A ${R} ${R} 0 0 1 ${P0[0] + R * Math.cos(back + half)} ${P0[1] + R * Math.sin(back + half)} Z`;
  const oCone = steepMode ? 1 : ramp(f, t1, t1 + 14);
  const fade = steepMode && steep > 0 && steep < 1 ? steep : 0;
  // balloon (s19 only): x(t) = x_pin + v t; keeps 13.00 °C
  const bxk = PIN[0] + (VV[0] * wx.t_h[kk] * 3600) / 1000, byk = PIN[1] + (VV[1] * wx.t_h[kk] * 3600) / 1000;
  const bal: Pt = [gX(g, bxk), gY(g, byk)];
  const t2 = steepMode ? SS(k, 2) : 0, tCard = steepMode ? AT(k, 2, "the dot product holds") : 0;
  const oSh = steepMode ? ramp(f, t1, t1 + 14) : 0, oR = steepMode ? ramp(f, t2, t2 + 14) : 1, oCard = steepMode ? ramp(f, tCard, tCard + 14) : 0;
  return (
    <>
      <Svg>
        <ClipMap g={g} id={`clip${k}`}>
          {fade > 0 ? (<>
            <TMap g={g} G={wx.gradT[0]} shiftKm={wx.shift_km[kA]} />
            <TMap g={g} G={wx.gradT_steep[0]} shiftKm={0} o={fade} tWest={wx.T_west_steep} />
          </>) : <TMap g={g} G={G} shiftKm={wx.shift_km[kp]} tWest={tWest} />}
          {fade === 0 ? parcels : null}
          <path d={cone} fill="#ffffff" fillOpacity={0.16 * oCone} stroke="#ffffff" strokeOpacity={0.6 * oCone} strokeWidth={2} strokeDasharray="8 6" />
        </ClipMap>
        {!steepMode ? <BalloonThermometer x={bal[0]} y={bal[1]} s={0.7} o={1 - ramp(byk, 345, 360)} /> : null}
        {!steepMode ? <Lbl x={bal[0] + 30} y={bal[1] - 60} t="balloon: 13.00 °C" c={INK} s={28} b o={1 - ramp(byk, 345, 360)} /> : null}
        <MapFrame g={g} />
        <ColourBar g={g} />
        <Band p={P0} q={sh} color={TEAL} />
        <Arrow p={P0} q={[P0[0] + GLk, P0[1]]} color={ORANGE} w={7} halo />
        <Arrow p={P0} q={vT} color={TEAL} w={7} halo />
        <Lbl x={P0[0] + GLk + 12} y={P0[1]} t="∇T" c={ORANGE} s={34} b />
        <Lbl x={vT[0] + 12} y={vT[1] - 6} t="v" c={TEAL} s={34} b />
        <PoleThermometer x={P0[0]} y={P0[1]} s={0.9} />
        <Lbl x={P0[0] - 24} y={P0[1] - 80} t="thermometer on a pole (fixed)" c={INK} s={28} a="end" b />
        <Lbl x={P0[0] - 24} y={P0[1] - 46} t={`${Tpole.toFixed(2)} °C`} c={INK} s={30} a="end" b />
        <Lbl x={g.mx + 16} y={g.my + g.h * g.km - 30} t="the air arriving at the pole comes from colder places upwind" c={INK} s={28} o={oCone} />
      </Svg>
      <EqBox latex={EQ_17} x={RX - 20} y={20} w={RW + 30} h={95} size={30} number="Vallis 1.7" nw={210} />
      <EqBox latex={EQ_DTDT_HL} x={RX - 20} y={118} w={RW + 30} h={100} size={34} />
      <div style={{ position: "absolute", left: RX, top: 230, width: RW, ...FONT, fontSize: 30, background: HOUSE.panel,
        borderRadius: 12, padding: "10px 18px", boxSizing: "border-box", lineHeight: 1.35 }}>
        <div style={{ color: MUTED, fontSize: 28 }}>clock: 6 h of weather in 6 s (×3600){isB ? " · steeper map" : ""}</div>
        <div>t = {wx.t_h[kk].toFixed(1)} h · pole: <b>{Tpole.toFixed(2)} °C</b>{!steepMode ? <> · balloon: <b>13.00 °C</b></> : null}</div>
        <div style={{ color: ORANGE }}>|∇T| = {sci(G)} K/m{isB ? " (twice as steep)" : ""}</div>
      </div>
      <Txt x={RX} y={385} w={RW} s={30} o={oR}>
        ∂T/∂t = −v·∇T = {sgn(dKs, `${sci(Math.abs(dKs))} K/s`)} = <b>{sgn(dKh, `${Math.abs(dKh).toFixed(3)} K per hour`)}</b>{" "}
        ({sgn(dKd, `${Math.abs(dKd).toFixed(2)} K per day`)}){steepMode ? ": twice as fast" : ""}
      </Txt>
      {steepMode ? (<>
        <Txt x={RX} y={475} w={RW} s={30} c={TEAL} o={oSh}>shadow of v on ∇T: still {wx.shadow_steep_m_s.toFixed(2)} m/s — it belongs to the wind alone</Txt>
        <Txt x={RX} y={560} w={RW} s={30} o={oR}>v·∇T = (|v| cos θ) × <span style={{ color: ORANGE }}>|∇T|</span> = {wx.shadow_steep_m_s.toFixed(2)} m/s × <span style={{ color: ORANGE }}>{sci(wx.gradT_steep[0])} K/m</span></Txt>
        <div style={{ position: "absolute", left: RX, top: 655, width: RW, ...FONT, fontSize: 29, opacity: oCard, lineHeight: 1.3 }}>
          <div style={{ borderLeft: `6px solid ${TEAL}`, paddingLeft: 14, marginBottom: 14 }}>
            shadow |v| cos θ = <b>{wx.shadow_m_s.toFixed(2)} m/s</b> on both maps → the wind alone
          </div>
          <div style={{ borderLeft: `6px solid ${ROSE}`, paddingLeft: 14 }}>
            ∂T/∂t = −v·∇T: {fx(wx.dTdt_K_h)} → {fx(wx.dTdt_K_h_steep)} K per hour → the wind AND the map: the shadow alone can’t give this
          </div>
        </div>
      </>) : null}
    </>
  );
};
const S19: React.FC = () => (
  <Scene>
    <Weather k={18} steepMode={false} />
    <Chip text="So the thermometer on the pole cools" x={40} y={30} size={30} />
    <Badge detail="time ×3600 (6 h in 6 s) · arrows not to the km scale · idealised field, illustrative (not data)" corner="bl" />
    <Footnote items={[FN.V17, FN.dTdt]} />
  </Scene>
);
const S20: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Scene>
      <Weather k={19} steepMode />
      <Chip text="Make the map twice as steep" x={40} y={30} size={30} />
      <Chip text="same place, map ×2 steeper — clock restarts" x={40} y={92} size={28} color={ORANGE} o={ramp(f, 10, 25)} />
      <Badge detail="time ×3600 (6 h in 6 s) · arrows not to the km scale · idealised field, illustrative (not data)" corner="bl" />
      <Footnote items={[FN.V17, FN.dTdt]} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s21 recap and end card
const S21: React.FC = () => {
  const f = useCurrentFrame(), k = 20;
  const b = (i: number) => ramp(f, i * 10, 10 + i * 10);
  const t1 = SS(k, 1), oL = ramp(f, t1, t1 + 12);
  return (
    <Scene>
      <div style={{ position: "absolute", left: 100, top: 40, ...FONT, fontSize: 60, fontWeight: 700 }}>What the dot product measures</div>
      <div style={{ position: "absolute", left: 100, top: 135, width: 1720, background: HOUSE.panel, borderRadius: 16,
        border: `2px solid ${HOUSE.accent}`, padding: "18px 32px", boxSizing: "border-box", ...FONT, fontSize: 34, lineHeight: 1.4 }}>
        <div style={{ opacity: b(0) }}><b style={{ color: HOUSE.accent }}>1 · Same both ways:</b> a·b = b·a
          ({SHAB.toFixed(3)} × {NB.toFixed(3)} = {SHBA.toFixed(3)} × {NA.toFixed(3)} = {AB.toFixed(0)})</div>
        <div style={{ opacity: b(1), marginTop: 10 }}><b style={{ color: HOUSE.accent }}>2 · Cheap:</b> multiply parts and add;
          shadow = a·b ÷ |b|; with a unit arrow, a·b̂ IS the shadow</div>
        <div style={{ opacity: b(2), marginTop: 10 }}><b style={{ color: HOUSE.accent }}>3 · Physics needs both sizes:</b>{" "}
          W = F·d = {work.W_J[0].toFixed(0)} J; ∂T/∂t = −v·∇T = {fx(wx.dTdt_K_h)} K/h (twice as steep → {fx(wx.dTdt_K_h_steep)})</div>
        <div style={{ opacity: b(3), marginTop: 14, fontSize: 30, color: MUTED }}>
          sign: <span style={{ color: INK }}>+ same way (under 90°)</span> · <span style={{ color: INK }}>0 at 90°</span> ·{" "}
          <span style={{ color: ROSE }}>− opposite (beyond 90°)</span></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, bottom: 120, opacity: oL }}>
        <EndCard notebook="Chapter 0A, the dot product — shammun.github.io/aofd/notebooks/poc_ch00a_dot.html"
          explainer="Try it: vector products lab — shammun.github.io/aofd/viz/ch00/vector_products_lab.html" credit="" />
      </div>
      <div style={{ position: "absolute", left: 140, top: 880, width: 1660, ...FONT, fontSize: 28, color: MUTED, lineHeight: 1.35, opacity: oL }}>
        From Kundu: §2.1 (K 2.2), §2.8 (dot product), §2.9 (gradient) — fluidpy ch02 C01 and C09:{" "}
        <span style={{ color: INK }}>shammun.github.io/fluidpy/notebooks/ch02_cartesian_tensors.html</span><br />
        Made with tested fluidpy physics · shammun.github.io/aofd
      </div>
    </Scene>
  );
};

const SCENES = [S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21];
if (SCENES.length !== sc.length) throw new Error(`${SCENES.length} scene components but ${sc.length} scenes in timing.json`);
export const DotProductWhy: React.FC<{ audio?: string }> = ({ audio = "narration_music.wav" }) => (
  <AbsoluteFill style={{ background: HOUSE.bg }}>
    {SCENES.map((S, k) => (
      <Sequence key={sc[k].id} name={sc[k].id} from={CUT[k]} durationInFrames={LEN(k)}><S /></Sequence>
    ))}
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
