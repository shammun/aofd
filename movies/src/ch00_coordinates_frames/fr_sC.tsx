// ch00_coordinates_frames scenes s20-s29: going north (Dk/Dt, Dj/Dt), going east tilts ĵ and k̂, the three rates added and
// checked, Newton's law and the product rule, the eastward part term by term, the metric terms, the force-free puck on a great
// circle, how big the metric term is next to Coriolis, the recap and the series end card. Numbers from data/fr.json only.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Bracket, Pt } from "../house/kit/draw";
import { GlobeFrame, SourceBelow } from "../house/kit/frame";
import { Notebook } from "../house/kit/icons";
import { CurvedLink } from "../house/kit/extras";
import { GlobeCam, llPath } from "./kit_fr/globe";
import {
  AT, Arrow, BREST, CalcStack, D, D2R, GB, Globe, H, K, KHULNA, Keyword, LEN, Lbl, SS, Scene, SideCallout, SkipChip, Svg, TeX, Tripod, VIOLET, XC, add, clamp, discOf, fin,
  fout, gdot, globeG, keepTime, ll, mix, pieces, poly, prog, sang, texW, textW, win, SliceV, TopV, ParcelDot, linesPath, mapP, boxAt, chipSpan,
  SE,
} from "./fr_lib";
import { AngleArc, GRID, GridBase, MiniTick, MiniTripod, SliceBase, TopViewBase, TRI, TurnPic, gridCell, logX, sliceArrows, topArrows } from "./fr_dia";
import { EQ_S03, EQ_S20, EQ_S21, EQ_S22, EQ_S23, EQ_S24, EQ_S25, EQ_S26, EQ_S27, cutAt } from "./fr_eq";

const PK = D.puck, MT = D.metric, IAN = D.ian, CO = D.coast;
const CHECK_C: [string, number, number, number][] = [
  ["u1", PK.u[PK.u.length - 1], 11.5, 0.03], ["v1", PK.v[PK.v.length - 1], 8.2, 0.01], ["u0", PK.u[0], 10, 1e-3], ["v0", PK.v[0], 10, 1e-3],
  ["sp", Math.hypot(PK.u[PK.u.length - 1], PK.v[PK.v.length - 1]), 14.1, 0.05], ["mx", MT.mx * 1e5, 1.6, 0.031], ["f", MT.f * 1e4, 1.03, 0.0015],
  ["fv", MT.fv * 1e3, 1.0, 0.032], ["ratio", MT.ratio, 66, 0.31], ["deg75.8", D.khulna.deg, 75.8, 0.05], ["brg", CO.brg, 329, 0.5], ["al", IAN.along, 9, 0.5], ["ac", -IAN.across, 32, 0.5],
];
CHECK_C.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
const SRC_G = "Image: NASA Blue Marble Next Generation · Natural Earth";
const PHI = BREST[0];

// ================================================================ s20 going north turns k̂ towards ĵ and ĵ towards −k̂ (meridian slice)
const LON_FACE = BREST[1] + 180;
const CAM_FACE: GlobeCam = { lat: 8, lon: BREST[1] - 75, dist: 3.4 };
const SV3: SliceV = { c: [380, 640], r: 470 };
const S20: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20_jk_north");
  const tCirc = SS(k, 1), tKr = SS(k, 2), tJt = SS(k, 3), tRate = SS(k, 4), tRules = SS(k, 5), tK = SS(k, 6), tJ = SS(k, 7), tWords = SS(k, 8), tChk = SS(k, 9);
  const flat = fin(f, tKr, 20);
  const phi = PHI + 15 * prog(f, tRules, tRules + 60);
  const A = sliceArrows(SV3, phi, 170);
  const eq = cutAt(EQ_S20, String.raw`,\qquad `);
  return (
    <Scene>
      <Globe cam={CAM_FACE} mesh={{ half: LON_FACE, slide: 1 }} o={1 - flat}
        over={(Gg) => <>{gdot(Gg, BREST[0], BREST[1], C.gold, 10)}<path d={llPath(Gg, Array.from({ length: 61 }, (_, i) => [-90 + 3 * i, BREST[1]] as [number, number]), 1.003)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tCirc)} /></>} />
      <GlobeFrame id="s20k" zoom={0} disc={discOf(CAM_FACE)} o={1 - flat} />
      <SourceBelow text={SRC_G} pic={GB} w={960} o={1 - flat} name="s20 src" />
      <Svg>
        <g opacity={flat}>
          <SliceBase V={SV3} axes={0.5} quarter />
          <line x1={SV3.c[0]} y1={SV3.c[1]} x2={A.p[0]} y2={A.p[1]} stroke={C.local} strokeWidth={3} strokeDasharray="8 8" />
          <Arrow p={A.p} q={A.K} color={C.first} w={10} head={38} />
          <Arrow p={A.p} q={A.J} color={C.second} w={10} head={38} />
          <Arrow p={A.K} q={add(A.K, A.Jdir, 70)} color={C.gold} w={6} head={24} o={fin(f, tK)} />
          <Arrow p={A.J} q={add(A.J, A.Kdir, -70)} color={C.gold} w={6} head={24} o={fin(f, tJ)} />
          <ParcelDot p={A.p} />
          <AngleArc c={SV3.c} r={110} a0={0} a1={phi} />
        </g>
      </Svg>
      <TeX s={H.k} x={A.K[0] + 20} y={A.K[1] - 20} size={54} c={C.first} o={flat} halo />
      <TeX s={H.j} x={A.J[0] - 20} y={A.J[1] - 26} size={54} c={C.second} ax={1} o={flat} halo />
      <TeX s={String.raw`\varphi`} x={SV3.c[0] + 120} y={SV3.c[1] - 50} size={50} c={C.gold} o={flat} />
      <TeX s="a" x={mix(SV3.c[0], A.p[0], 0.5) + 30} y={mix(SV3.c[1], A.p[1], 0.5) + 10} size={50} c={C.local} o={flat} />
      <Svg>
        <Keyword f={f} text="next: going north" at={[XC, 110]} appear={0} out={tKr - 20} />
        <Lbl x={XC} y={210} t="a circle round the centre, radius a" c={C.muted} s={T.floor} o={win(f, tCirc, tKr - 20)} />
        <Keyword f={f} text="up tips north · north tips down" at={[XC, 660]} s={T.floor} appear={tWords} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf k}\ \text{plays}\ \hat{\mathbf r},\quad \hat{\mathbf j}\ \text{plays}\ \hat{\boldsymbol\theta}`} x={XC} y={120} size={50} o={fin(f, tKr)} />
      <TeX s={String.raw`\dfrac{D\varphi}{Dt}=\dfrac{v}{a}`} x={XC} y={250} size={56} o={fin(f, tRate)} />
      <TeX s={eq[0]} x={XC} y={400} size={54} o={fin(f, tK)} />
      <TeX s={eq[1]} x={XC} y={530} size={54} o={fin(f, tJ)} />
      <TeX s={String.raw`\dfrac{111.2\ \text{km}}{6371\ \text{km}}\approx0.0175\ \text{rad}=1^\circ`} x={XC} y={790} size={46} o={fin(f, tChk)} />
      {void tJt}
    </Scene>
  );
};

// ================================================================ s21 going east also tilts ĵ and k̂ (top view + slice side by side)
const TVs: TopV = { c: [280, 420], r: 190 };
const SVs: SliceV = { c: [600, 640], r: 330 };
const S21: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21_jk_east");
  const tBuilt = SS(k, 1), tFix = SS(k, 2), tZ = SS(k, 3), tOnly = SS(k, 4), tPlays = SS(k, 5), tDR = SS(k, 6), tDk = SS(k, 7), tCanc = SS(k, 8), tDj = SS(k, 9), tTan = SS(k, 10), tWords = SS(k, 11);
  const lam = -20 + 18 * prog(f, tPlays, tPlays + 60);
  const T_ = topArrows(TVs, lam, 120), S_ = sliceArrows(SVs, PHI, 130);
  const eq = cutAt(EQ_S21, String.raw`,\qquad `);
  const dk = f < tCanc ? String.raw`\dfrac{D\hat{\mathbf k}}{Dt}=\cos\varphi\ \hat{\mathbf i}\,\dfrac{u}{a\cos\varphi}=\hat{\mathbf i}\,\dfrac{u}{a}`
    : String.raw`\dfrac{D\hat{\mathbf k}}{Dt}=\cancel{\cos\varphi}\ \hat{\mathbf i}\,\dfrac{u}{a\cancel{\cos\varphi}}=\hat{\mathbf i}\,\dfrac{u}{a}`;
  return (
    <Scene>
      <Svg>
        <TopViewBase V={TVs} axes={0.3} />
        <Arrow p={T_.p} q={T_.R} color={C.second} w={8} head={30} />
        <Arrow p={T_.p} q={T_.I} color={C.second} w={8} head={30} o={0.6} />
        <Arrow p={T_.R} q={add(T_.R, T_.Edir, 60)} color={C.gold} w={6} head={22} o={fin(f, tPlays)} />
        <ParcelDot p={T_.p} r={10} />
        <SliceBase V={SVs} axes={0} quarter />
        <Arrow p={S_.p} q={S_.K} color={C.first} w={8} head={30} />
        <Arrow p={S_.p} q={S_.J} color={C.second} w={8} head={30} />
        <Arrow p={SVs.c} q={[SVs.c[0], SVs.c[1] - 150]} color={C.second} w={7} head={26} />
        <Arrow p={SVs.c} q={[SVs.c[0] + 150, SVs.c[1]]} color={C.second} w={7} head={26} />
        <ParcelDot p={S_.p} r={10} />
        <Lbl x={SVs.c[0] + 24} y={SVs.c[1] - 200} t="never turns" c={C.local} s={T.floor} o={fin(f, tZ)} />
      </Svg>
      <TeX s={H.R} x={T_.R[0] + 14} y={T_.R[1] + 26} size={50} c={C.second} halo />
      <TeX s={H.i} x={T_.I[0] + 14} y={T_.I[1] - 10} size={50} c={C.second} o={0.7} halo />
      <TeX s={H.z} x={SVs.c[0] - 24} y={SVs.c[1] - 160} size={50} c={C.second} ax={1} />
      <TeX s={H.R} x={SVs.c[0] + 150} y={SVs.c[1] + 40} size={50} c={C.second} ax={0.5} />
      <TeX s={H.k} x={S_.K[0] + 16} y={S_.K[1] - 16} size={50} c={C.first} halo />
      <TeX s={H.j} x={S_.J[0] - 16} y={S_.J[1] - 24} size={50} c={C.second} ax={1} halo />
      <Svg>

        <Lbl x={XC + 360} y={490} t="sin / cos = tan" c={C.gold} s={T.floor} o={win(f, tTan, tWords - 20)} />
        <Keyword f={f} text="up leans east · north leans west" at={[XC, 830]} s={T.floor} appear={tWords} />
      </Svg>
      {/* Part 1 lessons C1: the hats set in KaTeX (the sans keyword drew the combining hat beside the letter) */}
      <TeX s={String.raw`\text{going east tilts }\hat{\mathbf j}\text{ and }\hat{\mathbf k}\text{ too}`} x={XC} y={110} size={48} c={C.key} o={win(f, 0, tBuilt - 20)} />
      <TeX s={String.raw`\text{only }\hat{\mathbf R}\text{ turns}`} x={XC} y={400} size={T.floor} c={C.key} o={win(f, tOnly, tDR - 20)} />
      <TeX s={String.raw`\hat{\mathbf k}=\cos\varphi\,\hat{\mathbf R}+\sin\varphi\,\hat{\mathbf z}`} x={XC} y={110} size={48} o={win(f, tBuilt, tDR - 20)} />
      <TeX s={String.raw`\hat{\mathbf j}=-\sin\varphi\,\hat{\mathbf R}+\cos\varphi\,\hat{\mathbf z}`} x={XC} y={180} size={48} o={win(f, tBuilt + 15, tDR - 20)} />
      <TeX s={String.raw`\varphi\ \text{fixed}`} x={XC} y={270} size={50} o={win(f, tFix, tDR - 20)} />
      <TeX s={String.raw`\hat{\mathbf z}\ \text{never turns}`} x={XC + 260} y={270} size={50} o={win(f, tZ, tDR - 20)} />
      <TeX s={String.raw`\dfrac{D\hat{\mathbf R}}{Dt}=\hat{\mathbf i}\,\dfrac{u}{a\cos\varphi}`} x={XC} y={110} size={52} o={fin(f, tDR)} />
      <TeX s={dk} x={XC} y={240} size={46} o={fin(f, tDk)} />
      <TeX s={String.raw`\dfrac{D\hat{\mathbf j}}{Dt}=-\sin\varphi\ \hat{\mathbf i}\,\dfrac{u}{a\cos\varphi}`} x={XC} y={380} size={46} o={win(f, tDj, tWords - 20)} />
      <TeX s={String.raw`=-\hat{\mathbf i}\,\dfrac{u}{a}\tan\varphi`} x={XC + 60} y={490} size={46} o={win(f, tTan, tWords - 20)} />
      <TeX s={eq[0]} x={XC} y={610} size={50} o={fin(f, tWords)} />
      <TeX s={eq[1]} x={XC} y={730} size={50} o={fin(f, tWords)} />
    </Scene>
  );
};

// ================================================================ s22 add the motions: the three rates, the check, the link to Ω × B
const gold = (s: string) => s.split(String.raw`\dfrac{u}{a\cos\varphi}`).join(String.raw`\textcolor{#d8b23a}{\dfrac{u}{a\cos\varphi}}`)
  .split(String.raw`\dfrac{u}{a}`).join(String.raw`\textcolor{#d8b23a}{\dfrac{u}{a}}`).split(String.raw`\dfrac{v}{a}`).join(String.raw`\textcolor{#d8b23a}{\dfrac{v}{a}}`);
const S22: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22_add_motions");
  const tSmall = SS(k, 1), tTD = SS(k, 2), tDi = SS(k, 3), tDj = SS(k, 4), tDk = SS(k, 5), tSR = SS(k, 6), tChk = SS(k, 8), tNo = SS(k, 9), tLen = SS(k, 11),
    tNew = SS(k, 12), tCous = SS(k, 13), tSame = SS(k, 14), tKeep = SS(k, 15);
  const L3 = cutAt(EQ_S22, String.raw`,\quad `);
  const L23 = cutAt(L3[1], String.raw`,\quad `);
  const lines = [L3[0], L23[0], L23[1]];
  const cellT: [number, number, string][] = [[0, 0, String.raw`\to-\hat{\mathbf R}`], [0, 1, String.raw`\text{none}`], [1, 0, String.raw`\to-\hat{\mathbf i}`], [1, 1, String.raw`\to-\hat{\mathbf k}`],
    [2, 0, String.raw`\to\hat{\mathbf i}`], [2, 1, String.raw`\to\hat{\mathbf j}`], [0, 2, String.raw`\text{none}`], [1, 2, String.raw`\text{none}`], [2, 2, String.raw`\text{none}`]];
  const tp: Pt = [200, 760];
  // Part 1 lessons B4: at the keep line the grid, the check tripod and Ω × B leave; the keep line gets its own picture (TurnPic)
  const gK = fout(f, tKeep - 12);
  return (
    <Scene>
      <Svg o={gK}>
        <GridBase />
        <MiniTripod at={tp} U={110} o={fin(f, tChk)} w={7} head={26} />
        <Arrow p={add(tp, TRI.i, 110)} q={add(add(tp, TRI.i, 110), TRI.k, 50)} color={C.gold} w={5} head={18} o={fin(f, tNo)} dash="8 6" />
        <MiniTick at={add(tp, TRI.i, 110)} a={[-TRI.i[0], -TRI.i[1]]} b={TRI.k} o={fin(f, tLen)} s={18} />
        <g opacity={fin(f, tCous)}>
          <ellipse cx={720} cy={790} rx={150} ry={40} fill="none" stroke={C.local} strokeWidth={4} />
          <Arrow p={[720, 790]} q={[720, 690]} color={VIOLET} w={6} head={22} />
          <Arrow p={[720, 790]} q={[840, 770]} color={C.second} w={6} head={22} />
        </g>
      </Svg>
      {[H.i, H.j, H.k].map((s, r) => <TeX key={r} s={s} x={GRID.x0 - 40} y={GRID.y0 + r * GRID.ch + GRID.ch / 2} size={60} c={r === 2 ? C.first : C.second} ax={1} o={gK} />)}
      {cellT.map(([r, c, s], q) => <TeX key={q} s={s} x={gridCell(r, c)[0]} y={gridCell(r, c)[1]} size={48} c={s.includes("none") ? C.muted : C.key} ax={0.5} o={fin(f, 4 + q * 3) * gK} />)}
      <TeX s={String.raw`\boldsymbol\Omega\times\mathbf B`} x={720} y={650} size={50} c={VIOLET} ax={0.5} o={fin(f, tCous) * gK} />
      <TurnPic o={fin(f, tKeep, 14)} />
      <Svg>
        <Keyword f={f} text="add the motions" at={[XC, 110]} appear={0} out={tDi - 20} />
        <Lbl x={XC} y={200} t="small moves add up" c={C.muted} s={T.floor} o={win(f, tSmall, tDi - 20)} />
        <Lbl x={XC} y={280} t="(the total differential)" c={C.muted} s={T.floor} o={win(f, tTD, tDi - 20)} />
        <Keyword f={f} text="speed / radius = how fast they turn" at={[XC, 470]} s={T.floor} appear={tSR} out={tChk - 20} c={C.gold} />
        <Lbl x={XC} y={675} t="unit arrows only turn" c={C.key} s={T.floor} o={win(f, tLen, tSame - 20)} />
        <Lbl x={XC} y={745} t="no earlier movie derived these" c={C.muted} s={T.floor} o={win(f, tNew, tSame - 20)} />
        <Keyword f={f} text="what to keep" at={[XC, 800]} appear={tKeep} c={C.gold} />
      </Svg>
      {lines.map((s, i) => <TeX key={i} s={f >= tSR ? gold(s) : s} x={XC} y={140 + i * 105} size={46} o={fin(f, [tDi, tDj, tDk][i])} />)}
      <TeX s={String.raw`\hat{\mathbf i}\cdot\dfrac{D\hat{\mathbf i}}{Dt}=0`} x={XC} y={480} size={44} o={fin(f, tChk + 30)} />
      <TeX s={String.raw`\hat{\mathbf j}\cdot\dfrac{D\hat{\mathbf j}}{Dt}=0`} x={XC + 300} y={480} size={44} o={fin(f, AT(k, 9, "the change of j hat"))} />
      <TeX s={String.raw`\hat{\mathbf k}\cdot\dfrac{D\hat{\mathbf k}}{Dt}=0`} x={XC} y={595} size={44} o={fin(f, AT(k, 9, "the change of k hat"))} />
      <TeX s={String.raw`\dfrac{D\hat{\mathbf e}}{Dt}=\boldsymbol\Omega_{\rm flow}\times\hat{\mathbf e}`} x={XC} y={745} size={48} o={win(f, tSame, tKeep - 20)} />
    </Scene>
  );
};

// ================================================================ s23 Newton's law needs D(bold v)/Dt; the product rule gives six terms
const S23: React.FC = () => {
  const f = useCurrentFrame(), k = K("s23_whole_vector");
  const tNewton = SS(k, 1), tF = SS(k, 4), tV = SS(k, 5), tBoth = SS(k, 6), tPR = SS(k, 7), tRule = SS(k, 8), tSix = SS(k, 9), tP1 = SS(k, 10), tP2 = SS(k, 11), tP3 = SS(k, 12), tCol = SS(k, 13);
  const [, chipEnd] = chipSpan(k);
  const n = PK.lat.length, run = clamp((f - tV) / Math.max(1, LEN(k) - tV), 0, 1), j = Math.min(n - 1, Math.floor(run * (n - 1)));
  const cam: GlobeCam = { lat: 48, lon: 6, dist: 3.4 };
  const G = globeG(cam);
  const pr = pieces(EQ_S23, [String.raw`+\dfrac{Dv}{Dt}`, String.raw`+\dfrac{Dw}{Dt}`]);
  const col = (s: string) => f < tCol ? s : s.replace(/\\dfrac\{D([uvw])\}\{Dt\}/g, String.raw`\textcolor{#aab4c8}{\dfrac{D$1}{Dt}}`).replace(/([uvw])\\dfrac\{D\\hat\{\\mathbf ([ijk])\}\}\{Dt\}/g, String.raw`\textcolor{#e8833a}{$1\dfrac{D\hat{\mathbf $2}}{Dt}}`);
  const hdg = Math.atan2(PK.u[j], PK.v[j]) / D2R;
  const a0 = G.p(PK.lat[j], PK.lon[j]);
  const a1 = (() => { const la = PK.lat[j] + 4 * Math.cos(hdg * D2R), lo = PK.lon[j] + 4 * Math.sin(hdg * D2R) / Math.cos(PK.lat[j] * D2R); return G.p(la, lo, 1.002); })();
  return (
    <Scene>
      <Globe cam={cam} grat={0.2}
        over={(Gg) => <>
          <path d={llPath(Gg, (PK.lat as number[]).slice(0, j + 1).map((la, i) => [la, PK.lon[i]] as [number, number]), 1.003)} fill="none" stroke={C.gold} strokeWidth={4} opacity={fin(f, tV)} />
          <Tripod G={Gg} la={PK.lat[j]} lo={PK.lon[j]} L={0.2} />
          <Arrow p={a0} q={a1} color={C.first} w={8} head={30} o={fin(f, tV)} />
        </>} />
      <GlobeFrame id="s23k" zoom={0} disc={discOf(cam)} />
      <SourceBelow text={SRC_G} pic={GB} w={960} name="s23 src" />
      <Svg>
        <Keyword f={f} text="why does it matter?" at={[XC, 110]} appear={0} out={tNewton - 20} />
        <Keyword f={f} text="Newton's law" at={[XC, 110]} appear={tNewton} out={tF - 20} />
        <SkipChip f={f} k={k} to={keepTime("s25_dot_i_b")} />
        <Lbl x={XC} y={300} t="number and arrow both change" c={C.muted} s={T.floor} o={win(f, tBoth, tPR - 20)} />
        <Lbl x={XC} y={285} t="Part 2: the product rule" c={C.muted} s={T.floor} o={fin(f, tPR)} />
        <Keyword f={f} text="six terms" at={[XC, 480]} s={T.floor} appear={tSix} out={tP1 - 20} />
        <Lbl x={XC} y={805} t="number changes" c={C.local} s={T.floor} o={fin(f, tCol)} />
        <Lbl x={XC + 380} y={805} t="arrow changes" c={C.second} s={T.floor} o={fin(f, tCol)} />
      </Svg>
      <TeX s={String.raw`\mathbf F=m\,\mathbf a,\quad \mathbf a=\dfrac{D\mathbf v}{Dt}`} x={XC} y={110} size={54} o={fin(f, tF)} />
      <TeX s={EQ_S03} x={XC} y={210} size={52} o={fin(f, tV)} />
      <TeX s={String.raw`\dfrac{D(u\,\hat{\mathbf i})}{Dt}=\dfrac{Du}{Dt}\,\hat{\mathbf i}+u\,\dfrac{D\hat{\mathbf i}}{Dt}`} x={XC} y={382} size={52} o={fin(f, tRule)} />
      <TeX s={col(pr[0])} x={XC} y={497} size={48} o={fin(f, tP1)} />
      <TeX s={col(pr[1])} x={XC + 150} y={605} size={48} o={fin(f, tP2)} />
      <TeX s={col(pr[2])} x={XC + 150} y={713} size={48} o={fin(f, tP3)} />
      {void chipEnd}
    </Scene>
  );
};

// ================================================================ s24 the eastward part: dot with î; terms 1, 2, 3, 5
const S24: React.FC = () => {
  const f = useCurrentFrame(), k = K("s24_dot_i_a");
  const tHow = SS(k, 1), tDot = SS(k, 2), tAll = SS(k, 3), t1 = SS(k, 4), t1b = SS(k, 5), t2 = SS(k, 6), t2b = SS(k, 7), t2c = SS(k, 8), t3 = SS(k, 9), t3b = SS(k, 10), t5 = SS(k, 11);
  const pr = pieces(EQ_S23, [String.raw`+\dfrac{Dv}{Dt}`, String.raw`+\dfrac{Dw}{Dt}`]);
  const why = cutAt(EQ_S24, String.raw`,\qquad `);
  const why2 = cutAt(why[1], String.raw`,\qquad `);
  const at: Pt = [330, 520], U = 190;
  const iT = add(at, TRI.i, U), jT = add(at, TRI.j, U), kT = add(at, TRI.k, U);
  const dI = add(iT, [TRI.j[0] * 0.5 + TRI.k[0] * 0.5, TRI.j[1] * 0.5 + TRI.k[1] * 0.5], 100);
  return (
    <Scene>
      <Svg>
        <MiniTripod at={at} U={U} />
        <Arrow p={iT} q={dI} color={C.second} w={6} head={22} dash="10 8" o={fin(f, t2b)} />
        <MiniTick at={at} a={TRI.i} b={TRI.j} o={fin(f, t3b)} />
        <MiniTick at={at} a={TRI.i} b={TRI.k} o={fin(f, t5)} />
        <MiniTick at={iT} a={[-TRI.i[0], -TRI.i[1]]} b={[dI[0] - iT[0], dI[1] - iT[1]]} o={fin(f, t2b)} s={18} />
      </Svg>
      <TeX s={H.i} x={iT[0] + 20} y={iT[1] + 10} size={56} c={C.second} halo />
      <TeX s={H.j} x={jT[0] + 20} y={jT[1] - 20} size={56} c={C.second} halo />
      <TeX s={H.k} x={kT[0] + 20} y={kT[1]} size={56} c={C.first} halo />
      <TeX s={String.raw`\dfrac{D\hat{\mathbf i}}{Dt}`} x={dI[0] + 20} y={dI[1] - 20} size={50} c={C.second} o={fin(f, t2b)} halo />
      <TeX s={why[0]} x={120} y={720} size={48} o={fin(f, t1b)} />
      <TeX s={why2[1]} x={120} y={800} size={48} o={fin(f, t2c)} />
      <TeX s={why2[0]} x={520} y={720} size={48} o={fin(f, t3b)} />
      <Svg>
        <Keyword f={f} text="the eastward part" at={[XC, 110]} appear={0} out={tAll - 20} />
        <Lbl x={XC} y={200} t="along î: the dot product (Part 1)" c={C.muted} s={T.floor} o={win(f, tDot, tAll - 20)} />
        <Lbl x={120} y={120} t="dot all six terms with î" c={C.gold} s={T.floor} o={fin(f, tAll)} />
      </Svg>
      <TeX s={pr[0]} x={XC} y={110} size={44} o={fin(f, tAll)} />
      <TeX s={pr[1]} x={XC + 120} y={215} size={44} o={fin(f, tAll)} />
      <TeX s={pr[2]} x={XC + 120} y={320} size={44} o={fin(f, tAll)} />
      <TeX s={String.raw`\text{(1)}\ \dfrac{Du}{Dt}\,\hat{\mathbf i}\cdot\hat{\mathbf i}=\dfrac{Du}{Dt}`} x={XC} y={440} size={48} o={fin(f, t1)} />
      <TeX s={String.raw`\text{(2)}\ u\,\dfrac{D\hat{\mathbf i}}{Dt}\cdot\hat{\mathbf i}=0`} x={XC} y={550} size={48} o={fin(f, t2)} />
      <TeX s={String.raw`\text{(3)}\ \dfrac{Dv}{Dt}\,\hat{\mathbf j}\cdot\hat{\mathbf i}=0`} x={XC} y={660} size={48} o={fin(f, t3)} />
      <TeX s={String.raw`\text{(5)}\ \dfrac{Dw}{Dt}\,\hat{\mathbf k}\cdot\hat{\mathbf i}=0`} x={XC} y={770} size={48} o={fin(f, t5)} />
      {void [tHow, t1b]}
    </Scene>
  );
};

// ================================================================ s25 terms 4 and 6; the result; metric terms named
const S25: React.FC = () => {
  const f = useCurrentFrame(), k = K("s25_dot_i_b");
  const t4 = SS(k, 1), t4b = SS(k, 2), t4c = SS(k, 3), t6 = SS(k, 4), t6b = SS(k, 5), t6c = SS(k, 6), tAdd = SS(k, 7), tNum = SS(k, 8), tTurn = SS(k, 9), tName = SS(k, 10),
    tSame = SS(k, 11), tKeep = SS(k, 12);
  const L3 = cutAt(EQ_S22, String.raw`,\quad `), L23 = cutAt(L3[1], String.raw`,\quad `);
  const djS = f < t4b ? L23[0] : String.raw`\dfrac{D\hat{\mathbf j}}{Dt}=\textcolor{#d8b23a}{-\hat{\mathbf i}\,\dfrac{u}{a}\tan\varphi}\cancel{-\hat{\mathbf k}\,\dfrac{v}{a}}`;
  const dkS = f < t6b ? L23[1] : String.raw`\dfrac{D\hat{\mathbf k}}{Dt}=\textcolor{#d8b23a}{\hat{\mathbf i}\,\dfrac{u}{a}}\cancel{+\hat{\mathbf j}\,\dfrac{v}{a}}`;
  const left = fout(f, tAdd - 20);
  // underbrackets of the result: x-spans from the KaTeX width estimate of each prefix (size 56)
  const S = 54, x0 = XC, y0 = 300;
  const pre1 = String.raw`\dfrac{D\mathbf v}{Dt}\cdot\hat{\mathbf i}=`, pre2 = pre1 + String.raw`\dfrac{Du}{Dt}`;
  const xa = x0 + texW(pre1, S), xb = x0 + texW(pre2, S), xc = x0 + texW(EQ_S25, S);
  const full = [String.raw`\dfrac{D\mathbf v}{Dt}=\hat{\mathbf i}\Big(\dfrac{Du}{Dt}-\dfrac{uv\tan\varphi}{a}+\dfrac{uw}{a}\Big)`,
    String.raw`+\hat{\mathbf j}\Big(\dfrac{Dv}{Dt}+\dfrac{u^2\tan\varphi}{a}+\dfrac{vw}{a}\Big)`, String.raw`+\hat{\mathbf k}\Big(\dfrac{Dw}{Dt}-\dfrac{u^2+v^2}{a}\Big)`];
  return (
    <Scene>
      <TeX s={djS} x={110} y={260} size={58} o={fin(f, t4) * left} />
      <TeX s={dkS} x={110} y={480} size={58} o={fin(f, t6) * left} />
      <Svg>
        <Keyword f={f} text="the two that survive" at={[XC, 110]} appear={0} out={t4 - 20} />
        <g opacity={fin(f, tNum)}>
          <Bracket p={[xa, y0 + 70]} q={[xb, y0 + 70]} c={C.local} off={0} />
          <Lbl x={(xa + xb) / 2} y={y0 + 120} t="change of u" c={C.local} s={T.floor} a="middle" />
        </g>
        <g opacity={fin(f, tTurn)}>
          <Bracket p={[xb + 10, y0 + 70]} q={[xc, y0 + 70]} c={C.second} off={0} />
          <Lbl x={(xb + xc) / 2} y={y0 + 120} t="metric terms" c={C.second} s={T.floor} a="middle" o={fin(f, tName)} />
        </g>
        <Keyword f={f} text="what to keep" at={[XC, 820]} appear={tKeep} c={C.gold} />
      </Svg>
      <TeX s={String.raw`\text{(4)}\ v\,\dfrac{D\hat{\mathbf j}}{Dt}\cdot\hat{\mathbf i}`} x={XC} y={130} size={50} o={win(f, t4, tAdd - 20)} />
      <TeX s={String.raw`=v\left(-\dfrac{u}{a}\tan\varphi\right)=-\dfrac{uv\tan\varphi}{a}`} x={XC + 60} y={245} size={50} o={win(f, t4c, tAdd - 20)} />
      <TeX s={String.raw`\text{(6)}\ w\,\dfrac{D\hat{\mathbf k}}{Dt}\cdot\hat{\mathbf i}=w\,\dfrac{u}{a}=+\dfrac{uw}{a}`} x={XC} y={370} size={50} o={win(f, t6, tAdd - 20)} />
      <TeX s={EQ_S25} x={x0} y={y0} size={S} o={fin(f, tAdd)} />
      {full.map((s, i) => <TeX key={i} s={s} x={XC + (i ? 90 : 0)} y={520 + i * 90} size={44} c={i ? C.muted : C.key} o={fin(f, tSame + 12 * i) * fout(f, tKeep - 12)} />)}
      {/* Part 1 lessons B4: the keep line's own picture (the arrows turn, so the same push-free wind's east number changes) */}
      <TurnPic o={fin(f, tKeep, 14)} wind />
      {void [t6c]}
    </Scene>
  );
};

// ================================================================ s26 the force-free puck: the numbers change, the speed does not
const S26: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26_glider");
  const tTh = SS(k, 1), tImg = SS(k, 2), tZero = SS(k, 3), tDu = SS(k, 4), tW = SS(k, 5), tChg = SS(k, 6), tStart = SS(k, 7), tDay = SS(k, 8), tSp = SS(k, 9), tGC = SS(k, 10),
    tArr = SS(k, 11), tNever = SS(k, 12), tShare = SS(k, 13);
  const cam: GlobeCam = { lat: 50, lon: 8, dist: 3.4 };
  const G = globeG(cam);
  const n = PK.lat.length, run = prog(f, tStart + 30, tDay + 60), j = Math.min(n - 1, Math.round(run * (n - 1)));
  const arr = (i: number) => { const h = Math.atan2(PK.u[i], PK.v[i]); const la = PK.lat[i] + 5 * Math.cos(h), lo = PK.lon[i] + 5 * Math.sin(h) / Math.cos(PK.lat[i] * D2R); return [G.p(PK.lat[i], PK.lon[i]), G.p(la, lo, 1.002)] as [Pt, Pt]; };
  const [p0, q0] = arr(0), [p1, q1] = arr(j);
  const e = pieces(EQ_S26, [String.raw`\ \Rightarrow\ `, String.raw`=\dfrac{uv\tan\varphi}{a}\neq0`]);
  const out1 = tGC - 20;
  return (
    <Scene>
      <Globe cam={cam} grat={0.22}
        over={(Gg) => <>
          <path d={llPath(Gg, (PK.lat as number[]).slice(0, j + 1).map((la, i) => [la, PK.lon[i]] as [number, number]), 1.003)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tStart)} />
          <Tripod G={Gg} la={PK.lat[0]} lo={PK.lon[0]} L={0.2} o={fin(f, tStart)} />
          {j > 2 ? <Tripod G={Gg} la={PK.lat[j]} lo={PK.lon[j]} L={0.2} /> : null}
        </>} />
      <Svg>
        <Arrow p={p0} q={q0} color={C.first} w={8} head={30} o={fin(f, tStart)} />
        {j > 2 ? <Arrow p={p1} q={q1} color={C.first} w={8} head={30} /> : null}
        <ParcelDot p={j > 0 ? p1 : p0} o={fin(f, tImg)} r={11} />
      </Svg>
      <GlobeFrame id="s26k" zoom={0} disc={discOf(cam)} />
      <SourceBelow text={SRC_G} pic={GB} w={960} name="s26 src" />
      <Svg>
        <Keyword f={f} text="what do they mean?" at={[XC, 110]} appear={0} out={tTh - 20} />
        <Keyword f={f} text="a thought experiment" at={[XC, 110]} appear={tTh} out={tZero - 20} />
        <Lbl x={XC} y={200} t="no spin, no friction, no push" c={C.muted} s={T.floor} o={win(f, tImg, tZero - 20)} />
        <Keyword f={f} text="u changes, nothing pushes" at={[XC, 500]} s={T.floor} appear={tChg} out={tStart - 20} />
        <SideCallout f={f} lines="u: 10.0 → 11.5 m/s" at={[XC, 470]} appear={AT(k, 8, "eleven and a half")} out={out1} target={[q1[0] + 8, q1[1]]} s={T.floor} bend={40} />
        <SideCallout f={f} lines="v: 10.0 → 8.2 m/s" at={[XC, 550]} appear={AT(k, 8, "eight point two")} out={out1} target={null} s={T.floor} />
        <Lbl x={XC} y={470} t="start: 45° N, 10 east, 10 north" c={C.key} s={T.floor} o={win(f, tStart, AT(k, 8, "eleven and a half") - 20)} />
        <Lbl x={XC} y={640} t="speed: 14.1 m/s, the same" c={C.gold} s={T.floor} o={win(f, tSp, out1)} />
        <Keyword f={f} text="straight: a great circle" at={[XC, 130]} s={T.floor} appear={tGC} />
        <Keyword f={f} text="our arrows turned under it" at={[XC, 230]} s={T.floor} appear={tArr} />
        <Keyword f={f} text="no speeding up, no slowing down" at={[XC, 330]} s={T.floor} appear={tNever} />
        <Lbl x={XC} y={430} t="the same speed, shared out" c={C.key} s={T.floor} o={fin(f, tShare)} />
      </Svg>
      <TeX s={e[0]} x={XC} y={130} size={52} o={win(f, tZero, tDay - 12)} />
      <TeX s={String.raw`\dfrac{Du}{Dt}=\dfrac{uv\tan\varphi}{a}-\dfrac{uw}{a}`} x={XC} y={260} size={52} o={win(f, tDu, tDay - 12)} />
      <TeX s={e[2]} x={XC + 120} y={385} size={50} o={win(f, tW, tDay - 12)} />
      <CalcStack f={f} x={XC} y={110} size={44} maxLines={4} rows={[
        { lhs: "", rhs: String.raw`\dfrac{uv\tan\varphi}{a}=\dfrac{10\times10\times1}{6\,371\,000}`, at: tDay, h: 96, out: out1 },
        { lhs: "", rhs: String.raw`\approx1.57\times10^{-5}\ \text{m/s}^2`, at: tDay + 20, out: out1 },
        { lhs: "", rhs: String.raw`\times86\,400\ \text{s}\approx1.4\ \text{m/s}`, at: tDay + 40, out: out1 },
        { lhs: "", rhs: String.raw`u\approx10+1.4=11.4`, at: AT(k, 8, "eleven and a half") - 10, out: out1 },
        { lhs: "", rhs: String.raw`\text{full great-circle path: }11.5`, at: AT(k, 8, "eleven and a half") + 15, out: out1, c: C.muted },
      ]} />
      <TeX s={String.raw`\sqrt{11.5^2+8.2^2}\approx14.1=\sqrt{10^2+10^2}`} x={XC} y={740} size={44} o={win(f, tSp, out1)} />
      {void [e[1], tShare]}
    </Scene>
  );
};

// ================================================================ s27 how big: the metric term next to Coriolis (log bars)
const S27: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27_metric_size");
  const tSame = SS(k, 1), tNum = SS(k, 2), tRes = SS(k, 3), tCor = SS(k, 4), tF = SS(k, 5), tFv = SS(k, 6), t66 = SS(k, 7), tSmall = SS(k, 8), tPole = SS(k, 9), tLater = SS(k, 10);
  const X = logX(140, 200, -6);
  const grow = prog(f, tPole + 20, tPole + 90);
  const mx = MT.mx * Math.pow(MT.tan80, grow * fin(f, tPole));
  const e = pieces(EQ_S27, [String.raw`\approx1.6`]);
  const yM = 300, yC = 440;
  return (
    <Scene>
      <Svg>
        <line x1={140} y1={560} x2={950} y2={560} stroke={C.muted} strokeWidth={3} />
        {[-6, -5, -4, -3, -2].map((p) => <line key={p} x1={X(10 ** p)} y1={548} x2={X(10 ** p)} y2={572} stroke={C.muted} strokeWidth={3} />)}
        <rect x={140} y={yM - 28} width={X(mx) - 140} height={56} fill={C.second} opacity={fin(f, tRes)} />
        <rect x={140} y={yC - 28} width={X(MT.fv) - 140} height={56} fill={VIOLET} opacity={fin(f, tFv)} />
        <Lbl x={150} y={yM - 60} t="metric term" c={C.second} s={T.floor} o={fin(f, tRes)} />
        <Lbl x={150} y={yC + 64} t="Coriolis" c={VIOLET} s={T.floor} o={fin(f, tFv)} />
        <g opacity={fin(f, t66) * fout(f, tPole)}>
          <line x1={X(MT.mx)} y1={yM + 40} x2={X(MT.fv)} y2={yM + 40} stroke={C.gold} strokeWidth={5} />
          <line x1={X(MT.mx)} y1={yM + 28} x2={X(MT.mx)} y2={yM + 52} stroke={C.gold} strokeWidth={5} />
          <line x1={X(MT.fv)} y1={yM + 28} x2={X(MT.fv)} y2={yM + 52} stroke={C.gold} strokeWidth={5} />
          <Lbl x={(X(MT.mx) + X(MT.fv)) / 2} y={yM + 80} t="≈ 66 ×" c={C.gold} s={T.key} a="middle" />
        </g>
        <Lbl x={X(mx) + 20} y={yM} t="near the poles" c={C.key} s={T.floor} o={fin(f, tPole + 60)} />
        <Lbl x={140} y={720} t="log scale · m/s²" c={C.muted} s={T.floor} />
      </Svg>
      {[-6, -5, -4, -3, -2].map((p) => <TeX key={p} s={`10^{${p}}`} x={X(10 ** p)} y={620} size={52} c={C.muted} ax={0.5} />)}
      <Svg>
        <Keyword f={f} text="how big are they?" at={[XC, 110]} appear={0} out={tNum - 20} />
        <Lbl x={XC} y={200} t="10 east, 10 north, at 45°: tan = 1" c={C.muted} s={T.floor} o={win(f, tSame, tNum - 20)} />
        <Keyword f={f} text="small in one weather system" at={[XC, 765]} s={T.floor} appear={tSmall} out={tPole - 20} />
        <Keyword f={f} text="climate models keep them" at={[XC, 765]} s={T.floor} appear={AT(k, 9, "so weather and climate")} out={tLater - 20} />
        <Keyword f={f} text="later: the equation of motion" at={[XC, 765]} s={T.floor} appear={tLater} />
      </Svg>
      <TeX s={e[0]} x={XC} y={130} size={50} o={fin(f, tNum)} />
      <TeX s={e[1]} x={XC + 100} y={225} size={50} c={C.second} o={fin(f, tRes)} />
      <TeX s={String.raw`f=2\Omega\sin\varphi,\ \ \sin45^\circ\approx0.707`} x={XC} y={310} size={48} o={fin(f, tCor)} />
      <TeX s={String.raw`=2\times7.29\times10^{-5}\times0.707`} x={XC + 100} y={375} size={44} o={fin(f, tF)} />
      <TeX s={String.raw`\approx1.03\times10^{-4}\ \text{s}^{-1}`} x={XC + 100} y={435} size={44} o={fin(f, AT(k, 5, "one point zero three"))} />
      <TeX s={String.raw`f\,v\approx1.03\times10^{-4}\times10`} x={XC} y={510} size={44} c={VIOLET} o={fin(f, tFv)} />
      <TeX s={String.raw`\approx1.0\times10^{-3}\ \text{m/s}^2`} x={XC + 100} y={570} size={44} c={VIOLET} o={fin(f, tFv)} />
      <TeX s={String.raw`\dfrac{1.03\times10^{-3}}{1.57\times10^{-5}}\approx66`} x={XC} y={655} size={46} o={fin(f, t66)} />
    </Scene>
  );
};

// ================================================================ s28 recap (one beat per sentence, mini pictures)
const S28: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28_recap");
  // Part 1 lessons D3: each beat at full strength until ITS sentence ends (the 10-11-frame gaps made it fade early); the next beat
  // enters 8 frames after its sentence starts so the fade-out and the 8-frame swap gap fit
  const b = (i: number) => win(f, SS(k, i) + (i ? 8 : 0), i < 7 ? SE(k, i) : LEN(k) + 20, 10);
  const cB: Pt = [520, 450];
  const V: TopV = { c: [300, 430], r: 170 }, S: SliceV = { c: [600, 600], r: 300 };
  const TA = topArrows(V, -4.5, 110), SA = sliceArrows(S, PHI, 110);
  const MB = boxAt(26.5, -82.05, 1.3, 120, 90, 800, 640), P = mapP(MB), p0 = P(IAN.fmb[0], IAN.fmb[1]);
  const XP: Pt = [CO.xp[0], -CO.xp[1]], YP: Pt = [CO.yp[0], -CO.yp[1]];
  const X = logX(140, 180, -6);
  const slide = (f - SS(k, 7)) * 2.2;
  return (
    <Scene>
      <Svg>
        <g opacity={b(0)}><MiniTripod at={cB} U={200} /></g>
        <g opacity={b(1)}>
          <TopViewBase V={V} axes={0} />
          <Arrow p={TA.p} q={TA.I} color={C.second} w={8} head={28} />
          <SliceBase V={S} axes={0} quarter />
          <Arrow p={SA.p} q={SA.K} color={C.first} w={8} head={28} />
          <Arrow p={SA.p} q={SA.J} color={C.second} w={8} head={28} />
        </g>
        <g opacity={b(2)}>
          <circle cx={cB[0]} cy={cB[1]} r={260} fill="none" stroke={C.local} strokeWidth={3} />
          {[BREST, KHULNA].map((p, i) => { const a = (i ? 20 : 20 + D.khulna.deg) * D2R; const q: Pt = [cB[0] + 260 * Math.cos(a), cB[1] - 260 * Math.sin(a)];
            return <g key={i}><Arrow p={q} q={[cB[0] + 360 * Math.cos(a), cB[1] - 360 * Math.sin(a)]} color={C.first} w={8} head={28} />
              <line x1={cB[0]} y1={cB[1]} x2={q[0]} y2={q[1]} stroke={C.first} strokeWidth={3} strokeDasharray="8 8" />
              <Lbl x={q[0] + (i ? 20 : -20)} y={q[1] + (i ? 40 : -40)} t={i ? "Khulna" : "Brest"} c={C.key} s={T.floor} a={i ? "start" : "end"} /></g>; })}
          <path d={poly(Array.from({ length: 21 }, (_, i) => { const a = (20 + (D.khulna.deg * i) / 20) * D2R; return [cB[0] + 90 * Math.cos(a), cB[1] - 90 * Math.sin(a)] as Pt; }))} fill="none" stroke={C.gold} strokeWidth={5} />
        </g>
        <g opacity={b(3)}>
          <path d={linesPath(P, CO.lines)} fill="none" stroke={C.key} strokeWidth={2.4} />
          <Arrow p={p0} q={add(p0, XP, IAN.along * 9)} color={C.first} w={10} head={34} />
          <Arrow p={p0} q={add(p0, YP, IAN.across * 9)} color={C.neg} w={10} head={34} dash="14 8" />
          <circle cx={p0[0]} cy={p0[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        </g>
        <g opacity={b(4)}>
          <path d={`M ${cB[0] - 300} ${cB[1] + 120} Q ${cB[0]} ${cB[1] - 120} ${cB[0] + 300} ${cB[1] + 120}`} fill="none" stroke={C.gold} strokeWidth={5} />
          {[-1, 0, 1].map((q) => { const x = cB[0] + q * 220, y = cB[1] + 40 - (1 - q * q) * 70 + (q ? 10 : 0), a = -q * 30;
            return <g key={q}><Arrow p={[x, y]} q={[x + 100 * Math.cos(a * D2R), y - 100 * Math.sin(a * D2R)]} color={C.second} w={7} head={24} />
              <Arrow p={[x, y]} q={[x - 100 * Math.sin(a * D2R), y - 100 * Math.cos(a * D2R)]} color={C.first} w={7} head={24} /></g>; })}
        </g>
        <g opacity={b(6)}>
          <rect x={140} y={360} width={X(MT.mx) - 140} height={50} fill={C.second} />
          <rect x={140} y={460} width={X(MT.fv) - 140} height={50} fill={VIOLET} />
          <Lbl x={150} y={330} t="metric" c={C.second} s={T.floor} />
          <Lbl x={150} y={545} t="Coriolis" c={VIOLET} s={T.floor} />
        </g>
        <g opacity={b(7)}>
          <circle cx={360 + slide} cy={450} r={150} fill="none" stroke={C.first} strokeWidth={6} />
          <circle cx={360 + slide} cy={450} r={12} fill={C.gold} />
          <ParcelDot p={[360 + slide + 150, 450]} />
          <Arrow p={[200, 700]} q={[520, 700]} color={C.second} w={8} head={30} />
        </g>
      </Svg>
      <TeX s={H.i} x={cB[0] + 200} y={cB[1] + 90} size={50} c={C.second} o={b(0)} />
      <TeX s={H.j} x={cB[0] + 140} y={cB[1] - 130} size={50} c={C.second} o={b(0)} />
      <TeX s={H.k} x={cB[0] + 20} y={cB[1] - 230} size={50} c={C.first} o={b(0)} />
      <SourceBelow text="Data: HRRR (NOAA) · 28 Sep 2022, 20 UTC · Natural Earth" pic={{ x: 120, y: 90, w: 800, h: 640 }} w={800} o={b(3)} name="s28 src" />
      <Svg>
        <Lbl x={XC} y={300} t="east · north · up" c={C.key} s={T.floor} o={b(0)} />
        <Lbl x={XC} y={200} t="up: from the centre" c={C.key} s={T.floor} o={b(1)} />
        <Lbl x={XC} y={290} t="east: from above the pole" c={C.key} s={T.floor} o={b(1)} />
        <Lbl x={XC} y={380} t="north: in the meridian slice" c={C.key} s={T.floor} o={b(1)} />
        <Lbl x={XC} y={300} t="Brest and Khulna: ≈ 75.8° apart" c={C.key} s={T.floor} o={b(2)} />
        <Lbl x={XC} y={200} t="coast at 329°" c={C.key} s={T.floor} o={b(3)} />
        <Lbl x={XC} y={300} t="≈ 9 m/s along the shore" c={C.first} s={T.floor} o={b(3)} />
        <Lbl x={XC} y={400} t="≈ 32 m/s onto the land" c={C.neg} s={T.floor} o={b(3)} />
        <Lbl x={XC} y={300} t="arrows turn: speed / radius" c={C.gold} s={T.floor} o={b(4)} />
        <Lbl x={XC} y={520} t="metric terms: turning arrows" c={C.second} s={T.floor} o={b(5)} />
        <Lbl x={XC} y={300} t="≈ 66 × smaller than Coriolis" c={C.key} s={T.floor} o={b(6)} />
        <Lbl x={XC} y={400} t="climate models keep them" c={C.muted} s={T.floor} o={b(6)} />
        <Lbl x={XC} y={300} t="Part 5: frames that move" c={C.key} s={T.floor} o={b(7)} />
      </Svg>
      <TeX s={EQ_S03} x={XC} y={420} size={58} o={b(0)} />
      <TeX s={EQ_S25} x={XC} y={360} size={52} o={b(5)} />
      <TeX s={String.raw`\dfrac{D\hat{\mathbf i}}{Dt}`} x={cB[0] - 60} y={cB[1] + 220} size={52} c={C.key} ax={0.5} o={b(4)} />
      {[0, 1].map(() => null)}
    </Scene>
  );
};

// ================================================================ s29 the series end card (maths ending, HOUSE_STYLE §3)
const S29: React.FC = () => {
  const f = useCurrentFrame(), k = K("s29_end");
  const t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const thumb = (x: number, i: number) => (
    <g key={i} opacity={0.75}>
      <rect x={x - 150} y={70} width={300} height={170} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
      {/* Part 1 lessons B5: icons >= 20 px inside the box (y 70-240): the tripod and the coast line were 11-15 px from the edge */}
      {i === 0 ? <MiniTripod at={[x - 40, 185]} U={70} w={5} head={18} /> : null}
      {i === 1 ? <><path d={`M ${x - 110} 210 Q ${x} 110 ${x + 110} 210`} fill="none" stroke={C.gold} strokeWidth={4} />
        {[-1, 1].map((q) => <Arrow key={q} p={[x + q * 70, 175]} q={[x + q * 70 + 50 * Math.cos(q * 0.5), 175 + 50 * Math.sin(q * 0.5)]} color={C.second} w={5} head={16} />)}</> : null}
      {i === 2 ? <><path d={`M ${x + 55} 214 L ${x - 35} 96`} fill="none" stroke={C.key} strokeWidth={4} /><Arrow p={[x + 10, 160]} q={[x - 25, 105]} color={C.second} w={5} head={16} />
        <Arrow p={[x + 10, 160]} q={[x - 45, 195]} color={C.second} w={5} head={16} /></> : null}
      {i === 3 ? <><rect x={x - 120} y={110} width={60} height={30} fill={C.second} /><rect x={x - 120} y={170} width={210} height={30} fill={VIOLET} /></> : null}
    </g>
  );
  const rel = ["vectors and index notation", "dot product", "cross product", "derivatives and Taylor series", "gradient", "contour maps", "curl", "material derivative", "Coriolis", "reading weather maps"];
  const COLX = [200, 1000], ROWY = (r: number) => 648 + r * 48;
  rel.forEach((t, i) => { if (COLX[Math.floor(i / 5)] + textW(t, T.floor) > (COLX[Math.floor(i / 5) + 1] ?? 1840) - 10) throw new Error(`end card: "${t}" too wide`); });
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, 6)}>{[420, 760, 1100, 1440].map((x, i) => thumb(x, i))}</g>
        <Lbl x={960} y={315} t="a series of maths tutorials" c={C.key} s={T.calc} a="middle" o={fin(f, 10)} />
        <Lbl x={960} y={395} t="atmospheric science · meteorology · fluid dynamics" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "atmospheric science"))} />
        <g opacity={fin(f, t2)}><Notebook x={300} y={482} s={0.4} /><Lbl x={370} y={490} t="coordinates notebook" c={C.ink} s={T.key} /></g>
        <g opacity={fin(f, tOther)}>
          {[0, 1, 2].map((i) => <Notebook key={i} x={260 + i * 30} y={575 - i * 10} s={0.24} c={[C.second, VIOLET, C.muted][i]} o={0.9} />)}
          <Lbl x={370} y={565} t="notebooks for the other maths concepts" c={C.key} s={T.key} />
        </g>
        <g opacity={fin(f, tOther + 20) * 0.8}>
          {rel.map((t, i) => <Lbl key={t} x={COLX[Math.floor(i / 5)]} y={ROWY(i % 5)} t={t} c={C.muted} s={T.floor} b={false} />)}
        </g>
      </Svg>
    </Scene>
  );
};

export const SCENES_C: Record<string, React.FC> = {
  s20_jk_north: S20, s21_jk_east: S21, s22_add_motions: S22, s23_whole_vector: S23, s24_dot_i_a: S24, s25_dot_i_b: S25, s26_glider: S26, s27_metric_size: S27,
  s28_recap: S28, s29_end: S29,
};
void [CurvedLink, sang, ll, gdot, SideCallout, GridBase, gridCell, MiniTick];
