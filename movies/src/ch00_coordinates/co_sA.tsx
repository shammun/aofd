// ch00_coordinates scenes s00-s14b: the title, the plane (Cartesian, polar, radians, turning unit vectors, wind components),
// Hurricane Ian in polar coordinates (HRRR 18 UTC), the centripetal surprise, the cylinder and the ERA5 radial-wind stack.
// Every number on screen is read from data/co.json (CHECK rows at the bottom of each block); this file only places and times.
import React, { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { PoleThermometer } from "../house";
import { C, T } from "../house/kit/type";
import { Band, Dash, Pt, RightTick, pulse } from "../house/kit/draw";
import { CalcStack, Layered, Part, TeX } from "../house/kit/tex";
import { Keyword } from "../house/kit/notes";
import { CurvedLink } from "../house/kit/extras";
import { RiseText, TitleGradient } from "../house/kit/title";
import { Callout, GlobeFrame, SourceBelow, SourceLine } from "../house/kit/frame";
import { AnimatedWindArrow, FlowParticles } from "../house/kit/wind";
import { View3D as HView3D, Arrow3D as HArrow3D, Rod3D as HRod3D, Ball3D as HBall3D } from "../house/kit/three3d";
import { OrbitKey, orbitCam as hOrbitCam, orbitPath as hOrbitPath, projector as hProjector, V3 } from "../house/kit/cam";
import { LayerStack3D, StackLayer } from "../house/kit/stack3d";
import { globePath, llPath, useTex } from "./kit_co/globe";
import {
  AT, Arrow, Ax, Axes, BREST, BROWN, Balloon, Curve, D, D2R, GeoImg, GeoMap, Globe, IMGS, K, LEN, LUT_RAD, Lbl, MapBox, Place, SS, SE, Scene, SideCallout, SpeedBar,
  Svg, ArcHead, arcD, axP, axY, boxAt, clamp, discOf, fin, fout, linesPath, mapP, mix, nf, poly, prog, win, zoomBox, ColourBar,
} from "./co_lib";
import { EQ_S04, EQ_S05, EQ_S07, EQ_S08, EQ_S09, EQ_S10, EQ_S11, EQ_S13, EQ_S14 } from "./co_eq";

const IAN = D.ian, PL = D.plane, STK = D.stack;
const cutAt = (s: string, at: string): [string, string] => { const i = s.indexOf(at); if (i < 0) throw new Error(`cutAt: ${at} not in ${s}`); return [s.slice(0, i), s.slice(i + at.length)]; };
// ---------------------------------------------------------------- numbers on screen = the data (the render fails otherwise)
const CHECK_A: [string, number, number, number][] = [
  ["r", PL.r, 5, 1e-9], ["theta", PL.th, 53.13, 0.005], ["rhat x", PL.rhat[0], 0.6, 1e-9], ["rhat y", PL.rhat[1], 0.8, 1e-9],
  ["thhat x", PL.thhat[0], -0.8, 1e-9], ["thhat y", PL.thhat[1], 0.6, 1e-9], ["ur", PL.ur, 6, 1e-9], ["ut", PL.ut, -8, 1e-9],
  ["vt25", IAN.vt[3], 37.1, 0.05], ["vr25", IAN.vr[3], -12.5, 0.05], ["kmh", IAN.vt[3] * 3.6, 133.6, 0.5], ["inflow", IAN.inflow, 18.6, 0.05],
  ["acc", IAN.acc, 0.055, 0.0006], ["g ratio", 9.81 / IAN.acc, 178, 2], ["best", IAN.best_kt * 1.852, 250, 0.1], ["p", IAN.p, 960.3, 0.05],
  ["stack 975 z", STK.z_km[0], 0.3, 0.05], ["stack 850 z", STK.z_km[1], 1.5, 0.05], ["stack 500 z", STK.z_km[2], 6, 0.25], ["stack 200 z", STK.z_km[3], 12.5, 0.05],
  ["stack 125 z", STK.z_km[4], 15, 0.4], ["vr200 975", STK.vr200[0], -6, 0.15], ["vr200 200", STK.vr200[3], 4, 0.25], ["vr200 125", STK.vr200[4], 4, 0.4],
];
CHECK_A.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

// ---------------------------------------------------------------- the flat plane (schematic local map round a station; km)
const PO: Pt = [300, 700], PU = 100;                  // origin on screen, px per km
const pp = (x: number, y: number): Pt => [PO[0] + x * PU, PO[1] - y * PU];
const BAL = pp(3, 4);
const Ground: React.FC<{ o?: number; grid?: number }> = ({ o = 1, grid = 0.5 }) => o <= 0 ? null : (
  <g opacity={o}>
    <rect x={110} y={60} width={880} height={780} rx={18} fill="#22304a" stroke="#4a5677" strokeWidth={3} />
    {Array.from({ length: 9 }, (_, i) => i - 1).map((i) => <line key={`v${i}`} x1={pp(i, 0)[0]} y1={70} x2={pp(i, 0)[0]} y2={830} stroke={C.grid} strokeWidth={1.5} opacity={grid} />)}
    {Array.from({ length: 8 }, (_, j) => j - 1).map((j) => <line key={`h${j}`} x1={120} y1={pp(0, j)[1]} x2={980} y2={pp(0, j)[1]} stroke={C.grid} strokeWidth={1.5} opacity={grid} />)}
  </g>
);
const Station: React.FC<{ o?: number }> = ({ o = 1 }) => <PoleThermometer x={PO[0]} y={PO[1]} s={0.9} o={o} />;
const AxesEN: React.FC<{ f: number; at: number; o?: number }> = ({ f, at, o = 1 }) => {
  const g = prog(f, at, at + 30);
  if (g <= 0 || o <= 0) return null;
  return (
    <g opacity={o}>
      <Arrow p={pp(-1.5, 0)} q={[mix(PO[0], 960, g), PO[1]]} color={C.second} w={6} head={30} />
      <Arrow p={pp(0, -1.2)} q={[PO[0], mix(PO[1], 90, g)]} color={C.second} w={6} head={30} />
      <Lbl x={952} y={PO[1] - 44} t="east" c={C.key} s={T.floor} a="end" o={fin(f, at + 24)} />
      <Lbl x={PO[0] + 20} y={110} t="north" c={C.key} s={T.floor} o={fin(f, at + 24)} />
    </g>
  );
};
const KmTicks: React.FC<{ o: number }> = ({ o }) => o <= 0 ? null : (
  <g opacity={o}>
    {[1, 2, 3, 4, 5, 6].map((i) => <g key={`x${i}`}><line x1={pp(i, 0)[0]} y1={PO[1] - 10} x2={pp(i, 0)[0]} y2={PO[1] + 10} stroke={C.muted} strokeWidth={3} />
      <Lbl x={pp(i, 0)[0]} y={PO[1] + 40} t={`${i}`} c={C.muted} s={T.floor} a="middle" b={false} /></g>)}
    {[1, 2, 3, 4, 5].map((j) => <g key={`y${j}`}><line x1={PO[0] - 10} y1={pp(0, j)[1]} x2={PO[0] + 10} y2={pp(0, j)[1]} stroke={C.muted} strokeWidth={3} />
      <Lbl x={PO[0] - 22} y={pp(0, j)[1]} t={`${j}`} c={C.muted} s={T.floor} a="end" b={false} /></g>)}
    <Lbl x={pp(6, 0)[0] + 24} y={PO[1] + 40} t="km" c={C.muted} s={T.floor} b={false} />
  </g>
);

// ================================================================ s00 title
const TBOX = { x: 1250, y: 200, w: 590, h: 400 };
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  const tMet = AT(k, 0, "meteorology"), tEasy = AT(k, 0, "the easy way"), tDist = AT(k, 0, "distances and directions");
  const g = prog(f, 20, 110);
  const O: Pt = [1250, 610], u = 62;
  const P = (x: number, y: number): Pt => [O[0] + x * u, O[1] - y * u];
  const morph = (cx: number, cy: number, px: number, py: number): Pt => P(mix(cx, px, g), mix(cy, py, g));
  const lines: string[] = [];
  for (let i = 0; i <= 6; i++) { const th = i * 15 * D2R, pts: Pt[] = []; for (let s = 0; s <= 6.01; s += 0.25) pts.push(morph(i, s, s * Math.cos(th), s * Math.sin(th))); lines.push(poly(pts)); }
  for (let j = 1; j <= 6; j++) { const pts: Pt[] = []; for (let s = 0; s <= 6.01; s += 0.25) { const th = s * 15 * D2R; pts.push(morph(s, j, j * Math.cos(th), j * Math.sin(th))); } lines.push(poly(pts)); }
  const oA = fin(f, 6, 10) * fout(f, 132, 14), oG = fin(f, 136, 14) * fout(f, tMet, 12), oB = fin(f, tMet, 12) * fout(f, tDist - 6, 12), oC = fin(f, tDist + 6, 12);
  const B = boxAt(IAN.c[0], IAN.c[1], 1.5, TBOX.x, TBOX.y, TBOX.w, TBOX.h);
  const pz = 1 + 0.06 * pulse(f, tEasy, 14);
  const cam = globePath([{ f: 0, lat: 40, lon: -20, dist: 3.1 }, { f: 300, lat: 44, lon: -12, dist: 3.1 }], f);
  const camR = globePath([{ f: 0, lat: 52, lon: -50, dist: 2.9 }, { f: 300, lat: 50, lon: -58, dist: 2.9 }], f);
  const ring = IAN.ring;
  const gc = D.route.gc as number[][];
  const gcPts = (n: number) => (gc[0] as number[]).slice(0, n).map((la, i) => [la, gc[1][i]] as [number, number]);
  const ny = Math.round(181 * prog(f, tDist + 12, tDist + 60));
  return (
    <Scene fadeIn={false}>
      <Svg>
        <defs><TitleGradient id="ttl" x1={100} x2={1000} /></defs>
        <RiseText f={f} t="Coordinates" x={100} y={300} s={150} at={2} fill="url(#ttl)" />
        <g transform={`translate(104 440) scale(${pz}) translate(-104 -440)`}>
          <RiseText f={f} t="made easy" x={104} y={450} s={96} at={22} fill={C.key} />
        </g>
        <RiseText f={f} t="and how meteorology uses them" x={106} y={580} s={68} at={36} fill={C.key} colors={(i) => (i >= 8 && i < 19 ? C.first : undefined)} />
        <g opacity={oA}>
          {lines.map((d, i) => <path key={i} d={d} fill="none" stroke={i < 7 ? C.second : C.local} strokeWidth={i < 7 ? 3 : 2.5} opacity={0.8} />)}
          <circle cx={P(3, 4)[0]} cy={P(3, 4)[1]} r={13} fill={C.gold} stroke={C.bg} strokeWidth={4} />
        </g>
      </Svg>
      <Globe cam={cam} box={TBOX} o={oG} grat={0.55} coast={0.4} gratStep={15}
        over={(G) => <circle cx={G.p(BREST[0], BREST[1])[0]} cy={G.p(BREST[0], BREST[1])[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={4} />} />
      <GeoMap id="s00m" B={B} o={oB} frame={0.6}>
        {(Pm) => <>
          <GeoImg P={Pm} href={IMGS.goes} box={IAN.goes_box} o={0.55} />
          <GeoImg P={Pm} href={IMGS.ian(18)} box={IAN.speed_box} o={0.85} />
          <path d={linesPath(Pm, IAN.coast)} fill="none" stroke={C.key} strokeOpacity={0.8} strokeWidth={2} />
          <path d={poly((ring.lat as number[]).map((la, i) => Pm(la, ring.lon[i])))} fill="none" stroke={C.first} strokeWidth={5} />
          {[0, 18, 36, 54].map((i) => {
            const p0 = Pm(ring.lat[i], ring.lon[i]), a = ring.az[i] * D2R, s = 2.4;
            const tp: Pt = [p0[0] - Math.sin(a) * ring.vt[i] * s, p0[1] - Math.cos(a) * ring.vt[i] * s];
            const rp: Pt = [p0[0] + Math.cos(a) * ring.vr[i] * s, p0[1] - Math.sin(a) * ring.vr[i] * s];
            return <g key={i}><AnimatedWindArrow from={p0} to={tp} speed={ring.vt[i]} f={f} c={C.first} px={8} head={26} />
              <AnimatedWindArrow from={p0} to={rp} speed={Math.abs(ring.vr[i])} f={f} c={C.neg} px={8} head={26} /></g>;
          })}
        </>}
      </GeoMap>
      <Globe cam={camR} box={TBOX} o={oC} grat={0.35} coast={0.45}
        over={(G) => <>
          <path d={llPath(G, gcPts(Math.max(2, ny)), 1.004)} fill="none" stroke={C.gold} strokeWidth={6} />
          {[D.route.lhr, D.route.lax].map((q: number[], i: number) => <circle key={i} cx={G.p(q[0], q[1])[0]} cy={G.p(q[0], q[1])[1]} r={10} fill={C.key} stroke={C.bg} strokeWidth={3} opacity={G.vis(q[0], q[1]) ? 1 : 0} />)}
        </>} />
      <SourceBelow text="Data: HRRR (NOAA) · 28 Sep 2022, 18 UTC" pic={TBOX} w={710} o={oB} name="s00 src hrrr" />
      <SourceBelow text="Image: NASA Blue Marble Next Generation" pic={TBOX} w={710} o={Math.max(oG, oC)} name="s00 src bmng" />
    </Scene>
  );
};

// ================================================================ s01 hook
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  const tCo = AT(k, 0, "coordinates"), tWhat = AT(k, 1, "what they are"), tSMW = AT(k, 2, "storms, maps and winds");
  const MB = boxAt(IAN.c[0] + 0.4, IAN.c[1] + 0.2, 4.2, 80, 80, 620, 580);
  const cam = globePath([{ f: 0, lat: 30, lon: -40, dist: 3.5 }, { f: LEN(k) + 10, lat: 32, lon: -28, dist: 3.5 }], f);
  const GBX = { x: 980, y: 40, w: 880, h: 760 };
  const Pm = mapP(MB);
  const rings = fin(f, tWhat, 20);
  const cE = Pm(IAN.c[0], IAN.c[1]);
  const thumbs = [{ y: 540, at: tSMW }, { y: 640, at: tSMW + 8 }, { y: 740, at: tSMW + 16 }];
  return (
    <Scene>
      <GeoMap id="s01m" B={MB}>
        {(P) => <>
          <GeoImg P={P} href={IMGS.ian(18)} box={IAN.speed_box} o={0.9} />
          <path d={linesPath(P, IAN.coast)} fill="none" stroke={C.key} strokeOpacity={0.8} strokeWidth={2} />
          <FlowParticles P={(la, lo) => P(la, lo)} tracks={IAN.tracks} fr={f / 2} tail={10} w={2} />
          {[50, 100, 150, 200].map((rk) => <circle key={rk} cx={cE[0]} cy={cE[1]} r={(rk / 111.2 / (MB.lat1 - MB.lat0)) * MB.h} fill="none" stroke={C.local} strokeWidth={2.5} opacity={0.75 * rings} />)}
          <circle cx={cE[0]} cy={cE[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        </>}
      </GeoMap>
      <Globe cam={cam} box={GBX} grat={mix(0.25, 0.75, rings)} coast={0.45} />
      <Svg>
        <SpeedBar x={110} y={712} w={330} />
        <Keyword f={f} text="coordinates" at={[880, 420]} a="middle" appear={tCo} />
        {thumbs.map((t, i) => (
          <g key={i} opacity={fin(f, t.at)}>
            {i === 0 ? <><circle cx={880} cy={t.y} r={36} fill="none" stroke={C.first} strokeWidth={5} /><circle cx={880} cy={t.y} r={7} fill={C.gold} /></> : null}
            {i === 1 ? <><rect x={830} y={t.y - 36} width={100} height={72} fill="none" stroke={C.local} strokeWidth={4} />
              {[0, 1, 2].map((q) => <line key={q} x1={830 + 25 * (q + 1)} y1={t.y - 36} x2={830 + 25 * (q + 1)} y2={t.y + 36} stroke={C.local} strokeWidth={2} />)}</> : null}
            {i === 2 ? <><path d={`M 836 ${t.y + 36} Q 870 ${t.y} 896 ${t.y - 36}`} fill="none" stroke={C.key} strokeWidth={4} />
              <Arrow p={[912, t.y + 10]} q={[862, t.y - 6]} color={C.first} w={6} head={20} /></> : null}
          </g>
        ))}
      </Svg>
      <SourceBelow text="Data: HRRR analysis (NOAA) · 28 Sep 2022, 18 UTC" pic={{ x: 80, y: 80, w: 620, h: 700 }} w={640} name="s01 src hrrr" />
      <SourceBelow text="Image: NASA Blue Marble Next Generation" pic={{ x: 1000, y: 40, w: 840, h: 770 }} w={840} name="s01 src bmng" />
    </Scene>
  );
};

// ================================================================ s02 origin, axes, coordinates
const S02: React.FC = () => {
  const f = useCurrentFrame(), k = K("s02_coordinates");
  const tOrig = AT(k, 2, "origin"), tSta = AT(k, 3, "weather station"), tAx = SS(k, 4), tAxW = AT(k, 5, "axes");
  const tDrift = SS(k, 6), tPair = AT(k, 7, "three and four"), tCo = AT(k, 8, "coordinates"), tCa = AT(k, 9, "Cartesian");
  const d = prog(f, tDrift + 10, SE(k, 6) - 10);
  const bp = pp(3 * d, 4 * d);
  return (
    <Scene>
      <Svg>
        <Ground />
        <circle cx={PO[0]} cy={PO[1]} r={14} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={fin(f, tOrig) * (1 - fin(f, tSta))} />
        <AxesEN f={f} at={tAx} />
        <KmTicks o={fin(f, tDrift)} />
        <g opacity={fin(f, tDrift)}>
          <Dash p={PO} q={pp(3 * Math.min(1, d * 2), 0)} c={C.first} w={6} />
          {d > 0.5 ? <Dash p={pp(3, 0)} q={pp(3, 4 * Math.min(1, (d - 0.5) * 2))} c={C.first} w={6} /> : null}
        </g>
        <Station o={fin(f, tSta)} />
        <Balloon p={bp} o={fin(f, tDrift)} />
        <Lbl x={BAL[0] + 40} y={BAL[1] - 20} t="(3, 4)" c={C.key} s={T.calc} o={fin(f, tPair)} />
        <CurvedLink f={f} from={[BAL[0] + 60, BAL[1] + 10]} to={pp(1.5, 0.1)} start={tPair + 8} bend={60} />
        <CurvedLink f={f} from={[BAL[0] + 120, BAL[1] + 10]} to={pp(3.1, 2)} start={tPair + 14} bend={-40} />
        <Keyword f={f} text="a flat map" at={[1100, 160]} appear={AT(k, 0, "flat map")} out={tOrig - 18} />
        <Keyword f={f} text="origin" at={[1100, 160]} appear={tOrig} />
        <CurvedLink f={f} from={[1090, 180]} to={[PO[0] + 30, PO[1] - 40]} start={tOrig + 8} end={tPair - 12} bend={60} />
        <Keyword f={f} text="axes" at={[1100, 270]} appear={tAxW} />
        <Keyword f={f} text="coordinates" at={[1100, 560]} appear={tCo} />
        <Keyword f={f} text="Cartesian coordinates" at={[1100, 670]} appear={tCa} />
        <Lbl x={1100} y={740} t="René Descartes" c={C.muted} s={T.floor} o={fin(f, AT(k, 9, "René Descartes"))} />
      </Svg>
      <TeX s={String.raw`(x,\ y)=(3,\ 4)`} x={1100} y={420} size={84} o={fin(f, tPair)} />
    </Scene>
  );
};

// ================================================================ s03 constant x-hat, y-hat
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_cartesian_arrows");
  const t1 = SS(k, 0), tSum = SS(k, 2), tSame = AT(k, 4, "the same way everywhere"), tMove = SS(k, 5), tIns = SS(k, 7), tRing = AT(k, 8, "rings");
  const places: [number, number][] = [[3, 4], [6, 1.5], [1.8, 5.2], [-0.8, 2.5], [5, 5]];
  const hop = clamp((f - tMove) / ((SE(k, 5) - tMove) / 4), 0, 4);
  const i0 = Math.floor(hop), w = hop - i0;
  const cur: [number, number] = i0 >= 4 ? places[4] : [mix(places[i0][0], places[i0 + 1][0], prog(w, 0, 0.6)), mix(places[i0][1], places[i0 + 1][1], prog(w, 0, 0.6))];
  const at = f >= tMove ? cur : places[0];
  const unitAt = (p: [number, number], o: number, key: string) => <g key={key} opacity={o}>
    <Arrow p={pp(p[0], p[1])} q={pp(p[0] + 1, p[1])} color={C.second} w={7} head={28} />
    <Arrow p={pp(p[0], p[1])} q={pp(p[0], p[1] + 1)} color={C.second} w={7} head={28} />
  </g>;
  const MI = boxAt(IAN.c[0], IAN.c[1], 1.6, 1100, 430, 330, 300);
  return (
    <Scene>
      <Svg>
        <Ground />
        <AxesEN f={f} at={-40} />
        <KmTicks o={1} />
        <Station />
        <Dash p={PO} q={pp(3, 0)} c={C.first} w={5} />
        <Dash p={pp(3, 0)} q={pp(3, 4)} c={C.first} w={5} />
        {unitAt([0, 0], fin(f, t1), "o")}
        {f >= tMove ? places.slice(0, Math.min(5, i0 + 1)).map((p, i) => unitAt(p, 0.35, `g${i}`)) : null}
        <Balloon p={pp(at[0], at[1])} />
        {unitAt(at, fin(f, tMove), "b")}
        <Keyword f={f} text="unit vectors" at={[1100, 160]} appear={AT(k, 0, "unit vector")} out={tSum - 18} />
        <Keyword f={f} text="same everywhere" at={[1100, 300]} appear={tSame} out={tIns - 18} />
        <CurvedLink f={f} from={[1160, 215]} to={pp(1.5, 0.15)} ctl={[400, 230]} start={tSum + 10} end={tSame - 10} />
        <CurvedLink f={f} from={[1390, 215]} to={pp(3.15, 2)} start={tSum + 16} end={tSame - 10} bend={40} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf x}`} x={pp(1, 0)[0] + 10} y={PO[1] - 40} size={60} c={C.second} o={fin(f, t1 + 10)} />
      <TeX s={String.raw`\hat{\mathbf y}`} x={PO[0] + 20} y={pp(0, 1)[1] - 10} size={60} c={C.second} o={fin(f, t1 + 10)} />
      <TeX s={String.raw`3\,\hat{\mathbf x}+4\,\hat{\mathbf y}`} x={1100} y={160} size={84} o={fin(f, tSum)} />
      <GeoMap id="s03ian" B={MI} o={fin(f, tIns)} frame={0.8}>
        {(P) => <>
          <GeoImg P={P} href={IMGS.ian(18)} box={IAN.speed_box} />
          <path d={linesPath(P, IAN.coast)} fill="none" stroke={C.key} strokeOpacity={0.7} strokeWidth={1.8} />
          {Array.from({ length: 8 }, (_, i) => <line key={`a${i}`} x1={1100 + i * 47} y1={430} x2={1100 + i * 47} y2={730} stroke={C.gold} strokeWidth={2} opacity={0.6} />)}
          {Array.from({ length: 7 }, (_, i) => <line key={`b${i}`} x1={1100} y1={430 + i * 50} x2={1430} y2={430 + i * 50} stroke={C.gold} strokeWidth={2} opacity={0.6} />)}
        </>}
      </GeoMap>
      <Svg>
        <g opacity={fin(f, tRing)}>
          <rect x={1480} y={430} width={330} height={300} rx={8} fill="#1d2a44" stroke={C.grid} strokeWidth={3} />
          {[40, 80, 120, 160].map((r) => <circle key={r} cx={1645} cy={580} r={r} fill="none" stroke={C.first} strokeWidth={3} opacity={0.85} />)}
          {Array.from({ length: 7 }, (_, i) => <line key={`a${i}`} x1={1480 + i * 55} y1={430} x2={1480 + i * 55} y2={730} stroke={C.gold} strokeWidth={2} opacity={0.6} />)}
          {Array.from({ length: 6 }, (_, i) => <line key={`b${i}`} x1={1480} y1={430 + i * 60} x2={1810} y2={430 + i * 60} stroke={C.gold} strokeWidth={2} opacity={0.6} />)}
          <circle cx={1645} cy={580} r={8} fill={C.local} />
        </g>
        <Lbl x={1645} y={790} t="radar rings" c={C.muted} s={T.floor} a="middle" o={fin(f, tRing)} />
      </Svg>
      <SourceBelow text="Data: HRRR (NOAA) · Ian, 28 Sep 2022" pic={{ x: 1100, y: 430, w: 330, h: 300 }} w={360} o={fin(f, tIns)} name="s03 src" />
    </Scene>
  );
};

// ================================================================ s04 polar coordinates
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = K("s04_polar");
  const tR = AT(k, 1, "called r"), tPy = AT(k, 2, "Pythagoras"), t25 = AT(k, 2, "twenty five"), t5 = AT(k, 2, "five kilometres");
  const tTh = AT(k, 3, "called theta"), tAnti = AT(k, 4, "anticlockwise"), tTan = AT(k, 5, "tangent"), t53 = AT(k, 5, "fifty three"), tPair = SS(k, 6);
  const tPol = AT(k, 7, "polar coordinates"), tRad = AT(k, 8, "weather radar");
  const th = PL.th;
  const mid: Pt = [(PO[0] + BAL[0]) / 2, (PO[1] + BAL[1]) / 2];
  return (
    <Scene>
      <Svg>
        <Ground />
        <defs><clipPath id="s04g"><rect x={110} y={60} width={880} height={780} rx={18} /></clipPath></defs>
        <g opacity={fin(f, tRad, 20)} clipPath="url(#s04g)">
          {[1, 2, 3, 4, 5, 6].map((r) => <circle key={r} cx={PO[0]} cy={PO[1]} r={r * PU} fill="none" stroke={C.first} strokeWidth={2.5} opacity={0.55} />)}
          {Array.from({ length: 12 }, (_, i) => i * 30).map((a) => <line key={a} x1={PO[0]} y1={PO[1]} x2={PO[0] + 650 * Math.cos(a * D2R)} y2={PO[1] - 650 * Math.sin(a * D2R)} stroke={C.first} strokeWidth={1.8} opacity={0.4} />)}
        </g>
        <AxesEN f={f} at={-40} />
        <KmTicks o={1} />
        <Band p={PO} q={pp(3, 0)} color={C.second} o={0.55 * pulse(f, tPy, 40)} />
        <Band p={pp(3, 0)} q={BAL} color={C.second} o={0.55 * pulse(f, tPy, 40)} />
        <Dash p={PO} q={pp(3, 0)} c={C.second} w={5} /><Dash p={pp(3, 0)} q={BAL} c={C.second} w={5} />
        <line x1={PO[0]} y1={PO[1]} x2={mix(PO[0], BAL[0], prog(f, tR - 6, tR + 18))} y2={mix(PO[1], BAL[1], prog(f, tR - 6, tR + 18))} stroke={C.first} strokeWidth={10} strokeLinecap="round" opacity={fin(f, tR - 6)} />
        <Station />
        <Balloon p={BAL} />
        <Lbl x={mid[0] - 34} y={mid[1] - 20} t="r" c={C.first} s={T.calc} a="end" o={fin(f, tR)} />
        <path d={arcD(PO, 110, 0, th * prog(f, tTh, tTh + 24))} fill="none" stroke={C.local} strokeWidth={6} opacity={fin(f, tTh)} />
        <Lbl x={PO[0] + 140} y={PO[1] - 56} t="θ" c={C.local} s={T.calc} o={fin(f, tTh + 10)} />
        <path d={arcD(PO, 190, 8, 70)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tAnti)} />
        <ArcHead c={PO} r={190} a={70} dir={1} col={C.gold} o={fin(f, tAnti)} />
        <Lbl x={1100} y={700} t="anticlockwise, seen from above" c={C.key} s={T.floor} o={fin(f, tAnti)} />
        <Keyword f={f} text="how far · which direction" at={[1100, 700]} s={T.floor} appear={AT(k, 0, "two other numbers")} out={tAnti - 18} />
        <Keyword f={f} text="polar coordinates" at={[1100, 790]} appear={tPol} />
      </Svg>
      <TeX s={String.raw`r=${cutAt(EQ_S04, String.raw`,\qquad r=`)[1]}`} x={1100} y={85} size={50} c={C.local} o={fin(f, tPy)} />
      <CalcStack f={f} x={1240} y={150} size={60} rows={[
        { lhs: "r", rhs: String.raw`=\sqrt{3^2+4^2}`, at: tPy },
        { rhs: String.raw`=\sqrt{25}`, at: t25, cont: true },
        { rhs: String.raw`=5\ \mathrm{km}`, at: t5, cont: true },
        { lhs: String.raw`\tan\theta`, rhs: String.raw`=4/3`, at: tTan },
        { lhs: String.raw`\theta`, rhs: String.raw`\approx 53^{\circ}`, at: t53, cont: true },
        { lhs: String.raw`(r,\ \theta)`, rhs: String.raw`=(5\ \mathrm{km},\ 53^{\circ})`, at: tPair },
      ]} />
    </Scene>
  );
};

// ================================================================ s05 back to x, y
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = K("s05_polar_back");
  const tTri = SS(k, 2), tSides = SS(k, 4), tC = SS(k, 6), t4 = SS(k, 7), tEq = SS(k, 8);
  const [e1, e2] = cutAt(EQ_S05, String.raw`,\qquad r=`);
  return (
    <Scene>
      <Svg>
        <Ground grid={0.3} />
        <AxesEN f={f} at={-40} />
        <g opacity={fin(f, tTri)}>
          <path d={poly([PO, pp(3, 0), BAL, PO])} fill={C.first} fillOpacity={0.08} stroke="none" />
          <line x1={PO[0]} y1={PO[1]} x2={pp(3, 0)[0]} y2={PO[1]} stroke={C.second} strokeWidth={8} />
          <line x1={pp(3, 0)[0]} y1={PO[1]} x2={BAL[0]} y2={BAL[1]} stroke={C.second} strokeWidth={8} />
          <line x1={PO[0]} y1={PO[1]} x2={BAL[0]} y2={BAL[1]} stroke={C.first} strokeWidth={10} />
          <RightTick at={pp(3, 0)} u1={[-1, 0]} u2={[0, -1]} c={C.ink} />
          <path d={arcD(PO, 110, 0, PL.th)} fill="none" stroke={C.local} strokeWidth={6} />
          <Lbl x={PO[0] + 140} y={PO[1] - 56} t="θ" c={C.local} s={T.calc} />
          <Lbl x={(PO[0] + BAL[0]) / 2 - 34} y={(PO[1] + BAL[1]) / 2 - 20} t="r" c={C.first} s={T.calc} a="end" />
        </g>
        <Station />
        <Balloon p={BAL} />
        <Keyword f={f} text="back to x and y" at={[1100, 640]} appear={AT(k, 0, "back the other way")} out={tEq - 18} />
        <CurvedLink f={f} from={[1140, 335]} to={pp(1.5, 0.15)} ctl={[900, 700]} start={tC + 10} end={t4 - 4} />
        <CurvedLink f={f} from={[1250, 420]} to={pp(3.15, 3.2)} start={t4 + 6} end={tEq - 10} bend={20} />
      </Svg>
      <TeX s={String.raw`r\cos\theta`} x={pp(1.5, 0)[0]} y={PO[1] + 60} size={60} ax={0.5} c={C.second} o={fin(f, tSides)} />
      <TeX s={String.raw`r\sin\theta`} x={pp(3, 0)[0] + 24} y={pp(3, 2)[1]} size={60} c={C.second} o={fin(f, AT(k, 4, "the side going north"))} />
      <CalcStack f={f} x={1440} y={290} size={60} rows={[
        { lhs: String.raw`5\times\cos 53^{\circ}`, rhs: String.raw`=5\times0.6=3`, at: tC },
        { lhs: String.raw`5\times0.8`, rhs: String.raw`=4`, at: t4 },
      ]} />
      <TeX s={e1} x={1100} y={640} size={60} o={fin(f, tEq)} />
      <TeX s={String.raw`r=${e2}`} x={1100} y={760} size={64} c={C.local} o={fin(f, tEq + 20)} />
    </Scene>
  );
};

// ================================================================ s06 maths angle vs compass bearing vs "from"
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = K("s06_bearings");
  const tBear = SS(k, 2), tCalc = AT(k, 3, "ninety minus fifty three"), tFrom = SS(k, 4), tWest = SS(k, 5), tCheck = SS(k, 6);
  const brg = 90 - PL.th;
  const W0: Pt = [1250, 560], W1: Pt = [1650, 560];
  return (
    <Scene>
      <Svg>
        <Ground grid={0.3} />
        <AxesEN f={f} at={-40} />
        <line x1={PO[0]} y1={PO[1]} x2={BAL[0]} y2={BAL[1]} stroke={C.first} strokeWidth={8} />
        <Station />
        <Balloon p={BAL} />
        <path d={arcD(PO, 120, 0, PL.th)} fill="none" stroke={C.local} strokeWidth={6} />
        <ArcHead c={PO} r={120} a={PL.th} dir={1} col={C.local} />
        <Lbl x={PO[0] + 150} y={PO[1] - 50} t="53°" c={C.local} s={T.key} />
        <g opacity={fin(f, tBear)}>
          <path d={arcD(PO, 210, 90, 90 - brg * prog(f, tBear, tBear + 30))} fill="none" stroke={C.gold} strokeWidth={6} />
          <ArcHead c={PO} r={210} a={90 - brg * prog(f, tBear, tBear + 30)} dir={-1} col={C.gold} />
          <Lbl x={PO[0] + 70} y={PO[1] - 250} t="37°" c={C.gold} s={T.key} o={fin(f, tCalc + 20)} />
        </g>
        <Keyword f={f} text="from" at={[W0[0] - 20, W0[1] - 70]} a="end" appear={tFrom} />
        <g opacity={fin(f, tWest)}>
          <AnimatedWindArrow from={W0} to={W1} speed={10} f={f} c={C.first} px={10} head={40} />
          <Lbl x={W0[0] - 20} y={W0[1]} t="W" c={C.muted} s={T.key} a="end" />
          <Lbl x={W1[0] + 24} y={W1[1]} t="E" c={C.muted} s={T.key} />
        </g>
        <Lbl x={1250} y={660} t="a west wind blows east" c={C.key} s={T.floor} o={fin(f, AT(k, 5, "towards the east"))} />
        <Keyword f={f} text="maths angle or compass bearing?" at={[1100, 790]} s={T.floor} appear={AT(k, 0, "warning")} out={tCheck - 18} />
        <Keyword f={f} text="check which angle" at={[1100, 790]} appear={tCheck} />
      </Svg>
      <TeX s={String.raw`90^{\circ}-53^{\circ}=37^{\circ}`} x={1100} y={200} size={84} o={fin(f, tCalc)} />
      <TeX s={String.raw`u=+10,\ v=0`} x={1250} y={460} size={60} c={C.first} o={fin(f, AT(k, 5, "towards the east") + 20)} />
    </Scene>
  );
};

// ================================================================ s07 radians and arc length
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_radians");
  const tCir = SS(k, 1), tDiv = SS(k, 2), tArc = AT(k, 3, "arc length"), tFull = SS(k, 4), t57 = SS(k, 5), tEasy = SS(k, 6), t1 = AT(k, 7, "one kilometre"),
    t10 = SS(k, 8), tSame = SS(k, 9), tKeep = SS(k, 10);
  const O1: Pt = [460, 440], R1 = 280;
  const walk = prog(f, tCir + 10, tDiv + 60);
  const full = prog(f, tFull, tFull + 60);
  const ang = Math.max(walk * 57.3, full * 360);
  const oA = fout(f, tEasy - 16, 14), oB = fin(f, tEasy, 14);
  const O2: Pt = [150, 800], a0 = 22, a1 = a0 + 0.2 / D2R;
  return (
    <Scene>
      <Svg>
        <g opacity={oA}>
          <circle cx={O1[0]} cy={O1[1]} r={R1} fill="none" stroke={C.first} strokeWidth={4} opacity={0.6} />
          <line x1={O1[0]} y1={O1[1]} x2={O1[0] + R1} y2={O1[1]} stroke={C.first} strokeWidth={8} />
          <Lbl x={O1[0] + R1 / 2} y={O1[1] + 40} t="r" c={C.first} s={T.calc} a="middle" />
          <path d={arcD(O1, R1, 0, ang)} fill="none" stroke={C.second} strokeWidth={12} strokeLinecap="round" />
          <circle cx={O1[0] + R1 * Math.cos(ang * D2R)} cy={O1[1] - R1 * Math.sin(ang * D2R)} r={14} fill={C.key} stroke={C.bg} strokeWidth={4} opacity={fin(f, tCir)} />
          <path d={arcD(O1, 70, 0, ang)} fill="none" stroke={C.local} strokeWidth={5} />
          <Lbl x={O1[0] + R1 * 1.18 * Math.cos(30 * D2R)} y={O1[1] - R1 * 1.18 * Math.sin(30 * D2R)} t="s" c={C.second} s={T.calc} a="middle" o={fin(f, tArc) * fout(f, tFull)} />
          {/* fix loop 1 (Should 1): outside the orange circle at the upper left, clear of its stroke (≥ 45 px) */}
          <Lbl x={O1[0] + R1 * 1.25 * Math.cos(140 * D2R)} y={O1[1] - R1 * 1.25 * Math.sin(140 * D2R)} t="2π r" c={C.second} s={T.calc} a="end" o={fin(f, tFull + 40)} />
          <Lbl x={O1[0] - 20} y={O1[1] + 100} t="2π rad" c={C.local} s={T.key} a="middle" o={fin(f, tFull + 50)} />
          <Lbl x={O1[0] + 110} y={O1[1] - 60} t="1 rad ≈ 57°" c={C.local} s={T.key} o={fin(f, t57) * fout(f, tFull - 10)} />
        </g>
        <g opacity={oB}>
          <line x1={O2[0]} y1={O2[1]} x2={O2[0] + 780 * Math.cos(a0 * D2R)} y2={O2[1] - 780 * Math.sin(a0 * D2R)} stroke={C.local} strokeWidth={3} />
          <line x1={O2[0]} y1={O2[1]} x2={O2[0] + 780 * Math.cos(a1 * D2R)} y2={O2[1] - 780 * Math.sin(a1 * D2R)} stroke={C.local} strokeWidth={3} />
          <path d={arcD(O2, 70, 0, 80)} fill="none" stroke={C.first} strokeWidth={3} opacity={0.6} />
          <path d={arcD(O2, 700, 0, 70)} fill="none" stroke={C.first} strokeWidth={3} opacity={0.6} />
          <path d={arcD(O2, 70, a0, a1)} fill="none" stroke={C.second} strokeWidth={12} opacity={fin(f, t1 - 20)} />
          <path d={arcD(O2, 700, a0, a1)} fill="none" stroke={C.second} strokeWidth={12} opacity={fin(f, t10)} />
          <Lbl x={O2[0] + 120} y={O2[1] - 10} t="5 km" c={C.first} s={T.floor} o={fin(f, tEasy)} />
          <Lbl x={O2[0] + 460} y={O2[1] - 60} t="50 km" c={C.first} s={T.floor} o={fin(f, tEasy + 20)} />
          <Lbl x={O2[0] + 40} y={O2[1] - 155} t="1 km" c={C.second} s={T.key} o={fin(f, t1)} />
          <Lbl x={O2[0] + 700 * Math.cos(27 * D2R) + 30} y={O2[1] - 700 * Math.sin(27 * D2R) - 30} t="10 km" c={C.second} s={T.key} o={fin(f, t10 + 20)} />
        </g>
        {/* fix loop 1 (Should 18): the opening keyword from frame 0 (QA halves WARN 4:32-4:36) */}
        <Keyword f={f} text="radians" at={[1100, 420]} appear={0} out={tArc - 18} />
        <Keyword f={f} text="arc length" at={[1100, 420]} appear={tArc} out={tEasy - 18} />
        <Keyword f={f} text="same angle, ten times the distance" at={[1080, 700]} appear={tSame} s={T.floor} targets={[[O2[0] + 330 * Math.cos(26 * D2R), O2[1] - 330 * Math.sin(26 * D2R)]]} />
        <Keyword f={f} text="keep this rule" at={[1080, 800]} appear={tKeep} s={T.floor} />
      </Svg>
      <TeX s={EQ_S07} x={1100} y={200} size={72} o={fin(f, tDiv + 40)} />
      <TeX s={String.raw`\theta=\dfrac{s}{r}`} x={1100} y={320} size={60} c={C.local} o={fin(f, tDiv) * fout(f, tEasy - 18)} />
      <CalcStack f={f} x={1260} y={420} size={60} rows={[
        { lhs: String.raw`5\times0.2`, rhs: String.raw`=1\ \mathrm{km}`, at: t1 },
        { lhs: String.raw`50\times0.2`, rhs: String.raw`=10\ \mathrm{km}`, at: t10 + 10 },
      ]} />
    </Scene>
  );
};

// ================================================================ s08 polar unit vectors (they depend on where you are)
const O8: Pt = [430, 440], R8 = 250;   // K6: the whole turn stays above the caption band (r̂ label at the bottom of the circle)
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = K("s08_polar_unit_vectors");
  const tR = SS(k, 1), tT = SS(k, 2), tRv = SS(k, 3), tTv = SS(k, 4), tMove = SS(k, 5), tDep = AT(k, 7, "depend on where you are");
  const th = PL.th + 360 * prog(f, tMove + 10, SE(k, 6) - 6);
  const b: Pt = [O8[0] + R8 * Math.cos(th * D2R), O8[1] - R8 * Math.sin(th * D2R)];
  const L = 110, er: Pt = [Math.cos(th * D2R), -Math.sin(th * D2R)], et: Pt = [-Math.sin(th * D2R), -Math.cos(th * D2R)];
  const [q1, q2] = cutAt(EQ_S08, String.raw`,\qquad `);
  return (
    <Scene>
      <Svg>
        <circle cx={O8[0]} cy={O8[1]} r={R8} fill="none" stroke={C.first} strokeWidth={3} opacity={0.5} />
        <PoleThermometer x={O8[0]} y={O8[1]} s={0.8} />
        <line x1={O8[0]} y1={O8[1]} x2={b[0]} y2={b[1]} stroke={C.first} strokeWidth={5} opacity={0.6} />
        <Balloon p={b} s={0.8} />
        <Arrow p={b} q={[b[0] + er[0] * L, b[1] + er[1] * L]} color={C.second} o={fin(f, tR)} />
        <Arrow p={b} q={[b[0] + et[0] * L, b[1] + et[1] * L]} color={C.second} o={fin(f, tT)} />
        <g opacity={fin(f, tMove)}>
          <Arrow p={[150, 800]} q={[250, 800]} color={C.second} w={6} head={24} o={0.55} />
          <Arrow p={[150, 800]} q={[150, 700]} color={C.second} w={6} head={24} o={0.55} />
        </g>
        <Keyword f={f} text="their own unit vectors" at={[1100, 760]} appear={AT(k, 0, "own unit vectors")} out={tDep - 18} />
        <Keyword f={f} text="depend on where you are" at={[1100, 760]} appear={tDep} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf r}`} x={b[0] + er[0] * (L + 36)} y={b[1] + er[1] * (L + 36)} size={60} ax={0.5} c={C.second} o={fin(f, tR + 10)} />
      <TeX s={String.raw`\hat{\boldsymbol\theta}`} x={b[0] + et[0] * (L + 40)} y={b[1] + et[1] * (L + 40)} size={60} ax={0.5} c={C.second} o={fin(f, tT + 10)} />
      <TeX s={String.raw`\hat{\mathbf x},\ \hat{\mathbf y}`} x={270} y={760} size={44} c={C.muted} o={fin(f, tMove)} />
      <TeX s={q1} x={1100} y={160} size={60} o={fin(f, tR + 30)} />
      <TeX s={q2} x={1100} y={270} size={60} o={fin(f, tT + 30)} />
      <TeX s={String.raw`\hat{\mathbf r}=(0.6,\ 0.8)`} x={1100} y={430} size={68} c={C.second} o={fin(f, tRv)} />
      <TeX s={String.raw`\hat{\boldsymbol\theta}=(-0.8,\ 0.6)`} x={1100} y={560} size={68} c={C.second} o={fin(f, tTv)} />
    </Scene>
  );
};

// ================================================================ s09 how fast they turn
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09_unit_vectors_turn");
  const tD = SS(k, 1), tTip = SS(k, 2), tSide = SS(k, 3), tChg = SS(k, 4), tDiv = SS(k, 5), tTh = SS(k, 6), tSwing = SS(k, 7);
  const O: Pt = [460, 470], R = 300, base = 30, dth = 20;
  const sw = 90 * prog(f, tSwing + 10, LEN(k) - 20);
  const th0 = base + sw, th1 = th0 + dth * prog(f, tD, tD + 30) * fout(f, tSwing - 12, 12);
  const at = (a: number, r = R): Pt => [O[0] + r * Math.cos(a * D2R), O[1] - r * Math.sin(a * D2R)];
  const tipR = at(th0), tipT = at(th0 + 90);
  const ghost = fin(f, tSwing) * 0.4;
  const [q1, q2] = cutAt(EQ_S09, String.raw`,\qquad `);
  return (
    <Scene>
      <Svg>
        <circle cx={O[0]} cy={O[1]} r={R} fill="none" stroke={C.local} strokeWidth={3} opacity={0.6} />
        {/* fix loop 1 (Must 9): under the circle, centred (it was clipped at the frame's left edge) */}
        <Lbl x={O[0]} y={O[1] + R + 48} t="radius 1" c={C.muted} s={T.floor} a="middle" />
        <path d={`M ${O[0]} ${O[1]} L ${at(th0)[0]} ${at(th0)[1]} A ${R} ${R} 0 0 0 ${at(th1)[0]} ${at(th1)[1]} Z`} fill={C.gold} fillOpacity={0.18} opacity={fin(f, tD)} />
        <path d={arcD(O, R, th0, th1)} fill="none" stroke={C.second} strokeWidth={10} opacity={fin(f, tTip)} />
        <Arrow p={O} q={at(base, R)} color={C.second} o={ghost} />
        <Arrow p={O} q={at(base + 90, R)} color={C.second} o={ghost * fin(f, tTh)} />
        <Arrow p={O} q={tipR} color={C.second} />
        <Arrow p={tipR} q={[tipR[0] - 150 * Math.sin(th0 * D2R), tipR[1] - 150 * Math.cos(th0 * D2R)]} color={C.second} w={7} head={30} o={fin(f, tSide) * fout(f, tSwing - 12)} />
        <g opacity={fin(f, tTh)}>
          <Arrow p={O} q={tipT} color={C.second} />
          <Arrow p={tipT} q={[tipT[0] - 150 * Math.cos(th0 * D2R), tipT[1] + 150 * Math.sin(th0 * D2R)]} color={C.neg} w={7} head={30} o={fout(f, tSwing - 12)} />
        </g>
        <Lbl x={at(th0 + dth / 2, R + 46)[0]} y={at(th0 + dth / 2, R + 46)[1]} t="dθ" c={C.second} s={T.key} a="middle" o={fin(f, tTip) * fout(f, tSwing - 12)} />
        <Keyword f={f} text="how fast do they turn?" at={[1080, 760]} s={T.floor} appear={AT(k, 0, "How fast")} out={tSwing - 18} />
        <Keyword f={f} text="each swings towards the other" at={[1080, 760]} s={T.floor} appear={tSwing} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf r}`} x={at(th0 - 8, R + 50)[0]} y={at(th0 - 8, R + 50)[1]} size={60} ax={0.5} c={C.second} />
      <TeX s={String.raw`\hat{\boldsymbol\theta}`} x={at(th0 + 90, R + 50)[0]} y={at(th0 + 90, R + 50)[1]} size={60} ax={0.5} c={C.second} o={fin(f, tTh)} />
      <TeX s={String.raw`-\hat{\mathbf r}`} x={tipT[0] - 190 * Math.cos(th0 * D2R)} y={tipT[1] + 190 * Math.sin(th0 * D2R)} size={54} ax={0.5} c={C.neg} o={fin(f, tTh + 20) * fout(f, tSwing - 12)} />
      <TeX s={String.raw`d\hat{\mathbf r}=\hat{\boldsymbol\theta}\,d\theta`} x={1100} y={200} size={72} o={fin(f, tChg)} />
      <TeX s={q1} x={1100} y={380} size={72} o={fin(f, tDiv)} />
      <TeX s={q2} x={1100} y={560} size={72} o={fin(f, AT(k, 6, "minus r hat"))} />
    </Scene>
  );
};

// ================================================================ s10 the east wind in polar components
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_polar_components");
  const tWind = SS(k, 1), tQ = SS(k, 2), tDot = SS(k, 3), tR = SS(k, 4), tT = SS(k, 5), tSay = SS(k, 6), tCw = SS(k, 7), tLen = SS(k, 8);
  const th = PL.th, b: Pt = [O8[0] + R8 * Math.cos(th * D2R), O8[1] - R8 * Math.sin(th * D2R)];
  const s = 22, er: Pt = [PL.rhat[0], -PL.rhat[1]], et: Pt = [PL.thhat[0], -PL.thhat[1]];
  const sr: Pt = [b[0] + er[0] * PL.ur * s, b[1] + er[1] * PL.ur * s], st: Pt = [b[0] + et[0] * PL.ut * s, b[1] + et[1] * PL.ut * s];
  return (
    <Scene>
      <Svg>
        <circle cx={O8[0]} cy={O8[1]} r={R8} fill="none" stroke={C.first} strokeWidth={3} opacity={0.4} />
        <PoleThermometer x={O8[0]} y={O8[1]} s={0.8} />
        <line x1={O8[0]} y1={O8[1]} x2={b[0]} y2={b[1]} stroke={C.first} strokeWidth={4} opacity={0.4} />
        <Dash p={[b[0] - er[0] * 60, b[1] - er[1] * 60]} q={[b[0] + er[0] * 220, b[1] + er[1] * 220]} c={C.second} w={3} />
        <Dash p={[b[0] - et[0] * 220, b[1] - et[1] * 220]} q={[b[0] + et[0] * 120, b[1] + et[1] * 120]} c={C.second} w={3} />
        <Band p={b} q={sr} color={C.second} o={0.6 * fin(f, tR)} />
        <Band p={b} q={st} color={C.neg} o={0.6 * fin(f, tT)} />
        <Balloon p={b} s={0.7} />
        <g opacity={fin(f, tWind)}><AnimatedWindArrow from={b} to={[b[0] + 10 * s, b[1]]} speed={10} f={f} c={C.first} px={10} head={40} /></g>
        <Lbl x={sr[0] + 30} y={sr[1] - 10} t="6 outward" c={C.second} s={T.floor} o={fin(f, tSay)} />
        <Lbl x={st[0] - 20} y={st[1] + 50} t="8 round" c={C.neg} s={T.floor} a="end" o={fin(f, tSay + 10)} />
        <CurvedLink f={f} from={[1110, 400]} to={[(b[0] + sr[0]) / 2 + 10, (b[1] + sr[1]) / 2 - 10]} start={tR + 8} end={tSay - 10} bend={60} />
        <CurvedLink f={f} from={[1110, 520]} to={[(b[0] + st[0]) / 2, (b[1] + st[1]) / 2 + 12]} start={tT + 8} end={tSay - 10} bend={-60} />
        <Lbl x={1100} y={660} t="clockwise, seen from above" c={C.key} s={T.floor} o={fin(f, tCw)} />
        <Keyword f={f} text="a wind in polar coordinates" at={[1100, 150]} s={T.floor} appear={AT(k, 0, "a wind")} out={tDot - 18} />
        <Keyword f={f} text="same wind, new components" at={[1100, 800]} s={T.floor} appear={SS(k, 9)} />
      </Svg>
      <TeX s={String.raw`\mathbf u=10\ \mathrm{m/s}\ \text{east}`} x={b[0] - 40} y={b[1] - 110} size={48} ax={1} c={C.first} o={fin(f, tWind)} />
      <TeX s={EQ_S10} x={1100} y={150} size={60} o={fin(f, tDot)} />
      <CalcStack f={f} x={1180} y={250} size={50} rows={[
        { lhs: String.raw`u_r`, rhs: String.raw`=10\times0.6+0\times0.8=6`, at: tR },
        { lhs: String.raw`u_\theta`, rhs: String.raw`=10\times(-0.8)+0\times0.6=-8`, at: tT },
        { lhs: String.raw`\sqrt{6^2+8^2}`, rhs: String.raw`=\sqrt{100}=10`, at: tLen },
      ]} />
    </Scene>
  );
};

// ================================================================ s11 Hurricane Ian in polar coordinates (zoom tour)
const IAN_FULL: MapBox = { lat0: 24.0, lat1: 29.5, lon0: -85.0, lon1: -79.5, x: 80, y: 40, w: 1300, h: 760 };
const ianZoom = (x = 80, w = 1300): MapBox => boxAt(IAN.c[0], IAN.c[1], 1.08, x, 40, w, 760);
const ringPts = (P: (la: number, lo: number) => Pt) => poly((IAN.ring.lat as number[]).map((la, i) => P(la, IAN.ring.lon[i]))) + "Z";
/** tangential and radial arrows at ring point i (px per m/s = s), directions from the data's own r̂ */
const ringArrows = (P: (la: number, lo: number) => Pt, i: number, s: number) => {
  const r = IAN.ring, p0 = P(r.lat[i], r.lon[i]), a = r.az[i] * D2R;
  return { p0, tp: [p0[0] - Math.sin(a) * r.vt[i] * s, p0[1] - Math.cos(a) * r.vt[i] * s] as Pt, rp: [p0[0] + Math.cos(a) * r.vr[i] * s, p0[1] - Math.sin(a) * r.vr[i] * s] as Pt };
};
/** fix loop 1 (Must 4): the two ring-MEAN components (the spoken 37 and −12.5 m/s) drawn at ring point i, along the data's own
 * r̂ and θ̂ there (the local radial wind at that point is only a ≈ 2-m/s stub) */
const ringArrowsMean = (P: (la: number, lo: number) => Pt, i: number, s: number, vt: number, vr: number) => {
  const r = IAN.ring, p0 = P(r.lat[i], r.lon[i]), a = r.az[i] * D2R;
  return { p0, tp: [p0[0] - Math.sin(a) * vt * s, p0[1] - Math.cos(a) * vt * s] as Pt, rp: [p0[0] + Math.cos(a) * vr * s, p0[1] - Math.sin(a) * vr * s] as Pt };
};
const IanMap: React.FC<{ id: string; B: MapBox; f: number; z: number; o?: number; children?: (P: (la: number, lo: number) => Pt) => React.ReactNode }> = ({ id, B, f, z, o = 1, children }) => (
  <GeoMap id={id} B={B} o={o} fade={z} frame={1}>
    {(P) => <>
      <GeoImg P={P} href={IMGS.goes} box={IAN.goes_box} o={0.6} />
      <GeoImg P={P} href={IMGS.ian(18)} box={IAN.speed_box} o={0.8} />
      <path d={linesPath(P, IAN.coast)} fill="none" stroke={C.key} strokeOpacity={0.85} strokeWidth={2.2} />
      <FlowParticles P={(la, lo) => P(la, lo)} tracks={IAN.tracks} fr={f / 2} tail={10} w={2.2} o={1 - z} />
      <FlowParticles P={(la, lo) => P(la, lo)} tracks={IAN.ztracks} fr={f / 2} tail={12} w={2.6} o={z} />
      {children ? children(P) : null}
    </>}
  </GeoMap>
);
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_ian_polar");
  const tZ = AT(k, 3, "zoom in"), tSur = SS(k, 4), tGulf = AT(k, 4, "Gulf of Mexico"), tLand = AT(k, 4, "southwest Florida"), tRad = SS(k, 6), tTan = SS(k, 7),
    tRing = SS(k, 8), tKmh = SS(k, 9), tRadM = SS(k, 10), tIn = SS(k, 11), tBest = SS(k, 12), tOut = SS(k, 14);
  const z = prog(f, tZ, tZ + 45) * (1 - prog(f, tOut + 6, tOut + 66));
  const B = zoomBox(IAN_FULL, ianZoom(), z);
  const P = mapP(B);
  const ra = ringArrowsMean(P, 9, 7.5 * z, IAN.vt[3], IAN.vr[3]);
  const ringDraw = prog(f, tRing, tRing + 30) * (1 - prog(f, tOut, tOut + 12));
  const cE = P(IAN.c[0], IAN.c[1]);
  return (
    <Scene>
      <IanMap id="s11m" B={B} f={f} z={z}>
        {(Pm) => <>
          <circle cx={cE[0]} cy={cE[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={fin(f, tZ)} />
          <path d={ringPts(Pm)} fill="none" stroke={C.first} strokeWidth={6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ringDraw} />
          <g opacity={fin(f, tRad) * z}><AnimatedWindArrow from={ra.p0} to={ra.rp} speed={Math.abs(IAN.vr[3])} f={f} c={C.neg} px={10} head={36} /></g>
          <g opacity={fin(f, tTan) * z}><AnimatedWindArrow from={ra.p0} to={ra.tp} speed={IAN.vt[3]} f={f} c={C.first} px={10} head={36} /></g>
          <path d={arcD(cE, (25 / 111.2 / (B.lat1 - B.lat0)) * B.h * 1.45, 200, 290)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tKmh + 20) * z} />
          <ArcHead c={cE} r={(25 / 111.2 / (B.lat1 - B.lat0)) * B.h * 1.45} a={290} dir={1} col={C.gold} o={fin(f, tKmh + 20) * z} />
          <Place p={Pm(26.3, -83.15)} t="Gulf of Mexico" r={0} dx={0} dy={0} a="middle" italic o={win(f, tGulf, tOut - 6) * z} />
          <Place p={Pm(26.75, -81.62)} t="southwest Florida" r={0} dx={60} dy={0} a="end" o={win(f, tLand, tOut - 6) * z} />
        </>}
      </IanMap>
      <Svg>
        <SpeedBar x={1420} y={110} w={300} />
        <Keyword f={f} text="radial: in or out" at={[1430, 358]} s={T.floor} appear={tRad} c={C.neg} out={tOut - 18} />
        <Keyword f={f} text="tangential: round" at={[1430, 412]} s={T.floor} appear={tTan} c={C.first} out={tOut - 18} />
        {/* fix loop 1 (Must 5): SideCallouts — each link leaves from the left edge of its own line and runs below the
            "southwest Florida" label to the middle of its own (ring-mean) arrow; the two links never cross */}
        <SideCallout f={f} lines="≈ 37 m/s" at={[1430, 470]} appear={tRing + 20} target={z > 0.5 ? [(ra.p0[0] + ra.tp[0]) / 2, (ra.p0[1] + ra.tp[1]) / 2] : null} c={C.first} out={tOut - 18} bend={20} />
        <Lbl x={1430} y={530} t="≈ 130 km/h" c={C.first} s={T.floor} o={win(f, tKmh, tOut - 18)} />
        <Lbl x={1430} y={590} t="anticlockwise" c={C.key} s={T.floor} o={win(f, tKmh + 20, tOut - 18)} />
        <SideCallout f={f} lines="−12.5 m/s" at={[1430, 665]} appear={tRadM} target={z > 0.5 ? [(ra.p0[0] + ra.rp[0]) / 2, (ra.p0[1] + ra.rp[1]) / 2] : null} c={C.neg} out={tOut - 18} bend={20} />
        <Lbl x={1430} y={730} t="in, towards the eye" c={C.neg} s={T.floor} o={win(f, tIn, tOut - 18)} />
        {/* fix loop 1 (Should 4): the voice says "official estimate" */}
        <Lbl x={1430} y={790} t="official estimate:" c={C.local} s={T.floor} o={win(f, tBest, tOut - 18)} />
        <Lbl x={1430} y={845} t="135 kt ≈ 250 km/h" c={C.local} s={T.floor} o={win(f, tBest, tOut - 18)} />
      </Svg>
      <TeX s={cutAt(EQ_S11, String.raw`\qquad `)[0]} x={1430} y={240} size={46} o={fin(f, tRad) * fout(f, tOut - 18)} />
      <TeX s={cutAt(EQ_S11, String.raw`\qquad `)[1]} x={1430} y={298} size={46} o={fin(f, tRad) * fout(f, tOut - 18)} />
      <SourceBelow text="Data: HRRR analysis (NOAA) · GOES-16 (NOAA) · 28 Sep 2022, 18 UTC" pic={{ x: 80, y: 40, w: 1300, h: 760 }} w={1300} name="s11 src" />
    </Scene>
  );
};

// ================================================================ s12 why polar: u, v swing; v_t, v_r steady
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12_why_polar_storm");
  const tUV = SS(k, 1), tSw = SS(k, 2), tPol = SS(k, 3), tSt = SS(k, 4), tTwo = SS(k, 5), tAng = SS(k, 6), tVort = SS(k, 8);
  const B = ianZoom(80, 920);
  const P = mapP(B);
  const A: Ax = { x: 1180, y: 100, w: 500, h: 400, xr: [0, 360], yr: [-60, 60] };
  const r = IAN.ring, az = r.az as number[];
  const run = prog(f, tUV, SE(k, 2));
  const mi = Math.min(71, Math.floor(run * 72));
  const mk = P(r.lat[mi], r.lon[mi]);
  const cE = P(IAN.c[0], IAN.c[1]);
  const ra = ringArrows(P, 18, 6);
  const PA = axP(A);
  return (
    <Scene>
      <IanMap id="s12m" B={B} f={f} z={1}>
        {(Pm) => <>
          <path d={ringPts(Pm)} fill="none" stroke={C.first} strokeWidth={6} />
          <circle cx={cE[0]} cy={cE[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
          <circle cx={mk[0]} cy={mk[1]} r={14} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={fin(f, tUV) * fout(f, tTwo)} />
          <g opacity={fin(f, tAng)}>
            <line x1={ra.p0[0]} y1={ra.p0[1]} x2={ra.tp[0]} y2={ra.tp[1]} stroke={C.first} strokeWidth={5} strokeDasharray="10 8" />
            <AnimatedWindArrow from={ra.p0} to={[ra.p0[0] + (ra.tp[0] - ra.p0[0]) + (ra.rp[0] - ra.p0[0]), ra.p0[1] + (ra.tp[1] - ra.p0[1]) + (ra.rp[1] - ra.p0[1])]} speed={37} f={f} c={C.key} px={8} head={30} />
          </g>
        </>}
      </IanMap>
      <Svg>
        <Axes A={A} xt={[0, 90, 180, 270, 360]} yt={[-40, 0, 40]} xl="angle round the eye (°)" yl="m/s" zero />
        <Curve A={A} xs={az} ys={r.u} c={C.second} upto={run} o={fout(f, tSt + 30, 20) * 0.9 + 0.1} />
        <Curve A={A} xs={az} ys={r.v} c={C.second} dash="14 10" upto={run} o={fout(f, tSt + 30, 20) * 0.9 + 0.1} />
        <Curve A={A} xs={az} ys={r.vt} c={C.first} w={7} upto={prog(f, tPol + 10, tSt)} />
        <Curve A={A} xs={az} ys={r.vr} c={C.neg} w={7} dash="16 8" upto={prog(f, tPol + 10, tSt)} />
        {/* fix loop 1 (Should 3): the two ring means (37 and −12.5 m/s) as thin dashed lines; the inflow curve swings but stays
            below zero on 66 of the 72 ring points (the other six: ≤ +1.05 m/s) */}
        <g opacity={fin(f, tSt + 20) * 0.85}>
          <line x1={A.x} y1={axY(A)(IAN.vt[3])} x2={A.x + A.w} y2={axY(A)(IAN.vt[3])} stroke={C.first} strokeWidth={3} strokeDasharray="6 10" />
          <line x1={A.x} y1={axY(A)(IAN.vr[3])} x2={A.x + A.w} y2={axY(A)(IAN.vr[3])} stroke={C.neg} strokeWidth={3} strokeDasharray="6 10" />
        </g>
        <Lbl x={1210} y={652} t="east, north: swing" c={C.second} s={T.floor} o={win(f, tSw, tTwo - 18)} />
        <Keyword f={f} text="inflow: nearly all negative" at={[1210, 652]} s={T.floor} c={C.neg} appear={tTwo} />
        <Keyword f={f} text="spin" at={[PA(360, IAN.vt[3])[0] + 14, PA(360, IAN.vt[3])[1] - 40]} s={T.floor} c={C.first} appear={tTwo} />
        <Keyword f={f} text="inflow" at={[PA(360, IAN.vr[3])[0] + 14, PA(360, IAN.vr[3])[1] + 40]} s={T.floor} c={C.neg} appear={tTwo + 10} />
        <SideCallout f={f} lines="inflow angle ≈ 19°" at={[1210, 732]} appear={tAng + 20} target={[ra.p0[0] + 20, ra.p0[1] - 20]} s={T.floor} bend={20} />
        <Keyword f={f} text="vorticity" at={[1210, 810]} s={T.floor} appear={AT(k, 8, "vorticity")} />
      </Svg>
      <SourceBelow text="Data: HRRR analysis (NOAA) · 28 Sep 2022, 18 UTC" pic={{ x: 80, y: 40, w: 920, h: 760 }} w={920} name="s12 src" />
    </Scene>
  );
};

// ================================================================ s13 steady spin still accelerates
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = K("s13_centripetal");
  const tPar = SS(k, 1), tQ = SS(k, 3), tVel = SS(k, 5), tChain = SS(k, 6), tRes = SS(k, 7), tNum = SS(k, 8), tG = SS(k, 9), tP = AT(k, 9, "pressure force"), tLes = SS(k, 11);
  const B = ianZoom(80, 880);   // K6: 40 px narrower, so the 64-px chain-rule line (under-words ≥ 44 px) fits from x 1000
  const P = mapP(B);
  const cE = P(IAN.c[0], IAN.c[1]);
  const Rpx = (25 / 111.2 / (B.lat1 - B.lat0)) * B.h;
  const ang = 20 + (f / 30) * 18;
  const pa: Pt = [cE[0] + Rpx * Math.cos(ang * D2R), cE[1] - Rpx * Math.sin(ang * D2R)];
  const tg: Pt = [-Math.sin(ang * D2R), -Math.cos(ang * D2R)], rr: Pt = [Math.cos(ang * D2R), -Math.sin(ang * D2R)];
  const parts: Part[] = [
    { t: String.raw`\frac{d}{dt}\big(v\,\hat{\boldsymbol\theta}\big)=v\,` },
    { t: String.raw`\frac{d\hat{\boldsymbol\theta}}{d\theta}`, u: { w: String.raw`-\hat{\mathbf r}`, c: C.gold } },
    { t: String.raw`\,` },
    { t: String.raw`\frac{d\theta}{dt}`, u: { w: String.raw`v/r`, c: C.gold } },
    { t: String.raw`=-\frac{v^2}{r}\,\hat{\mathbf r}`, c: C.neg },
  ];
  const plain = parts.map((p) => p.t).join("");
  if (plain.replace(/\s/g, "") !== EQ_S13.replace(/\s/g, "")) throw new Error("s13 parts drift from EQ_S13");
  const barX = 1120, barY = 640;
  return (
    <Scene>
      <IanMap id="s13m" B={B} f={f} z={1} o={0.55} />
      <Svg>
        <circle cx={cE[0]} cy={cE[1]} r={Rpx} fill="none" stroke={C.first} strokeWidth={5} />
        <circle cx={cE[0]} cy={cE[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        <circle cx={cE[0]} cy={cE[1]} r={Rpx * 0.55} fill="none" stroke={C.key} strokeWidth={3} strokeDasharray="10 8" opacity={fin(f, tP)} />
        <g opacity={fin(f, tPar)}>
          <circle cx={pa[0]} cy={pa[1]} r={16} fill={C.key} stroke={C.bg} strokeWidth={4} />
          <Arrow p={pa} q={[pa[0] + tg[0] * 170, pa[1] + tg[1] * 170]} color={C.first} o={fin(f, tVel)} />
          <Arrow p={pa} q={[pa[0] - rr[0] * 120, pa[1] - rr[1] * 120]} color={C.neg} o={fin(f, tRes)} />
          <Arrow p={[pa[0] + rr[0] * 40, pa[1] + rr[1] * 40]} q={[pa[0] + rr[0] * 130, pa[1] + rr[1] * 130]} color={C.second} w={6} head={26} o={fin(f, tVel) * 0.8} />
          <Arrow p={[pa[0] - rr[0] * 26, pa[1] - rr[1] * 26]} q={[pa[0] - rr[0] * 26 - rr[0] * 100, pa[1] - rr[1] * 26 - rr[1] * 100]} color={C.second} w={7} head={28} o={fin(f, tP) * 0.9} />
        </g>
        <Keyword f={f} text="air parcel" at={[1100, 120]} s={T.floor} appear={AT(k, 1, "air parcel")} out={tChain - 18} />
        <Keyword f={f} text="accelerating?" at={[1100, 200]} s={T.floor} appear={tQ} out={tChain - 18} />
        <g opacity={fin(f, tG)}>
          <rect x={barX} y={barY - 34} width={480} height={30} fill={BROWN} />
          <rect x={barX} y={barY + 30} width={Math.max(4, (IAN.acc / 9.81) * 480)} height={30} fill={C.neg} />
          <Lbl x={barX + 494} y={barY - 20} t="gravity 9.8" c={C.muted} s={T.floor} />
          <Lbl x={barX + 20} y={barY + 45} t="0.055" c={C.neg} s={T.floor} />
        </g>
        <Lbl x={barX} y={barY + 120} t="almost 200 × smaller" c={C.key} s={T.floor} o={fin(f, AT(k, 9, "two hundred"))} />
        <Keyword f={f} text="turning arrows → acceleration" at={[1080, 820]} s={T.floor} appear={tLes} />
      </Svg>
      <TeX s={String.raw`37\,\hat{\boldsymbol\theta}`} x={pa[0] + tg[0] * 200} y={pa[1] + tg[1] * 200} size={50} ax={0.5} c={C.first} o={fin(f, tVel + 8) * fout(f, tChain - 10)} />
      <Layered parts={parts} x={1000} y={300} size={64} layers={[{ t: "all", o: fin(f, tChain) }, { t: [], u: [1], o: fin(f, AT(k, 6, "minus r hat")) }, { t: [], u: [3], o: fin(f, AT(k, 6, "speed divided by the radius")) }]} />
      <CalcStack f={f} x={1330} y={460} size={56} rows={[{ lhs: String.raw`\frac{37^2}{25\,000}`, rhs: String.raw`\approx0.055\ \mathrm{m/s^2}`, at: tNum, h: 120 }]} />
      <SourceBelow text="Data: HRRR analysis (NOAA) · 28 Sep 2022, 18 UTC" pic={{ x: 80, y: 40, w: 880, h: 760 }} w={880} name="s13 src" />
    </Scene>
  );
};

/** a bead that runs from the tail to the head of a 3-D wind arrow (house wind rule: arrows on a map are always animated);
 * period max(0.6, 12 / speed) s, as the house AnimatedWindArrow "pulse" mode */
const Bead3D: React.FC<{ f: number; a: V3; b: V3; speed: number; o?: number }> = ({ f, a, b, speed, o = 1 }) => {
  const per = Math.max(0.6, 12 / Math.max(0.1, Math.abs(speed))) * 30, t = ((f % per) / per) * 0.8;
  return <HBall3D at={[a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]} px={9} color={C.key} o={o * 0.85} />;
};

// ================================================================ s14 cylindrical coordinates (true aspect, illustrative arrows)
/** `crop` (0-1]: show only the central fraction of the image, at its true size (quad and UVs shrunk together; scale kept) */
const TexQuad: React.FC<{ href: string; x0: number; x1: number; y0: number; y1: number; z?: number; o?: number; crop?: number }> = ({ href, x0, x1, y0, y1, z = 0, o = 1, crop = 1 }) => {
  const tex = useTex(href);
  // fix loop 1 (Must 1): unlit and NOT tone-mapped, so the (sRGB) image keeps its true contrast
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }), []);
  if (mat.map !== tex) { mat.map = tex; mat.needsUpdate = true; }
  mat.opacity = o;
  // fix loop 1 K6 (Must 1, root cause): Remotion's ThreeCanvas draws the GL frame only when the FRAME changes; a texture that
  // arrives after that draw (a fresh tab: still renders, the first frame of every render chunk) never reached the canvas. Draw
  // again when the texture lands (layout effect: before useTex's continueRender releases the frame).
  const advance = useThree((s) => s.advance);
  useLayoutEffect(() => { if (tex && o > 0) advance(performance.now()); }, [tex, o > 0, advance]); // eslint-disable-line react-hooks/exhaustive-deps
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry((x1 - x0) * crop, (y1 - y0) * crop);
    const uv = g.attributes.uv as THREE.BufferAttribute, m = (1 - crop) / 2;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, m + uv.getX(i) * crop, m + uv.getY(i) * crop);
    return g;
  }, [x0, x1, y0, y1, crop]);
  if (!tex || o <= 0) return null;
  return <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, z]} material={mat} renderOrder={1} geometry={geo} />;
};
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14_cylinder");
  const tIn = AT(k, 1, "spirals in"), tUp = AT(k, 1, "rises"), tOutF = AT(k, 1, "flows out"), tZ = AT(k, 2, "height, z"), tCyl = AT(k, 3, "cylindrical coordinates"),
    tThree = SS(k, 4), tZh = SS(k, 5), tOnly = SS(k, 6), tSign = SS(k, 8);
  const keys: OrbitKey[] = [{ f: 0, az: -70, el: 24, dist: 26, target: [0, 0, 0.6] }, { f: LEN(k) + 10, az: -40, el: 26, dist: 26, target: [0, 0, 0.6], linear: true }];
  const st = hOrbitCam({ ...hOrbitPath(keys, f), fov: 30 }, [540, 400]);
  const pr = hProjector(st, 1080, 800, 20, 20);
  // fix loop 1 (Must 1): the GOES crop is centred on the IBTrACS centre, where the eye is in the image; the cylinder's axis
  // goes through the crop's centre (the HRRR pressure-minimum centre lies ≈ 14 km south of the visible eye)
  const E = STK.eye_box, kmLat = 111.2 / 10, kmLon = (111.2 * Math.cos(IAN.c[0] * D2R)) / 10, Ec = [(E[0] + E[1]) / 2, (E[2] + E[3]) / 2];
  const fx0 = (E[2] - Ec[1]) * kmLon, fx1 = (E[3] - Ec[1]) * kmLon, fy0 = (E[0] - Ec[0]) * kmLat, fy1 = (E[1] - Ec[0]) * kmLat;
  const R = 2.5, H = 1.5;
  const circ = (r: number, z: number): V3[] => Array.from({ length: 49 }, (_, i) => [r * Math.cos((i * Math.PI) / 24), r * Math.sin((i * Math.PI) / 24), z]);
  const ph = (f / 30) * 0.6;
  // K6: the turning inflow arrows step aside while the three labelled component arrows are up (they swept under u_r, u_θ)
  const oIn = fin(f, tIn) * (1 - win(f, tThree - 12, tZh - 12)), oUp = fin(f, tUp), oOut = fin(f, tOutF);
  const P3 = (v: V3) => pr.p(v);
  const tipU: V3 = [R, 0, H * 0.6];
  // fix loop 1 (Must 1): the eyewall ring (gold, at the sea) and its link target: the ring point nearest the text column
  const tEw = AT(k, 1, "eyewall");
  const ewTarget = circ(R, 0).map((v) => P3(v)).reduce((a, b) => (b[0] > a[0] ? b : a));
  return (
    <Scene>
      <HView3D st={st} x={20} y={20} w={1080} h={800}>
        {/* fix loop 1 K6: now that the plate draws, the full 133-km crop filled the panel (cut at its left edge) and drowned the
            cream cylinder: the central 62 % only (≈ 82 km across, true scale) at 0.6, so the cylinder and the white arrows read on it */}
        <TexQuad href={IMGS.goesEye} x0={fx0} x1={fx1} y0={fy0} y1={fy1} o={0.6} crop={0.62} />
        {/* fix loop 1 (Must 1): thicker cylinder edges (rims 6 px, sides 3 px) */}
        {circ(R, 0).slice(1).map((q, i) => <HRod3D key={`b${i}`} a={circ(R, 0)[i]} b={q} px={6} color={C.key} o={0.95} />)}
        {circ(R, H).slice(1).map((q, i) => <HRod3D key={`t${i}`} a={circ(R, H)[i]} b={q} px={6} color={C.key} o={0.95} />)}
        {Array.from({ length: 12 }, (_, i) => <HRod3D key={`v${i}`} a={[R * Math.cos((i * Math.PI) / 6), R * Math.sin((i * Math.PI) / 6), 0]} b={[R * Math.cos((i * Math.PI) / 6), R * Math.sin((i * Math.PI) / 6), H]} px={3} color={C.key} o={0.55} />)}
        {circ(R, 0.02).slice(1).map((q, i) => <HRod3D key={`ew${i}`} a={circ(R, 0.02)[i]} b={q} px={9} color={C.gold} o={win(f, tEw, tCyl)} />)}
        {[0, 1, 2, 3, 4, 5].map((i) => { const a = (i * Math.PI) / 3 + ph; const p: V3 = [4.2 * Math.cos(a), 4.2 * Math.sin(a), 0.05];
          const q: V3 = [3.0 * Math.cos(a + 0.5), 3.0 * Math.sin(a + 0.5), 0.05]; return <group key={`in${i}`}><HArrow3D from={p} to={q} color={C.neg} px={8} head={26} o={oIn} /><Bead3D f={f} a={p} b={q} speed={10} o={oIn} /></group>; })}
        {[0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2 + 0.3; const p: V3 = [R * Math.cos(a), R * Math.sin(a), 0.15];
          return <group key={`up${i}`}><HArrow3D from={p} to={[p[0], p[1], 1.25]} color={C.local} px={8} head={26} o={oUp} /><Bead3D f={f} a={p} b={[p[0], p[1], 1.25]} speed={6} o={oUp} /></group>; })}
        {[0, 1, 2, 3, 4, 5].map((i) => { const a = (i * Math.PI) / 3 + 0.2 - ph * 0.5; const p: V3 = [2.8 * Math.cos(a), 2.8 * Math.sin(a), H];
          const q: V3 = [4.4 * Math.cos(a - 0.3), 4.4 * Math.sin(a - 0.3), H]; return <group key={`out${i}`}><HArrow3D from={p} to={q} color={C.second} px={8} head={26} o={oOut} /><Bead3D f={f} a={p} b={q} speed={10} o={oOut} /></group>; })}
        <HArrow3D from={[0, 0, 0]} to={[0, 0, 2.2]} color={C.second} px={8} head={30} o={fin(f, tZ)} />
        <group>{[0, 1, 2].map((i) => { const a = (i * 2 * Math.PI) / 3 + 0.9; const p: V3 = [R * Math.cos(a), R * Math.sin(a), H * 0.6];
          return <group key={`zh${i}`}><HArrow3D from={p} to={[p[0], p[1], p[2] + 0.9]} color={C.second} px={7} head={24} o={fin(f, tZh)} />
            <HArrow3D from={p} to={[p[0] + Math.cos(a) * 1.2, p[1] + Math.sin(a) * 1.2, p[2]]} color={C.second} px={6} head={22} o={fin(f, tOnly)} />
            <HArrow3D from={p} to={[p[0] - Math.sin(a) * 1.2, p[1] + Math.cos(a) * 1.2, p[2]]} color={C.second} px={6} head={22} o={fin(f, tOnly)} /></group>; })}</group>
        <HArrow3D from={tipU} to={[R + 1.1, 0, H * 0.6]} color={C.neg} px={8} head={26} o={fin(f, tThree) * fout(f, tZh - 12)} />
        <HArrow3D from={tipU} to={[R, 1.3, H * 0.6]} color={C.first} px={8} head={26} o={fin(f, tThree) * fout(f, tZh - 12)} />
        <HArrow3D from={tipU} to={[R, 0, H * 0.6 + 0.9]} color={C.local} px={8} head={26} o={fin(f, tThree) * fout(f, tZh - 12)} />
      </HView3D>
      <Svg>
        <Lbl x={P3([0, 0, 2.3])[0] + 18} y={P3([0, 0, 2.3])[1]} t="z" c={C.second} s={T.key} o={fin(f, tZ)} />
        <Lbl x={P3([4.2, -1.5, 0])[0]} y={P3([4.2, -1.5, 0])[1] + 34} t="−" c={C.neg} s={T.calc} a="middle" o={fin(f, tSign)} />
        <Lbl x={P3([4.2, -1.5, H])[0]} y={P3([4.2, -1.5, H])[1] - 34} t="+" c={C.second} s={T.calc} a="middle" o={fin(f, tSign)} />
        <Keyword f={f} text="not flat" at={[1160, 140]} s={T.floor} appear={AT(k, 0, "isn't flat")} out={AT(k, 1, "eyewall") - 18} />
        {/* fix loop 1 (Must 1): "eyewall" linked to the gold eyewall ring (SideCallout: the link leaves from the word's left edge) */}
        <SideCallout f={f} lines="eyewall" at={[1160, 140]} s={T.floor} appear={tEw} out={tCyl - 18} target={ewTarget} c={C.gold} bend={-30} />
        <Keyword f={f} text="cylindrical coordinates" at={[1160, 140]} s={T.key} appear={tCyl} />
        <Lbl x={1160} y={250} t="(r, θ, z)" c={C.key} s={T.calc} o={fin(f, tCyl + 10)} />
        <Lbl x={1160} y={620} t="ẑ: the same everywhere" c={C.second} s={T.floor} o={fin(f, tZh)} />
        <Lbl x={1160} y={780} t="in near the sea, out near the top" c={C.key} s={T.floor} o={fin(f, tSign)} />
      </Svg>
      <TeX s={EQ_S14} x={1160} y={420} size={64} o={fin(f, tThree)} />
      {/* fix loop 1 (Must 2): the component tags in KaTeX (they read "u_r", "u_θ" with literal underscores) */}
      {/* fix loop 1 K6: dark halo on the three tags (they sit on the now-visible GOES plate; "w" was white on white) */}
      <TeX s="u_r" x={P3([R + 1.2, 0, H * 0.6])[0] + 12} y={P3([R + 1.2, 0, H * 0.6])[1]} size={52} c={C.neg} o={fin(f, tThree) * fout(f, tZh - 12)} halo haloW={0.07} />
      <TeX s={String.raw`u_\theta`} x={P3([R, 1.4, H * 0.6])[0] + 12} y={P3([R, 1.4, H * 0.6])[1]} size={52} c={C.first} o={fin(f, tThree) * fout(f, tZh - 12)} halo haloW={0.07} />
      <TeX s="w" x={P3([R, 0, H * 0.6 + 1.0])[0] + 12} y={P3([R, 0, H * 0.6 + 1.0])[1]} size={52} c={C.local} o={fin(f, tThree) * fout(f, tZh - 12)} halo haloW={0.07} />
      {/* fix loop 1 (Should 2): hat-theta in KaTeX (the combining hat sat beside the θ) */}
      <TeX s={String.raw`\hat{\mathbf r},\ \hat{\boldsymbol\theta}\ \text{turn}`} x={1160} y={700} size={52} c={C.second} o={fin(f, tOnly)} />
      <SourceBelow text="Image: GOES-16 (NOAA), contrast enhanced · Ian, 28 Sep 2022, 18:01 UTC" pic={{ x: 80, y: 40, w: 1000, h: 780 }} w={1000} name="s14 src" />
    </Scene>
  );
};

// ================================================================ s14b Ian radial wind on five layers (ERA5), hover from outside, one short close look
const S14B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14b_ian_stack");
  const tFive = AT(k, 1, "five layers"), tCol = SS(k, 3), tLow = SS(k, 4), tRing = SS(k, 5), t15 = SS(k, 6), t6 = SS(k, 7), tTop = SS(k, 8), tOutN = SS(k, 9),
    tLook = SS(k, 10), tPath = SS(k, 11), tDir = SS(k, 12), tRtz = SS(k, 13);
  const tex = STK.levels.map((lv: number) => useTex(IMGS.stack(lv))); // eslint-disable-line react-hooks/rules-of-hooks
  const zs = (STK.z_km as number[]).map((z) => (z * STK.exaggeration) / 100);
  const bx = STK.box_km.map((v: number) => v / 100) as number[];
  const top = zs[4];
  const lit = (i: number) => {
    const sel = f >= tLow && f < tTop + 60 ? (f < t15 ? [0] : f < t6 ? [1] : f < tTop ? [2] : [3, 4]) : null;
    return sel === null ? 0.92 : sel.includes(i) ? 0.95 : 0.4;
  };
  const layers: StackLayer[] = tex.map((t: THREE.Texture | null, i: number) => ({ tex: t, z: zs[i], o: lit(i) }));
  const reveal = zs.map((_, i) => clamp((f - 4 - i * 6) / 12, 0, 1));
  const keys: OrbitKey[] = [
    { f: 0, az: -100, el: 24, dist: 11.5, target: [0, 0, top * 0.35] },
    { f: tLook - 4, az: -76, el: 26, dist: 11.5, target: [0, 0, top * 0.55], linear: true },
    { f: tLook + 48, az: -72, el: 8, dist: 7.6, target: [0, -1.0, top * 0.45] },
    { f: tLook + 48 + 42, az: -70, el: 8, dist: 7.6, target: [0, -1.0, top * 0.5], linear: true },
    { f: tLook + 48 + 42 + 50, az: -84, el: 24, dist: 11.5, target: [0, 0, top * 0.45] },
    { f: LEN(k) + 10, az: -92, el: 24, dist: 11.5, target: [0, 0, top * 0.45], linear: true },
  ];
  const st = hOrbitCam({ ...hOrbitPath(keys, f), fov: 32 }, [560, 360]);
  // K6: the text column steps aside during the one close look (the stack then reaches x ≈ 1380 under it)
  const colO = 1 - win(f, tLook - 4, tLook + 128, 10);
  const pr = hProjector(st, 1920, 1080, 0, 0);
  const ring = (z: number): V3[] => Array.from({ length: 49 }, (_, i) => [2 * Math.cos((i * Math.PI) / 24), 2 * Math.sin((i * Math.PI) / 24), z]);
  const arrows = STK.arrows as { lev: number; vt: number[]; vr: number[] }[];
  const ringO = fin(f, tRing - 20);
  const path: V3[] = [[2.6, -2.4, zs[0]], [0.4, -0.4, zs[0]], [0.3, -0.3, zs[4] * 0.95], [2.6, -2.4, zs[4]]];
  const pathDraw = prog(f, tPath, tPath + 60);
  // fix loop 1 (Must 3): each layer's link target = its 200-km ring's point nearest the text column (largest screen x)
  const ringR = zs.map((z) => ring(z).map((v) => pr.p(v)).reduce((a, b) => (b[0] > a[0] ? b : a)));
  return (
    <Scene>
      <HView3D st={st} x={0} y={0} w={1920} h={1080}>
        <TexQuad href={IMGS.goesStack} x0={bx[0]} x1={bx[1]} y0={bx[2]} y1={bx[3]} z={-0.002} o={0.85} />
        <LayerStack3D layers={f < 3 ? [] : layers} foot={{ x0: bx[0], x1: bx[1], y0: bx[2], y1: bx[3] }} sep={1} reveal={reveal}
          lines={zs.map((z) => ({ pts: ring(z), color: C.first, px: 3, o: 0.85 * ringO }))} />
        <HArrow3D from={[bx[0], bx[2], 0]} to={[bx[0], bx[2], top + 0.35]} color={C.second} px={6} head={26} />
        {arrows.map((A, li) => A.vt.map((vt, j) => {
          const a = (j * Math.PI) / 4, p: V3 = [2 * Math.cos(a), 2 * Math.sin(a), zs[li]], L = (vt / 25) * 0.9;
          const q: V3 = [p[0] - Math.sin(a) * L, p[1] + Math.cos(a) * L, p[2]];
          return <group key={`${li}_${j}`}><HArrow3D from={p} to={q} color={C.first} px={5} head={18} o={0.9 * ringO * reveal[li]} />
            <Bead3D f={f} a={p} b={q} speed={vt} o={0.9 * ringO * reveal[li]} /></group>;
        }))}
        <HArrow3D from={[0.25, 0.1, zs[1] + 0.05]} to={[0.25, 0.1, zs[3] - 0.05]} color={C.local} px={8} head={28} o={fin(f, AT(k, 7, "rises"))} />
        {path.slice(1).map((q, i) => <HArrow3D key={`p${i}`} from={path[i]} to={q} color={C.gold} px={7} head={26} grow={clamp(pathDraw * 3 - i, 0, 1)} o={fin(f, tPath)} />)}
      </HView3D>
      <GlobeFrame id="s14bk" zoom={1} right={1} name="s14b stack" />
      <Svg>
        <Keyword f={f} text="ERA5 reanalysis" at={[1300, 120]} s={T.key} appear={AT(k, 1, "ERA5")} out={tCol - 18} />
        <Keyword f={f} text="radial wind" at={[1300, 120]} s={T.key} appear={tCol} out={tPath - 18} />
        <ColourBar o={colO} x={1300} y={250} w={420} lut={LUT_RAD} lo={-10} hi={10} unit="m/s" title="in (−) · out (+)" ticks={[{ v: -10, t: "−10" }, { v: 0, t: "0" }, { v: 10, t: "10" }]} />
        {/* fix loop 1 (Must 3): every layer named by its HEIGHT when it is spoken, each line linked to its own layer's ring
            (SideCallouts, links from the left edge); the column reads like the stack, top layer on top, so no links cross */}
        <Lbl x={1300} y={400} t="layers 0.3 – 15 km up" c={C.key} s={T.floor} o={win(f, SS(k, 2), tLow - 18) * colO} />
        <g opacity={colO}>
          <SideCallout f={f} lines="12.5 · 15 km: sign flips" at={[1300, 395]} appear={tTop} out={tPath - 18} target={ringR[4]} s={T.floor} c={C.key} bend={20} />
          <SideCallout f={f} lines="6 km: hardly in or out" at={[1300, 520]} appear={t6} out={tPath - 18} target={ringR[2]} s={T.floor} c={C.key} bend={20} />
          <SideCallout f={f} lines="1.5 km: little inflow" at={[1300, 645]} appear={t15} out={tPath - 18} target={ringR[1]} s={T.floor} c={C.key} bend={-20} />
          <SideCallout f={f} lines="300 m: flowing in" at={[1300, 720]} appear={tLow} out={tPath - 18} target={ringR[0]} s={T.floor} c={C.key} bend={-20} />
        </g>
        <Lbl x={1300} y={448} t="≈ +4 m/s, out" c={C.second} s={T.floor} o={win(f, tOutN, tPath - 18) * colO} />
        <Lbl x={1300} y={573} t="rising near the eye" c={C.local} s={T.floor} o={win(f, AT(k, 7, "rises"), tPath - 18) * colO} />
        <Lbl x={1300} y={773} t="≈ −6 m/s on the ring" c={C.neg} s={T.floor} o={win(f, tRing + 10, tPath - 18) * colO} />
        <Lbl x={1300} y={430} t="in → up → out" c={C.gold} s={T.key} o={fin(f, tPath)} />
        <Keyword f={f} text="directions, not speeds" at={[1300, 560]} s={T.floor} appear={tDir} />
        <Keyword f={f} text="r, θ, z" at={[1300, 670]} s={T.key} appear={tRtz} />
      </Svg>
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · Hurricane Ian · 28 Sep 2022, 18 UTC" pic={{ x: 80, y: 40, w: 1000, h: 770 }} w={1000} name="s14b src" />
    </Scene>
  );
};

export const SCENES_A: Record<string, React.FC> = {
  s00_title: S00, s01_hook: S01, s02_coordinates: S02, s03_cartesian_arrows: S03, s04_polar: S04, s05_polar_back: S05, s06_bearings: S06,
  s07_radians: S07, s08_polar_unit_vectors: S08, s09_unit_vectors_turn: S09, s10_polar_components: S10, s11_ian_polar: S11, s12_why_polar_storm: S12,
  s13_centripetal: S13, s14_cylinder: S14, s14b_ian_stack: S14B,
};
void [discOf, Globe, Curve, EQ_S11];
