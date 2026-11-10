// ch00_coordinates_moving scenes s00-s07: the title (series layout, remake 2026-11-07), the hook (Ciarán's 03 UTC map with a rider and a
// person on the shore), the train (x = x′ + U t) — the s02 recap of Part 4 is cut (remake 2026-11-07, master plan §C: no opening recap) —
// velocities add (D40), accelerations stay (D41) with the falling ball, the air parcel's acceleration in two frames (D42a, a 3-D
// parcel cube) and the sliding gust pattern in numbers (D42b). Numbers from data/mv.json only (movies/data/build_ch00_coordinates_moving.py).
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Bracket, Pt } from "../house/kit/draw";
import { SeriesTitle } from "./kit_mv/SeriesTitle";
import { SourceBelow } from "../house/kit/frame";
import { AnimatedWindArrow } from "../house/kit/wind";
import { CurvedLink } from "../house/kit/extras";
import { ClockGlyph } from "../house/kit/icons";
import { View3D, Rod3D, Quad3D, Arrow3D, Ball3D } from "./kit_mv/three3d";
import { V3, orbitCam, orbitPath, projector } from "./kit_mv/cam";
import {
  AT, Arrow, Axes, Barometer, BROWN, CI, CIA_MAP, CIA_PIC, CalcStack, CiaMap, D, D2R, GeoMap, HL, K, Keyword, LEN, Lbl, PLY, Person, Rider,
  SE, SRC_CIA3, SS, Scene, SideCallout, SkipChip, SpeedBar, Svg, TRK, TeX, Layered, Train, Walker, Anemometer, XC, Ax, axP, axY, boxAt, curveD, fin, fout,
  keepTime, linesPath, lin, mix, nf, prog, ringD, win, isoD, clamp,
} from "./mv_lib";
import { EQ_S02, EQ_S03, EQ_S04, EQ_S05, EQ_S06, EQ_S07, cutAt } from "./mv_eq";

const TR = D.train, SL = D.slide;
// ---------------------------------------------------------------- numbers on screen = the data (the render fails otherwise)
const CHECK_A: [string, number, number, number][] = [
  ["U", TR.U, 20, 0], ["u1", TR.u1, 1.5, 0], ["sum", TR.sum, 21.5, 0], ["g", TR.g, 9.8, 0.05], ["acc a", TR.acc[1] - TR.acc[0], 0.5, 1e-9], ["acc b", TR.acc[3] - TR.acc[2], 0.5, 1e-9],
  ["u", SL.u, 13.5, 0.05], ["slope", SL.dudx_km, 0.111, 5e-4], ["loc_g", SL.loc_g, -4.0, 0.05], ["adv_g", SL.adv_g, 5.4, 0.05], ["adv_r", SL.adv_r, 1.4, 0.05],
  ["loc_r", SL.loc_r, 0, 1e-6], ["sum g", SL.loc_g + SL.adv_g, 1.4, 0.05], ["rel kmh", (SL.u - SL.U) * 3.6, 12.7, 0.05], ["u kmh", SL.u * 3.6, 48.7, 0.05],
  ["U kmh", SL.U * 3.6, 36, 1e-9], ["k Brest", D.brest.k[2], 0.748, 5e-4],
];
CHECK_A.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

// ---------------------------------------------------------------- the train picture (s00, s03-s05): one geometry
const TY = 400;                       // rail level
const TW = 360;                       // train length (px)
const STATION = 160;                  // the station post (x = 0 of the ground ruler)
const WALK_Y = TY - 112;              // the walker's feet (on the train)
const Rails: React.FC<{ o?: number; x0?: number; x1?: number }> = ({ o = 1, x0 = 80, x1 = 1000 }) => o <= 0 ? null : (
  <g opacity={o}>
    <line x1={x0} y1={TY + 14} x2={x1} y2={TY + 14} stroke={C.local} strokeWidth={6} />
    {Array.from({ length: Math.floor((x1 - x0) / 60) + 1 }, (_, i) => <line key={i} x1={x0 + 10 + i * 60} y1={TY + 4} x2={x0 + 10 + i * 60} y2={TY + 24} stroke={C.local} strokeWidth={4} />)}
  </g>
);
const Station: React.FC<{ o?: number }> = ({ o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <line x1={STATION} y1={TY + 24} x2={STATION} y2={TY + 80} stroke={C.local} strokeWidth={8} strokeLinecap="round" />
    <rect x={STATION - 26} y={TY + 70} width={52} height={14} fill={C.local} />
  </g>
);

// ================================================================ s00 title
const TB = { x: 1150, y: 150, w: 690, h: 480 };
const TMAP = boxAt(50.2, -4.4, 6.0, TB.x, TB.y, TB.w, TB.h);
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  // remake 2026-11-07 (R1/R2, opening rule): the series title; "Coordinates" pulses on "coordinates"; Part B cross-fades on "they're used"
  const tCo = AT(k, 0, "coordinates"), tMet = AT(k, 0, "they're used");
  const oA = fout(f, tMet, 12), oB = fin(f, tMet, 12);
  // Part A: the train glides, the walker walks, the two rulers slide apart (schematic, time compressed)
  const u = lin(f, 0, tMet), xb = 1170 + 300 * u, wx = xb + 50 + 90 * u, sy = 520, ty = 470;
  // Part B: Ciarán's isobars hour by hour 23 -> 03 UTC (index 2 -> 6), the barometer at Plymouth falls (bilinear ERA5 at Plymouth, 23/00/01 UTC)
  const h = mix(2, 6, lin(f, tMet + 8, LEN(k)));
  const hp = clamp(h - 2, 0, 2), pP = hp < 1 ? mix(CI.ply.p3[0], CI.ply.p3[1], hp) : mix(CI.ply.p3[1], CI.ply.p3[2], hp - 1);
  return (
    <Scene fadeIn={false}>
      <Svg>
        <SeriesTitle f={f} concept="Coordinates" part="Part 5 · Moving frames" sub={["storm-relative winds"]} pulseAt={tCo} />
        <g opacity={oA * fin(f, 4, 10)}>
          <line x1={TB.x} y1={ty + 14} x2={TB.x + TB.w} y2={ty + 14} stroke={C.local} strokeWidth={5} />
          <Train x={xb} y={ty} w={280} />
          <Walker x={wx} y={ty - 112} s={0.8} />
          <Arrow p={[xb + 20, ty - 230]} q={[xb + 200, ty - 230]} color={C.second} w={8} head={28} />
          <Arrow p={[wx + 18, ty - 170]} q={[wx + 80, ty - 170]} color={C.first} w={7} head={24} />
          <line x1={TB.x + 20} y1={sy} x2={TB.x + TB.w - 10} y2={sy} stroke={C.local} strokeWidth={4} />
          {Array.from({ length: 7 }, (_, i) => <line key={i} x1={TB.x + 20 + i * 110} y1={sy - 12} x2={TB.x + 20 + i * 110} y2={sy + 12} stroke={C.local} strokeWidth={3} />)}
          <line x1={xb} y1={sy + 50} x2={xb + 280} y2={sy + 50} stroke={C.second} strokeWidth={4} />
          {Array.from({ length: 4 }, (_, i) => <line key={i} x1={xb + i * 90} y1={sy + 38} x2={xb + i * 90} y2={sy + 62} stroke={C.second} strokeWidth={3} />)}
        </g>
      </Svg>
      <GeoMap id="s00m" B={TMAP} o={oB} frame={0.6} over={(P) => <Barometer x={P(PLY[0], PLY[1])[0]} y={P(PLY[0], PLY[1])[1] - 40} r={30} hPa={pP} />}>
        {(P) => <>
          <path d={linesPath(P, CI.coast)} fill="none" stroke={C.key} strokeOpacity={0.8} strokeWidth={2} />
          <path d={isoD(P, CI.frames[Math.round(h)].iso)} fill="none" stroke={C.key} strokeWidth={2.4} opacity={0.9} />
          {TRK.slice(0, Math.floor(h) + 1).map((t, i) => <circle key={i} cx={P(t[1], t[2])[0]} cy={P(t[1], t[2])[1]} r={7} fill={C.gold} stroke={C.bg} strokeWidth={3} />)}
          <path d={ringD(P)} fill="none" stroke={C.first} strokeWidth={4} opacity={clamp(h - 5, 0, 1)} />
          {(() => { const c0 = P(TRK[3][1], TRK[3][2]), a = CI.brg * D2R; return <Arrow p={c0} q={[c0[0] + Math.sin(a) * 150, c0[1] - Math.cos(a) * 150]} color={C.second} w={8} head={28} />; })()}
        </>}
      </GeoMap>
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 2 Nov 2023" pic={TB} w={690} o={oB} name="s00 src" />
    </Scene>
  );
};

// ================================================================ s01 hook: riding along vs standing still
const HK = CI.hook;
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  const tQ = SS(k, 1), tPart = SS(k, 2), tMF = SS(k, 3), tReal = SS(k, 4);
  const h = mix(3, 6, prog(f, 12, SE(k, 0)));
  const hi = Math.floor(h), w = h - hi, cl = TRK[Math.min(9, hi + 1)], c0 = TRK[hi];
  return (
    <Scene>
      <CiaMap f={f} h={h} parts={0.8}>
        {(P) => {
          const cc = P(mix(c0[1], cl[1], w), mix(c0[2], cl[2], w)), pc = P(HK.ll[0], HK.ll[1]), s = 6;
          return <>
            <path d={ringD(P)} fill="none" stroke={C.first} strokeWidth={4} opacity={fin(f, tQ) * 0.9} />
            <Rider x={cc[0]} y={cc[1]} s={0.9} />
            <Person x={pc[0] - 40} y={pc[1] + 6} s={0.8} />
            <g opacity={fin(f, tQ + 10)}>
              <AnimatedWindArrow from={pc} to={[pc[0] + HK.g[0] * s, pc[1] - HK.g[1] * s]} speed={Math.hypot(HK.g[0], HK.g[1])} f={f} c={C.local} px={7} head={24} />
              <AnimatedWindArrow from={pc} to={[pc[0] + HK.s[0] * s, pc[1] - HK.s[1] * s]} speed={Math.hypot(HK.s[0], HK.s[1])} f={f} c={C.key} px={7} head={24} />
            </g>
          </>;
        }}
      </CiaMap>
      <Svg>
        <Keyword f={f} text="riding along" at={[XC, 180]} appear={0} c={C.second} />
        <Keyword f={f} text="standing still" at={[XC, 270]} appear={0} c={C.local} />
        <Lbl x={XC + 470} y={225} t="?" c={C.gold} s={T.calc} o={fin(f, tQ)} />
        <Keyword f={f} text="part 5 of 7" at={[XC, 400]} appear={tPart} s={T.floor} />
        <Keyword f={f} text="moving frames" at={[XC, 490]} appear={tMF} c={C.gold} />
        <Keyword f={f} text="a real storm · a barometer" at={[XC, 580]} appear={tReal} s={T.floor} />
        <SpeedBar x={XC} y={770} />
      </Svg>
      <SourceBelow text={SRC_CIA3} pic={CIA_PIC} w={920} name="s01 src" />
    </Scene>
  );
};

// ================================================================ s03 the train: x = x′ + U t
const trainAt = (f: number, a: number, b: number) => ({ xb: mix(100, 460, lin(f, a, b)), xw: mix(60, 180, lin(f, a, b)) });
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_train");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11);
  const m = trainAt(f, t1, SE(k, 11)), xb = m.xb, wx = xb + m.xw;
  const clockH = 12 * lin(f, t1, SE(k, 11));
  const eq3 = cutAt(EQ_S03, String.raw`,\qquad `);
  return (
    <Scene>
      <Svg>
        <Rails />
        <Station o={fin(f, t5)} />
        <Lbl x={STATION} y={TY + 120} t="station" c={C.local} s={T.floor} a="middle" o={fin(f, t5)} />
        <Train x={xb} y={TY} w={TW} />
        <Walker x={wx} y={WALK_Y} s={0.9} o={fin(f, t2 - 20)} />
        <Arrow p={[xb + 30, TY - 260]} q={[xb + 300, TY - 260]} color={C.second} o={fin(f, t1)} />
        <Arrow p={[wx + 20, WALK_Y - 40]} q={[wx + 100, WALK_Y - 40]} color={C.first} w={8} head={28} o={fin(f, t2)} />
        <Person x={930} y={TY + 80} s={0.9} o={fin(f, 0)} />
        {/* the two rulers: x from the station (slate), x′ from the back of the train (orange, rides with the train) */}
        <g opacity={fin(f, t6)}>
          <line x1={STATION} y1={560} x2={1000} y2={560} stroke={C.local} strokeWidth={4} />
          {Array.from({ length: 11 }, (_, i) => <line key={i} x1={STATION + i * 80} y1={546} x2={STATION + i * 80} y2={574} stroke={C.local} strokeWidth={i ? 3 : 6} />)}
        </g>
        <g opacity={fin(f, t7)}>
          <line x1={xb} y1={TY + 40} x2={xb + TW} y2={TY + 40} stroke={C.second} strokeWidth={4} />
          {Array.from({ length: 5 }, (_, i) => <line key={i} x1={xb + i * 90} y1={TY + 28} x2={xb + i * 90} y2={TY + 52} stroke={C.second} strokeWidth={i ? 3 : 6} />)}
        </g>
        <Bracket p={[STATION, 620]} q={[xb, 620]} c={C.gold} o={fin(f, t9)} />
        <Bracket p={[xb, 620]} q={[wx, 620]} c={C.first} o={fin(f, AT(k, 10, "plus your distance"))} />
        <Bracket p={[STATION, 700]} q={[wx, 700]} c={C.key} o={fin(f, AT(k, 10, "x equals"))} />
        <g opacity={fin(f, t11)}>
          <ClockGlyph x={300} y={TY + 100} r={26} h={clockH} />
          <ClockGlyph x={xb + TW - 50} y={TY - 62} r={26} h={clockH} />
        </g>
        <Keyword f={f} text="the simplest moving frame" at={[XC, 120]} appear={0} out={t1 - 18} s={T.floor} />
        <Keyword f={f} text="why do the speeds add?" at={[XC, 400]} appear={t4} out={t6 - 18} s={T.floor} />
        <Keyword f={f} text="$x$: from the station" at={[XC, 400]} appear={t6} s={T.floor} c={C.local} />
      </Svg>
      {/* Part 1 lessons C1: x′ set in KaTeX (a prime in the sans keyword is not maths) */}
      <TeX s={String.raw`x'\text{: from the back of the train}`} x={XC} y={470} size={T.floor} c={C.second} o={fin(f, t7)} />
      <TeX s={String.raw`U\,t`} x={(STATION + xb) / 2} y={668} size={48} c={C.gold} ax={0.5} o={fin(f, t9)} />
      <TeX s={String.raw`x'`} x={(xb + wx) / 2} y={668} size={48} c={C.first} ax={0.5} o={fin(f, AT(k, 10, "plus your distance"))} />
      <TeX s="x" x={(STATION + wx) / 2} y={748} size={48} c={C.key} ax={0.5} o={fin(f, AT(k, 10, "x equals"))} />
      <TeX s={String.raw`t`} x={345} y={TY + 100} size={48} c={C.local} ax={0} o={fin(f, t11)} halo />
      <TeX s={String.raw`t'`} x={xb + TW - 90} y={TY - 62} size={48} c={C.second} ax={1} o={fin(f, t11)} halo />
      {/* Must 12: the walker's tag and every calc in the column x ≥ 1100 */}
      <TeX s={String.raw`U=20\ \text{m/s}`} x={XC} y={120} size={56} c={C.second} o={fin(f, AT(k, 1, "twenty metres"))} />
      <TeX s={String.raw`u'=1.5\ \text{m/s}`} x={XC} y={200} size={56} c={C.first} o={fin(f, AT(k, 2, "one and a half"))} />
      <CalcStack f={f} x={XC} y={250} size={56} rows={[{ rhs: String.raw`20+1.5=21.5\ \text{m/s}`, at: AT(k, 3, "twenty one and a half") }]} />
      <TeX s={eq3[0]} x={XC} y={640} size={64} o={fin(f, AT(k, 10, "x equals"))} />
      <TeX s={eq3[1]} x={XC + 430} y={640} size={64} o={fin(f, AT(k, 11, "t prime equals t"))} />
      <Svg><Lbl x={XC} y={760} t="both clocks: the same time" c={C.key} s={T.floor} o={fin(f, t11 + 20)} /></Svg>
    </Scene>
  );
};

// ================================================================ s04 velocities add (D40), skip chip A
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = K("s04_velocities_add");
  const t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11), t12 = SS(k, 12);
  const mv = prog(f, AT(k, 4, "the back of the train moves on"), AT(k, 4, "the back of the train moves on") + 60);
  const xb = mix(460, 580, mv), xw = mix(180, 260, mv), wx = xb + xw;
  const w1 = 460 + 180, w2 = 580 + 260;
  const eq = cutAt(EQ_S04, String.raw`\qquad\Longrightarrow\qquad `);
  return (
    <Scene>
      <Svg>
        <Rails />
        <Station />
        <g opacity={0.55 * fin(f, t4 + 10)}>
          <rect x={460} y={TY - 110} width={TW} height={96} rx={18} fill="none" stroke={C.local} strokeWidth={3} strokeDasharray="10 8" />
          <Walker x={w1} y={WALK_Y} s={0.9} c={C.local} />
        </g>
        <Train x={xb} y={TY} w={TW} />
        <Walker x={wx} y={WALK_Y} s={0.9} />
        <Person x={960} y={TY + 80} s={0.9} />
        <Bracket p={[w1, 620]} q={[w1 + 120, 620]} c={C.gold} o={fin(f, t5)} />
        <Bracket p={[w1 + 120, 620]} q={[w2, 620]} c={C.first} o={fin(f, t5)} />
        <Bracket p={[w1, 700]} q={[w2, 700]} c={C.key} o={fin(f, t5)} />
        <Keyword f={f} text="two short derivations" at={[XC, 120]} appear={0} out={t3 - 18} s={T.floor} />
        <Keyword f={f} text="speeds from positions" at={[XC, 120]} appear={t3} s={T.floor} />
        <Keyword f={f} text="Galilean transformation" at={[XC, 560]} appear={AT(k, 11, "Galilean transformation")} c={C.gold} />
        <SkipChip f={f} k={k} to={keepTime("s05_accel_same")} />
      </Svg>
      <TeX s={String.raw`U\,\Delta t`} x={w1 + 60} y={665} size={46} c={C.gold} ax={0.5} o={fin(f, t5)} />
      <TeX s={String.raw`\Delta x'`} x={w1 + 160} y={575} size={46} c={C.first} ax={0.5} o={fin(f, t5)} />
      <TeX s={String.raw`\Delta x`} x={(w1 + w2) / 2} y={745} size={46} c={C.key} ax={0.5} o={fin(f, t5)} />
      <CalcStack f={f} x={XC} y={190} size={52} maxLines={3} rows={[
        { rhs: String.raw`\Delta x=\Delta x'+U\,\Delta t`, at: AT(k, 5, "delta x equals") },
        { rhs: String.raw`\dfrac{\Delta x}{\Delta t}=\dfrac{\Delta x'}{\Delta t}+U\ \Rightarrow\ u=u'+U`, at: t6, h: 130 },
        { rhs: String.raw`u=1.5+20=21.5\ \text{m/s}`, at: AT(k, 10, "twenty one and a half") },
      ]} />
      <TeX s={String.raw`\Delta x/\Delta t=u`} x={XC} y={440} size={48} c={C.local} o={win(f, SS(k, 7), t9 - 18)} />
      <TeX s={String.raw`\Delta x'/\Delta t=u'`} x={XC + 330} y={440} size={48} c={C.first} o={win(f, SS(k, 8), t9 - 18)} />
      <TeX s={`${eq[0]}\\qquad\\Longrightarrow`} x={XC} y={660} size={64} o={fin(f, t12)} />
      <TeX s={eq[1]} x={XC} y={750} size={64} o={fin(f, AT(k, 12, "bold v equals"))} />
    </Scene>
  );
};

// ================================================================ s05 accelerations stay the same (D41), the falling ball, the takeaway
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = K("s05_accel_same");
  const t1 = SS(k, 1), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11), t12 = SS(k, 12), t13 = SS(k, 13), t14 = SS(k, 14);
  const parts = [
    { t: String.raw`\dfrac{du}{dt}=` }, { t: String.raw`\dfrac{dU}{dt}`, x: C.neg, u: { w: String.raw`=0,\ U\ \text{steady}`, c: C.gold } }, { t: String.raw`+\dfrac{du'}{dt}` },
    { t: String.raw`=\dfrac{du'}{dt}`, c: C.gold },
  ];
  if (parts.map((p) => p.t).join("").replace(/\s/g, "") !== EQ_S05.replace(/\s/g, "")) throw new Error("s05 parts drift from EQ_S05");
  const drop = lin(f, t12 + 20, t12 + 110);
  const ft = drop * 1.4;                              // illustrative: 1.4 s of fall in 3 s of screen
  const yb = (t: number) => 610 + 0.5 * 9.81 * t * t * 18;
  return (
    <Scene>
      <Svg>
        <Rails x0={80} x1={1000} />
        <Train x={200} y={TY} w={TW} />
        <Walker x={350} y={WALK_Y} s={0.9} />
        <Person x={880} y={TY + 80} s={0.9} />
        <Lbl x={350} y={WALK_Y - 140} t="1.5 → 2.0 m/s" c={C.first} s={T.floor} a="middle" o={win(f, AT(k, 11, "one and a half to two"), t12 - 18)} />
        <Lbl x={980} y={TY + 280} t="21.5 → 22.0 m/s" c={C.local} s={T.floor} a="end" o={win(f, AT(k, 11, "twenty one and a half to twenty two"), t12 - 18)} />
        {/* the ball: straight down for the rider (left), a curve for the person beside the track (right); the same 9.8 m/s² arrow */}
        <g opacity={fin(f, t12)}>
          <Lbl x={300} y={550} t="on the train" c={C.second} s={T.floor} a="middle" />
          <Lbl x={200} y={610} t="from the ground" c={C.local} s={T.floor} a="start" />
          {[0.35, 0.7, 1.0].filter((q) => q <= drop + 1e-9).map((q) => <circle key={q} cx={300} cy={yb(q * 1.4)} r={10} fill={C.key} opacity={0.5} />)}
          <circle cx={300} cy={yb(ft)} r={15} fill={C.key} stroke={C.bg} strokeWidth={3} />
          <Arrow p={[340, yb(ft) - 20]} q={[340, yb(ft) + 70]} color={BROWN} w={8} head={26} />
          <path d={Array.from({ length: 21 }, (_, i) => { const t = (i / 20) * ft; return `${i ? "L" : "M"}${(640 + t * 170).toFixed(1)} ${yb(t).toFixed(1)}`; }).join("")} fill="none" stroke={C.key} strokeWidth={4} strokeDasharray="10 8" />
          <circle cx={640 + ft * 170} cy={yb(ft)} r={15} fill={C.key} stroke={C.bg} strokeWidth={3} />
          <Arrow p={[680 + ft * 170, yb(ft) - 20]} q={[680 + ft * 170, yb(ft) + 70]} color={BROWN} w={8} head={26} />
        </g>
        <Keyword f={f} text="accelerations?" at={[XC, 120]} appear={0} out={t3 - 18} />
        <Keyword f={f} text="the same in both frames" at={[XC, 690]} appear={AT(k, 10, "the acceleration is the same")} out={t11 - 18} c={C.gold} s={T.floor} />
        <Keyword f={f} text="9.8 m/s² down: same for both" at={[XC, 690]} appear={AT(k, 12, "nine point eight")} out={t13 - 18} c={BROWN} s={T.floor} />
        <Keyword f={f} text="same forces in both frames" at={[XC, 690]} appear={t13} out={t14 - 18} s={T.floor} />
        <Keyword f={f} text="what to keep" at={[XC, 690]} appear={t14} c={C.gold} />
        <Lbl x={XC} y={770} t="speeds: shift by the frame's speed" c={C.key} s={T.floor} o={fin(f, AT(k, 14, "speeds change"))} />
        <Lbl x={XC} y={835} t="accelerations, forces: the same" c={C.key} s={T.floor} o={fin(f, AT(k, 14, "but accelerations"))} />
      </Svg>
      {/* Part 1 lessons B4: the keep line's own picture: the derivation rows leave; the speeds in the two frames (they differ by U) come
          back over the walker and the person beside the track, while the two falling balls keep the same 9.8 m/s² arrow */}
      <TeX s={String.raw`u'=1.5\ \text{m/s}`} x={350} y={WALK_Y - 140} size={T.floor} c={C.first} ax={0.5} o={fin(f, AT(k, 14, "speeds change"))} halo />
      <TeX s={String.raw`u=20+1.5=21.5\ \text{m/s}`} x={980} y={TY + 140} size={T.floor} c={C.local} ax={1} o={fin(f, AT(k, 14, "speeds change"))} halo />
      <CalcStack f={f} x={XC} y={150} size={52} maxLines={3} o={fout(f, t14 - 12)} rows={[
        { rhs: String.raw`u=U+u'`, at: AT(k, 3, "u equals") },
        { rhs: String.raw`u+\Delta u=(U+\Delta U)+(u'+\Delta u')`, at: t4 + 40, size: 48 },
        { rhs: String.raw`\Rightarrow\ \Delta u=\Delta U+\Delta u'`, at: t5 },
        { rhs: String.raw`\dfrac{\Delta u}{\Delta t}=\dfrac{\Delta U}{\Delta t}+\dfrac{\Delta u'}{\Delta t}`, at: t6, h: 120 },
      ]} />
      <Layered parts={parts} x={XC} y={545} size={64} ax={0.5} o={fout(f, t14 - 12)} layers={[{ t: [0, 1, 2], o: fin(f, t8) }, { t: [], x: [1], u: [1], o: fin(f, AT(k, 9, "is zero")) },
        { t: [3], o: fin(f, AT(k, 10, "So d u by d t equals")) }]} />
      <TeX s={String.raw`+0.5\ \text{m/s in 1 s}`} x={XC} y={690} size={52} c={C.gold} o={win(f, AT(k, 11, "in the same second"), t12 - 18)} />
    </Scene>
  );
};

// ================================================================ s06 the air parcel's acceleration in two frames (D42a)
const V3BOX = { x: 80, y: 40, w: 920, h: 530 };
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = K("s06_parcel_accel");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10),
    t11 = SS(k, 11), t12 = SS(k, 12), t13 = SS(k, 13), t14 = SS(k, 14);
  const o3 = orbitPath([{ f: 0, az: -62, el: 28, dist: 13, target: [0, 0, 0.6] }, { f: LEN(k) + 10, az: -40, el: 32, dist: 12, target: [0, 0, 0.6] }], f);
  const st = orbitCam(o3, [V3BOX.w / 2, V3BOX.h / 2]);
  const pr = projector(st, V3BOX.w, V3BOX.h, V3BOX.x, V3BOX.y);
  const px = mix(-3.2, 3.2, lin(f, 0, LEN(k)));                  // the parcel drifts east with its wind (illustrative)
  const rx = mix(-3.6, 2.4, lin(f, 0, LEN(k)));                  // the rider glides at U (slower than the parcel)
  const cube = (c: V3, s: number): V3[] => [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]].map((v) => [c[0] + v[0] * s, c[1] + v[1] * s, c[2] + v[2] * s] as V3);
  const P8 = cube([px, 0, 1.2], 0.55);
  const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  const F6 = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
  const pc = pr.p([px, 0, 1.2]);
  const lhs = [
    { t: String.raw`\dfrac{\partial\mathbf v}{\partial t}`, u: { w: String.raw`\text{local}`, c: C.local } }, { t: String.raw`+(\mathbf v\cdot\nabla)\mathbf v`, u: { w: String.raw`\text{advection}`, c: C.first } },
    { t: "=" }, { t: String.raw`\dfrac{\partial\mathbf v'}{\partial t'}`, u: { w: String.raw`\text{local}`, c: C.local } }, { t: String.raw`+(\mathbf v'\cdot\nabla')\mathbf v'`, u: { w: String.raw`\text{advection}`, c: C.first } },
  ];
  if (lhs.map((p) => p.t).join("").replace(/\s/g, "") !== EQ_S06.replace(/\s/g, "")) throw new Error("s06 parts drift from EQ_S06");
  const dT = [
    { t: String.raw`\dfrac{DT}{Dt}=` }, { t: String.raw`\dfrac{\partial T}{\partial t}`, u: { w: String.raw`\text{one fixed place}`, c: C.local } }, { t: String.raw`+\mathbf v\cdot\nabla T`, u: { w: String.raw`\text{advection}`, c: C.first } },
  ];
  if (dT.map((p) => p.t).join("").replace(/\s/g, "") !== EQ_S02.replace(/\s/g, "")) throw new Error("s06 parts drift from EQ_S02");
  return (
    <Scene>
      <View3D st={st} x={V3BOX.x} y={V3BOX.y} w={V3BOX.w} h={V3BOX.h}>
        <Quad3D pts={[[-5, -2.4, 0], [5, -2.4, 0], [5, 2.4, 0], [-5, 2.4, 0]]} color="#2a3550" o={0.4} own="s06grnd" />
        {[-4, -2, 0, 2, 4].map((x) => <Rod3D key={`x${x}`} a={[x, -2.4, 0.01]} b={[x, 2.4, 0.01]} color={C.grid} px={2} />)}
        {[-2, 0, 2].map((y) => <Rod3D key={`y${y}`} a={[-5, y, 0.01]} b={[5, y, 0.01]} color={C.grid} px={2} />)}
        {F6.map((q, i) => <Quad3D key={i} pts={q.map((j) => P8[j])} color={C.first} o={0.16} />)}
        {E.map(([a, b], i) => <Rod3D key={`e${i}`} a={P8[a]} b={P8[b]} color={C.first} px={4} />)}
        <Arrow3D from={[px + 0.6, 0, 1.2]} to={[px + 2.0, 0, 1.2]} color={C.first} px={8} head={28} />
        <Rod3D a={[0.6, 1.6, 0]} b={[0.6, 1.6, 1.6]} color={C.local} px={5} />
        <Ball3D at={[0.6, 1.6, 1.62]} color={C.local} px={16} />
        <Ball3D at={[rx, -1.6, 0.3]} color={C.second} px={20} o={fin(f, t11)} />
        <Arrow3D from={[rx + 0.3, -1.6, 0.3]} to={[rx + 1.4, -1.6, 0.3]} color={C.second} px={7} head={24} o={fin(f, t11)} />
      </View3D>
      <Svg>
        <Keyword f={f} text="air parcel" at={[XC, 110]} appear={0} out={Math.min(t2, AT(k, 1, "derivatives movie")) - 18} targets={[pc]} />
        {/* remake 2026-11-07 (R16): the recalled equation's source, under its underbraces, until "put u in place of T" */}
        <Lbl x={XC} y={312} t="from the derivatives movie" c={C.gold} s={T.floor} o={win(f, AT(k, 1, "derivatives movie"), AT(k, 5, "put u in place of T") - 12)} />
        <g data-lc-own="s06grnd"><Lbl x={pr.p([0.6, 1.6, 0])[0] + 20} y={pr.p([0.6, 1.6, 0])[1] + 30} t="fixed place" c={C.local} s={T.floor} o={win(f, t3, t9 - 18)} /></g>
        <Keyword f={f} text="T → u" at={[XC, 360]} appear={AT(k, 5, "put u in place of T")} out={t9 - 18} c={C.gold} />
        <Keyword f={f} text="the same for v and w" at={[XC, 560]} appear={t7} out={t9 - 18} s={T.floor} />
        <Keyword f={f} text="acceleration = local + advection" at={[XC, 630]} appear={t8 + 10} out={t9 - 18} s={T.floor} c={C.gold} />
        <g data-lc-own="s06grnd"><Lbl x={450} y={590} t="someone on the ground" c={C.local} s={T.floor} a="middle" o={fin(f, t10)} /></g>
        <Lbl x={1380} y={590} t="a rider, moving at U" c={C.second} s={T.floor} a="middle" o={fin(f, t11)} />
        <Keyword f={f} text="the same acceleration" at={[XC, 140]} appear={t12} out={t13 - 18} c={C.gold} />
        <Keyword f={f} text="but each piece can differ" at={[XC, 140]} appear={t13} c={C.key} />
        <Keyword f={f} text="let's see it with numbers" at={[XC, 230]} appear={t14} s={T.floor} />
      </Svg>
      <Layered parts={dT} x={XC} y={150} size={64} layers={[{ t: "all", o: win(f, t2, t9 - 18) }, { t: [], u: [1], o: win(f, t3, t9 - 18) }, { t: [], u: [2], o: win(f, t4, t9 - 18) }]} />
      <TeX s={String.raw`\dfrac{Du}{Dt}=\dfrac{\partial u}{\partial t}+\mathbf v\cdot\nabla u`} x={XC} y={460} size={60} o={win(f, t6, t9 - 18)} />
      <Layered parts={lhs} x={960} y={740} size={64} ax={0.5} layers={[{ t: "all", o: fin(f, t9) }, { t: [], u: [0, 1, 3, 4], o: fin(f, t13) }]} />
    </Scene>
  );
};

// ================================================================ s07 the sliding gust pattern (D42b)
const GA: Ax = { x: 200, y: 110, w: 760, h: 330, xr: [-100, 300], yr: [0, 16] };
const TG: Ax = { x: 1190, y: 640, w: 300, h: 150, xr: [0, 1], yr: [6, 16] };
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_sliding_pattern");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11),
    t12 = SS(k, 12), t13 = SS(k, 13), t14 = SS(k, 14), t15 = SS(k, 15), t16 = SS(k, 16);
  // the pattern arrives (slides 36 km = one hour in a few seconds while S2 says so), then is frozen at the moment of S3
  const sh = -36 * (1 - lin(f, t1 + 10, SE(k, 1)));                  // km offset of the pattern (0 at the moment)
  // u(x) at t = 0 sampled 0-400 km (two wavelengths, periodic) by the builder; the pattern shifted east by s km is u(x − s)
  const xs = SL.x_km as number[], prof = SL.prof as number[], dx = xs[1] - xs[0];
  const uAt = (x: number) => { const q = (((x % 400) + 400) % 400) / dx, i = Math.floor(q), w = q - i; return prof[i] + (prof[Math.min(prof.length - 1, i + 1)] - prof[i]) * w; };
  const profAt = (s: number) => { const X = Array.from({ length: 201 }, (_, i) => GA.xr[0] + i * 2); return { X, Y: X.map((x) => uAt(x - s)) }; };
  const now = profAt(sh), ghost = profAt(36 * lin(f, t9 + 10, SE(k, 9)));
  const P = axP(GA), x0 = 25, p0 = P(x0, SL.u);
  const sl = (GA.h / 16) * SL.dudx_km / (GA.w / 400);            // tangent slope in px per px
  const tg0: Pt = [p0[0] - 50, p0[1] + 50 * sl], tg1: Pt = [p0[0] + 50, p0[1] - 50 * sl];
  const hr = lin(f, t9 + 10, SE(k, 9));                              // the one-hour time graph is drawn with the ghost
  const th = SL.th as number[], an = SL.anem as number[], pa = SL.parc as number[];
  const upto = (arr: number[]) => th.map((t, i) => [t, arr[i]] as [number, number]).filter(([t]) => t <= hr + 1e-9);
  const GX = { lab: 130, r: 600, g: 840 }, GY = { h: 585, loc: 655, adv: 730, sum: 815 };
  const val = (x: number, y: number, t: string, c: string, a: number) => <Lbl x={x} y={y} t={t} c={c} s={T.key} a="middle" o={fin(f, a)} />;
  return (
    <Scene>
      <Svg>
        <Axes A={GA} xt={[-100, 0, 100, 200, 300]} yt={[5, 10, 15]} xl="km east" yl="wind (m/s)" />
        <path d={curveD(GA, ghost.X, ghost.Y)} fill="none" stroke={C.local} strokeWidth={4} strokeDasharray="12 8" opacity={win(f, t9 + 10, t13 - 18)} />
        <path d={curveD(GA, now.X, now.Y)} fill="none" stroke={C.first} strokeWidth={7} />
        <circle cx={p0[0]} cy={p0[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, t2)} />
        <line x1={tg0[0]} y1={tg0[1]} x2={tg1[0]} y2={tg1[1]} stroke={C.gold} strokeWidth={6} opacity={fin(f, AT(k, 2, "getting stronger"))} />
        <Anemometer x={p0[0]} y={GA.y + GA.h} s={0.8} spin={f / 25} o={fin(f, t8)} />
        <Rider x={p0[0] + 60} y={GA.y + GA.h - 6} s={0.8} o={fin(f, t3)} />
        {/* the three-row grid (house s19d pattern): local, advection, sum for the rider and the ground, m/s per hour */}
        <g opacity={fin(f, t4)}>
          <Lbl x={GX.lab} y={GY.h} t="m/s per hour" c={C.muted} s={T.floor} b={false} />
          <Lbl x={GX.r} y={GY.h} t="rider" c={C.second} s={T.floor} a="middle" />
          <Lbl x={GX.g} y={GY.h} t="ground" c={C.local} s={T.floor} a="middle" o={fin(f, t8)} />
          <Lbl x={GX.lab} y={GY.loc} t="local" c={C.key} s={T.floor} />
          <Lbl x={GX.lab} y={GY.adv} t="advection" c={C.key} s={T.floor} />
          <Lbl x={GX.lab} y={GY.sum} t="sum" c={C.key} s={T.floor} />
          <line x1={GX.lab} y1={772} x2={980} y2={772} stroke={C.muted} strokeWidth={3} />
        </g>
        {val(GX.r, GY.loc, "0", C.key, AT(k, 4, "local change is zero"))}
        {val(GX.r, GY.adv, "+1.4", C.first, AT(k, 7, "plus one point four"))}
        {val(GX.g, GY.loc, "−4.0", C.neg, AT(k, 10, "minus four point zero"))}
        {val(GX.g, GY.adv, "+5.4", C.first, AT(k, 11, "plus five point four"))}
        {val(GX.r, GY.sum, "+1.4", C.gold, AT(k, 12, "gives plus one point four"))}
        {val(GX.g, GY.sum, "+1.4", C.gold, AT(k, 12, "gives plus one point four"))}
        {/* callouts ordered like their targets (the tangent's end is above the point): links never cross */}
        <SideCallout f={f} lines="0.111 m/s per km" at={[XC + 40, 110]} appear={AT(k, 2, "zero point one one one")} target={[tg1[0] + 8, tg1[1]]} s={T.floor} c={C.gold} bend={20} />
        <SideCallout f={f} lines="13.54 m/s" at={[XC + 40, 190]} appear={AT(k, 2, "thirteen point five four")} target={[p0[0] + 16, p0[1] + 4]} s={T.floor} c={C.first} bend={-20} />
        <Keyword f={f} text="a sliding gust pattern" at={[XC, 600]} appear={0} out={t2 - 18} s={T.floor} />
        <Keyword f={f} text="1. ride with the pattern" at={[XC, 668]} appear={t3} out={t8 - 18} s={T.floor} c={C.second} />
        <Keyword f={f} text="2. stand on the ground" at={[XC, 580]} appear={t8} out={t13 - 18} s={T.floor} c={C.local} />
        <Keyword f={f} text="pieces differ, the sum doesn't" at={[XC, 560]} appear={t13} out={t14 - 18} s={T.floor} c={C.gold} />
        <Keyword f={f} text="steady, straight frames only" at={[XC, 560]} appear={t14} out={t15 - 18} s={T.floor} />
        <Keyword f={f} text="turning frames add Coriolis" at={[XC, 560]} appear={t15} out={t16 - 18} s={T.floor} />
        <Keyword f={f} text="later: the material derivative" at={[XC, 560]} appear={t16} s={T.floor} />
        {/* one hour at the fixed place (anemometer, slate dashed) and following the parcel (teal) */}
        <g opacity={fin(f, t9 + 10)}>
          <Axes A={TG} xt={[0, 1]} yt={[8, 12, 16]} xf={(v) => `${v} h`} />{/* lint-ok: "h" is the unit hours on the time axis, not a variable */}
          <path d={poly2(upto(an).map(([t, v]) => axP(TG)(t, v)))} fill="none" stroke={C.local} strokeWidth={5} strokeDasharray="12 8" />
          <path d={poly2(upto(pa).map(([t, v]) => axP(TG)(t, v)))} fill="none" stroke={C.first} strokeWidth={5} />
          <Lbl x={TG.x + TG.w + 16} y={axY(TG)(an[an.length - 1])} t="anemometer" c={C.local} s={T.floor} o={fin(f, SE(k, 9))} />
          <Lbl x={TG.x + TG.w + 16} y={axY(TG)(pa[pa.length - 1])} t="parcel" c={C.first} s={T.floor} o={fin(f, SE(k, 9))} />
        </g>
      </Svg>
      {/* audit E2: where 13.54 and 0.111 come from (the pattern's formula at x = 25 km; Part 2's slope of a sine) */}
      <CalcStack f={f} x={XC} y={250} size={44} maxLines={3} o={fout(f, t5 - 12)} rows={[
        { rhs: String.raw`u=10+5\sin(2\pi x/200\ \text{km})`, at: t2 },
        { rhs: String.raw`x=25\ \text{km}:\ \ 10+5\sin45^\circ`, at: t2 + 25 },
        { rhs: String.raw`=10+3.54=13.54\ \text{m/s}`, at: AT(k, 2, "thirteen point five four"), cont: true, glow: HL(f, AT(k, 2, "thirteen point five four")) },
        { rhs: String.raw`\text{slope of }\sin(kx)\text{ is }k\cos(kx)`, at: AT(k, 2, "getting stronger"), c: C.muted },
        { rhs: String.raw`5\times\dfrac{2\pi}{200}\times\cos45^\circ`, at: AT(k, 2, "getting stronger") + 25 },
        { rhs: String.raw`\approx0.111\ \dfrac{\text{m/s}}{\text{km}}`, at: AT(k, 2, "zero point one one one"), cont: true, glow: HL(f, AT(k, 2, "zero point one one one")) },
      ]} />
      <CalcStack f={f} x={XC} y={270} size={44} maxLines={2} o={fout(f, t13 - 18)} rows={[
        { rhs: String.raw`u'=13.54-10=3.54\ \text{m/s}`, at: AT(k, 5, "the wind's speed minus") },
        { rhs: String.raw`3.54\times3.6\approx12.7\ \text{km/h}`, at: AT(k, 5, "twelve point seven"), cont: true },
        { rhs: String.raw`\text{adv.}=12.7\times0.111\approx+1.4`, at: AT(k, 6, "so the advection is") },
        { rhs: String.raw`\dfrac{\text{km}}{\text{h}}\times\dfrac{\text{m/s}}{\text{km}}=\dfrac{\text{m/s}}{\text{h}}`, at: AT(k, 6, "so the advection is") + 30, c: C.muted, cont: true },
        { rhs: String.raw`U=10\ \text{m/s}`, at: AT(k, 9, "thirty six kilometres per hour") - 20 },
        { rhs: String.raw`10\times3.6=36\ \text{km/h}`, at: AT(k, 9, "thirty six kilometres per hour"), cont: true },
        { rhs: String.raw`\text{local}=-36\times0.111\approx-4.0`, at: AT(k, 10, "minus the pattern's speed") },
        { rhs: String.raw`13.54\times3.6\approx48.7\ \text{km/h}`, at: AT(k, 11, "forty eight point seven") - 15 },
        { rhs: String.raw`\text{adv.}=48.7\times0.111\approx+5.4`, at: AT(k, 11, "plus five point four"), cont: true },
        { rhs: String.raw`\text{sum}=-4.0+5.4=+1.4`, at: AT(k, 12, "Adding the local change") },
      ]} />
      <TeX s={EQ_S07} x={XC} y={380} size={46} o={fin(f, t13)} />
    </Scene>
  );
};
const poly2 = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");

export const SCENES_A: Record<string, React.FC> = {
  s00_title: S00, s01_hook: S01, s03_train: S03, s04_velocities_add: S04, s05_accel_same: S05, s06_parcel_accel: S06,
  s07_sliding_pattern: S07,
};
void [CurvedLink, CIA_MAP, nf];
