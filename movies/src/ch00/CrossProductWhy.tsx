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
import examples from "../../ch00/ch00_cross_product_why/data/examples.json";
import merry from "../../ch00/ch00_cross_product_why/data/merry.json";
import ciaranLines from "../../ch00/ch00_cross_product_why/data/ciaran_lines.json";
import in30 from "../../ch00/ch00_cross_product_why/data/inertial30.json";
import trG from "../../ch00/ch00_cross_product_why/data/trails_global.json";
import trI from "../../ch00/ch00_cross_product_why/data/trails_ian.json";
import trD from "../../ch00/ch00_cross_product_why/data/trails_idai.json";
import ne110 from "../../ch00/ch00_cross_product_why/data/real/ne_lines_110m.json";
import ne50 from "../../ch00/ch00_cross_product_why/data/real/ne_lines_50m.json";
import wx from "../../ch00/ch00_dot_product_why/data/weather.json";
import { CurvedLink } from "../house/kit/extras";
import { C, T } from "../house/kit/type";
import { Arc, Arrow, Band, Bracket, Dash, Grid, Lbl, Pt, RightTick, Strike, Svg, add, clamp, lerp, mkP, pulse, textW, unit } from "../house/kit/draw";
import { CalcRow, CalcStack, Layered, Part, TeX, col, eqPieces, plainOf, rep, splitEq, texHtml } from "../house/kit/tex";
import { Keyword, TipLabel, placeLabels } from "../house/kit/notes";
import { RiseText, TitleGradient } from "../house/kit/title";
import { Check, ClockGlyph, Notebook } from "../house/kit/icons";
import { CamState, D2R, OrbitKey, Projector, V3, add3, cross3, dot3, easeIO, len3, lerp3, mul3, norm3, orbitCam, orbitPath, projector, sub3 } from "./kit_cp/cam";
import { Arrow3D, Ball3D, Plane3D, Quad3D, Rod3D, View3D } from "./kit_cp/three3d";
import { HAND_PTS, Hand3D, POSE, fingerTipLocal, handPoint, handQuat, slerpQ } from "./kit_cp/hand";
import { BottleCap3D, Door3D, Screw3D, Spanner3D } from "./kit_cp/objects";
import { Arc3, CircleCross, CircleDot, DoorIcon, FloorGrid, GlobeIcon, L3, MinusGlyph, Observer, Poly3, Seg3, TailSketch, Tick3, TipL3, TipSketch, TurntableIcon, VIOLET } from "./kit_cp/svg3d";
import { Axis3D, HalfEarthMesh, GlobeCam, GlobeMesh, LatCircle, SurfArrow, Streaks, band, coastPath, decodeTrails, enAt, gcArrowPts, globeCam, globeMatrix, globePath, globeProj, Graticule, ll, llPath, useBin, useTex } from "./kit_cp/globe";

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
const IDS = ["s00_title", "s01_hook", "s02_dot_recall", "s03_door", "s04_left_right", "s05_axes", "s06_recipe", "s07_worked",
  "s08_sine", "s09_area", "s09a_box_proof", "s10_right_angles", "s11_rhr_curl", "s12_rhr_flat", "s13_rhr_screw", "s14_rhr_cycle",
  "s15_rhr_swap", "s16_rhr_screen", "s17_rhr_views", "s18_cases", "s18a_why_question", "s18b_across_part", "s18c_slide",
  "s20_torque", "s21_torque_axis", "s22_door_again", "s22a_plane_normal", "s22b_component_shadows", "s22c_angular_momentum",
  "s22d_moving_charge", "s22e_perp_push", "s19_grid", "s23_k_cross", "s23a_why_turn", "s24_spin", "s25a_position_vector",
  "s25_ground_speed", "s25b_direction", "s26_coriolis_effect", "s26a_merry_go_round", "s26b_two_views", "s26c_carried_arrow",
  "s26d_new_ground", "s27_coriolis_term", "s27a_minus_check", "s28a_local_axes", "s28b_components", "s28c_flat_part", "s28_f",
  "s29_turn_rule", "s30_coriolis_size", "s31_globe_paths", "s32_reanalysis", "s33_trades", "s34_westerlies", "s35_storms",
  "s36_ian", "s37_idai", "s38_spin_sign", "s39_isobars", "s40_pressure_push", "s40a_k_cross_gradp", "s41_adjust", "s41a_balance",
  "s42_geo_equation", "s43_geo_pieces", "s44_geo_numbers", "s45_storm_map", "s46_real_winds", "s47_recap", "s48_end"] as const;
if (sc.length !== IDS.length || sc.some((s, i) => s.id !== IDS[i])) throw new Error("timing.json scenes ≠ the v4 scene list");
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
// ---- v4 (storyboard 2026-10-27): verbatim LaTeX of the new and changed scenes
const EQ_AB7 = String.raw`\mathbf a = (5,\ 1,\ 0),\quad \mathbf b = (1,\ 3,\ 0)`;
const EQ_NA = String.raw`|\mathbf a| = \sqrt{5^2 + 1^2} = \sqrt{26} \approx 5.099`;
const EQ_NB = String.raw`|\mathbf b| = \sqrt{1^2 + 3^2} = \sqrt{10} \approx 3.162`;
const EQ_COSN = String.raw`\cos\theta = \frac{8}{5.099\times3.162} \approx 0.496`;
const EQ_THS4 = String.raw`\theta \approx 60.3^\circ,\quad \sin\theta \approx 0.868`;
const EQ_BOXID = String.raw`(a_1+b_1)(a_2+b_2) - a_1a_2 - b_1b_2 - 2a_2b_1 = a_1b_2 - a_2b_1`;
const EQ_BOX24 = String.raw`6\times4 = 24`;
const EQ_BOXA = String.raw`2\times\tfrac12\times5\times1 = 5`;
const EQ_BOXB = String.raw`2\times\tfrac12\times1\times3 = 3`;
const EQ_BOXS = String.raw`2\times1\times1 = 2`;
const EQ_BOX14 = String.raw`24 - 5 - 3 - 2 = 14`;
const EQ_ACR14 = String.raw`|\mathbf a\times\mathbf b| = |\mathbf a|\times\text{across} = 5.099\times2.75 \approx 14`;
const EQ_ACR = String.raw`\text{across} = |\mathbf b|\sin\theta = 3.162\times0.868 \approx 2.75`;
const EQ_SLIDE = String.raw`5\times4 - 1\times6 = 20 - 6 = 14`;
const EQ_T15 = String.raw`|\boldsymbol\tau| = 0.3\times50 = 15\ \mathrm{N\,m}`;
const EQ_ACRF = String.raw`\text{across} = 50\times\sin30^\circ = 25\ \mathrm N`;
const EQ_T75 = String.raw`|\boldsymbol\tau| = 0.3\times25 = 7.5\ \mathrm{N\,m}`;
const EQ_AREA14 = String.raw`|\mathbf a\times\mathbf b| = 14 = \text{area}`;
const EQ_L = String.raw`\mathbf L = \mathbf r\times\mathbf p = (0,\ 0,\ 0.5\times6 - 0\times0) = (0,\ 0,\ 3)`;
const EQ_P6 = String.raw`\mathbf p = 2\ \mathrm{kg}\times3\ \mathrm{m/s} = 6\ \mathrm{kg\,m/s}`;
const EQ_QVB = String.raw`\mathbf F = q\,\mathbf v\times\mathbf B`;
const EQ_K1 = String.raw`|\mathbf u| = \sqrt{10^2 + 1^2} = \sqrt{101} \approx 10.05\ \mathrm{m/s}`;
const EQ_K10 = String.raw`\sqrt{100 + 10\times0.1^2} = \sqrt{100.1} \approx 10.005\ \mathrm{m/s}`;
const EQ_K100 = String.raw`\sqrt{100.01} \approx 10.0005\ \mathrm{m/s}`;
const EQ_PUSHU0 = String.raw`\text{push}\cdot\mathbf u = 0`;
const EQ_KXU4 = String.raw`\mathbf k\times\mathbf u = (0\times0 - 1\times0,\ 1\times5 - 0\times0,\ 0\times0 - 0\times5) = (0,\ 5,\ 0)`;
const EQ_PSTR = String.raw`\text{push} = (\text{strength})\times\mathbf k\times\mathbf u`;
const EQ_R45 = String.raw`\mathbf r = (4505,\ 0,\ 4505)\ \mathrm{km}`;
const EQ_SPEED = String.raw`\text{speed} = \frac{2\pi\times\text{radius}}{2\pi/\Omega} = \Omega\,|\mathbf r|\sin\theta`;
const EQ_RADIUS = String.raw`\text{radius} = |\mathbf r|\sin\theta = 6371\times\sin45^\circ \approx 4505\ \mathrm{km}`;
const EQ_OXR = String.raw`\boldsymbol\Omega\times\mathbf r = (0,\ 7.29\times10^{-5}\times4\,505\,000,\ 0) \approx (0,\ 329,\ 0)\ \mathrm{m/s}`;
const EQ_OMV = String.raw`\boldsymbol\Omega = (0,\ 0,\ 7.29\times10^{-5})\ \mathrm{rad/s}`;
const EQ_VOUT = String.raw`\mathbf v_{\text{outside}} = \mathbf u + \boldsymbol\Omega\times\mathbf r`;
const EQ_P1 = String.raw`\text{\textcircled{1}}\ \ \boldsymbol\Omega\times\mathbf u`;
const EQ_P2 = String.raw`\text{\textcircled{2}}\ \ \boldsymbol\Omega\times\mathbf u`;
const EQ_P3 = String.raw`\text{\textcircled{3}}\ \ \boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`;
const EQ_DUDT = String.raw`\frac{d\mathbf u}{dt} = \text{real pushes} - 2\boldsymbol\Omega\times\mathbf u`;
const EQ_SEEN = String.raw`\text{change seen outside} = \frac{d\mathbf u}{dt} + \boldsymbol\Omega\times\mathbf u + \boldsymbol\Omega\times\mathbf u + \boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`;
const EQ_DUDT3 = String.raw`\frac{d\mathbf u}{dt} = \text{real pushes} - 2\boldsymbol\Omega\times\mathbf u - \boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`;
const EQ_RIDER = String.raw`\frac{d\mathbf u}{dt} = -2\boldsymbol\Omega\times\mathbf u - \boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`;
const EQ_OMLOC = String.raw`\boldsymbol\Omega = (0,\ \Omega\cos\varphi,\ \Omega\sin\varphi)`;
const EQ_OMCOS = String.raw`7.29\times10^{-5}\times\cos45^\circ \approx 5.16\times10^{-5}`;
const EQ_OMSIN = String.raw`7.29\times10^{-5}\times\sin45^\circ \approx 5.16\times10^{-5}`;
const EQ_OMLOCN = String.raw`\boldsymbol\Omega = (0,\ 5.16\times10^{-5},\ 5.16\times10^{-5})\ \mathrm{rad/s}`;
const EQ_OXU = String.raw`\boldsymbol\Omega\times\mathbf u = (-\Omega\sin\varphi\,v,\ \Omega\sin\varphi\,u,\ -\Omega\cos\varphi\,u)`;
const EQ_TOFKU = String.raw`-2\boldsymbol\Omega\times\mathbf u \;\to\; -2\Omega\sin\varphi\,\mathbf k\times\mathbf u`;
const EQ_KXUS = String.raw`\mathbf k\times\mathbf u = (0\times0 - 1\times v,\ 1\times u - 0\times0,\ 0) = (-v,\ u,\ 0)`;
const EQ_VERT = String.raw`2\Omega\cos\varphi\,u = 2\times7.29\times10^{-5}\times\cos45^\circ\times10 \approx 1.03\times10^{-3}\ \mathrm{m/s^2}`;
const EQ_G0 = String.raw`-f\,\mathbf k\times\mathbf u - \frac{1}{\rho}\nabla p = 0`;
const EQ_G1 = String.raw`-f\,\mathbf k\times\mathbf u = \frac{1}{\rho}\nabla p`;
const EQ_G2 = String.raw`-f\,\mathbf k\times(\mathbf k\times\mathbf u) = \frac{1}{\rho}\,\mathbf k\times\nabla p`;
const EQ_G3 = String.raw`f\,\mathbf u = \frac{1}{\rho}\,\mathbf k\times\nabla p`;
const EQ_U81 = String.raw`\mathbf u = \left(\frac{1.00\times10^{-3}}{1.24\times10^{-4}},\ 0\right) \approx (8.1,\ 0)\ \mathrm{m/s}`;
const EQ_GP2 = String.raw`\nabla p = \left(0,\ -\frac{400\ \mathrm{Pa}}{400\,000\ \mathrm m}\right) = (0,\ -1.00\times10^{-3})\ \mathrm{Pa/m}`;
const EQ_KGP = String.raw`\mathbf k\times\nabla p = (1.00\times10^{-3},\ 0)\ \mathrm{Pa/m}`;
const EQ_CORN = String.raw`-f\,\mathbf k\times\mathbf u = -1.03\times10^{-4}\times(0,\ 8.1) \approx (0,\ -8.3\times10^{-4})\ \mathrm{m/s^2}`;
const EQ_KGP0 = String.raw`\mathbf k\times\nabla p`;
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
  // v4
  ["along", pair.split_b.along_len, 1.57, 5e-3], ["across", pair.split_b.across_len, 2.75, 5e-3], ["box", pair.box_proof.area, 14, 1e-9],
  ["F30 x", torque.along_N[1], 43.3, 0.01], ["F30 across", torque.across_N[1], 25, 1e-6], ["L", examples.angular_momentum.L[2], 3, 1e-12],
  ["kick 1", examples.kicks["1"].speed, 10.05, 5e-3], ["kick 10", examples.kicks["10"].speed, 10.005, 5e-4], ["kick 100", examples.kicks["100"].speed, 10.0005, 5e-5],
  ["r45", earth.r45_km[0], 4505, 0.5], ["v45", earth.v45[1], 329, 0.5], ["Ω cos φ", cori.omega_local[1], 5.16e-5, 5e-8], ["Ω sin φ", cori.omega_local[2], 5.16e-5, 5e-8],
  ["g/vertical", cori.vertical_ratio, 10000, 600], ["round-low ∇p", geo.round_low.gradp[1], -1e-3, 1e-9], ["Coriolis push", geo.round_low.coriolis_push[1], -8.3e-4, 5e-6],
  ["merry gap", merry.max_gap_m, 1.4e-11, 1e-9], ["850 speed ratio", storm.stats_850.median_speed_ratio, 0.85, 0.05],
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

// ---------------------------------------------------------------- v4 shared: component legs and tags (UV2-03/05/07/08)
type PPf = (v: V3) => Pt;
/** dashed component legs of a = (5, 1) and b = (1, 3) on the floor (z = 0), with their numbers (54 px). b's x-leg sits a
 * little below the x axis so the two dashed legs along x stay apart. `z0` adds the '0' tags of the third component. */
const PairLegs: React.FC<{ pp: PPf; oA?: number; oB?: number; z0?: number; s?: number }> = ({ pp, oA = 1, oB = 1, z0 = 0, s = T.key }) => {
  const seg = (a: V3, b: V3, c: string, o: number) => { const p = pp(a), q = pp(b); return <Dash p={p} q={q} c={c} o={o} w={5} d="14 10" />; };
  const lab = (at: V3, t: string, c: string, o: number, a: "start" | "middle" | "end" = "middle", dy = 0) => { const p = pp(at); return <Lbl x={p[0]} y={p[1] + dy} t={t} c={c} s={s} a={a} o={o} />; };
  return (
    <g>
      {oA > 0 ? <>{seg([0, 0, 0], [5, 0, 0], C.first, oA)}{seg([5, 0, 0], [5, 1, 0], C.first, oA)}
        {lab([3.0, -0.42, 0], "5", C.first, oA, "middle", 16)}{lab([5.3, 0.5, 0], "1", C.first, oA, "start")}</> : null}
      {oB > 0 ? <>{seg([0, -0.12, 0], [1, -0.12, 0], C.second, oB)}{seg([1, -0.12, 0], [1, 3, 0], C.second, oB)}
        {lab([0.5, -0.42, 0], "1", C.second, oB, "middle", 16)}{lab([1.3, 1.6, 0], "3", C.second, oB, "start")}</> : null}
      {z0 > 0 ? <>{lab([5.0, 1.0, 0.55], "0", C.first, z0 * oA)}{lab([1.0, 3.0, 0.55], "0", C.second, z0 * oB)}</> : null}
    </g>
  );
};
/** the triples under the picture: 'a = (5, 1, 0)' and 'b = (1, 3, 0)' (or the 2-D pair) */
const PairTags: React.FC<{ o?: number; two?: boolean; x?: number; y?: number; glow0?: number }> = ({ o = 1, two = false, x = two ? 140 : 1080, y = 830, glow0 = 0 }) =>
  o <= 0 ? null : (
    <>
      <TeX s={ctex(C.first, two ? String.raw`\mathbf a = (5,\ 1)` : String.raw`\mathbf a = (5,\ 1,\ 0)`)} x={x} y={y} size={T.key} o={o} glow={glow0} />
      <TeX s={ctex(C.second, two ? String.raw`\mathbf b = (1,\ 3)` : String.raw`\mathbf b = (1,\ 3,\ 0)`)} x={x + 420} y={y} size={T.key} o={o} glow={glow0} />
    </>
  );
const ABXB = ctex(ROT, String.raw`\mathbf a\times\mathbf b = (0,\ 0,\ 14)`);

// ================================================================ s00 title (HOUSE_STYLE §3)
const TBOX = { x: 1140, y: 180, w: 700, h: 456 };
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  const tMet = AT(k, 0, "meteorology"), tEasy = AT(k, 0, "learn about");
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
  const gc = globeCam({ lat: 32, lon: -14, dist: 3.55, pp: [GB.w / 2, GB.h / 2] }, [0, 0]);
  const G = globeProj(gc, GB.w, GB.h, GB.x, GB.y, M);
  const tex = useTex(staticFile("cp/bmng.jpg"));
  const n = Math.max(2, Math.round(hB * 0.42 * (paths.nh_track.length - 1)));
  const trk = (paths.nh_track as number[][]).slice(0, n).map(([la, lo]) => [45 + (la - 45) * 7, 0.5 + (lo - 0.5) * 7] as [number, number]);
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
      <PairTags />
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
  const t1 = SS(k, 1), tA = AT(k, 1, "five and one"), tB = AT(k, 1, "one and three"), t8 = AT(k, 1, "equals eight"), t2 = SS(k, 2);
  const t3 = SS(k, 3), tIso = AT(k, 3, "isotherms"), t4 = SS(k, 4);
  const shrink = easeIO(clamp((f - t3) / 30, 0, 1));
  const DOTP = splitEq(EQ_DOT8), DP = eqPieces(DOTP[1]);
  const COSP: Part[] = [{ t: "=" }, { t: String.raw`(|\mathbf a|\cos\theta)`, c: C.first, u: { w: String.raw`\text{shadow}`, c: C.first } },
    { t: String.raw`\,|\mathbf b|`, c: C.second, u: { w: String.raw`\text{length of }\mathbf b`, c: C.second } }];
  if (`${splitEq(EQ_COSSH)[0]} ${plainOf(COSP)}` !== rep(EQ_COSSH, String.raw`\,|`, String.raw` \,|`)) throw new Error("s02 parts ≠ EQ_COSSH");
  const oMath = fout(f, t3 + 10, 14);
  const p8 = pulse(f, t4 + 10, 24);
  const legDim = 1 - 0.6 * fin(f, t2, 12);
  return (
    <Scene>
      {svgOn < 1 ? <PairFloor st={st} /> : null}
      <Svg>
        <g opacity={svgOn * (1 - 0.4 * shrink)}>
          <PairBase />
          <PairLegs pp={(v) => P(v[0], v[1])} oA={fin(f, tA) * legDim} oB={fin(f, tB) * legDim} />
          <g opacity={fin(f, t2)}>
            <Dash p={ATIP} q={FOOT} w={4} />
            <RightTick at={FOOT} u1={unit(FOOT, O2)} u2={unit(FOOT, ATIP)} />
            <Band p={O2} q={FOOT} color={C.first} />
            <Lbl x={(O2[0] + FOOT[0]) / 2 - 40} y={(O2[1] + FOOT[1]) / 2} t="shadow" c={C.local} s={T.key} a="end" />
          </g>
        </g>
        <Lbl x={1100} y={110} t="dot product" c={C.key} s={T.key} o={fin(f, 6)} />
        <MiniIsoMap x={1100} y={430} w={600} h={330} o={fin(f, t3 + 14, 16)} isoHi={pulse(f, tIso, 24)} />
        <Keyword f={f} text="isotherms" at={[1100, 820]} appear={tIso} targets={[[1100 + 300, 770]]} />
        <Keyword f={f} text="a number" at={[1500, 300]} appear={t4} targets={[]} />
      </Svg>
      <PairTags two o={fin(f, tA) * (1 - shrink)} />
      <Layered parts={[{ t: DOTP[0] }, { t: DP[0] }, { t: DP[1], c: C.key }]} layers={[{ t: [0, 1], o: 1 }, { t: [2], o: fin(f, t8) }]}
        x={1100} y={300} size={T.calc} o={fin(f, t8 - 20) * oMath} />
      <Layered parts={COSP} layers={[{ t: "all", o: 1 }, { u: [1, 2], o: fin(f, t2 + 30) }]} x={1290} y={520} size={T.calc} ay={0} o={fin(f, t2) * oMath} />
      <TeX s={splitEq(EQ_COSSH)[0]} x={1270} y={520} size={T.calc} ax={1} ay={0} o={fin(f, t2) * oMath} />
      <TeX s={EQ_VGT} x={1100} y={300} size={T.calc} o={fin(f, t3 + 14)} glow={p8} />
      <TeX s={String.raw`\mathbf a\cdot\mathbf b = 8`} x={640} y={808} size={T.calc} o={fin(f, t3 + 20) * shrink} glow={p8} />
    </Scene>
  );
};

// ================================================================ s03 the door
const DOOR_K: OrbitKey = { f: 0, az: 238, el: 40, dist: 5.6, target: [0.5, 0.4, 0.85], pp: [500, 460] };
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
  // UV2-04 / UV2-12: the 'r' label sits under the middle of r, on the door face, never at the door's edge or the frame edge
  const rMid = pr.p(add3(D.base, sub3(D.hand, D.base), 0.45));
  const rx = clamp(rMid[0], 120, 960), ry = clamp(rMid[1] + 62, 80, 820);
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
        <Lbl x={rx} y={ry} t="r" c={C.first} s={T.calc} a="middle" o={showR} />
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
  const t1 = SS(k, 1), tE = AT(k, 1, "to the east"), tW = AT(k, 1, "to the west"), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const Q = mkP(540, 720, 130);
  const mid = Q(0, 1.6);
  const gU = fin(f, t1, 16);
  const doorBig = easeIO(clamp((f - t4) / 20, 0, 1)) * fout(f, t5 + 20, 16);
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
        <RightTick at={mid} u1={[1, 0]} u2={[0, -1]} o={fin(f, t2)} />
        <RightTick at={mid} u1={[-1, 0]} u2={[0, -1]} o={fin(f, t2)} />
        <g opacity={fin(f, t1) * (1 - doorBig)}><DoorIcon x={1700} y={830} s={0.6} o={0.8} /></g>
        <g opacity={doorBig}><DoorIcon x={1560} y={800} s={1.1} hinge={pulse(f, t4 + 10, 30)} /></g>
        <Keyword f={f} text="axis" at={[1320, 700]} appear={AT(k, 4, "around the line of its hinge")} out={t5 + 20} targets={[[1556, 690]]} />
        <Keyword f={f} text="which way is the push?" at={[1100, 170]} appear={AT(k, 1, "pushes it sideways")} out={t5} targets={[]} />
        <Keyword f={f} text="left or right?" at={[1100, 640]} appear={t3} out={t4 + 4} targets={[]} />
        <Keyword f={f} text="largest at right angles" at={[1100, 380]} appear={AT(k, 5, "largest at right angles")} out={t6 + 4} targets={[]} />
        <Keyword f={f} text="an arrow along an axis" at={[1100, 480]} appear={AT(k, 5, "an arrow along an axis")} out={t6 + 4} targets={[]} />
      </Svg>
      <TeX s={String.raw`\text{wind}\cdot\text{push east} = 0`} x={1100} y={270} size={T.calc} o={fin(f, t2 + 6) * fout(f, t5)} glow={pulse(f, t3, 24)} />
      <TeX s={String.raw`\text{wind}\cdot\text{push west} = 0`} x={1100} y={400} size={T.calc} o={fin(f, t2 + 14) * fout(f, t5)} glow={pulse(f, t3, 24)} />
      <TeX s={ctex(C.first, String.raw`\mathbf a`) + ctex(ROT, String.raw`\times`) + ctex(C.second, String.raw`\mathbf b`)} x={1450} y={430} size={T.hero} ax={0.5} o={fin(f, t6)} />
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
  const triple = fin(f, t5, 12);
  return (
    <Scene>
      <PairFloor st={st} children={<>
        <Axes3DLines o={oAx} />
        <Arrow3D from={[0, 0, 0]} to={[1, 0, 0]} color={C.ink} px={8} head={30} o={oU} grow={oU} />
        <Arrow3D from={[0, 0, 0]} to={[0, 1, 0]} color={C.ink} px={8} head={30} o={oU} grow={oU} />
        <Arrow3D from={[0, 0, 0]} to={[0, 0, 1]} color={C.ink} px={8} head={30} o={oU} grow={oU} />
      </>} over={<>
        <PairLegs pp={pr.p} z0={fin(f, tZero)} />
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
      <Svg><PairBase o={1 - handover} /><PairLegs pp={(v) => P(v[0], v[1])} oA={1 - handover} oB={1 - handover} /></Svg>
      <PairTags two x={1080} o={1 - triple} />
      <Svg>
        <Lbl x={1100} y={150} t="x → east" c={C.key} s={T.calc} o={fin(f, tE)} />
        <Lbl x={1100} y={250} t="y → north" c={C.key} s={T.calc} o={fin(f, tN)} />
        <Lbl x={1100} y={350} t="z → up" c={C.key} s={T.calc} o={fin(f, tU)} />
        <Lbl x={1100} y={480} t="length 1" c={C.gold} s={T.key} o={fin(f, AT(k, 3, "one unit long"))} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf x},\ \hat{\mathbf y},\ \hat{\mathbf z}`} x={1460} y={480} size={T.calc} o={fin(f, t2 + 10)} />
      <TeX s={ctex(C.first, AB_A)} x={1300} y={640} size={T.calc} o={fin(f, t5)} glow={glow0} />
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
  const t1 = SS(k, 1), t2 = SS(k, 2), tLX = AT(k, 2, "leave out the x parts"), t3 = SS(k, 3), tY = AT(k, 3, "the y part"), tSub = AT(k, 3, "subtract");
  const t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const st = camOf([RECIPE_K], f);
  const g6 = fin(f, tLX, 10) * fout(f, t4, 10), g7 = fin(f, t4 + 4, 10) * fout(f, t5, 10), g8 = fin(f, t5 + 4, 10);
  const grey = f < t4 ? 0 : f < t5 ? 1 : 2, greyO = grey === 0 ? g6 : grey === 1 ? g7 : g8 * fout(f, t6, 10);
  const links: [number, number, number][] = grey === 0 ? [[1, 2, tY], [2, 1, tSub]] : grey === 1 ? [[2, 0, t4 + 16], [0, 2, t4 + 40]] : [[0, 1, t5 + 16], [1, 0, t5 + 40]];
  const slots = [SE(k, 3) - 6, SE(k, 4) - 6, SE(k, 5) - 6];
  const cyc = f >= t6 ? Math.floor(((f - t6) / (SE(k, 6) - t6)) * 4) % 3 : -1;
  const mainO = fin(f, slots[0], 12);
  const layers = [{ t: [0, 1, 2, 4, 6, 8] as number[], o: 1 },
    { t: [3] as number[], o: fin(f, slots[0], 10) }, { t: [5] as number[], o: 0.25 + 0.75 * fin(f, slots[1], 10) }, { t: [7] as number[], o: 0.25 + 0.75 * fin(f, slots[2], 10) },
    { t: [3, 5, 7] as number[], tc: { 3: C.gold, 5: C.gold, 7: C.gold }, o: f >= t6 && f < SE(k, 6) ? 0.8 * [pulse(f, t6, 30), pulse(f, t6 + 30, 30), pulse(f, t6 + 60, 30)][Math.min(2, Math.floor((f - t6) / 30))] : 0 },
    { t: [3, 5, 7] as number[], tc: { 3: C.neg, 5: C.neg, 7: C.neg }, o: 0.7 * pulse(f, AT(k, 6, "a minus sign"), 40) }];
  const pr = projector(st, W3, H3);
  return (
    <Scene>
      <PairFloor st={st} over={<>
        <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
      </>} />
      <PairTags />
      <CompTable f={f} o={fin(f, t2 - 10, 14)} grey={grey} greyO={greyO} links={links} />
      <Svg>
        <Lbl x={1460} y={TAB.yb + 70} t="−" c={C.neg} s={T.eq} a="middle" o={grey === 0 ? fin(f, tSub, 8) * fout(f, t4) : 0} />
        <CycleWheel x={1690} y={720} r={70} o={fin(f, t6, 12)} arcs={clamp((f - t6) / 40, 0, 3)} hi={cyc} />
        <Keyword f={f} text="components" at={[1240, 300]} appear={AT(k, 1, "three components")} out={t2 - 6} targets={[[1268, 205], [1462, 205], [1656, 205]]} />
        <Lbl x={1880} y={95} t="?" c={C.gold} s={T.calc} a="end" o={fin(f, t7 + 6)} />
      </Svg>
      <TeX s={String.raw`\mathbf a\times\mathbf b = (\quad ${SLOT("along x")}\quad ,\quad ${SLOT("along y")}\quad ,\quad ${SLOT("along z")}\quad )`} x={1420} y={170} size={54} ax={0.5}
        o={fin(f, t1 + 4) * fout(f, slots[0], 10)} />
      <Layered parts={COMP_PARTS} layers={layers} x={960} y={95} size={T.calc} ax={0.5} o={mainO} />
    </Scene>
  );
};

// ================================================================ s07 the worked example
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_worked");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t14 = AT(k, 3, "which is fourteen"), t4 = SS(k, 4), tZZ = AT(k, 4, "zero, zero and fourteen"), t5 = SS(k, 5);
  const st = camOf([at(FLOOR_K, 0), { ...FLOOR_K, f: LEN(k), az: 225, el: 24, dist: 14.5, target: [2.2, 1.4, 1.5] }], f);
  const pr = projector(st, W3, H3);
  const [CZ_L, CZ_R] = splitEq(EQ_CZ), CZP = eqPieces(CZ_R);
  const grow = easeIO(clamp((f - tZZ) / 30, 0, 1));
  const rows: CalcRow[] = [
    { lhs: splitEq(EQ_CX)[0], rhs: splitEq(EQ_CX)[1], at: t1 + 10, h: 100 },
    { lhs: splitEq(EQ_CY)[0], rhs: splitEq(EQ_CY)[1], at: t2 + 10, h: 100 },
    { lhs: CZ_L, rhs: CZP[0], at: t3 + 10, h: 100 },
    { rhs: rep(CZP[1], "= 14", String.raw`= \mathbf{14}`), at: t14, cont: true, h: 100, c: C.key },
  ];
  const linkSet: [number, number, number][] = f < t2 ? [[1, 2, t1 + 14], [2, 1, t1 + 50]] : f < t3 ? [[2, 0, t2 + 14], [0, 2, t2 + 50]] : [[0, 1, t3 + 14], [1, 0, t3 + 50]];
  const tabO = fin(f, t1 - 6) * fout(f, tZZ, 20);
  const [EA, EB] = EQ_AB7.split(String.raw`,\quad `);
  return (
    <Scene>
      <PairFloor st={st} axb={grow} para={pulse(f, AT(k, 4, "where the two arrows lie"), 40) * 1.4}
        over={<>
          <PairLegs pp={pr.p} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={AXB3} t="a × b = (0, 0, 14)" c={ROT} s={T.key} o={fin(f, tZZ + 26)} gap={30} />
          <Bracket3 pr={pr} h={AXB3[2]} o={fin(f, tZZ + 30)} />
          <Keyword f={f} text="vector product" at={[1100, 700]} appear={AT(k, 5, "vector product")} targets={[add(pr.p([0, 0, AXB3[2] * 0.6]), [26, 0])]} />
        </>} />
      <TeX s={ctex(C.first, EA)} x={110} y={80} size={T.calc} />
      <TeX s={ctex(C.second, EB)} x={110} y={165} size={T.calc} />
      <CompTable f={f} o={tabO} grey={-1} greyO={0} links={linkSet} nums s={T.key} dy={-250} />
      <Svg>
        {["x", "y", "z"].map((w, i) => <Lbl key={w} x={1080} y={400 + 100 * i + 8} t={w} c={C.muted} s={T.key} o={fin(f, [t1, t2, t3][i] + 10) * fout(f, tZZ, 20)} />)}
      </Svg>
      <CalcStack f={f} x={1580} y={362} rows={rows.map((r) => ({ ...r, out: tZZ }))} maxLines={4} size={T.calc} dim={0.6} />
      <TeX s={EQ_AXB14} x={1080} y={520} size={T.eq} o={fin(f, tZZ)} glow={pulse(f, tZZ, 24)} />
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
  const t1 = SS(k, 1), t2 = SS(k, 2), t4 = SS(k, 4), tA = AT(k, 4, "five point one"), t5 = SS(k, 5), tB = AT(k, 5, "three point one six");
  const t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t14 = AT(k, 8, "about fourteen");
  const st = camOf([{ ...FLOOR_K, f: 0, az: 225, el: 24, dist: 14.5, target: [2.2, 1.4, 1.5] }, at(SINE_K, 40)], f);
  const pr = projector(st, W3, H3);
  const [SN_L, SN_R] = splitEq(EQ_SINN), SNP = eqPieces(SN_R);
  const [NA_L, NA_R] = splitEq(EQ_NA), NAP = eqPieces(NA_R);
  const [NB_L, NB_R] = splitEq(EQ_NB), NBP = eqPieces(NB_R);
  const [CO_L, CO_R] = splitEq(EQ_COSN), COP = eqPieces(CO_R);
  const mid = (ANG_A + ANG_B) / 2;
  // gold length brackets beside a and b on the floor (offset outwards), linked to the numbers
  const brA: [V3, V3] = [[0.18, -0.9, 0], [5.18, 0.1, 0]], brB: [V3, V3] = [[-0.85, 0.28, 0], [0.15, 3.28, 0]];
  return (
    <Scene>
      <PairFloor st={st} axb={1}
        over={<>
          <PairLegs pp={pr.p} />
          <Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={1.5} a0={ANG_A} a1={ANG_B} col={C.gold} head={false} draw={fin(f, 10, 20)} w={5 + 4 * pulse(f, t7, 30)} />
          <L3 pr={pr} at={[1.95 * Math.cos(mid * D2R), 1.95 * Math.sin(mid * D2R), 0]} t="θ" c={C.gold} s={T.calc} o={fin(f, 20)} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
          <L3 pr={pr} at={AXB3} t="a × b = (0, 0, 14)" c={ROT} s={T.key} a="middle" dy={-56} />
          <Seg3 pr={pr} a={brA[0]} b={brA[1]} c={C.gold} w={5} o={fin(f, tA - 10)} />
          <Seg3 pr={pr} a={brB[0]} b={brB[1]} c={C.gold} w={5} o={fin(f, tB - 10)} />
          <CurvedLink f={f} from={pr.p(lerp3(brA[0], brA[1], 0.75))} to={[1520, 430]} start={tA} end={t6} />
          <CurvedLink f={f} from={pr.p(lerp3(brB[0], brB[1], 0.7))} to={[1520, 430]} start={tB} end={t6} />
        </>} />
      <TeX s={EQ_COS} x={1080} y={80} size={T.calc} c={C.local} o={0.7 * fin(f, t1)} />
      <Layered parts={SIN_PARTS} layers={[{ t: "all", o: 1 }, { u: [3], o: fin(f, t2 + 20) }]} x={1070} y={150} size={T.eq} ay={0} o={fin(f, t2 + 10)} />
      <CalcStack f={f} x={1300} y={330} size={56} maxLines={2} rows={[
        { lhs: NA_L, rhs: NAP.slice(0, 2).join(" "), at: t4 + 10, h: 100, lc: C.first },
        { rhs: NAP[2], at: tA, cont: true, c: C.first, h: 90 },
        { lhs: NB_L, rhs: NBP.slice(0, 2).join(" "), at: t5 + 10, h: 100, lc: C.second },
        { rhs: NBP[2], at: tB, cont: true, c: C.second, h: 90 },
        { lhs: CO_L, rhs: COP[0], at: t6 + 10, h: 120 },
        { rhs: COP[1], at: AT(k, 6, "about point five"), cont: true, c: C.key, h: 90 },
      ]} o={fout(f, t8 - 6)} />
      <TeX s={EQ_THS4} x={1080} y={720} size={60} o={fin(f, t7 + 10)} />
      <CalcStack f={f} x={1200} y={350} size={60} rows={[
        { lhs: SN_L, rhs: SNP[0], at: t8, h: 96 },
        { rhs: rep(SNP[1], "14", String.raw`\mathbf{14}`), at: t14, cont: true, c: C.key, h: 96 },
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
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), tPar = AT(k, 6, "parallelogram");
  const t7 = SS(k, 7), t14 = AT(k, 7, "about fourteen"), t8 = SS(k, 8);
  const slide = easeIO(clamp((f - t5 - 10) / 30, 0, 1)), slide2 = easeIO(clamp((f - t5 - 50) / 30, 0, 1));
  const bCopy0 = lerp(O2, ATIP, slide), aCopy0 = lerp(O2, BTIP, slide2);
  const [H_L, H_R] = splitEq(EQ_HEIGHT), HP = eqPieces(H_R);
  const [AR_L, AR_R] = splitEq(EQ_AREA), ARP = eqPieces(AR_R);
  const cen = P(3, 2);
  return (
    <Scene>
      {svgOn < 1 ? <PairFloor st={st} axb={1 - fin(f, 0, 20)} /> : null}
      <Svg>
        <g opacity={svgOn}>
          <polygon points={CORN.map((p) => p.join(",")).join(" ")} fill={ROT} fillOpacity={0.18 * fin(f, tPar, 14) * (1 + 0.8 * pulse(f, t8, 30))} stroke={ROT} strokeWidth={3} strokeOpacity={fin(f, tPar, 14)} />
          <PairBase />
          <Dash p={P(-0.33, -1)} q={P(1.437, 4.3)} c={C.second} o={0.4 * fin(f, t1)} w={3} d="14 10" />
          <g opacity={fin(f, t1 + 20)}>
            <RightTick at={FOOT} u1={unit(FOOT, O2)} u2={unit(FOOT, ATIP)} />
            <Band p={O2} q={FOOT} color={C.first} o={0.4 * fin(f, t2) * (1 - 0.5 * fin(f, t3))} />
            <Lbl x={(O2[0] + FOOT[0]) / 2 - 36} y={(O2[1] + FOOT[1]) / 2 + 6} t="shadow" c={C.local} s={T.key} a="end" o={fin(f, t2) * fout(f, t4)} />
          </g>
          <line x1={ATIP[0]} y1={ATIP[1]} x2={FOOT[0]} y2={FOOT[1]} stroke={fin(f, t3) > 0.5 ? ROT : C.ink} strokeWidth={4 + 8 * fin(f, t3)} strokeDasharray={fin(f, t3) > 0.5 ? undefined : "12 10"} opacity={fin(f, t1 + 10)} />
          <Bracket p={FOOT} q={ATIP} off={-38} c={C.gold} o={fin(f, t3 + 10)} />
          <Lbl x={(FOOT[0] + ATIP[0]) / 2 + 30} y={(FOOT[1] + ATIP[1]) / 2 - 58} t="height" c={C.gold} s={T.key} o={fin(f, t3 + 16)} />
          <Arrow p={bCopy0} q={[bCopy0[0] + BTIP[0] - O2[0], bCopy0[1] + BTIP[1] - O2[1]]} color={C.second} dash="16 10" o={fin(f, t5 + 10) * 0.9} w={8} />
          <Arrow p={aCopy0} q={[aCopy0[0] + ATIP[0] - O2[0], aCopy0[1] + ATIP[1] - O2[1]]} color={C.first} dash="16 10" o={fin(f, t5 + 50) * 0.9} w={8} />
          <Lbl x={P(6, 4)[0] + 20} y={P(6, 4)[1] - 20} t="(6, 4)" c={C.muted} s={T.floor} o={fin(f, tPar + 10)} />
          <Keyword f={f} text="parallelogram" at={[560, 770]} appear={tPar} targets={[[cen[0] + 30, cen[1] + 40]]} />
          <Bracket p={O2} q={BTIP} off={42} c={C.gold} o={fin(f, t7)} />
          <Lbl x={(O2[0] + BTIP[0]) / 2 - 70} y={(O2[1] + BTIP[1]) / 2} t="base" c={C.gold} s={T.key} a="end" o={fin(f, t7 + 6)} />
          <CurvedLink f={f} from={[cen[0] + 40, cen[1] + 30]} to={[1180, 515]} start={t14 + 4} ctl={[950, 300]} />
        </g>
      </Svg>
      <PairTags two o={svgOn} />
      <CalcStack f={f} x={1360} y={150} rows={[
        { lhs: H_L, rhs: HP[0], at: t4, h: 96 },
        { rhs: HP[1], at: t4 + 30, cont: true, h: 96 },
        { rhs: HP[2], at: AT(k, 4, "about four point four three"), cont: true, c: C.key, h: 120 },
      ]} maxLines={3} size={T.calc} />
      <CalcStack f={f} x={1360} y={470} rows={[
        { lhs: AR_L, rhs: ARP[0], at: t7, h: 90 },
        { rhs: rep(ARP[1], "14", String.raw`\mathbf{14}`), at: t14, cont: true, c: C.key, h: 90 },
      ]} maxLines={3} size={T.calc} o={fin(f, t7)} />
      <TeX s={EQ_LENAREA} x={1080} y={720} size={T.eq} o={fin(f, t8 + 10)} c={C.key} />
      <Svg>
        <Keyword f={f} text="dot product: the shadow" at={[1100, 260]} appear={t2} out={t4 - 12} targets={[]} c={C.local} />
        <Keyword f={f} text="now: the dropped line" at={[1100, 380]} appear={t3} out={t4 - 12} targets={[]} />
        <Keyword f={f} text="= height of a above b" at={[1100, 500]} appear={AT(k, 3, "the height")} out={t4 - 12} targets={[]} c={C.gold} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s09a why the recipe is an area (box minus corners)
const S09A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09a_box_proof");
  const P = mkP(170, 730, 118);
  const CRN = (pair.corners as number[][]).map((c) => P(c[0], c[1]));
  const t = Array.from({ length: 11 }, (_, j) => SS(k, j));
  const BP = pair.box_proof as { polygons: Record<string, number[][]> };
  const poly = (nm: string) => BP.polygons[nm].map(([x, y]) => P(x, y).join(",")).join(" ");
  const lab = (x: number, y: number, s: string, c: string, o: number) => { const p = P(x, y); return <Lbl x={p[0]} y={p[1] + 18} t={s} c={c} s={T.key} a="middle" o={o} />; };
  const box = fin(f, t[1], 20);
  const tint = fin(f, t[3], 12);
  const oA = fin(f, t[4], 12), oB = fin(f, t[5], 12), oS = fin(f, t[6], 12);
  const letters = fin(f, t[8], 16);
  const strike = (j: number) => fin(f, AT(k, 8, "almost everything cancels") + 8 * j, 8);
  const [IDL, IDR] = splitEq(EQ_BOXID);
  const cen = P(3, 2);
  const parts: Part[] = [{ t: "(a_1+b_1)(a_2+b_2)" }, { t: "- a_1a_2", x: C.neg }, { t: "- b_1b_2", x: C.neg }, { t: "- 2a_2b_1", x: C.neg }];
  if (`${plainOf(parts)}` !== IDL) throw new Error(`s09a parts ≠ EQ_BOXID: ${plainOf(parts)} | ${IDL}`);
  return (
    <Scene>
      <Svg>
        <Grid P={P} xr={[-1, 7]} yr={[-1, 5]} o={0.6} />
        {(["a_tri_1", "a_tri_2"] as const).map((n) => <polygon key={n} points={poly(n)} fill={C.first} fillOpacity={0.35 * oA + 0.3 * tint * (1 - oA)} stroke="none" />)}
        {(["b_tri_1", "b_tri_2"] as const).map((n) => <polygon key={n} points={poly(n)} fill={oB > 0 ? C.second : C.local} fillOpacity={0.35 * oB + 0.3 * tint * (1 - oB)} stroke="none" />)}
        {(["sq_1", "sq_2"] as const).map((n) => <polygon key={n} points={poly(n)} fill={oS > 0 ? C.gold : C.local} fillOpacity={0.35 * oS + 0.3 * tint * (1 - oS)} stroke="none" />)}
        <polygon points={CRN.map((p) => p.join(",")).join(" ")} fill={ROT} fillOpacity={0.22 * (1 + 0.8 * pulse(f, t[7], 30))} stroke={ROT} strokeWidth={3} />
        <Arrow p={P(0, 0)} q={P(1, 3)} color={C.second} />
        <Arrow p={P(0, 0)} q={P(5, 1)} color={C.first} />
        <Lbl x={P(1, 3)[0] - 30} y={P(1, 3)[1] - 20} t="b" c={C.second} s={T.calc} a="end" />
        <Lbl x={P(5, 1)[0] + 26} y={P(5, 1)[1] + 30} t="a" c={C.first} s={T.calc} />
        <path d={`M ${P(0, 0).join(" ")} L ${P(6, 0).join(" ")} L ${P(6, 4).join(" ")} L ${P(0, 4).join(" ")} Z`} fill="none" stroke={C.key} strokeWidth={6}
          strokeDasharray="2000" strokeDashoffset={2000 * (1 - box)} />
        <Bracket p={P(0, 0)} q={P(6, 0)} off={-46} c={C.gold} o={fin(f, AT(k, 1, "six along"))} />
        <Lbl x={P(3, 0)[0]} y={P(3, 0)[1] + 96} t="6" c={C.gold} s={T.key} a="middle" o={fin(f, AT(k, 1, "six along"))} />
        <Bracket p={P(6, 0)} q={P(6, 4)} off={-46} c={C.gold} o={fin(f, AT(k, 1, "four up"))} />
        <Lbl x={P(6, 2)[0] + 80} y={P(6, 2)[1]} t="4" c={C.gold} s={T.key} a="start" o={fin(f, AT(k, 1, "four up"))} />
        {lab(4.2, 0.28, "2.5", C.first, oA)}{lab(1.8, 3.72, "2.5", C.first, oA)}
        {lab(5.62, 1.9, "1.5", C.second, oB)}{lab(0.36, 2.0, "1.5", C.second, oB)}
        {lab(5.5, 0.35, "1", C.gold, oS)}{lab(0.5, 3.35, "1", C.gold, oS)}
        <CurvedLink f={f} from={[cen[0] + 30, cen[1] - 10]} to={[1380, 600]} start={AT(k, 7, "which is fourteen")} end={t[8]} ctl={[900, 380]} />
        <Lbl x={cen[0]} y={cen[1] - 10} t="?" c={C.gold} s={T.hero} a="middle" o={fin(f, 10) * fout(f, t[1])} />
        <Keyword f={f} text="area formula" at={[1100, 760]} appear={AT(k, 10, "an area formula")} targets={[]} />
      </Svg>
      <PairTags two x={1080} />
      <TeX s={String.raw`a_1b_2 - a_2b_1 = 5\times3 - 1\times1 = 14`} x={1080} y={80} size={56} o={fin(f, 6) * (1 - letters)} />
      <TeX s={String.raw`\mathbf a\times\mathbf b = (\dots,\ \dots,\ a_1b_2 - a_2b_1)`} x={1080} y={80} size={T.key} c={C.local} o={letters} />
      <CalcStack f={f} x={1300} y={200} size={T.calc} maxLines={5} rows={[
        { lhs: splitEq(EQ_BOX24)[0], rhs: splitEq(EQ_BOX24)[1], at: t[2], h: 96 },
        { lhs: splitEq(EQ_BOXA)[0], rhs: splitEq(EQ_BOXA)[1], at: AT(k, 4, "together they make five"), h: 96, lc: C.first },
        { lhs: splitEq(EQ_BOXB)[0], rhs: splitEq(EQ_BOXB)[1], at: AT(k, 5, "make three"), h: 96, lc: C.second },
        { lhs: splitEq(EQ_BOXS)[0], rhs: splitEq(EQ_BOXS)[1], at: AT(k, 6, "make two"), h: 96, lc: C.gold },
        { lhs: "", rhs: rep(EQ_BOX14, "= 14", String.raw`= \mathbf{14}`), at: AT(k, 7, "which is fourteen") - 20, h: 100, c: C.key },
      ]} o={1 - letters} />
      <Layered parts={[...parts, { t: IDR, c: C.key }]}
        layers={[{ t: "all", o: 1 }, { x: [1], o: strike(0) }, { x: [2], o: strike(1) }, { x: [3], o: strike(2) }]}
        x={1040} y={360} size={44} o={letters} />
      <Svg>
        <line x1={1080} y1={470} x2={1830} y2={470} stroke={C.gold} strokeWidth={6} opacity={fin(f, t[9]) * letters} />
        <CurvedLink f={f} from={[1650, 430]} to={[1700, 125]} start={t[10]} ctl={[1830, 280]} />
      </Svg>
      <TeX s={String.raw`= a_1b_2 + a_2b_1 - 2a_2b_1`} x={1080} y={560} size={T.floor} c={C.local} o={fin(f, t[8] + 20) * fout(f, t[10])} />
      <TeX s={String.raw`\text{(x of }\mathbf a)\times(\text{y of }\mathbf b) - (\text{y of }\mathbf a)\times(\text{x of }\mathbf b)`} x={1080} y={680}
        size={T.floor} c={C.key} o={fin(f, AT(k, 9, "x part of vector a"))} />
    </Scene>
  );
};

// ================================================================ s10 at right angles to both
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_right_angles");
  const RA_K: OrbitKey = { ...FLOOR_K, f: 40, az: 205, el: 30, dist: 13, target: [2.2, 1.2, 1.4] };
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), tDown = AT(k, 6, "up and down"), t7 = SS(k, 7), t8 = SS(k, 8);
  const st = camOf([at(TOP_K, 0), RA_K, at(RA_K, t6), { ...RA_K, f: t6 + 40, target: [2.0, 1.1, -1.0], dist: 19.5, el: 22 }], f);
  const pr = projector(st, W3, H3);
  const PA = splitEq(EQ_PERPA), PAP = eqPieces(PA[1]), PB = splitEq(EQ_PERPB), PBP = eqPieces(PB[1]);
  const ah = norm3(A3), bh = norm3(B3);
  return (
    <Scene>
      <PairFloor st={st} axb={fin(f, 20, 20)}
        children={<Arrow3D from={[0, 0, 0]} to={[0, 0, -AXB3[2]]} color={ROT} px={14} head={48} dash o={0.45 * fin(f, t6 + 40)} />}
        over={<>
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={AXB3} t="a × b = (0, 0, 14)" c={ROT} s={T.key} o={fin(f, 30) * fout(f, tDown - 14)} />
          <Tick3 pr={pr} at={[0, 0, 0]} u1={ah} u2={[0, 0, 1]} s={0.55} o={fin(f, AT(k, 1, "right angle"))} />
          <Tick3 pr={pr} at={[0, 0, 0]} u1={bh} u2={[0, 0, 1]} s={0.55} o={fin(f, AT(k, 1, "to both arrows"))} />
          <L3 pr={pr} at={AXB3} t="up?" c={C.key} s={T.key} dx={-120} o={fin(f, tDown - 10)} />
          <L3 pr={pr} at={[0, 0, -AXB3[2]]} t="down?" c={C.key} s={T.key} dx={130} o={fin(f, tDown)} />
          <Lbl x={pr.p([0, 0, 0])[0] - 150} y={pr.p([0, 0, 0])[1]} t="?" c={C.gold} s={T.hero} a="middle" o={fin(f, t7)} />
        </>} />
      <PairTags />
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
        <Lbl x={1080} y={720} t="right-hand rule" c={C.key} s={T.calc} o={fin(f, AT(k, 8, "right-hand rule"))} />
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
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = AT(k, 2, "the cap rises"), t4 = SS(k, 3), t5 = AT(k, 3, "screws down"), t6 = SS(k, 4), t7 = AT(k, 4, "turned from the first");
  const st = camOf([CAP_K], f), pr = projector(st, W3, H3);
  const th = pair.theta_deg * D2R;
  // cap angle: 0 → θ (S2), on to θ + 2π (to the end of S4), back to 0 (S5–S6)
  const a1 = th * easeIO(clamp((f - t1 - 6) / 40, 0, 1));
  const a2 = 2 * Math.PI * easeIO(clamp((f - t1 - 50) / (t4 - 10 - t1 - 50), 0, 1));
  const a3 = (th + 2 * Math.PI) * easeIO(clamp((f - t4) / (SE(k, 3) - t4), 0, 1));
  const capA = a1 + a2 - a3;
  const pitch = rhr.cap.pitch_display;
  const lift = (pitch * capA) / (2 * Math.PI);
  const rising = f >= t1 && f < t4, sinking = f >= t4 && f < t6;
  // screw: 2 turns anticlockwise (backs out), then 2.5 clockwise (drives in)
  const sA = 2 * Math.PI * easeIO(clamp((f - t6) / (t7 - t6), 0, 1)) + th * easeIO(clamp((f - t7 - 10) / 50, 0, 1));
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
        <L3 pr={pr} at={add3(SX, [0, 0, 2.3 + sAdv * 1.3])} t="first × second" c={ROT} s={T.key} a="end" dx={-40} o={fin(f, AT(k, 4, "it moves along"))} />
        <Keyword f={f} text="bottle cap · screw" at={[1100, 300]} appear={AT(k, 0, "a bottle cap")} out={t2 - 6} targets={[]} />
        <Lbl x={1100} y={420} t="turn a → b" c={C.key} s={T.calc} o={fin(f, AT(k, 1, "Turn the cap")) * fout(f, t2 - 6)} />
        <Keyword f={f} text="opens" at={[1180, 560]} appear={AT(k, 2, "the way you open")} out={t4} targets={[]} />
        <Keyword f={f} text="closes" at={[1180, 560]} appear={t5} out={t6} targets={[]} />
        <Lbl x={1100} y={300} t="screw: same way" c={C.key} s={T.key} o={fin(f, t6 + 6)} />
        <Lbl x={1100} y={420} t="turn first → second" c={C.key} s={T.key} o={fin(f, t7 + 20)} />
        <Lbl x={1100} y={510} t="moves along first × second" c={C.key} s={T.key} o={fin(f, AT(k, 4, "it moves along"))} />
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
  const t1 = SS(k, 1), tCurl1 = AT(k, 1, "curl them"), t2 = SS(k, 2), tXY = AT(k, 2, "x hat cross y hat"), t3 = SS(k, 3), t4 = AT(k, 3, "curl them"), t5 = SS(k, 4), tYZ = AT(k, 4, "y hat cross z hat");
  const t6 = SS(k, 5), tCurl3 = AT(k, 5, "curling towards"), t7 = SS(k, 6), t8 = SS(k, 6), t9 = SS(k, 7);
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
      <TeX s={EQ_ZX} x={1100} y={460} size={T.calc} o={fin(f, AT(k, 6, "z hat cross x hat"))} c={C.key} glow={pulse(f, t8, 24)} />
      <Svg><CycleWheel x={1690} y={740} r={80} o={fin(f, t9)} arcs={clamp((f - t9) / 45, 0, 3)} hi={-1} /></Svg>
    </Scene>
  );
};

const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_rhr_swap");
  const t1 = SS(k, 1), t2 = SS(k, 2), tOver = AT(k, 2, "turn your hand over"), t3 = AT(k, 2, "thumb points down"), t5 = AT(k, 4, "z hat cross y hat"), tZY = t5;
  const t6 = AT(k, 4, "x hat cross z hat"), t7 = SS(k, 5);
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
            <TipL3 pr={prF} from={[0, 0, 0]} to={neg14} t="b × a = (0, 0, −14)" c={ROT} s={T.key} />
            <L3 pr={prF} at={[0, 0, -AXB3[2] / 2]} t="−14" c={C.neg} s={T.key} dx={-80} />
            <Lbl x={120} y={130} t="first: b" c={C.second} s={T.key} o={fin(f, t7 + 10)} />
          </>} />
      </div> : null}
      <TeX s={EQ_XY} x={1100} y={170} size={T.key} c={C.local} o={0.6 * fin(f, t1)} />
      <TeX s={String.raw`\hat{\mathbf y}\times\hat{\mathbf x} = \ ?`} x={1100} y={260} size={T.calc} o={fin(f, AT(k, 1, "Point your fingers")) * fout(f, AT(k, 3, "minus z hat") - 8)} />
      <TeX s={EQ_YX} x={1100} y={260} size={T.calc} o={fin(f, AT(k, 3, "minus z hat")) * (1 - 0.6 * cut)} />
      <TeX s={EQ_ZY} x={1100} y={360} size={T.calc} o={fin(f, AT(k, 4, "minus x hat")) * (1 - 0.6 * cut)} />
      <TeX s={EQ_XZ} x={1100} y={460} size={T.calc} o={fin(f, AT(k, 4, "minus y hat")) * (1 - 0.6 * cut)} />
      <TeX s={EQ_BXA} x={1100} y={580} size={T.calc} o={fin(f, AT(k, 5, "minus fourteen"))} />
      <TeX s={EQ_ANTI} x={1100} y={705} size={T.eq} c={C.key} o={fin(f, AT(k, 6, "flips its arrow"))} glow={pulse(f, AT(k, 6, "flips its arrow") + 10, 24)} />
      <TeX s={EQ_DOTSYM} x={1100} y={815} size={T.key} c={C.local} o={fin(f, AT(k, 7, "a dot b equals"))} />
    </Scene>
  );
};

/** s16: the six results on a flat screen (x right, y up, z out of the screen) */
const SCREEN_K: OrbitKey = { f: 0, az: 270, el: 90, dist: 14, target: [0, 0, 0], pp: [520, 460] };
const MINI = { x: 1040, y: 380, w: 820, h: 480 };
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16_rhr_screen");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 3) + 20, t5 = SS(k, 4), t6 = AT(k, 4, "y hat cross x hat"), t7 = SS(k, 5), tZY = AT(k, 5, "z hat cross y hat");
  const t8 = SS(k, 6), tXZ = AT(k, 6, "x hat cross z hat"), t9 = SS(k, 7);
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
      <Svg><Lbl x={520} y={840} t="up · down · left · right · into · out of" c={C.key} s={T.key} a="middle" o={fin(f, t9 + 10)} /></Svg>
    </Scene>
  );
};

const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_rhr_views");
  const t1 = SS(k, 1), t3 = SS(k, 3), t5 = SS(k, 5), t7 = SS(k, 6), t8 = SS(k, 7);
  const base = { ...FLOOR_K, dist: 13.5, pp: [540, 470] as Pt };
  const top = { ...base, az: 270, el: 89.9, target: [0, 0, 0] as V3, dist: 16, pp: [300, 640] as Pt };
  const bot = { ...base, az: 270, el: -89.9, target: [0, 0, 0] as V3, dist: 16, pp: [700, 640] as Pt, up: [0, 1, 0] as V3 };
  const st = camOf([{ ...base, f: 0 }, { ...top, f: t1 + 20 }, { ...top, f: t3 }, { ...bot, f: t3 + 50 }, { ...bot, f: t5 },
    { ...base, f: t5 + 50, az: 230, el: 30, target: [2.5, 1.5, 1.0] }], f);
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
          {!above && !below ? <TipL3 pr={pr} from={[0, 0, 0]} to={AXB3} t="a × b = (0, 0, 14)" c={ROT} s={T.key} /> : null}
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
        <Lbl x={mp([3.0, 0, 0])[0]} y={mp([3.0, 0, 0])[1] - 48} t="(3, 0, 0)" c={C.first} s={T.floor} a="end" />
        {!zero && pzO > 0 ? <Lbl x={mp([0, 0, pz * DS])[0] + 40} y={mp([0, 0, pz * DS])[1]} t={neg ? "−" : ""} c={C.neg} s={T.calc} o={pzO} /> : null}
      </Svg>
    </div>
  );
};
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_cases");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9);
  const tCW = AT(k, 9, "becomes clockwise"), tDown = AT(k, 9, "flips to point down");
  const big = easeIO(clamp((f - t9) / 30, 0, 1));
  const sw = clamp((f - t9 - 30) / (SE(k, 9) - t9 - 40), 0, 1);
  const th2 = 90 + 180 * easeIO(sw);
  const q2 = (big > 0 ? idx(sweep.q_xyz as number[][], th2 / 360) : cases.q[1]) as V3;
  const pz2 = big > 0 ? interp(th2, sweep.theta_deg, sweep.pxq_z) : cases.p_cross_q[1][2] * fin(f, AT(k, 5, "points straight up"), 20);
  const oth = 1 - big;
  const pTop = fin(f, t1) * fout(f, t8 - 8);
  const under = (i: number, lines: { t: string; o: number; c?: string; tex?: boolean }[]) => lines.map((l, j) =>
    l.tex ? <TeX key={j} s={l.t} x={PANELS[i].x + 280} y={720 + 66 * j} size={T.key} ax={0.5} o={l.o * oth} c={l.c ?? C.ink} />
      : <Svg key={j}><Lbl x={PANELS[i].x + 280} y={720 + 66 * j} t={l.t} c={l.c ?? C.key} s={T.key} a="middle" o={l.o * oth} /></Svg>);
  return (
    <Scene>
      <Svg>
        <g opacity={pTop}>
          <Arrow p={[690, 190]} q={[880, 190]} color={C.first} w={8} head={28} />
          <Lbl x={900} y={190} t="p = (3, 0, 0)" c={C.first} s={T.calc} />
        </g>
      </Svg>
      <Panel i={0} q={cases.q[0] as V3} pz={0} o={fin(f, t1 + 30) * oth} qO={fin(f, AT(k, 2, "q points"), 16)} />
      <Panel i={1} q={q2} pz={pz2} o={fin(f, t1 + 40)} big={big} tick={fin(f, t4 + 20) * (1 - big)} rect={pulse(f, t5 + 10, 30)} qO={fin(f, AT(k, 4, "q is at a right angle"), 16)} />
      <Panel i={2} q={cases.q[2] as V3} pz={0} o={fin(f, t1 + 50) * oth} qO={fin(f, AT(k, 6, "q points"), 16)} />
      {under(0, [{ t: "same direction", o: fin(f, t2 + 20) }, { t: EQ_PQ0, o: fin(f, AT(k, 3, "p cross q is zero")), tex: true }])}
      {under(1, [{ t: "right angle", o: fin(f, t4) }, { t: EQ_PQ6, o: fin(f, AT(k, 5, "six units long")), tex: true }])}
      {under(2, [{ t: "opposite", o: fin(f, t6 + 30) }, { t: EQ_PQ0, o: fin(f, AT(k, 7, "the cross product is zero")), tex: true }])}
      <Svg>
        {[0, 1, 2].map((i) => <Lbl key={i} x={PANELS[i].x + 280} y={270} t={["q = (2, 0, 0)", "q = (0, 2, 0)", "q = (−2, 0, 0)"][i]} c={C.second} s={T.key} a="middle"
          o={fin(f, [t2 + 10, t4 + 20, t6 + 20][i]) * oth} />)}
        {[0, 1, 2].map((i) => <Lbl key={`a${i}`} x={PANELS[i].x + 280} y={852} t={`area ${[0, 6, 0][i]}`} c={C.muted} s={T.floor} a="middle"
          o={fin(f, [t3 + 30, t5 + 20, t7 + 20][i]) * oth} />)}
        <Lbl x={960} y={110} t="same way or opposite → 0" c={C.key} s={T.key} a="middle" o={fin(f, t8) * oth * fout(f, t9)} />
        <Lbl x={960} y={190} t="right angle → longest" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 8, "as long as it can be")) * oth * fout(f, t9)} />
        <Keyword f={f} text="fix one arrow, turn the other" at={[960, 480]} a="middle" appear={6} out={t1 + 20} targets={[]} />
        <g opacity={fin(f, tCW) * big}>
          <circle cx={1650} cy={300} r={120} fill="#1d2740" stroke={C.grid} strokeWidth={3} />
          <Arrow p={[1650, 300]} q={[1750, 300]} color={C.first} w={7} head={24} halo={false} />
          <Arrow p={[1650, 300]} q={[1650 + 70 * Math.cos(th2 * D2R), 300 - 70 * Math.sin(th2 * D2R)]} color={C.second} w={7} head={24} halo={false} />
          <path d={`M ${1650 + 48} 300 A 48 48 0 0 1 ${1650 + 48 * Math.cos(th2 * D2R)} ${300 - 48 * Math.sin(th2 * D2R)}`} fill="none" stroke={C.gold} strokeWidth={5} />
          <Lbl x={1650} y={470} t="clockwise" c={C.key} s={T.floor} a="middle" />
          <Lbl x={1650} y={520} t="from above" c={C.key} s={T.floor} a="middle" />
        </g>
      </Svg>
      <TeX s={EQ_PQM6} x={1390} y={640} size={T.key} ax={0} o={fin(f, tDown) * big} c={C.neg} />
    </Scene>
  );
};

// ================================================================ s18a the questions; s18b the part across; s18c the slide
const QLIST = ["sin θ ?", "area ?", "area, but an arrow ?"];
const QList: React.FC<{ f: number; o: number; ticks: number[] }> = ({ f, o, ticks }) => (o <= 0 ? null : (
  <g opacity={o}>
    {QLIST.map((q, i) => <g key={q}>
      <Lbl x={1200} y={560 + 90 * i} t={q} c={C.key} s={T.key} />
      <Check x={1140} y={560 + 90 * i} o={fin(f, ticks[i], 10)} />
    </g>)}
  </g>));
const S18A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18a_why_question");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4);
  const st = camOf([{ ...FLOOR_K, az: 235, el: 30, dist: 14.5, target: [2.2, 1.4, 1.4] }], f), pr = projector(st, W3, H3);
  const pz = pulse(f, 4, 30);
  const ghost = fin(f, AT(k, 3, "points up or down"), 8) * fout(f, AT(k, 3, "points up or down") + 30, 10);
  return (
    <Scene>
      <PairFloor st={st} axb={1} para={1 + 0.8 * pz}
        children={<Arrow3D from={[0, 0, 0]} to={[0, 0, -AXB3[2] * 0.35]} color={ROT} px={14} head={48} dash o={0.5 * ghost} />}
        over={<>
          <Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={1.6} a0={ANG_A} a1={ANG_B} col={C.gold} head={false} o={fin(f, AT(k, 2, "Why the sine"))} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={AXB3} t="a × b = (0, 0, 14)" c={ROT} s={T.key} />
          <Keyword f={f} text="sin θ ?" at={[1100, 230]} appear={AT(k, 2, "Why the sine")} out={t4} targets={[pr.p([1.7 * Math.cos(30 * D2R), 1.7 * Math.sin(30 * D2R), 0])]} />
          <Keyword f={f} text="area ?" at={[1100, 330]} appear={AT(k, 2, "why an area")} out={t4} targets={[pr.p([3, 2, 0])]} />
          <Keyword f={f} text="area … but an arrow, up or down ?" s={T.floor} at={[1100, 430]} appear={t3} out={t4} targets={[pr.p([3.4, 2.1, 0]), pr.p([0, 0, AXB3[2] * 0.7])]} />
          <Lbl x={1700} y={180} t="?" c={C.gold} s={T.hero} a="middle" o={fin(f, t1) * fout(f, t4)} />
        </>} />
      <PairTags />
      <Svg><QList f={f} o={fin(f, t4)} ticks={[1e9, 1e9, 1e9]} /></Svg>
    </Scene>
  );
};
const ALONG = pair.split_b.along as Pt, ACROSS = pair.split_b.across as Pt;
const S18B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18b_across_part");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const tAl = AT(k, 5, "one point five seven"), tAc = AT(k, 5, "two point seven five");
  const FT = P(...ALONG);
  const split = fin(f, t3, 16);
  const [AC_L, AC_R] = splitEq(EQ_ACR), ACP = eqPieces(AC_R);
  const [A14_L, A14_R] = splitEq(EQ_ACR14), A14P = eqPieces(A14_R);
  return (
    <Scene>
      <Svg>
        <Grid P={P} xr={[-1, 6]} yr={[-1, 4]} o={0.9} />
        <Dash p={P(-1, -0.2)} q={P(6, 1.2)} c={C.first} o={0.35} w={3} d="14 10" />
        <Band p={O2} q={FT} color={C.local} o={0.7 * fin(f, t1) * (1 - split)} />
        <Lbl x={FT[0] - 10} y={FT[1] + 64} t="along" c={C.local} s={T.key} a="middle" o={fin(f, t1) * (1 - split)} />
        <Arrow p={O2} q={ATIP} color={C.first} />
        <Arrow p={O2} q={BTIP} color={C.second} o={1 - 0.5 * split + 0.5 * fin(f, t4 + 20)} />
        <Band p={O2} q={FT} color={C.first} o={0.8 * split * (1 + 0.5 * pulse(f, t4, 20))} />
        <Band p={FT} q={BTIP} color={ROT} o={0.8 * split * (1 + 0.5 * pulse(f, t4 + 20, 20))} />
        <RightTick at={FT} u1={unit(FT, O2)} u2={unit(FT, BTIP)} o={split} />
        <Lbl x={FT[0] + 40} y={FT[1] + 64} t={f >= tAl ? "along ≈ 1.57" : "along"} c={C.first} s={T.key} a="middle" o={split} />
        <Lbl x={(FT[0] + BTIP[0]) / 2 - 40} y={(FT[1] + BTIP[1]) / 2} t={f >= tAc ? "across ≈ 2.75" : "across"} c={ROT} s={T.key} a="end" o={split} />
        <Bracket p={FT} q={BTIP} off={40} c={C.gold} o={fin(f, tAc)} />
        <Bracket p={O2} q={ATIP} off={-46} c={C.gold} o={fin(f, t7)} />
        <Arc P={(x, y) => [O2[0] + x, O2[1] - y]} a0={ANG_A} a1={ANG_B} r={90} c={C.gold} w={5} o={fin(f, t6)} />
        <Lbl x={O2[0] + 120} y={O2[1] - 120} t="θ" c={C.gold} s={T.key} o={fin(f, t6)} />
        <TipLabel p={PAIR_TIPS.a} c={C.first} /><TipLabel p={PAIR_TIPS.b} c={C.second} />
        <Keyword f={f} text="dot product: along" at={[1100, 140]} appear={t1} out={t2} targets={[]} c={C.local} />
        <Lbl x={1100} y={240} t="along + across = b" c={C.key} s={T.key} o={fin(f, t4) * fout(f, t6 - 4)} />
        <CurvedLink f={f} from={[(FT[0] + BTIP[0]) / 2 + 30, (FT[1] + BTIP[1]) / 2]} to={[1590, 450]} start={AT(k, 7, "two point seven five")} end={t8} ctl={[1000, 300]} />
        <TeX s={String.raw`\mathbf a\cdot\mathbf b\ \to\ \text{along}\ (\cos\theta)`} x={1100} y={640} size={T.key} c={C.local} o={fin(f, t8)} />
        <TeX s={String.raw`\mathbf a\times\mathbf b\ \to\ \text{across}\ (\sin\theta)`} x={1100} y={740} size={T.key} c={ROT} o={fin(f, AT(k, 8, "the cross product uses"))} />
      </Svg>
      <PairTags two />
      <CalcStack f={f} x={1330} y={300} size={60} maxLines={4} rows={[
        { lhs: AC_L, rhs: ACP[0], at: t6, h: 90 },
        { rhs: ACP[1], at: t6 + 30, cont: true, h: 90 },
        { lhs: A14_L, rhs: A14P[0], at: t7, h: 90 },
        { rhs: A14P[1], at: AT(k, 7, "five point one times"), cont: true, h: 90 },
        { rhs: rep(A14P[2], "14", String.raw`\mathbf{14}`), at: AT(k, 7, "about fourteen"), cont: true, c: C.key, h: 90 },
      ]} o={fout(f, t8 - 4)} />
    </Scene>
  );
};
const P18C = mkP(130, 770, 78);
const S18C: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18c_slide");
  const t1 = SS(k, 1), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const sl = pair.slide as { s: number[]; b: number[][]; cross_z: number[] };
  const s1 = easeIO(clamp((f - AT(k, 1, "slide the tip")) / (SE(k, 1) - AT(k, 1, "slide the tip")), 0, 1));
  const s2 = Math.sin(Math.PI * easeIO(clamp((f - t6) / 70, 0, 1)));
  const s = s1 + s2;                    // 0 → 1 (to (6, 4)) → 2 (to (11, 5)) and back to 1
  const bv = idx(sl.b, s / 2) as Pt, cz = interp(s, sl.s, sl.cross_z);
  const O = P18C(0, 0), A = P18C(5, 1), Bp = P18C(bv[0], bv[1]), AB = P18C(5 + bv[0], 1 + bv[1]);
  const ah: Pt = [5 / Math.hypot(5, 1), 1 / Math.hypot(5, 1)];
  const along = bv[0] * ah[0] + bv[1] * ah[1];
  const Ft = P18C(ah[0] * along, ah[1] * along);
  const moving = s1 > 0.001 && s1 < 0.999 || (s2 > 0.001);
  const fmt = (v: number) => (moving ? v.toFixed(1) : String(Math.round(v)));
  return (
    <Scene>
      <Svg>
        <Grid P={P18C} xr={[-1, 12]} yr={[-1, 6]} o={0.7} />
        <Dash p={P18C(-1, 2.8)} q={P18C(12.5, 5.5)} c={C.gold} o={0.6 * fin(f, t1)} w={4} d="14 10" />
        <polygon points={[O, A, AB, Bp].map((p) => p.join(",")).join(" ")} fill={ROT} fillOpacity={0.2} stroke={ROT} strokeWidth={3} />
        <Band p={Ft} q={Bp} color={ROT} o={0.6 * fin(f, t3)} />
        <RightTick at={Ft} u1={unit(Ft, O)} u2={unit(Ft, Bp)} o={fin(f, t3)} />
        <Bracket p={O} q={A} off={-44} c={C.gold} o={fin(f, t3)} />
        <Lbl x={(O[0] + A[0]) / 2} y={(O[1] + A[1]) / 2 + 100} t="base 5.099" c={C.gold} s={T.key} a="middle" o={fin(f, t3)} />
        <Lbl x={(Ft[0] + Bp[0]) / 2 + 30} y={(Ft[1] + Bp[1]) / 2 + 10} t="height 2.75" c={ROT} s={T.key} a="start" o={fin(f, AT(k, 3, "so does its height"))} />
        <Arrow p={O} q={Bp} color={C.second} />
        <Arrow p={O} q={A} color={C.first} />
        <Lbl x={Bp[0] - 20} y={Bp[1] - 50} t={`b = (${fmt(bv[0])}, ${fmt(bv[1])})`} c={C.second} s={T.key} a="middle" />
        <Lbl x={A[0] + 30} y={A[1] + 50} t="a = (5, 1)" c={C.first} s={T.key} a="start" />
        <Lbl x={(O[0] + AB[0]) / 2 + 10} y={(O[1] + AB[1]) / 2 - 10} t={`${Math.round(cz)}`} c={C.key} s={T.calc} a="middle" o={fin(f, t4)} />
        <Keyword f={f} text="ignores: along" at={[1100, 640]} appear={t7} targets={[]} c={C.local} />
        <Keyword f={f} text="measures: across" at={[1100, 740]} appear={t8} targets={[]} c={ROT} />
      </Svg>
      <CalcStack f={f} x={1300} y={240} size={T.calc} rows={[
        { lhs: splitEq(EQ_SLIDE)[0], rhs: eqPieces(splitEq(EQ_SLIDE)[1])[0], at: t5, h: 100 },
        { rhs: rep(eqPieces(splitEq(EQ_SLIDE)[1])[1], "14", String.raw`\mathbf{14}`), at: AT(k, 5, "fourteen again"), cont: true, c: C.key, h: 100 },
      ]} />
      <TeX s={ABXB} x={1100} y={500} size={T.key} o={fin(f, t6)} />
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
  const cells: { dot: string; cross: string; td: number; tc: number; mini: number }[] = [
    { dot: "number · along · cos θ", cross: "arrow · across · sin θ", td: SS(k, 1), tc: SS(k, 2), mini: 0 },
    { dot: "shadow × length", cross: "area · normal", td: SS(k, 3), tc: SS(k, 4), mini: 2 },
    { dot: "same way", cross: "right angle", td: SS(k, 5), tc: AT(k, 5, "the cross product at right angles"), mini: 3 },
    { dot: "order: same", cross: "order: flips", td: AT(k, 5, "only the cross product flips"), tc: AT(k, 5, "flips when we swap"), mini: 4 },
    { dot: "work", cross: "torque", td: AT(k, 6, "work"), tc: AT(k, 6, "torque"), mini: 5 },
    { dot: "advection", cross: "turns the wind", td: AT(k, 7, "advection"), tc: AT(k, 7, "turns the wind"), mini: 6 },
  ];
  const Y = [235, 340, 445, 550, 655, 760];
  const cxD = 860, cxC = 1460;
  return (
    <Scene>
      <Svg>
        {cells.map((c, i) => <g key={i} transform={`translate(0 ${Y[i] - GRID_Y[c.mini]})`}><MiniRow i={c.mini} o={fin(f, c.td - 6)} /></g>)}
        {cells.map((c, i) => <g key={i}>
          <Lbl x={cxD} y={Y[i]} t={c.dot} c={C.key} s={T.floor} a="middle" o={fin(f, c.td)} />
          <Lbl x={cxC} y={Y[i]} t={c.cross} c={C.key} s={T.floor} a="middle" o={fin(f, c.tc)} />
          <line x1={cxC - 180} y1={Y[i] + 38} x2={cxC + 180} y2={Y[i] + 38} stroke={C.gold} strokeWidth={5} opacity={fin(f, c.tc + 8)} />
        </g>)}
      </Svg>
      <TeX s={ctex(C.first, String.raw`\mathbf a`) + String.raw`\cdot` + ctex(C.second, String.raw`\mathbf b`)} x={cxD} y={120} size={T.calc} ax={0.5} o={fin(f, 6)} />
      <TeX s={ctex(C.first, String.raw`\mathbf a`) + ctex(ROT, String.raw`\times`) + ctex(C.second, String.raw`\mathbf b`)} x={cxC} y={120} size={T.calc} ax={0.5} o={fin(f, 6)} />
    </Scene>
  );
};

// ================================================================ s20–s21 torque with a spanner
const SPAN_K: OrbitKey = { f: 0, az: 235, el: 42, dist: 0.95, target: [0.15, 0.03, 0.0], pp: [470, 470] };
const TSC = 0.012; // τ arrow: display metres per newton metre (its own scale; the value is written)
const S20: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20_torque");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9);
  const st = camOf([SPAN_K], f), pr = projector(st, W3, H3);
  const al = [torque.alpha_deg[0], torque.alpha_deg[1], torque.alpha_deg[2]];
  const aNow = lerpA(f, [[t7 - 4, al[0]], [t7 + 20, al[1]], [t9 - 4, al[1]], [t9 + 20, al[2]]]);
  const tauNow = interpA(aNow, al.slice().reverse(), torque.tau_z.slice().reverse());
  const grip: V3 = [0.3, 0, 0.022];
  const L = 0.16;
  const Fv: V3 = [L * Math.cos(aNow * D2R), L * Math.sin(aNow * D2R), 0];
  // S5 ghost at 30°: its along (slate) and across (violet) parts, the s18b picture on the spanner
  const g30 = fin(f, t4, 12) * fout(f, t5 + 10, 12);
  const F30: V3 = [L * Math.cos(30 * D2R), L * Math.sin(30 * D2R), 0];
  const bands = f >= t7 + 20 && f < t9 ? 1 : 0;
  const Fd = torque.F_display as number[][];
  const Flab = aNow > 60 ? Fd[0] : aNow > 10 ? Fd[1] : Fd[2];
  const tauLab = Math.abs(tauNow - 15) < 0.05 ? "15" : Math.abs(tauNow - 7.5) < 0.05 ? "7.5" : tauNow.toFixed(1);
  return (
    <Scene>
      <View3D st={st} o={fin(f, t2, 12)}>
        <Spanner3D angle={0} />
        <Arrow3D from={[0, 0, 0.022]} to={grip} color={C.first} grow={fin(f, t3, 16)} />
        <Arrow3D from={grip} to={add3(grip, Fv)} color={C.second} grow={fin(f, AT(k, 3, "an arrow, F"), 16)} />
        <Arrow3D from={grip} to={add3(grip, F30)} color={C.second} o={0.45 * g30} dash />
        {Math.abs(tauNow) > 0.05 ? <Arrow3D from={[0, 0, 0.03]} to={[0, 0, 0.03 + tauNow * TSC * fin(f, AT(k, 6, "fifteen newton metres"), 20)]} color={ROT} px={14} head={44} /> : null}
      </View3D>
      <Svg>
        <Seg3 pr={pr} a={grip} b={add3(grip, [F30[0], 0, 0])} c={C.local} w={18} o={0.75 * Math.max(g30, bands)} />
        <Seg3 pr={pr} a={add3(grip, [F30[0], 0, 0])} b={add3(grip, F30)} c={ROT} w={18} o={0.75 * Math.max(g30, bands)} />
        <L3 pr={pr} at={add3(grip, [F30[0] / 2, 0, 0])} t={bands ? "along ≈ 43.3 N" : "pulls"} c={C.local} s={T.key} dy={60} o={Math.max(g30, bands)} />
        <L3 pr={pr} at={add3(grip, [F30[0], F30[1] / 2, 0])} t={bands ? "across = 25 N" : "turns"} c={ROT} s={T.key} a="start" dx={30} o={Math.max(g30, bands)} />
        <L3 pr={pr} at={[0.13, 0, 0.022]} t="r = (0.3, 0, 0) m" c={C.first} s={T.key} dy={78} o={fin(f, AT(k, 3, "zero point three"))} />
        <TipL3 pr={pr} from={grip} to={add3(grip, Fv)} t={`F = (${Flab[0]}, ${Flab[1]}, 0) N`} c={C.second} s={T.key} o={fin(f, AT(k, 3, "fifty newtons"))} gap={30} />
        <Lbl x={120} y={830} t="N = newton" c={C.muted} s={T.floor} o={fin(f, AT(k, 3, "fifty newtons") + 10) * fout(f, t6)} />
        <Lbl x={120} y={830} t="N m = newton metre" c={C.muted} s={T.floor} o={fin(f, AT(k, 6, "newton metres")) * fout(f, t9)} />
        {aNow < 89 && aNow > 1 ? <Arc3 pr={pr} c0={grip} e1={[1, 0, 0]} e2={[0, 1, 0]} r={0.09} a0={0} a1={aNow} col={C.gold} head={false} /> : null}
        <L3 pr={pr} at={add3(grip, [0.15 * Math.cos(12 * D2R), 0.15 * Math.sin(12 * D2R), 0])} t="30°" c={C.gold} s={T.key} a="start" dx={10} o={fin(f, t7 + 20) * fout(f, t9)} />
        {Math.abs(tauNow) > 0.05 ? <L3 pr={pr} at={[0, 0, 0.03 + tauNow * TSC]} t={`τ = (0, 0, ${tauLab}) N m`} c={ROT} s={T.key} dx={60} a="start" o={fin(f, AT(k, 6, "fifteen newton metres") + 10)} /> : null}
        <Keyword f={f} text="only the part across turns" at={[1150, 250]} appear={t1} out={t2 + 20} targets={[]} />
        <Keyword f={f} text="torque" at={[1200, 260]} appear={AT(k, 5, "called torque")} targets={[]} />
        <Keyword f={f} text="no turn" at={[1500, 800]} appear={AT(k, 9, "the bolt doesn't turn")} targets={[]} />
      </Svg>
      <TeX s={EQ_TAU} x={1080} y={140} size={T.eq} o={fin(f, AT(k, 5, "tau equals"))} />
      <CalcStack f={f} x={1230} y={340} size={60} maxLines={4} rows={[
        { lhs: splitEq(EQ_T15)[0], rhs: rep(splitEq(EQ_T15)[1], "15", String.raw`\mathbf{15}`), at: AT(k, 6, "zero point three times fifty"), h: 100, c: C.key },
        { lhs: splitEq(EQ_ACRF)[0], rhs: splitEq(EQ_ACRF)[1], at: AT(k, 7, "fifty times sine thirty"), h: 100, lc: ROT },
        { lhs: splitEq(EQ_T75)[0], rhs: rep(splitEq(EQ_T75)[1], "7.5", String.raw`\mathbf{7.5}`), at: AT(k, 8, "seven point five"), h: 100, c: C.key },
        { lhs: String.raw`|\boldsymbol\tau|`, rhs: "= 0", at: AT(k, 9, "nothing is across"), h: 100 },
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
  const t1 = SS(k, 1), t2 = SS(k, 2), tUp = SS(k, 3), t4 = SS(k, 4);
  const st = camOf([{ ...SPAN_K, dist: 1.2, target: [0.12, 0.03, 0.05] }], f), pr = projector(st, W3, H3);
  const loosen = f >= tUp && f < t4;
  const turnT = -0.5 * easeIO(clamp((f - t1 - 10) / (tUp - t1 - 20), 0, 1));
  const turnL = 0.5 * easeIO(clamp((f - tUp) / (SE(k, 3) - tUp), 0, 1));
  const turnT2 = -0.5 * easeIO(clamp((f - t4) / 40, 0, 1));
  const ang = turnT + turnL + turnT2;
  const sink = -0.006 * 3 * (ang / (Math.PI / 6)) * 0.33;
  const c = Math.cos(ang), s = Math.sin(ang);
  const grip: V3 = [0.3 * c, 0.3 * s, 0.022 - sink];
  const tau = (loosen ? torque.loosen[2] : torque.tighten[2]) as number;
  const Fd: V3 = loosen ? [-s * 0.16, c * 0.16, 0] : [s * 0.16, -c * 0.16, 0];
  const hb = loosen ? handPlace([c, s, 0], [0, 0, 1], 0.12, 0.6) : handPlace([c, s, 0], [0, 0, -1], 0.12, -0.2);
  const handO = fin(f, t1, 12) * fout(f, t4 + 20, 12);
  const curl = 0.3 + 0.6 * easeIO(clamp((f - t1 - 6) / 30, 0, 1));
  return (
    <Scene>
      <View3D st={st}>
        <Spanner3D angle={ang} sink={-sink} />
        <Arrow3D from={[0, 0, 0.022 - sink]} to={grip} color={C.first} />
        <Arrow3D from={grip} to={add3(grip, Fd)} color={C.second} />
        <Arrow3D from={[0, 0, 0.03]} to={[0, 0, 0.03 + tau * TSC]} color={ROT} px={14} head={44} dash={tau < 0} />
        <Hand3D q={hb.q} at={add3(hb.at, [0, 0, loosen ? 0.03 : 0.16])} s={0.12} angles={POSE.curl(curl)} o={handO} glow={{ thumb: ROT }} glowK={fin(f, t2, 10)} />
      </View3D>
      <Svg>
        <TipL3 pr={pr} from={[0, 0, 0.022]} to={grip} t="r = (0.3, 0, 0) m" c={C.first} s={T.key} side={-50} />
        <TipL3 pr={pr} from={grip} to={add3(grip, Fd)} t={loosen ? "F = (0, 50, 0) N" : "F = (0, −50, 0) N"} c={C.second} s={T.key} />
        <L3 pr={pr} at={[0, 0, 0.03 + tau * TSC]} t={tau < 0 ? "τ = (0, 0, −15) N m" : "τ = (0, 0, 15) N m"} c={ROT} s={T.key} dx={40} dy={-40} a="start" />
        {tau < 0 ? <MinusGlyph x={pr.p([0, 0, 0.03 + tau * TSC * 0.5])[0] - 50} y={pr.p([0, 0, 0.03 + tau * TSC * 0.5])[1]} /> : null}
        <Keyword f={f} text="along the axis" at={[1080, 160]} appear={AT(k, 0, "along the bolt's axis")} out={t4 - 6} targets={[]} />
        <Keyword f={f} text="which way? right hand" at={[1080, 280]} appear={AT(k, 0, "right-hand rule")} out={t4 - 6} targets={[]} />
        <Keyword f={f} text="curl: r → F" at={[1080, 390]} appear={AT(k, 1, "Curl your fingers")} out={t4 - 6} targets={[]} />
        <Keyword f={f} text="thumb down: tightens" at={[1080, 500]} appear={AT(k, 2, "the bolt tightens")} out={t4 - 6} targets={[]} />
        <Keyword f={f} text="thumb up: loosens" at={[1080, 600]} appear={AT(k, 3, "the bolt loosens")} out={t4 - 6} targets={[]} />
        <g opacity={fin(f, t2) * fout(f, tUp - 4)}>
          <polygon points={Array.from({ length: 6 }, (_, i) => `${230 + 70 * Math.cos((i * Math.PI) / 3)},${650 + 70 * Math.sin((i * Math.PI) / 3)}`).join(" ")} fill="#3a4766" stroke="#c9d2e3" strokeWidth={4} />
          <path d="M 340 650 A 110 110 0 0 1 230 760" fill="none" stroke={C.gold} strokeWidth={6} />
          <polyline points="250,746 230,760 252,774" fill="none" stroke={C.gold} strokeWidth={6} />
          <CircleCross x={230} y={650} r={30} w={5} />
          <Lbl x={110} y={830} t="clockwise · from above" c={C.key} s={T.floor} a="start" />
        </g>
        <g opacity={fin(f, tUp) * fout(f, t4 - 4)}>
          <polygon points={Array.from({ length: 6 }, (_, i) => `${230 + 70 * Math.cos((i * Math.PI) / 3)},${650 + 70 * Math.sin((i * Math.PI) / 3)}`).join(" ")} fill="#3a4766" stroke="#c9d2e3" strokeWidth={4} />
          <path d="M 230 760 A 110 110 0 0 0 340 650" fill="none" stroke={C.gold} strokeWidth={6} />
          <polyline points="326,670 340,650 354,672" fill="none" stroke={C.gold} strokeWidth={6} />
          <CircleDot x={230} y={650} r={30} w={5} />
          <Lbl x={110} y={830} t="anticlockwise · from above" c={C.key} s={T.floor} a="start" />
        </g>
        <Keyword f={f} text="how strongly" at={[1080, 620]} appear={AT(k, 4, "how strongly")} targets={[]} />
        <Keyword f={f} text="which way" at={[1080, 720]} appear={AT(k, 4, "and which way")} targets={[]} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s22 the door again
const S22: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22_door_again");
  const t2 = SS(k, 2), t3 = SS(k, 3), tDown = AT(k, 2, "and down when"), tAlong = AT(k, 1, "a push along the door");
  const open = 45 * D2R * easeIO(clamp((f - AT(k, 1, "the largest torque")) / 24, 0, 1));
  const close = 45 * D2R * easeIO(clamp((f - tDown) / 24, 0, 1));
  const sw = open - close;
  const along = f >= tAlong && f < t2 + 10, back = f >= tDown - 6;
  const tauV = back ? 1 : along ? 1 - fin(f, tAlong + 10, 14) : fin(f, SS(k, 1) + 10, 14);
  const st = orbitCam(DOOR_K, PP), pr = projector(st, W3, H3);
  return (
    <Scene>
      <DoorScene f={f} swing={sw} showR={1} showF={1} Fdir={back ? "back" : along ? "along" : "perp"} tau={tauV * Math.abs(door.tau_z[back ? 2 : 0])} tauNeg={back}
        over={<>
          <L3 pr={pr} at={[0, 0, back ? 2.15 - 0.55 * tauV * Math.abs(door.tau_z[2]) : 2.05 + 0.6 * tauV * Math.abs(door.tau_z[0])]} t={back ? "τ down" : "τ up"} c={ROT} s={T.key} a="end" dx={-40} o={tauV} />
          <MinusGlyph x={pr.p([0, 0, 1.85])[0] - 50} y={pr.p([0, 0, 1.85])[1]} o={back ? 1 : 0} />
        </>} />
      <TeX s={EQ_TAU} x={1100} y={140} size={T.eq} o={fin(f, 8)} />
      <Svg>
        <Lbl x={1100} y={280} t="largest" c={ROT} s={T.key} o={fin(f, AT(k, 1, "the largest torque")) * fout(f, t2)} />
        <Lbl x={1100} y={370} t="r × F = 0" c={C.key} s={T.key} o={fin(f, AT(k, 1, "gives none")) * fout(f, t2 + 20)} />
        <Lbl x={1100} y={300} t="up · opens" c={C.key} s={T.key} o={fin(f, AT(k, 2, "up when"))} />
        <Lbl x={1100} y={390} t="down · closes" c={C.key} s={T.key} o={fin(f, tDown + 10)} />
        <g opacity={fin(f, AT(k, 3, "largest at right angles"))}><Check x={1110} y={560} /><Lbl x={1160} y={560} t="largest at right angles" c={C.key} s={T.key} /></g>
        <g opacity={fin(f, AT(k, 3, "tells left from right"))}><Check x={1110} y={660} /><Lbl x={1160} y={660} t="left or right" c={C.key} s={T.key} /></g>
      </Svg>
    </Scene>
  );
};

// ================================================================ s22a the plane and its normal
const S22A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22a_plane_normal");
  const t1 = SS(k, 1), tOut = AT(k, 1, "sticking straight out"), t2 = SS(k, 2), tSweep = AT(k, 2, "sweep"), t3 = SS(k, 3), tNorm = AT(k, 3, "the normal"), t4 = SS(k, 4), t5 = SS(k, 5);
  const t6 = SS(k, 6), t7 = SS(k, 7);
  const cut = fin(f, t2, 20);
  const stS = camOf([SPAN_K], f), prS = projector(stS, W3, H3);
  const grip: V3 = [0.3, 0, 0.022], Fv: V3 = [0, 0.16, 0];
  const st = camOf([{ ...FLOOR_K, f: 0, az: 250, el: 32, dist: 17, target: [2.4, 1.4, 1.2], pp: [520, 420] }, { ...FLOOR_K, f: t3, az: 250, el: 32, dist: 17, target: [2.4, 1.4, 1.2], pp: [520, 420] },
    { ...FLOOR_K, f: t3 + 60, az: 310, el: 22, dist: 17.5, target: [2.4, 1.4, 1.4], pp: [520, 420] }], f);
  const pr = projector(st, W3, H3);
  const sweep = easeIO(clamp((f - tSweep) / 40, 0, 1));
  const flip = fin(f, AT(k, 6, "up means"), 20) * fout(f, t7 - 10, 16);
  const flag = fin(f, t7, 16);
  const ctr: V3 = [3, 2, 0];
  return (
    <Scene>
      {cut < 1 ? <div style={{ opacity: 1 - cut }}>
        <View3D st={stS}>
          <Spanner3D angle={0} />
          <Arrow3D from={[0, 0, 0.022]} to={grip} color={C.first} />
          <Arrow3D from={grip} to={add3(grip, Fv)} color={C.second} />
          <Quad3D pts={[[-0.05, -0.08, 0.02], [0.36, -0.08, 0.02], [0.36, 0.19, 0.02], [-0.05, 0.19, 0.02]]} color={C.key} o={0.2 * fin(f, t1)} />
        </View3D>
        <Svg>
          <Seg3 pr={prS} a={[0, 0, -0.05]} b={[0, 0, 0.25]} c={C.gold} w={5} dash="14 10" o={fin(f, tOut)} />
          <Tick3 pr={prS} at={[0, 0, 0.022]} u1={[1, 0, 0]} u2={[0, 0, 1]} s={0.05} o={fin(f, tOut + 6)} />
          <TipL3 pr={prS} from={[0, 0, 0.022]} to={grip} t="r" c={C.first} s={T.calc} side={-50} />
          <TipL3 pr={prS} from={grip} to={add3(grip, Fv)} t="F" c={C.second} s={T.calc} />
          <L3 pr={prS} at={[0.4, 0.2, 0.02]} t="plane of r and F" c={C.key} s={T.key} a="start" o={fin(f, AT(k, 1, "the plane of r and F"))} />
          <L3 pr={prS} at={[0, 0, 0.25]} t="axis" c={C.gold} s={T.key} dx={40} a="start" o={fin(f, tOut)} />
        </Svg>
      </div> : null}
      {cut > 0 ? <div style={{ opacity: cut }}>
        <PairFloor st={st} axb={fin(f, tNorm, 20) * (1 - flag)} para={1.2} axbNeg={flip > 0.5}
          children={<>
            <Quad3D pts={[[-0.5, -0.5, 0.002], [6.5, -0.5, 0.002], [6.5, 4.5, 0.002], [-0.5, 4.5, 0.002]]} color={C.key} o={0.12} />
            <Arrow3D from={B3} to={add3(B3, A3)} color={C.first} o={0.6 * fin(f, tSweep)} grow={sweep} dash />
            {flag > 0 ? <Rod3D a={ctr} b={add3(ctr, [0, 0, 2.2])} px={5} color={ROT} o={flag} /> : null}
            {flag > 0 ? <Quad3D pts={[add3(ctr, [0, 0, 2.2]), add3(ctr, [0.9, 0, 2.0]), add3(ctr, [0, 0, 1.8])]} color={ROT} o={0.9 * flag} /> : null}
          </>}
          over={<>
            <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
            <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
            <TipL3 pr={pr} from={[0, 0, 0]} to={flip > 0.5 ? [0, 0, -AXB3[2]] : AXB3} t={flip > 0.5 ? "b × a = (0, 0, −14)" : "a × b = (0, 0, 14)"} c={ROT} s={T.key} o={fin(f, tNorm + 10) * (1 - flag)} />
            <Keyword f={f} text="normal" at={[140, 260]} appear={tNorm} out={t5} targets={[pr.p([0, 0, AXB3[2] * 0.7])]} />
            <Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={1.8} a0={flip > 0.5 ? ANG_B : ANG_A} a1={flip > 0.5 ? ANG_A : ANG_B} col={C.gold} o={fin(f, t6)} />
            <Bracket3 pr={pr} h={AXB3[2]} o={fin(f, t5) * (1 - flag) * (1 - flip)} />
            <L3 pr={pr} at={add3(ctr, [0.5, 0, 2.0])} t="14" c={C.key} s={T.key} a="start" dx={20} o={flag} />
            <L3 pr={pr} at={ctr} t="area 14" c={ROT} s={T.key} dy={70} o={fin(f, t5)} />
          </>} />
      </div> : null}
      <Svg>
        <Keyword f={f} text="length → how much" at={[1100, 380]} appear={t5} targets={[]} />
        <Keyword f={f} text="direction → which plane, which way" at={[1080, 470]} appear={t6} targets={[]} s={T.floor} />
        <Lbl x={1100} y={570} t="up = anticlockwise from above" c={C.gold} s={T.key} o={fin(f, AT(k, 6, "anticlockwise"))} />
        <Keyword f={f} text="a label for the patch" at={[1100, 700]} appear={AT(k, 7, "like a label")} targets={[]} />
        <g opacity={fin(f, t7)}><Check x={1140} y={800} /><Lbl x={1200} y={800} t="area, but an arrow ?" c={C.key} s={T.key} /></g>
      </Svg>
      <TeX s={EQ_AREA14} x={1100} y={160} size={T.calc} o={fin(f, AT(k, 5, "the area"))} />
    </Scene>
  );
};

// ================================================================ s22b each component is a shadow area
const SH_O: V3 = [1.6, 1.4, 1.6];
const S22B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22b_component_shadows");
  const t1 = SS(k, 1), tSh = AT(k, 1, "shadows"), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const st = camOf([{ f: 0, az: 40, el: 28, dist: 17, target: [2.2, 1.6, 1.2], pp: [520, 400] }], f), pr = projector(st, W3, H3);
  const sh = pair.shadows as { a: number[]; b: number[] };
  const low = easeIO(clamp((f - t4) / 40, 0, 1));
  const ta = sh.a as V3, tb = sh.b as V3;
  const o0 = lerp3(SH_O, [0, 0, 0], low), av = lerp3(ta, A3, low), bv = lerp3(tb, B3, low);
  const quad = (pa: (v: V3) => V3): V3[] => [o0, add3(o0, av), add3(add3(o0, av), bv), add3(o0, bv)].map(pa);
  const toFloor = (v: V3): V3 => [v[0], v[1], 0.006], toYZ = (v: V3): V3 => [0.006, v[1], v[2]], toZX = (v: V3): V3 => [v[0], 0.006, v[2]];
  const nrm = cross3(av, bv);
  const nScale = 0.32;
  const shO = fin(f, tSh, 16);
  const wall = (p: V3[], o: number) => <Quad3D pts={p} color={C.local} o={0.16 * o} />;
  const pulseF = pulse(f, t2, 30), pulseW1 = pulse(f, t3, 24), pulseW2 = pulse(f, t3 + 24, 24);
  return (
    <Scene>
      <View3D st={st}>
        {wall([[0, 0, 0], [6.5, 0, 0], [6.5, 4.5, 0], [0, 4.5, 0]], 1)}
        {wall([[0, 0, 0], [0, 4.5, 0], [0, 4.5, 4], [0, 0, 4]], 1)}
        {wall([[0, 0, 0], [6.5, 0, 0], [6.5, 0, 4], [0, 0, 4]], 1)}
        <Quad3D pts={quad((v) => v)} color={ROT} o={0.3} />
        <Quad3D pts={quad(toFloor)} color={ROT} o={0.35 * shO * (1 + pulseF)} />
        <Quad3D pts={quad(toYZ)} color={ROT} o={0.35 * shO * (1 + pulseW1) * (1 - low)} />
        <Quad3D pts={quad(toZX)} color={ROT} o={0.35 * shO * (1 + pulseW2) * (1 - low)} />
        <Arrow3D from={o0} to={add3(o0, av)} color={C.first} />
        <Arrow3D from={o0} to={add3(o0, bv)} color={C.second} />
        <Arrow3D from={add3(o0, av, 0.5)} to={add3(add3(o0, av, 0.5), nrm, nScale * (1 - 0.8 * low))} color={ROT} px={12} head={40} o={fin(f, t1)} />
      </View3D>
      <Svg>
        <L3 pr={pr} at={[6.8, 0, 0]} t="x" c={C.muted} s={T.key} /><L3 pr={pr} at={[0, 4.8, 0]} t="y" c={C.muted} s={T.key} /><L3 pr={pr} at={[0, 0, 4.3]} t="z" c={C.muted} s={T.key} />
        <Poly3 pr={pr} pts={quad(toFloor)} c={ROT} w={3} o={shO} />
        <Poly3 pr={pr} pts={quad(toYZ)} c={ROT} w={3} o={shO * (1 - low)} />
        <Poly3 pr={pr} pts={quad(toZX)} c={ROT} w={3} o={shO * (1 - low)} />
        <Keyword f={f} text="x and y parts → z component" at={[1080, 330]} appear={t2} out={t4} targets={[]} />
        <Keyword f={f} text="y and z → x" at={[1080, 430]} appear={t3} out={t4} targets={[]} />
        <Keyword f={f} text="z and x → y" at={[1080, 520]} appear={t3 + 24} out={t4} targets={[]} />
        <Keyword f={f} text="edge on → 0" at={[1080, 430]} appear={AT(k, 4, "edge on")} targets={[]} />
        <CurvedLink f={f} from={pr.p([3, 2, 0])} to={[1560, 650]} start={AT(k, 5, "fourteen")} ctl={[1000, 760]} />
      </Svg>
      <PairTags o={fin(f, t4 + 30)} />
      <TeX s={EQ_COMP} x={1840} y={150} size={T.floor} ax={1} c={C.local} o={fin(f, 6)} glow={Math.max(pulseF, pulseW1, pulseW2)} />
      <TeX s={EQ_AXB14} x={1100} y={640} size={T.calc} o={fin(f, t5)} glow={pulse(f, t5 + 10, 30)} />
    </Scene>
  );
};

// ================================================================ s22c angular momentum
const S22C: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22c_angular_momentum");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const AM = examples.angular_momentum as { r: number[]; p: number[]; L: number[] };
  const N = Math.max(1, Math.floor((t2 - t1) / 60));
  const ang = 2 * Math.PI * N * clamp((f - t1) / (t2 - t1), 0, 1) + (f > t7 ? (2 * Math.PI * (f - t7)) / 60 : 0);
  const R = 0.5;
  const ball: V3 = [R * Math.cos(ang), R * Math.sin(ang), 0];
  const tng: V3 = [-Math.sin(ang), Math.cos(ang), 0];
  const PS = 0.05;   // display metres per kg m/s
  const LS = 0.12;   // display metres per kg m²/s
  const st = camOf([{ f: 0, az: 240, el: 35, dist: 2.5, target: [0.1, 0, 0.2], pp: [600, 400] }], f), pr = projector(st, W3, H3);
  const disc = Array.from({ length: 49 }, (_, i) => [R * Math.cos((i / 48) * 2 * Math.PI), R * Math.sin((i / 48) * 2 * Math.PI), 0] as V3);
  const [LL, LR] = splitEq(EQ_L), LP = eqPieces(LR);
  const paused = f >= t2 && f < t7;
  return (
    <Scene>
      <Svg><Poly3 pr={pr} pts={disc} c={C.muted} w={3} dash="10 8" o={fin(f, t1)} /></Svg>
      <View3D st={st}>
        <Rod3D a={[0, 0, 0]} b={ball} px={3} color={C.ink} o={fin(f, t1)} />
        <Ball3D at={ball} px={34} color={C.second} o={fin(f, t1)} />
        <Ball3D at={[0, 0, 0]} px={14} color={C.ink} />
        <Arrow3D from={[0, 0, 0]} to={ball} color={C.first} o={fin(f, t2)} grow={fin(f, t2, 14)} />
        <Arrow3D from={ball} to={add3(ball, tng, 6 * PS)} color={C.second} o={fin(f, t3)} grow={fin(f, t3, 14)} />
        <Arrow3D from={[0, 0, 0]} to={[0, 0, 3 * LS]} color={ROT} px={14} head={44} grow={fin(f, t5, 20)} />
        <Arrow3D from={ball} to={add3(ball, ball, -0.5)} color={C.neg} px={8} head={30} o={fin(f, t7)} />
      </View3D>
      <Svg>
        <TipL3 pr={pr} from={[0, 0, 0]} to={ball} t={paused ? "r = (0.5, 0, 0) m" : "r"} c={C.first} s={T.key} o={fin(f, t2)} side={50} />
        <TipL3 pr={pr} from={ball} to={add3(ball, tng, 6 * PS)} t={paused ? "p = (0, 6, 0) kg m/s" : "p"} c={C.second} s={T.key} o={fin(f, t3)} />
        <L3 pr={pr} at={[0, 0, 3 * LS]} t="L = (0, 0, 3) kg m²/s" c={ROT} s={T.key} a="middle" dy={-110} o={fin(f, AT(k, 6, "which is three"))} />
        <Arc3 pr={pr} c0={[0, 0, 0.02]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={0.58} a0={20} a1={300} col={C.gold} o={fin(f, AT(k, 6, "anticlockwise"))} />
        <L3 pr={pr} at={add3(ball, ball, -0.55)} t="string pulls along r" c={C.neg} s={T.floor} a="middle" dy={60} o={fin(f, t7)} />
        <Keyword f={f} text="many places" at={[1100, 140]} appear={AT(k, 0, "many places")} out={t2} targets={[]} />
        <Keyword f={f} text="momentum = mass × velocity" at={[1100, 140]} appear={AT(k, 3, "its mass times its velocity")} out={t5} targets={[]} />
        <Keyword f={f} text="angular momentum" at={[1100, 140]} appear={AT(k, 5, "the angular momentum")} targets={[]} s={T.calc} />
        <Keyword f={f} text="anticlockwise → up" at={[1100, 640]} appear={AT(k, 6, "anticlockwise")} out={t7} targets={[]} />
        <Keyword f={f} text="along r: no part across" at={[1100, 640]} appear={AT(k, 7, "no part across r")} targets={[]} />
      </Svg>
      <TeX s={EQ_P6} x={1080} y={300} size={T.key} o={fin(f, AT(k, 4, "a momentum of six"))} />
      <CalcStack f={f} x={1240} y={400} size={56} rows={[
        { lhs: LL, rhs: LP[0], at: t6, h: 90 },
        { rhs: LP[1], at: AT(k, 6, "which is three"), cont: true, c: C.key, h: 90 },
      ]} />
    </Scene>
  );
};

// ================================================================ s22d the push on a moving charge
const S22D: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22d_moving_charge");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const ch = examples.charge as { circle_xy: number[][]; circle_uv: number[][] };
  const RS = 1.3;
  const enter = clamp(f / Math.max(1, t1 - 10), 0, 1);
  const circ = clamp((f - t5) / (SE(k, 7) - t5), 0, 1);
  const xy = idx(ch.circle_xy, circ), uv = idx(ch.circle_uv, circ);
  const pos: V3 = circ > 0 ? [xy[0] * RS, xy[1] * RS, 0.6] : [-1.5 + 1.5 * easeIO(enter), 0, 0.6];
  const v: V3 = circ > 0 ? [uv[0], uv[1], 0] : [1, 0, 0];
  const push: V3 = [v[1], -v[0], 0];   // v × B with B up
  const st = camOf([{ f: 0, az: 235, el: 34, dist: 7.5, target: [0.1, -1.0, 0.6], pp: [520, 360] }], f), pr = projector(st, W3, H3);
  const ring = Array.from({ length: 61 }, (_, i) => [RS * Math.sin((i / 60) * 2 * Math.PI), RS * (Math.cos((i / 60) * 2 * Math.PI) - 1), 0.6] as V3);
  const QP: Part[] = [{ t: String.raw`\mathbf F` }, { t: "=" }, { t: "q", u: { w: String.raw`\text{charge}`, c: C.key } }, { t: String.raw`\,\mathbf v`, c: C.first, u: { w: String.raw`\text{velocity}`, c: C.first } },
    { t: String.raw`\times` }, { t: String.raw`\mathbf B`, c: ROT, u: { w: String.raw`\text{field}`, c: ROT } }];
  if (plainOf(QP).replace(/\s/g, "") !== EQ_QVB.replace(/\s/g, "")) throw new Error("s22d parts ≠ EQ_QVB");
  return (
    <Scene>
      <Svg>
        <FloorGrid pr={pr} xr={[-3, 3]} yr={[-3, 1]} o={0.5} />
        <Poly3 pr={pr} pts={ring} c={C.gold} w={4} dash="12 10" o={0.7 * fin(f, t6)} />
      </Svg>
      <View3D st={st}>
        {[[-2, -2], [-2, 0.6], [1.5, -2.5], [1.8, 0.4], [-0.6, -2.8], [0.4, 0.8]].map(([x, y], i) => <Arrow3D key={i} from={[x, y, 0]} to={[x, y, 1.6]} color={ROT} px={4} head={22} o={0.55 * fin(f, t1)} />)}
        <Ball3D at={pos} px={30} color={C.key} />
        <Arrow3D from={pos} to={add3(pos, v, 1.1)} color={C.first} o={fin(f, t1)} />
        <Arrow3D from={pos} to={add3(pos, push, 0.9)} color={C.second} o={fin(f, AT(k, 3, "a push towards the south"))} />
      </View3D>
      <Svg>
        <L3 pr={pr} at={pos} t="+" c={C.bg} s={T.key} dy={4} />
        <TipL3 pr={pr} from={pos} to={add3(pos, v, 1.1)} t="v" c={C.first} s={T.calc} o={fin(f, t1)} />
        <L3 pr={pr} at={[1.8, 0.4, 1.6]} t="B" c={ROT} s={T.calc} dx={30} a="start" o={fin(f, t1)} />
        <TipL3 pr={pr} from={pos} to={add3(pos, push, 0.9)} t="push" c={C.second} s={T.key} o={fin(f, AT(k, 3, "a push towards the south"))} />
        <Tick3 pr={pr} at={pos} u1={norm3(v)} u2={norm3(push)} s={0.3} o={fin(f, t4)} />
        <L3 pr={pr} at={[3.2, 0, 0]} t="east" c={C.muted} s={T.key} /><L3 pr={pr} at={[0, 1.4, 0]} t="north" c={C.muted} s={T.key} />
        <Keyword f={f} text="proton" at={[pr.p(pos)[0] - 60, pr.p(pos)[1] + 90]} appear={AT(k, 0, "like a proton")} out={t1 + 30} targets={[]} />
        <Keyword f={f} text="east × up = south" at={[1100, 470]} appear={AT(k, 3, "a push towards the south")} out={t5} targets={[]} />
        <Lbl x={1100} y={560} t="speed: constant" c={C.key} s={T.key} o={fin(f, t5)} />
        <Lbl x={1100} y={650} t="clockwise · from above" c={C.key} s={T.floor} o={fin(f, t6)} />
        <Keyword f={f} text="particle accelerator" at={[1100, 760]} appear={AT(k, 7, "particle accelerators")} targets={[]} />
      </Svg>
      <Layered parts={QP} layers={[{ t: "all", o: 1 }, { u: [2, 3, 5], o: fin(f, t2 + 20) }]} x={1100} y={110} size={T.eq} ay={0} o={fin(f, t2)} />
      <TeX s={EQ_XZ} x={1100} y={380} size={T.calc} o={fin(f, AT(k, 3, "x hat cross z hat"))} />
    </Scene>
  );
};

// ================================================================ s22e why a push at right angles only turns (kicks)
const KP = { x: 130, y: 620, s: 72 };   // parcel at (130, 620), 72 px per m/s
const S22E: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22e_perp_push");
  const t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10);
  const KK = examples.kicks as unknown as Record<string, { speed: number; turn_deg: number; tips: number[][] }> & { circle_xy_km: number[][]; circle_uv: number[][] };
  const V = (v: number[]): Pt => [KP.x + v[0] * KP.s, KP.y - v[1] * KP.s];
  const one = KK["1"].tips, ten = KK["10"].tips, hun = KK["100"].tips;
  const n10 = Math.round(clamp((f - t6) / 60, 0, 1) * 10), n100 = Math.round(clamp((f - t8) / 40, 0, 1) * 100);
  const kickO = fin(f, t3) * fout(f, t6 - 6);
  const circ = fin(f, t9, 16);
  const ph = clamp((f - t9 - 10) / (SE(k, 10) - t9 - 20), 0, 1);
  const cxy = KK.circle_xy_km, cuv = KK.circle_uv;
  const C0: Pt = [540, 450], R = 230, Rk = 100;    // circle radius 100 km drawn as 230 px
  const pq = idx(cxy, ph), uq = idx(cuv, ph);
  const pp: Pt = [C0[0] + (pq[0] / Rk) * R, C0[1] - ((pq[1] - Rk) / Rk) * R];
  const trace = Array.from({ length: Math.max(2, Math.round(ph * (cxy.length - 1)) + 1) }, (_, i) => [C0[0] + (cxy[i][0] / Rk) * R, C0[1] - ((cxy[i][1] - Rk) / Rk) * R].join(",")).join(" ");
  const diag = 1 - circ;
  return (
    <Scene>
      <Svg>
        <g opacity={diag}>
          <Grid P={mkP(KP.x, KP.y, KP.s)} xr={[0, 13]} yr={[-1, 3]} o={0.6} />
          <Lbl x={KP.x + 13 * KP.s + 10} y={KP.y + 40} t="east" c={C.muted} s={T.key} a="end" />
          <Lbl x={KP.x + 20} y={KP.y - 3 * KP.s - 20} t="north" c={C.muted} s={T.key} />
          <Arrow p={[KP.x, KP.y]} q={V([10, 0])} color={C.first} o={fin(f, t2) * (f < t4 ? 1 : 0.35)} />
          <Lbl x={V([10, 0])[0] + 20} y={V([10, 0])[1] + 50} t="u = (10, 0) m/s" c={C.first} s={T.key} a="start" o={fin(f, t2) * fout(f, t4 + 20)} />
          <Arrow p={V([10, 0])} q={V(one[1])} color={C.second} w={8} head={28} o={kickO} />
          <Lbl x={V(one[1])[0] + 20} y={V(one[1])[1] - 20} t="kick = (0, 1) m/s" c={C.second} s={T.key} a="start" o={kickO} />
          <Arrow p={[KP.x, KP.y]} q={V(one[1])} color={C.first} o={fin(f, AT(k, 3, "towards the north") + 10) * fout(f, t6 - 6)} />
          <Lbl x={V(one[1])[0] - 30} y={V(one[1])[1] - 70} t="u = (10, 1) m/s" c={C.first} s={T.key} a="end" o={fin(f, AT(k, 3, "towards the north") + 10) * fout(f, t6 - 6)} />
          <Arc P={(x, y) => [KP.x + x, KP.y - y]} a0={0} a1={5.71} r={300} c={C.gold} w={5} o={fin(f, t5)} />
          <Lbl x={KP.x + 320} y={KP.y - 50} t="≈ 5.7°" c={C.gold} s={T.key} o={fin(f, t5)} />
          <Keyword f={f} text="faster" at={[V(one[1])[0] - 30, V(one[1])[1] - 150]} a="end" appear={AT(k, 5, "sped up a little")} out={t6} targets={[]} c={C.neg} />
          {n10 > 0 ? <polyline points={ten.slice(0, n10 + 1).map((v) => V(v).join(",")).join(" ")} fill="none" stroke={C.second} strokeWidth={6} opacity={fout(f, t8 - 6)} /> : null}
          {n10 > 0 ? <Arrow p={[KP.x, KP.y]} q={V(ten[n10])} color={C.first} o={fout(f, t8 - 6)} /> : null}
          {n100 > 0 ? <polyline points={hun.slice(0, n100 + 1).map((v) => V(v).join(",")).join(" ")} fill="none" stroke={C.second} strokeWidth={5} /> : null}
          {n100 > 0 ? <Arrow p={[KP.x, KP.y]} q={V(hun[n100])} color={C.first} /> : null}
          <Lbl x={KP.x + 20} y={KP.y + 100} t="kicks ⟂ the current direction" c={C.second} s={T.floor} o={fin(f, t6) * fout(f, t9)} />
        </g>
        <g opacity={circ}>
          <polyline points={trace} fill="none" stroke={C.gold} strokeWidth={5} />
          <Arrow p={pp} q={[pp[0] + uq[0] * 13, pp[1] - uq[1] * 13]} color={C.first} />
          <Arrow p={pp} q={[pp[0] + (-uq[1]) * 9, pp[1] - uq[0] * 9]} color={C.second} w={8} head={30} />
          <RightTick at={pp} u1={unit(pp, [pp[0] + uq[0], pp[1] - uq[1]])} u2={unit(pp, [pp[0] - uq[1], pp[1] - uq[0]])} c={C.gold} o={fin(f, t10)} />
          <circle cx={pp[0]} cy={pp[1]} r={11} fill={C.key} stroke={C.bg} strokeWidth={3} />
          <Lbl x={C0[0]} y={C0[1] + R + 90} t="speed 10.000 m/s" c={C.key} s={T.key} a="middle" />
          <Lbl x={C0[0]} y={C0[1] + R + 150} t="anticlockwise · from above" c={C.key} s={T.floor} a="middle" />
        </g>
        <g opacity={fin(f, t8) * fout(f, t9 + 20)}>
          {[{ h: 200, t: "0.05" }, { h: 20, t: "0.005" }, { h: 2, t: "0.0005" }].map((b, i) => <g key={i}>
            <rect x={1500 + i * 120} y={760 - b.h} width={70} height={b.h} fill={C.neg} opacity={0.8} />
            <Lbl x={1535 + i * 120} y={810} t={b.t} c={C.neg} s={T.floor} a="middle" />
          </g>)}
          <Lbl x={1500} y={500} t="extra speed (m/s)" c={C.neg} s={T.floor} />
        </g>
        <Keyword f={f} text="always at a right angle → circle" at={[1100, 600]} appear={t9} targets={[]} />
        <Keyword f={f} text="no work" at={[1100, 780]} appear={AT(k, 10, "does no work")} targets={[]} />
      </Svg>
      <CalcStack f={f} x={1120} y={130} size={44} maxLines={3} rows={[
        { lhs: splitEq(EQ_K1)[0], rhs: splitEq(EQ_K1)[1], at: t4, h: 110 },
        { lhs: "", rhs: EQ_K10, at: AT(k, 7, "ten point zero zero five"), h: 110 },
        { lhs: "", rhs: EQ_K100, at: AT(k, 8, "ten point zero zero zero five"), h: 110 },
      ]} o={fout(f, t9 + 20)} />
      <TeX s={EQ_PUSHU0} x={1100} y={700} size={T.calc} o={fin(f, t10)} />
    </Scene>
  );
};

// ================================================================ s23 k × : the turning tool
const MAP_K: OrbitKey = { f: 0, az: 240, el: 35, dist: 16, target: [0, 0.3, 0.4], pp: [480, 430] };
const US = 0.42; // map units per m/s (display)
const S23: React.FC = () => {
  const f = useCurrentFrame(), k = K("s23_k_cross");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), tN = AT(k, 5, "so it points north"), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9);
  const TOPV: OrbitKey = { ...MAP_K, az: 270, el: 89.9, dist: 17, target: [0, 0.2, 0], pp: [600, 430] };
  const st = camOf([at(MAP_K, 0), at(MAP_K, t6), { ...TOPV, f: t6 + 40 }], f);
  const pr = projector(st, W3, H3);
  const patch = useTex(staticFile("cp/bmng_s23.jpg"));
  const rot = 90 * easeIO(clamp((f - t7) / 24, 0, 1));
  const uA = rot * D2R;
  const u: V3 = [5 * US * Math.cos(uA), 5 * US * Math.sin(uA), 0];
  const kxu: V3 = [-u[1], u[0], 0];
  const gK = fin(f, t2 + 20, 16), gU = fin(f, t4, 16), gX = fin(f, t5 + 10, 16);
  const neg = fin(f, t9, 14);
  const axle = fin(f, t3, 14);
  const [KX_L, KX_R] = splitEq(EQ_KXU4), KXP = eqPieces(KX_R);
  const angU = rot, angK = rot + 90;
  const north = rot > 45;
  const pin = pr.p([0, 0, 0]);
  return (
    <Scene>
      <View3D st={st} o={patch ? 1 : 0}>
        {patch ? <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[6.4, 6.4]} />
          <meshBasicMaterial map={patch} transparent opacity={0.72} />
        </mesh> : null}
        <Rod3D a={[0, 0, 0]} b={[0, 0, 1.6]} px={12} color={C.gold} o={0.55 * axle} />
        <Arrow3D from={[0, 0, 0]} to={[0, 0, 1.6]} color={ROT} grow={gK} px={8} head={34} />
        <Arrow3D from={[0, 0, 0]} to={u} color={C.first} grow={gU} />
        <Arrow3D from={[0, 0, 0]} to={kxu} color={ROT} grow={gX} px={12} head={44} />
        <Arrow3D from={[0, 0, 0]} to={mul3(kxu, -1)} color={ROT} grow={neg} px={12} head={44} dash />
      </View3D>
      <Svg>
        <FloorGrid pr={pr} xr={[-3, 3]} yr={[-3, 3]} o={0.2} />
        <L3 pr={pr} at={[3.0, -2.4, 0]} t="east" c={C.key} s={T.key} />
        <L3 pr={pr} at={[-1.8, 3.2, 0]} t="north" c={C.key} s={T.key} />
        <Arc3 pr={pr} c0={[0, 0, 0.8]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={0.42} a0={-60} a1={200} col={C.gold} w={5} o={axle * fout(f, t6)} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={[0, 0, 1.6]} t="k = (0, 0, 1)" c={ROT} s={T.key} o={gK} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={u} t={north ? "u = (0, 5, 0) m/s" : "u = (5, 0, 0) m/s"} c={C.first} s={T.key} o={gU} />
        <L3 pr={pr} at={kxu} t={north ? "k × u = (−5, 0, 0)" : "k × u = (0, 5, 0)"} c={ROT} s={T.key} a={north ? "start" : "middle"} dx={north ? -30 : 0} dy={-56} o={gX} />
        <L3 pr={pr} at={mul3(kxu, -1)} t="−k × u = (5, 0, 0)" c={ROT} s={T.key} a="end" dx={30} dy={-56} o={neg} />
        <MinusGlyph x={pr.p(mul3(kxu, -0.6))[0]} y={pr.p(mul3(kxu, -0.6))[1] + 50} o={neg} />
        <Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={1.2} a0={angU} a1={angK} col={C.gold} draw={fin(f, tN, 20)} o={fout(f, t9 - 4)} />
        <L3 pr={pr} at={[1.65 * Math.cos((angU + 45) * D2R), 1.65 * Math.sin((angU + 45) * D2R), 0]} t="90° left" c={C.gold} s={T.key} o={fin(f, tN + 10) * fout(f, t8)} />
        <Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={1.2} a0={angU} a1={angU - 90} col={C.gold} draw={neg} />
        <L3 pr={pr} at={[1.65 * Math.cos((angU - 45) * D2R), 1.65 * Math.sin((angU - 45) * D2R), 0]} t="right" c={C.gold} s={T.key} o={neg} />
        <Keyword f={f} text="axis of turning" at={[1080, 650]} appear={t3} out={t5} targets={[pr.p([0.42, 0, 0.8])]} />
        <g opacity={fin(f, t6 + 30) * fout(f, t7 - 6)}>
          <Observer x={pin[0] - 70} y={pin[1] + 120} s={1.3} />
          <Arrow p={[pin[0] - 70, pin[1] + 78]} q={[pin[0] - 70, pin[1] - 10]} color={C.gold} w={6} head={24} />
          <Lbl x={pin[0] - 100} y={pin[1] + 170} t="facing downwind" c={C.key} s={T.floor} a="end" />
        </g>
        <Lbl x={1080} y={150} t="wind: u" c={C.first} s={T.calc} o={fin(f, AT(k, 1, "as u"))} />
        <Keyword f={f} text="up" at={[1080, 250]} appear={AT(k, 2, "straight up")} out={t4} targets={[]} />
        <Keyword f={f} text="left of an eastward wind = north" at={[1080, 250]} appear={AT(k, 6, "ninety degrees to its left")} out={t7} targets={[]} />
        <Keyword f={f} text="turning tool" at={[1080, 660]} appear={AT(k, 8, "turning tool")} targets={[]} />
        <Lbl x={1080} y={735} t="quarter turn left" c={C.key} s={T.key} o={fin(f, AT(k, 8, "a quarter turn"))} />
        <Lbl x={1080} y={810} t="anticlockwise · from above" c={C.gold} s={T.key} o={fin(f, AT(k, 8, "anticlockwise"))} />
      </Svg>
      <TeX s={EQ_U500} x={1080} y={360} size={T.calc} c={C.first} o={fin(f, t4) * fout(f, t7)} />
      <CalcStack f={f} x={1180} y={440} size={48} rows={[
        { lhs: KX_L, rhs: String.raw`= (0\times0 - 1\times0,`, at: t5, h: 76 },
        { rhs: String.raw`\ \ 1\times5 - 0\times0,`, at: t5 + 12, cont: true, h: 76 },
        { rhs: String.raw`\ \ 0\times0 - 0\times5)`, at: t5 + 24, cont: true, h: 76 },
        { rhs: KXP[1], at: tN - 6, cont: true, c: C.key, h: 84 },
      ]} o={fout(f, t7 - 6)} />
      <TeX s={String.raw`\mathbf u = (0,\ 5,\ 0)`} x={1080} y={360} size={T.calc} c={C.first} o={fin(f, t7 + 10) * fout(f, t8 - 10)} />
      <CalcStack f={f} x={1180} y={440} size={48} rows={[
        { lhs: KX_L, rhs: String.raw`= (0\times0 - 1\times5,\ 1\times0 - 0\times0,\ 0)`, at: t7 + 10, h: 84 },
        { rhs: String.raw`= (-5,\ 0,\ 0)`, at: AT(k, 7, "points west") - 6, cont: true, c: C.key, h: 84 },
      ]} o={fout(f, t8 - 10)} />
    </Scene>
  );
};

// ================================================================ s23a why exactly a quarter turn
const PZ = { x: 80, y: 60, w: 920, h: 780 };
const S23A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s23a_why_turn");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const c0: Pt = [400, 520], S = 56;               // pin; px per m/s
  const uT: Pt = [c0[0] + 5 * S, c0[1]];
  const why = turning.why90 as { push30: number[]; along: number; across: number };
  const pL = 160;
  const p30: Pt = [uT[0] + pL * why.push30[0], uT[1] - pL * why.push30[1]];
  const alongEnd: Pt = [uT[0] + pL * why.push30[0], uT[1]];
  const c30 = fin(f, t3, 12) * fout(f, t4 + 10, 12);
  const grow30 = 1 + 0.1 * fin(f, t3 + 40, 20) * fout(f, t4 + 10, 12);
  const pathO = fin(f, t6, 14) * fout(f, t7 + 10, 10);
  const KK = examples.kicks as unknown as { circle_xy_km: number[][] };
  const q = KK.circle_xy_km.slice(0, 61);            // a quarter of the anticlockwise circle (push to the left)
  const pathS = 2.4;
  const ph = clamp((f - t6 - 10) / 90, 0, 1);
  const nq = Math.max(2, Math.round(ph * 60) + 1);
  const qp = (p: number[]): Pt => [c0[0] + p[0] * pathS, c0[1] - p[1] * pathS];
  return (
    <Scene>
      <div style={{ position: "absolute", left: PZ.x, top: PZ.y, width: PZ.w, height: PZ.h, overflow: "hidden", opacity: 0.72 }}>
        <Img src={staticFile("cp/bmng_s23.jpg")} style={{ position: "absolute", left: (PZ.w - 1100) / 2, top: (PZ.h - 1100) / 2, width: 1100, height: 1100 }} />
      </div>
      <Svg>
        <Grid P={mkP(PZ.x, PZ.y + PZ.h, 92)} xr={[0, 10]} yr={[0, 8]} o={0.25} />
        <g opacity={1 - pathO}>
          <Arrow p={c0} q={uT} color={C.first} />
          <Lbl x={c0[0] + 140} y={c0[1] - 34} t="u = (5, 0, 0) m/s" c={C.first} s={T.key} a="start" />
          <Arrow p={c0} q={[c0[0], c0[1] - 5 * S]} color={ROT} o={fin(f, t1)} />
          <Lbl x={c0[0] - 20} y={c0[1] - 5 * S - 40} t="k × u = (0, 5, 0)" c={ROT} s={T.key} a="middle" o={fin(f, t1)} />
          <Arrow p={uT} q={[uT[0], uT[1] - pL]} color={C.second} o={fin(f, t2)} />
          <RightTick at={uT} u1={[-1, 0]} u2={[0, -1]} o={fin(f, t2)} />
          <Lbl x={uT[0] + 20} y={uT[1] - pL - 30} t="push ⟂ wind" c={C.second} s={T.key} o={fin(f, t2) * fout(f, t3)} />
          <g opacity={c30}>
            <Arrow p={uT} q={p30} color={C.neg} dash="14 9" />
            <Band p={uT} q={alongEnd} color={C.neg} o={0.8} />
            <Band p={alongEnd} q={p30} color={ROT} o={0.8} />
            <Lbl x={(uT[0] + alongEnd[0]) / 2} y={uT[1] + 58} t="along: speeds up" c={C.neg} s={T.key} a="middle" />
            <Lbl x={p30[0] + 30} y={(p30[1] + alongEnd[1]) / 2} t="across: turns" c={ROT} s={T.key} />
            <Arc P={(x, y) => [uT[0] + x, uT[1] - y]} a0={60} a1={90} r={90} c={C.gold} w={5} />
            <Lbl x={uT[0] + 50} y={uT[1] - 120} t="30°" c={C.gold} s={T.key} />
            <Arrow p={c0} q={[c0[0] + 5 * S * grow30, c0[1]]} color={C.neg} w={6} head={24} o={fin(f, t3 + 40)} />
          </g>
        </g>
        <g opacity={pathO}>
          <polyline points={q.slice(0, nq).map((p) => qp(p).join(",")).join(" ")} fill="none" stroke={C.gold} strokeWidth={6} />
          {Array.from({ length: 5 }, (_, i) => {
            const j = Math.min(nq - 1, i * 15);
            const p = qp(q[j]), n = q[Math.min(60, j + 1)], pr = q[j];
            const d: Pt = [n[0] - pr[0], n[1] - pr[1]], L = Math.hypot(d[0], d[1]) || 1;
            return j <= nq - 1 ? <g key={i}><Arrow p={p} q={[p[0] + (d[0] / L) * 110, p[1] - (d[1] / L) * 110]} color={C.first} w={7} head={26} />
              <Arrow p={p} q={[p[0] - (d[1] / L) * 70, p[1] - (d[0] / L) * 70]} color={C.second} w={6} head={22} /></g> : null;
          })}
          <Arrow p={c0} q={[c0[0], c0[1] - 5 * S]} color={C.neg} dash="14 9" o={fin(f, t6 + 4) * fout(f, t6 + 40)} />
          <Strike p={[c0[0] - 40, c0[1] - 5 * S + 40]} q={[c0[0] + 40, c0[1] - 5 * S + 120]} f={f} at={t6 + 14} />
        </g>
        <Keyword f={f} text="a direction: left of the wind" at={[1100, 140]} appear={AT(k, 1, "names the direction")} out={t3} targets={[]} />
        <Keyword f={f} text="push ⟂ wind" at={[1100, 240]} appear={AT(k, 2, "always at a right angle")} out={t4 + 10} targets={[]} />
        <g opacity={fin(f, AT(k, 2, "like the magnet")) * fout(f, t4)}>
          <circle cx={1700} cy={140} r={60} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" />
          <circle cx={1700} cy={80} r={12} fill={C.key} />
          <Lbl x={1700} y={250} t="proton" c={C.local} s={T.floor} a="middle" />
        </g>
        <Keyword f={f} text="30° off → changes speed" at={[1100, 340]} appear={t3} out={t4 + 10} targets={[]} c={C.neg} />
        <Keyword f={f} text="only turns" at={[1100, 340]} appear={t4 + 12} out={t6} targets={[]} />
        <Keyword f={f} text="bends a little at a time" at={[1100, 340]} appear={AT(k, 6, "a little at a time")} out={t7} targets={[]} />
        <g opacity={fin(f, t7)}>
          {[0, 1, 2].map((i) => <line key={i} x1={1150} y1={540 + 70 * i} x2={1650} y2={540 + 70 * i} stroke={C.key} strokeWidth={3} opacity={0.7} />)}
          <Lbl x={1700} y={540} t="L" c={C.key} s={T.calc} a="middle" />
          <Lbl x={1700} y={690} t="H" c={C.key} s={T.calc} a="middle" />
          <Arrow p={[1400, 610]} q={[1400, 720]} color={C.second} w={8} head={28} />
          <Arrow p={[1400, 610]} q={[1520, 610]} color={ROT} w={8} head={28} />
          <Arc P={(x, y) => [1400 + x, 610 - y]} a0={-90} a1={0} r={50} c={C.gold} w={5} />
          <Lbl x={1290} y={740} t="∇p" c={C.second} s={T.key} />
          <Lbl x={1540} y={600} t="k × ∇p" c={ROT} s={T.key} />
          <Keyword f={f} text="weather maps" at={[1150, 820]} appear={t7} targets={[]} />
        </g>
      </Svg>
      <Layered parts={[{ t: String.raw`\text{push}` }, { t: "=" }, { t: String.raw`(\text{strength})`, u: { w: String.raw`\text{a number}`, c: C.key } }, { t: String.raw`\times` },
        { t: String.raw`\mathbf k\times\mathbf u`, c: ROT, u: { w: String.raw`\text{quarter turn}`, c: ROT } }]}
        layers={[{ t: "all", o: 1 }, { u: [2, 4], o: fin(f, t5 + 30) }]} x={1070} y={420} size={64} ay={0} o={fin(f, t5) * fout(f, t7 - 6)} />
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
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), tNP = AT(k, 3, "North Pole"), t4 = SS(k, 4), t5 = SS(k, 5), t7 = SS(k, 7);
  const spin = (18 * D2R * Math.max(0, f - t1)) / FPS;   // one turn in 20 s of film (time compressed)
  const tilt = 23.4;
  const M = globeMatrix(spin, tilt);
  const cam: GlobeCam = { lat: 18, lon: -40, dist: 6.8, pp: [560, 540] };
  const axv = new THREE.Vector3(0, 1, 0).applyMatrix4(globeMatrix(0, tilt));
  const ax: V3 = [axv.x, axv.y, axv.z];
  const om = fin(f, t2 + 10, 16);
  const curl = 0.2 + 0.7 * easeIO(clamp((f - AT(k, 3, "Curl your")) / 40, 0, 1));
  const inO = fin(f, AT(k, 3, "Curl your") - 6, 12) * fout(f, t5 - 8, 12);
  const IN = { x: 1560, y: 420, w: 320, h: 360 };
  const inSt = orbitCam({ az: 300, el: 16, dist: 6.0, target: [-0.4, 0, 1.0] }, [IN.w / 2, IN.h / 2]);
  const inPr = projector(inSt, IN.w, IN.h, IN.x, IN.y);
  const inQ = handQuat([1, 0, 0], [0, 0, 1]);
  const kwOut = t5 - 10;
  const [OMH_L, OMH_R] = splitEq(EQ_OMH), OMP = eqPieces(splitEq(EQ_OM)[1]);
  return (
    <Scene>
      <GlobeView cam={cam} M={M}
        three={<>
          <Axis3D M={globeMatrix(0, tilt)} o={fin(f, t1 + 10)} r={0.014} />
          <Arrow3D from={mul3(ax, 1.36)} to={mul3(ax, 1.36 + 0.5 * om)} color={ROT} px={14} head={48} />
        </>}>
        {(G) => {
          const eq: [number, number][] = [];
          const lc = -40 - spin / D2R;
          for (let lo = lc - 70; lo <= lc + 50; lo += 2) eq.push([0, lo]);
          const tip = G.pw(mul3(ax, 1.36 + 0.5 * om));
          return <>
            <SurfArrow G={G} pts={eq} c={C.gold} w={6} head={30} o={fin(f, AT(k, 3, "from west to east")) * fout(f, t5)} />
            <Lbl x={tip[0] + 40} y={tip[1]} t="Ω" c={ROT} s={T.calc} o={om} />
            <Lbl x={tip[0] + 40} y={tip[1] + 64} t="(0, 0, 7.29 × 10⁻⁵) rad/s" c={ROT} s={T.floor} o={fin(f, AT(k, 7, "seven point two nine"))} />
            <Lbl x={G.pw(mul3(ax, 1.05))[0] + 60} y={G.pw(mul3(ax, 1.05))[1] + 50} t="North Pole" c={C.key} s={T.key} o={fin(f, tNP)} />
            <Lbl x={G.p(-6, lc - 30)[0]} y={G.p(-6, lc - 30)[1] + 40} t="west → east" c={C.gold} s={T.key} a="middle" o={fin(f, AT(k, 3, "from west to east")) * fout(f, t5)} />
          </>;
        }}
      </GlobeView>
      <Svg>
        <Keyword f={f} text="where does it come from?" at={[1080, 200]} appear={6} out={kwOut} targets={[]} />
        <Keyword f={f} text="one turn a day" at={[1080, 310]} appear={AT(k, 1, "spins once a day")} out={kwOut} targets={[]} />
        <Lbl x={1080} y={420} t="spin arrow Ω" c={ROT} s={T.key} o={fin(f, AT(k, 2, "as an arrow")) * fout(f, kwOut)} />
        <Keyword f={f} text="right-hand rule" at={[1080, 530]} appear={AT(k, 3, "right-hand fingers")} out={kwOut} targets={[]} />
        <Keyword f={f} text="length = how fast" at={[1080, 640]} appear={AT(k, 4, "how fast")} out={kwOut} targets={[]} />
        <Keyword f={f} text="radians: full turn = 2π" at={[1080, 220]} appear={AT(k, 5, "two pi radians")} targets={[]} />
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
        { lhs: OMH_L, rhs: OMH_R, at: AT(k, 6, "twenty three hours"), h: 190 },
        { rhs: OMP[0], at: t7 - 10, cont: true, h: 190 },
        { rhs: OMP[1], at: AT(k, 7, "seven point two nine"), cont: true, c: C.key, h: 110 },
      ]} />
    </Scene>
  );
};

// ---- the half-Earth (UV2-20): Earth cut along the meridian plane through our place (45°N, 0.5°E); the face carries the axis
const LON0 = 0.5;
const HE_E: V3 = [Math.cos(LON0 * D2R), 0, -Math.sin(LON0 * D2R)];     // local east = the face normal (towards the viewer)
const HE_M: V3 = [Math.sin(LON0 * D2R), 0, Math.cos(LON0 * D2R)];      // in the face: from the centre to the equator under our place
const heCam = (yaw: number, el: number, dist: number, pp: Pt, target: V3 = [0, 0.05, 0]): CamState => {
  const h = norm3(add3(mul3(HE_E, Math.cos(yaw * D2R)), HE_M, Math.sin(yaw * D2R)));
  const dir = add3(mul3(h, Math.cos(el * D2R)), [0, 1, 0], Math.sin(el * D2R));
  return { pos: add3(target, dir, dist), target, up: [0, 1, 0], fov: 35, pp };
};
const heKey = (keys: [number, number, number, number][], f: number) => {  // [frame, yaw, el, dist] keys, eased
  if (f <= keys[0][0]) return keys[0].slice(1) as [number, number, number];
  for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) {
    const t = easeIO((f - keys[i - 1][0]) / Math.max(1, keys[i][0] - keys[i - 1][0]));
    return [1, 2, 3].map((j) => keys[i - 1][j] + (keys[i][j] - keys[i - 1][j]) * t) as [number, number, number];
  }
  return keys[keys.length - 1].slice(1) as [number, number, number];
};
const HalfEarthView: React.FC<{ st: CamState; slide: number; whole?: number; three?: React.ReactNode; children?: (pr: Projector) => React.ReactNode }> = ({ st, slide, whole = 0, three, children }) => {
  const tex = useTex(staticFile("cp/bmng.jpg"));
  const pr = projector(st, W3, H3);
  if (!tex) return null;
  return (
    <>
      <View3D st={st} amb={1.4} dir={1.0}>
        <HalfEarthMesh tex={tex} lon0={LON0} slide={slide} whole={whole} />
        {three}
      </View3D>
      <Svg>{children ? children(pr) : null}</Svg>
    </>
  );
};
const pinAt = (lat: number, r = 1): V3 => ll(lat, LON0, r);
/** the axis and the equator's trace drawn ON the face (SVG, so never hidden behind the outside) */
const FaceLines: React.FC<{ pr: Projector; o?: number; eq?: number }> = ({ pr, o = 1, eq = 1 }) => (o <= 0 ? null : (
  <g opacity={o}>
    <Seg3 pr={pr} a={[0, -1.0, 0]} b={[0, 1.2, 0]} c={C.gold} w={5} dash="16 10" />
    <Seg3 pr={pr} a={[0, 0, 0]} b={HE_M} c={C.muted} w={4} o={eq} />
    <circle cx={pr.p([0, 0, 0])[0]} cy={pr.p([0, 0, 0])[1]} r={8} fill={C.gold} />
  </g>));
const S25A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s25a_position_vector");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const [yaw, el, dist] = heKey([[0, 62, 14, 4.6], [t3, 62, 14, 4.6], [t3 + 50, 38, 12, 4.6]], f);
  const st = heCam(yaw, el, dist * 1.22, [520, 525]);
  const slide = easeIO(clamp((f - t3 - 10) / 40, 0, 1));
  const pin = pinAt(45);
  const rG = fin(f, t1, 16);
  const legs = fin(f, t6, 14);
  const xr = mul3(HE_M, Math.cos(45 * D2R)), zr: V3 = [0, Math.sin(45 * D2R), 0];
  return (
    <Scene>
      <HalfEarthView st={st} slide={slide} whole={1 - slide}
        three={<>
          <Arrow3D from={[0, 0, 0]} to={pin} color={C.first} grow={rG} onTop />
          <Ball3D at={pin} px={18} color={C.key} />
          <Arrow3D from={[0, 0, 0]} to={HE_E} color={C.local} px={6} head={24} o={fin(f, t5 + 20)} onTop />
        </>}>
        {(pr) => <>
          <FaceLines pr={pr} o={slide} />
          <circle cx={pr.p([0, 0, 0])[0]} cy={pr.p([0, 0, 0])[1]} r={9} fill={C.gold} opacity={rG * (1 - slide)} />
          <L3 pr={pr} at={pin} t="our place" c={C.key} s={T.key} a="start" dx={30} dy={-30} o={fin(f, 10) * fout(f, t2)} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={pin} t="r" c={C.first} s={T.calc} o={rG * fout(f, t6)} />
          <L3 pr={pr} at={pin} t="r = (4505, 0, 4505) km" c={C.first} s={T.key} a="start" dx={40} dy={-46} o={fin(f, AT(k, 6, "four thousand five hundred and five along z"))} />
          <Bracket p={pr.p([0, 0, 0])} q={pr.p(pin)} off={44} c={C.gold} o={fin(f, AT(k, 2, "six thousand")) * fout(f, t4)} />
          <Lbl x={(pr.p([0, 0, 0])[0] + pr.p(pin)[0]) / 2 + 70} y={(pr.p([0, 0, 0])[1] + pr.p(pin)[1]) / 2 + 30} t="6371 km" c={C.gold} s={T.key} a="start" o={fin(f, AT(k, 2, "six thousand")) * fout(f, t4)} />
          <Poly3 pr={pr} pts={Array.from({ length: 21 }, (_, i) => add3(mul3(HE_M, 0.38 * Math.cos((i / 20) * 45 * D2R)), [0, 0.38 * Math.sin((i / 20) * 45 * D2R), 0]))} c={C.gold} w={6} o={fin(f, t4)} />
          <L3 pr={pr} at={add3(mul3(HE_M, 0.52 * Math.cos(22 * D2R)), [0, 0.52 * Math.sin(22 * D2R), 0])} t="φ = 45°" c={C.gold} s={T.key} a="start" o={fin(f, t4)} />
          <g opacity={fin(f, t5)}>
            <L3 pr={pr} at={mul3(HE_M, 1.08)} t="x" c={C.key} s={T.key} a="start" dx={14} />
            <L3 pr={pr} at={[0, 1.32, 0]} t="z" c={C.key} s={T.key} a="start" dx={16} />
            <CircleDot x={pr.p(HE_E)[0]} y={pr.p(HE_E)[1]} r={22} w={5} c={C.local} />
            <L3 pr={pr} at={HE_E} t="y" c={C.local} s={T.key} a="start" dx={30} />
          </g>
          <Seg3 pr={pr} a={[0, 0, 0]} b={xr} c={C.first} w={6} dash="14 9" o={legs} />
          <Seg3 pr={pr} a={xr} b={pin} c={C.first} w={6} dash="14 9" o={legs} />
          <L3 pr={pr} at={mul3(xr, 0.5)} t="4505 km" c={C.first} s={T.key} dy={58} o={fin(f, AT(k, 6, "along x"))} />
          <L3 pr={pr} at={add3(xr, zr, 0.5)} t="4505 km" c={C.first} s={T.key} a="start" dx={30} o={fin(f, AT(k, 6, "along z"))} />
        </>}
      </HalfEarthView>
      <Svg>
        <Keyword f={f} text="position vector" at={[1100, 200]} appear={AT(k, 1, "the position vector")} targets={[]} s={T.calc} />
        <Keyword f={f} text="length + direction" at={[1100, 310]} appear={t2} targets={[]} />
        <Keyword f={f} text="latitude" at={[1100, 420]} appear={AT(k, 4, "the latitude")} targets={[]} />
      </Svg>
      <TeX s={EQ_R45} x={1100} y={600} size={T.calc} c={C.first} o={fin(f, AT(k, 6, "four thousand five hundred and five along z"))} />
    </Scene>
  );
};
const S25: React.FC = () => {
  const f = useCurrentFrame(), k = K("s25_ground_speed");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const st = heCam(38, 12, 5.4, [520, 545]);
  const pin = pinAt(45);
  const zc: V3 = [0, Math.sin(45 * D2R), 0], R = Math.cos(45 * D2R);
  const lon = 360 * easeIO(clamp((f - t6) / 120, 0, 1));
  const run = ll(45, LON0 + lon);
  const ring = Array.from({ length: 121 }, (_, i) => ll(45, LON0 + 3 * i));
  const [RL, RR] = splitEq(EQ_RADIUS), RP = eqPieces(RR);
  const [SL, SR] = splitEq(EQ_SPEED), SP = eqPieces(SR);
  return (
    <Scene>
      <HalfEarthView st={st} slide={1}
        three={<>
          <Arrow3D from={[0, 0, 0]} to={pin} color={C.first} onTop />
          <Arrow3D from={[0, 1.0, 0]} to={[0, 1.33, 0]} color={ROT} px={12} head={40} o={fin(f, t3)} />
          <Ball3D at={f >= t6 ? run : pin} px={18} color={C.key} />
        </>}>
        {(pr) => {
          const front = ring.filter((p) => dot3(p, HE_E) >= -0.02), back = ring.filter((p) => dot3(p, HE_E) < -0.02);
          const trail = Array.from({ length: Math.max(2, Math.round(lon / 3) + 1) }, (_, i) => ll(45, LON0 + 3 * i));
          return <>
            <FaceLines pr={pr} />
            <Poly3 pr={pr} pts={back} c={C.gold} w={4} dash="8 10" o={0.4 * fin(f, t1)} />
            <Poly3 pr={pr} pts={front} c={C.gold} w={5} o={fin(f, t1)} />
            <circle cx={pr.p(zc)[0]} cy={pr.p(zc)[1]} r={9} fill={C.gold} opacity={fin(f, t1 + 10)} />
            <Seg3 pr={pr} a={zc} b={pin} c={C.gold} w={6} dash="14 9" o={fin(f, t2)} />
            <L3 pr={pr} at={add3(zc, HE_M, R / 2)} t="radius" c={C.gold} s={T.key} dy={-30} o={fin(f, t2)} />
            <Poly3 pr={pr} pts={[[0, 0, 0], zc, pin]} c={C.gold} w={3} fill={C.gold} fo={0.18} o={fin(f, t4)} />
            <Poly3 pr={pr} pts={Array.from({ length: 21 }, (_, i) => add3(mul3(HE_M, 0.3 * Math.sin((i / 20) * 45 * D2R)), [0, 0.3 * Math.cos((i / 20) * 45 * D2R), 0]))} c={C.gold} w={5} o={fin(f, t3)} />
            <L3 pr={pr} at={add3(mul3(HE_M, 0.42 * Math.sin(22 * D2R)), [0, 0.42 * Math.cos(22 * D2R), 0])} t="θ" c={C.gold} s={T.key} a="start" o={fin(f, t3)} />
            <L3 pr={pr} at={[0, 1.33, 0]} t="Ω" c={ROT} s={T.calc} a="start" dx={24} o={fin(f, t3)} />
            <L3 pr={pr} at={pin} t="r = (4505, 0, 4505) km" c={C.first} s={T.key} a="start" dx={40} dy={-46} />
            {lon > 3 ? <Poly3 pr={pr} pts={trail} c={C.key} w={6} /> : null}
          </>;
        }}
      </HalfEarthView>
      <Svg><Keyword f={f} text="how fast?" at={[1100, 140]} appear={6} out={t1 + 10} targets={[]} /></Svg>
      <TeX s={String.raw`\text{radius} = |\mathbf r|\sin\theta`} x={1080} y={150} size={T.calc} o={fin(f, t4) * fout(f, t5)} />
      <CalcStack f={f} x={1330} y={110} size={56} maxLines={2} rows={[
        { lhs: RL, rhs: RP[0], at: t5, h: 90 },
        { rhs: RP.slice(1).join(" "), at: AT(k, 5, "four thousand five hundred and five"), cont: true, c: C.key, h: 90 },
      ]} />
      <TeX s={String.raw`\theta = 90^\circ - \varphi = 45^\circ`} x={1080} y={330} size={T.key} o={fin(f, t5)} />
      <TeX s={String.raw`\text{distance per turn} = 2\pi\times\text{radius}`} x={1080} y={450} size={T.key} o={fin(f, t6)} />
      <TeX s={String.raw`\text{time per turn} = 2\pi/\Omega`} x={1080} y={530} size={T.key} o={fin(f, AT(k, 6, "two pi over Omega"))} />
      <CalcStack f={f} x={1260} y={640} size={56} rows={[
        { lhs: SL, rhs: SP[0], at: t7, h: 110 },
        { rhs: SP[1], at: AT(k, 7, "the speed is Omega"), cont: true, c: C.key, h: 90 },
      ]} />
      <Svg>
        <Strike p={[1340, 670]} q={[1380, 630]} f={f} at={AT(k, 7, "cancel")} />
        <Strike p={[1350, 735]} q={[1390, 695]} f={f} at={AT(k, 7, "cancel") + 6} />
      </Svg>
    </Scene>
  );
};
const S25B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s25b_direction");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const [yaw, el, dist] = heKey([[0, 38, 12, 4.6], [t1, 38, 12, 4.6], [t1 + 40, 58, 14, 4.6]], f);
  const st = heCam(yaw, el, dist * 1.17, [520, 545]);
  const la = 45 - 45 * easeIO(clamp((f - t7) / 40, 0, 1)) + 90 * easeIO(clamp((f - AT(k, 7, "at the poles")) / 30, 0, 1));
  const pin = pinAt(la);
  const sp = interp(la, earth.lat_deg, earth.ground_speed);
  const vL = 0.55 * sp / 465;
  const vt = add3(pin, HE_E, vL);
  const hq = handQuat([0, 1, 0], HE_E);
  const label = la > 89 ? "v = (0, 0, 0)" : la < 1 ? "v = (0, 465, 0) m/s" : "v = (0, 329, 0) m/s";
  const rlab = la > 89 ? "r = (0, 0, 6371) km" : la < 1 ? "r = (6371, 0, 0) km" : "r = (4505, 0, 4505) km";
  const [OL, OR] = splitEq(EQ_OXR), OP = eqPieces(OR);
  return (
    <Scene>
      <HalfEarthView st={st} slide={1}
        three={<>
          <Arrow3D from={[0, 0, 0]} to={pin} color={C.first} onTop />
          <Arrow3D from={[0, 1.0, 0]} to={[0, 1.33, 0]} color={ROT} px={12} head={40} />
          {vL > 0.02 ? <Arrow3D from={pin} to={vt} color={C.second} grow={fin(f, t1, 16)} onTop /> : null}
          <Ball3D at={pin} px={18} color={C.key} />
          <Hand3D q={hq} at={add3(pin, [0.05, 0.25, 0])} s={0.3} angles={POSE.curl(0.7)} o={fin(f, t2, 10) * fout(f, t3 + 10, 10)} glow={{ thumb: C.second }} glowK={0.8} />
        </>}>
        {(pr) => <>
          <FaceLines pr={pr} />
          <L3 pr={pr} at={pin} t={rlab} c={C.first} s={T.key} a="start" dx={40} dy={-46} o={fin(f, t7)} />
          <L3 pr={pr} at={[0, 1.33, 0]} t="Ω" c={ROT} s={T.calc} a="start" dx={24} />
          {vL > 0.02 ? <TipL3 pr={pr} from={pin} to={vt} t={f >= AT(k, 6, "three hundred") ? label : "v"} c={C.second} s={T.key} o={fin(f, t1)} /> : null}
          <Tick3 pr={pr} at={pin} u1={HE_E} u2={[0, 1, 0]} s={0.12} o={fin(f, t1 + 10) * fout(f, t7)} />
          <Tick3 pr={pr} at={pin} u1={HE_E} u2={norm3(mul3(pin, -1))} s={0.12} c={C.first} o={fin(f, t1 + 16) * fout(f, t7)} />
          <Keyword f={f} text="east" at={[pr.p(vt)[0] + 30, pr.p(vt)[1] + 70]} appear={AT(k, 6, "towards the east")} out={t7} targets={[]} />
          <Keyword f={f} text="faster than sound" at={[1100, 760]} appear={AT(k, 7, "faster than sound")} targets={[]} />
        </>}
      </HalfEarthView>
      <TeX s={String.raw`|\boldsymbol\Omega\times\mathbf r| = \Omega\,|\mathbf r|\sin\theta`} x={1080} y={150} size={T.calc} o={fin(f, 6) * fout(f, t3)} />
      <TeX s={EQ_VOR} x={1080} y={150} size={T.eq} o={fin(f, t3)} />
      <Svg><line x1={1080} y1={205} x2={1420} y2={205} stroke={C.gold} strokeWidth={6} opacity={fin(f, t3 + 10)} /></Svg>
      <TeX s={EQ_OMV} x={1080} y={300} size={T.key} c={ROT} o={fin(f, t4)} />
      <CalcStack f={f} x={1200} y={400} size={44} rows={[
        { lhs: OL, rhs: OP[0], at: t5, h: 90 },
        { rhs: OP[1], at: AT(k, 6, "three hundred"), cont: true, c: C.key, h: 90 },
      ]} />
    </Scene>
  );
};

const S26: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26_coriolis_effect");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4);
  const cam = globePath([{ f: 0, lat: 0, lon: -30, dist: 4.8, pp: [540, 450] }, { f: t1, lat: 0, lon: -22, dist: 4.8, pp: [540, 450] }], f);
  const NS = paths.nh_start as number[], SS0 = paths.sh_start as number[];
  const X5 = (tr: number[][], la0: number, lo0: number, n: number) => tr.slice(0, n).map(([la, lo]) => [la0 + (la - la0) * 5, lo0 + (lo - lo0) * 5] as [number, number]);
  const nN = Math.max(2, Math.round(clamp((f - t1) / 90, 0, 1) * (paths.nh_track_6h.length - 1)));
  const nS = Math.max(2, Math.round(clamp((f - AT(k, 3, "Southern Hemisphere")) / 90, 0, 1) * (paths.sh_track_6h.length - 1)));
  return (
    <Scene>
      <GlobeView cam={cam} res50>
        {(G) => {
          const pN = G.p(NS[0], NS[1]), pS = G.p(SS0[0], SS0[1]);
          return <>
            <LatCircle G={G} lat={0} c={C.gold} w={5} o={fin(f, AT(k, 3, "north of the equator")) * (0.6 + 0.4 * pulse(f, AT(k, 3, "north of the equator"), 30))} />
            <circle cx={pN[0]} cy={pN[1]} r={10} fill={C.key} stroke={C.bg} strokeWidth={3} opacity={fin(f, 6)} />
            <SurfArrow G={G} pts={gcArrowPts(NS[0], NS[1], 90, 6, 0, 1, 20)} c={C.first} w={8} head={30} o={fin(f, 6) * fout(f, t1)} />
            <Observer x={pN[0] - 60} y={pN[1] + 70} s={1.1} o={fin(f, t1)} />
            <path d={llPath(G, X5(paths.ghost_nh as number[][], NS[0], NS[1], nN), 1.004)} fill="none" stroke={C.ink} strokeWidth={4} strokeDasharray="12 10" opacity={0.7 * fin(f, t1)} />
            {nN > 2 ? <SurfArrow G={G} pts={X5(paths.nh_track_6h as number[][], NS[0], NS[1], nN)} c={C.first} w={8} head={30} o={fin(f, t1)} /> : null}
            <circle cx={pS[0]} cy={pS[1]} r={10} fill={C.key} stroke={C.bg} strokeWidth={3} opacity={fin(f, AT(k, 3, "Southern Hemisphere"))} />
            <path d={llPath(G, X5(paths.ghost_sh as number[][], SS0[0], SS0[1], nS), 1.004)} fill="none" stroke={C.ink} strokeWidth={4} strokeDasharray="12 10" opacity={0.7 * fin(f, AT(k, 3, "Southern Hemisphere"))} />
            {nS > 2 ? <SurfArrow G={G} pts={X5(paths.sh_track_6h as number[][], SS0[0], SS0[1], nS)} c={C.first} w={8} head={30} o={fin(f, AT(k, 3, "Southern Hemisphere"))} /> : null}
            <Lbl x={pN[0] + 30} y={pN[1] - 60} t="right" c={C.key} s={T.key} o={fin(f, AT(k, 3, "to the right"))} />
            <Lbl x={pS[0] + 40} y={pS[1] + 70} t="left" c={C.key} s={T.key} o={fin(f, AT(k, 3, "to the left"))} />
          </>;
        }}
      </GlobeView>
      <Svg>
        <Keyword f={f} text="turning with Earth" at={[1150, 160]} appear={AT(k, 1, "We turn with Earth")} out={t2} targets={[]} />
        <Keyword f={f} text="drifts sideways" at={[1150, 270]} appear={AT(k, 1, "drift sideways")} out={t2} targets={[]} />
        <Keyword f={f} text="Coriolis effect" at={[1150, 160]} appear={AT(k, 2, "Coriolis effect")} targets={[]} s={T.calc} />
        <Lbl x={1150} y={300} t="Northern Hemisphere · right" c={C.key} s={T.key} o={fin(f, AT(k, 3, "to the right"))} />
        <Lbl x={1150} y={390} t="Southern Hemisphere · left" c={C.key} s={T.key} o={fin(f, AT(k, 3, "to the left"))} />
        <Lbl x={1150} y={560} t="?" c={C.gold} s={T.hero} o={fin(f, t4)} />
        <TurntableIcon x={1600} y={560} r={100} o={0.8 * fin(f, t4)} spin={f / 30} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s26a-s27a the merry-go-round (−2Ω × u derived)
const MG = merry as unknown as { Omega: number; radius: number; t: number[]; inertial: number[][]; rotating: number[][]; check_path: number[][]; max_gap_m: number;
  two_views: { t: number; u: number[]; r: number[]; omega_x_r: number[]; v_outside: number[] };
  carried: { base: number[]; u: number[]; t: number[]; ghosts: number[][] }; new_ground: { floor_old: number[]; floor_new: number[]; change: number[] } };
/** a top view of the disc: centre (cx, cy), `s` px per metre, turned by `ang` rad (anticlockwise on screen) */
const Disc: React.FC<{ cx: number; cy: number; s: number; ang: number; o?: number; om?: boolean }> = ({ cx, cy, s, ang, o = 1, om = true }) => {
  const R = MG.radius * s;
  return (
    <g opacity={o}>
      <circle cx={cx} cy={cy} r={R} fill="#24304b" stroke="#c9d2e3" strokeWidth={4} />
      {Array.from({ length: 8 }, (_, i) => { const a = ang + (i * Math.PI) / 4; return <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(a)} y2={cy - R * Math.sin(a)} stroke="#3e4b6c" strokeWidth={4} />; })}
      <circle cx={cx + 0.92 * R * Math.cos(ang)} cy={cy - 0.92 * R * Math.sin(ang)} r={9} fill={C.gold} />
      {om ? <CircleDot x={cx} y={cy} r={22} w={5} /> : null}
    </g>
  );
};
const discXY = (cx: number, cy: number, s: number) => (p: number[]): Pt => [cx + p[0] * s, cy - p[1] * s];
const S26A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26a_merry_go_round");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const N = MG.t.length - 1, dur = N;                       // real time: 1/30-s samples, one per frame
  const jL = Math.round(clamp((f - t2) / dur, 0, 1) * N), jR = Math.round(clamp((f - t3) / dur, 0, 1) * N);
  const s = 105, L = { x: 505, y: 450 }, Rr = { x: 1415, y: 450 };
  const angL = MG.Omega * (jL / 30);
  const pL = discXY(L.x, L.y, s), pR = discXY(Rr.x, Rr.y, s);
  const trailL = MG.inertial.slice(0, jL + 1).map((p) => pL(p).join(",")).join(" ");
  const trailR = MG.rotating.slice(0, jR + 1).map((p) => pR(p).join(",")).join(" ");
  const ballL = pL(MG.inertial[jL]), ballR = pR(MG.rotating[jR]);
  const pz = pulse(f, t4, 40);
  return (
    <Scene>
      <Svg>
        <Disc cx={L.x} cy={L.y} s={s} ang={angL} />
        <Disc cx={Rr.x} cy={Rr.y} s={s} ang={0} />
        <path d={`M ${L.x + 345} ${L.y} A 345 345 0 0 0 ${L.x + 345 * Math.cos(1.2)} ${L.y - 345 * Math.sin(1.2)}`} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, 10)} />
        <Lbl x={L.x + 40} y={L.y - 40} t="Ω (up)" c={ROT} s={T.key} a="start" o={fin(f, AT(k, 0, "spin arrow"))} />
        {jL > 0 ? <polyline points={trailL} fill="none" stroke={C.first} strokeWidth={7 + 4 * pz} /> : null}
        {jR > 0 ? <polyline points={trailR} fill="none" stroke={ROT} strokeWidth={7 + 4 * pz} /> : null}
        <circle cx={ballL[0]} cy={ballL[1]} r={14} fill={C.key} stroke={C.bg} strokeWidth={3} opacity={fin(f, t1)} />
        <circle cx={ballR[0]} cy={ballR[1]} r={14} fill={C.key} stroke={C.bg} strokeWidth={3} opacity={fin(f, t1)} />
        <Observer x={L.x - 400} y={L.y + 380} s={1.2} o={fin(f, t2)} />
        <Observer x={Rr.x + 200} y={Rr.y + 160} s={1.0} o={fin(f, t3)} />
        <Lbl x={L.x} y={845} t="from outside" c={C.key} s={T.key} a="middle" o={fin(f, 6)} />
        <Lbl x={Rr.x} y={845} t="from the disc" c={C.key} s={T.key} a="middle" o={fin(f, 6)} />
        <Keyword f={f} text="straight" at={[L.x + 120, 110]} appear={AT(k, 2, "straight line")} out={t4} targets={[]} />
        <Keyword f={f} text="curves right" at={[Rr.x + 80, 110]} appear={AT(k, 3, "curves to the right")} out={t4} targets={[]} />
        <Keyword f={f} text="same ball" at={[960, 110]} a="middle" appear={t4} targets={[]} />
        <Keyword f={f} text="measured against a turning floor" at={[960, 190]} a="middle" appear={t5} targets={[]} s={T.floor} />
      </Svg>
    </Scene>
  );
};
const S26B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26b_two_views");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const s = 120, c: Pt = [520, 450];
  const tv = MG.two_views;
  const P2 = discXY(c[0], c[1], s);
  const ball = P2(tv.r), j = Math.round(tv.t * 30);
  const VS = 190;     // px per m/s
  const uT: Pt = [ball[0] + tv.u[0] * VS, ball[1] - tv.u[1] * VS];
  const fT: Pt = [uT[0] + tv.omega_x_r[0] * VS, uT[1] - tv.omega_x_r[1] * VS];
  const fT0: Pt = [ball[0] + tv.omega_x_r[0] * VS, ball[1] - tv.omega_x_r[1] * VS];
  const VO: Part[] = [{ t: String.raw`\mathbf v_{\text{outside}}` }, { t: "=" }, { t: String.raw`\mathbf u`, c: C.first, u: { w: String.raw`\text{1}`, c: C.gold } }, { t: "+" },
    { t: String.raw`\boldsymbol\Omega\times\mathbf r`, c: C.second, u: { w: String.raw`\text{2}`, c: C.gold } }];
  if (plainOf(VO).replace(/\s/g, "") !== EQ_VOUT.replace(/\s/g, "")) throw new Error("s26b parts ≠ EQ_VOUT");
  return (
    <Scene>
      <Svg>
        <Disc cx={c[0]} cy={c[1]} s={s} ang={0} />
        <polyline points={MG.rotating.slice(0, j + 1).map((p) => P2(p).join(",")).join(" ")} fill="none" stroke={ROT} strokeWidth={5} opacity={0.6} />
        <Arrow p={c} q={ball} color={C.local} w={6} head={24} o={fin(f, t2)} />
        <Lbl x={(c[0] + ball[0]) / 2 - 30} y={(c[1] + ball[1]) / 2 + 20} t="r" c={C.local} s={T.calc} a="end" o={fin(f, t2)} />
        <Arrow p={ball} q={uT} color={C.first} o={fin(f, t1)} />
        <Lbl x={(ball[0] + uT[0]) / 2 - 30} y={(ball[1] + uT[1]) / 2} t="u" c={C.first} s={T.calc} a="end" o={fin(f, t1)} />
        <Arrow p={f >= t3 ? uT : ball} q={f >= t3 ? fT : fT0} color={C.second} o={fin(f, AT(k, 2, "Omega cross r"))} />
        <Lbl x={(f >= t3 ? fT : fT0)[0] + 20} y={(f >= t3 ? fT : fT0)[1] + 40} t="Ω × r" c={C.second} s={T.key} o={fin(f, AT(k, 2, "Omega cross r"))} />
        <Arrow p={ball} q={fT} color={C.key} o={fin(f, t3 + 20)} />
        <Lbl x={fT[0] + 30} y={fT[1] - 30} t="u + Ω × r" c={C.key} s={T.key} o={fin(f, t3 + 20)} />
        <circle cx={ball[0]} cy={ball[1]} r={14} fill={C.key} stroke={C.bg} strokeWidth={3} />
        <Keyword f={f} text="velocity over the floor" at={[1100, 140]} appear={AT(k, 1, "call it u")} out={t3} targets={[]} c={C.first} />
        <Keyword f={f} text="the floor's velocity" at={[1100, 230]} appear={AT(k, 2, "Omega cross r")} out={t3} targets={[]} c={C.second} />
        <Keyword f={f} text="Newton's law: outside watcher" at={[1100, 470]} appear={t4} targets={[]} />
        <Lbl x={1100} y={560} t="no push → v_outside constant" c={C.key} s={T.key} o={fin(f, t5)} />
        <Lbl x={1100} y={660} t="how does u + Ω × r change?" c={C.key} s={T.key} o={fin(f, t6)} />
        <Keyword f={f} text="each gives Ω × u" at={[1100, 770]} appear={t7} targets={[]} c={ROT} />
      </Svg>
      <Layered parts={VO} layers={[{ t: "all", o: 1 }, { u: [2, 4], o: fin(f, t7) }]} x={1100} y={250} size={T.eq} ay={0} o={fin(f, t3)} />
    </Scene>
  );
};
const S26C: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26c_carried_arrow");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const s = 120, c: Pt = [520, 450];
  const P2 = discXY(c[0], c[1], s);
  const G = MG.carried.ghosts, n = G.length - 1;
  const ph = clamp((f - t2) / Math.max(30, t4 - t2), 0, 1);
  const j = Math.round(ph * n);
  const AS = 220;                       // px per m/s for the painted arrow
  const g = G[j];
  const base = P2([g[0], g[1]]), tip: Pt = [base[0] + g[2] * AS, base[1] - g[3] * AS];
  const tipPath = G.slice(0, j + 1).map((q) => [P2([q[0], q[1]])[0] + q[2] * AS, P2([q[0], q[1]])[1] - q[3] * AS].join(",")).join(" ");
  const om = MG.Omega, vx = -om * g[3], vy = om * g[2];   // Ω × u for Ω up
  const VS = 260;
  return (
    <Scene>
      <Svg>
        <Disc cx={c[0]} cy={c[1]} s={s} ang={MG.Omega * MG.carried.t[j]} />
        {G.slice(0, j + 1).filter((_, i) => i % 10 === 0 && i < j).map((q, i) => { const b = P2([q[0], q[1]]); return <Arrow key={i} p={b} q={[b[0] + q[2] * AS, b[1] - q[3] * AS]} color={C.first} w={5} head={20} o={0.3} halo={false} />; })}
        {j > 0 ? <polyline points={tipPath} fill="none" stroke={C.gold} strokeWidth={5} /> : null}
        <Arrow p={base} q={tip} color={C.first} />
        <Lbl x={tip[0] + 16} y={tip[1] - 20} t="u" c={C.first} s={T.calc} />
        <Arrow p={tip} q={[tip[0] + vx * VS, tip[1] - vy * VS]} color={ROT} w={8} head={28} o={fin(f, t4)} />
        <Lbl x={tip[0] + vx * VS - 20} y={tip[1] - vy * VS - 40} t="Ω × u" c={ROT} s={T.key} a="end" o={fin(f, t4)} />
        <Keyword f={f} text="same u for the rider" at={[1100, 160]} appear={t1} out={t3} targets={[]} />
        <Keyword f={f} text="the rider's directions turn" at={[1100, 260]} appear={t2} out={t4} targets={[]} />
        <Keyword f={f} text="carried round → Ω × arrow" at={[1100, 360]} appear={AT(k, 4, "Any arrow carried round")} targets={[]} />
        <Lbl x={1100} y={450} t="just as r: Ω × r" c={C.second} s={T.key} o={fin(f, AT(k, 4, "just as r did"))} />
      </Svg>
      <TeX s={EQ_P1} x={1100} y={620} size={T.calc} o={fin(f, t5)} />
    </Scene>
  );
};
const S26D: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26d_new_ground");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const s = 120, c: Pt = [520, 450];
  const P2 = discXY(c[0], c[1], s);
  const ng = MG.new_ground;
  const VS = 170;
  const x = 1.0 + 0.5 * easeIO(clamp((f - t1) / 50, 0, 1));
  const ring = (r: number) => Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4, p: Pt = P2([r * Math.cos(a), r * Math.sin(a)]);
    const v = MG.Omega * r;
    return <Arrow key={`${r}${i}`} p={p} q={[p[0] - Math.sin(a) * v * 100, p[1] - Math.cos(a) * v * 100]} color={C.second} w={5} head={18} o={0.5} halo={false} />;
  });
  const oldP = P2([1.0, 0]), newP = P2([1.5, 0]), ballP = P2([x, 0]);
  const fo = ng.floor_old, fnw = ng.floor_new, dch = ng.change;
  return (
    <Scene>
      <Svg>
        <Disc cx={c[0]} cy={c[1]} s={s} ang={0} />
        <g opacity={fin(f, 6)}>{ring(1.0)}{ring(2.8)}</g>
        <Lbl x={P2([0, -1.0])[0] + 70} y={P2([0, -1.0])[1] + 50} t="0.5 m/s" c={C.second} s={T.floor} o={fin(f, 6)} />
        <Lbl x={P2([0, -2.8])[0] + 160} y={P2([0, -2.8])[1] - 20} t="1.4 m/s" c={C.second} s={T.floor} o={fin(f, 6)} />
        <Arrow p={ballP} q={[ballP[0] + 0.5 * 160, ballP[1]]} color={C.first} w={8} head={28} o={fin(f, t1) * fout(f, t3)} />
        <Lbl x={ballP[0] + 90} y={ballP[1] + 50} t="u" c={C.first} s={T.calc} o={fin(f, t1) * fout(f, t3)} />
        <g opacity={fin(f, AT(k, 3, "Omega cross r changes"))}>
          <Arrow p={oldP} q={[oldP[0] + fo[0] * VS, oldP[1] - fo[1] * VS]} color={C.second} w={8} head={28} />
          <Arrow p={newP} q={[newP[0] + fnw[0] * VS, newP[1] - fnw[1] * VS]} color={C.second} w={8} head={28} />
          <Lbl x={oldP[0] - 20} y={oldP[1] - fo[1] * VS - 30} t="0.5 m/s" c={C.second} s={T.floor} a="end" />
          <Lbl x={newP[0] + 30} y={newP[1] - fnw[1] * VS - 30} t="0.75 m/s" c={C.second} s={T.floor} a="start" />
          <Arrow p={[newP[0] + 70, newP[1] - fo[1] * VS]} q={[newP[0] + 70, newP[1] - fo[1] * VS - dch[1] * VS]} color={ROT} w={8} head={26} />
          <Lbl x={newP[0] + 100} y={newP[1] - fo[1] * VS - dch[1] * VS / 2} t="Ω × u" c={ROT} s={T.key} a="start" />
        </g>
        <circle cx={ballP[0]} cy={ballP[1]} r={14} fill={C.key} stroke={C.bg} strokeWidth={3} />
        <Keyword f={f} text="fast near the edge, slow near the centre" at={[1100, 150]} appear={AT(k, 1, "fast near the edge")} out={t3} targets={[]} s={T.floor} />
        <Lbl x={1100} y={260} t="floor: Ω × r" c={C.second} s={T.key} o={fin(f, t2)} />
        <Lbl x={1100} y={350} t="u per second → Ω × r changes by Ω × u" c={C.key} s={T.floor} o={fin(f, t3)} />
        <Keyword f={f} text="doesn't depend on u" at={[1100, 760]} appear={AT(k, 6, "doesn't depend on u")} targets={[]} c={C.local} />
      </Svg>
      <TeX s={EQ_P1} x={1100} y={460} size={T.calc} c={C.local} o={fin(f, 6)} />
      <TeX s={EQ_P2} x={1100} y={560} size={T.calc} o={fin(f, t4)} />
      <TeX s={EQ_P3} x={1100} y={660} size={T.key} c={C.local} o={fin(f, t5)} />
    </Scene>
  );
};

// ================================================================ s27 −2Ω × u on a local patch at 45°N
const PATCH_K: OrbitKey = { f: 0, az: 252, el: 16, dist: 10.5, target: [0.4, 0.4, 1.0], pp: [520, 470] };
const S27: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27_coriolis_term");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const SEEN: Part[] = [{ t: String.raw`\text{change seen outside}` }, { t: "=" }, { t: String.raw`\frac{d\mathbf u}{dt}`, c: C.first, u: { w: String.raw`\text{rider sees}`, c: C.first } },
    { t: "+" }, { t: String.raw`\boldsymbol\Omega\times\mathbf u`, c: ROT, u: { w: String.raw`\text{\textcircled{1}}`, c: C.gold } }, { t: "+" },
    { t: String.raw`\boldsymbol\Omega\times\mathbf u`, c: ROT, u: { w: String.raw`\text{\textcircled{2}}`, c: C.gold } }, { t: "+" },
    { t: String.raw`\boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`, c: C.local, u: { w: String.raw`\text{\textcircled{3}}`, c: C.gold } }];
  if (plainOf(SEEN).replace(/\s/g, "") !== EQ_SEEN.replace(/\s/g, "")) throw new Error("s27 parts ≠ EQ_SEEN");
  const D3: Part[] = [{ t: String.raw`\frac{d\mathbf u}{dt}`, c: C.first }, { t: "=" }, { t: String.raw`\text{real pushes}` },
    { t: String.raw`- 2\boldsymbol\Omega\times\mathbf u`, c: ROT, u: { w: String.raw`\text{Coriolis push (per kg)}`, c: ROT } },
    { t: String.raw`- \boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`, c: C.local, u: { w: String.raw`\text{centrifugal: outwards}`, c: C.local }, x: C.local }];
  if (plainOf(D3).replace(/\s/g, "") !== EQ_DUDT3.replace(/\s/g, "")) throw new Error("s27 parts ≠ EQ_DUDT3");
  const fin2 = fin(f, AT(k, 8, "leave it out"), 14);
  return (
    <Scene>
      <Svg>
        <Disc cx={260} cy={680} s={50} ang={f / 60} o={0.45} />
        <Arrow p={[260 + 110, 680]} q={[260 + 190, 680]} color={C.local} w={6} head={22} o={fin(f, t7)} />
        <g opacity={fin(f, t8) * (1 - fin2 * 0)}>
          <ellipse cx={620} cy={680} rx={130} ry={112} fill="none" stroke={C.key} strokeWidth={4} />
          <Lbl x={620} y={830} t="bulge" c={C.local} s={T.floor} a="middle" />
        </g>
        <Keyword f={f} text="push per kilogram = acceleration" at={[120, 110]} appear={t1} out={t3} targets={[]} />
        <Keyword f={f} text="Newton" at={[1500, 420]} appear={t3} out={t4 + 10} targets={[]} />
        <Lbl x={1000} y={790} t="2 ← ① + ②" c={C.gold} s={T.key} o={fin(f, t6)} />
        <Lbl x={1400} y={790} t="− ← moved across" c={C.gold} s={T.key} o={fin(f, AT(k, 6, "the minus"))} />
        <Keyword f={f} text="in gravity" at={[820, 680]} appear={AT(k, 8, "part of gravity")} targets={[]} />
      </Svg>
      <Layered parts={SEEN.slice(0, 2)} layers={[{ t: "all", o: 1 }]} x={110} y={150} size={56} ay={0} o={fin(f, t2) * fout(f, t4 + 20)} />
      {f < t4 + 31 ? <Layered parts={SEEN.slice(2)} layers={[{ t: "all", o: 1 }, { u: [0, 2, 4, 6], o: fin(f, t2 + 30) }]} x={110} y={240} size={64} ay={0} o={fin(f, t2) * fout(f, t4 + 20)} /> : null}
      <TeX s={String.raw`= \text{real pushes}`} x={1250} y={420} size={56} o={fin(f, AT(k, 3, "equals the real pushes")) * fout(f, t4 + 20)} />
      <Layered parts={D3} layers={[{ t: "all", o: 1 }, { u: [3], o: fin(f, t5) }, { u: [4], o: fin(f, t7) }, { x: [4], o: fin2 }]} x={110} y={170} size={64} ay={0} o={fin(f, t4) * fout(f, AT(k, 8, "leave it out") + 30)} />
      <TeX s={EQ_DUDT} x={960} y={300} size={96} ax={0.5} o={fin(f, AT(k, 8, "leave it out") + 30)} />
      <TeX s={String.raw`\text{change of }\mathbf u\text{: }\frac{d\mathbf u}{dt}`} x={110} y={470} size={T.floor} c={C.local} o={fin(f, t2 + 40) * fout(f, t4)} />
    </Scene>
  );
};
const S27A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27a_minus_check");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const s = 120, c: Pt = [520, 450];
  const P2 = discXY(c[0], c[1], s);
  const tv = MG.two_views;
  const ball = P2(tv.r);
  const uh = norm3([tv.u[0], tv.u[1], 0]);
  const U: Pt = [ball[0] + uh[0] * 170, ball[1] - uh[1] * 170];
  const left: Pt = [ball[0] - uh[1] * 120, ball[1] - uh[0] * 120], right: Pt = [ball[0] + uh[1] * 150, ball[1] + uh[0] * 150];
  const n = MG.rotating.length - 1;
  const n1 = Math.round(clamp((f - t4) / 90, 0, 1) * n), n2 = Math.round(clamp((f - t5) / 90, 0, 1) * n);
  const gapUp = Math.ceil(MG.max_gap_m * 1e11) / 1e11;
  const pathO = fin(f, t4);
  return (
    <Scene>
      <Svg>
        <Disc cx={c[0]} cy={c[1]} s={s} ang={0} />
        <polyline points={MG.rotating.map((p) => P2(p).join(",")).join(" ")} fill="none" stroke={ROT} strokeWidth={5 + 4 * pulse(f, t2, 30)} opacity={0.5 * (1 - pathO)} />
        <g opacity={1 - pathO}>
          <Arrow p={ball} q={U} color={C.first} o={fin(f, t1)} />
          <Lbl x={U[0] + 20} y={U[1]} t="u" c={C.first} s={T.calc} o={fin(f, t1)} />
          <Arrow p={ball} q={left} color={ROT} dash="14 9" o={fin(f, AT(k, 1, "to the left"))} />
          <Lbl x={left[0] - 20} y={left[1] - 20} t="Ω × u" c={ROT} s={T.key} a="end" o={fin(f, AT(k, 1, "to the left"))} />
          <Arrow p={ball} q={right} color={C.second} o={fin(f, t2)} />
          <Lbl x={right[0] + 20} y={right[1] + 30} t="−2Ω × u" c={C.second} s={T.key} o={fin(f, t2)} />
          <RightTick at={ball} u1={unit(ball, U)} u2={unit(ball, left)} o={fin(f, t1 + 10)} />
          <circle cx={ball[0]} cy={ball[1]} r={14} fill={C.key} stroke={C.bg} strokeWidth={3} />
        </g>
        {n1 > 0 ? <polyline points={MG.rotating.slice(0, n1 + 1).map((p) => P2(p).join(",")).join(" ")} fill="none" stroke={C.gold} strokeWidth={9} strokeDasharray="2 12" strokeLinecap="round" /> : null}
        {n2 > 0 ? <polyline points={MG.check_path.slice(0, n2 + 1).map((p) => P2(p).join(",")).join(" ")} fill="none" stroke={ROT} strokeWidth={5} /> : null}
        <g opacity={fin(f, t4) * fout(f, t6 + 30)}>
          <circle cx={1700} cy={180} r={110} fill="#24304b" stroke="#c9d2e3" strokeWidth={3} />
          <line x1={1700} y1={180 + 103} x2={1700} y2={180 - 103} stroke={C.first} strokeWidth={5} strokeDasharray="12 8" />
          <Lbl x={1700} y={340} t="outside: straight" c={C.first} s={T.floor} a="middle" />
        </g>
        <Keyword f={f} text="right, against the turning" at={[1100, 160]} appear={t2} out={t3} targets={[]} />
        <Keyword f={f} text="computer check" at={[1100, 160]} appear={t3} targets={[]} />
        <Lbl x={1100} y={280} t="route 1: redraw" c={C.gold} s={T.floor} o={fin(f, t4)} />
        <Lbl x={1100} y={350} t="route 2: rider's equation" c={ROT} s={T.floor} o={fin(f, t5)} />
        <Keyword f={f} text="the same path" at={[1100, 640]} appear={t6} targets={[]} />
        <Lbl x={1100} y={730} t={`largest gap: ${gapUp.toFixed(11)} m`} c={C.key} s={T.floor} o={fin(f, t6 + 20)} />
      </Svg>
      <TeX s={EQ_RIDER} x={1080} y={480} size={46} o={fin(f, t5)} />
    </Scene>
  );
};

// ================================================================ s28 f = 2Ω sin φ: the shadow of Ω on the local up
const F_CAM: GlobeCam = { lat: 8, lon: 90, dist: 6.0, pp: [600, 470] };
const S28A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28a_local_axes");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const st = heCam(58, 14, 5.2, [520, 545]);
  const tP = AT(k, 8, "North Pole"), tE = AT(k, 8, "at the equator");
  const la = 45 + 45 * easeIO(clamp((f - tP) / 30, 0, 1)) - 90 * easeIO(clamp((f - tE) / 40, 0, 1));
  const pin = pinAt(la);
  const { n, u } = enAt(la, LON0);
  const L = 0.62;
  const om: V3 = [0, L, 0];
  const nL = L * Math.cos(la * D2R), uL = L * Math.sin(la * D2R);
  const loc = fin(f, t1, 14), omO = fin(f, t4, 14), legs = fin(f, t5, 14);
  const lab = la > 89 ? "(0, 0, 7.29 × 10⁻⁵)" : la < 1 ? "(0, 7.29 × 10⁻⁵, 0)" : "";
  return (
    <Scene>
      <HalfEarthView st={st} slide={1}
        three={<>
          <Arrow3D from={[0, 1.0, 0]} to={[0, 1.33, 0]} color={ROT} px={12} head={40} />
          <Ball3D at={pin} px={16} color={C.key} />
          <Arrow3D from={pin} to={add3(pin, HE_E, 0.4)} color={C.local} px={8} head={28} grow={fin(f, AT(k, 1, "east"), 12)} onTop />
          <Arrow3D from={pin} to={add3(pin, n, 0.4)} color={C.local} px={8} head={28} grow={fin(f, AT(k, 1, "north"), 12)} onTop />
          <Arrow3D from={pin} to={add3(pin, u, 0.4)} color={f >= t2 ? ROT : C.local} px={8} head={28} grow={fin(f, AT(k, 1, "and up"), 12)} onTop />
          <Arrow3D from={pin} to={add3(pin, om)} color={ROT} px={12} head={40} o={omO} onTop />
        </>}>
        {(pr) => <>
          <FaceLines pr={pr} />
          <L3 pr={pr} at={[0, 1.33, 0]} t="Ω" c={ROT} s={T.calc} a="start" dx={24} />
          <Keyword f={f} text="tilted" at={[pr.p([0, 1.33, 0])[0] + 90, pr.p([0, 1.33, 0])[1] + 10]} appear={AT(k, 0, "tilted")} out={t1} targets={[]} />
          <TipL3 pr={pr} from={pin} to={add3(pin, HE_E, 0.4)} t="east" c={C.local} s={T.key} o={fin(f, AT(k, 1, "east"))} />
          <TipL3 pr={pr} from={pin} to={add3(pin, n, 0.4)} t="north" c={C.local} s={T.key} o={fin(f, AT(k, 1, "north"))} />
          <TipL3 pr={pr} from={pin} to={add3(pin, u, 0.4)} t={f >= t2 ? "up = k" : "up"} c={f >= t2 ? ROT : C.local} s={T.key} o={fin(f, AT(k, 1, "and up"))} />
          <TipL3 pr={pr} from={pin} to={add3(pin, om)} t={`Ω ${lab}`} c={ROT} s={T.key} o={omO} side={-40} />
          <Tick3 pr={pr} at={pin} u1={HE_E} u2={[0, 1, 0]} s={0.1} c={C.gold} o={fin(f, AT(k, 4, "leans partly north")) * fout(f, t5)} />
          <Seg3 pr={pr} a={pin} b={add3(pin, n, nL)} c={ROT} w={6} dash="12 8" o={legs} />
          <Seg3 pr={pr} a={add3(pin, n, nL)} b={add3(pin, om)} c={ROT} w={6} dash="12 8" o={legs} />
          <L3 pr={pr} at={add3(pin, n, nL * 0.5)} t="Ω cos φ" c={ROT} s={T.key} dy={60} o={legs * (nL > 0.08 ? 1 : 0)} />
          <L3 pr={pr} at={add3(add3(pin, n, nL), u, uL * 0.5)} t="Ω sin φ" c={ROT} s={T.key} a="start" dx={30} o={legs * (uL > 0.08 ? 1 : 0)} />
          <Arc3 pr={pr} c0={pin} e1={n} e2={u} r={0.2} a0={0} a1={la} col={C.gold} head={false} o={legs * fout(f, tP)} />
          <L3 pr={pr} at={add3(pin, add3(mul3(n, Math.cos(22 * D2R)), u, Math.sin(22 * D2R)), 0.3)} t="φ" c={C.gold} s={T.key} o={legs * fout(f, tP)} />
        </>}
      </HalfEarthView>
      <Svg>
        <Keyword f={f} text="three directions = 3-D" at={[1080, 160]} appear={t3} out={t6} targets={[]} />
        <Keyword f={f} text="not a fourth direction" at={[1080, 260]} appear={t4} out={t6} targets={[]} />
      </Svg>
      <TeX s={EQ_OMCOS} x={1070} y={180} size={46} o={fin(f, t6)} />
      <TeX s={EQ_OMSIN} x={1070} y={270} size={46} o={fin(f, t6 + 20)} />
      <TeX s={EQ_OMLOC} x={1080} y={430} size={T.calc} c={ROT} o={fin(f, t7)} />
      <Svg>
        {["east", "north", "up"].map((w, i) => <Lbl key={w} x={[1300, 1470, 1690][i]} y={500} t={w} c={C.muted} s={T.floor} a="middle" o={fin(f, t7 + 10)} />)}
      </Svg>
      <TeX s={EQ_OMLOCN} x={1080} y={600} size={T.floor} c={ROT} o={fin(f, t7 + 30)} />
      <Svg><Lbl x={1080} y={720} t="pole: all up · equator: all north" c={C.key} s={T.key} o={fin(f, t8)} /></Svg>
    </Scene>
  );
};

// ================================================================ s28b Ω × u by the recipe; s28c the flat part; s28_f f
const LOC_K: OrbitKey = { f: 0, az: 235, el: 22, dist: 12, target: [0.5, 0.6, 1.0], pp: [500, 400] };
/** the local patch at 45°N: east (x), north (y), up (z = k); Ω leaning north-up with its legs; u flat; a daytime patch under it */
const LocalPatch: React.FC<{ f: number; st: CamState; uO?: number; legs?: number; upGlow?: number; arcO?: number; vert?: number; children?: React.ReactNode }> = ({
  st, uO = 1, legs = 1, upGlow = 0, arcO = 0, vert = 0, children }) => {
  const pr = projector(st, W3, H3);
  const patch = useTex(staticFile("cp/bmng_s31n.jpg"));
  const Lo = 2.4, om: V3 = [0, Lo * Math.cos(45 * D2R), Lo * Math.sin(45 * D2R)];
  const u: V3 = [2.6, 0, 0];
  return (
    <>
      <View3D st={st} o={patch ? 1 : 0}>
        {patch ? <mesh position={[0, 0, -0.01]}><planeGeometry args={[4.6, 4.6]} /><meshBasicMaterial map={patch} transparent opacity={0.7} /></mesh> : null}
        <Arrow3D from={[0, 0, 0]} to={[2, 0, 0]} color={C.local} px={6} head={24} />
        <Arrow3D from={[0, 0, 0]} to={[0, 2, 0]} color={C.local} px={6} head={24} />
        <Arrow3D from={[0, 0, 0]} to={[0, 0, 1.6]} color={ROT} px={6} head={24} />
        <Arrow3D from={[0, 0, 0]} to={om} color={ROT} px={12} head={40} />
        <Arrow3D from={[0, 0, 0]} to={u} color={C.first} o={uO} />
        {vert > 0 ? <Arrow3D from={u} to={add3(u, [0, 0, 0.9])} color={C.local} px={8} head={28} o={vert} /> : null}
      </View3D>
      <Svg>
        <L3 pr={pr} at={[2.2, -0.7, 0]} t="east" c={C.local} s={T.key} a="start" />
        <L3 pr={pr} at={[0, 2.35, 0]} t="north" c={C.local} s={T.key} />
        <L3 pr={pr} at={[0, 0, 1.75]} t="k" c={ROT} s={T.calc} dx={-36} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={om} t="Ω" c={ROT} s={T.calc} />
        <Seg3 pr={pr} a={[0, 0, 0]} b={[0, om[1], 0]} c={ROT} w={6} dash="12 8" o={legs} />
        <Seg3 pr={pr} a={[0, om[1], 0]} b={om} c={ROT} w={6 + 6 * upGlow} dash="12 8" o={legs} />
        <L3 pr={pr} at={[0, om[1] / 2, 0]} t="Ω cos φ" c={ROT} s={T.key} dx={-90} dy={40} o={legs} />
        <L3 pr={pr} at={[0, om[1], om[2] / 2]} t="Ω sin φ" c={ROT} s={T.key} a="start" dx={30} o={legs} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={u} t="u = (u, v, 0)" c={C.first} s={T.key} o={uO} />
        <Arc3 pr={pr} c0={[0, 0, 0.5]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={0.6} a0={0} a1={90} col={C.gold} w={6} o={arcO} />
        {children}
      </Svg>
    </>
  );
};
/** a small component table: column words, two rows of TeX cells, grey column with a rose strike, gold diagonals */
const TB = { x: [1300, 1500, 1700], ya: 380, yb: 490, yh: 300 };
const Table3: React.FC<{ f: number; rowA: string[]; rowB: string[]; cA: string; cB: string; grey: number; greyO: number; links: [number, number, number][]; o: number;
  heads?: string[]; labA?: string; labB?: string }> = ({ f, rowA, rowB, cA, cB, grey, greyO, links, o, heads = ["east", "north", "up"], labA, labB }) => {
  if (o <= 0) return null;
  return (
    <>
      <Svg>
        <g opacity={o}>
          {heads.map((w, i) => <Lbl key={w} x={TB.x[i]} y={TB.yh} t={w} c={C.muted} s={T.floor} a="middle" o={grey === i ? 1 - 0.7 * greyO : 1} />)}
          {links.map(([i, j, a0], n) => {
            const d = clamp((f - a0) / 12, 0, 1);
            if (d <= 0) return null;
            const p: Pt = [TB.x[i] + 20, TB.ya + 26], q: Pt = [TB.x[j] - 20, TB.yb - 30];
            const e = lerp(p, q, d);
            return <line key={n} x1={p[0]} y1={p[1]} x2={e[0]} y2={e[1]} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />;
          })}
          {grey >= 0 ? <line x1={TB.x[grey]} y1={TB.ya - 50} x2={TB.x[grey]} y2={TB.yb + 50} stroke={C.neg} strokeWidth={6} opacity={greyO} /> : null}
          {labA ? <Lbl x={1090} y={TB.ya} t={labA} c={cA} s={T.key} /> : null}
          {labB ? <Lbl x={1090} y={TB.yb} t={labB} c={cB} s={T.key} /> : null}
        </g>
      </Svg>
      {[0, 1, 2].map((i) => <TeX key={`a${i}`} s={rowA[i]} x={TB.x[i]} y={TB.ya} size={T.key} ax={0.5} c={cA} o={o * (grey === i ? 1 - 0.7 * greyO : 1)} />)}
      {[0, 1, 2].map((i) => <TeX key={`b${i}`} s={rowB[i]} x={TB.x[i]} y={TB.yb} size={T.key} ax={0.5} c={cB} o={o * (grey === i ? 1 - 0.7 * greyO : 1)} />)}
    </>
  );
};
const OXU_PARTS: Part[] = [{ t: String.raw`\boldsymbol\Omega\times\mathbf u` }, { t: "=" }, { t: "(" }, { t: String.raw`-\Omega\sin\varphi\,v` }, { t: String.raw`,\ ` },
  { t: String.raw`\Omega\sin\varphi\,u` }, { t: String.raw`,\ ` }, { t: String.raw`-\Omega\cos\varphi\,u` }, { t: ")" }];
if (plainOf(OXU_PARTS).replace(/\s/g, "") !== EQ_OXU.replace(/\s/g, "")) throw new Error("s28b parts ≠ EQ_OXU");
const S28B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28b_components");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const st = camOf([LOC_K], f);
  const grey = f < t4 ? 0 : f < t5 ? 1 : 2;
  const greyO = grey === 0 ? fin(f, t3, 10) * fout(f, t4, 10) : grey === 1 ? fin(f, t4 + 4, 10) * fout(f, t5, 10) : fin(f, t5 + 4, 10) * fout(f, SE(k, 5) - 10, 10);
  const links: [number, number, number][] = grey === 0 ? [[1, 2, t3 + 20], [2, 1, t3 + 60]] : grey === 1 ? [[2, 0, t4 + 20], [0, 2, t4 + 50]] : [[0, 1, t5 + 20], [1, 0, t5 + 60]];
  const slots = [AT(k, 3, "minus Omega sine phi"), AT(k, 4, "Omega sine phi times"), AT(k, 5, "minus Omega cosine phi")];
  return (
    <Scene>
      <LocalPatch f={f} st={st} uO={fin(f, t1)} />
      <Svg><Keyword f={f} text="flat wind" at={[1100, 160]} appear={AT(k, 0, "flat wind")} out={t2} targets={[]} /></Svg>
      <Table3 f={f} o={fin(f, t2 + 10)} grey={grey} greyO={greyO} links={links} cA={ROT} cB={C.first} labA="Ω:" labB="u:"
        rowA={["0", String.raw`\Omega\cos\varphi`, String.raw`\Omega\sin\varphi`]} rowB={["u", "v", "0"]} />
      <TeX s={String.raw`\boldsymbol\Omega\times\mathbf u = (\quad ${SLOT("east")}\quad ,\quad ${SLOT("north")}\quad ,\quad ${SLOT("up")}\quad )`} x={1420} y={160} size={48} ax={0.5} o={fin(f, t2) * fout(f, slots[0], 10)} />
      <Layered parts={OXU_PARTS} layers={[{ t: [0, 1, 2, 4, 6, 8], o: 1 }, { t: [3], o: fin(f, slots[0]) }, { t: [5], o: fin(f, slots[1]) }, { t: [7], o: fin(f, slots[2]) }]}
        x={1060} y={130} size={50} o={fin(f, slots[0])} />
      <TeX s={String.raw`\Omega\cos\varphi\times0 - \Omega\sin\varphi\times v = -\Omega\sin\varphi\,v`} x={1080} y={640} size={T.floor} o={fin(f, t3 + 30) * fout(f, t4)} />
      <TeX s={String.raw`\Omega\sin\varphi\times u - 0\times0 = \Omega\sin\varphi\,u`} x={1080} y={640} size={T.floor} o={fin(f, t4 + 30) * fout(f, t5)} />
      <TeX s={String.raw`0\times v - \Omega\cos\varphi\times u = -\Omega\cos\varphi\,u`} x={1080} y={640} size={T.floor} o={fin(f, t5 + 30)} />
    </Scene>
  );
};
const S28C: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28c_flat_part");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const st = camOf([LOC_K], f);
  const [KL, KR] = splitEq(EQ_KXUS), KP = eqPieces(KR);
  const [VL, VR] = splitEq(EQ_VERT), VP = eqPieces(VR);
  const glow12 = fin(f, 6) * fout(f, t4);
  return (
    <Scene>
      <LocalPatch f={f} st={st} upGlow={fin(f, t3)} arcO={fin(f, t3 + 10)} vert={fin(f, t4) * fout(f, t5 + 30)} />
      <Layered parts={OXU_PARTS} layers={[{ t: "all", o: 1 }, { t: [3, 5], tc: { 3: C.gold, 5: C.gold }, o: glow12 }, { t: [7], tc: { 7: C.local }, o: fin(f, t4) }, { x: [7], o: fin(f, AT(k, 5, "so we drop it")) }]}
        x={1050} y={110} size={44} />
      <TeX s={String.raw`=\ ${ctex(ROT, String.raw`\Omega\sin\varphi`)}\,(-v,\ u,\ 0)\ +\ \dots`} x={1060} y={220} size={T.calc} o={fin(f, t1)} />
      <CalcStack f={f} x={1240} y={320} size={44} rows={[
        { lhs: KL, rhs: KP[0], at: t2, h: 80 },
        { rhs: KP[1], at: AT(k, 2, "minus v, small u and zero"), cont: true, c: C.key, h: 80 },
      ]} o={fout(f, t5 - 10)} />
      <TeX s={String.raw`\text{flat part} = \Omega\sin\varphi\ \mathbf k\times\mathbf u`} x={1080} y={520} size={T.calc} c={ROT} o={fin(f, t3)} />
      <CalcStack f={f} x={1420} y={330} size={44} rows={[
        { lhs: VL, rhs: VP.slice(0, -1).join(" "), at: t5, h: 80 },
        { rhs: VP[VP.length - 1], at: AT(k, 5, "one thousandth"), cont: true, c: C.local, h: 80 },
      ]} o={fin(f, t5) * fout(f, t6)} />
      <Svg>
        <g opacity={fin(f, AT(k, 5, "ten thousand times")) * fout(f, t6)}>
          <rect x={1100} y={720} width={2} height={60} fill={C.local} />
          <Lbl x={1120} y={760} t="vertical ≈ 0.001 m/s²" c={C.local} s={T.floor} />
          <rect x={1100} y={790} width={700} height={50} fill={C.muted} opacity={0.7} />
          <Lbl x={1810} y={815} t="g ≈ 9.8" c={C.key} s={T.floor} a="end" />
        </g>
        <Lbl x={1100} y={660} t="≈ 10 000 × weaker" c={C.key} s={T.key} o={fin(f, AT(k, 5, "ten thousand times")) * fout(f, t6)} />
      </Svg>
      <TeX s={EQ_TOFKU} x={1060} y={640} size={64} o={fin(f, t6)} />
    </Scene>
  );
};
/** a small globe glyph (SVG) at latitude lat with the up-part of Ω drawn at the site, and a spinning ground disc */
const MiniGlobe: React.FC<{ x: number; y: number; lat: number; f: number; o?: number; spinRate?: number }> = ({ x, y, lat, f, o = 1 }) => {
  if (o <= 0) return null;
  const R = 110, la = lat * D2R;
  const site: Pt = [x + R * Math.cos(la), y - R * Math.sin(la)];
  const up: Pt = [Math.cos(la), -Math.sin(la)];
  const part = Math.sin(la);                        // up-part of Ω / |Ω|
  const L = 120 * Math.abs(part);
  const tip: Pt = [site[0] + up[0] * 120 * part, site[1] + up[1] * 120 * part];
  const ang = f * 0.08 * part;
  const tx: Pt = [-up[1], up[0]];
  const ell = Array.from({ length: 25 }, (_, i) => { const a = ang + (i / 24) * 1.6 * Math.PI; return [site[0] + tx[0] * 34 * Math.cos(a) + up[0] * 10 * Math.sin(a), site[1] + tx[1] * 34 * Math.cos(a) + up[1] * 10 * Math.sin(a)].join(","); }).join(" ");
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={R} fill="#22406a" stroke={C.ink} strokeWidth={3} />
      <line x1={x} y1={y - R - 30} x2={x} y2={y + R + 30} stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" />
      <line x1={x - R} y1={y} x2={x + R} y2={y} stroke={C.muted} strokeWidth={2} />
      <polyline points={ell} fill="none" stroke={C.gold} strokeWidth={4} opacity={Math.abs(part) > 0.05 ? 1 : 0.3} />
      {L > 4 ? <Arrow p={site} q={tip} color={part < 0 ? C.neg : ROT} w={8} head={26} dash={part < 0 ? "12 8" : undefined} /> : <circle cx={site[0]} cy={site[1]} r={8} fill={ROT} />}
      <circle cx={site[0]} cy={site[1]} r={7} fill={C.key} />
    </g>
  );
};
const S28F: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28_f");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const [F45_L, F45_R] = splitEq(EQ_F45), F45P = eqPieces(F45_R);
  const G = [{ x: 220, lat: 90, w: "pole", t: t3 }, { x: 520, lat: 45, w: "45°N", t: t5 }, { x: 820, lat: 0, w: "equator", t: t4 }];
  return (
    <Scene>
      <Svg>
        {G.map((g, i) => <g key={i}>
          <MiniGlobe x={g.x} y={420} lat={g.lat} f={f} o={fin(f, t2 + 8 * i) * (i === 2 ? fout(f, t7) : 1)} />
          <Lbl x={g.x} y={620} t={g.w} c={C.key} s={T.key} a="middle" o={fin(f, t2 + 8 * i) * (i === 2 ? fout(f, t7) : 1) * (1 + 0.5 * pulse(f, g.t, 30))} />
        </g>)}
        <g opacity={fin(f, t7)}>
          <MiniGlobe x={820} y={420} lat={-45} f={f} o={1} />
        </g>
        <Lbl x={820} y={620} t="45°S" c={C.neg} s={T.key} a="middle" o={fin(f, t7)} />
        <Keyword f={f} text="spin about up" at={[120, 160]} appear={t2} out={t5} targets={[]} />
        <Keyword f={f} text="like the merry-go-round" at={[120, 780]} appear={AT(k, 3, "like our merry-go-round")} out={t4} targets={[]} s={T.floor} />
        <Keyword f={f} text="no spin about up" at={[620, 780]} appear={t4} out={t5} targets={[]} s={T.floor} />
        <Lbl x={1080} y={720} t="φ < 0 → f < 0" c={C.neg} s={T.key} o={fin(f, AT(k, 7, "f are negative"))} />
        <Keyword f={f} text="Coriolis parameter" at={[1500, 140]} appear={AT(k, 0, "the Coriolis parameter")} targets={[]} s={T.floor} />
      </Svg>
      <TeX s={EQ_F} x={1080} y={140} size={T.calc} o={fin(f, 6)} />
      <Svg><line x1={1080} y1={195} x2={1420} y2={195} stroke={C.gold} strokeWidth={6} opacity={fin(f, 16)} /></Svg>
      <TeX s={EQ_FKU} x={1080} y={300} size={T.eq} c={ROT} o={fin(f, t1)} />
      <CalcStack f={f} x={1150} y={430} size={50} rows={[
        { lhs: F45_L, rhs: F45P[0], at: t5, h: 90 },
        { rhs: F45P[1], at: AT(k, 6, "one point zero three"), cont: true, c: C.key, h: 90 },
      ]} />
    </Scene>
  );
};

// ================================================================ s29 the turning rule; s30 how strong
const PATCHES = [{ x: 80, w: "Northern Hemisphere", fi: 0, img: "cp/bmng_s31n.jpg", crop: null as null | number[] },
  { x: 700, w: "equator", fi: 1, img: "cp/bmng.jpg", crop: [-14, 14, -6, 22] }, { x: 1320, w: "Southern Hemisphere", fi: 2, img: "cp/bmng_s31s.jpg", crop: null as null | number[] }];
/** a daytime imagery tile in a box (x, y, w, h): a whole patch JPG, or a lat/lon crop of the global Blue Marble */
const ImgTile: React.FC<{ x: number; y: number; w: number; h: number; img: string; crop: number[] | null; o?: number }> = ({ x, y, w, h, img, crop, o = 0.75 }) => {
  if (!crop) return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", opacity: o }}>
    <Img src={staticFile(img)} style={{ position: "absolute", left: (w - Math.max(w, h)) / 2, top: (h - Math.max(w, h)) / 2, width: Math.max(w, h), height: Math.max(w, h) }} /></div>;
  const [la0, la1, lo0, lo1] = crop;
  const sx = w / (((lo1 - lo0) / 360) * 5400), sy = h / (((la1 - la0) / 180) * 2700);
  const s = Math.max(sx, sy);
  return <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", opacity: o }}>
    <Img src={staticFile(img)} style={{ position: "absolute", width: 5400 * s, height: 2700 * s, left: -((lo0 + 180) / 360) * 5400 * s, top: -((90 - la1) / 180) * 2700 * s }} /></div>;
};
const S29: React.FC = () => {
  const f = useCurrentFrame(), k = K("s29_turn_rule");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4);
  const side = (cori.turn_rule as number[][]).map((a) => a[1]);
  return (
    <Scene>
      {PATCHES.map((p, i) => <ImgTile key={i} x={p.x} y={260} w={520} h={420} img={p.img} crop={p.crop} o={0.7 * fin(f, 6 + 6 * i)} />)}
      <Svg>
        {PATCHES.map((p, i) => {
          const cx = p.x + 260, cy = 470;
          const show = i === 0 ? fin(f, AT(k, 1, "flips it to the right")) : i === 2 ? fin(f, t3) : 0;
          const dir = Math.sign(side[p.fi]);
          return (
            <g key={i} opacity={fin(f, 6 + 6 * i)}>
              <rect x={p.x} y={260} width={520} height={420} fill="none" stroke={C.grid} strokeWidth={3} />
              <Arrow p={[cx - 40, cy]} q={[cx + 160, cy]} color={C.first} />
              <Lbl x={cx + 60} y={cy + 56} t="u = (10, 0) m/s" c={C.first} s={T.floor} a="middle" />
              <Arrow p={[cx - 40, cy]} q={[cx - 40, cy - 150]} color={ROT} o={0.5 * fin(f, AT(k, 1, "The term k cross u"))} />
              <Lbl x={cx - 20} y={cy - 170} t="k × u = (0, 10)" c={ROT} s={T.floor} a="start" o={0.7 * fin(f, AT(k, 1, "The term k cross u"))} />
              {dir !== 0 ? <Arrow p={[cx - 40, cy]} q={[cx - 40, cy - 150 * dir]} color={C.second} o={show} w={12} /> : null}
              {dir !== 0 ? <Lbl x={cx - 20} y={cy - 150 * dir + (dir > 0 ? -30 : 40)} t="−f k × u" c={C.second} s={T.floor} o={show} /> : null}
              <Lbl x={p.x + 260} y={720} t={p.w} c={C.key} s={T.key} a="middle" />
            </g>
          );
        })}
        <Lbl x={340} y={800} t="f > 0 · right" c={C.key} s={T.key} a="middle" o={fin(f, t2)} />
        <Lbl x={960} y={800} t="f = 0 · no turning" c={C.key} s={T.key} a="middle" o={fin(f, t4)} />
        <Lbl x={1580} y={800} t="f < 0 · left" c={C.neg} s={T.key} a="middle" o={fin(f, t3)} />
      </Svg>
      <TeX s={EQ_FKU} x={960} y={140} size={T.eq} ax={0.5} o={fin(f, 6)} />
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
      <ImgTile x={140} y={110} w={760} h={740} img="cp/bmng_s31n.jpg" crop={null} o={0.55} />
      <Svg>
        <rect x={140} y={110} width={760} height={740} fill="none" stroke={C.grid} strokeWidth={3} />
        <Grid P={mkP(160, 830, 70)} xr={[0, 10]} yr={[0, 10]} o={0.45} />
        {j > 0 ? <polyline points={trace} fill="none" stroke={C.gold} strokeWidth={5} /> : null}
        <circle cx={cx} cy={cy} r={6} fill={C.muted} opacity={fin(f, c0 + 30)} />
        <Arrow p={pos} q={uTip} color={C.first} />
        <Arrow p={pos} q={pTip} color={C.second} w={8} head={30} o={fin(f, t2)} />
        <RightTick at={pos} u1={unit(pos, uTip)} u2={unit(pos, pTip)} c={C.gold} o={fin(f, AT(k, 4, "at a right angle"))} />
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
        <Lbl x={1460} y={660} t="speed 10.0 m/s" c={C.first} s={T.key} o={fin(f, t5)} />
        <Keyword f={f} text="always ⟂" at={[1080, 660]} appear={AT(k, 4, "at a right angle")} targets={[]} />
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
  const t1 = SS(k, 1), tPat = AT(k, 1, "Patagonia"), t2 = SS(k, 2), t3 = SS(k, 3), tL = SS(k, 4), t5 = SS(k, 5);
  const c0 = t3 - 10, c1 = SE(k, 5) - 40;
  const Tend = (paths.t_h as number[])[paths.t_h.length - 1];
  const h = clamp((f - c0) / (c1 - c0), 0, 1) * Tend;
  const nI = Math.max(2, Math.round((h / Tend) * (paths.nh_track.length - 1)) + 1);
  const VW = 860, VH = 700, VY = 50;
  const views = [{ x: 80, tr: paths.nh_track as number[][], st: paths.nh_start as number[], lab: "45°N · France", sense: "clockwise · from above", img: "cp/bmng_s31n.jpg",
    box: { lat: [41, 49] as [number, number], lon: [-5.1569, 6.1569] as [number, number] }, turn: "right · towards the south", tT: t3, o: fin(f, t1 - 10, 16) },
    { x: 980, tr: paths.sh_track as number[][], st: paths.sh_start as number[], lab: "45°S · Patagonia · Argentina", sense: "anticlockwise · from above", img: "cp/bmng_s31s.jpg",
      box: { lat: [-49, -41] as [number, number], lon: [-75.1569, -63.8431] as [number, number] }, turn: "left · towards the north", tT: tL, o: fin(f, tPat - 6, 16) }];
  const dkm = paths.inertial_diameter_km;
  const loc = fout(f, t1 - 4, 16);
  return (
    <Scene>
      {loc > 0 ? <GlobeView cam={{ lat: 0, lon: -35, dist: 4.6, pp: [960, 430] }} o={loc}>
        {(G) => <>
          {[paths.nh_start as number[], paths.sh_start as number[]].map((s, i) => <circle key={i} cx={G.p(s[0], s[1])[0]} cy={G.p(s[0], s[1])[1]} r={34} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, 8 + 10 * i)} />)}
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
          <GlobeView cam={cam} x={v.x} y={VY} w={VW} h={VH} coast={0.6} grat={0} res50 o={v.o} drapes={[{ url: v.img, lat: v.box.lat, lon: v.box.lon, o: 1 }]}>
            {(G) => {
              const pts = v.tr.slice(0, nI).map((p) => [p[0], p[1]] as [number, number]);
              const head = G.p(pts[pts.length - 1][0], pts[pts.length - 1][1]);
              const s0 = G.p(v.st[0], v.st[1]);
              const sb0 = kmOff(cLat, cLon, -50, -150), sb1 = kmOff(cLat, cLon, 50, -150);
              const p0 = G.p(sb0[0], sb0[1]), p1 = G.p(sb1[0], sb1[1]);
              const dTop = kmOff(cLat, cLon, 150, dkm / 2), dBot = kmOff(cLat, cLon, 150, -dkm / 2);
              const q0 = G.p(dTop[0], dTop[1]), q1 = G.p(dBot[0], dBot[1]);
              const cc = G.p(cLat, cLon);
              const r = 0.45 * Math.abs(q1[1] - q0[1]);
              const cw = i === 0;
              const ePts = Array.from({ length: 25 }, (_, j) => { const a = (cw ? -1 : 1) * (Math.PI / 2) * (j / 24) + Math.PI / 4; return `${cc[0] + r * 0.6 * Math.cos(a)},${cc[1] - r * 0.6 * Math.sin(a)}`; });
              return <>
                <path d={coastPath(G, ne50.borders as number[][])} fill="none" stroke={C.key} strokeOpacity={0.45} strokeWidth={2} />
                <path d={llPath(G, pts, 1.0005)} fill="none" stroke={C.bg} strokeWidth={10} strokeLinecap="round" opacity={0.7 * fin(f, t2)} />
                <path d={llPath(G, pts, 1.0005)} fill="none" stroke={C.first} strokeWidth={6} strokeLinecap="round" opacity={fin(f, t2)} />
                <circle cx={s0[0]} cy={s0[1]} r={9} fill={C.key} stroke={C.bg} strokeWidth={2} />
                <circle cx={head[0]} cy={head[1]} r={10} fill={C.first} stroke={C.bg} strokeWidth={3} opacity={fin(f, t2)} />
                {h < 0.3 ? <Arrow p={head} q={[head[0] + 90, head[1]]} color={C.first} w={8} head={28} o={fin(f, t2)} /> : null}
                <line x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={C.ink} strokeWidth={4} opacity={fin(f, t2)} />
                <Lbl x={(p0[0] + p1[0]) / 2} y={p0[1] + 34} t="100 km" c={C.ink} s={T.floor} a="middle" o={fin(f, t2)} />
                <g opacity={fin(f, t5)}>
                  <line x1={q0[0]} y1={q0[1]} x2={q1[0]} y2={q1[1]} stroke={C.gold} strokeWidth={5} />
                  <line x1={q0[0] - 14} y1={q0[1]} x2={q0[0] + 14} y2={q0[1]} stroke={C.gold} strokeWidth={5} />
                  <line x1={q1[0] - 14} y1={q1[1]} x2={q1[0] + 14} y2={q1[1]} stroke={C.gold} strokeWidth={5} />
                  <Lbl x={q0[0] + 26} y={(q0[1] + q1[1]) / 2} t={`≈ ${Math.round(dkm)} km`} c={C.gold} s={T.key} a="start" />
                  <polyline points={ePts.join(" ")} fill="none" stroke={C.gold} strokeWidth={5} />
                </g>
              </>;
            }}
          </GlobeView>
          </div>
        );
      })}
      <Svg>
        {views.map((v, i) => <g key={i}>
          <Lbl x={v.x + VW / 2} y={VY + 70} t={v.lab} c={C.key} s={T.key} a="middle" o={v.o} />
          <Lbl x={v.x + VW / 2} y={VY + 140} t="10 m/s · east" c={C.first} s={T.floor} a="middle" o={fin(f, t2 + 10 * i) * fout(f, t3 + 30)} />
          <Lbl x={v.x + VW / 2} y={VY + VH + 36} t={v.turn} c={C.key} s={T.key} a="middle" o={fin(f, v.tT) * fout(f, t5)} />
          <Lbl x={v.x + VW / 2} y={VY + VH + 36} t={v.sense} c={C.key} s={T.key} a="middle" o={fin(f, t5 + 20)} />
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
      <GlobeView cam={cam}>
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
  const t3 = SS(k, 2), t5 = SS(k, 3), t6 = SS(k, 4), t7 = SS(k, 5), t8 = AT(k, 5, "towards the equator");
  const TR = useGlobalTrails();
  const cam = globePath([{ f: 0, lat: 10, lon: -20, dist: 4.3, pp: [600, 460] }, { f: t7, lat: 5, lon: -30, dist: 4.0, pp: [600, 460] },
    { f: t7 + 45, lat: 15, lon: -40, dist: 2.4, pp: [600, 470] }, { f: t7 + 90, lat: -15, lon: -20, dist: 2.4, pp: [600, 470] },
    { f: SE(k, 5) - 70, lat: 15, lon: -150, dist: 2.4, pp: [600, 470], hop: 0.8 }, { f: SE(k, 5), lat: -15, lon: -120, dist: 2.4, pp: [600, 470] }], f);
  const NA = HIGHS["N Atlantic"], SA = HIGHS["S Atlantic"];
  const bN = 70 * easeIO(clamp((f - AT(k, 1, "turns it to the right")) / 30, 0, 1));
  const bS = -70 * easeIO(clamp((f - AT(k, 2, "turned to the left")) / 30, 0, 1));
  const arrO = fin(f, 6) * fout(f, t5 + 20);
  const trades = fin(f, t5, 20);
  return (
    <Scene>
      <GlobeView cam={cam}>
        {(G) => <>
          <Streaks G={G} T={TR} fr={f + 400} o={1} stride={2} bright={(la) => (Math.abs(la) <= 30 ? 1 + 0.4 * trades : 1 - 0.55 * trades)} />
          <Lbl x={G.p(NA.lat, NA.lon)[0]} y={G.p(NA.lat, NA.lon)[1]} t="H" c={C.key} s={T.calc} a="middle" o={G.vis(NA.lat, NA.lon) ? fout(f, t5 + 20) : 0} />
          <Lbl x={G.p(SA.lat, SA.lon)[0]} y={G.p(SA.lat, SA.lon)[1]} t="H" c={C.key} s={T.calc} a="middle" o={G.vis(SA.lat, SA.lon) ? fout(f, t5 + 20) : 0} />
          <TurnArrow G={G} lat={NA.lat - 2.5} lon={NA.lon} az={180} d={22} bend={bN} o={arrO} push={fin(f, AT(k, 1, "turns it to the right"))} />
          <TurnArrow G={G} lat={SA.lat + 2.5} lon={SA.lon - 6} az={0} d={22} bend={bS} o={arrO * fin(f, t3)} push={fin(f, AT(k, 2, "turned to the left"))} />
          <LatCircle G={G} lat={15} c={C.gold} w={4} dash="14 10" o={fin(f, t6)} />
          <LatCircle G={G} lat={-15} c={C.gold} w={4} dash="14 10" o={fin(f, t6)} />
          {Array.from({ length: 18 }, (_, i) => {
            const la = i % 2 === 0 ? 15 : -15, lo = cam.lon - 40 + Math.floor(i / 2) * 10;
            if (!G.vis(la, lo)) return null;
            const p = G.p(la, lo), q = G.p(la - Math.sign(la) * 1.5, lo - 3);
            const ux = q[0] - p[0], uy = q[1] - p[1], L = Math.hypot(ux, uy) || 1, dx = ux / L, dy = uy / L;
            return <polyline key={i} points={`${p[0] - dy * 14 - dx * 10},${p[1] + dx * 14 - dy * 10} ${p[0] + dx * 10},${p[1] + dy * 10} ${p[0] + dy * 14 - dx * 10},${p[1] - dx * 14 - dy * 10}`}
              fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, t8)} />;
          })}
        </>}
      </GlobeView>
      <Svg>
        <Keyword f={f} text="turned right" at={[1300, 200]} appear={AT(k, 1, "turns it to the right")} out={t5} targets={[]} />
        <Keyword f={f} text="north-east trades" at={[1300, 290]} appear={AT(k, 1, "from the north east")} out={t5} targets={[]} />
        <Keyword f={f} text="turned left" at={[1300, 420]} appear={AT(k, 2, "turned to the left")} out={t5} targets={[]} />
        <Keyword f={f} text="south-east trades" at={[1300, 510]} appear={AT(k, 2, "from the south east")} out={t5} targets={[]} />
      </Svg>
      <Vignette id="v33" right={fin(f, t7 - 10, 30)} />
      <Svg>
        <Keyword f={f} text="trade winds" at={[1300, 230]} appear={AT(k, 3, "trade winds")} targets={[]} s={T.calc} />
        <Lbl x={1250} y={360} t="≈ 5–7 m/s" c={C.key} s={T.calc} o={fin(f, AT(k, 4, "five to seven"))} />
        <Lbl x={1250} y={440} t="towards the west" c={C.key} s={T.key} o={fin(f, AT(k, 4, "towards the west"))} />
        <Keyword f={f} text="towards the west and the equator" at={[1200, 760]} appear={AT(k, 5, "lean towards the west")} targets={[]} s={T.floor} />
      </Svg>
    </Scene>
  );
};
const S34: React.FC = () => {
  const f = useCurrentFrame(), k = K("s34_westerlies");
  const t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = AT(k, 4, "strongest over"), t6 = SS(k, 5), t7 = SS(k, 5) + 20, t8 = AT(k, 5, "the Coriolis turning");
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
      <GlobeView cam={cam}>
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
        <Keyword f={f} text="Southern Ocean" at={[1250, 660]} appear={AT(k, 4, "Southern Ocean")} out={t6} targets={[]} />
        <Lbl x={1300} y={260} t="pressure patterns" c={C.local} s={T.key} o={fin(f, AT(k, 5, "Pressure patterns"))} />
        <Lbl x={1300} y={340} t="friction" c={C.local} s={T.key} o={fin(f, AT(k, 5, "friction"))} />
        <Lbl x={1300} y={480} t="Coriolis turning" c={C.key} s={T.calc} o={fin(f, t8)} />
        <Lbl x={1300} y={570} t="→ east or west" c={C.key} s={T.calc} o={fin(f, AT(k, 5, "mostly east or west"))} />
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
  const t1 = SS(k, 1), tC = AT(k, 1, "south west coast of Florida"), t2 = AT(k, 1, "cloud bands curl"), t3 = SS(k, 2), t4 = AT(k, 2, "best estimate"), t5 = SS(k, 3);
  const t6 = SS(k, 4), t7 = AT(k, 4, "air from the south"), t8 = AT(k, 4, "air from the east"), t9 = SS(k, 5), t10 = SS(k, 6);
  const TRd = usIan();
  const spir = React.useMemo(() => pickSpiral(TRd, trI.centre), [TRd]);
  const eye = ian.eye as number[], hc = ian.hrrr_centre as number[];
  const ir = fin(f, t2, 20) * fout(f, t3 - 10, 20);
  const model = fin(f, t5 + 10, 20);
  // bending order: south arrow (az 180) on S8, east arrow (az 90) on S9, the rest on S10
  const az = ian.inward_az as number[];
  const bendAt = az.map((a) => (a === 180 ? AT(k, 4, "towards the east") : a === 90 ? AT(k, 4, "towards the north") : t9 + 10 + az.indexOf(a) * 6));
  const bend = bendAt.map((b) => 75 * easeIO(clamp((f - b) / 24, 0, 1)));
  const hi = f >= t7 && f < t8 ? az.indexOf(180) : f >= t8 && f < t9 ? az.indexOf(90) : -1;
  const RR = (ianRing.radius_km as number) ?? 150;
  const ring = Array.from({ length: 49 }, (_, i) => { const a = (i / 48) * 2 * Math.PI * 0.85; return kmOff(eye[0], eye[1], RR * Math.cos(a), RR * Math.sin(a)); });
  const band = Array.from({ length: 40 }, (_, i) => { const a = 0.4 + (i / 39) * 1.5 * Math.PI, r = 300 - 120 * (i / 39); return kmOff(eye[0], eye[1], r * Math.cos(a), r * Math.sin(a)); });
  const nSp = Math.round(clamp((f - t10) / (SE(k, 6) - t10), 0, 1) * (trI.L - 1));
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
          <SurfArrow G={G} pts={ring} c={C.gold} w={7} head={36} o={fin(f, AT(k, 5, "anticlockwise spin"))} />
          <Lbl x={G.p(28.6, -78.6)[0]} y={G.p(28.6, -78.6)[1]} t="Florida" c={C.key} s={T.floor} a="start" o={fin(f, t1) * fout(f, t5)} />
          <Keyword f={f} text="eye" at={[G.p(eye[0], eye[1])[0] - 160, G.p(eye[0], eye[1])[1] + 150]} appear={AT(k, 1, "called the eye")} out={t3} targets={[G.p(hc[0], hc[1])]} />
        </>}
      </GlobeView>
      <Vignette id="v36" right={1} />
      <Svg>
        <Lbl x={1360} y={150} t="Hurricane Ian · 28 September 2022" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 0, "twenty eighth"))} />
        <Lbl x={1340} y={380} t="≈ 67 m/s" c={C.key} s={T.calc} o={fin(f, AT(k, 2, "sixty seven")) * fout(f, t5 + 10)} />
        <Lbl x={1340} y={455} t="observed" c={C.local} s={T.key} o={fin(f, t4 + 10) * fout(f, t5 + 10)} />
        <Keyword f={f} text="3-km weather model" at={[1340, 260]} appear={AT(k, 3, "three kilometre grid")} targets={[]} s={T.floor} />
        <Keyword f={f} text="turned right" at={[1340, 380]} appear={AT(k, 4, "turned to the right")} out={AT(k, 5, "anticlockwise spin")} targets={[]} />
        <Keyword f={f} text="all the way round" at={[1300, 560]} appear={t9} out={AT(k, 5, "anticlockwise spin")} targets={[]} />
        <Keyword f={f} text="anticlockwise" at={[1300, 480]} appear={AT(k, 5, "anticlockwise spin")} targets={[]} />
        <Lbl x={1300} y={550} t="from above" c={C.key} s={T.key} o={fin(f, AT(k, 5, "seen from above"))} />
        <Keyword f={f} text="spirals inwards" at={[1300, 690]} appear={AT(k, 6, "spirals inwards")} targets={[]} />
      </Svg>
    </Scene>
  );
};
const S37: React.FC = () => {
  const f = useCurrentFrame(), k = K("s37_idai");
  const t3 = SS(k, 4), t4 = SS(k, 2), t5 = SS(k, 5), t6 = AT(k, 5, "turned to the left"), t7 = AT(k, 5, "clockwise"), t8 = SS(k, 6);
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
            <Lbl x={G.p(-16.4, 37.6)[0]} y={G.p(-16.4, 37.6)[1]} t="Mozambique" c={C.key} s={T.floor} a="middle" o={fin(f, AT(k, 1, "Mozambique")) * fout(f, t6)} />
            <Lbl x={G.p(-19.5, 46.5)[0]} y={G.p(-19.5, 46.5)[1]} t="Madagascar" c={C.key} s={T.floor} a="middle" o={fin(f, AT(k, 1, "Madagascar")) * fout(f, t4)} />
          </>}
        </GlobeView>
      </div>
      <div style={{ opacity: 1 - split }}><Vignette id="v37" right={fin(f, 70, 20)} /></div>
      {split > 0 ? <div style={{ opacity: split }}><SplitStorms f={f} k={k} t0={t8} cols={false} /></div> : null}
      <Svg>
        <Lbl x={1360} y={150} t="Cyclone Idai · 14 March 2019" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "fourteenth of March")) * (1 - split)} />
        <Keyword f={f} text="cyclone" at={[1340, 270]} appear={AT(k, 2, "called cyclones")} out={t8} targets={[]} s={T.calc} />
        <Lbl x={1340} y={390} t="≈ 54–59 m/s" c={C.key} s={T.calc} o={fin(f, AT(k, 3, "fifty four to fifty nine")) * fout(f, t6 + 20)} />
        <Lbl x={1340} y={470} t="observed" c={C.local} s={T.key} o={fin(f, AT(k, 3, "best estimates")) * fout(f, t6 + 20)} />
        <Lbl x={1340} y={400} t="f < 0" c={C.neg} s={T.calc} o={fin(f, AT(k, 5, "f is negative")) * fout(f, t8)} />
        <Keyword f={f} text="clockwise" at={[1340, 520]} appear={AT(k, 5, "clockwise")} out={t8} targets={[]} />
        <Lbl x={1340} y={590} t="from above" c={C.key} s={T.key} o={fin(f, AT(k, 5, "seen from above")) * fout(f, t8)} />
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
  const t1 = SS(k, 1), t2 = AT(k, 1, "r cross u"), t3 = SS(k, 2), t4 = AT(k, 2, "point up"), t5 = SS(k, 3), t6 = SS(k, 4), t8 = SS(k, 5);
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
        <Keyword f={f} text="anticlockwise → up" at={[510, 830]} a="middle" appear={t4} out={t6} targets={[]} />
        <CircleDot x={860} y={260} r={34} o={fin(f, t5)} />
        <CircleCross x={1760} y={260} r={34} o={fin(f, t6)} />
        <Lbl x={510} y={830} t="north: anticlockwise" c={C.key} s={T.key} a="middle" o={fin(f, t8)} />
        <Lbl x={1410} y={830} t="south: clockwise" c={C.key} s={T.key} a="middle" o={fin(f, t8 + 20)} />
      </Svg>
      <TeX s={EQ_RXU} x={960} y={130} size={T.calc} ax={0.5} c={ROT} o={fin(f, t2)} />
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
// ---- v4: ONE ROUND LOW (UV2-29): p = 996 hPa + 1 hPa per 100 km from the centre (geo.json -> round_low)
const RL = geo.round_low as { p0_hPa: number; hPa_per_100km: number; isobars_hPa: number[]; isobar_r_km: number[]; window_km: number; pin_km: number[] };
const pRound = (rkm: number) => RL.p0_hPa + RL.hPa_per_100km * (rkm / 100);
const pColR = (p: number) => DLUT[Math.round(clamp((p - 996) / 18, 0, 1) * (DLUT.length - 1))];
type RMap = { cx: number; cy: number; s: number };          // screen point of the low's centre, px per km
const RBOX = { x0: 80, y0: 50, x1: 1000, y1: 850 };
/** the round low map: colour rings, isobars drawn outward (`iso` 0..4), labels, 'L' disc, 'H' corners, pin */
const RoundLow: React.FC<{ g: RMap; o?: number; iso?: number; labels?: boolean; pin?: number; HL?: number; ticks?: boolean; hi?: number }> = ({ g, o = 1, iso = 4, labels = true, pin = 0, HL = 1, ticks = false, hi = -1 }) => {
  if (o <= 0) return null;
  const rings = Array.from({ length: 40 }, (_, i) => 2600 - i * 62);
  const pinP: Pt = [g.cx + RL.pin_km[0] * g.s, g.cy - RL.pin_km[1] * g.s];
  return (
    <g opacity={o}>
      <defs><clipPath id="rlclip"><rect x={RBOX.x0} y={RBOX.y0} width={RBOX.x1 - RBOX.x0} height={RBOX.y1 - RBOX.y0} /></clipPath></defs>
      <g clipPath="url(#rlclip)">
        <rect x={RBOX.x0} y={RBOX.y0} width={RBOX.x1 - RBOX.x0} height={RBOX.y1 - RBOX.y0} fill={pColR(pRound(2600))} />
        {rings.map((r, i) => <circle key={i} cx={g.cx} cy={g.cy} r={r * g.s} fill={pColR(pRound(r))} />)}
        {RL.isobar_r_km.map((r, i) => {
          const d = clamp(iso - i, 0, 1);
          if (d <= 0) return null;
          return <circle key={`i${i}`} cx={g.cx} cy={g.cy} r={r * g.s} fill="none" stroke="#ffffff" strokeOpacity={0.85} strokeWidth={hi === i ? 7 : 4}
            strokeDasharray={`${2 * Math.PI * r * g.s * d} 99999`} />;
        })}
        {labels ? RL.isobar_r_km.map((r, i) => (clamp(iso - i, 0, 1) > 0.5 ? <Lbl key={`l${i}`} x={g.cx - 0.5 * r * g.s - 8} y={g.cy + 0.866 * r * g.s + 4} t={`${RL.isobars_hPa[i]}`} c={C.ink} s={T.floor} a="end" /> : null)) : null}
        <circle cx={g.cx} cy={g.cy} r={200 * g.s} fill={pColR(996)} />
        <Lbl x={g.cx} y={g.cy} t="L" c={C.key} s={T.calc} a="middle" o={HL} />
        <Lbl x={RBOX.x0 + 60} y={RBOX.y0 + 60} t="H" c={C.ink} s={T.key} a="middle" o={HL} />
        <Lbl x={RBOX.x1 - 60} y={RBOX.y1 - 60} t="H" c={C.ink} s={T.key} a="middle" o={HL} />
        {pin > 0 ? <circle cx={pinP[0]} cy={pinP[1]} r={12} fill={C.key} stroke={C.bg} strokeWidth={3} opacity={pin} /> : null}
      </g>
      <rect x={RBOX.x0} y={RBOX.y0} width={RBOX.x1 - RBOX.x0} height={RBOX.y1 - RBOX.y0} fill="none" stroke={C.grid} strokeWidth={3} />
      {ticks ? <>
        <line x1={RBOX.x0 + 40} y1={RBOX.y1 - 40} x2={RBOX.x0 + 40 + 1000 * g.s} y2={RBOX.y1 - 40} stroke={C.ink} strokeWidth={5} />
        <Lbl x={RBOX.x0 + 40 + 500 * g.s} y={RBOX.y1 - 80} t="1000 km" c={C.ink} s={T.floor} a="middle" />
        <Arrow p={[RBOX.x1 - 60, RBOX.y0 + 170]} q={[RBOX.x1 - 60, RBOX.y0 + 90]} color={C.ink} w={6} head={22} />
        <Lbl x={RBOX.x1 - 60} y={RBOX.y0 + 205} t="north" c={C.ink} s={T.floor} a="middle" />
      </> : null}
    </g>
  );
};
const RL0: RMap = { cx: 540, cy: 410, s: 800 / 3600 };
const zoomRL = (z: number): RMap => { const p0: Pt = [RL0.cx, RL0.cy + 1000 * RL0.s]; const s = RL0.s * z; const q: Pt = [p0[0] + (540 - p0[0]) * (z - 1), p0[1] + (520 - p0[1]) * (z - 1)]; return { cx: q[0], cy: q[1] - 1000 * s, s }; };
// ---- the close-up strip south of the low: 1200 km × 400 km, 1008 hPa (south edge) to 1004 hPa (north edge), our place at its middle
type SG = { x0: number; y0: number; km: number };
const ST: SG = { x0: 120, y0: 230, km: 0.75 };
const sgX = (g: SG, xk: number) => g.x0 + xk * g.km, sgY = (g: SG, yk: number) => g.y0 + (400 - yk) * g.km;
const Strip: React.FC<{ g?: SG; o?: number; labels?: boolean; HL?: number; double?: boolean; wkm?: number }> = ({ g = ST, o = 1, labels = true, HL = 1, double = false, wkm = 1200 }) => {
  if (o <= 0) return null;
  const n = 30, W = wkm * g.km, H = 400 * g.km;
  const iso = double ? [0, 100, 200, 300, 400] : [0, 400];
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => <rect key={i} x={g.x0} y={g.y0 + (i * H) / n} width={W} height={H / n + 0.7} fill={pColR(1004 + (4 * (i + 0.5)) / n)} />)}
      {iso.map((yk) => <line key={yk} x1={g.x0} y1={sgY(g, yk)} x2={g.x0 + W} y2={sgY(g, yk)} stroke="#ffffff" strokeOpacity={0.85} strokeWidth={4} />)}
      {labels ? <><Lbl x={g.x0 + 14} y={sgY(g, 0) + 36} t="1008" c={C.ink} s={T.floor} /><Lbl x={g.x0 + 14} y={sgY(g, 400) - 26} t="1004" c={C.ink} s={T.floor} /></> : null}
      <rect x={g.x0} y={g.y0} width={W} height={H} fill="none" stroke={C.grid} strokeWidth={3} />
      <Lbl x={g.x0 + W / 2} y={g.y0 - 40} t="L (north)" c={C.key} s={T.key} a="middle" o={HL} />
      <Lbl x={g.x0 + W / 2} y={g.y0 + H + 56} t="H (south)" c={C.key} s={T.key} a="middle" o={HL} />
    </g>
  );
};

const S39: React.FC = () => {
  const f = useCurrentFrame(), k = K("s39_isobars");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const iso = clamp((f - t4 - 6) / 22, 0, 4);
  return (
    <Scene>
      <Svg>
        <RoundLow g={RL0} o={fin(f, 6, 16)} iso={iso} ticks pin={fin(f, t5 + 30)} />
        <Keyword f={f} text="pressure" at={[1150, 160]} appear={AT(k, 1, "Air presses")} targets={[]} />
        <Lbl x={1150} y={260} t="hectopascals: hPa" c={C.key} s={T.key} o={fin(f, AT(k, 2, "hectopascals"))} />
        <Lbl x={1150} y={360} t="≈ 1000 hPa" c={C.key} s={T.calc} o={fin(f, AT(k, 2, "about a thousand"))} />
        <Keyword f={f} text="one low" at={[1150, 470]} appear={AT(k, 3, "one low")} targets={[[RL0.cx + 40, RL0.cy]]} />
        <Keyword f={f} text="isobars" at={[1150, 580]} appear={AT(k, 4, "isobars")} targets={[[RL0.cx + 400 * RL0.s * 0.71 + 6, RL0.cy - 400 * RL0.s * 0.71]]} />
        <Keyword f={f} text="every 4 hPa" at={[1150, 690]} appear={AT(k, 5, "every four hectopascals")} targets={[]} />
        <Keyword f={f} text="our place" at={[RL0.cx + 60, RL0.cy + 1000 * RL0.s + 80]} appear={t5 + 30} targets={[]} s={T.floor} />
      </Svg>
    </Scene>
  );
};
const PIN_KM: [number, number] = [600, 300];
const S40: React.FC = () => {
  const f = useCurrentFrame(), k = K("s40_pressure_push");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const z = 1 + easeIO(clamp(f / 40, 0, 1));
  const g = zoomRL(z);
  const pin: Pt = [g.cx + RL.pin_km[0] * g.s, g.cy - RL.pin_km[1] * g.s];
  const PUSH: Part[] = [{ t: DF(EQ_PUSH), c: C.second, u: { w: String.raw`\text{pressure push (per kg)}`, c: C.second } }];
  return (
    <Scene>
      <Svg>
        <RoundLow g={g} pin={1 + 0.5 * pulse(f, 6, 30)} />
        <Arrow p={pin} q={[pin[0], pin[1] + 140]} color={C.second} o={fin(f, t1)} />
        <RightTick at={pin} u1={[1, 0]} u2={[0, 1]} o={fin(f, t2)} />
        <Arrow p={pin} q={[pin[0], pin[1] - 140]} color={C.second} dash="16 10" o={fin(f, t3)} />
        <Keyword f={f} text="our place" at={[1150, 140]} appear={6} out={t1} targets={[]} />
        <Keyword f={f} text="grad p → where pressure rises fastest" at={[1110, 140]} appear={t1} out={t3} targets={[]} s={T.floor} />
        <Keyword f={f} text="across the isobars, away from the low" at={[1110, 240]} appear={t2} out={t4} targets={[]} s={T.floor} />
        <Keyword f={f} text="high → low" at={[1150, 340]} appear={t3} targets={[]} />
        <Keyword f={f} text="density" at={[1150, 720]} appear={AT(k, 5, "density")} targets={[]} />
      </Svg>
      <TeX s={String.raw`\nabla p`} x={pin[0] + 24} y={pin[1] + 110} size={T.calc} c={C.second} o={fin(f, t1)} halo />
      <TeX s={String.raw`-\nabla p`} x={pin[0] + 24} y={pin[1] - 110} size={T.calc} c={C.second} o={fin(f, t3 + 8)} halo />
      <Layered parts={PUSH} layers={[{ t: "all", o: 1 }, { u: [0], o: fin(f, t4 + 30) }]} x={1150} y={430} size={T.eq} ay={0} o={fin(f, AT(k, 4, "minus one over rho"))} />
      <TeX s={String.raw`\rho \approx 1.2\ \mathrm{kg/m^3}`} x={1150} y={810} size={T.key} o={fin(f, AT(k, 5, "about one point two"))} />
    </Scene>
  );
};
const S40A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s40a_k_cross_gradp");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3);
  const g = zoomRL(2);
  const pin: Pt = [g.cx + RL.pin_km[0] * g.s, g.cy - RL.pin_km[1] * g.s];
  const turn = easeIO(clamp((f - AT(k, 0, "turned a quarter turn")) / 30, 0, 1));
  const a = (-90 + 90 * turn) * D2R;
  const tip: Pt = [pin[0] + 140 * Math.cos(a), pin[1] - 140 * Math.sin(a)];
  const walk = clamp((f - t3) / 60, 0, 1);
  return (
    <Scene>
      <Svg>
        <RoundLow g={g} pin={1} hi={f >= t2 ? 1 : -1} />
        <Arrow p={pin} q={[pin[0], pin[1] + 140]} color={C.second} />
        <Lbl x={pin[0] + 30} y={pin[1] + 130} t="∇p" c={C.second} s={T.key} />
        <Arrow p={pin} q={tip} color={ROT} o={fin(f, AT(k, 0, "turned a quarter turn"))} />
        <Arc P={(x, y) => [pin[0] + x, pin[1] - y]} a0={-90} a1={-90 + 90 * turn} r={70} c={C.gold} w={5} o={fin(f, AT(k, 0, "turned a quarter turn"))} />
        <CircleDot x={pin[0] - 50} y={pin[1] - 50} r={20} w={5} o={fin(f, 6)} />
        <Lbl x={pin[0] - 80} y={pin[1] - 50} t="k" c={ROT} s={T.key} a="end" o={fin(f, 6)} />
        <Lbl x={tip[0] + 20} y={tip[1] - 40} t="k × ∇p" c={ROT} s={T.key} o={fin(f, AT(k, 0, "turned a quarter turn") + 20)} />
        <Observer x={pin[0] + 60 + 140 * walk} y={pin[1] - 60} s={1.1} o={fin(f, t3)} />
        <Lbl x={pin[0]} y={pin[1] - 320} t="left: low" c={C.gold} s={T.key} a="middle" o={fin(f, AT(k, 3, "the low is on its left"))} />
        <Lbl x={pin[0]} y={pin[1] + 300} t="right: high" c={C.gold} s={T.key} a="middle" o={fin(f, AT(k, 3, "the high is on its right"))} />
        <Keyword f={f} text="grad p: south" at={[1100, 160]} appear={t1} targets={[]} c={C.second} />
        <Keyword f={f} text="k × grad p: east" at={[1100, 240]} appear={AT(k, 1, "points east")} targets={[]} c={ROT} />
        <Keyword f={f} text="along the isobars" at={[1100, 340]} appear={t2} targets={[]} />
      </Svg>
      <TeX s={EQ_KGP0} x={1100} y={460} size={T.eq} c={ROT} o={fin(f, AT(k, 0, "k cross grad p"))} />
    </Scene>
  );
};

const S41: React.FC = () => {
  const f = useCurrentFrame(), k = K("s41_adjust");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4);
  const c0 = t2, c1 = SE(k, 4) - 10;
  const tH = geo.adjust_t_h as number[], XY = geo.adjust_xy_km as number[][], UV = geo.adjust_uv as number[][];
  const Tmax = tH[tH.length - 1];
  const h = clamp((f - c0) / (c1 - c0), 0, 1) * Tmax;
  const n = Math.min(tH.length - 1, Math.floor((h / Tmax) * (tH.length - 1)));
  const Pp = (q: number[]): Pt => [sgX(ST, q[0]), sgY(ST, q[1] - 300 + 100)];   // the adjust run starts 100 km north of the strip's south edge
  const pos = XY[n], uv = UV[n], pp = Pp(pos);
  const fC = geo.f, push = (geo.push_m_s2 as number[])[1];
  const AS = 100 / push;
  const cor: Pt = [fC * uv[1] * AS, -(-fC * uv[0]) * AS];
  const trail = XY.slice(0, n + 1).map((q) => Pp(q).join(",")).join(" ");
  const avgY = 100 + (geo.loop_radius_km as number);
  const VS = 12;
  const strip = fin(f, 10, 30);
  return (
    <Scene>
      <Svg>
        <g opacity={1 - strip}><RoundLow g={zoomRL(2)} pin={1} /></g>
        <Strip o={strip} />
        <line x1={ST.x0} y1={sgY(ST, avgY)} x2={ST.x0 + 1200 * ST.km} y2={sgY(ST, avgY)} stroke={C.gold} strokeWidth={5} strokeDasharray="16 10" opacity={fin(f, AT(k, 4, "on average"))} />
        <polyline points={trail} fill="none" stroke={C.first} strokeWidth={4} opacity={0.9} />
        {Math.hypot(uv[0], uv[1]) > 0.3 ? <Arrow p={pp} q={[pp[0] + uv[0] * VS, pp[1] - uv[1] * VS]} color={C.first} w={8} head={30} /> : null}
        <Arrow p={pp} q={[pp[0], pp[1] - 100]} color={C.second} dash="14 9" w={8} head={30} o={fin(f, t2)} />
        {Math.hypot(...cor) > 4 ? <Arrow p={pp} q={[pp[0] + cor[0], pp[1] + cor[1]]} color={ROT} w={7} head={26} o={fin(f, AT(k, 2, "turns it to the right"))} /> : null}
        <circle cx={pp[0]} cy={pp[1]} r={11} fill={C.key} stroke={C.bg} strokeWidth={3} opacity={fin(f, t1)} />
        <g opacity={fin(f, c0)}><ClockGlyph x={1190} y={150} r={30} h={(h * 12) % 12} /><Lbl x={1240} y={150} t={`t = ${h.toFixed(0)} h`} c={C.key} s={T.key} /></g>
        <Keyword f={f} text="almost straight" at={[1170, 260]} appear={AT(k, 0, "almost straight")} out={t1} targets={[]} />
        <Keyword f={f} text="at rest" at={[1170, 260]} appear={AT(k, 1, "starts at rest")} out={t2} targets={[]} />
        <Keyword f={f} text="pressure push" at={[1170, 330]} appear={AT(k, 2, "pressure push")} targets={[]} c={C.second} />
        <Keyword f={f} text="Coriolis push" at={[1170, 420]} appear={AT(k, 2, "turns it to the right")} targets={[]} c={ROT} />
        <Keyword f={f} text="on average: along the isobars" at={[1170, 560]} appear={AT(k, 4, "on average")} targets={[]} s={T.floor} />
      </Svg>
    </Scene>
  );
};
const S41A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s41a_balance");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const avgY = 100 + (geo.loop_radius_km as number);
  const bx = 100 + 1000 * clamp(f / LEN(k), 0, 1);
  const bp: Pt = [sgX(ST, bx), sgY(ST, avgY)];
  const VS = 12, PL = 100;
  const turn = easeIO(clamp((f - t4) / 30, 0, 1));
  return (
    <Scene>
      <Svg>
        <Strip />
        <line x1={ST.x0} y1={bp[1]} x2={ST.x0 + 1200 * ST.km} y2={bp[1]} stroke={C.gold} strokeWidth={4} strokeDasharray="16 10" opacity={0.6} />
        <Arrow p={bp} q={[bp[0] + (geo.geo_speed as number) * VS, bp[1]]} color={C.first} w={8} head={30} />
        <Arrow p={bp} q={[bp[0], bp[1] - PL]} color={C.second} dash="14 9" w={8} head={30} o={fin(f, t2)} />
        <Arrow p={bp} q={[bp[0], bp[1] + PL]} color={ROT} w={8} head={30} o={fin(f, t2 + 20)} />
        <Lbl x={bp[0] - 70} y={bp[1] - PL / 2} t="=" c={C.gold} s={T.calc} a="middle" o={fin(f, t2 + 30)} />
        <Arc P={(x, y) => [bp[0] + x, bp[1] - y]} a0={0} a1={-90 * turn} r={60} c={C.gold} w={5} o={fin(f, t4)} />
        <circle cx={bp[0]} cy={bp[1]} r={11} fill={C.key} stroke={C.bg} strokeWidth={3} />
        <Lbl x={ST.x0 + 1200 * ST.km + 20} y={sgY(ST, 400) + 20} t="left: L" c={C.gold} s={T.key} o={fin(f, t5)} />
        <Lbl x={ST.x0 + 1200 * ST.km + 20} y={sgY(ST, 0) - 20} t="right: H" c={C.gold} s={T.key} o={fin(f, t5)} />
        <Keyword f={f} text="steady → pushes add to zero" at={[1100, 140]} appear={t1} out={t6} targets={[]} />
        <Keyword f={f} text="equal and opposite" at={[1100, 230]} appear={t2} out={t6} targets={[]} />
        <Keyword f={f} text="pressure push → low" at={[1100, 640]} appear={AT(k, 3, "points towards the low")} out={t6} targets={[]} c={C.second} />
        <Keyword f={f} text="Coriolis push → high" at={[1100, 720]} appear={AT(k, 3, "towards the high")} out={t6} targets={[]} c={ROT} />
        <Keyword f={f} text="quarter turn right" at={[1100, 800]} appear={t4} out={t6} targets={[]} />
        <Keyword f={f} text="geostrophic balance" at={[1100, 680]} appear={AT(k, 6, "geostrophic balance")} targets={[]} s={T.calc} />
        <Keyword f={f} text="geostrophic wind" at={[1100, 790]} appear={AT(k, 6, "geostrophic wind")} targets={[]} s={T.calc} />
      </Svg>
    </Scene>
  );
};

const S42: React.FC = () => {
  const f = useCurrentFrame(), k = K("s42_geo_equation");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const G0P: Part[] = [{ t: String.raw`-f\,\mathbf k\times\mathbf u`, c: ROT, u: { w: String.raw`\text{Coriolis push}`, c: ROT } }, { t: String.raw`- \frac{1}{\rho}\nabla p`, c: C.second, u: { w: String.raw`\text{pressure push}`, c: C.second } }];
  const [G0L, G0R] = splitEq(EQ_G0);
  if (plainOf(G0P).replace(/\s/g, "") !== G0L.replace(/\s/g, "")) throw new Error("s42 parts ≠ EQ_G0");
  const g2 = rep(rep(EQ_G2, String.raw`\mathbf k\times(\mathbf k`, String.raw`\textcolor{${C.gold}}{\mathbf k\times}(\mathbf k`), String.raw`\,\mathbf k\times\nabla p`, String.raw`\,\textcolor{${C.gold}}{\mathbf k\times}\nabla p`);
  const [G1L, G1R] = splitEq(EQ_G1), [G2L, G2R] = splitEq(g2), [KL, KR] = splitEq(EQ_KKU), [G3L, G3R] = splitEq(EQ_G3), [GL, GR] = splitEq(EQ_GEO);
  const turn1 = fin(f, t4 + 10, 20), turn2 = fin(f, t5, 20);
  const mx = 300, my = 330, L = 110;
  return (
    <Scene>
      <Svg>
        <g opacity={0.45}><Strip g={{ x0: 120, y0: 640, km: 0.3 }} labels={false} HL={0} /></g>
        <g opacity={fin(f, t4)}>
          <Arrow p={[mx, my]} q={[mx + L, my]} color={C.first} w={8} head={28} />
          <Arrow p={[mx, my]} q={[mx, my - L]} color={ROT} w={8} head={28} o={turn1} />
          <Arrow p={[mx, my]} q={[mx - L, my]} color={C.first} w={8} head={28} dash="12 8" o={turn2} />
          <Arc P={(x, y) => [mx + x, my - y]} a0={0} a1={90} r={60} c={C.gold} w={5} draw={turn1} />
          <Arc P={(x, y) => [mx + x, my - y]} a0={90} a1={180} r={60} c={C.gold} w={5} draw={turn2} />
          <Lbl x={mx + L + 20} y={my} t="u" c={C.first} s={T.key} />
          <Lbl x={mx + 10} y={my - L - 30} t="k × u" c={ROT} s={T.key} o={turn1} />
          <Lbl x={mx - L - 20} y={my} t="−u" c={C.first} s={T.key} a="end" o={turn2} />
        </g>
        <Keyword f={f} text="geostrophic wind" at={[1080, 810]} appear={AT(k, 7, "the geostrophic wind")} targets={[]} />
      </Svg>
      <CalcStack f={f} x={1240} y={60} size={56} maxLines={3} rows={[
        { lhs: { parts: G0P.map((q) => ({ ...q, t: DF(q.t) })), layers: [{ t: "all", o: 1 }, { u: [0, 1], o: fin(f, t1 + 30) }] }, rhs: G0R, at: t1, h: 230 },
        { lhs: DF(G1L), rhs: DF(G1R), at: t2, h: 150 },
        { lhs: DF(G2L), rhs: DF(G2R), at: t3, h: 150 },
        { lhs: KL, rhs: KR, at: t5, c: C.key, h: 110 },
        { lhs: G3L, rhs: DF(G3R), at: t6, h: 150 },
        { lhs: GL, rhs: DF(GR), at: t7, c: C.key, size: 76, h: 200, ul: AT(k, 7, "one over f rho") + 10, ulOff: 20 },
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
  const t1 = SS(k, 1), tK = AT(k, 1, "k cross turns it"), t2 = SS(k, 2), t3 = SS(k, 3);
  const g: SG = { x0: 120, y0: 430, km: 0.6 };
  const g2: SG = { x0: 1260, y0: 450, km: 0.45 };
  const pin: Pt = [sgX(g, 600), sgY(g, 200)];
  const rot = 90 * easeIO(clamp((f - tK - 10) / 30, 0, 1));
  const L = 120, a = (-90 + rot) * D2R;
  const tipA: Pt = [pin[0] + L * Math.cos(a), pin[1] - L * Math.sin(a)];
  const pin2: Pt = [sgX(g2, 600), sgY(g2, 200)];
  return (
    <Scene>
      <Svg>
        <Strip g={g} labels={false} />
        <Arrow p={pin} q={tipA} color={rot > 80 ? C.first : C.second} o={fin(f, t1)} />
        <Arc P={(x, y) => [pin[0] + x, pin[1] - y]} a0={-90} a1={-90 + rot} r={70} c={C.gold} w={5} o={fin(f, tK)} />
        <Lbl x={sgX(g, 1200) + 24} y={g.y0 + 40} t="low on the left" c={C.key} s={T.floor} a="start" o={fin(f, AT(k, 1, "with the low on the left"))} />
        <g opacity={fin(f, AT(k, 2, "the closer the isobars"))}>
          <Strip g={g2} labels={false} HL={0} double />
          <Arrow p={pin2} q={[pin2[0] + 2 * L, pin2[1]]} color={C.first} />
          <Lbl x={g2.x0 + 300 * g2.km * 2} y={g2.y0 + 400 * g2.km + 50} t="twice as close" c={C.key} s={T.key} a="middle" />
        </g>
        <Keyword f={f} text="closer → stronger" at={[1260, 340]} appear={AT(k, 2, "the stronger the wind")} out={t3 - 6} targets={[]} />
        <GlobeIcon x={1790} y={340} r={50} o={fin(f, t3)} />
      </Svg>
      <Layered parts={GEO_PARTS} layers={[{ t: "all", o: 1 }, { u: [4], o: fin(f, t1) }, { u: [3], o: fin(f, tK) }, { u: [2], o: fin(f, t2) }]} x={900} y={40} size={T.eq} ax={0.5} ay={0} o={fin(f, 6)} />
      <TeX s={String.raw`f \to 0`} x={1520} y={330} size={T.calc} c={C.neg} o={fin(f, AT(k, 3, "f goes to zero"))} />
      <Svg><Lbl x={1080} y={430} t="balance breaks down near the equator" c={C.key} s={T.floor} o={fin(f, AT(k, 3, "breaks down"))} /></Svg>
    </Scene>
  );
};
const S44: React.FC = () => {
  const f = useCurrentFrame(), k = K("s44_geo_numbers");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const G44: SG = { x0: 100, y0: 200, km: 1.05 };
  const pin: Pt = [sgX(G44, 600), sgY(G44, 200)];
  const bx = sgX(G44, 110), y1 = sgY(G44, 0), y2 = sgY(G44, 400);
  const [GPL, GPR] = splitEq(EQ_GP2), GPP = eqPieces(GPR);
  const [FRL, FRR] = splitEq(EQ_FRHO), FRP = eqPieces(FRR);
  const [UNL, UNR] = splitEq(EQ_U81), UNP = eqPieces(UNR);
  const [PAL, PAR] = splitEq(EQ_PA);
  const [CNL, CNR] = splitEq(EQ_CORN), CNP = eqPieces(CNR);
  const UNITS = String.raw`\frac{\mathrm{kg\,m^{-1}\,s^{-2}}\,/\,\mathrm m}{\mathrm{s^{-1}}\cdot\mathrm{kg\,m^{-3}}} = \mathrm{m/s}`;
  const UNITSX = String.raw`\frac{\cancel{\mathrm{kg}}\,\mathrm{m^{-1}}\,\mathrm{s^{-2}}\,/\,\mathrm m}{\mathrm{s^{-1}}\cdot\cancel{\mathrm{kg}}\,\mathrm{m^{-3}}} = \mathrm{m/s}`;
  const pushO = fin(f, t8);
  return (
    <Scene>
      <Svg>
        <Strip g={G44} wkm={850} />
        <g opacity={fin(f, t1)}>
          <line x1={bx} y1={y1} x2={bx} y2={y2} stroke={C.gold} strokeWidth={6} />
          <line x1={bx - 16} y1={y1} x2={bx + 16} y2={y1} stroke={C.gold} strokeWidth={6} /><line x1={bx - 16} y1={y2} x2={bx + 16} y2={y2} stroke={C.gold} strokeWidth={6} />
        </g>
        <Lbl x={bx + 30} y={(y1 + y2) / 2 - 36} t="4 hPa" c={C.gold} s={T.key} o={fin(f, AT(k, 1, "four hectopascals")) * fout(f, t8)} />
        <Lbl x={bx + 30} y={(y1 + y2) / 2 + 36} t="400 km" c={C.gold} s={T.key} o={fin(f, AT(k, 1, "four hundred kilometres")) * fout(f, t8)} />
        <Lbl x={bx + 30} y={y2 + 50} t="north ↑" c={C.key} s={T.floor} o={fin(f, AT(k, 1, "going north")) * fout(f, t8)} />
        <CurvedLink f={f} from={[bx + 30 + textW("400 km", T.key) + 16, (y1 + y2) / 2 + 36]} to={[1330, 180]} start={AT(k, 2, "four hundred thousand metres")} end={t4} ctl={[1000, 500]} />
        <circle cx={pin[0]} cy={pin[1]} r={10} fill={C.key} />
        <g opacity={fin(f, t3) * fout(f, t6)}>
          <Arrow p={pin} q={[pin[0], pin[1] + 110]} color={C.second} w={8} head={28} />
          <Lbl x={pin[0] - 20} y={pin[1] + 100} t="∇p" c={C.second} s={T.key} a="end" />
        </g>
        <g opacity={fin(f, t4) * fout(f, t6)}>
          <Arrow p={pin} q={[pin[0] + 120, pin[1]]} color={ROT} w={8} head={28} />
          <Lbl x={pin[0] + 130} y={pin[1] - 40} t="k × ∇p" c={ROT} s={T.key} a="start" />
        </g>
        <g opacity={fin(f, t6) * fout(f, t8)}>
          <Arrow p={pin} q={[pin[0] + 8.08 * 14, pin[1]]} color={C.first} />
          <Lbl x={pin[0] + 60} y={pin[1] - 50} t="u = (8.1, 0) m/s" c={C.first} s={T.key} a="middle" />
        </g>
        <g opacity={pushO}>
          <Arrow p={pin} q={[pin[0], pin[1] - 105]} color={C.second} dash="14 9" w={8} head={28} />
          <Arrow p={pin} q={[pin[0], pin[1] + 105]} color={ROT} w={8} head={28} />
          <Lbl x={pin[0] - 20} y={pin[1] - 80} t="(0, 8.3 × 10⁻⁴) m/s²" c={C.second} s={T.floor} a="end" />
          <Lbl x={pin[0] - 20} y={pin[1] + 90} t="(0, −8.3 × 10⁻⁴) m/s²" c={ROT} s={T.floor} a="end" />
          <Lbl x={pin[0] + 60} y={pin[1]} t="=" c={C.gold} s={T.calc} a="middle" />
        </g>
        <Keyword f={f} text="balanced ✓" at={[1100, 820]} appear={AT(k, 8, "both are about")} targets={[]} />
      </Svg>
      <CalcStack f={f} x={1290} y={60} size={46} maxLines={3} rows={[
        { lhs: String.raw`4\ \mathrm{hPa}`, rhs: String.raw`= 400\ \mathrm{Pa}`, at: t2, h: 90 },
        { lhs: GPL, rhs: GPP[0], at: AT(k, 2, "grad p has components"), h: 130 },
        { rhs: GPP[1], at: t3, cont: true, c: C.key, h: 80 },
        { lhs: splitEq(EQ_KGP)[0], rhs: splitEq(EQ_KGP)[1], at: t4, h: 90, lc: ROT },
        { lhs: FRL, rhs: FRP[0], at: t5, h: 80 },
        { rhs: FRP[1], at: AT(k, 5, "about one point two four"), cont: true, c: C.key, h: 80 },
        { lhs: UNL, rhs: UNP[0], at: t6, h: 130 },
        { rhs: rep(UNP[1], "8.1", String.raw`\mathbf{8.1}`), at: AT(k, 6, "eight point one"), cont: true, c: C.key, ul: AT(k, 6, "eight point one") + 10, h: 90 },
        { lhs: PAL, rhs: PAR, at: t7, h: 90 },
        { lhs: "", rhs: { raw: [{ s: UNITS, o: 1 - fin(f, AT(k, 7, "the units leave"), 10) }, { s: ctex(C.neg, UNITSX), o: fin(f, AT(k, 7, "the units leave"), 10) }] }, at: AT(k, 7, "per second squared"), h: 140 },
        { lhs: CNL, rhs: CNP[0], at: t8, h: 90, lc: ROT },
        { rhs: CNP[1], at: AT(k, 8, "both are about"), cont: true, c: C.key, h: 90 },
      ]} />
    </Scene>
  );
};

// ================================================================ s45–s46 Storm Ciarán
// ---- v4 (UV2-31): Storm Ciarán on the MODIS Aqua true-colour image of 2 Nov 2023 (plate carrée, drawn as an equidistant
// cylindrical map with standard parallel 52°N: x = (λ − λ0) cos 52° k, y = (φ1 − φ) k), with Natural Earth 10m coast,
// country and region borders; ERA5 isobars and 850 hPa winds at 12 UTC (storm.json, ciaran_lines.json).
const SBOX = storm.box as { lat: number[]; lon: number[] };
const MAPR = { x0: 80, y0: 50, x1: 1290, y1: 850 };
const SKY = 50, SKX = 50 * Math.cos(52 * D2R), SLON0 = -29.3, SLAT1 = 60.5;
const STIMG = storm.image as { lat_edges: number[]; lon_edges: number[] };
const sp = (lat: number, lon: number): Pt => [MAPR.x0 + (lon - SLON0) * SKX, MAPR.y0 + (SLAT1 - lat) * SKY];
const STORM_ARROWS = (storm.arrows as { lat: number; lon: number; geo: number[]; act: number[]; w10: number[]; r_km: number; coast_deg: number }[])
  .filter((a) => a.lat > 44.8 && a.lat < 60.2 && a.lon > -28.8 && a.lon < 9.6)
  .filter((a) => Math.abs((a.lat - 35) / 3 - Math.round((a.lat - 35) / 3)) < 1e-6 && Math.abs((a.lon + 50) / 3 - Math.round((a.lon + 50) / 3)) < 1e-6);
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
const mapVec = (lat: number, lon: number, u: number, v: number, s: number): Pt => { const p = sp(lat, lon); return [p[0] + s * u, p[1] - s * v]; };
const lineD = (lines: number[][]) => lines.map((ln) => { let d = ""; for (let j = 0; j < ln.length; j += 2) { const q = sp(ln[j + 1], ln[j]); d += `${j ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`; } return d; }).join("");
const STL = ciaranLines as unknown as { coast: number[][]; borders: number[][]; admin1: number[][] };
const D_COAST = lineD(STL.coast), D_BORD = lineD(STL.borders), D_ADM1 = lineD(STL.admin1);
const StormMap: React.FC<{ f: number; isoD: number; geoO: number; actO: number; w10O: number; arcO: number; crowdO: number; o?: number; lowO?: number; img?: number; bordHi?: number }> = ({
  f, isoD, geoO, actO, w10O, arcO, crowdO, o = 1, lowO = 1, img = 1, bordHi = 0 }) => {
  if (o <= 0) return null;
  const low = storm.low as number[];
  const isos = (storm.isobars as { hPa: number; pts: number[][] }[]).slice().sort((a, b) => a.hPa - b.hPa);
  const levels = Array.from(new Set(isos.map((i) => i.hPa))).sort((a, b) => a - b);
  const lp = sp(low[0], low[1]);
  const S = 2.2;
  const maxSp = Math.max(...STORM_ARROWS.map((a) => Math.hypot(a.geo[0], a.geo[1])));
  const arc = Array.from({ length: 40 }, (_, i) => { const a = (i / 39) * 1.6 * Math.PI + 0.3; return `${lp[0] + 210 * Math.cos(a)},${lp[1] - 210 * Math.sin(a)}`; });
  const ae = 0.3 + 1.6 * Math.PI, ax = lp[0] + 210 * Math.cos(ae), ay = lp[1] - 210 * Math.sin(ae), tx = -Math.sin(ae), ty = -Math.cos(ae);
  const iw = (STIMG.lon_edges[1] - STIMG.lon_edges[0]) * SKX, ih = (STIMG.lat_edges[1] - STIMG.lat_edges[0]) * SKY;
  const il = MAPR.x0 + (STIMG.lon_edges[0] - SLON0) * SKX, it = MAPR.y0 + (SLAT1 - STIMG.lat_edges[1]) * SKY;
  return (
    <>
      <div style={{ position: "absolute", left: MAPR.x0, top: MAPR.y0, width: MAPR.x1 - MAPR.x0, height: MAPR.y1 - MAPR.y0, overflow: "hidden", opacity: o, background: "#1b2a44" }}>
        <Img src={staticFile("cp/ciaran_modis.jpg")} style={{ position: "absolute", left: il - MAPR.x0, top: it - MAPR.y0, width: iw, height: ih, opacity: img }} />
      </div>
      <Svg>
        <g opacity={o}>
          <defs><clipPath id="stclip"><rect x={MAPR.x0} y={MAPR.y0} width={MAPR.x1 - MAPR.x0} height={MAPR.y1 - MAPR.y0} /></clipPath></defs>
          <g clipPath="url(#stclip)">
            <path d={D_ADM1} fill="none" stroke={C.key} strokeOpacity={0.3 + 0.3 * bordHi} strokeWidth={1.5} />
            <path d={D_BORD} fill="none" stroke={C.key} strokeOpacity={0.55 + 0.35 * bordHi} strokeWidth={2 + 2 * bordHi} />
            <path d={D_COAST} fill="none" stroke={C.key} strokeOpacity={0.7} strokeWidth={2} />
            {isos.map((iso, i) => {
              const li = levels.indexOf(iso.hPa);
              const d = clamp(isoD - li, 0, 1);
              if (d <= 0) return null;
              const dd = iso.pts.map((q, j) => `${j ? "L" : "M"}${sp(q[0], q[1]).map((v) => v.toFixed(1)).join(" ")}`).join("");
              return <g key={i}><path d={dd} fill="none" stroke={C.bg} strokeOpacity={0.5 * d} strokeWidth={6} /><path d={dd} fill="none" stroke="#ffffff" strokeOpacity={0.85 * d} strokeWidth={3} /></g>;
            })}
            {STORM_ARROWS.map((a, i) => {
              const p = sp(a.lat, a.lon);
              const pul = crowdO > 0 && Math.hypot(a.geo[0], a.geo[1]) > 0.8 * maxSp ? 1 + 0.35 * pulse(f % 60, 0, 60) : 1;
              return <g key={i}>
                {geoO > 0 ? <Arrow p={p} q={mapVec(a.lat, a.lon, a.geo[0], a.geo[1], S * pul)} color={ROT} w={6} head={20} o={geoO} /> : null}
                {actO > 0 ? <Arrow p={[p[0] + 5, p[1] + 5]} q={(([x, y]) => [x + 5, y + 5] as Pt)(mapVec(a.lat, a.lon, a.act[0], a.act[1], S))} color={C.first} w={6} head={20} o={actO} /> : null}
                {w10O > 0 ? <Arrow p={[p[0] + 5, p[1] + 5]} q={(([x, y]) => [x + 5, y + 5] as Pt)(mapVec(a.lat, a.lon, a.w10[0], a.w10[1], S))} color={C.first} w={6} head={20} o={w10O} /> : null}
              </g>;
            })}
            <polyline points={arc.join(" ")} fill="none" stroke={C.gold} strokeWidth={6} opacity={arcO} />
            <polyline points={`${ax - tx * 24 + ty * 12},${ay - ty * 24 - tx * 12} ${ax},${ay} ${ax - tx * 24 - ty * 12},${ay - ty * 24 + tx * 12}`} fill="none" stroke={C.gold} strokeWidth={6} opacity={arcO} />
            {(storm.crowd as number[][]).map((c, i) => { const q = sp(c[0], c[1]); return <circle key={i} cx={q[0]} cy={q[1]} r={48} fill="none" stroke={C.gold} strokeWidth={5} opacity={crowdO} />; })}
          </g>
          <Lbl x={lp[0]} y={lp[1]} t="L" c={C.key} s={T.calc} a="middle" o={lowO} />
          {[["France", 46.6, 2.5], ["England", 51.6, -2.4], ["Bretagne", 48.1, -3.0], ["Cornwall", 50.45, -4.9]].map(([t, la, lo]) => {
            const q = sp(la as number, lo as number);
            return <Lbl key={t as string} x={q[0]} y={q[1]} t={t as string} c={C.key} s={T.floor} a="middle" o={lowO * (1 - 0.6 * geoO)} />;
          })}
          <rect x={MAPR.x0} y={MAPR.y0} width={MAPR.x1 - MAPR.x0} height={MAPR.y1 - MAPR.y0} fill="none" stroke={C.grid} strokeWidth={3} />
        </g>
      </Svg>
    </>
  );
};
const S45: React.FC = () => {
  const f = useCurrentFrame(), k = K("s45_storm_map");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const cam = globePath([{ f: 0, lat: 5, lon: -40, dist: 4.3, pp: [640, 455] }, { f: t1 - 10, lat: 52, lon: -10, dist: 1.8, pp: [640, 455] }], f);
  const toMap = fin(f, t1 - 20, 24);
  const isoD = clamp((f - t3) / 6, 0, 40);
  return (
    <Scene>
      <div style={{ opacity: 1 - toMap }}><GlobeView cam={cam} res50 /><Vignette id="v45" /></div>
      <StormMap f={f} o={toMap} isoD={isoD} geoO={fin(f, t5, 16)} actO={0} w10O={0} arcO={fin(f, t6)} crowdO={fin(f, AT(k, 6, "longest where"))} lowO={fin(f, t3)}
        bordHi={pulse(f, AT(k, 2, "whose borders"), 40)} />
      <Svg>
        <Lbl x={1330} y={110} t="Storm Ciarán" c={C.key} s={T.calc} o={fin(f, AT(k, 1, "Storm Ciarán"))} />
        <Lbl x={1330} y={185} t="2 November 2023" c={C.key} s={T.key} o={fin(f, AT(k, 1, "second of November"))} />
        <Lbl x={1330} y={250} t="early afternoon" c={C.key} s={T.key} o={fin(f, AT(k, 1, "early in the afternoon"))} />
        <Keyword f={f} text="north-western France" at={[1330, 330]} appear={AT(k, 2, "north-western France")} out={t3} targets={[sp(48.2, -2.5)]} s={T.floor} />
        <Keyword f={f} text="southern England" at={[1330, 400]} appear={AT(k, 2, "southern England")} out={t3} targets={[sp(51.0, -1.5)]} s={T.floor} />
        <Lbl x={1330} y={320} t="same time" c={C.key} s={T.floor} o={fin(f, AT(k, 3, "at the same time"))} />
        <Lbl x={1330} y={380} t="isobars every 4 hPa" c={C.key} s={T.floor} o={fin(f, AT(k, 3, "every four hectopascals"))} />
        <g opacity={fin(f, t4)}>
          <line x1={1340} y1={640} x2={1820} y2={640} stroke={C.muted} strokeWidth={5} />
          {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={1350 + i * 80} y1={640} x2={1330 + i * 80} y2={660} stroke={C.muted} strokeWidth={3} />)}
          <line x1={1340} y1={470} x2={1820} y2={470} stroke={C.key} strokeWidth={3} strokeDasharray="12 9" />
          <Lbl x={1350} y={430} t="≈ 1.5 km" c={C.key} s={T.key} o={fin(f, AT(k, 4, "one and a half kilometres"))} />
          <Lbl x={1350} y={515} t="almost no friction" c={C.key} s={T.floor} o={fin(f, AT(k, 4, "almost no friction"))} />
          <Lbl x={1350} y={600} t="friction near the ground" c={C.local} s={T.floor} />
        </g>
        <Lbl x={1330} y={790} t="low on the left" c={C.key} s={T.key} o={fin(f, AT(k, 6, "the low on their left"))} />
      </Svg>
      <TeX s={DF(EQ_GEO)} x={1330} y={720} size={T.key} c={ROT} o={fin(f, AT(k, 5, "with our formula"))} />
    </Scene>
  );
};
const S46: React.FC = () => {
  const f = useCurrentFrame(), k = K("s46_real_winds");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const sw10 = fin(f, t5, 12) * fout(f, t7, 12);
  const act = fin(f, 6, 16) * (1 - sw10);
  const cmp = storm.compare as Record<string, { lat: number; lon: number; geo: number[]; act: number[]; w10: number[]; msl_geo: number[]; angle_10m: number }>;
  const zooms = [{ nm: "W flank", x: 1330, y: 270, n: "1" }, { nm: "North Sea", x: 1590, y: 270, n: "2" }];
  const Z = 240, ZS = 4.2;
  return (
    <Scene>
      <StormMap f={f} isoD={40} geoO={1} actO={act} w10O={sw10} arcO={0} crowdO={0} img={0.6} />
      <Svg>
        {zooms.map((z) => {
          const c = cmp[z.nm];
          const p = sp(c.lat, c.lon);
          const cx = z.x + Z / 2, cy = z.y + Z / 2;
          const vec = (u: number[]): Pt => [cx + u[0] * ZS, cy - u[1] * ZS];
          const iso = c.msl_geo, L = Math.hypot(iso[0], iso[1]);
          const isoPt: Pt = [cx + (iso[0] / L) * 110, cy - (iso[1] / L) * 110], isoPt0: Pt = [cx - (iso[0] / L) * 110, cy + (iso[1] / L) * 110];
          const a1 = Math.atan2(iso[1], iso[0]), a2 = Math.atan2(c.w10[1], c.w10[0]);
          const arc = Array.from({ length: 16 }, (_, i) => { const a = a1 + ((a2 - a1) * i) / 15; return `${cx + 96 * Math.cos(a)},${cy - 96 * Math.sin(a)}`; }).join(" ");
          return <g key={z.nm} opacity={fin(f, t2)}>
            <circle cx={cx} cy={cy} r={Z / 2} fill="#1b2a44" stroke={C.grid} strokeWidth={3} />
            <circle cx={p[0]} cy={p[1]} r={16} fill="none" stroke={C.gold} strokeWidth={4} />
            <Lbl x={p[0] + 24} y={p[1] - 24} t={z.n} c={C.gold} s={T.floor} />
            <Lbl x={cx - Z / 2 + 4} y={cy - Z / 2 + 16} t={z.n} c={C.gold} s={T.key} />
            <line x1={isoPt0[0]} y1={isoPt0[1]} x2={isoPt[0]} y2={isoPt[1]} stroke={C.key} strokeWidth={3} strokeDasharray="10 8" opacity={0.8} />
            <Arrow p={[cx, cy]} q={vec(c.geo)} color={ROT} w={7} head={26} halo={false} />
            <Arrow p={[cx, cy]} q={vec(c.act)} color={C.first} w={7} head={26} halo={false} o={1 - sw10} />
            <g opacity={sw10 * fin(f, AT(k, 6, "turns it partly across"))}>
              <polyline points={arc} fill="none" stroke={C.gold} strokeWidth={7} />
            </g>
            <Arrow p={[cx, cy]} q={vec(c.w10)} color={C.first} w={5} head={22} halo={false} o={sw10} />
          </g>;
        })}
        <g opacity={fin(f, AT(k, 1, "second colour"))}>
          <Arrow p={[1330, 120]} q={[1400, 120]} color={C.first} w={6} head={20} halo={false} />
          <Lbl x={1415} y={120} t={sw10 > 0.5 ? "real wind (10 m)" : "real wind (1.5 km)"} c={C.first} s={T.floor} />
          <Arrow p={[1330, 190]} q={[1400, 190]} color={ROT} w={6} head={20} halo={false} />
          <Lbl x={1415} y={190} t="geostrophic" c={ROT} s={T.floor} />
        </g>
        <Lbl x={1330} y={590} t="direction ✓" c={C.key} s={T.key} o={fin(f, t2 + 10) * fout(f, t5)} />
        <Lbl x={1330} y={670} t="speed ≈ 15 % less" c={C.key} s={T.key} o={fin(f, AT(k, 3, "about fifteen percent")) * fout(f, t5)} />
        <Keyword f={f} text="curved flow" at={[1330, 750]} appear={AT(k, 4, "racing round a sharp curve")} out={t5} targets={[]} />
        <Keyword f={f} text="friction: across the isobars," at={[1330, 620]} appear={AT(k, 6, "Friction slows")} out={t7} targets={[]} s={T.floor} />
        <Keyword f={f} text="towards the low" at={[1330, 680]} appear={AT(k, 6, "towards the low")} out={t7} targets={[]} s={T.floor} />
        <Lbl x={1330} y={590} t="direction ✓" c={C.key} s={T.key} o={fin(f, t7)} />
        <Lbl x={1330} y={670} t="speed ≈ 15 % less" c={C.key} s={T.floor} o={fin(f, t7)} />
        <Lbl x={1330} y={730} t="curved flow" c={C.key} s={T.floor} o={fin(f, t7)} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s47 recap, s48 end card
const S47: React.FC = () => {
  const f = useCurrentFrame(), k = K("s47_recap");
  const t = Array.from({ length: 10 }, (_, j) => SS(k, j));
  const beat = (j: number, jEnd?: number) => fin(f, t[j] + (j === 0 ? 4 : 0), 10) * (jEnd !== undefined ? fout(f, t[jEnd] - 6, 10) : 1);
  const st = orbitCam({ az: 221, el: 28, dist: 15, target: [2.2, 1.3, 1.2], pp: [560, 430] }, PP);
  const prS = projector(st, W3, H3);
  const hp = handPlace(A3, [0, 0, 1], 1.4);
  const FT = P(...ALONG);
  const Q = (x: number, y: number): Pt => [x - 60 + 0, y];
  return (
    <Scene>
      {beat(0, 1) + beat(3, 4) > 0 ? <div style={{ opacity: Math.min(1, beat(0, 1) + beat(3, 4)) }}>
        <PairFloor st={st} axb={1} para={beat(3, 4)}
          children={<Hand3D q={hp.q} at={hp.at} s={1.4} angles={POSE.curl(1)} o={beat(3, 4)} glow={{ thumb: ROT }} />}
          over={<>
            <Tick3 pr={prS} at={[0, 0, 0]} u1={AH} u2={[0, 0, 1]} s={0.55} o={beat(0, 1)} />
            <Tick3 pr={prS} at={[0, 0, 0]} u1={BH} u2={[0, 0, 1]} s={0.55} o={beat(0, 1)} />
            <TipL3 pr={prS} from={[0, 0, 0]} to={AXB3} t="a × b = (0, 0, 14)" c={ROT} s={T.key} />
          </>} />
      </div> : null}
      <PairTags o={beat(0, 1)} />
      <Svg>
        <g opacity={beat(2, 3)}>
          <polygon points={CORN.map((p) => Q(...p).join(",")).join(" ")} fill={ROT} fillOpacity={0.2} stroke={ROT} strokeWidth={3} />
          <Arrow p={Q(...O2)} q={Q(...ATIP)} color={C.first} />
          <Arrow p={Q(...O2)} q={Q(...BTIP)} color={C.second} o={0.5} />
          <Band p={Q(...O2)} q={Q(...FT)} color={C.first} o={0.8} />
          <Band p={Q(...FT)} q={Q(...BTIP)} color={ROT} o={0.8} />
          <Lbl x={Q(...FT)[0] - 30} y={(Q(...FT)[1] + Q(...BTIP)[1]) / 2} t="across" c={ROT} s={T.key} a="end" />
        </g>
        <g opacity={beat(4, 5)}>
          <Arrow p={[260, 330]} q={[260, 200]} color={ROT} w={10} />
          <line x1={150} y1={380} x2={380} y2={330} stroke="#c9d2e3" strokeWidth={18} strokeLinecap="round" />
          <Lbl x={260} y={440} t="τ = r × F" c={C.key} s={T.key} a="middle" />
          <circle cx={560} cy={330} r={70} fill="none" stroke={C.muted} strokeWidth={3} strokeDasharray="8 8" />
          <circle cx={630} cy={330} r={16} fill={C.second} />
          <Arrow p={[560, 330]} q={[560, 210]} color={ROT} w={10} />
          <Lbl x={560} y={440} t="L = r × p" c={C.key} s={T.key} a="middle" />
          <circle cx={860} cy={330} r={14} fill={C.key} />
          <Arrow p={[860, 330]} q={[960, 330]} color={C.first} w={8} />
          <Arrow p={[860, 330]} q={[860, 410]} color={C.second} w={8} />
          <Lbl x={860} y={470} t="F = q v × B" c={C.key} s={T.key} a="middle" />
          <circle cx={560} cy={660} r={110} fill="none" stroke={C.gold} strokeWidth={5} />
          <Arrow p={[560, 550]} q={[680, 550]} color={C.first} w={8} />
          <Arrow p={[560, 550]} q={[560, 620]} color={C.second} w={8} />
        </g>
        <g opacity={beat(5, 6)}>
          <circle cx={300} cy={430} r={150} fill="#22406a" stroke={C.ink} strokeWidth={3} />
          <line x1={300} y1={250} x2={300} y2={610} stroke={C.gold} strokeWidth={5} strokeDasharray="12 8" />
          <Arrow p={[300, 430]} q={[406, 324]} color={C.first} w={8} />
          <Arrow p={[406, 324]} q={[480, 360]} color={C.second} w={8} />
          <Disc cx={760} cy={430} s={45} ang={f / 60} />
        </g>
      </Svg>
      <CompTable f={f} o={beat(1, 2)} grey={-1} greyO={0} links={[[1, 2, t[1] + 10], [2, 1, t[1] + 30], [2, 0, t[1] + 50], [0, 2, t[1] + 70], [0, 1, t[1] + 90], [1, 0, t[1] + 110]]} dy={-20} />
      <TeX s={EQ_COMP} x={1830} y={790} size={46} ax={1} o={beat(1, 2)} />
      <TeX s={String.raw`\mathbf a\times\mathbf b\ \perp\ \mathbf a,\ \mathbf b`} x={1150} y={300} size={T.calc} o={beat(0, 1)} />
      <TeX s={EQ_SIN} x={1080} y={300} size={T.calc} o={beat(2, 3)} />
      <TeX s={String.raw`= |\mathbf a|\times\text{across} = \text{area}`} x={1240} y={420} size={T.calc} c={ROT} o={beat(2, 3)} />
      <Svg>
        <Lbl x={1100} y={420} t="normal · right-hand rule" c={C.key} s={T.calc} o={beat(3, 4)} />
        <Lbl x={1080} y={420} t="push ⟂ motion → turns, same speed" c={C.key} s={T.floor} o={beat(4, 5)} />
        <Lbl x={1100} y={560} t="north: right · south: left" c={C.key} s={T.key} o={beat(6, 8)} />
        <Lbl x={1100} y={640} t="storms spin" c={C.key} s={T.key} o={beat(7, 8)} />
        <Lbl x={1100} y={360} t="later videos: weather maps" c={C.key} s={T.key} o={beat(9)} />
        <Lbl x={1100} y={440} t="grad, div, curl" c={C.key} s={T.key} o={beat(9)} />
        <Lbl x={1100} y={520} t="∇   ∇·   ∇×" c={C.key} s={T.calc} o={beat(9)} />
      </Svg>
      <TeX s={EQ_VOR} x={1100} y={330} size={T.eq} o={beat(5, 6)} />
      <TeX s={EQ_COR} x={1100} y={470} size={T.eq} c={C.second} o={fin(f, AT(k, 5, "minus two Omega")) * fout(f, t[6] - 6)} />
      <TeX s={EQ_FKU} x={1100} y={420} size={T.eq} c={ROT} o={beat(6, 8)} />
      <div style={{ position: "absolute", left: 120, top: 220, width: 420, height: 320, overflow: "hidden", opacity: beat(6, 8) }}>
        <Img src={staticFile("cp/ian_tc.jpg")} style={{ width: 900, position: "absolute", left: -330, top: -230 }} />
      </div>
      <div style={{ position: "absolute", left: 580, top: 220, width: 420, height: 320, overflow: "hidden", opacity: beat(6, 8) }}>
        <Img src={staticFile("cp/idai_14.jpg")} style={{ width: 1000, position: "absolute", left: -210, top: -310 }} />
      </div>
      <Svg>
        <Lbl x={330} y={590} t="north: right" c={C.key} s={T.key} a="middle" o={beat(6, 8)} />
        <Lbl x={790} y={590} t="south: left" c={C.key} s={T.key} a="middle" o={beat(6, 8)} />
      </Svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: beat(8, 9), transform: "translate(40px, 150px) scale(0.6)", transformOrigin: "0 0" }}>
        <StormMap f={f} isoD={40} geoO={1} actO={0} w10O={0} arcO={0} crowdO={0} lowO={0} />
      </div>
      <TeX s={EQ_GEO} x={1080} y={420} size={T.eq} c={C.key} o={beat(8, 9)} />
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

const SCENES: React.FC[] = [S00, S01, S02, S03, S04, S05, S06, S07, S08, S09, S09A, S10, S11, S12, S13, S14, S15, S16, S17, S18, S18A, S18B, S18C,
  S20, S21, S22, S22A, S22B, S22C, S22D, S22E, S19, S23, S23A, S24, S25A, S25, S25B, S26, S26A, S26B, S26C, S26D, S27, S27A, S28A, S28B, S28C, S28F,
  S29, S30, S31, S32, S33, S34, S35, S36, S37, S38, S39, S40, S40A, S41, S41A, S42, S43, S44, S45, S46, S47, S48];
if (SCENES.length !== sc.length) throw new Error(`${SCENES.length} scene components but ${sc.length} scenes in timing.json`);

export const CrossProductWhy: React.FC<{ audio?: string }> = ({ audio = "narration_music.wav" }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {SCENES.map((S, k) => (
      <Sequence key={sc[k].id} name={sc[k].id} from={CUT[k]} durationInFrames={LEN(k) + (k < SCENES.length - 1 ? XF : 0)}><S /></Sequence>
    ))}
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
