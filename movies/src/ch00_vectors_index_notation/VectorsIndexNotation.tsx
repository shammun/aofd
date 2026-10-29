import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BalloonThermometer, PoleThermometer } from "../house";
import { C, T } from "../house/kit/type";
import { Arrow, Band, Dash, Lbl, Pt, RightTick, Strike, Svg, clamp, lerp, mkP, pulse, textW } from "../house/kit/draw";
import { CalcStack, TeX, rep } from "../house/kit/tex";
import { Keyword } from "../house/kit/notes";
import { CurvedLink, TimeGraph } from "../house/kit/extras";
import { RiseText, TitleGradient } from "../house/kit/title";
import { ClockGlyph, Notebook } from "../house/kit/icons";
import { GProj, globePath, llPath, gcDest, useTex } from "./kit_vi/globe";
import { MapSlab3D, Parcel3D, ParcelBox3D } from "./kit_vi/box3d";
import { Arrow3D, Rod3D, View3D } from "./kit_vi/three3d";
import { orbitCam, projector, V3 as W3 } from "./kit_vi/cam";
import { MapBox, lerpBox, linesPath, lutCss, mapP } from "./kit_vi/wb";
import {
  AT, Arrow3, AxesGlyph, globeG, SrcLine, BGP, BREST, CUT, ColourBar, D, END, FPS, Floor, GBOX, Globe, IMGS, Iso, K, LEN, LUT_H, LUT_S, LUT_T, Line3, LowMark,
  MapView, P3, Place, Proj, SE, SS, SUMC, Scene, V3, VIOLET, VI_FRAMES, Winds, XF, add3, ease, fin, fmt, fout, limb, mix, mixP3, poly, proj3, sc, win,
} from "./vi_lib";

/**
 * Chapter-0 movie #1a "Vectors and index notation: writing the wind, how it changes and the warmth it carries"
 * (movies/ch00/ch00_vectors_index_notation/storyboard.yaml v2, 45 scenes), 1920×1080, 30 fps; length = timing.json + 2.5-s hold.
 * House style movies/HOUSE_STYLE.md (reference ch00_dot_product_why v6): one title (s00), keywords not sentences, no boxes,
 * no references, content y 40-860 (the caption band stays empty), text ≥ 44 px, reveals on their words (AT).
 * One real moment carries the movie: 18 UTC 1 Nov 2023 at Brest as Storm Ciarán's warm air arrived. Every number and every
 * moving or coloured thing comes from data/vi.json (movies/data/build_ch00_vectors_index_notation.py, tested fluidpy
 * functions, CHECK rows); this file only indexes and interpolates. Easy-number diagrams are labelled as such in the storyboard.
 */
export { VI_FRAMES };
export const VI_FPS = FPS;

// ---------------------------------------------------------------- equations (verbatim from the storyboard)
const EQ_S00 = String.raw`u_j\,\frac{\partial T}{\partial x_j}`;
const EQ_S06 = String.raw`\mathbf e_1,\ \mathbf e_2,\ \mathbf e_3`;
const EQ_S07 = String.raw`\mathbf u = 6\,\mathbf e_1 + 8\,\mathbf e_2 + 0\,\mathbf e_3`;
const EQ_S08 = String.raw`u = |\mathbf u|\sin 330^\circ = -4.65,\quad v = |\mathbf u|\cos 330^\circ = 8.05`;
const EQ_S10 = String.raw`|\mathbf u| = \sqrt{u^2 + v^2 + w^2}`;
const EQ_S11 = String.raw`\sqrt{5.8^2 + 33.5^2} \approx 34.0 \approx \sqrt{11.5^2 + 32.0^2}`;
const EQ_S12 = String.raw`\mathbf x = x_1\mathbf e_1 + x_2\mathbf e_2 + x_3\mathbf e_3`;
const EQ_S12A = String.raw`250 + 50 = 300\ \mathrm{m\,s^{-1}}`;
const EQ_S12B = String.raw`(0,\,250) + (50,\,0) = (50,\,250)`;
const EQ_S12C = String.raw`(0,\,12.5) + (6,\,-8) + (-6,\,-4.5) = (0,\,0)`;
const EQ_S12D = String.raw`\mathbf u = \mathbf u_g + \mathbf u_{ag}`;
const EQ_S12E = String.raw`\mathbf p - \mathbf q = \mathbf p + (-\mathbf q),\qquad (5,1) - (1,3) = (4,-2)`;
const EQ_S12F = String.raw`(5.8,\,33.5) - (7.6,\,23.3) = (-1.8,\,10.2)\ \mathrm{m\,s^{-1}}`;
const EQ_S12G = String.raw`\mathbf u_{500} - \mathbf u_{850} = (2.5,\,-5.4)\ \mathrm{m\,s^{-1}}`;
const EQ_S12H = String.raw`\mathbf u' = \mathbf u_{2023} - \overline{\mathbf u}_{1991\text{-}2020}`;
const EQ_S12I = String.raw`\mathbf u - \mathbf c = (5.8 - 20,\ 33.5 - 5) \approx (-14,\ 28)\ \mathrm{m\,s^{-1}}`;
const EQ_S13 = String.raw`u_i,\quad i = 1, 2, 3`;
const EQ_S14 = String.raw`d_i = u_i(\text{6 pm}) - u_i(\text{5 pm})`;
const EQ_S15 = String.raw`\mathbf p\cdot\mathbf q = p_1q_1 + p_2q_2 + p_3q_3`;
const EQ_S16 = String.raw`\mathbf p\cdot\mathbf q = \sum_{i=1}^{3} p_i q_i = p_i q_i`;
const EQ_S17 = String.raw`p_i q_i = p_j q_j`;
const EQ_S18 = String.raw`|\mathbf u|^2 = u_i u_i`;
const EQ_S20 = String.raw`\frac{\partial T}{\partial x_i}`;
const EQ_S21 = String.raw`u_j\frac{\partial T}{\partial x_j} = u_1\frac{\partial T}{\partial x_1} + u_2\frac{\partial T}{\partial x_2} + u_3\frac{\partial T}{\partial x_3} = \mathbf u\cdot\nabla T`;
const EQ_S22 = String.raw`10\times(-3\times10^{-5}) + 30\times(-2\times10^{-5}) = -9\times10^{-4}\ \mathrm{K\,s^{-1}}`;
const EQ_S23 = String.raw`\frac{\partial T}{\partial t} = -u_j\frac{\partial T}{\partial x_j}`;
const EQ_S25 = String.raw`\frac{\partial T}{\partial x_1} = -3.2\times10^{-5},\quad \frac{\partial T}{\partial x_2} = -2.5\times10^{-5}\ \mathrm{K\,m^{-1}}`;
const EQ_S26 = String.raw`5.8\times(-3.2\times10^{-5}) + 33.5\times(-2.5\times10^{-5}) \approx -1.0\times10^{-3}\ \mathrm{K\,s^{-1}}`;
const EQ_S28 = String.raw`u_j\frac{\partial u_i}{\partial x_j}`;
const EQ_S29 = String.raw`\delta_{ij} = \begin{cases}1 & i = j\\ 0 & i\neq j\end{cases}`;
const EQ_S30 = String.raw`\delta_{ij}u_j = \delta_{i1}u_1 + \delta_{i2}u_2 + \delta_{i3}u_3 = u_i`;
const EQ_S31 = String.raw`u_j\frac{\partial x_i}{\partial x_j} = u_j\delta_{ij} = u_i`;
const EQ_S32 = String.raw`\delta_{ii} = 3,\qquad \delta_{ij}p_iq_j = p_iq_i = \mathbf p\cdot\mathbf q`;
const EQ_S33 = String.raw`u_i,\quad u_j\frac{\partial T}{\partial x_j},\quad \delta_{ij}u_j = u_i`;
const EQ_S34 = String.raw`(\mathbf p\times\mathbf q)_i = \varepsilon_{ijk}\,p_j\,q_k`;

// ---------------------------------------------------------------- numbers on screen = the data (fail the render otherwise)
const E8 = D.e850, P18 = E8.pt["18"], P17 = E8.pt["17"], P19 = E8.pt["19"], ST = D.storm, SN = D.sounding, AN = D.anomaly;
const CHECK: [string, number, number, number][] = [
  ["u18 brest", D.brest.u18, -4.65, 5e-3], ["v18 brest", D.brest.v18, 8.05, 5e-3], ["norm", D.brest.norm_check, 9.30, 5e-3],
  ["u850", P18.u, 5.8, 0.05], ["v850", P18.v, 33.5, 0.05], ["|u850|", E8.norm18, 34.0, 0.05], ["u17", P17.u, 7.6, 0.05], ["v17", P17.v, 23.3, 0.05],
  ["along", E8.along[0], 11.5, 0.05], ["across", E8.along[1], 32.0, 0.05], ["e_along x", E8.e_along[0], 0.985, 5e-4], ["e_along y", E8.e_along[1], 0.174, 5e-4],
  ["dTdx", E8.dTdx_100km, -3.2, 0.05], ["dTdy", E8.dTdy_100km, -2.5, 0.05], ["adv K/h", E8.adv_Kh, -3.7, 0.05],
  ["T17", P17.T, 2.4, 0.05], ["T19", P19.T, 8.2, 0.05], ["w", D.column.w, 0.10, 0.015], ["ratio", D.column.ratio, 300, 100],
  ["jet", D.jet.max.speed, 65, 1.2], ["ug", ST.sea_pt.ug, 30.9, 0.05], ["vg", ST.sea_pt.vg, 24.9, 0.05], ["u10", ST.sea_pt.u10, 10.0, 0.05], ["v10", ST.sea_pt.v10, 18.0, 0.05],
  ["c east", ST.c[0], 20, 0.5], ["c north", ST.c[1], 5, 0.5], ["dist", ST.dist_km, 450, 10], ["shear", SN.nshear, 6, 0.1],
  ["clim", AN.box.clim, -5.0, 0.05], ["y2023", AN.box.y2023, -3.7, 0.05], ["anom", AN.box.anom, 1.3, 0.05], ["uu", E8.uu, 1156, 0.5],
];
CHECK.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
const lev = (p: number) => SN.levels.find((l: { p: number }) => l.p === p);
if (Math.abs(lev(850).u - 13.9) > 0.05 || Math.abs(lev(500).v - 4.4) > 0.05) throw new Error("CHECK sounding levels");

// ---------------------------------------------------------------- shared small pieces
/** maths-zone column x and the right edge */
const MX = 1100;
/** a gold ring (two routes meet / check) */
const Ring: React.FC<{ p: Pt; o?: number; r?: number }> = ({ p, o = 1, r = 26 }) => o <= 0 ? null :
  <circle cx={p[0]} cy={p[1]} r={r} fill="none" stroke={C.gold} strokeWidth={5} opacity={o} />;
/** a station glyph (triangle on a mast) */
const Station: React.FC<{ p: Pt; o?: number; s?: number }> = ({ p, o = 1, s = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <line x1={p[0]} y1={p[1]} x2={p[0]} y2={p[1] - 46 * s} stroke={C.ink} strokeWidth={4} />
    <polygon points={`${p[0] - 14 * s},${p[1]} ${p[0] + 14 * s},${p[1]} ${p[0]},${p[1] - 22 * s}`} fill={C.gold} stroke={C.bg} strokeWidth={3} />
  </g>
);
/** a translucent air-parcel cube (isometric, illustrative) */
const Parcel: React.FC<{ p: Pt; s?: number; o?: number; c?: string }> = ({ p, s = 60, o = 1, c = "#7cc4ff" }) => {
  if (o <= 0) return null;
  const a = s / 2, d = s * 0.35;
  const f = [[p[0] - a, p[1] - a], [p[0] + a, p[1] - a], [p[0] + a, p[1] + a], [p[0] - a, p[1] + a]] as Pt[];
  const b = f.map((q) => [q[0] + d, q[1] - d] as Pt);
  return (
    <g opacity={o}>
      <path d={poly(b) + "Z"} fill={c} fillOpacity={0.18} stroke={C.ink} strokeWidth={3} />
      {f.map((q, i) => <line key={i} x1={q[0]} y1={q[1]} x2={b[i][0]} y2={b[i][1]} stroke={C.ink} strokeWidth={3} />)}
      <path d={poly(f) + "Z"} fill={c} fillOpacity={0.3} stroke={C.ink} strokeWidth={3} />
    </g>
  );
};
/** a walker glyph (person seen from above-side), facing angle a (deg, 0 = east, anticlockwise) */
const Walker: React.FC<{ p: Pt; a?: number; o?: number; s?: number }> = ({ p, a = 0, o = 1, s = 1 }) => o <= 0 ? null : (
  <g opacity={o} transform={`translate(${p[0]} ${p[1]}) rotate(${-a}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={14} ry={24} fill={C.key} stroke={C.bg} strokeWidth={3} />
    <circle cx={4} cy={0} r={11} fill="#c9a27a" stroke={C.bg} strokeWidth={2} />
    <polygon points="22,0 12,-8 12,8" fill={C.gold} />
  </g>
);
/** a small cloud (illustrative) */
const Cloud: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o} fill="#eef2f8">
    <ellipse cx={x} cy={y} rx={70 * s} ry={30 * s} /><circle cx={x - 30 * s} cy={y - 20 * s} r={30 * s} /><circle cx={x + 18 * s} cy={y - 32 * s} r={38 * s} />
  </g>
);
/** an aircraft glyph pointing along angle a (deg, 0 = east) */
const Plane: React.FC<{ p: Pt; a?: number; s?: number; o?: number }> = ({ p, a = 0, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o} transform={`translate(${p[0]} ${p[1]}) rotate(${-a}) scale(${s})`}>
    <path d="M 30 0 L 10 -4 L -2 -26 L -10 -26 L -4 -4 L -20 -4 L -26 -14 L -32 -14 L -28 0 L -32 14 L -26 14 L -20 4 L -4 4 L -10 26 L -2 26 L 10 4 Z"
      fill={C.ink} stroke={C.bg} strokeWidth={3} />
  </g>
);
/** a balloon tied to a radiosonde box */
const Sonde: React.FC<{ p: Pt; s?: number; o?: number }> = ({ p, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <circle cx={p[0]} cy={p[1] - 40 * s} r={24 * s} fill="#eef2f8" stroke={C.bg} strokeWidth={3} />
    <line x1={p[0]} y1={p[1] - 16 * s} x2={p[0]} y2={p[1] + 18 * s} stroke={C.ink} strokeWidth={3} />
    <rect x={p[0] - 8 * s} y={p[1] + 18 * s} width={16 * s} height={12 * s} fill={C.second} stroke={C.bg} strokeWidth={2} />
  </g>
);
/** warm-front symbol strip (red line with semicircles), a keyword glyph */
const WarmFrontGlyph: React.FC<{ x: number; y: number; w?: number; o?: number }> = ({ x, y, w = 220, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <line x1={x} y1={y} x2={x + w} y2={y} stroke="#e0505a" strokeWidth={7} />
    {Array.from({ length: Math.floor(w / 55) }, (_, i) => <path key={i} d={`M ${x + 20 + i * 55} ${y} A 16 16 0 0 1 ${x + 52 + i * 55} ${y} Z`} fill="#e0505a" />)}
  </g>
);
const ROW = (rhs: string, at: number, lhs?: string, extra: Record<string, unknown> = {}) => ({ lhs, rhs, at, ...extra });
/** shared map boxes */
/** fix loop 1 (M1): every picture ends at y 820 (the source line has its own band below); a box drawn 820 px tall is
 * cropped at the bottom (same scale, the southern 40 px of latitude dropped) */
const crop = (B: MapBox): MapBox => (B.y + B.h <= 820 ? B : { ...B, lat0: B.lat1 - ((B.lat1 - B.lat0) * (820 - B.y)) / B.h, h: 820 - B.y });
const BR_BOX: MapBox = crop({ lat0: 46.5, lat1: 50.5, lon0: -7.8, lon1: -1.04, x: 80, y: 40, w: 920, h: 820 });       // Brittany (picture zone)
const ZBOX: MapBox = crop({ lat0: 47.6, lat1: 49.6, lon0: -6.18, lon1: -2.8, x: 80, y: 40, w: 920, h: 820 });         // zoom on Brest (s25-s26)
const COAST_BOX: MapBox = crop({ lat0: 47.4, lat1: 49.4, lon0: -5.9, lon1: -2.52, x: 80, y: 40, w: 920, h: 820 });    // north Brittany (s15, s18)
/** s11: the same scale shifted north, so Brest sits low in the frame and the 34-m/s arrow and both axis pairs have room */
const S11_BOX: MapBox = { lat0: 47.6, lat1: 49.5, lon0: -5.9, lon1: -2.52, x: 80, y: 40, w: 920, h: 780 };   // inside the relief image
/** degrees of longitude / latitude per km at Brest */
const KM_LON = 1 / (111.195 * Math.cos(48.5 * Math.PI / 180)), KM_LAT = 1 / 111.195;

// ================================================================ s00 title
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  const tMet = AT(k, 0, "meteorology"), tEasy = AT(k, 0, "the easy way");
  const A = { x: 1262, y: 110, w: 578, h: 540 };   // fix 1 (S20): ≥ 50 px clear of the subtitle
  const oA = fin(f, 4, 10) * fout(f, tMet, 12), oB = fin(f, tMet, 12);
  const P = proj3(198 + 0.08 * f, 24, 15, [A.x + 360, A.y + 430]);
  const u: V3 = [P18.u, P18.v, 0], u17: V3 = [P17.u, P17.v, 0];
  const g0 = 14, gL = (i: number) => clamp((f - g0 - 22 - 16 * i) / 14, 0, 1);
  const legs: [V3, V3, string, string][] = [[[0, 0, 0], [u[0], 0, 0], "u₁", C.first], [[u[0], 0, 0], [u[0], u[1], 0], "u₂", C.first], [[u[0], u[1], 0], [u[0], u[1], 0.01], "u₃ ≈ 0", C.first]];
  const tCh = g0 + 76;
  // Part B: T850 17 -> 19 UTC cross-faded, isotherms of the nearest hour, arrows, and the advection line building
  const hB = clamp((f - tMet - 4) / (LEN(k) - tMet - 30), 0, 1) * 2; // 0..2 -> 17..19 UTC
  const w17 = clamp(1 - hB, 0, 1), w19 = clamp(hB - 1, 0, 1), w18 = 1 - w17 - w19;
  const MB: MapBox = { lat0: 46.2, lat1: 50.6, lon0: -9.94, lon1: 0.43, x: A.x, y: A.y, w: A.w, h: 370 };   // true local aspect
  const hNear = hB < 0.5 ? "17" : hB < 1.5 ? "18" : "19";
  const pz = 1 + 0.06 * pulse(f, tEasy, 12);
  return (
    <Scene fadeIn={false}>
      <Svg>
        <defs><TitleGradient id="ttl" x1={100} x2={760} /></defs>
        <RiseText f={f} t="Vectors and" x={100} y={210} s={150} at={2} fill="url(#ttl)" />
        <RiseText f={f} t="index notation" x={100} y={370} s={128} at={14} fill="url(#ttl)" />
        <g transform={`translate(104 500) scale(${pz}) translate(-104 -500)`}>
          <RiseText f={f} t="made easy" x={104} y={520} s={96} at={26} fill={C.key} />
        </g>
        <RiseText f={f} t="and how meteorology uses them" x={106} y={640} s={68} at={40} fill={C.key} colors={(i) => (i >= 8 && i < 19 ? C.first : undefined)} />
        {/* Part A: the real 850 hPa wind at Brest split into its components; then the 17 UTC wind and the change */}
        <g opacity={oA}>
          {([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as V3[]).map((e, i) => <Line3 key={i} P={P} a={[0, 0, 0]} b={[e[0] * 9, e[1] * 36, e[2] * 12]} c={C.muted} w={3} />)}
          <Lbl x={P.p([9.8, 0, 0])[0]} y={P.p([9.8, 0, 0])[1]} t="east" c={C.muted} s={T.floor} a="middle" />
          <Lbl x={P.p([0, 38, 0])[0]} y={P.p([0, 38, 0])[1] - 20} t="north" c={C.muted} s={T.floor} a="middle" />
          <Lbl x={P.p([0, 0, 13])[0]} y={P.p([0, 0, 13])[1] - 10} t="up" c={C.muted} s={T.floor} a="middle" />
          {legs.map(([a, b, t, c], i) => <g key={i} opacity={gL(i)}><Line3 P={P} a={a} b={b} c={c} w={5} dash="12 9" />
            {i < 2 ? <Lbl x={(P.p(a)[0] + P.p(b)[0]) / 2 + (i === 0 ? 0 : 26)} y={(P.p(a)[1] + P.p(b)[1]) / 2 + (i === 0 ? 34 : 0)} t={t} c={C.first} s={T.floor} a={i === 0 ? "middle" : "start"} /> : null}</g>)}
          <Arrow3 P={P} a={[0, 0, 0]} b={u17} c={C.local} w={8} head={30} o={fin(f, tCh, 10)} />
          <Arrow3 P={P} a={[0, 0, 0]} b={u} c={C.first} grow={clamp((f - g0) / 18, 0, 1)} />
          <Arrow3 P={P} a={u17} b={u} c={C.gold} w={7} head={28} grow={clamp((f - tCh - 10) / 14, 0, 1)} />
        </g>
        {/* Part B */}
        <g opacity={oB}>
          <MapViewInline B={MB} hs={[{ h: 17, o: w17 }, { h: 18, o: w18 }, { h: 19, o: w19 }]} iso={hNear} />
          <TeXSlot />
          <ColourBar x={A.x} y={690} w={470} lut={LUT_T} lo={-6} hi={16} unit="°C" ticks={[{ v: -4, t: "−4" }, { v: 4, t: "4" }, { v: 12, t: "12" }]} />
          <Lbl x={A.x} y={797} t="temperature, 1.2 km up" c={C.muted} s={T.floor} />
        </g>
      </Svg>
      <TeX s={EQ_S00} x={A.x + A.w / 2} y={590} size={76} ax={0.5} o={oB * fin(f, tMet + 30, 12)} />
    </Scene>
  );
};
const TeXSlot: React.FC = () => null;
/** a compact map (inside an existing <Svg>): T850 hours cross-faded, isotherms, coast, Brest and the 850 hPa arrows */
const MapViewInline: React.FC<{ B: MapBox; hs: { h: number; o: number }[]; iso: string }> = ({ B, hs, iso }) => {
  const P = mapP(B);
  const im = (h: number, o: number) => { const a = P(D.e850.t850["18"].tex.lat_edges[1], D.e850.t850["18"].tex.lon_edges[0]), b = P(D.e850.t850["18"].tex.lat_edges[0], D.e850.t850["18"].tex.lon_edges[1]);
    return o > 0 ? <image key={h} href={IMGS.t850(h)} x={a[0]} y={a[1]} width={b[0] - a[0]} height={b[1] - a[1]} preserveAspectRatio="none" opacity={o} /> : null; };
  return (
    <g>
      <defs><clipPath id={`mvi${B.x}${B.y}`}><rect x={B.x} y={B.y} width={B.w} height={B.h} /></clipPath></defs>
      <g clipPath={`url(#mvi${B.x}${B.y})`}>
        {hs.map((h) => im(h.h, h.o))}
        <path d={linesPath(P, D.lines.coast_10m)} fill="none" stroke={C.key} strokeOpacity={0.8} strokeWidth={2} />
        <Iso P={P} levels={D.e850.t850[iso].iso} o={0.75} w={2} />
        <Winds P={P} list={D.e850.arrows_br18.filter((r: number[]) => (Math.round(r[0] / 0.75) % 2 === 0) && (Math.round(r[1] / 0.75) % 2 === 0))} px={3} c={C.first} w={4} head={16} />
        <Place p={P(BREST[0], BREST[1])} r={9} />
      </g>
      <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="none" stroke={C.grid} strokeWidth={3} />
    </g>
  );
};

// ================================================================ s01 hook: the wind as arrows on the real Earth
/** fix 1 (M12, S21): one globe framing for s01, s02, s03 and s33: the whole disc fits 920 × 780 (dist ≥ 3.5 Earth radii
 * at fov 35°); s02 starts exactly where s01 ends */
const S01_END = { lat: 45.5, lon: -12, dist: 3.6 };
const Streaks: React.FC<{ G: GProj; f: number; o?: number; c?: string; n?: number }> = ({ G, f, o = 1, c = C.first, n = 9999 }) => {
  if (o <= 0) return null;
  const tr = D.streaks.tracks as number[][], L = D.streaks.steps as number;
  const out: React.ReactNode[] = [];
  for (let i = 0; i < Math.min(n, tr.length); i++) {
    const ph = ((f * 0.22 + i * 3.7) % (L + 6));
    const head = Math.min(L - 1, Math.floor(ph)), tail = Math.max(0, head - 5);
    if (head - tail < 1) continue;
    const pts: [number, number][] = [];
    for (let s = tail; s <= head; s++) pts.push([tr[i][2 * s], tr[i][2 * s + 1]]);
    const d = llPath(G, pts, 1.003);
    if (d) out.push(<path key={i} d={d} fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" opacity={0.85 * (ph > L ? 0 : 1)} />);
  }
  return <g opacity={o}>{out}</g>;
};
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  // fix 1 (M12): the whole disc inside the picture zone (80-1000 × 40-820), the same framing as s02, s03 and s33
  const cam = globePath([{ f: 0, lat: 44, lon: -16, dist: S01_END.dist + 0.1 }, { f: LEN(k), ...S01_END }], f);
  const tWhat = AT(k, 1, "what they are"), tWhy = AT(k, 1, "why"), tWind = AT(k, 1, "about the wind");
  return (
    <Scene>
      <Globe cam={cam} coast={0.5} over={(G) => {
        const b = G.p(BREST[0], BREST[1], 1.002);
        const sc = 0.42, o3 = fin(f, tWhat);   // the arrow is a glyph: 0.42° of arc per m/s, pointing along the wind
        const tip = G.p(BREST[0] + P18.v * sc, BREST[1] + (P18.u * sc) / Math.cos(48.5 * Math.PI / 180), 1.002);
        return (
          <g>
            <Streaks G={G} f={f} o={1 - 0.5 * o3} />
            <Place p={b} t="Brest" dx={-22} dy={30} a="end" />
            <g opacity={o3}>
              <Dash p={b} q={[tip[0], b[1]]} c={C.first} w={5} />
              <Dash p={[tip[0], b[1]]} q={tip} c={C.first} w={5} />
              <Arrow p={b} q={tip} color={C.first} w={10 + 3 * pulse(f, tWind, 16)} head={40} />
            </g>
          </g>
        );
      }} />
      <Svg>
        <Lbl x={1540} y={130} t="?" c={C.gold} s={T.hero} a="middle" o={fin(f, 6) * fout(f, tWhat, 10)} />
        <Lbl x={1540} y={300} t="vectors" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 0, "vectors")) * fout(f, tWhy - 10, 10)} />
        <Lbl x={1540} y={400} t="index notation" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 0, "index notation")) * fout(f, tWhy - 10, 10)} />
      </Svg>
      <TeX s={String.raw`u_i`} x={1540} y={230} size={T.eq} ax={0.5} o={fin(f, tWhy)} c={C.first} />
      <TeX s={String.raw`\delta_{ij}`} x={1540} y={420} size={T.eq} ax={0.5} o={fin(f, tWhy + 8)} />
      <TeX s={EQ_S00} x={1540} y={640} size={T.eq} ax={0.5} o={fin(f, tWhy + 16)} />
    </Scene>
  );
};

// ================================================================ s02 / s03 scalar: the temperature globe
/** fix 1: the temperature over the MODIS globe at 92 % on an Earth dimmed to 25 % (cloud ≤ 2 % of the colour, S12) */
const T2M_O = 0.92;
const GLOBE_BREST = { lat: 47, lon: -6, dist: 3.5 };
const ThermoIcon: React.FC<{ p: Pt; s?: number; o?: number }> = ({ p, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <rect x={p[0] - 10 * s} y={p[1] - 80 * s} width={20 * s} height={80 * s} rx={10 * s} fill={C.ink} stroke={C.bg} strokeWidth={3} />
    <rect x={p[0] - 4 * s} y={p[1] - 50 * s} width={8 * s} height={50 * s} fill={C.second} />
    <circle cx={p[0]} cy={p[1] + 6 * s} r={17 * s} fill={C.second} stroke={C.ink} strokeWidth={3} />
  </g>
);
const S02: React.FC = () => {
  const f = useCurrentFrame(), k = K("s02_scalar_globe");
  const t6 = SS(k, 5);
  const cam = globePath([{ f: 0, ...S01_END }, { f: SS(k, 1), lat: 28, lon: 20, dist: 3.75 }, { f: SS(k, 4), lat: 38, lon: 35, dist: 3.75 },
    { f: t6 + 30, ...GLOBE_BREST }], f);
  const tSix = AT(k, 1, "six in the evening"), tUT = SS(k, 2), tERA = AT(k, 3, "ERA5"), tRe = AT(k, 3, "reanalysis");
  const pr = D.globe.probes;
  const probe = (G: GProj, name: string, i: number, at: number) => {
    const q = pr[name], p = G.p(q.lat, q.lon, 1.002), o = fin(f, at + i * 8) * limb(G, q.lat, q.lon) * (name === "Brest" ? 1 : fout(f, t6, 12));
    return o > 0 ? <g key={name} opacity={o}><circle cx={p[0]} cy={p[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
      <Lbl x={p[0] + 18} y={p[1] - 30} t={`${fmt(q.T, 0)} °C`} c={C.key} s={T.floor} /></g> : null;
  };
  const bp: Pt = globeG(cam).p(BREST[0], BREST[1], 1.002);
  return (
    <Scene>
      <Globe cam={cam} field={IMGS.t2m} fieldO={T2M_O} dim={0.25} coast={0.55} over={(G) => {
        return <g>{["Sahara", "Siberia"].map((n, i) => probe(G, n, i, SS(k, 4)))}
          {f >= t6 ? <g opacity={fin(f, t6 + 20)}><circle cx={bp[0]} cy={bp[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={4} /><ThermoIcon p={[bp[0] + 2, bp[1] - 40]} s={0.8} />
            <Lbl x={bp[0] - 24} y={bp[1] + 36} t="Brest" c={C.key} s={T.key} a="end" /></g> : null}</g>;
      }} />
      <Svg>
        <ColourBar x={1120} y={700} w={600} lut={LUT_T} lo={-30} hi={30} unit="°C" ticks={[{ v: -30, t: "−30" }, { v: 0, t: "0" }, { v: 30, t: "30" }]} o={fin(f, 10)} />
        <Lbl x={1120} y={655} t="air temperature, 2 m up" c={C.muted} s={T.floor} o={fin(f, 10)} />
        <g opacity={fin(f, tSix)}>
          <ClockGlyph x={1150} y={140} r={38} h={6} />
          <Lbl x={1210} y={140} t="18:00 UTC" c={C.key} s={T.key} />
          <Lbl x={1500} y={140} t="1 Nov 2023" c={C.key} s={T.key} />
        </g>
        <Keyword f={f} text="universal time" at={[1150, 250]} appear={tUT} s={T.key} />
        <Keyword f={f} text="ERA5" at={[1150, 370]} appear={tERA} s={T.key} targets={[[780, 420]]} />
        <Keyword f={f} text="reanalysis" at={[1340, 370]} appear={tRe} s={T.key} />
        <Lbl x={1150} y={470} t="one number at every place" c={C.key} s={T.floor} o={fin(f, SS(k, 4))} />
        <g opacity={fin(f, t6 + 24)}>
          <ThermoIcon p={[1170, 575]} s={0.9} />
          <Lbl x={1220} y={548} t="10.3 °C" c={C.second} s={T.calc} />
        </g>
        <CurvedLink f={f} from={[bp[0] + 40, bp[1] - 20]} to={[1140, 590]} start={t6 + 34} bend={-90} />
      </Svg>
    </Scene>
  );
};
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_scalar_word");
  const t1 = AT(k, 0, "called a scalar"), tF = AT(k, 2, "scalar field"), t4 = SS(k, 3), tStill = AT(k, 4, "still reads");
  const sweep = clamp((f - tF - 8) / 30, 0, 1);
  const turn = clamp((f - SS(k, 4)) / (tStill - SS(k, 4)), 0, 1);
  return (
    <Scene>
      <Globe cam={GLOBE_BREST} field={IMGS.t2m} fieldO={T2M_O} coast={0.55} dim={0.25} over={(G) => {
        const b = G.p(BREST[0], BREST[1], 1.002);
        const sw = G.p(40 - 25 * sweep, -25 + 45 * sweep, 1.002);
        return <g>
          <circle cx={b[0]} cy={b[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={4} />
          <ThermoIcon p={[b[0] + 2, b[1] - 40]} s={0.8} />
          <Walker p={[b[0] + 70, b[1] + 50]} a={90 + 360 * turn} o={fin(f, t4)} s={1.3} />
          {sweep > 0 && sweep < 1 ? <circle cx={sw[0]} cy={sw[1]} r={30} fill="none" stroke={C.gold} strokeWidth={5} /> : null}
        </g>;
      }} />
      <Svg>
        <ColourBar x={MX} y={712} w={600} lut={LUT_T} lo={-30} hi={30} unit="°C" ticks={[{ v: -30, t: "−30" }, { v: 0, t: "0" }, { v: 30, t: "30" }]} o={fin(f, 6)} />
        <Lbl x={MX} y={676} t="air temperature, 2 m up" c={C.muted} s={T.floor} o={fin(f, 6)} />
        <Lbl x={MX} y={180} t="scalar" c={C.key} s={T.hero} o={fin(f, t1)} />
        <Lbl x={MX} y={290} t="one number + unit" c={C.key} s={T.key} o={fin(f, t1 + 10)} />
        {["pressure ·", "density ·", "humidity"].map((w, i) => <Lbl key={w} x={MX + [0, 265, 500][i]} y={400} t={w} c={C.key} s={T.key} o={fin(f, AT(k, 1, i === 0 ? "Pressure" : w.replace(" ·", "")))} />)}
        <Keyword f={f} text="scalar field" at={[MX, 520]} appear={tF} s={T.key} targets={[[700, 300], [420, 600]]} />
        <g transform={`translate(${MX + 500} 600) scale(${1 + 0.1 * pulse(f, tStill, 16)}) translate(${-MX - 500} -600)`} opacity={fin(f, 4)}>
          <ThermoIcon p={[MX + 380, 625]} s={0.75} />
          <Lbl x={MX + 420} y={600} t="10.3 °C" c={C.second} s={T.calc} />
        </g>
      </Svg>
    </Scene>
  );
};

// ================================================================ s04 vector: the wind at Brest
const LOC_BOX: MapBox = crop({ lat0: 47.9, lat1: 48.95, lon0: -5.25, lon1: -3.57, x: 80, y: 40, w: 920, h: 820 });
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = K("s04_vector_wind");
  const tRep = AT(k, 1, "nine point three"), tVec = AT(k, 4, "called a vector"), tArr = AT(k, 4, "draw it as"), tLen = SS(k, 5);
  const tFrom = SS(k, 6), tTow = AT(k, 7, "towards the north");
  const P = mapP(LOC_BOX), st = P(48.448, -4.419), city = P(48.39, -4.49);
  const px = 30, L = 9.3 * px, b = 330 * Math.PI / 180;
  const tip: Pt = [st[0] + Math.sin(b) * L * clamp((f - tArr) / 16, 0, 1), st[1] - Math.cos(b) * L * clamp((f - tArr) / 16, 0, 1)];
  const tipF: Pt = [st[0] + Math.sin(b) * L, st[1] - Math.cos(b) * L];
  const bf = 150 * Math.PI / 180, sock: Pt = [st[0] + Math.sin(bf) * 140, st[1] - Math.cos(bf) * 140];
  const kmPx = (LOC_BOX.h / ((LOC_BOX.lat1 - LOC_BOX.lat0) * 111.195));
  const arc = clamp((f - tTow) / 24, 0, 1);
  return (
    <Scene>
      <MapView id="s04" B={LOC_BOX} L={{ relief: 1, coast: 0.7 }} children={() => (
        <g>
          <Place p={city} t="Brest" dx={-20} dy={-34} a="end" />
          <Station p={st} />
          <Lbl x={st[0] + 26} y={st[1] + 34} t="weather station" c={C.key} s={T.floor} o={fin(f, 6)} />
          <g opacity={fin(f, 6)}>
            <line x1={720} y1={784} x2={720 + 10 * kmPx} y2={784} stroke={C.key} strokeWidth={5} />
            <Lbl x={720 + 10 * kmPx + 16} y={784} t="10 km" c={C.key} s={T.floor} />
          </g>
          {/* the wind sock points INTO the wind (towards 150°) */}
          <g opacity={fin(f, tFrom)}>
            <line x1={st[0]} y1={st[1]} x2={sock[0]} y2={sock[1]} stroke={C.local} strokeWidth={6} strokeDasharray="10 8" />
            <polygon points={`${sock[0]},${sock[1]} ${sock[0] - 26},${sock[1] - 18} ${sock[0] - 8},${sock[1] - 34}`} fill={C.local} />
            <Lbl x={sock[0] + 10} y={sock[1] + 40} t="from SSE" c={C.local} s={T.key} />
          </g>
          <Arrow p={st} q={tip} color={C.first} o={fin(f, tArr, 6)} />
          <Lbl x={tip[0] + 16} y={tip[1] + 6} t="towards NNW" c={C.first} s={T.key} o={fin(f, tTow)} />
          {arc > 0 ? <path d={(() => { const pts: Pt[] = []; for (let i = 0; i <= 30; i++) { const a = (150 + 180 * arc * i / 30) * Math.PI / 180; pts.push([st[0] + Math.sin(a) * 90, st[1] - Math.cos(a) * 90]); } return poly(pts); })()}
            fill="none" stroke={C.gold} strokeWidth={5} /> : null}
        </g>
      )} />
      <Svg>
        <Keyword f={f} text="the wind at Brest" at={[MX, 110]} appear={6} s={T.key} />
        <Lbl x={MX} y={210} t="9.3 m/s from SSE" c={C.key} s={T.calc} o={fin(f, tRep)} />
        <Lbl x={MX} y={330} t="vector" c={C.key} s={T.hero} o={fin(f, tVec)} />
        <Keyword f={f} text="size" at={[MX + 20, 470]} appear={AT(k, 4, "a size")} s={T.key} />
        <Keyword f={f} text="direction" at={[MX + 200, 470]} appear={AT(k, 4, "a direction")} s={T.key} />
        <Lbl x={MX} y={590} t="length = speed" c={C.key} s={T.key} o={fin(f, tLen)} />
        <Lbl x={MX} y={680} t="points where the air goes" c={C.key} s={T.key} o={fin(f, AT(k, 5, "points the way"))} />
      </Svg>
      {/* fix 1 (M7): the wind vector is bold u from its first appearance */}
      <TeX s={String.raw`\mathbf u`} x={tipF[0] - 24} y={tipF[1] - 30} size={T.calc} ax={1} c={C.first} o={fin(f, AT(k, 4, "bold u"))} />
      <TeX s={String.raw`\mathbf u`} x={MX + 420} y={330} size={T.hero - 28} c={C.first} o={fin(f, AT(k, 4, "bold u"))} />
    </Scene>
  );
};

// ================================================================ s05 vector field: winds above western Europe
const EU_BOX: MapBox = crop({ lat0: 42.5, lat1: 56, lon0: -32, lon1: 8, x: 167, y: 40, w: 1587, h: 820 });
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = K("s05_vector_field");
  const tL = AT(k, 1, "Storm Ciarán"), tS = SS(k, 2), tLift = SS(k, 3);
  const P = mapP(EU_BOX);
  const list = (D.e850.arrows_wide as number[][]).filter((r) => Math.round((r[0] - 42) / 1.5) % 2 === 0 && Math.round((r[1] + 31.5) / 1.5) % 2 === 0);
  // fix 1 (S3): the fast stream west of France (> 30 m/s, 43-48° N, 9-1° W) streams towards the north-east (44-77°)
  const fast = list.filter((r) => Math.hypot(r[2], r[3]) > 30 && r[1] > -9.1 && r[1] < -1 && r[0] >= 43 && r[0] <= 48);
  const t18 = ST.track.find((x: { t: string }) => x.t.endsWith("01T18"));
  const lift = clamp((f - tLift) / 30, 0, 1);
  const b = P(BGP[0], BGP[1]);
  return (
    <Scene>
      <MapView id="s05" B={EU_BOX} L={{ tc: 1, coast: 0.7, borders: 0.4 }} children={(Pp) => (
        <g>
          <Winds P={Pp} list={list} px={3} c={C.first} w={5} head={18} grow={clamp(f / 40, 0, 1)} o={1 - 0.4 * lift} />
          {fast.length ? <g opacity={win(f, tS, SS(k, 3) + 20)}>
            {fast.map((r, i) => { const p = Pp(r[0], r[1]); return <circle key={i} cx={p[0] + r[2] * 1.5} cy={p[1] - r[3] * 1.5} r={60} fill="none" stroke={C.gold} strokeWidth={5} />; })}
          </g> : null}
          <LowMark p={Pp(t18.lat, t18.lon)} o={fin(f, tL)} />
          <Place p={b} r={10} />
          <g opacity={lift}><Arrow p={b} q={[b[0] + P18.u * 3 * (1 + 1.4 * lift), b[1] - P18.v * 3 * (1 + 1.4 * lift)]} color={C.first} w={10} head={40} /></g>
        </g>
      )} />
      <Svg>
        <Lbl x={P(t18.lat, t18.lon)[0] - 70} y={P(t18.lat, t18.lon)[1] - 120} t="Storm Ciarán" c={C.key} s={T.key} a="end" o={fin(f, tL)} />
        <Lbl x={P(t18.lat, t18.lon)[0] - 70} y={P(t18.lat, t18.lon)[1] - 60} t="low pressure" c={C.key} s={T.key} a="end" o={fin(f, AT(k, 1, "low pressure"))} />
        <Lbl x={P(45.5, -9)[0]} y={P(45.5, -9)[1]} t="> 30 m/s" c={C.gold} s={T.key} a="middle" o={win(f, tS + 10, SS(k, 3) + 20)} />
        <Keyword f={f} text="vector field" at={[200, 90]} appear={6} s={T.key} />
        <g opacity={fin(f, 10)}>
          <Arrow p={[1420, 785]} q={[1420 + 30 * 3, 785]} color={C.first} w={5} head={18} />
          <Lbl x={1530} y={785} t="30 m/s" c={C.key} s={T.floor} />
        </g>
        <Lbl x={1210} y={90} t="1.2 km up · 18 UTC" c={C.key} s={T.floor} o={fin(f, AT(k, 1, "a little more"))} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s06, s07 basis and components (3-D on the Brest relief)
// fix 1 (M1, S1): the floor is ±10 units (same km per unit as before) so the relief fits the picture zone 80-1000 × 40-820
const FLOOR = { x0: -10, x1: 10, y0: -10, y1: 10, lat: 48.448, lon: -4.419, dlat: 0.382, dlon: 0.573 };
const UnitAxes: React.FC<{ P: P3; f: number; t0: number; L?: number; o?: number }> = ({ P, f, t0, L = 9, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    {([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as V3[]).map((e, i) => <Line3 key={i} P={P} a={[0, 0, 0]} b={[e[0] * L * clamp((f - t0 - 6 * i) / 16, 0, 1), e[1] * L * clamp((f - t0 - 6 * i) / 16, 0, 1), e[2] * L * clamp((f - t0 - 6 * i) / 16, 0, 1)]} c={C.muted} w={4} />)}
    {Array.from({ length: L }, (_, j) => j + 1).flatMap((j) => ([[1, 0, 0], [0, 1, 0]] as V3[]).map((e, i) => {
      const p = P.p([e[0] * j, e[1] * j, 0]);
      return <circle key={`${i}${j}`} cx={p[0]} cy={p[1]} r={4} fill={C.muted} opacity={clamp((f - t0 - 16) / 10, 0, 1)} />;
    }))}
  </g>
);
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = K("s06_basis");
  const P = proj3(220, 25, 32, [548, 480]);
  const tAx = SS(k, 1), tE = SS(k, 3), tUnit = AT(k, 2, "unit vector"), tLab = SS(k, 4), tRA = SS(k, 6), tBasis = AT(k, 6, "basis");
  const words: [V3, string, string][] = [[[10, 0, 0], "east", "e₁"], [[0, 10, 0], "north", "e₂"], [[0, 0, 10], "up", "e₃"]];
  const lp = pulse(f, tLab, 20);
  return (
    <Scene>
      <Svg>
        <Floor P={P} {...FLOOR} id="s06" />
        <Place p={P.p([0, 0, 0])} r={9} />
        <UnitAxes P={P} f={f} t0={tAx} L={9} />
        {words.map(([v, w], i) => <Lbl key={w} x={P.p(v)[0]} y={P.p(v)[1] - 26} t={w} c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, w === "east" ? "points east" : w === "north" ? "one points north" : "straight up") )} />)}
        {words.map(([v], i) => { const u: V3 = [v[0] / 10 * 3.6, v[1] / 10 * 3.6, v[2] / 10 * 3.6]; const q = P.p(add3(u, u, 0.3));
          return <g key={i} opacity={fin(f, tE + 6 * i)}><Arrow3 P={P} a={[0, 0, 0]} b={u} c={C.second} w={10} head={34} />
            <Lbl x={q[0] + (i === 0 ? 30 : i === 1 ? -30 : 34)} y={q[1] + (i === 0 ? 34 : i === 2 ? 10 : 30)} t={words[i][2]} c={lp > 0 ? C.gold : C.second} s={T.calc + 10 * lp} a="middle" /></g>; })}
        {(() => { const o = fin(f, tRA); const s = 1.0, sq = (a: V3, b: V3) => poly([P.p([a[0] * s, a[1] * s, a[2] * s]), P.p([(a[0] + b[0]) * s, (a[1] + b[1]) * s, (a[2] + b[2]) * s]), P.p([b[0] * s, b[1] * s, b[2] * s])]);
          return <g opacity={o} fill="none" stroke={C.ink} strokeWidth={3}><path d={sq([1, 0, 0], [0, 1, 0])} /><path d={sq([1, 0, 0], [0, 0, 1])} /><path d={sq([0, 1, 0], [0, 0, 1])} /></g>; })()}
      </Svg>
      <TeX s={EQ_S06} x={MX} y={180} size={T.eq} o={fin(f, tE)} c={C.second} />
      <Svg><Lbl x={MX} y={180} t="three directions at Brest" c={C.key} s={T.key} o={fin(f, 6) * fout(f, tE - 10)} /></Svg>
      <Svg>
        <Lbl x={MX} y={290} t="east · north · up" c={C.key} s={T.key} o={fin(f, tE + 10)} />
        <Keyword f={f} text="unit vector" at={[MX, 420]} appear={tUnit} s={T.key} />
        <Lbl x={MX + 330} y={420} t="length 1" c={C.key} s={T.key} o={fin(f, tUnit + 10)} />
        <Keyword f={f} text="labels" at={[MX, 540]} appear={tLab} s={T.key} />
        <Lbl x={MX} y={640} t="right angles" c={C.key} s={T.key} o={fin(f, tRA)} />
        <Keyword f={f} text="basis" at={[MX, 760]} appear={tBasis} s={T.hero - 40} />
      </Svg>
    </Scene>
  );
};
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_components_easy");
  const v = ease(clamp(f / 40, 0, 1));
  const P = mixP3({ az: 220, el: 25, s: 30, O: [548, 480] }, { az: 200, el: 66, s: 34, O: [470, 560] }, v);
  const tArr = AT(k, 1, "eight towards"), tWalk = SS(k, 2), tComp = SS(k, 3), tZero = SS(k, 4), tSum = SS(k, 5);
  const wE = clamp((f - tWalk) / 40, 0, 1), wN = clamp((f - tWalk - 44) / 50, 0, 1);
  const walker: V3 = [6 * wE, 8 * wN, 0];
  const pTip = P.p([6, 8, 0]), p6 = P.p([3, -0.9, 0]), p8 = P.p([6.8, 4, 0]);
  return (
    <Scene>
      <Svg>
        <defs><clipPath id="s07clip"><rect x={80} y={40} width={920} height={780} /></clipPath></defs>
        <g clipPath="url(#s07clip)"><Floor P={P} {...FLOOR} id="s07" o={0.85} /></g>
        <UnitAxes P={P} f={f + 100} t0={0} L={9} />
        {([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as V3[]).map((e, i) => <Arrow3 key={i} P={P} a={[0, 0, 0]} b={[e[0] * 2.4, e[1] * 2.4, e[2] * 2.4]} c={C.second} w={8} head={28} />)}
        <Line3 P={P} a={[0, 0, 0]} b={[6 * wE, 0, 0]} c={C.first} w={6} dash="12 9" />
        <Line3 P={P} a={[6, 0, 0]} b={[6, 8 * wN, 0]} c={C.first} w={6} dash="12 9" o={wN > 0 ? 1 : 0} />
        {f >= tWalk && f < tWalk + 110 ? <circle cx={P.p(walker)[0]} cy={P.p(walker)[1]} r={14} fill={C.gold} stroke={C.bg} strokeWidth={4} /> : null}
        <Lbl x={p6[0]} y={p6[1] + 20} t="6" c={C.first} s={T.calc} a="middle" o={fin(f, tWalk + 30)} />
        <Lbl x={p8[0] + 20} y={p8[1]} t="8" c={C.first} s={T.calc} o={fin(f, tWalk + 80)} />
        <Arrow3 P={P} a={[0, 0, 0]} b={[6, 8, 0]} c={C.first} grow={clamp((f - SS(k, 1)) / 20, 0, 1)} />
        {/* fix 1 (S4): the axes keep their names after the camera turns */}
        {(([[[9.6, 0, 0], "east"], [[0, 9.6, 0], "north"], [[0, 0, 6.4], "up"]]) as [V3, string][]).map(([v, t]) => <Lbl key={t} x={P.p(v)[0]} y={P.p(v)[1] - 26} t={t} c={C.key} s={T.floor} a="middle" />)}
        {(([[[1.3, -1.2, 0], "e₁"], [[-1.2, 1.4, 0], "e₂"], [[1.3, -1.6, 2.6], "e₃"]]) as [V3, string][]).map(([v, t]) => <Lbl key={t} x={P.p(v)[0]} y={P.p(v)[1]} t={t} c={C.second} s={T.key} a="middle" o={t === "e₃" ? 1 - ease(clamp((f - 20) / 20, 0, 1)) : 1} />)}
        <Lbl x={MX} y={170} t="built from e₁, e₂, e₃" c={C.key} s={T.key} o={fin(f, 6) * fout(f, AT(k, 1, "six metres") - 8)} />
        <Lbl x={MX} y={170} t="6 m/s east" c={C.first} s={T.key} o={fin(f, AT(k, 1, "six metres"))} />
        <Lbl x={MX + 330} y={170} t="8 m/s north" c={C.first} s={T.key} o={fin(f, AT(k, 1, "eight towards"))} />
        <Keyword f={f} text="components" at={[MX, 330]} appear={tComp} s={T.key} targets={[[p6[0] + 30, p6[1]], [p8[0] + 40, p8[1] - 30]]} />
        <Lbl x={MX} y={450} t="third component: 0" c={C.key} s={T.key} o={fin(f, tZero)} />
        <Lbl x={MX} y={530} t="no rise or sink" c={C.local} s={T.key} o={fin(f, tZero + 10)} />
      </Svg>
      <TeX s={String.raw`\mathbf u = (6,\ 8,\ 0)\ \text{m/s}`} x={MX} y={250} size={T.key} c={C.first} o={fin(f, tArr + 20)} />
      <TeX s={String.raw`\mathbf u`} x={pTip[0] + 22} y={pTip[1] - 30} size={T.calc} c={C.first} o={fin(f, SS(k, 1) + 20)} />
      <TeX s={rep(rep(rep(EQ_S07, "6\\,", "\\textcolor{#2aa198}{6}\\,"), "8\\,", "\\textcolor{#2aa198}{8}\\,"), "0\\,", "\\textcolor{#2aa198}{0}\\,")} x={MX} y={690} size={T.calc} o={fin(f, tSum)} />
      <TeX s={EQ_S07} x={MX} y={690} size={T.calc} o={0} />
    </Scene>
  );
};

// ================================================================ s08 real components (top view, trig)
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = K("s08_components_real");
  const O: Pt = [520, 470], u = 34;  // 34 px per m/s
  const P = mkP(O[0], O[1], u);
  const ux = D.brest.u18 as number, vy = D.brest.v18 as number;
  const tFrom = SS(k, 1), tTow = SS(k, 2), tQ = SS(k, 3), tSin = SS(k, 4), tU = SS(k, 5), tMin = SS(k, 6), tCos = SS(k, 7), tV = SS(k, 8), tUVW = SS(k, 9), tW = SS(k, 10);
  const a1 = clamp((f - tFrom) / 30, 0, 1), a2 = clamp((f - tTow) / 30, 0, 1);
  const arcPts = (a0: number, a1_: number, r: number) => { const pts: Pt[] = []; for (let i = 0; i <= 40; i++) { const a = (a0 + (a1_ - a0) * i / 40) * Math.PI / 180; pts.push([O[0] + Math.sin(a) * r, O[1] - Math.cos(a) * r]); } return poly(pts); };
  const tip = P(ux, vy);
  const eLeg = clamp((f - tU) / 16, 0, 1), nLeg = clamp((f - tV) / 16, 0, 1);
  return (
    <Scene>
      <Svg>
        <line x1={O[0] - 380} y1={O[1]} x2={O[0] + 380} y2={O[1]} stroke={C.muted} strokeWidth={3} />
        <line x1={O[0]} y1={O[1] + 290} x2={O[0]} y2={O[1] - 400} stroke={C.muted} strokeWidth={3} />
        <Lbl x={O[0] + 400} y={O[1]} t="east" c={C.muted} s={T.floor} />
        <Lbl x={O[0]} y={O[1] - 425} t="north" c={C.muted} s={T.floor} a="middle" />
        <Station p={O} />
        {a1 > 0 ? <path d={arcPts(0, 150 * a1, 140)} fill="none" stroke={C.local} strokeWidth={5} /> : null}
        <Lbl x={O[0] + 150} y={O[1] + 170} t="from 150°" c={C.local} s={T.key} o={fin(f, tFrom + 20)} />
        {a2 > 0 ? <path d={arcPts(150, 150 + 180 * a2, 140)} fill="none" stroke={C.first} strokeWidth={5} /> : null}
        <Lbl x={O[0] - 130} y={O[1] - 120} t="towards 330°" c={C.first} s={T.key} a="end" o={fin(f, tTow + 20)} />
        <Lbl x={O[0] + 210} y={O[1] - 260} t="?" c={C.gold} s={T.hero} o={win(f, tQ, tSin)} />
        <g opacity={eLeg}>
          <line x1={O[0]} y1={O[1] + 14} x2={O[0] + (tip[0] - O[0]) * eLeg} y2={O[1] + 14} stroke={C.neg} strokeWidth={8} strokeDasharray="14 9" />
          <Lbl x={O[0] + (tip[0] - O[0]) / 2} y={O[1] + 56} t="−4.65" c={C.neg} s={T.key} a="middle" />
        </g>
        <Lbl x={O[0] + (tip[0] - O[0]) / 2} y={O[1] + 116} t="− : partly west" c={C.neg} s={T.floor} a="middle" o={fin(f, tMin)} />
        <g opacity={nLeg}>
          <Dash p={[tip[0], O[1]]} q={[tip[0], O[1] + (tip[1] - O[1]) * nLeg]} c={C.first} w={6} />
          <Lbl x={tip[0] - 20} y={tip[1] + 70} t="8.05" c={C.first} s={T.key} a="end" />
        </g>
        <Arrow p={O} q={tip} color={C.first} />
        <Lbl x={tip[0] + 20} y={tip[1] - 26} t="9.3 m/s" c={C.first} s={T.key} />
        <Lbl x={MX} y={500} t="from 150°" c={C.local} s={T.key} o={fin(f, tFrom + 20)} />
        <Lbl x={MX + 290} y={500} t="→ towards 330°" c={C.first} s={T.key} o={fin(f, tTow + 20)} />
      </Svg>
      {/* fix 1 (M7): bold u is the vector; the plain letters u, v, w are its components, named on S9 */}
      <TeX s={String.raw`\mathbf u = (-4.65,\ 8.05,\ 0)\ \text{m/s}`} x={100} y={795} size={48} c={C.key} o={fin(f, tV + 20)} />
      {/* fix 1 (S5): ≤ 3 lines, every line aligned at "=" (east and north before the letters u, v are introduced) */}
      <CalcStack f={f} x={1250} y={110} size={54} maxLines={3} rows={[
        ROW(String.raw`= 9.3\times\sin 330^\circ`, tSin, String.raw`\text{east}`),
        ROW(String.raw`= 9.3\times(-\tfrac{1}{2}) = -4.65\ \text{m/s}`, tU),
        ROW(String.raw`= 9.3\times\cos 330^\circ`, tCos, String.raw`\text{north}`),
        ROW(String.raw`= 9.3\times 0.866 = 8.05\ \text{m/s}`, tV),
      ]} />
      <TeX s={EQ_S08} x={MX - 20} y={120} size={44} o={0} />
      <TeX s={String.raw`(u,\ v,\ w)`} x={MX + 120} y={620} size={T.eq} o={fin(f, tUVW)} />
      <Svg>
        <Keyword f={f} text="east" at={[MX + 60, 760]} appear={AT(k, 9, "u towards")} s={T.floor} targets={[[MX + 170, 660]]} />
        <Keyword f={f} text="north" at={[MX + 230, 760]} appear={AT(k, 9, "v towards")} s={T.floor} targets={[[MX + 280, 660]]} />
        <Keyword f={f} text="up" at={[MX + 420, 760]} appear={AT(k, 9, "w upwards")} s={T.floor} targets={[[MX + 390, 660]]} />
        <Lbl x={MX + 560} y={760} t="w ≈ 0" c={C.local} s={T.key} o={fin(f, tW)} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s09 the up component (column above Brest)
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09_up_component");
  const P = proj3(200, 12, 43, [550, 700]);
  const zP = D.column.z850_m / 1000 * 3.2;  // 1.2 km drawn x ~10 (3.2 units per km)
  const hu: V3 = [P18.u * 0.18, P18.v * 0.18, 0];
  // fix 1 (S6): w is a short stub (still drawn longer than its 0.1 m/s; the bars on the right give the true ratio)
  const wArr = 0.9;
  const tW = AT(k, 1, "ten centimetres"), tX = SS(k, 2), tCl = SS(k, 3);
  const base: V3 = [-2, -3, zP];
  const plane = [[-8, -8, zP], [8, -8, zP], [8, 8, zP], [-8, 8, zP]].map((v) => P.p(v as V3));
  const wTip = P.p(add3(base, [0, 0, wArr]));
  const cloudY = mix(P.p([0, 0, zP])[1] - 40, P.p([0, 0, zP])[1] - 200, clamp((f - tCl) / 80, 0, 1));
  return (
    <Scene>
      <Svg>
        <Floor P={P} x0={-8} x1={8} y0={-8} y1={8} lat={48.448} lon={-4.419} dlat={0.3} dlon={0.45} id="s09" />
        <path d={poly(plane) + "Z"} fill={C.local} fillOpacity={0.22} stroke={C.local} strokeWidth={3} />
        <Line3 P={P} a={[0, 0, 0]} b={[0, 0, zP]} c={C.muted} w={3} dash="8 8" />
        <Lbl x={P.p([0, 0, zP / 2])[0] + 20} y={P.p([0, 0, zP / 2])[1]} t="about 1.2 km" c={C.key} s={T.floor} />
        <Arrow3 P={P} a={base} b={add3(base, hu)} c={C.first} />
        <Lbl x={P.p(add3(base, hu))[0] - 24} y={P.p(add3(base, hu))[1] + 10} t="34 m/s" c={C.first} s={T.key} a="end" />
        <Arrow3 P={P} a={base} b={add3(base, [0, 0, wArr])} c={C.first} w={6} head={22} o={fin(f, 8)} />
        <Lbl x={wTip[0] + 18} y={wTip[1] - 30} t="w" c={C.first} s={T.key} o={fin(f, 8)} />
        <Cloud x={P.p([3, 2, zP])[0]} y={cloudY} s={1.1} o={fin(f, tCl) * 0.9} />
        <Lbl x={P.p([3, 2, zP])[0] + 110} y={cloudY - 30} t="clouds" c={C.key} s={T.key} o={fin(f, tCl + 20)} />
      </Svg>
      <Svg>
        <Keyword f={f} text="the up component" at={[MX, 110]} appear={6} s={T.key} />
        <Lbl x={MX} y={200} t="w ≈ 10 cm/s" c={C.first} s={T.calc} o={fin(f, tW)} />
        <CurvedLink f={f} from={[MX - 20, 220]} to={[wTip[0] + 20, wTip[1] - 10]} start={tW + 10} bend={70} />
        <g opacity={fin(f, tX)}>
          <rect x={MX} y={330} width={700} height={44} fill={C.first} opacity={0.85} />
          <Lbl x={MX} y={290} t="34 m/s" c={C.first} s={T.key} />
          <rect x={MX} y={470} width={Math.max(3, 700 * D.column.w / D.e850.norm18)} height={44} fill={C.first} />
          <Lbl x={MX + 30} y={492} t="0.1 m/s" c={C.first} s={T.key} />
          <Lbl x={MX} y={600} t="> 300 × slower" c={C.gold} s={T.key} />
        </g>
      </Svg>
    </Scene>
  );
};

// ================================================================ s10 magnitude
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_magnitude");
  const t3 = SS(k, 2), tFloor = SS(k, 3), tUp = AT(k, 3, "then up"), tEq = SS(k, 4), tMag = SS(k, 5), tReal = SS(k, 6), tRes = SS(k, 7), tWS = SS(k, 8);
  const v = ease(clamp((f - t3) / 40, 0, 1));
  const P = mixP3({ az: 180, el: 89, s: 46, O: [360, 760] }, { az: 215, el: 22, s: 46, O: [430, 700] }, v);
  const a: V3 = [6, 8, 3 * v];
  const flat = fout(f, tReal, 12);
  return (
    <Scene>
      <Svg>
        <g opacity={flat}>
          {([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as V3[]).map((e, i) => <Line3 key={i} P={P} a={[0, 0, 0]} b={[e[0] * 9.5, e[1] * 10, e[2] * 6]} c={C.muted} w={3} />)}
          <Line3 P={P} a={[0, 0, 0]} b={[6, 0, 0]} c={C.first} w={5} dash="12 9" />
          <Line3 P={P} a={[6, 0, 0]} b={[6, 8, 0]} c={C.first} w={5} dash="12 9" />
          <Lbl x={P.p([3, -0.8, 0])[0]} y={P.p([3, -0.8, 0])[1] + 14} t="6" c={C.first} s={T.key} a="middle" />
          <Lbl x={P.p([6.6, 4, 0])[0] + 14} y={P.p([6.6, 4, 0])[1]} t="8" c={C.first} s={T.key} />
          {v > 0.05 ? <g opacity={v}>
            <Line3 P={P} a={[0, 0, 0]} b={[6, 8, 0]} c={C.ink} w={4} dash="10 8" />
            <Band p={P.p([0, 0, 0])} q={P.p([6, 8, 0])} color={C.gold} o={fin(f, tFloor)} w={16} />
            <Lbl x={P.p([3, 4, 0])[0] - 30} y={P.p([3, 4, 0])[1] + 40} t="floor" c={C.gold} s={T.key} a="end" o={fin(f, tFloor)} />
            <Line3 P={P} a={[6, 8, 0]} b={a} c={C.first} w={5} dash="12 9" />
            <Band p={P.p([6, 8, 0])} q={P.p(a)} color={C.gold} o={fin(f, tUp)} w={16} />
            <Lbl x={P.p([6, 8, 1.5])[0] + 30} y={P.p([6, 8, 1.5])[1]} t="up" c={C.gold} s={T.key} o={fin(f, tUp)} />
          </g> : null}
          <Arrow3 P={P} a={[0, 0, 0]} b={a} c={C.first} />
        </g>
        {/* the real Brest wind, top view, with its two legs (w = 0) */}
        <g opacity={fin(f, tReal + 6)}>
          <line x1={540} y1={640} x2={540 - 330} y2={640} stroke={C.muted} strokeWidth={3} /><line x1={540} y1={640} x2={860} y2={640} stroke={C.muted} strokeWidth={3} />
          <line x1={540} y1={800} x2={540} y2={120} stroke={C.muted} strokeWidth={3} />
          <Lbl x={870} y={610} t="east" c={C.muted} s={T.floor} /><Lbl x={560} y={110} t="north" c={C.muted} s={T.floor} />
          <Dash p={[540, 640 + 14]} q={[540 - 4.65 * 56, 640 + 14]} c={C.neg} w={7} />
          <Lbl x={540 - 4.65 * 28} y={700} t="−4.65" c={C.neg} s={T.key} a="middle" />
          <Dash p={[540 - 4.65 * 56, 640]} q={[540 - 4.65 * 56, 640 - 8.05 * 56]} c={C.first} w={7} />
          <Lbl x={540 - 4.65 * 56 - 20} y={640 - 4.0 * 56} t="8.05" c={C.first} s={T.key} a="end" />
          <Arrow p={[540, 640]} q={[540 - 4.65 * 56, 640 - 8.05 * 56]} color={C.first} />
          <Station p={[540, 640]} />
        </g>
        <g opacity={fin(f, tRes)}>
          <Station p={[1560, 760]} />
          <Lbl x={1600} y={730} t="9.3 m/s" c={C.key} s={T.calc} />
        </g>
        <CurvedLink f={f} from={[1480, 650]} to={[1590, 700]} start={tRes + 30} bend={30} />
      </Svg>
      <CalcStack f={f} x={MX + 110} y={110} size={60} maxLines={2} rows={[
        ROW(String.raw`= \sqrt{6^2 + 8^2} = \sqrt{100} = 10`, SS(k, 1) + 20, String.raw`|\mathbf u|`, { out: tEq }),
      ]} />
      <TeX s={EQ_S10} x={MX} y={300} size={T.eq} o={fin(f, tEq) * fout(f, tReal - 4, 10)} />
      <TeX s={EQ_S10} x={MX} y={260} size={T.calc} o={fin(f, tReal)} />
      <CalcStack f={f} x={MX + 90} y={390} size={54} maxLines={3} rows={[
        ROW(String.raw`= \sqrt{(-4.65)^2 + 8.05^2 + 0^2}`, tReal + 30, String.raw`|\mathbf u|`),
        ROW(String.raw`= \sqrt{86.4}`, tRes),
        ROW(String.raw`\approx 9.30\ \mathrm{m/s}`, tRes + 20),
      ]} />
      <Svg>
        <Keyword f={f} text="magnitude" at={[MX, 520]} appear={tMag} out={tReal - 4} s={T.key} targets={[[MX + 30, 300], [MX + 140, 300]]} />
        <Keyword f={f} text="= wind speed" at={[MX, 790]} appear={tWS} s={T.key} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s11 same arrow, other axes
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_other_axes");
  // fix 1 (M3, M2): Brest low in the frame (S11_BOX), a larger arrow, axis names beyond the arrow tips, component values
  // beside the middle of their shaded projection bands (never at the tips), right column from x 1090
  const P = mapP(S11_BOX), O = P(BGP[0], BGP[1]);
  const px = 10, tip: Pt = [O[0] + P18.u * px, O[1] - P18.v * px];
  const tRot = SS(k, 1), t34 = SS(k, 2), tEN = SS(k, 3), tAC = SS(k, 4), tDep = SS(k, 5), tSame = SS(k, 6), tArrow = SS(k, 7), tSc = SS(k, 8), tMovie = SS(k, 9);
  const rot = 10 * ease(clamp((f - tRot) / 45, 0, 1));
  const r = (deg: number): Pt => [Math.cos(deg * Math.PI / 180), -Math.sin(deg * Math.PI / 180)];
  const ex = r(0), ny = r(90), ea = r(rot), na = r(90 + rot);
  const LH = 330, LV = 400;   // axis lengths (px): east-type, north-type
  const proj = (d: Pt) => { const s = (tip[0] - O[0]) * d[0] + (tip[1] - O[1]) * d[1]; return [O[0] + d[0] * s, O[1] + d[1] * s] as Pt; };
  const mid = (d: Pt) => { const q = proj(d); return [(O[0] + q[0]) / 2, (O[1] + q[1]) / 2] as Pt; };
  const bEN = win(f, tEN, tAC + 6), bAC = fin(f, tAC);
  const SM = P(48.65, -2.03);
  return (
    <Scene>
      <MapView id="s11" B={S11_BOX} L={{ relief: 0.85, coast: 0.8 }} children={() => (
        <g>
          <line x1={O[0]} y1={O[1]} x2={SM[0]} y2={SM[1]} stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" opacity={0.5 + 0.5 * pulse(f, tRot, 30)} />
          <Place p={O} t="Brest" dx={-24} dy={40} a="end" />
        </g>
      )} />
      <Svg>
        <g opacity={fin(f, SS(k, 0))}>
          <Arrow p={O} q={[O[0] + ex[0] * LH, O[1] + ex[1] * LH]} color={C.local} w={6} head={26} />
          <Arrow p={O} q={[O[0] + ny[0] * LV, O[1] + ny[1] * LV]} color={C.local} w={6} head={26} />
          <Lbl x={O[0] + LH + 14} y={O[1]} t="east" c={C.local} s={T.floor} />
          <Lbl x={O[0] + 16} y={O[1] - LV - 6} t="north" c={C.local} s={T.floor} />
        </g>
        <g opacity={fin(f, tRot)}>
          <Arrow p={O} q={[O[0] + ea[0] * LH, O[1] + ea[1] * LH]} color={C.second} w={6} head={26} />
          <Arrow p={O} q={[O[0] + na[0] * LV, O[1] + na[1] * LV]} color={C.second} w={6} head={26} />
          <Lbl x={O[0] + ea[0] * LH} y={O[1] + ea[1] * LH - 44} t="along coast" c={C.second} s={T.floor} a="end" />
          <Lbl x={O[0] + na[0] * LV - 16} y={O[1] + na[1] * LV + 8} t="across" c={C.second} s={T.floor} a="end" />
        </g>
        <g opacity={bEN}>
          <Band p={O} q={proj(ex)} color={C.first} /><Band p={O} q={proj(ny)} color={C.first} />
          <Lbl x={mid(ex)[0]} y={mid(ex)[1] + 46} t="5.8" c={C.first} s={T.key} a="middle" />
          <Lbl x={mid(ny)[0] - 64} y={mid(ny)[1]} t="33.5" c={C.first} s={T.key} a="end" />
        </g>
        <g opacity={bAC}>
          <Band p={O} q={proj(ea)} color={C.first} /><Band p={O} q={proj(na)} color={C.first} />
          <Lbl x={mid(ea)[0] + 20} y={mid(ea)[1] + 48} t="11.5" c={C.first} s={T.key} a="middle" />
          <Lbl x={mid(na)[0] - 40} y={mid(na)[1]} t="32.0" c={C.first} s={T.key} a="end" />
        </g>
        <Arrow p={O} q={tip} color={C.first} w={10 + 4 * pulse(f, tSame, 20)} />
        <Lbl x={tip[0] + 26} y={tip[1] + 12} t="34 m/s" c={C.first} s={T.key} o={fin(f, t34)} />
      </Svg>
      <TeX s={String.raw`\mathbf u`} x={tip[0] + 30} y={tip[1] + 74} size={T.calc} c={C.first} o={fin(f, 6)} />
      <CalcStack f={f} x={1480} y={250} size={60} maxLines={3} rows={[
        ROW(String.raw`(5.8,\ 33.5)`, tEN, String.raw`\text{east, north:}`, { keep: true }),
        ROW(String.raw`(11.5,\ 32.0)`, tAC, String.raw`\text{along, across:}`, { keep: true }),
      ]} />
      <TeX s={EQ_S11} x={1076} y={700} size={44} o={fin(f, tSame + 10)} />
      <Svg>
        <Keyword f={f} text="same arrow, other axes" at={[1090, 110]} appear={6} s={T.key} />
        <Lbl x={1090} y={200} t="along the coast · across it" c={C.second} s={T.floor} o={fin(f, AT(k, 1, "along the coast"))} />
        <Keyword f={f} text="components depend on the axes" at={[1090, 500]} appear={tDep} s={T.floor} />
        <Keyword f={f} text="the arrow itself" at={[1090, 600]} appear={tArrow} s={T.key} />
        <CurvedLink f={f} from={[1076, 610]} to={[mix(O[0], tip[0], 0.45) + 22, mix(O[1], tip[1], 0.45)]} start={tArrow + 8} ctl={[820, 640]} />
        <Keyword f={f} text="length: a scalar" at={[1090, 785]} appear={tSc} s={T.key} />
        <Lbl x={1520} y={785} t="coordinates →" c={C.muted} s={T.floor} o={fin(f, tMovie)} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s12 position vector
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12_position");
  const P = proj3(222, 26, 74, [505, 640]);
  const tO = SS(k, 1), tX = SS(k, 2), tLeg = SS(k, 3), tEq = SS(k, 4), tNum = SS(k, 5);
  const x: V3 = [3, 4, 1.2]; // fix 1 (M8): true scale, 1 unit = 1 km east, north and up
  const drift = 1 - ease(clamp(f / 40, 0, 1));
  const bal = P.p(add3(x, [-1.5 * drift, -1.2 * drift, 0]));
  const legs: [V3, V3, string][] = [[[0, 0, 0], [3, 0, 0], "x₁"], [[3, 0, 0], [3, 4, 0], "x₂"], [[3, 4, 0], x, "x₃"]];
  return (
    <Scene>
      <Svg>
        <Floor P={P} x0={-2} x1={6} y0={-2} y1={6} lat={48.448} lon={-4.419} dlat={0.07} dlon={0.105} id="s12" />
        <Place p={P.p([0, 0, 0])} r={10} />
        <Lbl x={P.p([0, 0, 0])[0] - 20} y={P.p([0, 0, 0])[1] + 34} t="origin" c={C.key} s={T.key} a="end" o={fin(f, tO)} />
        {([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as V3[]).map((e, i) => <Arrow3 key={i} P={P} a={[0, 0, 0]} b={[e[0] * 1.2, e[1] * 1.2, e[2] * 1.2]} c={C.second} w={7} head={24} />)}
        {legs.map(([a, b, t], i) => <g key={t} opacity={fin(f, tLeg + 10 * i)}><Line3 P={P} a={a} b={b} c={C.first} w={5} dash="12 9" />
          <Lbl x={(P.p(a)[0] + P.p(b)[0]) / 2 + (i === 2 ? 24 : 0)} y={(P.p(a)[1] + P.p(b)[1]) / 2 + (i === 2 ? 0 : 38)} t={t} c={C.first} s={T.key} a={i === 2 ? "start" : "middle"} /></g>)}
        <Arrow3 P={P} a={[0, 0, 0]} b={x} c={C.first} grow={clamp((f - tX) / 20, 0, 1)} />

        <BalloonThermometer x={bal[0]} y={bal[1]} s={0.8} />
        <Keyword f={f} text="position vector" at={[MX, 150]} appear={AT(k, 2, "position vector")} s={T.key} />
        <Lbl x={MX} y={470} t="origin: Brest airport" c={C.key} s={T.key} o={fin(f, AT(k, 1, "origin"))} />
      </Svg>
      <TeX s={String.raw`\mathbf x`} x={P.p([1.5, 2, 0.6])[0] - 30} y={P.p([1.5, 2, 0.6])[1] - 40} size={T.calc} ax={1} c={C.first} o={fin(f, tX + 20)} />
      <TeX s={String.raw`\mathbf x = (3,\ 4,\ 1.2)\ \text{km}`} x={MX} y={620} size={T.calc} o={fin(f, tNum)} />
      <TeX s={EQ_S12} x={MX - 30} y={300} size={T.calc} o={fin(f, tEq)} />
    </Scene>
  );
};

// ================================================================ s12a tip to tail: airliner in the jet stream
const JET_BOX: MapBox = { lat0: 30, lat1: 66, lon0: -85, lon1: 13.6, x: 80, y: 40, w: 1100, h: 600 };
const gcPts = (a: [number, number], b: [number, number], n = 60) => {
  const toV = (la: number, lo: number) => [Math.cos(la * Math.PI / 180) * Math.cos(lo * Math.PI / 180), Math.cos(la * Math.PI / 180) * Math.sin(lo * Math.PI / 180), Math.sin(la * Math.PI / 180)];
  const A = toV(...a), B = toV(...b), om = Math.acos(A[0] * B[0] + A[1] * B[1] + A[2] * B[2]);
  return Array.from({ length: n + 1 }, (_, i) => { const t = i / n, s1 = Math.sin((1 - t) * om) / Math.sin(om), s2 = Math.sin(t * om) / Math.sin(om);
    const v = [A[0] * s1 + B[0] * s2, A[1] * s1 + B[1] * s2, A[2] * s1 + B[2] * s2]; return [Math.asin(v[2]) * 180 / Math.PI, Math.atan2(v[1], v[0]) * 180 / Math.PI] as [number, number]; });
};
const S12A: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12a_add_tip_to_tail");
  const P = mapP(JET_BOX);
  const tAir = SS(k, 1), tJet = AT(k, 4, "jet stream"), tW = SS(k, 5), tTip = SS(k, 7), tSum = SS(k, 8), tTT = AT(k, 9, "tip to tail"), tBack = SS(k, 10), tFl = SS(k, 11), tMax = SS(k, 12);
  const route = gcPts([40.64, -73.78], [51.47, -0.45]);
  const back = fin(f, tBack, 16);
  // the arrow strip under the map: 1 px per m/s
  const y0 = 700, x0 = back > 0.5 ? 1000 : 300;
  const slide = ease(clamp((f - tTip) / 14, 0, 1));
  const dir = back > 0.5 ? -1 : 1;
  const air: [Pt, Pt] = [[x0, y0], [x0 + dir * 250, y0]];
  const jetTail: Pt = back > 0.5 ? [x0 + dir * 250, y0] : [mix(x0, x0 + 250, slide), mix(y0 + 70, y0, slide)];
  const jetTip: Pt = [jetTail[0] + 50, jetTail[1]];
  const sumTip: Pt = [x0 + dir * 250 + 50, y0];
  const mid = route[30];
  const mx = D.jet.max;
  return (
    <Scene>
      <MapView id="s12a" B={JET_BOX} L={{ jet: 1, coast: 0 }} children={(Pp) => (
        <g>
          <path d={linesPath(Pp, D.lines.globe_coast_110m)} fill="none" stroke="#ffffff" strokeOpacity={0.95} strokeWidth={3} />
          <Place p={Pp(40.64, -73.78)} t="New York" dx={18} dy={40} r={9} s={T.floor} />
          <Place p={Pp(51.47, -0.45)} t="London" dx={-18} dy={-36} a="end" r={9} s={T.floor} />
          <Winds P={Pp} list={D.jet.arrows} px={0.9} c="#ffffff" w={2.5} head={10} o={0.55} />
          <path d={poly(route.map(([la, lo]) => Pp(la, lo)))} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="12 10" />
          <Plane p={Pp(mid[0], mid[1])} a={back > 0.5 ? 175 : -5} s={1.3} />
          <g opacity={fin(f, tMax)}>
            <circle cx={Pp(mx.lat, mx.lon)[0]} cy={Pp(mx.lat, mx.lon)[1]} r={18} fill="none" stroke={C.gold} strokeWidth={5} />
          </g>
          {f >= tJet ? <ellipse cx={Pp(43, -50)[0]} cy={Pp(43, -50)[1]} rx={220} ry={70} transform={`rotate(-12 ${Pp(43, -50)[0]} ${Pp(43, -50)[1]})`} fill="none" stroke={C.gold} strokeWidth={5} opacity={win(f, tJet, tW + 30)} /> : null}
        </g>
      )} />
      <Svg>
        <ColourBar x={1250} y={520} w={480} lut={LUT_S} lo={0} hi={80} unit="m/s" ticks={[{ v: 0, t: "0" }, { v: 40, t: "40" }, { v: 80, t: "80" }]} o={fin(f, 6) * fout(f, tMax - 10)} />
        <Lbl x={1250} y={470} t="wind 10 km up" c={C.muted} s={T.floor} o={fin(f, 6) * fout(f, tMax - 10)} />
        <Keyword f={f} text="jet stream" at={[P(48, -58)[0], P(48, -58)[1] - 10]} appear={tJet} s={T.key} a="middle" out={tMax - 10} />
        <Lbl x={P(mx.lat, mx.lon)[0] + 30} y={P(mx.lat, mx.lon)[1] + 40} t="about 65 m/s" c={C.gold} s={T.key} o={fin(f, tMax)} />
        <Lbl x={P(mx.lat, mx.lon)[0] + 30} y={P(mx.lat, mx.lon)[1] + 96} t="28 Oct 2026" c={C.key} s={T.floor} o={fin(f, tMax)} />
        {/* the strip */}
        <g>
          <Arrow p={air[0]} q={air[1]} color={C.first} o={fin(f, tAir)} />
          <Lbl x={(air[0][0] + air[1][0]) / 2} y={y0 - 44} t="250" c={C.first} s={T.key} a="middle" o={fin(f, tAir)} />
          <Arrow p={jetTail} q={jetTip} color={C.second} o={fin(f, tW)} />
          <Lbl x={jetTail[0] + 25} y={y0 - 44} t="50" c={C.second} s={T.key} a="middle" o={fin(f, tW)} />
          <Arrow p={[x0, y0 + 60]} q={[back > 0.5 ? x0 - 200 : sumTip[0], y0 + 60]} color={SUMC} o={fin(f, tSum) * (1 - back) + back * fin(f, tBack + 20)} />
          <Lbl x={back > 0.5 ? x0 - 220 : sumTip[0] + 20} y={y0 + 60} t={back > 0.5 ? "200" : "300 m/s"} c={SUMC} s={T.key} a={back > 0.5 ? "end" : "start"} o={fin(f, tSum) * (1 - back) + back * fin(f, tBack + 20)} />
        </g>
        <Keyword f={f} text="tip to tail" at={[1250, 640]} appear={tTT} s={T.key} />
        <Lbl x={1250} y={740} t="east: faster" c={C.key} s={T.floor} o={fin(f, tFl)} />
        <Lbl x={1550} y={740} t="west: slower" c={C.key} s={T.floor} o={fin(f, tFl + 10)} />
      </Svg>
      <CalcStack f={f} x={1490} y={110} size={60} maxLines={2} rows={[
        { rhs: String.raw`= 300\ \text{m/s}`, lhs: "250 + 50", at: tSum, keep: true },
        { rhs: String.raw`= 200\ \text{m/s}`, lhs: "250 - 50", at: tBack + 10 },
      ]} />
      <TeX s={EQ_S12A} x={1250} y={110} size={60} o={0} />
    </Scene>
  );
};

// ================================================================ s12b parallelogram
const S12B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12b_add_parallelogram");
  // fix 1 (M4): the picture fills the zone (2.7 px per m/s: 250 m/s = 675 px), both routes in their own colours
  // (plane p teal, jet q orange), the parallelogram shaded, p and q named on their sentence, the sums in 1060-1840
  const s = 2.7, O: Pt = [330, 790];
  const P = (x: number, y: number): Pt => [O[0] + x * s, O[1] - y * s];
  const tTT = SS(k, 2), tOther = SS(k, 3), tSame = SS(k, 4), tPar = SS(k, 5), tOrder = SS(k, 6), tComp = SS(k, 7), tNum = SS(k, 8), tPy = SS(k, 9), tOcean = SS(k, 10), tBuoy = SS(k, 11);
  const plane = P(0, 250), jet = P(50, 0), sum = P(50, 250);
  const g1 = clamp((f - tTT) / 14, 0, 1), g2 = clamp((f - tOther) / 30, 0, 1);
  const dB: Pt = [730, 690];
  const named = fin(f, AT(k, 6, "Calling"));
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, tPar)}><path d={poly([O, jet, sum, plane]) + "Z"} fill="#e8ecf4" fillOpacity={0.16} stroke={C.gold} strokeWidth={3} strokeOpacity={0.7} /></g>
        <Plane p={[O[0] - 90, O[1] - 580]} a={90} s={1.3} o={fin(f, 4)} />
        {/* route 1: plane first, then the jet (tip to tail) */}
        <Arrow p={O} q={plane} color={C.first} o={fin(f, 4)} />
        <Arrow p={plane} q={P(50 * g1, 250)} color={C.second} o={g1 > 0 ? 1 : 0} />
        {/* route 2: the jet first, then the plane */}
        <Arrow p={O} q={jet} color={C.second} o={fin(f, 10)} />
        <Arrow p={jet} q={P(50, 250 * g2)} color={C.first} o={g2 > 0 ? 1 : 0} dash="18 10" />
        <Arrow p={O} q={sum} color={SUMC} o={fin(f, tTT + 16)} />
        <Ring p={sum} o={win(f, tSame, tPar + 20)} />
        <Lbl x={O[0] - 24} y={O[1] - 200} t="250" c={C.first} s={T.key} a="end" o={fin(f, 4)} />
        <Lbl x={(O[0] + jet[0]) / 2 + 100} y={O[1] - 6} t="50" c={C.second} s={T.key} a="start" o={fin(f, 10)} />
        <Lbl x={sum[0] + 30} y={sum[1] + 6} t="sum" c={SUMC} s={T.key} o={fin(f, tTT + 16) * (1 - named)} />
        <Keyword f={f} text="parallelogram" at={[MX, 560]} appear={tPar} s={T.key} />
        <Keyword f={f} text="wind across the path" at={[MX, 110]} appear={6} out={tComp - 10} s={T.key} />
        <Lbl x={MX} y={210} t="plane: 250 m/s north" c={C.first} s={T.key} o={fin(f, AT(k, 1, "two hundred and fifty")) * fout(f, tComp - 10)} />
        <Lbl x={MX} y={300} t="jet: 50 m/s east" c={C.second} s={T.key} o={fin(f, AT(k, 1, "blows east")) * fout(f, tComp - 10)} />
        {/* ocean inset: drifting buoy */}
        <g opacity={fin(f, tOcean)}>
          <path d={`M 610 560 Q 730 530 860 560 T 1000 560 L 1000 790 L 610 790 Z`} fill="#1f4d78" opacity={0.6} />
          <circle cx={dB[0]} cy={dB[1]} r={14} fill={C.gold} stroke={C.bg} strokeWidth={3} />
          <Arrow p={dB} q={[dB[0] + 170, dB[1]]} color={C.first} w={8} head={28} />
          <Arrow p={[dB[0] + 170, dB[1]]} q={[dB[0] + 170, dB[1] - 70]} color={C.second} w={8} head={28} />
          <Arrow p={dB} q={[dB[0] + 170, dB[1] - 70]} color={SUMC} w={8} head={28} o={fin(f, tBuoy + 20)} />
          <Lbl x={dB[0] - 20} y={dB[1] - 60} t="drifting buoy" c={C.key} s={T.floor} a="end" o={fin(f, tBuoy)} />
          <Lbl x={dB[0] + 90} y={dB[1] + 44} t="current" c={C.first} s={T.floor} a="middle" o={fin(f, AT(k, 11, "the current"))} />
          <Lbl x={dB[0] + 150} y={dB[1] - 96} t="wind drift" c={C.second} s={T.floor} a="end" o={fin(f, AT(k, 11, "wind drift"))} />
        </g>
      </Svg>
      <TeX s={String.raw`\mathbf p`} x={O[0] - 30} y={(O[1] + plane[1]) / 2 - 30} size={T.calc} ax={1} c={C.first} o={named} />
      <TeX s={String.raw`\mathbf q`} x={(plane[0] + sum[0]) / 2} y={plane[1] - 50} size={T.calc} ax={0.5} c={C.second} o={named} />
      <TeX s={String.raw`\mathbf p + \mathbf q`} x={sum[0] + 30} y={sum[1] + 50} size={T.key} c={SUMC} o={named} />
      <TeX s={String.raw`\mathbf p + \mathbf q = \mathbf q + \mathbf p`} x={MX} y={665} size={T.calc} o={fin(f, AT(k, 6, "that's p plus q"))} />
      <CalcStack f={f} x={1290} y={130} size={52} maxLines={3} rows={[
        ROW(String.raw`= (0,\,250) + (50,\,0)`, tComp + 10, String.raw`\mathbf p + \mathbf q`),
        ROW(String.raw`= (0 + 50,\ 250 + 0)`, tNum + 10),
        ROW(String.raw`= (50,\,250)`, tNum + 60),
        ROW(String.raw`= \sqrt{50^2 + 250^2} \approx 255\ \text{m/s}`, tPy + 10, String.raw`|\mathbf p + \mathbf q|`),
      ]} />
      <TeX s={EQ_S12B} x={MX} y={560} size={52} o={0} />
    </Scene>
  );
};

// ================================================================ s12c forces on a parcel (easy numbers, ×10⁻⁴ m s⁻²)
const S12C: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12c_add_forces");
  const O: Pt = [560, 560], s = 22;
  const P = (x: number, y: number): Pt => [O[0] + x * s, O[1] - y * s];
  const tPr = SS(k, 2), tCo = SS(k, 3), tFr = SS(k, 4), tAdd = SS(k, 5), tE = SS(k, 6), tN = SS(k, 7), tTri = SS(k, 8), tBal = SS(k, 9), tCross = SS(k, 10);
  // fix 1 (M5): every push's components appear at its arrow on the words that say them; the unit rides on the first one
  const nPr = AT(k, 2, "twelve point five"), nCo = AT(k, 3, "six and minus eight"), nFr = AT(k, 4, "minus six"), tApp = AT(k, 3, "apparent");
  const sl = ease(clamp((f - tAdd) / 30, 0, 1));
  const pr: Pt = [0, 12.5], co: Pt = [6, -8], fr: Pt = [-6, -4.5];
  const coT: Pt = [pr[0] * sl, pr[1] * sl], frT: Pt = [(pr[0] + co[0]) * sl, (pr[1] + co[1]) * sl];
  const coTip = P(coT[0] + co[0], coT[1] + co[1]), frTip = P(frT[0] + fr[0], frT[1] + fr[1]);
  const wind = P(8 * 1.6, 6 * 1.6);
  return (
    <Scene>
      <Svg>
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={100} x2={980} y1={130 + i * 160} y2={130 + i * 160} stroke={C.muted} strokeWidth={3} opacity={0.5} />)}
        <LowMark p={[560, 80]} s={80} />
        <Lbl x={980} y={110} t="isobars" c={C.muted} s={T.floor} a="end" o={fin(f, 6)} />
      </Svg>
      {/* fix 1 (M10): the air parcel is the movie's three.js box (same as s21 and s23) */}
      <ParcelBox3D p={O} size={130} o={fin(f, 4)} />
      <Svg>
        <Lbl x={O[0] + 74} y={O[1] + 64} t="air parcel" c={C.key} s={T.floor} o={fin(f, AT(k, 1, "air parcel"))} />
        <Arrow p={O} q={wind} color={C.first} o={fin(f, SS(k, 1))} />
        <Lbl x={wind[0] + 16} y={wind[1] - 20} t="wind" c={C.first} s={T.key} o={fin(f, SS(k, 1))} />
        <Arrow p={O} q={P(...pr)} color={C.second} o={fin(f, tPr)} />
        <Lbl x={P(...pr)[0] - 24} y={P(...pr)[1] + 50} t="pressure" c={C.second} s={T.floor} a="end" o={fin(f, tPr) * fout(f, tAdd)} />
        <Arrow p={P(...coT)} q={coTip} color={VIOLET} o={fin(f, tCo)} />
        <Lbl x={coTip[0] + 20} y={coTip[1] - 20} t="Coriolis" c={VIOLET} s={T.floor} o={fin(f, tCo)} />
        <Lbl x={coTip[0] + 20} y={coTip[1] + 34} t="(6, −8)" c={VIOLET} s={T.floor} o={fin(f, nCo)} />
        <Arrow p={P(...frT)} q={frTip} color={C.neg} dash="16 10" o={fin(f, tFr)} />
        <Lbl x={frTip[0] - 60} y={frTip[1] + 10} t="− friction" c={C.neg} s={T.floor} a="end" o={fin(f, tFr)} />
        <Lbl x={frTip[0] - 60} y={frTip[1] + 62} t="(−6, −4.5)" c={C.neg} s={T.floor} a="end" o={fin(f, nFr)} />
        <Ring p={O} o={win(f, tTri, tBal + 20)} r={34} />
        <Keyword f={f} text="forces add too" at={[MX, 110]} appear={6} out={tApp - 10} s={T.key} />
        <Keyword f={f} text="apparent push (spinning Earth)" at={[MX, 110]} appear={tApp} s={T.floor} c={VIOLET} />
        <Keyword f={f} text="balance" at={[MX, 640]} appear={tBal} s={T.key} />
        <Keyword f={f} text="across the isobars, towards the low" at={[MX, 760]} appear={tCross} s={T.floor} />
        <path d={(() => { const pts: Pt[] = []; const a1 = Math.atan2(6, 8); for (let i = 0; i <= 20; i++) { const a = a1 * i / 20; pts.push([O[0] + Math.cos(a) * 150, O[1] - Math.sin(a) * 150]); } return poly(pts); })()}
          fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tCross)} />
      </Svg>
      <TeX s={String.raw`(0,\ 12.5)\times10^{-4}\ \text{m/s}^2`} x={P(...pr)[0] - 24} y={P(...pr)[1] + 110} size={T.floor} ax={1} c={C.second}
        o={fin(f, nPr) * fout(f, tAdd)} />
      <TeX s={String.raw`(0,\ 12.5)`} x={P(0, 6)[0] - 24} y={P(0, 6)[1]} size={T.floor} ax={1} c={C.second} o={fin(f, tAdd)} />
      <CalcStack f={f} x={MX + 170} y={220} size={T.calc} maxLines={2} rows={[
        ROW(String.raw`0 + 6 - 6 = 0`, tE + 10, String.raw`\text{east:}`, { keep: true }),
        ROW(String.raw`12.5 - 8 - 4.5 = 0`, tN + 10, String.raw`\text{north:}`, { keep: true }),
      ]} />
      <TeX s={EQ_S12C} x={1064} y={480} size={44} o={fin(f, tTri)} />
    </Scene>
  );
};

// ================================================================ s12d real wind = geostrophic + ageostrophic
/** fix 1 (M6): value tags on chosen isobars, at the middle of each level's longest piece inside the frame (dark text on a
 * light halo, readable on cloud) */
const IsoTag: React.FC<{ P: Proj; B: MapBox; levels: { level: number; lines: number[][] }[]; pick: number[]; unit?: number; o?: number }> = ({
  P, B, levels, pick, unit, o = 1 }) => {
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      {levels.filter((L) => pick.includes(L.level)).map((L, kk) => {
        let best: Pt | null = null, bestN = 0;
        L.lines.forEach((ln) => {
          const inside: Pt[] = [];
          for (let i = 0; i < ln.length; i += 2) { const p = P(ln[i + 1], ln[i]); if (p[0] > B.x + 60 && p[0] < B.x + B.w - 90 && p[1] > B.y + 50 && p[1] < B.y + B.h - 50) inside.push(p); }
          if (inside.length > bestN) { bestN = inside.length; best = inside[Math.floor(inside.length * [0.5, 0.22, 0.78][kk % 3])]; }
        });
        if (!best) return null;
        const p = best as Pt, t = `${L.level}${L.level === unit ? " hPa" : ""}`;
        return <text key={L.level} x={p[0]} y={p[1]} fill="#1a2236" fontSize={T.floor} fontWeight={750} fontFamily="'Segoe UI', Arial, sans-serif" textAnchor="middle"
          dominantBaseline="central" stroke="#f4f6fb" strokeWidth={9} strokeLinejoin="round" paintOrder="stroke">{t}</text>;
      })}
    </g>
  );
};
const GEO_BOX: MapBox = crop({ lat0: 44, lat1: 52, lon0: -12.7, lon1: 0.7, x: 80, y: 40, w: 920, h: 820 });
const S12D: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12d_add_geostrophic");
  const P = mapP(GEO_BOX), sp = ST.sea_pt, O = P(sp.lat, sp.lon), px = 7;
  const tIso = AT(k, 1, "isobars"), tHpa = SS(k, 2), tGeo = SS(k, 3), tGeoN = SS(k, 4), tGn = SS(k, 5), tReal = SS(k, 6), tAg = SS(k, 7), tSum = SS(k, 8), tLarge = SS(k, 9), tWhy = SS(k, 10);
  const g = P(sp.lat + sp.vg * px / (GEO_BOX.h / (GEO_BOX.lat1 - GEO_BOX.lat0)), sp.lon); void g;
  const gt: Pt = [O[0] + sp.ug * px, O[1] - sp.vg * px], rt: Pt = [O[0] + sp.u10 * px, O[1] - sp.v10 * px];
  const t18 = ST.track.find((x: { t: string }) => x.t.endsWith("01T18"));
  return (
    <Scene>
      <MapView id="s12d" B={GEO_BOX} L={{ tc: 1, coast: 0.7 }} children={(Pp) => (
        <g>
          <Iso P={Pp} levels={ST.isobars["2023-11-01T18"]} c="#f4f6fb" w={9} o={0.7 * fin(f, tIso)} />
          <Iso P={Pp} levels={ST.isobars["2023-11-01T18"]} c="#1a2236" w={4} o={fin(f, tIso)} />
          <IsoTag P={Pp} B={GEO_BOX} levels={ST.isobars["2023-11-01T18"]} pick={[968, 972]} unit={972} o={fin(f, tHpa)} />
          <LowMark p={Pp(t18.lat, t18.lon)} />
          <Place p={Pp(BREST[0], BREST[1])} t="Brest" dx={14} dy={-34} />
          <g opacity={0.45 * fin(f, tSum)}>
            {(ST.neighbours as number[][]).map((r, i) => { const o = Pp(r[0], r[1]); const a: Pt = [o[0] + r[2] * 3, o[1] - r[3] * 3], b: Pt = [o[0] + r[4] * 3, o[1] - r[5] * 3];
              return <g key={i}><Arrow p={o} q={a} color={C.second} w={4} head={14} /><Arrow p={o} q={b} color={C.first} w={4} head={14} /><Arrow p={a} q={b} color={SUMC} w={3} head={12} /></g>; })}
          </g>
          <circle cx={O[0]} cy={O[1]} r={9} fill={C.gold} stroke={C.bg} strokeWidth={3} />
          <Arrow p={O} q={gt} color={C.second} o={fin(f, tGeo)} />
          <Arrow p={O} q={rt} color={C.first} o={fin(f, tReal)} />
          <Arrow p={gt} q={rt} color={SUMC} o={fin(f, tAg)} />
        </g>
      )} />
      <Svg>
        <Lbl x={MX} y={790} t="Storm Ciarán · 1 Nov, 6 pm UTC" c={C.muted} s={T.floor} o={fin(f, 6)} />
        <Keyword f={f} text="isobars" at={[MX, 110]} appear={tIso} s={T.key} />
        <Keyword f={f} text="hectopascal (hPa)" at={[MX + 240, 110]} appear={tHpa} s={T.key} />
        <Lbl x={MX} y={230} t="geostrophic" c={C.second} s={T.key} o={fin(f, tGeoN)} />
        <Lbl x={MX + 360} y={230} t="(30.9, 24.9)" c={C.second} s={T.key} o={fin(f, tGn)} />
        <Lbl x={MX} y={320} t="real, 10 m" c={C.first} s={T.key} o={fin(f, tReal)} />
        <Lbl x={MX + 360} y={320} t="(10.0, 18.0)" c={C.first} s={T.key} o={fin(f, tReal + 20)} />
        <Lbl x={MX} y={410} t="ageostrophic" c={SUMC} s={T.key} o={fin(f, tAg)} />
        <Lbl x={MX + 360} y={410} t="(−20.9, −6.9)" c={SUMC} s={T.key} o={fin(f, tLarge)} />
        <Keyword f={f} text="friction" at={[MX, 700]} appear={AT(k, 10, "Friction")} s={T.key} />
        <Keyword f={f} text="tight curve" at={[MX + 260, 700]} appear={AT(k, 10, "tight curve")} s={T.key} />
        <Lbl x={MX + 360} y={470} t="m/s" c={C.muted} s={T.floor} o={fin(f, tLarge)} />
      </Svg>
      <TeX s={EQ_S12D} x={MX} y={550} size={T.eq} o={fin(f, tSum)} />
      {void tWhy}
    </Scene>
  );
};

// ================================================================ s12e subtraction defined
const S12E: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12e_subtract_def");
  const u = 90, O: Pt = [330, 520];
  const P = mkP(O[0], O[1], u);
  const tNeg = AT(k, 1, "minus q"), tSub = SS(k, 2), tPic = SS(k, 4), tFrom = SS(k, 5), tCheck = SS(k, 6), tNum = SS(k, 7);
  const add = clamp((f - tSub) / 30, 0, 1) * fout(f, tPic, 12);
  const pic = fin(f, tPic);
  return (
    <Scene>
      <Svg>
        {Array.from({ length: 9 }, (_, i) => <line key={`v${i}`} x1={P(i - 2, -3)[0]} x2={P(i - 2, -3)[0]} y1={P(0, 4)[1]} y2={P(0, -3.4)[1]} stroke={C.grid} strokeWidth={1.5} />)}
        {Array.from({ length: 8 }, (_, i) => <line key={`h${i}`} y1={P(0, i - 3)[1]} y2={P(0, i - 3)[1]} x1={P(-2, 0)[0]} x2={P(6.4, 0)[0]} stroke={C.grid} strokeWidth={1.5} />)}
        <Arrow p={O} q={P(5, 1)} color={C.first} />
        <Lbl x={P(5, 1)[0] + 20} y={P(5, 1)[1] - 10} t="p" c={C.first} s={T.calc} />
        <Arrow p={O} q={P(1, 3)} color={C.second} o={1 - 0.6 * add} />
        <Lbl x={P(1, 3)[0] - 20} y={P(1, 3)[1] - 20} t="q" c={C.second} s={T.calc} a="end" />
        <Arrow p={O} q={P(-1, -3)} color={C.neg} dash="16 10" o={fin(f, tNeg) * fout(f, tPic)} />
        <Lbl x={P(-1, -3)[0] - 20} y={P(-1, -3)[1]} t="−q" c={C.neg} s={T.calc} a="end" o={fin(f, tNeg) * fout(f, tPic)} />
        <g opacity={add}>
          <Arrow p={P(5, 1)} q={P(4, -2)} color={C.neg} dash="16 10" />
          <Arrow p={O} q={P(4, -2)} color={SUMC} />
          <Lbl x={P(4, -2)[0] + 20} y={P(4, -2)[1] + 20} t="p + (−q)" c={SUMC} s={T.key} />
        </g>
        <g opacity={pic}>
          <Arrow p={P(1, 3)} q={P(5, 1)} color={SUMC} />
          <Lbl x={P(3, 2)[0] + 10} y={P(3, 2)[1] - 50} t="p − q" c={SUMC} s={T.key} />
          <Keyword f={f} text="from the tip of q to the tip of p" at={[150, 790]} appear={tFrom} s={T.floor} />
          <Ring p={P(5, 1)} o={win(f, tCheck, tNum + 20)} />
        </g>
      </Svg>
      <CalcStack f={f} x={MX + 330} y={160} size={T.calc} maxLines={3} rows={[
        ROW(String.raw`= \mathbf p + (-\mathbf q)`, tSub, String.raw`\mathbf p - \mathbf q`, { keep: true }),
        ROW(String.raw`= \mathbf p`, tCheck + 10, String.raw`\mathbf q + (\mathbf p - \mathbf q)`, { keep: true }),
        ROW(String.raw`= (4,\,-2)`, tNum + 20, String.raw`(5,1) - (1,3)`, { keep: true }),
      ]} />
      <TeX s={EQ_S12E} x={1070} y={640} size={44} o={0} />
      <TeX s={String.raw`-\mathbf q = (-q_1,\ -q_2)`} x={MX + 60} y={560} size={T.calc} c={C.neg} o={fin(f, AT(k, 1, "sign flipped"))} />
      <Svg><Keyword f={f} text="negative of a vector" at={[MX + 60, 480]} appear={AT(k, 1, "negative")} s={T.key} /></Svg>
    </Scene>
  );
};

// ================================================================ s12f the wind's change in one hour (map animation)
const S12F: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12f_subtract_hour");
  const P = mapP(BR_BOX), O = P(BGP[0], BGP[1]), px = 8;
  const t17 = SS(k, 1), t18 = SS(k, 2), tQ = SS(k, 3), tE = SS(k, 5), tN = SS(k, 6), tCh = SS(k, 7), tKw = SS(k, 8);
  const h = clamp((f - t18) / 120, 0, 1); // the clock runs 17 -> 18 UTC during sentence 2
  const a17: Pt = [O[0] + P17.u * px, O[1] - P17.v * px], a18: Pt = [O[0] + P18.u * px, O[1] - P18.v * px];
  return (
    <Scene>
      <MapView id="s12f" B={BR_BOX} L={{ t850: [{ h: 17, o: 1 - h }, { h: 18, o: h }], coast: 0.8 }} children={(Pp) => (
        <g>
          <Iso P={Pp} levels={D.e850.t850["17"].iso} o={0.7 * (1 - h)} w={2} />
          <Iso P={Pp} levels={D.e850.t850["18"].iso} o={0.7 * h} w={2} />
          <Place p={O} r={10} />
        </g>
      )} />
      <Svg>
        <g opacity={fin(f, 6)}><ClockGlyph x={940} y={770} r={40} h={5 + h} /><Lbl x={880} y={770} t={h < 0.5 ? "5 pm UTC" : "6 pm UTC"} c={C.key} s={T.key} a="end" /></g>
        <Arrow p={O} q={a17} color={C.first} o={fin(f, t17) * (1 - 0.55 * h)} />
        <Lbl x={a17[0] + 20} y={a17[1] + 10} t="5 pm" c={C.first} s={T.floor} o={fin(f, t17) * (1 - 0.4 * h)} />
        <Arrow p={O} q={a18} color={C.first} o={fin(f, t18 + 20) * h} />
        <Lbl x={a18[0] + 20} y={a18[1] - 20} t="6 pm" c={C.first} s={T.floor} o={fin(f, t18 + 20) * h} />
        <Arrow p={a17} q={a18} color={SUMC} w={8} head={32} o={fin(f, tCh)} />
        <Lbl x={a18[0] - 40} y={(a17[1] + a18[1]) / 2} t="change" c={SUMC} s={T.key} a="end" o={fin(f, tCh)} />
        <CurvedLink f={f} from={[(a17[0] + a18[0]) / 2 + 30, (a17[1] + a18[1]) / 2 + 30]} to={[1056, 500]} start={tCh + 20} bend={-80} />
        <Lbl x={MX} y={600} t="temperature, 1.2 km up" c={C.muted} s={T.floor} o={fin(f, 6)} />
        <ColourBar x={MX} y={630} w={560} lut={LUT_T} lo={-6} hi={16} unit="°C" ticks={[{ v: -4, t: "−4" }, { v: 4, t: "4" }, { v: 12, t: "12" }]} o={fin(f, 6)} />
        <Lbl x={MX} y={110} t="(7.6, 23.3)" c={C.first} s={T.key} o={fin(f, AT(k, 1, "seven point six"))} />
        <Lbl x={MX + 330} y={110} t="5 pm UTC" c={C.muted} s={T.floor} o={fin(f, AT(k, 1, "seven point six"))} />
        <Lbl x={MX} y={190} t="(5.8, 33.5)" c={C.first} s={T.key} o={fin(f, AT(k, 2, "five point eight"))} />
        <Lbl x={MX + 330} y={190} t="6 pm UTC" c={C.muted} s={T.floor} o={fin(f, AT(k, 2, "five point eight"))} />
        <Keyword f={f} text="stronger" at={[MX, 780]} appear={AT(k, 8, "stronger")} s={T.key} />
        <Keyword f={f} text="swung north" at={[MX + 260, 780]} appear={AT(k, 8, "swung")} s={T.key} />
      </Svg>
      <CalcStack f={f} x={1300} y={270} size={60} maxLines={2} rows={[
        ROW(String.raw`5.8 - 7.6 = -1.8`, tE + 10, String.raw`\text{east:}`, { keep: true }),
        ROW(String.raw`33.5 - 23.3 = 10.2`, tN + 10, String.raw`\text{north:}`, { keep: true }),
      ]} />
      <TeX s={rep(EQ_S12F, String.raw`\ \mathrm{m\,s^{-1}}`, "")} x={1066} y={500} size={44} o={fin(f, tCh + 30)} />
      {void tQ}{void tKw}
    </Scene>
  );
};

// ================================================================ s12g wind shear and the hodograph (Trappes sounding)
const S12G: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12g_shear_hodograph");
  const P3c = proj3(215, 14, 30, [270, 770]);
  const tBal = SS(k, 1), tHod = SS(k, 2), t850 = SS(k, 4), t500 = SS(k, 5), tSh = SS(k, 6), tPic = SS(k, 7), tCw = SS(k, 8), tWarm = SS(k, 9);
  const lv = SN.levels as { p: number; z: number; u: number; v: number }[];
  const zs = 0.0036; // world units per metre (×10 vertical relative to the arrows, illustrative)
  const rise = clamp((f - tBal) / (tHod + 90 - tBal), 0, 1) * 5600;
  const H: Pt = [560, 740], hs = 22;
  const hp = (u: number, v: number): Pt => [H[0] + u * hs, H[1] - v * hs];
  const shown = lv.filter((l) => l.z <= rise + 1);
  const b850 = lev(850), b500 = lev(500);
  return (
    <Scene>
      <Svg>
        {/* column (left) */}
        <path d={poly([[-5, -5, 0], [5, -5, 0], [5, 5, 0], [-5, 5, 0]].map((v) => P3c.p(v as V3))) + "Z"} fill="#2a3a55" stroke={C.grid} strokeWidth={2} />
        <Line3 P={P3c} a={[0, 0, 0]} b={[0, 0, 5800 * zs]} c={C.muted} w={3} dash="6 8" />
        {shown.map((l) => { const a: V3 = [0, 0, l.z * zs]; const bold = l.p === 850 || l.p === 500;
          return <Arrow3 key={l.p} P={P3c} a={a} b={add3(a, [l.u * 0.3, l.v * 0.3, 0])} c={C.first} w={bold ? 8 : 5} head={bold ? 26 : 18} />; })}
        <Sonde p={P3c.p([0, 0, Math.min(rise, 5600) * zs])} s={0.9} o={fin(f, tBal)} />
        <Lbl x={P3c.p([0, 0, b850.z * zs])[0] - 20} y={P3c.p([0, 0, b850.z * zs])[1]} t="850 hPa" c={C.key} s={T.floor} a="end" o={fin(f, t850)} />
        <Lbl x={P3c.p([0, 0, b500.z * zs])[0] - 20} y={P3c.p([0, 0, b500.z * zs])[1]} t="500 hPa" c={C.key} s={T.floor} a="end" o={fin(f, t500)} />
        <Lbl x={110} y={90} t="Trappes · 00 UTC 1 Nov" c={C.key} s={T.floor} o={fin(f, tBal)} />
        {/* hodograph (right of the picture zone) */}
        <g opacity={fin(f, tHod - 20)}>
          <line x1={H[0]} y1={H[1]} x2={hp(19, 0)[0]} y2={H[1]} stroke={C.muted} strokeWidth={3} />
          <line x1={H[0]} y1={H[1]} x2={H[0]} y2={hp(0, 13)[1]} stroke={C.muted} strokeWidth={3} />
          {[5, 10, 15].map((v) => <g key={v}><line x1={hp(v, 0)[0]} x2={hp(v, 0)[0]} y1={H[1]} y2={H[1] + 10} stroke={C.muted} strokeWidth={3} />
            <Lbl x={hp(v, 0)[0]} y={H[1] + 36} t={String(v)} c={C.muted} s={52} a="middle" b={false} /></g>)}
          {[5, 10].map((v) => <g key={`v${v}`}><line x1={H[0] - 10} x2={H[0]} y1={hp(0, v)[1]} y2={hp(0, v)[1]} stroke={C.muted} strokeWidth={3} />
            <Lbl x={H[0] - 16} y={hp(0, v)[1]} t={String(v)} c={C.muted} s={52} a="end" b={false} /></g>)}
          <Lbl x={hp(19, 0)[0] + 10} y={H[1] - 30} t="east" c={C.muted} s={T.floor} a="end" />
          <Lbl x={H[0] + 14} y={hp(0, 13)[1] - 10} t="north" c={C.muted} s={T.floor} />
        </g>
        {shown.map((l) => <Arrow key={`h${l.p}`} p={H} q={hp(l.u, l.v)} color={C.first} w={l.p === 850 || l.p === 500 ? 8 : 4} head={l.p === 850 || l.p === 500 ? 26 : 14}
          o={fin(f, tHod) * (l.p === 850 || l.p === 500 ? 1 : 0.55)} />)}
        <path d={poly(shown.map((l) => hp(l.u, l.v)))} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, AT(k, 3, "Joining"))} />
        <Lbl x={hp(b850.u, b850.v)[0] - 10} y={hp(b850.u, b850.v)[1] - 34} t="850" c={C.first} s={T.floor} a="end" o={fin(f, t850)} />
        <Lbl x={hp(b500.u, b500.v)[0] + 14} y={hp(b500.u, b500.v)[1] + 30} t="500" c={C.first} s={T.floor} o={fin(f, t500)} />
        <Arrow p={hp(b850.u, b850.v)} q={hp(b500.u, b500.v)} color={SUMC} w={8} head={30} o={fin(f, tPic)} />
        <Keyword f={f} text="wind shear" at={[MX, 660]} appear={AT(k, 0, "wind shear")} s={T.key} />
        <Lbl x={MX + 290} y={660} t="change with height" c={C.key} s={T.floor} o={fin(f, AT(k, 0, "changes with height"))} />
        <Keyword f={f} text="hodograph" at={[620, 160]} appear={AT(k, 3, "hodograph")} s={T.key} />
        <Lbl x={620} y={250} t="clockwise going up" c={C.key} s={T.floor} o={fin(f, tCw)} />
        <Lbl x={620} y={310} t="(seen from above)" c={C.muted} s={T.floor} o={fin(f, tCw)} />
        <Keyword f={f} text="warm air carried in" at={[MX, 760]} appear={tWarm} s={T.key} />
      </Svg>
      <CalcStack f={f} x={MX + 190} y={130} size={56} maxLines={3} rows={[
        ROW(String.raw`= (13.9,\ 9.8)`, AT(k, 4, "thirteen point nine"), String.raw`\mathbf u_{850}`, { keep: true }),
        ROW(String.raw`= (16.4,\ 4.4)`, AT(k, 5, "sixteen point four"), String.raw`\mathbf u_{500}`, { keep: true }),
        ROW(String.raw`= (2.5,\,-5.4)`, tSh + 20, String.raw`\text{shear}`, { keep: true }),
        ROW(String.raw`\approx 6\ \text{m/s}`, AT(k, 6, "about six"), String.raw`|\text{shear}|`, { keep: true }),
      ]} />
      <TeX s={EQ_S12G} x={MX} y={560} size={52} o={fin(f, tPic)} />
    </Scene>
  );
};

// ================================================================ s12h climate anomaly (tropical Pacific, November)
// fix 1 (M13, M2): one map at a time, full width, cropped to the central/east Pacific (165° E – 125° W, 20° S – 20° N) so
// the arrows are 2–3× longer; the three stages cross-fade on their sentences with labelled thumbnails below; a reference
// arrow per stage (the anomaly map uses a larger scale, with its own reference arrow); gold links from the box to the
// numbers −5.0, −3.7 and +1.3 in the subtraction.
const PAC = { lat0: -20, lat1: 20, lon0: 165, lon1: 235 };
const PAC_STAGE = [
  { col: 2, c: C.local, px: 10, ref: 5, name: "November average, 1991–2020" },
  { col: 4, c: C.first, px: 10, ref: 5, name: "November 2023" },
  { col: 6, c: SUMC, px: 26, ref: 2, name: "2023 − average" },
];
const PacMap: React.FC<{ B: MapBox; stage: number; o?: number; id: string; box?: number; small?: boolean; glide?: number }> = ({
  B, stage, o = 1, id, box = 0, small = false, glide }) => {
  if (o <= 0) return null;
  const P = mapP(B), S = PAC_STAGE[stage], sc = B.w / 920;
  const coast = (D.lines.globe_coast_110m as number[][]).map((ln) => ln.map((v, i) => (i % 2 === 0 ? (v < 0 ? v + 360 : v) : v)));
  const g = (AN.grid as number[][]).filter((r) => r[1] >= PAC.lon0 && r[1] <= PAC.lon1 && r[0] >= PAC.lat0 && r[0] <= PAC.lat1);
  const bx0 = P(5, 190), bx1 = P(-5, 210);
  return (
    <Svg o={o}>
      <defs><clipPath id={`pc_${id}`}><rect x={B.x} y={B.y} width={B.w} height={B.h} /></clipPath></defs>
      <g clipPath={`url(#pc_${id})`}>
        <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="#1d3554" />
        <path d={coast.map((ln) => { let d = "", pen = false, last = -999; for (let i = 0; i < ln.length; i += 2) { const p = P(ln[i + 1], ln[i]); if (Math.abs(ln[i] - last) > 30) pen = false; d += `${pen ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`; pen = true; last = ln[i]; } return d; }).join("")}
          fill="none" stroke={C.key} strokeOpacity={0.7} strokeWidth={2} />
        {g.map((r, i) => {
          const u = glide !== undefined ? mix(r[2], r[4], glide) : r[S.col], v = glide !== undefined ? mix(r[3], r[5], glide) : r[S.col + 1];
          const p = P(r[0], r[1]);
          return <Arrow key={i} p={p} q={[p[0] + u * S.px * sc, p[1] - v * S.px * sc]} color={S.c} w={small ? 2.5 : 5} head={small ? 9 : 20} halo={!small} />;
        })}
        {box > 0 ? <rect x={bx0[0]} y={bx0[1]} width={bx1[0] - bx0[0]} height={bx1[1] - bx0[1]} fill="none" stroke={C.gold} strokeWidth={small ? 4 : 6} opacity={box} /> : null}
      </g>
      <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="none" stroke={C.grid} strokeWidth={3} />
      {!small ? <g>
        <Arrow p={[B.x + B.w - 40 - S.ref * S.px, B.y + B.h - 34]} q={[B.x + B.w - 40, B.y + B.h - 34]} color={S.c} w={5} head={20} />
        <Lbl x={B.x + B.w - 56 - S.ref * S.px} y={B.y + B.h - 34} t={`${S.ref} m/s`} c={C.key} s={T.floor} a="end" />
      </g> : null}
    </Svg>
  );
};
const S12H: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12h_anomaly");
  const tAn = SS(k, 1), tNorm = SS(k, 2), tTr = SS(k, 3), tClim = SS(k, 4), t23 = SS(k, 5), tSub = SS(k, 6), tNum = SS(k, 7), tWeak = SS(k, 8);
  const tN5 = AT(k, 7, "about five"), tN37 = AT(k, 7, "three point seven"), tN13 = AT(k, 8, "one point three");
  const MAIN: MapBox = { ...PAC, x: 80, y: 40, w: 920, h: 526 };
  const TH = (i: number): MapBox => ({ ...PAC, x: 80 + i * 315, y: 628, w: 290, h: 166 });
  const s1 = fin(f, t23, 20), s2 = fin(f, tSub, 20);
  const gl = clamp((f - t23 - 10) / 60, 0, 1);
  const PM = mapP(MAIN), boxR: Pt = [PM(0, 210)[0], PM(0, 210)[1]];
  const thBox = (i: number): Pt => { const Pq = mapP(TH(i)); return [Pq(-5, 200)[0], Pq(-5, 200)[1]]; };
  const names = PAC_STAGE.map((s) => s.name);
  return (
    <Scene>
      <PacMap id="m0" B={MAIN} stage={0} o={fin(f, 4) * (1 - s1)} box={fin(f, tNum - 30)} />
      <PacMap id="m1" B={MAIN} stage={1} o={s1 * (1 - s2)} glide={gl < 1 ? gl : undefined} box={fin(f, tNum - 30)} />
      <PacMap id="m2" B={MAIN} stage={2} o={s2} box={1} />
      {[0, 1, 2].map((i) => <PacMap key={i} id={`t${i}`} B={TH(i)} stage={i} small box={fin(f, tNum - 30)}
        o={(i === 0 ? fin(f, t23) : i === 1 ? fin(f, tSub) : fin(f, tSub + 20)) * 0.95} />)}
      <Svg>
        <Lbl x={100} y={84} t={names[0]} c={C.key} s={T.floor} o={fin(f, tClim) * (1 - s1)} />
        <Lbl x={100} y={84} t={names[1]} c={C.key} s={T.floor} o={s1 * (1 - s2)} />
        <Lbl x={100} y={84} t={names[2]} c={C.key} s={T.floor} o={s2} />
        {["average", "2023", "2023 − average"].map((t, i) => <Lbl key={t} x={TH(i).x + 6} y={604} t={t} c={i === 2 ? C.gold : C.muted} s={T.floor}
          o={(i === 0 ? fin(f, t23) : i === 1 ? fin(f, tSub) : fin(f, tSub + 20)) * (i === 0 ? fout(f, tN5 - 6, 6) : i === 1 ? fout(f, tN37 - 6, 6) : 1)} />)}
        {/* the box values, on their words, in the thumbnail titles, linked to the subtraction (over the map, not across text) */}
        <Lbl x={TH(0).x + 6} y={604} t="avg: −5.0" c={C.gold} s={T.floor} o={fin(f, tN5)} />
        <Lbl x={TH(1).x + 6} y={604} t="2023: −3.7" c={C.gold} s={T.floor} o={fin(f, tN37)} />
        <Lbl x={boxR[0] + 18} y={boxR[1]} t="+1.3 m/s" c={C.gold} s={T.key} o={fin(f, tN13)} />
        <CurvedLink f={f} from={[TH(0).x + 120, 578]} to={[1560, 526]} start={tN5 + 8} ctl={[900, 450]} />
        <CurvedLink f={f} from={[TH(1).x + 130, 578]} to={[1330, 526]} start={tN37 + 8} ctl={[950, 470]} />
        <CurvedLink f={f} from={[boxR[0] + 200, boxR[1] - 10]} to={[1270, 690]} start={tN13 + 10} bend={40} />
        <Keyword f={f} text="climate: subtracting arrows" at={[MX, 110]} appear={6} out={tAn - 10} s={T.key} />
        <Keyword f={f} text="anomaly" at={[MX, 110]} appear={tAn} s={T.key} />
        <Keyword f={f} text="climatology" at={[MX + 260, 110]} appear={AT(k, 2, "climatology")} s={T.key} />
        <Lbl x={MX} y={200} t="trade winds blow from the east" c={C.key} s={T.floor} o={fin(f, tTr)} />
        <Keyword f={f} text="El Niño" at={[MX, 290]} appear={AT(k, 5, "El Niño")} s={T.key} />
        <Lbl x={MX} y={492} t="ū: average   u′: anomaly" c={C.muted} s={T.floor} o={fin(f, AT(k, 6, "u bar"))} />
        <Keyword f={f} text="trades weakened" at={[MX, 785]} appear={tWeak} s={T.key} />
      </Svg>
      <TeX s={EQ_S12H} x={MX} y={410} size={T.calc} o={fin(f, AT(k, 6, "u prime"))} />
      <CalcStack f={f} x={MX + 140} y={540} size={60} maxLines={2} rows={[
        ROW(String.raw`= (-3.7) - (-5.0)`, tNum + 20, String.raw`u'`, { keep: true }),
        ROW(String.raw`= +1.3\ \text{m/s}\ \text{(east)}`, tN13),
      ]} />
      {void tNorm}
    </Scene>
  );
};

// ================================================================ s12i storm-relative wind
const REL_BOX: MapBox = crop({ lat0: 44.5, lat1: 53, lon0: -15.3, lon1: -1.2, x: 80, y: 40, w: 920, h: 820 });
const S12I: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12i_relative");
  const P = mapP(REL_BOX);
  const tMove = SS(k, 2), tVel = SS(k, 3), tRel = SS(k, 4), tNum = SS(k, 5), tSeen = SS(k, 6);
  const hrs = ["2023-11-01T18", "2023-11-01T19", "2023-11-01T20", "2023-11-01T21", "2023-11-01T22", "2023-11-01T23", "2023-11-02T00"];
  const hf = clamp((f - tMove) / (SE(k, 2) - tMove), 0, 1) * 6, hi = Math.min(6, Math.round(hf));
  const trk = (ST.track as { t: string; lat: number; lon: number }[]).filter((x) => hrs.includes(x.t));
  const cur = trk[Math.min(6, Math.floor(hf))], nxt = trk[Math.min(6, Math.floor(hf) + 1)], w = hf - Math.floor(hf);
  const back = ease(clamp((f - tRel + 10) / 30, 0, 1));
  const Lmove: Pt = P(mix(cur.lat, nxt.lat, w), mix(cur.lon, nxt.lon, w)), L0 = P(trk[0].lat, trk[0].lon);
  const L: Pt = [mix(Lmove[0], L0[0], back), mix(Lmove[1], L0[1], back)];
  const isoH = back > 0.5 ? hrs[0] : hrs[hi];
  const O = P(BGP[0], BGP[1]), px = 5.5;
  const c = ST.c as number[];
  const u: Pt = [O[0] + 5.8 * px, O[1] - 33.5 * px], mc: Pt = [u[0] - 20 * px, u[1] + 5 * px];
  return (
    <Scene>
      <MapView id="s12i" B={REL_BOX} L={{ tc: 0.85, coast: 0.7 }} children={(Pp) => (
        <g>
          <Iso P={Pp} levels={ST.isobars[isoH]} c="#ffffff" w={2.5} o={0.85} />
          {trk.map((x, i) => <circle key={i} cx={Pp(x.lat, x.lon)[0]} cy={Pp(x.lat, x.lon)[1]} r={8} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={i <= hf + 0.01 ? 1 : 0} />)}
          <LowMark p={L} s={80} />
          <Place p={O} t="Brest" dx={16} dy={40} />
        </g>
      )} />
      <Svg>
        <g opacity={fin(f, tVel)}>
          {/* fix 1 (S10): the storm's velocity c is drawn from the storm centre itself, away from the u − c construction */}
          <Arrow p={[L[0] + 40, L[1]]} q={[L[0] + 40 + c[0] * 9, L[1] - c[1] * 9]} color={C.second} />
          <Lbl x={L[0] + 40 + c[0] * 4.5} y={L[1] + 70} t="c = (20, 5) m/s" c={C.second} s={T.key} a="middle" />
        </g>
        <Lbl x={110} y={785} t="about 450 km in 6 h" c={C.key} s={T.key} o={fin(f, AT(k, 2, "four hundred"))} />
        <Lbl x={L[0]} y={L[1] - 72} t={back > 0.5 ? "6 pm UTC" : hf < 5.5 ? "" : "midnight"} c={C.key} s={T.floor} a="middle" o={fin(f, tMove + 10)} />
        <Arrow p={O} q={u} color={C.first} o={fin(f, tRel)} />
        <Arrow p={u} q={mc} color={C.neg} dash="16 10" o={fin(f, tRel + 30)} />
        <Lbl x={(u[0] + mc[0]) / 2} y={(u[1] + mc[1]) / 2 - 40} t="−c" c={C.neg} s={T.key} a="middle" o={fin(f, tRel + 30)} />
        <Arrow p={O} q={mc} color={SUMC} o={fin(f, tNum)} />
        <Lbl x={(O[0] + mc[0]) / 2 - 26} y={(O[1] + mc[1]) / 2 + 10} t="u − c" c={SUMC} s={T.key} a="end" o={fin(f, tNum)} />
        <Keyword f={f} text="relative velocity" at={[MX, 110]} appear={SS(k, 0)} s={T.key} />
        <Keyword f={f} text="round the storm's east side" at={[MX, 760]} appear={tSeen} s={T.floor} />
      </Svg>
      <CalcStack f={f} x={MX + 160} y={260} size={60} maxLines={2} rows={[
        ROW(String.raw`5.8 - 20 \approx -14`, AT(k, 5, "five point eight minus"), String.raw`\text{east:}`, { keep: true }),
        ROW(String.raw`33.5 - 5 \approx 28`, AT(k, 5, "thirty three point five minus"), String.raw`\text{north:}`, { keep: true }),
      ]} />
      <TeX s={rep(EQ_S12I, String.raw`\ \mathrm{m\,s^{-1}}`, "")} x={1060} y={520} size={44} o={fin(f, tSeen)} />
    </Scene>
  );
};

// ================================================================ s13 naming: index notation
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = K("s13_naming");
  const tOver = SS(k, 2), tNum = SS(k, 3), tU = SS(k, 4), tUi = SS(k, 5), tSub = SS(k, 6), tList = SS(k, 7), tIdx = SS(k, 8);
  const crowd = ["u", "v", "w", "x", "y", "z", String.raw`\mathbf e_x`, String.raw`\mathbf e_y`, String.raw`\mathbf e_z`, "a", "b", "c", "p", "q", "r", "s", "t", String.raw`\alpha`, String.raw`\beta`, String.raw`\gamma`];
  const oc = fin(f, SS(k, 1)) * fout(f, tU, 14);
  return (
    <Scene>
      <Svg>
        <AxesGlyph O={[230, 300]} s={120} lab={fin(f, AT(k, 3, "number the directions"), 16)} />
      </Svg>
      {crowd.map((s, i) => {
        const row = Math.floor(i / 7), col = i % 7, x = 560 + col * 175 + (row % 2) * 60 + 24 * Math.sin(i), y = 150 + row * 140;
        const o = oc * fin(f, SS(k, 1) + 4 * i, 8) * (x > 1780 ? 0.3 : 1) * (f > tOver ? 0.4 : 1);
        return <TeX key={i} s={s} x={x} y={y} size={T.eq} o={o} c={i < 3 ? C.first : i < 6 ? C.ink : C.second} ax={0.5} />;
      })}
      <TeX s={String.raw`(u,\ v,\ w)`} x={1100} y={600} size={96} ax={0.5} c={C.first} o={fin(f, SS(k, 1) + 10) * fout(f, tU, 12)} />
      <TeX s={String.raw`(u_1,\ u_2,\ u_3)`} x={1100} y={600} size={96} ax={0.5} c={C.first} o={fin(f, tU) * fout(f, tUi + 20)} />
      <TeX s={String.raw`(u_1,\ u_2,\ u_3)`} x={1450} y={560} size={T.calc} ax={0.5} c={C.first} o={fin(f, tList)} />
      <TeX s={String.raw`u_i`} x={760} y={520} size={180} ax={0.5} c={C.first} o={fin(f, tUi)} />
      <TeX s={EQ_S13} x={760} y={760} size={T.calc} ax={0.5} o={fin(f, tUi + 20)} />
      <Svg>
        <Keyword f={f} text="sub: written below" at={[900, 340]} appear={tSub} s={T.key} targets={[[810, 560]]} />
        <CurvedLink f={f} from={[880, 540]} to={[1300, 560]} start={tList + 10} bend={40} />
        <Lbl x={1450} y={650} t="the whole list" c={C.key} s={T.key} a="middle" o={fin(f, tList + 10)} />
        <Keyword f={f} text="index notation" at={[1250, 160]} appear={AT(k, 8, "index notation")} s={T.key} />
        <Keyword f={f} text="index: i" at={[1250, 260]} appear={AT(k, 8, "called an index")} s={T.key} />
      </Svg>
      {void tIdx}
    </Scene>
  );
};

// ================================================================ s14 free index
const MiniChange: React.FC<{ B: MapBox; o?: number }> = ({ B, o = 1 }) => {
  const P = mapP(B), O = P(BGP[0], BGP[1]), px = 0.65 * B.h / 820 * 8 / 0.65;
  const a17: Pt = [O[0] + P17.u * px, O[1] - P17.v * px], a18: Pt = [O[0] + P18.u * px, O[1] - P18.v * px];
  return (
    <MapView id={`mc${B.x}`} B={B} o={o} L={{ t850: [{ h: 18, o: 0.8 }], coast: 0.8 }} children={() => (
      <g>
        <Place p={O} r={9} />
        <Arrow p={O} q={a17} color={C.first} o={0.5} w={8} head={30} />
        <Arrow p={O} q={a18} color={C.first} w={8} head={30} />
        <Arrow p={a17} q={a18} color={SUMC} w={7} head={28} />
      </g>
    )} />
  );
};
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14_free_index");
  const tFree = SS(k, 0), tThree = SS(k, 1), tLine = SS(k, 3), t1 = SS(k, 4), t2 = SS(k, 5), t3 = SS(k, 6), tComp = SS(k, 7), tBoth = SS(k, 8);
  return (
    <Scene>
      <MiniChange B={{ ...BR_BOX, w: 652, h: 553, x: 120, y: 120 }} />
      <Svg>
        <Lbl x={120} y={84} t="temperature, 1.2 km up" c={C.muted} s={T.floor} o={fin(f, 6)} />
        <ColourBar x={120} y={700} w={560} lut={LUT_T} lo={-6} hi={16} unit="°C" ticks={[{ v: -4, t: "−4" }, { v: 4, t: "4" }, { v: 12, t: "12" }]} o={fin(f, 6)} />
        <Keyword f={f} text="free index" at={[MX, 110]} appear={tFree} s={T.key} />
        <Lbl x={MX + 300} y={110} t="= three equations" c={C.key} s={T.floor} o={fin(f, tThree)} />
      </Svg>
      <TeX s={rep(rep(EQ_S14, "d_i", String.raw`d_{\textcolor{#d8b23a}{i}}`), "u_i(\\text{6", String.raw`u_{\textcolor{#d8b23a}{i}}(\text{6`).replace("u_i(\\text{5", String.raw`u_{\textcolor{#d8b23a}{i}}(\text{5`)} x={MX} y={250} size={T.calc} o={fin(f, tLine)} />
      <CalcStack f={f} x={MX + 150} y={370} size={54} maxLines={3} rows={[
        ROW(String.raw`-1.8 = 5.8 - 7.6`, t1 + 20, String.raw`i = 1:`, { keep: true }),
        ROW(String.raw`10.2 = 33.5 - 23.3`, t2 + 20, String.raw`i = 2:`, { keep: true }),
        ROW(String.raw`\textcolor{#aab4c8}{d_3 = w(\text{6 pm}) - w(\text{5 pm})}`, t3 + 10, String.raw`i = 3:`, { keep: true }),
      ]} />
      <Svg>
        <Keyword f={f} text="component by component" at={[MX, 700]} appear={tComp + 20} s={T.key} />
        <Keyword f={f} text="i in every term, on both sides" at={[MX, 785]} appear={tBoth} s={T.floor} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s15 the dot product
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_dot_product");
  const tDef = SS(k, 1), tSc = SS(k, 2), tSh = SS(k, 3), tEx = SS(k, 4), tQ = SS(k, 5), tE = SS(k, 6), tCalc = SS(k, 7), tRes = SS(k, 8), tPick = SS(k, 9), tMov = SS(k, 10);
  const cut = fin(f, tEx, 14);
  const O: Pt = [260, 620], s = 70;
  const p: Pt = [O[0] + 6 * s, O[1] - 2 * s], q: Pt = [O[0] + 3 * s, O[1] - 5 * s];
  const pu = [6 / Math.hypot(6, 2), 2 / Math.hypot(6, 2)], sh = (3 * pu[0] + 5 * pu[1]);
  const shT: Pt = [O[0] + pu[0] * sh * s, O[1] - pu[1] * sh * s];
  const PM = mapP(COAST_BOX), B = PM(BGP[0], BGP[1]), px = 8;
  const tip: Pt = [B[0] + P18.u * px, B[1] - P18.v * px];
  const ea = E8.e_along as number[];
  const eT: Pt = [B[0] + ea[0] * 240, B[1] - ea[1] * 240];
  const proj = (11.5) * px;
  return (
    <Scene>
      <Svg o={1 - cut}>
        <Arrow p={O} q={p} color={C.first} />
        <Lbl x={p[0] + 20} y={p[1]} t="p" c={C.first} s={T.calc} />
        <Arrow p={O} q={q} color={C.second} />
        <Lbl x={q[0] - 20} y={q[1] - 20} t="q" c={C.second} s={T.calc} a="end" />
        <g opacity={fin(f, tSh)}><Dash p={q} q={shT} c={C.second} /><Band p={O} q={shT} color={C.second} /><Lbl x={(O[0] + shT[0]) / 2 + 10} y={(O[1] + shT[1]) / 2 + 50} t="shadow" c={C.second} s={T.key} /></g>
        <Lbl x={p[0] - 40} y={p[1] + 70} t="× length of p" c={C.first} s={T.floor} a="end" o={fin(f, AT(k, 3, "times the other"))} />
      </Svg>
      <MapView id="s15" B={COAST_BOX} o={cut} L={{ relief: 0.85, coast: 0.8 }} children={() => (
        <g>
          <Band p={B} q={[B[0] + ea[0] * proj, B[1] - ea[1] * proj]} color={C.first} o={fin(f, tRes)} />
          <Arrow p={B} q={tip} color={C.first} />
          <Lbl x={tip[0] + 20} y={tip[1] + 10} t="wind" c={C.first} s={T.key} />
          <Arrow p={B} q={eT} color={C.second} w={10} head={36} o={fin(f, tE)} />
          <Lbl x={eT[0] - 10} y={eT[1] + 50} t="e along the coast" c={C.second} s={T.floor} a="middle" o={fin(f, tE)} />
          <Lbl x={B[0] + ea[0] * proj + 10} y={B[1] - ea[1] * proj - 90} t="11.5" c={C.first} s={T.key} o={fin(f, tRes)} />
          <Place p={B} r={9} />
        </g>
      )} />
      <TeX s={EQ_S15} x={MX} y={130} size={T.calc} o={fin(f, tDef)} />
      <Svg><Lbl x={MX} y={130} t="a product of two vectors" c={C.key} s={T.key} o={fin(f, 6) * fout(f, tDef - 8, 8)} /></Svg>
      <Svg>
        <Keyword f={f} text="a scalar" at={[MX, 240]} appear={tSc} s={T.key} />
        <Lbl x={MX} y={330} t="how much they point the same way" c={C.key} s={T.floor} o={fin(f, AT(k, 3, "how much"))} />
        <Lbl x={MX} y={430} t="e = (0.985, 0.174, 0)" c={C.second} s={T.key} o={fin(f, tE + 20)} />
        <Keyword f={f} text="picks out the part along it" at={[MX, 725]} appear={tPick} s={T.floor} />
        <Lbl x={MX} y={792} t="dot product →" c={C.muted} s={T.floor} o={fin(f, tMov)} />
        <CurvedLink f={f} from={[MX + 60, 610]} to={[B[0] + ea[0] * proj + 70, B[1] - ea[1] * proj - 30]} start={tRes + 30} bend={-60} />
      </Svg>
      <CalcStack f={f} x={MX + 60} y={490} size={48} maxLines={2} rows={[
        ROW(String.raw`= 5.8\times0.985 + 33.5\times0.174 + 0`, tCalc + 20, String.raw`\mathbf u\cdot\mathbf e`),
        ROW(String.raw`\approx 11.5\ \text{m/s}`, tRes, undefined, { size: T.calc, keep: true }),
      ]} />
      {void tQ}
    </Scene>
  );
};

// ================================================================ s16 summation convention
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16_summation");
  const tSig = SS(k, 1), tTw = SS(k, 2), tEin = SS(k, 3), tDrop = SS(k, 4), tConv = SS(k, 5), tRule = SS(k, 6), tFin = SS(k, 7);
  return (
    <Scene>
      <TeX s={String.raw`p_1q_1 + p_2q_2 + p_3q_3`} x={960} y={200} size={T.eq} ax={0.5} o={fin(f, 6) * fout(f, tFin, 12)} />
      <TeX s={String.raw`\sum_{i=1}^{3} p_i q_i`} x={960} y={420} size={96} ax={0.5} o={fin(f, tSig) * fout(f, tDrop + 20, 12)} />
      <TeX s={String.raw`\textcolor{transparent}{\sum_{i=1}^{3}} p_{\textcolor{#d8b23a}{i}} q_{\textcolor{#d8b23a}{i}}`} x={960} y={420} size={96} ax={0.5} o={win(f, tTw, tDrop + 20) * (0.6 + 0.4 * pulse(f, tTw, 20))} />
      <TeX s={String.raw`p_i q_i`} x={960} y={420} size={110} ax={0.5} o={fin(f, tDrop + 20) * fout(f, tFin, 12)} />
      <TeX s={EQ_S16} x={960} y={420} size={96} ax={0.5} o={fin(f, tFin)} />
      <Svg>
        <Lbl x={1220} y={330} t="i twice" c={C.gold} s={T.key} o={win(f, tTw + 10, tDrop + 20)} />
        <Keyword f={f} text="Albert Einstein" at={[960, 600]} a="middle" appear={tEin} s={T.key} />
        <Keyword f={f} text="summation convention" at={[960, 700]} a="middle" appear={tConv} s={T.key} />
        <Lbl x={960} y={800} t="repeated → add for i = 1, 2, 3" c={C.key} s={T.key} a="middle" o={fin(f, tRule)} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s17 dummy index and the rules
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_dummy");
  const tSame = AT(k, 1, "p sub i q sub i"), tSc = SS(k, 2), tVec = SS(k, 3), tRule = SS(k, 4);
  const xj = fin(f, tSame + 20, 16);
  return (
    <Scene>
      <Svg>
        <Keyword f={f} text="dummy index" at={[200, 120]} appear={SS(k, 0)} s={T.key} />
        <text x={1180} y={300} fill={C.ink} fontSize={54} fontFamily="Consolas, 'Courier New', monospace" opacity={fin(f, AT(k, 1, "loop counter")) * fout(f, tSc - 6)}>{xj > 0.5 ? "for j in (1, 2, 3):" : "for i in (1, 2, 3):"}</text>
        <Lbl x={720} y={480} t="no free index → scalar" c={C.key} s={T.key} o={fin(f, tSc)} />
        <Lbl x={720} y={600} t="one free index → vector" c={C.key} s={T.key} o={fin(f, tVec)} />
        <Keyword f={f} text="at most twice" at={[200, 740]} appear={tRule} s={T.key} />
        <Lbl x={1520} y={800} t="?" c={C.neg} s={T.eq} a="middle" o={fin(f, AT(k, 5, "has no meaning"))} />
      </Svg>
      <TeX s={EQ_S17} x={200} y={300} size={T.eq} o={fin(f, tSame) * fout(f, tSc - 6)} />
      <TeX s={String.raw`p_{\textcolor{#d8b23a}{i}}\,q_{\textcolor{#d8b23a}{i}}`} x={1180} y={460} size={T.eq} o={fin(f, AT(k, 0, "repeated index")) * fout(f, tSc - 6)} />
      <Svg><Lbl x={1180} y={620} t="i twice → summed" c={C.gold} s={T.key} o={fin(f, AT(k, 0, "repeated index") + 20) * fout(f, tSc - 6)} /></Svg>
      <TeX s={String.raw`p_i q_i`} x={200} y={480} size={T.eq} o={fin(f, tSc)} />
      <TeX s={String.raw`u_i`} x={200} y={600} size={T.eq} c={C.first} o={fin(f, tVec)} />
      <TeX s={String.raw`p_i q_i s_i`} x={1100} y={800} size={T.eq} c={C.neg} o={fin(f, AT(k, 5, "Something like"))} />
      <Svg><Strike p={[1090, 830]} q={[1440, 770]} f={f} at={AT(k, 5, "has no meaning")} /></Svg>
    </Scene>
  );
};

// ================================================================ s18 length with indices
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_length_index");
  const P = mapP(COAST_BOX), O = P(BGP[0], BGP[1]), px = 8, tip: Pt = [O[0] + P18.u * px, O[1] - P18.v * px];
  const t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4);
  return (
    <Scene>
      <MapView id="s18" B={COAST_BOX} L={{ relief: 0.7, coast: 0.7, dim: 0.25 }} children={() => (
        <g>
          <Arrow p={O} q={[O[0] + 300, O[1]]} color={C.local} w={6} head={26} />
          <Arrow p={O} q={[O[0], O[1] - 330]} color={C.local} w={6} head={26} />
          <Arrow p={O} q={tip} color={C.first} />
          <Lbl x={tip[0] + 24} y={tip[1] + 10} t="34 m/s" c={C.first} s={T.key} o={fin(f, t4)} />
          <Place p={O} r={9} />
        </g>
      )} />
      <TeX s={EQ_S18} x={MX} y={170} size={T.eq} o={fin(f, SS(k, 1))} />
      <CalcStack f={f} x={MX + 190} y={310} size={T.calc} maxLines={3} rows={[
        ROW(String.raw`= 5.8^2 + 33.5^2 + 0^2`, t2 + 10, String.raw`u_i u_i`),
        ROW(String.raw`\approx 1156`, t3),
        ROW(String.raw`\approx 34.0\ \mathrm{m/s}`, t4 + 10, String.raw`\sqrt{1156}`),
      ]} />
      <Svg><CurvedLink f={f} from={[MX - 40, 560]} to={[tip[0] + 180, tip[1] + 40]} start={t4 + 30} bend={50} /></Svg>
    </Scene>
  );
};

// ================================================================ s19 three good reasons
const S19: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19_three_reasons");
  const t1 = SS(k, 2), t2 = SS(k, 3), t3 = SS(k, 4), t3b = SS(k, 5), tNext = AT(k, 5, "next movie");
  const xs = [430, 1200, 1640];
  return (
    <Scene>
      <Svg>
        <Lbl x={960} y={110} t="why?" c={C.gold} s={T.hero} a="middle" o={fin(f, 4) * fout(f, t1 - 10)} />
        {xs.map((x, i) => <Lbl key={`n${i}`} x={x} y={240} t={`${i + 1}`} c={C.muted} s={T.hero - 28} a="middle" o={fin(f, SS(k, 1) + 8 * i) * fout(f, [t1, t2, t3][i] - 8, 8)} />)}
        <Lbl x={xs[0]} y={240} t="short" c={C.key} s={T.hero - 28} a="middle" o={fin(f, t1)} />
        {[0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => <circle key={`d${i}${j}`} cx={xs[0] - 90 + 90 * j} cy={380 + 70 * i} r={18} fill={C.first}
          opacity={fin(f, AT(k, 2, "nine terms") - 8 + 3 * (3 * i + j), 6)} />))}
        <Lbl x={xs[1]} y={240} t="safe" c={C.key} s={T.hero - 28} a="middle" o={fin(f, t2)} />
        <Lbl x={xs[2]} y={240} t="counting" c={C.key} s={T.hero - 28} a="middle" o={fin(f, t3)} />
        <Strike p={[xs[1] - 170, 470]} q={[xs[1] + 170, 400]} f={f} at={AT(k, 3, "adding an arrow")} />
        <Lbl x={xs[1]} y={560} t="vector + number" c={C.neg} s={T.floor} a="middle" o={fin(f, AT(k, 3, "adding an arrow"))} />
        <Lbl x={xs[2]} y={560} t="soon" c={C.muted} s={T.floor} a="middle" o={fin(f, t3b)} />
        <Lbl x={xs[2]} y={760} t="next movie" c={C.muted} s={T.floor} a="middle" o={fin(f, tNext) * 0.7} />
      </Svg>
      <TeX s={String.raw`3 \times 3 = 9\ \text{terms}`} x={xs[0]} y={620} size={T.key} ax={0.5} o={fin(f, AT(k, 2, "nine terms"))} />
      <TeX s={String.raw`u_i + p_i q_i`} x={xs[1]} y={430} size={T.calc} ax={0.5} c={C.neg} o={fin(f, t2 + 10)} />
      <TeX s={String.raw`\delta_{ij}`} x={xs[2]} y={430} size={T.eq} ax={0.5} c={C.local} o={fin(f, t3b)} />
      <TeX s={String.raw`\varepsilon_{ijk}`} x={xs[2]} y={680} size={T.eq} ax={0.5} c={C.muted} o={fin(f, tNext) * 0.7} />
    </Scene>
  );
};

// ================================================================ s20 temperature gradient
const S20: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20_gradient");
  const P = mapP(BR_BOX), O = P(BGP[0], BGP[1]);
  const tQ = SS(k, 1), tEast = SS(k, 3), tT = AT(k, 3, "partial capital"), tTw = SS(k, 4), tN = SS(k, 5), tAll = SS(k, 6), tGrad = SS(k, 7), tFast = SS(k, 8), tMov = SS(k, 9);
  const we = clamp((f - tEast) / 60, 0, 1), wn = clamp((f - tN) / 60, 0, 1);
  const gx = E8.dTdx_100km, gy = E8.dTdy_100km, gl = Math.hypot(gx, gy);
  const gTip: Pt = [O[0] + gx / gl * 230, O[1] - gy / gl * 230];
  return (
    <Scene>
      <MapView id="s20" B={BR_BOX} L={{ t850: [{ h: 18, o: 1 }], coast: 0.8 }} children={() => (
        <g>
          <Place p={O} r={10} t="Brest" dx={-20} dy={36} a="end" />
          <Lbl x={O[0] + 30} y={O[1] - 60} t="?" c={C.gold} s={T.hero} o={win(f, tQ, tEast)} />
          <Walker p={[O[0] + we * 240, O[1]]} a={0} o={win(f, tEast, tN)} s={1.4} />
          <Dash p={O} q={[O[0] + we * 240, O[1]]} c={C.gold} w={5} o={fin(f, tEast)} />
          <Walker p={[O[0], O[1] - wn * 240]} a={90} o={win(f, tN, tAll)} s={1.4} />
          <Dash p={O} q={[O[0], O[1] - wn * 240]} c={C.gold} w={5} o={fin(f, tN)} />
          <Arrow p={O} q={gTip} color={C.second} o={fin(f, tGrad)} />
          <Lbl x={gTip[0] - 20} y={gTip[1] + 40} t="grad T" c={C.second} s={T.key} a="end" o={fin(f, tGrad)} />
        </g>
      )} />
      <Svg>
        <Lbl x={MX} y={70} t="temperature, 1.2 km up" c={C.muted} s={T.floor} o={fin(f, 6)} />
        <ColourBar x={MX} y={110} w={520} lut={LUT_T} lo={-6} hi={16} unit="°C" ticks={[{ v: -4, t: "−4" }, { v: 4, t: "4" }, { v: 12, t: "12" }]} o={fin(f, 6)} />
        <Lbl x={MX} y={250} t="change per metre east" c={C.key} s={T.floor} o={fin(f, AT(k, 3, "for every metre"))} />
        <Lbl x={MX + 240} y={330} t="T: temperature" c={C.key} s={T.floor} o={fin(f, AT(k, 4, "capital T"))} />
        <Lbl x={MX + 240} y={390} t="east only; north, up fixed" c={C.gold} s={T.floor} o={fin(f, AT(k, 4, "partial means"))} />
        <Lbl x={MX + 300} y={690} t="grad T" c={C.second} s={T.key} o={fin(f, tGrad)} />
        <Keyword f={f} text="fastest increase" at={[MX, 785]} appear={tFast} s={T.key} />
        <Lbl x={MX + 480} y={785} t="gradient →" c={C.muted} s={T.floor} o={fin(f, tMov)} />
      </Svg>
      <TeX s={String.raw`\frac{\partial T}{\partial x_1}`} x={MX} y={360} size={72} o={fin(f, tT)} />
      <TeX s={String.raw`\frac{\partial T}{\partial x_2},\ \ \frac{\partial T}{\partial x_3}`} x={MX} y={530} size={60} o={fin(f, tN)} />
      <TeX s={EQ_S20} x={MX + 380} y={530} size={84} o={fin(f, tAll)} c={C.second} />
      <TeX s={String.raw`\nabla T`} x={MX + 160} y={690} size={72} o={fin(f, tGrad)} c={C.second} />
    </Scene>
  );
};

// ================================================================ s21 advection built term by term
// fix 1 (M10, user rule U-WB-R3): the air parcel is a real three.js box over a tilted slab of the ERA5 1.2-km temperature
// map, its edges named east / north / up; on S1-S2 it takes its three legs (u₁ east, u₂ north, u₃ up, per second) in 3-D,
// while the camera orbits slowly. World units: 100 km on the map; legs 0.05 units per m/s (the up leg, 0.1 m/s, is drawn as
// a short stub so it can be seen; its value is written beside it). Equations moved to the maths zone (x ≥ 1080).
const KM100 = 111.195 / 100;
const wx = (lon: number) => (lon - BGP[1]) * KM100 * Math.cos(48.5 * Math.PI / 180), wy = (lat: number) => (lat - BGP[0]) * KM100;
const S21_VB = { x: 80, y: 40, w: 920, h: 640 };
const S21: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21_advection_built");
  const tPar = SS(k, 0), tE = SS(k, 1), tN = SS(k, 2), tSum = SS(k, 3), tDot = SS(k, 4), tAdv = SS(k, 5), tUnit = SS(k, 6);
  const h1 = ease(clamp((f - tE - 10) / 40, 0, 1)), h2 = ease(clamp((f - tN) / 40, 0, 1)), h3 = ease(clamp((f - AT(k, 2, "rising")) / 24, 0, 1));
  const tex = useTex(IMGS.t850(18));
  const tx = D.e850.t850["18"].tex, la0 = tx.lat_edges[0], la1 = tx.lat_edges[1], lo0 = tx.lon_edges[0], lo1 = tx.lon_edges[1];
  const SL = { lat0: 47.85, lat1: 50.25, lon0: -6.4, lon1: -2.6 };
  const uOf = (lon: number) => (lon - lo0) / (lo1 - lo0), vOf = (lat: number) => (lat - la0) / (la1 - la0);
  const kk = 0.05, L1 = P18.u * kk, L2 = P18.v * kk, L3 = 0.28;     // legs (world units)
  const c0: W3 = [0, 0, 0.3], sP = 0.5;
  const pos: W3 = [c0[0] + L1 * h1, c0[1] + L2 * h2, c0[2] + L3 * h3];
  const orbit = clamp(f / LEN(k), 0, 1);
  const st = orbitCam({ az: -118 + 40 * orbit, el: 34, dist: 4.1, target: [0.12, 0.85, 0.3], fov: 35 }, [S21_VB.w / 2, S21_VB.h / 2 + 30]);
  const pr = projector(st, S21_VB.w, S21_VB.h, S21_VB.x, S21_VB.y);
  const op = fin(f, tPar);
  const coast = (D.lines.coast_10m as number[][]).map((ln) => {
    let d = "", pen = false;
    for (let i = 0; i < ln.length; i += 2) {
      const lon = ln[i], lat = ln[i + 1];
      if (lon < SL.lon0 || lon > SL.lon1 || lat < SL.lat0 || lat > SL.lat1) { pen = false; continue; }
      const p = pr.p([wx(lon), wy(lat), 0.004]);
      d += `${pen ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`; pen = true;
    }
    return d;
  }).join("");
  const lab = (v: W3) => pr.p(v);
  const half = sP / 2, top = pos[2] + sP * 0.4;
  return (
    <Scene>
      <View3D st={st} x={S21_VB.x} y={S21_VB.y} w={S21_VB.w} h={S21_VB.h} o={tex ? 1 : 0} amb={1.15} dir={1.8}>
        <MapSlab3D tex={tex} x0={wx(SL.lon0)} x1={wx(SL.lon1)} y0={wy(SL.lat0)} y1={wy(SL.lat1)} u0={uOf(SL.lon0)} u1={uOf(SL.lon1)} v0={vOf(SL.lat0)} v1={vOf(SL.lat1)} />
        <Arrow3D from={[0, 0, 0.02]} to={[L1, L2, 0.02]} color={C.first} px={10} head={36} o={1} />
        <Rod3D a={[c0[0], c0[1], 0.03]} b={[c0[0] + L1 * h1, c0[1], 0.03]} px={7} color={C.gold} o={h1 > 0.01 ? 1 : 0} />
        <Rod3D a={[c0[0] + L1, c0[1], 0.03]} b={[c0[0] + L1, c0[1] + L2 * h2, 0.03]} px={7} color={C.gold} o={h2 > 0.01 ? 1 : 0} />
        <Rod3D a={[c0[0] + L1, c0[1] + L2, 0.03]} b={[c0[0] + L1, c0[1] + L2, 0.03 + L3 * h3]} px={7} color={C.gold} o={h3 > 0.01 ? 1 : 0} />
        <Parcel3D c={pos} s={sP} h={sP * 0.8} o={op} />
      </View3D>
      <Svg>
        <defs><clipPath id="s21v"><rect x={S21_VB.x} y={S21_VB.y} width={S21_VB.w} height={S21_VB.h} /></clipPath></defs>
        <g clipPath="url(#s21v)">
          <path d={coast} fill="none" stroke={C.key} strokeOpacity={0.8} strokeWidth={2} />
          <circle cx={lab([0, 0, 0])[0]} cy={lab([0, 0, 0])[1]} r={7} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        </g>
        <g opacity={op}>
          <Lbl x={lab([pos[0], pos[1] - half - 0.12, pos[2] - sP * 0.4])[0]} y={lab([pos[0], pos[1] - half - 0.12, pos[2] - sP * 0.4])[1] + 14} t="east" c={C.key} s={T.floor} a="middle" />
          <Lbl x={lab([pos[0] - half - 0.1, pos[1], pos[2] - sP * 0.4])[0] - 10} y={lab([pos[0] - half - 0.1, pos[1], pos[2] - sP * 0.4])[1]} t="north" c={C.key} s={T.floor} a="end" />
          <Lbl x={lab([pos[0] - half, pos[1] - half, top])[0] - 14} y={lab([pos[0] - half, pos[1] - half, top])[1] - 18} t="up" c={C.key} s={T.floor} a="end" />
        </g>
        <Lbl x={lab([0, L2 * 0.55, 0])[0] - 22} y={lab([0, L2 * 0.55, 0])[1]} t="wind" c={C.first} s={T.floor} a="end" />
        <Lbl x={lab([L1 * 0.5, -0.12, 0])[0]} y={lab([L1 * 0.5, -0.12, 0])[1] + 30} t="u₁" c={C.gold} s={T.key} a="middle" o={fin(f, tE + 20)} />
        <Lbl x={lab([L1 + 0.1, L2 * 0.5, 0])[0] + 16} y={lab([L1 + 0.1, L2 * 0.5, 0])[1]} t="u₂" c={C.gold} s={T.key} o={fin(f, tN + 20)} />
        <Lbl x={lab([L1 + 0.15, L2, L3])[0] + 18} y={lab([L1 + 0.15, L2, L3])[1] - 10} t="u₃ ≈ 0.1 m/s" c={C.gold} s={T.floor} o={fin(f, AT(k, 2, "rising") + 20)} />
        <Keyword f={f} text="air parcel" at={[lab([pos[0], pos[1], top])[0] + 60, lab([pos[0], pos[1], top])[1] - 80]} appear={AT(k, 0, "air parcel")} s={T.key} a="start" />
        <Lbl x={80} y={705} t="temperature, 1.2 km up" c={C.muted} s={T.floor} o={fin(f, 6)} />
        <ColourBar x={80} y={730} w={520} lut={LUT_T} lo={-6} hi={16} unit="°C" ticks={[{ v: -4, t: "−4" }, { v: 4, t: "4" }, { v: 12, t: "12" }]} o={fin(f, 6)} />
      </Svg>
      <Svg>
        <Lbl x={1090} y={110} t="moves with the wind" c={C.key} s={T.key} o={fin(f, AT(k, 0, "moves with the wind"))} />
        <Lbl x={1090} y={190} t="in 1 s: u₁, u₂, u₃ metres" c={C.gold} s={T.floor} o={fin(f, AT(k, 1, "metres east"))} />
        <Lbl x={1090} y={590} t="j summed" c={C.gold} s={T.floor} o={fin(f, tSum + 20)} />
        <Keyword f={f} text="dot product" at={[1560, 500]} appear={AT(k, 4, "dot product")} s={T.key} />
        <Keyword f={f} text="advection" at={[1090, 670]} appear={AT(k, 4, "advection")} s={T.calc} />
        <Lbl x={1090} y={732} t="carried along by the flow" c={C.key} s={T.floor} o={fin(f, tAdv)} />
        <Lbl x={1090} y={792} t="degrees per second" c={C.key} s={T.floor} o={fin(f, AT(k, 6, "in degrees"))} />
      </Svg>
      <TeX s={String.raw`u_1\frac{\partial T}{\partial x_1}`} x={1090} y={300} size={60} o={fin(f, tE + 30) * fout(f, tN + 10, 8)} />
      <TeX s={String.raw`u_1\frac{\partial T}{\partial x_1} + u_2\frac{\partial T}{\partial x_2} + u_3\frac{\partial T}{\partial x_3}`} x={1090} y={300} size={60} o={fin(f, tN + 10, 8) * fout(f, tSum, 10)} />
      <TeX s={rep(EQ_S21, String.raw` = \mathbf u\cdot\nabla T`, "")} x={1080} y={410} size={44} o={fin(f, tSum)} />
      <TeX s={String.raw`= \mathbf u\cdot\nabla T`} x={1240} y={500} size={56} o={fin(f, tDot)} />
      <TeX s={EQ_S21} x={1080} y={410} size={44} o={0} />
      {void tUnit}
    </Scene>
  );
};

// ================================================================ s22, s23 easy numbers and the sign (idealised map)
const IM = { X0: 100, Y0: 60, W: 860, H: 760 };       // 1 px = 1 km (860 km × 760 km); ends at y 820 (fix 1)
const IM_C0: Pt = [IM.X0 + 430, IM.Y0 + 430];
const IM_DIR = [10 / Math.hypot(10, 30), 30 / Math.hypot(10, 30)];
const IdealMap: React.FC<{ f: number; o?: number; parcel?: number }> = ({ f, o = 1, parcel = 0 }) => {
  if (o <= 0) return null;
  const { X0, Y0, W, H } = IM;
  const T0 = 14, gx = -3 / 100, gy = -2 / 100;          // °C per km
  const Tat = (x: number, y: number) => T0 + gx * x + gy * (H - y);
  const lines: React.ReactNode[] = [];
  for (let lev = -16; lev <= 14; lev += 2) {
    // gx·x + gy·(H − y) = lev − T0 → y = H − (lev − T0 − gx·x)/gy
    const ya = H - (lev - T0 - gx * 0) / gy, yb = H - (lev - T0 - gx * W) / gy;
    lines.push(<line key={lev} x1={X0} y1={Y0 + ya} x2={X0 + W} y2={Y0 + yb} stroke={C.key} strokeWidth={2} opacity={0.6} />);
  }
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < 20; i++) for (let j = 0; j < 18; j++) {
    const x = (i + 0.5) * W / 20, y = (j + 0.5) * H / 18;
    cells.push(<rect key={`${i}_${j}`} x={X0 + i * W / 20} y={Y0 + j * H / 18} width={W / 20 + 1} height={H / 18 + 1} fill={lutCss(LUT_T, (Tat(x, y) + 20) / 36)} />);
  }
  const C0 = IM_C0, pp: Pt = [C0[0] + IM_DIR[0] * 260 * parcel, C0[1] - IM_DIR[1] * 260 * parcel];
  return (
    <g opacity={o}>
      <defs><clipPath id="ideal"><rect x={X0} y={Y0} width={W} height={H} /></clipPath></defs>
      <g clipPath="url(#ideal)">{cells}{lines}</g>
      <rect x={X0} y={Y0} width={W} height={H} fill="none" stroke={C.grid} strokeWidth={3} />
      <Arrow p={C0} q={[C0[0] + 10 * 9, C0[1] - 30 * 9]} color={C.first} />
      <Lbl x={C0[0] + 110} y={C0[1] - 250} t="(10, 30) m/s" c={C.first} s={T.key} />
      <Lbl x={X0 + 20} y={Y0 + H - 40} t="warmer" c={C.key} s={T.floor} />
      <Lbl x={X0 + W - 20} y={Y0 + 40} t="colder" c={C.key} s={T.floor} a="end" />
      {parcel > 0 ? <line x1={C0[0]} y1={C0[1]} x2={pp[0]} y2={pp[1]} stroke={C.first} strokeWidth={5} strokeDasharray="10 8" /> : null}
      {void f}
    </g>
  );
};
const S22: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22_advection_easy");
  const tW = SS(k, 1), tT = SS(k, 2), tSl = SS(k, 3), tK = SS(k, 4), tSum = SS(k, 5), tRes = SS(k, 6), tH = SS(k, 7);
  // fix 1 (S15): the conversion steps a novice would not do in their head; the sum keeps its 10⁻⁵
  return (
    <Scene>
      <Svg><IdealMap f={f} o={fin(f, 4)} /></Svg>
      <CalcStack f={f} x={1250} y={200} size={48} maxLines={3} rows={[
        ROW(String.raw`= 10^5\ \text{m}`, tSl, String.raw`100\ \text{km}`, { h: 90 }),
        ROW(String.raw`= -3\ \text{K} \div 10^5\ \text{m}`, tSl + 40, String.raw`\frac{\partial T}{\partial x_1}`, { h: 120 }),
        ROW(String.raw`= -3\times10^{-5}\ \text{K/m}`, tSl + 60, undefined, { h: 70, cont: true }),
        ROW(String.raw`= -2\times10^{-5}\ \text{K/m}`, tSl + 100, String.raw`\frac{\partial T}{\partial x_2}`, { h: 130 }),
        ROW(String.raw`= 10\times(-3\times10^{-5})`, tSum + 20, String.raw`\text{sum}`, { h: 76 }),
        ROW(String.raw`\ \ +\ 30\times(-2\times10^{-5})`, tSum + 40, undefined, { h: 76, cont: true }),
        ROW(String.raw`= -90\times10^{-5}`, tRes + 10, undefined, { h: 76 }),
        ROW(String.raw`= -9\times10^{-4}\ \text{K/s}`, tRes + 40, undefined, { h: 76, cont: true }),
        ROW(String.raw`\approx -3.2\ \text{K per hour}`, tH + 30, String.raw`\times 3600\ \text{s}`, { h: 90 }),
      ]} />
      <TeX s={rep(EQ_S22, String.raw`\ \mathrm{K\,s^{-1}}`, "")} x={1050} y={720} size={44} o={0} />
      <Svg>
        <Lbl x={MX} y={790} t="kelvin step = degree Celsius step" c={C.local} s={T.floor} o={win(f, tK, tSum + 10)} />
        <Lbl x={MX} y={790} t="up part: later" c={C.local} s={T.floor} o={win(f, tSum + 20, tH + 50)} />
        <Keyword f={f} text="easy numbers first" at={[MX, 110]} appear={6} out={tT - 10} s={T.key} />
        <Lbl x={MX} y={110} t="east −3, north −2 °C per 100 km" c={C.key} s={T.floor} o={fin(f, tT)} />
      </Svg>
      {void tW}
    </Scene>
  );
};
const S23: React.FC = () => {
  const f = useCurrentFrame(), k = K("s23_advection_sign");
  const tCar = SS(k, 1), tTurn = SS(k, 2), tArr = SS(k, 3), tPlus = SS(k, 4), tWA = SS(k, 5), tSym = SS(k, 6), tMov = SS(k, 7);
  const parcel = clamp((f - tCar) / 60, 0, 1) * fout(f, tTurn + 10, 12);
  const pp: Pt = [IM_C0[0] + IM_DIR[0] * 260 * parcel, IM_C0[1] - IM_DIR[1] * 260 * parcel];
  const queue = fin(f, tArr);
  return (
    <Scene>
      <Svg>
        <IdealMap f={f} parcel={parcel} />
      </Svg>
      {/* fix 1 (M10): the parcels are the movie's three.js box (the arriving ones in the warm colour) */}
      <ParcelBox3D p={pp} size={110} o={parcel > 0 ? 1 : 0} />
      {[1, 2, 3].map((i) => <ParcelBox3D key={i} p={[IM_C0[0] - IM_DIR[0] * 110 * i, IM_C0[1] + IM_DIR[1] * 110 * i]} size={100} o={queue * (1 - 0.15 * i)} color="#e8833a" />)}
      <Svg>
        <PoleThermometer x={530} y={490} s={1.2} o={fin(f, tTurn + 10)} />
        <Keyword f={f} text="the minus sign?" at={[MX, 130]} appear={6} out={tPlus - 10} s={T.key} />
        <Lbl x={MX} y={130} t="+3.2 K per hour" c={C.local} s={T.calc} o={fin(f, tPlus)} />
        <CurvedLink f={f} from={[MX - 20, 160]} to={[580, 470]} start={tPlus + 10} ctl={[1000, 520]} />
        <Lbl x={MX} y={360} t="warmer air → colder air" c={C.key} s={T.key} o={fin(f, AT(k, 1, "from warmer air")) * fout(f, tSym - 10)} />
        <Lbl x={MX} y={540} t="stand still" c={C.local} s={T.key} o={fin(f, AT(k, 2, "stand still")) * fout(f, tSym - 10)} />
        <Keyword f={f} text="warm advection" at={[MX, 260]} appear={tWA} s={T.key} />
        <Lbl x={MX} y={560} t="t: time" c={C.muted} s={T.floor} o={fin(f, AT(k, 6, "small t stands"))} />
        <Lbl x={MX} y={640} t="fixed thermometer" c={C.local} s={T.key} o={fin(f, tSym + 30)} />
        <Lbl x={MX} y={720} t="if each parcel keeps its temperature" c={C.key} s={T.floor} o={fin(f, tSym + 40)} />
        <Lbl x={MX} y={792} t="material derivative →" c={C.muted} s={T.floor} o={fin(f, tMov)} />
      </Svg>
      {/* fix 1 (M9): the equation has the space of the retired keywords; ∂T/∂t is said in words on S7 */}
      <TeX s={EQ_S23} x={MX} y={440} size={T.eq} o={fin(f, tSym)} />
    </Scene>
  );
};

// ================================================================ s24 the real map (ERA5 850 hPa temperature)
const T24: MapBox = { lat0: 52 - 8 * 640 / 700, lat1: 52, lon0: -17.1, lon1: 8.7, x: 80, y: 40, w: 1760, h: 640 };
const S24: React.FC = () => {
  const f = useCurrentFrame(), k = K("s24_real_map");
  const tIso = AT(k, 2, "isotherms"), tJoin = AT(k, 2, "join places"), tCrowd = SS(k, 3), tWarm = SS(k, 4), tZoom = SS(k, 5);
  const z = ease(clamp((f - tZoom - 10) / 50, 0, 1));
  const B = lerpBox(T24, ZBOX, z);
  const draw = clamp((f - tJoin) / 40, 0, 1);
  return (
    <Scene>
      <MapView id="s24" B={B} L={{ t850: [{ h: 18, o: 1 }], coast: 0.85, borders: 0.4 }} children={(Pp) => (
        <g>
          <Iso P={Pp} levels={D.e850.t850["18"].iso} o={draw > 0 ? 1 : 0} draw={draw} labels={draw >= 1 && z < 0.05} B={B} fmtL={(v) => `${v}°`} />
          <Winds P={Pp} list={(D.e850.arrows_br18 as number[][]).filter((r) => Math.round(r[0] / 0.75) % 2 === 0 && Math.round(r[1] / 0.75) % 2 === 0)} px={2.4} c={C.first} w={4} head={16} o={0.9} />
          <path d={poly([Pp(46.4, -9.5), Pp(47.6, -6.6), Pp(48.2, -5.0)])} fill="none" stroke={C.gold} strokeWidth={26} strokeOpacity={0.35} strokeLinecap="round" opacity={win(f, tCrowd, tZoom)} />
          <Place p={Pp(BGP[0], BGP[1])} r={10} t="Brest" dx={16} dy={-34} />
        </g>
      )} />
      <Svg>
        <Lbl x={80} y={712} t="temperature, 1.2 km up" c={C.muted} s={T.floor} o={fin(f, 6) * (1 - z)} />
        <ColourBar x={620} y={700} w={620} lut={LUT_T} lo={-6} hi={16} unit="°C" ticks={[{ v: -4, t: "−4" }, { v: 0, t: "0" }, { v: 4, t: "4" }, { v: 8, t: "8" }, { v: 12, t: "12" }]} o={fin(f, 6) * (1 - z)} />
        <Keyword f={f} text="isotherms" at={[1400, 730]} appear={tIso} s={T.key} />
        <Lbl x={mapP(B)(46.0, -12.5)[0]} y={mapP(B)(46.0, -12.5)[1]} t="w a r m   a i r" c={C.key} s={T.key} a="middle" o={win(f, tWarm, tZoom)} />
        <Lbl x={mapP(B)(50.8, -1.0)[0]} y={mapP(B)(50.8, -1.0)[1]} t="c o l d   a i r" c={C.key} s={T.key} a="middle" o={win(f, tWarm, tZoom)} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s25, s26 the real gradient and the real sum (zoomed map)
const ZoomMap: React.FC<{ f: number; children?: (P: Proj) => React.ReactNode }> = ({ children }) => (
  <MapView id="zm" B={ZBOX} L={{ t850: [{ h: 18, o: 1 }], coast: 0.85 }} children={(Pp) => (
    <g>
      <Iso P={Pp} levels={D.e850.t850["18"].iso} o={0.8} w={2} />
      {[0, 100, 200].map((km) => { const a = Pp(47.6, BGP[1] + km * KM_LON), b = Pp(49.6, BGP[1] + km * KM_LON); return <line key={km} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.muted} strokeWidth={1.5} opacity={0.5} />; })}
      {[-100, 0, 100].map((km) => { const a = Pp(BGP[0] + km * KM_LAT, -6.2), b = Pp(BGP[0] + km * KM_LAT, -2.8); return <line key={km} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.muted} strokeWidth={1.5} opacity={0.5} />; })}
      {children ? children(Pp) : null}
      <Place p={Pp(BGP[0], BGP[1])} r={10} />
    </g>
  )} />
);
const S25: React.FC = () => {
  const f = useCurrentFrame(), k = K("s25_real_gradient");
  const tE = SS(k, 0), tN = SS(k, 1), t1 = SS(k, 2), t2 = SS(k, 3), tG = SS(k, 4);
  const P = mapP(ZBOX), O = P(BGP[0], BGP[1]);
  const E = P(BGP[0], BGP[1] + 100 * KM_LON), N = P(BGP[0] + 100 * KM_LAT, BGP[1]);
  const de = clamp((f - tE) / 30, 0, 1), dn = clamp((f - tN) / 30, 0, 1);
  const gx = E8.dTdx_100km, gy = E8.dTdy_100km, gl = Math.hypot(gx, gy);
  const g: Pt = [O[0] + gx / gl * 250, O[1] - gy / gl * 250];
  return (
    <Scene>
      <ZoomMap f={f} children={() => (
        <g>
          <line x1={O[0]} y1={O[1]} x2={mix(O[0], E[0], de)} y2={O[1]} stroke={C.gold} strokeWidth={8} />
          <Lbl x={E[0]} y={E[1] + 46} t="−3.2 °C" c={C.gold} s={T.key} a="end" o={fin(f, tE + 30)} />
          <Lbl x={(O[0] + E[0]) / 2} y={O[1] - 34} t="100 km" c={C.key} s={T.floor} a="middle" o={fin(f, tE + 10)} />
          <line x1={O[0]} y1={O[1]} x2={O[0]} y2={mix(O[1], N[1], dn)} stroke={C.gold} strokeWidth={8} />
          <Lbl x={N[0] + 20} y={N[1] - 30} t="−2.5 °C" c={C.gold} s={T.key} o={fin(f, tN + 30)} />
          <Lbl x={O[0] - 24} y={(O[1] + N[1]) / 2} t="100 km" c={C.key} s={T.floor} a="end" o={fin(f, tN + 10)} />
          <Arrow p={O} q={g} color={C.second} o={fin(f, tG)} />
          <Lbl x={g[0] - 10} y={g[1] + 44} t="grad T" c={C.second} s={T.key} a="end" o={fin(f, tG)} />
        </g>
      )} />
      <CalcStack f={f} x={MX + 150} y={130} size={56} maxLines={2} rows={[
        ROW(String.raw`= -3.2\times10^{-5}\ \mathrm{K/m}`, t1 + 10, String.raw`\frac{\partial T}{\partial x_1}`, { h: 160, keep: true }),
        ROW(String.raw`= -2.5\times10^{-5}\ \mathrm{K/m}`, t2 + 10, String.raw`\frac{\partial T}{\partial x_2}`, { h: 160, keep: true }),
      ]} />
      <TeX s={rep(EQ_S25, String.raw`\ \mathrm{K\,m^{-1}}`, "")} x={1060} y={560} size={44} o={0} />
      <Svg>
        <CurvedLink f={f} from={[E[0] + 10, E[1] + 70]} to={[MX - 10, 555]} start={AT(k, 0, "three point two") + 20} bend={40} />
        <CurvedLink f={f} from={[N[0] + 190, N[1] - 30]} to={[MX - 10, 390]} start={t2 + 20} bend={40} />
        <Lbl x={MX} y={545} t="east: −3.2 °C per 100 km" c={C.key} s={T.key} o={fin(f, AT(k, 0, "three point two"))} />
        <Lbl x={MX} y={625} t="north: −2.5 °C per 100 km" c={C.key} s={T.key} o={fin(f, AT(k, 1, "two point five"))} />
        <Lbl x={MX} y={720} t="towards the warm air" c={C.second} s={T.key} o={fin(f, AT(k, 4, "towards the warm"))} />
      </Svg>
    </Scene>
  );
};
const S26: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26_real_sum");
  const t0 = SS(k, 0), tSum = SS(k, 1), tE = SS(k, 2), tE2 = SS(k, 3), tN = SS(k, 4), tMost = SS(k, 5), tTot = SS(k, 6), tWarm = SS(k, 7);
  const P = mapP(ZBOX), O = P(BGP[0], BGP[1]), px = 8;
  const tip: Pt = [O[0] + P18.u * px, O[1] - P18.v * px];
  const eT = E8.east_term * 1e4, nT = E8.north_term * 1e4;   // in 10⁻⁴ K/s
  return (
    <Scene>
      <ZoomMap f={f} children={() => (
        <g>
          <Arrow p={O} q={tip} color={C.first} o={fin(f, t0)} />
          <Lbl x={tip[0] + 20} y={tip[1] + 20} t="(5.8, 33.5)" c={C.first} s={T.key} o={fin(f, t0 + 10)} />
          <g opacity={fin(f, tWarm)}><PoleThermometer x={O[0] - 60} y={O[1] + 150} s={1.0} /><Lbl x={O[0] - 60} y={O[1] + 200} t="+3.7 K per hour" c={C.local} s={T.key} a="middle" /></g>
        </g>
      )} />
      <TeX s={String.raw`u_j\frac{\partial T}{\partial x_j} = u_1\frac{\partial T}{\partial x_1} + u_2\frac{\partial T}{\partial x_2}`} x={1060} y={120} size={50} o={fin(f, tSum + 10)} />
      <CalcStack f={f} x={1460} y={210} size={46} maxLines={3} dim={0.85} rows={[
        ROW(String.raw`\approx -1.9\times10^{-4}`, tE2, String.raw`5.8\times(-3.2\times10^{-5})`, { h: 74, keep: true }),
        ROW(String.raw`\approx -8.4\times10^{-4}`, tN + 20, String.raw`33.5\times(-2.5\times10^{-5})`, { h: 74, keep: true }),
        ROW(String.raw`\approx -1.0\times10^{-3}\ \text{K/s}`, tTot, String.raw`\text{sum}`, { h: 74, keep: true }),
        ROW(String.raw`\approx -3.7\ \text{K per hour}`, AT(k, 6, "or minus three point seven"), String.raw`\times 3600`, { h: 74, keep: true }),
        ROW(String.raw`\approx +3.7\ \text{K per hour}`, tWarm + 10, String.raw`-u_j\frac{\partial T}{\partial x_j}`, { h: 96, keep: true, c: C.local }),
      ]} />
      <TeX s={rep(EQ_S26, String.raw`\ \mathrm{K\,s^{-1}}`, "")} x={1060} y={560} size={44} o={0} />
      <Svg>
        <g opacity={fin(f, tMost)}>
          <line x1={MX + 500} y1={650} x2={MX + 500} y2={790} stroke={C.ink} strokeWidth={4} />
          <rect x={MX + 500 + eT * 50} y={665} width={-eT * 50} height={40} fill={C.neg} opacity={0.7} />
          <rect x={MX + 500 + nT * 50} y={725} width={-nT * 50} height={40} fill={C.neg} opacity={0.7} />
          <Lbl x={MX + 520} y={685} t="east" c={C.key} s={T.floor} />
          <Lbl x={MX + 520} y={745} t="north" c={C.key} s={T.floor} />
          <Lbl x={MX + 500 + nT * 50 - 10} y={745} t="−" c={C.neg} s={T.key} a="end" />
        </g>
        <Keyword f={f} text="warm air arriving" at={[MX, 565]} appear={tWarm + 20} s={T.key} />
        <Lbl x={MX} y={120} t="wind at Brest: (5.8, 33.5) m/s" c={C.first} s={T.floor} o={fin(f, t0 + 10) * fout(f, tSum)} />
      </Svg>
      {void tE}
    </Scene>
  );
};

// ================================================================ s27 check against what happened
/** whole-number temperature ticks + grid lines for a TimeGraph drawn with Tticks = [] (fix 1, S17: no ".0" decimals) */
const TTicks: React.FC<{ x: number; y: number; w: number; h: number; Tr: [number, number]; ticks: number[] }> = ({ x, y, w, h, Tr, ticks }) => {
  const Y = (T: number) => y + h - ((T - Tr[0]) / (Tr[1] - Tr[0])) * h;
  return (
    <g>
      {ticks.map((T) => (
        <g key={T}>
          <line x1={x - 10} y1={Y(T)} x2={x} y2={Y(T)} stroke={C.muted} strokeWidth={3} />
          <line x1={x} y1={Y(T)} x2={x + w} y2={Y(T)} stroke={C.grid} strokeWidth={1.5} />
          <Lbl x={x - 16} y={Y(T)} t={`${T}`} c={C.muted} s={52} a="end" b={false} />
        </g>
      ))}
    </g>
  );
};
const S27: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27_real_check");
  const tL = SS(k, 1), tRate = SS(k, 2), tGap = SS(k, 3), tMov = SS(k, 4), tSt = SS(k, 5), tFront = SS(k, 6);
  const upL = clamp((f - tL) / 60, 0, 1) * 2;
  const upR = clamp((f - tSt) / 60, 0, 1) * 4;
  const syn = D.brest.synop_T as number[];
  return (
    <Scene>
      <Svg>
        <TTicks x={200} y={150} w={560} h={420} Tr={[0, 12]} ticks={[0, 5, 10]} />
        <TimeGraph x={200} y={150} w={560} h={420} tMax={2} Tr={[0, 12]} Tticks={[]} series={[
          { t: [0, 1, 2], T: [P17.T, P18.T, P19.T], upto: upL, c: C.first, pts: [{ h: 0, o: fin(f, tL) }, { h: 1, o: fin(f, tL + 30) }, { h: 2, o: fin(f, tL + 60) }] },
          { t: [0, 2], T: [P18.T - 3.7, P18.T + 3.7], upto: 2, c: C.local, dash: true, o: fin(f, tGap) },
        ]} />
        <Lbl x={200} y={680} t="17 UTC → 19 UTC · 1.2 km up" c={C.muted} s={T.floor} />
        <Lbl x={240} y={110} t="+2.9 K per hour" c={C.first} s={T.key} o={fin(f, tRate)} />
        <Lbl x={500} y={250} t="our sum: +3.7" c={C.local} s={T.floor} o={fin(f, tGap)} />
        <Keyword f={f} text="rising air cools" at={[200, 790]} appear={AT(k, 3, "rising air")} s={T.key} />
        <g opacity={fout(f, tSt - 14, 10)}>
          <Keyword f={f} text="did Brest warm up?" at={[1150, 110]} appear={6} s={T.key} />
          <Lbl x={1150} y={300} t="reanalysis: +2.9 K per hour" c={C.first} s={T.key} o={fin(f, tRate)} />
          <Lbl x={1150} y={390} t="our sum: +3.7 K per hour" c={C.local} s={T.key} o={fin(f, tGap)} />
          <Lbl x={1150} y={480} t="a little smaller" c={C.key} s={T.floor} o={fin(f, AT(k, 2, "a little smaller"))} />
          <Lbl x={1150} y={570} t="thermodynamics →" c={C.muted} s={T.floor} o={fin(f, tMov)} />
        </g>
        <g opacity={fin(f, tSt - 10)}>
          <TTicks x={1150} y={150} w={520} h={420} Tr={[8, 17]} ticks={[10, 12, 14, 16]} />
          <TimeGraph x={1150} y={150} w={520} h={420} tMax={4} Tr={[8, 17]} Tticks={[]} series={[
            { t: [0, 1, 2, 3, 4], T: syn, upto: upR, c: C.neg, pts: [0, 1, 2, 3, 4].map((h) => ({ h, o: fin(f, tSt + 15 * h) })) },
          ]} />
        </g>
        <Lbl x={1150} y={680} t="17 → 21 UTC · Brest station, 2 m" c={C.muted} s={T.floor} o={fin(f, tSt)} />
        <Lbl x={1210} y={110} t="10.3 → 14.9 °C (+4.6)" c={C.neg} s={T.key} o={fin(f, AT(k, 5, "ten point three"))} />
        <WarmFrontGlyph x={1150} y={790} o={fin(f, tFront)} />
        <Keyword f={f} text="warm front" at={[1420, 790]} appear={AT(k, 6, "warm front")} s={T.key} />
        {void tMov}
      </Svg>
    </Scene>
  );
};

// ================================================================ s28 nine terms in one line
const S28: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28_nine_terms");
  const tEq = SS(k, 1), tI = SS(k, 2), tJ = SS(k, 3), tNine = SS(k, 4), tRow = SS(k, 5), tMod = SS(k, 6), tMov = SS(k, 7);
  const cell = (i: number, j: number) => String.raw`u_${j}\frac{\partial u_${i}}{\partial x_${j}}`;
  const fill = (i: number, j: number) => fin(f, tNine + 8 * (3 * (i - 1) + (j - 1)), 8);
  const n = [1, 2, 3].flatMap((i) => [1, 2, 3].map((j) => fill(i, j))).filter((x) => x > 0.5).length;
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, tMod) * 0.5}>
          {Array.from({ length: 13 * 7 }, (_, q) => <circle key={q} cx={720 + (q % 13) * 90} cy={270 + Math.floor(q / 13) * 80} r={4} fill={C.muted} />)}
        </g>
        {/* sentence 0: the wind carries its own motion (illustrative arrows drifting downwind) */}
        <g opacity={fout(f, tI - 10, 12)}>
          {[0, 1, 2, 3].map((q) => { const x0 = 1100 + q * 170 + 0.3 * f, L = [120, 160, 100, 140][q]; return <Arrow key={q} p={[x0 - L / 2, 470 + (q % 2) * 90]} q={[x0 + L / 2, 470 + (q % 2) * 90]} color={C.first} w={10} head={40} />; })}
        </g>
        <Lbl x={760} y={90} t="i: free → 3 equations" c={C.gold} s={T.key} o={fin(f, tI)} />
        <Lbl x={760} y={170} t="j: summed → 3 terms each" c={C.first} s={T.key} o={fin(f, tJ)} />
        <rect x={700} y={340 - 75} width={1120} height={150} fill={C.gold} opacity={0.14 * fin(f, tRow)} />
        <Lbl x={1820} y={790} t={`${n}`} c={C.gold} s={T.calc} a="end" o={fin(f, tNine)} />
        <Keyword f={f} text="millions of points" at={[150, 790]} appear={tMod} s={T.key} />
        <Lbl x={150} y={720} t="vector identities →" c={C.muted} s={T.floor} o={fin(f, tMov)} />
      </Svg>
      <TeX s={String.raw`u_j\,\frac{\partial T}{\partial x_j}`} x={150} y={300} size={96} o={fin(f, 0) * fout(f, tEq - 12, 12)} />
      <TeX s={rep(rep(EQ_S28, "u_i", String.raw`u_{\textcolor{#d8b23a}{i}}`).replace("u_j", String.raw`u_{\textcolor{#2aa198}{j}}`), "x_j", String.raw`x_{\textcolor{#2aa198}{j}}`)} x={150} y={300} size={96} o={fin(f, tEq)} />
      {[1, 2, 3].flatMap((i) => [1, 2, 3].map((j) => (
        <TeX key={`${i}${j}`} s={(j > 1 ? "+\\ " : "") + cell(i, j)} x={760 + (j - 1) * 360} y={340 + (i - 1) * 165} size={60} o={fill(i, j)} />
      )))}
    </Scene>
  );
};

// ================================================================ s29 the Kronecker delta (from the basis)
const S29: React.FC = () => {
  const f = useCurrentFrame(), k = K("s29_kronecker");
  const P = proj3(222, 24, 105, [520, 650]);
  const t11 = SS(k, 2), t12 = SS(k, 3), tAll = SS(k, 4), tName = SS(k, 5), tDef = SS(k, 6), tTab = SS(k, 7);
  const at = (i: number, j: number) => (i === 0 && j === 0 ? t11 + 20 : i === 0 && j === 1 ? t12 + 20 : tAll + 6 * (3 * i + j));
  const X0 = 1240, Y0 = 470, cw = 150;
  const E: V3[] = [[3, 0, 0], [0, 3, 0], [0, 0, 3]];
  return (
    <Scene>
      <Svg>
        <Floor P={P} x0={-1} x1={5} y0={-1} y1={5} lat={48.448} lon={-4.419} dlat={0.06} dlon={0.09} id="s29" o={0.6} />
        {E.map((v, i) => <g key={i}><Arrow3 P={P} a={[0, 0, 0]} b={v} c={C.second} /><Lbl x={P.p(add3(v, v, 0.18))[0]} y={P.p(add3(v, v, 0.18))[1]} t={`e${"₁₂₃"[i]}`} c={C.second} s={T.calc} a="middle" /></g>)}
        <Band p={P.p([0, 0, 0])} q={P.p([3, 0, 0])} color={C.second} o={win(f, t11, t12)} w={24} />
        <RightTick at={P.p([0, 0, 0])} u1={(() => { const a = P.p([0, 0, 0]), b = P.p([1, 0, 0]); const L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / L, (b[1] - a[1]) / L] as Pt; })()}
          u2={(() => { const a = P.p([0, 0, 0]), b = P.p([0, 1, 0]); const L = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / L, (b[1] - a[1]) / L] as Pt; })()} s={34} o={win(f, t12, tAll)} />
        {[0, 1, 2].map((i) => <Lbl key={`r${i}`} x={X0 - 80} y={Y0 + i * cw * 0.7} t={`e${"₁₂₃"[i]}`} c={C.second} s={T.key} a="middle" o={fin(f, t11)} />)}
        {[0, 1, 2].map((j) => <Lbl key={`c${j}`} x={X0 + j * cw + 40} y={Y0 - 90} t={`e${"₁₂₃"[j]}`} c={C.second} s={T.key} a="middle" o={fin(f, t11)} />)}
        {[0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => <Lbl key={`${i}${j}`} x={X0 + j * cw + 40} y={Y0 + i * cw * 0.7} t={i === j ? "1" : "0"}
          c={i === j ? (pulse(f, tTab, 24) > 0 ? C.gold : C.key) : C.muted} s={T.calc + (i === j ? 14 * pulse(f, tTab, 24) : 0)} a="middle" o={fin(f, at(i, j))} />))}
        <Lbl x={MX} y={120} t="dot products of e₁, e₂, e₃" c={C.second} s={T.key} o={fin(f, 6) * fout(f, AT(k, 5, "Kronecker") - 8, 8)} />
        <Keyword f={f} text="Kronecker delta" at={[MX, 120]} appear={AT(k, 5, "Kronecker")} s={T.key} />
      </Svg>
      <TeX s={EQ_S29} x={MX + 380} y={230} size={56} ax={0} o={fin(f, tDef)} />
      <TeX s={String.raw`\delta_{ij}`} x={MX + 80} y={230} size={96} o={fin(f, tName)} />
    </Scene>
  );
};

// ================================================================ s30 the substitution trick
const S30: React.FC = () => {
  const f = useCurrentFrame(), k = K("s30_substitution");
  const tLook = SS(k, 1), tOut = SS(k, 2), t2 = SS(k, 3), tLeft = SS(k, 4), tEvery = SS(k, 5), tRes = SS(k, 6), tSwap = SS(k, 7);
  return (
    <Scene>
      <TeX s={String.raw`\delta_{ij}`} x={960} y={200} size={220} ax={0.5} c={C.local} o={fout(f, tLook, 8)} />
      <TeX s={String.raw`\delta_{ij}u_j`} x={960} y={160} size={96} ax={0.5} o={fin(f, tLook)} />
      <TeX s={String.raw`= \delta_{i1}u_1 + \delta_{i2}u_2 + \delta_{i3}u_3`} x={960} y={300} size={T.eq} ax={0.5} o={fin(f, tOut) * fout(f, t2 + 10)} />
      <TeX s={String.raw`i = 2:\ \ \delta_{21}u_1 + \delta_{22}u_2 + \delta_{23}u_3`} x={960} y={300} size={T.eq} ax={0.5} o={fin(f, t2 + 10)} />
      {([["0", 790], ["1", 1080], ["0", 1360]] as [string, number][]).map(([t, x]) => <TeX key={x} s={t} x={x} y={400} size={T.calc} ax={0.5} c={C.gold} o={fin(f, t2 + 40)} />)}
      <Svg>
        <Strike p={[730, 330]} q={[905, 270]} f={f} at={t2 + 50} />
        <Strike p={[1300, 330]} q={[1490, 270]} f={f} at={t2 + 60} />
      </Svg>
      <TeX s={String.raw`= u_2`} x={960} y={500} size={T.eq} ax={0.5} c={C.first} o={fin(f, tLeft)} />
      <TeX s={EQ_S30} x={960} y={650} size={T.calc} ax={0.5} o={fin(f, tRes)} />
      <TeX s={String.raw`\delta_{ij}u_j = u_i`} x={960} y={650} size={T.calc} ax={0.5} o={0} />
      <Svg>
        <Lbl x={960} y={785} t="j → i, and δ is gone" c={C.gold} s={T.key} a="middle" o={fin(f, tSwap)} />
        <Lbl x={1500} y={500} t="every i" c={C.muted} s={T.floor} o={fin(f, tEvery)} />
        <Keyword f={f} text="one useful trick" at={[1380, 110]} appear={6} out={tOut - 6} s={T.key} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s31 the balloon drifts with the wind
const S31: React.FC = () => {
  const f = useCurrentFrame(), k = K("s31_balloon_delta");
  const B: MapBox = crop({ lat0: 47.0, lat1: 50.0, lon0: -7.3, lon1: -2.24, x: 80, y: 40, w: 920, h: 820 });
  const P = mapP(B), O = P(BGP[0], BGP[1]);
  const tMap = SS(k, 1), tGrow = SS(k, 2), tD = SS(k, 3), tCarry = SS(k, 4), tCalc = SS(k, 5), tWords = SS(k, 6), tNum = SS(k, 7);
  const h = clamp((f - tWords) / (6 * FPS), 0, 1);
  const bal: Pt = P(BGP[0] + 120.6 * h * KM_LAT, BGP[1] + 20.9 * h * KM_LON);
  const we = clamp((f - tGrow) / 50, 0, 1), wn = clamp((f - tGrow - 50) / 50, 0, 1);
  const grad = Array.from({ length: 12 }, (_, i) => <stop key={i} offset={`${(i / 11) * 100}%`} stopColor={lutCss(LUT_H, i / 11)} />);
  return (
    <Scene>
      <MapView id="s31" B={B} L={{ relief: 0.0, coast: 0.85 }} children={(Pp) => (
        <g>
          <defs><linearGradient id="x1g" x1="0" x2="1" y1="0" y2="0">{grad}</linearGradient></defs>
          <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="url(#x1g)" opacity={0.7 * fin(f, tMap)} />
          {[-200, -150, -100, -50, 0, 50, 100, 150].map((km) => { const a = Pp(47, BGP[1] + km * KM_LON), b = Pp(50, BGP[1] + km * KM_LON);
            return <line key={km} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={km === 0 ? C.gold : C.key} strokeWidth={km === 0 ? 4 : 2} opacity={fin(f, tMap) * 0.8} />; })}
          <path d={linesPath(Pp, D.lines.coast_10m)} fill="none" stroke={C.key} strokeOpacity={0.85} strokeWidth={2} />
          <Walker p={[O[0] + we * 130, O[1] + 60]} a={0} o={win(f, tGrow, tGrow + 50)} s={1.3} />
          <Walker p={[O[0] - 60, O[1] - wn * 130]} a={90} o={win(f, tGrow + 50, tD)} s={1.3} />
          <line x1={O[0]} y1={O[1]} x2={bal[0]} y2={bal[1]} stroke={C.first} strokeWidth={5} strokeDasharray="10 8" opacity={h > 0 ? 1 : 0} />
          <Place p={O} r={10} />
          <BalloonThermometer x={bal[0]} y={bal[1]} s={0.7} o={fin(f, tWords)} />
        </g>
      )} />
      <Svg>
        <Keyword f={f} text="a map of x₁" at={[120, 780]} appear={tMap} s={T.key} />
        <ColourBar x={480} y={712} w={280} lut={LUT_H} lo={(B.lon0 - BGP[1]) / KM_LON} hi={(B.lon1 - BGP[1]) / KM_LON} unit="km east"
          ticks={[{ v: -200, t: "−200" }, { v: 0, t: "0" }, { v: 100, t: "100" }]} o={fin(f, tMap)} />
        <Lbl x={O[0] + 14} y={O[1] + 130} t="x₁ = 0" c={C.gold} s={T.floor} o={fin(f, tMap)} />
        <Keyword f={f} text="a weather balloon" at={[MX, 130]} appear={6} out={tGrow - 10} s={T.key} />
        <Lbl x={MX} y={130} t="+1 m per metre east · 0 north, up" c={C.key} s={T.floor} o={fin(f, tGrow)} />
        <g opacity={fin(f, tWords)}><ClockGlyph x={900} y={110} r={38} h={h * 12} /><Lbl x={840} y={110} t={`${fmt(h, 1)} h`} c={C.key} s={T.key} a="end" /></g>
        <Lbl x={MX} y={545} t="x₁ = how far east" c={C.gold} s={T.key} o={fin(f, AT(k, 1, "how far east")) * fout(f, tCalc, 10)} />
        <Lbl x={MX} y={640} t="5.8 m east, 33.5 m north per second" c={C.first} s={T.floor} o={fin(f, AT(k, 7, "five point eight"))} />
        <Lbl x={MX} y={720} t="≈ 120 km north in 1 h" c={C.first} s={T.key} o={fin(f, AT(k, 7, "one hundred and twenty"))} />
        <Lbl x={MX} y={790} t="position changes at the wind's velocity" c={C.key} s={T.floor} o={fin(f, tWords) * fout(f, tNum)} />
      </Svg>
      <TeX s={String.raw`\frac{\partial x_i}{\partial x_j} = \delta_{ij}`} x={MX} y={260} size={T.calc} o={fin(f, tD)} />
      <TeX s={EQ_S31} x={MX} y={440} size={60} o={fin(f, tCalc)} />
      {void tCarry}
    </Scene>
  );
};

// ================================================================ s32 two more facts
const S32: React.FC = () => {
  const f = useCurrentFrame(), k = K("s32_delta_facts");
  const t1 = SS(k, 1), t2 = SS(k, 2), tMov = SS(k, 3);
  const tStr = AT(k, 2, "into a sum of three");
  return (
    <Scene>
      <Svg><AxesGlyph O={[300, 330]} s={120} o={fin(f, 0)} />
        <Lbl x={300} y={500} t="3 directions" c={C.key} s={T.key} a="middle" o={fin(f, t1 + 30)} />
        <Lbl x={1800} y={790} t="tensors →" c={C.muted} s={T.floor} a="end" o={fin(f, tMov)} />
        {[1, 2, 3].flatMap((i) => [1, 2, 3].filter((j) => j !== i).map((j) => {
          const cx = 720 + (j - 1) * 190, cy = 430 + (i - 1) * 110;
          return <Strike key={`x${i}${j}`} p={[cx - 70, cy + 22]} q={[cx + 70, cy - 22]} f={f} at={tStr + 4 * (3 * i + j)} />;
        }))}
        <Lbl x={1360} y={430} t="9 terms" c={C.muted} s={T.key} o={fin(f, t2 + 40)} />
        <Lbl x={1360} y={540} t="→ 3 terms" c={C.gold} s={T.key} o={fin(f, tStr + 30)} />
      </Svg>
      <TeX s={String.raw`\delta_{ii} = 1 + 1 + 1 = 3`} x={620} y={240} size={T.eq} o={fin(f, t1)} />
      {[1, 2, 3].flatMap((i) => [1, 2, 3].map((j) => (
        <TeX key={`${i}${j}`} s={String.raw`p_${i}q_${j}`} x={720 + (j - 1) * 190} y={430 + (i - 1) * 110} size={T.calc} ax={0.5} c={i === j ? C.key : C.muted}
          o={fin(f, t2 + 4 * (3 * i + j), 8) * (i === j ? 1 : 1 - 0.45 * fin(f, tStr + 20))} />
      )))}
      <TeX s={String.raw`\delta_{ij}p_iq_j`} x={300} y={650} size={T.calc} o={fin(f, t2)} />
      <TeX s={String.raw`\delta_{ij}p_iq_j = p_iq_i = \mathbf p\cdot\mathbf q`} x={960} y={772} size={T.calc} ax={0.5} o={fin(f, AT(k, 2, "just p dot q"))} />
      <TeX s={EQ_S32} x={1190} y={540} size={44} o={0} />
    </Scene>
  );
};

// ================================================================ s33 recap
const S33: React.FC = () => {
  const f = useCurrentFrame(), k = K("s33_recap");
  const n = sc[k].sentences.length;
  const beat = (j: number) => fin(f, SS(k, j) + (j === 0 ? 4 : 0), 10) * (j < n - 1 ? fout(f, SS(k, j + 1) - 6, 10) : 1);
  const O: Pt = [480, 600], s = 34;
  const u: Pt = [O[0] + P18.u * 7, O[1] - P18.v * 7];
  return (
    <Scene>
      <Globe cam={GLOBE_BREST} field={IMGS.t2m} fieldO={T2M_O} dim={0.25} o={beat(0)} over={(G) => { const b = G.p(BREST[0], BREST[1], 1.002); return <g><Place p={b} r={10} /><Arrow p={b} q={[b[0] - 4.65 * 14, b[1] - 8.05 * 14]} color={C.first} /></g>; }} />
      <Svg>
        <Lbl x={MX} y={300} t="scalar: 10.3 °C" c={C.key} s={T.key} o={beat(0)} />
        <Lbl x={MX} y={400} t="vector: an arrow" c={C.first} s={T.key} o={beat(0)} />
        <g opacity={beat(1)}>
          <Arrow p={O} q={[O[0] - 4.65 * s, O[1] - 8.05 * s]} color={C.first} />
          <Dash p={O} q={[O[0] - 4.65 * s, O[1]]} c={C.neg} w={6} /><Dash p={[O[0] - 4.65 * s, O[1]]} q={[O[0] - 4.65 * s, O[1] - 8.05 * s]} c={C.first} w={6} />
          <Lbl x={MX} y={360} t="components · length = 9.3 m/s" c={C.key} s={T.key} />
        </g>
        <g opacity={beat(2)}>
          <Arrow p={O} q={u} color={C.first} />
          <Arrow p={O} q={[O[0] + 260, O[1]]} color={C.local} w={6} head={24} /><Arrow p={O} q={[O[0], O[1] - 260]} color={C.local} w={6} head={24} />
          <Arrow p={O} q={[O[0] + 260 * Math.cos(0.1745), O[1] - 260 * Math.sin(0.1745)]} color={C.second} w={6} head={24} />
          <Lbl x={MX} y={360} t="other axes: 34 m/s either way" c={C.key} s={T.key} />
        </g>
        <g opacity={beat(3)}>
          <Arrow p={[220, 700]} q={[520, 700]} color={C.first} /><Arrow p={[520, 700]} q={[600, 500]} color={C.second} /><Arrow p={[220, 700]} q={[600, 500]} color={SUMC} />
          <Arrow p={[700, 400]} q={[900, 300]} color={SUMC} />
          <Lbl x={MX} y={300} t="tip to tail · from q to p" c={C.key} s={T.key} />
          <Lbl x={MX} y={400} t="change · shear · anomaly" c={C.key} s={T.key} />
        </g>
        <Lbl x={MX} y={560} t="free index → three equations" c={C.key} s={T.key} o={beat(4)} />
        {/* S4: one line fans out into three equations */}
        <g opacity={beat(4)}>
          {(["u₁  east", "u₂  north", "u₃  up"] as string[]).map((t, i) => {
            const y = 330 + 170 * i, d = clamp((f - SS(k, 4) - 10 - 8 * i) / 14, 0, 1);
            return <g key={t}>
              <path d={`M 360 500 C 470 500, 470 ${y}, ${360 + 220 * d} ${y}`} fill="none" stroke={C.gold} strokeWidth={5} opacity={d > 0 ? 1 : 0} />
              <Lbl x={600} y={y} t={t} c={C.first} s={T.calc} o={fin(f, SS(k, 4) + 20 + 8 * i)} />
            </g>;
          })}
        </g>
        <Lbl x={MX} y={560} t="repeated index → summed" c={C.key} s={T.key} o={beat(5)} />
        <g opacity={beat(6)}><PoleThermometer x={480} y={620} s={1.5} /><Lbl x={MX} y={400} t="Brest: +3.7 K per hour" c={C.local} s={T.calc} /></g>
        <g opacity={beat(7)}>{[0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => <Lbl key={`${i}${j}`} x={320 + j * 120} y={380 + i * 100} t={i === j ? "1" : "0"} c={i === j ? C.gold : C.muted} s={T.calc} a="middle" />))}</g>
      </Svg>
      <TeX s={String.raw`u_i`} x={MX} y={400} size={T.eq} c={C.first} o={beat(4)} />
      <TeX s={String.raw`u_i`} x={330} y={500} size={T.hero} ax={1} c={C.first} o={beat(4)} />
      {/* S5: the advection over Brest, the real map */}
      <MapView id="s33m" B={{ ...ZBOX, x: 130, y: 110, w: 740, h: Math.round(740 * ZBOX.h / ZBOX.w) }} o={beat(5)} L={{ t850: [{ h: 18, o: 1 }], coast: 0.85 }} children={(Pp) => {
        const b = Pp(BGP[0], BGP[1]), gx = E8.dTdx_100km, gy = E8.dTdy_100km, gl = Math.hypot(gx, gy);
        return <g>
          <Iso P={Pp} levels={D.e850.t850["18"].iso} o={0.8} w={2} />
          <Arrow p={b} q={[b[0] + P18.u * 7, b[1] - P18.v * 7]} color={C.first} />
          <Arrow p={b} q={[b[0] + (gx / gl) * 200, b[1] - (gy / gl) * 200]} color={C.second} />
          <Lbl x={b[0] + (gx / gl) * 200 - 20} y={b[1] - (gy / gl) * 200 + 40} t="grad T" c={C.second} s={T.floor} a="end" />
          <Lbl x={b[0] + P18.u * 7 + 20} y={b[1] - P18.v * 7} t="wind" c={C.first} s={T.floor} />
          <Place p={b} r={10} />
        </g>;
      }} />
      <TeX s={rep(EQ_S00, "u_j", String.raw`u_{\textcolor{#d8b23a}{j}}`).replace("x_j", String.raw`x_{\textcolor{#d8b23a}{j}}`)} x={MX} y={400} size={T.eq} o={beat(5)} />
      <TeX s={EQ_S33} x={MX} y={700} size={50} o={beat(5) + beat(6) + beat(7)} />
      <TeX s={String.raw`\delta_{ij}u_j = u_i`} x={MX} y={400} size={T.eq} o={beat(7)} />
    </Scene>
  );
};

// ================================================================ s34 next movie: the alternating tensor
const S34: React.FC = () => {
  const f = useCurrentFrame(), k = K("s34_next");
  const tEps = AT(k, 0, "epsilon i j k"), tCross = AT(k, 1, "cross product"), tPush = AT(k, 1, "push"), tNext = SS(k, 2);
  const P = proj3(215 + 0.18 * f, 28, 150, [520, 440]);
  const nz = D.index.eps_nonzero as number[][];
  const val = (i: number, j: number, kk: number) => { const r = nz.find((x) => x[0] === i && x[1] === j && x[2] === kk); return r ? r[3] : 0; };
  const cells: { i: number; j: number; k: number; d: number }[] = [];
  for (let i = 1; i <= 3; i++) for (let j = 1; j <= 3; j++) for (let kk = 1; kk <= 3; kk++) cells.push({ i, j, k: kk, d: P.depth([i - 2, j - 2, kk - 2]) });
  cells.sort((a, b) => a.d - b.d);
  const MB: MapBox = { lat0: 47.6, lat1: 49.4, lon0: -6.2, lon1: -2.8, x: 1280, y: 420, w: 540, h: 400 };
  const PM = mapP(MB), b = PM(BGP[0], BGP[1]);
  const hu = [P18.u / E8.norm18, P18.v / E8.norm18];
  const sw = ease(clamp((f - tPush) / 30, 0, 1));
  const ang = -Math.PI / 2 * sw;
  const pv: Pt = [hu[0] * Math.cos(ang) - hu[1] * Math.sin(ang), hu[0] * Math.sin(ang) + hu[1] * Math.cos(ang)];
  return (
    <Scene>
      <Svg>
        {cells.map((c, q) => {
          const v = val(c.i, c.j, c.k), lit = fin(f, tEps, 12) * (v !== 0 ? 1 : 0), o = fin(f, 6 + q * 4, 8);
          const ctr: V3 = [c.i - 2, c.j - 2, c.k - 2], p = P.p(ctr);
          return <g key={`${c.i}${c.j}${c.k}`} opacity={o}>
            <circle cx={p[0]} cy={p[1]} r={36} fill={v > 0 ? C.first : v < 0 ? C.neg : C.grid} fillOpacity={v !== 0 ? 0.25 + 0.6 * lit : 0.35} stroke={C.muted} strokeWidth={2} />
            {v !== 0 && lit > 0 ? <Lbl x={p[0]} y={p[1]} t={v > 0 ? "+1" : "−1"} c={C.ink} s={T.floor} a="middle" o={lit} /> : null}
          </g>;
        })}
        <Keyword f={f} text="next movie" at={[520, 790]} a="middle" appear={tNext} s={T.key} />
      </Svg>
      <TeX s={String.raw`\varepsilon_{ijk}`} x={MX + 40} y={140} size={96} o={fin(f, tEps)} />
      <Svg><Lbl x={MX + 40} y={140} t="one more special symbol" c={C.key} s={T.key} o={fin(f, 6) * fout(f, tEps - 8, 8)} /></Svg>
      <TeX s={EQ_S34} x={MX + 40} y={300} size={T.calc} o={fin(f, tCross)} />
      <MapView id="s34" B={MB} o={fin(f, tPush - 10)} L={{ relief: 0.85, coast: 0.8 }} children={() => (
        <g>
          <Arrow p={b} q={[b[0] + hu[0] * 200, b[1] - hu[1] * 200]} color={C.first} w={8} head={30} />
          <Arrow p={b} q={[b[0] + pv[0] * 130, b[1] - pv[1] * 130]} color={VIOLET} w={8} head={30} o={fin(f, tPush)} />
          <Place p={b} r={8} />
        </g>
      )} />
    </Scene>
  );
};

// ================================================================ s35 end card (weather/climate ending, HOUSE_STYLE §3; fix loop 1 S23)
const S35: React.FC = () => {
  const f = useCurrentFrame(), k = K("s35_end");
  const t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const thumb = (x: number, i: number) => (
    <g key={i} opacity={0.75}>
      <rect x={x - 150} y={70} width={300} height={170} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
      {i === 0 ? <><Arrow p={[x - 90, 200]} q={[x + 80, 160]} color={C.first} w={7} head={24} /><Arrow p={[x - 90, 200]} q={[x - 10, 100]} color={C.second} w={7} head={24} /><line x1={x - 90} y1={200} x2={x + 26} y2={172} stroke={C.second} strokeWidth={14} opacity={0.6} /></> : null}
      {i === 1 ? <><path d={`M ${x - 90} 200 L ${x + 40} 200 L ${x + 90} 130 L ${x - 40} 130 Z`} fill="rgba(232,236,244,0.18)" stroke={C.ink} strokeWidth={3} /><Arrow p={[x - 90, 200]} q={[x - 90, 90]} color={VIOLET} w={7} head={24} /></> : null}
      {i === 2 ? <><Arrow p={[x - 80, 210]} q={[x + 60, 100]} color={C.first} w={7} head={24} /><line x1={x - 80} y1={210} x2={x + 60} y2={210} stroke={C.first} strokeWidth={4} strokeDasharray="8 6" /><line x1={x + 60} y1={210} x2={x + 60} y2={110} stroke={C.first} strokeWidth={4} strokeDasharray="8 6" /></> : null}
      {i === 3 ? <><circle cx={x} cy={155} r={55} fill="none" stroke={C.second} strokeWidth={5} />{[0, 1, 2, 3, 4, 5].map((q) => <Arrow key={q} p={[x + Math.cos(q) * 20, 155 + Math.sin(q) * 20]} q={[x + Math.cos(q) * 70, 155 + Math.sin(q) * 70]} color={C.first} w={4} head={14} />)}</> : null}
    </g>
  );
  const rel = ["epsilon and triple products", "dot product", "cross product", "cross product in physics", "gradient", "divergence", "material derivative",
    "vector identities I · II", "tensors", "Coriolis", "geostrophic wind", "thermal wind", "El Niño"];
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, 6)}>{[420, 760, 1100, 1440].map((x, i) => thumb(x, i))}</g>
        <Lbl x={960} y={315} t="a series of tutorials" c={C.key} s={T.calc} a="middle" o={fin(f, 10)} />
        <Lbl x={960} y={395} t="meteorology · atmospheric science · climate" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "meteorology"))} />
        <Lbl x={960} y={462} t="the ideas, and the maths behind them" c={C.gold} s={T.key} a="middle" o={fin(f, AT(k, 1, "the maths behind them"))} />
        <g opacity={fin(f, t2)}><Notebook x={300} y={545} s={0.42} /><Lbl x={370} y={545} t="vectors and index notation notebook" c={C.ink} s={T.key} /></g>
        <g opacity={fin(f, tOther)}>
          {[0, 1, 2].map((i) => <Notebook key={i} x={260 + i * 30} y={640 - i * 10} s={0.24} c={[C.second, VIOLET, C.muted][i]} o={0.9} />)}
          <Lbl x={370} y={630} t="notebooks for the other concepts" c={C.key} s={T.key} />
        </g>
        <g opacity={fin(f, tOther + 20) * 0.75}>
          {(() => {
            let x = 110, y = 695;
            return rel.map((t, i) => {
              const w = textW(t, T.floor) + 56;
              if (x + w > 1830) { x = 110; y += 52; }
              const el = <Lbl key={t} x={x} y={y} t={t} c={i === 0 ? C.key : C.muted} s={T.floor} b={i === 0} />;
              x += w;
              return el;
            });
          })()}
        </g>
      </Svg>
    </Scene>
  );
};

// ---------------------------------------------------------------- data-source lines (HOUSE_STYLE §5): dataset · time · place
// for every scene that plots real data (from manifest.json credits and the data's valid times); not spoken.
const SRC: Record<string, string> = {
  s00_title: "Data: ERA5 (Copernicus C3S) · 1 Nov 2023, 17–19 UTC · 850 hPa, Brittany",
  s01_hook: "Data: MODIS (NASA Worldview) · ERA5 (Copernicus C3S) 850 hPa wind · 1 Nov 2023, 18 UTC · North Atlantic",
  s02_scalar_globe: "Data: ERA5 (Copernicus C3S) 2-m temperature · 1 Nov 2023, 18 UTC · Brest-Guipavas SYNOP (NOAA ISD)",
  s03_scalar_word: "Data: ERA5 (Copernicus C3S) 2-m temperature · 1 Nov 2023, 18 UTC · Brest-Guipavas SYNOP (NOAA ISD)",
  s04_vector_wind: "Data: Brest-Guipavas SYNOP (NOAA ISD) · 1 Nov 2023, 18 UTC · relief ETOPO 2022 (NOAA)",
  s05_vector_field: "Data: ERA5 (Copernicus C3S) 850 hPa wind · MODIS (NASA Worldview) · 1 Nov 2023, 18 UTC · western Europe",
  s06_basis: "Relief: ETOPO 2022 (NOAA) · Brittany",
  s07_components_easy: "Relief: ETOPO 2022 (NOAA) · Brittany",
  s08_components_real: "Data: Brest-Guipavas SYNOP (NOAA ISD) · 1 Nov 2023, 18 UTC",
  s09_up_component: "Data: ERA5 (Copernicus C3S) 850 hPa · 1 Nov 2023, 18 UTC · over Brest · relief ETOPO 2022 (NOAA)",
  s10_magnitude: "Data: Brest-Guipavas SYNOP (NOAA ISD) · 1 Nov 2023, 18 UTC",
  s11_other_axes: "Data: ERA5 (Copernicus C3S) 850 hPa wind · 1 Nov 2023, 18 UTC · Brest · Blue Marble (NASA)",
  s12_position: "Relief: ETOPO 2022 (NOAA) · Brittany",
  s12a_add_tip_to_tail: "Data: NOAA GFS 250 hPa wind · 28 Oct 2026, 18 UTC · North Atlantic",
  s12d_add_geostrophic: "Data: ERA5 (Copernicus C3S) sea-level pressure, 10-m wind · 1 Nov 2023, 18 UTC · Storm Ciarán · MODIS (NASA)",
  s12f_subtract_hour: "Data: ERA5 (Copernicus C3S) 850 hPa · 1 Nov 2023, 17 and 18 UTC · Brest",
  s12g_shear_hodograph: "Data: IGRA2 radiosonde (NOAA NCEI) · Trappes, near Paris · 1 Nov 2023, 00 UTC",
  s12h_anomaly: "Data: ERA5 (Copernicus C3S) monthly 10-m wind · Nov 2023 and Nov 1991–2020 · tropical Pacific",
  s12i_relative: "Data: ERA5 (Copernicus C3S) · Storm Ciarán, 1 Nov 18 UTC – 2 Nov 00 UTC · MODIS (NASA Worldview)",
  s14_free_index: "Data: ERA5 (Copernicus C3S) 850 hPa · 1 Nov 2023, 17 and 18 UTC · Brest",
  s15_dot_product: "Data: ERA5 (Copernicus C3S) 850 hPa wind · 1 Nov 2023, 18 UTC · Brest · Blue Marble (NASA)",
  s18_length_index: "Data: ERA5 (Copernicus C3S) 850 hPa wind · 1 Nov 2023, 18 UTC · Brest · Blue Marble (NASA)",
  s20_gradient: "Data: ERA5 (Copernicus C3S) 850 hPa temperature · 1 Nov 2023, 18 UTC · Brittany",
  s21_advection_built: "Data: ERA5 (Copernicus C3S) 850 hPa · 1 Nov 2023, 18 UTC · Brittany",
  s24_real_map: "Data: ERA5 (Copernicus C3S) · 1 Nov 2023, 18 UTC · Europe",
  s25_real_gradient: "Data: ERA5 (Copernicus C3S) 850 hPa temperature · 1 Nov 2023, 18 UTC · Brest",
  s26_real_sum: "Data: ERA5 (Copernicus C3S) 850 hPa · 1 Nov 2023, 18 UTC · Brest",
  s27_real_check: "Data: ERA5 (Copernicus C3S) 850 hPa over Brest, 17–19 UTC · Brest-Guipavas SYNOP (NOAA ISD), 17–21 UTC · 1 Nov 2023",
  s31_balloon_delta: "Data: ERA5 (Copernicus C3S) 850 hPa wind · 1 Nov 2023, 18 UTC · Brest",
  s33_recap: "Data: ERA5 (Copernicus C3S) · 1 Nov 2023, 18 UTC · Brest",
  s34_next: "Data: ERA5 (Copernicus C3S) 850 hPa wind · 1 Nov 2023, 18 UTC · Brest · Blue Marble (NASA)",
};
/** source-line x where the picture zone bottom is taken (s24: the colour bar sits under the map) */
const SRC_X: Record<string, number> = {};
// ================================================================ assembly
const SCENES: React.FC[] = [S00, S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S12A, S12B, S12C, S12D, S12E, S12F, S12G, S12H, S12I,
  S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27, S28, S29, S30, S31, S32, S33, S34, S35];
Object.keys(SRC).forEach((id) => K(id));
if (SCENES.length !== sc.length) throw new Error(`${SCENES.length} scene components but ${sc.length} scenes in timing.json`);
void [END, GBOX, LUT_S, lerp, gcDest, Ring, EQ_S12A, EQ_S08, EQ_S26, EQ_S07];
export const VectorsIndexNotation: React.FC<{ audio?: string }> = ({ audio = "narration_music.wav" }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {SCENES.map((S, k) => (
      <Sequence key={sc[k].id} name={sc[k].id} from={CUT[k]} durationInFrames={LEN(k) + (k < SCENES.length - 1 ? XF : 0)}><S />{SRC[sc[k].id] ? <SrcLine t={SRC[sc[k].id]} x={SRC_X[sc[k].id] ?? 80} /> : null}</Sequence>
    ))}
    {audio ? <Audio src={staticFile(audio)} /> : null}
  </AbsoluteFill>
);
