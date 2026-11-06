// ch00_gradient scenes s00-s08: the title, the hook, scalar fields, the foggy hillside, the sweep through every direction, the
// arrow built from the two slopes, the definition, the del operator, units. Every number on screen is read from data/gr.json
// (CHECK rows at the top); this file only places and times.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Dash, Pt, RightTick, pulse } from "../house/kit/draw";
import { CalcStack, Layered, Part, TeX } from "../house/kit/tex";
import { Keyword } from "../house/kit/notes";
import { CurvedLink } from "../house/kit/extras";
import { RiseText, TitleGradient } from "../house/kit/title";
import { SourceBelow } from "../house/kit/frame";
import { FlowParticles } from "../house/kit/wind";
import { View3D as HView3D, Rod3D as HRod3D, Arrow3D as HArrow3D } from "../house/kit/three3d";
import { BoxEdges3D } from "../house/kit/col3d";
import { orbitCam as hOrbitCam, orbitPath as hOrbitPath, projector as hProjector, V3 } from "../house/kit/cam";
import {
  AT, Arrow, Ax, Axes, AxesEN, BaroIcon, ColourBar, Curve, D, D2R, ForceArrow, GeoImg, GeoMap, HillGround, HillIcon, HO, HU, IMG, K, LEN, LUT_H, LUT_SP,
  LUT_TH, Lbl, MapBox, PlaneContours, Place, SS, SE, Scene, SideCallout, SoftEdges, Svg, ThermoIcon, Walker, arcD, axP, boxAt, clamp, edges, fin, fitX, fout,
  hp, linesPath, mix, nf, poly, prog, win,
} from "./gr_lib";
import { FnTerrain, MontBlanc3D, mbH, mbW } from "./gr_3d";
import { EQ_S06, EQ_S07 } from "./gr_eq";

const HL = D.hill, TT = D.title, MSL = D.msl, MBD = D.mb;
// ---------------------------------------------------------------- numbers on screen = the data (the render fails otherwise)
const CHECK_A: [string, number, number, number][] = [
  ["dh/dx", HL.grad[0], 30, 1e-9], ["dh/dy", HL.grad[1], 40, 1e-9], ["NE", HL.ne, 49.5, 0.01], ["peak", HL.peak[0], 50, 1e-3], ["peak deg", HL.peak[1], 53, 0.2],
  ["norm", HL.norm, 50, 1e-9], ["angle", HL.angle, 53.13, 0.005], ["Brest p", MSL.brest.p, 968.0, 0.05], ["centre", MSL.centre[2], 953.6, 0.1],
];
CHECK_A.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

/** a Ciarán msl mini-map (s00 part B, s01, s02 insert): isobars every 4 hPa, the tracked low, ∇p / PGF arrows, streaklines */
const CiaranMini: React.FC<{ id: string; B: MapBox; o?: number; f: number; flip?: number; streak?: number; streakW?: number; arrows?: number; isoO?: number }> = ({
  id, B, o = 1, f, flip = 0, streak = 0, streakW = 2, arrows = 1, isoO = 0.85 }) => (
  <GeoMap id={id} B={B} o={o} frame={0.6}>
    {(P) => <>
      <path d={linesPath(P, D.lines.europe_coast)} fill="none" stroke={C.key} strokeOpacity={0.75} strokeWidth={2} />
      {MSL.isobars.map((L: { level: number; lines: number[][] }) => <path key={L.level} d={linesPath(P, L.lines)} fill="none" stroke={C.ink} strokeOpacity={isoO} strokeWidth={2.5} />)}
      <FlowParticles P={(la, lo) => P(la, lo)} tracks={MSL.tracks} fr={f / 2} tail={8} w={streakW} c={C.first} o={streak} />
      {MSL.parrows.map((a: number[], i: number) => {
        const p0 = P(a[0], a[1]), s = 5.2, d: Pt = [a[2] * s, -a[3] * s];
        return <g key={i} opacity={arrows}>
          {flip < 1 ? <Arrow p={p0} q={[p0[0] + d[0], p0[1] + d[1]]} color={C.second} w={7} head={26} o={1 - flip} /> : null}
          {flip > 0 ? <ForceArrow p={p0} q={[p0[0] - d[0], p0[1] - d[1]]} o={flip} w={7} head={28} /> : null}
        </g>;
      })}
      <Place p={P(MSL.centre[0], MSL.centre[1])} t="L" r={0} dx={0} dy={0} a="middle" s={54} tc={C.key} />
    </>}
  </GeoMap>
);

// ================================================================ s00 title
const RB = { x: 1130, y: 160, w: 710, h: 480 };
const titleH = (x: number, y: number) => TT.H * Math.exp(-(x * x + y * y) / (2 * TT.sigma * TT.sigma));
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  const tMet = AT(k, 0, "meteorology"), tEasy = AT(k, 0, "the gradient"), tPush = AT(k, 0, "which way the air is pushed"), tCrowd = AT(k, 0, "isobars crowd together");
  const oA = fin(f, 6, 10) * fout(f, tMet, 12), oB = fin(f, tMet, 12);
  const st = hOrbitCam({ ...hOrbitPath([{ f: 0, az: 228, el: 36, dist: 15, target: [0, 0, 0.35] }, { f: LEN(k), az: 246, el: 38, dist: 15, target: [0, 0, 0.35] }], f), fov: 30 }, [RB.w / 2, RB.h / 2 + 30]);
  const pr = hProjector(st, RB.w, RB.h, RB.x, RB.y);
  const ZX = 4;
  const gp: V3 = [TT.pt[0], TT.pt[1], (titleH(TT.pt[0], TT.pt[1]) * ZX) / 1000];
  const swing = prog(f, 40, tMet - 60), angD = mix(0, HL.angle, swing), len = mix(0.6, 2.2, swing);
  const tip: V3 = [gp[0] + len * Math.cos(angD * D2R), gp[1] + len * Math.sin(angD * D2R), gp[2]];
  const rings = TT.rings.map((hh: number) => { const r = Math.sqrt(-2 * TT.sigma * TT.sigma * Math.log(hh / TT.H)), pts: Pt[] = [];
    for (let a = 0; a <= 360; a += 6) pts.push(pr.p([r * Math.cos(a * D2R), r * Math.sin(a * D2R), (hh * ZX) / 1000])); return poly(pts); });
  const MBx = boxAt(48.8, -5.5, 9.0, RB.x, RB.y, RB.w, RB.h);
  const pz = 1 + 0.06 * pulse(f, tEasy, 14);
  return (
    <Scene fadeIn={false}>
      <Svg>
        <defs><TitleGradient id="ttl" x1={100} x2={1000} /></defs>
        <RiseText f={f} t="The" x={100} y={210} s={150} at={2} fill="url(#ttl)" />
        <RiseText f={f} t="gradient" x={100} y={360} s={150} at={10} fill="url(#ttl)" />
        <g transform={`translate(104 490) scale(${pz}) translate(-104 -490)`}>
          <RiseText f={f} t="made easy" x={104} y={500} s={96} at={24} fill={C.key} />
        </g>
        <RiseText f={f} t="and how meteorology uses it" x={106} y={630} s={68} at={38} fill={C.key} colors={(i) => (i >= 8 && i < 19 ? C.first : undefined)} />
      </Svg>
      <HView3D st={st} x={RB.x} y={RB.y} w={RB.w} h={RB.h} o={oA}>
        <FnTerrain h={titleH} R={4} n={81} zex={ZX} lo={0} hi={TT.H} />
      </HView3D>
      <Svg o={oA}>
        {rings.map((d: string, i: number) => <path key={i} d={d} fill="none" stroke={C.key} strokeOpacity={0.55} strokeWidth={2} />)}
        <Arrow p={pr.p(gp)} q={pr.p(tip)} color={C.second} w={9} head={32} o={fin(f, 30)} />
        <circle cx={pr.p(gp)[0]} cy={pr.p(gp)[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={4} />
      </Svg>
      <SoftEdges id="s00h" box={RB} o={oA} />
      <CiaranMini id="s00m" B={MBx} o={oB} f={f} flip={prog(f, tPush, tPush + 24)} streak={fin(f, tCrowd - 30, 20)} streakW={mix(2, 3.5, fin(f, tCrowd, 20))} />
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 2 Nov 2023, 03 UTC" pic={RB} w={710} o={oB} name="s00 src era5" />
    </Scene>
  );
};

// ================================================================ s01 hook
const DRB = { x: 60, y: 40, w: 880, h: 600 }, MRB = { x: 1000, y: 40, w: 840, h: 600 };
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  const tGr = AT(k, 0, "gradient"), tWhy = AT(k, 1, "why it's built this way"), tThm = AT(k, 2, "mountains, storms and the wind");
  const st = hOrbitCam({ ...hOrbitPath([{ f: 0, az: 250, el: 34, dist: 46, target: [0, -1, 1.6] }, { f: LEN(k), az: 258, el: 35, dist: 46, target: [0, -1, 1.6] }], f), fov: 32 }, [DRB.w / 2, DRB.h / 2]);
  const pr = hProjector(st, DRB.w, DRB.h, DRB.x, DRB.y);
  const pz = 1 + 0.35 * pulse(f, tWhy, 18);
  const MB2 = boxAt(48.8, -5.5, 8.6, MRB.x, MRB.y, MRB.w, MRB.h);
  const arr = (MBD.arrows as number[][]).filter((_, i) => i % 3 === 0);
  return (
    <Scene>
      <HView3D st={st} x={DRB.x} y={DRB.y} w={DRB.w} h={DRB.h}>
        <MontBlanc3D />
      </HView3D>
      <Svg>
        {arr.map((a, i) => {
          const g = Math.hypot(a[3], a[4]); if (g < 0.15) return null;
          const p0 = mbW(a[0], a[1], mbH(a[0], a[1])), L = 1.6 * Math.min(1, g / 0.5) * pz;
          const p1: V3 = [p0[0] + (L * a[3]) / g, p0[1] + (L * a[4]) / g, p0[2]];
          return <Arrow key={i} p={pr.p(p0)} q={pr.p(p1)} color={C.second} w={6} head={20} o={fin(f, 8 + i)} />;
        })}
      </Svg>
      <SoftEdges id="s01d" box={DRB} />
      <CiaranMini id="s01m" B={MB2} f={f} flip={0} streak={0} arrows={pz > 1.01 ? 1 : 0.9} />
      <Svg>
        <Keyword f={f} text="gradient" at={[960, 735]} a="middle" appear={tGr} />
        <g opacity={fin(f, tThm)}>
          <path d="M 300 815 L 360 765 L 395 790 L 440 745 L 500 815 Z" fill="#5d6677" stroke={C.key} strokeWidth={3} />
        </g>
        <g opacity={fin(f, tThm + 8)}>
          {[18, 34, 50].map((r) => <circle key={r} cx={1300} cy={785} r={r} fill="none" stroke={C.ink} strokeWidth={3} strokeOpacity={0.8} />)}
        </g>
        <g opacity={fin(f, tThm + 16)}>
          {[0, 1, 2].map((i) => <path key={i} d={`M ${1520 + i * 8} ${760 + i * 22} q 60 -18 120 0`} fill="none" stroke={C.first} strokeWidth={5} strokeLinecap="round" />)}
        </g>
      </Svg>
      <SourceBelow text="Terrain: ETOPO 2022 (NOAA) · imagery: Copernicus Sentinel-2 · 26 Sep 2023" pic={DRB} w={880} name="s01 src mb" />
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 2 Nov 2023, 03 UTC" pic={MRB} w={840} name="s01 src era5" />
    </Scene>
  );
};

// ================================================================ s02 scalar fields (Mont Blanc heights), temperature and pressure
const S02: React.FC = () => {
  const f = useCurrentFrame(), k = K("s02_fields");
  const tMtn = AT(k, 0, "mountain"), tH = AT(k, 1, "height above sea level"), tField = AT(k, 2, "field"), tScal = AT(k, 3, "scalar field"), tOne = AT(k, 3, "one number");
  const tTP = AT(k, 4, "Temperature"), tPres = AT(k, 4, "pressure"), tQ = SS(k, 5), tWay = AT(k, 6, "which way"), tFast = AT(k, 6, "how fast");
  const B = boxAt(45.86, 6.865, 0.32, 80, 40, 640, 780);   // K6 r1: picture ends at y 820 so its source line ends above y 880
  const P = (la: number, lo: number): Pt => [B.x + ((lo - B.lon0) / (B.lon1 - B.lon0)) * B.w, B.y + ((B.lat1 - la) / (B.lat1 - B.lat0)) * B.h];
  const pr = MBD.probes as [number, number, number, string][];
  const hop = [tH, tH + 70, tH + 140];
  const idx = f < hop[1] ? 0 : f < hop[2] ? 1 : 2;
  const a0 = pr[Math.max(0, idx - 1)], a1 = pr[idx], tt = prog(f, hop[idx], hop[idx] + 24);
  const dot: Pt = idx === 0 ? P(a1[0], a1[1]) : (() => { const p = P(a0[0], a0[1]), q = P(a1[0], a1[1]); return [mix(p[0], q[0], tt), mix(p[1], q[1], tt)] as Pt; })();
  // K6 r1: the two-line source under the temperature inset ends at y ≈ 470, so "pressure" sits at 500 and its inset at 530
  const IB1 = boxAt(48.5, -6.5, 10, 1440, 140, 380, 240), IB2 = boxAt(48.8, -5.5, 10, 1440, 530, 380, 240);
  return (
    <Scene>
      <GeoMap id="s02mb" B={B} frame={0.6}>
        {(Pm) => <>
          <GeoImg P={Pm} href={IMG("mb_height.png")} box={MBD.box} />
          <path d={linesPath(Pm, D.lines.mb_border)} fill="none" stroke={C.key} strokeOpacity={0.6} strokeWidth={2.5} strokeDasharray="10 8" />
        </>}
      </GeoMap>
      <Svg>
        <circle cx={dot[0]} cy={dot[1]} r={13} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={fin(f, tMtn)} />
        <ColourBar x={790} y={110} w={330} lut={LUT_H} lo={500} hi={4800} unit="m" title="height" ticks={[{ v: 1000, t: "1000" }, { v: 2500, t: "2500" }, { v: 4000, t: "4000" }]} o={fin(f, 6)} />
        {pr.map((q, i) => <SideCallout key={i} f={f} lines={`h = ${q[2]} m`} at={[830, 260]} appear={hop[i] + 20} out={i < 2 ? hop[i + 1] - 4 : tScal - 14} target={i === idx ? [dot[0] + 16, dot[1]] : null} s={T.calc} bend={20} />)}
        <Keyword f={f} text="field" at={[830, 360]} appear={tField} />
        <Keyword f={f} text="scalar field" at={[830, 440]} appear={tScal} c={C.key} />
        <Lbl x={830} y={510} t="one number per place" c={C.key} s={T.key} o={fin(f, tOne)} />
        <Lbl x={1430} y={110} t="temperature" c={C.key} s={T.floor} a="start" o={fin(f, tTP)} />
        <Lbl x={1430} y={502} t="pressure" c={C.key} s={T.floor} a="start" o={fin(f, tPres)} />
        <Keyword f={f} text="which way?" at={[830, 640]} appear={tWay} targets={[[dot[0] + 20, dot[1] - 10]]} />
        <Keyword f={f} text="how fast?" at={[830, 740]} appear={tFast} />
      </Svg>
      <GeoMap id="s02t" B={IB1} o={fin(f, tTP)} frame={0.6}>
        {(Pm) => <>
          <GeoImg P={Pm} href={IMG("t850.png")} box={edges(D.t850.img_box)} />
          <path d={linesPath(Pm, D.lines.europe_coast)} fill="none" stroke={C.key} strokeOpacity={0.7} strokeWidth={1.6} />
        </>}
      </GeoMap>
      <GeoMap id="s02p" B={IB2} o={fin(f, tPres)} frame={0.6}>
        {(Pm) => <>
          <path d={linesPath(Pm, D.lines.europe_coast)} fill="none" stroke={C.key} strokeOpacity={0.7} strokeWidth={1.6} />
          {MSL.isobars.map((L: { level: number; lines: number[][] }) => <path key={L.level} d={linesPath(Pm, L.lines)} fill="none" stroke={C.ink} strokeOpacity={0.85} strokeWidth={2} />)}
        </>}
      </GeoMap>
      <SourceBelow text="Data: ETOPO 2022 (NOAA) · Mont Blanc" pic={{ x: B.x, y: B.y, w: B.w, h: B.h }} w={640} name="s02 src etopo" />
      <SourceBelow text="Data: ERA5 · 1 Nov 2023, 18 UTC" pic={{ x: IB1.x, y: IB1.y, w: IB1.w, h: IB1.h }} w={380} o={fin(f, tTP)} name="s02 src t" />
      <SourceBelow text="Data: ERA5 · 2 Nov 2023, 03 UTC" pic={{ x: IB2.x, y: IB2.y, w: IB2.w, h: IB2.h }} w={380} o={fin(f, tPres)} name="s02 src p" />
    </Scene>
  );
};

// ================================================================ s03 the foggy hillside (3-D, slope ×10)
const HV = { x: 40, y: 30, w: 1000, h: 820 };
const planeH = (x: number, y: number) => 250 + 30 * x + 40 * y;    // m (offset +250 so the ground stays above 0)
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_fog");
  const tE = SS(k, 2), tN = SS(k, 3), tPart = AT(k, 4, "partial derivatives"), tPx = SS(k, 5), tPy = SS(k, 6), tNum = AT(k, 7, "thirty metres"), tNum2 = AT(k, 7, "forty metres");
  const ZX = 10;
  const st = hOrbitCam({ ...hOrbitPath([{ f: 0, az: 236, el: 30, dist: 9.5, target: [0.3, 0.4, 2.6] }, { f: LEN(k), az: 244, el: 32, dist: 9.5, target: [0.3, 0.4, 2.6] }], f), fov: 34 }, [HV.w / 2, HV.h / 2]);
  const pr = hProjector(st, HV.w, HV.h, HV.x, HV.y);
  const z = (x: number, y: number) => (planeH(x, y) * ZX) / 1000;
  const gE = prog(f, tE + 10, tE + 60), gN = prog(f, tN + 10, tN + 60);
  const o0: V3 = [0, 0, z(0, 0)];
  const e1: V3 = [gE, 0, z(gE, 0)], n1: V3 = [0, gN, z(0, gN)];
  const riseE: [V3, V3] = [[1, 0, z(0, 0)], [1, 0, z(1, 0)]], riseN: [V3, V3] = [[0, 1, z(0, 0)], [0, 1, z(0, 1)]];
  const walker = pr.p(o0);
  return (
    <Scene>
      <HView3D st={st} x={HV.x} y={HV.y} w={HV.w} h={HV.h}>
        <FnTerrain h={planeH} R={2} n={41} zex={ZX} lo={0} hi={500} />
        {gE > 0.01 ? <HRod3D a={[0, 0, z(0, 0) + 0.02]} b={[gE, 0, z(gE, 0) + 0.02]} px={7} color={C.first} /> : null}
        {gN > 0.01 ? <HRod3D a={[0, 0, z(0, 0) + 0.02]} b={[0, gN, z(0, gN) + 0.02]} px={7} color={C.first} /> : null}
        {fin(f, tE + 50) > 0 ? <HRod3D a={[1, 0, z(0, 0)]} b={[1, 0, z(0, 0) + (z(1, 0) - z(0, 0)) * fin(f, tE + 50, 20)]} px={9} color={C.gold} /> : null}
        {fin(f, tN + 50) > 0 ? <HRod3D a={[0, 1, z(0, 0)]} b={[0, 1, z(0, 0) + (z(0, 1) - z(0, 0)) * fin(f, tN + 50, 20)]} px={9} color={C.gold} /> : null}
        {fin(f, tE + 50) > 0 ? <HRod3D a={[0, 0, z(0, 0)]} b={[1, 0, z(0, 0)]} px={3} color={C.muted} o={0.8} /> : null}
        {fin(f, tN + 50) > 0 ? <HRod3D a={[0, 0, z(0, 0)]} b={[0, 1, z(0, 0)]} px={3} color={C.muted} o={0.8} /> : null}
      </HView3D>
      <SoftEdges id="s03" box={HV} px={70} />
      <Svg>
        <Walker x={walker[0]} y={walker[1]} s={0.8} c={C.first} />
        {/* K6 r1 + reviewer (3-D labels on s03): "30 m" above its rod (the link from ∂h/∂x arrives at the rod's side under it) */}
        <Lbl x={pr.p(riseE[1])[0]} y={pr.p(riseE[1])[1] - 40} t="30 m" c={C.gold} s={T.key} a="middle" o={fin(f, tE + 70)} />
        <Lbl x={pr.p(riseN[1])[0] - 22} y={mix(pr.p(riseN[0])[1], pr.p(riseN[1])[1], 0.5)} t="40 m" c={C.gold} s={T.key} a="end" o={fin(f, tN + 70)} />
        <Lbl x={pr.p([1.05, 0, z(0, 0)])[0]} y={pr.p([1.05, 0, z(0, 0)])[1] + 34} t="1 km east" c={C.muted} s={T.floor} a="middle" b={false} o={fin(f, tE + 30)} />
        <Lbl x={pr.p([0, 1.1, z(0, 0)])[0] - 20} y={pr.p([0, 1.1, z(0, 0)])[1] + 30} t="1 km north" c={C.muted} s={T.floor} a="end" b={false} o={fin(f, tN + 30)} />
        <Keyword f={f} text="partial derivatives" at={[1100, 120]} appear={tPart} />
      </Svg>
      <Layered parts={[{ t: String.raw`\frac{\partial h}{\partial x}`, c: C.second }, { t: String.raw`=30\ \mathrm{m/km}` }]} x={1100} y={290} size={T.eq}
        layers={[{ t: [0], o: fin(f, tPx) }, { t: [1], o: fin(f, tNum) }]} />
      <Layered parts={[{ t: String.raw`\frac{\partial h}{\partial y}`, c: C.second }, { t: String.raw`=40\ \mathrm{m/km}` }]} x={1100} y={630} size={T.eq}
        layers={[{ t: [0], o: fin(f, tPy) }, { t: [1], o: fin(f, tNum2) }]} />
      <Svg>
        <Lbl x={1100} y={420} t="going east," c={C.key} s={T.key} o={fin(f, tPx + 10)} />
        <Lbl x={1100} y={484} t="north held fixed" c={C.key} s={T.key} o={fin(f, AT(k, 5, "north held fixed"))} />
        <Lbl x={1100} y={760} t="going north" c={C.key} s={T.key} o={fin(f, tPy + 10)} />
      </Svg>
      <Svg>
        <CurvedLink f={f} from={[1088, 290]} to={[pr.p(riseE[1])[0] + 14, mix(pr.p(riseE[0])[1], pr.p(riseE[1])[1], 0.5)]} start={tNum + 8} end={LEN(k) - 14} bend={-30} />
        {/* the ∂h/∂y link runs under "1 km east" and the walker's feet, then up to the north rod (it used to cut through "1 km east") */}
        <CurvedLink f={f} from={[1088, 630]} to={[pr.p(riseN[1])[0] + 10, mix(pr.p(riseN[0])[1], pr.p(riseN[1])[1], 0.5) + 10]} start={tNum2 + 8} end={LEN(k) - 14} ctl={[460, 700]} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s04 the sweep: every direction
const SWA: Ax = { x: 1150, y: 480, w: 620, h: 290, xr: [0, 360], yr: [-50, 50] };
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = K("s04_sweep");
  const tQ = SS(k, 0), tE = AT(k, 2, "Going east"), tNo = AT(k, 2, "north, forty"), tTD = SS(k, 4), tNE = SS(k, 5), tSum = SS(k, 6), tRes = AT(k, 6, "forty nine and a half");
  const tTurn = SS(k, 8), tCurve = SS(k, 9), tPeak = SS(k, 10), tPk2 = AT(k, 10, "fifty three degrees");
  const sw = prog(f, tTurn + 20, tPeak - 10), deg = sw * 360;
  const needleA = f < tTurn + 20 ? (f < tNE ? (f < tNo ? 0 : 90) : 45) : deg;
  const nd: Pt = hp(1.6 * Math.cos(needleA * D2R), 1.6 * Math.sin(needleA * D2R));
  const climb = 30 * Math.cos(needleA * D2R) + 40 * Math.sin(needleA * D2R);
  const legs = fin(f, tNE + 10);
  const n = Math.round(sw * (HL.sweep_deg.length - 1));
  const pk = axP(SWA)(HL.peak[1], HL.peak[0]);
  return (
    <Scene>
      <Svg>
        <HillGround />
        <PlaneContours o={0.9} />
        <AxesEN />
        <Arrow p={HO} q={nd} color={C.first} w={10} head={40} o={fin(f, tQ)} />
        <g opacity={legs * fout(f, tTurn + 10)}>
          <Dash p={HO} q={hp(1.6 * 0.7071, 0)} c={C.first} w={6} />
          <Dash p={hp(1.6 * 0.7071, 0)} q={hp(1.6 * 0.7071, 1.6 * 0.7071)} c={C.first} w={6} />
          <Lbl x={hp(0.56, 0)[0]} y={HO[1] + 40} t="0.71 km" c={C.first} s={T.floor} a="middle" />
          <Lbl x={hp(1.13, 0.56)[0] + 18} y={hp(1.13, 0.56)[1]} t="0.71 km" c={C.first} s={T.floor} />
        </g>
        <Walker x={HO[0] - 34} y={HO[1] + 4} s={0.7} />
      </Svg>
      {/* K6 r1: the δh row ended at x 1947 — "=" column at 1220, size 56 */}
      <CalcStack f={f} x={1220} y={110} size={56} rows={[
        { lhs: String.raw`\text{east}`, rhs: String.raw`=30\ \mathrm{m/km}`, at: tE },
        { lhs: String.raw`\text{north}`, rhs: String.raw`=40\ \mathrm{m/km}`, at: tNo },
        { lhs: String.raw`\delta h`, rhs: String.raw`=30\times0.71+40\times0.71`, at: tSum },
        { rhs: String.raw`\approx 49.5\ \mathrm{m}`, at: tRes, cont: true },
      ]} maxLines={3} o={fout(f, tTurn - 4)} />
      <Svg>
        <g opacity={fin(f, tTurn + 12)}>
          <Axes A={SWA} xt={[0, 90, 180, 270, 360]} yt={[-50, 0, 50]} yl="climb (m/km)" xl="direction (°)" zero />
          <Curve A={SWA} xs={HL.sweep_deg} ys={HL.sweep} c={C.first} w={6} upto={n / (HL.sweep_deg.length - 1)} />
        </g>
        <circle cx={pk[0]} cy={pk[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={fin(f, tPeak)} />
        <Lbl x={pk[0] + 24} y={pk[1] - 86} t="50 m/km at 53°" c={C.key} s={T.key} o={fin(f, tPk2)} />
        <Lbl x={1150} y={200} t={`climb ${nf(climb, 0)} m/km`} c={C.first} s={T.key} o={fin(f, tTurn + 20) * fout(f, tPeak - 6)} />
        <Lbl x={1150} y={474} t="better than east and north" c={C.key} s={T.floor} o={win(f, SS(k, 7), tTurn - 6)} />
        <Keyword f={f} text="which way is steepest?" at={[1150, 70]} appear={tQ} out={tE - 12} />
      </Svg>
      {/* K6 r1: no link from the climb readout to the needle (in every direction below the east axis it crossed the axis and its
          label); the readout is in the needle's teal, and the curve under it is the same sweep */}
    </Scene>
  );
};

// ================================================================ s05 the arrow built from the two slopes
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = K("s05_reveal");
  const tTwo = SS(k, 0), tPy = SS(k, 1), tDir = SS(k, 2), tBuild = SS(k, 3), tSteep = SS(k, 4), tName = AT(k, 5, "gradient");
  const s = 1 / 25;                                    // km of drawing per m/km
  const g = prog(f, tBuild + 10, tBuild + 70);
  const tip = hp(30 * s, 40 * s * g);
  const legE = hp(30 * s * prog(f, tBuild, tBuild + 30), 0);
  const pk = axP(SWA)(HL.peak[1], HL.peak[0]);
  return (
    <Scene>
      <Svg>
        <HillGround />
        <PlaneContours o={0.9} />
        <AxesEN />
        <Dash p={HO} q={legE} c={C.second} w={6} />
        {g > 0 ? <Dash p={hp(30 * s, 0)} q={tip} c={C.second} w={6} /> : null}
        <Lbl x={hp(15 * s, 0)[0]} y={HO[1] + 40} t="30 east" c={C.second} s={T.floor} a="middle" o={fin(f, tBuild + 10)} />
        <Lbl x={hp(30 * s, 20 * s)[0] + 20} y={hp(30 * s, 20 * s)[1]} t="40 north" c={C.second} s={T.floor} o={fin(f, tBuild + 40)} />
        {g > 0.98 ? <RightTick at={hp(30 * s, 0)} u1={[-1, 0]} u2={[0, -1]} s={22} c={C.muted} /> : null}
        <Arrow p={HO} q={hp(30 * s, 40 * s)} color={C.second} o={fin(f, tBuild + 66)} />
        <path d={arcD(HO, 90, 0, HL.angle)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tDir)} />
        {/* K6 r1: inside the triangle, clear of the arc (r 90) and of the dashed north leg at x 700 */}
        <Lbl x={HO[0] + 134} y={HO[1] - 67} t="53°" c={C.gold} s={T.key} a="middle" o={fin(f, tDir + 6)} />
        <Lbl x={hp(30 * s, 40 * s)[0] + 30} y={hp(30 * s, 40 * s)[1] - 20} t="∇h" c={C.second} s={T.calc} o={fin(f, tName)} />
        <Walker x={HO[0] - 34} y={HO[1] + 4} s={0.7} />
        <g opacity={0.55 * fout(f, tBuild)}>
          <Axes A={SWA} xt={[0, 90, 180, 270, 360]} yt={[-50, 0, 50]} yl="climb (m/km)" xl="direction (°)" zero />
          <Curve A={SWA} xs={HL.sweep_deg} ys={HL.sweep} c={C.first} w={5} />
          <circle cx={pk[0]} cy={pk[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={4} />
        </g>
        <CurvedLink f={f} from={[pk[0] - 10, pk[1] - 14]} to={[HO[0] + 120, HO[1] - 60]} start={tDir + 10} end={tBuild - 4} bend={70} />
        <Lbl x={1150} y={300} t="steepest way up" c={C.key} s={T.key} o={fin(f, tSteep)} />
        <Lbl x={1150} y={380} t="length = steepest slope" c={C.key} s={T.key} o={fin(f, AT(k, 4, "its length"))} />
        <Keyword f={f} text="gradient" at={[1150, 500]} appear={tName} targets={[[hp(30 * s, 40 * s)[0] + 10, hp(30 * s, 40 * s)[1] + 10]]} />
      </Svg>
      <TeX s={String.raw`\sqrt{30^2+40^2}=\sqrt{2500}=50`} x={1120} y={160} size={58} o={fin(f, tPy) * fout(f, tBuild - 20)} />
      <TeX s={String.raw`\sqrt{30^2+40^2}=50`} x={1120} y={160} size={58} o={fin(f, tBuild)} />
    </Scene>
  );
};

// ================================================================ s06 the definition
const P06: Part[] = [
  { t: String.raw`\nabla h`, c: C.second }, { t: "=" },
  { t: String.raw`\hat{\mathbf x}\,\frac{\partial h}{\partial x}`, u: { w: String.raw`\text{going east}`, c: C.gold } }, { t: "+" },
  { t: String.raw`\hat{\mathbf y}\,\frac{\partial h}{\partial y}`, u: { w: String.raw`\text{going north}`, c: C.gold } },
];
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = K("s06_definition");
  const tW = SS(k, 0), tNab = AT(k, 1, "nabla"), tGrad = AT(k, 1, "grad h"), tEq = SS(k, 2), tU = SS(k, 3), tNum = SS(k, 4), tLen = SS(k, 5), tVec = SS(k, 6);
  if (P06.map((p) => p.t).join("").replace(/\s/g, "") !== EQ_S06.replace(/\s/g, "")) throw new Error("s06 parts drift from EQ_S06");
  const s = 1 / 25;
  return (
    <Scene>
      <Svg>
        <HillGround />
        <PlaneContours o={0.9} />
        <AxesEN />
        <Arrow p={HO} q={hp(30 * s, 40 * s)} color={C.second} />
        <Lbl x={hp(30 * s, 40 * s)[0] + 30} y={hp(30 * s, 40 * s)[1] - 20} t="∇h" c={C.second} s={T.calc} />
        <Walker x={HO[0] - 34} y={HO[1] + 4} s={0.7} />
        <g opacity={fin(f, tU)}>
          <Arrow p={HO} q={hp(1.0, 0)} color={C.second} w={6} head={26} o={0.75} />
          <Arrow p={HO} q={hp(0, 1.0)} color={C.second} w={6} head={26} o={0.75} />
          <Lbl x={hp(1.0, 0)[0]} y={HO[1] + 40} t="x̂" c={C.second} s={T.key} a="middle" />
          <Lbl x={HO[0] - 26} y={hp(0, 1.0)[1]} t="ŷ" c={C.second} s={T.key} a="end" />
        </g>
      </Svg>
      <Layered parts={P06} x={1060} y={210} size={70} o={fin(f, tW)} layers={[
        { t: "all", o: 1, u: f >= tEq + 30 ? [2, 4] : [] },
      ]} />
      <Svg>
        <Keyword f={f} text="nabla, del" at={[1090, 420]} appear={tNab} targets={[[1088, 232]]} />
        <Lbl x={1440} y={420} t="“grad h”" c={C.key} s={T.key} o={fin(f, tGrad)} />
        <Lbl x={1090} y={760} t="scalar → vector at every place" c={C.key} s={T.floor} o={fin(f, tVec)} />
      </Svg>
      <TeX s={String.raw`\nabla h=30\,\hat{\mathbf x}+40\,\hat{\mathbf y}\ \ (\mathrm{m/km})`} x={1060} y={540} size={56} o={fin(f, tNum)} />
      <TeX s={String.raw`|\nabla h|=\sqrt{30^2+40^2}=50\ \mathrm{m/km}`} x={1060} y={650} size={56} o={fin(f, tLen)} />
    </Scene>
  );
};

// ================================================================ s07 the del operator
const hill07 = (x: number, y: number) => 300 * Math.exp(-((x + 0.4) ** 2 + (y + 0.2) ** 2) / 6);   // module level: a stable function keeps FnTerrain's texture memo
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_operator");
  const tDel = AT(k, 0, "del operator"), tArrow = SS(k, 1), tUp = SS(k, 2), tIdx = SS(k, 3), tOps = SS(k, 4);
  const [eA, eB] = EQ_S07.split(String.raw`,\qquad `);
  const st = hOrbitCam({ ...hOrbitPath([{ f: 0, az: 228, el: 22, dist: 11, target: [0, 0, 1.8] }, { f: LEN(k), az: 250, el: 24, dist: 11, target: [0, 0, 1.8] }], f), fov: 32 }, [470, 430]);
  const pr = hProjector(st, 940, 820, 40, 30);
  const iC = Math.floor(clamp((f - tIdx - 30) / 40, 0, 2.99));
  return (
    <Scene>
      <HView3D st={st} x={40} y={30} w={940} h={820}>
        <FnTerrain h={hill07} R={3} n={61} zex={2} lo={0} hi={300} />
        <BoxEdges3D a={[-0.4, -0.4, 0.62]} b={[0.4, 0.4, 3.6]} color="#9fd3ff" px={3} o={fin(f, tArrow)} />
        <HArrow3D from={[0.9, 0.9, 0.7]} to={[0.9, 0.9, 2.4]} color={C.second} px={9} head={34} o={fin(f, tUp)} />
      </HView3D>
      <SoftEdges id="s07" box={{ x: 40, y: 30, w: 940, h: 820 }} px={60} />
      <Svg>
        <Lbl x={pr.p([0.9, 0.9, 2.4])[0] + 24} y={pr.p([0.9, 0.9, 2.4])[1]} t="ẑ" c={C.second} s={T.key} o={fin(f, tUp + 10)} />
        <Keyword f={f} text="del operator" at={[1080, 110]} appear={tDel} />
        <Lbl x={1080} y={540} t="i = 1, 2, 3" c={C.gold} s={T.key} o={fin(f, tIdx + 24)} />
        <Lbl x={1380} y={540} t={["x", "y", "z"][iC]} c={C.gold} s={T.key} o={fin(f, tIdx + 30)} />
        {["divergence", "curl", "Laplacian"].map((t, i) => <Lbl key={t} x={1080 + i * 270} y={760} t={t} c={C.key} s={T.floor} o={0.75 * fin(f, tOps + 20 + 10 * i)} />)}
      </Svg>
      <Layered parts={[{ t: String.raw`\nabla=\hat{\mathbf x}\,\frac{\partial}{\partial x}+\hat{\mathbf y}\,\frac{\partial}{\partial y}+` },
        { t: String.raw`\hat{\mathbf z}\,\frac{\partial}{\partial z}` }]}
        layers={[{ t: "all", o: 1, tc: { 1: f >= tUp ? C.local : C.ink } }]} x={1080} y={260} size={68} o={fin(f, tArrow)} />
      <TeX s={eB} x={1080} y={420} size={T.eq} o={fin(f, tIdx)} />
    </Scene>
  );
};

// ================================================================ s08 units
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = K("s08_units");
  const t0 = SS(k, 0), tH = SS(k, 1), tT = SS(k, 2), tK = SS(k, 3), tP = SS(k, 4);
  return (
    <Scene>
      <Svg>
        <HillIcon x={420} y={260} s={1.6} o={0.35 + 0.65 * fin(f, tH)} />
        <ThermoIcon x={420} y={520} s={1.4} o={0.35 + 0.65 * fin(f, tT)} c={C.local} />
        <BaroIcon x={420} y={720} r={60} o={0.35 + 0.65 * fin(f, tP)} />
        <Lbl x={1080} y={110} t="field’s unit ÷ length" c={C.key} s={T.key} o={fin(f, t0)} />
      </Svg>
      <TeX s={String.raw`\mathrm{m/km}\ =\ \text{slope}`} x={1080} y={240} size={64} o={fin(f, tH)} />
      <TeX s={String.raw`\mathrm{K/m}\ \to\ \mathrm{K\ per\ 100\ km}`} x={1080} y={420} size={64} o={fin(f, tT)} />
      <TeX s={String.raw`\mathrm{Pa/m}\ \to\ \mathrm{hPa\ per\ 100\ km}`} x={1080} y={690} size={64} o={fin(f, tP)} />
      <Svg><Lbl x={1080} y={540} t="1 K step = 1 °C step" c={C.key} s={T.key} o={fin(f, tK)} /></Svg>
    </Scene>
  );
};

export const SCENES_A: Record<string, React.FC> = {
  s00_title: S00, s01_hook: S01, s02_fields: S02, s03_fog: S03, s04_sweep: S04, s05_reveal: S05, s06_definition: S06, s07_operator: S07, s08_units: S08,
};
void [GeoImg, LUT_SP, LUT_TH, fitX, HU, Place, edges, mbW];
