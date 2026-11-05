// ch00_coordinates_storm scenes s00-s08: the title, the hook, Part 1 in a minute, and maths block 1 (how r̂ and θ̂ turn: the tip
// on the unit circle, the slopes of cosine and sine, dr̂/dθ = θ̂, dθ̂/dθ = −r̂ from scratch, what −r̂ means) and the product rule.
// Every number on screen is asserted against data/cs.json below (the render fails otherwise); this file only places and times.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Band, Pt, pulse } from "../house/kit/draw";
import { TeX } from "../house/kit/tex";
import { CalcStack } from "./cs_lib";  // K6 r0: fraction rows get their real height
import { Keyword } from "../house/kit/notes";
import { CurvedLink } from "../house/kit/extras";
import { RiseText, TitleGradient } from "../house/kit/title";
import { SourceBelow } from "../house/kit/frame";
import {
  AT, ArcHead, Arrow, Axes, Ax, Curve, D, D2R, DashArrow, IMG, K, LEN, Lbl, Parcel, RING, RTick, SAY, SE, SRC, SS, Scene, SideCallout, SkipChip, Svg,
  URBar, UnitCircle, Wedge, arcD, axP, fin, fout, keepTime, mix, polar, prog, win, GeoImg, mapP, boxAt, linesPath, nf,
} from "./cs_lib";
import { EQ_S02, EQ_S03, EQ_S04, EQ_S05, EQ_S06, EQ_S07, EQ_S08, cutAt } from "./cs_eq";

const CI = D.circle, PR = D.prod;
// ---------------------------------------------------------------- numbers on screen = the data (the render fails otherwise)
const CHECK_A: [string, number, number, number][] = [
  ["theta", CI.th, 53.13, 0.005], ["rhat x", CI.rhat[0], 0.6, 1e-9], ["rhat y", CI.rhat[1], 0.8, 1e-9], ["thhat x", CI.thhat[0], -0.8, 1e-9],
  ["chord 0.1", CI.chord01, 0.1, 5e-4], ["cos 0.01", CI.cs001[0], 0.592, 5e-4], ["sin 0.01", CI.cs001[1], 0.806, 5e-4],
  ["thhat+ x", CI.th001[0], -0.806, 5e-4], ["thhat+ y", CI.th001[1], 0.592, 5e-4],
  ["d1 x", PR.d1[0], 0.995, 5e-4], ["d1 y", PR.d1[1], 0.1, 5e-4], ["P1 x", PR.P1[0], 10.945, 5e-4], ["P1 y", PR.P1[1], 1.1, 5e-3],
  ["dP x", PR.dP[0], 0.945, 5e-4], ["dP y", PR.dP[1], 1.1, 5e-3], ["piece2 x", PR.pieces[1][0], -0.05, 5e-4], ["piece3 x", PR.pieces[2][0], -0.005, 5e-4],
  ["ring v", RING.v, 34.8, 0.05], ["ring vr", RING.vr, -13.3, 0.05], ["say vt", SAY.vt, 35, 0], ["say vr", SAY.vr, -13, 0],
];
CHECK_A.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

const MX = 1100;                                  // the maths column
const UC: Pt = [520, 450], UR = 320;              // the unit circle (s03-s07)
const TH = CI.th as number;                       // 53.13°
const DRAW_TURN = 20;                             // the 'small' turn drawn at 20° (listed exaggeration)
const tip = (a: number, r = UR): Pt => polar(UC, r, a);
const unitV = (a: number): Pt => [Math.cos(a * D2R), -Math.sin(a * D2R)];

// ================================================================ s00 title
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  const tMet = AT(k, 0, "meteorology"), tEasy = AT(k, 0, "the easy way");
  const pz = 1 + 0.06 * pulse(f, tEasy, 14);
  // Part A: a parcel gliding round a ring (one lap ≈ 4 s, time compressed), its velocity v θ̂ turning; faint copies every 0.5 s;
  // the inward acceleration (rose) grows at the parcel
  const O: Pt = [1485, 400], R = 170;
  const ang = (fr: number) => 30 + (360 * fr) / 120;
  const a = ang(f), p = polar(O, R, a), vq: Pt = [p[0] + unitV(a + 90)[0] * 120, p[1] + unitV(a + 90)[1] * 120];
  const oA = fout(f, tMet, 12), oB = fin(f, tMet, 12);
  const SB = { x: 1130, y: 180, w: 700, h: 290 };
  const PS = (r: number, z: number): Pt => [SB.x + (r / 200) * SB.w, SB.y + SB.h - (z / 16) * SB.h];
  const dash = (f * 2) % 40;
  return (
    <Scene fadeIn={false}>
      <Svg>
        <defs><TitleGradient id="ttl" x1={100} x2={1000} /></defs>
        <RiseText f={f} t="Coordinates · Part 2" x={104} y={92} s={64} at={2} fill={C.key} />
        <RiseText f={f} t="Inside a" x={100} y={228} s={128} at={6} fill="url(#ttl)" />
        <RiseText f={f} t="tropical" x={100} y={360} s={128} at={12} fill="url(#ttl)" />
        <RiseText f={f} t="cyclone" x={100} y={492} s={128} at={18} fill="url(#ttl)" />
        <g transform={`translate(104 598) scale(${pz}) translate(-104 -598)`}>
          <RiseText f={f} t="made easy" x={104} y={598} s={68} at={24} fill={C.key} />
        </g>
        <RiseText f={f} t="turning arrows and" x={106} y={700} s={68} at={32} fill={C.key} />
        <RiseText f={f} t="cylindrical coordinates" x={106} y={785} s={68} at={38} fill={C.key} colors={(i) => (i < 11 ? C.first : undefined)} />
        <g opacity={oA * fin(f, 4, 10)}>
          <circle cx={O[0]} cy={O[1]} r={R} fill="none" stroke={C.local} strokeWidth={4} />
          <circle cx={O[0]} cy={O[1]} r={10} fill={C.local} />
          {[1, 2, 3, 4].map((j) => { const fr = f - 15 * j; if (fr < 0) return null; const aa = ang(fr), pp = polar(O, R, aa), u = unitV(aa + 90);
            return <Arrow key={j} p={pp} q={[pp[0] + u[0] * 120, pp[1] + u[1] * 120]} color={C.first} w={6} head={26} o={0.45 - 0.09 * j} />; })}
          <Arrow p={p} q={vq} color={C.first} w={10} head={36} />
          <Arrow p={p} q={[mix(p[0], O[0], 0.42 * fin(f, 50, 30)), mix(p[1], O[1], 0.42 * fin(f, 50, 30))]} color={C.neg} w={10} head={34} o={fin(f, 50, 10)} />
          <Parcel p={p} />
        </g>
      </Svg>
      <Svg o={oB}>
        <image href={IMG("cst_sec_ian.png")} x={SB.x} y={SB.y} width={SB.w} height={SB.h} preserveAspectRatio="none" />
        <rect x={SB.x} y={SB.y} width={SB.w} height={SB.h} fill="none" stroke={C.grid} strokeWidth={3} />
        {[[PS(170, 0.6), PS(40, 0.6)], [PS(40, 1.5), PS(40, 11)], [PS(45, 13.5), PS(170, 13.5)]].map(([q0, q1], j) =>
          <g key={j}><Arrow p={q0} q={q1} color={C.gold} w={7} head={28} />
            <line x1={q0[0]} y1={q0[1]} x2={q1[0]} y2={q1[1]} stroke={C.bg} strokeWidth={3} strokeDasharray="8 32" strokeDashoffset={-dash} /></g>)}
        <URBar x={1180} y={510} w={360} title={false} />
      </Svg>
      <SourceBelow text="Data: NOAA HRRR analysis · 28 Sep 2022, 18 UTC" pic={{ x: SB.x, y: SB.y, w: SB.w, h: 470 }} w={700} o={oB} name="s00 src" />
    </Scene>
  );
};

// ================================================================ s01 hook
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  const O: Pt = [520, 430], R = 280;
  const a = 20 + (360 * f) / 240;                 // one lap in 8 s (75 min compressed)
  const p = polar(O, R, a), u = unitV(a + 90), er = unitV(a);
  const tAcc = AT(k, 1, "accelerating"), tGuess = SS(k, 2), tTC = AT(k, 3, "tropical cyclone"), tNames = SS(k, 4), tSix = AT(k, 5, "seven parts"),
    tTurn = SS(k, 6), tTwo = SS(k, 7), tIan = SS(k, 8), tAmp = SS(k, 9);
  const oRing = fout(f, tTwo - 10, 14), oWorld = fin(f, tTwo, 14);
  const W = { lat0: -20, lat1: 60, lon0: -100, lon1: 100, x: 90, y: 150, w: 900, h: 360 };
  const P = mapP(W);
  const world = D.world as number[][];
  const thumbs = ["grid", "storm", "globe", "enu", "route", "map", "frames"];
  return (
    <Scene>
      <Svg>
        <g opacity={oRing}>
          <circle cx={O[0]} cy={O[1]} r={R} fill="none" stroke={C.local} strokeWidth={5} />
          <circle cx={O[0]} cy={O[1]} r={34} fill="#22304a" stroke={C.local} strokeWidth={3} />
          <DashArrow f={f} p={p} q={[p[0] + u[0] * 150, p[1] + u[1] * 150]} />
          <Arrow p={p} q={[p[0] + er[0] * 110, p[1] + er[1] * 110]} color={C.second} w={8} head={30} o={fin(f, tTurn)} />
          <Parcel p={p} />
          <g transform="translate(860 120)">
            <path d="M -70 30 A 70 70 0 0 1 70 30" fill="none" stroke={C.ink} strokeWidth={5} />
            <line x1={0} y1={30} x2={-38} y2={-28} stroke={C.first} strokeWidth={6} strokeLinecap="round" />
            <circle cx={0} cy={30} r={7} fill={C.ink} />
          </g>
          <Lbl x={860} y={190} t={`${SAY.vt} m/s`} c={C.first} s={T.floor} a="middle" />
        </g>
        <g opacity={oWorld}>
          {/* heavy-phase K6 r0: the coastlines ran far outside the map box (no clip) */}
          <clipPath id="s01world"><rect x={W.x} y={W.y} width={W.w} height={W.h} /></clipPath>
          <rect x={W.x} y={W.y} width={W.w} height={W.h} fill="#1d2a44" stroke={C.grid} strokeWidth={3} />
          <path d={linesPath(P, world)} fill="none" stroke={C.local} strokeWidth={2} clipPath="url(#s01world)" />
          <circle cx={P(26.5, -82.3)[0]} cy={P(26.5, -82.3)[1]} r={13} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={fin(f, tIan)} />
          <circle cx={P(20.7, 87.8)[0]} cy={P(20.7, 87.8)[1]} r={13} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={fin(f, tAmp)} />
          {/* heavy-phase K6 r0: Ian's label ran off the left edge, Amphan's into the keyword column: anchored to the box ends */}
          <Lbl x={W.x} y={W.y + W.h + 50} t="Hurricane Ian · 2022" c={C.key} s={T.floor} o={fin(f, tIan)} />
          <Lbl x={W.x + W.w} y={W.y + W.h + 110} t="Cyclone Amphan · 2020" c={C.key} s={T.floor} a="end" o={fin(f, tAmp)} />
        </g>
        <Keyword f={f} text="air parcel · steady speed" at={[MX, 120]} s={T.key} appear={0} out={tTC - 20} />
        <Keyword f={f} text="accelerating?" at={[MX, 210]} s={T.key} appear={tAcc} out={tTC - 20} />
        <Lbl x={MX + 450} y={210} t="?" c={C.gold} s={T.hero} o={win(f, tAcc + 10, tTC - 20)} />
        <Keyword f={f} text="your guess: yes · no" at={[MX, 300]} s={T.key} appear={tGuess} out={tTC - 20} />
        <Keyword f={f} text="tropical cyclone" at={[MX, 120]} s={T.key} appear={tTC} out={tTwo - 20} />
        <Lbl x={MX} y={215} t="hurricane: near America" c={C.key} s={T.floor} o={win(f, tNames, tTwo - 20)} />
        <Lbl x={MX} y={280} t="cyclone: near India, Bangladesh" c={C.key} s={T.floor} o={win(f, tNames + 20, tTwo - 20)} />
        <Lbl x={MX} y={350} t="= one kind of storm" c={C.gold} s={T.floor} o={win(f, AT(k, 4, "same kind"), tTwo - 20)} />
        <Keyword f={f} text="winds in 3-D · storm surge" at={[MX, 520]} s={T.floor} appear={tIan + 30} />
        <Keyword f={f} text="another ocean · floods" at={[MX, 620]} s={T.floor} appear={tAmp + 30} />
        <g opacity={win(f, tSix, tTwo - 20)}>
          {thumbs.map((t, i) => { const x = 140 + i * 240, y = 700;
            return <g key={t} opacity={i === 1 ? 1 : 0.35}>
              <circle cx={x + 60} cy={y + 60} r={54} fill="none" stroke={i === 1 ? C.gold : C.local} strokeWidth={4} />
              {i === 0 ? [0, 1, 2].map((q) => <line key={q} x1={x + 25 + q * 35} y1={y + 25} x2={x + 25 + q * 35} y2={y + 95} stroke={C.second} strokeWidth={3} />) : null}
              {i === 1 ? <><ellipse cx={x + 60} cy={y + 40} rx={36} ry={10} fill="none" stroke={C.key} strokeWidth={3} /><ellipse cx={x + 60} cy={y + 85} rx={36} ry={10} fill="none" stroke={C.key} strokeWidth={3} />
                <line x1={x + 24} y1={y + 40} x2={x + 24} y2={y + 85} stroke={C.key} strokeWidth={3} /><line x1={x + 96} y1={y + 40} x2={x + 96} y2={y + 85} stroke={C.key} strokeWidth={3} /></> : null}
              {i === 2 ? <ellipse cx={x + 60} cy={y + 60} rx={18} ry={44} fill="none" stroke={C.local} strokeWidth={3} /> : null}
              {i === 3 ? <><line x1={x + 60} y1={y + 70} x2={x + 95} y2={y + 70} stroke={C.second} strokeWidth={4} /><line x1={x + 60} y1={y + 70} x2={x + 60} y2={y + 30} stroke={C.second} strokeWidth={4} /></> : null}
              {i === 4 ? <path d={`M${x + 22} ${y + 80} Q${x + 60} ${y + 20} ${x + 98} ${y + 70}`} fill="none" stroke={C.gold} strokeWidth={4} /> : null}
              {i === 5 ? <rect x={x + 28} y={y + 38} width={64} height={44} fill="none" stroke={C.local} strokeWidth={3} /> : null}
              {i === 6 ? <><line x1={x + 40} y1={y + 85} x2={x + 92} y2={y + 55} stroke={C.second} strokeWidth={4} /><line x1={x + 40} y1={y + 85} x2={x + 20} y2={y + 35} stroke={C.second} strokeWidth={4} /></> : null}
            </g>; })}
        </g>
      </Svg>
      <SourceBelow text="Map: Natural Earth · storm positions: IBTrACS v04r01 (NOAA NCEI)" pic={{ x: W.x, y: W.y, w: W.w, h: W.h + 140 }} w={900} o={oWorld * fin(f, tIan)} name="s01 src" />
    </Scene>
  );
};

// ================================================================ s02 Part 1 in a minute
const S02: React.FC = () => {
  const f = useCurrentFrame(), k = K("s02_part1_recap");
  const O: Pt = [330, 600], u = 80;                // the Part 1 grid: 1 km = 80 px
  const tR = SS(k, 1), tArc = SS(k, 2), tUnit = SS(k, 3), tRh = SS(k, 4), tTh = SS(k, 5), tPart = SS(k, 6), tIan = SS(k, 7), tTurn = SS(k, 8);
  const thB = TH + 40 * prog(f, tTurn, tTurn + 120);
  const B = polar(O, 5 * u, thB);
  const er = unitV(thB), et = unitV(thB + 90);
  const [e1, e2] = cutAt(EQ_S02, String.raw`,\qquad `);
  const oGrid = fout(f, tIan - 12, 12), oIan = win(f, tIan, tTurn - 20, 12), oG2 = fin(f, tTurn, 12);
  const IB = { x: 140, y: 120, w: 720, h: 640 };
  const MB = boxAt(D.ian_c[0], D.ian_c[1], 0.9, IB.x, IB.y, IB.w, IB.h);
  const P = mapP(MB);
  const c0 = P(D.ian_c[0], D.ian_c[1]);
  const rr = (RING.r_km / 111.2 / 0.9) * IB.h;
  return (
    <Scene>
      <Svg>
        <g opacity={Math.max(oGrid, oG2)}>
          {[1, 2, 3, 4, 5, 6].map((r) => <circle key={r} cx={O[0]} cy={O[1]} r={r * u} fill="none" stroke={C.grid} strokeWidth={2} />)}
          {Array.from({ length: 12 }, (_, i) => i * 30).map((a) => <line key={a} x1={O[0]} y1={O[1]} x2={polar(O, 6.3 * u, a)[0]} y2={polar(O, 6.3 * u, a)[1]} stroke={C.grid} strokeWidth={2} />)}
          <line x1={O[0]} y1={O[1]} x2={B[0]} y2={B[1]} stroke={C.local} strokeWidth={6} opacity={fin(f, tR)} />
          <path d={arcD(O, 90, 0, thB)} fill="none" stroke={C.local} strokeWidth={6} opacity={fin(f, tR)} />
          <Lbl x={mix(O[0], B[0], 0.5) - 30} y={mix(O[1], B[1], 0.5) - 20} t="r" c={C.local} s={T.key} a="end" o={fin(f, tR)} />
          <Lbl x={polar(O, 125, thB / 2)[0] + 10} y={polar(O, 125, thB / 2)[1]} t="θ" c={C.local} s={T.key} o={fin(f, tR)} />
          <path d={arcD(O, 3 * u, 0, 60)} fill="none" stroke={C.gold} strokeWidth={10} opacity={win(f, tArc, tUnit)} />
          <circle cx={B[0]} cy={B[1]} r={13} fill={C.key} stroke={C.bg} strokeWidth={4} />
          <Arrow p={B} q={[B[0] + er[0] * 150, B[1] + er[1] * 150]} color={C.second} w={10} head={36} o={fin(f, tRh)} />
          <Arrow p={B} q={[B[0] + et[0] * 150, B[1] + et[1] * 150]} color={C.second} w={10} head={36} o={fin(f, tTh)} />
          <path d={arcD(B, 60, thB, thB + 90)} fill="none" stroke={C.gold} strokeWidth={5} opacity={win(f, tTh, tPart)} />
          <Band p={B} q={[B[0] + er[0] * 110, B[1] + er[1] * 110]} color={C.neg} o={0.5 * win(f, tPart, tIan)} />
          <Band p={B} q={[B[0] + et[0] * 120, B[1] + et[1] * 120]} color={C.first} o={0.5 * win(f, tPart, tIan)} />
          <path d={arcD(B, 190, thB, thB + 90)} fill="none" stroke={C.gold} strokeWidth={5} opacity={oG2} />
          <ArcHead c={B} r={190} a={thB + 90} dir={1} col={C.gold} o={oG2} />
        </g>
      </Svg>
      <TeX s={String.raw`s=r\,\theta`} x={MX} y={430} size={T.calc} o={win(f, tArc, tIan - 20)} />
      <TeX s={e1} x={MX} y={170} size={T.calc} c={C.second} o={win(f, tRh, tIan - 20)} />
      <TeX s={e2} x={MX} y={290} size={T.calc} c={C.second} o={win(f, tTh, tIan - 20)} />
      <TeX s={String.raw`u_r=\mathbf u\cdot\hat{\mathbf r},\qquad u_\theta=\mathbf u\cdot\hat{\boldsymbol\theta}`} x={MX} y={570} size={60} o={win(f, tPart, tIan - 20)} />
      <Svg o={oIan}>
        <rect x={IB.x} y={IB.y} width={IB.w} height={IB.h} fill="#1d2a44" stroke={C.grid} strokeWidth={3} />
        <path d={linesPath(P, D.coast_ian)} fill="none" stroke={C.key} strokeWidth={2.5} opacity={0.8} />
        <circle cx={c0[0]} cy={c0[1]} r={rr} fill="none" stroke={C.local} strokeWidth={4} />
        <circle cx={c0[0]} cy={c0[1]} r={8} fill={C.local} />
        {[0, 18, 36, 54].map((i) => { const az = RING.az[i] * D2R, p0: Pt = [c0[0] + rr * Math.cos(az), c0[1] - rr * Math.sin(az)], s = 4.2;
          return <g key={i}>
            <DashArrow f={f} p={p0} q={[p0[0] - Math.sin(az) * RING.v * s, p0[1] - Math.cos(az) * RING.v * s]} w={8} head={28} />
            <DashArrow f={f} p={p0} q={[p0[0] + Math.cos(az) * RING.vr * s, p0[1] - Math.sin(az) * RING.vr * s]} c={C.neg} w={8} head={28} />
          </g>; })}
        <SideCallout f={f} lines={`≈ ${SAY.vt} m/s round`} at={[MX, 300]} appear={AT(k, 7, "thirty five")} out={tTurn - 20} target={[c0[0] + rr + 6, c0[1] - 140]} c={C.first} />
        <SideCallout f={f} lines={`≈ ${Math.abs(SAY.vr)} m/s in  (−)`} at={[MX, 420]} appear={AT(k, 7, "thirteen")} out={tTurn - 20} target={[c0[0] + rr - 40, c0[1] + 30]} c={C.neg} />
      </Svg>
      <TeX s={String.raw`\overline{u_\theta}\approx35\ \mathrm{m/s},\qquad \overline{u_r}\approx-13\ \mathrm{m/s}`} x={MX} y={580} size={50} o={oIan * fin(f, AT(k, 7, "thirteen") + 20)} />
      <SourceBelow text={SRC.hrrr18} pic={IB} w={760} o={oIan} name="s02 src" />
      <Svg>
        <Keyword f={f} text="Part 1: polar coordinates" at={[MX, 120]} s={T.key} appear={0} out={tR + 60} />
        <Keyword f={f} text="r̂, θ̂ turn as we go round" at={[MX, 300]} s={T.key} appear={tTurn} />
        <Keyword f={f} text="how fast?" at={[MX, 420]} s={T.key} appear={SS(k, 9)} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s03 the tip of r̂ on the unit circle (D12 1-3)
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_tip_on_circle");
  const tRh = SS(k, 6), tLen = SS(k, 7), tTip = SS(k, 8), tDel = AT(k, 10, "delta theta"), tSlide = SS(k, 11),
    tArc = AT(k, 13, "radius times"), tOne = SS(k, 14), tEx = SS(k, 15), tWhich = SS(k, 16), tRA = SS(k, 17), tTh = SS(k, 18), tSo = SS(k, 19);
  // fix 0 B15: on S15 the drawn turn eases from 20° to the example's 0.1 rad = 5.7°, and back on S16
  const ez = prog(f, tEx, tEx + 30) * (1 - prog(f, tWhich, tWhich + 30));
  const turnDeg = DRAW_TURN - (DRAW_TURN - 0.1 / D2R) * ez;
  const a1 = TH + turnDeg * prog(f, tSlide, tSlide + 40);
  const T0 = tip(TH), T1 = tip(a1);
  const r1 = String.raw`s=r\,\theta\ \Rightarrow\ s=1\times\Delta\theta`;
  const mid = tip((TH + TH + DRAW_TURN) / 2, UR + 34);
  return (
    <Scene>
      <Svg>
        <UnitCircle c={UC} R={UR} o={fin(f, 0, 10)} />
        <Lbl x={UC[0]} y={UC[1] + UR + 70} t="radius 1" c={C.local} s={T.floor} a="middle" o={fin(f, tLen)} />
        <Arrow p={UC} q={T0} color={C.second} w={10} head={40} o={fin(f, tRh) * (f > tSlide ? 0.45 : 1)} />
        <Arrow p={UC} q={T1} color={C.second} w={10} head={40} o={fin(f, tSlide)} />
        <circle cx={T0[0]} cy={T0[1]} r={11} fill={C.gold} opacity={fin(f, tTip)} />
        <Lbl x={T0[0] + 26} y={T0[1] - 36} t="(cos θ, sin θ)" c={C.key} s={T.floor} o={win(f, tTip, tSlide)} />
        <Wedge c={UC} r={110} a0={TH} a1={TH + turnDeg} o={fin(f, tDel)} />
        <Lbl x={polar(UC, 150, TH + DRAW_TURN / 2 - 16 * ez)[0]} y={polar(UC, 150, TH + DRAW_TURN / 2 - 16 * ez)[1]} t={ez > 0.5 ? "0.1 rad ≈ 6°" : "Δθ"} c={C.gold}
          s={ez > 0.5 ? T.floor : T.key} a={ez > 0.5 ? "end" : "middle"} o={fin(f, tDel)} />
        <path d={arcD(UC, UR, TH, a1)} fill="none" stroke={C.second} strokeWidth={12} opacity={fin(f, tSlide)} />
        <Lbl x={mid[0] + 18} y={mid[1] - 18} t={f < tEx ? "length Δθ" : "≈ 0.1"} c={C.second} s={T.floor} o={fin(f, tOne)} />
        <RTick p={T0} u1={unitV(TH + 180)} u2={unitV(TH + 90)} o={fin(f, tRA)} c={C.ink} />
        <Arrow p={T0} q={[T0[0] + unitV(TH + 90)[0] * 170, T0[1] + unitV(TH + 90)[1] * 170]} color={C.second} w={8} head={32} o={fin(f, tTh)} />
        <Keyword f={f} text="how does r̂ change?" at={[MX, 120]} s={T.key} appear={0} out={tDel - 20} />
        <Keyword f={f} text="Δθ: a small change in θ" at={[MX, 120]} s={T.key} appear={tDel + 2} out={tWhich - 20} />
        <Keyword f={f} text="which way?" at={[MX, 120]} s={T.key} appear={tWhich} out={tSo - 20} />
        <Keyword f={f} text="along θ̂" at={[MX, 120]} s={T.key} appear={tSo} targets={[[T0[0] + unitV(TH + 90)[0] * 170, T0[1] + unitV(TH + 90)[1] * 170]]} />
        <SkipChip f={f} k={k} to={keepTime("s08_product_rule")} />
      </Svg>
      <CalcStack f={f} x={MX + 20} y={260} size={T.calc} maxLines={3} rows={[
        { rhs: r1, at: tArc, size: 56 },
        { rhs: String.raw`=\Delta\theta`, at: tOne, size: 56, cont: true },
        { rhs: String.raw`0.1\ \mathrm{rad}\times\frac{180^\circ}{\pi}\approx5.7^\circ\approx6^\circ`, at: tEx, size: 48 },
        { rhs: String.raw`s=1\times0.1=0.1`, at: AT(k, 15, "slides the tip"), size: 48 },
      ]} o={fout(f, tSo - 10)} />
      <TeX s={EQ_S03} x={MX} y={420} size={48} o={fin(f, tSo)} />
      <Svg><CurvedLink f={f} from={[MX - 14, 260]} to={[mid[0] + 10, mid[1]]} start={tOne + 8} end={tSo - 8} bend={60} /></Svg>
    </Scene>
  );
};

// ================================================================ s04 the slopes of cosine and sine (D12 4-6)
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = K("s04_slopes_sin_cos");
  const tSlope = SS(k, 1), tParts = SS(k, 2), tMove = SS(k, 3), tEast = SS(k, 4), tNorth = SS(k, 5), tDiv = SS(k, 6), tCos = SS(k, 7), tSin = SS(k, 8),
    tMinus = SS(k, 9), tCheck = SS(k, 10), tTurn = SS(k, 11), tCd = SS(k, 12), tCr = SS(k, 13), tSd = SS(k, 14), tSr = SS(k, 15), tWorks = SS(k, 16);
  const T0 = tip(TH), T1 = tip(TH + DRAW_TURN);
  const foot0: Pt = [T0[0], UC[1]], foot1: Pt = [T1[0], UC[1]];
  const [eq1, eq2] = cutAt(EQ_S04, String.raw`,\qquad `);
  const G1: Ax = { x: 1150, y: 690, w: 250, h: 140, xr: [0, 360], yr: [-1, 1] }, G2: Ax = { ...G1, x: 1530 }; // K6 r0: below the calc rows
  const xs = Array.from({ length: 73 }, (_, i) => i * 5);
  const tan = (A: Ax, fn: (d: number) => number, sl: number) => { const P = axP(A), d0 = TH, y0 = fn(d0), w = 40;
    return [P(d0 - w, y0 - sl * w * D2R), P(d0 + w, y0 + sl * w * D2R)]; };
  const cosT = tan(G1, (d) => Math.cos(d * D2R), -0.8), sinT = tan(G2, (d) => Math.sin(d * D2R), 0.6);
  const oG = fin(f, tWorks - 30);
  const oDiag = 1;
  return (
    <Scene>
      <Svg>
        <UnitCircle c={UC} R={UR} />
        <Arrow p={UC} q={T0} color={C.second} w={10} head={40} o={oDiag} />
        <line x1={UC[0]} y1={UC[1]} x2={foot0[0]} y2={foot0[1]} stroke={C.second} strokeWidth={20} opacity={0.5 * win(f, tParts, tDiv)} />
        <line x1={foot0[0]} y1={foot0[1]} x2={T0[0]} y2={T0[1]} stroke={C.first} strokeWidth={20} opacity={0.5 * win(f, tParts, tDiv)} />
        <Lbl x={(UC[0] + foot0[0]) / 2} y={UC[1] + 46} t="cos θ" c={C.second} s={T.floor} a="middle" o={win(f, tParts, tDiv)} />
        <Lbl x={foot0[0] - 22} y={UC[1] - 50} t="sin θ" c={C.first} s={T.floor} a="end" o={win(f, tParts, tDiv)} />{/* K6 r0: was on the circle */}
        <Arrow p={UC} q={T1} color={C.second} w={8} head={32} o={fin(f, tMove) * 0.7} />
        <line x1={foot1[0]} y1={UC[1] - 6} x2={foot0[0]} y2={UC[1] - 6} stroke={C.neg} strokeWidth={18} opacity={win(f, tEast, tDiv + 60)} />
        <line x1={T1[0] + 14} y1={T1[1]} x2={T1[0] + 14} y2={T0[1]} stroke={C.first} strokeWidth={18} opacity={win(f, tNorth, tDiv + 60)} />
        <Lbl x={T1[0] - 40} y={T1[1] - 42} t="≈ −sin θ Δθ" c={C.neg} s={T.floor} a="end" o={win(f, tEast, tDiv + 60)} />
        <Lbl x={T1[0] + 40} y={T1[1] - 42} t="≈ cos θ Δθ" c={C.first} s={T.floor} o={win(f, tNorth, tDiv + 60)} />{/* K6 r0: was across the circle */}
        <Arrow p={T0} q={[T0[0] - 110, T0[1]]} color={C.neg} w={7} head={28} o={win(f, tMinus, tCheck)} />
        <Lbl x={UC[0]} y={UC[1] + UR + 70} t="turn drawn large (20°)" c={C.muted} s={T.floor} a="middle" o={win(f, tEast, tDiv + 60)} />{/* fix 0 B16 */}
        <Keyword f={f} text="how fast do cos and sin change?" at={[MX, 120]} s={T.floor} appear={0} out={tSlope - 20} />
        <Keyword f={f} text="slope = change ÷ change" at={[MX, 120]} s={T.key} appear={tSlope} out={tDiv - 20} />
        <Keyword f={f} text="east part shrinks" at={[MX, 120]} s={T.key} appear={tMinus} out={tCheck - 20} />
        <Keyword f={f} text="check with numbers" at={[MX, 120]} s={T.key} appear={tCheck} out={tWorks - 20} />
        <Keyword f={f} text="the rule works" at={[MX, 120]} s={T.key} appear={tWorks} />
        <g opacity={oG}>
          <Axes A={G1} xt={[90, 180, 270]} yt={[-1, 0, 1]} xf={(v) => `${v}°`} />
          <Curve A={G1} xs={xs} ys={xs.map((d) => Math.cos(d * D2R))} c={C.second} />
          <line x1={cosT[0][0]} y1={cosT[0][1]} x2={cosT[1][0]} y2={cosT[1][1]} stroke={C.gold} strokeWidth={5} />
          <Lbl x={G1.x + G1.w / 2} y={G1.y - 34} t="cos θ: slope −0.8" c={C.second} s={T.floor} a="middle" />
          <Axes A={G2} xt={[90, 180, 270]} yt={[-1, 0, 1]} xf={(v) => `${v}°`} />
          <Curve A={G2} xs={xs} ys={xs.map((d) => Math.sin(d * D2R))} c={C.first} dash="14 10" />
          <line x1={sinT[0][0]} y1={sinT[0][1]} x2={sinT[1][0]} y2={sinT[1][1]} stroke={C.gold} strokeWidth={5} />
          <Lbl x={G2.x + G2.w / 2} y={G2.y - 34} t="sin θ: slope 0.6" c={C.first} s={T.floor} a="middle" />
        </g>
      </Svg>
      {/* fix 0 B7: the move written in components (S3), the two Δ rows kept until S7, the division on S6 */}
      <CalcStack f={f} x={MX} y={220} size={46} maxLines={4} o={fout(f, tCos - 10)} rows={[
        { rhs: String.raw`\text{move}\approx\Delta\theta\,\hat{\boldsymbol\theta}=\Delta\theta\,(-\sin\theta,\ \cos\theta)`, at: tMove },
        { rhs: String.raw`=(-\sin\theta\,\Delta\theta,\ \ \cos\theta\,\Delta\theta)`, at: tMove + 45, cont: true },
        { rhs: String.raw`\Delta(\cos\theta)\approx-\sin\theta\,\Delta\theta`, at: tEast },
        { rhs: String.raw`\Delta(\sin\theta)\approx\cos\theta\,\Delta\theta`, at: tNorth },
        { rhs: String.raw`\frac{\Delta(\cos\theta)}{\Delta\theta}\approx-\sin\theta,\qquad \frac{\Delta(\sin\theta)}{\Delta\theta}\approx\cos\theta`, at: tDiv },
      ]} />
      <Svg><Lbl x={MX} y={640} t="Δθ → 0: ≈ becomes =" c={C.muted} s={T.floor} o={win(f, tDiv + 30, tCos - 10)} /></Svg>
      <TeX s={eq1} x={MX} y={260} size={T.eq} o={win(f, tCos, tCheck - 20)} />
      <TeX s={eq2} x={MX} y={480} size={T.eq} o={win(f, tSin, tCheck - 20)} />{/* K6 r0: was 8 px into eq1 */}
      {/* fix 0 B6: the check's inputs and each step on its own sentence (3-4-5 balloon, the turned angle, the looked-up values) */}
      <CalcStack f={f} x={MX} y={210} size={46} maxLines={4} rows={[
        { rhs: String.raw`\theta=53.13^\circ:\ \cos\theta=\tfrac35=0.6,\ \ \sin\theta=\tfrac45=0.8`, at: tCheck },
        { rhs: String.raw`\Delta\theta=0.01\ \mathrm{rad}=0.57^\circ\ \Rightarrow\ \theta+\Delta\theta=53.70^\circ`, at: tTurn, c: C.gold },
        { rhs: String.raw`\cos53.70^\circ=0.592,\quad 0.592-0.600=-0.008`, at: tCd },
        { rhs: String.raw`\frac{-0.008}{0.01}=-0.8=-\sin\theta`, at: tCr },
        { rhs: String.raw`\sin53.70^\circ=0.806,\quad 0.806-0.800=+0.006`, at: tSd },
        { rhs: String.raw`\frac{0.006}{0.01}=0.6=\cos\theta`, at: tSr },
      ]} />
    </Scene>
  );
};

// ================================================================ s05 dr̂/dθ = θ̂ (D13)
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = K("s05_dr_dtheta");
  const tDr = SS(k, 1), tName = SS(k, 2), tAbout = SS(k, 3), tDiv = SS(k, 4), tRate = SS(k, 5), tWrite = SS(k, 6), tD = SS(k, 7), tBooks = SS(k, 8), tSame = SS(k, 9),
    tComp = SS(k, 10), tSl = SS(k, 11), tTog = SS(k, 12), tBoth = SS(k, 13), tWords = SS(k, 14);
  const T0 = tip(TH), T1 = tip(TH + DRAW_TURN);
  const thAt = unitV(TH + 90);
  return (
    <Scene>
      <Svg>
        <UnitCircle c={UC} R={UR} />
        <Arrow p={UC} q={T0} color={C.second} w={10} head={40} o={0.5} />
        <Arrow p={UC} q={T1} color={C.second} w={10} head={40} />
        <Wedge c={UC} r={110} a0={TH} a1={TH + DRAW_TURN} o={0.8} />
        <Arrow p={T0} q={T1} color={C.gold} w={8} head={30} o={fin(f, tDr)} />
        <Lbl x={(T0[0] + T1[0]) / 2 + 10} y={(T0[1] + T1[1]) / 2 - 40} t="Δr̂" c={C.gold} s={T.key} o={fin(f, tName)} />
        <Arrow p={[T0[0] + 30, T0[1] + 20]} q={[T0[0] + 30 + thAt[0] * 150, T0[1] + 20 + thAt[1] * 150]} color={C.second} w={6} head={26} o={0.6 * fin(f, tAbout)} />
        <Lbl x={T0[0] + 50} y={T0[1] + 70} t="along θ̂" c={C.gold} s={T.floor} o={win(f, tAbout, tDiv + 40)} />
        <path d={arcD(UC, UR + 70, TH + 5, TH + 85)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tWords)} />
        <ArcHead c={UC} r={UR + 70} a={TH + 85} dir={1} col={C.gold} o={fin(f, tWords)} />
        <Keyword f={f} text="one arrow: the change" at={[MX, 120]} s={T.key} appear={0} out={tRate - 20} />
        <Keyword f={f} text="d = a tiny change" at={[MX, 120]} s={T.key} appear={tD} out={tComp - 20} />
        <Keyword f={f} text="part by part" at={[MX, 120]} s={T.key} appear={tComp} out={tWords - 20} />
        <Keyword f={f} text="r̂ swings towards θ̂" at={[MX, 120]} s={T.key} appear={tWords} />
      </Svg>
      <TeX s={String.raw`\Delta\hat{\mathbf r}\approx\hat{\boldsymbol\theta}\,\Delta\theta`} x={MX} y={260} size={T.calc} o={win(f, tAbout, tComp - 20)} />
      <TeX s={EQ_S05} x={MX} y={420} size={96} o={fin(f, tWrite)} glow={pulse(f, tWrite, 20)} />
      <TeX s={String.raw`d\hat{\mathbf r}=\hat{\boldsymbol\theta}\,d\theta`} x={MX + 360} y={420} size={56} c={C.local} o={win(f, tBooks, tComp - 20)} />
      <Svg><Lbl x={MX + 360} y={500} t="= same" c={C.gold} s={T.floor} o={win(f, tSame, tComp - 20)} /></Svg>
      {/* fix 0 B17 (a, b): straight ≈ curved for a small turn; then the division by Δθ */}
      <CalcStack f={f} x={MX} y={330} size={46} maxLines={3} o={fout(f, tWrite - 10)} rows={[
        { rhs: String.raw`|\Delta\hat{\mathbf r}|=${CI.chord01.toFixed(5)}\ \text{ vs arc }0.1\ \ (\Delta\theta=0.1)`, at: tAbout + 20 },
        { rhs: String.raw`\frac{\Delta\hat{\mathbf r}}{\Delta\theta}\approx\hat{\boldsymbol\theta}\ \ \xrightarrow{\ \Delta\theta\to0\ }\ \ \frac{d\hat{\mathbf r}}{d\theta}=\hat{\boldsymbol\theta}`, at: tDiv },
      ]} />
      <Svg><Lbl x={MX} y={560} t="straight ≈ curved (small turn)" c={C.muted} s={T.floor} o={win(f, tAbout + 30, tWrite - 10)} /></Svg>
      {/* fix 0 B17 (c): the middle line, slope by slope */}
      <TeX s={String.raw`\frac{d}{d\theta}(\cos\theta,\ \sin\theta)=\Big(\frac{d\cos\theta}{d\theta},\ \frac{d\sin\theta}{d\theta}\Big)`} x={MX} y={600} size={46} o={fin(f, tSl)} />
      <TeX s={String.raw`=(-\sin\theta,\ \cos\theta)=\hat{\boldsymbol\theta}`} x={MX + 40} y={690} size={52} o={fin(f, AT(k, 12, "which is theta hat"))} />
      <Svg><Lbl x={MX} y={790} t="both routes agree" c={C.gold} s={T.floor} o={fin(f, tBoth)} /></Svg>
    </Scene>
  );
};

// ================================================================ s06 dθ̂/dθ = −r̂, from scratch (D14 1-5)
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = K("s06_dtheta_dtheta");
  const t1 = SS(k, 3), t1b = SS(k, 5), t2 = SS(k, 7), t3 = SS(k, 10), t3b = SS(k, 11), t4 = SS(k, 14), t4b = SS(k, 16), t5 = SS(k, 18), tTh0 = SS(k, 20), tSw = SS(k, 21),
    tMin = SS(k, 22), tExact = SS(k, 23), tSmall = SS(k, 24), tRate = SS(k, 25);
  // fix 0 B8: on S18 both arrows ease back to the un-turned position, so −r̂ (drawn at θ + 180°) is exactly r̂ flipped
  const turn = DRAW_TURN * prog(f, t3b, t3b + 40) * (1 - prog(f, t5, t5 + 40));
  const toM = prog(f, tExact, tExact + 40);              // the step-4 slide arrow moves onto −r̂ (same direction)
  const R0 = tip(TH + turn), Q0 = tip(TH + 90 + turn), Qa = tip(TH + 90);
  const step = f < t2 ? 1 : f < t3 ? 2 : f < t4 ? 3 : f < t5 ? 4 : 5;
  const slideEnd: Pt = [Qa[0] + unitV(TH + 180)[0] * 150, Qa[1] + unitV(TH + 180)[1] * 150];
  const mr = tip(TH + 180, UR);
  return (
    <Scene>
      <Svg>
        <UnitCircle c={UC} R={UR} />
        <Arrow p={UC} q={R0} color={C.second} w={10} head={40} />
        <Lbl x={R0[0] + 20} y={R0[1] - 30} t="r̂" c={C.second} s={T.key} />
        <Arrow p={UC} q={Q0} color={C.second} w={10} head={40} o={fin(f, t1b)} dash={f < t2 ? "18 12" : undefined} />
        <Lbl x={Q0[0] - 20} y={Q0[1] - 34} t="θ̂" c={C.second} s={T.key} a="end" o={fin(f, t1b)} />
        <circle cx={UC[0]} cy={UC[1]} r={18} fill="none" stroke={C.gold} strokeWidth={5} opacity={win(f, t1b, t2)} />
        <path d={arcD(UC, UR + 30, TH + turn, TH + 90 + turn)} fill="none" stroke={C.gold} strokeWidth={5} opacity={win(f, t2, t4)} />
        <Lbl x={tip(TH + 45, UR + 80)[0]} y={tip(TH + 45, UR + 80)[1]} t="quarter turn ahead" c={C.gold} s={T.floor} a="middle" o={win(f, t2, t3)} />
        <Wedge c={UC} r={100} a0={TH} a1={TH + turn} o={win(f, t3b, t4)} />
        <Wedge c={UC} r={100} a0={TH + 90} a1={TH + 90 + turn} o={win(f, t3b, t4)} />
        <path d={arcD(UC, UR, TH + 90, TH + 90 + turn)} fill="none" stroke={C.second} strokeWidth={12} opacity={win(f, t3b, t4b)} />
        <Lbl x={tip(TH + 100, UR + 100)[0] + 24} y={tip(TH + 100, UR + 100)[1]} t="Δθ" c={C.second} s={T.key} a="end" o={win(f, t3b, t4)} />
        <Arrow p={[mix(Qa[0], UC[0], toM), mix(Qa[1], UC[1], toM)]} q={[mix(slideEnd[0], UC[0] + unitV(TH + 180)[0] * 150, toM), mix(slideEnd[1], UC[1] + unitV(TH + 180)[1] * 150, toM)]}
          color={C.neg} w={8} head={30} o={fin(f, t4b) * (f > tExact + 40 ? 0.6 : 1)} />
        <Lbl x={UC[0] + unitV(TH + 180)[0] * 90 - 20} y={UC[1] + unitV(TH + 180)[1] * 90 + 70} t="same direction" c={C.gold} s={T.floor} a="end" o={fin(f, tExact + 40)} />
        <RTick p={Qa} u1={unitV(TH + 270)} u2={unitV(TH + 180)} o={win(f, t4b, t5 + 30)} />
        <Lbl x={slideEnd[0] - 10} y={slideEnd[1] + 50} t="θ̂ turned 90°" c={C.neg} s={T.floor} a="end" o={win(f, t4b, tMin)} />
        <Arrow p={UC} q={mr} color={C.neg} w={10} head={40} o={fin(f, tExact)} />
        <Lbl x={mr[0] - 10} y={mr[1] + 50} t="−r̂" c={C.neg} s={T.key} a="end" o={fin(f, tExact)} />
        <Lbl x={UC[0]} y={UC[1] + UR + 70} t={`step ${step}`} c={C.muted} s={T.floor} a="middle" o={fin(f, t1) * fout(f, tSmall - 10)} />
        <Keyword f={f} text="how does θ̂ change?" at={[MX, 120]} s={T.key} appear={0} out={t5 - 20} />
        <Keyword f={f} text="swap, minus on the first" at={[MX, 120]} s={T.floor} appear={t5} out={tSmall - 20} />
        <Keyword f={f} text="θ̂ swings towards −r̂" at={[MX, 120]} s={T.key} appear={tSmall} />
      </Svg>
      <CalcStack f={f} x={MX + 300} y={230} size={48} maxLines={3} rows={[
        { lhs: String.raw`\hat{\boldsymbol\theta}`, rhs: String.raw`=(-\sin\theta,\ \cos\theta)`, at: tTh0 },
        { lhs: String.raw`\text{swap}`, rhs: String.raw`\to(\cos\theta,\ -\sin\theta)`, at: tSw },
        { lhs: String.raw`\text{minus first}`, rhs: String.raw`\to(-\cos\theta,\ -\sin\theta)`, at: tMin },
        { rhs: String.raw`=-\hat{\mathbf r}`, at: tExact, cont: true, glow: pulse(f, tExact, 20) },
      ]} o={fout(f, tSmall - 6)} />
      <TeX s={String.raw`\Delta\hat{\boldsymbol\theta}\approx-\hat{\mathbf r}\,\Delta\theta`} x={MX} y={300} size={T.calc} o={fin(f, tSmall)} />
      {/* fix 0 B18: the arc rule restated on S13 */}
      <TeX s={String.raw`s=1\times\Delta\theta=\Delta\theta`} x={MX} y={300} size={56} o={win(f, SS(k, 13), t4b - 10)} />
      <TeX s={EQ_S06} x={MX} y={480} size={96} o={fin(f, tRate)} />
    </Scene>
  );
};

// ================================================================ s07 what −r̂ means at the balloon (D14 6 + checks)
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_toward_centre");
  const tBal = SS(k, 1), tDraw = SS(k, 2), tEast = SS(k, 3), tLean = SS(k, 4), tSlide = SS(k, 5), tSwing = SS(k, 6), tMeans = SS(k, 7), tWe = SS(k, 8),
    tNum = SS(k, 9), tAt = SS(k, 10), tAfter = SS(k, 11), tChg = SS(k, 12), tDiv = SS(k, 13), tRh = SS(k, 14), tComp = SS(k, 15), tSl = SS(k, 16), tRule = SS(k, 18);
  const S: Pt = [330, 520], Rb = 260;
  const angs = [0, 25, 53.13];
  const pts = angs.map((a) => polar(S, Rb, a));
  const L = 150;
  const inset: Pt = [780, 300];
  const sl = prog(f, tSlide, tSlide + 50);
  const lift = (i: number): Pt => [mix(pts[i][0], inset[0], sl), mix(pts[i][1], inset[1], sl)];
  const tipsI = angs.map((a, i) => { const b = lift(i), u = unitV(a + 90); return [b[0] + u[0] * L, b[1] + u[1] * L] as Pt; });
  const oCalc = fin(f, tNum);
  return (
    <Scene>
      <Svg>
        <circle cx={S[0]} cy={S[1]} r={Rb} fill="none" stroke={C.local} strokeWidth={4} />
        <g transform={`translate(${S[0]} ${S[1]})`}><rect x={-8} y={-60} width={16} height={60} fill={C.local} /><circle cx={0} cy={6} r={16} fill={C.local} /></g>
        <Lbl x={S[0]} y={S[1] + 64} t="station" c={C.local} s={T.floor} a="middle" o={fin(f, tBal)} />
        {/* fix 0 B18: the circle's radius and the three balloon angles; the inset named */}
        <Lbl x={S[0]} y={S[1] + Rb + 56} t="r = 5 km" c={C.local} s={T.floor} a="middle" o={fin(f, tBal)} />
        {pts.map((q, i) => <Lbl key={`ang${i}`} x={q[0] - 24} y={q[1] + 40} t={["0°", "25°", "53°"][i]} c={C.muted} s={T.floor} a="end" o={fin(f, tDraw + 10 * i)} />)}
        <Lbl x={inset[0]} y={inset[1] + 56} t="tails together" c={C.muted} s={T.floor} a="middle" o={fin(f, tSlide + 30)} />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={12} fill={C.key} stroke={C.bg} strokeWidth={4} opacity={fin(f, tDraw + 10 * i)} />)}
        {angs.map((a, i) => { const b = lift(i), u = unitV(a + 90);
          return <Arrow key={i} p={b} q={[b[0] + u[0] * L, b[1] + u[1] * L]} color={C.second} w={8} head={30} o={fin(f, i === 0 ? tEast : i === 1 ? tLean : tLean + 20)} />; })}
        <Lbl x={pts[0][0] + 24} y={pts[0][1] - 90} t="north" c={C.key} s={T.floor} o={win(f, tEast, tSlide)} />
        <Lbl x={pts[1][0] - 20} y={pts[1][1] - 170} t="leans west" c={C.key} s={T.floor} a="end" o={win(f, tLean, tSlide)} />
        <path d={poly3(tipsI)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tSwing)} />
        <Arrow p={tipsI[0]} q={tipsI[1]} color={C.neg} w={6} head={22} o={fin(f, tSwing)} />
        <Arrow p={tipsI[1]} q={tipsI[2]} color={C.neg} w={6} head={22} o={fin(f, tSwing)} />
        <Arrow p={pts[2]} q={[mix(pts[2][0], S[0], 0.45), mix(pts[2][1], S[1], 0.45)]} color={C.neg} w={10} head={36} o={fin(f, tMeans)} />
        <Lbl x={mix(pts[2][0], S[0], 0.45) + 20} y={mix(pts[2][1], S[1], 0.45) + 40} t="−r̂" c={C.neg} s={T.key} o={fin(f, tMeans)} />
        <CurvedLink f={f} from={[(tipsI[1][0] + tipsI[2][0]) / 2, (tipsI[1][1] + tipsI[2][1]) / 2 + 8]} to={[mix(pts[2][0], S[0], 0.3), mix(pts[2][1], S[1], 0.3) - 10]} start={tMeans + 10} end={tNum - 8} bend={-40} />
        <Keyword f={f} text="θ̂ at the balloon" at={[MX, 120]} s={T.key} appear={0} out={tWe - 20} />
        <Keyword f={f} text="tip swings towards the centre" at={[MX, 120]} s={T.floor} appear={tWe} out={tNum - 20} />
        <Keyword f={f} text="check with numbers" at={[MX, 120]} s={T.key} appear={tNum} out={tRule - 20} />
        <Keyword f={f} text="r̂ → towards θ̂ · θ̂ → towards −r̂" at={[MX, 120]} s={T.floor} appear={tRule} />
      </Svg>
      {/* heavy-phase K6 r0: size 56 ran the second row past the 1842 edge; fraction rows get their real height */}
      {/* fix 0 B9: the inputs, the subtraction and r̂ written out (left-aligned so the long rows fit inside 1842) */}
      <CalcStack f={f} x={MX} y={210} size={44} maxLines={4} o={oCalc * fout(f, tRule - 6)} rows={[
        { rhs: String.raw`\hat{\boldsymbol\theta}(53.13^\circ)=(-0.8,\ 0.6)`, at: tAt },
        { rhs: String.raw`\hat{\boldsymbol\theta}(53.70^\circ)=(-\sin53.70^\circ,\ \cos53.70^\circ)`, at: tAfter },
        { rhs: String.raw`=(-0.806,\ 0.592)`, at: AT(k, 11, "minus zero point eight zero six"), cont: true },
        { rhs: String.raw`\Delta\hat{\boldsymbol\theta}=\big(-0.806-(-0.800),\ \ 0.592-0.600\big)=(-0.006,\ -0.008)`, at: tChg, size: 44 },
        { rhs: String.raw`\frac{(-0.006,\ -0.008)}{0.01}=(-0.6,\ -0.8)`, at: tDiv },
        { rhs: String.raw`\hat{\mathbf r}=(0.6,\ 0.8)\ \Rightarrow\ (-0.6,\ -0.8)=-\hat{\mathbf r}`, at: tRh, glow: pulse(f, tRh, 20) },
        { rhs: String.raw`\frac{d\hat{\boldsymbol\theta}}{d\theta}=(-\cos\theta,\ -\sin\theta)`, at: tSl },
        { rhs: String.raw`=-\hat{\mathbf r}`, at: SS(k, 17), cont: true },
      ]} />
      <Svg><Lbl x={MX} y={720} t="same numbers as the slope check" c={C.muted} s={T.floor} o={win(f, tAfter + 20, tChg - 10)} />
        <Lbl x={MX} y={790} t="slopes, part by part" c={C.key} s={T.floor} o={win(f, tComp, tRule - 20)} /></Svg>
      <TeX s={EQ_S07} x={MX} y={330} size={64} o={fin(f, tRule)} />
    </Scene>
  );
};
const poly3 = (p: Pt[]) => `M${p[0][0]} ${p[0][1]} Q${p[1][0]} ${p[1][1]} ${p[2][0]} ${p[2][1]}`;

// ================================================================ s08 the product rule (D15)
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = K("s08_product_rule");
  const tTool = SS(k, 3), tQ = SS(k, 5), tEasy = SS(k, 6), tTake = SS(k, 7), tProd = SS(k, 8), tLater = SS(k, 9), tTurn = SS(k, 10), tNow = SS(k, 11),
    tChg = SS(k, 12), tWhere = SS(k, 13), tP1 = SS(k, 15), tP2 = SS(k, 16), tP3 = SS(k, 17), tAdd = SS(k, 18), tKey = SS(k, 19), tHalf = SS(k, 21),
    tDivDt = SS(k, 22), tRule = SS(k, 23), tSay = SS(k, 24);
  const O: Pt = [180, 640], U = 70;                          // 1 m/s = 70 px
  const P = (x: number, y: number): Pt => [O[0] + x * U, O[1] - y * U];
  const p0 = P(10, 0), p1 = P(PR.P1[0], PR.P1[1]);
  const pc = PR.pieces as number[][];
  // fix 0 B5: the change drawn 200 px per m/s (≈ 3× the grid's 70) ABOVE the grid (y 180-400), linked to the grid's gold arrow
  const ZO: Pt = [660, 400], Z = 200;
  const zp = (v: Pt): Pt => [ZO[0] + v[0] * Z, ZO[1] - v[1] * Z];
  const hv = PR.halv as number[][];
  const oChange = fin(f, tWhere), oHalf = fin(f, tHalf);
  const d1 = PR.d1 as number[];
  const pm: Pt = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
  const n3 = (v: number) => (v >= 0.99 ? "1" : v >= 0.1 ? `${Math.round(v * 100) / 100}` : v.toFixed(3).replace(/0+$/, ""));
  return (
    <Scene>
      <Svg>
        <g opacity={fout(f, tTool - 14)}>
          <circle cx={520} cy={450} r={200} fill="none" stroke={C.local} strokeWidth={5} />
          <Arrow p={[520, 450]} q={polar([520, 450], 200, 40)} color={C.second} w={9} head={34} />
          <Arrow p={[520, 450]} q={polar([520, 450], 200, 130)} color={C.second} w={9} head={34} />
          <path d={arcD([520, 450], 240, 45, 120)} fill="none" stroke={C.gold} strokeWidth={5} /><ArcHead c={[520, 450]} r={240} a={120} dir={1} col={C.gold} />
          <path d={arcD([520, 450], 240, 135, 210)} fill="none" stroke={C.gold} strokeWidth={5} /><ArcHead c={[520, 450]} r={240} a={210} dir={1} col={C.gold} />
        </g>
        {/* fix 0 B3: the grid gives way to the halving bars (it sat under them) */}
        <g opacity={fin(f, tEasy) * fout(f, tHalf - 10)}>
          {Array.from({ length: 13 }, (_, i) => <line key={`v${i}`} x1={P(i, 0)[0]} y1={P(0, -1)[1]} x2={P(i, 0)[0]} y2={P(0, 3)[1]} stroke={C.grid} strokeWidth={1.5} />)}
          {[-1, 0, 1, 2, 3].map((j) => <line key={`h${j}`} x1={P(0, j)[0]} y1={P(0, j)[1]} x2={P(12, j)[0]} y2={P(0, j)[1]} stroke={C.grid} strokeWidth={1.5} />)}
          <Arrow p={O} q={p0} color={C.first} w={10} head={36} o={fin(f, tProd) * (f > tNow ? 0.4 : 1)} />
          <Arrow p={O} q={[O[0] + 1 * U, O[1]]} color={C.second} w={8} head={28} o={win(f, tTake, tNow)} />
          {/* fix 0 B4: the turned unit arrow d̂_new = (cos 0.1, sin 0.1), drawn on S10 */}
          <Arrow p={O} q={P(d1[0], d1[1])} color={C.second} w={8} head={28} o={win(f, tTurn, tNow + 30)} />
          <Arrow p={O} q={p1} color={C.first} w={10} head={36} o={fin(f, tNow)} />
          <Wedge c={O} r={170} a0={0} a1={0.1 / D2R} o={fin(f, tTurn)} />
          <Lbl x={O[0] + 230} y={O[1] - 84} t="0.1 rad" c={C.gold} s={T.floor} o={fin(f, tTurn)} />{/* K6 r0: was on the turned arrow */}
          <Arrow p={p0} q={p1} color={C.gold} w={6} head={22} o={fin(f, tChg)} />
          <Lbl x={P(0, 0)[0]} y={P(0, -1)[1] + 50} t="1 m/s per square" c={C.muted} s={T.floor} o={fin(f, tEasy)} />
        </g>
        <g opacity={oChange * fout(f, tHalf - 10)}>
          {/* fix 0 B5: a dashed gold leader from the grid's change arrow to its enlarged copy; scale stated; each piece tagged on its words */}
          <line x1={pm[0] - 8} y1={pm[1] - 10} x2={ZO[0] + 6} y2={ZO[1] + 8} stroke={C.gold} strokeWidth={3} strokeDasharray="10 8" opacity={0.8} />
          <Arrow p={zp([0, 0])} q={zp([pc[0][0], pc[0][1]])} color={C.local} w={9} head={30} o={fin(f, tP1)} />
          <Arrow p={zp([pc[0][0], pc[0][1]])} q={zp([pc[0][0] + pc[1][0], pc[0][1] + pc[1][1]])} color={C.second} w={9} head={30} o={fin(f, tP2)} />
          <Arrow p={zp([pc[0][0] + pc[1][0], pc[0][1] + pc[1][1]])} q={zp([PR.dP[0], PR.dP[1]])} color={C.neg} w={7} head={22} o={fin(f, tP3)} />
          <Arrow p={zp([0, 0])} q={zp([PR.dP[0], PR.dP[1]])} color={C.gold} w={5} head={22} o={fin(f, tWhere) * 0.7} />
          <Lbl x={ZO[0] - 10} y={ZO[1] + 55} t="change, drawn 3× larger" c={C.muted} s={T.floor} a="end" o={fin(f, tWhere)} />
          <Lbl x={zp([pc[0][0], 0])[0] + 16} y={ZO[1] + 6} t="(1, 0)" c={C.local} s={T.floor} o={fin(f, tP1)} />
          <Lbl x={zp([pc[0][0], 0])[0] + 16} y={ZO[1] - Z * 0.5} t="(−0.05, 1)" c={C.second} s={T.floor} o={fin(f, tP2)} />
          <Lbl x={zp([PR.dP[0], PR.dP[1]])[0] - 24} y={zp([PR.dP[0], PR.dP[1]])[1] - 34} t="(−0.005, 0.1)" c={C.neg} s={T.floor} a="end" o={fin(f, tP3)} />
          <Lbl x={zp([PR.dP[0] / 2, PR.dP[1] / 2])[0] - 26} y={zp([PR.dP[0] / 2, PR.dP[1] / 2])[1] + 10} t="sum (0.945, 1.1)" c={C.gold} s={T.floor} a="end" o={fin(f, tAdd)} />
        </g>
        <g opacity={oHalf * fout(f, tRule - 10)}>
          {/* fix 0 B3: each bar has its number; groups 300 px apart so the numbers fit */}
          {[0, 1, 2].map((i) => { const x = 100 + i * 305, y0 = 700;
            return <g key={i} opacity={fin(f, [tHalf, AT(k, 21, "the first two"), AT(k, 21, "the third one")][i])}>
              {[0, 1, 2].map((j) => { const h = Math.max(4, (hv[i][j] / (j === 2 ? 0.1 : 1)) * 120);
                return <g key={j}><rect x={x + j * 100} y={y0 - h} width={52} height={h} fill={[C.local, C.second, C.neg][j]} opacity={0.85} />
                  <Lbl x={x + j * 100 + 26} y={y0 + 38} t={n3(hv[i][j])} c={[C.local, C.second, C.neg][j]} s={T.floor} a="middle" /></g>; })}
              <Lbl x={x + 126} y={y0 + 104} t={`Δt = ${["1", "0.5", "0.25"][i]} s`} c={C.muted} s={T.floor} a="middle" />
            </g>; })}
          <Lbl x={100} y={392} t="third bar drawn 10× taller" c={C.muted} s={T.floor} />
        </g>
        <Keyword f={f} text="what to keep: r̂ → θ̂, θ̂ → −r̂" at={[MX, 120]} s={T.floor} appear={0} out={tTool - 20} />
        <Keyword f={f} text="the product rule" at={[MX, 120]} s={T.key} appear={tTool} out={tKey - 20} />
        <Keyword f={f} text="small × small vanishes" at={[MX, 120]} s={T.key} appear={tKey} out={tRule - 20} />
        <SkipChip f={f} k={k} to={keepTime("s13_acceleration_numbers")} a={1} b={2} />
        <Lbl x={MX} y={230} t="number × arrow: both change" c={C.key} s={T.floor} o={win(f, tQ, tEasy - 20)} />
        {/* fix 0 B19: the toy numbers appear on their words; d̂ named */}
        <Lbl x={MX} y={210} t="v = 10 m/s · d̂ = (1, 0), length 1" c={C.key} s={T.floor} o={win(f, tTake, tKey - 20)} />
        <Lbl x={MX} y={270} t="→ 11 m/s" c={C.key} s={T.floor} o={win(f, tLater, tKey - 20)} />
        <Lbl x={MX + 230} y={270} t="· d̂ turns 0.1 rad" c={C.key} s={T.floor} o={win(f, tTurn, tKey - 20)} />
        <Lbl x={MX} y={640} t="first two stay ≈ 1" c={C.muted} s={T.floor} o={win(f, tDivDt + 20, tRule - 20)} />
      </Svg>
      {/* fix 0 B4: every toy number with its origin, one row per sentence (left-aligned, so the long rows fit) */}
      <CalcStack f={f} x={MX} y={320} size={44} maxLines={4} o={fout(f, tKey - 8)} rows={[
        { rhs: String.raw`10\,(1,\ 0)=(10,\ 0)`, at: tProd },
        { rhs: String.raw`\Delta v=11-10=1\ \mathrm{m/s}`, at: tLater },
        { rhs: String.raw`\hat{\mathbf d}_{\text{new}}=(\cos0.1,\ \sin0.1)\approx(0.995,\ 0.1)`, at: tTurn },
        { rhs: String.raw`11\,(0.995,\ 0.1)\approx(10.945,\ 1.1)`, at: tNow },
        { rhs: String.raw`(10.945,\ 1.1)-(10,\ 0)=(0.945,\ 1.1)`, at: tChg },
        { rhs: String.raw`1\,(1,\ 0)=(1,\ 0)`, at: tP1, c: C.local },
        { rhs: String.raw`\Delta\hat{\mathbf d}=(0.995,\ 0.1)-(1,\ 0)=(-0.005,\ 0.1)`, at: AT(k, 16, "which went from") },
        { rhs: String.raw`10\,(-0.005,\ 0.1)=(-0.05,\ 1)`, at: AT(k, 16, "ten times that"), c: C.second },
        { rhs: String.raw`1\,(-0.005,\ 0.1)=(-0.005,\ 0.1)`, at: tP3, c: C.neg },
        { rhs: String.raw`\text{sum}=(0.945,\ 1.1)`, at: tAdd, glow: pulse(f, tAdd + 20, 20) },
      ]} />
      {/* fix 0 B3: the halving in numbers, then the division by the time step (the step that makes piece 3 vanish) */}
      <CalcStack f={f} x={MX} y={300} size={44} maxLines={4} o={fout(f, tRule - 10)} rows={[
        { rhs: String.raw`\Delta t=1:\ \ 1,\ \ 1,\ \ 0.1`, at: tHalf },
        { rhs: String.raw`\Delta t=0.5:\ \ 0.5,\ \ 0.5,\ \ 0.025`, at: AT(k, 21, "the first two") },
        { rhs: String.raw`\Delta t=0.25:\ \ 0.25,\ \ 0.25,\ \ 0.006`, at: AT(k, 21, "the third one") },
        { rhs: String.raw`\div\Delta t:\ \ 0.1\to0.05\to0.025\to0`, at: AT(k, 22, "but the third"), c: C.neg },
      ]} />
      <TeX s={EQ_S08} x={MX} y={460} size={64} o={fin(f, tRule)} />
      <Svg>
        <Lbl x={MX} y={600} t="number's rate × arrow" c={C.gold} s={T.floor} o={fin(f, tSay)} />
        <Lbl x={MX} y={670} t="+ number × arrow's rate" c={C.gold} s={T.floor} o={fin(f, tSay + 20)} />
      </Svg>
    </Scene>
  );
};

export const SCENES_A: Record<string, React.FC> = {
  s00_title: S00, s01_hook: S01, s02_part1_recap: S02, s03_tip_on_circle: S03, s04_slopes_sin_cos: S04, s05_dr_dtheta: S05, s06_dtheta_dtheta: S06,
  s07_toward_centre: S07, s08_product_rule: S08,
};
void [EQ_S02, nf, GeoImg, SE, RING];
