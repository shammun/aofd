// ch00_gradient scenes s28-s39: Storm Ciarán's pressure gradient force, crowded isobars and strong winds, why the wind blows along
// the isobars, the latest chart, the vertical pressure gradient, fronts, the Elliott front stack (s33b), advection, the sea breeze,
// the jet, the Gulf Stream, the recap and the series end card. Every number on screen is read from data/gr.json.
import React from "react";
import { useCurrentFrame } from "remotion";
import { PoleThermometer } from "../house";
import { C, T } from "../house/kit/type";
import { Band, Bracket, Pt, RightTick, textW } from "../house/kit/draw";
import { CalcStack, TeX } from "../house/kit/tex";
import { Keyword } from "../house/kit/notes";
import { GlobeFrame, SourceBelow } from "../house/kit/frame";
import { AnimatedWindArrow, FlowParticles } from "../house/kit/wind";
import { Notebook } from "../house/kit/icons";
import { View3D as HView3D, Ball3D as HBall3D, Arrow3D as HArrow3D } from "../house/kit/three3d";
import { ColumnFaces } from "../house/kit/col3d";
import { LayerStack3D, StackLayer } from "../house/kit/stack3d";
import { orbitCam as hOrbitCam, orbitPath as hOrbitPath, projector as hProjector, V3 } from "../house/kit/cam";
import { globePath, useTex } from "./kit_gr/globe";
import {
  AT, Arrow, Ax, Axes, BROWN, ClockText, ColourBar, D, D2R, ForceArrow, GFULL, GeoImg, GeoMap, Globe, IMG, K, LEN, LUT_AMP, LUT_SP, LUT_TH, Lbl, MapBox, PGF, Place,
  SS, SE, Scene, SideCallout, SoftEdges, Svg, VIOLET, arcD, axP, boxAt, clamp, edges, fin, fitX, fout, linesPath, mapP, mix, nf, poly, prog, win, zoomBox, ArcHead,
  HillIcon, ThermoIcon, BaroIcon,
} from "./gr_lib";
import { SingaporeFloor } from "./gr_3d";
import { T850Map } from "./gr_sB";
import { EQ_S32, EQ_S34 } from "./gr_eq";

const MSL = D.msl, T8 = D.t850, SG = D.sing, GF = D.gfs, FR = D.front, SB = D.sb, ZM = D.zm, JT = D.jet, SST = D.sst;
const CHECK_D: [string, number, number, number][] = [
  ["centre", MSL.centre[2], 954, 0.5], ["dist", MSL.brest.dist_c, 200, 15], ["spacing", MSL.brest.spacing, 31, 0.15], ["grad", MSL.brest.mag, 13, 0.15],
  ["fmag", MSL.brest.fmag, 0.01, 0.0005], ["gain", MSL.brest.gain, 37, 0.1], ["bin0", MSL.bins.mean[0], 10, 0.05], ["bin5", MSL.bins.mean[5], 26, 0.5],
  ["gust", MSL.gust_kt, 84, 0], ["gust kmh", MSL.gust_kt * 1.852, 156, 0.5], ["gfs low", GF.centre[2], 961, 0.5], ["gfs grad", GF.gmax[0], 10, 0.4], ["gfs wind", GF.wmax[0], 25, 0.6],
  ["dpdz", -SG.dpdz / 100, 0.11, 0.001], ["m per hPa", -100 / SG.dpdz, 9, 0.2], ["ciak", SG.ciak, 8, 0.25], ["ratio", SG.ratio, 850, 30], ["rho", SG.rho, 1.17, 0.005],
  ["rhog", SG.rhog, 11.5, 0.05], ["balloon", -SG.dpdz, 10.9, 0.02], ["band max", T8.stats.max, 11, 0.4], ["median", T8.stats.median, 1, 0.05],
  ["wind", T8.wind.spd, 34, 0.01], ["ang", T8.wind.ang, 138, 0.3], ["dTds", T8.wind.dTds, -3.0, 0.02], ["adv", T8.wind.adv, -3.7, 0.02],
  ["sb land", SB.inland[2], 24.6, 0.05], ["sb sea", SB.sea[2], 16.1, 0.05], ["sb dist", SB.dist, 55.6, 0.05], ["sb grad", SB.grad, 15, 0.35],
  ["steep", ZM.steep[1], -6, 0.4], ["steep lat", ZM.steep[0], 45, 0.5], ["jet", ZM.jet[0], 26, 0.4], ["jet z", ZM.jet[3], 12, 0.2], ["gfs jet", JT.max[0], 66, 0.1],
  ["kmh", JT.max[0] * 3.6, 240, 2.5], ["sst drop", SST.drop, 6.5, 0.03], ["sst dist", SST.dist, 35, 0.25], ["front lo", FR.range[0], 260, 5], ["front hi", FR.range[1], 450, 1],
];
CHECK_D.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

/** Ciarán's sea-level map, 03 UTC 2 Nov 2023 (isobars every 4 hPa, the tracked low) with optional wind speed and streaks */
const CiaranMap: React.FC<{ id: string; B: MapBox; o?: number; f: number; speed?: number; streak?: number; fade?: number }> = ({ id, B, o = 1, f, speed = 0, streak = 0, fade = 0 }) => (
  <GeoMap id={id} B={B} o={o} fade={fade} frame={0.6}>
    {(P) => <>
      {speed > 0 ? <GeoImg P={P} href={IMG("cia_speed.png")} box={edges(MSL.img_box)} o={speed} /> : null}
      <path d={linesPath(P, D.lines.europe_coast)} fill="none" stroke={C.key} strokeOpacity={0.8} strokeWidth={2} />
      {MSL.isobars.map((L: { level: number; lines: number[][] }) => <path key={L.level} d={linesPath(P, L.lines)} fill="none" stroke={C.ink} strokeOpacity={0.9} strokeWidth={2.5} />)}
      {streak > 0 ? <FlowParticles P={(la, lo) => P(la, lo)} tracks={MSL.tracks} fr={f / 2} tail={8} w={2.5} c={C.first} o={streak} /> : null}
    </>}
  </GeoMap>
);
const M28: MapBox = boxAt(49.5, -5.0, 11.0, 80, 40, 1100, 780);   // K6 r1: h 780 (source line above y 880)
const Z28: MapBox = boxAt(48.6, -4.5, 2.4, 80, 40, 1100, 780);

// ================================================================ s28 Ciarán's pressure gradient force
const S28: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28_ciaran_push");
  const tStorm = SS(k, 0), tHere = SS(k, 1), tCen = SS(k, 2), tBr = SS(k, 3), tCalc = SS(k, 4), tGrad = SS(k, 5), tForce = SS(k, 6), tDiv = SS(k, 7), tHour = SS(k, 8);
  const zi = prog(f, tBr - 10, tBr + 35), zo = prog(f, SE(k, 8) - 10, LEN(k) - 4);
  const B = zoomBox(zoomBox(M28, Z28, zi), M28, zo);
  const P = mapP(B);
  const br = P(MSL.brest.at[0], MSL.brest.at[1]), cen = P(MSL.centre[0], MSL.centre[1]);
  const g = Math.hypot(MSL.brest.gx, MSL.brest.gy), u: Pt = [MSL.brest.gx / g, -MSL.brest.gy / g];
  const b0 = P(MSL.brest.bracket[0][0], MSL.brest.bracket[0][1]), b1 = P(MSL.brest.bracket[1][0], MSL.brest.bracket[1][1]);
  const L = zi - zo;
  return (
    <Scene>
      <CiaranMap id="s28" B={B} f={f} fade={0.8 * L} />
      <Svg>
        <Place p={cen} t="L" r={0} dx={0} dy={0} a="middle" s={T.calc} o={fin(f, tCen)} />
        <Place p={br} t="Brest" dx={-22} dy={-38} a="end" o={fin(f, tCen + 20)} />
        <g opacity={fin(f, tBr + 30) * fout(f, SE(k, 8) - 20)}>
          <line x1={b0[0]} y1={b0[1]} x2={b1[0]} y2={b1[1]} stroke={C.gold} strokeWidth={6} />
          {[b0, b1].map((q, i) => <line key={i} x1={q[0] - u[1] * 18} y1={q[1] + u[0] * 18} x2={q[0] + u[1] * 18} y2={q[1] - u[0] * 18} stroke={C.gold} strokeWidth={6} />)}
        </g>
        <Arrow p={br} q={[br[0] + u[0] * 170, br[1] + u[1] * 170]} color={C.second} o={fin(f, tGrad) * fout(f, tForce + 10) * fout(f, SE(k, 8) - 20)} />
        <ForceArrow p={br} q={[br[0] - u[0] * 170, br[1] - u[1] * 170]} o={fin(f, tForce + 10) * fout(f, SE(k, 8) - 20)} w={10} head={40} />
        <SideCallout f={f} lines="centre ≈ 954 hPa" at={[1240, 110]} appear={tCen + 10} out={tBr - 6} target={[cen[0] + 20, cen[1]]} s={T.key} bend={30} />
        <Lbl x={1240} y={190} t="isobars every 4 hPa" c={C.key} s={T.floor} o={fin(f, tHere) * fout(f, tBr - 6)} />
        <SideCallout f={f} lines="isobars 31 km apart" at={[1240, 600]} appear={tBr + 34} out={tGrad - 12} target={[mix(b0[0], b1[0], 0.5) + 12, mix(b0[1], b1[1], 0.5)]} s={T.key} bend={30} />
        <SideCallout f={f} lines="∇p: towards SSW" at={[1240, 680]} appear={tGrad} out={tForce - 6} target={[br[0] + u[0] * 120, br[1] + u[1] * 120]} s={T.key} bend={-30} />
        <SideCallout f={f} lines="force: towards NNE" at={[1240, 680]} appear={tForce + 12} out={SE(k, 8) - 30} target={[br[0] - u[0] * 120 + 10, br[1] - u[1] * 120]} s={T.key} bend={30} />
        <ClockText x={1270} y={790} t="in 1 h" h={clamp((f - tHour - 10) / 60, 0, 1)} o={fin(f, tHour) * fout(f, LEN(k) - 20)} />
      </Svg>
      {/* K6 r1: "per 100 km" on its own line (the row reached x 1952); fraction rows 115 px (they touched) */}
      <CalcStack f={f} x={1500} y={220} size={50} maxLines={3} rows={[
        { lhs: String.raw`\frac{4\ \mathrm{hPa}}{31\ \mathrm{km}}`, rhs: String.raw`\approx13\ \mathrm{hPa}`, at: tCalc, h: 115 },
        { rhs: String.raw`\mathrm{per\ 100\ km}`, at: tCalc, cont: true },
        { lhs: String.raw`\frac{0.0129\ \mathrm{Pa/m}}{1.25}`, rhs: String.raw`\approx0.01\ \mathrm{m/s^2}`, at: tDiv, h: 115 },
        { lhs: String.raw`0.0103\times3600`, rhs: String.raw`\approx37\ \mathrm{m/s}`, at: tHour + 20 },
      ]} o={fout(f, LEN(k) - 20)} />
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 2 Nov 2023, 03 UTC" pic={{ x: M28.x, y: M28.y, w: M28.w, h: M28.h }} w={1100} name="s28 src" />
    </Scene>
  );
};

// ================================================================ s29 crowded isobars, strong winds
const M29: MapBox = boxAt(49.5, -10.0, 15.0, 80, 40, 920, 730);
const BA: Ax = { x: 1150, y: 270, w: 620, h: 300, xr: [0, 6], yr: [0, 30] };   // K6 r1: the axis word sat on the colour bar's ticks
const S29: React.FC = () => {
  const f = useCurrentFrame(), k = K("s29_crowded_winds");
  const tWhy = SS(k, 0), tSort = SS(k, 1), tLow = SS(k, 2), tHigh = SS(k, 3), tGust = SS(k, 4), tPow = SS(k, 5);
  const P = mapP(M29);
  const means = MSL.bins.mean as number[];
  const lab = ["0–2", "2–4", "4–6", "6–8", "8–10", ">10"];
  const br = P(MSL.airport[0], MSL.airport[1]);
  const bx = (i: number) => axP(BA)(i + 0.15, 0)[0], bw = (BA.w / 6) * 0.7;
  return (
    <Scene>
      <CiaranMap id="s29" B={M29} f={f} speed={1} streak={1} />
      <Svg>
        <Place p={br} t="Brest" dx={-20} dy={-36} a="end" o={fin(f, tGust - 20)} />
        <ColourBar x={1150} y={110} w={330} lut={LUT_SP} lo={0} hi={30} unit="m/s" title="10-m wind" ticks={[{ v: 0, t: "0" }, { v: 15, t: "15" }, { v: 30, t: "30" }]} />
        <g opacity={fin(f, tSort)}>
          <Axes A={BA} xt={[]} yt={[0, 10, 20, 30]} yl="mean wind (m/s)" grid />
          {lab.map((l, i) => <Lbl key={l} x={bx(i) + bw / 2} y={BA.y + BA.h + 32} t={l} c={C.muted} s={T.floor} a="middle" b={false} />)}
          <Lbl x={BA.x + BA.w} y={BA.y + BA.h + 84} t="|∇p| (hPa per 100 km)" c={C.muted} s={T.floor} a="end" b={false} />
          {means.map((m, i) => { const top = axP(BA)(0, m * prog(f, tSort + 10 + 8 * i, tSort + 30 + 8 * i))[1];
            return <rect key={i} x={bx(i)} y={top} width={bw} height={BA.y + BA.h - top} fill={C.first} opacity={0.85}
              stroke={(i === 0 && f >= tLow) || (i === 5 && f >= tHigh) ? C.gold : "none"} strokeWidth={5} />; })}
        </g>
        <Lbl x={bx(0) + bw / 2} y={axP(BA)(0, means[0])[1] - 30} t="10" c={C.key} s={T.key} a="middle" o={fin(f, tLow)} />
        <Lbl x={bx(5) + bw / 2} y={axP(BA)(0, means[5])[1] - 30} t="≈ 26" c={C.key} s={T.key} a="middle" o={fin(f, tHigh)} />
        <SideCallout f={f} lines="gust 84 kt ≈ 156 km/h" at={[1150, 720]} appear={tGust + 10} target={[br[0] + 14, br[1] + 4]} s={T.key} bend={40} />
        <g opacity={fin(f, tPow)}>
          <path d="M 1166 840 l 14 -70 l 14 70 M 1170 816 l 20 0 M 1174 794 l 12 0" fill="none" stroke={C.local} strokeWidth={4} />
          <Lbl x={1215} y={772} t="over 1 million homes" c={C.key} s={T.floor} />
          <Lbl x={1215} y={824} t="without power" c={C.key} s={T.floor} />
        </g>
      </Svg>
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · ISD (NOAA NCEI) Brest · 2 Nov 2023, 03 UTC" pic={{ x: M29.x, y: M29.y, w: M29.w, h: M29.h }} w={920} name="s29 src" />
    </Scene>
  );
};

// ================================================================ s30 why the wind blows along the isobars (pointer to Coriolis)
const S30: React.FC = () => {
  const f = useCurrentFrame(), k = K("s30_coriolis");
  const tLook = SS(k, 0), tNot = SS(k, 1), tAlong = SS(k, 2), tTurn = SS(k, 3), tBal = SS(k, 4), tBig = SS(k, 5), tDeep = SS(k, 6), tFric = SS(k, 7), tBuilt = SS(k, 8), tWarn = SS(k, 9);
  const P = mapP(M29);
  const cen = P(MSL.centre[0], MSL.centre[1]);
  const wa = (MSL.warrows as number[][]).filter((_, i) => i % 2 === 0);
  const grow = 1 + 0.5 * prog(f, tBig, tBig + 40);
  const bc: Pt = [1450, 470], wl = 150 * grow;
  const fr = fin(f, tFric);
  return (
    <Scene>
      <CiaranMap id="s30" B={M29} f={f} />
      <Svg>
        {wa.map((a, i) => { const p0 = P(a[0], a[1]), s = 2.4; const sp = Math.hypot(a[2], a[3]);
          return <AnimatedWindArrow key={i} from={p0} to={[p0[0] + a[2] * s, p0[1] - a[3] * s]} speed={sp} f={f} c={C.first} px={5} head={16} o={fin(f, tLook) * 0.95} />; })}
        <Place p={cen} t="L" r={0} dx={0} dy={0} a="middle" s={T.calc} />
        <path d={arcD(cen, 130, 200, 340)} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tAlong)} />
        <ArcHead c={cen} r={130} a={340} dir={1} col={C.gold} o={fin(f, tAlong)} s={24} />
        <Lbl x={1100} y={110} t="anticlockwise, seen from above" c={C.key} s={T.floor} o={fin(f, AT(k, 2, "anticlockwise"))} />
        <Lbl x={1100} y={180} t="Earth turns: Coriolis" c={VIOLET} s={T.key} o={fin(f, tTurn)} />
        <g opacity={fin(f, tBal)}>
          <line x1={bc[0] - 240} y1={bc[1]} x2={bc[0] + 240} y2={bc[1]} stroke={C.ink} strokeWidth={3} strokeOpacity={0.7} />
          <ForceArrow p={bc} q={[bc[0], bc[1] - 120 * grow]} w={9} head={34} />
          <Arrow p={bc} q={[bc[0] - Math.sin(fr * 12 * D2R) * 0, bc[1] + 120 * grow]} color={VIOLET} w={9} head={34} />
          <Arrow p={[bc[0] - wl / 2, bc[1] + fr * 14]} q={[bc[0] + wl / 2, bc[1] - fr * 18]} color={C.first} w={10} head={36} />
          <Lbl x={bc[0] + 20} y={bc[1] - 150 * grow} t="pressure push" c={PGF} s={T.floor} />
          <Lbl x={bc[0] + 20} y={bc[1] + 150 * grow} t="Coriolis" c={VIOLET} s={T.floor} />
          <Lbl x={bc[0] + wl / 2 + 20} y={bc[1] - 20} t="wind" c={C.first} s={T.floor} />
        </g>
        <Lbl x={1100} y={790} t="balance: wind along the isobars" c={C.key} s={T.floor} o={win(f, tBal + 30, tFric - 20)} />
        <Lbl x={1100} y={790} t="friction: slightly towards L" c={C.key} s={T.floor} o={win(f, tFric, tBuilt - 20)} />
        <Lbl x={1100} y={790} t="cross product · Coriolis movies" c={C.muted} s={T.floor} o={win(f, tBuilt, tWarn - 20)} />
        <Lbl x={1100} y={790} t="“gradient wind” ≠ gradient" c={C.gold} s={T.key} o={fin(f, tWarn)} />
      </Svg>
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 2 Nov 2023, 03 UTC" pic={{ x: M29.x, y: M29.y, w: M29.w, h: M29.h }} w={920} name="s30 src" />
    </Scene>
  );
};

// ================================================================ s31 the latest chart: GFS, 27 Oct 2026, 18 UTC
const M31: MapBox = boxAt(65.5, -15.0, 21.0, 80, 40, 800, 780);
const S31: React.FC = () => {
  const f = useCurrentFrame(), k = K("s31_latest_chart");
  const tHere = SS(k, 0), tLow = SS(k, 1), tGrad = SS(k, 2), tWind = SS(k, 3);
  const P = mapP(M31);
  const cen = P(GF.centre[0], GF.centre[1]), pg = P(GF.gmax[1], GF.gmax[2]), pw = P(GF.wmax[1], GF.wmax[2]);
  return (
    <Scene>
      <GeoMap id="s31" B={M31} frame={0.6}>
        {(Pm) => <>
          <GeoImg P={Pm} href={IMG("gfs_speed.png")} box={edges(GF.img_box)} o={0.9} />
          <path d={linesPath(Pm, D.lines.natl_coast)} fill="none" stroke={C.key} strokeOpacity={0.85} strokeWidth={2} />
          {GF.isobars.map((L: { level: number; lines: number[][] }) => <path key={L.level} d={linesPath(Pm, L.lines)} fill="none" stroke={C.ink} strokeOpacity={0.9} strokeWidth={2.5} />)}
        </>}
      </GeoMap>
      <Svg>
        <Place p={cen} t="L" r={0} dx={0} dy={0} a="middle" s={T.calc} o={fin(f, tLow)} />
        <Place p={P(64.9, -18.6)} t="Iceland" r={0} dx={0} dy={0} a="middle" italic o={fin(f, AT(k, 1, "Iceland"))} />
        <ColourBar x={940} y={110} w={330} lut={LUT_SP} lo={0} hi={30} unit="m/s" title="10-m wind" ticks={[{ v: 0, t: "0" }, { v: 15, t: "15" }, { v: 30, t: "30" }]} />
        <SideCallout f={f} lines="low ≈ 961 hPa" at={[940, 470]} appear={tLow + 10} target={[cen[0] + 26, cen[1] - 6]} s={T.key} bend={30} />
        <SideCallout f={f} lines={["≈ 10 hPa per 100 km", "close to Ciarán’s 13"]} at={[940, 300]} appear={tGrad + 10} target={[pg[0] + 10, pg[1] + 4]} s={T.key} bend={-30} />
        <SideCallout f={f} lines="wind ≈ 25 m/s" at={[940, 690]} appear={tWind + 10} target={[pw[0] - 12, pw[1] + 4]} s={T.key} bend={-40} />
        <circle cx={pg[0]} cy={pg[1]} r={12} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tGrad + 10)} />
        <circle cx={pw[0]} cy={pw[1]} r={12} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tWind + 10)} />
      </Svg>
      <SourceBelow text="Data: NOAA NCEP GFS analysis · 27 Oct 2026, 18 UTC" pic={{ x: M31.x, y: M31.y, w: M31.w, h: M31.h }} w={800} name="s31 src" />
    </Scene>
  );
};

// ================================================================ s32 the vertical pressure gradient and hydrostatic balance
const ZS2 = 0.4;
const S32: React.FC = () => {
  const f = useCurrentFrame(), k = K("s32_vertical_pressure");
  const tUp = SS(k, 0), tBal = SS(k, 1), tCia = SS(k, 2), t850 = SS(k, 3), tOrd = SS(k, 4), tWhy = SS(k, 5), tGrav = SS(k, 6), tHyd = SS(k, 7), tNum = SS(k, 8), tCan = SS(k, 9), tPc = SS(k, 10);
  const st = hOrbitCam({ ...hOrbitPath([{ f: 0, az: 240, el: 18, dist: 36, target: [0, 0, 5.5] }, { f: LEN(k), az: 262, el: 20, dist: 36, target: [0, 0, 5.5] }], f), fov: 30 }, [330, 420]);
  const oQ = fin(f, tWhy) * fout(f, tPc);
  return (
    <Scene>
      <HView3D st={st} x={30} y={30} w={660} h={800}>
        <SingaporeFloor />
        <ColumnFaces top={35 * ZS2} x0={-1} x1={1} y0={-1} y1={1} faceO={0.22} fade={(t) => Math.exp(-2.2 * t)} />
        {oQ > 0 ? <HBall3D at={[0, 0, 2.2]} px={50} color="#eef2f8" o={oQ} /> : null}
        {oQ > 0 ? <HArrow3D from={[0, 0, 2.6]} to={[0, 0, 5.0]} color={PGF} px={10} head={36} o={oQ} /> : null}
        {oQ > 0 ? <HArrow3D from={[0, 0, 1.8]} to={[0, 0, -0.6]} color={BROWN} px={10} head={36} o={oQ * fin(f, tGrav)} /> : null}
      </HView3D>
      <SoftEdges id="s32" box={{ x: 30, y: 30, w: 660, h: 800 }} px={50} />
      <Svg>
        <g opacity={fin(f, tBal) * fout(f, tHyd - 6)}>
          {Array.from({ length: 6 }, (_, i) => <g key={i}><line x1={760} y1={760 - i * 100} x2={880} y2={760 - i * 100} stroke={C.ink} strokeWidth={3} />
            <Lbl x={895} y={760 - i * 100} t={`${1008 - i} hPa`} c={C.muted} s={T.floor} b={false} /></g>)}
          <Bracket p={[740, 760]} q={[740, 660]} c={C.gold} />
          <Lbl x={720} y={710} t="≈ 9 m" c={C.gold} s={T.key} a="end" />
        </g>
        <Lbl x={1100} y={100} t="up: 1 hPa per ≈ 9 m" c={C.key} s={T.key} o={fin(f, tBal) * fout(f, tHyd - 6)} />
        <g opacity={fin(f, tCia) * fout(f, tHyd - 6)}>
          <line x1={1100} y1={260} x2={1100} y2={420} stroke={C.ink} strokeWidth={3} /><line x1={1700} y1={260} x2={1700} y2={420} stroke={C.ink} strokeWidth={3} />
          <Bracket p={[1100, 440]} q={[1700, 440]} c={C.gold} />
          <Lbl x={1100} y={496} t="Ciarán: 4 hPa in 31 km" c={C.key} s={T.floor} />
          <Lbl x={1100} y={548} t="≈ 1 hPa per 8 km" c={C.key} s={T.floor} />
        </g>
        <Lbl x={1100} y={622} t="≈ 850× stronger" c={C.gold} s={T.calc} o={fin(f, t850) * fout(f, tHyd - 6)} />
        <Lbl x={1100} y={706} t="ordinary day ≈ 10 000×" c={C.key} s={T.key} o={fin(f, tOrd) * fout(f, tHyd - 6)} />
        <Lbl x={1100} y={790} t="balanced by gravity" c={BROWN} s={T.key} o={fin(f, tGrav)} />
        <Lbl x={1100} y={600} t="weather: the tiny sideways part" c={C.key} s={T.floor} o={fin(f, tCan) * fout(f, tPc)} />
        <Lbl x={1100} y={690} t="pressure coordinates" c={C.muted} s={T.key} o={fin(f, tPc)} />
      </Svg>
      <TeX s={EQ_S32} x={1100} y={190} size={T.eq} o={fin(f, tHyd)} />
      <CalcStack f={f} x={1500} y={330} size={52} rows={[
        { lhs: String.raw`1.17\times9.81`, rhs: String.raw`\approx11.5\ \mathrm{Pa/m}`, at: tNum },
        { lhs: String.raw`\text{balloon}`, rhs: String.raw`\approx10.9\ \mathrm{Pa/m}`, at: tNum + 70 },
      ]} o={fin(f, tHyd)} />
      <SourceBelow text="Data: IGRA v2 (NOAA NCEI) · Singapore · 1 Nov 2023 · ERA5 (Ciarán)" pic={{ x: 30, y: 30, w: 660, h: 770 }} w={1000} name="s32 src" />
    </Scene>
  );
};

// ================================================================ s33 temperature gradients at fronts
const M33: MapBox = boxAt(48.5, -9.0, 13.0, 80, 40, 1100, 780);
const S33: React.FC = () => {
  const f = useCurrentFrame(), k = K("s33_fronts");
  const tBack = SS(k, 0), tMap = SS(k, 1), tMost = SS(k, 2), tBand = SS(k, 3), tFront = SS(k, 4), tSq = SS(k, 5), tArr = SS(k, 6);
  const P = mapP(M33);
  const mx = P(T8.stats.max_at[0], T8.stats.max_at[1]), qt = P(T8.quiet[0], T8.quiet[1]);
  const band = T8.band as number[];
  return (
    <Scene>
      <T850Map id="s33" B={M33} img="gradt850.png" arrows={fin(f, tArr)} list={T8.farrows} iso={0.45} />
      <Svg>
        <path d={linesPath(P, [band])} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tBand)} />
        <circle cx={qt[0]} cy={qt[1]} r={12} fill="none" stroke={C.muted} strokeWidth={5} opacity={fin(f, tMost)} />
        <ColourBar x={1240} y={150} w={330} lut={LUT_AMP} lo={0} hi={12} unit="K" title={["|∇T|", "per 100 km"]} ticks={[{ v: 0, t: "0" }, { v: 6, t: "6" }, { v: 12, t: "12" }]} />
        <SideCallout f={f} lines="≈ 1" at={[1240, 450]} appear={tMost + 10} target={[qt[0] + 14, qt[1]]} s={T.calc} c={C.muted} bend={40} />
        <SideCallout f={f} lines="≈ 11" at={[1240, 330]} appear={tBand + 10} target={[mx[0] + 14, mx[1]]} s={T.calc} bend={-30} />
        <Keyword f={f} text="front" at={[1240, 580]} appear={tFront} />
        <Lbl x={1240} y={670} t="over 10× stronger" c={C.key} s={T.key} o={fin(f, tSq)} />
        <Lbl x={1240} y={760} t="arrows → warm side" c={C.second} s={T.key} o={fin(f, tArr)} />
      </Svg>
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 1 Nov 2023, 18 UTC · 850 hPa" pic={{ x: M33.x, y: M33.y, w: M33.w, h: M33.h }} w={1100} name="s33 src" />
    </Scene>
  );
};

// ================================================================ s33b a front in 3-D: Winter Storm Elliott, 12 UTC 22 Dec 2022 (four layers)
const FB = FR.box as number[];
const FLC = (FB[0] + FB[1]) / 2, FOC = (FB[2] + FB[3]) / 2, FKX = (111.32 * Math.cos(FLC * D2R)) / 100, FKY = 111.19 / 100, FZ = 1.15;
const fw = (lat: number, lon: number, zkm: number): V3 => [(lon - FOC) * FKX, (lat - FLC) * FKY, zkm * FZ];
const S33b: React.FC = () => {
  const f = useCurrentFrame(), k = K("s33b_front_stack");
  const tLine = SS(k, 0), tStack = SS(k, 1), tUS = AT(k, 1, "central United States"), tArr = SS(k, 2), tCrowd = SS(k, 3), tCircle = SS(k, 4), tCold = SS(k, 5), tSlope = SS(k, 6);
  const texs = [useTex(IMG("front_850.png")), useTex(IMG("front_700.png")), useTex(IMG("front_500.png")), useTex(IMG("front_300.png"))];
  const lays = FR.layers as { level: number; zg_km: number; iso: { level: number; lines: number[][] }[]; arrows: number[][]; front: number[][] }[];
  const reveal = lays.map((_, i) => prog(f, tStack + 20 + 25 * i, tStack + 45 + 25 * i));
  const layers: StackLayer[] = lays.map((L, i) => ({ tex: texs[i], z: L.zg_km * FZ, o: 0.88 }));
  const x0 = (FB[2] - FOC) * FKX, x1 = (FB[3] - FOC) * FKX, y0 = (FB[0] - FLC) * FKY, y1 = (FB[1] - FLC) * FKY;
  const keys = [{ f: 0, az: 245, el: 24, dist: 70, target: [0, 0, 5] as V3 }, { f: tCircle, az: 252, el: 26, dist: 70, target: [0, 0, 5] as V3 },
    { f: tCold, az: 312, el: 34, dist: 66, target: [0, 0, 6] as V3, linear: false }, { f: LEN(k), az: 318, el: 36, dist: 68, target: [0, 0, 6] as V3 }];
  const st = hOrbitCam({ ...hOrbitPath(keys, f), fov: 30 }, [560, 440]);
  const pr = hProjector(st, 1920, 1080, 0, 0);
  const front850 = lays[0].front;
  return (
    <Scene>
      <HView3D st={st} x={0} y={0} w={1920} h={1080}>
        <LayerStack3D layers={layers} foot={{ x0, x1, y0, y1 }} reveal={reveal} sep={1} mask={{ name: "s33b stack", clipX: 1068, clipY: 788 }}
          lines={lays.slice(1).map((L, i) => ({ pts: front850.map((q) => fw(q[0], q[1], L.zg_km)), color: C.gold, px: 3, o: 0.6 * fin(f, tCold) * reveal[i + 1] }))
            .concat(lays.map((L, i) => ({ pts: L.front.map((q) => fw(q[0], q[1], L.zg_km)), color: C.gold, px: 6, o: fin(f, tCrowd) * reveal[i] })))} />
      </HView3D>
      <Svg>
        {lays.map((L, i) => <g key={i} opacity={reveal[i]}>
          {L.iso.map((c) => <path key={c.level} d={c.lines.map((ln) => { const pts: Pt[] = []; for (let j = 0; j < ln.length; j += 2) pts.push(pr.p(fw(ln[j + 1], ln[j], L.zg_km))); return poly(pts); }).join("")}
            fill="none" stroke={C.ink} strokeOpacity={0.4} strokeWidth={1.5} />)}
          {L.arrows.map((a, j) => { const p0 = fw(a[0], a[1], L.zg_km), s = 0.32; return <Arrow key={j} p={pr.p(p0)} q={pr.p([p0[0] + a[2] * s, p0[1] + a[3] * s, p0[2]])} color={C.second} w={5} head={16} o={fin(f, tArr)} />; })}
        </g>)}
        <Place p={pr.p(fw(39.5, -96, 0))} t="central United States" r={0} dx={0} dy={60} a="middle" italic o={fin(f, tUS) * fout(f, tArr)} />
      </Svg>
      <GlobeFrame id="s33bf" zoom={1} right={1} />
      <Svg>
        <ColourBar x={1240} y={150} w={330} lut={LUT_AMP} lo={0} hi={8} unit="K" title={["|∇T|", "per 100 km"]} ticks={[{ v: 0, t: "0" }, { v: 4, t: "4" }, { v: 8, t: "8" }]} o={fin(f, tStack)} />
        {lays.slice().reverse().map((L, i) => <Lbl key={L.level} x={1240} y={290 + i * 62} t={`${L.level} hPa ≈ ${nf(L.zg_km, 1)} km`} c={C.key} s={T.floor} o={reveal[lays.length - 1 - i]} />)}
        <Lbl x={1240} y={560} t="isotherms crowd: the front" c={C.key} s={T.floor} o={fin(f, tCrowd)} />
        <Lbl x={1240} y={630} t="cold side," c={C.gold} s={T.key} o={fin(f, tCold)} />
        <Lbl x={1240} y={695} t="260–450 km back" c={C.gold} s={T.key} o={fin(f, tCold)} />
        <Lbl x={1240} y={790} t="a sloping surface" c={C.key} s={T.key} o={fin(f, tSlope)} />
      </Svg>
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 22 Dec 2022, 12 UTC" pic={{ x: 0, y: 0, w: 1920, h: 820 }} x={80} w={1000} name="s33b src" />
    </Scene>
  );
};

// ================================================================ s34 advection: the wind times the directional derivative
const S34: React.FC = () => {
  const f = useCurrentFrame(), k = K("s34_advection");
  const tFix = SS(k, 0), tWind = SS(k, 1), tAlong = SS(k, 2), tCos = SS(k, 3), tNeg = SS(k, 4), tTimes = SS(k, 5), tAdv = SS(k, 6), tTherm = SS(k, 7), tMat = SS(k, 8);
  const ZB = boxAt(48.5, -4.5, 2.4, 80, 40, 1000, 780);
  const P = mapP(ZB);
  const br = P(T8.brest.gp[0], T8.brest.gp[1]);
  const W = T8.wind, gx = T8.brest.gx, gy = T8.brest.gy, gl = Math.hypot(gx, gy);
  const ug: Pt = [gx / gl, -gy / gl], uw: Pt = [W.u / W.spd, -W.v / W.spd];
  const gT: Pt = [br[0] + ug[0] * 200, br[1] + ug[1] * 200], wT: Pt = [br[0] + uw[0] * 260, br[1] + uw[1] * 260];
  const sh = (W.dTds / gl) * 200;                                       // shadow of ∇T on the wind direction (negative)
  const aW = Math.atan2(-uw[1], uw[0]) / D2R, aG = Math.atan2(-ug[1], ug[0]) / D2R;
  return (
    <Scene>
      <T850Map id="s34" B={ZB} arrows={0} iso={0.5} fade={0.6} />
      <Svg>
        <Place p={br} t="Brest" dx={-26} dy={40} a="end" o={fin(f, tFix)} />
        <Band p={br} q={[br[0] + uw[0] * sh, br[1] + uw[1] * sh]} color={C.neg} o={0.5 * fin(f, tCos)} />
        <Arrow p={br} q={gT} color={C.second} o={fin(f, tFix + 10)} />
        <Lbl x={gT[0] - 20} y={gT[1] + 40} t="∇T" c={C.second} s={T.calc} a="end" o={fin(f, tFix + 10)} />
        <AnimatedWindArrow from={br} to={wT} speed={W.spd} f={f} c={C.first} px={10} head={40} o={fin(f, tWind)} />
        <Lbl x={wT[0] + 20} y={wT[1]} t="wind" c={C.first} s={T.key} o={fin(f, tWind)} />
        <path d={arcD(br, 90, aW, aG < aW ? aG + 360 : aG)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tWind + 40)} />
        <Lbl x={1130} y={110} t="34 m/s, from just west of south" c={C.key} s={T.floor} o={fin(f, tWind + 10)} />
        <Lbl x={1130} y={180} t="angle ≈ 138°" c={C.gold} s={T.key} o={fin(f, tWind + 40)} />
        <Lbl x={1130} y={500} t="−: wind towards colder air" c={C.neg} s={T.floor} o={fin(f, tNeg)} />
        <Lbl x={1130} y={790} t="material derivative movie" c={C.muted} s={T.floor} o={fin(f, tMat)} />
        <g opacity={fin(f, tTherm)}><PoleThermometer x={br[0] + 120} y={br[1] + 250} s={0.7} /></g>
        <SideCallout f={f} lines="+3.7 °C per hour" at={[1130, 700]} appear={tTherm + 10} target={[br[0] + 150, br[1] + 160]} s={T.key} bend={30} />
      </Svg>
      <CalcStack f={f} x={1395} y={240} size={44} maxLines={3} rows={[
        { lhs: String.raw`4.1\times\cos138^{\circ}`, rhs: String.raw`\approx-3.0\ ^{\circ}\mathrm{C\ per\ 100\ km}`, at: tCos, c: C.neg },
        { lhs: String.raw`\times\ 34\ \mathrm{m/s}`, rhs: String.raw`\approx-3.7\ ^{\circ}\mathrm{C\ per\ hour}`, at: tTimes, c: C.neg },
      ]} o={fout(f, tTherm - 6)} />
      <TeX s={EQ_S34} x={1130} y={600} size={64} o={fin(f, tAdv)} />
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 1 Nov 2023, 18 UTC · 850 hPa" pic={{ x: ZB.x, y: ZB.y, w: ZB.w, h: ZB.h }} w={1000} name="s34 src" />
    </Scene>
  );
};

// ================================================================ s35 the sea breeze: Normandy, 24 Jun 2024
const M35: MapBox = { lat0: 48.9, lat1: 50.1, lon0: -1.6, lon1: 1.6, x: 80, y: 50, w: 920, h: 530 };
const S35: React.FC = () => {
  const f = useCurrentFrame(), k = K("s35_sea_breeze");
  const tCoast = SS(k, 0), tHere = SS(k, 1), tSat = SS(k, 2), tLand = SS(k, 3), tSea = SS(k, 4), tGrad = SS(k, 5), tSun = SS(k, 6), tRise = SS(k, 7), tPush = SS(k, 8), tName = SS(k, 9);
  const P = mapP(M35);
  const pl = P(SB.inland[0], SB.inland[1]), ps = P(SB.sea[0], SB.sea[1]);
  const winds = (SB.winds["15"] as number[][]);
  return (
    <Scene>
      <GeoMap id="s35" B={M35} frame={0.6}>
        {(Pm) => <>
          <GeoImg P={Pm} href={IMG("sb_modis.jpg")} box={SB.img_box} />
          {SB.iso.map((L: { level: number; lines: number[][] }) => <path key={L.level} d={linesPath(Pm, L.lines)} fill="none" stroke={C.ink} strokeOpacity={0.55 * fin(f, tLand)} strokeWidth={2} />)}
        </>}
      </GeoMap>
      <Svg>
        <circle cx={pl[0]} cy={pl[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={fin(f, tLand)} />
        <circle cx={ps[0]} cy={ps[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={fin(f, tSea)} />
        <Bracket p={[pl[0] + 50, pl[1]]} q={[ps[0] + 50, ps[1]]} c={C.gold} o={fin(f, tSea + 20)} />
        <Place p={P(49.05, 0.6)} t="Normandy" r={0} dx={0} dy={0} a="middle" italic o={fin(f, tHere)} />
        <Place p={P(49.85, -0.9)} t="English Channel" r={0} dx={0} dy={0} a="middle" italic o={fin(f, tHere + 15)} />
        {winds.map((a, i) => { const p0 = P(a[0], a[1]), s = 14, sp = Math.hypot(a[2], a[3]);
          return <AnimatedWindArrow key={i} from={p0} to={[p0[0] + a[2] * s, p0[1] - a[3] * s]} speed={sp} f={f} c={C.first} px={6} head={18} o={fin(f, tPush)} />; })}
        <SideCallout f={f} lines="land: 24.6 °C" at={[1080, 290]} appear={tLand + 10} target={[pl[0] + 14, pl[1] + 6]} s={T.key} bend={-30} />
        <SideCallout f={f} lines="sea: 16.1 °C" at={[1080, 110]} appear={tSea + 10} target={[ps[0] + 14, ps[1]]} s={T.key} bend={20} />
        <Lbl x={1080} y={380} t="clouds over land, clear sea" c={C.key} s={T.floor} o={fin(f, tSat)} />
        {/* K6 r1: sea (top) → the 55 km bracket (middle) → land (bottom): three links in the order of their targets, so none cross */}
        <SideCallout f={f} lines="55 km apart" at={[1080, 200]} appear={tSea + 26} out={tName - 14} target={[pl[0] + 64, mix(pl[1], ps[1], 0.5)]} s={T.key} bend={20} />
        <Keyword f={f} text="sea breeze" at={[1080, 790]} appear={tName} />
        <g opacity={fin(f, tSun)}>
          <rect x={80} y={760} width={460} height={60} fill="#5d6677" /><rect x={540} y={760} width={460} height={60} fill="#2d5f8a" />
          <Lbl x={310} y={720} t="land warms" c={C.key} s={T.floor} a="middle" />
          <Lbl x={770} y={720} t="sea stays cool" c={C.key} s={T.floor} a="middle" />
        </g>
        <g opacity={fin(f, tRise)}>
          {[200, 320, 440].map((x) => <Arrow key={x} p={[x, 700 - 30 * ((f % 40) / 40)]} q={[x, 650 - 30 * ((f % 40) / 40)]} color={C.neg} w={6} head={20} />)}
          <Lbl x={770} y={668} t="pressure a little higher" c={C.key} s={T.floor} a="middle" />
        </g>
        <ForceArrow p={[900, 790]} q={[620, 790]} o={fin(f, tPush)} w={9} head={34} />
      </Svg>
      <CalcStack f={f} x={1380} y={440} size={52} rows={[
        { lhs: String.raw`\frac{24.6-16.1}{55.6\ \mathrm{km}}`, rhs: String.raw`=\frac{8.5\ ^{\circ}\mathrm{C}}{55.6\ \mathrm{km}}`, at: tGrad, h: 120 },
        { rhs: String.raw`\approx15\ ^{\circ}\mathrm{C\ per\ 100\ km}`, at: tGrad + 40, cont: true },
      ]} />
      <Svg><Lbl x={1080} y={690} t="sharper than the storm’s front" c={C.gold} s={T.floor} o={fin(f, tGrad + 70)} /></Svg>
      <SourceBelow text="Image: NASA MODIS Aqua (GIBS) · data: ERA5 · 24 Jun 2024, 13 UTC" pic={{ x: M35.x, y: M35.y, w: M35.w, h: M35.h }} w={920} name="s35 src" />
    </Scene>
  );
};

// ================================================================ s36 the jet above the strongest temperature gradient
const SA: Ax = { x: 170, y: 92, w: 800, h: 598, xr: [0, 90], yr: [0, 1] };   // K6 r2: the "hPa" axis word was cut by the top edge
const pY = (p: number) => SA.y + ((Math.log(1000) - Math.log(p)) / (Math.log(1000) - Math.log(100))) * -SA.h + SA.h;
const S36: React.FC = () => {
  const f = useCurrentFrame(), k = K("s36_jet");
  const tHigh = SS(k, 0), tAvg = SS(k, 1), tSteep = SS(k, 2), tJet = SS(k, 3), tDays = SS(k, 4), tGFS = SS(k, 5), tKmh = SS(k, 6), tTW = SS(k, 7);
  const lat = ZM.lat as number[], lev = ZM.lev as number[], TT = ZM.T as number[][];
  const X = (la: number) => SA.x + (la / 90) * SA.w;
  const oS = fout(f, tDays + 10, 20), oG = fin(f, tDays + 10, 20);
  const cam = globePath([{ f: 0, lat: 42, lon: -45, dist: 3.0 }, { f: LEN(k), lat: 44, lon: -38, dist: 3.0 }], f);
  const lv = [1000, 850, 700, 500, 300, 200, 100];
  const jx = X(ZM.jet[1]), jy = pY(ZM.jet[2]);
  return (
    <Scene>
      <Svg o={oS}>
        {lev.map((p, i) => i < lev.length - 1 ? lat.map((la, j) => j < lat.length - 1 ? (
          <rect key={`${i}_${j}`} x={X(la)} y={pY(lev[i])} width={X(lat[j + 1]) - X(la) + 0.6} height={pY(lev[i + 1]) - pY(lev[i]) + 0.6}
            fill={`rgb(${hexC(TT[i][j])})`} />) : null) : null)}
        {(ZM.tcont as { level: number; lines: number[][] }[]).map((c) => <path key={c.level} d={c.lines.map((ln) => { const pts: Pt[] = []; for (let q = 0; q < ln.length; q += 2) pts.push([X(ln[q]), pY(ln[q + 1])]); return poly(pts); }).join("")}
          fill="none" stroke={C.ink} strokeOpacity={0.35} strokeWidth={1.5} />)}
        {(ZM.ucont as { level: number; lines: number[][] }[]).map((c) => <path key={c.level} d={c.lines.map((ln) => { const pts: Pt[] = []; for (let q = 0; q < ln.length; q += 2) pts.push([X(ln[q]), pY(ln[q + 1])]); return poly(pts); }).join("")}
          fill="none" stroke={C.first} strokeWidth={4} opacity={fin(f, tJet)} />)}
        <rect x={X(ZM.steep[0] - 4)} y={pY(300)} width={X(8) - X(0)} height={pY(850) - pY(300)} fill={C.gold} opacity={0.3 * fin(f, tSteep)} />
        <circle cx={jx} cy={jy} r={14} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tJet + 20)} />
        <line x1={SA.x} y1={SA.y + SA.h} x2={SA.x + SA.w} y2={SA.y + SA.h} stroke={C.muted} strokeWidth={3} />
        <line x1={SA.x} y1={SA.y} x2={SA.x} y2={SA.y + SA.h} stroke={C.muted} strokeWidth={3} />
        {/* K6 r1: "0°N" starts at the axis corner (centred, it sat on the "1000" tick) */}
        {[0, 30, 60, 90].map((la) => <Lbl key={la} x={la === 0 ? X(0) + 4 : X(la)} y={SA.y + SA.h + 32} t={`${la}°N`} c={C.muted} s={T.floor} a={la === 0 ? "start" : "middle"} b={false} />)}
        {lv.map((p) => <Lbl key={p} x={SA.x - 12} y={pY(p)} t={`${p}`} c={C.muted} s={T.floor} a="end" b={false} />)}
        <Lbl x={SA.x - 10} y={SA.y - 40} t="hPa" c={C.muted} s={T.floor} b={false} />
        <Lbl x={SA.x + SA.w} y={SA.y + SA.h + 84} t="equator → North Pole" c={C.muted} s={T.floor} a="end" b={false} />
        <ColourBar x={1080} y={110} w={330} lut={LUT_TH} lo={-80} hi={30} unit="°C" title="temperature" ticks={[{ v: -70, t: "−70" }, { v: -20, t: "−20" }, { v: 30, t: "30" }]} />
        <SideCallout f={f} lines={["≈ 6 °C per 1000 km", "near 45°N"]} at={[1080, 560]} appear={tSteep + 10} target={[X(ZM.steep[0]) + 30, pY(500)]} s={T.key} bend={30} />
        <SideCallout f={f} lines={["jet ≈ 26 m/s", "≈ 12 km up"]} at={[1080, 330]} appear={tJet + 20} target={[jx + 16, jy]} s={T.key} bend={-20} />
      </Svg>
      <Globe cam={cam} o={oG} coast={0.5} drapes={[{ tex: useTex(IMG("jet250.png")), lat: [JT.img_box[0], JT.img_box[1]], lon: [JT.img_box[2], JT.img_box[3]], o: 0.9 }]}
        over={(G) => <>
          <FlowParticles P={(la, lo) => (G.vis(la, lo) ? G.p(la, lo, 1.003) : null)} tracks={JT.tracks} fr={f / 2} tail={8} w={2.5} c={C.key} o={0.9} />
          <circle cx={G.p(JT.max[1], JT.max[2])[0]} cy={G.p(JT.max[1], JT.max[2])[1]} r={12} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tGFS)} />
          <Place p={G.p(50, -35)} t="North Atlantic" r={0} dx={0} dy={0} a="middle" italic o={fin(f, AT(k, 5, "North Atlantic"))} />
        </>} />
      <Svg o={oG}>
        <ColourBar x={1080} y={110} w={330} lut={LUT_SP} lo={0} hi={70} unit="m/s" title="wind at 250 hPa" ticks={[{ v: 0, t: "0" }, { v: 35, t: "35" }, { v: 70, t: "70" }]} />
        <SideCallout f={f} lines={["66 m/s", "≈ 240 km/h"]} at={[1080, 380]} appear={tGFS + 20} target={[globeCenter(cam, JT.max)[0] + 16, globeCenter(cam, JT.max)[1]]} s={T.calc} bend={30} />
        <Keyword f={f} text="thermal wind" at={[1080, 720]} appear={tTW} />
      </Svg>
      <SourceBelow text="Data: ERA5 monthly means (Copernicus C3S) · Sep 2026 · zonal mean" pic={{ x: SA.x, y: SA.y, w: SA.w, h: SA.h + 100 }} w={800} o={fout(f, tDays + 4, 10)} name="s36 src era5" />
      <SourceBelow text="Data: NOAA NCEP GFS analysis · 28 Oct 2026, 18 UTC" pic={{ x: 60, y: 28, w: 960, h: 790 }} w={960} o={fin(f, tDays + 22, 10)} name="s36 src gfs" />
    </Scene>
  );
};
const hexC = (Tc: number) => { const lut = LUT_TH, t = clamp((Tc + 80) / 110, 0, 1) * (lut.length - 1), i = Math.min(lut.length - 2, Math.floor(t)), w = t - i;
  const a = lut[i], b = lut[i + 1], c = (h: string, o: number) => parseInt(h.slice(o, o + 2), 16);
  return [1, 3, 5].map((o) => Math.round(c(a, o) + (c(b, o) - c(a, o)) * w)).join(","); };
import { globeG } from "./gr_lib";
const globeCenter = (cam: { lat: number; lon: number; dist: number }, ll: number[]) => globeG(cam).p(ll[1], ll[2]);

// ================================================================ s37 the Gulf Stream north wall (zoom-reveal)
const S37: React.FC = () => {
  const f = useCurrentFrame(), k = K("s37_gulf_stream");
  const tOcean = SS(k, 0), tCoast = AT(k, 1, "east coast of the United States"), tWall = SS(k, 2), tSharp = SS(k, 3), tStorm = SS(k, 4), tMovies = SS(k, 5);
  const A = SST.A as number[], Bp = SST.B as number[];
  const cam = globePath([
    { f: 0, lat: 35, lon: -55, dist: 4.3, pp: [600, 470] }, { f: tCoast - 10, lat: 35, lon: -60, dist: 4.3, pp: [600, 470] },
    { f: tCoast + 35, lat: 39.5, lon: -67, dist: 1.42, pp: [620, 470] }, { f: SE(k, 4), lat: 40.0, lon: -66, dist: 1.38, pp: [620, 470] },
    { f: LEN(k) - 20, lat: 35, lon: -60, dist: 4.3, pp: [600, 470] },
  ], f);
  const z = clamp((4.3 - cam.dist) / (4.3 - 2.4), 0, 1);
  const G = globeG(cam, GFULL);
  const pa = G.p(A[0], A[1], 1.002), pb = G.p(Bp[0], Bp[1], 1.002);
  const tex = useTex(IMG("sst.png"));
  return (
    <Scene>
      <Globe cam={cam} box={GFULL} coast={0.55} drapes={[{ tex, lat: [SST.img_box[0], SST.img_box[1]], lon: [SST.img_box[2], SST.img_box[3]], o: 0.95 }]}
        over={(Gp) => <>
          <path d={(SST.front as { level: number; lines: number[][] }[]).map((c) => c.lines.map((ln) => { let d = ""; for (let q = 0; q < ln.length; q += 2) { const p = Gp.p(ln[q + 1], ln[q], 1.002); d += `${q ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`; } return d; }).join("")).join("")}
            fill="none" stroke={C.gold} strokeWidth={3} opacity={0.8 * fin(f, tWall)} />
          <Place p={Gp.p(37.5, -78.5)} t="United States" r={0} dx={0} dy={0} a="middle" italic o={fin(f, tCoast + 10) * fout(f, SE(k, 4))} />
          <Place p={Gp.p(37.2, -68.5)} t="Gulf Stream" r={0} dx={0} dy={0} a="middle" italic o={fin(f, tCoast + 40) * fout(f, SE(k, 4))} />
        </>} />
      <GlobeFrame id="s37f" zoom={z} right={z} disc={undefined} />
      <Svg>
        <g opacity={fin(f, tWall + 20) * fout(f, SE(k, 4))}>
          <line x1={pa[0]} y1={pa[1]} x2={pb[0]} y2={pb[1]} stroke={C.gold} strokeWidth={6} />
          <circle cx={pa[0]} cy={pa[1]} r={9} fill={C.gold} /><circle cx={pb[0]} cy={pb[1]} r={9} fill={C.gold} />
        </g>
        <ColourBar x={1240} y={110} w={330} lut={LUT_TH} lo={4} hi={28} unit="°C" title="sea-surface temperature" ticks={[{ v: 5, t: "5" }, { v: 15, t: "15" }, { v: 25, t: "25" }]} o={z > 0.5 ? 1 : fin(f, tOcean)} />
        <SideCallout f={f} lines={["21.5 → 14.9 °C", "≈ 6.5 °C in ≈ 35 km"]} at={[1240, 360]} appear={tWall + 30} out={SE(k, 4)} target={[mix(pa[0], pb[0], 0.5) + 14, mix(pa[1], pb[1], 0.5)]} s={T.key} bend={30} />
        <Lbl x={1240} y={560} t="among the ocean’s sharpest" c={C.key} s={T.floor} o={fin(f, tSharp) * fout(f, SE(k, 4))} />
        <Lbl x={1240} y={640} t="storms deepen near it" c={C.key} s={T.key} o={fin(f, tStorm) * fout(f, LEN(k) - 30)} />
        <Lbl x={1240} y={720} t="ocean currents" c={C.muted} s={T.floor} o={fin(f, tMovies)} />
      </Svg>
      <SourceBelow text="Data: NOAA OISST v2.1 · 29 Oct 2026" pic={{ x: 60, y: 40, w: 1000, h: 775 }} w={1000} name="s37 src" />
    </Scene>
  );
};

// ================================================================ s38 recap ("To sum up")
const S38: React.FC = () => {
  const f = useCurrentFrame(), k = K("s38_recap");
  const t = Array.from({ length: 8 }, (_, i) => SS(k, i));
  const cell = (i: number): Pt => [100 + (i % 4) * 440, i < 4 ? 70 : 470];
  const o = (i: number) => fin(f, t[i]);
  return (
    <Scene>
      <Svg>
        {Array.from({ length: 8 }, (_, i) => { const [x, y] = cell(i); return <rect key={i} x={x} y={y} width={420} height={340} rx={18} fill="#1d2740" opacity={0.55 * o(i)} />; })}
        <g opacity={o(0)}>
          <HillIcon x={190} y={250} s={0.8} /><ThermoIcon x={310} y={250} s={0.8} /><BaroIcon x={420} y={210} r={36} />
          <Lbl x={120} y={330} t="scalar field" c={C.key} s={T.floor} />
        </g>
        <g opacity={o(2)}>
          <Arrow p={[1000, 300]} q={[1110, 150]} color={C.second} />
          <Lbl x={980} y={360} t="fastest rate" c={C.key} s={T.floor} />
        </g>
        <g opacity={o(3)}>
          {[0, 1, 2, 3, 4].map((q) => <line key={q} x1={1420 + q * 28} y1={100} x2={1420 + q * 28} y2={330} stroke={C.key} strokeWidth={3} strokeOpacity={0.7} />)}
          <Arrow p={[1440, 220]} q={[1600, 220]} color={C.second} w={8} head={30} />
          <RightTick at={[1448, 220]} u1={[1, 0]} u2={[0, -1]} s={18} c={C.gold} />
        </g>
        <g opacity={o(6)}>
          <Lbl x={1050} y={520} t="H" c={C.key} s={T.calc} a="middle" /><Lbl x={1280} y={520} t="L" c={C.key} s={T.calc} a="middle" />
          <ForceArrow p={[1090, 560]} q={[1240, 560]} w={8} head={30} />
        </g>
        <g opacity={o(7)}>
          <rect x={1420} y={500} width={110} height={130} fill={C.neg} opacity={0.5} />
          <rect x={1540} y={500} width={110} height={130} fill="#4a78b8" opacity={0.5} />
          <Lbl x={1430} y={690} t="fronts · breezes" c={C.key} s={T.floor} a="start" />
          <Lbl x={1430} y={745} t="jet stream" c={C.key} s={T.floor} a="start" />
        </g>
      </Svg>
      <TeX s={String.raw`\nabla f=\Big(\frac{\partial f}{\partial x},\frac{\partial f}{\partial y},\frac{\partial f}{\partial z}\Big)`} x={552} y={230} size={44} o={o(1)} />
      <TeX s={String.raw`|\nabla f|`} x={1200} y={200} size={60} c={C.second} o={o(2)} />
      <TeX s={String.raw`\frac{\partial f}{\partial s}=\nabla f\cdot\hat{\mathbf n}`} x={120} y={640} size={60} o={o(4)} />
      <TeX s={String.raw`\frac{1}{a\cos\varphi}\frac{\partial}{\partial\lambda}`} x={560} y={640} size={60} o={o(5)} />
      <TeX s={String.raw`-\frac{1}{\rho}\nabla p`} x={1010} y={700} size={60} c={C.second} o={o(6)} />
    </Scene>
  );
};

// ================================================================ s39 the series end card (maths ending, HOUSE_STYLE §3)
const S39: React.FC = () => {
  const f = useCurrentFrame(), k = K("s39_end");
  const t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const thumb = (x: number, i: number) => (
    <g key={i} opacity={0.75}>
      <rect x={x - 150} y={70} width={300} height={170} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
      {i === 0 ? <><path d={`M ${x - 110} 220 Q ${x - 20} 90 ${x + 110} 220 Z`} fill="#5d6677" /><Arrow p={[x - 40, 190]} q={[x + 5, 120]} color={C.second} w={6} head={20} /></> : null}
      {i === 1 ? <>{[-60, -20, 20, 60].map((d) => <line key={d} x1={x + d} y1={90} x2={x + d} y2={220} stroke={C.ink} strokeWidth={3} />)}<ForceArrow p={[x + 40, 155]} q={[x - 40, 155]} w={6} head={22} /></> : null}
      {i === 2 ? <path d={`M ${x - 40} 220 L ${x - 90} 130 L ${x - 60} 90`} fill="none" stroke={C.first} strokeWidth={5} /> : null}
      {i === 3 ? <><ellipse cx={x} cy={150} rx={40} ry={26} fill="none" stroke={C.first} strokeWidth={4} /><rect x={x - 110} y={180} width={220} height={36} fill={C.second} opacity={0.4} /></> : null}
    </g>
  );
  const cols: string[][] = [["vectors and index notation", "dot product", "derivatives and Taylor series", "coordinates", "weather basics"],
    ["contour maps", "how contour maps are made", "divergence", "curl", "Laplacian"], ["material derivative", "pressure coordinates", "Coriolis effect"]];
  const COLX = [100, 760, 1370];
  cols.forEach((c, j) => c.forEach((tx) => { if (COLX[j] + textW(tx, T.floor) > (COLX[j + 1] ?? 1842) - 10) throw new Error(`end card: "${tx}" too wide`); }));
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, 6)}>{[420, 760, 1100, 1440].map((x, i) => thumb(x, i))}</g>
        <Lbl x={960} y={315} t="a series of maths tutorials" c={C.key} s={T.calc} a="middle" o={fin(f, 10)} />
        <Lbl x={960} y={395} t="atmospheric science · meteorology · fluid dynamics" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "atmospheric science"))} />
        <g opacity={fin(f, t2)}><Notebook x={300} y={482} s={0.4} /><Lbl x={370} y={490} t="gradient notebook" c={C.ink} s={T.key} /></g>
        <g opacity={fin(f, tOther)}>
          {[0, 1, 2].map((i) => <Notebook key={i} x={260 + i * 30} y={575 - i * 10} s={0.24} c={[C.second, "#8e6fd8", C.muted][i]} o={0.9} />)}
          <Lbl x={370} y={565} t="notebooks for the other maths concepts" c={C.key} s={T.key} />
        </g>
        <g opacity={fin(f, tOther + 20) * 0.8}>
          {cols.map((c, j) => c.map((tx, r) => <Lbl key={tx} x={COLX[j]} y={640 + r * 48} t={tx} c={C.muted} s={T.floor} b={false} />))}
        </g>
      </Svg>
    </Scene>
  );
};

export const SCENES_D: Record<string, React.FC> = {
  s28_ciaran_push: S28, s29_crowded_winds: S29, s30_coriolis: S30, s31_latest_chart: S31, s32_vertical_pressure: S32, s33_fronts: S33, s33b_front_stack: S33b,
  s34_advection: S34, s35_sea_breeze: S35, s36_jet: S36, s37_gulf_stream: S37, s38_recap: S38, s39_end: S39,
};
void [Axes, fitX, prog, win, edges, ArcHead, HBall3D];
