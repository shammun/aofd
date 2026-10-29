import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { ramp } from "../house";
import timing from "../../ch00/ch00_cross_product_why/timing.json";
import timingP1 from "../../ch00/ch00_cross_product/timing.json";
import timingP2 from "../../ch00/ch00_cross_product_uses/timing.json";
import v5 from "../../ch00/ch00_cross_product_why/data/v5.json";
import titleSpin from "../../ch00/ch00_cross_product_uses/data/title_spin.json";
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
import { C, FONT, T } from "../house/kit/type";
import { Arc, Arrow, Band, Bracket, Dash, Grid, Lbl, Pt, RightTick, Strike, Svg, add, clamp, lerp, mkP, pulse, textW, unit } from "../house/kit/draw";
import { CalcRow, CalcStack, Layer, Layered, Part, TeX, col, eqPieces, plainOf, rep, splitEq, texHtml } from "../house/kit/tex";
import { Keyword, TipLabel, placeLabels } from "../house/kit/notes";
import { RiseText, TitleGradient } from "../house/kit/title";
import { Check, ClockGlyph, Notebook } from "../house/kit/icons";
import { CamState, D2R, OrbitKey, Projector, V3, add3, cross3, dot3, easeIO, len3, lerp3, mul3, norm3, orbitCam, orbitPath, projector, sub3 } from "./kit_cp/cam";
import { Arrow3D, Ball3D, Plane3D, Quad3D, Rod3D, View3D } from "./kit_cp/three3d";
import { HAND_PTS, Hand3D, POSE, fingerTipLocal, handPoint, handQuat, slerpQ } from "./kit_cp/hand";
import { BottleCap3D, Door3D, Screw3D, Spanner3D } from "./kit_cp/objects";
import { Arc3, CircleCross, CircleDot, DoorIcon, FloorGrid, GlobeIcon, L3, MinusGlyph, Observer, Poly3, Seg3, TailSketch, Tick3, TipL3, TipSketch, TurntableIcon, VIOLET, mid3 } from "./kit_cp/svg3d";
import { BoxProbe } from "./kit_cp/bbox";
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
const HOLD = 75; // 2.5-s silent end-card hold
const XF = 10; // cross-fade frames between scenes
/** v5 (2026-10-28): one set of scene components, three movies (v5, Part 1, Part 2), each with its own measured timing.json.
 * The composition root sets the active timing before its scenes render (one composition per render tab). */
type TM = typeof timing;
type Act = { sc: TM["scenes"]; CUT: number[]; END: number[]; total: number; idx: Map<string, number> };
const mkAct = (t: TM): Act => {
  const s = t.scenes, total = t.total_frames + HOLD;
  const CUT = s.map((x, i) => (i === 0 ? 0 : Math.round(x.start * FPS)));
  return { sc: s, CUT, END: [...CUT.slice(1), total], total, idx: new Map(s.map((x, i) => [x.id, i])) };
};
const ACT_V5 = mkAct(timing), ACT_P1 = mkAct(timingP1 as TM), ACT_P2 = mkAct(timingP2 as TM);
let A: Act = ACT_V5;
export const CPW_FRAMES = ACT_V5.total, CP1_FRAMES = ACT_P1.total, CP2_FRAMES = ACT_P2.total;
const K = (id: string) => {
  const i = A.idx.get(id);
  if (i === undefined) throw new Error(`scene ${id} is not in the active timing.json`);
  return i;
};
const LEN = (k: number) => A.END[k] - A.CUT[k];
/** start / end frame of sentence j of scene k, relative to the scene's first frame */
const SS = (k: number, j: number) => Math.round(A.sc[k].sentences[j].start * FPS) - A.CUT[k];
const SE = (k: number, j: number) => Math.round(A.sc[k].sentences[j].end * FPS) - A.CUT[k];
/** frame (scene-relative) at which `phrase` is spoken in sentence j of scene k (clip-proportional character time) */
const AT = (k: number, j: number, phrase: string) => {
  const s = A.sc[k].sentences[j];
  if (!s) throw new Error(`${A.sc[k].id} has no sentence ${j}`);
  const i = s.text.indexOf(phrase);
  if (i < 0) throw new Error(`phrase "${phrase}" not in ${A.sc[k].id} sentence ${j}`);
  return Math.round((s.start + ((s.end - s.start) * i) / s.text.length) * FPS) - A.CUT[k];
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
const sgnI = (v: number) => (Math.abs(v) < 1e-9 ? "0" : v > 0 ? `${v}` : `−${Math.abs(v)}`);
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
const Bracket3: React.FC<{ pr: ReturnType<typeof projector>; h: number; o?: number; t?: string; off?: V3; left?: boolean; lf?: number }> = ({ pr, h, o = 1, t = "14", off = BR_OFF, left = false, lf = 0.5 }) => {
  if (o <= 0) return null;
  const a = off, b = add3(off, [0, 0, h]), e: V3 = left ? [0.14, -0.14, 0] : [-0.14, 0.14, 0];
  return (
    <g opacity={o}>
      <Seg3 pr={pr} a={a} b={b} c={C.gold} w={5} />
      <Seg3 pr={pr} a={a} b={add3(a, e)} c={C.gold} w={5} />
      <Seg3 pr={pr} a={b} b={add3(b, e)} c={C.gold} w={5} />
      <L3 pr={pr} at={add3(off, [0, 0, h * lf])} t={t} c={C.gold} s={T.key} dx={left ? -44 : 44} a={left ? "end" : "middle"} />
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
        {lab([3.0, -0.42, 0], "5", C.first, oA, "middle", 16)}{lab([5.42, 0.22, 0], "1", C.first, oA, "start")}</> : null}
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
const TitleScene: React.FC<{ variant: "v5" | "p1" }> = ({ variant }) => {
  const f = useCurrentFrame(), k = K("s00_title");
  const p1 = variant === "p1";
  const tMet = AT(k, 0, p1 ? "physics" : "meteorology"), tEasy = AT(k, 0, p1 ? "the easy way" : "learn about");
  const tBall = p1 ? AT(k, 0, "spinning a ball") : 1e9;
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
        {/* v5: the subtitle on two lines, ≥ 50 px clear of the animation column (phone-review rule) */}
        <RiseText f={f} t={p1 ? "and how physics" : "and how meteorology"} x={106} y={650} s={68} at={38} fill={C.key} colors={(i) => (i >= 8 ? C.first : undefined)} />
        <RiseText f={f} t="uses it" x={106} y={730} s={68} at={48} fill={C.key} />
        <defs><clipPath id="tbclip"><rect x={1140} y={TBOX.y} width={1840 - 1140} height={TBOX.h} /></clipPath></defs>
        <g opacity={oA} clipPath="url(#tbclip)"><FloorGrid pr={prA} xr={[-2, 4]} yr={[-2, 3]} o={0.55} /></g>
      </Svg>
      <View3D st={camA} x={TBOX.x} y={TBOX.y} w={TBOX.w} h={TBOX.h} o={oA}>
        <Quad3D pts={[[0, 0, 0.003], [3, 0, 0.003], [3 + qv[0], qv[1], 0.003], [qv[0], qv[1], 0.003]]} color={ROT} o={0.18} />
        <Arrow3D from={[0, 0, 0]} to={[3, 0, 0]} color={C.first} />
        <Arrow3D from={[0, 0, 0]} to={qv} color={C.second} />
        {!zero ? <Arrow3D from={[0, 0, 0]} to={top} color={ROT} px={14} head={44} dash={neg} /> : null}
      </View3D>
      {!p1 ? <View3D st={gc} x={GB.x} y={GB.y} w={GB.w} h={GB.h} o={tex ? oB : 0} key3={gc.pos} amb={1.6} dir={1.4}>
        <GlobeMesh tex={tex} M={M} />
      </View3D> : null}
      {p1 ? <MiniDoor f={f} box={TBOX} o={oB * fout(f, tBall, 12)} swing={(28 * D2R) * easeIO(clamp((f - tMet - 20) / 40, 0, 1))} tau={easeIO(clamp((f - tMet - 20) / 40, 0, 1))} /> : null}
      {p1 ? <MiniBall f={f} box={TBOX} o={fin(f, tBall, 12)} ang={2 * Math.PI * 0.3 * clamp((f - tBall) / FPS, 0, 99)} /> : null}
      <Svg>
        <g opacity={oA}>
          <TipL3 pr={prA} from={[0, 0, 0]} to={[3, 0, 0]} t="p" c={C.first} s={T.calc} />
          <TipL3 pr={prA} from={[0, 0, 0]} to={qv} t="q" c={C.second} s={T.calc} />
          {!zero ? <L3 pr={prA} at={top} t={neg ? "−" : ""} c={C.neg} s={68} dx={40} /> : null}
          <Lbl x={1335} y={705} t={`= (0, 0, ${sgn(pz)})`} c={neg ? C.neg : zero ? C.muted : ROT} s={T.key} />
        </g>
        <defs><clipPath id="gbclip"><rect x={GB.x} y={GB.y} width={GB.w} height={GB.h} /></clipPath></defs>
        <g opacity={p1 ? 0 : oB} clipPath="url(#gbclip)">
          <path d={coastPath(G, ne110.coastline as number[][])} fill="none" stroke={C.key} strokeOpacity={0.4} strokeWidth={1.5} />
          {n > 2 ? <SurfArrow G={G} pts={trk} c={C.first} w={12} head={44} /> : null}
        </g>
      </Svg>
      <TeX s={EQ_PXQ} x={1325} y={705} size={T.key} ax={1} c={C.ink} o={oA} />
    </Scene>
  );
};
const S00: React.FC = () => <TitleScene variant="v5" />;

// ================================================================ s01 hook
const HookScene: React.FC<{ variant: "v5" | "p1" }> = ({ variant }) => {
  const f = useCurrentFrame(), k = K("s01_hook");
  const g = easeIO(clamp(f / 30, 0, 1));
  const p1 = variant === "p1";
  const tWhy = AT(k, 1, "why it's built"), tWind = AT(k, 1, p1 ? "about turning" : "about the wind");
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
          {p1 ? <DoorIcon x={1450} y={600} s={0.9} o={0.6 * win(f, tWind, Math.min(tWind + 70, LEN(k) - 12))} />
            : <GlobeIcon x={1450} y={690} r={110} o={0.6 * win(f, tWind, Math.min(tWind + 70, LEN(k) - 12))} />}
        </>} />
      <TeX s={ctex(C.first, String.raw`\mathbf a`) + ctex(ROT, String.raw`\times`) + ctex(C.second, String.raw`\mathbf b`)} x={1450} y={330} size={T.hero} ax={0.5} o={fin(f, SS(k, 0), 10)} />
      <PairTags />
    </Scene>
  );
};
const S01: React.FC = () => <HookScene variant="v5" />;

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
      <Layered parts={COSP} layers={[{ t: "all", o: 1 }, { u: [1, 2], o: fin(f, t2 + 30) }]} x={1240} y={520} size={T.calc} ay={0} o={fin(f, t2) * oMath} />
      <TeX s={splitEq(EQ_COSSH)[0]} x={1220} y={520} size={T.calc} ax={1} ay={0} o={fin(f, t2) * oMath} />
      <TeX s={EQ_VGT} x={1100} y={300} size={T.calc} o={fin(f, t3 + 14)} glow={p8} />
      <TeX s={String.raw`\mathbf a\cdot\mathbf b = 8`} x={640} y={808} size={T.calc} o={fin(f, t3 + 20) * shrink} glow={p8} />
    </Scene>
  );
};

// ================================================================ s03 the door
const DOOR_K: OrbitKey = { f: 0, az: 238, el: 40, dist: 5.6, target: [0.5, 0.4, 0.85], pp: [500, 460] };
const doorPts = (sw: number, hx = 0.9) => {
  const c = Math.cos(sw), s = Math.sin(sw);
  const R = (v: V3): V3 => [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
  return { R, hand: R([hx, 0.06, 0.95]), base: R([0, 0.06, 0.95]) };
};
const DoorScene: React.FC<{ f: number; swing: number; showR: number; showF: number; Fdir: "perp" | "along" | "back"; tau?: number; tauNeg?: boolean;
  over?: React.ReactNode; tick?: number; handX?: number; dot?: number }> = ({ swing, showR, showF, Fdir, tau = 0, tauNeg = false, over, tick = 0, handX = 0.9, dot = 0 }) => {
  const st = orbitCam(DOOR_K, PP);
  const pr = projector(st, W3, H3);
  const D = doorPts(swing, handX);
  const Fv: V3 = Fdir === "perp" ? D.R([0, 0.85, 0]) : Fdir === "back" ? D.R([0, -0.85, 0]) : D.R([-0.75, 0, 0]);
  const Fbase = Fdir === "along" ? add3(D.R([handX, 0.22, 0.95]), [0, 0, 0.28]) : Fdir === "back" ? D.R([handX, -0.06, 0.95]) : D.hand;
  const guide: V3[] = Array.from({ length: 31 }, (_, i) => { const a = (i / 30) * Math.PI / 2; return [Math.cos(a), Math.sin(a), 0]; });
  // UV2-04 / UV2-12: the 'r' label sits under the middle of r, on the door face, never at the door's edge or the frame edge
  const rMid = pr.p(add3(D.base, sub3(D.hand, D.base), 0.45));
  const rx = clamp(rMid[0], 120, 960), ry = clamp(rMid[1] + 62, 80, 820);
  const hp = pr.p(D.hand);
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
        {/* v5 R3-S3: the right-angle tick between r and F belongs to the door (drawn in the door's frame, so it swings with it) */}
        {tick > 0 ? <RightTickProj pr={pr} at={D.hand} u1={D.R([-1, 0, 0])} u2={D.R([0, 1, 0])} o={tick} /> : null}
        {dot > 0 ? <circle cx={hp[0]} cy={hp[1]} r={16} fill={C.gold} opacity={dot} /> : null}
        <Lbl x={rx} y={ry} t="r" c={C.first} s={T.calc} a="middle" o={showR} />
        <TipL3 pr={pr} from={Fbase} to={add3(Fbase, Fv)} t="F" c={C.second} s={T.calc} o={showF} />
        {over}
      </Svg>
    </>
  );
};
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_door");
  // v5: sentences 2-4 are new (push near / far from the hinge); the v4 sentences 2-8 are now 5-11
  const tFar = SS(k, 2), tEasy = AT(k, 2, "swings open easily"), tNear = SS(k, 3), tHard = AT(k, 3, "a much bigger push");
  const t2 = SS(k, 5), t3 = SS(k, 6), t4 = SS(k, 7), tZero = AT(k, 7, "is zero"), tTurn = AT(k, 8, "the door turns the most");
  const t6 = SS(k, 9), tLarge = AT(k, 9, "as large as it can be"), t7 = SS(k, 10), t8 = SS(k, 11);
  // the hand: at the handle (0.9 m), slides to near the hinge (0.2 m) on S3, back to the handle before S5 (the arrows)
  const hx = 0.9 - 0.7 * easeIO(clamp((f - tNear) / 30, 0, 1)) + 0.7 * easeIO(clamp((f - (t2 - 8)) / 20, 0, 1));
  const dotO = fin(f, tFar, 10) * fout(f, t2, 10);
  const easy = (25 * D2R) * (easeIO(clamp((f - tEasy) / 18, 0, 1)) - easeIO(clamp((f - tEasy - 30) / 18, 0, 1)));
  const hard = (25 * D2R) * (easeIO(clamp((f - tHard - 6) / 40, 0, 1)) - easeIO(clamp((f - tHard - 52) / 18, 0, 1)));
  // R3-S3: swing 50° over 20 frames on "turns the most", hold, ease back over 18 frames once the along case starts
  const sw = easy + hard + (50 * D2R) * (easeIO(clamp((f - tTurn) / 20, 0, 1)) - easeIO(clamp((f - t6) / 18, 0, 1)));
  const along = f >= t6 + 6;
  const swF = easeIO(clamp((f - t6) / 14, 0, 1));
  // the push needed for the same swing is ∝ 1 / (distance from the hinge): ×4.5 from 0.9 m to 0.2 m (illustrative bar, no newtons)
  const need = 0.9 / Math.max(hx, 0.2);
  const barO = fin(f, tFar + 6, 12) * fout(f, t2 - 10, 10);
  return (
    <Scene>
      <DoorScene f={f} swing={sw} showR={fin(f, t2 + 8, 16)} showF={along ? swF : fin(f, t3 + 4, 16) * (1 - swF)} Fdir={along ? "along" : "perp"}
        tick={along ? 0 : fin(f, t4) * fout(f, t6, 8)} handX={hx} dot={dotO}
        over={<>
          <Keyword f={f} text="just a number" at={[1100, 560]} appear={AT(k, 0, "a number")} out={tFar - 10} targets={[]} />
          <Keyword f={f} text="turning?" at={[1100, 680]} appear={SS(k, 1)} out={tFar - 10} targets={[]} />
          <g opacity={barO}>
            <rect x={470} y={800} width={95 * need} height={34} fill={C.second} opacity={0.85} />
            <Lbl x={470} y={770} t="push needed" c={C.second} s={T.floor} />
          </g>
          <Keyword f={f} text="far from the hinge · easy" at={[1100, 300]} appear={AT(k, 2, "far from the hinge")} out={t2 - 10} targets={[]} s={T.key} />
          <Keyword f={f} text="near the hinge · hard" at={[1100, 420]} appear={AT(k, 3, "close to the hinge")} out={t2 - 10} targets={[]} s={T.key} />
          <Lbl x={1100} y={560} t="how far from the hinge" c={C.key} s={T.key} o={fin(f, AT(k, 4, "how far from the hinge")) * fout(f, t2 - 10)} />
          <Lbl x={1100} y={640} t="which way you push" c={C.key} s={T.key} o={fin(f, AT(k, 4, "which way you push")) * fout(f, t2 - 10)} />
          {/* fx1 (S10): r and F stay until r · F = 0 takes their place (the maths zone was empty in S7-S8) */}
          <Lbl x={1100} y={200} t="r" c={C.first} s={T.calc} o={fin(f, AT(k, 5, "from the hinge")) * fout(f, tZero - 10)} />
          <Keyword f={f} text="hinge to hand" at={[1160, 200]} appear={AT(k, 5, "from the hinge")} out={tZero - 10} targets={[]} />
          <Lbl x={1100} y={300} t="F" c={C.second} s={T.calc} o={fin(f, AT(k, 6, "your push")) * fout(f, tZero - 10)} />
          <Keyword f={f} text="push" at={[1160, 300]} appear={AT(k, 6, "your push")} out={tZero - 10} targets={[]} />
          <Keyword f={f} text="push ⟂ door" at={[1100, 420]} appear={AT(k, 7, "at a right angle")} out={tZero - 10} targets={[]} />
        </>} />
      <TeX s={String.raw`\mathbf a\cdot\mathbf b = 8`} x={1100} y={420} size={T.eq} o={fin(f, 4) * fout(f, tFar - 10)} />
      <TeX s={EQ_RF0} x={1100} y={300} size={T.eq} o={fin(f, tZero)} glow={pulse(f, t8, 24)} />
      <TeX s={String.raw`\mathbf r\cdot\mathbf F`} x={1100} y={520} size={T.eq} o={fin(f, tLarge)} glow={pulse(f, t8, 24)} />
      <Svg>
        <Lbl x={1455} y={300} t="turns the most" c={C.key} s={T.key} o={fin(f, AT(k, 8, "turns the most"))} />
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
const CycleWheel: React.FC<{ x: number; y: number; r?: number; o?: number; arcs?: number; hi?: number; rev?: boolean }> = ({ x, y, r = 70, o = 1, arcs = 3, hi = -1, rev = false }) => {
  if (o <= 0) return null;
  const ang = (rev ? [-90, -210, -330] : [-90, 30, 150]).map((a) => a * D2R), L = rev ? ["x", "z", "y"] : ["x", "y", "z"];
  const col = rev ? C.neg : C.gold, sgnA = rev ? -1 : 1;
  return (
    <g opacity={o}>
      {[0, 1, 2].map((i) => {
        const dr = clamp(arcs - i, 0, 1);
        if (dr <= 0) return null;
        const a0 = ang[i] + 0.42 * sgnA, a1 = a0 + (2.094 - 0.84) * dr * sgnA;
        const pts = Array.from({ length: 21 }, (_, j) => { const a = a0 + ((a1 - a0) * j) / 20; return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`; });
        const ex = x + r * Math.cos(a1), ey = y + r * Math.sin(a1), tx = -Math.sin(a1) * sgnA, ty = Math.cos(a1) * sgnA;
        return <g key={i}>
          <polyline points={pts.join(" ")} fill="none" stroke={col} strokeWidth={5} />
          {dr >= 1 ? <polyline points={`${ex - tx * 18 + ty * 10},${ey - ty * 18 - tx * 10} ${ex},${ey} ${ex - tx * 18 - ty * 10},${ey - ty * 18 + tx * 10}`} fill="none" stroke={col} strokeWidth={5} /> : null}
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
            return <line key={n} data-lc-ok="recipe cross line" x1={p[0]} y1={p[1]} x2={e[0]} y2={e[1]} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />;
          })}
          {grey >= 0 ? <line data-lc-ok="recipe strike" x1={TAB.x[grey]} y1={TAB.ya + dy - 50} x2={TAB.x[grey]} y2={TAB.yb + dy + 50} stroke={C.neg} strokeWidth={6} opacity={greyO} /> : null}
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
        <Lbl x={1830} y={95} t="?" c={C.gold} s={T.calc} a="end" o={fin(f, t7 + 6)} />
      </Svg>
      <TeX s={String.raw`\mathbf a\times\mathbf b = (\quad ${SLOT("along x")}\quad ,\quad ${SLOT("along y")}\quad ,\quad ${SLOT("along z")}\quad )`} x={1335} y={170} size={54} ax={0.5}
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
  // v5 (V-X7): "turning within the floor is turning about the up direction" — a sweep a → b on the floor, the up axis lit
  const tWithin = AT(k, 5, "turning within the floor"), tOnlyZ = AT(k, 5, "only the z component survives");
  const sweepD = easeIO(clamp((f - tWithin) / 30, 0, 1)), axisO = fin(f, AT(k, 5, "turning about the up direction"), 12);
  return (
    <Scene>
      <PairFloor st={st} axb={grow} para={pulse(f, AT(k, 4, "where the two arrows lie"), 40) * 1.4}
        under={<Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={2.4} a0={ANG_A} a1={ANG_B} col={C.gold} draw={sweepD} w={5} o={0.8 * fin(f, tWithin, 8)} />}
        over={<>
          <L3 pr={pr} at={[0, 0, 2.6]} t="up" c={C.gold} s={T.key} dx={-30} a="end" o={axisO} />
          <PairLegs pp={pr.p} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={AXB3} t="a × b = (0, 0, 14)" c={ROT} s={T.key} o={fin(f, tZZ + 26)} gap={30} />
          <Bracket3 pr={pr} h={AXB3[2]} o={fin(f, tZZ + 30)} />
          <Keyword f={f} text="vector product" at={[1100, 700]} appear={AT(k, 6, "vector product")} targets={[add(pr.p([0, 0, AXB3[2] * 0.4]), [26, 0])]} bend={0.05} />
        </>} />
      <TeX s={ctex(C.first, EA)} x={110} y={80} size={T.calc} />
      <TeX s={ctex(C.second, EB)} x={110} y={165} size={T.calc} />
      <CompTable f={f} o={tabO} grey={-1} greyO={0} links={linkSet} nums s={T.key} dy={-250} />
      <Svg>
        {["x", "y", "z"].map((w, i) => <Lbl key={w} x={1080} y={400 + 100 * i + 8} t={w} c={C.muted} s={T.key} o={fin(f, [t1, t2, t3][i] + 10) * fout(f, tZZ, 20)} />)}
      </Svg>
      <CalcStack f={f} x={1580} y={362} rows={rows.map((r) => ({ ...r, out: tZZ }))} maxLines={4} size={T.calc} dim={0.6} />
      <TeX s={EQ_AXB14} x={1080} y={520} size={T.eq} o={fin(f, tZZ)} glow={pulse(f, tZZ, 24) + pulse(f, tOnlyZ, 30)} />
      <Svg><Lbl x={1080} y={620} t="turning in the floor → only z" c={C.key} s={T.key} o={fin(f, tOnlyZ) * fout(f, AT(k, 6, "vector product") - 6)} /></Svg>
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
          <L3 pr={pr} at={[1.0 * Math.cos(mid * D2R), 1.0 * Math.sin(mid * D2R), 0]} t="θ" c={C.gold} s={T.calc} o={fin(f, 20)} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
          <L3 pr={pr} at={AXB3} t="a × b = (0, 0, 14)" c={ROT} s={T.key} a="middle" dy={-56} />
          <Seg3 pr={pr} a={brA[0]} b={brA[1]} c={C.gold} w={5} o={fin(f, tA - 10)} />
          <Seg3 pr={pr} a={brB[0]} b={brB[1]} c={C.gold} w={5} o={fin(f, tB - 10)} />
          {/* fix 2 (review 2 S4): each bracket links to ITS row, ending 12 px left of the row; the two never cross */}
          <CurvedLink f={f} from={pr.p(lerp3(brA[0], brA[1], 0.75))} to={[1212, 411]} start={tA} end={t6} bend={-120} />
          {/* v5 R3-S4: the |b| link leaves the TOP of b's bracket and runs right above the picture to its row (no knot at the origin) */}
          <CurvedLink f={f} from={add(pr.p(brB[1]), [0, -18])} to={[1208, 601]} start={tB} end={t6} ctl={[860, 300]} />
        </>} />
      <TeX s={EQ_COS} x={1080} y={80} size={T.calc} c={C.local} o={0.7 * fin(f, t1)} />
      <Svg><Lbl x={1100} y={330} t="cos → sin" c={C.gold} s={T.calc} o={fin(f, AT(k, 0, "the angle"), 12) * fout(f, t4 - 6)} /></Svg>
      <Layered parts={SIN_PARTS} layers={[{ t: "all", o: 1 }, { u: [3], o: fin(f, t2 + 20) }]} x={1070} y={150} size={T.eq} ay={0} o={fin(f, t2 + 10)} />
      <CalcStack f={f} x={1300} y={370} size={56} maxLines={2} rows={[
        { lhs: NA_L, rhs: NAP.slice(0, 2).join(" "), at: t4 + 10, h: 100, lc: C.first },
        { rhs: NAP[2], at: tA, cont: true, c: C.first, h: 90 },
        { lhs: NB_L, rhs: NBP.slice(0, 2).join(" "), at: t5 + 10, h: 100, lc: C.second },
        { rhs: NBP[2], at: tB, cont: true, c: C.second, h: 90 },
        { lhs: CO_L, rhs: COP[0], at: t6 + 10, h: 120 },
        { rhs: COP[1], at: AT(k, 6, "about point five"), cont: true, c: C.key, h: 90 },
      ]} o={fout(f, t8 - 6)} />
      <TeX s={EQ_THS4} x={1080} y={810} size={60} o={fin(f, t7 + 10)} />
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
        <Keyword f={f} text="a picture for |a × b|" at={[1100, 260]} appear={AT(k, 0, "a picture")} out={t2 - 6} targets={[]} />
        <Keyword f={f} text="drop ⊥ onto b's line" at={[1100, 380]} appear={AT(k, 1, "Drop a line")} out={t2 - 6} targets={[]} />
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
        <Lbl x={P(1, 3)[0] + 22} y={P(1, 3)[1] + 44} t="b" c={C.second} s={T.calc} a="start" />
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
        <CurvedLink f={f} from={[cen[0] + 30, cen[1] + 20]} to={[1624, 597]} start={AT(k, 7, "which is fourteen")} end={t[8]} ctl={[1700, 900]} />
        <Lbl x={cen[0]} y={cen[1] - 10} t="?" c={C.gold} s={T.hero} a="middle" o={fin(f, 10) * fout(f, t[1])} />
        <Keyword f={f} text="area formula" at={[1100, 760]} appear={AT(k, 10, "an area formula")} targets={[]} />
      </Svg>
      <PairTags two x={1080} />
      <TeX s={String.raw`a_1b_2 - a_2b_1 = 5\times3 - 1\times1 = 14`} x={1080} y={80} size={52} o={fin(f, 6) * (1 - letters)} />
      <TeX s={String.raw`\mathbf a\times\mathbf b = (\dots,\ \dots,\ a_1b_2 - a_2b_1)`} x={1080} y={80} size={T.key} c={C.local} o={letters} />
      <CalcStack f={f} x={1480} y={200} size={60} maxLines={5} rows={[
        { lhs: splitEq(EQ_BOX24)[0], rhs: splitEq(EQ_BOX24)[1], at: t[2], h: 90 },
        { lhs: splitEq(EQ_BOXA)[0], rhs: splitEq(EQ_BOXA)[1], at: AT(k, 4, "together they make five"), h: 90, lc: C.first },
        { lhs: splitEq(EQ_BOXB)[0], rhs: splitEq(EQ_BOXB)[1], at: AT(k, 5, "make three"), h: 90, lc: C.second },
        { lhs: splitEq(EQ_BOXS)[0], rhs: splitEq(EQ_BOXS)[1], at: AT(k, 6, "make two"), h: 90, lc: C.gold },
        { lhs: splitEq(EQ_BOX14)[0], rhs: rep(splitEq(EQ_BOX14)[1], "= 14", String.raw`= \mathbf{14}`), at: AT(k, 7, "which is fourteen") - 20, h: 100, c: C.key },
      ]} o={1 - letters} />
      {/* M3: the identity on two lines (the box product minus the corners, then the result), inside x ≤ 1840 */}
      <Layered parts={parts}
        layers={[{ t: "all", o: 1 }, { x: [1], o: strike(0) }, { x: [2], o: strike(1) }, { x: [3], o: strike(2) }]}
        x={1080} y={230} size={48} o={letters} />
      <TeX s={String.raw`= a_1b_2 + a_2b_1 - 2a_2b_1`} x={1080} y={335} size={48} c={C.local} o={fin(f, t[8] + 20)} />
      <TeX s={IDR} x={1080} y={435} size={60} c={C.key} o={letters * fin(f, AT(k, 8, "almost everything cancels") + 30)} />
      <Svg>
        <line x1={1080} y1={482} x2={1440} y2={482} stroke={C.gold} strokeWidth={6} opacity={fin(f, t[9]) * letters} />
        <CurvedLink f={f} from={[1437, 438]} to={[1814, 96]} start={t[10]} ctl={[1960, 330]} />
      </Svg>
      <TeX s={String.raw`\text{(x of }\mathbf a)\times(\text{y of }\mathbf b) - (\text{y of }\mathbf a)\times(\text{x of }\mathbf b)`} x={1080} y={590}
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
      <CalcStack f={f} x={1236} y={130} size={56} rows={[
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
  const at0 = pos; // fx1 (S4): no slide-in or translucent fade; the scene's own cross-fade brings the hand in at its final pose
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
        children={<Hand3D q={q} at={at0} s={s} angles={POSE.curl(curl)} thumb={thumbUp} o={1}
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
          {(() => {
            const gap = 26, parts: [string, string][] = [["index", C.first], ["×", ROT], ["middle", C.second], ["=", C.ink], ["thumb", ROT]];
            let x = 1180;
            return parts.map(([t, c]) => { const el = <Lbl key={t} x={x} y={420} t={t} c={c} s={T.key} />; x += textW(t, T.key) + gap; return el; });
          })()}
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
        <Keyword f={f} text="the rule on x̂, ŷ, ẑ" at={[1100, 240]} appear={AT(k, 0, "the rule on")} out={tXY - 8} targets={[]} />
        <Lbl x={1100} y={565} t={["fingers x̂ · curl to ŷ · thumb ẑ", "fingers ŷ · curl to ẑ · thumb x̂", "fingers ẑ · curl to x̂ · thumb ŷ"][beat]} c={C.key} s={T.floor} o={fin(f, t1 + 6)} />
      </Svg>
      <TeX s={EQ_XY} x={1100} y={240} size={T.calc} o={fin(f, tXY)} c={C.key} glow={pulse(f, tXY, 24)} />
      <TeX s={EQ_YZ} x={1100} y={350} size={T.calc} o={fin(f, tYZ)} c={C.key} glow={pulse(f, tYZ, 24)} />
      <TeX s={EQ_ZX} x={1100} y={460} size={T.calc} o={fin(f, AT(k, 6, "z hat cross x hat"))} c={C.key} glow={pulse(f, t8, 24)} />
      <Svg><CycleWheel x={1690} y={740} r={80} o={fin(f, t9)} arcs={clamp((f - t9) / 45, 0, 3)} hi={-1} />
        {/* v5 (V-X6): the cycle of the axes is the cycle of the recipe */}
        {([["x ← (y, z)", "the x component is built from y and z"], ["y ← (z, x)", "the y component from z and x"], ["z ← (x, y)", "the z component from x and y"]] as [string, string][]).map(([t, ph], i) =>
          <Lbl key={t} x={1100} y={650 + 80 * i} t={t} c={C.key} s={T.key} o={fin(f, AT(k, 8, ph))} />)}
      </Svg>
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
      <TeX s={EQ_DOTSYM} x={1100} y={815} size={T.key} c={C.local} o={fin(f, AT(k, 8, "a dot b equals"))} />
      <Svg><CycleWheel x={1700} y={300} r={70} o={fin(f, SS(k, 7))} arcs={clamp((f - SS(k, 7)) / 40, 0, 3)} hi={-1} rev />
        <Lbl x={1700} y={310} t="−" c={C.neg} s={T.calc} a="middle" o={fin(f, SS(k, 7) + 40)} /></Svg>
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
  // v5: sentences 5-6 are new (the two-faced card); the v4 sentences 5-7 are now 7-9
  const t1 = SS(k, 1), t3 = SS(k, 3), tCard = SS(k, 5), tFace = SS(k, 6), t5 = SS(k, 7), t7 = SS(k, 8), t8 = SS(k, 9);
  const base = { ...FLOOR_K, dist: 13.5, pp: [540, 470] as Pt };
  const top = { ...base, az: 270, el: 89.9, target: [0, 0, 0] as V3, dist: 16, pp: [300, 640] as Pt };
  const bot = { ...base, az: 270, el: -89.9, target: [0, 0, 0] as V3, dist: 16, pp: [700, 640] as Pt, up: [0, 1, 0] as V3 };
  // fx1 (S6): the camera stays below until "two coloured faces" (the orange face is seen while it is named), then swings up
  const tFaces = AT(k, 5, "two coloured faces"), tUp = Math.max(tCard + 30, tFaces + 24);
  const st = camOf([{ ...base, f: 0 }, { ...base, f: t1 - 15 }, { ...top, f: t1 + 20 }, { ...top, f: t3 }, { ...bot, f: t3 + 50 }, { ...bot, f: tUp },
    { ...top, f: tUp + 50 }, { ...top, f: t5 }, { ...base, f: t5 + 50, az: 230, el: 30, target: [2.5, 1.5, 1.0] }], f);
  const pr = projector(st, W3, H3);
  const O = pr.p([0, 0, 0]);
  const above = f >= t1 + 20 && f < t3, below = f >= t3 + 50 && f < tCard + 30;
  const cardO = fin(f, tCard, 16) * fout(f, t5 + 40, 16);
  const cardTop = f >= tUp + 50 && f < t5, cardBot = f >= tCard && st.pos[2] < 0;
  const settled = f < t1 - 15 || f >= t5 + 50;   // C1: the a × b label only while the camera is still
  const icon = (y: number, cw: boolean) => (
    <g>
      <path d={cw ? `M 1126 ${y - 30} A 40 40 0 1 1 1086 ${y - 30}` : `M 1086 ${y - 30} A 40 40 0 1 0 1126 ${y - 30}`} fill="none" stroke={C.gold} strokeWidth={5} />
      {cw ? <CircleCross x={1106} y={y + 8} r={16} w={4} /> : <CircleDot x={1106} y={y + 8} r={16} w={4} />}
    </g>
  );
  const card = (z: number, c: string): V3[] => [[0, 0, z], [A3[0], A3[1], z], [A3[0] + B3[0], A3[1] + B3[1], z], [B3[0], B3[1], z]];
  return (
    <Scene>
      <PairFloor st={st} axb={1 - fin(f, tUp - 8, 8) * fout(f, tUp + 44, 8)} grid={1}
        children={<>
          <Plane3D x0={-1} x1={6} y0={-1} y1={4} o={0.3 * (1 - 0.6 * cardO)} />
          {cardO > 0 && st.pos[2] >= 0 ? <Quad3D pts={card(0.03, C.first)} color={C.first} o={0.45 * cardO} /> : null}
          {cardO > 0 && st.pos[2] < 0 ? <Quad3D pts={card(-0.03, C.second)} color={C.second} o={0.45 * cardO} /> : null}
        </>}
        under={<Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={1.9} a0={ANG_A} a1={ANG_B} col={C.gold} />}
        over={<>
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} />
          <CircleDot x={O[0]} y={O[1]} r={36} o={above ? fin(f, AT(k, 2, "points up")) : cardTop ? 1 : 0} />
          <CircleCross x={O[0]} y={O[1]} r={36} o={below ? fin(f, AT(k, 4, "points away")) : 0} />
          {settled ? <TipL3 pr={pr} from={[0, 0, 0]} to={AXB3} t="a × b = (0, 0, 14)" c={ROT} s={T.key} o={f < t1 ? 1 : fin(f, t5 + 50, 10)} /> : null}
        </>} />
      <Svg>
        <Keyword f={f} text="where you look from" at={[1150, 280]} appear={AT(k, 0, "where you look from")} out={t1 + 14} targets={[]} />
        <g opacity={fin(f, t1 + 20) * fout(f, t3)}>
          <Lbl x={1150} y={280} t="from above" c={C.key} s={T.key} />
          <Lbl x={1150} y={360} t="anticlockwise" c={C.gold} s={T.key} o={fin(f, AT(k, 2, "anticlockwise"))} />
          <Lbl x={1150} y={440} t="towards you" c={ROT} s={T.key} o={fin(f, AT(k, 2, "straight at you"))} />
        </g>
        <g opacity={fin(f, t3 + 40) * fout(f, tCard)}>
          <Lbl x={1150} y={280} t="from below" c={C.key} s={T.key} />
          <Lbl x={1150} y={360} t="clockwise" c={C.gold} s={T.key} o={fin(f, AT(k, 4, "looks clockwise"))} />
          <Lbl x={1150} y={440} t="away" c={ROT} s={T.key} o={fin(f, AT(k, 4, "away from you"))} />
        </g>
        {/* v5 (V-X5): the parallelogram as a two-faced card; the arrow sticks out of the face where a → b looks anticlockwise */}
        <Keyword f={f} text="a card with two faces" at={[1150, 160]} appear={AT(k, 5, "a thin card")} out={t5} targets={[]} />
        <g opacity={fin(f, AT(k, 5, "two coloured faces")) * (cardBot ? 1 : 0.45) * fout(f, t5)}>
          <rect x={1150} y={255} width={44} height={44} fill={C.second} opacity={0.7} />
          <Lbl x={1215} y={280} t="orange face: clockwise" c={C.key} s={T.key} />
        </g>
        <g opacity={fin(f, tUp + 40) * fout(f, t5)}>
          <rect x={1150} y={355} width={44} height={44} fill={C.first} opacity={0.7} />
          <Lbl x={1215} y={380} t="teal face: anticlockwise" c={C.key} s={T.key} />
        </g>
        <Lbl x={1150} y={480} t="the arrow sticks out of the teal face" c={ROT} s={T.floor} o={fin(f, AT(k, 6, "sticks out of the face")) * fout(f, t5)} />
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
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 10);
  const tCW = AT(k, 10, "becomes clockwise"), tDown = AT(k, 10, "flips to point down"), tDot = SS(k, 9);
  const big = easeIO(clamp((f - t9) / 30, 0, 1));
  const sw = clamp((f - t9 - 30) / (SE(k, 10) - t9 - 40), 0, 1);
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
          o={fin(f, [t3 + 30, t5 + 20, t7 + 20][i]) * oth * fout(f, tDot)} />)}
        {/* fx1 (M3): the p·q values under the panels are gone (never spoken); the words now say "largest when the arrows point
            the same way", shown as one keyword line under "dot product: the opposite" */}
        <Lbl x={960} y={180} t="dot: 0 at a right angle · largest the same way" c={C.local} s={T.floor} a="middle" o={fin(f, AT(k, 9, "zero at a right angle")) * fout(f, t9)} />
        <Lbl x={960} y={110} t="same way or opposite → 0" c={C.key} s={T.key} a="middle" o={fin(f, t8) * oth * fout(f, tDot)} />
        <Lbl x={960} y={190} t="right angle → longest" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 8, "as long as it can be")) * oth * fout(f, tDot)} />
        <Lbl x={960} y={110} t="dot product: the opposite" c={C.local} s={T.key} a="middle" o={fin(f, tDot + 8) * fout(f, t9)} />
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
      {/* S8: the turning q keeps its components on screen (data/sweep.json) */}
      <Svg><Lbl x={1390} y={740} t={`q = (${[q2[0], q2[1]].map((v) => (Math.abs(v) < 0.05 ? "0" : v.toFixed(1).replace("-", "−").replace(".0", ""))).join(", ")}, 0)`} c={C.second} s={T.key} o={big} /></Svg>
    </Scene>
  );
};

// ================================================================ s18a the questions; s18b the part across; s18c the slide
const QLIST = ["sin θ ?", "area ?", "area, but an arrow ?", "the minus sign ?"];
const QList: React.FC<{ f: number; o: number; ticks: number[]; y0?: number; row?: number[] }> = ({ f, o, ticks, y0 = 520, row = [0, 1, 2, 3] }) => (o <= 0 ? null : (
  <g opacity={o}>
    {QLIST.map((q, i) => <g key={q}>
      <Lbl x={1200} y={y0 + 80 * row[i]} t={q} c={C.key} s={T.key} />
      <Check x={1140} y={y0 + 80 * row[i]} o={fin(f, ticks[i] ?? 1e9, 10)} />
    </g>)}
  </g>));
const QY0 = 400;
const S18A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18a_why_question");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), tMinus = SS(k, 4), t4 = SS(k, 5);
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
          {/* fix 2 (review 2 S4): the two first links leave when the third question arrives, so no two links ever cross */}
          {/* fx1 (S1): each question on its own row, at the place the list (S6) uses, so nothing jumps; links leave to the left */}
          <Keyword f={f} text="sin θ ?" at={[1200, QY0 + 80]} appear={AT(k, 2, "Why the sine")} out={t4} targets={[]} />
          <Keyword f={f} text="area ?" at={[1200, QY0]} appear={AT(k, 2, "why an area")} out={t4} targets={[]} />
          <CurvedLink f={f} from={[1180, QY0 + 80]} to={add(pr.p([1.7 * Math.cos(30 * D2R), 1.7 * Math.sin(30 * D2R), 0]), [14, -8])} start={AT(k, 2, "Why the sine") + 8} end={t3 - 8} bend={20} />
          <CurvedLink f={f} from={[1180, QY0]} to={add(pr.p([3, 2, 0]), [14, -8])} start={AT(k, 2, "why an area") + 8} end={t3 - 8} bend={20} />
          <Keyword f={f} text="area, but an arrow, up or down ?" s={T.floor} at={[1200, QY0 + 160]} appear={t3} out={t4} targets={[pr.p([3.4, 2.1, 0]), pr.p([0, 0, AXB3[2] * 0.7])]} />
          <Keyword f={f} text="the minus sign ?" at={[1200, QY0 + 240]} appear={AT(k, 4, "the minus sign")} out={t4} targets={[]} />
          <Lbl x={1700} y={180} t="?" c={C.gold} s={T.hero} a="middle" o={fin(f, t1) * fout(f, t4)} />
        </>} />
      <PairTags />
      <Svg><QList f={f} o={fin(f, t4)} ticks={[1e9, 1e9, 1e9]} y0={QY0} row={[1, 0, 2, 3]} /></Svg>
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
        <Lbl x={(FT[0] + BTIP[0]) / 2 + 74} y={(FT[1] + BTIP[1]) / 2} t={f >= tAc ? "across ≈ 2.75" : "across"} c={ROT} s={T.key} a="start" o={split} />
        <Bracket p={FT} q={BTIP} off={40} c={C.gold} o={fin(f, tAc)} />
        <Bracket p={O2} q={ATIP} off={-46} c={C.gold} o={fin(f, t7)} />
        <Arc P={(x, y) => [O2[0] + x, O2[1] - y]} a0={ANG_A} a1={ANG_B} r={90} c={C.gold} w={5} o={fin(f, t6)} />
        <Lbl x={O2[0] + 120} y={O2[1] - 120} t="θ" c={C.gold} s={T.key} o={fin(f, t6)} />
        <TipLabel p={PAIR_TIPS.a} c={C.first} /><TipLabel p={PAIR_TIPS.b} c={C.second} />
        <Keyword f={f} text="dot product: along" at={[1100, 140]} appear={t1} out={t2} targets={[]} c={C.local} />
        {/* fix 2 (review 2 S2): the right half carries the words of S2-S5 (it was empty for 20 s) */}
        <Keyword f={f} text="split b into two pieces" at={[1100, 140]} appear={AT(k, 2, "split b")} out={t6 - 4} targets={[]} />
        <Lbl x={1100} y={240} t="along a" c={C.first} s={T.key} o={fin(f, AT(k, 3, "lies along")) * fout(f, t6 - 4)} />
        <Lbl x={1100} y={320} t="across a, at 90°" c={ROT} s={T.key} o={fin(f, AT(k, 3, "goes straight across")) * fout(f, t6 - 4)} />
        <Lbl x={1100} y={420} t="along + across = b" c={C.key} s={T.key} o={fin(f, t4) * fout(f, t6 - 4)} />
        <Lbl x={1100} y={520} t="along ≈ 1.57" c={C.first} s={T.key} o={fin(f, tAl) * fout(f, t6 - 4)} />
        <Lbl x={1100} y={600} t="across ≈ 2.75" c={ROT} s={T.key} o={fin(f, tAc) * fout(f, t6 - 4)} />
        <CurvedLink f={f} from={[(FT[0] + BTIP[0]) / 2 + 74 + textW("across ≈ 2.75", T.key) / 2, (FT[1] + BTIP[1]) / 2 + 40]} to={[1640, 664]} start={AT(k, 7, "two point seven five")} end={t8} ctl={[1500, 950]} />
      </Svg>
      {/* S9 (review 2 S2): the two keyword lines were inside the SVG and never drawn; the s18a list ticks "sin θ ?" */}
      <TeX s={String.raw`\mathbf a\cdot\mathbf b\ \to\ \text{along}\ (\cos\theta)`} x={1100} y={150} size={T.key} c={C.local} o={fin(f, t8)} />
      <TeX s={String.raw`\mathbf a\times\mathbf b\ \to\ \text{across}\ (\sin\theta)`} x={1100} y={260} size={T.key} c={ROT} o={fin(f, AT(k, 8, "the cross product uses"))} />
      <Svg><QList f={f} o={fin(f, t8 + 6)} ticks={[AT(k, 8, "the part across"), 1e9, 1e9]} /></Svg>
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
const P18C = mkP(110, 780, 56); // fix 2: smaller, so the slide to (11, 5) stays in the picture zone
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

        <Arrow p={O} q={Bp} color={C.second} />
        <Arrow p={O} q={A} color={C.first} />
        <Lbl x={Math.max(Bp[0] - 40, 215)} y={Bp[1] - 90} t={`b = (${fmt(bv[0])}, ${fmt(bv[1])})`} c={C.second} s={T.key} a="middle" />
        <Lbl x={A[0] + 30} y={A[1] + 50} t="a = (5, 1)" c={C.first} s={T.key} a="start" />
        <Lbl x={(O[0] + AB[0]) / 2 + 10} y={(O[1] + AB[1]) / 2 - 10} t={`${Math.round(cz)}`} c={C.key} s={T.calc} a="middle" o={fin(f, t4)} />
        {/* fix 2 (review 2 S2): the right half follows S0-S4 (it was empty for 19 s) */}
        <Keyword f={f} text="only the part along changes" at={[1100, 140]} appear={AT(k, 0, "only the part along")} targets={[]} c={C.local} />
        <Lbl x={1100} y={240} t="base 5.099 · height 2.75" c={C.key} s={T.key} o={fin(f, AT(k, 3, "its base stays"))} />
        <Keyword f={f} text="ignores: along" at={[1100, 740]} appear={t7} targets={[]} c={C.local} />
        <Keyword f={f} text="measures: across" at={[1100, 820]} appear={t8} targets={[]} c={ROT} />
      </Svg>
      <TeX s={ABXB} x={1100} y={300} size={T.key} o={fin(f, AT(k, 4, "still fourteen"))} />
      <CalcStack f={f} x={1440} y={410} size={T.calc} rows={[
        { lhs: splitEq(EQ_SLIDE)[0], rhs: eqPieces(splitEq(EQ_SLIDE)[1])[0], at: t5, h: 100 },
        { rhs: rep(eqPieces(splitEq(EQ_SLIDE)[1])[1], "14", String.raw`\mathbf{14}`), at: AT(k, 5, "fourteen again"), cont: true, c: C.key, h: 100 },
      ]} />
      <Svg><Lbl x={1100} y={650} t="slide → no change" c={C.key} s={T.key} o={fin(f, AT(k, 6, "doesn't change"))} /></Svg>
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
    { dot: "along · a number", cross: "across · an axis", td: AT(k, 6, "the part along, a number"), tc: AT(k, 6, "the part across, an axis"), mini: 0 },
    { dot: "work", cross: "torque", td: AT(k, 7, "work"), tc: AT(k, 7, "torque"), mini: 5 },
    { dot: "advection", cross: "turns the wind", td: AT(k, 8, "advection"), tc: AT(k, 8, "turns the wind"), mini: 6 },
  ];
  const Y = [225, 315, 405, 495, 585, 675, 765];
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
  const st = camOf([{ ...SPAN_K, pp: [460, 480] }], f), pr = projector(st, W3, H3);
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
  // fix 2 (review 2 N-M3): the torque arrow and readout never run ahead of the voice. While F swings, the old torque is
  // dimmed and the readout says "?"; the new value appears on its spoken number (AT "seven point five", AT "nothing is across").
  const tA8 = AT(k, 8, "seven point five"), tA9 = AT(k, 9, "nothing is across");
  const T0 = torque.tau_z[0] as number, T1 = torque.tau_z[1] as number, T2 = torque.tau_z[2] as number;
  const tauShow = f < tA8 ? T0 : f < tA9 ? T0 + (T1 - T0) * easeIO(clamp((f - tA8) / 20, 0, 1)) : T1 + (T2 - T1) * easeIO(clamp((f - tA9) / 20, 0, 1));
  const pending = (f >= t7 - 4 && f < tA8) || (f >= t9 - 4 && f < tA9);
  const tauDim = pending ? 0.35 : 1;
  const tauLab = pending ? "?" : Math.abs(tauShow - 15) < 0.05 ? "15" : Math.abs(tauShow - 7.5) < 0.05 ? "7.5" : tauShow.toFixed(1);
  return (
    <Scene>
      <View3D st={st} o={fin(f, 2, 12)}>
        <Spanner3D angle={0} />
        <Arrow3D from={[0, 0, 0.022]} to={grip} color={C.first} grow={fin(f, t3, 16)} />
        <Arrow3D from={grip} to={add3(grip, Fv)} color={C.second} grow={fin(f, AT(k, 3, "an arrow, F"), 16)} />
        <Arrow3D from={grip} to={add3(grip, F30)} color={C.second} o={0.45 * g30} dash />
        {Math.abs(tauShow) > 0.05 ? <Arrow3D from={[0, 0, 0.03]} to={[0, 0, 0.03 + tauShow * TSC * fin(f, AT(k, 6, "fifteen newton metres"), 20)]} color={ROT} px={14} head={44} o={tauDim} /> : null}
      </View3D>
      <Svg>
        <Seg3 pr={pr} a={grip} b={add3(grip, [F30[0], 0, 0])} c={C.local} w={18} o={0.75 * Math.max(g30, bands)} />
        <Seg3 pr={pr} a={add3(grip, [F30[0], 0, 0])} b={add3(grip, F30)} c={ROT} w={18} o={0.75 * Math.max(g30, bands)} />
        {/* M5: in the 30° case the along/across parts are named in the maths (CalcStack rows), not on the picture */}
        <L3 pr={pr} at={add3(grip, [F30[0] / 2, 0, 0])} t="pulls" c={C.local} s={T.key} dy={60} o={g30 * (1 - bands)} />
        <L3 pr={pr} at={add3(grip, [F30[0], F30[1] / 2, 0])} t="turns" c={ROT} s={T.key} a="start" dx={54} o={g30 * (1 - bands)} />
        <L3 pr={pr} at={[0.15, 0, 0.022]} t="r = (0.3, 0, 0) m" c={C.first} s={T.key} a="start" dx={10} dy={64} o={fin(f, AT(k, 3, "zero point three"))} />
        <TipL3 pr={pr} from={grip} to={add3(grip, Fv)} t={`F = (${Flab[0]}, ${Flab[1]}, 0) N`} c={C.second} s={T.key} o={fin(f, AT(k, 3, "fifty newtons"))} gap={30} />
        <Lbl x={120} y={840} t="N = newton" c={C.muted} s={T.floor} o={fin(f, AT(k, 3, "fifty newtons") + 10) * fout(f, t6)} />
        <Lbl x={120} y={840} t="N m = newton metre" c={C.muted} s={T.floor} o={fin(f, AT(k, 6, "newton metres")) * fout(f, t9)} />
        {aNow < 89 && aNow > 1 ? <Arc3 pr={pr} c0={grip} e1={[1, 0, 0]} e2={[0, 1, 0]} r={0.09} a0={0} a1={aNow} col={C.gold} head={false} /> : null}
        <L3 pr={pr} at={add3(grip, [0.12 * Math.cos(18 * D2R), 0.12 * Math.sin(18 * D2R), 0])} t="30°" c={C.gold} s={T.key} a="start" dx={14} dy={-10} o={fin(f, t7 + 20) * fout(f, t9)} />
        {Math.abs(tauShow) > 0.05 ? <L3 pr={pr} at={[0, 0, 0.03 + tauShow * TSC]} t="τ" c={ROT} s={T.calc} dx={-34} a="end" o={fin(f, AT(k, 6, "fifteen newton metres") + 10) * tauDim} /> : null}
        {Math.abs(tauShow) > 0.05 || pending ? <Lbl x={120} y={770} t={`τ = (0, 0, ${tauLab}) N m`} c={ROT} s={T.key} o={fin(f, AT(k, 6, "fifteen newton metres") + 10)} /> : null}
        <Keyword f={f} text="why the part across?" at={[1150, 250]} appear={4} out={t1 - 4} targets={[]} />
        <Keyword f={f} text="only the part across turns" at={[1150, 250]} appear={t1} out={t6 - 6} targets={[]} />
        {/* v5 R3-S1: the maths zone is never empty at the scene start */}
        <Lbl x={1150} y={340} t="along → pulls · across → turns" c={C.key} s={T.key} o={fin(f, AT(k, 4, "only the part across")) * fout(f, t6 - 6)} />
        <Keyword f={f} text="torque" at={[1490, 140]} appear={AT(k, 5, "called torque")} targets={[]} />
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
  // v5: sentence 4 is new (the arrow is the axis; seen from its tip the turn is anticlockwise); the v4 sentence 4 is now 5
  const t1 = SS(k, 1), t2 = SS(k, 2), tUp = SS(k, 3), tAx = SS(k, 4), t4 = SS(k, 5);
  const K21: OrbitKey = { ...SPAN_K, dist: 1.2, target: [0.12, 0.03, 0.05] };
  const KTIP: OrbitKey = { ...K21, az: 270, el: 89, dist: 1.35, target: [0.08, 0.0, 0.05] };
  const st = camOf([at(K21, 0), at(K21, tAx), at(KTIP, tAx + 45), at(KTIP, t4 - 20), at(K21, t4 + 25)], f), pr = projector(st, W3, H3);
  const tipView = fin(f, tAx + 40, 10) * fout(f, t4 - 20, 10);
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
        <TipL3 pr={pr} from={grip} to={add3(grip, Fd)} t={loosen ? "F = (0, 50, 0) N" : "F = (0, −50, 0) N"} c={C.second} s={T.key} side={loosen ? 60 : 0} />
        <L3 pr={pr} at={[0, 0, 0.03 + tau * TSC]} t="τ" c={ROT} s={T.calc} dx={-34} a="end" />
        <Lbl x={1240} y={810} t={tau < 0 ? "τ = (0, 0, −15) N m" : "τ = (0, 0, 15) N m"} c={ROT} s={50} />
        {tau < 0 ? <MinusGlyph x={pr.p([0, 0, 0.03 + tau * TSC * 0.5])[0] - 50} y={pr.p([0, 0, 0.03 + tau * TSC * 0.5])[1]} /> : null}
        <Keyword f={f} text="along the axis" at={[1240, 160]} appear={AT(k, 0, "along the bolt's axis")} out={tAx - 6} targets={[]} s={50} />
        <Keyword f={f} text="which way? right hand" at={[1240, 270]} appear={AT(k, 0, "right-hand rule")} out={tAx - 6} targets={[]} s={50} />
        <Keyword f={f} text="curl: r → F" at={[1240, 380]} appear={AT(k, 1, "Curl your fingers")} out={tAx - 6} targets={[]} s={50} />
        <Keyword f={f} text="thumb down: tightens" at={[1240, 490]} appear={AT(k, 2, "the bolt tightens")} out={tAx - 6} targets={[]} s={50} />
        <Keyword f={f} text="thumb up: loosens" at={[1240, 600]} appear={AT(k, 3, "the bolt loosens")} out={tAx - 6} targets={[]} s={50} />
        <g opacity={fin(f, t2) * fout(f, tUp - 4)}>
          <polygon points={Array.from({ length: 6 }, (_, i) => `${230 + 70 * Math.cos((i * Math.PI) / 3)},${650 + 70 * Math.sin((i * Math.PI) / 3)}`).join(" ")} fill="#3a4766" stroke="#c9d2e3" strokeWidth={4} />
          <path d="M 340 650 A 110 110 0 0 1 230 760" fill="none" stroke={C.gold} strokeWidth={6} />
          <polyline points="250,746 230,760 252,774" fill="none" stroke={C.gold} strokeWidth={6} />
          <CircleCross x={230} y={650} r={30} w={5} />
          <Lbl x={110} y={830} t="clockwise · from above" c={C.key} s={T.floor} a="start" />
        </g>
        <g opacity={fin(f, tUp) * fout(f, tAx + 30)}>
          <polygon points={Array.from({ length: 6 }, (_, i) => `${230 + 70 * Math.cos((i * Math.PI) / 3)},${650 + 70 * Math.sin((i * Math.PI) / 3)}`).join(" ")} fill="#3a4766" stroke="#c9d2e3" strokeWidth={4} />
          <path d="M 230 760 A 110 110 0 0 0 340 650" fill="none" stroke={C.gold} strokeWidth={6} />
          <polyline points="326,670 340,650 354,672" fill="none" stroke={C.gold} strokeWidth={6} />
          <CircleDot x={230} y={650} r={30} w={5} />
          <Lbl x={110} y={830} t="anticlockwise · from above" c={C.key} s={T.floor} a="start" />
        </g>
        <Keyword f={f} text="how strongly" at={[1240, 600]} appear={AT(k, 5, "how strongly")} targets={[]} />
        <Keyword f={f} text="which way" at={[1240, 700]} appear={AT(k, 5, "and which way")} targets={[]} />
        {/* v5 (V-X5): looking down the torque arrow from its tip, the turn is anticlockwise */}
        <g opacity={tipView}>
          <Arc3 pr={pr} c0={[0, 0, 0.03]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={0.13} a0={200} a1={470} col={C.gold} w={7} />
          <CircleDot x={pr.p([0, 0, 0.03])[0]} y={pr.p([0, 0, 0.03])[1]} r={30} w={6} />
          <Lbl x={110} y={830} t="seen from the tip: anticlockwise" c={C.key} s={T.key} a="start" />
        </g>
        <Keyword f={f} text="the arrow = the axis" at={[1240, 160]} appear={AT(k, 4, "the axis of the turning")} out={t4 - 6} targets={[]} s={50} />
        <Keyword f={f} text="from its tip: anticlockwise" at={[1240, 270]} appear={AT(k, 4, "seen from its tip")} out={t4 - 6} targets={[]} s={50} />
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
  const stS = camOf([{ ...SPAN_K, pp: [510, 470] }], f), prS = projector(stS, W3, H3);
  const grip: V3 = [0.3, 0, 0.022], Fv: V3 = [0, 0.16, 0];
  const st = camOf([{ ...FLOOR_K, f: 0, az: 250, el: 32, dist: 17, target: [2.4, 1.4, 1.2], pp: [520, 400] }, { ...FLOOR_K, f: t3, az: 250, el: 32, dist: 17, target: [2.4, 1.4, 1.2], pp: [520, 400] },
    { ...FLOOR_K, f: t3 + 60, az: 310, el: 22, dist: 17.5, target: [2.4, 1.4, 1.4], pp: [520, 400] }], f);
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
      {/* S2: the right half carries the argument from the first sentence on (was empty for 30 s) */}
      <TeX s={EQ_TAU} x={1100} y={160} size={T.eq} o={fin(f, 10) * fout(f, AT(k, 5, "the area") - 14)} />
      <Svg>
        <Keyword f={f} text="⟂ to r and ⟂ to F ?" at={[1100, 300]} appear={AT(k, 0, "right angles")} out={t5 - 14} targets={[]} />
        <Keyword f={f} text="turning: in one plane" at={[1100, 400]} appear={AT(k, 1, "one flat plane")} out={t5 - 14} targets={[]} />
        <Keyword f={f} text="axis: straight out of it" at={[1100, 490]} appear={AT(k, 1, "sticking straight out")} out={t5 - 14} targets={[]} />
        <Keyword f={f} text="a sweep → a plane" at={[1100, 580]} appear={AT(k, 2, "sweep")} out={t5 - 14} targets={[]} />
        <Keyword f={f} text="name the plane by its normal" at={[1100, 680]} appear={tNorm} out={t5 - 14} targets={[]} s={50} />
        <Keyword f={f} text="one arrow, two things" at={[1100, 780]} appear={t4} out={t5 - 14} targets={[]} />
        <Keyword f={f} text="length → how much" at={[1100, 380]} appear={t5} targets={[]} />
        <Keyword f={f} text="direction → which plane, which way" at={[1080, 470]} appear={t6} targets={[]} s={T.floor} />
        <Lbl x={1100} y={570} t="up = anticlockwise from above" c={C.gold} s={50} o={fin(f, AT(k, 6, "anticlockwise"))} />
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
        <L3 pr={pr} at={[6.8, 0, 0]} t="x" c={C.muted} s={T.key} /><L3 pr={pr} at={[0, 4.8, 0]} t="y" c={C.muted} s={T.key} /><L3 pr={pr} at={[0, 0, 4.0]} t="z" c={C.muted} s={T.key} a="end" dx={-30} dy={30} />
        <Poly3 pr={pr} pts={quad(toFloor)} c={ROT} w={3} o={shO} />
        <Poly3 pr={pr} pts={quad(toYZ)} c={ROT} w={3} o={shO * (1 - low)} />
        <Poly3 pr={pr} pts={quad(toZX)} c={ROT} w={3} o={shO * (1 - low)} />
        <Keyword f={f} text="x and y parts → z component" at={[1080, 330]} appear={t2} out={t4} targets={[]} />
        <Keyword f={f} text="y and z → x" at={[1080, 430]} appear={t3} out={t4} targets={[]} />
        <Keyword f={f} text="z and x → y" at={[1080, 520]} appear={t3 + 24} out={t4} targets={[]} />
        <Keyword f={f} text="edge on → 0" at={[1080, 430]} appear={AT(k, 4, "edge on")} targets={[]} />
        <CurvedLink f={f} from={pr.p([3, 2, 0])} to={[1590, 681]} start={AT(k, 5, "fourteen")} ctl={[1300, 900]} />
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
      <Svg><Poly3 pr={pr} pts={disc} c={C.muted} w={3} dash="10 8" o={fin(f, 2)} /></Svg>
      <View3D st={st}>
        <Rod3D a={[0, 0, 0]} b={ball} px={3} color={C.ink} o={fin(f, 2)} />
        <Ball3D at={ball} px={34} color={C.second} o={fin(f, 2)} />
        <Ball3D at={[0, 0, 0]} px={14} color={C.ink} />
        <Arrow3D from={[0, 0, 0]} to={ball} color={C.first} o={fin(f, t2)} grow={fin(f, t2, 14)} />
        <Arrow3D from={ball} to={add3(ball, tng, 6 * PS)} color={C.second} o={fin(f, t3)} grow={fin(f, t3, 14)} />
        <Arrow3D from={[0, 0, 0]} to={[0, 0, 3 * LS]} color={ROT} px={14} head={44} grow={fin(f, t5, 20)} />
        <Arrow3D from={ball} to={add3(ball, ball, -0.5)} color={C.neg} px={8} head={30} o={fin(f, t7)} />
      </View3D>
      <Svg>
        {/* fix 2 (review 2 S6): r's components under the circle (clear of the arc and the string), p's in the maths zone */}
        <TipL3 pr={pr} from={[0, 0, 0]} to={ball} t="r" c={C.first} s={T.key} o={fin(f, t2)} side={50} />
        <Lbl x={pr.p([0, 0, 0])[0]} y={Math.max(...disc.map((v) => pr.p(v)[1])) + 60} t="r = (0.5, 0, 0) m" c={C.first} s={T.key} a="middle" o={fin(f, t2) * (paused ? 1 : 0)} />
        <TipL3 pr={pr} from={ball} to={add3(ball, tng, 6 * PS)} t="p" c={C.second} s={T.key} o={fin(f, t3)} />
        <Lbl x={1100} y={220} t="p = (0, 6, 0) kg m/s" c={C.second} s={T.key} o={fin(f, AT(k, 4, "a momentum of six"))} />
        <L3 pr={pr} at={[0, 0, 3 * LS]} t="L = (0, 0, 3) kg m²/s" c={ROT} s={T.key} a="middle" dy={-110} o={fin(f, AT(k, 6, "which is three"))} />
        <Arc3 pr={pr} c0={[0, 0, 0.02]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={0.36} a0={200} a1={480} col={C.gold} o={fin(f, AT(k, 6, "anticlockwise"))} />
                <Keyword f={f} text="many places" at={[1100, 140]} appear={AT(k, 0, "many places")} out={t3} targets={[]} />
        {/* v5 R3-S1: the maths zone is never empty at the scene start */}
        <Lbl x={1100} y={240} t="ball on a string" c={C.key} s={T.key} o={fin(f, AT(k, 1, "a ball whirled")) * fout(f, t3)} />
        <Lbl x={1100} y={330} t="r = (0.5, 0, 0) m" c={C.first} s={T.key} o={fin(f, AT(k, 2, "half a metre")) * fout(f, t4 - 6)} />
        <Keyword f={f} text="momentum = mass × velocity" at={[1100, 140]} appear={AT(k, 3, "its mass times its velocity")} out={t5} targets={[]} s={50} />
        <Keyword f={f} text="angular momentum" at={[1100, 140]} appear={AT(k, 5, "the angular momentum")} targets={[]} s={T.calc} />
        <Keyword f={f} text="anticlockwise → up" at={[1100, 640]} appear={AT(k, 6, "anticlockwise")} out={t7} targets={[]} />
        <Lbl x={1100} y={730} t="string pulls along r" c={C.neg} s={T.key} o={fin(f, t7)} />
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
  const st = camOf([{ f: 0, az: 235, el: 34, dist: 7.5, target: [0.1, -1.0, 0.6], pp: [520, 420] }], f), pr = projector(st, W3, H3);
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
        {[[-2, -2], [-2, 0.6], [1.5, -2.5], [1.8, 0.4], [-0.6, -2.8], [0.4, 0.8]].map(([x, y], i) => <Arrow3D key={i} from={[x, y, 0]} to={[x, y, 1.3]} color={ROT} px={4} head={22} o={0.55 * fin(f, t1)} />)}
        <Ball3D at={pos} px={30} color={C.key} />
        <Arrow3D from={pos} to={add3(pos, v, 1.1)} color={C.first} o={fin(f, t1)} />
        <Arrow3D from={pos} to={add3(pos, push, 0.9)} color={C.second} o={fin(f, AT(k, 3, "a push towards the south"))} />
      </View3D>
      <Svg>
        <L3 pr={pr} at={pos} t="+" c={C.bg} s={T.key} dy={4} />
        <TipL3 pr={pr} from={pos} to={add3(pos, v, 1.1)} t="v" c={C.first} s={T.calc} o={fin(f, t1)} />
        <L3 pr={pr} at={[1.8, 0.4, 1.3]} t="B" c={ROT} s={T.calc} dx={30} a="start" o={fin(f, t1)} />
        <Keyword f={f} text="charge in a magnetic field" at={[1100, 330]} appear={AT(k, 0, "magnetic field")} out={t2 - 6} targets={[]} s={50} />
        <Keyword f={f} text="first arrow: velocity v" at={[1100, 430]} appear={AT(k, 1, "its velocity")} out={t3 - 6} targets={[]} c={C.first} s={50} />
        <Keyword f={f} text="second arrow: field B" at={[1100, 520]} appear={AT(k, 1, "the magnetic field, B")} out={t3 - 6} targets={[]} c={ROT} s={50} />
        <TipL3 pr={pr} from={pos} to={add3(pos, push, 0.9)} t="push" c={C.second} s={T.key} o={fin(f, AT(k, 3, "a push towards the south"))} />
        <Tick3 pr={pr} at={pos} u1={norm3(v)} u2={norm3(push)} s={0.3} o={fin(f, t4)} />
        <L3 pr={pr} at={[3.2, 0, 0]} t="east" c={C.muted} s={T.key} /><L3 pr={pr} at={[0, 2.3, 0]} t="north" c={C.muted} s={T.key} o={fout(f, t7)} />
        <Keyword f={f} text="proton" at={[pr.p(pos)[0] - 60, pr.p(pos)[1] + 90]} appear={AT(k, 0, "like a proton")} out={t1 + 30} targets={[]} />
        <Keyword f={f} text="east × up = south" at={[1100, 470]} appear={AT(k, 3, "a push towards the south")} out={t5} targets={[]} />
        <Lbl x={1100} y={560} t="speed: constant" c={C.key} s={T.key} o={fin(f, t5)} />
        <Lbl x={1100} y={650} t="clockwise · from above" c={C.key} s={T.floor} o={fin(f, t6)} />
        <Keyword f={f} text="particle accelerator" at={[1100, 760]} appear={AT(k, 7, "particle accelerators")} targets={[]} />
      </Svg>
      <Layered parts={QP} layers={[{ t: "all", o: 1 }, { u: [2, 3, 5], o: fin(f, t2 + 20) }]} x={1080} y={110} size={78} ay={0} o={fin(f, t2)} />
      <TeX s={EQ_XZ} x={1100} y={380} size={T.calc} o={fin(f, AT(k, 3, "x hat cross z hat"))} />
      {/* v5 R3-S1: the maths zone is never empty at the scene start */}
      <TeX s={ctex(C.first, String.raw`\mathbf v`) + String.raw`\times` + ctex(ROT, String.raw`\mathbf B`)} x={1100} y={200} size={T.calc} o={fin(f, 8) * fout(f, t2 - 6)} />
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
          <Lbl x={KP.x + 13 * KP.s + 20} y={KP.y} t="east" c={C.muted} s={T.key} a="start" />
          <Lbl x={KP.x + 20} y={KP.y - 3 * KP.s - 20} t="north" c={C.muted} s={T.key} />
          <Arrow p={[KP.x, KP.y]} q={V([10, 0])} color={C.first} o={fin(f, t2) * (f < t4 ? 1 : 0.35)} />
          <Lbl x={V([10, 0])[0] + 20} y={V([10, 0])[1] + 50} t="u = (10, 0) m/s" c={C.first} s={T.key} a="start" o={fin(f, t2) * fout(f, t4 + 20)} />
          <Arrow p={V([10, 0])} q={V(one[1])} color={C.second} w={8} head={28} o={kickO} />
          <Lbl x={V(one[1])[0] + 20} y={V(one[1])[1] - 20} t="kick = (0, 1) m/s" c={C.second} s={T.key} a="start" o={kickO} />
          <Arrow p={[KP.x, KP.y]} q={V(one[1])} color={C.first} o={fin(f, AT(k, 3, "towards the north") + 10) * fout(f, t6 - 6)} />
          <Lbl x={V(one[1])[0] - 30} y={V(one[1])[1] - 70} t="u = (10, 1) m/s" c={C.first} s={T.key} a="end" o={fin(f, AT(k, 3, "towards the north") + 10) * fout(f, t6 - 6)} />
          <Arc P={(x, y) => [KP.x + x, KP.y - y]} a0={0} a1={5.71} r={300} c={C.gold} w={5} o={fin(f, t5)} />
          <Lbl x={KP.x + 300} y={KP.y + 50} t="≈ 5.7°" c={C.gold} s={T.key} o={fin(f, t5)} />
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
          {[{ h: 200, t: "0.05", n: "1 kick" }, { h: 20, t: "0.005", n: "10 kicks" }, { h: 2, t: "0.0005", n: "100 kicks" }].map((b, i) => <g key={i}>
            <rect x={1260 + i * 220} y={700 - b.h} width={70} height={b.h} fill={C.neg} opacity={0.8} />
            <Lbl x={1295 + i * 220} y={745} t={b.t} c={C.neg} s={T.floor} a="middle" />
            <Lbl x={1295 + i * 220} y={805} t={b.n} c={C.muted} s={T.floor} a="middle" />
          </g>)}
          <Lbl x={1200} y={455} t="extra speed (m/s)" c={C.neg} s={T.floor} />
        </g>
        <Keyword f={f} text="push ⟂ velocity" at={[1100, 300]} appear={AT(k, 0, "at right angles")} out={t4 - 10} targets={[]} />
        <Keyword f={f} text="direction only?" at={[1100, 400]} appear={AT(k, 0, "only the direction")} out={t4 - 10} targets={[]} />
        <Keyword f={f} text="always at a right angle → circle" at={[1100, 600]} appear={t9} targets={[]} s={50} />
        <Keyword f={f} text="no work" at={[1100, 780]} appear={AT(k, 10, "does no work")} targets={[]} />
      </Svg>
      {/* M7/S3: every row starts at '|u| =' inside x ≤ 1840; the 10-kick line on two rows */}
      <CalcStack f={f} x={1170} y={110} size={44} maxLines={4} rows={[
        { lhs: splitEq(EQ_K1)[0], rhs: splitEq(EQ_K1)[1], at: t4, h: 80 },
        { lhs: String.raw`|\mathbf u|`, rhs: `= ${splitEq(EQ_K10)[0]}`, at: AT(k, 7, "ten point zero zero five"), h: 80 },
        { rhs: splitEq(EQ_K10)[1], at: AT(k, 7, "ten point zero zero five") + 20, cont: true, h: 80 },
        { lhs: String.raw`|\mathbf u|`, rhs: `= ${EQ_K100}`, at: AT(k, 8, "ten point zero zero zero five"), h: 80 },
      ]} o={fout(f, t9 + 20)} />
      <TeX s={EQ_PUSHU0} x={1100} y={700} size={T.calc} o={fin(f, t10)} />
    </Scene>
  );
};

// ================================================================ s23 k × : the turning tool
const MAP_K: OrbitKey = { f: 0, az: 240, el: 35, dist: 14.5, target: [0, 0.3, 0.4], pp: [520, 400] };
const US = 0.42; // map units per m/s (display)
const S23: React.FC = () => {
  const f = useCurrentFrame(), k = K("s23_k_cross");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), tN = AT(k, 5, "so it points north"), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9);
  const TOPV: OrbitKey = { ...MAP_K, az: 270, el: 89.9, dist: 14.5, target: [0, 0.2, 0], pp: [580, 430] };
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
        <L3 pr={pr} at={f < t6 + 20 ? [3.0, 0.9, 0] : [3.0, -2.4, 0]} t="east" c={C.key} s={T.key} />
        <L3 pr={pr} at={f < t6 + 20 ? [-1.8, 2.7, 0] : [-2.7, 2.7, 0]} t="north" c={C.key} s={T.key} />
        <Arc3 pr={pr} c0={[0, 0, 0.8]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={0.42} a0={-60} a1={200} col={C.gold} w={5} o={axle * fout(f, t6)} />
        {/* M8: k's label leaves when k × u arrives; every arrow label sits at its own tip, outside the arc, inside x ≤ 1000 */}
        <TipL3 pr={pr} from={[0, 0, 0]} to={[0, 0, 1.6]} t="k = (0, 0, 1)" c={ROT} s={T.key} o={gK * (1 - gX)} />
        {/* in the slanted view the picture says only "u" and "k × u" (the components are in the maths); full labels from the top view */}
        <L3 pr={pr} at={u} t={f < t6 + 20 ? "u" : north ? "u = (0, 5, 0) m/s" : "u = (5, 0, 0) m/s"} c={C.first} s={T.key} a={north || f < t6 + 20 ? "middle" : "end"} dx={north || f < t6 + 20 ? 0 : 20} dy={north ? -56 : f < t6 + 20 ? 50 : 62} o={gU} />
        {/* fix 2 (review 2 S9): once u points north, each label is on two lines below its own half of the east-west line (west half:
            k × u, east half: −k × u), at full opacity with the dark halo of Lbl, inside the map */}
        {!north ? <L3 pr={pr} at={kxu} t={f < t6 + 20 ? "k × u" : "k × u = (0, 5, 0)"} c={ROT} s={T.key} a="middle" dy={-56} o={gX} /> : (() => {
          const w = pr.p(kxu), e = pr.p(mul3(kxu, -1)), c0 = pr.p([0, 0, 0]);
          return <>
            <Lbl x={w[0] - 30} y={w[1] + 62} t="k × u" c={ROT} s={T.key} a="start" o={gX} />
            <Lbl x={w[0] - 30} y={w[1] + 124} t="= (−5, 0, 0)" c={ROT} s={T.key} a="start" o={gX} />
            <Lbl x={c0[0] + 92} y={e[1] + 62} t="−k × u" c={ROT} s={T.key} a="start" o={neg} />
            <Lbl x={c0[0] + 92} y={e[1] + 124} t="= (5, 0, 0)" c={ROT} s={T.key} a="start" o={neg} />
          </>;
        })()}
        <MinusGlyph x={pr.p(mul3(kxu, -0.35))[0]} y={pr.p(mul3(kxu, -0.35))[1] - 44} o={neg} />
        <Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={1.2} a0={angU} a1={angK} col={C.gold} draw={fin(f, tN, 20)} o={fout(f, t9 - 4)} />
        {(() => {
          // "90° left" just outside the middle of its arc, pushed out from the pin in screen space
          const m = pr.p([1.2 * Math.cos((angU + 45) * D2R), 1.2 * Math.sin((angU + 45) * D2R), 0]), c0 = pr.p([0, 0, 0]);
          const dx = m[0] - c0[0], dy = m[1] - c0[1], L = Math.hypot(dx, dy) || 1;
          // slanted view: under the pin (the arc is small there); top view: just outside the middle of the arc
          return f < t6 + 20 ? <Lbl x={c0[0]} y={c0[1] + 64} t="90° left" c={C.gold} s={T.key} a="middle" o={fin(f, tN + 10)} />
            : <Lbl x={m[0] + (dx / L) * 70} y={m[1] + (dy / L) * 50} t="90° left" c={C.gold} s={T.key} a={dx > 0 ? "start" : "end"} o={fin(f, t6 + 20) * fout(f, t8)} />;
        })()}
        <Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={1.2} a0={angU} a1={angU - 90} col={C.gold} draw={neg} />
        <L3 pr={pr} at={[1.95 * Math.cos((angU - 45) * D2R), 1.95 * Math.sin((angU - 45) * D2R), 0]} t="right" c={C.gold} s={T.key} o={neg} />
        <Keyword f={f} text="axis of turning" at={[1080, 760]} appear={t3} out={t5} targets={[pr.p([0.42, 0, 0.8])]} />
        {/* fix 2 (review 2 S3): the person is seen from above like the map, facing downwind = east; the left arm (gold) points north */}
        <g opacity={fin(f, t6 + 30) * fout(f, t7 - 6)}>
          <ellipse cx={pin[0] - 230} cy={pin[1] + 200} rx={15} ry={40} fill={C.key} fillOpacity={0.9} />
          <circle cx={pin[0] - 226} cy={pin[1] + 200} r={17} fill={C.local} stroke={C.bg} strokeWidth={3} />
          <polygon points={`${pin[0] - 206},${pin[1] + 190} ${pin[0] - 188},${pin[1] + 200} ${pin[0] - 206},${pin[1] + 210}`} fill={C.local} />
          <Arrow p={[pin[0] - 290, pin[1] + 200]} q={[pin[0] - 150, pin[1] + 200]} color={C.first} w={6} head={22} o={0.8} />
          <Arrow p={[pin[0] - 230, pin[1] + 166]} q={[pin[0] - 230, pin[1] + 70]} color={C.gold} w={8} head={26} />
          <Lbl x={pin[0] - 230} y={pin[1] + 286} t="facing downwind" c={C.key} s={T.floor} a="middle" />
          <Lbl x={pin[0] - 250} y={pin[1] + 80} t="left arm" c={C.gold} s={T.floor} a="end" />
        </g>
        <Keyword f={f} text="the cross product in weather" at={[1080, 250]} appear={AT(k, 0, "weather")} out={t2 - 6} targets={[]} />
        <Lbl x={1080} y={150} t="wind: u" c={C.first} s={T.calc} o={fin(f, AT(k, 1, "a wind"))} />
        <Keyword f={f} text="up" at={[1080, 250]} appear={AT(k, 2, "straight up")} out={t4} targets={[]} />
        <Keyword f={f} text="left of an eastward wind = north" at={[1080, 250]} appear={AT(k, 6, "ninety degrees to its left")} out={t7} targets={[]} s={48} />
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
        { lhs: KX_L, rhs: String.raw`= (0\times0 - 1\times5,`, at: t7 + 10, h: 76 },
        { rhs: String.raw`\ \ 1\times0 - 0\times0,\ \ 0)`, at: t7 + 22, cont: true, h: 76 },
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
          <Lbl x={c0[0] + 110} y={c0[1] + 52} t="u = (5, 0, 0) m/s" c={C.first} s={T.key} a="start" />
          <Arrow p={c0} q={[c0[0], c0[1] - 5 * S]} color={ROT} o={fin(f, t1)} />
          <Lbl x={c0[0] - 20} y={c0[1] - 5 * S - 40} t="k × u = (0, 5, 0)" c={ROT} s={T.key} a="middle" o={fin(f, t1)} />
          <Arrow p={uT} q={[uT[0], uT[1] - pL]} color={ROT} o={fin(f, t2)} />
          <RightTick at={uT} u1={[-1, 0]} u2={[0, -1]} o={fin(f, t2)} />
          <Lbl x={uT[0]} y={uT[1] - pL - 44} t="push ⟂ wind" c={ROT} s={T.key} a="middle" o={fin(f, t2) * fout(f, t3)} />
          <g opacity={c30}>
            <Arrow p={uT} q={p30} color={C.neg} dash="14 9" />
            <Band p={uT} q={alongEnd} color={C.neg} o={0.8} />
            <Band p={alongEnd} q={p30} color={ROT} o={0.8} />
            <Lbl x={(uT[0] + alongEnd[0]) / 2} y={uT[1] + 122} t="along: speeds up" c={C.neg} s={T.key} a="middle" />
            <Lbl x={p30[0] + 10} y={p30[1] - 44} t="across: turns" c={ROT} s={T.key} a="middle" />
            <Arc P={(x, y) => [uT[0] + x, uT[1] - y]} a0={60} a1={90} r={90} c={C.gold} w={5} />
            <Lbl x={uT[0] - 26} y={uT[1] - 100} t="30°" c={C.gold} s={T.key} a="end" />
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
              <Arrow p={p} q={[p[0] - (d[1] / L) * 70, p[1] - (d[0] / L) * 70]} color={ROT} w={6} head={22} /></g> : null;
          })}
          <Arrow p={c0} q={[c0[0], c0[1] - 5 * S]} color={C.neg} dash="14 9" o={fin(f, t6 + 4) * fout(f, t6 + 40)} />
          <Strike p={[c0[0] - 40, c0[1] - 5 * S + 40]} q={[c0[0] + 40, c0[1] - 5 * S + 120]} f={f} at={t6 + 14} />
        </g>
        {/* v5 R3-S1: the maths zone is never empty at the scene start */}
        <Keyword f={f} text="why exactly 90°?" at={[1100, 140]} appear={AT(k, 0, "exact quarter turn")} out={AT(k, 1, "names the direction") - 6} targets={[]} />
        <Keyword f={f} text="a direction: left of the wind" at={[1100, 140]} appear={AT(k, 1, "names the direction")} out={t3} targets={[]} />
        <Keyword f={f} text="push ⟂ wind" at={[1100, 240]} appear={AT(k, 2, "always at a right angle")} out={t4 + 10} targets={[]} />
        <g opacity={fin(f, AT(k, 2, "like the magnet")) * fout(f, t4)}>
          <circle cx={1650} cy={520} r={60} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" />
          <circle cx={1650} cy={460} r={12} fill={C.key} />
          <Lbl x={1650} y={630} t="proton" c={C.local} s={T.floor} a="middle" />
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
          <Lbl x={1420} y={572} t="k × ∇p" c={ROT} s={T.key} />
          <Keyword f={f} text="weather maps" at={[1150, 820]} appear={t7} targets={[]} />
        </g>
      </Svg>
      <Layered parts={[{ t: String.raw`\text{push}` }, { t: "=" }, { t: String.raw`(\text{strength})`, u: { w: String.raw`\text{a number}`, c: C.key } }, { t: String.raw`\times` },
        { t: String.raw`\mathbf k\times\mathbf u`, c: ROT, u: { w: String.raw`\text{quarter turn}`, c: ROT } }]}
        layers={[{ t: "all", o: 1 }, { u: [2, 4], o: fin(f, t5 + 30) }]} x={1012} y={420} size={64} ay={0} o={fin(f, t5) * fout(f, t7 - 6)} />
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
const HalfEarthView: React.FC<{ st: CamState; slide: number; whole?: number; three?: React.ReactNode; children?: (pr: Projector) => React.ReactNode;
  fadeBelow?: number }> = ({ st, slide, whole = 0, three, children, fadeBelow }) => {
  const tex = useTex(staticFile("cp/bmng.jpg"));
  const pr = projector(st, W3, H3);
  if (!tex) return null;
  // fadeBelow: the globe fades out over the 80 px above y = fadeBelow (keeps the caption band empty when zoomed in)
  const mask = fadeBelow !== undefined ? `linear-gradient(to bottom, black 0px, black ${fadeBelow - 80}px, transparent ${fadeBelow}px)` : undefined;
  return (
    <>
      <View3D st={st} amb={1.4} dir={1.0} style={mask ? { WebkitMaskImage: mask, maskImage: mask } : undefined}>
        <HalfEarthMesh tex={tex} lon0={LON0} slide={slide} whole={whole} />
        {three}
      </View3D>
      <Svg>{fadeBelow !== undefined
        ? <><defs><clipPath id="heclip"><rect x={0} y={0} width={1920} height={fadeBelow - 20} /></clipPath></defs><g clipPath="url(#heclip)">{children ? children(pr) : null}</g></>
        : children ? children(pr) : null}</Svg>
    </>
  );
};
const pinAt = (lat: number, r = 1): V3 => ll(lat, LON0, r);
/** the axis and the equator's trace drawn ON the face (SVG, so never hidden behind the outside) */
const FaceLines: React.FC<{ pr: Projector; o?: number; eq?: number; top?: number }> = ({ pr, o = 1, eq = 1, top = 1.2 }) => (o <= 0 ? null : (
  <g opacity={o}>
    <Seg3 pr={pr} a={[0, -1.0, 0]} b={[0, top, 0]} c={C.gold} w={5} dash="16 10" />
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
          <L3 pr={pr} at={add3(mul3(HE_M, 0.52 * Math.cos(22 * D2R)), [0, 0.52 * Math.sin(22 * D2R), 0])} t="φ = 45°" c={C.gold} s={T.key} a="start" o={fin(f, t4) * fout(f, AT(k, 6, "along x") - 10)} />
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
        {/* v5 R3-S1: the maths zone is never empty at the scene start */}
        {/* fx1 (S10): the maths zone carries the first sentence's keyword */}<Keyword f={f} text="follow a place" at={[1100, 200]} appear={AT(k, 0, "To follow a place")} out={AT(k, 0, "where it is") - 8} targets={[]} />
        <Keyword f={f} text="where is our place?" at={[1100, 200]} appear={AT(k, 0, "where it is")} out={AT(k, 1, "the position vector") - 6} targets={[]} />
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
            <L3 pr={pr} at={add3(zc, HE_M, R / 2)} t="radius" c={C.gold} s={T.key} dy={-30} o={fin(f, t2) * fout(f, t6)} />
            <Poly3 pr={pr} pts={[[0, 0, 0], zc, pin]} c={C.gold} w={3} fill={C.gold} fo={0.18} o={fin(f, t4)} />
            <Poly3 pr={pr} pts={Array.from({ length: 21 }, (_, i) => add3(mul3(HE_M, 0.3 * Math.sin((i / 20) * 45 * D2R)), [0, 0.3 * Math.cos((i / 20) * 45 * D2R), 0]))} c={C.gold} w={5} o={fin(f, t3)} />
            <L3 pr={pr} at={add3(mul3(HE_M, 0.42 * Math.sin(22 * D2R)), [0, 0.42 * Math.cos(22 * D2R), 0])} t="θ" c={C.gold} s={T.key} a="start" o={fin(f, t3)} />
            <L3 pr={pr} at={[0, 1.33, 0]} t="Ω" c={ROT} s={T.calc} a="start" dx={24} o={fin(f, t3)} />
            <L3 pr={pr} at={mul3(pin, 0.5)} t="r" c={C.first} s={T.calc} a="end" dx={-30} dy={30} />
            {lon > 3 ? <Poly3 pr={pr} pts={trail} c={C.key} w={6} /> : null}
          </>;
        }}
      </HalfEarthView>
      <Svg>
        <Keyword f={f} text="how fast?" at={[1100, 140]} appear={6} out={t1 + 10} targets={[]} />
        {/* fix 2 (review 2 S2): the words of S1-S3 in the maths zone (it was empty for 20 s) */}
        <Keyword f={f} text="circle of latitude" at={[1100, 240]} appear={AT(k, 1, "circle of latitude")} out={t4 - 6} targets={[]} c={C.gold} s={T.floor} />
        <Keyword f={f} text="radius = distance from the axis" at={[1100, 320]} appear={AT(k, 2, "distance from the axis")} out={t4 - 6} targets={[]} c={C.gold} s={T.floor} />
        <Keyword f={f} text="θ: angle between Ω and r" at={[1100, 400]} appear={AT(k, 3, "the angle between")} out={t4 - 6} targets={[]} c={C.gold} s={T.floor} />
        <Lbl x={1100} y={800} t="r = (4505, 0, 4505) km" c={C.first} s={50} o={fout(f, t6 - 6)} />
      </Svg>
      <TeX s={String.raw`\text{radius} = |\mathbf r|\sin\theta`} x={1080} y={150} size={T.calc} o={fin(f, t4) * fout(f, t5)} />
      <CalcStack f={f} x={1200} y={110} size={50} maxLines={2} rows={[
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
        <g data-lc-ok="strike">
          <Strike p={[1340, 670]} q={[1380, 630]} f={f} at={AT(k, 7, "cancel")} />
          <Strike p={[1350, 735]} q={[1390, 695]} f={f} at={AT(k, 7, "cancel") + 6} />
        </g>
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

          <L3 pr={pr} at={[0, 1.33, 0]} t="Ω" c={ROT} s={T.calc} a="start" dx={24} />
          {vL > 0.02 ? <TipL3 pr={pr} from={pin} to={vt} t={f >= AT(k, 6, "three hundred") ? label : "v"} c={C.second} s={T.key} o={fin(f, t1)} /> : null}
          {/* S6: v points along y (out of the cut face, east): a ⊙ y tag at the arrow; at the pole v = 0 is written */}
          {/* fx1 (Part 2 S9): the ⊙ y tag stays with v at every latitude (v leaves the cut face, east); the r label is in the maths zone */}
          {vL > 0.02 ? <CircleDot x={pr.p(vt)[0] + 10} y={pr.p(vt)[1] - 64} r={18} w={4} c={C.second} o={fin(f, t1)} /> : null}
          {vL > 0.02 ? <Lbl x={pr.p(vt)[0] + 36} y={pr.p(vt)[1] - 64} t="y · east" c={C.second} s={T.floor} o={fin(f, t1)} /> : null}
          {vL <= 0.02 ? <L3 pr={pr} at={pin} t="v = (0, 0, 0)" c={C.second} s={T.key} a="start" dx={40} dy={40} o={fin(f, AT(k, 7, "at the poles") + 20)} /> : null}
          <Tick3 pr={pr} at={pin} u1={HE_E} u2={[0, 1, 0]} s={0.12} o={fin(f, t1 + 10) * fout(f, t7)} />
          <Tick3 pr={pr} at={pin} u1={HE_E} u2={norm3(mul3(pin, -1))} s={0.12} c={C.first} o={fin(f, t1 + 16) * fout(f, t7)} />

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
      ]} o={fout(f, t7 - 6)} />
      <Svg><Lbl x={1080} y={430} t={rlab} c={C.first} s={T.key} o={fin(f, t7)} />
        <Lbl x={1080} y={510} t={label} c={C.second} s={T.key} o={fin(f, t7) * (la > 89 ? 0 : 1)} /></Svg>
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
        {/* fx1 (S10): the maths zone carries the first sentence's keyword */}<Keyword f={f} text="air over the spinning ground" at={[1150, 160]} appear={AT(k, 0, "air moving")} out={AT(k, 1, "We turn with Earth") - 8} targets={[]} />
        <Keyword f={f} text="turning with Earth" at={[1150, 160]} appear={AT(k, 1, "We turn with Earth")} out={t2} targets={[]} />
        <Keyword f={f} text="drifts sideways" at={[1150, 270]} appear={AT(k, 1, "drift sideways")} out={t2} targets={[]} />
        <Keyword f={f} text="Coriolis effect" at={[1150, 160]} appear={AT(k, 2, "Coriolis effect")} targets={[]} s={T.calc} />
        <Lbl x={1100} y={300} t="Northern Hemisphere · right" c={C.key} s={T.key} o={fin(f, AT(k, 3, "to the right"))} />
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
  // U-CF (2026-10-29): the new S5 (index 4) is the rule of s26a1 used on r; the old S5-S8 are now indices 5-8
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), tR = SS(k, 4), t4 = SS(k, 5), t5 = SS(k, 6), t6 = SS(k, 7), t7 = SS(k, 8);
  const [RRL, RRR] = splitEq(EQ_RULE_R), RRP = eqPieces(RRR);
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
        {/* v5 R3-S1: the maths zone is never empty at the scene start */}
        <Keyword f={f} text="the rider · the outside watcher" at={[1100, 140]} appear={AT(k, 0, "what each one sees")} out={AT(k, 1, "call it u") - 6} targets={[]} />
        <Keyword f={f} text="velocity over the floor" at={[1100, 140]} appear={AT(k, 1, "call it u")} out={t3} targets={[]} c={C.first} />
        <Keyword f={f} text="the floor's velocity" at={[1100, 230]} appear={AT(k, 2, "Omega cross r")} out={t3} targets={[]} c={C.second} />
        <Keyword f={f} text="Newton's law: outside watcher" at={[1100, 470]} appear={t4} targets={[]} s={50} />
        <Lbl x={1100} y={560} t="no push → v outside constant" c={C.key} s={50} o={fin(f, t5)} />
        <Lbl x={1100} y={660} t="how does u + Ω × r change?" c={C.key} s={T.key} o={fin(f, t6)} />
        <Keyword f={f} text="each gives Ω × u" at={[1100, 770]} appear={t7} targets={[]} c={ROT} />
      </Svg>
      <Layered parts={VO} layers={[{ t: "all", o: 1 }, { u: [2, 4], o: fin(f, t7) }]} x={1080} y={250} size={70} ay={0} o={fin(f, t3)} />
      {/* U-CF S5: the rule (muted), B → r, and what it gives for the position (for this sentence only) */}
      <TeX s={EQ_RULE} x={1080} y={440} size={44} c={C.muted} o={fin(f, tR) * fout(f, SE(k, 4))} />
      <CalcStack f={f} x={1330} y={500} size={52} o={fout(f, SE(k, 4))} rows={[
        { lhs: RRL, rhs: RRP[0], at: AT(k, 4, "our rule used on the position"), h: 130 },
        { rhs: RRP[1], at: AT(k, 4, "the rider sees r change"), cont: true, c: C.key, h: 90 },
      ]} />
      <Svg><Lbl x={1080} y={790} t="B → r" c={C.gold} s={T.key} o={fin(f, AT(k, 4, "our rule used on the position")) * fout(f, SE(k, 4))} /></Svg>
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
        <Keyword f={f} text="fast near the edge," at={[1100, 120]} appear={AT(k, 1, "fast near the edge")} out={t3} targets={[]} s={T.floor} />
        <Keyword f={f} text="slow near the centre" at={[1100, 176]} appear={AT(k, 1, "hardly at all")} out={t3} targets={[]} s={T.floor} />
        <Lbl x={1100} y={260} t="floor: Ω × r" c={C.second} s={T.key} o={fin(f, t2)} />
        <Lbl x={1100} y={330} t="u per second →" c={C.key} s={T.floor} o={fin(f, t3)} />
        <Lbl x={1100} y={386} t="Ω × r changes by Ω × u" c={C.key} s={T.floor} o={fin(f, t3)} />
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
    { t: String.raw`- \boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`, c: C.local, u: { w: String.raw`\text{centrifugal}`, c: C.local } }];
  if (plainOf(D3).replace(/\s/g, "") !== EQ_DUDT3.replace(/\s/g, "")) throw new Error("s27 parts ≠ EQ_DUDT3");
  // O2: the merry-go-round is the picture of this scene, large and in the rider's view (as s26a–s26d): first full size,
  // then small at the bottom right while the equation is moved across, then back under the finished equation.
  const kf: [number, number, number, number][] = [[0, 520, 500, 300], [t2 - 4, 520, 500, 300], [t2 + 20, 1600, 690, 160], [t5, 1600, 690, 160], [t5 + 24, 430, 640, 205]];
  let dc = kf[0];
  for (let i = 1; i < kf.length; i++) {
    if (f >= kf[i][0]) { dc = kf[i]; continue; }
    const e = easeIO(clamp((f - kf[i - 1][0]) / Math.max(1, kf[i][0] - kf[i - 1][0]), 0, 1));
    dc = [f, kf[i - 1][1] + (kf[i][1] - kf[i - 1][1]) * e, kf[i - 1][2] + (kf[i][2] - kf[i - 1][2]) * e, kf[i - 1][3] + (kf[i][3] - kf[i - 1][3]) * e];
    break;
  }
  const [, dx, dy, dR] = dc;
  const ds = dR / MG.radius;
  const PD = discXY(dx, dy, ds);
  const NR = MG.rotating.length - 1, per = NR + 40;
  const jr = Math.min(NR, ((f % per) + per) % per);
  const ballD = PD(MG.rotating[jr]);
  const nxt = PD(MG.rotating[Math.min(NR, jr + 1)]), prv = PD(MG.rotating[Math.max(0, jr - 1)]);
  const ud = unit(prv, nxt);
  const uS = 0.45 * dR, pS = 0.32 * dR;
  const uTip: Pt = [ballD[0] + ud[0] * uS, ballD[1] + ud[1] * uS];
  const pushTip: Pt = [ballD[0] - ud[1] * pS, ballD[1] + ud[0] * pS];   // screen right of the motion (y down)
  const pushO = fin(f, t5, 12);
  const big = 1 - fin(f, t2 - 4, 20);
  const seenO = fin(f, t2) * (f < t4 ? 1 : 0.4) * fout(f, t5);
  const d3y = 476 - 306 * easeIO(clamp((f - t5) / 20, 0, 1));
  return (
    <Scene>
      <Svg>
        <Disc cx={dx} cy={dy} s={ds} ang={0} />
        <polyline points={MG.rotating.slice(0, jr + 1).map((q) => PD(q).join(",")).join(" ")} fill="none" stroke={ROT} strokeWidth={6} opacity={0.75} />
        <Observer x={dx + 0.25 * dR} y={dy + 0.15 * dR} s={dR / 260} />
        <Arrow p={ballD} q={uTip} color={C.first} w={Math.max(5, dR / 30)} head={Math.max(20, dR / 9)} />
        <Arrow p={ballD} q={pushTip} color={ROT} w={Math.max(5, dR / 30)} head={Math.max(20, dR / 9)} o={pushO} />
        <circle cx={ballD[0]} cy={ballD[1]} r={Math.max(9, dR / 22)} fill={C.key} stroke={C.bg} strokeWidth={3} />
        <Lbl x={uTip[0] + ud[0] * 34} y={uTip[1] + ud[1] * 34} t="u" c={C.first} s={T.key} a="middle" o={Math.min(1, big + pushO)} />
        <Lbl x={pushTip[0] - ud[1] * 40} y={pushTip[1] + ud[0] * 40} t="push" c={ROT} s={T.floor} a="middle" o={pushO} />
        <Lbl x={dx} y={Math.min(dy + dR + 52, 840)} t="the rider's view" c={C.key} s={T.key} a="middle" o={big * big} />
        <Arrow p={[dx + dR + 12, dy]} q={[dx + dR + 92, dy]} color={C.local} w={6} head={22} o={fin(f, t7)} />
        <Keyword f={f} text="push per kilogram = acceleration" at={[1100, 300]} appear={t1} out={t2 - 4} targets={[]} s={T.floor} />
        <Keyword f={f} text="velocity change per second" at={[1100, 390]} appear={AT(k, 1, "how much the velocity changes")} out={t2 - 4} targets={[]} s={T.floor} c={C.local} />
        <Keyword f={f} text="Newton" at={[1300, 420]} appear={t3} out={t4 + 10} targets={[[1330, 330]]} />
        <Lbl x={1100} y={500} t="2 ← ① + ②" c={C.gold} s={T.key} o={fin(f, t6)} />
        <Lbl x={1100} y={590} t="− ← moved across" c={C.gold} s={T.key} o={fin(f, AT(k, 6, "the minus"))} />
        {/* U-CF S9: where does the leftover go? (s27b-s27g) */}
        <Lbl x={1470} y={d3y + 46} t="?" c={C.gold} s={T.hero} a="start" o={fin(f, AT(k, 8, "where it goes on Earth"))} />
      </Svg>
      <Layered parts={SEEN.slice(0, 2)} layers={[{ t: "all", o: 1 }]} x={110} y={150} size={56} ay={0} o={seenO} />
      {f < t5 + 11 ? <Layered parts={SEEN.slice(2)} layers={[{ t: "all", o: 1 }, { u: [0, 2, 4, 6], o: fin(f, t2 + 30) }]} x={110} y={240} size={64} ay={0} o={seenO} /> : null}
      <TeX s={String.raw`= \text{real pushes}`} x={1250} y={290} size={56} o={fin(f, AT(k, 3, "equals the real pushes")) * (f < t4 ? 1 : 0.4) * fout(f, t5)} />
      {/* S7: the moved line appears under the dimmed outside line (the move is visible), then takes its place */}
      <Layered parts={D3} layers={[{ t: "all", o: 1 }, { u: [3], o: fin(f, t5 + 10) }, { u: [4], o: fin(f, t7) }]} x={110} y={d3y} size={64} ay={0} o={fin(f, t4)} />
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
          <Arrow p={ball} q={right} color={ROT} o={fin(f, t2)} />
          <Lbl x={right[0] + 20} y={right[1] + 30} t="−2Ω × u" c={ROT} s={T.key} o={fin(f, t2)} />
          <RightTick at={ball} u1={unit(ball, U)} u2={unit(ball, left)} o={fin(f, t1 + 10)} />
          <circle cx={ball[0]} cy={ball[1]} r={14} fill={C.key} stroke={C.bg} strokeWidth={3} />
        </g>
        {n1 > 0 ? <polyline points={MG.rotating.slice(0, n1 + 1).map((p) => P2(p).join(",")).join(" ")} fill="none" stroke={C.gold} strokeWidth={9} strokeDasharray="2 12" strokeLinecap="round" /> : null}
        {n2 > 0 ? <polyline points={MG.check_path.slice(0, n2 + 1).map((p) => P2(p).join(",")).join(" ")} fill="none" stroke={ROT} strokeWidth={5} /> : null}
        <g opacity={fin(f, t4) * fout(f, t5 - 4)}>
          <circle cx={1640} cy={190} r={100} fill="#24304b" stroke="#c9d2e3" strokeWidth={3} />
          <line x1={1640} y1={190 + 94} x2={1640} y2={190 - 94} stroke={C.first} strokeWidth={5} strokeDasharray="12 8" />
          <Lbl x={1640} y={345} t="outside: straight" c={C.first} s={T.floor} a="middle" />
        </g>
        {/* v5 R3-S1: the maths zone is never empty at the scene start */}
        <Keyword f={f} text="the minus?" at={[1100, 160]} appear={AT(k, 0, "the minus")} out={t1} targets={[]} />
        <Lbl x={1100} y={160} t="Ω up → Ω × u: left" c={ROT} s={T.key} o={fin(f, AT(k, 1, "Omega points up")) * fout(f, t2 - 4)} />
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

// ================================================================ U-CF (2026-10-29): the turning rule used twice, and the centrifugal term
// s26a1 the rule · s26e/s26f the rule on the velocity (the 2 in 2Ω × u, the leftover Ω × (Ω × r)) · s27b-s27d the centrifugal
// acceleration (vector triple product, Ω² r⊥, its size) · s27e-s27g effective gravity, the level sea, three traces.
// Every number is read from data/merry.json (rule, rule_twice, centrifugal) and data/earth.json (centrifugal, effective_gravity,
// sideways, three_traces), written by build_ch00_cross_product_why.py (N23, N24) from tested fluidpy functions.
const EQ_RULE = String.raw`\left(\frac{d\mathbf B}{dt}\right)_{\text{outside}} = \left(\frac{d\mathbf B}{dt}\right)_{\text{rider}} + \boldsymbol\Omega\times\mathbf B`;
const EQ_RULE_R = String.raw`\left(\frac{d\mathbf r}{dt}\right)_{\text{outside}} = \left(\frac{d\mathbf r}{dt}\right)_{\text{rider}} + \boldsymbol\Omega\times\mathbf r = \mathbf u + \boldsymbol\Omega\times\mathbf r`;
const EQ_RULE_V = String.raw`\left(\frac{d}{dt}(\mathbf u + \boldsymbol\Omega\times\mathbf r)\right)_{\text{outside}} = \left(\frac{d}{dt}(\mathbf u + \boldsymbol\Omega\times\mathbf r)\right)_{\text{rider}} + \boldsymbol\Omega\times(\mathbf u + \boldsymbol\Omega\times\mathbf r)`;
const EQ_RIDER_PART = String.raw`\left(\frac{d}{dt}(\mathbf u + \boldsymbol\Omega\times\mathbf r)\right)_{\text{rider}} = \frac{d\mathbf u}{dt} + \boldsymbol\Omega\times\mathbf u`;
const EQ_SEEN2 = String.raw`\text{change seen outside} = \frac{d\mathbf u}{dt} + 2\boldsymbol\Omega\times\mathbf u + \boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`;
const EQ_SPLIT = String.raw`\boldsymbol\Omega\times(\mathbf u + \boldsymbol\Omega\times\mathbf r) = \boldsymbol\Omega\times\mathbf u + \boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`;
const EQ_CF = String.raw`-\boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r) = \Omega^2\,\mathbf r`;
const EQ_VTP = String.raw`\mathbf p\times(\mathbf q\times\mathbf s) = \mathbf q\,(\mathbf p\cdot\mathbf s) - \mathbf s\,(\mathbf p\cdot\mathbf q)`;
const EQ_VTP_OM = String.raw`\boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r) = \boldsymbol\Omega\,(\boldsymbol\Omega\cdot\mathbf r) - \mathbf r\,(\boldsymbol\Omega\cdot\boldsymbol\Omega)`;
const EQ_CF625 = String.raw`\Omega^2|\mathbf r| = 0.5^2\times2.5 = 0.25\times2.5 = 0.625\ \mathrm{m/s^2}`;
const EQ_CFE = String.raw`-\boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r) = \Omega^2\,\mathbf r_\perp`;
const EQ_CF_ALONG = String.raw`\Omega^2\,\mathbf r - \Omega^2\,\mathbf r_{\text{along}} = \Omega^2\,\mathbf r_\perp`;
const EQ_CF_MAG = String.raw`|\Omega^2\,\mathbf r_\perp| = \Omega^2\,a\cos\varphi`;
const EQ_CF034 = String.raw`5.32\times10^{-9}\times6\,371\,000\ \mathrm m \approx 0.034\ \mathrm{m/s^2}`;
const EQ_OM2 = String.raw`\Omega^2 = (7.29\times10^{-5})^2 \approx 5.32\times10^{-9}\ \mathrm{s^{-2}}`;
const EQ_CF024 = String.raw`5.32\times10^{-9}\times4\,505\,000\ \mathrm m \approx 0.024\ \mathrm{m/s^2}`;
const EQ_GEFF = String.raw`\mathbf g = \mathbf g^{*} - \boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`;
const EQ_DUDT_G = String.raw`\frac{d\mathbf u}{dt} = \text{other pushes} + \mathbf g - 2\boldsymbol\Omega\times\mathbf u`;
const EQ_SIDE = String.raw`\text{sideways} \approx 0.017\ \mathrm{m/s^2}`;
const EQ_COR10 = String.raw`\text{Coriolis} \le 2\Omega\times10 \approx 0.0015\ \mathrm{m/s^2}`;
const EQ_GPOLE = String.raw`g_{\text{equator}} \approx 9.78\ \mathrm{m/s^2},\quad g_{\text{poles}} \approx 9.83\ \mathrm{m/s^2}`;
const EQ_TILT = String.raw`\text{tilt} \approx 0.1^\circ \;\to\; \approx 0.2^\circ`;
const EQ_BULGE = String.raw`a_{\text{equator}} - a_{\text{poles}} \approx 21\ \mathrm{km} \approx \tfrac{1}{300}\,a`;
const BROWN = "#c9935f"; // gravity g* and g (storyboard U-CF3: brown); a colour of its own, never a sign
const MGX = merry as unknown as typeof MG & {
  rule: { t: number[]; B0: number[]; painted: number[][]; growing: number[][]; omega_x_B0: number[]; growth_m_s: number; len0_m: number };
  rule_twice: { t: number; u: number[]; r: number[]; omega_x_r: number[]; omega_x_u: number[]; omega_x_omega_x_r: number[]; a_rider: number[];
    floor_arrow_ghosts: number[][] };
  centrifugal: { x: number[]; acc: number[]; mag: number; omega_sq: number; period_s: number; omega_dot_r: number; omega_dot_omega: number } };
const EAX = earth as unknown as {
  centrifugal: { lat_deg: number[]; acc: number[][]; mag: number[]; omega_sq: number; r_along_km: number[]; r_perp_km: number[]; up_part: number;
    north_part: number; angle_from_up_deg: number; ratio_to_g_percent: number[] };
  effective_gravity: { g_star: number; g_45: number; tilt_deg: number; g_vec_45: number[] };
  sideways: { north_part: number; coriolis_10: number; ratio: number };
  three_traces: { g_equator: number; g_poles: number; spin_share: number; tilt_sphere_max_deg: number; tilt_real_deg: number; radius_diff_km: number;
    inv_flattening: number; flattening: number; drawn_ratio_x50: number } };
// numbers inside the U-CF TeX strings = the data (the render fails otherwise)
const CHECK_CF: [string, number, number, number][] = [
  ["Ω × B", Math.hypot(MGX.rule.omega_x_B0[0], MGX.rule.omega_x_B0[1]), 0.6, 1e-6],
  ["centrifugal disc", MGX.centrifugal.mag, 0.625, 1e-9], ["Ω² disc", MGX.centrifugal.omega_sq, 0.25, 1e-12], ["turn s", MGX.centrifugal.period_s, 12.5, 0.1],
  ["Ω² Earth", EAX.centrifugal.omega_sq, 5.32e-9, 5e-12], ["cf equator", EAX.centrifugal.mag[0], 0.034, 5e-4], ["cf 45", EAX.centrifugal.mag[1], 0.024, 5e-4],
  ["cf pole", EAX.centrifugal.mag[2], 0, 1e-9], ["r⊥ 45", EAX.centrifugal.r_perp_km[0], 4505, 0.5], ["⅓ %", EAX.centrifugal.ratio_to_g_percent[0], 0.33, 0.02],
  ["sideways", -EAX.sideways.north_part, 0.017, 5e-4], ["Coriolis 10", EAX.sideways.coriolis_10, 0.0015, 5e-5], ["> 10 ×", EAX.sideways.ratio, 11.6, 0.1],
  ["g equator", EAX.three_traces.g_equator, 9.78, 5e-3], ["g poles", EAX.three_traces.g_poles, 9.83, 5e-3], ["⅔", EAX.three_traces.spin_share, 0.667, 0.02],
  ["tilt sphere", EAX.three_traces.tilt_sphere_max_deg, 0.1, 0.005], ["tilt real", EAX.three_traces.tilt_real_deg, 0.2, 0.01],
  ["21 km", EAX.three_traces.radius_diff_km, 21, 0.5], ["1/300", EAX.three_traces.inv_flattening, 300, 2], ["g*", EAX.effective_gravity.g_star, 9.82, 5e-3],
];
for (const [n, v, ref, tol] of CHECK_CF) if (Math.abs(v - ref) > tol) throw new Error(`U-CF data ≠ storyboard TeX: ${n} = ${v}, TeX ${ref}`);
const rot2 = (v: number[], a: number): number[] => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
/** screen vector of a velocity / acceleration (metres → px, y up) */
const sv = (p: Pt, v: number[], k: number): Pt => [p[0] + v[0] * k, p[1] - v[1] * k];

// ---------------------------------------------------------------- s26a1 the rule for a turning floor
const S26A1: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26a1_rule");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10);
  const R = MGX.rule, N = R.t.length - 1, om = MG.Omega;
  const c: Pt = [500, 450], s = 115;
  const P2 = discXY(c[0], c[1], s);
  const tA = AT(k, 4, "swings round"), tG = AT(k, 6, "growing longer");
  const jA = Math.round(clamp((f - tA) / N, 0, 1) * N);          // one sample per frame: the true speed of a 0.5 rad/s floor
  const jG = Math.round(clamp((f - tG) / N, 0, 1) * N);
  const angEnd = om * R.t[N];
  const grow = f >= tG;
  // the growing run continues from where the painted run stopped (the data turned by the floor's angle: same physics)
  const B = grow ? rot2(R.growing[jG], angEnd) : R.painted[jA];
  const ang = grow ? angEnd + om * R.t[jG] : om * R.t[jA];
  const tip = P2(B);
  const VS = 300;                                                 // px per m/s
  const oxb = [-om * B[1], om * B[0]];                            // Ω × B for Ω = (0, 0, Ω): a quarter turn of B, times Ω
  const Lb = Math.hypot(B[0], B[1]), rc = grow ? [(B[0] / Lb) * R.growth_m_s, (B[1] / Lb) * R.growth_m_s] : [0, 0];
  const oA = fout(f, tG - 4, 12);
  const arcA = R.painted.slice(0, jA + 1).map((p) => P2(p).join(",")).join(" ");
  const arcG = R.growing.slice(0, jG + 1).map((p) => P2(rot2(p, angEnd)).join(",")).join(" ");
  const showV = fin(f, t5) * (grow ? fin(f, tG + N, 10) : 1);
  const sumO = fin(f, t7);
  const tipV = sv(tip, oxb, VS), tipR = sv(tip, rc, VS), tipS = sv(tip, [rc[0] + oxb[0], rc[1] + oxb[1]], VS);
  // the rider's inset (disc fixed on the screen, the arrow fixed to it)
  const ins = { x: 1655, y: 690, s: 44 };
  const insO = fin(f, t3) * fout(f, t8 - 6);
  const Bi = grow ? rot2(R.growing[jG], -om * R.t[jG]) : R.painted[0];   // the rider's view: only the length changes
  const PI = discXY(ins.x, ins.y, ins.s);
  const RA: Part[] = [{ t: String.raw`\left(\frac{d\mathbf B}{dt}\right)_{\text{outside}}`, u: { w: String.raw`\text{outside watcher}`, c: C.gold } }, { t: "=" }];
  const RB: Part[] = [{ t: String.raw`\left(\frac{d\mathbf B}{dt}\right)_{\text{rider}}`, c: C.first }, { t: "+" },   // fix 2 (S8): no second "rider" brace
    { t: String.raw`\boldsymbol\Omega\times\mathbf B`, c: ROT, u: { w: String.raw`\text{carried round}`, c: C.gold } }];
  if ((plainOf(RA) + plainOf(RB)).replace(/\s/g, "") !== EQ_RULE.replace(/\s/g, "")) throw new Error("s26a1 parts ≠ EQ_RULE");
  return (
    <Scene>
      <Svg>
        <Disc cx={c[0]} cy={c[1]} s={s} ang={ang} />
        <path d={`M ${c[0] + 375} ${c[1]} A 375 375 0 0 0 ${c[0] + 375 * Math.cos(1.0)} ${c[1] - 375 * Math.sin(1.0)}`} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, 8)} />
        {/* fix 2 (S7): Ω sits below-right of the hub, where B never goes (B turns through the upper half); B keeps its tail on the hub
            so that its tip really moves at Ω × B (a tail off the hub would make the tip move at Ω × (tail + B)) */}
        <Lbl x={c[0] + 40} y={c[1] + 62} t="Ω" c={ROT} s={T.key} a="start" o={fin(f, 8)} />
        {/* S5: ghosts every ≈ 10° and the gold path of the tip */}
        <g opacity={oA}>
          {R.painted.filter((_, i) => i % 10 === 0 && i < jA).map((p, i) => <Arrow key={i} p={c} q={P2(p)} color={C.key} w={5} head={20} o={0.3} halo={false} />)}
          {jA > 0 ? <polyline points={arcA} fill="none" stroke={C.gold} strokeWidth={6} /> : null}
        </g>
        {grow && jG > 0 ? <polyline points={arcG} fill="none" stroke={C.gold} strokeWidth={6} /> : null}
        <Arrow p={c} q={tip} color={C.key} o={fin(f, t1)} />
        <Lbl x={tip[0] + 22} y={tip[1] + 34} t="B" c={C.key} s={T.calc} o={fin(f, t1)} />
        {/* S6: the tip's velocity Ω × B (tangent to the circle); S7-S8: the rider's change along B and their sum */}
        <Arrow p={tip} q={tipV} color={ROT} w={8} head={28} o={showV} />
        {/* fix 2 (S7): "Ω × B" beside the middle of its arrow, on the hub side (the dashed sum lies on the other side) */}
        <Lbl x={tip[0] + (0.72 - 0.22 * fin(f, tG, 20)) * (tipV[0] - tip[0]) - (B[0] / Math.hypot(B[0], B[1])) * 60} y={tip[1] + (0.72 - 0.22 * fin(f, tG, 20)) * (tipV[1] - tip[1]) + (B[1] / Math.hypot(B[0], B[1])) * 60} t="Ω × B" c={ROT} s={T.key} a="middle" o={showV} />
        <Arrow p={tip} q={tipR} color={C.first} w={8} head={18} o={grow ? fin(f, tG + N, 10) : 0} />
        <Lbl x={tipR[0] + 26} y={tipR[1] - 46} t="rider's change" c={C.first} s={T.floor} a="start" o={grow ? fin(f, tG + N + 6, 10) : 0} />
        <Arrow p={tip} q={tipS} color={C.ink} w={6} head={24} o={sumO} dash="12 8" />
        {/* S6: the same rule we met on Earth (Ω × r), as a thumbnail */}
        <g opacity={fin(f, AT(k, 5, "Earth's ground")) * fout(f, t6)}>
          <circle cx={170} cy={150} r={62} fill="#1d3a5f" stroke={C.ink} strokeWidth={3} />
          <line x1={170} y1={70} x2={170} y2={230} stroke={C.gold} strokeWidth={4} strokeDasharray="10 7" />
          <Arrow p={[170, 150]} q={[214, 106]} color={C.first} w={6} head={20} halo={false} />
          <Arrow p={[214, 106]} q={[262, 120]} color={C.second} w={6} head={20} halo={false} />
          <Lbl x={262} y={78} t="Ω × r" c={C.second} s={T.floor} a="start" />
        </g>
        {/* the rider's view */}
        <g opacity={insO}>
          <Disc cx={ins.x} cy={ins.y} s={ins.s} ang={0} />
          <Arrow p={[ins.x, ins.y]} q={PI(Bi)} color={C.key} w={7} head={24} />
          {grow ? <Band p={PI(R.painted[0])} q={PI(Bi)} color={C.first} o={fin(f, tG + 10)} w={14} /> : null}
          <Lbl x={ins.x} y={ins.y - ins.s * MG.radius - 44} t="the rider's view" c={C.key} s={T.floor} a="middle" />
        </g>
        <Keyword f={f} text="one rule" at={[1100, 130]} appear={AT(k, 0, "one rule")} out={t3 - 6} targets={[]} />
        <Keyword f={f} text="an arrow painted on the floor: B" at={[1100, 220]} appear={t1} out={t3 - 6} targets={[]} s={T.floor} />
        <Keyword f={f} text="position · velocity · direction" at={[1100, 300]} appear={t2} out={t3 - 6} targets={[]} s={T.floor} />
        <Keyword f={f} text="rider: B stays the same" at={[1100, 130]} appear={t3} out={t6 - 6} targets={[]} />
        <Keyword f={f} text="outside: B swings round" at={[1100, 220]} appear={tA} out={t6 - 6} targets={[]} />
        <Keyword f={f} text="tip moves at Ω × B" at={[1100, 310]} appear={AT(k, 5, "the tip moves")} out={t6 - 6} targets={[]} c={ROT} />
        <Lbl x={1100} y={395} t="just as Ω × r on Earth" c={C.second} s={T.floor} o={fin(f, AT(k, 5, "Earth's ground")) * fout(f, t6 - 6)} />
        <Keyword f={f} text="rider sees B grow" at={[1100, 130]} appear={t6} out={t8 - 6} targets={[]} c={C.first} />
        <Keyword f={f} text="both changes add" at={[1100, 220]} appear={t7} out={t8 - 6} targets={[]} />
        <Keyword f={f} text="dB/dt: change per second" at={[1100, 130]} appear={t8} targets={[]} />
        <Lbl x={1100} y={215} t="… and who is watching" c={C.muted} s={T.floor} o={fin(f, AT(k, 8, "say who is watching"))} />
        <Lbl x={1100} y={815} t="B = r" c={C.gold} s={T.calc} o={fin(f, AT(k, 10, "first on the position"))} />
        <Lbl x={1400} y={815} t="B = velocity" c={C.gold} s={T.calc} o={fin(f, AT(k, 10, "then on the velocity"))} />
      </Svg>
      <Layered parts={RA} layers={[{ t: "all", o: 1 }, { u: [0], o: fin(f, AT(k, 9, "seen from outside")) }]} x={1070} y={255} size={64} ay={0} o={fin(f, t9)} />
      {/* fix 2 (S8): line 2 starts 40 px below line 1's brace note */}
      <Layered parts={RB} layers={[{ t: "all", o: fin(f, AT(k, 9, "seen by the rider") - 6) },
        { u: [2], o: fin(f, AT(k, 9, "plus Omega cross B")) }]} x={1160} y={545} size={64} ay={0} o={fin(f, t9)} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s26e the rule again, on the velocity (the rider's part → piece ②)
/** the rider's view of the ball at t = 1.2 s with u, r, Ω × r and their sum (as s26b); `sumPulse` makes the sum glow */
const RiderBall: React.FC<{ c: Pt; s: number; f: number; sumO?: number; sumPulse?: number; o?: number; uO?: number; rO?: number }> = ({ c, s, f, sumO = 1, sumPulse = 0, o = 1, uO = 1, rO = 1 }) => {
  const rt = MGX.rule_twice;
  const P2 = discXY(c[0], c[1], s);
  const ball = P2(rt.r), VS = (190 * s) / 120;
  const uT = sv(ball, rt.u, VS), fT = sv(uT, rt.omega_x_r, VS);
  const j = Math.round(rt.t * 30);
  return (
    <g opacity={o}>
      <Disc cx={c[0]} cy={c[1]} s={s} ang={0} />
      <polyline points={MG.rotating.slice(0, j + 1).map((p) => P2(p).join(",")).join(" ")} fill="none" stroke={ROT} strokeWidth={5} opacity={0.5} />
      <Arrow p={c} q={ball} color={C.local} w={6} head={24} />
      <Lbl x={(c[0] + ball[0]) / 2 - 26} y={(c[1] + ball[1]) / 2 + 18} t="r" c={C.local} s={T.calc} a="end" o={rO} />
      <Arrow p={ball} q={uT} color={C.first} o={uO} />
      <Lbl x={(ball[0] + uT[0]) / 2 - 26} y={(ball[1] + uT[1]) / 2} t="u" c={C.first} s={T.calc} a="end" o={uO} />
      <Arrow p={uT} q={fT} color={C.second} o={sumO * uO} />
      <Lbl x={fT[0] + 18} y={fT[1] + 40} t="Ω × r" c={C.second} s={T.key} o={sumO * uO} />
      <Arrow p={ball} q={fT} color={C.key} w={10 + 4 * sumPulse} o={sumO * uO} />
      <Lbl x={fT[0] + 26} y={fT[1] - 30} t="u + Ω × r" c={C.key} s={T.key} o={sumO * uO} />
      <circle cx={ball[0]} cy={ball[1]} r={14} fill={C.key} stroke={C.bg} strokeWidth={3} />
    </g>
  );
};
const S26E: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26e_rule_again");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const rt = MGX.rule_twice;
  // fix 2 (review 2 S6): on S7-S8 the disc zooms ×2.2 about the ball (the ball moves to (320, 650)) so the step picture of
  // s26d is drawn at a readable size; it zooms back out after S8's words (the s26f disc follows)
  const zIn = easeIO(clamp((f - t6) / 24, 0, 1)), zOut = easeIO(clamp((f - (SE(k, 7) + 2)) / 18, 0, 1));
  const zz = zIn * (1 - zOut);
  const s0 = 108, c0: Pt = [510, 420], s = s0 * (1 + 1.2 * zz);
  const ball0: Pt = [c0[0] + rt.r[0] * s0, c0[1] - rt.r[1] * s0], ballZ: Pt = [320, 650];
  const ballS: Pt = lerp(ball0, ballZ, zz) as Pt;
  const c: Pt = [ballS[0] - rt.r[0] * s, ballS[1] + rt.r[1] * s];
  const P2 = discXY(c[0], c[1], s);
  const ball = P2(rt.r), VS = (190 * s) / 120;
  const sumTip = sv(sv(ball, rt.u, VS), rt.omega_x_r, VS);
  // S7: the ball steps along u (0.4 s); the floor's velocity under it changes by Ω × u per second of travel
  const tStep = Math.max(AT(k, 6, "so Omega cross r changes"), t6 + 24);
  const st = easeIO(clamp((f - tStep) / 40, 0, 1));
  const stepO = fin(f, t6 + 16, 10) * (1 - zOut);
  const dtS = 0.4 * st;
  const b2 = P2([rt.r[0] + rt.u[0] * dtS, rt.r[1] + rt.u[1] * dtS]);
  const fl2 = [rt.omega_x_r[0] + rt.omega_x_u[0] * dtS, rt.omega_x_r[1] + rt.omega_x_u[1] * dtS];
  const fOld = sv(ball, rt.omega_x_r, VS), copyT = sv(b2, rt.omega_x_r, VS), newT = sv(b2, fl2, VS);
  const RV = splitEq(EQ_RULE_V);           // [lhs, "= rider part + Ω × (u + Ω × r)"]
  const L1R = String.raw`= \left(\frac{d}{dt}(\mathbf u + \boldsymbol\Omega\times\mathbf r)\right)_{\text{rider}}`;
  const L1C = String.raw`+ \boldsymbol\Omega\times(\mathbf u + \boldsymbol\Omega\times\mathbf r)`;
  if ((RV[0] + L1R + L1C).replace(/\s/g, "") !== EQ_RULE_V.replace(/\s/g, "")) throw new Error("s26e parts ≠ EQ_RULE_V");
  const [L2L, L2R] = splitEq(EQ_RIDER_PART);
  const L2: Part[] = [{ t: "=" }, { t: String.raw`\frac{d\mathbf u}{dt}`, c: C.first }, { t: "+" }, { t: String.raw`\boldsymbol\Omega\times\mathbf u`, c: ROT }];
  if (plainOf(L2).replace(/\s/g, "") !== L2R.replace(/\s/g, "")) throw new Error("s26e parts ≠ EQ_RIDER_PART");
  const dimC = f >= t3 ? 0.35 : 1;
  const tOxu = AT(k, 6, "changes at Omega cross u");
  const Y1 = 310 - 200 * easeIO(clamp((f - t3) / 20, 0, 1));
  const topO = fout(f, t3 - 6, 12);
  return (
    <Scene>
      <Svg>
        <defs>
          <linearGradient id="s26egx" x1={0} x2={1920} y1={0} y2={0} gradientUnits="userSpaceOnUse"><stop offset={20 / 1920} stopColor="#000" /><stop offset={80 / 1920} stopColor="#fff" /><stop offset={930 / 1920} stopColor="#fff" /><stop offset={1010 / 1920} stopColor="#000" /></linearGradient>
          <linearGradient id="s26egy" x1={0} x2={0} y1={0} y2={1080} gradientUnits="userSpaceOnUse"><stop offset={20 / 1080} stopColor="#000" /><stop offset={70 / 1080} stopColor="#fff" /><stop offset={790 / 1080} stopColor="#fff" /><stop offset={866 / 1080} stopColor="#000" /></linearGradient>
          <mask id="s26emx" maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}><rect x={0} y={0} width={1920} height={1080} fill="url(#s26egx)" /></mask>
          <mask id="s26emy" maskUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}><rect x={0} y={0} width={1920} height={1080} fill="url(#s26egy)" /></mask>
        </defs>
        <g mask={zz > 0 ? "url(#s26emx)" : undefined}><g mask={zz > 0 ? "url(#s26emy)" : undefined}>
        <RiderBall c={c} s={s} f={f} sumPulse={pulse(f, t1 + 10, 36)} sumO={1 - zz} rO={1 - zz} />
        {/* S5: two earlier copies of u show that the rider sees u change */}
        <g opacity={fin(f, AT(k, 4, "d u by d t")) * fout(f, t5)}>
          {[[-0.4, 0.35], [-0.2, 0.6]].map(([dt, op], i) => { const j0 = Math.round((rt.t + dt) * 30); const p = P2(MG.rotating[j0]);
            const q = P2(MG.rotating[j0 + 1]); const uu = unit(p, q); return <Arrow key={i} p={p} q={[p[0] + uu[0] * 150, p[1] + uu[1] * 150]} color={C.first} w={6} head={22} o={op} halo={false} />; })}
        </g>
        {/* S7: the ball steps along u; the floor's velocity (orange) at the old and the new place; violet = its change, Ω × u per
            second (the s26d picture, drawn on the zoomed disc) */}
        <g opacity={stepO}>
          <Arrow p={ball} q={fOld} color={C.second} w={9} head={30} />
          <Lbl x={fOld[0] + 18} y={fOld[1] + 6} t="Ω × r" c={C.second} s={T.key} a="start" />
          {st > 0 ? <>
            <Dash p={ball} q={b2} c={C.first} w={5} d="12 9" />
            <Dash p={b2} q={copyT} c={C.second} w={5} d="12 9" o={0.7} />
            <Arrow p={b2} q={newT} color={C.second} w={9} head={30} />
            <Arrow p={copyT} q={newT} color={ROT} w={9} head={30} o={fin(f, tOxu)} />
            <Lbl x={(copyT[0] + newT[0]) / 2 + 20} y={(copyT[1] + newT[1]) / 2 + 52} t="Ω × u" c={ROT} s={T.key} a="middle" o={fin(f, tOxu)} />
            <circle cx={b2[0]} cy={b2[1]} r={14} fill="none" stroke={C.key} strokeWidth={4} />
          </> : null}
        </g>
        </g></g>
        <Keyword f={f} text="the rule, a second time" at={[1080, 120]} appear={AT(k, 0, "the rule a second time")} out={t1 - 4} targets={[]} />
        <Lbl x={1545} y={Y1 + 170} t="rider's part" c={C.first} s={T.floor} a="start" o={fin(f, AT(k, 2, "seen by the rider"))} />
        <Lbl x={1540} y={Y1 + 268} t="carried round" c={ROT} s={T.floor} a="start" o={fin(f, AT(k, 2, "plus Omega cross")) * dimC} />
        <Lbl x={1425} y={615} t="②" c={C.gold} s={T.key} a="start" o={fin(f, t7)} />
        <Lbl x={90} y={828} t="du/dt: how fast u changes, for the rider" c={C.first} s={T.floor} o={fin(f, AT(k, 4, "how fast the velocity")) * fout(f, t6 - 4)} />
        <Keyword f={f} text="Ω fixed" at={[1100, 730]} appear={AT(k, 5, "Omega doesn't change")} out={AT(k, 6, "so Omega cross r changes") - 4} targets={[]} c={ROT} />
        <Keyword f={f} text="the floor's speed changes" at={[1100, 730]} appear={AT(k, 6, "so Omega cross r changes")} targets={[]} c={C.second} />
      </Svg>
      <TeX s={EQ_RULE} x={1080} y={110} size={46} c={C.muted} o={fin(f, t1) * topO} />
      <TeX s={String.raw`\mathbf B = \mathbf u + \boldsymbol\Omega\times\mathbf r`} x={1080} y={205} size={56} c={C.key} o={fin(f, AT(k, 1, "u plus Omega cross r")) * topO} />
      <Svg><CurvedLink f={f} from={[sumTip[0] + 250, sumTip[1] - 40]} to={[1070, 210]} start={AT(k, 1, "u plus Omega cross r") + 6} end={t3 - 8} bend={40} /></Svg>
      {/* line 1: the rule on the velocity, one part per row (lhs =, the rider's part, the carried-round part) */}
      <TeX s={RV[0] + " ="} x={1070} y={Y1} size={50} ay={0} o={fin(f, t2)} />
      <TeX s={L1R.replace(/^= /, "")} x={1130} y={Y1 + 120} size={50} c={C.first} ay={0} o={fin(f, AT(k, 2, "seen by the rider"))} />
      <TeX s={L1C} x={1130} y={Y1 + 238} size={50} c={ROT} ay={0} o={fin(f, AT(k, 2, "plus Omega cross")) * dimC} />
      {/* line 2: the rider's part worked out */}
      <TeX s={L2L + " ="} x={1070} y={420} size={50} c={C.first} ay={0} o={fin(f, t4)} />
      <Layered parts={L2.slice(1)} layers={[{ t: [0], o: fin(f, AT(k, 4, "d u by d t")) }, { t: [1, 2], o: fin(f, tOxu) }]} x={1130} y={558} size={50} ay={0} o={fin(f, t4)} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s26f the carried-round part, part by part, and the sum
const S26F: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26f_collect");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const rt = MGX.rule_twice;
  // S6: the picture moves up and shrinks so the long sum line can run across the full width
  const sh = easeIO(clamp((f - t5 + 10) / 24, 0, 1));
  const c: Pt = [520 - 40 * sh, 450 - 150 * sh], s = 120 - 52 * sh;
  const P2 = discXY(c[0], c[1], s);
  const ball = P2(rt.r), VS = (190 * s) / 120;
  const uTip = sv(ball, rt.u, VS);
  // S3: ghosts of u swinging round with the floor; S4: the floor arrow Ω × r swinging round, its tip moving at Ω × (Ω × r)
  const g1 = clamp((f - t2 - 10) / 60, 0, 1), g3 = clamp((f - t3 - 10) / 60, 0, 1);
  const G3 = rt.floor_arrow_ghosts;
  const n3 = Math.round(g3 * (G3.length - 1));
  const fl0 = sv(ball, rt.omega_x_r, VS);
  const [SPL] = splitEq(EQ_SPLIT);
  const SPR: Part[] = [{ t: "=" }, { t: String.raw`\boldsymbol\Omega\times\mathbf u`, c: ROT }, { t: "+" },
    { t: String.raw`\boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`, c: C.local }];
  if ((SPL + plainOf(SPR)).replace(/\s/g, "") !== EQ_SPLIT.replace(/\s/g, "")) throw new Error("s26f parts ≠ EQ_SPLIT");
  const SEEN: Part[] = [{ t: String.raw`\text{change seen outside}` }, { t: "=" }, { t: String.raw`\frac{d\mathbf u}{dt}`, c: C.first, u: { w: String.raw`\text{rider sees}`, c: C.first } },
    { t: "+" }, { t: String.raw`\boldsymbol\Omega\times\mathbf u`, c: ROT, u: { w: String.raw`\text{\textcircled{2}}`, c: C.gold } }, { t: "+" },
    { t: String.raw`\boldsymbol\Omega\times\mathbf u`, c: ROT, u: { w: String.raw`\text{\textcircled{1}}`, c: C.gold } }, { t: "+" },
    { t: String.raw`\boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`, c: C.local, u: { w: String.raw`\text{\textcircled{3}}`, c: C.gold } }];
  if (plainOf(SEEN).replace(/\s/g, "") !== EQ_SEEN.replace(/\s/g, "")) throw new Error("s26f parts ≠ EQ_SEEN");
  const FIN: Part[] = [{ t: String.raw`\text{change seen outside}` }, { t: "=" }, { t: String.raw`\frac{d\mathbf u}{dt}`, c: C.first }, { t: "+" },
    { t: String.raw`2\boldsymbol\Omega\times\mathbf u`, c: ROT, u: { w: String.raw`\text{\textcircled{1}} + \text{\textcircled{2}}`, c: C.gold } }, { t: "+" },
    { t: String.raw`\boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`, c: C.local }];
  if (plainOf(FIN).replace(/\s/g, "") !== EQ_SEEN2.replace(/\s/g, "")) throw new Error("s26f parts ≠ EQ_SEEN2");
  const tSum = SS(k, 6), toFin = fin(f, tSum + 20, 14);
  const lit = (ph: string) => fin(f, AT(k, 5, ph), 8);
  return (
    <Scene>
      <Svg>
        <RiderBall c={c} s={s} f={f} />
        <g opacity={fin(f, t2) * fout(f, t3 + 10)}>
          {[10, 20, 30, 40, 50, 60].filter((d) => d <= 60 * g1).map((d) => { const v = rot2(rt.u, d * D2R); return <Arrow key={d} p={ball} q={sv(ball, v, VS)} color={C.first} w={5} head={20} o={0.35} halo={false} />; })}
          {g1 > 0 ? <Arrow p={uTip} q={sv(uTip, rt.omega_x_u, VS * 0.8)} color={ROT} w={7} head={24} o={fin(f, t2 + 70)} /> : null}
          <Lbl x={sv(uTip, rt.omega_x_u, VS * 0.8)[0] - 14} y={sv(uTip, rt.omega_x_u, VS * 0.8)[1] - 30} t="Ω × u" c={ROT} s={T.floor} a="end" o={fin(f, t2 + 70)} />
        </g>
        <g opacity={fin(f, t3) * fout(f, t5 - 4)}>
          {G3.slice(0, n3 + 1).map((v, i) => <Arrow key={i} p={ball} q={sv(ball, v, VS)} color={C.second} w={5} head={20} o={i === n3 ? 1 : 0.3} halo={false} />)}
          <polyline points={G3.slice(0, n3 + 1).map((v) => sv(ball, v, VS).join(",")).join(" ")} fill="none" stroke={C.gold} strokeWidth={5} />
          <Arrow p={fl0} q={sv(fl0, rt.omega_x_omega_x_r, VS * 1.6)} color={C.local} w={8} head={26} o={fin(f, t3 + 70)} />
          <Lbl x={sv(fl0, rt.omega_x_omega_x_r, VS * 1.6)[0] + 16} y={sv(fl0, rt.omega_x_omega_x_r, VS * 1.6)[1] - 36} t="Ω × (Ω × r)" c={C.local} s={T.floor} a="start" o={fin(f, t3 + 70)} />
          <Lbl x={c[0]} y={c[1] + s * MG.radius + 40} t="towards the centre" c={C.local} s={T.floor} a="middle" o={fin(f, t3 + 80)} />
        </g>
        <Keyword f={f} text="the last part of the rule" at={[1080, 120]} appear={AT(k, 0, "the last part")} out={t1 - 4} targets={[]} />
        <Lbl x={1465} y={300} t="①" c={C.gold} s={T.key} a="middle" o={fin(f, t2) * (f >= t5 ? 0.6 : 1)} />
        <Lbl x={1700} y={300} t="③" c={C.gold} s={T.key} a="middle" o={fin(f, t3) * (f >= t5 ? 0.6 : 1)} />
        <Keyword f={f} text="part by part" at={[1080, 420]} appear={AT(k, 1, "part by part")} out={t2} targets={[]} c={C.gold} />
        <Keyword f={f} text="① the arrow u, carried round" at={[1080, 420]} appear={t2} out={t3 - 4} targets={[]} c={ROT} s={T.floor} />
        <Keyword f={f} text="③ the floor's velocity, carried round" at={[1080, 420]} appear={t3} out={t4 - 4} targets={[]} c={C.local} s={T.floor} />
        <Keyword f={f} text="the leftover piece" at={[1300, 450]} appear={t4} out={t5 - 4} targets={[[1700, 325]]} c={C.local} />
      </Svg>
      <TeX s={String.raw`3\times(2 + 5) = 3\times2 + 3\times5`} x={1080} y={510} size={T.key} c={C.muted} o={fin(f, AT(k, 1, "ordinary multiplication")) * fout(f, t2)} />
      <TeX s={String.raw`\boldsymbol\Omega\times(\mathbf u + \boldsymbol\Omega\times\mathbf r)`} x={1080} y={210} size={T.calc} c={ROT} o={fin(f, 6) * fout(f, AT(k, 1, "each part on its own") - 4)} glow={pulse(f, 14, 30)} />
      <CalcStack f={f} x={1340} y={190} size={50} o={f >= t5 ? 0.6 : 1} rows={[
        { lhs: SPL, lc: ROT, rhs: { parts: SPR, layers: [{ t: "all", o: 1 }] }, at: AT(k, 1, "each part on its own"), h: 110 },
      ]} />
      {f < tSum + 34 ? <Layered parts={SEEN} layers={[{ t: [0, 1], o: 1 }, { t: [2], o: lit("d u by d t") }, { t: [3, 4], o: lit("plus Omega cross u,") },
        { t: [5, 6], o: lit("Omega cross u again") }, { t: [7, 8], o: lit("plus Omega cross, open bracket") }, { u: [2], o: lit("d u by d t") }, { u: [4], o: lit("plus Omega cross u,") },
        { u: [6], o: lit("Omega cross u again") }, { u: [8], o: lit("plus Omega cross, open bracket") }]} x={110} y={630} size={64} ay={0}
        o={fin(f, t5) * (1 - toFin)} /> : null}
      <Layered parts={FIN} layers={[{ t: "all", o: 1 }, { u: [4], o: fin(f, tSum + 34) }]} x={110} y={630} size={64} ay={0} o={toFin} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s27b naming the leftover: the vector triple product on the disc
const S27B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27b_centrifugal");
  const t = (j: number) => SS(k, j);
  const cf = MGX.centrifugal;
  const c: Pt = [470, 400], s = 105;
  const P2 = discXY(c[0], c[1], s);
  const ball = P2(cf.x);
  const outT = sv(ball, cf.acc, 170);
  // the side view: the disc edge-on
  const sv0: Pt = [885, 230];
  const sideO = fin(f, t(7));
  const phaseB = fin(f, t(9) - 4, 16);     // S10-S12: the numbers
  const VT: Part[] = [{ t: "=" }, { t: String.raw`\boldsymbol\Omega\,(\boldsymbol\Omega\cdot\mathbf r)`, x: C.neg }, { t: "-" }, { t: String.raw`\mathbf r\,(\boldsymbol\Omega\cdot\boldsymbol\Omega)` }];
  const [VTL] = splitEq(EQ_VTP_OM);
  if ((VTL + plainOf(VT)).replace(/\s/g, "") !== EQ_VTP_OM.replace(/\s/g, "")) throw new Error("s27b parts ≠ EQ_VTP_OM");
  const [PL, PR] = splitEq(EQ_VTP);
  const [NL, NR] = splitEq(EQ_CF625), NP = eqPieces(NR);
  const resY = 600 - (600 - 150) * easeIO(clamp((f - t(9) + 4) / 20, 0, 1));
  const rid: Pt = [ball[0] - 92, ball[1] + 10];      // a rider near the rim, beside the ball
  const ru = unit(c, rid);
  return (
    <Scene>
      <Svg>
        <Disc cx={c[0]} cy={c[1]} s={s} ang={0} />
        <Arrow p={c} q={ball} color={C.local} w={6} head={24} />
        <Lbl x={c[0] - 30} y={(c[1] + ball[1]) / 2} t="r" c={C.local} s={T.calc} a="end" />
        <Arrow p={ball} q={[ball[0] + 150, ball[1]]} color={C.first} o={fin(f, 4) * fout(f, AT(k, 1, "not on how it moves"))} />
        <Lbl x={ball[0] + 160} y={ball[1] - 40} t="u" c={C.first} s={T.calc} o={fin(f, 4) * fout(f, AT(k, 1, "not on how it moves"))} />
        <circle cx={ball[0]} cy={ball[1]} r={14} fill={C.key} stroke={C.bg} strokeWidth={3} />
        {/* S9: Ω² r points straight out from the centre */}
        <Arrow p={ball} q={outT} color={C.local} w={10} head={34} o={fin(f, AT(k, 8, "Omega squared times r"))} />
        <Lbl x={outT[0] + 26} y={outT[1] - 20} t="Ω² r" c={C.local} s={T.calc} a="start" o={fin(f, AT(k, 8, "Omega squared times r"))} />
        <Keyword f={f} text="outwards" at={[outT[0] + 26, outT[1] + 50]} appear={AT(k, 8, "pointing straight out")} out={t(9) - 4} targets={[]} s={T.floor} />
        {/* S11: the 2.5 m along r, linked to the number */}
        <Bracket p={c} q={ball} off={-46} c={C.gold} o={fin(f, AT(k, 10, "two and a half metres"))} />
        <Lbl x={c[0] + 60} y={(c[1] + ball[1]) / 2} t="2.5 m" c={C.gold} s={T.key} a="start" o={fin(f, AT(k, 10, "two and a half metres"))} />
        {/* S12: a rider near the rim, pulled outwards (away from the centre) */}
        <g opacity={fin(f, t(11))}>
          <Observer x={rid[0]} y={rid[1]} s={0.9} />
          <Arrow p={[rid[0], rid[1] - 30]} q={[rid[0] + ru[0] * 80, rid[1] - 30 + ru[1] * 80]} color={C.local} w={7} head={22} />
        </g>
        {/* S8: the side view: r flat, Ω up, a right angle */}
        <g opacity={sideO * (1 - phaseB)}>
          <rect x={sv0[0] - 100} y={sv0[1] - 6} width={200} height={12} rx={6} fill="#24304b" stroke="#c9d2e3" strokeWidth={3} />
          <Arrow p={sv0} q={[sv0[0], sv0[1] - 130]} color={ROT} w={8} head={28} />
          <Lbl x={sv0[0] + 18} y={sv0[1] - 120} t="Ω" c={ROT} s={T.key} a="start" />
          <Arrow p={sv0} q={[sv0[0] - 100, sv0[1]]} color={C.local} w={7} head={24} />
          <Lbl x={sv0[0] - 100} y={sv0[1] - 40} t="r" c={C.local} s={T.key} a="start" />
          <RightTick at={sv0} u1={[-1, 0]} u2={[0, -1]} c={C.gold} />
          <Lbl x={sv0[0]} y={sv0[1] + 52} t="side view" c={C.muted} s={T.floor} a="middle" />
        </g>
        {/* maths zone keywords */}
        <Keyword f={f} text="only where, not how it moves" at={[1080, 240]} appear={t(1)} out={t(2) - 4} targets={[]} s={T.floor} />
        <Keyword f={f} text="vector triple product" at={[1080, 240]} appear={AT(k, 2, "vector triple product")} out={t(9) - 4} targets={[]} />
        {/* fix 2 (review 2 M1): no "·" between two maths symbols (it read as the dot product Ω · s) */}
        <Lbl x={1080} y={690} t="p = q = Ω,   s = r" c={C.gold} s={T.key} o={fin(f, t(4)) * fout(f, t(6) - 4)} />
        <Lbl x={1080} y={690} t="Ω · r = 0" c={C.gold} s={T.calc} o={fin(f, AT(k, 7, "Omega dot r is zero")) * fout(f, t(8) + 20)} />
        <Lbl x={1080} y={280} t="Ω = 0.5 rad/s" c={ROT} s={T.key} o={fin(f, t(9))} />
        <Lbl x={1440} y={280} t="one turn ≈ 12.5 s" c={C.key} s={T.key} o={fin(f, AT(k, 9, "twelve and a half"))} />
        <Keyword f={f} text="the rider's outward pull" at={[1080, 720]} appear={t(11)} targets={[]} />
      </Svg>
      <TeX s={String.raw`-\boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`} x={1080} y={130} size={T.eq} c={C.local} o={fin(f, 6) * fout(f, t(9) - 4)} />
      <CalcStack f={f} x={1340} y={300} size={50} maxLines={2} o={1 - phaseB} rows={[
        { lhs: PL, rhs: PR, at: AT(k, 3, "It says that"), h: 108 },
        { lhs: VTL, rhs: { parts: VT, layers: [{ t: "all", o: 1 }, { x: [1], o: fin(f, AT(k, 7, "Omega dot r is zero") + 10) }] }, at: t(5), h: 110 },
      ]} />
      <TeX s={String.raw`\boldsymbol\Omega\cdot\boldsymbol\Omega = \Omega^2`} x={1080} y={690} size={60} o={fin(f, t(6)) * fout(f, t(7) - 4)} />
      <TeX s={EQ_CF} x={1080} y={resY} size={T.eq} o={fin(f, AT(k, 8, "Omega squared times r"))} />
      <Svg><line x1={1080} y1={resY + 58} x2={1600} y2={resY + 58} stroke={C.gold} strokeWidth={6} opacity={fin(f, AT(k, 8, "Omega squared times r") + 10)} /></Svg>
      <CalcStack f={f} x={1290} y={380} size={60} rows={[
        { lhs: NL, rhs: NP[0], at: AT(k, 10, "point two five times"), h: 96 },
        { rhs: NP[1], at: AT(k, 10, "point two five times") + 20, cont: true, h: 96 },
        { rhs: NP[2], at: AT(k, 10, "point six two five"), cont: true, c: C.key, h: 96, ul: AT(k, 10, "point six two five") + 12 },
      ]} />
      <Svg><CurvedLink f={f} from={[c[0] + 50, ball[1] - 14]} to={[1590, 362]} start={AT(k, 10, "two and a half metres") + 8} end={t(11)} ctl={[1100, 250]} /></Svg>
    </Scene>
  );
};

// ---------------------------------------------------------------- s27c on Earth: r split along and across the axis (3-D)
// fix 2 (review 2 M2): "not at right angles" from S1's first frame until the split arrives at S2; r = r_along + r⊥ from S2's first
// frame, lit leg by leg on "one along" / "straight out". (S3): on S7 the camera zooms to the pin (as s27e) and up, north and the
// centrifugal arrow are drawn ≥ 120 px with the 45° arc between up and the centrifugal arrow.
const EQ_RSPLIT = String.raw`\mathbf r = \mathbf r_{\text{along}} + \mathbf r_\perp`;
const S27C: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27c_centrifugal_earth");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const pin = pinAt(45);
  const zz = easeIO(clamp((f - t6 + 4) / 30, 0, 1));              // S7: zoom to the pin
  const st = heCam(38 - 10 * zz, 12, 5.4 - 3.2 * zz, [610 - 110 * zz, 560 - 40 * zz], lerp3([0, 0.05, 0], add3(pin, [0, -0.08, 0]), zz));
  const zc: V3 = [0, Math.sin(45 * D2R), 0];
  const nrth: V3 = add3(mul3(HE_M, -Math.sin(45 * D2R)), [0, Math.cos(45 * D2R), 0]);   // local north at the pin (in the face)
  const out = add3(pin, HE_M, 0.34 - 0.12 * zz);  // the centrifugal arrow at the pin, display scale (away from the axis)
  const upT = add3(pin, norm3(pin), 0.3 - 0.08 * zz), nT = add3(pin, nrth, 0.22);
  const early = fout(f, t6 - 6, 12);           // S7: the first three lines make room for the keyword
  const wide = 1 - zz;                         // labels of the wide view leave during the zoom
  const ring = Array.from({ length: 121 }, (_, i) => ll(45, LON0 + 3 * i));
  const legs = fin(f, t1 + 20, 14);
  const RS: Part[] = [{ t: String.raw`\mathbf r` }, { t: "=" }, { t: String.raw`\mathbf r_{\text{along}}`, c: C.local }, { t: "+" }, { t: String.raw`\mathbf r_\perp`, c: C.gold }];
  if (plainOf(RS).replace(/\s/g, "") !== EQ_RSPLIT.replace(/\s/g, "")) throw new Error("s27c parts ≠ EQ_RSPLIT");
  const oAlong = fin(f, AT(k, 1, "one along")), oPerp = fin(f, AT(k, 1, "straight out"));
  return (
    <Scene>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, WebkitMaskImage: "linear-gradient(to right, transparent 18px, black 40px, black 930px, transparent 1010px)",
        maskImage: "linear-gradient(to right, transparent 18px, black 40px, black 930px, transparent 1010px)" }}>
      <HalfEarthView st={st} slide={1} fadeBelow={860}
        three={<>
          <Arrow3D from={[0, 0, 0]} to={pin} color={C.first} onTop o={1 - 0.6 * zz} />
          <Arrow3D from={[0, 1.0, 0]} to={[0, 1.33, 0]} color={ROT} px={12} head={40} o={wide} />
          <Arrow3D from={pin} to={out} color={C.local} px={8 + 4 * zz} head={28 + 12 * zz} grow={fin(f, AT(k, 5, "pointing away from the axis"), 16)} onTop />
          <Arrow3D from={pin} to={upT} color={C.key} px={6 + 4 * zz} head={24 + 12 * zz} o={(0.7 + 0.3 * zz) * fin(f, t6)} onTop />
          <Arrow3D from={pin} to={nT} color={C.first} px={10} head={36} o={zz} onTop />
          <Ball3D at={pin} px={18} color={C.key} />
        </>}>
        {(pr) => {
          const front = ring.filter((p) => dot3(p, HE_E) >= -0.02), back = ring.filter((p) => dot3(p, HE_E) < -0.02);
          return <>
            <FaceLines pr={pr} o={wide} />
            <Poly3 pr={pr} pts={back} c={C.gold} w={4} dash="8 10" o={0.35 * fin(f, t4) * wide} />
            <Poly3 pr={pr} pts={front} c={C.gold} w={4} o={0.6 * fin(f, t4)} />
            {/* S1: the 45° between Ω (the axis) and r; C1: the label sits left of r, clear of the "along" leg */}
            <Poly3 pr={pr} pts={Array.from({ length: 21 }, (_, i) => add3(mul3(HE_M, 0.3 * Math.sin((i / 20) * 45 * D2R)), [0, 0.3 * Math.cos((i / 20) * 45 * D2R), 0]))} c={C.gold} w={5} o={fin(f, 8) * fout(f, t2)} />
            <L3 pr={pr} at={add3(mul3(HE_M, 0.44 * Math.sin(30 * D2R)), [0, 0.44 * Math.cos(30 * D2R), 0])} t="45°" c={C.gold} s={T.key} a="start" dx={18} o={fin(f, 8) * fout(f, t1 + 14)} />
            {/* S2: the two legs of r */}
            <Seg3 pr={pr} a={[0, 0, 0]} b={zc} c={C.local} w={8} dash="16 10" o={legs * wide} />
            <Seg3 pr={pr} a={zc} b={pin} c={C.gold} w={8} o={legs * (1 - 0.5 * zz)} />
            <circle cx={pr.p(zc)[0]} cy={pr.p(zc)[1]} r={9} fill={C.gold} opacity={legs * wide} />
            <L3 pr={pr} at={mul3(zc, 0.32)} t="along" c={C.local} s={T.key} a="start" dx={28} o={oAlong * wide} />
            <L3 pr={pr} at={add3(zc, HE_M, Math.cos(45 * D2R) / 2)} t="r⊥" c={C.gold} s={T.calc} dy={-40} o={fin(f, AT(k, 1, "which we call r perp")) * wide} />
            <L3 pr={pr} at={mul3(pin, 0.5)} t="r" c={C.first} s={T.calc} a="end" dx={-26} dy={26} o={wide} />
            <L3 pr={pr} at={[0, 1.33, 0]} t="Ω" c={ROT} s={T.calc} a="start" dx={24} o={wide} />
            <TipL3 pr={pr} from={pin} to={out} t="centrifugal" c={C.local} s={zz > 0.5 ? T.key : T.floor} gap={18} o={fin(f, AT(k, 5, "pointing away from the axis") + 10)} />
            {/* S7: local up and north, and the 45° between up and the centrifugal arrow */}
            <TipL3 pr={pr} from={pin} to={upT} t="up" c={C.key} s={zz > 0.5 ? T.key : T.floor} o={0.8 * fin(f, t6)} />
            <TipL3 pr={pr} from={pin} to={nT} t="north" c={C.first} s={T.key} o={zz} />
            <Arc3 pr={pr} c0={pin} e1={norm3(pin)} e2={norm3(sub3(HE_M, mul3(norm3(pin), dot3(HE_M, norm3(pin)))))} r={0.2 - 0.06 * zz} a0={0} a1={45} col={C.gold} w={5 + 2 * zz} draw={fin(f, AT(k, 6, "not straight up"), 14)} />
            {(() => { const q = pr.p(add3(pin, norm3(add3(norm3(pin), HE_M)), 0.36)); return <Lbl x={q[0] + 4} y={q[1] + 4} t="45°" c={C.gold} s={T.key} a="end" o={zz * fin(f, AT(k, 6, "at forty five degrees"))} />; })()}
          </>;
        }}
      </HalfEarthView>
      </div>
      <Svg>
        <Keyword f={f} text="not at right angles" at={[1100, 130]} appear={6} out={t1 - 4} targets={[]} />
        <Lbl x={1080} y={505} t="a: Earth's radius" c={C.muted} s={T.floor} o={fin(f, AT(k, 4, "Earth's radius times"))} />
        <Keyword f={f} text="leans towards the equator" at={[1080, 200]} appear={AT(k, 6, "leans towards the equator")} targets={[]} />
      </Svg>
      <Layered parts={RS} layers={[{ t: [0, 1], o: 1 }, { t: [2], o: oAlong }, { t: [3, 4], o: oPerp }]} x={1080} y={130} size={60} o={fin(f, t1) * early} />
      <TeX s={String.raw`\boldsymbol\Omega\,(\boldsymbol\Omega\cdot\mathbf r) = \Omega^2\,\mathbf r_{\text{along}}`} x={1080} y={230} size={60} o={fin(f, t2) * early} />
      <TeX s={EQ_CF_ALONG} x={1080} y={330} size={60} o={fin(f, t3) * early} />
      <TeX s={String.raw`|\mathbf r_\perp| = a\cos\varphi`} x={1080} y={430} size={T.calc} c={C.gold} o={fin(f, AT(k, 4, "cosine phi"))} />
      <TeX s={EQ_CFE} x={1080} y={630} size={T.eq} o={fin(f, t5)} />
      <Svg><line x1={1080} y1={690} x2={1650} y2={690} stroke={C.gold} strokeWidth={6} opacity={fin(f, t5 + 12)} /></Svg>
      <TeX s={EQ_CF_MAG} x={1080} y={770} size={T.calc} o={fin(f, AT(k, 5, "times cosine phi"))} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s27d how big? (the whole globe, three latitudes)
const S27D: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27d_centrifugal_size");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const LONV = 60;   // the arrows stand on the right limb (lon 60°E), seen side-on from the camera at lon −20°
  const cam = globePath([{ f: 0, lat: 20, lon: -20, dist: 5.6, pp: [520, 440] }, { f: t2, lat: 12, lon: -14, dist: 5.6, pp: [520, 440] },
    { f: t3, lat: 26, lon: -14, dist: 5.6, pp: [520, 445] }, { f: t4, lat: 34, lon: -18, dist: 5.6, pp: [520, 450] }], f);
  const ce = EAX.centrifugal;
  const away = (lo: number): V3 => [Math.sin(lo * D2R), 0, Math.cos(lo * D2R)];
  const Lof = (m: number) => 0.4 * (m / ce.mag[0]);
  const lit = [fin(f, t2), fin(f, t3), fin(f, t4)];
  const bars = fin(f, t5);
  return (
    <Scene>
      <GlobeView cam={cam} ppDef={[520, 440]}
        three={<>
          <Axis3D o={1} r={0.012} L={1.2} />
          <Arrow3D from={ll(0, LONV)} to={add3(ll(0, LONV), away(LONV), Lof(ce.mag[0]))} color={C.local} px={10} head={34} o={0.5 + 0.5 * lit[0]} />
          <Arrow3D from={ll(45, LONV)} to={add3(ll(45, LONV), away(LONV), Lof(ce.mag[1]))} color={C.local} px={10} head={34} o={0.5 + 0.5 * lit[1]} />
          <Ball3D at={ll(90, 0)} px={16} color={C.gold} />
        </>}>
        {(G) => <>
          <LatCircle G={G} lat={0} c={C.gold} w={3} o={0.5} />
          <LatCircle G={G} lat={45} c={C.gold} w={3} o={0.5} />
          <Lbl x={(G.pw(add3(ll(0, LONV), away(LONV), Lof(ce.mag[0])))[0] + G.pw(ll(0, LONV))[0]) / 2} y={G.pw(ll(0, LONV))[1] - 40} t="0.034" c={C.local} s={T.floor} a="middle" o={lit[0]} />
          <Lbl x={(G.pw(add3(ll(45, LONV), away(LONV), Lof(ce.mag[1])))[0] + G.pw(ll(45, LONV))[0]) / 2} y={G.pw(ll(45, LONV))[1] - 40} t="0.024" c={C.local} s={T.floor} a="middle" o={lit[1]} />
          <Lbl x={G.pw(ll(90, 0))[0] + 30} y={G.pw(ll(90, 0))[1] - 40} t="0" c={C.gold} s={T.key} a="start" o={lit[2]} />
        </>}
      </GlobeView>
      <Svg>
        <Keyword f={f} text="how big?" at={[1080, 120]} appear={4} out={t1 - 4} targets={[]} />
        <Lbl x={1080} y={628} t="poles: 0 (on the axis)" c={C.gold} s={T.key} o={fin(f, t4)} />
        {/* S6-S7: g and the centrifugal acceleration on one zero line (the g bar is cut; its value is written) */}
        <g opacity={bars}>
          <line x1={1080} y1={830} x2={1830} y2={830} stroke={C.muted} strokeWidth={3} />
          <rect x={1100} y={680} width={90} height={150} fill={BROWN} />
          <polyline points="1090,730 1200,714 1200,728 1090,744" fill={C.bg} stroke="none" />
          <Lbl x={1210} y={700} t="g ≈ 9.81 m/s²" c={BROWN} s={T.key} a="start" />
          <rect x={1700} y={826} width={90} height={4} fill={C.local} opacity={fin(f, t6)} />
          <Lbl x={1210} y={780} t="centrifugal ≈ 0.034" c={C.local} s={T.key} a="start" o={fin(f, t6)} />
          <Lbl x={1745} y={700} t="≈ ⅓ %" c={C.gold} s={T.key} a="middle" o={fin(f, AT(k, 6, "a third of one percent"))} />
          <line x1={1745} y1={735} x2={1745} y2={810} stroke={C.gold} strokeWidth={4} opacity={fin(f, AT(k, 6, "a third of one percent"))} />
        </g>
      </Svg>
      {[[EQ_OM2, 120, fin(f, t1)], [EQ_CF034, 300, fin(f, AT(k, 2, "six million"))], [EQ_CF024, 470, fin(f, AT(k, 3, "four thousand five hundred"))]].map(([e, y, o], i) => {
        const [a, b] = (e as string).split(String.raw` \approx `);
        return <React.Fragment key={i}><TeX s={a} x={1080} y={y as number} size={54} o={o as number} />
          <TeX s={String.raw`\approx ` + b} x={1180} y={(y as number) + 72} size={54} c={i > 0 ? C.key : C.ink} o={o as number} /></React.Fragment>;
      })}
      <Svg><line x1={1180} y1={410} x2={1520} y2={410} stroke={C.gold} strokeWidth={5} opacity={fin(f, AT(k, 2, "zero point zero three four"))} /></Svg>
    </Scene>
  );
};

// ---------------------------------------------------------------- s27e effective gravity (half-Earth, zoom to the pin)
const S27E: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27e_effective_gravity");
  const t = (j: number) => SS(k, j);
  const eg = EAX.effective_gravity;
  const zin = easeIO(clamp((f - t(5) + 10) / 40, 0, 1));
  const P45 = pinAt(45);
  const st = heCam(38 - 10 * zin, 12, 5.4 - 2.4 * zin, [610 - 120 * zin, 560 - 60 * zin], lerp3([0, 0.05, 0], add3(P45, [0, -0.2, 0]), zin));
  const pin = P45;
  const LG = 0.75;                                       // g* drawn 0.75 Earth radii long (display)
  const gs = add3(pin, norm3(mul3(pin, -1)), LG);
  // the centrifugal arrow: display scale until the sum, then ×100 against g* (so the tilt can be seen; true tilt ≈ 0.1°)
  const cTrue = (EAX.centrifugal.mag[1] / eg.g_star) * LG * 100;
  const cLen = 0.42 + (cTrue - 0.42) * zin;
  const cFrom = f >= t(5) ? gs : pin;
  const cTo = add3(cFrom, HE_M, cLen);
  const gTip = add3(gs, HE_M, cTrue);
  const icons = fin(f, t(7));
  const DUA: Part[] = [{ t: String.raw`\frac{d\mathbf u}{dt}`, c: C.first }, { t: "=" }, { t: String.raw`\text{other pushes}`, u: { w: String.raw`\text{pressure push, \dots}`, c: C.key } }];
  const DUB: Part[] = [{ t: "+" }, { t: String.raw`\mathbf g`, c: BROWN, u: { w: String.raw`\mathbf g^{*} - \boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`, c: C.gold } }, { t: String.raw`- 2\boldsymbol\Omega\times\mathbf u`, c: ROT }];
  if ((plainOf(DUA) + plainOf(DUB)).replace(/\s/g, "") !== EQ_DUDT_G.replace(/\s/g, "")) throw new Error("s27e parts ≠ EQ_DUDT_G");
  const GE: Part[] = [{ t: String.raw`\mathbf g`, c: BROWN }, { t: "=" }, { t: String.raw`\mathbf g^{*}`, c: BROWN }, { t: String.raw`- \boldsymbol\Omega\times(\boldsymbol\Omega\times\mathbf r)`, c: C.local }];
  if (plainOf(GE).replace(/\s/g, "") !== EQ_GEFF.replace(/\s/g, "")) throw new Error("s27e parts ≠ EQ_GEFF");
  // fix 2 (review 2 S5): three code-drawn icons, 110-130 px, each with its word: a plumb bob on a string, a bathroom scale with a
  // dial, a dropped ball with drop lines; a brown g arrow beside each
  const icT = [AT(k, 7, "a plumb line"), AT(k, 7, "a bathroom scale"), AT(k, 7, "a dropped ball")];
  const icLab = fout(f, AT(k, 7, "the g in every weather equation") - 4);
  const Icon = ({ x, kind }: { x: number; kind: number }) => (
    <g opacity={fin(f, icT[kind] - 4)}>
      {kind === 0 ? <>
        <line x1={x - 34} y1={222} x2={x + 34} y2={222} stroke={C.muted} strokeWidth={6} strokeLinecap="round" />
        <line x1={x} y1={222} x2={x} y2={298} stroke={C.ink} strokeWidth={4} />
        <path d={`M ${x - 20} 298 L ${x + 20} 298 L ${x} 346 Z`} fill={C.local} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
      </> : null}
      {kind === 1 ? <>
        <rect x={x - 62} y={262} width={124} height={84} rx={16} fill={C.local} stroke={C.ink} strokeWidth={3} />
        <circle cx={x} cy={298} r={26} fill={C.bg} stroke={C.ink} strokeWidth={3} />
        <line x1={x} y1={298} x2={x + 14} y2={280} stroke={C.second} strokeWidth={4} strokeLinecap="round" />
        {[-40, -20, 0, 20, 40].map((d) => <line key={d} x1={x + 22 * Math.sin(d * D2R)} y1={298 - 22 * Math.cos(d * D2R)} x2={x + 26 * Math.sin(d * D2R)} y2={298 - 26 * Math.cos(d * D2R)} stroke={C.ink} strokeWidth={2} />)}
      </> : null}
      {kind === 2 ? <>
        {[0, 1, 2].map((j) => <circle key={j} cx={x} cy={236 + 20 * j * (j + 1) / 2} r={17} fill={C.second} opacity={0.25 + 0.25 * j} />)}
        <circle cx={x} cy={326} r={20} fill={C.second} stroke={C.bg} strokeWidth={3} />
        {[-12, 12].map((d) => <line key={d} x1={x + d} y1={226} x2={x + d} y2={292} stroke={C.muted} strokeWidth={3} strokeDasharray="6 6" />)}
      </> : null}
      <Arrow p={[x + 86, 236]} q={[x + 86, 344]} color={BROWN} w={8} head={26} halo={false} />
      <Lbl x={x + 20} y={388} t={["plumb line", "scale", "dropped ball"][kind]} c={C.key} s={T.floor} a="middle" o={icLab} />
    </g>
  );
  return (
    <Scene>
      {/* the zoomed half-Earth fades out before the maths zone */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, WebkitMaskImage: "linear-gradient(to right, black 0px, black 930px, transparent 1010px)",
        maskImage: "linear-gradient(to right, black 0px, black 930px, transparent 1010px)" }}>
      <HalfEarthView st={st} slide={1} fadeBelow={860}
        three={<>
          <Arrow3D from={[0, 0, 0]} to={pin} color={C.first} px={6} head={24} o={1 - zin} onTop />
          <Arrow3D from={[0, 1.0, 0]} to={[0, 1.33, 0]} color={ROT} px={12} head={40} o={1 - zin} />
          <Arrow3D from={pin} to={gs} color={BROWN} grow={fin(f, AT(k, 2, "pulls it almost straight"), 18)} onTop />
          <Arrow3D from={cFrom} to={cTo} color={C.local} px={8} head={26} onTop />
          <Arrow3D from={pin} to={gTip} color={BROWN} px={12} head={40} o={fin(f, AT(k, 5, "effective gravity"))} onTop />
          <Ball3D at={pin} px={18} color={C.key} />
        </>}>
        {(pr) => <>
          <FaceLines pr={pr} o={1 - zin} />
          <L3 pr={pr} at={gs} t="gravitational attraction" c={BROWN} s={T.floor} a="end" dx={-20} dy={56} o={fin(f, AT(k, 2, "gravitational attraction")) * fout(f, t(5))} />
          <TipL3 pr={pr} from={pin} to={gs} t="g*" c={BROWN} s={T.calc} side={-50} o={fin(f, t(3))} />
          <TipL3 pr={pr} from={cFrom} to={cTo} t="centrifugal" c={C.local} s={T.floor} gap={18} o={1} />
          <TipL3 pr={pr} from={pin} to={gTip} t="g" c={BROWN} s={T.calc} side={50} o={fin(f, AT(k, 5, "effective gravity"))} />
          <L3 pr={pr} at={gTip} t="effective gravity" c={BROWN} s={T.floor} a="middle" dy={140} o={fin(f, AT(k, 5, "effective gravity"))} />
        </>}
      </HalfEarthView>
      </div>
      <Svg>
        <Keyword f={f} text="why only g?" at={[1100, 130]} appear={4} out={t(6) - 4} targets={[]} />
        <Keyword f={f} text="never alone" at={[1100, 220]} appear={t(1)} out={t(6) - 4} targets={[]} />
        <Keyword f={f} text="both depend only on where" at={[1100, 310]} appear={t(4)} out={t(6) - 4} targets={[]} s={T.floor} />
        <g opacity={icons}>
          <Icon x={1130} kind={0} /><Icon x={1390} kind={1} /><Icon x={1650} kind={2} />
        </g>
        <Lbl x={1080} y={400} t="the g of weather equations" c={C.key} s={T.key} o={fin(f, AT(k, 7, "the g in every weather equation"))} />
      </Svg>
      <Layered parts={GE} layers={[{ t: "all", o: 1 }]} x={1080} y={160} size={72} o={fin(f, t(6))} />
      <Layered parts={DUA} layers={[{ t: "all", o: 1 }, { u: [2], o: fin(f, AT(k, 8, "like the pressure push")) }]} x={1072} y={450} size={64} ay={0} o={fin(f, t(8))} />
      <Layered parts={DUB} layers={[{ t: "all", o: fin(f, AT(k, 8, "plus g") - 4) }, { u: [1], o: fin(f, t(9)) }]} x={1200} y={640} size={64} ay={0} o={fin(f, t(8))} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s27f why g has no sideways part (two meridian sections, 2-D)
const S27F: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27f_level_sea");
  const t = (j: number) => SS(k, j);
  const tr = EAX.three_traces;
  const X = 100;                                          // arrows ×100 against g* (true sideways part ≈ 0.17 % of g)
  const ratio = (EAX.centrifugal.mag[1] / EAX.effective_gravity.g_star) * X;
  const L: Pt = [290, 460], RR = 200, E: Pt = [775, 460], bE = RR * tr.drawn_ratio_x50;
  const ph = 45 * D2R;
  const pinL: Pt = [L[0] + RR * Math.cos(ph), L[1] - RR * Math.sin(ph)];
  const gsL: Pt = [L[0], L[1]];                           // g* to the centre (the full radius)
  const cL: Pt = [gsL[0] + RR * ratio, gsL[1]];           // + centrifugal (×100), away from the axis
  const eqDir: Pt = [Math.sin(ph), Math.cos(ph)];          // along the surface, towards the equator (screen, y down)
  const gv: Pt = [cL[0] - pinL[0], cL[1] - pinL[1]];
  const along = gv[0] * eqDir[0] + gv[1] * eqDir[1];        // > 0: g leans towards the equator
  const sideTip: Pt = [pinL[0] + eqDir[0] * along, pinL[1] + eqDir[1] * along];
  // right panel: the ellipse (flattening ×50), the point at 45° from the centre, and the ellipse's normal there (g, no sideways part)
  const rho = 1 / Math.hypot(Math.cos(ph) / RR, Math.sin(ph) / bE);
  const pE: Pt = [E[0] + rho * Math.cos(ph), E[1] - rho * Math.sin(ph)];
  const nx = (pE[0] - E[0]) / (RR * RR), ny = (E[1] - pE[1]) / (bE * bE), nl = Math.hypot(nx, ny);
  const gE: Pt = [pE[0] - (nx / nl) * RR * 0.95, pE[1] + (ny / nl) * RR * 0.95];
  const tE: Pt = [-ny / nl, -nx / nl];                    // the surface direction at the point (screen)
  const water = clamp((f - t(5) - 20) / 180, 0, 1);
  const wPath = (side: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 72; i++) { const a = (i / 72) * 2 * Math.PI; const lat = Math.asin(Math.sin(a)); const th = 6 + water * 26 * (Math.cos(lat) ** 2 - 0.55);
      pts.push(`${L[0] + (RR + side * Math.max(2, th)) * Math.cos(a)},${L[1] - (RR + side * Math.max(2, th)) * Math.sin(a)}`); }
    return pts.join(" ");
  };
  const lit2 = fin(f, t(6));
  // fix 2 (review 2 S4): a ×3 magnifier of the pin (same ×100 picture, magnified) in the right half while the right panel is not
  // yet needed (S3-S6): the sideways part is ≈ 104 px there, its label sits under the magnifier, and the link starts at the arrow
  const mag = fin(f, AT(k, 2, "a part along the ground"), 14) * fout(f, t(6) - 8, 12);
  const MZ: Pt = [770, 330], MR = 190, MS = 3, MP: Pt = [745, 255];
  const Q = (q: Pt): Pt => [MP[0] + (q[0] - pinL[0]) * MS, MP[1] + (q[1] - pinL[1]) * MS];
  const sideMid: Pt = [(MP[0] + Q(sideTip)[0]) / 2, (MP[1] + Q(sideTip)[1]) / 2];
  return (
    <Scene>
      <Svg>
        {/* LEFT: round Earth */}
        <g opacity={1 - 0.45 * lit2}>
          <polygon points={wPath(1)} fill="#3b7fc4" opacity={0.7 * fin(f, t(5) + 10)} />
          <circle cx={L[0]} cy={L[1]} r={RR} fill="#2a4a73" stroke={C.ink} strokeWidth={3} />
          <line x1={L[0]} y1={L[1] - RR - 40} x2={L[0]} y2={L[1] + RR + 30} stroke={C.gold} strokeWidth={4} strokeDasharray="12 8" />
          <Arrow p={[L[0], L[1] - RR - 40]} q={[L[0], L[1] - RR - 120]} color={ROT} w={8} head={26} />
          <Lbl x={L[0] + 18} y={L[1] - RR - 110} t="Ω" c={ROT} s={T.key} a="start" />
          <Arrow p={pinL} q={gsL} color={BROWN} w={8} head={28} o={fin(f, AT(k, 1, "g star would point"))} />
          <Arrow p={gsL} q={cL} color={C.local} w={6} head={18} o={fin(f, AT(k, 1, "points away from the axis"))} />
          <Arrow p={pinL} q={cL} color={BROWN} w={6} head={24} o={fin(f, t(2))} dash="10 6" />
          <Lbl x={(pinL[0] + gsL[0]) / 2 - 20} y={(pinL[1] + gsL[1]) / 2 - 30} t="g*" c={BROWN} s={T.key} a="end" o={fin(f, AT(k, 1, "g star would point"))} />
          <Lbl x={(pinL[0] + cL[0]) / 2 + 22} y={(pinL[1] + cL[1]) / 2 + 26} t="g" c={BROWN} s={T.key} a="start" o={fin(f, t(2))} />
          <Lbl x={L[0]} y={L[1] + 62} t="centrifugal" c={C.local} s={T.floor} a="middle" o={fin(f, AT(k, 1, "points away from the axis"))} />
          <Arrow p={pinL} q={sideTip} color={C.neg} w={8} head={20} o={fin(f, AT(k, 2, "a part along the ground"))} />
          <circle cx={pinL[0]} cy={pinL[1]} r={26} fill="none" stroke={C.gold} strokeWidth={4} opacity={mag} />
          <circle cx={pinL[0]} cy={pinL[1]} r={10} fill={C.key} />
          <Lbl x={L[0]} y={790} t="round Earth" c={C.key} s={T.key} a="middle" />
        </g>
        {/* the magnifier (×3 about the pin) */}
        {mag > 0 ? <g opacity={mag}>
          <defs><clipPath id="s27fmag"><circle cx={MZ[0]} cy={MZ[1]} r={MR} /></clipPath></defs>
          <line x1={pinL[0] + 26} y1={pinL[1]} x2={MZ[0] - MR} y2={MZ[1] - 20} stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" />
          <circle cx={MZ[0]} cy={MZ[1]} r={MR} fill={C.bg} />
          <g clipPath="url(#s27fmag)">
            <circle cx={Q(L)[0]} cy={Q(L)[1]} r={RR * MS} fill="#2a4a73" stroke={C.ink} strokeWidth={4} />
            <line x1={MP[0]} y1={MP[1]} x2={Q(gsL)[0]} y2={Q(gsL)[1]} stroke={BROWN} strokeWidth={9} strokeLinecap="round" />
            <line x1={MP[0]} y1={MP[1]} x2={Q(cL)[0]} y2={Q(cL)[1]} stroke={BROWN} strokeWidth={7} strokeDasharray="14 9" />
          </g>
          <Lbl x={MP[0] - 108} y={MP[1] + 80} t="g*" c={BROWN} s={T.key} a="end" />
          <Lbl x={MP[0] - 90} y={MP[1] + 175} t="g" c={BROWN} s={T.key} a="start" />
          <Arrow p={MP} q={Q(sideTip)} color={C.neg} w={10} head={32} />
          <circle cx={MP[0]} cy={MP[1]} r={14} fill={C.key} />
          <circle cx={MZ[0]} cy={MZ[1]} r={MR} fill="none" stroke={C.gold} strokeWidth={4} />
          <Lbl x={MZ[0]} y={MZ[1] + MR + 44} t="sideways part" c={C.neg} s={T.key} a="middle" />
        </g> : null}
        {/* RIGHT: the real, flattened Earth (flattening ×50) */}
        <g opacity={(0.35 + 0.65 * lit2) * (1 - mag)}>
          <ellipse cx={E[0]} cy={E[1]} rx={RR + 8 * fin(f, t(7))} ry={bE + 8 * fin(f, t(7))} fill="none" stroke="#3b7fc4" strokeWidth={8} opacity={0.9 * fin(f, t(7))} />
          <ellipse cx={E[0]} cy={E[1]} rx={RR} ry={bE} fill="#2a4a73" stroke={lit2 > 0 ? C.gold : C.ink} strokeWidth={3 + 2 * pulse(f, AT(k, 6, "a bulge"), 30)} />
          <line x1={E[0]} y1={E[1] - bE - 40} x2={E[0]} y2={E[1] + bE + 30} stroke={C.gold} strokeWidth={4} strokeDasharray="12 8" />
          <Arrow p={[E[0], E[1] - bE - 40]} q={[E[0], E[1] - bE - 120]} color={ROT} w={8} head={26} />
          <Arrow p={pE} q={gE} color={BROWN} w={8} head={28} o={lit2} />
          <Lbl x={(pE[0] + gE[0]) / 2 - 18} y={(pE[1] + gE[1]) / 2 + 30} t="g" c={BROWN} s={T.key} a="end" o={lit2} />
          <line x1={pE[0] - tE[0] * 90} y1={pE[1] - tE[1] * 90} x2={pE[0] + tE[0] * 90} y2={pE[1] + tE[1] * 90} stroke="#3b7fc4" strokeWidth={5} opacity={fin(f, t(7))} />
          <RightTick at={pE} u1={unit(pE, gE)} u2={tE} c={C.gold} o={fin(f, t(7)) * (0.6 + 0.4 * pulse(f, AT(k, 7, "points straight down"), 30))} />
          <Arrow p={pE} q={[pE[0] - (pE[0] - gE[0]) * -0.45, pE[1] - (pE[1] - gE[1]) * -0.45]} color={C.key} w={6} head={22} o={fin(f, AT(k, 8, "up means"))} />
          <circle cx={pE[0]} cy={pE[1]} r={10} fill={C.key} />
          <Lbl x={E[0]} y={790} t="real Earth" c={C.key} s={T.key} a="middle" />
          <Lbl x={E[0] + RR + 10} y={E[1] + 50} t="bulge" c={C.gold} s={T.floor} a="end" o={fin(f, AT(k, 6, "a bulge"))} />
        </g>
        {/* maths zone */}
        <Keyword f={f} text="its direction" at={[1100, 130]} appear={AT(k, 0, "its direction")} out={t(6) - 4} targets={[]} />
        <Lbl x={1100} y={250} t="round Earth: g* to the centre" c={BROWN} s={T.floor} o={fin(f, t(1)) * fout(f, t(3) - 4)} />
        <Lbl x={1100} y={330} t="centrifugal: away from the axis" c={C.local} s={T.floor} o={fin(f, AT(k, 1, "points away from the axis")) * fout(f, t(3) - 4)} />
        <Lbl x={1100} y={410} t="g leans towards the equator" c={C.neg} s={T.floor} o={fin(f, t(2)) * fout(f, t(3) - 4)} />
        <Lbl x={1100} y={460} t="> 10 ×" c={C.gold} s={T.calc} o={fin(f, AT(k, 5, "more than ten times")) * fout(f, t(6) - 4)} />
        <Keyword f={f} text="oceans would pile up at the equator" at={[1100, 545]} appear={AT(k, 5, "pile up there")} out={t(6) - 4} targets={[]} s={T.floor} />
        <Keyword f={f} text="flattened · bulge" at={[1100, 160]} appear={t(6)} targets={[]} />
        <Keyword f={f} text="level: g ⟂ sea surface" at={[1100, 260]} appear={t(7)} targets={[]} />
        <Lbl x={1100} y={360} t="up = against g" c={C.key} s={T.key} o={fin(f, AT(k, 8, "up means"))} />
        <Lbl x={1100} y={440} t="no sideways part" c={C.key} s={T.key} o={fin(f, AT(k, 8, "never pushes the wind sideways"))} />
        <Keyword f={f} text="in gravity" at={[1100, 560]} appear={AT(k, 9, "part of gravity")} targets={[]} />
        <CurvedLink f={f} from={[sideMid[0] + 22, sideMid[1] - 22]} to={[1090, 250]} start={t(3) + 6} end={t(6) - 10} bend={60} />
      </Svg>
      <TeX s={EQ_SIDE} x={1100} y={250} size={56} c={C.neg} o={fin(f, t(3)) * fout(f, t(6) - 4)} />
      <TeX s={EQ_COR10} x={1100} y={350} size={48} o={fin(f, t(4)) * fout(f, t(6) - 4)} />
      <TeX s={EQ_GEFF} x={1100} y={660} size={T.calc} o={fin(f, AT(k, 9, "part of gravity") + 10)} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s27g three traces of the spin
const S27G: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27g_three_traces");
  const t = (j: number) => SS(k, j);
  const tr = EAX.three_traces;
  const tr1 = fin(f, 4) * fout(f, t(5) - 6, 12), tr2 = fin(f, t(5)) * fout(f, t(8) - 6, 12), tr3 = fin(f, t(8)) * fout(f, t(10) - 6, 12);
  const endO = fin(f, t(10)) * fout(f, t(11) - 6, 12);
  const heO = fin(f, t(11) + 10, 24);
  const cam: GlobeCam = { lat: 0, lon: -20, dist: 6.0, pp: [520, 480] };
  // the cross-section (traces 2 and 3): circle → ellipse (flattening ×50)
  const C0: Pt = [520, 480], Rr = 300;
  const flat = clamp((f - AT(k, 7, "flattened Earth")) / 40, 0, 1) * (f < t(8) ? 1 : 1);
  const bb = Rr * (1 - (1 - tr.drawn_ratio_x50) * Math.max(flat, f >= t(8) ? 1 : 0));
  const ph = 45 * D2R;
  const bob: Pt = [C0[0] + Rr * Math.cos(ph) * 1.0, C0[1] - bb * Math.sin(ph)];
  const tilt = (f < AT(k, 7, "flattened Earth") ? tr.tilt_sphere_max_deg : tr.tilt_sphere_max_deg + (tr.tilt_real_deg - tr.tilt_sphere_max_deg) * flat) * 50 * D2R;
  const toC = unit(bob, C0);
  const sdir: Pt = [toC[0] * Math.cos(tilt) - toC[1] * Math.sin(tilt) * -1, toC[1] * Math.cos(tilt) + toC[0] * Math.sin(tilt) * -1];
  const top: Pt = [bob[0] - sdir[0] * 120, bob[1] - sdir[1] * 120];
  const deep: Pt = [bob[0] + sdir[0] * 330, bob[1] + sdir[1] * 330];
  const icon = (i: number) => (i === 0 ? tr1 : i === 1 ? tr2 : tr3);
  return (
    <Scene>
      {tr1 > 0 ? <GlobeView cam={cam} ppDef={[520, 480]} o={tr1} three={<Axis3D o={1} r={0.012} L={1.18} />}>
        {(G) => <>
          <LatCircle G={G} lat={0} c={C.gold} w={4} o={0.7} />
          {/* C4: the poles' value on the top row, the equator's below, so the two links never cross */}
          <CurvedLink f={f} from={G.p(0, 30)} to={[1080, 345]} start={AT(k, 2, "at the equator") - 10} end={t(5) - 8} bend={60} />
          <CurvedLink f={f} from={G.p(88, -20)} to={[1080, 250]} start={AT(k, 2, "at the poles") - 10} end={t(5) - 8} bend={40} />
          {(() => { const c0 = G.pw([0, 0, 0]), Rg = Math.abs(G.pw([0, 1, 0])[1] - c0[1]); return <>
            <ellipse cx={c0[0]} cy={c0[1]} rx={Rg / tr.drawn_ratio_x50} ry={Rg} fill="none" stroke={C.key} strokeWidth={4} strokeDasharray="14 9" opacity={fin(f, t(4))} />
            <Arrow p={[c0[0] + Rg - 4, c0[1] + 34]} q={[c0[0] + Rg / tr.drawn_ratio_x50 + 4, c0[1] + 34]} color={C.gold} w={6} head={20} o={fin(f, AT(k, 4, "farther from"))} />
            <Lbl x={c0[0] + Rg / tr.drawn_ratio_x50 - 10} y={c0[1] + 90} t="farther from the centre" c={C.key} s={T.floor} a="end" o={fin(f, AT(k, 4, "farther from"))} />
          </>; })()}
        </>}
      </GlobeView> : null}
      {heO > 0 ? <div style={{ opacity: heO }}><HalfEarthView st={heCam(58, 14, 5.2, [520, 545])} slide={1} three={<Arrow3D from={[0, 0, 0]} to={pinAt(45)} color={C.first} onTop />}>
        {(pr) => <FaceLines pr={pr} />}</HalfEarthView></div> : null}
      <Svg>
        {/* fix 2 (review 2 S5): the three 50-px icons are dropped; the keywords name each trace */}
        {/* traces 2 and 3: the cross-section with a plumb bob at 45°N */}
        <g opacity={Math.max(tr2, tr3)}>
          <ellipse cx={C0[0]} cy={C0[1]} rx={Rr} ry={bb} fill="#2a4a73" stroke={C.ink} strokeWidth={3} />
          <line x1={C0[0]} y1={C0[1] - Rr - 30} x2={C0[0]} y2={C0[1] + Rr - 20} stroke={C.gold} strokeWidth={4} strokeDasharray="12 8" />
          <circle cx={C0[0]} cy={C0[1]} r={8} fill={C.gold} />
        </g>
        <g opacity={tr2}>
          <line x1={bob[0]} y1={bob[1]} x2={C0[0]} y2={C0[1]} stroke={C.muted} strokeWidth={4} />
          <line x1={top[0]} y1={top[1]} x2={bob[0]} y2={bob[1]} stroke={C.ink} strokeWidth={4} />
          <line x1={bob[0]} y1={bob[1]} x2={deep[0]} y2={deep[1]} stroke={C.key} strokeWidth={4} strokeDasharray="14 9" />
          <path d={`M ${bob[0] - 14} ${bob[1] - 4} L ${bob[0] + 14} ${bob[1] - 4} L ${bob[0]} ${bob[1] + 24} Z`} fill={C.local} />
          <Lbl x={top[0] - 16} y={top[1] - 6} t="plumb line" c={C.key} s={T.floor} a="end" />
          <Lbl x={C0[0] - 20} y={C0[1] + 50} t="centre" c={C.muted} s={T.floor} a="end" />
          <Arc P={(x, y) => [bob[0] + x, bob[1] - y]} a0={Math.atan2(-toC[1], toC[0]) / D2R} a1={Math.atan2(-sdir[1], sdir[0]) / D2R} r={240} c={C.gold} w={7} />
        </g>
        <g opacity={tr3}>
          <Arrow p={C0} q={[C0[0] + Rr, C0[1]]} color={C.gold} w={6} head={22} />
          <Arrow p={C0} q={[C0[0], C0[1] - bb]} color={C.gold} w={6} head={22} />
          {/* C5: two short lines each, inside the outline */}
          <Lbl x={C0[0] + Rr / 2} y={C0[1] + 44} t="equator" c={C.gold} s={T.floor} a="middle" />
          <Lbl x={C0[0] + Rr / 2} y={C0[1] + 92} t="radius" c={C.gold} s={T.floor} a="middle" />
          <Lbl x={C0[0] - 20} y={C0[1] - bb / 2 - 24} t="polar" c={C.gold} s={T.floor} a="end" />
          <Lbl x={C0[0] - 20} y={C0[1] - bb / 2 + 24} t="radius" c={C.gold} s={T.floor} a="end" />
          <circle cx={C0[0]} cy={C0[1]} r={Rr * (1 - tr.flattening / 2)} fill="none" stroke={C.key} strokeWidth={3} opacity={0.7 * fin(f, t(9))} />
          <Lbl x={C0[0] - Rr + 10} y={C0[1] - Rr + 30} t="true shape" c={C.key} s={T.floor} a="start" o={fin(f, t(9))} />
        </g>
        {/* S11: two later videos */}
        <g opacity={endO}>
          <circle cx={330} cy={470} r={120} fill="none" stroke={C.muted} strokeWidth={3} strokeDasharray="8 8" />
          <line x1={330} y1={470} x2={415} y2={385} stroke={C.ink} strokeWidth={3} /><circle cx={415} cy={385} r={18} fill={C.second} />
          <Lbl x={330} y={650} t="circular motion" c={C.key} s={T.floor} a="middle" />
          <GlobeIcon x={760} y={470} r={110} />
          <Lbl x={760} y={650} t="Coriolis" c={C.key} s={T.floor} a="middle" />
        </g>
        {/* maths zone */}
        <Keyword f={f} text="three traces" at={[1080, 130]} appear={AT(k, 0, "three places")} out={t(1) - 4} targets={[]} />
        <Keyword f={f} text="gravity is weaker at the equator" at={[1080, 140]} appear={t(1)} out={t(5) - 6} targets={[]} s={T.floor} />
        <g opacity={fin(f, t(3)) * fout(f, t(5) - 6)}>
          <rect x={1080} y={480} width={600 * tr.spin_share} height={46} fill={C.local} />
          <rect x={1080 + 600 * tr.spin_share} y={480} width={600 * (1 - tr.spin_share)} height={46} fill={BROWN} opacity={fin(f, t(4))} />
          <Lbl x={1080} y={570} t="spin ≈ ⅔" c={C.local} s={T.key} a="start" />
          <Lbl x={1680} y={570} t="bulge: the rest" c={BROWN} s={T.floor} a="end" o={fin(f, t(4))} />
          <Lbl x={1080} y={440} t="the difference" c={C.muted} s={T.floor} a="start" />
        </g>
        <Keyword f={f} text="a plumb line" at={[1080, 140]} appear={t(5)} out={t(8) - 6} targets={[]} />
        <Lbl x={1080} y={320} t="round Earth, spin alone" c={C.key} s={T.floor} o={fin(f, t(6)) * fout(f, t(8) - 6)} />
        <Lbl x={1080} y={400} t="real, flattened Earth" c={C.key} s={T.floor} o={fin(f, t(7)) * fout(f, t(8) - 6)} />
        <Keyword f={f} text="Earth's shape" at={[1080, 140]} appear={t(8)} out={t(10) - 6} targets={[]} />
        <Keyword f={f} text="almost a sphere" at={[1080, 440]} appear={AT(k, 9, "treat Earth as a sphere")} out={t(10) - 6} targets={[]} />
        <Keyword f={f} text="later videos" at={[1080, 300]} appear={t(10)} out={t(11) - 6} targets={[]} />
        <Keyword f={f} text="back to the Coriolis push" at={[1080, 300]} appear={t(11)} targets={[]} c={ROT} />
      </Svg>
      <TeX s={EQ_GPOLE.split(String.raw`,\quad `)[0]} x={1080} y={345} size={60} o={fin(f, AT(k, 2, "nine point seven eight")) * fout(f, t(5) - 6)} />
      <TeX s={EQ_GPOLE.split(String.raw`,\quad `)[1]} x={1080} y={250} size={60} o={fin(f, AT(k, 2, "nine point eight three")) * fout(f, t(5) - 6)} />
      <Layered parts={[{ t: String.raw`\text{tilt} \approx 0.1^\circ` }, { t: String.raw`\;\to\;` }, { t: String.raw`\approx 0.2^\circ` }]} layers={[{ t: [0], o: 1 },
        { t: [1, 2], o: fin(f, AT(k, 7, "a fifth of a degree")) }]} x={1080} y={230} size={T.calc} o={fin(f, AT(k, 6, "a tenth of a degree")) * fout(f, t(8) - 6)} />
      <Layered parts={[{ t: String.raw`a_{\text{equator}} - a_{\text{poles}} \approx 21\ \mathrm{km}` }, { t: String.raw`\approx \tfrac{1}{300}\,a` }]}
        layers={[{ t: [0], o: 1 }, { t: [1], o: fin(f, t(9)) }]} x={1080} y={260} size={54} o={fin(f, AT(k, 8, "twenty one kilometres")) * fout(f, t(10) - 6)} />
    </Scene>
  );
};

// ================================================================ s28 f = 2Ω sin φ: the shadow of Ω on the local up
const F_CAM: GlobeCam = { lat: 8, lon: 90, dist: 6.0, pp: [600, 470] };
const S28A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28a_local_axes");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const tP = AT(k, 8, "North Pole"), tE = AT(k, 8, "at the equator");
  const la = 45 + 45 * easeIO(clamp((f - tP) / 30, 0, 1)) - 90 * easeIO(clamp((f - tE) / 40, 0, 1));
  const pin = pinAt(la);
  // fix 2 (review 2 N-M2): the camera moves in on the place for S1-S7 so the labels spread out, and back out for the
  // pole / equator travel (S8); the duplicate Ω on the axis fades while zoomed in.
  const zin = easeIO(clamp((f - t1 + 6) / 36, 0, 1)) * (1 - easeIO(clamp((f - SE(k, 7) + 4) / 30, 0, 1)));
  const P45 = pinAt(45);
  const st = heCam(58 - 24 * zin, 14, 5.2 - 1.75 * zin, [520 - 20 * zin, 545 + 120 * zin], lerp3([0, 0.05, 0], add3(P45, [0, 0.12, 0]), zin));
  const { n, u } = enAt(la, LON0);
  const L = 0.62;
  const om: V3 = [0, L, 0];
  const nL = L * Math.cos(la * D2R), uL = L * Math.sin(la * D2R);
  const omO = fin(f, t4, 14), legs = fin(f, t5, 14) * fout(f, SE(k, 7) - 6, 12); // the split leaves before the zoom-out (no label pile in the move)
  const lab = la > 89 ? "(0, 0, 7.29 × 10⁻⁵)" : la < 1 ? "(0, 7.29 × 10⁻⁵, 0)" : "";
  const AX = 0.5 + 0.3 * zin; // the local axes: long while zoomed in, their words at the far tips
  const edge = (v: number) => clamp((80 - la) / 6, 0, 1) * v;
  const mid = la >= 10 && la <= 70;
  const midO = clamp((la - 4) / 6, 0, 1) * clamp((76 - la) / 6, 0, 1); // the split is shown only between the pole and the equator
  return (
    <Scene>
      <HalfEarthView st={st} slide={1} fadeBelow={860}
        three={<>
          <Arrow3D from={[0, 1.0, 0]} to={[0, 1.33, 0]} color={ROT} px={12} head={40} o={clamp(1 - 3 * zin, 0, 1)} />
          <Ball3D at={pin} px={16} color={C.key} />
          <Arrow3D from={pin} to={add3(pin, HE_E, AX * 0.8)} color={C.local} px={8} head={28} grow={fin(f, AT(k, 1, "east"), 12)} onTop />
          <Arrow3D from={pin} to={add3(pin, n, AX)} color={C.local} px={8} head={28} grow={fin(f, AT(k, 1, "north"), 12)} onTop />
          <Arrow3D from={pin} to={add3(pin, u, AX)} color={f >= t2 && f < t5 ? ROT : C.local} px={8} head={28} grow={fin(f, AT(k, 1, "and up"), 12)} onTop />
          <Arrow3D from={pin} to={add3(pin, om)} color={ROT} px={12} head={40} o={omO} onTop />
          {/* the two component arrows from the place: along north (Ω cos φ) and along up (Ω sin φ) */}
          <Arrow3D from={pin} to={add3(pin, n, nL)} color={ROT} px={9} head={30} o={legs * midO} onTop />
          <Arrow3D from={pin} to={add3(pin, u, uL)} color={ROT} px={9} head={30} o={legs * midO} onTop />
        </>}>
        {(pr) => {
          const P = pr.p(pin);
          /** a label beside the tip of a component arrow, offset across it on the side away from the other axis */
          const side = (along: V3, away: V3, len: number, gap: number): [number, number, "start" | "end" | "middle"] => {
            const Tp = pr.p(add3(pin, along, len)), A = pr.p(add3(pin, away, 0.3));
            const dx = Tp[0] - P[0], dy = Tp[1] - P[1], Ln = Math.hypot(dx, dy) || 1;
            let nx = -dy / Ln, ny = dx / Ln;
            if (nx * (A[0] - P[0]) + ny * (A[1] - P[1]) > 0) { nx = -nx; ny = -ny; }
            return [Tp[0] - (dx / Ln) * 30 + nx * gap, Tp[1] - (dy / Ln) * 30 + ny * gap, nx > 0.3 ? "start" : nx < -0.3 ? "end" : "middle"];
          };
          const cN = side(n, u, nL, 46), cU = side(u, n, uL, 46);
          return <>
            <FaceLines pr={pr} top={1.2 - 0.2 * zin} o={1 - 0.88 * zin} />
            <L3 pr={pr} at={[0, 1.33, 0]} t="Ω" c={ROT} s={T.calc} a="start" dx={24} o={clamp((70 - la) / 6, 0, 1) * clamp(1 - 3 * zin, 0, 1)} />
            <Keyword f={f} text="tilted" at={[pr.p([0, 1.33, 0])[0] + 90, pr.p([0, 1.33, 0])[1] + 10]} appear={AT(k, 0, "tilted")} out={t1} targets={[]} />
            <TipL3 pr={pr} from={pin} to={add3(pin, HE_E, AX * 0.8)} t="east" c={C.local} s={T.key} o={edge(fin(f, AT(k, 1, "east"))) * fout(f, tP - 12)} />
            <TipL3 pr={pr} from={pin} to={add3(pin, n, AX)} t="north" c={C.local} s={T.key} o={edge(fin(f, AT(k, 1, "north"))) * clamp((la - 4) / 6, 0, 1)} />
            {mid ? <TipL3 pr={pr} from={pin} to={add3(pin, u, AX)} t={f >= t2 ? "up = k" : "up"} c={f >= t2 ? ROT : C.local} s={T.key}
              o={fin(f, AT(k, 1, "and up")) * fout(f, t5)} /> : null}
            {mid ? <TipL3 pr={pr} from={pin} to={add3(pin, u, AX)} t="up" c={C.local} s={T.key} o={fin(f, t5 + 8) * fout(f, SE(k, 7) - 6, 12)} /> : null}
            {mid ? <TipL3 pr={pr} from={pin} to={add3(pin, om)} t="Ω" c={ROT} s={T.calc} o={omO} />
              : <L3 pr={pr} at={add3(pin, om)} t="Ω" c={ROT} s={T.calc} a="start" dx={24} dy={la > 70 ? 72 : -20} o={omO} />}
            <Tick3 pr={pr} at={pin} u1={HE_E} u2={[0, 1, 0]} s={0.1} c={C.gold} o={fin(f, AT(k, 4, "leans partly north")) * fout(f, t5)} />
            <Seg3 pr={pr} a={add3(pin, n, nL)} b={add3(pin, om)} c={ROT} w={4} dash="10 8" o={legs * 0.8 * (mid ? 1 : 0)} />
            <Seg3 pr={pr} a={add3(pin, u, uL)} b={add3(pin, om)} c={ROT} w={4} dash="10 8" o={legs * 0.8 * (mid ? 1 : 0)} />
            <Lbl x={cN[0]} y={cN[1]} t="Ω cos φ" c={ROT} s={T.key} a={cN[2]} o={legs * midO} />
            <Lbl x={cU[0]} y={cU[1]} t="Ω sin φ" c={ROT} s={T.key} a={cU[2]} o={legs * midO} />
            <Arc3 pr={pr} c0={pin} e1={n} e2={u} r={0.22} a0={0} a1={la} col={C.gold} head={false} o={legs * fout(f, tP)} />
            <L3 pr={pr} at={add3(pin, add3(mul3(n, Math.cos(20 * D2R)), u, Math.sin(20 * D2R)), 0.31)} t="φ" c={C.gold} s={T.key} o={legs * fout(f, tP)} />
          </>;
        }}
      </HalfEarthView>
      <Svg>
        {/* v5 R3-S1: the maths zone is never empty at the scene start */}
        <Keyword f={f} text="on Earth: a sphere, Ω tilted" at={[1080, 160]} appear={AT(k, 0, "the floor is a sphere")} out={t3 - 8} targets={[]} />
        <Lbl x={1080} y={260} t="east · north · up" c={C.key} s={T.key} o={fin(f, AT(k, 1, "east, north, and up")) * fout(f, t4 - 8)} />
        <Lbl x={1080} y={360} t="up = k" c={ROT} s={T.key} o={fin(f, AT(k, 2, "Up is k")) * fout(f, t6 - 8)} />
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
      <Svg><Lbl x={1080} y={720} t="pole: all up · equator: all north" c={C.key} s={50} o={fin(f, t8)} />
        <Lbl x={1080} y={810} t={`Ω = ${lab}`} c={ROT} s={T.key} o={lab ? fin(f, t8) : 0} /></Svg>
    </Scene>
  );
};

// ================================================================ s28b Ω × u by the recipe; s28c the flat part; s28_f f
const LOC_K: OrbitKey = { f: 0, az: 235, el: 22, dist: 12, target: [0.5, 0.6, 1.0], pp: [495, 370] };
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
            return <line key={n} data-lc-ok="recipe cross line" x1={p[0]} y1={p[1]} x2={e[0]} y2={e[1]} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />;
          })}
          {grey >= 0 ? <line data-lc-ok="recipe strike" x1={TB.x[grey]} y1={TB.ya - 50} x2={TB.x[grey]} y2={TB.yb + 50} stroke={C.neg} strokeWidth={6} opacity={greyO} /> : null}
          {labA ? <Lbl x={1120} y={TB.ya} t={labA} c={cA} s={T.key} /> : null}
          {labB ? <Lbl x={1120} y={TB.yb} t={labB} c={cB} s={T.key} /> : null}
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
/** M13/M14: Ω × u written on two lines (… Ω sin φ u, / −Ω cos φ u)) so it stays inside x ≤ 1840; layers keep the indices
 * of OXU_PARTS (0–8) and are split between the lines; the third component can be struck ("we drop it"). */
const OxuLines: React.FC<{ layers: Layer[]; x: number; y: number; size: number; o?: number; dx2: number; dy2: number }> = ({ layers, x, y, size, o = 1, dx2, dy2 }) => {
  const sub = (L: Layer, lo: number, hi: number): Layer => {
    const pick = (a?: number[]) => (a ? a.filter((i) => i >= lo && i <= hi).map((i) => i - lo) : undefined);
    const tc = L.tc ? Object.fromEntries(Object.entries(L.tc).filter(([i]) => +i >= lo && +i <= hi).map(([i, c]) => [+i - lo, c])) : undefined;
    return { ...L, t: L.t === "all" || L.t === undefined ? L.t : pick(L.t), tc, u: pick(L.u), x: pick(L.x) };
  };
  const p2: Part[] = [{ ...OXU_PARTS[7], x: C.local }, OXU_PARTS[8]];
  return (
    <>
      <Layered parts={OXU_PARTS.slice(0, 7)} layers={layers.map((L) => sub(L, 0, 6))} x={x} y={y} size={size} o={o} />
      <Layered parts={p2} layers={layers.map((L) => sub(L, 7, 8))} x={x + dx2} y={y + dy2} size={size} o={o} />
    </>
  );
};
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
      <Svg><Keyword f={f} text="flat wind" at={[1100, 160]} appear={AT(k, 0, "blow almost flat")} out={t2} targets={[]} /></Svg>
      <Table3 f={f} o={fin(f, t2 + 10)} grey={grey} greyO={greyO} links={links} cA={ROT} cB={C.first} labA="Ω:" labB="u:"
        rowA={["0", String.raw`\Omega\cos\varphi`, String.raw`\Omega\sin\varphi`]} rowB={["u", "v", "0"]} />
      <TeX s={String.raw`\boldsymbol\Omega\times\mathbf u = (\quad ${SLOT("east")}\quad ,\quad ${SLOT("north")}\quad ,\quad ${SLOT("up")}\quad )`} x={1420} y={160} size={48} ax={0.5} o={fin(f, t2) * fout(f, slots[0], 10)} />
      <OxuLines layers={[{ t: [0, 1, 2, 4, 6, 8], o: 1 }, { t: [3], o: fin(f, slots[0]) }, { t: [5], o: fin(f, slots[1]) }, { t: [7], o: fin(f, slots[2]) }]}
        x={1060} y={110} size={50} dx2={200} dy2={70} o={fin(f, slots[0])} />
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
      <OxuLines layers={[{ t: "all", o: 1 }, { t: [3, 5], tc: { 3: C.gold, 5: C.gold }, o: glow12 }, { t: [7], tc: { 7: C.local }, o: fin(f, t4) }, { x: [7], o: fin(f, AT(k, 5, "so we drop it")) }]}
        x={1060} y={100} size={44} dx2={176} dy2={58} />
      <TeX s={String.raw`=\ ${ctex(ROT, String.raw`\Omega\sin\varphi`)}\,(-v,\ u,\ 0)\ +\ \dots`} x={1060} y={240} size={60} o={fin(f, t1)} />
      <CalcStack f={f} x={1230} y={310} size={44} rows={[
        { lhs: KL, rhs: String.raw`= (0\times0 - 1\times v,`, at: t2, h: 62 },
        { rhs: String.raw`\ \ 1\times u - 0\times0,\ \ 0)`, at: t2 + 14, cont: true, h: 62 },
        { rhs: KP[1], at: AT(k, 2, "minus v, small u and zero"), cont: true, c: C.key, h: 66 },
      ]} o={fout(f, t5 - 10)} />
      <TeX s={String.raw`\text{flat part} = \Omega\sin\varphi\ \mathbf k\times\mathbf u`} x={1080} y={590} size={T.calc} c={ROT} o={fin(f, t3)} />
      {/* M2: the wind speed and the units are written; two rows inside x ≤ 1840 */}
      <CalcStack f={f} x={1250} y={310} size={44} rows={[
        { lhs: VL, rhs: String.raw`= 2\times7.29\times10^{-5}\ \mathrm{s^{-1}}\times\cos45^\circ`, at: t5, h: 62 },
        { rhs: String.raw`\quad\times\,10\ \mathrm{m/s}`, at: t5 + 16, cont: true, h: 62 },
        { rhs: String.raw`\approx 1.03\times10^{-3}\ \mathrm{m/s^2}`, at: AT(k, 5, "one thousandth"), cont: true, c: C.local, h: 66 },
      ]} o={fin(f, t5) * fout(f, t6)} />
      <Svg>
        <g opacity={fin(f, AT(k, 5, "ten thousand times")) * fout(f, t6)}>
          <rect x={1100} y={730} width={2} height={50} fill={C.local} />
          <Lbl x={1120} y={760} t="vertical ≈ 0.001 m/s²" c={C.local} s={T.floor} />
          <rect x={1100} y={795} width={700} height={44} fill={C.muted} opacity={0.7} />
          <Lbl x={1810} y={817} t="g ≈ 9.8" c={C.key} s={T.floor} a="end" />
        </g>
        <Lbl x={1100} y={680} t="≈ 10 000 × weaker" c={C.key} s={T.key} o={fin(f, AT(k, 5, "ten thousand times")) * fout(f, t6)} />
      </Svg>
      <TeX s={EQ_TOFKU} x={1060} y={710} size={58} o={fin(f, t6)} />
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
        <Keyword f={f} text="Coriolis parameter" at={[1080, 232]} appear={AT(k, 0, "the Coriolis parameter")} targets={[]} s={T.floor} />
      </Svg>
      {/* S2: the left half shows where f comes from (the s28c result) until the globes arrive */}
      <Layered parts={[{ t: "-" }, { t: String.raw`2\Omega\sin\varphi`, u: { w: String.raw`f`, c: C.key } }, { t: String.raw`\,\mathbf k\times\mathbf u`, c: ROT }]}
        layers={[{ t: "all", o: 1 }, { u: [1], o: fin(f, AT(k, 0, "the Coriolis parameter")) }]} x={120} y={300} size={T.eq} ay={0} o={fin(f, 4) * fout(f, t2 - 8)} />
      <Svg><Keyword f={f} text="sideways push, per kg" at={[120, 560]} appear={6} out={t2 - 8} targets={[]} c={C.local} /></Svg>
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
              <Arrow p={[cx - 40, cy]} q={[cx - 40, cy - 150]} color={ROT} o={0.45 * fin(f, AT(k, 1, "The term k cross u"))} />
              <Lbl x={cx - 40} y={cy - 182} t="k × u = (0, 10)" c={ROT} s={T.floor} a="middle" o={0.7 * fin(f, AT(k, 1, "The term k cross u"))} />
              {/* S1: the Coriolis push is violet everywhere; M15: in the south it is offset and labelled on its left */}
              {dir !== 0 ? <Arrow p={[cx - 40 - (dir > 0 ? 14 : 0), cy]} q={[cx - 40 - (dir > 0 ? 14 : 0), cy - 150 * dir]} color={ROT} o={show} w={12} /> : null}
              {dir < 0 ? <Lbl x={cx - 20} y={cy + 190} t="−f k × u" c={ROT} s={T.floor} o={show} /> : null}
              {dir > 0 ? <Lbl x={cx - 70} y={cy - 80} t="−f k × u" c={ROT} s={T.floor} a="end" o={show} /> : null}
              <Lbl x={p.x + 260} y={720} t={p.w} c={C.key} s={50} a="middle" />
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
  // M1: the loop is drawn at its true size on the map (bmng_s31n.jpg: 889.6 km over the 760-px tile)
  const S = 760 / 889.6, R = I30.radius_km * S, cx = 520, cy = 480;   // px per km; R ≈ 83 px for the 97-km radius
  const sc = (i: number): Pt => [cx + (I30.x_km[i] - I30.centre_km[0]) * S, cy - (I30.y_km[i] - I30.centre_km[1]) * S];
  const pos = sc(j);
  const uu = [I30.u[j] / 10, I30.v[j] / 10], am = Math.hypot(I30.ax[j], I30.ay[j]), aa = [I30.ax[j] / am, I30.ay[j] / am];
  const uTip: Pt = [pos[0] + 90 * uu[0], pos[1] - 90 * uu[1]];
  const pTip: Pt = [pos[0] + 66 * aa[0], pos[1] - 66 * aa[1]];
  const trace = Array.from({ length: j + 1 }, (_, i) => sc(i).join(",")).join(" ");
  const [FK_L, FK_R] = splitEq(EQ_FKUN), FKP = eqPieces(FK_R);
  return (
    <Scene>
      <ImgTile x={140} y={110} w={760} h={740} img="cp/bmng_s31n.jpg" crop={null} o={0.55} />
      <Svg>
        <rect x={140} y={110} width={760} height={740} fill="none" stroke={C.grid} strokeWidth={3} />
        <Grid P={mkP(160, 830, 100 * S)} xr={[0, 8]} yr={[0, 8]} o={0.45} />
        <line x1={180} y1={790} x2={180 + 100 * S} y2={790} stroke={C.ink} strokeWidth={5} opacity={fin(f, t1)} />
        <Lbl x={180 + 50 * S} y={752} t="100 km" c={C.ink} s={T.floor} a="middle" o={fin(f, t1)} />
        {j > 0 ? <polyline points={trace} fill="none" stroke={C.gold} strokeWidth={5} /> : null}
        <circle cx={cx} cy={cy} r={6} fill={C.muted} opacity={fin(f, c0 + 30)} />
        <Arrow p={pos} q={uTip} color={C.first} />
        <Arrow p={pos} q={pTip} color={ROT} w={8} head={28} o={fin(f, t2)} />
        <RightTick at={pos} u1={unit(pos, uTip)} u2={unit(pos, pTip)} c={C.gold} o={fin(f, AT(k, 4, "at a right angle"))} />
        <circle cx={pos[0]} cy={pos[1]} r={11} fill={C.key} stroke={C.bg} strokeWidth={3} />
        <Lbl x={uTip[0] + 34 * uu[0] - 26 * uu[1]} y={uTip[1] - 34 * uu[1] - 26 * uu[0]} t="u" c={C.first} s={T.calc} a="middle" />
        <Lbl x={pTip[0] + 40 * aa[0] + 30 * aa[1]} y={pTip[1] - 40 * aa[1] + 30 * aa[0]} t="push" c={ROT} s={T.key} a="middle" o={fin(f, t2)} />
        <Lbl x={1080} y={150} t="u = 10 m/s" c={C.first} s={T.key} o={fin(f, AT(k, 1, "ten metres"))} />
        <Lbl x={1460} y={150} t="φ = 45°N" c={C.key} s={T.key} o={fin(f, AT(k, 1, "forty five degrees"))} />
        <Keyword f={f} text="about 1 mm/s every second" at={[1080, 560]} appear={AT(k, 3, "one millimetre")} targets={[]} />
        <g opacity={fin(f, t5)}>
          <ClockGlyph x={1110} y={780} r={34} h={(h * 12) % 12} />
          <Lbl x={1170} y={780} t={`t = ${h.toFixed(1)} h`} c={C.key} s={T.key} />
        </g>
        <Lbl x={cx} y={830} t="clockwise · from above" c={C.key} s={T.floor} a="middle" o={fin(f, c0 + 30)} />
        <Lbl x={1440} y={650} t="speed 10.0 m/s" c={C.first} s={T.key} o={fin(f, t5)} />
        <Keyword f={f} text="always ⟂" at={[1080, 660]} appear={AT(k, 4, "at a right angle")} targets={[]} />
      </Svg>
      <CalcStack f={f} x={1246} y={250} size={50} maxLines={4} rows={[
        { lhs: FK_L, rhs: FKP[0], at: t2, h: 76 },
        { rhs: FKP[1], at: AT(k, 2, "one point zero three"), cont: true, h: 76 },
        { rhs: FKP[2], at: AT(k, 3, "about one millimetre"), cont: true, c: C.key, h: 76 },
      ]} />
      <TeX s={EQ_PER} x={1460} y={785} size={T.calc} o={fin(f, AT(k, 6, "two pi over f"))} />
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
      box: { lat: [-49, -41] as [number, number], lon: [-75.1569, -63.8431] as [number, number] }, turn: "left · towards the north", tT: tL, o: fin(f, t1 - 10, 16) }];
  const labO = [fin(f, t1 - 10, 16), fin(f, tPat - 6, 16)];   // fx1 (S10): the right view from S1, its label on "Patagonia\"
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
                  <Lbl x={q0[0] + 40} y={(q0[1] + q1[1]) / 2} t={`≈ ${Math.round(dkm)} km`} c={C.gold} s={T.key} a="middle" rot={-90} />
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
          <Lbl x={v.x + VW / 2} y={VY + 70} t={v.lab} c={C.key} s={T.key} a="middle" o={labO[i]} />
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
        {/* fx1 (S10): the maths zone carries the first sentence's keyword */}<Keyword f={f} text="real winds" at={[1260, 170]} appear={AT(k, 0, "real winds")} out={AT(k, 1, "reanalysis") - 8} targets={[]} s={T.calc} />
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
    {push > 0 ? <SurfArrow G={G} pts={gcArrowPts(mid[0], mid[1], hd + side, 7, 0, 1, 10)} c={ROT} w={10} head={36} o={o * push} /> : null}
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
          <TurnArrow G={G} lat={NA.lat - 5} lon={NA.lon} az={180} d={22} bend={bN} o={arrO} push={fin(f, AT(k, 1, "turns it to the right"))} />
          <TurnArrow G={G} lat={SA.lat + 5} lon={SA.lon - 6} az={0} d={22} bend={bS} o={arrO * fin(f, t3)} push={fin(f, AT(k, 2, "turned to the left"))} />
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
        {/* fx1 (S10): the maths zone carries the first sentence's keyword */}<Keyword f={f} text="out of the highs, to the equator" at={[1100, 200]} appear={AT(k, 0, "flows out")} out={AT(k, 1, "turns it to the right") - 8} targets={[]} s={T.floor} />
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
        <Keyword f={f} text="towards the west and the equator" at={[1130, 760]} appear={AT(k, 5, "lean towards the west")} targets={[]} s={T.floor} />
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
          <TurnArrow G={G} lat={NA.lat + 5} lon={NA.lon} az={0} d={20} bend={bN} o={arrO} push={fin(f, AT(k, 1, "turned to the right"))} />
          <TurnArrow G={G} lat={SI.lat - 5} lon={SI.lon} az={180} d={20} bend={bS} o={arrO * fin(f, t2)} push={fin(f, AT(k, 2, "turned to the left"))} />
          <Lbl x={G.p(NA.lat, NA.lon)[0]} y={G.p(NA.lat, NA.lon)[1]} t="H" c={C.key} s={T.calc} a="middle" o={G.vis(NA.lat, NA.lon) ? arrO : 0} />
          <Lbl x={G.p(SI.lat, SI.lon)[0]} y={G.p(SI.lat, SI.lon)[1]} t="H" c={C.key} s={T.calc} a="middle" o={G.vis(SI.lat, SI.lon) ? arrO : 0} />
          <LatCircle G={G} lat={45} c={C.gold} w={4} dash="14 10" o={fin(f, t4) * fout(f, t6)} />
          <LatCircle G={G} lat={-45} c={C.gold} w={4} dash="14 10" o={fin(f, t4) * fout(f, t6)} />
        </>}
      </GlobeView>
      <Vignette id="v34" right={fin(f, t5 + 20, 30) * fout(f, t7 + 40, 30)} />
      <Svg>
        {/* fx1 (S10): the maths zone carries the first sentence's keyword */}<Keyword f={f} text="out of the highs, to the poles" at={[1100, 200]} appear={AT(k, 0, "flows out")} out={AT(k, 1, "turned to the right") - 8} targets={[]} s={T.floor} />
        <Keyword f={f} text="turned right" at={[1300, 200]} appear={AT(k, 1, "turned to the right")} out={t3} targets={[]} />
        <Keyword f={f} text="turned left" at={[1300, 300]} appear={AT(k, 2, "turned to the left")} out={t3} targets={[]} />
        <Keyword f={f} text="westerlies" at={[1200, 200]} appear={AT(k, 3, "the westerlies")} out={t6} targets={[]} s={T.calc} />
        <Lbl x={1200} y={300} t="named from where they blow" c={C.key} s={T.floor} o={fin(f, AT(k, 3, "named")) * fout(f, t6)} />
        <g opacity={fin(f, AT(k, 3, "the direction they blow from")) * fout(f, t6)}><Arrow p={[1270, 380]} q={[1450, 380]} color={C.gold} w={6} head={28} /><Lbl x={1470} y={380} t="from the west" c={C.gold} s={T.key} /></g>
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
        <Keyword f={f} text="pushed towards the low" at={[1222, 450]} appear={AT(k, 3, "pushed towards")} targets={[]} />
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
      {/* fix 2 (review 2 M3): thumbnails 520 px tall, labels at y 780, clear of the source line (y 852) */}
      {split > 0 ? <div style={{ opacity: split }}><SplitStorms f={f} k={k} t0={t8} cols={false} vh={520} labY={780} /></div> : null}
      <Svg>
        <Lbl x={1360} y={150} t="Cyclone Idai · 14 March 2019" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "fourteenth of March")) * (1 - split)} />
        <Keyword f={f} text="cyclone" at={[1340, 270]} appear={AT(k, 2, "called cyclones")} out={t8} targets={[]} s={T.calc} />
        <Lbl x={1340} y={390} t="≈ 54–59 m/s" c={C.key} s={T.calc} o={fin(f, AT(k, 3, "fifty four to fifty nine")) * fout(f, Math.min(t6 + 20, AT(k, 5, "f is negative") - 12))} />
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
  extraIan?: (G: ReturnType<typeof globeProj>) => React.ReactNode; vh?: number; labY?: number }> = ({ f, t0, cols, tilt = 0, tCols = 0, tIan = 0, tIdai = 0, ianDx = 0, extraIan,
  vh = 560, labY }) => {
  const VW = 860, VH = vh, VY = 200;
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
      {!cols ? <Svg>{specs.map((s, i) => <Lbl key={i} x={s.x + VW / 2} y={labY ?? VY + VH + 50} t={s.lab} c={i === 0 ? C.key : C.neg} s={T.key} a="middle" o={fin(f, t0 + 10)} />)}</Svg> : null}
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
        <g data-lc-contour="isobar">{RL.isobar_r_km.map((r, i) => {
          const d = clamp(iso - i, 0, 1);
          if (d <= 0) return null;
          return <circle key={`i${i}`} cx={g.cx} cy={g.cy} r={r * g.s} fill="none" stroke="#ffffff" strokeOpacity={0.85} strokeWidth={hi === i ? 7 : 4}
            strokeDasharray={`${2 * Math.PI * r * g.s * d} 99999`} />;
        })}</g>
        <g data-lc-maplabel="contour value">{labels ? RL.isobar_r_km.map((r, i) => (clamp(iso - i, 0, 1) > 0.5 ? <Lbl key={`l${i}`} x={g.cx - 0.5 * r * g.s - 8} y={g.cy + 0.866 * r * g.s + 4} t={`${RL.isobars_hPa[i]}`} c={C.ink} s={T.floor} a="end" /> : null)) : null}</g>
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
      <g data-lc-contour="isobar">{iso.map((yk) => <line key={yk} x1={g.x0} y1={sgY(g, yk)} x2={g.x0 + W} y2={sgY(g, yk)} stroke="#ffffff" strokeOpacity={0.85} strokeWidth={4} />)}</g>
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
        {/* fx1 (S10): the maths zone carries the first sentence's keyword */}<Keyword f={f} text="around highs and lows" at={[1150, 160]} appear={AT(k, 0, "how the wind blows")} out={AT(k, 1, "Air presses") - 8} targets={[]} />
        <Keyword f={f} text="pressure" at={[1150, 160]} appear={AT(k, 1, "Air presses")} targets={[]} />
        <Lbl x={1150} y={260} t="hectopascals: hPa" c={C.key} s={T.key} o={fin(f, AT(k, 2, "hectopascals"))} />
        <Lbl x={1150} y={360} t="≈ 1000 hPa" c={C.key} s={T.calc} o={fin(f, AT(k, 2, "about a thousand"))} />
        <Keyword f={f} text="one low" at={[1150, 470]} appear={AT(k, 3, "one low")} targets={[[RL0.cx + 40, RL0.cy]]} />
        <Keyword f={f} text="isobars" at={[1150, 580]} appear={AT(k, 4, "isobars")} targets={[[RL0.cx + 400 * RL0.s * 0.71 + 6, RL0.cy + 400 * RL0.s * 0.71]]} />
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
        <Keyword f={f} text="grad p → where pressure rises fastest" at={[1062, 140]} appear={t1} out={t3} targets={[]} s={T.floor} />
        <Keyword f={f} text="across the isobars, away from the low" at={[1062, 240]} appear={t2} out={t4} targets={[]} s={T.floor} />
        <Keyword f={f} text="high → low" at={[1150, 340]} appear={t3} targets={[]} />
        <Keyword f={f} text="density" at={[1530, 810]} appear={AT(k, 5, "density")} targets={[]} />
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
  const t1 = SS(k, 2), t2 = SS(k, 3), t3 = SS(k, 4);
  const g = zoomRL(2);
  const pin: Pt = [g.cx + RL.pin_km[0] * g.s, g.cy - RL.pin_km[1] * g.s];
  const turn = easeIO(clamp((f - AT(k, 1, "turned a quarter turn")) / 30, 0, 1));
  const a = (-90 + 90 * turn) * D2R;
  const tip: Pt = [pin[0] + 140 * Math.cos(a), pin[1] - 140 * Math.sin(a)];
  const walk = clamp((f - t3) / 60, 0, 1);
  return (
    <Scene>
      <Svg>
        <RoundLow g={g} pin={1} hi={f >= t2 ? 1 : -1} />
        <Arrow p={pin} q={[pin[0], pin[1] + 140]} color={C.second} />
        <Lbl x={pin[0] + 30} y={pin[1] + 130} t="∇p" c={C.second} s={T.key} />
        <Arrow p={pin} q={tip} color={ROT} o={fin(f, AT(k, 1, "turned a quarter turn"))} />
        <Arc P={(x, y) => [pin[0] + x, pin[1] - y]} a0={-90} a1={-90 + 90 * turn} r={70} c={C.gold} w={5} o={fin(f, AT(k, 1, "turned a quarter turn"))} />
        <CircleDot x={pin[0] - 50} y={pin[1] - 50} r={20} w={5} o={fin(f, 6)} />
        <Lbl x={pin[0] - 80} y={pin[1] - 50} t="k" c={ROT} s={T.key} a="end" o={fin(f, 6)} />
        <Lbl x={tip[0] + 20} y={tip[1] - 40} t="k × ∇p" c={ROT} s={T.key} o={fin(f, AT(k, 1, "turned a quarter turn") + 20)} />
        <Observer x={pin[0] + 60 + 140 * walk} y={pin[1] - 60} s={1.1} o={fin(f, t3)} />
        <Lbl x={pin[0] + 150} y={pin[1] - 250} t="left: low" c={C.gold} s={T.key} a="start" o={fin(f, AT(k, 4, "the low is on its left"))} />
        <Lbl x={pin[0]} y={pin[1] + 300} t="right: high" c={C.gold} s={T.key} a="middle" o={fin(f, AT(k, 4, "the high is on its right"))} />
        {/* fx1 (S10): the maths zone carries the first sentence's keyword */}<Keyword f={f} text="the turning tool on grad p" at={[1100, 160]} appear={AT(k, 0, "turning tool")} out={t1 - 8} targets={[]} />
        <Keyword f={f} text="grad p: south" at={[1100, 160]} appear={t1} targets={[]} c={C.second} />
        <Keyword f={f} text="k × grad p: east" at={[1100, 240]} appear={AT(k, 2, "points east")} targets={[]} c={ROT} />
        <Keyword f={f} text="along the isobars" at={[1100, 340]} appear={t2} targets={[]} />
      </Svg>
      <TeX s={EQ_KGP0} x={1100} y={460} size={T.eq} c={ROT} o={fin(f, AT(k, 1, "k cross grad p"))} />
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
        {/* fx1 (S10): the maths zone carries the first sentence's keyword */}<Keyword f={f} text="zoom in" at={[1170, 260]} appear={AT(k, 0, "zoom in")} out={AT(k, 0, "almost straight") - 8} targets={[]} />
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
        <Keyword f={f} text="steady → pushes add to zero" at={[1100, 140]} appear={t1} out={t5 - 6} targets={[]} />
        <Keyword f={f} text="equal and opposite" at={[1100, 230]} appear={t2} out={t5 - 6} targets={[]} />
        <Keyword f={f} text="pressure push → low" at={[1100, 640]} appear={AT(k, 3, "points towards the low")} out={t6} targets={[]} c={C.second} />
        <Keyword f={f} text="Coriolis push → high" at={[1100, 720]} appear={AT(k, 3, "towards the high")} out={t6} targets={[]} c={ROT} />
        <Keyword f={f} text="quarter turn right" at={[1100, 800]} appear={t4} out={t6} targets={[]} />
        <Keyword f={f} text="geostrophic balance" at={[1100, 680]} appear={AT(k, 6, "geostrophic balance")} targets={[]} s={T.calc} />
        <Keyword f={f} text="geostrophic wind" at={[1100, 790]} appear={AT(k, 6, "geostrophic wind")} targets={[]} s={T.calc} />
      </Svg>
    </Scene>
  );
};

/** the strip with the balanced pushes at the place (s41a's picture), drawn in any strip geometry g; labels optional */
const StripBalance: React.FC<{ g: SG; f: number; t1: number; labels: number; o?: number }> = ({ g, f, t1, labels, o = 1 }) => {
  if (o <= 0) return null;
  const sc = g.km / ST.km;
  const yk = 100 + (geo.loop_radius_km as number);
  const p: Pt = [sgX(g, 600), sgY(g, yk)];
  const A = 100 * sc, U = (geo.geo_speed as number) * 12 * sc, w = Math.max(5, 8 * sc), hd = Math.max(18, 30 * sc);
  return (
    <g opacity={o}>
      <Strip g={g} labels={labels > 0.5} HL={labels} />
      <Arrow p={p} q={[p[0] + U, p[1]]} color={C.first} w={w} head={hd} />
      <Arrow p={p} q={[p[0], p[1] - A]} color={C.second} dash="14 9" w={w} head={hd} o={fin(f, t1)} />
      <Arrow p={p} q={[p[0], p[1] + A]} color={ROT} w={w} head={hd} o={fin(f, t1)} />
      <circle cx={p[0]} cy={p[1]} r={11 * Math.max(0.6, sc)} fill={C.key} stroke={C.bg} strokeWidth={3} />
      <Lbl x={p[0] - 30} y={p[1] - 70} t="pressure push" c={C.second} s={T.floor} a="end" o={fin(f, t1) * labels} />
      <Lbl x={p[0] - 30} y={p[1] + 70} t="Coriolis push" c={ROT} s={T.floor} a="end" o={fin(f, t1) * labels} />
    </g>
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
  // fix 2 (review 2 N-M1): the picture stays in x 80-1000 all scene; at S3's end the strip shrinks to the lower left (still
  // with its two equal and opposite pushes) and the half-turn picture appears above it; the maths stays at x >= 1060.
  const sh = easeIO(clamp((f - (t4 - 26)) / 26, 0, 1));
  const gBig: SG = { x0: 100, y0: 230, km: 0.72 }, gSmall: SG = { x0: 120, y0: 560, km: 0.4 };
  const g: SG = { x0: gBig.x0 + (gSmall.x0 - gBig.x0) * sh, y0: gBig.y0 + (gSmall.y0 - gBig.y0) * sh, km: gBig.km + (gSmall.km - gBig.km) * sh };
  const mx = 300, my = 380, L = 110;
  return (
    <Scene>
      <Svg>
        <StripBalance g={g} f={f} t1={t1} labels={fout(f, t4 - 36, 8)} />{/* v5 C3: the labels leave before the strip shrinks */}
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
        {/* fx1 (S10): the maths zone carries the first sentence's keyword */}<Keyword f={f} text="the same steps, as maths" at={[1100, 200]} appear={AT(k, 0, "the same steps")} out={t1 - 8} targets={[]} />
      </Svg>
      <CalcStack f={f} x={1520} y={60} size={50} maxLines={3} rows={[
        { lhs: { parts: G0P.map((q) => ({ ...q, t: DF(q.t) })), layers: [{ t: "all", o: 1 }, { u: [0, 1], o: fin(f, t1 + 30) }] }, rhs: G0R, at: t1, h: 220 },
        { lhs: DF(G1L), rhs: DF(G1R), at: t2, h: 140 },
        { lhs: DF(G2L), rhs: DF(G2R), at: t3, h: 140 },
        { lhs: KL, rhs: KR, at: t5, c: C.key, h: 100 },
        { lhs: G3L, rhs: DF(G3R), at: t6, h: 140 },
        { lhs: GL, rhs: DF(GR), at: t7, c: C.key, size: 50, h: 170, ul: AT(k, 7, "one over f rho") + 10, ulOff: 20 },
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
  const t1 = SS(k, 1), tK = AT(k, 2, "k cross turns it"), t2 = SS(k, 3), t3 = SS(k, 4);
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
        <Lbl x={sgX(g, 1200) + 24} y={g.y0 + 40} t="low on the left" c={C.key} s={T.floor} a="start" o={fin(f, AT(k, 2, "with the low on the left"))} />
        <g opacity={fin(f, AT(k, 3, "the closer the isobars"))}>
          <Strip g={g2} labels={false} HL={0} double />
          <Arrow p={pin2} q={[pin2[0] + 2 * L, pin2[1]]} color={C.first} />
          <Lbl x={g2.x0 + 300 * g2.km * 2} y={g2.y0 + 400 * g2.km + 50} t="twice as close" c={C.key} s={T.key} a="middle" />
        </g>
        <Keyword f={f} text="closer → stronger" at={[1260, 340]} appear={AT(k, 3, "the stronger the wind")} out={t3 - 6} targets={[]} />
        <GlobeIcon x={1790} y={340} r={50} o={fin(f, t3)} />
      </Svg>
      <Layered parts={GEO_PARTS} layers={[{ t: "all", o: 1 }, { u: [4], o: fin(f, t1) }, { u: [3], o: fin(f, tK) }, { u: [2], o: fin(f, t2) }]} x={900} y={40} size={T.eq} ax={0.5} ay={0} o={fin(f, 6)} />
      <TeX s={String.raw`f \to 0`} x={1520} y={330} size={T.calc} c={C.neg} o={fin(f, AT(k, 4, "f goes to zero"))} />
      <Svg>
        <Lbl x={1080} y={770} t="balance breaks down" c={C.key} s={T.floor} o={fin(f, AT(k, 4, "breaks down"))} />
        <Lbl x={1080} y={826} t="near the equator" c={C.key} s={T.floor} o={fin(f, AT(k, 4, "breaks down"))} />
      </Svg>
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
        {/* fix 2 (review 2 S4): the link ends below "400 000 m", 12 px short of it, and is gone before the next row */}
        <CurvedLink f={f} from={[bx + 30 + textW("400 km", T.key) + 16, (y1 + y2) / 2 + 36]} to={[1470, 296]} start={AT(k, 2, "four hundred thousand metres")} end={t3 - 6} ctl={[1040, 520]} />
        {/* fix 2 (review 2 S2): the goal on S0, before the first number */}
        <Keyword f={f} text="geostrophic wind: how fast?" at={[1100, 140]} appear={6} out={t2 - 8} targets={[]} s={T.floor} />
        <circle cx={pin[0]} cy={pin[1]} r={10} fill={C.key} />
        <g opacity={fin(f, t3) * fout(f, t6)}>
          <Arrow p={pin} q={[pin[0], pin[1] + 110]} color={C.second} w={8} head={28} />
          <Lbl x={pin[0] - 20} y={pin[1] + 100} t="∇p" c={C.second} s={T.key} a="end" />
        </g>
        <g opacity={fin(f, t4) * fout(f, t6)}>
          <Arrow p={pin} q={[pin[0] + 120, pin[1]]} color={ROT} w={8} head={28} />
          <Lbl x={pin[0] + 60} y={pin[1] - 52} t="k × ∇p" c={ROT} s={T.key} a="middle" />
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
              return <g key={i} data-lc-contour="isobar"><path d={dd} fill="none" stroke={C.bg} strokeOpacity={0.5 * d} strokeWidth={6} /><path d={dd} fill="none" stroke="#ffffff" strokeOpacity={0.85 * d} strokeWidth={3} /></g>;
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
            return <g key={t as string} data-lc-maplabel="place"><Lbl x={q[0]} y={q[1]} t={t as string} c={C.key} s={T.floor} a="middle" o={lowO * (1 - 0.6 * geoO) * (1 - arcO)} /></g>;
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
        <Keyword f={f} text="north-western France" at={[1330, 460]} appear={AT(k, 2, "north-western France")} out={t3} targets={[sp(48.2, -2.5)]} s={T.floor} />
        <Keyword f={f} text="southern England" at={[1330, 400]} appear={AT(k, 2, "southern England")} out={t3} targets={[sp(51.0, -1.5)]} s={T.floor} />
        <Lbl x={1330} y={320} t="same time" c={C.key} s={T.floor} o={fin(f, AT(k, 3, "at the same time")) * fout(f, t4 - 6)} />
        <Lbl x={1330} y={380} t="isobars every 4 hPa" c={C.key} s={T.floor} o={fin(f, AT(k, 3, "every four hectopascals")) * fout(f, t4 - 6)} />
        {/* O1: one keyword list for the current sentence; the height diagram retires when the formula arrives */}
        <g opacity={fin(f, t4) * fout(f, t5 - 6)}>
          <line x1={1340} y1={640} x2={1820} y2={640} stroke={C.muted} strokeWidth={5} />
          {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={1350 + i * 80} y1={640} x2={1330 + i * 80} y2={660} stroke={C.muted} strokeWidth={3} />)}
          <line x1={1340} y1={470} x2={1820} y2={470} stroke={C.key} strokeWidth={3} strokeDasharray="12 9" />
          <Lbl x={1350} y={430} t="≈ 1.5 km" c={C.key} s={T.key} o={fin(f, AT(k, 4, "one and a half kilometres"))} />
          <Lbl x={1350} y={515} t="almost no friction" c={C.key} s={T.floor} o={fin(f, AT(k, 4, "almost no friction"))} />
          <Lbl x={1332} y={600} t="friction near the ground" c={C.local} s={T.floor} />
        </g>
        <Keyword f={f} text="geostrophic, at ≈ 1.5 km" at={[1330, 330]} appear={t5} targets={[]} s={T.floor} c={ROT} />
        <Keyword f={f} text="along the isobars" at={[1330, 590]} appear={AT(k, 6, "along the isobars")} targets={[]} s={T.floor} />
        <Keyword f={f} text="low on the left" at={[1330, 660]} appear={AT(k, 6, "the low on their left")} targets={[]} s={T.floor} />
        <Keyword f={f} text="fastest where crowded" at={[1330, 730]} appear={AT(k, 6, "longest where")} targets={[]} s={T.floor} />
      </Svg>
      <TeX s={DF(EQ_GEO)} x={1330} y={450} size={T.key} c={ROT} o={fin(f, AT(k, 5, "with our formula"))} />
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
            <Lbl x={p[0] - 24} y={p[1] - 24} t={z.n} c={C.gold} s={T.floor} a="end" />
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
        <Keyword f={f} text="friction near the ground:" at={[1330, 600]} appear={AT(k, 6, "Friction slows")} out={t7} targets={[]} s={T.floor} />
        <Keyword f={f} text="across the isobars," at={[1330, 660]} appear={AT(k, 6, "partly across")} out={t7} targets={[]} s={T.floor} />
        <Keyword f={f} text="towards the low" at={[1330, 720]} appear={AT(k, 6, "towards the low")} out={t7} targets={[]} s={T.floor} />
        <Lbl x={1330} y={590} t="direction ✓" c={C.key} s={T.key} o={fin(f, t7)} />
        <Lbl x={1330} y={670} t="speed ≈ 15 % less" c={C.key} s={T.floor} o={fin(f, t7)} />
        <Lbl x={1330} y={730} t="curved flow" c={C.key} s={T.floor} o={fin(f, t7)} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s47 recap, s48 end card
// fx1: the sentences are found by their words (v5 has two more: the turning per component and the axis seen from its tip;
// Part 2 says "In the last video, we saw that…" and points to Part 1 in its last sentence), so one component serves both.
const S47: React.FC = () => {
  const f = useCurrentFrame(), k = K("s47_recap");
  const S = A.sc[k].sentences;
  const t = S.map((_, j) => SS(k, j));
  const si = (ph: string) => S.findIndex((x) => x.text.toLowerCase().includes(ph.toLowerCase()));
  const iLeave = si("leaves out its own direction"), iTurn = si("is the turning about its own axis"), iLen = si("Its length is"),
    iDir = si("Its direction is"), iAxis = si("points along the axis of the turn"), iPhys = si("physics uses it"), iEarth = si("On the spinning Earth"),
    iFlat = si("For flat winds"), iStorm = si("why storms spin"), iGeo = si("the geostrophic wind"), iLast = S.length - 1;
  const iCent0 = si("the centrifugal pull"), iCent = iCent0 >= 0 ? iCent0 : iFlat;   // U-CF S7
  const p2 = A === ACT_P2;
  const beat = (j: number, jEnd?: number) => (j < 0 ? 0 : fin(f, t[j] + (j === 0 ? 4 : 0), 10) * (jEnd !== undefined ? fout(f, t[jEnd] - 6, 10) : 1));
  const st = orbitCam({ az: 221, el: 28, dist: 15, target: [2.2, 1.3, 1.2], pp: [560, 430] }, PP);
  const prS = projector(st, W3, H3);
  const hp = handPlace(A3, [0, 0, 1], 1.4);
  const FT = P(...ALONG);
  const Q = (x: number, y: number): Pt => [x - 60 + 0, y];
  const afterLeave = iTurn >= 0 ? iTurn : iLen;
  const pairO = Math.min(1, beat(0, afterLeave) + beat(iDir, iPhys));   // fx1 (S10): the arrows stay through "each component…"
  return (
    <Scene>
      {pairO > 0 ? <div style={{ opacity: pairO }}>
        <PairFloor st={st} axb={1} para={beat(iDir, iPhys)}
          children={<Hand3D q={hp.q} at={hp.at} s={1.4} angles={POSE.curl(1)} o={beat(iDir, iPhys)} glow={{ thumb: ROT }} />}
          over={<>
            <Tick3 pr={prS} at={[0, 0, 0]} u1={AH} u2={[0, 0, 1]} s={0.55} o={beat(0, iLeave)} />
            <Tick3 pr={prS} at={[0, 0, 0]} u1={BH} u2={[0, 0, 1]} s={0.55} o={beat(0, iLeave)} />
            <TipL3 pr={prS} from={[0, 0, 0]} to={AXB3} t="a × b = (0, 0, 14)" c={ROT} s={T.key} />
          </>} />
      </div> : null}
      <PairTags o={beat(0, iLeave)} />
      <Svg>
        {/* v5: each component = the turning in its own wall, + one turn − the other (the s50 / s21c picture) */}
        <g opacity={beat(iTurn, iLen)}>
          {([["x ← (y, z)", "yz"], ["y ← (z, x)", "zx"], ["z ← (x, y)", "xy"]] as [string, "yz" | "zx" | "xy"][]).map(([tt, pl], i) => <g key={tt}>
            <WallTriad x={190} y={230 + 230 * i} plane={pl} />
            <Lbl x={380} y={200 + 230 * i} t={tt} c={C.key} s={T.calc} />
            <Lbl x={380} y={270 + 230 * i} t="+ one turn − the other" c={C.key} s={T.floor} />
          </g>)}
        </g>
        <g opacity={beat(iLen, iDir)}>
          <polygon points={CORN.map((p) => Q(...p).join(",")).join(" ")} fill={ROT} fillOpacity={0.2} stroke={ROT} strokeWidth={3} />
          <Arrow p={Q(...O2)} q={Q(...ATIP)} color={C.first} />
          <Arrow p={Q(...O2)} q={Q(...BTIP)} color={C.second} o={0.5} />
          <Band p={Q(...O2)} q={Q(...FT)} color={C.first} o={0.8} />
          <Band p={Q(...FT)} q={Q(...BTIP)} color={ROT} o={0.8} />
          <Lbl x={Q(...FT)[0] - 30} y={(Q(...FT)[1] + Q(...BTIP)[1]) / 2} t="across" c={ROT} s={T.key} a="end" />
        </g>
        <g opacity={beat(iPhys, iEarth)}>
          <Arrow p={[260, 330]} q={[260, 200]} color={ROT} w={10} />
          <line x1={150} y1={380} x2={380} y2={330} stroke="#c9d2e3" strokeWidth={18} strokeLinecap="round" />
          {/* Part 2 (fx1 S2): torque, angular momentum and the charge's push were taught in Part 1; the words, not the formulas */}
          <Lbl x={p2 ? 220 : 260} y={440} t={p2 ? "torque" : "τ = r × F"} c={C.key} s={p2 ? T.floor : T.key} a="middle" />
          <circle cx={560} cy={330} r={70} fill="none" stroke={C.muted} strokeWidth={3} strokeDasharray="8 8" />
          <circle cx={630} cy={330} r={16} fill={C.second} />
          <Arrow p={[560, 330]} q={[560, 210]} color={ROT} w={10} />
          <Lbl x={p2 ? 590 : 560} y={440} t={p2 ? "angular momentum" : "L = r × p"} c={C.key} s={p2 ? T.floor : T.key} a="middle" />
          <circle cx={860} cy={330} r={14} fill={C.key} />
          <Arrow p={[860, 330]} q={[960, 330]} color={C.first} w={8} />
          <Arrow p={[860, 330]} q={[860, 410]} color={C.second} w={8} />
          <Lbl x={860} y={p2 ? 510 : 470} t={p2 ? "moving charge" : "F = q v × B"} c={C.key} s={p2 ? T.floor : T.key} a="middle" />
          <circle cx={560} cy={660} r={110} fill="none" stroke={C.gold} strokeWidth={5} />
          <Arrow p={[560, 550]} q={[680, 550]} color={C.first} w={8} />
          <Arrow p={[560, 550]} q={[560, 620]} color={C.second} w={8} />
        </g>
        <g opacity={beat(iEarth, iFlat)}>
          <circle cx={300} cy={430} r={150} fill="#22406a" stroke={C.ink} strokeWidth={3} opacity={iCent < iFlat ? 1 - fin(f, t[iCent], 10) : 1} />
          <line x1={300} y1={250} x2={300} y2={610} stroke={C.gold} strokeWidth={5} strokeDasharray="12 8" />
          <g opacity={iCent < iFlat ? 1 - fin(f, t[iCent] - 6, 10) : 1}>
            <Arrow p={[300, 430]} q={[406, 324]} color={C.first} w={8} />
            <Arrow p={[406, 324]} q={[480, 360]} color={C.second} w={8} />
            <Disc cx={760} cy={430} s={45} ang={f / 60} />
          </g>
          {/* fix 2 (review 2 S2): the s27f "real Earth" panel in small: the flattened Earth (×50), the place on its outline at 45°, g along
              the outline's normal (not at the centre), and the outward centrifugal part as a short sketch (≤ 20 % of g) */}
          {(() => {
            if (!(iCent < iFlat)) return null;
            const E0: Pt = [300, 430], ra = 156, rb = 156 * EAX.three_traces.drawn_ratio_x50, ph = 45 * D2R;
            const rho = 1 / Math.hypot(Math.cos(ph) / ra, Math.sin(ph) / rb);
            const pE: Pt = [E0[0] + rho * Math.cos(ph), E0[1] - rho * Math.sin(ph)];
            const nx = (pE[0] - E0[0]) / (ra * ra), ny = (E0[1] - pE[1]) / (rb * rb), nl = Math.hypot(nx, ny);
            const gE: Pt = [pE[0] - (nx / nl) * 130, pE[1] + (ny / nl) * 130];
            const tE: Pt = [-ny / nl, -nx / nl];
            return <g opacity={fin(f, t[iCent], 10)}>
              <ellipse cx={E0[0]} cy={E0[1]} rx={ra} ry={rb} fill="#22406a" stroke={C.ink} strokeWidth={3} />
              <line x1={300} y1={250} x2={300} y2={610} stroke={C.gold} strokeWidth={5} strokeDasharray="12 8" />
              <line x1={pE[0] - tE[0] * 70} y1={pE[1] - tE[1] * 70} x2={pE[0] + tE[0] * 70} y2={pE[1] + tE[1] * 70} stroke="#3b7fc4" strokeWidth={5} />
              <Arrow p={pE} q={gE} color={BROWN} w={8} head={30} />
              <RightTick at={pE} u1={unit(pE, gE)} u2={tE} c={C.gold} />
              <Arrow p={[pE[0] + 14, pE[1]]} q={[pE[0] + 40, pE[1]]} color={C.local} w={6} head={16} />
              <circle cx={pE[0]} cy={pE[1]} r={10} fill={C.key} />
              <Lbl x={pE[0] + 52} y={pE[1] - 36} t="Ω² r⊥" c={C.local} s={T.key} a="start" />
              <Lbl x={(pE[0] + gE[0]) / 2 + 24} y={(pE[1] + gE[1]) / 2 + 14} t="g" c={BROWN} s={T.key} a="start" />
            </g>;
          })()}
        </g>
      </Svg>
      <CompTable f={f} o={beat(iLeave, iLeave + 1)} grey={-1} greyO={0} links={[[1, 2, t[iLeave] + 10], [2, 1, t[iLeave] + 30], [2, 0, t[iLeave] + 50], [0, 2, t[iLeave] + 70], [0, 1, t[iLeave] + 90], [1, 0, t[iLeave] + 110]]} dy={-20} />
      <TeX s={EQ_COMP} x={1830} y={790} size={46} ax={1} o={beat(iLeave, iLeave + 1)} />
      <TeX s={String.raw`\mathbf a\times\mathbf b\ \perp\ \mathbf a,\ \mathbf b`} x={1150} y={300} size={T.calc} o={beat(0, iLeave)} />
      <TeX s={EQ_SIN} x={1080} y={300} size={T.calc} o={beat(iLen, iDir)} />
      <TeX s={String.raw`= |\mathbf a|\times\text{across} = \text{area}`} x={1196} y={420} size={T.calc} c={ROT} o={beat(iLen, iDir)} />
      <Svg>
        <Lbl x={1100} y={300} t="each component:" c={C.key} s={T.key} o={beat(iTurn, iLen)} />
        <Lbl x={1100} y={390} t="the turning about its axis" c={C.key} s={T.key} o={beat(iTurn, iLen)} />
        <Lbl x={1100} y={480} t="minus: opposite turns" c={C.neg} s={T.key} o={beat(iTurn, iLen)} />
        <Lbl x={1080} y={420} t={p2 ? "⟂ their plane · right-hand rule" : "normal · right-hand rule"} c={C.key} s={p2 ? 50 : 64} o={beat(iDir, iAxis >= 0 ? iAxis : iPhys)} />
        <Lbl x={1100} y={330} t="direction = the axis of the turn" c={C.key} s={T.key} o={beat(iAxis, iPhys)} />
        <Lbl x={1100} y={430} t="from its tip: anticlockwise" c={C.gold} s={T.key} o={beat(iAxis, iPhys)} />
        <Lbl x={1080} y={330} t="from the last video" c={C.gold} s={T.key} o={p2 ? beat(iPhys, iEarth) : 0} />
        <Lbl x={1080} y={420} t="push ⟂ motion → turns, same speed" c={C.key} s={T.floor} o={beat(iPhys, iEarth)} />
        <Lbl x={1100} y={560} t="north: right · south: left" c={C.key} s={T.key} o={beat(iFlat, iGeo)} />
        <Lbl x={1100} y={640} t="storms spin" c={C.key} s={T.key} o={beat(iStorm, iGeo)} />
        <Lbl x={1100} y={260} t="the last video: why it's built this way" c={C.gold} s={T.floor} o={p2 ? fin(f, AT(k, iLast, "The last video")) : 0} />
        <Lbl x={1100} y={360} t="later videos: weather maps" c={C.key} s={T.key} o={p2 ? fin(f, AT(k, iLast, "later videos")) : beat(iLast)} />
        <Lbl x={1100} y={440} t="grad, div, curl" c={C.key} s={T.key} o={p2 ? fin(f, AT(k, iLast, "grad, div and curl")) : beat(iLast)} />
        <Lbl x={1100} y={520} t="∇   ∇·   ∇×" c={C.key} s={T.calc} o={p2 ? fin(f, AT(k, iLast, "grad, div and curl")) : beat(iLast)} />
      </Svg>
      <TeX s={EQ_VOR} x={1100} y={330} size={T.eq} o={beat(iEarth, iCent)} />
      <TeX s={EQ_COR} x={1100} y={470} size={T.eq} c={ROT} o={fin(f, AT(k, iEarth, "minus two Omega")) * fout(f, t[iCent] - 6)} />
      <TeX s={EQ_CFE} x={1100} y={330} size={T.calc} c={C.local} o={iCent < iFlat ? beat(iCent, iFlat) : 0} />
      <Svg><Lbl x={1100} y={450} t="→ folded into g" c={BROWN} s={T.key} o={iCent < iFlat ? fin(f, AT(k, iCent, "folded into gravity")) * fout(f, t[iFlat] - 6) : 0} /></Svg>
      <TeX s={EQ_FKU} x={1100} y={420} size={T.eq} c={ROT} o={beat(iFlat, iGeo)} />
      <div style={{ position: "absolute", left: 120, top: 220, width: 420, height: 320, overflow: "hidden", opacity: beat(iFlat, iGeo) }}>
        <Img src={staticFile("cp/ian_tc.jpg")} style={{ width: 900, position: "absolute", left: -330, top: -230 }} />
      </div>
      <div style={{ position: "absolute", left: 580, top: 220, width: 420, height: 320, overflow: "hidden", opacity: beat(iFlat, iGeo) }}>
        <Img src={staticFile("cp/idai_14.jpg")} style={{ width: 1000, position: "absolute", left: -210, top: -310 }} />
      </div>
      <Svg>
        <Lbl x={330} y={590} t="north: right" c={C.key} s={T.key} a="middle" o={beat(iFlat, iGeo)} />
        <Lbl x={790} y={590} t="south: left" c={C.key} s={T.key} a="middle" o={beat(iFlat, iGeo)} />
      </Svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: beat(iGeo), transform: "translate(40px, 150px) scale(0.6)", transformOrigin: "0 0" }}>
        <StormMap f={f} isoD={40} geoO={1} actO={0} w10O={0} arcO={0} crowdO={0} lowO={0} />
      </div>
      <TeX s={EQ_GEO} x={1080} y={420} size={T.eq} c={C.key} o={beat(iGeo, iLast)} />
    </Scene>
  );
};
const EndCard: React.FC<{ variant: "weather" | "maths"; id: string }> = ({ variant, id }) => {
  const f = useCurrentFrame(), k = K(id);
  const maths = variant === "maths";
  const t1 = SS(k, 1), t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const p2 = A === ACT_P2;   // fx1 (Part 2 S7): thumbnail 2 is the Part 1 picture (parallelogram + a × b), marked "last video"
  const thumb = (x: number, i: number) => (
    <g key={i} opacity={p2 && i === 1 ? 1 : 0.75}>
      <rect x={x - 150} y={150} width={300} height={190} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
      {i === 0 ? <><Arrow p={[x - 90, 300]} q={[x + 60, 270]} color={C.first} w={8} head={26} halo={false} /><Arrow p={[x - 90, 300]} q={[x - 50, 180]} color={C.second} w={8} head={26} halo={false} /></> : null}
      {i === 1 ? <><polygon points={`${x - 90},${300} ${x + 40},${300} ${x + 90},${230} ${x - 40},${230}`} fill={ROT} fillOpacity={0.3} stroke={ROT} strokeWidth={3} /><Arrow p={[x - 90, 300]} q={[x - 90, 170]} color={ROT} w={8} head={26} halo={false} /></> : null}
      {i === 1 && p2 ? <rect x={x - 150} y={150} width={300} height={190} rx={16} fill="none" stroke={C.gold} strokeWidth={5} /> : null}
      {i === 2 && !maths ? <>{Array.from({ length: 12 }, (_, j) => <rect key={j} x={x - 120 + j * 20} y={170} width={20.5} height={150} fill={tColor(6 + j)} />)}<Arrow p={[x - 60, 245]} q={[x + 60, 245]} color={C.second} w={8} head={26} halo={false} /></> : null}
      {i === 2 && maths ? <>{[0, 1, 2].map((a) => [0, 1, 2].map((b) => <rect key={`${a}${b}`} x={x - 75 + 50 * b} y={170 + 50 * a} width={46} height={46}
        fill={(a + 1) % 3 === b ? C.first : (b + 1) % 3 === a ? C.neg : "none"} fillOpacity={0.35} stroke={C.grid} strokeWidth={2} />))}</> : null}
      {i === 3 ? <><circle cx={x} cy={245} r={75} fill="#22406a" stroke={C.ink} strokeWidth={3} /><ellipse cx={x} cy={245} rx={75} ry={24} fill="none" stroke={C.muted} strokeWidth={3} /><ellipse cx={x} cy={245} rx={28} ry={75} fill="none" stroke={C.muted} strokeWidth={3} /></> : null}
    </g>
  );
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, 6)}>{[420, 760, 1100, 1440].map((x, i) => thumb(x, i))}</g>
        {p2 ? <Lbl x={760} y={112} t="last video" c={C.gold} s={T.floor} a="middle" o={fin(f, 6)} /> : null}
        {/* the weather/climate/ocean ending (HOUSE_STYLE §3, user 2026-10-27): who the series is for, and that it shows the maths */}
        <Lbl x={960} y={415} t={maths ? "a series of maths tutorials" : "a series of tutorials"} c={C.key} s={T.calc} a="middle" o={fin(f, 10)} />
        {maths ? <Lbl x={960} y={500} t="atmospheric science · meteorology · fluid dynamics" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "atmospheric science"))} /> : <>
        <Lbl x={960} y={500} t="meteorology · atmospheric science · climate" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "meteorology"))} />
        <Lbl x={960} y={575} t="the ideas, and the maths behind them" c={C.gold} s={T.key} a="middle" o={fin(f, AT(k, 1, "the maths behind them"))} /></>}
        <g opacity={fin(f, t2)}>
          <Notebook x={560} y={690} s={0.55} />
          <Lbl x={630} y={690} t="cross-product notebook" c={C.ink} s={T.calc} />
        </g>
        <g opacity={fin(f, tOther)}>
          {[0, 1, 2].map((i) => <Notebook key={i} x={420 + i * 34} y={826 - i * 10} s={0.32} c={[C.second, ROT, C.muted][i]} o={0.9} />)}
          <Lbl x={560} y={820} t={maths ? "notebooks for the other maths concepts" : "notebooks for the other concepts"} c={C.key} s={T.key} />
        </g>
      </Svg>
    </Scene>
  );
};
const S48: React.FC = () => <EndCard variant="weather" id="s48_end" />;


// ================================================================================================ v5 new scenes (2026-10-28)
// Every number below is read from data/v5.json (movies/data/build_ch00_cross_product_why.py, v5_parts: CHECK rows X1-X7).
const EQ_EPS = String.raw`(\mathbf a\times\mathbf b)_i=\varepsilon_{ijk}\,a_j\,b_k`;
const EQ_LAG = String.raw`(\mathbf a\cdot\mathbf b)^2+|\mathbf a\times\mathbf b|^2=|\mathbf a|^2\,|\mathbf b|^2`;
const EQ_TZ = String.raw`\tau_z=r_x F_y-r_y F_x`;
const EQ_TX = String.raw`(\mathbf r\times\mathbf F)_x = r_yF_z - r_zF_y = 0.2\times30 - 0.1\times10 = 5`;
const EQ_TY = String.raw`(\mathbf r\times\mathbf F)_y = r_zF_x - r_xF_z = 0.2\times30 - 0.1\times10 = 5`;
{ // s21c: the CalcStack rows are the pieces of EQ_TY (the last row adds the spoken "six minus one")
  const [l, r] = splitEq(EQ_TY), pc = eqPieces(r);
  if (l !== String.raw`(\mathbf r\times\mathbf F)_y` || pc[0] !== "= r_zF_x - r_xF_z" || pc[1] !== String.raw`= 0.2\times30 - 0.1\times10` || pc[2] !== "= 5") throw new Error("s21c rows ≠ EQ_TY");
}
const EQ_DET = String.raw`\mathbf r\times\mathbf F=\begin{vmatrix}\hat{\mathbf x}&\hat{\mathbf y}&\hat{\mathbf z}\\ r_x&r_y&r_z\\ F_x&F_y&F_z\end{vmatrix}=\hat{\mathbf x}(r_yF_z-r_zF_y)-\hat{\mathbf y}(r_xF_z-r_zF_x)+\hat{\mathbf z}(r_xF_y-r_yF_x)`;
const EQ_TBALL = String.raw`\boldsymbol\tau=\mathbf r\times\mathbf F=(-0.2,\;0,\;0.2)\ \mathrm{N\,m}`;
const EQ_WR = String.raw`\boldsymbol\omega\times\mathbf r`;
const EQ_OXR0 = String.raw`\boldsymbol\Omega\times\mathbf r`;
const EQ_FU0 = String.raw`\mathbf F\cdot\mathbf u = 0`;
const V5 = v5 as unknown as {
  eps: { cycle: number[][]; anti: number[][]; z_terms: number[]; z: number };
  two_parts: { dot: number; cross: number; dot2: number; cross2: number; na2: number; nb2: number };
  z: { r: number[]; F: number[]; tau: number[]; plus: number; minus: number }; x: { r: number[]; F: number[]; tau: number[]; plus: number; minus: number };
  y: { r: number[]; F: number[]; tau: number[]; plus: number; minus: number };
  ball: { r: number[]; F: number[]; tau: number[]; axis: number[]; angle_from_up_deg: number; radius_m: number };
  cases_dot: number[];
};
const CHECK5: [string, number, number, number][] = [
  ["ε z terms", V5.eps.z_terms[0] + V5.eps.z_terms[1], 14, 1e-12], ["dot²", V5.two_parts.dot2, 64, 1e-9], ["cross²", V5.two_parts.cross2, 196, 1e-9],
  ["|a|²|b|²", V5.two_parts.na2 * V5.two_parts.nb2, 260, 1e-9], ["τz", V5.z.tau[2], 5, 1e-9], ["τz +", V5.z.plus, 6, 1e-9], ["τz −", V5.z.minus, 1, 1e-9],
  ["τx", V5.x.tau[0], 5, 1e-9], ["τy", V5.y.tau[1], 5, 1e-9], ["ball τx", V5.ball.tau[0], -0.2, 1e-9], ["ball τz", V5.ball.tau[2], 0.2, 1e-9],
  ["ball angle", V5.ball.angle_from_up_deg, 45, 1e-6], ["p·q 0", V5.cases_dot[0], 6, 1e-12], ["p·q 2", V5.cases_dot[2], -6, 1e-12],
  ["ω×r", Math.hypot(...(titleSpin.v[0] as number[])), 0.6, 1e-9],
];
for (const [n, v, ref, tol] of CHECK5) if (Math.abs(v - ref) > tol) throw new Error(`v5 data ≠ storyboard: ${n} = ${v}, ref ${ref}`);
const HAT: Record<string, string> = { x: "x̂", y: "ŷ", z: "ẑ" };

// ---------------------------------------------------------------- s15a the sign table ε_ijk
const EPS_SL = { x0: [120, 430, 740], y0: 330, c: 78 };
const epsVal = (i: number, j: number, k: number) =>
  V5.eps.cycle.some((c) => c[0] === i && c[1] === j && c[2] === k) ? 1 : V5.eps.anti.some((c) => c[0] === i && c[1] === j && c[2] === k) ? -1 : 0;
const S15A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15a_index_form");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), tPlus = AT(k, 3, "plus one"), tMinus = AT(k, 3, "minus one"), tZero = AT(k, 3, "zero when");
  const t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const gridO = fin(f, t3 - 10, 14), zOnly = fin(f, t5, 16);
  const swap = clamp((f - AT(k, 8, "swapping two letters")) / 12, 0, 1);
  const L = ["x", "y", "z"];
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let kk = 0; kk < 3; kk++) {
    let e = epsVal(i, j, kk);
    const x = EPS_SL.x0[i] + kk * EPS_SL.c, y = EPS_SL.y0 + j * EPS_SL.c;
    const lit = e > 0 ? fin(f, tPlus) : e < 0 ? fin(f, tMinus) : fin(f, tZero);
    const zKeep = i === 2 && e !== 0 ? 1 : 1 - 0.7 * zOnly;
    // s8: in the z slice the two lit cells trade colours (12-frame cross-fade; no flash)
    const traded = i === 2 && e !== 0 ? swap : 0;
    const col = (v: number) => (v > 0 ? C.first : v < 0 ? C.neg : C.local);
    const rep0 = pulse(f, t4 + 6, 40) * (j === kk || i === j || i === kk ? 1 : 0);
    cells.push(<g key={`${i}${j}${kk}`} opacity={zKeep}>
      <rect x={x + 3} y={y + 3} width={EPS_SL.c - 6} height={EPS_SL.c - 6} fill={e === 0 ? "none" : col(e)} fillOpacity={0.28 * lit * (1 - traded)} stroke={C.grid} strokeWidth={2} />
      {e !== 0 ? <rect x={x + 3} y={y + 3} width={EPS_SL.c - 6} height={EPS_SL.c - 6} fill={col(-e)} fillOpacity={0.28 * traded} /> : null}
      {e < 0 && traded < 1 ? <rect x={x + 3} y={y + 3} width={EPS_SL.c - 6} height={EPS_SL.c - 6} fill="url(#hatch15)" opacity={lit * (1 - traded)} /> : null}
      {e > 0 && traded > 0 ? <rect x={x + 3} y={y + 3} width={EPS_SL.c - 6} height={EPS_SL.c - 6} fill="url(#hatch15)" opacity={traded} /> : null}
      <Lbl x={x + EPS_SL.c / 2} y={y + EPS_SL.c / 2} t={(traded > 0.5 ? -e : e) > 0 ? "+1" : (traded > 0.5 ? -e : e) < 0 ? "−1" : "0"}
        c={(traded > 0.5 ? -e : e) === 0 ? C.local : col(traded > 0.5 ? -e : e)} s={T.floor} a="middle" o={lit * (e === 0 ? 0.6 + 0.4 * rep0 : 1)} />
    </g>);
    e = 0;
  }
  const zCellGlow = pulse(f, t6, 30) + pulse(f, AT(k, 6, "epsilon z y x"), 30);
  return (
    <Scene>
      <Svg>
        <defs><pattern id="hatch15" width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={12} stroke={C.neg} strokeWidth={3} opacity={0.7} /></pattern></defs>
        {/* the recipe's pairs while the notation is introduced (S0-S2) */}
        <g opacity={fin(f, 6) * fout(f, t3 - 12)}>
          {(["x ← (y, z)", "y ← (z, x)", "z ← (x, y)"]).map((t, i) => <Lbl key={t} x={180} y={330 + 110 * i} t={t} c={C.key} s={T.calc} />)}
          <Lbl x={180} y={700} t="one short line for all three?" c={C.key} s={T.floor} o={fin(f, 20)} />
        </g>
        <g opacity={gridO}>
          {[0, 1, 2].map((i) => <g key={i} opacity={i === 2 ? 1 : 1 - 0.7 * zOnly}>
            <Lbl x={EPS_SL.x0[i] + 1.5 * EPS_SL.c} y={EPS_SL.y0 - 100} t={`i = ${L[i]}`} c={i === 2 ? C.gold : C.key} s={T.key} a="middle" />
            {L.map((t, kk) => <Lbl key={`c${t}`} x={EPS_SL.x0[i] + (kk + 0.5) * EPS_SL.c} y={EPS_SL.y0 - 32} t={t} c={C.muted} s={T.floor} a="middle" />)}
            {L.map((t, j) => <Lbl key={`r${t}`} x={EPS_SL.x0[i] - 22} y={EPS_SL.y0 + (j + 0.5) * EPS_SL.c} t={t} c={C.muted} s={T.floor} a="middle" />)}
          </g>)}
          {cells}
          <Lbl x={120} y={620} t="row: j · column: k" c={C.muted} s={T.floor} />
          {zCellGlow > 0 ? <g opacity={Math.min(1, zCellGlow)}>
            <rect x={EPS_SL.x0[2] + 1 * EPS_SL.c} y={EPS_SL.y0} width={EPS_SL.c} height={EPS_SL.c} fill="none" stroke={C.gold} strokeWidth={6} />
            <rect x={EPS_SL.x0[2]} y={EPS_SL.y0 + EPS_SL.c} width={EPS_SL.c} height={EPS_SL.c} fill="none" stroke={C.gold} strokeWidth={6} />
          </g> : null}
        </g>
        <Keyword f={f} text="the whole recipe, short" at={[1080, 330]} appear={AT(k, 0, "a short way")} out={AT(k, 0, "index notation") - 8} targets={[]} />
        <Keyword f={f} text="index notation" at={[1080, 330]} appear={AT(k, 0, "index notation")} out={AT(k, 1, "the letters i, j and k") - 6} targets={[]} />
        <Keyword f={f} text="i, j, k: each x, y or z" at={[1080, 330]} appear={AT(k, 1, "the letters i, j and k")} out={t3 - 6} targets={[]} />
        <Keyword f={f} text="add up over every j and k" at={[1080, 440]} appear={AT(k, 2, "added up")} out={t3 - 6} targets={[]} s={T.floor} />
        <Lbl x={1080} y={330} t="+1 with the cycle x → y → z" c={C.first} s={T.key} o={fin(f, tPlus) * fout(f, t5 - 6)} />
        <Lbl x={1080} y={420} t="−1 against it" c={C.neg} s={T.key} o={fin(f, tMinus) * fout(f, t5 - 6)} />
        <Lbl x={1080} y={510} t="0 if two letters repeat" c={C.local} s={T.key} o={fin(f, tZero) * fout(f, t5 - 6)} />
        <Lbl x={1080} y={620} t="x̂ × x̂: no area → 0" c={C.key} s={T.key} o={fin(f, AT(k, 4, "crossed with itself")) * fout(f, t5 - 6)} />
        <Keyword f={f} text="the z component: two terms" at={[1080, 330]} appear={t5} out={t8} targets={[[EPS_SL.x0[2] + 3 * EPS_SL.c + 14, EPS_SL.y0 - 100]]} bend={0.08} s={T.key} />
      </Svg>
      <TeX s={EQ_EPS} x={1080} y={180} size={96} o={fin(f, AT(k, 2, "epsilon i j k"))} glow={pulse(f, AT(k, 2, "epsilon i j k"), 24)} />
      <CalcStack f={f} x={1220} y={420} size={54} maxLines={3} rows={[
        { lhs: String.raw`(\mathbf a\times\mathbf b)_z`, rhs: String.raw`= \varepsilon_{zxy}a_xb_y + \varepsilon_{zyx}a_yb_x`, at: t6, h: 110 },
        { rhs: String.raw`= (+1)(5)(3) + (-1)(1)(1)`, at: AT(k, 6, "times five times three"), h: 100 },
        { rhs: String.raw`= 15 - 1 = \mathbf{14}`, at: t7, h: 100, c: C.key },
      ]} o={fout(f, t8 + 20)} />
      <TeX s={String.raw`\varepsilon_{zxy} = +1,\quad \varepsilon_{zyx} = -1`} x={1080} y={760} size={T.key} o={fin(f, t6) * fout(f, t8 + 20)} />
      <TeX s={String.raw`\varepsilon_{yxz} = -\varepsilon_{xyz}`} x={1080} y={520} size={T.calc} c={C.key} o={fin(f, AT(k, 8, "flips the sign of epsilon"))} />
      <TeX s={EQ_ANTI} x={1080} y={680} size={T.eq} c={C.key} o={fin(f, AT(k, 8, "why b cross a"))} glow={pulse(f, AT(k, 8, "why b cross a") + 10, 24)} />
      <Svg><Lbl x={1080} y={800} t="swap two letters → minus" c={C.neg} s={T.key} o={fin(f, AT(k, 8, "swapping two letters") + 12)} /></Svg>
    </Scene>
  );
};

// ---------------------------------------------------------------- s18d along and across share b (Lagrange's identity)
const S18D: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18d_two_parts");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const FT = P(...ALONG);
  const TP = V5.two_parts;
  const LG_L = EQ_LAG.split("=")[0], LG_R = `= ${EQ_LAG.split("=")[1]}`;
  const bars = fin(f, t3, 16);
  const hyp = lerp(O2, BTIP, 0.5);
  return (
    <Scene>
      <Svg>
        <Grid P={P} xr={[-1, 6]} yr={[-1, 4]} o={0.7} />
        <polygon points={[O2, FT, BTIP].map((p) => p.join(",")).join(" ")} fill={C.key} fillOpacity={0.08 * fin(f, t2)} stroke="none" />
        <Arrow p={O2} q={ATIP} color={C.first} o={0.55} />
        <Band p={O2} q={FT} color={C.first} o={0.8} />
        <Band p={FT} q={BTIP} color={ROT} o={0.8} />
        <Arrow p={O2} q={BTIP} color={C.second} />
        <RightTick at={FT} u1={unit(FT, O2)} u2={unit(FT, BTIP)} o={1} />
        <TipLabel p={PAIR_TIPS.a} c={C.first} o={0.7} /><TipLabel p={PAIR_TIPS.b} c={C.second} />
        <Lbl x={FT[0] + 30} y={FT[1] + 66} t={f >= AT(k, 1, "cos theta") ? "along = |b| cos θ" : "along"} c={C.first} s={T.key} a="middle" />
        <Lbl x={(FT[0] + BTIP[0]) / 2 + 60} y={(FT[1] + BTIP[1]) / 2} t={f >= AT(k, 1, "sine theta") ? "across = |b| sin θ" : "across"} c={ROT} s={T.key} a="start" />
        <Lbl x={hyp[0] - 40} y={hyp[1] - 10} t="|b|" c={C.second} s={T.key} a="end" o={fin(f, AT(k, 2, "long side is b"))} />
        <Keyword f={f} text="a right triangle" at={[560, 140]} appear={AT(k, 2, "right triangle")} out={t4} targets={[]} s={T.key} />
        {/* S3: both sides × |a|: the along part becomes a · b, the across part |a × b| (bars to scale, 30 px per unit) */}
        <g opacity={bars}>
          <rect x={140} y={762} width={TP.dot * 30 * bars} height={26} fill={C.first} opacity={0.85} />
          <Lbl x={160 + TP.dot * 30} y={775} t="|a| × along = a · b = 8" c={C.first} s={T.floor} />
          <rect x={140} y={822} width={TP.cross * 30 * bars} height={26} fill={ROT} opacity={0.85} />
          <Lbl x={160 + TP.cross * 30} y={835} t="|a| × across = |a × b| = 14" c={ROT} s={T.floor} />
        </g>
        <Keyword f={f} text="two products share b" at={[1080, 160]} appear={6} out={t1 - 4} targets={[]} />
        <Lbl x={1080} y={760} t="along + across: all of b" c={C.key} s={T.key} o={fin(f, AT(k, 7, "together they use all of b"))} />
      </Svg>
      <TeX s={String.raw`\text{along} = |\mathbf b|\cos\theta`} x={1080} y={300} size={T.calc} c={C.first} o={fin(f, AT(k, 1, "cos theta")) * fout(f, t4 - 6)} />
      <TeX s={String.raw`\text{across} = |\mathbf b|\sin\theta`} x={1080} y={410} size={T.calc} c={ROT} o={fin(f, AT(k, 1, "sine theta")) * fout(f, t4 - 6)} />
      <TeX s={String.raw`\text{along}^2 + \text{across}^2 = |\mathbf b|^2`} x={1080} y={530} size={T.calc} o={fin(f, AT(k, 2, "long side is b")) * fout(f, t4 - 6)} />
      <TeX s={String.raw`\text{each side}\ \times\,|\mathbf a|`} x={1080} y={640} size={T.key} c={C.gold} o={fin(f, t3) * fout(f, t4 - 6)} />
      <CalcStack f={f} x={1400} y={170} size={50} maxLines={4} rows={[
        { lhs: LG_L, rhs: LG_R, at: AT(k, 4, "a dot b squared"), h: 110 },
        { lhs: String.raw`8^2 + 14^2`, rhs: String.raw`= 64 + 196`, at: AT(k, 5, "eight squared"), h: 100 },
        { rhs: String.raw`= \mathbf{260}`, at: AT(k, 5, "two hundred and sixty"), cont: true, h: 100, c: C.key },
        { lhs: String.raw`|\mathbf a|^2\,|\mathbf b|^2`, rhs: String.raw`= 26\times10 = \mathbf{260}`, at: t6, h: 100, c: C.key },
      ]} />
      <TeX s={ctex(C.first, String.raw`\mathbf a\cdot\mathbf b\ \to\ \text{along}`) + String.raw`\qquad ` + ctex(ROT, String.raw`\mathbf a\times\mathbf b\ \to\ \text{across}`)} x={1080} y={660} size={T.floor} o={fin(f, t7)} />
      <PairTags two o={1 - bars} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s21a-s21c one component = two opposing mini-torques
// 2-D view of one plane (the floor or a wall), seen from the tip of the third axis: arm r = (2, 1) and push F = (1, 3) in
// display units (1 unit = 0.1 m of arm = 10 N of push); the numbers on screen are the data's.
const PT = mkP(260, 700, 150);
const MiniTorque: React.FC<{ f: number; h: string; v: string; out: string; o?: number; arm: number; push: number; split: number; hiA: number; hiB: number;
  arcA: number; arcB: number; tauO?: number; tauLab?: string; wall?: number; rO?: number }> = ({ f, h, v, out, o = 1, arm, push, split, hiA, hiB, arcA, arcB, tauO = 0, tauLab = "", wall = 0, rO }) => {
  if (o <= 0) return null;
  const O = PT(0, 0), H = PT(2, 1), Hx = PT(2, 0), FY = PT(2, 4), FX = PT(3, 1);
  const dimF = (hi: number) => 1 - 0.65 * Math.max(hiA, hiB) + 0.65 * hi;
  const arc = (r: number, a0: number, a1: number) => Array.from({ length: 33 }, (_, i) => { const a = (a0 + ((a1 - a0) * i) / 32) * D2R; return `${O[0] + r * Math.cos(a)},${O[1] - r * Math.sin(a)}`; }).join(" ");
  const head = (r: number, a: number, dir: number, c: string) => {
    const ar = a * D2R, ex = O[0] + r * Math.cos(ar), ey = O[1] - r * Math.sin(ar), tx = -Math.sin(ar) * dir, ty = -Math.cos(ar) * dir;
    return <polyline points={`${ex - tx * 20 + ty * 11},${ey - ty * 20 - tx * 11} ${ex},${ey} ${ex - tx * 20 - ty * 11},${ey - ty * 20 + tx * 11}`} fill="none" stroke={c} strokeWidth={6} />;
  };
  return (
    <g opacity={o}>
      {wall > 0 ? <rect x={PT(-1, 4)[0]} y={PT(-1, 4)[1]} width={PT(4, 0)[0] - PT(-1, 0)[0]} height={PT(0, -1)[1] - PT(0, 4)[1]} fill={C.key} opacity={0.05 * wall} /> : null}
      <Grid P={PT} xr={[-1, 4]} yr={[-1, 4]} o={0.6} />
      <Lbl x={PT(4, 0)[0] + 24} y={O[1]} t={h} c={C.muted} s={T.key} />
      <Lbl x={O[0] + 28} y={PT(0, 3.3)[1]} t={v} c={C.muted} s={T.key} a="start" />{/* fx1 (S7): inside the content area, under the "towards you" tag */}
      <CircleDot x={PT(-1, 4)[0] + 34} y={PT(-1, 4)[1] + 40} r={20} w={4} c={C.muted} />
      <Lbl x={PT(-1, 4)[0] + 66} y={PT(-1, 4)[1] + 40} t={`${HAT[out]} towards you`} c={C.muted} s={T.floor} a="start" />
      {/* the spanner: a wide grey bar from the bolt to the hand, a hex at the bolt */}
      <line x1={O[0]} y1={O[1]} x2={H[0]} y2={H[1]} stroke="#c9d2e3" strokeWidth={30} strokeLinecap="round" opacity={0.35 * arm} />
      <polygon points={Array.from({ length: 6 }, (_, i) => `${O[0] + 26 * Math.cos((i * Math.PI) / 3)},${O[1] + 26 * Math.sin((i * Math.PI) / 3)}`).join(" ")} fill="#3a4766" stroke="#c9d2e3" strokeWidth={4} opacity={arm} />
      <Arrow p={O} q={H} color={C.first} o={(rO ?? arm) * (1 - 0.5 * split)} />
      <Lbl x={(O[0] + H[0]) / 2 - 20} y={(O[1] + H[1]) / 2 - 40} t="r" c={C.first} s={T.calc} a="end" o={rO ?? arm} />
      <Arrow p={H} q={add(H, [FY[0] - H[0] + FX[0] - H[0], FY[1] - H[1]])} color={C.second} o={push * (1 - split)} />{/* fx1 (S7): gone once split, so it never crosses "30 N along" */}
      <Lbl x={FY[0] + FX[0] - H[0] + 30} y={FY[1] + 10} t="F" c={C.second} s={T.calc} a="start" o={push * (1 - split)} />
      {/* split: the arm's two parts (dashed teal) and the push's two parts (orange, the h-part dashed) */}
      <g opacity={split}>
        <Dash p={O} q={Hx} c={C.first} w={6} d="16 10" o={dimF(hiA)} />
        <Dash p={Hx} q={H} c={C.first} w={6} d="16 10" o={dimF(hiB)} />
        <Arrow p={H} q={FY} color={C.second} o={dimF(hiA)} w={10 + 4 * hiA} />
        <Arrow p={H} q={FX} color={C.second} dash="18 10" o={dimF(hiB)} w={10 + 4 * hiB} />
        <Lbl x={FY[0] + 24} y={FY[1] + 60} t={`30 N along ${v}`} c={C.second} s={T.floor} a="start" o={dimF(hiA)} />
        <Lbl x={FX[0] + 24} y={FX[1]} t={`10 N along ${h}`} c={C.second} s={T.floor} a="start" o={dimF(hiB)} />
      </g>
      <Bracket p={O} q={Hx} off={74} c={C.gold} o={hiA} />
      <Lbl x={(O[0] + Hx[0]) / 2} y={O[1] + 122} t={`0.2 m along ${h}`} c={C.gold} s={T.floor} a="middle" o={hiA} />
      <Bracket p={Hx} q={H} off={-48} c={C.gold} o={hiB} />
      <Lbl x={Hx[0] + 70} y={(Hx[1] + H[1]) / 2 + 4} t={`0.1 m along ${v}`} c={C.gold} s={T.floor} a="start" o={hiB} />
      {arcA > 0 ? <g opacity={fin(f, 0) * Math.min(1, arcA * 3)}><polyline points={arc(52, -40, -40 + 250 * arcA)} fill="none" stroke={ROT} strokeWidth={7} />{arcA >= 1 ? head(52, 210, 1, ROT) : null}</g> : null}
      {arcB > 0 ? <g opacity={Math.min(1, arcB * 3)}><polyline points={arc(70, 150, 150 - 230 * arcB)} fill="none" stroke={C.neg} strokeWidth={6} strokeDasharray="12 8" />{arcB >= 1 ? head(70, -80, -1, C.neg) : null}</g> : null}
      {tauO > 0 ? <g opacity={tauO}><CircleDot x={O[0]} y={O[1]} r={26 + 8 * tauO} w={6} /><Lbl x={PT(-1, 0)[0] + 10} y={PT(0, -1)[1] - 6} t={tauLab} c={ROT} s={T.key} a="start" /></g> : null}
    </g>
  );
};
/** a small corner triad (oblique) with the active plane shaded: which wall we are looking at */
const WallTriad: React.FC<{ x: number; y: number; plane: "xy" | "yz" | "zx"; o?: number }> = ({ x, y, plane, o = 1 }) => {
  if (o <= 0) return null;
  const E: Record<string, Pt> = { x: [-50, 42], y: [90, 0], z: [0, -90] };
  const a = E[plane[0]], b = E[plane[1]];
  return (
    <g opacity={o}>
      <polygon points={`${x},${y} ${x + a[0]},${y + a[1]} ${x + a[0] + b[0]},${y + a[1] + b[1]} ${x + b[0]},${y + b[1]}`} fill={C.gold} fillOpacity={0.22} stroke={C.gold} strokeWidth={3} />
      {(["x", "y", "z"] as const).map((t) => <g key={t}><Arrow p={[x, y]} q={[x + E[t][0] * 1.25, y + E[t][1] * 1.25]} color={C.muted} w={5} head={16} halo={false} />
        <Lbl x={x + E[t][0] * 1.25 + (t === "x" ? -26 : t === "y" ? 30 : 0)} y={y + E[t][1] * 1.25 + (t === "z" ? -28 : 20)} t={t} c={C.key} s={T.key} a="middle" /></g>)}
    </g>
  );
};
const S21A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21a_minus_sign");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10);
  const Z = V5.z;
  const hiA = fin(f, t4, 12) * fout(f, t6, 12), hiB = fin(f, t6, 12) * fout(f, t8, 12);
  const arcA = easeIO(clamp((f - AT(k, 5, "anticlockwise")) / 30, 0, 1)), arcB = easeIO(clamp((f - AT(k, 7, "clockwise")) / 30, 0, 1));
  const TZ_L = EQ_TZ.split("=")[0], TZ_R = `= ${EQ_TZ.split("=")[1]}`;
  const TZP: Part[] = [{ t: TZ_R.replace(/^=\s*/, "").split("-")[0], c: ROT, u: { w: String.raw`\text{anticlockwise}`, c: ROT } }, { t: "-" },
    { t: TZ_R.replace(/^=\s*/, "").split("-")[1], c: C.neg, u: { w: String.raw`\text{clockwise}`, c: C.neg } }];
  if (`${TZ_L}=${plainOf(TZP).replace(/\s/g, "")}`.replace(/\s/g, "") !== EQ_TZ.replace(/\s/g, "")) throw new Error("s21a parts ≠ EQ_TZ");
  return (
    <Scene>
      <Svg>
        <MiniTorque f={f} h="x" v="y" out="z" arm={fin(f, 4, 14)} rO={fin(f, AT(k, 2, "Its arm, r"), 14)} push={fin(f, AT(k, 2, "the push, F"), 14)} split={fin(f, t3, 16)}
          hiA={hiA} hiB={hiB} arcA={arcA} arcB={arcB} tauO={fin(f, AT(k, 8, "five newton metres"), 16)} tauLab={`τ = (0, 0, ${sgnI(Z.tau[2])}) N m`} />
        <Keyword f={f} text="the minus sign?" at={[1100, 160]} appear={AT(k, 0, "the minus sign")} out={t2} targets={[]} />
        <Lbl x={1100} y={250} t="flat on the floor, seen from above" c={C.key} s={T.floor} o={fin(f, t1) * fout(f, t3)} />
        <Lbl x={1100} y={330} t="r = (0.2, 0.1, 0) m" c={C.first} s={T.key} o={fin(f, AT(k, 2, "Its arm, r")) * fout(f, t9 - 6)} />
        <Lbl x={1100} y={410} t="F = (10, 30, 0) N" c={C.second} s={T.key} o={fin(f, AT(k, 2, "the push, F")) * fout(f, t9 - 6)} />
        <Lbl x={1100} y={790} t="two little torques fight" c={C.key} s={T.key} o={fin(f, t8) * fout(f, t10 + 30)} />
        <Lbl x={1100} y={790} t="minus: opposite turns" c={C.neg} s={T.key} o={fin(f, AT(k, 10, "opposite directions"))} />
      </Svg>
      {/* fx1 (M1): each little torque is a true line, its sense written beside it (violet ↺ anticlockwise, rose ↻ clockwise);
          the subtraction comes only in the τ_z line */}
      <CalcStack f={f} x={1215} y={480} size={50} maxLines={3} rows={[
        { lhs: String.raw`\textcolor{${ROT}}{\circlearrowleft}`, rhs: String.raw`0.2\times30 = 6\ \ \text{anticlockwise}`, at: AT(k, 5, "point two times thirty"), h: 90, c: ROT },
        { lhs: String.raw`\textcolor{${C.neg}}{\circlearrowright}`, rhs: String.raw`0.1\times10 = 1\ \ \text{clockwise}`, at: AT(k, 7, "point one times ten"), h: 90, c: C.neg },
        { lhs: String.raw`\tau_z`, rhs: String.raw`= 6 - 1 = \mathbf{5}\ \mathrm{N\,m}`, at: AT(k, 8, "six minus one"), h: 90, c: C.key },
      ]} />
      <TeX s={TZ_L} x={1140} y={200} size={T.calc} ax={1} o={fin(f, t9)} />
      <Layered parts={[{ t: "=" }, ...TZP]} layers={[{ t: "all", o: 1 }, { u: [1, 3], o: fin(f, AT(k, 9, "minus the y part")) }]} x={1150} y={168} size={T.calc} ay={0} o={fin(f, t9)} />
    </Scene>
  );
};
const S21B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21b_x_component");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const X = V5.x;
  const hiA = fin(f, t3, 12) * fout(f, t5, 12), hiB = fin(f, t5, 12) * fout(f, t6, 12);
  const arcA = easeIO(clamp((f - AT(k, 4, "anticlockwise")) / 30, 0, 1)), arcB = easeIO(clamp((f - AT(k, 5, "turn it clockwise")) / 30, 0, 1));
  const [TX_L, TX_R] = splitEq(EQ_TX), TXP = eqPieces(TX_R);
  return (
    <Scene>
      <Svg>
        <MiniTorque f={f} h="y" v="z" out="x" wall={fin(f, 4)} arm={fin(f, 4, 14)} rO={fin(f, AT(k, 2, "the arm reaches"), 14)} push={fin(f, AT(k, 2, "the push has"), 14)}
          split={fin(f, t3 - 10, 14)} hiA={hiA} hiB={hiB} arcA={arcA} arcB={arcB} tauO={fin(f, AT(k, 6, "five newton metres"), 16)} tauLab={`τ = (${sgnI(X.tau[0])}, 0, 0) N m`} />
        <WallTriad x={880} y={245} plane="yz" o={fin(f, 4)} />
        <Keyword f={f} text="the x component, the same way" at={[1100, 150]} appear={AT(k, 0, "the x component")} out={AT(k, 1, "Turning about the x axis") - 6} targets={[]} />
        <Keyword f={f} text="turning about x → the y-z wall" at={[1100, 150]} appear={AT(k, 1, "Turning about the x axis")} out={t7} targets={[]} s={T.key} />
        <Lbl x={1100} y={250} t="r = (0, 0.2, 0.1) m" c={C.first} s={T.key} o={fin(f, AT(k, 2, "the arm reaches"))} />
        <Lbl x={1100} y={330} t="F = (0, 10, 30) N" c={C.second} s={T.key} o={fin(f, AT(k, 2, "the push has"))} />
        <Lbl x={1100} y={430} t="seen from the tip of x̂" c={C.key} s={T.floor} o={fin(f, AT(k, 4, "Seen from the tip of x hat"))} />
      </Svg>
      <CalcStack f={f} x={1240} y={500} size={46} maxLines={3} rows={[
        { lhs: String.raw`\textcolor{${ROT}}{\circlearrowleft}\ r_yF_z`, rhs: String.raw`= 0.2\times30 = 6\ \ \text{anticlockwise}`, at: AT(k, 4, "point two times thirty"), h: 84, c: ROT },
        { lhs: String.raw`\textcolor{${C.neg}}{\circlearrowright}\ r_zF_y`, rhs: String.raw`= 0.1\times10 = 1\ \ \text{clockwise}`, at: AT(k, 5, "point one times ten"), h: 84, c: C.neg },
        { lhs: String.raw`(\mathbf r\times\mathbf F)_x`, rhs: String.raw`= 6 - 1 = \mathbf{5}\ \mathrm{N\,m}`, at: AT(k, 6, "we subtract"), h: 84, c: C.key },
      ]} o={fout(f, t7 - 4)} />
      <CalcStack f={f} x={1340} y={520} size={T.key} maxLines={3} rows={[
        { lhs: TX_L, rhs: TXP[0], at: t7, h: 90 },
        { rhs: TXP[1], at: AT(k, 7, "minus the z part"), cont: true, h: 90 },
        { rhs: rep(TXP[2], "= 5", String.raw`= \mathbf{5}`), at: AT(k, 7, "minus the z part") + 30, cont: true, h: 90, c: C.key },
      ]} />
    </Scene>
  );
};
const DET_PARTS: Part[] = [{ t: String.raw`=\hat{\mathbf x}(r_yF_z-r_zF_y)` }, { t: String.raw`-\hat{\mathbf y}(r_xF_z-r_zF_x)` }, { t: String.raw`+\hat{\mathbf z}(r_xF_y-r_yF_x)` }];
const S21C: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21c_y_component");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const Y = V5.y;
  const pic = fout(f, t4, 16);
  const det = fin(f, t4 + 6, 16) * fout(f, t8 - 6, 14);
  const [DL, DR] = [EQ_DET.slice(0, EQ_DET.indexOf(String.raw`=\hat{\mathbf x}`)), EQ_DET.slice(EQ_DET.indexOf(String.raw`=\hat{\mathbf x}`))];
  if (plainOf(DET_PARTS).replace(/\s/g, "") !== DR.replace(/\s/g, "")) throw new Error("s21c parts ≠ EQ_DET");
  const arcA = easeIO(clamp((f - AT(k, 3, "point two times thirty")) / 30, 0, 1)), arcB = easeIO(clamp((f - AT(k, 3, "minus point one times ten")) / 30, 0, 1));
  return (
    <Scene>
      <Svg>
        <MiniTorque f={f} h="z" v="x" out="y" wall={1} o={pic} arm={fin(f, 8, 14)} push={fin(f, 16, 14)} split={fin(f, AT(k, 3, "a push of") + 20, 14)}
          hiA={fin(f, AT(k, 3, "point two times thirty"), 10) * fout(f, AT(k, 3, "five again") - 6, 10)} hiB={0} arcA={arcA} arcB={arcB} tauO={fin(f, AT(k, 3, "five again"), 16)} tauLab={`τ = (0, ${sgnI(Y.tau[1])}, 0) N m`} />
        <WallTriad x={880} y={245} plane="zx" o={pic * fin(f, 8)} />
        <CycleWheel x={1730 - 170 * easeIO(clamp((f - t4) / 16, 0, 1))} y={700 - 575 * easeIO(clamp((f - t4) / 16, 0, 1))} r={62} o={fin(f, AT(k, 1, "Following the cycle")) * fout(f, t8 - 6)} arcs={3} hi={f < AT(k, 1, "z comes before x") ? -1 : f < AT(k, 1, "z comes before x") + 30 ? 2 : 0} />
        <Lbl x={1100} y={150} t="turning about y → the z-x wall" c={C.key} s={T.key} o={fin(f, 6) * fout(f, t4 - 6)} />
        <Lbl x={1100} y={240} t="cycle: z before x" c={C.gold} s={T.key} o={fin(f, AT(k, 1, "z comes before x")) * fout(f, t4 - 6)} />
        <Keyword f={f} text="determinant" at={[1100, 150]} appear={AT(k, 4, "a determinant")} out={t8 - 6} targets={[]} />
        <Lbl x={1100} y={510} t="we only need what it gives" c={C.key} s={T.floor} o={fin(f, t5) * fout(f, t6)} />
        {/* s8 (fx1 S3): the one pattern as three mini walls, each with its own two turns: + violet anticlockwise, − rose clockwise */}
        <g opacity={fin(f, t8)}>
          {([["x ← (y, z)", "yz"], ["y ← (z, x)", "zx"], ["z ← (x, y)", "xy"]] as [string, "yz" | "zx" | "xy"][]).map(([r, pl], i) => {
            const y0 = 225 + 235 * i, cx = 820, cy = y0 - 10;
            const arcP = (r0: number, a0: number, a1: number) => Array.from({ length: 25 }, (_, j) => { const a = (a0 + ((a1 - a0) * j) / 24) * D2R; return `${cx + r0 * Math.cos(a)},${cy - r0 * Math.sin(a)}`; }).join(" ");
            const pO = fin(f, AT(k, 8, "a plus for the turn") + 6 * i), mO = fin(f, AT(k, 8, "a minus for the turn") + 6 * i);
            return <g key={r}>
              <WallTriad x={190} y={y0 + 20} plane={pl} />
              <Lbl x={380} y={y0 - 20} t={r} c={C.key} s={T.calc} />
              <polyline points={arcP(46, -30, 200)} fill="none" stroke={ROT} strokeWidth={7} opacity={pO} />
              <polyline points={`${cx + 46 * Math.cos(200 * D2R) + 16},${cy - 46 * Math.sin(200 * D2R) - 14} ${cx + 46 * Math.cos(200 * D2R)},${cy - 46 * Math.sin(200 * D2R)} ${cx + 46 * Math.cos(200 * D2R) + 20},${cy - 46 * Math.sin(200 * D2R) + 10}`} fill="none" stroke={ROT} strokeWidth={6} opacity={pO} />
              <polyline points={arcP(68, 160, -70)} fill="none" stroke={C.neg} strokeWidth={6} strokeDasharray="12 8" opacity={mO} />
              <Lbl x={cx - 110} y={cy} t="+" c={ROT} s={T.calc} a="middle" o={pO} />
              <Lbl x={cx + 110} y={cy} t="−" c={C.neg} s={T.calc} a="middle" o={mO} />
            </g>;
          })}
        </g>
        <Lbl x={1100} y={120} t="+ with the cycle" c={C.gold} s={T.key} o={fin(f, AT(k, 8, "a plus for the turn"))} />
        <Lbl x={1540} y={120} t="− against it" c={C.neg} s={T.key} o={fin(f, AT(k, 8, "a minus for the turn"))} />
      </Svg>
      <CalcStack f={f} x={1330} y={330} size={T.key} maxLines={3} rows={[
        { lhs: String.raw`(\mathbf r\times\mathbf F)_y`, rhs: String.raw`= r_zF_x - r_xF_z`, at: t2, h: 90 },
        { rhs: String.raw`= 0.2\times30 - 0.1\times10`, at: AT(k, 3, "point two times thirty"), h: 90 },
        { rhs: String.raw`= 6 - 1 = \mathbf{5}`, at: AT(k, 3, "six minus one"), h: 90, c: C.key },
      ]} o={fout(f, t4, 12)} />
      <TeX s={String.raw`(\mathbf r\times\mathbf F)_y = r_zF_x - r_xF_z`} x={1150} y={760} size={T.key} c={C.gold} o={fin(f, t4 + 6) * fout(f, t8 - 6)} />
      {([[String.raw`+\,r_yF_z`, String.raw`-\,r_zF_y`], [String.raw`+\,r_zF_x`, String.raw`-\,r_xF_z`], [String.raw`+\,r_xF_y`, String.raw`-\,r_yF_x`]]).map((r, i) => <React.Fragment key={i}>
        <TeX s={r[0]} x={1100} y={205 + 235 * i} size={T.calc} c={ROT} o={fin(f, t8 + 6 * i) * (0.45 + 0.55 * fin(f, AT(k, 8, "a plus for the turn") + 6 * i))} />
        <TeX s={r[1]} x={1540} y={205 + 235 * i} size={T.calc} c={C.neg} o={fin(f, t8 + 6 * i) * (0.45 + 0.55 * fin(f, AT(k, 8, "a minus for the turn") + 6 * i))} />
      </React.Fragment>)}
      <TeX s={DL} x={1100} y={345} size={T.calc} o={det} />
      {/* fx1 (S3): the expansion at the 68-px calculation size on two lines (the subscripts are the point of it) */}
      <Layered parts={DET_PARTS.slice(0, 2)} layers={[{ t: "all", o: 1 }, { t: [1], tc: { 1: C.gold }, o: fin(f, t6) }]} x={120} y={560} size={T.calc} ay={0.5} o={det} />
      <Layered parts={DET_PARTS.slice(2)} layers={[{ t: "all", o: 1 }]} x={120} y={660} size={T.calc} ay={0.5} o={det} />
      <TeX s={String.raw`-\hat{\mathbf y}(r_xF_z-r_zF_x) = \hat{\mathbf y}(r_zF_x-r_xF_z)`} x={120} y={760} size={T.key} c={C.gold} o={fin(f, AT(k, 7, "swaps the two products")) * fout(f, t8 - 6)} />
      <Svg><CurvedLink f={f} from={[975, 790]} to={[1140, 790]} start={AT(k, 7, "exactly our cycle order")} end={t8 - 6} bend={0} /></Svg>
    </Scene>
  );
};

// ---------------------------------------------------------------- s21d the ball brushed off centre: a tilted axis
const BALL_K: OrbitKey = { f: 0, az: 300, el: 22, dist: 11.5, target: [0, 0, 0.3], pp: [540, 510] };
const BS = 8; // display: 1 m = 8 units (arm); push 0.8 unit per N; torque 12 units per N m (each its own scale, numbers written)
/** seams on a ball turning about the unit axis n by angle `ang` (three great circles), front half only */
const BallSeams: React.FC<{ pr: Projector; R: number; n: V3; ang: number; o?: number; ctr?: V3 }> = ({ pr, R, n, ang, o = 1, ctr = [0, 0, 0] }) => {
  const rot = (v: V3): V3 => { // Rodrigues
    const c = Math.cos(ang), s = Math.sin(ang), d = dot3(n, v), x = cross3(n, v);
    return add3(add3(mul3(v, c), mul3(x, s)), mul3(n, d * (1 - c)));
  };
  const eye = sub3(pr.st.pos, ctr);
  const circles: V3[][] = [0, 1, 2].map((ci) => Array.from({ length: 73 }, (_, i) => {
    const a = (i / 72) * 2 * Math.PI;
    const v: V3 = ci === 0 ? [Math.cos(a), Math.sin(a), 0] : ci === 1 ? [Math.cos(a), 0, Math.sin(a)] : [0, Math.cos(a), Math.sin(a)];
    return mul3(rot(v), R);
  }));
  return (
    <g opacity={o}>
      {circles.map((cpts, ci) => {
        const segs: string[] = [];
        let cur: string[] = [];
        cpts.forEach((p) => { if (dot3(p, eye) > 0) { const q = pr.p(add3(ctr, p)); cur.push(`${q[0]},${q[1]}`); } else if (cur.length) { segs.push(cur.join(" ")); cur = []; } });
        if (cur.length) segs.push(cur.join(" "));
        return segs.map((sg, j) => <polyline key={`${ci}-${j}`} points={sg} fill="none" stroke={ci === 0 ? C.gold : C.key} strokeWidth={4} opacity={0.75} />);
      })}
    </g>
  );
};
const S21D: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21d_tilted_axis");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const B = V5.ball;
  const st = camOf([at(BALL_K, 0), { ...BALL_K, f: LEN(k), az: 330 }], f), pr = projector(st, W3, H3);
  const R = len3(B.r as V3) * BS;
  const r3 = mul3(B.r as V3, BS), F3 = mul3(B.F as V3, 0.8), n = B.axis as V3;
  const tx: V3 = [B.tau[0] * 9, 0, 0], tz: V3 = [0, 0, B.tau[2] * 9];
  const cx = fin(f, AT(k, 6, "minus point two"), 14), cz = fin(f, AT(k, 6, "and point two"), 14);
  const add = easeIO(clamp((f - AT(k, 7, "add up like any arrows")) / 30, 0, 1));
  const spinO = fin(f, AT(k, 7, "starts to spin"), 10);
  const ang = 2 * Math.PI * 0.35 * clamp((f - AT(k, 7, "starts to spin")) / FPS, 0, 99);
  const touch = add3([0, 0, 0], r3);
  const finger = easeIO(clamp((f - AT(k, 1, "brush your finger")) / 30, 0, 1));
  return (
    <Scene>
      <Svg><FloorGrid pr={pr} xr={[-2, 2]} yr={[-2, 2]} o={0.35} /></Svg>
      <View3D st={st}>
        {[0, 1, 2].map((i) => <Rod3D key={i} a={mul3(UNIT[i], -2.4)} b={mul3(UNIT[i], 3.0)} px={3} color={C.muted} o={0.6} />)}
        <Ball3D at={[0, 0, 0]} r={R} color="#5d6b8f" o={fin(f, 4, 14)} />
        <Arrow3D from={[0, 0, 0]} to={r3} color={C.first} grow={fin(f, AT(k, 2, "your finger, r"), 16)} onTop />
        <Arrow3D from={add3(touch, F3, -0.5 * (1 - finger))} to={add3(touch, F3, 1 - 0.5 * (1 - finger))} color={C.second} o={fin(f, AT(k, 1, "brush your finger"), 10)} onTop />
        <Arrow3D from={[0, 0, 0]} to={tx} color={C.neg} px={10} head={36} o={cx * (1 - 0.5 * add)} grow={cx} dash onTop />
        <Arrow3D from={add3([0, 0, 0], tx, add)} to={add3(tz, tx, add)} color={ROT} px={10} head={36} o={cz * (1 - 0.5 * add)} grow={cz} onTop />
        <Arrow3D from={[0, 0, 0]} to={add3(tx, tz)} color={ROT} px={14} head={46} o={add} grow={add} onTop />
        <Rod3D a={mul3(n, -1.6)} b={mul3(n, 3.2)} px={4} color={C.gold} o={0.8 * spinO} />
      </View3D>
      <Svg>
        <BallSeams pr={pr} R={R * 1.005} n={n} ang={ang} o={fin(f, 4, 14)} />
        {[["x", 3.3], ["y", 3.3], ["z", 3.3]].map(([t, L], i) => <L3 key={t as string} pr={pr} at={mul3(UNIT[i], L as number)} t={t as string} c={C.muted} s={T.key} />)}
        <TipL3 pr={pr} from={[0, 0, 0]} to={r3} t="r" c={C.first} s={T.calc} o={fin(f, AT(k, 2, "your finger, r"))} />
        <TipL3 pr={pr} from={touch} to={add3(touch, F3)} t="F" c={C.second} s={T.calc} o={fin(f, AT(k, 2, "your push, F"))} />
        <L3 pr={pr} at={tx} t="about x: −0.2" c={C.neg} s={T.floor} a="end" dx={-44} dy={74} o={cx * (1 - add)} />
        <L3 pr={pr} at={tz} t="about z: +0.2" c={ROT} s={T.floor} a="start" dx={30} o={cz * (1 - add)} />
        <L3 pr={pr} at={add3(tx, tz)} t="τ: tilted axis" c={ROT} s={T.key} a="end" dx={-30} dy={20} o={add} />
        <Lbl x={1100} y={150} t="all three together" c={C.key} s={T.key} o={fin(f, 6) * fout(f, t5 - 6)} />
        {([["(x, y) → about z", t3, "The x and y parts"], ["(y, z) → about x", t4, "The y and z parts"], ["(z, x) → about y", t4, "the z and x parts"]] as [string, number, string][]).map(([t, tt, ph], i) =>
          <Lbl key={t} x={1100} y={260 + 90 * i} t={t} c={C.key} s={T.key} o={fin(f, AT(k, i === 0 ? 3 : 4, ph)) * fout(f, t5 - 6)} />)}
        <Lbl x={1100} y={560} t="like the spanner on the floor" c={C.muted} s={T.floor} o={fin(f, AT(k, 3, "just like the spanner")) * fout(f, t5 - 6)} />
        <Lbl x={1100} y={260} t="r = (0.1, 0, 0.1) m" c={C.first} s={T.key} o={fin(f, AT(k, 5, "point one metres along x"))} />
        <Lbl x={1100} y={350} t="F = (0, 2, 0) N" c={C.second} s={T.key} o={fin(f, AT(k, 5, "two newtons along y"))} />
        <Lbl x={1100} y={600} t="spins about the tilted axis" c={C.gold} s={T.key} o={spinO} />
      </Svg>
      <TeX s={EQ_TBALL} x={1080} y={470} size={T.key} o={fin(f, t6)} glow={pulse(f, t6 + 10, 24)} />
    </Scene>
  );
};

// ---------------------------------------------------------------- s22w when to reach for the cross product
// fx1 (review 1 M2): no slide. Four mini-pictures from earlier scenes (door s03, spanner s20, ball on a string s22c, globe
// s24-s28); in each the first arrow is teal and the second orange, lit on their words in S3/S4; S5 shows the along/across
// picture (s18b/s18d) with the ⟂ result; S6 brings the four pictures back, each lit on its product. Schematic icons, no data.
const MINI4 = [{ x: 100, y: 80 }, { x: 560, y: 80 }, { x: 100, y: 470 }, { x: 560, y: 470 }];
// fix 2 (review 2 M4): no frames (house §5: no boxes); the lit picture is at full opacity, the others at 35 %, plus a gold pointer
// from its keyword (MINI_IN: where the pointer ends, on the picture's side facing the maths zone)
const MINI_IN: Pt[] = [[500, 175], [945, 212], [410, 572], [1000, 660]];
/** the pointer's control point: over the spanner's F (door), through the gap between the rows (ball), else a plain bend */
const miniTo = (i: number, from: Pt): Pt => (i === 0 && from[1] > 300 ? [455, 292] : MINI_IN[i]);
const miniCtl = (i: number, from: Pt): Pt | undefined => {
  const to = miniTo(i, from);
  if (i === 0 && from[1] <= 300) return [800, -10];
  if (i === 0) return [(4 * 705 - from[0] - to[0]) / 2, (4 * 415 - from[1] - to[1]) / 2];  // from below: through the gap between the rows
  // ball: through the gap between the rows, right of the spanner's r label from the upper keywords, left of it from the lower one
  if (i === 2) { const m: Pt = from[1] > 300 ? [705, 415] : [760, 418]; return [(4 * m[0] - from[0] - to[0]) / 2, (4 * m[1] - from[1] - to[1]) / 2]; }
  return undefined;
};
const MiniBox: React.FC<{ i: number; o: number; first: number; second: number; second2?: number }> = ({ i, o, first, second, second2 = 0 }) => {
  if (o <= 0) return null;
  const { x, y } = MINI4[i];
  const lit = (v: number) => 0.3 + 0.7 * v;
  const fr = null;
  if (i === 0) { // the door seen from above: hinge, r along the door to the hand, F at a right angle
    const H: Pt = [x + 70, y + 250], Hd: Pt = [x + 330, y + 250];
    return <g opacity={o}>{fr}
      <path d={`M ${x + 330} ${y + 250} A 260 260 0 0 0 ${x + 70 + 260 * Math.cos(-55 * D2R)} ${y + 250 + 260 * Math.sin(-55 * D2R)}`} fill="none" stroke={C.muted} strokeWidth={4} strokeDasharray="10 10" opacity={0.6} />
      <line x1={H[0]} y1={H[1]} x2={x + 360} y2={H[1]} stroke="#c9d2e3" strokeWidth={20} strokeLinecap="round" opacity={0.35} />
      <circle cx={H[0]} cy={H[1]} r={13} fill={C.gold} />
      <Arrow p={H} q={Hd} color={C.first} w={9} head={32} o={lit(first)} />
      <Lbl x={(H[0] + Hd[0]) / 2} y={H[1] + 58} t="r" c={C.first} s={T.calc} a="middle" o={lit(first)} />
      <Arrow p={Hd} q={[Hd[0], Hd[1] - 150]} color={C.second} w={9} head={32} o={lit(second)} />
      <Lbl x={Hd[0] + 26} y={Hd[1] - 120} t="F" c={C.second} s={T.calc} o={lit(second)} />
    </g>;
  }
  if (i === 1) { // the spanner on a bolt
    const B: Pt = [x + 90, y + 260], a = 22 * D2R, Hd: Pt = [B[0] + 240 * Math.cos(a), B[1] - 240 * Math.sin(a)];
    const Fq: Pt = [Hd[0] - 130 * Math.sin(a), Hd[1] - 130 * Math.cos(a)];
    return <g opacity={o}>{fr}
      <line x1={B[0]} y1={B[1]} x2={Hd[0] + 30 * Math.cos(a)} y2={Hd[1] - 30 * Math.sin(a)} stroke="#c9d2e3" strokeWidth={24} strokeLinecap="round" opacity={0.35} />
      <polygon points={Array.from({ length: 6 }, (_, j) => `${B[0] + 24 * Math.cos((j * Math.PI) / 3)},${B[1] + 24 * Math.sin((j * Math.PI) / 3)}`).join(" ")} fill="#3a4766" stroke="#c9d2e3" strokeWidth={4} />
      <Arrow p={B} q={Hd} color={C.first} w={9} head={32} o={lit(first)} />
      <Lbl x={(B[0] + Hd[0]) / 2 + 10} y={(B[1] + Hd[1]) / 2 + 62} t="r" c={C.first} s={T.calc} a="middle" o={lit(first)} />
      <Arrow p={Hd} q={Fq} color={C.second} w={9} head={32} o={lit(second)} />
      <Lbl x={Fq[0] + 26} y={Fq[1] + 10} t="F" c={C.second} s={T.calc} o={lit(second)} />
    </g>;
  }
  if (i === 2) { // a ball whirled on a string: r from the centre, momentum p along the circle
    const c0: Pt = [x + 170, y + 200], R = 120, th = 35 * D2R, b: Pt = [c0[0] + R * Math.cos(th), c0[1] - R * Math.sin(th)];
    const pq: Pt = [b[0] - 130 * Math.sin(th), b[1] - 130 * Math.cos(th)];
    return <g opacity={o}>{fr}
      <circle cx={c0[0]} cy={c0[1]} r={R} fill="none" stroke={C.muted} strokeWidth={3} strokeDasharray="8 8" opacity={0.7} />
      <circle cx={c0[0]} cy={c0[1]} r={9} fill={C.key} />
      <Arrow p={c0} q={b} color={C.first} w={9} head={30} o={lit(first)} />
      <Lbl x={(c0[0] + b[0]) / 2 + 6} y={(c0[1] + b[1]) / 2 + 52} t="r" c={C.first} s={T.calc} a="middle" o={lit(first)} />
      <circle cx={b[0]} cy={b[1]} r={17} fill={C.key} stroke={C.bg} strokeWidth={3} />
      <Arrow p={b} q={pq} color={C.second} w={9} head={30} o={lit(second)} />
      <Lbl x={pq[0] - 20} y={pq[1] - 26} t="p" c={C.second} s={T.calc} a="end" o={lit(second)} />
    </g>;
  }
  // the globe: the spin arrow Ω up the axis, a place r, the wind u there
  const c0: Pt = [x + 200, y + 205], R = 120, pl: Pt = [c0[0] + R * 0.68, c0[1] - R * 0.62];
  return <g opacity={o}>{fr}
    <GlobeIcon x={c0[0]} y={c0[1]} r={R} o={0.85} />
    <line x1={c0[0]} y1={c0[1] + R + 20} x2={c0[0]} y2={c0[1] - R} stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" opacity={0.7} />
    <Arrow p={[c0[0], c0[1] - R]} q={[c0[0], c0[1] - R - 110]} color={C.first} w={9} head={30} o={lit(first)} />
    <Lbl x={c0[0] + 24} y={c0[1] - R - 80} t="Ω" c={C.first} s={T.calc} o={lit(first)} />
    <Arrow p={c0} q={pl} color={C.second} w={8} head={28} o={lit(second2)} />
    <Lbl x={(c0[0] + pl[0]) / 2 + 22} y={(c0[1] + pl[1]) / 2 + 40} t="r" c={C.second} s={T.calc} o={lit(second2)} />
    <Arrow p={pl} q={[pl[0] + 120, pl[1] + 14]} color={C.second} w={8} head={28} o={lit(second)} />
    <Lbl x={pl[0] + 128} y={pl[1] - 30} t="u" c={C.second} s={T.calc} o={lit(second)} />
  </g>;
};
const S22W: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22w_when_to_use");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const nextP1 = A.sc[k].sentences[5].text.includes("in the next video");   // Part 1 says "in the next video", v5 "soon"
  const A2_ = (ph: string) => AT(k, 2, ph), A3_ = (ph: string) => AT(k, 3, ph), A5_ = (ph: string) => AT(k, 5, ph);
  const minis = fin(f, 6, 14) * fout(f, t4 - 4, 12) + fin(f, t5 - 4, 14);
  const back = fin(f, t5 - 4, 14);    // S6: every arrow lit again
  const firsts = [A2_("from a hinge"), A2_("a bolt"), A2_("the centre of a turn"), A2_("Earth's spin")];
  const seconds = [A3_("a push, F"), A3_("a push, F") + 8, A3_("a momentum"), A3_("the wind, u")];
  const his = [A5_("That's torque"), A5_("That's torque") + 6, A5_("angular momentum"), A5_("Omega cross r")];
  const pic = fin(f, t4, 14) * fout(f, t5 - 6, 10);
  const FT = P(...ALONG);
  // M4: the lit picture (on its word) stays at full opacity and the other three dim to 35 %; a gold pointer from the keyword
  const hiW = (a: number, n: number) => fin(f, a - 2, 8) * fout(f, a + n, 10);
  const HI = [0, 1, 2, 3].map((i) => Math.max(hiW(firsts[i], 26), hiW(seconds[i], 26), hiW(his[i], 34)));
  const dimOf = (i: number) => 1 - 0.65 * Math.max(...HI.filter((_, j) => j !== i)) * (1 - HI[i]);
  // the keyword each pointer starts from: S3 "first arrow", S4 "second arrow", S6 the product tiles
  const ptrFrom = (i: number): [Pt, number, number] => {
    const pick = [[firsts[i], 26, [1070, 180] as Pt], [seconds[i], 26, [1070, 470] as Pt], [his[i], 34, [1085, [180, 180, 280, 480][i]] as Pt]] as [number, number, Pt][];
    const cur = pick.find(([a, n]) => f >= a - 2 && f < a + n + 10) ?? pick[0];
    return [cur[2], cur[0], cur[0] + cur[1]];
  };
  const tile = (i: number, s: string, at0: number) =>
    <TeX key={i} s={s} x={1100} y={180 + 100 * i} size={T.key} ax={0} c={C.key} o={fin(f, at0) * fout(f, t6 - 6, 10)} />;
  return (
    <Scene>
      <TeX s={ctex(C.first, String.raw`\mathbf a`) + ctex(ROT, String.raw`\times`) + ctex(C.second, String.raw`\mathbf b`) + String.raw`\ ?`} x={1450} y={420} size={T.hero} ax={0.5} o={fin(f, 4) * fout(f, t2 - 6, 12)} />
      <Svg>
        {[0, 1, 2, 3].map((i) => <MiniBox key={i} i={i} o={minis * dimOf(i)} first={Math.max(back, fin(f, firsts[i]))} second={Math.max(back, fin(f, seconds[i]))}
          second2={Math.max(back, fin(f, A3_("the second is often a position")))} />)}
        {[0, 1, 2, 3].map((i) => { const [from, a, e] = ptrFrom(i);
          return HI[i] > 0 ? <CurvedLink key={`p${i}`} f={f} from={from} to={miniTo(i, from)} start={a - 2} end={e} bend={30} ctl={miniCtl(i, from)} o={minis} /> : null; })}
        {/* S5: the part of one arrow across the other, and the result at right angles to both (out of the floor: ⊙) */}
        <g opacity={pic}>
          <Grid P={P} xr={[-1, 6]} yr={[-1, 4]} o={0.6} />
          <Arrow p={O2} q={ATIP} color={C.first} o={0.6} />
          <Band p={O2} q={FT} color={C.first} o={0.5} />
          <Band p={FT} q={BTIP} color={ROT} o={0.85} />
          <Arrow p={O2} q={BTIP} color={C.second} />
          <RightTick at={FT} u1={unit(FT, O2)} u2={unit(FT, BTIP)} />
          <TipLabel p={PAIR_TIPS.a} c={C.first} /><TipLabel p={PAIR_TIPS.b} c={C.second} />
          <Lbl x={(FT[0] + BTIP[0]) / 2 + 60} y={(FT[1] + BTIP[1]) / 2} t="across" c={ROT} s={T.key} a="start" />
          <CircleDot x={O2[0]} y={O2[1]} r={30} w={6} o={fin(f, AT(k, 4, "a direction at right angles"))} />
          <Lbl x={O2[0] + 50} y={O2[1] + 74} t="a × b ⟂ both" c={ROT} s={T.key} a="start" o={fin(f, AT(k, 4, "a direction at right angles"))} />
        </g>
        {/* maths zone: keywords only, coloured like the arrows they name */}
        <g opacity={fout(f, t4 - 6, 10)}>
          <Lbl x={1080} y={180} t="first arrow" c={C.first} s={T.key} o={fin(f, t2)} />
          <Lbl x={1080} y={260} t="position · lever arm r" c={C.key} s={T.key} o={fin(f, A2_("a position or a lever arm"))} />
          <Lbl x={1080} y={340} t="or a spin arrow Ω" c={C.key} s={T.key} o={fin(f, A2_("a spin arrow"))} />
          <Lbl x={1080} y={470} t="second arrow" c={C.second} s={T.key} o={fin(f, t3)} />
          <Lbl x={1080} y={550} t="force F · momentum p · wind u" c={C.key} s={T.key} o={fin(f, A3_("a force or a velocity"))} />
          <Lbl x={1080} y={630} t="position r, when the first is a spin" c={C.key} s={T.floor} o={fin(f, A3_("the second is often a position"))} />
        </g>
        <g opacity={fout(f, t5 - 6, 10)}>
          <Keyword f={f} text="use it when you want:" at={[1080, 130]} appear={AT(k, 4, "Use the cross product")} targets={[]} c={C.gold} s={T.floor} />
          <Lbl x={1080} y={220} t="size: across × length" c={C.key} s={T.key} o={fin(f, AT(k, 4, "lies across the other"))} />
          <Lbl x={1080} y={320} t="direction ⟂ both" c={C.key} s={T.key} o={fin(f, AT(k, 4, "a direction at right angles"))} />
          <Lbl x={1080} y={420} t="the axis of a turn" c={ROT} s={T.key} o={fin(f, AT(k, 4, "the axis of a turn"))} />
          <Lbl x={1080} y={500} t="or the side of a push" c={ROT} s={T.key} o={fin(f, AT(k, 4, "the side towards which"))} />
        </g>
        <Lbl x={1500} y={530} t={nextP1 ? "next video" : "soon"} c={C.key} s={T.key} o={fin(f, A5_(nextP1 ? "in the next" : "and soon")) * fout(f, t6 - 6, 10)} />
      </Svg>
      {tile(0, String.raw`\boldsymbol\tau = \mathbf r\times\mathbf F`, A5_("That's torque"))}
      {tile(1, String.raw`\mathbf L = \mathbf r\times\mathbf p`, A5_("angular momentum"))}
      {tile(2, String.raw`q\,\mathbf v\times\mathbf B`, A5_("the push on a moving charge"))}
      {tile(3, String.raw`\boldsymbol\Omega\times\mathbf r`, A5_("Omega cross r"))}
      {tile(4, String.raw`-2\boldsymbol\Omega\times\mathbf u`, A5_("minus two Omega cross u"))}
      <TeX s={String.raw`\mathbf b\times\mathbf a = -\,\mathbf a\times\mathbf b`} x={1100} y={420} size={T.calc} ax={0} c={C.neg} o={fin(f, AT(k, 6, "swap the two arrows"))} />
    </Scene>
  );
};


// ================================================================================================ the split movies (v5 plan 3)
// Part 1 movies/ch00/ch00_cross_product (s00-s19 + s50, s51) and Part 2 movies/ch00/ch00_cross_product_uses (s00, s01,
// s01a-s01d + s23-s48). Same scene components, each movie with its own measured timing.json (tools/tts.py).

/** a ball turning about a tilted axis, drawn in a box (Part 1 title, Part B) */
const MiniBall: React.FC<{ f: number; box: { x: number; y: number; w: number; h: number }; o: number; ang: number }> = ({ box, o, ang }) => {
  const st = orbitCam({ ...BALL_K, dist: 7.4, pp: [box.w / 2, box.h / 2 + 10] }, [0, 0]);
  const pr = projector(st, box.w, box.h, box.x, box.y);
  const B = V5.ball, R = len3(B.r as V3) * BS, n = B.axis as V3;
  const tq = mul3(B.tau as V3, 12);
  if (o <= 0) return null;
  return (
    <>
      <View3D st={st} x={box.x} y={box.y} w={box.w} h={box.h} o={o}>
        <Ball3D at={[0, 0, 0]} r={R} color="#5d6b8f" />
        <Rod3D a={mul3(n, -3.2)} b={mul3(n, 3.6)} px={4} color={C.gold} o={0.8} />
        <Arrow3D from={[0, 0, 0]} to={tq} color={ROT} px={12} head={40} onTop />
      </View3D>
      <Svg o={o}><BallSeams pr={pr} R={R * 1.005} n={n} ang={ang} /><L3 pr={pr} at={tq} t="τ" c={ROT} s={T.calc} dx={-40} a="end" /></Svg>
    </>
  );
};
/** the door from above at an angle, with the push at the handle and the torque arrow up the hinge (Part 1 title) */
const MiniDoor: React.FC<{ f: number; box: { x: number; y: number; w: number; h: number }; o: number; swing: number; tau: number }> = ({ box, o, swing, tau }) => {
  const st = orbitCam({ ...DOOR_K, az: 250, el: 22, dist: 4.0, target: [0.5, 0.3, 1.25], pp: [box.w / 2 - 40, box.h / 2] }, [0, 0]);
  const pr = projector(st, box.w, box.h, box.x, box.y);
  const D = doorPts(swing);
  const Fv = D.R([0, 0.85, 0]);
  if (o <= 0) return null;
  return (
    <>
      <Svg o={o}><Seg3 pr={pr} a={[0, 0, -0.1]} b={[0, 0, 2.35]} c={C.gold} w={4} dash="14 10" /></Svg>
      <View3D st={st} x={box.x} y={box.y} w={box.w} h={box.h} o={o}>
        <Door3D swing={swing} />
        <Arrow3D from={D.hand} to={add3(D.hand, Fv)} color={C.second} />
        {tau > 0.02 ? <Arrow3D from={[0, 0, 2.05]} to={[0, 0, 2.05 + 0.5 * tau]} color={ROT} px={12} head={36} onTop /> : null}
      </View3D>
      <Svg o={o}><TipL3 pr={pr} from={D.hand} to={add3(D.hand, Fv)} t="F" c={C.second} s={T.key} />{tau > 0.3 ? <L3 pr={pr} at={[0, 0, 2.05 + 0.5 * tau]} t="τ" c={ROT} s={T.calc} dx={-36} a="end" /> : null}</Svg>
    </>
  );
};

// ---------------------------------------------------------------- Part 1 s00 title (physics) and s01 hook (turning)
const S00P1: React.FC = () => <TitleScene variant="p1" />;
const S01P1: React.FC = () => <HookScene variant="p1" />;

// ---------------------------------------------------------------- Part 1 s50 recap
const S50: React.FC = () => {
  const f = useCurrentFrame(), k = K("s50_recap");
  const t = Array.from({ length: 8 }, (_, j) => SS(k, j));
  const beat = (j: number, jEnd?: number) => fin(f, t[j] + (j === 0 ? 4 : 0), 10) * (jEnd !== undefined ? fout(f, t[jEnd] - 6, 10) : 1);
  const st = orbitCam({ az: 221, el: 28, dist: 15, target: [2.2, 1.3, 1.2], pp: [560, 430] }, PP);
  const prS = projector(st, W3, H3);
  const hp = handPlace(A3, [0, 0, 1], 1.4);
  const FT = P(...ALONG);
  const Q = (x: number, y: number): Pt => [x - 60, y];
  const pairO = Math.min(1, beat(0, 1) + beat(2, 3));
  return (
    <Scene>
      {pairO > 0 ? <div style={{ opacity: pairO }}>
        <PairFloor st={st} axb={1} para={beat(2, 3)}
          children={<Hand3D q={hp.q} at={hp.at} s={1.4} angles={POSE.curl(1)} o={beat(2, 3)} glow={{ thumb: ROT }} />}
          over={<>
            <Tick3 pr={prS} at={[0, 0, 0]} u1={AH} u2={[0, 0, 1]} s={0.55} o={beat(0, 1)} />
            <Tick3 pr={prS} at={[0, 0, 0]} u1={BH} u2={[0, 0, 1]} s={0.55} o={beat(0, 1)} />
            <TipL3 pr={prS} from={[0, 0, 0]} to={AXB3} t="a × b = (0, 0, 14)" c={ROT} s={T.key} />
          </>} />
      </div> : null}
      <PairTags o={beat(0, 1)} />
      <Svg>
        <g opacity={beat(1, 2)}>
          <polygon points={CORN.map((p) => Q(...p).join(",")).join(" ")} fill={ROT} fillOpacity={0.2} stroke={ROT} strokeWidth={3} />
          <Arrow p={Q(...O2)} q={Q(...ATIP)} color={C.first} />
          <Arrow p={Q(...O2)} q={Q(...BTIP)} color={C.second} o={0.5} />
          <Band p={Q(...FT)} q={Q(...BTIP)} color={ROT} o={0.8} />
          <Lbl x={Q(...FT)[0] - 30} y={(Q(...FT)[1] + Q(...BTIP)[1]) / 2} t="across" c={ROT} s={T.key} a="end" />
        </g>
        <g opacity={beat(3, 4)}>
          {([["x ← (y, z)", "yz"], ["y ← (z, x)", "zx"], ["z ← (x, y)", "xy"]] as [string, "yz" | "zx" | "xy"][]).map(([tt, pl], i) => <g key={tt}>
            <WallTriad x={190} y={230 + 230 * i} plane={pl} />
            <Lbl x={380} y={200 + 230 * i} t={tt} c={C.key} s={T.calc} />
            <Lbl x={380} y={270 + 230 * i} t="+ one turn − the other" c={C.muted} s={T.floor} />
          </g>)}
        </g>
        <g opacity={beat(4, 5)}>
          {[0, 1, 2].map((i) => {
            const x = 200 + 280 * i, y = 470, a = [0, 90, 180][i] * D2R;
            return <g key={i}><Arrow p={[x - 80, y]} q={[x + 60, y]} color={C.first} w={8} head={26} halo={false} />
              <Arrow p={[x - 80, y]} q={[x - 80 + 100 * Math.cos(a), y - 100 * Math.sin(a)]} color={C.second} w={8} head={26} halo={false} />
              <Lbl x={x - 10} y={y + 120} t={["0", "largest", "0"][i]} c={C.key} s={T.key} a="middle" /></g>;
          })}
          <Lbl x={200} y={720} t="swap → flips" c={C.neg} s={T.key} />
        </g>
        <g opacity={beat(5, 6)}>
          <Grid P={P} xr={[-1, 6]} yr={[-1, 4]} o={0.5} />
          <Arrow p={O2} q={ATIP} color={C.first} o={0.6} />
          <Band p={O2} q={FT} color={C.first} o={0.8} />
          <Band p={FT} q={BTIP} color={ROT} o={0.8} />
          <Arrow p={O2} q={BTIP} color={C.second} />
          <RightTick at={FT} u1={unit(FT, O2)} u2={unit(FT, BTIP)} />
          <Lbl x={FT[0] + 30} y={FT[1] + 66} t="along: dot" c={C.first} s={T.key} a="middle" />
          <Lbl x={(FT[0] + BTIP[0]) / 2 + 60} y={(FT[1] + BTIP[1]) / 2} t="across: cross" c={ROT} s={T.key} a="start" />
        </g>
        <g opacity={beat(6, 7)}>
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
        <g opacity={beat(7)}>
          <GlobeIcon x={480} y={440} r={190} o={0.7} />
          <path d="M 400 380 Q 500 360 560 430" fill="none" stroke={C.first} strokeWidth={9} />
          <polyline points="538,420 560,430 556,404" fill="none" stroke={C.first} strokeWidth={9} />
        </g>
      </Svg>
      <TeX s={String.raw`\mathbf a\times\mathbf b\ \perp\ \mathbf a,\ \mathbf b`} x={1150} y={300} size={T.calc} o={beat(0, 1)} />
      <TeX s={EQ_SIN} x={1080} y={300} size={T.calc} o={beat(1, 2)} />
      <TeX s={String.raw`= |\mathbf a|\times\text{across} = \text{area}`} x={1196} y={420} size={T.calc} c={ROT} o={beat(1, 2)} />
      <TeX s={EQ_TAU} x={1100} y={560} size={T.calc} o={beat(1, 2)} />
      <Svg>
        <Lbl x={1100} y={300} t="direction = the axis of the turn" c={C.key} s={T.key} o={beat(2, 3)} />
        <Lbl x={1100} y={400} t="from its tip: anticlockwise" c={C.gold} s={T.key} o={beat(2, 3)} />
        <Lbl x={1100} y={300} t="each component:" c={C.key} s={T.key} o={beat(3, 4)} />
        <Lbl x={1100} y={390} t="the turning about its axis" c={C.key} s={T.key} o={beat(3, 4)} />
        <Lbl x={1100} y={480} t="minus: opposite turns" c={C.neg} s={T.floor} o={beat(3, 4)} />
        <Lbl x={1100} y={300} t="along one line → 0" c={C.key} s={T.key} o={beat(4, 5)} />
        <Lbl x={1100} y={390} t="right angle → largest" c={C.key} s={T.key} o={beat(4, 5)} />
        <Lbl x={1100} y={480} t="swap the order → flips" c={C.neg} s={T.key} o={beat(4, 5)} />
        <Lbl x={1100} y={300} t="dot: the part along" c={C.first} s={T.key} o={beat(5, 6)} />
        <Lbl x={1100} y={390} t="cross: the part across" c={ROT} s={T.key} o={beat(5, 6)} />
        <Lbl x={1080} y={300} t="torque · angular momentum" c={C.key} s={T.key} o={beat(6, 7)} />
        <Lbl x={1080} y={380} t="the push on a moving charge" c={C.key} s={T.key} o={beat(6, 7)} />
        <Lbl x={1080} y={480} t="push ⟂ motion → turns, same speed" c={C.key} s={T.floor} o={beat(6, 7)} />
        <Lbl x={1100} y={300} t="next: the spinning Earth" c={C.key} s={T.key} o={beat(7)} />
        <Lbl x={1100} y={390} t="why the wind turns" c={C.key} s={T.key} o={beat(7)} />
        <Lbl x={1100} y={480} t="why storms spin" c={C.key} s={T.key} o={beat(7)} />
      </Svg>
    </Scene>
  );
};

// ---------------------------------------------------------------- Part 1 s51 series end card (maths ending, HOUSE_STYLE §3)
const S51: React.FC = () => <EndCard variant="maths" id="s51_end" />;

// ---------------------------------------------------------------- Part 2 s00 title (the cross product at work)
const TB2 = { x: 1130, y: 160, w: 710, h: 480 };
const S00P2: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  const tMet = AT(k, 0, "meteorology"), tEasy = AT(k, 0, "the easy way");
  const pzS = 1 + 0.06 * pulse(f, tEasy, 12);
  const oA = fin(f, 4, 10) * fout(f, tMet, 12), oB = fin(f, tMet, 12);
  // Part A: a disc spinning at ω = 2 rad/s (anticlockwise from above); the point at r = 0.3 m moves at ω × r (title_spin.json)
  const TS = titleSpin as { omega: number[]; r_m: number; phase: number[]; r: number[][]; v: number[][] };
  const u = ((f / FPS) * TS.omega[2] * 0.25 / (2 * Math.PI)) % 1;  // display: a quarter of the true rate
  const rr = idx(TS.r, u), vv = idx(TS.v, u);
  const cx = TB2.x + 330, cy = TB2.y + 260, S = 560;   // px per metre on the disc (ellipse: y squashed ×0.45)
  const pD = (x: number, y: number): Pt => [cx + x * S, cy - y * S * 0.45];
  const pt = pD(rr[0], rr[1]), vt = pD(rr[0] + vv[0] * 0.25, rr[1] + vv[1] * 0.25);
  // Part B: the mini globe, a parcel at 45°N curving right and one at 45°S curving left (data/paths.json, the s31 tracks)
  const hB = clamp((f - tMet) / (4 * FPS), 0, 1);
  const M = globeMatrix(-0.35 + 0.5 * clamp((f - tMet) / (LEN(k) - tMet), 0, 1), 23.4);
  const GB = { x: 1100, y: 100, w: 760, h: 660 };
  const gc = globeCam({ lat: 4, lon: -20, dist: 3.6, pp: [GB.w / 2, GB.h / 2] }, [0, 0]);
  const G = globeProj(gc, GB.w, GB.h, GB.x, GB.y, M);
  const tex = useTex(staticFile("cp/bmng.jpg"));
  const n = Math.max(2, Math.round(hB * 0.42 * (paths.nh_track.length - 1)));
  const nh = (paths.nh_track as number[][]).slice(0, n).map(([la, lo]) => [45 + (la - 45) * 14, -20 + (lo - (paths.nh_start as number[])[1]) * 14] as [number, number]);
  const sh = (paths.sh_track as number[][]).slice(0, n).map(([la, lo]) => [-45 + (la + 45) * 14, -20 + (lo - (paths.sh_start as number[])[1]) * 14] as [number, number]);
  return (
    <Scene fadeIn={false}>
      <Svg>
        <defs><TitleGradient id="ttl2" x1={100} x2={760} /></defs>
        <RiseText f={f} t="The cross" x={100} y={210} s={150} at={2} fill="url(#ttl2)" />
        <RiseText f={f} t="product" x={100} y={360} s={150} at={12} fill="url(#ttl2)" />
        <RiseText f={f} t="at work" x={100} y={510} s={150} at={22} fill="url(#ttl2)" />
        <g transform={`translate(104 ${620}) scale(${pzS}) translate(-104 ${-620})`}>
          <RiseText f={f} t="made easy" x={104} y={630} s={96} at={30} fill={C.key} />
        </g>
        <RiseText f={f} t="and how meteorology" x={106} y={735} s={68} at={44} fill={C.key} colors={(i) => (i >= 8 ? C.first : undefined)} />
        <RiseText f={f} t="uses it" x={106} y={815} s={68} at={54} fill={C.key} />
        <g opacity={oA}>
          <ellipse cx={cx} cy={cy} rx={0.42 * S} ry={0.42 * S * 0.45} fill="#24304b" stroke="#c9d2e3" strokeWidth={4} />
          {Array.from({ length: 8 }, (_, i) => { const a = 2 * Math.PI * u + (i * Math.PI) / 4; const q = pD(0.42 * Math.cos(a), 0.42 * Math.sin(a)); return <line key={i} x1={cx} y1={cy} x2={q[0]} y2={q[1]} stroke="#3e4b6c" strokeWidth={3} />; })}
          <Arrow p={[cx, cy]} q={[cx, cy - 190]} color={ROT} w={10} head={36} />
          <Lbl x={cx + 24} y={cy - 190} t="Ω" c={ROT} s={T.calc} />
          <Arrow p={[cx, cy]} q={pt} color={C.first} w={8} head={28} />
          <Arrow p={pt} q={vt} color={C.second} w={8} head={28} />
          <circle cx={pt[0]} cy={pt[1]} r={10} fill={C.gold} />
          <Lbl x={(cx + pt[0]) / 2} y={(cy + pt[1]) / 2 + 36} t="r" c={C.first} s={T.key} a="middle" />
          <Lbl x={1290} y={612} t={`= (${sgn(vv[0], 2)}, ${sgn(vv[1], 2)}, 0) m/s`} c={C.second} s={T.key} />
        </g>
        <defs><clipPath id="gbclip2"><rect x={GB.x} y={GB.y} width={GB.w} height={GB.h} /></clipPath></defs>
      </Svg>
      <TeX s={EQ_OXR0} x={1280} y={612} size={T.key} ax={1} c={C.ink} o={oA} />{/* fx1 (S1): capital Ω, as in the whole movie */}
      <View3D st={gc} x={GB.x} y={GB.y} w={GB.w} h={GB.h} o={tex ? oB : 0} key3={gc.pos} amb={1.6} dir={1.4}>
        <GlobeMesh tex={tex} M={M} />
      </View3D>
      <Svg>
        <g opacity={oB} clipPath="url(#gbclip2)">
          <path d={coastPath(G, ne110.coastline as number[][])} fill="none" stroke={C.key} strokeOpacity={0.4} strokeWidth={1.5} />
          {n > 2 ? <SurfArrow G={G} pts={nh} c={C.first} w={12} head={44} /> : null}
          {n > 2 ? <SurfArrow G={G} pts={sh} c={C.first} w={12} head={44} /> : null}
        </g>
      </Svg>
    </Scene>
  );
};

// ---------------------------------------------------------------- Part 2 s01 hook
const S01P2: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  const GB = { x: 80, y: 60, w: 920, h: 800 };
  const M = globeMatrix(-0.35 + 0.25 * clamp(f / LEN(k), 0, 1), 23.4);
  const gc = globeCam({ lat: 4, lon: -20, dist: 3.4, pp: [GB.w / 2, GB.h / 2] }, [0, 0]);
  const G = globeProj(gc, GB.w, GB.h, GB.x, GB.y, M);
  const tex = useTex(staticFile("cp/bmng.jpg"));
  const tAir = AT(k, 1, "why moving air turns");
  const hB = clamp((f - tAir) / (3 * FPS), 0, 1);
  const n = Math.max(2, Math.round(hB * 0.42 * (paths.nh_track.length - 1)));
  const nh = (paths.nh_track as number[][]).slice(0, n).map(([la, lo]) => [45 + (la - 45) * 7, -25 + (lo - (paths.nh_start as number[])[1]) * 7] as [number, number]);
  const sh = (paths.sh_track as number[][]).slice(0, n).map(([la, lo]) => [-45 + (la + 45) * 7, -25 + (lo - (paths.sh_start as number[])[1]) * 7] as [number, number]);
  const lowO = fin(f, AT(k, 1, "highs and lows"), 14);
  return (
    <Scene>
      <View3D st={gc} x={GB.x} y={GB.y} w={GB.w} h={GB.h} o={tex ? 1 : 0} key3={gc.pos} amb={1.6} dir={1.4}>
        <GlobeMesh tex={tex} M={M} />
      </View3D>
      <Svg>
        <defs><clipPath id="gbclip3"><rect x={GB.x} y={GB.y} width={GB.w} height={GB.h} /></clipPath></defs>
        <g clipPath="url(#gbclip3)">
          <path d={coastPath(G, ne110.coastline as number[][])} fill="none" stroke={C.key} strokeOpacity={0.4} strokeWidth={1.5} />
          {n > 2 ? <SurfArrow G={G} pts={nh} c={C.first} w={12} head={44} /> : null}
          {n > 2 ? <SurfArrow G={G} pts={sh} c={C.first} w={12} head={44} /> : null}
        </g>
        <Lbl x={1100} y={200} t="the spinning Earth" c={C.key} s={T.key} o={fin(f, AT(k, 1, "the spinning Earth"))} />
        <Lbl x={1100} y={300} t="moving air turns" c={C.key} s={T.key} o={fin(f, tAir)} />
        <Lbl x={1100} y={400} t="storms spin" c={C.key} s={T.key} o={fin(f, AT(k, 1, "why storms spin"))} />
        <Lbl x={1100} y={500} t="highs and lows" c={C.key} s={T.key} o={lowO} />
        <g opacity={0.85 * lowO}>
          {[60, 110, 160].map((r) => <circle key={r} cx={1560} cy={700} r={r} fill="none" stroke="#c9d2e3" strokeWidth={3} opacity={0.7} />)}
          <Lbl x={1560} y={700} t="L" c={C.key} s={T.calc} a="middle" />
          {[0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2; const p: Pt = [1560 + 135 * Math.cos(a), 700 - 135 * Math.sin(a)];
            const d: Pt = [-Math.sin(a), -Math.cos(a)]; return <Arrow key={i} p={add(p, d, -36)} q={add(p, d, 36)} color={ROT} w={7} head={22} halo={false} />; })}
        </g>
      </Svg>
      <Svg><Keyword f={f} text="the cross product in the weather?" s={T.floor} at={[1100, 200]} appear={AT(k, 0, "the cross product")} out={AT(k, 1, "the spinning Earth") - 8} targets={[]} /></Svg>
    </Scene>
  );
};

// ---------------------------------------------------------------- Part 2 s01a-s01d the recap of Part 1
// fx1 (review 1 M1): the recipe is restated in words and as three rows (x, y, z), the x and y rows worked to 0 and the z row to
// 14, each on its words; the "14" bracket sits on the far side of the a × b arrow (S8).
const REC_ROWS: [string, string, string, string][] = [   // label, recipe, worked numbers (EQ_CX, EQ_CY, EQ_CZ)
  ["x", String.raw`a_2b_3 - a_3b_2`, String.raw`= 1\times0 - 0\times3 = 0`, ""],
  ["y", String.raw`a_3b_1 - a_1b_3`, String.raw`= 0\times1 - 5\times0 = 0`, ""],
  ["z", String.raw`a_1b_2 - a_2b_1`, String.raw`= 5\times3 - 1\times1 = \mathbf{14}`, ""],
];
if (`${REC_ROWS[0][2]}`.replace(/\s/g, "") !== `=${EQ_CX}`.replace(/\s/g, "") || `${REC_ROWS[1][2]}`.replace(/\s/g, "") !== `=${EQ_CY}`.replace(/\s/g, "")) throw new Error("s01a rows ≠ EQ_CX/EQ_CY");
const S01A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01a_recap_arrow");
  const t1 = SS(k, 1);
  const st = camOf([{ ...FLOOR_K, f: 0, az: 235, el: 28, dist: 14.5, target: [2.2, 1.4, 1.5] }, { ...FLOOR_K, f: LEN(k), az: 215, el: 24, dist: 14.5, target: [2.2, 1.4, 1.5] }], f);
  const pr = projector(st, W3, H3);
  const g = fin(f, AT(k, 1, "two arrows lying flat"), 16);
  const up = easeIO(clamp((f - AT(k, 2, "is another arrow")) / 30, 0, 1));
  const rowO = [AT(k, 3, "leaves out its own direction"), AT(k, 3, "leaves out its own direction") + 12, AT(k, 3, "leaves out its own direction") + 24];
  const numO = [AT(k, 5, "every product has a zero"), AT(k, 5, "every product has a zero") + 16, AT(k, 4, "five times three")];
  const RY = [440, 530, 620];
  return (
    <Scene>
      <PairFloor st={st} gA={g} gB={g} axb={up} over={<>
        <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} o={g} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} o={g} />
        <TipL3 pr={pr} from={[0, 0, 0]} to={AXB3} t="a × b" c={ROT} s={T.key} o={fin(f, AT(k, 2, "a cross b") + 10)} />
        <Tick3 pr={pr} at={[0, 0, 0]} u1={AH} u2={[0, 0, 1]} s={0.55} o={fin(f, AT(k, 2, "at right angles to both"))} />
        <Tick3 pr={pr} at={[0, 0, 0]} u1={BH} u2={[0, 0, 1]} s={0.55} o={fin(f, AT(k, 2, "at right angles to both"))} />
        <Bracket3 pr={pr} h={AXB3[2]} o={fin(f, AT(k, 5, "fourteen units long"))} off={[0.32, -0.22, 0]} lf={0.78} />
      </>} />
      <Svg>
        <Keyword f={f} text="a quick reminder" at={[1100, 160]} appear={AT(k, 0, "a quick reminder")} out={t1 + 20} targets={[]} />
        <Lbl x={1100} y={250} t="dot: a number" c={C.local} s={T.key} o={fin(f, AT(k, 2, "which gives a number"))} />
        <Lbl x={1100} y={330} t="cross: an arrow ⟂ both" c={ROT} s={T.key} o={fin(f, AT(k, 2, "is another arrow"))} />
        {REC_ROWS.map(([lab], i) => <Lbl key={lab} x={1100} y={RY[i]} t={`${lab}:`} c={i === 2 ? ROT : C.key} s={T.key} o={fin(f, rowO[i])} />)}
        <Keyword f={f} text="the recipe" at={[1500, 160]} appear={AT(k, 3, "the recipe")} targets={[]} c={C.gold} />
      </Svg>
      {/* each row: the recipe, then its numbers in place (a \phantom keeps the recipe's position fixed) */}
      {REC_ROWS.map(([, rec, num], i) => <React.Fragment key={i}>
        <TeX s={`${rec}\\ \\phantom{${num}}`} x={1165} y={RY[i]} size={46} c={i === 2 ? ROT : C.ink} o={fin(f, rowO[i])} />
        <TeX s={`\\phantom{${rec}}\\ ${num}`} x={1165} y={RY[i]} size={46} c={i === 2 ? C.key : C.ink} o={fin(f, numO[i])} />
      </React.Fragment>)}
      <PairTags o={fin(f, AT(k, 1, "components five, one and zero"))} />
      <TeX s={ABXB} x={1100} y={740} size={T.calc} o={fin(f, AT(k, 5, "points straight up"))} glow={pulse(f, AT(k, 5, "points straight up") + 10, 24)} />
    </Scene>
  );
};
const S01B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01b_recap_length");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4);
  const FT = P(...ALONG);
  const split = fin(f, AT(k, 1, "Split b"), 16);
  const alongDim = 1 - 0.7 * fin(f, t4, 12);
  return (
    <Scene>
      <Svg>
        <Grid P={P} xr={[-1, 6]} yr={[-1, 4]} o={0.8} />
        <polygon points={CORN.map((p) => p.join(",")).join(" ")} fill={ROT} fillOpacity={0.18 * fin(f, t3)} stroke={ROT} strokeWidth={3} strokeOpacity={fin(f, t3)} />
        <Dash p={P(-1, -0.2)} q={P(6, 1.2)} c={C.first} o={0.35} w={3} d="14 10" />
        <Arrow p={O2} q={ATIP} color={C.first} />
        <Arrow p={O2} q={BTIP} color={C.second} o={1 - 0.4 * split} />
        <Band p={O2} q={FT} color={C.first} o={0.8 * split * alongDim} />
        <Band p={FT} q={BTIP} color={ROT} o={0.8 * split} />
        <RightTick at={FT} u1={unit(FT, O2)} u2={unit(FT, BTIP)} o={split} />
        <Lbl x={FT[0] + 40} y={FT[1] + 64} t="along" c={C.first} s={T.key} a="middle" o={split * alongDim} />
        <Lbl x={(FT[0] + BTIP[0]) / 2 + 74} y={(FT[1] + BTIP[1]) / 2} t={f >= AT(k, 2, "two point seven five") ? "across ≈ 2.75" : "across"} c={ROT} s={T.key} a="start" o={split} />
        <Bracket p={O2} q={ATIP} off={-46} c={C.gold} o={fin(f, AT(k, 2, "The length of vector a"))} />
        <Lbl x={ATIP[0] - 40} y={ATIP[1] + 80} t={f >= AT(k, 2, "five point one") ? "|a| ≈ 5.1" : "|a|"} c={C.gold} s={T.key} a="end" o={fin(f, AT(k, 2, "two bars"))} />
        <TipLabel p={PAIR_TIPS.a} c={C.first} /><TipLabel p={PAIR_TIPS.b} c={C.second} />
        <Keyword f={f} text="its length" at={[1100, 160]} appear={6} out={t1} targets={[]} />
        <Lbl x={1100} y={260} t="along a + across a = b" c={C.key} s={T.key} o={fin(f, t1 + 20)} />
        <Lbl x={1100} y={720} t="along: 0" c={C.first} s={T.key} o={fin(f, t4)} />
      </Svg>
      <CalcStack f={f} x={1420} y={400} size={T.calc} rows={[
        { lhs: String.raw`|\mathbf a\times\mathbf b|`, rhs: String.raw`= 5.1\times2.75`, at: AT(k, 3, "Their product"), h: 100 },
        { rhs: String.raw`\approx \mathbf{14} = \text{area}`, at: AT(k, 3, "about fourteen"), cont: true, c: C.key, h: 100 },
      ]} />
      <PairTags two />
    </Scene>
  );
};
const OU: V3 = [2.2, -2.6, 0];   // s01c: the corner where the unit vectors stand
const S01C: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01c_recap_direction");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4);
  const st = camOf([at(RH11_K, 0)], f);
  const pr = projector(st, W3, H3);
  const s = 2.2;
  const q = handQuat(A3, [0, 0, 1]);
  const pos = add3(mul3(AH, -0.3 * s), [0, 0, 0.37 * s]);
  const curl = CURL11 * easeIO(clamp((f - AT(k, 1, "curl them")) / 40, 0, 1));
  const thumbUp = easeIO(clamp((f - t2) / 24, 0, 1));
  const handO = fin(f, 4, 14) * fout(f, t3 + 20, 14);
  const uG = [fin(f, AT(k, 3, "x hat cross y hat"), 14), fin(f, AT(k, 3, "x hat cross y hat") + 12, 14), fin(f, AT(k, 3, "is z hat"), 14)];
  return (
    <Scene>
      <PairFloor st={st} axb={easeIO(clamp((f - t2 - 4) / 24, 0, 1))} bTop
        under={<Arc3 pr={pr} c0={[0, 0, 0]} e1={[1, 0, 0]} e2={[0, 1, 0]} r={2.6} a0={ANG_A} a1={ANG_B} col={C.gold} draw={clamp((f - AT(k, 1, "the short way round")) / 30, 0, 1)} w={4} />}
        children={<>
          <Hand3D q={q} at={pos} s={s} angles={POSE.curl(curl)} thumb={thumbUp} o={handO} glow={{ thumb: thumbUp > 0 ? ROT : undefined }} glowK={thumbUp} />
          {/* fx1 (Part 2 S5): the unit vectors, one unit long, from their own corner of the floor */}
          {[0, 1, 2].map((i) => <Arrow3D key={i} from={OU} to={add3(OU, mul3(UNIT[i], 1.6))} color={C.ink} px={8} head={30} grow={uG[i]} o={uG[i]} />)}
        </>}
        over={<>
          <TipL3 pr={pr} from={[0, 0, 0]} to={A3} t="a" c={C.first} s={T.calc} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={B3} t="b" c={C.second} s={T.calc} gap={34} />
          <TipL3 pr={pr} from={[0, 0, 0]} to={AXB3} t="a × b" c={ROT} s={T.key} o={fin(f, t2 + 24)} />
          {["x̂", "ŷ", "ẑ"].map((tt, i) => <TipL3 key={tt} pr={pr} from={OU} to={add3(OU, mul3(UNIT[i], 1.6))} t={tt} c={C.ink} s={T.key} o={uG[i]} />)}
          <L3 pr={pr} at={[6.4, 0, 0]} t="x" c={C.key} s={T.key} o={fin(f, AT(k, 3, "unit vectors"))} />
          <L3 pr={pr} at={[0, 4.4, 0]} t="y" c={C.key} s={T.key} o={fin(f, AT(k, 3, "unit vectors"))} />
        </>} />
      <Svg>
        <Keyword f={f} text="right-hand rule" at={[1100, 160]} appear={AT(k, 0, "right-hand rule")} out={t3} targets={[]} />
        <Lbl x={1100} y={270} t="fingers → first, curl → second" c={C.key} s={T.floor} o={fin(f, t1 + 10) * fout(f, t3)} />
        <Lbl x={1100} y={350} t="thumb → a × b: up" c={ROT} s={T.key} o={fin(f, t2) * fout(f, t3)} />
        <CycleWheel x={1700} y={300} r={70} o={fin(f, t3)} arcs={clamp((f - t3) / 40, 0, 3)} hi={-1} />
        <CycleWheel x={1700} y={640} r={70} o={fin(f, t4)} arcs={clamp((f - t4) / 40, 0, 3)} hi={-1} rev />
        <Lbl x={1700} y={650} t="−" c={C.neg} s={T.calc} a="middle" o={fin(f, t4 + 40)} />
      </Svg>
      <TeX s={EQ_XY} x={1100} y={180} size={T.key} c={C.key} o={fin(f, AT(k, 3, "x hat cross y hat"))} />
      <TeX s={EQ_YZ} x={1100} y={270} size={T.key} c={C.key} o={fin(f, AT(k, 3, "y hat cross z hat"))} />
      <TeX s={EQ_ZX} x={1100} y={360} size={T.key} c={C.key} o={fin(f, AT(k, 3, "z hat cross x hat"))} />
      <TeX s={EQ_ANTI} x={1100} y={540} size={T.key} c={C.key} o={fin(f, AT(k, 4, "b cross a"))} />
      <TeX s={EQ_XZ} x={1100} y={640} size={T.key} c={C.key} o={fin(f, AT(k, 4, "x hat cross z hat"))} />
    </Scene>
  );
};
// fx1 (review 1 M2, M3, S6): "proton" said and labelled; the push arrow drawn on "at a right angle to the motion"; one kick,
// then ten kicks (one per beat, the arrow keeping its length), then the smooth circle on "into a circle". The kicked path is
// the regular polygon whose corners lie on the tested inertial circle (examples.json kicks.circle_xy_km, fluidpy
// inertial_oscillation): between kicks the parcel goes straight; each kick turns it by 36° (ten kicks per turn).
const S01D: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01d_recap_push");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3);
  const KK = examples.kicks as unknown as { circle_xy_km: number[][]; circle_uv: number[][] };
  const cxy = KK.circle_xy_km, cuv = KK.circle_uv, N = cxy.length - 1;
  const C0: Pt = [540, 450], R = 230, Rk = 100;
  const toS = (p: number[]): Pt => [C0[0] + (p[0] / Rk) * R, C0[1] - ((p[1] - Rk) / Rk) * R];
  const NK = 10, V = Array.from({ length: NK + 1 }, (_, j) => toS(cxy[Math.round((j * N) / NK) % N]));
  const tKick = AT(k, 2, "Many small sideways kicks"), tTen = AT(k, 2, "each at a right angle"), tCirc = AT(k, 2, "into a circle");
  // edges drawn: the first edge while S2 ends (the parcel moves straight), one kick on "Many small sideways kicks", then the
  // other nine kicks evenly up to "into a circle"
  const eStep = (tCirc - 6 - tTen) / (NK - 1);
  const kicksDone = f < tKick ? 0 : f < tTen ? 1 : Math.min(NK, 1 + Math.floor((f - tTen) / eStep) + 1);
  const edgeFrac = f < tKick ? clamp((f - (t1 + 10)) / Math.max(1, tKick - t1 - 10), 0, 1) : clamp(f < tTen ? (f - tKick) / Math.max(1, tTen - tKick) : ((f - tTen) % eStep) / eStep, 0, 1);
  const nE = Math.min(NK, kicksDone);   // edges finished
  const curA = V[nE], curB = V[Math.min(NK, nE + 1)];
  const head: Pt = nE >= NK ? V[NK] : [curA[0] + (curB[0] - curA[0]) * edgeFrac, curA[1] + (curB[1] - curA[1]) * edgeFrac];
  const dirE = (j: number): Pt => { const a = V[j], b = V[Math.min(NK, j + 1)]; const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / L, (b[1] - a[1]) / L]; };
  const uDir = dirE(Math.min(NK - 1, nE));
  const UL = 120, PL = 90;
  const polyO = fin(f, 6, 12) * (1 - 0.7 * fin(f, tCirc, 16));   // the parcel and its motion are there from the first frame
  const circ = fin(f, tCirc, 16);
  const ph = clamp((f - tCirc - 10) / (LEN(k) - tCirc - 30), 0, 1);
  const pq = idx(cxy, ph), uq = idx(cuv, ph);
  const pp: Pt = toS(pq);
  const trace = Array.from({ length: Math.max(2, Math.round(ph * N) + 1) }, (_, i) => toS(cxy[i]).join(",")).join(" ");
  const pushO = fin(f, AT(k, 1, "at a right angle to the motion"), 10);
  const kickFlash = (j: number) => pulse(f, j === 1 ? tKick : tTen + (j - 2) * eStep, 18);
  const ch = examples.charge as { circle_xy: number[][]; centre: number[] };
  const cc = ch.centre;
  return (
    <Scene>
      <Svg>
        <Grid P={mkP(120, 820, 80)} xr={[0, 11]} yr={[0, 9]} o={0.35} />
        {/* the kicked path: straight edges, a corner (a kick) at each vertex */}
        <g opacity={polyO}>
          <circle cx={C0[0]} cy={C0[1]} r={R} fill="none" stroke={C.muted} strokeWidth={3} strokeDasharray="10 10" opacity={0.5 * fin(f, tTen)} />
          {nE > 0 ? <polyline points={V.slice(0, nE + 1).map((p) => p.join(",")).join(" ")} fill="none" stroke={C.first} strokeWidth={5} opacity={0.75} /> : null}
          <line x1={curA[0]} y1={curA[1]} x2={head[0]} y2={head[1]} stroke={C.first} strokeWidth={5} opacity={nE >= NK ? 0 : 0.75} />
          {Array.from({ length: Math.min(nE, NK) }, (_, j0) => j0 + 1).map((j) => {
            const v = V[j % NK], n0 = dirE(j - 1), n1 = dirE(Math.min(NK - 1, j));
            const kd: Pt = [n1[0] - n0[0], n1[1] - n0[1]], L = Math.hypot(...kd) || 1;
            return <Arrow key={j} p={v} q={[v[0] + (kd[0] / L) * 70, v[1] + (kd[1] / L) * 70]} color={C.second} w={7} head={24} halo={false} o={0.45 + 0.55 * kickFlash(j)} />;
          })}
          {nE < NK ? <>
            <Arrow p={head} q={[head[0] + uDir[0] * UL, head[1] + uDir[1] * UL]} color={C.first} />
            <Arrow p={head} q={[head[0] + uDir[1] * PL, head[1] - uDir[0] * PL]} color={C.second} w={8} head={30} o={pushO} />
            <RightTick at={head} u1={uDir} u2={[uDir[1], -uDir[0]]} c={C.gold} o={pushO} />
            <circle cx={head[0]} cy={head[1]} r={11} fill={C.key} stroke={C.bg} strokeWidth={3} />
          </> : null}
          <Lbl x={140} y={110} t="u: the motion" c={C.first} s={T.key} o={fin(f, t1) * fout(f, tCirc)} />
          <Lbl x={140} y={180} t="push ⟂ u" c={C.second} s={T.key} o={pushO * fout(f, tCirc)} />
        </g>
        <Lbl x={C0[0]} y={C0[1] + 6} t={`${Math.max(1, nE)} kick${nE <= 1 ? "" : "s"}`} c={C.second} s={T.key} a="middle" o={fin(f, tKick) * fout(f, tCirc)} />
        <g opacity={circ}>
          <polyline points={trace} fill="none" stroke={C.gold} strokeWidth={5} />
          <Arrow p={pp} q={[pp[0] + uq[0] * 13, pp[1] - uq[1] * 13]} color={C.first} />
          <Arrow p={pp} q={[pp[0] + (-uq[1]) * 9, pp[1] - uq[0] * 9]} color={C.second} w={8} head={30} />
          <RightTick at={pp} u1={unit(pp, [pp[0] + uq[0], pp[1] - uq[1]])} u2={unit(pp, [pp[0] - uq[1], pp[1] - uq[0]])} c={C.gold} />
          <circle cx={pp[0]} cy={pp[1]} r={11} fill={C.key} stroke={C.bg} strokeWidth={3} />
          <Lbl x={C0[0]} y={C0[1] + R + 90} t="same speed all the way round" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 3, "the speed stays the same"))} />
        </g>
        {/* the proton circling in a magnetic field (s22d), faint, on "a magnet's push on a moving proton" */}
        <g opacity={0.8 * fin(f, AT(k, 1, "a magnet's push")) * fout(f, t2)}>
          <polyline points={(ch.circle_xy).map((p) => `${1640 + (p[0] - cc[0]) * 80},${650 - (p[1] - cc[1]) * 80}`).join(" ")} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" />
          {(() => { const q = idx(ch.circle_xy, ((Math.max(0, f - AT(k, 1, "a magnet's push")) / 120) % 1)); const x = 1640 + (q[0] - cc[0]) * 80, y = 650 - (q[1] - cc[1]) * 80;
            return <g><circle cx={x} cy={y} r={30} fill={C.key} /><line x1={x - 14} y1={y} x2={x + 14} y2={y} stroke={C.bg} strokeWidth={6} /><line x1={x} y1={y - 14} x2={x} y2={y + 14} stroke={C.bg} strokeWidth={6} /></g>; })()}
          <Lbl x={1640} y={790} t="proton" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "a moving proton"))} />
        </g>
        <Keyword f={f} text="one more idea" at={[1100, 160]} appear={AT(k, 0, "One more idea")} out={t1} targets={[]} />
        <Lbl x={1100} y={260} t="push ⟂ motion" c={C.key} s={T.key} o={fin(f, AT(k, 1, "at a right angle to the motion"))} />
        <Lbl x={1100} y={350} t="no speeding up, no slowing down" c={C.key} s={T.floor} o={fin(f, AT(k, 1, "never speeds anything up"))} />
        <Lbl x={1100} y={600} t="no work: no energy given" c={C.key} s={T.key} o={fin(f, AT(k, 3, "it does no work"))} />
        <Lbl x={1100} y={680} t="F: the push" c={C.second} s={T.floor} o={fin(f, AT(k, 3, "This push, F"))} />
      </Svg>
      <TeX s={EQ_FU0} x={1100} y={480} size={T.eq} o={fin(f, AT(k, 3, "a dot product of zero"))} glow={pulse(f, AT(k, 3, "a dot product of zero") + 10, 24)} />
    </Scene>
  );
};

// ================================================================ data-source lines (HOUSE_STYLE §5, user 2026-10-28, U-WB-R1)
// One small muted line at the bottom of the picture on every frame that shows real data; not spoken. Dataset, time and place
// from the manifests and data files (ian.json scan 2022-09-28T18:01, HRRR 18 UTC; idai.json VIIRS 2019-03-14 + ERA5 12 UTC;
// storm.json ERA5 2023-11-02T12, MODIS Aqua 2023-11-02; winds_mean.json NCEP/NCAR R1 1991-2020; cp/bmng*.jpg Blue Marble NG).
// No coloured data field is drawn (globe pictures are true-colour images, Ian/Idai/Ciarán are lines and streaks), so no colour bar.
const SRC_BM = "Image: NASA Blue Marble Next Generation";
const SRC_NCEP = "Data: NCEP/NCAR Reanalysis 1 (NOAA PSL) · 10 m wind, mean 1991–2020 · Image: NASA Blue Marble";
const SRC_IAN_IMG = "Image: NOAA GOES-16 · 28 Sep 2022, 18:01 UTC · Hurricane Ian, Florida · globe: NASA Blue Marble";
const SRC_IAN = "Image: NOAA GOES-16 · Data: NOAA HRRR 10 m wind · 28 Sep 2022, 18 UTC · Hurricane Ian, Florida";
const SRC_IDAI = "Image: NASA VIIRS · Data: ERA5 (Copernicus C3S) 10 m wind · 14 Mar 2019, 12 UTC · Cyclone Idai, Mozambique";
const SRC_BOTH = "Ian: GOES-16 + NOAA HRRR, 28 Sep 2022, 18 UTC · Idai: NASA VIIRS + ERA5 (Copernicus C3S), 14 Mar 2019, 12 UTC";
const SRC_IMGS = "Images: NOAA GOES-16 (Ian, 28 Sep 2022) · NASA VIIRS (Idai, 14 Mar 2019)";
const SRC_CIARAN = "Data: ERA5 (Copernicus C3S) · 2 Nov 2023, 12 UTC · Storm Ciarán · coast: Natural Earth";
const SRC_CIARAN_IMG = "Data: ERA5 (Copernicus C3S), 2 Nov 2023, 12 UTC · Image: NASA MODIS Aqua, 2 Nov 2023 · Storm Ciarán · coast: Natural Earth";
/** per scene: the lines and their opacity at scene frame f (k = the scene index in the active timing) */
const SOURCES: Record<string, (f: number, k: number) => [string, number][]> = {
  s00_title: (f, k) => (A === ACT_P1 ? [] : [[SRC_BM, fin(f, AT(k, 0, "meteorology"), 12)]]),
  s01_hook: () => (A === ACT_P2 ? [[SRC_BM, 1]] : []),
  s23_k_cross: () => [[SRC_BM, 1]], s23a_why_turn: () => [[SRC_BM, 1]], s24_spin: () => [[SRC_BM, 1]], s25a_position_vector: () => [[SRC_BM, 1]],
  s25_ground_speed: () => [[SRC_BM, 1]], s25b_direction: () => [[SRC_BM, 1]], s26_coriolis_effect: () => [[SRC_BM, 1]], s28a_local_axes: () => [[SRC_BM, 1]],
  s28b_components: () => [[SRC_BM, 1]], s28c_flat_part: () => [[SRC_BM, 1]], s28_f: () => [[SRC_BM, 1]], s29_turn_rule: () => [[SRC_BM, 1]],
  s30_coriolis_size: () => [[SRC_BM, 1]], s31_globe_paths: () => [[SRC_BM, 1]],
  s27c_centrifugal_earth: () => [[SRC_BM, 1]], s27d_centrifugal_size: () => [[SRC_BM, 1]], s27e_effective_gravity: () => [[SRC_BM, 1]],
  s27g_three_traces: (f, k) => [[SRC_BM + " · gravity: WGS 84 normal gravity", fin(f, SS(k, 1), 12) * fout(f, SS(k, 5) - 6, 12)], [SRC_BM, fin(f, SS(k, 11) + 10, 24)]],
  s32_reanalysis: () => [[SRC_NCEP, 1]], s33_trades: () => [[SRC_NCEP, 1]], s34_westerlies: () => [[SRC_NCEP, 1]],
  s35_storms: () => [[SRC_IAN_IMG, 1]], s36_ian: () => [[SRC_IAN, 1]], s37_idai: (f, k) => (f < SS(k, 6) ? [[SRC_IDAI, 1]] : [[SRC_BOTH, 1]]),   // fix 2 (M3): both storms' credit from the thumbnails' first frame s38_spin_sign: () => [[SRC_BOTH, 1]],
  s45_storm_map: (f, k) => { const m = fin(f, SS(k, 1) - 20, 24); return [[SRC_BM, 1 - m], [SRC_CIARAN, m]]; },
  s46_real_winds: () => [[SRC_CIARAN_IMG, 1]],
  s47_recap: (f, k) => {
    const S = A.sc[k].sentences, si = (ph: string) => S.findIndex((x) => x.text.includes(ph));
    const iFlat = si("For flat winds"), iGeo = si("the geostrophic wind");
    const b = (j: number, e?: number) => fin(f, SS(k, j), 10) * (e !== undefined ? fout(f, SS(k, e) - 6, 10) : 1);
    return [[SRC_IMGS, b(iFlat, iGeo)], [SRC_CIARAN, b(iGeo)]];
  },
};
const SourceLine: React.FC<{ id: string }> = ({ id }) => {
  const f = useCurrentFrame();
  const fn = SOURCES[id];
  if (!fn) return null;
  const k = K(id);
  const fade = (k > 0 ? fin(f, 0, XF) : 1) * fout(f, LEN(k), XF);
  return (
    <Svg>
      {fn(f, k).map(([t, o], i) => (o * fade <= 0 ? null : <text key={i} x={80} y={852} fill={C.muted} fontSize={30} fontFamily={FONT} fontWeight={600} stroke={C.bg} strokeWidth={6} strokeLinejoin="round" paintOrder="stroke" opacity={o * fade}>{t}</text>))}
    </Svg>
  );
};

// @@SCENES-CONTINUE@@

const SCENE_BY_ID: Record<string, React.FC> = {
  s00_title: S00, s01_hook: S01, s02_dot_recall: S02, s03_door: S03, s04_left_right: S04, s05_axes: S05, s06_recipe: S06, s07_worked: S07,
  s08_sine: S08, s09_area: S09, s09a_box_proof: S09A, s10_right_angles: S10, s11_rhr_curl: S11, s12_rhr_flat: S12, s13_rhr_screw: S13,
  s14_rhr_cycle: S14, s15_rhr_swap: S15, s15a_index_form: S15A, s16_rhr_screen: S16, s17_rhr_views: S17, s18_cases: S18,
  s18a_why_question: S18A, s18b_across_part: S18B, s18d_two_parts: S18D, s18c_slide: S18C, s20_torque: S20, s21_torque_axis: S21,
  s21a_minus_sign: S21A, s21b_x_component: S21B, s21c_y_component: S21C, s21d_tilted_axis: S21D, s22_door_again: S22,
  s22a_plane_normal: S22A, s22b_component_shadows: S22B, s22c_angular_momentum: S22C, s22d_moving_charge: S22D, s22e_perp_push: S22E,
  s22w_when_to_use: S22W, s19_grid: S19, s23_k_cross: S23, s23a_why_turn: S23A, s24_spin: S24, s25a_position_vector: S25A,
  s25_ground_speed: S25, s25b_direction: S25B, s26_coriolis_effect: S26, s26a_merry_go_round: S26A, s26b_two_views: S26B,
  s26c_carried_arrow: S26C, s26d_new_ground: S26D, s27_coriolis_term: S27, s27a_minus_check: S27A, s28a_local_axes: S28A,
  s26a1_rule: S26A1, s26e_rule_again: S26E, s26f_collect: S26F, s27b_centrifugal: S27B, s27c_centrifugal_earth: S27C, s27d_centrifugal_size: S27D,
  s27e_effective_gravity: S27E, s27f_level_sea: S27F, s27g_three_traces: S27G,
  s28b_components: S28B, s28c_flat_part: S28C, s28_f: S28F, s29_turn_rule: S29, s30_coriolis_size: S30, s31_globe_paths: S31,
  s32_reanalysis: S32, s33_trades: S33, s34_westerlies: S34, s35_storms: S35, s36_ian: S36, s37_idai: S37, s38_spin_sign: S38,
  s39_isobars: S39, s40_pressure_push: S40, s40a_k_cross_gradp: S40A, s41_adjust: S41, s41a_balance: S41A, s42_geo_equation: S42,
  s43_geo_pieces: S43, s44_geo_numbers: S44, s45_storm_map: S45, s46_real_winds: S46, s47_recap: S47, s48_end: S48,
};
/** per movie: its timing and its scene components (Part 1 and Part 2 replace s00/s01 and add their own scenes) */
const MOVIES = {
  v5: { act: ACT_V5, over: {} as Record<string, React.FC> },
  p1: { act: ACT_P1, over: { s00_title: S00P1, s01_hook: S01P1, s50_recap: S50, s51_end: S51 } as Record<string, React.FC> },
  p2: { act: ACT_P2, over: { s00_title: S00P2, s01_hook: S01P2, s01a_recap_arrow: S01A, s01b_recap_length: S01B, s01c_recap_direction: S01C,
    s01d_recap_push: S01D } as Record<string, React.FC> },
};
for (const [name, m] of Object.entries(MOVIES)) for (const s of m.act.sc) if (!m.over[s.id] && !SCENE_BY_ID[s.id]) throw new Error(`${name}: no component for ${s.id}`);
const Movie: React.FC<{ which: keyof typeof MOVIES; audio: string; bbox?: boolean }> = ({ which, audio, bbox = false }) => {
  const m = MOVIES[which];
  A = m.act; // the active timing for every scene of this composition (one composition per render tab)
  const n = m.act.sc.length;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {bbox ? <BoxProbe /> : null}
      {m.act.sc.map((sc0, k) => {
        const S = m.over[sc0.id] ?? SCENE_BY_ID[sc0.id];
        return <Sequence key={sc0.id} name={sc0.id} from={m.act.CUT[k]} durationInFrames={m.act.END[k] - m.act.CUT[k] + (k < n - 1 ? XF : 0)}><S /><SourceLine id={sc0.id} /></Sequence>;
      })}
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};
export const CrossProductWhy: React.FC<{ audio?: string; bbox?: boolean }> = ({ audio = "narration_music.wav", bbox = false }) => <Movie which="v5" audio={audio} bbox={bbox} />;
export const CrossProductPart1: React.FC<{ audio?: string; bbox?: boolean }> = ({ audio = "narration_music_p1.wav", bbox = false }) => <Movie which="p1" audio={audio} bbox={bbox} />;
export const CrossProductPart2: React.FC<{ audio?: string; bbox?: boolean }> = ({ audio = "narration_music_p2.wav", bbox = false }) => <Movie which="p2" audio={audio} bbox={bbox} />;
