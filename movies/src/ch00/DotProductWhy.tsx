import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BalloonThermometer, GhostArrow, PoleThermometer, ramp } from "../house";
import timing from "../../ch00/ch00_dot_product_why/timing.json";
import pair from "../../ch00/ch00_dot_product_why/data/pair.json";
import same from "../../ch00/ch00_dot_product_why/data/same_way.json";
import cheap from "../../ch00/ch00_dot_product_why/data/cheap.json";
import work from "../../ch00/ch00_dot_product_why/data/work.json";
import wx from "../../ch00/ch00_dot_product_why/data/weather.json";
import sweep from "../../ch00/ch00_dot_product_why/data/sweep.json";
import { CurvedLink, SunGlyph, TimeGraph, tgXY } from "./kit/v6";
import { C, FONT as FONTF, T } from "./kit/type";
import { Arc, Arrow, Band, Bracket, Dash, Grid, Lbl, Pt, RightTick, Svg, add, bracketMid, clamp, lerp, mkP, pulse, textW, unit } from "./kit/draw";
import { CalcRow, CalcStack, Layer, Layered, Part, TeX, base, col, eqPieces, plainOf, rep, splitEq, texHtml } from "./kit/tex";
import { Balance, Keyword, TipLabel, placeLabels } from "./kit/notes";
import { CameraGlyph, Check, ClockGlyph, Droplet, Notebook, SnapCorners, Sled } from "./kit/icons";

/**
 * Chapter 0A movie "What the dot product measures, and why it multiplies by the other length", VERSION 6
 * (movies/ch00/ch00_dot_product_why/storyboard.yaml, 28 scenes), 1920×1080, 30 fps; length = timing.json + 2.5-s hold.
 * v5 rules (storyboard GLOBAL RULES): G1 no headings, titles, part cards or counters, no book/author names, no equation
 * labels except a plain "(1)" on the cosine form; G2 the screen shows keywords, symbols and numbers (the voice explains),
 * no boxes except the s03 component tags; G3 every reveal is tied to the sentence (or the quoted words) that says it,
 * from the measured timing.json (tools/tts.py, af_bella ×1.0); G4 no grid note, no badges, no URLs; G5 labels at the
 * arrow tips. Layout: content y 40–860; the caption band y 880–1040 stays empty; text ≥ 44 px (the kit throws below).
 * Every number on screen is read from data/*.json, written by movies/data/build_ch00_dot_product_why.py from tested
 * fluidpy functions (fluidpy.geo.vectors, fluidpy.core.operators.gradient, fluidpy.core.kinematics); this file only
 * indexes and interpolates those samples. Numbers inside TeX strings are checked against the data at load (CHECK).
 * The storyboard's LaTeX strings appear verbatim below as constants (equations QA gate); the stacks are built from them.
 */

export const DPW_FPS = 30;
const FPS = DPW_FPS;
const sc = timing.scenes;
const HOLD = 75; // 2.5-s silent end-card hold
const XF = 10; // cross-fade frames between scenes
export const DPW_FRAMES = timing.total_frames + HOLD;
const IDS = ["s00_title", "s01_hook", "s02_arrows", "s03_definition", "s04_cosine", "s05_angle_cases", "s06_shadow", "s07_unit_vector",
  "s08_question", "s09_reason1_order", "s10_reason2_cheap", "s11_work", "s12_parcel", "s13_equation", "s14_isotherms",
  "s15_grad_t", "s16a_wind_parts", "s16b_advection_number", "s17_meaning", "s17b_frozen", "s18_keeps_temperature", "s19a_pole_cools",
  "s19b_equation", "s19c_balance", "s19d_three_rates", "s20_twice_steep", "s21_recap", "s22_end"] as const;
if (sc.length !== IDS.length || sc.some((s, i) => s.id !== IDS[i])) throw new Error("timing.json scenes ≠ the v6 scene list");
const K = (id: (typeof IDS)[number]) => IDS.indexOf(id);
const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
const END = [...CUT.slice(1), DPW_FRAMES];
const LEN = (k: number) => END[k] - CUT[k];
/** start / end frame of sentence j of scene k, relative to the scene's first frame */
const SS = (k: number, j: number) => Math.round(sc[k].sentences[j].start * FPS) - CUT[k];
const SE = (k: number, j: number) => Math.round(sc[k].sentences[j].end * FPS) - CUT[k];
/** frame (scene-relative) at which `phrase` is spoken in sentence j of scene k (clip-proportional character time) */
const AT = (k: number, j: number, phrase: string) => {
  const s = sc[k].sentences[j];
  const i = s.text.indexOf(phrase);
  if (i < 0) throw new Error(`phrase "${phrase}" not in ${sc[k].id} sentence ${j}`);
  return Math.round((s.start + ((s.end - s.start) * i) / s.text.length) * FPS) - CUT[k];
};
const fin = (f: number, a: number, n = 12) => ramp(f, a, a + n);
/** N7 (review 5b): side labels whose glyphs measured 34–40 px at 1080p; 62-px type gives ≥ 44-px glyphs */
const N7 = 62;
const fout = (f: number, a: number, n = 10) => 1 - ramp(f, a, a + n);

// ---------------------------------------------------------------- ONE model clock (storyboard clock_rate, W14)
// v6: one constant rate per clocked scene, whole hours on the spoken numbers. s19a: 1 h on "twelve point eight two after",
// 3 h on "twelve point four six after" (sentence 6); the same rate in s12, s18, s20. s17b has its own rate (below).
const K19A = K("s19a_pole_cools");
const H1 = AT(K19A, 5, "twelve point eight two after"), H3 = AT(K19A, 5, "twelve point four six after");
const FPH = (H3 - H1) / 2; // frames per model hour
const H0 = H1 - FPH; // s19a clock start (scene-relative)
const hoursFrom = (f: number, start: number, maxH: number) => clamp((f - start) / FPH, 0, maxH);

// ---------------------------------------------------------------- equations (verbatim from the storyboard)
const EQ_LEN_A = String.raw`|\mathbf a| = \sqrt{5^2+1^2} = \sqrt{26} = 5.099`;
const EQ_LEN_B = String.raw`|\mathbf b| = \sqrt{1^2+3^2} = \sqrt{10} = 3.162`;
const EQ_BRACE_A = String.raw`\underbrace{|\mathbf a|}_{\text{length of }\mathbf a}`;
const EQ_DEF3 = String.raw`\mathbf a\cdot\mathbf b = a_1b_1 + a_2b_2 + a_3b_3`;
const EQ_DEF2N = String.raw`\mathbf a\cdot\mathbf b = a_1b_1 + a_2b_2 = 5\times1 + 1\times3 = 8`;
const EQ_COS = String.raw`\mathbf a\cdot\mathbf b = |\mathbf a|\,|\mathbf b|\cos\theta`;
const EQ_COSN = String.raw`\mathbf a\cdot\mathbf b = 5.099\times3.162\times0.496 \approx 8`;
const EQ_TH = String.raw`\theta = 60.3^\circ,\quad \cos\theta = 0.496`;
const EQ_PQ = [String.raw`\mathbf p\cdot\mathbf q = 3\times2 + 0\times0 = 6`, String.raw`\mathbf p\cdot\mathbf q = 3\times0 + 0\times2 = 0`,
  String.raw`\mathbf p\cdot\mathbf q = 3\times(-2) + 0\times0 = -6`];
const EQ_SHADOW = String.raw`\text{shadow} = |\mathbf a|\cos\theta = \frac{\mathbf a\cdot\mathbf b}{|\mathbf b|} = \frac{8}{3.162} = 2.530`;
const EQ_COS_SH = String.raw`\cos\theta = \frac{\text{shadow}}{|\mathbf a|}`;
const EQ_DIV = String.raw`\frac{\mathbf a\cdot\mathbf b}{|\mathbf b|} = \frac{|\mathbf a|\,|\mathbf b|\cos\theta}{|\mathbf b|}`;
const EQ_BHAT = String.raw`\hat{\mathbf b} = \frac{\mathbf b}{|\mathbf b|} = \left(\frac{1}{3.162},\ \frac{3}{3.162}\right) = (0.316,\ 0.949)`;
const EQ_ADBH = String.raw`\mathbf a\cdot\hat{\mathbf b} = 5\times0.316 + 1\times0.949 \approx 2.53`;
const EQ_Q8 = String.raw`\mathbf a\cdot\mathbf b = (|\mathbf a|\cos\theta)\,|\mathbf b| = 2.530\times3.162 \approx 8`;
const EQ_SYM = String.raw`\mathbf a\cdot\mathbf b = \mathbf b\cdot\mathbf a`;
const EQ_SH_AB = String.raw`\frac{8}{3.162} = 2.530`;
const EQ_SH_BA = String.raw`\frac{8}{5.099} = 1.569`;
const EQ_TRAY = String.raw`2.530\times3.162 \approx 8 \approx 1.569\times5.099`;
const EQ_VX = String.raw`\mathbf v\cdot\hat{\mathbf x} = 6\times1 + 8\times0 = 6\ \mathrm{m/s}`;
const EQ_V6 = String.raw`\mathbf v = (6,\ 8)\ \mathrm{m/s}`;
const EQ_XHAT = String.raw`\hat{\mathbf x} = (1,\ 0)`;
const EQ_W = String.raw`W = \mathbf F\cdot\mathbf d = (|\mathbf F|\cos\theta)\,|\mathbf d|`;
const EQ_WSH = String.raw`\text{shadow} = 20\cos 60^\circ = 10\ \mathrm N`;
const EQ_W5 = String.raw`W = 10\ \mathrm N\times5\ \mathrm m = 50\ \mathrm J`;
const EQ_W10 = String.raw`W = 10\ \mathrm N\times10\ \mathrm m = 100\ \mathrm J`;
const EQ_DTDT_LOCAL = String.raw`\frac{\partial T}{\partial t}`;
const EQ_DTDT_MAT = String.raw`\frac{\mathrm{D}T}{\mathrm{D}t}`;
const EQ_MD = String.raw`\frac{\mathrm{D}\varphi}{\mathrm{D}t} = \frac{\partial\varphi}{\partial t} + \mathbf v\cdot\nabla\varphi`;
const EQ_TF = String.raw`\frac{\mathrm{D}T}{\mathrm{D}t} = \frac{\partial T}{\partial t} + \mathbf v\cdot\nabla T`;
const EQ_DXDY = String.raw`\frac{\partial T}{\partial x} = \frac{1\ ^\circ\mathrm C}{100\ \mathrm{km}},\qquad \frac{\partial T}{\partial y} = 0`;
const EQ_GRAD = String.raw`\nabla T = \left(\frac{\partial T}{\partial x},\ \frac{\partial T}{\partial y}\right)`;
const EQ_GRADN = String.raw`\nabla T = (1.00\times10^{-5}\ \mathrm{K/m},\ 0)`;
const EQ_UNIT = String.raw`\frac{1\ ^\circ\mathrm C}{100\ \mathrm{km}} = \frac{1\ \mathrm K}{10^{5}\ \mathrm m}`;
const EQ_GNORM = String.raw`|\nabla T| = \sqrt{(\partial T/\partial x)^2 + (\partial T/\partial y)^2} = \sqrt{(1.00\times10^{-5})^2 + 0^2} = 1.00\times10^{-5}\ \mathrm{K/m}`;
const EQ_GNORM2 = String.raw`|\nabla T| = \sqrt{(2.00\times10^{-5})^2 + 0^2} = 2.00\times10^{-5}\ \mathrm{K/m}`;
const EQ_COS60 = String.raw`10\times\cos 60^\circ = 5.00\ \mathrm{m/s}`;
const EQ_VGT = String.raw`\mathbf v\cdot\nabla T = (|\mathbf v|\cos\theta)\,|\nabla T|`;
const EQ_VGTN = String.raw`= 5.00\ \mathrm{m/s}\times1.00\times10^{-5}\ \mathrm{K/m} = 5.00\times10^{-5}\ \mathrm{K/s}`;
const EQ_KH = String.raw`5.00\times10^{-5}\ \mathrm{K/s}\times3600\ \mathrm s = 0.18\ \mathrm{K\ per\ hour}`;
const EQ_18KM = String.raw`5.00\ \mathrm{m/s}\times3600\ \mathrm s = 18\ \mathrm{km}`;
const EQ_018 = String.raw`18\ \mathrm{km}\times\frac{1\ ^\circ\mathrm C}{100\ \mathrm{km}} = 0.18\ ^\circ\mathrm C`;
const EQ_D0 = String.raw`\frac{\mathrm{D}T}{\mathrm{D}t} = 0`;
// v6 (s00, s17, s17b, s19c)
const EQ_PQ0 = String.raw`\mathbf p\cdot\mathbf q`;
const EQ_UNITS17 = String.raw`\frac{^\circ\mathrm C}{\mathrm{km}}\times\frac{\mathrm{km}}{\mathrm h} = \frac{^\circ\mathrm C}{\mathrm h}`;
const EQ_ADV17 = String.raw`\mathbf v\cdot\nabla T = +0.18\ \mathrm{K\ per\ hour}`;
const EQ_FRZ = String.raw`\frac{\mathrm{D}T}{\mathrm{D}t} = \frac{\partial T}{\partial t} + \mathbf v\cdot\nabla T = 0 + 0.18\ \mathrm{K\ per\ hour}`;
const EQ_LOC0 = String.raw`\frac{\partial T}{\partial t} = 0`;
const EQ_FRZR = String.raw`\frac{\mathrm{D}T}{\mathrm{D}t} = +0.18\ \mathrm{K\ per\ hour}`;
const EQ_BALF = String.raw`+0.18 = 0 + 0.18`;
const EQ_LOCAL = String.raw`\frac{\partial T}{\partial t} = -\,\mathbf v\cdot\nabla T`;
const EQ_ZERO = String.raw`0 = \frac{\partial T}{\partial t} + \mathbf v\cdot\nabla T`;
const EQ_LOCALN = String.raw`\frac{\partial T}{\partial t} = -\,\mathbf v\cdot\nabla T = -0.18\ \mathrm{K\ per\ hour}`;
const EQ_BAL = String.raw`0 = -0.18 + 0.18`;
const EQ_V20 = String.raw`\mathbf v\cdot\nabla T = 5.00\ \mathrm{m/s}\times2.00\times10^{-5}\ \mathrm{K/m} = 1.00\times10^{-4}\ \mathrm{K/s}`;
const EQ_KH2 = String.raw`1.00\times10^{-4}\ \mathrm{K/s}\times3600\ \mathrm s = 0.36\ \mathrm{K\ per\ hour}`;
const EQ_STEEP = String.raw`\frac{1\ ^\circ\mathrm C}{50\ \mathrm{km}} = 2.00\times10^{-5}\ \mathrm{K/m}`;
const EQ_R1 = String.raw`\mathbf a\cdot\mathbf b = (|\mathbf a|\cos\theta)\,|\mathbf b|`;
const EQ_R3 = String.raw`\mathbf v\cdot\hat{\mathbf x} = 6\ \mathrm{m/s}`;
const EQ_R4 = String.raw`W = \mathbf F\cdot\mathbf d = 50\ \mathrm J`;
const EQ_R5 = String.raw`\mathbf v\cdot\nabla T = 0.18\ \mathrm{K\ per\ hour}`;

// ---------------------------------------------------------------- numbers inside the TeX strings = the data
const W = wx as typeof wx;
const CHECK: [string, number, number, number][] = [
  ["a·b", pair.a_dot_b, 8, 1e-9], ["|a|", pair.norm_a, 5.099, 5e-4], ["|b|", pair.norm_b, 3.162, 5e-4],
  ["|a|²", pair.norm_a_sq, 26, 1e-9], ["|b|²", pair.norm_b_sq, 10, 1e-9],
  ["θ", pair.theta_deg, 60.3, 0.05], ["cos θ", pair.cos_theta, 0.496, 5e-4],
  ["N1 display product", pair.display_cos_product, 7.997, 5e-4], ["shadow a on b", pair.shadow_a_on_b, 2.53, 5e-4],
  ["shadow b on a", pair.shadow_b_on_a, 1.569, 5e-4], ["b̂ x", pair.display_bhat[0], 0.316, 1e-9], ["b̂ y", pair.display_bhat[1], 0.949, 1e-9],
  ["N2 display sum", pair.display_bhat_sum, 2.529, 1e-9], ["a·b̂", pair.a_dot_bhat, 2.53, 5e-4],
  ["area on b", pair.area_on_b, 8, 1e-9], ["area on a", pair.area_on_a, 8, 1e-9],
  ["p·q 0", same.p_dot_q[0], 6, 1e-9], ["p·q 1", same.p_dot_q[1], 0, 1e-9], ["p·q 2", same.p_dot_q[2], -6, 1e-9],
  ["v·x̂", cheap.v_dot_xhat, 6, 1e-9], ["F shadow", work.shadow_N, 10, 1e-9], ["W(5 m)", work.W_J[0], 50, 1e-9],
  ["W(10 m)", work.W_J[work.W_J.length - 1], 100, 1e-9], ["N12 W by components", work.work_component_terms[0] + work.work_component_terms[1], 50, 1e-9],
  ["∂T/∂x", W.dTdx_K_m, 1e-5, 1e-15], ["∂T/∂y", W.dTdy_K_m, 0, 1e-15], ["shadow v", W.shadow_m_s, 5, 1e-9],
  ["N4 chain1 K/s", W.chain_G1[2], 5e-5, 1e-12], ["N4 chain1 K/h", W.chain_G1[3], 0.18, 1e-9],
  ["N4 chain2 ∇T", W.chain_G2[1], 2e-5, 1e-15], ["N4 chain2 K/s", W.chain_G2[2], 1e-4, 1e-12], ["N4 chain2 K/h", W.chain_G2[3], 0.36, 1e-9],
  ["N10 across", W.across_km_1h, 18, 1e-6], ["N10 along", W.along_km_1h, 36, 1e-6], ["upwind 1 h", W.upwind_T_C[0], 12.82, 1e-9],
  ["pole 1 h", W.T_pole_field_C[60], 12.82, 1e-9], ["pole 2 h", W.T_pole_field_C[120], 12.64, 1e-9], ["pole 3 h", W.T_pole_field_C[180], 12.46, 1e-9],
  ["balloon 3 h", W.T_balloon_field_C[180], 13, 1e-9], ["N8 moved", W.balance_moved_K[0], 0.18, 1e-9], ["N8 local", W.balance_local_K[0], -0.18, 1e-9],
  ["N8 sum", W.balance_sum_K[0], 0, 1e-9], ["13.18", W.T_under_balloon[1], 13.18, 1e-9], ["∂T/∂t", W.dTdt_K_h, -0.18, 1e-9],
  ["iso shift 1 h", W.iso_shift_km[60], 18, 1e-9], ["N11 steep spacing", W.isotherms_steep_km[1] - W.isotherms_steep_km[0], 50, 1e-9],
  ["s10 v", cheap.v[0] * 10 + cheap.v[1], 68, 1e-9], ["s10 |v|", cheap.norm_v, 10, 1e-9],
  ["U-M4.3 |∇T|", W.pyth_G1[2], 1e-5, 1e-15], ["U-M4.3 ∂T/∂x, ∂T/∂y", W.pyth_G1[0] + W.pyth_G1[1] * 1e9, 1e-5, 1e-15],
  ["U-M4.3 |∇T| steep", W.pyth_G2[2], 2e-5, 1e-15], ["U-M4.3 steep components", W.pyth_G2[0] + W.pyth_G2[1] * 1e9, 2e-5, 1e-15],
  ["steep pole 1 h", W.T_pole_steep_field_C[60], 12.64, 1e-9], ["pin T", W.T_pin, 13, 1e-9],
  // v6 (V1-V7)
  ["V1 p·q 0°", sweep.p_dot_q[0], 6, 1e-9], ["V1 p·q 90°", sweep.p_dot_q[45], 0, 1e-9], ["V1 p·q 180°", sweep.p_dot_q[90], -6, 1e-9],
  ["V2 18 km", W.fwd_across_km_1h, 18, 1e-9], ["V2 strip 13.18", W.fwd_strip_T_C[1], 13.18, 1e-9], ["V2 span end", W.fwd_span_km[1], 318, 1e-9],
  ["V3 frozen 1 h", W.frozen_balloon_T_C[60], 13.18, 1e-9], ["V3 frozen 2 h", W.frozen_balloon_T_C[120], 13.36, 1e-9],
  ["V3 frozen 3 h", W.frozen_balloon_T_C[180], 13.54, 1e-9], ["V3 frozen pole", W.frozen_pole_T_C[180], 13, 1e-9],
  ["V3 frozen ∂T/∂t", W.frozen_mdt.local_K_s, 0, 1e-15], ["V3 frozen DT/Dt K/h", W.frozen_mdt.total_K_h, 0.18, 1e-9],
  ["V4 across 2 h", W.upwind_across_km[1], 36, 1e-9], ["V4 12.64", W.upwind_T_C[1], 12.64, 1e-9], ["V4 12.46", W.upwind_T_C[2], 12.46, 1e-9],
  ["V7 adv frozen", W.three_rates_K_h.values[0][0], 0.18, 1e-9], ["V7 adv story", W.three_rates_K_h.values[0][1], 0.18, 1e-9],
  ["V7 local frozen", W.three_rates_K_h.values[1][0], 0, 1e-9], ["V7 local story", W.three_rates_K_h.values[1][1], -0.18, 1e-9],
  ["V7 material frozen", W.three_rates_K_h.values[2][0], 0.18, 1e-9], ["V7 material story", W.three_rates_K_h.values[2][1], 0, 1e-9],
];
for (const [n, v, ref, tol] of CHECK) if (Math.abs(v - ref) > tol) throw new Error(`data ≠ storyboard TeX: ${n} = ${v}, TeX ${ref}`);
if (EQ_BRACE_A !== String.raw`\underbrace{|\mathbf a|}_{\text{length of }\mathbf a}`) throw new Error("brace note drifted");

// ---------------------------------------------------------------- formatting and small helpers
const minus = (s: string) => s.replace(/^-/, "−");
const f2 = (v: number) => minus(v.toFixed(2));
const interp = (x: number, xs: number[], ys: number[]) => {
  if (x <= xs[0]) return ys[0];
  if (x >= xs[xs.length - 1]) return ys[ys.length - 1];
  const dx = xs[1] - xs[0], i = Math.floor((x - xs[0]) / dx), w = (x - xs[i]) / dx;
  return ys[i] + (ys[i + 1] - ys[i]) * w;
};
/** value of a per-minute series (iso_t_h grid, 181 samples over 3 h) at model hour h */
const atH = (arr: number[], h: number) => interp(h, W.iso_t_h, arr);
const Scene: React.FC<{ children: React.ReactNode; fadeIn?: boolean }> = ({ children, fadeIn = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.bg, opacity: fadeIn ? ramp(f, 0, XF) : 1 }}>{children}</AbsoluteFill>;
};
/** TeX pieces on one line (left edge x, vertical centre y), each with its own opacity; optional gold underline */
const InlineTeX: React.FC<{ x: number; y: number; size: number; pieces: { s: string; o: number; c?: string }[]; gap?: number; ul?: number }> = ({
  x, y, size, pieces, gap = 24, ul = 0,
}) => {
  if (pieces.every((p) => p.o <= 0)) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(0, -50%)", display: "flex", alignItems: "baseline", gap,
      whiteSpace: "nowrap", lineHeight: 1.2 }}>
      {pieces.map((p, i) => (
        <span key={i} style={{ fontSize: size / 1.21, color: p.c ?? C.ink, opacity: Math.max(0, p.o) }} dangerouslySetInnerHTML={{ __html: texHtml(p.s) }} />
      ))}
      {ul > 0 ? <div style={{ position: "absolute", left: 0, right: 0, bottom: -12, height: 6, background: C.gold, opacity: ul }} /> : null}
    </div>
  );
};
// ---------------------------------------------------------------- the pair plane (s01–s08)
const A = pair.a as Pt, B = pair.b as Pt;
const NA = pair.norm_a, NB = pair.norm_b, AB = pair.a_dot_b, SHAB = pair.shadow_a_on_b;
const PAB = pair.proj_a_on_b as Pt, BH = pair.b_hat as Pt;
const PHI_A = (Math.atan2(A[1], A[0]) * 180) / Math.PI, PHI_B = (Math.atan2(B[1], B[0]) * 180) / Math.PI;
const P = mkP(240, 620, 135);
const O = P(0, 0), ATIP = P(...A), BTIP = P(...B), FOOT = P(...PAB);
const PAIR_TIPS = placeLabels([
  { id: "a", tail: O, tip: ATIP, text: "a", s: T.calc },
  { id: "b", tail: O, tip: BTIP, text: "b", s: T.calc },
], [[O, ATIP], [O, BTIP]]);
const PairBase: React.FC<{ g?: number; bLen?: Pt; showB?: number; gridO?: number; bLine?: number }> = ({ g = 1, bLen, showB = 1, gridO = 1, bLine = 0 }) => {
  const bb = bLen ?? B;
  return (
    <g>
      <Grid P={P} xr={[-1, 6]} yr={[-1, 4]} o={0.9 * gridO} />
      {bLine > 0 ? <Dash p={P(-B[0] * 0.33, -B[1] * 0.33)} q={P(B[0] * 1.62, B[1] * 1.62)} c={C.second} o={0.4 * bLine} w={3} d="14 10" /> : null}
      <Arrow p={O} q={P(bb[0] * g, bb[1] * g)} color={C.second} o={showB} />
      <Arrow p={O} q={P(A[0] * g, A[1] * g)} color={C.first} />
      <TipLabel p={PAIR_TIPS.a} c={C.first} o={g} />
      {showB > 0 && !bLen ? <TipLabel p={PAIR_TIPS.b} c={C.second} o={g * showB} /> : null}
    </g>
  );
};
/** the dotted legs of a and b with their numbers; `pa`, `pb` = pulse of the x-pair (5, 1) and the y-pair (1, 3) */
const Legs: React.FC<{ oA: number; oB: number; px?: number; py?: number }> = ({ oA, oB, px = 0, py = 0 }) => (
  <g>
    <g opacity={oA}>
      <Dash p={O} q={P(A[0], 0)} c={C.first} w={5} d="5 10" />
      <Dash p={P(A[0], 0)} q={ATIP} c={C.first} w={5} d="5 10" />
      <Lbl x={P(2.6, 0)[0]} y={P(0, -0.36)[1]} t={String(A[0])} c={C.first} s={T.key + 16 * px} a="middle" />
      <Lbl x={P(5.2, 0)[0]} y={P(0, 0.5)[1]} t={String(A[1])} c={C.first} s={T.key + 16 * py} />
    </g>
    <g opacity={oB}>
      <Dash p={P(B[0], 0)} q={BTIP} c={C.second} w={5} d="5 10" />
      <Lbl x={P(0.55, 0)[0]} y={P(0, -0.36)[1]} t={String(B[0])} c={C.second} s={T.key + 16 * px} a="middle" />
      <Lbl x={P(1.2, 0)[0]} y={P(0, 1.55)[1]} t={String(B[1])} c={C.second} s={T.key + 16 * py} />
    </g>
  </g>
);
/** "a = (5, 1)" / "b = (1, 3)" under the picture (U-M3.6) */
const SmallPairs: React.FC<{ o: number }> = ({ o }) => (
  <g opacity={o}>
    <Lbl x={120} y={808} t={`a = (${A[0]}, ${A[1]})`} c={C.first} s={T.key} />
    <Lbl x={500} y={808} t={`b = (${B[0]}, ${B[1]})`} c={C.second} s={T.key} />
  </g>
);
/** the tuple "a = (5, 1)" drawn token by token, so pointers can aim at each number */
const tupleLayout = (x: number, y: number, name: string, v: number[], s: number) => {
  const toks: { t: string; x: number }[] = [];
  let cx = x;
  const put = (t: string, gap = 0.18) => { toks.push({ t, x: cx }); cx += textW(t, s) + s * gap; };
  put(name, 0.3); put("=", 0.3); put("(", 0.05);
  const valX: number[] = [];
  v.forEach((n, i) => { valX.push(cx + textW(String(n), s) / 2); put(String(n), 0.05); if (i < v.length - 1) put(",", 0.25); });
  put(")");
  return { toks, valX, y };
};
const Tuple: React.FC<{ L: ReturnType<typeof tupleLayout>; c: string; s: number; o: number }> = ({ L, c, s, o }) => (
  <g opacity={o}>{L.toks.map((t, i) => <Lbl key={i} x={t.x} y={L.y} t={t.t} c={c} s={s} />)}</g>
);

// ================================================================ s00 title (U-M6.3: the one title frame)
/** staggered letters (each rises 24 px and fades in over 8 frames, 2-frame stagger) in one SVG text: dy carries the rise */
const RiseText: React.FC<{ f: number; t: string; x: number; y: number; s: number; at: number; fill: string; colors?: (i: number) => string | undefined }> = ({
  f, t, x, y, s, at, fill, colors,
}) => {
  const ch = [...t];
  const rise = ch.map((_, i) => 24 * (1 - ramp(f, at + 2 * i, at + 2 * i + 8)));
  return (
    <text x={x} y={y} fontSize={s} fontFamily={FONTF} fontWeight={800} fill={fill} stroke={C.bg} strokeWidth={0.06 * s} paintOrder="stroke">
      {ch.map((c, i) => (
        <tspan key={i} dy={rise[i] - (i ? rise[i - 1] : 0)} fillOpacity={ramp(f, at + 2 * i, at + 2 * i + 8)} strokeOpacity={ramp(f, at + 2 * i, at + 2 * i + 8)}
          fill={colors?.(i)}>{c === " " ? " " : c}</tspan>
      ))}
    </text>
  );
};
const SW_O: Pt = [1330, 400], SW_U = 70;
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  const tMet = AT(k, 0, "meteorology"), tEasy = AT(k, 0, "the easy way");
  // Animation A: q sweeps once round p (θ 0 → 360°, ease-in-out) from sweep.json, frame 6 → the word "meteorology"
  const u = ramp(f, 6, tMet), th = 360 * u, si = th / 2;
  const i0 = Math.min(Math.floor(si), sweep.theta_deg.length - 2), w = si - i0;
  const q: Pt = [sweep.q_xy[i0][0] + (sweep.q_xy[i0 + 1][0] - sweep.q_xy[i0][0]) * w, sweep.q_xy[i0][1] + (sweep.q_xy[i0 + 1][1] - sweep.q_xy[i0][1]) * w];
  const dq = sweep.p_dot_q[i0] + (sweep.p_dot_q[i0 + 1] - sweep.p_dot_q[i0]) * w;
  const shq = sweep.shadow_q_on_p[i0] + (sweep.shadow_q_on_p[i0 + 1] - sweep.shadow_q_on_p[i0]) * w;
  const Psw = mkP(SW_O[0], SW_O[1], SW_U), O0 = Psw(0, 0), qT = Psw(...q), foot = Psw(shq, 0);
  const zero = Math.abs(dq) < 0.005, pos = dq > 0 && !zero;
  const sCol = zero ? C.muted : pos ? C.first : C.neg;
  const sGlyph = zero ? "0" : pos ? "+" : "−";
  const oA = fin(f, 4, 10) * fout(f, tMet, 12), oB = fin(f, tMet, 12);
  // Animation B: the mini map (the s12 map at 640 × 384 px), 1 model hour in 4 s from the word "meteorology"
  const hB = clamp((f - tMet) / (4 * FPS), 0, 1);
  const mg: Geo = { mx: 1160, my: 200, km: 640 / 600, w: 600, h: 360 };
  const shiftB = atH(W.iso_shift_km as number[], hB), isoB = ISO_X.map((xs) => atH(xs, hB));
  const TpB = atH(W.T_pole_field_C as number[], hB);
  const pinB = gP(mg, PIN), vB: Pt = [pinB[0] + 150 * Math.cos(VANG), pinB[1] - 150 * Math.sin(VANG)];
  const pz = 1 + 0.06 * pulse(f, tEasy, 12);
  return (
    <Scene fadeIn={false}>
      <Svg>
        <defs>
          <linearGradient id="ttl" gradientUnits="userSpaceOnUse" x1={100} y1={0} x2={760} y2={0}>
            <stop offset="0" stopColor={C.first} /><stop offset="1" stopColor={C.gold} />
          </linearGradient>
        </defs>
        <RiseText f={f} t="The dot" x={100} y={250} s={150} at={2} fill="url(#ttl)" />
        <RiseText f={f} t="product" x={100} y={410} s={150} at={10} fill="url(#ttl)" />
        <g transform={`translate(104 ${530}) scale(${pz}) translate(-104 ${-530})`}>
          <RiseText f={f} t="made easy" x={104} y={550} s={96} at={18} fill={C.key} />
        </g>
        <RiseText f={f} t="and how meteorology uses it" x={106} y={660} s={68} at={36} fill={C.key} colors={(i) => (i >= 8 && i < 19 ? C.first : undefined)} />
        {/* A: the sweep */}
        <g opacity={oA}>
          <Grid P={Psw} xr={[-3, 4]} yr={[-3, 3]} o={0.5} />
          {Math.abs(shq) > 0.01 ? <line x1={O0[0]} y1={O0[1]} x2={foot[0]} y2={foot[1]} stroke={sCol} strokeWidth={20} strokeOpacity={0.75}
            strokeDasharray={pos ? undefined : "12 7"} /> : null}
          <Dash p={qT} q={foot} w={4} o={0.8} />
          <Arrow p={O0} q={Psw(...(sweep.p as Pt))} color={C.first} />
          <Arrow p={O0} q={qT} color={C.second} />
          <Lbl x={Psw(3, 0)[0] + 24} y={O0[1] - 40} t="p" c={C.first} s={T.calc} />
          <Lbl x={qT[0] + (q[0] >= 0 ? 22 : -22)} y={qT[1] - 30} t="q" c={C.second} s={T.calc} a={q[0] >= 0 ? "start" : "end"} />
          <Lbl x={1272} y={770} t={`${sGlyph}${zero ? "" : " "}${Math.abs(dq).toFixed(2)}`} c={sCol} s={84} a="start" />
        </g>
        {/* B: the mini map with sliding isotherms and the pole ticking down */}
        <g opacity={oB}>
          {Array.from({ length: 80 }, (_, i) => <rect key={i} x={mg.mx + (i * 640) / 80} y={mg.my} width={640 / 80 + 0.6} height={384}
            fill={tColor(T_AT(((i + 0.5) * 600) / 80, shiftB))} />)}
          {isoB.map((xk, i) => xk > 1 && xk < 599 ? <line key={i} x1={gX(mg, xk)} y1={mg.my} x2={gX(mg, xk)} y2={mg.my + 384} stroke="#fff" strokeOpacity={0.75} strokeWidth={3} /> : null)}
          <rect x={mg.mx} y={mg.my} width={640} height={384} fill="none" stroke={C.grid} strokeWidth={3} />
          <Arrow p={pinB} q={vB} color={C.first} w={9} head={32} />
          <PoleThermometer x={pinB[0]} y={pinB[1]} s={1.1} />
          <PoleThermometer x={1180} y={700} s={0.7} />
          <Lbl x={1220} y={660} t={`${TpB.toFixed(2)} °C`} c={C.local} s={T.calc} />
        </g>
      </Svg>
      <TeX s={`${EQ_PQ0} =`} x={1250} y={770} size={84} ax={1} o={oA} />
    </Scene>
  );
};

// ================================================================ s01 hook
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  const g = ramp(f, 0, 30);
  const tEq = AT(k, 1, "why it's built"), tWind = AT(k, 1, "about the wind");
  const slide = ramp(f, tEq, tEq + 14);
  const oMap = fin(f, tWind, 12) * fout(f, Math.min(tWind + 60, LEN(k) - 12), 12);
  return (
    <Scene>
      <Svg>
        <PairBase g={g} />
        <g opacity={0.85 * oMap}>
          <MiniMap x={1240} y={560} w={420} h={250} />
          {/* S1 (review 5): the thumbnail reads as a weather map: isotherms (in MiniMap) + a wind arrow at 60° */}
          <Arrow p={[1400, 760]} q={[1400 + 150 * Math.cos(VANG), 760 - 150 * Math.sin(VANG)]} color={C.first} w={9} head={32} />
        </g>
      </Svg>
      <TeX s={String.raw`\mathbf a\cdot\mathbf b`} x={1450 - 130 * slide} y={330} size={T.hero} ax={0.5} o={fin(f, SS(k, 0), 10)} />
      <TeX s={String.raw`= ${AB.toFixed(0)}`} x={1530} y={330} size={T.hero} ax={0} o={slide} />
    </Scene>
  );
};

// ================================================================ s02 arrows and components
const TA2 = tupleLayout(1100, 330, "a", A, T.calc), TB2 = tupleLayout(1100, 560, "b", B, T.calc);
const [LA_L, LA_R] = splitEq(EQ_LEN_A), [LB_L, LB_R] = splitEq(EQ_LEN_B);
const LA = eqPieces(LA_R), LBp = eqPieces(LB_R);
const BRACE_W = String.raw`\text{length of }\mathbf a`;
if (`\\underbrace{${LA_L}}_{${BRACE_W}}` !== EQ_BRACE_A) throw new Error("BRACE_A ≠ storyboard brace note");
// the words are centred under |a| without widening it (\mathclap), so |a| stays next to its "="
const BRACE_A: Part[] = [{ t: LA_L, c: C.first, u: { w: String.raw`\mathclap{${BRACE_W}}`, c: C.first } }];
const lenRows = (f: number, ta: number, tac: number, tb: number, tbc: number, brace: boolean, flashAt?: number): CalcRow[] => {
  const fl = flashAt !== undefined ? pulse(f, flashAt, 16) : 0;
  const braceO = fout(f, ta + 75, 15);
  const lhsA = brace
    ? { parts: BRACE_A, layers: [{ t: "all" as const, tc: { 0: fl > 0.3 ? C.gold : C.first }, o: 1 }, { u: [0], o: braceO }] }
    : String.raw`\textcolor{${C.first}}{${LA_L}}`;
  // S9 (review 5): the brace row closes up as its words fade, and every line gets the same 120-px pitch
  return [
    { lhs: lhsA, rhs: LA[0], at: ta, c: C.first, h: brace ? 120 + 45 * braceO : 120 },
    { rhs: `${LA[1]} ${LA[2]}`, at: tac, c: C.first, cont: true, h: 120 },
    { lhs: LB_L, rhs: LBp[0], at: tb, c: C.second, h: 120 },
    { rhs: `${LBp[1]} ${LBp[2]}`, at: tbc, c: C.second, cont: true, h: 120 },
  ];
};
const ABRK_OFF = 34;
const S02: React.FC = () => {
  const f = useCurrentFrame(), k = K("s02_arrows");
  const tLen = AT(k, 0, "a length"), tDir = AT(k, 0, "a direction");
  const t1 = SS(k, 1), t1b = AT(k, 1, "vector b goes"), t2 = SS(k, 2), tComp = AT(k, 2, "called components"), t2b = AT(k, 2, "one and three are those");
  const t3 = SS(k, 3), tBars = AT(k, 3, "two straight bars"), tA = AT(k, 3, "about five point one"), tB = AT(k, 3, "and three point one six");
  const oVec = fin(f, 4) * fout(f, t1);
  const brk = fin(f, tLen, 10) * fout(f, t1 + 30);
  const brkM = bracketMid(O, ATIP, ABRK_OFF);
  const oBlock = fout(f, t3);
  return (
    <Scene>
      <Svg>
        <PairBase />
        <Legs oA={fin(f, t1)} oB={fin(f, t1b)} />
        <Bracket p={O} q={ATIP} off={ABRK_OFF} c={C.first} o={brk} w={6 + 4 * pulse(f, tA, 20)} />
        <g opacity={fin(f, t3)}>
          <RightTick at={P(A[0], 0)} u1={[-1, 0]} u2={[0, -1]} />
          <RightTick at={P(B[0], 0)} u1={[1, 0]} u2={[0, -1]} />
        </g>
        <SmallPairs o={fin(f, t3 + 6)} />
        <Lbl x={1100} y={180} t="vector" c={C.key} s={96} o={oVec} />
        <Keyword f={f} text="length" at={[1100, 320]} appear={tLen} out={t1} targets={[brkM]} />
        <Keyword f={f} text="direction" at={[1100, 430]} appear={tDir} out={t1} targets={[add(ATIP, [-16, 4])]} />
        <g opacity={oBlock}>
          <Tuple L={TA2} c={C.first} s={T.calc} o={fin(f, t2)} />
          <Keyword f={f} text="components" at={[1180, 450]} appear={tComp} targets={TA2.valX.map((x) => [x, 368] as Pt)} />
          <Tuple L={TB2} c={C.second} s={T.calc} o={fin(f, t2b)} />
          <Keyword f={f} text="components" at={[1180, 680]} appear={t2b + 8} targets={TB2.valX.map((x) => [x, 598] as Pt)} />
        </g>
        <Lbl x={1700} y={110} t="Pythagoras" c={C.muted} s={T.key} a="end" o={fin(f, t3 + 4) * fout(f, t3 + 64)} />
      </Svg>
      <CalcStack f={f} x={1300} y={160} rows={lenRows(f, t3 + 4, tA, tB - 6, tB + 14, true, tBars)} maxLines={3} />
    </Scene>
  );
};

// ================================================================ s03 definition
const P3: Part[] = [{ t: String.raw`\mathbf a\cdot\mathbf b` }, { t: "=" },
  { t: "a_1b_1", u: { w: "x", c: C.key, kind: "set" } }, { t: "+" }, { t: "a_2b_2", u: { w: "y", c: C.key, kind: "set" } },
  { t: "+" }, { t: "a_3b_3", u: { w: "z", c: C.key, kind: "set" }, x: C.neg }];
const P3b: Part[] = P3.map((p, i) => (i === 6 ? { ...p, u: { w: String.raw`\text{2-D}`, c: C.key, kind: "set" as const } } : p));
if (plainOf(P3) !== EQ_DEF3) throw new Error("s03 parts ≠ EQ_DEF3");
const DEF2_TAIL = eqPieces(splitEq(EQ_DEF2N)[1]); // ["= a_1b_1 + a_2b_2", "= 5\times1 + 1\times3", "= 8"]
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_definition");
  const tPx = AT(k, 1, "multiply the matching"), tPy = AT(k, 1, "and then add");
  const t2 = SS(k, 2), tX = AT(k, 2, "x, y"), tY = AT(k, 2, "y and z"), tZ = AT(k, 2, "and z");
  const tDrop = AT(k, 3, "drops out");
  const t4 = SS(k, 4), t4b = AT(k, 4, "and the second");
  const t5 = SS(k, 5), t8 = AT(k, 5, "a dot b equals eight");
  const t6 = SS(k, 6), tSP = AT(k, 6, "scalar product");
  const grey = fin(f, tDrop, 10);
  const layers: Layer[] = [
    { t: "all", o: 1 - grey }, { t: "all", tc: { 5: "#4b5570", 6: "#4b5570" }, o: grey }, { x: [6], o: grey },
    { u: [2], o: fin(f, tX, 8) }, { u: [4], o: fin(f, tY, 8) }, { u: [6], o: fin(f, tZ, 8) * (1 - grey) },
  ];
  const tag = (o: number, a: string, b: string, cap: string[]) => (
    <div style={{ opacity: o, textAlign: "center", border: `3px solid ${C.gold}`, borderRadius: 12, padding: "4px 6px", marginTop: 10,
      fontFamily: "'Segoe UI', Arial, sans-serif", width: 270, boxSizing: "border-box" }}>
      <div style={{ fontSize: 48, fontWeight: 650, color: C.first, lineHeight: 1.15 }}>{a}</div>
      <div style={{ fontSize: 48, fontWeight: 650, color: C.second, lineHeight: 1.15 }}>{b}</div>
      {cap.map((c, i) => <div key={i} style={{ fontSize: 44, color: C.gold, lineHeight: 1.1 }}>{c}</div>)}
    </div>
  );
  const piece = (s: string) => <div style={{ paddingTop: 4 }}><TeX s={s} x={0} y={0} size={T.calc} ay={0} /></div>;
  const pz = pulse(f, tPx, 24), py = pulse(f, tPy, 24);
  return (
    <Scene>
      <Svg>
        <PairBase />
        <Legs oA={1} oB={1} px={pz} py={py} />
        <SmallPairs o={1} />
        <Keyword f={f} text="scalar" at={[1080, 790]} appear={t6} targets={[[1745, 730]]} bend={0.12} />
        <Lbl x={1080} y={851} t="scalar product" c={C.key} s={T.key} o={fin(f, tSP, 8)} />
        <GhostArrow x={1660} y={812} len={110} o={0.9 * fin(f, AT(k, 5, "not an arrow"))} />
      </Svg>
      <Layered parts={P3} layers={layers} x={1070} y={50} size={70} ay={0} o={fin(f, t2)} />
      <Layered parts={P3b} layers={[{ o: 0 }, { u: [6], o: grey }]} x={1070} y={50} size={70} ay={0} o={fin(f, t2)} />
      {/* the second line with the gold component tags (U-M3.7, the one user-approved box) */}
      <div style={{ position: "absolute", left: 1062, top: 240, display: "flex", alignItems: "flex-start", gap: 10, opacity: fin(f, t4) }}>
        <div style={{ position: "relative", width: 150, height: 90 }}>{piece(String.raw`\mathbf a\cdot\mathbf b =`)}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "relative", width: 110, height: 90 }}>{piece("a_1b_1")}</div>
          {tag(fin(f, t4), `a₁ = ${A[0]}`, `b₁ = ${B[0]}`, ["first", "components"])}
        </div>
        <div style={{ position: "relative", width: 40, height: 90 }}>{piece("+")}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "relative", width: 110, height: 90 }}>{piece("a_2b_2")}</div>
          {tag(fin(f, t4b), `a₂ = ${A[1]}`, `b₂ = ${B[1]}`, ["second", "components"])}
        </div>
      </div>
      <CalcStack f={f} x={1232} y={590} size={T.calc} rows={[
        { rhs: DEF2_TAIL[1], at: t5, h: 92 },
        { rhs: rep(DEF2_TAIL[2], "= 8", "= 5 + 3 = 8"), at: t8, cont: true, h: 92 },
      ]} />
      <TeX s={AB.toFixed(0)} x={1790} y={700} size={T.hero} ax={0.5} o={fin(f, t8 + 6)} glow={pulse(f, t6 + 18, 20)} />
    </Scene>
  );
};

// ================================================================ s04 the cosine form (1)
const [CN_L, CN_R] = splitEq(EQ_COSN), CNP = eqPieces(CN_R); // a·b | "= 5.099×3.162×0.496", "\approx 8"
const [CN_A, CN_B] = CNP[0].split(String.raw`\times0.496`);
const [TH_A, TH_B] = EQ_TH.split(String.raw`,\quad `);
const ANG_MID = ((PHI_A + PHI_B) / 2) * Math.PI / 180;
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = K("s04_cosine");
  const t1 = SS(k, 1), t2 = SS(k, 2), tc1 = AT(k, 2, "one when"), tc0 = AT(k, 2, "zero at"), tcm = AT(k, 2, "minus one");
  const t3 = SS(k, 3), tTh = AT(k, 3, "sixty degrees"), tCo = AT(k, 3, "with a cosine"), t4 = SS(k, 4), t8 = AT(k, 4, "eight again"), tOne = AT(k, 4, "equation one");
  const arc = clamp((f - 6) / 20, 0, 1);
  const oCos = fin(f, t2) * fout(f, t3);
  const X = (c: number) => 1450 + c * 250, YL = 330;
  const mini = (q: Pt, x: number, o: number) => (
    <g opacity={o}>
      <Arrow p={[x - 45, 255]} q={[x + 15, 255]} color={C.first} w={6} head={18} halo={false} />
      <Arrow p={[x - 45, 255]} q={[x - 45 + q[0] * 30, 255 - q[1] * 30]} color={C.second} w={6} head={18} halo={false} />
    </g>
  );
  // M4 (review 5, U-M3.9): the full Pythagoras lines for |a| and |b|, θ and cos θ on one line, then the product;
  // all five lines stay on screen until "≈ 8" (no scrolling stack), so 5.099 and 3.162 keep their source lines.
  const MX = 1100;
  const thetaLbl = P(1.35 * Math.cos(ANG_MID), 1.35 * Math.sin(ANG_MID));
  return (
    <Scene>
      <Svg>
        <PairBase />
        <Bracket p={O} q={ATIP} off={ABRK_OFF} c={C.first} o={0.9} />
        <Bracket p={O} q={BTIP} off={-ABRK_OFF} c={C.second} o={0.9} />
        <Arc P={P} a0={PHI_A} a1={PHI_B} r={1.0} draw={arc} w={5} />
        <Lbl x={thetaLbl[0]} y={thetaLbl[1]} t="θ" s={T.calc} o={arc} />
        <SmallPairs o={1} />
        <Keyword f={f} text="angle" at={[470, 400]} appear={AT(k, 1, "the angle between")} out={t2 - 6}
          targets={[P(1.0 * Math.cos(ANG_MID), 1.0 * Math.sin(ANG_MID)), [1723, 205]]} />
        <g opacity={oCos}>
          <line x1={X(-1)} y1={YL} x2={X(1)} y2={YL} stroke={C.muted} strokeWidth={5} />
          {([[1, tc1, [2, 0], 395], [0, tc0, [0, 2], 450], [-1, tcm, [-2, 0], 395]] as [number, number, Pt, number][]).map(([c, at, q, ly]) => (
            <g key={c} opacity={fin(f, at, 8)}>
              <line x1={X(c)} y1={YL - 16} x2={X(c)} y2={YL + 16} stroke={C.ink} strokeWidth={5} />
              {mini(q, X(c), 1)}
              <Lbl x={X(c)} y={ly} t={`cos ${c === 1 ? 0 : c === 0 ? 90 : 180}° = ${minus(String(c))}`} s={T.key} a="middle" c={C.ink} />
            </g>
          ))}
        </g>
        <Lbl x={1774} y={150} t="(1)" c={C.muted} s={T.key} o={fin(f, tOne, 8)} />
      </Svg>
      <TeX s={EQ_COS} x={1080} y={150} size={T.eq} o={fin(f, t1)} />
      <TeX s={String.raw`\textcolor{${C.first}}{${LA_L}} ${LA_R}`} x={MX} y={270} size={54} c={C.first} o={fin(f, t3)} />
      <TeX s={EQ_LEN_B} x={MX} y={378} size={54} c={C.second} o={fin(f, t3 + 15)} />
      <InlineTeX x={MX} y={486} size={60} pieces={[{ s: `${TH_A},`, o: fin(f, tTh) }, { s: TH_B, o: fin(f, tCo) }]} />
      <InlineTeX x={MX} y={594} size={60} pieces={[{ s: `${CN_L} ${CN_A}`, o: fin(f, t4) }, { s: String.raw`{}\times0.496`, o: fin(f, t4 + 15) }]} gap={0} />
      <InlineTeX x={MX + 102} y={700} size={68} pieces={[{ s: rep(CNP[1], "8", String.raw`\mathbf{8}`), o: fin(f, t8) }]} ul={clamp((f - t8 - 8) / 10, 0, 1)} />
    </Scene>
  );
};

// ================================================================ s05 the angle sets the sign
const U5 = 80;
const PANEL_O: Pt[] = [[250, 520], [880, 520], [1540, 520]];
const PANEL_XR: [number, number][] = [[-1, 4], [-2, 4], [-3, 3]];
const ROW_C = [370, 940, 1520]; // centres of the text under each picture
const BIG_P: { o: Pt; u: number } = { o: [800, 150], u: 260 / 3 };
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = K("s05_angle_cases");
  const tFly = AT(k, 0, "fixed in all three"), tP = SS(k, 1);
  // v6 (U-M6.1-2): sentences 2 (q same direction) · 3 (3×2 + 0×0 = 6) · 4 (right angle, zero) · 5 (the rule) · 6 (opposite) ·
  // 7 (the opposite rule) · 8 (closing). Every drawn element is the v5 one; only the reveal times move.
  const tQ = [AT(k, 2, "the other vector, q"), AT(k, 4, "at a right angle"), SS(k, 6)];
  const tTip = [AT(k, 2, "components two and zero"), AT(k, 4, "components zero and two"), SS(k, 6)];
  const tSame = AT(k, 2, "same direction");
  const tR = [AT(k, 3, "six, a positive"), AT(k, 4, "the dot product is zero"), AT(k, 6, "minus six")];
  const tL = [SS(k, 3), AT(k, 4, "the dot product is zero"), AT(k, 6, "three times")];
  const tRA = SS(k, 5), tOpp = AT(k, 6, "opposite direction"), tRule = AT(k, 7, "opposite directions"), tNeg = AT(k, 7, "is negative"), t7 = SS(k, 8);
  const plOpp = pulse(f, tRule, 24), plNeg = pulse(f, tNeg, 24);
  const fly = ramp(f, tFly, tFly + 30);
  const p = same.p as Pt;
  const pBigTip: Pt = [BIG_P.o[0] + p[0] * BIG_P.u, BIG_P.o[1]];
  const lines = EQ_PQ.map((e) => { const [l, r] = splitEq(e); const pc = eqPieces(r); return `${l} ${pc[0]}`; });
  const kw = ["positive", "", "negative"];
  return (
    <Scene>
      <Svg>
        {/* the big p, alone at the top centre; its copies fly into the three pictures */}
        <Arrow p={BIG_P.o} q={pBigTip} color={C.first} w={12} head={46} o={fin(f, 4)} />
        <Lbl x={pBigTip[0] + 30} y={BIG_P.o[1]} t={f >= tP ? `p = (${p[0]}, ${p[1]})` : "p"} c={C.first} s={T.calc} o={fin(f, 4)} />
        {[0, 1, 2].map((i) => {
          const Op = PANEL_O[i], Pq = mkP(Op[0], Op[1], U5);
          const q = same.q[i] as Pt, d = same.p_dot_q[i], sh = same.shadow_p_on_q[i], nq = same.norm_q[i];
          const oq = fin(f, tQ[i], 14);
          const pO = lerp(BIG_P.o, Op, fly), pu = BIG_P.u + (U5 - BIG_P.u) * fly;
          // M6 (review 5): in panel 1 q lies along p, so it is drawn ON TOP of p and lifted 16 px above p's shaft
          // (a drawing offset only; q is still (2, 0)). M3: no product rectangles (never narrated).
          const lift = i === 0 ? -16 : 0;
          const Oq: Pt = [Op[0], Op[1] + lift], qT: Pt = add(Pq(...q), [0, lift]);
          void d; void sh; void nq;
          const tip = i === 2 ? { x: qT[0] - 10, y: qT[1] - 112, a: "middle" as const } : { x: qT[0], y: qT[1] - (i === 0 ? 50 : 52), a: "middle" as const };
          return (
            <g key={i}>
              <Grid P={Pq} xr={PANEL_XR[i]} yr={[-2, 3]} o={0.6 * fly} />
              {fly > 0 ? <g>
                <Arrow p={pO} q={[pO[0] + p[0] * pu, pO[1]]} color={C.first} w={10} head={36} />
                <Lbl x={pO[0] + p[0] * pu + 16} y={pO[1] + (fly > 0.9 ? 40 : 0)} t="p" c={C.first} s={T.key} o={fly} />
              </g> : null}
              <g opacity={oq}>
                <Arrow p={Oq} q={qT} color={C.second} w={10} head={38} />
                {i === 1 ? <RightTick at={Op} u1={[1, 0]} u2={[0, -1]} s={30} /> : null}
                {i === 2 ? <Arc P={Pq} a0={0} a1={180} r={0.8} w={4} /> : null}
                <Lbl x={i === 1 ? Op[0] + 70 : i === 0 ? Op[0] - 60 : Op[0] + 112} y={i === 1 ? Op[1] - 52 : i === 0 ? Op[1] - 44 : Op[1] - 82}
                  t={["0°", "90°", "180°"][i]} s={T.floor} c={C.ink} a={i === 2 ? "start" : i === 1 ? "start" : "middle"} />
                <Lbl x={tip.x} y={tip.y} t={`q = (${minus(String(q[0]))}, ${minus(String(q[1]))})`} c={C.second} s={T.key} a={tip.a} o={fin(f, tTip[i], 10)} />
              </g>
            </g>
          );
        })}
        {[0, 1, 2].map((i) => {
          const d = same.p_dot_q[i];
          const pl = pulse(f, t7 + i * 18, 18);
          return (
            <g key={`r${i}`} opacity={fin(f, tR[i], 10)}>
              <Lbl x={ROW_C[i] + 80} y={812} t={i === 1 ? "right angle" : kw[i]} c={d < 0 ? C.neg : C.key} s={T.key + (i === 2 ? 14 * plNeg : 0)} a="start"
                o={i === 1 ? fin(f, tRA, 10) : 1} />
              <Lbl x={ROW_C[i] + 60} y={812} t={`= ${minus(d.toFixed(0))}`} c={d < 0 ? C.neg : C.ink} s={T.calc + 20 * pl} a="end" />
            </g>
          );
        })}
        {/* S16: "opposite" sits under the two arrows of panel 3, centred on the 180° picture */}
        <Lbl x={PANEL_O[2][0]} y={PANEL_O[2][1] + 70} t="opposite" c={C.key} s={T.key + 14 * plOpp} a="middle" o={fin(f, tOpp, 10)} />
        {/* v6 S3 (U-M6.1): 'same direction' under the arrows of panel 1, on the words */}
        <Lbl x={PANEL_O[0][0] + 120} y={PANEL_O[0][1] + 118} t="same direction" c={C.key} s={T.key} a="middle" o={fin(f, tSame, 10)} />
      </Svg>
      {[0, 1, 2].map((i) => (
        <TeX key={i} s={lines[i]} x={ROW_C[i]} y={736} size={54} ax={0.5} o={fin(f, tL[i], 10)} />
      ))}
    </Scene>
  );
};

// ================================================================ s06 the shadow
const SH_LBL: Pt = [395, 262];
const [DIV_L, DIV_R] = splitEq(EQ_DIV);
/** row 3 of s06: (1) divided by |b|, the two |b| struck in rose (template: T = text colour, S = strike colour) */
const DIVc = (Tc: string, Sc: string) => String.raw`\textcolor{${Tc}}{=} \frac{\textcolor{${Tc}}{|\mathbf a|\,}\textcolor{${Sc}}{\cancel{\textcolor{${Tc}}{|\mathbf b|}}}\textcolor{${Tc}}{\cos\theta}}{\textcolor{${Sc}}{\cancel{\textcolor{${Tc}}{|\mathbf b|}}}}`;
const unwrap = (t: string) => t.replace(/\\textcolor\{[^}]*\}/g, "").replace(/\\cancel/g, "").replace(/[{}\s]/g, "");
// the layered rhs of row 3 must reproduce DIV_R (up to spaces)
if (unwrap(DIVc("x", "y")) !== DIV_R.replace(/[{}\s]/g, "")) throw new Error("s06 row 3 ≠ EQ_DIV");
const SH_FINAL = rep(EQ_SHADOW, String.raw` = |\mathbf a|\cos\theta`, "");
const [SHF_L, SHF_R] = splitEq(SH_FINAL), SHFP = eqPieces(SHF_R);
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = K("s06_shadow");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), tLeft = AT(k, 4, "only the shadow"), tNum = AT(k, 4, "eight over");
  const drop = clamp((f - t1 - 10) / 30, 0, 1), band = fin(f, t2, 20), tri = fin(f, t3);
  const strike = fin(f, tLeft, 10);
  const rows: CalcRow[] = [
    { lhs: splitEq(EQ_COS_SH)[0], rhs: splitEq(EQ_COS_SH)[1], at: t3 + 10, h: 165 },
    { lhs: String.raw`\text{shadow}`, rhs: String.raw`= |\mathbf a|\cos\theta`, at: AT(k, 3, "is the length"), c: C.first },
    { lhs: DIV_L, h: 175, rhs: { raw: [{ s: DIVc(C.ink, "transparent"), o: 1 }, { s: DIVc("transparent", C.neg), o: strike }] }, at: t4 + 4 },
    { lhs: SHF_L, rhs: SHFP[0], at: tLeft + 14, c: C.first, h: 185 },
    { rhs: `${SHFP[1]} ${rep(SHFP[2], "2.530", String.raw`\mathbf{2.530}`)}`, at: tNum, cont: true, c: C.first, h: 165, ul: tNum + 30, ulOff: 30 },
  ];
  const lbl = f >= tNum + 30 ? `shadow = ${SHAB.toFixed(3)}` : "shadow";
  return (
    <Scene>
      <Svg>
        <polygon points={[O, FOOT, ATIP].map((p) => p.join(",")).join(" ")} fill={C.first} fillOpacity={0.12 * tri} />
        <PairBase bLine={fin(f, 6, 20)} />
        <Band p={O} q={lerp(O, FOOT, band)} color={C.first} o={band > 0 ? 1 : 0} />
        {drop > 0 ? <Dash p={ATIP} q={lerp(ATIP, FOOT, drop)} w={5} /> : null}
        {drop >= 1 ? <RightTick at={FOOT} u1={unit(FOOT, O)} u2={unit(FOOT, ATIP)} /> : null}
        <Keyword f={f} text={lbl} at={SH_LBL} appear={AT(k, 2, "called the shadow")} targets={[lerp(O, FOOT, 0.55)]} c={C.first} />
        <g opacity={tri}>
          <Arc P={P} a0={PHI_A} a1={PHI_B} r={0.75} w={4} />
          <Lbl x={P(0.95 * Math.cos(ANG_MID), 0.95 * Math.sin(ANG_MID))[0]} y={P(0.95 * Math.cos(ANG_MID), 0.95 * Math.sin(ANG_MID))[1]} t="θ" s={T.key} />
          {/* M5: |a| below the x-axis line, under a's arrow, clear of the axis */}
          <Lbl x={P(3.3, 0)[0]} y={P(0, 0)[1] + 52} t={`|a| = ${NA.toFixed(3)}`} c={C.first} s={T.key} a="middle" />
        </g>
        <SmallPairs o={1} />
        <Lbl x={1080} y={86} t="(1) ÷ |b|" c={C.gold} s={T.key} o={fin(f, t4) * fout(f, tNum + 40)} />
      </Svg>
      <CalcStack f={f} x={1330} y={140} rows={rows} maxLines={3} />
    </Scene>
  );
};

// ================================================================ s07 the unit vector b̂
const [BH_L, BH_R] = splitEq(EQ_BHAT), BHP = eqPieces(BH_R); // b̂ | "= b/|b|", "= (1/3.162, 3/3.162)", "= (0.316, 0.949)"
const BH_COL = rep(rep(BHP[1], String.raw`\frac{1}{3.162}`, String.raw`\frac{${col(C.second, "1")}}{3.162}`), String.raw`\frac{3}{3.162}`, String.raw`\frac{${col(C.second, "3")}}{3.162}`);
const ADBP = eqPieces(EQ_ADBH.slice(EQ_ADBH.indexOf("= "))); // "= 5×0.316 + 1×0.949", "≈ 2.53"
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_unit_vector");
  const tShrink = AT(k, 1, "Divide b"), tUnit = AT(k, 1, "the unit vector"), t2 = SS(k, 2), t3 = SS(k, 3), tSum = AT(k, 3, "two point five three");
  const n = cheap.scales.length - 1;
  const kk = Math.round(clamp((f - tShrink) / 45, 0, 1) * n);
  const bk = cheap.b_series[kk] as Pt, shrunk = kk === n;
  const bhT = P(...BH);
  const rows: CalcRow[] = [
    { lhs: BH_L, rhs: BH_COL, at: t2, c: C.second, h: 172 },
    { rhs: BHP[2], at: AT(k, 2, "each divided") + 10, c: C.second, cont: true },
    { lhs: String.raw`\mathbf a\cdot\hat{\mathbf b}`, rhs: ADBP[0].split(" + ")[0], at: t3 + 20 },
    { rhs: "{} + " + ADBP[0].split(" + ")[1], at: t3 + 34, cont: true },
    { rhs: rep(ADBP[1], "2.53", String.raw`\mathbf{2.53}`), at: tSum, cont: true, c: C.first, ul: tSum + 10 },
  ];
  return (
    <Scene>
      <Svg>
        <Band p={O} q={FOOT} color={C.first} o={1} w={20 + 10 * pulse(f, 6, 24)} />
        <PairBase bLen={bk} />
        {kk === 0 ? <TipLabel p={PAIR_TIPS.b} c={C.second} /> : null}
        {kk > 0 && !shrunk ? <Arrow p={O} q={BTIP} color={C.second} o={0.25} w={6} head={30} halo={false} /> : null}
        <Dash p={ATIP} q={FOOT} o={0.5} w={4} />
        <Lbl x={SH_LBL[0]} y={SH_LBL[1]} t={`shadow = ${SHAB.toFixed(3)}`} c={C.first} s={T.key} />
        <Check x={SH_LBL[0] + textW(`shadow = ${SHAB.toFixed(3)}`, T.key) + 50} y={SH_LBL[1]} o={fin(f, tSum + 10, 8)} />
        {shrunk ? <Lbl x={bhT[0] - 30} y={bhT[1] - 20} t="b̂" c={C.second} s={T.calc} a="end" /> : null}
        <g opacity={fin(f, tUnit, 10)}>
          <Bracket p={add(O, [-26, -9])} q={add(bhT, [-26, -9])} c={C.second} w={5} />
          <Lbl x={(O[0] + bhT[0]) / 2 - 60} y={(O[1] + bhT[1]) / 2 + 10} t="1" c={C.second} s={T.key} a="end" />
        </g>
        <Keyword f={f} text="unit vector" at={[330, 700]} appear={tUnit} targets={[add(bhT, [12, 20])]} />
        <g opacity={0.6 * fin(f, t2)}>
          <Dash p={O} q={P(BH[0], 0)} c={C.second} w={4} d="4 8" />
          <Dash p={P(BH[0], 0)} q={bhT} c={C.second} w={4} d="4 8" />
        </g>
        <SmallPairs o={1} />
      </Svg>
      <TeX s={`${BH_L} ${BHP[0]}`} x={1080} y={110} size={T.eq} c={C.second} o={fin(f, tShrink + 40)} />
      <CalcStack f={f} x={1240} y={220} rows={rows} maxLines={3} />
    </Scene>
  );
};

// ================================================================ s08 the question
const RECT_B = (pair.rect_on_b_right as Pt[]).map((p) => P(...p));
const [Q8_L, Q8_R] = splitEq(EQ_Q8), Q8P = eqPieces(Q8_R); // a·b | "= (|a|cosθ)|b|", "= 2.530×3.162", "≈ 8"
const Q8_PARTS: Part[] = [
  { t: "=" },
  { t: String.raw`(|\mathbf a|\cos\theta)`, c: C.first, u: { w: String.raw`\small\text{shadow}`, c: C.first } },
  { t: String.raw`\,|\mathbf b|`, c: C.second, u: { w: String.raw`\substack{\small\text{length}\\ \small\text{of }\mathbf b}`, c: C.second } },
];
if (plainOf(Q8_PARTS) !== rep(Q8P[0], String.raw`\,|`, String.raw` \,|`)) throw new Error("s08 parts ≠ EQ_Q8");
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = K("s08_question");
  const t1 = SS(k, 1), t2 = SS(k, 2);
  void RECT_B; // S10 (review 5): the un-narrated area rectangle is removed; the band (shadow) and |b| carry the picture
  return (
    <Scene>
      <Svg>
        <PairBase />
        <Bracket p={O} q={BTIP} off={-ABRK_OFF} c={C.second} o={fin(f, 22)} />
        <Band p={O} q={FOOT} color={C.first} />
        <Arrow p={O} q={ATIP} color={C.first} />
        <Lbl x={SH_LBL[0]} y={SH_LBL[1]} t={`shadow = ${SHAB.toFixed(3)}`} c={C.first} s={T.key} />
        <SmallPairs o={1} />
        {[0, 1, 2].map((i) => <circle key={i} cx={1410 + i * 60} cy={760} r={13} fill={C.gold} opacity={fin(f, t2 + i * 8, 8)} />)}
      </Svg>
      <CalcStack f={f} x={1230} y={120} rows={[
        { lhs: Q8_L, rhs: { parts: Q8_PARTS, layers: [base(), { u: [1], o: fin(f, 10) }, { u: [2], o: fin(f, 22) }] }, at: 4, h: 240 },
        { rhs: `${Q8P[1]} ${rep(Q8P[2], "8", String.raw`\mathbf{8}`)}`, at: AT(k, 0, "times the length"), cont: true },
      ]} />
      <TeX s={String.raw`\times\,|\mathbf b|\ ?`} x={1470} y={620} size={T.hero} ax={0.5} c={C.second} o={fin(f, t1)} />
    </Scene>
  );
};

// ================================================================ s09 reason 1: order
const U9 = 85;
const PL9 = mkP(360, 560, U9), PR9 = mkP(1250, 560, U9);
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09_reason1_order");
  const t1 = SS(k, 1), t1b = AT(k, 1, "but the shadow of b"), t2 = SS(k, 2), tBoth = AT(k, 2, "both give eight");
  const sL = fin(f, t1, 20), sR = fin(f, t1b, 20), grow = ramp(f, t2 + 10, t2 + 40);
  const Plane: React.FC<{ Pp: (x: number, y: number) => Pt; caster: "a" | "b" }> = ({ Pp, caster }) => {
    const Oo = Pp(0, 0), isA = caster === "a";
    const proj = (isA ? pair.proj_a_on_b : pair.proj_b_on_a) as Pt, onto = isA ? B : A, from = isA ? A : B;
    // S10 (review 5): no area rectangles; "× the other length" is shown by a bracket along the arrow the shadow falls on
    const s = isA ? sL : sR, foot = Pp(...proj), cTip = Pp(...from);
    return (
      <g>
        <Grid P={Pp} xr={isA ? [-3, 5] : [-1, 5]} yr={[0, isA ? 4 : 5]} o={0.7} />
        <Bracket p={Oo} q={Pp(...onto)} off={isA ? -28 : 28} c={isA ? C.second : C.first} o={grow} />
        <Dash p={Pp(-onto[0] * 0.2, -onto[1] * 0.2)} q={Pp(onto[0] * 1.3, onto[1] * 1.3)} c={isA ? C.second : C.first} o={0.4} w={3} />
        <Band p={Oo} q={lerp(Oo, foot, s)} color={isA ? C.first : C.second} o={s > 0 ? 1 : 0} w={20} />
        <Arrow p={Oo} q={Pp(...B)} color={C.second} w={9} head={34} />
        <Arrow p={Oo} q={Pp(...A)} color={C.first} w={9} head={34} />
        {s > 0 ? <Dash p={cTip} q={lerp(cTip, foot, s)} w={4} /> : null}
        <Lbl x={Pp(5.25, 1)[0]} y={Pp(5.25, 1)[1] - 6} t="a" c={C.first} s={T.key} />
        <Lbl x={Pp(1.1, 3.35)[0]} y={Pp(1.1, 3.35)[1]} t="b" c={C.second} s={T.key} />
      </g>
    );
  };
  const [L1a, L1b] = splitEq(EQ_SH_AB), [R1a, R1b] = splitEq(EQ_SH_BA);
  const [TL, TR] = EQ_TRAY.split(String.raw` \approx 8 \approx `);
  return (
    <Scene>
      <Svg>
        <Plane Pp={PL9} caster="a" />
        <Plane Pp={PR9} caster="b" />
      </Svg>
      <TeX s={`${L1a} ${L1b}`} x={470} y={680} size={T.calc} ax={0.5} c={C.first} o={sL} />
      <TeX s={`${R1a} ${R1b}`} x={1400} y={680} size={T.calc} ax={0.5} c={C.second} o={sR} />
      <TeX s={String.raw`${TL} \approx 8`} x={470} y={800} size={T.calc} ax={0.5} o={fin(f, t2 + 30)} />
      <TeX s={String.raw`${TR} \approx 8`} x={1400} y={800} size={T.calc} ax={0.5} o={fin(f, t2 + 40)} />
      <TeX s={EQ_SYM} x={900} y={100} size={T.eq} ax={0.5} o={fin(f, tBoth)} />
    </Scene>
  );
};

// ================================================================ s10 reason 2: cheap; x̂ picks out a part
const PWm = mkP(260, 740, 70);
const [VX_L, VX_R] = splitEq(EQ_VX), VXP = eqPieces(VX_R);
const S10: React.FC = () => {
  // U-M4.1/U-M4.2 (fix loop 3): the wind picture is on the left from the first second; the goal ("how much blows east?")
  // comes before the calculation; the eastward shadow and "6 m/s east" appear only after the result is said.
  const f = useCurrentFrame(), k = K("s10_reason2_cheap");
  const t2 = SS(k, 2), t3 = SS(k, 3), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const tTen = AT(k, 1, "at ten metres"), tComp = AT(k, 2, "components six"), tX = AT(k, 4, "x hat"), tPart = AT(k, 6, "the eastward part");
  const o0 = fin(f, 6) * fout(f, t2 - 12), pic = fin(f, 4, 15), oLegs = fin(f, tComp), oX = fin(f, tX), oSh = fin(f, t6, 18);
  const v = cheap.v as Pt, Ow = PWm(0, 0), vT = PWm(...v), vx = PWm(cheap.v_dot_xhat, 0), mid = lerp(Ow, vT, 0.5);
  return (
    <Scene>
      <Svg>
        <g opacity={pic}>
          <Grid P={PWm} xr={[0, 9]} yr={[0, 9]} o={0.7} />
          <Lbl x={PWm(9, 0)[0]} y={Ow[1] + 52} t="east" c={C.muted} s={T.floor} a="end" />
          <Lbl x={Ow[0] - 20} y={PWm(0, 9)[1]} t="north" c={C.muted} s={T.floor} a="end" rot={-90} />
          <Band p={Ow} q={lerp(Ow, vx, oSh)} color={C.first} o={oSh > 0 ? 1 : 0} w={22} />
          {oSh > 0 ? <><Dash p={vT} q={vx} o={oSh} w={4} /><RightTick at={vx} u1={unit(vx, Ow)} u2={unit(vx, vT)} o={oSh} /></> : null}
          <Dash p={Ow} q={PWm(v[0], 0)} c={C.first} w={5} d="5 10" o={oLegs * (1 - oSh)} />
          <Dash p={PWm(v[0], 0)} q={vT} c={C.first} w={5} d="5 10" o={oLegs} />
          <Lbl x={PWm(3.6, 0)[0]} y={Ow[1] - 44} t={`${cheap.v_dot_xhat} m/s east`} c={C.first} s={T.key} a="middle" o={oSh} />
          <Arrow p={Ow} q={vT} color={C.first} />
          <Lbl x={mid[0] - 34} y={mid[1] - 34} t={`${cheap.norm_v} m/s`} c={C.first} s={T.key} a="end" o={fin(f, tTen) * fout(f, t5)} />
          <Lbl x={vT[0] + 26} y={vT[1] - 20} t="north-east" c={C.key} s={T.key} o={fin(f, AT(k, 1, "north-east")) * fout(f, tComp - 10)} />
          <Lbl x={vT[0] + 26} y={vT[1] - 20} t="v" c={C.first} s={T.calc} o={fin(f, tComp)} />
          <Arrow p={Ow} q={PWm(1, 0)} color={C.second} w={10} head={34} o={oX} />
          <Lbl x={PWm(1, 0)[0] + 10} y={Ow[1] + 56} t="x̂ = (1, 0)" c={C.second} s={T.key} a="middle" o={oX} />
        </g>
        <g opacity={o0}>
          <Lbl x={1580} y={175} t="no angle" c={C.key} s={N7} />
          <Lbl x={1580} y={255} t="no √" c={C.key} s={N7} />
        </g>
        <Keyword f={f} text="how much east?" at={[1080, 340]} s={N7} appear={t3} out={tX - 4} targets={[[PWm(7.6, 0)[0], Ow[1] - 14]]} bend={0.12} />
        <Keyword f={f} text="eastward part" at={[560, 830]} appear={tPart} targets={[add(lerp(Ow, vx, 0.75), [0, 14])]} />
        <Keyword f={f} text="the first component" at={[1150, 310]} appear={t7} targets={[[1252, 246]]} bend={0.1} />
      </Svg>
      <TeX s={String.raw`5\times1 + 1\times3`} x={1080} y={210} size={T.calc} o={o0} />
      <TeX s={String.raw`|\mathbf a|\,|\mathbf b|\cos\theta`} x={1080} y={340} size={T.calc} c={C.muted} o={o0} />
      <TeX s={EQ_V6} x={1080} y={200} size={T.calc} c={C.first} o={fin(f, t2 - 2)} />
      <TeX s={EQ_XHAT} x={1080} y={460} size={T.calc} c={C.second} o={fin(f, tX + 6)} />
      <CalcStack f={f} x={1250} y={560} rows={[
        { lhs: VX_L, rhs: VXP[0], at: t5 },
        { rhs: rep(VXP[1], "= 6", String.raw`= \mathbf{6}`), at: AT(k, 5, "which is six"), cont: true, c: C.first, ul: tPart },
      ]} />
    </Scene>
  );
};

// ================================================================ s11 work
const GY = 560, X0 = 300, FSC = 22, DSC = 70, RH = 10;
const [W_L, W_R] = splitEq(EQ_W), WRP = eqPieces(W_R); // W | "= F·d", "= (|F|cosθ)|d|"
const W_PARTS: Part[] = [
  { t: "=" },
  { t: String.raw`(|\mathbf F|\cos\theta)`, c: C.first, u: { w: String.raw`\small\text{shadow}`, c: C.first } },
  { t: String.raw`\,|\mathbf d|`, c: C.second, u: { w: String.raw`\substack{\small\text{length}\\ \small\text{of }\mathbf d}`, c: C.second } },
];
if (plainOf(W_PARTS) !== rep(WRP[1], String.raw`\,|`, String.raw` \,|`)) throw new Error("s11 parts ≠ EQ_W");
const [WS_L, WS_R] = splitEq(EQ_WSH), WSP = eqPieces(WS_R);
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_work");
  const t1 = SS(k, 1), tForce = AT(k, 1, "a force vector"), tN = AT(k, 1, "twenty newtons"), tD = AT(k, 1, "a displacement vector");
  const t2 = SS(k, 2), tShadow = AT(k, 2, "the part along the ground"), t3 = SS(k, 3), tJ = AT(k, 3, "fifty joules");
  const t4 = SS(k, 4), tStill = AT(k, 4, "the shadow is still"), t5 = SS(k, 5);
  const oF = fin(f, tForce), oLeg = fin(f, t2), dimUp = 1 - 0.6 * fin(f, t2 + 30), oSh = fin(f, tShadow, 18), oW = fin(f, t3 + 20);
  const nd = work.d_m.length - 1;
  const kd = Math.round(clamp((f - AT(k, 4, "doubles to ten")) / 45, 0, 1) * nd);
  const dm = work.d_m[kd];
  const Fv = work.F as Pt;
  const Ft: Pt = [X0 + Fv[0] * FSC, GY - Fv[1] * FSC], sh: Pt = [X0 + work.shadow_N * FSC, GY];
  const dT: Pt = [X0 + dm * DSC, GY];
  void RH; void oW; // S10: no area rectangle under d
  const dl = dm.toFixed(dm % 1 ? 1 : 0);
  // S11 (review 5): the sled slides along d (a faint copy marks where it ends up), first 5 m, then 10 m
  const slide = clamp((f - tD - 6) / 40, 0, 1) * dm * DSC;
  const rows: CalcRow[] = [
    { lhs: WS_L, rhs: WSP[0], at: tShadow + 10, c: C.first },
    { rhs: WSP[1], at: tShadow + 30, cont: true, c: C.first },
    { lhs: splitEq(EQ_W5)[0], rhs: splitEq(EQ_W5)[1], at: tJ },
    { lhs: splitEq(EQ_W10)[0], rhs: splitEq(EQ_W10)[1], at: AT(k, 4, "one hundred joules"), size: 62 },
    { lhs: W_L, rhs: { parts: W_PARTS, layers: [base(), { u: [1], o: fin(f, t5 + 20) }, { u: [2], o: fin(f, AT(k, 5, "length of d")) }] }, at: t5 + 6, h: 190 },
  ];
  return (
    <Scene>
      <Svg>
        <line x1={90} y1={GY} x2={1000} y2={GY} stroke="#6b7690" strokeWidth={5} />
        <Sled x={175} y={GY} o={fin(f, 4)} />
        {slide > 0 ? <Sled x={175 + slide} y={GY - 12} o={0.45} /> : null}
        <Arrow p={[X0, GY]} q={dT} color={C.second} o={fin(f, tD)} />
        {/* N6 (review 5b): the label starts right of the dashed 17.3 N line (x = shadow tip), or ends at the tip of d */}
        <Lbl x={Math.max(dT[0] - textW(`d = ${dl} m`, T.key), sh[0] + 30)} y={GY - 116} t={`d = ${dl} m`} c={C.second} s={T.key} a="start" o={fin(f, tD)} />
        <Arrow p={[X0, GY]} q={Ft} color={C.first} o={oF * (1 - 0.5 * oSh)} />
        <Lbl x={Ft[0] + 20} y={Ft[1] - 30} t={`F = ${work.F_N.toFixed(0)} N`} c={C.first} s={T.key} o={fin(f, tN)} />
        <g opacity={oF * (1 - oLeg)}>
          <Arc P={mkP(X0, GY, 1)} a0={0} a1={work.F_deg} r={80} w={4} />
          <Lbl x={X0 + 60} y={GY - 30} t="60°" s={T.floor} c={C.ink} />
        </g>
        <g opacity={oLeg * dimUp}>
          <Dash p={sh} q={Ft} c={C.first} w={5} d="8 9" />
          <Lbl x={Ft[0] + 20} y={(Ft[1] + GY) / 2 - 20} t={`${Fv[1].toFixed(1)} N`} c={C.first} s={T.key} />
        </g>
        <g opacity={fin(f, t2 + 30) * (1 - fin(f, t3))}>
          <Lbl x={Ft[0] + 230} y={(Ft[1] + GY) / 2 - 20} t="W" c={C.ink} s={T.key} a="middle" />
          <line x1={Ft[0] + 202} y1={(Ft[1] + GY) / 2 + 8} x2={Ft[0] + 258} y2={(Ft[1] + GY) / 2 - 48} stroke={C.neg} strokeWidth={6} strokeLinecap="round" />
        </g>
        <Band p={[X0, GY]} q={lerp([X0, GY], sh, oSh)} color={C.first} o={oSh > 0 ? 1 : 0} w={22} />
        <Keyword f={f} text={`shadow ${work.shadow_N.toFixed(0)} N`} at={[120, 700]} appear={tShadow + 6} targets={[[X0 + 80, GY + 14]]} c={C.first} s={T.key + 10 * pulse(f, tStill, 20)} />
        <Keyword f={f} text="force" at={[120, 230]} appear={tForce} targets={[lerp([X0, GY], Ft, 0.6)]} out={t2} />
        <Keyword f={f} text="displacement" at={[560, 800]} appear={tD} targets={[[X0 + 170, GY + 6]]} out={t3} />
        <Lbl x={120} y={150} t="N = newton" c={C.muted} s={N7} o={fin(f, tN) * fout(f, t2 + 20)} />
        <Lbl x={120} y={800} t="J = joule" c={C.muted} s={N7} o={fin(f, tJ) * fout(f, t4)} />
        <Lbl x={640} y={790} t="× 2 → × 2" c={C.key} s={T.key} o={fin(f, AT(k, 4, "the work doubles")) * fout(f, t5)} />
      </Svg>
      <TeX s={`${W_L} ${WRP[0]}`} x={1080} y={110} size={T.eq} o={fin(f, tD)} />
      <CalcStack f={f} x={1180} y={210} rows={rows} maxLines={3} />
    </Scene>
  );
};

// ================================================================ weather maps (s12–s20)
type Geo = { mx: number; my: number; km: number; w: number; h: number };
const GM: Geo = { mx: 120, my: 140, km: 1.47, w: 600, h: 360 };
const gX = (g: Geo, xk: number) => g.mx + xk * g.km;
const gY = (g: Geo, yk: number) => g.my + (g.h - yk) * g.km;
const gP = (g: Geo, p: Pt): Pt => [gX(g, p[0]), gY(g, p[1])];
const LUT = W.lut_thermal as string[];
const [T_LO, T_HI] = W.lut_range_C as [number, number];
const tColor = (Tc: number) => LUT[Math.round(clamp((Tc - T_LO) / (T_HI - T_LO), 0, 1) * (LUT.length - 1))];
const PROF_X = W.prof_x_km as number[], PROF_T = W.prof_T_C as number[], PROF_T2 = W.prof_T_steep_C as number[];
/** temperature of the map at x km after the pattern has slid `shift` km (data profile, interpolated) */
const T_AT = (xk: number, shift = 0, steep = false) => interp(xk - shift, PROF_X, steep ? PROF_T2 : PROF_T);
const PIN = W.pin_km as Pt, PINS = gP(GM, PIN);
const VANG = (W.angle_deg * Math.PI) / 180;
const US = 26; // px per (m/s) for the wind arrow (its own scale)
const GL = 200; // ∇T arrow px for 1e-5 K/m (its own scale)
const VTIP: Pt = [PINS[0] + W.speed * US * Math.cos(VANG), PINS[1] - W.speed * US * Math.sin(VANG)];
const SHT: Pt = [PINS[0] + W.shadow_m_s * US, PINS[1]];
const ISO_T = W.iso_T_C as number[], ISO_X = W.iso_x_km as number[][];
const ISS_T = W.isotherms_steep_T_C as number[], ISS_X = W.isotherms_steep_x_km as number[][];

const TMap: React.FC<{ shift?: number; steep?: boolean; o?: number }> = ({ shift = 0, steep = false, o = 1 }) => {
  const strips = [], n = 120, dx = GM.w / n;
  for (let i = 0; i < n; i++) {
    const xk = (i + 0.5) * dx;
    strips.push(<rect key={i} x={gX(GM, i * dx)} y={GM.my} width={dx * GM.km + 0.7} height={GM.h * GM.km} fill={tColor(T_AT(xk, shift, steep))} />);
  }
  return <g opacity={o}>{strips}</g>;
};
/** isotherm lines at given x (km) with labels above the map; `io` opacity per line; labels hidden near the edges */
const Isos: React.FC<{ xs: number[]; Ts: number[]; io?: (i: number) => number; s?: number; every?: number; dash?: boolean }> = ({ xs, Ts, io, s = T.floor, every = 1, dash }) => (
  <g>
    {xs.map((xk, i) => {
      const o = io ? io(i) : 1;
      if (o <= 0 || xk < 1 || xk > GM.w - 1) return null;
      const px = gX(GM, xk);
      const showL = i % every === 0 && xk > 25 && xk < GM.w - 35;
      return (
        <g key={i} opacity={o}>
          <line x1={px} y1={GM.my} x2={px} y2={GM.my + GM.h * GM.km} stroke="#ffffff" strokeOpacity={0.75} strokeWidth={3} strokeDasharray={dash ? "10 8" : undefined} />
          {showL ? <Lbl x={px} y={GM.my - 34} t={`${Ts[i]} °C`} c={C.ink} s={s} a="middle" /> : null}
        </g>
      );
    })}
  </g>
);
const MapFrame: React.FC<{ o?: number; ticks?: boolean }> = ({ o = 1, ticks = true }) => (
  <g opacity={o}>
    <rect x={GM.mx} y={GM.my} width={GM.w * GM.km} height={GM.h * GM.km} fill="none" stroke={C.grid} strokeWidth={3} />
    {ticks ? [0, 100, 200, 300, 400, 500, 600].map((x) => <Lbl key={x} x={gX(GM, x)} y={GM.my + GM.h * GM.km + 34} t={`${x}`} c={C.muted} s={T.floor} a="middle" b={false} />) : null}
    {/* S3 (review 5): the axis unit, after the last tick of each axis */}
    {ticks ? <Lbl x={gX(GM, 600) + 50} y={GM.my + GM.h * GM.km + 34} t="km" c={C.muted} s={T.floor} a="start" b={false} /> : null}
    {ticks ? [0, 180, 360].map((y) => <Lbl key={y} x={GM.mx - 12} y={gY(GM, y)} t={`${y}`} c={C.muted} s={T.floor} a="end" b={false} />) : null}
    {ticks ? <Lbl x={GM.mx - 12} y={GM.my - 46} t="km" c={C.muted} s={T.floor} a="end" b={false} /> : null}
  </g>
);
const ColourBar: React.FC<{ o?: number }> = ({ o = 1 }) => {
  const y0 = 190, y1 = GM.my + GM.h * GM.km, x = 1010;
  return (
    <g opacity={o}>
      {LUT.map((c, i) => <rect key={i} x={x} y={y1 - ((i + 1) * (y1 - y0)) / LUT.length} width={20} height={(y1 - y0) / LUT.length + 0.7} fill={c} />)}
      <Lbl x={1040} y={y0 + 8} t={`${T_HI}`} c={C.muted} s={T.floor} b={false} />
      <Lbl x={1040} y={y1 - 26} t={`${T_LO}`} c={C.muted} s={T.floor} b={false} />
      <Lbl x={1070} y={(y0 + y1) / 2} t="T (°C)" c={C.muted} s={T.floor} a="middle" rot={-90} b={false} />
    </g>
  );
};
const ClipMap: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <>
    <defs><clipPath id={id}><rect x={GM.mx} y={GM.my} width={GM.w * GM.km} height={GM.h * GM.km} /></clipPath></defs>
    <g clipPath={`url(#${id})`}>{children}</g>
  </>
);
/** a small copy of the weather map (s01 thumbnail) */
const MiniMap: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => {
  const n = 40;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => <rect key={i} x={x + (i * w) / n} y={y} width={w / n + 0.6} height={h} fill={tColor(T_AT(((i + 0.5) * GM.w) / n))} />)}
      {[100, 200, 300, 400, 500].map((xk) => <line key={xk} x1={x + (xk / GM.w) * w} y1={y} x2={x + (xk / GM.w) * w} y2={y + h} stroke="#fff" strokeOpacity={0.6} strokeWidth={2} />)}
    </g>
  );
};
const MAPX = 1110; // left edge of the maths zone in map scenes (the colour bar labels end near x 1095)
/** "∇T" next to the gradient arrow, set by KaTeX (an SVG ∇ glyph falls back to an outline font) */
const GradLabel: React.FC<{ x: number; y: number; o?: number; s?: number }> = ({ x, y, o = 1, s = T.key }) =>
  <TeX s={String.raw`\nabla T`} x={x} y={y} size={s} c={C.second} o={o} halo haloW={0.035} />; // S8: thin outline, clean fill
const balloonAtH = (h: number): Pt => [atH(W.balloon_x_km as number[], h), atH(W.balloon_y_km as number[], h)];
/** S4/S6 (review 5): where the pole is drawn too, the balloon starts BAL_DY km south of the pole on the same 13 °C
 * isotherm (the map is uniform north–south, so every temperature it reads equals the one on the data track) */
const BAL_DY = -150;
const balloonOffAtH = (h: number): Pt => { const b = balloonAtH(h); return [b[0], b[1] + BAL_DY]; };
/** N4 (review 5b): s18 only, 28 km south of the data track (clear of the 13.1 parcel tag above it) */
const BAL18_DY = -28;
const balloon18AtH = (h: number): Pt => { const b = balloonAtH(h); return [b[0], b[1] + BAL18_DY]; };
const ClockText: React.FC<{ x: number; y: number; h: number; o?: number }> = ({ x, y, h, o = 1 }) => (
  <g opacity={o}>
    <ClockGlyph x={x + 30} y={y} r={28} h={(h * 12) % 12} />
    <Lbl x={x + 74} y={y} t={`t = ${h.toFixed(1)} h`} c={C.ink} s={T.key} />
  </g>
);

// ================================================================ s12 two thermometers
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12_parcel");
  // fix loop 4 (U-M5.1): new sentence 3 = "Here capital T stands for temperature, and small t for time."; later ones shift by one
  const t1 = SS(k, 1), t2 = SS(k, 2), tLR = AT(k, 2, "the local rate"), tCT = AT(k, 3, "capital T stands"), tST = AT(k, 3, "small t for time");
  const t3 = SS(k, 4), tPl = AT(k, 4, "the place stays"), t4 = SS(k, 5), tPar = AT(k, 5, "inside one air parcel"), t5 = SS(k, 6);
  // T / t keywords sit beside the fraction in the slot "time changes / place fixed" will use, then move down to the
  // empty band under "following the parcel" (y 770 / 835) as sentence 4 starts, so they stay readable for DT/Dt too
  const dn = ramp(f, t3 - 6, t3 + 14), yT = 300 + 470 * dn, yt = 370 + 465 * dn;
  // S4 (review 5): the balloon starts on the same 13 °C isotherm as the pole but BAL_DY km south of it (the map does not
  // vary north–south), so the parcel outline never encloses the pole; no clock here (the clock is introduced in s18)
  const h = hoursFrom(f, t4 + 20, 1.5);
  const s12 = (hh: number): Pt => { const b = balloonOffAtH(hh); return [b[0] + 30, b[1]]; }; // s12 only: also 30 km east (no readings shown in s12)
  const bal = gP(GM, s12(h)), bal0 = gP(GM, s12(0));
  const vs: Pt = [Math.cos(VANG) * 110, -Math.sin(VANG) * 110];
  const oBal = fin(f, t4);
  return (
    <Scene>
      <Svg>
        <TMap o={fin(f, 0, 14)} />
        <MapFrame o={fin(f, 0, 14)} />
        <ColourBar o={fin(f, 0, 14)} />
        <Lbl x={GM.mx} y={790} t="idealised map" c={C.muted} s={N7} o={fin(f, 10) * fout(f, t2)} b={false} />
        <g opacity={fin(f, t1)}>
          <PoleThermometer x={PINS[0]} y={PINS[1]} s={1.4} />
        </g>
        <Lbl x={PINS[0] - 34} y={PINS[1] - 60} t="fixed place" c={C.key} s={T.key} a="end" o={fin(f, t1 + 20)} />
        <line x1={bal0[0]} y1={bal0[1]} x2={bal[0]} y2={bal[1]} stroke={C.first} strokeWidth={4} strokeDasharray="8 8" opacity={oBal} />
        <Arrow p={bal} q={add(bal, vs)} color={C.first} w={8} head={30} o={oBal} />
        {fin(f, tPar) > 0 ? <ellipse cx={bal[0]} cy={bal[1] - 62} rx={56} ry={100} fill="#ffffff" fillOpacity={0.07} stroke="#ffffff" strokeWidth={4} strokeDasharray="10 8" opacity={fin(f, tPar)} /> : null}
        <BalloonThermometer x={bal[0]} y={bal[1]} s={0.7} o={oBal} />
        {/* M5: the keyword sits inside the map, so its pointer never crosses the tick labels */}
        <Keyword f={f} text="air parcel" at={[bal0[0] + 110, bal0[1] - 10]} appear={tPar + 6} targets={[[bal[0] + 64, bal[1] - 40]]} />
        {/* maths zone */}
        <g opacity={fin(f, t2)}><PoleThermometer x={1370} y={250} s={0.9} /></g>
        <Lbl x={1420} y={150} t="local rate" c={C.local} s={T.key} o={fin(f, tLR)} />
        <Lbl x={1150} y={yT} t="T = temperature" c={C.local} s={T.key} o={fin(f, tCT)} />
        <Lbl x={1150} y={yt} t="t = time" c={C.local} s={T.key} o={fin(f, tST)} />
        <Lbl x={1150} y={300} t="time changes" c={C.key} s={T.key} o={fin(f, t3 + 4)} />
        <Lbl x={1150} y={370} t="place fixed" c={C.key} s={T.key} o={fin(f, tPl)} />
        <g opacity={fin(f, t5)}><BalloonThermometer x={1370} y={590} s={0.7} /></g>
        <Lbl x={MAPX + 40} y={655} t="following the parcel" c={C.first} s={T.key} o={fin(f, t5 + 20)} />
      </Svg>
      <TeX s={EQ_DTDT_LOCAL} x={MAPX + 40} y={190} size={T.eq} c={C.local} o={fin(f, AT(k, 2, "written partial"))} />
      <TeX s={EQ_DTDT_MAT} x={MAPX + 40} y={540} size={T.eq} c={C.first} o={fin(f, AT(k, 6, "written capital"))} />
    </Scene>
  );
};

// ================================================================ s13 the material-derivative equation (no map: U-M3.15)
type MDc = Partial<Record<"L" | "phiL" | "eq" | "R1" | "phiR1" | "plus" | "v" | "dot" | "nab" | "phiR2" | "bL" | "bR1" | "bR2", string>>;
const MD = (c: MDc) => {
  const t = (k: keyof MDc) => c[k] ?? "transparent";
  return String.raw`\textcolor{${t("bL")}}{\underbrace{\textcolor{${t("L")}}{\frac{\mathrm{D}\textcolor{${t("phiL")}}{\varphi}}{\mathrm{D}t}}}_{\substack{\text{following}\\ \text{the parcel}}}}` +
    String.raw` \textcolor{${t("eq")}}{=} ` +
    String.raw`\textcolor{${t("bR1")}}{\underbrace{\textcolor{${t("R1")}}{\frac{\partial\textcolor{${t("phiR1")}}{\varphi}}{\partial t}}}_{\substack{\text{one fixed}\\ \text{place}}}}` +
    String.raw` \textcolor{${t("plus")}}{+} ` +
    String.raw`\textcolor{${t("bR2")}}{\underbrace{\textcolor{${t("v")}}{\mathbf v}\textcolor{${t("dot")}}{\cdot}\textcolor{${t("nab")}}{\nabla}\textcolor{${t("phiR2")}}{\varphi}}_{\text{advection}}}`;
};
// pointer targets measured offline (KaTeX \htmlId boxes at 96 px; root 1073 × 398): centred at x 960, top y MDY
const MDY = 120, MDX0 = 960 - 1073 / 2;
const MD_POS = { L: [MDX0 + 63 + 80, MDY + 100] as Pt, R1: [MDX0 + 472 + 71, MDY + 100] as Pt, v: [MDX0 + 796 + 40, MDY + 60] as Pt,
  nab: [MDX0 + 925 + 40, MDY + 60] as Pt, bR2: [MDX0 + 791 + 141, MDY + 296] as Pt };
const TF_W = 537, TFY = 772, TF_DOT: Pt = [960 - TF_W / 2 + 397 + 17, TFY];
type TFk = "L" | "eq" | "R1" | "plus" | "v" | "dot" | "nab";
const TFc = (c: Partial<Record<TFk, string>>) => {
  const t = (k: TFk) => c[k] ?? "transparent";
  return String.raw`\textcolor{${t("L")}}{\frac{\mathrm{D}T}{\mathrm{D}t}} \textcolor{${t("eq")}}{=} \textcolor{${t("R1")}}{\frac{\partial T}{\partial t}} \textcolor{${t("plus")}}{+} \textcolor{${t("v")}}{\mathbf v}\textcolor{${t("dot")}}{\cdot}\textcolor{${t("nab")}}{\nabla T}`;
};
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = K("s13_equation");
  // v6 (U-M6.5): sentence 5 = "So the advection term is the change that comes from being carried into warmer or colder air…";
  // the material-derivative sentences are now 6, 7 and the temperature sentence 8
  const t1 = SS(k, 1), tPhi = AT(k, 1, "called phi"), t2 = SS(k, 2), t3 = SS(k, 3), tWind = AT(k, 3, "v, the wind"), tGrad = AT(k, 3, "and grad"), t4 = SS(k, 4);
  const tWarm = AT(k, 5, "warmer or colder"), tMoist = AT(k, 5, "moister or drier"), tDep = AT(k, 5, "depending on what phi");
  const t5 = SS(k, 6), t6 = SS(k, 7), t7 = SS(k, 8), tDot = AT(k, 8, "its dot");
  const oEq = fin(f, 6, 14);
  const ink = C.ink;
  const baseC: MDc = { L: C.first, eq: ink, R1: C.local, plus: ink, v: C.first, dot: C.first, nab: C.first, phiL: C.first, phiR1: C.local, phiR2: C.first };
  const phiGlow = Math.max(fin(f, tPhi, 8) * fout(f, t2 + 10, 12), pulse(f, tDep, 30));
  const layers: { s: string; o: number; glow?: number }[] = [
    { s: MD(baseC), o: 1 },
    { s: MD({ phiL: C.gold, phiR1: C.gold, phiR2: C.gold }), o: phiGlow, glow: phiGlow },
    { s: MD({ bL: C.first }), o: fin(f, t2) },
    { s: MD({ bR1: C.local }), o: fin(f, t3) },
    { s: MD({ v: C.gold }), o: fin(f, tWind, 8) * fout(f, t4), glow: fin(f, tWind, 8) * fout(f, t4) },
    { s: MD({ nab: C.gold }), o: fin(f, tGrad, 8) * fout(f, t4), glow: fin(f, tGrad, 8) * fout(f, t4) },
    { s: MD({ bR2: C.first }), o: fin(f, t4 + 4) },
  ];
  // the plain equation must be the storyboard string: strip the colour/brace wrappers of the base layer
  // U-M6.4: no icon at the top centre and none on, over or touching ∂φ/∂t. The balloon sits above Dφ/Dt from sentence 3;
  // the pole icon sits left of the 'one fixed place' label below the equation from sentence 4.
  const dotGlow = pulse(f, tDot, 30);
  const phiLine = fin(f, t1 + 6) * fout(f, t5) * (1 + 0.25 * pulse(f, tDep, 30));
  return (
    <Scene>
      <Svg>
        <BalloonThermometer x={MD_POS.L[0]} y={104} s={0.45} o={fin(f, t2)} />
        <g opacity={fin(f, t3)}><PoleThermometer x={MD_POS.R1[0] - 175} y={452} s={0.5} /></g>
        <g opacity={Math.min(1, phiLine)}>
          <Lbl x={330} y={580} t="φ: T, moisture" c={C.gold} s={T.key + 8 * pulse(f, tDep, 30)} />
          <PoleThermometer x={760} y={620} s={0.5} />
          <Droplet x={830} y={592} s={0.9} />
        </g>
        {/* U-M6.5: the two keyword pairs under 'carried by the flow', on their words */}
        <g opacity={fin(f, tWarm, 10) * fout(f, t5)}>
          <PoleThermometer x={MD_POS.bR2[0] - 225} y={672} s={0.45} />
          <Lbl x={MD_POS.bR2[0]} y={650} t="warmer · colder" c={C.key} s={T.key} a="middle" />
        </g>
        <g opacity={fin(f, tMoist, 10) * fout(f, t5)}>
          <Droplet x={MD_POS.bR2[0] - 225} y={735} s={0.8} />
          <Lbl x={MD_POS.bR2[0]} y={735} t="moister · drier" c={C.key} s={T.key} a="middle" />
        </g>
        <Keyword f={f} text="wind" at={[MD_POS.v[0] - 150, 82]} appear={tWind} out={t5} targets={[[MD_POS.v[0], MD_POS.v[1] - 8]]} />
        <Keyword f={f} text="grad" at={[MD_POS.nab[0] + 70, 82]} appear={tGrad} out={t5} targets={[[MD_POS.nab[0], MD_POS.nab[1] - 8]]} />
        <Keyword f={f} text="carried by the flow" at={[MD_POS.bR2[0], 560]} a="middle" appear={AT(k, 4, "being carried")} out={t5} targets={[[MD_POS.bR2[0], MD_POS.bR2[1] + 40]]} />
        <Keyword f={f} text="material" at={[100, 240]} appear={t5} targets={[[MD_POS.L[0] - 82, MD_POS.L[1] - 4]]} />
        <Lbl x={100} y={302} t="derivative" c={C.key} s={T.key} o={fin(f, t5 + 4, 8)} />
        <Keyword f={f} text="dot product" at={[1300, 846]} appear={tDot} targets={[[TF_DOT[0] + 4, TFY + 30]]} c={C.gold} bend={-0.25} />
      </Svg>
      <div style={{ position: "absolute", left: 960, top: MDY, transform: "translate(-50%, 0)", opacity: oEq }}>
        {layers.map((L, i) => L.o > 0 ? (
          <div key={i} style={{ position: i === 0 ? "relative" : "absolute", left: 0, top: 0, fontSize: 96 / 1.21, opacity: L.o, whiteSpace: "nowrap", lineHeight: 1.2,
            filter: L.glow ? `drop-shadow(0 0 ${14 * L.glow}px rgba(216,178,58,${L.glow}))` : undefined }}
            dangerouslySetInnerHTML={{ __html: texHtml(L.s) }} />
        ) : null)}
      </div>
      <TeX s={String.raw`\frac{\mathrm{D}}{\mathrm{D}t} = \frac{\partial}{\partial t} + \text{advection}`} x={960} y={600} size={T.calc} ax={0.5} o={fin(f, AT(k, 7, "it's the partial"))} />
      <TeX s={TFc({ L: C.first, eq: C.ink, R1: C.local, plus: C.ink, v: C.first, dot: C.first, nab: C.first })} x={960} y={TFY} size={T.calc} ax={0.5} o={fin(f, t7)} />
      <TeX s={TFc({ dot: C.gold })} x={960} y={TFY} size={T.calc} ax={0.5} o={dotGlow} glow={dotGlow} />
    </Scene>
  );
};

// ================================================================ s14 isotherms
const [DX14, DY14] = EQ_DXDY.split(String.raw`,\qquad `);
const ISO14_T = W.isotherm_T_C as number[], ISO14_X = W.isotherms_km as number[];
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14_isotherms");
  const tN = AT(k, 0, "doesn't change"), t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), tPX = AT(k, 3, "that's partial"), t4 = SS(k, 4), tPY = AT(k, 4, "so partial");
  // walker 1 (sentence 1): east along y = 180 km from 0 to 600 km; then north from x = 300 km
  const e1 = clamp((f - 10) / (tN - 30), 0, 1), xk1 = 600 * e1;
  const n1 = clamp((f - tN) / 60, 0, 1);
  const w1: Pt = n1 > 0 ? gP(GM, [300, 180 + 150 * n1]) : gP(GM, [xk1, 180]);
  const oW1 = fin(f, 6) * fout(f, t1 + 10);
  const isoO = (i: number) => fin(f, t1 + 12 + i * 10, 10);
  // walker 2 (sentence 4): east from the pin across 13 → 14 → 15 °C; (sentence 5) north along the 13 °C isotherm
  const e2 = clamp((f - t3 - 6) / 110, 0, 1), xk2 = 300 + 200 * e2;
  const n2 = clamp((f - t4 - 6) / 90, 0, 1);
  const w2: Pt = f >= t4 ? gP(GM, [300, 180 + 140 * n2]) : gP(GM, [xk2, 180]);
  const T2 = f >= t4 ? T_AT(300) : T_AT(xk2);
  const oW2 = fin(f, t3);
  return (
    <Scene>
      <Svg>
        <TMap />
        <Isos xs={ISO14_X} Ts={ISO14_T} io={isoO} />
        <MapFrame />
        <ColourBar />
        <g opacity={oW1}>
          {[100, 200, 300, 400, 500].map((x, i) => (
            <Lbl key={x} x={gX(GM, x)} y={PINS[1] - 70 - (i % 2) * 56} t="+1 °C" c={C.ink} s={T.key} a="middle" o={xk1 >= x ? fin(f, 10 + ((tN - 30) * x) / 600, 6) : 0} />
          ))}
          <circle cx={w1[0]} cy={w1[1]} r={16} fill={tColor(T_AT(n1 > 0 ? 300 : xk1))} stroke={C.ink} strokeWidth={4} />
        </g>
        <Keyword f={f} text="no change" at={[PINS[0] + 40, gY(GM, 340)]} appear={tN + 20} out={t1 + 10} targets={[]} />
        <g opacity={fin(f, t1 + 30) * fout(f, t3)}>
          <Bracket p={[gX(GM, 400), 620]} q={[gX(GM, 500), 620]} c={C.ink} />
          <Lbl x={gX(GM, 450)} y={580} t="100 km" c={C.ink} s={T.floor} a="middle" />
        </g>
        <Keyword f={f} text="isotherm" at={[700, 790]} appear={t2} targets={[[gX(GM, 300) + 4, 560]]} out={t3 + 10} />
        <g opacity={oW2}>
          {f < t4 ? [400, 500].map((x, i) => <Lbl key={x} x={gX(GM, x)} y={PINS[1] - 70 - 56 * i} t="+1 °C" c={C.ink} s={T.key} a="middle" o={xk2 >= x ? 1 : 0} />) : null}
          <circle cx={w2[0]} cy={w2[1]} r={16} fill={tColor(T2)} stroke={C.ink} strokeWidth={4} />
          {/* S3 (review 5c): the tag sits left of the dot, clear of the colour bar */}
          <Lbl x={w2[0] - 26} y={w2[1] + 40} t={`${T2.toFixed(0)} °C`} c={C.ink} s={T.key} a="end" />
        </g>
        <Lbl x={MAPX + 20} y={330} t="east only" c={C.key} s={T.key} o={fin(f, AT(k, 3, "east only"))} />
      </Svg>
      <TeX s={DX14} x={MAPX + 20} y={220} size={T.calc} c={C.second} o={fin(f, tPX)} />
      <TeX s={DY14} x={MAPX + 20} y={500} size={T.calc} c={C.second} o={fin(f, tPY)} />
    </Scene>
  );
};

// ================================================================ s15 ∇T
const [UN_L, UN_R] = splitEq(EQ_UNIT), [GN_L, GN_R] = splitEq(EQ_GRADN);
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_grad_t");
  const tG = AT(k, 0, "the temperature gradient"), tRead = AT(k, 0, "read grad"), t1 = SS(k, 1), tVal = AT(k, 1, "so grad T is"), t2 = SS(k, 2), tWarm = AT(k, 2, "towards warmer");
  const oG = fin(f, tG, 18);
  return (
    <Scene>
      <Svg>
        <TMap />
        <Isos xs={ISO14_X} Ts={ISO14_T} />
        <MapFrame />
        <ColourBar />
        <Arrow p={PINS} q={[PINS[0] + GL * oG, PINS[1]]} color={C.second} o={oG > 0 ? 1 : 0} />
        <circle cx={PINS[0]} cy={PINS[1]} r={9} fill={C.ink} stroke={C.bg} strokeWidth={3} />
        <RightTick at={PINS} u1={[1, 0]} u2={[0, -1]} s={30} o={fin(f, t2 + 20)} />
        <Keyword f={f} text="towards warmer" at={[PINS[0] - 20, PINS[1] + 150]} appear={tWarm} targets={[[PINS[0] + GL - 30, PINS[1] + 28]]} />
        <Keyword f={f} text="grad" at={[MAPX + 20, 300]} appear={tRead} targets={[[MAPX + 55, 190]]} out={t1 + 20} />
        <Lbl x={1840} y={300} t="1 K step = 1 °C step" c={C.key} s={T.key} a="end" o={fin(f, t1)} />
      </Svg>
      <GradLabel x={PINS[0] + GL + 22} y={PINS[1]} o={oG} />
      <TeX s={EQ_GRAD} x={MAPX + 20} y={140} size={T.eq} o={fin(f, 4)} />
      <TeX s={`${GN_L} ${GN_R}`} x={MAPX + 15} y={600} size={56} c={C.second} o={fin(f, tVal)} />
      <CalcStack f={f} x={MAPX + 245} y={370} rows={[
        { lhs: UN_L, rhs: UN_R, at: t1 + 10, h: 170 },
      ]} />
    </Scene>
  );
};

// ================================================================ s16a the wind's two parts
const ALONG_T: Pt = [PINS[0], PINS[1] - (W.v_along_isotherm_m_s as number[])[1] * US];
const ACR_Y = PINS[1] + 36; // the across part, drawn 36 px below ∇T (same length: 5 m/s × US px)
const ALG_X = PINS[0] - 52; // the along part, drawn 52 px west of the 13 °C isotherm (N9: room for the balloon at the pin)
const WindLayer: React.FC<{ oV: number; oSh: number; oAl: number; f: number; tDot?: number }> = ({ oV, oSh, oAl, f, tDot }) => {
  // S4 (review 5c): the slide ends 30 px higher, so the "13 °C" tag clears the map's bottom border
  const dotY = tDot !== undefined ? clamp((f - tDot) / 60, 0, 1) * 0.8 : 0; // a dot sliding along the 13 °C isotherm
  return (
    <g>
      {/* S14 (review 5): each wind part is its own arrow, offset from ∇T and from the 13 °C isotherm */}
      {oSh > 0 ? <g opacity={oSh}>
        <Dash p={VTIP} q={[SHT[0], ACR_Y]} w={4} />
        <Arrow p={[PINS[0], ACR_Y]} q={[PINS[0] + (SHT[0] - PINS[0]) * oSh, ACR_Y]} color={C.first} w={8} head={30} />
      </g> : null}
      <Arrow p={PINS} q={[PINS[0] + GL, PINS[1]]} color={C.second} />
      {oAl > 0 ? <Arrow p={[ALG_X, PINS[1]]} q={[ALG_X, ALONG_T[1]]} color="#dfe5f0" w={7} head={28} o={oAl} /> : null}
      <Arrow p={PINS} q={VTIP} color={C.first} o={oV} />
      {tDot !== undefined && f >= tDot ? <g>
        <circle cx={PINS[0]} cy={PINS[1] + 90 + 150 * dotY} r={12} fill={tColor(13)} stroke={C.ink} strokeWidth={4} />
        <Lbl x={PINS[0] + 24} y={PINS[1] + 90 + 150 * dotY} t="13 °C" c={C.ink} s={T.key} a="start" />
      </g> : null}
    </g>
  );
};
// v6 (U-M6.6/U-M6.7): no along-isotherm part anywhere; the shadow is labelled on the picture and a CurvedLink joins the
// label to the '5.00 m/s' of the calculation. The "=" of 10 × cos 60° = 5.00 m/s sits at x 1440 (two TeX halves).
const [C60_L, C60_R] = splitEq(EQ_COS60);
const SHADOW_LBL: Pt = [(PINS[0] + SHT[0]) / 2, ACR_Y + 46];
const LINK16_FROM: Pt = [SHADOW_LBL[0] + 108, SHADOW_LBL[1] - 10];
const LINK16A_TO: Pt = [1550, 240];
const ShadowLabel: React.FC<{ o?: number; g?: number }> = ({ o = 1, g = 0 }) =>
  <Lbl x={SHADOW_LBL[0]} y={SHADOW_LBL[1]} t="shadow" c={C.key} s={T.key + 10 * g} a="middle" o={o} />;
const S16A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16a_wind_parts");
  const t1 = SS(k, 1), tAcross = AT(k, 1, "straight across"), tFive = AT(k, 1, "is five metres"), t2 = SS(k, 2);
  const tIso = AT(k, 2, "across the isotherms"), tWarm = AT(k, 2, "towards the warmer");
  const oV = fin(f, 8, 16), oSh = fin(f, t1, 18);
  const pl = pulse(f, t2, 24), isoB = pulse(f, tIso, 30);
  return (
    <Scene>
      <Svg>
        <TMap />
        <Isos xs={ISO14_X} Ts={ISO14_T} />
        {isoB > 0 ? <g opacity={isoB}>{ISO14_X.map((xk, i) => <line key={i} x1={gX(GM, xk)} y1={GM.my} x2={gX(GM, xk)} y2={GM.my + GM.h * GM.km} stroke="#fff" strokeWidth={6} />)}</g> : null}
        <MapFrame />
        <ColourBar />
        {/* N9 (review 5b): the balloon rides at the pin, on the 13 °C isotherm, where the wind arrow starts */}
        <BalloonThermometer x={PINS[0]} y={PINS[1]} s={0.6} o={0.9} />
        <WindLayer oV={oV} oSh={oSh} oAl={0} f={f} />
        {oSh >= 1 ? <RightTick at={[SHT[0], ACR_Y]} u1={[-1, 0]} u2={unit([SHT[0], ACR_Y], VTIP)} s={22} o={oSh} /> : null}
        {pl > 0 ? <line x1={PINS[0]} y1={ACR_Y} x2={SHT[0]} y2={ACR_Y} stroke={C.first} strokeWidth={22} strokeOpacity={0.6 * pl} /> : null}
        <g opacity={oV}>
          <Arc P={mkP(PINS[0], PINS[1], 1)} a0={0} a1={W.angle_deg} r={70} w={4} />
          <Lbl x={PINS[0] + 96} y={PINS[1] - 34} t="60°" s={T.floor} c={C.ink} />
          <Lbl x={VTIP[0] + 22} y={VTIP[1] + 6} t={`v = ${W.speed} m/s`} c={C.first} s={T.key} />
        </g>
        <ShadowLabel o={oSh} g={pl} />
        <Keyword f={f} text="towards warmer" at={[560, 620]} appear={tWarm} targets={[[SHT[0] + 8, ACR_Y + 16]]} />
        <Lbl x={1490} y={310} t="across" c={C.key} s={T.key} o={fin(f, tAcross)} />
        <CurvedLink f={f} from={LINK16_FROM} to={LINK16A_TO} start={tFive} bend={-50} />
      </Svg>
      <GradLabel x={PINS[0] + GL + 22} y={PINS[1]} />
      <TeX s={C60_L} x={1428} y={200} size={62} c={C.first} ax={1} o={fin(f, t1 + 10)} />
      <TeX s={C60_R} x={1440} y={200} size={62} c={C.first} o={fin(f, t1 + 10)} />
    </Scene>
  );
};

// ================================================================ s16b the advection number
const VGT_PARTS: Part[] = [
  { t: "=" },
  { t: String.raw`(|\mathbf v|\cos\theta)`, c: C.first, u: { w: String.raw`\small\text{shadow}`, c: C.first } },
  { t: String.raw`\,|\nabla T|`, c: C.second, u: { w: String.raw`\substack{\small\text{length}\\ \small\text{of }\nabla T}`, c: C.second } },
];
const [VGT_L, VGT_R] = splitEq(EQ_VGT);
if (plainOf(VGT_PARTS) !== rep(VGT_R, String.raw`\,|`, String.raw` \,|`)) throw new Error("s16b parts ≠ EQ_VGT");
const VGTN_P = eqPieces(EQ_VGTN); // "= 5.00 m/s × 1.00e-5 K/m", "= 5.00e-5 K/s"
const [VGTN_A, VGTN_B] = VGTN_P[0].split(String.raw`\times1.00`);
const KH_R = splitEq(EQ_KH)[1];
const [LNG2_L, LNG2_R] = splitEq(EQ_GNORM2), LNG2_P = eqPieces(LNG2_R); // |∇T| | "= √((2.00e-5)² + 0²)", "= 2.00e-5 K/m"
if (LNG2_P.length !== 2) throw new Error("s20 |∇T| pieces");
const [LNG_L, LNG_R] = splitEq(EQ_GNORM), LNG_P = eqPieces(LNG_R); // |∇T| | "= √(…)", "= √((1.00e-5)² + 0²)", "= 1.00e-5 K/m"
if (LNG_P.length !== 3) throw new Error("s16b |∇T| pieces");
// S2 (review 5): slash units, as spoken; the two metres cancel
const UNITS: Part[] = [{ t: "(" }, { t: String.raw`\mathrm m`, x: C.neg }, { t: String.raw`/\mathrm s)\times(\mathrm K/` },
  { t: String.raw`\mathrm m`, x: C.neg }, { t: String.raw`) = \mathrm K/\mathrm s` }];
const S16B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16b_advection_number");
  // U-M4.3 (fix loop 3): sentence 0 = |∇T| by Pythagoras, shown first; sentence 1 = v·∇T, sentence 2 = the units
  const t0b = SS(k, 1), t1 = SS(k, 2), tKs = AT(k, 2, "leaving five"), tKh = AT(k, 2, "or point one eight");
  // the |∇T| block has its own stack (52 px, "=" at x 1200) and gives way to the v·∇T stack as sentence 1 starts
  const gnRows: CalcRow[] = [
    { lhs: LNG_L, rhs: LNG_P[0], at: 4, c: C.second, lc: C.second, h: 110 },
    { rhs: LNG_P[1], at: AT(k, 0, "the square root"), cont: true, h: 100 },
    { rhs: LNG_P[2], at: AT(k, 0, "just ten"), cont: true, c: C.second, h: 100, ul: AT(k, 0, "just ten") + 12 },
  ];
  const rows: CalcRow[] = [
    { lhs: VGT_L, rhs: { parts: VGT_PARTS, layers: [base(), { u: [1], o: fin(f, t0b + 20) }, { u: [2], o: fin(f, AT(k, 1, "the length of grad")) }] }, at: t0b + 8, h: 210 },
    { rhs: VGTN_A, at: AT(k, 1, "five metres per second times"), cont: true, h: 92 },
    { rhs: String.raw`{}\times1.00${VGTN_B}`, at: AT(k, 1, "ten to the minus five kelvin per metre"), cont: true, h: 92 },
    { rhs: VGTN_P[1], at: tKs, h: 92 },
    { rhs: String.raw`{}\times3600\ \mathrm s`, at: tKh, h: 92 },
    { rhs: rep(KH_R, "0.18", String.raw`\mathbf{0.18}`), at: tKh + 14, c: C.first, ul: tKh + 26, cont: true, h: 92 },
  ];
  return (
    <Scene>
      <Svg>
        <TMap />
        <Isos xs={ISO14_X} Ts={ISO14_T} />
        <MapFrame />
        <ColourBar />
        <WindLayer oV={1} oSh={1} oAl={0} f={f} />
        <ShadowLabel />
        {/* v6 (U-M6.7): the map's 'shadow' → the 5.00 m/s factor of v·∇T, from its reveal until sentence 3 */}
        <CurvedLink f={f} from={LINK16_FROM} to={[1425, 328]} start={AT(k, 1, "five metres per second times")} end={t1} bend={-40} />
        <g opacity={fin(f, tKh + 10)}>
          <BalloonThermometer x={MAPX + 40} y={850} s={0.5} />
          <Lbl x={MAPX + 90} y={800} t="advection term" c={C.key} s={T.key} />
        </g>
      </Svg>
      <GradLabel x={PINS[0] + GL + 22} y={PINS[1]} />
      <Layered parts={UNITS} layers={[base(), { x: [1, 3], o: fin(f, AT(k, 2, "The metres cancel") + 20, 10) }]} x={GM.mx} y={790} size={54} o={fin(f, t1)} />
      <CalcStack f={f} x={1200} y={50} rows={gnRows} maxLines={3} size={52} o={fout(f, t0b - 4, 12)} />
      <CalcStack f={f} x={1275} y={50} rows={rows} maxLines={3} size={64} />
    </Scene>
  );
};

/// ================================================================ MapCamera (v6 kit): zoom / pan on the map projection
// scale 1.47 → 4.0 px/km about the zoom window's centre (weather.json → zoom_window_km, zoom_px_per_km); everything on the
// map is projected through the same transform; the km ticks re-label at the new scale; the colour bar stays fixed.
type Cam = { x0: number; y0: number; km: number };
const BOXW = GM.w * GM.km, BOXH = GM.h * GM.km;
const ZW = W.zoom_window_km as number[][], ZK = W.zoom_px_per_km as number;
const ZC: Pt = [(ZW[0][0] + ZW[0][1]) / 2, (ZW[1][0] + ZW[1][1]) / 2];
const camAt = (z: number): Cam => {
  const km = Math.exp(Math.log(GM.km) + (Math.log(ZK) - Math.log(GM.km)) * z);
  const cx = GM.w / 2 + (ZC[0] - GM.w / 2) * z, cy = GM.h / 2 + (ZC[1] - GM.h / 2) * z;
  return { x0: cx - BOXW / 2 / km, y0: cy - BOXH / 2 / km, km };
};
const cX = (c: Cam, xk: number) => GM.mx + (xk - c.x0) * c.km;
const cY = (c: Cam, yk: number) => GM.my + BOXH - (yk - c.y0) * c.km;
const cP = (c: Cam, p: Pt): Pt => [cX(c, p[0]), cY(c, p[1])];
const CamTMap: React.FC<{ c: Cam; shift?: number }> = ({ c, shift = 0 }) => {
  const n = 120, dx = BOXW / n, out = [];
  for (let i = 0; i < n; i++) out.push(<rect key={i} x={GM.mx + i * dx} y={GM.my} width={dx + 0.7} height={BOXH} fill={tColor(T_AT(c.x0 + ((i + 0.5) * dx) / c.km, shift))} />);
  return <g>{out}</g>;
};
const CamIsos: React.FC<{ c: Cam; xs: number[]; Ts: number[]; o?: number }> = ({ c, xs, Ts, o = 1 }) => (
  <g opacity={o}>
    {xs.map((xk, i) => {
      const px = cX(c, xk);
      if (px < GM.mx + 1 || px > GM.mx + BOXW - 1) return null;
      return (
        <g key={i}>
          <line x1={px} y1={GM.my} x2={px} y2={GM.my + BOXH} stroke="#ffffff" strokeOpacity={0.75} strokeWidth={3} />
          {px > GM.mx + 25 && px < GM.mx + BOXW - 35 ? <Lbl x={px} y={GM.my - 34} t={`${Ts[i]} °C`} c={C.ink} s={T.floor} a="middle" /> : null}
        </g>
      );
    })}
  </g>
);
const CamFrame: React.FC<{ c: Cam }> = ({ c }) => {
  const zoomed = c.km > 2.5, step = zoomed ? 50 : 100;
  const x1 = c.x0 + BOXW / c.km, y1 = c.y0 + BOXH / c.km;
  const xt: number[] = [], yt: number[] = [];
  for (let v = Math.ceil(c.x0 / step - 1e-9) * step; v <= x1 + 1e-9; v += step) if (cX(c, v) >= GM.mx - 1 && cX(c, v) <= GM.mx + BOXW + 1) xt.push(v);
  if (zoomed) { for (let v = Math.ceil(c.y0 / 50) * 50; v <= y1; v += 50) yt.push(v); } else yt.push(...[0, 180, 360].filter((v) => v >= c.y0 - 1 && v <= y1 + 1));
  return (
    <g>
      <rect x={GM.mx} y={GM.my} width={BOXW} height={BOXH} fill="none" stroke={C.grid} strokeWidth={3} />
      {xt.map((v) => <Lbl key={`x${v}`} x={cX(c, v)} y={GM.my + BOXH + 34} t={`${v}`} c={C.muted} s={T.floor} a="middle" b={false} />)}
      <Lbl x={GM.mx + BOXW + 50} y={GM.my + BOXH + 34} t="km" c={C.muted} s={T.floor} a="start" b={false} />
      {yt.map((v) => <Lbl key={`y${v}`} x={GM.mx - 12} y={cY(c, v)} t={`${v}`} c={C.muted} s={T.floor} a="end" b={false} />)}
      <Lbl x={GM.mx - 12} y={GM.my - 46} t="km" c={C.muted} s={T.floor} a="end" b={false} />
    </g>
  );
};
const ClipBox: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <>
    <defs><clipPath id={id}><rect x={GM.mx} y={GM.my} width={BOXW} height={BOXH} /></clipPath></defs>
    <g clipPath={`url(#${id})`}>{children}</g>
  </>
);
const ISO0 = ISO_X.map((xs) => xs[0]);
const FAR = gP(GM, W.upwind_far_km as Pt);
const BX = W.balloon_x_km as number[], BY = W.balloon_y_km as number[];
/** the graph used by s17b and s19a (same axes, so the two compare) */
const GR = { x: 1230, y: 580, w: 400, h: 210 };
const GTR = W.graph_T_range_C as [number, number];
const GXY = tgXY(GR.x, GR.y, GR.w, GR.h, GTR);
const TH = W.iso_t_h as number[];

// ================================================================ s17 what +0.18 K per hour means (forward view, snapshot)
const [E18L, E18R] = splitEq(EQ_18KM), [E018L, E018R] = splitEq(EQ_018), [EU_L, EU_R] = splitEq(EQ_UNITS17);
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_meaning");
  const s = (j: number) => SS(k, j);
  const z = ramp(f, s(1), s(1) + 45), c = camAt(z);
  const tRight = AT(k, 1, "right now"), t2 = s(2), t3 = s(3), t18 = AT(k, 3, "eighteen kilometres"), t4 = s(4), t018 = AT(k, 4, "point one eight degrees");
  const t5 = s(5), t6 = s(6), t7 = s(7), t8 = s(8), t9 = s(9), t10 = s(10), t11 = s(11), t12 = s(12);
  const pin = cP(c, PIN), ghost = cP(c, [BX[60], BY[60]]), spanEnd = cP(c, [W.fwd_span_km[1], PIN[1]]);
  const xS0 = cX(c, W.fwd_span_km[0]), xS1 = cX(c, W.fwd_span_km[1]);
  const oWind = fin(f, t2) * fout(f, t3, 14), oSh = fin(f, t2 + 8) * fout(f, t6);
  const shY = pin[1] + 36, shEnd: Pt = [pin[0] + W.shadow_m_s * US, shY];
  const vT: Pt = [pin[0] + W.speed * US * Math.cos(VANG), pin[1] - W.speed * US * Math.sin(VANG)];
  const path = clamp((f - t3 - 4) / 30, 0, 1);
  const pl9 = pulse(f, t8, 20);
  const oSpan = fin(f, t18 - 10), oStrip = fin(f, AT(k, 4, "each hundred"));
  const ruler = fin(f, t6) * fout(f, t8);
  const big = 68 + 16 * fin(f, t8, 12), oHead = fout(f, t9, 10), oAdv = fin(f, t9, 10);
  const tile = fin(f, AT(k, 10, "the same for every"), 10) * fout(f, AT(k, 10, "the same for every") + 60, 12);
  return (
    <Scene>
      <Svg>
        <ClipBox id="clip17">
          <CamTMap c={c} />
          {/* the 13.00-13.18 °C strip (V2) */}
          {oStrip > 0 ? <rect x={xS0} y={GM.my} width={xS1 - xS0} height={BOXH} fill={C.gold} fillOpacity={(0.25 + 0.2 * pl9) * oStrip} /> : null}
          {oStrip > 0 ? <line x1={xS1} y1={GM.my} x2={xS1} y2={GM.my + BOXH} stroke="#ffffff" strokeWidth={3} strokeDasharray="10 8" opacity={oStrip} /> : null}
          {tile > 0 ? <g opacity={0.3 * tile}>{[[260, 280], [660, 260], [880, 520], [260, 560], [700, 600]].map(([x, y], i) =>
            <Arrow key={i} p={[x, y]} q={[x + 90 * Math.cos(VANG), y - 90 * Math.sin(VANG)]} color={C.first} w={7} head={24} halo={false} />)}</g> : null}
        </ClipBox>
        <CamIsos c={c} xs={ISO0} Ts={ISO_T} />
        <CamFrame c={c} />
        <ColourBar />
        <SnapCorners x0={GM.mx + 12} y0={GM.my + 12} x1={GM.mx + BOXW - 12} y1={GM.my + BOXH - 12} o={1} />
        <CameraGlyph x={950} y={190} />
        <Lbl x={905} y={192} t="t = 0 h" c={C.ink} s={T.key} a="end" />
        <Keyword f={f} text="right now" at={[905, 252]} a="end" appear={tRight} out={t2 + 20} targets={[]} />
        {oStrip > 0 ? <Lbl x={xS1 + 10} y={GM.my + 38} t={`${W.fwd_strip_T_C[1].toFixed(2)} °C`} c={C.ink} s={T.floor} o={oStrip} /> : null}
        {/* the pole just left of the pin, the balloon with its air-parcel ellipse on the pin */}
        <PoleThermometer x={pin[0] - 40} y={pin[1]} s={1.0} />
        <ellipse cx={pin[0]} cy={pin[1] - 53} rx={48} ry={86} fill="#ffffff" fillOpacity={0.07 + 0.06 * fin(f, s(1))} stroke="#ffffff" strokeWidth={4} strokeDasharray="10 8" opacity={0.6 + 0.4 * fin(f, s(1))} />
        <BalloonThermometer x={pin[0]} y={pin[1]} s={0.6} o={0.75 + 0.25 * fin(f, s(1))} />
        {/* S3: the wind and its shadow (own m/s scale, as in s16) */}
        <Arrow p={pin} q={vT} color={C.first} o={oWind} />
        {oSh > 0 ? <g opacity={oSh}>
          <Dash p={vT} q={shEnd} w={4} o={oWind} />
          <Arrow p={[pin[0], shY]} q={shEnd} color={C.first} w={8} head={30} />
          <Lbl x={shEnd[0] + 18} y={shY} t="shadow" c={C.key} s={T.key} />
        </g> : null}
        {/* S4: the 1-h path, the ghost balloon, the drop and the 18-km across span (V2) */}
        {path > 0 ? <Dash p={pin} q={lerp(pin, ghost, path)} c={C.first} w={6} d="14 10" o={1} /> : null}
        {path > 0 ? <line x1={pin[0]} y1={pin[1]} x2={lerp(pin, ghost, path)[0]} y2={lerp(pin, ghost, path)[1]} stroke={C.first} strokeWidth={14} strokeOpacity={0.5 * pl9} /> : null}
        <BalloonThermometer x={ghost[0]} y={ghost[1]} s={0.6} o={0.45 * path} />
        <Dash p={ghost} q={spanEnd} w={3} d="5 7" o={oSpan} />
        {oSpan > 0 ? <line x1={pin[0]} y1={pin[1]} x2={spanEnd[0]} y2={pin[1]} stroke={C.first} strokeWidth={20 + 8 * pl9} strokeOpacity={0.85 * oSpan} /> : null}
        {/* S6: readouts */}
        <Lbl x={ghost[0] + 30} y={ghost[1] - 70} t={`${W.T_under_balloon[1].toFixed(2)} °C`} c={C.first} s={T.key} o={fin(f, AT(k, 5, "thirteen point one eight"))} />
        <Lbl x={pin[0] - 70} y={pin[1] - 70} t={`${W.T_pin.toFixed(2)} °C`} c={C.local} s={T.key} a="end" o={fin(f, AT(k, 5, "thirteen point one eight"))} />
        {/* S7: 1 °C per 100 km between the 13 and 14 °C isotherms */}
        <g opacity={ruler}>
          <Bracket p={[cX(c, 300), 332]} q={[cX(c, 400), 332]} c={C.second} off={0} />
          <Lbl x={(cX(c, 300) + cX(c, 400)) / 2} y={294} t="1 °C per 100 km" c={C.second} s={T.key} a="middle" />
        </g>
        <Lbl x={1330} y={828} t="space" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 6, "a rate in space")) * fout(f, t12)} />
        <Lbl x={1600} y={828} t="time" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 7, "a rate in time")) * fout(f, t12)} />
        <g opacity={fin(f, AT(k, 7, "a rate in time")) * fout(f, t12)}><ClockGlyph x={1690} y={828} r={24} /></g>
        {/* S11: towards warmer air */}
        <Keyword f={f} text="towards warmer air" at={[1000, 530]} a="end" appear={AT(k, 10, "towards warmer")} out={t11} targets={[[(pin[0] + spanEnd[0]) / 2 + 20, pin[1] - 14]]} />
        {/* S12-S13: the question and the fork to the two cases */}
        <Lbl x={ghost[0] + 290} y={ghost[1] - 70} t="?" c={C.gold} s={84} a="middle" o={fin(f, t11)} />
        <g opacity={fin(f, t12)} stroke={C.gold} strokeWidth={5} fill="none" strokeLinecap="round">
          <polyline points="1485,740 1485,765 1300,790" /><polyline points="1485,765 1670,790" />
        </g>
        <Lbl x={1120} y={826} t="map frozen" c={C.key} s={T.key} o={fin(f, AT(k, 12, "two cases"))} />
        <Lbl x={1840} y={826} t="map slides" c={C.key} s={T.key} a="end" o={fin(f, AT(k, 12, "two cases") + 8)} />
        {/* the two links (U-M6.8/9): span → 18 km, strip → 0.18 °C; at most two at once; gone by sentence 7 */}
        <CurvedLink f={f} from={[(pin[0] + spanEnd[0]) / 2, pin[1] - 14]} to={[1650, 418]} ctl={[1100, 120]} start={t18} end={t6} o={1 - 0.6 * fin(f, t018)} />
        <CurvedLink f={f} from={[(xS0 + xS1) / 2, GM.my + 120]} to={[1792, 586]} ctl={[2000, 330]} start={t018} end={t6} />
      </Svg>
      <TeX s={String.raw`0.18\ \mathrm{K\ per\ hour}`} x={MAPX + 20} y={150} size={big} c={C.first} o={fin(f, 4) * oHead} />
      <TeX s={EQ_ADV17} x={MAPX + 20} y={150} size={T.calc} c={C.first} o={oAdv} glow={pulse(f, AT(k, 10, "It's positive"), 30)} />
      <TeX s={String.raw`\text{advection term}`} x={MAPX + 20} y={228} size={T.key} c={C.first} o={fin(f, AT(k, 9, "the advection term"))} />
      <TeX s={String.raw`5.00\ \mathrm{m/s}\ \text{across}`} x={MAPX + 20} y={240} size={T.key} c={C.first} o={fin(f, t2 + 8) * fout(f, t3)} />
      {/* the stack sits low (y 410-800) so the two links reach '18 km' from above and '0.18 °C' from the right */}
      <CalcStack f={f} x={1530} y={410} size={58} maxLines={3} rows={[
        { lhs: E18L, rhs: { raw: [{ s: col(C.ink, E18R), o: fin(f, t18) }] }, at: t3 + 10, h: 100, out: t9 },
        { lhs: E018L, rhs: { raw: [{ s: col(C.ink, E018R), o: fin(f, t018) }] }, at: AT(k, 4, "so eighteen"), h: 150, out: t9 },
        { lhs: EU_L, rhs: EU_R, at: AT(k, 7, "Multiply it"), h: 140, out: t12 },
      ]} />
    </Scene>
  );
};

// ================================================================ s17b Case 1: the frozen map
const K17B = K("s17b_frozen");
const F1 = AT(K17B, 2, "thirteen point one eight after"), F3 = AT(K17B, 2, "thirteen point five four after");
const FPH17 = (F3 - F1) / 2, F0 = F1 - FPH17; // s17b: one constant rate, whole hours on the spoken numbers
const [FRZ_L, FRZ_R] = splitEq(EQ_FRZ), FRZP = eqPieces(FRZ_R); // DT/Dt | "= ∂T/∂t + v·∇T", "= 0 + 0.18 K per hour"
const MARK_KM = W.frozen_marks_km as number[], MARK_T = W.frozen_marks_T_C as number[];
const S17B: React.FC = () => {
  const f = useCurrentFrame(), k = K17B;
  const c = camAt(1);
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), tPlus = AT(k, 4, "plus point one eight"), t5 = SS(k, 5), t6 = SS(k, 6);
  const h = clamp((f - F0) / FPH17, 0, 3);
  const Tb = atH(W.frozen_balloon_T_C as number[], h), Tp = atH(W.frozen_pole_T_C as number[], h);
  const pin = cP(c, PIN), bal = cP(c, balloonAtH(h));
  const glow = pulse(f, 6, 30);
  const oGraph = fin(f, t2);
  const span = (n: number) => fin(f, t3 + n * 18, 10);
  const tFlat = AT(k, 5, "stays flat"), tClimb = AT(k, 5, "line climbs");
  const trail: string[] = [];
  for (let j = 0; j <= 180 && TH[j] <= h + 1e-9; j += 3) trail.push(cP(c, [BX[j], BY[j]]).join(","));
  trail.push(bal.join(","));
  return (
    <Scene>
      <Svg>
        <ClipBox id="clip17b">
          <CamTMap c={c} />
          {glow > 0 ? <rect x={GM.mx} y={GM.my} width={BOXW} height={BOXH} fill={C.gold} fillOpacity={0.14 * glow} /> : null}
          {MARK_KM.map((xk, i) => <line key={i} x1={cX(c, xk)} y1={GM.my} x2={cX(c, xk)} y2={GM.my + BOXH} stroke="#ffffff" strokeWidth={3} strokeDasharray="10 8" opacity={0.8} />)}
          {/* S4: the three hourly spans across the isotherms, along the top edge */}
          {[0, 1, 2].map((n) => {
            const a = n === 0 ? 300 : MARK_KM[n - 1], b = MARK_KM[n];
            return <line key={n} x1={cX(c, a) + 2} y1={GM.my + 14} x2={cX(c, b) - 2} y2={GM.my + 14} stroke={C.gold} strokeWidth={14} opacity={span(n)} />;
          })}
        </ClipBox>
        <CamIsos c={c} xs={ISO0} Ts={ISO_T} />
        <CamFrame c={c} />
        <ColourBar />
        <SnapCorners x0={GM.mx + 12} y0={GM.my + 12} x1={GM.mx + BOXW - 12} y1={GM.my + BOXH - 12} o={fout(f, 4, 14)} />
        {MARK_KM.map((xk, i) => <Lbl key={i} x={cX(c, xk) + 24} y={GM.my + BOXH - 12} t={`${MARK_T[i].toFixed(2)} °C`} c={C.ink} s={T.floor} a="start" rot={-90} />)}
        <SunGlyph x={150} y={58} />
        <Lbl x={196} y={58} t="map frozen" c={C.key} s={T.key} />
        <PoleThermometer x={pin[0] - 40} y={pin[1]} s={1.0} />
        <circle cx={pin[0]} cy={pin[1]} r={8} fill={C.ink} stroke={C.bg} strokeWidth={3} />
        {h > 0 ? <polyline points={trail.join(" ")} fill="none" stroke={C.first} strokeWidth={5} strokeDasharray="12 9" /> : null}
        <BalloonThermometer x={bal[0]} y={bal[1]} s={0.5} />
        <ClockText x={120} y={790} h={h} o={fin(f, t2)} />
        {/* maths zone: the two readouts */}
        <g opacity={fin(f, t1)}><PoleThermometer x={1130} y={166} s={0.7} /></g>
        <Lbl x={1162} y={120} t={`${Tp.toFixed(2)} °C`} c={C.local} s={T.calc} o={fin(f, t1)} />
        <g opacity={fin(f, t2)}><BalloonThermometer x={1490} y={170} s={0.45} /></g>
        <Lbl x={1524} y={120} t={`${Tb.toFixed(2)} °C`} c={C.first} s={T.calc} o={fin(f, t2)} />
        <Lbl x={1440} y={262} t="local rate" c={C.local} s={T.key} o={fin(f, AT(k, 1, "local rate")) * fout(f, t4)} />
        {/* S5: the underlined terms of the equation */}
        <Lbl x={1150} y={366} t="local rate" c={C.local} s={T.floor} o={fin(f, AT(k, 4, "zero plus"))} />
        <Lbl x={1385} y={366} t="advection term" c={C.first} s={T.floor} o={fin(f, AT(k, 4, "plus v dot"))} />
        <TimeGraph x={GR.x} y={GR.y} w={GR.w} h={GR.h} Tr={GTR} o={oGraph} series={[
          { t: TH, T: W.frozen_pole_T_C as number[], upto: h, c: C.local, dash: true },
          { t: TH, T: W.frozen_balloon_T_C as number[], upto: h, c: C.first, pts: [1, 2, 3].map((n) => ({ h: n, o: h >= n ? 1 : 0 })) },
        ]} />
        {[1, 2, 3].map((n) => <Lbl key={n} x={GXY.X(n - 0.5)} y={GXY.Y(13 + 0.18 * (n - 0.5)) - 34} t="+0.18" c={C.first} s={T.floor} a="middle" o={fin(f, t3 + (n - 1) * 18, 10)} />)}
        <Lbl x={GR.x + GR.w} y={GXY.Y(13) + 42} t={f >= tFlat ? "fixed thermometer: flat" : "fixed thermometer"} c={C.local} s={T.floor + 6 * pulse(f, tFlat, 24)} a="end" o={oGraph} />
        <Lbl x={GR.x + 10} y={GR.y - 52} t={f >= tClimb ? "balloon: climbs" : "balloon"} c={C.first} s={T.floor + 6 * pulse(f, tClimb, 24)} o={oGraph} />
      </Svg>
      <TeX s={EQ_LOC0} x={1130} y={262} size={T.calc} c={C.local} o={fin(f, AT(k, 1, "partial T by partial t")) * fout(f, t4)} />
      <TeX s={`${FRZ_L} ${FRZP[0]}`} x={1130} y={225} size={56} o={fin(f, t4)} />
      <TeX s={FRZP[1]} x={1206} y={316} size={56} o={fin(f, AT(k, 4, "zero plus"))} />
      <TeX s={EQ_FRZR} x={1130} y={448} size={52} c={C.first} o={fin(f, tPlus)} glow={pulse(f, t6 + 10, 36)} />
    </Scene>
  );
};

// ================================================================ s18 Case 2: each parcel keeps its temperature
const TAG_IDX = [0, 2, 4, 6, 8, 10, 12, 14, 24, 26, 28, 30];
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_keeps_temperature");
  // v6 (U-M6.11): sentence 1 = the assumption about the balloon's parcel, 2 = DT/Dt = 0, 3 = every other parcel,
  // 4 = the pattern slides, 5 = 18 km per hour; the camera eases back from the s17b zoom on sentence 0
  const t1 = SS(k, 1), tNoSun = AT(k, 1, "no sunshine"), tZero = AT(k, 2, "is zero"), t3 = SS(k, 3), t4 = SS(k, 4);
  const tSlides = AT(k, 4, "slides with the wind"), t5 = SS(k, 5), t18 = AT(k, 5, "eighteen kilometres");
  const z = 1 - ramp(f, 4, 49), cam = camAt(z);
  const h = hoursFrom(f, t4 + 10, 1);
  const shift = atH(W.iso_shift_km as number[], h);
  const isoXs = ISO_X.map((xs) => atH(xs, h));
  const i13 = ISO_T.indexOf(13);
  const im = Math.min(60, h * 60), i0 = Math.floor(im), i1 = Math.min(60, i0 + 1), w = im - i0;
  const oTags = fin(f, t3, 14);
  const bal = gP(GM, balloon18AtH(h));
  return (
    <Scene>
      <Svg>
        {z > 0 ? <>
          <ClipBox id="clip18z"><CamTMap c={cam} /></ClipBox>
          <CamIsos c={cam} xs={ISO0} Ts={ISO_T} />
          <CamFrame c={cam} />
        </> : <>
          <ClipMap id="clip18">
            <TMap shift={shift} />
            <Isos xs={isoXs} Ts={ISO_T} />
            {/* S5 (review 5): a ghost of the 13 °C isotherm stays at its t = 0 place; the moving 13 °C line is brighter */}
            <line x1={gX(GM, ISO_X[i13][0])} y1={GM.my} x2={gX(GM, ISO_X[i13][0])} y2={GM.my + GM.h * GM.km} stroke="#ffffff" strokeOpacity={0.55} strokeWidth={3} strokeDasharray="6 10" opacity={fin(f, t4)} />
            <line x1={gX(GM, isoXs[i13])} y1={GM.my} x2={gX(GM, isoXs[i13])} y2={GM.my + GM.h * GM.km} stroke="#ffffff" strokeWidth={7} opacity={fin(f, t4)} />
            <g opacity={oTags}>
              {TAG_IDX.map((i) => {
                const xk = W.tags_x_km[i][i0] + (W.tags_x_km[i][i1] - W.tags_x_km[i][i0]) * w;
                const yk = W.tags_y_km[i][i0] + (W.tags_y_km[i][i1] - W.tags_y_km[i][i0]) * w;
                const p = gP(GM, [xk, yk]);
                return (
                  <g key={i}>
                    <circle cx={p[0]} cy={p[1]} r={12} fill={tColor(W.tags_T[i])} stroke="#ffffff" strokeWidth={3} />
                    <Lbl x={p[0]} y={p[1] - 34} t={W.tags_T[i].toFixed(1)} c={C.ink} s={T.floor} a="middle" />
                  </g>
                );
              })}
            </g>
            {fin(f, t1) > 0 ? <ellipse cx={bal[0]} cy={bal[1] - 53} rx={48} ry={86} fill="#ffffff" fillOpacity={0.07} stroke="#ffffff" strokeWidth={4} strokeDasharray="10 8" opacity={fin(f, t1)} /> : null}
            <BalloonThermometer x={bal[0]} y={bal[1]} s={0.6} o={fin(f, t1)} />
          </ClipMap>
          <MapFrame />
          {isoXs.map((xk, i) => (xk > 25 && xk < GM.w - 35 ? <Lbl key={i} x={gX(GM, xk)} y={GM.my - 34} t={`${ISO_T[i]} °C`} c={C.ink} s={T.floor} a="middle" /> : null))}
        </>}
        <ColourBar />
        <Lbl x={120} y={58} t="map slides" c={C.key} s={T.key} o={fin(f, 4)} />
        <Keyword f={f} text="keeps its temperature" at={[140, 572]} appear={t1 + 20} out={t3} bend={0.1} targets={[[bal[0] - 10, bal[1] + 40]]} />
        <Lbl x={120} y={830} t="no sun · no mixing" c={C.key} s={T.floor} o={fin(f, tNoSun)} />
        <Keyword f={f} text="each parcel keeps its T" at={[100, 760]} appear={t3 + 10} bend={0.05}
          targets={[[gX(GM, W.tags_x_km[0][i0] + (W.tags_x_km[0][i1] - W.tags_x_km[0][i0]) * w) + 6, gY(GM, W.tags_y_km[0][i0] + (W.tags_y_km[0][i1] - W.tags_y_km[0][i0]) * w) + 20]]} />
        <Keyword f={f} text="the pattern slides" at={[560, 830]} appear={tSlides} out={t5 + 30} bend={0.05} targets={[[gX(GM, isoXs[i13]) + 4, GM.my + GM.h * GM.km - 14]]} />
        <g opacity={fin(f, t18)}>
          <Bracket p={[gX(GM, 300), 170]} q={[gX(GM, isoXs[i13]), 170]} c={C.ink} off={0} />
          <Lbl x={gX(GM, 300) - 16} y={172} t="18 km" c={C.ink} s={T.key} a="end" />
        </g>
        <Lbl x={1840} y={560} t="east, 18 km per hour" c={C.key} s={T.key} a="end" o={fin(f, t18)} />
        <g opacity={fin(f, t1)}><BalloonThermometer x={MAPX + 50} y={420} s={0.6} /></g>
        <Lbl x={MAPX + 110} y={350} t={`${W.T_balloon_field_C[0].toFixed(2)} °C`} c={C.first} s={T.calc} o={fin(f, t1)} />
        <Keyword f={f} text="material derivative" at={[MAPX + 20, 268]} appear={tZero + 8} targets={[]} />
        <ClockText x={MAPX + 10} y={680} h={h} o={fin(f, t4)} />
      </Svg>
      <TeX s={EQ_D0} x={MAPX + 20} y={150} size={T.eq} c={C.first} o={fin(f, tZero)} />
    </Scene>
  );
};

// ================================================================ s19a Case 2: the queued parcels reach the pole
const UPT = W.upwind_T_C as number[], UPTX = W.upwind_track_x_km as number[][], UPTY = W.upwind_track_y_km as number[][];
const DOWN = gP(GM, [BX[180], BY[180]]);
const POLE_RD: Pt = [1162, 150];
const S19A: React.FC = () => {
  const f = useCurrentFrame(), k = K19A;
  const t1 = SS(k, 1), tWarm = AT(k, 1, "it's warmer"), tCold = AT(k, 1, "it's colder"), tUp = AT(k, 1, "upwind, where");
  const t2 = SS(k, 2), tIn1 = AT(k, 2, "in one hour"), t18 = AT(k, 2, "eighteen kilometres"), tP1 = AT(k, 2, "twelve point eight two");
  const tP2 = AT(k, 3, "in two hours"), tP3 = AT(k, 3, "in three hours"), t6 = SS(k, 6), t7 = SS(k, 7);
  const tParcel = [tIn1, tP2, tP3], tTemp = [tP1, tP2 + 6, tP3 + 6];
  const h = clamp((f - H0) / FPH, 0, 3);
  const Tp = atH(W.T_pole_field_C as number[], h), Tb = atH(W.T_balloon_field_C as number[], h);
  const shift = atH(W.iso_shift_km as number[], h);
  const isoXs = ISO_X.map((xs) => atH(xs, h));
  const bal = gP(GM, balloonOffAtH(h));
  const oLine = fin(f, t1, 14);
  const x282 = gX(GM, W.upwind_x_km[0]);
  const oBand = fin(f, t18) * fout(f, H0, 12);
  return (
    <Scene>
      <Svg>
        <ClipMap id="clip19a">
          <TMap shift={shift} />
          <Isos xs={isoXs} Ts={ISO_T} />
          {oBand > 0 ? <rect x={x282} y={GM.my} width={PINS[0] - x282} height={GM.h * GM.km} fill={C.neg} fillOpacity={0.2 * oBand} /> : null}
          <Dash p={FAR} q={DOWN} c={C.ink} w={4} d="12 10" o={0.7 * oLine} />
        </ClipMap>
        {isoXs.map((xk, i) => (xk > 25 && xk < GM.w - 35 ? <Lbl key={i} x={gX(GM, xk)} y={GM.my - 34} t={`${ISO_T[i]} °C`} c={C.ink} s={T.floor} a="middle" /> : null))}
        <MapFrame />
        <ColourBar />
        <Lbl x={DOWN[0] + 24} y={DOWN[1] - 6} t="warmer" c={C.key} s={T.key} o={fin(f, tWarm)} />
        <Lbl x={FAR[0] - 24} y={FAR[1] - 18} t="colder" c={C.key} s={T.key} a="end" o={fin(f, tCold) * fout(f, t2)} />
        <Lbl x={FAR[0] - 24} y={FAR[1] + 38} t="upwind" c={C.key} s={T.key} a="end" o={fin(f, tUp) * fout(f, t2)} />
        {/* S3: the mirror of s17's span: 18 km across the isotherms on the colder side (rose) */}
        {oBand > 0 ? <g opacity={oBand}>
          <line x1={x282} y1={PINS[1]} x2={PINS[0]} y2={PINS[1]} stroke={C.neg} strokeWidth={20} strokeOpacity={0.9} />
          <Lbl x={PINS[0] + 26} y={PINS[1] - 26} t={`${W.upwind_across_km[0].toFixed(0)} km`} c={C.ink} s={T.key} a="start" />
        </g> : null}
        <PoleThermometer x={PINS[0]} y={PINS[1]} s={1.2} />
        {/* the queued parcels, labelled by arrival; each number rides with its parcel, then flies into the pole readout */}
        {UPT.map((Tc, i) => {
          const n = i + 1, fa = H0 + n * FPH;
          const p = gP(GM, [atH(UPTX[i], h), atH(UPTY[i], h)]);
          const oDot = fin(f, tParcel[i], 10) * (1 - ramp(f, fa, fa + 8));
          const lp: Pt = [p[0] - 26, p[1] + 4 + (i - 1) * 28];
          const fly = ramp(f, fa, fa + 12);
          const pos = lerp(lp, [POLE_RD[0] + textW(`${Tc.toFixed(2)} °C`, T.calc), POLE_RD[1]], fly);
          const oNum = fin(f, tTemp[i], 10) * (1 - ramp(f, fa + 10, fa + 14));
          return (
            <g key={i}>
              {oDot > 0 ? <g opacity={oDot}>
                <circle cx={p[0]} cy={p[1]} r={14} fill={tColor(Tc)} stroke={C.ink} strokeWidth={4} />
                <Lbl x={p[0] + 24} y={p[1] + 2} t={`in ${n} h`} c={C.key} s={T.floor} o={1 - ramp(f, SS(k, 4), SS(k, 4) + 10)} />
              </g> : null}
              <Lbl x={pos[0]} y={pos[1]} t={i === 0 || fly > 0 ? `${Tc.toFixed(2)} °C` : Tc.toFixed(2)} c={fly > 0.5 ? C.local : C.ink} s={T.key + (T.calc - T.key) * fly} a="end" o={oNum} />
            </g>
          );
        })}
        <BalloonThermometer x={bal[0]} y={bal[1]} s={0.6} o={fin(f, SS(k, 4) + 6, 12)} />
        <ClockText x={120} y={790} h={h} />
        <Keyword f={f} text="colder air arriving" at={[520, 790]} appear={AT(k, 6, "Colder and colder")} targets={[lerp(PINS, FAR, 0.65)]} bend={0.08} />
        {/* maths zone: the two readouts on one clock, and the graph (same axes as s17b) */}
        <PoleThermometer x={1130} y={196} s={0.7} />
        {/* while a parcel's number flies in, the readout steps aside, then shows the arrived value */}
        <Lbl x={POLE_RD[0]} y={POLE_RD[1]} t={`${Tp.toFixed(2)} °C`} c={C.local} s={T.calc} o={1 - Math.max(...[1, 2, 3].map((n) => ramp(f, H0 + n * FPH - 2, H0 + n * FPH + 2) * (1 - ramp(f, H0 + n * FPH + 10, H0 + n * FPH + 14))))} />
        <BalloonThermometer x={1490} y={200} s={0.45} />
        <Lbl x={1524} y={150} t={`${Tb.toFixed(2)} °C`} c={C.first} s={T.calc + 8 * pulse(f, t7 + 10, 24)} />
        <TimeGraph x={GR.x} y={GR.y} w={GR.w} h={GR.h} Tr={GTR} series={[
          { t: TH, T: W.T_balloon_field_C as number[], upto: h, c: C.first, o: 0.4 + 0.6 * fin(f, t7) },
          { t: TH, T: W.T_pole_field_C as number[], upto: h, c: C.local, dash: true, pts: [1, 2, 3].map((n) => ({ h: n, o: fin(f, H0 + n * FPH + 16, 8) })) },
        ]} />
        {/* the legend (no word 'pole' on screen: orchestrator update 2) */}
        <line x1={GR.x} y1={300} x2={GR.x + 70} y2={300} stroke={C.local} strokeWidth={6} strokeDasharray="16 10" />
        <Lbl x={GR.x + 90} y={300} t="fixed thermometer" c={C.local} s={T.floor} />
        <line x1={GR.x} y1={360} x2={GR.x + 70} y2={360} stroke={C.first} strokeWidth={6} />
        <Lbl x={GR.x + 90} y={360} t="balloon" c={C.first} s={T.floor} />
        <Lbl x={GR.x} y={470} t="−0.18 °C per hour" c={C.neg} s={T.key} o={fin(f, AT(k, 6, "falls by"))} />
        <Arrow p={[GXY.X(1.2), GXY.Y(atH(W.T_pole_field_C as number[], 1.2)) - 22]} q={[GXY.X(2.3), GXY.Y(atH(W.T_pole_field_C as number[], 2.3)) - 22]} color={C.neg} w={5} head={20} halo={false} o={fin(f, AT(k, 6, "falls by"))} />
        <Lbl x={GR.x} y={532} t="balloon: stays 13 °C" c={C.first} s={T.floor + 6} o={fin(f, AT(k, 7, "stays flat"))} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s19b our equation says the same
// M1 (review 5): the underbrace "+0.18 K/h" sits under v·∇T on the line ∂T/∂t = −v·∇T
const LOCAL_PARTS: Part[] = [{ t: "=" }, { t: "-", c: C.neg },
  // N3 (review 5b): no inner \textcolor, so the brace word takes the layer colour (transparent until "plus point one eight")
  { t: String.raw`\,\mathbf v\cdot\nabla T`, u: { w: String.raw`\mathclap{\small +0.18\ \mathrm{K/h}}`, c: C.first } }];
const [LOC_L, LOC_R] = splitEq(EQ_LOCAL);
if (plainOf(LOCAL_PARTS) !== LOC_R.replace("-\\,", "- \\,")) throw new Error("s19b parts ≠ EQ_LOCAL");
const [LOCN_L, LOCN_R] = splitEq(EQ_LOCALN), LOCNP = eqPieces(LOCN_R);
const [TF_L, TF_R] = splitEq(EQ_TF), [ZERO_L, ZERO_R] = splitEq(EQ_ZERO);
const S19B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19b_equation");
  const tSub = AT(k, 1, "and subtract"), tPlus = AT(k, 2, "plus point one eight"), t3 = SS(k, 3), tCold = AT(k, 3, "as colder air");
  const rows: CalcRow[] = [
    { lhs: TF_L, rhs: TF_R, at: 4, h: 170 },
    { lhs: ZERO_L, rhs: ZERO_R, at: AT(k, 1, "Put zero"), h: 170 },
    { lhs: LOC_L, rhs: { parts: LOCAL_PARTS, layers: [base(), { u: [2], o: fin(f, tPlus, 10) }] }, at: tSub + 20, h: 250 },
    // the full result line, in rose, revealed on "The minus sign makes it a fall"
    { lhs: LOCN_L, lc: C.neg, rhs: LOCNP[1], c: C.neg, at: t3, ul: t3 + 14, ulOff: 26, h: 180, size: 62 },
  ];
  const x = 1300;
  return (
    <Scene>
      <Svg>
        <g opacity={0.6}>
          <ClipMap id="clip19b">
            <TMap shift={atH(W.iso_shift_km as number[], 3)} />
            <Isos xs={ISO_X.map((xs) => xs[180])} Ts={ISO_T} />
          </ClipMap>
          <MapFrame />
          <PoleThermometer x={PINS[0]} y={PINS[1]} s={1.2} />
        </g>
        <Lbl x={PINS[0] + 40} y={PINS[1] - 130} t={`${W.T_pole_field_C[180].toFixed(2)} °C`} c={C.local} s={T.key} />
        {/* M5: keyword inside the (dimmed) map, pointer to the pole's bulb, not onto 12.46 °C */}
        <Keyword f={f} text="colder air carried in" at={[GM.mx + 30, 580]} appear={tCold} targets={[[PINS[0] - 14, PINS[1] - 96]]} />
        {/* v6: the s19a graph as a thumbnail under the map's lower right (pole falling, balloon flat) */}
        <TimeGraph thumb x={700} y={738} w={230} h={110} Tr={GTR} series={[
          { t: TH, T: W.T_balloon_field_C as number[], upto: 3, c: C.first },
          { t: TH, T: W.T_pole_field_C as number[], upto: 3, c: C.local, dash: true },
        ]} />
        <Lbl x={692} y={738 + 100} t="fixed thermometer" c={C.local} s={T.floor} a="end" />
        <Lbl x={692} y={738 + 22} t="balloon" c={C.first} s={T.floor} a="end" />
      </Svg>
      <CalcStack f={f} x={x} y={40} rows={rows} maxLines={4} />
    </Scene>
  );
};

// ================================================================ s19c the balance: Case 1 and Case 2
const BAL_X0 = 1470, BAL_SC = 300 / 0.18, BU_Y = 340, BL_Y = 620;
const S19C: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19c_balance");
  // v6: sentence 1 = the move, 2 = the advection term, 3 = Case 1 (frozen), 4 = Case 2 local rate, 5 = "They cancel",
  // 6 = same advection term, different local rate
  const t1 = SS(k, 1), tAdv = AT(k, 2, "that's the advection"), t3 = SS(k, 3), t4 = SS(k, 4), tLoc = AT(k, 4, "minus point one eight"), t5 = SS(k, 5);
  const tSame = AT(k, 6, "the same in both"), tDiff = AT(k, 6, "only the local rate");
  const bal = gP(GM, balloonOffAtH(1)), bal0 = gP(GM, balloonOffAtH(0));
  const x1318 = gX(GM, W.iso_1318_x0_km);
  const gP1 = fin(f, t1 + 10, 24), gM = fin(f, tLoc - 10, 24), gU = fin(f, t3 + 10, 24);
  const plA = Math.max(pulse(f, tAdv, 24), pulse(f, tSame, 30)), plL = pulse(f, tDiff, 30);
  const FR = W.frozen_mdt, adv = W.three_rates_K_h.values[0];
  return (
    <Scene>
      <Svg>
        <ClipMap id="clip19c">
          <TMap shift={W.iso_shift_km[60]} />
          <Isos xs={ISO_X.map((xs) => xs[60])} Ts={ISO_T} />
          <line x1={x1318} y1={GM.my} x2={x1318} y2={GM.my + GM.h * GM.km} stroke="#ffffff" strokeWidth={4} strokeDasharray="6 12" opacity={0.8 * fin(f, t1)} />
        </ClipMap>
        {ISO_X.map((xs, i) => (xs[60] > 25 && xs[60] < GM.w - 35 ? <Lbl key={i} x={gX(GM, xs[60])} y={GM.my - 34} t={`${ISO_T[i]} °C`} c={C.ink} s={T.floor} a="middle" /> : null))}
        <MapFrame />
        <ColourBar />
        {/* M2 (review 5): the ghost label sits inside the map, left of the dashed line */}
        <Lbl x={x1318 - 16} y={GM.my + 34} t={`${W.T_under_balloon[1].toFixed(2)} °C, an hour ago`} c={C.ink} s={T.floor} a="end" o={fin(f, t1 + 10)} />
        <PoleThermometer x={PINS[0]} y={PINS[1]} s={1.0} />
        <Dash p={bal0} q={bal} c={C.first} w={4} d="8 8" />
        <BalloonThermometer x={bal[0]} y={bal[1]} s={0.6} />
        <Lbl x={bal[0] + 34} y={bal[1] - 110} t={`${W.T_balloon_field_C[60].toFixed(2)} °C`} c={C.first} s={T.key + 14 * pulse(f, 6, 24) + 14 * fin(f, t5)} />
        <g opacity={fin(f, t1 + 20)}>
          {/* S7: bracket under the balloon's 1-h move, label right beside it */}
          <Bracket p={[bal0[0], 640]} q={[x1318, 640]} c={C.ink} />
          <Lbl x={x1318 + 16} y={640} t={`${W.across_km_1h.toFixed(0)} km across`} c={C.ink} s={T.key} a="start" />
        </g>
        {/* the upper row: map frozen (Case 1), with the s17b graph as a thumbnail */}
        <g opacity={fin(f, t3)}>
          <SunGlyph x={1136} y={270} s={0.8} />
          <Lbl x={1170} y={270} t="map frozen" c={C.key} s={T.key} />
          <TimeGraph thumb x={1130} y={330} w={210} h={100} Tr={GTR} series={[
            { t: TH, T: W.frozen_pole_T_C as number[], upto: 3, c: C.local, dash: true },
            { t: TH, T: W.frozen_balloon_T_C as number[], upto: 3, c: C.first },
          ]} />
        </g>
        <Balance o={fin(f, t3)} x0={BAL_X0} y={BU_Y} scale={BAL_SC} plus={FR.advective_K_s * 3600} minus={FR.local_K_s * 3600} gPlus={gU} gMinus={1} id="bal19u" h={40} />
        <Lbl x={BAL_X0 + 150} y={BU_Y - 52} t={`+${adv[0].toFixed(2)}`} c={C.first} s={T.floor} a="middle" o={gU} />
        <Lbl x={BAL_X0 - 16} y={BU_Y} t="0" c={C.local} s={T.floor} a="end" o={gU} />
        {/* the lower row: map slides (Case 2) */}
        <Lbl x={1110} y={478} t="map slides" c={C.key} s={T.key} o={fin(f, t1)} />
        <Balance o={fin(f, t1)} x0={BAL_X0} y={BL_Y} scale={BAL_SC} plus={W.balance_moved_K[0]} minus={W.balance_local_K[0]} gPlus={gP1} gMinus={gM} id="bal19" />
        <Lbl x={BAL_X0 + 180} y={BL_Y - 70} t={`+${W.balance_moved_K[0].toFixed(2)}`} c={C.first} s={T.key} a="middle" o={gP1} />
        <Lbl x={BAL_X0 + 180} y={BL_Y + 90} t="advection term" c={C.first} s={T.key} a="middle" o={gP1} />
        <Lbl x={BAL_X0 - 180} y={BL_Y - 70} t={`−${Math.abs(W.balance_local_K[0]).toFixed(2)}`} c={C.neg} s={T.key} a="middle" o={gM} />
        <Lbl x={BAL_X0 - 180} y={BL_Y + 90} t="local rate" c={C.local} s={T.key} a="middle" o={gM} />
        <g opacity={gM}><PoleThermometer x={1150} y={720} s={0.6} /></g>
        {/* pulses: the two teal bars (same advection term), then the two local bars (local rate differs) */}
        {plA > 0 ? <g opacity={plA} fill="none" stroke={C.gold} strokeWidth={5}>
          <rect x={BAL_X0 - 4} y={BU_Y - 24} width={300 * gU + 8} height={48} /><rect x={BAL_X0 - 4} y={BL_Y - 32} width={300 * gP1 + 8} height={64} />
        </g> : null}
        {plL > 0 ? <g opacity={plL} fill="none" stroke={C.gold} strokeWidth={5}>
          <line x1={BAL_X0 - 30} y1={BU_Y} x2={BAL_X0 - 4} y2={BU_Y} /><rect x={BAL_X0 - 304} y={BL_Y - 32} width={300} height={64} />
        </g> : null}
        <Lbl x={120} y={772} t="same advection term" c={C.key} s={T.key} o={fin(f, tSame)} />
        <Lbl x={120} y={836} t="local rate differs" c={C.key} s={T.key} o={fin(f, tDiff)} />
      </Svg>
      <TeX s={EQ_TF} x={1475} y={130} size={T.calc} ax={0.5} o={fin(f, t5 - 4)} />
      <TeX s={EQ_BALF} x={BAL_X0 + 150} y={BU_Y + 64} size={T.floor + 4} ax={0.5} o={fin(f, AT(k, 5, "They cancel") + 6)} />
      <TeX s={rep(rep(EQ_BAL, "-0.18", String.raw`\textcolor{${C.neg}}{-0.18}`), "+ 0.18", String.raw`+ \textcolor{${C.first}}{0.18}`)} x={BAL_X0} y={808} size={T.key} ax={0.5} o={fin(f, AT(k, 5, "They cancel") + 6)} />
    </Scene>
  );
};

// ================================================================ s19d the three rates side by side (orchestrator, V7)
const S19D: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19d_three_rates");
  const R3 = W.three_rates_K_h.values as number[][];
  const colX = [1130, 1590], rowY = [330, 500, 670];
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const tV = [[AT(k, 2, "plus point one eight"), AT(k, 2, "in both cases")],
    [AT(k, 3, "zero when"), AT(k, 3, "minus point one eight")],
    [AT(k, 4, "plus point one eight when"), AT(k, 4, "and zero in our story")]];
  const dim = (r: number) => (r === 0 ? 1 : 1 - 0.65 * fin(f, t5, 14));
  const fmt = (v: number) => (Math.abs(v) < 5e-4 ? "0" : v > 0 ? `+${v.toFixed(2)}` : `−${Math.abs(v).toFixed(2)}`);
  const colr = (v: number) => (Math.abs(v) < 5e-4 ? C.local : v > 0 ? C.first : C.neg);
  const sym = [String.raw`\mathbf v\cdot\nabla T`, EQ_DTDT_LOCAL, EQ_DTDT_MAT];
  const words = ["advection term", "local rate", "material derivative"];
  const run = clamp((f - t1 - 20) / 70, 0, 1);
  return (
    <Scene>
      <Svg>
        <Lbl x={1840} y={80} t="K per hour" c={C.muted} s={T.floor} a="end" o={fin(f, 6)} />
        <g opacity={fin(f, 6)}>
          <SunGlyph x={colX[0] - 190} y={190} s={0.9} />
          <Lbl x={colX[0]} y={190} t="map frozen" c={C.key} s={T.key} a="middle" />
          {[0, 1, 2].map((i) => <line key={i} x1={colX[1] - 200 + i * 18} y1={168} x2={colX[1] - 200 + i * 18} y2={212} stroke="#ffffff" strokeWidth={3} />)}
          <Lbl x={colX[1]} y={190} t="our story" c={C.key} s={T.key} a="middle" />
        </g>
        {[0, 1, 2].map((r) => (
          <g key={r} opacity={fin(f, 6 + 8 * r) * dim(r)}>
            {r === 0 ? <Arrow p={[110, rowY[0] + 20]} q={[190, rowY[0] - 30]} color={C.first} w={8} head={26} /> : null}
            {r === 1 ? <PoleThermometer x={150} y={rowY[1] + 50} s={0.75} /> : null}
            {r === 2 ? <BalloonThermometer x={150} y={rowY[2] + 50} s={0.5} /> : null}
            <Lbl x={460} y={rowY[r]} t={words[r]} c={r === 0 ? C.first : r === 1 ? C.local : C.first} s={T.key + 8 * (r === 0 ? pulse(f, t1, 24) : r === 1 ? pulse(f, t3, 24) : pulse(f, t4, 24))} />
            <Lbl x={460} y={rowY[r] + 52} t={["the wind", "fixed thermometer", "balloon"][r]} c={C.muted} s={T.floor} />
            {[0, 1].map((cI) => <Lbl key={cI} x={colX[cI]} y={rowY[r]} t={fmt(R3[r][cI])} c={colr(R3[r][cI])} s={84} a="middle" o={fin(f, tV[r][cI], 10)} />)}
          </g>
        ))}
        {/* S2: a tiny wind arrow crossing three isotherm ticks beside the advection row */}
        <g opacity={fin(f, t1) * fout(f, t2 + 30)}>
          {[0, 1, 2].map((i) => <line key={i} x1={860 + i * 40} y1={rowY[0] - 32} x2={860 + i * 40} y2={rowY[0] + 32} stroke="#ffffff" strokeWidth={3} opacity={0.7} />)}
          <Arrow p={[830 + 110 * run, rowY[0]]} q={[880 + 110 * run, rowY[0]]} color={C.first} w={6} head={20} halo={false} />
        </g>
        <Lbl x={colX[0] + 120} y={rowY[0]} t="same" c={C.key} s={T.floor} a="start" o={fin(f, tV[0][1] + 6) * fout(f, t3)} />
        {/* S5: row 3 = row 1 + row 2 in each column: a gold sum line and a '+' */}
        <g opacity={fin(f, AT(k, 4, "it's the local rate plus")) * dim(1)} stroke={C.gold} strokeWidth={4}>
          {colX.map((x, i) => <g key={i}>
            <line x1={x - 120} y1={(rowY[1] + rowY[2]) / 2 + 4} x2={x + 120} y2={(rowY[1] + rowY[2]) / 2 + 4} />
            <polyline points={`${x + 150},${rowY[0] - 30} ${x + 166},${rowY[0] - 30} ${x + 166},${rowY[1] + 30} ${x + 150},${rowY[1] + 30}`} fill="none" />
          </g>)}
        </g>
        {colX.map((x, i) => <Lbl key={i} x={x + 186} y={(rowY[0] + rowY[1]) / 2} t="+" c={C.gold} s={T.key} o={fin(f, AT(k, 4, "it's the local rate plus")) * dim(1)} />)}
        <Lbl x={960} y={820} t="degrees per hour from crossing isotherms" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 5, "think of"))} />
      </Svg>
      {[0, 1, 2].map((r) => <TeX key={r} s={sym[r]} x={230} y={rowY[r]} size={T.calc} c={r === 1 ? C.local : C.first} o={fin(f, 6 + 8 * r) * dim(r)} />)}
      <TeX s={EQ_TF} x={960} y={80} size={60} ax={0.5} o={fin(f, AT(k, 4, "is what the balloon"))} />
    </Scene>
  );
};

// ================================================================ s20 twice as steep
const [ST_L, ST_R] = splitEq(EQ_STEEP);
const [V20_L, V20_R] = splitEq(EQ_V20), V20P = eqPieces(V20_R);
const [V20_A, V20_B] = V20P[0].split(String.raw`\times2.00`);
const [KH2_L, KH2_R] = splitEq(EQ_KH2);
const S20: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20_twice_steep");
  // U-M4.3 (fix loop 3): new sentence 2 = |∇T| by Pythagoras on the steep map; later sentences shift by one
  const t1 = SS(k, 1), tL = SS(k, 2), t2 = SS(k, 3), t3 = SS(k, 4), tTw = AT(k, 4, "twice as fast"), t4 = SS(k, 5);
  const steep = fin(f, 10, 24);
  const h = hoursFrom(f, t3 + 10, 1);
  const shift = atH(W.iso_shift_km as number[], h);
  const isoS = ISS_X.map((xs) => atH(xs, h));
  const Tp = atH(W.T_pole_steep_field_C as number[], h);
  const GLk = GL * (1 + fin(f, t1, 20));
  const i13 = ISS_T.indexOf(13);
  const rows: CalcRow[] = [
    { lhs: ST_L, rhs: ST_R, at: t1 + 6, c: C.second, h: 170 },
    { lhs: LNG2_L, rhs: LNG2_P[0], at: tL, c: C.second, lc: C.second, h: 92, size: 56 },
    { rhs: LNG2_P[1], at: AT(k, 2, "that same number"), cont: true, c: C.second, h: 84, size: 56 },
    { lhs: V20_L, rhs: V20_A, at: t3, h: 88 },
    { rhs: String.raw`{}\times2.00${V20_B}`, at: t3 + 20, cont: true, h: 88 },
    { rhs: V20P[1], at: t3 + 40, cont: true, h: 88 },
    { rhs: "{}" + KH2_L.slice(KH2_L.indexOf(String.raw`\times3600`)), at: AT(k, 4, "to point three six"), h: 88 },
    { rhs: rep(KH2_R, "0.36", String.raw`\mathbf{0.36}`), at: AT(k, 4, "to point three six") + 14, c: C.first, ul: tTw, cont: true, h: 88 },
  ];
  return (
    <Scene>
      <Svg>
        <ClipMap id="clip20">
          <TMap o={1 - steep} />
          <TMap steep shift={shift} o={steep} />
          <Isos xs={ISO14_X} Ts={ISO14_T} io={() => 1 - steep} />
          <Isos xs={isoS} Ts={ISS_T} io={() => steep} s={T.floor} every={2} />
        </ClipMap>
        {isoS.map((xk, i) => (i % 2 === 1 && xk > 25 && xk < GM.w - 35 ? <Lbl key={i} x={gX(GM, xk)} y={GM.my - 34} t={`${ISS_T[i]}`} c={C.ink} s={T.floor} a="middle" o={steep} /> : null))}
        <MapFrame />
        <ColourBar />
        <g opacity={fin(f, 30)}>
          <Bracket p={[gX(GM, isoS[i13 - 2]), 620]} q={[gX(GM, isoS[i13 - 1]), 620]} c={C.ink} />
          <Lbl x={gX(GM, isoS[i13 - 2]) - 14} y={580} t="1 °C per 50 km" c={C.ink} s={T.key} a="end" />
        </g>
        {/* S14/S8 (review 5): the wind's shadow as its own arrow under ∇T; "5.00 m/s" in warm white with a dark outline */}
        <Dash p={VTIP} q={[SHT[0], ACR_Y]} w={4} />
        <Arrow p={[PINS[0], ACR_Y]} q={[SHT[0], ACR_Y]} color={C.first} w={8} head={30} />
        <Arrow p={PINS} q={[PINS[0] + GLk, PINS[1]]} color={C.second} />
        <Arrow p={PINS} q={VTIP} color={C.first} />
        <Lbl x={PINS[0] - 20} y={ACR_Y + 50} t={`${W.shadow_steep_m_s.toFixed(2)} m/s`} c={C.key} s={T.key} a="start" />
        <Lbl x={PINS[0] + 250} y={ACR_Y + 50} t="same" c={C.key} s={T.key} o={fin(f, t2 + 10)} />
        <Lbl x={PINS[0] + 225} y={PINS[1] - 52} t="× 2" c={C.key} s={T.key + 16 * pulse(f, AT(k, 6, "length of grad T"), 24)} a="middle" o={fin(f, t1 + 30)} />
        <g opacity={fin(f, t4)}><Sled x={(PINS[0] + SHT[0]) / 2 - 10} y={PINS[1] + 190} s={0.4} /></g>
        <PoleThermometer x={PINS[0]} y={PINS[1]} s={1.0} />
        <g opacity={fin(f, t3)}>
          <PoleThermometer x={GM.mx + 30} y={830} s={0.6} />
          <Lbl x={GM.mx + 80} y={790} t={`${Tp.toFixed(2)} °C`} c={C.local} s={T.calc} />
          <ClockText x={500} y={790} h={h} />
        </g>
        <Lbl x={1840} y={790} t="twice as fast" c={C.key} s={T.key} a="end" o={fin(f, tTw)} />
      </Svg>
      <GradLabel x={PINS[0] + GLk - 80} y={PINS[1] - 52} />
      <CalcStack f={f} x={1270} y={50} rows={rows} maxLines={2} size={62} />
    </Scene>
  );
};

// ================================================================ s21 recap
const MiniPair: React.FC<{ x: number; y: number; u: number; rect?: boolean }> = ({ x, y, u, rect }) => {
  const Pm = mkP(x, y, u), Om = Pm(0, 0);
  return (
    <g>
      {rect ? <Bracket p={Om} q={Pm(...B)} off={-Math.max(10, u * 0.3)} c={C.second} w={4} /> : null}
      {rect ? <Band p={Om} q={Pm(...PAB)} color={C.first} w={14} /> : null}
      <Arrow p={Om} q={Pm(...B)} color={C.second} w={8} head={28} />
      <Arrow p={Om} q={Pm(...A)} color={C.first} w={8} head={28} />
    </g>
  );
};
const MiniPQ: React.FC<{ x: number; y: number; i: number; k?: number }> = ({ x, y, i, k = 1 }) => {
  const q = same.q[i] as Pt;
  return (
    <g>
      <Arrow p={[x, y]} q={[x + 240 * k, y]} color={C.first} w={10 * k + 2} head={34 * k + 6} />
      <Arrow p={[x, y]} q={[x + q[0] * 80 * k, y - q[1] * 80 * k]} color={C.second} w={(i === 0 ? 16 : 10) * k + 2} head={34 * k + 6} />
    </g>
  );
};
const RECAP_ICONS = (o: number[]) => {
  const xs = [260, 600, 940, 1280, 1620];
  const words = ["a number", "shadow × length", "+  0  −", "one part", "work · weather"];
  return xs.map((x, i) => (
    <g key={i} opacity={o[i]}>
      {i === 0 ? <MiniPair x={x - 60} y={760} u={22} /> : null}
      {i === 1 ? <MiniPair x={x - 30} y={770} u={20} rect /> : null}
      {i === 2 ? <><MiniPQ x={x - 120} y={735} i={0} k={0.4} /><MiniPQ x={x + 70} y={765} i={2} k={0.4} /></> : null}
      {i === 3 ? <><Arrow p={[x - 70, 770]} q={[x + 10, 690]} color={C.first} w={8} head={26} /><Band p={[x - 70, 770]} q={[x + 10, 770]} color={C.first} w={12} /></> : null}
      {i === 4 ? <><Sled x={x - 60} y={770} s={0.35} /><PoleThermometer x={x + 70} y={770} s={0.6} /></> : null}
      {/* S13 (review 5): the strip words were below phone legibility; the icons carry the beats */}
      {void words[i]}
    </g>
  ));
};
const S21: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21_recap");
  const t = [0, 1, 2, 3, 4, 5, 6].map((j) => SS(k, j));
  const beat = (j: number, jEnd?: number) => fin(f, t[j] + (j === 0 ? 4 : 0), 10) * (jEnd !== undefined ? fout(f, t[jEnd] - 6, 10) : 1);
  const [D2_L, D2_R] = splitEq(EQ_DEF2N), D2P = eqPieces(D2_R);
  const R1_PARTS: Part[] = [{ t: "=" }, { t: String.raw`(|\mathbf a|\cos\theta)`, c: C.first, u: { w: String.raw`\small\text{shadow}`, c: C.first } },
    { t: String.raw`\,|\mathbf b|`, c: C.second, u: { w: String.raw`\text{length}`, c: C.second } }];
  if (`${splitEq(EQ_R1)[0]} ${plainOf(R1_PARTS)}` !== rep(EQ_R1, String.raw`\,|`, String.raw` \,|`)) throw new Error("s21 parts ≠ EQ_R1");
  const icons = [beat(0), beat(1), beat(2), beat(5), beat(6)];
  const signs = [{ j: 2, s: "+", w: "same way" }, { j: 3, s: "0", w: "right angle" }, { j: 4, s: "−", w: "opposite" }];
  return (
    <Scene>
      <Svg>
        <g opacity={beat(0, 1)}><MiniPair x={200} y={560} u={80} /></g>
        <Keyword f={f} text="a number" at={[1100, 470]} appear={AT(k, 0, "giving a number")} out={t[1] - 6} targets={[]} />
        <g opacity={beat(1, 2)}><MiniPair x={330} y={600} u={90} rect /></g>
        {signs.map(({ j, s, w }, i) => (
          <g key={s} opacity={fin(f, t[j], 10) * fout(f, t[5] - 6, 10)}>
            <MiniPQ x={260 + i * 560} y={360} i={i} />
            <Lbl x={360 + i * 560} y={520} t={s} c={i === 2 ? C.neg : C.ink} s={T.hero} a="middle" />
            <Lbl x={360 + i * 560} y={630} t={w} c={C.key} s={T.key} a="middle" />
          </g>
        ))}
        <g opacity={beat(5, 6)}>
          <Arrow p={[300, 560]} q={[540, 240]} color={C.first} />
          <Band p={[300, 560]} q={[480, 560]} color={C.first} w={22} />
          <Arrow p={[300, 560]} q={[380, 560]} color={C.second} w={10} head={34} />
          <Lbl x={1100} y={460} t="eastward part" c={C.key} s={T.key} />
        </g>
        <g opacity={beat(6)}>
          <Sled x={260} y={320} s={0.8} />
          <Arrow p={[360, 320]} q={[470, 140]} color={C.first} />
          <PoleThermometer x={330} y={640} s={1.0} />
          <Lbl x={1050} y={560} t="fixed thermometer" c={C.local} s={T.key} />
          <Lbl x={1050} y={630} t={`−${Math.abs(W.dTdt_K_h).toFixed(2)} K per hour`} c={C.neg} s={T.key} />
        </g>
        {RECAP_ICONS(icons)}
      </Svg>
      <TeX s={`${D2_L} ${D2P[1]} ${D2P[2]}`} x={1100} y={360} size={T.calc} o={beat(0, 1)} />
      <Layered parts={R1_PARTS} layers={[base(), { u: [1, 2], o: 1 }]} x={1260} y={300} size={T.calc} ay={0} o={beat(1, 2)} />
      <TeX s={splitEq(EQ_R1)[0]} x={1240} y={300} size={T.calc} ax={1} ay={0} o={beat(1, 2)} />
      <TeX s={EQ_R3} x={1100} y={360} size={T.calc} o={beat(5, 6)} />
      <TeX s={EQ_R4} x={1050} y={250} size={T.calc} o={beat(6)} />
      <TeX s={EQ_R5} x={1050} y={420} size={T.calc} o={beat(6)} />
    </Scene>
  );
};

// ================================================================ s22 end card (no URLs, no names: U-M3.23, U-M3.24, G6)
const S22: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22_end");
  const t1 = SS(k, 1), t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const thumb = (x: number, i: number) => (
    <g key={i} opacity={0.75}>
      <rect x={x - 150} y={150} width={300} height={190} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
      {i === 0 ? <><Arrow p={[x - 90, 300]} q={[x + 60, 270]} color={C.first} w={8} head={26} halo={false} /><Arrow p={[x - 90, 300]} q={[x - 50, 180]} color={C.second} w={8} head={26} halo={false} /></> : null}
      {i === 1 ? <><polygon points={`${x - 90},${300} ${x + 40},${300} ${x + 90},${230} ${x - 40},${230}`} fill="rgba(142,111,216,0.3)" stroke="#8e6fd8" strokeWidth={3} /><Arrow p={[x - 90, 300]} q={[x - 90, 170]} color="#8e6fd8" w={8} head={26} halo={false} /></> : null}
      {i === 2 ? <>{Array.from({ length: 12 }, (_, j) => <rect key={j} x={x - 120 + j * 20} y={170} width={20.5} height={150} fill={tColor(6 + j)} />)}<Arrow p={[x - 60, 245]} q={[x + 60, 245]} color={C.second} w={8} head={26} halo={false} /></> : null}
      {i === 3 ? <><circle cx={x} cy={245} r={75} fill="#22406a" stroke={C.ink} strokeWidth={3} /><ellipse cx={x} cy={245} rx={75} ry={24} fill="none" stroke={C.muted} strokeWidth={3} /><ellipse cx={x} cy={245} rx={28} ry={75} fill="none" stroke={C.muted} strokeWidth={3} /></> : null}
    </g>
  );
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, 6)}>{[420, 760, 1100, 1440].map((x, i) => thumb(x, i))}</g>
        <Lbl x={960} y={420} t="a series of maths tutorials" c={C.key} s={T.calc} a="middle" o={fin(f, 10)} />
        <Lbl x={960} y={515} t="atmospheric science · meteorology · fluid dynamics" c={C.key} s={T.key} a="middle" o={fin(f, t1)} />
        <g opacity={fin(f, t2)}>
          <Notebook x={560} y={660} s={0.55} />
          <Lbl x={630} y={660} t="dot-product notebook" c={C.ink} s={T.calc} />
        </g>
        <g opacity={fin(f, tOther)}>
          {[0, 1, 2].map((i) => <Notebook key={i} x={420 + i * 34} y={806 - i * 10} s={0.32} c={[C.second, "#8e6fd8", C.muted][i]} o={0.9} />)}
          <Lbl x={560} y={800} t="notebooks for the other maths concepts" c={C.key} s={T.key} />
        </g>
      </Svg>
    </Scene>
  );
};

const SCENES = [S00, S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13, S14, S15, S16A, S16B, S17, S17B, S18, S19A, S19B, S19C, S19D, S20, S21, S22];
if (SCENES.length !== sc.length) throw new Error(`${SCENES.length} scene components but ${sc.length} scenes in timing.json`);

export const DotProductWhy: React.FC<{ audio?: string }> = ({ audio = "narration_music.wav" }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {SCENES.map((S, k) => (
      <Sequence key={sc[k].id} name={sc[k].id} from={CUT[k]} durationInFrames={LEN(k) + (k < SCENES.length - 1 ? XF : 0)}><S /></Sequence>
    ))}
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
