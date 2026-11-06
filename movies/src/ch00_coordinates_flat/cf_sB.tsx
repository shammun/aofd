// ch00_coordinates_flat scenes s08-s20: r̂ built (D08a), where θ̂ points (D01), the 90° turn rule (D02), θ̂ = (−sin θ, cos θ)
// with four checks (D03), polar unit vectors depend on place, a wind's radial and tangential parts (D04) and their check,
// turned axes (x̂′, ŷ′ by D05), x′ and y′ as shadows (D06), the rotation matrix (D07), the index form (D08) and polar parts
// = axes turned by θ (D09). All numbers come from data/cf.json (CHECK rows below); this file only places and times.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Band, Dash, Pt, RightTick, pulse, textW } from "../house/kit/draw";
import { CalcStack, TeX } from "../house/kit/tex";
import { Keyword } from "../house/kit/notes";
import { Check } from "../house/kit/icons";
import { AnimatedWindArrow } from "../house/kit/wind";
import { CurvedLink } from "../house/kit/extras";
import {
  AT, ArcHead, Arrow, BDot, D2R, K, LEN, Lbl, PL, SE, SS, Scene, SkipChip, keepTime, Station, Svg, arcD, clamp, fin, fout, mix, prog, rotP, rotS, win,
} from "./cf_lib";
import { EQ_S08, EQ_S09, EQ_S10, EQ_S11, EQ_S13, EQ_S14, EQ_S15, EQ_S16, EQ_S17, EQ_S18, EQ_S19, EQ_S20, cutAt } from "./cf_eq";

const CHECK_B: [string, number, number, number][] = [
  ["rhat x", PL.rhat[0], 0.6, 1e-9], ["rhat y", PL.rhat[1], 0.8, 1e-9], ["thhat x", PL.thhat[0], -0.8, 1e-9], ["thhat y", PL.thhat[1], 0.6, 1e-9],
  ["ur", PL.ur, 6, 1e-9], ["ut", PL.ut, -8, 1e-9], ["slide x", PL.slide_m[0], -7.0, 0.02], ["slide y", PL.slide_m[1], 5.2, 0.04],
  ["slide len", Math.hypot(PL.slide_m[0], PL.slide_m[1]), 8.7, 0.03], ["x'30", PL.xp30[0], 4.6, 0.005], ["y'30", PL.xp30[1], 1.96, 0.005],
  // fix 1c (calculation audit C7-C31)
  ["0.6^2", 0.6 ** 2, 0.36, 1e-12], ["0.8^2", 0.8 ** 2, 0.64, 1e-12], ["5.1", 5 + 0.1, 5.1, 1e-12], ["4.9", 5 - 0.1, 4.9, 1e-12], ["(-4)^2", (-4) ** 2, 16, 0],
  ["(-8)(-0.8)", -8 * -0.8, 6.4, 1e-12], ["(-8)(0.6)", -8 * 0.6, -4.8, 1e-12], ["36+64", 36 + 64, 100, 0], ["sqrt3/2", 1.732 / 2, 0.866, 1e-12], ["0.866^2", 0.866 ** 2, 0.75, 1e-4],
  ["0.433", 0.866 * 0.5, 0.433, 1e-12], ["4.6^2", 4.6 ** 2, 21.16, 1e-9], ["1.96^2", 1.96 ** 2, 3.84, 2e-3], ["2.598", 0.866 * 3, 2.598, 1e-9], ["1.964", -1.5 + 4 * 0.866, 1.964, 1e-9],
  ["cos60", Math.cos(60 * D2R), 0.5, 1e-12], ["cos120", Math.cos(120 * D2R), -0.5, 1e-12],
  ["C30 cos", PL.C30[0][0], 0.866, 5e-4], ["C30 sin", PL.C30[1][0], 0.5, 1e-9], ["turn34 x", PL.turn34[0], -4, 1e-9], ["turn34 y", PL.turn34[1], 3, 1e-9],
];
CHECK_B.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

const TH = PL.th;                       // 53.13°
const ER: Pt = [Math.cos(TH * D2R), -Math.sin(TH * D2R)];   // r̂ on screen (y down)
const ET: Pt = rotS(ER, 90);                                  // θ̂ on screen
const at = (o: Pt, v: Pt, L: number): Pt => [o[0] + v[0] * L, o[1] + v[1] * L];
const onC = (o: Pt, R: number, deg: number): Pt => [o[0] + R * Math.cos(deg * D2R), o[1] - R * Math.sin(deg * D2R)];
/** a KaTeX tip label just beyond the tip of an arrow from p along unit v of length L */
const Tip: React.FC<{ p: Pt; v: Pt; L: number; s: string; c?: string; o?: number; d?: number; size?: number }> = ({ p, v, L, s, c = C.second, o = 1, d = 46, size = 56 }) =>
  <TeX s={s} x={p[0] + v[0] * (L + d)} y={p[1] + v[1] * (L + d)} size={size} ax={0.5} c={c} o={o} />;
const RHAT = String.raw`\hat{\mathbf r}`, THAT = String.raw`\hat{\boldsymbol\theta}`;
const XP = String.raw`\hat{\mathbf x}'`, YP = String.raw`\hat{\mathbf y}'`;
const KX: React.FC<{ s: string; x: number; y: number; o: number; size?: number; c?: string }> = ({ s, x, y, o, size = 54, c = C.key }) => <TeX s={s} x={x} y={y} size={size} c={c} o={o} />;

// ---------------------------------------------------------------- the circle round the station (s08, s09, s12, s20): 5 km = 300 px
const OC: Pt = [400, 520], RC = 300, LU = 170;
const OC0 = OC;   // s20 shifts its own copy (fix 2)
const BC = onC(OC, RC, TH);

// ================================================================ s08 r̂ built (D08a)
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = K("s08_r_hat");
  const tPos = AT(k, 4, "three, four"), t5 = AT(k, 4, "five kilometres"), tDiv = SS(k, 5), t35 = AT(k, 6, "three fifths"), tLen = SS(k, 7),
    tAny = AT(k, 9, "r cosine theta"), tCan = AT(k, 10, "the r cancels"), tWhy = SS(k, 11), tGrow = AT(k, 12, "let r grow"), tWay = SS(k, 13);
  const shrink = prog(f, tDiv + 10, tDiv + 40), slide = prog(f, tDiv + 40, tDiv + 70);
  // the position arrow (teal, station → balloon) shrinks to the unit arrow's display length, turns orange, slides to the balloon
  const Lnow = mix(RC, LU, shrink);
  const base = at(OC, ER, mix(0, RC, slide));
  const grow = prog(f, tGrow + 6, tGrow + 70);
  const rr = RC * (1 + 0.2 * grow);
  const bal = at(OC, ER, rr);
  const rh0 = at(OC, ER, rr);
  const posO = fin(f, tPos) * (1 - fin(f, tDiv + 10, 6));
  const unitO = fin(f, tDiv + 10, 6);
  const [s8a, s8b] = cutAt(EQ_S08, String.raw`=(\cos`);
  const cancelled = rep2(s8a);
  return (
    <Scene>
      <Svg>
        <circle cx={OC[0]} cy={OC[1]} r={RC} fill="none" stroke={C.local} strokeWidth={3} opacity={0.5} />
        {/* fix 1 Should 7: θ is measured from a dashed east ray, and the radius is drawn from the first frame */}
        <Dash p={OC} q={[OC[0] + RC + 60, OC[1]]} c={C.muted} w={3} />
        <line x1={OC[0]} y1={OC[1]} x2={BC[0]} y2={BC[1]} stroke={C.ink} strokeWidth={4} opacity={0.55} />
        <path d={arcD(OC, 80, 0, TH)} fill="none" stroke={C.local} strokeWidth={5} opacity={0.8} />
        <Lbl x={OC[0] + 104} y={OC[1] - 40} t="θ" c={C.local} s={T.key} />
        <Station at={OC} s={0.75} />
        <Arrow p={OC} q={BC} color={C.ink} o={posO} />
        <Lbl x={(OC[0] + BC[0]) / 2 + 26} y={(OC[1] + BC[1]) / 2 + 30} t="r = 5 km" c={C.ink} s={T.floor} o={fin(f, t5) * fout(f, tDiv + 6)} />
        {f < tDiv + 70 ? <Arrow p={f < tDiv + 40 ? OC : base} q={at(f < tDiv + 40 ? OC : base, ER, Lnow)} color={shrink > 0.5 ? C.second : C.ink} o={unitO} /> : null}
        <Dash p={OC} q={at(OC, ER, RC * 1.25)} c={C.ink} w={4} o={fin(f, tGrow) * fout(f, LEN(k) - 10)} />
        <BDot p={f >= tGrow ? bal : BC} />
        {f >= tDiv + 70 ? <Arrow p={rh0} q={at(rh0, ER, LU)} color={C.second} o={1 + 0.0 * pulse(f, tWay, 20)} /> : null}
        <Lbl x={BC[0] + 30} y={BC[1] - 40} t="(3, 4)" c={C.key} s={T.key} o={fin(f, tPos) * fout(f, tDiv)} />
        {/* fix 1c C7: a ghost r̂ at the balloon while it is described; the 5-km arrow says "5", the shrunk copy "1"; the tip (0.6, 0.8) */}
        <Arrow p={BC} q={at(BC, ER, LU)} color={C.second} o={0.35 * win(f, SS(k, 2), tDiv + 60)} dash="12 8" />
        <Lbl x={at(OC, ER, Lnow / 2)[0] - 26} y={at(OC, ER, Lnow / 2)[1] + 6} t={shrink < 0.5 ? "5" : "1"} c={C.key} s={T.floor} a="end" o={win(f, tDiv, tDiv + 40)} />
        <Lbl x={at(rh0, ER, LU)[0] + 20} y={at(rh0, ER, LU)[1] + 40} t="(0.6, 0.8)" c={C.key} s={T.floor} o={win(f, AT(k, 6, "zero point six, zero point eight"), tGrow)} />
        <Lbl x={OC[0] + 100} y={OC[1] + 60} t="θ fixed" c={C.local} s={T.floor} o={fin(f, tGrow)} />
        <Keyword f={f} text="unit vectors" at={[1080, 110]} appear={0} out={tDiv - 18} />
        <Keyword f={f} text="divide by its length" at={[1080, 110]} appear={tDiv} />
        <Keyword f={f} text="the way r grows" at={[1080, 790]} appear={tWay} />
      </Svg>
      {f >= tDiv + 70 ? <Tip p={rh0} v={ER} L={LU} s={RHAT} /> : null}
      {/* fix 1c C7/C8: one move per line; the stack leaves before the general r̂ line (S9) */}
      <CalcStack f={f} x={1220} y={200} size={54} maxLines={2} o={fout(f, tAny - 14)} rows={[
        { lhs: RHAT, rhs: String.raw`=\dfrac{(3,\ 4)}{5}`, at: tDiv, h: 120 },
        { rhs: String.raw`=\left(\dfrac{3}{5},\ \dfrac{4}{5}\right)`, at: t35, cont: true, h: 130 },
        { rhs: String.raw`=(0.6,\ 0.8)`, at: AT(k, 6, "zero point six, zero point eight"), cont: true },
        { lhs: String.raw`|\hat{\mathbf r}|`, rhs: String.raw`=\sqrt{0.6^2+0.8^2}`, at: tLen },
        { rhs: String.raw`=\sqrt{0.36+0.64}`, at: AT(k, 7, "That's zero point three six"), cont: true },
        { rhs: String.raw`=\sqrt{1}=1`, at: AT(k, 7, "square root of one"), cont: true },
      ]} />
      <TeX s={s8a} x={1080} y={540} size={58} o={f < tCan ? fin(f, tAny) : 0} />
      <TeX s={cancelled} x={1080} y={540} size={58} o={f < tCan ? 0 : 1} />
      <TeX s={String.raw`=(\cos${s8b}`} x={1150} y={650} size={58} o={fin(f, tCan + 20)} />
      <Svg><Keyword f={f} text="why “r hat”?" at={[1080, 790]} s={T.floor} appear={tWhy} out={tWay - 18} /></Svg>
    </Scene>
  );
};
/** EQ_S08 with the three r's of the fraction struck (rose cancel lines) */
const rep2 = (s: string) => {
  const a = String.raw`\frac{(r\cos\theta,\ r\sin\theta)}{r}`;
  if (!s.includes(a)) throw new Error("s08 cancel variant drifts from EQ_S08");
  const cr = String.raw`\textcolor{#d9667f}{\cancel{\textcolor{#e8ecf4}{r}}}`;
  return s.replace(a, String.raw`\frac{(${cr}\cos\theta,\ ${cr}\sin\theta)}{${cr}}`);
};

// ================================================================ s09 where θ̂ points (D01)
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09_where_theta_grows");
  const tGrow = AT(k, 5, "let theta grow"), tSl = SS(k, 6), tDist = SS(k, 8), tAny = AT(k, 9, "further from the station"), tNo = SS(k, 10), tEdge = SS(k, 11),
    tTwo = SS(k, 12), tAnti = SS(k, 13), tSo = SS(k, 14), tRule = SS(k, 15);
  // the 'little' turn (drawn 15°), forth and back twice over S3-S4
  const cyc = clamp((f - tGrow) / Math.max(1, SE(k, 6) - tGrow), 0, 1);
  const wob = f < tGrow ? 0 : Math.sin(Math.PI * Math.min(1, cyc * 2)) ** 2 * 15;
  const th = TH + wob;
  const b = onC(OC, RC, th);
  const er: Pt = [Math.cos(th * D2R), -Math.sin(th * D2R)];
  // inset (magnified slide), no box (fix 1 Should 8): lower right of the picture zone, ≥ 50 px off the circle (centre OC, R 300)
  const IO: Pt = [860, 820], IL = 130;
  const inset = win(f, tDist, tEdge - 10, 12);
  const ghost = win(f, tAny, tNo + 20, 10);
  const cand = fin(f, tTwo);
  const pick = fin(f, tAnti + 20);
  const sl = at(IO, ET, IL);
  return (
    <Scene>
      <Svg>
        <circle cx={OC[0]} cy={OC[1]} r={RC} fill="none" stroke={C.first} strokeWidth={4} opacity={0.6} />
        <Dash p={OC} q={[OC[0] + RC + 60, OC[1]]} c={C.muted} w={3} />
        <path d={arcD(OC, 80, 0, th)} fill="none" stroke={C.local} strokeWidth={5} />
        <Lbl x={OC[0] + 104} y={OC[1] - 40} t="θ" c={C.local} s={T.key} />
        <line x1={OC[0]} y1={OC[1]} x2={b[0]} y2={b[1]} stroke={C.ink} strokeWidth={4} opacity={0.55} />
        <Lbl x={(OC[0] + b[0]) / 2 - 24} y={(OC[1] + b[1]) / 2 - 10} t="r = 5 km" a="end" c={C.local} s={T.floor} o={fin(f, tGrow - 30) * fout(f, tEdge)} />
        <path d={arcD(OC, RC, TH, th)} fill="none" stroke={C.gold} strokeWidth={8} opacity={fin(f, tGrow) * fout(f, tDist)} />
        <Station at={OC} s={0.75} />
        {/* the tangent line at the balloon and its right angle to the radius (S9) */}
        <g opacity={win(f, tEdge, tTwo + 10)}>
          <line x1={at(BC, ET, -200)[0]} y1={at(BC, ET, -200)[1]} x2={at(BC, ET, 200)[0]} y2={at(BC, ET, 200)[1]} stroke={C.key} strokeWidth={3} strokeDasharray="12 8" />
          <RightTick at={BC} u1={[-ER[0], -ER[1]]} u2={ET} c={C.gold} />
        </g>
        {/* two candidates (S10), the clockwise one struck (S11-S12) */}
        <g opacity={cand}>
          <line x1={BC[0]} y1={BC[1]} x2={at(BC, ET, LU)[0]} y2={at(BC, ET, LU)[1]} stroke={C.second} strokeWidth={8} strokeDasharray="14 9" opacity={1 - pick} />
          <g opacity={1 - pick}><line x1={BC[0]} y1={BC[1]} x2={at(BC, ET, -LU)[0]} y2={at(BC, ET, -LU)[1]} stroke={C.local} strokeWidth={8} strokeDasharray="14 9" /></g>
          <path d={arcD(BC, 70, TH + 10, TH + 80)} fill="none" stroke={C.second} strokeWidth={4} opacity={1 - pick} />
          <ArcHead c={BC} r={70} a={TH + 80} dir={1} col={C.second} o={1 - pick} />
          <path d={arcD(BC, 70, TH - 10, TH - 80)} fill="none" stroke={C.local} strokeWidth={4} opacity={1 - fin(f, tAnti)} />
          <ArcHead c={BC} r={70} a={TH - 80} dir={-1} col={C.local} o={1 - fin(f, tAnti)} />
          <line x1={at(BC, ET, -LU * 0.75)[0] - 30} y1={at(BC, ET, -LU * 0.75)[1] - 30} x2={at(BC, ET, -LU * 0.75)[0] + 30} y2={at(BC, ET, -LU * 0.75)[1] + 30}
            stroke={C.neg} strokeWidth={7} opacity={win(f, tAnti, tSo, 8)} />
        </g>
        <Arrow p={BC} q={at(BC, ET, LU)} color={C.second} o={pick} />
        <path d={arcD(BC, 110, TH, TH + 90 * prog(f, tSo, tSo + 24))} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tSo)} />
        <ArcHead c={BC} r={110} a={TH + 90 * prog(f, tSo, tSo + 24)} dir={1} col={C.gold} o={fin(f, tSo + 20)} />
        <Arrow p={b} q={at(b, er, LU)} color={C.second} />
        <BDot p={b} />
        {/* the magnified slide (inset) */}
        <g opacity={inset} data-lc-own="s09inset">
          <Arrow p={IO} q={at(IO, ER, 110)} color={C.second} w={7} head={26} />
          <Arrow p={IO} q={sl} color={C.gold} w={7} head={26} />
          <circle cx={IO[0]} cy={IO[1]} r={8} fill={C.key} />
          <g opacity={ghost}>
            <Arrow p={IO} q={at(sl, ER, 45)} color={C.local} w={5} head={20} dash="10 7" />
            <Arrow p={IO} q={at(sl, ER, -45)} color={C.local} w={5} head={20} dash="10 7" />
          </g>
          <RightTick at={IO} u1={ER} u2={ET} c={C.gold} o={fin(f, tNo)} />
        </g>
        <g data-lc-own="s09inset"><Lbl x={at(sl, ER, 45)[0]} y={at(sl, ER, 45)[1] - 36} t="5.1 km" c={C.local} s={T.floor} a="middle" o={ghost * inset} />
        <Lbl x={at(sl, ER, -45)[0] - 14} y={at(sl, ER, -45)[1] + 60} t="4.9 km" c={C.local} s={T.floor} a="end" o={ghost * inset} />
        <Lbl x={(IO[0] + sl[0]) / 2 + ER[0] * 40} y={(IO[1] + sl[1]) / 2 + ER[1] * 40} t="slide" c={C.gold} s={T.floor} a="middle" o={inset * (1 - ghost)} /></g>
        <Lbl x={1080} y={220} t="r stays 5 km" c={C.key} s={T.key} o={fin(f, tDist)} />
        <g opacity={win(f, tTwo, tSo)}>
          <Lbl x={at(BC, ET, -LU)[0] + 18} y={at(BC, ET, -LU)[1] + 30} t="clockwise:" c={C.neg} s={T.floor} o={0.75} />
          <Lbl x={at(BC, ET, -LU)[0] + 18} y={at(BC, ET, -LU)[1] + 80} t="θ shrinks" c={C.neg} s={T.floor} o={0.75} />
        </g>
        <Lbl x={1080} y={430} t="edge at right angles to the radius" c={C.key} s={T.floor} o={fin(f, tEdge)} />
        <Lbl x={1080} y={500} t="anticlockwise, seen from above" c={C.key} s={T.floor} o={fin(f, tAnti)} />
        <Keyword f={f} text="the way θ grows" at={[1080, 110]} appear={0} out={tNo - 18} />
        <SkipChip f={f} k={k} to={keepTime("s11_theta_hat")} />
        <Keyword f={f} text="a rule for a 90° turn" at={[1080, 790]} appear={tRule} />
      </Svg>
      <Tip p={b} v={er} L={LU} s={RHAT} />
      <Tip p={BC} v={ET} L={LU} s={THAT} o={pick} />
      <Tip p={IO} v={ER} L={110} s={RHAT} d={34} size={50} o={inset} />
      <KX s={String.raw`\text{no part along }\hat{\mathbf r}`} x={1080} y={110} o={fin(f, tNo)} />
      <KX s={String.raw`\text{slide}\perp\hat{\mathbf r}`} x={1080} y={320} o={fin(f, AT(k, 10, "at right angles"))} />
      <TeX s={String.raw`5+0.1=5.1\ \mathrm{km}\ne5`} x={1080} y={300} size={50} o={win(f, AT(k, 9, "five point one"), tNo - 12)} />
      <TeX s={String.raw`5-0.1=4.9\ \mathrm{km}\ne5`} x={1080} y={370} size={50} o={win(f, AT(k, 9, "four point nine"), tNo - 12)} />
      <TeX s={EQ_S09} x={1080} y={640} size={64} o={fin(f, tSo)} />
    </Scene>
  );
};

// ================================================================ s10 the 90° turn rule (D02)
const O10: Pt = [470, 470], U10 = 130, U34 = 64;
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_turn_90");
  const tX = AT(k, 1, "by ninety degrees"), tX2 = SS(k, 2), tY = AT(k, 3, "and it points west"), tY2 = SS(k, 4), tPQ = SS(k, 5), tSteps = SS(k, 6),
    tTurn = AT(k, 7, "turn the whole drawing"), tBec = SS(k, 8), tMin = SS(k, 9), tRes = AT(k, 10, "So the turned arrow"), tWords = SS(k, 11), tBal = SS(k, 12), tSw = AT(k, 13, "minus four, three"),
    tLen = SS(k, 15), tDot = SS(k, 16), tRA = SS(k, 17);
  const P = (x: number, y: number): Pt => [O10[0] + x * U10, O10[1] - y * U10];
  const ax = 90 * prog(f, tX - 6, tX + 24), ay = 90 * prog(f, tY - 6, tY + 24);
  const demo = fout(f, tPQ - 12, 12) + 0.0;
  const p = 2.2, q = 1.3;
  const rot = 90 * prog(f, tTurn, tTurn + 60);
  const R = (pt: Pt) => rotP(pt, O10, rot);
  const chainO = win(f, tPQ, tBal - 12, 12);
  const A0 = O10, A1 = R(P(p, 0)), A2 = R(P(p, q));
  const B0 = O10, B1: Pt = [O10[0] + 3 * U34, O10[1]], B2: Pt = [O10[0] + 3 * U34, O10[1] - 4 * U34];
  const t34 = 90 * prog(f, tSw - 30, tSw + 15);
  const R2 = (pt: Pt) => rotP(pt, O10, t34);
  const balO = fin(f, tBal);
  const pTag = rot > 45 ? "p north" : "p", qTag = rot > 45 ? "q west" : "q";
  const xhat = rotP(P(1, 0), O10, ax), yhat = rotP(P(0, 1), O10, ay);
  return (
    <Scene>
      <Svg>
        {Array.from({ length: 7 }, (_, i) => i - 3).map((i) => <line key={`v${i}`} x1={P(i, 0)[0]} y1={P(0, 3.2)[1]} x2={P(i, 0)[0]} y2={P(0, -2.7)[1]} stroke={C.grid} strokeWidth={i === 0 ? 3 : 1.5} />)}
        {Array.from({ length: 6 }, (_, i) => i - 2).map((j) => <line key={`h${j}`} x1={P(-3.2, 0)[0]} y1={P(0, j)[1]} x2={P(3.2, 0)[0]} y2={P(0, j)[1]} stroke={C.grid} strokeWidth={j === 0 ? 3 : 1.5} />)}
        <Lbl x={P(3.2, 0)[0] - 4} y={O10[1] + 36} t="east" c={C.muted} s={T.floor} a="end" />
        <Lbl x={O10[0] + 16} y={P(0, 3.2)[1] + 28} t="north" c={C.muted} s={T.floor} />
        <g opacity={demo}>
          <Arrow p={O10} q={xhat} color={C.second} />
          <Arrow p={O10} q={yhat} color={C.second} o={fin(f, tY - 40)} />
          <path d={arcD(O10, 70, 0, ax)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tX - 6)} />
          <ArcHead c={O10} r={70} a={ax} dir={1} col={C.gold} o={fin(f, tX + 10)} />
          <path d={arcD(O10, 95, 90, 90 + ay)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tY - 6)} />
          <ArcHead c={O10} r={95} a={90 + ay} dir={1} col={C.gold} o={fin(f, tY + 10)} />
          <Lbl x={xhat[0] + 30} y={xhat[1] - 10} t={f < tX2 ? "(1, 0)" : "(0, 1)"} c={C.key} s={T.key} o={fin(f, 6) * (f < tX ? 1 : f < tX2 ? 0 : fin(f, tX2))} />
          <Lbl x={yhat[0] - 30} y={yhat[1] - 40} t={f < tY2 ? "(0, 1)" : "(−1, 0)"} c={C.key} s={T.key} a="end" o={fin(f, tY - 40) * (f < tY ? 1 : f < tY2 ? 0 : fin(f, tY2))} />
        </g>
        <g opacity={chainO * (rot > 1 ? 0.4 : 0)}>
          <line x1={O10[0]} y1={O10[1]} x2={P(p, 0)[0]} y2={P(p, 0)[1]} stroke={C.second} strokeWidth={9} strokeLinecap="round" />
          <line x1={P(p, 0)[0]} y1={P(p, 0)[1]} x2={P(p, q)[0]} y2={P(p, q)[1]} stroke={C.second} strokeWidth={9} strokeDasharray="16 10" strokeLinecap="round" />
        </g>
        <g opacity={chainO * fin(f, tTurn + 60)}>
          <path d={arcD(O10, Math.hypot(p, q) * U10, Math.atan2(q, p) / D2R, Math.atan2(q, p) / D2R + 90)} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" />
          <ArcHead c={O10} r={Math.hypot(p, q) * U10} a={Math.atan2(q, p) / D2R + 90} dir={1} col={C.gold} />
        </g>
        <g opacity={chainO}>
          <line x1={A0[0]} y1={A0[1]} x2={A1[0]} y2={A1[1]} stroke={C.second} strokeWidth={9} strokeLinecap="round" />
          <line x1={A1[0]} y1={A1[1]} x2={A2[0]} y2={A2[1]} stroke={C.second} strokeWidth={9} strokeDasharray="16 10" strokeLinecap="round" />
          <Arrow p={A0} q={A2} color={C.first} o={fin(f, tSteps)} />
          {rot > 0 && rot < 90 ? <path d={arcD(O10, 60, 0, rot)} fill="none" stroke={C.gold} strokeWidth={5} /> : null}
          <Lbl x={(A0[0] + A1[0]) / 2 + (rot > 45 ? 34 : 0)} y={(A0[1] + A1[1]) / 2 + (rot > 45 ? 0 : 40)} t={pTag} c={C.second} s={T.floor} a={rot > 45 ? "start" : "middle"} o={fin(f, tSteps)} />
          {/* K6 after fix 1c: once turned, "q west" sits at the west end of its step, above "(−q, p)", off the gold 90° arc and the teal arrow */}
          <Lbl x={rot > 45 ? A2[0] - 24 : (A1[0] + A2[0]) / 2 + 30} y={rot > 45 ? A2[1] - 44 : (A1[1] + A2[1]) / 2} t={qTag} c={C.second} s={T.floor} a={rot > 45 ? "end" : "start"} o={fin(f, tSteps)} />
          <Lbl x={A2[0] + (rot > 45 ? -24 : 24)} y={A2[1] + (rot > 45 ? 14 : -40)} t={rot > 45 ? "(−q, p)" : "(p, q)"} c={C.key} s={T.key} a={rot > 45 ? "end" : "start"} o={fin(f, tPQ) * (rot > 5 && rot < 85 ? 0 : 1) * (rot > 45 ? fin(f, tRes) : 1)} />
        </g>
        <g opacity={balO}>
          <Arrow p={B0} q={B2} color={C.first} />
          <Dash p={B0} q={B1} c={C.second} w={4} /><Dash p={B1} q={B2} c={C.second} w={4} />
          <Lbl x={B2[0] + 24} y={B2[1] - 10} t="(3, 4)" c={C.key} s={T.key} />
          <g opacity={fin(f, tSw - 30)}>
            <Arrow p={R2(B0)} q={R2(B2)} color={C.first} dash="18 10" />
            <Dash p={R2(B0)} q={R2(B1)} c={C.second} w={4} /><Dash p={R2(B1)} q={R2(B2)} c={C.second} w={4} />
          </g>
          {/* fix 2 (review 2 Should 8): "(−4, 3)" centred above the turned tip (it started at x 28), "4 west" right of it over its leg */}
          <Lbl x={R2(B2)[0]} y={R2(B2)[1] - 52} t="(−4, 3)" c={C.key} s={T.key} a="middle" o={fin(f, tSw)} />
          <Lbl x={R2(B1)[0] - 18} y={R2(B1)[1] + 22} t="3 north" a="end" c={C.second} s={T.floor} o={fin(f, tSw + 10)} />
          <Lbl x={(R2(B1)[0] + R2(B2)[0]) / 2 + 38} y={R2(B1)[1] - 34} t="4 west" c={C.second} s={T.floor} a="middle" o={fin(f, tSw + 10)} />
          <RightTick at={O10} u1={[0.6, -0.8]} u2={[-0.8, -0.6]} c={C.gold} o={fin(f, tRA)} />
        </g>
        <Keyword f={f} text="90° turn" at={[1080, 790]} appear={0} out={tWords - 18} />
        <Keyword f={f} text="swap, minus on the first" at={[1080, 790]} appear={tWords} out={tRA - 18} />
        <Keyword f={f} text="dot product 0 → right angle" at={[1080, 790]} appear={tRA} />
      </Svg>
      <CalcStack f={f} x={1260} y={110} size={52} maxLines={2} rows={[
        { lhs: String.raw`\hat{\mathbf x}`, rhs: String.raw`=(1,\ 0)\ \to\ (0,\ 1)`, at: tX2 },
        { lhs: String.raw`\hat{\mathbf y}`, rhs: String.raw`=(0,\ 1)\ \to\ (-1,\ 0)`, at: tY2 },
        { lhs: String.raw`(p,\ q)`, rhs: String.raw`=p\,\hat{\mathbf x}+q\,\hat{\mathbf y}`, at: tSteps },
        { rhs: String.raw`\to\ p\,(0,\ 1)+q\,(-1,\ 0)`, at: tBec, cont: true },
        { rhs: String.raw`=(0,\ p)+(-q,\ 0)`, at: AT(k, 10, "q times minus one"), cont: true },
        { rhs: String.raw`=(0-q,\ p+0)`, at: AT(k, 10, "Adding the east parts"), cont: true },
        { rhs: String.raw`=(-q,\ p)`, at: tRes, cont: true },
        { lhs: String.raw`(3,\ 4)`, rhs: String.raw`\to\ (-4,\ 3)`, at: tSw },
        { lhs: String.raw`|(-4,\ 3)|`, rhs: String.raw`=\sqrt{(-4)^2+3^2}`, at: tLen },
        { rhs: String.raw`=\sqrt{16+9}=\sqrt{25}=5`, at: AT(k, 15, "square root of twenty five"), cont: true },
        { lhs: String.raw`|(3,\ 4)|`, rhs: String.raw`=\sqrt{9+16}=5`, at: AT(k, 15, "same as the balloon"), cont: false },
        { lhs: String.raw`(3,\ 4)\cdot(-4,\ 3)`, rhs: String.raw`=3\times(-4)+4\times3`, at: tDot },
        { rhs: String.raw`=-12+12=0`, at: tDot + 60, cont: true },
      ]} />
      <TeX s={EQ_S10} x={1100} y={640} size={84} o={fin(f, tWords)} />
      <Svg><Lbl x={1080} y={722} t="west = minus" c={C.local} s={T.floor} o={win(f, tMin, tWords - 18)} /></Svg>
    </Scene>
  );
};

// ================================================================ s11 θ̂ = (−sin θ, cos θ) and four checks (D03)
const O11: Pt = [430, 500], R11 = 300, SW11 = 185;   // SW11: left edge of the turned "sin θ, pointing west" label
// fix 1, user note U1 (11:23): the last check rebuilt with every input on screen, one line per spoken phrase, no θ̂ used.
// Wide view (station, 5-km circle, balloon (3, 4) km, r, θ) → a zoom box → the magnified inset (the circle's arc, r̂, before / after,
// the 8.7-m slide, its west and north parts). Numbers from data/cf.json (CHECK rows DF09 U1 in the build, CHECK_U1 below).
const U1 = { th: PL.th_after as number, b: PL.before_m as number[], a: PL.after_m as number[], d: PL.slide_m as number[] };
const CHECK_U1: [string, number, number, number][] = [
  ["dtheta rad", 0.1 * Math.PI / 180, 0.001745, 5e-7], ["s", 5000 * 0.001745, 8.7, 0.05], ["th after", U1.th, 53.23, 0.005],
  ["before x", U1.b[0], 3000, 1e-6], ["before y", U1.b[1], 4000, 1e-6], ["after x", U1.a[0], 2993.0, 0.05], ["after y", U1.a[1], 4005.2, 0.05],
  ["cos 53.23", Math.cos(U1.th * D2R), 0.598603, 5e-7], ["sin 53.23", Math.sin(U1.th * D2R), 0.801046, 5e-7],
  ["5000 cos", 5000 * 0.598603, 2993.0, 0.05], ["5000 sin", 5000 * 0.801046, 4005.2, 0.05], ["len", Math.hypot(7.0, 5.2), 8.7, 0.03], ["76.04", 7 * 7 + 5.2 * 5.2, 76.04, 1e-9],
  ["7.0^2", 7.0 * 7.0, 49, 1e-9], ["5.2^2", 5.2 * 5.2, 27.04, 1e-9], ["dx", U1.d[0], -7.0, 0.02], ["dy", U1.d[1], 5.2, 0.04], ["dx/8.7", -7.0 / 8.7, -0.80, 0.01], ["dy/8.7", 5.2 / 8.7, 0.60, 0.01],
  // fix 2 (review 2 Should 9): the shown angle 53.1301° + 0.1° = 53.2301° and the 6-d.p. cos/sin of exactly that angle; √76.04 ≈ 8.7
  ["th before 53.1301", TH, 53.1301, 5e-5], ["th after 53.2301", U1.th, 53.2301, 5e-5], ["53.1301+0.1", 53.1301 + 0.1, 53.2301, 1e-9],
  ["cos 53.2301", Math.cos(53.2301 * D2R), 0.598603, 5e-7], ["sin 53.2301", Math.sin(53.2301 * D2R), 0.801046, 5e-7], ["sqrt 76.04", Math.sqrt(76.04), 8.7, 0.03],
];
CHECK_U1.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK U1 ${n}: data ${v} vs screen ${r}`); });
const OW: Pt = [300, 580], RW = 220, BW = onC(OW, RW, TH);          // wide view: 5 km = 220 px
// fix 2 (review 2 Should 10): 440 px tall, so "before" sits under "7.0 m" (no more "7.0 m before"); an outline, no filled box
const IFR = { x: 540, y: 420, w: 450, h: 440 };                    // the magnified inset (frame), 25 px per metre (K6: x 570 → 540 and w 450: "5.2 m", "before" inside)
const MG = 25, B0: Pt = [870, 700], A1: Pt = [B0[0] + U1.d[0] * MG, B0[1] - U1.d[1] * MG], CN: Pt = [A1[0], B0[1]];
/** the circle's own arc through both balloon positions at the inset scale (radius 5000 m × 25 px/m: straight to the eye, but drawn as the arc) */
const arcU1 = (() => {
  const Rr = 5000 * MG, Cc: Pt = [B0[0] - ER[0] * Rr, B0[1] - ER[1] * Rr], pts: Pt[] = [];
  for (let i = 0; i <= 28; i++) { const a = (TH - 0.01 + (0.12 * i) / 28) * D2R; pts.push([Cc[0] + Rr * Math.cos(a), Cc[1] - Rr * Math.sin(a)]); }
  return pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
})();
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_theta_hat");
  const tR = SS(k, 1), tRule = SS(k, 2), tRes = AT(k, 3, "minus sine theta"), tPic = SS(k, 5), tW = AT(k, 7, "now points west"),
    tChk = SS(k, 8), t0 = AT(k, 9, "zero, one"), t90 = AT(k, 11, "minus one, zero"), tBal = SS(k, 13), tLen = SS(k, 14), tDotW = AT(k, 14, "dot product");
  // U1 block: S16-S24 (1-based)
  const tLast = SS(k, 15), tB5 = SS(k, 16), t34 = AT(k, 16, "three kilometres east"), tTurn = SS(k, 17), tRadA = AT(k, 18, "a tenth times pi"),
    tRadB = AT(k, 18, "about zero point"), tArc = AT(k, 19, "s equals r times the change"), t5000 = AT(k, 19, "five thousand metres"), t87 = AT(k, 19, "eight point seven"),
    tXY = SS(k, 20), tFrom = AT(k, 21, "three thousand"), tTo = AT(k, 21, "two thousand nine hundred"), tTo2 = AT(k, 21, "four thousand and five"), tAft = AT(k, 21, "to about"),
    tWest = AT(k, 22, "seven metres west"), tNorth = AT(k, 22, "five point two metres north"),
    // fix 2 (review 2 Must 2a): the √ check is now spoken (S23 part 2-3), each row on its words
    tSq = AT(k, 22, "seven squared"), tRoot = AT(k, 22, "The square root of seventy six"), t87b = AT(k, 22, "is about eight point seven"),
    tDiv = SS(k, 23), tGives = AT(k, 23, "gives about"), tAgain = AT(k, 23, "theta hat again"), tKeep = SS(k, 24);
  const rot = 90 * prog(f, tPic + 15, tPic + 60);
  const tip = onC(O11, R11, TH), foot: Pt = [tip[0], O11[1]];
  const R = (p: Pt) => rotP(p, O11, rot);
  const triO = win(f, 0, t0 - 30, 12);
  const pts = fin(f, tChk) * fout(f, tB5 - 14, 12);
  // fix 2 (review 2 Must 1): the U1 check leaves when the keep line starts; the keep picture (balloon, r̂ out, θ̂ round, +90° arc) comes in
  const u1out = fout(f, tKeep - 10, 12), keepO = fin(f, tKeep + 4, 14);
  const bigIn = fin(f, tB5, 14), big = bigIn * u1out;   // bigIn: the s11 opening picture stays gone after U1
  const ins = fin(f, tTurn, 14) * u1out;
  const KO: Pt = [400, 520], KR = 280, KB = onC(KO, KR, TH), KL = 160;   // keep picture: circle, balloon at θ ≈ 53°
  // the final θ̂ row (5th-last line of the U1 stack) sits on the stack's 2nd visible line: y 370 + one 46-px row (1.42 × 46)
  const yTh = 390 + 46 * 1.42 + (46 * 1.42) / 2;
  return (
    <Scene>
      <Svg>
        <g opacity={1 - bigIn}>
          {/* K6 after fix 1c: the reference circle is a faint background line (0.45) under the turned-leg label */}
          <circle cx={O11[0]} cy={O11[1]} r={R11} fill="none" stroke={C.local} strokeWidth={3} opacity={0.45} />
          <line x1={O11[0] - R11 - 30} y1={O11[1]} x2={O11[0] + R11 + 40} y2={O11[1]} stroke={C.grid} strokeWidth={2} />
          <line x1={O11[0]} y1={O11[1] + R11 + 20} x2={O11[0]} y2={O11[1] - R11 - 30} stroke={C.grid} strokeWidth={2} />
          <g opacity={triO}>
            <line x1={R(O11)[0]} y1={R(O11)[1]} x2={R(foot)[0]} y2={R(foot)[1]} stroke={C.second} strokeWidth={8} />
            <line x1={R(foot)[0]} y1={R(foot)[1]} x2={R(tip)[0]} y2={R(tip)[1]} stroke={C.second} strokeWidth={8} strokeDasharray="16 10" />
            <Arrow p={O11} q={tip} color={C.second} o={rot > 2 ? 0 : 1} />
            {rot > 2 ? <Arrow p={O11} q={R(tip)} color={C.second} /> : null}
            <path d={arcD(O11, 80, 0, TH)} fill="none" stroke={C.local} strokeWidth={5} opacity={rot > 2 ? 0.4 : 1} />
            {rot > 0 ? <path d={arcD(O11, 140, TH, TH + rot)} fill="none" stroke={C.gold} strokeWidth={5} /> : null}
            {rot > 2 ? <ArcHead c={O11} r={140} a={TH + rot} dir={1} col={C.gold} /> : null}
            <g opacity={rot > 2 ? 0.3 : 0}>
              <line x1={O11[0]} y1={O11[1]} x2={foot[0]} y2={foot[1]} stroke={C.second} strokeWidth={6} />
              <line x1={foot[0]} y1={foot[1]} x2={tip[0]} y2={tip[1]} stroke={C.second} strokeWidth={6} strokeDasharray="16 10" />
              <line x1={O11[0]} y1={O11[1]} x2={tip[0]} y2={tip[1]} stroke={C.second} strokeWidth={6} />
            </g>
          </g>
          <g opacity={pts}>
            <circle cx={O11[0] + R11} cy={O11[1]} r={10} fill={C.key} opacity={fin(f, t0 - 20)} />
            <Arrow p={[O11[0] + R11, O11[1]]} q={[O11[0] + R11, O11[1] - 140]} color={C.second} w={8} head={30} o={fin(f, t0 - 10)} />
            <circle cx={O11[0]} cy={O11[1] - R11} r={10} fill={C.key} opacity={fin(f, t90 - 20)} />
            <Arrow p={[O11[0], O11[1] - R11]} q={[O11[0] - 140, O11[1] - R11]} color={C.second} w={8} head={30} o={fin(f, t90 - 10)} />
            <circle cx={tip[0]} cy={tip[1]} r={10} fill={C.key} opacity={fin(f, tBal - 10)} />
            <Arrow p={tip} q={at(tip, ET, 150)} color={C.second} w={8} head={30} o={fin(f, tBal - 10)} />
            <RightTick at={tip} u1={[-ER[0], -ER[1]]} u2={ET} c={C.gold} o={fin(f, tLen)} />
            <Arrow p={tip} q={at(tip, ER, 150)} color={C.second} w={8} head={30} o={fin(f, tDotW - 10)} />
          </g>
        </g>
        {/* U1 wide view: the station, the 5-km circle, the balloon at (3, 4) km, r and θ */}
        <g opacity={big}>
          <circle cx={OW[0]} cy={OW[1]} r={RW} fill="none" stroke={C.first} strokeWidth={4} opacity={0.6} />
          <Dash p={OW} q={[OW[0] + RW + 40, OW[1]]} c={C.muted} w={3} />
          {/* fix 2 (review 2 Should 3): the radius is ink (teal means u_θ in this movie) */}
          <line x1={OW[0]} y1={OW[1]} x2={BW[0]} y2={BW[1]} stroke={C.ink} strokeWidth={5} />
          <path d={arcD(OW, 60, 0, TH)} fill="none" stroke={C.local} strokeWidth={5} />
          <Station at={OW} s={0.6} />
          <BDot p={BW} r={11} />
          {/* K6 after fix 1c: under the east ray, inside the circle (it crossed the circle and the inset frame) */}
          <Lbl x={OW[0] - 18} y={OW[1] + 46} t="θ ≈ 53.13°" c={C.local} s={T.floor} />
          <Lbl x={360} y={470} t="r = 5 km" c={C.ink} s={T.floor} a="end" o={fin(f, tB5 + 6)} />
          <Lbl x={BW[0] + 30} y={BW[1] - 32} t="(3 km, 4 km)" c={C.key} s={T.floor} o={fin(f, t34)} />
        </g>
        {/* the zoom box round the balloon, leading to the magnified inset */}
        <g opacity={ins}>
          <rect x={BW[0] - 20} y={BW[1] - 20} width={40} height={40} fill="none" stroke={C.gold} strokeWidth={3} />
          <line x1={BW[0] + 20} y1={BW[1] - 20} x2={IFR.x} y2={IFR.y} stroke={C.gold} strokeWidth={2} opacity={0.7} />
          <line x1={BW[0] + 20} y1={BW[1] + 20} x2={IFR.x} y2={IFR.y + IFR.h} stroke={C.gold} strokeWidth={2} opacity={0.7} />
          {/* fix 2 (review 2 Should 10): an outline only (house style: no boxes) */}
          <rect x={IFR.x} y={IFR.y} width={IFR.w} height={IFR.h} rx={12} fill="none" stroke={C.gold} strokeWidth={3} />
          <Lbl x={IFR.x + 20} y={IFR.y + 30} t="magnified" c={C.muted} s={T.floor} />
          <path d={arcU1} fill="none" stroke={C.first} strokeWidth={4} opacity={0.75} />
          <Arrow p={B0} q={at(B0, ER, 90)} color={C.second} w={7} head={26} />
          <circle cx={B0[0]} cy={B0[1]} r={10} fill={C.key} />
          <circle cx={A1[0]} cy={A1[1]} r={10} fill={C.key} opacity={0.85} />
          {/* fix 2 (review 2 Should 10): "before" under its dot, below the "7.0 m" leg label; "after 0.1°" up-left, clear of "≈ 8.7 m" */}
          <Lbl x={B0[0] + 30} y={B0[1] + 104} t="before" c={C.key} s={T.floor} a="middle" />
          <Lbl x={A1[0] - 10} y={A1[1] - 62} t="after 0.1°" c={C.key} s={T.floor} a="middle" />
          <g opacity={fin(f, t87)}>
            <Arrow p={B0} q={A1} color={C.gold} w={7} head={26} />
            {/* fix 2: 86 px off the slide's middle (it touched the arrowhead at 48 px) */}
            <Lbl x={(B0[0] + A1[0]) / 2 + ER[0] * 86} y={(B0[1] + A1[1]) / 2 + ER[1] * 86} t="≈ 8.7 m" c={C.gold} s={T.floor} a="middle" />
          </g>
          <Dash p={B0} q={CN} c={C.second} w={5} o={fin(f, tWest)} />
          <Lbl x={(B0[0] + CN[0]) / 2} y={B0[1] + 44} t="7.0 m" c={C.second} s={T.floor} a="middle" o={fin(f, tWest)} />
          <Dash p={CN} q={A1} c={C.second} w={5} o={fin(f, tNorth)} />
          <Lbl x={CN[0] - 20} y={(CN[1] + A1[1]) / 2} t="5.2 m" c={C.second} s={T.floor} a="end" o={fin(f, tNorth)} />
        </g>
        {/* fix 2 (review 2 Must 2d): the tick sits right of "θ̂ ≈ (−0.80, 0.60)" and a gold link runs up to θ̂ = (−sin θ, cos θ) */}
        <Check x={1660} y={yTh} o={fin(f, tAgain) * u1out} />
        <CurvedLink f={f} from={[1700, yTh - 30]} to={[1700, 250]} start={tAgain + 8} end={tKeep - 12} bend={60} />
        {/* fix 2 (review 2 Must 1): the keep line's own picture: the balloon on its circle, r̂ out, θ̂ round (anticlockwise), the +90° arc */}
        <g opacity={keepO}>
          <circle cx={KO[0]} cy={KO[1]} r={KR} fill="none" stroke={C.first} strokeWidth={4} opacity={0.55} />
          <Dash p={KO} q={[KO[0] + KR + 50, KO[1]]} c={C.muted} w={3} />
          <line x1={KO[0]} y1={KO[1]} x2={KB[0]} y2={KB[1]} stroke={C.ink} strokeWidth={4} opacity={0.55} />
          <path d={arcD(KO, 70, 0, TH)} fill="none" stroke={C.local} strokeWidth={5} />
          <Lbl x={KO[0] + 92} y={KO[1] - 36} t="θ" c={C.local} s={T.key} />
          <Station at={KO} s={0.7} />
          <path d={arcD(KO, KR + 40, TH - 30, TH + 12)} fill="none" stroke={C.local} strokeWidth={4} opacity={0.7 * fin(f, AT(k, 24, "anticlockwise"))} />
          <ArcHead c={KO} r={KR + 40} a={TH + 12} dir={1} col={C.local} o={0.7 * fin(f, AT(k, 24, "anticlockwise"))} />
          <Arrow p={KB} q={at(KB, ER, KL)} color={C.second} o={fin(f, AT(k, 24, "r hat points away"))} />
          <Arrow p={KB} q={at(KB, ET, KL)} color={C.second} o={fin(f, AT(k, 24, "theta hat points round"))} />
          <path d={arcD(KB, 78, TH + 6, TH + 90 * prog(f, AT(k, 24, "turned by ninety"), AT(k, 24, "turned by ninety") + 24))} fill="none" stroke={C.gold} strokeWidth={5}
            opacity={fin(f, AT(k, 24, "turned by ninety"))} />
          <ArcHead c={KB} r={78} a={TH + 90 * prog(f, AT(k, 24, "turned by ninety"), AT(k, 24, "turned by ninety") + 24)} dir={1} col={C.gold} o={fin(f, AT(k, 24, "turned by ninety") + 16)} />
          <Lbl x={545} y={160} t="+90°" c={C.gold} s={T.floor} a="middle" o={fin(f, AT(k, 24, "turned by ninety") + 20)} />
          <BDot p={KB} />
        </g>
        <Lbl x={1080} y={440} t="anticlockwise, seen from above" c={C.key} s={T.floor} o={keepO * fin(f, AT(k, 24, "anticlockwise"))} />
        <Lbl x={(O11[0] + R(foot)[0]) / 2 + (rot > 45 ? 22 : 0)} y={(O11[1] + R(foot)[1]) / 2 + (rot > 45 ? 30 : 44)} t="cos θ" c={C.second} s={T.floor} a={rot > 45 ? "start" : "middle"}
          o={triO * (1 - bigIn) * (rot > 5 && rot < 85 ? 0 : 1)} />
        {/* K6 after fix 1c: the turned label starts right of the θ̂ tip label (x 185), above its step; the gold link leaves from its right end */}
        <Lbl x={rot > 45 ? SW11 : (R(foot)[0] + R(tip)[0]) / 2 + 110} y={(R(foot)[1] + R(tip)[1]) / 2 - (rot > 45 ? 40 : 0)} t={rot > 45 ? "sin θ, pointing west" : "sin θ"} c={C.second} s={T.floor} a="start"
          o={triO * (1 - bigIn) * (rot > 5 && rot < 85 ? 0 : 1)} />
        <Lbl x={O11[0] + R11 + 26} y={O11[1] - 150} t="north" c={C.key} s={T.floor} o={pts * fin(f, AT(k, 10, "It points north"))} />
        <CurvedLink f={f} from={[SW11 + textW("sin θ, pointing west", T.floor) + 14, (R(foot)[1] + R(tip)[1]) / 2 - 40]} to={[1215, 240]} start={AT(k, 7, "minus sine theta")} end={tChk - 10} bend={40} />
        <Lbl x={O11[0] - 160} y={O11[1] - R11 - 40} t="west" c={C.key} s={T.floor} a="middle" o={pts * fin(f, SS(k, 12))} />

      </Svg>
      <Tip p={O11} v={rotS(ER, rot)} L={R11} s={rot > 45 ? THAT : RHAT} o={triO * (1 - bigIn) * (rot > 5 && rot < 85 ? 0 : 1) * (rot > 45 ? fin(f, tW + 10) : 1)} d={40} />
      <Tip p={tip} v={ET} L={150} s={THAT} o={pts * fin(f, tBal)} d={36} size={50} />
      <Tip p={tip} v={ER} L={150} s={RHAT} o={pts * fin(f, tDotW - 10)} d={36} size={50} />
      <Tip p={B0} v={ER} L={90} s={RHAT} d={30} size={50} o={ins} />
      {/* fix 2 (review 2 Should 2): θ̂ set in KaTeX (the sans keyword drew the combining hat offset) */}
      <TeX s={String.raw`\text{without the }\hat{\boldsymbol\theta}\text{ formula}`} x={1080} y={294} size={48} c={C.gold} o={fin(f, tLast, 8) * fout(f, tAft - 14)} />   {/* K6 k6f2b: leaves before the long U1 rows slide up through it */}
      <Tip p={KB} v={ER} L={KL} s={RHAT} o={keepO * fin(f, AT(k, 24, "r hat points away"))} />
      <Tip p={KB} v={ET} L={KL} s={THAT} o={keepO * fin(f, AT(k, 24, "theta hat points round"))} />
      <TeX s={EQ_S09} x={1080} y={340} size={60} c={C.second} o={keepO * fin(f, AT(k, 24, "turned by ninety"))} />
      <KX s={String.raw`\text{turn }\hat{\mathbf r}`} x={1080} y={110} o={fout(f, tR - 18) * fin(f, 0)} />
      <TeX s={String.raw`\hat{\mathbf r}=(\cos\theta,\ \sin\theta)`} x={1080} y={110} size={60} c={C.ink} o={fin(f, tR)} />
      <TeX s={EQ_S11} x={1080} y={210} size={72} c={C.second} o={fin(f, tRes)} />
      <TeX s={String.raw`(p,\ q)\to(-q,\ p)`} x={1080} y={310} size={50} o={win(f, tRule, tChk - 18)} />
      <TeX s={String.raw`p=\cos\theta,\ \ q=\sin\theta`} x={1080} y={380} size={50} o={win(f, AT(k, 2, "put a minus") , tChk - 18)} />
      <CalcStack f={f} x={1240} y={380} size={48} maxLines={3} o={fout(f, tLast)} rows={[
        { lhs: String.raw`\theta=0^\circ:\ \hat{\boldsymbol\theta}`, rhs: String.raw`=(-\sin0^\circ,\ \cos0^\circ)`, at: AT(k, 9, "Minus sine zero") },
        { rhs: String.raw`=(0,\ 1)`, at: t0, cont: true },
        { lhs: String.raw`\theta=90^\circ:\ \hat{\boldsymbol\theta}`, rhs: String.raw`=(-\sin90^\circ,\ \cos90^\circ)`, at: AT(k, 11, "Minus sine ninety") },
        { rhs: String.raw`=(-1,\ 0)`, at: t90, cont: true },
        { lhs: String.raw`\theta\approx53.13^\circ:\ \hat{\boldsymbol\theta}`, rhs: String.raw`=(-0.8,\ 0.6)`, at: tBal },
        { lhs: String.raw`|\hat{\boldsymbol\theta}|`, rhs: String.raw`=\sqrt{(-0.8)^2+0.6^2}`, at: tLen },
        { rhs: String.raw`=\sqrt{0.64+0.36}=1`, at: tLen + 40, cont: true },
        { lhs: String.raw`\hat{\mathbf r}\cdot\hat{\boldsymbol\theta}`, rhs: String.raw`=0.6\times(-0.8)+0.8\times0.6`, at: tDotW },
        { rhs: String.raw`=-0.48+0.48=0`, at: tDotW + 50, cont: true },
      ]} />
      {/* U1 column: one line per spoken phrase */}
      {/* K6 after fix 1c: "=" column 1250 → 1290 (the "before" label clears the inset), long rows split at their "≈"/"=", two lines
          visible (the tallest pair, x and y, is six rows: y 370-760) */}
      <CalcStack f={f} x={1290} y={390} size={46} maxLines={2} o={u1out} rows={[   /* K6 k6f2: 20 px lower, clear of the keyword while rows slide out */
        { lhs: String.raw`\Delta\theta`, rhs: String.raw`=0.1^\circ=0.1\times\pi/180`, at: tRadA },
        { rhs: String.raw`\approx0.001745\ \mathrm{rad}`, at: tRadB, cont: true },
        { lhs: "r", rhs: String.raw`=5\ \mathrm{km}=5000\ \mathrm{m}`, at: tArc },
        { lhs: "s", rhs: String.raw`=r\,\Delta\theta`, at: tArc + 40 },
        { rhs: String.raw`=5000\ \mathrm{m}\times0.001745`, at: t5000, cont: true },
        { rhs: String.raw`\approx8.7\ \mathrm{m}`, at: t87, cont: true },
        { lhs: String.raw`(x,\ y)`, rhs: String.raw`=(r\cos\theta,\ r\sin\theta)`, at: tXY },
        // fix 2 (review 2 Must 2c): an angle and a position are two rows (no "53.13° = (3000, 4000) m"), inside the column (x ≥ 1080)
        { lhs: String.raw`\text{before: }\theta`, rhs: String.raw`\approx53.13^\circ`, at: tFrom },
        { lhs: String.raw`(x,\ y)`, rhs: String.raw`=(3000,\ 4000)\ \mathrm{m}`, at: tFrom + 30, cont: true },
        // fix 2 (review 2 Should 9): the angle carries the digits its cos/sin use: 53.1301° + 0.1° = 53.2301°
        { lhs: String.raw`\text{after: }\theta`, rhs: String.raw`=53.1301^\circ+0.1^\circ`, at: tAft },
        { rhs: String.raw`=53.2301^\circ`, at: tAft + 25, cont: true },
        { lhs: "x", rhs: String.raw`=5000\times\cos53.2301^\circ`, at: tTo },
        { rhs: String.raw`=5000\times0.598603`, at: tTo + 30, cont: true },
        { rhs: String.raw`\approx2993.0\ \mathrm{m}`, at: tTo + 50, cont: true },
        { lhs: "y", rhs: String.raw`=5000\times\sin53.2301^\circ`, at: tTo2 },
        { rhs: String.raw`=5000\times0.801046`, at: tTo2 + 30, cont: true },
        { rhs: String.raw`\approx4005.2\ \mathrm{m}`, at: tTo2 + 50, cont: true },
        { lhs: String.raw`\Delta x`, rhs: String.raw`=2993.0-3000`, at: tWest },
        { rhs: String.raw`=-7.0\ \mathrm{m}\ \text{(west)}`, at: tWest + 20, cont: true },
        { lhs: String.raw`\Delta y`, rhs: String.raw`=4005.2-4000`, at: tNorth },
        { rhs: String.raw`=+5.2\ \mathrm{m}\ \text{(north)}`, at: tNorth + 20, cont: true },
        // fix 2 (review 2 Must 2a): the length check, each row on its spoken words
        // (a short left side "length", so the √ never starts left of the column: measured x ≥ 1150)
        { lhs: String.raw`\text{length}`, rhs: String.raw`=\sqrt{7.0^2+5.2^2}`, at: tSq, h: 84 },
        { rhs: String.raw`=\sqrt{49+27.04}`, at: AT(k, 22, "twenty seven point zero four"), cont: true, h: 84 },
        { rhs: String.raw`=\sqrt{76.04}`, at: tRoot, cont: true, h: 84 },
        { rhs: String.raw`\approx8.7\ \mathrm{m}=s`, at: t87b, cont: true, h: 70 },
        { lhs: String.raw`-7.0/8.7`, rhs: String.raw`\approx-0.80`, at: tGives },
        { lhs: String.raw`5.2/8.7`, rhs: String.raw`\approx0.60`, at: tGives + 30 },
        { lhs: String.raw`\hat{\boldsymbol\theta}`, rhs: String.raw`\approx(-0.80,\ 0.60)`, at: tAgain },
      ]} />
    </Scene>
  );
};

// ================================================================ s12 polar unit vectors depend on place
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12_arrows_depend");
  const tE = AT(k, 1, "Due east"), tN = AT(k, 2, "Due north"), tW = AT(k, 3, "Due west"), tNever = SS(k, 4), tDep = SS(k, 5), tP2 = SS(k, 6);
  // K6 after fix 1c: the balloon now stays at each stop while its sentence is spoken (it used to leave 10 frames after "Due east",
  // so "θ = 0°" rode along to 89°), and moves in the sentence's last 40 frames; [arrive, angle, leave]
  const keys: [number, number, number][] = [[0, TH, 6], [tE, 360, SE(k, 1) - 40], [tN, 450, SE(k, 2) - 40], [tW, 540, SE(k, 3) - 40], [SE(k, 4), 360 + TH, LEN(k)]];
  let th = TH;
  for (let i = 1; i < keys.length; i++) if (f >= keys[i - 1][2]) th = mix(keys[i - 1][1], keys[i][1], prog(f, keys[i - 1][2], keys[i][0] - 4));
  const O12: Pt = [430, 430], R12 = 230, L12 = 130;
  const b = onC(O12, R12, th), er: Pt = [Math.cos(th * D2R), -Math.sin(th * D2R)], et = rotS(er, 90);
  const G: Pt = [150, 790];
  return (
    <Scene>
      <Svg>
        <circle cx={O12[0]} cy={O12[1]} r={R12} fill="none" stroke={C.first} strokeWidth={4} opacity={0.55} />
        <Station at={O12} s={0.75} />
        <line x1={O12[0]} y1={O12[1]} x2={b[0]} y2={b[1]} stroke={C.ink} strokeWidth={4} opacity={0.4} />
        <Arrow p={b} q={at(b, er, L12)} color={C.second} />
        <Arrow p={b} q={at(b, et, L12)} color={C.second} />
        <BDot p={b} />
        {[[tE, keys[1][2], "θ = 0°"], [tN, keys[2][2], "θ = 90°"], [tW, keys[3][2], "θ = 180°"]].map(([a, b2, t]) => (
          <Lbl key={t as string} x={b[0] - er[0] * 100} y={b[1] - er[1] * 100} t={t as string} c={C.local} s={T.floor} a="middle" o={win(f, (a as number) + 20, (b2 as number) - 10)} />))}
        <Arrow p={G} q={[G[0] + 90, G[1]]} color={C.second} w={6} head={24} o={0.55} />
        <Arrow p={G} q={[G[0], G[1] - 90]} color={C.second} w={6} head={24} o={0.55} />
        <Keyword f={f} text="depend on where you are" at={[1080, 700]} appear={tDep} />
        <Keyword f={f} text="Part 2: turning arrows" at={[1080, 790]} s={T.floor} appear={tP2} />
      </Svg>
      <Tip p={b} v={er} L={L12} s={RHAT} />
      <Tip p={b} v={et} L={L12} s={THAT} />
      <TeX s={String.raw`\hat{\mathbf x}`} x={G[0] + 120} y={G[1]} size={48} c={C.second} o={0.75} />
      <TeX s={String.raw`\hat{\mathbf y}`} x={G[0] + 16} y={G[1] - 120} size={48} c={C.second} o={0.75} />
      <KX s={String.raw`\hat{\mathbf x},\ \hat{\mathbf y}:\ \text{never change}`} x={1080} y={560} o={fin(f, tNever)} size={50} />
      <Svg><Keyword f={f} text="watch both arrows" at={[1080, 110]} appear={0} out={tE - 18} /></Svg>
      {/* fix 1c C17: θ named and substituted at each stop */}
      {/* K6 after fix 1c: each row split at its result (the 180° rows ran to x 1980); two lines visible, so the stop being spoken
          (r̂ and θ̂, four rows, y 130-390) stays and the stop before it slides away */}
      <CalcStack f={f} x={1300} y={130} size={46} maxLines={2} dim={0.85} rows={[
        { lhs: String.raw`\theta=0^\circ:\ \hat{\mathbf r}`, rhs: String.raw`=(\cos0^\circ,\ \sin0^\circ)`, at: tE + 20 },
        { rhs: String.raw`=(1,\ 0)`, at: tE + 35, cont: true },
        { lhs: String.raw`\hat{\boldsymbol\theta}`, rhs: String.raw`=(-\sin0^\circ,\ \cos0^\circ)`, at: tE + 50 },
        { rhs: String.raw`=(0,\ 1)`, at: tE + 65, cont: true },
        { lhs: String.raw`\theta=90^\circ:\ \hat{\mathbf r}`, rhs: String.raw`=(\cos90^\circ,\ \sin90^\circ)`, at: tN + 20 },
        { rhs: String.raw`=(0,\ 1)`, at: tN + 35, cont: true },
        { lhs: String.raw`\hat{\boldsymbol\theta}`, rhs: String.raw`=(-\sin90^\circ,\ \cos90^\circ)`, at: tN + 50 },
        { rhs: String.raw`=(-1,\ 0)`, at: tN + 65, cont: true },
        { lhs: String.raw`\theta=180^\circ:\ \hat{\mathbf r}`, rhs: String.raw`=(\cos180^\circ,\ \sin180^\circ)`, at: tW + 20 },
        { rhs: String.raw`=(-1,\ 0)`, at: tW + 35, cont: true },
        { lhs: String.raw`\hat{\boldsymbol\theta}`, rhs: String.raw`=(-\sin180^\circ,\ \cos180^\circ)`, at: tW + 50 },
        { rhs: String.raw`=(0,\ -1)`, at: tW + 65, cont: true },
      ]} />
    </Scene>
  );
};

// ================================================================ s13 a wind's radial and tangential parts (D04)
const B13: Pt = [430, 520], L13 = 210, MS = 30;   // r̂, θ̂ drawn 210 px; the wind 30 px per m/s
const ER13 = ER, ET13 = ET;
const LOC: Pt = [190, 170];   // s13 locator centre (fix 1c C18)
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = K("s13_components");
  const tWind = SS(k, 3), tBold = AT(k, 4, "bold u"), tUV = SS(k, 5), t10 = SS(k, 6), tRad = SS(k, 8), tTan = SS(k, 9), tDot = SS(k, 10), tSh = AT(k, 11, "shadow"),
    tIn = SS(k, 12), tIW = SS(k, 13), tITh = SS(k, 14), tIR = AT(k, 15, "R hat is"), tIT = AT(k, 15, "theta hat is"), tR1 = SS(k, 17), tR6 = AT(k, 18, "u sub r is six"),
    tT1 = SS(k, 19), tT8 = AT(k, 20, "minus eight metres"), tSay = SS(k, 21), tCw = SS(k, 22);
  const W = at(B13, [1, 0], 10 * MS);
  const fr = at(B13, ER13, 6 * MS * prog(f, tR6 - 4, tR6 + 14)), ft = at(B13, ET13, -8 * MS * prog(f, tT8 - 4, tT8 + 14));
  const footR = at(B13, ER13, 6 * MS), footT = at(B13, ET13, -8 * MS);
  return (
    <Scene>
      <Svg>
        {/* fix 1 Should 1: one colour per quantity everywhere: radial u_r rose, tangential u_θ teal (the negative u_θ keeps its hatch and "−") */}
        <defs><pattern id="h13" width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1={0} y1={0} x2={0} y2={16} stroke={C.first} strokeWidth={6} /></pattern></defs>
        <Dash p={at(B13, ER13, -260)} q={at(B13, ER13, 330)} c={C.second} w={2.5} o={0.5} />
        <Dash p={at(B13, ET13, -330)} q={at(B13, ET13, 280)} c={C.second} w={2.5} o={0.5} />
        <Lbl x={at(B13, ER13, -240)[0] + 20} y={at(B13, ER13, -240)[1] + 36} t="to the station" c={C.muted} s={T.floor} />
        {/* fix 1c C18: where this close-up is (locator: station, 5-km circle, the balloon at 53°) and the two scales */}
        <g opacity={0.9}>
          <circle cx={LOC[0]} cy={LOC[1]} r={60} fill="none" stroke={C.first} strokeWidth={3} opacity={0.7} />
          <circle cx={LOC[0]} cy={LOC[1]} r={6} fill={C.gold} />
          <line x1={LOC[0]} y1={LOC[1]} x2={LOC[0] + 60 * ER[0]} y2={LOC[1] + 60 * ER[1]} stroke={C.ink} strokeWidth={3} />
          <path d={arcD(LOC, 22, 0, TH)} fill="none" stroke={C.local} strokeWidth={3} />
          <rect x={LOC[0] + 60 * ER[0] - 9} y={LOC[1] + 60 * ER[1] - 9} width={18} height={18} fill="none" stroke={C.gold} strokeWidth={3} />
          <line x1={LOC[0] + 60 * ER[0] + 9} y1={LOC[1] + 60 * ER[1] + 9} x2={B13[0] - 24} y2={B13[1] - 24} stroke={C.gold} strokeWidth={2} strokeDasharray="8 8" opacity={0.7} />
          <Lbl x={LOC[0] + 74} y={LOC[1] + 40} t="θ = 53°" c={C.local} s={T.floor} />
        </g>

        <Lbl x={560} y={162} t="wind: its own scale" c={C.muted} s={T.floor} o={fin(f, tWind)} />
        <Lbl x={W[0] + 104} y={W[1] - 24} t="10 m/s" c={C.ink} s={T.floor} o={fin(f, AT(k, 3, "ten metres per second"))} />
        <Lbl x={W[0] + 104} y={W[1] + 30} t="due east" c={C.ink} s={T.floor} o={fin(f, AT(k, 3, "ten metres per second"))} />
        <g opacity={fin(f, tSh)}>
          <Dash p={W} q={footR} c={C.key} w={4} />
          <Dash p={W} q={footT} c={C.key} w={4} />
        </g>
        <Band p={B13} q={fr} color={C.neg} o={fin(f, tR6 - 4)} w={22} />
        {f >= tT8 - 4 ? <line x1={B13[0]} y1={B13[1]} x2={ft[0]} y2={ft[1]} stroke="url(#h13)" strokeWidth={22} /> : null}
        <Band p={B13} q={ft} color={C.first} o={0.5 * fin(f, tT8 - 4)} w={22} />
        <Arrow p={B13} q={at(B13, ER13, L13)} color={C.second} />
        <Arrow p={B13} q={at(B13, ET13, L13)} color={C.second} />
        <g opacity={fin(f, tWind)}><AnimatedWindArrow from={B13} to={W} speed={10} f={f} c={C.ink} px={10} head={40} /></g>
        <BDot p={B13} />
        <path d={arcD([B13[0] - 6 * 60 * ER13[0], B13[1] - 6 * 60 * ER13[1]], 300, TH + 25, TH - 25)} fill="none" stroke={C.first} strokeWidth={5} opacity={fin(f, tCw)} />
        <ArcHead c={[B13[0] - 6 * 60 * ER13[0], B13[1] - 6 * 60 * ER13[1]]} r={300} a={TH - 25} dir={-1} col={C.first} o={fin(f, tCw)} />
        <Lbl x={1080} y={770} t="6 m/s away · 8 m/s round" c={C.key} s={T.floor} o={fin(f, tSay)} />
        <Lbl x={1080} y={830} t="clockwise, seen from above" c={C.first} s={T.floor} o={fin(f, tCw)} />
        <Keyword f={f} text="wind in polar coordinates" at={[1080, 110]} appear={0} out={tUV - 18} />
        <SkipChip f={f} k={k} to={keepTime("s14_rebuild_general")} />
        <Keyword f={f} text="shadow" at={[at(W, [0, 1], 0)[0] + 20, W[1] + 92]} s={T.floor} appear={tSh} out={tR1 - 18} />
      </Svg>
      <Tip p={B13} v={ER13} L={L13} s={RHAT} />
      <Tip p={B13} v={ET13} L={L13} s={THAT} />
      <TeX s={String.raw`\mathbf u`} x={W[0] + 50} y={W[1]} size={60} c={C.ink} o={fin(f, tBold)} />
      {/* fix 2 (review 2 Should 2): r̂, θ̂ set in KaTeX (the sans label drew θ̂'s hat offset) */}
      <TeX s={String.raw`\hat{\mathbf r},\ \hat{\boldsymbol\theta}:\ \text{length 1}`} x={560} y={110} size={44} c={C.muted} o={fin(f, tWind)} />
      <TeX s={String.raw`u_r=6`} x={footR[0] - 30} y={footR[1] - 40} ax={1} size={52} c={C.neg} o={fin(f, tR6 + 10)} />
      <TeX s={String.raw`u_\theta=-8`} x={footT[0] + 30} y={footT[1] + 40} size={52} c={C.first} o={fin(f, tT8 + 10)} />
      <TeX s={String.raw`\mathbf u=(u,\ v)=(10,\ 0)\ \mathrm{m/s}`} x={1080} y={110} size={54} o={fin(f, tUV) * fout(f, tIn - 18)} />
      <TeX s={String.raw`\mathbf u=(10,\ 0)\ \mathrm{m/s}`} x={1080} y={110} size={50} o={fin(f, tIW)} />
      <TeX s={String.raw`\theta=53^\circ`} x={1560} y={110} size={50} c={C.local} o={fin(f, tITh)} />
      <TeX s={String.raw`\hat{\mathbf r}=(0.6,\ 0.8)`} x={1080} y={185} size={50} c={C.second} o={fin(f, tIR)} />
      <TeX s={String.raw`\hat{\boldsymbol\theta}=(-0.8,\ 0.6)`} x={1490} y={185} size={50} c={C.second} o={fin(f, tIT)} />
      <TeX s={String.raw`u_r:\ \text{along }\hat{\mathbf r}`} x={1080} y={290} size={50} c={C.neg} o={fin(f, tRad)} />
      <TeX s={String.raw`u_\theta:\ \text{along }\hat{\boldsymbol\theta}`} x={1460} y={290} size={50} c={C.first} o={fin(f, tTan)} />
      <TeX s={EQ_S13} x={1080} y={390} size={60} o={fin(f, tDot)} />
      <CalcStack f={f} x={1180} y={440} size={50} rows={[
        { lhs: "u_r", rhs: String.raw`=10\times0.6+0\times0.8`, at: tR1 },
        { rhs: String.raw`=6+0=6\ \mathrm{m/s}`, at: tR6, cont: true },
        { lhs: String.raw`u_\theta`, rhs: String.raw`=10\times(-0.8)+0\times0.6`, at: tT1 },
        { rhs: String.raw`=-8+0=-8\ \mathrm{m/s}`, at: tT8, cont: true },
      ]} />
    </Scene>
  );
};

// ================================================================ s14 rebuild the wind; the general formulas
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14_rebuild_general");
  const tRb = SS(k, 1), t6 = SS(k, 2), t8 = SS(k, 3), tE = SS(k, 4), tN = SS(k, 5), tBack = AT(k, 6, "ten, zero"), tLen = SS(k, 7), tAny = SS(k, 8), tUr = SS(k, 9), tUt = SS(k, 10), tSoon = SS(k, 11);
  const W = at(B13, [1, 0], 10 * MS);
  const A1 = at(B13, ER13, 6 * MS), A2 = at(A1, ET13, -8 * MS);
  const g1 = prog(f, t6, t6 + 30), g2 = prog(f, t8, t8 + 30);
  const [ur, ut] = cutAt(EQ_S14, String.raw`,\qquad `);
  const [urL, urR] = cutAt(ur, "="), [utL, utR] = cutAt(ut, "=");
  const old = fout(f, tAny - 6, 20) * 0.6 + 0.4;
  return (
    <Scene>
      <Svg>
        <Band p={B13} q={A1} color={C.neg} o={0.35} w={22} />
        <Band p={B13} q={at(B13, ET13, -8 * MS)} color={C.first} o={0.25} w={22} />
        <Arrow p={B13} q={at(B13, ER13, L13)} color={C.second} o={0.6} />
        <Arrow p={B13} q={at(B13, ET13, L13)} color={C.second} o={0.6} />
        <AnimatedWindArrow from={B13} to={W} speed={10} f={f} c={C.ink} px={10} head={40} o={0.55} />
        <Arrow p={B13} q={at(B13, ER13, 6 * MS * g1)} color={C.neg} o={fin(f, t6)} />
        {g1 >= 1 ? <Arrow p={A1} q={at(A1, ET13, -8 * MS * g2)} color={C.first} o={fin(f, t8)} /> : null}
        <g opacity={win(f, tE, tBack + 20)}>
          <line x1={B13[0]} y1={B13[1] + 60} x2={A1[0]} y2={B13[1] + 60} stroke={C.gold} strokeWidth={10} opacity={0.8} />
          <line x1={A1[0]} y1={B13[1] + 60} x2={A2[0]} y2={B13[1] + 60} stroke={C.gold} strokeWidth={10} opacity={0.5} />
          <Lbl x={(B13[0] + A1[0]) / 2} y={B13[1] + 104} t="3.6" c={C.gold} s={T.floor} a="middle" />
          <Lbl x={(A1[0] + A2[0]) / 2} y={B13[1] + 104} t="6.4" c={C.gold} s={T.floor} a="middle" />
        </g>
        <g opacity={win(f, tN, tBack + 20)}>
          <line x1={A2[0] + 50} y1={B13[1]} x2={A2[0] + 50} y2={A1[1]} stroke={C.gold} strokeWidth={10} opacity={0.6} />
          <Lbl x={A2[0] + 74} y={(B13[1] + A1[1]) / 2} t="4.8 up, 4.8 down" c={C.gold} s={T.floor} />
        </g>
        <BDot p={B13} />
        <Check x={W[0] + 30} y={W[1] - 50} o={fin(f, tBack)} />
        <Keyword f={f} text="same wind?" at={[1080, 110]} appear={0} out={t6 - 18} />
        <Keyword f={f} text="used on a hurricane soon" at={[1080, 820]} s={T.floor} appear={tSoon} />
      </Svg>
      <TeX s={String.raw`6\,\hat{\mathbf r}`} x={at(B13, ER13, 6 * MS)[0] - 40} y={at(B13, ER13, 6 * MS)[1] - 30} size={52} ax={1} c={C.neg} o={fin(f, t6 + 20)} />
      <TeX s={String.raw`-8\,\hat{\boldsymbol\theta}`} x={(A1[0] + A2[0]) / 2 + 30} y={(A1[1] + A2[1]) / 2 - 30} size={52} c={C.first} o={fin(f, t8 + 20)} />
      {/* fix 1 Should 14: r̂ and θ̂ are named while the voice says "six times r hat plus minus eight times theta hat" */}
      <Tip p={B13} v={ER13} L={L13} s={RHAT} o={0.8} />
      <Tip p={B13} v={ET13} L={L13} s={THAT} o={0.8} />
      <TeX s={String.raw`\mathbf u`} x={W[0] + 50} y={W[1] + 10} size={56} c={C.ink} o={0.7} />
      {/* fix 1c C19/C20: scalar × vector part by part, the double minus, and the lengths with their squares */}
      <CalcStack f={f} x={1220} y={110} size={46} maxLines={2} o={old} rows={[
        { lhs: String.raw`6\,\hat{\mathbf r}`, rhs: String.raw`=6\,(0.6,\ 0.8)`, at: t6 + 10 },
        { rhs: String.raw`=(6\times0.6,\ 6\times0.8)`, at: AT(k, 2, "zero point six, zero point eight"), cont: true },
        { rhs: String.raw`=(3.6,\ 4.8)`, at: AT(k, 2, "three point six"), cont: true },
        { lhs: String.raw`-8\,\hat{\boldsymbol\theta}`, rhs: String.raw`=-8\,(-0.8,\ 0.6)`, at: t8 + 10 },
        { rhs: String.raw`=\big((-8)(-0.8),\ (-8)(0.6)\big)`, at: AT(k, 3, "is plus six point four"), cont: true },
        { rhs: String.raw`=(6.4,\ -4.8)`, at: AT(k, 3, "minus four point eight"), cont: true },
        { lhs: "\\text{sum}", rhs: String.raw`=(3.6+6.4,\ 4.8-4.8)`, at: tE },
        { rhs: String.raw`=(10,\ 0)`, at: tBack, cont: true },
        { lhs: String.raw`\sqrt{6^2+8^2}`, rhs: String.raw`=\sqrt{36+64}`, at: tLen },
        { rhs: String.raw`=\sqrt{100}=10\ \mathrm{m/s}`, at: AT(k, 7, "square root is ten"), cont: true },
        { lhs: String.raw`|(10,\ 0)|`, rhs: String.raw`=\sqrt{10^2+0^2}=10\ \mathrm{m/s}`, at: AT(k, 7, "wind's own length") },
      ]} />
      <CalcStack f={f} x={1180} y={470} size={54} maxLines={4} rows={[
        { lhs: urL, rhs: String.raw`=(u,\ v)\cdot(\cos\theta,\ \sin\theta)`, at: AT(k, 9, "u sub r is") },
        { rhs: `=${urR}`, at: AT(k, 9, "u cosine theta"), cont: true },
        { lhs: utL, rhs: String.raw`=(u,\ v)\cdot(-\sin\theta,\ \cos\theta)`, at: AT(k, 10, "u sub theta is") },
        { rhs: `=${utR}`, at: AT(k, 10, "minus u sine"), cont: true },
      ]} />
    </Scene>
  );
};

// ================================================================ turned axes (s15-s19): origin O15, 80 px per km
const O15: Pt = [400, 560], U15 = 80, A30 = 30;
const P15 = (x: number, y: number): Pt => [O15[0] + x * U15, O15[1] - y * U15];
const Rulers: React.FC<{ a: number; o?: number; c?: string; ticks?: boolean; label?: [string, string] }> = ({ a, o = 1, c = C.second, ticks = true, label }) => {
  if (o <= 0) return null;
  const ex = rotS([1, 0], a), ey = rotS([0, -1], a);
  const L0 = 3.2 * U15, L1 = 6.2 * U15, Ly = 5.4 * U15;
  return (
    <g opacity={o}>
      <Arrow p={at(O15, ex, -L0 * 0.6)} q={at(O15, ex, L1)} color={c} w={5} head={26} halo={false} />
      <Arrow p={at(O15, ey, -L0 * 0.8)} q={at(O15, ey, Ly)} color={c} w={5} head={26} halo={false} />
      {ticks ? [1, 2, 3, 4, 5].map((i) => { const p = at(O15, ex, i * U15), q = at(O15, ey, i * U15), nx = rotS(ex, 90), ny = rotS(ey, 90);
        return <g key={i}><line x1={p[0] - nx[0] * 10} y1={p[1] - nx[1] * 10} x2={p[0] + nx[0] * 10} y2={p[1] + nx[1] * 10} stroke={c} strokeWidth={3} />
          {i <= 4 ? <line x1={q[0] - ny[0] * 10} y1={q[1] - ny[1] * 10} x2={q[0] + ny[0] * 10} y2={q[1] + ny[1] * 10} stroke={c} strokeWidth={3} /> : null}</g>; }) : null}
      {label ? <Lbl x={at(O15, ex, L1 + 30)[0]} y={at(O15, ex, L1 + 30)[1]} t={label[0]} c={c} s={T.key} /> : null}
      {label ? <Lbl x={at(O15, ey, Ly + 30)[0]} y={at(O15, ey, Ly + 30)[1]} t={label[1]} c={c} s={T.key} a="middle" /> : null}
    </g>
  );
};
const ARR34 = P15(3, 4);

// ================================================================ s15 turn the axes; x̂′
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_turn_axes");
  const tWhy = SS(k, 4), tCoast = AT(k, 5, "coastline, a runway or a valley"), tSame = SS(k, 6), tRul = AT(k, 7, "rulers"), tAl = SS(k, 8), tXp = SS(k, 9), tPrime = SS(k, 10),
    tCS = AT(k, 11, "cosine alpha, sine alpha"), t30 = SS(k, 12), tCos = SS(k, 13), tNum = SS(k, 14);
  const a = A30 * prog(f, tRul, tRul + 45);
  const ex = rotS([1, 0], A30);
  const XPt = at(O15, ex, 2 * U15), X3 = at(O15, ex, 3 * U15), nx: Pt = rotS(ex, 90);
  const coast = win(f, tCoast, tAl - 20, 12);
  return (
    <Scene>
      <Svg>
        <Rulers a={0} o={0.35} ticks={false} label={["x", "y"]} />
        <Rulers a={a} o={fin(f, tRul - 30)} label={a > 1 ? ["x′", "y′"] : undefined} />
        <Arrow p={O15} q={ARR34} color={C.first} w={10 + 4 * pulse(f, tSame, 30)} />
        <Lbl x={ARR34[0] + 26} y={ARR34[1] - 20} t="(3, 4)" c={C.key} s={T.key} />
        <path d={arcD(O15, 110, 0, a)} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tAl)} />
        <ArcHead c={O15} r={110} a={a} dir={1} col={C.gold} o={fin(f, tAl)} />
        <Lbl x={O15[0] + 165 * Math.cos(15 * D2R)} y={O15[1] - 165 * Math.sin(15 * D2R)} t="α" c={C.gold} s={T.calc} a="middle" o={fin(f, tAl)} />
        <g opacity={fin(f, tXp)}>
          <Arrow p={O15} q={XPt} color={C.second} w={10} head={36} />
          <Dash p={O15} q={[XPt[0], O15[1]]} c={C.second} w={5} o={fin(f, tCS)} />
          <Dash p={[XPt[0], O15[1]]} q={XPt} c={C.second} w={5} o={fin(f, tCS)} />
        </g>
        <g opacity={coast}>
          <path d="M 1100 420 C 1200 380, 1280 300, 1400 280 S 1600 200, 1760 170" fill="none" stroke={C.key} strokeWidth={5} />
          <path d="M 1100 420 L 1100 470 L 1760 470 L 1760 170" fill={C.first} fillOpacity={0.12} stroke="none" />
          <Arrow p={[1360, 330]} q={[1540, 255]} color={C.second} w={6} head={24} />
          <Arrow p={[1360, 330]} q={[1420, 430]} color={C.second} w={6} head={24} />
          <Lbl x={1560} y={300} t="along" c={C.second} s={T.floor} />
          <Lbl x={1440} y={450} t="across" c={C.second} s={T.floor} />
        </g>
        <Keyword f={f} text="turn the axes" at={[1080, 110]} appear={0} out={tSame - 18} />
        <SkipChip f={f} k={k} to={keepTime("s20_polar_is_turned")} />
        <Keyword f={f} text="same arrow, new rulers" at={[1080, 110]} appear={tSame} />
        <Lbl x={1080} y={540} t="anticlockwise, seen from above" c={C.key} s={T.floor} o={win(f, tAl, t30 - 18)} />
        <Keyword f={f} text="prime = new" at={[1080, 450]} s={T.floor} appear={tPrime} out={t30 - 18} />
        <Keyword f={f} text="why?" at={[1080, 220]} s={T.floor} appear={tWhy} out={tCoast - 18} />
      </Svg>
      <TeX s={XP} x={XPt[0] + ex[0] * 40 + nx[0] * 40} y={XPt[1] + ex[1] * 40 + nx[1] * 40} size={56} ax={0.5} c={C.second} o={fin(f, tXp + 10)} />
      {/* K6 after fix 1c: "cos α" starts right of the turned y′ ruler (it ran across it), "sin α" clears the α label */}
      <TeX s={f < tNum ? String.raw`\cos\alpha` : String.raw`\cos\alpha\approx0.866`} x={O15[0] + 48} y={O15[1] + 46} size={48} c={C.second} o={fin(f, tCS)} />
      <TeX s={f < tNum ? String.raw`\sin\alpha` : String.raw`\sin\alpha=0.5`} x={XPt[0] + 56} y={(O15[1] + XPt[1]) / 2 + 4} size={48} c={C.second} o={fin(f, tCS)} />
      <TeX s={EQ_S15} x={1080} y={652} size={68} o={fin(f, tCS)} />
      <CalcStack f={f} x={1260} y={230} size={50} maxLines={2} rows={[   /* K6 k6f2: ends above x̂′ = (cos α, sin α) */
        { lhs: String.raw`\cos30^\circ`, rhs: String.raw`=\dfrac{\sqrt3}{2}`, at: tCos, h: 132 },
        { rhs: String.raw`=\dfrac{1.732}{2}\approx0.866`, at: AT(k, 13, "one point seven three two"), cont: true, h: 128 },
        { lhs: String.raw`\sin30^\circ`, rhs: String.raw`=\dfrac12=0.5`, at: AT(k, 13, "exactly one half"), h: 110 },
      ]} />
      <TeX s={String.raw`\hat{\mathbf x}'=(0.866,\ 0.5)`} x={1120} y={750} size={60} o={fin(f, tNum)} />
    </Scene>
  );
};

// ================================================================ s16 ŷ′ by the 90° rule (D05)
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16_y_prime");
  const tRl = AT(k, 2, "the rule for that");
  const tMust = SS(k, 1), tRule = AT(k, 2, "turned by ninety degrees"), tSw = AT(k, 2, "swap the two numbers"), tRes = SS(k, 3), tNum = SS(k, 4), tLen = SS(k, 6), tDot = SS(k, 7), tRA = SS(k, 8);
  const ex = rotS([1, 0], A30);
  const turn = 90 * prog(f, tRule, tRule + 45);
  const tipX = at(O15, ex, 2 * U15);
  const R = (p: Pt) => rotP(p, O15, turn);
  const foot: Pt = [tipX[0], O15[1]];
  const ey = rotS(ex, 90);
  return (
    <Scene>
      <Svg>
        {/* K6 after fix 1c: the rulers are a faint background (0.45) under the turned triangle's leg labels */}
        <Rulers a={A30} o={0.45} label={["x′", "y′"]} />
        <Arrow p={O15} q={tipX} color={C.second} />
        <g opacity={fin(f, tRule - 10)}>
          <line x1={R(O15)[0]} y1={R(O15)[1]} x2={R(foot)[0]} y2={R(foot)[1]} stroke={C.second} strokeWidth={6} />
          <line x1={R(foot)[0]} y1={R(foot)[1]} x2={R(tipX)[0]} y2={R(tipX)[1]} stroke={C.second} strokeWidth={6} strokeDasharray="12 8" />
          {turn > 1 ? <Arrow p={O15} q={R(tipX)} color={C.second} /> : null}
          {turn > 0 && turn < 90 ? <path d={arcD(O15, 120, A30, A30 + turn)} fill="none" stroke={C.gold} strokeWidth={5} /> : null}
        </g>
        <RightTick at={O15} u1={ex} u2={ey} c={C.gold} o={fin(f, tLen)} />
        <Keyword f={f} text="the new y axis" at={[1080, 110]} appear={0} out={tRl - 18} />
        <Lbl x={1080} y={830} t="at right angles, like the old axes" c={C.key} s={T.floor} o={fin(f, tRA)} />
        <Lbl x={1080} y={220} t="⟂ to the new x axis, anticlockwise" c={C.key} s={T.floor} o={fin(f, tMust) * fout(f, tRl - 18)} />
        {/* fix 1c C22: the turned triangle's legs named */}
        {/* K6 after fix 1c: both leg labels moved off the turned arrow / y′ ruler: "cos α (north)" right of its leg near the top
            (above the x̂′ arrow), "sin α (west)" above its leg from the leg's west end */}
        <g opacity={fin(f, tRule + 45)}>
          <Lbl x={O15[0] + 12} y={R(foot)[1] - 33} t="cos α" c={C.second} s={T.floor} />
          <Lbl x={O15[0] + 12} y={R(foot)[1] + 15} t="(north)" c={C.second} s={T.floor} />
          <Lbl x={R(tipX)[0] + 2} y={R(foot)[1] - 87} t="sin α (west)" c={C.second} s={T.floor} />
        </g>
      </Svg>
      <TeX s={XP} x={tipX[0] + ex[0] * 40 - ey[0] * 52} y={tipX[1] + ex[1] * 40 - ey[1] * 52} size={56} ax={0.5} c={C.second} />
      <TeX s={YP} x={at(O15, ey, 2 * U15)[0] - ex[0] * 48} y={at(O15, ey, 2 * U15)[1] - ex[1] * 48} size={56} ax={0.5} c={C.second} o={fin(f, tRule + 45)} />
      <TeX s={String.raw`(p,\ q)\to(-q,\ p)`} x={1080} y={110} size={52} o={win(f, tRl, tRes - 20)} />
      <TeX s={String.raw`p=\cos\alpha,\ \ q=\sin\alpha`} x={1080} y={180} size={52} o={win(f, tSw, tRes - 20)} />
      <TeX s={String.raw`(\cos\alpha,\ \sin\alpha)\ \to\ (-\sin\alpha,\ \cos\alpha)`} x={1070} y={110} size={52} o={fin(f, tRes)} />
      <TeX s={EQ_S16} x={1080} y={230} size={72} c={C.second} o={fin(f, tRes)} />
      {/* fix 1c C23: substitution, squares, products */}
      <CalcStack f={f} x={1240} y={340} size={50} maxLines={2} rows={[
        { lhs: String.raw`\hat{\mathbf y}'`, rhs: String.raw`=(-\sin30^\circ,\ \cos30^\circ)`, at: tNum },
        { rhs: String.raw`=(-0.5,\ 0.866)`, at: AT(k, 4, "minus zero point five"), cont: true },
        { lhs: String.raw`|\hat{\mathbf y}'|`, rhs: String.raw`=\sqrt{(-0.5)^2+0.866^2}`, at: tLen },
        { rhs: String.raw`=\sqrt{0.25+0.75}=1`, at: AT(k, 6, "zero point two five"), cont: true },
        { rhs: String.raw`(0.866^2\approx0.75,\ \text{exactly }\dfrac34)`, at: AT(k, 6, "zero point two five") + 40, cont: true, c: C.muted, h: 110 },
        { lhs: String.raw`\hat{\mathbf x}'\cdot\hat{\mathbf y}'`, rhs: String.raw`=0.866\times(-0.5)`, at: tDot },
        { rhs: String.raw`\quad+0.5\times0.866`, at: AT(k, 7, "plus zero point five times"), cont: true },
        { rhs: String.raw`=-0.433+0.433=0`, at: AT(k, 7, "minus zero point four three three"), cont: true },
      ]} />
    </Scene>
  );
};

// ================================================================ s17 x′, y′ as shadows on the new rulers (D06)
const S17L = ["(x′, y′)", "= (4.6, 1.96)"];
S17L.forEach((t) => { if (ARR34[0] + 24 + textW(t, T.floor) > 1000) throw new Error(`s17 label "${t}" leaves the picture zone`); });
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_new_components");
  const tQ = SS(k, 2), tSh = SS(k, 3), tX = AT(k, 4, "x times cosine"), tY = SS(k, 5), tIn = SS(k, 6), tX1 = SS(k, 7), tX46 = AT(k, 8, "about four point six"), tY1 = SS(k, 9),
    tY196 = AT(k, 10, "one point nine six"), tAt = SS(k, 11), tSame = SS(k, 12), tL1 = SS(k, 13), tL5 = SS(k, 14), tNew = SS(k, 15);
  const ex = rotS([1, 0], A30), ey = rotS(ex, 90);
  const xp = PL.xp30[0], yp = PL.xp30[1];
  const fx = at(O15, ex, xp * U15), fy = at(O15, ey, yp * U15);
  const [e1, e2] = cutAt(EQ_S17, String.raw`,\qquad `);
  const [x1L, x1R] = cutAt(e1, "="), [y1L, y1R] = cutAt(e2, "=");
  const gen = fout(f, tIn - 22, 12);
  return (
    <Scene>
      <Svg>
        <Rulers a={A30} label={["x′", "y′"]} />
        <Band p={O15} q={fx} color={C.first} o={fin(f, tSh + 20)} w={22} />
        <Band p={O15} q={fy} color={C.first} o={fin(f, tY)} w={22} />
        <Dash p={ARR34} q={fx} c={C.key} w={4} o={fin(f, tSh)} />
        <Dash p={ARR34} q={fy} c={C.key} w={4} o={fin(f, tY)} />
        <Arrow p={O15} q={ARR34} color={C.first} w={10 + 4 * pulse(f, tL1, 30)} />
        {/* fix 1 Must 4: the turned-axes coordinates on two lines, inside the picture zone (x ≤ 1000, asserted) */}
        <Lbl x={ARR34[0] + 24} y={ARR34[1] - 26} t="(3, 4)" c={C.key} s={T.key} o={f < tAt - 10 ? 1 : 0} />
        <Lbl x={ARR34[0] + 24} y={ARR34[1] - 82} t={S17L[0]} c={C.key} s={T.floor} o={f < tAt ? 0 : fin(f, tAt)} />
        <Lbl x={ARR34[0] + 24} y={ARR34[1] - 26} t={S17L[1]} c={C.key} s={T.floor} o={f < tAt ? 0 : fin(f, tAt)} />
        <Lbl x={fx[0] + 20} y={fx[1] + 44} t="x′ = 4.6" c={C.first} s={T.floor} o={fin(f, tX46)} />
        <Lbl x={fy[0] - 26} y={fy[1] - 10} t="y′ = 1.96" c={C.first} s={T.floor} a="end" o={fin(f, tY196)} />
        <Keyword f={f} text="new coordinates x′, y′" at={[1080, 110]} appear={0} out={tQ - 18} />
        <Keyword f={f} text="shadow on the new x axis" at={[1080, 820]} s={T.floor} appear={tSh} out={tY - 18} />
        <Keyword f={f} text="shadows on the new axes" at={[1080, 820]} s={T.floor} appear={tY} out={tNew - 18} />
        <Keyword f={f} text="same arrow, new numbers" at={[1080, 820]} appear={tNew} />
      </Svg>
      <TeX s={String.raw`x'=\text{part along }\hat{\mathbf x}'`} x={1080} y={110} size={54} o={fin(f, tQ)} />
      <CalcStack f={f} x={1160} y={200} size={52} maxLines={4} o={gen} rows={[
        { lhs: x1L, rhs: String.raw`=(x,\ y)\cdot(\cos\alpha,\ \sin\alpha)`, at: AT(k, 3, "dot product") },
        { rhs: `=${x1R}`, at: tX, cont: true },
        { lhs: y1L, rhs: String.raw`=(x,\ y)\cdot(-\sin\alpha,\ \cos\alpha)`, at: tY },
        { rhs: `=${y1R}`, at: AT(k, 5, "minus x sine"), cont: true },
      ]} />
      <TeX s={String.raw`x=3,\ \ y=4,\ \ \alpha=30^\circ`} x={1080} y={200} size={52} c={C.local} o={fin(f, tIn)} />
      <CalcStack f={f} x={1160} y={280} size={52} maxLines={2} rows={[
        { lhs: "x'", rhs: String.raw`=3\times0.866+4\times0.5`, at: tX1 },
        { rhs: String.raw`=2.60+2\approx4.60`, at: tX46, cont: true },
        { lhs: "y'", rhs: String.raw`=-3\times0.5+4\times0.866`, at: tY1 },
        { rhs: String.raw`=-1.5+3.46\approx1.96`, at: tY196, cont: true },
        { lhs: String.raw`\text{length}`, rhs: String.raw`=\sqrt{4.6^2+1.96^2}`, at: tL1 },
        { rhs: String.raw`=\sqrt{21.16+3.84}`, at: AT(k, 14, "twenty one point one six"), cont: true },
        { rhs: String.raw`\approx\sqrt{25}=5\ \mathrm{km}`, at: AT(k, 14, "square root is five"), cont: true },
      ]} />
    </Scene>
  );
};

// ================================================================ s18 the rotation matrix (D07)
const ALIGNED = String.raw`\begin{aligned}x'&=\ \ \cos\alpha\,x+\sin\alpha\,y\\ y'&=-\sin\alpha\,x+\cos\alpha\,y\end{aligned}`;
const goldIn = (s: string, parts: string[]) => parts.reduce((t, p) => { if (!t.includes(p)) throw new Error(`gold: ${p}`); return t.split(p).join(String.raw`\textcolor{#d8b23a}{${p}}`); }, s);
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_matrix");
  const tWrite = SS(k, 1), tFour = SS(k, 2), tRows = SS(k, 3), tMat = AT(k, 4, "rotation matrix"), tUse = SS(k, 5), tTop = AT(k, 7, "The top row"), tBot = AT(k, 7, "the bottom row"),
    tNum = SS(k, 8), tMean = SS(k, 9), tDC = SS(k, 12), tEx = AT(k, 13, "For example");
  const ex = rotS([1, 0], A30), ey = rotS(ex, 90);
  const O: Pt = [380, 520], L = 260;
  const gRow = (row: string, a: string, b: string) => { if (!EQ_S18.includes(row)) throw new Error(`s18 row ${row}`);
    return EQ_S18.replace(row, String.raw`\textcolor{#d8b23a}{${a}} & \textcolor{#d8b23a}{${b}}`); };
  const top = gRow(String.raw`\cos\alpha & \sin\alpha`, String.raw`\cos\alpha`, String.raw`\sin\alpha`);
  const bot = gRow(String.raw`-\sin\alpha & \cos\alpha`, String.raw`-\sin\alpha`, String.raw`\cos\alpha`);
  const tl = EQ_S18.replace(String.raw`\cos\alpha & \sin\alpha`, String.raw`\textcolor{#d8b23a}{\cos\alpha} & \sin\alpha`);
  const coef = goldIn(ALIGNED, [String.raw`\ \ \cos\alpha`, String.raw`+\sin\alpha`, String.raw`-\sin\alpha`, String.raw`+\cos\alpha`]);
  const ph = f < tTop ? 0 : f < tBot ? 1 : f < tNum ? 2 : f < tEx ? 3 : 4;
  return (
    <Scene>
      <Svg>
        <Arrow p={O} q={at(O, [1, 0], L)} color={C.second} o={0.5} />
        <Arrow p={O} q={at(O, [0, -1], L)} color={C.second} o={0.5} />
        <Arrow p={O} q={at(O, ex, L)} color={C.second} />
        <Arrow p={O} q={at(O, ey, L)} color={C.second} />
        <path d={`M ${O[0]} ${O[1]} L ${at(O, [1, 0], 150)[0]} ${O[1]} A 150 150 0 0 0 ${at(O, ex, 150)[0]} ${at(O, ex, 150)[1]} Z`} fill={C.gold} fillOpacity={0.35} opacity={fin(f, tEx)} />
        <path d={arcD(O, 150, 0, A30)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tEx)} />
        <Lbl x={O[0] + 180} y={O[1] - 40} t="α" c={C.gold} s={T.calc} o={fin(f, tEx)} />
        <Keyword f={f} text="line them up" at={[1080, 110]} appear={0} out={tWrite - 18} />
        <Keyword f={f} text="rotation matrix" at={[1080, 610]} appear={tMat} out={tNum - 18} />
        <Keyword f={f} text="direction cosines" at={[1080, 610]} appear={tDC} />
        <Lbl x={1080} y={690} t="row × column, then add" c={C.key} s={T.floor} o={win(f, tUse, tTop - 20)} />
        {/* fix 1c C27: the other two angles, each on its words */}
        <g opacity={fin(f, AT(k, 13, "ninety degrees minus"))}>
          <path d={arcD(O, 200, A30, 90)} fill="none" stroke={C.gold} strokeWidth={4} />
          <Lbl x={O[0] + 235 * Math.cos(60 * D2R)} y={O[1] - 235 * Math.sin(60 * D2R)} t="90° − α" c={C.gold} s={T.floor} />
        </g>
        <g opacity={fin(f, AT(k, 13, "ninety degrees plus"))}>
          <path d={arcD(O, 100, 0, 90 + A30)} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="10 7" />
          {/* K6 after fix 1c: beside the arc's end, left of the ŷ′ arrow (it sat across the arrow) */}
          <Lbl x={O[0] - 50} y={O[1] - 50} t="90° + α" c={C.gold} s={T.floor} a="end" />
        </g>
      </Svg>
      <TeX s={String.raw`\hat{\mathbf x}`} x={O[0] + L + 40} y={O[1]} size={52} c={C.second} o={0.7} />
      <TeX s={String.raw`\hat{\mathbf y}`} x={O[0] - 20} y={O[1] - L - 40} size={52} ax={0.5} c={C.second} o={0.7} />
      <Tip p={O} v={ex} L={L} s={XP} d={50} />
      <Tip p={O} v={ey} L={L} s={YP} d={50} />
      <TeX s={ALIGNED} x={1100} y={220} size={60} o={f < tFour ? fin(f, tWrite) : 0} />
      <TeX s={coef} x={1100} y={220} size={60} o={f < tFour ? 0 : 1} />
      {/* fix 2 (review 2 Should 5): the symbolic matrix 30 px higher, the number matrix 45 px under it with its label "α = 30°:" */}
      <TeX s={EQ_S18} x={1080} y={420} size={56} o={fin(f, tRows) * (ph === 1 || ph === 2 || ph === 4 ? 0 : 1)} />
      <TeX s={top} x={1080} y={420} size={56} o={ph === 1 ? 1 : 0} />
      <TeX s={bot} x={1080} y={420} size={56} o={ph === 2 ? 1 : 0} />
      <TeX s={tl} x={1080} y={420} size={56} o={ph === 4 ? 1 : 0} />
      {/* fix 1c C25: each row multiplied out in symbols, on its words */}
      {/* K6 after fix 1c: 44 px (was 48) so the bottom row ends before x 1842 (it reached 1886) */}
      <TeX s={String.raw`\text{top row: }\cos\alpha\cdot x+\sin\alpha\cdot y=x'`} x={1080} y={700} size={44} o={win(f, tTop, tNum - 18)} />
      <TeX s={String.raw`\text{bottom row: }-\sin\alpha\cdot x+\cos\alpha\cdot y=y'`} x={1080} y={770} size={44} o={win(f, tBot, tNum - 18)} />
      {/* fix 1c C26: both rows with numbers and products. K6 after fix 1c: the matrix moves up under EQ_S18 and each row becomes
          two lines aligned at "=" (they ran to x 1885), the products on "gives", the results on their spoken values */}
      <TeX s={String.raw`\alpha=30^\circ:`} x={1080} y={572} size={44} c={C.local} o={win(f, tNum, tMean - 10)} />
      <TeX s={String.raw`\begin{pmatrix}0.866 & 0.5\\ -0.5 & 0.866\end{pmatrix}\begin{pmatrix}3\\ 4\end{pmatrix}`} x={1272} y={572} size={44} o={win(f, tNum, tMean - 10)} />
      <CalcStack f={f} x={1150} y={642} size={46} maxLines={2} o={fout(f, tMean - 10)} rows={[
        { lhs: "x'", rhs: String.raw`=0.866\times3+0.5\times4`, at: tNum + 20, h: 52 },
        { rhs: String.raw`=2.598+2\approx4.60`, at: AT(k, 8, "four point six again"), cont: true, h: 52 },
        { lhs: "y'", rhs: String.raw`=-0.5\times3+0.866\times4`, at: AT(k, 8, "the bottom row gives"), h: 52 },
        { rhs: String.raw`=-1.5+3.464\approx1.96`, at: AT(k, 8, "one point nine six"), cont: true, h: 52 },
      ]} />
      {/* fix 1c C27: why every entry is a cosine */}
      <CalcStack f={f} x={1330} y={672} size={44} maxLines={2} rows={[
        { lhs: String.raw`\hat{\mathbf a}\cdot\hat{\mathbf b}`, rhs: String.raw`=|\hat{\mathbf a}|\,|\hat{\mathbf b}|\cos\gamma`, at: AT(k, 10, "As in the dot product") },
        { rhs: String.raw`=1\times1\times\cos\gamma=\cos\gamma`, at: AT(k, 10, "both lengths are one"), cont: true },
        { lhs: String.raw`\hat{\mathbf x}'\cdot\hat{\mathbf x}`, rhs: String.raw`=\cos\alpha`, at: tEx },
        { lhs: String.raw`\hat{\mathbf x}'\cdot\hat{\mathbf y}`, rhs: String.raw`=\cos(90^\circ-\alpha)=\sin\alpha`, at: AT(k, 13, "ninety degrees minus") },
        { lhs: String.raw`\hat{\mathbf y}'\cdot\hat{\mathbf x}`, rhs: String.raw`=\cos(90^\circ+\alpha)=-\sin\alpha`, at: AT(k, 13, "ninety degrees plus") },
        { lhs: String.raw`\hat{\mathbf y}'\cdot\hat{\mathbf y}`, rhs: String.raw`=\cos\alpha`, at: AT(k, 13, "ninety degrees plus") + 75 },
        { lhs: String.raw`\alpha=30^\circ:`, rhs: String.raw`\ \cos60^\circ=0.5,`, at: AT(k, 13, "ninety degrees plus") + 150 },
        { rhs: String.raw`\ \cos120^\circ=-0.5`, at: AT(k, 13, "ninety degrees plus") + 170, cont: true },
      ]} />
    </Scene>
  );
};

// ================================================================ s19 the index form (D08)
const S19: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19_index_form");
  const tNames = SS(k, 3), tE = AT(k, 4, "become e sub one"), tC = SS(k, 6), t11 = SS(k, 8), t12 = SS(k, 9), t21 = SS(k, 10), t22 = SS(k, 11), tRule = SS(k, 12), tRep = SS(k, 13),
    tJ1 = SS(k, 14), tJ1b = SS(k, 15), tJ2 = SS(k, 16), tJ2b = SS(k, 17), tSame = SS(k, 18), tFlip = SS(k, 19), tRd = SS(k, 20), tTen = SS(k, 21);
  const ex = rotS([1, 0], A30), ey = rotS(ex, 90);
  const O: Pt = [380, 520], L = 260;
  const [rule, cdef] = cutAt(EQ_S19, String.raw`,\qquad `);
  const cell = f < t12 ? 0 : f < t21 ? 1 : f < t22 ? 2 : 3;
  const inCells = win(f, t11, tRule - 18, 10);
  // the four arrows: which pair is in the current dot product
  const pair: [number, number] | null = f >= t11 && f < tRule ? [[0, 0], [0, 1], [1, 0], [1, 1]][cell] as [number, number] : null;
  const oOld = (i: number) => (pair ? (pair[0] === i ? 1 : 0.3) : 0.8), oNew = (j: number) => (pair ? (pair[1] === j ? 1 : 0.3) : 1);
  const lbl = fin(f, tE);
  // grid x 1180-1780, y 390-650; cells (i row, j col)
  const GX = 1180, GY = 410, CW = 300, CH = 120;   // fix 1c: 20 px shorter, room for the j rows below
  const flip = prog(f, tFlip + 20, tFlip + 50);
  const vals = [[String.raw`\cos\alpha`, String.raw`-\sin\alpha`], [String.raw`\sin\alpha`, String.raw`\cos\alpha`]];
  const cellAt = (i: number, j: number): Pt => { const a: Pt = [GX + j * CW + CW / 2, GY + i * CH + CH / 2], b: Pt = [GX + i * CW + CW / 2, GY + j * CH + CH / 2]; return [mix(a[0], b[0], flip), mix(a[1], b[1], flip)]; };
  const cellO = (i: number, j: number) => fin(f, [t11, t12, t21, t22][i * 2 + j] + 20);
  const colHi = (j: number) => (j === 0 ? win(f, tJ1, tJ2 - 12) : win(f, tJ2, tSame - 12));
  const dots = [
    [String.raw`C_{11}=\hat{\mathbf x}\cdot\hat{\mathbf x}'=(1,0)\cdot(\cos\alpha,\sin\alpha)`, String.raw`=1\cdot\cos\alpha+0\cdot\sin\alpha=\cos\alpha`],
    [String.raw`C_{12}=\hat{\mathbf x}\cdot\hat{\mathbf y}'=(1,0)\cdot(-\sin\alpha,\cos\alpha)`, String.raw`=1\cdot(-\sin\alpha)+0\cdot\cos\alpha=-\sin\alpha`],
    [String.raw`C_{21}=\hat{\mathbf y}\cdot\hat{\mathbf x}'=(0,1)\cdot(\cos\alpha,\sin\alpha)`, String.raw`=0\cdot\cos\alpha+1\cdot\sin\alpha=\sin\alpha`],
    [String.raw`C_{22}=\hat{\mathbf y}\cdot\hat{\mathbf y}'=(0,1)\cdot(-\sin\alpha,\cos\alpha)`, String.raw`=0\cdot(-\sin\alpha)+1\cdot\cos\alpha=\cos\alpha`],
  ];
  const cellStart = [t11, t12, t21, t22];
  return (
    <Scene>
      <Svg>
        <Arrow p={O} q={at(O, [1, 0], L)} color={C.second} o={oOld(0) * 0.8} />
        <Arrow p={O} q={at(O, [0, -1], L)} color={C.second} o={oOld(1) * 0.8} />
        <Arrow p={O} q={at(O, ex, L)} color={C.second} o={oNew(0)} />
        <Arrow p={O} q={at(O, ey, L)} color={C.second} o={oNew(1)} />
        <g opacity={fin(f, tC + 30)}>
          {[0, 1, 2].map((i) => <line key={`r${i}`} x1={GX} y1={GY + i * CH} x2={GX + 2 * CW} y2={GY + i * CH} stroke={C.local} strokeWidth={2} opacity={0.6} />)}
          {[0, 1, 2].map((j) => <line key={`c${j}`} x1={GX + j * CW} y1={GY} x2={GX + j * CW} y2={GY + 2 * CH} stroke={C.local} strokeWidth={2} opacity={0.6} />)}
          {[0, 1].map((j) => <rect key={j} x={GX + j * CW + 4} y={GY + 4} width={CW - 8} height={2 * CH - 8} fill={C.gold} opacity={0.18 * colHi(j)} />)}
        </g>
        <Keyword f={f} text="index notation" at={[1080, 110]} appear={0} out={tNames - 18} />
        <Lbl x={1080} y={318} t="i: old arrow · j: new arrow" c={C.gold} s={T.floor} o={win(f, tC + 20, tRule - 18)} />

        <Keyword f={f} text="same two lines" at={[1080, 730]} appear={tSame} out={tFlip - 18} />
        <Keyword f={f} text="flipped over its diagonal" at={[1080, 730]} appear={tFlip} out={tTen - 18} />
        <Lbl x={1080} y={790} t="same four numbers," c={C.key} s={T.floor} o={win(f, tRd, tTen - 18)} /><Lbl x={1080} y={840} t="read down the columns" c={C.key} s={T.floor} o={win(f, tRd, tTen - 18)} />
        <Keyword f={f} text="more: Tensors made easy" at={[1080, 730]} appear={tTen} />
      </Svg>
      <TeX s={f < tE ? String.raw`\hat{\mathbf x}` : String.raw`\mathbf e_1`} x={O[0] + L + 40} y={O[1]} size={52} c={C.second} o={oOld(0) * (f < tE - 10 ? 1 : lbl)} />
      <TeX s={f < tE ? String.raw`\hat{\mathbf y}` : String.raw`\mathbf e_2`} x={O[0] - 20} y={O[1] - L - 40} size={52} ax={0.5} c={C.second} o={oOld(1) * (f < tE - 10 ? 1 : lbl)} />
      <Tip p={O} v={ex} L={L} s={f < tE ? XP : String.raw`\mathbf e'_1`} d={50} o={oNew(0) * (f < tE - 10 ? 1 : lbl)} />
      <Tip p={O} v={ey} L={L} s={f < tE ? YP : String.raw`\mathbf e'_2`} d={50} o={oNew(1) * (f < tE - 10 ? 1 : lbl)} />
      <TeX s={String.raw`x\to x_1,\ \ y\to x_2`} x={1080} y={110} size={52} o={win(f, tNames, tRule - 22)} />
      <TeX s={String.raw`\hat{\mathbf x}\to\mathbf e_1,\ \ \hat{\mathbf y}\to\mathbf e_2,\ \ \hat{\mathbf x}'\to\mathbf e'_1,\ \ \hat{\mathbf y}'\to\mathbf e'_2`} x={1070} y={180} size={46} o={win(f, tE, tRule - 22)} />
      <TeX s={cdef} x={1080} y={260} size={60} o={fin(f, tC)} />
      <TeX s={rule} x={1080} y={110} size={68} o={fin(f, tRule)} />
      {/* fix 1 Must 1: after the flip the rows are the new arrows e′1, e′2 and the columns the old e1, e2, so every cell still
          reads C_ij = e_i · e′_j (row e′2, column e1 = −sin α = C12); the old labels go before the cells move, the new ones come after */}
      <TeX s={String.raw`\mathbf e_1`} x={GX - 20} y={GY + CH / 2} size={48} ax={1} c={C.second} o={fin(f, tC + 30) * fout(f, tFlip + 8)} />
      <TeX s={String.raw`\mathbf e_2`} x={GX - 20} y={GY + 1.5 * CH} size={48} ax={1} c={C.second} o={fin(f, tC + 30) * fout(f, tFlip + 8)} />
      <TeX s={String.raw`\mathbf e'_1`} x={GX + CW / 2} y={GY - 30} size={48} ax={0.5} c={C.second} o={fin(f, tC + 30) * fout(f, tFlip + 8)} />
      <TeX s={String.raw`\mathbf e'_2`} x={GX + 1.5 * CW} y={GY - 30} size={48} ax={0.5} c={C.second} o={fin(f, tC + 30) * fout(f, tFlip + 8)} />
      <TeX s={String.raw`\mathbf e'_1`} x={GX - 20} y={GY + CH / 2} size={48} ax={1} c={C.second} o={fin(f, tFlip + 50)} />
      <TeX s={String.raw`\mathbf e'_2`} x={GX - 20} y={GY + 1.5 * CH} size={48} ax={1} c={C.second} o={fin(f, tFlip + 50)} />
      <TeX s={String.raw`\mathbf e_1`} x={GX + CW / 2} y={GY - 30} size={48} ax={0.5} c={C.second} o={fin(f, tFlip + 50)} />
      <TeX s={String.raw`\mathbf e_2`} x={GX + 1.5 * CW} y={GY - 30} size={48} ax={0.5} c={C.second} o={fin(f, tFlip + 50)} />
      {[0, 1].map((i) => [0, 1].map((j) => { const p = cellAt(i, j);
        return <TeX key={`${i}${j}`} s={vals[i][j]} x={p[0]} y={p[1]} size={56} ax={0.5} o={cellO(i, j)} />; }))}
      {dots.map((d, i) => <React.Fragment key={i}>
        <TeX s={d[0]} x={1080} y={730} size={46} o={inCells * win(f, cellStart[i], (cellStart[i + 1] ?? tRule) - 20, 10)} />
        <TeX s={d[1]} x={1130} y={805} size={46} o={inCells * win(f, cellStart[i] + (i === 0 ? 0 : 40), (cellStart[i + 1] ?? tRule) - 20, 10)} />
      </React.Fragment>)}
      <TeX s={String.raw`x'_j=x_i\,C_{ij}\ \text{means}\ x'_j=\sum_{i=1}^{2}x_i\,C_{ij}`} x={1080} y={755} size={50} o={win(f, tRep, tJ1 - 12)} />
      {/* fix 2 (review 2 Should 4): "x′₁ =" / "x′₂ =" stay pinned on the first line while the rows under it page (2 visible) */}
      <CalcStack f={f} x={1190} y={680} size={44} maxLines={1} o={fout(f, tJ2 - 16)} rows={[
        { lhs: String.raw`x'_1`, rhs: String.raw`=x_1C_{11}+x_2C_{21}`, at: tJ1, h: 58 },
      ]} />
      <CalcStack f={f} x={1190} y={738} size={44} maxLines={2} o={fout(f, tJ2 - 16)} rows={[
        { rhs: String.raw`=x_1\cos\alpha+x_2\sin\alpha`, at: AT(k, 14, "C two one") + 15, h: 58 },
        { rhs: String.raw`=x\cos\alpha+y\sin\alpha`, at: tJ1b, h: 58 },
        { rhs: String.raw`=3\times0.866+4\times0.5\approx4.60\ \checkmark`, at: AT(k, 15, "four point six"), h: 58 },
      ]} />
      <CalcStack f={f} x={1190} y={680} size={44} maxLines={1} o={fout(f, tSame - 16)} rows={[
        { lhs: String.raw`x'_2`, rhs: String.raw`=x_1C_{12}+x_2C_{22}`, at: tJ2, h: 58 },
      ]} />
      <CalcStack f={f} x={1190} y={738} size={44} maxLines={2} o={fout(f, tSame - 16)} rows={[
        { rhs: String.raw`=-x_1\sin\alpha+x_2\cos\alpha`, at: AT(k, 16, "C two two") + 15, h: 58 },
        { rhs: String.raw`=-x\sin\alpha+y\cos\alpha`, at: tJ2b, h: 58 },
        { rhs: String.raw`=-3\times0.5+4\times0.866\approx1.96\ \checkmark`, at: AT(k, 17, "one point nine six"), h: 58 },
      ]} />
    </Scene>
  );
};

// ================================================================ s20 polar parts = axes turned by θ (D09)
const MSW = 16;   // s20 wind: px per m/s (fix 1c C30)
const S20: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20_polar_is_turned");
  // fix 2 (review 2 Should 8): this scene's circle 70 px to the right, so the 150° pair stays >= 96 px from the frame edge
  const OC: Pt = [OC0[0] + 70, OC0[1]], BC = onC(OC, RC, TH);
  const tTurn = AT(k, 1, "turn the axes"), tX = SS(k, 2), tY = SS(k, 3), tSo = SS(k, 4), tMeans = SS(k, 5), tW = SS(k, 6), tWx = SS(k, 7), tWy = SS(k, 8), tSame = SS(k, 9),
    tPos = SS(k, 10), tPx = SS(k, 11), tPx2 = SS(k, 12), tPy = SS(k, 13), tPy2 = SS(k, 14), tAlong = SS(k, 15), tDiff = SS(k, 16), tOne = SS(k, 17), tChg = SS(k, 18);
  const al = TH * prog(f, tTurn, tTurn + 40);
  const ex = rotS([1, 0], al), ey = rotS(ex, 90);
  const slide = prog(f, tX, tX + 40);
  const xb = at(OC, ex, RC * slide);
  const three = fin(f, tOne);
  const [lhs20, rhs20] = cutAt(EQ_S20, String.raw`:\quad `);
  const others = [0, 150].map((d) => ({ p: onC(OC, RC, d), e: rotS([1, 0], d) }));
  return (
    <Scene>
      <Svg>
        <circle cx={OC[0]} cy={OC[1]} r={RC} fill="none" stroke={C.first} strokeWidth={3} opacity={0.5} />
        <line x1={at(OC, ex, -120)[0]} y1={at(OC, ex, -120)[1]} x2={at(OC, ex, RC + 260)[0]} y2={at(OC, ex, RC + 260)[1]} stroke={C.second} strokeWidth={3} opacity={0.6} />
        <line x1={at(OC, ey, -120)[0]} y1={at(OC, ey, -120)[1]} x2={at(OC, ey, 260)[0]} y2={at(OC, ey, 260)[1]} stroke={C.second} strokeWidth={3} opacity={0.6} />
        <Lbl x={at(OC, ex, RC + 290)[0]} y={at(OC, ex, RC + 290)[1]} t="x′" c={C.second} s={T.key} a="middle" />
        <Lbl x={at(OC, ey, 215)[0] + 30} y={at(OC, ey, 215)[1] + 40} t="y′" c={C.second} s={T.key} a="middle" />
        <path d={arcD(OC, 110, 0, al)} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tTurn)} />
        <Lbl x={OC[0] + 130} y={OC[1] + 20} t="α = θ" c={C.gold} s={T.floor} o={fin(f, tTurn + 30)} />
        <Station at={OC} s={0.7} />
        <Arrow p={BC} q={at(BC, ER, LU)} color={C.second} />
        <Arrow p={BC} q={at(BC, ET, LU)} color={C.second} />
        <Arrow p={OC} q={BC} color={C.ink} w={8} head={32} o={fin(f, tPos)} />
        <g opacity={fin(f, tX) * fout(f, tY + 50)}>
          <Arrow p={xb} q={at(xb, ex, LU)} color={C.gold} w={6} head={24} />
          <Arrow p={xb} q={at(xb, ey, LU)} color={C.gold} w={6} head={24} o={fin(f, tY)} />
        </g>
        <Check x={at(BC, ER, LU)[0] + 70} y={at(BC, ER, LU)[1] + 30} s={0.8} o={fin(f, tX + 40)} />
        <Check x={at(BC, ET, LU)[0] - 20} y={at(BC, ET, LU)[1] + 60} s={0.8} o={fin(f, tY + 20)} />
        <BDot p={BC} />
        {/* fix 1c C31: the same turned pair (α = 53°) at three points, muted; then the polar pair at each, bright */}
        <g opacity={three * 0.5}>
          {[...others.map((q) => q.p), BC].map((pt, i) => <g key={`t${i}`}><Arrow p={pt} q={at(pt, ER, 110)} color={C.muted} w={5} head={22} dash="10 7" />
            <Arrow p={pt} q={at(pt, ET, 110)} color={C.muted} w={5} head={22} dash="10 7" /></g>)}
        </g>
        <g opacity={fin(f, tChg)}>
          {others.map((q, i) => <g key={i}><Arrow p={q.p} q={at(q.p, q.e, 120)} color={C.second} w={6} head={24} /><Arrow p={q.p} q={at(q.p, rotS(q.e, 90), 120)} color={C.second} w={6} head={24} /></g>)}
        </g>
        <g opacity={three}>{others.map((q, i) => <circle key={i} cx={q.p[0]} cy={q.p[1]} r={9} fill={C.key} />)}</g>
        {/* fix 1c C30: the 10 m/s east wind at the balloon and its two shadows (u_r rose on r̂, u_θ teal on θ̂) */}
        <g opacity={win(f, tW, tPos - 18)}>
          <defs><pattern id="h20" width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1={0} y1={0} x2={0} y2={16} stroke={C.first} strokeWidth={6} /></pattern></defs>
          <Band p={BC} q={at(BC, ER, 6 * MSW * prog(f, AT(k, 7, "which is six") - 4, AT(k, 7, "which is six") + 14))} color={C.neg} o={fin(f, AT(k, 7, "which is six") - 4)} w={22} />
          {f >= AT(k, 8, "which is minus eight") - 4 ? <line x1={BC[0]} y1={BC[1]} x2={at(BC, ET, -8 * MSW)[0]} y2={at(BC, ET, -8 * MSW)[1]} stroke="url(#h20)" strokeWidth={22} /> : null}
          <AnimatedWindArrow from={BC} to={[BC[0] + 10 * MSW, BC[1]]} speed={10} f={f} c={C.ink} px={9} head={32} />
          <Dash p={[BC[0] + 10 * MSW, BC[1]]} q={at(BC, ER, 6 * MSW)} c={C.key} w={3} o={fin(f, tWx)} />
          <Dash p={[BC[0] + 10 * MSW, BC[1]]} q={at(BC, ET, -8 * MSW)} c={C.key} w={3} o={fin(f, tWy)} />
          <Lbl x={BC[0] + 10 * MSW + 20} y={BC[1] + 6} t="10 m/s" c={C.ink} s={T.floor} />
          <Lbl x={at(BC, ER, 6 * MSW)[0] + 26} y={at(BC, ER, 6 * MSW)[1] - 10} t="6" c={C.neg} s={T.floor} o={fin(f, AT(k, 7, "which is six"))} />
          <Lbl x={at(BC, ET, -8 * MSW)[0] + 18} y={at(BC, ET, -8 * MSW)[1] + 34} t="−8" c={C.first} s={T.floor} o={fin(f, AT(k, 8, "which is minus eight"))} />
        </g>
        <Lbl x={1080} y={320} t="polar parts =" c={C.key} s={T.floor} o={win(f, tMeans, tW - 20)} />
        <Lbl x={1080} y={372} t="turned-axes coordinates" c={C.key} s={T.floor} o={win(f, tMeans, tW - 20)} />
        <Lbl x={1080} y={720} t="turned axes: α = 53° everywhere" c={C.muted} s={T.floor} o={fin(f, tOne)} />
        <Lbl x={1080} y={800} t="polar: θ = 0°, 53°, 150°" c={C.key} s={T.floor} o={fin(f, tChg)} />
      </Svg>
      <Tip p={BC} v={ER} L={LU} s={RHAT} />
      <Tip p={BC} v={ET} L={LU} s={THAT} />
      <TeX s={String.raw`\alpha=\theta`} x={1080} y={110} size={60} c={C.gold} o={fout(f, tX - 18)} />
      <TeX s={`${lhs20}:\\quad ${rhs20}`} x={1080} y={110} size={56} o={fin(f, tX)} />
      <TeX s={String.raw`\hat{\mathbf x}'=(\cos\theta,\ \sin\theta)=\hat{\mathbf r}`} x={1080} y={200} size={50} o={fin(f, AT(k, 2, "which is r hat"))} />
      <TeX s={String.raw`\hat{\mathbf y}'=(-\sin\theta,\ \cos\theta)=\hat{\boldsymbol\theta}`} x={1080} y={260} size={50} o={fin(f, AT(k, 3, "which is theta hat")) * 1} />
      <TeX s={String.raw`\mathbf u=(10,\ 0),\ \ \cos\theta=0.6,\ \ \sin\theta=0.8`} x={1080} y={390} size={46} c={C.local} o={win(f, tW, tPos - 18)} />
      {/* K6 after fix 1c: each line split at its result (they ran to x 1880), aligned at "=", the result on "which is …" */}
      <CalcStack f={f} x={1130} y={440} size={50} maxLines={2} o={fout(f, tPos - 18)} rows={[
        { lhs: "x'", rhs: String.raw`=10\times0.6+0\times0.8`, at: tWx },
        { rhs: String.raw`=6+0=6`, at: AT(k, 7, "which is six"), cont: true },
        { lhs: "y'", rhs: String.raw`=-10\times0.8+0\times0.6`, at: tWy },
        { rhs: String.raw`=-8+0=-8`, at: AT(k, 8, "which is minus eight"), cont: true },
      ]} />
      <TeX s={String.raw`x'=u_r,\ \ y'=u_\theta`} x={1080} y={750} size={50} o={win(f, tSame, tPos - 18)} />
      <TeX s={String.raw`\text{the position }(3,\ 4)`} x={1080} y={390} size={46} c={C.local} o={win(f, tPos, tOne - 18)} />
      <CalcStack f={f} x={1160} y={440} size={50} maxLines={2} o={fout(f, tOne - 18)} rows={[
        { lhs: "x'", rhs: String.raw`=3\times0.6+4\times0.8`, at: tPx },
        { rhs: String.raw`=1.8+3.2=5`, at: tPx2, cont: true },
        { lhs: "y'", rhs: String.raw`=-3\times0.8+4\times0.6`, at: tPy },
        { rhs: String.raw`=-2.4+2.4=0`, at: tPy2, cont: true },
      ]} />
      <TeX s={String.raw`5\text{ along }\hat{\mathbf r},\ 0\text{ along }\hat{\boldsymbol\theta}`} x={1080} y={770} size={48} o={win(f, tAlong, tOne - 18)} />
    </Scene>
  );
};

export const SCENES_B: Record<string, React.FC> = {
  s08_r_hat: S08, s09_where_theta_grows: S09, s10_turn_90: S10, s11_theta_hat: S11, s12_arrows_depend: S12, s13_components: S13, s14_rebuild_general: S14,
  s15_turn_axes: S15, s16_y_prime: S16, s17_new_components: S17, s18_matrix: S18, s19_index_form: S19, s20_polar_is_turned: S20,
};
void [Band, Dash];
