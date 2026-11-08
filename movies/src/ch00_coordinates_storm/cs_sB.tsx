// ch00_coordinates_storm scenes s09-s20: maths block 2 on Ian's 25-km ring (dθ/dt = v/r, the position arrow, v θ̂, −(v²/r) r̂),
// the numbers, why a steady speed accelerates; then the tall storm: cylindrical coordinates on the GOES-16 plate (three.js), the
// three wind parts, is Ian shown right (NEXRAD radar eye vs the model's calm centre), the HRRR layer stack (three.js, orbit,
// one close look) and the radius-height section. Every number on screen is asserted against data/cs.json below.
import React, { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { C, FONT, T } from "../house/kit/type";
import { Pt, pulse } from "../house/kit/draw";
import { TeX } from "../house/kit/tex";
import { CalcStack } from "./cs_lib";  // K6 r0: fraction rows get their real height
import { Keyword } from "./cs_lib";   // Part 1 lessons C1: maths in $…$
import { CurvedLink } from "../house/kit/extras";
import { GlobeFrame, SourceBelow } from "../house/kit/frame";
import { View3D as HView3D, Arrow3D as HArrow3D, Rod3D as HRod3D, Ball3D as HBall3D } from "../house/kit/three3d";
import { OrbitKey, orbitCam as hOrbitCam, orbitPath as hOrbitPath, projector as hProjector, V3 } from "../house/kit/cam";
import { LayerStack3D, StackLayer } from "../house/kit/stack3d";
import { useTex } from "./kit_cs/globe";
import {
  AT, ArcHead, Arrow, ColourBar, Cross, D, D2R, DashArrow, GeoImg, GeoMap, IMG, K, LEN, LUT_DBZ, LUT_W, Lbl, Parcel, RING, RTick, SAY, SEC, SRC, SS, STK, Scene, WV,
  SideCallout, SpeedBar, Svg, URBar, Wedge, arcD, boxAt, clamp, fin, fout, linesPath, mix, nf, polar, poly, prog, win, Recall, goldAt, tailIn, hiOn, hiSize,
} from "./cs_lib";
import { EQ_S09, EQ_S09R, EQ_URUT, EQ_S15C, EQ_S10, EQ_S11, EQ_S12, EQ_S13, EQ_S14, EQ_S15, EQ_S16, EQ_S20, cutAt } from "./cs_eq";

const S17D = D.s17, GO = D.goes;
// ---------------------------------------------------------------- numbers on screen = the data (the render fails otherwise)
const CHECK_B: [string, number, number, number][] = [
  ["v", RING.v, 34.8, 0.05], ["omega", RING.om, 0.00139, 5e-6], ["omega deg/s", RING.om / D2R, 0.08, 0.005], ["omega deg/min", (RING.om / D2R) * 60, 5, 0.3],
  ["lap s", (2 * Math.PI) / RING.om, 4500, 50], ["lap min", (2 * Math.PI) / RING.om / 60, 75, 0.5], ["acc", RING.acc, 0.048, 0.0006], ["g ratio", 9.81 / RING.acc, 200, 5],
  ["dth60", RING.dth60, 0.084, 0.0006], ["dv60", RING.dv60, 2.9, 0.05], ["f ratio", RING.fratio, 20, 1.5], ["d eye", S17D.d_eye, 17, 0.5],
  ["p model", S17D.pmin, 960, 0.5], ["p best", S17D.best, 938, 0], ["radar r", S17D.r_fit, 30, 2],
  ["z925", STK.z_km[0], 0.7, 0.05], ["z850", STK.z_km[1], 1.4, 0.05], ["z500", STK.z_km[2], 6, 0.25], ["z200", STK.z_km[3], 12, 0.5], ["z150", STK.z_km[4], 14, 0.3],
  ["vr925", STK.vr100[0], -6.5, 0.05], ["vr850", STK.vr100[1], 0, 0.5], ["vr500", STK.vr100[2], 1, 0.1], ["vr200", STK.vr100[3], 1, 0.1], ["vr150", STK.vr100[4], 6.5, 0.2],
  ["sec min", SEC.min[0], -16, 0.5], ["sec min r", SEC.min[1], 30, 0], ["sec max", SEC.max[0], 9, 0.25], ["sec max r", SEC.max[1], 125, 0], ["vt max", SEC.vtmax[0], 55, 0.05],
  ["vt max r", SEC.vtmax[1], 30, 0], ["vt10", SEC.vt10_25, 34.8, 0.05],
  // measured rising air (DS29-DS30): the screen strings below
  ["w peak", WV.tdr.peak[0], 3.3, 0.05], ["w peak z", WV.tdr.peak[1], 8.5, 0], ["w peak r", WV.tdr.peak[2], 45, 0], ["w tower", WV.tdr.point_max[0], 11.6, 0.1],
  ["w p999", WV.tdr.p999, 8.9, 0.1], ["w cont", WV.cont.mean_18_26, 1.0, 0.1], ["w cont r", WV.cont.slanted[0][2], 18, 0], ["eye", WV.tdr.eye_km, 20, 0],
  // #5b r1 M10: the spin row's inputs (Ω from f = 2Ω sin φ at the ring's latitude; φ printed to 0.1°; the sum with one rounding)
  ["Omega", RING.f / (2 * Math.sin(D.ian_c[0] * D2R)), 7.29e-5, 5e-8], ["phi", D.ian_c[0], 26.5, 0.05], ["fv", RING.f * RING.v, 0.0023, 5e-5], ["push (shown values)", Number(nf(RING.acc, 3)) + Number(nf(RING.f * RING.v, 4)), 0.050, 5e-4],
  ["dt h", WV.tdr.dt_h, 7.6, 0.05], ["say w", SAY.w_ring, 3, 0], ["said tower (fix loop 1: near twelve)", Math.round(WV.tdr.point_max[0]), 12, 0], ["say cont", SAY.w_cont, 1, 0],
];
CHECK_B.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

// #5b r3 S2 (A1): the s20 box estimate's product and quotient on screen, from the data's said values (h, |u_r|, r)
const WB = SAY.w_box as { h_m: number; ur: number; r_m: number; w: number };
const WB_PROD = 2 * WB.h_m * WB.ur, WB_Q = WB_PROD / WB.r_m;
/** a whole number in TeX with a thin space every three digits from 10 000 up (1000 stays 1000, as on the other rows) */
const kSep = (n: number) => { const t = String(Math.round(n)); return n >= 10000 ? t.replace(/\B(?=(\d{3})+(?!\d))/g, String.raw`\,`) : t; };
[["w box quotient", WB_Q, WB.w, 0.005], ["w box said", Math.round(WB_Q), SAY.w_cont, 0], ["w box product", WB_PROD, 32000, 0], ["w box r", WB.r_m, 30000, 0], ["w box h", WB.h_m, 1000, 0]]
  .forEach(([n, v, r, tol]) => { if (!(Math.abs((v as number) - (r as number)) <= (tol as number))) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

const MX = 1100;
const RC: Pt = [500, 460], RR = 300;                       // Ian's 25-km ring, drawn (no map: a clean top view, s09-s14)
const unitV = (a: number): Pt => [Math.cos(a * D2R), -Math.sin(a * D2R)];
/** the parcel's angle: one lap of 75 min shown in ≈ 10 s (time compressed) */
const lapA = (f: number, a0 = 20, per = 300) => a0 + (360 * f) / per;
const RingBase: React.FC<{ o?: number; km?: boolean }> = ({ o = 1, km = true }) => o <= 0 ? null : (
  <g opacity={o}>
    <circle cx={RC[0]} cy={RC[1]} r={RR} fill="none" stroke={C.local} strokeWidth={5} />
    <circle cx={RC[0]} cy={RC[1]} r={36} fill="#22304a" stroke={C.local} strokeWidth={3} />
    <circle cx={RC[0]} cy={RC[1]} r={7} fill={C.local} />
    {km ? <Lbl x={RC[0]} y={RC[1] + RR + 60} t="Ian's ring: $r$ = 25 km" c={C.local} s={T.floor} a="middle" /> : null}
  </g>
);
const ClockG: React.FC<{ x: number; y: number; t: string; frac: number; o?: number }> = ({ x, y, t, frac, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <circle cx={x} cy={y} r={30} fill="none" stroke={C.ink} strokeWidth={4} />
    <line x1={x} y1={y} x2={x + Math.sin(frac * 2 * Math.PI) * 22} y2={y - Math.cos(frac * 2 * Math.PI) * 22} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
    <Lbl x={x + 46} y={y} t={t} c={C.key} s={T.floor} />
  </g>
);

// ================================================================ s09 dθ/dt = v/r (D16)
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09_dtheta_dt");
  // remake 2026-11-07 (R12): S1-S7 recall Part 1's u_r / u_θ split, one worked point and the 72-point ring average; the old S1-S2
  // became S7 ("call that speed v"); old S3… are now S8…
  const tQ = SS(k, 1), tP1 = SS(k, 2), tF = SS(k, 3), tEx = SS(k, 4), tExR = SS(k, 5), tAvg = SS(k, 6), tV = SS(k, 7);
  const tV35 = tAvg, tGrow = SS(k, 8), tDt = SS(k, 11), tArc = SS(k, 12), tAng = SS(k, 13), tDiv = SS(k, 14), tRate = SS(k, 15), tNum = SS(k, 16),
    tN1 = SS(k, 17), tCancel = SS(k, 18), tDeg = SS(k, 19), tLap = SS(k, 20), tLap2 = SS(k, 21);
  const [u1, u2] = cutAt(EQ_URUT, String.raw`,\qquad `);
  const oRec = fout(f, tGrow - 10);
  // fix loop 1 (r8 review 2 S6, S7, S8): word times of the inputs (gold) and of each result
  const tC6 = AT(k, 4, "zero point six"), tS8 = AT(k, 4, "zero point eight"), tUr6 = AT(k, 5, "is six"), tUt8 = AT(k, 5, "minus eight"),
    t348 = AT(k, 6, "thirty four point eight"), tRad = AT(k, 17, "zero point zero zero one"), t573 = AT(k, 19, "fifty seven point three");
  const [avgL, avgR] = cutAt(EQ_S09R, String.raw`\approx`);
  const Pb = polar(RC, RR, 53.13), er = unitV(53.13), et = unitV(143.13);
  const a0 = 30, aW = 30;                                     // the short time Δt drawn as a 30° step
  const P0 = polar(RC, RR, a0), P1 = polar(RC, RR, a0 + aW);
  const lapFrac = clamp((f - tLap) / (LEN(k) - tLap), 0, 1);
  // #5b r1 M6: from "one full lap" on, the parcel makes exactly one lap while the clock runs 0 → 75 min (it ran 1.3 laps before)
  const a = f < tLap ? lapA(f) : lapA(tLap) + 360 * lapFrac, p = polar(RC, RR, a);
  return (
    <Scene>
      <Svg>
        <RingBase />
        <Parcel p={p} o={fout(f, tDt - 6) + fin(f, tLap)} />
        <DashArrow f={f} p={p} q={[p[0] + unitV(a + 90)[0] * 130, p[1] + unitV(a + 90)[1] * 130]} o={fin(f, tV) * (fout(f, tDt - 6) + fin(f, tLap))} />
        <g opacity={win(f, tDt, tLap - 20)}>
          <Parcel p={P0} /><Parcel p={P1} o={0.6} />
          <path d={arcD(RC, RR, a0, a0 + aW)} fill="none" stroke={C.first} strokeWidth={12} />
          <Lbl x={polar(RC, RR + 60, a0 + aW / 2)[0]} y={polar(RC, RR + 60, a0 + aW / 2)[1]} t="$v\,\Delta t$" c={C.first} s={T.key} />
          <Wedge c={RC} r={110} a0={a0} a1={a0 + aW} o={fin(f, tAng)} />
          <Lbl x={polar(RC, 160, a0 + aW / 2)[0]} y={polar(RC, 160, a0 + aW / 2)[1]} t="$\Delta\theta$" c={C.gold} s={T.key} a="middle" o={fin(f, tAng)} />
          <line x1={RC[0]} y1={RC[1]} x2={P0[0]} y2={P0[1]} stroke={C.ink} strokeWidth={5} opacity={fin(f, tArc)} />
          <Lbl x={mix(RC[0], P0[0], 0.55)} y={mix(RC[1], P0[1], 0.55) + 46} t="$r$" c={C.ink} s={T.key} o={fin(f, tArc)} />
        </g>
        <ClockG x={140} y={120} t={f < tLap ? "$t$" : `$t$ = ${Math.round(lapFrac * 75)} min`} frac={f < tLap ? (f / 300) % 1 : lapFrac} />
        <Keyword f={f} text="Ian's ring: 25 km out" at={[MX, 120]} s={T.key} appear={0} out={tQ - 20} />
        <Keyword f={f} text="measured in Part 1" at={[MX, 120]} s={T.floor} appear={tQ} out={tGrow - 20} />
        <Keyword f={f} text="how fast does $\theta$ grow?" at={[MX, 120]} s={T.key} appear={tGrow} out={tNum - 20} />
        <Keyword f={f} text={`$v$ ≈ ${nf(RING.v, 1)} m/s: speed round the ring`} at={[MX, 690]} s={T.floor} appear={tV} out={tDt - 20} />
        {/* the worked point of Part 1 (S4-S5): the balloon's point at θ ≈ 53°, the east wind (10, 0) and its two parts */}
        <g opacity={win(f, tEx, tAvg - 10)}>
          <circle cx={Pb[0]} cy={Pb[1]} r={12} fill={C.key} />
          <Arrow p={Pb} q={[Pb[0] + 200, Pb[1]]} color={C.ink} w={9} head={32} />
          <Lbl x={Pb[0] + 100} y={Pb[1] - 46} t="10 m/s east" c={C.ink} s={T.floor} />
          {/* fix loop 1 (r8 review 2 S6): each part on its spoken result ("is six", "minus eight"), not at the sentence start */}
          <Arrow p={Pb} q={[Pb[0] + er[0] * 120, Pb[1] + er[1] * 120]} color={C.neg} w={9} head={30} o={fin(f, tUr6)} />
          <Arrow p={Pb} q={[Pb[0] - et[0] * 160, Pb[1] - et[1] * 160]} color={C.first} w={9} head={30} o={fin(f, tUt8)} />
          <Lbl x={Pb[0] + er[0] * 130 + 10} y={Pb[1] + er[1] * 130 - 10} t="$u_r=6$" c={C.neg} s={T.floor} o={fin(f, tUr6)} />
          <Lbl x={Pb[0] - et[0] * 170 + 10} y={Pb[1] - et[1] * 170 + 40} t="$u_\theta=-8$" c={C.first} s={T.floor} o={fin(f, tUt8)} />
        </g>
        <Keyword f={f} text="the numbers" at={[MX, 120]} s={T.key} appear={tNum} out={tLap - 20} />
        <Keyword f={f} text="one full lap" at={[MX, 120]} s={T.key} appear={tLap} />
        <CurvedLink f={f} from={[MX - 14, 300]} to={polar(RC, RR + 20, a0 + aW / 2)} start={tDt + 10} end={tAng} bend={60} />
      </Svg>
      {/* remake 2026-11-07 (R12): Part 1's split, a worked point and the ring average, recalled where v is taken */}
      <TeX s={u1} x={MX} y={260} size={50} o={win(f, tF, tGrow - 10)} />
      <Recall f={f} tex={u2} name="radial and tangential wind" x={MX} y={330} appear={AT(k, 3, "and u sub theta")} out={tGrow - 10} />
      <CalcStack f={f} x={MX} y={500} size={44} maxLines={4} o={oRec * fout(f, tAvg - 10)} rows={[
        { rhs: String.raw`u=10,\ v=0`, at: AT(k, 4, "so u is ten") },
        { rhs: String.raw`\cos\theta=${goldAt(f, tC6, "0.6")},\ \sin\theta=${goldAt(f, tS8, "0.8")}`, at: tC6 - 8, cont: true },
        { rhs: String.raw`u_r=10\times0.6+0\times0.8${tailIn(f, tUr6, C.ink, "=6")}`, at: tExR },
        { rhs: String.raw`u_\theta=-10\times0.8+0\times0.6${tailIn(f, tUt8, C.ink, "=-8")}`, at: AT(k, 5, "and u sub theta") },
      ]} />
      {/* fix loop 1 (r8 review 2 S6): the ring average's working on "the average", its value on "thirty four point eight" (gold) */}
      <TeX s={avgL + tailIn(f, t348, C.ink, String.raw`\approx` + avgR, true)} x={MX} y={560} size={50} o={win(f, AT(k, 6, "the average"), tGrow - 10)} />
      {/* fix 0 B10: the arc rule written (S7) and the division by Δt shown (S9), one row per sentence */}
      <CalcStack f={f} x={MX + 330} y={250} size={56} maxLines={3} o={fout(f, tNum - 6)} rows={[
        { lhs: String.raw`\Delta s`, rhs: String.raw`=v\,\Delta t`, at: tDt },
        { lhs: String.raw`\text{arc rule: }\Delta s`, rhs: String.raw`=r\,\Delta\theta`, at: tArc },
        { lhs: String.raw`\Delta\theta`, rhs: String.raw`=\dfrac{\Delta s}{r}=\dfrac{v\,\Delta t}{r}`, at: tAng },
        // #5b r2 S5: both Δt struck on "Δt cancels" (as the two r's are in s11)
        { lhs: String.raw`\dfrac{\Delta\theta}{\Delta t}`, rhs: f < tDiv + 20 ? String.raw`=\dfrac{v\,\Delta t}{r\,\Delta t}=\dfrac{v}{r}`
          : String.raw`=\dfrac{v\,\cancel{\Delta t}}{r\,\cancel{\Delta t}}=\dfrac{v}{r}`, at: tDiv },
      ]} />
      <Svg><Lbl x={MX} y={645} t="$\Delta t$ cancels" c={C.gold} s={T.floor} o={win(f, tDiv + 20, tRate - 20)} /></Svg>{/* K6 round 1: under the taller fraction rows */}
      <TeX s={EQ_S09} x={MX} y={705} size={88} o={fin(f, tRate) * fout(f, tNum - 6)} glow={pulse(f, tRate, 20)} />
      {/* fix 0 B11: every conversion on screen, on its words */}
      <CalcStack f={f} x={MX + 20} y={230} size={50} maxLines={3} o={fin(f, tNum)} rows={[
        // K6 round 1: ran to x 2024: r and v on two lines
        // fix loop 1 (review 1 S8, review 2 S6): each input on its word, gold (was at the sentence start with a faint glow)
        { rhs: String.raw`r=25\ \mathrm{km}=${goldAt(f, AT(k, 17, "twenty five thousand"), String.raw`25\,000\ \mathrm m`)}`, at: AT(k, 17, "twenty five thousand") - 8, size: 46 },
        { rhs: String.raw`v=${goldAt(f, AT(k, 17, "thirty four point eight"), String.raw`34.8\ \mathrm{m/s}`)}\ (\approx35)`, at: AT(k, 17, "thirty four point eight") - 8, size: 46, cont: true },
        { rhs: String.raw`\dfrac{34.8\ \mathrm{m/s}}{25\,000\ \mathrm{m}}${tailIn(f, tRad, C.ink, String.raw`\approx0.00139\ \mathrm{rad/s}`)}`, at: AT(k, 17, "divided by") },
        { rhs: String.raw`1\ \mathrm{rad}=\dfrac{180^\circ}{\pi}\approx${goldAt(f, t573, String.raw`57.3^\circ`)}`, at: AT(k, 19, "One radian") },   // fix loop 1 (review 2 S8): said, gold on its word
        { rhs: String.raw`0.00139\times57.3\approx0.08^\circ/\mathrm{s}`, at: AT(k, 19, "zero point zero eight") },
        { rhs: String.raw`0.08\times60\approx4.8\approx5^\circ/\mathrm{min}`, at: AT(k, 19, "five degrees") },
        { rhs: String.raw`\text{lap}=\dfrac{2\pi}{0.00139}=\dfrac{6.283}{0.00139}`, at: AT(k, 20, "divided by") },
        { rhs: String.raw`\approx4500\ \mathrm s,\qquad \dfrac{4500}{60}=75\ \mathrm{min}`, at: AT(k, 21, "four thousand") - 4 },
      ]} />
      <Svg><Lbl x={MX} y={720} t="metres cancel: rad/s left" c={C.local} s={T.floor} o={win(f, tCancel, tLap - 20)} /></Svg>
      <Svg><Lbl x={MX} y={800} t={String.raw`${nf(RING.v, 1)} m/s $\div$ 25 000 m`} c={C.muted} s={T.floor} o={0 * tGrow} /></Svg>
    </Scene>
  );
};

// ================================================================ s10 the position arrow r r̂ (D17 1-2)
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_position_arrow");
  const tWhy = SS(k, 2), tVel = SS(k, 3), tPos = AT(k, 4, "position as an arrow"), tLen = SS(k, 5), tRr = SS(k, 6), tBack = SS(k, 7), tFlip = SS(k, 8), tIan = SS(k, 9),
    tRate = SS(k, 10), tProd = SS(k, 11), tRes = SS(k, 12);
  const a = 50, p = polar(RC, RR, a);
  return (
    <Scene>
      <Svg>
        <RingBase />
        <Arrow p={RC} q={p} color={C.ink} w={10} head={40} o={fin(f, tPos)} />
        <Arrow p={RC} q={polar(RC, 120, a)} color={C.second} w={8} head={30} o={fin(f, tLen)} />
        <Lbl x={polar(RC, 160, a + 12)[0]} y={polar(RC, 160, a + 12)[1]} t="$\hat{\mathbf r}$" c={C.second} s={T.key} o={fin(f, tLen)} />
        {/* K6 round 1: ran across the ring (x 650-851): now inside it, under the arrow */}
        <Lbl x={RC[0] + 85} y={RC[1] - 20} t="$r$ = 25 km" c={C.ink} s={T.floor} o={fin(f, tIan)} />
        <Parcel p={p} />
        <Keyword f={f} text="velocity next" at={[MX, 120]} s={T.key} appear={0} out={tWhy - 20} />
        <Lbl x={1075} y={120} t="acceleration ← velocity ← position" c={C.key} s={T.floor} o={win(f, tWhy, tRate - 20)} />
        <Lbl x={MX + 320} y={180} t="(rate of change)" c={C.gold} s={T.floor} o={win(f, tVel, tRate - 20)} />
      </Svg>
      <CalcStack f={f} x={MX + 120} y={280} size={60} maxLines={3} o={fout(f, tRate - 6)} rows={[
        { lhs: String.raw`\text{position}`, rhs: String.raw`=r\,\hat{\mathbf r}`, at: tRr },
        { lhs: String.raw`\hat{\mathbf r}`, rhs: String.raw`=\dfrac{\text{arrow}}{r}\ \Rightarrow\ \text{arrow}=r\,\hat{\mathbf r}`, at: tFlip, size: 52 },
        { lhs: String.raw`\text{arrow}`, rhs: String.raw`=25\ \mathrm{km}\times\hat{\mathbf r}`, at: tIan },
      ]} />
      <Svg><Keyword f={f} text="number $\times$ arrow → product rule" at={[MX, 120]} s={T.floor} appear={tRate} /></Svg>
      <TeX s={String.raw`\dfrac{d}{dt}\big(v\,\hat{\mathbf d}\big)=\dfrac{dv}{dt}\,\hat{\mathbf d}+v\,\dfrac{d\hat{\mathbf d}}{dt}`} x={MX} y={300} size={52} c={C.local} o={win(f, tProd, LEN(k) + 20)} />
      <Svg><Lbl x={MX} y={400} t="$v\to r,\quad \hat{\mathbf d}\to\hat{\mathbf r}$" c={C.gold} s={T.floor} o={fin(f, tProd + 20)} /></Svg>
      <TeX s={EQ_S10} x={MX} y={530} size={56} o={fin(f, tRes)} />
    </Scene>
  );
};

// ================================================================ s11 the velocity on the ring: v θ̂ (D17 3-5)
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_velocity_on_ring");
  const tZero = SS(k, 1), tSecond = SS(k, 2), tChain = SS(k, 4), tCR = SS(k, 5), tBoth = SS(k, 6), tSo = SS(k, 7), tMul = SS(k, 8), tCancel = SS(k, 9), tYes = SS(k, 10),
    tSize = SS(k, 11), tIan = SS(k, 12);
  const a = lapA(f, 50, 300), p = polar(RC, RR, a), u = unitV(a + 90), er = unitV(a);
  const [e1] = cutAt(EQ_S11, "=v");   // e1 = "\mathbf v=r … =r θ̂ v/r"; the rest "=v θ̂"
  return (
    <Scene>
      <Svg>
        <RingBase />
        <Arrow p={RC} q={p} color={C.ink} w={8} head={30} o={0.6} />
        <DashArrow f={f} p={p} q={[p[0] + u[0] * 170, p[1] + u[1] * 170]} o={fin(f, tYes)} />
        <RTick p={p} u1={[-er[0], -er[1]]} u2={u} o={fin(f, tSize)} />
        <Parcel p={p} />
        {/* K6 round 1: at RR + 70 the turning arc ran through "Ian's ring: r = 25 km" at the bottom; RR + 34 clears it */}
        <path d={arcD(RC, RR + 34, a - 60, a - 10)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tIan)} />
        <ArcHead c={RC} r={RR + 34} a={a - 10} dir={1} col={C.gold} o={fin(f, tIan)} />
        <Keyword f={f} text="one term at a time" at={[MX, 120]} s={T.key} appear={0} out={tChain - 20} />
        <Keyword f={f} text="the chain rule" at={[MX, 120]} s={T.key} appear={tChain} out={tYes - 20} />
        <Keyword f={f} text={`${nf(RING.v, 1)} m/s along $\\hat{\\boldsymbol\\theta}$`} at={[MX, 120]} s={T.key} appear={tIan} />
        <Lbl x={MX} y={210} t="anticlockwise (seen from above)" c={C.key} s={T.floor} o={fin(f, tIan + 20)} />
        <Lbl x={MX} y={190} t="$r$ fixed: $dr/dt=0$" c={C.local} s={T.floor} o={win(f, tZero, tChain - 20)} />
        {/* fix 0 B2: no scene ids on screen; say where each piece came from */}
        <Lbl x={MX} y={450} t="$\hat{\boldsymbol\theta}$: from the turning rule" c={C.gold} s={T.floor} o={win(f, tBoth, tMul - 20)} />
        <Lbl x={MX} y={510} t="$v/r$: how fast $\theta$ grows" c={C.gold} s={T.floor} o={win(f, tBoth, tMul - 20)} />
      </Svg>
      {/* fix 0 B20: the s10 line with its first term struck (r fixed) */}
      <TeX s={String.raw`\mathbf v=\cancel{\dfrac{dr}{dt}\,\hat{\mathbf r}}+r\,\dfrac{d\hat{\mathbf r}}{dt}`} x={MX} y={330} size={56} o={win(f, tZero, tChain - 20)} />
      <TeX s={String.raw`\dfrac{d\hat{\mathbf r}}{dt}=\dfrac{d\hat{\mathbf r}}{d\theta}\,\dfrac{d\theta}{dt}=\hat{\boldsymbol\theta}\,\dfrac{v}{r}`} x={MX} y={330} size={60} o={win(f, tCR, tMul - 20) * (f < tSo ? 0.85 : 1)} />
      {/* fix 0 B20: e1 on "Now multiply by r", "= v θ̂" only when S9 says it (EQ_S11 = e1 + "=v θ̂") */}
      {/* #5b r1 S6: 52 px (was 46: the fraction parts rendered ≈ 40 px) and the two r's struck on "The two r's cancel" */}
      <CalcStack f={f} x={MX + 60} y={250} size={52} maxLines={3} o={fout(f, tYes - 14)} rows={[
        // K6 round 2: the regex was /^\mathbf v/ (\m = "m", no backslash), so nothing was cut and the row read "v v = r …"
        { lhs: String.raw`\mathbf v`, rhs: e1.replace(/^\\mathbf v/, ""), at: tMul },
        { rhs: String.raw`=\cancel{r}\,\hat{\boldsymbol\theta}\,\dfrac{v}{\cancel{r}}`, at: tCancel, cont: true },
        { rhs: EQ_S11.slice(e1.length), at: tCancel + 30, cont: true },
      ]} />
      <TeX s={String.raw`\mathbf v=v\,\hat{\boldsymbol\theta}`} x={MX} y={360} size={96} o={win(f, tYes, tIan - 20)} glow={pulse(f, tCancel + 20, 20)} />
      <TeX s={String.raw`\mathbf v=34.8\ \hat{\boldsymbol\theta}\ \mathrm{m/s}`} x={MX} y={360} size={T.calc} o={fin(f, tIan)} />
      <Svg><Lbl x={MX} y={700} t="the two r's cancel" c={C.gold} s={T.floor} o={win(f, tCancel, tIan - 20)} /></Svg>
    </Scene>
  );
};

// ================================================================ s12 the acceleration −(v²/r) r̂ (D18)
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12_acceleration");
  const tAcc = SS(k, 1), tNeed = SS(k, 2), tPR = SS(k, 3), tSteady = SS(k, 4), tChain = SS(k, 5), tCR = SS(k, 6), tRem = SS(k, 7), tVr = SS(k, 8), tSo = SS(k, 9),
    tMul = SS(k, 10), tRes = SS(k, 11), tMinus = SS(k, 12), tCentri = SS(k, 13), tUnits = SS(k, 14), tU2 = SS(k, 16);
  const a = lapA(f, 50, 300), p = polar(RC, RR, a), u = unitV(a + 90), er = unitV(a);
  // the s06 mini picture (θ̂'s tip swinging to −r̂) recalled at the left bottom
  const mC: Pt = [900, 715], mR = 70;                      // fix 0: up, so the −r̂ tag stays above the caption band
  const [EQ12a, EQ12b] = cutAt(EQ_S12, "=v");               // #5b r1 S6: "a = d/dt(v θ̂)" / "= v dθ̂/dθ dθ/dt = −(v²/r) r̂"
  return (
    <Scene>
      <Svg>
        <RingBase />
        <DashArrow f={f} p={p} q={[p[0] + u[0] * 150, p[1] + u[1] * 150]} />
        <Arrow p={p} q={[p[0] - er[0] * 120, p[1] - er[1] * 120]} color={C.neg} w={10} head={40} o={fin(f, tMinus)} />
        {/* #5b r1 S8: a lone "−" read as a dash: the arrow is named in TeX */}
        <Lbl x={p[0] - er[0] * 175} y={p[1] - er[1] * 175} t="$-\hat{\mathbf r}$" c={C.neg} s={T.key} a="middle" o={fin(f, tMinus)} />
        <Parcel p={p} />
        <g opacity={win(f, tRem, tSo + 30)}>
          <circle cx={mC[0]} cy={mC[1]} r={mR} fill="none" stroke={C.local} strokeWidth={3} />
          <Arrow p={mC} q={polar(mC, mR, 140)} color={C.second} w={5} head={18} />
          <Arrow p={mC} q={polar(mC, mR, 230)} color={C.neg} w={5} head={18} />
          <path d={arcD(mC, mR + 20, 145, 220)} fill="none" stroke={C.gold} strokeWidth={4} />
          <Lbl x={polar(mC, mR + 30, 125)[0]} y={polar(mC, mR + 30, 125)[1]} t="$\hat{\boldsymbol\theta}$" c={C.second} s={T.floor} a="middle" />
          <Lbl x={polar(mC, mR + 34, 250)[0]} y={polar(mC, mR + 34, 250)[1]} t="$-\hat{\mathbf r}$" c={C.neg} s={T.floor} a="middle" />
        </g>
        <Keyword f={f} text="the opening question" at={[MX, 120]} s={T.key} appear={0} out={tPR - 20} />
        <Keyword f={f} text="steady speed: $dv/dt=0$" at={[MX, 120]} s={T.key} appear={tSteady} out={tRes - 20} />
        <Keyword f={f} text="centripetal: towards the centre" at={[MX, 120]} s={T.floor} appear={tCentri} out={tUnits - 20} />
        <Keyword f={f} text="units check" at={[MX, 120]} s={T.key} appear={tUnits} />
        <Lbl x={MX} y={210} t="a = rate of change of velocity" c={C.key} s={T.floor} o={win(f, tAcc, tPR - 20)} />
        {/* fix 0 B2: no scene ids on screen */}
        <Lbl x={MX} y={470} t="$-\hat{\mathbf r}$: $\hat{\boldsymbol\theta}$ swings towards $-\hat{\mathbf r}$" c={C.gold} s={T.floor} o={win(f, tRem, tMul - 20)} />
        <Lbl x={MX} y={530} t="$v/r$: how fast $\theta$ grows" c={C.gold} s={T.floor} o={win(f, tVr, tMul - 20)} />
      </Svg>
      {/* fix 0 B21: the product rule, then the same line with the dv/dt term struck (steady speed) */}
      <CalcStack f={f} x={MX + 230} y={220} size={52} maxLines={3} o={fout(f, tChain - 14)} rows={[
        { lhs: String.raw`\dfrac{d}{dt}(v\hat{\boldsymbol\theta})`, rhs: String.raw`=\dfrac{dv}{dt}\hat{\boldsymbol\theta}+v\dfrac{d\hat{\boldsymbol\theta}}{dt}`, at: tPR, h: 140 },   // K6 round 2: hat over a fraction: 125 px of ink at 52 px
        { rhs: String.raw`=\cancel{\dfrac{dv}{dt}\hat{\boldsymbol\theta}}+v\dfrac{d\hat{\boldsymbol\theta}}{dt}`, at: tSteady, cont: true, h: 140 },
      ]} />
      <TeX s={String.raw`\dfrac{dv}{dt}=0`} x={MX} y={596} size={T.calc} c={C.local} o={win(f, tSteady, tChain - 20)} />
      <TeX s={String.raw`\dfrac{d\hat{\boldsymbol\theta}}{dt}=\dfrac{d\hat{\boldsymbol\theta}}{d\theta}\dfrac{d\theta}{dt}=-\hat{\mathbf r}\,\dfrac{v}{r}`} x={MX} y={300} size={60} o={win(f, tCR, tMul - 20) * (f < tSo ? 0.85 : 1)} />
      {/* fix 0 B21: the skipped move written out: a = v·(−r̂ v/r) on "multiply by v", then = −(v·v/r) r̂ = −(v²/r) r̂ on S11 */}
      <CalcStack f={f} x={MX + 80} y={230} size={52} maxLines={3} o={fout(f, tMinus - 10)} rows={[
        { lhs: String.raw`\mathbf a`, rhs: String.raw`=v\,\dfrac{d\hat{\boldsymbol\theta}}{dt}=v\cdot\Big(-\hat{\mathbf r}\,\dfrac{v}{r}\Big)`, at: tMul, h: 140 },
        { rhs: String.raw`=-\dfrac{v\cdot v}{r}\,\hat{\mathbf r}=-\dfrac{v^2}{r}\,\hat{\mathbf r}`, at: tRes, cont: true, h: 140 },
      ]} />
      {/* the whole derivation in one line, as a summary under the result (EQ_S12) */}
      {/* #5b r1 S6: the summary at 52 px on two lines (one 44-px line rendered its fractions at ≈ 36-40 px) */}
      <TeX s={EQ12a} x={MX} y={665} size={52} o={fin(f, tCentri)} />
      <TeX s={"=v" + EQ12b} x={MX + 60} y={795} size={52} o={fin(f, tCentri + 10)} />
      <TeX s={String.raw`\mathbf a=-\dfrac{v^2}{r}\,\hat{\mathbf r}`} x={MX} y={300} size={96} o={fin(f, tMinus)} glow={pulse(f, tRes + 20, 20)} />
      <TeX s={String.raw`\dfrac{\mathrm{m^2/s^2}}{\mathrm m}=\mathrm{m/s^2}`} x={MX} y={505} size={T.calc} o={fin(f, tU2)} />
    </Scene>
  );
};

// ================================================================ s13 how big: 0.048 m/s², ≈ g / 200 (D18 numbers)
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = K("s13_acceleration_numbers");
  const tHow = SS(k, 1), tSq = SS(k, 2), tDiv = SS(k, 3), tEasy = SS(k, 4), tBig = SS(k, 5), tG = SS(k, 6), tAll = SS(k, 7), tCar = SS(k, 8), tTurn = SS(k, 9);
  const a = lapA(f, 50, 300), p = polar(RC, RR, a), er = unitV(a), u = unitV(a + 90);
  const carT = clamp((f - tCar) / 90, 0, 1);
  return (
    <Scene>
      <Svg>
        <RingBase />
        <DashArrow f={f} p={p} q={[p[0] + u[0] * 150, p[1] + u[1] * 150]} />
        <Arrow p={p} q={[p[0] - er[0] * 120, p[1] - er[1] * 120]} color={C.neg} w={10 + 4 * pulse(f, tTurn, 24)} head={40} />
        <Parcel p={p} />
        <Keyword f={f} text="keep: $v^2/r$, towards the centre" at={[MX, 120]} s={T.floor} appear={0} out={tHow - 20} />
        <Keyword f={f} text="how big?" at={[MX, 120]} s={T.key} appear={tHow} out={tBig - 20} />
        <Keyword f={f} text="≈ 200 $\times$ smaller than gravity" at={[MX, 120]} s={T.floor} appear={AT(k, 6, "two hundred")} out={tCar - 20} />
        <Keyword f={f} text="all of it turns the parcel" at={[MX, 120]} s={T.key} appear={tTurn} />
        <g opacity={win(f, tG + 14, tCar - 20)}>{/* K6 round 2: in after the stack has slid up for its 9.81 / 0.048 row (the new row crossed the bars while sliding) */}
          {/* K6 r0: 50 px lower, clear of the (taller) fraction rows; K6 round 1: 15 px more (the fraction rows are 2.4 × size now) */}
          <line x1={MX} y1={745} x2={MX + 700} y2={745} stroke={C.muted} strokeWidth={3} />
          <rect x={MX} y={665} width={700} height={50} fill={C.local} opacity={0.85} />
          <rect x={MX} y={765} width={Math.max(4, (700 * RING.acc) / 9.81)} height={50} fill={C.neg} opacity={0.95} />
          <Lbl x={MX + 10} y={635} t="gravity 9.81 $\mathrm{m/s^2}$" c={C.local} s={T.floor} />
          <Lbl x={MX + 30} y={842} t="0.048 $\mathrm{m/s^2}$" c={C.neg} s={T.floor} />
        </g>
        <g opacity={fin(f, tCar)}>
          <rect x={MX + 20} y={750} width={150} height={50} rx={14} fill={C.second} />
          <circle cx={MX + 55} cy={805} r={16} fill={C.ink} /><circle cx={MX + 135} cy={805} r={16} fill={C.ink} />
          <Lbl x={MX + 220} y={775} t={`${Math.round(100 * carT)} km/h`} c={C.key} s={T.floor} />
          <ClockG x={MX + 470} y={775} t={`≈ ${Math.round(10 * carT)} min`} frac={carT} />
        </g>
      </Svg>
      {/* K6 round 1: gone before the summary line comes in at the same place (they cross-faded on top of each other) */}
      <CalcStack f={f} x={MX + 230} y={220} size={50} maxLines={3} o={fout(f, tAll - 12)} rows={[
        // fix loop 1 (review 2 S6, S7): v gold on its word; each result on its word (0.048 gold: the scene's answer)
        { lhs: String.raw`v^2=${goldAt(f, AT(k, 2, "thirty four point eight"), "34.8")}^2`, rhs: String.raw`\approx1211`, at: AT(k, 2, "thirty four point eight") - 8 },
        { lhs: String.raw`\dfrac{v^2}{r}=\dfrac{1211}{25\,000}`, rhs: tailIn(f, AT(k, 3, "zero point zero four eight"), C.ink, String.raw`\approx0.048\ \mathrm{m/s^2}`, true), at: AT(k, 2, "divide by the radius"), h: 130 },   // K6 round 2: 116-118 px of ink at 50 px (superscripts)
        { lhs: String.raw`v\approx35:\ \dfrac{35^2}{25\,000}`, rhs: String.raw`=\dfrac{1225}{25\,000}` + tailIn(f, AT(k, 4, "zero point zero four nine"), C.local, String.raw`\approx0.049`), at: AT(k, 4, "thirty five"), c: C.local, h: 130 },   // #5b r1 S5: 35² = 1225 shown
        { lhs: String.raw`\dfrac{9.81}{0.048}`, rhs: tailIn(f, AT(k, 6, "two hundred"), C.ink, String.raw`\approx200`, true), at: tG, h: 130 },   // fix loop 1 (review 2 S6): the result on its word
      ]} />
      <TeX s={EQ_S13} x={MX} y={250} size={60} o={win(f, tAll, LEN(k) + 20)} />
      {/* fix 0 B22: the car's conversions, one row at a time */}
      {/* K6 round 1: "=" column 1390 → 1300 (the first row ran to x 1879) */}
      {/* #5b r1 S9: the rows 128 px apart (the "0.048 m/s²" denominator touched "580 s" below it); the column starts 5 px higher */}
      <CalcStack f={f} x={MX + 200} y={345} size={46} maxLines={3} rows={[
        { lhs: String.raw`100\ \mathrm{km/h}`, rhs: String.raw`=\dfrac{100\,000\ \mathrm m}{3600\ \mathrm s}\approx27.8\ \mathrm{m/s}`, at: tCar, h: 128 },
        { lhs: String.raw`\dfrac{27.8\ \mathrm{m/s}}{0.048\ \mathrm{m/s^2}}`, rhs: String.raw`\approx580\ \mathrm s`, at: tCar + 45, h: 128 },
        { lhs: String.raw`\dfrac{580\ \mathrm s}{60}`, rhs: String.raw`\approx9.7\ \mathrm{min}\approx10\ \mathrm{min}`, at: tCar + 90, h: 128 },
      ]} />
    </Scene>
  );
};

// ================================================================ s14 a steady speed, a turning velocity (D19)
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14_steady_but_turning");
  const tMore = SS(k, 1), tSD = SS(k, 2), tTwo = SS(k, 3), tMin = SS(k, 4), tLen = SS(k, 5), tSlide = SS(k, 6), tShort = SS(k, 7), tEye = SS(k, 8), tHow = SS(k, 9),
    tEnds = SS(k, 10), tArc = SS(k, 11), tDiv = SS(k, 12), tOnly = SS(k, 13), tPush = SS(k, 14), tP = SS(k, 15), tEarth = SS(k, 16), tM1 = SS(k, 18), tM2 = SS(k, 19);
  // fix loop 1 (review 1 S6, review 2 S6/S8): S16 re-voiced in two sentences (S16 names f, Ω and φ; S17 "twenty times weaker"); the
  // results on their words (2.9, 0.048), the inputs gold on their words (Ω "spin rate", φ "twenty six and a half")
  const tWeak = SS(k, 17), t29 = AT(k, 11, "two point nine"), t048 = AT(k, 12, "zero point zero four eight"), tFv = AT(k, 16, "the speed times"),
    tCor = AT(k, 16, "Coriolis parameter f"), tOm = AT(k, 16, "spin rate"), tPhi = AT(k, 16, "twenty six and a half"), t20 = AT(k, 17, "twenty times weaker"),
    tStr = AT(k, 17, "a little stronger");
  const [e14a, e14b] = cutAt(EQ_S14, "=34.8"), [e14c, e14d] = cutAt(e14b, String.raw`\approx`);
  const DT = 15;                                               // the 5° turn drawn at 15° (listed)
  const a0 = 60, a1 = a0 + DT, p0 = polar(RC, RR, a0), p1 = polar(RC, RR, a1);
  const L = 200, v0 = unitV(a0 + 90), v1 = unitV(a1 + 90);
  const sl = prog(f, tSlide, tSlide + 50);
  const tail: Pt = [mix(p0[0], 860, sl), mix(p0[1], 220, sl)], tail1: Pt = [mix(p1[0], 860, sl), mix(p1[1], 220, sl)];
  const q0: Pt = [tail[0] + v0[0] * L, tail[1] + v0[1] * L], q1: Pt = [tail1[0] + v1[0] * L, tail1[1] + v1[1] * L];
  const oPic = fout(f, tOnly - 10), oPush = fin(f, tP);
  return (
    <Scene>
      <Svg>
        <RingBase o={1} km={false} />
        <g opacity={oPic}>
          <Wedge c={RC} r={110} a0={a0} a1={a1} o={fin(f, tMin)} />
          <Lbl x={polar(RC, 160, a0 + DT / 2)[0]} y={polar(RC, 160, a0 + DT / 2)[1]} t="≈ 5°" c={C.gold} s={T.floor} a="middle" o={fin(f, tMin)} />
          <Lbl x={RC[0]} y={RC[1] + RR + 70} t="turn drawn $3\times$ larger" c={C.muted} s={T.floor} a="middle" o={fin(f, tMin)} />
          <Parcel p={p0} o={fin(f, tTwo)} /><Parcel p={p1} o={fin(f, tTwo)} />
          <Arrow p={tail} q={q0} color={C.first} w={10} head={36} o={fin(f, tTwo)} />
          <Arrow p={tail1} q={q1} color={C.first} w={10} head={36} o={fin(f, tTwo + 10)} />
          <Arrow p={q0} q={q1} color={C.neg} w={7} head={24} o={fin(f, tShort)} />
          <path d={arcD(tail, L, a0 + 90, a1 + 90)} fill="none" stroke={C.local} strokeWidth={4} strokeDasharray="10 8" opacity={fin(f, tEnds)} />
          {/* fix 0 B23: the dashed arc S10 names, and the drawn turn's scale */}
          {/* K6 round 1: was on the ring's top (y 182-218): lifted above the ring, left of the dashed arc */}
          <Lbl x={polar(tail, L + 40, a1 + 100)[0]} y={128} t={`radius ${nf(RING.v, 1)} m/s`} c={C.local} s={T.floor} a="end" o={fin(f, tEnds)} />
          <CurvedLink f={f} from={[(q0[0] + q1[0]) / 2, (q0[1] + q1[1]) / 2 + 20]} to={[RC[0] + 30, RC[1] - 30]} start={tEye} end={tHow} bend={-40} />
        </g>
        <g opacity={oPush}>
          {[60, 100, 140].map((r) => <circle key={r} cx={RC[0]} cy={RC[1]} r={r} fill="none" stroke={C.local} strokeWidth={3} strokeDasharray="12 8" />)}
          <Lbl x={RC[0]} y={RC[1]} t="L" c={C.key} s={T.key} a="middle" />{/* lint-ok: weather-map symbol for the low-pressure centre, not a maths letter */}
          <Arrow p={polar(RC, RR, 120)} q={polar(RC, RR - 170, 120)} color={C.second} w={10} head={36} />
          {/* fix 0 B1 (physics): in this northern-hemisphere cyclone the air goes round anticlockwise (seen from above); the Coriolis
              push is to the RIGHT of the motion, i.e. OUTWARD (a = −f ẑ × v θ̂ = +f v r̂). True length 170/20 ≈ 8.5 px: drawn 6× longer */}
          <Arrow p={polar(RC, RR, 120)} q={polar(RC, RR + (170 / 20) * 6, 120)} color="#8e6fd8" w={7} head={22} o={fin(f, tEarth)} />
        </g>
        {/* #5b r1 S11: the parcel (and its velocity) stays on the ring from S13, while the voice says something must push it inward */}
        <g opacity={fin(f, tOnly)}>
          <DashArrow f={f} p={polar(RC, RR, 120)} q={[polar(RC, RR, 120)[0] + unitV(210)[0] * 130, polar(RC, RR, 120)[1] + unitV(210)[1] * 130]} />
          <Arrow p={polar(RC, RR, 120)} q={polar(RC, RR - 150, 120)} color={C.key} w={7} head={26} dash="12 9" o={win(f, tPush, tP - 6)} />
          <Parcel p={polar(RC, RR, 120)} />
        </g>
        <Keyword f={f} text="steady speed, yet accelerating?" at={[MX, 120]} s={T.floor} appear={0} out={tSD - 20} />
        <Keyword f={f} text="velocity = speed + direction" at={[MX, 120]} s={T.floor} appear={tSD} out={tMin - 20} />
        <Keyword f={f} text="$\Delta\mathbf v$ points at the eye" at={[MX, 120]} s={T.key} appear={tEye} out={tOnly - 20} />
        <Keyword f={f} text="yes: it turns" at={[MX, 120]} s={T.key} appear={tOnly} out={tM1 - 20} />
        <Keyword f={f} text="more: Wind on weather charts" at={[MX, 120]} s={T.floor} appear={tM1} out={tM2 - 20} />
        <Keyword f={f} text="more: Circular motion" at={[MX, 120]} s={T.floor} appear={tM2} />
        <Lbl x={MX} y={220} t={`both ${nf(RING.v, 1)} m/s long`} c={C.first} s={T.floor} o={win(f, AT(k, 5, "thirty four point eight"), tOnly - 20)} />
        <Lbl x={MX} y={220} t="something pushes inward" c={C.key} s={T.floor} o={win(f, tPush, tP - 22)} />
        {/* fix 0 B1: the two pushes keyed by colour beside the picture (the ring leaves no room for labels at the parcel).
            #5b r1 S12 / M10: the key 80 px higher; the spin push named as seen on the turning Earth; Ω and φ named for the f row */}
        <Lbl x={MX} y={220} t="pressure force: inward" c={C.second} s={T.floor} o={win(f, tP, tM1 - 20)} />
        {/* fix loop 1: the "≈ 1/20" is said in S17 now; its number is the ratio row of the stack below (on "twenty times weaker") */}
        <Lbl x={MX} y={280} t="Earth's spin: outward" c="#b49cf0" s={T.floor} o={win(f, tEarth, tM1 - 20)} />
        <Lbl x={MX} y={335} t="(as seen on the turning Earth)" c="#b49cf0" s={T.floor} b={false} o={win(f, tEarth, tM1 - 20)} />
        {/* #5b r2 S4: f named here; Ω (with its unit) and φ (Ian's latitude) as rows of the stack below */}
        <Lbl x={MX} y={390} t="$f$: Coriolis parameter" c={C.local} s={T.floor} o={win(f, tCor, tM1 - 20)} />
        <Lbl x={RC[0]} y={790} t="(violet arrow drawn $6\times$ longer)" c={C.muted} s={T.floor} a="middle" o={win(f, tEarth, tM1 - 20)} />
        {/* K6 round 1: under the ring (the balance rows now reach y 840 in the text column) */}
        <Lbl x={RC[0]} y={845} t="why: Coriolis movie" c={C.muted} s={T.floor} a="middle" o={win(f, tStr, tM1 - 20)} />
      </Svg>
      <CalcStack f={f} x={MX + 20} y={262} size={56} maxLines={3} o={fout(f, tOnly - 6)} rows={[
        // fix loop 1 (review 2 Nit 1): the rate to four figures, so that the product rounds to the 0.084 that is said (0.00139 × 60 = 0.0834)
        { rhs: String.raw`\Delta\theta=0.001392\times60`, at: AT(k, 4, "its rate times sixty"), size: 50 },
        { rhs: String.raw`\approx0.084\ \mathrm{rad}`, at: AT(k, 4, "zero point zero eight four"), size: 50, cont: true },
        { rhs: String.raw`0.084\times57.3\approx4.8^\circ\approx5^\circ`, at: AT(k, 4, "five degrees"), size: 50, cont: true },
        // #5b r1 S10: the arc rule once (EQ_S14 in the stack; the separate 44-px copy under it is gone)
        { rhs: e14a, at: tArc, size: 50 },
        { rhs: "=34.8" + e14c + tailIn(f, t29, C.ink, String.raw`\approx` + e14d), at: AT(k, 11, "radius times angle"), size: 50, cont: true },
        { rhs: String.raw`\dfrac{2.9\ \mathrm{m/s}}{60\ \mathrm s}${tailIn(f, t048, C.ink, String.raw`\approx0.048\ \mathrm{m/s^2}`, true)}`, at: tDiv },
      ]} />
      {/* fix 0 B1: the balance in numbers on S16 (f v = 6.51e-5 × 34.8 ≈ 0.0023 m/s², ratio 21 from data/cs.json) */}
      {/* #5b r1 M10 (A1, A6): the inputs of 0.0023 on screen (f = 2Ω sin φ with Ω and Ian's latitude), and one rounding in the sum */}
      {/* #5b r2 S4: two stacks, one after the other: (A) the inputs Ω (unit) and φ (Ian's latitude) and the product, to "twenty times
          weaker"; (B) the ratio and the sum, which restate 0.048 and 0.0023 (one stack of eight rows ran past the content area) */}
      {/* fix loop 1: the rows in the order the voice says them (the formula on "the speed times", Ω on "spin rate", φ on its value, gold) */}
      <CalcStack f={f} x={MX} y={440} size={44} maxLines={4} o={fout(f, tWeak - 20)} rows={[
        { rhs: String.raw`f\,v=2\Omega\sin\varphi\cdot v`, at: tFv },
        { rhs: String.raw`\Omega=${goldAt(f, tOm, String.raw`7.29\times10^{-5}`)}\,\mathrm{s^{-1}}\text{: Earth's spin rate}`, at: tOm, cont: true, c: C.local },
        { rhs: String.raw`\varphi=${goldAt(f, tPhi, `${nf(D.ian_c[0], 1)}^\\circ`)}\text{: Ian's latitude}`, at: tPhi, cont: true, c: C.local },
        { rhs: String.raw`=2\times7.29\times10^{-5}\times\sin${nf(D.ian_c[0], 1)}^\circ\times${nf(RING.v, 1)}`, at: tPhi + 30, cont: true },
        { rhs: String.raw`\approx${nf(RING.f * RING.v, 4)}\ \mathrm{m/s^2}\ \text{(out)}`, at: tPhi + 50, cont: true },
      ]} />
      <CalcStack f={f} x={MX} y={440} size={44} maxLines={4} o={fout(f, tM1 - 10)} rows={[
        { rhs: String.raw`\dfrac{${nf(RING.acc, 3)}\ \text{(turning)}}{${nf(RING.f * RING.v, 4)}}${tailIn(f, t20, C.ink, String.raw`\approx${Math.round(RING.fratio)}`)}`, at: tWeak },
        { rhs: String.raw`\text{pressure push}\approx${nf(RING.acc, 3)}+${nf(RING.f * RING.v, 4)}`, at: tStr },
        { rhs: String.raw`\approx${(Number(nf(RING.acc, 3)) + Number(nf(RING.f * RING.v, 4))).toFixed(3)}\ \mathrm{m/s^2}`, at: tStr + 20, cont: true },
      ]} />
      <Svg><Lbl x={MX} y={832} t="same as $v^2/r$" c={C.gold} s={T.floor} o={win(f, t048 + 10, tOnly - 20)} /></Svg>
    </Scene>
  );
};

// ================================================================ three.js pieces for the tall storm (s15, s16, s18-s20)
/** an image quad on z = const (unlit, not tone-mapped; redraw when the texture lands — build-1 fix loop 1) */
const TexQuad: React.FC<{ href: string; x0: number; x1: number; y0: number; y1: number; z?: number; o?: number }> = ({ href, x0, x1, y0, y1, z = 0, o = 1 }) => {
  const tex = useTex(href);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }), []);
  if (mat.map !== tex) { mat.map = tex; mat.needsUpdate = true; }
  mat.opacity = o;
  const advance = useThree((s) => s.advance);
  useLayoutEffect(() => { if (tex && o > 0) advance(performance.now()); }, [tex, o > 0, advance]); // eslint-disable-line react-hooks/exhaustive-deps
  const geo = useMemo(() => new THREE.PlaneGeometry(x1 - x0, y1 - y0), [x0, x1, y0, y1]);
  if (!tex || o <= 0) return null;
  return <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, z]} material={mat} renderOrder={1} geometry={geo} />;
};
/** a bead running from a to b (house wind rule: arrows always animated) */
const Bead3D: React.FC<{ f: number; a: V3; b: V3; speed: number; o?: number }> = ({ f, a, b, speed, o = 1 }) => {
  const per = Math.max(0.6, 12 / Math.max(0.1, Math.abs(speed))) * 30, t = ((f % per) / per) * 0.8;
  return <HBall3D at={[a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]} px={9} color={C.key} o={o * 0.85} />;
};
// s15-s16 world: 1 unit = 10 km; the plate is 120 × 120 km (±6), the cylinder radius 3 (30 km), height 15 km drawn ×4 → 6
const CYL_R = 3, CYL_H = 6;
const circ = (r: number, z: number, n = 48): V3[] => Array.from({ length: n + 1 }, (_, i) => [r * Math.cos((i * 2 * Math.PI) / n), r * Math.sin((i * 2 * Math.PI) / n), z]);
const camS15 = (f: number, tTilt: number, len: number): OrbitKey[] => [{ f: 0, az: -90, el: 88, dist: 30, target: [0, 0, 0] }, { f: Math.max(1, tTilt - 1), az: -90, el: 88, dist: 30, target: [0, 0, 0] }, { f: tTilt + 90, az: -70, el: 35, dist: 30, target: [0, 0, 1.6] }, { f: len + 10, az: -58, el: 35, dist: 30, target: [0, 0, 1.6], linear: true }];

// ================================================================ s15 a tall storm: cylindrical coordinates (GOES-16 plate)
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_cylinder");
  const tTall = SS(k, 1), tIn = SS(k, 2), tEw = AT(k, 3, "eyewall"), tOut = SS(k, 4), tIan = SS(k, 5), tHole = SS(k, 6), tPol = SS(k, 7), tZ = AT(k, 8, "the height z"), tCyl = SS(k, 9), tNo = SS(k, 10), tWhy = SS(k, 11);   // remake 2026-11-07 (R11)
  const keys = camS15(f, tIan + 20, LEN(k));
  const st = hOrbitCam({ ...hOrbitPath(keys, f), fov: 30 }, [520, 420]);
  const pr = hProjector(st, 1040, 820, 20, 20);
  const ph = (f / 30) * 0.5;
  const oFl = fout(f, tPol - 10), oIn = fin(f, tIn) * oFl, oUp = fin(f, AT(k, 3, "rises")) * oFl, oOut = fin(f, tOut) * oFl, oCyl = fin(f, tWhy), oZ = fin(f, tZ);
  const oPol = fin(f, tPol), lift = prog(f, tCyl + 10, tCyl + 80), FT: V3 = [4.2 * Math.cos(0.7), 4.2 * Math.sin(0.7), 0], PT: V3 = [FT[0], FT[1], 3.6];
  const ewR = (S17D.r_fit ?? 30) / 10;
  const ewT = circ(ewR, 0.02).map((v) => pr.p(v)).reduce((a, b) => (b[0] > a[0] ? b : a));
  return (
    <Scene>
      <HView3D st={st} x={20} y={20} w={1040} h={820}>
        <TexQuad href={IMG("cst_goes_eye.jpg")} x0={-6} x1={6} y0={-6} y1={6} o={1 - 0.55 * fin(f, tPol, 20)} />
        {circ(ewR, 0.03).slice(1).map((q, i) => <HRod3D key={`ew${i}`} a={circ(ewR, 0.03)[i]} b={q} px={9} color={C.gold} o={win(f, tEw, tIan) + fin(f, tHole)} />)}
        {[0, 1, 2, 3, 4, 5].map((i) => { const a = (i * Math.PI) / 3 + ph; const p: V3 = [5.2 * Math.cos(a), 5.2 * Math.sin(a), 0.1];
          const q: V3 = [3.4 * Math.cos(a + 0.6), 3.4 * Math.sin(a + 0.6), 0.1];
          return <group key={`in${i}`}><HArrow3D from={p} to={q} color={C.neg} px={8} head={26} o={oIn} /><Bead3D f={f} a={p} b={q} speed={10} o={oIn} /></group>; })}
        {[0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2 + 0.4; const p: V3 = [ewR * Math.cos(a), ewR * Math.sin(a), 0.3];
          return <group key={`up${i}`}><HArrow3D from={p} to={[p[0], p[1], 4.6]} color={C.local} px={8} head={26} o={oUp} /><Bead3D f={f} a={p} b={[p[0], p[1], 4.6]} speed={6} o={oUp} /></group>; })}
        {[0, 1, 2, 3, 4, 5].map((i) => { const a = (i * Math.PI) / 3 + 0.2 - ph * 0.5; const p: V3 = [3.2 * Math.cos(a), 3.2 * Math.sin(a), 5.2];
          const q: V3 = [5.4 * Math.cos(a - 0.4), 5.4 * Math.sin(a - 0.4), 5.2];
          return <group key={`out${i}`}><HArrow3D from={p} to={q} color="#8db5e2" px={8} head={26} o={oOut} /><Bead3D f={f} a={p} b={q} speed={10} o={oOut} /></group>; })}
        {/* remake 2026-11-07 (R11): the flat polar grid (r, θ) on the sea, lifted to heights z (polar + height = cylindrical) */}
        {[1, 2, 3, 4, 5].flatMap((r) => [0, 2, 4].map((zl) => { const z = 0.05 + zl * lift, ring = circ(r, z);
          return ring.slice(1).map((q, i) => <HRod3D key={`p${r}_${zl}_${i}`} a={ring[i]} b={q} px={zl ? 2 : 3} color={C.local} o={oPol * (zl ? 0.6 * fin(f, tCyl) : 0.9)} />); }))}
        {Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6;
          return <HRod3D key={`ray${i}`} a={[0, 0, 0.05]} b={[5 * Math.cos(a), 5 * Math.sin(a), 0.05]} px={2} color={C.local} o={0.8 * oPol} />; })}
        <HRod3D a={[0, 0, 0.06]} b={FT} px={6} color={C.ink} o={fin(f, AT(k, 7, "the distance r"))} />
        <HRod3D a={FT} b={PT} px={6} color={C.second} o={oZ} />
        <HBall3D at={PT} px={16} color={C.key} o={oZ} />
        <HArrow3D from={[0, 0, 0]} to={[0, 0, 7.4]} color={C.second} px={8} head={30} o={oZ} />
        {circ(CYL_R, 0).slice(1).map((q, i) => <HRod3D key={`b${i}`} a={circ(CYL_R, 0)[i]} b={q} px={6} color={C.key} o={0.95 * oCyl} />)}
        {circ(CYL_R, CYL_H).slice(1).map((q, i) => <HRod3D key={`t${i}`} a={circ(CYL_R, CYL_H)[i]} b={q} px={6} color={C.key} o={0.95 * oCyl} />)}
        {Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6;
          return <HRod3D key={`v${i}`} a={[CYL_R * Math.cos(a), CYL_R * Math.sin(a), 0]} b={[CYL_R * Math.cos(a), CYL_R * Math.sin(a), CYL_H]} px={3} color={C.key} o={0.6 * oCyl} />; })}
      </HView3D>
      <Svg>
        <Lbl x={pr.p([0, 0, 7.6])[0] + 20} y={pr.p([0, 0, 7.6])[1]} t="$z$" c={C.second} s={T.key} o={oZ} />
        <Keyword f={f} text="a tall storm" at={[MX + 20, 120]} s={T.key} appear={0} out={tEw - 20} />
        <Lbl x={MX + 20} y={230} t="in near the sea" c={C.neg} s={T.floor} o={win(f, tIn, tIan - 20)} />
        <Lbl x={MX + 20} y={300} t="up in the eyewall" c={C.local} s={T.floor} o={win(f, AT(k, 3, "rises"), tIan - 20)} />
        <Lbl x={MX + 20} y={370} t="out at 12-15 km" c="#8db5e2" s={T.floor} o={win(f, tOut, tIan - 20)} />
        <SideCallout f={f} lines="eyewall" at={[MX + 20, 120]} s={T.key} appear={tEw} out={tPol - 20} target={ewT} c={C.gold} bend={-30} />
        <Keyword f={f} text="cylindrical coordinates" at={[MX + 20, 120]} s={T.key} appear={tCyl} />
        <Keyword f={f} text="polar: two numbers $(r,\ \theta)$" at={[MX + 20, 120]} s={T.key} appear={tPol} out={tCyl - 20} />
        <Lbl x={pr.p(FT)[0] + 18} y={pr.p(FT)[1] + 40} t="$r,\ \theta$" c={C.ink} s={T.floor} o={fin(f, AT(k, 7, "the distance r")) * fout(f, tWhy)} />
        <Lbl x={pr.p(PT)[0] + 22} y={pr.p(PT)[1]} t="$(r,\ \theta,\ z)$" c={C.key} s={T.floor} o={fin(f, tCyl) * fout(f, tWhy)} />
        <Keyword f={f} text="polar + height = cylindrical" at={[MX + 20, 210]} s={T.floor} c={C.gold} appear={tCyl + 20} />
        <Lbl x={MX + 20} y={770} t="heights drawn $\times4$" c={C.muted} s={T.floor} o={fin(f, tZ)} />
        <Lbl x={MX + 20} y={690} t="$r$ = 30 km: a cylinder" c={C.key} s={T.floor} o={fin(f, tWhy)} />
      </Svg>
      <TeX s={EQ_S15} x={MX + 20} y={300} size={T.eq} o={fin(f, tCyl + 10)} />
      <Recall f={f} tex={EQ_S15C} name="polar coordinates" x={MX + 20} y={410} size={46} appear={AT(k, 10, "so x is still")} />
      <SourceBelow text={SRC.goes} pic={{ x: 20, y: 20, w: 1040, h: 800 }} w={1400} name="s15 src" />
    </Scene>
  );
};

// ================================================================ s16 the wind's three parts
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16_three_parts");
  const tUr = SS(k, 1), tUt = SS(k, 2), tW = SS(k, 3), tEq = SS(k, 4), tZh = SS(k, 5), tOnly = SS(k, 6), tAll = SS(k, 7);
  const keys = camS15(0, 0, 0);
  const st = hOrbitCam({ ...hOrbitPath([{ ...keys[3], f: 0, az: -58 }, { ...keys[3], f: LEN(k) + 10, az: -40, linear: true }], f), fov: 30 }, [520, 420]);
  const pr = hProjector(st, 1040, 820, 20, 20);
  const P0: V3 = [CYL_R, 0, CYL_H * 0.5];
  const oT = (t: number) => fin(f, t) * fout(f, tZh - 10);
  const az3 = [0, 120, 240].map((d) => d * D2R + 0.5);
  return (
    <Scene>
      <HView3D st={st} x={20} y={20} w={1040} h={820}>
        <TexQuad href={IMG("cst_goes_eye.jpg")} x0={-6} x1={6} y0={-6} y1={6} o={0.85} />
        {circ(CYL_R, 0).slice(1).map((q, i) => <HRod3D key={`b${i}`} a={circ(CYL_R, 0)[i]} b={q} px={6} color={C.key} o={0.95} />)}
        {circ(CYL_R, CYL_H).slice(1).map((q, i) => <HRod3D key={`t${i}`} a={circ(CYL_R, CYL_H)[i]} b={q} px={6} color={C.key} o={0.95} />)}
        {Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6;
          return <HRod3D key={`v${i}`} a={[CYL_R * Math.cos(a), CYL_R * Math.sin(a), 0]} b={[CYL_R * Math.cos(a), CYL_R * Math.sin(a), CYL_H]} px={3} color={C.key} o={0.55} />; })}
        <HArrow3D from={P0} to={[CYL_R - 1.8, 0, P0[2]]} color={C.neg} px={9} head={30} o={oT(tUr)} />
        <HArrow3D from={P0} to={[CYL_R, 2.2, P0[2]]} color={C.first} px={9} head={30} o={oT(tUt)} />
        <HArrow3D from={P0} to={[CYL_R, 0, P0[2] + 1.8]} color={C.local} px={9} head={30} o={oT(tW)} />
        {az3.map((a, i) => { const p: V3 = [CYL_R * Math.cos(a), CYL_R * Math.sin(a), CYL_H * 0.75];
          return <group key={i}>
            <HArrow3D from={p} to={[p[0], p[1], p[2] + 1.3]} color={C.second} px={7} head={24} o={fin(f, tZh)} />
            <HArrow3D from={p} to={[p[0] + Math.cos(a) * 1.4, p[1] + Math.sin(a) * 1.4, p[2]]} color={C.second} px={6} head={22} o={fin(f, tOnly)} />
            <HArrow3D from={p} to={[p[0] - Math.sin(a) * 1.4, p[1] + Math.cos(a) * 1.4, p[2]]} color={C.second} px={6} head={22} o={fin(f, tOnly)} />
          </group>; })}
      </HView3D>
      <TeX s="u_r" x={pr.p([CYL_R - 2.0, 0, P0[2]])[0] - 10} y={pr.p([CYL_R - 2.0, 0, P0[2]])[1] - 40} size={52} c={C.neg} ax={1} o={oT(tUr)} halo haloW={0.07} />
      <TeX s={String.raw`u_\theta`} x={pr.p([CYL_R, 2.4, P0[2]])[0] + 12} y={pr.p([CYL_R, 2.4, P0[2]])[1]} size={52} c={C.first} o={oT(tUt)} halo haloW={0.07} />
      <TeX s="w" x={pr.p([CYL_R, 0, P0[2] + 2.0])[0] + 12} y={pr.p([CYL_R, 0, P0[2] + 2.0])[1]} size={52} c={C.local} o={oT(tW)} halo haloW={0.07} />
      <Svg>
        <Keyword f={f} text="three parts" at={[MX + 20, 120]} s={T.key} appear={0} out={tZh - 20} />
        <Lbl x={MX + 20} y={210} t="in or out · round · up or down" c={C.key} s={T.floor} o={win(f, tW + 20, tZh - 20)} />
        {/* #5b r2 cosmetic: both s16 beats in the Keyword style (sans text, maths in $…$); the second was a serif orange TeX line */}
        <Keyword f={f} text="$\hat{\mathbf z}$: the same everywhere" at={[MX + 20, 120]} s={T.key} appear={tZh} out={tOnly - 20} />
        <Keyword f={f} text="only $\hat{\mathbf r}$, $\hat{\boldsymbol\theta}$ turn" at={[MX + 20, 120]} s={T.key} appear={tOnly} out={tAll - 20} />
        <Keyword f={f} text="works in 3-D too" at={[MX + 20, 120]} s={T.key} appear={tAll} />
      </Svg>
      <TeX s={EQ_S16} x={MX + 20} y={380} size={56} o={fin(f, tEq)} />
      {/* remake 2026-11-07 (R12): the two horizontal parts as Part 1 computed them */}
      <TeX s={cutAt(EQ_URUT, String.raw`,\qquad `)[0]} x={MX + 20} y={520} size={46} o={win(f, tUr, tZh - 10)} />
      <Recall f={f} tex={cutAt(EQ_URUT, String.raw`,\qquad `)[1]} name="radial and tangential wind" x={MX + 20} y={580} size={46} appear={tUt} out={tZh - 10} />
      <SourceBelow text={SRC.goes} pic={{ x: 20, y: 20, w: 1040, h: 800 }} w={1400} name="s16 src" />
    </Scene>
  );
};

// ================================================================ s17 is Ian shown right? (radar eye vs the model's calm centre)
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_ian_check");
  const tRadar = SS(k, 1), tRing = SS(k, 2), tBest = SS(k, 3), tModel = SS(k, 4), tP = SS(k, 5), tOff = SS(k, 6), tRule = SS(k, 8), tR1 = SS(k, 9), tR2 = SS(k, 10);   // user notes item 5: S11 ('never mix the two centres') removed
  const bx = S17D.box as number[];
  const PB = { x: 100, y: 60, w: 700, h: 700 };   // user notes item 4: 40 px smaller, room for the two-line radar source line
  const B = { lat0: bx[0], lat1: bx[1], lon0: bx[2], lon1: bx[3], ...PB };
  const oR = fout(f, tModel - 4, 14), oM = fin(f, tModel, 14);
  const ewR = (S17D.r_fit / 111.2 / (bx[1] - bx[0])) * PB.h;
  return (
    <Scene>
      <GeoMap id="s17r" B={B} o={oR}>
        {(P) => <>
          <GeoImg P={P} href={IMG("cst_radar_ktbw.png")} box={bx} />
          <path d={linesPath(P, S17D.coast)} fill="none" stroke={C.key} strokeWidth={2.5} opacity={0.85} />
          <circle cx={P(S17D.radar_eye[0], S17D.radar_eye[1])[0]} cy={P(S17D.radar_eye[0], S17D.radar_eye[1])[1]} r={ewR} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tRing)} />
          <Cross p={P(S17D.radar_eye[0], S17D.radar_eye[1])} c={C.key} o={fin(f, tBest)} />
        </>}
      </GeoMap>
      <GeoMap id="s17m" B={B} o={oM}>
        {(P) => <>
          <GeoImg P={P} href={IMG("cst_hrrr_s17.png")} box={bx} />
          <path d={linesPath(P, S17D.coast)} fill="none" stroke={C.key} strokeWidth={2.5} opacity={0.85} />
          <Cross p={P(S17D.calm[0], S17D.calm[1])} c={C.first} />
        </>}
      </GeoMap>
      <Svg>
        <Keyword f={f} text="where was the eye?" at={[MX, 120]} s={T.key} appear={0} out={tRing - 20} />
        <ColourBar x={MX} y={250} w={420} lut={LUT_DBZ} lo={0} hi={60} unit="dBZ" title="radar echo strength" o={oR} ticks={[{ v: 0, t: "0" }, { v: 30, t: "30" }, { v: 60, t: "60" }]} />
        {/* #5b r2 S6: the unit dBZ said in plain words */}
        <Lbl x={MX} y={372} t="dBZ: higher = heavier rain" c={C.local} s={T.floor} o={oR} />
        <SideCallout f={f} lines="eyewall ≈ 30 km radius" at={[MX, 120]} appear={tRing} out={tModel - 20} target={[PB.x + PB.w / 2 + ewR * 0.7, PB.y + PB.h / 2 - ewR * 0.7]} s={T.floor} c={C.gold} />
        <Lbl x={MX} y={440} t="radar eye" c={C.key} s={T.floor} o={win(f, tBest, tModel - 20)} />
        <SpeedBar x={MX} y={250} w={420} hi={55} o={oM} />
        <Keyword f={f} text="model centre" at={[MX, 120]} s={T.key} c={C.first} appear={tModel} out={tRule - 20} />
        <g opacity={win(f, tModel + 30, tRule - 20)}>
          <circle cx={MX + 60} cy={470} r={12} fill="none" stroke={C.key} strokeWidth={4} />
          <line x1={MX + 60} y1={470} x2={MX + 60 + 170 * Math.sin(S17D.brg * D2R)} y2={470 - 170 * Math.cos(S17D.brg * D2R)} stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" />
          <circle cx={MX + 60 + 170 * Math.sin(S17D.brg * D2R)} cy={470 - 170 * Math.cos(S17D.brg * D2R)} r={12} fill={C.first} stroke={C.bg} strokeWidth={3} />
          <Lbl x={MX + 120} y={420} t="radar eye" c={C.key} s={T.floor} />
          <Lbl x={MX + 120} y={590} t={`≈ ${Math.round(S17D.d_eye)} km WSW: model`} c={C.gold} s={T.floor} />
        </g>
        <Lbl x={MX} y={650} t={`model: ${Math.round(S17D.pmin)} hPa`} c={C.first} s={T.floor} o={win(f, tP, tRule - 20)} />
        <Lbl x={MX} y={720} t={`official estimate: ${S17D.best} hPa`} c={C.key} s={T.floor} o={win(f, tP + 30, tRule - 20)} />
        <Lbl x={MX} y={790} t="a little off, a little weak" c={C.local} s={T.floor} o={win(f, tOff, tRule - 20)} />
        <Keyword f={f} text="our rule" at={[MX, 120]} s={T.key} appear={tRule} />
        <Lbl x={MX} y={430} t="where the eye is: radar, satellite" c={C.key} s={T.floor} o={fin(f, tR1)} />
        <Lbl x={MX} y={510} t="winds: model, own centre" c={C.first} s={T.floor} o={fin(f, tR2)} />
      </Svg>
      <SourceBelow text={SRC.radar} pic={PB} w={1400} o={oR} name="s17 src r" />{/* lint-ok: the name prop is a probe id, never drawn */}
      <SourceBelow text={SRC.radar2} pic={{ ...PB, h: PB.h + 36 }} w={1400} o={oR} name="s17 src r2" />
      <SourceBelow text={SRC.hrrr18} pic={PB} w={960} o={oM} name="s17 src m" />
    </Scene>
  );
};

// ================================================================ the HRRR layer stack (s18, s19): 1 unit = 100 km across
// user notes 2026-11-06 item 6: the five layers EVENLY spaced (0.9 units apart: the bottom two and the top two no longer nearly touch) in a
// much taller stack (≈ 4 units tall over a 5-unit square). The height axis is therefore no longer linear in km: each layer's tag carries its
// pressure and height, and every other height (the radar's up arrows, the in-up-out path) goes through zMap, piecewise linear through the
// five (height, layer) pairs. Listed in the storyboard / manifest exaggerations ("layers evenly spaced, not to scale").
const zs = [0.35, 1.25, 2.15, 3.05, 3.95];
const STACK_TGT: V3 = [0, 0, 1.95];
/** height [km] → stack units: through (0, 0) and the five (z_km[i], zs[i]); above the top layer at the top segment's slope */
export const zMap = (zkm: number) => {
  const zk = [0, ...(STK.z_km as number[])], zu = [0, ...zs];
  for (let i = 1; i < zk.length; i++) if (zkm <= zk[i]) return zu[i - 1] + ((zu[i] - zu[i - 1]) * (zkm - zk[i - 1])) / (zk[i] - zk[i - 1]);
  const n = zk.length - 1;
  return zu[n] + ((zu[n] - zu[n - 1]) * (zkm - zk[n])) / (zk[n] - zk[n - 1]);
};
const ringPts = (r: number, z: number): V3[] => circ(r, z, 64);
/** the radar's strong-ascent radius [km] at height z [km]: piecewise linear through the measured 2 / 5 / 8 / 11-km values (DS29), held
 * constant outside 2-11 km (no extrapolation past the data) */
export const leanR = (z: number) => {
  const zz = WV.tdr.lean_z as number[], rr = WV.tdr.lean_r as number[];
  if (z <= zz[0]) return rr[0];
  for (let i = 1; i < zz.length; i++) if (z <= zz[i]) return rr[i - 1] + ((rr[i] - rr[i - 1]) * (z - zz[i - 1])) / (zz[i] - zz[i - 1]);
  return rr[rr.length - 1];
};
/** measured rising air on the eyewall ring (three.js only): at 2 / 5 / 8 / 11 km, 8 azimuths, length ∝ the radar's slanted ring max w,
 * base on the strong-ascent radius, leaning outward along leanR; heights through zMap; beads animate (house wind rule) */
const W_KM_PER_MS = 0.8;                                    // drawn rise per m/s [km of height]: 3.3 m/s → 2.7 km
const UpArrows3D: React.FC<{ f: number; o: number }> = ({ f, o }) => {
  if (o <= 0) return null;
  const sl = WV.tdr.slanted as number[][];
  return <group>{sl.map(([z, w], li) => Array.from({ length: 8 }, (_, j) => {
    const a = ((j + 0.5) * Math.PI) / 4, z1 = z + w * W_KM_PER_MS, r0 = leanR(z) / 100, r1 = leanR(z1) / 100;
    const p: V3 = [r0 * Math.cos(a), r0 * Math.sin(a), zMap(z)], q: V3 = [r1 * Math.cos(a), r1 * Math.sin(a), zMap(z1)];
    return <group key={`w${li}_${j}`}><HArrow3D from={p} to={q} color={C.gold} px={5} head={Math.min(18, 8 + w * 4)} o={o} /><Bead3D f={f} a={p} b={q} speed={w * 3} o={o} /></group>;
  }))}</group>;
};
const StackBody: React.FC<{ f: number; lit: (i: number) => number; ringO: number; dashO: number; path?: number; wO?: number }> = ({ f, lit, ringO, dashO, path = 0, wO = 0 }) => {
  const tex = (STK.levels as number[]).map((lv) => useTex(IMG(`cst_ur_${lv}.png` as "cst_ur_925.png"))); // eslint-disable-line react-hooks/rules-of-hooks
  // heavy phase K6 r0 (root cause, = TexQuad / build-1 fix loop 1): Remotion's ThreeCanvas draws the GL frame only when the FRAME
  // changes; layer textures that land after that draw (a fresh tab: every still, the first frame of every render chunk) never
  // reached the canvas, so the stack showed arrows only. Draw again when a texture lands (layout effect: before useTex's
  // continueRender releases the frame).
  const advance = useThree((s) => s.advance);
  const nTex = tex.filter(Boolean).length;
  useLayoutEffect(() => { if (nTex > 0) advance(performance.now()); }, [nTex, advance]);
  const H = STK.half_km / 100;
  const layers: StackLayer[] = tex.map((t, i) => ({ tex: t, z: zs[i], o: lit(i) }));
  const reveal = zs.map((_, i) => clamp((f - 4 - i * 6) / 12, 0, 1));
  const top = zs[4];
  // the in-up-out path at azimuth −36°: the up-leg follows the radar's measured outward lean (leanR), from the bottom layer to the top
  const ua: [number, number] = [Math.cos(-36 * D2R), Math.sin(-36 * D2R)];
  const rUp0 = leanR(STK.z_km[0]) / 100, rUp1 = leanR(STK.z_km[4]) / 100;
  const pth: V3[] = [[2.7 * ua[0], 2.7 * ua[1], zs[0] + 0.02], [rUp0 * ua[0], rUp0 * ua[1], zs[0] + 0.02], [rUp1 * ua[0], rUp1 * ua[1], top - 0.02], [2.7 * ua[0], 2.7 * ua[1], top - 0.02]];
  return (
    <group>
      <LayerStack3D layers={f < 3 ? [] : layers} foot={{ x0: -H, x1: H, y0: -H, y1: H }} sep={1} reveal={reveal} mask={{ name: "stack", clipX: 1068, clipY: 788 }}
        lines={zs.map((z) => ({ pts: ringPts(1, z + 0.01), color: C.first, px: 3, o: 0.9 * ringO }))} />
      {[[-H, -H], [H, -H], [H, H], [-H, H]].map(([x, y], i) => <HRod3D key={`e${i}`} a={[x, y, 0]} b={[x, y, top + 0.05]} px={2} color={C.muted} o={0.6} />)}
      <HArrow3D from={[-H, -H, 0]} to={[-H, -H, top + 0.9]} color={C.second} px={5} head={22} />
      {(STK.dash_vt as number[][]).map((vts, li) => vts.map((vt, j) => {
        const a = (j * Math.PI) / 4, p: V3 = [Math.cos(a), Math.sin(a), zs[li] + 0.02], L = (vt / 35) * 0.55;
        const q: V3 = [p[0] - Math.sin(a) * L, p[1] + Math.cos(a) * L, p[2]];
        return <group key={`${li}_${j}`}><HArrow3D from={p} to={q} color={C.key} px={4} head={14} o={0.9 * dashO * reveal[li]} /><Bead3D f={f} a={p} b={q} speed={vt} o={dashO * reveal[li]} /></group>;
      }))}
      {pth.slice(1).map((q, i) => <HArrow3D key={`p${i}`} from={pth[i]} to={q} color={C.gold} px={7} head={26} grow={clamp(path * 3 - i, 0, 1)} o={path > 0 ? 1 : 0} />)}
      <UpArrows3D f={f} o={wO} />
    </group>
  );
};
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_ian_stack");
  const tLev = SS(k, 1), tHt = SS(k, 2), tFive = SS(k, 3), tSq = SS(k, 4), tLow = SS(k, 5), tNo = SS(k, 6), tRest = SS(k, 7), tCol = SS(k, 8), tRose = SS(k, 9), tBlue = SS(k, 10),
    tPale = SS(k, 11), tTall = SS(k, 12);
  // user notes 2026-11-06 item 6: the camera reads the values: the whole (taller) stack from the side; on "Here are five layers" it eases in
  // close from an oblique angle (every layer centre stays in frame), hovers and orbits slowly while the levels are named; then it pulls back
  // a little and orbits round the stack again. checks/stack_frame.ts projects every frame (keys copied there).
  const keys: OrbitKey[] = [
    { f: 0, az: -100, el: 16, dist: 16.5, target: STACK_TGT },
    { f: tFive, az: -86, el: 18, dist: 16.5, target: STACK_TGT },
    { f: tFive + 150, az: -68, el: 24, dist: 15.5, target: STACK_TGT },   // notes 2 M1: 13.5 → 15.5 (the height arrow and the top layer stay ≥ 40 px inside)
    { f: tCol, az: -40, el: 26, dist: 15.5, target: STACK_TGT },
    { f: tCol + 150, az: -30, el: 22, dist: 18, target: STACK_TGT },
    { f: LEN(k) + 10, az: -86, el: 22, dist: 18, target: STACK_TGT, linear: true },
  ];
  const st = hOrbitCam({ ...hOrbitPath(keys, f), fov: 32 }, [600, 405]);
  const pr = hProjector(st, 1920, 1080, 0, 0);
  const H = STK.half_km / 100;
  const tagAt = (i: number) => pr.p([H, 0, zs[i]]);   // the middle of each layer's right edge: on screen and above the bottom fade in every view (stack_frame probe)
  const tTag = [tLow, AT(k, 7, "eight hundred"), AT(k, 7, "five hundred,"), AT(k, 7, "two hundred,"), AT(k, 7, "one hundred and fifty")];
  const tags = ["925 hPa ≈ 0.7 km", "850 hPa ≈ 1.4 km", "500 hPa ≈ 6 km", "200 hPa ≈ 12 km", "150 hPa ≈ 14 km"]; // fix 0 B12: rounded as spoken
  const tagY = [780, 692, 604, 516, 428];                                       // the tags in the column, bottom → top as the layers
  const upTip = pr.p([-H, -H, zs[4] + 1.0]);
  return (
    <Scene>
      <HView3D st={st} x={0} y={0} w={1920} h={1080}>
        <StackBody f={f} lit={() => 0.92} ringO={0} dashO={1} />
      </HView3D>
      <GlobeFrame id="s18k" zoom={1} right={1} name="s18 stack" />
      <Svg>
        {/* notes 2 M1: the close camera clipped the end-anchored label above the tip ("nt"): now right of the tip, pinned ≥ 40 px inside the frame */}
        <g data-lc-maplabel="1"><Lbl x={Math.max(40, upTip[0] + 22)} y={Math.max(70, upTip[1] + 30)} t="height" c={C.second} s={T.floor} b={false} o={fin(f, tHt)} /></g>
        {tags.map((t, i) => { const q = tagAt(i), y = tagY[i];
          return <g key={t} opacity={fin(f, tTag[i])}><Lbl x={1210} y={y} t={t} c={C.key} s={T.floor} />
            <line x1={1196} y1={y} x2={q[0] + 8} y2={q[1]} stroke={C.gold} strokeWidth={3} opacity={0.8} /></g>; })}
        <Keyword f={f} text="layer by layer" at={[1210, 120]} s={T.key} appear={0} out={tLev - 20} />
        <Keyword f={f} text="pressure levels" at={[1210, 120]} s={T.key} appear={tLev} out={tSq - 20} />
        <Keyword f={f} text="square ≈ 500 km" at={[1210, 120]} s={T.key} appear={tSq} out={tNo - 20} />
        <Keyword f={f} text="975 hPa: under the sea" at={[1210, 120]} s={T.floor} c={C.local} appear={tNo} out={tRest - 20} />
        <Keyword f={f} text="five levels, five heights" at={[1210, 120]} s={T.floor} appear={tRest} out={tCol - 20} />
        <URBar x={1210} y={196} w={420} title={false} o={fin(f, 6) * fout(f, LEN(k) + 20)} />
        <Keyword f={f} text="rose −: in · blue +: out" at={[1210, 120]} s={T.floor} appear={tRose} out={tPale - 20} />
        <Keyword f={f} text="dark line: zero" at={[1210, 120]} s={T.floor} appear={tPale} out={tTall - 20} />
        <Keyword f={f} text="spread out evenly" at={[1210, 120]} s={T.key} appear={tTall} />
      </Svg>
      <SourceBelow text={SRC.hrrrPl} pic={{ x: 80, y: 40, w: 1000, h: 760 }} w={1400} name="s18 src" />{/* K6 r0: was in the caption band */}
    </Scene>
  );
};

// ================================================================ s19 the layers lit, bottom to top; orbit; one close look
const S19: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19_ian_layers_lit");
  const tLow = SS(k, 1), tAvg = SS(k, 2), t15 = SS(k, 3), t6 = SS(k, 4), tTop = SS(k, 5), tSo = SS(k, 6), tOrbit = SS(k, 7), tLook = SS(k, 8);
  const top = zs[4];
  // user notes 2026-11-06 item 6: starts where s18 ended (az −86, dist 18) and drifts slowly while the layers are lit and read; from S7 the
  // swing round and the one close look are KEPT as the user liked them (same moves, distances scaled to the taller stack)
  const keys: OrbitKey[] = [
    { f: 0, az: -86, el: 22, dist: 18, target: STACK_TGT },
    { f: tOrbit, az: -76, el: 22, dist: 18, target: STACK_TGT },
    { f: Math.min(tOrbit + 150, tLook - 12), az: 4, el: 30, dist: 19, target: STACK_TGT },
    { f: tLook, az: 4, el: 28, dist: 19, target: STACK_TGT },
    { f: tLook + 45, az: -6, el: 6, dist: 7.5, target: [0, -1.6, top * 0.45] },
    { f: tLook + 45 + 40, az: -2, el: 6, dist: 7.5, target: [0, -1.6, top * 0.5], linear: true },
    { f: tLook + 45 + 40 + 45, az: -20, el: 24, dist: 19, target: STACK_TGT },
    { f: LEN(k) + 10, az: -26, el: 24, dist: 19, target: STACK_TGT, linear: true },
  ];
  const st = hOrbitCam({ ...hOrbitPath(keys, f), fov: 32 }, [600, 405]);
  const pr = hProjector(st, 1920, 1080, 0, 0);
  const sel = f < tLow ? null : f < t15 ? [0] : f < t6 ? [1] : f < tTop ? [2, 3] : f < tSo ? [4] : null;
  const lit = (i: number) => (f < SS(k, 0) + 20 ? 0.92 : sel === null ? 0.85 : sel.includes(i) ? 1 : 0.4);
  const ringR = zs.map((z) => ringPts(1, z).map((v) => pr.p(v)).reduce((a, b) => (b[0] > a[0] ? b : a)));
  const colO = (1 - 0.5 * win(f, tOrbit, tLook - 20, 12)) * (1 - win(f, tLook - 4, tLook + 135, 12));
  const vr = STK.vr100 as number[];
  return (
    <Scene>
      <HView3D st={st} x={0} y={0} w={1920} h={1080}>
        {/* notes 2 S1: the radar's up arrows wait for s20, where the radar is introduced (wO 0) */}
        <StackBody f={f} lit={lit} ringO={fin(f, 6)} dashO={1} path={prog(f, tSo, tSo + 60)} wO={0} />
      </HView3D>
      <GlobeFrame id="s19k" zoom={1} right={1} name="s19 stack" />
      <Svg>
        <Keyword f={f} text="read on the 100-km ring" at={[1210, 120]} s={T.floor} appear={0} out={tSo - 20} />
        {/* #5b r1 M7(b): the colour bar stays through the swing round and the close look */}
        {/* notes 2 M2: the layers run under the bar in the close side look: the bar steps out for it and comes back after */}
        <URBar x={1210} y={250} w={400} title={false} o={1 - win(f, tLook + 10, tLook + 45 + 40 + 30, 12)} />
        <g opacity={colO}>
          <SideCallout f={f} lines={`14 km: ≈ +${(Math.round(vr[4] * 2) / 2).toFixed(1)} m/s`} at={[1210, 440]} appear={tTop} target={ringR[4]} s={T.floor} c="#8db5e2" bend={20} />
          <SideCallout f={f} lines={`12 km: ≈ +${Math.round(vr[3])}`} at={[1210, 520]} appear={t6} target={ringR[3]} s={T.floor} c="#8db5e2" bend={20} />
          <SideCallout f={f} lines={`6 km: ≈ +${Math.round(vr[2])}`} at={[1210, 600]} appear={t6 + 20} target={ringR[2]} s={T.floor} c="#8db5e2" bend={10} />
          <SideCallout f={f} lines="1.4 km: ≈ 0" at={[1210, 680]} appear={t15} target={ringR[1]} s={T.floor} c={C.local} bend={-10} />
          <SideCallout f={f} lines={`0.7 km: ≈ ${nf(vr[0], 1)} m/s`} at={[1210, 760]} appear={tAvg} target={ringR[0]} s={T.floor} c={C.neg} bend={-20} />
        </g>
        <Lbl x={1210} y={120} t="in → up → out" c={C.gold} s={T.key} o={fin(f, tSo) * fout(f, tOrbit - 20)} />
        <Keyword f={f} text="swing round" at={[1210, 120]} s={T.key} appear={tOrbit} out={tLook - 20} />
      </Svg>
      {/* K6 r0: the two credits cross-faded on top of each other and sat in the caption band: one after the other, 30 px higher */}
      <SourceBelow text={SRC.hrrrPl} pic={{ x: 80, y: 40, w: 1000, h: 760 }} w={1400} name="s19 src" />{/* notes 2 S1: the HRRR line stays (no radar line in s19) */}
      {/* K6 round 1: during the swing round and the close look the stack reaches below y 810: the credit steps aside meanwhile */}
      {/* #5b r1 M7(b): the credit stays through the swing round and the close look: below y 830 the K1 frame is solid background, and the
          stack's K6 mask is now clipped to the sharp region (x ≤ 1068, y ≤ 788), as the house frame defines it */}
    </Scene>
  );
};

// ================================================================ s20 the radius-height section: in, up and out (D20)
const SB = { x: 170, y: 70, w: 820, h: 610 };            // s20: room under the box for a two-line source line
export const secP = (r: number, z: number, B = SB, rMax = 200): Pt => [B.x + (r / rMax) * B.w, B.y + B.h - (z / 16) * B.h];
export const SecAxes: React.FC<{ B?: typeof SB; rMax?: number; o?: number; rt?: number[] }> = ({ B = SB, rMax = 200, o = 1, rt = [0, 50, 100, 150, 200] }) => o <= 0 ? null : (
  <g opacity={o}>
    <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="none" stroke={C.grid} strokeWidth={3} />
    {rt.map((r) => <Lbl key={r} x={secP(r, 0, B, rMax)[0]} y={B.y + B.h + 34} t={`${r}`} c={C.muted} s={T.floor} a="middle" b={false} />)}
    {[0, 4, 8, 12, 16].map((z) => <Lbl key={z} x={B.x - 14} y={secP(0, z, B, rMax)[1]} t={`${z}`} c={C.muted} s={T.floor} a="end" b={false} />)}
    <Lbl x={B.x + B.w} y={B.y + B.h + 84} t="distance from the centre (km)" c={C.muted} s={T.floor} a="end" b={false} />
    <Lbl x={B.x - 14} y={B.y - 30} t="height (km)" c={C.muted} s={T.floor} a="start" b={false} />
  </g>
);
export const InUpOut: React.FC<{ f: number; P: (r: number, z: number) => Pt; rIn: [number, number]; rUp: number; zTop: number; o?: number }> = ({ f, P, rIn, rUp, zTop, o = 1 }) => {
  if (o <= 0) return null;
  const segs: [Pt, Pt][] = [[P(rIn[1], 0.8), P(rIn[0], 0.8)], [P(rUp, 1.6), P(rUp, zTop - 1.5)], [P(rIn[0] + 10, zTop - 0.5), P(rIn[1], zTop - 0.5)]];
  return <g opacity={o}>{segs.map(([a, b], i) => <g key={i}><Arrow p={a} q={b} color={C.gold} w={8} head={30} />
    <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.bg} strokeWidth={3} strokeDasharray="8 30" strokeDashoffset={-((f * 1.5) % 38)} /></g>)}</g>;
};
/** a gold arrow with moving background dashes (the house wind rule: arrows always animated) */
const FlowArrow: React.FC<{ f: number; a: Pt; b: Pt; w?: number; head?: number; o?: number; speed?: number }> = ({ f, a, b, w = 8, head = 30, o = 1, speed = 1.5 }) => o <= 0 ? null : (
  <g opacity={o}>
    <Arrow p={a} q={b} color={C.gold} w={w} head={head} />
    <line x1={a[0]} y1={a[1]} x2={a[0] + (b[0] - a[0]) * 0.8} y2={a[1] + (b[1] - a[1]) * 0.8} stroke={C.bg} strokeWidth={3} strokeDasharray="8 30"
      strokeDashoffset={-((f * speed) % 38)} />
  </g>
);
const S20: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20_ian_curtain");
  const tAvg = SS(k, 1), tDep = SS(k, 2), tSlice = SS(k, 3), tName = SS(k, 4), tMin = SS(k, 7), tTop = SS(k, 8), tLines = SS(k, 9), tVt = SS(k, 10),
    // fix 0 B13: S12 became four sentences (quick check · in through the side · up through the lid · the radar): later indices +3
    tWeak = SS(k, 11), tMust = SS(k, 12), tSide = SS(k, 13), tLid = SS(k, 14), tRadar = SS(k, 15), tThree = AT(k, 15, "about three metres"),
    tTower = AT(k, 15, "single towers"), tEw = SS(k, 16), tIUO = SS(k, 17), tMore = SS(k, 18);
  // fix loop 1 (r8 review 2 S4, S6, S7): the callouts on their numbers; the quick check asks first and answers on "is about one"; |u_r| gold
  const tMin16 = AT(k, 7, "minus sixteen"), tTop9 = AT(k, 8, "plus nine"), tVt55 = AT(k, 10, "fifty five"), t16 = AT(k, 13, "sixteen metres"),
    tDivR = AT(k, 14, "divided by the radius"), tOne = AT(k, 14, "is about one");
  const oSec = fin(f, tSlice);
  const ringE = 1 - prog(f, tDep, tDep + 70);                 // #5b r1 S13: shrinks on S2 ("going all the way round removes theta")
  const RB = { x: 230, y: 60, w: 500, h: 500 }, ringPx = (100 / (2 * STK.half_km)) * RB.w;   // the 925-hPa layer square, the 100-km ring
  const oRing = fout(f, tSlice - 6) * fin(f, 0, 10);
  // the radar: the axes zoom from r 0-200 / z 0-16 km to the radar panel's r 0-100 / z 0-14 km, then the w panel cross-fades in
  const zp = prog(f, tRadar, tRadar + 40), xf = prog(f, tRadar + 20, tRadar + 50);
  const rMax = mix(200, 100, zp), zMax = mix(16, 14, zp);
  const P = (r: number, z: number): Pt => [SB.x + (r / rMax) * SB.w, SB.y + SB.h - (z / zMax) * SB.h];
  const oH = 1 - xf;                                           // the HRRR u_r layer
  const vtl = SEC.vt_lines as { level: number; pts: number[] }[];
  const vlab = SEC.vt_labels as { level: number; r: number; z: number }[];
  const mn = P(SEC.min[1], SEC.min[2]), mxp = P(SEC.max[1], SEC.max[2]), vtp = P(SEC.vtmax[1], SEC.vtmax[2]);
  const eye = WV.tdr.eye_km as number, sl = WV.tdr.slanted as number[][], pk = WV.tdr.peak as number[];
  const pkP = P(pk[2], pk[1]);
  const oAxA = oSec * fout(f, tRadar - 12, 10), oAxB = oSec * fin(f, tRadar + 42, 12);
  const wUp = (i: number) => fin(f, tRadar + 50 + i * 12, 14);
  return (
    <Scene>
      <Svg>
        {/* #5b r1 S13: the 72 samples of the formula on the 925-hPa layer (its colour bar and source line below), shrinking to one
            point on "going all the way round removes theta" */}
        <g opacity={oRing}>
          <image href={IMG("cst_ur_925.png")} x={RB.x} y={RB.y} width={RB.w} height={RB.h} preserveAspectRatio="none" opacity={1 - 0.6 * fin(f, tDep + 60)} />
          <rect x={RB.x} y={RB.y} width={RB.w} height={RB.h} fill="none" stroke={C.grid} strokeWidth={3} />
          <circle cx={RB.x + RB.w / 2} cy={RB.y + RB.h / 2} r={ringPx * ringE + 4} fill="none" stroke={C.first} strokeWidth={4} />
          {Array.from({ length: 72 }, (_, i) => { const a = (i * 2 * Math.PI) / 72; return <circle key={i} cx={RB.x + RB.w / 2 + ringPx * ringE * Math.cos(a)} cy={RB.y + RB.h / 2 + ringPx * ringE * Math.sin(a)} r={4.5} fill={C.key} stroke={C.bg} strokeWidth={1.5} />; })}
          <circle cx={RB.x + RB.w / 2} cy={RB.y + RB.h / 2} r={14} fill={C.gold} opacity={fin(f, tDep + 60)} />
          <URBar x={RB.x + 40} y={RB.y + RB.h + 70} w={360} o={fin(f, 14, 8)} />{/* K6 r4: in after the cross-fade from the s19 stack */}
        </g>
        <Lbl x={MX} y={700} t="one ring → one point $(r,\ z)$" c={C.key} s={T.floor} o={win(f, tDep + 60, tSlice - 6) * fin(f, 0, 10)} />
      </Svg>
      {/* K6 round 1: the section pictures sit in an overflow-hidden <div> of the section box (the GeoMap pattern): during the radar
          zoom the HRRR picture grows past the box, and the nested-svg crop was not seen by the box probe (text-img on the colour bar
          title and the keyword at 30:48, frame 55430) */}
      <AbsoluteFill style={{ opacity: oSec }}>
        <div style={{ position: "absolute", left: SB.x, top: SB.y, width: SB.w, height: SB.h, overflow: "hidden" }}>
          <svg width={1920} height={1080} style={{ position: "absolute", left: -SB.x, top: -SB.y }}>
            <defs><clipPath id="s20clip"><rect x={SB.x} y={SB.y} width={SB.w} height={SB.h} /></clipPath></defs>
            <g clipPath="url(#s20clip)">
              <image href={IMG("cst_sec_ian.png")} x={SB.x} y={SB.y + SB.h - (SB.h * 16) / zMax} width={(SB.w * 200) / rMax} height={(SB.h * 16) / zMax}
                preserveAspectRatio="none" opacity={oH} />
              {vtl.map((L, i) => <path key={i} d={poly(Array.from({ length: L.pts.length / 2 }, (_, j) => P(L.pts[2 * j], L.pts[2 * j + 1])))} fill="none" stroke="#1a1a24"
                strokeWidth={3.5} opacity={fin(f, tLines) * oH} />)}
              <image href={IMG("cst_tdr_w.png")} x={SB.x} y={SB.y + SB.h - (SB.h * 14) / zMax} width={(SB.w * 100) / rMax} height={(SB.h * 14) / zMax}
                preserveAspectRatio="none" opacity={xf} />
              <g data-lc-own="s20eye"><rect x={SB.x} y={SB.y} width={P(eye, 0)[0] - SB.x} height={SB.h} fill="#5d6577" opacity={0.9 * xf} /></g>
            </g>
          </svg>
        </div>
      </AbsoluteFill>
      <Svg>
        <g opacity={oSec}>
          {/* K6 round 2: during the radar zoom the line labels ride out of the section box: each fades as it nears the box edge */}
          {vlab.map((L, i) => { const q = P(L.r, L.z);
            const inB = Math.min(q[0] - 30 - SB.x, SB.x + SB.w - 30 - q[0], q[1] - 18 - SB.y, SB.y + SB.h - 18 - q[1]);
            // #5b r1 S14: dark text on a PALE halo (the dark halo read as smudges at 640 px)
            // fix loop 1 (review 2 Nit 7): a line label within 34 px of the gold inflow arrow (z 0.5 km, r 31-170 km) steps aside while it is drawn
            const nearIn = Math.abs(q[1] - P(100, 0.5)[1]) < 34 && q[0] > P(25, 0)[0] && q[0] < P(175, 0)[0];
            const oL = fin(f, tLines + 10) * oH * clamp(inB / 8, 0, 1) * (nearIn ? 1 - win(f, tSide - 12, tRadar - 6) : 1);
            return oL <= 0 ? null : <text key={i} x={q[0]} y={q[1]} fill="#1a1a24" fontSize={T.floor} fontFamily={FONT} fontWeight={650} textAnchor="middle"
              dominantBaseline="central" stroke="#f1ece0" strokeWidth={0.2 * T.floor} strokeLinejoin="round" paintOrder="stroke" opacity={oL}>{`${L.level}`}</text>; })}
          <rect x={SB.x} y={SB.y} width={SB.w} height={SB.h} fill="none" stroke={C.grid} strokeWidth={3} />
          {[0, 50, 100, 150, 200].map((r) => <Lbl key={`ra${r}`} x={P(r, 0)[0]} y={SB.y + SB.h + 34} t={`${r}`} c={C.muted} s={T.floor} a="middle" b={false} o={oAxA} />)}
          {[0, 25, 50, 75, 100].map((r) => <Lbl key={`rb${r}`} x={P(r, 0)[0]} y={SB.y + SB.h + 34} t={`${r}`} c={C.muted} s={T.floor} a="middle" b={false} o={oAxB} />)}
          {[0, 4, 8, 12, 16].map((z) => <Lbl key={`za${z}`} x={SB.x - 14} y={P(0, z)[1]} t={`${z}`} c={C.muted} s={T.floor} a="end" b={false} o={oAxA} />)}
          {[0, 4, 8, 12].map((z) => <Lbl key={`zb${z}`} x={SB.x - 14} y={P(0, z)[1]} t={`${z}`} c={C.muted} s={T.floor} a="end" b={false} o={oAxB} />)}
          <Lbl x={SB.x + SB.w} y={SB.y + SB.h + 84} t="distance from the centre (km)" c={C.muted} s={T.floor} a="end" b={false} />
          <Lbl x={SB.x - 14} y={SB.y - 30} t="height (km)" c={C.muted} s={T.floor} a="start" b={false} o={1 - win(f, tRadar - 12, tRadar + 52, 8)} />
          <g data-lc-own="s20eye"><Lbl x={(SB.x + P(eye, 0)[0]) / 2} y={SB.y + SB.h * 0.45} t="no echoes" c={C.key} s={T.floor} a="middle" rot={-90} o={xf} /></g>
          <line x1={P(25, 0)[0]} y1={SB.y + SB.h - 4} x2={P(25, 0)[0]} y2={SB.y + SB.h - 40} stroke={C.first} strokeWidth={8} opacity={fin(f, tWeak) * oH} />
          <circle cx={mn[0]} cy={mn[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tMin16) * oH} />
          <circle cx={mxp[0]} cy={mxp[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tTop9) * oH} />
          <circle cx={vtp[0]} cy={vtp[1]} r={12} fill={C.key} stroke={C.bg} strokeWidth={3} opacity={fin(f, tVt55) * oH} />
          {/* the inflow says the air must rise: the continuity w (≈ 1 m/s at r ≈ 18-26 km), dashed, on the HRRR section */}
          {/* fix 0 B13: the box estimate on the section: a cylinder r 0-30 km, h 0-1 km (gold outline); in through its side, up
              through its lid (three short dashed up arrows) */}
          <rect x={P(0, 1)[0]} y={P(0, 1)[1]} width={P(30, 0)[0] - P(0, 0)[0]} height={P(0, 0)[1] - P(0, 1)[1]} fill="none" stroke={C.gold} strokeWidth={5}
            opacity={win(f, tSide, tRadar - 6)} />
          <FlowArrow f={f} a={P(170, 0.5)} b={P(31, 0.5)} o={win(f, tSide, tRadar - 6)} />
          {[7, 15, 23].map((r) => <Arrow key={`bx${r}`} p={P(r, 1.15)} q={P(r, 4.2)} color={C.gold} w={6} head={24} dash="12 9" o={win(f, tLid, tRadar - 6)} />)}
          {/* measured: gold up arrows along the radar's outward-leaning updraught, thickness in proportion to its ring max w */}
          {[0, 1, 2].map((i) => { const z0 = sl[i][0] + 0.3, z1 = sl[i + 1][0] - 0.3;
            return <FlowArrow key={`u${i}`} f={f} a={P(leanR(z0), z0)} b={P(leanR(z1), z1)} w={5 + 2.2 * sl[i][1]} head={26 + 3 * sl[i][1]} o={xf * wUp(i)} speed={1 + sl[i][1]} />; })}
          <circle cx={pkP[0]} cy={pkP[1]} r={13} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={xf * fin(f, tThree)} />
          {/* in, up and out: schematic in and out on the radar panel with the measured up arrows */}
          <FlowArrow f={f} a={P(96, 0.8)} b={P(leanR(2) + 4, 0.8)} w={7} o={xf * fin(f, tIUO)} />
          <FlowArrow f={f} a={P(leanR(11) + 6, 12.6)} b={P(96, 12.6)} w={7} o={xf * fin(f, tIUO + 10)} />
        </g>
        <Keyword f={f} text="average round each ring" at={[MX, 120]} s={T.key} appear={0} out={tSlice - 20} />
        {/* #5b r1 S13: the new notation named */}
        {/* #5b r2 N-M1: the formula and its names leave by tSlice, so the section's colour bar can come in WITH the section */}
        <Lbl x={MX} y={470} t="$\Sigma$: add up the 72 values" c={C.local} s={T.floor} o={win(f, tAvg + 30, tSlice - 10)} />
        <Lbl x={MX} y={530} t="$\overline{u_r}$: the ring average" c={C.local} s={T.floor} o={win(f, tAvg + 50, tSlice - 10)} />
        <Lbl x={MX} y={600} t="derived in Part 1: ring average" c={C.gold} s={T.floor} o={win(f, tAvg + 20, tSlice - 10)} />{/* remake 2026-11-07 (R12) */}
        <Keyword f={f} text="radius-height section" at={[MX, 120]} s={T.key} appear={tName} out={tMust - 20} />
        {/* #5b r2 N-M1 (D2): the bar comes in with the section picture (it waited for S5, 11.5 s of colours without a bar) */}
        <URBar x={MX} y={250} w={420} o={fin(f, tSlice) * oH} />
        <ColourBar x={MX} y={250} w={420} lut={LUT_W} lo={0} hi={WV.tdr.lim} unit="m/s" title="rising air (radar)" o={xf}
          ticks={[{ v: 0, t: "≤ 0" }, { v: 2, t: "2" }, { v: 4, t: "4" }]} />
        {/* K6 round 1: the three callouts 14 px lower (the top one sat 12 px under the colour bar's "+ out") */}
        <SideCallout f={f} lines={`≈ ${nf(SEC.min[0], 0)} m/s, 30 km, 0.7 km up`} at={[MX, 554]} appear={tMin16} out={tMust - 20} target={[mn[0] + 14, mn[1] - 10]} s={T.floor} c={C.neg} />
        <SideCallout f={f} lines={`≈ +${Math.round(SEC.max[0])} m/s, 125 km, 15 km up`} at={[MX, 434]} appear={tTop9} out={tMust - 20} target={[mxp[0] + 14, mxp[1]]} s={T.floor} c="#8db5e2" />
        <SideCallout f={f} lines={`$u_\\theta$ ≈ ${Math.round(SEC.vtmax[0])} m/s, 30 km, 1.4 km up`} at={[MX, 494]} appear={tVt55} out={tMust - 20} target={[vtp[0] + 14, vtp[1] + 6]} s={T.floor} c={C.key} />
        <Lbl x={MX} y={630} t={`at the sea: ${nf(SEC.vt10_25, 1)} m/s (25 km, 10 m)`} c={C.first} s={T.floor} o={win(f, tWeak, tMust - 20)} />
        <Lbl x={MX} y={50} t="Hurricane Ian · 28 Sep 2022" c={C.ink} s={T.floor} />{/* fix 1b (user 2026-11-08): the event heading at the top of the right column, level with the picture's top */}
        <Keyword f={f} text="a quick check" at={[MX, 120]} s={T.key} c={C.gold} appear={tMust} out={tLid - 20} />
        <Keyword f={f} text="how fast must it rise?" at={[MX, 120]} s={T.key} appear={tLid} out={tOne - 20} />
        <Keyword f={f} text={`inflow ⇒ rise ≈ ${SAY.w_cont} m/s`} at={[MX, 120]} s={T.key} c={C.gold} appear={tOne} out={tRadar - 20} />
        {/* K6 round 1: under the (now taller) box rows */}
        <Keyword f={f} text="measured: aircraft radar" at={[MX, 120]} s={T.key} appear={tRadar} out={tIUO - 20} />
        <SideCallout f={f} lines={`≈ ${nf(pk[0], 1)} m/s, ${nf(pk[1], 1)} km up`} at={[MX, 440]} appear={tThree} out={tIUO - 20} target={[pkP[0] + 16, pkP[1]]} s={T.floor} c={C.gold} />
        <Lbl x={MX} y={520} t={`single towers ≈ ${Math.round(WV.tdr.point_max[0])} m/s`} c={C.key} s={T.floor} o={win(f, tTower, tIUO - 20)} />{/* fix loop 1 (review 2 Nit 3): 11.6 m/s, said "near twelve" */}
        <Lbl x={MX} y={600} t="rises in the eyewall" c={C.key} s={T.floor} o={fin(f, tEw)} />
        <Lbl x={MX} y={660} t="leaning outward" c={C.local} s={T.floor} o={fin(f, tEw + 15)} />
        <Keyword f={f} text="in, up and out" at={[MX, 120]} s={T.key} c={C.gold} appear={tIUO} out={tMore - 20} />
        <Keyword f={f} text="more: How tropical cyclones form" at={[MX, 120]} s={T.floor} appear={tMore} />
      </Svg>
      <TeX s={EQ_S20} x={MX} y={330} size={50} o={win(f, tAvg, tSlice - 10)} />
      {/* fix 0 B13: the box continuity, one row per sentence (in = up: 2πr h|u_r| = πr² w) */}
      {/* K6 round 1: the w row ran to x 1854: the formula, then the numbers on "two times one thousand"; the column 15 px higher */}
      {/* K6 r4: two stacks, one after the other (a sliding stack ran its old rows up into the colour bar) */}
      <CalcStack f={f} x={MX} y={405} size={46} maxLines={4} o={fout(f, AT(k, 14, "All of it has to leave") + 16)} rows={[
        { rhs: String.raw`\text{in through the side: }2\pi r\,h\,|u_r|`, at: tSide + 30 },
        // #5b r1 S15: the inputs in metres, on their words
        { rhs: String.raw`r=30\ \mathrm{km}=30\,000\ \mathrm m`, at: AT(k, 13, "thirty kilometres"), cont: true, size: 44 },
        { rhs: String.raw`h=1\ \mathrm{km}=1000\ \mathrm m,\ \ |u_r|\approx${goldAt(f, t16, String(SAY.w_box.ur))}\ \mathrm{m/s}`, at: AT(k, 13, "one kilometre deep"), cont: true, size: 44 },
        { rhs: String.raw`\text{up through the lid: }\pi r^2\,w`, at: tLid },
      ]} />
      {/* #5b r3 S2 (A1, "never skip a calculation"): the division is no longer skipped. The derivation stack is as before (four
          rows, no paging: K6 r8 found a paging stack slid its top row up into the colour bar); on "is about one" it hands over to a
          short stack 45 px lower (its first row is a fraction; at 405 it touched the colour bar): the numbers restated with "w =", then 2 × 1000 × 16 = 32 000 on its own row, then
          32 000 / 30 000 ≈ 1.07 ≈ 1 m/s. All numbers come from SAY.w_box (cs.json), checked above. */}
      <CalcStack f={f} x={MX} y={405} size={46} maxLines={4} o={fout(f, tDivR - 2, 8)} rows={[
        // #5b r1 S15: one move per step: in = out, divide by πr², cancel π and one r, then the numbers
        { rhs: String.raw`2\pi r\,h\,|u_r|=\pi r^2\,w`, at: AT(k, 14, "All of it has to leave") + 30 },
        { rhs: String.raw`w=\dfrac{2\cancel{\pi}\cancel{r}\,h\,|u_r|}{\cancel{\pi}\,r^{\cancel{2}}}`, at: AT(k, 14, "which is a much bigger area") },
        { rhs: String.raw`\phantom{w}=\dfrac{2h\,|u_r|}{r}`, at: AT(k, 14, "so it rises more slowly"), cont: true },
        { rhs: String.raw`\phantom{w}=\dfrac{2\times${kSep(WB.h_m)}\times${WB.ur}}{${kSep(WB.r_m)}}`, at: AT(k, 14, "twice the depth"), cont: true },
      ]} />
      <CalcStack f={f} x={MX} y={450} size={46} maxLines={4} o={fout(f, tRadar - 10)} rows={[
        { rhs: String.raw`w=\dfrac{2\times${kSep(WB.h_m)}\times${WB.ur}}{${kSep(WB.r_m)}}`, at: tDivR + 8 },
        { rhs: String.raw`2\times${kSep(WB.h_m)}\times${WB.ur}=${kSep(WB_PROD)}`, at: tDivR + 20 },
        { rhs: String.raw`w=\dfrac{${kSep(WB_PROD)}}{${kSep(WB.r_m)}}${tailIn(f, tOne, C.ink, String.raw`\approx${WB_Q.toFixed(2)}\approx${SAY.w_cont}\ \mathrm{m/s}`, true)}`, at: Math.min(tDivR + 32, tOne - 4) },
      ]} />
      {/* K6 round 1: one credit after the other (they cross-faded on top of each other for 30 frames) */}
      <SourceBelow text={SRC.hrrrPl} pic={{ x: RB.x, y: RB.y, w: RB.w, h: RB.h + 200 }} w={1300} o={oRing} name="s20 src ring" />
      <SourceBelow text={SRC.hrrrSec + " · dark corner, bottom left: no data (below the sea surface)"} pic={{ x: SB.x - 70, y: SB.y, w: SB.w + 70, h: SB.h + 110 }} w={1400} o={oSec * fout(f, tRadar + 16, 10)} name="s20 src" />
      <SourceBelow text={SRC.tdr} pic={{ x: SB.x - 70, y: SB.y, w: SB.w + 70, h: SB.h + 110 }} w={1720} o={fin(f, tRadar + 28, 12)} name="s20 src w" />
    </Scene>
  );
};

export const SCENES_B: Record<string, React.FC> = {
  s09_dtheta_dt: S09, s10_position_arrow: S10, s11_velocity_on_ring: S11, s12_acceleration: S12, s13_acceleration_numbers: S13, s14_steady_but_turning: S14,
  s15_cylinder: S15, s16_three_parts: S16, s17_ian_check: S17, s18_ian_stack: S18, s19_ian_layers_lit: S19, s20_ian_curtain: S20,
};
void [boxAt, mix, GO];

