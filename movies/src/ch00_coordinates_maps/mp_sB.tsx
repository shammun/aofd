// ch00_coordinates_maps scenes s08-s15: Mercator's step dy = a dφ / cos φ (maths block B), the add-up ladder and table, the natural
// log and y = a ln tan(π/4 + φ/2) tested against the sums, the centred-difference slope check, why the rhumb line is straight,
// the area price (100-km square, Greenland vs Africa), Equal Earth with the Sep 2026 ERA5 anomaly, and the three reasons.
// Numbers from data/mp.json only (CHECK_B below re-asserts every screen string); positions from the JS mapproj mirrors (mp_lib).
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Bracket, Pt, pulse } from "../house/kit/draw";
import { SourceBelow } from "../house/kit/frame";
import { CurvedLink } from "../house/kit/extras";
import { Part } from "../house/kit/tex";
import { GlobeCam } from "./kit_mp/globe";
import {
  AT, Arrow, CalcStack, ColourBar, D, D2R, Globe, HL, IMGS, K, Keyword, Layered, Lbl, OptTag, ProjMap, PV, RasterImg, Recall, SRC_BM, SRC_T2M, SS, Scene,
  SkipChip, Svg, TIS, TeX, XC, fin, fout, gLine, gdot, keepTime, llD, mapBox, mapPt, mix, poly, prog, psi, tissotD, win, eeOutline, coastD,
} from "./mp_lib";
import { EQ_S08, EQ_S09, EQ_S10, EQ_S11, EQ_S12, EQ_S13, cutAt } from "./mp_eq";

const L9 = D.ladder, LN = D.ln, SL = D.slope60, AR = D.areas;
const CHECK_B: [string, number, number, number][] = [
  ["h Brest", D.merc.h[0], 1.506, 5e-4], ["d167", D.merc.d[0], 167.4, 0.05], ["d222", D.merc.d[1], 222.4, 0.05], ["111.19*1.5059", 111.19 * 1.5059, 167.4, 0.05],
  ["sec5", L9.sec[0], 1.004, 5e-4], ["sec15", L9.sec[1], 1.035, 5e-4], ["sec25", L9.sec[2], 1.103, 5e-4], ["step1", L9.step[0], 0.175, 5e-4],
  ["step2", L9.step[1], 0.181, 5e-4], ["step3", L9.step[2], 0.193, 5e-4], ["tot2", L9.tot[1], 0.356, 5e-4], ["tot3 (0.356 + 0.193)", 0.356 + 0.193, 0.549, 1e-9],
  ["tot5", L9.tot[4], 1.01, 0.005], ["tot6", L9.tot[5], 1.31, 0.005], ["tot7", L9.tot[6], 1.73, 0.005], ["tot8", L9.tot[7], 2.4, 0.005], ["last", L9.step[8], 2, 0.01],
  ["km1", L9.step[0] * D.consts.a_km, 1116, 0.5], ["y60", LN.y60, 1.317, 5e-4], ["s1", LN.s1, 1.317, 5e-4], ["s10", LN.s10, 1.313, 5e-4], ["tan75", LN.tan75, 3.732, 5e-4],
  ["tanB", LN.tanB_s, 2.6325, 5e-5], ["yB", LN.yB_s, 0.968, 5e-4], ["yBkm", LN.yB_s_km, 6167, 0.5], ["0.968*6371", 0.968 * 6371, 6167, 0.5], ["ln 2.6325", Math.log(2.6325), 0.968, 5e-4],
  ["3.131*6371", 3.131 * 6371, 19950, 5], ["y85 4dp", SL.y85, 3.131, 5e-4], ["10/1013", 10 / 1013, 0.01, 5e-4],
  ...[1.221, 1.414, 1.743, 2.366, 3.864].map((c, i) => [`sec ${35 + 10 * i}`, L9.sec[3 + i], c, 5e-4] as [string, number, number, number]),
  ...[0.213, 0.247, 0.304, 0.413, 0.674].map((c, i) => [`step ${3 + i}`, L9.step[3 + i], c, 5e-4] as [string, number, number, number]),
  ...[0.762, 1.009, 1.313, 1.726, 2.400].map((c, i) => [`run ${3 + i}`, L9.tot[3 + i], c, 1.1e-3] as [string, number, number, number]),
  ["y61", SL.y61, 1.3524, 5e-5], ["y59", SL.y59, 1.2826, 5e-5], ["slope", SL.slope, 2.0, 0.005], ["y85", SL.y85, 3.13, 0.005], ["y85km", SL.y85_km, 19950, 1],
  ["slant", D.rh.slant, 4.9, 0.02], ["areal60", D.areas.areal[0], 4, 1e-6], ["arealLYB", D.areas.areal[1], 24, 0.01], ["Af/Gl (cited)", 30.4 / 2.17, 14, 0.05],
  ["Af/Gl (ours)", AR.af_Mkm2 / AR.gl_Mkm2, 14, 0.1], ["omega", D.ee.omega60_30, 31, 0.5],
];
CHECK_B.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

// ================================================================ s08 Mercator's north step: dy = a dφ / cos φ (maths block B starts)
const C8: Pt = [90, 800], R8 = 420;
const slicePt = (phi: number, r = R8): Pt => [C8[0] + r * Math.cos(phi * D2R), C8[1] - r * Math.sin(phi * D2R)];
const arcPts = (a0: number, a1: number, r = R8, n = 40): Pt[] => Array.from({ length: n + 1 }, (_, i) => slicePt(a0 + ((a1 - a0) * i) / n, r));
const Slice: React.FC<{ o?: number }> = ({ o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <path d={`M ${C8[0]} ${C8[1]} ${poly(arcPts(0, 90)).replace("M", "L")} Z`} fill="#22304e" stroke={C.local} strokeWidth={3} />
    <line x1={C8[0]} y1={C8[1]} x2={C8[0] + R8} y2={C8[1]} stroke={C.local} strokeWidth={2} strokeDasharray="10 8" />
  </g>
);
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = K("s08_mercator_dy");
  const t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11), t12 = SS(k, 12), t13 = SS(k, 13), t14 = SS(k, 14);
  const phi = D.consts.brest[0], dph = 6;                      // the step drawn 6° long (magnified)
  const pB = slicePt(phi), stepO = fin(f, t3);
  const u = 0.9;                                                // px per km for the three patches
  const pat = (x: number, w: number, h: number, c: string, o: number, lbl: string, ly: number) => o <= 0 ? null : <g opacity={o}>
    <rect x={x - w / 2} y={700 - h} width={w} height={h} fill={c} fillOpacity={0.25} stroke={c} strokeWidth={4} />
    <Lbl x={x} y={ly} t={lbl} c={C.muted} s={T.floor} a="middle" b={false} />
  </g>;
  const kB = D.merc.h[0];
  const hM = 111.2 * u * mix(1, kB, prog(f, t6 + 20, t6 + 70));
  return (
    <Scene>
      <Svg>
        <Slice />
        <path d={poly(arcPts(phi, phi + dph * prog(f, t3 + 10, t3 + 40), R8))} fill="none" stroke={C.first} strokeWidth={12} opacity={stepO} />
        {/* Part 1 lessons B1: the small step is drawn magnified, and says so */}
        <Lbl x={slicePt(phi + dph)[0] + 30} y={slicePt(phi + dph)[1] - 26} t="drawn 6° long" c={C.muted} s={T.floor} b={false} o={fin(f, t3 + 40)} />
        <circle cx={pB[0]} cy={pB[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={stepO} />
        <line x1={C8[0]} y1={C8[1]} x2={pB[0]} y2={pB[1]} stroke={C.local} strokeWidth={3} opacity={stepO} />
        {pat(590, 73.8 * u, 111.2 * u, C.first, fin(f, t4), "globe", 745)}
        {pat(760, 111.2 * u, 111.2 * u, C.second, fin(f, t5), "flat square", 800)}
        {pat(925, 111.2 * u, hM, C.gold, fin(f, t6), "Mercator", 745)}
        <g opacity={fin(f, t5 + 40)}><Bracket p={[760 - 50, 712]} q={[760 + 50, 712]} c={C.second} off={0} /></g>
        <Lbl x={760} y={560} t="$\times$ 1.5 wide" c={C.second} s={T.floor} a="middle" o={win(f, t5 + 40, t6 + 70)} />
        <g opacity={fin(f, t6 + 70)}><Bracket p={[990, 700]} q={[990, 700 - hM]} c={C.gold} off={0} /></g>
        <Lbl x={925} y={700 - hM - 34} t="$\times$ 1.5 tall" c={C.gold} s={T.floor} a="middle" o={fin(f, t6 + 70)} />
        <SkipChip f={f} k={k} to={keepTime("s12_rhumb_straight")} />
        <Keyword f={f} text="a formula for Mercator's map" at={[XC, 200]} s={T.floor} appear={0} out={t4 - 18} />
        <Keyword f={f} text="keep shapes: same stretch" at={[XC, 560]} s={T.floor} appear={t6} out={t9 - 18} c={C.gold} />
        <Keyword f={f} text="grows faster towards the pole" at={[XC, 820]} s={T.floor} appear={AT(k, 14, "slowly")} />
      </Svg>
      <TeX s={String.raw`a\,\Delta\varphi`} x={slicePt(phi + dph)[0] + 30} y={slicePt(phi + dph)[1] - 86} size={54} c={C.first} o={fin(f, t3 + 40)} />{/* build1 K6: off the step arc, above "drawn 6° long" */}
      <TeX s={String.raw`\varphi`} x={C8[0] + 90} y={C8[1] - 40} size={54} c={C.local} o={stepO} />
      <CalcStack f={f} x={XC + 210} y={200} size={56} maxLines={3} o={fout(f, t13 - 10, 12)} rows={[
        { lhs: String.raw`\Delta y_{\text{globe}}`, rhs: String.raw`=a\,\Delta\varphi`, at: AT(k, 4, "true length") },
        { lhs: String.raw`\Delta y_{\text{Mercator}}`, rhs: String.raw`=\dfrac{a\,\Delta\varphi}{\cos\varphi}`, at: t7 + 30, h: 120 },
        { lhs: String.raw`1^\circ\ \text{north}`, rhs: String.raw`=111.2\ \text{km}`, at: AT(k, 9, "a hundred") },
        { lhs: String.raw`\text{Brest}`, rhs: String.raw`=111.19\times1.5059`, at: AT(k, 10, "where the stretch"), c: C.gold, glow: HL(f, AT(k, 10, "one point five zero six")) },
        { rhs: String.raw`\approx167.4\ \text{km}`, at: AT(k, 10, "about a hundred"), c: C.gold, cont: true },
        { lhs: String.raw`60^\circ\text{N}`, rhs: String.raw`=111.2\times2`, at: AT(k, 11, "twice as long"), c: C.gold },
        { rhs: String.raw`=222.4\ \text{km}`, at: AT(k, 11, "about two hundred"), c: C.gold, cont: true },
      ]} />
      <TeX s={EQ_S08} x={XC} y={690} size={96} o={fin(f, t13)} />
      <Svg><Keyword f={f} text="$d$ instead of $\Delta$: a tiny step" at={[XC, 820]} s={T.floor} appear={t12} out={t14 - 18} /></Svg>
      {/* remake 2026-11-07 (R16): the true north step is Part 3's distance north */}
      <Recall f={f} tex="" name="distance north" part={3} x={XC} y={480} appear={AT(k, 4, "From Part 3")} out={t6 - 18} />
    </Scene>
  );
};

// ================================================================ s09 adding up the drawn steps (the ladder and the table)
const LX = 200, LY0 = 800, LS = 280;                            // ladder axis x, equator y, px per Earth radius
const ladY = (ya: number) => LY0 - ya * LS;
const Ladder: React.FC<{ f: number; x?: number; show: number[]; o?: number; brace?: number; open?: number; hl?: number; labels?: boolean }> = ({ f, x = LX, show, o = 1, brace = 0, open = 0, hl = -1, labels = true }) => {
  void f;
  if (o <= 0) return null;
  return <g opacity={o}>
    <line x1={x} y1={LY0 + 10} x2={x} y2={50} stroke={C.local} strokeWidth={3} />
    {L9.tot.slice(0, 8).map((tt: number, i: number) => { const y1 = ladY(tt), y0 = ladY(i ? L9.tot[i - 1] : 0); const op = show[i] ?? 0;
      return op > 0 ? <g key={i} opacity={op}>
        <rect x={x} y={y1} width={170} height={y0 - y1} fill={i % 2 ? "#2aa19866" : "#2aa19833"} stroke={i === hl ? C.gold : C.first} strokeWidth={i === hl ? 5 : 3} />
        {labels ? <Lbl x={x - 14} y={y1} t={`${10 * (i + 1)}°`} c={C.muted} s={T.floor} a="end" b={false} /> : null}
      </g> : null; })}
    {labels ? <Lbl x={x - 14} y={LY0} t="0°" c={C.muted} s={T.floor} a="end" b={false} /> : null}
    {open > 0 ? <g opacity={open}>
      <path d={`M ${x} ${ladY(2.4)} L ${x} 60 M ${x + 170} ${ladY(2.4)} L ${x + 170} 60`} stroke={C.gold} strokeWidth={4} fill="none" strokeDasharray="12 8" />
      <Arrow p={[x + 85, ladY(2.4) - 10]} q={[x + 85, 52]} color={C.gold} w={6} head={24} />
    </g> : null}
    {brace > 0 ? <g opacity={brace}><Bracket p={[x + 190, LY0]} q={[x + 190, ladY(2.4)]} c={C.gold} off={0} /></g> : null}
  </g>;
};
const TCOL = [1060, 1250, 1400, 1550, 1700];
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09_adding_steps");
  const t1 = SS(k, 1), t3 = SS(k, 3), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t11 = SS(k, 11), t12 = SS(k, 12), t13 = SS(k, 13), t14 = SS(k, 14);
  const r1 = AT(k, 6, "about zero point one seven five"), a50 = AT(k, 11, "one point zero one"), a60 = AT(k, 11, "one point three one"), a70 = AT(k, 11, "one point seven three"),
    a80 = AT(k, 11, "two point four");
  const blockAt = [r1, AT(k, 7, "the step is"), AT(k, 9, "the step is"), a50 - 20, a50, a60, a70, a80];
  const show = blockAt.map((a) => fin(f, a));
  const rowO = (a: number, next?: number) => fin(f, a) * (next !== undefined ? mix(1, 0.6, fin(f, next)) : 1);
  const cell = (c: number, y: number, t: string, o: number, col: string = C.key) => <Lbl x={TCOL[c]} y={y} t={t} c={col} s={46} o={o} />;
  // audit G1: the "speed up" rows 30-80° in full (step, middle, 1/cos, drawn, running total of the drawn steps shown)
  const FAST = [["30–40°", "35°", "1.221", "0.213", "0.762"], ["40–50°", "45°", "1.414", "0.247", "1.009"], ["50–60°", "55°", "1.743", "0.304", "1.313"],
    ["60–70°", "65°", "2.366", "0.413", "1.726"], ["70–80°", "75°", "3.864", "0.674", "2.400"]];
  const fTot = [SS(k, 10) + 20, a50, a60, a70, a80], fRow = [SS(k, 10), a50 - 40, a60 - 40, a70 - 40, a80 - 40];
  const RY = (i: number) => 415 + 52 * i;
  const SC: Pt = [560, 800], SR = 400;
  const sp = (a: number): Pt => [SC[0] + SR * Math.cos(a * D2R), SC[1] - SR * Math.sin(a * D2R)];
  return (
    <Scene>
      <Svg>
        <Ladder f={f} show={show} brace={fin(f, t12)} open={fin(f, AT(k, 13, "from eighty"))} />
        <path d={`M ${SC[0]} ${SC[1]} L ${SC[0] + SR} ${SC[1]} ${poly(Array.from({ length: 46 }, (_, i) => sp(2 * i))).replace("M", "L")} Z`} fill="#22304e" stroke={C.local} strokeWidth={3} />
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={poly(Array.from({ length: 11 }, (_, j) => sp(10 * i + j)))} fill="none" stroke={C.first} strokeWidth={10 + (i === 0 ? 4 * pulse(f, t5, 30) : 0)}
          opacity={show[i] * (i % 2 ? 1 : 0.6)} />)}
        <Lbl x={TCOL[0]} y={360} t="step" c={C.muted} s={T.floor} b={false} o={fin(f, t5)} />
        <Lbl x={TCOL[1]} y={360} t="middle" c={C.muted} s={T.floor} b={false} o={fin(f, t5)} />
        <Lbl x={TCOL[3]} y={360} t="drawn" c={C.muted} s={T.floor} b={false} o={fin(f, t5)} />
        <Lbl x={TCOL[4]} y={360} t="total" c={C.muted} s={T.floor} b={false} o={fin(f, t5)} />
        {cell(0, RY(0), "0–10°", rowO(t5, t7))}{cell(1, RY(0), "5°", rowO(AT(k, 5, "five degrees"), t7))}{cell(2, RY(0), "1.004", rowO(AT(k, 5, "one point zero zero four"), t7))}
        {cell(3, RY(0), "0.175", rowO(r1, t7))}{cell(4, RY(0), "0.175", rowO(r1, t7), C.gold)}
        {cell(0, RY(1), "10–20°", rowO(t7, t9))}{cell(1, RY(1), "15°", rowO(AT(k, 7, "fifteen"), t9))}{cell(2, RY(1), "1.035", rowO(AT(k, 7, "one point zero three five"), t9))}
        {cell(3, RY(1), "0.181", rowO(AT(k, 7, "the step is"), t9))}{cell(4, RY(1), "0.356", rowO(t8, t9), C.gold)}
        {cell(0, RY(2), "20–30°", rowO(t9, t11))}{cell(1, RY(2), "25°", rowO(t9, t11))}{cell(2, RY(2), "1.103", rowO(AT(k, 9, "one point one zero three"), t11))}
        {cell(3, RY(2), "0.193", rowO(AT(k, 9, "the step is"), t11))}{cell(4, RY(2), "0.549", rowO(AT(k, 9, "the total"), t11), C.gold)}
        {FAST.map((r, i) => <g key={i}>
          {r.slice(0, 4).map((t, c) => <g key={c}>{cell(c, RY(3 + i), t, rowO(fRow[i] + 8 * c, i < 4 ? fRow[i + 1] : undefined))}</g>)}
          {cell(4, RY(3 + i), r[4], rowO(fTot[i], i < 4 ? fRow[i + 1] : undefined), C.gold)}
        </g>)}
        <Lbl x={LX + 190} y={ladY(0.175) + 40} t="≈ 1116 km" c={C.first} s={T.floor} o={win(f, r1 + 20, t8)} />
        <Lbl x={LX + 190} y={110} t="≥ 2 more" c={C.gold} s={T.floor} o={fin(f, AT(k, 13, "at least two more"))} />
        <OptTag f={f} />
        <Keyword f={f} text="how high is latitude $\varphi$?" at={[XC, 170]} appear={0} out={t1 - 18} />
        <Keyword f={f} text="the steps grow" at={[XC, 300]} appear={t12} out={t14 - 18} c={C.gold} />
        <Keyword f={f} text="1599: Edward Wright," at={[XC, 170]} appear={AT(k, 14, "fifteen ninety nine")} />
        <Lbl x={XC} y={235} t="a table of added-up steps" c={C.key} s={T.floor} o={fin(f, AT(k, 14, "Edward Wright"))} />
      </Svg>
      <TeX s={EQ_S09} x={XC} y={192} size={62} o={fin(f, t1) * fout(f, t14 - 20, 12)} />
      <TeX s={String.raw`1/\cos`} x={TCOL[2]} y={360} size={44} c={C.muted} o={fin(f, t5)} />{/* the column head in TeX (symbol lint C5) */}
      <TeX s={String.raw`\Delta\varphi=10^\circ=0.1745\ \text{rad}`} x={XC} y={300} size={56} o={win(f, t3, t6 - 10)} />
      <TeX s={String.raw`0.1745\times1.004\approx0.175`} x={XC} y={300} size={56} o={win(f, t6 + 8, t12 - 18)} />
      <TeX s={String.raw`\times\dfrac{1}{\cos\varphi}`} x={LX + 205} y={ladY(1.2)} size={48} c={C.gold} o={fin(f, t12 + 10)} />{/* build1 K6: beside the brace, off the ladder */}
    </Scene>
  );
};

// ================================================================ s10 the natural log; y = a ln tan(π/4 + φ/2) matches the sums
const lnX = (x: number) => 110 + 105 * x, lnY = (y: number) => 300 - 120 * y;
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_ln_formula");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10),
    t11 = SS(k, 11), t12 = SS(k, 12), t13 = SS(k, 13), t14 = SS(k, 14), t15 = SS(k, 15), t16 = SS(k, 16);
  const gO = fin(f, t1) * fout(f, t8 - 10, 14);
  const curve = poly(Array.from({ length: 80 }, (_, i) => { const x = 0.15 + (3.85 * i) / 79; return [lnX(x), lnY(Math.log(x))] as Pt; }));
  const lad = 680;
  const yBr = LY0 - LN.yB * LS, yPc = LY0 - D.pc.brest_rad[0] * LS;
  return (
    <Scene>
      <Svg>
        <Ladder f={f} x={lad} show={[1, 1, 1, 1, 1, 1, 1, 1]} o={mix(0.45, 1, fin(f, t8))} labels={false} />
        <g opacity={gO}>
          <line x1={lnX(0)} y1={lnY(0)} x2={lnX(4.1)} y2={lnY(0)} stroke={C.muted} strokeWidth={3} />
          <line x1={lnX(0)} y1={lnY(-1.3)} x2={lnX(0)} y2={lnY(1.6)} stroke={C.muted} strokeWidth={3} />
          <path d={curve} fill="none" stroke={C.first} strokeWidth={6} />
          <circle cx={lnX(1)} cy={lnY(0)} r={10} fill={C.gold} opacity={fin(f, t4)} />
          <circle cx={lnX(Math.E)} cy={lnY(1)} r={10} fill={C.gold} opacity={fin(f, t5)} />
          <line x1={lnX(Math.E)} y1={lnY(0)} x2={lnX(Math.E)} y2={lnY(1)} stroke={C.gold} strokeWidth={3} strokeDasharray="8 6" opacity={fin(f, t5)} />
        </g>
        <line x1={lad - 60} y1={yBr} x2={lad + 230} y2={yBr} stroke={C.gold} strokeWidth={6} opacity={fin(f, t15)} />
        <Lbl x={lad - 70} y={yBr - 22} t="≈ 6167 km" c={C.gold} s={T.floor} a="end" o={fin(f, AT(k, 15, "about six thousand"))} />
        <line x1={lad - 60} y1={yPc} x2={lad + 230} y2={yPc} stroke={C.local} strokeWidth={6} strokeDasharray="12 8" opacity={fin(f, t16)} />
        <Lbl x={lad - 70} y={yPc + 30} t="5382 km" c={C.local} s={T.floor} a="end" o={fin(f, t16)} />
        <OptTag f={f} />
        <Keyword f={f} text="an exact answer" at={[XC, 160]} appear={0} out={t1 - 18} />
        <Keyword f={f} text="natural logarithm: ln" at={[XC, 160]} appear={t1} out={t6 - 18} />
        <Keyword f={f} text="$e$ to what power gives $x$?" at={[XC, 360]} s={T.floor} appear={t3} out={t6 - 18} />
        <Keyword f={f} text="test it on the table" at={[XC, 360]} s={T.floor} appear={t8} out={t9 - 18} />
        <Lbl x={lnX(1)} y={lnY(0) + 40} t="1" c={C.gold} s={T.floor} a="middle" o={gO * fin(f, t4)} />
        <Lbl x={lnX(Math.E)} y={lnY(0) + 40} t="$e$" c={C.gold} s={T.floor} a="middle" o={gO * fin(f, t5)} />
        <Lbl x={lnX(4.1) + 10} y={lnY(0) - 30} t="$x$" c={C.muted} s={T.floor} o={gO} />
        <Lbl x={lnX(3.2)} y={lnY(0.72)} t="$\ln x$" c={C.first} s={T.floor} o={gO} />
        <Lbl x={1460} y={680} t="same ✓" c={C.gold} s={T.key} o={win(f, AT(k, 12, "the same"), t13 - 12)} />
      </Svg>
      {/* remake 2026-11-07 (R16): adding up tiny steps = Part 3's integration */}
      <Recall f={f} tex="" name="integration" part={3} x={XC} y={250} appear={AT(k, 0, "the integration")} out={t2 - 14} />
      <TeX s={String.raw`e\approx2.718`} x={XC} y={260} size={68} o={win(f, t2, t6 - 18)} />
      <TeX s={String.raw`\ln 1=0`} x={XC} y={460} size={68} o={win(f, t4, t6 - 18)} />
      <TeX s={String.raw`\ln e=1`} x={XC + 330} y={460} size={68} o={win(f, t5, t6 - 18)} />
      <TeX s={EQ_S10} x={XC} y={200} size={66} o={fin(f, t6)} />
      <TeX s={String.raw`\dfrac{\pi}{4}\ \text{rad}=45^\circ`} x={XC} y={345} size={56} c={C.gold} o={win(f, t7, t8 - 20)} />
      <CalcStack f={f} x={XC + 10} y={400} size={54} maxLines={3} rows={[
        { rhs: String.raw`45^\circ+60^\circ/2=75^\circ`, at: AT(k, 9, "adding half") },
        { rhs: String.raw`\tan 75^\circ\approx3.732`, at: t10, glow: HL(f, AT(k, 10, "three point seven")) },
        { rhs: String.raw`\ln 3.732\approx1.317`, at: AT(k, 10, "the l n of that") },
        { rhs: String.raw`10^\circ\text{ steps: }1.313`, at: AT(k, 11, "one point three one three") },
        { rhs: String.raw`1^\circ\text{ steps: }1.317`, at: AT(k, 12, "one point three one seven") },
        { rhs: String.raw`45^\circ+48.4^\circ/2=69.2^\circ`, at: t13 },
        { rhs: String.raw`\tan 69.2^\circ\approx2.6325`, at: t14, glow: HL(f, AT(k, 14, "two point six")) },
        { rhs: String.raw`\ln 2.6325\approx0.968`, at: AT(k, 14, "its l n") },
        { rhs: String.raw`0.968\times6371\approx6167\ \text{km}`, at: AT(k, 15, "about six thousand") - 20, c: C.gold },
      ]} />
      <TeX s={String.raw`0.968\,a`} x={lad + 240} y={yBr} size={50} c={C.gold} o={fin(f, t15)} />
    </Scene>
  );
};

// ================================================================ s11 the slope check (centred difference at 60°), y(0) = 0, the pole at infinity
const gx = (phi: number) => 140 + 9.2 * phi, gy = (ya: number) => 800 - 190 * ya;
const ZB = { x: 170, y: 90, w: 520, h: 300, p0: 57.5, p1: 64.5, y0: 1.15, y1: 1.52 };   // build1 K6: wider (the 0.0698 label inside)
const zx = (phi: number) => ZB.x + ((phi - ZB.p0) / (ZB.p1 - ZB.p0)) * ZB.w, zy = (ya: number) => ZB.y + ZB.h - ((ya - ZB.y0) / (ZB.y1 - ZB.y0)) * ZB.h;
const V11: PV = { cx: 540, cy: 450, s: 66 };
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_slope_check");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t10 = SS(k, 10), t11 = SS(k, 11), t13 = SS(k, 13), t14 = SS(k, 14);
  const gO = fout(f, t14 + 10, 20), mO = fin(f, t14 + 30, 20);
  const yy = (phi: number) => psi(phi);
  const cv = poly(Array.from({ length: 87 }, (_, i) => [gx(i), gy(yy(i))] as Pt));
  const zc = poly(Array.from({ length: 41 }, (_, i) => { const p = ZB.p0 + ((ZB.p1 - ZB.p0) * i) / 40; return [zx(p), zy(yy(p))] as Pt; }));
  const zO = fin(f, t2 + 30) * gO;
  return (
    <Scene>
      <Svg o={gO}>
        <line x1={gx(0)} y1={gy(0)} x2={gx(92)} y2={gy(0)} stroke={C.muted} strokeWidth={3} />
        <line x1={gx(0)} y1={gy(0)} x2={gx(0)} y2={gy(3.55)} stroke={C.muted} strokeWidth={3} />
        {[0, 30, 60, 85].map((p) => <g key={p}><line x1={gx(p)} y1={gy(0)} x2={gx(p)} y2={gy(0) + 12} stroke={C.muted} strokeWidth={3} />
          <Lbl x={gx(p)} y={gy(0) + 40} t={`${p}°`} c={C.muted} s={52} a="middle" b={false} /></g>)}
        {[1, 2, 3].map((v) => <g key={v}><line x1={gx(0) - 12} y1={gy(v)} x2={gx(0)} y2={gy(v)} stroke={C.muted} strokeWidth={3} />
          <Lbl x={gx(0) - 20} y={gy(v)} t={`${v}`} c={C.muted} s={52} a="end" b={false} /></g>)}
        <Lbl x={gx(0) - 20} y={gy(3.62)} t="$y/a$" c={C.muted} s={T.floor} a="end" b={false} />{/* build1 K6: left of the axis, clear of the inset */}
        <path d={cv} fill="none" stroke={C.first} strokeWidth={6} />
        <Arrow p={[gx(85.5), gy(3.2)]} q={[gx(86.5), gy(3.62)]} color={C.first} w={6} head={24} o={fin(f, t11)} />
        <circle cx={gx(0)} cy={gy(0)} r={12 + 8 * pulse(f, t10 + 20, 40)} fill={C.gold} opacity={fin(f, t10)} />
        <circle cx={gx(85)} cy={gy(SL.y85)} r={10} fill={C.gold} opacity={fin(f, t13)} />
        {[59, 61].map((p) => <circle key={p} cx={gx(p)} cy={gy(yy(p))} r={8} fill={C.gold} opacity={fin(f, p === 61 ? t3 : t4)} />)}
        <g opacity={zO}>
          <rect x={gx(ZB.p0)} y={gy(ZB.y1)} width={gx(ZB.p1) - gx(ZB.p0)} height={gy(ZB.y0) - gy(ZB.y1)} fill="none" stroke={C.gold} strokeWidth={2} />
          <line x1={gx(ZB.p0)} y1={gy(ZB.y1)} x2={ZB.x} y2={ZB.y + ZB.h} stroke={C.gold} strokeWidth={1.5} strokeDasharray="6 6" />
          <rect x={ZB.x} y={ZB.y} width={ZB.w} height={ZB.h} fill="#1b2540" stroke={C.gold} strokeWidth={3} />
          <path d={zc} fill="none" stroke={C.first} strokeWidth={5} />
          <circle cx={zx(59)} cy={zy(SL.y59)} r={9} fill={C.gold} /><circle cx={zx(61)} cy={zy(SL.y61)} r={9} fill={C.gold} />
          <line x1={zx(59)} y1={zy(SL.y59)} x2={zx(61)} y2={zy(SL.y61)} stroke={C.gold} strokeWidth={4} opacity={fin(f, t5)} />
          <g opacity={fin(f, t5)}>
            <Bracket p={[zx(59), zy(SL.y59) + 20]} q={[zx(61), zy(SL.y59) + 20]} c={C.second} off={0} />
            <Bracket p={[zx(61) + 20, zy(SL.y59)]} q={[zx(61) + 20, zy(SL.y61)]} c={C.first} off={0} />
          </g>
        </g>
      </Svg>
      <ProjMap id="s11m" v={V11} name="mc" latTop={85} img={IMGS.mc} coast={0.5} o={mO}
        over={() => <g>{[80, 85].map((la) => { const y = mapPt(V11, "mc", la, 0)[1]; const x = V11.cx + Math.PI * V11.s;
          return <g key={la}><line x1={x} y1={y} x2={x + 14} y2={y} stroke={C.muted} strokeWidth={3} /><Lbl x={x + 22} y={y + (la === 85 ? -14 : 14)} t={`${la}°`} c={C.muted} s={T.floor} b={false} /></g>; })}</g>} />
      <Svg>
        <OptTag f={f} />
        <Keyword f={f} text="right everywhere?" at={[XC, 160]} appear={0} out={t1 - 18} />
        <Keyword f={f} text="centred difference at 60°" at={[XC, 160]} s={T.floor} appear={t2} out={t7 - 18} />
        <Lbl x={1600} y={720} t="same ✓" c={C.gold} s={T.key} o={win(f, t7 + 20, t10 - 10)} />
        <Keyword f={f} text="the pole: infinitely far up" at={[XC, 160]} s={T.floor} appear={t11 + 20} out={t14 - 18} />
        <Keyword f={f} text="cut off past 80°" at={[XC, 160]} appear={t14} c={C.gold} />
      </Svg>
      <TeX s={String.raw`0.0698`} x={zx(61) + 46} y={(zy(SL.y59) + zy(SL.y61)) / 2} size={46} c={C.first} o={zO * fin(f, t5)} />
      <TeX s={String.raw`0.0349\ \text{rad}`} x={(zx(59) + zx(61)) / 2} y={zy(SL.y59) + 58} size={46} c={C.second} ax={0.5} o={zO * fin(f, t5)} />
      <TeX s={String.raw`3.13\,a`} x={gx(85) - 20} y={gy(SL.y85) + 10} size={52} c={C.gold} ax={1} o={gO * fin(f, t13)} />
      <TeX s={String.raw`\text{slope}=\dfrac{1}{\cos\varphi}`} x={XC} y={270} size={60} c={C.key} o={win(f, t1, t3 - 10)} />
      <CalcStack f={f} x={XC + 10} y={250} size={56} maxLines={3} o={fout(f, t14 - 10, 12)} rows={[
        { rhs: String.raw`y(61^\circ)/a\approx1.3524`, at: AT(k, 3, "one point three") },
        { rhs: String.raw`y(59^\circ)/a\approx1.2826`, at: AT(k, 4, "one point two") },
        { rhs: String.raw`\dfrac{0.0698}{0.0349}\approx2.00`, at: AT(k, 6, "about two"), h: 145 },
        { rhs: String.raw`\tan 45^\circ=1,\ \ \ln1=0\ \Rightarrow\ y=0`, at: t10 + 30, size: 48 },
        { rhs: String.raw`85^\circ:\ y\approx3.131\,a`, at: AT(k, 13, "three point one three"), c: C.gold },
        { rhs: String.raw`3.131\times6371\approx19\,950\ \text{km}`, at: AT(k, 13, "about nineteen"), c: C.gold, cont: true },
      ]} />
      <TeX s={EQ_S11} x={XC} y={620} size={60} o={win(f, t7, t10 - 10)} />
      <SourceBelow text={SRC_BM} pic={mapBox(V11, "mc", 85)} w={760} o={mO} name="s11 src" />
    </Scene>
  );
};

// ================================================================ s12 why the rhumb line is straight (the "keep this" line first)
const G12 = { x: 40, y: 30, w: 460, h: 440 };
const CAM12: GlobeCam = { lat: 42, lon: -58, dist: 3.5 };
const V12: PV = { cx: 560 + 440 * (130 / 140), cy: 160 + 1.75 * 180, s: 180 };
const B12 = { x: 560, y: 160, w: 440, h: 320 };
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12_rhumb_straight");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11), t12 = SS(k, 12),
    t13 = SS(k, 13), t14 = SS(k, 14);
  const ladO = fout(f, t2 - 10, 20), sO = fin(f, t2, 20);
  const eq12 = cutAt(EQ_S12, "=");
  const R = D.routes;
  const rhFlat: number[] = [], gcFlat: number[] = [];
  (R.rh[0] as number[]).forEach((la, i) => rhFlat.push(la, R.rh[1][i]));
  (R.gc[0] as number[]).forEach((la, i) => gcFlat.push(la, R.gc[1][i]));
  const rhDraw = prog(f, t12, t12 + 60);
  const nShow = Math.max(2, Math.round(rhDraw * (rhFlat.length / 2)));
  // the zoomed piece (inset): west 4.9 for each 1 south (bearing 258.5°)
  const TI: Pt = [380, 640], ws = 50;
  const tri = (o: Pt, sc: number, c = C.local) => <g>
    <line x1={o[0]} y1={o[1]} x2={o[0] - D.rh.slant * ws * sc} y2={o[1]} stroke={C.second} strokeWidth={7} />
    <line x1={o[0] - D.rh.slant * ws * sc} y1={o[1]} x2={o[0] - D.rh.slant * ws * sc} y2={o[1] + ws * sc} stroke={C.first} strokeWidth={7} />
    <line x1={o[0]} y1={o[1]} x2={o[0] - D.rh.slant * ws * sc} y2={o[1] + ws * sc} stroke={c} strokeWidth={6} />
  </g>;
  const lo40 = (R.rh[1] as number[])[(R.rh[0] as number[]).findIndex((la: number) => la <= 40)], lo50 = (R.rh[1] as number[])[(R.rh[0] as number[]).findIndex((la: number) => la <= 47)];
  const pm40 = mapPt(V12, "mc", 40, lo40), pm47 = mapPt(V12, "mc", 47, lo50);
  return (
    <Scene>
      <Svg o={ladO}><Ladder f={f} x={260} show={[1, 1, 1, 1, 1, 1, 1, 1]} open={1} /></Svg>
      <Globe cam={CAM12} box={G12} o={sO} grat={0.25} coast={0.4} over={(G) => <>
        {gLine(G, R.rh[0], R.rh[1], C.local, 7, fin(f, t3))}
        {gLine(G, R.gc[0], R.gc[1], C.gold, 7, fin(f, t14))}
        {gdot(G, R.lon[0], R.lon[1], C.key, 9, fin(f, t3))}{gdot(G, R.lax[0], R.lax[1], C.key, 9, fin(f, t3))}
        {(() => { const q = G.p(45, -60); return <circle cx={q[0]} cy={q[1]} r={22} fill="none" stroke={C.gold} strokeWidth={4} opacity={win(f, t4, t8)} />; })()}
      </>} />
      <ProjMap id="s12m" v={V12} name="mc" box={B12} img={IMGS.mc} coast={0.5} o={sO}>
        {() => <>
          <path d={llD(V12, "mc", rhFlat.slice(0, nShow * 2))} fill="none" stroke={C.local} strokeWidth={7} opacity={fin(f, t12)} />
          <path d={llD(V12, "mc", gcFlat)} fill="none" stroke={C.gold} strokeWidth={7} opacity={fin(f, t13)} />
          {[pm40, pm47].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={9} fill={C.gold} opacity={win(f, t9, t12)} />)}
        </>}
      </ProjMap>
      <Svg>
        <g opacity={win(f, t4, t12 + 30, 14)}>
          <rect x={80} y={560} width={420} height={250} rx={12} fill="#1b2540" stroke={C.gold} strokeWidth={3} />
          {tri(TI, 1)}
          {/* the compass bearing: clockwise from north to the route's direction (258.5°) */}
          <path d={poly(Array.from({ length: 40 }, (_, i) => { const a = (90 - (D.routes.brg * i) / 39) * D2R; return [TI[0] + 60 * Math.cos(a), TI[1] - 60 * Math.sin(a)] as Pt; }))} fill="none" stroke={C.gold} strokeWidth={4} />
          <Lbl x={TI[0] - D.rh.slant * ws / 2} y={TI[1] - 30} t="west 4.9" c={C.second} s={T.floor} a="middle" />
          <Lbl x={TI[0] - D.rh.slant * ws - 14} y={TI[1] + ws / 2 + 60} t="south 1" c={C.first} s={T.floor} a="start" />
          {/* Part 1 lessons B1: the zoom box says what it is (the gold ring on the globe and the gold link show where it comes from) */}
          <Lbl x={90} y={842} t="magnified" c={C.muted} s={T.floor} b={false} />
        </g>
        <g opacity={win(f, t9, t14, 14)}>
          {tri([780, 600], 0.62 * D.rh.k40)}
          {tri([980, 690], 0.62 * D.rh.k50)}
          <Lbl x={560} y={820} t="both legs $\times\,1/\cos\varphi$: same slant" c={C.gold} s={T.floor} o={fin(f, t10)} />
        </g>
        <line x1={mapPt(V12, "mc", R.lon[0], R.lon[1])[0]} y1={mapPt(V12, "mc", R.lon[0], R.lon[1])[1] - 3} x2={mapPt(V12, "mc", R.lax[0], R.lax[1])[0]} y2={mapPt(V12, "mc", R.lax[0], R.lax[1])[1] - 3}
          stroke={C.gold} strokeWidth={2} strokeDasharray="4 8" opacity={win(f, t12 + 60, t13)} />
        <Keyword f={f} text="if you skipped, keep this:" at={[XC, 110]} appear={0} out={t2 - 18} c={C.gold} />
        <Keyword f={f} text="never shows the poles" at={[XC, 360]} s={T.floor} appear={AT(k, 1, "never show")} out={t2 - 18} />
        {/* remake 2026-11-07 (R16): the rhumb line (and its 258.5° from London to Los Angeles) is Part 6's: Recall label below */}
        <Keyword f={f} text="same slant → straight line" at={[XC, 620]} appear={t12} out={t14 - 18} c={C.gold} />
        <Keyword f={f} text="great circle: curved here" at={[XC, 700]} s={T.floor} appear={t13} out={t14 - 18} />
        <Keyword f={f} text="globe ↔ map: they swap looks" at={[XC, 620]} s={T.floor} appear={t14} />
      </Svg>
      <TeX s={String.raw`\text{each strip}\times\dfrac{1}{\cos\varphi}`} x={XC} y={250} size={60} c={C.key} o={win(f, t1, t2 - 18)} />
      <Recall f={f} tex="" name="rhumb line, one bearing" part={6} x={XC} y={110} appear={AT(k, 3, "as we saw in Part 6")} out={t12 - 18} />
      {/* build1 K6: 250 / 360 / 480 -> 280 / 385 / 495 (clear of the two-line Recall at 110) */}
      <TeX s={eq12[0]} x={XC} y={280} size={56} o={win(f, t7, t12 - 18)} />
      <TeX s={"=" + eq12[1]} x={XC} y={385} size={56} o={win(f, t7 + 10, t12 - 18)} />
      <TeX s={String.raw`\dfrac{4.9\,k}{1\,k}=4.9`} x={XC} y={495} size={64} c={C.gold} o={win(f, t10, t12 - 18)} />
      <CalcStack f={f} x={XC} y={560} size={44} maxLines={4} o={fout(f, t8 - 12)} rows={[
        { rhs: String.raw`\text{check: }y=a\ln\tan(45^\circ+\varphi/2)`, at: t7, c: C.muted },
        { rhs: String.raw`\text{London }1.0523\,a,\ \ \text{LA }0.6327\,a`, at: t7 + 30 },
        { rhs: String.raw`\Delta y=-0.4196\,a,\ \ \Delta x=-2.0614\,a`, at: t7 + 60 },
        { rhs: String.raw`2.0614\div0.4196\approx4.9\Rightarrow258.5^\circ`, at: AT(k, 7, "four point nine"), c: C.gold },
      ]} />
      {/* build1 K6: one line for the globe and the map (same source), under both; the two wrapped lines reached the inset */}
      <SourceBelow text={SRC_BM} pic={{ x: G12.x, y: G12.y, w: B12.x + B12.w - G12.x, h: B12.y + B12.h - G12.y }} x={380} w={620} o={sO} name="s12 src" />
      <Svg><CurvedLink f={f} from={[300, 560]} to={[mix(G12.x, G12.x + G12.w, 0.4), 330]} start={t4 + 10} end={t8} bend={30} /></Svg>
    </Scene>
  );
};

// ================================================================ s13 the price: areas (100-km square, k², Greenland vs Africa)
const V13: PV = { cx: 540, cy: 430, s: 118 };
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = K("s13_area_stretch");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11);
  const sqO = mix(0.35, 1, fin(f, t2)) * fout(f, t8 - 10, 14), mapO = fin(f, t8 + 6, 16);   // the square from frame 0 (no empty half), full on its words
  const g = prog(f, t4 + 10, t4 + 70), u = 1.3;
  const A: Pt = [180, 560], Bp: Pt = [480, 560];
  const lift = prog(f, t9, t9 + 40);
  const out = (L: number[], c: string, o: number) => <path d={llD(V13, "mc", L, undefined, 0, 85, true)} fill={c} fillOpacity={0.3} stroke={c} strokeWidth={4} opacity={o} />;
  const trueD = (L: number[], c: Pt, s: number) => poly(Array.from({ length: L.length / 2 }, (_, i) => [c[0] + L[2 * i] * s, c[1] - L[2 * i + 1] * s] as Pt)) + "Z";
  const ps: Part[] = [{ t: String.raw`\text{area stretch}=k\times k` }, { t: String.raw`=\dfrac{1}{\cos^2\varphi}` }];
  if ((ps[0].t + ps[1].t) !== EQ_S13) throw new Error("s13 parts drift from EQ_S13");
  return (
    <Scene>
      <Svg o={sqO}>
        <rect x={A[0]} y={A[1] - 100 * u} width={100 * u} height={100 * u} fill={C.first} fillOpacity={0.3} stroke={C.first} strokeWidth={5} />
        <Lbl x={A[0] + 50 * u} y={A[1] + 40} t="100 km" c={C.first} s={T.floor} a="middle" />
        <Lbl x={A[0] + 50 * u} y={A[1] - 100 * u - 40} t="on the globe, 60° N" c={C.muted} s={T.floor} a="middle" b={false} />
        <g opacity={fin(f, t4)}>
          <rect x={Bp[0]} y={Bp[1] - 100 * u * (1 + g)} width={100 * u * (1 + g)} height={100 * u * (1 + g)} fill={C.gold} fillOpacity={0.25} stroke={C.gold} strokeWidth={5} />
          <Bracket p={[Bp[0], Bp[1] + 20]} q={[Bp[0] + 100 * u * (1 + g), Bp[1] + 20]} c={C.gold} off={0} />
          <Bracket p={[Bp[0] + 100 * u * (1 + g) + 20, Bp[1]]} q={[Bp[0] + 100 * u * (1 + g) + 20, Bp[1] - 100 * u * (1 + g)]} c={C.gold} off={0} />
          <Lbl x={Bp[0] + 50 * u * (1 + g)} y={Bp[1] + 60} t="$\times$ 2 → 200 km" c={C.gold} s={T.floor} a="middle" o={fin(f, t4 + 60)} />
          <Lbl x={Bp[0] + 130} y={250} t="on Mercator's map" c={C.muted} s={T.floor} a="middle" b={false} />
        </g>
        <Lbl x={A[0] + 50 * u} y={A[1] + 110} t="10 000 km²" c={C.first} s={T.key} a="middle" o={fin(f, t3)} />
        <Lbl x={Bp[0] + 190} y={A[1] + 140} t="40 000 km²: 4 times" c={C.gold} s={T.key} a="middle" o={fin(f, AT(k, 5, "four times"))} />
      </Svg>
      {/* build1 review 1 M2: Africa as ONE dissolved outline (areas.af_union: shapely unary_union of the NE admin-0 parts, mainland + Madagascar),
          on the map and at true size; the gold "≈ 14×" beside the true-size pair on "fourteen times" */}
      <ProjMap id="s13m" v={V13} name="mc" img={IMGS.mc} imgO={0.8} coast={0.45} o={mapO}>
        {() => <>{(AR.gl as number[][]).map((L, i) => <g key={`g${i}`}>{out(L, C.first, 1 - 0.6 * lift)}</g>)}{(AR.af_union as number[][]).map((L, i) => <g key={`a${i}`}>{out(L, C.second, 1 - 0.6 * lift)}</g>)}</>}
      </ProjMap>
      <Svg>
        <g opacity={fin(f, t9) * 1}>
          <path d={(AR.gl_true as number[][]).map((L) => trueD(L, [1270, 620], 260)).join("")} fill={C.first} fillOpacity={0.45} stroke={C.first} strokeWidth={3} />
          <path d={(AR.af_union_true as number[][]).map((L) => trueD(L, [1600, 600], 260)).join("")} fill={C.second} fillOpacity={0.45} stroke={C.second} strokeWidth={3} />
        </g>
        <Lbl x={1270} y={720} t="2.17 million km²" c={C.first} s={T.floor} a="middle" o={fin(f, AT(k, 9, "two point one seven"))} />
        <Lbl x={1600} y={810} t="30.4 million km²" c={C.second} s={T.floor} a="middle" o={fin(f, AT(k, 9, "thirty point four"))} />
        <Lbl x={1376} y={600} t="≈ 14×" c={C.gold} s={T.key} a="middle" o={fin(f, AT(k, 10, "fourteen times"))} />
        <Lbl x={1270} y={530} t="Greenland" c={C.key} s={T.floor} a="middle" o={fin(f, t9)} />
        <Lbl x={1600} y={380} t="Africa" c={C.key} s={T.floor} a="middle" o={fin(f, t9)} />
        <Keyword f={f} text="conformal has a price" at={[XC, 110]} appear={0} out={t1 - 18} />
        <Keyword f={f} text="how much is an area stretched?" at={[XC, 110]} s={T.floor} appear={t1} out={t8 - 18} />
        <Keyword f={f} text="Greenland ≈ Africa on the map" at={[XC, 110]} s={T.floor} appear={t8} out={t11 - 18} />
        <Keyword f={f} text="true size, side by side:" at={[XC, 200]} s={T.floor} appear={t9} out={t11 - 18} />
        <Keyword f={f} text="directions yes, sizes no" at={[XC, 110]} appear={t11} c={C.gold} />
      </Svg>
      <CalcStack f={f} x={XC} y={200} size={56} maxLines={2} o={fout(f, t8 - 10, 12)} rows={[
        { rhs: String.raw`100\times100=10\,000\ \text{km}^2`, at: t3 },
        { rhs: String.raw`200\times200=40\,000\ \text{km}^2`, at: AT(k, 5, "two hundred kilometres wide") },
      ]} />
      <TeX s={ps[0].t} x={XC} y={430} size={64} o={fin(f, t6) * fout(f, t8 - 10, 12)} />
      <TeX s={ps[1].t} x={XC + 330} y={560} size={64} o={fin(f, AT(k, 6, "which is one over")) * fout(f, t8 - 10, 12)} />
      <TeX s={String.raw`\text{Svalbard: }4.9\times4.9\approx24`} x={XC} y={690} size={60} c={C.gold} o={fin(f, AT(k, 7, "squaring it")) * fout(f, t8 - 10, 12)} />
      <TeX s={String.raw`30.4\div2.17\approx14`} x={XC} y={300} size={64} c={C.gold} o={fin(f, t10) * fout(f, t11 - 18)} />
      <SourceBelow text="Image: NASA Blue Marble NG · borders: Natural Earth" pic={mapBox(V13, "mc", 80)} w={760} o={mapO} name="s13 src" />
    </Scene>
  );
};

// ================================================================ s14 Equal Earth vs Mercator with the Sep 2026 anomaly; pick the map for the job
const VM14: PV = { cx: 420, cy: 444, s: 108.2 }, VE14: PV = { cx: 1340, cy: 444, s: 184.8 };
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14_equal_earth");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10),
    t11 = SS(k, 11), t12 = SS(k, 12), t13 = SS(k, 13), t14 = SS(k, 14);
  const eeO = fin(f, t2, 20), anO = fin(f, t4, 20);
  const hiM = pulse(f, t7 + 10, 50), hiE = pulse(f, t8 + 10, 50);
  // build1 review 1 M4: the "far north" band (north of the Arctic Circle, 66.5° N) stays at 60 % while its sentences play, pulses on its
  // words, and is labelled; the anomaly rasters get Natural Earth coastlines on top (the ProjMap coast sits under the raster)
  const bandM = Math.max(hiM, 0.6 * win(f, t7 + 10, t9 - 10, 12)), bandE = Math.max(hiE, 0.6 * win(f, t8 + 10, t9 - 10, 12));
  const arcM = mapPt(VM14, "mc", 66.5, 0), arcE = mapPt(VE14, "ee", 66.5, -180);
  const ARC = "Arctic Circle · 66.5° N";
  const band = (v: PV, name: "mc" | "ee", la0: number, la1: number) => { const pts: Pt[] = [];
    for (let lo = -180; lo <= 180; lo += 5) pts.push(mapPt(v, name, la0, Math.min(lo, 179.999)));
    for (let lo = 180; lo >= -180; lo -= 5) pts.push(mapPt(v, name, la1, Math.min(lo, 179.999)));
    return poly(pts) + "Z"; };
  const T2 = D.t2m;
  return (
    <Scene>
      <ProjMap id="s14m" v={VM14} name="mc" img={IMGS.mc} imgO={1 - anO} coast={0.5}>
        {() => <>
          <RasterImg v={VM14} name="mc" href={IMGS.t2m_mc} o={anO} />
          <path d={coastD(VM14, "mc", undefined, 0, 82)} fill="none" stroke={C.key} strokeOpacity={0.5 * anO} strokeWidth={1.8} />
          <path d={band(VM14, "mc", 66.5, 80)} fill="none" stroke={C.gold} strokeWidth={6} opacity={bandM} />
          <Lbl x={VM14.cx} y={arcM[1] - 30} t={ARC} c={C.gold} s={T.floor} a="middle" o={bandM} />
          <path d={tissotD(VM14, "mc", TIS.n60e30)} fill={C.gold} fillOpacity={0.35} stroke={C.gold} strokeWidth={4} opacity={fin(f, t10)} />
        </>}
      </ProjMap>
      <ProjMap id="s14e" v={VE14} name="ee" clipEllipse sea={null} coast={0.5 * eeO} frame={0.8} img={null}>
        {() => <>
          <RasterImg v={VE14} name="ee" href={IMGS.ee} o={eeO * (1 - anO)} />
          <RasterImg v={VE14} name="ee" href={IMGS.t2m_ee} o={anO} />
          <path d={coastD(VE14, "ee")} fill="none" stroke={C.key} strokeOpacity={0.5 * anO} strokeWidth={1.8} />
          <g opacity={fin(f, t3) * fout(f, t4, 14)}>
            {(D.areas.gl as number[][]).map((L, i) => <path key={`g${i}`} d={llD(VE14, "ee", L, undefined, 0, 89.9, true)} fill="none" stroke={C.first} strokeWidth={4} />)}
            {(D.areas.af_union as number[][]).map((L, i) => <path key={`a${i}`} d={llD(VE14, "ee", L, undefined, 0, 89.9, true)} fill="none" stroke={C.second} strokeWidth={3} />)}
          </g>
          <path d={band(VE14, "ee", 66.5, 90)} fill="none" stroke={C.gold} strokeWidth={6} opacity={bandE} />
          <Lbl x={arcE[0] + 60} y={arcE[1] + 34} t={ARC} c={C.gold} s={T.floor} o={bandE} />
          <path d={tissotD(VE14, "ee", TIS.n60e30)} fill={C.gold} fillOpacity={0.35} stroke={C.gold} strokeWidth={4} opacity={fin(f, t10)} />
        </>}
      </ProjMap>
      <Svg>
        <Lbl x={VM14.cx} y={150} t="Mercator" c={C.muted} s={T.floor} a="middle" b={false} />
        <Lbl x={VE14.cx} y={170} t="Equal Earth" c={C.muted} s={T.floor} a="middle" b={false} o={eeO} />
        <Keyword f={f} text="for climate maps: sizes matter" at={[80, 80]} appear={0} out={t2 - 18} />
        {/* build1 QA fix (halves FAIL 1130.5–1143.0 s): the empty Equal Earth outline carries the question the voice asks until the map arrives */}
        <Lbl x={VE14.cx} y={VE14.cy - 14} t="how much of the Earth" c={C.key} s={T.key} a="middle" o={fin(f, 6, 14) * fout(f, t2 - 18, 14)} />
        <Lbl x={VE14.cx} y={VE14.cy + 56} t="was warmer than usual?" c={C.key} s={T.key} a="middle" o={fin(f, 6, 14) * fout(f, t2 - 18, 14)} />
        <Keyword f={f} text="equal-area: Equal Earth, 2018" at={[80, 80]} appear={t2} out={t4 - 18} />
        <Keyword f={f} text="September 2026, drawn both ways" at={[80, 80]} appear={t4} out={t6 - 18} />
        <Keyword f={f} text="anomaly = difference from the usual" at={[80, 80]} appear={t6} out={t7 - 18} />
        <Keyword f={f} text="Mercator: the far north looks huge" at={[80, 80]} appear={t7} out={t8 - 18} />
        <Keyword f={f} text="Equal Earth: true size" at={[80, 80]} appear={t8} out={t9 - 18} />
        <Keyword f={f} text="the price: shape — angles off ≈ 31° at 60° N, 30° E" at={[80, 80]} appear={t9 + 10} out={t11 - 18} />
        <Lbl x={80} y={770} t="31°: from the" c={C.muted} s={T.floor} b={false} o={win(f, AT(k, 10, "thirty one"), t11 - 18)} />
        <Lbl x={80} y={825} t="Equal Earth formulas" c={C.muted} s={T.floor} b={false} o={win(f, AT(k, 10, "thirty one"), t11 - 18)} />
        <Keyword f={f} text="no flat map keeps both" at={[80, 80]} appear={t11} out={t12 - 18} />
        <Keyword f={f} text="pick the map for the job" at={[80, 80]} appear={t12} out={t13 - 18} c={C.gold} />
        <Keyword f={f} text="conformal → winds, directions · equal-area → amounts" at={[80, 80]} appear={t13} out={t14 - 18} />
        <Keyword f={f} text="more: How weather maps are made" at={[80, 80]} appear={AT(k, 14, "How weather maps")} />
        <ColourBar x={560} y={728} w={800} lut={T2.lut} lo={-6} hi={6} unit="K, vs 1991–2020" o={anO}
          ticks={[{ v: -6, t: "−6" }, { v: -3, t: "−3" }, { v: 0, t: "0" }, { v: 3, t: "3" }, { v: 6, t: "6" }]} />
      </Svg>
      <SourceBelow text={SRC_T2M} pic={{ x: 560, y: 728, w: 800, h: 80 }} w={800} o={anO} name="s14 src t2m" />
      <SourceBelow text={SRC_BM} pic={{ x: 80, y: 180, w: 1760, h: 528 }} w={1100} o={1 - anO} name="s14 src bm" />
      <Svg><path d={eeOutline(VE14)} fill="none" stroke={C.grid} strokeWidth={3} opacity={1 - eeO} /></Svg>
    </Scene>
  );
};

// ================================================================ s15 why so many coordinate systems: shape, measurement, meaning
const MX = [240, 540, 840], MY = 430;
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_why_many");
  const t1 = SS(k, 1), t2 = SS(k, 2), t4 = SS(k, 4), t5 = SS(k, 5), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10);
  const o1 = fout(f, t5 - 10, 14), o2 = win(f, t5, t8 - 10, 14), o3 = win(f, t8, t10 - 10, 14), o4 = fin(f, t10, 16);
  const a1 = (i: number) => fin(f, [AT(k, 4, "A ring"), AT(k, 4, "the Earth's surface"), AT(k, 4, "great circle")][i]);
  const a2 = (i: number) => fin(f, [AT(k, 7, "A radar"), AT(k, 7, "a weather station"), AT(k, 7, "a grid of")][i]);
  const a3 = (i: number) => fin(f, [AT(k, 9, "spin and inflow"), AT(k, 9, "along and across"), AT(k, 9, "round and in")][i]);
  const ring = (c: Pt, r: number) => <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={C.first} strokeWidth={6} />;
  const VT1: PV = { cx: 300, cy: 430, s: 60 }, VT2: PV = { cx: 760, cy: 430, s: 80 };
  return (
    <Scene>
      <Svg>
        <g opacity={o1}>
          <g opacity={mix(0.3, 1, a1(0))}>{ring([MX[0], MY], 110)}<circle cx={MX[0]} cy={MY} r={8} fill={C.gold} /></g>
          <g opacity={mix(0.3, 1, a1(1))}><circle cx={MX[1]} cy={MY} r={110} fill="#22304e" stroke={C.local} strokeWidth={4} /><ellipse cx={MX[1]} cy={MY} rx={110} ry={30} fill="none" stroke={C.local} strokeWidth={2} /></g>
          <g opacity={mix(0.3, 1, a1(2))}><circle cx={MX[2]} cy={MY} r={110} fill="none" stroke={C.local} strokeWidth={3} />
            <path d={`M ${MX[2] - 100} ${MY + 30} Q ${MX[2]} ${MY - 110} ${MX[2] + 100} ${MY + 20}`} fill="none" stroke={C.gold} strokeWidth={7} /></g>
        </g>
        <g opacity={o2}>
          <g opacity={mix(0.3, 1, a2(0))}>{[40, 75, 110].map((r) => <circle key={r} cx={MX[0]} cy={MY} r={r} fill="none" stroke={C.local} strokeWidth={3} />)}
            <line x1={MX[0]} y1={MY} x2={MX[0] + 110 * Math.cos(f / 20)} y2={MY - 110 * Math.sin(f / 20)} stroke={C.first} strokeWidth={5} /></g>
          <g opacity={mix(0.3, 1, a2(1))}><Arrow p={[MX[1] - 20, MY + 60]} q={[MX[1] + 90, MY + 60]} color={C.second} w={7} head={26} />
            <Arrow p={[MX[1] - 20, MY + 60]} q={[MX[1] + 40, MY - 10]} color={C.second} w={7} head={26} />
            <Arrow p={[MX[1] - 20, MY + 60]} q={[MX[1] - 20, MY - 80]} color={C.first} w={7} head={26} /></g>
          <g opacity={mix(0.3, 1, a2(2))}>{[-90, -45, 0, 45, 90].map((d) => <line key={d} x1={MX[2] + d} y1={MY - 90} x2={MX[2] + d} y2={MY + 90} stroke={C.local} strokeWidth={2} />)}
            {[-90, -45, 0, 45, 90].map((d) => <line key={`h${d}`} x1={MX[2] - 90} y1={MY + d} x2={MX[2] + 90} y2={MY + d} stroke={C.local} strokeWidth={2} />)}
            {[-90, -45, 0, 45, 90].flatMap((a) => [-90, -45, 0, 45, 90].map((b) => <circle key={`${a}_${b}`} cx={MX[2] + a} cy={MY + b} r={5} fill={C.gold} />))}</g>
        </g>
        <g opacity={o3}>
          <g opacity={mix(0.3, 1, a3(0))}>{ring([MX[0], MY], 90)}<Arrow p={[MX[0] + 90, MY]} q={[MX[0] + 90, MY - 80]} color={C.first} w={7} head={24} />
            <Arrow p={[MX[0] + 90, MY]} q={[MX[0] + 40, MY]} color={C.neg} w={7} head={24} /></g>
          <g opacity={mix(0.3, 1, a3(1))}><path d={`M ${MX[1] - 100} ${MY + 90} L ${MX[1] + 80} ${MY - 90}`} stroke={C.key} strokeWidth={4} fill="none" />
            <Arrow p={[MX[1] - 10, MY]} q={[MX[1] + 50, MY - 60]} color={C.first} w={7} head={24} /><Arrow p={[MX[1] - 10, MY]} q={[MX[1] - 70, MY - 60]} color={C.second} w={7} head={24} /></g>
          <g opacity={mix(0.3, 1, a3(2))}><circle cx={MX[2]} cy={MY} r={100} fill="none" stroke={C.local} strokeWidth={3} /><circle cx={MX[2]} cy={MY} r={8} fill={C.key} />
            <Arrow p={[MX[2], MY + 100]} q={[MX[2] + 80, MY + 100]} color={C.first} w={7} head={24} /><Arrow p={[MX[2], MY + 100]} q={[MX[2], MY + 40]} color={C.neg} w={7} head={24} /></g>
        </g>
        <Keyword f={f} text="why so many?" at={[XC, 160]} appear={0} out={t1 - 18} />
        <Keyword f={f} text="three good reasons" at={[XC, 160]} appear={t1} />
        <Keyword f={f} text="1 · shape" at={[XC, 300]} appear={t2} c={C.gold} />
        <Keyword f={f} text="2 · measurement" at={[XC, 420]} appear={t5} c={C.gold} />
        <Keyword f={f} text="3 · meaning" at={[XC, 540]} appear={t8} c={C.gold} />
        <Keyword f={f} text="keep what the question needs" at={[XC, 700]} s={T.floor} appear={t10} />
        <Lbl x={MX[0]} y={660} t="radar" c={C.muted} s={T.floor} a="middle" b={false} o={o2 * a2(0)} />
        <Lbl x={MX[1]} y={660} t="station" c={C.muted} s={T.floor} a="middle" b={false} o={o2 * a2(1)} />
        <Lbl x={MX[2]} y={660} t="lat-lon grid" c={C.muted} s={T.floor} a="middle" b={false} o={o2 * a2(2)} />
        <Lbl x={MX[0]} y={660} t="storm" c={C.muted} s={T.floor} a="middle" b={false} o={o3 * a3(0)} />
        <Lbl x={MX[1]} y={660} t="coast" c={C.muted} s={T.floor} a="middle" b={false} o={o3 * a3(1)} />
        <Lbl x={MX[2]} y={660} t="the pole" c={C.muted} s={T.floor} a="middle" b={false} o={o3 * a3(2)} />
      </Svg>
      <TeX s={String.raw`r=\text{const}`} x={MX[0]} y={650} size={56} ax={0.5} o={o1 * a1(0)} />
      <TeX s={String.raw`r=a`} x={MX[1]} y={650} size={56} ax={0.5} o={o1 * a1(1)} />
      <TeX s={String.raw`\sigma`} x={MX[2]} y={650} size={56} c={C.gold} ax={0.5} o={o1 * a1(2)} />
      <ProjMap id="s15m" v={VT1} name="mc" latTop={80} img={IMGS.mc} coast={0.4} o={o4} />
      <ProjMap id="s15e" v={VT2} name="ee" clipEllipse sea={null} img={IMGS.ee} coast={0.4} o={o4} />
      <Svg>
        <Lbl x={VT1.cx} y={VT1.cy + 2.436 * VT1.s + 40} t="directions" c={C.key} s={T.floor} a="middle" o={o4} />
        <Lbl x={VT2.cx} y={VT2.cy + 1.3173 * VT2.s + 40} t="amounts" c={C.key} s={T.floor} a="middle" o={o4} />
      </Svg>
      <SourceBelow text={SRC_BM} pic={{ x: 110, y: 270, w: 870, h: 400 }} w={870} o={o4} name="s15 src" />
    </Scene>
  );
};

export const SCENES_B: Record<string, React.FC> = {
  s08_mercator_dy: S08, s09_adding_steps: S09, s10_ln_formula: S10, s11_slope_check: S11, s12_rhumb_straight: S12, s13_area_stretch: S13, s14_equal_earth: S14,
  s15_why_many: S15,
};
export { Ladder, LX, LY0, LS, ladY };
