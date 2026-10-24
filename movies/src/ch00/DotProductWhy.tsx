import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BalloonThermometer, EqLine, GhostArrow, HOUSE, PoleThermometer, TERM, ramp, tex } from "../house";
import { PartCard, SceneTitle, partCardDim, PART_CARD_FRAMES } from "./SceneTitle";
import timing from "../../ch00/ch00_dot_product_why/timing.json";
import pair from "../../ch00/ch00_dot_product_why/data/pair.json";
import same from "../../ch00/ch00_dot_product_why/data/same_way.json";
import cheap from "../../ch00/ch00_dot_product_why/data/cheap.json";
import work from "../../ch00/ch00_dot_product_why/data/work.json";
import wx from "../../ch00/ch00_dot_product_why/data/weather.json";

/**
 * Chapter 0A movie "What the dot product measures, and why it multiplies by the other length", VERSION 4
 * (movies/ch00/ch00_dot_product_why/storyboard.yaml, 22 scenes), 1920×1080, 30 fps; length from timing.json + 2.5-s hold.
 * v4 user rules: G1 no references on screen (no equation labels, book or author names, no footnote strip; the only
 * equation number is a plain "(1)" on the cosine form, s04 and s06); G2 no "not to scale" badges; G3 every scene opens
 * with the SceneTitle band (drawn once, outside the scene Sequences, so it never disappears at a cut); G5 each line is
 * revealed with the sentence that says it (timing from timing.json, tools/tts.py af_bella ×1.0).
 * Layout: content y 160–815 (and 960–1060 for gauges, legends, reason slots); player captions (en.vtt line:76 %) cover
 * y ≈ 821–950.
 * Every number on screen is read from data/*.json, written by movies/data/build_ch00_dot_product_why.py from the tested
 * fluidpy functions (fluidpy.geo.vectors, fluidpy.core.operators.gradient, fluidpy.core.kinematics). This file only
 * indexes those samples by frame. Numbers that the storyboard writes inside a TeX string are checked against the data at
 * load time (CHECK below), so a TeX string can never drift from the physics.
 * Rules: a scalar is never an arrow (number, gauge, or the shadow × length rectangle); first vector teal, second orange;
 * a shadow takes the colour of the arrow that casts it; negative products rose + hatched + dashed outline.
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

// ---------------------------------------------------------------- scene titles (storyboard `title:` of each scene)
const TITLES: { kicker: string; text: string; part?: boolean }[] = [
  { kicker: "PART 1 · WHAT THE DOT PRODUCT IS", text: "Two arrows in, one number out", part: true },
  { kicker: "PART 1 · WHAT THE DOT PRODUCT IS", text: "Vectors and their components" },
  { kicker: "PART 1 · WHAT THE DOT PRODUCT IS", text: "Definition 1: multiply matching components, then add" },
  { kicker: "PART 1 · WHAT THE DOT PRODUCT IS", text: "Definition 2: two lengths and the angle" },
  { kicker: "PART 1 · WHAT THE DOT PRODUCT IS", text: "The angle sets the sign" },
  { kicker: "PART 1 · WHAT THE DOT PRODUCT IS", text: "The shadow of a on b, step by step" },
  { kicker: "PART 1 · WHAT THE DOT PRODUCT IS", text: "The same shadow, another way: the unit vector b̂" },
  { kicker: "PART 2 · WHY TIMES THE OTHER LENGTH?", text: "Why multiply the shadow by |b|?", part: true },
  { kicker: "PART 2 · WHY TIMES THE OTHER LENGTH?", text: "Reason 1 · the order doesn’t matter" },
  { kicker: "PART 2 · WHY TIMES THE OTHER LENGTH?", text: "Reason 2 · cheap, and a unit vector picks out a part" },
  { kicker: "PART 2 · WHY TIMES THE OTHER LENGTH?", text: "Reason 3 · physics needs both sizes: work" },
  { kicker: "PART 3 · THE WEATHER", text: "Two thermometers: a fixed place, or moving air", part: true },
  { kicker: "PART 3 · THE WEATHER", text: "The material-derivative equation" },
  { kicker: "PART 3 · THE WEATHER", text: "Isotherms, and partial derivatives in space" },
  { kicker: "PART 3 · THE WEATHER", text: "∇T: the temperature gradient" },
  { kicker: "PART 3 · THE WEATHER", text: "Advection: v·∇T = shadow × steepness" },
  { kicker: "PART 3 · THE WEATHER", text: "A rate in space, and a rate in time" },
  { kicker: "PART 3 · THE WEATHER", text: "If each air parcel keeps its temperature" },
  { kicker: "PART 3 · THE WEATHER", text: "Why the pole cools: the air comes from upwind" },
  { kicker: "PART 3 · THE WEATHER", text: "Twice as steep: the shadow can’t see it" },
  { kicker: "RECAP", text: "What the dot product measures", part: true },
  { kicker: "RECAP", text: "Try it yourself" },
];

// ---------------------------------------------------------------- equations (verbatim from the storyboard)
// s03
const EQ_DEF3 = String.raw`\mathbf a\cdot\mathbf b = a_1b_1 + a_2b_2 + a_3b_3`;
const EQ_DEF2N = String.raw`\mathbf a\cdot\mathbf b = a_1b_1 + a_2b_2 = 5\times1 + 1\times3 = 8`;
// s04, s06
const EQ_COS = String.raw`\mathbf a\cdot\mathbf b = |\mathbf a|\,|\mathbf b|\cos\theta`;
const EQ_COSN = String.raw`= 5.099\times3.162\times\cos 60.3^\circ = 5.099\times3.162\times0.496 = 8.000`;
// s06
const EQ_SHADOW = String.raw`\text{shadow} = |\mathbf a|\cos\theta = \frac{\mathbf a\cdot\mathbf b}{|\mathbf b|} = \frac{8}{3.162} = 2.530`;
// s07
const EQ_BHAT = String.raw`\hat{\mathbf b} = \frac{\mathbf b}{|\mathbf b|} = \left(\frac{1}{3.162},\ \frac{3}{3.162}\right) = (0.316,\ 0.949)`;
const EQ_ADBH = String.raw`\frac{\mathbf a\cdot\mathbf b}{|\mathbf b|} = \mathbf a\cdot\frac{\mathbf b}{|\mathbf b|} = \mathbf a\cdot\hat{\mathbf b}`;
const EQ_SHBH = String.raw`\text{shadow} = \mathbf a\cdot\hat{\mathbf b} = 5\times0.316 + 1\times0.949 = 2.530`;
const EQ_SUM7 = String.raw`|\mathbf a|\cos\theta = \mathbf a\cdot\hat{\mathbf b} = \frac{\mathbf a\cdot\mathbf b}{|\mathbf b|}`;
// s08
const EQ_Q8 = String.raw`\mathbf a\cdot\mathbf b = (|\mathbf a|\cos\theta)\,|\mathbf b| = 2.530\times3.162 = 8.000`;
// s09
const EQ_SYM = String.raw`\mathbf a\cdot\mathbf b = \mathbf b\cdot\mathbf a`;
const EQ_SH_AB = String.raw`\text{shadow of } \mathbf a \text{ on } \mathbf b = \frac{\mathbf a\cdot\mathbf b}{|\mathbf b|} = \frac{(5,1)\cdot(1,3)}{\sqrt{10}} = \frac{8}{3.162} = 2.530`;
const EQ_SH_BA = String.raw`\text{shadow of } \mathbf b \text{ on } \mathbf a = \frac{\mathbf b\cdot\mathbf a}{|\mathbf a|} = \frac{(1,3)\cdot(5,1)}{\sqrt{26}} = \frac{8}{5.099} = 1.569`;
const EQ_TRAY = String.raw`2.530\times3.162 = 8.000 = 1.569\times5.099`;
// s10
const EQ_VX = String.raw`\mathbf v\cdot\hat{\mathbf x} = 6\times1 + 8\times0 = 6\ \mathrm{m\,s^{-1}}`;
// s11
const EQ_W = String.raw`W = \mathbf F\cdot\mathbf d = (|\mathbf F|\cos\theta)\,|\mathbf d|`;
const EQ_W5 = String.raw`W = (20\cos 60^\circ)\ \mathrm N\times5\ \mathrm m = 10\ \mathrm N\times5\ \mathrm m = 50\ \mathrm J`;
const EQ_W10 = String.raw`W = 10\ \mathrm N\times10\ \mathrm m = 100\ \mathrm J`;
// s12
const EQ_12 = String.raw`\frac{\partial T}{\partial t}\ \ \text{(pole: a fixed place)}\qquad \frac{\mathrm{D}T}{\mathrm{D}t}\ \ \text{(balloon: follows an air parcel)}`;
// s13
const EQ_MD = String.raw`\frac{\mathrm{D}\varphi}{\mathrm{D}t} = \frac{\partial\varphi}{\partial t} + \mathbf v\cdot\nabla\varphi`;
const EQ_TF = String.raw`\frac{\mathrm{D}T}{\mathrm{D}t} = \frac{\partial T}{\partial t} + \mathbf v\cdot\nabla T`;
const EQ_VQ = String.raw`\mathbf v\cdot\nabla q`;
// s14
const EQ_DXDY = String.raw`\frac{\partial T}{\partial x} = \frac{1\ ^\circ\mathrm C}{100\ \mathrm{km}},\qquad \frac{\partial T}{\partial y} = 0`;
// s15
const EQ_GRAD = String.raw`\nabla T = \left(\frac{\partial T}{\partial x},\ \frac{\partial T}{\partial y}\right) = (1.00\times10^{-5}\ \mathrm{K\,m^{-1}},\ 0)`;
// s16
const EQ_VGT = String.raw`\mathbf v\cdot\nabla T = (|\mathbf v|\cos\theta)\,|\nabla T|`;
const EQ_VGTN = String.raw`= 5.00\ \mathrm{m\,s^{-1}}\times1.00\times10^{-5}\ \mathrm{K\,m^{-1}} = 5.00\times10^{-5}\ \mathrm{K\,s^{-1}} = 0.180\ \mathrm{K\ per\ hour}`;
// s17
const EQ_S17 = String.raw`5.00\ \mathrm{m\,s^{-1}}\times3600\ \mathrm s = 18.0\ \mathrm{km},\qquad 18.0\ \mathrm{km}\times\frac{1\ ^\circ\mathrm C}{100\ \mathrm{km}} = 0.180\ ^\circ\mathrm C`;
// s18
const EQ_DTDT = String.raw`\frac{\partial T}{\partial t} = -\,\mathbf v\cdot\nabla T \quad\text{when } \frac{\mathrm{D}T}{\mathrm{D}t} = 0`;
// s19
const EQ_P19 = String.raw`\frac{\partial T}{\partial t} = -\,\mathbf v\cdot\nabla T = -0.180\ \mathrm{K\ per\ hour}`;
const EQ_TUP = String.raw`T_{\text{upwind}} = 13.00 + \nabla T\cdot(-\mathbf v\,t)`;
// s20
const EQ_V20 = String.raw`\mathbf v\cdot\nabla T = 5.00\ \mathrm{m\,s^{-1}}\times2.00\times10^{-5}\ \mathrm{K\,m^{-1}} = 0.360\ \mathrm{K\ per\ hour}`;
// s21
const EQ_R1 = String.raw`\mathbf a\cdot\mathbf b = (|\mathbf a|\cos\theta)\,|\mathbf b| = |\mathbf a|\,|\mathbf b|\cos\theta`;
const EQ_R3 = String.raw`\mathbf v\cdot\hat{\mathbf x} = 6\ \mathrm{m\,s^{-1}}`;
const EQ_R4 = String.raw`W = \mathbf F\cdot\mathbf d = 50\ \mathrm J,\qquad \mathbf v\cdot\nabla T = 0.180\ \mathrm{K\ per\ hour}`;

const TEAL = HOUSE.glyphA, ORANGE = HOUSE.glyphB, ROSE = TERM.friction, INK = HOUSE.ink, MUTED = HOUSE.muted;
const GOLD = TERM.forcing, SLATE = TERM.tendency, GREY = "#5c6680", ACC = HOUSE.accent;
const col = (c: string, s: string) => `\\textcolor{${c}}{${s}}`;
const rep = (s: string, a: string, b: string) => {
  if (!s.includes(a)) throw new Error(`TeX variant: "${a}" not found`);
  return s.split(a).join(b);
};
const halves = (s: string) => s.split(String.raw`\qquad`).map((h) => h.trim().replace(/,$/, ""));

// ---------------------------------------------------------------- formatting
const minus = (s: string) => s.replace(/^-/, "−");
const fx = (v: number, d = 3) => minus(v.toFixed(d));
const fs = (v: number, d = 3) => (v > 0 && Number(v.toFixed(d)) !== 0 ? "+" : "") + minus(Math.abs(v) < 0.5 * 10 ** -d ? (0).toFixed(d) : v.toFixed(d));
const sup = (n: number) => String(n).replace("-", "⁻").replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]);
const sci = (v: number, d = 2) => {
  const e = Math.floor(Math.log10(Math.abs(v)) + 1e-12);
  return `${minus((v / 10 ** e).toFixed(d))} × 10${sup(e)}`;
};
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const FONT: React.CSSProperties = { fontFamily: HOUSE.font, color: INK };

// ---------------------------------------------------------------- numbers inside the storyboard TeX = the data
const CHECK: [string, number, number, number][] = [
  ["a·b", pair.a_dot_b, 8, 1e-9], ["|a|", pair.norm_a, 5.099, 5e-4], ["|b|", pair.norm_b, 3.162, 5e-4],
  ["θ", pair.theta_deg, 60.3, 0.05], ["cos θ", pair.cos_theta, 0.496, 5e-4], ["shadow a on b", pair.shadow_a_on_b, 2.53, 5e-4],
  ["shadow b on a", pair.shadow_b_on_a, 1.569, 5e-4], ["b̂ x", pair.b_hat[0], 0.316, 5e-4], ["b̂ y", pair.b_hat[1], 0.949, 5e-4],
  ["a·b̂", pair.a_dot_bhat, 2.53, 5e-4], ["area on b", pair.area_on_b, 8, 1e-9], ["area on a", pair.area_on_a, 8, 1e-9],
  ["v·x̂", cheap.v_dot_xhat, 6, 1e-9], ["W(5 m)", work.W_J[0], 50, 1e-9], ["W(10 m)", work.W_J[work.W_J.length - 1], 100, 1e-9],
  ["F shadow", work.shadow_N, 10, 1e-9], ["∂T/∂x", wx.dTdx_K_m, 1e-5, 1e-15], ["shadow v", wx.shadow_m_s, 5, 1e-9],
  ["v·∇T", wx.v_dot_gradT, 5e-5, 1e-12], ["K/h", wx.K_per_h, 0.18, 1e-9], ["K/h steep", wx.K_per_h_steep, 0.36, 1e-9],
  ["km/h towards warm", wx.km_per_h_towards_warm, 18, 1e-9], ["warming met", wx.warming_met_K, 0.18, 1e-9],
  ["∂T/∂t", wx.dTdt_K_h, -0.18, 1e-9], ["T pin", wx.T_pin, 13, 1e-9], ["steep ∇T", wx.gradT_steep[0], 2e-5, 1e-15],
];
for (const [n, v, ref, tol] of CHECK) if (Math.abs(v - ref) > tol) throw new Error(`data ≠ storyboard TeX: ${n} = ${v}, TeX ${ref}`);

// ---------------------------------------------------------------- drawing kit (SVG, px)
type Pt = [number, number];
const mkP = (ox: number, oy: number, u: number) => (x: number, y: number): Pt => [ox + x * u, oy - y * u];
const lerp = (p: Pt, q: Pt, t: number): Pt => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];

const Arrow: React.FC<{ p: Pt; q: Pt; color: string; w?: number; head?: number; o?: number; halo?: boolean }> = ({
  p, q, color, w = 6, head = 26, o = 1, halo = false,
}) => {
  const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
  if (L < 1 || o <= 0) return null;
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
  o <= 0 ? null :
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
  o <= 0 ? null : <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={c} strokeWidth={w} strokeDasharray={d} opacity={o} />;
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
  if (o <= 0) return null;
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
  o <= 0 ? null :
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

/** Low number-line gauge for a scalar (never an arrow in space), drawn in the free band y 950–1060 under the captions.
 * Line at y; readout above the marker; label at the left end; tick labels under the line. */
const Gauge: React.FC<{ x: number; y?: number; w: number; min: number; max: number; step: number; value: number;
  label?: string; readout?: string; o?: number; dec?: number; lc?: string; ls?: number }> = ({
  x, y = 1008, w, min, max, step, value, label, readout, o = 1, dec = 3, lc = MUTED, ls = 28,
}) => {
  if (o <= 0) return null;
  const X = (v: number) => x + ((v - min) / (max - min)) * w;
  const ticks = [];
  const k0 = Math.ceil(min / step - 1e-9), k1 = Math.floor(max / step + 1e-9);
  for (let k = k0; k <= k1; k++) {
    const v = k * step;
    ticks.push(
      <g key={k}>
        <line x1={X(v)} y1={y - (v === 0 ? 12 : 8)} x2={X(v)} y2={y + (v === 0 ? 12 : 8)} stroke={v === 0 ? INK : MUTED} strokeWidth={v === 0 ? 3 : 2} />
        <Lbl x={X(v)} y={y + 30} t={minus(String(v))} c={MUTED} s={24} a="middle" />
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
      {label ? <Lbl x={x - 20} y={y} t={label} c={lc} s={ls} a="end" /> : null}
      <polygon points={`${mx},${y + 2} ${mx - 11},${y - 18} ${mx + 11},${y - 18}`} fill={neg ? ROSE : INK} />
      <Lbl x={mx} y={y - 36} t={readout ?? fs(value, dec)} c={neg ? ROSE : INK} s={30} a="middle" b />
    </g>
  );
};

const Chip: React.FC<{ text: React.ReactNode; x: number; y: number; color?: string; size?: number; o?: number; w?: number }> = ({
  text, x, y, color = ACC, size = 30, o = 1, w,
}) => (
  o <= 0 ? null :
    <div style={{ position: "absolute", left: x, top: y, ...FONT, fontSize: size, background: HOUSE.panel, opacity: o,
      border: `2px solid ${color}`, borderRadius: 10, padding: "6px 16px", maxWidth: w ?? 1200, lineHeight: 1.25,
      boxSizing: "border-box" }}>{text}</div>
);
const Txt: React.FC<{ x: number; y: number; w?: number; s?: number; c?: string; o?: number; children: React.ReactNode;
  align?: "left" | "center" | "right"; bold?: boolean }> = ({ x, y, w = 820, s = 30, c = INK, o = 1, children, align = "left", bold }) => (
  o <= 0 ? null :
    <div style={{ position: "absolute", left: x, top: y, width: w, ...FONT, fontSize: s, color: c, opacity: o,
      textAlign: align, lineHeight: 1.28, fontWeight: bold ? 700 : 400 }}>{children}</div>
);
const DS = String.raw`\displaystyle `;
const TeX: React.FC<{ s: string; x: number; y: number; size?: number; o?: number; c?: string; w?: number; align?: "left" | "center" | "right"; d?: boolean }> = ({
  s, x, y, size = 34, o = 1, c = INK, w, align = "left", d = false,
}) => (
  o <= 0 ? null :
    <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, fontSize: size, color: c, opacity: o, whiteSpace: "nowrap" }}
      dangerouslySetInnerHTML={{ __html: tex((d ? DS : "") + s, false) }} />
);
const TeXi: React.FC<{ s: string; size?: number; c?: string; d?: boolean }> = ({ s, size = 34, c = INK, d = false }) => (
  <span style={{ fontSize: size, color: c, whiteSpace: "nowrap" }} dangerouslySetInnerHTML={{ __html: tex((d ? DS : "") + s, false) }} />
);
/** An equation centred in a box (house EqLine), with an optional plain number "(1)" at its right (36 px, muted). */
const EqBox: React.FC<{ latex: string; x: number; y: number; w: number; h?: number; size?: number; number?: string; o?: number;
  nw?: number; ring?: number }> = ({ latex, x, y, w, h = 100, size = 48, number, o = 1, nw = 90, ring = 0 }) => (
  o <= 0 ? null :
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: number ? w - nw : w, height: h }}>
        <EqLine latex={latex} size={size} y={50} />
      </div>
      {number ? <div style={{ position: "absolute", right: 0, width: nw - 10, top: "50%", transform: "translateY(-50%)",
        ...FONT, fontSize: 36, color: MUTED, textAlign: "center", lineHeight: 1.1, borderRadius: 30,
        boxShadow: ring > 0 ? `0 0 0 ${3 + 2 * ring}px rgba(79,179,191,${0.9 * ring})` : undefined }}>({number})</div> : null}
    </div>
);
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{children}</svg>
);
const Scene: React.FC<{ children: React.ReactNode; o?: number }> = ({ children, o = 1 }) => (
  <AbsoluteFill style={{ background: HOUSE.bg }}><AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill></AbsoluteFill>
);
const GridNote: React.FC<{ o?: number; y?: number; t?: string }> = ({ o = 1, y = 975, t = "1 grid square = 1 unit" }) => (
  <Txt x={40} y={y} s={28} c={MUTED} o={o}>{t}</Txt>
);
/** A row of the derivation strips (s06, s07, s18): optional tag, TeX line, the "why" under it. */
const Row: React.FC<{ x: number; y: number; w: number; tag?: string; latex: string; why?: React.ReactNode; o: number;
  size?: number; boxed?: boolean; tc?: string; d?: boolean }> = ({ x, y, w, tag, latex, why, o, size = 32, boxed = false, tc = TEAL, d = false }) => (
  o <= 0 ? null :
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: o, ...FONT }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {tag ? <div style={{ fontSize: 28, color: tc, fontWeight: 700, flex: "0 0 auto", width: 112 }}>{tag}</div> : null}
        <div style={{ border: boxed ? `3px solid ${ACC}` : "3px solid transparent", borderRadius: 10, padding: "2px 10px" }}>
          <TeXi s={latex} size={size} d={d} />
        </div>
      </div>
      {why ? <div style={{ fontSize: 28, color: MUTED, marginLeft: tag ? 126 : 0, marginTop: 2 }}>{why}</div> : null}
    </div>
);
/** The reason slots "1 · 2 · 3" (s08 large; s09–s11, s20 small in the free band at the bottom). */
const REASONS = ["same number both ways", "cheap", "physics needs both sizes"];
const Slots: React.FC<{ filled: number[]; glow?: number; big?: boolean; o?: number; fillO?: number[] }> = ({ filled, glow = -1, big = false, o = 1, fillO = [] }) => (
  o <= 0 ? null :
    <div style={{ position: "absolute", left: 1010, top: big ? 520 : 962, display: "flex", gap: 14, opacity: o, ...FONT }}>
      {[0, 1, 2].map((i) => {
        const on = filled.includes(i), fo = on ? (fillO[i] ?? 1) : 0;
        return (
          <div key={i} style={{ width: 280, height: big ? 120 : 86, border: `2px ${on ? "solid" : "dashed"} ${glow === i ? GOLD : on ? ACC : HOUSE.grid}`,
            borderRadius: 12, background: HOUSE.panel, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", boxSizing: "border-box",
            boxShadow: glow === i ? `0 0 18px rgba(216,178,58,0.6)` : undefined }}>
            <div style={{ fontSize: big ? 48 : 30, fontWeight: 700, color: on ? ACC : MUTED }}>{i + 1}</div>
            <div style={{ fontSize: 28, color: INK, opacity: fo, lineHeight: 1.1 }}>{REASONS[i]}</div>
          </div>
        );
      })}
    </div>
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

// =============================================================== the pair plane (s01–s04, s06–s08)
const P12 = mkP(380, 720, 92);
const PairBase: React.FC<{ g?: number; dim?: number; gridO?: number; bLen?: Pt; bLabel?: boolean }> = ({ g = 1, dim = 1, gridO = 1, bLen, bLabel = true }) => {
  const P = P12, O = P(0, 0), bb = bLen ?? B;
  return (
    <g>
      <Grid P={P} xr={[-3, 5]} yr={[-1, 5]} o={gridO} />
      <Dash p={P(-B[0] * 0.33, -B[1] * 0.33)} q={P(B[0] * 1.6, B[1] * 1.6)} c={ORANGE} o={0.35 * g * dim} w={2} />
      <Arrow p={O} q={P(bb[0] * g, bb[1] * g)} color={ORANGE} o={dim} />
      <Arrow p={O} q={P(A[0] * g, A[1] * g)} color={TEAL} o={dim} />
      <Lbl x={O[0] - 18} y={O[1] + 26} t="O" c={MUTED} s={30} a="end" o={dim} />
      <Lbl x={P(5.2, 1)[0]} y={P(5.2, 1)[1]} t="a" c={TEAL} s={44} b o={g * dim} />
      {bLabel ? <Lbl x={P(1.15, 3.3)[0]} y={P(1.15, 3.3)[1]} t="b" c={ORANGE} s={44} b o={g * dim} /> : null}
    </g>
  );
};
/** dotted component legs of a and b with their numbers (s02, s03); `pulse` brightens the numbers once (s03) */
const Legs: React.FC<{ oA: number; oB: number; pulse?: number }> = ({ oA, oB, pulse = 0 }) => {
  const P = P12, O = P(0, 0);
  const lo = 0.85 + 0.15 * pulse;
  return (
    <g>
      <g opacity={oA}>
        <Dash p={O} q={P(A[0], 0)} c={TEAL} w={4} d="4 8" />
        <Dash p={P(A[0], 0)} q={P(...A)} c={TEAL} w={4} d="4 8" />
        <Lbl x={P(2.5, -0.4)[0]} y={P(2.5, -0.4)[1]} t={String(A[0])} c={TEAL} s={36 + 8 * pulse} a="middle" b o={lo} />
        <Lbl x={P(5.3, 0.5)[0]} y={P(5.3, 0.5)[1]} t={String(A[1])} c={TEAL} s={36 + 8 * pulse} b o={lo} />
      </g>
      <g opacity={oB}>
        <Dash p={O} q={P(B[0], 0)} c={ORANGE} w={4} d="2 6" />
        <Dash p={P(B[0], 0)} q={P(...B)} c={ORANGE} w={4} d="4 8" />
        <Lbl x={P(0.5, -0.4)[0]} y={P(0.5, -0.4)[1]} t={String(B[0])} c={ORANGE} s={36 + 8 * pulse} a="middle" b o={lo} />
        <Lbl x={P(1.3, 1.6)[0]} y={P(1.3, 1.6)[1]} t={String(B[1])} c={ORANGE} s={36 + 8 * pulse} b o={lo} />
      </g>
    </g>
  );
};
/** length brackets |a|, |b| beside the arrows */
const LenBrackets: React.FC<{ o: number; oB?: number; values?: boolean }> = ({ o, oB, values = false }) => {
  const P = P12, off = 0.45;
  return (
    <g>
      <g opacity={o}>
        <Bracket p={P(-nR_A[0] * off, -nR_A[1] * off)} q={P(A[0] - nR_A[0] * off, A[1] - nR_A[1] * off)} off={0} c={TEAL} />
        <Lbl x={P(2.5 - nR_A[0] * 1.05, 0.5 - nR_A[1] * 1.05)[0]} y={P(2.5 - nR_A[0] * 1.05, 0.5 - nR_A[1] * 1.05)[1]}
          t={values ? `|a| = ${NA.toFixed(3)}` : "|a|"} c={TEAL} s={32} a="middle" b />
      </g>
      <g opacity={oB ?? o}>
        <Bracket p={P(nL_B[0] * off, nL_B[1] * off)} q={P(B[0] + nL_B[0] * off, B[1] + nL_B[1] * off)} off={0} c={ORANGE} />
        <Lbl x={P(B[0] * 0.5 + nL_B[0] * 0.8, B[1] * 0.5 + nL_B[1] * 0.8)[0]} y={P(B[0] * 0.5 + nL_B[0] * 0.8, B[1] * 0.5 + nL_B[1] * 0.8)[1]}
          t={values ? `|b| = ${NB.toFixed(3)}` : "|b|"} c={ORANGE} s={32} a="end" b />
      </g>
    </g>
  );
};
const PX = 1010, PW = 870; // right panel

// ---------------------------------------------------------------- s01 hook
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = 0;
  const g = ramp(f, 0, 30);
  const oCh = ramp(f, 40, 50), slide = ramp(f, 48, 70), oBox = ramp(f, 40, 52);
  const drop = ramp(f, 72, 92), oG = ramp(f, 66, 80);
  const t2 = SS(k, 1), oAg = ramp(f, t2, t2 + 12);
  const box: Pt = [1440, 400];
  const ca: Pt = lerp([1010, 190], [box[0] - 150, box[1] - 50], slide), cb: Pt = lerp([1640, 190], [box[0] + 40, box[1] - 50], slide);
  const GX = 1180, GW = 680, GY = 1008;
  const markX = GX + ((AB + 16) / 32) * GW;
  const num: Pt = lerp([box[0] + 20, box[1] + 90], [markX, GY - 36], drop);
  return (
    <Scene>
      <Svg>
        <PairBase g={g} />
        <Gauge x={GX} y={GY} w={GW} min={-16} max={16} step={4} value={AB} o={oG * ramp(f, 88, 92)} readout={AB.toFixed(0)} />
        <Lbl x={GX - 24} y={GY} t="one number, not an arrow" c={INK} s={30} o={oG} a="end" />
        <path d={`M ${box[0] - 200} ${box[1] - 110} L ${box[0] - 100} ${box[1] - 40} L ${box[0] + 140} ${box[1] - 40} L ${box[0] + 240} ${box[1] - 110}`}
          fill="none" stroke={MUTED} strokeWidth={3} opacity={oBox} />
        {drop < 1 ? <Lbl x={num[0]} y={num[1]} t={AB.toFixed(0)} s={64} b o={ramp(f, 70, 76)} a="middle" /> : null}
        <GhostArrow x={640} y={GY} len={110} o={0.9 * ramp(f, 92, 104)} />
      </Svg>
      <div style={{ position: "absolute", left: box[0] - 100, top: box[1] - 40, width: 240, height: 100, background: HOUSE.panel,
        border: `3px solid ${ACC}`, borderRadius: 14, opacity: oBox, ...FONT, fontSize: 52, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center" }}>a·b</div>
      <Chip text={`a = (${A.join(", ")})`} x={ca[0]} y={ca[1]} color={TEAL} o={oCh * (1 - ramp(f, 64, 74))} size={32} />
      <Chip text={`b = (${B.join(", ")})`} x={cb[0]} y={cb[1]} color={ORANGE} o={oCh * (1 - ramp(f, 64, 74))} size={32} />
      <Chip text={"1 · what it is     2 · why it’s built this way"} x={1010} y={700} o={oAg} size={32} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s02 arrows and components
const S02: React.FC = () => {
  const f = useCurrentFrame(), k = 1;
  const t1 = SS(k, 1), t1b = AT(k, 1, "vector b goes"), t2 = SS(k, 2), t2b = AT(k, 2, "one and three are"), t3 = SS(k, 3);
  const oA = ramp(f, t1, t1 + 15), oB = ramp(f, t1b, t1b + 15);
  const oCa = ramp(f, t2, t2 + 12), oCb = ramp(f, t2b, t2b + 12), oPy = ramp(f, t3, t3 + 15), oPy2 = ramp(f, t3 + 30, t3 + 45);
  const oBars = ramp(f, AT(k, 3, "written with straight bars"), AT(k, 3, "written with straight bars") + 12);
  const P = P12;
  return (
    <Scene>
      <Svg>
        <PairBase />
        <Legs oA={oA} oB={oB} />
        <g opacity={oPy}>
          <RightTick at={P(A[0], 0)} u1={[-1, 0]} u2={[0, -1]} />
          <RightTick at={P(B[0], 0)} u1={[-1, 0]} u2={[0, -1]} />
        </g>
        <LenBrackets o={oPy} oB={oPy2} />
      </Svg>
      <Chip text="vector = an arrow: a length and a direction" x={60} y={168} o={ramp(f, 6, 18)} />
      <Chip text={<>5 and 1 are the <b>components</b> of vector a:&nbsp; <b>a = (5, 1)</b></>} x={PX} y={200} color={TEAL} o={oCa} w={PW} />
      <Chip text={<>1 and 3 are the <b>components</b> of vector b:&nbsp; <b>b = (1, 3)</b></>} x={PX} y={290} color={ORANGE} o={oCb} w={PW} />
      <Txt x={PX} y={370} w={PW} s={28} c={MUTED} o={oCb}>component = how far the arrow reaches along one axis</Txt>
      <Txt x={PX} y={460} w={PW} s={38} c={TEAL} o={oPy} bold>|a| = √(5² + 1²) = √{pair.norm_a_sq.toFixed(0)} = {NA.toFixed(3)}</Txt>
      <Txt x={PX} y={530} w={PW} s={38} c={ORANGE} o={oPy2} bold>|b| = √(1² + 3²) = √{pair.norm_b_sq.toFixed(0)} = {NB.toFixed(3)}</Txt>
      <Txt x={PX} y={610} w={PW} s={28} c={MUTED} o={oPy}>Pythagoras: length² = (x-part)² + (y-part)²</Txt>
      <Chip text="|a| (two straight bars) = the length of a" x={PX} y={680} o={oBars} />
      <GridNote />
    </Scene>
  );
};

// ---------------------------------------------------------------- s03 definition 1 (with the worked example)
const EQ_DEF3_FLAT = rep(EQ_DEF3, "+ a_3b_3", col(GREY, String.raw`\cancel{+ a_3b_3}`));
const DEF2_TAIL = rep(EQ_DEF2N.slice(EQ_DEF2N.indexOf("= 5")), "= 8", "= 5 + 3 = 8");
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = 2;
  const t1 = SS(k, 1), tFlat = AT(k, 1, "our flat arrows"), t2 = SS(k, 2), t2b = AT(k, 2, "the second"), t3 = SS(k, 3);
  const oChip = ramp(f, 4, 16), oEq = ramp(f, t1, t1 + 12), flat = ramp(f, tFlat, tFlat + 12), oL2 = ramp(f, tFlat + 18, tFlat + 32);
  const oT1 = ramp(f, t2, t2 + 12), oT2 = ramp(f, t2b, t2b + 12), oW = ramp(f, t3, t3 + 14), oG = ramp(f, AT(k, 3, "eight, one number"), AT(k, 3, "eight, one number") + 12);
  const pulse = Math.sin(Math.PI * clamp((f - t2) / 24, 0, 1)) + Math.sin(Math.PI * clamp((f - t2b) / 24, 0, 1));
  const tag = (o: number, a: string, b: string, cap: string) => (
    <div style={{ opacity: o, textAlign: "center", border: `2px solid ${o > 0 ? GOLD : "transparent"}`, borderRadius: 10, padding: "4px 10px", marginTop: 6 }}>
      <div style={{ fontSize: 38, fontWeight: 700 }}><span style={{ color: TEAL }}>{a}</span>&nbsp;&nbsp;<span style={{ color: ORANGE }}>{b}</span></div>
      <div style={{ fontSize: 26, color: GOLD }}>{cap}</div>
    </div>
  );
  return (
    <Scene>
      <Svg>
        <PairBase />
        <Legs oA={1} oB={1} pulse={clamp(pulse, 0, 1)} />
        <Gauge x={1080} w={740} min={-16} max={16} step={4} value={AB} o={oG} readout={AB.toFixed(0)} />
        <GhostArrow x={1700} y={750} len={110} o={0.9 * oG} />
      </Svg>
      <Chip text="multiply matching components, then add" x={PX} y={170} o={oChip} />
      <EqBox latex={flat > 0.5 ? EQ_DEF3_FLAT : EQ_DEF3} x={PX - 30} y={240} w={PW + 30} h={90} size={52} o={oEq} />
      <Txt x={PX} y={330} w={PW} s={26} c={MUTED} o={oEq * (1 - flat)} align="center">arrows in space: 3 components</Txt>
      <Txt x={PX} y={330} w={PW} s={26} c={MUTED} o={flat} align="center">our flat arrows: 2 components</Txt>
      <div style={{ position: "absolute", left: PX + 60, top: 395, display: "flex", alignItems: "flex-start", gap: 18, opacity: oL2, ...FONT }}>
        <div style={{ paddingTop: 6 }}><TeXi s={String.raw`\mathbf a\cdot\mathbf b =`} size={52} /></div>
        <div>{<div style={{ paddingTop: 6, textAlign: "center" }}><TeXi s="a_1b_1" size={52} /></div>}{tag(oT1, `a₁ = ${A[0]}`, `b₁ = ${B[0]}`, "first components")}</div>
        <div style={{ paddingTop: 6 }}><TeXi s="+" size={52} /></div>
        <div>{<div style={{ paddingTop: 6, textAlign: "center" }}><TeXi s="a_2b_2" size={52} /></div>}{tag(oT2, `a₂ = ${A[1]}`, `b₂ = ${B[1]}`, "second components")}</div>
      </div>
      <TeX s={DEF2_TAIL} x={PX + 60} y={640} size={46} o={oW} />
      <Txt x={PX + 60} y={730} w={600} s={30} o={oG} c={INK}>a·b = {AB.toFixed(0)}: one number, not an arrow</Txt>
      <GridNote />
    </Scene>
  );
};

// ---------------------------------------------------------------- s04 definition 2: (1)
const CosDial: React.FC<{ o: number; oMark: number }> = ({ o, oMark }) => {
  if (o <= 0) return null;
  const y = 520, X = (c: number) => 1130 + (c + 1) * 320;
  const cr = pair.cos_reminder;
  const mini = (key: "0" | "90" | "180") => {
    const c = cr[key].cos, q = cr[key].q as Pt, U = 26, O: Pt = [X(c) - (key === "180" ? -10 : 30), 440];
    return (
      <g key={key}>
        <Arrow p={O} q={[O[0] + 3 * U, O[1]]} color={TEAL} w={5} head={16} />
        <Arrow p={O} q={[O[0] + q[0] * U, O[1] - q[1] * U]} color={ORANGE} w={key === "0" ? 10 : 5} head={16} o={key === "0" ? 0.8 : 1} />
        <line x1={X(c)} y1={y - 10} x2={X(c)} y2={y + 10} stroke={INK} strokeWidth={3} />
        <Lbl x={X(c)} y={y + 34} t={`cos ${cr[key].theta_deg.toFixed(0)}° = ${fx(c, 0)}`} s={28} a="middle" />
      </g>
    );
  };
  return (
    <g opacity={o}>
      <rect x={PX} y={340} width={PW} height={240} rx={14} fill={HOUSE.panel} />
      <Lbl x={PX + 20} y={366} t="cos θ depends only on the angle" c={MUTED} s={28} />
      <line x1={X(-1)} y1={y} x2={X(1)} y2={y} stroke={MUTED} strokeWidth={4} />
      {mini("180")}{mini("90")}{mini("0")}
      <g opacity={oMark}>
        <polygon points={`${X(pair.cos_theta)},${y - 4} ${X(pair.cos_theta) - 10},${y - 22} ${X(pair.cos_theta) + 10},${y - 22}`} fill={ACC} />
        <Lbl x={X(pair.cos_theta)} y={y - 40} t={`${pair.cos_theta.toFixed(3)}`} c={ACC} s={28} a="middle" b />
      </g>
    </g>
  );
};
const COSN = ((parts) => [`= ${parts[0]}`, `= ${parts[1]} = ${parts[2]}`])(EQ_COSN.replace(/^= /, "").split(" = ")); // EQ_COSN on two lines
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = 3;
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3);
  const oA = ramp(f, 4, 16), oCos = ramp(f, t1, t1 + 14), oN = ramp(f, t2, t2 + 14), oR = ramp(f, t3, t3 + 12);
  const ring = oR * (0.75 + 0.25 * Math.sin(Math.PI * clamp((f - t3) / 30, 0, 1)));
  const P = P12;
  return (
    <Scene>
      <Svg>
        <PairBase />
        <LenBrackets o={0.55 + 0.45 * oA} values />
        <g opacity={oA}>
          <Arc P={P} a0={PHI_A} a1={PHI_B} r={0.8} />
          <Lbl x={P(0.62, 0.72)[0]} y={P(0.62, 0.72)[1]} t="θ" s={34} b />
        </g>
        <CosDial o={oCos} oMark={oN} />
        <Gauge x={1080} w={740} min={-16} max={16} step={4} value={AB} readout={AB.toFixed(3)} />
      </Svg>
      <Chip text={`θ = ${TH.toFixed(1)}°, the angle between the arrows`} x={60} y={168} o={oA} />
      <EqBox latex={EQ_COS} x={PX - 20} y={190} w={PW + 20} h={110} size={52} number="1" o={oA} ring={ring} />
      <Txt x={PX} y={300} w={PW} s={26} c={ACC} o={oR} align="right">equation (1): we use it in a moment</Txt>
      <TeX s={COSN[0]} x={PX + 40} y={600} size={36} o={oN} />
      <TeX s={COSN[1]} x={PX + 40} y={656} size={36} o={oN} />
      <Txt x={PX} y={730} w={PW} s={34} c={ACC} o={oN} bold>two recipes, one number</Txt>
      <GridNote />
    </Scene>
  );
};

// ---------------------------------------------------------------- s05 the angle sets the sign
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = 4;
  const tQ = AT(k, 0, "only q turns"), tP = [SS(k, 1), SS(k, 2), SS(k, 3)], t4 = SS(k, 4);
  const oBig = ramp(f, 4, 18), fly = ramp(f, tQ, tQ + 30);
  const U = 70, OY = 610;
  const p = same.p as Pt;
  const caps = ["same direction: positive", "right angle: zero", "opposite directions: negative"];
  const lines = ["3 × 2 + 0 × 0", "3 × 0 + 0 × 2", "3 × (−2) + 0 × 0"];
  const BIG = { o: [130, 255] as Pt, u: 90 };
  return (
    <Scene o={ramp(f, 0, 10)}>
      <Svg>
        {[0, 1, 2].map((i) => {
          const x0 = 120 + i * 570, O: Pt = [x0 + 220, OY], P = mkP(O[0], O[1], U);
          const oq = ramp(f, tP[i], tP[i] + 14);
          const q = same.q[i] as Pt, d = same.p_dot_q[i], nq = same.norm_q[i], sh = same.shadow_p_on_q[i];
          const qh: Pt = [q[0] / nq, q[1] / nq], kq0: Pt = [-qh[1] * nq, qh[0] * nq];
          const kq: Pt = kq0[1] < 0 ? [-kq0[0], -kq0[1]] : kq0; // the rectangle's height |q| drawn on the upper side
          const foot: Pt = [sh * qh[0], sh * qh[1]];
          const rect: Pt[] = [O, P(...foot), P(foot[0] + kq[0], foot[1] + kq[1]), P(kq[0], kq[1])];
          // the copy of p flies from the big p at the top into this panel
          const pO = lerp(BIG.o, O, fly), pu = BIG.u + (U - BIG.u) * fly;
          return (
            <g key={i}>
              <g opacity={fly}>
                <rect x={x0} y={360} width={540} height={400} rx={14} fill="none" stroke={HOUSE.grid} strokeWidth={2} />
                <Grid P={P} xr={[-3, 4]} yr={[-1, 3]} o={0.7} />
              </g>
              <g opacity={oq}>
                {Math.abs(d) > 1e-9 ? <ProdRect pts={rect} neg={d < 0} id={`h5${i}`} /> : null}
                <Arrow p={O} q={P(...q)} color={ORANGE} w={i === 0 ? 14 : 6} head={i === 0 ? 34 : 26} />
                {i === 0 ? <Lbl x={P(-0.5, 0.4)[0]} y={P(-0.5, 0.4)[1]} t="0°" s={30} a="middle" b /> : null}
                {i === 1 ? <><RightTick at={O} u1={[1, 0]} u2={[0, -1]} s={22} /><Lbl x={O[0] + 40} y={O[1] - 40} t="90°" s={30} b /></> : null}
                {i === 2 ? <><Arc P={P} a0={0} a1={180} r={0.6} /><Lbl x={O[0]} y={O[1] - 66} t="180°" s={30} a="middle" b /></> : null}
                <Lbl x={P(q[0] * 1.12 + (q[0] === 0 ? 0.35 : 0), q[1] * 1.12 + (q[1] === 0 ? (i === 0 ? 0.45 : 0.4) : 0))[0]}
                  y={P(q[0] * 1.12 + (q[0] === 0 ? 0.35 : 0), q[1] * 1.12 + (q[1] === 0 ? (i === 0 ? 0.45 : 0.4) : 0))[1]}
                  t="q" c={ORANGE} s={40} b a="middle" />
                <Lbl x={x0 + 270} y={392} t={`q = (${q.map((v) => fx(v, 0)).join(", ")})`} s={28} a="middle" c={MUTED} />
                <Lbl x={x0 + 270} y={706} t={`p·q = ${lines[i]} = ${fs(d, 0)}`} s={32} a="middle" b c={d < 0 ? ROSE : INK} />
                <Lbl x={x0 + 270} y={744} t={caps[i]} s={28} a="middle" c={d < 0 ? ROSE : ACC} />
              </g>
              {fly > 0 ? <g>
                <Arrow p={pO} q={[pO[0] + p[0] * pu, pO[1]]} color={TEAL} w={i === 0 ? 7 : 7} head={26} />
                <Lbl x={pO[0] + p[0] * pu + 14} y={pO[1] - 26} t="p" c={TEAL} s={36} b />
                <Lbl x={pO[0] + p[0] * pu * 0.5} y={pO[1] + 30} t="same p" c={TEAL} s={24} a="middle" o={fly * (i === 0 ? 0 : 1)} />
              </g> : null}
              <Gauge x={x0 + 70} w={420} min={-8} max={8} step={4} value={d} readout={`p·q = ${fs(d, 0)}`} dec={0} o={oq} />
            </g>
          );
        })}
        {/* the large p, alone at the top centre before it is copied */}
        <g opacity={oBig}>
          <Arrow p={BIG.o} q={[BIG.o[0] + p[0] * BIG.u, BIG.o[1]]} color={TEAL} w={12} head={36} />
          <Lbl x={BIG.o[0] + p[0] * BIG.u + 20} y={BIG.o[1] - 28} t="p" c={TEAL} s={52} b />
          <Lbl x={BIG.o[0] + p[0] * BIG.u * 0.5} y={BIG.o[1] + 36} t="p = (3, 0), fixed" c={TEAL} s={28} a="middle" />
        </g>
      </Svg>
      <Chip text="p stays the same in all three pictures" x={1100} y={170} color={TEAL} o={oBig * (1 - ramp(f, t4 - 10, t4))} />
      <Chip text="only q turns" x={1100} y={236} color={ORANGE} o={ramp(f, tQ, tQ + 12) * (1 - ramp(f, t4 - 10, t4))} />
      <Txt x={480} y={228} w={1400} s={40} c={ACC} o={ramp(f, t4, t4 + 14)} align="center" bold>a·b measures how much two arrows point the same way</Txt>
    </Scene>
  );
};

// ---------------------------------------------------------------- s06 the shadow, step by step
const ROW6 = [
  { line: String.raw`\cos\theta = \dfrac{\text{shadow}}{|\mathbf a|}`, why: "in a right triangle, cos θ = side next to θ ÷ long side" },
  { line: String.raw`\text{shadow} = |\mathbf a|\cos\theta`, why: "multiply both sides by |a|" },
  { line: String.raw`\dfrac{\mathbf a\cdot\mathbf b}{|\mathbf b|} = \dfrac{|\mathbf a|\,|\mathbf b|\cos\theta}{|\mathbf b|}`, why: "divide both sides of (1) by |b|" },
];
const ROW6_3_CANCEL = String.raw`\dfrac{\mathbf a\cdot\mathbf b}{|\mathbf b|} = \dfrac{|\mathbf a|\,${col(ROSE, String.raw`\cancel{|\mathbf b|}`)}\cos\theta}{${col(ROSE, String.raw`\cancel{|\mathbf b|}`)}}`;
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = 5;
  const t = [0, 1, 2, 3, 4].map((j) => SS(k, j));
  const tR2 = AT(k, 2, "is its length"), tCancel = AT(k, 4, "It cancels"), tLeft = AT(k, 4, "leaving the shadow"), tNum = AT(k, 4, "or two point five three");
  const P = P12, O = P(0, 0), aTip = P(...A), foot = P(...PAB);
  const drop = ramp(f, t[0] + 6, t[0] + 36), band = ramp(f, t[1], t[1] + 20), tri = ramp(f, t[2], t[2] + 15);
  const at = [t[2] + 10, tR2, t[3], tLeft];
  const oR = at.map((a) => ramp(f, a, a + 12));
  const lit = ramp(f, t[3], t[3] + 10) * (1 - ramp(f, t[4], t[4] + 10));
  const shLabel = f >= tNum ? `shadow = ${SHAB.toFixed(3)}` : "shadow of a on b";
  const X = 980, W = 900;
  return (
    <Scene>
      <Svg>
        <polygon points={[O, foot, aTip].map((p) => p.join(",")).join(" ")} fill={TEAL} fillOpacity={0.14 * tri} />
        <PairBase />
        <Band p={O} q={lerp(O, foot, band)} color={TEAL} o={band > 0 ? 1 : 0} />
        {drop > 0 ? <Dash p={aTip} q={lerp(aTip, foot, drop)} /> : null}
        {drop > 0.99 ? <RightTick at={foot} u1={unit(foot, O)} u2={unit(foot, aTip)} /> : null}
        <Lbl x={P(-0.25, 1.2)[0]} y={P(-0.25, 1.2)[1]} t={shLabel} c={TEAL} s={32} a="end" b o={band} />
        <g opacity={tri}>
          <Arc P={P} a0={PHI_A} a1={PHI_B} r={0.7} />
          <Lbl x={P(0.85, 0.75)[0]} y={P(0.85, 0.75)[1]} t="θ" s={34} />
          <Lbl x={P(-0.25, 1.2)[0]} y={P(-0.25, 1.2)[1] + 40} t="side next to θ = shadow" c={TEAL} s={26} a="end" />
          <Lbl x={P(3.2, 0.25)[0]} y={P(3.2, 0.25)[1] + 46} t={`long side = |a| = ${NA.toFixed(3)}`} c={TEAL} s={28} a="middle" />
        </g>
      </Svg>
      <Txt x={X} y={160} w={W} s={30} c={ACC} bold>Computing the shadow of a on b</Txt>
      <div style={{ position: "absolute", left: X, top: 206, display: "flex", alignItems: "center", gap: 14, ...FONT }}>
        <div style={{ fontSize: 30, width: 112, color: lit > 0 ? ACC : MUTED, fontWeight: 700,
          boxShadow: lit > 0 ? `0 0 0 ${2 + 3 * lit}px rgba(79,179,191,${0.8 * lit})` : undefined, borderRadius: 20, textAlign: "center" }}>(1)</div>
        <TeXi s={EQ_COS} size={32} c={MUTED} />
      </div>
      {ROW6.map((r, i) => (
        <Row key={i} x={X} y={[270, 398, 516][i]} w={W} tag="shadow:" latex={i === 2 && f >= tCancel ? ROW6_3_CANCEL : r.line}
          why={i === 2 ? <>divide both sides of <span style={{ color: lit > 0 ? ACC : MUTED, fontWeight: lit > 0 ? 700 : 400 }}>(1)</span> by |b|</> : r.why}
          o={oR[i]} />
      ))}
      <Row x={X} y={660} w={W} tag="shadow:" latex={EQ_SHADOW} d why="|b| cancels on the right; then our numbers" o={oR[3]} boxed size={30} />
      <GridNote />
    </Scene>
  );
};

// ---------------------------------------------------------------- s07 the unit vector b̂
const EQ_BHAT_COL = rep(rep(EQ_BHAT, String.raw`\frac{1}{3.162}`, String.raw`\frac{${col(ORANGE, "1")}}{${col(ORANGE, "3.162")}}`),
  String.raw`\frac{3}{3.162}`, String.raw`\frac{${col(ORANGE, "3")}}{${col(ORANGE, "3.162")}}`);
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = 6;
  const t = [0, 1, 2, 3, 4].map((j) => SS(k, j));
  const tShrink = AT(k, 0, "divide b by its own length");
  const n = cheap.scales.length - 1;
  const kk = Math.round(clamp((f - tShrink) / 45, 0, 1) * n);
  const bk = cheap.b_series[kk] as Pt, shrunk = kk === n;
  const oDef = ramp(f, t[1], t[1] + 12), oR1 = ramp(f, t[2], t[2] + 12), oR2 = ramp(f, t[3], t[3] + 12), oR3 = ramp(f, t[4], t[4] + 12);
  const oSum = ramp(f, Math.min(SE(k, 4) + 6, LEN(k) - 40), Math.min(SE(k, 4) + 18, LEN(k) - 28));
  const P = P12, O = P(0, 0), foot = P(...PAB), aTip = P(...A);
  const X = 980, W = 900;
  return (
    <Scene>
      <Svg>
        <PairBase bLen={bk} bLabel={kk === 0} />
        {kk > 0 && !shrunk ? <Arrow p={O} q={P(...B)} color={ORANGE} o={0.25} w={4} /> : null}
        <Band p={O} q={foot} color={TEAL} />
        <Dash p={aTip} q={foot} o={0.6} />
        <Lbl x={P(-0.3, 2.0)[0]} y={P(-0.3, 2.0)[1]} t={`shadow = ${cheap.shadow_series[kk].toFixed(3)}`} c={TEAL} s={32} a="end" b />
        {shrunk ? <Lbl x={P(...BH)[0] + 16} y={P(...BH)[1] - 14} t="b̂" c={ORANGE} s={40} b /> : null}
        <g opacity={oDef}>
          <Bracket p={P(nL_B[0] * 0.35, nL_B[1] * 0.35)} q={P(BH[0] + nL_B[0] * 0.35, BH[1] + nL_B[1] * 0.35)} off={0} c={ORANGE} />
          <Lbl x={P(BH[0] * 0.5 + nL_B[0] * 0.7, BH[1] * 0.5 + nL_B[1] * 0.7)[0]} y={P(BH[0] * 0.5 + nL_B[0] * 0.7, BH[1] * 0.5 + nL_B[1] * 0.7)[1]}
            t="1" c={ORANGE} s={28} a="end" b />
        </g>
        <g opacity={oR1}>
          <Dash p={O} q={P(BH[0], 0)} c={ORANGE} w={3} d="3 6" />
          <Dash p={P(BH[0], 0)} q={P(...BH)} c={ORANGE} w={3} d="3 6" />
          <Lbl x={P(BH[0], 0)[0] + 6} y={P(BH[0], 0)[1] + 30} t={BH[0].toFixed(3)} c={ORANGE} s={26} a="middle" />
          <Lbl x={P(BH[0], BH[1] * 0.5)[0] + 12} y={P(BH[0], BH[1] * 0.5)[1]} t={BH[1].toFixed(3)} c={ORANGE} s={26} />
        </g>
      </Svg>
      <Chip text={<>b̂ (“b hat”) = b ÷ |b|</>} x={60} y={168} color={ORANGE} o={ramp(f, tShrink + 30, tShrink + 45)} />
      <Chip text={<>unit vector b̂: length 1, same direction as b&nbsp;&nbsp;(|b̂| = 1)</>} x={60} y={236} color={ORANGE} o={oDef} size={28} />
      <Txt x={X} y={160} w={W} s={30} c={ACC} bold>The same shadow, another way</Txt>
      <Row x={X} y={210} w={W} latex={EQ_BHAT_COL} o={oR1} size={32} d />
      <Row x={X} y={326} w={W} latex={EQ_ADBH} why="dividing b by a number divides the dot product by it too" o={oR2} size={32} d />
      <Row x={X} y={480} w={W} tag="shadow:" latex={EQ_SHBH} o={oR3} boxed size={30} />
      <Txt x={X + 126} y={540} w={W - 126} s={28} c={ACC} o={oR3}>✓ same shadow as before: {pair.a_dot_bhat.toFixed(3)}</Txt>
      <EqBox latex={EQ_SUM7} x={X} y={610} w={W} h={120} size={40} o={oSum} />
      <GridNote />
    </Scene>
  );
};

// ---------------------------------------------------------------- s08 the question (Part 2 opener)
const EQ_Q8_BOX = rep(EQ_Q8, String.raw`(|\mathbf a|\cos\theta)\,|\mathbf b|`,
  String.raw`${col(TEAL, String.raw`\boxed{(|\mathbf a|\cos\theta)}`)}\,${col(ORANGE, String.raw`\boxed{|\mathbf b|}`)}`);
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = 7;
  const c0 = PART_CARD_FRAMES;
  const dim = partCardDim(f);
  const grow = ramp(f, c0 + 4, c0 + 34), oEq = ramp(f, c0, c0 + 14), t1 = SS(k, 1), t2 = SS(k, 2);
  const oQ = ramp(f, Math.max(t1, c0 + 20), Math.max(t1, c0 + 20) + 12), oS = ramp(f, Math.max(t2, c0 + 30), Math.max(t2, c0 + 30) + 12);
  const P = P12, O = P(0, 0), foot = P(...PAB);
  const kb = pair.k_cross_b as Pt;
  const rect: Pt[] = [O, foot, P(PAB[0] + kb[0] * grow, PAB[1] + kb[1] * grow), P(kb[0] * grow, kb[1] * grow)];
  return (
    <AbsoluteFill style={{ background: HOUSE.bg }}>
      <AbsoluteFill style={{ opacity: dim }}>
        <Svg>
          <PairBase />
          {grow > 0 ? <ProdRect pts={rect} neg={false} id="h8" /> : null}
          <Band p={O} q={foot} color={TEAL} />
          <Bracket p={P(-nL_B[0] * 0.35 + kb[0] * 0, -nL_B[1] * 0.35)} q={P(B[0] - nL_B[0] * 0.35, B[1] - nL_B[1] * 0.35)} off={0} c={ORANGE} o={0} />
          <Lbl x={262} y={548} t={`area = ${SHAB.toFixed(3)} × ${NB.toFixed(3)}`} s={27} a="middle" b o={grow} />
          <Lbl x={262} y={584} t={`= ${pair.area_on_b.toFixed(3)} = a·b`} s={27} a="middle" b o={grow} />
          <Lbl x={P(0.5, 0.5)[0] + 34} y={P(0.5, 0.5)[1] + 22} t="shadow" c={TEAL} s={28} />
        </Svg>
        <EqBox latex={EQ_Q8_BOX} x={PX - 60} y={180} w={PW + 60} h={110} size={38} o={oEq} />
        <Txt x={PX} y={300} w={PW} s={28} o={oEq} align="center"><span style={{ color: TEAL }}>■ the shadow</span>&nbsp;&nbsp;&nbsp;<span style={{ color: ORANGE }}>■ the length of b</span></Txt>
        <Txt x={PX} y={380} w={PW} s={40} c={ACC} o={oQ} bold>Why multiply by |b|? Why not stop at the shadow?</Txt>
        <Slots filled={[]} big o={oS} />
        <GridNote />
      </AbsoluteFill>
      <PartCard f={f} name="Part 2 · Why times the other length?" subtitle="three reasons" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- s09 reason 1: order
const U9 = 50;
const PL9 = mkP(380, 470, U9), PR9 = mkP(1330, 325, U9);
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = 8;
  const t1 = SS(k, 1), t1b = AT(k, 1, "of b on arrow a"), t2 = SS(k, 2);
  const dL = ramp(f, t1, t1 + 15), sL = ramp(f, t1 + 12, t1 + 30), dR = ramp(f, t1b, t1b + 15), sR = ramp(f, t1b + 12, t1b + 30);
  const grow = ramp(f, t2, t2 + 18), oSum = ramp(f, t2 + 24, t2 + 38), oSum2 = ramp(f, t2 + 40, t2 + 54);
  const Plane: React.FC<{ P: (x: number, y: number) => Pt; caster: "a" | "b" }> = ({ P, caster }) => {
    const O = P(0, 0);
    const casterV = caster === "a" ? A : B, ontoV = caster === "a" ? B : A;
    const proj = caster === "a" ? PAB : PBA;
    const d = caster === "a" ? dL : dR, s = caster === "a" ? sL : sR;
    const cTip = P(...casterV), foot = P(...proj);
    const cc = caster === "a" ? TEAL : ORANGE;
    const rc = (caster === "a" ? pair.rect_on_b : pair.rect_on_a) as Pt[];
    const rect: Pt[] = [P(...rc[0]), P(...rc[1]), lerp(P(...rc[1]), P(...rc[2]), grow), lerp(P(...rc[0]), P(...rc[3]), grow)];
    return (
      <g>
        <Grid P={P} xr={caster === "a" ? [-3, 5] : [-1, 6]} yr={caster === "a" ? [-1, 4] : [-5, 3]} o={0.8} />
        {grow > 0 ? <ProdRect pts={rect} neg={false} id={`h9${caster}`} /> : null}
        <Dash p={P(-ontoV[0] * 0.3, -ontoV[1] * 0.3)} q={P(ontoV[0] * 1.3, ontoV[1] * 1.3)} c={caster === "a" ? ORANGE : TEAL} o={0.35} w={2} />
        <Band p={O} q={lerp(O, foot, s)} color={cc} o={s > 0 ? 1 : 0} />
        <Arrow p={O} q={P(...B)} color={ORANGE} w={5} head={20} />
        <Arrow p={O} q={P(...A)} color={TEAL} w={5} head={20} />
        {d > 0 ? <Dash p={cTip} q={lerp(cTip, foot, d)} /> : null}
        {s > 0.99 ? <RightTick at={foot} u1={unit(foot, O)} u2={unit(foot, cTip)} s={12} /> : null}
        <Lbl x={P(5.25, 1)[0]} y={P(5.25, 1)[1] - 4} t="a" c={TEAL} s={36} b />
        <Lbl x={P(1.2, 3.1)[0]} y={P(1.2, 3.1)[1]} t="b" c={ORANGE} s={36} b />
      </g>
    );
  };
  return (
    <Scene>
      <Svg>
        <Plane P={PL9} caster="a" />
        <Plane P={PR9} caster="b" />
        <rect x={50} y={590} width={900} height={215} rx={12} fill={HOUSE.panel} opacity={dL} />
        <rect x={975} y={590} width={900} height={215} rx={12} fill={HOUSE.panel} opacity={dR} />
      </Svg>
      <TeX s={EQ_SH_AB} x={70} y={602} size={27} o={dL} c={TEAL} d />
      <TeX s={EQ_SH_BA} x={995} y={602} size={27} o={dR} c={ORANGE} d />
      <Txt x={70} y={716} w={860} s={30} o={grow}>{SHAB.toFixed(3)} × |b| = {SHAB.toFixed(3)} × {NB.toFixed(3)} = <b>{pair.area_on_b.toFixed(3)}</b></Txt>
      <Txt x={995} y={716} w={860} s={30} o={grow}>{SHBA.toFixed(3)} × |a| = {SHBA.toFixed(3)} × {NA.toFixed(3)} = <b>{pair.area_on_a.toFixed(3)}</b></Txt>
      <Chip text="two different shadows" x={760} y={500} color={MUTED} o={dR * (1 - oSum)} size={28} />
      <div style={{ position: "absolute", left: 640, top: 175, width: 560, textAlign: "center", opacity: oSum, ...FONT }}>
        <div style={{ fontSize: 30, fontWeight: 700 }}>area {AB.toFixed(3)} both ways</div>
        <div style={{ marginTop: 8 }}><TeXi s={EQ_TRAY} size={28} /></div>
      </div>
      <EqBox latex={EQ_SYM} x={640} y={320} w={560} h={80} size={46} o={oSum2} />
      <Chip text="with the length in, the order doesn’t matter" x={700} y={420} w={440} size={26} o={oSum2} />
      <Slots filled={[0]} fillO={[oSum2]} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s10 reason 2: cheap; a unit vector picks out a part
const Card: React.FC<{ x: number; y: number; w: number; title: string; tc: string; lines: React.ReactNode[]; o?: number; dim?: boolean }> = ({
  x, y, w, title, tc, lines, o = 1, dim = false,
}) => (
  o <= 0 ? null :
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 330, background: HOUSE.panel, borderRadius: 14,
      border: `2px solid ${tc}`, padding: "14px 24px", boxSizing: "border-box", ...FONT, opacity: o, color: dim ? MUTED : INK }}>
      <div style={{ fontSize: 40, fontWeight: 700, color: tc }}>{title}</div>
      {lines.map((l, i) => <div key={i} style={{ fontSize: 32, marginTop: 10 }}>{l}</div>)}
    </div>
);
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = 9;
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3);
  const o0 = ramp(f, 6, 18), wind = ramp(f, t1, t1 + 15), oX = ramp(f, t2, t2 + 14), oSh = ramp(f, t3, t3 + 18);
  const PWm = mkP(300, 760, 50);
  const v = cheap.v as Pt, Ow = PWm(0, 0), vT = PWm(...v), vx = PWm(cheap.v_dot_xhat, 0);
  return (
    <Scene>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - wind }}>
        <Card x={160} y={250} w={760} title="a·b" tc={TEAL} o={o0}
          lines={[`${A[0]} × ${B[0]} + ${A[1]} × ${B[1]} = ${AB.toFixed(0)}  ✓`, "two multiplications, one addition", "no angle, no square root"]} />
        <Card x={1000} y={250} w={760} title="the angle way" tc={MUTED} o={o0} dim
          lines={[`θ = ${TH.toFixed(1)}°, cos θ, |a|, |b|`, "square roots and a cosine"]} />
      </div>
      {wind > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: wind }}>
          <Svg>
            <Grid P={PWm} xr={[-2, 10]} yr={[0, 10]} />
            <Band p={Ow} q={lerp(Ow, vx, oSh)} color={TEAL} o={oSh > 0 ? 1 : 0} w={20} />
            {oSh > 0 ? <><Dash p={vT} q={vx} o={oSh} /><RightTick at={vx} u1={unit(vx, Ow)} u2={unit(vx, vT)} o={oSh} /></> : null}
            <Dash p={Ow} q={PWm(v[0], 0)} c={TEAL} w={4} d="4 8" o={1 - oSh} />
            <Dash p={PWm(v[0], 0)} q={vT} c={TEAL} w={4} d="4 8" />
            <Lbl x={PWm(3, -0.55)[0]} y={PWm(3, -0.55)[1]} t="6 m/s east" c={TEAL} s={28} a="middle" b />
            <Lbl x={PWm(6.25, 4)[0]} y={PWm(6.25, 4)[1]} t="8 m/s north" c={TEAL} s={28} b />
            <Arrow p={Ow} q={vT} color={TEAL} w={7} />
            <Arrow p={Ow} q={PWm(1, 0)} color={ORANGE} w={8} head={22} o={oX} />
            <Lbl x={PWm(0.5, 0.55)[0]} y={PWm(0.5, 0.55)[1]} t="x̂" c={ORANGE} s={34} b a="middle" o={oX} />
            <Lbl x={PWm(10, -0.55)[0]} y={PWm(10, -0.55)[1]} t="east →" c={MUTED} s={28} a="end" />
            <Lbl x={PWm(-0.3, 9.7)[0]} y={PWm(-0.3, 9.7)[1]} t="north ↑" c={MUTED} s={28} a="end" />
            <Lbl x={PWm(5.3, 8)[0]} y={PWm(5.3, 8)[1] - 22} t="wind v = (6, 8):" c={TEAL} s={30} a="end" b />
            <Lbl x={PWm(5.3, 8)[0]} y={PWm(5.3, 8)[1] + 16} t="6 m/s eastward, 8 m/s northward" c={TEAL} s={28} a="end" />
          </Svg>
          <Txt x={PX} y={200} w={PW} s={32} c={ORANGE} o={oX}><b>x̂ = (1, 0)</b>: the unit vector pointing east —<br />1 eastward, 0 northward</Txt>
          <Chip text="unit vector (like b̂): the dot product gives the part along it" x={PX} y={320} w={PW} size={28} color={MUTED} o={oX} />
          <TeX s={EQ_VX} x={PX} y={470} size={46} o={oSh} c={TEAL} />
          <Txt x={PX} y={545} w={PW} s={36} o={oSh} bold>= the eastward part of the wind</Txt>
          <GridNote t="wind map: 1 grid square = 1 m/s (an arrow’s length is a speed)" />
        </div>
      ) : null}
      <Slots filled={[0, 1]} fillO={[1, o0]} o={1 - wind} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s11 reason 3: work
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = 10;
  const t = [0, 1, 2, 3, 4, 5, 6].map((j) => SS(k, j));
  const tD = AT(k, 5, "one hundred over ten");
  const oF = ramp(f, t[1], t[1] + 15), oLeg = ramp(f, t[2], t[2] + 15), dimUp = 1 - 0.6 * ramp(f, t[3] - 10, t[3] + 5);
  const oAng = 1 - ramp(f, t[3] - 10, t[3] + 5); // the 60° arc fades with the upward leg
  const oSh = ramp(f, t[3], t[3] + 18), oForce = ramp(f, t[4], t[4] + 15), oW = ramp(f, t[5], t[5] + 18), oChip = ramp(f, t[6], t[6] + 12);
  const nd = work.d_m.length - 1;
  const kd = Math.round(clamp((f - tD) / 45, 0, 1) * nd);
  const dm = work.d_m[kd], W = work.W_J[kd];
  const GY = 600, X0 = 330, FSC = 16, DSC = 55, RH = 8; // px per N (force ruler), px per m (path ruler), rectangle px per N
  const Fv = work.F as Pt;
  const Ft: Pt = [X0 + Fv[0] * FSC, GY - Fv[1] * FSC];
  const sh: Pt = [X0 + work.shadow_N * FSC, GY];
  const dT: Pt = [X0 + dm * DSC, GY];
  const rect: Pt[] = [[X0, GY], dT, [dT[0], GY + work.shadow_N * RH], [X0, GY + work.shadow_N * RH]];
  const dl = dm.toFixed(dm % 1 ? 1 : 0);
  return (
    <Scene>
      <Svg>
        <line x1={60} y1={GY} x2={1000} y2={GY} stroke="#6b7690" strokeWidth={4} />
        <rect x={130} y={GY - 62} width={190} height={40} rx={8} fill="#3a4766" stroke="#9aa6bd" strokeWidth={3} />
        <path d={`M 120 ${GY - 6} L 330 ${GY - 6} Q 350 ${GY - 6} 345 ${GY - 30}`} fill="none" stroke="#c9d2e3" strokeWidth={5} />
        <line x1={160} y1={GY - 22} x2={160} y2={GY - 6} stroke="#c9d2e3" strokeWidth={4} />
        <line x1={290} y1={GY - 22} x2={290} y2={GY - 6} stroke="#c9d2e3" strokeWidth={4} />
        <Lbl x={225} y={GY - 92} t="sled" c={MUTED} s={28} a="middle" />
        {oW > 0 ? <ProdRect pts={rect} neg={false} o={oW} id="h11" /> : null}
        {oW > 0 ? <Lbl x={X0 + (dT[0] - X0) / 2} y={GY + work.shadow_N * RH / 2} t={`${work.shadow_N.toFixed(0)} N × ${dl} m = ${W.toFixed(0)} J`} s={28} a="middle" b o={oW} /> : null}
        <Arrow p={[X0, GY]} q={dT} color={ORANGE} o={oW} />
        {oW > 0 ? <Lbl x={dT[0]} y={GY + work.shadow_N * RH + 26} t={`d = ${dl} m (distance pulled)`} c={ORANGE} s={30} b o={oW} a="end" /> : null}
        {/* the force and its two parts */}
        <Arrow p={[X0, GY]} q={Ft} color={TEAL} o={oF * (1 - 0.5 * oSh)} />
        <g opacity={oF * oAng}>
          <Arc P={mkP(X0, GY, 1)} a0={0} a1={work.F_deg} r={60} />
          <Lbl x={X0 + 70} y={GY - 26} t={`${work.F_deg.toFixed(0)}°`} s={28} />
        </g>
        <g opacity={oF}>
          <Lbl x={Ft[0] - 20} y={Ft[1] - 26} t={`pull F = ${work.F_N.toFixed(0)} N, ${work.F_deg.toFixed(0)}° above the ground`} c={TEAL} s={28} b />
        </g>
        <g opacity={oLeg * dimUp}>
          <Dash p={sh} q={Ft} c={TEAL} w={4} d="6 7" />
          <Lbl x={Ft[0] + 18} y={(Ft[1] + GY) / 2 - 18} t={`${work.F[1].toFixed(1)} N up: across the motion,`} c={MUTED} s={26} />
          <Lbl x={Ft[0] + 18} y={(Ft[1] + GY) / 2 + 14} t="does no work" c={MUTED} s={26} />
        </g>
        <Dash p={[X0, GY]} q={sh} c={TEAL} w={4} d="6 7" o={oLeg * (1 - oSh)} />
        <Band p={[X0, GY]} q={lerp([X0, GY], sh, oSh)} color={TEAL} o={oSh > 0 ? 1 : 0} />
        {oSh > 0 ? <RightTick at={sh} u1={[-1, 0]} u2={[0, -1]} o={oSh} /> : null}
        <Lbl x={X0 + 60} y={GY + 30} t={`${work.shadow_N.toFixed(1)} N`} c={TEAL} s={26} a="middle" b o={oSh * (1 - oW)} />
        <Arrow p={[X0 - 8, GY - 42]} q={[X0 - 8 + work.shadow_N * FSC, GY - 42]} color={TEAL} w={8} head={22} o={oForce} />
        <Lbl x={X0 - 8 + work.shadow_N * FSC + 12} y={GY - 80} t={`${work.shadow_N.toFixed(0)} N forward`} c={TEAL} s={26} b o={oForce} />
        {/* the two rulers: force in N, path in m */}
        <g opacity={oF}>
          <line x1={80} y1={770} x2={80 + 20 * FSC} y2={770} stroke={TEAL} strokeWidth={3} />
          {[0, 10, 20].map((n) => <g key={n}><line x1={80 + n * FSC} y1={762} x2={80 + n * FSC} y2={778} stroke={TEAL} strokeWidth={2} />
            <Lbl x={80 + n * FSC} y={795} t={`${n}`} c={TEAL} s={22} a="middle" /></g>)}
          <Lbl x={80} y={742} t="force ruler (N)" c={TEAL} s={24} />
        </g>
        <g opacity={oW}>
          <line x1={460} y1={770} x2={460 + 10 * DSC} y2={770} stroke={ORANGE} strokeWidth={3} />
          {[0, 5, 10].map((n) => <g key={n}><line x1={460 + n * DSC} y1={762} x2={460 + n * DSC} y2={778} stroke={ORANGE} strokeWidth={2} />
            <Lbl x={460 + n * DSC} y={795} t={`${n}`} c={ORANGE} s={22} a="middle" /></g>)}
          <Lbl x={460} y={742} t="path ruler (m)" c={ORANGE} s={24} />
        </g>
        <Gauge x={1200} w={640} min={0} max={120} step={20} value={W} readout={`${W.toFixed(0)} J`} o={oW} dec={0} label="work" />
      </Svg>
      <EqBox latex={EQ_W} x={PX} y={170} w={PW} h={80} size={40} />
      <Txt x={PX} y={256} w={PW} s={26} c={MUTED} o={oF}>N = newton, the unit of force</Txt>
      <Txt x={PX} y={306} w={PW} s={29} c={TEAL} o={oSh}>along the ground = the shadow of F on the motion<br />= 20 × cos 60° = <b>{work.shadow_N.toFixed(1)} N</b></Txt>
      <Txt x={PX} y={400} w={PW} s={29} o={oForce}>this shadow is a force: <b style={{ color: TEAL }}>{work.shadow_N.toFixed(0)} N</b> pulling forward — the only part that does work</Txt>
      <TeX s={EQ_W5} x={PX} y={496} size={32} o={oW} />
      <Txt x={PX} y={548} w={PW} s={26} c={MUTED} o={oW}>J = joule, the unit of work (energy)</Txt>
      <TeX s={EQ_W10} x={PX} y={598} size={32} o={ramp(f, tD, tD + 14)} />
      <Chip text="twice the distance → twice the work: the shadow alone can’t tell you the work" x={PX} y={660} w={PW} size={28} color={ORANGE} o={oChip} />
      <Slots filled={[0, 1, 2]} fillO={[1, 1, ramp(f, 6, 18)]} o={1 - oW} />
    </Scene>
  );
};

// ---------------------------------------------------------------- weather maps (s12–s20)
type Geo = { mx: number; my: number; km: number; x0: number; y0: number; w: number; h: number };
const GM: Geo = { mx: 110, my: 200, km: 1.45, x0: 0, y0: 0, w: 600, h: 360 };
const G18: Geo = { mx: 110, my: 245, km: 1.3, x0: 0, y0: 0, w: 600, h: 360 };
const GZ: Geo = { mx: 110, my: 200, km: 3.5, x0: 180, y0: 105, w: 240, h: 150 };
const gX = (g: Geo, xk: number) => g.mx + (xk - g.x0) * g.km;
const gY = (g: Geo, yk: number) => g.my + (g.h - (yk - g.y0)) * g.km;
const gP = (g: Geo, p: Pt): Pt => [gX(g, p[0]), gY(g, p[1])];
const LUT = wx.lut_thermal as string[];
const [T_LO, T_HI] = wx.lut_range_C as [number, number];
const tColor = (T: number) => LUT[Math.round(clamp((T - T_LO) / (T_HI - T_LO), 0, 1) * (LUT.length - 1))];
const VV = wx.v as Pt;
const VANG = (wx.angle_deg * Math.PI) / 180;
const vScr = (us: number): Pt => [wx.speed * us * Math.cos(VANG), -wx.speed * us * Math.sin(VANG)];
const PIN = wx.pin_km as Pt;
const US = 18; // px per (m/s) for the wind arrow (its own scale, not the map's km)
const GL = 150; // ∇T arrow px (its own scale, K/m)
const T_AT = (xk: number, G = wx.dTdx_K_m, tWest = wx.T_west, shiftKm = 0) => tWest + G * (xk - shiftKm) * 1000;

/** T(x, t) = T_west + G (x − shift): G and shift from the data file (shift_km = v·x̂ t). Drawn as strips; optional
 * isotherms every `isoStep` °C (lines appear one by one when `isoReveal` gives each line's opacity). */
const TMap: React.FC<{ g: Geo; G: number; shiftKm: number; o?: number; tWest?: number; iso?: boolean; isoO?: (T: number) => number; isoLabels?: boolean }> = ({
  g, G, shiftKm, o = 1, tWest = wx.T_west, iso = true, isoO, isoLabels = true,
}) => {
  const strips = [], n = 120, dx = g.w / n;
  for (let i = 0; i < n; i++) {
    const xk = g.x0 + (i + 0.5) * dx;
    strips.push(<rect key={i} x={gX(g, g.x0 + i * dx)} y={g.my} width={dx * g.km + 0.6} height={g.h * g.km} fill={tColor(T_AT(xk, G, tWest, shiftKm))} />);
  }
  const lines = [];
  if (iso) for (let T = 0; T <= 22; T++) {
    const xk = (T - tWest) / G / 1000 + shiftKm;
    if (xk < g.x0 + 2 || xk > g.x0 + g.w - 2) continue;
    const io = isoO ? isoO(T) : 1;
    if (io <= 0) continue;
    const px = gX(g, xk);
    lines.push(<g key={T} opacity={io}><line x1={px} y1={g.my} x2={px} y2={g.my + g.h * g.km} stroke="#ffffff" strokeOpacity={0.55} strokeWidth={2} />
      {isoLabels ? <Lbl x={px} y={g.my - 20} t={`${T} °C`} c={INK} s={26} a="middle" /> : null}</g>);
  }
  return <g opacity={o}>{strips}{lines}</g>;
};
const MapFrame: React.FC<{ g: Geo; dx?: number; dy?: number; o?: number }> = ({ g, dx = 100, dy = 100, o = 1 }) => {
  const ticks = [];
  for (let x = Math.ceil(g.x0 / dx) * dx; x <= g.x0 + g.w + 1e-6; x += dx)
    ticks.push(<Lbl key={`e${x}`} x={gX(g, x)} y={g.my + g.h * g.km + 24} t={`${x}`} c={MUTED} s={24} a="middle" />);
  for (let y = Math.ceil(g.y0 / dy) * dy; y <= g.y0 + g.h + 1e-6; y += dy)
    ticks.push(<Lbl key={`n${y}`} x={g.mx - 10} y={gY(g, y)} t={`${y}`} c={MUTED} s={24} a="end" />);
  return (
    <g opacity={o}>
      <rect x={g.mx} y={g.my} width={g.w * g.km} height={g.h * g.km} fill="none" stroke={HOUSE.grid} strokeWidth={3} />
      {ticks}
      <Lbl x={g.mx + g.w * g.km} y={g.my + g.h * g.km + 56} t="east (km) →" c={MUTED} s={24} a="end" />
      <g transform={`translate(30 ${g.my + (g.h * g.km) / 2}) rotate(-90)`}><Lbl x={0} y={0} t="north (km) →" c={MUTED} s={24} a="middle" /></g>
    </g>
  );
};
/** Colour bar in the free band under the captions (y ≈ 990), with the "idealised map" tag. */
const ColourBar: React.FC<{ x?: number; o?: number }> = ({ x = 110, o = 1 }) => {
  const W = 620, y = 978;
  return (
    <g opacity={o}>
      {LUT.map((c, i) => <rect key={i} x={x + (i * W) / LUT.length} y={y} width={W / LUT.length + 0.6} height={22} fill={c} />)}
      {[4, 8, 12, 16, 20].map((T) => <Lbl key={T} x={x + ((T - T_LO) / (T_HI - T_LO)) * W} y={y + 44} t={`${T}`} c={MUTED} s={22} a="middle" />)}
      <Lbl x={x + W + 18} y={y + 11} t="T (°C)" c={INK} s={26} />
      <Lbl x={x + W + 120} y={y + 11} t="· an idealised map (not data)" c={MUTED} s={24} />
    </g>
  );
};
const ClipMap: React.FC<{ g: Geo; id: string; children: React.ReactNode }> = ({ g, id, children }) => (
  <>
    <defs><clipPath id={id}><rect x={g.mx} y={g.my} width={g.w * g.km} height={g.h * g.km} /></clipPath></defs>
    <g clipPath={`url(#${id})`}>{children}</g>
  </>
);
const RX = 1060, RW = 820; // right panel for the map scenes
/** balloon position at t seconds along the data path (1-min samples, 3 h) */
const balloonAt = (sec: number): Pt => {
  const nb = wx.balloon_x_km.length - 1, ib = clamp(sec / 60, 0, nb);
  const i0 = Math.floor(ib), i1 = Math.min(nb, i0 + 1), w = ib - i0;
  return [wx.balloon_x_km[i0] + (wx.balloon_x_km[i1] - wx.balloon_x_km[i0]) * w, wx.balloon_y_km[i0] + (wx.balloon_y_km[i1] - wx.balloon_y_km[i0]) * w];
};
/** sample of a t_h-indexed series at fractional index */
const atIdx = (arr: number[], x: number) => { const i0 = Math.floor(x), i1 = Math.min(arr.length - 1, i0 + 1); return arr[i0] + (arr[i1] - arr[i0]) * (x - i0); };

// ---------------------------------------------------------------- s12 two thermometers (Part 3 opener)
const [EQ12_POLE, EQ12_BAL] = halves(EQ_12);
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = 11;
  const dim = partCardDim(f);
  const t = [0, 1, 2, 3, 4, 5].map((j) => SS(k, j));
  const oPole = ramp(f, t[1], t[1] + 14), oPrim = ramp(f, t[2], t[2] + 14), oBal = ramp(f, t[3], t[3] + 14), oPar = ramp(f, t[4], t[4] + 14), oMD = ramp(f, t[5], t[5] + 14);
  const g = GM;
  const sec = clamp((f - t[3] - 10) / 90, 0, 3) * 3600; // 1 h of drift in 3 s, 3 h in all
  const bk = balloonAt(sec), pin = gP(g, PIN), bal = gP(g, bk);
  const vs = vScr(7);
  const row = (o: number, icon: React.ReactNode, eq: string | null, c: string, text: React.ReactNode, y: number) => (
    o <= 0 ? null :
      <div style={{ position: "absolute", left: RX, top: y, width: RW, opacity: o, display: "flex", gap: 16, alignItems: "center",
        background: HOUSE.panel, borderRadius: 12, borderLeft: `6px solid ${c}`, padding: "8px 14px", boxSizing: "border-box", ...FONT }}>
        <svg width={50} height={74} style={{ flex: "0 0 auto" }}>{icon}</svg>
        <div>
          {eq ? <TeXi s={eq} size={36} c={c} /> : null}
          <div style={{ fontSize: 28, lineHeight: 1.22, marginTop: eq ? 4 : 0 }}>{text}</div>
        </div>
      </div>
  );
  return (
    <AbsoluteFill style={{ background: HOUSE.bg }}>
      <AbsoluteFill style={{ opacity: dim }}>
        <Svg>
          <TMap g={g} G={wx.dTdx_K_m} shiftKm={0} iso={false} />
          <MapFrame g={g} />
          <ColourBar />
          <line x1={pin[0]} y1={pin[1]} x2={bal[0]} y2={bal[1]} stroke={TEAL} strokeWidth={3} strokeDasharray="6 6" opacity={oBal} />
          <Arrow p={bal} q={[bal[0] + vs[0], bal[1] + vs[1]]} color={TEAL} w={6} halo o={oBal} />
          <Lbl x={bal[0] + vs[0] + 10} y={bal[1] + vs[1] - 6} t="wind" c={TEAL} s={28} b o={oBal} />
          <PoleThermometer x={pin[0]} y={pin[1]} o={oPole} s={0.8} />
          <Lbl x={pin[0]} y={pin[1] + 30} t="thermometer on a pole:" c={INK} s={26} a="middle" o={oPole} b />
          <Lbl x={pin[0]} y={pin[1] + 60} t="one fixed place" c={INK} s={26} a="middle" o={oPole} />
          {oPar > 0 ? <ellipse cx={bal[0]} cy={bal[1] - 52} rx={44} ry={86} fill="#ffffff" fillOpacity={0.08 * oPar} stroke="#ffffff" strokeWidth={2.5} strokeDasharray="7 6" opacity={oPar} /> : null}
          <BalloonThermometer x={bal[0]} y={bal[1]} o={oBal} s={0.6} />
          <Lbl x={bal[0] - 52} y={bal[1] - 110} t={oPar > 0.5 ? "air parcel" : "balloon"} c={INK} s={28} o={oBal} b a="end" />
        </Svg>
        <Chip text={`clock: 1 h of drift in 3 s · t = ${(sec / 3600).toFixed(2)} h`} x={RX} y={690} size={26} color={MUTED} o={oBal} />
        {row(oPole, <PoleThermometer x={25} y={72} s={0.5} />, EQ12_POLE, SLATE, <>local rate: change at one fixed place</>, 170)}
        <Chip text={<><b>∂</b> (“partial”): only one thing changes — here the time; the place stays fixed</>} x={RX} y={300} w={RW} size={28} color={SLATE} o={oPrim} />
        {row(oPar, <ellipse cx={25} cy={37} rx={20} ry={32} fill="none" stroke="#ffffff" strokeWidth={2} strokeDasharray="5 4" />, null, MUTED,
          <><b>air parcel</b> = a small volume of air that moves with the flow</>, 420)}
        {row(oMD, <BalloonThermometer x={25} y={72} s={0.42} />, EQ12_BAL, INK, <>material derivative: rate of change following an air parcel (the balloon)</>, 540)}
      </AbsoluteFill>
      <PartCard f={f} name="Part 3 · The weather" subtitle="the same dot product, inside how temperature changes" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- s13 the material-derivative equation
const [MD_L, MD_R] = EQ_MD.split(" = ");
const [MD_A, MD_B] = MD_R.split(" + ");
const [TF_L, TF_R] = EQ_TF.split(" = ");
const [TF_A, TF_B] = TF_R.split(" + ");
const boxPhi = (s: string) => s.replace(/\\varphi/g, col(GOLD, String.raw`\boxed{\varphi}`));
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = 12;
  const t = [0, 1, 2, 3].map((j) => SS(k, j));
  const tV = AT(k, 1, "v is the wind");
  const oEq = ramp(f, 4, 18), oBr = ramp(f, 14, 30), oPhi = ramp(f, t[1], t[1] + 12), oV = ramp(f, tV, tV + 12), oAdv = ramp(f, t[2], t[2] + 12);
  const oT = ramp(f, t[3], t[3] + 14), oRing = ramp(f, AT(k, 3, "v dot grad T is"), AT(k, 3, "v dot grad T is") + 12), oQ = ramp(f, t[3] + 40, t[3] + 54);
  const xs = [460, 700, 960, 1180, 1440];
  const pieces = [
    { s: oPhi > 0 ? boxPhi(MD_L) : MD_L, c: INK, label: "following an air parcel (balloon)" },
    { s: "=", c: INK },
    { s: oPhi > 0 ? boxPhi(MD_A) : MD_A, c: SLATE, label: "at a fixed place (pole)" },
    { s: "+", c: INK },
    { s: oV > 0 ? rep(oPhi > 0 ? boxPhi(MD_B) : MD_B, String.raw`\mathbf v`, col(TEAL, String.raw`\boxed{\mathbf v}`)) : (oPhi > 0 ? boxPhi(MD_B) : MD_B), c: TEAL,
      label: oAdv > 0.5 ? "v·∇φ = advection of φ: change from being carried by the wind" : "from being carried across the map" },
  ];
  const tx = [600, 760, 960, 1160, 1320];
  return (
    <Scene>
      <Svg>
        <TMap g={GM} G={wx.dTdx_K_m} shiftKm={0} iso={false} o={0.4} />
      </Svg>
      <AbsoluteFill style={{ background: "rgba(15,20,32,0.55)" }} />
      {pieces.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: xs[i], top: 230, transform: "translate(-50%, -50%)", opacity: oEq }}>
          <TeXi s={p.s} size={64} c={p.c} />
        </div>
      ))}
      <Svg>
        {pieces.map((p, i) => p.label ? (
          <g key={i} opacity={oBr}>
            <path d={`M ${xs[i] - 90} 300 Q ${xs[i] - 90} 314 ${xs[i] - 70} 314 L ${xs[i] - 12} 314 L ${xs[i]} 326 L ${xs[i] + 12} 314 L ${xs[i] + 70} 314 Q ${xs[i] + 90} 314 ${xs[i] + 90} 300`}
              fill="none" stroke={p.c} strokeWidth={3} />
          </g>
        ) : null)}
      </Svg>
      {pieces.map((p, i) => p.label ? (
        <Txt key={i} x={xs[i] - 180} y={338} w={360} s={i === 4 && oAdv > 0.5 ? 26 : 28} c={p.c} o={oBr} align="center" bold={i === 4 && oAdv > 0.5}>{p.label}</Txt>
      ) : null)}
      <Txt x={260} y={450} w={1400} s={30} c={GOLD} o={oPhi}>φ = any quantity the air carries: temperature T, moisture, …</Txt>
      <Svg>
        <g opacity={oPhi}>
          <PoleThermometer x={1590} y={500} s={0.45} />
          <path d="M 1660 455 Q 1646 478 1646 488 A 14 14 0 0 0 1674 488 Q 1674 478 1660 455 Z" fill="#5b9bd8" stroke={INK} strokeWidth={2} />
        </g>
        <Arrow p={[1580, 538]} q={[1680, 508]} color={TEAL} w={6} head={20} o={oV} />
      </Svg>
      <Txt x={260} y={510} w={1300} s={30} c={TEAL} o={oV}>v = the wind (the velocity of the air)</Txt>
      <Chip text={<>∇φ (“grad φ”): how φ changes across the map</>} x={260} y={568} size={28} color={MUTED} o={oV} />
      {[TF_L, "=", TF_A, "+", TF_B].map((s, i) => (
        <div key={i} style={{ position: "absolute", left: tx[i], top: 700, transform: "translate(-50%, -50%)", opacity: oT,
          borderRadius: 40, boxShadow: i === 4 && oRing > 0 ? `0 0 0 ${3 + 2 * oRing}px rgba(42,161,152,${oRing})` : undefined, padding: "0 12px" }}>
          <TeXi s={s} size={52} c={i === 2 ? SLATE : i === 4 ? TEAL : INK} />
        </div>
      ))}
      <Txt x={1450} y={660} w={450} s={28} c={TEAL} o={oT}>v·∇T = advection of temperature</Txt>
      <Chip text="this dot = our dot product" x={1450} y={708} size={28} color={TEAL} o={oRing} />
      <div style={{ position: "absolute", left: 600, top: 768, opacity: oQ * 0.85, ...FONT, fontSize: 28, color: MUTED, display: "flex", gap: 12, alignItems: "center" }}>
        moisture q: <TeXi s={EQ_VQ} size={32} c={MUTED} /> = advection of moisture
      </div>
    </Scene>
  );
};

// ---------------------------------------------------------------- s14 isotherms and ∂/∂x, ∂/∂y
const [DX14, DY14] = halves(EQ_DXDY);
const ISO_T = wx.isotherm_T_C as number[], ISO_KM = wx.isotherms_km as number[];
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = 13;
  const t = [0, 1, 2, 3, 4].map((j) => SS(k, j));
  const g = GM, pin = gP(g, PIN);
  const isoO = (T: number) => { const i = ISO_T.indexOf(T); return i < 0 ? 0 : ramp(f, 6 + i * 10, 18 + i * 10); };
  const oBr = ramp(f, t[1], t[1] + 14), oDx = ramp(f, t[3], t[3] + 14), oDy = ramp(f, t[4], t[4] + 14);
  // walker: east 300 → 500 km during sentence 3; then back to the pin and north along the 13 °C isotherm (sentence 5)
  const east = clamp((f - t[2] - 6) / 110, 0, 1), back = ramp(f, t[4] - 16, t[4]), north = clamp((f - t[4] - 6) / 100, 0, 1);
  const wxk = back > 0 ? PIN[0] + (ISO_KM[4] - PIN[0]) * (1 - back) : PIN[0] + (ISO_KM[4] - PIN[0]) * east;
  const wyk = PIN[1] + 100 * north;
  const wT = T_AT(wxk);
  const walker = gP(g, [wxk, wyk]);
  const crossed = ISO_KM.filter((x) => x > PIN[0] && x <= wxk + 1e-6 && back === 0);
  return (
    <Scene>
      <Svg>
        <TMap g={g} G={wx.dTdx_K_m} shiftKm={0} isoO={isoO} />
        <MapFrame g={g} />
        <ColourBar />
        <g opacity={oBr * (1 - ramp(f, t[2] - 6, t[2] + 6) * 0.5)}>
          {ISO_KM.slice(0, -1).map((x, i) => (
            <g key={x}>
              <Bracket p={[gX(g, x), g.my + 40]} q={[gX(g, ISO_KM[i + 1]), g.my + 40]} off={0} c={INK} />
              <Lbl x={gX(g, (x + ISO_KM[i + 1]) / 2)} y={g.my + 68} t="100 km" c={INK} s={24} a="middle" b />
            </g>
          ))}
        </g>
        {f >= t[2] ? <g>
          {crossed.map((x) => <Lbl key={x} x={gX(g, x) + 6} y={pin[1] - 40} t="+1 °C" c={INK} s={28} b />)}
          {back === 0 ? <Arrow p={pin} q={[walker[0], pin[1]]} color={INK} w={4} head={16} o={east > 0.05 ? 0.8 : 0} /> : null}
          {north > 0 ? <Arrow p={pin} q={walker} color={INK} w={4} head={16} o={0.8} /> : null}
          <circle cx={walker[0]} cy={walker[1]} r={12} fill={tColor(wT)} stroke={INK} strokeWidth={3} />
          <Lbl x={walker[0] + 18} y={walker[1] + 30} t={`${wT.toFixed(0)} °C`} c={INK} s={30} b />
        </g> : <circle cx={pin[0]} cy={pin[1]} r={8} fill={INK} stroke={HOUSE.bg} strokeWidth={2} />}
      </Svg>
      <Chip text="isotherm = a line of equal temperature" x={RX} y={170} o={ramp(f, 10, 22)} />
      <Txt x={RX} y={240} w={RW} s={28} c={MUTED} o={oBr}>north–south lines, one every 100 km</Txt>
      <Txt x={RX} y={300} w={RW} s={30} o={ramp(f, t[2], t[2] + 12)}>walk east: 13 → 14 → 15 °C, +1 °C at each isotherm</Txt>
      <div style={{ position: "absolute", left: RX, top: 380, width: RW, opacity: oDx, ...FONT }}>
        <TeXi s={DX14} size={46} c={ORANGE} />
        <div style={{ fontSize: 28, marginTop: 6 }}>change going east only (north position held fixed)</div>
        <div style={{ fontSize: 26, color: MUTED, marginTop: 4 }}>reminder: ∂ = only one thing changes</div>
      </div>
      <div style={{ position: "absolute", left: RX, top: 600, width: RW, opacity: oDy, ...FONT }}>
        <TeXi s={DY14} size={46} c={ORANGE} />
        <div style={{ fontSize: 28, marginTop: 6 }}>change going north only: none (you stay on the 13 °C isotherm)</div>
      </div>
    </Scene>
  );
};

// ---------------------------------------------------------------- s15 ∇T
const GRAD_A = EQ_GRAD.slice(0, EQ_GRAD.indexOf(" = (1.00"));
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = 14;
  const t = [0, 1, 2, 3].map((j) => SS(k, j));
  const oG = ramp(f, t[0] + 10, t[0] + 28), oNab = ramp(f, t[1], t[1] + 12), pulse = Math.sin(Math.PI * clamp((f - t[1]) / 30, 0, 1));
  const oNum = ramp(f, t[2], t[2] + 12), oUp = ramp(f, t[3], t[3] + 12), oLen = ramp(f, AT(k, 3, "its length"), AT(k, 3, "its length") + 12);
  const g = GM, P0 = gP(g, PIN);
  return (
    <Scene>
      <Svg>
        <TMap g={g} G={wx.dTdx_K_m} shiftKm={0} />
        <MapFrame g={g} />
        <ColourBar />
        <Arrow p={P0} q={[P0[0] + GL * oG, P0[1]]} color={ORANGE} o={oG > 0 ? 1 : 0} w={8} halo />
        <Lbl x={P0[0] + GL + 14} y={P0[1]} t="∇T" c={ORANGE} s={38} b o={oG} />
        <Bracket p={P0} q={[P0[0] + GL, P0[1]]} off={26} c={ORANGE} label="|∇T|" lo={28} s={30} o={oLen} />
        <Lbl x={P0[0] + GL / 2} y={P0[1] - 36} t="uphill → warmer" c={ORANGE} s={30} b o={oUp} a="middle" />
        <circle cx={P0[0]} cy={P0[1]} r={7} fill={INK} stroke={HOUSE.bg} strokeWidth={2} />
      </Svg>
      <TeX s={oNum > 0.5 ? EQ_GRAD : GRAD_A} x={RX} y={172} size={oNum > 0.5 ? 30 : 38} o={oG} d />
      <div style={{ position: "absolute", left: RX, top: 300, height: 130, display: "flex", alignItems: "center", gap: 24, opacity: oNab, ...FONT }}>
        <div style={{ width: 130, textAlign: "center" }}><TeXi s={String.raw`\nabla`} size={80 + 36 * pulse} c={ORANGE} /></div>
        <div style={{ fontSize: 32, border: `2px solid ${ORANGE}`, borderRadius: 10, padding: "6px 16px", background: HOUSE.panel, whiteSpace: "nowrap" }}>∇ = “grad”, short for gradient</div>
      </div>
      <Chip text="1 K step = 1 °C step;  100 km = 10⁵ m" x={RX} y={460} size={28} color={MUTED} o={oNum} />
      <Txt x={RX} y={550} w={RW} s={30} c={ORANGE} o={oUp} bold>∇T points uphill, towards warmer air, straight across the isotherms</Txt>
      <Txt x={RX} y={650} w={RW} s={30} o={oLen}>|∇T| = {sci(wx.norm_gradT)} K/m = how steep the map is</Txt>
      <Txt x={RX} y={706} w={RW} s={28} c={MUTED} o={oLen}>(the arrow has its own scale, in K/m; the bracket gives its value)</Txt>
    </Scene>
  );
};

// ---------------------------------------------------------------- s16 v·∇T = shadow × steepness
const VGTN = EQ_VGTN.replace(/^= /, "").split(" = ");
const EQ_TF_HL = rep(EQ_TF, String.raw`\mathbf v\cdot\nabla T`, col(TEAL, String.raw`\mathbf v\cdot\nabla T`));
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = 15;
  const t = [0, 1, 2, 3].map((j) => SS(k, j)), e3 = SE(k, 3);
  const tUnits = AT(k, 3, "the metres cancel"), tKs = AT(k, 3, "five times ten"), tKh = AT(k, 3, "or point one eight");
  const oV = ramp(f, t[0] + 10, t[0] + 26), oS = ramp(f, t[1], t[1] + 18), oAl = ramp(f, t[2], t[2] + 14);
  const oE = ramp(f, t[3], t[3] + 12), oE1 = ramp(f, t[3] + 20, t[3] + 32), oU = ramp(f, tUnits, tUnits + 12), oE2 = ramp(f, tKs, tKs + 12), oE3 = ramp(f, tKh, tKh + 12);
  const oChk = ramp(f, Math.min(e3 + 4, LEN(k) - 30), Math.min(e3 + 16, LEN(k) - 18));
  const g = GM, P0 = gP(g, PIN);
  const vs = vScr(US), vT: Pt = [P0[0] + vs[0], P0[1] + vs[1]], sh: Pt = [P0[0] + wx.shadow_m_s * US, P0[1]];
  const along = wx.v_along_isotherm_m_s as Pt, alT: Pt = [P0[0] + along[0] * US, P0[1] - along[1] * US];
  const rect: Pt[] = [P0, sh, [sh[0], P0[1] + GL * oE], [P0[0], P0[1] + GL * oE]];
  return (
    <Scene>
      <Svg>
        <TMap g={g} G={wx.dTdx_K_m} shiftKm={0} />
        <MapFrame g={g} />
        <ColourBar />
        {oE > 0 ? <ProdRect pts={rect} neg={false} o={oE} id="h16" /> : null}
        <Band p={P0} q={lerp(P0, sh, oS)} color={TEAL} o={oS > 0 ? 1 : 0} />
        <Arrow p={P0} q={[P0[0] + GL, P0[1]]} color={ORANGE} w={7} halo />
        <Lbl x={P0[0] + GL + 12} y={P0[1]} t="∇T" c={ORANGE} s={34} b />
        {oAl > 0 ? <><Dash p={P0} q={alT} c={TEAL} w={4} d="6 7" o={oAl} />
          <Lbl x={alT[0] - 14} y={alT[1] - 8} t={`${along[1].toFixed(2)} m/s along the isotherm:`} c={INK} s={26} a="end" b o={oAl} />
          <Lbl x={alT[0] - 14} y={alT[1] + 24} t="no temperature change" c={INK} s={26} a="end" o={oAl} /></> : null}
        <Arrow p={P0} q={vT} color={TEAL} o={oV} w={7} halo />
        <circle cx={P0[0]} cy={P0[1]} r={7} fill={INK} stroke={HOUSE.bg} strokeWidth={2} />
        <g opacity={oV}>
          <Arc P={mkP(P0[0], P0[1], 1)} a0={0} a1={wx.angle_deg} r={56} />
          <Lbl x={P0[0] + 62} y={P0[1] - 28} t={`${wx.angle_deg.toFixed(0)}°`} s={28} b />
          <Lbl x={vT[0] + 12} y={vT[1] - 6} t="v" c={TEAL} s={36} b />
        </g>
        {oS > 0 ? <g opacity={oS}><Dash p={vT} q={sh} /><RightTick at={sh} u1={[-1, 0]} u2={[0, -1]} />
          <Lbl x={P0[0] + 4} y={P0[1] + 30} t="shadow" c={TEAL} s={26} b /></g> : null}
        {oE > 0 ? <g opacity={oE}>
          <Bracket p={[sh[0], P0[1]]} q={[sh[0], P0[1] + GL]} off={-16} c={ORANGE} label="|∇T|" lo={16} s={26} a="start" />
          <Lbl x={P0[0] - 12} y={P0[1] + 100} t="area = v·∇T" c={INK} s={28} a="end" b />
        </g> : null}
      </Svg>
      <TeX s={EQ_TF_HL} x={RX} y={150} size={30} d />
      <Txt x={RX} y={248} w={RW} s={28} c={TEAL} o={oV}>the wind (as the balloon’s): |v| = {wx.norm_v.toFixed(0)} m/s, {wx.angle_deg.toFixed(0)}° from ∇T</Txt>
      <Txt x={RX} y={290} w={RW} s={28} c={TEAL} o={oS}>shadow of v on ∇T = 10 × cos 60° = <b>{wx.shadow_m_s.toFixed(2)} m/s</b><br /><span style={{ color: INK }}>= speed straight towards warmer air</span></Txt>
      <TeX s={EQ_VGT} x={RX} y={390} size={36} o={oE} />
      <TeX s={"= " + VGTN[0]} x={RX + 60} y={448} size={32} o={oE1} />
      <Txt x={RX + 60} y={500} w={RW - 60} s={26} c={MUTED} o={oU}>units: (<s>m</s>/s) × (K/<s>m</s>) = K/s</Txt>
      <TeX s={"= " + VGTN[1]} x={RX + 60} y={548} size={32} o={oE2} />
      <TeX s={String.raw`\times 3600\ \mathrm{s\ per\ hour} = ` + VGTN[2]} x={RX + 60} y={604} size={32} o={oE3} />
      <Chip text={`components: ${VV[0].toFixed(2)} × ${sci(wx.gradT[0])} + ${VV[1].toFixed(2)} × 0 = ${sci(wx.v_dot_gradT)} ✓`} x={RX} y={668} w={RW} size={28} color={MUTED} o={oChk} />
    </Scene>
  );
};
void TF_L;

// ---------------------------------------------------------------- s17 a rate in space, a rate in time
const [S17A, S17B] = halves(EQ_S17);
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = 16;
  const t = [0, 1, 2].map((j) => SS(k, j));
  const oA = ramp(f, t[0] + 6, t[0] + 20), oB = ramp(f, t[1], t[1] + 12), oC = ramp(f, t[2], t[2] + 12);
  const run = clamp((f - t[2] - 6) / 120, 0, 1); // 1 h in 4 s
  const g = GZ, P0 = gP(g, PIN), bal = gP(g, balloonAt(run * 3600));
  const xEnd = gX(g, wx.balloon_x_km[60]);
  const oEnd = ramp(f, t[2] + 126, t[2] + 140);
  const ck = (i: number) => ramp(f, t[2] + 130 + i * 20, t[2] + 142 + i * 20);
  const colStyle = (c: string, o: number): React.CSSProperties => ({ position: "absolute", top: 170, width: 400, opacity: o, background: HOUSE.panel,
    borderTop: `6px solid ${c}`, borderRadius: 10, padding: "10px 16px", boxSizing: "border-box", ...FONT, fontSize: 28, lineHeight: 1.3 });
  return (
    <Scene>
      <Svg>
        <TMap g={g} G={wx.dTdx_K_m} shiftKm={0} />
        <MapFrame g={g} dx={40} dy={30} />
        <g opacity={oA}>
          <Bracket p={[gX(g, 300), g.my + g.h * g.km - 30]} q={[gX(g, 400), g.my + g.h * g.km - 30]} off={0} c={INK} />
          <Lbl x={gX(g, 350)} y={g.my + g.h * g.km - 58} t="1 °C per 100 km" c={INK} s={28} a="middle" b />
        </g>
        <line x1={P0[0]} y1={P0[1]} x2={bal[0]} y2={bal[1]} stroke={TEAL} strokeWidth={5} opacity={oC} />
        <circle cx={P0[0]} cy={P0[1]} r={8} fill={INK} stroke={HOUSE.bg} strokeWidth={2} />
        <Lbl x={P0[0] - 14} y={P0[1] + 26} t="start" c={INK} s={26} a="end" />
        <BalloonThermometer x={bal[0]} y={bal[1]} o={oC} s={0.7} />
        <g opacity={oEnd}>
          <Lbl x={(P0[0] + bal[0]) / 2 - 18} y={(P0[1] + bal[1]) / 2 + 14} t={`${wx.km_per_h_along_wind.toFixed(1)} km along the wind`} c={TEAL} s={28} a="end" b />
          <Dash p={[xEnd, bal[1]]} q={[xEnd, P0[1] + 50]} c={INK} w={2} d="5 6" />
          <Bracket p={[P0[0], P0[1] + 50]} q={[xEnd, P0[1] + 50]} off={0} c={ORANGE} />
          <Lbl x={P0[0] - 6} y={P0[1] + 88} t={`${wx.km_per_h_towards_warm.toFixed(1)} km towards warmer air`} c={ORANGE} s={28} b />
          <Lbl x={P0[0] - 6} y={P0[1] + 122} t={`= ${wx.shadow_m_s.toFixed(2)} m/s × 3600 s`} c={ORANGE} s={26} />
        </g>
      </Svg>
      <div style={{ ...colStyle(ORANGE, oA), left: RX }}>
        <b style={{ color: ORANGE }}>rate in SPACE</b> 📏<br />the map’s slope<br /><b>1 °C per 100 km</b><br /><span style={{ color: MUTED }}>the same everywhere on the map</span>
      </div>
      <div style={{ ...colStyle(TEAL, oB), left: RX + 420 }}>
        <b style={{ color: TEAL }}>rate in TIME</b> 🕒<br />what the moving air parcel meets<br /><b>{wx.K_per_h.toFixed(3)} K per hour</b>
      </div>
      <Chip text={`clock: 1 h in 4 s · t = ${run.toFixed(2)} h`} x={RX} y={400} size={26} color={MUTED} o={oC} />
      <TeX s={S17A} x={RX} y={470} size={32} o={ck(0)} />
      <TeX s={S17B} x={RX} y={530} size={32} o={ck(1)} />
      <Txt x={RX} y={610} w={RW} s={28} o={ck(2)}>after 1 h the parcel is over a spot that was <b>{wx.warming_met_K.toFixed(3)} °C warmer</b> when it set off</Txt>
      <Txt x={RX} y={720} w={RW} s={24} c={MUTED}>map zoomed in: 240 km × 150 km around the start · an idealised map (not data)</Txt>
    </Scene>
  );
};

// ---------------------------------------------------------------- s18 if each air parcel keeps its temperature
const ROW18 = [
  { line: EQ_TF, why: "the equation, for temperature" },
  { line: String.raw`0 = \frac{\partial T}{\partial t} + \mathbf v\cdot\nabla T`, why: "each parcel keeps its temperature: DT/Dt = 0" },
  { line: String.raw`0 - \mathbf v\cdot\nabla T = \frac{\partial T}{\partial t} ${col(TEAL, String.raw`\cancel{+ \mathbf v\cdot\nabla T - \mathbf v\cdot\nabla T}`)}`, why: "subtract v·∇T from both sides" },
  { line: String.raw`\frac{\partial T}{\partial t} = ${col(ROSE, "-")}\,\mathbf v\cdot\nabla T`, why: "what’s left: the change at a fixed place is minus the advection" },
];
// storyboard derivation_strip row 3, before the cancel marks: 0 - \mathbf v\cdot\nabla T = \frac{\partial T}{\partial t} + \mathbf v\cdot\nabla T - \mathbf v\cdot\nabla T
/** 5 tagged parcels per row (every other column of the 8 × 4 data grid, plus the last), tags above their dots */
const KEEP18 = [0, 1, 2, 3].flatMap((r) => [0, 2, 4, 6, 7].map((c) => r * 8 + c));
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = 17;
  const t = [0, 1, 2, 3].map((j) => SS(k, j));
  const tSlide = AT(k, 1, "the pattern slides");
  const at = [t[1], AT(k, 1, "capital D T by D t is zero"), t[2], t[3]];
  const drift = clamp((f - tSlide) / 120, 0, 1) * 60; // 1 h in 4 s; samples 1 min apart
  const i0 = Math.floor(drift), i1 = Math.min(60, i0 + 1), w = drift - i0;
  const g = G18;
  const shift = (wx.v_x * (drift * 60)) / 1000;
  const cur = at.reduce((c, a, i) => (f >= a ? i : c), -1);
  const bal = gP(g, balloonAt(drift * 60));
  const oBal = ramp(f, t[1], t[1] + 12);
  const X = 1000, W = 890;
  return (
    <Scene>
      <Svg>
        <ClipMap g={g} id="clip18">
          <TMap g={g} G={wx.dTdx_K_m} shiftKm={shift} />
          {KEEP18.map((i) => {
            const T = wx.tags_T[i];
            const xk = wx.tags_x_km[i][i0] + (wx.tags_x_km[i][i1] - wx.tags_x_km[i][i0]) * w;
            const yk = wx.tags_y_km[i][i0] + (wx.tags_y_km[i][i1] - wx.tags_y_km[i][i0]) * w;
            const x = gX(g, xk), y = gY(g, yk);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={10} fill="none" stroke="#ffffff" strokeWidth={2} />
                <circle cx={x} cy={y} r={8} fill={tColor(T)} stroke={HOUSE.bg} strokeWidth={3} />
                <Lbl x={x} y={y - 24} t={T.toFixed(1)} c={INK} s={24} a="middle" b />
              </g>
            );
          })}
          <BalloonThermometer x={bal[0]} y={bal[1]} s={0.5} o={oBal} />
        </ClipMap>
        <MapFrame g={g} />
        <ColourBar />
      </Svg>
      <Chip text="suppose: each parcel keeps its temperature (no sunshine, no mixing)" x={110} y={160} size={26} o={ramp(f, 6, 18)} />
      <Txt x={110} y={204} w={800} s={26} o={oBal}>balloon: <b>13.00 °C</b>, never changes&nbsp;&nbsp;·&nbsp;&nbsp;<b>DT/Dt = 0</b></Txt>
      <Chip text="the air carries its temperature, so the pattern slides with the wind" x={X} y={636} w={W} size={26} color={ORANGE} o={ramp(f, tSlide, tSlide + 12)} />
      <Txt x={110} y={1036} w={1200} s={22} c={MUTED} o={ramp(f, 6, 18)}>tag = the parcel’s own temperature: it never changes · clock: 1 h in 4 s</Txt>
      {ROW18.map((r, i) => (
        <Row key={i} x={X} y={160 + i * 118} w={W} latex={r.line} why={`${i + 1} · ${r.why}`} o={ramp(f, at[i], at[i] + 12)} size={34} boxed={i === 3} />
      ))}
      <EqBox latex={EQ_DTDT} x={X} y={704} w={W} h={100} size={34} o={ramp(f, t[3] + 36, t[3] + 48)} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s19 the pole cools: the air comes from upwind
const UPX = wx.upwind_x_km as number[], UPY = wx.upwind_y_km as number[], UPT = wx.upwind_T_C as number[], UPH = wx.upwind_t_h as number[];
const S19: React.FC = () => {
  const f = useCurrentFrame(), k = 18;
  const t = [0, 1, 2, 3].map((j) => SS(k, j));
  const g = GM, P0 = gP(g, PIN);
  const n = wx.t_h.length - 1; // 121 samples over 6 h
  // M1 (review 4): the clock follows sentence 4 — 0 h on "thirteen", 1 h on "twelve point eight two", 2 h on
  // "twelve point six four" (about 1 h per 1.6 s), then on at the same pace to 3 h (12.46 °C, the third upwind dot) and
  // holds there: running on to 6 h would need 4 h in the last ~2 s of the scene, racing past the spoken 12.64.
  const h0 = AT(k, 3, "thirteen"), h1 = AT(k, 3, "twelve point eight two"), h2 = AT(k, 3, "twelve point six four");
  const hours = f < h0 ? 0 : f < h1 ? (f - h0) / (h1 - h0) : Math.min(3, 1 + (f - h1) / (h2 - h1));
  const secPerH = (h2 - h0) / 2 / FPS;
  const run = hours / 6, kx = run * n;
  const Tpole = atIdx(wx.T_pole, kx), shift = atIdx(wx.shift_km, kx);
  const balk: Pt = [atIdx(wx.balloon6_x_km, kx), atIdx(wx.balloon6_y_km, kx)];

  const bal = gP(g, balk);
  const balDX = 40 * (1 - clamp(hours / 0.6, 0, 1));                        // beside the pole while both are at the pin
  const oBalIn = clamp((bal[1] - 97 - g.my) / 30, 0, 1);                     // icon top (97 px above the anchor) inside the map
  const offMap = oBalIn < 0.5;
  const oUp = ramp(f, t[1], t[1] + 14), oDots = ramp(f, t[2], t[2] + 14), oChip = ramp(f, AT(k, 2, "in two hours"), AT(k, 2, "in two hours") + 12);
  const far = gP(g, [PIN[0] - VV[0] * 4 * 3.6, PIN[1] - VV[1] * 4 * 3.6]); // 4 h upwind (km)
  const vs = vScr(US), vT: Pt = [P0[0] + vs[0], P0[1] + vs[1]];
  const back = unit(P0, far);
  return (
    <Scene>
      <Svg>
        <ClipMap g={g} id="clip19">
          <TMap g={g} G={wx.dTdx_K_m} shiftKm={shift} />
          <Dash p={P0} q={far} c={TEAL} w={4} d="12 8" o={oUp} />
          {UPH.map((h, i) => {
            const pos = lerp(gP(g, [UPX[i], UPY[i]]), P0, hours / h);
            const arrived = hours >= h;
            const o = oDots * (1 - ramp(hours, h + 0.25, h + 0.6));
            return (
              <g key={h} opacity={o}>
                <circle cx={pos[0]} cy={pos[1]} r={11} fill={tColor(UPT[i])} stroke={INK} strokeWidth={3} />
                <Lbl x={pos[0] - 18} y={pos[1] - 4} t={`arrives in ${h} h · ${UPT[i].toFixed(2)} °C`} c={INK} s={26} a="end" b o={arrived ? 0 : 1} />
              </g>
            );
          })}
        </ClipMap>
        <MapFrame g={g} />
        <ColourBar />
        <Arrow p={[far[0] + back[0] * 70, far[1] + back[1] * 70]} q={far} color={TEAL} w={6} head={20} o={oUp} />
        <Lbl x={far[0] + 20} y={far[1] + 10} t="upwind = where the wind comes from" c={TEAL} s={26} b o={oUp} />
        <Arrow p={P0} q={[P0[0] + GL, P0[1]]} color={ORANGE} w={6} halo />
        <Arrow p={P0} q={vT} color={TEAL} w={6} halo />
        <Lbl x={P0[0] + GL + 10} y={P0[1]} t="∇T" c={ORANGE} s={30} b />
        <Lbl x={vT[0] + 10} y={vT[1] - 4} t="v" c={TEAL} s={30} b />
        {/* S1: the balloon is shown from the start (drawn just right of the pole while they share the pin) and fades
            out at the top edge of the map; then a tag on the map says where it went */}
        <BalloonThermometer x={bal[0] + balDX} y={bal[1]} s={0.55} o={oBalIn} />
        <Lbl x={bal[0] + balDX + 24} y={bal[1] - 66} t="balloon: 13.00 °C" c={INK} s={26} b o={clamp(2 * oBalIn - 1, 0, 1)} />
        <Lbl x={clamp(bal[0], g.mx + 200, g.mx + g.w * g.km - 200)} y={g.my + 24} t="balloon (off the map): 13.00 °C" c={INK} s={26} b a="middle" o={clamp(1 - 2 * oBalIn, 0, 1)} />
        <PoleThermometer x={P0[0]} y={P0[1]} s={0.8} />
        <Lbl x={P0[0] - 26} y={P0[1] - 130} t={`pole: ${Tpole.toFixed(2)} °C`} c={INK} s={30} a="end" b />
      </Svg>
      <TeX s={rep(EQ_P19, "= -0.180", `= ${col(ROSE, "-")}0.180`)} x={RX} y={160} size={32} d />
      <div style={{ position: "absolute", left: RX, top: 250, width: RW, ...FONT, fontSize: 28, background: HOUSE.panel,
        borderRadius: 12, padding: "10px 18px", boxSizing: "border-box", lineHeight: 1.4 }}>
        <div style={{ color: MUTED, fontSize: 28 }}>clock: 1 h in {secPerH.toFixed(1)} s · t = {hours.toFixed(2)} h</div>
        <div>pole (fixed): <b>{Tpole.toFixed(2)} °C</b></div>
        <div>balloon{offMap ? " (off the map)" : ""}: <b>13.00 °C</b>, keeps its temperature</div>
      </div>
      <Chip text={<><TeXi s={EQ_TUP} size={30} /><br />0.180 °C colder per hour of travel</>} x={RX} y={430} size={26} color={TEAL} o={oChip} />
      <Txt x={RX} y={570} w={RW} s={28} o={oDots}>the air reaching the pole comes from colder places upwind</Txt>
    </Scene>
  );
};

// ---------------------------------------------------------------- s20 twice as steep
const EQ_V20_HL = rep(EQ_V20, String.raw`2.00\times10^{-5}\ \mathrm{K\,m^{-1}}`, col(ORANGE, String.raw`2.00\times10^{-5}\ \mathrm{K\,m^{-1}}`));
const S20: React.FC = () => {
  const f = useCurrentFrame(), k = 19;
  const t = [0, 1, 2, 3].map((j) => SS(k, j));
  const steep = ramp(f, 10, 30), oSh = ramp(f, t[1], t[1] + 14), oEq = ramp(f, t[2], t[2] + 14), oCard = ramp(f, t[3], t[3] + 14);
  const n = wx.t_h.length - 1;
  const run = clamp((f - t[2] - 10) / 180, 0, 1), kx = run * n, hours = atIdx(wx.t_h, kx);
  const Tp = atIdx(wx.T_pole_steep, kx);
  const g = GM, P0 = gP(g, PIN);
  const GLk = GL * (1 + steep);
  const vs = vScr(US), vT: Pt = [P0[0] + vs[0], P0[1] + vs[1]], sh: Pt = [P0[0] + wx.shadow_steep_m_s * US, P0[1]];
  const shift = atIdx(wx.shift_km, kx);
  return (
    <Scene>
      <Svg>
        <ClipMap g={g} id="clip20">
          {steep < 1 ? <TMap g={g} G={wx.dTdx_K_m} shiftKm={0} /> : null}
          <TMap g={g} G={wx.gradT_steep[0]} shiftKm={steep >= 1 ? shift : 0} tWest={wx.T_west_steep} o={steep} />
        </ClipMap>
        <MapFrame g={g} />
        <ColourBar />
        <Band p={P0} q={sh} color={TEAL} o={oSh > 0 ? 1 : 0.5} />
        <Arrow p={P0} q={[P0[0] + GLk, P0[1]]} color={ORANGE} w={7} halo />
        <Arrow p={P0} q={vT} color={TEAL} w={7} halo />
        <Lbl x={P0[0] + GLk + 12} y={P0[1]} t="∇T" c={ORANGE} s={32} b />
        <Lbl x={vT[0] + 12} y={vT[1] - 6} t="v" c={TEAL} s={32} b />
        <Lbl x={P0[0] + 4} y={P0[1] + 30} t="shadow" c={TEAL} s={24} b o={oSh} />
        <PoleThermometer x={P0[0]} y={P0[1]} s={0.8} />
        <Lbl x={P0[0] - 26} y={P0[1] - 130} t={`pole: ${Tp.toFixed(2)} °C`} c={INK} s={30} a="end" b />
      </Svg>
      <Chip text="same place, map twice as steep: 2 °C per 100 km — clock restarts" x={RX} y={165} w={RW} size={26} color={ORANGE} o={steep} />
      <Txt x={RX} y={240} w={RW} s={28} c={TEAL} o={oSh}>shadow of v on ∇T: still <b>{wx.shadow_steep_m_s.toFixed(2)} m/s</b> — it belongs to the wind alone</Txt>
      <TeX s={EQ_V20_HL} x={RX - 30} y={330} size={25} o={oEq} />
      <Txt x={RX} y={392} w={RW} s={28} o={oEq}>clock 6 h in 6 s · t = {hours.toFixed(2)} h · pole <b>{Tp.toFixed(2)} °C</b></Txt>
      <Txt x={RX} y={438} w={RW} s={28} o={oEq}>∂T/∂t = <span style={{ color: ROSE }}>−</span>{Math.abs(wx.dTdt_K_h_steep).toFixed(3)} K per hour: <b>twice as fast</b></Txt>
      <div style={{ position: "absolute", left: RX, top: 510, width: RW, ...FONT, fontSize: 28, opacity: oCard, lineHeight: 1.25 }}>
        <div style={{ borderLeft: `6px solid ${TEAL}`, paddingLeft: 14, marginBottom: 14 }}>
          shadow |v| cos θ: <b>{wx.shadow_m_s.toFixed(2)} m/s</b> on both maps → only the wind
        </div>
        <div style={{ borderLeft: `6px solid ${ORANGE}`, paddingLeft: 14 }}>
          v·∇T: {wx.K_per_h.toFixed(3)} → {wx.K_per_h_steep.toFixed(3)} K per hour → the wind AND the map
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 660 - 965, width: 1920, height: 1080 }}><Slots filled={[0, 1, 2]} glow={oCard > 0.5 ? 2 : -1} o={oCard} /></div>
      <Txt x={RX} y={758} w={RW} s={28} c={GOLD} o={ramp(f, t[3] + 20, t[3] + 32)} align="right">reason 3: the dot product holds both sizes</Txt>
    </Scene>
  );
};

// ---------------------------------------------------------------- s21 recap
const RecapIcon: React.FC<{ i: number }> = ({ i }) => {
  if (i === 0) { const P = mkP(30, 90, 18); const O = P(0, 0);
    return <g><polygon points={[O, P(...PAB), P(PAB[0] + pair.k_cross_b[0], PAB[1] + pair.k_cross_b[1]), P(...(pair.k_cross_b as Pt))].map((p) => p.join(",")).join(" ")} fill="rgba(232,236,244,0.18)" stroke={INK} strokeWidth={2} transform="translate(56 0)" />
      <g transform="translate(56 0)"><Band p={O} q={P(...PAB)} color={TEAL} w={8} /><Arrow p={O} q={P(...B)} color={ORANGE} w={3} head={10} /><Arrow p={O} q={P(...A)} color={TEAL} w={3} head={10} /></g></g>; }
  if (i === 1) return <g>{[0, 1, 2].map((j) => { const O: Pt = [22 + j * 56, 70]; const q = same.q[j] as Pt;
    return <g key={j}><Arrow p={O} q={[O[0] + 30, O[1]]} color={TEAL} w={3} head={9} /><Arrow p={O} q={[O[0] + q[0] * 12, O[1] - q[1] * 12]} color={ORANGE} w={3} head={9} /></g>; })}</g>;
  if (i === 2) return <g><Arrow p={[40, 100]} q={[100, 20]} color={TEAL} w={4} head={12} /><Arrow p={[40, 100]} q={[70, 100]} color={ORANGE} w={4} head={10} /><Band p={[40, 100]} q={[100, 100]} color={TEAL} w={6} /></g>;
  return <g><rect x={10} y={70} width={60} height={20} rx={5} fill="#3a4766" stroke="#9aa6bd" strokeWidth={2} /><Arrow p={[70, 80]} q={[110, 40]} color={TEAL} w={3} head={10} />
    <rect x={120} y={20} width={40} height={70} fill={tColor(12)} /><rect x={140} y={20} width={30} height={70} fill={tColor(15)} /><Arrow p={[130, 70]} q={[165, 70]} color={ORANGE} w={3} head={9} /></g>;
};
const S21: React.FC = () => {
  const f = useCurrentFrame(), k = 20;
  const oH = ramp(f, 4, 16);
  const oRow = [1, 2, 3, 4].map((j) => ramp(f, SS(k, j), SS(k, j) + 14));
  const rows: { text: React.ReactNode; eq?: string }[] = [
    { text: "how much two arrows point the same way, times both their lengths:", eq: EQ_R1 },
    { text: <>its sign:&nbsp; <b>+</b> same way · <b>0</b> at a right angle · <b style={{ color: ROSE }}>−</b> opposite directions</> },
    { text: "with a unit vector it gives a component:", eq: EQ_R3 },
    { text: "in physics it joins a direction with a size:", eq: EQ_R4 },
  ];
  return (
    <Scene>
      <Txt x={0} y={160} w={1920} s={46} o={oH} align="center" bold>So what does the dot product measure?</Txt>
      {rows.map((r, i) => (
        <div key={i} style={{ position: "absolute", left: 120, top: 250 + i * 138, width: 1700, height: 124, opacity: oRow[i], display: "flex", alignItems: "center", gap: 30,
          background: HOUSE.panel, borderRadius: 14, borderLeft: `6px solid ${ACC}`, boxSizing: "border-box", padding: "0 24px", ...FONT }}>
          <svg width={180} height={120} style={{ flex: "0 0 auto" }}><RecapIcon i={i} /></svg>
          <div>
            <div style={{ fontSize: 36 }}>{r.text}</div>
            {r.eq ? <div style={{ marginTop: 4 }}><TeXi s={r.eq} size={38} />{i === 2 ? <span style={{ fontSize: 32, color: MUTED }}>&nbsp; the eastward wind</span> : null}</div> : null}
          </div>
        </div>
      ))}
    </Scene>
  );
};

// ---------------------------------------------------------------- s22 end card (links)
const S22: React.FC = () => {
  const f = useCurrentFrame();
  const o = ramp(f, 0, 15);
  const link = (title: string, url: string, icon: string) => (
    <div style={{ display: "flex", gap: 28, alignItems: "center", background: HOUSE.panel, borderRadius: 16, padding: "22px 34px", border: `2px solid ${HOUSE.grid}` }}>
      <div style={{ fontSize: 56 }}>{icon}</div>
      <div><div style={{ fontSize: 44, fontWeight: 700 }}>{title}</div><div style={{ fontSize: 32, color: ACC }}>{url}</div></div>
    </div>
  );
  return (
    <Scene>
      <div style={{ position: "absolute", left: 200, top: 260, width: 1520, display: "flex", flexDirection: "column", gap: 40, opacity: o, ...FONT }}>
        {link("Vector products lab", "https://shammun.github.io/aofd/viz/ch00/vector_products_lab.html", "🎮")}
        {link("Notebook, the dot product", "https://shammun.github.io/aofd/notebooks/poc_ch00a_dot.html", "📓")}
        <div style={{ fontSize: 28, color: MUTED, marginTop: 20 }}>Made with tested fluidpy physics · shammun.github.io/aofd</div>
      </div>
    </Scene>
  );
};

const SCENES = [S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22];
if (SCENES.length !== sc.length) throw new Error(`${SCENES.length} scene components but ${sc.length} scenes in timing.json`);
if (TITLES.length !== sc.length) throw new Error(`${TITLES.length} titles but ${sc.length} scenes`);

/** The SceneTitle band, drawn once above every scene so it never disappears at a cut. */
const TitleLayer: React.FC = () => {
  const f = useCurrentFrame();
  let k = 0;
  while (k < sc.length - 1 && f >= END[k]) k++;
  const T = TITLES[k];
  return <SceneTitle f={f - CUT[k]} kicker={T.kicker} title={T.text} index={k + 1} total={sc.length} partChange={!!T.part}
    outAt={k < sc.length - 1 ? LEN(k) : undefined} />;
};

export const DotProductWhy: React.FC<{ audio?: string }> = ({ audio = "narration_music.wav" }) => (
  <AbsoluteFill style={{ background: HOUSE.bg }}>
    {SCENES.map((S, k) => (
      <Sequence key={sc[k].id} name={sc[k].id} from={CUT[k]} durationInFrames={LEN(k)}><S /></Sequence>
    ))}
    <TitleLayer />
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
