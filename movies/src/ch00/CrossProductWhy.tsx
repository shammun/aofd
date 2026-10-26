import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { ramp } from "../house";
import timing from "../../ch00/ch00_cross_product_why/timing.json";
import pair from "../../ch00/ch00_cross_product_why/data/pair.json";
import sweep from "../../ch00/ch00_cross_product_why/data/sweep.json";
import door from "../../ch00/ch00_cross_product_why/data/door.json";
import rhr from "../../ch00/ch00_cross_product_why/data/rhr.json";
import cases from "../../ch00/ch00_cross_product_why/data/cases.json";
import torque from "../../ch00/ch00_cross_product_why/data/torque.json";
import turning from "../../ch00/ch00_cross_product_why/data/turning.json";
import earth from "../../ch00/ch00_cross_product_why/data/earth.json";
import cori from "../../ch00/ch00_cross_product_why/data/coriolis.json";
import paths from "../../ch00/ch00_cross_product_why/data/paths.json";
import geo from "../../ch00/ch00_cross_product_why/data/geo.json";
import windsMean from "../../ch00/ch00_cross_product_why/data/winds_mean.json";
import ian from "../../ch00/ch00_cross_product_why/data/ian.json";
import idai from "../../ch00/ch00_cross_product_why/data/idai.json";
import ianRing from "../../ch00/ch00_cross_product_why/data/ian_ring.json";
import idaiRing from "../../ch00/ch00_cross_product_why/data/idai_ring.json";
import storm from "../../ch00/ch00_cross_product_why/data/storm.json";
import in30 from "../../ch00/ch00_cross_product_why/data/inertial30.json";
import trG from "../../ch00/ch00_cross_product_why/data/trails_global.json";
import trI from "../../ch00/ch00_cross_product_why/data/trails_ian.json";
import trD from "../../ch00/ch00_cross_product_why/data/trails_idai.json";
import ne110 from "../../ch00/ch00_cross_product_why/data/real/ne_lines_110m.json";
import ne50 from "../../ch00/ch00_cross_product_why/data/real/ne_lines_50m.json";
import wx from "../../ch00/ch00_dot_product_why/data/weather.json";
import { geoConicConformal } from "d3-geo";
import { CurvedLink } from "../house/kit/extras";
import { C, T } from "../house/kit/type";
import { Arc, Arrow, Band, Bracket, Dash, Grid, Lbl, Pt, RightTick, Strike, Svg, add, clamp, lerp, mkP, pulse, textW, unit } from "../house/kit/draw";
import { CalcRow, CalcStack, Layered, Part, TeX, col, eqPieces, plainOf, rep, splitEq, texHtml } from "../house/kit/tex";
import { Keyword, TipLabel, placeLabels } from "../house/kit/notes";
import { RiseText, TitleGradient } from "../house/kit/title";
import { Check, ClockGlyph, Notebook } from "../house/kit/icons";
import { CamState, D2R, OrbitKey, V3, add3, cross3, dot3, easeIO, len3, lerp3, mul3, norm3, orbitCam, orbitPath, projector, sub3 } from "./kit_cp/cam";
import { Arrow3D, Ball3D, Plane3D, Quad3D, Rod3D, View3D } from "./kit_cp/three3d";
import { HAND_PTS, Hand3D, POSE, fingerTipLocal, handPoint, handQuat, slerpQ } from "./kit_cp/hand";
import { BottleCap3D, Door3D, Screw3D, Spanner3D } from "./kit_cp/objects";
import { Arc3, CircleCross, CircleDot, DoorIcon, FloorGrid, GlobeIcon, L3, MinusGlyph, Observer, Poly3, Seg3, TailSketch, Tick3, TipL3, TipSketch, TurntableIcon, VIOLET } from "./kit_cp/svg3d";
import { GlobeCam, GlobeMesh, LatCircle, SurfArrow, Streaks, band, coastPath, decodeTrails, enAt, gcArrowPts, globeCam, globeMatrix, globePath, globeProj, Graticule, ll, llPath, useBin, useTex } from "./kit_cp/globe";

/**
 * Chapter 0A movie 2 "The cross product: an arrow at right angles, and why the wind turns", VERSION 1
 * (movies/ch00/ch00_cross_product_why/storyboard.yaml, 49 scenes), 1920×1080, 30 fps; length = timing.json + 2.5-s hold.
 * House style (movies/HOUSE_STYLE.md, binding): the s00 title is the only heading; keywords, symbols and numbers on
 * screen, the voice explains; no boxes, labels, references, badges or URLs; every reveal tied to its sentence (SS/AT
 * from the measured timing.json); caption band y 880–1040 empty; text ≥ 44 px (the kit throws below).
 * One new colour role: violet #a58be0 = the result of a cross product and rotation (a × b, p × q, τ, Ω, k, geostrophic).
 * 3-D: @remotion/three ThreeCanvas (ANGLE), every camera and motion a pure function of the frame (kit_cp/cam.ts), the
 * SVG overlays projected through the same camera. Every number is read from data/*.json written by
 * movies/data/build_ch00_cross_product_why.py from tested fluidpy functions; this file only indexes and interpolates.
 * The storyboard's LaTeX strings appear verbatim below as constants (equations QA gate).
 */

export const CPW_FPS = 30;
const FPS = CPW_FPS;
const sc = timing.scenes;
const HOLD = 75; // 2.5-s silent end-card hold
const XF = 10; // cross-fade frames between scenes
export const CPW_FRAMES = timing.total_frames + HOLD;
const IDS = ["s00_title", "s01_hook", "s02_dot_recall", "s03_door", "s04_left_right", "s05_axes", "s06_recipe", "s07_worked", "s08_sine",
  "s09_area", "s10_right_angles", "s11_rhr_curl", "s12_rhr_flat", "s13_rhr_screw", "s14_rhr_cycle", "s15_rhr_swap", "s16_rhr_screen",
  "s17_rhr_views", "s18_cases", "s19_grid", "s20_torque", "s21_torque_axis", "s22_door_again", "s23_k_cross", "s24_spin",
  "s25_ground_speed", "s26_coriolis_effect", "s27_coriolis_term", "s28_f", "s29_turn_rule", "s30_coriolis_size", "s31_globe_paths",
  "s32_reanalysis", "s33_trades", "s34_westerlies", "s35_storms", "s36_ian", "s37_idai", "s38_spin_sign", "s39_isobars",
  "s40_pressure_push", "s41_adjust", "s42_geo_equation", "s43_geo_pieces", "s44_geo_numbers", "s45_storm_map", "s46_real_winds",
  "s47_recap", "s48_end"] as const;
if (sc.length !== IDS.length || sc.some((s, i) => s.id !== IDS[i])) throw new Error("timing.json scenes ≠ the v1 scene list");
const K = (id: (typeof IDS)[number]) => IDS.indexOf(id);
const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
const END = [...CUT.slice(1), CPW_FRAMES];
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
const fout = (f: number, a: number, n = 10) => 1 - ramp(f, a, a + n);
const win = (f: number, a: number, b: number, n = 12) => fin(f, a, n) * fout(f, b, n);

// ---------------------------------------------------------------- equations (verbatim from the storyboard)
const EQ_PXQ = String.raw`\mathbf p\times\mathbf q`;
const EQ_DOT8 = String.raw`\mathbf a\cdot\mathbf b = 5\times1 + 1\times3 = 8`;
const EQ_COSSH = String.raw`\mathbf a\cdot\mathbf b = (|\mathbf a|\cos\theta)\,|\mathbf b|`;
const EQ_VGT = String.raw`\mathbf v\cdot\nabla T`;
const EQ_RF0 = String.raw`\mathbf r\cdot\mathbf F = 0`;
const EQ_AB3 = String.raw`\mathbf a = (5,\ 1,\ 0),\qquad \mathbf b = (1,\ 3,\ 0)`;
const EQ_COMP = String.raw`\mathbf a\times\mathbf b = (a_2b_3 - a_3b_2,\ a_3b_1 - a_1b_3,\ a_1b_2 - a_2b_1)`;
const EQ_AXB14 = String.raw`\mathbf a\times\mathbf b = (0,\ 0,\ 14)`;
const EQ_CX = String.raw`1\times0 - 0\times3 = 0`;
const EQ_CY = String.raw`0\times1 - 5\times0 = 0`;
const EQ_CZ = String.raw`5\times3 - 1\times1 = 15 - 1 = 14`;
const EQ_SIN = String.raw`|\mathbf a\times\mathbf b| = |\mathbf a|\,|\mathbf b|\sin\theta`;
const EQ_SINN = String.raw`|\mathbf a\times\mathbf b| = 5.099\times3.162\times0.868 \approx 14`;
const EQ_THS = String.raw`\theta = 60.3^\circ,\quad \sin\theta = 0.868`;
const EQ_COS = String.raw`\mathbf a\cdot\mathbf b = |\mathbf a|\,|\mathbf b|\cos\theta`;
const EQ_AREA = String.raw`\text{area} = 3.162\times4.43 \approx 14`;
const EQ_HEIGHT = String.raw`\text{height} = |\mathbf a|\sin\theta = 5.099\times0.868 \approx 4.43`;
const EQ_LENAREA = String.raw`|\mathbf a\times\mathbf b| = \text{area}`;
const EQ_PERPA = String.raw`(\mathbf a\times\mathbf b)\cdot\mathbf a = 0\times5 + 0\times1 + 14\times0 = 0`;
const EQ_PERPB = String.raw`(\mathbf a\times\mathbf b)\cdot\mathbf b = 0\times1 + 0\times3 + 14\times0 = 0`;
const EQ_XY = String.raw`\hat{\mathbf x}\times\hat{\mathbf y} = \hat{\mathbf z}`;
const EQ_YZ = String.raw`\hat{\mathbf y}\times\hat{\mathbf z} = \hat{\mathbf x}`;
const EQ_ZX = String.raw`\hat{\mathbf z}\times\hat{\mathbf x} = \hat{\mathbf y}`;
const EQ_ANTI = String.raw`\mathbf a\times\mathbf b = -\,\mathbf b\times\mathbf a`;
const EQ_YX = String.raw`\hat{\mathbf y}\times\hat{\mathbf x} = -\hat{\mathbf z}`;
const EQ_ZY = String.raw`\hat{\mathbf z}\times\hat{\mathbf y} = -\hat{\mathbf x}`;
const EQ_XZ = String.raw`\hat{\mathbf x}\times\hat{\mathbf z} = -\hat{\mathbf y}`;
const EQ_BXA = String.raw`\mathbf b\times\mathbf a = (0,\ 0,\ -14)`;
const EQ_DOTSYM = String.raw`\mathbf a\cdot\mathbf b = \mathbf b\cdot\mathbf a`;
const EQ_PQ0 = String.raw`\mathbf p\times\mathbf q = (0,\ 0,\ 0)`;
const EQ_PQ6 = String.raw`\mathbf p\times\mathbf q = (0,\ 0,\ 6)`;
const EQ_PQM6 = String.raw`\mathbf p\times\mathbf q = (0,\ 0,\ -6)`;
const EQ_TAU = String.raw`\boldsymbol\tau = \mathbf r\times\mathbf F`;
const EQ_T90 = String.raw`|\boldsymbol\tau| = 0.3\times50\times\sin 90^\circ = 15\ \mathrm{N\,m}`;
const EQ_T30 = String.raw`|\boldsymbol\tau| = 0.3\times50\times\sin 30^\circ = 7.5\ \mathrm{N\,m}`;
const EQ_KXU = String.raw`\mathbf k\times\mathbf u = (0\times0 - 1\times0,\ 1\times5 - 0\times0,\ 0) = (0,\ 5,\ 0)`;
const EQ_U500 = String.raw`\mathbf u = (5,\ 0,\ 0)`;
const EQ_OM = String.raw`\Omega = \frac{2\pi}{86\,164\ \mathrm s} \approx 7.29\times10^{-5}\ \mathrm{rad/s}`;
const EQ_OMH = String.raw`\Omega = \frac{2\pi}{23\ \mathrm h\ 56\ \mathrm{min}}`;
const EQ_VOR = String.raw`\mathbf v = \boldsymbol\Omega\times\mathbf r`;
const EQ_465 = String.raw`|\boldsymbol\Omega\times\mathbf r| = 7.29\times10^{-5}\times6\,371\,000\ \mathrm m \approx 465\ \mathrm{m/s}`;
const EQ_329 = String.raw`465\times\cos45^\circ \approx 329\ \mathrm{m/s}`;
const EQ_COR = String.raw`-2\boldsymbol\Omega\times\mathbf u`;
const EQ_CORDOT = String.raw`(-2\boldsymbol\Omega\times\mathbf u)\cdot\mathbf u = 0`;
const EQ_F = String.raw`f = 2\Omega\sin\varphi`;
const EQ_OMK = String.raw`\boldsymbol\Omega\cdot\mathbf k = \Omega\cos(90^\circ-\varphi) = \Omega\sin\varphi`;
const EQ_F45 = String.raw`f = 2\times7.29\times10^{-5}\times\sin45^\circ \approx 1.03\times10^{-4}\ \mathrm{s^{-1}}`;
const EQ_FKU = String.raw`-f\,\mathbf k\times\mathbf u`;
const EQ_FKUN = String.raw`|-f\,\mathbf k\times\mathbf u| = f\,|\mathbf u| = 1.03\times10^{-4}\ \mathrm{s^{-1}}\times10\ \mathrm{m/s} \approx 1.03\times10^{-3}\ \mathrm{m/s^2}`;
const EQ_PER = String.raw`\frac{2\pi}{f} \approx 16.9\ \mathrm h`;
const EQ_RXU = String.raw`\mathbf r\times\mathbf u`;
const EQ_PUSH = String.raw`-\frac{1}{\rho}\nabla p`;
const EQ_GEO = String.raw`\mathbf u = \frac{1}{f\rho}\,\mathbf k\times\nabla p`;
const EQ_BAL = String.raw`f\,\mathbf k\times\mathbf u = -\frac{1}{\rho}\nabla p`;
const EQ_BAL2 = String.raw`\mathbf k\times(f\,\mathbf k\times\mathbf u) = -\frac{1}{\rho}\,\mathbf k\times\nabla p`;
const EQ_KKU = String.raw`\mathbf k\times(\mathbf k\times\mathbf u) = -\mathbf u`;
const EQ_BAL3 = String.raw`-f\,\mathbf u = -\frac{1}{\rho}\,\mathbf k\times\nabla p`;
const EQ_UN = String.raw`|\mathbf u| = \frac{1.00\times10^{-3}}{1.24\times10^{-4}} \approx 8.1\ \mathrm{m/s}`;
const EQ_GPN = String.raw`|\nabla p| = \frac{400\ \mathrm{Pa}}{400\,000\ \mathrm m} = 1.00\times10^{-3}\ \mathrm{Pa/m}`;
const EQ_FRHO = String.raw`f\rho = 1.03\times10^{-4}\times1.2 \approx 1.24\times10^{-4}`;
const EQ_PA = String.raw`\mathrm{Pa} = \mathrm{kg\,m^{-1}\,s^{-2}}`;
/** on screen, 1/ρ and 1/(fρ) get a display fraction with padding so the bar is clearly wider than a minus sign */
const DF = (s: string) => s.split(String.raw`\frac{1}{\rho}`).join(String.raw`\dfrac{\,1\,}{\,\rho\,}`).split(String.raw`\frac{1}{f\rho}`).join(String.raw`\dfrac{\,1\,}{\,f\rho\,}`);

// ---------------------------------------------------------------- numbers inside the TeX strings = the data
const CHECK: [string, number, number, number][] = [
  ["a·b", pair.a_dot_b, 8, 1e-9], ["|a|", pair.norm_a, 5.099, 5e-4], ["|b|", pair.norm_b, 3.162, 5e-4], ["θ", pair.theta_deg, 60.3, 0.05],
  ["sin θ", pair.sin_theta, 0.868, 5e-4], ["a×b z", pair.a_cross_b[2], 14, 1e-9], ["a×b x", pair.a_cross_b[0], 0, 1e-12],
  ["b×a z", pair.b_cross_a[2], -14, 1e-9], ["terms z", pair.component_terms[2][0] - pair.component_terms[2][1], 14, 1e-9],
  ["N2 product", pair.display_sin_product, 13.995, 2e-3], ["N3 height", pair.height, 4.43, 5e-3], ["N3 area", pair.display_area_product, 14.008, 2e-3],
  ["shadow", pair.shadow_a_on_b, 2.53, 5e-4], ["(a×b)·a", pair.axb_dot_a, 0, 1e-12], ["(a×b)·b", pair.axb_dot_b, 0, 1e-12],
  ["sweep 90°", sweep.pxq_z[45], 6, 1e-9], ["sweep 270°", sweep.pxq_z[135], -6, 1e-9],
  ["cases 1", cases.p_cross_q[1][2], 6, 1e-9], ["cases 3", cases.p_cross_q[3][2], -6, 1e-9], ["cases 0", cases.p_cross_q[0][2], 0, 1e-12],
  ["τ 90°", torque.tau_z[0], 15, 1e-9], ["τ 30°", torque.tau_z[1], 7.5, 1e-9], ["τ 0°", torque.tau_z[2], 0, 1e-9],
  ["k×u", turning.k_cross_u[0][1], 5, 1e-12], ["k×u north", turning.k_cross_u[1][0], -5, 1e-12],
  ["Ω", earth.Omega, 7.29e-5, 5e-8], ["465", earth.ground_speed[0], 465, 0.5], ["329", earth.ground_speed[1], 329, 0.6],
  ["f45", cori.f[0], 1.03e-4, 5e-7], ["f eq", cori.f[1], 0, 1e-15], ["f SH", cori.f[2], -1.03e-4, 5e-7],
  ["push", cori.size_45N.accel, 1.03e-3, 5e-6], ["period", cori.size_45N.period_h, 16.9, 0.05],
  ["loop km", paths.inertial_diameter_km, 194, 0.5], ["geo u", geo.geo_speed, 8.08, 5e-3], ["fρ", geo.worked.f_rho, 1.24e-4, 5e-7],
  ["quotient", geo.worked.display_quotient, 8.06, 1e-9], ["landfall", ian.landfall_ms, 67, 0.2],
];
for (const [n, v, ref, tol] of CHECK) if (Math.abs(v - ref) > tol) throw new Error(`data ≠ storyboard TeX: ${n} = ${v}, TeX ${ref}`);
if (rhr.screen_map.xy !== "out" || rhr.screen_map.yx !== "in" || rhr.screen_map.yz !== "right" || rhr.screen_map.zy !== "left"
  || rhr.screen_map.zx !== "up" || rhr.screen_map.xz !== "down") throw new Error("rhr.json screen map ≠ storyboard s16");
for (const [k, b] of Object.entries(rhr.beats)) if (Math.abs((b as { det: number }).det - 1) > 1e-9) throw new Error(`hand basis ${k} not right-handed`);

// ---------------------------------------------------------------- small helpers
const ROT = VIOLET; // result of a cross product and rotation (new role, storyboard palette)
const Scene: React.FC<{ children: React.ReactNode; fadeIn?: boolean }> = ({ children, fadeIn = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.bg, opacity: fadeIn ? ramp(f, 0, XF) : 1 }}>{children}</AbsoluteFill>;
};
const sgn = (v: number, d = 2) => (Math.abs(v) < 0.5 * 10 ** -d ? (0).toFixed(d) : v > 0 ? `+${v.toFixed(d)}` : `−${Math.abs(v).toFixed(d)}`);
const interp = (x: number, xs: number[], ys: number[]) => {
  if (x <= xs[0]) return ys[0];
  if (x >= xs[xs.length - 1]) return ys[ys.length - 1];
  let i = 0;
  while (i < xs.length - 2 && xs[i + 1] < x) i++;
  const w = (x - xs[i]) / (xs[i + 1] - xs[i]);
  return ys[i] + (ys[i + 1] - ys[i]) * w;
};
const idx = (arr: number[][], u: number): number[] => {
  const x = clamp(u, 0, 1) * (arr.length - 1), i = Math.min(Math.floor(x), arr.length - 2), w = x - i;
  return arr[i].map((v, k) => v + (arr[i + 1][k] - v) * w);
};
/** coloured TeX of a constant (whole string) */
const ctex = (c: string, s: string) => String.raw`\textcolor{${c}}{${s}}`;

// ---------------------------------------------------------------- the pair (2-D plane of the last video, and its 3-D floor)
const A2 = pair.a as Pt, B2 = pair.b as Pt, A3 = pair.a3 as V3, B3 = pair.b3 as V3;
const DS = pair.display_scale; // 0.25: a × b drawn at a quarter of its length
const AXB3: V3 = [0, 0, pair.a_cross_b[2] * DS];
const P = mkP(240, 620, 135);
const O2 = P(0, 0), ATIP = P(...A2), BTIP = P(...B2), FOOT = P(...(pair.foot as Pt));
const PAIR_TIPS = placeLabels([
  { id: "a", tail: O2, tip: ATIP, text: "a", s: T.calc },
  { id: "b", tail: O2, tip: BTIP, text: "b", s: T.calc },
], [[O2, ATIP], [O2, BTIP]]);
const PairBase: React.FC<{ o?: number; showB?: number; gridO?: number }> = ({ o = 1, showB = 1, gridO = 1 }) => (
  <g opacity={o}>
    <Grid P={P} xr={[-1, 6]} yr={[-1, 4]} o={0.9 * gridO} />
    <Arrow p={O2} q={BTIP} color={C.second} o={showB} />
    <Arrow p={O2} q={ATIP} color={C.first} />
    <TipLabel p={PAIR_TIPS.a} c={C.first} />
    {showB > 0 ? <TipLabel p={PAIR_TIPS.b} c={C.second} o={showB} /> : null}
  </g>
);
/** the top-view camera whose floor projection equals the SVG pair plane P exactly (1 unit = 135 px, O at (240, 620)) */
const W3 = 1920, H3 = 1080, PP: Pt = [540, 450];
const TOP_K: OrbitKey = { f: 0, az: 270, el: 90, dist: 1080 / (135 * 2 * Math.tan(17.5 * D2R)), target: [(PP[0] - 240) / 135, (620 - PP[1]) / 135, 0], pp: PP };
const FLOOR_K: OrbitKey = { f: 0, az: 250, el: 30, dist: 11.8, target: [2.3, 1.3, 1.0], pp: [530, 500] };
const camOf = (keys: OrbitKey[], f: number): CamState => orbitCam(orbitPath(keys, f), PP);
const at = (k: OrbitKey, f: number): OrbitKey => ({ ...k, f });

/** the 3-D pair: floor grid (SVG under the canvas), a, b, optional a × b; overlays drawn by the caller */
const PairFloor: React.FC<{ st: CamState; gA?: number; gB?: number; axb?: number; axbNeg?: boolean; para?: number; oA?: number; oB?: number;
  grid?: number; children?: React.ReactNode; over?: React.ReactNode; under?: React.ReactNode; aCol?: string; bCol?: string; axbCol?: string; bTop?: boolean }> = ({
  st, gA = 1, gB = 1, axb = 0, axbNeg = false, para = 0, oA = 1, oB = 1, grid = 1, children, over, under, aCol = C.first, bCol = C.second, axbCol = ROT, bTop = false }) => {
  const pr = projector(st, W3, H3);
  const top: V3 = axbNeg ? [0, 0, -AXB3[2]] : AXB3;
  return (
    <>
      <Svg>
        <FloorGrid pr={pr} o={grid} />
        {under}
      </Svg>
      <View3D st={st}>
        <Quad3D pts={[[0, 0, 0.004], [A3[0], A3[1], 0.004], [A3[0] + B3[0], A3[1] + B3[1], 0.004], [B3[0], B3[1], 0.004]]} color={ROT} o={0.18 * para} />
        <Arrow3D from={[0, 0, 0]} to={B3} color={bCol} grow={gB} o={oB} onTop={bTop} />
        <Arrow3D from={[0, 0, 0]} to={A3} color={aCol} grow={gA} o={oA} />
        <Arrow3D from={[0, 0, 0]} to={top} color={axbCol} grow={axb} px={14} head={48} dash={axbNeg} />
        {children}
      </View3D>
      <Svg>{over}</Svg>
    </>
  );
};

/** the gold length bracket beside the a × b arrow (offset to the screen-right of the arrow for the usual views), "14" */
const BR_OFF: V3 = [1.0, -0.6, 0];
const Bracket3: React.FC<{ pr: ReturnType<typeof projector>; h: number; o?: number; t?: string }> = ({ pr, h, o = 1, t = "14" }) => {
  if (o <= 0) return null;
  const a = BR_OFF, b = add3(BR_OFF, [0, 0, h]), e: V3 = [-0.14, 0.14, 0];
  return (
    <g opacity={o}>
      <Seg3 pr={pr} a={a} b={b} c={C.gold} w={5} />
      <Seg3 pr={pr} a={a} b={add3(a, e)} c={C.gold} w={5} />
      <Seg3 pr={pr} a={b} b={add3(b, e)} c={C.gold} w={5} />
      <L3 pr={pr} at={add3(BR_OFF, [0, 0, h / 2])} t={t} c={C.gold} s={T.key} dx={44} />
    </g>
  );
};

// ================================================================ s00 title (HOUSE_STYLE §3)
const TBOX = { x: 1140, y: 180, w: 700, h: 456 };
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  const tMet = AT(k, 0, "meteorology"), tEasy = AT(k, 0, "the easy way");
  const u = easeIO(clamp((f - 6) / (tMet - 6), 0, 1));
  const qv = idx(sweep.q_xyz as number[][], u) as V3;
  const pz = interp(u * 360, sweep.theta_deg, sweep.pxq_z);
  const oA = fin(f, 4, 10) * fout(f, tMet, 12), oB = fin(f, tMet, 12);
  const camA = orbitCam({ az: 235 + 40 * u, el: 26, dist: 7.4, target: [0.6, 0.1, 0.55], pp: [TBOX.w / 2, TBOX.h / 2 + 30] }, [0, 0]);
  const prA = projector(camA, TBOX.w, TBOX.h, TBOX.x, TBOX.y);
  const PS = 0.3; // display scale of p × q in the title
  const neg = pz < -0.005, zero = Math.abs(pz) < 0.005;
  const top: V3 = [0, 0, pz * PS];
  // Part B: the mini globe turning west → east, a wind arrow at 45°N, 30°W following the inertial track (17 h in ~4 s)
  const hB = clamp((f - tMet) / (4 * FPS), 0, 1);
  const spin = -0.35 + 0.6 * clamp((f - tMet) / (LEN(k) - tMet), 0, 1);
  const M = globeMatrix(spin, 23.4);
  const GB = { x: 1080, y: 100, w: 760, h: 660 };
  const gc = globeCam({ lat: 32, lon: -32, dist: 3.55, pp: [GB.w / 2, GB.h / 2] }, [0, 0]);
  const G = globeProj(gc, GB.w, GB.h, GB.x, GB.y, M);
  const tex = useTex(staticFile("cp/bmng.jpg"));
  const n = Math.max(2, Math.round(hB * 0.42 * (paths.nh_track.length - 1)));
  const trk = (paths.nh_track as number[][]).slice(0, n).map(([la, lo]) => [45 + (la - 45) * 7, -30 + (lo + 30) * 7] as [number, number]);
  const pzS = 1 + 0.06 * pulse(f, tEasy, 12);
  return (
    <Scene fadeIn={false}>
      <Svg>
        <defs><TitleGradient id="ttl" x1={100} x2={760} /></defs>
        <RiseText f={f} t="The cross" x={100} y={250} s={150} at={2} fill="url(#ttl)" />
        <RiseText f={f} t="product" x={100} y={410} s={150} at={12} fill="url(#ttl)" />
        <g transform={`translate(104 ${530}) scale(${pzS}) translate(-104 ${-530})`}>
          <RiseText f={f} t="made easy" x={104} y={550} s={96} at={20} fill={C.key} />
        </g>
        <RiseText f={f} t="and how meteorology uses it" x={106} y={660} s={68} at={38} fill={C.key} colors={(i) => (i >= 8 && i < 19 ? C.first : undefined)} />
        <defs><clipPath id="tbclip"><rect x={1140} y={TBOX.y} width={1840 - 1140} height={TBOX.h} /></clipPath></defs>
        <g opacity={oA} clipPath="url(#tbclip)"><FloorGrid pr={prA} xr={[-2, 4]} yr={[-2, 3]} o={0.55} /></g>
      </Svg>
      <View3D st={camA} x={TBOX.x} y={TBOX.y} w={TBOX.w} h={TBOX.h} o={oA}>
        <Quad3D pts={[[0, 0, 0.003], [3, 0, 0.003], [3 + qv[0], qv[1], 0.003], [qv[0], qv[1], 0.003]]} color={ROT} o={0.18} />
        <Arrow3D from={[0, 0, 0]} to={[3, 0, 0]} color={C.first} />
        <Arrow3D from={[0, 0, 0]} to={qv} color={C.second} />
        {!zero ? <Arrow3D from={[0, 0, 0]} to={top} color={ROT} px={14} head={44} dash={neg} /> : null}
      </View3D>
      <View3D st={gc} x={GB.x} y={GB.y} w={GB.w} h={GB.h} o={tex ? oB : 0} key3={gc.pos} amb={1.6} dir={1.4}>
        <GlobeMesh tex={tex} M={M} />
      </View3D>
      <Svg>
        <g opacity={oA}>
          <TipL3 pr={prA} from={[0, 0, 0]} to={[3, 0, 0]} t="p" c={C.first} s={T.calc} />
          <TipL3 pr={prA} from={[0, 0, 0]} to={qv} t="q" c={C.second} s={T.calc} />
          {!zero ? <L3 pr={prA} at={top} t={neg ? "−" : ""} c={C.neg} s={68} dx={40} /> : null}
          <Lbl x={1335} y={705} t={`= (0, 0, ${sgn(pz)})`} c={neg ? C.neg : zero ? C.muted : ROT} s={T.key} />
        </g>
        <defs><clipPath id="gbclip"><rect x={GB.x} y={GB.y} width={GB.w} height={GB.h} /></clipPath></defs>
        <g opacity={oB} clipPath="url(#gbclip)">
          <path d={coastPath(G, ne110.coastline as number[][])} fill="none" stroke={C.key} strokeOpacity={0.4} strokeWidth={1.5} />
          {n > 2 ? <SurfArrow G={G} pts={trk} c={C.first} w={12} head={44} /> : null}
        </g>
      </Svg>
      <TeX s={EQ_PXQ} x={1325} y={705} size={T.key} ax={1} c={C.ink} o={oA} />
    </Scene>
  );
};

// ================================================================ s01 hook
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  const g = easeIO(clamp(f / 30, 0, 1));
  const tWhy = AT(k, 1, "why it's built"), tWind = AT(k, 1, "about the wind");
  const st = camOf([FLOOR_K], f);
  const pr = projector(st, W3, H3);
  const gx = easeIO(clamp((f - tWhy) / 24, 0, 1));
  return (
    <Scene>
      <PairFloor st={st} gA={g} gB={g} axb={gx}
        over={<>
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} o={g} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} o={g} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={AXB3} t="a × b" c={ROT} s={T.calc} o={fin(f, tWhy + 20)} />
          <GlobeIcon x={1450} y={690} r={110} o={0.6 * win(f, tWind, Math.min(tWind + 70, LEN(k) - 12))} />
        </>} />
      <TeX s={ctex(C.first, String.raw`\mathbf a`) + ctex(ROT, String.raw`\times`) + ctex(C.second, String.raw`\mathbf b`)} x={1450} y={330} size={T.hero} ax={0.5} o={fin(f, SS(k, 0), 10)} />
    </Scene>
  );
};

// ================================================================ s02 the link to the dot-product video
const WLUT = wx.lut_thermal as string[];
const [WT_LO, WT_HI] = wx.lut_range_C as [number, number];
const tColor = (Tc: number) => WLUT[Math.round(clamp((Tc - WT_LO) / (WT_HI - WT_LO), 0, 1) * (WLUT.length - 1))];
const T_AT = (xk: number) => interp(xk, wx.prof_x_km as number[], wx.prof_T_C as number[]);
/** the last video's isotherm map, small (x, y top-left; w × h px; 600 × 360 km) with v and ∇T at the pin */
const MiniIsoMap: React.FC<{ x: number; y: number; w: number; h: number; o?: number; labels?: boolean; arrows?: boolean; isoHi?: number }> = ({
  x, y, w, h, o = 1, labels = true, arrows = true, isoHi = 0 }) => {
  if (o <= 0) return null;
  const n = 60, km = w / 600;
  const isoX = (wx.iso_x_km as number[][]).map((s) => s[0]), isoT = wx.iso_T_C as number[];
  const pin: Pt = [x + (wx.pin_km as number[])[0] * km, y + (360 - (wx.pin_km as number[])[1]) * km];
  const va = (wx.angle_deg * Math.PI) / 180;
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => <rect key={i} x={x + (i * w) / n} y={y} width={w / n + 0.6} height={h} fill={tColor(T_AT(((i + 0.5) * 600) / n))} />)}
      {isoX.map((xk, i) => (xk > 1 && xk < 599 ? <g key={i}>
        <line x1={x + xk * km} y1={y} x2={x + xk * km} y2={y + h} stroke="#fff" strokeOpacity={0.75} strokeWidth={3 + 3 * isoHi} />
        {labels && i % 2 === 1 ? <Lbl x={x + xk * km} y={y - 30} t={`${isoT[i]} °C`} c={C.ink} s={T.floor} a="middle" /> : null}
      </g> : null))}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={C.grid} strokeWidth={3} />
      {arrows ? <>
        <Arrow p={pin} q={[pin[0] + 120, pin[1]]} color={C.second} w={8} head={30} />
        <Arrow p={pin} q={[pin[0] + 120 * Math.cos(va), pin[1] - 120 * Math.sin(va)]} color={C.first} w={8} head={30} />
      </> : null}
    </g>
  );
};
const S02: React.FC = () => {
  const f = useCurrentFrame(), k = K("s02_dot_recall");
  const tilt = 45;
  const st = camOf([at(FLOOR_K, 0), at(TOP_K, tilt)], f);
  const svgOn = fin(f, tilt - 2, 6);
  const t1 = SS(k, 1), t2 = SS(k, 2), t8 = AT(k, 2, "equals eight"), t3 = SS(k, 3), t4 = SS(k, 4), tIso = AT(k, 5, "isotherms"), t6 = SS(k, 6);
  const shrink = easeIO(clamp((f - t4) / 30, 0, 1));
  const sc2 = 1;
  const DOTP = splitEq(EQ_DOT8), DP = eqPieces(DOTP[1]);
  const COSP: Part[] = [{ t: "=" }, { t: String.raw`(|\mathbf a|\cos\theta)`, c: C.first, u: { w: String.raw`\text{shadow}`, c: C.first } },
    { t: String.raw`\,|\mathbf b|`, c: C.second, u: { w: String.raw`\text{length of }\mathbf b`, c: C.second } }];
  if (`${splitEq(EQ_COSSH)[0]} ${plainOf(COSP)}` !== rep(EQ_COSSH, String.raw`\,|`, String.raw` \,|`)) throw new Error("s02 parts ≠ EQ_COSSH");
  const oMath = fout(f, t4 + 10, 14);
  const p8 = pulse(f, t6 + 10, 24);
  return (
    <Scene>
      {svgOn < 1 ? <PairFloor st={st} /> : null}
      <Svg>
        <g opacity={svgOn * (1 - 0.4 * shrink)}>
          <PairBase />
          <g opacity={fin(f, t3)}>
            <Dash p={ATIP} q={FOOT} w={4} />
            <RightTick at={FOOT} u1={unit(FOOT, O2)} u2={unit(FOOT, ATIP)} />
            <Band p={O2} q={FOOT} color={C.first} />
            <Lbl x={(O2[0] + FOOT[0]) / 2 - 40} y={(O2[1] + FOOT[1]) / 2} t="shadow" c={C.local} s={T.key} a="end" />
          </g>
        </g>
        <g opacity={fin(f, t1) * (1 - shrink)}>
          <Lbl x={240} y={808} t="a = (5, 1)" c={C.first} s={T.key} />
          <Lbl x={620} y={808} t="b = (1, 3)" c={C.second} s={T.key} />
        </g>
        <Lbl x={1100} y={110} t="dot product" c={C.key} s={T.key} o={fin(f, 6)} />
        <Lbl x={1460} y={110} t="last video" c={C.local} s={T.floor} o={fin(f, 12) * fout(f, t1 + 60)} />
        <MiniIsoMap x={1100} y={430} w={600} h={330} o={fin(f, t4 + 14, 16)} isoHi={pulse(f, tIso, 24)} />
        <Keyword f={f} text="isotherms" at={[1100, 820]} appear={tIso} targets={[[1100 + 300, 770]]} />
        <Keyword f={f} text="a number" at={[1500, 300]} appear={t6} targets={[]} />
      </Svg>
      <Layered parts={[{ t: DOTP[0] }, { t: DP[0] }, { t: DP[1], c: C.key }]} layers={[{ t: [0, 1], o: 1 }, { t: [2], o: fin(f, t8) }]}
        x={1100} y={300} size={T.calc} o={fin(f, t2) * oMath} />
      <Layered parts={COSP} layers={[{ t: "all", o: 1 }, { u: [1, 2], o: fin(f, t3 + 30) }]} x={1290} y={520} size={T.calc} ay={0} o={fin(f, t3) * oMath} />
      <TeX s={splitEq(EQ_COSSH)[0]} x={1270} y={520} size={T.calc} ax={1} ay={0} o={fin(f, t3) * oMath} />
      <TeX s={EQ_VGT} x={1100} y={300} size={T.calc} o={fin(f, t4 + 14)} glow={p8} />
      <TeX s={String.raw`\mathbf a\cdot\mathbf b = 8`} x={640} y={808} size={T.calc} o={fin(f, t4 + 20) * shrink} glow={p8} />
    </Scene>
  );
};

// ================================================================ s03 the door
const DOOR_K: OrbitKey = { f: 0, az: 238, el: 40, dist: 6.6, target: [0.55, 0.45, 0.75], pp: [520, 480] };
const doorPts = (sw: number) => {
  const c = Math.cos(sw), s = Math.sin(sw);
  const R = (v: V3): V3 => [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
  return { R, hand: R([0.9, 0.06, 0.95]), base: R([0, 0.06, 0.95]) };
};
const DoorScene: React.FC<{ f: number; swing: number; showR: number; showF: number; Fdir: "perp" | "along" | "back"; tau?: number; tauNeg?: boolean;
  over?: React.ReactNode }> = ({ swing, showR, showF, Fdir, tau = 0, tauNeg = false, over }) => {
  const st = orbitCam(DOOR_K, PP);
  const pr = projector(st, W3, H3);
  const D = doorPts(swing);
  const Fv: V3 = Fdir === "perp" ? D.R([0, 0.85, 0]) : Fdir === "back" ? D.R([0, -0.85, 0]) : D.R([-0.75, 0, 0]);
  const Fbase = Fdir === "along" ? add3(D.R([0.9, 0.22, 0.95]), [0, 0, 0.28]) : Fdir === "back" ? D.R([0.9, -0.06, 0.95]) : D.hand;
  const guide: V3[] = Array.from({ length: 31 }, (_, i) => { const a = (i / 30) * Math.PI / 2; return [Math.cos(a), Math.sin(a), 0]; });
  return (
    <>
      <Svg>
        <Poly3 pr={pr} pts={guide} c={C.muted} w={6} o={0.6} dash="10 10" />
        <Seg3 pr={pr} a={[0, 0, -0.1]} b={[0, 0, 2.35]} c={C.gold} w={5} dash="14 10" />
      </Svg>
      <View3D st={st}>
        <Door3D swing={swing} />
        <Arrow3D from={D.base} to={D.hand} color={C.first} o={showR} grow={showR} />
        <Arrow3D from={Fbase} to={add3(Fbase, Fv)} color={C.second} o={showF} grow={showF} onTop={Fdir === "along"} />
        {tau > 0 ? <Arrow3D from={[0, 0, tauNeg ? 2.15 : 2.05]} to={[0, 0, tauNeg ? 2.15 - 0.62 * tau : 2.05 + 0.62 * tau]} color={ROT} px={14} head={44} dash={tauNeg} onTop /> : null}
      </View3D>
      <Svg>
        <TipL3 pr={pr} from={D.base} to={D.hand} t="r" c={C.first} s={T.calc} o={showR} side={-40} />
        <TipL3 pr={pr} from={Fbase} to={add3(Fbase, Fv)} t="F" c={C.second} s={T.calc} o={showF} />
        {over}
      </Svg>
    </>
  );
};
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_door");
  const t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), tZero = AT(k, 4, "is zero"), t5 = SS(k, 5), tTurn = AT(k, 5, "the door turns the most");
  const t6 = SS(k, 6), tLarge = AT(k, 6, "as large as it can be"), t7 = SS(k, 7), t8 = SS(k, 8);
  const sw = (50 * D2R) * (easeIO(clamp((f - tTurn) / 20, 0, 1)) - easeIO(clamp((f - tTurn - 34) / 14, 0, 1)));
  const along = f >= t6 + 6;
  const swF = easeIO(clamp((f - t6) / 14, 0, 1));
  const st = orbitCam(DOOR_K, PP), pr = projector(st, W3, H3);
  const D = doorPts(0);
  return (
    <Scene>
      <DoorScene f={f} swing={sw} showR={fin(f, t2 + 8, 16)} showF={along ? swF : fin(f, t3 + 4, 16) * (1 - swF)} Fdir={along ? "along" : "perp"}
        over={<>
          <Keyword f={f} text="just a number" at={[1100, 560]} appear={AT(k, 0, "a number")} out={t2 - 10} targets={[]} />
          <Keyword f={f} text="turning?" at={[1100, 680]} appear={SS(k, 1)} out={t2 - 10} targets={[]} />
          <Lbl x={1100} y={200} t="r" c={C.first} s={T.calc} o={fin(f, AT(k, 2, "from the hinge")) * fout(f, t4 - 10)} />
          <Keyword f={f} text="hinge to hand" at={[1160, 200]} appear={AT(k, 2, "from the hinge")} out={t4 - 10} targets={[]} />
          <Lbl x={1100} y={300} t="F" c={C.second} s={T.calc} o={fin(f, AT(k, 3, "your push")) * fout(f, t4 - 10)} />
          <Keyword f={f} text="push" at={[1160, 300]} appear={AT(k, 3, "your push")} out={t4 - 10} targets={[]} />
          {!along ? <RightTickProj pr={pr} at={D.hand} u1={[-1, 0, 0]} u2={[0, 1, 0]} o={fin(f, t4)} /> : null}
        </>} />
      <TeX s={String.raw`\mathbf a\cdot\mathbf b = 8`} x={1100} y={420} size={T.eq} o={fin(f, 4) * fout(f, t2 - 10)} />
      <TeX s={EQ_RF0} x={1100} y={300} size={T.eq} o={fin(f, tZero)} glow={pulse(f, t8, 24)} />
      <TeX s={String.raw`\mathbf r\cdot\mathbf F`} x={1100} y={520} size={T.eq} o={fin(f, tLarge)} glow={pulse(f, t8, 24)} />
      <Svg>
        <Lbl x={1490} y={300} t="turns the most" c={C.key} s={T.key} o={fin(f, AT(k, 5, "turns the most"))} />
        <Lbl x={1400} y={520} t="largest" c={C.second} s={T.key} o={fin(f, tLarge + 6)} />
        <Lbl x={1400} y={600} t="no turn" c={C.key} s={T.key} o={fin(f, t7 + 6)} />
        <Lbl x={1100} y={760} t="backwards" c={C.key} s={T.calc} o={fin(f, t8 + 10)} />
      </Svg>
    </Scene>
  );
};
const RightTickProj: React.FC<{ pr: ReturnType<typeof projector>; at: V3; u1: V3; u2: V3; o?: number; s?: number }> = ({ pr, at: p0, u1, u2, o = 1, s = 0.18 }) =>
  <Tick3 pr={pr} at={p0} u1={u1} u2={u2} s={s} o={o} c={C.ink} w={4} />;

// ================================================================ s04 left or right?
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = K("s04_left_right");
  const t1 = SS(k, 1), t2 = SS(k, 2), tE = AT(k, 2, "to the east"), tW = AT(k, 2, "to the west"), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9);
  const Q = mkP(540, 720, 130);
  const mid = Q(0, 1.6);
  const gU = fin(f, t1, 16);
  const doorBig = easeIO(clamp((f - t6) / 20, 0, 1)) * fout(f, t7 + 20, 16);
  return (
    <Scene>
      <Svg>
        <Grid P={Q} xr={[-3, 3]} yr={[-1, 4]} o={0.7} />
        <Lbl x={Q(3, 0)[0] + 20} y={Q(0, 0)[1] + 40} t="east" c={C.muted} s={T.key} />
        <Lbl x={Q(0, 4)[0]} y={Q(0, 4)[1] - 36} t="north" c={C.muted} s={T.key} a="middle" />
        <Arrow p={Q(0, 0)} q={Q(0, 3.2)} color={C.first} o={gU} />
        <Lbl x={Q(0, 3.2)[0] + 30} y={Q(0, 3.2)[1] + 20} t="wind" c={C.first} s={T.key} o={gU} />
        <Arrow p={mid} q={[mid[0] + 1.8 * 130, mid[1]]} color={C.second} o={fin(f, tE)} />
        <Arrow p={mid} q={[mid[0] - 1.8 * 130, mid[1]]} color={C.second} o={fin(f, tW)} />
        <Lbl x={mid[0] + 1.8 * 130} y={mid[1] - 60} t="push east" c={C.second} s={T.key} a="middle" o={fin(f, tE)} />
        <Lbl x={mid[0] - 1.8 * 130} y={mid[1] - 60} t="push west" c={C.second} s={T.key} a="middle" o={fin(f, tW)} />
        <RightTick at={mid} u1={[1, 0]} u2={[0, -1]} o={fin(f, t3)} />
        <RightTick at={mid} u1={[-1, 0]} u2={[0, -1]} o={fin(f, t3)} />
        <g opacity={fin(f, t1) * (1 - doorBig) + 0}>
          <DoorIcon x={1700} y={830} s={0.6} o={0.8} />
        </g>
        <g opacity={doorBig}>
          <DoorIcon x={1560} y={800} s={1.1} hinge={pulse(f, t6 + 10, 30)} />
        </g>
        <Keyword f={f} text="axis" at={[1320, 700]} appear={AT(k, 6, "around the line of its hinge")} out={t7 + 20} targets={[[1556, 690]]} />
        <Keyword f={f} text="which way is the push?" at={[1100, 170]} appear={AT(k, 1, "pushes it sideways")} out={t7} targets={[]} />
        <Keyword f={f} text="left or right?" at={[1100, 640]} appear={t5} out={t6 + 4} targets={[]} />
        <Keyword f={f} text="largest at right angles" at={[1100, 380]} appear={AT(k, 7, "largest at right angles")} out={t9 + 4} targets={[]} />
        <Keyword f={f} text="an arrow along an axis" at={[1100, 480]} appear={AT(k, 8, "an arrow along an axis")} out={t9 + 4} targets={[]} />
      </Svg>
      <TeX s={String.raw`\text{wind}\cdot\text{push east} = 0`} x={1100} y={270} size={T.calc} o={fin(f, t3 + 6) * fout(f, t7)} glow={pulse(f, t4, 24)} />
      <TeX s={String.raw`\text{wind}\cdot\text{push west} = 0`} x={1100} y={400} size={T.calc} o={fin(f, t3 + 14) * fout(f, t7)} glow={pulse(f, t4, 24)} />
      <TeX s={ctex(C.first, String.raw`\mathbf a`) + ctex(ROT, String.raw`\times`) + ctex(C.second, String.raw`\mathbf b`)} x={1450} y={430} size={T.hero} ax={0.5} o={fin(f, t9)} />
    </Scene>
  );
};

// ================================================================ s05 the third axis
const AXES_EXT = { x: [-0.6, 6], y: [-0.6, 4], z: [0, 4] };
const Axes3DLines: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <>
    <Rod3D a={[AXES_EXT.x[0], 0, 0]} b={[AXES_EXT.x[1], 0, 0]} px={4} color={C.muted} o={o} />
    <Rod3D a={[0, AXES_EXT.y[0], 0]} b={[0, AXES_EXT.y[1], 0]} px={4} color={C.muted} o={o} />
    <Rod3D a={[0, 0, AXES_EXT.z[0]]} b={[0, 0, AXES_EXT.z[1]]} px={4} color={C.muted} o={o} />
  </>
);
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = K("s05_axes");
  const t1 = SS(k, 1), tE = AT(k, 1, "x points east"), tN = AT(k, 1, "y points north"), tU = AT(k, 1, "straight up"), t2 = SS(k, 2), t3 = SS(k, 3);
  const t4 = SS(k, 4), tZero = AT(k, 4, "third components are zero"), t5 = SS(k, 5), tB = AT(k, 5, "vector b becomes");
  const st = camOf([at(TOP_K, 0), at(TOP_K, 6), at(FLOOR_K, 51)], f);
  const pr = projector(st, W3, H3);
  const handover = fin(f, 0, 6);
  const oAx = fin(f, 20, 20), oU = fin(f, t2, 14);
  const glow0 = pulse(f, tZero, 30);
  const [AB_A, AB_B] = EQ_AB3.split(String.raw`,\qquad `);
  return (
    <Scene>
      <PairFloor st={st} children={<>
        <Axes3DLines o={oAx} />
        <Arrow3D from={[0, 0, 0]} to={[1, 0, 0]} color={C.ink} px={8} head={30} o={oU} grow={oU} />
        <Arrow3D from={[0, 0, 0]} to={[0, 1, 0]} color={C.ink} px={8} head={30} o={oU} grow={oU} />
        <Arrow3D from={[0, 0, 0]} to={[0, 0, 1]} color={C.ink} px={8} head={30} o={oU} grow={oU} />
      </>} over={<>
        <L3 pr={pr} at={[6.4, 0, 0]} t="x" c={C.muted} s={T.key} o={oAx} />
        <L3 pr={pr} at={[0, 4.4, 0]} t="y" c={C.muted} s={T.key} o={oAx} />
        <L3 pr={pr} at={[0, 0, 4.4]} t="z" c={C.muted} s={T.key} o={oAx} />
        <L3 pr={pr} at={[6.4, 0, 0]} t="east" c={C.muted} s={T.key} dy={56} o={fin(f, tE)} />
        <L3 pr={pr} at={[0, 4.4, 0]} t="north" c={C.muted} s={T.key} dy={-56} o={fin(f, tN)} />
        <L3 pr={pr} at={[0, 0, 4.4]} t="up" c={C.muted} s={T.key} dx={70} o={fin(f, tU)} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={[1, 0, 0]} t="x̂" c={C.ink} s={T.key} o={oU} side={34} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={[0, 1, 0]} t="ŷ" c={C.ink} s={T.key} o={oU} side={-30} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={[0, 0, 1]} t="ẑ" c={C.ink} s={T.key} o={oU} side={0} gap={40} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} o={handover} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} o={handover} side={44} />
        <L3 pr={pr} at={[0, 0, 0.5]} t="1" c={C.gold} s={T.floor} dx={-46} o={fin(f, AT(k, 3, "one unit long"))} />
        <Seg3 pr={pr} a={[-0.25, 0, 0]} b={[-0.25, 0, 1]} c={C.gold} w={5} o={fin(f, AT(k, 3, "one unit long"))} />
      </>} />
      <Svg><PairBase o={1 - handover} /></Svg>
      <Svg>
        <Lbl x={1100} y={150} t="x → east" c={C.key} s={T.calc} o={fin(f, tE)} />
        <Lbl x={1100} y={250} t="y → north" c={C.key} s={T.calc} o={fin(f, tN)} />
        <Lbl x={1100} y={350} t="z → up" c={C.key} s={T.calc} o={fin(f, tU)} />
        <Lbl x={1100} y={480} t="length 1" c={C.gold} s={T.key} o={fin(f, AT(k, 3, "one unit long"))} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf x},\ \hat{\mathbf y},\ \hat{\mathbf z}`} x={1460} y={480} size={T.calc} o={fin(f, t2 + 10)} />
      <TeX s={ctex(C.first, AB_A)} x={1300} y={640} size={T.calc} o={fin(f, t4 + 10)} glow={glow0} />
      <TeX s={ctex(C.second, AB_B)} x={1300} y={760} size={T.calc} o={fin(f, tB)} glow={glow0} />
    </Scene>
  );
};

// ================================================================ s06 the recipe, one component at a time
/** the cycle wheel x → y → z → x (gold arrows), `arcs` 0..3 drawn, `hi` = index of the glowing letter (or −1) */
const CycleWheel: React.FC<{ x: number; y: number; r?: number; o?: number; arcs?: number; hi?: number }> = ({ x, y, r = 70, o = 1, arcs = 3, hi = -1 }) => {
  if (o <= 0) return null;
  const ang = [-90, 30, 150].map((a) => a * D2R), L = ["x", "y", "z"];
  return (
    <g opacity={o}>
      {[0, 1, 2].map((i) => {
        const dr = clamp(arcs - i, 0, 1);
        if (dr <= 0) return null;
        const a0 = ang[i] + 0.42, a1 = a0 + (2.094 - 0.84) * dr;
        const pts = Array.from({ length: 21 }, (_, j) => { const a = a0 + ((a1 - a0) * j) / 20; return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`; });
        const ex = x + r * Math.cos(a1), ey = y + r * Math.sin(a1), tx = -Math.sin(a1), ty = Math.cos(a1);
        return <g key={i}>
          <polyline points={pts.join(" ")} fill="none" stroke={C.gold} strokeWidth={5} />
          {dr >= 1 ? <polyline points={`${ex - tx * 18 + ty * 10},${ey - ty * 18 - tx * 10} ${ex},${ey} ${ex - tx * 18 - ty * 10},${ey - ty * 18 + tx * 10}`} fill="none" stroke={C.gold} strokeWidth={5} /> : null}
        </g>;
      })}
      {L.map((t, i) => <Lbl key={t} x={x + r * Math.cos(ang[i])} y={y + r * Math.sin(ang[i])} t={t} c={hi === i ? C.gold : C.key} s={T.key + (hi === i ? 10 : 0)} a="middle" />)}
    </g>
  );
};
const COMP_PARTS: Part[] = [{ t: String.raw`\mathbf a\times\mathbf b` }, { t: "=" }, { t: "(" }, { t: "a_2b_3 - a_3b_2" }, { t: String.raw`,\ ` },
  { t: "a_3b_1 - a_1b_3" }, { t: String.raw`,\ ` }, { t: "a_1b_2 - a_2b_1" }, { t: ")" }];
if (plainOf(COMP_PARTS).replace(/\s/g, "") !== EQ_COMP.replace(/\s/g, "")) throw new Error("s06 parts ≠ EQ_COMP");
const TAB = { x: [1290, 1460, 1630], ya: 430, yb: 560, yh: 330 };
/** the component table a₁ a₂ a₃ / b₁ b₂ b₃ with column words; `grey` = greyed column; `links` = [[ai, bj], …] */
const CompTable: React.FC<{ f: number; o: number; grey: number; greyO: number; links: [number, number, number][]; nums?: boolean; s?: number; dy?: number }> = ({
  f, o, grey, greyO, links, nums = false, s = T.calc, dy = 0 }) => {
  if (o <= 0) return null;
  const av = A3, bv = B3;
  return (
    <>
      <Svg>
        <g opacity={o}>
          {["x part", "y part", "z part"].map((w, i) => <Lbl key={w} x={TAB.x[i]} y={TAB.yh + dy} t={w} c={C.muted} s={T.floor} a="middle" o={grey === i ? 1 - 0.7 * greyO : 1} />)}
          {links.map(([i, j, a0], n) => {
            const d = clamp((f - a0) / 12, 0, 1);
            if (d <= 0) return null;
            const p: Pt = [TAB.x[i] + 18, TAB.ya + dy + 26], q: Pt = [TAB.x[j] - 18, TAB.yb + dy - 30];
            const e = lerp(p, q, d);
            return <line key={n} x1={p[0]} y1={p[1]} x2={e[0]} y2={e[1]} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />;
          })}
          {grey >= 0 ? <line x1={TAB.x[grey]} y1={TAB.ya + dy - 50} x2={TAB.x[grey]} y2={TAB.yb + dy + 50} stroke={C.neg} strokeWidth={6} opacity={greyO} /> : null}
        </g>
      </Svg>
      {[0, 1, 2].map((i) => <TeX key={`a${i}`} s={nums ? String(av[i]) : `a_${i + 1}`} x={TAB.x[i]} y={TAB.ya + dy} size={s} ax={0.5} c={C.first} o={o * (grey === i ? 1 - 0.7 * greyO : 1)} />)}
      {[0, 1, 2].map((i) => <TeX key={`b${i}`} s={nums ? String(bv[i]) : `b_${i + 1}`} x={TAB.x[i]} y={TAB.yb + dy} size={s} ax={0.5} c={C.second} o={o * (grey === i ? 1 - 0.7 * greyO : 1)} />)}
    </>
  );
};
const SLOT = (w: string) => String.raw`\underset{\textcolor{${C.muted}}{\text{${w}}}}{\square}`;
const RECIPE_K: OrbitKey = { ...FLOOR_K, pp: [480, 560], dist: 14.5 };
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = K("s06_recipe");
  const t1 = SS(k, 1), t3 = SS(k, 3), tLX = AT(k, 3, "leave out the x parts"), t4 = SS(k, 4), tY = AT(k, 4, "the y part"), t5 = SS(k, 5), tSub = AT(k, 5, "subtract");
  const t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9);
  const st = camOf([RECIPE_K], f);
  const g6 = fin(f, tLX, 10) * fout(f, t6, 10), g7 = fin(f, t6 + 4, 10) * fout(f, t7, 10), g8 = fin(f, t7 + 4, 10);
  const grey = f < t6 ? 0 : f < t7 ? 1 : 2, greyO = grey === 0 ? g6 : grey === 1 ? g7 : g8 * fout(f, t8, 10);
  const links: [number, number, number][] = grey === 0 ? [[1, 2, tY], [2, 1, tSub]] : grey === 1 ? [[2, 0, t6 + 16], [0, 2, t6 + 40]] : [[0, 1, t7 + 16], [1, 0, t7 + 40]];
  const slots = [SE(k, 5) - 6, SE(k, 6) - 6, SE(k, 7) - 6];
  const cyc = f >= t8 ? Math.floor(((f - t8) / (SE(k, 8) - t8)) * 4) % 3 : -1;
  const mainO = fin(f, slots[0], 12);
  const layers = [{ t: [0, 1, 2, 4, 6, 8] as number[], o: 1 },
    { t: [3] as number[], o: fin(f, slots[0], 10) }, { t: [5] as number[], o: 0.25 + 0.75 * fin(f, slots[1], 10) }, { t: [7] as number[], o: 0.25 + 0.75 * fin(f, slots[2], 10) },
    { t: [3, 5, 7] as number[], tc: { 3: C.gold, 5: C.gold, 7: C.gold }, o: f >= t8 && f < SE(k, 8) ? 0.8 * [pulse(f, t8, 30), pulse(f, t8 + 30, 30), pulse(f, t8 + 60, 30)][Math.min(2, Math.floor((f - t8) / 30))] : 0 },
    { t: [3, 5, 7] as number[], tc: { 3: C.neg, 5: C.neg, 7: C.neg }, o: 0.7 * pulse(f, t9, 40) }];
  return (
    <Scene>
      <PairFloor st={st} over={<>
        <TipL3 pr={projector(st, W3, H3)} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
        <TipL3 pr={projector(st, W3, H3)} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
      </>} />
      <CompTable f={f} o={fin(f, t3 - 10, 14)} grey={grey} greyO={greyO} links={links} />
      <Svg>
        <Lbl x={1460} y={TAB.yb + 70} t="−" c={C.neg} s={T.eq} a="middle" o={grey === 0 ? fin(f, tSub, 8) * fout(f, t6) : 0} />
        <CycleWheel x={1690} y={720} r={70} o={fin(f, t8, 12)} arcs={clamp((f - t8) / 40, 0, 3)} hi={cyc} />
      </Svg>
      <TeX s={String.raw`\mathbf a\times\mathbf b = (\ ${SLOT("x")}\ ,\ \ ${SLOT("y")}\ ,\ \ ${SLOT("z")}\ )`} x={1460} y={190} size={76} ax={0.5}
        o={fin(f, t1 + 4) * fout(f, slots[0], 10)} />
      <Layered parts={COMP_PARTS} layers={layers} x={960} y={95} size={T.calc} ax={0.5} o={mainO} />
    </Scene>
  );
};

// ================================================================ s07 the worked example
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_worked");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t14 = AT(k, 4, "which is fourteen"), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const st = camOf([at(FLOOR_K, 0), { ...FLOOR_K, f: LEN(k), az: 225, el: 24, dist: 14.5, target: [2.2, 1.4, 1.5] }], f);
  const pr = projector(st, W3, H3);
  const [CZ_L, CZ_R] = splitEq(EQ_CZ), CZP = eqPieces(CZ_R);
  const grow = easeIO(clamp((f - t6) / 30, 0, 1));
  const rows: CalcRow[] = [
    { lhs: splitEq(EQ_CX)[0], rhs: splitEq(EQ_CX)[1], at: t1 + 10, h: 100 },
    { lhs: splitEq(EQ_CY)[0], rhs: splitEq(EQ_CY)[1], at: t2 + 10, h: 100 },
    { lhs: CZ_L, rhs: CZP[0], at: t3 + 10, h: 100 },
    { rhs: rep(CZP[1], "= 14", String.raw`= \mathbf{14}`), at: t14, cont: true, h: 100, c: C.key },
  ];
  const linkSet: [number, number, number][] = f < t2 ? [[1, 2, t1 + 14], [2, 1, t1 + 50]] : f < t3 ? [[2, 0, t2 + 14], [0, 2, t2 + 50]] : [[0, 1, t3 + 14], [1, 0, t3 + 50]];
  const tabO = fin(f, t1 - 6) * fout(f, t5 + 20);
  return (
    <Scene>
      <PairFloor st={st} axb={grow} para={pulse(f, t7 + 10, 40) * 1.4}
        over={<>
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={AXB3} t="a × b = (0, 0, 14)" c={ROT} s={T.key} o={fin(f, t6 + 26)} gap={30} />
          <Bracket3 pr={pr} h={AXB3[2]} o={fin(f, t6 + 30)} />
          <Keyword f={f} text="vector product" at={[1100, 640]} appear={AT(k, 8, "vector product")} targets={[add(pr.p([0, 0, AXB3[2] * 0.6]), [26, 0])]} />
          <Lbl x={1100} y={730} t="scalar product = a·b" c={C.local} s={T.key} o={0.85 * fin(f, AT(k, 8, "vector product") + 20)} />
        </>} />
      <CompTable f={f} o={tabO} grey={-1} greyO={0} links={linkSet} nums s={T.key} dy={-290} />
      <Svg>
        {["x", "y", "z"].map((w, i) => <Lbl key={w} x={1080} y={360 + 100 * i + 8} t={w} c={C.muted} s={T.key} o={fin(f, [t1, t2, t3][i] + 10) * fout(f, t5 + 20)} />)}
      </Svg>
      <CalcStack f={f} x={1580} y={322} rows={rows.map((r) => ({ ...r, out: t5 + 20 }))} maxLines={4} size={T.calc} dim={0.6} />
      <TeX s={EQ_AXB14} x={1080} y={420} size={T.eq} o={fin(f, t5 + 24)} glow={pulse(f, t6, 24)} />
    </Scene>
  );
};

// ================================================================ s08 the sine
const ANG_A = Math.atan2(A3[1], A3[0]) / D2R, ANG_B = Math.atan2(B3[1], B3[0]) / D2R;
const SIN_PARTS: Part[] = [{ t: String.raw`|\mathbf a\times\mathbf b|` }, { t: "=" }, { t: String.raw`|\mathbf a|\,|\mathbf b|` },
  { t: String.raw`\sin\theta`, u: { w: String.raw`\text{sine}`, c: C.gold } }];
if (plainOf(SIN_PARTS).replace(/\s/g, "") !== EQ_SIN.replace(/\s/g, "")) throw new Error("s08 parts ≠ EQ_SIN");
const SINE_K: OrbitKey = { ...FLOOR_K, az: 250, el: 40, dist: 14.5, target: [2.2, 1.4, 1.2] };
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = K("s08_sine");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), tS1 = AT(k, 4, "and one at a right angle"), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const st = camOf([{ ...FLOOR_K, f: 0, az: 225, el: 24, dist: 14.5, target: [2.2, 1.4, 1.5] }, at(SINE_K, 40)], f);
  const pr = projector(st, W3, H3);
  const [SN_L, SN_R] = splitEq(EQ_SINN), SNP = eqPieces(SN_R);
  const rowsO = fout(f, t6 - 6);
  const mini = (y: number, ang: number, o: number) => (
    <g opacity={o}>
      <Arrow p={[1110, y + 6]} q={[1180, y + 6]} color={C.first} w={6} head={18} halo={false} />
      <Arrow p={[1110, y + 6]} q={[1110 + 60 * Math.cos(ang * D2R), y + 6 - 60 * Math.sin(ang * D2R)]} color={C.second} w={6} head={18} halo={false} />
    </g>
  );
  return (
    <Scene>
      <PairFloor st={st} axb={1}
        over={<>
          <Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={1.5} a0={ANG_A} a1={ANG_B} col={C.gold} head={false} draw={fin(f, 10, 20)} />
          <L3 pr={pr} at={[1.95 * Math.cos(((ANG_A + ANG_B) / 2) * D2R), 1.95 * Math.sin(((ANG_A + ANG_B) / 2) * D2R), 0]} t="θ" c={C.gold} s={T.calc} o={fin(f, 20)} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={AXB3} t="a × b" c={ROT} s={T.key} />
          <L3 pr={pr} at={[0, 0, AXB3[2] * 0.55]} t="14" c={C.gold} s={T.key + 14 * pulse(f, AT(k, 8, "fourteen again") + 6, 24)} a="end" dx={-36}
            o={fin(f, AT(k, 8, "fourteen again"))} />
        </>} />
      <TeX s={EQ_COS} x={1080} y={110} size={T.calc} c={C.local} o={0.7 * fin(f, t1)} />
      <Layered parts={SIN_PARTS} layers={[{ t: "all", o: 1 }, { u: [3], o: fin(f, t2 + 20) }]} x={1070} y={200} size={80} ay={0} o={fin(f, t2 + 10)} />
      <Svg>
        {mini(380, 0, fin(f, t4) * rowsO)}{mini(470, 90, fin(f, tS1) * rowsO)}{mini(560, 180, fin(f, t5) * rowsO)}
      </Svg>
      <TeX s={String.raw`\sin 0^\circ = 0`} x={1220} y={390} size={T.key} o={fin(f, t4) * rowsO} />
      <TeX s={String.raw`\sin 90^\circ = 1`} x={1220} y={480} size={T.key} o={fin(f, tS1) * rowsO} />
      <TeX s={String.raw`\sin 180^\circ = 0`} x={1220} y={570} size={T.key} o={fin(f, t5) * rowsO} />
      <TeX s={String.raw`|\mathbf a| = \sqrt{26} = 5.099`} x={1080} y={430} size={T.calc} c={C.first} o={fin(f, AT(k, 6, "five point one"))} />
      <TeX s={String.raw`|\mathbf b| = \sqrt{10} = 3.162`} x={1080} y={520} size={T.calc} c={C.second} o={fin(f, AT(k, 6, "three point one six"))} />
      <TeX s={EQ_THS} x={1080} y={615} size={T.calc} o={fin(f, t7 + 10)} />
      <CalcStack f={f} x={1200} y={672} size={60} rows={[
        { lhs: SN_L, rhs: SNP[0], at: t8, h: 86 },
        { rhs: rep(SNP[1], "14", String.raw`\mathbf{14}`), at: AT(k, 8, "fourteen again"), cont: true, c: C.key, h: 86 },
      ]} />
    </Scene>
  );
};

// ================================================================ s09 the area of the parallelogram
const CORN = (pair.corners as number[][]).map((c) => P(c[0], c[1]));
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09_area");
  const tilt = 40;
  const st = camOf([at(SINE_K, 0), at(TOP_K, tilt)], f);
  const svgOn = fin(f, tilt - 2, 6);
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), tPar = AT(k, 7, "parallelogram");
  const t8 = SS(k, 8), t9 = SS(k, 9), t14 = AT(k, 9, "about fourteen"), t10 = SS(k, 10);
  const slide = easeIO(clamp((f - t6 - 10) / 30, 0, 1)), slide2 = easeIO(clamp((f - t6 - 50) / 30, 0, 1));
  const bCopy0 = lerp(O2, ATIP, slide), aCopy0 = lerp(O2, BTIP, slide2);
  const [H_L, H_R] = splitEq(EQ_HEIGHT), HP = eqPieces(H_R);
  const [AR_L, AR_R] = splitEq(EQ_AREA), ARP = eqPieces(AR_R);
  const cen = P(3, 2);
  return (
    <Scene>
      {svgOn < 1 ? <PairFloor st={st} axb={1 - fin(f, 0, 20)} /> : null}
      <Svg>
        <g opacity={svgOn}>
          <polygon points={CORN.map((p) => p.join(",")).join(" ")} fill={ROT} fillOpacity={0.18 * fin(f, tPar, 14) * (1 + 0.8 * pulse(f, t9 + 30, 30))} stroke={ROT} strokeWidth={3} strokeOpacity={fin(f, tPar, 14)} />
          <PairBase />
          <Dash p={P(-0.33, -1)} q={P(1.437, 4.3)} c={C.second} o={0.4 * fin(f, t1)} w={3} d="14 10" />
          <g opacity={fin(f, t1 + 20)}>
            <RightTick at={FOOT} u1={unit(FOOT, O2)} u2={unit(FOOT, ATIP)} />
            <Band p={O2} q={FOOT} color={C.first} o={0.55 * fin(f, t2) * (1 - 0.5 * fin(f, t3))} />
            <Lbl x={(O2[0] + FOOT[0]) / 2 - 36} y={(O2[1] + FOOT[1]) / 2 + 6} t="shadow" c={C.local} s={T.key} a="end" o={fin(f, t2) * fout(f, t4)} />
          </g>
          <line x1={ATIP[0]} y1={ATIP[1]} x2={FOOT[0]} y2={FOOT[1]} stroke={fin(f, t3) > 0.5 ? ROT : C.ink} strokeWidth={4 + 8 * fin(f, t3)} strokeDasharray={fin(f, t3) > 0.5 ? undefined : "12 10"} opacity={fin(f, t1 + 10)} />
          <Bracket p={FOOT} q={ATIP} off={-38} c={C.gold} o={fin(f, t4)} />
          <Lbl x={(FOOT[0] + ATIP[0]) / 2 + 30} y={(FOOT[1] + ATIP[1]) / 2 - 58} t="height" c={C.gold} s={T.key} o={fin(f, t4 + 6)} />
          <Arrow p={bCopy0} q={[bCopy0[0] + BTIP[0] - O2[0], bCopy0[1] + BTIP[1] - O2[1]]} color={C.second} dash="16 10" o={fin(f, t6 + 10) * 0.9} w={8} />
          <Arrow p={aCopy0} q={[aCopy0[0] + ATIP[0] - O2[0], aCopy0[1] + ATIP[1] - O2[1]]} color={C.first} dash="16 10" o={fin(f, t6 + 50) * 0.9} w={8} />
          <Keyword f={f} text="parallelogram" at={[560, 830]} appear={tPar} targets={[[cen[0] + 30, cen[1] + 40]]} />
          <Bracket p={O2} q={BTIP} off={42} c={C.gold} o={fin(f, t8)} />
          <Lbl x={(O2[0] + BTIP[0]) / 2 - 70} y={(O2[1] + BTIP[1]) / 2} t="base" c={C.gold} s={T.key} a="end" o={fin(f, t8 + 6)} />
          <CurvedLink f={f} from={[cen[0] + 40, cen[1] + 30]} to={[1180, 515]} start={t14 + 4} ctl={[950, 300]} />
        </g>
      </Svg>
      <CalcStack f={f} x={1360} y={150} rows={[
        { lhs: H_L, rhs: HP[0], at: t5, h: 96 },
        { rhs: HP[1], at: t5 + 30, cont: true, h: 96 },
        { rhs: HP[2], at: AT(k, 5, "about four point four three"), cont: true, c: C.key, h: 120 },
      ]} maxLines={3} size={T.calc} />
      <CalcStack f={f} x={1360} y={470} rows={[
        { lhs: AR_L, rhs: ARP[0], at: t9, h: 90 },
        { rhs: rep(ARP[1], "14", String.raw`\mathbf{14}`), at: t14, cont: true, c: C.key, h: 90 },
      ]} maxLines={3} size={T.calc} o={fin(f, t9) * 1} />
      <TeX s={EQ_LENAREA} x={1080} y={720} size={T.eq} o={fin(f, t10 + 10)} c={C.key} />
      <Svg>
        <Keyword f={f} text="last video: the shadow" at={[1100, 260]} appear={AT(k, 1, "dropped a line")} out={t5 - 12} targets={[]} c={C.local} />
        <Keyword f={f} text="now: the dropped line" at={[1100, 380]} appear={t3} out={t5 - 12} targets={[]} />
        <Keyword f={f} text="= height of a above b" at={[1100, 500]} appear={AT(k, 4, "the height")} out={t5 - 12} targets={[]} c={C.gold} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s10 at right angles to both
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_right_angles");
  const RA_K: OrbitKey = { ...FLOOR_K, f: 40, az: 205, el: 30, dist: 13, target: [2.2, 1.2, 1.4] };
  const st = camOf([at(TOP_K, 0), RA_K, at(RA_K, SS(k, 6)), { ...RA_K, f: SS(k, 6) + 40, target: [2.0, 1.1, -1.0], dist: 19.5, el: 22 }], f);
  const pr = projector(st, W3, H3);
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), tDown = AT(k, 6, "up and down"), t7 = SS(k, 7), t8 = SS(k, 8);
  const PA = splitEq(EQ_PERPA), PAP = eqPieces(PA[1]), PB = splitEq(EQ_PERPB), PBP = eqPieces(PB[1]);
  const ah = norm3(A3), bh = norm3(B3);
  return (
    <Scene>
      <PairFloor st={st} axb={fin(f, 20, 20)}
        children={<Arrow3D from={[0, 0, 0]} to={[0, 0, -AXB3[2]]} color={ROT} px={14} head={48} dash o={0.45 * fin(f, SS(k, 6) + 40)} />}
        over={<>
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={AXB3} t="a × b" c={ROT} s={T.key} o={fin(f, 30)} />
          <Tick3 pr={pr} at={[0, 0, 0]} u1={ah} u2={[0, 0, 1]} s={0.55} o={fin(f, AT(k, 1, "right angle"))} />
          <Tick3 pr={pr} at={[0, 0, 0]} u1={bh} u2={[0, 0, 1]} s={0.55} o={fin(f, AT(k, 1, "to both arrows"))} />
          <L3 pr={pr} at={AXB3} t="up?" c={C.key} s={T.key} dx={-120} o={fin(f, tDown - 10)} />
          <L3 pr={pr} at={[0, 0, -AXB3[2]]} t="down?" c={C.key} s={T.key} dx={130} o={fin(f, tDown)} />
          <Lbl x={pr.p([0, 0, 0])[0] - 150} y={pr.p([0, 0, 0])[1]} t="?" c={C.gold} s={T.hero} a="middle" o={fin(f, t7)} />
        </>} />
      <CalcStack f={f} x={1250} y={130} size={56} rows={[
        { lhs: PA[0], rhs: PAP[0], at: t4, h: 92 },
        { rhs: PAP[1], at: AT(k, 4, "is zero"), cont: true, c: C.key, h: 120 },
        { lhs: PB[0], rhs: PBP[0], at: t5, h: 92 },
        { rhs: PBP[1], at: t5 + 30, cont: true, c: C.key, h: 92 },
      ]} maxLines={4} />
      <Svg>
        <Lbl x={1080} y={620} t="dot product = 0 → right angle" c={C.local} s={T.key} o={fin(f, t3)} />
        <Keyword f={f} text="at right angles to both" at={[1100, 220]} appear={AT(k, 1, "right angle")} out={t4 - 12} targets={[]} />
        <Keyword f={f} text="check with the dot product" at={[1100, 340]} appear={t2} out={t4 - 12} targets={[]} />
        <Lbl x={1080} y={780} t="right-hand rule" c={C.key} s={T.calc} o={fin(f, AT(k, 8, "right-hand rule"))} />
      </Svg>
    </Scene>
  );
};

// ================================================================ the right-hand rule (s11–s17)
/** where the hand goes for fingers along `fing` (from near the origin) and the thumb along `thumb`: the knuckles sit at
 * the origin, lifted `lift` along the thumb (so the palm clears the first arrow) */
const handPlace = (fing: V3, thumb: V3, s: number, lift = 0.75): { q: THREE.Quaternion; at: V3 } => {
  const q = handQuat(fing, thumb);
  return { q, at: add3(mul3(norm3(fing), -0.45 * s), norm3(thumb), lift * s / 1.5) };
};
/** a gold curved arrow showing which way the fingers curl (from the fingers' direction towards the palm normal),
 * drawn above the index finger in the hand's own frame */
const CurlArrow: React.FC<{ pr: ReturnType<typeof projector>; q: THREE.Quaternion; at: V3; s: number; draw: number; o?: number; a1?: number }> = ({ pr, q, at: a0, s, draw, o = 1, a1 = 115 }) => {
  if (o <= 0 || draw <= 0) return null;
  const c0 = handPoint(q, a0, s, [0.4, 0.0, 0.62]);
  const ex = sub3(handPoint(q, a0, s, [1, 0, 0]), handPoint(q, a0, s, [0, 0, 0]));
  const ey = sub3(handPoint(q, a0, s, [0, 1, 0]), handPoint(q, a0, s, [0, 0, 0]));
  return <Arc3 pr={pr} c0={c0} e1={norm3(ex)} e2={norm3(ey)} r={0.75 * s} a0={-10} a1={a1} draw={draw} col={C.gold} w={7} o={o} />;
};
const RH_K: OrbitKey = { f: 0, az: 340, el: 22, dist: 11.5, target: [0.9, 0.8, 1.3], pp: [600, 480] };
const AH = norm3(A3), BH = norm3(B3);
/** the gold trace of the index fingertip as the fingers curl from c0 to c (the curl arrow that follows the fingertips) */
const TipTrace: React.FC<{ pr: ReturnType<typeof projector>; q: THREE.Quaternion; at: V3; s: number; c0?: number; c: number; o?: number; w?: number }> = ({
  pr, q, at: a0, s, c0 = 0, c, o = 1, w = 7 }) => {
  if (o <= 0 || c - c0 < 0.04) return null;
  const n = 28;
  const pts = Array.from({ length: n + 1 }, (_, i) => pr.p(handPoint(q, a0, s, fingerTipLocal(POSE.curl(c0 + ((c - c0) * i) / n), 0))));
  const tip = pts[n], pre = pts[n - 3];
  const ux = tip[0] - pre[0], uy = tip[1] - pre[1], L = Math.hypot(ux, uy) || 1, dx = ux / L, dy = uy / L;
  const hl = 26, rot = (t: number): Pt => [-dx * Math.cos(t) + dy * Math.sin(t), -dx * Math.sin(t) - dy * Math.cos(t)];
  const h1 = rot(0.5), h2 = rot(-0.5);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  return (
    <g opacity={o}>
      <path d={d} fill="none" stroke={C.bg} strokeWidth={w + 5} strokeLinecap="round" />
      <path d={d} fill="none" stroke={C.gold} strokeWidth={w} strokeLinecap="round" />
      <polyline points={`${tip[0] + h1[0] * hl},${tip[1] + h1[1] * hl} ${tip[0]},${tip[1]} ${tip[0] + h2[0] * hl},${tip[1] + h2[1] * hl}`}
        fill="none" stroke={C.gold} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};
/** s11: an open flat right hand on edge, fingers lying along a (little finger on the arrow), wrist behind O; the fingers
 * curl towards b (the fingertip trace is the gold curl arrow), then the thumb rises to a × b; then one orbit */
const RH11_K: OrbitKey = { f: 0, az: 221, el: 34, dist: 17, target: [1.6, 1.0, 1.0], pp: [540, 450] };
const CURL11 = 0.62;
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_rhr_curl");
  const t1 = SS(k, 1), t2 = SS(k, 2), tShort = AT(k, 2, "the short way round"), t3 = SS(k, 3), t4 = SS(k, 4), e5 = SE(k, 5);
  const st = camOf([at(RH11_K, 0), at(RH11_K, t4), { ...RH11_K, f: e5, az: 221 + 360, orbit: 360 }], f);
  const pr = projector(st, W3, H3);
  const s = 2.2;
  const q = handQuat(A3, [0, 0, 1]);
  // little finger (local z −0.29, radius ≈ 0.08) resting on a; the knuckles just past O, the wrist behind it
  const pos = add3(mul3(AH, -0.3 * s), [0, 0, 0.37 * s]);
  const slideIn = easeIO(clamp(f / 30, 0, 1));
  const at0 = add3(pos, [-2.5, -2.0, 0], 1 - slideIn);
  const curl = CURL11 * easeIO(clamp((f - AT(k, 2, "curl your fingers")) / (AT(k, 2, "the short way round") + 10 - AT(k, 2, "curl your fingers")), 0, 1));
  const thumbUp = easeIO(clamp((f - t3) / 24, 0, 1));
  const thetaArc = clamp((f - tShort) / 30, 0, 1);
  const mid = (ANG_A + ANG_B) / 2;
  const kwO = fin(f, e5 - 40, 12);
  return (
    <Scene>
      <PairFloor st={st} axb={easeIO(clamp((f - t3 - 4) / 24, 0, 1))}
        under={<>
          <Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={2.6} a0={ANG_A} a1={ANG_B} col={C.gold} draw={thetaArc} w={4} />
          <Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={2.6} a0={ANG_A} a1={ANG_B - 360} col={C.muted} head={false} dash="10 12" o={0.6 * fin(f, tShort) * fout(f, t3 + 30)} />
        </>}
        bTop
        children={<Hand3D q={q} at={at0} s={s} angles={POSE.curl(curl)} thumb={thumbUp} o={fin(f, 0, 14)}
          glow={{ index: f >= t1 && f < t3 ? C.first : undefined, thumb: thumbUp > 0 ? ROT : undefined }} glowK={thumbUp > 0 ? thumbUp : fin(f, t1, 10) * fout(f, t2 + 20, 10)} />}
        over={<>
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} gap={34} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={AXB3} t="a × b" c={ROT} s={T.key} o={fin(f, t3 + 24)} />
          {(() => { const qq = pr.p([2.6 * Math.cos((ANG_B - 150) * D2R), 2.6 * Math.sin((ANG_B - 150) * D2R), 0]); return <g opacity={fout(f, t3 + 30)}><Strike p={[qq[0] - 30, qq[1] - 30]} q={[qq[0] + 30, qq[1] + 30]} f={f} at={tShort + 10} /></g>; })()}
          <L3 pr={pr} at={[3.05 * Math.cos(mid * D2R), 3.05 * Math.sin(mid * D2R), 0]} t="θ" c={C.gold} s={T.key} o={thetaArc} />
          <TipTrace pr={pr} q={q} at={at0} s={s} c={curl} o={fin(f, AT(k, 2, "curl your fingers"), 6) * (f < t4 ? 1 : fout(f, t4, 10))} />
        </>} />
      <Svg>
        <Keyword f={f} text="right hand" at={[1180, 170]} appear={6} targets={[]} />
        <Lbl x={1180} y={300} t="fingers → a" c={C.first} s={T.calc} o={fin(f, AT(k, 1, "along vector a"))} />
        <Lbl x={1180} y={420} t="curl → b" c={C.second} s={T.calc} o={fin(f, AT(k, 2, "towards b"))} />
        <Lbl x={1180} y={540} t="thumb → a × b" c={ROT} s={T.calc} o={fin(f, AT(k, 3, "points along"))} />
        <Keyword f={f} text="the short way round" at={[1180, 660]} appear={tShort} out={t4} targets={[]} />
        <Keyword f={f} text="from every side" at={[1180, 660]} appear={t4 + 10} out={e5 - 50} targets={[]} />
        <Keyword f={f} text="all three agree" at={[1180, 660]} appear={e5 - 40} targets={[]} o={kwO} />
      </Svg>
    </Scene>
  );
};

const S12: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12_rhr_flat");
  const t1 = SS(k, 1), tIdx = AT(k, 1, "index finger"), tMid = AT(k, 1, "middle finger"), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const RK: OrbitKey = { ...RH11_K, el: 58, dist: 18.5, pp: [560, 400] };
  const st = camOf([at(RK, 0), at(RK, t6), { ...RK, f: t6 + 60, az: 221 + 60, orbit: 60 }], f);
  const pr = projector(st, W3, H3);
  const s = 2.2, hp = { q: handQuat(A3, [0, 0, 1]), at: add3(mul3(AH, -0.3 * 2.2), [0, 0, 0.12 * 2.2]) as V3 };
  const toFlat = easeIO(clamp(f / 20, 0, 1));
  const bend = easeIO(clamp((f - t2) / 30, 0, 1));
  const ang = POSE.mix(POSE.curl(1), POSE.flat(pair.theta_deg * (0.35 + 0.65 * bend)), toFlat);
  const gI = fin(f, tIdx, 10), gM = fin(f, tMid, 10), gT = fin(f, t3, 10);
  const reorder = fin(f, t5, 14);
  return (
    <Scene>
      <PairFloor st={st} axb={1} oA={1} oB={1} bTop
        children={<Hand3D q={hp.q} at={hp.at} s={s} angles={ang} thumb={0.25 + 0.75 * easeIO(clamp((f - t3) / 20, 0, 1))}
          glow={{ index: gI > 0 ? C.first : undefined, middle: gM > 0 ? C.second : undefined, thumb: gT > 0 ? ROT : undefined }} />}
        over={<>
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} gap={34} />
          <L3 pr={pr} at={AXB3} t="a × b" c={ROT} s={T.key} a="middle" dy={-40} />
        </>} />
      <Svg>
        <g opacity={1 - reorder}>
          <Keyword f={f} text="a second way" at={[1180, 200]} appear={6} out={t1 + 20} targets={[]} />
          <Lbl x={1180} y={300} t="index · a" c={C.first} s={T.key} o={gI} />
          <Lbl x={1180} y={400} t="middle · b" c={C.second} s={T.key} o={gM} />
          <Lbl x={1180} y={500} t="thumb · a × b" c={ROT} s={T.key} o={gT} />
        </g>
        <g opacity={reorder}>
          <Lbl x={1180} y={420} t="index" c={C.first} s={T.key} />
          <Lbl x={1350} y={420} t="×" c={ROT} s={T.key} />
          <Lbl x={1400} y={420} t="middle" c={C.second} s={T.key} />
          <Lbl x={1580} y={420} t="=" c={C.ink} s={T.key} />
          <Lbl x={1625} y={420} t="thumb" c={ROT} s={T.key} />
        </g>
      </Svg>
    </Scene>
  );
};

const CAP_K: OrbitKey = { f: 0, az: 250, el: 28, dist: 13, target: [1.9, 0, 2.0], pp: [620, 540] };
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = K("s13_rhr_screw");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), e7 = SE(k, 7);
  const st = camOf([CAP_K], f), pr = projector(st, W3, H3);
  const th = pair.theta_deg * D2R;
  // cap angle: 0 → θ (S2), on to θ + 2π (to the end of S4), back to 0 (S5–S6)
  const a1 = th * easeIO(clamp((f - t1 - 6) / 40, 0, 1));
  const a2 = 2 * Math.PI * easeIO(clamp((f - t1 - 50) / (SE(k, 3) - t1 - 50), 0, 1));
  const a3 = (th + 2 * Math.PI) * easeIO(clamp((f - t4) / (SE(k, 5) - t4), 0, 1));
  const capA = a1 + a2 - a3;
  const pitch = rhr.cap.pitch_display;
  const lift = (pitch * capA) / (2 * Math.PI);
  const rising = f >= t1 && f < t4, sinking = f >= t4 && f < t6;
  // screw: 2 turns anticlockwise (backs out), then 2.5 clockwise (drives in)
  const sA = 2 * Math.PI * easeIO(clamp((f - t6) / (SE(k, 6) - t6), 0, 1)) + th * easeIO(clamp((f - t7 - 10) / 50, 0, 1));
  const sAdv = (0.25 * sA) / (2 * Math.PI);
  const sUp = f >= t6 + 6;
  const CAPS = 1.7, BX: V3 = [0, 0, 0], SX: V3 = [4.2, 0, 1.1];
  const capTop = (1.42 + 0.28 + lift) * CAPS;
  // inset: the cap from above (anticlockwise while opening, clockwise while closing)
  const IX = 1630, IY = 260, IR = 105;
  const dir = sinking ? -1 : 1;
  const insetO = fin(f, t2, 12) * fout(f, t6, 12);
  const arcD = (() => {
    const a0 = (ANG_A + capA / D2R) * D2R, span = 1.6 * dir;
    const pts = Array.from({ length: 25 }, (_, i) => { const a = a0 + (span * i) / 24; return `${IX + (IR + 26) * Math.cos(a)},${IY - (IR + 26) * Math.sin(a)}`; });
    return pts.join(" ");
  })();
  const aEnd = (ANG_A * D2R + capA) + 1.6 * dir;
  const ex = IX + (IR + 26) * Math.cos(aEnd), ey = IY - (IR + 26) * Math.sin(aEnd);
  const tx = -Math.sin(aEnd) * dir, ty = -Math.cos(aEnd) * dir;
  return (
    <Scene>
      <View3D st={st}>
        <group position={BX} scale={[CAPS, CAPS, CAPS]}><BottleCap3D angle={capA} lift={lift} markA={ANG_A * D2R} markB={ANG_B * D2R} /></group>
        <group position={SX} scale={[1.3, 1.3, 1.3]}><Screw3D angle={sA} advance={sAdv} markA={ANG_A * D2R} markB={ANG_B * D2R} /></group>
        <Arrow3D from={[0, 0, capTop + 0.15]} to={[0, 0, capTop + 1.35]} color={ROT} px={14} head={44} o={rising && f >= t3 ? fin(f, t3, 10) : 0} />
        <Arrow3D from={[0, 0, capTop + 1.3]} to={[0, 0, capTop + 0.15]} color={ROT} px={14} head={44} dash o={sinking ? fin(f, t5, 10) : 0} />
        <Arrow3D from={add3(SX, [0, 0, 1.0 + sAdv * 1.3])} to={add3(SX, [0, 0, 2.3 + sAdv * 1.3])} color={ROT} px={12} head={40} o={sUp ? fin(f, t6 + 10, 10) : 0} />
      </View3D>
      <Svg>
        <L3 pr={pr} at={[0, 0, capTop + 1.35]} t="a × b" c={ROT} s={T.key} dx={90} o={rising && f >= t3 ? fin(f, t3 + 10) : 0} />
        <MinusGlyph x={pr.p([0, 0, capTop + 0.4])[0] + 60} y={pr.p([0, 0, capTop + 0.4])[1]} o={sinking ? fin(f, t5 + 10) : 0} />
        <g opacity={insetO}>
          <circle cx={IX} cy={IY} r={IR} fill="#26314d" stroke="#c9d2e3" strokeWidth={4} />
          <rect x={IX + IR * 0.82 * Math.cos(ANG_B * D2R) - 12} y={IY - IR * 0.82 * Math.sin(ANG_B * D2R) - 12} width={24} height={24} fill={C.second} />
          <circle cx={IX + IR * 0.72 * Math.cos(ANG_A * D2R + capA)} cy={IY - IR * 0.72 * Math.sin(ANG_A * D2R + capA)} r={13} fill={C.first} />
          <polyline points={arcD} fill="none" stroke={C.gold} strokeWidth={6} />
          <polyline points={`${ex - tx * 22 + ty * 12},${ey - ty * 22 - tx * 12} ${ex},${ey} ${ex - tx * 22 - ty * 12},${ey - ty * 22 + tx * 12}`} fill="none" stroke={C.gold} strokeWidth={6} />
          <Lbl x={IX} y={IY + IR + 60} t={sinking ? "clockwise" : "anticlockwise"} c={C.key} s={T.floor} a="middle" />
          <Lbl x={IX} y={IY + IR + 110} t="from above" c={C.key} s={T.floor} a="middle" />
        </g>
        <Arc3 pr={pr} c0={add3(SX, [0, 0, 0.62 + sAdv * 1.3])} e1={[1, 0, 0]} e2={[0, 1, 0]} r={0.62} a0={ANG_A} a1={ANG_A + (sA - 2 * Math.PI) / D2R}
          draw={1} col={C.gold} w={6} o={f >= t7 + 12 ? fin(f, t7 + 12, 6) : 0} />
        <L3 pr={pr} at={add3(SX, [0, 0, 2.3 + sAdv * 1.3])} t="first × second" c={ROT} s={T.key} a="end" dx={-40} o={fin(f, AT(k, 7, "it moves along"))} />
        <Keyword f={f} text="bottle cap · screw" at={[1100, 300]} appear={AT(k, 0, "a bottle cap")} out={t2 - 6} targets={[]} />
        <Lbl x={1100} y={420} t="turn a → b" c={C.key} s={T.calc} o={fin(f, AT(k, 1, "Turn the cap")) * fout(f, t2 - 6)} />
        <Keyword f={f} text="opens" at={[1180, 560]} appear={AT(k, 2, "the way you open")} out={t4} targets={[]} />
        <Keyword f={f} text="closes" at={[1180, 560]} appear={AT(k, 5, "the way a bottle closes")} out={t6} targets={[]} />
        <Lbl x={1100} y={300} t="screw: same way" c={C.key} s={T.key} o={fin(f, t6 + 6)} />
        <Lbl x={1100} y={420} t="turn first → second" c={C.key} s={T.key} o={fin(f, t7 + 20)} />
        <Lbl x={1100} y={510} t="moves along first × second" c={C.key} s={T.key} o={fin(f, AT(k, 7, "it moves along"))} />
      </Svg>
    </Scene>
  );
};

// ---- the three axes (s14–s16)
const AX_COL = (i: number, first: number, second: number, res: number) => (i === first ? C.first : i === second ? C.second : i === res ? ROT : C.muted);
const UNIT: V3[] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const AxesTriad: React.FC<{ cols: string[]; L?: number; neg?: number; negCol?: string; dashNeg?: boolean; o?: number }> = ({ cols, L = 2.5, o = 1 }) => (
  <>
    {[0, 1, 2].map((i) => <Rod3D key={`r${i}`} a={mul3(UNIT[i], -3)} b={mul3(UNIT[i], 3)} px={3} color={C.muted} o={0.6 * o} />)}
    {[0, 1, 2].map((i) => <Arrow3D key={`u${i}`} from={[0, 0, 0]} to={mul3(UNIT[i], L)} color={cols[i]} px={cols[i] === ROT ? 14 : 10} head={cols[i] === ROT ? 48 : 40} o={o} />)}
  </>
);
const AxesLabels: React.FC<{ pr: ReturnType<typeof projector>; cols: string[]; L?: number; o?: number; hat?: boolean }> = ({ pr, cols, L = 2.5, o = 1 }) => (
  <>
    {["x̂", "ŷ", "ẑ"].map((t, i) => <TipL3 key={t} pr={pr} from={[0, 0, 0]} to={mul3(UNIT[i], L)} t={t} c={cols[i] === C.muted ? C.ink : cols[i]} s={T.calc} o={o} />)}
  </>
);
const AXK: OrbitKey = { f: 0, az: 225, el: 35, dist: 11, target: [0, 0, 0.6], pp: [560, 470] };
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14_rhr_cycle");
  const t1 = SS(k, 1), tCurl1 = AT(k, 1, "curl them"), t2 = SS(k, 2), tXY = AT(k, 2, "x hat cross y hat"), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), tYZ = AT(k, 5, "y hat cross z hat");
  const t6 = SS(k, 6), tCurl3 = AT(k, 6, "curling towards"), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9);
  const st = camOf([at(AXK, t3), { ...AXK, f: t3 + 30, az: 20, el: 25, target: [0.6, 0, 0.3] }, { ...AXK, f: t6, az: 20, el: 25, target: [0.6, 0, 0.3] },
    { ...AXK, f: t6 + 30, az: 110, el: 20, target: [0, 0.6, 0.3] }], f);
  const pr = projector(st, W3, H3);
  const beat = f < t3 ? 0 : f < t6 ? 1 : 2;
  const pairs: [number, number, number][] = [[0, 1, 2], [1, 2, 0], [2, 0, 1]];
  const [fi, se, re] = pairs[beat];
  const cols = [0, 1, 2].map((i) => AX_COL(i, fi, se, re));
  const s = 1.4;
  const P0 = handPlace(UNIT[0], UNIT[2], s), P1 = handPlace(UNIT[1], UNIT[0], s), P2 = handPlace(UNIT[2], UNIT[1], s);
  const w1 = easeIO(clamp((f - t3) / 24, 0, 1)), w2 = easeIO(clamp((f - t6) / 24, 0, 1));
  const q = beat === 0 ? P0.q : beat === 1 ? slerpQ(P0.q, P1.q, w1) : slerpQ(P1.q, P2.q, w2);
  const pos = beat === 0 ? P0.at : beat === 1 ? lerp3(P0.at, P1.at, w1) : lerp3(P1.at, P2.at, w2);
  const curlStart = [tCurl1, t4, tCurl3][beat];
  const curl = 0.15 + 0.85 * easeIO(clamp((f - curlStart) / 30, 0, 1));
  return (
    <Scene>
      <View3D st={st}>
        <AxesTriad cols={cols} o={fin(f, 0, 14)} />
        <Hand3D q={q} at={pos} s={s} angles={POSE.curl(f < t1 ? 0 : curl)} o={fin(f, t1 - 10, 14)} glow={{ thumb: f >= [t2, t5, t7][beat] ? ROT : undefined }} />
      </View3D>
      <Svg>
        <AxesLabels pr={pr} cols={cols} />
        <CurlArrow pr={pr} q={q} at={pos} s={s} draw={easeIO(clamp((f - curlStart) / 30, 0, 1))} o={f >= t1 ? 1 : 0} a1={100} />
        <Lbl x={1100} y={565} t={["fingers x̂ · curl to ŷ · thumb ẑ", "fingers ŷ · curl to ẑ · thumb x̂", "fingers ẑ · curl to x̂ · thumb ŷ"][beat]} c={C.key} s={T.floor} o={fin(f, t1 + 6)} />
      </Svg>
      <TeX s={EQ_XY} x={1100} y={240} size={T.calc} o={fin(f, tXY)} c={C.key} glow={pulse(f, tXY, 24)} />
      <TeX s={EQ_YZ} x={1100} y={350} size={T.calc} o={fin(f, tYZ)} c={C.key} glow={pulse(f, tYZ, 24)} />
      <TeX s={EQ_ZX} x={1100} y={460} size={T.calc} o={fin(f, AT(k, 8, "z hat cross x hat"))} c={C.key} glow={pulse(f, t8, 24)} />
      <Svg><CycleWheel x={1690} y={740} r={80} o={fin(f, t9)} arcs={clamp((f - t9) / 45, 0, 3)} hi={-1} /></Svg>
    </Scene>
  );
};

const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_rhr_swap");
  const t1 = SS(k, 1), t2 = SS(k, 2), tOver = AT(k, 2, "turn your hand over"), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), tZY = AT(k, 5, "z hat cross y hat");
  const t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10);
  const st = camOf([{ ...AXK, f: 0, az: 225, el: 30, dist: 13.6, target: [0, 0, -0.15], pp: [560, 448] }], f);
  const pr = projector(st, W3, H3);
  const s = 1.4;
  const Pa = handPlace(UNIT[1], UNIT[2], s), Pb = handPlace(UNIT[1], [0, 0, -1], s), Pc = handPlace(UNIT[2], [-1, 0, 0], s), Pd = handPlace(UNIT[0], [0, -1, 0], s);
  const w1 = easeIO(clamp((f - t2) / 30, 0, 1)), w2 = easeIO(clamp((f - t5) / 20, 0, 1)), w3 = easeIO(clamp((f - t6) / 20, 0, 1));
  const q = f < t5 ? slerpQ(Pa.q, Pb.q, w1) : f < t6 ? slerpQ(Pb.q, Pc.q, w2) : slerpQ(Pc.q, Pd.q, w3);
  const pos = f < t5 ? lerp3(Pa.at, Pb.at, w1) : f < t6 ? lerp3(Pb.at, Pc.at, w2) : lerp3(Pc.at, Pd.at, w3);
  const beat = f < t5 ? 0 : f < t6 ? 1 : 2;
  const pairs: [number, number, number][] = [[1, 0, 2], [2, 1, 0], [0, 2, 1]];
  const [fi, se, re] = pairs[beat];
  const cols = [0, 1, 2].map((i) => (i === re ? C.muted : AX_COL(i, fi, se, -1)));
  const negRes = mul3(UNIT[re], -2.5);
  const showNeg = beat === 0 ? fin(f, t3, 12) : beat === 1 ? fin(f, tZY, 12) : fin(f, t6 + 10, 12);
  const cut = fin(f, t7 - 6, 12);
  const stF = camOf([{ ...FLOOR_K, az: 235, el: 20, dist: 18.5, target: [2.3, 1.3, -1.9] }], f), prF = projector(stF, W3, H3);
  const neg14: V3 = [0, 0, -AXB3[2]];
  const curl = f < t2 ? 0.1 : 0.1 + 0.75 * easeIO(clamp((f - t2 - 28) / 30, 0, 1));
  const want = fin(f, AT(k, 1, "curl them towards x hat"), 10) * fout(f, t3, 10);
  return (
    <Scene>
      {cut < 1 ? <div style={{ opacity: 1 - cut }}>
        <View3D st={st}>
          <AxesTriad cols={cols} />
          <Arrow3D from={[0, 0, 0]} to={negRes} color={ROT} px={14} head={48} dash o={showNeg} grow={showNeg} />
          <Hand3D q={q} at={pos} s={s} angles={POSE.curl(curl)} glow={{ thumb: showNeg > 0.5 ? ROT : undefined }} />
        </View3D>
        <Svg>
          <AxesLabels pr={pr} cols={cols} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={negRes} t={["−ẑ", "−x̂", "−ŷ"][beat]} c={ROT} s={T.calc} o={showNeg} />
          <CurlArrow pr={pr} q={q} at={pos} s={s} draw={1} o={showNeg} a1={100} />
          <Arc3 pr={pr} c0={[0, 0, 0]} e1={[0, 1, 0]} e2={[1, 0, 0]} r={1.6} a0={0} a1={90} col={C.gold} w={6} dash="12 10" o={want} />
        </Svg>
      </div> : null}
      {cut > 0 ? <div style={{ opacity: cut }}>
        <PairFloor st={stF} axb={1} axbNeg
          under={<Arc3 pr={prF} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={2.0} a0={ANG_B} a1={ANG_A} col={C.gold} w={5} />}
          over={<>
            <TipL3 pr={prF} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
            <TipL3 pr={prF} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
            <TipL3 pr={prF} from={[0, 0, 0]} to={neg14} t="b × a" c={ROT} s={T.key} />
            <L3 pr={prF} at={[0, 0, -AXB3[2] / 2]} t="−14" c={C.neg} s={T.key} dx={-80} />
            <Lbl x={120} y={130} t="first: b" c={C.second} s={T.key} o={fin(f, t7 + 10)} />
          </>} />
      </div> : null}
      <TeX s={EQ_XY} x={1100} y={170} size={T.key} c={C.local} o={0.6 * fin(f, t1)} />
      <TeX s={String.raw`\hat{\mathbf y}\times\hat{\mathbf x} = \ ?`} x={1100} y={260} size={T.calc} o={fin(f, AT(k, 1, "Point your fingers")) * fout(f, AT(k, 4, "minus z hat") - 8)} />
      <TeX s={EQ_YX} x={1100} y={260} size={T.calc} o={fin(f, AT(k, 4, "minus z hat")) * (1 - 0.6 * cut)} />
      <TeX s={EQ_ZY} x={1100} y={360} size={T.calc} o={fin(f, AT(k, 5, "minus x hat")) * (1 - 0.6 * cut)} />
      <TeX s={EQ_XZ} x={1100} y={460} size={T.calc} o={fin(f, AT(k, 6, "minus y hat")) * (1 - 0.6 * cut)} />
      <TeX s={EQ_BXA} x={1100} y={580} size={T.calc} o={fin(f, AT(k, 7, "minus fourteen"))} />
      <TeX s={EQ_ANTI} x={1100} y={705} size={T.eq} c={C.key} o={fin(f, AT(k, 9, "flips its arrow"))} glow={pulse(f, AT(k, 9, "flips its arrow") + 10, 24)} />
      <TeX s={EQ_DOTSYM} x={1100} y={815} size={T.key} c={C.local} o={fin(f, AT(k, 10, "a dot b equals"))} />
    </Scene>
  );
};

/** s16: the six results on a flat screen (x right, y up, z out of the screen) */
const SCREEN_K: OrbitKey = { f: 0, az: 270, el: 90, dist: 14, target: [0, 0, 0], pp: [520, 460] };
const MINI = { x: 1040, y: 380, w: 820, h: 480 };
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16_rhr_screen");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), tZY = AT(k, 7, "z hat cross y hat");
  const t8 = SS(k, 8), tXZ = AT(k, 8, "x hat cross z hat"), t9 = SS(k, 9), t10 = SS(k, 10);
  const st = camOf([{ ...AXK, f: 0, az: 225, el: 30, target: [0, 0, 0], pp: [520, 470], dist: 12 }, at(SCREEN_K, 30)], f);
  const pr = projector(st, W3, H3);
  const O = pr.p([0, 0, 0]);
  const appear = [t5, t6, t7, tZY, t8, tXZ];
  const keys = ["xy", "yx", "yz", "zy", "zx", "xz"] as const;
  const eqs = [EQ_XY, EQ_YX, EQ_YZ, EQ_ZY, EQ_ZX, EQ_XZ];
  const firsts: V3[] = [UNIT[0], UNIT[1], UNIT[1], UNIT[2], UNIT[2], UNIT[0]];
  const res = keys.map((kk) => (rhr.axes_pairs as Record<string, number[]>)[kk] as V3);
  const latest = appear.filter((a) => f >= a).length - 1;
  const compass = fin(f, t9, 16);
  const slot = (i: number): Pt => [i % 2 === 0 ? 1070 : 1460, 470 + 145 * Math.floor(i / 2)];
  // mini hands canvas: orthographic, same orientation as the screen (x right, y up), 100 px per unit
  const miniSt: CamState = { pos: [0, 0, 20], target: [0, 0, 0], up: [0, 1, 0], fov: 35, ortho: MINI.h / 100, pp: [MINI.w / 2, MINI.h / 2] };
  const mw = (p: Pt): V3 => [(p[0] - (MINI.x + MINI.w / 2)) / 100, -(p[1] - (MINI.y + MINI.h / 2)) / 100, 0];
  const curArrow = (i: number) => (i >= 2 ? res[i] : null);
  return (
    <Scene>
      <View3D st={st}>
        {[0, 1, 2].map((i) => <Rod3D key={i} a={mul3(UNIT[i], -3)} b={mul3(UNIT[i], 3)} px={4} color={C.muted} />)}
        {latest >= 2 && compass < 1 ? (() => {
          const hq = handQuat(firsts[latest], res[latest]);
          const o = fin(f, appear[latest], 10) * (1 - compass) * (latest + 1 < appear.length ? fout(f, appear[latest + 1] - 8, 8) : 1);
          return <Hand3D q={hq} at={add3(mul3(firsts[latest], -0.5), res[latest], 0.6)} s={1.25} angles={POSE.curl(0.75)} o={o} glow={{ thumb: ROT }} glowK={0.8} />;
        })() : null}
        {res.map((r, i) => {
          if (i < 2) return null;
          const o = compass > 0 ? compass : i === latest ? fin(f, appear[i], 10) : 0;
          const neg = i % 2 === 1;
          return <Arrow3D key={i} from={[0, 0, 0]} to={mul3(r, 2.3)} color={ROT} px={14} head={48} dash={neg} o={o} grow={o} />;
        })}
      </View3D>
      <View3D st={miniSt} x={MINI.x} y={MINI.y} w={MINI.w} h={MINI.h} o={0}>
        {keys.map((kk, i) => {
          const o = fin(f, appear[i], 10);
          if (o <= 0) return null;
          const p = slot(i);
          const hp = handQuat(firsts[i], res[i]);
          const c = add3(mw([p[0] + 300, p[1] + 6]), [0, 0, 0]);
          return <Hand3D key={kk} q={hp} at={add3(c, mul3(firsts[i], -0.25))} s={0.62} angles={POSE.curl(0.8)} o={o} glow={{ thumb: ROT }} glowK={0.8} />;
        })}
      </View3D>
      <Svg>
        <L3 pr={pr} at={[3.2, 0, 0]} t="x" c={C.muted} s={T.key} o={fin(f, 20)} />
        <L3 pr={pr} at={[0, 3.25, 0]} t="y" c={C.muted} s={T.key} o={fin(f, 20)} />
        <Keyword f={f} text="right" at={[pr.p([3.2, 0, 0])[0] - 40, pr.p([3.2, 0, 0])[1] + 60]} appear={AT(k, 0, "x pointing right")} targets={[]} />
        <Keyword f={f} text="up" at={[pr.p([0, 3.25, 0])[0] + 50, pr.p([0, 3.25, 0])[1]]} appear={AT(k, 0, "y pointing up")} targets={[]} />
        <CircleDot x={O[0]} y={O[1]} r={34} o={fin(f, t1) * (latest < 0 ? 1 : 0)} />
        <Lbl x={O[0] + 60} y={O[1] + 50} t="z" c={C.muted} s={T.key} o={fin(f, t1) * (latest < 0 ? 1 : 0)} />
        <Keyword f={f} text="six results on a flat screen" at={[1100, 150]} appear={6} out={SS(k, 2) - 6} targets={[]} />
        <Keyword f={f} text="out of the screen" at={[O[0] + 60, O[1] + 130]} appear={AT(k, 1, "out of the screen")} out={t5} targets={[]} />
        <CircleDot x={1130} y={150} r={48} o={fin(f, t2)} />
        <g opacity={fin(f, t2 + 10) * fout(f, t3 + 30)}>
          <Arrow p={[1440 + 60 * clamp((f - t2 - 10) / 50, 0, 1), 230]} q={[1600 + 60 * clamp((f - t2 - 10) / 50, 0, 1), 230]} color={ROT} w={8} head={30} />
          <Observer x={1760} y={250} s={1.6} />
        </g>
        <Lbl x={1210} y={150} t="dot in a circle" c={C.key} s={T.key} o={fin(f, AT(k, 2, "dot in a circle"))} />
        <CircleCross x={1130} y={280} r={48} o={fin(f, t3)} />
        <g opacity={fin(f, t4) * fout(f, t5 + 20)}>
          <Arrow p={[1640 - 80 * clamp((f - t4) / 50, 0, 1), 380]} q={[1480 - 80 * clamp((f - t4) / 50, 0, 1), 380]} color={ROT} w={8} head={30} />
          <Observer x={1760} y={400} s={1.6} />
        </g>
        <Lbl x={1210} y={280} t="cross in a circle" c={C.key} s={T.key} o={fin(f, AT(k, 3, "cross in a circle"))} />
        {/* the latest result at the origin (⊙ / ⊗ for ±z) */}
        <CircleDot x={O[0]} y={O[1]} r={40} o={latest === 0 && compass === 0 ? 1 : 0} />
        <CircleCross x={O[0]} y={O[1]} r={40} o={latest === 1 && compass === 0 ? 1 : 0} />
        {/* compass layout */}
        <g opacity={compass}>
          <CircleDot x={O[0] - 150} y={O[1] - 150} r={36} />
          <CircleCross x={O[0] + 150} y={O[1] + 150} r={36} />
          <Lbl x={O[0] - 150} y={O[1] - 210} t="out of" c={C.key} s={T.floor} a="middle" />
          <Lbl x={O[0] + 150} y={O[1] + 215} t="into" c={C.key} s={T.floor} a="middle" />
        </g>
        {res.map((r, i) => {
          if (i < 2) return null;
          const o = compass > 0 ? compass : i === latest ? fin(f, appear[i] + 8, 10) : 0;
          return <MinusGlyph key={i} x={pr.p(mul3(r, 1.4))[0] + (r[1] !== 0 ? 50 : 0)} y={pr.p(mul3(r, 1.4))[1] + (r[0] !== 0 ? -50 : 0)} o={i % 2 === 1 ? o : 0} />;
        })}
        <Lbl x={1460} y={845} t="up · down · left · right · into · out of" c={C.key} s={T.key} a="middle" o={0} />
      </Svg>
      {eqs.map((e, i) => {
        const p = slot(i);
        return <TeX key={i} s={e} x={p[0]} y={p[1]} size={T.key} o={fin(f, appear[i], 10) * (1 - 0.0 * compass)} c={C.key} />;
      })}
      <Svg><Lbl x={520} y={840} t="up · down · left · right · into · out of" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 9, "into or out of"))} /></Svg>
    </Scene>
  );
};

const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_rhr_views");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const base = { ...FLOOR_K, dist: 13.5, pp: [540, 470] as Pt };
  const top = { ...base, az: 270, el: 89.9, target: [0, 0, 0] as V3, dist: 16, pp: [300, 640] as Pt };
  const bot = { ...base, az: 270, el: -89.9, target: [0, 0, 0] as V3, dist: 16, pp: [700, 640] as Pt, up: [0, 1, 0] as V3 };
  const st = camOf([{ ...base, f: 0 }, { ...top, f: t1 + 20 }, { ...top, f: t3 }, { ...bot, f: t3 + 50 }, { ...bot, f: t5 },
    { ...base, f: t5 + 40, az: 200, el: 4, target: [2.5, 1.5, 1.2] },
    { ...base, f: t6 + 10, az: 200, el: 4, target: [2.5, 1.5, 1.2] }, { ...base, f: t6 + 50, az: 230, el: 30, target: [2.5, 1.5, 1.0] }], f);
  const pr = projector(st, W3, H3);
  const O = pr.p([0, 0, 0]);
  const above = f >= t1 + 20 && f < t3, below = f >= t3 + 50 && f < t5;
  const icon = (y: number, cw: boolean) => (
    <g>
      <path d={cw ? `M 1150 ${y - 30} A 40 40 0 1 1 1110 ${y - 30}` : `M 1110 ${y - 30} A 40 40 0 1 0 1150 ${y - 30}`} fill="none" stroke={C.gold} strokeWidth={5} />
      {cw ? <CircleCross x={1130} y={y + 8} r={16} w={4} /> : <CircleDot x={1130} y={y + 8} r={16} w={4} />}
    </g>
  );
  return (
    <Scene>
      <PairFloor st={st} axb={1} grid={1}
        children={<Plane3D x0={-1} x1={6} y0={-1} y1={4} o={0.3} />}
        under={<Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={1.9} a0={ANG_A} a1={ANG_B} col={C.gold} />}
        over={<>
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
          <CircleDot x={O[0]} y={O[1]} r={36} o={above ? fin(f, AT(k, 2, "points up")) : 0} />
          <CircleCross x={O[0]} y={O[1]} r={36} o={below ? fin(f, AT(k, 4, "points away")) : 0} />
          {!above && !below ? <TipL3 pr={pr} from={[0, 0, 0]} to={AXB3} t="a × b" c={ROT} s={T.key} /> : null}
        </>} />
      <Svg>
        <g opacity={fin(f, t1 + 20) * fout(f, t3)}>
          <Lbl x={1150} y={280} t="from above" c={C.key} s={T.key} />
          <Lbl x={1150} y={360} t="anticlockwise" c={C.gold} s={T.key} o={fin(f, AT(k, 2, "anticlockwise"))} />
          <Lbl x={1150} y={440} t="towards you" c={ROT} s={T.key} o={fin(f, AT(k, 2, "straight at you"))} />
        </g>
        <g opacity={fin(f, t3 + 40) * fout(f, t5)}>
          <Lbl x={1150} y={280} t="from below" c={C.key} s={T.key} />
          <Lbl x={1150} y={360} t="clockwise" c={C.gold} s={T.key} o={fin(f, AT(k, 4, "looks clockwise"))} />
          <Lbl x={1150} y={440} t="away" c={ROT} s={T.key} o={fin(f, AT(k, 4, "away from you"))} />
        </g>
        <g opacity={fin(f, t5 + 30) * fout(f, t6 + 10)}>
          <Lbl x={1150} y={280} t="from the side" c={C.key} s={T.key} />
          <Lbl x={1150} y={360} t="up" c={ROT} s={T.key} />
        </g>
        <g opacity={fin(f, t7)}>{icon(640, false)}<Lbl x={1185} y={630} t="anticlockwise → towards you" c={C.key} s={50} /></g>
        <g opacity={fin(f, t8)}>{icon(780, true)}<Lbl x={1185} y={770} t="clockwise → away from you" c={C.key} s={50} /></g>
      </Svg>
    </Scene>
  );
};

// ================================================================ s18 one arrow fixed, the other turns
const PANEL_K: OrbitKey = { f: 0, az: 240, el: 30, dist: 6.2, target: [0.8, 0.4, 0.5], pp: [480, 400] };
const PANELS = [{ x: 80, y: 250 }, { x: 680, y: 250 }, { x: 1280, y: 250 }];
const PW = 960, PH = 720, PS0 = 0.583;
const PANEL_BIG: OrbitKey = { ...PANEL_K, f: 100, az: 300, el: 34, dist: 7.4, target: [0.9, -0.4, -0.4], pp: [470, 360] };
const Panel: React.FC<{ q: V3; pz: number; o: number; i: number; big?: number; grid?: number; tick?: number; rect?: number; hiQ?: number; qO?: number; pzO?: number }> = ({
  q, pz, o, i, big = 0, tick = 0, rect = 0, qO = 1, pzO = 1 }) => {
  const st = orbitCam(orbitPath([PANEL_K, PANEL_BIG], 100 * big), [0, 0]);
  const scale = PS0 + (1 - PS0) * big;
  const x = PANELS[i].x + (480 - PANELS[i].x) * big, y = PANELS[i].y + (110 - PANELS[i].y) * big;
  const pr0 = projector(st, PW, PH, 0, 0);
  const mp = (v: V3): Pt => { const p = pr0.p(v); return [x + p[0] * scale, y + p[1] * scale]; };
  const neg = pz < -0.005, zero = Math.abs(pz) < 0.005;
  const qh = norm3(q);
  if (o <= 0) return null;
  const gridLines: React.ReactNode[] = [];
  for (let g = -2; g <= 3; g++) {
    const a = mp([g, -2, 0]), b = mp([g, 3, 0]); gridLines.push(<line key={`a${g}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.grid} strokeWidth={1.5} />);
    const c = mp([-2, g, 0]), d = mp([3.5, g, 0]); gridLines.push(<line key={`b${g}`} x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} stroke={C.grid} strokeWidth={1.5} />);
  }
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o }}>
      <Svg>{gridLines}</Svg>
      <div style={{ position: "absolute", left: x, top: y, width: PW, height: PH, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
        <View3D st={st} w={PW} h={PH}>
          <Quad3D pts={[[0, 0, 0.004], [3, 0, 0.004], [3 + q[0], q[1], 0.004], [q[0], q[1], 0.004]]} color={ROT} o={(0.18 + 0.12 * rect) * qO} />
          <Arrow3D from={[0, 0, 0]} to={[3, 0, 0]} color={C.first} />
          <Arrow3D from={[0, 0, Math.abs(qh[1]) < 0.01 && qh[0] > 0 ? 0.16 : 0]} to={add3(q, [0, 0, Math.abs(qh[1]) < 0.01 && qh[0] > 0 ? 0.16 : 0])} color={C.second} o={qO} grow={qO} />
          {!zero && pzO > 0 ? <Arrow3D from={[0, 0, 0]} to={[0, 0, pz * DS]} color={ROT} px={14} head={44} dash={neg} onTop={big > 0} o={pzO} /> : null}
        </View3D>
      </div>
      <Svg>
        <Tick3 pr={{ ...pr0, p: mp } as ReturnType<typeof projector>} at={[0, 0, 0]} u1={[1, 0, 0]} u2={qh} s={0.4} o={tick} c={C.ink} w={4} />
        <Lbl x={mp([3.25, 0, 0])[0] + 8} y={mp([3.25, 0, 0])[1] - 26} t="p" c={C.first} s={T.key} a="start" />
        {!zero && pzO > 0 ? <Lbl x={mp([0, 0, pz * DS])[0] + 40} y={mp([0, 0, pz * DS])[1]} t={neg ? "−" : ""} c={C.neg} s={T.calc} o={pzO} /> : null}
      </Svg>
    </div>
  );
};
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_cases");
  const t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9);
  const t10 = SS(k, 10), t11 = SS(k, 11), t12 = SS(k, 12), t13 = SS(k, 13), t14 = SS(k, 14), tCW = AT(k, 14, "becomes clockwise"), t15 = SS(k, 15);
  const big = easeIO(clamp((f - t14) / 30, 0, 1));
  const sw = clamp((f - t14 - 30) / (SE(k, 15) - t14 - 40), 0, 1);
  const th2 = 90 + 180 * easeIO(sw);
  const q2 = (big > 0 ? idx(sweep.q_xyz as number[][], th2 / 360) : cases.q[1]) as V3;
  const pz2 = big > 0 ? interp(th2, sweep.theta_deg, sweep.pxq_z) : cases.p_cross_q[1][2] * fin(f, t9, 20);
  const oth = 1 - big;
  const pTop = fin(f, 10) * fout(f, t14);
  const under = (i: number, lines: { t: string; o: number; c?: string; tex?: boolean }[]) => lines.map((l, j) =>
    l.tex ? <TeX key={j} s={l.t} x={PANELS[i].x + 280} y={720 + 66 * j} size={T.key} ax={0.5} o={l.o * oth} c={l.c ?? C.ink} />
      : <Svg key={j}><Lbl x={PANELS[i].x + 280} y={720 + 66 * j} t={l.t} c={l.c ?? C.key} s={T.key} a="middle" o={l.o * oth} /></Svg>);
  return (
    <Scene>
      <Svg>
        <g opacity={pTop}>
          <Arrow p={[690, 190]} q={[880, 190]} color={C.first} w={8} head={28} />
          <Lbl x={900} y={190} t="p = (3, 0, 0)" c={C.first} s={T.key} />
        </g>
      </Svg>
      <Panel i={0} q={cases.q[0] as V3} pz={0} o={fin(f, t2 + 30) * oth} qO={fin(f, AT(k, 3, "q points"), 16)} />
      <Panel i={1} q={q2} pz={pz2} o={fin(f, t2 + 40)} big={big} tick={fin(f, t7) * (1 - big)} rect={pulse(f, t8 + 10, 30)} qO={fin(f, AT(k, 6, "q is at a right angle"), 16)} />
      <Panel i={2} q={cases.q[2] as V3} pz={0} o={fin(f, t2 + 50) * oth} qO={fin(f, AT(k, 10, "q points"), 16)} />
      {under(0, [{ t: "same direction", o: fin(f, t3 + 20) }, { t: EQ_PQ0, o: fin(f, t5), tex: true }])}
      {under(1, [{ t: "right angle", o: fin(f, t6) }, { t: EQ_PQ6, o: fin(f, t9 + 20), tex: true }])}
      {under(2, [{ t: "opposite", o: fin(f, t10 + 30) }, { t: EQ_PQ0, o: fin(f, t11), tex: true }])}
      <Svg>
        {[0, 1, 2].map((i) => <Lbl key={i} x={PANELS[i].x + 280} y={270} t={["q = (2, 0, 0)", "q = (0, 2, 0)", "q = (−2, 0, 0)"][i]} c={C.second} s={T.key} a="middle"
          o={fin(f, [t3 + 10, t7, t10 + 20][i]) * oth} />)}
        {[0, 1, 2].map((i) => <Lbl key={`a${i}`} x={PANELS[i].x + 280} y={852} t={`area ${[0, 6, 0][i]}`} c={C.muted} s={T.floor} a="middle"
          o={fin(f, [t4 + 30, t8 + 20, t11 + 20][i]) * oth} />)}
        <Lbl x={960} y={110} t="same way or opposite → 0" c={C.key} s={T.key} a="middle" o={fin(f, t12) * oth * fout(f, t14)} />
        <Lbl x={960} y={190} t="right angle → longest" c={C.key} s={T.key} a="middle" o={fin(f, t13) * oth * fout(f, t14)} />
        <Keyword f={f} text="fix one arrow, turn the other" at={[960, 480]} a="middle" appear={6} out={t2 + 20} targets={[]} />
        <Keyword f={f} text="as for the dot product" at={[960, 590]} a="middle" appear={SS(k, 1)} out={t2 + 20} targets={[]} c={C.local} />
        {/* top-view inset: the turn p → q reads clockwise from above once q passes the opposite direction */}
        <g opacity={fin(f, tCW) * big}>
          <circle cx={1650} cy={300} r={120} fill="#1d2740" stroke={C.grid} strokeWidth={3} />
          <Arrow p={[1650, 300]} q={[1750, 300]} color={C.first} w={7} head={24} halo={false} />
          <Arrow p={[1650, 300]} q={[1650 + 70 * Math.cos(th2 * D2R), 300 - 70 * Math.sin(th2 * D2R)]} color={C.second} w={7} head={24} halo={false} />
          <path d={`M ${1650 + 48} 300 A 48 48 0 0 1 ${1650 + 48 * Math.cos(th2 * D2R)} ${300 - 48 * Math.sin(th2 * D2R)}`} fill="none" stroke={C.gold} strokeWidth={5} />
          <Lbl x={1650} y={470} t="clockwise · from above" c={C.key} s={T.floor} a="middle" />
        </g>
      </Svg>
      <TeX s={EQ_PQM6} x={1390} y={640} size={T.key} ax={0} o={fin(f, t15 + 10) * big} c={C.neg} />
    </Scene>
  );
};

// ================================================================ s19 the two products side by side
const GRID_Y = [235, 330, 425, 520, 615, 710, 805];
const MiniRow: React.FC<{ i: number; o: number }> = ({ i, o }) => {
  if (o <= 0) return null;
  const y = GRID_Y[i], x = 140;
  return (
    <g opacity={o}>
      {i === 0 ? <><Arrow p={[x, y + 25]} q={[x + 110, y + 5]} color={C.first} w={7} head={22} halo={false} /><Arrow p={[x, y + 25]} q={[x + 30, y - 30]} color={C.second} w={7} head={22} halo={false} /></> : null}
      {i === 1 ? <path d={Array.from({ length: 41 }, (_, j) => `${j ? "L" : "M"}${x + j * 6} ${y + 10 - 30 * Math.sin((j / 40) * Math.PI)}`).join("")} fill="none" stroke={C.gold} strokeWidth={5} /> : null}
      {i === 2 ? <><line x1={x} y1={y + 25} x2={x + 70} y2={y + 25} stroke={C.first} strokeWidth={12} strokeOpacity={0.7} />
        <polygon points={`${x + 110},${y + 25} ${x + 190},${y + 25} ${x + 220},${y - 25} ${x + 140},${y - 25}`} fill={ROT} fillOpacity={0.3} stroke={ROT} strokeWidth={3} /></> : null}
      {i === 3 ? [0, 1, 2].map((j) => <g key={j}><Arrow p={[x + j * 80, y + 20]} q={[x + j * 80 + 50, y + 20]} color={C.first} w={5} head={14} halo={false} />
        <Arrow p={[x + j * 80, y + 20]} q={[x + j * 80 + 40 * Math.cos(j * Math.PI / 2), y + 20 - 40 * Math.sin(j * Math.PI / 2)]} color={C.second} w={5} head={14} halo={false} /></g>) : null}
      {i === 4 ? <g stroke={C.gold} strokeWidth={5} fill="none"><path d={`M ${x} ${y} Q ${x + 60} ${y - 40} ${x + 120} ${y}`} /><path d={`M ${x + 120} ${y + 20} Q ${x + 60} ${y + 60} ${x} ${y + 20}`} />
        <polyline points={`${x + 108},${y - 14} ${x + 120},${y} ${x + 104},${y + 6}`} /><polyline points={`${x + 12},${y + 34} ${x},${y + 20} ${x + 16},${y + 14}`} /></g> : null}
      {i === 5 ? <><g transform={`translate(${x + 40} ${y + 30}) scale(0.32)`}><rect x={-100} y={-64} width={200} height={44} rx={9} fill="#3a4766" stroke="#9aa6bd" strokeWidth={8} /></g>
        <line x1={x + 120} y1={y + 20} x2={x + 210} y2={y - 10} stroke="#c9d2e3" strokeWidth={10} strokeLinecap="round" /><circle cx={x + 120} cy={y + 20} r={14} fill="none" stroke="#c9d2e3" strokeWidth={6} /></> : null}
      {i === 6 ? <><MiniIsoMap x={x} y={y - 30} w={110} h={60} labels={false} arrows={false} />
        <Arrow p={[x + 150, y + 25]} q={[x + 220, y + 25]} color={C.first} w={6} head={18} halo={false} /><Arrow p={[x + 150, y + 25]} q={[x + 150, y - 35]} color={ROT} w={6} head={18} halo={false} /></> : null}
    </g>
  );
};
const S19: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19_grid");
  const at1 = (j: number, ph?: string) => (ph ? AT(k, j, ph) : SS(k, j));
  const cells: { dot: string; cross: string; td: number; tc: number; texD?: string; texC?: string }[] = [
    { dot: "a number", cross: "an arrow", td: at1(1, "gives a number"), tc: at1(1, "gives an arrow") },
    { dot: "cos θ", cross: "sin θ", td: at1(2), tc: at1(3) },
    { dot: "shadow × length", cross: "area", td: at1(4), tc: at1(5) },
    { dot: "same way", cross: "right angle", td: at1(6), tc: at1(7) },
    { dot: "same", cross: "flips", td: at1(8, "doesn't change"), tc: at1(8, "flips") },
    { dot: "work", cross: "torque", td: at1(9), tc: at1(10) },
    { dot: "advection", cross: "turns the wind", td: at1(11), tc: at1(12), texD: EQ_VGT },
  ];
  const cxD = 930, cxC = 1430;
  return (
    <Scene>
      <Svg>
        {cells.map((c, i) => <MiniRow key={i} i={i} o={fin(f, c.td - 6)} />)}
        {cells.map((c, i) => <g key={i}>
          {!c.texD ? <Lbl x={cxD} y={GRID_Y[i]} t={c.dot} c={C.key} s={T.key} a="middle" o={fin(f, c.td)} /> : <Lbl x={cxD - 60} y={GRID_Y[i]} t={c.dot} c={C.key} s={T.key} a="start" o={fin(f, c.td + 6)} />}
          {!c.texC ? <Lbl x={cxC} y={GRID_Y[i]} t={c.cross} c={C.key} s={T.key + 6 * pulse(f, i >= 5 ? SE(k, 12) - 20 : -99, 30)} a="middle" o={fin(f, c.tc)} /> :
            <Lbl x={cxC + 10} y={GRID_Y[i]} t={c.cross} c={C.key} s={T.key + 6 * pulse(f, SE(k, 12) - 20, 30)} a="start" o={fin(f, c.tc + 6)} />}
          <line x1={cxC - 150} y1={GRID_Y[i] + 38} x2={cxC + 150} y2={GRID_Y[i] + 38} stroke={C.gold} strokeWidth={5} opacity={fin(f, c.tc + 8)} />
        </g>)}
      </Svg>
      <TeX s={ctex(C.first, String.raw`\mathbf a`) + String.raw`\cdot` + ctex(C.second, String.raw`\mathbf b`)} x={cxD} y={130} size={T.calc} ax={0.5} o={fin(f, 6)} />
      <TeX s={ctex(C.first, String.raw`\mathbf a`) + ctex(ROT, String.raw`\times`) + ctex(C.second, String.raw`\mathbf b`)} x={cxC} y={130} size={T.calc} ax={0.5} o={fin(f, 6)} />
      <TeX s={EQ_VGT} x={cxD - 72} y={GRID_Y[6] + 8} size={T.key} ax={1} c={C.first} o={fin(f, cells[6].td)} />
    </Scene>
  );
};

// ================================================================ s20–s21 torque with a spanner
const SPAN_K: OrbitKey = { f: 0, az: 235, el: 42, dist: 0.95, target: [0.15, 0.03, 0.0], pp: [470, 470] };
const TSC = 0.012; // τ arrow: display metres per newton metre (its own scale; the value is written)
const S20: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20_torque");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), tTau = AT(k, 4, "written tau"), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10);
  const st = camOf([SPAN_K], f), pr = projector(st, W3, H3);
  // F angle from the spanner: 90° → 30° (S9) → 0° (S11), from torque.json alpha_deg
  const al = [torque.alpha_deg[0], torque.alpha_deg[1], torque.alpha_deg[2]];
  const aNow = lerpA(f, [[t8 - 4, al[0]], [t8 + 20, al[1]], [t10 - 4, al[1]], [t10 + 20, al[2]]]);
  const tauNow = interpA(aNow, al.slice().reverse(), torque.tau_z.slice().reverse());
  const grip: V3 = [0.3, 0, 0.022];
  const Fv: V3 = [0.16 * Math.cos(aNow * D2R), 0.16 * Math.sin(aNow * D2R), 0];
  const [T90L, T90R] = splitEq(EQ_T90), T90P = eqPieces(T90R), [, T30R] = splitEq(EQ_T30), T30P = eqPieces(T30R);
  return (
    <Scene>
      <View3D st={st}>
        <Spanner3D angle={0} />
        <Arrow3D from={[0, 0, 0.022]} to={grip} color={C.first} grow={fin(f, t2, 16)} />
        <Arrow3D from={grip} to={add3(grip, Fv)} color={C.second} grow={fin(f, t3, 16)} />
        {Math.abs(tauNow) > 0.05 ? <Arrow3D from={[0, 0, 0.03]} to={[0, 0, 0.03 + tauNow * TSC * fin(f, t6 + 30, 20)]} color={ROT} px={14} head={44} /> : null}
      </View3D>
      <Svg>
        <TipL3 pr={pr} from={[0, 0, 0.022]} to={grip} t={f < t8 ? "r = 0.3 m" : "r"} c={C.first} s={T.key} o={fin(f, AT(k, 2, "zero point three"))} side={-80} gap={10} />
        <TipL3 pr={pr} from={grip} to={add3(grip, Fv)} t={f < t8 ? "F = 50 N" : "F"} c={C.second} s={T.key} o={fin(f, AT(k, 3, "fifty newtons"))} gap={30} />
        <Lbl x={120} y={830} t="N = newton" c={C.muted} s={T.floor} o={fin(f, AT(k, 3, "fifty newtons") + 10) * fout(f, t6)} />
        <Lbl x={120} y={830} t="N m = newton metre" c={C.muted} s={T.floor} o={fin(f, t7) * fout(f, t10)} />
        {aNow < 89 && aNow > 1 ? <Arc3 pr={pr} c0={grip} e1={[1, 0, 0]} e2={[0, 1, 0]} r={0.09} a0={0} a1={aNow} col={C.gold} head={false} /> : null}
        <L3 pr={pr} at={add3(grip, [0.15 * Math.cos(12 * D2R), 0.15 * Math.sin(12 * D2R), 0])} t="30°" c={C.gold} s={T.key} a="start" dx={10} o={fin(f, t8 + 20) * fout(f, t10)} />
        {Math.abs(tauNow) > 0.05 ? <L3 pr={pr} at={[0, 0, 0.03 + tauNow * TSC]} t="τ" c={ROT} s={T.calc} dx={50} o={fin(f, t6 + 40)} /> : null}
        <Keyword f={f} text="torque" at={[1200, 260]} appear={AT(k, 4, "called torque")} targets={[]} />
        <Lbl x={1080} y={800} t="sin 30° = 0.5" c={C.gold} s={T.key} o={fin(f, AT(k, 8, "one half")) * fout(f, t10)} />
        <Keyword f={f} text="no turn" at={[1500, 800]} appear={AT(k, 10, "the bolt doesn't turn")} targets={[]} />
      </Svg>
      <TeX s={EQ_TAU} x={1080} y={140} size={T.eq} o={fin(f, AT(k, 5, "tau equals"))} />
      <Svg>
        <Keyword f={f} text="why physics needs it" at={[1200, 420]} appear={6} out={t2 - 6} targets={[]} />
        <Keyword f={f} text="turning a bolt" at={[1200, 520]} appear={AT(k, 1, "turning a bolt")} out={t6} targets={[]} />
      </Svg>
      <CalcStack f={f} x={1230} y={340} size={60} maxLines={4} rows={[
        { lhs: T90L, rhs: T90P[0], at: t6 + 10, h: 84 },
        { rhs: rep(T90P[1], "15", String.raw`\mathbf{15}`), at: AT(k, 7, "fifteen"), cont: true, c: C.key, h: 100 },
        { lhs: T90L, rhs: T30P[0], at: t8 + 20, h: 84 },
        { rhs: rep(T30P[1], "7.5", String.raw`\mathbf{7.5}`), at: AT(k, 9, "seven point five"), cont: true, c: C.key, h: 100 },
        { lhs: T90L, rhs: "= 0", at: AT(k, 10, "the torque is zero"), h: 84 },
      ]} />
    </Scene>
  );
};
/** piecewise-linear value from [frame, value] keys (eased between keys) */
const lerpA = (f: number, keys: [number, number][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) return keys[i - 1][1] + (keys[i][1] - keys[i - 1][1]) * easeIO((f - keys[i - 1][0]) / Math.max(1, keys[i][0] - keys[i - 1][0]));
  return keys[keys.length - 1][1];
};
/** τ at the current angle: |r||F| sin α interpolated between the data's three angles (sin is monotone on 0–90°) */
const interpA = (a: number, as: number[], ts: number[]) => {
  const s = Math.sin(a * D2R), ss = as.map((x) => Math.sin(x * D2R));
  return interp(s, ss, ts);
};
const S21: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21_torque_axis");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), tUp = AT(k, 3, "if it points up"), t4 = SS(k, 4), t5 = SS(k, 5);
  const st = camOf([{ ...SPAN_K, dist: 1.2, target: [0.12, 0.03, 0.05] }], f), pr = projector(st, W3, H3);
  const loosen = f >= tUp && f < t4;
  // tighten: push towards −y (clockwise from above), the spanner turns clockwise and the bolt sinks; then the reverse
  const turnT = -0.5 * easeIO(clamp((f - t2 - 10) / (tUp - t2 - 20), 0, 1));
  const turnL = 0.5 * easeIO(clamp((f - tUp) / (SE(k, 3) - tUp), 0, 1));
  const turnT2 = -0.5 * easeIO(clamp((f - t4) / 40, 0, 1));
  const ang = turnT + turnL + turnT2;
  const sink = -0.006 * 3 * (ang / (Math.PI / 6)) * 0.33;
  const c = Math.cos(ang), s = Math.sin(ang);
  const grip: V3 = [0.3 * c, 0.3 * s, 0.022 - sink];
  const tau = (loosen ? torque.loosen[2] : torque.tighten[2]) as number;
  const Fd: V3 = loosen ? [-s * 0.16, c * 0.16, 0] : [s * 0.16, -c * 0.16, 0];
  const hb = loosen ? handPlace([c, s, 0], [0, 0, 1], 0.12, 0.6) : handPlace([c, s, 0], [0, 0, -1], 0.12, -0.2);
  const handO = fin(f, t2, 12) * fout(f, t4 + 20, 12);
  const curl = 0.3 + 0.6 * easeIO(clamp((f - t2 - 6) / 30, 0, 1));
  return (
    <Scene>
      <View3D st={st}>
        <Spanner3D angle={ang} sink={-sink} />
        <Arrow3D from={[0, 0, 0.022 - sink]} to={grip} color={C.first} />
        <Arrow3D from={grip} to={add3(grip, Fd)} color={C.second} />
        <Arrow3D from={[0, 0, 0.03]} to={[0, 0, 0.03 + tau * TSC]} color={ROT} px={14} head={44} dash={tau < 0} o={1 + 0.0 * pulse(f, 6, 30)} />
        <Hand3D q={hb.q} at={add3(hb.at, [0, 0, loosen ? 0.03 : 0.16])} s={0.12} angles={POSE.curl(curl)} o={handO} glow={{ thumb: ROT }} glowK={fin(f, t3, 10)} />
      </View3D>
      <Svg>
        <TipL3 pr={pr} from={[0, 0, 0.022]} to={grip} t="r" c={C.first} s={T.calc} side={-40} />
        <TipL3 pr={pr} from={grip} to={add3(grip, Fd)} t="F" c={C.second} s={T.calc} />
        <L3 pr={pr} at={[0, 0, 0.03 + tau * TSC]} t="τ" c={ROT} s={T.calc} dx={50} />
        {tau < 0 ? <MinusGlyph x={pr.p([0, 0, 0.03 + tau * TSC * 0.5])[0] - 50} y={pr.p([0, 0, 0.03 + tau * TSC * 0.5])[1]} /> : null}
        <Keyword f={f} text="along the axis" at={[1080, 160]} appear={AT(k, 0, "along the bolt's axis")} out={t4 - 6} targets={[]} />
        <Keyword f={f} text="which way? right hand" at={[1080, 280]} appear={AT(k, 1, "right-hand rule")} out={t4 - 6} targets={[]} />
        <Keyword f={f} text="curl: r → F" at={[1080, 390]} appear={AT(k, 2, "Curl your fingers")} out={t4 - 6} targets={[]} />
        <Keyword f={f} text="thumb down: tightens" at={[1080, 500]} appear={AT(k, 3, "the bolt tightens")} out={t4 - 6} targets={[]} />
        <Keyword f={f} text="thumb up: loosens" at={[1080, 600]} appear={AT(k, 3, "the bolt loosens")} out={t4 - 6} targets={[]} />
        {/* top view inset: bolt, clockwise arc, ⊗ */}
        <g opacity={fin(f, t4)}>
          <polygon points={Array.from({ length: 6 }, (_, i) => `${1630 + 70 * Math.cos((i * Math.PI) / 3)},${260 + 70 * Math.sin((i * Math.PI) / 3)}`).join(" ")} fill="#3a4766" stroke="#c9d2e3" strokeWidth={4} />
          <path d="M 1740 260 A 110 110 0 0 1 1630 370" fill="none" stroke={C.gold} strokeWidth={6} />
          <polyline points="1650,356 1630,370 1652,384" fill="none" stroke={C.gold} strokeWidth={6} />
          <CircleCross x={1630} y={260} r={30} w={5} />
          <Lbl x={1630} y={440} t="clockwise · from above" c={C.key} s={T.floor} a="middle" />
          <Lbl x={1630} y={500} t="→ away" c={ROT} s={T.floor} a="middle" />
        </g>
        <Keyword f={f} text="how strongly" at={[1080, 620]} appear={AT(k, 5, "how strongly")} targets={[]} />
        <Keyword f={f} text="which way" at={[1080, 720]} appear={AT(k, 5, "and which way")} targets={[]} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s22 the door again
const S22: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22_door_again");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), tDown = AT(k, 4, "and down when"), t5 = SS(k, 5), t6 = SS(k, 6);
  const open = 45 * D2R * easeIO(clamp((f - AT(k, 1, "the largest torque")) / 24, 0, 1));
  const close = 45 * D2R * easeIO(clamp((f - tDown) / 24, 0, 1));
  const sw = open - close;
  const along = f >= t2 && f < t3 + 10, back = f >= tDown - 6;
  const tauV = back ? 1 : along ? 1 - fin(f, t2 + 10, 14) : fin(f, t1 + 10, 14);
  const st = orbitCam(DOOR_K, PP), pr = projector(st, W3, H3);
  return (
    <Scene>
      <DoorScene f={f} swing={sw} showR={1} showF={1} Fdir={back ? "back" : along ? "along" : "perp"} tau={tauV * Math.abs(door.tau_z[back ? 2 : 0])} tauNeg={back}
        over={<>
          <L3 pr={pr} at={[0, 0, back ? 2.15 - 0.55 * tauV * Math.abs(door.tau_z[2]) : 2.05 + 0.6 * tauV * Math.abs(door.tau_z[0])]} t={back ? "down" : "up"} c={ROT} s={T.key} a="end" dx={-40} o={tauV} />
          <MinusGlyph x={pr.p([0, 0, 1.85])[0] - 50} y={pr.p([0, 0, 1.85])[1]} o={back ? 1 : 0} />
        </>} />
      <TeX s={EQ_TAU} x={1100} y={140} size={T.eq} o={fin(f, 8)} />
      <Svg>
        <Lbl x={1100} y={280} t="largest" c={ROT} s={T.key} o={fin(f, AT(k, 1, "the largest torque")) * fout(f, t3)} />
        <Lbl x={1100} y={370} t="r × F = 0" c={C.key} s={T.key} o={fin(f, AT(k, 2, "gives none")) * fout(f, t3 + 20)} />
        <Lbl x={1100} y={300} t="up · opens" c={C.key} s={T.key} o={fin(f, AT(k, 4, "It points up"))} />
        <Lbl x={1100} y={390} t="down · closes" c={C.key} s={T.key} o={fin(f, tDown + 10)} />
        <g opacity={fin(f, AT(k, 6, "largest at right angles"))}><Check x={1110} y={560} /><Lbl x={1160} y={560} t="largest at right angles" c={C.key} s={T.key} /></g>
        <g opacity={fin(f, AT(k, 6, "tells left from right"))}><Check x={1110} y={660} /><Lbl x={1160} y={660} t="left or right" c={C.key} s={T.key} /></g>
      </Svg>
    </Scene>
  );
};

// ================================================================ s23 k × : the turning tool
const MAP_K: OrbitKey = { f: 0, az: 240, el: 35, dist: 12.5, target: [0, 0.3, 0.4], pp: [540, 480] };
const US = 0.42; // map units per m/s (display)
const S23: React.FC = () => {
  const f = useCurrentFrame(), k = K("s23_k_cross");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), tN = AT(k, 6, "it points north"), t7 = SS(k, 7), t8 = SS(k, 8);
  const t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11), t12 = SS(k, 12);
  const st = camOf([at(MAP_K, 0), at(MAP_K, t11), { ...MAP_K, f: t11 + 40, az: 270, el: 89.9, dist: 14, target: [0, 0.2, 0] }], f);
  const pr = projector(st, W3, H3);
  const tex = useTex(staticFile("cp/bmng.jpg"));
  const patch = React.useMemo(() => { if (!tex) return null; const t = tex.clone(); t.repeat.set(0.07, 0.14); t.offset.set(0.32, 0.62); t.needsUpdate = true; return t; }, [tex]);
  const rot = 90 * easeIO(clamp((f - t9) / 24, 0, 1));
  const uA = rot * D2R;
  const u: V3 = [5 * US * Math.cos(uA), 5 * US * Math.sin(uA), 0];
  const kxu: V3 = [-u[1], u[0], 0];
  const gK = fin(f, t3 + 20, 16), gU = fin(f, AT(k, 1, "as u"), 16), gX = fin(f, t6 + 10, 16);
  const neg = fin(f, t12, 14);
  const [KX_L, KX_R] = splitEq(EQ_KXU), KXP = eqPieces(KX_R);
  const angU = rot, angK = rot + 90;
  return (
    <Scene>
      <Svg>
        <FloorGrid pr={pr} xr={[-3, 3]} yr={[-3, 3]} />
      </Svg>
      <View3D st={st} o={tex ? 1 : 0}>
        {patch ? <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[6, 6]} />
          <meshBasicMaterial map={patch} transparent opacity={0.25} />
        </mesh> : null}
        <Arrow3D from={[0, 0, 0]} to={[0, 0, 1.6]} color={ROT} grow={gK} px={8} head={34} />
        <Arrow3D from={[0, 0, 0]} to={u} color={C.first} grow={gU} />
        <Arrow3D from={[0, 0, 0]} to={kxu} color={ROT} grow={gX} px={12} head={44} />
        <Arrow3D from={[0, 0, 0]} to={mul3(kxu, -1)} color={ROT} grow={neg} px={12} head={44} dash />
      </View3D>
      <Svg>
        <L3 pr={pr} at={[3.3, -1.5, 0]} t="east" c={C.muted} s={T.key} />
        <L3 pr={pr} at={[1.0, 3.5, 0]} t="north" c={C.muted} s={T.key} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={[0, 0, 1.6]} t="k" c={ROT} s={T.calc} o={gK} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={u} t="u" c={C.first} s={T.calc} o={gU} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={kxu} t="k × u" c={ROT} s={T.key} o={gX} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={mul3(kxu, -1)} t="−k × u" c={ROT} s={T.key} o={neg} />
        <Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={1.2} a0={angU} a1={angK} col={C.gold} draw={fin(f, t7, 20)} o={fout(f, t12 - 4)} />
        <L3 pr={pr} at={[1.6 * Math.cos((angU + 45) * D2R), 1.6 * Math.sin((angU + 45) * D2R), 0]} t="90° left" c={C.gold} s={T.key} o={fin(f, t7 + 10) * fout(f, t11)} />
        <Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={1.2} a0={angU} a1={angU - 90} col={C.gold} draw={neg} />
        <L3 pr={pr} at={[1.6 * Math.cos((angU - 45) * D2R), 1.6 * Math.sin((angU - 45) * D2R), 0]} t="right" c={C.gold} s={T.key} o={neg} />
        <Keyword f={f} text="up" at={[pr.p([0, 0, 1.6])[0] + 70, pr.p([0, 0, 1.6])[1] - 10]} appear={AT(k, 3, "straight up")} out={t9} targets={[]} />
        <Lbl x={1080} y={150} t="wind: u" c={C.first} s={T.calc} o={fin(f, AT(k, 1, "as u"))} />
        <Lbl x={1400} y={150} t="last video: v" c={C.local} s={T.key} o={0.75 * fin(f, AT(k, 2, "the v of the last video"))} />
        <Lbl x={1080} y={260} t="5 m/s" c={C.first} s={T.key} o={fin(f, AT(k, 4, "five metres per second")) * fout(f, t9)} />
        <Keyword f={f} text="one special cross product" at={[1080, 420]} appear={AT(k, 0, "one particular cross product")} out={t3 - 6} targets={[]} />
        <Keyword f={f} text="turning tool" at={[1080, 660]} appear={AT(k, 11, "turning tool")} targets={[]} />
        <Lbl x={1080} y={735} t="quarter turn left" c={C.key} s={T.key} o={fin(f, AT(k, 11, "a quarter turn"))} />
        <Lbl x={1080} y={810} t="anticlockwise · from above" c={C.gold} s={T.key} o={fin(f, AT(k, 11, "anticlockwise"))} />
      </Svg>
      <TeX s={EQ_U500} x={1080} y={360} size={T.calc} c={C.first} o={fin(f, t5) * fout(f, t9)} />
      <CalcStack f={f} x={1180} y={460} size={44} rows={[
        { lhs: KX_L, rhs: KXP[0], at: t6, h: 84 },
        { rhs: KXP[1], at: tN - 6, cont: true, c: C.key, h: 84 },
      ]} o={fout(f, t9 - 6)} />
      <TeX s={String.raw`\mathbf u = (0,\ 5,\ 0)`} x={1080} y={360} size={T.calc} c={C.first} o={fin(f, t9 + 10) * fout(f, t11 - 10)} />
      <CalcStack f={f} x={1180} y={460} size={44} rows={[
        { lhs: KX_L, rhs: String.raw`= (0\times0 - 1\times5,\ 1\times0 - 0\times0,\ 0)`, at: t10, h: 84 },
        { rhs: String.raw`= (-5,\ 0,\ 0)`, at: AT(k, 10, "points west") - 6, cont: true, c: C.key, h: 84 },
      ]} o={fout(f, t11 - 10)} />
      <Svg><Lbl x={1080} y={660} t="k × u: north" c={ROT} s={T.key} o={fin(f, tN) * fout(f, t9)} /></Svg>
      <Svg><Lbl x={1080} y={660} t="k × u: west" c={ROT} s={T.key} o={fin(f, AT(k, 10, "points west")) * fout(f, t11 - 6)} /></Svg>
    </Scene>
  );
};

// ================================================================ globe scenes s24–s28
const GW = 1920, GH = 1080;
const coastO = 0.42;
/** Globe: texture + coastlines (+ graticule) with a camera; overlays as children(G) */
const GlobeView: React.FC<{ cam: GlobeCam; M?: THREE.Matrix4; cut?: boolean; drapes?: { url: string; lat: [number, number]; lon: [number, number]; o: number }[];
  coast?: number; grat?: number; res50?: boolean; dim?: number; x?: number; y?: number; w?: number; h?: number; o?: number; children?: (G: ReturnType<typeof globeProj>) => React.ReactNode;
  three?: React.ReactNode; ppDef?: Pt; box?: [number, number, number, number] }> = ({ cam, M, cut = false, drapes = [], coast = coastO, grat = 0.25, res50 = false, dim = 1,
  x = 0, y = 0, w = GW, h = GH, o = 1, children, three, ppDef = [w / 2, h / 2], box }) => {
  const tex = useTex(staticFile("cp/bmng.jpg"));
  const d0 = useTex(drapes[0] ? staticFile(drapes[0].url) : null), d1 = useTex(drapes[1] ? staticFile(drapes[1].url) : null);
  const st = globeCam(cam, ppDef);
  const G0 = globeProj(st, w, h, x, y, M);
  const G = cut ? { ...G0, vis: (la: number, lo: number, r?: number) => !(lo > 0 && lo < 90) && G0.vis(la, lo, r) } : G0;
  const dr = drapes.map((d, i) => ({ tex: i === 0 ? d0 : d1, lat: d.lat, lon: d.lon, o: d.o }));
  // mount the WebGL view only once every texture is loaded (the canvas renders on frame changes only)
  if (o <= 0 || !tex || (drapes[0] && !d0) || (drapes[1] && !d1)) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o }}>
      <View3D st={st} x={x} y={y} w={w} h={h} key3={st.pos} amb={1.55} dir={1.35}>
        <GlobeMesh tex={tex} M={M} cut={cut} drapes={dr} dim={dim} />
        {three}
      </View3D>
      <Svg>
        <defs><clipPath id={`gclip${x}${y}`}><rect x={x} y={y} width={w} height={h} /></clipPath></defs>
        <g clipPath={`url(#gclip${x}${y})`}>
          <Graticule G={G} o={grat} />
          <path d={coastPath(G, (res50 ? ne50 : ne110).coastline as number[][], box)} fill="none" stroke={C.key} strokeOpacity={coast} strokeWidth={res50 ? 2 : 1.6} />
          {children ? children(G) : null}
        </g>
      </Svg>
    </div>
  );
};
const S24: React.FC = () => {
  const f = useCurrentFrame(), k = K("s24_spin");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), tNP = AT(k, 4, "North Pole"), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9);
  const spin = (18 * D2R * Math.max(0, f - t1)) / FPS;   // one turn in 20 s of film (time compressed)
  const tilt = 23.4;
  const M = globeMatrix(spin, tilt);
  const cam: GlobeCam = { lat: 18, lon: -40, dist: 6.0, pp: [560, 560] };
  const axis = new THREE.Vector3(0, 1, 0).applyMatrix4(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), tilt * D2R));
  const ax: V3 = [axis.x, axis.y, axis.z];
  const om = fin(f, t2 + 10, 16);
  // the hand above the North Pole: thumb along Ω, fingers along the turning direction
  const st0 = globeCam(cam, [960, 540]);
  const right = norm3(cross3(sub3(st0.target, st0.pos), ax));
  const hp = handQuat(mul3(right, -1), ax);
  const handO = 0;
  const curl = 0.2 + 0.7 * easeIO(clamp((f - AT(k, 4, "Curl your fingers")) / 40, 0, 1));
  // M16: a 300-px inset of the hand gripping the spin axis (thumb along Ω, fingers curling west → east)
  const inO = fin(f, AT(k, 4, "Curl your fingers") - 6, 12) * fout(f, t6 - 8, 12);
  const IN = { x: 1500, y: 330, w: 340, h: 380 };
  const inSt = orbitCam({ az: 300, el: 16, dist: 6.0, target: [-0.4, 0, 1.0] }, [IN.w / 2, IN.h / 2]);
  const inPr = projector(inSt, IN.w, IN.h, IN.x, IN.y);
  const inQ = handQuat([1, 0, 0], [0, 0, 1]);
  const kwOut = t6 - 10;
  const [OMH_L, OMH_R] = splitEq(EQ_OMH), OMP = eqPieces(splitEq(EQ_OM)[1]);
  return (
    <Scene>
      <GlobeView cam={cam} M={M}
        three={<>
          <Arrow3D from={mul3(ax, 1.0)} to={mul3(ax, 1.0 + 0.8 * om)} color={ROT} px={14} head={48} />
          <Hand3D q={hp} at={add3(mul3(ax, 1.25), mul3(right, 0.12))} s={0.22} angles={POSE.curl(curl)} o={handO} glow={{ thumb: ROT }} glowK={fin(f, tNP, 10)} />
        </>}>
        {(G) => {
          const pa = G.pw(mul3(ax, 1.45)), pb = G.pw(mul3(ax, 1.0)), pc = G.pw(mul3(ax, -1.0)), pd = G.pw(mul3(ax, -1.45));
          const eq: [number, number][] = [];
          const lc = -40 - spin / D2R;
          for (let lo = lc - 70; lo <= lc + 50; lo += 2) eq.push([0, lo]);
          return <>
            <line x1={pa[0]} y1={pa[1]} x2={pb[0]} y2={pb[1]} stroke={C.gold} strokeWidth={4} strokeDasharray="14 10" opacity={fin(f, t1 + 10)} />
            <line x1={pc[0]} y1={pc[1]} x2={pd[0]} y2={pd[1]} stroke={C.gold} strokeWidth={4} strokeDasharray="14 10" opacity={fin(f, t1 + 10)} />
            <SurfArrow G={G} pts={eq} c={C.gold} w={6} head={30} o={fin(f, AT(k, 4, "from west to east")) * fout(f, t6)} />
            <Lbl x={G.pw(mul3(ax, 1.0 + 0.8 * om))[0] + 40} y={G.pw(mul3(ax, 1.0 + 0.8 * om))[1]} t="Ω" c={ROT} s={T.calc} o={om} />
            <Lbl x={G.pw(mul3(ax, 1.05))[0] + 60} y={G.pw(mul3(ax, 1.05))[1] + 50} t="North Pole" c={C.key} s={T.key} o={fin(f, tNP)} />
            <Lbl x={G.p(-6, lc - 30)[0]} y={G.p(-6, lc - 30)[1] + 40} t="west → east" c={C.gold} s={T.key} a="middle" o={fin(f, AT(k, 4, "from west to east")) * fout(f, t6)} />
          </>;
        }}
      </GlobeView>
      <Svg>
        <Keyword f={f} text="why does the wind turn?" at={[1080, 200]} appear={6} out={kwOut} targets={[]} />
        <Keyword f={f} text="one turn a day" at={[1080, 310]} appear={AT(k, 1, "spins once a day")} out={kwOut} targets={[]} />
        <Lbl x={1080} y={420} t="spin arrow Ω" c={ROT} s={T.key} o={fin(f, AT(k, 2, "as an arrow")) * fout(f, kwOut)} />
        <Keyword f={f} text="right-hand rule" at={[1080, 530]} appear={AT(k, 3, "right-hand rule")} out={kwOut} targets={[]} />
        <Keyword f={f} text="length = how fast" at={[1080, 640]} appear={AT(k, 5, "how fast")} out={kwOut} targets={[]} />
        <Keyword f={f} text="radians: full turn = 2π" at={[1080, 220]} appear={AT(k, 6, "two pi radians")} targets={[]} />
      </Svg>
      {inO > 0 ? <>
        <View3D st={inSt} x={IN.x} y={IN.y} w={IN.w} h={IN.h} o={inO}>
          <Rod3D a={[0, 0, -0.9]} b={[0, 0, 2.4]} px={6} color={C.gold} />
          <Arrow3D from={[0, 0, 2.4]} to={[0, 0, 3.2]} color={ROT} px={12} head={36} />
          <Hand3D q={inQ} at={[-0.62 * 1.8, -0.25 * 1.8, 0.6]} s={1.8} angles={POSE.curl(curl)} glow={{ thumb: ROT }} glowK={fin(f, tNP, 10)} />
        </View3D>
        <Svg o={inO}>
          <Arc3 pr={inPr} c0={[0, 0, -0.4]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={1.5} a0={-80} a1={200} col={C.gold} w={6} />
          <L3 pr={inPr} at={[0, 0, 3.2]} t="Ω" c={ROT} s={T.calc} dx={40} />
          <Lbl x={IN.x + IN.w / 2} y={IN.y + IN.h + 60} t="west → east" c={C.gold} s={T.floor} a="middle" />
        </Svg>
      </> : null}
      <CalcStack f={f} x={1230} y={330} size={T.calc} maxLines={3} rows={[
        { lhs: OMH_L, rhs: OMH_R, at: AT(k, 7, "twenty three hours"), h: 190 },
        { rhs: OMP[0], at: t8 + 10, cont: true, h: 190 },
        { rhs: OMP[1], at: AT(k, 9, "seven point two nine"), cont: true, c: C.key, h: 110 },
      ]} />
    </Scene>
  );
};

const CUT_CAM: GlobeCam = { lat: 30, lon: 40, dist: 5.4, pp: [560, 540] };
const S25: React.FC = () => {
  const f = useCurrentFrame(), k = K("s25_ground_speed");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9);
  const lat = 45 * easeIO(clamp((f - t6) / 30, 0, 1)) + 45 * easeIO(clamp((f - t8) / 30, 0, 1));
  const site = ll(lat, 0, 1.0), e = enAt(lat, 0).e;
  const spd = interp(lat, earth.lat_deg, earth.ground_speed);
  const vlen = (spd / 465) * 0.85;
  const handO = fin(f, t3 + 20, 10) * fout(f, t3 + 80, 10);
  const [E465_L, E465_R] = splitEq(EQ_465), E465P = eqPieces(E465_R);
  const [E329_L, E329_R] = [EQ_329.split(String.raw` \approx `)[0], String.raw`\approx ` + EQ_329.split(String.raw` \approx `)[1]];
  return (
    <Scene>
      <GlobeView cam={CUT_CAM} cut grat={0.2}
        three={<>
          <Arrow3D from={[0, 0, 0]} to={[0, 1.45, 0]} color={ROT} px={14} head={48} />
          <Arrow3D from={[0, 0, 0]} to={site} color={C.first} grow={fin(f, t1, 16)} />
          {vlen > 0.02 ? <Arrow3D from={site} to={add3(site, e, vlen)} color={C.second} grow={fin(f, t3 + 6, 14)} /> : null}
          <Hand3D q={handQuat([0, 1, 0], [1, 0, 0])} at={add3(site, [0.25, 0.15, 0.25])} s={0.15} angles={POSE.curl(0.7)} o={handO} glow={{ thumb: C.second }} />
        </>}>
        {(G) => {
          const c0 = G.pw([0, 0, 0]);
          return <>
            <Lbl x={G.pw([0, 1.45, 0])[0] + 40} y={G.pw([0, 1.45, 0])[1]} t="Ω" c={ROT} s={T.calc} />
            <Lbl x={G.pw(site)[0] - 40} y={G.pw(site)[1] - 40} t="r" c={C.first} s={T.calc} a="end" o={fin(f, t1)} />
            {vlen > 0.02 ? <Lbl x={G.pw(add3(site, e, vlen))[0] + 30} y={G.pw(add3(site, e, vlen))[1]} t="v" c={C.second} s={T.calc} o={fin(f, t3 + 10)} /> : null}
            <Bracket p={c0} q={G.pw(site)} off={40} c={C.gold} o={fin(f, t2) * fout(f, t6)} />
            <Lbl x={(c0[0] + G.pw(site)[0]) / 2 - 40} y={(c0[1] + G.pw(site)[1]) / 2 - 60} a="end" t="6371 km" c={C.gold} s={T.key} o={fin(f, AT(k, 2, "six thousand")) * fout(f, t6)} />
            <RightTick at={c0} u1={unit(c0, G.pw([0, 1, 0]))} u2={unit(c0, G.pw(site))} o={fin(f, t4) * fout(f, t6)} c={C.gold} />
            {lat > 2 ? <path d={`M ${c0[0] + 120 * unit(c0, G.pw([0, 1, 0]))[0]} ${c0[1] + 120 * unit(c0, G.pw([0, 1, 0]))[1]} L ${c0[0]} ${c0[1]}`} stroke="none" /> : null}
          </>;
        }}
      </GlobeView>
      <TeX s={EQ_VOR} x={1080} y={140} size={T.eq} o={fin(f, AT(k, 3, "Omega cross r"))} />
      <CalcStack f={f} x={1190} y={290} size={50} maxLines={4} rows={[
        { lhs: E465_L, rhs: E465P[0], at: t5, h: 80 },
        { rhs: rep(E465P[1], "465", String.raw`\mathbf{465}`), at: AT(k, 5, "four hundred and sixty five"), cont: true, c: C.key, h: 110 },
        { lhs: "", rhs: String.raw`${E329_L} ${E329_R}`, at: AT(k, 7, "three hundred and twenty nine"), h: 110 },
        { lhs: String.raw`|\boldsymbol\Omega\times\mathbf r|`, rhs: "= 0", at: AT(k, 8, "the cross product is zero"), h: 90 },
      ]} />
      <Svg><Keyword f={f} text="faster than sound" at={[1080, 780]} appear={AT(k, 5, "faster than")} out={t6 + 20} targets={[]} /></Svg>
    </Scene>
  );
};

const S26: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26_coriolis_effect");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9);
  const cam: GlobeCam = { lat: 8, lon: -25, dist: 4.45, pp: [600, 445] };
  const X5 = (tr: number[][], la0: number, lo0: number, n: number) => tr.slice(0, n).map(([la, lo]) => [la0 + (la - la0) * 5, lo0 + (lo - lo0) * 5] as [number, number]);
  const nN = Math.max(2, Math.round(clamp((f - t3) / 90, 0, 1) * (paths.nh_track_6h.length - 1)));
  const nS = Math.max(2, Math.round(clamp((f - t7) / 90, 0, 1) * (paths.sh_track_6h.length - 1)));
  return (
    <Scene>
      {[{ x: 1110, la: 40, lo: -24, tr: paths.nh_track_6h as number[][], gh: paths.ghost_nh as number[][], a0: [40, -30], n: nN, t: t6, w: "right" },
        { x: 1490, la: -40, lo: -14, tr: paths.sh_track_6h as number[][], gh: paths.ghost_sh as number[][], a0: [-40, -20], n: nS, t: t7, w: "left" }].map((z, i) => (
        <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080,
          WebkitMaskImage: `radial-gradient(ellipse 175px 165px at ${z.x + 175}px ${470 + 165}px, black 72%, transparent 100%)`,
          maskImage: `radial-gradient(ellipse 175px 165px at ${z.x + 175}px ${470 + 165}px, black 72%, transparent 100%)` }}>
          <GlobeView cam={{ lat: z.la, lon: z.lo, dist: 1.42, fov: 35 }} x={z.x} y={470} w={350} h={330} coast={0.5} grat={0.2} o={fin(f, z.t, 14)}>
            {(G) => <>
              <path d={llPath(G, X5(z.gh, z.a0[0], z.a0[1], z.n), 1.004)} fill="none" stroke={C.ink} strokeWidth={4} strokeDasharray="12 10" opacity={0.7} />
              {z.n > 2 ? <SurfArrow G={G} pts={X5(z.tr, z.a0[0], z.a0[1], z.n)} c={C.first} w={8} head={30} /> : null}
            </>}
          </GlobeView>
        </div>))}
      <Svg>
        <Lbl x={1110 + 175} y={830} t="right" c={C.key} s={T.key} a="middle" o={fin(f, t6)} />
        <Lbl x={1490 + 175} y={830} t="left" c={C.key} s={T.key} a="middle" o={fin(f, t7)} />
      </Svg>
      <GlobeView cam={cam}>
        {(G) => {
          const ob = G.p(30, -55);
          return <>
            <LatCircle G={G} lat={0} c={C.gold} w={5} o={fin(f, t6) * (0.6 + 0.4 * pulse(f, t6, 30))} />
            <Observer x={ob[0]} y={ob[1]} s={1.1} o={fin(f, t1)} />
            <path d={llPath(G, X5(paths.ghost_nh as number[][], 40, -30, nN), 1.004)} fill="none" stroke={C.ink} strokeWidth={4} strokeDasharray="12 10" opacity={0.6 * fin(f, t3)} />
            {nN > 2 ? <SurfArrow G={G} pts={X5(paths.nh_track_6h as number[][], 40, -30, nN)} c={C.first} w={8} head={30} o={fin(f, t3)} /> : null}
            <path d={llPath(G, X5(paths.ghost_sh as number[][], -40, -20, nS), 1.004)} fill="none" stroke={C.ink} strokeWidth={4} strokeDasharray="12 10" opacity={0.6 * fin(f, t7)} />
            {nS > 2 ? <SurfArrow G={G} pts={X5(paths.sh_track_6h as number[][], -40, -20, nS)} c={C.first} w={8} head={30} o={fin(f, t7)} /> : null}
            <Lbl x={G.p(44, -26)[0]} y={G.p(44, -26)[1] - 30} t="without the effect" c={C.local} s={T.floor} a="middle" o={fin(f, t3 + 60) * fout(f, t5)} />
            <circle cx={G.p(40, -24)[0]} cy={G.p(40, -24)[1]} r={70} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" opacity={fin(f, t6)} />
            <circle cx={G.p(-40, -14)[0]} cy={G.p(-40, -14)[1]} r={70} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" opacity={fin(f, t7)} />
          </>;
        }}
      </GlobeView>
      <Svg>
        <Keyword f={f} text="turning with Earth" at={[1150, 160]} appear={AT(k, 1, "turn with it")} out={t5} targets={[]} />
        <Keyword f={f} text="drifts sideways" at={[1150, 270]} appear={AT(k, 3, "drifts sideways")} out={t5} targets={[]} />
        <Keyword f={f} text="Coriolis effect" at={[1150, 160]} appear={AT(k, 5, "Coriolis effect")} targets={[]} s={T.calc} />
        <Lbl x={1150} y={300} t="Northern Hemisphere · right" c={C.key} s={T.key} o={fin(f, AT(k, 6, "to the right"))} />
        <Lbl x={1150} y={390} t="Southern Hemisphere · left" c={C.key} s={T.key} o={fin(f, AT(k, 7, "to the left"))} />
        <TurntableIcon x={1770} y={170} r={55} o={0.7 * fin(f, t8)} spin={f / 30} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s27 −2Ω × u on a local patch at 45°N
const PATCH_K: OrbitKey = { f: 0, az: 252, el: 16, dist: 10.5, target: [0.4, 0.4, 1.0], pp: [520, 470] };
const S27: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27_coriolis_term");
  const t1 = SS(k, 1), tW = AT(k, 1, "where u is the wind"), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const st = camOf([PATCH_K], f), pr = projector(st, W3, H3);
  const om = norm3(cori.Omega_45N as V3);
  const acc = cori.accel_45N as V3;
  const push = mul3(norm3(acc), 1.8);
  const turn = 14 * D2R * easeIO(clamp((f - t5) / 30, 0, 1));
  const u: V3 = [2.4 * Math.cos(-turn), 2.4 * Math.sin(-turn), 0];
  const pushR: V3 = [push[0] * Math.cos(-turn) - push[1] * Math.sin(-turn), push[0] * Math.sin(-turn) + push[1] * Math.cos(-turn), push[2]];
  const PARTS: Part[] = [{ t: "-2" }, { t: String.raw`\boldsymbol\Omega`, c: ROT, u: { w: String.raw`\text{spin}`, c: ROT } }, { t: String.raw`\times` },
    { t: String.raw`\mathbf u`, c: C.first, u: { w: String.raw`\text{wind}`, c: C.first } }];
  if (plainOf(PARTS).replace(/\s/g, "") !== EQ_COR.replace(/\s/g, "")) throw new Error("s27 parts ≠ EQ_COR");
  return (
    <Scene>
      <Svg><FloorGrid pr={pr} xr={[-3, 3]} yr={[-3, 3]} /></Svg>
      <View3D st={st}>
        <Arrow3D from={[0, 0, 0]} to={[0, 0, 1.4]} color={ROT} px={6} head={26} />
        <Arrow3D from={[0, 0, 0]} to={mul3(om, 2.2)} color={ROT} px={12} head={42} />
        <Arrow3D from={[0, 0, 0]} to={u} color={C.first} />
        <Arrow3D from={[0, 0, 0]} to={pushR} color={C.second} grow={fin(f, AT(k, 2, "this push"), 16)} />
        <Ball3D at={[0, 0, 0]} px={20} color={C.key} />
      </View3D>
      <Svg>
        <L3 pr={pr} at={[3.4, -0.9, 0]} t="east" c={C.muted} s={T.key} />
        <L3 pr={pr} at={[-0.9, 3.4, 0]} t="north" c={C.muted} s={T.key} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={[0, 0, 1.4]} t="k" c={ROT} s={T.key} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={mul3(om, 2.2)} t="Ω" c={ROT} s={T.calc} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={u} t="u" c={C.first} s={T.calc} />
        <L3 pr={pr} at={pushR} t="push" c={C.second} s={T.key} a="start" dx={30} dy={-6} o={fin(f, AT(k, 2, "this push") + 10)} />
        <Tick3 pr={pr} at={[0, 0, 0]} u1={norm3(u)} u2={norm3(pushR)} s={0.55} w={6} o={fin(f, AT(k, 2, "at a right angle"))} />
        <Keyword f={f} text="for each kilogram of air" at={[1150, 460]} appear={AT(k, 1, "for each kilogram")} targets={[]} />
        <Keyword f={f} text="no work" at={[1150, 690]} appear={AT(k, 4, "no work")} targets={[]} />
        <Keyword f={f} text="speed unchanged" at={[1450, 690]} appear={AT(k, 4, "never speeds")} targets={[]} />
        <Keyword f={f} text="only turns" at={[1150, 790]} appear={t5} targets={[]} />
      </Svg>
      <Layered parts={PARTS} layers={[{ t: "all", o: 1 }, { u: [1], o: fin(f, AT(k, 1, "Omega cross")) }, { u: [3], o: fin(f, tW) }]} x={1450} y={180} size={96} ax={0.5} ay={0} o={fin(f, AT(k, 1, "minus two Omega"))} />
      <TeX s={EQ_CORDOT} x={1150} y={560} size={T.calc} o={fin(f, t3)} />
    </Scene>
  );
};

// ================================================================ s28 f = 2Ω sin φ: the shadow of Ω on the local up
const F_CAM: GlobeCam = { lat: 8, lon: 90, dist: 6.0, pp: [600, 470] };
const S28: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28_f");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9);
  const lat = 45 - 45 * easeIO(clamp((f - t7) / 40, 0, 1)) - 45 * easeIO(clamp((f - t8) / 40, 0, 1));
  const site = ll(lat, 0), kk = site;              // local up = radial
  const L = 0.62;
  const omTip = add3(site, [0, L, 0]);
  const sh = L * Math.sin(lat * D2R);              // Ω·k (display length) = L sin φ
  const foot = add3(site, kk, sh);
  const neg = lat < -1;
  const [OMK_L, OMK_R] = splitEq(EQ_OMK), OMKP = eqPieces(OMK_R);
  const [F45_L, F45_R] = splitEq(EQ_F45), F45P = eqPieces(F45_R);
  return (
    <Scene>
      <GlobeView cam={F_CAM} cut grat={0.2}
        three={<>
          <Arrow3D from={[0, 0, 0]} to={[0, 1.5, 0]} color={ROT} px={12} head={44} />
          <Arrow3D from={site} to={add3(site, kk, 0.55)} color={ROT} px={6} head={26} o={fin(f, t1)} />
          <Arrow3D from={site} to={omTip} color={ROT} px={12} head={40} o={fin(f, t1 + 10)} />
          <Arrow3D from={[0, 0, 0]} to={mul3(site, 0.98)} color={C.muted} px={4} head={18} o={fin(f, t2)} />
        </>}>
        {(G) => {
          const c0 = G.pw([0, 0, 0]), s0 = G.pw(site), ft = G.pw(foot), ot = G.pw(omTip);
          const eqP = G.pw([0, 0, 0.55]);
          const latArc = Array.from({ length: 21 }, (_, i) => G.pw(ll((lat * i) / 20, 0, 0.45)));
          return <>
            <line x1={ot[0]} y1={ot[1]} x2={ft[0]} y2={ft[1]} stroke={C.ink} strokeWidth={4} strokeDasharray="10 8" opacity={fin(f, t1 + 20)} />
            <line x1={s0[0]} y1={s0[1]} x2={ft[0]} y2={ft[1]} stroke={neg ? C.neg : ROT} strokeWidth={20} strokeOpacity={0.7} strokeDasharray={neg ? "14 8" : undefined} opacity={fin(f, t1 + 24)} />
            <Lbl x={G.pw(add3(site, kk, 0.55))[0] + 10} y={G.pw(add3(site, kk, 0.55))[1] - 44} t="k · up" c={ROT} s={T.key} a="middle" o={fin(f, t1)} />
            <Lbl x={ot[0] + 34} y={ot[1] + 4} t="Ω" c={ROT} s={T.calc} a="start" o={fin(f, t1 + 10)} />
            <Lbl x={(s0[0] + ft[0]) / 2 + 44} y={(s0[1] + ft[1]) / 2 + (lat < 0 ? -10 : 34)} t="shadow" c={ROT} s={T.key} o={fin(f, t1 + 30) * (Math.abs(sh) > 0.05 ? 1 : 0)} />
            <polyline points={latArc.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, t2)} />
            <line x1={c0[0]} y1={c0[1]} x2={eqP[0]} y2={eqP[1]} stroke={C.gold} strokeWidth={3} strokeDasharray="8 8" opacity={fin(f, t2)} />
            {lat >= -1 ? <Lbl x={G.pw(ll(lat / 2, 0, 0.62))[0] - 10} y={G.pw(ll(lat / 2, 0, 0.62))[1] + (lat > 1 ? 0 : 40)} t={lat > 44 ? "φ = 45°" : "φ = 0°"} c={C.gold} s={T.key} a="end"
              o={fin(f, t2) * (lat > 44 || Math.abs(lat) < 0.5 ? 1 : 0)} />
              : <Lbl x={G.pw(ll(lat / 2, 0, 0.45))[0] - 16} y={G.pw(ll(lat / 2, 0, 0.45))[1] + 10} t="φ < 0" c={C.neg} s={T.key} a="end" o={lat < -44 ? 1 : 0} />}
            <Lbl x={s0[0] - 70} y={s0[1] - 20} t="90° − φ" c={C.gold} s={T.key} a="end" o={fin(f, t3) * fout(f, t7)} />
          </>;
        }}
      </GlobeView>
      <Svg><Keyword f={f} text="latitude" at={[1500, 780]} appear={AT(k, 2, "the latitude")} out={t5} targets={[]} /></Svg>
      <TeX s={EQ_F} x={1080} y={140} size={T.eq} o={fin(f, AT(k, 5, "f equals"))} />
      <Svg>
        <line x1={1080} y1={195} x2={1480} y2={195} stroke={C.gold} strokeWidth={6} opacity={fin(f, AT(k, 5, "f equals") + 10)} />
        <Keyword f={f} text="Coriolis parameter" at={[1100, 250]} appear={AT(k, 5, "the Coriolis parameter")} targets={[]} />
        <Keyword f={f} text="dot product again" at={[1100, 540]} appear={AT(k, 4, "a dot product again")} out={t6} targets={[]} c={C.local} />
        <Lbl x={1100} y={700} t="sin φ < 0" c={C.neg} s={T.key} o={fin(f, AT(k, 9, "So sine phi"))} />
        <Lbl x={1400} y={700} t="f < 0" c={C.neg} s={T.key} o={fin(f, AT(k, 9, "and f are negative"))} />
        <Lbl x={1100} y={700} t="f = 0" c={C.key} s={T.key} o={fin(f, AT(k, 7, "so f is zero")) * fout(f, t8)} />
      </Svg>
      <CalcStack f={f} x={1240} y={340} size={60} maxLines={3} rows={[
        { lhs: OMK_L, rhs: OMKP[0], at: t3 + 20, h: 86 },
        { rhs: OMKP[1], at: AT(k, 4, "Omega times sine phi"), cont: true, c: C.key, h: 86 },
      ]} o={fout(f, t6 - 6)} />
      <CalcStack f={f} x={1150} y={340} size={60} maxLines={3} rows={[
        { lhs: F45_L, rhs: F45P[0], at: t6 + 10, h: 90 },
        { rhs: F45P[1], at: AT(k, 6, "one point zero three"), cont: true, c: C.key, h: 90 },
      ]} o={fout(f, t7 - 6)} />
    </Scene>
  );
};

// ================================================================ s29 the turning rule; s30 how strong
const PATCHES = [{ x: 80, w: "Northern Hemisphere", fi: 0 }, { x: 700, w: "equator", fi: 1 }, { x: 1320, w: "Southern Hemisphere", fi: 2 }];
const S29: React.FC = () => {
  const f = useCurrentFrame(), k = K("s29_turn_rule");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const side = (cori.turn_rule as number[][]).map((a) => a[1]); // northward component of −f k×u for u east: − (right) NH, + (left) SH
  return (
    <Scene>
      <Svg>
        {PATCHES.map((p, i) => {
          const cx = p.x + 260, cy = 470;
          const show = i === 0 ? fin(f, AT(k, 3, "flips it to the right")) : i === 2 ? fin(f, t6) : 0;
          const dir = Math.sign(side[p.fi]);
          return (
            <g key={i} opacity={fin(f, 6 + 6 * i)}>
              <rect x={p.x} y={260} width={520} height={420} fill="#1d2740" stroke={C.grid} strokeWidth={3} />
              <Grid P={mkP(p.x + 20, 660, 60)} xr={[0, 8]} yr={[0, 6]} o={0.5} />
              <Arrow p={[cx - 40, cy]} q={[cx + 160, cy]} color={C.first} />
              <Lbl x={cx + 180} y={cy} t="u" c={C.first} s={T.calc} />
              <Arrow p={[cx - 40, cy]} q={[cx - 40, cy - 150]} color={ROT} o={0.45 * fin(f, t1)} />
              <Lbl x={cx - 60} y={cy - 170} t="k × u" c={ROT} s={T.floor} a="end" o={0.6 * fin(f, t2)} />
              {dir !== 0 ? <Arrow p={[cx - 40, cy]} q={[cx - 40, cy - 150 * dir]} color={C.second} o={show} w={12} /> : null}
              {dir !== 0 ? <Lbl x={cx - 20} y={cy - 150 * dir + (dir > 0 ? -30 : 30)} t="push" c={C.second} s={T.floor} o={show} /> : null}
              <Lbl x={p.x + 260} y={720} t={p.w} c={C.key} s={T.key} a="middle" />
            </g>
          );
        })}
        <Lbl x={340} y={800} t="f > 0 · right" c={C.key} s={T.key} a="middle" o={fin(f, t4)} />
        <Lbl x={960} y={800} t="f = 0 · no turning" c={C.key} s={T.key} a="middle" o={fin(f, t7)} />
        <Lbl x={1580} y={800} t="f < 0 · left" c={C.neg} s={T.key} a="middle" o={fin(f, t6)} />
        <Lbl x={1840} y={140} t="(flat winds)" c={C.local} s={T.key} a="end" o={fin(f, 10)} />
      </Svg>
      <TeX s={String.raw`-2\boldsymbol\Omega\times\mathbf u \;\color{${C.gold}}{\to}\;`} x={960} y={140} size={T.eq} ax={1} o={fin(f, 6)} />
      <TeX s={EQ_FKU} x={980} y={140} size={T.eq} ax={0} o={fin(f, AT(k, 0, "minus f times"))} />
    </Scene>
  );
};
const S30: React.FC = () => {
  const f = useCurrentFrame(), k = K("s30_coriolis_size");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const per = cori.size_45N.period_h;
  const c0 = t5 + 10, c1 = SE(k, 6) - 10;
  const h = clamp((f - c0) / (c1 - c0), 0, 1) * per;   // one constant rate: 17 h over the last two sentences
  // one f-plane integration (fluidpy.geo.frames.inertial_oscillation, data/inertial30.json): path, u and the push
  const I30 = in30 as { t_h: number[]; x_km: number[]; y_km: number[]; u: number[]; v: number[]; ax: number[]; ay: number[]; centre_km: number[]; radius_km: number };
  const nI = I30.t_h.length - 1;
  const jf = clamp(h / per, 0, 1) * nI, j = Math.min(nI, Math.round(jf));
  const cx = 520, cy = 480, R = 190, S = R / I30.radius_km;           // circle centre on screen; px per km
  const sc = (i: number): Pt => [cx + (I30.x_km[i] - I30.centre_km[0]) * S, cy - (I30.y_km[i] - I30.centre_km[1]) * S];
  const pos = sc(j);
  const uu = [I30.u[j] / 10, I30.v[j] / 10], am = Math.hypot(I30.ax[j], I30.ay[j]), aa = [I30.ax[j] / am, I30.ay[j] / am];
  const uTip: Pt = [pos[0] + 130 * uu[0], pos[1] - 130 * uu[1]];
  const pTip: Pt = [pos[0] + 95 * aa[0], pos[1] - 95 * aa[1]];
  const trace = Array.from({ length: j + 1 }, (_, i) => sc(i).join(",")).join(" ");
  const [FK_L, FK_R] = splitEq(EQ_FKUN), FKP = eqPieces(FK_R);
  return (
    <Scene>
      <Svg>
        <rect x={140} y={110} width={760} height={740} fill="#1d2740" stroke={C.grid} strokeWidth={3} />
        <Grid P={mkP(160, 830, 70)} xr={[0, 10]} yr={[0, 10]} o={0.45} />
        {j > 0 ? <polyline points={trace} fill="none" stroke={C.gold} strokeWidth={5} /> : null}
        <circle cx={cx} cy={cy} r={6} fill={C.muted} opacity={fin(f, c0 + 30)} />
        <Arrow p={pos} q={uTip} color={C.first} />
        <Arrow p={pos} q={pTip} color={C.second} w={8} head={30} o={fin(f, t2)} />
        <circle cx={pos[0]} cy={pos[1]} r={11} fill={C.key} stroke={C.bg} strokeWidth={3} />
        <Lbl x={uTip[0] + 34 * uu[0] - 26 * uu[1]} y={uTip[1] - 34 * uu[1] - 26 * uu[0]} t="u" c={C.first} s={T.calc} a="middle" />
        <Lbl x={pTip[0] + 40 * aa[0] + 30 * aa[1]} y={pTip[1] - 40 * aa[1] + 30 * aa[0]} t="push" c={C.second} s={T.key} a="middle" o={fin(f, t2)} />
        <Lbl x={1080} y={150} t="u = 10 m/s" c={C.first} s={T.key} o={fin(f, AT(k, 1, "ten metres"))} />
        <Lbl x={1460} y={150} t="φ = 45°N" c={C.key} s={T.key} o={fin(f, AT(k, 1, "forty five degrees"))} />
        <Keyword f={f} text="about 1 mm/s every second" at={[1080, 560]} appear={AT(k, 3, "one millimetre")} targets={[]} />
        <g opacity={fin(f, t5)}>
          <ClockGlyph x={1110} y={760} r={34} h={(h * 12) % 12} />
          <Lbl x={1170} y={760} t={`t = ${h.toFixed(1)} h`} c={C.key} s={T.key} />
        </g>
        <Lbl x={cx} y={830} t="clockwise · from above" c={C.key} s={T.floor} a="middle" o={fin(f, c0 + 30)} />
      </Svg>
      <CalcStack f={f} x={1260} y={250} size={50} maxLines={4} rows={[
        { lhs: FK_L, rhs: FKP[0], at: t2, h: 76 },
        { rhs: FKP[1], at: AT(k, 2, "one point zero three"), cont: true, h: 76 },
        { rhs: FKP[2], at: AT(k, 3, "about one millimetre"), cont: true, c: C.key, h: 76 },
      ]} />
      <TeX s={EQ_PER} x={1460} y={760} size={T.calc} o={fin(f, AT(k, 6, "two pi over f"))} />
    </Scene>
  );
};

// ================================================================ s31 two parcels on the globe (true size)
const kmOff = (lat: number, lon: number, e: number, n: number): [number, number] => [lat + n / 111.195, lon + e / (111.195 * Math.cos(lat * D2R))];
/** full-bleed imagery: every frame edge fades to the background (house: nothing within 20 px of the edge) and the
 * caption band y 880–1040 is background; `right` (0..1) darkens the keyword column x ≥ 1080 for legibility */
const Vignette: React.FC<{ right?: number; id: string }> = ({ right = 0, id }) => (
  <Svg>
    <defs>
      <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.bg} stopOpacity={0} /><stop offset="1" stopColor={C.bg} stopOpacity={1} /></linearGradient>
      <linearGradient id={`${id}t`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={C.bg} stopOpacity={0} /><stop offset="0.55" stopColor={C.bg} stopOpacity={1} /></linearGradient>
      <linearGradient id={`${id}l`} x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor={C.bg} stopOpacity={0} /><stop offset="0.55" stopColor={C.bg} stopOpacity={1} /></linearGradient>
      <linearGradient id={`${id}r`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={C.bg} stopOpacity={0} /><stop offset="0.55" stopColor={C.bg} stopOpacity={1} /></linearGradient>
      <linearGradient id={`${id}k`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={C.bg} stopOpacity={0} /><stop offset="1" stopColor={C.bg} stopOpacity={0.82} /></linearGradient>
    </defs>
    {right > 0 ? <g opacity={right}><rect x={980} y={0} width={180} height={1080} fill={`url(#${id}k)`} /><rect x={1160} y={0} width={760} height={1080} fill={C.bg} fillOpacity={0.82} /></g> : null}
    <rect x={0} y={800} width={1920} height={70} fill={`url(#${id}b)`} />
    <rect x={0} y={870} width={1920} height={210} fill={C.bg} />
    <rect x={0} y={0} width={1920} height={60} fill={`url(#${id}t)`} />
    <rect x={0} y={0} width={60} height={1080} fill={`url(#${id}l)`} />
    <rect x={1860} y={0} width={60} height={1080} fill={`url(#${id}r)`} />
  </Svg>
);
const S31: React.FC = () => {
  const f = useCurrentFrame(), k = K("s31_globe_paths");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), tR = AT(k, 3, "curves to the right"), tL = AT(k, 3, "curves to the left"), t4 = SS(k, 4);
  const c0 = t3 - 10, c1 = SE(k, 4) - 40;
  const per = cori.size_45N.period_h, Tend = (paths.t_h as number[])[paths.t_h.length - 1];
  const h = clamp((f - c0) / (c1 - c0), 0, 1) * Tend;
  const nI = Math.max(2, Math.round((h / Tend) * (paths.nh_track.length - 1)) + 1);
  const VW = 860, VH = 700, VY = 50;
  const views = [{ x: 80, tr: paths.nh_track as number[][], st: paths.nh_start as number[], lab: "45°N · 10 m/s", sense: "clockwise · from above" },
    { x: 980, tr: paths.sh_track as number[][], st: paths.sh_start as number[], lab: "45°S · 10 m/s", sense: "anticlockwise · from above" }];
  const dkm = paths.inertial_diameter_km;
  const loc = fout(f, t1 - 4, 16);
  return (
    <Scene>
      {loc > 0 ? <GlobeView cam={{ lat: 0, lon: (paths.nh_start as number[])[1], dist: 4.6, pp: [960, 430] }} o={loc}>
        {(G) => <>
          {[paths.nh_start as number[], paths.sh_start as number[]].map((s, i) => <circle key={i} cx={G.p(s[0], s[1])[0]} cy={G.p(s[0], s[1])[1]} r={34} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, 8 + 10 * i)} />)}
          <Lbl x={G.p((paths.nh_start as number[])[0], (paths.nh_start as number[])[1])[0] + 50} y={G.p((paths.nh_start as number[])[0], (paths.nh_start as number[])[1])[1]} t="45°N" c={C.gold} s={T.key} o={fin(f, 8)} />
          <Lbl x={G.p((paths.sh_start as number[])[0], (paths.sh_start as number[])[1])[0] + 50} y={G.p((paths.sh_start as number[])[0], (paths.sh_start as number[])[1])[1]} t="45°S" c={C.gold} s={T.key} o={fin(f, 18)} />
        </>}
      </GlobeView> : null}
      {views.map((v, i) => {
        const la = v.tr.map((p) => p[0]), lo = v.tr.map((p) => p[1]);
        const cLat = (Math.max(...la) + Math.min(...la)) / 2, cLon = (Math.max(...lo) + Math.min(...lo)) / 2;
        const cam: GlobeCam = { lat: cLat, lon: cLon, dist: 1.105, fov: 35 };
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080,
            WebkitMaskImage: `radial-gradient(ellipse ${VW / 2}px ${VH / 2}px at ${v.x + VW / 2}px ${VY + VH / 2}px, black 88%, transparent 100%)`,
            maskImage: `radial-gradient(ellipse ${VW / 2}px ${VH / 2}px at ${v.x + VW / 2}px ${VY + VH / 2}px, black 88%, transparent 100%)` }}>
          <GlobeView cam={cam} x={v.x} y={VY} w={VW} h={VH} coast={0} grat={0} o={fin(f, t1 - 14 + 8 * i, 16)}>
            {(G) => {
              const pts = v.tr.slice(0, nI).map((p) => [p[0], p[1]] as [number, number]);
              const head = G.p(pts[pts.length - 1][0], pts[pts.length - 1][1]);
              const s0 = G.p(v.st[0], v.st[1]);
              const sb0 = kmOff(cLat, cLon, -50, -120), sb1 = kmOff(cLat, cLon, 50, -120);
              const p0 = G.p(sb0[0], sb0[1]), p1 = G.p(sb1[0], sb1[1]);
              const dTop = kmOff(cLat, cLon, -125, dkm / 2), dBot = kmOff(cLat, cLon, -125, -dkm / 2);
              const q0 = G.p(dTop[0], dTop[1]), q1 = G.p(dBot[0], dBot[1]);
              const cc = G.p(cLat, cLon);
              const r = 0.45 * Math.abs(q1[1] - q0[1]);
              const cw = i === 0;
              const ePts = Array.from({ length: 25 }, (_, j) => { const a = (cw ? -1 : 1) * (Math.PI / 2) * (j / 24) + Math.PI / 4; return `${cc[0] + r * 0.6 * Math.cos(a)},${cc[1] - r * 0.6 * Math.sin(a)}`; });
              return <>
                <path d={llPath(G, pts, 1.0005)} fill="none" stroke={C.first} strokeWidth={6} strokeLinecap="round" opacity={fin(f, t1)} />
                <circle cx={s0[0]} cy={s0[1]} r={9} fill={C.key} opacity={fin(f, t1)} />
                <circle cx={head[0]} cy={head[1]} r={10} fill={C.first} stroke={C.bg} strokeWidth={3} opacity={fin(f, t1)} />
                {h < 0.3 ? <Arrow p={head} q={[head[0] + 90, head[1]]} color={C.first} w={8} head={28} o={fin(f, t2)} /> : null}
                <line x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={C.ink} strokeWidth={4} opacity={fin(f, t1 + 10)} />
                <Lbl x={(p0[0] + p1[0]) / 2} y={p0[1] + 34} t="100 km" c={C.ink} s={T.floor} a="middle" o={fin(f, t1 + 10)} />
                <g opacity={fin(f, t4)}>
                  <line x1={q0[0]} y1={q0[1]} x2={q1[0]} y2={q1[1]} stroke={C.gold} strokeWidth={5} />
                  <line x1={q0[0] - 14} y1={q0[1]} x2={q0[0] + 14} y2={q0[1]} stroke={C.gold} strokeWidth={5} />
                  <line x1={q1[0] - 14} y1={q1[1]} x2={q1[0] + 14} y2={q1[1]} stroke={C.gold} strokeWidth={5} />
                  <Lbl x={q0[0] - 26} y={(q0[1] + q1[1]) / 2} t={`≈ ${Math.round(dkm)} km`} c={C.gold} s={T.key} a="end" />
                  <polyline points={ePts.join(" ")} fill="none" stroke={C.gold} strokeWidth={5} />
                  {(() => { const a = ePts[ePts.length - 1].split(",").map(Number), b = ePts[ePts.length - 3].split(",").map(Number);
                    const ux = a[0] - b[0], uy = a[1] - b[1], L = Math.hypot(ux, uy) || 1, dx = ux / L, dy = uy / L;
                    return <polyline points={`${a[0] - dx * 20 - dy * 12},${a[1] - dy * 20 + dx * 12} ${a[0]},${a[1]} ${a[0] - dx * 20 + dy * 12},${a[1] - dy * 20 - dx * 12}`} fill="none" stroke={C.gold} strokeWidth={5} />; })()}
                </g>
              </>;
            }}
          </GlobeView>
          </div>
        );
      })}
      <Svg>
        {views.map((v, i) => <g key={i}>
          <Lbl x={v.x + VW / 2} y={VY + 70} t={v.lab} c={C.key} s={T.key} a="middle" o={fin(f, t1 + (i ? AT(k, 1, "one at forty five degrees south") - t1 : 0))} />
          <Lbl x={v.x + VW / 2} y={VY + VH + 36} t={i === 0 ? "right" : "left"} c={C.key} s={T.calc} a="middle" o={fin(f, i === 0 ? tR : tL) * fout(f, t4)} />
          <Lbl x={v.x + VW / 2} y={VY + VH + 36} t={v.sense} c={C.key} s={T.key} a="middle" o={fin(f, t4 + 20)} />
        </g>)}
        <g opacity={fin(f, c0)}><ClockGlyph x={930} y={840} r={30} h={(h * 12) % 12} /><Lbl x={980} y={840} t={`t = ${h.toFixed(1)} h`} c={C.key} s={T.key} /></g>
      </Svg>
    </Scene>
  );
};

// ================================================================ s32–s34 real mean winds on the globe
const useGlobalTrails = () => decodeTrails(useBin(staticFile("cp/trails_global.bin")), trG.n, trG.L);
const HIGHS = windsMean.highs as Record<string, { lat: number; lon: number; hPa: number }>;
const SatIcon: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (o <= 0 ? null : (
  <g opacity={o} stroke={C.key} strokeWidth={4} fill="none">
    <rect x={x - 14} y={y - 14} width={28} height={28} fill="#3a4766" />
    <rect x={x - 62} y={y - 10} width={40} height={20} /><rect x={x + 22} y={y - 10} width={40} height={20} />
  </g>));
const BalloonIcon: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (o <= 0 ? null : (
  <g opacity={o}><circle cx={x} cy={y - 20} r={22} fill="#c9d2e3" /><line x1={x} y1={y + 2} x2={x} y2={y + 40} stroke={C.key} strokeWidth={3} /><rect x={x - 8} y={y + 40} width={16} height={12} fill={C.key} /></g>));
const StationIcon: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (o <= 0 ? null : (
  <g opacity={o} stroke={C.key} strokeWidth={4} fill="none"><line x1={x} y1={y + 40} x2={x} y2={y - 30} /><polyline points={`${x},${y - 30} ${x + 34},${y - 18} ${x},${y - 6}`} fill={C.second} stroke={C.second} />
    <line x1={x - 24} y1={y + 40} x2={x + 24} y2={y + 40} /></g>));
const GridIcon: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (o <= 0 ? null : (
  <g opacity={o} stroke={C.muted} strokeWidth={3} fill="none">{[0, 1, 2, 3].map((i) => <g key={i}><line x1={x - 45 + 30 * i} y1={y - 45} x2={x - 45 + 30 * i} y2={y + 45} /><line x1={x - 45} y1={y - 45 + 30 * i} x2={x + 45} y2={y - 45 + 30 * i} /></g>)}</g>));
const S32: React.FC = () => {
  const f = useCurrentFrame(), k = K("s32_reanalysis");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t5 = SS(k, 5), t6 = SS(k, 6);
  const TR = useGlobalTrails();
  const cam: GlobeCam = { lat: 10, lon: -35 + 15 * clamp(f / LEN(k), 0, 1), dist: 4.3, pp: [600, 460] };
  return (
    <Scene>
      <GlobeView cam={cam} dim={0.85}>
        {(G) => <>
          <Streaks G={G} T={TR} fr={f} o={fin(f, 6, 20)} stride={2} vmax={10} />
          <LatCircle G={G} lat={30} c={C.gold} w={4} dash="14 10" o={fin(f, t5)} />
          <LatCircle G={G} lat={-30} c={C.gold} w={4} dash="14 10" o={fin(f, t5)} />
          {Object.entries(HIGHS).map(([nm, hh]) => G.vis(hh.lat, hh.lon) ? <Lbl key={nm} x={G.p(hh.lat, hh.lon)[0]} y={G.p(hh.lat, hh.lon)[1]} t="H" c={C.key} s={T.calc} a="middle" o={fin(f, AT(k, 5, "belts of high pressure"))} /> : null)}
        </>}
      </GlobeView>
      <Svg>
        <Keyword f={f} text="reanalysis" at={[1260, 170]} appear={AT(k, 1, "reanalysis")} targets={[]} s={T.calc} />
        <StationIcon x={1290} y={330} o={fin(f, AT(k, 2, "millions of measurements"))} />
        <BalloonIcon x={1400} y={320} o={fin(f, AT(k, 2, "millions of measurements") + 6)} />
        <SatIcon x={1530} y={320} o={fin(f, AT(k, 2, "millions of measurements") + 12)} />
        <Lbl x={1410} y={410} t="measurements" c={C.key} s={T.floor} a="middle" o={fin(f, AT(k, 2, "millions of measurements") + 12)} />
        <GridIcon x={1730} y={320} o={fin(f, AT(k, 2, "forecast model"))} />
        <Lbl x={1730} y={410} t="model" c={C.key} s={T.floor} a="middle" o={fin(f, AT(k, 2, "forecast model"))} />
        <Keyword f={f} text="long-term mean" at={[1260, 510]} appear={AT(k, 3, "average them")} targets={[]} />
        <Lbl x={1260} y={580} t="1991–2020" c={C.key} s={T.key} o={fin(f, AT(k, 3, "nineteen ninety one"))} />
        <Lbl x={1260} y={680} t="H = high pressure" c={C.key} s={T.key} o={fin(f, AT(k, 5, "belts of high pressure"))} />
        <Lbl x={1260} y={745} t="air presses harder" c={C.local} s={T.key} o={fin(f, AT(k, 5, "belts of high pressure") + 10)} />
        <Keyword f={f} text="subtropical highs" at={[1260, 805]} appear={AT(k, 6, "subtropical highs")} targets={[]} />
      </Svg>
    </Scene>
  );
};
/** an illustrative dashed teal arrow from a high, bending by `bend` deg (+ right), with the orange turn arrow */
const TurnArrow: React.FC<{ G: ReturnType<typeof globeProj>; lat: number; lon: number; az: number; d: number; bend: number; o: number; push?: number }> = ({ G, lat, lon, az, d, bend, o, push = 0 }) => {
  if (o <= 0) return null;
  const pts = gcArrowPts(lat, lon, az, d, bend, 1, 50);
  const mid = pts[22], nxt = pts[24];
  const hd = Math.atan2((nxt[1] - mid[1]) * Math.cos(mid[0] * D2R), nxt[0] - mid[0]) / D2R; // heading (deg from north)
  const side = bend >= 0 ? 90 : -90;
  return <>
    <SurfArrow G={G} pts={pts} c={C.first} w={13} head={48} dash="20 12" o={o} />
    {push > 0 ? <SurfArrow G={G} pts={gcArrowPts(mid[0], mid[1], hd + side, 7, 0, 1, 10)} c={C.second} w={10} head={36} o={o * push} /> : null}
  </>;
};
const S33: React.FC = () => {
  const f = useCurrentFrame(), k = K("s33_trades");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const TR = useGlobalTrails();
  const cam = globePath([{ f: 0, lat: 10, lon: -20, dist: 4.3, pp: [600, 460] }, { f: t7, lat: 5, lon: -30, dist: 4.0, pp: [600, 460] },
    { f: t7 + 45, lat: 15, lon: -40, dist: 2.4, pp: [600, 470] }, { f: t7 + 90, lat: -15, lon: -20, dist: 2.4, pp: [600, 470] },
    { f: SE(k, 8) - 70, lat: 15, lon: -150, dist: 2.4, pp: [600, 470], hop: 0.8 }, { f: SE(k, 8), lat: -15, lon: -120, dist: 2.4, pp: [600, 470] }], f);
  const NA = HIGHS["N Atlantic"], SA = HIGHS["S Atlantic"];
  const bN = 70 * easeIO(clamp((f - AT(k, 1, "turns it to the right")) / 30, 0, 1));
  const bS = -70 * easeIO(clamp((f - AT(k, 3, "turned to the left")) / 30, 0, 1));
  const arrO = fin(f, 6) * fout(f, t5 + 20);
  const trades = fin(f, t5, 20);
  return (
    <Scene>
      <GlobeView cam={cam} dim={0.85}>
        {(G) => <>
          <Streaks G={G} T={TR} fr={f + 400} o={1} stride={2} bright={(la) => (Math.abs(la) <= 30 ? 1 + 0.4 * trades : 1 - 0.55 * trades)} />
          <Lbl x={G.p(NA.lat, NA.lon)[0]} y={G.p(NA.lat, NA.lon)[1]} t="H" c={C.key} s={T.calc} a="middle" o={G.vis(NA.lat, NA.lon) ? fout(f, t5 + 20) : 0} />
          <Lbl x={G.p(SA.lat, SA.lon)[0]} y={G.p(SA.lat, SA.lon)[1]} t="H" c={C.key} s={T.calc} a="middle" o={G.vis(SA.lat, SA.lon) ? fout(f, t5 + 20) : 0} />
          <TurnArrow G={G} lat={NA.lat - 2.5} lon={NA.lon} az={180} d={22} bend={bN} o={arrO} push={fin(f, AT(k, 1, "turns it to the right"))} />
          <TurnArrow G={G} lat={SA.lat + 2.5} lon={SA.lon - 6} az={0} d={22} bend={bS} o={arrO * fin(f, t3)} push={fin(f, AT(k, 3, "turned to the left"))} />
          <LatCircle G={G} lat={15} c={C.gold} w={4} dash="14 10" o={fin(f, t6)} />
          <LatCircle G={G} lat={-15} c={C.gold} w={4} dash="14 10" o={fin(f, t6)} />
          {Array.from({ length: 9 }, (_, i) => {
            const lo = cam.lon - 40 + i * 10;
            if (!G.vis(0, lo)) return null;
            const p = G.p(0, lo), q = G.p(0, lo - 3);
            const ux = q[0] - p[0], uy = q[1] - p[1], L = Math.hypot(ux, uy) || 1, dx = ux / L, dy = uy / L;
            return <polyline key={i} points={`${p[0] - dy * 14 - dx * 10},${p[1] + dx * 14 - dy * 10} ${p[0] + dx * 10},${p[1] + dy * 10} ${p[0] + dy * 14 - dx * 10},${p[1] - dx * 14 - dy * 10}`}
              fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, t8)} />;
          })}
        </>}
      </GlobeView>
      <Svg>
        <Keyword f={f} text="turned right" at={[1300, 200]} appear={AT(k, 1, "turns it to the right")} out={t5} targets={[]} />
        <Keyword f={f} text="north-east trades" at={[1300, 290]} appear={AT(k, 2, "from the north east")} out={t5} targets={[]} />
        <Keyword f={f} text="turned left" at={[1300, 420]} appear={AT(k, 3, "turned to the left")} out={t5} targets={[]} />
        <Keyword f={f} text="south-east trades" at={[1300, 510]} appear={AT(k, 4, "from the south east")} out={t5} targets={[]} />
      </Svg>
      <Vignette id="v33" right={fin(f, t7 - 10, 30)} />
      <Svg>
        <Keyword f={f} text="trade winds" at={[1300, 230]} appear={AT(k, 5, "trade winds")} targets={[]} s={T.calc} />
        <Lbl x={1250} y={360} t="≈ 5–7 m/s" c={C.key} s={T.calc} o={fin(f, AT(k, 6, "five to seven"))} />
        <Lbl x={1250} y={440} t="towards the west" c={C.key} s={T.key} o={fin(f, AT(k, 6, "towards the west"))} />
        <Keyword f={f} text="lean west" at={[1250, 760]} appear={AT(k, 8, "lean towards the west")} targets={[]} />
      </Svg>
    </Scene>
  );
};
const S34: React.FC = () => {
  const f = useCurrentFrame(), k = K("s34_westerlies");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const TR = useGlobalTrails();
  const cam = globePath([{ f: 0, lat: -15, lon: -120, dist: 2.4, pp: [600, 470] }, { f: 50, lat: 5, lon: -20, dist: 4.3, pp: [600, 460], hop: 0.4 },
    { f: t5, lat: 5, lon: 10, dist: 4.3, pp: [600, 460] }, { f: t5 + 60, lat: -50, lon: 60, dist: 3.0, pp: [600, 460] }, { f: t7, lat: -45, lon: 70, dist: 3.1, pp: [600, 460] },
    { f: t7 + 60, lat: 5, lon: 0, dist: 4.3, pp: [600, 460] }], f);
  const NA = HIGHS["N Atlantic"], SI = HIGHS["S Atlantic"];
  const bN = 70 * easeIO(clamp((f - AT(k, 1, "turned to the right")) / 30, 0, 1));
  const bS = -70 * easeIO(clamp((f - AT(k, 2, "turned to the left")) / 30, 0, 1));
  const arrO = fin(f, 20) * fout(f, t3 + 30);
  const west = fin(f, t3, 20);
  return (
    <Scene>
      <GlobeView cam={cam} dim={0.85}>
        {(G) => <>
          <Streaks G={G} T={TR} fr={f + 900} stride={2} bright={(la) => (Math.abs(la) >= 35 && Math.abs(la) <= 65 ? 1 + 0.4 * west : 1 - 0.55 * west)} />
          <TurnArrow G={G} lat={NA.lat + 2.5} lon={NA.lon} az={0} d={20} bend={bN} o={arrO} push={fin(f, AT(k, 1, "turned to the right"))} />
          <TurnArrow G={G} lat={SI.lat - 2.5} lon={SI.lon} az={180} d={20} bend={bS} o={arrO * fin(f, t2)} push={fin(f, AT(k, 2, "turned to the left"))} />
          <Lbl x={G.p(NA.lat, NA.lon)[0]} y={G.p(NA.lat, NA.lon)[1]} t="H" c={C.key} s={T.calc} a="middle" o={G.vis(NA.lat, NA.lon) ? arrO : 0} />
          <Lbl x={G.p(SI.lat, SI.lon)[0]} y={G.p(SI.lat, SI.lon)[1]} t="H" c={C.key} s={T.calc} a="middle" o={G.vis(SI.lat, SI.lon) ? arrO : 0} />
          <LatCircle G={G} lat={45} c={C.gold} w={4} dash="14 10" o={fin(f, t4) * fout(f, t6)} />
          <LatCircle G={G} lat={-45} c={C.gold} w={4} dash="14 10" o={fin(f, t4) * fout(f, t6)} />
        </>}
      </GlobeView>
      <Vignette id="v34" right={fin(f, t5 + 20, 30) * fout(f, t7 + 40, 30)} />
      <Svg>
        <Keyword f={f} text="turned right" at={[1300, 200]} appear={AT(k, 1, "turned to the right")} out={t3} targets={[]} />
        <Keyword f={f} text="turned left" at={[1300, 300]} appear={AT(k, 2, "turned to the left")} out={t3} targets={[]} />
        <Keyword f={f} text="westerlies" at={[1200, 200]} appear={AT(k, 3, "the westerlies")} out={t6} targets={[]} s={T.calc} />
        <Lbl x={1200} y={300} t="named from where they blow" c={C.key} s={T.floor} o={fin(f, AT(k, 3, "named")) * fout(f, t6)} />
        <g opacity={fin(f, AT(k, 3, "the direction they blow from")) * fout(f, t6)}><Arrow p={[1300, 380]} q={[1480, 380]} color={C.gold} w={6} head={28} /><Lbl x={1500} y={380} t="from the west" c={C.gold} s={T.key} /></g>
        <Lbl x={1250} y={480} t="≈ 3–7.5 m/s" c={C.key} s={T.calc} o={fin(f, AT(k, 4, "three to seven")) * fout(f, t6)} />
        <Lbl x={1250} y={550} t="towards the east" c={C.key} s={T.key} o={fin(f, AT(k, 4, "towards the east")) * fout(f, t6)} />
        <Keyword f={f} text="Southern Ocean" at={[1250, 660]} appear={AT(k, 5, "Southern Ocean")} out={t6} targets={[]} />
        <Lbl x={1300} y={260} t="pressure patterns" c={C.local} s={T.key} o={fin(f, AT(k, 7, "Pressure patterns"))} />
        <Lbl x={1300} y={340} t="friction" c={C.local} s={T.key} o={fin(f, AT(k, 7, "friction"))} />
        <Lbl x={1300} y={480} t="Coriolis turning" c={C.key} s={T.calc} o={fin(f, t8)} />
        <Lbl x={1300} y={570} t="→ east or west" c={C.key} s={T.calc} o={fin(f, AT(k, 8, "mostly east or west"))} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s35–s38 the storms
const IAN_BOX = { lat: ian.lat_edges as [number, number], lon: ian.lon_edges as [number, number] };
const IDAI_BOX = { lat: idai.lat_edges as [number, number], lon: idai.lon_edges as [number, number] };
const IAN_CAM: GlobeCam = { lat: (ian.eye as number[])[0], lon: (ian.eye as number[])[1], dist: 1.42, pp: [700, 480] };
const IDAI_CAM: GlobeCam = { lat: (idai.eye as number[])[0], lon: (idai.eye as number[])[1], dist: 1.42, pp: [700, 480] };
/** the 8 dashed inward arrows at 300 km (illustrative), bending by bend[i] degrees (+ right) */
const Inflow: React.FC<{ G: ReturnType<typeof globeProj>; starts: number[][]; az: number[]; bend: number[]; o: number; hi?: number }> = ({ G, starts, az, bend, o, hi = -1 }) => (
  <>{starts.map((s, i) => <SurfArrow key={i} G={G} pts={gcArrowPts(s[0], s[1], (az[i] + 180) % 360, 2.0, bend[i], 1, 30)} c={C.first} w={hi === i ? 12 : 9} head={34} dash="16 10" o={o} r={1.0025} />)}</>
);
const usIan = () => decodeTrails(useBin(staticFile("cp/trails_ian.bin")), trI.n, trI.L);
const usIdai = () => decodeTrails(useBin(staticFile("cp/trails_idai.bin")), trD.n, trD.L);
const S35: React.FC = () => {
  const f = useCurrentFrame(), k = K("s35_storms");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3);
  const cam = globePath([{ f: 0, lat: 5, lon: 0, dist: 4.3, pp: [700, 460] }, { ...IAN_CAM, f: SE(k, 1) - 10 }], f);
  const eye = ian.eye as number[];
  return (
    <Scene>
      <GlobeView cam={cam} drapes={[{ url: "cp/ian_tc.jpg", lat: IAN_BOX.lat, lon: IAN_BOX.lon, o: fin(f, 30, 30) }]} res50={f > SE(k, 1) - 40} coast={0.35}>
        {(G) => {
          const a = kmOff(eye[0], eye[1], -250, -330), b = kmOff(eye[0], eye[1], 250, -330);
          const pa = G.p(a[0], a[1]), pb = G.p(b[0], b[1]);
          return <>
            <g opacity={fin(f, AT(k, 1, "hundreds of kilometres"))}>
              <line x1={pa[0]} y1={pa[1]} x2={pb[0]} y2={pb[1]} stroke={C.ink} strokeWidth={4} />
              <line x1={pa[0]} y1={pa[1] - 12} x2={pa[0]} y2={pa[1] + 12} stroke={C.ink} strokeWidth={4} /><line x1={pb[0]} y1={pb[1] - 12} x2={pb[0]} y2={pb[1] + 12} stroke={C.ink} strokeWidth={4} />
              <Lbl x={(pa[0] + pb[0]) / 2} y={pa[1] + 36} t="500 km" c={C.ink} s={T.floor} a="middle" />
            </g>
            <Lbl x={G.p(eye[0], eye[1])[0]} y={G.p(eye[0], eye[1])[1]} t="L" c={C.key} s={T.calc} a="middle" o={fin(f, AT(k, 2, "very low pressure"))} />
            <Inflow G={G} starts={ian.inward_starts as number[][]} az={ian.inward_az as number[]} bend={Array(8).fill(0)} o={fin(f, t3 + 10)} />
          </>;
        }}
      </GlobeView>
      <Vignette id="v35" right={fin(f, SE(k, 1) - 30, 30)} />
      <Svg>
        <Keyword f={f} text="hurricane" at={[1340, 200]} appear={AT(k, 1, "A hurricane")} targets={[]} s={T.calc} />
        <Keyword f={f} text="very low pressure" at={[1340, 330]} appear={AT(k, 2, "very low pressure")} targets={[]} />
        <Keyword f={f} text="pushed towards the low" at={[1240, 450]} appear={AT(k, 3, "pushed towards")} targets={[]} />
      </Svg>
    </Scene>
  );
};
/** 4 particles (deterministic choice from the data) that start 200–400 km out and get closest to the centre */
const pickSpiral = (TRd: ReturnType<typeof decodeTrails>, c: number[]) => {
  if (!TRd) return [];
  const out: { i: number; minR: number; q: number }[] = [];
  for (let i = 0; i < TRd.n; i++) {
    const s0 = i * TRd.L;
    const la0 = TRd.ll[2 * s0] / 100, lo0 = TRd.ll[2 * s0 + 1] / 100;
    const r0 = Math.hypot((la0 - c[0]) * 111.2, (lo0 - c[1]) * 111.2 * Math.cos(c[0] * D2R));
    if (r0 < 200 || r0 > 380) continue;
    let minR = 1e9;
    for (let j = 0; j < TRd.L; j++) {
      const s = s0 + j;
      if (TRd.ll[2 * s] === -32768) break;
      const r = Math.hypot((TRd.ll[2 * s] / 100 - c[0]) * 111.2, (TRd.ll[2 * s + 1] / 100 - c[1]) * 111.2 * Math.cos(c[0] * D2R));
      minR = Math.min(minR, r);
    }
    const q = Math.floor(((Math.atan2(la0 - c[0], lo0 - c[1]) / Math.PI + 1) * 2)) % 4;
    out.push({ i, minR, q });
  }
  return [0, 1, 2, 3].map((q) => out.filter((o) => o.q === q).sort((a, b) => a.minR - b.minR)[0]).filter(Boolean).map((o) => o!.i);
};
const S36: React.FC = () => {
  const f = useCurrentFrame(), k = K("s36_ian");
  const t1 = SS(k, 1), tC = AT(k, 1, "south west coast of Florida"), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11);
  const TRd = usIan();
  const spir = React.useMemo(() => pickSpiral(TRd, trI.centre), [TRd]);
  const eye = ian.eye as number[], hc = ian.hrrr_centre as number[];
  const ir = fin(f, t2, 20) * fout(f, t3 - 10, 20);
  const model = fin(f, t5 + 10, 20);
  // bending order: south arrow (az 180) on S8, east arrow (az 90) on S9, the rest on S10
  const az = ian.inward_az as number[];
  const bendAt = az.map((a) => (a === 180 ? AT(k, 7, "turned towards the east") : a === 90 ? AT(k, 8, "turned towards the north") : t9 + 10 + az.indexOf(a) * 6));
  const bend = bendAt.map((b) => 75 * easeIO(clamp((f - b) / 24, 0, 1)));
  const hi = f >= t7 && f < t8 ? az.indexOf(180) : f >= t8 && f < t9 ? az.indexOf(90) : -1;
  const RR = (ianRing.radius_km as number) ?? 150;
  const ring = Array.from({ length: 49 }, (_, i) => { const a = (i / 48) * 2 * Math.PI * 0.85; return kmOff(eye[0], eye[1], RR * Math.cos(a), RR * Math.sin(a)); });
  const band = Array.from({ length: 40 }, (_, i) => { const a = 0.4 + (i / 39) * 1.5 * Math.PI, r = 300 - 120 * (i / 39); return kmOff(eye[0], eye[1], r * Math.cos(a), r * Math.sin(a)); });
  const nSp = Math.round(clamp((f - t10) / (SE(k, 11) - t10), 0, 1) * (trI.L - 1));
  return (
    <Scene>
      <GlobeView cam={IAN_CAM} res50 coast={0.35 + 0.4 * pulse(f, tC, 30)} drapes={[{ url: "cp/ian_tc.jpg", lat: IAN_BOX.lat, lon: IAN_BOX.lon, o: 1 - 0.3 * model }, { url: "cp/ian_ir.png", lat: IAN_BOX.lat, lon: IAN_BOX.lon, o: 0 * ir }]}>
        {(G) => <>
          <Streaks G={G} T={TRd} fr={f} o={model} vmax={40} w={2} />
          {spir.map((i, j) => {
            const pts: [number, number][] = [];
            for (let s = 0; s <= nSp; s++) { const q = i * trI.L + s; if (TRd!.ll[2 * q] === -32768) break; pts.push([TRd!.ll[2 * q] / 100, TRd!.ll[2 * q + 1] / 100]); }
            return pts.length > 1 ? <path key={j} d={llPath(G, pts, 1.003)} fill="none" stroke={C.gold} strokeWidth={5} strokeLinecap="round" /> : null;
          })}
          <path d={llPath(G, (ian.track as (number | string)[][]).map((p) => [p[0] as number, p[1] as number]), 1.003)} fill="none" stroke={C.gold} strokeWidth={3} opacity={fin(f, t3 + 10) * fout(f, t5)} />
          {(ian.track as (number | string)[][]).map((p, i) => <circle key={i} cx={G.p(p[0] as number, p[1] as number)[0]} cy={G.p(p[0] as number, p[1] as number)[1]} r={6} fill={C.gold} opacity={fin(f, t3 + 10 + i * 2) * fout(f, t5)} />)}
          <SurfArrow G={G} pts={band} c={C.gold} w={6} head={30} o={fin(f, t2 + 6) * fout(f, t4)} />
          <Inflow G={G} starts={ian.inward_starts as number[][]} az={az} bend={bend} o={fin(f, t6)} hi={hi} />
          <SurfArrow G={G} pts={ring} c={C.gold} w={7} head={36} o={fin(f, AT(k, 9, "anticlockwise spin"))} />
          <Lbl x={G.p(28.6, -78.6)[0]} y={G.p(28.6, -78.6)[1]} t="Florida" c={C.key} s={T.floor} a="start" o={fin(f, t1) * fout(f, t5)} />
          <Keyword f={f} text="eye" at={[G.p(eye[0], eye[1])[0] - 160, G.p(eye[0], eye[1])[1] + 150]} appear={AT(k, 1, "called the eye")} out={t3} targets={[G.p(hc[0], hc[1])]} />
        </>}
      </GlobeView>
      <Vignette id="v36" right={1} />
      <Svg>
        <Lbl x={1360} y={150} t="Hurricane Ian · 28 September 2022" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 0, "twenty eighth"))} />
        <Lbl x={1340} y={380} t="≈ 67 m/s" c={C.key} s={T.calc} o={fin(f, AT(k, 3, "sixty seven")) * fout(f, t5 + 10)} />
        <Lbl x={1340} y={455} t="observed" c={C.local} s={T.key} o={fin(f, t4 + 10) * fout(f, t5 + 10)} />
        <Keyword f={f} text="3-km weather model" at={[1340, 260]} appear={AT(k, 5, "three kilometre grid")} targets={[]} s={T.floor} />
        <Keyword f={f} text="turned right" at={[1340, 380]} appear={AT(k, 6, "turned to the right")} out={AT(k, 9, "anticlockwise spin")} targets={[]} />
        <Keyword f={f} text="all the way round" at={[1300, 560]} appear={t9} out={AT(k, 9, "anticlockwise spin")} targets={[]} />
        <Keyword f={f} text="anticlockwise" at={[1300, 480]} appear={AT(k, 9, "anticlockwise spin")} targets={[]} />
        <Lbl x={1300} y={550} t="from above" c={C.key} s={T.key} o={fin(f, AT(k, 9, "seen from above"))} />
        <Keyword f={f} text="spirals inwards" at={[1300, 690]} appear={AT(k, 11, "spirals inwards")} targets={[]} />
      </Svg>
    </Scene>
  );
};
const S37: React.FC = () => {
  const f = useCurrentFrame(), k = K("s37_idai");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const TRd = usIdai();
  const cam = globePath([{ ...IAN_CAM, f: 0 }, { ...IDAI_CAM, f: 95, hop: 2.2 }], f);
  const eye = idai.eye as number[];
  const az = idai.inward_az as number[];
  const bend = az.map((_, i) => -75 * easeIO(clamp((f - t6 - 10 - i * 5) / 24, 0, 1)));
  const RR = (idaiRing.radius_km as number) ?? 150;
  const ring = Array.from({ length: 49 }, (_, i) => { const a = -(i / 48) * 2 * Math.PI * 0.85; return kmOff(eye[0], eye[1], RR * Math.cos(a), RR * Math.sin(a)); });
  const band = Array.from({ length: 40 }, (_, i) => { const a = -0.4 - (i / 39) * 1.5 * Math.PI, r = 300 - 120 * (i / 39); return kmOff(eye[0], eye[1], r * Math.cos(a), r * Math.sin(a)); });
  const split = fin(f, t8, 16);
  return (
    <Scene>
      <div style={{ opacity: 1 - split }}>
        <GlobeView cam={cam} res50={f > 90} drapes={[{ url: "cp/idai_14.jpg", lat: IDAI_BOX.lat, lon: IDAI_BOX.lon, o: fin(f, 80, 20) * (1 - 0.3 * fin(f, t6)) }]}>
          {(G) => <>
            <LatCircle G={G} lat={0} c={C.gold} w={5} o={win(f, 20, 80)} />
            <Streaks G={G} T={TRd} fr={f} o={fin(f, t6, 20)} vmax={30} />
            <SurfArrow G={G} pts={band} c={C.gold} w={6} head={30} o={fin(f, t3) * fout(f, t5)} />
            <Inflow G={G} starts={idai.inward_starts as number[][]} az={az} bend={bend} o={fin(f, t6)} />
            <SurfArrow G={G} pts={ring} c={C.gold} w={7} head={36} o={fin(f, t7)} />
            <Lbl x={G.p(-16.4, 37.6)[0]} y={G.p(-16.4, 37.6)[1]} t="Mozambique" c={C.key} s={T.floor} a="middle" o={fin(f, AT(k, 2, "Mozambique")) * fout(f, t6)} />
            <Lbl x={G.p(-19.5, 46.5)[0]} y={G.p(-19.5, 46.5)[1]} t="Madagascar" c={C.key} s={T.floor} a="middle" o={fin(f, AT(k, 2, "Madagascar")) * fout(f, t4)} />
          </>}
        </GlobeView>
      </div>
      <div style={{ opacity: 1 - split }}><Vignette id="v37" right={fin(f, 70, 20)} /></div>
      {split > 0 ? <div style={{ opacity: split }}><SplitStorms f={f} k={k} t0={t8} cols={false} /></div> : null}
      <Svg>
        <Lbl x={1360} y={150} t="Cyclone Idai · 14 March 2019" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "fourteenth of March")) * (1 - split)} />
        <Keyword f={f} text="cyclone" at={[1340, 270]} appear={AT(k, 4, "called cyclones")} out={t8} targets={[]} s={T.calc} />
        <Lbl x={1340} y={390} t="≈ 54–59 m/s" c={C.key} s={T.calc} o={fin(f, AT(k, 5, "fifty four to fifty nine")) * fout(f, t6 + 20)} />
        <Lbl x={1340} y={470} t="observed" c={C.local} s={T.key} o={fin(f, AT(k, 5, "best estimates")) * fout(f, t6 + 20)} />
        <Lbl x={1340} y={400} t="f < 0" c={C.neg} s={T.calc} o={fin(f, AT(k, 6, "f is negative")) * fout(f, t8)} />
        <Keyword f={f} text="clockwise" at={[1340, 520]} appear={AT(k, 7, "clockwise")} out={t8} targets={[]} />
        <Lbl x={1340} y={590} t="from above" c={C.key} s={T.key} o={fin(f, AT(k, 7, "seen from above")) * fout(f, t8)} />
      </Svg>
    </Scene>
  );
};
/** Ian | Idai side by side; `cols` adds the ring of r, u and the violet k·(r × u) columns (s38); `tilt` the oblique view */
const SplitStorms: React.FC<{ f: number; k: number; t0: number; cols: boolean; tilt?: number; tCols?: number; tIan?: number; tIdai?: number; ianDx?: number;
  extraIan?: (G: ReturnType<typeof globeProj>) => React.ReactNode }> = ({ f, t0, cols, tilt = 0, tCols = 0, tIan = 0, tIdai = 0, ianDx = 0, extraIan }) => {
  const VW = 860, VH = 560, VY = 200;
  const specs = [{ x: 80, cam: { ...IAN_CAM, dist: cols ? 1.1 : 1.32, tilt }, box: IAN_BOX, url: "cp/ian_tc.jpg", ring: ianRing, lab: "f > 0 · anticlockwise", tC: tIan },
    { x: 980, cam: { ...IDAI_CAM, dist: cols ? 1.1 : 1.32, tilt }, box: IDAI_BOX, url: "cp/idai_14.jpg", ring: idaiRing, lab: "f < 0 · clockwise", tC: tIdai }];
  return (
    <>
      {specs.map((s, i) => (
        <GlobeView key={i} cam={{ ...s.cam, pp: [VW / 2 + (i === 0 ? ianDx : 0), VH / 2 + (cols ? 40 : 0)] }} x={s.x} y={VY} w={VW} h={VH} res50 coast={0.3}
          drapes={[{ url: s.url, lat: s.box.lat, lon: s.box.lon, o: cols ? 0.4 : 1 }]}>
          {(G) => {
            if (!cols) return null;
            const c = s.ring.centre as number[];
            const cp = G.p(c[0], c[1]);
            return <>
              {(s.ring.pts as number[][]).map((p, j) => {
                const pp = G.p(p[0], p[1]);
                const u = (s.ring.u as number[][])[j];
                const tip = kmOff(p[0], p[1], 3.2 * u[0], 3.2 * u[1]);
                const vt = (s.ring.vt as number[])[j];
                const top = G.pw(ll(p[0], p[1], 1 + (5 * vt) / 6371));
                const oc = fin(f, tCols + j * 2, 8);
                return <g key={j}>
                  <line x1={cp[0]} y1={cp[1]} x2={pp[0]} y2={pp[1]} stroke={C.first} strokeWidth={4} opacity={0.85 * fin(f, t0 + 10 + j)} />
                  <Arrow p={pp} q={G.p(tip[0], tip[1])} color={C.second} w={6} head={20} halo={false} o={fin(f, t0 + 40 + j)} />
                  <line x1={pp[0]} y1={pp[1]} x2={top[0]} y2={top[1]} stroke={vt < 0 ? C.neg : ROT} strokeWidth={9} strokeDasharray={vt < 0 ? "10 7" : undefined} opacity={oc * fin(f, s.tC, 10)} strokeLinecap="round" />
                </g>;
              })}
              <circle cx={cp[0]} cy={cp[1]} r={8} fill={C.key} />
              {i === 0 && extraIan ? extraIan(G) : null}
            </>;
          }}
        </GlobeView>
      ))}
      {!cols ? <Svg>{specs.map((s, i) => <Lbl key={i} x={s.x + VW / 2} y={VY + VH + 50} t={s.lab} c={i === 0 ? C.key : C.neg} s={T.key} a="middle" o={fin(f, t0 + 10)} />)}</Svg> : null}
    </>
  );
};
const S38: React.FC = () => {
  const f = useCurrentFrame(), k = K("s38_spin_sign");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const tilt = 55 * easeIO(clamp(f / 40, 0, 1));
  const ianUp = (ianRing.kz as number[]).every((v) => v > 0), idaiDown = (idaiRing.kz as number[]).every((v) => v < 0);
  if (!ianUp || !idaiDown) throw new Error("ring signs ≠ narration (all the way round)");
  // inset: the hand on one Ian ring point (r east, u north: anticlockwise), thumb up along r × u
  const IN = { x: 610, y: 400, w: 330, h: 360 };
  const inSt = orbitCam({ az: 300, el: 26, dist: 6.4, target: [0.6, 0.5, 0.8], pp: [IN.w / 2, IN.h / 2] }, [0, 0]);
  const inPr = projector(inSt, IN.w, IN.h, IN.x, IN.y);
  const handO = fin(f, t3, 12) * fout(f, t5 + 10, 12);
  const pts = ianRing.pts as number[][];
  const jE = pts.reduce((b, p, j) => (p[1] > pts[b][1] ? j : b), 0);   // the ring point east of the centre
  return (
    <Scene>
      <SplitStorms f={f} k={k} t0={t1} cols tilt={tilt} tCols={t2} tIan={t2} tIdai={t2} ianDx={-150}
        extraIan={(G) => { const p = G.p(pts[jE][0], pts[jE][1]); return <g opacity={handO}>
          <circle cx={p[0]} cy={p[1]} r={16} fill="none" stroke={C.gold} strokeWidth={5} />
          <line x1={p[0] + 16} y1={p[1]} x2={IN.x + 30} y2={IN.y + IN.h / 2} stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" />
        </g>; }} />
      <View3D st={inSt} x={IN.x} y={IN.y} w={IN.w} h={IN.h} o={handO}>
        <Arrow3D from={[0, 0, 0]} to={[1.6, 0, 0]} color={C.first} px={8} head={28} />
        <Arrow3D from={[1.6, 0, 0]} to={[1.6, 1.2, 0]} color={C.second} px={8} head={28} />
        <Arrow3D from={[0, 0, 0]} to={[0, 0, 1.5]} color={ROT} px={10} head={32} grow={fin(f, t4, 14)} />
        <Hand3D q={handQuat([1, 0, 0], [0, 0, 1])} at={[-0.35, 0, 0.6]} s={0.75} angles={POSE.curl(0.2 + 0.7 * fin(f, t3 + 20, 30))} glow={{ thumb: ROT }} glowK={fin(f, t4, 10)} />
      </View3D>
      <Svg>
        <TipL3 pr={inPr} from={[0, 0, 0]} to={[1.6, 0, 0]} t="r" c={C.first} s={T.key} o={handO} />
        <TipL3 pr={inPr} from={[1.6, 0, 0]} to={[1.6, 1.2, 0]} t="u" c={C.second} s={T.key} o={handO} />
        <Lbl x={510} y={130} t="Ian" c={C.key} s={T.key} a="middle" o={fin(f, 10)} />
        <Lbl x={1410} y={130} t="Idai" c={C.key} s={T.key} a="middle" o={fin(f, 10)} />
        <Keyword f={f} text="anticlockwise → up" at={[510, 830]} a="middle" appear={AT(k, 4, "point up")} out={t6} targets={[]} />
        <CircleDot x={860} y={260} r={34} o={fin(f, t5)} />
        <CircleCross x={1760} y={260} r={34} o={fin(f, t6)} />
        <Lbl x={510} y={830} t="north: anticlockwise" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 8, "anticlockwise in the north"))} />
        <Lbl x={1410} y={830} t="south: clockwise" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 8, "clockwise in the south"))} />
      </Svg>
      <TeX s={EQ_RXU} x={960} y={130} size={T.calc} ax={0.5} c={ROT} o={fin(f, AT(k, 2, "r cross u"))} />
    </Scene>
  );
};

// ================================================================ s39–s44 the idealised pressure map (strip map)
type SMap = { x0: number; y0: number; km: number };
const SM: SMap = { x0: 120, y0: 200, km: 0.735 };
const DLUT = geo.lut_dense_r as string[];
const smX = (g: SMap, xk: number) => g.x0 + xk * g.km, smY = (g: SMap, yk: number) => g.y0 + (600 - yk) * g.km;
const pAt = (yk: number, steep = false) => 1010 - (steep ? 2 : 1) * (yk / 100);
const pCol = (p: number) => DLUT[Math.round(clamp((p - 1004) / 6, 0, 1) * (DLUT.length - 1))];
/** the strip map (1200 × 600 km): pressure colours, isobars (every 2 hPa; `iso` = how many drawn), optional labels */
const StripMap: React.FC<{ g?: SMap; o?: number; iso?: number; labels?: boolean; ticks?: boolean; bar?: boolean; HL?: number; steep?: boolean; isoHi?: number }> = ({
  g = SM, o = 1, iso = 4, labels = true, ticks = true, bar = true, HL = 1, steep = false, isoHi = -1 }) => {
  if (o <= 0) return null;
  const n = 40, W = 1200 * g.km, H = 600 * g.km;
  const isoY = steep ? [0, 100, 200, 300, 400, 500, 600] : (geo.isobars_km as number[]);
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => <rect key={i} x={g.x0} y={g.y0 + (i * H) / n} width={W} height={H / n + 0.7} fill={pCol(pAt(600 - ((i + 0.5) * 600) / n, steep))} />)}
      {isoY.map((yk, i) => {
        const d = clamp(iso - i, 0, 1);
        if (d <= 0) return null;
        return <g key={i}>
          <line x1={g.x0} y1={smY(g, yk)} x2={g.x0 + W * d} y2={smY(g, yk)} stroke="#ffffff" strokeOpacity={0.8} strokeWidth={isoHi === i ? 7 : 3} />
          {labels && (!steep || i % 2 === 0) ? <Lbl x={g.x0 + 14} y={smY(g, yk) + (yk === 0 ? -36 : 30)} t={`${pAt(yk, steep)}`} c={C.ink} s={T.key} o={d} /> : null}
        </g>;
      })}
      <rect x={g.x0} y={g.y0} width={W} height={H} fill="none" stroke={C.grid} strokeWidth={3} />
      {ticks ? <>{[0, 400, 800, 1200].map((x) => <Lbl key={x} x={smX(g, x)} y={g.y0 + H + 46} t={x === 1200 ? "1200 km" : `${x}`} c={C.muted} s={T.floor} a="middle" b={false} />)}</> : null}
      {bar ? <g>
        {DLUT.map((c, i) => <rect key={i} x={g.x0 + W + 16} y={g.y0 + (i * H) / DLUT.length} width={20} height={H / DLUT.length + 0.7} fill={c} />)}
        {[1004, 1006, 1008, 1010].map((p) => <Lbl key={p} x={g.x0 + W + 44} y={g.y0 + ((p - 1004) / 6) * H} t={`${p}`} c={C.muted} s={T.floor} b={false} />)}
      </g> : null}
      <Lbl x={g.x0 + W / 2} y={g.y0 + H + 0} t="" c={C.key} s={T.key} o={0} />
      <Lbl x={g.x0 + W / 2} y={g.y0 - 40} t="L" c={C.key} s={T.calc} a="middle" o={HL} />
      <Lbl x={g.x0 + W / 2} y={g.y0 + H + (ticks ? 98 : 44)} t="H" c={C.key} s={T.calc} a="middle" o={HL} />
    </g>
  );
};
const S39: React.FC = () => {
  const f = useCurrentFrame(), k = K("s39_isobars");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const iso = clamp((f - t4 - 6) / 26, 0, 4);
  return (
    <Scene>
      <Svg>
        <StripMap o={fin(f, 6, 16)} iso={iso} isoHi={f >= t6 ? 2 : -1} />
        <Keyword f={f} text="pressure" at={[1230, 200]} appear={AT(k, 1, "Air presses")} targets={[]} />
        <Lbl x={1230} y={300} t="hectopascals: hPa" c={C.key} s={T.key} o={fin(f, AT(k, 2, "hectopascals"))} />
        <Lbl x={1230} y={400} t="≈ 1000 hPa" c={C.key} s={T.calc} o={fin(f, AT(k, 3, "about a thousand"))} />
        <MiniIsoMap x={1460} y={560} w={300} h={180} o={0.45 * fin(f, t5)} labels={false} arrows={false} />
        <Lbl x={1610} y={790} t="isotherms" c={C.local} s={T.key} a="middle" o={0.8 * fin(f, t5)} />
        <Keyword f={f} text="isobars" at={[smX(SM, 640), smY(SM, 520)]} appear={AT(k, 6, "isobars")} targets={[[smX(SM, 860), smY(SM, 400) - 6]]} />
      </Svg>
    </Scene>
  );
};
const PIN_KM: [number, number] = [600, 300];
const S40: React.FC = () => {
  const f = useCurrentFrame(), k = K("s40_pressure_push");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4);
  const pin: Pt = [smX(SM, PIN_KM[0]), smY(SM, PIN_KM[1])];
  const PUSH: Part[] = [{ t: DF(EQ_PUSH), c: C.second, u: { w: String.raw`\text{pressure push}`, c: C.second } }];
  return (
    <Scene>
      <Svg>
        <StripMap />
        <Arrow p={pin} q={[pin[0], pin[1] + 130]} color={C.second} o={fin(f, 6)} />
        <RightTick at={pin} u1={[1, 0]} u2={[0, 1]} o={fin(f, t1)} />
        <Lbl x={pin[0] + 30} y={pin[1] + 120} t="∇p" c={C.second} s={T.calc} o={0} />
        <Arrow p={pin} q={[pin[0], pin[1] - 130]} color={C.second} dash="16 10" o={fin(f, t2)} />
        <circle cx={pin[0]} cy={pin[1]} r={10} fill={C.key} />
        <Keyword f={f} text="high → low" at={[1230, 350]} appear={AT(k, 2, "from high pressure towards low")} targets={[]} />
        <Lbl x={1230} y={720} t="ρ: density" c={C.key} s={T.key} o={fin(f, AT(k, 4, "density"))} />
        <Lbl x={1230} y={795} t="mass of 1 m³ of air" c={C.local} s={T.key} o={fin(f, AT(k, 4, "density") + 8)} />
      </Svg>
      <TeX s={String.raw`\nabla p`} x={pin[0] + 24} y={pin[1] + 110} size={T.calc} c={C.second} o={fin(f, 10)} halo />
      <TeX s={String.raw`-\nabla p`} x={pin[0] + 24} y={pin[1] - 110} size={T.calc} c={C.second} o={fin(f, t2 + 8)} halo />
      <TeX s={String.raw`\nabla p\ \to\ \text{towards high}`} x={1230} y={150} size={T.key} c={C.second} o={fin(f, AT(k, 1, "towards high pressure"))} />
      <TeX s={String.raw`\nabla T\ \to\ \text{towards warmer}`} x={1230} y={240} size={T.key} c={C.local} o={0.8 * fin(f, AT(k, 0, "Like grad T"))} />
      <Layered parts={PUSH} layers={[{ t: "all", o: 1 }, { u: [0], o: fin(f, t3 + 30) }]} x={1230} y={420} size={T.calc} ay={0} o={fin(f, AT(k, 3, "minus one over rho"))} />
      <TeX s={String.raw`\rho \approx 1.2\ \mathrm{kg/m^3}`} x={1540} y={720} size={T.key} o={fin(f, AT(k, 4, "about one point two"))} />
    </Scene>
  );
};
const S41: React.FC = () => {
  const f = useCurrentFrame(), k = K("s41_adjust");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10);
  const c0 = t1, c1 = SE(k, 6);
  const tH = geo.adjust_t_h as number[], XY = geo.adjust_xy_km as number[][], UV = geo.adjust_uv as number[][];
  const Tmax = tH[tH.length - 1];
  const h = clamp((f - c0) / (c1 - c0), 0, 1) * Tmax;
  const n = Math.min(tH.length - 1, Math.floor((h / Tmax) * (tH.length - 1)));
  const pos = XY[n], uv = UV[n];
  const P = (q: number[]): Pt => [smX(SM, q[0]), smY(SM, q[1])];
  const pp = P(pos);
  const fC = geo.f, push = (geo.push_m_s2 as number[])[1];
  const AS = 105 / push;   // px per m/s² for the pushes (own display scale)
  const cor: Pt = [fC * uv[1] * AS, -(-fC * uv[0]) * AS]; // −f k × u = f (v, −u); screen y down
  const trail = XY.slice(0, n + 1).map((q) => P(q).join(",")).join(" ");
  const avgY = 300 + (geo.loop_radius_km as number);
  const bal = fin(f, t7, 14);
  const bx = 150 + 950 * clamp((f - t7) / (SE(k, 9) - t7), 0, 1);
  const bp: Pt = [smX(SM, bx), smY(SM, avgY)];
  const VS = 13; // px per m/s for the velocity arrow (own scale)
  return (
    <Scene>
      <Svg>
        <StripMap bar={false} />
        <line x1={SM.x0} y1={smY(SM, avgY)} x2={SM.x0 + 1200 * SM.km} y2={smY(SM, avgY)} stroke={C.gold} strokeWidth={5} strokeDasharray="16 10" opacity={fin(f, AT(k, 6, "on average"))} />
        <polyline points={trail} fill="none" stroke={C.first} strokeWidth={4} opacity={0.9 * (1 - 0.5 * bal)} />
        <g opacity={1 - bal}>
          {Math.hypot(uv[0], uv[1]) > 0.3 ? <Arrow p={pp} q={[pp[0] + uv[0] * VS, pp[1] - uv[1] * VS]} color={C.first} w={8} head={30} /> : null}
          <Arrow p={pp} q={[pp[0], pp[1] - 105]} color={C.second} dash="14 9" w={8} head={30} o={fin(f, t1)} />
          {Math.hypot(...cor) > 4 ? <Arrow p={pp} q={[pp[0] + cor[0], pp[1] + cor[1]]} color={ROT} w={7} head={26} o={fin(f, t2)} /> : null}
          <circle cx={pp[0]} cy={pp[1]} r={11} fill={C.key} stroke={C.bg} strokeWidth={3} />
        </g>
        <g opacity={bal}>
          <Arrow p={bp} q={[bp[0] + (geo.geo_speed as number) * VS, bp[1]]} color={C.first} w={8} head={30} />
          <Arrow p={bp} q={[bp[0], bp[1] - 105]} color={C.second} dash="14 9" w={8} head={30} />
          <Arrow p={bp} q={[bp[0], bp[1] + 105]} color={ROT} w={8} head={30} />
          <circle cx={bp[0]} cy={bp[1]} r={11} fill={C.key} stroke={C.bg} strokeWidth={3} />
          <line x1={bp[0] - 100} y1={bp[1] - 12} x2={bp[0] - 44} y2={bp[1] - 12} stroke={C.gold} strokeWidth={9} strokeLinecap="round" />
          <line x1={bp[0] - 100} y1={bp[1] + 12} x2={bp[0] - 44} y2={bp[1] + 12} stroke={C.gold} strokeWidth={9} strokeLinecap="round" />
        </g>
        <g opacity={fin(f, c0) * fout(f, t7 + 20)}><ClockGlyph x={1190} y={150} r={30} h={(h * 12) % 12} /><Lbl x={1240} y={150} t={`t = ${h.toFixed(0)} h`} c={C.key} s={T.key} /></g>
        <Keyword f={f} text="at rest" at={[1170, 260]} appear={AT(k, 0, "starts at rest")} out={t2} targets={[]} />
        <Keyword f={f} text="Coriolis push" at={[1170, 330]} appear={AT(k, 2, "turns it to the right")} targets={[]} c={ROT} />
        <Keyword f={f} text="pressure push" at={[1170, 400]} appear={AT(k, 1, "pressure push")} targets={[]} c={C.second} />
        <Lbl x={1170} y={470} t="towards the low" c={C.second} s={T.key} o={fin(f, AT(k, 8, "towards the low"))} />
        <Lbl x={1170} y={540} t="towards the high" c={ROT} s={T.key} o={fin(f, AT(k, 8, "towards the high"))} />
        <Lbl x={1170} y={470} t="equal and opposite" c={C.gold} s={T.key} o={fin(f, t7) * fout(f, AT(k, 8, "towards the low") - 8)} />
        <Keyword f={f} text="geostrophic balance" at={[1170, 650]} appear={AT(k, 9, "geostrophic balance")} targets={[]} s={T.calc} />
        <Keyword f={f} text="geostrophic wind" at={[1170, 740]} appear={AT(k, 9, "geostrophic wind")} targets={[]} />
        <Keyword f={f} text="low on the left" at={[1170, 830]} appear={AT(k, 10, "low pressure on its left")} targets={[]} />
      </Svg>
    </Scene>
  );
};
const S42: React.FC = () => {
  const f = useCurrentFrame(), k = K("s42_geo_equation");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const BAL_P: Part[] = [{ t: String.raw`f\,\mathbf k\times\mathbf u`, c: ROT, u: { w: String.raw`\text{Coriolis}`, c: ROT } }, { t: "=" },
    { t: String.raw`-\frac{1}{\rho}\nabla p`, c: C.second, u: { w: String.raw`\text{pressure push}`, c: C.second } }];
  if (plainOf(BAL_P).replace(/\s/g, "") !== EQ_BAL.replace(/\s/g, "")) throw new Error("s42 parts ≠ EQ_BAL");
  const B3_P: Part[] = [{ t: "-", x: C.neg }, { t: String.raw`f\,\mathbf u` }, { t: "=" }, { t: "-", x: C.neg }, { t: String.raw`\frac{1}{\rho}\,\mathbf k\times\nabla p` }];
  if (plainOf(B3_P).replace(/\s/g, "") !== EQ_BAL3.replace(/\s/g, "")) throw new Error("s42 parts ≠ EQ_BAL3");
  const bal2 = DF(rep(rep(EQ_BAL2, String.raw`\mathbf k\times(f`, String.raw`\textcolor{${C.gold}}{\mathbf k\times}(f`), String.raw`\,\mathbf k\times\nabla p`, String.raw`\,\textcolor{${C.gold}}{\mathbf k\times}\nabla p`));
  const [B2L, B2R] = splitEq(bal2), [KL, KR] = splitEq(EQ_KKU), [GL, GR] = splitEq(EQ_GEO);
  const turn1 = fin(f, t2 + 10, 20), turn2 = fin(f, t2 + 40, 20);
  const mx = 300, my = 330, L = 110;
  const uO = fin(f, 30), strike = fin(f, AT(k, 4, "Dividing") + 10, 10);
  const df = (P: Part[]) => P.map((q) => ({ ...q, t: DF(q.t) }));
  return (
    <Scene>
      <Svg>
        <g opacity={0.5}><StripMap g={{ x0: 120, y0: 610, km: 0.3 }} labels={false} ticks={false} bar={false} HL={0} /></g>
        <g opacity={fin(f, t2)}>
          <Arrow p={[mx, my]} q={[mx + L, my]} color={C.first} w={8} head={28} />
          <Arrow p={[mx, my]} q={[mx, my - L]} color={ROT} w={8} head={28} o={turn1} />
          <Arrow p={[mx, my]} q={[mx - L, my]} color={C.first} w={8} head={28} dash="12 8" o={turn2} />
          <Arc P={(x, y) => [mx + x, my - y]} a0={0} a1={90} r={60} c={C.gold} w={5} draw={turn1} />
          <Arc P={(x, y) => [mx + x, my - y]} a0={90} a1={180} r={60} c={C.gold} w={5} draw={turn2} />
          <Lbl x={mx + L + 20} y={my} t="u" c={C.first} s={T.key} />
          <Lbl x={mx - L - 20} y={my} t="−u" c={C.first} s={T.key} a="end" o={turn2} />
        </g>
        <Keyword f={f} text="geostrophic wind" at={[1080, 690]} a="middle" appear={AT(k, 4, "the geostrophic wind")} targets={[]} />
      </Svg>
      <CalcStack f={f} x={1080} y={60} size={60} maxLines={3} rows={[
        { lhs: { parts: df(BAL_P.slice(0, 1)), layers: [{ t: "all", o: 1 }, { u: [0], o: uO }] },
          rhs: { parts: df(BAL_P.slice(1)), layers: [{ t: "all", o: 1 }, { u: [1], o: uO }] }, at: 6, h: 250 },
        { lhs: B2L, rhs: B2R, at: AT(k, 1, "apply k cross"), h: 210 },
        { lhs: KL, rhs: KR, at: t3, c: C.key, h: 120 },
        { lhs: { parts: df(B3_P.slice(0, 2)), layers: [{ t: "all", o: 1 }, { x: [0], o: strike }] },
          rhs: { parts: df(B3_P.slice(2)), layers: [{ t: "all", o: 1 }, { x: [1], o: strike }] }, at: t4, h: 210 },
        { lhs: GL, rhs: DF(GR), at: AT(k, 5, "The wind u equals"), c: C.key, size: 76, h: 240, ul: AT(k, 5, "one over f rho") + 10, ulOff: 20 },
      ]} />
    </Scene>
  );
};
const GEO_PARTS0: Part[] = [{ t: String.raw`\mathbf u` }, { t: "=" }, { t: String.raw`\frac{1}{f\rho}`, u: { w: String.raw`\text{speed}`, c: C.key } },
  { t: String.raw`\,\mathbf k\times`, c: ROT, u: { w: String.raw`\text{turn left}`, c: ROT } }, { t: String.raw`\nabla p`, c: C.second, u: { w: String.raw`\text{across}`, c: C.second } }];
if (plainOf(GEO_PARTS0).replace(/\s/g, "") !== EQ_GEO.replace(/\s/g, "")) throw new Error("s43 parts ≠ EQ_GEO");
const GEO_PARTS: Part[] = GEO_PARTS0.map((p) => ({ ...p, t: DF(p.t) }));
const S43: React.FC = () => {
  const f = useCurrentFrame(), k = K("s43_geo_pieces");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const g: SMap = { x0: 120, y0: 440, km: 0.6 };
  const g2: SMap = { x0: 1260, y0: 450, km: 0.48 };
  const pin: Pt = [smX(g, 600), smY(g, 300)];
  const rot = 90 * easeIO(clamp((f - t2 - 10) / 30, 0, 1));
  const L = 120, a = (-90 + rot) * D2R;
  const tipA: Pt = [pin[0] + L * Math.cos(a), pin[1] - L * Math.sin(a)];
  const pin2: Pt = [smX(g2, 600), smY(g2, 300)];
  return (
    <Scene>
      <Svg>
        <StripMap g={g} labels={false} ticks={false} bar={false} />
        <Arrow p={pin} q={tipA} color={rot > 80 ? C.first : C.second} o={fin(f, t1)} />
        <Arc P={(x, y) => [pin[0] + x, pin[1] - y]} a0={-90} a1={-90 + rot} r={70} c={C.gold} w={5} o={fin(f, t2)} />
        <Lbl x={smX(g, 1200) + 24} y={g.y0 + 40} t="low on the left" c={C.key} s={T.floor} a="start" o={fin(f, AT(k, 3, "low pressure is on its left"))} />
        <Lbl x={smX(g, 1200) + 24} y={g.y0 + 600 * g.km - 40} t="high on the right" c={C.key} s={T.floor} a="start" o={fin(f, AT(k, 3, "High pressure"))} />
        <g opacity={fin(f, t5)}>
          <StripMap g={g2} labels={false} ticks={false} bar={false} steep HL={0} />
          <Arrow p={pin2} q={[pin2[0] + 2 * L, pin2[1]]} color={C.first} />
          <Lbl x={g2.x0 + 300 * g2.km * 2} y={g2.y0 + 600 * g2.km + 40} t="twice as close" c={C.key} s={T.key} a="middle" />
        </g>
        <Keyword f={f} text="closer → stronger" at={[1200, 845]} appear={AT(k, 5, "the stronger the wind")} out={t6 - 6} targets={[]} />
        <GlobeIcon x={1790} y={340} r={50} o={fin(f, t6)} />
      </Svg>
      <Layered parts={GEO_PARTS} layers={[{ t: "all", o: 1 }, { u: [4], o: fin(f, t1) }, { u: [3], o: fin(f, t2) }, { u: [2], o: fin(f, t4) }]} x={900} y={40} size={84} ax={0.5} ay={0} o={fin(f, 6)} />
      <TeX s={String.raw`f \to 0`} x={1520} y={330} size={T.calc} c={C.neg} o={fin(f, AT(k, 6, "f goes to zero"))} />
      <Svg><Lbl x={1080} y={845} t="breaks down near the equator" c={C.key} s={T.key} o={fin(f, AT(k, 6, "breaks down"))} /></Svg>
    </Scene>
  );
};
const S44: React.FC = () => {
  const f = useCurrentFrame(), k = K("s44_geo_numbers");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10);
  const pin: Pt = [smX(SM, 760), smY(SM, 300)];
  const bx = smX(SM, 300), y1 = smY(SM, 200), y2 = smY(SM, 600);
  const [GPL, GPR] = splitEq(EQ_GPN), GPP = eqPieces(GPR);
  const [FRL, FRR] = splitEq(EQ_FRHO), FRP = eqPieces(FRR);
  const [UNL, UNR] = splitEq(EQ_UN), UNP = eqPieces(UNR);
  const [PAL, PAR] = splitEq(EQ_PA);
  const UNITS = String.raw`\frac{\mathrm{kg\,m^{-1}\,s^{-2}}\,/\,\mathrm m}{\mathrm{s^{-1}}\cdot\mathrm{kg\,m^{-3}}} = \mathrm{m/s}`;
  const UNITSX = String.raw`\frac{\cancel{\mathrm{kg}}\,\mathrm{m^{-1}}\,\mathrm{s^{-2}}\,/\,\mathrm m}{\mathrm{s^{-1}}\cdot\cancel{\mathrm{kg}}\,\mathrm{m^{-3}}} = \mathrm{m/s}`;
  return (
    <Scene>
      <Svg>
        <StripMap bar={false} />
        <g opacity={fin(f, t1)}>
          <line x1={bx} y1={y1} x2={bx} y2={y2} stroke={C.gold} strokeWidth={6} />
          <line x1={bx - 16} y1={y1} x2={bx + 16} y2={y1} stroke={C.gold} strokeWidth={6} /><line x1={bx - 16} y1={y2} x2={bx + 16} y2={y2} stroke={C.gold} strokeWidth={6} />
        </g>
        <Lbl x={bx + 30} y={(y1 + y2) / 2 - 36} t="4 hPa" c={C.gold} s={T.key} o={fin(f, AT(k, 1, "four hectopascals"))} />
        <Lbl x={bx + 30} y={(y1 + y2) / 2 + 36} t="400 km" c={C.gold} s={T.key} o={fin(f, AT(k, 1, "four hundred kilometres"))} />
        <Lbl x={SM.x0 + 880} y={SM.y0 + 40} t="45°N" c={C.key} s={T.key} a="end" o={fin(f, t2)} />
        <CurvedLink f={f} from={[bx + 30 + textW("400 km", T.key) + 16, (y1 + y2) / 2 + 36]} to={[1356, 266]} start={AT(k, 4, "four hundred thousand metres")} end={t5} ctl={[1000, 600]} />
        <g opacity={fin(f, t10)}>
          <Arrow p={pin} q={[pin[0] + 8.08 * 14, pin[1]]} color={C.first} />
          <circle cx={pin[0]} cy={pin[1]} r={10} fill={C.key} />
          <Lbl x={pin[0] + 130} y={pin[1] + 40} t="8.1 m/s" c={C.first} s={T.key} />
          <Lbl x={SM.x0 + 480} y={SM.y0 - 40} t="low on the left" c={C.key} s={T.key} />
          <GlobeIcon x={900} y={790} r={60} o={0.8} />
          <Lbl x={980} y={790} t="westerlies" c={C.local} s={T.key} />
        </g>
      </Svg>
      <CalcStack f={f} x={1300} y={60} size={56} maxLines={3} rows={[
        { lhs: String.raw`4\ \mathrm{hPa}`, rhs: String.raw`= 400\ \mathrm{Pa}`, at: t3, h: 100 },
        { lhs: GPL, rhs: GPP[0], at: t4, h: 140 },
        { rhs: GPP[1], at: AT(k, 4, "ten to the minus three"), cont: true, c: C.key, h: 80 },
        { lhs: FRL, rhs: FRP[0], at: t5 + 10, h: 80 },
        { rhs: FRP[1], at: t6, cont: true, c: C.key, h: 80 },
        { lhs: UNL, rhs: UNP[0], at: t7, h: 140 },
        { rhs: rep(UNP[1], "8.1", String.raw`\mathbf{8.1}`), at: AT(k, 7, "eight point one"), cont: true, c: C.key, ul: AT(k, 7, "eight point one") + 10, h: 90 },
        { lhs: PAL, rhs: PAR, at: AT(k, 9, "A pascal is"), h: 90 },
        { lhs: "", rhs: { raw: [{ s: UNITS, o: 1 - fin(f, AT(k, 9, "what's left"), 10) }, { s: ctex(C.neg, UNITSX), o: fin(f, AT(k, 9, "what's left"), 10) }] }, at: AT(k, 9, "per second squared"), h: 150 },
      ]} />
    </Scene>
  );
};

// ================================================================ s45–s46 Storm Ciarán
const SBOX = storm.box as { lat: number[]; lon: number[] };
const MAPR = { x0: 80, y0: 60, x1: 1200, y1: 850 };
const STPROJ = geoConicConformal().parallels([42, 62]).rotate([20, 0]).fitExtent([[MAPR.x0, MAPR.y0], [MAPR.x1, MAPR.y1]],
  { type: "MultiPoint", coordinates: [[SBOX.lon[0], SBOX.lat[0]], [SBOX.lon[1], SBOX.lat[0]], [SBOX.lon[1], SBOX.lat[1]], [SBOX.lon[0], SBOX.lat[1]],
    [(SBOX.lon[0] + SBOX.lon[1]) / 2, SBOX.lat[1]], [(SBOX.lon[0] + SBOX.lon[1]) / 2, SBOX.lat[0]]] } as never);
const sp = (lat: number, lon: number): Pt => STPROJ([lon, lat]) as Pt;
const STORM_ARROWS = (storm.arrows as { lat: number; lon: number; geo: number[]; act: number[]; w10: number[]; r_km: number; coast_deg: number }[])
  .filter((a) => a.coast_deg >= 0.5 && a.r_km >= 400)
  .filter((a) => Math.abs(((a.lat - 35) / 3) - Math.round((a.lat - 35) / 3)) < 1e-6 && Math.abs(((a.lon + 50) / 3) - Math.round((a.lon + 50) / 3)) < 1e-6);
const CROWD = (() => {
  const s = STORM_ARROWS.filter((a) => a.r_km <= 900).sort((a, b) => Math.hypot(b.geo[0], b.geo[1]) - Math.hypot(a.geo[0], a.geo[1]));
  const out: typeof s = [];
  for (const a of s) {
    if (out.every((b) => Math.hypot((a.lat - b.lat) * 111.2, (a.lon - b.lon) * 111.2 * Math.cos(a.lat * D2R)) > 600)) out.push(a);
    if (out.length === 2) break;
  }
  return out;
})();
/** a unit-east/north wind vector drawn on the conformal map: local screen direction from a small step */
const mapVec = (lat: number, lon: number, u: number, v: number, s: number): Pt => {
  const p = sp(lat, lon), pe = sp(lat, lon + 0.2), pn = sp(lat + 0.2, lon);
  const ex = [pe[0] - p[0], pe[1] - p[1]], nx = [pn[0] - p[0], pn[1] - p[1]];
  const le = Math.hypot(ex[0], ex[1]), ln = Math.hypot(nx[0], nx[1]);
  return [p[0] + s * (u * ex[0] / le + v * nx[0] / ln), p[1] + s * (u * ex[1] / le + v * nx[1] / ln)];
};
const StormMap: React.FC<{ f: number; isoD: number; geoO: number; actO: number; w10O: number; arcO: number; crowdO: number; o?: number; lowO?: number }> = ({
  f, isoD, geoO, actO, w10O, arcO, crowdO, o = 1, lowO = 1 }) => {
  if (o <= 0) return null;
  const low = storm.low as number[];
  const isos = (storm.isobars as { hPa: number; pts: number[][] }[]).slice().sort((a, b) => a.hPa - b.hPa);
  const levels = Array.from(new Set(isos.map((i) => i.hPa))).sort((a, b) => a - b);
  const lp = sp(low[0], low[1]);
  const S = 2.2;
  const maxSp = Math.max(...STORM_ARROWS.map((a) => Math.hypot(a.geo[0], a.geo[1])));
  const arc = Array.from({ length: 40 }, (_, i) => { const a = (i / 39) * 1.6 * Math.PI + 0.3; return `${lp[0] + 210 * Math.cos(a)},${lp[1] - 210 * Math.sin(a)}`; });
  const ae = 0.3 + 1.6 * Math.PI, ax = lp[0] + 210 * Math.cos(ae), ay = lp[1] - 210 * Math.sin(ae), tx = -Math.sin(ae), ty = -Math.cos(ae);
  return (
    <g opacity={o}>
      <defs><clipPath id="stclip"><rect x={MAPR.x0} y={MAPR.y0} width={MAPR.x1 - MAPR.x0} height={MAPR.y1 - MAPR.y0} /></clipPath></defs>
      <rect x={MAPR.x0} y={MAPR.y0} width={MAPR.x1 - MAPR.x0} height={MAPR.y1 - MAPR.y0} fill="#1b2a44" />
      <g clipPath="url(#stclip)">
        {(storm.coast as number[][][]).map((ln, i) => <path key={i} d={ln.map((q, j) => `${j ? "L" : "M"}${sp(q[1], q[0]).map((v) => v.toFixed(1)).join(" ")}`).join("")} fill="none" stroke={C.muted} strokeWidth={2} strokeOpacity={0.8} />)}
        {isos.map((iso, i) => {
          const li = levels.indexOf(iso.hPa);
          const d = clamp(isoD - li, 0, 1);
          if (d <= 0) return null;
          return <path key={i} d={iso.pts.map((q, j) => `${j ? "L" : "M"}${sp(q[0], q[1]).map((v) => v.toFixed(1)).join(" ")}`).join("")} fill="none" stroke={C.key} strokeOpacity={0.7 * d} strokeWidth={3} />;
        })}
        {STORM_ARROWS.map((a, i) => {
          const p = sp(a.lat, a.lon);
          const pul = crowdO > 0 && Math.hypot(a.geo[0], a.geo[1]) > 0.8 * maxSp ? 1 + 0.35 * pulse(f % 60 + 0, 0, 60) : 1;
          return <g key={i}>
            {geoO > 0 ? <Arrow p={p} q={mapVec(a.lat, a.lon, a.geo[0], a.geo[1], S * pul)} color={ROT} w={5} head={18} halo={false} o={geoO} dash="9 5" /> : null}
            {actO > 0 ? <Arrow p={[p[0] + 4, p[1] + 4]} q={(([x, y]) => [x + 4, y + 4] as Pt)(mapVec(a.lat, a.lon, a.act[0], a.act[1], S))} color={C.first} w={5} head={18} halo={false} o={actO} /> : null}
            {w10O > 0 ? <Arrow p={[p[0] + 4, p[1] + 4]} q={(([x, y]) => [x + 4, y + 4] as Pt)(mapVec(a.lat, a.lon, a.w10[0], a.w10[1], S))} color={C.first} w={5} head={18} halo={false} o={w10O} /> : null}
          </g>;
        })}
        <polyline points={arc.join(" ")} fill="none" stroke={C.gold} strokeWidth={6} opacity={arcO} />
        <polyline points={`${ax - tx * 24 + ty * 12},${ay - ty * 24 - tx * 12} ${ax},${ay} ${ax - tx * 24 - ty * 12},${ay - ty * 24 + tx * 12}`} fill="none" stroke={C.gold} strokeWidth={6} opacity={arcO} />
        {CROWD.map((c, i) => { const q = sp(c.lat, c.lon); return <circle key={i} cx={q[0]} cy={q[1]} r={48} fill="none" stroke={C.gold} strokeWidth={5} opacity={crowdO} />; })}
      </g>
      <Lbl x={lp[0]} y={lp[1]} t="L" c={C.key} s={T.calc} a="middle" o={lowO} />
      <rect x={MAPR.x0} y={MAPR.y0} width={MAPR.x1 - MAPR.x0} height={MAPR.y1 - MAPR.y0} fill="none" stroke={C.grid} strokeWidth={3} />
    </g>
  );
};
const S45: React.FC = () => {
  const f = useCurrentFrame(), k = K("s45_storm_map");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11);
  const cam = globePath([{ f: 0, lat: 5, lon: -40, dist: 4.3, pp: [640, 455] }, { f: t1 + 20, lat: 52, lon: -20, dist: 1.75, pp: [640, 455] }], f);
  const toMap = fin(f, t1 + 10, 24);
  const isoD = clamp((f - t4) / 4, 0, 40);
  return (
    <Scene>
      <div style={{ opacity: 1 - toMap }}><GlobeView cam={cam} /><Vignette id="v45" /></div>
      <Svg>
        <StormMap f={f} o={toMap} isoD={isoD} geoO={fin(f, t7, 16)} actO={0} w10O={0} arcO={fin(f, t9)} crowdO={fin(f, t11)} lowO={fin(f, t1 + 30)} />
        <Lbl x={1250} y={110} t="Storm Ciarán" c={C.key} s={T.calc} o={fin(f, AT(k, 1, "Storm Ciarán"))} />
        <Lbl x={1250} y={185} t="November 2023" c={C.key} s={T.key} o={fin(f, AT(k, 2, "early November")) * fout(f, AT(k, 3, "second of November"), 8)} />
        <Lbl x={1250} y={185} t="2 November 2023" c={C.key} s={T.key} o={fin(f, AT(k, 3, "second of November"), 8)} />
        <Lbl x={1250} y={265} t="isobars every 4 hPa" c={C.key} s={T.floor} o={fin(f, AT(k, 4, "every four hectopascals"))} />
        {/* side-view glyph: ground, the ≈ 1.5 km level */}
        <g opacity={fin(f, t5)}>
          <line x1={1260} y1={600} x2={1820} y2={600} stroke={C.muted} strokeWidth={5} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <line key={i} x1={1270 + i * 80} y1={600} x2={1250 + i * 80} y2={620} stroke={C.muted} strokeWidth={3} />)}
          <line x1={1260} y1={420} x2={1820} y2={420} stroke={C.key} strokeWidth={3} strokeDasharray="12 9" opacity={fin(f, t6)} />
          <Lbl x={1270} y={375} t="≈ 1.5 km" c={C.key} s={T.key} o={fin(f, AT(k, 6, "one and a half kilometres"))} />
          <Lbl x={1270} y={465} t="almost no friction" c={C.key} s={T.floor} o={fin(f, AT(k, 6, "almost no friction"))} />
          <Lbl x={1270} y={560} t="friction near the ground" c={C.local} s={T.floor} o={fin(f, t5)} />
        </g>
        <Lbl x={1250} y={790} t="low on the left" c={C.key} s={T.key} o={fin(f, t10)} />
      </Svg>
      <TeX s={DF(EQ_GEO)} x={1250} y={690} size={T.key} c={ROT} o={fin(f, AT(k, 8, "with our formula"))} />
    </Scene>
  );
};
const S46: React.FC = () => {
  const f = useCurrentFrame(), k = K("s46_real_winds");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const sw10 = fin(f, t3, 12) * fout(f, t5, 12);
  const act = fin(f, 6, 16) * (1 - sw10);
  const cmp = storm.compare as Record<string, { lat: number; lon: number; geo: number[]; act: number[]; w10: number[]; msl_geo: number[]; angle_10m: number }>;
  const zooms = [{ nm: "W flank", x: 1240, y: 100 }, { nm: "S flank", x: 1550, y: 100 }];
  const Z = 280, ZS = 5.0;
  return (
    <Scene>
      <Svg>
        <StormMap f={f} isoD={40} geoO={1} actO={act} w10O={sw10} arcO={0} crowdO={0} />
        {zooms.map((z) => {
          const c = cmp[z.nm];
          const p = sp(c.lat, c.lon);
          const cx = z.x + Z / 2, cy = z.y + Z / 2;
          const vec = (u: number[]): Pt => [cx + u[0] * ZS, cy - u[1] * ZS];
          const iso = c.msl_geo, L = Math.hypot(iso[0], iso[1]);
          const isoPt: Pt = [cx + (iso[0] / L) * 130, cy - (iso[1] / L) * 130], isoPt0: Pt = [cx - (iso[0] / L) * 130, cy + (iso[1] / L) * 130];
          const a1 = Math.atan2(iso[1], iso[0]), a2 = Math.atan2(c.w10[1], c.w10[0]);
          const arcR = 118, am = (a1 + a2) / 2;
          const arc = Array.from({ length: 16 }, (_, i) => { const a = a1 + ((a2 - a1) * i) / 15; return `${cx + arcR * Math.cos(a)},${cy - arcR * Math.sin(a)}`; }).join(" ");
          const num = z.nm === "W flank" ? "1" : "2";
          return <g key={z.nm} opacity={fin(f, t2)}>
            <circle cx={cx} cy={cy} r={Z / 2} fill="#1b2a44" />
            <circle cx={p[0]} cy={p[1]} r={16} fill="none" stroke={C.gold} strokeWidth={4} />
            <Lbl x={p[0] + 22} y={p[1] - 24} t={num} c={C.gold} s={T.floor} />
            <Lbl x={cx - Z / 2 + 6} y={cy - Z / 2 + 20} t={num} c={C.gold} s={T.key} />
            <line x1={isoPt0[0]} y1={isoPt0[1]} x2={isoPt[0]} y2={isoPt[1]} stroke={C.key} strokeWidth={3} strokeDasharray="10 8" opacity={0.8} />
            <Arrow p={[cx, cy]} q={vec(c.geo)} color={ROT} w={7} head={26} halo={false} dash="12 7" />
            <Arrow p={[cx, cy]} q={vec(c.act)} color={C.first} w={7} head={26} halo={false} o={1 - sw10} />
            <g opacity={sw10 * fin(f, AT(k, 4, "turns it across"))}>
              <path d={`M ${cx} ${cy} L ${arc.split(" ").join(" L ")} Z`} fill={C.gold} fillOpacity={0.35} stroke="none" />
              <polyline points={arc} fill="none" stroke={C.gold} strokeWidth={7} />
              <Lbl x={Math.min(1815, cx + (Z / 2 + 30) * Math.cos(am))} y={cy - (Z / 2 + 30) * Math.sin(am)} t={`${Math.round(c.angle_10m)}°`} c={C.gold} s={T.key} a="middle" />
            </g>
            <Arrow p={[cx, cy]} q={vec(c.w10)} color={C.first} w={4} head={22} halo={false} o={sw10} />
            <Lbl x={(cx + vec(c.w10)[0]) / 2 - 40 * Math.sin(Math.atan2(c.w10[1], c.w10[0]))} y={(cy + vec(c.w10)[1]) / 2 - 40 * Math.cos(Math.atan2(c.w10[1], c.w10[0]))} t="10 m" c={C.first} s={T.floor} a="middle" o={sw10} />
          </g>;
        })}
        <g opacity={fin(f, AT(k, 1, "second colour"))}>
          <Arrow p={[1250, 480]} q={[1320, 480]} color={C.first} w={6} head={20} halo={false} />
          <Lbl x={1335} y={480} t="real wind (1.5 km)" c={C.first} s={T.key} />
          <Arrow p={[1250, 545]} q={[1320, 545]} color={ROT} w={6} head={20} halo={false} dash="12 7" />
          <Lbl x={1335} y={545} t="geostrophic" c={ROT} s={T.key} />
        </g>
        <Lbl x={1250} y={625} t="at points 1 and 2:" c={C.local} s={T.floor} o={fin(f, AT(k, 2, "few per cent")) * fout(f, t3)} />
        <Lbl x={1250} y={690} t="speed: within a few %" c={C.key} s={T.key} o={fin(f, AT(k, 2, "few per cent")) * fout(f, t3)} />
        <Lbl x={1250} y={760} t="direction: a few degrees" c={C.key} s={T.key} o={fin(f, AT(k, 2, "few degrees")) * fout(f, t3)} />
        <Lbl x={1250} y={640} t="near the ground (10 m):" c={C.local} s={T.floor} o={fin(f, t3 + 6) * fout(f, t5)} />
        <Lbl x={1250} y={705} t="13°–21° towards the low" c={C.gold} s={T.key} o={fin(f, AT(k, 4, "thirteen to twenty one")) * fout(f, t5)} />
        <Keyword f={f} text="friction" at={[1250, 775]} appear={AT(k, 4, "Friction slows")} out={t5} targets={[]} />
        <Lbl x={1250} y={660} t="direction ✓" c={C.key} s={T.key} o={fin(f, AT(k, 5, "the direction"))} />
        <Lbl x={1250} y={740} t="speed: a few %" c={C.key} s={T.key} o={fin(f, AT(k, 6, "within a few per cent"))} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s47 recap, s48 end card
const S47: React.FC = () => {
  const f = useCurrentFrame(), k = K("s47_recap");
  const t = Array.from({ length: 14 }, (_, j) => SS(k, j));
  const beat = (j: number, jEnd?: number) => fin(f, t[j] + (j === 0 ? 4 : 0), 10) * (jEnd !== undefined ? fout(f, t[jEnd] - 6, 10) : 1);
  const st = orbitCam({ az: 221, el: 28, dist: 15, target: [2.2, 1.3, 1.2], pp: [560, 430] }, PP);
  const prS = projector(st, W3, H3);
  const hp = handPlace(A3, [0, 0, 1], 1.4);
  const PQ = (x: number, i: number, lab: string) => (
    <g key={i}>
      <Arrow p={[x - 110, 430]} q={[x + 80, 430]} color={C.first} w={8} head={28} />
      <Arrow p={[x - 110, 430]} q={[x - 110 + [120, 0, -120][i], 430 - [0, 120, 0][i]]} color={C.second} w={i === 0 ? 14 : 8} head={28} />
      <Lbl x={x - 15} y={560} t={lab} c={C.key} s={T.key} a="middle" />
    </g>
  );
  const recapSB = beat(0, 3) + beat(4, 5);
  return (
    <Scene>
      {recapSB > 0 ? <div style={{ opacity: Math.min(1, recapSB) }}>
        <PairFloor st={st} axb={1}
          children={<Hand3D q={hp.q} at={hp.at} s={1.4} angles={POSE.curl(1)} o={beat(4, 5)} glow={{ thumb: ROT }} />}
          over={<>
            <Tick3 pr={prS} at={[0, 0, 0]} u1={AH} u2={[0, 0, 1]} s={0.55} o={beat(0, 1)} />
            <Tick3 pr={prS} at={[0, 0, 0]} u1={BH} u2={[0, 0, 1]} s={0.55} o={beat(0, 1)} />
            <TipL3 pr={prS} from={[0, 0, 0]} to={AXB3} t="a × b" c={ROT} s={T.key} />
          </>} />
      </div> : null}
      <Svg>
        <g opacity={beat(3, 4)}>
          <polygon points={CORN.map((p) => `${p[0] - 60},${p[1] + 20}`).join(" ")} fill={ROT} fillOpacity={0.25} stroke={ROT} strokeWidth={4} />
          <Arrow p={[O2[0] - 60, O2[1] + 20]} q={[ATIP[0] - 60, ATIP[1] + 20]} color={C.first} />
          <Arrow p={[O2[0] - 60, O2[1] + 20]} q={[BTIP[0] - 60, BTIP[1] + 20]} color={C.second} />
          <Lbl x={500} y={420} t="area" c={ROT} s={T.calc} a="middle" />
        </g>
        <g opacity={beat(5, 7)}>{[260, 640, 1020].map((x, i) => PQ(x, i, ["0", "longest", "0"][i]))}</g>
        <g opacity={beat(7, 8)}>
          <line x1={250} y1={520} x2={650} y2={380} stroke="#c9d2e3" strokeWidth={22} strokeLinecap="round" />
          <circle cx={250} cy={520} r={44} fill="none" stroke="#c9d2e3" strokeWidth={14} />
          <Arrow p={[650, 380]} q={[720, 560]} color={C.second} />
          <Arrow p={[250, 520]} q={[250, 300]} color={ROT} w={12} />
        </g>
        <g opacity={beat(8, 9)}>
          <Grid P={mkP(220, 640, 70)} xr={[-1, 6]} yr={[-1, 5]} o={0.6} />
          <Arrow p={[360, 500]} q={[620, 500]} color={C.first} />
          <Arrow p={[360, 500]} q={[360, 240]} color={ROT} />
          <Arc P={(x, y) => [360 + x, 500 - y]} a0={0} a1={90} r={110} c={C.gold} w={5} />
          <Lbl x={460} y={330} t="quarter turn left" c={C.gold} s={T.key} />
        </g>
        <g opacity={beat(12)}>
          <g opacity={0.7}><GlobeIcon x={300} y={420} r={110} /></g>
          <g opacity={0.7}>
            <rect x={480} y={320} width={260} height={200} fill="#1d2740" />
            {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${490} ${345 + 45 * i} Q ${610} ${320 + 45 * i} ${730} ${345 + 45 * i}`} fill="none" stroke={C.key} strokeOpacity={0.6} strokeWidth={3} />)}
            <Lbl x={560} y={350} t="L" c={C.key} s={T.calc} a="middle" /><Lbl x={670} y={490} t="H" c={C.key} s={T.calc} a="middle" />
          </g>
          <Lbl x={510} y={640} t="later videos" c={C.key} s={T.key} a="middle" />
          <Lbl x={1100} y={300} t="where the Coriolis effect comes from" c={C.key} s={T.floor} />
          <Lbl x={1100} y={380} t="reading weather maps" c={C.key} s={T.floor} o={fin(f, AT(k, 12, "how to read weather maps"))} />
          <Lbl x={1100} y={500} t="grad · div · curl" c={C.key} s={T.key} o={fin(f, t[13])} />
          <Lbl x={1100} y={590} t="∇   ∇·   ∇×" c={C.key} s={T.calc} o={fin(f, t[13] + 10)} />
        </g>
        {/* the recipe beat: a mini floor pair on the left (the 3-D floor fades out), the table on the right */}
        <g opacity={beat(5, 7)}>
          <Lbl x={1150} y={640} t="sin 0° = sin 180° = 0" c={C.key} s={T.key} />
          <Lbl x={1150} y={720} t="sin 90° = 1" c={C.key} s={T.key} o={fin(f, t[6])} />
        </g>
      </Svg>
      {/* beat 2–3: the recipe */}
      <CompTable f={f} o={beat(1, 3)} grey={-1} greyO={0} links={[[1, 2, t[1] + 10], [2, 1, t[1] + 30], [2, 0, t[1] + 50], [0, 2, t[1] + 70], [0, 1, t[1] + 90], [1, 0, t[1] + 110]]} dy={-20} />
      <Svg><Lbl x={1290} y={700} t="−" c={C.neg} s={T.eq} a="middle" o={beat(2, 3)} /><Lbl x={1340} y={700} t="a minus sign between" c={C.key} s={T.floor} o={beat(2, 3)} /></Svg>
      <TeX s={EQ_COMP} x={1830} y={790} size={46} ax={1} o={beat(1, 3)} glow={pulse(f, t[2], 30)} />
      <TeX s={EQ_SIN} x={1150} y={300} size={T.calc} o={beat(5, 7)} />
      <TeX s={String.raw`\mathbf a\times\mathbf b\ \text{at right angles to}\ \mathbf a\ \text{and}\ \mathbf b`} x={1100} y={300} size={T.key} o={beat(0, 1)} />
      <TeX s={EQ_SIN} x={1080} y={380} size={T.calc} o={beat(3, 4)} />
      <TeX s={String.raw`= \text{area}`} x={1240} y={490} size={T.calc} c={ROT} o={beat(3, 4)} />
      <TeX s={EQ_ANTI} x={1150} y={420} size={T.calc} o={beat(4, 5)} />
      <TeX s={EQ_TAU} x={1100} y={420} size={T.eq} o={beat(7, 8)} />
      <TeX s={String.raw`\mathbf k\times\mathbf u`} x={1100} y={420} size={T.eq} c={ROT} o={beat(8, 9)} />
      {/* beat 10–11: Ian | Idai */}
      <div style={{ position: "absolute", left: 120, top: 220, width: 420, height: 320, overflow: "hidden", opacity: beat(9, 11) }}>
        <Img src={staticFile("cp/ian_tc.jpg")} style={{ width: 900, position: "absolute", left: -330, top: -230 }} />
      </div>
      <div style={{ position: "absolute", left: 580, top: 220, width: 420, height: 320, overflow: "hidden", opacity: beat(9, 11) }}>
        <Img src={staticFile("cp/idai_14.jpg")} style={{ width: 1000, position: "absolute", left: -210, top: -310 }} />
      </div>
      <Svg>
        <Lbl x={330} y={590} t="north: right" c={C.key} s={T.key} a="middle" o={beat(9, 11)} />
        <Lbl x={790} y={590} t="south: left" c={C.key} s={T.key} a="middle" o={beat(9, 11)} />
        <Lbl x={1100} y={560} t="storms spin" c={C.key} s={T.key} o={beat(10, 11)} />
      </Svg>
      <TeX s={EQ_FKU} x={1100} y={420} size={T.eq} c={ROT} o={beat(9, 11)} />
      {/* beat 12: the storm map with violet arrows */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: beat(11, 12), transform: "translate(60px, 120px) scale(0.62)", transformOrigin: "0 0" }}>
        <Svg><StormMap f={f} isoD={40} geoO={1} actO={0} w10O={0} arcO={0} crowdO={0} /></Svg>
      </div>
      <TeX s={EQ_GEO} x={1080} y={420} size={T.eq} c={C.key} o={beat(11, 12)} />
    </Scene>
  );
};
const S48: React.FC = () => {
  const f = useCurrentFrame(), k = K("s48_end");
  const t1 = SS(k, 1), t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const thumb = (x: number, i: number) => (
    <g key={i} opacity={0.75}>
      <rect x={x - 150} y={150} width={300} height={190} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
      {i === 0 ? <><Arrow p={[x - 90, 300]} q={[x + 60, 270]} color={C.first} w={8} head={26} halo={false} /><Arrow p={[x - 90, 300]} q={[x - 50, 180]} color={C.second} w={8} head={26} halo={false} /></> : null}
      {i === 1 ? <><polygon points={`${x - 90},${300} ${x + 40},${300} ${x + 90},${230} ${x - 40},${230}`} fill={ROT} fillOpacity={0.3} stroke={ROT} strokeWidth={3} /><Arrow p={[x - 90, 300]} q={[x - 90, 170]} color={ROT} w={8} head={26} halo={false} /></> : null}
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
          <Lbl x={630} y={660} t="cross-product notebook" c={C.ink} s={T.calc} />
        </g>
        <g opacity={fin(f, tOther)}>
          {[0, 1, 2].map((i) => <Notebook key={i} x={420 + i * 34} y={806 - i * 10} s={0.32} c={[C.second, ROT, C.muted][i]} o={0.9} />)}
          <Lbl x={560} y={800} t="notebooks for the other maths concepts" c={C.key} s={T.key} />
        </g>
      </Svg>
    </Scene>
  );
};

// @@SCENES-CONTINUE@@

const SCENES: React.FC[] = [S00, S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24,
  S25, S26, S27, S28, S29, S30, S31, S32, S33, S34, S35, S36, S37, S38, S39, S40, S41, S42, S43, S44, S45, S46, S47, S48];
if (SCENES.length !== sc.length) throw new Error(`${SCENES.length} scene components but ${sc.length} scenes in timing.json`);

export const CrossProductWhy: React.FC<{ audio?: string }> = ({ audio = "narration_music.wav" }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {SCENES.map((S, k) => (
      <Sequence key={sc[k].id} name={sc[k].id} from={CUT[k]} durationInFrames={LEN(k) + (k < SCENES.length - 1 ? XF : 0)}><S /></Sequence>
    ))}
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
