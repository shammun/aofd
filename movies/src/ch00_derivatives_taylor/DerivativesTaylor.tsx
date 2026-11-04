import React from "react";
import { AbsoluteFill, Audio, Sequence, random, staticFile, useCurrentFrame } from "remotion";
import { PoleThermometer } from "../house";
import { C, T } from "../house/kit/type";
import { Arrow, Band, Bracket, Dash, Lbl, Pt, Strike, Svg, clamp, lerp, pulse, textW } from "../house/kit/draw";
import { CalcStack, Layered, Part, TeX, rep } from "../house/kit/tex";
import { Keyword } from "../house/kit/notes";
import { CurvedLink, SunGlyph } from "../house/kit/extras";
import { RiseText, TitleGradient } from "../house/kit/title";
import { Check, Droplet, Notebook } from "../house/kit/icons";
import { GProj, GlobeCam, GlobeMesh, coastPath, gcDest, globeCam, globePath, globeProj, useBin } from "./kit_dt/globe";
import { Arrow3D, Ball3D, Quad3D, Rod3D, View3D } from "./kit_dt/three3d";
import { Parcel3D, ParcelBox3D, BoxEdges3D } from "./kit_dt/box3d";
import { Box3D } from "./kit_dt/col3d";
import { V3, orbitCam, orbitPath, projector, Projector } from "./kit_dt/cam";
import { MapBox, Terrain, linesPath, lutCss, mapP } from "./kit_dt/wb";
import { useTex } from "./kit_dt/globe";
import {
  AT, Ax, Axes, BGP, BOX, BREST, BROWN, Barometer, CUT, Car, ClipRect, ClockText, ColourBar, Cross, Curve, D, DT_FRAMES, END, FPS, GBOX, GeoImg, Globe, IMGS,
  Iso, K, LEN, LUT_B, LUT_T, MapView, Place, Plane, Proj, SE, SS, SUMC, Scene, Sonde, SrcLine, TRAP, Thermo, XF, axP, axX, axY, boxAt, ease, fin, fout, mix, nf,
  poly, prog, sc, win, FieldSphere,
} from "./dt_lib";
// fix loop 2: the shared house kit (HOUSE_STYLE §5b; built by the weather-basics UF2 work; imported, never edited here)
import { Callout, GlobeFrame, SourceBelow } from "../house/kit/frame";
import { LayerStack3D, StackLayer, useLayerTex } from "../house/kit/stack3d";
import { View3D as HView3D, Rod3D as HRod3D } from "../house/kit/three3d";
import { OrbitKey, orbitCam as hOrbitCam, orbitPath as hOrbitPath, projector as hProjector } from "../house/kit/cam";
import { AnimatedWindArrow } from "../house/kit/wind";
import { BoxProbe } from "../house/kit/bbox";
import { assertColumnEdges } from "../house/kit/col3d";
import { silhouetteR } from "../house/kit/globecam";
import { bracketMid } from "../house/kit/draw";

/**
 * Chapter-0 movie #4 "Derivatives and Taylor series: the rate a balloon feels, and why the saturation vapour pressure of water
 * rises about 7 % per degree" (movies/ch00/ch00_derivatives_taylor/storyboard.yaml v1, 49 scenes), 1920×1080, 30 fps;
 * length = timing.json + 2.5-s hold. House style movies/HOUSE_STYLE.md (reference ch00_dot_product_why v6): one title (s00),
 * keywords not sentences, no boxes, no references, pictures end at y 820 (source band at y 860), caption band empty, text
 * ≥ 44 px, reveals on their words (AT). Two real moments carry the movie: 18 UTC 1 Nov 2023 at Brest (ERA5 850 hPa + the
 * Brest SYNOP) and the Trappes radiosonde of 12 UTC 30 Sep 2026 (IGRA2). Every number and every moving or coloured thing
 * comes from data/dt.json (movies/data/build_ch00_derivatives_taylor.py, tested fluidpy functions, 97 CHECK rows); this
 * file only indexes and interpolates. Easy-number diagrams (x², the car road, e^x, sin x) are said as such in the narration.
 */
export { DT_FRAMES };
export const DT_FPS = FPS;

// ---------------------------------------------------------------- equations (verbatim from the storyboard)
const EQ_S00 = String.raw`T(z_0+h)\approx T(z_0)+h\,\frac{dT}{dz}`;
const EQ_S02 = String.raw`\frac{14.9-10.3}{2}=\frac{4.6}{2}=2.3\ ^{\circ}\mathrm{C/h}`;
const EQ_S03 = String.raw`\frac{df}{dx}=\lim_{h\to 0}\frac{f(x+h)-f(x)}{h},\qquad \frac{d}{dx}x^2=2x`;
const EQ_S04 = String.raw`T(x,\,y,\,z,\,t)`;
const EQ_S05 = String.raw`\frac{\partial T}{\partial x}`;
const EQ_S06 = String.raw`T=10-0.03\,x+3\,t:\quad \frac{\partial T}{\partial x}=-0.03,\quad \frac{\partial T}{\partial t}=3`;
const EQ_S07 = String.raw`\frac{\partial T}{\partial x}\approx\frac{T_{i+1}-T_{i-1}}{2\,\Delta x}`;
const EQ_S08 = String.raw`\frac{\partial T}{\partial t}\approx+2.9\ ^{\circ}\mathrm{C/h},\qquad \frac{\partial p}{\partial t}\approx-5\ \mathrm{hPa/h}`;
const EQ_S09 = String.raw`\frac{\partial T}{\partial z}\approx\frac{-24.1}{4.26}\approx-5.7\ ^{\circ}\mathrm{C/km},\qquad \Gamma=-\frac{\partial T}{\partial z}`;
const EQ_S10 = String.raw`\frac{\partial}{\partial t}\!\left(\frac{\partial T}{\partial x}\right)=\frac{\partial}{\partial x}\!\left(\frac{\partial T}{\partial t}\right)`;
const EQ_S11 = String.raw`dT=\frac{\partial T}{\partial x}dx+\frac{\partial T}{\partial y}dy+\frac{\partial T}{\partial z}dz+\frac{\partial T}{\partial t}dt`;
const EQ_S12 = String.raw`dT\approx(-0.032)(10)+(-0.025)(20)+(2.9)(0.5)\approx+0.63\ ^{\circ}\mathrm{C}`;
const EQ_S13 = String.raw`\frac{dT}{dt}=\frac{\partial T}{\partial t}+\frac{dX}{dt}\frac{\partial T}{\partial x}+\frac{dY}{dt}\frac{\partial T}{\partial y}+\frac{dZ}{dt}\frac{\partial T}{\partial z}`;
const EQ_S14 = String.raw`\underbrace{\frac{\partial T}{\partial t}}_{\text{fixed place}}+\underbrace{\frac{dX_j}{dt}\frac{\partial T}{\partial x_j}}_{\text{speed}\times\text{slope}}`;
const EQ_S15 = String.raw`\frac{dT}{dt}=0+100\ \tfrac{\mathrm{km}}{\mathrm{h}}\times\left(-0.03\ \tfrac{^{\circ}\mathrm C}{\mathrm{km}}\right)=-3\ ^{\circ}\mathrm{C/h}`;
const EQ_S16 = String.raw`\frac{dT}{dt}=+2.9+(100)(-3.2\times10^{-5})(3600)\approx+2.9-11.5=-8.6\ ^{\circ}\mathrm{C/h}`;
const EQ_S17 = String.raw`\frac{dT}{dt}=+2.9+11.5\approx+14.4\ ^{\circ}\mathrm{C/h}`;
const EQ_S18 = String.raw`\frac{dZ}{dt}\approx\frac{4260\ \mathrm m}{900\ \mathrm s}\approx4.7\ \mathrm{m/s},\qquad \frac{dT}{dt}\approx\frac{-24.1}{900}\approx-0.027\ ^{\circ}\mathrm{C/s}`;
const EQ_S19 = String.raw`\frac{dT}{dt}=\underbrace{\frac{\partial T}{\partial t}}_{-6\times10^{-5}}+\underbrace{u\frac{\partial T}{\partial x}+v\frac{\partial T}{\partial y}}_{\approx-3\times10^{-5}}+\underbrace{w\frac{\partial T}{\partial z}}_{-0.027}`;
const EQ_S20 = String.raw`\frac{DT}{Dt}=\frac{\partial T}{\partial t}+\mathbf u\cdot\nabla T\approx2.9-3.7\approx-0.8\ ^{\circ}\mathrm{C/h}`;
const EQ_S21 = String.raw`\frac{\partial T}{\partial p}=\frac{\partial T}{\partial z}\,\frac{\partial z}{\partial p}\approx(-5.7\times10^{-3})(-12.2)\approx+0.069\ ^{\circ}\mathrm{C/hPa}`;
const EQ_S23 = String.raw`\frac{\partial M}{\partial y}=\frac{\partial N}{\partial x};\qquad \oint (y\,dx-x\,dy)=-2`;
const EQ_S24 = String.raw`p=\rho RT,\qquad dp=RT\,d\rho+\rho R\,dT,\qquad \frac{dp}{p}=\frac{d\rho}{\rho}+\frac{dT}{T}`;
const EQ_S25 = String.raw`\frac{d\rho}{\rho}=-\frac{dT}{T}=-\frac{10}{290}\approx-3.4\,\%`;
const EQ_S26 = String.raw`\frac{\partial p}{\partial z}=-\rho g\ \Rightarrow\ \frac{dp}{p}=-\frac{dz}{H},\quad H=\frac{RT}{g}\approx\frac{287\times293}{9.81}\approx8570\ \mathrm m`;
const EQ_S27 = String.raw`p=p_0\,e^{-z/H}`;
const EQ_S28 = String.raw`dI=đQ+đW`;
const EQ_S29 = String.raw`đQ=c_v\,dT+p\,d\alpha,\qquad d\eta=\frac{đQ}{T}=c_v\frac{dT}{T}+R\frac{d\alpha}{\alpha}`;
const EQ_S31 = String.raw`T(z_0+h)\approx T(z_0)+h\,\frac{dT}{dz}`;
const EQ_S32 = String.raw`f(x_0+h)=f(x_0)+h\,f'(x_0)+\frac{h^2}{2!}f''(x_0)+\frac{h^3}{3!}f'''(x_0)+\cdots`;
const EQ_S33 = String.raw`e^{h}=1+h+\frac{h^2}{2}+\frac{h^3}{6}+\cdots`;
const EQ_S34 = String.raw`p\approx p_0\Big(1-\frac{z}{H}+\frac{z^2}{2H^2}\Big),\qquad \frac{p_0}{H}=\rho_0 g`;
const EQ_S35 = String.raw`p_0e^{-z/H}:\ 343\to558\to511\to\cdots\to517;\qquad \bar T=277\ \mathrm K:\ 499`;
const EQ_S38 = String.raw`f(x_0+\delta)\approx f(x_0)+f'(x_0)\,\delta`;
const EQ_S39 = String.raw`\frac{de_s}{dT}=\frac{L\,e_s}{R_v\,T^2}`;
const EQ_S40 = String.raw`\frac{1}{e_s}\frac{de_s}{dT}=\frac{L}{R_vT^2}\approx\frac{2.5\times10^{6}}{462\times273^2}\approx0.073\ \mathrm{K^{-1}}`;
const EQ_S42 = String.raw`F=\sigma T^4,\qquad \frac{dF}{dT}=4\sigma T^3=\frac{4F}{T}\approx\frac{4\times240}{255}\approx3.8\ \mathrm{W\,m^{-2}\,K^{-1}}`;
const EQ_S43 = String.raw`\Delta T\approx\frac{3.9}{3.8}\approx1.04\ ^{\circ}\mathrm C`;
const EQ_S44 = String.raw`\frac{f(x+h)-f(x)}{h}=f'(x)+\frac{h}{2}f''(x)+\cdots`;
const EQ_S45 = String.raw`\frac{f(x+h)-f(x-h)}{2h}=f'(x)+\frac{h^2}{6}f'''(x)+\cdots`;
/** split a storyboard constant at a marker that must exist (so the shown pieces never drift from the constant) */
const cut2 = (s: string, at: string): [string, string] => { const i = s.indexOf(at); if (i < 0) throw new Error(`cut2: ${at} not in ${s}`); return [s.slice(0, i), s.slice(i + at.length)]; };

// ---------------------------------------------------------------- numbers on screen = the data (fail the render otherwise)
const E8 = D.e850, SN = D.snd, CC = D.cc, RD = D.rad, FDX = D.fd;
const CHECK: [string, number, number, number][] = [
  ["T18 brest", D.isd.T18, 10.3, 1e-9], ["T20", D.isd.T20, 14.9, 1e-9], ["slp17", D.isd.slp17, 988.3, 1e-9], ["slp18", D.isd.slp18, 983.3, 1e-9],
  ["sec1", D.secant.slope[0], 7, 1e-9], ["sec2", D.secant.slope[1], 6.1, 1e-9], ["sec3", D.secant.slope[2], 6.01, 1e-9],
  ["dTdx", E8.dTdx_100km, -3.2, 0.02], ["dTdy", E8.dTdy_100km, -2.49, 0.02], ["dx km", E8.dx_km, 18.4, 0.05], ["dTdt", E8.dTdt, 2.92, 0.02],
  ["T17", E8.pt["17"], 2.4, 0.05], ["T18", E8.pt["18"], 5.1, 0.05], ["T19", E8.pt["19"], 8.2, 0.05], ["mixed", E8.mixed, 1.43, 0.01],
  ["td1", E8.td.terms[0], -0.32, 1e-9], ["td2", E8.td.terms[1], -0.5, 1e-9], ["td3", E8.td.terms[2], 1.45, 1e-9], ["td sum", E8.td.sum, 0.63, 1e-9],
  ["plane E", E8.plane.east, -8.6, 0.01], ["plane W", E8.plane.west, 14.45, 0.01], ["move", E8.plane.move, -11.53, 0.01],
  ["adv", E8.adv_Kh, -3.68, 0.05], ["DTDt", E8.DTDt, -0.76, 0.05],
  ["w", SN.w, 4.736, 0.01], ["dTdt b", SN.dTdt * 60, -1.607, 0.002], ["dTdz", SN.dTdz_km, -5.655, 0.005], ["dzdp", SN.dzdp, -12.18, 0.01], ["dTdp", SN.dTdp, 0.0689, 2e-4],
  ["dT12", SN.dT12, -2.59, 0.02], ["fixed", SN.fixed * 1e5, -5.98, 0.05], ["side", Math.abs(SN.side) * 1e5, 3.3, 0.6], ["share", SN.share, 0.996, 0.004],
  ["drift E", SN.drift.E, 7.8, 0.05], ["drift N", SN.drift.N, 14.6, 0.05], ["trop z", SN.trop.z, 13072, 1], ["trop T", SN.trop.T, -66.3, 0.01],
  ["slope", SN.slope, -4.86, 0.005], ["lin1", SN.lin1, 7.44, 0.01], ["meas1", SN.meas1, 6.87, 0.01], ["lin4", SN.lin4, -8.41, 0.01],
  ["H", SN.H, 8570, 1], ["rho0", SN.rho0, 1.186, 1e-3], ["tp1 line", SN.tp1[1], 880.4, 0.05], ["tp1 bend", SN.tp1[2], 887.3, 0.05], ["tp1 cub", SN.tp1[3], 887.0, 0.05],
  ["tp5 l", SN.tp5[1], 342.6, 0.05], ["tp5 b", SN.tp5[2], 557.6, 0.05], ["tp5 c", SN.tp5[3], 510.5, 0.05], ["pe5", SN.pe5, 517.3, 0.05], ["Tbar", SN.Tbar, 277.4, 0.1], ["p_tb", SN.p_tb, 498.7, 0.05],
  ["q1", D.routes.one.q, 26.79, 0.01], ["q2", D.routes.two.q, 32.59, 0.01], ["q3", D.routes.three.q, 40.19, 0.01], ["ds", D.routes.one.ds, 116.39, 0.01],
  ["es0", CC.es3[0], 6.19, 0.01], ["es15", CC.es3[1], 16.92, 0.01], ["es30", CC.es3[2], 41.91, 0.01], ["r0", CC.rates[0], 7.26, 0.01], ["r15", CC.rates[1], 6.43, 0.01],
  ["r30", CC.rates[2], 5.72, 0.01], ["ex1", CC.ex1, 7.5, 0.01], ["ex4", CC.ex4, 33.11, 0.01], ["lin1cc", CC.lin1, 7.26, 0.01], ["lin4cc", CC.lin4, 29.02, 0.01],
  ["Te", RD.Te, 255.06, 0.01], ["lam", RD.lam, 3.764, 0.001], ["b1", RD.b1, 3.786, 0.001], ["b10", RD.b10, 39.91, 0.01], ["gm", RD.gm, 240.6, 0.05],
  ["fwd", FDX.forward, -3.319, 0.002], ["bwd", FDX.backward, -3.086, 0.002], ["ctr", FDX.centred, -3.202, 0.002], ["c2", FDX.coarse[0], -3.168, 0.002],
  ["c4", FDX.coarse[1], -3.14, 0.002], ["c8", FDX.coarse[2], -2.238, 0.002], ["c12", FDX.coarse[3], -0.984, 0.002], ["ef", FDX.ef, -0.04294, 1e-5], ["ec", FDX.ec, -0.0009001, 1e-7],
  ["gain", D.hill.gain, 135.5, 0.5], ["Lst", D.hill.Lst, 3.99, 0.01], ["Lw", D.hill.Lw, 8.98, 0.01],
  // fix 1: the numbers the new narration says
  ["gain shown", D.hill.summit[2] - D.hill.park[2], 135, 0.5], ["dT planck", RD.dT_planck, 1.04, 0.005], ["warm", CC.warm, 1.26, 1e-9],
  ["corners", E8.corners.TR - E8.corners.TL - E8.corners.BR + E8.corners.BL, 0.37, 0.005], ["2dx", 2 * E8.dx_km, 36.8, 0.05],
];
CHECK.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

// ---------------------------------------------------------------- shared small pieces
const MX = 1100;   // maths-zone left edge used by most scenes
const ROW = (rhs: string, at: number, lhs?: string, extra: Record<string, unknown> = {}) => {
  const all = rhs + (lhs ?? "");
  const h = /\\frac|\\left\(|\\Big/.test(all) ? 150 : /\\tfrac/.test(all) ? 104 : undefined;
  return { lhs, rhs, at, ...(h ? { h } : {}), ...extra };
};
const GOLDRING: React.FC<{ p: Pt; o?: number; r?: number }> = ({ p, o = 1, r = 22 }) => o <= 0 ? null :
  <circle cx={p[0]} cy={p[1]} r={r} fill="none" stroke={C.gold} strokeWidth={5} opacity={o} />;
const Dot: React.FC<{ p: Pt; c: string; r?: number; o?: number }> = ({ p, c, r = 10, o = 1 }) => o <= 0 ? null :
  <circle cx={p[0]} cy={p[1]} r={r} fill={c} stroke={C.bg} strokeWidth={3} opacity={o} />;
const KM_LON = 1 / (111.195 * Math.cos((48.5 * Math.PI) / 180)), KM_LAT = 1 / 111.195;
/** the profile (z km, T °C) of the Trappes sounding up to zmax km */
const PROF = (() => { const z: number[] = [], t: number[] = []; for (let i = 0; i < SN.z.length; i++) { z.push(SN.z[i] / 1000); t.push(SN.T[i]); } return { z, t }; })();
const Tat = (zk: number) => { const { z, t } = PROF; for (let i = 1; i < z.length; i++) if (z[i] >= zk) { const w = (zk - z[i - 1]) / (z[i] - z[i - 1]); return t[i - 1] + (t[i] - t[i - 1]) * w; } return t[t.length - 1]; };
const pAt = (zk: number) => { const z = PROF.z, p = SN.p as number[]; for (let i = 1; i < z.length; i++) if (z[i] >= zk) { const w = (zk - z[i - 1]) / (z[i] - z[i - 1]); return Math.exp(Math.log(p[i - 1]) + (Math.log(p[i]) - Math.log(p[i - 1])) * w); } return p[p.length - 1]; };
const Z85 = PROF.z[SN.k85], Z50 = PROF.z[SN.k50], T85 = PROF.t[SN.k85], T50 = PROF.t[SN.k50];
/** the profile as a polyline in chart A (x = T, y = z km) up to height zTop */
const ProfileLine: React.FC<{ A: Ax; zTop?: number; zBot?: number; c?: string; w?: number; o?: number; clip?: string; z?: number[]; t?: number[] }> = ({ A, zTop = 99, zBot = -1, c = C.local, w = 6, o = 1, clip, z = PROF.z, t = PROF.t }) => {
  if (o <= 0) return null;
  const P = axP(A), pts: Pt[] = [];
  for (let i = 0; i < z.length; i++) { if (z[i] < zBot || z[i] > zTop) { if (z[i] > zTop && i > 0 && z[i - 1] <= zTop) { const ww = (zTop - z[i - 1]) / (z[i] - z[i - 1]); pts.push(P(t[i - 1] + (t[i] - t[i - 1]) * ww, zTop)); } continue; } pts.push(P(t[i], z[i])); }
  return <path d={poly(pts)} fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round" opacity={o} clipPath={clip ? `url(#${clip})` : undefined} />;
};
/** ERA5 850 hPa texture layers for a fractional hour h (cross-fade between the two neighbouring hours) */
const hourLayers = (h: number) => { const a = Math.floor(clamp(h, 12, 24)), b = Math.min(24, a + 1), w = clamp(h, 12, 24) - a; return w < 1e-3 ? [{ h: a, o: 1 }] : [{ h: a, o: 1 }, { h: b, o: w }]; };
const T850Bar: React.FC<{ x: number; y: number; w?: number; o?: number; wrap?: boolean }> = ({ x, y, w = 420, o = 1, wrap = false }) =>
  <ColourBar x={x} y={y} w={w} lut={LUT_T} lo={-6} hi={16} unit="°C" o={o} title={wrap ? ["temperature", "a little over 1 km up"] : "temperature a little over 1 km up"}
    ticks={[{ v: -4, t: "−4" }, { v: 4, t: "4" }, { v: 12, t: "12" }]} />;
/** fix 3 (review 3 Must 9): the s05 bar for the temperature-as-height landscape (s11, s13, s14, s37, s47) */
const LandBar: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) =>
  <ColourBar x={x} y={y} w={380} lut={LUT_T} lo={-6} hi={16} unit="°C" o={o} title="temperature (°C) = height" ticks={[{ v: -4, t: "−4" }, { v: 4, t: "4" }, { v: 12, t: "12" }]} />;

// ================================================================ s00 title
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  const tMet = AT(k, 0, "meteorology"), tEasy = AT(k, 0, "the easy way"), tWV = AT(k, 0, "water vapour");
  const A: Ax = { x: 1290, y: 120, w: 520, h: 360, xr: [-70, 25], yr: [0, 14] };
  const P = axP(A);
  const oA = fin(f, 4, 10) * fout(f, tMet, 12), oB = fin(f, tMet, 12);
  // Part A: a gold tangent glides up the real profile; a zoom window magnifies its neighbourhood until the two coincide
  const zt = mix(1.6, 9.0, prog(f, 12, tMet - 6));
  const sl = (Tat(zt + 0.35) - Tat(zt - 0.35)) / 0.7;            // °C per km of the drawn curve
  const tg = (dz: number): Pt => P(Tat(zt) + sl * dz, zt + dz);
  const mag = mix(2, 8, prog(f, 12, tMet - 6));
  const W = { x: 1640, y: 128, s: 170 };                          // zoom window (top right of the chart)
  const c0 = P(Tat(zt), zt);
  const toW = (p: Pt): Pt => [W.x + W.s / 2 + (p[0] - c0[0]) * mag, W.y + W.s / 2 + (p[1] - c0[1]) * mag];
  const curveW: Pt[] = [];
  for (let z = zt - 0.6; z <= zt + 0.6; z += 0.02) curveW.push(toW(P(Tat(z), z)));
  // Part B: the balloon rises along the same profile (12.3 → −11.8 °C), then the saturation curve with its tangent at 0 °C
  const zb = mix(Z85, Z50, prog(f, tMet + 14, tWV - 10));
  const Tb = Tat(zb);
  const oC = fin(f, tWV, 14);
  const B: Ax = { x: 1290, y: 120, w: 520, h: 360, xr: [-10, 35], yr: [0, 60] };
  const PB = axP(B);
  const es0 = CC.tang[0];                                         // [0 °C, e_s, de_s/dT] of the drawn curve
  const pz = 1 + 0.06 * pulse(f, tEasy, 12);
  return (
    <Scene fadeIn={false}>
      <Svg>
        <defs><TitleGradient id="ttl" x1={100} x2={900} /></defs>
        <RiseText f={f} t="Derivatives" x={100} y={230} s={150} at={2} fill="url(#ttl)" />
        <RiseText f={f} t="and Taylor series" x={100} y={370} s={110} at={14} fill="url(#ttl)" />
        <g transform={`translate(104 490) scale(${pz}) translate(-104 -490)`}>
          <RiseText f={f} t="made easy" x={104} y={500} s={96} at={26} fill={C.key} />
        </g>
        <RiseText f={f} t="and how meteorology uses them" x={106} y={620} s={68} at={40} fill={C.key} colors={(i) => (i >= 8 && i < 19 ? C.first : undefined)} />
        <ClipRect id="s00c" A={A} pad={4} />
        <g opacity={(oA + oB) * (1 - oC)}>
          <Axes A={A} xt={[-60, -30, 0]} yt={[0, 5, 10]} xl="°C" yl="km" />
          <ProfileLine A={A} zTop={14} clip="s00c" />
        </g>
        <g opacity={oA}>
          <path d={poly([tg(-1.6), tg(1.6)])} stroke={C.gold} strokeWidth={6} fill="none" clipPath="url(#s00c)" />
          <circle cx={c0[0]} cy={c0[1]} r={170 / mag / 2} fill="none" stroke={C.gold} strokeWidth={3} />
          <defs><clipPath id="s00w"><rect x={W.x} y={W.y} width={W.s} height={W.s} /></clipPath></defs>
          <rect x={W.x} y={W.y} width={W.s} height={W.s} fill={C.bg} stroke={C.gold} strokeWidth={4} />
          <g clipPath="url(#s00w)">
            <path d={poly(curveW)} stroke={C.local} strokeWidth={6} fill="none" />
            <path d={poly([toW(tg(-1)), toW(tg(1))])} stroke={C.gold} strokeWidth={4} fill="none" strokeDasharray="10 8" />
          </g>
        </g>
        <g opacity={oB * (1 - oC)}>
          <Sonde p={P(Tb, zb)} s={0.9} />
          <Lbl x={P(Tb, zb)[0] - 40} y={P(Tb, zb)[1] - 40} t={`${nf(Tb, 1)} °C`} c={C.key} s={T.key} a="end" />
        </g>
        <g opacity={oC}>
          <Axes A={B} xt={[0, 15, 30]} yt={[0, 20, 40, 60]} xl="°C" yl="hPa" />
          <Curve A={B} xs={CC.T} ys={CC.es} c={C.first} w={6} upto={prog(f, tWV, tWV + 30)} />
          <path d={poly([PB(-8, es0[1] - 8 * es0[2]), PB(14, es0[1] + 14 * es0[2])])} stroke={C.gold} strokeWidth={5} opacity={fin(f, tWV + 24)} />
          <Dot p={PB(0, es0[1])} c={C.gold} o={fin(f, tWV + 24)} />
        </g>
        <Keyword f={f} text="7 % per °C" at={[1460, 560]} a="middle" appear={tWV + 30} />
      </Svg>
      <TeX s={EQ_S00} x={1550} y={650} size={54} ax={0.5} o={oA * fin(f, 30)} />
    </Scene>
  );
};

// ================================================================ s01 hook: the real field and the real curve on the first frame
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  const tWhat = AT(k, 1, "what they are"), tWx = AT(k, 2, "about the weather");
  const push = prog(f, 0, LEN(k));
  const B = boxAt(48.6, -3.6, mix(5.2, 5.05, push), 80, 40, 920, 640);
  const A: Ax = { x: 1270, y: 280, w: 540, h: 470, xr: [-70, 25], yr: [0, 14] };
  const br = 0.78 + 0.22 * fin(f, tWx, 14);
  return (
    <Scene>
      <MapView id="s01" B={B} L={{ t850: [{ h: 18, o: br }], coast: 0.85 }} children={(P) => <Place p={P(BREST[0], BREST[1])} t="Brest" />} />
      <Svg>
        <T850Bar x={130} y={742} />
        <ClipRect id="s01c" A={A} pad={4} />
        <g opacity={br}>
          <Axes A={A} xt={[-60, -30, 0]} yt={[0, 5, 10]} xl="°C" yl="km" />
          <ProfileLine A={A} zTop={14} clip="s01c" />
        </g>
        <Lbl x={A.x + A.w} y={A.y + 40} t="Trappes" c={C.key} s={T.key} a="end" o={br} />
      </Svg>
      <TeX s={String.raw`\frac{\partial T}{\partial x}`} x={1180} y={130} size={84} o={fin(f, tWhat)} />
      <TeX s={String.raw`\frac{dT}{dt}`} x={1420} y={130} size={84} o={fin(f, tWhat + 10)} />
      <TeX s={String.raw`f(x_0+h)`} x={1550} y={130} size={68} o={fin(f, tWhat + 20)} />
    </Scene>
  );
};

// ================================================================ s02 average rate from the Brest station
const S02: React.FC = () => {
  const f = useCurrentFrame(), k = K("s02_average_rate");
  const t103 = AT(k, 1, "ten point three"), t6pm = AT(k, 1, "six in the evening"), t149 = AT(k, 2, "fourteen point nine");
  const A: Ax = { x: 330, y: 150, w: 640, h: 470, xr: [0, 21], yr: [6, 16] };
  const P = axP(A);
  const hs = D.isd.h as number[], Ts = D.isd.T as number[];
  const i18 = hs.indexOf(6), i20 = hs.indexOf(8), i17 = hs.indexOf(5), i19 = hs.indexOf(7);
  const p18 = P(6, Ts[i18]), p20 = P(8, Ts[i20]);
  const sec = fin(f, SS(k, 3));
  const pieces = EQ_S02.split("=");
  const slope = (Ts[i19] - Ts[i17]) / 2;                           // picture only: the local slope at 18 UTC
  const tl = (dh: number): Pt => P(6 + dh, Ts[i18] + slope * dh);
  return (
    <Scene>
      <Svg>
        <Axes A={A} xt={[0, 6, 12, 18]} yt={[8, 10, 12, 14, 16]} yl="°C" xl="time (UTC)" xf={(v) => ["12:00", "18:00", "00:00", "06:00"][v / 6]} />
        <path d={poly(hs.map((h, i) => P(h, Ts[i])))} stroke={C.neg} strokeWidth={5} fill="none" opacity={0.55 + 0.45 * fin(f, t103)} />
        {hs.map((h, i) => <Dot key={i} p={P(h, Ts[i])} c={C.neg} r={6} o={0.6} />)}
        <g transform="translate(150 640) scale(1.5) translate(-150 -640)"><PoleThermometer x={150} y={640} /></g>
        <Lbl x={150} y={690} t="Brest" c={C.key} s={T.key} a="middle" />
        <Dot p={p18} c={C.gold} r={13} o={fin(f, t103)} />
        {/* fix 3 (review 3 S12): the secant runs on through both dots; 10.3 moves below-right of its dot (the secant leaves
            down-left), 14.9 sits 24 px further right (≈ 30 px clear of the secant) */}
        <Lbl x={p18[0] + 30} y={p18[1] + 52} t="10.3 °C" c={C.key} s={T.key} o={fin(f, t103)} />
        <Dot p={p20} c={C.gold} r={13} o={fin(f, t149)} />
        <Lbl x={p20[0] + 44} y={p20[1] - 44} t="14.9 °C" c={C.key} s={T.key} o={fin(f, t149)} />
        <ClipRect id="s02c" A={A} />
        <path d={poly([lerp(p18, p20, -0.6), lerp(p18, p20, 1.5)])} stroke={C.gold} strokeWidth={6} opacity={sec} clipPath="url(#s02c)" />
        <Keyword f={f} text="average rate" at={[lerp(p18, p20, 0.5)[0] + 110, lerp(p18, p20, 0.5)[1] + 20]} appear={SS(k, 6)} targets={[lerp(p18, p20, 0.5)]} />
        <path d={poly([tl(-1.2), tl(1.2)])} stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" opacity={0.7 * fin(f, SS(k, 7) + 10)} />
        <ClockText x={MX + 30} y={110} t="18:00 UTC, 1 Nov 2023" h={6} o={fin(f, t6pm)} />
        <Keyword f={f} text="changes with time only" at={[MX + 20, 210]} appear={AT(k, 0, "just one thing")} out={SS(k, 4) - 12} />
        {/* fix 1 (review S8): the link heads stop left of "rate =" instead of landing on it */}
        <CurvedLink f={f} from={[p18[0] + 14, p18[1] - 14]} to={[MX + 40, 320]} start={SS(k, 4)} end={SS(k, 6)} bend={90} />
        <CurvedLink f={f} from={[p20[0] + 14, p20[1] - 10]} to={[MX + 40, 270]} start={SS(k, 4) + 6} end={SS(k, 6)} bend={60} />
        <Keyword f={f} text="derivative" at={[MX, 700]} appear={SS(k, 7)} />
        <Lbl x={MX} y={775} t="the rate at one instant" c={C.key} s={T.key} o={fin(f, SS(k, 7) + 8)} />
      </Svg>
      <CalcStack f={f} x={MX + 230} y={240} rows={[
        ROW("= " + pieces[0], SS(k, 4), String.raw`\text{rate}`),
        ROW("= " + pieces[1], AT(k, 4, "divide it")),
        ROW("= " + pieces[2], SS(k, 5), undefined, { c: C.key }),
      ]} />
    </Scene>
  );
};

// ================================================================ s03 the derivative as a limit (x², easy numbers)
const niceStep = (span: number) => { const raw = span / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; };
const ticksOf = (a: number, b: number) => { const s = niceStep(b - a), out: number[] = []; for (let v = Math.ceil(a / s) * s; v <= b + 1e-9; v += s) out.push(+v.toFixed(6)); return out; };
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_derivative_limit");
  const tZ = SS(k, 3), tOut = SS(k, 7);
  const z = prog(f, tZ, tZ + 40) * (1 - prog(f, tOut, tOut + 40));
  const xr: [number, number] = [mix(0, 2.94, z), mix(5, 3.14, z)], yr: [number, number] = [mix(0, 8.6, z), mix(25, 9.75, z)];
  const A: Ax = { x: 190, y: 70, w: 770, h: 650, xr, yr };
  const P = axP(A);
  const xs: number[] = [], ys: number[] = [];
  for (let i = 0; i <= 200; i++) { const x = xr[0] + ((xr[1] - xr[0]) * i) / 200; xs.push(x); ys.push(x * x); }
  const secLine = (h: number) => { const m = ((3 + h) ** 2 - 9) / h; return poly([P(xr[0] - 1, 9 + m * (xr[0] - 1 - 3)), P(xr[1] + 1, 9 + m * (xr[1] + 1 - 3))]); };
  const h1 = fin(f, SS(k, 2)) * fout(f, SS(k, 4)), h2 = fin(f, AT(k, 3, "one tenth")) * fout(f, SS(k, 4) + 20), h3 = fin(f, AT(k, 3, "one hundredth"));
  const tan = fin(f, SS(k, 4));
  const xt = ticksOf(xr[0], xr[1]), yt = ticksOf(yr[0], yr[1]);
  const dec = (v: number) => (Math.abs(v - Math.round(v)) < 1e-6 ? 0 : Math.abs(v * 10 - Math.round(v * 10)) < 1e-6 ? 1 : 2);
  const [d1, d2] = EQ_S03.split(String.raw`,\qquad `);
  return (
    <Scene>
      <Svg>
        <ClipRect id="s03c" A={A} />
        <Axes A={A} xt={xt} yt={yt} xl="x" yl="f" xf={(v) => nf(v, dec(v))} yf={(v) => nf(v, dec(v))} />
        <g clipPath="url(#s03c)">
          <path d={poly(xs.map((x, i) => P(x, ys[i])))} stroke={C.local} strokeWidth={6} fill="none" />
          <path d={secLine(1)} stroke={C.first} strokeWidth={6} opacity={h1} />
          <path d={secLine(0.1)} stroke={C.first} strokeWidth={6} opacity={h2} />
          <path d={secLine(0.01)} stroke={C.first} strokeWidth={6} opacity={h3 * (1 - tan * 0.6)} />
          <path d={poly([P(xr[0] - 1, 9 + 6 * (xr[0] - 1 - 3)), P(xr[1] + 1, 9 + 6 * (xr[1] + 1 - 3))])} stroke={C.gold} strokeWidth={6} opacity={tan} />
          <Dot p={P(4, 16)} c={C.first} r={11} o={h1} />
          <Dot p={P(3.1, 9.61)} c={C.first} r={11} o={h2} />
          <Bracket p={P(3, 9)} q={P(4, 9)} off={-26} c={C.ink} o={h1 * (1 - z)} />
          <Bracket p={P(4, 9)} q={P(4, 16)} off={-26} c={C.ink} o={h1 * (1 - z)} />
        </g>
        <Lbl x={P(3.5, 9)[0]} y={P(3.5, 9)[1] + 58} t="1" c={C.ink} s={T.key} a="middle" o={h1 * (1 - z)} />
        <Lbl x={P(4, 12.5)[0] + 50} y={P(4, 12.5)[1]} t="7" c={C.ink} s={T.key} o={h1 * (1 - z)} />
        <Dot p={P(3, 9)} c={C.gold} r={13} />
        <Keyword f={f} text="tangent" at={[P(3, 9)[0] - 120, P(3, 9)[1] - 170]} a="end" appear={AT(k, 7, "tangent")} targets={[lerp(P(3, 9), P(2.6, 9 - 2.4), 0.5)]} />
      </Svg>
      <CalcStack f={f} x={MX + 330} y={135} size={64} rows={[
        ROW("= 7", AT(k, 2, "seven over one"), String.raw`\frac{16-9}{1}`),
        ROW("= 6.1", AT(k, 3, "six point one"), String.raw`\frac{9.61-9}{0.1}`),
        ROW("= 6.01", AT(k, 3, "zero one"), String.raw`\frac{9.0601-9}{0.01}`),
      ]} />
      {/* fix 1 (review S8): f(x) = x² sits above the stack (it ran into "= 7") */}
      <TeX s={String.raw`\to 6`} x={MX + 560} y={490} size={84} c={C.gold} o={fin(f, AT(k, 4, "settles on six"))} />
      <TeX s={String.raw`f(x)=x^2`} x={MX + 40} y={92} size={60} c={C.local} o={fin(f, AT(k, 1, "f of x"))} />
      <Svg><Keyword f={f} text="shrink the step" at={[MX + 20, 640]} appear={AT(k, 0, "shrink")} out={SS(k, 5) - 12} /></Svg>
      {/* fix 3 (review 3 S11): the limit and the d/dx rows move down (≈ 20 px clear of the stack's last row and of each other) */}
      <TeX s={d1} x={MX} y={655} size={52} o={fin(f, SS(k, 5))} />
      {/* fix 2 (review 2 Should 9): d/dx x² as a display fraction at 56 */}
      <TeX s={rep(d2, String.raw`\frac{d}{dx}`, String.raw`\dfrac{d}{dx}`) + String.raw`=6\ \text{at}\ x=3`} x={MX} y={795} size={56} o={fin(f, SS(k, 6))} />
      <Svg><Keyword f={f} text="slope = rate" at={[axX(A)(4.1), axY(A)(4)]} a="middle" appear={SS(k, 8)} /></Svg>
    </Scene>
  );
};

// ================================================================ s04 a field: T(x, y, z, t)
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = K("s04_fields");
  const tX = AT(k, 2, "east x"), tY = AT(k, 2, "north y"), tZ = AT(k, 2, "height z"), tT = AT(k, 2, "time small t");
  const tPlay = SS(k, 5), t6 = AT(k, 5, "six in the evening");
  const hour = mix(12, 18, prog(f, tPlay, t6));
  const B = boxAt(47.9, -3.2, 6.6, 80, 40, 920, 620);
  const P = mapP(B);
  const O: Pt = [140, 600];
  const parts: Part[] = [{ t: "T(" }, { t: "x" }, { t: String.raw`,\,` }, { t: "y" }, { t: String.raw`,\,` }, { t: "z" }, { t: String.raw`,\,` }, { t: "t" }, { t: ")" }];
  const hl = (i: number, a: number) => ({ t: [i], tc: { [i]: C.gold }, o: pulse(f, a, 24), glow: 0.6 });
  const st = orbitCam({ az: -120, el: 22, dist: 7.5, target: [0.6, 0.6, 0.6], fov: 30 }, [150, 150]);
  const pr = projector(st, 300, 300, 1120, 300);
  return (
    <Scene>
      <MapView id="s04" B={B} L={{ t850: hourLayers(hour), coast: 0.85, borders: 0.5 }} children={(Pm) => <Place p={Pm(BREST[0], BREST[1])} r={9} />} />
      <Svg>
        <T850Bar x={130} y={730} />
        <Arrow p={O} q={[O[0] + 150, O[1]]} color={C.second} w={8} head={30} o={fin(f, tX)} />
        <Lbl x={O[0] + 160} y={O[1]} t="x east" c={C.key} s={T.floor} o={fin(f, tX)} />
        <Arrow p={O} q={[O[0], O[1] - 150]} color={C.second} w={8} head={30} o={fin(f, tY)} />
        <Lbl x={O[0] + 14} y={O[1] - 170} t="y north" c={C.key} s={T.floor} o={fin(f, tY)} />
        <ClockText x={1560} y={450} t={`t = ${String(Math.floor(hour)).padStart(2, "0")}:00`} h={hour % 12} o={fin(f, tT)} />
        <Keyword f={f} text="field" at={[1500, 600]} appear={SS(k, 4)} />
        <Keyword f={f} text="more than one thing" at={[MX + 20, 760]} appear={AT(k, 0, "rarely depends")} out={AT(k, 6, "ERA5") - 12} />
        <Lbl x={MX + 20} y={450} t="where · when" c={C.key} s={T.key} o={fin(f, AT(k, 1, "where you are")) * fout(f, tX)} />
        <Lbl x={MX + 20} y={740} t="ERA5" c={C.key} s={T.key} o={fin(f, AT(k, 6, "ERA5"))} />
        <Lbl x={MX + 180} y={740} t="· reanalysis" c={C.key} s={T.key} o={fin(f, AT(k, 6, "reanalysis"))} />
        <Lbl x={MX + 20} y={810} t="observations + weather model" c={C.muted} s={T.floor} o={fin(f, AT(k, 6, "observations"))} />
      </Svg>
      <View3D st={st} x={1120} y={300} w={300} h={300} o={fin(f, tX)}>
        <Arrow3D from={[0, 0, 0]} to={[1.5, 0, 0]} color={C.second} px={7} head={24} />
        <Arrow3D from={[0, 0, 0]} to={[0, 1.5, 0]} color={C.second} px={7} head={24} o={fin(f, tY)} />
        <Arrow3D from={[0, 0, 0]} to={[0, 0, 1.5]} color={C.second} px={7} head={24} o={fin(f, tZ)} />
      </View3D>
      <Svg>
        <Lbl x={pr.p([1.9, 0, 0])[0]} y={pr.p([1.9, 0, 0])[1]} t="x" c={C.key} s={T.key} a="middle" o={fin(f, tX)} />
        <Lbl x={pr.p([0, 1.9, 0])[0]} y={pr.p([0, 1.9, 0])[1]} t="y" c={C.key} s={T.key} a="middle" o={fin(f, tY)} />
        <Lbl x={pr.p([0, 0, 1.85])[0]} y={pr.p([0, 0, 1.85])[1] - 10} t="z up" c={C.key} s={T.key} a="middle" o={fin(f, tZ)} />
      </Svg>
      <Layered parts={parts} x={MX + 40} y={170} size={96} o={fin(f, SS(k, 3))}
        layers={[{ t: "all", o: 1 }, hl(1, AT(k, 3, "T of x")), hl(3, AT(k, 3, "y, z") ), hl(5, AT(k, 3, "z and")), hl(7, AT(k, 3, "and small t"))]} />
      <TeX s={EQ_S04} x={MX + 40} y={170} size={96} o={0} />
    </Scene>
  );
};

// ================================================================ the 3-D landscape (s05, s11, s13, s14, s37): temperature drawn as height
const LAND = (() => {
  const la = E8.land.lat as number[], lo = E8.land.lon as number[];
  const ny = la.length, nx = lo.length;
  const mk = (G: number[][]) => { const a = new Float32Array(ny * nx); for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) a[j * nx + i] = G[j][i] + 8; return a; };
  return { la, lo, ny, nx, H17: mk(E8.land.T17), H18: mk(E8.land.T18), H19: mk(E8.land.T19) };
})();
const ZS = 0.09;                                                   // world units of height per °C (temperature as height)
/** fix 3 (review 3 Must 9): the landscape box of s11, s13, s14 ends at y 660, leaving room for its colour bar at y 742 */
const LAND_BOX = { x: 80, y: 40, w: 940, h: 620 };
const wx = (lon: number) => ((lon - BGP[1]) * 111.195 * Math.cos((48.5 * Math.PI) / 180)) / 100;
const wy = (lat: number) => ((lat - BGP[0]) * 111.195) / 100;
const landT = (G: number[][], lat: number, lon: number) => {
  const { la, lo } = LAND, fi = (lat - la[0]) / (la[1] - la[0]), fj = (lon - lo[0]) / (lo[1] - lo[0]);
  const i = clamp(Math.floor(fi), 0, la.length - 2), j = clamp(Math.floor(fj), 0, lo.length - 2), a = clamp(fi - i, 0, 1), b = clamp(fj - j, 0, 1);
  return (G[i][j] * (1 - a) + G[i + 1][j] * a) * (1 - b) + (G[i][j + 1] * (1 - a) + G[i + 1][j + 1] * a) * b;
};
const w3 = (lat: number, lon: number, rise = 1, G: number[][] = E8.land.T18): V3 => [wx(lon), wy(lat), (landT(G, lat, lon) + 8) * ZS * rise];
type LandProps = { box?: { x: number; y: number; w: number; h: number }; rise?: number; morph?: number; cam?: { az: number; el: number; dist: number; target?: V3 };
  children?: React.ReactNode; over?: (pr: Projector) => React.ReactNode; o?: number; coast?: number };
const Landscape: React.FC<LandProps> = ({ box = { x: 80, y: 40, w: 1020, h: 680 }, rise = 1, morph = 0, cam = { az: -100, el: 33, dist: 10.5 }, children, over, o = 1, coast = 0.85 }) => {
  const tex = useTex(IMGS.land);
  const H = React.useMemo(() => new Float32Array(LAND.ny * LAND.nx), []);
  const m = clamp(morph, -1, 1);
  for (let q = 0; q < H.length; q++) H[q] = m >= 0 ? LAND.H18[q] + (LAND.H19[q] - LAND.H18[q]) * m : LAND.H18[q] + (LAND.H18[q] - LAND.H17[q]) * m;
  const st = orbitCam({ az: cam.az, el: cam.el, dist: cam.dist, target: cam.target ?? [0, 0.1, 0.75], fov: 32 }, [box.w / 2, box.h / 2]);
  const pr = projector(st, box.w, box.h, box.x, box.y);
  if (o <= 0) return null;
  const x0 = wx(LAND.lo[0]), x1 = wx(LAND.lo[LAND.nx - 1]), y0 = wy(LAND.la[0]), y1 = wy(LAND.la[LAND.ny - 1]);
  const coastD = (() => {
    if (coast <= 0) return "";
    let d = "";
    for (const ln of D.lines.coast_10m as number[][]) {
      let pen = false;
      for (let i = 0; i < ln.length; i += 2) {
        const lo = ln[i], la = ln[i + 1];
        if (la < LAND.la[0] || la > LAND.la[LAND.ny - 1] || lo < LAND.lo[0] || lo > LAND.lo[LAND.nx - 1]) { pen = false; continue; }
        const p = pr.p([wx(lo), wy(la), (landT(E8.land.T18, la, lo) + 8) * ZS * rise + 0.02]);
        d += `${pen ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`; pen = true;
      }
    }
    return d;
  })();
  return (
    <>
      <View3D st={st} x={box.x} y={box.y} w={box.w} h={box.h} o={o} amb={1.5} dir={1.1}>
        <Terrain H={H} ny={LAND.ny} nx={LAND.nx} x0={x0} x1={x1} y0={y0} y1={y1} zs={ZS} tex={tex} rise={Math.max(0.001, rise)} />
        {children}
      </View3D>
      <Svg o={o}>
        <defs><clipPath id={`lc${box.x}${box.y}`}><rect x={box.x} y={box.y} width={box.w} height={box.h} /></clipPath></defs>
        <g clipPath={`url(#lc${box.x}${box.y})`}>
          {coast > 0 ? <path d={coastD} stroke={C.key} strokeOpacity={coast * 0.8} strokeWidth={2} fill="none" /> : null}
          {over ? over(pr) : null}
        </g>
      </Svg>
    </>
  );
};
const landCutPts = (pr: Projector, rise: number, lon0 = LAND.lo[0], lon1 = LAND.lo[LAND.nx - 1]) => {
  const pts: Pt[] = [];
  for (let lo = lon0; lo <= lon1 + 1e-9; lo += 0.125) pts.push(pr.p(w3(BGP[0], lo, rise)));
  return pts;
};

// ================================================================ s05 the partial derivative: cut the landscape along x
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = K("s05_partial_idea");
  const tRise = AT(k, 3, "landscape"), tWall = AT(k, 4, "wall"), tEdge = SS(k, 6), tSlope = AT(k, 6, "its slope");
  const rise = prog(f, tRise, tRise + 45);
  const wall = prog(f, tWall, tWall + 40);
  const yW = mix(-2.8, 0, wall);
  const A: Ax = { x: 1200, y: 300, w: 600, h: 250, xr: [-9, 0], yr: [-4, 12] };
  const PA = axP(A);
  const cutLon = E8.cut.lon as number[], cutT = E8.cut.T as number[];
  const sel = cutLon.map((lo, i) => [lo, cutT[i]]).filter(([lo]) => lo >= -9 && lo <= 0);
  const slDeg = E8.dTdx_100km * 111.195 * Math.cos((48.5 * Math.PI) / 180) / 100;     // °C per degree of longitude at Brest
  const TB = landT(E8.land.T18, BGP[0], BGP[1]);
  const xPulse = 1 + 0.25 * pulse(f, SS(k, 5), 24);
  const partial = String.raw`\frac{\textcolor{#d8b23a}{\partial} T}{\textcolor{#d8b23a}{\partial} x}`;
  return (
    <Scene>
      <Landscape rise={rise} box={{ x: 80, y: 40, w: 1060, h: 610 }} cam={{ az: -100, el: 34, dist: 7.6, target: [0, 0.2, 0.7] }} over={(pr) => {
        const pB = pr.p(w3(BGP[0], BGP[1], rise));
        const tg = (d: number): Pt => pr.p([wx(BGP[1] + d), 0, (TB + 8 + slDeg * d) * ZS * rise]);
        return (
          <g>
            <path d={poly(landCutPts(pr, rise))} stroke={C.first} strokeWidth={7} fill="none" opacity={fin(f, tEdge)} />
            <path d={poly([tg(-1.6), tg(1.6)])} stroke={C.gold} strokeWidth={6} opacity={fin(f, tSlope)} />
            <circle cx={pB[0]} cy={pB[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
            <Lbl x={pB[0] + 16} y={pB[1] - 34} t="Brest" c={C.key} s={T.floor} />
            {/* fix 1 (review S21): the lone "x" became the arrow's own label, at its tip */}
            <Lbl x={pr.p([-1.2 + 2.6 * xPulse + 0.15, yW, 2.5])[0] + 12} y={pr.p([-1.2 + 2.6 * xPulse, yW, 2.5])[1] - 36} t="x (east)" c={C.second} s={T.key} o={fin(f, SS(k, 5))} />
          </g>
        );
      }}>
        <Quad3D pts={[[-3.4, yW, 0], [3.4, yW, 0], [3.4, yW, 2.3], [-3.4, yW, 2.3]]} color={C.local} o={0.32 * wall} />
        {/* fix 1 (review S21): the x arrow runs along the top edge of the wall (z 2.5), above the landscape, so it is seen */}
        <Arrow3D from={[-1.2, yW - 0.02, 2.5]} to={[-1.2 + 2.6 * xPulse, yW - 0.02, 2.5]} color={C.second} px={9} head={30} o={fin(f, SS(k, 5))} />
      </Landscape>
      <Svg>
        <ColourBar x={130} y={735} w={380} lut={LUT_T} lo={-6} hi={16} unit="°C" title="temperature (°C) = height" ticks={[{ v: -4, t: "−4" }, { v: 4, t: "4" }, { v: 12, t: "12" }]} />
        <Keyword f={f} text="hold the others fixed" at={[MX + 100, 120]} appear={SS(k, 2)} />
        <Lbl x={MX + 100} y={205} t="going east: x" c={C.second} s={T.key} o={fin(f, AT(k, 0, "go east")) * fout(f, AT(k, 5, "while y") - 12)} />
        <Lbl x={MX + 100} y={205} t="y, z, t fixed" c={C.local} s={T.key} o={fin(f, AT(k, 5, "while y"))} />
        <ClipRect id="s05c" A={A} pad={2} />
        <g opacity={fin(f, tEdge)}>
          <Axes A={A} xt={[-8, -6, -4, -2]} yt={[0, 5, 10]} xf={(v) => `${-v}°W`} yl="°C" xl="going east →" />
          <path d={poly(sel.map(([lo, t]) => PA(lo, t)))} stroke={C.first} strokeWidth={6} fill="none" clipPath="url(#s05c)" />
          <path d={poly([PA(-6.2, TB - 1.7 * slDeg), PA(-2.8, TB + 1.7 * slDeg)])} stroke={C.gold} strokeWidth={5} opacity={fin(f, tSlope)} />
          <Dot p={PA(BGP[1], TB)} c={C.gold} r={10} o={fin(f, tSlope)} />
        </g>
        <Keyword f={f} text="only x changes" at={[MX + 300, 720]} appear={SS(k, 8)} />
      </Svg>
      <TeX s={partial} x={MX + 40} y={720} size={96} o={fin(f, SS(k, 7))} />
      <TeX s={EQ_S05} x={0} y={0} size={96} o={0} />
    </Scene>
  );
};

// ================================================================ s06 the rule, with easy numbers
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = K("s06_partial_rule");
  const tX = SS(k, 2), tXr = SS(k, 3), tT = SS(k, 4), tProd = SS(k, 5);
  const z = (x: number, t: number) => (10 - 0.03 * x + 3 * t - 6) * 0.18;
  const W = (x: number, t: number): V3 => [x / 33.33, t, z(x, t)];
  const st = orbitCam({ az: -128, el: 26, dist: 9.6, target: [1.5, 1.5, 1.1], fov: 32 }, [460, 380]);
  const pr = projector(st, 920, 760, 80, 60);
  // fix 1 (review S14): while T = x t is discussed, the old plane fades out and the x t surface (a twisted, ruled saddle
  // piece: every line of fixed t or fixed x on it is straight) is drawn instead, with the two lines the narration holds fixed
  const pl = 1 - fin(f, tProd, 16), sd = fin(f, tProd + 6, 16);
  const S = (x: number, t: number): V3 => [x, t, 0.3 * x * t];
  const parts: Part[] = [{ t: "T=10" }, { t: String.raw`-0.03\,x` }, { t: String.raw`+3\,t`, u: { w: String.raw`\text{no slope in }x`, c: C.gold } }];
  const xc = fin(f, tX) * fout(f, tT), tc = fin(f, tT) * fout(f, tProd);
  void EQ_S06;
  return (
    <Scene>
      <View3D st={st} x={80} y={60} w={920} h={760} amb={1.4} dir={1.2}>
        <Quad3D pts={[W(0, 0), W(100, 0), W(100, 3), W(0, 3)]} color={C.first} o={0.3 * pl} />
        {[[W(0, 0), W(100, 0)], [W(100, 0), W(100, 3)], [W(100, 3), W(0, 3)], [W(0, 3), W(0, 0)]].map(([a, b], i) => <Rod3D key={i} a={a} b={b} px={4} color={C.first} o={pl} />)}
        {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((c) => <Rod3D key={`st${c}`} a={S(0, c)} b={S(3, c)} px={3} color={C.first} o={0.8 * sd} />)}
        {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((c) => <Rod3D key={`sx${c}`} a={S(c, 0)} b={S(c, 3)} px={3} color={C.first} o={0.8 * sd} />)}
        <Rod3D a={S(0, 2)} b={S(3, 2)} px={11} color={C.second} o={fin(f, SS(k, 6))} />
        <Rod3D a={S(2, 0)} b={S(2, 3)} px={11} color={C.local} o={fin(f, SS(k, 7))} />
        <Arrow3D from={[0, 0, 0]} to={[3.4, 0, 0]} color={C.second} px={6} head={22} />
        <Arrow3D from={[0, 0, 0]} to={[0, 3.4, 0]} color={C.local} px={6} head={22} />
        <Arrow3D from={[0, 0, 0]} to={[0, 0, 2.9]} color={C.ink} px={6} head={22} />
        <Rod3D a={W(0, 1)} b={W(100, 1)} px={10} color={C.second} o={xc} />
        <Rod3D a={W(50, 0)} b={W(50, 3)} px={10} color={C.local} o={tc} />
      </View3D>
      <Svg>
        <Lbl x={pr.p(S(3, 2))[0] + 20} y={pr.p(S(3, 2))[1] + 10} t="t fixed: slope t" c={C.second} s={T.floor} o={fin(f, SS(k, 6))} />
        <Lbl x={pr.p([0, 0, 0])[0] - 20} y={pr.p([0, 0, 0])[1] + 44} t="x fixed: slope x" c={C.local} s={T.floor} a="end" o={fin(f, SS(k, 7))} />
      </Svg>
      <Svg>
        <Lbl x={pr.p([3.7, 0, 0])[0] + 24} y={pr.p([3.7, 0, 0])[1] + 26} t="x (km)" c={C.key} s={T.floor} />
        <Lbl x={pr.p([0, 3.75, 0])[0]} y={pr.p([0, 3.75, 0])[1]} t="t (h)" c={C.key} s={T.floor} a="middle" />
        <Lbl x={pr.p([0, 0, 3.15])[0]} y={pr.p([0, 0, 3.15])[1] - 6} t="T" c={C.key} s={T.key} a="middle" />
        <Lbl x={pr.p(W(100, 1))[0] + 56} y={pr.p(W(100, 1))[1] + 16} t="−0.03 °C per km" c={C.second} s={T.floor} o={xc} />
        <Lbl x={pr.p(W(100, 1.6))[0] + 40} y={pr.p(W(100, 1.6))[1]} t="+3 °C per h" c={C.local} s={T.floor} o={tc} />
      </Svg>
      <Layered parts={parts} x={MX - 20} y={150} size={64} o={fin(f, SS(k, 1))}
        layers={[{ t: "all", o: 1 }, { t: [2], tc: { 2: C.muted }, o: fin(f, tX) }, { t: [], u: [2], o: fin(f, tX + 10) }]} />
      <Svg><Lbl x={MX} y={255} t="x in km, t in h" c={C.local} s={T.key} o={fin(f, AT(k, 1, "with x in kilometres"))} />
        <Keyword f={f} text="other variables: constants" at={[MX, 150]} appear={AT(k, 0, "every other variable")} out={SS(k, 1) - 10} /></Svg>
      <TeX s={String.raw`\frac{\partial T}{\partial x}=-0.03\ ^{\circ}\mathrm{C/km}`} x={MX} y={370} size={64} c={C.key} o={fin(f, tXr) * (1 - 0.4 * fin(f, tProd))} />
      <TeX s={String.raw`\frac{\partial T}{\partial t}=+3\ ^{\circ}\mathrm{C/h}`} x={MX} y={530} size={64} c={C.local} o={fin(f, tT) * (1 - 0.4 * fin(f, tProd))} />
      <TeX s={String.raw`T=x\,t`} x={MX} y={700} size={64} o={fin(f, tProd)} />
      <TeX s={String.raw`\frac{\partial T}{\partial x}=t`} x={MX + 230} y={700} size={64} c={C.key} o={fin(f, SS(k, 6))} />
      <TeX s={String.raw`\frac{\partial T}{\partial t}=x`} x={MX + 480} y={700} size={64} c={C.local} o={fin(f, SS(k, 7))} />
    </Scene>
  );
};

// ================================================================ s07 the real slopes: centred differences on the ERA5 grid
// fix 2 (review 2 Should 6, §5b): the map ends at y 690 so the distances and "colder" sit below it with gold links
// fix 3 (review 3 Must 3, Must 9, Should 2): the map ends at y 600 (same 538 px per degree, less latitude shown) so the label
// row (y 645) and the s04 colour bar (y 742) both fit below it; the row is spaced ≥ 40 px; each link is drawn only during its
// own sentence (18.4 on S2, 27.8 on S5, the two "colder" on S6) and none crosses another; 18.4 and 27.8 leave when S7 starts
const B07 = boxAt(48.42, -4.45, 1.45 * 560 / 780, 80, 40, 920, 560);
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_partial_real");
  const P = mapP(B07);
  const tGrid = AT(k, 1, "grid"), tEW = AT(k, 2, "one step east"), tY = SS(k, 5);
  const nb = E8.nbr;
  const pts: Pt[] = [];
  for (let la = 47.75; la <= 49.26; la += 0.25) for (let lo = -6.0; lo <= -2.9; lo += 0.25) pts.push(P(la, lo));
  const pB = P(BGP[0], BGP[1]), pE = P(BGP[0], BGP[1] + 0.25), pW = P(BGP[0], BGP[1] - 0.25), pN = P(BGP[0] + 0.25, BGP[1]), pS = P(BGP[0] - 0.25, BGP[1]);
  const dx2 = 2 * E8.dx_km, dy2 = 2 * E8.dy_km;
  const gx = ((nb.E - nb.W) / dx2) * 100, gy = ((nb.N - nb.S) / dy2) * 100;
  if (Math.abs(gx - E8.dTdx_100km) > 0.03 || Math.abs(gy - E8.dTdy_100km) > 0.03) throw new Error("CHECK s07 screen differences");
  const [l7, r7] = cut2(EQ_S07, String.raw`\approx`);
  if (!(nb.E > 0 && nb.W > 0 && nb.N > 0 && nb.S > 0)) throw new Error("s07: a neighbour below 0 °C would need brackets");
  const g = Math.hypot(gx, gy), gu: Pt = [gx / g, -gy / g];
  return (
    <Scene>
      <MapView id="s07" B={B07} L={{ t850: [{ h: 18, o: 1 }], dim: 0.2, coast: 0.9 }} children={() => (
        <g>
          {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={6} fill={C.ink} opacity={0.75 * fin(f, tGrid)} />)}
          <Dot p={pW} c={C.first} r={14} o={fin(f, tEW)} /><Dot p={pE} c={C.first} r={14} o={fin(f, tEW)} />
          <Bracket p={pW} q={pB} off={34} c={C.ink} o={fin(f, tEW + 10)} /><Bracket p={pB} q={pE} off={34} c={C.ink} o={fin(f, tEW + 10)} />
          <Dot p={pN} c={C.first} r={14} o={fin(f, tY)} /><Dot p={pS} c={C.first} r={14} o={fin(f, tY)} />
          <Bracket p={pS} q={pN} off={-34} c={C.ink} o={fin(f, tY + 10)} />
          <Dot p={pB} c={C.gold} r={12} />
          <Arrow p={pB} q={[pB[0] + 190, pB[1]]} color={C.neg} w={8} head={30} o={fin(f, SS(k, 6))} />
          <Arrow p={pB} q={[pB[0], pB[1] - 190]} color={C.neg} w={8} head={30} o={fin(f, AT(k, 6, "towards the north"))} />
          <Arrow p={pB} q={[pB[0] + gu[0] * 220, pB[1] + gu[1] * 220]} color={C.second} w={9} head={34} o={0.85 * fin(f, SS(k, 7))} />
        </g>
      )} over={() => (
        <g>
          {/* fix 3 (review 3 S2): up and right of the gold dot, clear of the white bracket and the west grid point */}
          <Lbl x={pB[0] + 26} y={pB[1] - 70} t="Brest" c={C.key} s={T.floor} />
        </g>
      )} />
      <Svg>
        <T850Bar x={130} y={742} />
        <Callout f={f} out={SS(k, 7) - 10} lines="18.4 km" at={[450, 645]} appear={tEW + 10} linkEnd={SS(k, 3)} target={bracketMid(pW, pB, 34)} s={T.floor} bend={20} />
        <Callout f={f} out={SS(k, 7) - 10} lines="27.8 km" at={[660, 645]} appear={tY + 10} linkEnd={SS(k, 6)} target={[pB[0] - 26, pB[1] + 68]} s={T.floor} bend={-20} />
        <Callout f={f} o={fout(f, LEN(k) - 10, 8)} lines="colder (east)" at={[1010, 800]} appear={SS(k, 6)} linkEnd={SS(k, 7)} target={[pB[0] + 196, pB[1] + 16]} s={T.floor} c={C.neg} bend={30} />
        {/* the north link curves up the map's left side and meets the arrow head from the left, never along the arrow */}
        <Lbl x={110} y={645} t="colder (north)" c={C.neg} s={T.floor} o={fin(f, AT(k, 6, "towards the north"), 8) * fout(f, LEN(k) - 10, 8)} />
        <CurvedLink f={f} from={[258, 618]} ctl={[290, 230]} to={[pB[0] - 22, pB[1] - 175]} start={AT(k, 6, "towards the north") + 6} end={SS(k, 7)} />
      </Svg>
      <CalcStack f={f} x={MX + 230} y={90} size={62} rows={[
        ROW(String.raw`\approx` + r7, AT(k, 2, "divide their difference"), l7),
        // fix 1 (review S13): no stray brackets (all four neighbours are above 0 °C; checked below)
        ROW(String.raw`= \frac{${nf(nb.E, 2)}-${nf(nb.W, 2)}}{36.8\ \mathrm{km}}`, SS(k, 4)),
        ROW(String.raw`\approx -3.2\ ^{\circ}\mathrm C/100\ \mathrm{km}`, AT(k, 4, "minus three point two"), undefined, { c: C.neg }),
      ]} />
      <Svg>
        <Keyword f={f} text="centred difference" at={[MX + 20, 520]} appear={SS(k, 3)} />
        <CurvedLink f={f} from={[pE[0] + 14, pE[1] - 14]} to={[MX + 250, 250]} start={SS(k, 4)} end={SS(k, 5)} bend={60} />
        <Keyword f={f} text="gradient" at={[450, 645]} appear={SS(k, 7)} out={LEN(k) - 12} targets={[[pB[0] + gu[0] * 200, pB[1] + gu[1] * 200]]} />
      </Svg>
      <TeX s={String.raw`\frac{\partial T}{\partial x},\ \ \frac{\partial T}{\partial y}`} x={MX + 40} y={640} size={72} o={fin(f, 4) * fout(f, AT(k, 2, "divide their difference") - 10)} />
      <TeX s={String.raw`\frac{\partial T}{\partial y}\approx\frac{${nf(nb.N, 2)}-${nf(nb.S, 2)}}{55.6\ \mathrm{km}}`} x={MX} y={636} size={54} c={C.neg} o={fin(f, tY)} />
      <TeX s={String.raw`\approx-2.5\ ^{\circ}\mathrm C/100\ \mathrm{km}`} x={MX + 60} y={734} size={54} c={C.neg} o={fin(f, AT(k, 5, "minus two point five"))} />
    </Scene>
  );
};

// ================================================================ s08 ∂/∂t: the fixed thermometer (ERA5) and the station barometer (SYNOP)
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = K("s08_partial_time");
  const tPlay = AT(k, 3, "rose from"), t7 = AT(k, 3, "seven o'clock"), tG = SS(k, 5);
  const hour = mix(17, 19, prog(f, tPlay, t7));
  const ph2 = fin(f, tG, 18);
  // fix 2 (review 2 Should 6, §5b): the map ends at y 420; the live reading and "fixed thermometer" sit below it, linked
  const B = boxAt(48.42, -4.3, 2.3 * 380 / 420, 80, 40, 920, 380);
  const pts = E8.pt;
  const Th = hour <= 18 ? mix(pts["17"], pts["18"], hour - 17) : mix(pts["18"], pts["19"], hour - 18);
  const A: Ax = { x: 280, y: 540, w: 640, h: 220, xr: [17, 19], yr: [0, 10] };
  const PA = axP(A);
  // fix 3 (review 3 Must 4): the series reaches 977.7 and 976.0 hPa at 19 and 20 UTC, so the axis runs 970-1000 (the curve
  // stays inside its graph; the two dots and their labels move with the new scale)
  const Ap: Ax = { x: 330, y: 110, w: 620, h: 330, xr: [0, 8], yr: [970, 1000] };
  const PP = axP(Ap);
  const sh = D.isd.slp_h as number[], sp = D.isd.slp as number[];
  const sel = sh.map((h, i) => [h, sp[i]]).filter(([h]) => h <= 8);
  const slideIn = prog(f, tG + 10, tG + 40);
  const Bl = boxAt(48.6, -7.4, 4.6, 80, 500, 920, 320);
  const tStorm = AT(k, 8, "deep storm");
  void EQ_S08;
  return (
    <Scene>
      <g style={{ opacity: 1 - ph2 }}>
        <MapView id="s08" B={B} L={{ t850: hourLayers(hour), coast: 0.85 }} o={1 - ph2} children={(P) => {
          const pb = P(BREST[0], BREST[1]);
          return (
            <g>
              <g transform={`translate(${pb[0]} ${pb[1]}) scale(1.2) translate(${-pb[0]} ${-pb[1]})`}><PoleThermometer x={pb[0]} y={pb[1]} /></g>
            </g>
          );
        }} />
      </g>
      <Svg o={clamp(1 - 2 * ph2, 0, 1)}>
        <Axes A={A} xt={[17, 18, 19]} yt={[0, 5, 10]} yl="°C" xf={(v) => `${v}:00`} />
        <path d={poly([17, 17.25, 17.5, 17.75, 18, 18.25, 18.5, 18.75, 19].filter((h) => h <= hour + 1e-6).map((h) => PA(h, h <= 18 ? mix(pts["17"], pts["18"], h - 17) : mix(pts["18"], pts["19"], h - 18))))}
          stroke={C.local} strokeWidth={6} fill="none" />
        {[17, 18, 19].map((h) => <Dot key={h} p={PA(h, pts[String(h)])} c={C.local} r={10} o={hour >= h - 0.02 ? 1 : 0} />)}
        <Lbl x={PA(17, pts["17"])[0] + 18} y={PA(17, pts["17"])[1] + 34} t="2.4" c={C.key} s={T.floor} o={fin(f, tPlay)} />
        <Lbl x={PA(18, pts["18"])[0] + 18} y={PA(18, pts["18"])[1] + 34} t="5.1" c={C.key} s={T.floor} o={hour >= 18 ? 1 : 0} />
        <Lbl x={PA(19, pts["19"])[0] - 18} y={PA(19, pts["19"])[1] - 30} t="8.2" c={C.key} s={T.floor} a="end" o={hour >= 18.98 ? 1 : 0} />
        <Keyword f={f} text="fixed thermometer" at={[560, 462]} appear={AT(k, 2, "fixed thermometer")} targets={[mapP(B)(BREST[0] + 0.22, BREST[1] + 0.1)]} />
        <Callout f={f} lines={`${nf(Th, 1)} °C`} at={[110, 462]} appear={0} target={mapP(B)(BREST[0] + 0.3, BREST[1] - 0.06)} s={T.key} bend={-30} />
      </Svg>
      <Svg o={clamp(2 * ph2 - 1, 0, 1)}>
        <Barometer x={170} y={230} hPa={sel.length ? mix(988.3, 983.3, prog(f, AT(k, 6, "fell from"), AT(k, 6, "at six"))) : 985} />
        <Lbl x={170} y={330} t="Brest" c={C.key} s={T.floor} a="middle" />
        <Axes A={Ap} xt={[0, 2, 4, 6, 8]} yt={[970, 980, 990, 1000]} yl="hPa" xf={(v) => `${12 + v}:00`} />
        <path d={poly(sel.map(([h, p]) => PP(h, p)))} stroke={C.local} strokeWidth={6} fill="none" />
        <Dot p={PP(5, 988.3)} c={C.gold} r={12} o={fin(f, AT(k, 6, "nine hundred and eighty eight"))} />
        <Lbl x={PP(5, 988.3)[0] - 24} y={PP(5, 988.3)[1] + 50} t="988.3 hPa" c={C.key} s={T.floor} a="end" o={fin(f, AT(k, 6, "nine hundred and eighty eight"))} />
        <Dot p={PP(6, 983.3)} c={C.gold} r={12} o={fin(f, AT(k, 6, "nine hundred and eighty three"))} />
        <Lbl x={PP(6, 983.3)[0] + 30} y={PP(6, 983.3)[1] - 44} t="983.3 hPa" c={C.key} s={T.floor} o={fin(f, AT(k, 6, "nine hundred and eighty three"))} />
      </Svg>
      <MapView id="s08l" B={{ ...Bl, x: Bl.x - (1 - slideIn) * 1000 }} o={ph2 * fin(f, tG + 10)} L={{ coast: 0.8 }} children={(P) => (
        <g>
          <Iso P={P} levels={D.low.iso} c={C.local} w={3} o={0.9} />
          <text opacity={0.4 + 0.6 * fin(f, tStorm)} x={P(D.low.centre[0], D.low.centre[1])[0]} y={P(D.low.centre[0], D.low.centre[1])[1]} fill="#ff7a8a" fontSize={80} fontWeight={800} textAnchor="middle"
            dominantBaseline="central" stroke={C.bg} strokeWidth={8} paintOrder="stroke" fontFamily="'Segoe UI', Arial, sans-serif">L</text>
          <Place p={P(BREST[0], BREST[1])} r={8} />
        </g>
      )} />
      <CalcStack f={f} x={MX + 200} y={100} size={54} rows={[
        ROW(String.raw`\approx\frac{(8.2-2.4)\ ^{\circ}\mathrm C}{2\ \mathrm h}`, SS(k, 4), String.raw`\frac{\partial T}{\partial t}`, { c: C.local, lc: C.local }),
        ROW(String.raw`\approx+2.9\ ^{\circ}\mathrm{C/h}`, AT(k, 4, "plus two point nine"), undefined, { c: C.local }),
        ROW(String.raw`\approx\frac{(983.3-988.3)\ \mathrm{hPa}}{1\ \mathrm h}`, AT(k, 6, "at six"), String.raw`\frac{\partial p}{\partial t}`, { c: C.local, lc: C.local }),
        ROW(String.raw`=-5\ \mathrm{hPa/h}`, SS(k, 8), undefined, { c: C.neg }),
      ]} maxLines={4} />
      {/* fix 3 (review 3 Must 9): the s04 colour bar for the temperature map, in the text column under the first two rows
          (title on two lines), for as long as the map is on screen; "the place stays fixed" moves below the bar, right of ∂T/∂t */}
      <Svg><T850Bar x={MX + 200} y={455} wrap o={1 - ph2} />
        <Keyword f={f} text="hectopascal (hPa)" at={[MX + 40, 720]} appear={SS(k, 7)} />
        <Keyword f={f} text="the place stays fixed" at={[MX + 176, 640]} appear={SS(k, 1)} out={SS(k, 4) - 12} /></Svg>
      <TeX s={String.raw`\frac{\partial T}{\partial t}`} x={MX + 40} y={690} size={84} c={C.local} o={fin(f, 4) * fout(f, SS(k, 5))} />
    </Scene>
  );
};

// ================================================================ s09 ∂/∂z: the Trappes radiosonde (globe, then the profile)
// fix 2 (review 2 Should 7; HOUSE_STYLE §5b zoom-reveal): the whole globe sits on the left, clear of the text column (≈ 760 px);
// on "Trappes" the camera moves in (≈ 1.5 s) and the globe renders full-bleed under the house GlobeFrame (right side darkened
// 0 → 82 % over x 980-1160, 60-px edge fades, bottom fade 760-830), Trappes centred and labelled on its word; before the profile
// it zooms back out to the start view. The source line sits below the picture box on solid background.
const S09_C0: GlobeCam = { lat: 46.0, lon: -3.0, dist: 4.6, pp: [520, 430] };
const S09_C1: GlobeCam = { lat: 48.77, lon: 2.0, dist: 1.42, pp: [600, 450] };
/** a full-bleed (1920 × 1080) globe whose look point is drawn at cam.pp (kit_dt pieces; the house zoom-reveal frame on top) */
const GlobeFB: React.FC<{ cam: GlobeCam; o?: number; drape?: { href: string; box: [number, number, number, number]; o: number }; coast?: number;
  field?: string | null; fieldO?: number; over?: (G: GProj) => React.ReactNode }> = ({ cam, o = 1, drape, coast = 0.5, field = null, fieldO = 0, over }) => {
  const tex = useTex(IMGS.bmng);
  const dtex = useTex(drape ? drape.href : null);
  const ftex = useTex(field);
  const st = globeCam(cam, [960, 540]);
  const G = globeProj(st, 1920, 1080, 0, 0);
  if (o <= 0) return null;
  const drapes = drape && dtex ? [{ tex: dtex, lat: [drape.box[0], drape.box[1]] as [number, number], lon: [drape.box[2], drape.box[3]] as [number, number], o: drape.o }] : [];
  return (
    <>
      <View3D st={st} x={0} y={0} w={1920} h={1080} o={tex ? o : 0} key3={st.pos} amb={1.6} dir={1.4}>
        <GlobeMesh tex={tex} drapes={drapes} />
        {field ? <FieldSphere tex={ftex} o={fieldO} /> : null}
      </View3D>
      <Svg o={o}>
        {coast > 0 ? <path d={coastPath(G, D.lines.globe_coast_110m)} fill="none" stroke={C.key} strokeOpacity={coast} strokeWidth={1.6} /> : null}
        {over ? over(G) : null}
      </Svg>
    </>
  );
};
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09_partial_height");
  const tSonde = AT(k, 2, "radiosonde"), tTr = AT(k, 3, "Trappes"), tNoon = AT(k, 3, "noon"), tPh2 = SS(k, 4);
  const zi0 = tTr - 32, zi1 = tTr + 13, zo1 = SE(k, 3) - 4, zo0 = zo1 - 46;
  const cam = globePath([{ f: 0, ...S09_C0 }, { f: zi0, ...S09_C0 }, { f: zi1, ...S09_C1 }, { f: zo0, ...S09_C1 }, { f: zo1, ...S09_C0 }], f);
  const zoom = clamp((S09_C0.dist - cam.dist) / (S09_C0.dist - 2.9), 0, 1);
  const right = fin(f, zi0, 30) * fout(f, zo1 - 30, 30);
  const ph2 = fin(f, tPh2, 20);
  const Gs = globeProj(globeCam(cam, [960, 540]), 1920, 1080, 0, 0);
  const pTr = Gs.p(TRAP[0], TRAP[1]);
  // fix 3 (review 3 S12): the balloon stops rising before its top reaches the 60-px top fade (top kept ≥ 84 px)
  const sSo = 0.7 + 0.5 * zoom;
  const rise = Math.min(prog(f, tNoon, zo0) * zoom, Math.max(0, (pTr[1] - 10 - 92 * sSo - 84) / 300));
  const pSo: Pt = [pTr[0], pTr[1] - 10 - 300 * rise];
  const A: Ax = { x: 250, y: 90, w: 700, h: 640, xr: [-20, 25], yr: [0, 7] };
  const P = axP(A);
  const zb = mix(0.168, Z50, prog(f, tPh2, SE(k, 5)));
  const p85 = P(T85, Z85), p50 = P(T50, Z50);
  const [e1, e2] = cut2(EQ_S09, String.raw`,\qquad `);
  return (
    <Scene>
      <GlobeFB cam={cam} o={1 - ph2} coast={0.5} drape={{ href: IMGS.trappes, box: BOX.trappes, o: fin(f, tTr - 12) }} over={(G) => {
        const p = G.p(TRAP[0], TRAP[1]);
        // fix 1 (review S18): the MODIS tile gets a thin outline and its date, so it reads as an image, not a glitch
        const [la0, la1, lo0, lo1] = BOX.trappes;
        const edge: Pt[] = [];
        for (let i = 0; i <= 24; i++) edge.push(G.p(la0, lo0 + ((lo1 - lo0) * i) / 24));
        for (let i = 0; i <= 24; i++) edge.push(G.p(la0 + ((la1 - la0) * i) / 24, lo1));
        for (let i = 0; i <= 24; i++) edge.push(G.p(la1, lo1 - ((lo1 - lo0) * i) / 24));
        for (let i = 0; i <= 24; i++) edge.push(G.p(la1 - ((la1 - la0) * i) / 24, lo0));
        return (
          <g>
            <path d={poly(edge) + "Z"} fill="none" stroke={C.key} strokeWidth={2.5} opacity={0.8 * fin(f, tTr - 12) * zoom} />
            <circle cx={p[0]} cy={p[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={fin(f, tSonde - 10)} />
            {/* the place is labelled on its word (§5b: centred and labelled within ≈ 1 s of being spoken) */}
            <Lbl x={p[0] + 24} y={p[1] + 40} t="Trappes" c={C.key} s={T.key} o={fin(f, tTr - 3)} />
            <Sonde p={[p[0], p[1] - 10 - 300 * rise]} s={sSo} o={fin(f, tSonde - 10)} />
          </g>
        );
      }} />
      <GlobeFrame id="s09f" zoom={zoom} right={right} disc={{ c: cam.pp as Pt, r: silhouetteR(cam.dist, 1080, 35) }} o={1 - ph2} />
      <SourceBelow text="Imagery: MODIS true colour (NASA Worldview), 30 Sep 2026 · Blue Marble (NASA)" pic={{ x: 80, y: 40, w: 1760, h: 780 }} o={clamp(1 - 2 * ph2, 0, 1) * fin(f, 0, 10)} name="s09 globe" />
      <Svg o={1 - ph2}>
        <Keyword f={f} text="radiosonde" at={[MX + 20, 300]} appear={tSonde} targets={[[pSo[0] + 34, pSo[1] - 60]]} />   {/* §5b: off the globe */}
      </Svg>
      <Svg o={ph2}>
        <ClipRect id="s09c" A={A} pad={4} />
        {/* fix 1 (review S5): the two levels are read off the axis in gold (1.53 and 5.80 km), so 4.26 km is visible */}
        <Axes A={A} xt={[-20, -10, 0, 10, 20]} yt={[0, 4]} xl="temperature (°C)" yl="height (km)" ylx={40} />
        <Lbl x={A.x - 14} y={p85[1]} t={(Math.round(SN.z[SN.k85] / 10) / 100).toFixed(2)} c={C.gold} s={T.floor} a="end" b={false} o={fin(f, AT(k, 4, "one and a half"))} />
        <Lbl x={A.x - 14} y={p50[1]} t={(Math.round(SN.z[SN.k50] / 10) / 100).toFixed(2)} c={C.gold} s={T.floor} a="end" b={false} o={fin(f, AT(k, 5, "five point eight"))} />
        <line x1={A.x} y1={p85[1]} x2={p85[0]} y2={p85[1]} stroke={C.gold} strokeWidth={2.5} strokeDasharray="8 8" opacity={0.8 * fin(f, AT(k, 4, "one and a half"))} />
        <line x1={A.x} y1={p50[1]} x2={p50[0]} y2={p50[1]} stroke={C.gold} strokeWidth={2.5} strokeDasharray="8 8" opacity={0.8 * fin(f, AT(k, 5, "five point eight"))} />
        <ProfileLine A={A} zTop={zb} clip="s09c" />
        <Sonde p={P(Tat(zb), zb)} s={1} o={1 - fin(f, SS(k, 6))} />
        <Dot p={p85} c={C.gold} r={12} o={fin(f, AT(k, 4, "twelve point three"))} />
        <Lbl x={p85[0] + 22} y={p85[1] + 4} t="12.3 °C" c={C.key} s={T.key} o={fin(f, AT(k, 4, "twelve point three"))} />
        <Dot p={p50} c={C.gold} r={12} o={fin(f, AT(k, 5, "minus eleven"))} />
        <Lbl x={p50[0] + 24} y={p50[1] - 30} t="−11.8 °C" c={C.key} s={T.key} o={fin(f, AT(k, 5, "minus eleven"))} />
        {/* fix 3 (review 3 S5): the bracket's foot ends 30 px above the "12.3 °C" label (its top is level with the label's top) */}
        <Bracket p={[p85[0] + 60, p85[1] - 30]} q={[p85[0] + 60, p50[1]]} off={0} c={C.ink} o={fin(f, SS(k, 6))} />
        <Lbl x={p85[0] + 76} y={(p85[1] - 30 + p50[1]) / 2} t="4.26 km" c={C.ink} s={T.floor} o={fin(f, SS(k, 6))} />
        <Bracket p={[p50[0], p50[1] - 80]} q={[p85[0], p50[1] - 80]} off={0} c={C.neg} o={fin(f, SS(k, 6))} />
        <Lbl x={(p50[0] + p85[0]) / 2} y={p50[1] - 114} t="−24.1 °C" c={C.neg} s={T.floor} a="middle" o={fin(f, SS(k, 6))} />
        {/* fix 3 (review 3 S5): "15 min" 40 px further left, clear of the profile */}
        <Lbl x={p85[0] - 190} y={(p85[1] + p50[1]) / 2 + 60} t="15 min" c={C.local} s={T.key} a="end" o={fin(f, SS(k, 7))} />
        {/* fix 1 (review S8): the links start at the two picture numbers (4.26 km, −24.1 °C) instead of crossing them */}
        <CurvedLink f={f} from={[p85[0] + 76 + textW("4.26 km", T.floor) + 8, (p85[1] - 30 + p50[1]) / 2]} to={[MX - 14, 345]} start={SS(k, 6)} end={SS(k, 7)} bend={40} />
        <CurvedLink f={f} from={[(p50[0] + p85[0]) / 2 + textW("−24.1 °C", T.floor) / 2 + 10, p50[1] - 114]} to={[MX - 14, 300]} start={SS(k, 6) + 6} end={SS(k, 7)} bend={-30} />
      </Svg>
      <SourceBelow text="Data: IGRA2 radiosonde (NOAA NCEI) · Trappes · 30 Sep 2026, 12 UTC" pic={{ x: 80, y: 40, w: 920, h: 780 }} w={1760} o={clamp(2 * ph2 - 1, 0, 1)} name="s09 profile" />
      <Svg><ClockText x={MX + 30} y={110} t="30 Sep 2026, 12 UTC" h={0} o={fin(f, tNoon)} />
        <Lbl x={MX + 200} y={470} t="change with height" c={C.key} s={T.key} o={fin(f, AT(k, 0, "the change with height")) * fout(f, SS(k, 6))} /></Svg>
      <TeX s={String.raw`\frac{\partial T}{\partial z}`} x={MX + 40} y={470} size={84} o={fin(f, 4) * fout(f, SS(k, 6))} />
      <TeX s={e1} x={MX} y={320} size={56} o={fin(f, SS(k, 6))} />
      <Svg><Keyword f={f} text="lapse rate" at={[MX + 20, 520]} appear={AT(k, 8, "lapse rate")} /></Svg>
      <TeX s={e2 + String.raw`=+5.7\ ^{\circ}\mathrm{C/km}`} x={MX} y={640} size={64} c={C.key} o={fin(f, AT(k, 8, "flip its sign"))} />
    </Scene>
  );
};

// ================================================================ s09b ∂T/∂z between five ERA5 levels over northern France (fix 2: the §5b layer stack)
// House kit K5 LayerStack3D: five of the 16 ERA5 levels (1000 / 700 / 400 / 175 / 100 hPa) at their area-mean heights ×45, each
// coloured by its own temperature on one thermal scale (colour bar in the text column), below-ground points transparent. The
// camera hovers OUTSIDE the stack from the side at an angle, moving from the bottom to the top; one short close look (≈ 4 s,
// from the side, outside) at the top gap where the sign flips, then back out (HOUSE_STYLE §5b: strictly no fly-through). A rod
// at Trappes carries the four gaps; each gap's ΔT/Δz (layer_lapse_rate) is a K3 Callout in the column with a gold link to it.
const SKH = D.stack;
const SK_KM_LON = 111.32 * Math.cos((48.5 * Math.PI) / 180);
const skX = (lon: number) => ((lon - SKH.lon[0]) * SK_KM_LON) / 1000, skY = (lat: number) => ((lat - SKH.lat[0]) * 111.32) / 1000;
const skZ = (zm: number) => (zm * SKH.exaggeration) / 1e6;
const SK_GAPS = SKH.trappes.gaps_shown as number[];
const SKT = SKH.trappes.T_C as number[], SKZ = SKH.trappes.z_km as number[];
const SK_CHECK: [string, number, number, number][] = [
  // fix 3: the worked first gap on screen, (2.3 − 20.9) °C / 3.0 km ≈ −6.2, from the shown roundings
  ["T 700 shown", +SKT[1].toFixed(1), 2.3, 1e-9], ["T 1000 shown", +SKT[0].toFixed(1), 20.9, 1e-9], ["dz shown", +(SKZ[1] - SKZ[0]).toFixed(1), 3.0, 1e-9],
  ["gap1 by hand", (2.3 - 20.9) / 3.0, -6.2, 1e-9],
  ["gap1", SK_GAPS[0], -6.2, 1e-9], ["gap2", SK_GAPS[1], -5.6, 1e-9], ["gap3", SK_GAPS[2], -7.7, 1e-9], ["gap4", SK_GAPS[3], 1.1, 1e-9],
  ["z top", SKH.trappes.z_km[4], 16.45, 0.006], ["trop z", SKH.trop.z / 1000, 13.0, 0.01], ["trop p", SKH.trop.p_hPa, 175, 0],
  ["levels", (SKH.levels_hPa as number[]).join(","), 0, 0],
];
SK_CHECK.forEach(([n, v, r, tol]) => { if (n === "levels") { if (v as unknown as string !== "1000,700,400,175,100") throw new Error(`CHECK s09b levels ${v}`); } else if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK s09b ${n}: data ${v} vs screen ${r}`); });
const EQ_S09B = String.raw`\frac{\Delta T}{\Delta z}\approx\frac{\partial T}{\partial z}\quad(^{\circ}\mathrm{C/km})`;
const LUT_SK = SKH.lut_hex as string[];
const S09B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09b_dtdz_stack");
  const buf = useBin(staticFile("dt_stack_t.bin"));
  const L = React.useMemo(() => (buf ? Array.from({ length: 5 }, (_, i) => new Float32Array(buf, i * SKH.bytes_per_level, SKH.ny * SKH.nx)) : null), [buf]);
  const al = () => 0.9;
  const texs = [0, 1, 2, 3, 4].map((i) => useLayerTex(L ? L[i] : null, SKH.ny, SKH.nx, LUT_SK, SKH.range[0], SKH.range[1], al)); // eslint-disable-line react-hooks/rules-of-hooks
  const zb = (SKH.zbar_m as number[]).map(skZ);
  const zt = (SKH.trappes.z_km as number[]).map((z) => skZ(z * 1000));
  const X1 = skX(SKH.lon[1]), Y1 = skY(SKH.lat[1]), cx = X1 / 2, cy = Y1 / 2, top = zb[4];
  const rx = skX(TRAP[1]), ry = skY(TRAP[0]);
  const t1 = SS(k, 1), t2 = SS(k, 2);
  const tFive = AT(k, 0, "five levels");
  // fix 3 (review 3 Must 8): all five layers are on screen from the start (bottom first, 6 frames apart), so the holey 1000-hPa
  // layer is never the whole picture; a keyword on the first frame says why it has holes
  const reveal = zb.map((_, i) => clamp((f - i * 6) / 12, 0, 1));
  const g = [AT(k, 1, "minus six point two"), AT(k, 1, "minus five point six"), AT(k, 1, "minus seven point seven"), AT(k, 2, "plus one point one")];
  const tLook = AT(k, 2, "the sign flips"), tTrop = AT(k, 2, "tropopause");
  // camera: outside the stack all the time; side view at an angle, rising from the bottom to the top, one short close side look
  const mid = (z: number): [number, number, number] => [cx, cy, z];
  const keys: OrbitKey[] = [
    { f: 0, az: -112, el: 11, dist: 2.75, target: mid(top * 0.32) },
    { f: t1 - 10, az: -100, el: 16, dist: 2.75, target: mid(top * 0.42), linear: true },
    { f: g[2] + 20, az: -88, el: 21, dist: 2.75, target: mid(top * 0.55), linear: true },
    // fix 3 (review 3 S9): the close look eases in and out over 1.8 s each (was ≈ 1.3 s) and stays ≤ 5.6 s in all; the camera
    // then returns to the low side angle of S1 (el 16, as at 8:04) instead of the higher pitch that crowded the layers
    { f: tLook - 6, az: -84, el: 22, dist: 2.75, target: mid(top * 0.6) },
    { f: tLook + 48, az: -80, el: 9, dist: 1.72, target: [cx, cy, (zb[3] + zb[4]) / 2] },
    { f: tLook + 48 + 60, az: -77, el: 9, dist: 1.72, target: [cx, cy, (zb[3] + zb[4]) / 2], linear: true },
    { f: tLook + 48 + 60 + 54, az: -92, el: 16, dist: 2.75, target: mid(top * 0.45) },
    { f: LEN(k) + 10, az: -96, el: 16, dist: 2.75, target: mid(top * 0.45), linear: true },
  ];
  const st = hOrbitCam({ ...hOrbitPath(keys, f), fov: 30 }, [540, 440]);
  const pr = hProjector(st, 1920, 1080, 0, 0);
  const layers: StackLayer[] = texs.map((t, i) => ({ tex: t, z: zb[i], o: 0.92 }));
  const gapC = (i: number) => (SK_GAPS[i] < 0 ? C.neg : C.first);
  const on = (i: number) => fin(f, g[i], 10);
  const rodPts = zt.map((z) => [rx, ry, z] as [number, number, number]);
  const llP = (z: number) => (lo: number, la: number) => pr.p([skX(lo), skY(la), z]);
  const linesAt = (lines: number[][], z: number) => {
    const P = llP(z);
    let d = "";
    for (const ln of lines) {
      let pen = false;
      for (let i = 0; i < ln.length; i += 2) {
        const lo = ln[i], la = ln[i + 1];
        if (la < SKH.lat[0] || la > SKH.lat[1] || lo < SKH.lon[0] || lo > SKH.lon[1]) { pen = false; continue; }
        const q = P(lo, la);
        d += `${pen ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`; pen = true;
      }
    }
    return d;
  };
  const rim = (i: number, o: number) => o <= 0 ? null : <path d={poly([[0, 0], [X1, 0], [X1, Y1], [0, Y1], [0, 0]].map(([x, y]) => pr.p([x, y, zb[i]])))} fill="none" stroke={C.gold} strokeWidth={4} opacity={o} />;
  const gapMid = (i: number) => pr.p([rx, ry, (zt[i] + zt[i + 1]) / 2]);
  const rows = [635, 568, 500, 265];   // bottom gap … top gap, the same order as on the rod
  const edge175 = pr.p([X1, Y1 * 0.5, zb[3]]);
  return (
    <Scene>
      <HView3D st={st} x={0} y={0} w={1920} h={1080}>
        <LayerStack3D layers={f < 3 ? [] : layers} foot={{ x0: 0, x1: X1, y0: 0, y1: Y1 }} sep={1} reveal={reveal}
          lines={[{ pts: [[rx, ry, 0], [rx, ry, zt[0]]], color: C.key, px: 4, o: 0.9 },
            ...[0, 1, 2, 3].map((i) => ({ pts: [rodPts[i], rodPts[i + 1]], color: f >= g[i] ? gapC(i) : C.key, px: f >= g[i] ? 9 : 4, o: 0.95 * fin(f, tFive + 9 * (i + 1), 12) }))]} />
      </HView3D>
      <Svg>
        <path d={linesAt(D.lines.coast_10m, zb[0])} fill="none" stroke={C.key} strokeOpacity={0.55} strokeWidth={1.6} />
        <path d={linesAt(D.lines.borders_10m, zb[0])} fill="none" stroke={C.key} strokeOpacity={0.4} strokeWidth={1.4} strokeDasharray="7 6" />
        <path d={linesAt(D.lines.coast_10m, zb[4])} fill="none" stroke={C.key} strokeOpacity={0.3 * reveal[4]} strokeWidth={1.4} />
        {[0, 1, 2, 3].map((i) => <g key={`r${i}`}>{rim(i, pulse(f, g[i], 40))}{rim(i + 1, pulse(f, g[i], 40))}</g>)}
        {rim(3, pulse(f, tTrop, 40))}
        {zt.map((z, i) => <circle key={`d${i}`} cx={pr.p([rx, ry, z])[0]} cy={pr.p([rx, ry, z])[1]} r={7} fill={C.gold} stroke={C.bg} strokeWidth={2.5} opacity={reveal[i]} />)}
        <g data-lc-maplabel="1">
          <Lbl x={pr.p([rx, ry, 0])[0] - 18} y={pr.p([rx, ry, 0])[1] + 30} t="Trappes" c={C.key} s={T.floor} a="end" o={pr.p([rx, ry, 0])[1] + 30 < 830 ? 1 : 0} />
          <Lbl x={pr.p([rx, ry, zt[3]])[0] - 22} y={pr.p([rx, ry, zt[3]])[1]} t="13 km" c={C.key} s={T.floor} a="end" o={fin(f, AT(k, 2, "thirteen"))} />
          <Lbl x={pr.p([rx, ry, zt[4]])[0] - 22} y={pr.p([rx, ry, zt[4]])[1] - 8} t="16.5 km" c={C.key} s={T.floor} a="end" o={fin(f, AT(k, 0, "sixteen and a half"))} />
        </g>
      </Svg>
      <GlobeFrame id="s09bk" zoom={1} right={1} name="s09b stack" />
      <Svg>
        <Keyword f={f} text="northern France, one moment" at={[1070, 150]} appear={0} out={t1 - 8} s={T.key} />
        <Keyword f={f} text="five levels, up to 16.5 km" at={[1180, 240]} appear={tFive} out={t1 - 8} s={T.key} />
        {/* fix 3 (review 3 Must 8): the holes in the bottom layer are said on its first frame (no TTS change) */}
        <Lbl x={1180} y={340} t="holes: no 1000 hPa level" c={C.muted} s={T.floor} o={fin(f, 0, 10) * fout(f, t1 - 8)} />
        <Lbl x={1180} y={392} t="where the ground is higher" c={C.muted} s={T.floor} o={fin(f, 0, 10) * fout(f, t1 - 8)} />
        {[0, 1, 2, 3].map((i) => <Callout key={`c${i}`} f={f} lines={nf(SK_GAPS[i], 1, true)} at={[1180, rows[i]]} appear={g[i]} target={gapMid(i)} s={T.key} c={gapC(i)} bend={i === 3 ? 30 : 10} />)}
        <Keyword f={f} text="colder going up" at={[1340, 570]} appear={AT(k, 1, "colder going up")} s={T.key} />
        <Keyword f={f} text="warmer going up" at={[1340, 265]} appear={AT(k, 2, "warmer going up")} s={T.key} />
        <Keyword f={f} text="tropopause" at={[1340, 395]} appear={tTrop} targets={[edge175]} s={T.key} />
        <ColourBar x={1180} y={722} w={440} lut={LUT_SK} lo={SKH.range[0]} hi={SKH.range[1]} unit="°C" title="temperature" ticks={[{ v: -60, t: "−60" }, { v: -20, t: "−20" }, { v: 20, t: "20" }]} />
      </Svg>
      <TeX s={EQ_S09B} x={1180} y={100} size={60} o={fin(f, AT(k, 1, "the change in temperature"))} />
      {/* fix 3 (review 3 S8): the first gap worked in full, dim, under the equation, on S1 (values from stack.trappes; CHECK above) */}
      <TeX s={String.raw`(${SKT[1].toFixed(1)}-${SKT[0].toFixed(1)})\ ^{\circ}\mathrm C\ /\ ${(SKZ[1] - SKZ[0]).toFixed(1)}\ \mathrm{km}\approx${SK_GAPS[0].toFixed(1)}`} x={1180} y={210} size={44} c={C.muted}
        o={fin(f, g[0]) * fout(f, t2 - 10)} />
      <SourceBelow text="Data: ERA5 (Copernicus C3S) temperature, 5 of 16 pressure levels · 30 Sep 2026, 12 UTC · northern France" pic={{ x: 1100, y: 40, w: 740, h: 750 }} w={740} o={fin(f, 0, 10)} name="s09b stack" />
    </Scene>
  );
};

// ================================================================ s10 mixed partials commute (x²t, the real four corners)
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_mixed_partials");
  const [lm, rm] = cut2(EQ_S10, "=");
  const A: Ax = { x: 220, y: 120, w: 680, h: 540, xr: [-1.6, 1.6], yr: [16.5, 19.5] };
  const P = axP(A);
  const cn = E8.corners;
  const BL = P(-1, 17), BR = P(1, 17), TL = P(-1, 19), TR = P(1, 19);
  // fix 1 (review S12): the corner values are shown to 2 decimals and turned into 1.4×10⁻⁹ by a CalcStack on the new S11;
  // the "only the order" arrows move to S12
  const t9 = SS(k, 9), tTR = AT(k, 9, "top right"), tTL = AT(k, 9, "minus top left"), tBR = AT(k, 9, "minus bottom right"), tBL = AT(k, 9, "plus bottom"), t10 = SS(k, 11);
  const tCalc = SS(k, 10);
  const cl = (v: number) => nf(v, 2);
  const sum = cn.TR - cn.TL - cn.BR + cn.BL, mixed = sum / (2 * E8.dx_km * 1000 * 7200);
  if (Math.abs(mixed * 1e9 - 1.4) > 0.05 || Math.abs(sum - 0.37) > 0.005) throw new Error(`CHECK s10 corners ${sum} ${mixed}`);
  const r1 = prog(f, t10, t10 + 30), r2 = prog(f, t10 + 36, t10 + 66);
  const early = fout(f, tCalc - 6);
  return (
    <Scene>
      <Svg>
        <Axes A={A} xt={[-1, 0, 1]} yt={[17, 18, 19]} xf={(v) => (v === 0 ? "Brest" : v < 0 ? "18 km W" : "18 km E")} yf={(v) => `${v}:00`} xl="x (east)" yl="t" />
        <rect x={TL[0]} y={TL[1]} width={BR[0] - TL[0]} height={BR[1] - TL[1]} fill="rgba(216,178,58,0.07)" stroke={C.gold} strokeWidth={4} opacity={0.5 + 0.5 * fin(f, t9)} />
        {[[TR, tTR, "+", C.first, cn.TR], [TL, tTL, "−", C.neg, cn.TL], [BR, tBR, "−", C.neg, cn.BR], [BL, tBL, "+", C.first, cn.BL]].map(([p, at, sg, c, v], i) => (
          <g key={i} opacity={fin(f, at as number)}>
            <Dot p={p as Pt} c={c as string} r={16} />
            <Lbl x={(p as Pt)[0]} y={(p as Pt)[1] + ((p as Pt)[1] < 400 ? -44 : 48)} t={`${sg} ${cl(v as number)} °C`} c={c as string} s={T.key} a="middle" />
          </g>
        ))}
        <g opacity={fin(f, t10) * (1 - 0.6 * fin(f, t10 + 36))}>
          <Arrow p={BL} q={lerp(BL, BR, r1)} color={C.gold} w={7} head={26} /><Arrow p={TL} q={lerp(TL, TR, r1)} color={C.gold} w={7} head={26} />
        </g>
        <g opacity={fin(f, t10 + 36)}>
          <Arrow p={BL} q={lerp(BL, TL, r2)} color={C.gold} w={7} head={26} dash="14 10" /><Arrow p={BR} q={lerp(BR, TR, r2)} color={C.gold} w={7} head={26} dash="14 10" />
        </g>
        <Lbl x={(TL[0] + BR[0]) / 2} y={(TL[1] + BR[1]) / 2} t="same four values" c={C.key} s={T.floor} a="middle" o={fin(f, t10 + 66)} />
      </Svg>
      <TeX s={lm} x={MX} y={140} size={68} o={fin(f, AT(k, 1, "ask how fast"))} />
      <Svg><Keyword f={f} text="a partial of a partial" at={[MX + 20, 760]} appear={AT(k, 0, "partial derivative of a partial")} out={SS(k, 6) - 12} /></Svg>
      <TeX s={String.raw`\frac{\partial T}{\partial x}`} x={MX + 40} y={430} size={72} c={C.muted} o={fin(f, AT(k, 1, "eastward slope")) * fout(f, SS(k, 5) - 10)} />
      <TeX s="=" x={MX + 330} y={140} size={84} c={C.gold} o={fin(f, AT(k, 3, "the same answer"))} />
      <TeX s={rm} x={MX + 400} y={140} size={68} o={fin(f, AT(k, 2, "ask how it changes"))} />
      <TeX s={String.raw`T=x^2\,t`} x={MX} y={290} size={64} o={fin(f, SS(k, 4)) * early} />
      <TeX s={String.raw`\frac{\partial T}{\partial x}=2xt\ \to\ \frac{\partial}{\partial t}:\ 2x`} x={MX} y={430} size={64} o={fin(f, SS(k, 5)) * early} />
      <TeX s={String.raw`\frac{\partial T}{\partial t}=x^2\ \to\ \frac{\partial}{\partial x}:\ 2x`} x={MX} y={590} size={64} o={fin(f, SS(k, 6)) * early} />
      <CalcStack f={f} x={MX + 20} y={240} size={54} maxLines={2} rows={[
        ROW(String.raw`\frac{(${cl(cn.TR)}-${cl(cn.TL)}-${cl(cn.BR)}+${cl(cn.BL)})\ ^{\circ}\mathrm C}{36.8\ \mathrm{km}\times2\ \mathrm h}`, tCalc),
        ROW(String.raw`=\frac{${sum.toFixed(2)}\ ^{\circ}\mathrm C}{36\,800\ \mathrm m\times7200\ \mathrm s}`, AT(k, 10, "divided by")),
      ]} />
      <TeX s={String.raw`\text{both}:\ 1.4\times10^{-9}\ ^{\circ}\mathrm C\,\mathrm m^{-1}\,\mathrm s^{-1}`} x={MX} y={730} size={54} c={C.key} o={fin(f, SS(k, 7))}
        glow={pulse(f, AT(k, 10, "the same one point four"), 24)} />
    </Scene>
  );
};

// ================================================================ s11 the total differential: step legs on the landscape
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_total_differential");
  const tE = AT(k, 1, "step east"), tN = AT(k, 1, "step north"), tU = AT(k, 1, "step up"), tT = AT(k, 1, "wait a short time"), tEq = SS(k, 5);
  const morph = prog(f, AT(k, 8, "also changes"), AT(k, 8, "also changes") + 50);
  const S = w3(BGP[0], BGP[1]);
  const E: V3 = [S[0] + 0.7, S[1], S[2]], Es: V3 = [E[0], E[1], (landT(E8.land.T18, BGP[0], BGP[1] + 0.7 / (111.195 * Math.cos((48.5 * Math.PI) / 180) / 100)) + 8) * ZS];
  const latN = BGP[0] + 0.7 / 1.11195, lonE = BGP[1] + 0.7 / (111.195 * Math.cos((48.5 * Math.PI) / 180) / 100);
  const N: V3 = [Es[0], Es[1] + 0.7, Es[2]], Ns: V3 = [N[0], N[1], (landT(E8.land.T18, latN, lonE) + 8) * ZS];
  const [l1, l2] = cut2(EQ_S11, String.raw`+\frac{\partial T}{\partial z}`);
  const line2 = rep(String.raw`+\frac{\partial T}{\partial z}` + l2, String.raw`\frac{\partial T}{\partial t}dt`, String.raw`\textcolor{#aab4c8}{\frac{\partial T}{\partial t}dt}`);
  return (
    <Scene>
      {/* fix 3 (review 3 Must 9): the landscape box ends at y 660 so the s05 colour bar ("temperature (°C) = height") sits below it */}
      <Svg><LandBar x={130} y={742} /></Svg>
      <Landscape box={LAND_BOX} cam={{ az: -112, el: 42, dist: 4.6, target: [0.5, 0.4, 0.9] }} morph={morph} over={(pr) => {
        const pS = pr.p(S);
        return (
          <g>
            <circle cx={pS[0]} cy={pS[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
            <Lbl x={pS[0] - 20} y={pS[1] + 40} t="Brest" c={C.key} s={T.floor} a="end" />
            <Lbl x={pr.p(E)[0]} y={pr.p(E)[1] + 44} t="dx" c={C.second} s={T.key} a="middle" o={fin(f, tE)} />
            <Lbl x={pr.p(N)[0] + 40} y={pr.p(N)[1]} t="dy" c={C.second} s={T.key} o={fin(f, tN)} />
            <Lbl x={pS[0] + 30} y={pr.p([S[0], S[1], S[2] + 0.55])[1]} t="dz" c={C.second} s={T.key} o={0.6 * fin(f, tU)} />
          </g>
        );
      }}>
        <Arrow3D from={S} to={E} color={C.second} px={9} head={28} o={fin(f, tE)} />
        <Rod3D a={E} b={Es} px={7} color={C.neg} o={fin(f, tE + 20)} />
        <Arrow3D from={Es} to={N} color={C.second} px={9} head={28} o={fin(f, tN)} />
        <Rod3D a={N} b={Ns} px={7} color={C.neg} o={fin(f, tN + 20)} />
        <Arrow3D from={S} to={[S[0], S[1], S[2] + 0.5]} color={C.second} px={7} head={24} o={0.5 * fin(f, tU)} />
      </Landscape>
      <Svg>
        <ClockText x={MX + 470} y={110} t="+ dt" h={1} o={fin(f, tT)} />
        <Keyword f={f} text="change everything, a little" at={[MX + 20, 760]} appear={AT(k, 0, "change everything")} out={SS(k, 6) - 12} />
        <Keyword f={f} text="total differential" at={[MX + 20, 555]} appear={SS(k, 6)} />
        <g opacity={fin(f, SS(k, 7)) * fout(f, AT(k, 8, "also changes") - 6)}>
          <path d={`M ${MX + 30} 760 L ${MX + 330} 760 L ${MX + 330} 640 Z`} fill="rgba(170,180,200,0.18)" stroke={C.muted} strokeWidth={3} />
          <Arrow p={[MX + 30, 790]} q={[MX + 330, 790]} color={C.second} w={6} head={22} />
          <Lbl x={MX + 360} y={700} t="rise = slope × step" c={C.key} s={T.floor} />
          <Lbl x={MX + 30} y={625} t="like a hillside" c={C.key} s={T.floor} />
        </g>
        <Lbl x={MX + 20} y={700} t="unlike: it changes in time" c={C.local} s={T.key} o={fin(f, AT(k, 8, "also changes"))} />
      </Svg>
      <TeX s={l1} x={MX} y={260} size={66} o={fin(f, tEq)} />
      <TeX s="dx" x={MX + 20} y={110} size={64} c={C.second} o={fin(f, tE)} />
      <TeX s="dy" x={MX + 160} y={110} size={64} c={C.second} o={fin(f, tN)} />
      <TeX s="dz" x={MX + 300} y={110} size={64} c={C.second} o={fin(f, tU)} />
      <TeX s={line2} x={MX + 60} y={420} size={66} o={fin(f, AT(k, 5, "by partial z"))} />
    </Scene>
  );
};

// ================================================================ s12 the total differential near Brest (rounded slopes)
// fix 2 (review 2 Should 6, §5b): the map ends at y 680; "10 km", "20 km" and "+ 30 min" sit below it with gold links
// fix 3 (review 3 Must 9): the map ends at y 600 (same scale, less latitude) so the readings row (y 640) and the s04 colour bar
// (y 742) both fit below it
const B12 = boxAt(48.55, -4.35, 0.8 * 560 / 780, 80, 40, 920, 560);
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12_total_example");
  const P = mapP(B12);
  const pB = P(BGP[0], BGP[1]), pE = P(BGP[0], BGP[1] + 10 * KM_LON), pN = P(BGP[0] + 20 * KM_LAT, BGP[1] + 10 * KM_LON);
  const tLeg = SS(k, 1), r1 = AT(k, 2, "times ten kilometres"), r2 = AT(k, 3, "times twenty"), r3 = AT(k, 4, "times half an hour"), r4 = SS(k, 5);
  return (
    <Scene>
      <MapView id="s12" B={B12} L={{ t850: [{ h: 18, o: 1 }], dim: 0.15, coast: 0.9 }} children={() => (
        <g>
          <Arrow p={pB} q={lerp(pB, pE, prog(f, tLeg, tLeg + 20))} color={C.gold} w={9} head={30} />
          <Arrow p={pE} q={lerp(pE, pN, prog(f, tLeg + 20, tLeg + 40))} color={C.gold} w={9} head={30} o={fin(f, tLeg + 20)} />
          <Dot p={pB} c={C.gold} r={12} />
        </g>
      )} over={() => (
        <g>
          <Lbl x={pB[0] - 24} y={pB[1] - 40} t="Brest" c={C.key} s={T.floor} a="end" />
        </g>
      )} />
      <Svg>
        <Callout f={f} lines="10 km" at={[110, 640]} appear={tLeg + 10} target={[(pB[0] + pE[0]) / 2, pB[1] + 14]} s={T.key} bend={-30} />
        <Callout f={f} lines="20 km" at={[340, 640]} appear={tLeg + 30} target={[pE[0] + 14, (pE[1] + pN[1]) / 2]} s={T.key} bend={40} />
        <ClockText x={640} y={640} t="+ 30 min" h={0.5} o={fin(f, AT(k, 1, "half an hour"))} />
        <T850Bar x={130} y={742} />
      </Svg>
      <CalcStack f={f} x={MX + 390} y={90} size={60} maxLines={4} rows={[
        ROW(String.raw`= -0.32`, r1, String.raw`\frac{-3.2}{100}\times10`),
        ROW(String.raw`= -0.50`, r2, String.raw`\frac{-2.5}{100}\times20`),
        ROW(String.raw`= +1.45`, r3, String.raw`2.9\times0.5`, { lc: C.local }),
        ROW(String.raw`\approx +0.63\ ^{\circ}\mathrm C`, r4, "dT", { c: C.key, ul: r4 + 10 }),
      ]} />
      <Svg>
        <CurvedLink f={f} from={[(pB[0] + pE[0]) / 2, pB[1] - 16]} to={[MX + 60, 130]} start={r1} end={r4} bend={290} />
        <CurvedLink f={f} from={[pE[0] + 14, (pE[1] + pN[1]) / 2]} to={[MX + 60, 220]} start={r2} end={r4} bend={20} />
        <Keyword f={f} text="small steps only" at={[MX + 40, 600]} appear={SS(k, 6)} />
      </Svg>
      <TeX s={EQ_S12} x={MX} y={740} size={44} c={C.muted} o={0} />
      <TeX s={cut2(EQ_S11, String.raw`+\frac{\partial T}{\partial z}`)[0] + String.raw`+\cdots`} x={MX} y={730} size={54} c={C.muted} o={fin(f, 4) * fout(f, SS(k, 6) - 10)} />
    </Scene>
  );
};

// ================================================================ s13 the chain rule along a moving path
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = K("s13_chain_rule");
  const path: [number, number][] = [];
  for (let i = 0; i <= 40; i++) path.push([48.0 + 0.025 * i, -7.2 + 0.13 * i]);
  const fly = prog(f, SS(k, 1), SE(k, 4));
  const idx = fly * (path.length - 1), i0 = Math.min(path.length - 2, Math.floor(idx)), w = idx - i0;
  const pos: [number, number] = [mix(path[i0][0], path[i0 + 1][0], w), mix(path[i0][1], path[i0 + 1][1], w)];
  const hgt = (la: number, lo: number): V3 => { const p = w3(la, lo); return [p[0], p[1], p[2] + 0.25]; };
  const tRes = SS(k, 7);
  const [r1, r2] = cut2(EQ_S13, String.raw`+\frac{dY}{dt}`);
  const teal = (s: string) => s.replace(/\\frac\{d([XYZ])\}\{dt\}\\frac\{\\partial T\}\{\\partial ([xyz])\}/g, String.raw`\textcolor{#2aa198}{\frac{d$1}{dt}\frac{\partial T}{\partial $2}}`)
    .replace(String.raw`=\frac{\partial T}{\partial t}`, String.raw`=\textcolor{#aab4c8}{\frac{\partial T}{\partial t}}`);
  const idxParts: Part[] = [{ t: String.raw`\frac{dX_j}{dt}\frac{\partial T}{\partial x_j}`, c: C.first, u: { w: String.raw`j\ \text{summed}`, c: C.gold } }];
  return (
    <Scene>
      <Svg><LandBar x={130} y={742} /></Svg>
      <Landscape box={LAND_BOX} cam={{ az: -108, el: 38, dist: 7.0, target: [0, 0.3, 0.8] }} over={(pr) => {
        const pp = path.map(([la, lo]) => pr.p(hgt(la, lo)));
        const pc = pr.p(hgt(pos[0], pos[1]));
        const ahead = pr.p(hgt(path[Math.min(path.length - 1, i0 + 3)][0], path[Math.min(path.length - 1, i0 + 3)][1]));
        const ang = (Math.atan2(-(ahead[1] - pc[1]), ahead[0] - pc[0]) * 180) / Math.PI;
        return (
          <g>
            <path d={poly(pp)} stroke={C.first} strokeWidth={5} fill="none" strokeDasharray="14 10" opacity={fin(f, SS(k, 1))} />
            <Plane p={pc} a={ang} s={1.3} o={fin(f, SS(k, 1))} />
            <Arrow p={pc} q={[pc[0] + (ahead[0] - pc[0]) * 1.2, pc[1] + (ahead[1] - pc[1]) * 1.2]} color={C.first} w={8} head={28} o={fin(f, AT(k, 3, "moves east")) * fout(f, SS(k, 5))} />
          </g>
        );
      }} />
      <TeX s={String.raw`dX=\frac{dX}{dt}\,dt`} x={MX} y={140} size={64} c={C.first} o={fin(f, AT(k, 3, "which is")) * fout(f, tRes)} />
      <TeX s={cut2(EQ_S11, String.raw`+\frac{\partial T}{\partial z}`)[0] + String.raw`+\cdots`} x={MX} y={300} size={56} c={C.muted} o={fin(f, 4) * fout(f, SS(k, 5))} />
      <TeX s={String.raw`X(t),\ Y(t),\ Z(t)`} x={MX} y={140} size={60} c={C.first} o={fin(f, AT(k, 2, "capital X")) * fout(f, AT(k, 3, "which is") - 10)} />
      {(() => {
        // fix 2 (review 2 Should 6, §5b): the plane's position label lives in the maths zone; a gold link points at the plane
        const st13 = orbitCam({ az: -108, el: 38, dist: 7.0, target: [0, 0.3, 0.8], fov: 32 }, [LAND_BOX.w / 2, LAND_BOX.h / 2]);
        const pr13 = projector(st13, LAND_BOX.w, LAND_BOX.h, LAND_BOX.x, LAND_BOX.y);
        const pc = pr13.p(hgt(pos[0], pos[1]));
        return <Svg><CurvedLink f={f} from={[MX - 12, 175]} to={[pc[0] + 40, pc[1] - 24]} start={AT(k, 2, "capital X") + 6} end={AT(k, 3, "which is") - 12} bend={60} /></Svg>;
      })()}
      <TeX s={String.raw`dT=\frac{\partial T}{\partial t}dt+\frac{dX}{dt}dt\,\frac{\partial T}{\partial x}+\cdots`} x={MX} y={300} size={56} o={fin(f, SS(k, 5)) * fout(f, tRes)} />
      <TeX s={String.raw`\frac{dT}{\cancel{dt}}=\frac{\partial T}{\partial t}\cancel{dt}+\frac{dX}{dt}\cancel{dt}\,\frac{\partial T}{\partial x}+\cdots`} x={MX} y={460} size={56}
        o={fin(f, AT(k, 5, "divide everything")) * fout(f, tRes)} />
      <TeX s={teal(r1)} x={MX} y={170} size={64} o={fin(f, tRes)} />
      <TeX s={teal(String.raw`+\frac{dY}{dt}` + r2)} x={MX + 90} y={340} size={64} o={fin(f, AT(k, 7, "plus d Y"))} />
      <Svg><Keyword f={f} text="chain rule" at={[MX + 20, 490]} appear={SS(k, 8)} /></Svg>
      <Layered parts={idxParts} x={MX + 40} y={690} size={72} o={fin(f, SS(k, 9))} layers={[{ t: "all", o: 1 }, { t: [], u: [0], o: fin(f, AT(k, 9, "with j summed")) }]} />
    </Scene>
  );
};

// ================================================================ s14 reading the chain rule term by term
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14_chain_meaning");
  const parts: Part[] = [
    { t: String.raw`\frac{\partial T}{\partial t}`, c: C.local, u: { w: String.raw`\text{fixed place}`, c: C.local } },
    { t: "+" },
    { t: String.raw`\frac{dX_j}{dt}\frac{\partial T}{\partial x_j}`, c: C.first, u: { w: String.raw`\text{speed}\times\text{slope}`, c: C.gold } },
  ];
  void EQ_S14;
  const tSlide = SS(k, 4);
  const path: [number, number][] = [];
  for (let i = 0; i <= 30; i++) path.push([47.0 + 0.09 * i, -8.2 + 0.2 * i]);
  const s = prog(f, tSlide, SE(k, 4));
  const ix = s * (path.length - 1), j0 = Math.min(path.length - 2, Math.floor(ix)), ww = ix - j0;
  const pos: [number, number] = [mix(path[j0][0], path[j0 + 1][0], ww), mix(path[j0][1], path[j0 + 1][1], ww)];
  const Tp = landT(E8.land.T18, pos[0], pos[1]);
  const tIc = SS(k, 5);
  return (
    <Scene>
      <Svg><LandBar x={130} y={742} /></Svg>
      <Landscape box={LAND_BOX} cam={{ az: -100, el: 36, dist: 7.6, target: [0, 0.1, 0.75] }} over={(pr) => {
        const pc = pr.p([wx(pos[1]), wy(pos[0]), (Tp + 8) * ZS + 0.04]);
        return (
          <g opacity={fin(f, tSlide - 10)}>
            <path d={poly(path.map(([la, lo]) => pr.p(w3(la, lo))))} stroke={C.first} strokeWidth={4} fill="none" strokeDasharray="10 8" opacity={0.8} />
            <circle cx={pc[0]} cy={pc[1]} r={14} fill={C.first} stroke={C.bg} strokeWidth={4} />
            {/* fix 1 (review S15): the unspoken °C readout is gone; the thermometer's level still falls as it slides */}
            <Thermo x={pc[0] + 44} y={pc[1] - 10} h={90} level={(Tp + 6) / 22} />
          </g>
        );
      }} />
      <Layered parts={parts} x={MX} y={190} size={84} o={1}
        layers={[{ t: "all", o: 1 }, { t: [], u: [0], o: fin(f, SS(k, 1)) }, { t: [], u: [2], o: fin(f, SS(k, 2)) }]} />
      <TeX s={String.raw`\frac{\mathrm m}{\mathrm s}\times\frac{^{\circ}\mathrm C}{\mathrm m}=\frac{^{\circ}\mathrm C}{\mathrm s}`} x={MX} y={420} size={64}
        o={fin(f, SS(k, 3)) * fout(f, AT(k, 3, "gives degrees"))} />
      <TeX s={String.raw`\frac{\textcolor{#d9667f}{\cancel{\textcolor{#e8ecf4}{\mathrm m}}}}{\mathrm s}\times\frac{^{\circ}\mathrm C}{\textcolor{#d9667f}{\cancel{\textcolor{#e8ecf4}{\mathrm m}}}}=\frac{^{\circ}\mathrm C}{\mathrm s}`}
        x={MX} y={420} size={64} o={fin(f, AT(k, 3, "gives degrees"))} />
      <Svg>
        <Lbl x={MX} y={530} t="every term: a rate in time" c={C.key} s={T.floor} o={fin(f, AT(k, 3, "every term"))} />
        <g opacity={fin(f, tIc)}>
          <Car p={[MX + 70, 700]} s={1.1} />
          <Arrow p={[MX + 30, 770]} q={[MX + 110, 770]} color={C.first} w={6} head={20} />
          <Plane p={[MX + 330, 690]} s={1.3} />
          <Arrow p={[MX + 270, 770]} q={[MX + 470, 770]} color={C.first} w={6} head={20} />
          <Sonde p={[MX + 620, 730]} s={1} />
          <Arrow p={[MX + 680, 790]} q={[MX + 680, 690]} color={C.first} w={6} head={20} />
        </g>
      </Svg>
    </Scene>
  );
};

// ================================================================ s15 the car on a frozen made-up road (easy numbers)
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_chain_easy");
  const x0 = 120, pxkm = 2.6, yR = 460;
  const t0 = SS(k, 2), t1 = LEN(k) - 10;
  const hrs = mix(0, 2.8, clamp((f - t0) / (t1 - t0), 0, 1));
  const carX = x0 + 40 + hrs * 100 * pxkm;
  const Tcar = 10 - 0.03 * hrs * 100;
  return (
    <Scene>
      <Svg>
        <rect x={80} y={120} width={920} height={600} fill="#1d2a44" stroke={C.grid} strokeWidth={3} />
        {/* fix 3 (review 3 S1; the K6 contour / map-label exemptions removed): the isotherms run only from under their degree
            labels to the road (y 195-420), so no readout sits on them; the car's readout and clock move to the row above the
            panel, "100 km/h" rides under the road with the car, and the −0.03 bracket sits in the clean band below the road,
            under the two isotherms it measures */}
        {Array.from({ length: 11 }, (_, i) => {
          const x = x0 + i * 33 * pxkm;
          if (x > 990) return null;
          return <g key={i}>
            <line x1={x} y1={195} x2={x} y2={yR - 24} stroke={lutCss(LUT_T, clamp((10 - i + 6) / 22, 0, 1))} strokeWidth={4} opacity={0.9} />
            <Lbl x={x} y={165} t={`${10 - i}°`} c={C.muted} s={T.floor} a="middle" />
          </g>;
        })}
        <rect x={80} y={yR - 24} width={920} height={48} fill="#2a3149" />
        <line x1={80} y1={yR} x2={1000} y2={yR} stroke={C.key} strokeWidth={3} strokeDasharray="22 16" />
        <g transform={`translate(${x0 + 4 * 33 * pxkm + 40} ${yR - 30})`}><PoleThermometer x={0} y={0} /></g>
        <Lbl x={x0 + 4 * 33 * pxkm + 40} y={yR + 125} t="fixed: no change" c={C.local} s={T.floor} a="middle" o={fin(f, SS(k, 5))} />
        <Car p={[carX, yR - 8]} s={1.2} o={fin(f, SS(k, 2) - 10)} />
        <Lbl x={carX} y={yR + 62} t="100 km/h" c={C.first} s={T.floor} a="middle" o={fin(f, AT(k, 2, "one hundred"))} />
        <Bracket p={[x0 + 33 * pxkm * 6, 640]} q={[x0 + 33 * pxkm * 7, 640]} off={0} c={C.ink} o={fin(f, AT(k, 2, "zero point zero three"))} />
        <Lbl x={x0 + 33 * pxkm * 6.5} y={680} t="−0.03 °C per km" c={C.neg} s={T.floor} a="middle" o={fin(f, AT(k, 2, "zero point zero three"))} />
        <Lbl x={100} y={80} t="made-up frozen map" c={C.muted} s={T.floor} o={fin(f, SS(k, 1))} />
        <Lbl x={572} y={80} t={`car: ${nf(Tcar, 1)} °C`} c={C.key} s={T.key} o={fin(f, SS(k, 2))} />
        <ClockText x={925} y={80} t={`${hrs.toFixed(1)} h`} h={hrs} s={T.floor} o={fin(f, SS(k, 2))} />
      </Svg>
      <TeX s={String.raw`\frac{\partial T}{\partial t}=0`} x={MX} y={130} size={68} c={C.local} o={fin(f, AT(k, 1, "is zero"))} />
      <CalcStack f={f} x={MX + 170} y={250} size={54} rows={[
        ROW(String.raw`=100\ \tfrac{\mathrm{km}}{\mathrm h}\times\left(-0.03\ \tfrac{^{\circ}\mathrm C}{\mathrm{km}}\right)`, SS(k, 3), String.raw`\frac{dT}{dt}`),
        ROW(String.raw`=100\ \tfrac{\textcolor{#d9667f}{\cancel{\textcolor{#e8ecf4}{\mathrm{km}}}}}{\mathrm h}\times\left(-0.03\ \tfrac{^{\circ}\mathrm C}{\textcolor{#d9667f}{\cancel{\textcolor{#e8ecf4}{\mathrm{km}}}}}\right)`, AT(k, 4, "cancel")),
        ROW(String.raw`=-3\ ^{\circ}\mathrm{C/h}`, AT(k, 4, "minus three"), undefined, { c: C.neg }),
      ]} />
      <TeX s={EQ_S15} x={MX} y={700} size={44} c={C.muted} o={0} />
      <Svg><Keyword f={f} text="frozen map" at={[MX + 20, 700]} appear={AT(k, 1, "frozen map")} />
        <Keyword f={f} text="the simplest case" at={[MX + 20, 130]} appear={AT(k, 0, "simplest")} out={AT(k, 1, "is zero") - 12} /></Svg>
    </Scene>
  );
};

// ================================================================ s16, s17 a thought experiment: a plane over Brest flying east, then west
// fix 2 (review 2 Should 6, §5b): the map ends at y 510; the plane's and the place's readings sit below it with gold links
// fix 3 (review 3 Must 9): a 920 × 320 strip (same scale; the flight runs along one latitude) so the readings (y 400), the s16
// graph (y 470-560) or the s17 summary rows (y 470, 580) and the s04 colour bar (y 742) all fit below it
const B16 = boxAt(48.6, -2.3, 3.6 * 320 / 560, 80, 40, 920, 320);
const FlightMap: React.FC<{ hour: number; plane?: { lon: number; a: number; o: number }; pole: number; children?: (P: Proj) => React.ReactNode; dim?: number }> = ({ hour, plane, pole, children, dim = 0 }) => (
  <MapView id="s16" B={B16} L={{ t850: hourLayers(hour), coast: 0.85, dim }} children={(P) => {
    const pb = P(BREST[0], BREST[1]);
    return (
      <g>
        <g transform={`translate(${pb[0]} ${pb[1]}) scale(1.1) translate(${-pb[0]} ${-pb[1]})`}><PoleThermometer x={pb[0]} y={pb[1]} /></g>
        {plane && plane.o > 0 ? <Plane p={P(BGP[0] + 0.25, plane.lon)} a={plane.a} s={1.3} o={plane.o} /> : null}
        {children ? children(P) : null}
      </g>
    );
  }} />
);
const S16: React.FC = () => {
  // fix 1: new S3 "Let's call its speed east capital U" (review S2) shifts S3… by one; "if these rates held for a whole hour"
  // (S17) is said on S9; the speed label flips to the left of the plane near the map edge (M2); the stack ends before x 1840
  const f = useCurrentFrame(), k = K("s16_flight_east");
  const tGo = AT(k, 1, "flying due east"), tEnd = SE(k, 8), tU = SS(k, 2);
  const t = clamp((f - tGo) / (tEnd - tGo), 0, 1);              // simulated hours since 18 UTC (0..1), "if these rates held"
  const lon = BGP[1] + (t * 360) * KM_LON;
  const Tpole = E8.pt["18"] + E8.dTdt * t, Tpl = E8.pt["18"] + E8.plane.east * t;
  const A: Ax = { x: 250, y: 470, w: 660, h: 90, xr: [0, 1], yr: [-4, 10] };
  const PA = axP(A);
  void EQ_S16;
  return (
    <Scene>
      <FlightMap hour={18 + t} pole={Tpole} plane={{ lon, a: 0, o: fin(f, SS(k, 1)) }} children={(P) => {
        const pp = P(BGP[0] + 0.25, lon);
        return (
          <g opacity={fin(f, tGo)}>
            <Arrow p={[pp[0] + 50, pp[1]]} q={[pp[0] + 170, pp[1]]} color={C.first} w={8} head={28} />
          </g>
        );
      }} />
      <Svg>
        {(() => {
          const Pm = mapP(B16), pp = Pm(BGP[0] + 0.25, lon), pb = Pm(BREST[0], BREST[1]);
          const sp = (fin(f, tU) > 0 ? "U = 100 m/s" : "100 m/s") + " ≈ 360 km/h";
          return <>
            <Callout f={f} lines={`plane ${nf(Tpl, 1)} °C`} at={[560, 400]} appear={fin(f, SS(k, 1)) > 0 ? SS(k, 1) : 1e9} target={[pp[0] - 6, pp[1] + 30]} s={T.key} c={C.first} bend={40} />
            <Callout f={f} lines={`place ${nf(Tpole, 1)} °C`} at={[110, 400]} appear={0} target={[pb[0] - 24, pb[1] + 24]} s={T.key} c={C.local} bend={-30} />
            {/* the speed sits in the maths zone until the calculation starts (it is then in the rows), linked to the arrow */}
            <Callout f={f} lines={sp} at={[MX + 20, 110]} appear={AT(k, 1, "three hundred and sixty")} out={AT(k, 4, "plus two point nine") - 12}
              target={[pp[0] + 110, pp[1] - 14]} s={T.key} c={C.first} bend={40} />
          </>;
        })()}
        <Axes A={A} xt={[0, 0.5, 1]} yt={[0, 8]} xf={(v) => `${v} h`} grid={false} />
        <path d={poly([0, 0.25, 0.5, 0.75, 1].filter((x) => x <= t + 1e-6).concat([t]).map((x) => PA(x, E8.pt["18"] + E8.dTdt * x)))} stroke={C.local} strokeWidth={5} fill="none" strokeDasharray="14 9" />
        <path d={poly([0, 0.25, 0.5, 0.75, 1].filter((x) => x <= t + 1e-6).concat([t]).map((x) => PA(x, E8.pt["18"] + E8.plane.east * x)))} stroke={C.first} strokeWidth={5} fill="none" />
        <Lbl x={A.x + A.w + 40} y={PA(1, E8.pt["18"] + E8.dTdt)[1]} t="place" c={C.local} s={T.floor} o={t > 0.95 ? 1 : 0} />
        <Lbl x={A.x + A.w + 40} y={PA(1, E8.pt["18"] + E8.plane.east)[1] - 18} t="plane" c={C.first} s={T.floor} o={t > 0.95 ? 1 : 0} />
      </Svg>
      <CalcStack f={f} x={MX + 170} y={90} size={50} maxLines={4} rows={[
        ROW(String.raw`=+2.9\ ^{\circ}\mathrm{C/h}`, AT(k, 4, "plus two point nine"), String.raw`\frac{\partial T}{\partial t}`, { c: C.local, lc: C.local }),
        ROW(String.raw`=100\times(-3.2\times10^{-5})`, SS(k, 6), String.raw`U\frac{\partial T}{\partial x}`, { c: C.first, lc: C.first }),
        ROW(String.raw`=-0.0032\ ^{\circ}\mathrm{C/s}`, AT(k, 6, "is minus"), undefined, { c: C.first, cont: true }),
        ROW(String.raw`\times3600=-11.5\ ^{\circ}\mathrm{C/h}`, SS(k, 7), undefined, { c: C.first }),
        ROW(String.raw`\approx+2.9-11.5`, SS(k, 8), String.raw`\frac{dT}{dt}`, { c: C.neg }),
        ROW(String.raw`=-8.6\ ^{\circ}\mathrm{C/h}`, AT(k, 8, "falls at"), undefined, { c: C.neg, cont: true }),
      ]} />
      <Svg><Keyword f={f} text="cools while places warm" at={[MX + 20, 790]} appear={SS(k, 9)} />
        </Svg>
      <Svg><Lbl x={250} y={646} t="if the rates held for 1 h" c={C.muted} s={T.floor} o={fin(f, AT(k, 8, "if these rates"))} />
        <T850Bar x={130} y={742} /></Svg>
      <TeX s={String.raw`\frac{dT}{dt}=\frac{\partial T}{\partial t}+U\frac{\partial T}{\partial x}`} x={MX} y={680} size={60} c={C.muted} o={fin(f, tU) * fout(f, SS(k, 8))} />
      {/* QA halves: the chain rule is on screen from the start; U joins it on S3 */}
      <TeX s={String.raw`\frac{dT}{dt}=\frac{\partial T}{\partial t}+\cdots`} x={MX} y={680} size={60} c={C.muted} o={fin(f, 4) * fout(f, tU)} />
    </Scene>
  );
};
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_flight_west");
  const tTurn = SS(k, 0), tGo = AT(k, 0, "fly due west"), tEnd = SE(k, 2);
  const turn = prog(f, tTurn, tGo);
  const t = clamp((f - tGo) / (tEnd - tGo), 0, 1);
  const lon = BGP[1] - t * 110 * KM_LON;
  const Tpl = E8.pt["18"] + E8.plane.west * t * (110 / 360);
  // fix 3 (review 3 S7): the place warms with the same clock as the plane (110 km at 360 km/h ≈ 0.31 h), as in s16
  const hrs = t * (110 / 360), Tpole = E8.pt["18"] + E8.dTdt * hrs;
  const tSum = SS(k, 3);
  return (
    <Scene>
      <FlightMap hour={18 + hrs} pole={Tpole} dim={0.35 * fin(f, tSum)} plane={{ lon, a: 180 * turn, o: 1 }} children={(P) => {
        const pp = P(BGP[0] + 0.25, lon);
        return (
          <g opacity={fin(f, tGo) * fout(f, tSum)}>
            <Arrow p={[pp[0] - 50, pp[1]]} q={[pp[0] - 170, pp[1]]} color={C.first} w={8} head={28} />
          </g>
        );
      }} />
      <Svg>
        {(() => {
          // fix 2 (review 2 Should 6, §5b): the readings below the map, linked
          const Pm = mapP(B16), pp = Pm(BGP[0] + 0.25, lon), pb = Pm(BREST[0], BREST[1]);
          return <>
            <Callout f={f} lines={`plane ${nf(Tpl, 1)} °C`} at={[110, 400]} appear={0} out={tSum} target={[pp[0] + 6, pp[1] + 30]} s={T.key} c={C.first} bend={-30} />
            <Callout f={f} lines={`place ${nf(Tpole, 1)} °C`} at={[560, 400]} appear={0} out={tSum} target={[pb[0] + 22, pb[1] - 40]} s={T.key} c={C.local} bend={40} />
          </>;
        })()}
        {/* fix 3: the summary rows sit above the colour bar; review 3 S6: the thermometer 40 px clear of "°C/h" */}
        <g opacity={fin(f, tSum + 8)}>
          <Plane p={[200, 480]} s={1.2} />
          <Lbl x={250} y={480} t="→ −8.6 °C/h" c={C.neg} s={T.key} />
          <g transform="translate(600 520)"><PoleThermometer x={0} y={0} /></g>
          <Lbl x={640} y={480} t="+2.9 °C/h" c={C.local} s={T.key} />
          <Plane p={[200, 590]} a={180} s={1.2} />
          <Lbl x={250} y={590} t="← +14.4 °C/h" c={C.first} s={T.key} />
        </g>
        <T850Bar x={130} y={742} />
      </Svg>
      {/* fix 1 (review M2): the sum is split at "≈" so the stack ends before x 1840 */}
      <CalcStack f={f} x={MX + 170} y={100} size={50} rows={[
        ROW(String.raw`=+11.5\ ^{\circ}\mathrm{C/h}`, AT(k, 1, "plus eleven"), String.raw`U\frac{\partial T}{\partial x}`, { c: C.first, lc: C.first }),
        ROW(cut2(rep(EQ_S17, String.raw`\frac{dT}{dt}=`, "="), String.raw`\approx`)[0], SS(k, 2), String.raw`\frac{dT}{dt}`, { c: C.first }),
        ROW(String.raw`\approx` + cut2(EQ_S17, String.raw`\approx`)[1], AT(k, 2, "fourteen point four"), undefined, { c: C.first, cont: true }),
      ]} />
      <TeX s={String.raw`\frac{dT}{dt}=\frac{\partial T}{\partial t}+U\frac{\partial T}{\partial x}`} x={MX} y={600} size={60} c={C.muted} o={fin(f, 4) * fout(f, SS(k, 4) - 10)} />
      <TeX s={String.raw`\frac{dT}{dt}`} x={MX} y={520} size={72} c={C.first} o={fin(f, AT(k, 4, "belongs to the traveller"))} />
      <TeX s={String.raw`\frac{\partial T}{\partial t}`} x={MX} y={690} size={72} c={C.local} o={fin(f, AT(k, 4, "belongs to the place"))} />
      <Svg>
        <Lbl x={MX + 160} y={520} t="the traveller" c={C.key} s={T.key} o={fin(f, AT(k, 4, "belongs to the traveller"))} />
        <Lbl x={MX + 160} y={690} t="the place" c={C.local} s={T.key} o={fin(f, AT(k, 4, "belongs to the place"))} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s18 a real traveller: the Trappes balloon's own rate
const ProfAx: Ax = { x: 250, y: 90, w: 700, h: 640, xr: [-20, 25], yr: [0, 7] };
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_balloon_rate");
  const tUp = SS(k, 1), tTop = SE(k, 1);
  const s = prog(f, tUp, tTop);
  const zb = mix(Z85, Z50, s), et = mix(312, 1212, s), Tb = Tat(zb);
  const A = ProfAx, P = axP(A);
  const p85 = P(T85, Z85), p50 = P(T50, Z50);
  void EQ_S18;
  return (
    <Scene>
      <Svg>
        <ClipRect id="s18c" A={A} pad={4} />
        <Axes A={A} xt={[-20, -10, 0, 10, 20]} yt={[0, 2, 4, 6]} xl="temperature (°C)" yl="height (km)" />
        <ProfileLine A={A} zTop={zb} clip="s18c" />
        <ProfileLine A={A} zTop={7} c={C.local} w={3} o={0.3} clip="s18c" />
        <Dot p={p85} c={C.gold} r={11} /><Dot p={p50} c={C.gold} r={11} o={s > 0.99 ? 1 : 0} />
        <Sonde p={P(Tb, zb)} s={1.1} />
        <Lbl x={P(Tb, zb)[0] + 40} y={P(Tb, zb)[1] - 60} t={`${nf(Tb, 1)} °C`} c={C.key} s={T.key} />
        <ClockText x={300} y={600} s={T.floor} t={`${Math.round(et)} s after launch`} h={et / 300} o={fin(f, SS(k, 1) - 10)} />
        <Lbl x={280} y={664} t={`${nf((et - 312) / 60, 1)} min since 1.5 km`} c={C.local} s={T.floor} o={fin(f, SS(k, 1) - 10)} />
        <g opacity={fin(f, SS(k, 5))}>
          {["fixed place", "sideways", "rising"].map((t, i) => (
            <g key={t}>
              <Lbl x={MX} y={640 + i * 62} t={t} c={[C.local, C.first, C.first][i]} s={T.floor} />
              <rect x={MX + 270} y={620 + i * 62} width={360} height={40} fill="none" stroke={C.muted} strokeWidth={3} strokeDasharray="10 8" />
              <Lbl x={MX + 450} y={640 + i * 62} t="?" c={C.key} s={T.floor} a="middle" />
            </g>
          ))}
        </g>
      </Svg>
      <TeX s={String.raw`\frac{dT}{dt}=\cdots+\frac{dZ}{dt}\frac{\partial T}{\partial z}`} x={MX} y={560} size={60} c={C.muted} o={fin(f, 4) * fout(f, SS(k, 3) - 10)} />
      <Svg><Keyword f={f} text="a real traveller" at={[MX + 20, 760]} appear={4} out={SS(k, 5) - 12} /></Svg>
      <CalcStack f={f} x={MX + 200} y={100} size={54} maxLines={5} rows={[
        ROW(String.raw`\approx\frac{4260\ \mathrm m}{900\ \mathrm s}`, AT(k, 2, "divided by"), String.raw`\frac{dZ}{dt}`, { c: C.first, lc: C.first }),
        ROW(String.raw`\approx4.7\ \mathrm{m/s}`, AT(k, 2, "four point seven"), undefined, { c: C.first }),
        ROW(String.raw`\approx\frac{-24.1\ ^{\circ}\mathrm C}{900\ \mathrm s}`, SS(k, 3), String.raw`\frac{dT}{dt}`),
        ROW(String.raw`\approx-0.027\ ^{\circ}\mathrm{C/s}`, SS(k, 4), undefined, { c: C.neg }),
        ROW(String.raw`\approx-1.6\ ^{\circ}\mathrm{C/min}`, AT(k, 4, "one point six"), undefined, { c: C.neg }),
      ]} />
    </Scene>
  );
};

// ================================================================ s19 sizing the three kinds of term
const S19: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19_balloon_terms");
  const A: Ax = { x: 250, y: 80, w: 700, h: 300, xr: [-20, 0], yr: [4, 7] };
  const P = axP(A);
  const T00 = Tat0(Z50);
  const B = boxAt(48.85, 2.15, 0.9, 80, 470, 560, 350);
  const tFix = SS(k, 1), tSide = SS(k, 4), tRise = SS(k, 7), tShare = SS(k, 8);
  // fix 3 (review 3 S12): the bars start at x 1370 (24 px clear of "fixed place") at 102 px per decade, so the longest bar and
  // the 10⁻² tick still end before x 1840
  const KB = 102;
  const bar = (v: number) => (Math.log10(Math.abs(v)) + 6) * KB;
  const X0 = MX + 270;
  const rows: [string, number, string, string, number][] = [
    // fix 1 (review S1): signed values, as said (snd.fixed −5.98e-5, snd.side −3.27e-5)
    ["fixed place", SN.fixed, C.local, String.raw`-6\times10^{-5}`, AT(k, 3, "minus six")],
    ["sideways", SN.side, C.first, String.raw`-3\times10^{-5}`, AT(k, 6, "minus three")],
    ["rising", SN.dTdt, C.first, String.raw`-0.027`, AT(k, 7, "is minus")],
  ];
  const plain = String.raw`\frac{dT}{dt}=\frac{\partial T}{\partial t}+u\frac{\partial T}{\partial x}+v\frac{\partial T}{\partial y}+w\frac{\partial T}{\partial z}`;
  const dr = SN.drift;
  return (
    <Scene>
      <Svg>
        <ClipRect id="s19c" A={A} pad={4} />
        <Axes A={A} xt={[-20, -15, -10, -5, 0]} yt={[4, 5, 6, 7]} xl="°C" yl="km" />
        {/* fix 3 (review 3 Must 2): the K6 exemptions on the two curves are gone; "−2.6 °C in 12 h" sits right of the bracket
            (level with it), in the empty part of the plot, so neither curve runs through it */}
        <ProfileLine A={A} zTop={7} zBot={3.5} c={C.muted} w={4} o={0.7 * fin(f, tFix)} clip="s19c" z={(SN.z00 as number[]).map((v) => v / 1000)} t={SN.T00} />
        <ProfileLine A={A} zTop={7} zBot={3.5} clip="s19c" o={1 - 0.6 * fin(f, SS(k, 9))} />
        <ProfileLine A={A} zTop={7} zBot={3.5} c={C.gold} w={7} clip="s19c" o={fin(f, SS(k, 9))} />
        <Lbl x={P(-4, 5.5)[0]} y={P(-4, 5.5)[1]} t="00 UTC" c={C.muted} s={T.floor} o={fin(f, tFix)} />
        <Lbl x={P(-19.5, 4.5)[0]} y={P(-19.5, 4.5)[1]} t="12 UTC" c={C.local} s={T.floor} o={fin(f, tFix)} />
        <Bracket p={P(T00, Z50)} q={P(T50, Z50)} off={30} c={C.neg} o={fin(f, AT(k, 2, "cooled by"))} />
        <Lbl x={P(T00, Z50)[0] + 32} y={P(T00, Z50)[1] - 30} t="−2.6 °C in 12 h" c={C.neg} s={T.floor} o={fin(f, AT(k, 2, "cooled by"))} />
        {/* fix 3b (K6 link-axis): the link stops 18 px left of / 8 px under the gold curve instead of ending on it */}
        <Keyword f={f} text="∂T/∂z" at={[P(-8, 4.4)[0], P(-8, 4.4)[1]]} appear={SS(k, 9)} targets={[[P(Tat(4.9), 4.9)[0] - 18, P(Tat(4.9), 4.9)[1] + 8]]} />
      </Svg>
      <MapView id="s19" B={B} o={fin(f, tSide - 10)} L={{ coast: 0 }} children={(Pm) => {
        const pts = (dr.e as number[]).map((e, i) => Pm(TRAP[0] + dr.n[i] * KM_LAT, TRAP[1] + e / (111.195 * Math.cos((TRAP[0] * Math.PI) / 180))));
        const n = Math.max(2, Math.round(pts.length * prog(f, AT(k, 5, "drifted"), AT(k, 5, "drifted") + 60)));
        // fix 2 (review 2 Should 4): four thin ERA5 500-hPa isotherms (every 0.2 °C) show the drift running along them; the two
        // outer ones are labelled in °C (the colour bar's unit); the drift is an animated arrow once drawn (house K7)
        const isoO = fin(f, AT(k, 6, "lines of equal temperature") - 10, 14);
        const lab = (lev: number) => {
          const L0 = (SN.iso500 as { level: number; lines: number[][] }[]).find((q) => q.level === lev);
          if (!L0) return null;
          let best: Pt | null = null, bl = -1;
          L0.lines.forEach((ln) => { for (let i = 0; i < ln.length; i += 2) { const la = ln[i + 1], lo = ln[i]; if (la <= B.lat1 - 0.08 && la > bl && lo > B.lon0 + 0.05 && lo < B.lon1 - 0.05) { bl = la; best = Pm(la, lo); } } });
          return best;
        };
        const l1 = lab(-11.6), l2 = lab(-11.0);
        const done = prog(f, AT(k, 5, "drifted"), AT(k, 5, "drifted") + 60) >= 1;
        return (
          <g>
            <GeoImg P={Pm} href={IMGS.t500} box={BOX.t500} />
            <path d={linesPath(Pm, D.lines.borders_10m)} stroke={C.key} strokeOpacity={0.6} strokeWidth={1.5} fill="none" strokeDasharray="8 6" />
            {/* fix 3 (review 3 Must 1): the map-label exemption is gone; the "17 km" link now runs below "−11.0 °C" (callout at y 600) */}
            <g data-lc-contour="1"><Iso P={Pm} levels={SN.iso500} c={C.key} w={2.5} o={0.8 * isoO} /></g>
            <g opacity={isoO}>
              {l1 ? <Lbl x={(l1 as Pt)[0]} y={(l1 as Pt)[1] - 4} t="−11.6 °C" c={C.key} s={T.floor} a="middle" /> : null}
              {l2 ? <Lbl x={(l2 as Pt)[0] - 50} y={(l2 as Pt)[1] + 26} t="−11.0 °C" c={C.key} s={T.floor} a="middle" /> : null}
            </g>
            <path d={poly(pts.slice(0, n))} stroke={C.first} strokeWidth={7} fill="none" strokeLinecap="round" opacity={done ? 0.35 : 1} />
            {done ? <AnimatedWindArrow from={pts[0]} to={pts[pts.length - 1]} speed={(Math.hypot(dr.E, dr.N) * 1000) / 900} f={f} c={C.first} px={8} head={30} /> : null}
            <Dot p={pts[0]} c={C.gold} r={10} />
            <Lbl x={pts[0][0] - 16} y={pts[0][1] + 34} t="Trappes" c={C.key} s={T.floor} a="end" />
          </g>
        );
      }} />
      {(() => {
        const Pm = mapP(B);
        const pe = Pm(TRAP[0] + (dr.n as number[])[(dr.n as number[]).length - 1] * KM_LAT, TRAP[1] + (dr.e as number[])[(dr.e as number[]).length - 1] / (111.195 * Math.cos((TRAP[0] * Math.PI) / 180)));
        return <Svg><Callout f={f} lines="17 km" at={[680, 600]} appear={AT(k, 5, "seventeen")} target={[pe[0] + 10, pe[1] - 6]} s={T.key} c={C.first} bend={-12} /></Svg>;
      })()}
      <Svg o={fin(f, tSide - 10)}>
        <ColourBar x={680} y={700} w={290} lut={LUT_T} lo={-16} hi={-8} unit="°C" title="temperature 5.8 km up" ticks={[{ v: -15, t: "−15" }, { v: -10, t: "−10" }]} />
      </Svg>
      {/* fix 2 (review 2 Should 9): the plain chain rule stays; the bars carry the sizes (no 20-px underbrace numbers) */}
      <TeX s={plain} x={MX} y={130} size={48} o={fin(f, 6)} />
      <TeX s={EQ_S19} x={MX - 30} y={150} size={46} o={0} />
      <Svg>
        {rows.map(([t, v, c, , at], i) => (
          <g key={t} opacity={fin(f, [tFix, tSide, tRise][i])}>
            <Lbl x={MX} y={330 + i * 120} t={t} c={c} s={T.floor} />
            <rect x={X0} y={308 + i * 120} width={bar(v) * prog(f, at, at + 20)} height={44} fill={c} opacity={i === 1 ? 0.5 : 0.85} />
          </g>
        ))}
        <g opacity={fin(f, tFix)}>
          {[-5, -4, -3, -2].map((e, i) => <g key={e}>
            <line x1={X0 + (e + 6) * KB} y1={660} x2={X0 + (e + 6) * KB} y2={676} stroke={C.muted} strokeWidth={3} />
            <Lbl x={X0 + (e + 6) * KB} y={706} t={["10⁻⁵", "10⁻⁴", "10⁻³", "10⁻²"][i]} c={C.muted} s={T.floor} a="middle" />
          </g>)}
          <line x1={X0} y1={660} x2={X0 + 4.6 * KB} y2={660} stroke={C.muted} strokeWidth={3} />
          <Lbl x={X0 + 4.45 * KB} y={764} t="°C/s" c={C.muted} s={T.floor} a="end" />
        </g>
        <Keyword f={f} text="more than 99 %" at={[MX + 60, 790]} appear={tShare} />   {/* retrofit T-S3: no link across the tick labels */}
      </Svg>
      {rows.map(([t, , c, tx, at], i) => <TeX key={t} s={String.raw`\approx ` + tx} x={i === 2 ? X0 : X0 + Math.max(bar(rows[i][1]), 170) + 20} y={i === 2 ? 626 : 330 + i * 120} size={46} c={c} o={fin(f, at)} />)}
    </Scene>
  );
};
const Tat0 = (zk: number) => { const z = (SN.z00 as number[]).map((v) => v / 1000), t = SN.T00 as number[]; for (let i = 1; i < z.length; i++) if (z[i] >= zk) { const w = (zk - z[i - 1]) / (z[i] - z[i - 1]); return t[i - 1] + (t[i] - t[i - 1]) * w; } return t[t.length - 1]; };

// ================================================================ s20 the air parcel: the material derivative (named, handed on)
const B20 = boxAt(48.35, -4.4, 3.2, 80, 40, 920, 640);
const S20: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20_parcel_pointer");
  const tr = E8.tracks as number[][];
  const L = tr[0].length / 2;
  const ride = tr.reduce((b, t, i) => (Math.hypot(t[0] - 47.9, t[1] + 6.0) < Math.hypot(tr[b][0] - 47.9, tr[b][1] + 6.0) ? i : b), 0);
  // fix 1 (review S3): new S5 "If the air parcels had kept their temperature …" and S6 "It warmed by only two point nine …"
  const tR0 = SS(k, 3), tR1 = SE(k, 5), tKeep = SS(k, 4), tDid = SS(k, 5);
  const rs = clamp((f - tR0) / (tR1 - tR0), 0, 1) * 6;           // 6 steps of 10 min = 1 h
  const ri = Math.min(L - 2, Math.floor(rs)), rw = rs - ri;
  const parts: Part[] = [{ t: String.raw`\frac{DT}{Dt}`, c: C.key }, { t: "=" }, { t: String.raw`\frac{\partial T}{\partial t}`, c: C.local }, { t: "+" },
    { t: String.raw`\mathbf u\cdot\nabla T`, c: C.first, u: { w: String.raw`\text{dot product}`, c: C.gold } }];
  void EQ_S20;
  return (
    <Scene>
      <MapView id="s20" B={B20} L={{ t850: [{ h: 18, o: 1 }], coast: 0.85 }} children={(P) => {
        const els: React.ReactNode[] = [];
        tr.forEach((t, i) => {
          const ph = (f * 0.22 + i * 2.7) % (L + 5), head = Math.min(L - 1, Math.floor(ph)), tail = Math.max(0, head - 5);
          if (head - tail < 1 || ph > L) return;
          const pts: Pt[] = [];
          for (let s = tail; s <= head; s++) pts.push(P(t[2 * s], t[2 * s + 1]));
          // fix 3b (K6 text-stroke): once "Brest" is named, streak points inside its label box (+8 px) are skipped (the streaks are
          // a moving texture; their direction still comes from the ERA5 wind)
          const pb0 = P(BREST[0], BREST[1]), hide = fin(f, AT(k, 3, "Over Brest")) > 0;
          const inLbl = (q: Pt) => hide && q[0] > pb0[0] + 6 && q[0] < pb0[0] + 30 + textW("Brest", T.floor) && q[1] > pb0[1] - 68 && q[1] < pb0[1] - 2;
          let d = "", pen = false;
          // densified to ≤ 4-px steps, so a segment whose ends lie outside the box cannot cut through the label either
          const dense: Pt[] = [];
          pts.forEach((q, j) => { if (j === 0) { dense.push(q); return; } const o = pts[j - 1], n = Math.max(1, Math.ceil(Math.hypot(q[0] - o[0], q[1] - o[1]) / 4));
            for (let m = 1; m <= n; m++) dense.push([o[0] + ((q[0] - o[0]) * m) / n, o[1] + ((q[1] - o[1]) * m) / n]); });
          // each visible run is its own <path> (the K6 probe joins the sub-paths of one path into one polyline)
          const runs: string[] = [];
          for (const q of dense) { if (inLbl(q)) { if (d) runs.push(d); d = ""; pen = false; continue; } d += `${pen ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`; pen = true; }
          if (d) runs.push(d);
          runs.filter((r) => r.includes("L")).forEach((r, m) => els.push(<path key={`${i}_${m}`} d={r} stroke={C.first} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.85} />));
        });
        // fix 3 (review 3 S12): the gold dot is named when "Over Brest" is said (above-right of it: the parcel's cube passes below-left, its link below)
        const pb = P(BREST[0], BREST[1]);
        return <g opacity={fin(f, 4)}>{els}<Place p={pb} r={9} />
          <Lbl x={pb[0] + 18} y={pb[1] - 34} t="Brest" c={C.key} s={T.floor} o={fin(f, AT(k, 3, "Over Brest"))} /></g>;
      }} />
      {(() => {
        const P = mapP(B20), t = tr[ride];
        const p: Pt = lerp(P(t[2 * ri], t[2 * ri + 1]), P(t[2 * ri + 2], t[2 * ri + 3]), rw);
        return (
          <>
            <ParcelBox3D p={p} size={90} o={fin(f, SS(k, 0))} />
            <Svg><g data-lc-maplabel="1"><Lbl x={p[0] + 54} y={p[1] + 10} t="air parcel" c={C.key} s={T.floor} o={fin(f, SS(k, 0)) * fout(f, tR0)} /></g>
              {/* fix 2 (review 2 Should 6): the parcel's reading below the map, linked to it */}
              <Callout f={f} lines={`${nf(E8.pt["18"] + E8.DTDt * rs / 6, 1)} °C`} at={[830, 745]} appear={tR0} target={[p[0] + 20, p[1] + 40]} s={T.key} bend={30} /></Svg>
          </>
        );
      })()}
      <Svg><T850Bar x={130} y={742} /></Svg>
      <Layered parts={parts} x={MX} y={150} size={76} o={fin(f, AT(k, 1, "capital D T"))} layers={[{ t: "all", o: 1 }, { t: [], u: [4], o: fin(f, SS(k, 2)) }]} />
      <Svg><Keyword f={f} text="material derivative" at={[MX + 20, 320]} appear={AT(k, 1, "the material")} />
        <Keyword f={f} text="moves with the wind" at={[MX + 20, 620]} appear={AT(k, 0, "an air parcel")} out={SS(k, 3) - 12} /></Svg>
      {/* fix 3 (review 3 Must 5): the rows 50 px (were 56) from y 360, so the bar chart below gets ≈ 60 px more */}
      <CalcStack f={f} x={MX + 250} y={360} size={50} rows={[
        ROW(String.raw`=+2.9\ ^{\circ}\mathrm{C/h}`, AT(k, 3, "two point nine"), String.raw`\partial T/\partial t`, { c: C.local, lc: C.local }),
        ROW(String.raw`=-3.7\ ^{\circ}\mathrm{C/h}`, AT(k, 3, "three point seven"), String.raw`\mathbf u\cdot\nabla T`, { c: C.first, lc: C.first }),
        ROW(String.raw`\approx-0.8\ ^{\circ}\mathrm{C/h}`, AT(k, 5, "cooled by"), String.raw`DT/Dt`, { c: C.key, lc: C.key }),
      ]} />
      <Svg>
        {/* fix 2 (review 2 Must 1 + Should 5): three rows, bars from x 1120 (85 px per °C/h, ends ≤ 1435), every label right of its
            bar or on its own line at 44 px: what the place would do if the parcels kept T (−u·∇T, dashed), what it did, and the
            parcels' own change on its own third row */}
        {/* fix 3 (review 3 Must 5): the chart starts 40 px higher and its zero axis ends at y 822, above the source line (which
            is also shortened to end near x 1100); each label sits ≥ 10 px above its bar; the dashed guide at +3.7 runs only from
            the dashed bar down to the top of the place bar, so it no longer cuts "+2.9" */}
        {(() => {
          const X0 = 1120, KX = 85, xa = X0 + 3.7 * KX, xb = X0 + 2.9 * KX;
          return <>
            <g opacity={fin(f, tKeep)}>
              <line x1={X0} y1={598} x2={X0} y2={822} stroke={C.ink} strokeWidth={4} />
              <Lbl x={X0 + 16} y={614} t="if parcels kept T" c={C.first} s={T.floor} />
              <rect x={X0} y={650} width={3.7 * KX} height={34} fill={C.first} fillOpacity={0.3} stroke={C.first} strokeWidth={3} strokeDasharray="10 6" />
              <Lbl x={xa + 14} y={667} t="−u·∇T = +3.7" c={C.first} s={T.floor} />
            </g>
            <g opacity={fin(f, tDid)}>
              <Lbl x={X0 + 16} y={712} t="the place" c={C.local} s={T.floor} />
              <rect x={X0} y={746} width={2.9 * KX} height={34} fill={C.local} />
              <Lbl x={xb + 14} y={763} t="+2.9" c={C.local} s={T.floor} />
            </g>
            <g opacity={fin(f, AT(k, 5, "cooled by"))}>
              <rect x={xb} y={798} width={xa - xb} height={24} fill={C.neg} />
              <line x1={xa} y1={684} x2={xa} y2={736} stroke={C.neg} strokeWidth={2} strokeDasharray="6 6" />
              <Lbl x={xa + 14} y={810} t="each parcel: −0.8" c={C.key} s={T.floor} />
            </g>
          </>;
        })()}
      </Svg>
    </Scene>
  );
};

// ================================================================ s21 changing variables: from height to pressure (chain rule)
const S21: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21_change_variables");
  const A: Ax = { x: 230, y: 90, w: 600, h: 640, xr: [-20, 25], yr: [0, 7] };
  const P = axP(A);
  const zOfP = (hp: number) => { const z = PROF.z, p = SN.p as number[]; for (let i = 1; i < z.length; i++) if (p[i] <= hp) { const w = Math.log(p[i - 1] / hp) / Math.log(p[i - 1] / p[i]); return z[i - 1] + (z[i] - z[i - 1]) * w; } return z[z.length - 1]; };
  const hp = [900, 800, 700, 600, 500].filter((v) => v <= (SN.p as number[])[0]);
  const tAx = AT(k, 1, "pressure"), tBr = SS(k, 5);
  const [lhs21] = cut2(EQ_S21, String.raw`\approx`);
  const rhs21 = cut2(EQ_S21, String.raw`\,\frac{\partial z}{\partial p}`)[1];
  const parts: Part[] = [{ t: lhs21, u: { w: String.raw`\text{chain rule}`, c: C.gold } }];
  const xR = A.x + A.w;
  void pAt;
  return (
    <Scene>
      <Svg>
        <ClipRect id="s21c" A={A} pad={4} />
        <Axes A={A} xt={[-20, -10, 0, 10, 20]} yt={[0, 2, 4, 6]} xl="°C" yl="km" />
        <ProfileLine A={A} zTop={7} clip="s21c" />
        <g opacity={fin(f, tAx)}>
          <line x1={xR} y1={A.y} x2={xR} y2={A.y + A.h} stroke={C.key} strokeWidth={3} />
          {hp.map((v) => { const y = axY(A)(zOfP(v)); return <g key={v}><line x1={xR} y1={y} x2={xR + 12} y2={y} stroke={C.key} strokeWidth={3} /><Lbl x={xR + 20} y={y} t={`${v}`} c={C.key} s={T.floor} /></g>; })}
          <Lbl x={xR + 20} y={A.y - 34} t="hPa" c={C.key} s={T.floor} />
        </g>
        <Sonde p={[xR + 160, axY(A)(mix(0.5, 5.5, prog(f, SS(k, 2), SE(k, 2))))]} s={1} o={fin(f, SS(k, 2)) * fout(f, SS(k, 4))} />
        <Bracket p={[A.x + 30, axY(A)(Z85)]} q={[A.x + 30, axY(A)(Z50)]} off={0} c={C.ink} o={fin(f, tBr)} />
        <Lbl x={A.x + 50} y={axY(A)((Z85 + Z50) / 2)} t="4262 m" c={C.ink} s={T.floor} o={fin(f, tBr)} />
        <Bracket p={[xR - 30, axY(A)(Z85)]} q={[xR - 30, axY(A)(Z50)]} off={0} c={C.key} o={fin(f, AT(k, 5, "three hundred and fifty"))} />
        <Lbl x={xR - 50} y={axY(A)((Z85 + Z50) / 2)} t="−350 hPa" c={C.key} s={T.floor} a="end" o={fin(f, AT(k, 5, "three hundred and fifty"))} />
        <Arrow p={[A.x + 120, axY(A)(3.0)]} q={[A.x + 120, axY(A)(0.5)]} color={C.gold} w={7} head={26} o={fin(f, SS(k, 8))} />
        <Lbl x={A.x + 140} y={axY(A)(1.25)} t="p rises, T rises" c={C.gold} s={T.floor} o={fin(f, SS(k, 8))} />
        <Keyword f={f} text="pressure instead of height" at={[MX + 40, 140]} appear={tAx} out={AT(k, 4, "so partial capital T by partial p") - 12} />
        <Keyword f={f} text="swap one variable for another" at={[1070, 760]} appear={AT(k, 0, "swap")} out={SS(k, 6) - 12} />
      </Svg>
      <TeX s={String.raw`\text{per km}\ \to\ \text{per hPa}`} x={MX + 40} y={334} size={56} c={C.key} o={fin(f, SS(k, 3)) * fout(f, SS(k, 6) - 10)} />
      <Layered parts={parts} x={MX + 40} y={160} size={72} o={fin(f, AT(k, 4, "so partial capital T by partial p"))} layers={[{ t: "all", o: 1 }, { t: [], u: [0], o: fin(f, AT(k, 4, "times partial z")) }]} />
      <CalcStack f={f} x={MX + 150} y={300} size={50} maxLines={4} rows={[
        ROW(String.raw`\approx\frac{4262\ \mathrm m}{-350\ \mathrm{hPa}}`, SS(k, 6), String.raw`\frac{\partial z}{\partial p}`),
        ROW(String.raw`\approx-12.2\ \mathrm{m/hPa}`, AT(k, 6, "minus twelve"), undefined, { cont: true }),
        ROW(String.raw`=-5.7\times10^{-3}\ ^{\circ}\mathrm{C/m}`, AT(k, 7, "Times minus"), String.raw`\frac{\partial T}{\partial z}`),
        ROW(rhs21.replace(String.raw`\approx+0.069`, String.raw`\\ \approx+0.069`).split(String.raw`\\ `)[0], AT(k, 7, "that gives"), String.raw`\frac{\partial T}{\partial p}`, { c: C.key }),
        ROW(String.raw`\approx+0.069\ ^{\circ}\mathrm{C/hPa}`, AT(k, 7, "plus zero point"), undefined, { c: C.key, cont: true }),
      ]} />
    </Scene>
  );
};

// ================================================================ s22 state functions: a real hill (ETOPO, Monts d'Arrée), two trails
const HILL = (() => {
  const h = D.hill, ny = h.ny as number, nx = h.nx as number, a = new Float32Array(ny * nx);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) a[j * nx + i] = h.z[j][i];
  const sla = h.summit[0], slo = h.summit[1], kl = h.km_lon as number, ka = h.km_lat as number;
  return { a, ny, nx, x0: (h.lon[0] - slo) * kl, x1: (h.lon[1] - slo) * kl, y0: (h.lat[0] - sla) * ka, y1: (h.lat[1] - sla) * ka };
})();
const HZ = 0.005;                                                  // km of world height per metre (relief ×5)
const S22: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22_state_functions");
  const tex = useTex(IMGS.hill);
  const h = D.hill;
  const park: V3 = [(h.park[1] - h.summit[1]) * h.km_lon, (h.park[0] - h.summit[0]) * h.km_lat, h.park[2] * HZ];
  const top: V3 = [0, 0, h.summit[2] * HZ];
  const cam = { az: -128 + 0.02 * f, el: 30, dist: 13, target: [park[0] / 2, park[1] / 2, 0.9] as V3 };
  const st = orbitCam({ ...cam, fov: 34 }, [590, 390]);
  const pr = projector(st, 1180, 780, 80, 40);
  const t3 = SS(k, 3), t4 = SS(k, 4);
  const trail = (pts: number[][], hs: number[], upto: number) => {
    const n = Math.max(2, Math.round(pts.length * clamp(upto, 0, 1)));
    return poly(pts.slice(0, n).map((p, i) => pr.p([p[0], p[1], hs[i] * HZ + 0.04])));
  };
  const pulseD = 1 + 0.12 * pulse(f, SS(k, 8), 24);
  const gainT = `+${(h.summit[2] - h.park[2]).toFixed(0)} m`;          // fix 1 (review S4): the data, 325.1 − 189.7 = 135.4 m
  return (
    <Scene>
      <View3D st={st} x={80} y={40} w={1180} h={780} amb={1.3} dir={1.5} key3={[-6, -8, 10]}>
        <Terrain H={HILL.a} ny={HILL.ny} nx={HILL.nx} x0={HILL.x0} x1={HILL.x1} y0={HILL.y0} y1={HILL.y1} zs={HZ} tex={tex} />
      </View3D>
      <Svg>
        <path d={trail(h.straight, h.hs, prog(f, t3, t3 + 40))} stroke={C.first} strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d={trail(h.wind, h.hw, prog(f, t3 + 20, t3 + 80))} stroke={C.second} strokeWidth={7} fill="none" strokeLinecap="round" />
        <Dot p={pr.p(park)} c={C.gold} r={13} /><Lbl x={pr.p(park)[0] - 20} y={pr.p(park)[1] + 44} t="car park" c={C.key} s={T.floor} a="end" />
        <Dot p={pr.p(top)} c={C.gold} r={13} /><Lbl x={pr.p(top)[0] + 20} y={pr.p(top)[1] - 40} t="summit" c={C.key} s={T.floor} />
      </Svg>
      <Svg>
        <g opacity={fin(f, AT(k, 3, "the same whichever"))}>
          <Lbl x={1300} y={150} t="height gained" c={C.muted} s={T.floor} />
          <Lbl x={1300} y={215} t={gainT} c={C.first} s={T.key} /><Lbl x={1560} y={215} t={gainT} c={C.second} s={T.key} />
        </g>
        <g opacity={fin(f, t4)}>
          <Lbl x={1300} y={300} t="distance walked" c={C.muted} s={T.floor} />
          <g transform={`translate(1300 365) scale(${pulseD}) translate(-1300 -365)`}><Lbl x={1300} y={365} t={`${h.Lst.toFixed(1)} km`} c={C.first} s={T.key} /></g>
          <g transform={`translate(1560 365) scale(${pulseD}) translate(-1560 -365)`}><Lbl x={1560} y={365} t={`${h.Lw.toFixed(1)} km`} c={C.second} s={T.key} /></g>
        </g>
        <Keyword f={f} text="state function" at={[1300, 480]} appear={AT(k, 5, "state function")} />
        <Keyword f={f} text="perfect differential" at={[1300, 560]} appear={AT(k, 6, "perfect differential")} />
        <Keyword f={f} text="exact differential" at={[1300, 630]} appear={AT(k, 6, "exact differential")} />
      </Svg>
      <TeX s={String.raw`T,\ \ p,\ \ \rho`} x={1300} y={740} size={72} c={C.key} o={fin(f, SS(k, 7))} />
    </Scene>
  );
};

// ================================================================ s23 the exactness test: equal mixed partials; a loop
const S23: React.FC = () => {
  const f = useCurrentFrame(), k = K("s23_exact_test");
  const A: Ax = { x: 270, y: 150, w: 540, h: 540, xr: [-0.25, 1.25], yr: [-0.25, 1.25] };
  const P = axP(A);
  const lp = D.loop;
  const n = (lp.x as number[]).length;
  const tM = SS(k, 11), tP = SS(k, 12);
  const sM = prog(f, tM, tM + 120), sP = prog(f, tP, tP + 90);
  const usePlus = f >= tP;
  const s = usePlus ? sP : sM, ii = Math.min(n - 1, Math.round(s * (n - 1)));
  const run = usePlus ? lp.plus[ii] : lp.minus[ii];
  const [t1, t2] = EQ_S23.split(String.raw`;\qquad `);
  return (
    <Scene>
      <Svg>
        {/* fix 3 (review 3 S12): the axis word "x" moves up into the tick row (right end), away from the running sum and its ✓ */}
        <Axes A={A} xt={[0, 1]} yt={[0, 1]} xl="x" yl="y" o={0.9} xly={A.y + A.h + 32} />
        <rect x={P(0, 1)[0]} y={P(0, 1)[1]} width={P(1, 0)[0] - P(0, 1)[0]} height={P(1, 0)[1] - P(0, 1)[1]} fill="rgba(216,178,58,0.06)" stroke={C.gold} strokeWidth={4} opacity={0.5 + 0.5 * fin(f, tM)} />
        {[[0.5, 0, 0], [1, 0.5, 90], [0.5, 1, 180], [0, 0.5, 270]].map(([x, y, a], i) => <g key={i} transform={`translate(${P(x, y)[0]} ${P(x, y)[1]}) rotate(${-a})`} opacity={fin(f, tM)}>
          <polyline points="-12,-12 6,0 -12,12" fill="none" stroke={C.gold} strokeWidth={5} /></g>)}
        <Dot p={P(lp.x[ii], lp.y[ii])} c={C.key} r={16} o={fin(f, tM)} />
        <Lbl x={A.x + A.w / 2} y={A.y + A.h + 90} t={`${usePlus ? "y dx + x dy" : "y dx − x dy"}:  ${nf(run, 2)}`} c={usePlus ? C.first : C.neg} s={T.key} a="middle" o={fin(f, tM)} />
        {usePlus && sP >= 1 ? <Check x={A.x + A.w / 2 + 300} y={A.y + A.h + 90} o={fin(f, tP + 92)} /> : null}
      </Svg>
      <TeX s={String.raw`M\,dx+N\,dy`} x={MX} y={120} size={76} o={fin(f, SS(k, 1))} />
      <Svg><Keyword f={f} text="a test from the formula" at={[MX + 20, 760]} appear={AT(k, 0, "just from the formula")} out={SS(k, 5) - 12} /></Svg>
      <TeX s={String.raw`M=\frac{\partial f}{\partial x},\quad N=\frac{\partial f}{\partial y}`} x={MX} y={235} size={56} o={fin(f, SS(k, 2))} />
      <TeX s={String.raw`\dfrac{\partial^2 f}{\partial y\,\partial x}=\dfrac{\partial^2 f}{\partial x\,\partial y}`} x={MX} y={335} size={56} c={C.muted} o={fin(f, SS(k, 3))} />
      <TeX s={t1} x={MX} y={510} size={80} c={C.gold} o={fin(f, SS(k, 4))} />
      <TeX s={String.raw`y\,dx+x\,dy:\ \ 1=1`} x={MX} y={630} size={54} c={C.first} o={fin(f, SS(k, 6))} />
      <TeX s={String.raw`=d(xy)`} x={MX + 480} y={630} size={54} c={C.first} o={fin(f, SS(k, 7))} />
      <Svg><Check x={MX + 700} y={630} s={0.9} o={fin(f, SS(k, 7))} /></Svg>
      <TeX s={String.raw`y\,dx-x\,dy:\ \ 1\neq-1`} x={MX} y={760} size={54} c={C.neg} o={fin(f, SS(k, 9))} />
      <Svg><Cross x={MX + 560} y={760} s={0.9} o={fin(f, SS(k, 10))} /></Svg>
      <TeX s={t2} x={600} y={80} size={52} ax={0.5} c={C.neg} o={fin(f, AT(k, 11, "minus two")) * fout(f, tP)} />
    </Scene>
  );
};

// ================================================================ s24 the ideal gas law is a state function: dp/p = dρ/ρ + dT/T
const S24: React.FC = () => {
  const f = useCurrentFrame(), k = K("s24_ideal_gas");
  const st = orbitCam({ az: -125 + 0.04 * f, el: 24, dist: 7.2, target: [0, 0, 0], fov: 30 }, [460, 390]);
  const pr = projector(st, 920, 780, 80, 40);
  const mol = React.useMemo(() => Array.from({ length: 70 }, (_, i) => [random(`m${i}a`) - 0.5, random(`m${i}b`) - 0.5, random(`m${i}c`) - 0.5, random(`m${i}d`) * 6.28]), []);
  const parts: Part[] = [{ t: "p", u: { w: String.raw`\text{pressure}`, c: C.gold } }, { t: "=" }, { t: String.raw`\rho`, u: { w: String.raw`\text{density}`, c: C.gold } },
    { t: "R" }, { t: "T", u: { w: String.raw`\text{kelvin}`, c: C.gold } }];
  const [, g2, g3] = EQ_S24.split(String.raw`,\qquad `);
  const late = SS(k, 8);
  const dimE = 1 - 0.55 * fin(f, late);
  return (
    <Scene>
      <View3D st={st} x={80} y={40} w={920} h={780} amb={1.2} dir={1.5}>
        <Parcel3D c={[0, 0, 0]} s={2} h={2} color="#7cc4ff" px={4} />
        {mol.map(([x, y, z, ph], i) => <Ball3D key={i} at={[x * 1.8 + 0.06 * Math.sin(f * 0.21 + ph), y * 1.8 + 0.06 * Math.cos(f * 0.17 + ph), z * 1.8 + 0.06 * Math.sin(f * 0.13 + 2 * ph)]} px={9} color={C.ink} />)}
      </View3D>
      <Svg>
        <Lbl x={pr.p([1, -1, -1.15])[0]} y={pr.p([1, -1, -1.15])[1] + 30} t="1 m" c={C.key} s={T.floor} a="middle" />
        <Lbl x={pr.p([1.15, 1.15, 0])[0] + 20} y={pr.p([1.15, 1.15, 0])[1]} t="1 m" c={C.key} s={T.floor} />
        <Lbl x={160} y={110} t="p,  ρ,  T" c={C.key} s={T.key} o={fin(f, SS(k, 1))} />
      </Svg>
      <Layered parts={parts} x={MX} y={140} size={78} o={fin(f, SS(k, 1)) * dimE}
        layers={[{ t: "all", o: 1 }, { t: [], u: [0], o: fin(f, AT(k, 2, "p is the pressure")) }, { t: [], u: [2], o: fin(f, AT(k, 2, "rho the density")) }, { t: [], u: [4], o: fin(f, AT(k, 2, "T the temperature")) }]} />
      <Svg><Lbl x={MX} y={262} t="ρ: kg of air in each m³" c={C.muted} s={T.floor} o={fin(f, AT(k, 2, "mass of air")) * dimE} /></Svg>
      <TeX s={String.raw`R=287\ \mathrm{J\,kg^{-1}\,K^{-1}}`} x={MX} y={335} size={52} c={C.key} o={fin(f, SS(k, 3)) * dimE} />
      <TeX s={g2} x={MX} y={425} size={58} o={fin(f, AT(k, 4, "d p equals")) * dimE} />
      <TeX s={String.raw`\frac{\partial(RT)}{\partial T}=R=\frac{\partial(\rho R)}{\partial\rho}`} x={MX} y={528} size={52} o={fin(f, SS(k, 6)) * dimE} />
      <Svg><Check x={MX + 620} y={528} o={fin(f, SS(k, 7)) * dimE} /></Svg>
      <TeX s={String.raw`\div\ \rho RT`} x={MX + 520} y={688} size={56} c={C.gold} o={fin(f, late)} />
      <TeX s={g3} x={MX} y={688} size={72} c={C.key} o={fin(f, SS(k, 9))} />
      <Svg><Keyword f={f} text="fractional changes add" at={[MX + 20, 806]} appear={SS(k, 10)} /></Svg>
    </Scene>
  );
};

// ================================================================ s25 warmed air is lighter (−3.45 % linear, −3.33 % exact)
const S25: React.FC = () => {
  const f = useCurrentFrame(), k = K("s25_ideal_gas_example");
  const warm = prog(f, SS(k, 1), SE(k, 1));
  const up = prog(f, SS(k, 4), LEN(k));
  const st = orbitCam({ az: -110, el: 18, dist: 7.5, target: [0, 0, 1.2], fov: 32 }, [460, 400]);
  const pr = projector(st, 920, 760, 80, 60);
  void EQ_S25;
  const cw = `rgb(${Math.round(mix(124, 240, warm))},${Math.round(mix(196, 150, warm))},${Math.round(mix(255, 110, warm))})`;
  return (
    <Scene>
      <View3D st={st} x={80} y={60} w={920} h={760} amb={1.2} dir={1.5}>
        <Quad3D pts={[[-3, -2, 0], [3, -2, 0], [3, 2, 0], [-3, 2, 0]]} color="#4f7a4a" o={0.5} />
        <Parcel3D c={[-1.3, 0, 0.55]} s={1} h={1} color="#7cc4ff" />
        <Parcel3D c={[1.3, 0, 0.55 + 1.3 * up]} s={1} h={1} color={cw} />
      </View3D>
      <Svg>
        <SunGlyph x={170} y={150} s={1.6} />
        <Lbl x={pr.p([-1.3, 0, -0.25])[0]} y={pr.p([-1.3, 0, -0.25])[1] + 20} t="290 K" c={C.key} s={T.key} a="middle" />
        {/* fix 3 (review 3 S12; K6 text-fill in 3b): the warmed parcel's label sits above its cube and rises with it (below it, it
            straddled the far edge of the ground) */}
        <Lbl x={pr.p([1.3, 0, 1.05 + 1.3 * up])[0]} y={pr.p([1.3, 0, 1.05 + 1.3 * up])[1] - 88} t={warm > 0.5 ? "300 K" : "290 K"} c={C.second} s={T.key} a="middle" o={fin(f, SS(k, 1))} />
        <Lbl x={300} y={140} t="p fixed" c={C.key} s={T.key} o={fin(f, AT(k, 1, "pressure stays"))} />
        <Keyword f={f} text="warming at fixed pressure" at={[MX + 20, 300]} appear={AT(k, 1, "warms from")} out={SS(k, 2) - 12} />
        <Keyword f={f} text="lighter, so it rises" at={[MX + 20, 640]} appear={SS(k, 3)} />
      </Svg>
      <TeX s={String.raw`\frac{dp}{p}=\frac{d\rho}{\rho}+\frac{dT}{T}`} x={MX} y={470} size={64} c={C.muted} o={fin(f, 4) * fout(f, SS(k, 2) - 10)} />
      <CalcStack f={f} x={MX + 180} y={110} size={60} rows={[
        ROW(String.raw`=-\frac{dT}{T}`, SS(k, 2), String.raw`\frac{d\rho}{\rho}`),
        ROW(String.raw`=-\frac{10}{290}\approx-3.45\,\%`, AT(k, 2, "minus ten"), undefined, { c: C.neg }),
        ROW(String.raw`\frac{290}{300}-1\approx-3.3\,\%`, SS(k, 5), String.raw`\text{exact}`, { c: C.key }),
      ]} />
      <Svg><Lbl x={MX + 20} y={760} t="10 K is small next to 290 K" c={C.local} s={T.floor} o={fin(f, SS(k, 6))} /></Svg>
    </Scene>
  );
};

// ================================================================ s26 hydrostatic balance and the scale height (3-D column over Trappes)
assertColumnEdges(6, "s26 column");   // house K4 (§5b G5): BoxEdges3D [0,0,0]-[1,1,6] draws every vertical edge to z = 6
const S26: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26_hydrostatic");
  const st = orbitCam({ az: -120 + 0.03 * f, el: 16, dist: 11.5, target: [0.5, 0.5, 2.9], fov: 32 }, [460, 390]);
  const pr = projector(st, 920, 780, 80, 40);
  const sl = fin(f, AT(k, 3, "small step"));
  const [h1] = cut2(EQ_S26, String.raw`\ \Rightarrow\ `);
  const mid = cut2(cut2(EQ_S26, String.raw`\ \Rightarrow\ `)[1], String.raw`\approx`)[0];
  const tail = String.raw`H\approx` + cut2(EQ_S26, String.raw`H=\frac{RT}{g}\approx`)[1];
  const parts: Part[] = [{ t: mid, u: { w: String.raw`H:\ \text{scale height}`, c: C.gold } }];
  const dim = 1 - 0.6 * fin(f, SS(k, 6));
  return (
    <Scene>
      <View3D st={st} x={80} y={40} w={920} h={780} amb={1.3} dir={1.4}>
        <Box3D a={[0, 0, 0]} b={[1, 1, 6]} color="#7cc4ff" o={0.22} fade={0.6} bands={6} />
        <BoxEdges3D a={[0, 0, 0]} b={[1, 1, 6]} color={C.muted} px={2.5} />
        <Box3D a={[0, 0, 2.7]} b={[1, 1, 3.05]} color={C.gold} o={0.45 * sl} />
        <BoxEdges3D a={[0, 0, 2.7]} b={[1, 1, 3.05]} color={C.gold} px={4} o={sl} />
        <Arrow3D from={[0.5, 0.5, 2.88]} to={[0.5, 0.5, 1.6]} color={BROWN} px={10} head={32} o={fin(f, AT(k, 3, "weight"))} />
        <Arrow3D from={[1.25, 0.5, 1.7]} to={[1.25, 0.5, 2.68]} color={C.second} px={10} head={32} o={fin(f, AT(k, 1, "holds up"))} />
        <Arrow3D from={[1.25, 0.5, 4.0]} to={[1.25, 0.5, 3.07]} color={C.second} px={8} head={28} o={fin(f, AT(k, 1, "holds up"))} />
      </View3D>
      <Svg>
        <Lbl x={pr.p([0.5, 0.5, 0])[0]} y={pr.p([0.5, 0.5, 0])[1] + 40} t="Trappes" c={C.key} s={T.floor} a="middle" />
        <Lbl x={pr.p([-0.1, 0, 2.88])[0] - 20} y={pr.p([-0.1, 0, 2.88])[1]} t="dz" c={C.gold} s={T.key} a="end" o={sl} />
        <Lbl x={pr.p([0, 0, 1.5])[0] - 40} y={pr.p([0, 0, 1.5])[1] + 30} t="weight" c={BROWN} s={T.floor} a="end" o={fin(f, AT(k, 3, "weight"))} />
        <Lbl x={pr.p([1.3, 0.5, 2.2])[0] + 20} y={pr.p([1.3, 0.5, 2.2])[1]} t="p" c={C.second} s={T.key} o={fin(f, AT(k, 1, "holds up"))} />
        <Lbl x={pr.p([1.3, 0.5, 3.6])[0] + 20} y={pr.p([1.3, 0.5, 3.6])[1]} t="p + dp" c={C.second} s={T.key} o={fin(f, AT(k, 1, "holds up"))} />
      </Svg>
      <TeX s={h1} x={MX} y={105} size={60} o={fin(f, AT(k, 1, "hydrostatic")) * dim} />
      <Svg><Keyword f={f} text="pressure changes with height" at={[MX - 30, 760]} appear={AT(k, 0, "changes with height")} out={SS(k, 5) - 12} /></Svg>
      <TeX s={String.raw`dp=-\rho g\,dz`} x={MX} y={225} size={76} c={C.key} o={fin(f, AT(k, 2, "d p equals")) * dim} />
      <TeX s={String.raw`g=9.81\ \mathrm{m/s^2}`} x={MX + 380} y={300} size={50} c={BROWN} o={fin(f, AT(k, 2, "nine point eight one")) * dim} />
      {/* fix 3 (review 3 S11): ρ/p at 50 px, 10 px higher (clear of dp/p); H ≈ … at 52 px, 5 px higher; the unit line uses
          display fractions at 46 px (its J, kg K, m and s² were ≈ 30 px as \tfrac) */}
      <TeX s={String.raw`\frac{\rho}{p}=\frac{1}{RT}`} x={MX} y={335} size={50} o={fin(f, AT(k, 4, "use the gas law")) * dim} />
      <Layered parts={parts} x={MX} y={525} size={64} o={fin(f, SS(k, 5))} layers={[{ t: "all", o: 1 }, { t: [], u: [0], o: fin(f, AT(k, 5, "scale height")) }]} />
      <TeX s={tail} x={MX} y={700} size={52} c={C.key} o={fin(f, SS(k, 6))} />
      <TeX s={String.raw`\dfrac{\mathrm J}{\mathrm{kg\,K}}\times\mathrm K\div\dfrac{\mathrm m}{\mathrm s^{2}}=\mathrm m`} x={MX} y={814} size={46} c={C.muted} o={fin(f, SS(k, 7))} />
    </Scene>
  );
};

// ================================================================ s27 the exponential p0 e^(−z/H) against the balloon
const A27: Ax = { x: 230, y: 80, w: 700, h: 650, xr: [0, 1050], yr: [0, 30] };
const S27: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27_exponential");
  const P = axP(A27);
  const z = PROF.z, pm = SN.p as number[], pe = SN.pexp as number[];
  // fix 1 (review S10): new S5 checks the solution with the chain rule; later sentences shift by one
  const tE = SS(k, 2), tB = SS(k, 6), tB1 = SE(k, 7), tChk = SS(k, 4);
  const ex = prog(f, tE, tE + 50);
  const nB = Math.round(z.length * prog(f, tB, tB1));
  const shade = fin(f, AT(k, 7, "falls below"));
  const poly2 = [...z.map((zz, i) => P(pe[i], zz)), ...z.slice().reverse().map((zz, i) => P(pm[z.length - 1 - i], zz))];
  return (
    <Scene>
      <Svg>
        <ClipRect id="s27c" A={A27} pad={4} />
        <Axes A={A27} xt={[0, 200, 400, 600, 800, 1000]} yt={[0, 10, 20, 30]} xl="pressure (hPa)" yl="height (km)" />
        <path d={poly(poly2) + "Z"} fill={C.neg} opacity={0.18 * shade} clipPath="url(#s27c)" />
        <Curve A={A27} xs={pe} ys={z} c={C.local} w={6} upto={ex} clipId="s27c" />
        {z.slice(0, nB).map((zz, i) => <Dot key={i} p={P(pm[i], zz)} c={C.first} r={6} />)}
        {/* fix 3 (review 3 S12): right of the curve (≈ 100 px clear); at 5 km the curve itself passes 558 hPa */}
        <Lbl x={P(650, 6)[0]} y={P(650, 6)[1]} t="exponential" c={C.local} s={T.floor} o={ex} />
        <Lbl x={P(60, 24)[0] + 120} y={P(60, 24)[1]} t="balloon" c={C.first} s={T.floor} o={fin(f, tB)} />
        <Keyword f={f} text="differential equation" at={[MX + 20, 560]} appear={SS(k, 5)} />
        <Keyword f={f} text="colder → denser → faster fall" at={[MX + 20, 700]} appear={SS(k, 8)} />
        <Check x={MX + 680} y={430} s={0.9} o={fin(f, AT(k, 4, "so it really"))} />
      </Svg>
      <TeX s={EQ_S27} x={MX + 40} y={160} size={96} c={C.key} o={fin(f, tE)} />
      <TeX s={String.raw`e\approx2.718`} x={MX + 40} y={295} size={60} o={fin(f, SS(k, 3))} />
      <TeX s={String.raw`\frac{dp}{dz}=-\frac{p_0}{H}e^{-z/H}=-\frac{p}{H}`} x={MX + 40} y={430} size={56} o={fin(f, AT(k, 4, "its slope"))} />
      <TeX s={String.raw`\frac{dp}{p}=-\frac{dz}{H},\ \ H=\frac{RT}{g}`} x={MX + 40} y={160} size={60} c={C.muted} o={fin(f, 4) * fout(f, SS(k, 2) - 10)} />
    </Scene>
  );
};

// ================================================================ s28, s29 three routes between the same two states (p–α diagram)
const A28: Ax = { x: 230, y: 90, w: 700, h: 600, xr: [0.7, 1.3], yr: [600, 1100] };
const ROUTES = [["one", C.second, ""], ["two", C.first, ""], ["three", C.neg, "16 10"]] as const;
const RouteChart: React.FC<{ draw: number[]; label?: number; ent?: number; parcel?: { r: number; s: number } }> = ({ draw, label = 0, ent = 0, parcel }) => {
  const P = axP(A28), R = D.routes;
  const pA = P(D.routes_AB.vA, D.routes_AB.pA), pB = P(D.routes_AB.vB, D.routes_AB.pB);
  const pos = (key: string, s: number): Pt => { const v = R[key].v as number[], p = R[key].p as number[], i = Math.min(v.length - 1, Math.round(s * (v.length - 1))); return P(v[i], p[i]); };
  // fix 1 (review M4, S8): route one's label sits 48 hPa above its horizontal leg (p 670 hPa), clear of both legs
  // fix 2 (review 2 Should 3): route two's label sits ≈ 100 px up and right of its curve (it crossed the "3" and the "Δ")
  const lab: Record<string, [number, number]> = { one: [1.0, 718], two: [1.08, 930], three: [1.06, 1060] };
  return (
    <>
      <Svg>
        <ClipRect id="s28c" A={A28} pad={6} />
        <Axes A={A28} xt={[0.8, 1.0, 1.2]} yt={[600, 800, 1000]} xl="α, volume of 1 kg (m³)" yl="p (hPa)" xf={(v) => v.toFixed(1)} />
        <Curve A={A28} xs={R.two.v} ys={R.two.p} c={C.muted} w={3} dash="6 8" o={0.6} />
        {ROUTES.map(([key, c, dash], i) => <Curve key={key} A={A28} xs={R[key].v} ys={R[key].p} c={c} w={7} dash={dash || undefined} upto={draw[i]} clipId="s28c" />)}
        <Dot p={pA} c={C.gold} r={14} /><Lbl x={pA[0] - 24} y={pA[1] - 34} t="start" c={C.key} s={T.floor} a="end" />
        <Dot p={pB} c={C.gold} r={14} /><Lbl x={pB[0] + 24} y={pB[1] + 40} t="end" c={C.key} s={T.floor} />

        {ROUTES.map(([key, c], i) => (
          <g key={key} opacity={(label >= i + 1 ? 1 : 0) * (1 - ent)}>
            <Lbl x={P(lab[key][0], lab[key][1])[0]} y={P(lab[key][0], lab[key][1])[1]} t={`${Math.round(R[key].q)} kJ/kg`} c={c} s={T.key} a="middle" />
          </g>
        ))}
        {ROUTES.map(([key, c], i) => (
          <g key={`e${key}`} opacity={ent}>
            <Lbl x={P(lab[key][0], lab[key][1])[0]} y={P(lab[key][0], lab[key][1])[1]} t={i === 2 ? "Δη = 116 J kg⁻¹ K⁻¹" : "Δη = 116"} c={c} s={T.key} a="middle" />
          </g>
        ))}
      </Svg>
      {parcel && parcel.s > 0 && parcel.s < 1 ? (() => {
        const key = ROUTES[parcel.r][0], v = R[key].v as number[], i = Math.min(v.length - 1, Math.round(parcel.s * (v.length - 1)));
        return <ParcelBox3D p={pos(key, parcel.s)} size={Math.round(70 * Math.cbrt(v[i] / 0.8))} />;
      })() : null}
    </>
  );
};
const S28: React.FC = () => {
  // fix 1 (review M3, S16): new S2–S4 name the first law, I, đQ, đW and the barred d (the equation now appears on S2, the
  // definitions beside it); a 3-D air parcel grows ×1.5 in volume on S5 (illustrative cube; the chart parcel follows the
  // routes); every later sentence shifts by three
  const f = useCurrentFrame(), k = K("s28_heat_routes");
  const d = [5, 6, 7].map((j) => prog(f, SS(k, j), SS(k, j) + 75));
  const cur = d[2] > 0 ? 2 : d[1] > 0 ? 1 : 0;
  const lbl = f >= AT(k, 8, "forty") ? 3 : f >= AT(k, 8, "thirty three") ? 2 : f >= AT(k, 8, "twenty seven") ? 1 : 0;
  const tLaw = SS(k, 1), tI = AT(k, 2, "d I"), tBar = AT(k, 3, "with a d"), tPar = SS(k, 4), tR1 = SS(k, 5);
  const grow = prog(f, AT(k, 4, "let it expand"), AT(k, 4, "ending at"));
  const oPar = fin(f, tPar) * fout(f, tR1);
  // fix 2 (review 2 Should 2): the parcel is ≈ 300 px, stays through the three routes (S6-S9) and follows the route being drawn:
  // its edge ∝ ∛(α/α_A) (volume) and its tint cool / warm with T = pα/R (blue below 280 K, orange above)
  const tCube = SS(k, 9), mv = prog(f, tR1, tR1 + 20);
  let vol = 1 + 0.5 * grow, Tp = D.routes_AB.T as number;
  if (f >= tR1) {
    const R = D.routes[ROUTES[cur][0]], v = R.v as number[], pr_ = R.p as number[], i = Math.min(v.length - 1, Math.round(d[cur] * (v.length - 1)));
    vol = v[i] / D.routes_AB.vA; Tp = (pr_[i] * 100 * v[i]) / 287;
  }
  const hx = (h: string) => [1, 3, 5].map((j) => parseInt(h.slice(j, j + 2), 16));
  const mixC = (a: string, b: string, t: number) => { const A = hx(a), B = hx(b), u = clamp(t, 0, 1); return `#${A.map((x, j) => Math.round(x + (B[j] - x) * u).toString(16).padStart(2, "0")).join("")}`; };
  const tint = Tp < 280 ? mixC("#7cc4ff", "#3f63d8", (280 - Tp) / 93) : mixC("#7cc4ff", C.second, (Tp - 280) / 140);
  const cubeP: Pt = [mix(MX + 470, MX + 560, mv), mix(470, 640, mv)];
  const eq = rep(rep(EQ_S28, "đQ", String.raw`\textcolor{#d8b23a}{đ}Q`), "đW", String.raw`\textcolor{#d8b23a}{đ}W`);
  return (
    <Scene>
      <RouteChart draw={d} label={lbl} parcel={{ r: cur, s: d[cur] }} />
      <TeX s={eq} x={MX + 40} y={150} size={84} o={fin(f, tLaw)} />
      <TeX s={EQ_S28} x={0} y={0} size={84} o={0} />
      <Svg>
        {/* fix 2 (review 2 Should 1): the right half carries S1's words (QA halves) before the first law arrives */}
        <Keyword f={f} text="small changes, not perfect" at={[MX + 20, 150]} appear={AT(k, 0, "small changes")} out={tLaw - 8} />
        <Lbl x={MX + 20} y={250} t="heat · work" c={C.key} s={T.key} o={fin(f, AT(k, 0, "heat and work")) * fout(f, tLaw - 8)} />
        <Keyword f={f} text="first law of thermodynamics" at={[MX + 20, 270]} appear={AT(k, 1, "first law")} out={tPar - 10} />
        <Lbl x={MX + 20} y={360} t="I: internal energy" c={C.key} s={T.floor} o={fin(f, tI) * fout(f, tPar - 10)} />
        <Lbl x={MX + 20} y={420} t="(the molecules' motion)" c={C.muted} s={T.floor} o={fin(f, AT(k, 2, "molecules")) * fout(f, tPar - 10)} />
        <Lbl x={MX + 20} y={500} t="Q: heat added" c={C.key} s={T.floor} o={fin(f, AT(k, 2, "heat added")) * fout(f, tPar - 10)} />
        <Lbl x={MX + 20} y={560} t="W: work done on the air" c={C.key} s={T.floor} o={fin(f, AT(k, 2, "work done")) * fout(f, tPar - 10)} />
        <Lbl x={MX + 20} y={650} t="đ: a small amount, not a change" c={C.gold} s={T.floor} o={fin(f, tBar) * fout(f, tPar - 10)} />
        <g opacity={oPar}>
          <Lbl x={MX + 40} y={330} t="280 K" c={C.key} s={T.key} />
          <Lbl x={MX + 470} y={690} t="× 1.5 volume" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 4, "one and a half"))} />
          <Lbl x={MX + 470} y={760} t="same T at the end" c={C.local} s={T.floor} a="middle" o={fin(f, AT(k, 4, "ending at"))} />
        </g>
        {["1  fixed α, then fixed p", "2  fixed T", "3  fixed p, then fixed α"].map((t, i) => (
          <g key={t} opacity={fin(f, SS(k, i + 5))}>
            <line x1={MX} y1={300 + i * 70} x2={MX + 60} y2={300 + i * 70} stroke={ROUTES[i][1]} strokeWidth={7} strokeDasharray={ROUTES[i][2] || undefined} />
            <Lbl x={MX + 80} y={300 + i * 70} t={t} c={C.key} s={T.floor} />
          </g>
        ))}
        <Keyword f={f} text="heat: not a state function" at={[MX + 20, 580]} appear={AT(k, 10, "not a state function")} />
        <Lbl x={MX + 20} y={650} t="nor is work" c={C.local} s={T.floor} o={fin(f, SS(k, 11))} />
        <Keyword f={f} text="internal energy: ΔI = 0" at={[MX + 20, 760]} appear={AT(k, 12, "internal energy")} />
      </Svg>
      <ParcelBox3D p={cubeP} size={Math.round(330 * Math.cbrt(vol))} o={fin(f, tPar) * fout(f, tCube)} color={tint} />
    </Scene>
  );
};
const S29: React.FC = () => {
  const f = useCurrentFrame(), k = K("s29_entropy");
  const [q1, q2] = EQ_S29.split(String.raw`,\qquad `);
  const parts: Part[] = [{ t: "đQ=" }, { t: "c_v", u: { w: String.raw`\text{heat per kg per K}`, c: C.gold } }, { t: String.raw`\,dT+p\,` }, { t: String.raw`d\alpha`, u: { w: String.raw`\alpha=1/\rho`, c: C.gold } }];
  // fix 1 (review M3, S11, M4): new S5 "That's the first law turned round …" (shown as c_v dT = dI, p dα = −đW on S5 only);
  // "written eta" on S14; later sentences shift by one; Δη labels lifted, unit once
  const dim = 1 - 0.55 * fin(f, SS(k, 9));

  return (
    <Scene>
      <RouteChart draw={[1, 1, 1]} label={3} ent={fin(f, AT(k, 14, "one hundred and sixteen"))} />
      <TeX s={q1} x={MX} y={120} size={66} o={fin(f, SS(k, 1)) * dim} />
      <Svg>
        <Lbl x={MX} y={205} t="cᵥ: heat to warm 1 kg by 1 K" c={C.muted} s={T.floor} o={fin(f, SS(k, 2)) * dim} />
        <Lbl x={MX} y={258} t="α = 1/ρ: specific volume" c={C.muted} s={T.floor} o={fin(f, SS(k, 3)) * dim} />
      </Svg>
      <TeX s={String.raw`c_v\,dT=dI,\qquad p\,d\alpha=-đW`} x={MX} y={350} size={56} c={C.gold} o={fin(f, AT(k, 4, "c v d T")) * fout(f, SS(k, 5) - 8)} />
      <TeX s={String.raw`p=\frac{RT}{\alpha}`} x={MX} y={350} size={52} o={fin(f, SS(k, 5)) * dim} />
      <TeX s={String.raw`\frac{\partial c_v}{\partial\alpha}=0\ \ \neq\ \ \frac{\partial(RT/\alpha)}{\partial T}=\frac{R}{\alpha}`} x={MX} y={475} size={46} c={C.neg} o={fin(f, SS(k, 7)) * dim} />
      <TeX s={String.raw`\div\,T`} x={MX + 620} y={475} size={56} c={C.gold} o={fin(f, SS(k, 9))} />
      <TeX s={rep(q2, String.raw`d\eta`, String.raw`\textcolor{#d8b23a}{d\eta}`)} x={MX} y={596} size={56} c={C.key} o={fin(f, SS(k, 10))} />
      <TeX s={String.raw`\frac{\partial(c_v/T)}{\partial\alpha}=0=\frac{\partial(R/\alpha)}{\partial T}`} x={MX} y={716} size={44} c={C.first} o={fin(f, SS(k, 11))} />
      <Svg>
        <Check x={MX + 600} y={716} o={fin(f, SS(k, 12))} />
        <Keyword f={f} text="entropy, η (eta)" at={[MX + 20, 816]} appear={AT(k, 13, "entropy")} out={SS(k, 15)} />
        <Keyword f={f} text="potential temperature" at={[MX + 20, 816]} appear={AT(k, 15, "potential temperature")} o={1} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s30 zoom until the profile is a line
const Q3 = (() => {                                                 // the quadratic through the three levels round 1.5 km (picture of the smooth curve)
  const i = SN.k85, z = [PROF.z[i - 1], PROF.z[i], PROF.z[i + 1]], t = [PROF.t[i - 1], PROF.t[i], PROF.t[i + 1]];
  const d01 = (t[1] - t[0]) / (z[1] - z[0]), d12 = (t[2] - t[1]) / (z[2] - z[1]), d012 = (d12 - d01) / (z[2] - z[0]);
  return { z0: z[0], z2: z[2], f: (zz: number) => t[0] + d01 * (zz - z[0]) + d012 * (zz - z[0]) * (zz - z[1]) };
})();
const SmoothProfile: React.FC<{ A: Ax; clip: string; w?: number }> = ({ A, clip, w = 6 }) => {
  const P = axP(A), pts: Pt[] = [];
  const zs = PROF.z, ts = PROF.t;
  for (let i = 0; i < zs.length; i++) {
    if (zs[i] > Q3.z0 && zs[i] < Q3.z2) continue;
    if (Math.abs(zs[i] - Q3.z2) < 1e-9) for (let q = 1; q < 60; q++) { const zz = Q3.z0 + ((Q3.z2 - Q3.z0) * q) / 60; pts.push(P(Q3.f(zz), zz)); }
    pts.push(P(ts[i], zs[i]));
  }
  return <path d={poly(pts)} stroke={C.local} strokeWidth={w} fill="none" strokeLinejoin="round" clipPath={`url(#${clip})`} />;
};
const S30: React.FC = () => {
  const f = useCurrentFrame(), k = K("s30_zoom");
  const z1 = prog(f, AT(k, 3, "zoom in"), AT(k, 3, "zoom in") + 40), z2 = prog(f, SS(k, 4), SS(k, 4) + 35), z3 = prog(f, SS(k, 5), SS(k, 5) + 35);
  const hw = [[52.5, 16], [14, 2.6], [3.5, 0.65], [0.875, 0.1625]];
  const cx0 = -22.5, cz0 = 16;
  const lv = z3 > 0 ? 2 + z3 : z2 > 0 ? 1 + z2 : z1;
  const L = Math.min(2, Math.floor(lv)), w = lv - L;
  const lg = (a: number, b: number) => Math.exp(mix(Math.log(a), Math.log(b), w));
  const hT = lg(hw[L][0], hw[L + 1][0]), hZ = lg(hw[L][1], hw[L + 1][1]);
  const cT = L === 0 ? mix(cx0, T85, w) : T85, cZ = L === 0 ? mix(cz0, Z85, w) : Z85;
  const A: Ax = { x: 250, y: 80, w: 700, h: 650, xr: [cT - hT, cT + hT], yr: [Math.max(cZ - hZ, L === 0 && w < 0.01 ? 0 : -99), cZ + hZ] };
  if (L === 0 && w < 0.01) A.yr = [0, 32];
  const P = axP(A);
  const sl = SN.slope;
  const tg = (zz: number): Pt => P(T85 + sl * (zz - Z85), zz);
  const dec = (s: number) => (s >= 1 ? 0 : s >= 0.1 ? 1 : 2);
  const Am: Ax = { x: 1250, y: 110, w: 460, h: 520, xr: [-75, 30], yr: [0, 32] };
  const Pm = axP(Am);
  const b0 = Pm(A.xr[0], A.yr[1]), b1 = Pm(A.xr[1], A.yr[0]);
  return (
    <Scene>
      <Svg>
        <ClipRect id="s30c" A={A} pad={2} />
        <Axes A={A} xt={ticksOf(A.xr[0], A.xr[1])} yt={ticksOf(A.yr[0], A.yr[1])} xl="°C" yl="km" xf={(v) => nf(v, dec((A.xr[1] - A.xr[0]) / 5))} yf={(v) => nf(v, dec((A.yr[1] - A.yr[0]) / 5) + 1)} />
        <SmoothProfile A={A} clip="s30c" />
        <path d={poly([tg(cZ - 2 * hZ), tg(cZ + 2 * hZ)])} stroke={C.gold} strokeWidth={5} fill="none" clipPath="url(#s30c)" opacity={fin(f, AT(k, 3, "zoom in"))} />
        <Dot p={P(T85, Z85)} c={C.gold} r={10} o={fin(f, AT(k, 3, "zoom in"))} />
        <Lbl x={P(-60, 13.6)[0]} y={P(-60, 13.6)[1]} t="kink" c={C.key} s={T.floor} o={fin(f, AT(k, 2, "kinks")) * (1 - z1)} />
        <ClipRect id="s30m" A={Am} pad={2} />
        <Axes A={Am} xt={[-60, -30, 0]} yt={[0, 10, 20, 30]} xl="°C" yl="km" grid={false} />
        <ProfileLine A={Am} zTop={32} w={4} clip="s30m" />
        <rect x={b0[0]} y={b0[1]} width={Math.max(6, b1[0] - b0[0])} height={Math.max(6, b1[1] - b0[1])} fill="none" stroke={C.gold} strokeWidth={4} opacity={fin(f, AT(k, 3, "zoom in"))} />
        <Keyword f={f} text="tangent" at={[1250, 722]} appear={SS(k, 7)} />
        <Keyword f={f} text="locally a line" at={[1250, 792]} appear={SS(k, 8)} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s31 the line: first two terms of the Taylor series
const S31: React.FC = () => {
  const f = useCurrentFrame(), k = K("s31_linear_approx");
  const A: Ax = { x: 250, y: 90, w: 680, h: 640, xr: [-20, 25], yr: [0, 7] };
  const P = axP(A);
  const sl = SN.slope, zA = Z85 + 1, zB = Z50;
  const tg = (zz: number): Pt => P(T85 + sl * (zz - Z85), zz);
  const i1 = SN.k85 - 1, i2 = SN.k85 + 1;
  const tl = fin(f, SS(k, 1));
  const Tlo = PROF.t[i1], Thi = PROF.t[i2], zlo = PROF.z[i1], zhi = PROF.z[i2];
  const p1 = SS(k, 5), p2 = SS(k, 8);
  return (
    <Scene>
      <Svg>
        <ClipRect id="s31c" A={A} pad={4} />
        <Axes A={A} xt={[-20, -10, 0, 10, 20]} yt={[0, 2, 4, 6]} xl="°C" yl="km" />
        <ProfileLine A={A} zTop={7} clip="s31c" />
        <path d={poly([tg(0.4), tg(6.9)])} stroke={C.gold} strokeWidth={5} fill="none" clipPath="url(#s31c)" opacity={tl} />
        <Dot p={P(T85, Z85)} c={C.gold} r={11} />
        <Dot p={P(Tlo, zlo)} c={C.local} r={8} o={fin(f, SS(k, 3))} /><Dot p={P(Thi, zhi)} c={C.local} r={8} o={fin(f, SS(k, 3))} />
        <GOLDRING p={P(SN.lin1, zA)} o={fin(f, AT(k, 5, "seven point four"))} />
        <Dot p={P(SN.meas1, zA)} c={C.local} r={10} o={fin(f, SS(k, 6))} />
        <Bracket p={P(SN.meas1, zA)} q={P(SN.lin1, zA)} off={-26} c={C.neg} o={fin(f, SS(k, 6))} />
        <Lbl x={P(SN.lin1, zA)[0] + 30} y={P(SN.lin1, zA)[1]} t="off 0.5" c={C.neg} s={T.floor} o={fin(f, SS(k, 6))} />
        <GOLDRING p={P(SN.lin4, zB)} o={fin(f, AT(k, 8, "minus eight point four"))} />
        <Dot p={P(T50, zB)} c={C.local} r={10} o={fin(f, AT(k, 8, "balloon measured"))} />
        <Bracket p={P(T50, zB)} q={P(SN.lin4, zB)} off={-26} c={C.neg} o={fin(f, SS(k, 9))} />
        <Lbl x={P(SN.lin4, zB)[0] + 30} y={P(SN.lin4, zB)[1]} t="off 3.4" c={C.neg} s={T.floor} o={fin(f, SS(k, 9))} />
        <Lbl x={P(12.3, Z85)[0] + 24} y={P(12.3, Z85)[1] + 36} t="z₀" c={C.gold} s={T.key} />
      </Svg>
      {/* fix 1 (review S6): smaller top line, the slope split at "≈", the stack moved right so its lhs stays in the maths zone */}
      <TeX s={EQ_S31} x={MX} y={130} size={56} c={C.key} o={tl} />
      <TeX s={String.raw`T(z_0)=12.3\ ^{\circ}\mathrm C`} x={MX} y={240} size={54} o={fin(f, SS(k, 2))} />
      <TeX s={String.raw`\frac{dT}{dz}\approx\frac{${nf(Thi, 1).replace("−", "-")}-${nf(Tlo, 1).replace("−", "-")}}{${zhi.toFixed(3)}-${zlo.toFixed(3)}}`}
        x={MX} y={345} size={50} o={fin(f, SS(k, 3))} />
      <TeX s={String.raw`\approx-4.86\ ^{\circ}\mathrm C/\mathrm{km}`} x={MX + 110} y={442} size={50} o={fin(f, AT(k, 3, "minus four point nine"))} />
      <CalcStack f={f} x={MX + 250} y={490} size={44} maxLines={4} rows={[
        ROW(String.raw`\approx12.3-1\times4.86\approx7.4`, p1, String.raw`T(z_0+1)`, { c: C.gold }),
        ROW(String.raw`6.9\ \ (\text{off}\ 0.5)`, SS(k, 6), String.raw`\text{balloon}`, { c: C.local, lc: C.local }),
        ROW(String.raw`\approx12.3-4.26\times4.86`, p2, String.raw`T(z_0+4.26)`, { c: C.gold }),
        ROW(String.raw`\approx-8.4`, AT(k, 8, "minus eight point four"), undefined, { c: C.gold, cont: true }),
        ROW(String.raw`-11.8\ \ (\text{off}\ 3.4)`, AT(k, 8, "balloon measured"), String.raw`\text{balloon}`, { c: C.neg, lc: C.local }),
      ]} />
    </Scene>
  );
};

// ================================================================ s32 adding the bend: why h²/2, then 3!
const S32: React.FC = () => {
  const f = useCurrentFrame(), k = K("s32_add_bend");
  const tG = SS(k, 4);
  const g1: Ax = { x: 300, y: 80, w: 600, h: 190, xr: [-1.5, 1.5], yr: [0, 2.3] };
  const g2: Ax = { x: 300, y: 340, w: 600, h: 190, xr: [-1.5, 1.5], yr: [-3.2, 3.2] };
  const g3: Ax = { x: 300, y: 600, w: 600, h: 170, xr: [-1.5, 1.5], yr: [0, 3] };
  const hs = Array.from({ length: 61 }, (_, i) => -1.5 + i * 0.05);
  const A31: Ax = { x: 250, y: 90, w: 680, h: 640, xr: [-20, 25], yr: [0, 7] };
  const P31 = axP(A31);
  const [fs1] = [EQ_S32];
  const bend: Part[] = [{ t: String.raw`\frac{h^2}{2}\,\frac{d^2f}{dx^2}`, u: { w: String.raw`\text{the bend}`, c: C.gold } }];
  const early = 1 - fin(f, tG);
  const dimR = 1 - 0.85 * fin(f, SS(k, 10));
  return (
    <Scene>
      <Svg o={early}>
        <ClipRect id="s32c" A={A31} pad={4} />
        <Axes A={A31} xt={[-20, -10, 0, 10, 20]} yt={[0, 2, 4, 6]} xl="°C" yl="km" />
        <ProfileLine A={A31} zTop={7} clip="s32c" />
        <path d={poly([P31(T85 + SN.slope * (0.4 - Z85), 0.4), P31(T85 + SN.slope * (6.9 - Z85), 6.9)])} stroke={C.gold} strokeWidth={5} clipPath="url(#s32c)" />
      </Svg>
      <Svg o={fin(f, tG)}>
        {[[g1, (h: number) => h * h, "c h²", tG], [g2, (h: number) => 2 * h, "slope 2c h", AT(k, 5, "two c h")], [g3, () => 2, "second derivative 2c", AT(k, 5, "second derivative is")]].map(([A, fn, lab, at], i) => (
          <g key={i} opacity={fin(f, at as number)}>
            <Axes A={A as Ax} xt={[-1, 0, 1]} yt={[]} grid={false} xl={i === 2 ? "h" : undefined} />
            <Curve A={A as Ax} xs={hs} ys={hs.map(fn as (h: number) => number)} c={[C.local, C.first, C.second][i]} w={6} />
            {/* fix 3 (review 3 S12): "c h²" is centred over the parabola's flat bottom (it touched the curve at the left end) */}
            {i === 0 ? <Lbl x={(A as Ax).x + (A as Ax).w / 2} y={(A as Ax).y + 14} t={lab as string} c={C.local} s={T.floor} a="middle" />
              : <Lbl x={(A as Ax).x + 20} y={(A as Ax).y + 10} t={lab as string} c={[C.local, C.first, C.second][i]} s={T.floor} />}
          </g>
        ))}
      </Svg>
      <TeX s={EQ_S31} x={MX} y={150} size={64} c={C.muted} o={fin(f, 4) * fout(f, SS(k, 2) - 10)} />
      <Layered parts={bend} x={MX} y={150} size={72} o={fin(f, SS(k, 2)) * dimR} layers={[{ t: "all", o: 1 }, { t: [], u: [0], o: fin(f, AT(k, 2, "divided by two")) }]} />
      {/* fix 1 (review M1): the stack starts 60 px below the "the bend" brace label and leaves when the h³ term arrives (S8),
          which takes its place; "Taylor series" sits between the h³ line and the full series, over nothing */}
      {/* fix 3 (review 3 S11): d/dh and d²/dh² as display fractions (full-size letters), rows 150 px */}
      <CalcStack f={f} x={MX + 290} y={330} size={54} o={1 - fin(f, SS(k, 7), 10)} rows={[
        ROW(String.raw`=2c\,h`, AT(k, 5, "two c h"), String.raw`\dfrac{d}{dh}(c\,h^2)`, { h: 150 }),
        ROW(String.raw`=2c`, AT(k, 5, "second derivative is"), String.raw`\dfrac{d^2}{dh^2}(c\,h^2)`, { h: 150 }),
        ROW(String.raw`=\frac{f''}{2}`, SS(k, 6), "c", { c: C.gold }),
      ]} />
      <TeX s={String.raw`\dfrac{h^3}{3!}\,f''',\qquad 3!=3\times2\times1=6`} x={MX} y={400} size={56} o={fin(f, SS(k, 7) + 12, 14) * (1 - fin(f, SS(k, 10)))} />
      <TeX s={cut2(fs1, String.raw`+\frac{h^2}{2!}`)[0]} x={MX} y={650} size={52} c={C.key} o={fin(f, SS(k, 10))} />
      <TeX s={String.raw`+\frac{h^2}{2!}` + cut2(fs1, String.raw`+\frac{h^2}{2!}`)[1]} x={MX + 40} y={760} size={52} c={C.key} o={fin(f, AT(k, 10, "plus h squared"))} />
      <Svg><Keyword f={f} text="Taylor series" at={[MX + 20, 545]} appear={SS(k, 9)} /></Svg>
    </Scene>
  );
};

// ================================================================ s33 a Taylor series at work: e^h (easy function)
const S33: React.FC = () => {
  const f = useCurrentFrame(), k = K("s33_series_example");
  const A: Ax = { x: 250, y: 80, w: 680, h: 640, xr: [-0.2, 1.25], yr: [0, 3.6] };
  const P = axP(A);
  const tx = D.taylor;
  const s3 = [AT(k, 3, "the sums are one"), AT(k, 3, "then one point one,"), AT(k, 3, "one point one zero five,"), AT(k, 3, "one point one zero five one seven")];
  const s5 = [AT(k, 5, "one, two"), AT(k, 5, "two, two point five") , AT(k, 5, "two point five, two"), AT(k, 5, "two point six six seven"), AT(k, 5, "two point seven zero eight"), AT(k, 5, "towards")];
  const n3 = s3.filter((a) => f >= a).length, n5 = s5.filter((a) => f >= a).length;
  const order = f >= SS(k, 5) ? Math.max(0, Math.min(4, n5 - 1)) : Math.max(0, n3 - 1);
  const v01 = ["1", "1.1", "1.105", "1.10517"].slice(0, n3).join(String.raw`\ \to\ `);
  const v1 = ["1", "2", "2.5", "2.667", "2.708", String.raw`\to2.718`].slice(0, n5).join(", ");   // fix 1 (S6): narrower
  return (
    <Scene>
      <Svg>
        <ClipRect id="s33c" A={A} pad={2} />
        <Axes A={A} xt={[0, 0.5, 1]} yt={[0, 1, 2, 3]} xl="h" xf={(v) => (v === 0.5 ? "0.5" : nf(v, 0))} />
        {tx.fam.map((ys: number[], o: number) => <Curve key={o} A={A} xs={tx.h} ys={ys} c={C.first} w={o === order ? 7 : 3} o={o === order ? 1 : 0.3} clipId="s33c" />)}
        <Curve A={A} xs={tx.h} ys={tx.exp} c={C.local} w={6} clipId="s33c" />
        <line x1={axX(A)(0.1)} y1={A.y} x2={axX(A)(0.1)} y2={A.y + A.h} stroke={C.gold} strokeWidth={3} strokeDasharray="8 8" opacity={fin(f, SS(k, 3)) * fout(f, SS(k, 5))} />
        <line x1={axX(A)(1)} y1={A.y} x2={axX(A)(1)} y2={A.y + A.h} stroke={C.gold} strokeWidth={3} strokeDasharray="8 8" opacity={fin(f, SS(k, 5))} />

        <Lbl x={P(0.16, 3.3)[0]} y={P(0.16, 3.3)[1]} t={`${order + 1} term${order ? "s" : ""}`} c={C.first} s={T.key} o={fin(f, SS(k, 3))} />
      </Svg>
      {/* fix 1 (review S6): e^h series at 58 px; the reminder of the general series on two lines (both end before x 1840) */}
      <TeX s={EQ_S33} x={MX} y={150} size={58} c={C.key} o={fin(f, SS(k, 2))} />
      <TeX s={cut2(EQ_S32, String.raw`+\frac{h^2}{2!}`)[0]} x={MX} y={120} size={46} c={C.muted} o={fin(f, 4) * fout(f, SS(k, 2) - 10)} />
      <TeX s={String.raw`+\frac{h^2}{2!}` + cut2(cut2(EQ_S32, String.raw`+\frac{h^2}{2!}`)[1], String.raw`+\frac{h^3}{3!}`)[0] + String.raw`+\cdots`} x={MX + 60} y={215} size={46} c={C.muted}
        o={fin(f, 4) * fout(f, SS(k, 2) - 10)} />
      <TeX s={String.raw`e^x:\ \ \text{every derivative is}\ e^x`} x={MX} y={320} size={52} c={C.local} o={fin(f, AT(k, 0, "e to the x")) * fout(f, SS(k, 3) - 10)} />
      <TeX s={String.raw`h=0.1:`} x={MX} y={320} size={54} c={C.gold} o={fin(f, SS(k, 3))} />
      <TeX s={v01 || "1"} x={MX} y={410} size={54} o={fin(f, SS(k, 3))} />
      <TeX s={String.raw`\text{calculator}:\ 1.10517`} x={MX} y={500} size={50} c={C.local} o={fin(f, SS(k, 4))} />
      <Svg><Check x={MX + 560} y={500} o={fin(f, SS(k, 4) + 10)} /></Svg>
      <TeX s={String.raw`h=1:`} x={MX} y={610} size={54} c={C.gold} o={fin(f, SS(k, 5))} />
      <TeX s={v1 || "1"} x={MX} y={690} size={56} o={fin(f, SS(k, 5))} />
      <TeX s="e^h" x={axX(A)(1.08)} y={axY(A)(3.35)} size={56} c={C.local} />
      <Svg><Keyword f={f} text="small step, few terms" at={[MX + 20, 800 - 10]} appear={SS(k, 6)} /></Svg>
    </Scene>
  );
};

// ================================================================ s34, s35 the pressure: the line is hydrostatic balance; the far step
const pExp = (zk: number, T0 = SN.T0) => SN.p0 * Math.exp((-zk * 1000 * 9.81) / (287 * T0));
const S34: React.FC = () => {
  const f = useCurrentFrame(), k = K("s34_pressure_line");
  const A: Ax = { x: 250, y: 90, w: 680, h: 620, xr: [840, 1010], yr: [0, 1.5] };
  const P = axP(A);
  const H = SN.H / 1000, p0 = SN.p0;
  const zs = Array.from({ length: 61 }, (_, i) => i * 0.025);
  const z1 = SN.z1 / 1000;
  const [first, second] = EQ_S34.split(String.raw`,\qquad `);
  const lineOnly = rep(first, String.raw`+\frac{z^2}{2H^2}`, "");
  const tL = SS(k, 2), tB = AT(k, 8, "Adding the bend");
  const balloon = PROF.z.map((z, i) => [SN.p[i], z - PROF.z[0]]).filter(([, z]) => z >= 0 && z <= 1.5);
  return (
    <Scene>
      <Svg>
        <ClipRect id="s34c" A={A} pad={4} />
        <Axes A={A} xt={[850, 900, 950, 1000]} yt={[0, 0.5, 1, 1.5]} xl="pressure (hPa)" yl="km above Trappes" yf={(v) => v.toFixed(1)} />
        <Curve A={A} xs={zs.map((z) => pExp(z))} ys={zs} c={C.local} w={6} clipId="s34c" />
        <Curve A={A} xs={zs.map((z) => p0 * (1 - z / H))} ys={zs} c={C.gold} w={5} o={fin(f, tL)} clipId="s34c" />
        <Curve A={A} xs={zs.map((z) => p0 * (1 - z / H + (z * z) / (2 * H * H)))} ys={zs} c={C.second} w={5} dash="14 9" o={fin(f, tB)} clipId="s34c" />
        {balloon.map(([pp, z], i) => <Dot key={i} p={P(pp, z)} c={C.first} r={8} o={fin(f, AT(k, 8, "balloon measured"))} />)}
        <line x1={A.x} y1={axY(A)(z1)} x2={A.x + A.w} y2={axY(A)(z1)} stroke={C.muted} strokeWidth={2} strokeDasharray="6 8" opacity={fin(f, SS(k, 6))} />
        <Lbl x={A.x + A.w - 10} y={axY(A)(z1) + 30} t="1 km up" c={C.muted} s={T.floor} a="end" o={fin(f, SS(k, 6))} />
        <Dot p={P(SN.tp1[1], z1)} c={C.gold} r={11} o={fin(f, SS(k, 7))} />
        <Dot p={P(SN.tp1[2], z1)} c={C.second} r={11} o={fin(f, tB)} />
        <Lbl x={P(880, 0.3)[0]} y={P(880, 0.3)[1]} t="line" c={C.gold} s={T.floor} o={fin(f, tL)} />
        <Lbl x={P(875, 1.32)[0]} y={P(875, 1.32)[1]} t="exponential" c={C.local} s={T.floor} />
        <Plane p={[MX + 60, 560]} s={1.1} o={fin(f, SS(k, 5))} />
        <Lbl x={MX + 120} y={560} t="≈ 30 ft per hPa (pilots)" c={C.key} s={T.floor} o={fin(f, SS(k, 5))} />
        {/* fix 3 (review 3 Must 7): no link (it read as a third curve and landed on "line"); the point carries its own value,
            below-left of the ring where no curve runs */}
        <Lbl x={P(SN.tp1[1], z1)[0] - 24} y={P(SN.tp1[1], z1)[1] + 40} t={SN.tp1[1].toFixed(1)} c={C.gold} s={T.floor} a="end" o={fin(f, SS(k, 7))} />
      </Svg>
      <TeX s={EQ_S27} x={MX} y={140} size={64} c={C.muted} o={fin(f, 4) * fout(f, tL - 10)} />
      <TeX s={lineOnly} x={MX} y={140} size={64} o={fin(f, tL) * fout(f, tB)} />
      <TeX s={first} x={MX} y={140} size={64} o={fin(f, tB)} />
      <TeX s={second} x={MX} y={270} size={60} c={C.gold} o={fin(f, SS(k, 3))} />
      <Svg><Lbl x={MX + 330} y={270} t="hydrostatic balance" c={C.key} s={T.floor} o={fin(f, AT(k, 3, "hydrostatic balance"))} /></Svg>
      <CalcStack f={f} x={MX + 90} y={350} size={52} rows={[
        ROW(String.raw`=1.186\times9.81\approx11.6\ \mathrm{Pa/m}`, SS(k, 4), String.raw`\rho_0 g`),
        ROW(String.raw`\to\ 1\ \mathrm{hPa}\ \text{per}\ 8.6\ \mathrm m`, AT(k, 4, "one hectopascal")),
      ]} />
      <TeX s={String.raw`\text{line}\ 880.4\qquad +\text{bend}\ 887.3`} x={MX} y={670} size={50} c={C.gold} o={fin(f, SS(k, 7))} />
      <TeX s={String.raw`\text{balloon}\ 887.0\ \mathrm{hPa}`} x={MX} y={770} size={50} c={C.first} o={fin(f, AT(k, 8, "balloon measured"))} />
    </Scene>
  );
};
const S35: React.FC = () => {
  const f = useCurrentFrame(), k = K("s35_pressure_far");
  const A: Ax = { x: 250, y: 90, w: 680, h: 620, xr: [300, 1010], yr: [0, 6] };
  const P = axP(A);
  const H = SN.H / 1000, p0 = SN.p0, z5 = SN.z5 / 1000;
  const zs = Array.from({ length: 61 }, (_, i) => i * 0.1);
  const tp = SN.tp5 as number[];
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = AT(k, 2, "next term"), t4 = SS(k, 3), t5 = SS(k, 5);
  const [ser, tb] = EQ_S35.split(String.raw`;\qquad `);
  const balloon = PROF.z.map((z, i) => [SN.p[i], z - PROF.z[0]]).filter(([, z]) => z >= 0 && z <= 6);
  const poly3 = (z: number) => p0 * (1 - z / H + (z * z) / (2 * H * H) - (z * z * z) / (6 * H * H * H));
  return (
    <Scene>
      <Svg>
        <ClipRect id="s35c" A={A} pad={4} />
        <Axes A={A} xt={[400, 600, 800, 1000]} yt={[0, 2, 4, 6]} xl="pressure (hPa)" yl="km above Trappes" />
        <Curve A={A} xs={zs.map((z) => pExp(z))} ys={zs} c={C.local} w={6} clipId="s35c" />
        <Curve A={A} xs={zs.map((z) => p0 * (1 - z / H))} ys={zs} c={C.gold} w={5} o={fin(f, t1)} clipId="s35c" />
        <Curve A={A} xs={zs.map((z) => p0 * (1 - z / H + (z * z) / (2 * H * H)))} ys={zs} c={C.second} w={5} dash="14 9" o={fin(f, t2)} clipId="s35c" />
        <Curve A={A} xs={zs.map(poly3)} ys={zs} c={C.key} w={4} dash="6 8" o={fin(f, t3)} clipId="s35c" />
        <Curve A={A} xs={zs.map((z) => pExp(z, SN.Tbar))} ys={zs} c={C.local} w={4} dash="4 6" o={fin(f, t5)} clipId="s35c" />
        {balloon.map(([pp, z], i) => <Dot key={i} p={P(pp, z)} c={C.first} r={7} o={0.9} />)}
        <line x1={A.x} y1={axY(A)(z5)} x2={A.x + A.w} y2={axY(A)(z5)} stroke={C.muted} strokeWidth={2} strokeDasharray="6 8" />
        {/* fix 3 (review 3 S12): "343" right of its dot, level with it (the line leaves the dot down-right, ≥ 11 px from the text;
            below the dot it ran through the label, and left of it the y axis is too close) */}
        <Dot p={P(tp[1], z5)} c={C.gold} r={11} o={fin(f, t1)} /><Lbl x={P(tp[1], z5)[0] + 34} y={P(tp[1], z5)[1]} t="343" c={C.gold} s={T.floor} o={fin(f, t1)} />
        <Dot p={P(tp[2], z5)} c={C.second} r={11} o={fin(f, t2)} /><Lbl x={P(tp[2], z5)[0] + 24} y={P(tp[2], z5)[1] + 40} t="558" c={C.second} s={T.floor} o={fin(f, t2)} />
        <Dot p={P(tp[3], z5)} c={C.key} r={9} o={fin(f, t3)} />
        <Dot p={P(SN.pe5, z5)} c={C.local} r={11} o={fin(f, t4)} />
        <Dot p={P(500, z5)} c={C.first} r={13} />
        <Dot p={P(SN.p_tb, z5)} c={C.gold} r={9} o={fin(f, t5)} />
      </Svg>
      <CalcStack f={f} x={MX + 270} y={90} size={54} maxLines={5} rows={[
        ROW(String.raw`500\ \mathrm{hPa}`, AT(k, 0, "five hundred"), String.raw`\text{balloon}`, { c: C.first, lc: C.first }),
        ROW("343", t1, String.raw`\text{line}`, { c: C.gold }),
        ROW("558", t2, String.raw`+\ \text{bend}`, { c: C.second }),
        ROW("511", t3, String.raw`+\ \text{next term}`, { c: C.key }),
        ROW(String.raw`517\ \mathrm{hPa}`, t4, String.raw`\text{all terms}`, { c: C.local }),
      ]} />
      <TeX s={cut2(ser, String.raw`\to\cdots`)[0]} x={MX - 20} y={560} size={44} o={fin(f, t4)} />   {/* fix 1 (S6): split, ends before x 1840 */}
      <TeX s={String.raw`\to\cdots` + cut2(ser, String.raw`\to\cdots`)[1]} x={MX + 160} y={622} size={44} o={fin(f, t4)} />
      <TeX s={EQ_S34.split(String.raw`,\qquad `)[0]} x={MX} y={640} size={56} c={C.muted} o={fin(f, 4) * fout(f, t4 - 10)} />
      <TeX s={tb} x={MX} y={700} size={54} c={C.gold} o={fin(f, t5)} />
      <Svg><Lbl x={MX + 20} y={782} t="a series is as good as its curve" c={C.key} s={T.floor} o={fin(f, SS(k, 6))} /></Svg>
    </Scene>
  );
};

// ================================================================ s36 where it fails: the tropopause kink, a front
const S36: React.FC = () => {
  const f = useCurrentFrame(), k = K("s36_where_fails");
  const A: Ax = { x: 250, y: 90, w: 680, h: 640, xr: [-75, -35], yr: [8, 20] };
  const P = axP(A);
  const fit = SN.fit;
  const tF = SS(k, 3), tFr = SS(k, 4);
  const Ac: Ax = { x: 1220, y: 360, w: 580, h: 250, xr: [-12, 4], yr: [-6, 12] };
  const Pc = axP(Ac);
  const cl = E8.cut.lon as number[], ct = E8.cut.T as number[];
  let jx = 1, gmax = 0;
  for (let i = 1; i < cl.length; i++) { const g = Math.abs(ct[i] - ct[i - 1]); if (g > gmax && cl[i] > -9 && cl[i] < 0) { gmax = g; jx = i; } }
  return (
    <Scene>
      <Svg>
        <ClipRect id="s36c" A={A} pad={4} />
        <Axes A={A} xt={[-70, -60, -50, -40]} yt={[8, 12, 16, 20]} xl="°C" yl="km" />
        <ProfileLine A={A} zTop={20} zBot={7.5} clip="s36c" />
        <Curve A={A} xs={fit.lin} ys={fit.z} c={C.neg} w={5} dash="14 9" upto={prog(f, tF, tF + 40)} clipId="s36c" />
        <Curve A={A} xs={fit.quad} ys={fit.z} c={C.neg} w={4} dash="5 7" upto={prog(f, tF + 15, tF + 55)} clipId="s36c" />
        <Dot p={P(SN.trop.T, SN.trop.z / 1000)} c={C.gold} r={13} o={fin(f, AT(k, 1, "kink"))} />
        <Lbl x={P(SN.trop.T, SN.trop.z / 1000)[0] + 76} y={P(SN.trop.T, SN.trop.z / 1000)[1] - 30} t="13.07 km, −66.3 °C" c={C.key} s={T.floor} o={fin(f, AT(k, 1, "kink"))} />
        <Keyword f={f} text="tropopause" at={[P(-50, 15)[0], P(-50, 15)[1]]} appear={SS(k, 2)} targets={[P(SN.trop.T + 0.6, SN.trop.z / 1000 + 0.15)]} />
        {/* fix 3 (review 3 Must 6): the label names the rose dashed curves — it sits just above their left ends (≈ −75 °C, 14 km),
            left of the measured profile; "line, series" is said in S3 and the label is the rose "too cold" */}
        <Lbl x={P(-74.6, 14.95)[0]} y={P(-74.6, 14.95)[1]} t="too cold" c={C.neg} s={T.floor} o={fin(f, tF + 30)} />
        <g opacity={fin(f, tFr)}>
          <ClipRect id="s36f" A={Ac} pad={2} />
          <Axes A={Ac} xt={[-10, -5, 0]} yt={[0, 10]} xf={(v) => (v < 0 ? `${-v}°W` : "0°")} yl="°C" />
          <rect x={Pc(cl[jx - 2], 0)[0]} y={Ac.y} width={Pc(cl[jx + 1], 0)[0] - Pc(cl[jx - 2], 0)[0]} height={Ac.h} fill={C.gold} opacity={0.18} />
          <path d={poly(cl.map((lo, i) => Pc(lo, ct[i])))} stroke={C.first} strokeWidth={5} fill="none" clipPath="url(#s36f)" />
          <Lbl x={Ac.x + 80} y={Ac.y - 40} t="a front, 1 km up" c={C.key} s={T.floor} />
        </g>
        <Keyword f={f} text="step ≪ bending distance" at={[MX + 100, 760]} appear={SS(k, 5)} />
      </Svg>
      <Svg><Keyword f={f} text="needs a smooth curve" at={[MX + 100, 160]} appear={6} /></Svg>
    </Scene>
  );
};

// ================================================================ s37 three good reasons (montage)
const S37: React.FC = () => {
  const f = useCurrentFrame(), k = K("s37_three_reasons");
  const b1 = SS(k, 2), b2 = SS(k, 3), b3 = SS(k, 5), b3b = AT(k, 6, "spacing");
  const o1 = fin(f, 0) * fout(f, b2), o2 = fin(f, b2) * fout(f, b3), o3 = fin(f, b3) * fout(f, b3b), o4 = fin(f, b3b);
  const A: Ax = { x: 250, y: 90, w: 680, h: 640, xr: [-20, 25], yr: [0, 7] };
  const P = axP(A);
  const grow = prog(f, b3 + 20, b3b);
  const zg = mix(Z85 + 0.3, Z50, grow);
  const tg = (zz: number): Pt => P(T85 + SN.slope * (zz - Z85), zz);
  const B = boxAt(48.4, -4.4, 2.0, 80, 40, 920, 780);
  const Pm = mapP(B);
  const dots: Pt[] = [];
  for (let la = 47.5; la <= 49.4; la += 0.25) for (let lo = -6.5; lo <= -2.2; lo += 0.25) dots.push(Pm(la, lo));
  return (
    <Scene>
      <Landscape box={{ x: 80, y: 40, w: 920, h: 780 }} o={o1} cam={{ az: -100, el: 33, dist: 10.5 }} over={(pr) => <path d={poly(landCutPts(pr, 1))} stroke={C.first} strokeWidth={7} fill="none" />}>
        <Quad3D pts={[[-3.4, 0, 0], [3.4, 0, 0], [3.4, 0, 2.3], [-3.4, 0, 2.3]]} color={C.local} o={0.32} />
      </Landscape>
      <Svg o={o2}>
        <path d="M 200 560 L 760 560 L 900 360 L 340 360 Z" fill="rgba(42,161,152,0.16)" stroke={C.first} strokeWidth={4} />
        <Arrow p={[420, 500]} q={[620, 500]} color={C.second} w={9} head={30} />
        <Arrow p={[620, 500]} q={[690, 400]} color={C.second} w={9} head={30} />
        <line x1={620} y1={500} x2={620} y2={540} stroke={C.neg} strokeWidth={7} />
        <line x1={690} y1={400} x2={690} y2={460} stroke={C.neg} strokeWidth={7} />
        <Lbl x={480} y={640} t="flat close up: slope × step" c={C.key} s={T.floor} />
      </Svg>
      <Svg o={o3}>
        <ClipRect id="s37c" A={A} pad={4} />
        <Axes A={A} xt={[-20, 0, 20]} yt={[0, 2, 4, 6]} xl="°C" yl="km" />
        <ProfileLine A={A} zTop={7} clip="s37c" />
        <path d={poly([tg(0.5), tg(6.9)])} stroke={C.gold} strokeWidth={5} clipPath="url(#s37c)" />
        <Bracket p={P(Tat(zg), zg)} q={P(T85 + SN.slope * (zg - Z85), zg)} off={-24} c={C.neg} />
        <Lbl x={P(T85 + SN.slope * (zg - Z85), zg)[0] + 30} y={P(0, zg)[1]} t="error" c={C.neg} s={T.floor} />
      </Svg>
      <MapView id="s37" B={B} o={o4} L={{ t850: [{ h: 18, o: 1 }], dim: 0.2 }} children={() => <g>{dots.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={5} fill={C.ink} opacity={0.8} />)}</g>} />
      <Svg>
        <Keyword f={f} text="three good reasons" at={[MX + 20, 120]} appear={SS(k, 1)} />
        <Lbl x={MX + 20} y={260} t="1  one thing at a time" c={C.key} s={T.key} o={fin(f, b1)} />
        <Lbl x={MX + 20} y={360} t="2  slope × step adds up" c={C.key} s={T.key} o={fin(f, b2)} />
        <Lbl x={MX + 20} y={460} t="3  how small a step" c={C.key} s={T.key} o={fin(f, b3)} />
        <Lbl x={MX + 60} y={540} t="warming · model grid" c={C.local} s={T.floor} o={fin(f, b3b)} />
        {/* fix 3 (review 3 Must 9): each coloured data beat has its colour bar in the text column (landscape: the s05 bar;
            the ERA5 map: the s04 bar, title on two lines) */}
        <LandBar x={MX + 20} y={742} o={o1} />
        <T850Bar x={MX + 20} y={742} wrap o={o4} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s38 linearisation: a quiet state plus a small disturbance
const S38: React.FC = () => {
  const f = useCurrentFrame(), k = K("s38_linearisation");
  const A: Ax = { x: 250, y: 80, w: 680, h: 330, xr: [-0.2, 1.25], yr: [0, 3.6] };
  const P = axP(A);
  const tx = D.taylor;
  const x0 = 0.6, e0 = Math.exp(x0);
  const Bt = { lat0: 44, lat1: 54, lon0: -20, lon1: -4, x: MX + 360, y: 470, w: 380, h: 300 } as MapBox;
  const wave = Array.from({ length: 121 }, (_, i) => [180 + i * 6.5, 620 - 26 * Math.sin((i / 120) * 6 * Math.PI + f * 0.08) * Math.exp(-(((i - 60) / 40) ** 2))] as Pt);
  return (
    <Scene>
      <Svg>
        <ClipRect id="s38c" A={A} pad={2} />
        <Axes A={A} xt={[0, 0.5, 1]} yt={[1, 2, 3]} grid={false} xf={(v) => v.toFixed(1)} />
        <Curve A={A} xs={tx.h} ys={tx.exp} c={C.local} w={6} clipId="s38c" />
        <path d={poly([P(x0 - 0.6, e0 * (1 - 0.6)), P(x0 + 0.6, e0 * (1 + 0.6))])} stroke={C.gold} strokeWidth={5} clipPath="url(#s38c)" />
        <Dot p={P(x0, e0)} c={C.gold} r={11} />
        <g opacity={fin(f, SS(k, 2))}>
          <line x1={160} y1={620} x2={980} y2={620} stroke={C.muted} strokeWidth={4} />
          <path d={poly(wave)} stroke={C.first} strokeWidth={6} fill="none" />
          <Lbl x={170} y={690} t="quiet state" c={C.muted} s={T.floor} />
          <Lbl x={560} y={540} t="small disturbance" c={C.first} s={T.floor} />
        </g>
        <Keyword f={f} text="linearisation" at={[MX + 20, 290]} appear={AT(k, 0, "linearisation")} />
        <g opacity={fin(f, SS(k, 3))}>
          <path d={poly(Array.from({ length: 41 }, (_, i) => [MX + 20 + i * 8, 600 - 30 * Math.sin(i * 0.6)] as Pt))} stroke={C.first} strokeWidth={5} fill="none" />
          <Lbl x={MX + 40} y={690} t="waves" c={C.key} s={T.floor} />
          <Lbl x={MX + 400} y={800 - 10} t="storms" c={C.key} s={T.floor} />
        </g>
      </Svg>
      <MapView id="s38" B={Bt} o={fin(f, SS(k, 3))} L={{ tc: 1, coast: 0.6 }} />
      <TeX s={EQ_S38} x={MX - 10} y={150} size={58} c={C.key} o={fin(f, 4)} />
    </Scene>
  );
};

// ================================================================ s39, s40, s41 Clausius–Clapeyron: the 7 % rule
const A39: Ax = { x: 250, y: 90, w: 680, h: 600, xr: [-10, 35], yr: [0, 60] };
/** `lab` (fix 3, review 3 S4) multiplies the axes and every text label, so s40 can fade them fully under its inset while the
 * curve stays dimly visible */
const ESChart: React.FC<{ upto?: number; dots?: number[]; tang?: number[]; o?: number; lab?: number }> = ({ upto = 1, dots = [0, 0, 0], tang = [0, 0, 0], o = 1, lab = 1 }) => {
  const P = axP(A39);
  return (
    <g opacity={o}>
      <ClipRect id="s39c" A={A39} pad={2} />
      <Axes A={A39} xt={[-10, 0, 10, 20, 30]} yt={[0, 20, 40, 60]} xl="temperature (°C)" yl="e_s (hPa)" o={lab} />
      <Curve A={A39} xs={CC.T} ys={CC.es} c={C.first} w={7} upto={upto} clipId="s39c" />
      {(CC.tang as number[][]).map(([t, e, s], i) => (
        <g key={i}>
          <path d={poly([P(t - 9, e - 9 * s), P(t + 9, e + 9 * s)])} stroke={C.gold} strokeWidth={5} opacity={tang[i]} clipPath="url(#s39c)" />
          <Dot p={P(t, e)} c={C.gold} r={11} o={Math.max(dots[i], tang[i])} />
          <Lbl x={P(t, e)[0] - 20} y={P(t, e)[1] - 40} t={`${Math.round(e)} hPa`} c={C.key} s={T.floor} a="end" o={dots[i] * (1 - tang[i]) * lab} />
          <Lbl x={P(t, e)[0] - 20} y={P(t, e)[1] - 40} t={`${(CC.rates[i] as number).toFixed(1)} %/°C`} c={C.gold} s={T.floor} a="end" o={tang[i] * lab} />
        </g>
      ))}
    </g>
  );
};
const S39: React.FC = () => {
  const f = useCurrentFrame(), k = K("s39_cc_curve");
  const tCurve = SS(k, 4);
  const ph1 = 1 - fin(f, tCurve, 18);
  const dots = Array.from({ length: 46 }, (_, i) => ({ x: 140 + random(`v${i}`) * 820, ph: random(`p${i}`), up: i % 2 === 0 }));
  const surf = 640;
  const sat = fin(f, SS(k, 3));
  const lab = [AT(k, 9, "about six"), AT(k, 9, "seventeen"), AT(k, 9, "forty two")].map((a) => fin(f, a));
  return (
    <Scene>
      <Svg o={ph1}>
        <rect x={80} y={surf} width={920} height={180} fill="#1f4f7a" />
        <path d={poly(Array.from({ length: 47 }, (_, i) => [80 + i * 20, surf + 6 * Math.sin(i * 0.9 + f * 0.1)] as Pt)) + ` L 1000 ${surf + 30} L 80 ${surf + 30} Z`} fill="#2a6a9e" />
        {dots.map((d, i) => {
          const per = 150, t = ((f + d.ph * per) % per) / per;
          const y = d.up ? surf - 20 - t * 440 : surf - 460 + t * 440;
          const show = d.up || sat > 0.01 || i % 4 === 1;
          return show ? <circle key={i} cx={d.x + 10 * Math.sin(t * 6 + i)} cy={y} r={7} fill={d.up ? "#9fd3ff" : "#5b9bd8"} opacity={0.8 * (d.up ? 1 : Math.max(sat, 0.4))} /> : null;
        })}
        <Arrow p={[200, 560]} q={[200, 420]} color={C.ink} w={6} head={24} o={fin(f, SS(k, 1))} />
        <Lbl x={150} y={surf + 80} t="escaping" c={C.key} s={T.floor} o={fin(f, SS(k, 1)) * clamp(3 * ph1 - 2, 0, 1)} />
        <Arrow p={[860, 420]} q={[860, 560]} color={C.ink} w={6} head={24} o={fin(f, AT(k, 1, "others return"))} />
        <Lbl x={930} y={surf + 80} t="returning" c={C.key} s={T.floor} a="end" o={fin(f, AT(k, 1, "others return")) * clamp(3 * ph1 - 2, 0, 1)} />
        <Lbl x={540} y={140} t="lake or sea (illustrative)" c={C.muted} s={T.floor} a="middle" />
      </Svg>
      <Svg o={fin(f, tCurve, 18)}><ESChart upto={prog(f, tCurve, tCurve + 60)} dots={lab} /></Svg>
      <Svg>
        <Keyword f={f} text="vapour pressure" at={[MX + 20, 120]} appear={SS(k, 2)} out={SS(k, 5)} />
        <Keyword f={f} text="water vapour: a gas" at={[MX + 20, 420]} appear={AT(k, 1, "as vapour")} out={SS(k, 4)} />
        <Keyword f={f} text="water vapour" at={[MX + 20, 520]} appear={4} out={AT(k, 1, "as vapour") - 10} />
        <Keyword f={f} text="saturated" at={[MX + 20, 210]} appear={AT(k, 3, "saturated")} out={SS(k, 5)} />
        <Keyword f={f} text="set by T alone" at={[MX + 20, 300]} appear={AT(k, 4, "only on the temperature")} out={SS(k, 5)} />
      </Svg>
      <TeX s={String.raw`e_s`} x={MX + 360} y={210} size={68} c={C.first} o={fin(f, AT(k, 3, "written e s")) * fout(f, SS(k, 5))} />
      <TeX s={EQ_S39} x={MX + 40} y={190} size={96} c={C.key} o={fin(f, SS(k, 5))} />
      <TeX s={String.raw`L\approx2.5\times10^{6}\ \mathrm{J/kg}`} x={MX} y={420} size={56} o={fin(f, SS(k, 6))} />
      <TeX s={String.raw`R_v=462\ \mathrm{J\,kg^{-1}\,K^{-1}}`} x={MX} y={530} size={52} o={fin(f, SS(k, 7))} />
      <TeX s={String.raw`T\ \text{in kelvin}`} x={MX} y={640} size={52} o={fin(f, SS(k, 8))} />
    </Scene>
  );
};
const S40: React.FC = () => {
  const f = useCurrentFrame(), k = K("s40_cc_linear");
  const tg = [AT(k, 3, "zero point"), AT(k, 4, "six point four"), AT(k, 4, "five point seven")].map((a) => fin(f, a));
  const [lhs40, rhs40] = cut2(EQ_S40, String.raw`=\frac{L}{R_vT^2}`);
  const Az: Ax = { x: 330, y: 130, w: 330, h: 260, xr: [0, 5], yr: [6, 8.4] };
  const Pz = axP(Az);
  const zm = CC.zoom;
  const tZ = SS(k, 6);
  const oz = fin(f, tZ);
  const gap = [...(zm.T as number[]).map((t, i) => Pz(t, zm.exact[i])).filter((_, i) => zm.T[i] <= 4.0001), ...(zm.T as number[]).map((t, i) => Pz(t, zm.line[i])).filter((_, i) => zm.T[i] <= 4.0001).reverse()];
  return (
    <Scene>
      <Svg><ESChart dots={[1, 1, 1]} tang={tg} o={1 - 0.85 * oz} lab={1 - oz} /></Svg>
      <Svg o={oz}>
        <rect x={Az.x - 90} y={Az.y - 60} width={Az.w + 130} height={Az.h + 160} fill={C.bg} opacity={0.92} />
        <ClipRect id="s40z" A={Az} pad={2} />
        <Axes A={Az} xt={[0, 1, 4]} yt={[6, 8]} xl="°C" yl="hPa" grid={false} />
        <path d={poly(gap) + "Z"} fill={C.neg} opacity={0.3 * fin(f, SS(k, 8))} clipPath="url(#s40z)" />
        <Curve A={Az} xs={zm.T} ys={zm.exact} c={C.first} w={5} clipId="s40z" />
        <Curve A={Az} xs={zm.T} ys={zm.line} c={C.gold} w={4} clipId="s40z" />
      </Svg>
      <TeX s={lhs40 + String.raw`=\frac{L}{R_vT^2}`} x={MX} y={150} size={68} o={fin(f, SS(k, 2))} />
      <TeX s={EQ_S39} x={MX} y={150} size={68} c={C.muted} o={fin(f, 4) * fout(f, SS(k, 2) - 10)} />
      <Svg><Keyword f={f} text="per extra degree" at={[MX + 20, 560]} appear={AT(k, 0, "each extra degree")} out={SS(k, 7) - 12} /></Svg>
      <TeX s={rhs40} x={MX + 40} y={320} size={56} c={C.key} o={fin(f, SS(k, 3))} />
      <Svg><Keyword f={f} text="the 7 % rule" at={[MX + 20, 430]} appear={SS(k, 5)} /></Svg>
      <TeX s={String.raw`+1\ ^{\circ}\mathrm C:\ \ \text{line}\ 7.3\,\%,\ \ \text{exact}\ 7.5\,\%`} x={MX} y={560} size={50} o={fin(f, SS(k, 7))} />
      <TeX s={String.raw`+4\ ^{\circ}\mathrm C:\ \ \text{line}\ 29\,\%,\ \ \text{exact}\ 33\,\%`} x={MX} y={660} size={50} c={C.neg} o={fin(f, SS(k, 8))} />
      <Svg><Lbl x={MX} y={770} t="the bend term is missing" c={C.key} s={T.floor} o={fin(f, SS(k, 9))} /></Svg>
    </Scene>
  );
};
const S41: React.FC = () => {
  const f = useCurrentFrame(), k = K("s41_cc_climate");
  const tw = CC.tcwv;
  const yrs = tw.yr as number[], ann = tw.ann as number[];
  const lo = Math.floor(Math.min(...ann) * 2) / 2, hi = Math.ceil(Math.max(...ann) * 2) / 2;
  const A: Ax = { x: 260, y: 90, w: 660, h: 300, xr: [1979, 2025], yr: [lo, hi] };
  const P = axP(A);
  const t5 = SS(k, 4), t6 = AT(k, 4, "rising");
  const ph1 = 1 - fin(f, t5);
  const n = Math.max(2, Math.round(yrs.length * prog(f, t5, t5 + 60)));
  const MB = { lat0: -70, lat1: 70, lon0: -180, lon1: 180, x: 80, y: 450, w: 920, h: 358 } as MapBox;
  const Pe = axP(A39);
  const e15 = CC.tang[1];
  return (
    <Scene>
      <Svg o={ph1}>
        <ESChart dots={[0, 1, 0]} />
        <rect x={Pe(15, 0)[0]} y={A39.y} width={Pe(16.26, 0)[0] - Pe(15, 0)[0]} height={A39.h} fill={C.gold} opacity={0.25 * fin(f, SS(k, 1))} />
        <Lbl x={Pe(16.3, 50)[0] + 10} y={Pe(16.3, 50)[1]} t="+1.26 °C" c={C.gold} s={T.floor} o={fin(f, SS(k, 1))} />
        <Lbl x={Pe(15, e15[1])[0] + 30} y={Pe(15, e15[1])[1] + 50} t="+9 %" c={C.first} s={T.key} o={fin(f, SS(k, 2))} />
      </Svg>
      <Svg o={fin(f, t5)}>
        <ClipRect id="s41c" A={A} pad={2} />
        <Axes A={A} xt={[1980, 2000, 2020]} yt={[lo, hi]} yl="water vapour in the air column (kg/m²)" yf={(v) => v.toFixed(1)} />
        <path d={poly(yrs.slice(0, n).map((y, i) => P(y, ann[i])))} stroke={C.first} strokeWidth={5} fill="none" />
        <path d={poly([P(yrs[0], tw.fit[0]), P(yrs[yrs.length - 1], tw.fit[yrs.length - 1])])} stroke={C.key} strokeWidth={3} strokeDasharray="12 9" opacity={fin(f, t5 + 60)} />
        <Dot p={P(yrs[yrs.length - 1], ann[ann.length - 1])} c={C.gold} r={11} o={n >= yrs.length ? 1 : 0} />
        <Lbl x={P(yrs[yrs.length - 1], ann[ann.length - 1])[0] + 20} y={P(yrs[yrs.length - 1], ann[ann.length - 1])[1] - 4} t={`${yrs[yrs.length - 1]}`} c={C.gold} s={T.floor} o={n >= yrs.length ? 1 : 0} />
      </Svg>
      <MapView id="s41m" B={MB} o={fin(f, t6)} L={{ coast: 0 }} children={(Pm) => (
        <g>
          <GeoImg P={Pm} href={IMGS.tcwv} box={BOX.tcwv} />
          <path d={linesPath(Pm, D.lines.globe_coast_110m)} stroke={C.key} strokeOpacity={0.7} strokeWidth={1.5} fill="none" />
        </g>
      )} />
      <Svg>
        {/* fix 1 (review S20): the warming's baseline is on screen (Forster et al. 2026, credited in the source line) */}
        <Keyword f={f} text="+1.26 °C" at={[MX + 20, 110]} appear={SS(k, 1)} />
        <Lbl x={MX + 20} y={170} t="2016–2025 vs 1850–1900" c={C.muted} s={T.floor} o={fin(f, AT(k, 1, "warmer than"))} />
        <Lbl x={MX + 20} y={340} t="measured near the ground:" c={C.key} s={T.floor} o={fin(f, SS(k, 3))} />
        <Lbl x={MX + 20} y={395} t="≈ 4–5 % per °C" c={C.key} s={T.floor} o={fin(f, AT(k, 3, "four to five"))} />
        <Lbl x={MX + 20} y={460} t="rising since 1979" c={C.first} s={T.floor} o={fin(f, AT(k, 4, "rising"))} />
        <ColourBar x={MX + 20} y={560} w={420} lut={LUT_B} lo={-4} hi={4} unit="%/decade" unitDx={34} o={fin(f, t6)} title="water-vapour trend, 1979–2025" ticks={[{ v: -4, t: "−4" }, { v: 0, t: "0" }, { v: 4, t: "+4" }]} />
        <g opacity={fin(f, SS(k, 6))}>
          {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={MX + 40 + i * 22} y1={690 + (i % 2) * 10} x2={MX + 30 + i * 22} y2={730 + (i % 2) * 10} stroke="#7cc4ff" strokeWidth={4} strokeLinecap="round" />)}
          <Lbl x={MX + 160} y={710} t="heaviest rain: ≈ 7 % per °C" c={C.key} s={T.floor} />
          <Lbl x={MX + 160} y={770} t="(projected)" c={C.muted} s={T.floor} />
        </g>
      </Svg>
      <CalcStack f={f} x={MX + 300} y={215} size={56} rows={[ROW(String.raw`\approx 9\,\%\ \ \text{more}\ e_s`, AT(k, 2, "about nine"), String.raw`1.26\times7\,\%`)]} />
    </Scene>
  );
};

// ================================================================ s42 Stefan–Boltzmann: Earth glowing in infrared (CERES), T_e and 4σT³
const SBChart: React.FC<{ A: Ax; tan?: number; marks?: number; o?: number }> = ({ A, tan = 1, marks = 0, o = 1 }) => {
  const P = axP(A);
  const Te = RD.Te, F0 = 240, lam = RD.lam;
  return (
    <g opacity={o}>
      <ClipRect id={`sb${A.x}`} A={A} pad={2} />
      <Axes A={A} xt={[A.xr[0], Math.round((A.xr[0] + A.xr[1]) / 2), A.xr[1]]} yt={[A.yr[0], A.yr[1]]} xl="T (K)" yl="W/m²" />
      <Curve A={A} xs={RD.T} ys={RD.F} c={C.second} w={6} clipId={`sb${A.x}`} />
      <path d={poly([P(Te - 30, F0 - 30 * lam), P(Te + 30, F0 + 30 * lam)])} stroke={C.gold} strokeWidth={5} opacity={tan} clipPath={`url(#sb${A.x})`} />
      <Dot p={P(Te, F0)} c={C.gold} r={10} o={tan} />
      <g opacity={marks}>
        <line x1={axX(A)(Te + 10)} y1={axY(A)(F0 + 10 * lam)} x2={axX(A)(Te + 10)} y2={axY(A)(F0 + RD.b10)} stroke={C.neg} strokeWidth={6} />
      </g>
    </g>
  );
};
const S42: React.FC = () => {
  const f = useCurrentFrame(), k = K("s42_planck");
  const cam = { lat: 12, lon: -20 + 0.05 * f };
  const parts: Part[] = [{ t: "F=" }, { t: String.raw`\sigma`, u: { w: String.raw`5.67\times10^{-8}`, c: C.gold } }, { t: "T^4" }];
  const [, d2] = EQ_S42.split(String.raw`,\qquad `);
  const [dA, dRest] = cut2(d2, String.raw`=\frac{4F}{T}`);
  const tD = SS(k, 6);
  // §5b (retrofit T-M2): the T–F graph and the readout sit beside the CERES globe, never on it
  const Ai: Ax = { x: 775, y: 290, w: 205, h: 300, xr: [230, 280], yr: [150, 350] };
  // fix 2 (review 2 Should 8, §5b T-S1): the CERES globe is ≈ 760 px across (dist 4.62 in a 1080-px view) on the left until
  // "Now let's linearise" (S7), then eases back to its old ≈ 540 px place so the T–F graph fits beside it; its colour bar and the
  // 240 W/m² readout sit in the text column while it is large, and beside / below it after
  const sh = prog(f, tD, tD + 40);
  const gpp: Pt = [mix(500, 380, sh), mix(440, 360, sh)];
  const gcam: GlobeCam = { lat: cam.lat, lon: cam.lon, dist: mix(4.62, 6.44, sh), pp: gpp };
  const aRd = AT(k, 3, "two hundred and forty"), aAv = AT(k, 3, "on average");
  const gR = silhouetteR(gcam.dist, 1080, 35);
  return (
    <Scene>
      <GlobeFB cam={gcam} field={IMGS.olr} fieldO={1} coast={0.5} />
      <Svg>
        <g data-k6-mask={JSON.stringify({ name: "s42 globe", k: "circle", c: gcam.pp, r: gR })} />
        <ColourBar x={130} y={742} w={380} lut={LUT_T} lo={100} hi={320} unit="W/m²" title="heat sent to space (infrared)" ticks={[{ v: 150, t: "150" }, { v: 250, t: "250" }]} o={fin(f, tD + 30, 14)} />
        <ColourBar x={MX + 20} y={720} w={380} lut={LUT_T} lo={100} hi={320} unit="W/m²" title="heat sent to space (infrared)" ticks={[{ v: 150, t: "150" }, { v: 250, t: "250" }]} o={fout(f, tD, 12)} />
        {/* fix 3 (review 3 S10): no link — a link to one spot on the limb implied a local value; this is the global mean */}
        <Callout f={f} lines="≈ 240 W/m² global average" at={[MX + 20, 545]} appear={aRd} out={tD} target={null} s={T.key} />
        <Lbl x={700} y={90} t="≈ 240 W/m²" c={C.key} s={T.key} o={fin(f, tD + 30, 14) * fin(f, aRd)} />
        <Lbl x={700} y={150} t="global average" c={C.muted} s={T.floor} o={fin(f, tD + 30, 14) * fin(f, aAv)} />
        <g opacity={fin(f, tD + 30, 14)}>
          <SBChart A={Ai} tan={fin(f, AT(k, 7, "four sigma"))} />
        </g>
        <Keyword f={f} text="emission temperature" at={[MX + 20, 615]} appear={SS(k, 5)} out={AT(k, 7, "four sigma") - 12} />
        <Keyword f={f} text="heat sent to space" at={[MX + 20, 400]} appear={AT(k, 0, "the heat that Earth")} out={SS(k, 4) - 12} />
      </Svg>
      <Layered parts={parts} x={MX} y={140} size={84} o={fin(f, SS(k, 1))} layers={[{ t: "all", o: 1 }, { t: [], u: [1], o: fin(f, SS(k, 2)) }]} />
      <Svg><Lbl x={MX + 40} y={268} t="σ in W m⁻² K⁻⁴" c={C.gold} s={T.floor} o={fin(f, SS(k, 2) + 10)} /></Svg>
      <CalcStack f={f} x={MX + 90} y={330} size={54} rows={[
        ROW(String.raw`=(240/\sigma)^{1/4}\approx255\ \mathrm K`, AT(k, 4, "gives T equals"), "T"),
        ROW(String.raw`\approx-18\ ^{\circ}\mathrm C`, AT(k, 4, "minus eighteen"), undefined, { cont: true }),
      ]} />
      <TeX s={dA} x={MX} y={610} size={58} o={fin(f, AT(k, 7, "four sigma"))} />
      <TeX s={String.raw`=\frac{4F}{T}`} x={MX + 330} y={610} size={58} o={fin(f, SS(k, 8))} />
      <TeX s={dRest} x={MX + 60} y={732} size={52} c={C.key} o={fin(f, SS(k, 9))} />
    </Scene>
  );
};

// ================================================================ s43 the Planck response: ≈ 1 °C for doubled CO₂; line vs exact
const S43: React.FC = () => {
  const f = useCurrentFrame(), k = K("s43_planck_meaning");
  const tW = SS(k, 2), tC = SS(k, 5);
  const dT = mix(0, RD.dT_planck, prog(f, tW, tW + 90));
  const X0 = 520, sc = 90;
  const ph2 = fin(f, tC, 18);
  const A: Ax = { x: 250, y: 100, w: 680, h: 600, xr: [250, 270], yr: [220, 320] };
  const P = axP(A);
  void EQ_S43;
  return (
    <Scene>
      <Svg o={clamp(1 - 2 * ph2, 0, 1)}>
        <line x1={X0} y1={150} x2={X0} y2={560} stroke={C.ink} strokeWidth={5} opacity={fin(f, SS(k, 1))} />
        <rect x={X0} y={200} width={3.93 * sc} height={56} fill={C.gold} opacity={fin(f, SS(k, 1))} />
        <Lbl x={X0 + 3.93 * sc + 16} y={228} t="+3.9" c={C.gold} s={T.key} o={fin(f, SS(k, 1)) * fout(f, LEN(k) - 10, 8)} />
        <Lbl x={X0 - 20} y={228} t="CO₂ doubled: heating" c={C.key} s={T.floor} a="end" o={fin(f, SS(k, 1))} />
        <rect x={X0 - RD.lam * dT * sc} y={300} width={RD.lam * dT * sc} height={56} fill={C.first} opacity={0.85 * fin(f, tW)} />
        <Lbl x={X0 + 20} y={328} t="−3.8 per °C × warming" c={C.first} s={T.floor} o={fin(f, tW) * fout(f, LEN(k) - 10, 8)} />
        {/* fix 1 (review S15): the thermostat picture is there from S1 (warm up → more heat to space), not an empty half */}
        {/* fix 3 (review 3 S3): 50 px lower, so its top stays below the dashed IPCC bar (y 420-464) */}
        <Thermo x={200} y={750} h={260} level={0.15 + 0.6 * (dT / 1.3) + 0.12 * prog(f, AT(k, 0, "warm up"), AT(k, 0, "warm up") + 30) * fout(f, tW - 10, 20)} o={fin(f, 6)} />
        <g opacity={fin(f, AT(k, 0, "lose heat")) * fout(f, SS(k, 1) - 6)}>
          {[-0.5, 0, 0.5].map((a, i) => <Arrow key={i} p={[230 + 60 * Math.sin(a), 470 - 60 * Math.cos(a)]} q={[230 + 190 * Math.sin(a), 470 - 190 * Math.cos(a)]} color={C.second} w={7} head={24} />)}
          <Lbl x={330} y={330} t="warmer: more heat to space" c={C.second} s={T.floor} />
        </g>
        <Lbl x={250} y={500} t={`+${dT.toFixed(2)} °C`} c={C.key} s={T.key} o={fin(f, tW)} />
        <rect x={X0 - 3.22 * RD.dT_ar6 * sc} y={420} width={3.22 * RD.dT_ar6 * sc} height={44} fill={C.first} opacity={0.4 * fin(f, SS(k, 3))} stroke={C.first} strokeWidth={3} strokeDasharray="10 7" />
        {/* fix 3 (review 3 S3): say what 3.2 is (the IPCC Planck response, W/m² per °C; spoken in S4) */}
        <Lbl x={X0 + 20} y={442} t="IPCC 3.2 per °C: ≈ 1.2 °C" c={C.first} s={T.floor} o={fin(f, SS(k, 3)) * fout(f, LEN(k) - 10, 8)} />
        <Droplet x={340} y={640} s={1.3} o={fin(f, SS(k, 4))} />
        <Lbl x={400} y={640} t="more water vapour" c={C.key} s={T.floor} o={fin(f, SS(k, 4))} />
      </Svg>
      <Svg o={clamp(2 * ph2 - 1, 0, 1)}>
        <SBChart A={A} tan={1} marks={fin(f, SS(k, 7))} />
        <Dot p={P(RD.Te + 1, 240 + RD.b1)} c={C.second} r={9} o={fin(f, SS(k, 6))} />
        <Lbl x={P(RD.Te + 1, 240 + RD.b1)[0] - 20} y={P(RD.Te + 1, 240 + RD.b1)[1] - 40} t="+1 °C" c={C.key} s={T.floor} a="end" o={fin(f, SS(k, 6))} />
        <Lbl x={P(RD.Te + 10, 240 + RD.b10)[0] + 20} y={P(RD.Te + 10, 240 + RD.b10)[1]} t="+10 °C" c={C.key} s={T.floor} o={fin(f, SS(k, 7))} />
      </Svg>
      <Svg>
        <Keyword f={f} text="Planck response" at={[MX + 20, 120]} appear={AT(k, 0, "Planck response")} />
        <Lbl x={MX + 20} y={190} t="the planet's thermostat" c={C.local} s={T.floor} o={fin(f, AT(k, 0, "thermostat"))} />
        <Keyword f={f} text="feedbacks" at={[MX + 20, 545]} appear={AT(k, 4, "feedbacks")} />
      </Svg>
      <TeX s={EQ_S43} x={MX} y={300} size={64} c={C.key} o={fin(f, AT(k, 2, "divided by"))} />   {/* fix 1 (S15): 1.04 °C, as said */}
      <TeX s={String.raw`\frac{3.9}{3.2}\approx1.2\ ^{\circ}\mathrm C`} x={MX} y={435} size={52} o={fin(f, SS(k, 3))} />
      <TeX s={String.raw`+1\ ^{\circ}\mathrm C:\ \ 3.79\ \text{exact},\ 3.76\ \text{line}`} x={MX} y={620} size={50} o={fin(f, SS(k, 6))} />
      <TeX s={String.raw`+10\ ^{\circ}\mathrm C:\ \ 39.9\ \text{exact},\ 37.6\ \text{line}`} x={MX} y={720} size={50} o={fin(f, SS(k, 7))} />
    </Scene>
  );
};

// ================================================================ s44, s45 finite differences from Taylor (sin x, illustrative step)
const A44: Ax = { x: 230, y: 100, w: 700, h: 560, xr: [0, 2.6], yr: [0, 1.25] };
const FDPic: React.FC<{ h: number; fwd: number; ctr: number; f: number }> = ({ h, fwd, ctr }) => {
  const P = axP(A44);
  const x0 = 0.35, fx = Math.sin, c0 = Math.cos(x0);
  const xs = Array.from({ length: 105 }, (_, i) => i * 0.025);
  const sF = (fx(x0 + h) - fx(x0)) / h, sC = (fx(x0 + h) - fx(x0 - h)) / (2 * h);
  const L = (s: number) => poly([P(x0 - 0.35, fx(x0) - 0.35 * s), P(x0 + 0.95, fx(x0) + 0.95 * s)]);
  const xb = x0 + 0.85;
  return (
    <g>
      <ClipRect id="fdc" A={A44} pad={2} />
      <Axes A={A44} xt={[]} yt={[]} grid={false} xl="x" />
      <Curve A={A44} xs={xs} ys={xs.map(fx)} c={C.local} w={6} clipId="fdc" />
      {[-2, -1, 0, 1, 2, 3].map((i) => <Dot key={i} p={P(x0 + i * h, fx(x0 + i * h))} c={C.ink} r={9} o={x0 + i * h >= 0 && x0 + i * h <= 2.6 ? 1 : 0} />)}
      <path d={L(c0)} stroke={C.gold} strokeWidth={5} clipPath="url(#fdc)" />
      <path d={L(sF)} stroke={C.first} strokeWidth={5} opacity={fwd} clipPath="url(#fdc)" />
      <path d={L(sC)} stroke={C.second} strokeWidth={5} opacity={ctr} clipPath="url(#fdc)" />
      <Bracket p={P(xb, fx(x0) + 0.85 * sF)} q={P(xb, fx(x0) + 0.85 * c0)} off={-20} c={C.first} o={fwd} />
      <Lbl x={P(xb, 0)[0] + 40} y={P(xb, fx(x0) + 0.85 * (sF + c0) / 2)[1]} t="error" c={C.first} s={T.floor} o={fwd} />
      <Bracket p={P(xb, fx(x0) + 0.85 * sC)} q={P(xb, fx(x0) + 0.85 * c0)} off={20} c={C.second} o={ctr} />
      <Bracket p={P(x0, 0.08)} q={P(x0 + h, 0.08)} off={0} c={C.ink} />
      <Lbl x={P(x0 + h / 2, 0.08)[0]} y={P(x0 + h / 2, 0.08)[1] + 40} t="h" c={C.ink} s={T.key} a="middle" />
    </g>
  );
};
const S44: React.FC = () => {
  const f = useCurrentFrame(), k = K("s44_fd_forward");
  const h = mix(0.8, 0.4, prog(f, SS(k, 9), SS(k, 9) + 30));
  const parts: Part[] = [{ t: String.raw`\frac{f(x+h)-f}{h}=f'+` }, { t: String.raw`\frac{h}{2}f''`, u: { w: String.raw`\text{error}`, c: C.gold } }, { t: String.raw`+\cdots` }];
  return (
    <Scene>
      <Svg><FDPic h={h} fwd={fin(f, SS(k, 2))} ctr={0} f={f} />
        <Keyword f={f} text="grid points" at={[300, 760]} appear={SS(k, 1)} />
      </Svg>
      {/* fix 1 (review S9): \dfrac, so the digits of h²/2 are full size (48 px), not ~25 px */}
      <CalcStack f={f} x={MX + 240} y={90} size={46} maxLines={3} rows={[
        ROW(String.raw`=f+h\,f'+\dfrac{h^2}{2}f''+\cdots`, SS(k, 5), "f(x+h)", { h: 140 }),
        ROW(String.raw`=h\,f'+\dfrac{h^2}{2}f''+\cdots`, AT(k, 6, "subtract f"), "f(x+h)-f", { h: 140 }),
        ROW(String.raw`=f'+\dfrac{h}{2}f''+\cdots`, AT(k, 6, "divide by h"), String.raw`\dfrac{f(x+h)-f}{h}`, { c: C.key, h: 150 }),
      ]} />
      <Layered parts={parts} x={MX} y={625} size={64} o={0} layers={[{ t: "all", o: 1 }]} />
      <TeX s={String.raw`\text{error}\approx\dfrac{h}{2}\,f''`} x={MX} y={640} size={64} c={C.gold} o={fin(f, SS(k, 8))} />
      <TeX s={EQ_S44} x={0} y={0} size={56} o={0} />
      <TeX s={String.raw`\frac{f(x+h)-f(x)}{h}`} x={MX} y={650} size={64} c={C.first} o={fin(f, AT(k, 2, "forward difference")) * fout(f, SS(k, 7) - 10)} />
      <Svg><Keyword f={f} text="only grid points" at={[MX + 20, 130]} appear={AT(k, 0, "weather model")} out={SS(k, 5) - 12} /></Svg>
      <Svg>
        <Lbl x={MX} y={752} t="half the step, half the error" c={C.key} s={T.floor} o={fin(f, SS(k, 9))} />
        <Keyword f={f} text="first-order accurate" at={[MX + 20, 812]} appear={SS(k, 10)} />
      </Svg>
    </Scene>
  );
};
const S45: React.FC = () => {
  const f = useCurrentFrame(), k = K("s45_fd_centred");
  const h = mix(0.8, 0.4, prog(f, SS(k, 6), SS(k, 6) + 30));
  // fix 1 (review S9): \dfrac terms (full-size digits); on S9 the three Taylor lines give way to the sine check, written as
  // two 54-px lines "forward error −0.043" / "centred error −0.0009" (fd.ef −0.04294, fd.ec −0.0009001)
  const tChk = SS(k, 8);
  const top = fin(f, SS(k, 2)) * fout(f, tChk - 6);
  const df = (s: string) => s.replace(/\\frac\{h\^2\}\{6\}/g, String.raw`\dfrac{h^2}{6}`);
  return (
    <Scene>
      <Svg><FDPic h={h} fwd={0.35} ctr={fin(f, 6)} f={f} /></Svg>
      {/* fix 3 (review 3 S11): the three Taylor lines move up 15 px, so h³/3 clears the fraction of the centred difference */}
      <TeX s={String.raw`\text{ahead}:\ f+hf'+\dfrac{h^2}{2}f''+\dfrac{h^3}{6}f'''`} x={MX} y={95} size={46} o={top} />
      <TeX s={String.raw`\text{behind}:\ f\textcolor{#d9667f}{-hf'}+\dfrac{h^2}{2}f''\textcolor{#d9667f}{-\dfrac{h^3}{6}f'''}`} x={MX} y={210} size={46} o={fin(f, SS(k, 3)) * fout(f, tChk - 6)} />
      <TeX s={String.raw`\text{difference}:\ 2hf'+\dfrac{h^3}{3}f'''`} x={MX} y={325} size={46} o={fin(f, SS(k, 4)) * fout(f, tChk - 6)} />
      <TeX s={String.raw`\sin x,\ \ x=1,\ \ h=0.1`} x={MX} y={140} size={54} c={C.key} o={fin(f, tChk)} />
      <Svg>
        <Lbl x={MX} y={235} t="forward error −0.043" c={C.first} s={T.key} o={fin(f, AT(k, 9, "forward difference is off"))} />
        <Lbl x={MX} y={315} t="centred error −0.0009" c={C.second} s={T.key} o={fin(f, AT(k, 9, "the centred one"))} />
      </Svg>
      <TeX s={cut2(EQ_S45, "=")[0]} x={MX} y={455} size={50} c={C.key} o={fin(f, AT(k, 0, "one step ahead"))} />
      <TeX s={String.raw`\frac{f(x+h)-f}{h}=f'+\frac{h}{2}f''+\cdots`} x={MX} y={650} size={54} c={C.muted} o={fin(f, 4) * fout(f, SS(k, 2) - 10)} />
      <TeX s={"=" + df(cut2(EQ_S45, "=")[1])} x={MX + 60} y={565} size={50} c={C.key} o={fin(f, SS(k, 5))} />
      <Svg>
        <Lbl x={MX} y={665} t="half the step, a quarter of the error" c={C.key} s={T.floor} o={fin(f, SS(k, 6))} />
        <Keyword f={f} text="second-order accurate" at={[MX + 20, 740]} appear={SS(k, 7)} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s46 the real map at several grid spacings
const B46 = boxAt(48.5, -4.4, 3.0, 80, 40, 920, 640);
const S46: React.FC = () => {
  const f = useCurrentFrame(), k = K("s46_fd_grid");
  const steps = [0, AT(k, 3, "thirty seven"), AT(k, 3, "seventy four"), AT(k, 4, "one hundred and forty seven"), AT(k, 4, "two hundred and twenty one")];
  const ns = [1, 2, 4, 8, 12];
  const si = steps.filter((a) => f >= a).length - 1;
  const n = ns[si];
  const tH = SS(k, 7);
  const ph2 = fin(f, tH, 18);
  const P = mapP(B46);
  const lons: number[] = [];
  for (let j = -60; j <= 60; j++) { const lo = BGP[1] + j * 0.25 * n; if (lo > B46.lon0 && lo < B46.lon1) lons.push(lo); }
  const rows: [string, string, number, string][] = [
    ["18 km", "forward −3.32", AT(k, 1, "forward difference"), C.first], ["", "backward −3.09", AT(k, 1, "backward"), C.first], ["", "centred −3.20", AT(k, 1, "centred one"), C.key],
    ["37 km", "centred −3.17", steps[1], C.key], ["74 km", "−3.14", steps[2], C.key], ["147 km", "−2.24", steps[3], C.neg], ["221 km", "−0.98", steps[4], C.neg]];
  const hist: [string, number, number][] = [["1950: 736 km", 736, SS(k, 7)], ["early climate models: a few hundred km", 300, SS(k, 8)], ["today: about 9 km", 9, SS(k, 9)]];
  return (
    <Scene>
      <MapView id="s46" B={B46} o={1 - ph2} L={{ t850: [{ h: 18, o: si === 0 ? 1 : 0 }], coarse: si > 0 ? [{ n, o: 1 }] : [], coast: 0.9 }} children={() => (
        <g>
          {lons.map((lo) => <Dot key={lo} p={P(BGP[0], lo)} c={Math.abs(lo - BGP[1]) < 1e-6 ? C.gold : Math.abs(Math.abs(lo - BGP[1]) - 0.25 * n) < 1e-6 ? C.first : C.ink} r={Math.abs(lo - BGP[1]) < 0.25 * n + 1e-6 ? 12 : 7} />)}
        </g>
      )} />
      <Svg o={1 - ph2}><T850Bar x={130} y={742} />
        {(() => {
          // fix 2 (review 2 Should 6, §5b): the keyword sits below the map with a gold link to the front (steepest step at 48.5° N)
          const cl = E8.cut.lon as number[], ct = E8.cut.T as number[];
          let jx = 1, gmax = 0;
          for (let i = 1; i < cl.length; i++) { const gg = Math.abs(ct[i] - ct[i - 1]); if (gg > gmax && cl[i] > -9 && cl[i] < 0) { gmax = gg; jx = i; } }
          const pf = P(BGP[0], (cl[jx] + cl[jx - 1]) / 2);
          return <Callout f={f} lines={["steps over", "the front"]} at={[830, 745]} appear={SS(k, 5)} target={[pf[0], pf[1] + 22]} s={T.floor} bend={30} />;
        })()}
      </Svg>
      <Svg o={ph2}>
        {hist.map(([t, km, at], i) => {
          const sp = Math.max(3, km / 4.6);
          return (
            <g key={t} opacity={fin(f, at)}>
              <Lbl x={100} y={140 + i * 230} t={t} c={C.key} s={T.floor} />
              {Array.from({ length: Math.min(300, Math.floor(860 / sp) + 1) }, (_, q) => <circle key={q} cx={110 + q * sp} cy={210 + i * 230} r={Math.min(6, sp / 3)} fill={C.ink} />)}
            </g>
          );
        })}
      </Svg>
      <TeX s={String.raw`\frac{\partial T}{\partial x}\ \ (^{\circ}\mathrm C\ \text{per}\ 100\ \mathrm{km})`} x={MX} y={110} size={50} o={fin(f, SS(k, 1))} />
      <Svg>
        {rows.map(([a, b, at, c], i) => (
          <g key={i} opacity={fin(f, at)}>
            <Lbl x={MX} y={200 + i * 62} t={a} c={C.muted} s={T.floor} />
            <Lbl x={MX + 200} y={200 + i * 62} t={b} c={c} s={T.floor} />
          </g>
        ))}
        <Lbl x={MX} y={670} t="3 times too gentle" c={C.neg} s={T.floor} o={fin(f, AT(k, 5, "three times"))} />
        <Keyword f={f} text="fine grids" at={[MX + 20, 760]} appear={SS(k, 6)} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s47 recap: one beat per sentence
const S47: React.FC = () => {
  const f = useCurrentFrame(), k = K("s47_recap");
  const n = sc[k].sentences.length;
  const b = (j: number) => fin(f, SS(k, j)) * (j < n - 1 ? fout(f, SS(k, j + 1)) : 1);
  const A: Ax = { x: 250, y: 120, w: 660, h: 560, xr: [0, 5], yr: [0, 25] };
  const P = axP(A);
  const xs = Array.from({ length: 51 }, (_, i) => i * 0.1);
  const Ap: Ax = { x: 250, y: 100, w: 660, h: 600, xr: [-20, 25], yr: [0, 7] };
  const Pp = axP(Ap);
  const B = boxAt(48.4, -4.3, 2.4, 80, 40, 920, 760);
  const kw: [string, number][] = [["slope of the tangent", 0], ["one variable at a time", 1], ["−3.2 per 100 km · +2.9 °C/h", 2], ["the traveller's rate", 3],
    ["plane east: −8.6 °C/h", 4], ["balloon: −1.6 °C/min", 5], ["order does not matter", 6], ["p ✓   heat ✗   heat/T ✓", 7], ["value, slope, bend, …", 8],
    ["7 %/°C  ·  3.8 W/m² per °C", 9], ["accuracy of model derivatives", 10]];
  return (
    <Scene>
      <Svg o={b(0)}>
        <ClipRect id="r0" A={A} />
        <Axes A={A} xt={[]} yt={[]} grid={false} />
        <Curve A={A} xs={xs} ys={xs.map((x) => x * x)} c={C.local} w={6} clipId="r0" />
        <path d={poly([P(1.5, 0), P(5, 21)])} stroke={C.gold} strokeWidth={5} clipPath="url(#r0)" /><Dot p={P(3, 9)} c={C.gold} r={12} />
      </Svg>
      <Landscape box={{ x: 80, y: 40, w: 920, h: 780 }} o={b(1)} over={(pr) => <path d={poly(landCutPts(pr, 1))} stroke={C.first} strokeWidth={7} fill="none" />}>
        <Quad3D pts={[[-3.4, 0, 0], [3.4, 0, 0], [3.4, 0, 2.3], [-3.4, 0, 2.3]]} color={C.local} o={0.32} />
      </Landscape>
      <MapView id="r2" B={B} o={Math.max(b(2), b(4))} L={{ t850: [{ h: 18, o: 1 }], coast: 0.85 }} children={(Pm) => {
        const pb = Pm(BREST[0], BREST[1]);
        return (
          <g>
            <g opacity={b(2)}><Arrow p={pb} q={[pb[0] + 180, pb[1]]} color={C.neg} w={8} head={28} />
              <g transform={`translate(${pb[0]} ${pb[1]})`}><PoleThermometer x={0} y={0} /></g></g>
            <g opacity={b(4)}><Plane p={[pb[0] + 200, pb[1] - 60]} s={1.4} /><Arrow p={[pb[0] + 250, pb[1] - 60]} q={[pb[0] + 380, pb[1] - 60]} color={C.first} w={8} head={28} /></g>
          </g>
        );
      }} />
      <Svg o={b(3)}>
        <path d="M 200 560 L 760 560 L 900 360 L 340 360 Z" fill="rgba(42,161,152,0.16)" stroke={C.first} strokeWidth={4} />
        <Arrow p={[420, 500]} q={[620, 500]} color={C.second} w={9} head={30} /><Arrow p={[620, 500]} q={[690, 400]} color={C.second} w={9} head={30} />
      </Svg>
      <Svg o={b(5)}>
        <ClipRect id="r5" A={Ap} />
        <Axes A={Ap} xt={[-20, 0, 20]} yt={[0, 2, 4, 6]} grid={false} />
        <ProfileLine A={Ap} zTop={7} clip="r5" />
        <Sonde p={Pp(Tat(4), 4)} s={1.2} />
      </Svg>
      <Svg o={b(6)}>
        <rect x={300} y={240} width={500} height={360} fill="rgba(216,178,58,0.07)" stroke={C.gold} strokeWidth={5} />
        {[[800, 240, "+", C.first], [300, 240, "−", C.neg], [800, 600, "−", C.neg], [300, 600, "+", C.first]].map(([x, y, s, c], i) => <g key={i}><Dot p={[x as number, y as number]} c={c as string} r={18} />
          <Lbl x={(x as number) + ((x as number) > 500 ? 30 : -30)} y={(y as number) + ((y as number) < 400 ? -36 : 40)} t={s as string} c={c as string} s={T.key} a={(x as number) > 500 ? "start" : "end"} /></g>)}
      </Svg>
      <Svg o={b(7)}>
        <Lbl x={200} y={300} t="p = ρRT" c={C.key} s={T.calc} /><Check x={640} y={300} />
        <Lbl x={200} y={440} t="heat" c={C.key} s={T.calc} /><Cross x={640} y={440} />
        <Lbl x={200} y={580} t="heat / T" c={C.key} s={T.calc} /><Check x={640} y={580} />
      </Svg>
      <Svg o={b(8)}>
        <ClipRect id="r8" A={{ ...A, xr: [-0.2, 1.25], yr: [0, 3.6] }} />
        {D.taylor.fam.map((ys: number[], o: number) => <Curve key={o} A={{ ...A, xr: [-0.2, 1.25], yr: [0, 3.6] }} xs={D.taylor.h} ys={ys} c={C.first} w={3 + o} o={0.35 + 0.15 * o} clipId="r8" />)}
        <Curve A={{ ...A, xr: [-0.2, 1.25], yr: [0, 3.6] }} xs={D.taylor.h} ys={D.taylor.exp} c={C.local} w={6} clipId="r8" />
      </Svg>
      <Svg o={b(9)}><ESChart dots={[1, 0, 0]} tang={[1, 0, 0]} /></Svg>
      <Svg o={b(10)}><FDPic h={0.6} fwd={0.3} ctr={1} f={f} /></Svg>
      <Svg>
        {kw.map(([t, j]) => <Lbl key={j} x={1085} y={440} t={t} c={C.key} s={T.key} o={b(j)} />)}
        {/* fix 3 (review 3 Must 9): colour bars for the recap's coloured data beats (S2 landscape, S3 and S5 ERA5 map) */}
        <LandBar x={1100} y={742} o={b(1)} />
        <T850Bar x={1100} y={742} wrap o={Math.max(b(2), b(4))} />
      </Svg>
      <TeX s={String.raw`\frac{dT}{dt}=\frac{\partial T}{\partial t}+\frac{dX_j}{dt}\frac{\partial T}{\partial x_j}`} x={MX + 20} y={600} size={60} o={b(3)} />
      <TeX s={String.raw`\frac{\partial M}{\partial y}=\frac{\partial N}{\partial x}`} x={MX + 20} y={600} size={64} c={C.gold} o={b(6)} />
    </Scene>
  );
};

// ================================================================ s48 end card (maths ending, HOUSE_STYLE §3)
const S48: React.FC = () => {
  const f = useCurrentFrame(), k = K("s48_end");
  const t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const thumb = (x: number, i: number) => (
    <g key={i} opacity={0.75}>
      <rect x={x - 150} y={70} width={300} height={170} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
      {i === 0 ? <><Arrow p={[x - 90, 200]} q={[x + 80, 160]} color={C.first} w={7} head={24} /><Arrow p={[x - 90, 200]} q={[x - 10, 100]} color={C.second} w={7} head={24} /><line x1={x - 90} y1={200} x2={x + 26} y2={172} stroke={C.second} strokeWidth={14} opacity={0.6} /></> : null}
      {i === 1 ? <>{[[1, 0], [0, -1], [-0.6, 0.5]].map(([a, bb], q) => <Arrow key={q} p={[x - 20, 170]} q={[x - 20 + a * 100, 170 + bb * 70]} color={C.second} w={6} head={20} />)}</> : null}
      {i === 2 ? <><path d={`M ${x - 110} 220 Q ${x - 40} 210 ${x} 160 T ${x + 110} 90`} stroke={C.local} strokeWidth={6} fill="none" /><line x1={x - 90} y1={225} x2={x + 90} y2={95} stroke={C.gold} strokeWidth={5} /></> : null}
      {i === 3 ? <>{[0, 1, 2, 3, 4].map((q) => <Arrow key={q} p={[x - 110 + q * 50, 200]} q={[x - 80 + q * 50, 120 + q * 6]} color={C.second} w={5} head={18} />)}</> : null}
    </g>
  );
  // fix 1 (review S19): every related movie the narration names, in an even 3 × 5 grid of equal weight (waves, stability,
  // PDEs and numerical methods added); maths movies first, then the weather and climate ones
  const rel = ["weather basics", "vectors and index notation", "dot product", "gradient", "material derivative", "coordinates",
    "pressure coordinates", "ODEs", "PDEs, numerical methods", "thermodynamics", "water in the air", "climate machine", "climate change",
    "waves", "stability"];
  const COLX = [110, 700, 1290], ROWY = (r: number) => 624 + r * 48;
  rel.forEach((t, i) => { if (COLX[Math.floor(i / 5)] + textW(t, T.floor) > (COLX[Math.floor(i / 5) + 1] ?? 1840) - 10) throw new Error(`end card: "${t}" too wide`); });
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, 6)}>{[420, 760, 1100, 1440].map((x, i) => thumb(x, i))}</g>
        <Lbl x={960} y={315} t="a series of maths tutorials" c={C.key} s={T.calc} a="middle" o={fin(f, 10)} />
        <Lbl x={960} y={395} t="atmospheric science · meteorology · fluid dynamics" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "atmospheric science"))} />
        {/* fix 3 (review 3 S12): the single notebook a little smaller and 8 px higher (bottom y 518), ≥ 15 px above the stack */}
        <g opacity={fin(f, t2)}><Notebook x={300} y={482} s={0.4} /><Lbl x={370} y={490} t="derivatives and Taylor series notebook" c={C.ink} s={T.key} /></g>
        <g opacity={fin(f, tOther)}>
          {[0, 1, 2].map((i) => <Notebook key={i} x={260 + i * 30} y={575 - i * 10} s={0.24} c={[C.second, "#8e6fd8", C.muted][i]} o={0.9} />)}
          <Lbl x={370} y={565} t="notebooks for the other maths concepts" c={C.key} s={T.key} />
        </g>
        <g opacity={fin(f, tOther + 20) * 0.8}>
          {rel.map((t, i) => <Lbl key={t} x={COLX[Math.floor(i / 5)]} y={ROWY(i % 5)} t={t} c={C.muted} s={T.floor} b={false} />)}
        </g>
      </Svg>
    </Scene>
  );
};

// ---------------------------------------------------------------- data-source lines (HOUSE_STYLE §5): dataset · time · place; not spoken
// fix 1 (review S7): a source line is shown only while its data element is on screen (`on`: scene-relative windows), and
// scenes that change data from beat to beat get one line per beat (s37, s41, s47)
const E5 = "Data: ERA5 (Copernicus C3S) 850 hPa";
const IG = "Data: IGRA2 radiosonde (NOAA NCEI) · Trappes, near Paris · 30 Sep 2026, 12 UTC";
type Src = { t: string; x?: number; w?: number; on?: (k: number) => [number, number][] };
const ALWAYS = 1e9;
const SRC: Record<string, Src[]> = {
  s00_title: [{ t: "Data: IGRA2 radiosonde (NOAA NCEI) · Trappes · 30 Sep 2026, 12 UTC", x: 1290, w: 560, on: (k) => [[0, AT(k, 0, "water vapour")]] }],
  s01_hook: [{ t: `${E5} · 1 Nov 2023, 18 UTC · Brittany · IGRA2 (NOAA NCEI) · Trappes, 30 Sep 2026, 12 UTC` }],
  s02_average_rate: [{ t: "Data: Brest-Guipavas SYNOP (NOAA ISD) · 1–2 Nov 2023" }],
  s04_fields: [{ t: `${E5} temperature · 1 Nov 2023, 12–18 UTC · western France` }],
  s05_partial_idea: [{ t: `${E5} temperature · 1 Nov 2023, 18 UTC · Brittany` }],
  s07_partial_real: [{ t: `${E5} temperature · 1 Nov 2023, 18 UTC · Brest` }],
  s08_partial_time: [{ t: "Data: ERA5 (Copernicus C3S) 850 hPa, 17–19 UTC; sea-level pressure, 18 UTC · Brest SYNOP (NOAA ISD) · 1 Nov 2023" }],
  s10_mixed_partials: [{ t: `${E5} temperature · 1 Nov 2023, 17 and 19 UTC · Brest` }],
  s11_total_differential: [{ t: `${E5} temperature · 1 Nov 2023, 18 and 19 UTC · Brittany` }],
  s12_total_example: [{ t: `${E5} temperature · 1 Nov 2023, 18 UTC · Brest` }],
  s13_chain_rule: [{ t: `${E5} temperature · 1 Nov 2023, 18 UTC · Brittany` }],
  s14_chain_meaning: [{ t: `${E5} temperature · 1 Nov 2023, 18 UTC · Brittany` }],
  s16_flight_east: [{ t: `${E5} temperature · 1 Nov 2023, 18–19 UTC · Brittany` }],
  s17_flight_west: [{ t: `${E5} temperature · 1 Nov 2023, 18 UTC · Brittany` }],
  s18_balloon_rate: [{ t: IG }],
  s19_balloon_terms: [{ t: "Data: IGRA2 radiosonde (NOAA NCEI) · Trappes · 30 Sep 2026, 00 and 12 UTC · ERA5 (Copernicus C3S) 500 hPa, 12 UTC" }],
  // fix 3 (review 3 Must 5): shortened so the line ends near x 1100, left of the s20 bar chart
  s20_parcel_pointer: [{ t: "Data: ERA5 (C3S) 850 hPa temperature, wind · 1 Nov 2023, 18 UTC · Brittany", w: 1100 }],
  s21_change_variables: [{ t: IG }],
  s22_state_functions: [{ t: "Relief: ETOPO 2022 (NOAA NCEI) · Monts d'Arrée, Brittany" }],
  s27_exponential: [{ t: IG }],
  s30_zoom: [{ t: IG }], s31_linear_approx: [{ t: IG }], s34_pressure_line: [{ t: IG }], s35_pressure_far: [{ t: IG }],
  s32_add_bend: [{ t: IG, on: (k) => [[0, SS(k, 4)]] }],
  s36_where_fails: [{ t: "Data: IGRA2 (NOAA NCEI) · Trappes, 30 Sep 2026, 12 UTC · ERA5 (Copernicus C3S) 850 hPa, 48.5° N, 1 Nov 2023, 18 UTC" }],
  s37_three_reasons: [
    { t: `${E5} temperature · 1 Nov 2023, 18 UTC · Brittany`, on: (k) => [[0, SS(k, 3)], [AT(k, 6, "spacing"), ALWAYS]] },
    { t: IG, on: (k) => [[SS(k, 5), AT(k, 6, "spacing")]] },
  ],
  s38_linearisation: [{ t: "Imagery: MODIS true colour (NASA Worldview) · Storm Ciarán, 1 Nov 2023", on: (k) => [[SS(k, 3), ALWAYS]] }],
  s41_cc_climate: [
    { t: "Warming: Forster et al. (2026), Indicators of Global Climate Change · 2016–2025 vs 1850–1900", on: (k) => [[SS(k, 1), SS(k, 4)]] },
    { t: "Data: ERA5 (Copernicus C3S) monthly total column water vapour · global · 1979–2025", on: (k) => [[SS(k, 4), ALWAYS]] },
  ],
  s42_planck: [{ t: `Data: CERES EBAF-TOA Ed4.2.1 (NASA LaRC) · outgoing longwave · map ${RD.latest} · global mean 2001–${RD.latest.slice(0, 4)}` }],
  s46_fd_grid: [{ t: `${E5} temperature · 1 Nov 2023, 18 UTC · Brest`, on: (k) => [[0, SS(k, 7)]] }],
  s47_recap: [
    { t: `${E5} temperature · 1 Nov 2023, 18 UTC · Brittany`, on: (k) => [[SS(k, 1), SS(k, 3)], [SS(k, 4), SS(k, 5)]] },
    { t: IG, on: (k) => [[SS(k, 5), SS(k, 6)]] },
  ],
};

// ================================================================ assembly
const K2SET = new Set(["s02_average_rate", "s07_partial_real", "s08_partial_time", "s12_total_example", "s13_chain_rule", "s16_flight_east",
  "s17_flight_west", "s19_balloon_terms", "s20_parcel_pointer", "s36_where_fails", "s42_planck", "s46_fd_grid"]);
const SCENES: React.FC[] = [S00, S01, S02, S03, S04, S05, S06, S07, S08, S09, S09B, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25,
  S26, S27, S28, S29, S30, S31, S32, S33, S34, S35, S36, S37, S38, S39, S40, S41, S42, S43, S44, S45, S46, S47, S48];
Object.keys(SRC).forEach((id) => K(id));
/** the source lines of scene k, each shown only inside its windows (scene-relative frames) */
const SrcWin: React.FC<{ k: number }> = ({ k }) => {
  const f = useCurrentFrame();
  const spec = SRC[sc[k].id];
  if (!spec) return null;
  return <>{spec.map((q, i) => {
    const ws = q.on ? q.on(k) : [[0, ALWAYS] as [number, number]];
    const o = Math.max(0, ...ws.map(([a, b]) => fin(f, a, 10) * fout(f, b - 10, 10)));
    // fix 2: the scenes re-rendered in this loop use the house K2 SourceBelow (≥ 16 px under the picture zone's box, y 40-820)
    if (o > 0 && K2SET.has(sc[k].id)) return <SourceBelow key={i} text={q.t} pic={{ x: q.x ?? 80, y: 40, w: q.w ?? 1760, h: 780 }} o={o * fin(f, 0, XF)} name={`${sc[k].id} src`} />;
    return o > 0 ? <SrcLine key={i} t={q.t} x={q.x ?? 80} w={q.w ?? 1760} o={o} /> : null;
  })}</>;
};
if (SCENES.length !== sc.length) throw new Error(`${SCENES.length} scene components but ${sc.length} scenes in timing.json`);
void [END, GBOX, Band, Dash, Strike, Rod3D, HRod3D, Globe, gcDest, TRAP, win, XF, CUT, mix, lutCss, cut2, EQ_S02, BROWN, SUMC, clamp, GOLDRING, ColourBar, Iso, MapView];
export const DerivativesTaylor: React.FC<{ audio?: string; bbox?: boolean }> = ({ audio = "narration_music.wav", bbox = false }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {/* house K6 probe (debug only: renders nothing unless the prop bbox is true) */}
    {bbox ? <BoxProbe /> : null}
    {SCENES.map((S, k) => (
      <Sequence key={sc[k].id} name={sc[k].id} from={CUT[k]} durationInFrames={LEN(k) + (k < SCENES.length - 1 ? XF : 0)}><S />
        <SrcWin k={k} /></Sequence>
    ))}
    {audio ? <Audio src={staticFile(audio)} /> : null}
  </AbsoluteFill>
);
