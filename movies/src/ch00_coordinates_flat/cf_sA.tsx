// ch00_coordinates_flat scenes s00-s07: the title, the hook, the flat map (origin, axes, Cartesian coordinates, constant unit
// vectors), polar coordinates and the way back, compass bearings and the wind "from" convention, radians and the arc rule.
// s02-s07 are kept from build 1 (src/ch00_coordinates/co_sA.tsx) with the Part-1 sentence indices; every number on screen is
// asserted against data/cf.json below (the render fails otherwise).
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Band, Dash, Pt, RightTick, pulse } from "../house/kit/draw";
import { CalcStack, TeX } from "../house/kit/tex";
import { Keyword } from "../house/kit/notes";
import { CurvedLink } from "../house/kit/extras";
import { SeriesTitle } from "./kit_cf/SeriesTitle";
import { SourceBelow } from "../house/kit/frame";
import { AnimatedWindArrow, FlowParticles } from "../house/kit/wind";
import {
  AT, ATlast, ArcHead, Arrow, AxesEN, BAL, BDot, Balloon, D2R, GeoImg, GeoMap, Ground, IAN, IAN_SRC, IMGS, K, KmTicks, Lbl, PL, PO, PU, SE, SS, Scene, SpeedBar,
  SpeedBarCompact, Station, Svg, arcD, boxAt, clamp, exitFirst, fin, fout, kmPx, linesPath, mix, poly, pp, prog, rotS, win,
  Keyword as MKeyword,
} from "./cf_lib";
import { EQ_S02, EQ_S03, EQ_S04, EQ_S05, EQ_S06, EQ_S07, cutAt } from "./cf_eq";

// fix 3: the end of a TeX row fading in by colour on its word (same string on every frame, so the row never jumps): cf_sC.tsx tailIn
const hexMix = (a: string, b: string, u: number) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - u) + parseInt(b.slice(i, i + 2), 16) * u).toString(16).padStart(2, "0")).join("");
const tailIn = (f: number, t: number, c: string, s: string) => "\\textcolor{" + hexMix("#171f33", c, Math.min(1, Math.max(0, (f - t) / 8))) + "}{" + s + "}";

// ---------------------------------------------------------------- numbers on screen = the data
const CHECK_A: [string, number, number, number][] = [
  ["r", PL.r, 5, 1e-9], ["theta", PL.th, 53.13, 0.005], ["theta said", Math.round(PL.th), 53, 0], ["bearing", Math.round(90 - PL.th), 37, 0],
  ["ian vt", IAN.vt, 34.8, 0.05], ["ian vr", IAN.vr, -13.3, 0.05],
  // fix 1c (calculation audit C1-C6)
  ["9+16", 3 ** 2 + 4 ** 2, 25, 0], ["tan", 4 / 3, 1.333, 5e-4], ["atan", Math.atan2(4, 3) / D2R, 53.13, 0.005], ["cos 3/5", 3 / 5, 0.6, 1e-12], ["sin 4/5", 4 / 5, 0.8, 1e-12],
  ["2pi", 2 * Math.PI, 6.283, 5e-4], ["360/6.283", 360 / 6.283, 57.3, 0.01], ["0.2 rad", 0.2 * 57.3, 11.5, 0.05], ["ratio", 50 / 5, 10, 0],
];
CHECK_A.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

/** Ian's ring (25 km): the model's calm centre, 72 points */
export const RING = IAN.ring;
/** tangential (teal) and radial (rose) arrows at ring point i, px per m/s = s, directions from the point's own azimuth */
export const ringArrows = (P: (la: number, lo: number) => Pt, i: number, s: number, vt?: number, vr?: number) => {
  const p0 = P(RING.lat[i], RING.lon[i]), a = RING.az[i] * D2R;
  const T_ = vt ?? RING.vt[i], R_ = vr ?? RING.vr[i];
  return { p0, tp: [p0[0] - Math.sin(a) * T_ * s, p0[1] - Math.cos(a) * T_ * s] as Pt, rp: [p0[0] + Math.cos(a) * R_ * s, p0[1] - Math.sin(a) * R_ * s] as Pt };
};
export const ringPath = (P: (la: number, lo: number) => Pt) => poly((RING.lat as number[]).map((la, i) => P(la, RING.lon[i]))) + "Z";
/** the Ian map body: the HRRR 10-m speed raster, the coast, streaklines (zoomed tracks when z > 0) */
export const IanBody: React.FC<{ P: (la: number, lo: number) => Pt; f: number; z?: number; o?: number; parts?: boolean }> = ({ P, f, z = 0, o = 1, parts = true }) => (
  <g opacity={o}>
    <GeoImg P={P} href={IMGS.ian} box={IAN.speed_box} o={0.95} />
    <path d={linesPath(P, IAN.coast)} fill="none" stroke={C.key} strokeOpacity={0.85} strokeWidth={2.2} />
    {parts ? <FlowParticles P={(la, lo) => P(la, lo)} tracks={IAN.tracks} fr={f / 2} tail={10} w={2.2} o={1 - z} /> : null}
    {parts ? <FlowParticles P={(la, lo) => P(la, lo)} tracks={IAN.ztracks} fr={f / 2} tail={12} w={2.6} o={z} /> : null}
  </g>
);

// ================================================================ s00 title
const TB = { x: 1150, y: 150, w: 690, h: 480 };
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  // feedback 2026-11-06 (R1/R2): no "made easy"; the concept name pulses when the voice says "coordinates"
  const tMet = AT(k, 0, "how they're used")   /* user 2026-11-07: no "meteorology" in the voice */, tCo = AT(k, 0, "coordinates");
  // Part A: polar grid round the station, the balloon (3, 4) km gliding once round the 5-km circle with r̂, θ̂; then the square grid turns 30°
  const O: Pt = [1445, 400], u = 40;
  const th = PL.th + 360 * prog(f, 16, 104);
  const b: Pt = [O[0] + 5 * u * Math.cos(th * D2R), O[1] - 5 * u * Math.sin(th * D2R)];
  const er: Pt = [Math.cos(th * D2R), -Math.sin(th * D2R)], et = rotS(er, 90);
  const turn = 30 * prog(f, 112, 150);
  const oA = fout(f, tMet, 12), oB = fin(f, tMet, 12);
  const B = boxAt(IAN.c[0], IAN.c[1], 1.0, TB.x, TB.y, TB.w, TB.h);
  const L = 92;
  return (
    <Scene fadeIn={false}>
      <Svg>
        {/* the series title layout (feedback 2026-11-06 R1/R2; kit_cf/SeriesTitle.tsx, proposed for the house kit): concept / part / subtitle */}
        <SeriesTitle f={f} concept="Coordinates" part="Part 1 · Arrows on a flat map" sub={["polar coordinates", "and turned axes"]}  /* fix 2: the voice's word "turned" (review 1 C10) */ pulseAt={tCo} />
        <g opacity={oA * fin(f, 4, 10)}>
          {[1, 2, 3, 4, 5].map((r) => <circle key={r} cx={O[0]} cy={O[1]} r={r * u} fill="none" stroke={C.local} strokeWidth={2} opacity={0.6} />)}
          {Array.from({ length: 12 }, (_, i) => i * 30).map((a) => <line key={a} x1={O[0]} y1={O[1]} x2={O[0] + 5.6 * u * Math.cos(a * D2R)} y2={O[1] - 5.6 * u * Math.sin(a * D2R)} stroke={C.local} strokeWidth={1.6} opacity={0.45} />)}
          <g opacity={fin(f, 106, 10)} transform={`rotate(${-turn} ${O[0]} ${O[1]})`}>
            {[-4, -2, 0, 2, 4].map((q) => <line key={`a${q}`} x1={O[0] + q * u} y1={O[1] - 5.6 * u} x2={O[0] + q * u} y2={O[1] + 5.6 * u} stroke={C.second} strokeWidth={q === 0 ? 4 : 2} opacity={0.75} />)}
            {[-4, -2, 0, 2, 4].map((q) => <line key={`b${q}`} x1={O[0] - 5.6 * u} y1={O[1] + q * u} x2={O[0] + 5.6 * u} y2={O[1] + q * u} stroke={C.second} strokeWidth={q === 0 ? 4 : 2} opacity={0.75} />)}
          </g>
          <circle cx={O[0]} cy={O[1]} r={8} fill={C.local} />
          <Arrow p={b} q={[b[0] + er[0] * L, b[1] + er[1] * L]} color={C.second} w={8} head={30} />
          <Arrow p={b} q={[b[0] + et[0] * L, b[1] + et[1] * L]} color={C.second} w={8} head={30} />
          <BDot p={b} r={11} />
          <Arrow p={[1190, 600]} q={[1260, 600]} color={C.second} w={6} head={22} o={0.5} />
          <Arrow p={[1190, 600]} q={[1190, 530]} color={C.second} w={6} head={22} o={0.5} />
        </g>
      </Svg>
      <GeoMap id="s00m" B={B} o={oB} frame={0.6}>
        {(P) => {
          const cE = P(IAN.c[0], IAN.c[1]);
          return <>
            <IanBody P={P} f={f} z={1} parts={false} />
            <path d={ringPath(P)} fill="none" stroke={C.first} strokeWidth={5} />
            <circle cx={cE[0]} cy={cE[1]} r={9} fill={C.gold} stroke={C.bg} strokeWidth={3} />
            {[0, 18, 36, 54].map((i) => { const ra = ringArrows(P, i, 2.6);
              return <g key={i}><AnimatedWindArrow from={ra.p0} to={ra.tp} speed={RING.vt[i]} f={f} c={C.first} px={8} head={24} />
                <AnimatedWindArrow from={ra.p0} to={ra.rp} speed={Math.abs(RING.vr[i])} f={f} c={C.neg} px={8} head={24} /></g>; })}
          </>;
        }}
      </GeoMap>
      <SourceBelow text={IAN_SRC} pic={TB} w={690} o={oB} name="s00 src" />
      {/* fix 3 (fix2 review Must 1, HOUSE_STYLE 2026-11-08): the event heading and what the map shows, above the picture; the bar
          keeps only its unit (the title says "wind speed") */}
      <Svg><SpeedBarCompact x={TB.x} y={770} o={oB} label="m/s" />
        <Lbl x={TB.x} y={62} t="Hurricane Ian · 28 Sep 2022" c={C.ink} s={T.floor} o={oB} />
        <Lbl x={TB.x} y={116} t="wind speed near the ground" c={C.muted} s={T.floor} b={false} o={oB} /></Svg>
    </Scene>
  );
};

// ================================================================ s01 hook
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  const tCo = AT(k, 0, "coordinates"), tFive = AT(k, 1, "seven parts"), tBuilt = SS(k, 2), tHur = AT(k, 3, "hurricane");
  // fix 2 (fix1 review 1 Should 3): the three pieces of the lead-in, each on its word, in a column under "coordinates" (moved up to y 130)
  const tXY = AT(k, 2, "x and y"), tRT = AT(k, 2, "polar coordinates with"), tTA = AT(k, 2, "turned axes");
  const O: Pt = [440, 360], u = 44;
  const th = PL.th;
  const b: Pt = [O[0] + 5 * u * Math.cos(th * D2R), O[1] - 5 * u * Math.sin(th * D2R)];
  const er: Pt = [Math.cos(th * D2R), -Math.sin(th * D2R)], et = rotS(er, 90);
  // fix 3 (fix2 review Must 1): the map 86 px lower and 50 px shorter, so the event heading and the title sit above it
  const MB = { x: 1130, y: 136, w: 710, h: 390 };
  const B = boxAt(IAN.c[0], IAN.c[1], 1.0, MB.x, MB.y, MB.w, MB.h);
  const bright = 0.55 + 0.45 * fin(f, tBuilt, 20);
  const moving = f >= tHur ? f - tHur : 0;
  const TX = Array.from({ length: 7 }, (_, i) => 80 + 251.4 * (i + 0.5)), TY = 690;
  const TITLES = [["1 flat"], ["2 cyclone"], ["3 sphere"], ["4 turning", "frames"], ["5 moving", "frames"], ["6 routes"], ["7 maps"]];
  const thumb = (i: number) => {
    const x = TX[i], y = TY;
    return (
      <g key={i} opacity={fin(f, tFive + 4 * i) * (i === 0 ? 1 : 0.4)}>
        {TITLES[i].map((t, j) => <Lbl key={t} x={x} y={772 + 48 * j} t={t} c={i === 0 ? C.key : C.muted} s={T.floor} a="middle" />)}
        <g transform={`translate(${x} ${y}) scale(0.8) translate(${-x} ${-y})`}>
        {i === 0 ? <>{[-40, -20, 0, 20, 40].map((q) => <line key={`v${q}`} x1={x + q} y1={y - 40} x2={x + q} y2={y + 40} stroke={C.second} strokeWidth={2.5} />)}
          {[-40, -20, 0, 20, 40].map((q) => <line key={`h${q}`} x1={x - 40} y1={y + q} x2={x + 40} y2={y + q} stroke={C.second} strokeWidth={2.5} />)}</> : null}
        {i === 1 ? <><ellipse cx={x} cy={y - 34} rx={42} ry={12} fill="none" stroke={C.first} strokeWidth={3} /><line x1={x - 42} y1={y - 34} x2={x - 42} y2={y + 34} stroke={C.first} strokeWidth={3} />
          <line x1={x + 42} y1={y - 34} x2={x + 42} y2={y + 34} stroke={C.first} strokeWidth={3} /><ellipse cx={x} cy={y + 34} rx={42} ry={12} fill="none" stroke={C.first} strokeWidth={3} /></> : null}
        {i === 2 ? <><circle cx={x} cy={y} r={42} fill="none" stroke={C.first} strokeWidth={3} /><ellipse cx={x} cy={y} rx={42} ry={12} fill="none" stroke={C.first} strokeWidth={2} />
          <ellipse cx={x} cy={y} rx={14} ry={42} fill="none" stroke={C.first} strokeWidth={2} /></> : null}
        {i === 3 ? <><Arrow p={[x - 20, y + 30]} q={[x + 40, y + 30]} color={C.second} w={5} head={16} /><Arrow p={[x - 20, y + 30]} q={[x - 20, y - 30]} color={C.second} w={5} head={16} />
          <Arrow p={[x - 20, y + 30]} q={[x + 18, y - 6]} color={C.second} w={5} head={16} /></> : null}
        {i === 6 ? <><rect x={x - 46} y={y - 30} width={92} height={60} fill="none" stroke={C.local} strokeWidth={3} />{[-23, 0, 23].map((q) => <line key={q} x1={x + q} y1={y - 30} x2={x + q} y2={y + 30} stroke={C.local} strokeWidth={2} />)}
          <line x1={x - 46} y1={y} x2={x + 46} y2={y} stroke={C.local} strokeWidth={2} /></> : null}
        {i === 4 ? <><Arrow p={[x - 40, y + 25]} q={[x - 5, y + 25]} color={C.second} w={4} head={14} /><Arrow p={[x - 40, y + 25]} q={[x - 40, y - 10]} color={C.second} w={4} head={14} />
          <Arrow p={[x + 5, y + 5]} q={[x + 40, y + 5]} color={C.second} w={4} head={14} /><Arrow p={[x + 5, y + 5]} q={[x + 5, y - 30]} color={C.second} w={4} head={14} />
          <Arrow p={[x - 30, y + 40]} q={[x + 30, y + 40]} color={C.first} w={4} head={14} /></> : null}
        {i === 5 ? <><circle cx={x - 40} cy={y + 20} r={8} fill={C.key} /><circle cx={x + 40} cy={y + 10} r={8} fill={C.key} />
          <path d={`M ${x - 40} ${y + 20} Q ${x} ${y - 50} ${x + 40} ${y + 10}`} fill="none" stroke={C.gold} strokeWidth={4} /></> : null}
        </g>
      </g>
    );
  };
  return (
    <Scene>
      <Svg>
        <g opacity={bright}>
          {[1, 2, 3, 4, 5].map((r) => <circle key={r} cx={O[0]} cy={O[1]} r={r * u} fill="none" stroke={C.local} strokeWidth={2.2} opacity={0.7} />)}
          {Array.from({ length: 12 }, (_, i) => i * 30).map((a) => <line key={a} x1={O[0]} y1={O[1]} x2={O[0] + 5.5 * u * Math.cos(a * D2R)} y2={O[1] - 5.5 * u * Math.sin(a * D2R)} stroke={C.local} strokeWidth={1.8} opacity={0.5} />)}
        </g>
        <Station at={O} s={0.7} />
        <Arrow p={b} q={[b[0] + er[0] * 110, b[1] + er[1] * 110]} color={C.second} />
        <Arrow p={b} q={[b[0] + et[0] * 110, b[1] + et[1] * 110]} color={C.second} />
        <BDot p={b} />
        {[0, 1, 2, 3, 4, 5, 6].map(thumb)}
        {/* fix 3 (fix2 review C6): the keyword list 10-15 px higher and the colour bar 22 px lower, so "turned axes" and "wind speed"
            no longer read as one block */}
        <Keyword f={f} text="coordinates" at={[960, 120]} a="middle" appear={tCo} />
        <MKeyword f={f} text="$x$ and $y$" at={[960, 200]} a="middle" appear={tXY} />
        <MKeyword f={f} text="polar $r$, $\theta$" at={[960, 276]} a="middle" appear={tRT} />
        <MKeyword f={f} text="turned axes" at={[960, 352]} a="middle" appear={tTA} />
        <SpeedBar x={810} y={492} w={200} />
        {/* fix 3 (fix2 review Must 1, HOUSE_STYLE 2026-11-08): event heading + what the map shows, above the picture */}
        <Lbl x={1130} y={44} t="Hurricane Ian · 28 Sep 2022" c={C.ink} s={T.floor} />
        <Lbl x={1130} y={98} t="wind speed near the ground" c={C.muted} s={T.floor} b={false} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf r}`} x={b[0] + er[0] * 150} y={b[1] + er[1] * 150} size={56} ax={0.5} c={C.second} />
      <TeX s={String.raw`\hat{\boldsymbol\theta}`} x={b[0] + et[0] * 150} y={b[1] + et[1] * 150} size={56} ax={0.5} c={C.second} />
      <GeoMap id="s01m" B={B}>
        {(P) => {
          const cE = P(IAN.c[0], IAN.c[1]);
          return <>
            <IanBody P={P} f={f} z={1} />
            <path d={ringPath(P)} fill="none" stroke={C.first} strokeWidth={5} />
            <circle cx={cE[0]} cy={cE[1]} r={9} fill={C.gold} stroke={C.bg} strokeWidth={3} />
            {[0, 18, 36, 54].map((i) => { const ra = ringArrows(P, i, 2.8);
              return <g key={i}><AnimatedWindArrow from={ra.p0} to={ra.tp} speed={RING.vt[i]} f={moving} c={C.first} px={8} head={24} />
                <AnimatedWindArrow from={ra.p0} to={ra.rp} speed={Math.abs(RING.vr[i])} f={moving} c={C.neg} px={8} head={24} /></g>; })}
          </>;
        }}
      </GeoMap>
      <SourceBelow text={IAN_SRC} pic={MB} w={710} name="s01 src" />
    </Scene>
  );
};

// ================================================================ s02 origin, axes, coordinates (kept)
const S02: React.FC = () => {
  const f = useCurrentFrame(), k = K("s02_coordinates");
  const tStart = AT(k, 1, "a starting point"), tOrig = AT(k, 2, "origin"), tSta = AT(k, 3, "weather station"), tAx = SS(k, 4), tAxW = AT(k, 5, "axes");
  const tDrift = SS(k, 6), tPair = AT(k, 7, "three and four"), tCo = AT(k, 8, "coordinates"), tCa = AT(k, 9, "Cartesian");
  const d = prog(f, tDrift + 10, SE(k, 6) - 10);
  const bp = pp(3 * d, 4 * d);
  return (
    <Scene>
      <Svg>
        <Ground />
        {/* fix 1 Should 11: the starting point appears on its words (the panel is no longer empty for 9 s) */}
        <circle cx={PO[0]} cy={PO[1]} r={14 + 6 * pulse(f, tOrig, 24)} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={fin(f, tStart) * (1 - fin(f, tSta))} />
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
        <Keyword f={f} text="a flat map" at={[1100, 160]} appear={0} out={tOrig - 18} />
        <Keyword f={f} text="origin" at={[1100, 160]} appear={tOrig} />
        <CurvedLink f={f} from={[1090, 180]} to={[PO[0] + 30, PO[1] - 40]} start={tOrig + 8} end={tPair - 12} bend={60} />
        <Keyword f={f} text="axes" at={[1100, 270]} appear={tAxW} />
        <Keyword f={f} text="coordinates" at={[1100, 560]} appear={tCo} />
        <Keyword f={f} text="Cartesian coordinates" at={[1100, 670]} appear={tCa} />
        <Lbl x={1100} y={740} t="René Descartes" c={C.muted} s={T.floor} o={fin(f, AT(k, 9, "René Descartes"))} />
      </Svg>
      <TeX s={EQ_S02} x={1100} y={420} size={84} o={fin(f, tPair)} />
    </Scene>
  );
};

// ================================================================ s03 constant x-hat, y-hat (kept)
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_cartesian_arrows");
  const t1 = SS(k, 0), tSum = SS(k, 2), tSame = AT(k, 4, "the same way everywhere"), tMove = SS(k, 5), tIns = AT(k, 8, "hurricane"), tRing = AT(k, 8, "rings");
  const tX3 = AT(k, 2, "Three steps"), tY4 = AT(k, 2, "four steps"), tLand = AT(k, 2, "lands exactly");
  // fix 1 Should 10: every pair inside the panel (x̂ tip ≤ 6.3 km), clear of the axes and their labels
  const places: [number, number][] = [[3, 4], [5.3, 1.5], [1.6, 4.6], [1.2, 2.2], [4.6, 4.4]];
  const hop = clamp((f - tMove) / ((SE(k, 5) - tMove) / 4), 0, 4);
  const i0 = Math.floor(hop), w = hop - i0;
  const cur: [number, number] = i0 >= 4 ? places[4] : [mix(places[i0][0], places[i0 + 1][0], prog(w, 0, 0.6)), mix(places[i0][1], places[i0 + 1][1], prog(w, 0, 0.6))];
  const at = f >= tMove ? cur : places[0];
  const unitAt = (p: [number, number], o: number, key: string) => <g key={key} opacity={o}>
    <Arrow p={pp(p[0], p[1])} q={pp(p[0] + 1, p[1])} color={C.second} w={9} head={32} />
    <Arrow p={pp(p[0], p[1])} q={pp(p[0], p[1] + 1)} color={C.second} w={9} head={32} />
  </g>;
  const IB = { x: 1100, y: 420, w: 330, h: 260 };   // fix 1 Must 3: 40 px shorter, room for the compact speed bar
  const MI = boxAt(IAN.c[0], IAN.c[1], 1.1, IB.x, IB.y, IB.w, IB.h);
  return (
    <Scene>
      <Svg>
        <Ground />
        <AxesEN f={f} at={-40} c={C.muted} />
        <KmTicks o={1} />
        <Station />
        <Dash p={PO} q={pp(3, 0)} c={C.first} w={5} />
        <Dash p={pp(3, 0)} q={pp(3, 4)} c={C.first} w={5} />
        {unitAt([0, 0], fin(f, t1), "o")}
        {f >= tMove ? places.slice(0, Math.min(5, i0 + 1)).map((p, i) => unitAt(p, 0.35, `g${i}`)) : null}
        {/* fix 1 Should 10: the moving balloon becomes the diagram dot, so its unit pair no longer covers the icon */}
        <Balloon p={pp(at[0], at[1])} o={fout(f, tMove - 12)} />
        {unitAt(at, fin(f, tMove), "b")}
        <BDot p={pp(at[0], at[1])} o={fin(f, tMove - 12)} />
        <Keyword f={f} text="unit vectors" at={[1100, 160]} appear={0} out={tSum - 18} />
        <Keyword f={f} text="same everywhere" at={[1100, 300]} appear={tSame} out={tIns - 18} />
        <CurvedLink f={f} from={[1160, 215]} to={pp(1.5, 0.15)} ctl={[400, 230]} start={tSum + 10} end={tX3 - 10} />
        <CurvedLink f={f} from={[1390, 215]} to={pp(3.15, 2)} start={tSum + 16} end={tX3 - 10} bend={40} />
        {/* fix 1c C1: three x̂ steps tip to tail to 3 km, then four ŷ steps up to the balloon, each group on its words */}
        <g opacity={fout(f, tMove - 12)}>
          {[0, 1, 2].map((i) => <Arrow key={`sx${i}`} p={pp(i, 0)} q={pp(i + 1, 0)} color={C.gold} w={7} head={24} o={fin(f, tX3 + 10 * i)} />)}
          {[0, 1, 2, 3].map((j) => <Arrow key={`sy${j}`} p={pp(3, j)} q={pp(3, j + 1)} color={C.gold} w={7} head={24} o={fin(f, tY4 + 10 * j)} />)}
        </g>
        <Keyword f={f} text="not in squares" at={[1100, 300]} appear={tIns} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf x}`} x={pp(1, 0)[0] + 10} y={PO[1] - 40} size={60} c={C.second} o={fin(f, t1 + 10)} />
      <TeX s={String.raw`\hat{\mathbf y}`} x={PO[0] + 26} y={pp(0, 0.55)[1]} size={60} c={C.second} o={fin(f, t1 + 10)} />
      <TeX s={EQ_S03} x={1100} y={160} size={84} o={fin(f, tSum) * fout(f, tSame - 18)} />
      {/* fix 2 (review 2 Must 3): the sum row's long left side ran left over the map panel (x 922); it is now "3x̂ + 4ŷ = (3, 0) + (0, 4) = (3, 4)"
          with a short left side, the "=" column at 1270, so the whole stack stays in x 1080-1842 */}
      <CalcStack f={f} x={1272} y={260} size={50} rows={[
        { lhs: String.raw`3\,\hat{\mathbf x}`, rhs: String.raw`=3\,(1,\ 0)=(3,\ 0)`, at: tX3, out: tSame - 18 },
        { lhs: String.raw`4\,\hat{\mathbf y}`, rhs: String.raw`=4\,(0,\ 1)=(0,\ 4)`, at: tY4, out: tSame - 18 },
        { lhs: String.raw`3\,\hat{\mathbf x}+4\,\hat{\mathbf y}`, rhs: String.raw`=(3,\ 0)+(0,\ 4)=(3,\ 4)`, at: tLand, out: tSame - 18 },
      ]} />
      <GeoMap id="s03ian" B={MI} o={fin(f, tIns)} frame={0.8}>
        {(P) => <>
          <IanBody P={P} f={f} z={1} parts={false} />
          {Array.from({ length: 8 }, (_, i) => <line key={`a${i}`} x1={IB.x + i * 47} y1={IB.y} x2={IB.x + i * 47} y2={IB.y + IB.h} stroke={C.gold} strokeWidth={2} opacity={0.6} />)}
          {Array.from({ length: 6 }, (_, i) => <line key={`b${i}`} x1={IB.x} y1={IB.y + i * 52} x2={IB.x + IB.w} y2={IB.y + i * 52} stroke={C.gold} strokeWidth={2} opacity={0.6} />)}
        </>}
      </GeoMap>
      <Svg>
        <g opacity={fin(f, tRing)}>
          <rect x={1480} y={420} width={330} height={260} rx={8} fill="#1d2a44" stroke={C.grid} strokeWidth={3} />
          <clipPath id="s03rr"><rect x={1480} y={420} width={330} height={260} rx={8} /></clipPath>
          <g clipPath="url(#s03rr)">{[40, 80, 120, 160].map((r) => <circle key={r} cx={1645} cy={550} r={r} fill="none" stroke={C.first} strokeWidth={3} opacity={0.85} />)}</g>
          {Array.from({ length: 7 }, (_, i) => <line key={`a${i}`} x1={1480 + i * 55} y1={420} x2={1480 + i * 55} y2={680} stroke={C.gold} strokeWidth={2} opacity={0.6} />)}
          {Array.from({ length: 6 }, (_, i) => <line key={`b${i}`} x1={1480} y1={420 + i * 52} x2={1810} y2={420 + i * 52} stroke={C.gold} strokeWidth={2} opacity={0.6} />)}
          <circle cx={1645} cy={550} r={8} fill={C.local} />
        </g>
        <Lbl x={1645} y={720} t="radar rings" c={C.muted} s={T.floor} a="middle" o={fin(f, tRing)} />
        <SpeedBarCompact x={IB.x} y={796} o={fin(f, tIns)} />
        {/* fix 3 (HOUSE_STYLE 2026-11-08): the thumbnail's event heading (its colour bar says what it shows) */}
        <Lbl x={IB.x} y={390} t="Ian · 28 Sep 2022" c={C.ink} s={T.floor} o={fin(f, tIns)} />
      </Svg>
      <SourceBelow text="Data: HRRR (NOAA) · Ian, 28 Sep 2022" pic={IB} w={360} o={fin(f, tIns)} name="s03 src" />
    </Scene>
  );
};

// ================================================================ s04 polar coordinates (kept)
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = K("s04_polar");
  // fix 1 after fb1 ("show it, don't voice it"): the squares are no longer read out; 9 + 16 and √25 come between "four squared" and
  // "five kilometres", one row every half second
  const tR = AT(k, 1, "called r"), tPy = AT(k, 2, "Pythagoras"), t5 = AT(k, 2, "five kilometres"), t916 = AT(k, 2, "add them"), t25 = Math.max(t916 + 12, AT(k, 2, "take the square root"));
  const tTh = AT(k, 3, "called theta"), tAnti = AT(k, 4, "anticlockwise"), tTan = AT(k, 5, "tangent"), t53 = AT(k, 5, "fifty three"), tPair = SS(k, 6),
    tAng = AT(k, 5, "The angle with that tangent");
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
        <Band p={PO} q={pp(3, 0)} color={C.second} o={0.55 * Math.max(pulse(f, tPy, 40), pulse(f, AT(k, 5, "east side"), 40))} />
        <Band p={pp(3, 0)} q={BAL} color={C.second} o={0.55 * Math.max(pulse(f, tPy, 40), pulse(f, AT(k, 5, "north side"), 40))} />
        <Dash p={PO} q={pp(3, 0)} c={C.second} w={5} /><Dash p={pp(3, 0)} q={BAL} c={C.second} w={5} />
        <line x1={PO[0]} y1={PO[1]} x2={mix(PO[0], BAL[0], prog(f, tR - 6, tR + 18))} y2={mix(PO[1], BAL[1], prog(f, tR - 6, tR + 18))} stroke={C.ink} strokeWidth={10} strokeLinecap="round" opacity={fin(f, tR - 6)} />
        <Station />
        <Balloon p={BAL} />
        <Lbl x={mid[0] - 34} y={mid[1] - 20} t="r" c={C.ink} s={T.calc} a="end" o={fin(f, tR)} />
        {/* fix 1c C2: the legs carry their lengths; a right-angle mark at the foot */}
        <Lbl x={pp(1.5, 0)[0]} y={PO[1] + 92} t="3 km" c={C.gold} s={T.floor} a="middle" o={fin(f, AT(k, 2, "three and four"))} />
        <Lbl x={pp(3, 0)[0] + 24} y={pp(3, 2)[1]} t="4 km" c={C.gold} s={T.floor} o={fin(f, AT(k, 2, "and four"))} />
        <RightTick at={pp(3, 0)} u1={[-1, 0]} u2={[0, -1]} c={C.gold} o={fin(f, tPy)} />
        <path d={arcD(PO, 110, 0, th * prog(f, tTh, tTh + 24))} fill="none" stroke={C.local} strokeWidth={6} opacity={fin(f, tTh)} />
        <Lbl x={PO[0] + 140} y={PO[1] - 56} t="θ" c={C.local} s={T.calc} o={fin(f, tTh + 10)} />
        <path d={arcD(PO, 190, 8, 70)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tAnti)} />
        <ArcHead c={PO} r={190} a={70} dir={1} col={C.gold} o={fin(f, tAnti)} />
        {/* K6 after fix 1c: below the stack's lowest reach (y 717), gone before "polar coordinates" takes its row */}
        <Lbl x={1100} y={820} t="anticlockwise, seen from above" c={C.key} s={T.floor} o={win(f, tAnti, tPol - 18)} />
        <Keyword f={f} text="how far · which direction" at={[1100, 700]} s={T.floor} appear={0} out={tAnti - 18} />
        <Keyword f={f} text="polar coordinates" at={[1100, 790]} appear={tPol} />
      </Svg>
      {/* K6 after fix 1c: the r formula leaves with the r rows (just before "fifty three"), so the rows sliding out above the stack
          never pass through it */}
      <TeX s={String.raw`r=${cutAt(EQ_S04, String.raw`,\qquad r=`)[1]}`} x={1100} y={85} size={50} c={C.local} o={win(f, tPy, tAng - 12)} />
      {/* fix 3 (fix2 review C1): exitFirst - outgoing rows fade before the stack slides (as s17 / s23) */}
      <CalcStack f={f} x={1240} y={150} size={54} maxLines={2} rows={exitFirst([
        { lhs: "r", rhs: String.raw`=\sqrt{3^2+4^2}`, at: tPy },
        { rhs: String.raw`=\sqrt{9+16}`, at: t916, cont: true },
        { rhs: String.raw`=\sqrt{25}`, at: t25, cont: true },
        { rhs: String.raw`=5\ \mathrm{km}`, at: t5, cont: true },
        { lhs: String.raw`\tan\theta`, rhs: String.raw`=\dfrac{\text{north side}}{\text{east side}}`, at: tTan, h: 132 },
        { rhs: String.raw`=\dfrac{4}{3}\approx1.333`, at: AT(k, 5, "four over three"), cont: true, h: 128 },
        // fix 2 (fix1 review 2 Should 10): the inverse on "The angle with that tangent", the result on "fifty three point one"
        { lhs: String.raw`\theta`, rhs: String.raw`=\tan^{-1}(1.333)`, at: tAng },
        { rhs: String.raw`\approx53.13^\circ\approx53^{\circ}`, at: t53, cont: true },
        { lhs: String.raw`(r,\ \theta)`, rhs: String.raw`=(5\ \mathrm{km},\ 53^{\circ})`, at: tPair },
      ], 2)} />
    </Scene>
  );
};

// ================================================================ s05 back to x, y (kept)
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = K("s05_polar_back");
  const tTri = SS(k, 2), tSides = SS(k, 4), tC = SS(k, 6), t4 = SS(k, 7), tEq = SS(k, 8), tX5 = AT(k, 6, "So five kilometres times");
  // fix 1 after fb1: each product row lands on its result words ("gives back the east side: three")
  const tX5r = AT(k, 6, "gives back the east side"), t4r = AT(k, 7, "gives back the north side");
  const t3w = ATlast(k, 6, "east side: three"), t4w = ATlast(k, 7, "north side: four");   // fix 4: the spoken results
  void [tX5r, t4r];
  return (
    <Scene>
      <Svg>
        <Ground grid={0.3} />
        <AxesEN f={f} at={-40} />
        <g opacity={fin(f, tTri)}>
          <path d={poly([PO, pp(3, 0), BAL, PO])} fill={C.first} fillOpacity={0.08} stroke="none" />
          <line x1={PO[0]} y1={PO[1]} x2={pp(3, 0)[0]} y2={PO[1]} stroke={C.second} strokeWidth={8} />
          <line x1={pp(3, 0)[0]} y1={PO[1]} x2={BAL[0]} y2={BAL[1]} stroke={C.second} strokeWidth={8} />
          <line x1={PO[0]} y1={PO[1]} x2={BAL[0]} y2={BAL[1]} stroke={C.ink} strokeWidth={10} />
          <RightTick at={pp(3, 0)} u1={[-1, 0]} u2={[0, -1]} c={C.ink} />
          <path d={arcD(PO, 110, 0, PL.th)} fill="none" stroke={C.local} strokeWidth={6} />
          <Lbl x={PO[0] + 140} y={PO[1] - 56} t="θ" c={C.local} s={T.calc} />
          <Lbl x={(PO[0] + BAL[0]) / 2 - 34} y={(PO[1] + BAL[1]) / 2 - 20} t="r" c={C.ink} s={T.calc} a="end" />
        </g>
        <Station />
        <Balloon p={BAL} />
        <Keyword f={f} text="back to x and y" at={[1100, 640]} appear={0} out={tC - 18} />
        <CurvedLink f={f} from={[1140, 335]} to={pp(1.5, 0.15)} ctl={[900, 700]} start={tX5 + 10} end={t4 - 4} />
        {/* fix 1c C4: the legs' lengths beside r cos θ and r sin θ while the check runs */}
        <Lbl x={pp(1.5, 0)[0]} y={PO[1] + 118} t="= 3 km" c={C.gold} s={T.floor} a="middle" o={win(f, AT(k, 6, "three fifths"), tEq - 10)} />
        <Lbl x={pp(3, 0)[0] + 24} y={pp(3, 2)[1] + 62} t="= 4 km" c={C.gold} s={T.floor} o={win(f, AT(k, 6, "four fifths"), tEq - 10)} />
        <CurvedLink f={f} from={[1250, 420]} to={pp(3.15, 3.2)} start={t4 + 6} end={tEq - 10} bend={20} />
      </Svg>
      <TeX s={String.raw`r\cos\theta`} x={pp(1.5, 0)[0]} y={PO[1] + 60} size={60} ax={0.5} c={C.second} o={fin(f, tSides)} />
      <TeX s={String.raw`r\sin\theta`} x={pp(3, 0)[0] + 24} y={pp(3, 2)[1]} size={60} c={C.second} o={fin(f, AT(k, 4, "the side going north"))} />
      <CalcStack f={f} x={1400} y={250} size={56} maxLines={3} rows={[
        { lhs: String.raw`\cos\theta`, rhs: String.raw`=\dfrac{\text{east side}}{r}`, at: tC, h: 132 },
        { rhs: String.raw`=\dfrac{3}{5}=0.6`, at: AT(k, 6, "three fifths"), cont: true, h: 128 },
        { lhs: String.raw`\sin\theta`, rhs: String.raw`=\dfrac{\text{north side}}{r}`, at: AT(k, 6, "and sine theta"), h: 132 },
        { rhs: String.raw`=\dfrac{4}{5}=0.8`, at: AT(k, 6, "four fifths"), cont: true, h: 128 },
        // fix 4 (fix3 review 2): each product row on its inputs' words ("So five kilometres times" / "And five kilometres times"), its
        // result fading in by colour on "three" / "four" (it came 1.9 / 1.7 s early)
        { lhs: String.raw`x=r\cos\theta`, rhs: String.raw`=5\times0.6` + tailIn(f, t3w, "#e8ecf4", "=3"), at: tX5 },
        { lhs: String.raw`y=r\sin\theta`, rhs: String.raw`=5\times0.8` + tailIn(f, t4w, "#e8ecf4", "=4"), at: SS(k, 7) },
      ]} />
      <TeX s={String.raw`(\theta\approx53.13^\circ)`} x={1100} y={190} size={46} c={C.local} o={win(f, tC, tEq - 10)} />
      <TeX s={EQ_S05} x={1100} y={770} size={60} o={fin(f, tEq)} />
    </Scene>
  );
};

// ================================================================ s06 maths angle vs compass bearing vs "from" (kept)
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = K("s06_bearings");
  const tBear = SS(k, 2), tCalc = AT(k, 3, "ninety degrees minus theta"), t37 = AT(k, 3, "thirty seven"), tFrom = SS(k, 4), tWest = SS(k, 5), tCheck = SS(k, 6);
  const brg = 90 - PL.th;
  const W0: Pt = [1250, 560], W1: Pt = [1650, 560];
  const B6 = [String.raw`\text{bearing}`, String.raw`=90^\circ-\theta`, String.raw`=90^\circ-53^\circ`, String.raw`=37^\circ`];
  if (B6.join("") !== EQ_S06) throw new Error("s06 rows drift from EQ_S06");
  return (
    <Scene>
      <Svg>
        <Ground grid={0.3} />
        <AxesEN f={f} at={-40} />
        <line x1={PO[0]} y1={PO[1]} x2={BAL[0]} y2={BAL[1]} stroke={C.ink} strokeWidth={8} />
        <Station />
        <Balloon p={BAL} />
        <path d={arcD(PO, 120, 0, PL.th)} fill="none" stroke={C.local} strokeWidth={6} />
        <ArcHead c={PO} r={120} a={PL.th} dir={1} col={C.local} />
        <Lbl x={PO[0] + 150} y={PO[1] - 50} t="53°" c={C.local} s={T.key} />
        <g opacity={fin(f, tBear)}>
          <path d={arcD(PO, 210, 90, 90 - brg * prog(f, tBear, tBear + 30))} fill="none" stroke={C.gold} strokeWidth={6} />
          <ArcHead c={PO} r={210} a={90 - brg * prog(f, tBear, tBear + 30)} dir={-1} col={C.gold} />
          <Lbl x={PO[0] + 70} y={PO[1] - 250} t="37°" c={C.gold} s={T.key} o={fin(f, Math.max(tCalc + 15, t37))} />
        </g>
        <Lbl x={1100} y={110} t="compass: from north, clockwise" c={C.gold} s={T.floor} o={fin(f, tBear)} />
        <Keyword f={f} text="from" at={[W0[0] - 20, W0[1] - 92]} a="end" appear={tFrom} />
        <g opacity={fin(f, tWest)}>
          <AnimatedWindArrow from={W0} to={W1} speed={10} f={f} c={C.ink} px={10} head={40} />
          <Lbl x={W0[0] - 20} y={W0[1]} t="W" c={C.muted} s={T.key} a="end" />
          <Lbl x={W1[0] + 24} y={W1[1]} t="E" c={C.muted} s={T.key} />
        </g>
        <Lbl x={1250} y={660} t="a west wind blows east" c={C.key} s={T.floor} o={fin(f, AT(k, 5, "towards the east"))} />
        <Keyword f={f} text="maths angle or compass bearing?" at={[1100, 790]} s={T.floor} appear={0} out={tCheck - 18} />
        <Keyword f={f} text="check which angle" at={[1100, 790]} appear={tCheck} />
      </Svg>
      <CalcStack f={f} x={1360} y={180} size={60} rows={[
        { lhs: B6[0], rhs: B6[1], at: tBear + 20 },
        { rhs: B6[2], at: tCalc, cont: true },
        { rhs: B6[3], at: Math.max(tCalc + 15, t37), cont: true },
      ]} />
      {/* fix 3 (review 3 Must 6): the "u = +10, v = 0" row is gone (u and v are first defined in s13); "from" keeps its own line
          above the arrow and the words "a west wind blows east" sit under it */}
    </Scene>
  );
};

// ================================================================ s07 radians and arc length (kept; Should 1, Should 18)
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_radians");
  const tCir = SS(k, 1), tDiv = SS(k, 2), tArc = AT(k, 3, "arc length"), tFull = SS(k, 4), t57 = SS(k, 5), tEasy = SS(k, 6), t1 = AT(k, 7, "one kilometre"),
    t10 = SS(k, 8), tSame = SS(k, 9), tKeep = SS(k, 10), t10km = AT(k, 8, "ten kilometres");
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
          <line x1={O1[0]} y1={O1[1]} x2={O1[0] + R1} y2={O1[1]} stroke={C.ink} strokeWidth={8} />
          <Lbl x={O1[0] + R1 / 2} y={O1[1] + 40} t="r" c={C.ink} s={T.calc} a="middle" />
          <path d={arcD(O1, R1, 0, ang)} fill="none" stroke={C.second} strokeWidth={12} strokeLinecap="round" />
          <circle cx={O1[0] + R1 * Math.cos(ang * D2R)} cy={O1[1] - R1 * Math.sin(ang * D2R)} r={14} fill={C.key} stroke={C.bg} strokeWidth={4} opacity={fin(f, tCir)} />
          <path d={arcD(O1, 70, 0, ang)} fill="none" stroke={C.local} strokeWidth={5} />
          <Lbl x={O1[0] + R1 * 1.18 * Math.cos(30 * D2R)} y={O1[1] - R1 * 1.18 * Math.sin(30 * D2R)} t="s" c={C.second} s={T.calc} a="middle" o={fin(f, tArc) * fout(f, tFull)} />
          <Lbl x={O1[0] + R1 * 1.25 * Math.cos(140 * D2R)} y={O1[1] - R1 * 1.25 * Math.sin(140 * D2R)} t="2π r" c={C.second} s={T.calc} a="end" o={fin(f, tFull + 40)} />
          <Lbl x={O1[0] - 20} y={O1[1] + 100} t="2π rad" c={C.local} s={T.key} a="middle" o={fin(f, tFull + 50)} />
          <Lbl x={O1[0] + 110} y={O1[1] - 60} t="θ" c={C.local} s={T.key} o={fin(f, tCir + 10) * fout(f, tFull - 10)} />
        </g>
        <g opacity={oB}>
          <line x1={O2[0]} y1={O2[1]} x2={O2[0] + 780 * Math.cos(a0 * D2R)} y2={O2[1] - 780 * Math.sin(a0 * D2R)} stroke={C.local} strokeWidth={3} />
          <line x1={O2[0]} y1={O2[1]} x2={O2[0] + 780 * Math.cos(a1 * D2R)} y2={O2[1] - 780 * Math.sin(a1 * D2R)} stroke={C.local} strokeWidth={3} />
          <path d={arcD(O2, 70, 0, 80)} fill="none" stroke={C.first} strokeWidth={3} opacity={0.6} />
          <path d={arcD(O2, 700, 0, 70)} fill="none" stroke={C.first} strokeWidth={3} opacity={0.6} />
          <path d={arcD(O2, 70, a0, a1)} fill="none" stroke={C.second} strokeWidth={20} opacity={fin(f, t1 - 20)} />
          <circle cx={O2[0] + 70 * Math.cos(((a0 + a1) / 2) * D2R)} cy={O2[1] - 70 * Math.sin(((a0 + a1) / 2) * D2R)} r={22} fill="none" stroke={C.gold} strokeWidth={3} opacity={fin(f, t1 - 20)} />
          <Lbl x={O2[0] + 92} y={O2[1] - 92} t="0.2 rad" c={C.gold} s={T.floor} a="end" o={fin(f, AT(k, 7, "zero point two radians"))} />
          <path d={arcD(O2, 700, a0, a1)} fill="none" stroke={C.second} strokeWidth={12} opacity={fin(f, t10)} />
          <Lbl x={O2[0] + 120} y={O2[1] - 10} t="5 km" c={C.ink} s={T.floor} o={fin(f, tEasy)} />
          <Lbl x={O2[0] + 460} y={O2[1] - 60} t="50 km" c={C.ink} s={T.floor} o={fin(f, tEasy + 20)} />
          <Lbl x={O2[0] + 40} y={O2[1] - 155} t="1 km" c={C.second} s={T.key} o={fin(f, t1)} />
          <Lbl x={O2[0] + 700 * Math.cos(27 * D2R) + 30} y={O2[1] - 700 * Math.sin(27 * D2R) - 30} t="10 km" c={C.second} s={T.key} o={fin(f, t10km)} />
        </g>
        <Keyword f={f} text="radians" at={[1100, 420]} appear={0} out={tArc - 18} />
        <Keyword f={f} text="arc length" at={[1100, 420]} appear={tArc} out={tEasy - 18} />
        <Keyword f={f} text="same angle, ten times the distance" at={[1080, 700]} appear={tSame} s={T.floor} targets={[[O2[0] + 330 * Math.cos(26 * D2R), O2[1] - 330 * Math.sin(26 * D2R)]]} />
        <Keyword f={f} text="keep this rule" at={[1080, 800]} appear={tKeep} s={T.floor} />
      </Svg>
      <TeX s={EQ_S07} x={1100} y={200} size={72} o={fin(f, tDiv + 40)} />
      <TeX s={String.raw`\theta=\dfrac{s}{r}`} x={1100} y={320} size={60} c={C.local} o={fin(f, tDiv) * fout(f, tEasy - 18)} />
      <CalcStack f={f} x={1300} y={500} size={56} rows={[
        { lhs: String.raw`2\pi\ \mathrm{rad}`, rhs: String.raw`=360^\circ,\quad 2\pi\approx6.283`, at: t57, out: tEasy - 18 },
        { lhs: String.raw`1\ \mathrm{rad}`, rhs: String.raw`=\dfrac{360^\circ}{2\pi}`, at: AT(k, 5, "three hundred and sixty"), out: tEasy - 18, h: 135 },
        { rhs: String.raw`=\dfrac{360^\circ}{6.283}\approx57.3^\circ`, at: AT(k, 5, "about fifty seven"), out: tEasy - 18, cont: true, h: 135 },
      ]} />
      {/* fix 1c C6: the turn in degrees, then the two rings, then the ratio */}
      {/* K6 k6z4: "=" column 40 px left (the "s = 50 km × 0.2 = 10 km" row ended at x 1866) */}
      <CalcStack f={f} x={1260} y={300} size={56} maxLines={3} rows={[
        { lhs: String.raw`0.2\ \mathrm{rad}`, rhs: String.raw`\approx0.2\times57.3^\circ\approx11.5^\circ`, at: AT(k, 7, "eleven and a half") },
        // fix 2 (fix1 review 2 Should 4, review 1 C4): each product's left side on the words that name it, "= …" on the spoken result
        // fix 3 (fix2 review C3): both arcs as "s = radius × angle" (the result carries its symbol: s as on the circle and in s = rθ),
        // so the two rows share a one-letter left side and line up; "= 1 km" / "= 10 km" fade in by colour on their spoken words
        { lhs: "s", rhs: String.raw`=5\ \mathrm{km}\times0.2` + tailIn(f, t1, "#e8ecf4", String.raw`=1\ \mathrm{km}`), at: AT(k, 7, "the radius times the angle") },
        { lhs: "s", rhs: String.raw`=50\ \mathrm{km}\times0.2` + tailIn(f, t10km, "#e8ecf4", String.raw`=10\ \mathrm{km}`), at: AT(k, 8, "fifty kilometres") },
        { lhs: String.raw`\dfrac{10\ \mathrm{km}}{1\ \mathrm{km}}`, rhs: String.raw`=\dfrac{50\ \mathrm{km}}{5\ \mathrm{km}}=10`, at: tSame, h: 130 },
      ]} />
    </Scene>
  );
};

export const SCENES_A: Record<string, React.FC> = {
  s00_title: S00, s01_hook: S01, s02_coordinates: S02, s03_cartesian_arrows: S03, s04_polar: S04, s05_polar_back: S05, s06_bearings: S06, s07_radians: S07,
};
void [fout, kmPx];
