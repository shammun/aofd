// ch00_coordinates_maps scenes s00-s07: the title, the hook (Mercator + polar map), the Parts 1/3/6 recap, the orange peel (the
// morphing Earth: globe → 12 gores → plate carrée), the plate carrée built line by line (x = a λ, y = a φ, Brest), its stretch
// k = 1/cos φ with Tissot circles, the "keep this" + gradient pointer, and Mercator's idea (photo stretch, strips, conformal).
// Projected positions: JS mirrors of fluidpy.geo.mapproj.forward checked in mp_lib; numbers from data/mp.json only.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Bracket, Pt, pulse } from "../house/kit/draw";
import { RiseText, TitleGradient } from "../house/kit/title";
import { SourceBelow } from "../house/kit/frame";
import { CurvedLink } from "../house/kit/extras";
import { Part } from "../house/kit/tex";
import { GlobeCam } from "./kit_mp/globe";
import {
  AT, Arrow, BREST, CalcStack, D, D2R, Face, Globe, IMGS, K, LYB, Layered, Lbl, Keyword, MorphView, OptTag, PolarMap, ProjMap, PV, RasterImg, SRC_BM,
  SS, Scene, SideCallout, SkipChip, Svg, TIS, TeX, XC, fin, flatCam, flatPos, fout, gLine, gdot, globeG, keepTime, llD, mapBox, mapPt, mix, mixPV, morphD,
  poly, prog, pv, tissotC, tissotD, tissotFlat, win, R_PS, coastD,
} from "./mp_lib";
import { EQ_S02, EQ_S04, EQ_S05, EQ_S06, cutAt } from "./mp_eq";

// ---------------------------------------------------------------- numbers on screen = the data (the module throws otherwise)
const CHECK_A: [string, number, number, number][] = [
  ["dy1", D.slope.dy, 111.2, 0.05], ["dx1", D.slope.dx, 73.8, 0.05], ["gc", D.routes.d_gc, 8755, 0.5], ["rh+", 100 * (D.routes.d_rh / D.routes.d_gc - 1), 11, 0.2],
  ["brest x", D.pc.brest_s_km[0], -500, 1], ["brest y", D.pc.brest_s_km[1], 5382, 0.5], ["phi rad", D.pc.brest_s_rad[0], 0.8447, 5e-5], ["lam rad", D.pc.brest_s_rad[1], -0.0785, 5e-5],
  ["6371*0.8447", 6371 * 0.8447, 5382, 0.5], ["6371*-0.0785", 6371 * -0.0785, -500, 0.5],
  ["2pi a", D.pc.eq_km, 40030, 0.5], ["acB", D.k.acB, 4230, 1], ["k Brest", D.k.k[0], 1.5, 0.01], ["k 60", D.k.k[1], 2, 1e-9], ["k LYB", D.k.k[2], 4.9, 0.002],
  ["cos B", D.k.cos[0], 0.664, 5e-4], ["cos LYB", D.k.cos[2], 0.204, 5e-4], ["slope", D.slope.slope, 1.4, 0.05], ["2pi 4230", 2 * Math.PI * 4230, 26580, 2.5],
  ["40030/26580", 40030 / 26580, 1.5, 0.01], ["a", D.consts.a_km, 6371, 0],
];
CHECK_A.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
const SRC_IMG = "Image: NASA Blue Marble NG";

// ================================================================ s00 title
const TB = { x: 1130, y: 170, w: 710, h: 470 };
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  const tEasy = AT(k, 0, "the easy way"), tPole = AT(k, 0, "above the pole");
  const pz = 1 + 0.06 * pulse(f, tEasy, 14);
  const oA = fout(f, tPole, 12), oB = fin(f, tPole, 12);
  const s = prog(f, 40, 100) + prog(f, 110, 160) + prog(f, 175, 235);
  const spin = -30 * (1 - prog(f, 0, 40));
  const Dd = mix(3.5, mix(8.6, 11.5, prog(f, 175, 235)), prog(f, 40, 120));
  const st = flatCam({ D: Dd, pp: [TB.w / 2, TB.h / 2] });
  const pos = flatPos(s, spin);
  const vB: PV = { cx: TB.x + TB.w / 2, cy: TB.y + TB.h / 2, s: 225 / R_PS };
  return (
    <Scene fadeIn={false}>
      <Svg>
        <defs><TitleGradient id="ttl" x1={100} x2={700} /></defs>
        <RiseText f={f} t="Coordinates · Part 7" x={104} y={130} s={64} at={2} fill={C.key} />
        <RiseText f={f} t="Maps" x={100} y={315} s={150} at={6} fill="url(#ttl)" />
        <g transform={`translate(104 430) scale(${pz}) translate(-104 -430)`}>
          <RiseText f={f} t="made easy" x={104} y={440} s={88} at={16} fill={C.key} />
        </g>
        <RiseText f={f} t="projections and" x={106} y={590} s={68} at={26} fill={C.key} />
        <RiseText f={f} t="the view from the pole" x={106} y={680} s={68} at={32} fill={C.key} colors={(i) => (i >= 14 ? C.first : undefined)} />
      </Svg>
      <MorphView st={st} box={TB} pos={pos} o={oA * fin(f, 2, 10)} />
      <Svg o={oA * fin(f, 2, 10)}>
        <defs><clipPath id="s00c"><rect x={TB.x} y={TB.y} width={TB.w} height={TB.h} /></clipPath></defs>
        <g clipPath="url(#s00c)">
          <path d={(D.coast as number[][]).map((L) => morphD(st, TB, pos, L, s < 0.25)).join("")} fill="none" stroke={C.key} strokeOpacity={0.55} strokeWidth={1.4} />
          <g opacity={fin(f, 20, 12)}>{[TIS.eq, TIS.brest, TIS.n60, TIS.lyb, 6, 9, 10].map((i) =>
            <path key={i} d={morphD(st, TB, pos, tissotFlat(i), s < 0.25, true)} fill={C.gold} fillOpacity={0.3} stroke={C.gold} strokeWidth={2.5} />)}</g>
        </g>
      </Svg>
      <PolarMap f={f} v={vB} o={oB} trails={1} trailFr={f + 120} rings={0.35} spokes={0.3} dimBase={0.35} id="s00p" />
      <SourceBelow text={SRC_IMG} pic={TB} w={710} o={oA} name="s00 src a" />
      <SourceBelow text="Image: NASA Blue Marble NG · Data: NCEP/NCAR Reanalysis 1 · 21 Jan 2026 · 10 hPa" pic={TB} w={710} o={oB} name="s00 src b" />
    </Scene>
  );
};

// ================================================================ s01 hook: Greenland as big as Africa; the Arctic on one page
const V01: PV = { cx: 450, cy: 350, s: 118 };
const VP01: PV = { cx: 1400, cy: 350, s: 290 / R_PS };
/** seven code-drawn thumbnails of the seven parts (the seventh lit) */
const PartThumb: React.FC<{ i: number; x: number; y: number; o: number; lit: boolean }> = ({ i, x, y, o, lit }) => {
  const c = lit ? C.gold : C.local, w = 140, h = 96, cx = x + w / 2, cy = y + h / 2;
  return <g opacity={o}>
    <rect x={x} y={y} width={w} height={h} rx={12} fill="#1b2540" stroke={lit ? C.gold : C.grid} strokeWidth={3} />
    {i === 0 ? <><circle cx={cx} cy={cy} r={34} fill="none" stroke={c} strokeWidth={3} /><line x1={cx} y1={cy} x2={cx + 30} y2={cy - 18} stroke={c} strokeWidth={4} /></> : null}
    {i === 1 ? <><ellipse cx={cx} cy={cy - 26} rx={34} ry={9} fill="none" stroke={c} strokeWidth={3} /><ellipse cx={cx} cy={cy + 26} rx={34} ry={9} fill="none" stroke={c} strokeWidth={3} />
      <line x1={cx - 34} y1={cy - 26} x2={cx - 34} y2={cy + 26} stroke={c} strokeWidth={3} /><line x1={cx + 34} y1={cy - 26} x2={cx + 34} y2={cy + 26} stroke={c} strokeWidth={3} /></> : null}
    {i === 2 ? <><circle cx={cx} cy={cy} r={38} fill="none" stroke={c} strokeWidth={3} /><ellipse cx={cx} cy={cy} rx={38} ry={10} fill="none" stroke={c} strokeWidth={2} />
      <ellipse cx={cx} cy={cy} rx={14} ry={38} fill="none" stroke={c} strokeWidth={2} /></> : null}
    {i === 3 ? <><Arrow p={[cx - 20, cy + 26]} q={[cx + 34, cy + 26]} color={c} w={4} head={14} /><Arrow p={[cx - 20, cy + 26]} q={[cx - 20, cy - 30]} color={c} w={4} head={14} /></> : null}
    {i === 4 ? <><rect x={cx - 40} y={cy - 14} width={64} height={28} rx={6} fill="none" stroke={c} strokeWidth={3} /><Arrow p={[cx + 28, cy]} q={[cx + 52, cy]} color={c} w={4} head={12} /></> : null}
    {i === 5 ? <><path d={`M ${cx - 50} ${cy + 20} Q ${cx} ${cy - 40} ${cx + 50} ${cy + 20}`} fill="none" stroke={C.gold} strokeWidth={3} />
      <line x1={cx - 50} y1={cy + 20} x2={cx + 50} y2={cy + 20} stroke={C.local} strokeWidth={3} /></> : null}
    {i === 6 ? <><rect x={cx - 44} y={cy - 30} width={88} height={60} fill="none" stroke={c} strokeWidth={3} />
      {[-22, 0, 22].map((d) => <line key={d} x1={cx + d} y1={cy - 30} x2={cx + d} y2={cy + 30} stroke={c} strokeWidth={2} />)}
      {[-12, 12].map((d) => <line key={d} x1={cx - 44} y1={cy + d} x2={cx + 44} y2={cy + d} stroke={c} strokeWidth={2} />)}</> : null}
  </g>;
};
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  const tBig = AT(k, 0, "as big as Africa"), tArc = AT(k, 0, "whole Arctic"), tSeven = AT(k, 1, "last of seven parts"), tFlat = AT(k, 2, "flattened onto maps"),
    tPole = AT(k, 3, "above the North Pole");
  const pg = pulse(f, tBig, 24), pf = pulse(f, tFlat, 24);
  const outline = (L: number[], c: string) => <path d={llD(V01, "mc", L, undefined, 0, 85, true)} fill={c} fillOpacity={0.25 + 0.3 * pg} stroke={c} strokeWidth={3 + 3 * pg} />;
  return (
    <Scene>
      <ProjMap id="s01m" v={V01} name="mc" img={IMGS.mc} imgO={0.85 + 0.15 * pf} coast={0.5}>
        {() => <>{(D.areas.gl as number[][]).map((L, i) => <g key={`g${i}`}>{outline(L, C.first)}</g>)}
          {(D.areas.af as number[][]).map((L, i) => <g key={`a${i}`}>{outline(L, C.second)}</g>)}</>}
      </ProjMap>
      <PolarMap f={f} v={VP01} dimBase={mix(0.45, 0.12, fin(f, tArc, 15))} rings={0.35} spokes={0.3} trails={fin(f, tPole, 20)} trailFr={f + 60} id="s01p" />
      <Svg>
        <g opacity={fin(f, tSeven)}>
          {Array.from({ length: 7 }, (_, i) => <PartThumb key={i} i={i} x={120 + i * 165} y={712} o={i === 6 ? 1 : 0.35} lit={i === 6} />)}
        </g>
        <Keyword f={f} text="maps" at={[1290, 760]} appear={tSeven + 10} c={C.gold} />
      </Svg>
      <SourceBelow text={SRC_BM} pic={mapBox(V01, "mc", 80)} w={741} name="s01 src m" />
      <SourceBelow text="Image: NASA Blue Marble NG · Data: NCEP/NCAR R1 · 21 Jan 2026" pic={{ x: VP01.cx - 290, y: VP01.cy - 290, w: 580, h: 580 }} w={580} gap={12}
        o={fin(f, tPole, 20)} name="s01 src p2" />
      <SourceBelow text={SRC_BM} pic={{ x: VP01.cx - 290, y: VP01.cy - 290, w: 580, h: 580 }} w={580} gap={12} o={fout(f, tPole - 12, 12)} name="s01 src p" />
    </Scene>
  );
};

// ================================================================ s02 recap (Parts 1, 3, 6): one item per sentence, older ones at 60 %
const CAM02: GlobeCam = { lat: 36, lon: -50, dist: 3.5 };
const S02: React.FC = () => {
  const f = useCurrentFrame(), k = K("s02_part6_recap");
  const t1 = SS(k, 1), t2 = SS(k, 2), tA = AT(k, 2, "the letter a"), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), tGC = AT(k, 6, "the great circle, about"),
    tRh = AT(k, 6, "rhumb line, which keeps");
  const items = [t1, t2, tA, t3, t4, t5, tGC, tRh];
  const io = (i: number) => fin(f, items[i]) * (i < items.length - 1 ? mix(1, 0.6, fin(f, items[i + 1])) : 1);
  const gO = 1 - win(f, t1 - 6, t2 - 10, 12);
  const pO = win(f, t1, t2 - 10, 12);
  const R = D.routes;
  const merLats = Array.from({ length: 50 }, (_, i) => (BREST[0] * i) / 49);
  const parLons = Array.from({ length: 121 }, (_, i) => -180 + 3 * i);
  // Part 1's polar grid: arc rule s = r θ
  const c1: Pt = [520, 430], r1 = 290, th = 55 * prog(f, t1 + 10, t1 + 70);
  return (
    <Scene>
      <Globe cam={CAM02} o={gO} grat={0.3} coast={0.45} over={(G) => <>
        {gLine(G, merLats, merLats.map(() => BREST[1]), C.first, 7, win(f, t2, t3 + 10))}
        {gLine(G, [0, 0], [0, BREST[1]], C.second, 7, win(f, t2, t3 + 10))}
        {gLine(G, [BREST[0] - 6, BREST[0] + 6], [BREST[1], BREST[1]], C.gold, 10, win(f, t3, t4))}
        {gLine(G, parLons.map(() => BREST[0]), parLons, C.first, 5, win(f, t4, t5 + 30))}
        {gLine(G, R.gc[0], R.gc[1], C.gold, 7, fin(f, tGC))}
        {gLine(G, R.rh[0], R.rh[1], C.local, 7, fin(f, tRh))}
        {gdot(G, BREST[0], BREST[1], C.gold, 10, fin(f, t2) * fout(f, tGC - 10))}
        {gdot(G, R.lon[0], R.lon[1], C.key, 10, fin(f, tGC))}{gdot(G, R.lax[0], R.lax[1], C.key, 10, fin(f, tGC))}
      </>} />
      <Svg>
        <g opacity={pO}>
          <circle cx={c1[0]} cy={c1[1]} r={r1} fill="none" stroke={C.local} strokeWidth={3} />
          {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={c1[0]} y1={c1[1]} x2={c1[0] + r1 * Math.cos(i * Math.PI / 3)} y2={c1[1] - r1 * Math.sin(i * Math.PI / 3)} stroke={C.grid} strokeWidth={2} />)}
          <line x1={c1[0]} y1={c1[1]} x2={c1[0] + r1} y2={c1[1]} stroke={C.first} strokeWidth={6} />
          <line x1={c1[0]} y1={c1[1]} x2={c1[0] + r1 * Math.cos(th * D2R)} y2={c1[1] - r1 * Math.sin(th * D2R)} stroke={C.first} strokeWidth={6} />
          <path d={poly(Array.from({ length: 30 }, (_, i) => [c1[0] + r1 * Math.cos((th * D2R * i) / 29), c1[1] - r1 * Math.sin((th * D2R * i) / 29)] as Pt))} fill="none" stroke={C.gold} strokeWidth={9} />
          <path d={poly(Array.from({ length: 20 }, (_, i) => [c1[0] + 70 * Math.cos((th * D2R * i) / 19), c1[1] - 70 * Math.sin((th * D2R * i) / 19)] as Pt))} fill="none" stroke={C.second} strokeWidth={5} />
        </g>
        <Keyword f={f} text="from the earlier parts" at={[XC, 120]} appear={0} out={t1 - 18} />
        <Lbl x={XC + 260} y={120} t="arc rule" c={C.muted} s={T.floor} o={io(0)} />
        <Lbl x={XC} y={720} t="great circle ≈ 8755 km" c={C.gold} s={T.key} o={io(6)} />
        <Lbl x={XC} y={795} t="rhumb line: + 11 %" c={C.local} s={T.key} o={io(7)} />
        <Lbl x={XC + 220} y={640} t="scale factors" c={C.muted} s={T.floor} o={io(5)} />
      </Svg>
      <TeX s={String.raw`s=r\,\theta`} x={XC} y={120} size={68} o={io(0)} />
      <TeX s={String.raw`r`} x={c1[0] + r1 / 2} y={c1[1] + 34} size={54} c={C.first} ax={0.5} o={pO} />
      <TeX s={String.raw`s`} x={c1[0] + (r1 + 40) * Math.cos(27.5 * D2R)} y={c1[1] - (r1 + 40) * Math.sin(27.5 * D2R)} size={54} c={C.gold} ax={0.5} o={pO * fin(f, t1 + 72)} />
      <TeX s={String.raw`\theta`} x={c1[0] + 110 * Math.cos(27.5 * D2R)} y={c1[1] - 110 * Math.sin(27.5 * D2R)} size={54} c={C.second} ax={0.5} o={pO * fin(f, t1 + 72)} />
      <TeX s={String.raw`\varphi\ \text{latitude},\quad\lambda\ \text{longitude}`} x={XC} y={210} size={56} o={io(1)} />
      <TeX s={String.raw`a\approx 6400\ \text{km}\ (6371\ \text{km})`} x={XC} y={300} size={60} o={io(2)} />
      <TeX s={String.raw`1^\circ\ \text{north}\approx111.2\ \text{km}`} x={XC} y={390} size={60} o={io(3)} />
      <TeX s={String.raw`1^\circ\ \text{east at Brest}\approx73.8\ \text{km}`} x={XC} y={475} size={54} o={io(4)} />
      <TeX s={EQ_S02} x={XC} y={560} size={60} o={io(5)} />
      <SourceBelow text={SRC_IMG} pic={{ x: 120, y: 40, w: 840, h: 760 }} w={840} o={gO} name="s02 src" />
    </Scene>
  );
};

// ================================================================ s03 the orange peel: globe → 12 gores → plate carrée
const B03 = { x: 0, y: 0, w: 1920, h: 1080 };
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_flattening");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), tGap = AT(k, 3, "gaps open up"), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const s = prog(f, t3, t3 + 90) + prog(f, AT(k, 4, "stretching"), AT(k, 4, "stretching") + 90);
  const spin = -35 * (1 - prog(f, 0, t3));
  const Dd = mix(5.0, 11.2, prog(f, t3, t3 + 100));
  const st = flatCam({ D: Dd, pp: [600, 420] });
  const pos = flatPos(s, spin);
  return (
    <Scene>
      <MorphView st={st} box={B03} pos={pos} />
      <Svg>
        <path d={(D.coast as number[][]).map((L) => morphD(st, B03, pos, L, s < 0.25)).join("")} fill="none" stroke={C.key} strokeOpacity={0.5} strokeWidth={1.5} />
        <g opacity={fin(f, t4 + 30, 20)}>{[TIS.eq, TIS.brest, TIS.n60, TIS.lyb, 5, 6, 7, 8, 9, 10, 11].map((i) =>
          <path key={i} d={morphD(st, B03, pos, tissotFlat(i), false, true)} fill={C.gold} fillOpacity={0.3} stroke={C.gold} strokeWidth={3} />)}</g>
        <Keyword f={f} text="flattening the Earth" at={[1180, 300]} appear={0} out={t1 - 18} />
        <Keyword f={f} text="stretch or tear?" at={[1180, 300]} appear={t1 + 20} out={t2 - 18} />
        <Keyword f={f} text="an orange peel" at={[1180, 300]} appear={t2} out={tGap - 18} />
        <Keyword f={f} text="12 slices, with gaps" at={[1180, 300]} appear={tGap} out={t4 - 18} />
        <Keyword f={f} text="close the gaps: stretch" at={[1180, 300]} appear={t4} out={t5 - 18} />
        <Keyword f={f} text="every flat map" at={[1180, 300]} appear={t5} c={C.gold} />
        <Lbl x={1180} y={370} t="stretches something" c={C.gold} s={T.key} o={fin(f, t5 + 8)} />
        <Lbl x={1180} y={500} t="circles: 500 km on the ground" c={C.muted} s={T.floor} b={false} o={fin(f, t4 + 40)} />
        <Keyword f={f} text="the simplest map next" at={[1180, 640]} s={T.floor} appear={t6} />
      </Svg>
      <SourceBelow text={SRC_IMG} pic={{ x: 120, y: 60, w: 960, h: 728 }} w={960} name="s03 src" />
    </Scene>
  );
};

// ================================================================ s04 the plate carrée: x = a λ, y = a φ (maths block A starts)
const G4 = { x: 70, y: 15, w: 440, h: 370 };
const CAM4: GlobeCam = { lat: 22, lon: -25, dist: 3.6 };
const V4: PV = { cx: 540, cy: 625, s: 132 };
const VZ4: PV = { cx: 600, cy: 800, s: 420 };
const B4 = mapBox(V4, "pc");
const PageFrame: React.FC<{ id: string; v: PV; o?: number; img?: number; children?: (p: (lat: number, lon: number) => Pt) => React.ReactNode }> = ({ id, v, o = 1, img = 0, children }) =>
  <ProjMap id={id} v={v} name="pc" box={B4} img={img > 0 ? IMGS.pc : null} imgO={img} coast={0.55 * img} sea="#1b2440" o={o}>{children}</ProjMap>;
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = K("s04_plate_carree");
  const t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11), t12 = SS(k, 12),
    t13 = SS(k, 13), t14 = SS(k, 14), t15 = SS(k, 15), t16 = SS(k, 16), t17 = SS(k, 17), t18 = SS(k, 18), t19 = SS(k, 19), t20 = SS(k, 20);
  const z = prog(f, t14 + 20, t14 + 80) * (1 - prog(f, t19, t19 + 60));
  const v = mixPV(V4, VZ4, z), P = pv(v);
  const un = prog(f, t5 + 10, t5 + 80);                         // the equator unrolls
  const eqPts = Array.from({ length: 73 }, (_, i) => -180 + 5 * i);
  const merO = fin(f, t11 + 20, 20);
  const allMer = (lo: number) => fin(f, t13 + 20 + Math.abs(lo) / 6, 14);
  const brO = fin(f, t14);
  const pB = mapPt(v, "pc", BREST[0], BREST[1]), p0 = mapPt(v, "pc", 0, 0), pX = mapPt(v, "pc", 0, BREST[1]);
  const tr = pulse(f, t19 + 70, 40);
  const lamD = 60, pLam = mapPt(v, "pc", 0, lamD);
  const eqParts: Part[] = [{ t: String.raw`x=a\,\lambda` }, { t: String.raw`,\qquad` }, { t: String.raw`y=a\,\varphi` }];
  if (eqParts.map((q) => q.t).join("").replace(/\s/g, "") !== EQ_S04.replace(/\s/g, "")) throw new Error("s04 parts drift from EQ_S04");
  return (
    <Scene>
      <Globe cam={CAM4} box={G4} grat={0.25} coast={0.4} over={(Gp) => {
        return <>
          {gLine(Gp, eqPts.map(() => 0), eqPts, C.gold, 6, fin(f, t4) * (1 - 0.6 * un) + 0.4 * un * fin(f, t4))}
          {gLine(Gp, [0, 0, 0], [0, 30, lamD], C.first, 9, win(f, t7, t10))}
          {gLine(Gp, Array.from({ length: 31 }, (_, i) => 3 * i), Array.from({ length: 31 }, () => BREST[1]), C.first, 7, fin(f, t11) * (1 - 0.5 * fin(f, t14)))}
          {gdot(Gp, BREST[0], BREST[1], C.gold, 9, brO)}
        </>;
      }} />
      {/* the unrolling equator: points of the projected equator circle glide to the page's equator line (the cut is at 180°) */}
      <PageFrame id="s04p" v={v} img={fin(f, t20, 30)}>
        {(Pp) => <>
          {/* every meridian (30°) and Brest's */}
          {Array.from({ length: 13 }, (_, i) => -180 + 30 * i).map((lo) => <line key={lo} x1={Pp(-90, lo)[0]} y1={Pp(-90, lo)[1]} x2={Pp(90, lo)[0]} y2={Pp(90, lo)[1]}
            stroke={C.first} strokeWidth={3 + 2 * tr} opacity={0.7 * allMer(lo)} />)}
          <line x1={Pp(0, BREST[1])[0]} y1={Pp(0, BREST[1])[1]} x2={Pp(0, BREST[1])[0]} y2={mix(Pp(0, BREST[1])[1], Pp(90, BREST[1])[1], prog(f, t11 + 10, t11 + 70))}
            stroke={C.first} strokeWidth={6} opacity={merO * (1 - 0.6 * fin(f, t14))} />
          {/* the equator after the unroll, its ticks every 30° */}
          <line x1={Pp(0, -180)[0]} y1={Pp(0, 0)[1]} x2={Pp(0, 180)[0]} y2={Pp(0, 0)[1]} stroke={C.gold} strokeWidth={6 + 3 * tr} opacity={fin(f, t5 + 78, 6)} />
          {Array.from({ length: 13 }, (_, i) => -180 + 30 * i).map((lo) => <line key={lo} x1={Pp(0, lo)[0]} y1={Pp(0, 0)[1] - 12} x2={Pp(0, lo)[0]} y2={Pp(0, 0)[1] + 12}
            stroke={C.gold} strokeWidth={4} opacity={fin(f, t6)} />)}
          <line x1={Pp(0, 0)[0]} y1={Pp(0, 0)[1]} x2={pLam[0]} y2={pLam[1]} stroke={C.first} strokeWidth={12} opacity={win(f, t7, t10)} />
          {/* Brest: dashed legs from the origin */}
          <g opacity={brO}>
            <line x1={p0[0]} y1={p0[1]} x2={pX[0]} y2={pX[1]} stroke={C.second} strokeWidth={7} strokeDasharray="12 8" opacity={fin(f, t16 + 40)} />
            <line x1={pX[0]} y1={pX[1]} x2={pB[0]} y2={pB[1]} stroke={C.first} strokeWidth={7} strokeDasharray="12 8" opacity={fin(f, t17 + 40)} />
            <circle cx={pB[0]} cy={pB[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={4} />
          </g>
        </>}
      </PageFrame>
      <Svg>
        {/* the unroll (drawn over the globe and the page while it moves) */}
        <UnrollEquator f={f} t0={t5 + 10} t1={t5 + 80} v={v} />
        <Lbl x={mapPt(v, "pc", 0, 0)[0]} y={mapPt(v, "pc", 0, 0)[1] + 48} t="2πa ≈ 40 000 km" c={C.gold} s={T.floor} a="middle" o={win(f, t6, t7 - 10)} />
        <g data-lc-maplabel="1"><Lbl x={pB[0] - 18} y={pB[1] - 36} t="Brest" c={C.key} s={T.floor} a="end" o={brO} /></g>
        <Keyword f={f} text="the simplest map" at={[XC, 230]} appear={0} out={t9 - 18} />
        <Keyword f={f} text="lines we know the lengths of" at={[XC, 330]} s={T.floor} appear={t3} out={t7 - 18} />
        <Keyword f={f} text="arc rule" at={[XC, 330]} s={T.floor} appear={t8} out={t10 - 18} />
        <Keyword f={f} text="distance north (Part 3)" at={[XC, 330]} s={T.floor} appear={t12} out={t14 - 18} />
        <SkipChip f={f} k={k} to={keepTime("s06_gradient_preview")} />
        <CurvedLink f={f} from={[XC - 14, 230]} to={[pLam[0], pLam[1] - 14]} start={t9 + 8} end={t10} bend={60} />
        <SideCallout f={f} lines="≈ −500 km" at={[XC + 20, 700]} appear={t16 + 40} out={t19} target={[(p0[0] + pX[0]) / 2, p0[1] + 10]} c={C.second} bend={-40} />
        <SideCallout f={f} lines="≈ 5382 km" at={[XC + 20, 620]} appear={t17 + 40} out={t19} target={[pB[0] + 10, (pX[1] + pB[1]) / 2]} c={C.first} bend={20} />
        <Keyword f={f} text="true along the equator" at={[XC, 680]} s={T.floor} appear={t19 + 60} />
        <Lbl x={XC} y={740} t="and along every meridian" c={C.key} s={T.floor} o={fin(f, t19 + 68)} />
        <Keyword f={f} text="plate carrée = flat square" at={[XC, 810]} appear={AT(k, 20, "plate carrée")} c={C.gold} />
      </Svg>
      <TeX s={String.raw`\theta\to\lambda,\ \ r\to a`} x={XC + 230} y={330} size={54} c={C.muted} o={win(f, t8 + 10, t10 - 18)} />
      <TeX s={String.raw`a\,\lambda`} x={(mapPt(v, "pc", 0, 0)[0] + pLam[0]) / 2} y={pLam[1] - 50} size={54} c={C.first} ax={0.5} o={win(f, t7 + 30, t10)} />
      <Layered parts={eqParts} x={XC} y={230} size={76} layers={[{ t: [0], o: fin(f, t9) }, { t: [1, 2], o: fin(f, t13 + 40) }]} />
      <CalcStack f={f} x={XC + 110} y={300} size={56} maxLines={2} o={fout(f, t19 + 50, 14)} rows={[
        { lhs: String.raw`\varphi,\ \lambda`, rhs: String.raw`=48.4^\circ,\ \ -4.5^\circ`, at: AT(k, 14, "forty eight") },
        { lhs: String.raw`\times\dfrac{\pi}{180}`, rhs: String.raw`=0.8447,\ \ -0.0785`, at: AT(k, 15, "zero point") },
        { lhs: String.raw`x`, rhs: String.raw`=6371\times(-0.0785)`, at: t16, c: C.second },
        { rhs: String.raw`\approx-500\ \text{km}`, at: AT(k, 16, "about minus"), c: C.second, cont: true },
        { lhs: String.raw`y`, rhs: String.raw`=6371\times0.8447`, at: t17, c: C.first },
        { rhs: String.raw`\approx5382\ \text{km}`, at: AT(k, 17, "about five"), c: C.first, cont: true },
      ]} />
      <SourceBelow text={SRC_IMG} pic={B4} w={830} gap={12} name="s04 src" />
    </Scene>
  );
};
/** the equator of the s04 globe glides from its projected circle to the page's equator line (the cut at 180° opens) */
const UnrollEquator: React.FC<{ f: number; t0: number; t1: number; v: PV }> = ({ f, t0, t1, v }) => {
  const u = prog(f, t0, t1);
  if (f < t0 || f > t1 + 6) return null;
  const box = G4, cam = CAM4;
  // the globe's projection (same camera as the Globe component)
  const Gp = globeG(cam, box);
  const pts: Pt[] = [];
  for (let lo = -180; lo <= 180; lo += 5) {
    const g = Gp.p(0, lo, 1.002), m = mapPt(v, "pc", 0, lo);
    pts.push([mix(g[0], m[0], u), mix(g[1], m[1], u)]);
  }
  return <path d={poly(pts)} fill="none" stroke={C.gold} strokeWidth={7} opacity={0.95} />;
};

// ================================================================ s05 the stretch k = 1/cos φ (maths block A)
const VZ5: PV = { cx: 540, cy: 800, s: 290 };
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = K("s05_stretch_k");
  const t1 = SS(k, 1), tLong = AT(k, 1, "as long as the equator"), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9),
    tCan = AT(k, 9, "cancel"), t10 = SS(k, 10), t11 = SS(k, 11), t12 = SS(k, 12), t13 = SS(k, 13), t14 = SS(k, 14);
  const z = prog(f, t14, t14 + 50);
  const v = mixPV(V4, VZ5, z);
  const lons = Array.from({ length: 121 }, (_, i) => -180 + 3 * i);
  const pRight = mapPt(v, "pc", BREST[0], 180), band = (la: number) => mapPt(v, "pc", la, 170);
  const [eqA] = cutAt(EQ_S05, String.raw`=\dfrac{1}{\cos\varphi}`);
  const struck = String.raw`k=\dfrac{\textcolor{#d9667f}{\cancel{\textcolor{#e8ecf4}{2\pi a}}}}{\textcolor{#d9667f}{\cancel{\textcolor{#e8ecf4}{2\pi a}}}\cos\varphi}=\dfrac{1}{\cos\varphi}`;
  if (struck.replace(/\\textcolor\{#[0-9a-f]+\}|\\cancel/g, "").replace(/[{}]/g, "") !== EQ_S05.replace(/[{}]/g, "")) throw new Error("s05 struck form drifts from EQ_S05");
  const radO = win(f, t3, t8, 12);
  const G5 = globeG(CAM4, G4), ax5 = G5.pw([0, Math.sin(BREST[0] * D2R), 0]), bp5 = G5.p(BREST[0], BREST[1]);
  const radMid: Pt = [(ax5[0] + bp5[0]) / 2, (ax5[1] + bp5[1]) / 2];
  return (
    <Scene>
      <Globe cam={CAM4} box={G4} grat={0.25} coast={0.4} over={(Gp) => {
        const ax = Gp.pw([0, Math.sin(BREST[0] * D2R), 0]), bp = Gp.p(BREST[0], BREST[1]);
        return <>
          {gLine(Gp, lons.map(() => BREST[0]), lons, C.first, 6 + 4 * pulse(f, t4 + 20, 30), fin(f, 0, 10))}
          <line x1={ax[0]} y1={ax[1]} x2={bp[0]} y2={bp[1]} stroke={C.gold} strokeWidth={6} opacity={radO} />
          <circle cx={ax[0]} cy={ax[1]} r={7} fill={C.gold} opacity={radO} />
          {gdot(Gp, BREST[0], BREST[1], C.gold, 9)}
          <g opacity={fin(f, t14 + 20)}>{[TIS.brest, TIS.n60, TIS.lyb, TIS.eq].map((i) => {
            const R = D.tissot.ll[i] as number[][];
            return <g key={i}>{gLine(Gp, R[0], R[1], C.gold, 4)}</g>;
          })}</g>
        </>;
      }} />
      <PageFrame id="s05p" v={v} img={1}>
        {(Pp) => <>
          <line x1={Pp(BREST[0], -180)[0]} y1={Pp(BREST[0], 0)[1]} x2={Pp(BREST[0], 180)[0]} y2={Pp(BREST[0], 0)[1]} stroke={C.first} strokeWidth={6 + 4 * pulse(f, tLong, 30)} opacity={fin(f, t1)} />
          {[[BREST[0], t10], [60, t11], [LYB[0], t12]].map(([la, at]) => <line key={la} x1={Pp(la, -180)[0]} y1={Pp(la, 0)[1]} x2={Pp(la, 180)[0]} y2={Pp(la, 0)[1]}
            stroke={C.gold} strokeWidth={7} opacity={0.85 * win(f, at, t14)} />)}
          <g opacity={fin(f, t14 + 20)}>{[TIS.brest, TIS.n60, TIS.lyb, TIS.eq, 5, 6, 9].map((i) => <path key={i} d={tissotD(v, "pc", i)} fill={C.gold} fillOpacity={0.3} stroke={C.gold} strokeWidth={3} />)}</g>
          {(() => { const L = (D.tissot.ll[TIS.brest] as number[][]); const xs = L[1].map((lo, j) => mapPt(v, "pc", L[0][j], lo)); const x0 = Math.min(...xs.map((q) => q[0])), x1 = Math.max(...xs.map((q) => q[0])),
            y0 = Math.min(...xs.map((q) => q[1])), y1 = Math.max(...xs.map((q) => q[1]));
            return <g opacity={fin(f, t14 + 50)}><Bracket p={[x0, y1 + 14]} q={[x1, y1 + 14]} c={C.first} off={0} /><Bracket p={[x1 + 14, y1]} q={[x1 + 14, y0]} c={C.first} off={0} /></g>; })()}
        </>}
      </PageFrame>
      <Svg>
        <OptTag f={f} />
        <Keyword f={f} text="a parallel" at={[XC, 200]} appear={0} out={tLong - 18} />
        <SideCallout f={f} lines="40 030 km" at={[XC + 14, 200]} appear={tLong} out={t8 - 20} target={[pRight[0] - 8, pRight[1] - 10]} c={C.first} bend={30} />
        <SideCallout f={f} lines="a cos φ ≈ 4230 km" at={[XC + 14, 290]} appear={t3 + 20} out={t8 - 20} target={radMid} c={C.gold} bend={-30} />
        <SideCallout f={f} lines="≈ 4.9" at={[XC + 14, 570]} appear={t12 + 20} out={t14} target={band(LYB[0])} c={C.gold} bend={20} />
        <SideCallout f={f} lines="= 2" at={[XC + 14, 650]} appear={t11 + 20} out={t14} target={band(60)} c={C.gold} bend={20} />
        <SideCallout f={f} lines="≈ 1.5" at={[XC + 14, 730]} appear={t10 + 20} out={t14} target={band(BREST[0])} c={C.gold} bend={20} />
        <Keyword f={f} text="north-south: not stretched" at={[XC, 820]} s={T.floor} appear={t13} out={t14 + 120} />
        <Keyword f={f} text="circle → oval, 1.5 × wider" at={[XC, 700]} s={T.floor} appear={t14 + 40} />
        <Keyword f={f} text="squashed near the poles" at={[XC, 770]} s={T.floor} appear={AT(k, 14, "squashed flat")} />
      </Svg>
      <CalcStack f={f} x={XC} y={370} size={60} maxLines={2} o={fout(f, t8 - 20, 12)} rows={[
        { rhs: String.raw`2\pi\times4230\ \text{km}\approx26\,580\ \text{km}`, at: AT(k, 4, "twenty six") },
        { rhs: String.raw`40\,030\div26\,580\approx1.5`, at: AT(k, 6, "divided by") },
      ]} />
      <TeX s={eqA} x={XC} y={330} size={64} o={fin(f, t8) * fout(f, tCan - 10, 6)} />
      <TeX s={struck} x={XC} y={330} size={64} o={fin(f, tCan + 4)} />
      <TeX s={String.raw`\text{Brest: }1/0.664\approx1.5`} x={XC + 230} y={730} size={48} c={C.muted} o={win(f, t10 + 30, t14)} />
      <TeX s={String.raw`1/0.5`} x={XC + 160} y={650} size={48} c={C.muted} o={win(f, t11 + 30, t14)} />
      <TeX s={String.raw`1/0.204`} x={XC + 190} y={570} size={48} c={C.muted} o={win(f, t12 + 30, t14)} />
      <SourceBelow text={SRC_IMG} pic={B4} w={830} gap={12} name="s05 src" />
    </Scene>
  );
};

// ================================================================ s06 keep this + the slope on a grid + the gradient pointer
const V6: PV = { cx: 540, cy: 440, s: 140 };
const B6 = { lat0: 46.4, lat1: 50.6, x: 80, y: 120, w: 920, h: 640 };
const lonSpan6 = (4.2 * (B6.w / B6.h)) / Math.cos(48.5 * D2R);
const B6L = { ...B6, lon0: -4.5 - lonSpan6 / 2 - 0.5, lon1: -4.5 + lonSpan6 / 2 - 0.5 };
const P6 = (la: number, lo: number): Pt => [B6L.x + ((lo - B6L.lon0) / (B6L.lon1 - B6L.lon0)) * B6L.w, B6L.y + ((B6L.lat1 - la) / (B6L.lat1 - B6L.lat0)) * B6L.h];
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = K("s06_gradient_preview");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), tNot = AT(k, 6, "not by a hundred"), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9),
    t10 = SS(k, 10), tGr = AT(k, 10, "The gradient"), t11 = SS(k, 11), tPr = AT(k, 11, "Pressure as a vertical");
  const o1 = fout(f, t3 + 30, 20), o2 = fin(f, t3 + 50, 20);
  const pA = P6(BREST[0], -5), pB = P6(BREST[0], -4);
  const ghostW = (pB[0] - pA[0]) * (D.slope.dy / D.slope.dx);
  const band = (la: number) => mapPt(V6, "pc", la, 175);
  const cb = D.brest_crop.box as number[];
  const ia = P6(cb[1], cb[2]), ib = P6(cb[0], cb[3]);
  const [l1, l2] = [String.raw`\nabla T=\mathbf i\,\dfrac{1}{a\cos\varphi}\dfrac{\partial T}{\partial\lambda}`, String.raw`+\mathbf j\,\dfrac{1}{a}\dfrac{\partial T}{\partial\varphi}`];
  if ((l1 + l2) !== EQ_S06) throw new Error("s06 lines drift from EQ_S06");
  const p1: Part[] = [{ t: String.raw`\nabla T=\mathbf i\,` }, { t: String.raw`\dfrac{1}{a\cos\varphi}`, u: { w: String.raw`\text{scale factor of }\lambda`, c: C.gold } }, { t: String.raw`\dfrac{\partial T}{\partial\lambda}` }];
  const p2: Part[] = [{ t: String.raw`+\mathbf j\,` }, { t: String.raw`\dfrac{1}{a}`, u: { w: String.raw`\text{scale factor of }\varphi`, c: C.gold } }, { t: String.raw`\dfrac{\partial T}{\partial\varphi}` }];
  return (
    <Scene>
      <ProjMap id="s06m" v={V6} name="pc" img={IMGS.pc} coast={0.5} o={o1}>
        {(P) => <>{[[BREST[0], 1.5], [60, 2], [LYB[0], 4.9]].map(([la]) => <line key={la} x1={P(la, -180)[0]} y1={P(la, 0)[1]} x2={P(la, 180)[0]} y2={P(la, 0)[1]}
          stroke={C.gold} strokeWidth={7} opacity={0.85 * fin(f, AT(k, 2, "one and a half"))} />)}</>}
      </ProjMap>
      {o2 > 0 ? <Svg o={o2}>
        <defs><clipPath id="s06g"><rect x={B6.x} y={B6.y} width={B6.w} height={B6.h} /></clipPath></defs>
        <g clipPath="url(#s06g)">
          <rect x={B6.x} y={B6.y} width={B6.w} height={B6.h} fill="#1d2a44" />
          <image href={IMGS.crop} x={ia[0]} y={ia[1]} width={ib[0] - ia[0]} height={ib[1] - ia[1]} preserveAspectRatio="none" opacity={0.85} />
          <path d={(D.brest_coast as number[][]).map((L) => { let d = ""; for (let i = 0; i < L.length; i += 2) { const q = P6(L[i + 1], L[i]); d += `${i ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`; } return d; }).join("")}
            fill="none" stroke={C.key} strokeOpacity={0.8} strokeWidth={2} />
          {Array.from({ length: 14 }, (_, i) => -11 + i).map((lo) => <line key={lo} x1={P6(0, lo)[0]} y1={B6.y} x2={P6(0, lo)[0]} y2={B6.y + B6.h} stroke={C.local} strokeWidth={2} opacity={0.45} />)}
          {[-2, -1, 0, 1, 2].map((d) => <line key={d} x1={B6.x} y1={P6(BREST[0] + d, 0)[1]} x2={B6.x + B6.w} y2={P6(BREST[0] + d, 0)[1]} stroke={C.local} strokeWidth={2} opacity={0.45} />)}
          <g opacity={fin(f, t4)}>
            <circle cx={pA[0]} cy={pA[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={4} /><circle cx={pB[0]} cy={pB[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={4} />
          </g>
          <g opacity={fin(f, t6)}><Bracket p={[pA[0], pA[1] + 40]} q={[pB[0], pB[1] + 40]} c={C.first} off={0} w={6} /></g>
          <g opacity={fin(f, tNot)}><line x1={pA[0]} y1={pA[1] + 120} x2={pA[0] + ghostW} y2={pA[1] + 120} stroke={C.local} strokeWidth={5} strokeDasharray="14 10" /></g>
        </g>
        <rect x={B6.x} y={B6.y} width={B6.w} height={B6.h} fill="none" stroke={C.grid} strokeWidth={3} />
        <g data-lc-maplabel="1">
          <Lbl x={pA[0]} y={pA[1] - 40} t="T" c={C.key} s={T.key} a="middle" o={fin(f, t4)} />
          <Lbl x={pB[0] + 10} y={pB[1] - 40} t="T + 1 °C" c={C.key} s={T.key} a="start" o={fin(f, AT(k, 4, "one degree Celsius"))} />
          <Lbl x={(pA[0] + pB[0]) / 2} y={pA[1] + 80} t="73.8 km" c={C.first} s={T.floor} a="middle" o={fin(f, AT(k, 6, "seventy three"))} />
          <Lbl x={pA[0] + ghostW / 2} y={pA[1] + 160} t="111.2 km: not this" c={C.local} s={T.floor} a="middle" o={fin(f, tNot)} />
        </g>
      </Svg> : null}
      <Svg>
        <Keyword f={f} text="if you skipped, keep this:" at={[XC, 110]} appear={0} c={C.gold} out={t3 + 20} />
        <SideCallout f={f} lines="× 4.9" at={[XC + 14, 330]} appear={AT(k, 2, "almost five")} out={t3 + 20} target={band(LYB[0])} c={C.gold} bend={20} />
        <SideCallout f={f} lines="× 2" at={[XC + 14, 410]} appear={AT(k, 2, "two at sixty")} out={t3 + 20} target={band(60)} c={C.gold} bend={20} />
        <SideCallout f={f} lines="× 1.5" at={[XC + 14, 490]} appear={AT(k, 2, "one and a half")} out={t3 + 20} target={band(BREST[0])} c={C.gold} bend={20} />
        <Keyword f={f} text="weather data: on this grid" at={[XC, 110]} s={T.floor} appear={t3 + 40} out={t5 - 18} />
        <Keyword f={f} text="per kilometre, not per degree" at={[XC, 110]} s={T.floor} appear={t5} out={t8 - 18} />
        <Keyword f={f} text="next: The gradient" at={[XC, 775]} appear={tGr} out={tPr - 18} c={C.key} />
        <Keyword f={f} text="more: Pressure as a vertical" at={[XC, 760]} appear={tPr} c={C.key} />
        <Lbl x={XC} y={822} t="coordinate" c={C.key} s={T.key} o={fin(f, tPr + 8)} italic />
      </Svg>
      <TeX s={String.raw`x=a\,\lambda,\ \ y=a\,\varphi`} x={XC} y={200} size={60} o={win(f, t1, t3 + 20)} />
      <TeX s={String.raw`\dfrac{1\ ^\circ\text{C}}{73.8\ \text{km}}\approx 1.4\ ^\circ\text{C per }100\ \text{km}`} x={XC} y={250} size={52} o={fin(f, t7)} />
      <Layered parts={p1} x={XC} y={400} size={66} layers={[{ t: "all", o: fin(f, t8) }, { t: [], u: [1], o: fin(f, AT(k, 8, "one over the Earth")) }]} />
      <Layered parts={p2} x={XC} y={575} size={66} layers={[{ t: "all", o: fin(f, t9) }, { t: [], u: [1], o: fin(f, t9 + 20) }]} />
      <SourceBelow text={SRC_BM} pic={mapBox(V6, "pc")} w={880} o={o1} name="s06 src a" />
      <SourceBelow text="Image: NASA Blue Marble NG · coast: Natural Earth · grid: illustrative" pic={B6} w={920} o={o2} name="s06 src b" />
    </Scene>
  );
};

// ================================================================ s07 Mercator's idea: the photo stretch, strip by strip; conformal
const V7a: PV = { cx: 760, cy: 430, s: 75 }, V7b: PV = { cx: 540, cy: 470, s: 140 }, V7c: PV = { cx: 540, cy: 450, s: 140 };
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_mercator_idea");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10),
    t11 = SS(k, 11), t12 = SS(k, 12), t13 = SS(k, 13);
  const sx = 1 + 0.5 * prog(f, t2 + 10, t2 + 50), sy = 1 + 0.5 * prog(f, t3 + 30, t3 + 70);
  const faceO = fout(f, t4 + 10, 20);
  const g = prog(f, t4, t4 + 40), m = prog(f, t11, t11 + 90);
  const v = mixPV(mixPV(V7a, V7b, g), V7c, m);
  const P = (la: number, lo: number) => mapPt(v, "pc", la, lo, "mc", m);
  const strips = [{ la: BREST[0], kk: D.k.k[0], at: t5, tag: "× 1.5" }, { la: 60, kk: D.k.k[1], at: t6, tag: "× 2" }, { la: LYB[0], kk: D.k.k[2], at: t7, tag: "× 4.9" }];
  const box = (() => { const a = mapBox(v, "pc"), b = mapBox(v, "mc", 80); return { x: a.x, w: a.w, y: mix(a.y, b.y, m), h: mix(a.h, b.h, m) }; })();
  const stretchO = (at: number) => win(f, at, t8, 10) * (1 - m);
  // the Brest circle: plate-carrée oval → Mercator circle, drawn about the plate-carrée centre
  const cpc = tissotC(v, "pc", TIS.brest), cbl = tissotC(v, "pc", TIS.brest, "mc", prog(f, t10 + 10, t10 + 60));
  const ringT = prog(f, t10 + 10, t10 + 60);
  const ring = (D.tissot.ll[TIS.brest] as number[][]);
  const ringD = poly(ring[0].map((la, j) => { const q = mapPt(v, "pc", la, ring[1][j], "mc", ringT); return [q[0] - cbl[0] + cpc[0], q[1] - cbl[1] + cpc[1]] as Pt; })) + "Z";
  const zO = win(f, t8, t11 + 20, 14);
  const pBr = P(BREST[0], BREST[1]);
  return (
    <Scene>
      <Svg o={faceO}>
        <Face c={[270, 430]} sx={sx} sy={sy} r={95} />
      </Svg>
      {/* the map (plate carrée → Mercator: rasters cross-faded, coast and marks by the JS mirrors blended) */}
      <Svg>
        <defs><clipPath id="s07c"><rect x={box.x} y={box.y} width={box.w} height={box.h} /></clipPath></defs>
        <g clipPath="url(#s07c)">
          <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="#1d2a44" />
          <RasterImg v={v} name="pc" href={IMGS.pc} o={1 - m} />
          <RasterImg v={v} name="mc" href={IMGS.mc} o={m} />
          <path d={coastD(v, "pc", "mc", m, 82)} fill="none" stroke={C.key} strokeOpacity={0.5} strokeWidth={1.5} />
          {strips.map((S) => { const yc = P(S.la, 0)[1], h0 = 2.5 * D2R * v.s * 2, h = h0 * mix(1, Math.min(S.kk, 3.2), prog(f, S.at + 15, S.at + 60));
            return <rect key={S.la} x={box.x} y={yc - h / 2} width={box.w} height={h} fill={C.gold} fillOpacity={0.12} stroke={C.gold} strokeWidth={4} opacity={stretchO(S.at)} />; })}
          <g opacity={zO}>
            <path d={ringD} fill={C.gold} fillOpacity={0.35} stroke={C.gold} strokeWidth={4} />
          </g>
          <g opacity={fin(f, t12 + 30)}>
            <line x1={pBr[0]} y1={pBr[1] - 90} x2={pBr[0]} y2={pBr[1] + 90} stroke={C.local} strokeWidth={4} />
            <line x1={pBr[0] - 70} y1={pBr[1] + 70} x2={pBr[0] + 70} y2={pBr[1] - 70} stroke={C.second} strokeWidth={6} />
            <path d={poly(Array.from({ length: 12 }, (_, i) => { const a = (90 - 45 * i / 11) * D2R; return [pBr[0] + 50 * Math.cos(a), pBr[1] - 50 * Math.sin(a)] as Pt; }))} fill="none" stroke={C.gold} strokeWidth={5} />
          </g>
        </g>
        <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="none" stroke={C.grid} strokeWidth={3} />
        <Keyword f={f} text="Mercator, 1569" at={[XC, 160]} appear={0} />
        <Keyword f={f} text="like a photo …" at={[XC, 250]} appear={t1} out={t11 - 18} />
        <Keyword f={f} text="too wide" at={[XC, 330]} s={T.floor} appear={AT(k, 2, "too wide")} out={t3 - 18} />
        <Keyword f={f} text="right shape, just bigger" at={[XC, 330]} s={T.floor} appear={AT(k, 3, "right again")} out={t4 - 18} />
        <Keyword f={f} text="one strip at a time" at={[XC, 330]} s={T.floor} appear={t4} out={t8 - 18} />
        {strips.slice().reverse().map((S, i) => <SideCallout key={S.la} f={f} lines={S.tag} at={[XC + 14, 430 + 80 * i]} appear={S.at + 10} out={t8 - 18}
          target={[box.x + box.w - 30, P(S.la, 0)[1]]} c={C.gold} bend={20} />)}
        <Keyword f={f} text="oval → circle again" at={[XC, 430]} s={T.floor} appear={t10 + 20} out={t11 + 30} />
        <Keyword f={f} text="unlike a photo:" at={[XC, 250]} appear={t11} />
        <Lbl x={XC} y={315} t="each strip its own stretch" c={C.key} s={T.floor} o={fin(f, t11 + 8)} />
        <Keyword f={f} text="same angle as on the ground" at={[XC, 520]} s={T.floor} appear={AT(k, 12, "the angle at which")} c={C.gold} />
        <Keyword f={f} text="conformal" at={[XC, 650]} appear={AT(k, 13, "conformal")} c={C.gold} />
        <Lbl x={XC} y={715} t="shapes and angles right" c={C.key} s={T.floor} o={fin(f, AT(k, 13, "keep shapes") + 8)} />
        <Lbl x={XC} y={770} t="in every small patch" c={C.key} s={T.floor} o={fin(f, AT(k, 13, "keep shapes") + 16)} />
      </Svg>
      <SourceBelow text={SRC_BM} pic={{ x: 100, y: 108, w: 880, h: 684 }} w={880} gap={12} name="s07 src" />
    </Scene>
  );
};

export const SCENES_A: Record<string, React.FC> = {
  s00_title: S00, s01_hook: S01, s02_part6_recap: S02, s03_flattening: S03, s04_plate_carree: S04, s05_stretch_k: S05, s06_gradient_preview: S06, s07_mercator_idea: S07,
};
