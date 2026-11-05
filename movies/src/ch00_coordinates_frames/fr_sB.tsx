// ch00_coordinates_frames scenes s10-s19: the coast frame (SW Florida; the bearing 329° from two Natural Earth coast points; α =
// 121°; Ian's HRRR 20 UTC wind split along and across), the arrows turning as you move (plane from above the pole), Part 2's
// turning rules, the plan (which motion turns which arrow), and Di/Dt derived (top view, then the meridian slice).
// Numbers from data/fr.json only (CHECK rows below).
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Band, Pt } from "../house/kit/draw";
import { GlobeFrame, SourceBelow } from "../house/kit/frame";
import { AnimatedWindArrow, FlowParticles } from "../house/kit/wind";
import { CurvedLink } from "../house/kit/extras";
import { GlobeCam, LatCircle, llPath } from "./kit_fr/globe";
import {
  AT, Arrow, BREST, CalcStack, D, D2R, GB, GeoImg, GeoMap, Globe, H, IMGS, K, Keyword, LEN, Lbl, PlaneIcon, Place, SE, SS, Scene, SideCallout, SkipChip, SpeedBar,
  Svg, TeX, Tripod, XC, add, boxAt, clamp, discOf, fin, fout, gdot, globeG, keepTime, linesPath, ll, mapP, mix, pieces, poly, prog, sang, svP, tvP, win,
  TopV, SliceV, ParcelDot, chipSpan,
} from "./fr_lib";
import { AngleArc, GRID, GridBase, SliceBase, TopViewBase, circleArrows, gridCell, sliceArrows, topArrows, turned } from "./fr_dia";
import { EQ_S10, EQ_S11, EQ_S12, EQ_S13, EQ_S14, EQ_S16, EQ_S18, EQ_S19, cutAt } from "./fr_eq";

const CO = D.coast, IAN = D.ian, TU = D.turn;
const CHECK_B: [string, number, number, number][] = [
  ["dphi", CO.dphi, 0.823, 6e-4], ["dlam", CO.dlam, -0.553, 6e-4], ["dy", CO.dy, 91.5, 0.1], ["dx", CO.dx, -55.0, 0.05], ["tanb", CO.tanb, 0.601, 6e-4],
  ["beta", CO.beta, 31, 0.05], ["brg", CO.brg, 329.1, 0.05], ["xp1", CO.xp[0], -0.515, 5e-4], ["xp2", CO.xp[1], 0.857, 5e-4], ["yp1", CO.yp[0], -0.857, 5e-4],
  ["yp2", CO.yp[1], -0.515, 5e-4], ["u", IAN.u[0], 22.2, 0.05], ["v", IAN.u[1], 24.3, 0.05], ["sp", IAN.sp, 33, 0.5], ["along", IAN.along, 9.4, 0.05],
  ["across", IAN.across, -31.6, 0.05], ["swing", TU.swing, 12, 0.2], ["tilt", TU.tilt, 1, 1e-3], ["rate", TU.rate10 * 1e6, 2.4, 0.04], ["perday", TU.rate10 * 86400 / D2R, 12, 0.31],
  ["R", TU.R_km, 4230, 1],
];
CHECK_B.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

const XZ = 1190;
const CAM_TOP: GlobeCam = { lat: 89.5, lon: BREST[1], dist: 3.4 };
const MAPB = { x: 80, y: 50, w: 920, h: 740 };
const MSRC = "Data: Natural Earth (coastline)";
const MAP14 = { x: 80, y: 50, w: 920, h: 640 };
/** the coast frame at a point p on a map: along x̂′ (bearing 329°) and across ŷ′ (x̂′ turned +90°), screen directions */
const XP: Pt = [CO.xp[0], -CO.xp[1]], YP: Pt = [CO.yp[0], -CO.yp[1]];

// ================================================================ s10 a frame turned on purpose: the coast frame (Part 1 recap)
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_coast_frame");
  const tAl = SS(k, 1), tP1 = SS(k, 2), tTurn = AT(k, 3, "by an angle alpha"), tX = SS(k, 4), tY = SS(k, 5), tDot = SS(k, 6), tAng = SS(k, 7), tFl = SS(k, 8);
  const B = boxAt(26.55, -82.05, 1.6, MAPB.x, MAPB.y, MAPB.w, MAPB.h);
  const P = mapP(B), p0 = P(26.5, -82.03), U = 170;
  const a = 121 * prog(f, tTurn, tTurn + 60);
  const ex: Pt = [Math.cos(a * D2R), -Math.sin(a * D2R)], ny: Pt = [-Math.sin(a * D2R), -Math.cos(a * D2R)];
  const turnedNow = a > 1;
  const eq = cutAt(EQ_S10, String.raw`,\qquad `);
  return (
    <Scene>
      <GeoMap id="s10m" B={B}>
        {(Pm) => <path d={linesPath(Pm, CO.lines)} fill="none" stroke={C.key} strokeOpacity={0.9} strokeWidth={2.6} />}
      </GeoMap>
      <Svg>
        <Arrow p={p0} q={add(p0, ex, U)} color={C.second} w={9} head={34} />
        <Arrow p={p0} q={add(p0, ny, U)} color={C.second} w={9} head={34} />
        <circle cx={p0[0]} cy={p0[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        <AngleArc c={p0} r={64} a0={0} a1={a} col={C.second} o={fin(f, tTurn)} head />
        <Lbl x={p0[0] + 40} y={p0[1] - 92} t="?" c={C.gold} s={T.key} o={fin(f, tAng)} />
        <g data-lc-maplabel="1"><Lbl x={300} y={520} t="Gulf of Mexico" c={C.key} s={T.floor} italic /></g>
        <g data-lc-maplabel="1"><Lbl x={760} y={250} t="Florida" c={C.key} s={T.floor} /></g>
      </Svg>
      <TeX s={turnedNow ? H.xp : H.i} x={p0[0] + ex[0] * (U + 40)} y={p0[1] + ex[1] * (U + 40)} size={54} c={C.second} ax={0.5} halo />
      <TeX s={turnedNow ? H.yp : H.j} x={p0[0] + ny[0] * (U + 40)} y={p0[1] + ny[1] * (U + 40)} size={54} c={C.second} ax={0.5} halo />
      <TeX s={String.raw`\alpha`} x={p0[0] + 74} y={p0[1] - 70} size={50} c={C.second} o={fin(f, tTurn)} />
      <SourceBelow text={MSRC} pic={MAPB} w={920} name="s10 src" />
      <Svg>
        <Keyword f={f} text="turned on purpose" at={[XC, 110]} appear={0} out={tP1 - 20} />
        <Lbl x={XC} y={210} t="along the shore · across it" c={C.key} s={T.floor} o={fin(f, tAl)} />
        <Lbl x={XC} y={110} t="Part 1: turned axes" c={C.muted} s={T.floor} o={fin(f, tP1)} />
        <Keyword f={f} text="one number: the coast's angle" at={[XC, 760]} s={T.floor} appear={tAng} out={tFl - 20} />
        <Keyword f={f} text="south-west Florida, Ian" at={[XC, 760]} s={T.floor} appear={tFl} />
      </Svg>
      <TeX s={eq[0]} x={XC} y={330} size={54} o={fin(f, tX)} />
      <TeX s={eq[1]} x={XC} y={430} size={54} o={fin(f, tY)} />
      <TeX s={String.raw`\text{along}=\mathbf v\cdot\hat{\mathbf x}'`} x={XC} y={560} size={52} o={fin(f, tDot)} />
      <TeX s={String.raw`\text{across}=\mathbf v\cdot\hat{\mathbf y}'`} x={XC} y={650} size={52} o={fin(f, tDot + 10)} />
    </Scene>
  );
};

// ================================================================ s11 two coast points and the steps north and east in km (Part 3's rules)
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_coast_points");
  const tN = AT(k, 1, "Naples"), tV = AT(k, 2, "Venice"), tWorld = SS(k, 3), tRules = SS(k, 7), tNorth = AT(k, 9, "about ninety one"), tWest = AT(k, 12, "about minus fifty five"),
    tSum = SS(k, 13);
  const B = boxAt(26.52, -82.15, 1.35, MAPB.x, MAPB.y, MAPB.w, MAPB.h);
  const P = mapP(B);
  const A = P(CO.A[0], CO.A[1]), Bp = P(CO.B[0], CO.B[1]), Cn = P(CO.B[0], CO.A[1]);
  const gN = prog(f, tNorth, tNorth + 30), gW = prog(f, tWest, tWest + 30);
  return (
    <Scene>
      <GeoMap id="s11m" B={B}>
        {(Pm) => <path d={linesPath(Pm, CO.lines)} fill="none" stroke={C.key} strokeOpacity={0.9} strokeWidth={2.6} />}
      </GeoMap>
      <Svg>
        <line x1={A[0]} y1={A[1]} x2={Bp[0]} y2={Bp[1]} stroke={C.gold} strokeWidth={5} strokeDasharray="14 10" opacity={fin(f, tV + 20)} />
        <Arrow p={A} q={[A[0], mix(A[1], Cn[1], gN)]} color={C.second} w={9} head={30} o={fin(f, tNorth)} />
        <Arrow p={Cn} q={[mix(Cn[0], Bp[0], gW), Cn[1]]} color={C.second} w={9} head={30} o={fin(f, tWest)} />
        <Place p={A} t="Naples" o={fin(f, tN)} dx={-24} dy={-30} a="end" />
        <Place p={Bp} t="Venice" o={fin(f, tV)} dx={-24} dy={-30} a="end" />
        <g data-lc-maplabel="1">
          <Lbl x={A[0] - 24} y={A[1] + 20} t="26.10° N, 81.80° W" c={C.key} s={T.floor} a="end" o={fin(f, tN + 20)} />
          <Lbl x={Bp[0] - 24} y={Bp[1] + 20} t="26.92° N, 82.35° W" c={C.key} s={T.floor} a="end" o={fin(f, tV + 20)} />
        </g>
        <SideCallout f={f} lines="west leg: 55 km" at={[XC, 690]} appear={tWest + 20} target={[mix(Cn[0], Bp[0], 0.5), Cn[1] - 8]} s={T.floor} bend={60} />
        <SideCallout f={f} lines="north leg: 91.5 km" at={[XC, 780]} appear={tNorth + 20} target={[A[0] + 10, mix(A[1], Cn[1], 0.5)]} s={T.floor} bend={40} />
      </Svg>
      <SourceBelow text="Data: Natural Earth 10 m coastline" pic={MAPB} w={920} name="s11 src" />
      <Svg>
        <Keyword f={f} text="two points on the coastline" at={[XC, 110]} appear={0} out={tRules - 20} />
        <Lbl x={XC} y={200} t="from a world coastline map" c={C.muted} s={T.floor} o={win(f, tWorld, tRules - 20)} />
      </Svg>
      <TeX s={EQ_S11} x={XC} y={110} size={50} o={fin(f, tRules)} />
      <CalcStack f={f} x={1175} y={230} size={44} maxLines={4} rows={[
        { lhs: String.raw`\Delta\varphi`, rhs: String.raw`=0.823^\circ`, at: AT(k, 4, "zero point eight two three") },
        { lhs: String.raw`\Delta\lambda`, rhs: String.raw`=-0.553^\circ`, at: AT(k, 5, "minus zero point") },
        { lhs: String.raw`\Delta\varphi`, rhs: String.raw`=0.823^\circ=0.0144\ \text{rad}`, at: AT(k, 9, "zero point zero one four four") },
        { lhs: String.raw`\Delta y`, rhs: String.raw`=6371\times0.01436\approx91.5\ \text{km}`, at: tNorth },
        { lhs: String.raw`\cos\varphi`, rhs: String.raw`=\cos26.5^\circ=0.895`, at: AT(k, 11, "zero point eight nine five") },
        { lhs: String.raw`\Delta\lambda`, rhs: String.raw`=-0.553^\circ=-0.00965\ \text{rad}`, at: AT(k, 12, "minus zero point zero zero") },
        { lhs: String.raw`\Delta x`, rhs: String.raw`=6371\times0.895\times(-0.00965)`, at: AT(k, 12, "six thousand") },
        { rhs: String.raw`\approx-55.0\ \text{km}`, at: tWest, cont: true },
      ]} />
    </Scene>
  );
};

// ================================================================ s12 the triangle, the angle from north, the bearing 329°
const TA: Pt = [800, 760], KM = 6.0;
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12_coast_angle");
  const tLong = SS(k, 1), tFromN = SS(k, 2), tOpp = SS(k, 3), tTan = SS(k, 4), t31 = SS(k, 5), tWoN = SS(k, 6), tComp = SS(k, 7), t329 = AT(k, 8, "three hundred and twenty nine"),
    tJ = SS(k, 10), tSph = SS(k, 11), tWhy = SS(k, 12), tSea = SS(k, 13);
  const Nc: Pt = [TA[0], TA[1] - CO.dy * KM], Bc: Pt = [TA[0] + CO.dx * KM, TA[1] - CO.dy * KM];
  const cdir = sang([Bc[0] - TA[0], Bc[1] - TA[1]]);
  const rose = fin(f, tComp);
  const sw = (360 - CO.beta) * prog(f, t329 - 40, t329 + 20);
  const across = turned(TA, [Bc[0] - TA[0], Bc[1] - TA[1]], 190, 90);
  const eq = cutAt(EQ_S12, String.raw`,\qquad `);
  return (
    <Scene>
      <Svg>
        <line x1={TA[0]} y1={TA[1]} x2={Nc[0]} y2={Nc[1]} stroke={C.second} strokeWidth={6} />
        <line x1={Nc[0]} y1={Nc[1]} x2={Bc[0]} y2={Bc[1]} stroke={C.second} strokeWidth={6} />
        <line x1={TA[0]} y1={TA[1]} x2={Bc[0]} y2={Bc[1]} stroke={C.key} strokeWidth={8} opacity={fin(f, 0, 10)} />
        <Lbl x={Nc[0] + 20} y={mix(TA[1], Nc[1], 0.5)} t="91.5 km" c={C.second} s={T.floor} />
        <Lbl x={mix(Nc[0], Bc[0], 0.5)} y={Nc[1] - 40} t="55 km" c={C.second} s={T.floor} a="middle" />
        <Lbl x={mix(TA[0], Bc[0], 0.7) - 30} y={mix(TA[1], Bc[1], 0.7) + 20} t="coast" c={C.key} s={T.floor} a="end" o={fin(f, tLong)} />
        <circle cx={TA[0]} cy={TA[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        <circle cx={Bc[0]} cy={Bc[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        <Arrow p={TA} q={[TA[0], TA[1] - 230]} color={C.second} w={9} head={34} o={fin(f, tFromN)} />
        <AngleArc c={TA} r={150} a0={90} a1={cdir} o={fin(f, tOpp)} />
        <Lbl x={TA[0] - 90} y={TA[1] - 130} t="31°" c={C.gold} s={T.key} a="end" o={fin(f, t31)} />
        <g opacity={rose}>
          <circle cx={TA[0]} cy={TA[1]} r={110} fill="none" stroke={C.local} strokeWidth={2} opacity={0.7} />
          {[0, 90, 180, 270].map((b) => <line key={b} x1={TA[0] + 98 * Math.sin(b * D2R)} y1={TA[1] - 98 * Math.cos(b * D2R)} x2={TA[0] + 122 * Math.sin(b * D2R)} y2={TA[1] - 122 * Math.cos(b * D2R)} stroke={C.local} strokeWidth={4} />)}
          <Lbl x={TA[0] + 140} y={TA[1]} t="E" c={C.local} s={T.floor} />
        </g>
        <AngleArc c={TA} r={110} a0={90} a1={90 - sw} o={fin(f, t329 - 40)} head col={C.gold} />
        <Arrow p={TA} q={across} color={C.second} w={9} head={34} o={fin(f, tSea)} />
        <Lbl x={across[0] - 20} y={across[1] + 50} t="Gulf of Mexico" c={C.key} s={T.floor} a="end" italic o={fin(f, tSea)} />
      </Svg>
      <TeX s={H.j} x={TA[0] - 26} y={TA[1] - 205} size={54} c={C.second} ax={1} o={fin(f, tFromN)} />
      <TeX s={String.raw`\beta`} x={TA[0] - 40} y={TA[1] - 70} size={50} c={C.gold} ax={1} o={fin(f, tOpp)} />
      <TeX s={H.yp} x={across[0] - 30} y={across[1] - 30} size={52} c={C.second} ax={1} o={fin(f, tSea)} halo />
      <Svg>
        <Keyword f={f} text="the coast's direction" at={[XC, 110]} appear={0} out={tTan - 20} />
        <Keyword f={f} text="from north, like a compass" at={[XC, 760]} s={T.floor} appear={tFromN} out={tComp - 20} />
        <Lbl x={XC} y={340} t="31° west of north" c={C.key} s={T.key} o={fin(f, tWoN)} />
        <Lbl x={XC} y={430} t="bearings: clockwise from north" c={C.muted} s={T.floor} o={fin(f, tComp)} />
        <Lbl x={XC} y={615} t="from the local north arrow" c={C.key} s={T.floor} o={fin(f, tJ)} />
        <Lbl x={XC} y={670} t="north-north-west" c={C.key} s={T.floor} o={fin(f, AT(k, 10, "north-north-west"))} />
        <Lbl x={XC} y={730} t="on the round Earth: 329° too" c={C.muted} s={T.floor} o={fin(f, tSph)} />
        <Keyword f={f} text="across arrow: out to sea" at={[XC, 800]} s={T.floor} appear={tWhy} />
      </Svg>
      <TeX s={String.raw`\tan\beta=\frac{\text{opposite}}{\text{next to}}`} x={XC} y={120} size={50} o={fin(f, tTan)} />
      <TeX s={eq[0]} x={XC} y={255} size={50} o={fin(f, AT(k, 4, "zero point six"))} />
      <TeX s={String.raw`\beta\approx31^\circ`} x={XC + 520} y={255} size={50} o={fin(f, t31)} />
      <TeX s={eq[1]} x={XC} y={530} size={54} o={fin(f, AT(k, 8, "three hundred and sixty"))} />
    </Scene>
  );
};

// ================================================================ s13 α = 90° − 329° ≡ 121°; the along and across arrows
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = K("s13_alpha");
  const tAl = SS(k, 0), tP1 = SS(k, 1), t239 = SS(k, 2), t121 = SS(k, 3), tChk = SS(k, 4), tCoast = SS(k, 5), tX = SS(k, 6), tY = SS(k, 7), tSea = SS(k, 8);
  const O: Pt = [520, 520], U = 260;
  const e1 = fin(f, tChk), xp = add(O, XP, U), yp = add(O, YP, U);
  const eq = pieces(EQ_S13, [String.raw`\equiv`]);
  return (
    <Scene>
      <Svg>
        <Arrow p={O} q={[O[0] + U, O[1]]} color={C.second} w={6} head={24} o={0.55} />
        <Arrow p={O} q={[O[0], O[1] - U]} color={C.second} w={6} head={24} o={0.55} />
        <AngleArc c={O} r={120} a0={0} a1={90} col={C.local} o={fin(f, tChk)} />
        <AngleArc c={O} r={120} a0={90} a1={121} col={C.gold} o={fin(f, AT(k, 4, "thirty one more"))} />
        <AngleArc c={O} r={190} a0={0} a1={121} col={C.local} o={fin(f, t121)} head />
        <line x1={O[0] - XP[0] * 300} y1={O[1] - XP[1] * 300} x2={O[0] + XP[0] * 380} y2={O[1] + XP[1] * 380} stroke={C.key} strokeWidth={4} strokeDasharray="14 10" opacity={fin(f, tCoast)} />
        <Arrow p={O} q={xp} color={C.second} w={10} head={38} o={fin(f, tX)} />
        <Arrow p={O} q={yp} color={C.second} w={10} head={38} o={fin(f, tY)} />
        <circle cx={O[0]} cy={O[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        <Lbl x={O[0] + 120} y={O[1] - 60} t="90°" c={C.local} s={T.floor} o={e1} />
        <Lbl x={O[0] - 100} y={O[1] - 150} t="31°" c={C.gold} s={T.floor} a="end" o={fin(f, AT(k, 4, "thirty one more"))} />
        <Lbl x={O[0] + 200} y={O[1] - 170} t="121°" c={C.local} s={T.floor} o={fin(f, t121)} />
        <Lbl x={O[0] + 210} y={O[1] + 230} t="coast" c={C.key} s={T.floor} o={fin(f, tCoast)} />
        <Lbl x={yp[0] - 10} y={yp[1] + 70} t="Gulf of Mexico" c={C.key} s={T.floor} a="middle" italic o={fin(f, tSea)} />
      </Svg>
      <TeX s={H.i} x={O[0] + U + 24} y={O[1] - 30} size={50} c={C.second} o={0.7} />
      <TeX s={H.j} x={O[0] + 24} y={O[1] - U - 10} size={50} c={C.second} o={0.7} />
      <TeX s={H.xp} x={xp[0] - 24} y={xp[1] - 40} size={56} c={C.second} ax={1} o={fin(f, tX)} halo />
      <TeX s={H.yp} x={yp[0] - 30} y={yp[1] - 10} size={56} c={C.second} ax={1} o={fin(f, tY)} halo />
      <Svg>
        <Keyword f={f} text="α: from east, anticlockwise" at={[XC, 110]} appear={tAl} out={t239 - 20} />
        <Lbl x={XC} y={210} t="Part 1: maths angle = 90° − bearing" c={C.muted} s={T.floor} o={fin(f, tP1)} />
        <Keyword f={f} text="west-south-west: out to sea" at={[XC, 800]} s={T.floor} appear={tSea} />
      </Svg>
      <TeX s={eq[0]} x={XC} y={320} size={56} o={fin(f, t239)} />
      <TeX s={eq[1]} x={XC + 60} y={400} size={56} o={fin(f, AT(k, 3, "a hundred and twenty one"))} />
      <TeX s={String.raw`121^\circ=90^\circ+31^\circ`} x={XC} y={490} size={52} o={fin(f, tChk)} />
      <TeX s={String.raw`\hat{\mathbf x}'=(\cos121^\circ,\ \sin121^\circ)`} x={XC} y={580} size={48} o={fin(f, tX)} />
      <TeX s={String.raw`=(-0.515,\ 0.857)`} x={XC + 80} y={640} size={48} o={fin(f, AT(k, 6, "minus zero point five"))} />
      <TeX s={String.raw`\hat{\mathbf y}'=(-\sin121^\circ,\ \cos121^\circ)`} x={XC} y={705} size={48} o={fin(f, tY)} />
      <TeX s={String.raw`=(-0.857,\ -0.515)`} x={XC + 80} y={765} size={48} o={win(f, AT(k, 7, "minus zero point eight"), tSea - 20)} />
    </Scene>
  );
};

// ================================================================ s14 Ian's wind at Fort Myers Beach (HRRR 20 UTC): along 9.4, across −31.6
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14_along_across");
  const t33 = AT(k, 1, "thirty three"), tUV = SS(k, 2), tAl = SS(k, 3), tAl2 = SS(k, 4), tAl3 = SS(k, 5), tAc = SS(k, 6), tAc3 = SS(k, 7), tMin = SS(k, 8), tChk = SS(k, 9),
    tPush = SS(k, 10), tSurge = SS(k, 11), tLater = SS(k, 12);
  const B = boxAt(26.47, -82.0, 1.0, MAP14.x, MAP14.y, MAP14.w, MAP14.h);
  const P = mapP(B), p0 = P(IAN.fmb[0], IAN.fmb[1]), s = 6.0, U = 140;
  const w: Pt = [IAN.u[0] * s, -IAN.u[1] * s];
  const al = add(p0, XP, IAN.along * s), ac = add(p0, YP, IAN.across * s);
  const ea = pieces(EQ_S14, ["=22.2", String.raw`\approx9.4`]);
  const gone = SS(k, 9) - 20;
  return (
    <Scene>
      <GeoMap id="s14m" B={B}>
        {(Pm) => <>
          <GeoImg P={Pm} href={IMGS.ian} box={IAN.speed_box} o={0.92} />
          <path d={linesPath(Pm, CO.lines)} fill="none" stroke={C.key} strokeOpacity={0.9} strokeWidth={2.4} />
          <FlowParticles P={(la, lo) => Pm(la, lo)} tracks={IAN.tracks} fr={f / 2} tail={10} w={2.2} />
        </>}
      </GeoMap>
      <Svg>
        <Band p={p0} q={al} color={C.first} o={0.75 * fin(f, tAl3)} />
        <Band p={p0} q={ac} color={C.neg} o={0.75 * fin(f, tAc3)} />
        <Arrow p={p0} q={add(p0, XP, U)} color={C.second} w={8} head={30} o={fin(f, tAl)} />
        <Arrow p={p0} q={add(p0, YP, U)} color={C.second} w={8} head={30} o={fin(f, tAc)} />
        <AnimatedWindArrow from={p0} to={add(p0, w)} speed={IAN.sp} f={f} c={C.first} px={10} head={36} />
        <Arrow p={add(p0, YP, -40)} q={add(p0, YP, -170)} color="#7cc4ff" w={10} head={36} o={win(f, tPush, tLater)} />
        <Place p={p0} t="Fort Myers Beach" o={fin(f, AT(k, 1, "Fort Myers Beach"))} dx={-30} dy={50} a="end" />
        {(() => { const e = P(IAN.eye[0], IAN.eye[1]); return <circle cx={e[0]} cy={e[1]} r={10} fill="none" stroke={C.gold} strokeWidth={5} />; })()}
        <g data-lc-maplabel="1"><Lbl x={300} y={560} t="Gulf of Mexico" c={C.key} s={T.floor} italic /></g>
        <SpeedBar x={110} y={800} w={300} />
        <CurvedLink f={f} from={[XC - 14, 445]} to={add(al, [-6, 0])} start={tAl3 + 10} bend={40} />
        <CurvedLink f={f} from={[XC - 14, 750]} to={add(ac, [0, 12])} start={tAc3 + 10} bend={-40} />
      </Svg>
      <TeX s={H.xp} x={p0[0] + XP[0] * (U + 40)} y={p0[1] + XP[1] * (U + 40)} size={50} c={C.second} ax={0.5} o={fin(f, tAl)} halo />
      <TeX s={H.yp} x={p0[0] + YP[0] * (U + 44)} y={p0[1] + YP[1] * (U + 44)} size={50} c={C.second} ax={0.5} o={fin(f, tAc)} halo />
      <SourceBelow text="Data: HRRR analysis (NOAA) · 28 Sep 2022, 20 UTC · eye ring: the model's calm centre · Natural Earth" pic={MAP14} w={920} name="s14 src" />
      <Svg>
        <Keyword f={f} text="Ian's wind" at={[XC, 110]} appear={0} out={t33 - 20} />
        <Lbl x={XC} y={110} t="≈ 33 m/s from the south-west" c={C.first} s={T.floor} o={win(f, t33, gone)} />
        <Lbl x={XC} y={825} t="minus: onto the land" c={C.neg} s={T.floor} o={win(f, tMin, tPush - 20)} />
        <Lbl x={XC} y={300} t="unrounded: −31.6" c={C.muted} s={T.floor} o={win(f, tChk + 10, tLater)} />
        <Keyword f={f} text="pushing the sea onto the coast" at={[XC, 400]} s={T.floor} appear={tPush} out={tSurge - 20} />
        <Keyword f={f} text="the storm surge" at={[XC, 400]} s={T.floor} appear={tSurge} out={tLater - 20} />
        <Keyword f={f} text="surges: a later movie" at={[XC, 400]} s={T.floor} appear={tLater} />
      </Svg>
      <TeX s={String.raw`u=22.2,\ \ v=24.3\ \text{m/s}`} x={XC} y={200} size={50} o={win(f, tUV, gone)} />
      <TeX s={ea[0]} x={XC} y={300} size={50} o={win(f, tAl, gone)} />
      <TeX s={ea[1]} x={1080} y={370} size={44} o={win(f, tAl2, gone)} />
      <TeX s={String.raw`=-11.4+20.8` + ea[2]} x={XC + 40} y={445} size={50} c={C.first} o={win(f, tAl3, gone)} />
      <TeX s={String.raw`\text{across}=\mathbf v\cdot\hat{\mathbf y}'`} x={XC} y={555} size={50} o={win(f, tAc, gone)} />
      <TeX s={String.raw`=22.2\times(-0.857)`} x={XC} y={620} size={44} o={win(f, AT(k, 6, "twenty two point two"), gone)} />
      <TeX s={String.raw`+24.3\times(-0.515)`} x={XC + 40} y={682} size={44} o={win(f, AT(k, 6, "plus twenty four"), gone)} />
      <TeX s={String.raw`=-19.0-12.5\approx-31.5\approx-32`} x={1080} y={750} size={44} c={C.neg} o={win(f, tAc3, gone)} />
      <TeX s={String.raw`9.4^2+31.6^2\approx1087,\ \ \sqrt{1087}\approx33`} x={1080} y={210} size={44} o={win(f, AT(k, 9, "nine point four"), tLater)} />
      <TeX s={String.raw`\text{along}\approx9.4,\ \ \text{across}\approx-31.6\ \text{m/s}`} x={1080} y={530} size={44} o={fin(f, tPush)} />
    </Scene>
  );
};

// ================================================================ s15 the arrows turn by themselves (plane from above the North Pole)
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_arrows_turn");
  const tPl = SS(k, 2), tHr = AT(k, 3, "nine hundred"), tDeg = AT(k, 4, "about twelve degrees"), tSw = SS(k, 5), tTh = AT(k, 5, "just like theta hat"), tN = SS(k, 6), tTilt = SS(k, 7),
    tKeep = SS(k, 8), tD = SS(k, 9), tFol = SS(k, 10), tHow = SS(k, 11);
  const cam = CAM_TOP, G = globeG(cam);
  const fly = prog(f, tPl + 20, tDeg + 30);
  const lonP = BREST[1] + TU.swing * fly;
  const iTip = (lo: number) => { const e = [Math.cos(lo * D2R), 0, -Math.sin(lo * D2R)], b = ll(BREST[0], lo); return G.pw([b[0] + e[0] * 0.32, b[1] + e[1] * 0.32, b[2] + e[2] * 0.32]); };
  const c0 = G.pw([0, Math.sin(BREST[0] * D2R), 0]);
  return (
    <Scene>
      <Globe cam={cam} grat={0.15}
        over={(Gg) => <>
          <LatCircle G={Gg} lat={BREST[0]} c={C.local} w={3} o={0.6} dash="8 8" />
          <path d={llPath(Gg, Array.from({ length: 31 }, (_, i) => [BREST[0], BREST[1] + ((lonP - BREST[1]) * i) / 30] as [number, number]), 1.003)} fill="none" stroke={C.local} strokeWidth={7} opacity={fin(f, tPl)} />
          <Arrow p={Gg.p(BREST[0], BREST[1])} q={iTip(BREST[1])} color={C.second} w={8} head={30} />
          {fly > 0.02 ? <Arrow p={Gg.p(BREST[0], lonP)} q={iTip(lonP)} color={C.second} w={8} head={30} /> : null}
          <PlaneIcon p={Gg.p(BREST[0], lonP, 1.01)} a={sang([iTip(lonP)[0] - Gg.p(BREST[0], lonP)[0], iTip(lonP)[1] - Gg.p(BREST[0], lonP)[1]])} s={0.8} o={fin(f, tPl)} />
          <line x1={c0[0]} y1={c0[1]} x2={Gg.p(BREST[0], BREST[1])[0]} y2={Gg.p(BREST[0], BREST[1])[1]} stroke={C.gold} strokeWidth={3} strokeDasharray="8 6" opacity={fin(f, tSw)} />
          <line x1={c0[0]} y1={c0[1]} x2={Gg.p(BREST[0], lonP)[0]} y2={Gg.p(BREST[0], lonP)[1]} stroke={C.gold} strokeWidth={3} strokeDasharray="8 6" opacity={fin(f, tSw)} />
          <path d={poly(Array.from({ length: 21 }, (_, i) => { const lo = BREST[1] + ((lonP - BREST[1]) * i) / 20, b = Gg.p(BREST[0], lo); return [mix(c0[0], b[0], 0.35), mix(c0[1], b[1], 0.35)] as Pt; }))}
            fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tSw)} />
        </>} />
      <TeX s={H.i} x={iTip(BREST[1])[0] + 10} y={iTip(BREST[1])[1] + 34} size={50} c={C.second} o={1} halo />
      <GlobeFrame id="s15k" zoom={0} disc={discOf(cam)} />
      <SourceBelow text="Image: NASA Blue Marble Next Generation · Natural Earth" pic={GB} w={960} name="s15 src" />
      <Svg>
        <Keyword f={f} text="a second kind of turning" at={[XC, 110]} appear={0} out={tPl - 20} />
        <Lbl x={XC} y={110} t="plane: 250 m/s due east, 1 hour" c={C.key} s={T.floor} o={fin(f, tPl)} />
        <Lbl x={XC} y={420} t="≈ 12° round the axis" c={C.gold} s={T.key} o={fin(f, tSw)} />
        <Keyword f={f} text="following the air parcel" at={[XC, 800]} s={T.floor} appear={tFol} />
      </Svg>
      <CalcStack f={f} x={1420} y={220} size={50} rows={[
        { lhs: String.raw`250\ \text{m/s}\times3600\ \text{s}`, rhs: String.raw`=900\ \text{km}`, at: tHr },
        { lhs: String.raw`\frac{900\ \text{km}}{74\ \text{km per degree}}`, rhs: String.raw`\approx12^\circ`, at: tDeg, h: 110 },
      ]} />
      <TeX s={String.raw`\text{like }\hat{\boldsymbol\theta}\text{ round a circle}`} x={XC} y={500} size={50} c={C.key} o={win(f, tTh, tN - 20)} />
      <TeX s={String.raw`111\ \text{km north}\ \Rightarrow\ \hat{\mathbf k}\ \text{tilts }1^\circ`} x={XC} y={500} size={50} o={win(f, tTilt, tD - 20)} />
      <TeX s={String.raw`\hat{\mathbf i},\ \hat{\mathbf j},\ \hat{\mathbf k}\ \text{keep changing}`} x={XC} y={590} size={50} o={win(f, tKeep, tD - 20)} />
      <TeX s={String.raw`\frac{D\hat{\mathbf i}}{Dt},\quad \frac{D\hat{\mathbf j}}{Dt},\quad \frac{D\hat{\mathbf k}}{Dt}`} x={XC} y={620} size={60} o={fin(f, tD)} />
      {void tN}
    </Scene>
  );
};

// ================================================================ s16 Part 2's two turning rules (the recipe)
const CC: Pt = [520, 470], CR = 280;
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16_toolkit");
  const t2 = SS(k, 3), tCirc = SS(k, 4), tFirst = SS(k, 5), tWrote = SS(k, 6), tV = SS(k, 7), tCh = SS(k, 8), tR = SS(k, 9), tRec = SS(k, 10), tFind = SS(k, 11);
  const [, chipEnd] = chipSpan(k);
  const th = 53.13 + 15 * Math.sin(Math.PI * clamp((f - tFirst) / 120, 0, 1));
  const A = circleArrows(CC, CR, th, 170);
  const eq = cutAt(EQ_S16, String.raw`,\qquad `);
  return (
    <Scene>
      <Svg>
        <circle cx={CC[0]} cy={CC[1]} r={CR} fill="none" stroke={C.gold} strokeWidth={4} opacity={0.8} />
        <circle cx={CC[0]} cy={CC[1]} r={9} fill={C.local} />
        <line x1={CC[0]} y1={CC[1]} x2={A.p[0]} y2={A.p[1]} stroke={C.local} strokeWidth={4} opacity={fin(f, tV)} />
        <Arrow p={A.p} q={A.R} color={C.second} w={10} head={38} />
        <Arrow p={A.p} q={A.Th} color={C.second} w={10} head={38} />
        <Arrow p={add(A.R, A.Thdir, 0)} q={add(A.R, A.Thdir, 70)} color={C.gold} w={6} head={24} o={fin(f, tFirst)} />
        <Arrow p={A.Th} q={add(A.Th, A.Rdir, -70)} color={C.gold} w={6} head={24} o={fin(f, AT(k, 5, "theta hat changes"))} />
        <Arrow p={add(A.p, A.Thdir, -40)} q={add(A.p, A.Thdir, -150)} color={C.first} w={8} head={30} o={fin(f, tV)} />
        <ParcelDot p={A.p} />
      </Svg>
      <TeX s={H.r} x={A.R[0] + 20} y={A.R[1] + 20} size={56} c={C.second} halo />
      <TeX s={H.th} x={A.Th[0] - 20} y={A.Th[1] - 30} size={56} c={C.second} ax={1} halo />
      <TeX s="r" x={mix(CC[0], A.p[0], 0.5) + 20} y={mix(CC[1], A.p[1], 0.5) + 20} size={50} c={C.local} o={fin(f, tV)} />
      <TeX s="v" x={add(A.p, A.Thdir, -150)[0] - 30} y={add(A.p, A.Thdir, -150)[1]} size={52} c={C.first} ax={1} o={fin(f, tV)} />
      <Svg>
        <Keyword f={f} text="how fast do the arrows turn?" at={[XC, 110]} s={T.floor} appear={0} out={t2 - 20} />
        <Keyword f={f} text="two results from Part 2" at={[XC, 110]} appear={t2} out={tWrote - 20} />
        <SkipChip f={f} k={k} to={keepTime("s22_add_motions")} />
        <Keyword f={f} text="speed / radius" at={[XC, 800]} appear={tRec} c={C.gold} />
      </Svg>
      <TeX s={eq[0]} x={XC} y={130} size={58} o={fin(f, tWrote)} />
      <TeX s={eq[1]} x={XC + 330} y={130} size={58} o={fin(f, AT(k, 6, "d theta hat"))} />
      <TeX s={String.raw`\frac{d\theta}{dt}=\frac{v}{r}`} x={XC} y={300} size={58} o={fin(f, tV)} />
      <TeX s={String.raw`\frac{d\hat{\boldsymbol\theta}}{dt}=-\hat{\mathbf r}\,\frac{v}{r}`} x={XC} y={450} size={58} o={fin(f, tCh)} />
      <TeX s={String.raw`\frac{d\hat{\mathbf r}}{dt}=\hat{\boldsymbol\theta}\,\frac{v}{r}`} x={XC + 380} y={450} size={58} o={fin(f, tR)} />
      <TeX s={String.raw`\text{circle}\ \to\ \hat{\mathbf r},\ \hat{\boldsymbol\theta}\ \to\ \frac{\text{speed}}{\text{radius}}`} x={XC} y={620} size={50} o={fin(f, tFind)} />
      {void [tCirc, chipEnd]}
    </Scene>
  );
};

// ================================================================ s17 the plan: three motions, what each one leaves alone
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_which_moves");
  const tOne = SS(k, 1), tUp = SS(k, 2), tF = SS(k, 3), tNone = SS(k, 4), tNo = SS(k, 5), tI = SS(k, 6), tAlone = SS(k, 7), tFour = SS(k, 8);
  const hl = (s: string) => s.split(String.raw`\varphi`).join(String.raw`\textcolor{#d8b23a}{\varphi}`).split(String.raw`\lambda`).join(String.raw`\textcolor{#d8b23a}{\lambda}`);
  const kS = String.raw`\hat{\mathbf k}=(\cos\varphi\cos\lambda,\ \cos\varphi\sin\lambda,\ \sin\varphi)`;
  const iS = String.raw`\hat{\mathbf i}=(-\sin\lambda,\ \cos\lambda,\ 0)`;
  const jS = String.raw`\hat{\mathbf j}=(-\sin\varphi\cos\lambda,\ -\sin\varphi\sin\lambda,\ \cos\varphi)`;
  const cell = (r: number, c: number, t: string, col: string, at: number) => { const p = gridCell(r, c); return <Lbl key={`${r}${c}`} x={p[0]} y={p[1]} t={t} c={col} s={T.floor} a="middle" o={fin(f, at)} />; };
  return (
    <Scene>
      <Svg>
        <GridBase />
        {[0, 1, 2].map((r) => cell(r, 2, "none", C.muted, tNone))}
        {cell(0, 1, "none", C.muted, tAlone)}
        {[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1]].map(([r, c], q) => cell(r, c, "?", C.gold, tFour + 8 * q))}
      </Svg>
      {[H.i, H.j, H.k].map((s, r) => <TeX key={r} s={s} x={GRID.x0 - 40} y={GRID.y0 + r * GRID.ch + GRID.ch / 2} size={60} c={r === 2 ? C.first : C.second} ax={1} />)}
      <Svg>
        <Keyword f={f} text="east · north · up" at={[XC, 110]} appear={0} out={tF - 20} />
        <Lbl x={XC} y={200} t="one at a time, then add" c={C.muted} s={T.floor} o={win(f, tOne, tF - 20)} />
        <Lbl x={XC} y={560} t="going up: turns nothing" c={C.key} s={T.floor} o={fin(f, tNone)} />
        <Keyword f={f} text="four things to find" at={[XC, 800]} s={T.floor} appear={tFour} />
      </Svg>
      <TeX s={hl(iS)} x={XC} y={130} size={48} o={fin(f, tF)} />
      <TeX s={hl(jS.split(String.raw`\ -\sin`)[0])} x={XC} y={225} size={44} o={fin(f, tF + 8)} />
      <TeX s={hl(String.raw`-\sin` + jS.split(String.raw`\ -\sin`)[1])} x={XC + 120} y={285} size={44} o={fin(f, tF + 8)} />
      <TeX s={hl(kS)} x={XC} y={375} size={44} o={fin(f, tF + 16)} />
      <TeX s={String.raw`\text{only }\varphi,\ \lambda`} x={XC} y={465} size={50} c={C.gold} o={fin(f, tF + 40)} />
      <TeX s={String.raw`\text{going north leaves }\hat{\mathbf i}\text{ alone}`} x={XC} y={650} size={48} o={fin(f, tAlone)} />
      {void [tUp, tNo, tI]}
    </Scene>
  );
};

// ================================================================ s18 going east turns î towards −R̂ (top view; steps 1-3)
const TV2: TopV = { c: [520, 380], r: 300 };
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_i_east_a");
  const tCirc = SS(k, 1), tRoles = SS(k, 2), tS1 = SS(k, 3), tRate = SS(k, 5), tS2 = SS(k, 6), tDi = SS(k, 7), tS3 = SS(k, 8), tEq = SS(k, 9), tWords = SS(k, 10);
  const lam = -20 + 15 * prog(f, tS1, tS1 + 60);
  const A = topArrows(TV2, lam, 160);
  const parts = pieces(EQ_S18, [String.raw`=\frac{d\hat{\mathbf i}}{d\lambda}`, String.raw`=-\hat{\mathbf R}`]);
  return (
    <Scene>
      <Svg>
        <TopViewBase V={TV2} axes={0.4} />
        <line x1={TV2.c[0]} y1={TV2.c[1]} x2={A.p[0]} y2={A.p[1]} stroke={C.local} strokeWidth={3} strokeDasharray="8 8" />
        <Arrow p={A.p} q={A.R} color={C.second} w={10} head={38} />
        <Arrow p={A.p} q={A.I} color={C.second} w={10} head={38} />
        <Arrow p={A.I} q={add(A.I, A.Rdir, -80)} color={C.gold} w={6} head={24} o={fin(f, tDi)} />
        <ParcelDot p={A.p} />
        <AngleArc c={TV2.c} r={90} a0={sang(tvP(TV2, 0, 1) as Pt) * 0 + -90} a1={-90 + lam} col={C.local} />
      </Svg>
      <TeX s={String.raw`a\cos\varphi`} x={TV2.c[0] + TV2.r * 0.78} y={TV2.c[1] - TV2.r * 0.78} size={52} c={C.gold} o={fin(f, tCirc)} />
      <TeX s={H.R} x={A.R[0] + 10} y={A.R[1] + 30} size={54} c={C.second} halo />
      <TeX s={H.i} x={A.I[0] + 24} y={A.I[1] + 10} size={54} c={C.second} halo />
      <TeX s={String.raw`\lambda`} x={TV2.c[0] - 40} y={TV2.c[1] + 120} size={50} c={C.local} />
      <Svg>
        <Keyword f={f} text="first: going east, and î" at={[XC, 110]} appear={0} out={tRoles - 20} />
        <Lbl x={XC} y={290} t="step 1" c={C.muted} s={T.floor} o={fin(f, tS1)} />
        <Lbl x={XC} y={440} t="step 2" c={C.muted} s={T.floor} o={fin(f, tS2)} />
        <Lbl x={XC} y={590} t="step 3" c={C.muted} s={T.floor} o={fin(f, tS3)} />
        <Keyword f={f} text="east swings in towards the axis" at={[XC, 800]} s={T.floor} appear={tWords} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf R}\ \text{plays}\ \hat{\mathbf r},\quad \hat{\mathbf i}\ \text{plays}\ \hat{\boldsymbol\theta},\quad \lambda\ \text{plays}\ \theta`} x={XC} y={130} size={44} o={fin(f, tRoles)} />
      <TeX s={String.raw`\frac{D\lambda}{Dt}=\frac{u}{a\cos\varphi}`} x={XC + 160} y={290} size={56} o={fin(f, tRate)} />
      <TeX s={String.raw`\frac{d\hat{\mathbf i}}{d\lambda}=-\hat{\mathbf R}`} x={XC + 160} y={440} size={56} o={fin(f, tDi)} />
      <TeX s={parts[0]} x={XC + 160} y={585} size={50} o={fin(f, tEq)} />
      <TeX s={f < tEq + 30 ? parts[1] : parts[1] + parts[2]} x={XC + 160} y={705} size={50} o={fin(f, tEq + 15)} />
    </Scene>
  );
};

// ================================================================ s19 R̂ in the local arrows; Di/Dt; how fast at Brest (meridian slice; steps 4-6)
const SV2: SliceV = { c: [380, 640], r: 470 };
const S19: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19_i_east_b");
  const tSl = SS(k, 2), tK = SS(k, 3), tJ = SS(k, 4), tMul = SS(k, 5), tSub = SS(k, 6), tZ = SS(k, 7), tOne = SS(k, 8), tR = SS(k, 9), tWords = SS(k, 10), tS6 = SS(k, 11),
    tEq = SS(k, 12), tTip = SS(k, 13), tHow = SS(k, 14), tTen = SS(k, 15), t24 = SS(k, 16), t12 = SS(k, 17);
  const phi = D.brest.ll[0], U = 170;
  const A = sliceArrows(SV2, phi, U);
  const cp = Math.cos(phi * D2R), sp = Math.sin(phi * D2R);
  const legK = add(A.p, A.Kdir, U * cp), legR = add(legK, A.Jdir, -U * sp);
  const mid = fout(f, tS6 - 20);
  return (
    <Scene>
      <Svg>
        <SliceBase V={SV2} axes={0.5} quarter />
        <line x1={SV2.c[0]} y1={SV2.c[1]} x2={A.p[0]} y2={A.p[1]} stroke={C.local} strokeWidth={3} strokeDasharray="8 8" />
        <Arrow p={A.p} q={A.K} color={C.first} w={10} head={38} />
        <Arrow p={A.p} q={A.J} color={C.second} w={10} head={38} />
        <Arrow p={A.p} q={[A.p[0] + U, A.p[1]]} color={C.second} w={8} head={30} dash="14 10" o={fin(f, tR)} />
        <g opacity={fin(f, tR + 20)}>
          <Arrow p={A.p} q={legK} color={C.first} w={6} head={22} dash="10 8" />
          <Arrow p={legK} q={legR} color={C.second} w={6} head={22} dash="10 8" />
        </g>
        <ParcelDot p={A.p} />
        <CurvedLink f={f} from={[XC - 14, 700]} to={[A.p[0] + U * 0.6, A.p[1] + 14]} start={tR + 30} end={tS6 - 20} bend={-60} />
      </Svg>
      <TeX s={H.k} x={A.K[0] + 20} y={A.K[1] - 20} size={54} c={C.first} halo />
      <TeX s={H.j} x={A.J[0] - 20} y={A.J[1] - 26} size={54} c={C.second} ax={1} halo />
      <TeX s={H.R} x={A.p[0] + U + 20} y={A.p[1] + 10} size={52} c={C.second} o={fin(f, tR)} halo />
      <TeX s={String.raw`\cos\varphi\,\hat{\mathbf k}`} x={legK[0] - 24} y={mix(A.p[1], legK[1], 0.5) - 10} size={44} c={C.first} ax={1} o={fin(f, tR + 20)} halo />
      <TeX s={String.raw`-\sin\varphi\,\hat{\mathbf j}`} x={legR[0] + 30} y={mix(legK[1], legR[1], 0.5) - 40} size={44} c={C.second} o={fin(f, tR + 20)} halo />
      <TeX s={H.z} x={SV2.c[0] + 24} y={SV2.c[1] - SV2.r * 0.5} size={48} c={C.second} o={0.7} />
      <Svg>
        <Keyword f={f} text="in her own arrows" at={[XC, 110]} appear={0} out={tK - 20} />
        <Lbl x={XC} y={290} t="step 4: × cos φ, × sin φ" c={C.muted} s={T.floor} o={win(f, tMul, tS6 - 20)} />
        <Lbl x={XC} y={770} t="partly up, partly south" c={C.key} s={T.floor} o={win(f, tWords, tS6 - 20)} />
        <Lbl x={XC} y={290} t="step 6" c={C.muted} s={T.floor} o={fin(f, tS6)} />
        <Keyword f={f} text="tips north, and down" at={[XC, 470]} s={T.floor} appear={tTip} />
        <Lbl x={XC} y={560} t="u = 10 m/s at Brest" c={C.key} s={T.floor} o={fin(f, tTen)} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf k}=\cos\varphi\,\hat{\mathbf R}+\sin\varphi\,\hat{\mathbf z}`} x={XC} y={130} size={50} o={win(f, tK, tS6 - 20)} />
      <TeX s={String.raw`\hat{\mathbf j}=-\sin\varphi\,\hat{\mathbf R}+\cos\varphi\,\hat{\mathbf z}`} x={XC} y={200} size={50} o={win(f, tJ, tS6 - 20)} />
      <TeX s={String.raw`\cos\varphi\,\hat{\mathbf k}-\sin\varphi\,\hat{\mathbf j}`} x={XC} y={370} size={48} o={win(f, tSub, tS6 - 20) * mid} />
      <TeX s={String.raw`=(\cos^2\varphi+\sin^2\varphi)\,\hat{\mathbf R}`} x={XC + 40} y={440} size={48} o={win(f, tSub + 20, tS6 - 20)} />
      <TeX s={f < tZ ? String.raw`+(\cos\varphi\sin\varphi-\sin\varphi\cos\varphi)\,\hat{\mathbf z}` : String.raw`+\cancel{(\cos\varphi\sin\varphi-\sin\varphi\cos\varphi)\,\hat{\mathbf z}}`} x={XC + 40} y={515} size={46} o={win(f, tSub + 40, tS6 - 20)} />
      <TeX s={String.raw`\cos^2\varphi+\sin^2\varphi=1`} x={XC + 40} y={595} size={46} c={C.gold} o={win(f, tOne, tS6 - 20)} />
      <TeX s={String.raw`\hat{\mathbf R}=\cos\varphi\,\hat{\mathbf k}-\sin\varphi\,\hat{\mathbf j}`} x={XC} y={690} size={54} c={C.key} o={win(f, tR, tS6 - 20)} />
      <TeX s={EQ_S19} x={XC} y={370} size={54} o={fin(f, tEq)} />
      <TeX s={String.raw`\frac{u}{a\cos\varphi}=\frac{10}{4\,230\,000}`} x={XC} y={680} size={50} o={fin(f, AT(k, 15, "divide ten"))} />
      <TeX s={String.raw`\approx2.4\times10^{-6}\ \text{rad/s}`} x={XC + 40} y={780} size={50} o={win(f, t24, t12 - 20)} />
      <TeX s={String.raw`\approx12^\circ\ \text{per day}`} x={XC + 40} y={780} size={50} c={C.gold} o={fin(f, t12)} />
      {void [tSl, tHow, svP, tvP, gdot, Tripod, GB, LEN, SE, XZ, Place, fout]}
    </Scene>
  );
};

export const SCENES_B: Record<string, React.FC> = {
  s10_coast_frame: S10, s11_coast_points: S11, s12_coast_angle: S12, s13_alpha: S13, s14_along_across: S14, s15_arrows_turn: S15, s16_toolkit: S16,
  s17_which_moves: S17, s18_i_east_a: S18, s19_i_east_b: S19,
};
