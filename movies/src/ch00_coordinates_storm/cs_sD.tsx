// ch00_coordinates_storm remake 2026-11-07 (master plan R13, R14, R14b; continuity plan §2a-§2c): the coast block and the three event
// winds. s26 Part 1's turned axes recalled exactly and applied to the wind (along / across tags) · s27 the coast's angle on a local flat km
// map · s28 Fort Myers Beach, onto the land · s29 Saint Petersburg, out to sea, then the opposing arrows · s30 the reasoning (wind piles
// the water up) before any evidence, and the low pressure's small share · s31 the tide gauges · s33 / s36 / s39 the across-shore wind
// of Amphan, Nargis and Idai from ERA5, each just before its before/after picture. Every number on screen comes from cs.json → shore
// (movies/data/build_ch00_coordinates_storm.py --remake1107-patch, fluidpy.data.movie_shore, CHECK DS40-DS47): the shown arithmetic is
// the builder's, and the rows below re-assert it (the render fails otherwise).
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Pt, pulse, textW } from "../house/kit/draw";
import { TeX } from "../house/kit/tex";
import { CurvedLink } from "../house/kit/extras";
import { SourceBelow } from "../house/kit/frame";
import { AnimatedWindArrow } from "../house/kit/wind";
import {
  AT, Arrow, Ax, Axes, CST, CalcStack, Curve, D, D2R, GeoImg, GeoMap, IMG, K, Keyword, LEN, Lbl, MapBox, Place, Recall, SE, SRC, SS, SSP, Scene, SpeedBar, Svg,
  arcD, axP, boxAt, clamp, fin, fout, lerpBox, linesPath, mapP, mix, nf, prog, win, goldAt, tailIn, hiOn, hiSize, exitFirst, ATP,
} from "./cs_lib";
/** fix loop 1 (r8 review 2 S5): a "from" bearing (degrees clockwise from north) as a 16-point compass name */
const COMPASS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];   // lint-ok: compass point names, not maths letters
const compass = (deg: number) => COMPASS[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
import { EQ_S26, EQ_S26M, EQ_S26W, EQ_S27, cutAt } from "./cs_eq";

type Shown = { dy: number; dx: number; tan: number; beta: number; bearing: number; alpha: number; alpha_raw: number; cos: number; sin: number; u: number; v: number;
  al_terms: number[]; along: number; ac_terms: number[]; across: number; sq: number; root: number; speed: number };
const SH = D.shore as Record<string, any>;  // eslint-disable-line @typescript-eslint/no-explicit-any
const FS = SH.fmb.shown as Shown, SP = SH.stp.shown as Shown;
const EVS = { amphan: SH.amphan.shown as Shown, nargis: SH.nargis.shown as Shown, idai: SH.idai.shown as Shown };
// ---------------------------------------------------------------- numbers on screen = the data (the render fails otherwise)
const r1 = (x: number) => Math.round(x * 10) / 10;
const CHECK_D: [string, number, number, number][] = [
  ["fmb legs", FS.dy, 91.5, 0], ["fmb legs W", -FS.dx, 55.0, 0], ["fmb tan", FS.tan, 0.601, 0], ["fmb beta", FS.beta, 31, 0], ["fmb brg", FS.bearing, 329, 0], ["fmb alpha", FS.alpha, 121, 0],
  ["fmb along", FS.along, 9.4, 1e-9], ["fmb across", FS.across, -31.5, 1e-9], ["fmb along sum", r1(FS.al_terms[0] + FS.al_terms[1]), FS.along, 1e-9],
  ["fmb across sum", r1(FS.ac_terms[0] + FS.ac_terms[1]), FS.across, 1e-9], ["fmb lib across", SH.fmb.wind.across, FS.across, 0.15], ["fmb sq", FS.sq, Math.round(FS.along ** 2 + FS.across ** 2), 0],
  ["stp across", SP.across, 12.1, 1e-9], ["stp along", SP.along, -14.7, 1e-9], ["stp lib across", SH.stp.wind.across, SP.across, 0.15], ["stp alpha", SP.alpha, 97, 0],
  ["ian ib", SH.ian_ib.deficit, 72, 0], ["ian hpa", SH.ian_ib.hpa, 941, 0], ["fm res", CST.gauges["8725520"].ext, 2.2, 0.01], ["stp res", CST.gauges["8726520"].ext, -1.8, 0.05],
  ...(["amphan", "nargis", "idai"] as const).flatMap((n) => [[`${n} across sum`, r1(EVS[n].ac_terms[0] + EVS[n].ac_terms[1]), EVS[n].across, 1e-9],
    [`${n} lib`, SH[n].hour.across, EVS[n].across, 0.15], [`${n} alpha`, EVS[n].alpha, (90 - EVS[n].bearing + 360) % 360, 0]] as [string, number, number, number][]),
];
CHECK_D.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

const MX = 1100;
/** TeX number: one decimal (or d), a real minus; in brackets when negative (a factor) */
const tn = (x: number, d = 1, br = false) => { const s = `${x < 0 ? "-" : ""}${Math.abs(x).toFixed(d)}`; return br && x < 0 ? `(${s})` : s; };
const unitV = (a: number): Pt => [Math.cos(a * D2R), -Math.sin(a * D2R)];
const add = (p: Pt, d: Pt, s: number): Pt => [p[0] + d[0] * s, p[1] + d[1] * s];
const ACROSS_C = (v: number) => (v < 0 ? C.neg : C.first);   // across: rose = onto the land (−), teal = out to sea (+)
const ALONG_C = C.local;                                       // along: slate

// ================================================================ s26 Part 1's turned axes, recalled and applied to the wind (B1)
const CB = CST.box as number[];
const coastMapB = (latC: number, lonC: number, dlat: number): MapBox => boxAt(latC, lonC, dlat, 80, 50, 920, 750);
const IanMap: React.FC<{ P: (la: number, lo: number) => Pt; f: number; speed?: boolean; arrows?: number }> = ({ P, f, speed = true, arrows = 0.75 }) => <>
  {speed ? <GeoImg P={P} href={IMG("cst_ian_speed_20.png")} box={CB} o={0.95} /> : null}
  <path d={linesPath(P, CST.coast)} fill="none" stroke={C.key} strokeWidth={2.5} />
  {arrows > 0 ? (CST.arrows as number[][]).map(([la, lo, u, v], i) => { const q = P(la, lo), s2 = 2.0;
    return <AnimatedWindArrow key={i} from={q} to={[q[0] + u * s2, q[1] - v * s2]} speed={Math.hypot(u, v)} f={f} c={C.ink} px={4} head={16} o={arrows} />; }) : null}
</>;
const S26: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26_coast_axes");
  const t1 = SS(k, 1), t2 = SS(k, 2), tTurn = SS(k, 3), tAl = SS(k, 4), tHat = SS(k, 5), tDer = SS(k, 6), tMat = SS(k, 7), tWind = SS(k, 8), tForm = SS(k, 9),
    tCoast = SS(k, 10), tSign = SS(k, 11), tKey = SS(k, 12);
  const B = coastMapB(26.75, -82.2, 1.4), P = mapP(B), fm = P(CST.fmb[0], CST.fmb[1]), u = CST.uF as number[];
  const oMap = fout(f, tTurn + 6, 20), oDia = fin(f, tTurn + 30, 20);
  // the Part 1 diagram (α = 30°, as in Part 1): east / north axes, the turned axes, the arc
  const O: Pt = [520, 470], A = 30, L = 170;
  const xh = add(O, unitV(A), L), yh = add(O, unitV(A + 90), L);
  const wA = 62, wL = 300, W = add(O, unitV(wA), wL);
  const alL = wL * Math.cos((wA - A) * D2R), acL = wL * Math.sin((wA - A) * D2R);
  const Pal = add(O, unitV(A), alL), Pac = add(O, unitV(A + 90), acL);
  const sea = [add(add(O, unitV(A), -360), unitV(A + 90), 0), add(add(O, unitV(A), 360), unitV(A + 90), 0), add(add(O, unitV(A), 360), unitV(A + 90), 230), add(add(O, unitV(A), -360), unitV(A + 90), 230)];
  const land = [add(add(O, unitV(A), -360), unitV(A + 90), 0), add(add(O, unitV(A), 360), unitV(A + 90), 0), add(add(O, unitV(A), 360), unitV(A + 90), -230), add(add(O, unitV(A), -360), unitV(A + 90), -230)];
  const poly = (q: Pt[]) => q.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("") + "Z";
  const [x1, x2] = cutAt(EQ_S26, String.raw`,\qquad `), [w1, w2] = cutAt(EQ_S26W, String.raw`,\qquad `);
  return (
    <Scene>
      <GeoMap id="s26m" B={B} o={oMap}>{(Pp) => <IanMap P={Pp} f={f} />}</GeoMap>
      <Svg o={oMap}>
        {/* fix loop 1 (r8 review 1 S3): 38 px further left, clear of the orange "along" arrow (it crossed the "h") */}
        <Place p={fm} t="Fort Myers Beach" dx={-58} dy={-44} a="end" />
        <AnimatedWindArrow from={fm} to={[fm[0] + u[0] * 6, fm[1] - u[1] * 6]} speed={CST.spF} f={f} c={C.ink} px={10} head={36} />
        <g opacity={fin(f, t2)}>
          <Arrow p={fm} q={add(fm, unitV(121), 170)} color={C.second} w={8} head={28} />
          <Arrow p={fm} q={add(fm, unitV(211), 150)} color={C.second} w={8} head={28} />
          <Lbl x={add(fm, unitV(121), 190)[0]} y={add(fm, unitV(121), 190)[1] - 10} t="along" c={C.second} s={T.floor} a="end" />
          <Lbl x={add(fm, unitV(211), 170)[0]} y={add(fm, unitV(211), 170)[1] + 44} t="across" c={C.second} s={T.floor} a="middle" />
        </g>
      </Svg>
      <Svg o={oDia}>
        <clipPath id="s26dia"><rect x={80} y={40} width={920} height={800} /></clipPath>
        <path d={poly(sea)} fill="#2b4f7a" opacity={0.35 * fin(f, tCoast)} clipPath="url(#s26dia)" />
        <path d={poly(land)} fill="#6b5a3e" opacity={0.35 * fin(f, tCoast)} clipPath="url(#s26dia)" />
        <g opacity={fout(f, tCoast - 20)}><line x1={O[0] - 330} y1={O[1]} x2={O[0] + 330} y2={O[1]} stroke={C.muted} strokeWidth={4} />
        <line x1={O[0]} y1={O[1] + 330} x2={O[0]} y2={O[1] - 330} stroke={C.muted} strokeWidth={4} />
        <Lbl x={O[0] + 340} y={O[1] + 50} t="$x$ (east)" c={C.muted} s={T.floor} a="end" />
        <Lbl x={O[0] - 20} y={O[1] - 340} t="$y$ (north)" c={C.muted} s={T.floor} a="end" /></g>
        <line x1={add(O, unitV(A), -420)[0]} y1={add(O, unitV(A), -420)[1]} x2={add(O, unitV(A), 420)[0]} y2={add(O, unitV(A), 420)[1]} stroke={C.key} strokeWidth={5} opacity={fin(f, tCoast)} />
        <Lbl x={add(add(O, unitV(A), -110), unitV(A + 90), 120)[0]} y={add(add(O, unitV(A), -110), unitV(A + 90), 120)[1]} t="sea" c="#8db5e2" s={T.key} a="middle" o={fin(f, tCoast)} />
        <Lbl x={add(add(O, unitV(A), 110), unitV(A + 90), -120)[0]} y={add(add(O, unitV(A), 110), unitV(A + 90), -120)[1]} t="land" c="#c9b48a" s={T.key} a="middle" o={fin(f, tCoast)} />
        <Arrow p={O} q={xh} color={C.second} w={10} head={38} o={fin(f, tHat)} />
        <Arrow p={O} q={yh} color={C.second} w={10} head={38} o={fin(f, tHat + 20)} />
        <Lbl x={xh[0] + 16} y={xh[1] + 6} t="$\hat{\mathbf x}'$" c={C.second} s={T.key} o={fin(f, tHat)} />
        <Lbl x={yh[0] - 20} y={yh[1] - 10} t="$\hat{\mathbf y}'$" c={C.second} s={T.key} a="end" o={fin(f, tHat + 20)} />
        <path d={arcD(O, 110, 0, A)} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tAl)} />
        <Lbl x={add(O, unitV(A / 2), 140)[0]} y={add(O, unitV(A / 2), 140)[1]} t="$\alpha$" c={C.gold} s={T.key} o={fin(f, tAl)} />
        {/* the wind (u, v) and its two parts in the turned axes (S8-S9) */}
        {/* fix loop 1 (swap_check now covers cs_sD): the s26 swaps get >= 8 frames of gap */}
        <g opacity={win(f, tWind, tCoast - 20)}>
          <AnimatedWindArrow from={O} to={W} speed={20} f={f} c={C.ink} px={10} head={36} />
          <Lbl x={W[0] + 14} y={W[1] - 16} t="wind $(u,\ v)$" c={C.ink} s={T.floor} />
          <line x1={W[0]} y1={W[1]} x2={Pal[0]} y2={Pal[1]} stroke={C.muted} strokeWidth={3} strokeDasharray="10 8" opacity={fin(f, tForm)} />
          <line x1={W[0]} y1={W[1]} x2={Pac[0]} y2={Pac[1]} stroke={C.muted} strokeWidth={3} strokeDasharray="10 8" opacity={fin(f, tForm)} />
          <Arrow p={O} q={Pal} color={ALONG_C} w={12} head={36} o={fin(f, AT(k, 9, "along the shore"))} />
          <Arrow p={O} q={Pac} color={C.first} w={12} head={36} o={fin(f, AT(k, 9, "across the shore"))} />
          <Lbl x={add(Pal, unitV(A - 90), 46)[0]} y={add(Pal, unitV(A - 90), 46)[1]} t="along" c={ALONG_C} s={T.floor} o={fin(f, AT(k, 9, "along the shore"))} />
          <Lbl x={Pac[0] - 30} y={Pac[1] + 56} t="across" c={C.first} s={T.floor} a="end" o={fin(f, AT(k, 9, "across the shore"))} />
        </g>
        <g opacity={fin(f, tSign)}>
          <Arrow p={add(O, unitV(A), -280)} q={add(add(O, unitV(A), -280), unitV(A + 90), 170)} color={C.first} w={10} head={34} />
          <Arrow p={add(O, unitV(A), 280)} q={add(add(O, unitV(A), 280), unitV(A + 90), -170)} color={C.neg} w={10} head={34} dash="16 10" />
          <Lbl x={add(add(O, unitV(A), -280), unitV(A + 90), 190)[0] - 16} y={add(add(O, unitV(A), -280), unitV(A + 90), 190)[1] - 10} t="+" c={C.first} s={T.key} a="end" />
          <Lbl x={add(add(O, unitV(A), 280), unitV(A + 90), -190)[0] + 14} y={add(add(O, unitV(A), 280), unitV(A + 90), -190)[1] + 30} t="−" c={C.neg} s={T.key} />
        </g>
      </Svg>
      <Svg>
        <Keyword f={f} text="back to the coast" at={[MX, 120]} s={T.key} appear={0} out={t2 - 20} />
        <Keyword f={f} text="along the shore · across the shore" at={[MX, 120]} s={T.floor} appear={t2} out={tTurn - 20} />
        <Lbl x={MX} y={210} t="east, north: not the most useful" c={C.key} s={T.floor} o={win(f, t1, tTurn - 20)} />
        <Keyword f={f} text="turned axes" at={[MX, 120]} s={T.key} appear={tTurn} out={tKey - 20} />
        <Keyword f={f} text="everything hangs on $\alpha$" at={[MX, 120]} s={T.key} c={C.gold} appear={tKey} />
        <Lbl x={MX} y={210} t="$\alpha$: anticlockwise from east" c={C.key} s={T.floor} o={win(f, tAl, tWind - 20)} />
        <Lbl x={MX} y={210} t="$x,\ y\ \to\ u,\ v$ (east, north)" c={C.key} s={T.floor} o={win(f, tWind, tKey - 20)} />
        <Lbl x={MX} y={700} t="$\hat{\mathbf x}'$ along the coast, $\hat{\mathbf y}'$ out to sea" c={C.key} s={T.floor} o={fin(f, tCoast)} />
        <Lbl x={MX} y={765} t="across > 0: out to sea" c={C.first} s={T.floor} o={fin(f, tSign)} />
        <Lbl x={MX} y={825} t="across < 0: onto the land" c={C.neg} s={T.floor} o={fin(f, AT(k, 11, "negative"))} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf x}'=(\cos\alpha,\ \sin\alpha)`} x={MX} y={300} size={54} c={C.second} o={win(f, tHat, tMat - 20)} />
      <TeX s={String.raw`\hat{\mathbf y}'=(-\sin\alpha,\ \cos\alpha)`} x={MX} y={375} size={54} c={C.second} o={win(f, tHat + 20, tMat - 20)} />
      <TeX s={EQ_S26M} x={MX} y={340} size={50} o={win(f, tMat, tForm - 12)} />
      <TeX s={x1} x={MX} y={470} size={54} o={fin(f, tDer)} />
      <Recall f={f} tex={x2} name="turned axes" x={MX} y={540} appear={AT(k, 6, "and y prime")} />
      <TeX s={w1} x={MX} y={300} size={52} c={ALONG_C} o={fin(f, AT(k, 9, "along the shore"))} />
      <TeX s={w2} x={MX} y={375} size={52} c={C.first} o={fin(f, AT(k, 9, "across the shore"))} />
      <SourceBelow text={SRC.hrrr20} pic={B} w={1400} o={oMap} name="s26 src" />
      <Svg o={oMap}><SpeedBar x={MX} y={790} w={300} hi={50} /><Lbl x={MX} y={50} t="Hurricane Ian · 28 Sep 2022" c={C.ink} s={T.floor} /></Svg>{/* fix 1b (user 2026-11-08): the event heading at the top of the right column, level with the picture's top */}
    </Scene>
  );
};

// ================================================================ s27 the coast's angle on a local flat km map (B2)
const KM_DEG = (6371 * Math.PI) / 180;
const kmLL = (o: number[], latM: number, x: number, y: number): [number, number] => [o[0] + y / KM_DEG, o[1] + x / (KM_DEG * Math.cos(latM * D2R))];
const S27: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27_coast_angle");
  const tMap = SS(k, 1), tLegs = SS(k, 2), tTan = SS(k, 3), tAng = SS(k, 4), tBrg = SS(k, 5), tP1 = SS(k, 6), tAl = SS(k, 7), tCos = SS(k, 8), tXh = SS(k, 9), tYh = SS(k, 10), tWhy = SS(k, 11);
  const B = coastMapB(26.55, -82.13, 1.35), P = mapP(B);
  const KM = SH.kmmap, o0 = KM.origin as number[], latM = KM.lat_mean as number;
  const Np = P(o0[0], o0[1]), Ep = P(SH.fmb.B[0], SH.fmb.B[1]);
  const corner = P(...kmLL(o0, latM, 0, FS.dy));
  const fm = P(CST.fmb[0], CST.fmb[1]);
  const xs = [-125, -100, -75, -50, -25, 0, 25], ys = [-25, 0, 25, 50, 75, 100, 125];
  const aC = Math.atan2(-(Ep[1] - Np[1]), Ep[0] - Np[0]) / D2R;   // the coast direction, anticlockwise from east on screen (north = 90°)
  // fix loop 1 (r8 review 2 S1, S6, S7, S9): every number on its spoken word; inputs and the answer gold; the arc labelled beta
  const t915 = AT(k, 2, "ninety one point five"), t55 = AT(k, 2, "fifty five kilometres"), tTg = AT(k, 3, "whose tangent"), tBeta = AT(k, 3, "by an angle"),
    t601 = AT(k, 4, "zero point six zero one"), t31 = AT(k, 4, "thirty one degrees"), tCB = AT(k, 5, "a compass bearing"), t329 = AT(k, 5, "three hundred and twenty nine"),
    tNeg = AT(k, 7, "comes out negative"), tFull = AT(k, 7, "adding a full turn"), t121 = AT(k, 7, "a hundred and twenty one"),
    tCv = AT(k, 8, "minus zero point five one five"), tSn = AT(k, 8, "and its sine"), tSv = AT(k, 8, "zero point eight five seven");
  const bL = add(Np, unitV((90 + aC) / 2), 158);
  return (
    <Scene>
      <GeoMap id="s27m" B={B}>{(Pp) => <IanMap P={Pp} f={f} speed={false} arrows={0} />}</GeoMap>
      <Svg>
        {/* the local flat km grid, origin Naples (25-km lines) */}
        <g opacity={0.55 * fin(f, tMap)}>
          {xs.map((x) => { const a = P(...kmLL(o0, latM, x, -200)), b = P(...kmLL(o0, latM, x, 200));
            return <line key={`x${x}`} x1={a[0]} y1={Math.max(B.y, b[1])} x2={a[0]} y2={Math.min(B.y + B.h, a[1])} stroke={C.local} strokeWidth={x === 0 ? 3 : 1.5} />; })}
          {ys.map((y) => { const a = P(...kmLL(o0, latM, -300, y)), b = P(...kmLL(o0, latM, 200, y));
            return <line key={`y${y}`} x1={Math.max(B.x, a[0])} y1={a[1]} x2={Math.min(B.x + B.w, b[0])} y2={a[1]} stroke={C.local} strokeWidth={y === 0 ? 3 : 1.5} />; })}
        </g>
        <Lbl x={B.x + 20} y={B.y + 40} t="grid: 25 km" c={C.local} s={T.floor} o={fin(f, tMap)} />
        <line x1={Np[0]} y1={Np[1]} x2={Ep[0]} y2={Ep[1]} stroke={C.second} strokeWidth={6} opacity={fin(f, tMap)} />
        <Place p={Np} t="Naples" dx={24} dy={10} />
        <Place p={Ep} t="Englewood" dx={-24} dy={-30} a="end" />
        <g opacity={fin(f, tLegs)}>
          <line x1={Np[0]} y1={Np[1]} x2={corner[0]} y2={corner[1]} stroke={C.ink} strokeWidth={5} strokeDasharray="14 9" />
          <line x1={corner[0]} y1={corner[1]} x2={Ep[0]} y2={Ep[1]} stroke={C.ink} strokeWidth={5} strokeDasharray="14 9" />
          <Lbl x={Np[0] + 20} y={(Np[1] + corner[1]) / 2} t={`${FS.dy.toFixed(1)} km N`} c={C.ink} s={T.floor} o={fin(f, t915)} />
          <Lbl x={(corner[0] + Ep[0]) / 2} y={corner[1] - 46} t={`${(-FS.dx).toFixed(1)} km W`} c={C.ink} s={T.floor} a="middle" o={fin(f, t55)} />
        </g>
        <path d={arcD(Np, 120, 90, aC)} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tTan)} />
        <Lbl x={bL[0]} y={bL[1]} t="$\beta$" c={C.gold} s={T.key} a="middle" o={fin(f, tBeta)} />
        <g opacity={fin(f, tXh)}>
          <Arrow p={fm} q={add(fm, unitV(FS.alpha), 150)} color={C.second} w={9} head={32} />
          <Lbl x={add(fm, unitV(FS.alpha), 170)[0] + 40} y={add(fm, unitV(FS.alpha), 170)[1] - 10} t="$\hat{\mathbf x}'$" c={C.second} s={T.key} />
        </g>
        <g opacity={fin(f, tYh)}>
          <Arrow p={fm} q={add(fm, unitV(FS.alpha + 90), 150)} color={C.second} w={9} head={32} />
          <Lbl x={add(fm, unitV(FS.alpha + 90), 170)[0] - 10} y={add(fm, unitV(FS.alpha + 90), 170)[1] + 40} t="$\hat{\mathbf y}'$" c={C.second} s={T.key} a="end" />
          <Lbl x={B.x + 40} y={B.y + B.h - 60} t="Gulf of Mexico" c="#8db5e2" s={T.floor} />
        </g>
        <Keyword f={f} text="which way does the coast run?" at={[MX, 120]} s={T.floor} appear={0} out={tP1 - 20} />
        <Keyword f={f} text="the maths angle $\alpha$" at={[MX, 120]} s={T.key} appear={tP1} out={tWhy - 20} />
        <Keyword f={f} text="$\hat{\mathbf y}'$ must point out to sea" at={[MX, 120]} s={T.key} c={C.gold} appear={tWhy} />
        <Lbl x={MX} y={365} t="so $\alpha = 90^\circ -$ bearing" c={C.key} s={T.floor} o={win(f, AT(k, 6, "so the maths angle"), tAl - 10)} />
      </Svg>
      <CalcStack f={f} x={MX} y={230} size={50} maxLines={4} o={fout(f, tP1 - 10)} rows={[
        { rhs: String.raw`\text{north}\ ${FS.dy.toFixed(1)}\ \mathrm{km}` + tailIn(f, t55, C.ink, String.raw`,\quad \text{west}\ ${(-FS.dx).toFixed(1)}\ \mathrm{km}`), at: t915, size: 46 },
        { rhs: String.raw`\tan\beta=\dfrac{\text{opposite}}{\text{adjacent}}=\dfrac{${(-FS.dx).toFixed(1)}}{${FS.dy.toFixed(1)}}`, at: tTg, size: 46 },
        { rhs: String.raw`\approx${FS.tan.toFixed(3)}` + tailIn(f, t31, C.ink, String.raw`\ \Rightarrow\ \beta\approx${FS.beta}^\circ`), at: t601, size: 46 },
        { rhs: String.raw`\text{bearing}=360^\circ-${FS.beta}^\circ` + tailIn(f, t329, C.ink, String.raw`=${FS.bearing}^\circ`), at: tCB, size: 46 },
      ]} />
      <Recall f={f} tex={EQ_S27} name="bearings" x={MX} y={235} appear={tP1} out={tAl - 10} />
      <CalcStack f={f} x={MX} y={230} size={46} maxLines={4} o={fin(f, tAl)} rows={[
        { rhs: String.raw`\alpha=90^\circ-${FS.bearing}^\circ` + tailIn(f, tNeg, C.ink, String.raw`=${FS.alpha_raw}^\circ`), at: tAl },
        // fix loop 1 (review 1 S8): gold text on the word (the drop-shadow glow was too faint to see)
        { rhs: String.raw`\alpha=${FS.alpha_raw}^\circ+360^\circ` + tailIn(f, t121, C.ink, String.raw`=${FS.alpha}^\circ`, true), at: tFull },
        { rhs: String.raw`\cos${FS.alpha}^\circ\approx${goldAt(f, tCv, tn(FS.cos, 3))}`, at: tCv - 8 },
        { rhs: String.raw`\sin${FS.alpha}^\circ\approx${goldAt(f, tSv, tn(FS.sin, 3))}`, at: tSv - 8, cont: true },
        { rhs: String.raw`\hat{\mathbf x}'\approx(${tn(FS.cos, 3)},\ ${tn(FS.sin, 3)})\ \text{NNW}`, at: tXh, c: C.second },
        { rhs: String.raw`\hat{\mathbf y}'\approx(${tn(-FS.sin, 3)},\ ${tn(FS.cos, 3)})\ \text{WSW}`, at: tYh, c: C.second },
      ]} />
      <SourceBelow text="Coast: Natural Earth · local flat map in km (origin Naples)" pic={B} w={1400} name="s27 src" />
    </Scene>
  );
};

// ================================================================ s28 Fort Myers Beach: onto the land (B3)
const S28: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28_fmb_calc");
  const tWind = SS(k, 1), tUV = SS(k, 2), tAlF = SS(k, 3), tAlR = SS(k, 4), tAcF = SS(k, 5), tAcR = SS(k, 6), tMin = SS(k, 7), tSo = SS(k, 8), tChk = SS(k, 9);
  const B = coastMapB(26.55, -82.13, 1.35), P = mapP(B), fm = P(CST.fmb[0], CST.fmb[1]);
  const s = 6.5, a = FS.alpha;
  const W = add(fm, [FS.u / Math.hypot(FS.u, FS.v), -FS.v / Math.hypot(FS.u, FS.v)], s * FS.speed);
  const Pal = add(fm, unitV(a), s * FS.along), Pac = add(fm, unitV(a + 90), s * FS.across);
  // fix loop 1 (r8 review 1 S8, review 2 S6, S7): inputs gold on their words (33 m/s, u, v, cos α, sin α), results on their words, the
  // answer (across) gold
  const t33 = AT(k, 1, "thirty three metres"), tU = AT(k, 2, "twenty two point two"), tV = AT(k, 2, "twenty four point three"),
    tCv = AT(k, 3, "minus zero point five one five"), tSv = AT(k, 3, "zero point eight five seven"), t94 = AT(k, 4, "nine point four"),
    t315 = AT(k, 6, "minus thirty one point five"), t329 = AT(k, 9, "thirty two point nine");
  return (
    <Scene>
      <GeoMap id="s28m" B={B}>{(Pp) => <IanMap P={Pp} f={f} arrows={0.45} />}</GeoMap>
      <Svg>
        <Place p={fm} t="Fort Myers Beach" dx={-24} dy={60} a="end" />
        <Arrow p={fm} q={add(fm, unitV(a), 110)} color={C.second} w={6} head={24} o={0.8} />
        <Arrow p={fm} q={add(fm, unitV(a + 90), 110)} color={C.second} w={6} head={24} o={0.8} />
        <Lbl x={W[0] - 20} y={W[1] - 24} a="end" t={`wind ≈ ${Math.round(FS.speed)} m/s`} c={C.ink} s={T.floor} o={fin(f, t33)} />
        <AnimatedWindArrow from={fm} to={W} speed={FS.speed} f={f} c={C.ink} px={10} head={36} o={fin(f, tWind)} />
        <g opacity={fin(f, tAlR)}>
          <AnimatedWindArrow from={fm} to={Pal} speed={Math.abs(FS.along)} f={f} c={ALONG_C} px={12} head={34} />
          {/* fix loop 1 (r8 review 1 S3): left of the arrowhead with a gap (it touched the label) */}
          <Lbl x={Pal[0] - 50} y={Pal[1] + 6} t={`along ${nf(FS.along, 1)}`} c={ALONG_C} s={T.floor} a="end" o={fin(f, t94)} />
        </g>
        <g opacity={fin(f, tAcR)}>
          <AnimatedWindArrow from={fm} to={Pac} speed={Math.abs(FS.across)} f={f} c={ACROSS_C(FS.across)} px={12} head={34} />
          <Lbl x={fm[0] - 24} y={fm[1] + 112} t={`across ${nf(FS.across, 1)}`} c={hiOn(f, t315) ? C.gold : ACROSS_C(FS.across)} s={T.floor} a="end" o={fin(f, t315)} />
        </g>
        <Lbl x={fm[0] + 10} y={fm[1] + 230} t="onto the land" c={C.neg} s={T.floor} o={fin(f, tMin)} />
        <Keyword f={f} text="now the wind" at={[MX, 120]} s={T.key} appear={0} out={tWind - 20} />
        <Keyword f={f} text="Fort Myers Beach · 20 UTC" at={[MX, 120]} s={T.floor} appear={tWind} out={tMin - 20} />
        <Keyword f={f} text="minus: onto the land" at={[MX, 120]} s={T.key} c={C.neg} appear={tMin} out={tSo - 20} />
        <Keyword f={f} text={`≈ ${Math.abs(FS.across).toFixed(1)} onto the land, ≈ ${FS.along.toFixed(1)} along`} at={[MX, 120]} s={T.floor} c={C.neg} appear={tSo} out={tChk - 20} />
        <Keyword f={f} text="check: the same wind" at={[MX, 120]} s={T.key} appear={tChk} />
        <Lbl x={MX} y={198} t={`≈ ${Math.round(FS.speed)} m/s from the ${compass(CST.fromF)}`} c={hiOn(f, t33) ? C.gold : C.ink} s={hiSize(f, t33, T.floor)} o={win(f, t33, tUV - 10)} />
      </Svg>
      <TeX s={String.raw`u=${goldAt(f, tU, tn(FS.u))},\ v=${goldAt(f, tV, tn(FS.v))}\ \mathrm{m/s}\ (\text{east, north})`} x={MX} y={200} size={46} o={fin(f, tU - 8)} />
      <TeX s={String.raw`\cos${FS.alpha}^\circ\approx${goldAt(f, tCv, tn(FS.cos, 3))},\ \sin${FS.alpha}^\circ\approx${goldAt(f, tSv, tn(FS.sin, 3))}`} x={MX} y={262} size={44} c={C.second} o={fin(f, tCv - 8)} />
      {/* K6 look (k6y1): the substituted rows ran past 1842 with an lhs column: formula, numbers and result on three rows each */}
      <CalcStack f={f} x={MX} y={330} size={44} maxLines={3} o={fout(f, tChk - 10)} rows={[
        { rhs: String.raw`\text{along}=u\cos\alpha+v\sin\alpha`, at: tAlF, c: ALONG_C },
        { rhs: String.raw`=${tn(FS.u)}\times${tn(FS.cos, 3, true)}+${tn(FS.v)}\times${tn(FS.sin, 3)}`, at: AT(k, 3, "we multiply"), cont: true },
        { rhs: String.raw`\text{along}\approx${tn(FS.al_terms[0])}+${tn(FS.al_terms[1])}` + tailIn(f, t94, C.ink, String.raw`\approx${tn(FS.along)}\ \mathrm{m/s}`), at: tAlR, cont: true },
      ]} />
      <CalcStack f={f} x={MX} y={530} size={44} maxLines={3} o={fout(f, tChk - 10)} rows={[
        { rhs: String.raw`\text{across}=-u\sin\alpha+v\cos\alpha`, at: tAcF, c: C.neg },
        { rhs: String.raw`=-${tn(FS.u)}\times${tn(FS.sin, 3)}+${tn(FS.v)}\times${tn(FS.cos, 3, true)}`, at: AT(k, 5, "now u goes"), cont: true },
        { rhs: String.raw`\text{across}\approx${tn(FS.ac_terms[0])}${tn(FS.ac_terms[1])}` + tailIn(f, t315, C.ink, String.raw`\approx${tn(FS.across)}\ \mathrm{m/s}`, true), at: tAcR, cont: true },
      ]} />
      {/* fix loop 1 (r8 review 1 S1): the two radical rows 1.9 × size tall (the second row's bar ran through the first row's baseline) */}
      <CalcStack f={f} x={MX} y={350} size={46} maxLines={3} o={fin(f, tChk)} rows={[
        { rhs: String.raw`\text{speed}=\sqrt{\text{along}^2+\text{across}^2}`, at: tChk + 10, h: 46 * 1.9 },
        { rhs: String.raw`=\sqrt{${tn(FS.along)}^2+${tn(Math.abs(FS.across))}^2}=\sqrt{${FS.sq}}`, at: tChk + 24, cont: true, h: 46 * 1.9 },
        { rhs: String.raw`\text{speed}\approx` + tailIn(f, t329, C.ink, String.raw`${FS.root.toFixed(1)}\approx${Math.round(FS.speed)}\ \mathrm{m/s}`), at: AT(k, 9, "square root"), cont: true },
      ]} />
      <SourceBelow text={SRC.hrrr20} pic={B} w={1400} name="s28 src" />
      <Svg><SpeedBar x={MX} y={790} w={300} hi={50} /><Lbl x={MX} y={50} t="Hurricane Ian · 28 Sep 2022" c={C.ink} s={T.floor} /></Svg>{/* fix 1b (user 2026-11-08): the event heading at the top of the right column, level with the picture's top */}
    </Scene>
  );
};

// ================================================================ s29 Saint Petersburg: out to sea; the opposing arrows (B4)
const S29: React.FC = () => {
  const f = useCurrentFrame(), k = K("s29_stp_calc");
  const tCoast = SS(k, 1), tTan = SS(k, 2), tAl = SS(k, 3), tWind = SS(k, 4), tAc = SS(k, 5), tSum = SS(k, 6), tPlus = SS(k, 7), tAlong = SS(k, 8), tBoth = SS(k, 9);
  // fix loop 1 (r8 review 1 S3, S8, S10, S12; review 2 S3, S5, S6, S7, S10): "≈ 160 km" on screen; every number on its word; inputs gold
  // (cos α, sin α, the wind's speed and direction, u, v); cos / sin and u, v stay on screen while they are used; the along part gets its
  // formula and its two products, as the across part
  const t160 = AT(k, 0, "a hundred and sixty"), tLeg = AT(k, 1, "it moves about"), tRule = AT(k, 2, "west leg over north leg"), t7 = AT(k, 2, "seven degrees"),
    t353 = AT(k, 2, "three hundred and fifty three"), t97 = AT(k, 3, "ninety seven"), tCv = AT(k, 3, "minus zero point one two two"), tSv = AT(k, 3, "zero point nine nine three"),
    t19 = AT(k, 4, "nineteen metres"), tUa = AT(k, 4, "u about"), tU = AT(k, 4, "minus ten point two"), tV = AT(k, 4, "minus sixteen"),
    t121 = AT(k, 6, "plus twelve point one"), t147 = AT(k, 8, "minus fourteen point seven");
  const Bz = boxAt(27.85, -82.72, 1.0, 80, 50, 920, 750), Bf = boxAt(27.1, -82.4, 1.72, 80, 50, 920, 750);
  const B = lerpBox(Bz, Bf, prog(f, tBoth, tBoth + 50)), P = mapP(B);
  const sp = P(CST.stp[0], CST.stp[1]), fm = P(CST.fmb[0], CST.fmb[1]);
  const A0 = P(SH.stp.A[0], SH.stp.A[1]), B0 = P(SH.stp.B[0], SH.stp.B[1]);
  const zoom = 1 - prog(f, tBoth, tBoth + 50);
  const s = mix(6, 9, zoom), a = SP.alpha;
  const W = add(sp, [SP.u / Math.hypot(SP.u, SP.v), -SP.v / Math.hypot(SP.u, SP.v)], s * SP.speed);
  const Pal = add(sp, unitV(a), s * SP.along), Pac = add(sp, unitV(a + 90), s * SP.across), PacF = add(fm, unitV(FS.alpha + 90), s * FS.across);
  const oP2 = fin(f, tWind) * fout(f, tBoth - 10);
  return (
    <Scene>
      <GeoMap id="s29m" B={B}>{(Pp) => <IanMap P={Pp} f={f} arrows={0.45} />}</GeoMap>
      <Svg>
        <line x1={A0[0]} y1={A0[1]} x2={B0[0]} y2={B0[1]} stroke={C.second} strokeWidth={6} opacity={fin(f, tCoast) * zoom} />
        <Place p={sp} t="Saint Petersburg" dx={18} dy={-40} />
        <Place p={fm} t="Fort Myers Beach" dx={-20} dy={-44} a="end" o={fin(f, tBoth + 30)} />
        {/* fix loop 1 (r8 review 1 S3): the coast-leg names leave before the wind arrow comes in (its head sat on "Saint Pete Beach") */}
        <g opacity={fin(f, tCoast) * zoom * fout(f, tWind - 12)}>
          <Lbl x={A0[0] - 20} y={A0[1] + 46} t="Saint Pete Beach" c={C.key} s={T.floor} a="end" />
          <Lbl x={B0[0] - 20} y={B0[1] - 10} t="Tarpon Springs" c={C.key} s={T.floor} a="end" />
        </g>
        <AnimatedWindArrow from={sp} to={W} speed={SP.speed} f={f} c={C.ink} px={10} head={36} o={fin(f, tWind) * zoom} />
        <g opacity={fin(f, tAl) * zoom}>
          <Arrow p={sp} q={add(sp, unitV(a), 100)} color={C.second} w={6} head={24} o={0.8} />
          <Arrow p={sp} q={add(sp, unitV(a + 90), 100)} color={C.second} w={6} head={24} o={0.8} />
        </g>
        <g opacity={fin(f, tSum)}>
          <AnimatedWindArrow from={sp} to={Pac} speed={Math.abs(SP.across)} f={f} c={ACROSS_C(SP.across)} px={12} head={34} />
          <Lbl x={Pac[0] - 12} y={Pac[1] + 50} t={`across ${nf(SP.across, 1, true)}`} c={hiOn(f, t121) ? C.gold : ACROSS_C(SP.across)} s={T.floor} a="end" o={fin(f, t121)} />
        </g>
        <g opacity={fin(f, tAlong) * zoom}>
          <AnimatedWindArrow from={sp} to={Pal} speed={Math.abs(SP.along)} f={f} c={ALONG_C} px={12} head={34} />
          <Lbl x={Pal[0] + 16} y={Pal[1]} t={`along ${nf(SP.along, 1)}`} c={ALONG_C} s={T.floor} o={fin(f, t147)} />
        </g>
        <g opacity={fin(f, tBoth + 30)}>
          <AnimatedWindArrow from={fm} to={PacF} speed={Math.abs(FS.across)} f={f} c={ACROSS_C(FS.across)} px={12} head={34} />
          <Lbl x={fm[0] - 20} y={fm[1] + 54} t={`across ${nf(FS.across, 1)}`} c={ACROSS_C(FS.across)} s={T.floor} a="end" />
        </g>
        <Keyword f={f} text={`Saint Petersburg: ≈ ${Math.round(CST.d_fs / 10) * 10} km N`} at={[MX, 120]} s={T.floor} appear={t160 - 4} out={tCoast - 20} />
        <Keyword f={f} text="Saint Petersburg · 20 UTC" at={[MX, 120]} s={T.floor} appear={tCoast} out={tPlus - 20} />
        <Keyword f={f} text="plus: out to sea" at={[MX, 120]} s={T.key} c={C.first} appear={tPlus} out={tBoth - 20} />
        <Keyword f={f} text="opposite sides of the eye" at={[MX, 120]} s={T.floor} c={C.gold} appear={tBoth} />
        <Lbl x={MX} y={230} t="Fort Myers Beach: onto the land" c={C.neg} s={T.floor} o={fin(f, AT(k, 9, "Fort Myers Beach"))} />
        <Lbl x={MX} y={300} t="Saint Petersburg: out to sea" c={C.first} s={T.floor} o={fin(f, AT(k, 9, "at Saint Petersburg"))} />
        <Lbl x={MX} y={198} t={`≈ ${Math.round(SP.speed)} m/s from the ${compass(SH.stp.wind.from_deg)}`} c={hiOn(f, t19) ? C.gold : C.ink} s={hiSize(f, t19, T.floor)}
          o={win(f, t19, tBoth - 20)} />
      </Svg>
      <CalcStack f={f} x={MX} y={230} size={44} maxLines={5} o={fout(f, tWind - 10)} rows={[
        { rhs: String.raw`\text{north}\ ${SP.dy.toFixed(1)}\ \mathrm{km},\quad \text{west}\ ${(-SP.dx).toFixed(1)}\ \mathrm{km}`, at: tLeg },
        { rhs: String.raw`\tan\beta=\dfrac{${(-SP.dx).toFixed(1)}}{${SP.dy.toFixed(1)}}` + tailIn(f, t7, C.ink, String.raw`\approx${SP.tan.toFixed(3)}\ \Rightarrow\ \beta\approx${SP.beta}^\circ`), at: tRule },
        { rhs: String.raw`\text{bearing}\approx${SP.bearing}^\circ`, at: t353, cont: true },
        { rhs: String.raw`\alpha=90^\circ-${SP.bearing}^\circ+360^\circ` + tailIn(f, t97, C.ink, String.raw`=${SP.alpha}^\circ`, true), at: tAl },
        { rhs: String.raw`\cos\alpha\approx${goldAt(f, tCv, tn(SP.cos, 3))},\quad \sin\alpha\approx${goldAt(f, tSv, tn(SP.sin, 3))}`, at: AT(k, 3, "with a cosine") },
      ]} />
      {/* the inputs stay on screen while the two parts are worked out */}
      <TeX s={String.raw`u=${goldAt(f, tU, tn(SP.u))},\ v=${goldAt(f, tV, tn(SP.v))}\ \mathrm{m/s}`} x={MX} y={262} size={46} o={fin(f, tU - 8) * oP2} />
      <TeX s={String.raw`\cos${SP.alpha}^\circ\approx${tn(SP.cos, 3)},\ \sin${SP.alpha}^\circ\approx${tn(SP.sin, 3)}`} x={MX} y={324} size={44} c={C.second} o={oP2} />
      <CalcStack f={f} x={MX} y={390} size={44} maxLines={4} o={fin(f, tAc) * fout(f, tAlong - 10)} rows={[
        { rhs: String.raw`\text{across}=-u\sin\alpha+v\cos\alpha`, at: tAc, c: C.first },
        { rhs: String.raw`-u\sin\alpha=-${tn(SP.u, 1, true)}\times${tn(SP.sin, 3)}\approx${tn(SP.ac_terms[0])}`, at: AT(k, 5, "minus u sine alpha") + 10, cont: true },
        { rhs: String.raw`v\cos\alpha=${tn(SP.v, 1, true)}\times${tn(SP.cos, 3, true)}\approx${tn(SP.ac_terms[1])}`, at: AT(k, 5, "and v cosine"), cont: true },
        { rhs: String.raw`\text{across}\approx${tn(SP.ac_terms[0])}+${tn(SP.ac_terms[1])}` + tailIn(f, t121, C.ink, String.raw`\approx+${tn(SP.across)}\ \mathrm{m/s}`, true), at: tSum, cont: true },
      ]} />
      <CalcStack f={f} x={MX} y={390} size={44} maxLines={4} o={fin(f, tAlong) * fout(f, tBoth - 10)} rows={[
        { rhs: String.raw`\text{along}=u\cos\alpha+v\sin\alpha`, at: tAlong, c: ALONG_C },
        { rhs: String.raw`u\cos\alpha=${tn(SP.u, 1, true)}\times${tn(SP.cos, 3, true)}\approx${tn(SP.al_terms[0])}`, at: tAlong + 14, cont: true },
        { rhs: String.raw`v\sin\alpha=${tn(SP.v, 1, true)}\times${tn(SP.sin, 3)}\approx${tn(SP.al_terms[1])}`, at: tAlong + 28, cont: true },
        { rhs: String.raw`\text{along}\approx${tn(SP.al_terms[0])}${tn(SP.al_terms[1])}` + tailIn(f, t147, C.ink, String.raw`\approx${tn(SP.along)}\ \mathrm{m/s}`), at: Math.min(tAlong + 42, t147 - 4), cont: true },
      ]} />
      <SourceBelow text={SRC.hrrr20} pic={{ x: 80, y: 50, w: 920, h: 750 }} w={1400} name="s29 src" />
      <Svg><SpeedBar x={MX} y={790} w={300} hi={50} /><Lbl x={MX} y={50} t="Hurricane Ian · 28 Sep 2022" c={C.ink} s={T.floor} /></Svg>{/* fix 1b (user 2026-11-08): the event heading at the top of the right column, level with the picture's top */}
    </Scene>
  );
};

// ================================================================ s30 the reasoning, before the evidence (B5)
const S30: React.FC = () => {
  const f = useCurrentFrame(), k = K("s30_onshore_piles");
  // fix loop 1 (r8 review 1 S5, review 2 S2): S6 is new (the inputs of 100 Pa / (ρ g), each gold on its word); S7 no longer reads the
  // subtraction aloud: 941 and the normal 1013 are said, the subtraction is shown on "so the sea", the rise (gold) on its word
  const tOn = SS(k, 1), tOff = SS(k, 2), tSurge = SS(k, 3), tShelf = SS(k, 4), tCm = SS(k, 5), tRho = SS(k, 6), tIan = SS(k, 7), tQ = SS(k, 8);
  const tPa = AT(k, 6, "a hundred pascals"), tDen = AT(k, 6, "one thousand and twenty five"), tG = AT(k, 6, "nine point eight one"),
    t941 = AT(k, 7, "nine hundred and forty one"), t1013 = AT(k, 7, "one thousand and thirteen"), tSea = AT(k, 7, "so the sea"), t72 = AT(k, 7, "seventy two centimetres");
  const panel = (y0: number, dir: 1 | -1, t0: number) => {
    const x0 = 120, x1 = 960, coast = 760, sea0 = y0 + 150;
    const r = prog(f, t0 + 10, t0 + 100) * 46 * dir;
    const surf = (x: number) => sea0 - r * ((x - x0) / (coast - x0));
    const top = Array.from({ length: 21 }, (_, i) => x0 + ((coast - x0) * i) / 20);
    const water = `M${x0} ${y0 + 260}` + top.map((x) => `L${x.toFixed(1)} ${surf(x).toFixed(1)}`).join("") + `L${coast} ${y0 + 260}Z`;
    return (
      <g opacity={fin(f, t0)}>
        <path d={water} fill="#2b5f93" opacity={0.75} />
        <path d={`M${coast - 60} ${y0 + 262} L${coast + 30} ${sea0 - 70} L${x1} ${sea0 - 90} L${x1} ${y0 + 262}Z`} fill="#6b5a3e" />
        <line x1={x0} y1={sea0} x2={coast} y2={sea0} stroke={C.key} strokeWidth={2} strokeDasharray="10 8" opacity={0.7} />
        {[0, 1, 2].map((i) => { const y = y0 + 40 + i * 30, xa = 200 + i * 120;
          return <AnimatedWindArrow key={i} from={dir > 0 ? [xa, y] : [xa + 200, y]} to={dir > 0 ? [xa + 200, y] : [xa, y]} speed={20} f={f} c={C.ink} px={7} head={26} />; })}
        <Lbl x={x1 - 10} y={y0 + 300} t="land" c="#c9b48a" s={T.floor} a="end" />
        <Lbl x={x0 + 10} y={y0 + 300} t="sea" c="#8db5e2" s={T.floor} />
        <Lbl x={coast - 140} y={y0 + 6} t={dir > 0 ? "water piles up" : "level drops"} c={C.gold} s={T.floor} o={fin(f, t0 + 60)} />
      </g>
    );
  };
  const sh = CST.shelf, SA: Ax = { x: 160, y: 200, w: 760, h: 400, xr: [0, 150], yr: [-80, 10] };
  const rise = prog(f, tShelf + 30, tShelf + 120);
  const oPan = fout(f, tShelf - 10), oShelf = win(f, tShelf, tQ - 10);
  const LB = boxAt(27.1, -82.4, 1.72, 220, 70, 640, 520), Pq = mapP(LB);
  return (
    <Scene>
      <Svg o={oPan}>
        {panel(80, 1, tOn)}
        {panel(470, -1, tOff)}
        <Lbl x={130} y={70} t="wind onto the land" c={C.key} s={T.floor} o={fin(f, tOn)} />
        <Lbl x={130} y={460} t="wind out to sea" c={C.key} s={T.floor} o={fin(f, tOff)} />
      </Svg>
      <Svg o={oShelf}>
        <Axes A={SA} xt={[0, 50, 100, 150]} yt={[-80, -40, 0]} xl="km from Fort Myers Beach (WSW)" yl="sea floor (m)" xf={(v) => `${v}`} />
        <Curve A={SA} xs={sh.km} ys={sh.z} c="#8a6f4e" w={6} />
        <rect x={SA.x} y={axP(SA)(0, 0)[1] - 40 * rise} width={SA.w} height={40 * rise + 2} fill="#7cc4ff" opacity={0.35} />
        <Lbl x={SA.x + 20} y={SA.y + SA.h + 150} t="wide and shallow: the water has nowhere to go but up" c={C.key} s={T.floor} o={fin(f, tShelf + 40)} />
        <Lbl x={SA.x + SA.w} y={axP(SA)(0, 0)[1] + 46} t="sea level (rise drawn $\times20$)" c="#7cc4ff" s={T.floor} a="end" o={fin(f, tShelf + 30)} />
      </Svg>
      <GeoMap id="s30m" B={LB} o={fin(f, tQ)}>{(Pp) => <IanMap P={Pp} f={f} speed={false} arrows={0} />}</GeoMap>
      <Svg o={fin(f, tQ)}>
        {[[CST.fmb, "Fort Myers Beach", -1], [CST.stp, "Saint Petersburg", 1]].map(([ll, nm, side], i) => { const q = Pq((ll as number[])[0], (ll as number[])[1]);
          return <g key={i}><Place p={q} t={nm as string} dx={(side as number) * 20} dy={-40} a={(side as number) < 0 ? "end" : "start"} />
            <Lbl x={q[0] + 30} y={q[1] + 50} t="?" c={C.gold} s={T.hero} o={fin(f, tQ + 20 + 20 * i)} /></g>; })}
      </Svg>
      <Svg>
        <Keyword f={f} text="wind drags the sea surface" at={[MX, 120]} s={T.floor} appear={0} out={tSurge - 20} />
        <Lbl x={MX} y={210} t="onto the land: the water piles up" c={C.key} s={T.floor} o={win(f, tOn + 20, tSurge - 20)} />
        <Lbl x={MX} y={270} t="out to sea: the level drops" c={C.key} s={T.floor} o={win(f, tOff + 20, tSurge - 20)} />
        <Keyword f={f} text="storm surge" at={[MX, 120]} s={T.key} appear={tSurge} out={tCm - 20} />
        <Lbl x={MX} y={210} t="far above the normal tide" c={C.key} s={T.floor} o={win(f, tSurge + 20, tCm - 20)} />
        <Lbl x={MX} y={270} t="the wind's push does most of it" c={C.key} s={T.floor} o={win(f, tShelf, tCm - 20)} />
        <Keyword f={f} text="low pressure: ≈ 1 cm per hPa" at={[MX, 120]} s={T.floor} c={C.local} appear={tCm} out={tQ - 20} />
        <Lbl x={MX} y={400} t={`Ian at landfall (19:05 UTC): ${SH.ian_ib.hpa} hPa`} c={hiOn(f, t941) ? C.gold : C.local} s={T.floor} o={win(f, t941 - 8, tQ - 10)} />
        <Lbl x={MX} y={470} t="1013 hPa: normal at sea level" c={hiOn(f, t1013) ? C.gold : C.local} s={hiSize(f, t1013, T.floor)} o={win(f, t1013 - 8, tQ - 10)} />
        <Keyword f={f} text="what did the water do?" at={[MX, 120]} s={T.key} c={C.gold} appear={tQ} />
      </Svg>
      {/* fix loop 1: the fraction on S6, each input gold on its word; the 1-cm result restated at the end (said in S5) */}
      <TeX s={String.raw`\dfrac{${goldAt(f, tPa, String.raw`100\ \mathrm{Pa}`)}}{${goldAt(f, tDen, String.raw`1025\ \mathrm{kg/m^3}`)}\times${goldAt(f, tG, String.raw`9.81\ \mathrm{m/s^2}`)}}` + tailIn(f, tG + 30, C.local, String.raw`\approx0.01\ \mathrm m`)}
        x={MX} y={250} size={44} c={C.local} o={win(f, AT(k, 6, "by dividing"), tQ - 10)} />
      <TeX s={String.raw`1013-${SH.ian_ib.hpa}=${SH.ian_ib.deficit}\ \mathrm{hPa}` + tailIn(f, t72, C.local, String.raw`\ \Rightarrow\ \text{rise}\approx${SH.ian_ib.cm_rule}\ \mathrm{cm}`, true)} x={MX} y={545} size={44} c={C.local} o={win(f, tSea, tQ - 10)} />
      <Svg o={oShelf}><Lbl x={MX} y={50} t="Sea floor off Fort Myers Beach" c={C.ink} s={T.floor} /></Svg>{/* fix 1b (user 2026-11-08): the event heading at the top of the right column, level with the picture's top */}
      <SourceBelow text="Sea floor: NOAA ETOPO 2022 · Ian's pressure: IBTrACS v04r01 (NHC best track)" pic={{ x: 120, y: 80, w: 840, h: 690 }} w={1400} o={oShelf} name="s30 src" />
      <SourceBelow text="Coast: Natural Earth" pic={LB} w={700} o={fin(f, tQ)} name="s30 src 2" />
    </Scene>
  );
};

// ================================================================ s31 the tide gauges: the answer (B6)
const GA = (x: number, y: number, w: number, h: number): Ax => ({ x, y, w, h, xr: [0, 36], yr: [-2.2, 2.6] });
const Gauges: React.FC<{ A: Ax; f: number; tF: number; tS: number }> = ({ A, f, tF, tS }) => {
  const G1 = CST.gauges["8725520"], G2 = CST.gauges["8726520"];
  const P = axP(A), pk = P(G1.ext_h, G1.ext), tr = P(G2.ext_h, G2.ext);
  return (
    <g>
      <Axes A={A} xt={[12, 24, 36]} yt={[-2, 0, 2]} xf={(v) => ["", "28 Sep", "12 UTC", "29 Sep"][v / 12]} yf={(v) => nf(v, 0, true)} zero yl="vs predicted tide (m)" />
      <line x1={P(CST.land_h, 0)[0]} y1={A.y} x2={P(CST.land_h, 0)[0]} y2={A.y + A.h} stroke={C.local} strokeWidth={3} strokeDasharray="10 8" />
      <Lbl x={P(CST.land_h, 0)[0] - 10} y={A.y + 26} t="landfall ≈ 19 UTC" c={C.local} s={T.floor} a="end" />
      <Curve A={A} xs={G1.h} ys={G1.res} c={C.second} w={6} upto={prog(f, tF, tF + 60)} />
      <Curve A={A} xs={G2.h} ys={G2.res} c="#8db5e2" w={6} dash="14 9" upto={prog(f, tS, tS + 60)} />
      <Lbl x={A.x + A.w + 16} y={pk[1] - 6} t={`≈ +${G1.ext.toFixed(1)} m`} c={C.second} s={T.floor} o={fin(f, tF + 50)} />{/* lint-ok: m is the unit metre */}
      <Lbl x={A.x + A.w + 16} y={pk[1] + 40} t="Fort Myers (upriver)" c={C.second} s={T.floor} o={fin(f, tF + 50)} />
      <Lbl x={A.x + A.w + 16} y={tr[1] - 44} t={`≈ ${nf(G2.ext, 1)} m`} c="#8db5e2" s={T.floor} o={fin(f, tS + 50)} />{/* lint-ok: m is the unit metre */}
      <Lbl x={A.x + A.w + 16} y={tr[1] + 2} t="Saint Petersburg" c="#8db5e2" s={T.floor} o={fin(f, tS + 50)} />
    </g>
  );
};
const S31: React.FC = () => {
  // user 2026-11-07: the water-level chart drawn like the original single coordinates movie (build 1, 41:00-41:20): the map with the
  // across-shore arrows on the left, the two gauge lines over 36 h on the right ("water above the normal tide (m)", the landfall marker,
  // the station legend), each line gold-linked to its station's across-shore arrow
  const f = useCurrentFrame(), k = K("s31_gauges");
  const tFM = SS(k, 1), tStP = SS(k, 2), tFlip = SS(k, 3), tNHC = SS(k, 4), tSat = SS(k, 5), tNo = SS(k, 6), tWhy = SS(k, 7), tMeas = SS(k, 8), tEk = SS(k, 9), tMore = SS(k, 10);
  const B = boxAt(27.1, -82.4, 1.72, 80, 50, 920, 750), P = mapP(B);
  const fmb = P(CST.fmb[0], CST.fmb[1]), sp = P(CST.stp[0], CST.stp[1]);
  const fmg = P(CST.gauges["8725520"].lat, CST.gauges["8725520"].lon);
  const s = 5.5;
  const aF = add(fmb, unitV(FS.alpha + 90), s * FS.across), aS = add(sp, unitV(SP.alpha + 90), s * SP.across);
  const A: Ax = { x: 1190, y: 230, w: 560, h: 300, xr: [0, 36], yr: [-2.2, 2.6] };
  const G1 = CST.gauges["8725520"], G2 = CST.gauges["8726520"], Pa = axP(A);
  const pk = Pa(G1.ext_h, G1.ext), tr = Pa(G2.ext_h, G2.ext);
  const oLeg = win(f, tFM, tNHC - 24) + fin(f, tSat + 12);
  return (
    <Scene>
      <GeoMap id="s31m" B={B}>{(Pp) => <IanMap P={Pp} f={f} speed={false} arrows={0} />}</GeoMap>
      <Svg>
        <Place p={fmb} t="Fort Myers Beach" dx={-20} dy={-44} a="end" />
        <Place p={fmg} t="Fort Myers gauge" dx={-24} dy={-34} a="end" r={9} c={C.neg} />
        <Place p={sp} t="Saint Petersburg" dx={22} dy={-40} c={C.first} />
        <AnimatedWindArrow from={fmb} to={aF} speed={Math.abs(FS.across)} f={f} c={C.neg} px={12} head={34} />
        <AnimatedWindArrow from={sp} to={aS} speed={SP.across} f={f} c={C.first} px={12} head={34} />
        <Lbl x={fmb[0] - 24} y={fmb[1] + 56} t={`across ${nf(FS.across, 1)}`} c={C.neg} s={T.floor} a="end" />
        <Lbl x={aS[0] - 14} y={aS[1] + 50} t={`across ${nf(SP.across, 1, true)}`} c={C.first} s={T.floor} a="end" />
        {/* the chart */}
        <Lbl x={A.x - 60} y={A.y - 44} t="water above the normal tide (m)" c={C.muted} s={T.floor} b={false} />
        <Axes A={A} xt={[0, 12, 24, 36]} yt={[-2, 0, 2]} xl="hours from 27 Sep, 12 UTC" yf={(v) => nf(v, 0, true)} zero />
        <line x1={Pa(CST.land_h, 0)[0]} y1={A.y} x2={Pa(CST.land_h, 0)[0]} y2={A.y + A.h} stroke={C.gold} strokeWidth={3} strokeDasharray="10 8" />
        <Lbl x={Pa(CST.land_h, 0)[0] - 10} y={Pa(0, 1.1)[1]} t="landfall" c={C.gold} s={T.floor} a="end" />
        <Curve A={A} xs={G1.h} ys={G1.res} c={C.neg} w={6} upto={prog(f, tFM, tFM + 60)} />
        <Curve A={A} xs={G2.h} ys={G2.res} c={C.first} w={6} upto={prog(f, tStP, tStP + 60)} />
        <Lbl x={pk[0] + 12} y={pk[1] + 30} t={`+${G1.ext.toFixed(1)}`} c={C.neg} s={T.floor} o={fin(f, AT(k, 1, "two point two") - 4)} />
        <Lbl x={tr[0] + 12} y={tr[1] - 30} t={nf(G2.ext, 1)} c={C.first} s={T.floor} o={fin(f, AT(k, 2, "one point eight") - 4)} />
        <g opacity={oLeg}>
          <Lbl x={A.x - 60} y={A.y + A.h + 160} t="Saint Petersburg gauge" c={C.first} s={T.floor} />
          <Lbl x={A.x - 60} y={A.y + A.h + 215} t="Fort Myers gauge (up the river)" c={C.neg} s={T.floor} />
        </g>
        {/* each gauge line (its legend entry) gold-linked to its station's across-shore arrow; the StP entry is above the FM one, so the
            two links never cross */}
        <CurvedLink f={f} from={[A.x - 74, A.y + A.h + 160]} to={[mix(sp[0], aS[0], 0.6), mix(sp[1], aS[1], 0.6) + 10]} start={tFlip + 12} end={tNHC - 24} bend={30} />
        <CurvedLink f={f} from={[A.x - 74, A.y + A.h + 215]} to={[mix(fmb[0], aF[0], 0.75) + 6, mix(fmb[1], aF[1], 0.75) + 12]} start={tFlip} end={tNHC - 24} bend={-20} />
        <Keyword f={f} text="the answer: tide gauges" at={[MX, 120]} s={T.key} appear={0} out={tFlip - 20} />
        <Keyword f={f} text="wind flipped, water flipped" at={[MX, 120]} s={T.floor} c={C.gold} appear={tFlip} out={tNHC - 20} />
        <Keyword f={f} text="3-4.5 m above the ground" at={[MX, 120]} s={T.floor} c={C.local} appear={AT(k, 4, "three to four")} out={tSat - 20} />{/* fix loop 1 (review 2 S6): on its words */}
        <Keyword f={f} text="what did satellites see?" at={[MX, 120]} s={T.key} appear={tSat} out={tNo - 20} />
        <Keyword f={f} text="almost nothing" at={[MX, 120]} s={T.key} appear={tNo} out={tMeas - 20} />
        <Lbl x={MX} y={830} t="peak in the evening, under cloud" c={C.key} s={T.floor} o={win(f, tWhy, tMeas - 20)} />
        <Keyword f={f} text="the surge, measured" at={[MX, 120]} s={T.key} c={C.gold} appear={tMeas} out={tEk - 20} />
        <Keyword f={f} text="more: Friction and Ekman layers" at={[MX, 120]} s={T.floor} appear={tEk} out={tMore - 20} />
        <Keyword f={f} text="more: Storm surge" at={[MX, 120]} s={T.floor} appear={tMore} />
      </Svg>
      <TeX s={String.raw`10\ \mathrm{ft}\times0.3048\ \mathrm{m/ft}\approx3.0\ \mathrm m`} x={A.x - 60} y={A.y + A.h + 160} size={44} c={C.local} o={win(f, AT(k, 4, "ten to fifteen feet"), tSat - 10)} />
      <TeX s={String.raw`15\ \mathrm{ft}\times0.3048\ \mathrm{m/ft}\approx4.57\ \mathrm m`} x={A.x - 60} y={A.y + A.h + 215} size={44} c={C.local} o={win(f, AT(k, 4, "ten to fifteen feet") + 14, tSat - 10)} />
      <Svg><Lbl x={MX} y={50} t="Hurricane Ian · 28 Sep 2022" c={C.ink} s={T.floor} /></Svg>{/* fix 1b (user 2026-11-08): the event heading at the top of the right column, level with the picture's top */}
      <SourceBelow text="Data: NOAA CO-OPS tide gauges · HRRR (NOAA) · NHC report" pic={B} w={920} name="s31 src" />
    </Scene>
  );
};

// ================================================================ s33 / s36 / s39 the across-shore wind before each flood (R14, R14b)
type EvCfg = { id: string; nm: "amphan" | "nargis" | "idai"; latC: number; lonC: number; dlat: number; date: string; when: string; ratio: string; place: string;
  ptName: string; ptSide: -1 | 1; sea: [number, number, string]; aName: string; bName: string;
  // fix loop 1: the spoken words of each number (AT on Kokoro word times): leg, beta, bearing, alpha, cos, sin, speed, u, v, across sum,
  // ERA5's lowest pressure, the official pressure, the rise
  legW: string; betaW: string; brgW: string; alW: string; cosW: string; sinW: string; spW: string; uW: string; vW: string; sumW: string; eraW: string;
  offW: string; cmW: string; ratioW: string };
const EV_CFG: EvCfg[] = [
  { id: "s33_amphan_wind", nm: "amphan", latC: 21.75, lonC: 89.0, dlat: 3.0, date: "20 May 2020, 09 UTC", when: "Amphan · 20 May 2020 · 09 UTC", ratio: "6/10",
    place: "Sundarbans shore, Bangladesh", ptName: "our point", ptSide: 1, sea: [20.6, 88.1, "Bay of Bengal"], aName: "", bName: "",
    legW: "ninety two point nine", betaW: "thirteen degrees", brgW: "two hundred and fifty seven", alW: "a hundred and ninety three",
    cosW: "minus zero point nine seven four", sinW: "minus zero point two two five", spW: "twenty two point six", uW: "minus eight point four",
    vW: "plus twenty one", sumW: "minus twenty two point four", eraW: "nine hundred and sixty five", offW: "nine hundred and sixty hectopascals",
    cmW: "fifty three centimetres", ratioW: "six tenths" },
  { id: "s36_nargis_wind", nm: "nargis", latC: 16.05, lonC: 95.0, dlat: 3.0, date: "2 May 2008, 11 UTC", when: "Nargis · 2 May 2008 · 11 UTC", ratio: "half",
    place: "delta coast, south of Bogale", ptName: "our point", ptSide: 1, sea: [15.0, 94.0, "Andaman Sea"], aName: "", bName: "",
    legW: "sixty nine point five", betaW: "nine degrees", brgW: "two hundred and seventy nine", alW: "a hundred and seventy one",
    cosW: "minus zero point nine eight eight", sinW: "zero point one five six", spW: "nineteen metres", uW: "plus nine point six",
    vW: "plus sixteen point five", sumW: "minus seventeen point eight", eraW: "nine hundred and eighty two", offW: "nine hundred and sixty two",
    cmW: "fifty one centimetres", ratioW: "about half" },
  { id: "s39_idai_wind", nm: "idai", latC: -19.8, lonC: 35.3, dlat: 2.5, date: "14 Mar 2019, 19 UTC", when: "Idai · 14 Mar 2019 · 19 UTC", ratio: "2/3",
    place: "Beira's seafront", ptName: "Beira", ptSide: -1, sea: [-20.7, 35.9, "Mozambique Channel"], aName: "", bName: "",
    legW: "fifty two point three", betaW: "thirty four degrees", brgW: "two hundred and thirty six", alW: "two hundred and fourteen",
    cosW: "minus zero point eight two nine", sinW: "minus zero point five five nine", spW: "twenty two metres", uW: "minus six point seven",
    vW: "plus twenty point nine", sumW: "minus twenty one", eraW: "nine hundred and eighty one", offW: "nine hundred and fifty five",
    cmW: "fifty eight centimetres", ratioW: "two thirds" },
];
const EventWind: React.FC<{ cfg: EvCfg }> = ({ cfg }) => {
  const f = useCurrentFrame(), k = K(cfg.id);
  const E = SH[cfg.nm], S = EVS[cfg.nm];
  // fix loop 1: the pressure is said in two sentences (ERA5's own lowest pressure at the white circle, then the official centre pressure at
  // that hour), so the scene's sentences are found by phrase as before; "official centre" marks the official one
  const tERA = SSP(k, "universal time"), tRatio = SSP(k, "official"), tPt = SSP(k, cfg.nm === "idai" ? "seafront" : "point"), tLegs = SSP(k, "along the coast there"),
    tTan = SSP(k, " over "), tAl = SSP(k, "So alpha"), tY = SSP(k, "Then y hat prime"), tWind = SSP(k, "wind there was"), tTerms = SSP(k, "Across the shore"),
    tSum = SSP(k, "Together"), tPE = SSP(k, "At the white circle"), tP = SSP(k, "official centre pressure");
  // fix loop 1 (r8 review 1 S8, S9; review 2 S5, S6, S7, S12): every number on its spoken word; inputs gold (cos α, sin α, u, v, the wind's
  // speed and direction, the pressures); the answer (across) gold
  const tLegW = ATP(k, cfg.legW), tRule = ATP(k, " over "), tBeta = ATP(k, cfg.betaW), tBrg = ATP(k, cfg.brgW), tAlW = ATP(k, cfg.alW), tCos = ATP(k, "with a cosine"),
    tCv = ATP(k, cfg.cosW), tSv = ATP(k, cfg.sinW), tSp = ATP(k, cfg.spW), tUa = ATP(k, "u about"), tU = ATP(k, cfg.uW), tV = ATP(k, cfg.vW),
    tSumW = ATP(k, cfg.sumW), tEra = ATP(k, cfg.eraW), tOff = ATP(k, cfg.offW), tSea = ATP(k, "so the sea under the eye"), tCm = ATP(k, cfg.cmW),
    tMinus = ATP(k, "minus u sine alpha"), tVcos = ATP(k, "and v cosine");
  const B = boxAt(cfg.latC, cfg.lonC, cfg.dlat, 80, 50, 920, 750), P = mapP(B);
  const pt = P(E.pt[0], E.pt[1]), A0 = P(E.A[0], E.A[1]), B0 = P(E.B[0], E.B[1]);
  const corner = P(E.A[0] + (E.B[0] - E.A[0]) * 0, E.B[1]);          // leg 1 along the parallel (east-west), leg 2 north-south
  const cen = P(E.centre[0], E.centre[1]);
  const s = 9, a = S.alpha;
  const W = add(pt, [S.u / Math.hypot(S.u, S.v), -S.v / Math.hypot(S.u, S.v)], s * S.speed);
  const Pac = add(pt, unitV(a + 90), s * S.across);
  // fix loop 1 (r8 review 1 S3): the across label clear of BOTH arrowheads (the white wind head touched it), left of the two tips when it fits
  const acTxt = `across ${nf(S.across, 1)}`, xL = Math.min(Pac[0], W[0]) - 40;
  const acLeft = xL - textW(acTxt, T.floor) > B.x + 12;   // k6y3: Idai's label left the map
  const ns = S.dy >= 0 ? "north" : "south", ew = S.dx >= 0 ? "east" : "west";
  const hit = (q: Pt) => q[0] > B.x + 10 && q[0] < B.x + B.w - 10 && q[1] > B.y + 10 && q[1] < B.y + B.h - 10;
  const sea = P(cfg.sea[0], cfg.sea[1]);
  const spTxt = Number.isInteger(S.speed) ? S.speed.toFixed(0) : S.speed.toFixed(1);
  const pEra = Math.round(E.pmin as number);
  // the data behind the spoken pressures and wind (the render fails otherwise)
  [[`${cfg.nm} ERA5 pmin`, pEra, E.hour.pmin_hpa, 0.5], [`${cfg.nm} speed`, Number(spTxt), E.hour.speed, 0.06]].forEach(([n, v, r, tol]) => {
    if (!(Math.abs((v as number) - (r as number)) <= (tol as number))) throw new Error(`CHECK ${n}: ${v} vs ${r}`); });
  return (
    <Scene>
      <GeoMap id={`${cfg.nm}w`} B={B}>{(Pp) => <>
        <GeoImg P={Pp} href={IMG(`cst_${cfg.nm}_wind.png` as "cst_bay_patch.png")} box={E.img_box} o={0.95} />
        <path d={linesPath(Pp, E.coast)} fill="none" stroke={C.key} strokeWidth={2.5} />
        {(E.arrows as number[][]).map(([la, lo, u, v], i) => { const q = Pp(la, lo), s2 = 3.2;
          return <AnimatedWindArrow key={i} from={q} to={[q[0] + u * s2, q[1] - v * s2]} speed={Math.hypot(u, v)} f={f} c={C.ink} px={4} head={16} o={0.7} />; })}
      </>}</GeoMap>
      <Svg>
        {hit(cen) ? <g opacity={fin(f, tERA)}><circle cx={cen[0]} cy={cen[1]} r={16 + 4 * pulse(f, tEra, 40)} fill="none" stroke={hiOn(f, tEra) ? C.gold : C.ink} strokeWidth={5} />
          </g> : null}
        <Lbl x={sea[0]} y={sea[1]} t={cfg.sea[2]} c="#8db5e2" s={T.floor} a="middle" o={fin(f, tPt)} />
        <line x1={A0[0]} y1={A0[1]} x2={B0[0]} y2={B0[1]} stroke={C.second} strokeWidth={6} opacity={fin(f, tLegs)} />
        <g opacity={fin(f, tLegs) * fout(f, tWind)}>
          <line x1={A0[0]} y1={A0[1]} x2={corner[0]} y2={corner[1]} stroke={C.ink} strokeWidth={4} strokeDasharray="12 8" />
          <line x1={corner[0]} y1={corner[1]} x2={B0[0]} y2={B0[1]} stroke={C.ink} strokeWidth={4} strokeDasharray="12 8" />
        </g>
        {/* fix loop 1 (r8 review 1 S3): the point's name level with the dot, on the side no arrow takes (the wind and across arrows crossed it) */}
        <Place p={pt} t={cfg.ptName} dx={34} dy={4} a="start" o={fin(f, tPt)} />
        <g opacity={fin(f, tY)}>
          <Arrow p={pt} q={add(pt, unitV(a), 100)} color={C.second} w={6} head={24} />
          <Arrow p={pt} q={add(pt, unitV(a + 90), 100)} color={C.second} w={6} head={24} />
          <Lbl x={add(pt, unitV(a + 90), 120)[0] + 10} y={add(pt, unitV(a + 90), 120)[1] + 30} t="$\hat{\mathbf y}'$" c={C.second} s={T.floor} />
        </g>
        <AnimatedWindArrow from={pt} to={W} speed={S.speed} f={f} c={C.ink} px={10} head={36} o={fin(f, tWind)} />
        <g opacity={fin(f, tSum)}>
          <AnimatedWindArrow from={pt} to={Pac} speed={Math.abs(S.across)} f={f} c={ACROSS_C(S.across)} px={12} head={34} />
          <Lbl x={acLeft ? xL : Math.max(Pac[0], W[0]) + 30} y={acLeft ? Math.min(Pac[1], W[1]) + 10 : Math.min(Pac[1], W[1]) + 10} a={acLeft ? "end" : "start"} t={acTxt}
            c={hiOn(f, tSumW) ? C.gold : ACROSS_C(S.across)} s={T.floor} o={fin(f, tSumW)} />
        </g>
        <Keyword f={f} text="which way did the wind blow?" at={[MX, 120]} s={T.floor} appear={0} out={tERA - 20} />
        <Keyword f={f} text={cfg.when} at={[MX, 120]} s={T.floor} appear={tERA} out={tSum - 20} />
        <Keyword f={f} text="onto the land" at={[MX, 120]} s={T.key} c={C.neg} appear={tSum} />
        <Lbl x={MX} y={200} t={`ERA5 ≈ ${cfg.ratio} of official wind`} c={C.muted} s={T.floor} o={win(f, ATP(k, cfg.ratioW) - 6, tLegs - 10)} />
        <Lbl x={MX} y={200} t={cfg.place} c={C.key} s={T.floor} o={win(f, tLegs, tAl - 10)} />
        <Lbl x={MX} y={200} t={`$\\hat{\\mathbf y}'$ points out to sea`} c={C.second} s={T.floor} o={win(f, tY, tWind - 10)} />
        {/* fix loop 1 (review 2 S5): the wind's speed and direction as said, gold on its word */}
        <Lbl x={MX} y={200} t={`wind ≈ ${spTxt} m/s from the ${compass(E.hour.from_deg)}`} c={hiOn(f, tSp) ? C.gold : C.ink} s={hiSize(f, tSp, T.floor)} o={win(f, tSp, tPE - 10)} />
        <Lbl x={MX} y={690} t="white circle: ERA5's storm centre" c={C.ink} s={T.floor} o={fin(f, tERA)} />
        {/* fix loop 1 (review 1 S9 + review 2 S12, R14b): ERA5's own lowest pressure, then the official centre pressure at that hour */}
        <Lbl x={MX} y={300} t="ERA5's lowest pressure" c={C.local} s={T.floor} o={fin(f, tPE)} />
        <Lbl x={MX} y={356} t={`(white circle): ≈ ${pEra} hPa`} c={hiOn(f, tEra) ? C.gold : C.local} s={hiSize(f, tEra, T.floor)} o={fin(f, tEra - 6)} />
        <Lbl x={MX} y={440} t="official centre pressure" c={C.local} s={T.floor} o={fin(f, tP)} />
        <Lbl x={MX} y={496} t={`at that hour: ${E.ib.hpa} hPa`} c={hiOn(f, tOff) ? C.gold : C.local} s={hiSize(f, tOff, T.floor)} o={fin(f, tOff - 6)} />
      </Svg>
      <CalcStack f={f} x={MX} y={300} size={44} maxLines={5} o={fout(f, tWind - 10)} rows={[
        { rhs: String.raw`\text{${ew}}\ ${Math.abs(S.dx).toFixed(1)}\ \mathrm{km},\quad \text{${ns}}\ ${Math.abs(S.dy).toFixed(1)}\ \mathrm{km}`, at: tLegW },
        { rhs: String.raw`\tan\beta=\dfrac{${Math.min(Math.abs(S.dx), Math.abs(S.dy)).toFixed(1)}}{${Math.max(Math.abs(S.dx), Math.abs(S.dy)).toFixed(1)}}` +
          tailIn(f, tBeta, C.ink, String.raw`\approx${S.tan.toFixed(3)}\ \Rightarrow\ \beta\approx${S.beta}^\circ`), at: tRule },
        { rhs: String.raw`\text{bearing}\approx${S.bearing}^\circ`, at: tBrg, cont: true },
        { rhs: String.raw`\alpha=90^\circ-${S.bearing}^\circ+360^\circ` + tailIn(f, tAlW, C.ink, String.raw`=${S.alpha}^\circ`, true), at: tAl },
        { rhs: String.raw`\cos\alpha\approx${goldAt(f, tCv, tn(S.cos, 3))},\quad \sin\alpha\approx${goldAt(f, tSv, tn(S.sin, 3))}`, at: tCos },
      ]} />
      <CalcStack f={f} x={1076} y={276} size={44} maxLines={5} o={fin(f, tWind) * fout(f, tPE - 10)} rows={[
        { rhs: String.raw`u=${goldAt(f, tU, tn(S.u))},\ v=${goldAt(f, tV, tn(S.v))}\ \mathrm{m/s}\ \ (\alpha=${S.alpha}^\circ)`, at: tU - 8 },
        { rhs: String.raw`\cos\alpha\approx${tn(S.cos, 3)},\ \sin\alpha\approx${tn(S.sin, 3)}`, at: tU + 4, c: C.second, cont: true },
        { rhs: String.raw`\text{across}=-u\sin\alpha+v\cos\alpha`, at: tTerms },
        { rhs: String.raw`-u\sin\alpha=-${tn(S.u, 1, true)}\times${tn(S.sin, 3, true)}\approx${tn(S.ac_terms[0])}`, at: tMinus + 10, cont: true },
        { rhs: String.raw`v\cos\alpha=${tn(S.v)}\times${tn(S.cos, 3, true)}\approx${tn(S.ac_terms[1])}`, at: tVcos, cont: true },
        { rhs: String.raw`\text{across}\approx${tn(S.ac_terms[0])}${tn(S.ac_terms[1])}` + tailIn(f, tSumW, C.ink, String.raw`\approx${tn(S.across)}\ \mathrm{m/s}`, true), at: tSum, cont: true },
      ]} />
      <TeX s={String.raw`1013-${E.ib.hpa}=${E.ib.deficit}\ \mathrm{hPa}` + tailIn(f, tCm, C.local, String.raw`\ \Rightarrow\ \text{rise}\approx${E.ib.cm_rule}\ \mathrm{cm}`, true)}
        x={MX} y={580} size={44} c={C.local} o={fin(f, tSea)} />
      <SourceBelow text={`Data: ERA5 (Copernicus C3S) · ${cfg.date} · Natural Earth`} x={80} pic={B} w={1000} name={`${cfg.id} src`} />
      {/* fix loop 1 (r8 review 1 Must 2): the colour bar stays to the scene's last frame (the coloured map stays; no zoom here) */}
      <Svg><SpeedBar x={MX} y={800} w={300} hi={30} /><Lbl x={MX} y={50} t={`Cyclone ${cfg.nm[0].toUpperCase()}${cfg.nm.slice(1)} · ${cfg.date.split(",")[0]}`} c={C.ink} s={T.floor} /></Svg>{/* fix 1b (user 2026-11-08): the event heading at the top of the right column, level with the picture's top */}
    </Scene>
  );
};
/** the index of the sentence that starts at scene-frame t (for AT inside a phrase-located sentence) */
const sc_idx = (k: number, t: number) => { for (let j = 0; ; j++) { if (SS(k, j) === t) return j; if (j > 60) throw new Error("sc_idx"); } };
const S33: React.FC = () => { K("s33_amphan_wind"); return <EventWind cfg={EV_CFG[0]} />; };
const S36: React.FC = () => { K("s36_nargis_wind"); return <EventWind cfg={EV_CFG[1]} />; };
const S39: React.FC = () => { K("s39_idai_wind"); return <EventWind cfg={EV_CFG[2]} />; };

export const SCENES_D: Record<string, React.FC> = {
  s26_coast_axes: S26, s27_coast_angle: S27, s28_fmb_calc: S28, s29_stp_calc: S29, s30_onshore_piles: S30, s31_gauges: S31,
  s33_amphan_wind: S33, s36_nargis_wind: S36, s39_idai_wind: S39,
};
void [SE, pulse, clamp, Gauges, GA];
