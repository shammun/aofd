// ch00_coordinates_flat scenes s21-s28: Hurricane Ian in polar coordinates (HRRR 18 UTC, centre = the model's own calm centre,
// data report 2026-11-05), ring means 35 round / −13 in, what they mean (D10), three ring points by hand (D11), why polar helps
// (labelled curves), the inflow angle and four angles, the recap and the series end card (maths ending).
// Every number is read from data/cf.json; the spoken rounded values (D.say) are asserted against the data below.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Dash, Pt, RightTick, pulse, textW } from "../house/kit/draw";
import { CalcStack, TeX } from "../house/kit/tex";
// Keyword: from ./cf_lib (maths in $…$ is KaTeX)
import { Notebook } from "../house/kit/icons";
import { SourceBelow } from "../house/kit/frame";
import { AnimatedWindArrow } from "../house/kit/wind";
import { CurvedLink } from "../house/kit/extras";
import {
  AT, Keyword, HOLD, ArcHead, Arrow, Ax, Axes, BDot, ClockText, Curve, D2R, GeoMap, IAN, IAN_SRC, K, LEN, Lbl, MapBox, Place, SAY, SE, SS, Scene, SkipChip, keepTime, SideCallout, SpeedBar, Svg,
  arcD, axP, axY, boxAt, clamp, exitFirst, fin, fout, kmPx, mapP, mix, nf, poly, prog, rotS, win, zoomBox,
} from "./cf_lib";
import { IanBody, RING, ringArrows, ringPath } from "./cf_sA";
import { EQ_S21, EQ_S22, EQ_S23, EQ_S24, EQ_S26, cutAt } from "./cf_eq";

// fix 2 (2026-11-07): single-line helpers (checks/swap_check.mjs evaluates module consts). goldAt / hiSz = cf_lib hiOn / hiSize for a
// part of a TeX string (a non-obvious input gold and +8 % on its spoken word); tailIn = the end of a TeX row fading in by colour on its word
// (same string on every frame, so the row never jumps and is one text block for K6)
const goldAt = (f: number, t: number, s: string) => (f >= t - 2 && f <= t + 45 ? "\\textcolor{#d8b23a}{" + s + "}" : s);
const hiSz = (f: number, ts: number[], s: number) => s * (1 + 0.08 * Math.max(...ts.map((t) => Math.sin(Math.PI * Math.min(1, Math.max(0, (f - t + 2) / 47))))));
const hexMix = (a: string, b: string, u: number) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - u) + parseInt(b.slice(i, i + 2), 16) * u).toString(16).padStart(2, "0")).join("");
const tailIn = (f: number, t: number, c: string, s: string) => "\\textcolor{" + hexMix("#171f33", c, Math.min(1, Math.max(0, (f - t) / 8))) + "}{" + s + "}";
const P0 = IAN.pts["0"], P90 = IAN.pts["90"], P135 = IAN.pts["135"];
const CHECK_C: [string, number, number, number][] = [
  ["vt", IAN.vt, SAY.vt, 0.5], ["vr", IAN.vr, SAY.vr, 0.5], ["kmh", SAY.vt * 3.6, SAY.kmh, 0], ["res", Math.hypot(35, 13), SAY.res, 0.5],
  ["res kmh", 13 * 3.6, SAY.res_kmh, 0.5], ["t", 25000 / 13 / 60, SAY.t_min, 0.1], ["lap", 157000 / 35 / 60, SAY.lap_min, 0.3], ["ratio", 35 / 13, SAY.ratio, 0.01],
  ["tan", 13.3 / 34.8, SAY.tan, 0.005], ["angle", Math.atan(13.3 / 34.8) / D2R, SAY.angle, 0.5], ["inflow lib", IAN.inflow, 20.9, 0.05],
  ["p0 u", P0.u, -8.7, 0.05], ["p0 v", P0.v, 38, 0.05], ["p0 ur", P0.ur, -8.7, 0.05], ["p0 ut", P0.ut, 38, 0.05],
  ["p90 u", P90.u, -16.9, 0.05], ["p90 v", P90.v, -37.4, 0.05], ["p135 u", P135.u, -10.1, 0.05], ["p135 v", P135.v, -44.5, 0.05],
  ["p135 ur", P135.ur, -24.3, 0.05], ["p135 ut", P135.ut, 38.6, 0.06], ["npos", 72 - IAN.npos, 58, 0],
  ["7.14", 10.1 * 0.707, 7.14, 0.005], ["31.46", 44.5 * 0.707, 31.46, 0.005], ["7.14-31.46", 7.14 - 31.46, -24.32, 1e-9], ["7.14+31.46", 7.14 + 31.46, 38.6, 1e-9],
  ["outflow max", Math.max(...(IAN.ring.vr as number[])), 14, 0.5],
  // fix 1c (calculation audit)
  ["sum vt", IAN.sum_vt, 2505.9, 0.05], ["sum vr", IAN.sum_vr, -957.2, 0.05], ["vt/72", IAN.sum_vt / 72, 34.8, 0.05], ["vr/72", IAN.sum_vr / 72, -13.3, 0.05],
  ["72 pts", 360 / 5, 72, 0], ["kt", 135 * 1.85, 250, 0.3], ["250/3.6", 250 / 3.6, 69, 0.5], ["ring max", IAN.ring_vmax, 49, 0.2],
  ["35^2", 35 * 35, 1225, 0], ["13^2", 13 * 13, 169, 0], ["sqrt1394", Math.sqrt(1394), 37.3, 0.05], ["25000/13", 25000 / 13, 1923, 0.5], ["1923/60", 1923 / 60, 32, 0.1],
  ["2pi25", 2 * 3.1416 * 25, 157, 0.1], ["157000/35", 157000 / 35, 4490, 5], ["4490/60", 4490 / 60, 75, 0.2], ["35/13", 35 / 13, 2.7, 0.01],
  ["cos135", Math.cos(135 * D2R), -0.707, 5e-4], ["1/sqrt2", 1 / Math.SQRT2, 0.707, 5e-4], ["13.3/34.8", 13.3 / 34.8, 0.382, 5e-4], ["atan .382", Math.atan(0.382) / D2R, 20.9, 0.05], ["atan .38 (s26 screen, review 2 Should 3)", Math.atan(0.38) / D2R, 20.8, 0.05],
  ["vt min", Math.min(...(IAN.ring.vt as number[])), 17, 0.2], ["vt max", Math.max(...(IAN.ring.vt as number[])), 47, 0.2], ["vr min", Math.min(...(IAN.ring.vr as number[])), -40, 0.2],
  ["v 0", IAN.ring.v[0], 38, 0.1], ["v 180", IAN.ring.v[36], -46, 0.5], ["u 270", IAN.ring.u[54], 25, 0.5], ["58", 72 - 14, 58, 0],
];
/** the on-map component labels of s24 (fix 1 Must 2 / Should 3): the same strings as the column, checked against the data */
const LAB24: Record<number, { ur: string; ut: string; urv: number; utv: number }> = {
  0: { ur: "-8.7", ut: "38.0", urv: -8.7, utv: 38.0 }, 90: { ur: "-37.4", ut: "16.9", urv: -37.4, utv: 16.9 }, 135: { ur: "-24.3", ut: "38.6", urv: -24.3, utv: 38.6 } };
[[P0, 0], [P90, 90], [P135, 135]].forEach(([d, az]) => { const L = LAB24[az as number], q = d as { ur: number; ut: number };
  if (Math.abs(q.ur - L.urv) > 0.06 || Math.abs(q.ut - L.utv) > 0.06) throw new Error(`CHECK s24 labels ${az}: data ${q.ur}, ${q.ut}`); });
CHECK_C.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

// ---------------------------------------------------------------- the Ian map frames (s21-s25)
const MB = { x: 80, y: 40, w: 1100, h: 740 };
const FULL: MapBox = boxAt(26.6, -82.3, 3.5, MB.x, MB.y, MB.w, MB.h);
const ZOOM: MapBox = boxAt(IAN.c[0], IAN.c[1], 1.08, MB.x, MB.y, MB.w, MB.h);
const CX = 1230;   // the text column
// feedback 2026-11-06 (R7): the eight-point picture of s24 (every 45°): the map zoomed so the 25-km ring is ≈ 230 px, arrows S8 px per m/s
const Z8: MapBox = boxAt(IAN.c[0], IAN.c[1], 0.72, MB.x, MB.y, MB.w, MB.h);
const S8 = 2.4;
/** drawn u_r length on the eight-point map (px): true scale, at least 34 px so a small value is not hidden under its 11-px dot */
const L8 = (ur: number) => Math.sign(ur) * Math.max(Math.abs(ur) * S8, 34);
const AZ8 = [0, 45, 90, 135, 180, 225, 270, 315];
/** the on-map value labels of the eight points: the library values to 0.1 (135°: 38.6, the value worked by hand from 7.14 + 31.46) */
const LAB8: Record<number, [string, string]> = { 0: ["-8.7", "38.0"], 45: ["-16.1", "29.5"], 90: ["-37.4", "16.9"], 135: ["-24.3", "38.6"], 180: ["-1.9", "45.6"],
  225: ["+13.5", "43.7"], 270: ["-11.2", "24.5"], 315: ["-23.2", "34.6"] };
// fix 1 after fb1 (review 1 S1 / review 2 Should 2): half the last digit (0.05) everywhere, except the hand-worked 135° u_θ (38.6 from
// 7.14 + 31.46; library 38.65), checked at 0.06 as in the builder row DF24
AZ8.forEach((az) => { const d = IAN.pts8[String(az)], [a, b] = LAB8[az], tb = az === 135 ? 0.06 : 0.05;
  if (Math.abs(d.ur - parseFloat(a)) > 0.05 + 1e-9 || Math.abs(d.ut - parseFloat(b)) > tb + 1e-9) throw new Error(`CHECK s24 eight points ${az}: data ${d.ur}, ${d.ut} vs ${a}, ${b}`); });
if (AZ8.filter((az) => IAN.pts8[String(az)].ur < 0).length !== 7 || IAN.pts8["225"].ur <= 0) throw new Error("CHECK s24: 'in at 7 of 8, out at 225°'");
// R8: the first terms of the two ring sums as written and spoken (θ = 0°, 5°, 10°)
[[IAN.ring.vr, [-8.7, -10.3, -11.2]], [IAN.ring.vt, [38.0, 37.8, 38.3]]].forEach(([d, r]) => (r as number[]).forEach((v, i) => {
  if (Math.abs((d as number[])[i] - v) > 0.05) throw new Error(`CHECK s22 first terms: ${(d as number[])[i]} vs ${v}`); }));
const RI = (i: number) => i;                   // ring index = azimuth / 5°
const iAz = (az: number) => RI(Math.round(az / 5));

// ================================================================ s21 Ian in polar coordinates (zoom tour)
const S21: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21_ian_polar");
  const tCol = SS(k, 2), tU = AT(k, 3, "eastward part u"), tV = AT(k, 3, "northward part v"), tEye = AT(k, 4, "the eye"), tZ = AT(k, 5, "zoom in"), tGulf = AT(k, 6, "Gulf of Mexico"),
    tLand = AT(k, 6, "southwest Florida"), tStr = SS(k, 7), tPol = SS(k, 8), tR = AT(k, 8, "distance r"), tTh = AT(k, 8, "angle theta");
  const z = prog(f, tZ, tZ + 45);
  const B = zoomBox(FULL, ZOOM, z);
  const P = mapP(B);
  const cE = P(IAN.c[0], IAN.c[1]);
  const j = iAz(270), q0 = P(RING.lat[j], RING.lon[j]), su = 5;
  const uEnd: Pt = [q0[0] + RING.u[j] * su, q0[1]], vEnd: Pt = [uEnd[0], uEnd[1] - RING.v[j] * su];
  const uvO = win(f, tU, tZ - 4, 12);
  const pk = 10 * kmPx(B, 1);
  const pol = fin(f, tPol, 20);
  const pt = P(RING.lat[iAz(60)], RING.lon[iAz(60)]);
  return (
    <Scene>
      <GeoMap id="s21m" B={B} fade={z}>
        {(Pm) => <>
          <IanBody P={Pm} f={f} z={z} />
          <circle cx={cE[0]} cy={cE[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={fin(f, tZ)} />
          <g opacity={pol}>
            {[1, 2, 3, 4].map((r) => <circle key={r} cx={cE[0]} cy={cE[1]} r={r * pk} fill="none" stroke={C.local} strokeWidth={2.5} opacity={0.8} />)}
            {Array.from({ length: 12 }, (_, i) => i * 30).map((a) => <line key={a} x1={cE[0]} y1={cE[1]} x2={cE[0] + 4.3 * pk * Math.cos(a * D2R)} y2={cE[1] - 4.3 * pk * Math.sin(a * D2R)} stroke={C.local} strokeWidth={2} opacity={0.6} />)}
            <line x1={cE[0]} y1={cE[1]} x2={pt[0]} y2={pt[1]} stroke={C.ink} strokeWidth={7} opacity={fin(f, tR)} />
            <path d={arcD(cE, 45, 0, 60)} fill="none" stroke={C.local} strokeWidth={6} opacity={fin(f, tTh)} />
            <circle cx={pt[0]} cy={pt[1]} r={10} fill={C.key} stroke={C.bg} strokeWidth={3} opacity={fin(f, tR)} />
          </g>
          <Place p={Pm(26.25, -83.0)} t="Gulf of Mexico" r={0} dx={0} dy={0} a="middle" italic o={fin(f, tGulf) * z} />
          <Place p={[MB.x + MB.w - 144, Pm(26.95, -81.7)[1]]} t="southwest Florida" r={0} dx={0} dy={0} a="end" o={fin(f, tLand) * z * fout(f, tPol)} />
        </>}
      </GeoMap>
      <Svg>
        <g opacity={uvO}>
          <AnimatedWindArrow from={q0} to={vEnd} speed={Math.hypot(RING.u[j], RING.v[j])} f={f} c={C.ink} px={8} head={26} />
          <line x1={q0[0]} y1={q0[1]} x2={uEnd[0]} y2={uEnd[1]} stroke={C.second} strokeWidth={6} />
          <line x1={uEnd[0]} y1={uEnd[1]} x2={vEnd[0]} y2={vEnd[1]} stroke={C.second} strokeWidth={6} strokeDasharray="12 8" opacity={fin(f, tV)} />
        </g>
        <SpeedBar x={CX} y={110} w={300} />
        <Keyword f={f} text="a real storm" at={[CX, 260]} appear={0} out={tEye - 18} />
        <Keyword f={f} text="the eye" at={[CX, 260]} appear={tEye} out={tStr - 18} />
        <Keyword f={f} text="strongest winds" at={[CX, 260]} appear={tStr} out={tPol - 18} />
        <SideCallout f={f} lines="≈ 25 km out" at={[CX, 340]} appear={tStr + 10} out={tPol - 18} target={z > 0.9 ? [cE[0] + kmPx(B, 25) * Math.cos(-20 * D2R), cE[1] - kmPx(B, 25) * Math.sin(-20 * D2R)] : null} s={T.floor} bend={20} />
        <Lbl x={CX} y={460} t="u: east part · v: north part" c={C.second} s={T.floor} o={win(f, tU, tPol - 18)} />
        {/* fix 2 (fix1 review 2 Should 12): what the colours are, as short labels on their words */}
        <Lbl x={CX} y={340} t="10 m above the ground" c={C.key} s={T.floor} o={win(f, AT(k, 2, "ten metres above the ground"), tStr - 18)} />
        <Lbl x={CX} y={400} t="3-km grid" c={C.key} s={T.floor} o={win(f, AT(k, 2, "every three kilometres"), tStr - 18)} />
      </Svg>
      <TeX s="u" x={(q0[0] + uEnd[0]) / 2} y={q0[1] + 34} size={52} ax={0.5} c={C.second} o={uvO} />
      <TeX s="v" x={uEnd[0] + 16} y={(uEnd[1] + vEnd[1]) / 2} size={52} c={C.second} o={uvO * fin(f, tV)} />
      <TeX s={EQ_S21} x={CX} y={300} size={84} o={fin(f, tPol)} />
      <TeX s={String.raw`r:\ \text{from the centre}`} x={CX} y={420} size={50} c={C.ink} o={fin(f, tR)} />
      <TeX s={String.raw`\theta:\ \text{from east}`} x={CX} y={500} size={50} c={C.local} o={fin(f, tTh)} />
      <SourceBelow text={IAN_SRC} pic={MB} w={1100} name="s21 src" />
    </Scene>
  );
};

// ================================================================ s22 ring means: 35 round, −13 in
const S22: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22_spin_inflow");
  const tR = SS(k, 1), tT = SS(k, 2), tRing = AT(k, 3, "twenty five kilometres"), t72 = AT(k, 3, "seventy two points"), tAvg = SS(k, 4), tVt = SS(k, 5), tConv = SS(k, 6),
    tKmh = SS(k, 7), tAnti = SS(k, 8), tVr = SS(k, 9), tIn = SS(k, 10), tReal = SS(k, 11), tBest = SS(k, 12), tKt = SS(k, 13), tSm = SS(k, 14);
  const P = mapP(ZOOM);
  const cE = P(IAN.c[0], IAN.c[1]);
  const i0 = iAz(315);
  const one = ringArrows(P, i0, 4);
  const mean = ringArrows(P, i0, 7, IAN.vt, IAN.vr);
  const ringDraw = prog(f, tRing, tRing + 30);
  const Rpx = kmPx(ZOOM, 25);
  const dots = Math.round(72 * prog(f, t72, t72 + 30));
  // fix 2 (review 2 Must 4/5): the anticlockwise labels and the ū_r division leave 12 frames before the knots chain starts in their place
  const blk = fout(f, tBest - 24, 12);
  // fix 1 after fb1 (review 2 Must 1/2; "show it, don't voice it"): each running sum starts as the sentence starts and reaches 72 of 72
  // exactly on the spoken total ("two thousand five hundred", "minus nine hundred"); the total then holds until the fraction replaces it
  const tAddT = SS(k, 5), tSumT = AT(k, 5, "two thousand five hundred"), tDivT = AT(k, 5, "So their average"), t35c = AT(k, 5, "or about thirty five"),
    tAddR = AT(k, 9, "at theta equals zero"), tSumR = AT(k, 9, "minus nine hundred"), tDivR = AT(k, 9, "So their average"),
    t13c = AT(k, 9, "or about minus thirteen"), t69 = AT(k, 13, "sixty nine"), t49 = AT(k, 14, "forty nine"), tSmW = AT(k, 14, "The model analysis");
  // fix 2 (fix1 review 2 Should 2): the conversion constants on their words, gold (non-obvious inputs, user 2026-11-07)
  const tMul = AT(k, 6, "we multiply by"), t36 = AT(k, 6, "three point six"), t3600 = AT(k, 6, "three thousand six hundred"), t1000 = AT(k, 6, "a thousand metres"),
    t126 = AT(k, 7, "a hundred and twenty six"), t185 = AT(k, 13, "one point eight five"), t250 = AT(k, 13, "two hundred and fifty");
  // feedback 2026-11-06 (R8): the averaging rule in symbols, N = 72, the first terms of each sum
  const tSym = AT(k, 4, "In symbols"), tN = AT(k, 4, "Here N is"), tThS = AT(k, 4, "The average tangential wind"),
    // the voice names the first term (−8.7 at θ = 0); −10.3, −11.2 and "…" follow on screen, half a second apart
    tFirst = [0, 15, 30, 45].map((d) => AT(k, 9, "minus eight point seven") + d);
  const nFirst = tFirst.filter((t) => f >= t).length;
  const FIRST_R = ["-8.7", "-10.3", "-11.2", String.raw`-\dots`];
  const numR = FIRST_R.map((q, i) => (i < nFirst ? q : String.raw`\phantom{${q}}`)).join("");
  // the running sums (fix 1c C32): the 72 values added in turn while their dots light
  const nT = Math.min(72, Math.round(72 * prog(f, tAddT, tSumT))), nR = Math.min(72, Math.round(72 * prog(f, Math.max(tAddR, tFirst[3]), tSumR)));
  const sumT = (RING.vt as number[]).slice(0, nT).reduce((a2, b2) => a2 + b2, 0), sumR = (RING.vr as number[]).slice(0, nR).reduce((a2, b2) => a2 + b2, 0);
  const runI = f < tVr ? nT : nR, runOn = win(f, tAddT, tDivT, 6) + win(f, Math.max(tAddR, tFirst[3]), tDivR, 6);
  return (
    <Scene>
      <GeoMap id="s22m" B={ZOOM} fade={1}>
        {(Pm) => <>
          <IanBody P={Pm} f={f} z={1} />
          <circle cx={cE[0]} cy={cE[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
          <path d={ringPath(Pm)} fill="none" stroke={C.first} strokeWidth={6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ringDraw} />
          {Array.from({ length: dots }, (_, i) => { const q = Pm(RING.lat[i], RING.lon[i]); return <circle key={i} cx={q[0]} cy={q[1]} r={5} fill={C.key} opacity={0.85} />; })}
          {runOn > 0 ? Array.from({ length: runI }, (_, i) => { const q = Pm(RING.lat[i], RING.lon[i]); return <circle key={`g${i}`} cx={q[0]} cy={q[1]} r={7} fill={C.gold} opacity={runOn} />; }) : null}
        </>}
      </GeoMap>
      <Svg>
        <line x1={cE[0]} y1={cE[1]} x2={cE[0] - Rpx} y2={cE[1]} stroke={C.ink} strokeWidth={4} opacity={fin(f, tRing) * fout(f, tVt - 10)} />
        <Lbl x={cE[0] - Rpx / 2} y={cE[1] + 34} t="25 km" c={C.key} s={T.floor} a="middle" o={fin(f, tRing) * fout(f, tVt - 10)} />
        <g opacity={win(f, tR, tVt - 12)}>
          <AnimatedWindArrow from={one.p0} to={one.rp} speed={Math.abs(RING.vr[i0])} f={f} c={C.neg} px={9} head={30} />
          <g opacity={fin(f, tT)}><AnimatedWindArrow from={one.p0} to={one.tp} speed={RING.vt[i0]} f={f} c={C.first} px={9} head={30} /></g>
        </g>
        <g opacity={fin(f, tDivT)}>
          <AnimatedWindArrow from={mean.p0} to={mean.tp} speed={IAN.vt} f={f} c={C.first} px={10} head={36} />
          <g opacity={fin(f, tDivR)}><AnimatedWindArrow from={mean.p0} to={mean.rp} speed={Math.abs(IAN.vr)} f={f} c={C.neg} px={10} head={36} /></g>
        </g>
        <path d={arcD(cE, Rpx * 1.5, 200, 290)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tAnti)} />
        <ArcHead c={cE} r={Rpx * 1.5} a={290} dir={1} col={C.gold} o={fin(f, tAnti)} />
        <SpeedBar x={CX} y={110} w={300} />
        <Keyword f={f} text="two polar parts" at={[CX, 260]} appear={0} out={tAvg - 18} />
        {/* fix 3 (review 3 Must 5): no `out`: "our thirty five" in S15 has its 35 on screen beside 69 and 49 */}
        <SideCallout f={f} lines="≈ 35 m/s" at={[CX + 20, 340]} appear={t35c} target={[(mean.p0[0] + mean.tp[0]) / 2, (mean.p0[1] + mean.tp[1]) / 2 - 8]} c={C.first} bend={-20} />
        <Lbl x={CX} y={520} t="anticlockwise," c={C.key} s={T.floor} o={fin(f, tAnti) * blk} />
        <Lbl x={CX} y={584} t="seen from above, NH" c={C.key} s={T.floor} o={fin(f, tAnti) * blk} />
        {/* fix 2 (review 2 Must 4/5): the ū_r result row (y 780) stays to the end below the knots chain, linked to the rose mean arrow;
            "in: towards the eye" under it. The old "−13 m/s: in" callout split the knots chain and is gone. */}
        <CurvedLink f={f} from={[CX - 14, 780]} to={[(mean.p0[0] + mean.rp[0]) / 2 - 4, (mean.p0[1] + mean.rp[1]) / 2 + 8]} start={t13c + 6} ctl={[mean.p0[0] - 40, mean.p0[1] + 170]} />
        <Lbl x={CX} y={836} t="in: towards the eye" c={C.neg} s={T.floor} o={fin(f, tIn)} />
        {/* R8: the first three ring points of the u_r sum ringed in gold as their values are said (θ = 0°, 5°, 10°) */}
        {[0, 1, 2].map((i) => { const q = P(RING.lat[i], RING.lon[i]); const o = win(f, tFirst[i], tDivR, 8);
          return o > 0 ? <circle key={`ft${i}`} cx={q[0]} cy={q[1]} r={13} fill="none" stroke={C.gold} strokeWidth={5} opacity={o} /> : null; })}
        {/* the knots chain, top-down in spoken order: 135 kt → × 1.85 ≈ 250 km/h → ÷ 3.6 ≈ 69 m/s → ring max ≈ 49 m/s */}
        <Lbl x={CX} y={500} t="official estimate: 135 kt" c={C.local} s={T.floor} o={fin(f, tBest)} />
        <Keyword f={f} text="analysis smooths the peak" at={[CX, 420]} s={T.floor} appear={tSmW} />
        {/* fix 2 (review 2 Must 4): each running sum on two lines, inside x ≤ 1842 */}
        <Lbl x={CX} y={465} t={`${nT < 72 ? "sum so far" : "sum"}: ${nf(sumT, 1)} m/s`} c={C.gold} s={T.floor} o={win(f, tAddT, tDivT - 17)} />
        <Lbl x={CX} y={520} t={`${nT} of 72 points`} c={C.gold} s={T.floor} o={win(f, tAddT, tDivT - 17)} />
        <Lbl x={CX} y={765} t={`${nR < 72 ? "sum so far" : "sum"}: ${nf(sumR, 1)} m/s`} c={C.gold} s={T.floor} o={win(f, Math.max(tAddR, tFirst[3]), tDivR - 17)} />
        <Lbl x={CX} y={820} t={`${nR} of 72 points`} c={C.gold} s={T.floor} o={win(f, Math.max(tAddR, tFirst[3]), tDivR - 17)} />
      </Svg>
      {/* fix 1 Must 2: the tags sit beside the middle of their own arrow, on the side away from the other arrow and the coast */}
      <TeX s={String.raw`\boldsymbol{u_r}`} x={(one.p0[0] + one.rp[0]) / 2 - 42} y={(one.p0[1] + one.rp[1]) / 2 + 42} size={56} ax={0.5} c={C.neg} halo haloW={0.11} o={win(f, tR, tVt - 12)} />
      <TeX s={String.raw`\boldsymbol{u_\theta}`} x={(one.p0[0] + one.tp[0]) / 2 + 46} y={(one.p0[1] + one.tp[1]) / 2 + 46} size={56} ax={0.5} c={C.first} halo haloW={0.11} o={win(f, tT, tVt - 12)} />
      <TeX s={EQ_S22} x={CX} y={300} size={44} o={win(f, tAvg, tSym - 18, 8)} />
      <TeX s={String.raw`360^\circ\div5^\circ=72\ \text{points}`} x={CX} y={410} size={46} o={win(f, t72, tN - 20, 8)} />
      <TeX s={String.raw`N=360^\circ\div5^\circ=72\ \text{points}`} x={CX} y={410} size={46} c={C.gold} o={win(f, tN, tDivT - 20)} />
      {/* R8: the averaging rule in symbols (u_r first, as spoken), then u_θ "made in the same way" */}
      <TeX s={String.raw`\overline{u_r}=\dfrac{1}{N}\sum_{i=1}^{N}u_{r,i}`} x={CX} y={300} size={50} c={C.neg} o={win(f, tSym, tVt - 22)} />
      <TeX s={String.raw`\overline{u_\theta}=\dfrac{1}{N}\sum_{i=1}^{N}u_{\theta,i}`} x={CX} y={540} size={50} c={C.first} o={win(f, tThS, tVt - 22)} />
      {/* R8: the first terms of the u_θ sum (data ring θ = 0°, 5°, 10°); the running sum and the division follow below */}
      <TeX s={String.raw`\overline{u_\theta}=\dfrac{38.0+37.8+38.3+\dots}{72}`} x={CX} y={320} size={44} o={win(f, tVt, t35c - 14)} />
      {/* R8: the first terms of the u_r sum, each on its spoken words; the first is the θ = 0° point worked by hand in s24 */}
      <TeX s={String.raw`\overline{u_r}=\dfrac{${numR}}{72}`} x={CX} y={685} size={44} o={win(f, tFirst[0], tDivR - 8)} />
      {/* K6 after fix 1c: each mean on two lines (they ran to x 1878): the division, then its value under the "=" */}
      <TeX s={String.raw`\overline{u_\theta}=\dfrac{2505.9\ \mathrm{m/s}}{72}`} x={CX} y={470} size={44} o={win(f, tDivT, tConv + 20)} />
      <TeX s={String.raw`\approx34.8\approx35\ \mathrm{m/s}`} x={CX + 52} y={560} size={44} o={win(f, tDivT + 20, tConv + 20)} />
      {/* fix 2 (review 2 Must 4): ū_r has its own slot (fraction top ≥ 24 px under "seen from above, NH"), stays through S10-S11; its
          result row is self-contained and stays to the end of the scene */}
      <TeX s={String.raw`\overline{u_r}=\dfrac{-957.2\ \mathrm{m/s}}{72}`} x={CX} y={688} size={44} o={win(f, tDivR, tBest - 24, 12)} />
      <TeX s={String.raw`\overline{u_r}\approx-13.3\approx-13\ \mathrm{m/s}`} x={CX} y={780} size={44} c={C.neg} o={fin(f, AT(k, 9, "about minus thirteen point three"))} />
      {/* fix 2 (fix1 review 2 Should 2): the knots chain reads top-down: "official estimate: 135 kt" / "× 1.85 km/h per kt" (1.85 gold on
          its word) / "≈ 250 km/h" on "two hundred and fifty", then "÷ 3.6 ≈ 69 m/s" on "sixty nine" (the 250 row grows to the right) */}
      <TeX s={String.raw`\approx250\ \mathrm{km/h}${tailIn(f, t69, C.local, "\\div3.6\\approx69\\ \\mathrm{m/s}")}`} x={CX} y={630} size={46} c={C.local} o={fin(f, t250)} />
      <TeX s={String.raw`\text{strongest on our ring}\approx49\ \mathrm{m/s}`} x={CX} y={695} size={46} o={fin(f, t49)} />
      {/* fix 2 (fix1 review 2 Should 2): "35 m/s × 3.6" at the sentence start, "= 126 km/h" on "a hundred and twenty six" (the full row
          fades in over the left part, which is the same string's prefix) */}
      <TeX s={String.raw`35\ \mathrm{m/s}\times3.6${tailIn(f, t126, C.ink, "=126\\ \\mathrm{km/h}")}`} x={CX} y={420} size={52} o={fin(f, tKmh) * fout(f, tSm - 22)} />
      {/* fix 2 (fix1 review 2 Should 2): the conversion is built as it is said: "m/s × 3.6 → km/h" on "we multiply by" (3.6 gold on
          "three point six"), then "1 m/s = 3600 m/h" on "three thousand six hundred" and "= 3.6 km/h" on "a thousand metres" */}
      <TeX s={String.raw`\mathrm{m/s}\times${goldAt(f, t36, "3.6")}\ \to\ \mathrm{km/h}`} x={CX} y={420} size={hiSz(f, [t36], 48)} c={C.local} o={fin(f, tMul) * fout(f, tKmh - 20)} />
      <TeX s={String.raw`1\ \mathrm{m/s}=3600\ \mathrm{m/h}${tailIn(f, t1000, C.muted, "=3.6\\ \\mathrm{km/h}")}`} x={CX} y={500} size={44} c={C.muted} o={fin(f, t3600) * fout(f, tAnti - 20)} />
      <TeX s={String.raw`\times${goldAt(f, t185, "1.85")}\ \mathrm{km/h\ per\ kt}`} x={CX} y={565} size={hiSz(f, [t185], 44)} c={C.local} o={fin(f, tKt)} />
      <SourceBelow text={IAN_SRC} pic={MB} w={1100} name="s22 src" />
      {void [tReal]}
    </Scene>
  );
};

// ================================================================ s23 what 35 and 13 mean (D10)
const S23: React.FC = () => {
  const f = useCurrentFrame(), k = K("s23_what_numbers_mean");
  const t35 = SS(k, 1), t13 = SS(k, 2), tRA = SS(k, 3), tPy = SS(k, 4), tMost = SS(k, 5), tKmh = SS(k, 6), tImg = SS(k, 7), tPar = SS(k, 8), tT = SS(k, 9), tLap = SS(k, 10),
    tBoth = SS(k, 11), tRat = SS(k, 12), tSp = SS(k, 13), tRise = SS(k, 14), tMore = SS(k, 15);
  // fix 1 after fb1 ("show it, don't voice it"): the squares are on screen only; the voice says "By Pythagoras, together they make an
  // arrow of about thirty seven", so the rows land on "together", "an arrow" and "thirty seven"
  const tRoot = AT(k, 4, "By Pythagoras"), t37 = AT(k, 4, "thirty seven"), tSq = AT(k, 4, "add them"), tRt = Math.max(tSq + 12, AT(k, 4, "take the square root"));
  // review 2 Must 3: the clock holds 0 min, then 32 min, and sweeps only on "thirty two minutes" / "seventy five minutes"
  const t32 = AT(k, 9, "thirty two minutes"), t75 = AT(k, 10, "seventy five minutes");
  const PB = { x: 80, y: 40, w: 900, h: 740 };
  const B = boxAt(IAN.c[0], IAN.c[1], 0.555, PB.x, PB.y, PB.w, PB.h);
  const P = mapP(B);
  const cE = P(IAN.c[0], IAN.c[1]);
  const R = kmPx(B, 25);
  const a0 = -50;                                     // the ring point drawn (screen angle, maths sense)
  const pr: Pt = [cE[0] + R * Math.cos(a0 * D2R), cE[1] - R * Math.sin(a0 * D2R)];
  const er: Pt = [Math.cos(a0 * D2R), -Math.sin(a0 * D2R)], et = rotS(er, 90);
  const s = 6;
  const tip: Pt = [pr[0] + et[0] * 35 * s - er[0] * 13 * s, pr[1] + et[1] * 35 * s - er[1] * 13 * s];
  const lapO = fin(f, tLap);
  // fix 2 (fix1 review 2 Should 1): the lap is its own "imagine" case, so the clock goes back to 0 on "one lap" and sweeps 0 -> 75 min
  const tLapW = AT(k, 10, "one lap");
  const minNow = f < t32 ? 0 : f < tLapW ? 32 * prog(f, t32, t32 + 18) : f < t75 ? 0 : 75 * prog(f, t75, t75 + 18);
  // fix 2 (fix1 review 2 Should 3): inputs before results; the 3.6 gold on its word (S7 re-voiced: "Converted with the same factor of
  // three point six, the inflow is about forty seven kilometres per hour")
  const tCv = AT(k, 6, "Converted"), t36 = AT(k, 6, "three point six"), t47 = AT(k, 6, "forty seven"), tTd = AT(k, 9, "Time is distance"),
    tTk = AT(k, 9, "so that takes"), tLt = AT(k, 10, "That takes");
  // the spiral segment (constant inflow angle ≈ 21°): r = R exp(−tan(21°) φ) for a quarter turn
  const sp = prog(f, tSp, tSp + 40), spiral: Pt[] = [];
  for (let i = 0; i <= 40 * sp; i++) { const ph = (i / 40) * (Math.PI / 2), rr = R * Math.exp(-Math.tan(SAY.angle * D2R) * ph); spiral.push([cE[0] + rr * Math.cos(a0 * D2R + ph), cE[1] - rr * Math.sin(a0 * D2R + ph)]); }
  const par = fin(f, tPar);
  return (
    <Scene>
      <Svg>
        <circle cx={cE[0]} cy={cE[1]} r={R} fill="none" stroke={C.first} strokeWidth={6 + 6 * lapO * pulse(f, tLap, 40)} />
        <circle cx={cE[0]} cy={cE[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        {/* fix 1c C36: one lap, swept round the ring */}
        <g opacity={win(f, AT(k, 10, "one lap"), tBoth)}>
          <path d={arcD(cE, R, a0, a0 + 359.9 * prog(f, AT(k, 10, "one lap"), AT(k, 10, "one lap") + 60))} fill="none" stroke={C.gold} strokeWidth={9} />
          <Lbl x={cE[0]} y={cE[1] - R - 34} t="157 km" c={C.gold} s={T.floor} a="middle" o={fin(f, AT(k, 10, "a hundred and fifty seven"))} />
        </g>
        <g opacity={fin(f, t35) * fout(f, tImg - 12)}>
          <Arrow p={pr} q={tip} color={C.ink} o={fin(f, AT(k, 4, "an arrow"))} w={6} head={30} dash="14 8" />
          <Arrow p={pr} q={[pr[0] + et[0] * 35 * s, pr[1] + et[1] * 35 * s]} color={C.first} />
          <g opacity={fin(f, t13)}><Arrow p={pr} q={[pr[0] - er[0] * 13 * s, pr[1] - er[1] * 13 * s]} color={C.neg} /></g>
          <RightTick at={pr} u1={et} u2={[-er[0], -er[1]]} c={C.gold} o={fin(f, tRA)} />
        </g>
        <Lbl x={pr[0] + et[0] * 35 * s + 20} y={pr[1] + et[1] * 35 * s - 30} t="35 round" c={C.first} s={T.floor} o={fin(f, t35) * fout(f, tImg - 12)} />
        <Lbl x={pr[0] - er[0] * 13 * s - 30} y={pr[1] - er[1] * 13 * s + 40} t="13 in" c={C.neg} s={T.floor} a="end" o={fin(f, t13) * fout(f, tImg - 12)} />
        <Lbl x={tip[0] + 16} y={tip[1] - 34} t="≈ 37 m/s" c={C.key} s={T.floor} o={fin(f, t37) * fout(f, tImg - 12)} />
        <g opacity={par}>
          <line x1={pr[0]} y1={pr[1]} x2={cE[0]} y2={cE[1]} stroke={C.neg} strokeWidth={4} strokeDasharray="12 8" opacity={fout(f, tSp)} />
          <circle cx={pr[0]} cy={pr[1]} r={15} fill={C.first} stroke={C.bg} strokeWidth={4} />
        </g>
        <Lbl x={(pr[0] + cE[0]) / 2 + 30} y={(pr[1] + cE[1]) / 2 + 30} t="25 km" c={C.neg} s={T.floor} o={par * fout(f, tSp)} />
        <g opacity={win(f, tRat, tSp - 4)}>
          <Arrow p={pr} q={[pr[0] + et[0] * 2.7 * 50, pr[1] + et[1] * 2.7 * 50]} color={C.first} w={8} head={28} />
          <Arrow p={pr} q={[pr[0] - er[0] * 50, pr[1] - er[1] * 50]} color={C.neg} w={8} head={24} />
        </g>
        <path d={poly(spiral)} fill="none" stroke={C.gold} strokeWidth={7} opacity={spiral.length > 1 ? 1 : 0} />
        {/* fix 2 (review 2 Should 12): rising air on a plan view is a ⊙ (towards the viewer), not an arrow up the screen (= north) */}
        <g opacity={fin(f, tRise)}>
          <circle cx={cE[0] + R * 0.95} cy={cE[1] + R * 0.4} r={30} fill={C.bg} stroke={C.key} strokeWidth={6} />
          <circle cx={cE[0] + R * 0.95} cy={cE[1] + R * 0.4} r={9} fill={C.key} />
          <Lbl x={cE[0] + R * 0.95 + 48} y={cE[1] + R * 0.4} t="rising" c={C.key} s={T.floor} />
          <Lbl x={cE[0] + R * 0.95 + 48} y={cE[1] + R * 0.4 + 50} t="(out of the screen)" c={C.muted} s={T.floor} />
        </g>
        <Keyword f={f} text="what do they mean?" at={[1080, 110]} appear={0} out={tRoot - 4} />
        <Keyword f={f} text="imagine: nothing changes" at={[1080, 110]} c={C.local} appear={tImg} out={tSp - 18} />
        <Keyword f={f} text="spirals in" at={[1080, 110]} appear={tSp} out={tMore - 18} />
        <Keyword f={f} text="rises (Part 2)" at={[1080, 720]} s={T.floor} appear={tRise} />
        <Keyword f={f} text="more: How tropical cyclones form" at={[1080, 800]} s={T.floor} appear={tMore} />
        {/* fix 2 (K6 k6z2): under the stack (y 845), so a row entering at the stack foot (top ≤ 686, ink ≤ 800) never meets it */}
        <ClockText x={1110} y={845} t={`${Math.round(minNow)} min`} min={minNow} o={win(f, tT, tRat - 18)} />
      </Svg>
      {/* fix 1c C34-C37: squares, unit changes, divisions by 60 and why a speed ratio is a distance ratio, one move per line */}
      {/* fix 3 (review 3 Must 3): the column leaves at tRise − 10, so the ⊙ label never reads into "= 35/13 ≈ 2.7" */}
      {/* fix 2 (fix1 review 1 Should 2): exitFirst - outgoing rows fade before the stack slides, never over the keyword at y 110 */}
      <CalcStack f={f} x={1260} y={190} size={52} maxLines={2} o={fout(f, tRise - 12, 10)} rows={exitFirst([
        // fix 2 (fix1 review 2 Should 11): the result row has its name
        { lhs: String.raw`\text{wind speed}`, rhs: `=${cutAt(EQ_S23, String.raw`\approx`)[0]}`, at: tRoot, h: 90 },
        { rhs: String.raw`=\sqrt{1225+169}`, at: tSq, cont: true },
        { rhs: String.raw`=\sqrt{1394}\approx37.3`, at: tRt, cont: true },
        { rhs: String.raw`\approx${cutAt(EQ_S23, String.raw`\approx`)[1]}`, at: t37, cont: true },
        { lhs: String.raw`13\ \mathrm{m/s}\times${goldAt(f, t36, "3.6")}`, rhs: String.raw`\phantom{\approx}`, at: tCv, h: 74 },
        { rhs: String.raw`\approx47\ \mathrm{km/h}`, at: t47, cont: true },
        { lhs: String.raw`25\ \mathrm{km}`, rhs: String.raw`=25\,000\ \mathrm{m}`, at: AT(k, 9, "twenty five kilometres") },
        { lhs: "t", rhs: String.raw`=\text{distance}\div\text{speed}`, at: tTd },
        { rhs: String.raw`=\dfrac{25\,000\ \mathrm{m}}{13\ \mathrm{m/s}}`, at: tTk, cont: true, h: 120 },
        { rhs: String.raw`\approx1923\ \mathrm{s}`, at: AT(k, 9, "nineteen hundred and twenty three"), cont: true, h: 74 },
        { rhs: String.raw`\approx1923\div60\approx32\ \mathrm{min}`, at: AT(k, 9, "thirty two minutes"), cont: true, h: 80 },
        { lhs: String.raw`2\pi\times25\ \mathrm{km}`, rhs: String.raw`=2\times3.1416\times25`, at: AT(k, 10, "two pi times") },
        { rhs: String.raw`\approx157\ \mathrm{km}=157\,000\ \mathrm{m}`, at: AT(k, 10, "a hundred and fifty seven"), cont: true },
        { lhs: "t", rhs: String.raw`=\dfrac{157\,000\ \mathrm{m}}{35\ \mathrm{m/s}}`, at: tLt, h: 120 },
        { rhs: String.raw`\approx4490\ \mathrm{s}`, at: AT(k, 10, "four thousand four hundred"), cont: true, h: 74 },
        { rhs: String.raw`\approx4490\div60\approx75\ \mathrm{min}`, at: AT(k, 10, "seventy five minutes"), cont: true, h: 80 },
        { lhs: String.raw`\dfrac{\text{distance round}}{\text{distance in}}`, rhs: String.raw`=\dfrac{35\,t}{13\,t}`, at: AT(k, 12, "In any stretch"), h: 120 },
        { rhs: String.raw`=\dfrac{35}{13}\approx2.7`, at: AT(k, 12, "two point seven"), cont: true, h: 110 },
      ], 2)} />
      <TeX s={String.raw`\text{almost 3 m round per 1 m in}`} x={1080} y={720} size={46} o={win(f, AT(k, 12, "almost three"), tRise - 18)} />
      <SourceBelow text={IAN_SRC} pic={PB} w={900} name="s23 src" />
      {void [tMost, tKmh, tBoth, tPy]}
    </Scene>
  );
};

// ================================================================ s24 three ring points by hand (D11)
/** label centres (fix 1 Must 2), from the review-1 frames (ring 25 km ≈ 155 px round the eye; Florida's coast lies east of x ≈ 740
 * above the eye and east of x ≈ 790 at its height): 0° both inside the ring between the eye and the arrows; 90° u_θ left of its arrow tip,
 * u_r just beyond its tip below the eye; 135° u_r outward (up-left), u_θ beyond its tip (down-left); all in open water. */
const lab24 = (az: number, cE: Pt, q: Pt): { ur: Pt; ut: Pt } => {
  void q;
  if (az === 0) return { ur: [cE[0] + 10, cE[1] + 62], ut: [cE[0] + 2, cE[1] - 80] };
  if (az === 90) return { ur: [cE[0], cE[1] + 62], ut: [cE[0] - 202, cE[1] - 165] };
  return { ur: [cE[0] - 200, cE[1] - 195], ut: [cE[0] - 318, cE[1] + 100] };
};
const S24: React.FC = () => {
  const f = useCurrentFrame(), k = K("s24_ring_points");
  const tRem = SS(k, 4), tA = SS(k, 5), tAuv = SS(k, 6), tAcs = SS(k, 7), tAr = SS(k, 8), tAt = SS(k, 9), tB = SS(k, 11), tBuv = SS(k, 12), tBcs = SS(k, 13), tBr = SS(k, 14), tBt = SS(k, 15),
    tC = SS(k, 16), tCuv = SS(k, 17), tCcs = SS(k, 18), tCr = SS(k, 19), tCr2 = AT(k, 20, "minus twenty four"), tCt = SS(k, 21), tCt2 = AT(k, 22, "thirty eight point six"), tAll = SS(k, 23);
  // fix 1 after fb1 ("show it, don't voice it"; review 2 Should 7): the voice names each term ("u times the cosine, plus v times the
  // sine") and the result; each written term lands on its words, the products in between come one by one before the result
  const tCr1b = AT(k, 19, "plus v times the sine"), tCt1b = AT(k, 21, "plus v times the cosine"), tB16 = AT(k, 15, "plus sixteen point nine");
  const pC = [Math.max(tCr1b + 18, SS(k, 20) - 14)], pT = [tCt1b + 18];
  pC.push(Math.max(pC[0] + 12, SS(k, 20) + 6)); pT.push(Math.max(pT[0] + 12, SE(k, 21) - 4)); pT.push(Math.max(pT[1] + 12, SS(k, 22) + 4));
  // feedback 2026-11-06 (R7, scope 2026-11-07): after the three worked points (unchanged), five more points without the
  // arithmetic and all eight u_r / u_θ arrows with their values (re-voiced S24); the map zooms in (ring ≈ 230 px) for the eight
  const tFive = AT(k, 23, "so here are five more"), t7of8 = AT(k, 23, "seven of them"), t225 = AT(k, 23, "two hundred and twenty five"),
    tComp = AT(k, 23, "The computer does"), tLink = AT(k, 23, "And our first point"), tKeep = SS(k, 24);
  const z8 = prog(f, tAll, tAll + 40);
  const B24 = zoomBox(ZOOM, Z8, z8);
  const P = mapP(B24);
  const cE = P(IAN.c[0], IAN.c[1]);
  // fix 2 (fix1 review 2 Should 7): the map results and their arrows grow on the spoken values, not at the sentence starts
  const pts = [{ az: 0, d: P0, t0: tA, tuv: tAuv, tr: AT(k, 8, "minus eight point seven"), tt: AT(k, 9, "thirty eight"), end: tB },
    { az: 90, d: P90, t0: tB, tuv: tBuv, tr: AT(k, 14, "minus thirty seven point four"), tt: tB16, end: tC }, { az: 135, d: P135, t0: tC, tuv: tCuv, tr: tCr2, tt: tCt2, end: tAll }];
  // fix 2 (fix1 review 1 Should 1, user 2026-11-07): the data values u, v of each point and the 135° cosine and sine are non-obvious
  // inputs: gold (+8 %) on their spoken words. cos/sin of 0° and 90° (1 and 0) are left plain (obvious; no clutter).
  const wU = [AT(k, 6, "minus eight point seven"), AT(k, 12, "minus sixteen point nine"), AT(k, 17, "minus ten point one")],
    wV = [AT(k, 6, "thirty eight"), AT(k, 12, "minus thirty seven point four"), AT(k, 17, "minus forty four point five")],
    wC135 = AT(k, 18, "about minus zero point seven zero seven"), wS135 = AT(k, 18, "plus zero point seven zero seven");
  const cur = f < tB ? 0 : f < tC ? 1 : 2;
  const su = 4, LUa = 90;
  const sweep = Math.round(72 * prog(f, tAll + 10, tAll + 70));
  const [eqA, eqB] = cutAt(EQ_S24, String.raw`,\qquad `);
  return (
    <Scene>
      <GeoMap id="s24m" B={B24} o={1} fade={1}>
        {(Pm) => <>
          <IanBody P={Pm} f={f} z={1} o={0.6} />
          <path d={ringPath(Pm)} fill="none" stroke={C.first} strokeWidth={4} opacity={0.8} />
          <circle cx={cE[0]} cy={cE[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
          {Array.from({ length: sweep }, (_, i) => { const q = Pm(RING.lat[i], RING.lon[i]); return <circle key={i} cx={q[0]} cy={q[1]} r={6} fill={C.key} opacity={0.4} />; })}
        </>}
      </GeoMap>
      <Svg>
        {pts.map((p, n) => {
          const j = iAz(p.az), q = P(RING.lat[j], RING.lon[j]), a = p.az * D2R;
          const er: Pt = [Math.cos(a), -Math.sin(a)], et = rotS(er, 90);
          const live = win(f, p.t0, p.end - 12, 12);
          const uE: Pt = [q[0] + p.d.u * su, q[1]], vE: Pt = [uE[0], uE[1] - p.d.v * su];
          const grR = prog(f, p.tr - 4, p.tr + 14), grT = prog(f, p.tt - 4, p.tt + 14);
          return (
            <g key={n}>
              <circle cx={q[0]} cy={q[1]} r={13} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, p.t0)} />
              <g opacity={live}>
                <circle cx={q[0]} cy={q[1]} r={30} fill="none" stroke={C.gold} strokeWidth={4} />
                <g opacity={fin(f, p.tuv)}><AnimatedWindArrow from={q} to={vE} speed={Math.hypot(p.d.u, p.d.v)} f={f} c={C.ink} px={8} head={28} /></g>
                <line x1={q[0]} y1={q[1]} x2={uE[0]} y2={uE[1]} stroke={C.second} strokeWidth={6} opacity={fin(f, p.tuv)} />
                <line x1={uE[0]} y1={uE[1]} x2={vE[0]} y2={vE[1]} stroke={C.second} strokeWidth={6} strokeDasharray="12 8" opacity={fin(f, p.tuv)} />
                <Arrow p={q} q={[q[0] + er[0] * LUa, q[1] + er[1] * LUa]} color={C.second} w={6} head={24} o={fin(f, p.tuv + 30) * (1 - grR)} />
                <Arrow p={q} q={[q[0] + et[0] * LUa, q[1] + et[1] * LUa]} color={C.second} w={6} head={24} o={fin(f, p.tuv + 30) * (1 - grT)} />
                <Arrow p={q} q={[q[0] + er[0] * p.d.ur * su * grR, q[1] + er[1] * p.d.ur * su * grR]} color={C.neg} w={9} head={30} o={fin(f, p.tr - 4)} />
                <Arrow p={q} q={[q[0] + et[0] * p.d.ut * su * grT, q[1] + et[1] * p.d.ut * su * grT]} color={C.first} w={9} head={30} o={fin(f, p.tt - 4)} />
              </g>
              {/* R7: the eight-point picture: u_r (rose, in or out) and u_θ (teal, round) at every 45°, on the zoomed scale */}
            </g>
          );
        })}
        <SpeedBar x={CX} y={110} w={300} />
        <Keyword f={f} text="three points by hand" at={[CX, 260]} appear={0} out={tRem - 18} />
        <SkipChip f={f} k={k} to={keepTime("s24_ring_points")} x0={1210} />
        <Lbl x={CX} y={800} t="all 72, then average" c={C.key} s={T.floor} o={win(f, tComp, tLink - 18, 10)} />
        {/* R7: the eight points (three by hand + five more), arrows drawn and labelled on the map; no arithmetic for the five */}
        {AZ8.map((az, n) => {
          const d = IAN.pts8[String(az)], j = iAz(az), q = P(RING.lat[j], RING.lon[j]), a = az * D2R;
          const er: Pt = [Math.cos(a), -Math.sin(a)], et = rotS(er, 90);
          const t0 = [0, 90, 135].includes(az) ? tAll + 40 : tFive + 30 + 14 * [45, 180, 225, 270, 315].indexOf(az);
          const g = prog(f, t0, t0 + 18), o = fin(f, t0, 8) * fout(f, tKeep - 12);
          return o <= 0 ? null : <g key={`p8${n}`} opacity={o}>
            <circle cx={q[0]} cy={q[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={3} />
            {/* fix 1 after fb1 (review 2 Should 5): a drawn length of at least 34 px (the 180° u_r, −1.9 m/s, was 4.6 px under its dot);
                the label keeps the true value */}
            <Arrow p={q} q={[q[0] + er[0] * L8(d.ur) * g, q[1] + er[1] * L8(d.ur) * g]} color={C.neg} w={8} head={24} />
            <Arrow p={q} q={[q[0] + et[0] * d.ut * S8 * g, q[1] + et[1] * d.ut * S8 * g]} color={C.first} w={8} head={24} />
            {az === 0 ? <circle cx={q[0]} cy={q[1]} r={26} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tLink)} /> : null}
          </g>; })}
        {/* fix 1 after fb1 (review 2 Should 4): "in at 7 of 8" on "seven of them", "· out at 225°" added on "two hundred and twenty five" */}
        <Keyword f={f} text={f < t225 ? "in at 7 of 8" : "in at 7 of 8 · out at 225°"} at={[CX, 740]} s={T.floor} c={C.neg} appear={t7of8} out={tComp - 18} />
        {/* fix 1c C39: r̂ at 135° with its equal west and north legs (a 45° triangle) */}
        {(() => { const j = iAz(135), q = P(RING.lat[j], RING.lon[j]), L = 100, c = L / Math.SQRT2; const o = win(f, AT(k, 18, "forty five degrees"), tCr);
          return o <= 0 ? null : <g opacity={o}>
            <Arrow p={q} q={[q[0] - c, q[1] - c]} color={C.second} w={7} head={24} />
            <Dash p={q} q={[q[0] - c, q[1]]} c={C.second} w={4} /><Dash p={[q[0] - c, q[1]]} q={[q[0] - c, q[1] - c]} c={C.second} w={4} />
            {/* K6 after fix 1c: at the leg's west end (under it, it sat on the ring and on the wind's u / v lines) */}
            <Lbl x={q[0] - c - 14} y={q[1] + 34} t="west" c={C.second} s={T.floor} a="end" />
            <Lbl x={q[0] - c - 14} y={q[1] - c / 2} t="north" c={C.second} s={T.floor} a="end" />
          </g>; })()}
      </Svg>
      {pts.map((p, n) => {
        const j = iAz(p.az), q = P(RING.lat[j], RING.lon[j]), a = p.az * D2R;
        const er: Pt = [Math.cos(a), -Math.sin(a)], et = rotS(er, 90);
        const live = win(f, p.t0, p.end - 12, 12);
        return <React.Fragment key={n}>
          <TeX s={`${p.az}^\\circ`} x={q[0] + er[0] * (p.az === 0 ? -50 : 52)} y={q[1] + er[1] * (p.az === 0 ? -50 : 52)} size={46} ax={0.5} c={C.gold} halo o={win(f, p.end, tAll, 10)} />
          <TeX s={String.raw`\boldsymbol{u_r=${LAB24[p.az].ur}}`} x={lab24(p.az, cE, q).ur[0]} y={lab24(p.az, cE, q).ur[1]} size={50} ax={0.5} c={C.neg} halo haloW={0.12} o={live * fin(f, p.tr + 10)} />
          <TeX s={String.raw`\boldsymbol{u_\theta=${LAB24[p.az].ut}}`} x={lab24(p.az, cE, q).ut[0]} y={lab24(p.az, cE, q).ut[1]} size={50} ax={0.5} c={C.first} halo haloW={0.12} o={live * fin(f, p.tt + 10)} />
        </React.Fragment>;
      })}
      {/* R7: the values of the eight points on the map, outside the ring (rose u_r above, teal u_θ below), shifted clockwise off the u_θ arrow */}
      {AZ8.map((az) => {
        const j = iAz(az), q = P(RING.lat[j], RING.lon[j]), a = az * D2R;
        const er: Pt = [Math.cos(a), -Math.sin(a)], et = rotS(er, 90);
        const t0 = [0, 90, 135].includes(az) ? tAll + 40 : tFive + 30 + 14 * [45, 180, 225, 270, 315].indexOf(az);
        const o = fin(f, t0 + 12, 10) * fout(f, tKeep - 12);
        if (o <= 0) return null;
        const off = az === 225 ? 122 : 92;   // fix 1 after fb1 (review 1 C2): the one outward arrow (+13.5) no longer points into its label
        const c: Pt = [q[0] + er[0] * off - et[0] * 40, q[1] + er[1] * off - et[1] * 40];
        return <React.Fragment key={`l8${az}`}>
          <TeX s={String.raw`\boldsymbol{${LAB8[az][0]}}`} x={c[0]} y={c[1] - 25} size={44} ax={0.5} c={C.neg} halo haloW={0.12} o={o} />
          <TeX s={String.raw`\boldsymbol{${LAB8[az][1]}}`} x={c[0]} y={c[1] + 25} size={44} ax={0.5} c={C.first} halo haloW={0.12} o={o} />
        </React.Fragment>;
      })}
      <TeX s={eqA} x={CX} y={262} size={46} o={fin(f, tRem)} />
      <TeX s={eqB} x={CX} y={322} size={46} o={fin(f, tRem)} />
      <TeX s={String.raw`0^\circ:\ u=${goldAt(f, wU[0], "-8.7")},\ v=${goldAt(f, wV[0], "38.0")}`} x={CX} y={395} size={hiSz(f, [wU[0], wV[0]], 44)} c={C.local} o={win(f, tAuv, tB - 18)} />
      <TeX s={String.raw`\cos0^\circ=1,\ \sin0^\circ=0`} x={CX} y={450} size={44} c={C.local} o={win(f, tAcs, tB - 18)} />
      <TeX s={String.raw`90^\circ:\ u=${goldAt(f, wU[1], "-16.9")},\ v=${goldAt(f, wV[1], "-37.4")}`} x={CX} y={395} size={hiSz(f, [wU[1], wV[1]], 44)} c={C.local} o={win(f, tBuv, tC - 18)} />
      <TeX s={String.raw`\cos90^\circ=0,\ \sin90^\circ=1`} x={CX} y={450} size={44} c={C.local} o={win(f, tBcs, tC - 18)} />
      <TeX s={String.raw`135^\circ:\ u=${goldAt(f, wU[2], "-10.1")},\ v=${goldAt(f, wV[2], "-44.5")}`} x={CX} y={395} size={hiSz(f, [wU[2], wV[2]], 44)} c={C.local} o={win(f, tCuv, tAll - 18)} />
      {/* K6 after fix 1c: cos 135° on two lines (it ran to x 1845); the 135° stack starts under it (y 590, it met the cosine line) */}
      <TeX s={String.raw`\cos135^\circ=-\cos45^\circ`} x={CX} y={455} size={44} c={C.local} o={win(f, AT(k, 18, "its cosine"), tCr - 16)} />
      <TeX s={String.raw`=-\dfrac{1}{\sqrt2}\approx${goldAt(f, wC135, "-0.707")}`} x={CX + 112} y={540} size={hiSz(f, [wC135], 44)} c={C.local} o={win(f, AT(k, 18, "about minus zero point"), tCr - 16)} />
      {/* fix 3 (review 3 cosmetic + Should 4): both values stay up, compact, while the two sums use them */}
      <TeX s={String.raw`\cos135^\circ\approx-0.707`} x={CX} y={450} size={44} c={C.local} o={win(f, tCr + 4, tAll - 18)} />
      <TeX s={String.raw`\sin135^\circ\approx0.707`} x={CX} y={504} size={44} c={C.local} o={win(f, tCr + 4, tAll - 18)} />
      {/* fix 2: the sine on two lines too (with the display-size 1/√2 it would end at x 1859) */}
      <TeX s={String.raw`\sin135^\circ=\sin45^\circ`} x={CX} y={622} size={44} c={C.local} o={win(f, AT(k, 18, "and its sine"), tCr - 16)} />
      <TeX s={String.raw`=\dfrac{1}{\sqrt2}\approx${goldAt(f, wS135, "0.707")}`} x={CX + 112} y={708} size={hiSz(f, [wS135], 44)} c={C.local} o={win(f, Math.min(AT(k, 18, "and its sine") + 15, wS135), tCr - 16)} />
      {/* R7: the eight points' legend and summary; R8 link: the θ = 0° point is the first term of the radial sum */}
      <Svg><Lbl x={CX} y={410} t="$u_r$ (m/s): in ($-$) or out ($+$)" c={C.neg} s={T.floor} o={win(f, tFive, tKeep - 12)} />
      <Lbl x={CX} y={465} t="$u_\theta$ (m/s): round" c={C.first} s={T.floor} o={win(f, tFive, tKeep - 12)} /></Svg>
      <TeX s={String.raw`\overline{u_r}=\dfrac{\textcolor{${C.gold}}{-8.7}-10.3-11.2-\dots}{72}`} x={CX} y={752} size={44} o={win(f, tLink, tKeep - 12)} />
      <TeX s={String.raw`\approx-13.3\ \mathrm{m/s}`} x={CX + 52} y={842} size={44} o={win(f, tLink + 20, tKeep - 12)} />
      {/* K6 after fix 1c: the 0° and 90° products and their results on two lines each, "=" column 1250 at 44 px (rows ran to x 2069) */}
      <CalcStack f={f} x={1250} y={500} size={44} maxLines={2} o={fout(f, tB - 18)} rows={[
        { lhs: "u_r", rhs: String.raw`=(-8.7)(1)+(38.0)(0)`, at: tAr },
        { rhs: String.raw`=-8.7`, at: AT(k, 8, "minus eight point seven"), cont: true },
        { lhs: String.raw`u_\theta`, rhs: String.raw`=-(-8.7)(0)+(38.0)(1)`, at: tAt },
        { rhs: String.raw`=38.0`, at: AT(k, 9, "thirty eight"), cont: true },
      ]} />
      <CalcStack f={f} x={1250} y={500} size={44} maxLines={2} o={fout(f, tC - 18)} rows={[
        { lhs: "u_r", rhs: String.raw`=(-16.9)(0)+(-37.4)(1)`, at: tBr },
        { rhs: String.raw`=-37.4`, at: AT(k, 14, "minus thirty seven point four"), cont: true },
        { lhs: String.raw`u_\theta`, rhs: String.raw`=-(-16.9)(1)+(-37.4)(0)`, at: tBt },
        // fix 3 (review 3 Should 4, A2): the sign move on its own line
        { rhs: String.raw`-(-16.9)=+16.9`, at: AT(k, 15, "which leaves minus u"), cont: true },
        { lhs: String.raw`u_\theta`, rhs: String.raw`=+16.9`, at: Math.max(AT(k, 15, "which leaves minus u") + 12, tB16), cont: true },
      ]} />
      {/* K6 after fix 1c: two pages instead of one sliding stack (the u_r rows slid up through the cosine line): u_r fades before
          u_θ comes, in the same place */}
      {/* fix 3 (review 3 Should 4, A2): each product with its sign on its own line before the sum */}
      <CalcStack f={f} x={1310} y={545} size={46} maxLines={5} o={fout(f, tCt - 14)} rows={[
        { lhs: "u_r", rhs: String.raw`=(-10.1)\times(-0.707)`, at: tCr, h: 56 },
        { rhs: String.raw`+(-44.5)\times0.707`, at: Math.max(tCr + 12, tCr1b), cont: true, h: 56 },
        { rhs: String.raw`(-10.1)(-0.707)=+7.14`, at: pC[0], h: 56 },
        { rhs: String.raw`(-44.5)(0.707)=-31.46`, at: pC[1], h: 56 },
        { lhs: "u_r", rhs: String.raw`=7.14-31.46\approx-24.3`, at: Math.max(pC[1] + 12, tCr2), h: 56 },
      ]} />
      {/* fix 2 (review 2 Should 4): the first row holds the whole sum (two lines), so no line reads "u_θ = 10.1 × 0.707" */}
      {/* fix 3 (review 3 Should 4, A2): −(−10.1) = +10.1 and (−44.5)(−0.707) = +31.46 each on their own line */}
      <CalcStack f={f} x={1250} y={545} size={44} maxLines={6} o={fout(f, tAll - 18)} rows={[
        { lhs: String.raw`u_\theta`, rhs: String.raw`=-(-10.1)(0.707)`, at: tCt, h: 50 },
        { rhs: String.raw`\quad+(-44.5)(-0.707)`, at: Math.max(tCt + 12, tCt1b), cont: true, h: 50 },
        { rhs: String.raw`-(-10.1)=+10.1`, at: pT[0], h: 50 },
        { rhs: String.raw`10.1\times0.707=7.14`, at: pT[1], h: 50 },
        { rhs: String.raw`(-44.5)(-0.707)=+31.46`, at: pT[2], h: 50 },
        { lhs: String.raw`u_\theta`, rhs: String.raw`=7.14+31.46\approx38.6`, at: Math.max(pT[2] + 12, tCt2), h: 50 },
      ]} />
      <TeX s={String.raw`0^\circ:\ u_r\approx-8.7,\ u_\theta\approx38.0`} x={CX} y={530} size={44} o={fin(f, tAll)} />
      <TeX s={String.raw`90^\circ:\ u_r=-37.4,\ u_\theta=16.9`} x={CX} y={600} size={44} o={fin(f, tAll)} />
      <TeX s={String.raw`135^\circ:\ u_r\approx-24.3,\ u_\theta\approx38.6`} x={CX} y={670} size={44} o={fin(f, tAll)} />
      <SourceBelow text={IAN_SRC} pic={MB} w={1100} name="s24 src" />
      {void [tAcs, cur]}
    </Scene>
  );
};

// ================================================================ s25 why polar: u, v swing; u_θ positive, u_r mostly negative
const S25: React.FC = () => {
  const f = useCurrentFrame(), k = K("s25_why_polar_storm");
  const tPlot = SS(k, 1), tUV = SS(k, 2), tV = AT(k, 2, "dashed orange line"), t3 = SS(k, 3), tSw = SS(k, 4), tPol = SS(k, 7), tTeal = AT(k, 8, "teal line"), tRose = AT(k, 8, "rose line"),
    tRange = SS(k, 9), tWob = SS(k, 10), tNeg = SS(k, 11), tAvg = SS(k, 12), tTwo = SS(k, 13), tWhy = SS(k, 14);
  // feedback 2026-11-06 (R9, user 2026-11-07): the forward link to Part 2: turned axes on a coast, across-shore wind pushes water onto it
  const tCoast = AT(k, 14, "The same idea works on a coast"), tPush = AT(k, 14, "Wind blowing across the shore");
  // user 2026-11-07: Part 2 shows the IMPACT: wind onto the land -> water level (tide gauges) -> flood maps (satellite before / after)
  const tP2 = AT(k, 14, "In Part 2"), tOnto = AT(k, 14, "how much of the wind blew onto the land"), tGauge = AT(k, 14, "how high the water rose"),
    tFlood = AT(k, 14, "the flooded land");
  const PB = { x: 80, y: 40, w: 920, h: 740 };
  const Bend = boxAt(26.6, -82.3, 3.5, PB.x, PB.y, PB.w, PB.h);
  const B = zoomBox(boxAt(IAN.c[0], IAN.c[1], 1.08, PB.x, PB.y, PB.w, PB.h), Bend, prog(f, 0, 30));
  const P = mapP(B);
  const A: Ax = { x: 1180, y: 340, w: 440, h: 260, xr: [0, 360], yr: [-50, 50] };   // K6 k6f2: 30 px lower, the colour bar (y 200) clear of the keywords and "47"   // fix 1 Must 3: room for the speed bar above
  const az = RING.az as number[];
  const runUV = prog(f, tUV, tV + 30), runP = prog(f, tTeal - 10, tRose + 40);
  const mi = Math.min(71, Math.floor(prog(f, tUV, SE(k, 12)) * 72));
  const mk = P(RING.lat[mi], RING.lon[mi]);
  const PA = axP(A), Y = axY(A);
  const dim = 1 - 0.7 * fin(f, tPol);
  const legO = fout(f, tPush - 22, 12);   // fix 1 after fb1 (Must 1): the legend leaves before the coast lines take its rows   // fix 2 (review 2 Should 6): u and v at 30 % from S8
  return (
    <Scene>
      <GeoMap id="s25m" B={B} fade={1 - prog(f, 0, 30)}>
        {(Pm) => <>
          <IanBody P={Pm} f={f} z={1 - prog(f, 0, 30)} />
          <path d={ringPath(Pm)} fill="none" stroke={C.first} strokeWidth={4} />
          <circle cx={mk[0]} cy={mk[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tUV)} />
        </>}
      </GeoMap>
      <Svg>
        <rect x={A.x} y={Y(47)} width={A.w} height={Y(17) - Y(47)} fill={C.first} opacity={0.1 * fin(f, tRange)} />
        <Axes A={A} xt={[0, 90, 180, 270, 360]} yt={[-50, -25, 0, 25, 50]} xl="θ round the eye (°)" zero o={fin(f, tPlot - 20)} />
        <Lbl x={A.x - 14} y={A.y - 48} t="m/s" c={C.muted} s={44} a="end" b={false} o={fin(f, tPlot - 20)} />
        <Curve A={A} xs={az} ys={RING.u} c={C.second} upto={runUV} o={dim} />
        <Curve A={A} xs={az} ys={RING.v} c={C.second} dash="14 10" upto={prog(f, tV - 10, tV + 30)} o={dim} />
        <Curve A={A} xs={az} ys={RING.vt} c={C.first} w={7} upto={prog(f, tTeal - 10, tTeal + 30)} />
        <Curve A={A} xs={az} ys={RING.vr} c={C.neg} w={7} dash="16 8" upto={prog(f, tRose - 10, tRose + 30)} />
        {[0, 18, 27].map((i, n) => <g key={n} opacity={fin(f, t3) * dim}><circle cx={PA(az[i], RING.u[i])[0]} cy={PA(az[i], RING.u[i])[1]} r={9} fill={C.gold} />
          <circle cx={PA(az[i], RING.v[i])[0]} cy={PA(az[i], RING.v[i])[1]} r={9} fill={C.gold} /></g>)}
        <g opacity={fin(f, tRange) * 0.9}><line x1={A.x} y1={Y(IAN.vt)} x2={A.x + A.w} y2={Y(IAN.vt)} stroke={C.first} strokeWidth={3} strokeDasharray="6 10" /></g>
        <g opacity={fin(f, tAvg) * 0.9}><line x1={A.x} y1={Y(IAN.vr)} x2={A.x + A.w} y2={Y(IAN.vr)} stroke={C.neg} strokeWidth={3} strokeDasharray="6 10" /></g>
        {/* fix 1c C41: the spoken numbers on the graph, each on its words; the 14 outward points shaded */}
        <rect x={PA(185, 0)[0]} y={A.y} width={PA(250, 0)[0] - PA(185, 0)[0]} height={A.h} fill={C.neg} opacity={0.12 * fin(f, tNeg)} />
        {/* fix 3 (review 3 Should 11): "14 points out" (a count, not m/s) in the free lower-right of the plot, under the rose curve */}
        <Lbl x={PA(138, 0)[0]} y={Y(-40)} t="14 points out" c={C.neg} s={T.floor} o={fin(f, AT(k, 11, "blow outward"))} />
        <Lbl x={PA(90, 0)[0]} y={Y(16.9) + 26} t="17" c={C.first} s={T.floor} a="middle" o={fin(f, AT(k, 9, "seventeen"))} />
        {/* fix 2 (review 2 Should 6): "47" above its peak (clear of the curves), "mean 35" above the mean line where the teal curve is
            below it (θ 20°-130°), clear of the θ = 0 dots */}
        <Lbl x={PA(215, 0)[0] - 2} y={Y(46.8) - 26} t="47" c={C.first} s={T.floor} o={fin(f, AT(k, 9, "forty seven"))} />
        <Lbl x={PA(22, 0)[0]} y={Y(IAN.vt) - 40} t="mean 35" c={C.first} s={T.floor} o={fin(f, AT(k, 9, "average of thirty five"))} />
        <Lbl x={PA(100, 0)[0] - 18} y={Y(-40.1)} t="−40" c={C.neg} s={T.floor} a="end" o={fin(f, AT(k, 10, "minus forty"))} />
        {/* fix 2: "+14" left of its peak with a leader tick (it sat on the u curve) */}
        <Lbl x={PA(185, 0)[0] - 8} y={Y(14.15) - 2} t="+14" c={C.neg} s={T.floor} a="end" o={fin(f, AT(k, 10, "plus fourteen"))} />
        <line x1={PA(185, 0)[0]} y1={Y(14.15)} x2={PA(214, 0)[0]} y2={Y(14.15)} stroke={C.neg} strokeWidth={3} opacity={fin(f, AT(k, 10, "plus fourteen"))} />
        {/* K6 after fix 1c: under the rose curve, right of "14 out" (it sat on the curve and on "14 out") */}
        {/* fix 3 (review 3 Should 11): at the right end of the dotted −13 line, off the plot's bottom frame */}
        <Lbl x={A.x + A.w + 8} y={Y(IAN.vr) + 44} t="mean −13" c={C.neg} s={T.floor} o={fin(f, tAvg)} />
        {/* fix 1c C42: the three spoken sides linked to the graph */}
        {/* K6 after fix 1c: "v ≈ −46" just above its ring between the two curves, "u ≈ +25" up-left of its ring, both off the u / v lines */}
        {([[0, RING.v[0], "v ≈ +38", AT(k, 6, "east side"), "start", 18, -26], [180, RING.v[36], "v ≈ −46", AT(k, 6, "west side"), "middle", -20, -48],
           [270, RING.u[54], "u ≈ +25", AT(k, 6, "south side"), "start", 14, Y(-24) - Y(RING.u[54])]] as [number, number, string, number, "start" | "end" | "middle", number, number][]).map(([az0, val, t, ta, an, dx, dy]) => {
          const q = PA(az0, val), o = win(f, ta, SS(k, 7) - 6);
          return o <= 0 ? null : <g key={t} opacity={o}><circle cx={q[0]} cy={q[1]} r={11} fill="none" stroke={C.gold} strokeWidth={4} />
            <Lbl x={q[0] + dx} y={q[1] + dy} t={t} c={C.gold} s={T.floor} a={an} /></g>; })}
        <Lbl x={A.x + A.w + 14} y={Y(RING.u[71]) - 6} t="u" c={C.second} s={T.floor} o={fin(f, tUV + 30) * fout(f, tTeal - 12)} />
        <Lbl x={A.x + A.w + 14} y={Y(RING.v[71]) + 10} t="v" c={C.second} s={T.floor} o={fin(f, tV + 30) * fout(f, tTeal - 12)} />
        <line x1={1180} y1={745} x2={1240} y2={745} stroke={C.second} strokeWidth={6} opacity={fin(f, tUV) * dim * legO} />
        <Lbl x={1252} y={745} t="eastward u" c={C.second} s={T.floor} o={fin(f, tUV) * dim * legO} />
        <line x1={1500} y1={745} x2={1560} y2={745} stroke={C.second} strokeWidth={6} strokeDasharray="12 8" opacity={fin(f, tV) * dim * legO} />
        <Lbl x={1572} y={745} t="northward v" c={C.second} s={T.floor} o={fin(f, tV) * dim * legO} />
        <line x1={1180} y1={805} x2={1240} y2={805} stroke={C.first} strokeWidth={7} opacity={fin(f, tTeal) * legO} />
        <line x1={1500} y1={805} x2={1560} y2={805} stroke={C.neg} strokeWidth={7} strokeDasharray="14 8" opacity={fin(f, tRose) * legO} />
        <SpeedBar x={1480} y={200} w={240} />
        <Keyword f={f} text="why polar here?" at={[1180, 96]} appear={0} out={tSw - 18} />
        <Keyword f={f} text="u, v swing: the wind turns" at={[1180, 96]} s={T.floor} appear={tSw} out={tNeg - 18} />
        {/* fix 2 (fix1 review 2 Should 9): the 14 is named in the line itself ("14 out"), and the line comes on "fifty eight" */}
        <Keyword f={f} text="72 − 14 out = 58 points in" at={[1180, 96]} s={T.floor} c={C.neg} appear={AT(k, 11, "fifty eight")} out={tTwo - 18} />
        <Keyword f={f} text="spin 35 · inflow −13" at={[1180, 96]} s={T.floor} appear={tTwo} out={tCoast - 18} />
        <Keyword f={f} text="next, in Part 2: winds at a coast" at={[1180, 96]} s={T.floor} appear={tCoast} />
        {/* R9: at Fort Myers Beach (26.45 N, 81.95 W; the shore runs about 329°, so the axes are turned to it): x′ along the shore (NNW),
            y′ across it, towards the land (ENE); a sketch of Part 2's use of the turned axes, not data */}
        {(() => { const q = P(26.45, -81.95), o = fin(f, tCoast + 20, 12); if (o <= 0) return null;
          const al: Pt = [-Math.sin(31 * D2R), -Math.cos(31 * D2R)], ac: Pt = [Math.cos(31 * D2R), -Math.sin(31 * D2R)];
          return <g opacity={o}>
            <Arrow p={q} q={[q[0] + al[0] * 100, q[1] + al[1] * 100]} color={C.second} w={7} head={24} />
            <Arrow p={q} q={[q[0] + ac[0] * 100, q[1] + ac[1] * 100]} color={C.second} w={7} head={24} o={fin(f, tPush)} />
            <circle cx={q[0]} cy={q[1]} r={9} fill={C.gold} stroke={C.bg} strokeWidth={3} />
          </g>; })()}
        {/* fix 1 after fb1 (review 1 Must 1, HOUSE_STYLE §5b): the pointer lines left the HRRR map. The plot legend (its curves keep their
            end labels) leaves as the coast sentence starts, and the lines take its two rows in the right column (y 745 / 805, inside the
            K6 safe area: bottom ≤ 880, right ≤ 1842), each on its words; only the x′ / y′ point labels stay on the map */}
        <Lbl x={1180} y={745} t="across the shore → land:" c={C.key} s={T.floor} o={win(f, tPush, tP2 - 18)} />
        <Lbl x={1180} y={805} t="sea water pushed ashore" c={C.key} s={T.floor} o={win(f, tPush + 10, tP2 - 18)} />
        {/* user 2026-11-07: the impact chain, each step on its words */}
        <Keyword f={f} text="Part 2: wind onto the land" at={[1180, 745]} s={T.floor} appear={Math.max(tP2, tOnto - 20)} />
        <Keyword f={f} text={f < tFlood ? "→ water level" : "→ water level → flood maps"} at={[1180, 805]} s={T.floor} appear={tGauge} />
      </Svg>
      <TeX s={String.raw`\text{round }u_\theta`} x={1252} y={805} size={44} c={C.first} o={fin(f, tTeal) * legO} />
      <TeX s={String.raw`\text{in-out }u_r`} x={1572} y={805} size={44} c={C.neg} o={fin(f, tRose) * legO} />
      <TeX s={String.raw`u_\theta`} x={A.x + A.w + 14} y={Y(RING.vt[71])} size={44} c={C.first} o={fin(f, tTeal + 30)} />
      <TeX s={String.raw`u_r`} x={A.x + A.w + 14} y={Y(RING.vr[71])} size={44} c={C.neg} o={fin(f, tRose + 30)} />
      {(() => { const q = P(26.45, -81.95), al: Pt = [-Math.sin(31 * D2R), -Math.cos(31 * D2R)], ac: Pt = [Math.cos(31 * D2R), -Math.sin(31 * D2R)];
        return <>
          <TeX s="x'" x={q[0] + al[0] * 128} y={q[1] + al[1] * 128} size={48} ax={0.5} c={C.second} halo o={fin(f, tCoast + 20, 12)} />
          <TeX s="y'" x={q[0] + ac[0] * 132} y={q[1] + ac[1] * 132} size={48} ax={0.5} c={C.second} halo o={fin(f, tPush)} />
        </>; })()}
      <SourceBelow text={IAN_SRC} pic={PB} w={920} name="s25 src" />
      {void [tWob, tWhy, runP]}
    </Scene>
  );
};

// ================================================================ s26 the inflow angle; four angles side by side
const S26: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26_inflow_angle");
  const tSlant = SS(k, 1), tName = SS(k, 2), tTan = SS(k, 3), tAng = SS(k, 4), tFour = SS(k, 5), tTh = SS(k, 6), tBr = SS(k, 7), tAl = SS(k, 8), tIn = SS(k, 9), tQ = SS(k, 10), tMore = SS(k, 11);
  const Pp: Pt = [360, 400], L = 380, ang = SAY.angle;
  const w: Pt = [Pp[0] + L * Math.cos(ang * D2R), Pp[1] - L * Math.sin(ang * D2R)];
  const [tl, tr] = cutAt(EQ_S26, "=");
  // fix 3 (review 3 Must 1, qa halves): from tFour all four slots are drawn ghosted (0.25), each comes to full strength on its own
  // sentence, so the right half is never empty while the row builds
  const mini = (n: number) => 0.25 * fin(f, tFour) + 0.75 * fin(f, [tTh, tBr, tAl, tIn][n]);
  const MX = [250, 700, 1150, 1600], MY = 640;
  const means = [["where", "a point is"], ["which way", "it points"], ["how far the", "axes turned"], ["how far the", "wind leans in"]];
  return (
    <Scene>
      <Svg>
        <circle cx={Pp[0]} cy={Pp[1] - 260} r={10} fill={C.gold} opacity={0.9} />
        <Dash p={Pp} q={[Pp[0], Pp[1] - 250]} c={C.muted} w={3} />
        <Lbl x={Pp[0] + 20} y={Pp[1] - 260} t="eye" c={C.muted} s={T.floor} />
        <Arrow p={Pp} q={[Pp[0] + L, Pp[1]]} color={C.second} />
        <AnimatedWindArrow from={Pp} to={w} speed={37} f={f} c={C.ink} px={10} head={40} o={fin(f, tSlant)} />
        {/* fix 1c C43: the wind's two parts as the triangle's legs */}
        <g opacity={fin(f, AT(k, 3, "the inward part"))}>
          <line x1={Pp[0]} y1={Pp[1]} x2={w[0]} y2={Pp[1]} stroke={C.first} strokeWidth={8} opacity={0.8} />
          <line x1={w[0]} y1={Pp[1]} x2={w[0]} y2={w[1]} stroke={C.neg} strokeWidth={8} opacity={0.9} />
          <Lbl x={(Pp[0] + w[0]) / 2 - 90} y={Pp[1] + 42} t="34.8 round" c={C.first} s={T.floor} a="middle" />
          <Lbl x={w[0] + 18} y={(Pp[1] + w[1]) / 2} t="13.3 in" c={C.neg} s={T.floor} />
        </g>
        <path d={`M ${Pp[0]} ${Pp[1]} L ${Pp[0] + 200} ${Pp[1]} A 200 200 0 0 0 ${Pp[0] + 200 * Math.cos(ang * D2R)} ${Pp[1] - 200 * Math.sin(ang * D2R)} Z`} fill={C.neg} fillOpacity={0.35} stroke={C.neg} strokeWidth={4} opacity={fin(f, tName)} />
        <circle cx={Pp[0]} cy={Pp[1]} r={12} fill={C.key} />
        <Lbl x={Pp[0] + 230} y={Pp[1] + 70} t="inflow angle" c={C.neg} s={T.floor} o={fin(f, tName) * fout(f, tAng - 14)} />
        <Lbl x={Pp[0] + 230} y={Pp[1] + 70} t="≈ 21°" c={C.neg} s={T.key} o={fin(f, tAng + 6)} />
        {/* four angles (S6-S9) */}
        <g opacity={mini(0)}>
          <line x1={MX[0]} y1={MY} x2={MX[0] + 140} y2={MY} stroke={C.muted} strokeWidth={3} />
          <line x1={MX[0]} y1={MY} x2={MX[0] + 140 * Math.cos(53 * D2R)} y2={MY - 140 * Math.sin(53 * D2R)} stroke={C.first} strokeWidth={5} />
          <path d={arcD([MX[0], MY], 70, 0, 53)} fill="none" stroke={C.local} strokeWidth={5} /><ArcHead c={[MX[0], MY]} r={70} a={53} dir={1} col={C.local} />
          <Lbl x={MX[0] + 160} y={MY - 40} t="θ" c={C.local} s={T.key} />
        </g>
        <g opacity={mini(1)}>
          <line x1={MX[1]} y1={MY} x2={MX[1]} y2={MY - 140} stroke={C.muted} strokeWidth={3} />
          <line x1={MX[1]} y1={MY} x2={MX[1] + 140 * Math.sin(37 * D2R)} y2={MY - 140 * Math.cos(37 * D2R)} stroke={C.first} strokeWidth={5} />
          <path d={arcD([MX[1], MY], 80, 90, 53)} fill="none" stroke={C.gold} strokeWidth={5} /><ArcHead c={[MX[1], MY]} r={80} a={53} dir={-1} col={C.gold} />
          <Lbl x={MX[1] + 110} y={MY - 40} t="bearing" c={C.gold} s={T.floor} />
        </g>
        <g opacity={mini(2)}>
          <line x1={MX[2] - 20} y1={MY} x2={MX[2] + 150} y2={MY} stroke={C.second} strokeWidth={3} opacity={0.5} />
          <line x1={MX[2]} y1={MY} x2={MX[2] + 150 * Math.cos(30 * D2R)} y2={MY - 150 * Math.sin(30 * D2R)} stroke={C.second} strokeWidth={5} />
          <path d={arcD([MX[2], MY], 80, 0, 30)} fill="none" stroke={C.second} strokeWidth={5} />
          <Lbl x={MX[2] + 170} y={MY - 50} t="α" c={C.second} s={T.key} />
        </g>
        <g opacity={mini(3)}>
          <line x1={MX[3]} y1={MY} x2={MX[3] + 150} y2={MY} stroke={C.second} strokeWidth={5} />
          <line x1={MX[3]} y1={MY} x2={MX[3] + 150 * Math.cos(SAY.angle * D2R)} y2={MY - 150 * Math.sin(SAY.angle * D2R)} stroke={C.first} strokeWidth={5} />
          <path d={`M ${MX[3]} ${MY} L ${MX[3] + 90} ${MY} A 90 90 0 0 0 ${MX[3] + 90 * Math.cos(SAY.angle * D2R)} ${MY - 90 * Math.sin(SAY.angle * D2R)} Z`} fill={C.neg} fillOpacity={0.4} />
          <Lbl x={MX[3] + 75} y={MY - 110} t="inflow" c={C.neg} s={T.floor} a="middle" />
        </g>
        {means.map((m, n) => <g key={n} opacity={mini(n)}>
          <Lbl x={MX[n] + 60} y={760} t={m[0]} c={C.key} s={T.floor} a="middle" />
          <Lbl x={MX[n] + 60} y={815} t={m[1]} c={C.key} s={T.floor} a="middle" />
        </g>)}
        <Keyword f={f} text="one more angle" at={[1080, 160]} appear={0} out={tTan - 18} />
        <Keyword f={f} text="four angles" at={[1080, 160]} appear={tFour} out={tQ - 18} />
        <Keyword f={f} text="four questions" at={[1080, 390]} appear={tQ} out={tMore - 18} />
        <Keyword f={f} text="more: Vorticity in plain words" at={[1080, 390]} s={T.floor} appear={tMore} />
      </Svg>
      <TeX s={String.raw`\hat{\boldsymbol\theta}`} x={Pp[0] + L + 50} y={Pp[1]} size={56} ax={0.5} c={C.second} />
      <TeX s={String.raw`\mathbf u`} x={w[0] + 40} y={w[1] - 10} size={56} c={C.ink} o={fin(f, tSlant)} />
      <TeX s={tl} x={1080} y={160} size={56} o={win(f, tTan, tFour - 18)} />
      <TeX s={String.raw`=\dfrac{\text{opposite}}{\text{next to it}}=\dfrac{\text{in}}{\text{round}}`} x={1200} y={260} size={52} o={win(f, AT(k, 3, "the side opposite"), tFour - 18)} />
      {/* K6 after fix 1c: 30 px lower (the two fractions touched); the inverse on two lines (it ran to x 1880) */}
      {/* fix 2 (fix1 review 2 Should 8): the fraction on "thirteen point three over", "≈ 0.38" on "zero point three eight" (the full row
          fades in over the fraction, which is its prefix) */}
      <TeX s={`=${cutAt(tr, "\\approx")[0]}${tailIn(f, AT(k, 3, "zero point three eight"), C.ink, "\\approx" + cutAt(tr, "\\approx")[1])}`} x={1200} y={400} size={56} o={win(f, AT(k, 3, "thirteen point three over"), tFour - 18)} />
      <TeX s={String.raw`\text{inflow angle}=\tan^{-1}(0.38)`} x={1080} y={510} size={50} c={C.neg} o={win(f, AT(k, 4, "the angle with that tangent"), tFour - 18)} />
      <TeX s={String.raw`\approx20.8^\circ\approx21^\circ`} x={1340} y={580} size={50} c={C.neg} o={win(f, AT(k, 4, "twenty one degrees"), tFour - 18)} />

    </Scene>
  );
};

// ================================================================ s27 recap (one beat per sentence)
const S27: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27_recap");
  const n = 11, st = Array.from({ length: n }, (_, j) => SS(k, j));
  // fix 2 (review 2 Should 13): each beat stays at full ink until its own sentence ends (it used to fade 22 frames before the next
  // sentence, i.e. while still being spoken), then the next comes ≥ 8 frames after it has gone
  const beat = (j: number) => win(f, st[j] + (j ? 8 : 0), j + 1 < n ? SE(k, j) : LEN(k) + 20, 8);
  const O: Pt = [480, 470];
  const keys: string[] = [
    String.raw`\text{numbers that pin down a place}`,
    String.raw`\hat{\mathbf x},\ \hat{\mathbf y}:\ \text{the same everywhere}`,
    String.raw`x=r\cos\theta,\quad y=r\sin\theta`,
    String.raw`s=r\,\theta\quad(\text{radians})`,
    String.raw`\hat{\mathbf r}:\ \text{the way } r \text{ grows}`,
    String.raw`\hat{\boldsymbol\theta}=(-\sin\theta,\ \cos\theta)`,
    String.raw`u_r=\mathbf u\cdot\hat{\mathbf r},\quad u_\theta=\mathbf u\cdot\hat{\boldsymbol\theta}`,
    String.raw`\begin{pmatrix}\cos\alpha & \sin\alpha\\ -\sin\alpha & \cos\alpha\end{pmatrix}`,
    String.raw`\alpha=\theta`,
    String.raw`35\ \mathrm{m/s}\ \text{round},\ 13\ \mathrm{m/s}\ \text{in},\ \approx21^\circ`,
    "",   // beat 10 (the Part 2 teaser) is three lines, drawn below on their words
  ];
  const er: Pt = [Math.cos(53 * D2R), -Math.sin(53 * D2R)], et = rotS(er, 90), b: Pt = [O[0] + 250 * er[0], O[1] + 250 * er[1]];
  const PB = { x: 180, y: 120, w: 620, h: 600 };
  const B = boxAt(IAN.c[0], IAN.c[1], 0.6, PB.x, PB.y, PB.w, PB.h);
  const lap = (f - st[10]) / 30 * 60;
  return (
    <Scene>
      <Svg>
        <g opacity={beat(0)}>
          {[-3, -2, -1, 0, 1, 2, 3].map((q) => <line key={`v${q}`} x1={O[0] + q * 100} y1={O[1] - 300} x2={O[0] + q * 100} y2={O[1] + 300} stroke={q === 0 ? C.second : C.muted} strokeWidth={q === 0 ? 5 : 2.5} opacity={q === 0 ? 1 : 0.8} />)}
          {[-3, -2, -1, 0, 1, 2, 3].map((q) => <line key={`h${q}`} x1={O[0] - 300} y1={O[1] + q * 100} x2={O[0] + 300} y2={O[1] + q * 100} stroke={q === 0 ? C.second : C.muted} strokeWidth={q === 0 ? 5 : 2.5} opacity={q === 0 ? 1 : 0.8} />)}
          <circle cx={O[0]} cy={O[1]} r={12} fill={C.gold} />
          <BDot p={[O[0] + 150, O[1] - 200]} />
        </g>
        <g opacity={beat(1)}>
          {[[-200, 150], [100, -150], [150, 200], [-150, -100]].map(([x, y], i) => <g key={i}><Arrow p={[O[0] + x, O[1] + y]} q={[O[0] + x + 110, O[1] + y]} color={C.second} w={7} head={26} />
            <Arrow p={[O[0] + x, O[1] + y]} q={[O[0] + x, O[1] + y - 110]} color={C.second} w={7} head={26} /></g>)}
        </g>
        <g opacity={beat(2)}>
          <line x1={O[0] - 150} y1={O[1] + 150} x2={O[0] + 150} y2={O[1] + 150} stroke={C.second} strokeWidth={6} />
          <line x1={O[0] + 150} y1={O[1] + 150} x2={O[0] + 150} y2={O[1] - 250} stroke={C.second} strokeWidth={6} strokeDasharray="14 9" />
          <line x1={O[0] - 150} y1={O[1] + 150} x2={O[0] + 150} y2={O[1] - 250} stroke={C.ink} strokeWidth={9} />
          <path d={arcD([O[0] - 150, O[1] + 150], 90, 0, 53)} fill="none" stroke={C.local} strokeWidth={5} />
        </g>
        <g opacity={beat(3)}>
          <circle cx={O[0]} cy={O[1]} r={250} fill="none" stroke={C.first} strokeWidth={4} opacity={0.9} />
          <path d={arcD(O, 250, 0, 57.3)} fill="none" stroke={C.second} strokeWidth={12} />
          <line x1={O[0]} y1={O[1]} x2={O[0] + 250} y2={O[1]} stroke={C.ink} strokeWidth={6} />
          <path d={arcD(O, 60, 0, 57.3)} fill="none" stroke={C.local} strokeWidth={5} />
        </g>
        <g opacity={beat(4)}>
          <Dash p={O} q={[O[0] + 340 * er[0], O[1] + 340 * er[1]]} c={C.ink} w={4} />
          <Arrow p={b} q={[b[0] + 150 * er[0], b[1] + 150 * er[1]]} color={C.second} />
          <BDot p={b} />
        </g>
        <g opacity={beat(5)}>
          <circle cx={O[0]} cy={O[1]} r={250} fill="none" stroke={C.first} strokeWidth={4} opacity={0.9} />
          <Arrow p={b} q={[b[0] + 150 * er[0], b[1] + 150 * er[1]]} color={C.second} />
          <Arrow p={b} q={[b[0] + 150 * et[0], b[1] + 150 * et[1]]} color={C.second} />
          <path d={arcD(b, 90, 53, 143)} fill="none" stroke={C.gold} strokeWidth={5} /><ArcHead c={b} r={90} a={143} dir={1} col={C.gold} />
          <BDot p={b} />
        </g>
        <g opacity={beat(6)}>
          <line x1={O[0] - 100} y1={O[1] + 50} x2={O[0] - 100 + 180 * 0.6} y2={O[1] + 50 - 180 * 0.8} stroke={C.neg} strokeWidth={20} opacity={0.6} />
          <line x1={O[0] - 100} y1={O[1] + 50} x2={O[0] - 100 + 240 * 0.8} y2={O[1] + 50 + 240 * 0.6} stroke={C.first} strokeWidth={20} opacity={0.5} />
          <AnimatedWindArrow from={[O[0] - 100, O[1] + 50]} to={[O[0] + 200, O[1] + 50]} speed={10} f={f} c={C.ink} px={10} head={36} />
        </g>
        <g opacity={beat(7)}>
          {[0, 30].map((a, i) => { const ex = rotS([1, 0], a), ey = rotS(ex, 90);
            return <g key={i} opacity={i ? 1 : 0.4}><Arrow p={O} q={[O[0] + ex[0] * 260, O[1] + ex[1] * 260]} color={C.second} w={6} head={26} /><Arrow p={O} q={[O[0] + ey[0] * 260, O[1] + ey[1] * 260]} color={C.second} w={6} head={26} /></g>; })}
          <Arrow p={O} q={[O[0] + 120, O[1] - 160]} color={C.ink} />
        </g>
        <g opacity={beat(8)}>
          <circle cx={O[0]} cy={O[1]} r={250} fill="none" stroke={C.first} strokeWidth={4} opacity={0.9} />
          <line x1={O[0]} y1={O[1]} x2={O[0] + 420 * er[0]} y2={O[1] + 420 * er[1]} stroke={C.second} strokeWidth={3} />
          <path d={arcD(O, 90, 0, 53)} fill="none" stroke={C.gold} strokeWidth={5} />
          <Arrow p={b} q={[b[0] + 140 * er[0], b[1] + 140 * er[1]]} color={C.second} /><Arrow p={b} q={[b[0] + 140 * et[0], b[1] + 140 * et[1]]} color={C.second} />
          <BDot p={b} />
        </g>
        <g opacity={beat(10)}>
          <circle cx={O[0]} cy={O[1]} r={220} fill="none" stroke={C.first} strokeWidth={4} opacity={0.9} />
          {/* R3 teaser (feedback 2026-11-06): the balloon goes round and its r̂, θ̂ turn with it (Part 2: how fast they turn) */}
          {(() => { const a = lap * D2R, q: Pt = [O[0] + 220 * Math.cos(a), O[1] - 220 * Math.sin(a)], e1: Pt = [Math.cos(a), -Math.sin(a)], e2 = rotS(e1, 90);
            return <><Arrow p={q} q={[q[0] + e1[0] * 120, q[1] + e1[1] * 120]} color={C.second} w={7} head={24} />
              <Arrow p={q} q={[q[0] + e2[0] * 120, q[1] + e2[1] * 120]} color={C.second} w={7} head={24} />
              <BDot p={q} r={16} /></>; })()}
        </g>
      </Svg>
      <GeoMap id="s27m" B={B} o={beat(9)} frame={0.6}>
        {(Pm) => { const cE = Pm(IAN.c[0], IAN.c[1]); const m = ringArrows(Pm, iAz(315), 5, IAN.vt, IAN.vr);
          return <>
            <IanBody P={Pm} f={f} z={1} parts={false} o={0.7} />
            <path d={ringPath(Pm)} fill="none" stroke={C.first} strokeWidth={5} />
            <circle cx={cE[0]} cy={cE[1]} r={9} fill={C.gold} />
            <AnimatedWindArrow from={m.p0} to={m.tp} speed={IAN.vt} f={f} c={C.first} px={9} head={30} />
            <AnimatedWindArrow from={m.p0} to={m.rp} speed={13} f={f} c={C.neg} px={9} head={30} />
          </>; }}
      </GeoMap>
      <SourceBelow text={IAN_SRC} pic={PB} w={720} o={beat(9)} name="s27 src" />
      <Svg><SpeedBar x={1080} y={600} w={300} o={beat(9)} /></Svg>
      {keys.map((s, j) => (s ? <TeX key={j} s={s} x={1080} y={430} size={j === 7 ? 64 : 54} c={C.key} o={beat(j)} /> : null))}
      {/* R3: the teaser to Part 2, one line per phrase: turning r̂ and θ̂, height (cylindrical), the turned axes on a coast */}
      <TeX s={String.raw`\text{Part 2: how fast }\hat{\mathbf r},\ \hat{\boldsymbol\theta}\text{ turn}`} x={1080} y={360} size={50} c={C.key} o={beat(10)} />
      <TeX s={String.raw`+\ \text{height: cylindrical coordinates}`} x={1080} y={440} size={50} c={C.key} o={beat(10) * fin(f, AT(k, 10, "add height"))} />
      <TeX s={String.raw`x',\ y'\text{: wind onto the land}`} x={1080} y={520} size={50} c={C.key} o={beat(10) * fin(f, AT(k, 10, "Then we'll use"))} />
      <TeX s={String.raw`\text{water level, flooding before / after}`} x={1080} y={600} size={50} c={C.key} o={beat(10) * fin(f, AT(k, 10, "how high the"))} />
      <Svg><Keyword f={f} text="to sum up" at={[1080, 200]} appear={0} out={st[1] - 18} /></Svg>
    </Scene>
  );
};

// ================================================================ s28 the series end card (maths ending, HOUSE_STYLE §3)
const S28: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28_end");
  const t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const thumb = (x: number, i: number) => (
    <g key={i} opacity={0.75}>
      <rect x={x - 150} y={70} width={300} height={170} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
      {i === 0 ? <>{[-60, -30, 0, 30, 60].map((q) => <line key={`v${q}`} x1={x + q} y1={95} x2={x + q} y2={215} stroke={C.second} strokeWidth={2} />)}
        {[-60, -30, 0, 30, 60].map((q) => <line key={`h${q}`} x1={x - 60} y1={155 + q} x2={x + 60} y2={155 + q} stroke={C.second} strokeWidth={2} opacity={Math.abs(q) <= 60 ? 1 : 0} />)}</> : null}
      {/* rings centred in the box (box y 70–240): r ≤ 60 keeps every ring ≥ 25 px inside the frame (user note 43:15) */}
      {i === 1 ? <>{[20, 40, 60].map((r) => <circle key={r} cx={x - 40} cy={155} r={r} fill="none" stroke={C.local} strokeWidth={2} />)}
        <Arrow p={[x + 2, 113]} q={[x + 60, 92]} color={C.second} w={5} head={18} /><Arrow p={[x + 2, 113]} q={[x + 48, 158]} color={C.second} w={5} head={18} /></> : null}
      {i === 2 ? <>{[0, 30].map((a, j) => { const e = rotS([1, 0], a), n2 = rotS(e, 90);
        return <g key={j} opacity={j ? 1 : 0.4}><line x1={x - 40} y1={195} x2={x - 40 + e[0] * 110} y2={195 + e[1] * 110} stroke={C.second} strokeWidth={4} />
          <line x1={x - 40} y1={195} x2={x - 40 + n2[0] * 110} y2={195 + n2[1] * 110} stroke={C.second} strokeWidth={4} /></g>; })}</> : null}
      {i === 3 ? <><circle cx={x} cy={155} r={60} fill="none" stroke={C.first} strokeWidth={4} /><Arrow p={[x + 60, 155]} q={[x + 60, 100]} color={C.first} w={6} head={20} />
        <Arrow p={[x + 60, 155]} q={[x + 20, 155]} color={C.neg} w={6} head={20} /></> : null}
    </g>
  );
  const rel = ["vectors and index notation", "dot product", "cross product", "derivatives and Taylor series", "gradient", "contour maps", "curl", "material derivative", "Coriolis", "reading weather maps"];
  const COLX = [200, 1000], ROWY = (r: number) => 648 + r * 48;
  rel.forEach((t, i) => { if (COLX[Math.floor(i / 5)] + textW(t, T.floor) > (COLX[Math.floor(i / 5) + 1] ?? 1840) - 10) throw new Error(`end card: "${t}" too wide`); });
  return (
    <Scene>
      {/* R3 (feedback 2026-11-06): the picture fades to the background over the final 2.5-s hold, while the music bed fades out (mix tail) */}
      <AbsoluteFill style={{ opacity: fout(f, LEN(k) - HOLD, HOLD - 5) }}>
      <Svg>
        <g opacity={fin(f, 6)}>{[420, 760, 1100, 1440].map((x, i) => thumb(x, i))}</g>
        <Lbl x={960} y={315} t="a series of maths tutorials" c={C.key} s={T.calc} a="middle" o={fin(f, 10)} />
        <Lbl x={960} y={395} t="atmospheric science · meteorology · fluid dynamics" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "atmospheric science"))} />
        <g opacity={fin(f, t2)}><Notebook x={300} y={482} s={0.4} /><Lbl x={370} y={490} t="coordinates notebook" c={C.ink} s={T.key} /></g>
        <g opacity={fin(f, tOther)}>
          {[0, 1, 2].map((i) => <Notebook key={i} x={260 + i * 30} y={575 - i * 10} s={0.24} c={[C.second, "#8e6fd8", C.muted][i]} o={0.9} />)}
          <Lbl x={370} y={565} t="notebooks for the other maths concepts" c={C.key} s={T.key} />
        </g>
        <g opacity={fin(f, tOther + 20) * 0.8}>
          {rel.map((t, i) => <Lbl key={t} x={COLX[Math.floor(i / 5)]} y={ROWY(i % 5)} t={t} c={C.muted} s={T.floor} b={false} />)}
        </g>
      </Svg>
      </AbsoluteFill>
    </Scene>
  );
};

export const SCENES_C: Record<string, React.FC> = {
  s21_ian_polar: S21, s22_spin_inflow: S22, s23_what_numbers_mean: S23, s24_ring_points: S24, s25_why_polar_storm: S25, s26_inflow_angle: S26,
  s27_recap: S27, s28_end: S28,
};
void [clamp, mix];
