import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { EndCard, EqLine, HOUSE, ScaleBadge, TERM, ramp, tex } from "../house";
import timing from "../../ch00/ch00_dot_product_why/timing.json";
import pair from "../../ch00/ch00_dot_product_why/data/s1_s3_pair.json";
import cheap from "../../ch00/ch00_dot_product_why/data/s4_cheap.json";
import work from "../../ch00/ch00_dot_product_why/data/s5_work.json";
import adv from "../../ch00/ch00_dot_product_why/data/s6_s7_advection.json";
import sign from "../../ch00/ch00_dot_product_why/data/s8_sign.json";

/**
 * Chapter 0A movie "Why times the other length? What the dot product really measures"
 * (movies/ch00/ch00_dot_product_why/storyboard.yaml), 1920×1080, 30 fps, ≈170 s.
 * Every number on screen is read from data/*.json, written by movies/data/build_ch00_dot_product_why.py from the tested
 * fluidpy.geo.vectors functions (dot, norm, angle_between, scalar_projection, projection, k_cross). This file only
 * indexes those samples by frame. Scene cuts and reveals come from timing.json (tools/tts.py, af_bella ×1.0).
 * Rules: a·b is never an arrow (number, gauge, or the shadow × length rectangle); a/first vector teal, b/second orange;
 * a shadow takes the colour of the arrow that casts it; negative products rose + hatched + dashed outline.
 */

export const DPW_FPS = 30;
const sc = timing.scenes;
export const DPW_FRAMES = Math.max(5100, timing.total_frames + 15); // narration + silent hold on the end card (170.0 s)
const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * DPW_FPS)));
const END = [...CUT.slice(1), DPW_FRAMES];
/** start / end frame of sentence j of scene k, relative to the scene's first frame */
const SS = (k: number, j: number) => Math.round(sc[k].sentences[j].start * DPW_FPS) - CUT[k];
const SE = (k: number, j: number) => Math.round(sc[k].sentences[j].end * DPW_FPS) - CUT[k];

// ---------------------------------------------------------------- equations (verbatim from the storyboard)
const EQ_K22 = String.raw`\mathbf a\cdot\mathbf b = a_1b_1 + a_2b_2 + a_3b_3 = a_ib_i`;
const EQ_0A1 = String.raw`\mathbf a\cdot\mathbf b = |\mathbf a|\,|\mathbf b|\cos\theta = (|\mathbf a|\cos\theta)\,|\mathbf b|`;
const EQ_0A3 = String.raw`|\mathbf a|\cos\theta = \mathbf a\cdot\hat{\mathbf b} = \frac{\mathbf a\cdot\mathbf b}{|\mathbf b|},\qquad \hat{\mathbf b} = \frac{\mathbf b}{|\mathbf b|}`;
const EQ_SYM = String.raw`\mathbf a\cdot\mathbf b = (|\mathbf a|\cos\theta)\,|\mathbf b| = (|\mathbf b|\cos\theta)\,|\mathbf a| = \mathbf b\cdot\mathbf a`;
const EQ_W = String.raw`W = \mathbf F\cdot\mathbf d = |\mathbf F|\,|\mathbf d|\cos\theta`;
const EQ_17 = String.raw`\frac{D\varphi}{Dt} = \frac{\partial\varphi}{\partial t} + (\mathbf v\cdot\nabla)\varphi`;
const EQ_DTDT = String.raw`\frac{\partial T}{\partial t} = -\,\mathbf u\cdot\nabla T \quad\text{when } \frac{DT}{Dt} = 0`;
const EQ_COS = String.raw`\cos\theta = \frac{\mathbf a\cdot\mathbf b}{|\mathbf a|\,|\mathbf b|}`;

const TEAL = HOUSE.glyphA, ORANGE = HOUSE.glyphB, ROSE = TERM.friction, INK = HOUSE.ink, MUTED = HOUSE.muted;
const col = (c: string, s: string) => `\\textcolor{${c}}{${s}}`;
// highlighted variants: colour/box applied by string replacement only, so the plain storyboard TeX stays in this file
const EQ_K22_HL = EQ_K22.replace("a_1b_1", col(TEAL, "a_1b_1")).replace("a_2b_2", col(TEAL, "a_2b_2"));
const BOX_TERM = String.raw`(|\mathbf a|\cos\theta)`;
const EQ_0A1_BOX = EQ_0A1.replace(BOX_TERM, col(TEAL, `\\boxed{${BOX_TERM}}`));
const ADV_TERM = String.raw`(\mathbf v\cdot\nabla)\varphi`;
const EQ_17_BOX = EQ_17.replace(ADV_TERM, col(TEAL, `\\boxed{${ADV_TERM}}`));
const DTDT_TERM = String.raw`-\,\mathbf u\cdot\nabla T`;
const EQ_DTDT_HL = EQ_DTDT.replace(DTDT_TERM, col(TEAL, DTDT_TERM));

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

// ---------------------------------------------------------------- drawing kit (SVG, px)
type Pt = [number, number];
const mkP = (ox: number, oy: number, u: number) => (x: number, y: number): Pt => [ox + x * u, oy - y * u];
const lerp = (p: Pt, q: Pt, t: number): Pt => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];

const Arrow: React.FC<{ p: Pt; q: Pt; color: string; w?: number; head?: number; o?: number }> = ({
  p, q, color, w = 6, head = 26, o = 1,
}) => {
  const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
  if (L < 1) return null;
  const ux = dx / L, uy = dy / L, h = Math.min(head, L * 0.5), nx = -uy, ny = ux;
  const bx = q[0] - ux * h, by = q[1] - uy * h;
  return (
    <g opacity={o}>
      <line x1={p[0]} y1={p[1]} x2={q[0] - ux * h * 0.6} y2={q[1] - uy * h * 0.6} stroke={color} strokeWidth={w}
        strokeLinecap="round" />
      <polygon points={`${q[0]},${q[1]} ${bx + nx * h * 0.5},${by + ny * h * 0.5} ${bx - nx * h * 0.5},${by - ny * h * 0.5}`}
        fill={color} />
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

const Grid: React.FC<{ P: (x: number, y: number) => Pt; xr: [number, number]; yr: [number, number]; o?: number }> = ({
  P, xr, yr, o = 1,
}) => {
  const ls = [];
  for (let x = xr[0]; x <= xr[1]; x++) {
    const [a, b] = [P(x, yr[0]), P(x, yr[1])];
    ls.push(<line key={`x${x}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={x === 0 ? "#4a5677" : HOUSE.grid}
      strokeWidth={x === 0 ? 3 : 1.5} />);
  }
  for (let y = yr[0]; y <= yr[1]; y++) {
    const [a, b] = [P(xr[0], y), P(xr[1], y)];
    ls.push(<line key={`y${y}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={y === 0 ? "#4a5677" : HOUSE.grid}
      strokeWidth={y === 0 ? 3 : 1.5} />);
  }
  return <g opacity={o}>{ls}</g>;
};

/** Thick translucent band on a line: the shadow (colour of the arrow that casts it). */
const Band: React.FC<{ p: Pt; q: Pt; color: string; o?: number; w?: number }> = ({ p, q, color, o = 1, w = 16 }) => (
  Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.5 ? null :
    <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={color} strokeWidth={w} strokeOpacity={0.7 * o}
      strokeLinecap="butt" />
);

const Dash: React.FC<{ p: Pt; q: Pt; c?: string; o?: number; w?: number; d?: string }> = ({
  p, q, c = INK, o = 1, w = 3, d = "10 9",
}) => <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={c} strokeWidth={w} strokeDasharray={d} opacity={o} />;

/** Right-angle tick at `at`, sides along unit screen directions u1, u2. */
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
      {label ? <Lbl x={mid[0] + nx * lo * Math.sign(off)} y={mid[1] + ny * lo * Math.sign(off)} t={label} c={c} s={s} a={a} /> : null}
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
const Arc: React.FC<{ P: (x: number, y: number) => Pt; a0: number; a1: number; r: number; c?: string; o?: number }> = ({
  P, a0, a1, r, c = INK, o = 1,
}) => {
  const n = 40, pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    pts.push(P(r * Math.cos(t), r * Math.sin(t)).join(","));
  }
  return <polyline points={pts.join(" ")} fill="none" stroke={c} strokeWidth={3} opacity={o} />;
};

/** Horizontal number-line gauge for a scalar (never an arrow in space). */
const Gauge: React.FC<{ x: number; y: number; w: number; min: number; max: number; step: number; value: number;
  label: string; readout?: string; o?: number; dec?: number }> = ({ x, y, w, min, max, step, value, label, readout, o = 1, dec = 3 }) => {
  const X = (v: number) => x + ((v - min) / (max - min)) * w;
  const ticks = [];
  const k0 = Math.ceil(min / step - 1e-9), k1 = Math.floor(max / step + 1e-9);
  for (let k = k0; k <= k1; k++) {
    const v = k * step;
    ticks.push(
      <g key={k}>
        <line x1={X(v)} y1={y - (v === 0 ? 16 : 10)} x2={X(v)} y2={y + (v === 0 ? 16 : 10)} stroke={v === 0 ? INK : MUTED}
          strokeWidth={v === 0 ? 3 : 2} />
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
      <Lbl x={x} y={y - 96} t={label} c={MUTED} s={30} a="start" />
      <line x1={mx} y1={y - 26} x2={mx} y2={y + 4} stroke={neg ? ROSE : INK} strokeWidth={5} />
      <polygon points={`${mx},${y + 2} ${mx - 13},${y - 22} ${mx + 13},${y - 22}`} fill={neg ? ROSE : INK} />
      <Lbl x={mx} y={y - 50} t={readout ?? fs(value, dec)} c={neg ? ROSE : INK} s={32} a="middle" b />
    </g>
  );
};

const Chip: React.FC<{ text: string; x: number; y: number; color?: string; size?: number; o?: number; w?: number }> = ({
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
/** An EqLine centred in a box (the house EqLine centres in its parent), equation number at the right. */
const NUMW = 170;
const EqBox: React.FC<{ latex: string; x: number; y: number; w: number; h?: number; size?: number; number?: string; o?: number;
  nw?: number }> = ({ latex, x, y, w, h = 120, size = 42, number, o = 1, nw = NUMW }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o }}>
    {/* the house EqLine's number is 0.55 × size (≈ 7 px at 640 wide); the number is drawn here at 30 px instead */}
    <div style={{ position: "absolute", left: 0, top: 0, width: number ? w - nw : w, height: h }}>
      <EqLine latex={latex} size={size} y={50} />
    </div>
    {number ? <div style={{ position: "absolute", right: 0, width: nw - 10, top: "50%", transform: "translateY(-50%)",
      ...FONT, fontSize: 30, color: MUTED, textAlign: "right", lineHeight: 1.15 }}>({number})</div> : null}
  </div>
);
const TeX: React.FC<{ s: string; x: number; y: number; size?: number; o?: number; c?: string }> = ({ s, x, y, size = 34, o = 1, c = INK }) => (
  <div style={{ position: "absolute", left: x, top: y, fontSize: size, color: c, opacity: o }}
    dangerouslySetInnerHTML={{ __html: tex(s, false) }} />
);
/** House ScaleBadge, enlarged 1.15× so its 26-px text stays legible at 640 px wide. */
const Badge: React.FC<{ detail: string; corner?: "tl" | "tr" | "bl" | "br"; o?: number }> = ({ detail, corner = "tr", o = 1 }) => (
  <div style={{ position: "absolute", inset: 0, opacity: o, transform: "scale(1.15)",
    transformOrigin: { tl: "top left", tr: "top right", bl: "bottom left", br: "bottom right" }[corner] }}>
    <ScaleBadge detail={detail} corner={corner} />
  </div>
);
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>{children}</svg>
);

// ---------------------------------------------------------------- data shortcuts
const A = pair.a as Pt, B = pair.b as Pt;
const NA = pair.norm_a, NB = pair.norm_b, TH = pair.theta_deg, AB = pair.a_dot_b;
const SHAB = pair.shadow_a_on_b, SHBA = pair.shadow_b_on_a;
const PAB = pair.proj_a_on_b as Pt, PBA = pair.proj_b_on_a as Pt;
const PHI_A = (Math.atan2(A[1], A[0]) * 180) / Math.PI, PHI_B = (Math.atan2(B[1], B[0]) * 180) / Math.PI;
const nL_B: Pt = [pair.k_cross_b[0] / NB, pair.k_cross_b[1] / NB]; // unit left normal of b (k × b̂)

// =============================================================== s1 + s2: the pair on one plane
const P12 = mkP(400, 770, 100);
const PairBase: React.FC<{ g?: number; shadow?: number; drop?: number; dim?: number }> = ({ g = 1, shadow = 1, drop = 1, dim = 1 }) => {
  const P = P12, O = P(0, 0);
  const aT = P(A[0] * g, A[1] * g), bT = P(B[0] * g, B[1] * g);
  const aTip = P(...A), foot = P(...PAB);
  return (
    <g>
      <Grid P={P} xr={[-3, 5]} yr={[-2, 6]} />
      <Dash p={P(-B[0] * 0.6, -B[1] * 0.6)} q={P(B[0] * 1.6, B[1] * 1.6)} c={ORANGE} o={0.35 * g} w={2} />
      <Band p={O} q={lerp(O, foot, shadow)} color={TEAL} o={shadow > 0 ? 1 : 0} />
      <Arrow p={O} q={bT} color={ORANGE} o={dim} />
      <Arrow p={O} q={aT} color={TEAL} o={dim} />
      {drop > 0 ? <Dash p={aTip} q={lerp(aTip, foot, drop)} c={INK} o={0.85} /> : null}
      {shadow > 0.99 ? <RightTick at={foot} u1={unit(foot, O)} u2={unit(foot, aTip)} /> : null}
      <Lbl x={P(0, 0)[0] - 18} y={P(0, 0)[1] + 26} t="O" c={MUTED} s={30} a="end" />
      <Lbl x={P(5.2, 1)[0]} y={P(5.2, 1)[1]} t="a" c={TEAL} s={44} b o={g} />
      <Lbl x={P(1.1, 3.25)[0]} y={P(1.1, 3.25)[1]} t="b" c={ORANGE} s={44} b o={g} />
    </g>
  );
};
const GridNote: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <Txt x={40} y={1018} s={28} c={MUTED} o={o}>1 grid square = 1 unit (equal axes)</Txt>
);

const S1: React.FC = () => {
  const f = useCurrentFrame();
  const g = ramp(f, 0, 30), drop = ramp(f, 60, 80), sh = ramp(f, 80, 110), lab = ramp(f, 95, 110);
  const t2 = SS(0, 1);
  const q = ramp(f, t2, t2 + 12);
  const pulse = 0.6 + 0.4 * Math.sin(Math.PI * clamp((f - t2 - 15) / 30, 0, 1));
  const P = P12;
  const off = 0.45;
  return (
    <AbsoluteFill style={{ background: HOUSE.bg }}>
      <Svg>
        <PairBase g={g} shadow={sh} drop={drop} />
        <Lbl x={P(-0.35, 0.9)[0] - 8} y={P(-0.35, 0.9)[1]} t="shadow of a on b" c={TEAL} s={34} a="end" o={lab} b />
        <Lbl x={P(-0.35, 0.9)[0] - 8} y={P(-0.35, 0.9)[1] + 44} t="× |b| ?" c={INK} s={40} a="end" o={q} b />
        <g opacity={q * pulse}>
          <Bracket p={P(nL_B[0] * off, nL_B[1] * off)} q={P(B[0] + nL_B[0] * off, B[1] + nL_B[1] * off)} off={0} c={ORANGE} />
          <Lbl x={P(B[0] * 0.5 + nL_B[0] * 0.85, B[1] * 0.5 + nL_B[1] * 0.85)[0]}
            y={P(B[0] * 0.5 + nL_B[0] * 0.85, B[1] * 0.5 + nL_B[1] * 0.85)[1]} t="|b|" c={ORANGE} s={36} a="end" b />
        </g>
      </Svg>
      <div style={{ position: "absolute", left: 60, top: 40, ...FONT, fontSize: 48, fontWeight: 600, lineHeight: 1.3,
        background: "rgba(24,32,50,0.92)", borderRadius: 12, padding: "14px 26px", border: `2px solid ${HOUSE.accent}` }}>
        The shadow of <span style={{ color: TEAL }}>a</span> on <span style={{ color: ORANGE }}>b</span> looks like the answer.<br />
        So why does <b>a·b</b> multiply it by <span style={{ color: ORANGE }}>|b|</span>?
      </div>
      <GridNote o={g} />
    </AbsoluteFill>
  );
};

const PX = 1010, PW = 870; // right equation panel (s2, s4)
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const P = P12, O = P(0, 0);
  const t1 = SS(1, 1), t2 = SS(1, 2), t3 = SS(1, 3);
  const oChips = ramp(f, 0, 12), oLegs = ramp(f, 6, 20) * (1 - ramp(f, t2 - 6, t2 + 6));
  const oK = ramp(f, t1, t1 + 12), oSum = ramp(f, t1 + 30, t1 + 42), oG = ramp(f, t1 + 50, t1 + 62);
  const oGeo = ramp(f, t2, t2 + 12), oNum = ramp(f, t2 + 40, t2 + 52);
  const oBox = ramp(f, t3, t3 + 12), o03 = ramp(f, t3 + 45, t3 + 57);
  const off = 0.45;
  const nR_A: Pt = [-pair.k_cross_a[0] / NA, -pair.k_cross_a[1] / NA];
  const cosT = pair.cos_theta;
  const sumTex = String.raw`\boxed{${col(TEAL, "5")}\cdot ${col(ORANGE, "1")}} + \boxed{${col(TEAL, "1")}\cdot ${col(ORANGE, "3")}} + ${col("#5c6680", "0\\cdot 0")} = ${AB.toFixed(0)}`;
  return (
    <AbsoluteFill style={{ background: HOUSE.bg }}>
      <Svg>
        <PairBase />
        {/* component legs */}
        <g opacity={oLegs}>
          <Dash p={O} q={P(A[0], 0)} c={TEAL} w={4} d="4 8" />
          <Dash p={P(A[0], 0)} q={P(...A)} c={TEAL} w={4} d="4 8" />
          <Lbl x={P(2.5, -0.35)[0]} y={P(2.5, -0.35)[1]} t="5" c={TEAL} s={34} a="middle" b />
          <Lbl x={P(5.25, 0.5)[0]} y={P(5.25, 0.5)[1]} t="1" c={TEAL} s={34} b />
          <Dash p={O} q={P(0, B[1])} c={ORANGE} w={4} d="4 8" />
          <Dash p={P(0, B[1])} q={P(...B)} c={ORANGE} w={4} d="4 8" />
          <Lbl x={P(-0.3, 2.6)[0]} y={P(-0.3, 2.6)[1]} t="3" c={ORANGE} s={34} a="end" b />
          <Lbl x={P(0.5, 3.4)[0]} y={P(0.5, 3.4)[1]} t="1" c={ORANGE} s={34} a="middle" b />
        </g>
        {/* (iii) angle and lengths */}
        <g opacity={oGeo}>
          <Arc P={P} a0={PHI_A} a1={PHI_B} r={0.8} />
          <Lbl x={P(1.05, 0.9)[0]} y={P(1.05, 0.9)[1]} t={`θ = ${TH.toFixed(1)}°`} s={32} />
          <Bracket p={P(nR_A[0] * off, nR_A[1] * off)} q={P(A[0] + nR_A[0] * off, A[1] + nR_A[1] * off)} off={0} c={TEAL} />
          <Lbl x={P(2.5 + nR_A[0] * 1.0, 0.5 + nR_A[1] * 1.0)[0]} y={P(2.5 + nR_A[0] * 1.0, 0.5 + nR_A[1] * 1.0)[1]}
            t={`|a| = ${NA.toFixed(3)}`} c={TEAL} s={32} a="middle" b />
          <Bracket p={P(nL_B[0] * off, nL_B[1] * off)} q={P(B[0] + nL_B[0] * off, B[1] + nL_B[1] * off)} off={0} c={ORANGE} />
          <Lbl x={P(B[0] * 0.5 + nL_B[0] * 0.8, B[1] * 0.5 + nL_B[1] * 0.8)[0]}
            y={P(B[0] * 0.5 + nL_B[0] * 0.8, B[1] * 0.5 + nL_B[1] * 0.8)[1]} t={`|b| = ${NB.toFixed(3)}`} c={ORANGE} s={32} a="end" b />
        </g>
        {/* (iv) the shadow is |a| cos θ */}
        <g opacity={oBox}>
          <Lbl x={P(-0.35, 0.9)[0] - 8} y={P(-0.35, 0.9)[1]} t={`|a| cos θ = ${SHAB.toFixed(3)}`} c={TEAL} s={34} a="end" b />
          <Lbl x={P(-0.35, 0.9)[0] - 8} y={P(-0.35, 0.9)[1] + 42} t="= shadow of a on b" c={TEAL} s={32} a="end" />
          <Dash p={[PX - 4, 352]} q={P(PAB[0] * 0.5, PAB[1] * 0.5)} c={TEAL} w={2} d="3 7" />
        </g>
        <Gauge x={PX + 40} y={930} w={PW - 80} min={-16.1} max={16.1} step={4} value={AB} label="a·b (a number, not an arrow)" o={oG} />
      </Svg>
      <Chip text="a = (5, 1)" x={110} y={220} color={TEAL} o={oChips} />
      <Chip text="b = (1, 3)" x={110} y={290} color={ORANGE} o={oChips} />
      <EqBox latex={EQ_K22_HL} x={PX - 40} y={70} w={PW + 50} size={36} number="K 2.2" o={oK} />
      <div style={{ position: "absolute", left: PX, width: PW, top: 182, textAlign: "center", opacity: oSum, fontSize: 38, color: INK }}
        dangerouslySetInnerHTML={{ __html: tex(sumTex, false) }} />
      <Txt x={PX} y={240} w={PW} s={28} c={MUTED} o={oSum} align="center">flat picture: the z-parts are 0</Txt>
      <EqBox latex={oBox > 0 ? EQ_0A1_BOX : EQ_0A1} x={PX - 40} y={290} w={PW + 50} size={34} number="0A.1" o={oGeo} />
      <Txt x={PX + 30} y={410} w={PW - 30} s={32} o={oNum}>
        = {NA.toFixed(3)} × {NB.toFixed(3)} × cos {TH.toFixed(1)}°<br />= {NA.toFixed(3)} × {NB.toFixed(3)} × {cosT.toFixed(3)} = <b>{AB.toFixed(3)}</b>
      </Txt>
      <EqBox latex={EQ_0A3} x={PX - 40} y={540} w={PW + 50} h={130} size={31} number="0A.3" o={o03} />
      <Txt x={PX} y={680} w={PW} s={30} c={TEAL} o={o03} align="center">|a| cos θ = 8 ÷ {NB.toFixed(3)} = {SHAB.toFixed(3)} = the shadow</Txt>
      <GridNote />
    </AbsoluteFill>
  );
};

// =============================================================== s3: same number both ways
const U3 = 80;
const PL = mkP(400, 560, U3), PR = mkP(1240, 500, U3);
type Pose = { c: Pt; phi: number; w: number; h: number; side: number }; // corner (px), base angle (deg, screen-up math), px sizes
const rectPts = (p: Pose): Pt[] => {
  const t = (p.phi * Math.PI) / 180, bx = Math.cos(t), by = -Math.sin(t); // screen base direction
  // height side = side · k × (cos φ, sin φ) = side · (−sin φ, cos φ) in math coords → screen (−sin φ, −cos φ) · side
  const kx = -Math.sin(t) * p.side, ky = -Math.cos(t) * p.side;
  const c = p.c, b: Pt = [c[0] + bx * p.w, c[1] + by * p.w];
  return [c, b, [b[0] + kx * p.h, b[1] + ky * p.h], [c[0] + kx * p.h, c[1] + ky * p.h]];
};
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = SS(2, 1), t2 = SS(2, 2), t3 = SS(2, 3), t4 = SS(2, 4);
  const o0 = ramp(f, 0, 12);
  const dL = ramp(f, t1, t1 + 15), sL = ramp(f, t1 + 15, t1 + 35);
  const dR = ramp(f, t2, t2 + 15), sR = ramp(f, t2 + 15, t2 + 35), oCmp = ramp(f, t2 + 40, t2 + 52) * (1 - ramp(f, t3 + 70, t3 + 82));
  const grow = ramp(f, t3, t3 + 25);
  const tray = ramp(f, t3 + 75, t3 + 115);
  const copies = 1 - ramp(f, t3 + 70, t3 + 90);
  const oTray = ramp(f, t3 + 80, t3 + 100), oRead = ramp(f, t3 + 105, t3 + 117), oCap = ramp(f, t4, t4 + 12);
  // in-place poses (true scale: base = shadow, height = other length, at right angles)
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
        <Grid P={P} xr={caster === "a" ? [-3, 5] : [-1, 6]} yr={caster === "a" ? [-1, 4] : [-6, 4]} o={0.8} />
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
    <AbsoluteFill style={{ background: HOUSE.bg }}>
      <Svg>
        <g opacity={o0 * copies}>
          <Copy P={PL} caster="a" />
          <Copy P={PR} caster="b" />
          <line x1={960} y1={130} x2={960} y2={1000} stroke={HOUSE.grid} strokeWidth={3} />
          <Lbl x={120} y={650} t={`shadow of a on b = ${SHAB.toFixed(3)}`} c={TEAL} s={32} o={sL} b />
          <Lbl x={1400} y={250} t={`shadow of b on a = ${SHBA.toFixed(3)}`} c={ORANGE} s={32} o={sR} b />
          {grow > 0 ? (
            <g>
              <Bracket p={rL[1]} q={rL[2]} off={16} c={ORANGE} label={`|b| = ${NB.toFixed(3)}`} lo={44} s={28} a="end" o={grow} />
              <Lbl x={130} y={700} t={`${SHAB.toFixed(3)} × ${NB.toFixed(3)} = ${pair.area_on_b.toFixed(3)}`} s={34} o={grow} b />
              <Bracket p={rR[1]} q={rR[2]} off={-16} c={TEAL} label={`|a| = ${NA.toFixed(3)}`} lo={22} s={28} a="start" o={grow} />
              <Lbl x={1400} y={300} t={`${SHBA.toFixed(3)} × ${NA.toFixed(3)} = ${pair.area_on_a.toFixed(3)}`} s={34} o={grow} b />
            </g>
          ) : null}
        </g>
        {/* comparison of the two shadows, true scale */}
        <g opacity={oCmp}>
          <Lbl x={120} y={790} t="same pair, two different shadows" c={MUTED} s={30} />
          <line x1={120} y1={850} x2={120 + SHAB * U3} y2={850} stroke={TEAL} strokeWidth={16} strokeOpacity={0.8} />
          <Lbl x={140 + SHAB * U3} y={850} t={`${SHAB.toFixed(3)}  (a on b)`} c={TEAL} s={30} />
          <line x1={120} y1={910} x2={120 + SHBA * U3} y2={910} stroke={ORANGE} strokeWidth={16} strokeOpacity={0.8} />
          <Lbl x={140 + SHBA * U3} y={910} t={`${SHBA.toFixed(3)}  (b on a)`} c={ORANGE} s={30} />
        </g>
        {/* tray: square grid at the same scale, so the two areas can be counted */}
        <g opacity={oTray}>
          {Array.from({ length: 9 }, (_, i) => <line key={`tx${i}`} x1={640 + i * 80} y1={300} x2={640 + i * 80} y2={780} stroke={HOUSE.grid} strokeWidth={1.5} />)}
          {Array.from({ length: 7 }, (_, i) => <line key={`ty${i}`} x1={640} y1={300 + i * 80} x2={1280} y2={300 + i * 80} stroke={HOUSE.grid} strokeWidth={1.5} />)}
          <line x1={620} y1={780} x2={1300} y2={780} stroke={MUTED} strokeWidth={3} />
          <Lbl x={1300} y={330} t="1 square = 1 unit²" c={MUTED} s={28} />
        </g>
        {grow > 0 ? <ProdRect pts={rL} neg={false} id="h3l" /> : null}
        {grow > 0 ? <ProdRect pts={rR} neg={false} id="h3r" /> : null}
        <g opacity={oRead}>
          <Lbl x={821} y={812} t={`${SHAB.toFixed(3)} × ${NB.toFixed(3)}`} c={INK} s={30} a="middle" />
          <Lbl x={1137} y={812} t={`${SHBA.toFixed(3)} × ${NA.toFixed(3)}`} c={INK} s={30} a="middle" />
          <Lbl x={960} y={866} t={`area = a·b = ${AB.toFixed(3)}  (both)`} c={INK} s={38} a="middle" b />
          <Gauge x={560} y={1000} w={800} min={-16.1} max={16.1} step={4} value={AB} label="a·b" />
        </g>
      </Svg>
      <Chip text="Reason 1 · the same number both ways" x={40} y={30} o={o0} />
      <EqBox latex={EQ_SYM} x={80} y={120} w={1800} size={42} number="0A.1, both ways" o={oTray} nw={290} />
      <Txt x={0} y={225} w={1920} s={36} align="center" c={HOUSE.accent} o={oCap} bold>a·b = b·a: order doesn’t matter</Txt>
    </AbsoluteFill>
  );
};

// =============================================================== s4: the cheap number; unit arrows
const Card: React.FC<{ x: number; y: number; w: number; title: string; tc: string; lines: React.ReactNode[]; foot: string; o?: number }> = ({
  x, y, w, title, tc, lines, foot, o = 1,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 300, background: HOUSE.panel, borderRadius: 14,
    border: `2px solid ${tc}`, padding: "14px 22px", boxSizing: "border-box", ...FONT, opacity: o }}>
    <div style={{ fontSize: 36, fontWeight: 700, color: tc }}>{title}</div>
    {lines.map((l, i) => <div key={i} style={{ fontSize: 32, marginTop: 6 }}>{l}</div>)}
    <div style={{ fontSize: 28, color: MUTED, marginTop: 12, lineHeight: 1.2 }}>{foot}</div>
  </div>
);
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = SS(3, 1), t2 = SS(3, 2), t3 = SS(3, 3);
  const o0 = ramp(f, 0, 12), oArr = ramp(f, t1, t1 + 12), oEq = ramp(f, t1 + 20, t1 + 32);
  const n = cheap.scales.length - 1;
  const k = Math.round(clamp((f - t2 - 6) / 45, 0, 1) * n); // b shrinks to b̂ over 1.5 s
  const shrunk = k === n;
  const bk = cheap.b_series[k] as Pt, dk = cheap.dot_series[k], lk = cheap.len_series[k];
  const oCap = ramp(f, t2 + 55, t2 + 67);
  const wind = ramp(f, t3, t3 + 15);
  const oChip2 = ramp(f, t3 + 100, t3 + 112);
  const P = P12, O = P(0, 0), foot = P(...PAB), aTip = P(...A);
  const readout = k === 0 ? `a·b = ${dk.toFixed(3)}` : shrunk ? `a·b̂ = ${dk.toFixed(3)} = shadow` :
    `a·(orange arrow) = ${cheap.shadow_series[k].toFixed(3)} × ${lk.toFixed(3)} = ${dk.toFixed(3)}`;
  // wind map
  const PW_ = mkP(250, 860, 60);
  const u = cheap.u as Pt, Ow = PW_(0, 0), uT = PW_(...u), ux = PW_(cheap.u_dot_xhat, 0);
  return (
    <AbsoluteFill style={{ background: HOUSE.bg }}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - wind }}>
        <Svg>
          <Grid P={P} xr={[-3, 5]} yr={[-2, 6]} />
          <Dash p={P(-0.6, -1.8)} q={P(1.6, 4.8)} c={ORANGE} o={0.4} w={2} />
          <Band p={O} q={foot} color={TEAL} />
          <Arrow p={O} q={P(...bk)} color={ORANGE} />
          <Arrow p={O} q={aTip} color={TEAL} />
          <Dash p={aTip} q={foot} />
          <RightTick at={foot} u1={unit(foot, O)} u2={unit(foot, aTip)} />
          <Lbl x={P(5.2, 1)[0]} y={P(5.2, 1)[1]} t="a" c={TEAL} s={44} b />
          <Lbl x={P(bk[0] + 0.25, bk[1])[0]} y={P(bk[0] + 0.25, bk[1])[1]} t={shrunk ? "b̂, length 1" : k > 0 ? `length ${lk.toFixed(3)}` : "b"}
            c={ORANGE} s={shrunk || k > 0 ? 34 : 44} b />
          <Lbl x={P(-0.35, 0.9)[0] - 8} y={P(-0.35, 0.9)[1]} t={`shadow = ${cheap.shadow_series[k].toFixed(3)}`} c={TEAL} s={34} a="end" b />
          {k > 0 ? <Lbl x={P(-0.35, 0.9)[0] - 8} y={P(-0.35, 0.9)[1] + 42} t="(does not change)" c={TEAL} s={30} a="end" /> : null}
          <Lbl x={O[0] - 18} y={O[1] + 26} t="O" c={MUTED} s={30} a="end" />
          {/* card 1 → card 2 */}
          <g opacity={oArr}>
            <path d="M 1215 440 Q 1440 520 1650 446" fill="none" stroke={HOUSE.accent} strokeWidth={4} />
            <polygon points="1665,438 1640,436 1650,458" fill={HOUSE.accent} />
          </g>
          <Gauge x={PX + 40} y={890} w={PW - 80} min={-16.1} max={16.1} step={4} value={dk} label={readout} readout={fs(dk)} />
        </Svg>
        <Card x={PX} y={120} w={400} title="a·b" tc={TEAL} o={o0}
          lines={["5 × 1 = 5", "1 × 3 = 3", `5 + 3 = ${cheap.a_dot_b.toFixed(0)}  ✓`]} foot="2 multiplications, 1 addition; no angle" />
        <Card x={PX + 450} y={120} w={420} title="shadow" tc={TEAL} o={o0}
          lines={["|b| = √(1² + 3²) = √10", `= ${cheap.norm_b.toFixed(3)}`, `${cheap.a_dot_b.toFixed(0)} ÷ ${cheap.norm_b.toFixed(3)} = ${cheap.shadow.toFixed(3)}`]}
          foot="needs a·b first, then 1 square root and 1 division" />
        <Txt x={PX} y={470} w={PW} s={32} align="center" c={HOUSE.accent} o={oArr} bold>shadow = a·b ÷ |b|</Txt>
        <EqBox latex={EQ_0A3} x={PX - 40} y={540} w={PW + 50} h={130} size={31} number="0A.3" o={oEq} />
        <Txt x={PX} y={672} w={PW} s={32} align="center" o={oEq}>{cheap.a_dot_b.toFixed(0)} ÷ {cheap.norm_b.toFixed(3)} = {cheap.shadow.toFixed(3)}</Txt>
        <Txt x={PX} y={975} w={PW} s={30} align="center" c={ORANGE} o={oCap}>length one: dividing by |b| does nothing</Txt>
        <Chip text="Reason 2 · the cheap number; the shadow comes from it" x={40} y={30} o={o0} w={940} size={30} />
        <GridNote />
      </div>
      {wind > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: wind }}>
          <Svg>
            <Grid P={PW_} xr={[-2, 9]} yr={[-1, 10]} />
            <Band p={Ow} q={ux} color={TEAL} />
            <Arrow p={Ow} q={PW_(1, 0)} color={ORANGE} w={7} head={22} />
            <Arrow p={Ow} q={uT} color={TEAL} />
            <Dash p={uT} q={ux} />
            <RightTick at={ux} u1={unit(ux, Ow)} u2={unit(ux, uT)} />
            <Lbl x={PW_(9, -0.1)[0]} y={PW_(9, -0.1)[1] - 26} t="east →" c={MUTED} s={30} a="end" />
            <Lbl x={PW_(-0.25, 9.6)[0]} y={PW_(-0.25, 9.6)[1]} t="north ↑" c={MUTED} s={30} a="end" />
            <Lbl x={PW_(2.2, 4.6)[0]} y={PW_(2.2, 4.6)[1]} t={`wind u, |u| = ${cheap.norm_u.toFixed(1)} m/s`} c={TEAL} s={32} a="end" b />
            <Lbl x={PW_(0.3, -0.75)[0]} y={PW_(0.3, -0.75)[1]} t="x̂: east, length 1" c={ORANGE} s={30} />
            <Lbl x={PW_(3, -1.6)[0]} y={PW_(3, -1.6)[1]} t={`shadow on x̂'s line: ${cheap.u_dot_xhat.toFixed(2)}`} c={TEAL} s={30} a="middle" />
          </Svg>
          <Chip text="Reason 2 · with a unit arrow, the dot product IS the shadow" x={40} y={30} w={1100} size={30} />
          <Txt x={1000} y={300} w={860} s={44} bold c={TEAL}>u·x̂ = {cheap.u_dot_xhat.toFixed(2)} m/s</Txt>
          <Txt x={1000} y={366} w={860} s={34}>= the eastward part of the wind</Txt>
          <Txt x={1000} y={430} w={860} s={30} c={MUTED}>u = (6, 8) m/s, x̂ = (1, 0): 6 × 1 + 8 × 0 = 6</Txt>
          <Chip x={1000} y={560} w={860} size={30} color={MUTED} o={oChip2}
            text={`u·ŷ = ${cheap.u_dot_yhat.toFixed(2)} m/s: the northward part · in Vallis, k̂ is local up: u·k̂ = the vertical part (0 for this flat wind)`} />
          <Badge detail="wind arrow: 1 grid square = 1 m/s on its own small map (arrow length is not a distance)" corner="tr" />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// =============================================================== s5: work
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = SS(4, 1), t2 = SS(4, 2), t3 = SS(4, 3);
  const o0 = ramp(f, 0, 12), oF = ramp(f, t1, t1 + 15), oSh = ramp(f, t2, t2 + 20), oW = ramp(f, t3, t3 + 20);
  const nd = work.d_m.length - 1;
  const kd = Math.round(clamp((f - t3 - 80) / 45, 0, 1) * nd); // "walk twice as far" → d 5 m → 10 m
  const dm = work.d_m[kd], W = work.W_J[kd];
  const oChip = ramp(f, t3 + 80, t3 + 92);
  const GY = 470, X0 = 330, FS = 14, DS = 40; // px per newton, px per metre (different scales: badge)
  const Fv = work.F as Pt;
  const Ft: Pt = [X0 + Fv[0] * FS, GY - Fv[1] * FS];
  const sh: Pt = [X0 + work.shadow_N * FS, GY];
  const dT: Pt = [X0 + dm * DS, GY];
  const rect: Pt[] = [[X0, GY], sh, [sh[0], GY + dm * DS * oW], [X0, GY + dm * DS * oW]];
  return (
    <AbsoluteFill style={{ background: HOUSE.bg, opacity: o0 }}>
      <Svg>
        <line x1={60} y1={GY} x2={1040} y2={GY} stroke="#6b7690" strokeWidth={4} />
        {Array.from({ length: 24 }, (_, i) => <line key={i} x1={70 + i * 40} y1={GY + 4} x2={50 + i * 40} y2={GY + 24} stroke="#3c4660" strokeWidth={2} />)}
        {/* sled icon (illustrative) */}
        <rect x={130} y={GY - 62} width={190} height={40} rx={8} fill="#3a4766" stroke="#9aa6bd" strokeWidth={3} />
        <path d={`M 120 ${GY - 6} L 330 ${GY - 6} Q 350 ${GY - 6} 345 ${GY - 30}`} fill="none" stroke="#c9d2e3" strokeWidth={5} />
        <line x1={160} y1={GY - 22} x2={160} y2={GY - 6} stroke="#c9d2e3" strokeWidth={4} />
        <line x1={290} y1={GY - 22} x2={290} y2={GY - 6} stroke="#c9d2e3" strokeWidth={4} />
        <Lbl x={225} y={GY - 95} t="sled" c={MUTED} s={30} a="middle" />
        {oW > 0 ? <ProdRect pts={rect} neg={false} o={oW} id="h5" /> : null}
        <Band p={[X0, GY]} q={lerp([X0, GY], sh, oSh)} color={TEAL} o={oSh > 0 ? 1 : 0} />
        <Arrow p={[X0, GY]} q={dT} color={ORANGE} />
        <Arrow p={[X0, GY]} q={Ft} color={TEAL} o={oF} />
        <g opacity={oF}>
          <Arc P={mkP(X0, GY, 1)} a0={0} a1={work.F_deg} r={70} />
          <Lbl x={X0 + 82} y={GY - 32} t={`${work.F_deg.toFixed(0)}°`} s={30} />
          <Lbl x={Ft[0] + 16} y={Ft[1] - 10} t={`F = ${work.F_N.toFixed(0)} N`} c={TEAL} s={34} b />
        </g>
        <Lbl x={dT[0] + 14} y={GY - 26} t={`d = ${dm.toFixed(dm % 1 ? 1 : 0)} m`} c={ORANGE} s={34} b />
        <g opacity={oSh}>
          <Dash p={Ft} q={sh} />
          <RightTick at={sh} u1={[-1, 0]} u2={[0, -1]} />
          <Lbl x={X0 + 10} y={GY + 30} t="shadow" c={TEAL} s={28} o={1 - oW} />
        </g>
        {oW > 0 ? (
          <g opacity={oW}>
            <Bracket p={[sh[0], GY]} q={[sh[0], GY + dm * DS]} off={-18} c={ORANGE} label={`|d| = ${dm.toFixed(dm % 1 ? 1 : 0)} m`} lo={18} s={30} a="start" />
            <Lbl x={X0 + 70} y={GY + 30} t={`${work.shadow_N.toFixed(1)} N`} c={TEAL} s={28} a="middle" />
            <Lbl x={sh[0] + 30} y={GY + dm * DS * 0.5 + 50} t={`area = ${work.shadow_N.toFixed(1)} N × ${dm.toFixed(dm % 1 ? 1 : 0)} m = ${W.toFixed(1)} J`} s={32} b />
          </g>
        ) : null}
        <Gauge x={1160} y={760} w={680} min={0} max={120} step={20} value={W} label="work W (J)" readout={`${W.toFixed(1)} J`} o={oW} dec={1} />
      </Svg>
      <Chip text="Reason 3 · physics needs both sizes — (a) work" x={40} y={30} />
      <EqBox latex={EQ_W} x={1100} y={190} w={780} size={44} o={o0} />
      <Txt x={1130} y={300} w={760} s={30} c={MUTED} o={o0}>work: a definition from school mechanics (no book number)</Txt>
      <Txt x={1130} y={380} w={760} s={32} c={TEAL} o={oSh}>shadow = 20 cos 60° = {work.shadow_N.toFixed(1)} N<br /><span style={{ fontSize: 30 }}>(still a force)</span></Txt>
      <Txt x={1130} y={500} w={760} s={34} o={oW} bold>W = F·d = {work.shadow_N.toFixed(1)} N × {dm.toFixed(dm % 1 ? 1 : 0)} m = {W.toFixed(1)} J</Txt>
      <Chip text="double either arrow → the product doubles" x={1130} y={860} color={ORANGE} o={oChip} w={760} />
      <Badge detail="force (N) and distance (m) drawn on different scales · sled icon illustrative" corner="bl" />
    </AbsoluteFill>
  );
};

// =============================================================== s6 + s7: the weather map
const MX = 110, MY = 170, KM = 1.55; // map origin (west, top) and px per km
const MW = adv.map_km[0] * KM, MH = adv.map_km[1] * KM;
const LUT = adv.lut_thermal as string[];
const [T_LO, T_HI] = adv.lut_range_C as [number, number];
const tColor = (T: number) => LUT[Math.round(clamp((T - T_LO) / (T_HI - T_LO), 0, 1) * (LUT.length - 1))];
const PROBE: Pt = [MX + adv.probe_km[0] * KM, MY + MH - adv.probe_km[1] * KM];
const US = 18; // px per (m/s) for the wind arrow (not the map's km scale)
const UANG = (adv.angle_deg * Math.PI) / 180;
const uScr: Pt = [adv.speed * US * Math.cos(UANG), -adv.speed * US * Math.sin(UANG)];
const shScr = adv.shadow_m_s * US;

/** T(x, t) = T_west + G (x − shift): G and shift from the data file (shift_km = u·x̂ t). Drawn as 5-km strips. */
const TMap: React.FC<{ G: number; shiftKm: number; o?: number; id: string }> = ({ G, shiftKm, o = 1, id }) => {
  const strips = [];
  for (let i = 0; i < 120; i++) {
    const xk = i * 5 + 2.5;
    strips.push(<rect key={i} x={MX + i * 5 * KM} y={MY} width={5 * KM + 0.6} height={MH} fill={tColor(adv.T_west + G * (xk - shiftKm) * 1000)} />);
  }
  const iso = [];
  for (let T = 0; T <= 22; T++) {
    const xk = (T - adv.T_west) / G / 1000 + shiftKm;
    if (xk < 2 || xk > adv.map_km[0] - 2) continue;
    const px = MX + xk * KM;
    iso.push(<g key={T}><line x1={px} y1={MY} x2={px} y2={MY + MH} stroke="#ffffff" strokeOpacity={0.45} strokeWidth={2} />
      <Lbl x={px} y={MY - 22} t={`${T}°`} c={INK} s={28} a="middle" /></g>);
  }
  return <g opacity={o} id={id}>{strips}{iso}</g>;
};
const MapFrame: React.FC = () => {
  const ticks = [];
  for (let k = 0; k <= 6; k++) ticks.push(<Lbl key={`e${k}`} x={MX + k * 100 * KM} y={MY + MH + 26} t={`${k * 100}`} c={MUTED} s={28} a="middle" />);
  for (let k = 0; k <= 3; k++) ticks.push(<Lbl key={`n${k}`} x={MX - 10} y={MY + MH - k * 100 * KM} t={`${k * 100}`} c={MUTED} s={28} a="end" />);
  return (
    <g>
      <rect x={MX} y={MY} width={MW} height={MH} fill="none" stroke={HOUSE.grid} strokeWidth={3} />
      {ticks}
      <Lbl x={MX + MW} y={MY + MH + 62} t="east (km) →" c={MUTED} s={28} a="end" />
      <g transform={`translate(30 ${MY + MH / 2}) rotate(-90)`}><Lbl x={0} y={0} t="north (km) →" c={MUTED} s={28} a="middle" /></g>
    </g>
  );
};
const CBW = MW - 120; // colour-bar width (label to its right, inside the map's width)
const ColourBar: React.FC = () => (
  <g>
    {LUT.map((c, i) => <rect key={i} x={MX + (i * CBW) / LUT.length} y={MY + MH + 92} width={CBW / LUT.length + 0.6} height={26} fill={c} />)}
    {[10, 12, 14, 16, 18, 20, 22].map((T) => <Lbl key={T} x={MX + ((T - T_LO) / (T_HI - T_LO)) * CBW} y={MY + MH + 140} t={`${T}`} c={MUTED} s={28} a="middle" />)}
    <Lbl x={MX + CBW + 22} y={MY + MH + 105} t="T (°C)" c={INK} s={28} />
  </g>
);
const RX = 1110, RW = 780; // right panel for s6/s7

const S6: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = SS(5, 1), t2 = SS(5, 2), t3 = SS(5, 3), t4 = SS(5, 4);
  const o0 = ramp(f, 0, 12), oG = ramp(f, 8, 22), oL = ramp(f, t1, t1 + 12), oU = ramp(f, t2, t2 + 15);
  const oS = ramp(f, t3, t3 + 20), oR = ramp(f, t4, t4 + 20);
  const GL = 150; // ∇T arrow length px (not to the km scale)
  const P0 = PROBE, gT: Pt = [P0[0] + GL, P0[1]], uT: Pt = [P0[0] + uScr[0], P0[1] + uScr[1]], sh: Pt = [P0[0] + shScr, P0[1]];
  const rect: Pt[] = [P0, sh, [sh[0], P0[1] + GL * oR], [P0[0], P0[1] + GL * oR]];
  return (
    <AbsoluteFill style={{ background: HOUSE.bg, opacity: o0 }}>
      <Svg>
        <TMap G={adv.gradT[0]} shiftKm={0} id="m6" />
        <MapFrame />
        <ColourBar />
        {oR > 0 ? <ProdRect pts={rect} neg={false} o={oR} id="h6" /> : null}
        <Band p={P0} q={lerp(P0, sh, oS)} color={TEAL} o={oS > 0 ? 1 : 0} />
        <Arrow p={P0} q={gT} color={ORANGE} o={oG} w={7} />
        <Arrow p={P0} q={uT} color={TEAL} o={oU} w={7} />
        <circle cx={P0[0]} cy={P0[1]} r={7} fill={INK} stroke={HOUSE.bg} strokeWidth={2} opacity={oG} />
        <Lbl x={gT[0] + 12} y={gT[1]} t="∇T" c={ORANGE} s={36} b o={oG} />
        <Bracket p={P0} q={gT} off={-20} c={ORANGE} label="|∇T|" lo={22} s={30} o={oL * (1 - oR)} />
        <g opacity={oU}>
          <Arc P={mkP(P0[0], P0[1], 1)} a0={0} a1={adv.angle_deg} r={62} c={INK} />
          <Lbl x={P0[0] + 70} y={P0[1] - 32} t={`${adv.angle_deg.toFixed(0)}°`} s={30} />
          <Lbl x={uT[0] + 12} y={uT[1] - 6} t="u" c={TEAL} s={36} b />
        </g>
        {oS > 0 ? <g opacity={oS}><Dash p={uT} q={sh} /><RightTick at={sh} u1={[-1, 0]} u2={[0, -1]} />
          <Lbl x={P0[0] - 12} y={P0[1] + 30} t="shadow" c={TEAL} s={28} a="end" o={1 - oR} /></g> : null}
        {oR > 0 ? <g opacity={oR}>
          <Lbl x={P0[0] + 45} y={P0[1] + 26} t={`${adv.shadow_m_s.toFixed(2)}`} c={TEAL} s={28} a="middle" />
          <Bracket p={sh} q={[sh[0], P0[1] + GL]} off={-16} c={ORANGE} label="|∇T|" lo={18} s={28} a="start" />
          <Lbl x={P0[0] - 14} y={P0[1] + 100} t="area = u·∇T" c={INK} s={30} a="end" b />
        </g> : null}
      </Svg>
      <Chip text="Reason 3 · (b) the weather version" x={40} y={30} />
      <Txt x={RX} y={150} w={RW} s={32} c={ORANGE} o={oG}><b>∇T</b> (“grad T”): points uphill, towards warmer air</Txt>
      <Txt x={RX} y={245} w={RW} s={32} c={ORANGE} o={oL}>|∇T| = 1 K per 100 km = {sci(adv.norm_gradT)} K/m</Txt>
      <Txt x={RX} y={310} w={RW} s={32} c={TEAL} o={oU}>wind <b>u</b>: |u| = {adv.speed.toFixed(1)} m/s, {adv.angle_deg.toFixed(0)}° from ∇T</Txt>
      <Txt x={RX} y={375} w={RW} s={32} c={TEAL} o={oS}>shadow = 10.0 cos 60° = <b>{adv.shadow_m_s.toFixed(2)} m/s</b> towards warmer air</Txt>
      <Txt x={RX} y={480} w={RW} s={32} o={oR}>
        units: (<s>m</s>/s) × (K/<s>m</s>) = K/s<br />
        <b>u·∇T</b> = {adv.shadow_m_s.toFixed(2)} m/s × {sci(adv.norm_gradT)} K/m<br />
        = {sci(adv.u_dot_gradT)} K/s = <b>{adv.K_per_h.toFixed(3)} K per hour</b>
      </Txt>
      <Txt x={RX} y={665} w={RW} s={34} c={TEAL} o={oR}><b>advection</b> = carrying by the wind</Txt>
      <EqBox latex={oR > 0 ? EQ_17_BOX : EQ_17} x={RX} y={740} w={RW} h={130} size={40} number="Vallis 1.7" o={0.55 + 0.45 * oR} />
      <Txt x={RX} y={875} w={RW} s={28} c={MUTED} o={oR}>the boxed term: this dot product is the advection term</Txt>
      <Badge detail="arrows not to the map's km scale · idealised field, illustrative (not data)" corner="bl" />
    </AbsoluteFill>
  );
};

const S7: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = SS(6, 1), t2 = SS(6, 2), t3 = SS(6, 3);
  const o0 = ramp(f, 0, 10), oEq = ramp(f, t1, t1 + 15), steep = ramp(f, t2, t2 + 15), oCard = ramp(f, t3, t3 + 15);
  const n = adv.t_h.length - 1; // 121 samples over 6 h; 6 s of movie
  const kA = Math.round(clamp(f / 180, 0, 1) * n);
  const tB = t2 + 15;
  const kB = Math.round(clamp((f - tB) / 180, 0, 1) * n);
  const isB = steep >= 1;
  const k = isB ? kB : kA;
  const G = isB ? adv.gradT_steep[0] : adv.gradT[0];
  const Tpin = isB ? adv.T_pin_steep[k] : adv.T_pin[k];
  const rate = isB ? adv.K_per_h_steep : adv.K_per_h;
  const GL = 150 * (isB ? 2 : 1);
  const P0 = PROBE;
  const parcels = adv.parcels_x_km.map((xs, i) => {
    const x = ((xs[k] % adv.map_km[0]) + adv.map_km[0]) % adv.map_km[0];
    const y = ((adv.parcels_y_km[i][k] % adv.map_km[1]) + adv.map_km[1]) % adv.map_km[1];
    // colour = T at the wrapped position: a parcel that leaves the east edge is replaced by one entering from the west
    return <circle key={i} cx={MX + x * KM} cy={MY + MH - y * KM} r={9} fill={tColor(adv.T_west + G * (x - adv.shift_km[k]) * 1000)}
      stroke="#ffffff" strokeWidth={2.5} />;
  });
  // upwind cone (where the arriving air comes from): opposite to u
  const back = Math.atan2(-uScr[1], -uScr[0]), half = (25 * Math.PI) / 180, R = 230;
  const cone = `M ${P0[0]} ${P0[1]} L ${P0[0] + R * Math.cos(back - half)} ${P0[1] + R * Math.sin(back - half)} A ${R} ${R} 0 0 1 ${P0[0] + R * Math.cos(back + half)} ${P0[1] + R * Math.sin(back + half)} Z`;
  const uT: Pt = [P0[0] + uScr[0], P0[1] + uScr[1]], sh: Pt = [P0[0] + shScr, P0[1]];
  const fade = steep > 0 && steep < 1 ? steep : 0;
  return (
    <AbsoluteFill style={{ background: HOUSE.bg, opacity: o0 }}>
      <Svg>
        <defs><clipPath id="mapclip"><rect x={MX} y={MY} width={MW} height={MH} /></clipPath></defs>
        <g clipPath="url(#mapclip)">
          {fade > 0 ? (<>
            <TMap G={adv.gradT[0]} shiftKm={adv.shift_km[kA]} id="m7a" />
            <TMap G={adv.gradT_steep[0]} shiftKm={0} o={fade} id="m7b" />
          </>) : <TMap G={G} shiftKm={adv.shift_km[k]} id="m7" />}
          {fade === 0 ? parcels : null}
          <path d={cone} fill="#ffffff" fillOpacity={0.16} stroke="#ffffff" strokeOpacity={0.6} strokeWidth={2} strokeDasharray="8 6" />
        </g>
        <MapFrame />
        <ColourBar />
        <Band p={P0} q={sh} color={TEAL} />
        <Arrow p={P0} q={[P0[0] + GL, P0[1]]} color={ORANGE} w={7} />
        <Arrow p={P0} q={uT} color={TEAL} w={7} />
        <Lbl x={P0[0] + GL + 12} y={P0[1]} t="∇T" c={ORANGE} s={34} b />
        <Lbl x={uT[0] + 12} y={uT[1] - 6} t="u" c={TEAL} s={34} b />
        {/* the pin: you, standing still */}
        <path d={`M ${P0[0]} ${P0[1]} l -14 -30 a 16 16 0 1 1 28 0 z`} fill={INK} stroke={HOUSE.bg} strokeWidth={2} />
        <circle cx={P0[0]} cy={P0[1] - 38} r={6} fill={HOUSE.bg} />
        <Lbl x={P0[0] - 24} y={P0[1] - 60} t="you (standing still)" c={INK} s={30} a="end" b />
        <Lbl x={MX + 16} y={MY + MH - 30} t="arriving air comes from the colder side" c={INK} s={28} />
        <Lbl x={P0[0] + 30} y={P0[1] + 30} t={`shadow ${isB ? "still " : ""}${adv.shadow_m_s.toFixed(2)} m/s`} c={TEAL} s={28} />
      </Svg>
      <Chip text="Mind the sign: what a thermometer that stays put sees" x={40} y={30} size={30} />
      <EqBox latex={EQ_17} x={RX} y={95} w={RW} h={110} size={34} number="Vallis 1.7" />
      <EqBox latex={EQ_DTDT_HL} x={RX} y={220} w={RW} h={110} size={36} o={oEq} />
      <Txt x={RX} y={340} w={RW} s={30} o={oEq}>
        = <span style={{ color: ROSE }}>−</span>{isB ? sci(adv.u_dot_gradT_steep) : sci(adv.u_dot_gradT)} K/s = <b><span style={{ color: ROSE }}>−</span>{rate.toFixed(3)} K/h</b>
        {isB ? "" : ` (${fx(adv.K_per_day, 2)} K per day)`}
      </Txt>
      <Txt x={RX} y={386} w={RW} s={28} c={MUTED} o={oEq}>assumes each parcel keeps its temperature: no heating, no mixing (DT/Dt = 0)</Txt>
      <div style={{ position: "absolute", left: RX, top: 475, width: RW, ...FONT, fontSize: 32, background: HOUSE.panel,
        borderRadius: 12, padding: "12px 20px", boxSizing: "border-box", lineHeight: 1.35 }}>
        <div style={{ color: MUTED, fontSize: 28 }}>clock: 6 h of weather in 6 s (×3600){isB ? " · steeper map" : ""}</div>
        <div>t = {adv.t_h[k].toFixed(1)} h · thermometer at you: <b>{Tpin.toFixed(2)} °C</b></div>
        <div style={{ color: ORANGE }}>|∇T| = {sci(G)} K/m {isB ? "(twice as steep)" : ""}</div>
      </div>
      <div style={{ position: "absolute", left: RX, top: 665, width: RW, ...FONT, fontSize: 29, opacity: oCard, lineHeight: 1.3 }}>
        <div style={{ borderLeft: `6px solid ${TEAL}`, paddingLeft: 14, marginBottom: 14 }}>
          shadow |u| cos θ = <b>{adv.shadow_m_s.toFixed(2)} m/s</b> → how fast the air heads towards warmth (same on both maps)
        </div>
        <div style={{ borderLeft: `6px solid ${ROSE}`, paddingLeft: 14 }}>
          −u·∇T = {fx(-adv.K_per_h)} → {fx(-adv.K_per_h_steep)} K/h → how fast YOUR temperature changes (doubles)
        </div>
      </div>
      <Badge detail="time ×3600 (6 h in 6 s) · arrows not to the km scale · idealised field" corner="bl" />
    </AbsoluteFill>
  );
};

// =============================================================== s8: the sign
const P8 = mkP(470, 545, 95);
const thetaGrid = sign.theta_deg as number[];
const nearest = (th: number) => {
  let lo = 0, hi = thetaGrid.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (thetaGrid[m] <= th) lo = m; else hi = m; }
  return th - thetaGrid[lo] <= thetaGrid[hi] - th ? lo : hi;
};
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = SS(7, 1), t2 = SS(7, 2), t3 = SS(7, 3), t4 = SS(7, 4);
  const th0 = thetaGrid[0];
  // holds at 60.3°, 90°, 120°, 180°; each swing is centred on the sentence that names the new angle
  const sw = (a: number, b: number, s: number, e: number) => a + (b - a) * ramp(f, s, e);
  let th = th0;
  if (f >= t2 - 18) th = sw(th0, 90, t2 - 18, t2 + 18);
  if (f >= t3 - 18) th = sw(90, 120, t3 - 18, t3 + 18);
  if (f >= t4 - 20) th = sw(120, 180, t4 - 20, t4 + 28);
  const i = nearest(th);
  const b = sign.b[i] as Pt, ab = sign.a_dot_b[i], shd = sign.shadow[i], pr = sign.proj[i] as Pt, kb = sign.k_cross_b[i] as Pt;
  const thr = sign.theta_readout_deg[i];
  const P = P8, O = P(0, 0), aTip = P(...A), foot = P(...pr), bT = P(...b);
  const neg = ab < -1e-9;
  const nb = sign.norm_b;
  const bh: Pt = [b[0] / nb, b[1] / nb];
  const rect: Pt[] = [O, foot, P(pr[0] + kb[0], pr[1] + kb[1]), P(kb[0], kb[1])];
  const phiB = (Math.atan2(b[1], b[0]) * 180) / Math.PI;
  const a1 = phiB < PHI_A ? phiB + 360 : phiB;
  const o0 = ramp(f, 0, 12), oState = ramp(f, t1, t1 + 12), oEnd = ramp(f, END[7] - CUT[7] - 75, END[7] - CUT[7] - 63);
  const state = i === sign.i180 ? "opposite: the shadow points backwards, a·b = −|a||b|" : Math.abs(thr - 90) < 0.03 ? "perpendicular: no shadow" :
    thr < 90 ? "positive: shadow falls forward" : "negative: shadow falls behind the start";
  const stateC = Math.abs(thr - 90) < 0.03 ? INK : neg ? ROSE : INK;
  const midR: Pt = [(pr[0] + kb[0]) / 2, (pr[1] + kb[1]) / 2];
  return (
    <AbsoluteFill style={{ background: HOUSE.bg, opacity: o0 }}>
      <Svg>
        <Grid P={P} xr={[-4, 7]} yr={[-5, 4]} />
        {/* b's line, extended backwards behind O (dashed) */}
        <Dash p={P(-bh[0] * 6, -bh[1] * 6)} q={P(bh[0] * 6, bh[1] * 6)} c={ORANGE} o={0.45} w={2.5} />
        <ProdRect pts={rect} neg={neg} id="h8" />
        <Band p={O} q={foot} color={TEAL} w={i === sign.i180 ? 22 : 16} />
        <Arrow p={O} q={bT} color={ORANGE} />
        <Arrow p={O} q={aTip} color={TEAL} />
        <Dash p={aTip} q={foot} />
        {Math.abs(shd) > 0.05 && i !== sign.i180 ? <RightTick at={foot} u1={unit(foot, O)} u2={unit(foot, aTip)} /> : null}
        <Arc P={P} a0={PHI_A} a1={a1} r={0.9} />
        <Lbl x={P(5.2, 1)[0]} y={P(5.2, 1)[1] - 8} t="a" c={TEAL} s={44} b />
        <Lbl x={P(b[0] + bh[0] * 0.45, b[1] + bh[1] * 0.45)[0]} y={P(b[0] + bh[0] * 0.45, b[1] + bh[1] * 0.45)[1]} t="b" c={ORANGE} s={44} b a="middle" />
        <Lbl x={O[0] - 14} y={O[1] + 26} t="O" c={MUTED} s={28} a="end" />
        {Math.abs(ab) > 0.5 ? <Lbl x={P(...midR)[0]} y={P(...midR)[1]} t={`${fs(ab)}`} c={neg ? ROSE : INK} s={32} a="middle" b /> : null}
        <Gauge x={1220} y={640} w={640} min={-16.1} max={16.1} step={4} value={ab} label="a·b on the number line" />
      </Svg>
      <EqBox latex={EQ_COS} x={1150} y={60} w={750} h={130} size={44} number="0A.1, solved for cos θ" nw={360} />
      <div style={{ position: "absolute", left: 1220, top: 230, width: 660, ...FONT, fontSize: 36, lineHeight: 1.45,
        fontVariantNumeric: "tabular-nums" }}>
        <div>θ = {thr.toFixed(1)}°</div>
        <div style={{ color: TEAL }}>shadow of a on b = <b style={{ color: neg ? ROSE : TEAL }}>{fs(shd)}</b></div>
        <div>a·b = shadow × |b| = <b style={{ color: neg ? ROSE : INK }}>{fs(ab)}</b></div>
        <div style={{ fontSize: 28, color: MUTED }}>|b| stays {nb.toFixed(3)}; b turns anticlockwise (seen from above the page)</div>
      </div>
      <Txt x={1220} y={730} w={660} s={34} c={stateC} o={oState} bold>{state}</Txt>
      <Chip x={1200} y={870} w={690} size={30} o={oEnd} color={ROSE}
        text={`turn it around: cos θ = a·b ÷ (|a||b|) = ${fx(sign.a_dot_b[sign.i180], 2)} ÷ ${(NA * NB).toFixed(2)} = ${fx(sign.a_dot_b[sign.i180] / (NA * NB))} → θ = ${sign.theta_readout_deg[sign.i180].toFixed(0)}°`} />
      <Chip text="The sign tells you the angle" x={40} y={30} />
      <Txt x={40} y={1028} w={1140} s={28} c={MUTED}>1 square = 1 unit · rectangle = shadow × |b| (rose, hatched: negative)</Txt>
    </AbsoluteFill>
  );
};

// =============================================================== s9: end card
const S9: React.FC = () => {
  const f = useCurrentFrame();
  const b = (k: number) => ramp(f, k * 8, 8 + k * 8); // quick: the card must not read as a black frame (movie_qa black gate)
  return (
    <AbsoluteFill style={{ background: HOUSE.bg }}>
      <div style={{ position: "absolute", left: 100, top: 160, width: 1720, height: 250, background: HOUSE.panel, borderRadius: 16,
        border: `2px solid ${HOUSE.accent}` }} />
      <div style={{ position: "absolute", left: 140, top: 60, ...FONT, fontSize: 64, fontWeight: 700 }}>
        Why times the other length?
      </div>
      <div style={{ position: "absolute", left: 140, top: 185, width: 1640, ...FONT, fontSize: 36, lineHeight: 1.4 }}>
        <div style={{ opacity: b(0) }}><b style={{ color: HOUSE.accent }}>1 · Same number both ways:</b> a·b = b·a
          (8 = {SHAB.toFixed(3)} × {NB.toFixed(3)} = {SHBA.toFixed(3)} × {NA.toFixed(3)})</div>
        <div style={{ opacity: b(1), marginTop: 14 }}><b style={{ color: HOUSE.accent }}>2 · Cheap:</b> Σ aᵢbᵢ, no angle;
          shadow = a·b ÷ |b|; with a unit arrow they are equal</div>
        <div style={{ opacity: b(2), marginTop: 14 }}><b style={{ color: HOUSE.accent }}>3 · Physics needs both sizes:</b>{" "}
          W = F·d (J), −u·∇T (K/s)</div>
      </div>
      <div style={{ position: "absolute", left: 140, top: 430, width: 1640, ...FONT, fontSize: 28, color: MUTED, lineHeight: 1.35,
        opacity: b(3) }}>
        From Kundu: §2.1 (K 2.2) and §2.8 — fluidpy ch02 C01 (summation convention, a·b = aᵢbᵢ) and C09 (the gradient ∇φ
        points up the steepest climb); App. B §B.3 builds ∇· and ∇× from these products.
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 540, bottom: 0, opacity: b(3) }}>
        <EndCard notebook="notebooks/poc_ch00a_dot.ipynb (until the Chapter 0A notebook is published)"
          explainer="Vector products lab · viz/ch00/vector_products_lab.html" />
      </div>
    </AbsoluteFill>
  );
};

const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];
export const DotProductWhy: React.FC<{ audio?: string }> = ({ audio = "narration.wav" }) => (
  <AbsoluteFill style={{ background: HOUSE.bg }}>
    {SCENES.map((S, k) => (
      <Sequence key={sc[k].id} name={sc[k].id} from={CUT[k]} durationInFrames={END[k] - CUT[k]}><S /></Sequence>
    ))}
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
void SE;
