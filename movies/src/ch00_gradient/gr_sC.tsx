// ch00_gradient scenes s17-s27: the gradient going up (the Singapore radiosonde), the thin layer, three good reasons, the
// gradient on the sphere, why the cosine matters at Brest, pressure, the box derivation, the force per kilogram, high to low.
// Every number on screen is read from data/gr.json (CHECK rows at the top); this file only places and times.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Band, Bracket, Dash, Pt, RightTick, pulse } from "../house/kit/draw";
import { CalcStack, Layered, Part, TeX } from "../house/kit/tex";
import { Keyword } from "../house/kit/notes";
import { CurvedLink, SunGlyph } from "../house/kit/extras";
import { Droplet } from "../house/kit/icons";
import { SourceBelow } from "../house/kit/frame";
import { View3D as HView3D, Arrow3D as HArrow3D, Ball3D as HBall3D, Quad3D as HQuad3D } from "../house/kit/three3d";
import { BoxEdges3D, ColumnFaces } from "../house/kit/col3d";
import { orbitCam as hOrbitCam, orbitPath as hOrbitPath, projector as hProjector, V3 } from "../house/kit/cam";
import { random } from "remotion";
import {
  AT, Arrow, Ax, Axes, ClockText, D, D2R, ForceArrow, GB, GeoImg, GeoMap, Globe, HillGround, HO, IMG, K, LEN, Lbl, MapBox, PlaneContours, Place, SS, SE, Scene,
  SideCallout, SoftEdges, Svg, Walker, arcD, axP, boxAt, clamp, edges, fin, fout, globeG, hp, linesPath, mapP, mix, nf, poly, prog, win, zoomBox, Curve, BROWN,
} from "./gr_lib";
import { SingaporeFloor, sgW } from "./gr_3d";
import { EQ_S22, EQ_S25, EQ_S26 } from "./gr_eq";

const SG = D.sing, HL = D.hill, T8 = D.t850, SP = D.sphere, MSL = D.msl, PG = D.pgf;
const CHECK_C: [string, number, number, number][] = [
  ["z0", SG.z0, 33, 0.5], ["T0", SG.T0, 27.7, 0.05], ["ztr", SG.ztr / 1000, 16.2, 0.05], ["Ttr", SG.Ttr, -81.3, 0.05], ["dT", SG.Ttr - SG.T0, -109.0, 0.05],
  ["dz", (SG.ztr - SG.z0) / 1000, 16.1, 0.04], ["lap", SG.lap, -6.8, 0.05], ["Europe lo", SG.europe[0], 10, 1], ["Europe hi", SG.europe[1], 13, 0.1],
  ["ratio", SG.ratioT, 166, 0.6], ["rot x", HL.rot30[0], 46, 0.03], ["rot y", HL.rot30[1], 19.6, 0.05],
  ["TE", T8.hand.TE, 4.51, 0.005], ["TW", T8.hand.TW, 5.69, 0.005], ["dx", T8.hand.dx, 18.4, 0.05], ["2dx", 2 * T8.hand.dx, 36.8, 0.05], ["dy", T8.hand.dy, 27.8, 0.01],
  ["slope", T8.hand.slope, -3.2, 0.005], ["nocos", T8.hand.nocos, -2.1, 0.03], ["cos78", T8.hand.cos78, 0.2, 0.005], ["pgf easy", PG.easy, 0.001, 1e-12],
  ["pgf exact", PG.exact, 0.0008, 0.00004], ["hour", PG.hour, 3.0, 0.01],
];
CHECK_C.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

// ================================================================ s17 the gradient going up: the Singapore radiosonde
const ZS = 0.4;                                          // world units per km upward (horizontal: 1 unit = 10 km): height ×4
const GA: Ax = { x: 1140, y: 70, w: 380, h: 560, xr: [-90, 30], yr: [0, 35] };
const SingColumn: React.FC<{ f: number; zb: number; trop: number; o?: number; cx?: number }> = ({ f, zb, trop, o = 1 }) => {
  void f;
  return (
    <>
      <SingaporeFloor o={o} />
      <ColumnFaces top={35 * ZS} x0={-1} x1={1} y0={-1} y1={1} faceO={0.22} o={o} fade={(t) => Math.exp(-2.2 * t)} />
      {trop > 0 ? <HQuad3D pts={[[-1.6, -1.6, (SG.ztr / 1000) * ZS], [1.6, -1.6, (SG.ztr / 1000) * ZS], [1.6, 1.6, (SG.ztr / 1000) * ZS], [-1.6, 1.6, (SG.ztr / 1000) * ZS]]} color={C.local} o={0.3 * trop} /> : null}
      {zb >= 0 ? <HBall3D at={[0, 0, (zb / 1000) * ZS + 0.15]} px={26} color="#eef2f8" o={o} /> : null}
    </>
  );
};
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_lapse_rate");
  const tUp = SS(k, 0), tSing = AT(k, 1, "Singapore"), tMalay = AT(k, 1, "Malay Peninsula"), tTime = SS(k, 2), tGround = SS(k, 3), tTop = SS(k, 4), tTrop = AT(k, 5, "tropopause");
  const tEur = SS(k, 6), tCalc = SS(k, 7), tRes = SS(k, 8), tLapse = SS(k, 9), tStrat = SS(k, 10);
  const asc = prog(f, tTime, tStrat - 10);
  const zs = SG.z as number[], Ts = SG.T as number[];
  const zb = mix(SG.z0, 35000, asc);
  const nUp = zs.filter((z) => z <= zb).length;
  const st = hOrbitCam({ ...hOrbitPath([{ f: 0, az: 232, el: 20, dist: 34, target: [0, 0, 5.2] }, { f: LEN(k), az: 262, el: 22, dist: 34, target: [0, 0, 5.2] }], f), fov: 32 }, [480, 430]);
  const pr = hProjector(st, 960, 820, 40, 30);
  const P = axP(GA);
  const p0 = P(SG.T0, SG.z0 / 1000), pT = P(SG.Ttr, SG.ztr / 1000);
  const site = pr.p(sgW(SG.site[0], SG.site[1]));
  const strat = (zs.map((z, i) => [z, Ts[i]]) as number[][]).filter((q) => q[0] >= SG.ztr);
  return (
    <Scene>
      <HView3D st={st} x={40} y={30} w={960} h={820}>
        <SingColumn f={f} zb={f >= tTime ? zb : -1} trop={fin(f, tTrop)} />
      </HView3D>
      <SoftEdges id="s17" box={{ x: 40, y: 30, w: 960, h: 820 }} px={60} />
      <Svg>
        <Place p={site} t="Singapore" dx={-30} dy={50} a="end" o={fin(f, tSing)} />
        <Place p={pr.p(sgW(2.0, 103.45))} t="Malay Peninsula" r={0} dx={0} dy={0} a="middle" italic o={fin(f, tMalay)} />
        <g opacity={fin(f, tTime)}>
          <Axes A={GA} xt={[-80, -40, 0]} yt={[0, 10, 20, 30]} yl="height (km)" xl="°C" />
          <rect x={GA.x} y={P(0, SG.europe[1])[1]} width={GA.w} height={P(0, SG.europe[0])[1] - P(0, SG.europe[1])[1]} fill={C.local} opacity={0.18 * fin(f, tEur)} />
          <Curve A={GA} xs={Ts.slice(0, Math.max(2, nUp))} ys={zs.slice(0, Math.max(2, nUp)).map((z) => z / 1000)} c={C.first} w={6} />
          <Curve A={GA} xs={strat.map((q) => q[1])} ys={strat.map((q) => q[0] / 1000)} c={C.gold} w={9} o={0.7 * fin(f, tStrat)} />
          <line x1={GA.x} y1={pT[1]} x2={GA.x + GA.w} y2={pT[1]} stroke={C.local} strokeWidth={4} strokeDasharray="12 8" opacity={fin(f, tTrop)} />
        </g>
        <circle cx={p0[0]} cy={p0[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tGround)} />
        <circle cx={pT[0]} cy={pT[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tTop)} />
        <SideCallout f={f} lines={["27.7 °C", "at 33 m"]} at={[1540, 600]} appear={tGround + 10} target={[p0[0] + 14, p0[1] - 10]} s={T.key} bend={20} />
        <SideCallout f={f} lines={["−81.3 °C", "at 16.2 km"]} at={[1540, 300]} appear={tTop + 10} target={[pT[0] + 16, pT[1] - 8]} s={T.key} bend={-20} />
        <Lbl x={1540} y={180} t="tropopause" c={C.local} s={T.key} o={fin(f, tTrop)} />
        <Lbl x={1540} y={420} t="Europe:" c={C.local} s={T.floor} o={fin(f, tEur)} />
        <Lbl x={1540} y={472} t="≈ 10–13 km" c={C.local} s={T.floor} o={fin(f, tEur)} />
      </Svg>
      {/* K6 r1: under the chart's "°C" axis word, starting at x 1080 (it reached x 1982 and sat on "at 33 m") */}
      <CalcStack f={f} x={1165} y={745} size={52} rows={[
        { lhs: String.raw`\frac{\partial T}{\partial z}`, rhs: String.raw`\approx\frac{-109.0\ ^{\circ}\mathrm{C}}{16.1\ \mathrm{km}}\approx-6.8\ ^{\circ}\mathrm{C/km}`, at: tCalc, h: 120 },
      ]} o={fout(f, tLapse - 6)} />
      <TeX s={String.raw`\Gamma=-\frac{\partial T}{\partial z}\approx+6.8\ ^{\circ}\mathrm{C/km}`} x={1080} y={800} size={58} o={fin(f, tLapse + 14)} />
      <SourceBelow text="Data: IGRA v2 (NOAA NCEI) · Singapore Changi · 1 Nov 2023, 00 UTC · image: NASA Blue Marble NG" pic={{ x: 40, y: 30, w: 960, h: 750 }} w={980} name="s17 src" />
    </Scene>
  );
};

// ================================================================ s18 the thin layer
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_thin_layer");
  const tCmp = SS(k, 0), t680 = SS(k, 1), t160 = SS(k, 2), tFlat = SS(k, 3), tStretch = AT(k, 4, "we stretch the height");
  const X0 = 80, W = 920, Yg = 640, pxkm = W / 1000;          // 1000 km across
  const ex = mix(1, 50, prog(f, tStretch, tStretch + 40));
  const zp = (zkm: number) => Yg - zkm * pxkm * ex;
  const isos = [20, 10, 0, -10, -20, -30, -40, -50].map((Tc) => {
    const pts: Pt[] = [];
    for (let x = 0; x <= 1000; x += 50) { const z = (20 - Tc + 0.04 * x) / 6.8; if (z >= 0 && z <= 13) pts.push([X0 + x * pxkm, zp(z)]); }
    return poly(pts);
  });
  const ga: Pt = [X0 + 500 * pxkm, zp(5)];
  // ∇T in screen px of the stretched slice: T = 20 − 6.8 z + 0.04 x (K, km) → (∂T/∂X, ∂T/∂Y) ∝ (0.04, 6.8/ex): at right angles to the drawn isotherms, pointing down (warmer below)
  const gu = (() => { const gx = 0.04, gy = 6.8 / ex; const L = Math.hypot(gx, gy); return [gx / L, gy / L] as Pt; })();
  return (
    <Scene>
      <Svg>
        <rect x={X0} y={zp(13)} width={W} height={Yg - zp(13)} fill="#2b3a5c" opacity={0.6} />
        <line x1={X0} y1={Yg} x2={X0 + W} y2={Yg} stroke={C.muted} strokeWidth={4} />
        {isos.map((d, i) => <path key={i} d={d} fill="none" stroke={C.ink} strokeOpacity={0.55} strokeWidth={2} />)}
        <Arrow p={ga} q={[ga[0] + gu[0] * 160, ga[1] + gu[1] * 160]} color={C.second} o={fin(f, tFlat) * clamp((ex - 4) / 10, 0, 1)} />
        <Lbl x={ga[0] + 30} y={ga[1] + 60} t="∇T" c={C.second} s={T.calc} o={fin(f, tFlat) * clamp((ex - 4) / 10, 0, 1)} />
        <Lbl x={X0} y={Yg + 50} t="1000 km" c={C.muted} s={T.floor} b={false} />
        <Lbl x={X0} y={zp(13) - 30} t={ex < 1.5 ? "13 km tall: a hairline" : "height × 50"} c={C.muted} s={T.floor} b={false} />
        <Lbl x={1080} y={110} t="sideways ≈ 4.1 °C per 100 km" c={C.key} s={T.floor} o={fin(f, tCmp)} />
      </Svg>
      <TeX s={String.raw`6.8\ ^{\circ}\mathrm{C/km}=680\ ^{\circ}\mathrm{C\ per\ 100\ km}`} x={1080} y={260} size={54} o={fin(f, t680)} />
      <TeX s={String.raw`680\div4.1\approx166>160`} x={1080} y={400} size={T.calc} o={fin(f, t160)} />
      <Svg><Lbl x={1080} y={540} t="isotherms nearly flat" c={C.key} s={T.key} o={fin(f, tFlat)} />
        <Lbl x={1080} y={620} t="∇T almost vertical" c={C.second} s={T.key} o={fin(f, tFlat + 30)} /></Svg>
    </Scene>
  );
};

// ================================================================ s19 reason one: one arrow for every direction
const S19: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19_reason_one");
  const tWhy = SS(k, 0), tThree = SS(k, 1), tFirst = SS(k, 2), tTable = SS(k, 3), tTwo = AT(k, 3, "two numbers"), tDot = SS(k, 4);
  const fan = HL.fan16 as number[];
  const col = prog(f, tTwo, tTwo + 40);
  const sg = 1 / 25;
  return (
    <Scene>
      <Svg>
        <HillGround />
        <PlaneContours o={0.7} />
        {fan.map((v, i) => {
          const a = i * 22.5 * D2R, r = 1.5 * (1 - col), q = hp(r * Math.cos(a), r * Math.sin(a)), lab = hp(2.15 * Math.cos(a), 2.15 * Math.sin(a));
          return <g key={i} opacity={fin(f, tTable + i * 3) * (1 - col)}>
            <Arrow p={HO} q={q} color={C.first} w={6} head={22} />
            <Lbl x={lab[0]} y={lab[1]} t={nf(v, 0)} c={v < -0.5 ? C.neg : C.key} s={T.floor} a="middle" />
          </g>;
        })}
        <Arrow p={HO} q={hp(30 * sg, 40 * sg)} color={C.second} o={fin(f, tTwo + 20)} />
        <Lbl x={1080} y={110} t="three good reasons" c={C.key} s={T.key} o={win(f, tThree, tFirst + 20)} />
        <Lbl x={1070} y={250} t="1  one arrow, every direction" c={C.key} s={T.floor} o={fin(f, tFirst)} />
        <Lbl x={1080} y={360} t="a long table of slopes…" c={C.muted} s={T.floor} o={fin(f, tTable) * fout(f, tTwo)} />
      </Svg>
      <TeX s={String.raw`(30,\ 40)`} x={1080} y={470} size={T.calc} c={C.second} o={fin(f, tTwo)} />
      <TeX s={String.raw`\text{rate}=\nabla h\cdot\hat{\mathbf n}`} x={1080} y={600} size={T.calc} o={fin(f, tDot)} />
    </Scene>
  );
};

// ================================================================ s20 reason two: independent of the axes
const S20: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20_reason_two");
  const tSec = SS(k, 0), tTurn = SS(k, 1), tComp = SS(k, 2), tLen = SS(k, 3), tFact = SS(k, 4);
  const rot = 30 * prog(f, tTurn + 10, tTurn + 60);
  const sg = 1 / 25, R = rot * D2R;
  const ex: Pt = [Math.cos(R), Math.sin(R)], ey: Pt = [-Math.sin(R), Math.cos(R)];
  const [c1, c2] = HL.rot30 as number[];
  const leg1 = hp(c1 * sg * ex[0], c1 * sg * ex[1]);
  return (
    <Scene>
      <Svg>
        <HillGround />
        <PlaneContours o={0.7} />
        <Arrow p={HO} q={hp(2.2 * ex[0], 2.2 * ex[1])} color={C.second} w={6} head={26} o={0.6} />
        <Arrow p={HO} q={hp(2.2 * ey[0], 2.2 * ey[1])} color={C.second} w={6} head={26} o={0.6} />
        <Lbl x={hp(2.35 * ex[0], 2.35 * ex[1])[0]} y={hp(2.35 * ex[0], 2.35 * ex[1])[1]} t={rot > 1 ? "x̂′" : "x̂"} c={C.second} s={T.key} a="middle" o={0.8} />
        <Lbl x={hp(2.35 * ey[0], 2.35 * ey[1])[0] - 10} y={hp(2.35 * ey[0], 2.35 * ey[1])[1]} t={rot > 1 ? "ŷ′" : "ŷ"} c={C.second} s={T.key} a="end" o={0.8} />
        <path d={arcD(HO, 260, 0, rot)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tTurn + 10) * (rot > 2 ? 1 : 0)} />
        <Lbl x={HO[0] + 280} y={HO[1] - 70} t="30°" c={C.gold} s={T.key} o={fin(f, tTurn + 50)} />
        <g opacity={fin(f, tComp)}>
          <Dash p={HO} q={leg1} c={C.second} w={6} />
          <Dash p={leg1} q={hp(30 * sg, 40 * sg)} c={C.second} w={6} />
        </g>
        <Arrow p={HO} q={hp(30 * sg, 40 * sg)} color={C.second} />
        <Lbl x={hp(30 * sg, 40 * sg)[0] + 30} y={hp(30 * sg, 40 * sg)[1] - 20} t="∇h" c={C.second} s={T.calc} />
        <Lbl x={1080} y={110} t="2  same arrow, any axes" c={C.key} s={T.key} o={fin(f, tSec)} />
        <Lbl x={1080} y={760} t="a fact about the mountain" c={C.gold} s={T.key} o={fin(f, tFact)} />
      </Svg>
      <CalcStack f={f} x={1500} y={220} size={52} rows={[
        { lhs: String.raw`30\cos30^{\circ}+40\sin30^{\circ}`, rhs: String.raw`\approx46`, at: tComp },
        { lhs: String.raw`-30\sin30^{\circ}+40\cos30^{\circ}`, rhs: String.raw`\approx19.6`, at: tComp + 40 },
        { lhs: String.raw`\sqrt{46^2+19.6^2}`, rhs: String.raw`\approx50`, at: tLen },
      ]} />
    </Scene>
  );
};

// ================================================================ s21 reason three: nature responds to gradients
const S21: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21_reason_three");
  const tThird = SS(k, 0), tHeat = SS(k, 1), tWater = SS(k, 2), tAir = SS(k, 3), tCase = SS(k, 4), tRoom = SS(k, 5);
  const ph = (f % 45) / 45;
  return (
    <Scene>
      <Svg>
        <Lbl x={960} y={90} t="3  nature responds to gradients" c={C.key} s={T.key} a="middle" o={fin(f, tThird)} />
        <g opacity={0.35 + 0.65 * fin(f, tHeat)}>
          <rect x={110} y={250} width={150} height={200} rx={14} fill={C.neg} opacity={0.85} />
          <rect x={420} y={250} width={150} height={200} rx={14} fill="#4a78b8" opacity={0.85} />
          <Lbl x={185} y={490} t="warm" c={C.key} s={T.floor} a="middle" /><Lbl x={495} y={490} t="cold" c={C.key} s={T.floor} a="middle" />
          {[300, 350, 400].map((y, i) => <Arrow key={y} p={[280 + 30 * ((ph + i * 0.3) % 1), y]} q={[380 + 30 * ((ph + i * 0.3) % 1), y]} color={C.gold} w={6} head={22} />)}
          <Lbl x={340} y={570} t="heat" c={C.gold} s={T.key} a="middle" />
        </g>
        <g opacity={0.35 + 0.65 * fin(f, tWater)}>
          <path d="M 740 250 L 1180 470 L 740 470 Z" fill="#5d6677" />
          <Droplet x={mix(760, 1120, (f % 60) / 60)} y={mix(250, 430, (f % 60) / 60)} s={1.2} />
          <Lbl x={960} y={570} t="water" c={C.first} s={T.key} a="middle" />
        </g>
        <g opacity={0.35 + 0.65 * fin(f, tAir)}>
          <line x1={1430} y1={230} x2={1430} y2={470} stroke={C.ink} strokeWidth={3} />
          <line x1={1650} y1={230} x2={1650} y2={470} stroke={C.ink} strokeWidth={3} />
          <Lbl x={1360} y={350} t="H" c={C.key} s={T.calc} a="middle" /><Lbl x={1730} y={350} t="L" c={C.key} s={T.calc} a="middle" />
          {[300, 400].map((y) => <ForceArrow key={y} p={[1460 + 20 * ph, y]} q={[1600 + 20 * ph, y]} w={7} head={28} />)}
          <Lbl x={1540} y={570} t="air" c={PGFc} s={T.key} a="middle" />
        </g>
        <Lbl x={960} y={680} t="gradient, not value" c={C.gold} s={T.key} a="middle" o={fin(f, tCase)} />
        <g opacity={fin(f, tRoom)}>
          {/* K6 r1: two equally warm blocks with the words under them (text inside a filled box failed the fill rule) */}
          <rect x={800} y={722} width={140} height={70} rx={10} fill={C.neg} opacity={0.85} />
          <rect x={980} y={722} width={140} height={70} rx={10} fill={C.neg} opacity={0.85} />
          <Lbl x={960} y={830} t="equally warm: no flow" c={C.key} s={T.floor} a="middle" />
        </g>
      </Svg>
    </Scene>
  );
};
const PGFc = "#f2b27a";

// ================================================================ s22 the gradient on the sphere
const P22a: Part[] = [{ t: String.raw`\nabla F=` }, { t: String.raw`\mathbf i\,\frac{1}{a\cos\varphi}\frac{\partial F}{\partial\lambda}`, u: { w: String.raw`\text{going east}`, c: C.gold } }];
const P22b: Part[] = [{ t: "+" }, { t: String.raw`\mathbf j\,\frac{1}{a}\frac{\partial F}{\partial\varphi}`, u: { w: String.raw`\text{going north}`, c: C.gold } }, { t: "+" },
  { t: String.raw`\mathbf k\,\frac{\partial F}{\partial r}`, u: { w: String.raw`\text{going up}`, c: C.gold } }];
const S22: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22_sphere");
  const tRound = SS(k, 0), tGrid = SS(k, 1), tN = SS(k, 2), tE = SS(k, 3), tSlE = SS(k, 4), tSlN = SS(k, 5), tAll = SS(k, 6);
  if ([...P22a, ...P22b].map((p) => p.t).join("").replace(/\s/g, "") !== EQ_S22.replace(/\s/g, "")) throw new Error("s22 parts drift from EQ_S22");
  const cam = { lat: 58, lon: 4, dist: 3.15 };
  const G = globeG(cam);
  const cell = (la: number, lo: number, h: number) => {
    const pts: [number, number][] = [[la - h, lo - h], [la - h, lo + h], [la + h, lo + h], [la + h, lo - h], [la - h, lo - h]];
    const out: Pt[] = []; for (let i = 0; i < 4; i++) for (let s = 0; s <= 10; s++) { const a = pts[i], b = pts[i + 1]; out.push(G.p(mix(a[0], b[0], s / 10), mix(a[1], b[1], s / 10), 1.002)); }
    return poly(out) + "Z";
  };
  const B = SP.brest_ll as number[], Sv = SP.sval_ll as number[], h = 1.25;
  const bE = G.p(B[0] + h, B[1] + h), bN = G.p(B[0] + h, B[1] - h);
  return (
    <Scene>
      {/* K6 r1: the graticule in light slate (#b8c2d6), not the muted axis grey: these are map lines that the side callouts' links cross */}
      <Globe cam={cam} grat={0.4} gratStep={10} gratC="#b8c2d6" coast={0.5} over={(Gp) => <>
        <path d={cell(B[0], B[1], h)} fill={C.second} fillOpacity={0.25} stroke={C.second} strokeWidth={4} opacity={fin(f, tN)} />
        <path d={cell(Sv[0], Sv[1], h)} fill={C.second} fillOpacity={0.25} stroke={C.second} strokeWidth={4} opacity={fin(f, tE + 40)} />
        <Place p={Gp.p(B[0], B[1])} t="Brest" r={8} dx={-20} dy={34} a="end" o={fin(f, tN)} />
        <Place p={Gp.p(Sv[0], Sv[1])} t="Svalbard" r={8} dx={22} dy={-34} o={fin(f, tE + 40)} />
      </>} />
      <Svg>
        <SideCallout f={f} lines="a dφ: north–south side" at={[1080, 410]} appear={tN + 20} out={tSlE - 14} target={G.p(B[0], B[1] - h)} s={T.floor} c={C.second} bend={-30} />
        <SideCallout f={f} lines="a cos φ dλ: east–west side" at={[1080, 340]} appear={tE + 10} out={tSlE - 14} target={G.p(B[0] + h, B[1])} s={T.floor} c={C.second} bend={40} />
        <Lbl x={1080} y={110} t="the Earth is round" c={C.key} s={T.key} o={fin(f, tRound)} />
        <Lbl x={1080} y={190} t="latitude φ, longitude λ" c={C.key} s={T.floor} o={fin(f, tGrid)} />
        <Lbl x={1080} y={260} t="a = Earth’s radius" c={C.key} s={T.floor} o={fin(f, tN)} />
        <Lbl x={1080} y={822} t="circles of latitude shrink" c={C.gold} s={T.key} o={fin(f, tE + 60)} />
      </Svg>
      <Layered parts={P22a} x={1080} y={422} size={64} o={fin(f, tSlE)} layers={[{ t: "all", o: 1, u: f >= tSlE + 30 ? [1] : [], glow: pulse(f, tSlE + 10, 30) }]} />
      <Layered parts={P22b} x={1080} y={662} size={64} o={fin(f, tSlN)} layers={[{ t: "all", o: 1, u: [...(f >= tSlN + 30 ? [1] : []), ...(f >= tAll + 10 ? [3] : [])] }]} />
      <SourceBelow text="Image: NASA Blue Marble Next Generation" pic={GB} w={GB.w} name="s22 src" />
    </Scene>
  );
};

// ================================================================ s23 why the cosine matters, at Brest
const Z0: MapBox = boxAt(48.3, -4.5, 3.6, 80, 50, 900, 760), Z1: MapBox = boxAt(48.5, -4.5, 0.9, 80, 50, 900, 760);
const S23: React.FC = () => {
  const f = useCurrentFrame(), k = K("s23_cos_example");
  const tLet = SS(k, 0), tGrid = SS(k, 1), tE = AT(k, 2, "four point five one"), tW = AT(k, 2, "five point six nine"), tKm = SS(k, 3), tTot = AT(k, 3, "thirty six");
  const tSl = SS(k, 4), tRes = SS(k, 5), tForget = SS(k, 6), tWrong = SS(k, 7), tSv = SS(k, 8);
  const zi = prog(f, tGrid - 10, tGrid + 40), zo = prog(f, SE(k, 8) - 10, LEN(k) - 4);
  const B = zoomBox(zoomBox(Z0, Z1, zi), Z0, zo);
  const P = mapP(B);
  const H = T8.hand, br = P(T8.brest.gp[0], T8.brest.gp[1]), pe = P(H.east[0], H.east[1]), pw = P(H.west[0], H.west[1]);
  const dots: Pt[] = [];
  for (let la = 47.5; la <= 49.51; la += 0.25) for (let lo = -6.0; lo <= -3.0; lo += 0.25) dots.push(P(la, lo));
  return (
    <Scene>
      <GeoMap id="s23" B={B} frame={0.6} fade={0.6 * (zi - zo)}>
        {(Pm) => <>
          <GeoImg P={Pm} href={IMG("t850.png")} box={edges(T8.img_box)} o={0.55} />
          <path d={linesPath(Pm, D.lines.europe_coast)} fill="none" stroke={C.key} strokeOpacity={0.8} strokeWidth={2.5} />
          {dots.map((d, i) => <circle key={i} cx={d[0]} cy={d[1]} r={5} fill={C.ink} opacity={0.75 * fin(f, tGrid)} />)}
        </>}
      </GeoMap>
      <Svg>
        <Place p={br} t="Brest" dx={0} dy={-44} a="middle" o={fin(f, tLet)} />
        <circle cx={pe[0]} cy={pe[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tE)} />
        <circle cx={pw[0]} cy={pw[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tW)} />
        <g opacity={fin(f, tKm) * fout(f, SE(k, 8) - 20)}>
          <Bracket p={[pw[0], pw[1] + 60]} q={[br[0], br[1] + 60]} c={C.gold} />
          <Bracket p={[br[0], br[1] + 60]} q={[pe[0], pe[1] + 60]} c={C.gold} />
        </g>
        <SideCallout f={f} lines="east: 4.51 °C" at={[1090, 210]} appear={tE} target={[pe[0] + 14, pe[1] - 14]} s={T.key} bend={40} out={SE(k, 8) - 20} />
        <SideCallout f={f} lines="west: 5.69 °C" at={[1090, 120]} appear={tW} target={[pw[0] + 8, pw[1] - 18]} s={T.key} bend={60} out={SE(k, 8) - 20} />
        <SideCallout f={f} lines="¼° of longitude = 18.4 km" at={[1090, 370]} appear={tKm} out={tSl - 12} target={[mix(br[0], pe[0], 0.5), br[1] + 66]} s={T.floor} bend={30} />
        <SideCallout f={f} lines="2 × 18.4 = 36.8 km apart" at={[1090, 300]} appear={tTot} out={tSl - 12} target={[br[0], br[1] + 66]} s={T.floor} bend={-30} />
        <Lbl x={1090} y={760} t="a third too small" c={C.neg} s={T.key} o={fin(f, tWrong + 30)} />
      </Svg>
      <CalcStack f={f} x={1320} y={300} size={52} maxLines={4} rows={[
        { lhs: String.raw`\frac{4.51-5.69}{36.8\ \mathrm{km}}`, rhs: String.raw`=\frac{-1.18}{36.8\ \mathrm{km}}`, at: tSl, h: 120 },
        { rhs: String.raw`\approx-3.2\ ^{\circ}\mathrm{C\ per\ 100\ km}`, at: tRes, cont: true },
        { lhs: String.raw`\frac{-1.18}{55.6\ \mathrm{km}}`, rhs: String.raw`\approx-2.1`, at: tWrong, c: C.neg, lc: C.neg, h: 120 },
        { lhs: String.raw`\cos78^{\circ}`, rhs: String.raw`\approx0.2\ \to\ 5\times`, at: tSv },
      ]} />
      {/* K6 r1: out before the −2.1 row takes its place (it overlapped that row's left-hand side) */}
      <Svg><Lbl x={1090} y={570} t="2 × 27.8 km" c={C.neg} s={T.floor} o={fin(f, tForget) * fout(f, tWrong - 20)} /></Svg>
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 1 Nov 2023, 18 UTC · 850 hPa" pic={{ x: Z0.x, y: Z0.y, w: Z0.w, h: Z0.h }} w={900} name="s23 src" />
    </Scene>
  );
};

// ================================================================ s24 pressure recap
const S24: React.FC = () => {
  const f = useCurrentFrame(), k = K("s24_pressure_recap");
  const tP = SS(k, 0), tPush = SS(k, 1), tSL = SS(k, 2), tIso = SS(k, 3), tNot = SS(k, 4), tWhat = SS(k, 5);
  const cube = { x: 320, y: 260, s: 300, d: 110 };
  const mol = Array.from({ length: 26 }, (_, i) => {
    const x0 = random(`mx${i}`), y0 = random(`my${i}`), vx = random(`vx${i}`) - 0.5, vy = random(`vy${i}`) - 0.5;
    const bounce = (v: number) => { const m = ((v % 2) + 2) % 2; return m > 1 ? 2 - m : m; };
    return [cube.x + 20 + (cube.s - 40) * bounce(x0 + vx * f * 0.02), cube.y + 20 + (cube.s - 40) * bounce(y0 + vy * f * 0.02)] as Pt;
  });
  const oC = fout(f, tIso, 14), oM = fin(f, tIso, 14);
  const MB = boxAt(48.8, -5.0, 9.0, 80, 50, 900, 760);
  return (
    <Scene>
      <Svg o={oC}>
        <path d={`M ${cube.x} ${cube.y} l ${cube.d} ${-cube.d * 0.6} l ${cube.s} 0 l 0 ${cube.s} l ${-cube.d} ${cube.d * 0.6} Z`} fill="#2b3a5c" stroke="#9fd3ff" strokeWidth={3} />
        <rect x={cube.x} y={cube.y} width={cube.s} height={cube.s} fill="#22304a" stroke="#9fd3ff" strokeWidth={4} opacity={0.92} />
        {mol.map((m, i) => <circle key={i} cx={m[0]} cy={m[1]} r={7} fill={C.ink} opacity={0.85} />)}
        {fin(f, tPush) > 0 ? <g opacity={fin(f, tPush)}>
          <Arrow p={[cube.x - 110, cube.y + cube.s / 2]} q={[cube.x - 12, cube.y + cube.s / 2]} color={C.ink} w={8} head={30} />
          <Arrow p={[cube.x + cube.s + 110, cube.y + cube.s / 2]} q={[cube.x + cube.s + 12, cube.y + cube.s / 2]} color={C.ink} w={8} head={30} />
          <Arrow p={[cube.x + cube.s / 2, cube.y - 130]} q={[cube.x + cube.s / 2, cube.y - 80]} color={C.ink} w={8} head={30} />
          <Arrow p={[cube.x + cube.s / 2, cube.y + cube.s + 110]} q={[cube.x + cube.s / 2, cube.y + cube.s + 12]} color={C.ink} w={8} head={30} />
        </g> : null}
        <Lbl x={1080} y={200} t="force per area" c={C.key} s={T.key} o={fin(f, tPush + 20)} />
      </Svg>
      <TeX s={String.raw`\approx1013\ \mathrm{hPa}`} x={1080} y={360} size={T.calc} o={fin(f, tSL) * oC} />
      <GeoMap id="s24m" B={MB} o={oM} frame={0.6}>
        {(P) => <>
          <path d={linesPath(P, D.lines.europe_coast)} fill="none" stroke={C.key} strokeOpacity={0.75} strokeWidth={2} />
          {MSL.isobars.map((L: { level: number; lines: number[][] }) => <path key={L.level} d={linesPath(P, L.lines)} fill="none" stroke={C.ink} strokeOpacity={0.9} strokeWidth={2.5} />)}
        </>}
      </GeoMap>
      <Svg o={oM}>
        <Keyword f={f} text="isobars" at={[1080, 560]} appear={tIso + 10} />
        <Lbl x={1080} y={660} t="pressure alone moves nothing" c={C.key} s={T.floor} o={fin(f, tNot)} />
        <Lbl x={mapP(MB)(47.4, -7.6)[0]} y={mapP(MB)(47.4, -7.6)[1]} t="?" c={C.gold} s={T.hero} a="middle" o={fin(f, tWhat)} />
      </Svg>
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 2 Nov 2023, 03 UTC" pic={{ x: MB.x, y: MB.y, w: MB.w, h: MB.h }} w={900} o={oM} name="s24 src" />
    </Scene>
  );
};

// ================================================================ s25 the box of air (3-D): net push
const [E25a, E25b, E25c] = (() => { const p = EQ_S25.split("="); if (p.length !== 3) throw new Error("EQ_S25 split"); return p; })();
const S25: React.FC = () => {
  const f = useCurrentFrame(), k = K("s25_box");
  const tBox = SS(k, 0), tW = SS(k, 1), tE = SS(k, 2), tEq = SS(k, 3), tRise = SS(k, 4), tTay = SS(k, 5), tNet = SS(k, 6), tVol = SS(k, 7);
  const st = hOrbitCam({ ...hOrbitPath([{ f: 0, az: 245, el: 24, dist: 9.0, target: [0, 0, 0.6] }, { f: LEN(k), az: 262, el: 26, dist: 9.0, target: [0, 0, 0.6] }], f), fov: 34 }, [480, 420]);
  const pr = hProjector(st, 960, 800, 40, 40);
  const grow = 1 + 0.6 * prog(f, tRise, tRise + 40);
  const zc = 0.6;
  return (
    <Scene>
      <HView3D st={st} x={40} y={40} w={960} h={800}>
        <BoxEdges3D a={[-1.2, -0.6, 0]} b={[1.2, 0.6, 1.2]} color="#9fd3ff" px={4} />
        <HQuad3D pts={[[-1.2, -0.6, 0], [-1.2, 0.6, 0], [-1.2, 0.6, 1.2], [-1.2, -0.6, 1.2]]} color={C.ink} o={0.12 * fin(f, tW)} />
        <HQuad3D pts={[[1.2, -0.6, 0], [1.2, 0.6, 0], [1.2, 0.6, 1.2], [1.2, -0.6, 1.2]]} color={C.ink} o={0.12 * fin(f, tE)} />
        <HArrow3D from={[-2.6, 0, zc]} to={[-1.25, 0, zc]} color={C.ink} px={10} head={36} o={fin(f, tW)} />
        <HArrow3D from={[1.25 + 1.35 * grow, 0, zc]} to={[1.25, 0, zc]} color={C.ink} px={10} head={36} o={fin(f, tE)} />
      </HView3D>
      <SoftEdges id="s25" box={{ x: 40, y: 40, w: 960, h: 800 }} px={50} />
      <Svg>
        <Lbl x={pr.p([0, -0.6, 0])[0]} y={pr.p([0, -0.6, 0])[1] + 40} t="δx" c={C.gold} s={T.key} a="middle" o={fin(f, tBox)} />
        <Lbl x={pr.p([-2.2, 0, zc + 0.35])[0]} y={pr.p([-2.2, 0, zc + 0.35])[1]} t="p(x) δA" c={C.key} s={T.key} a="middle" o={fin(f, tW + 10)} />
        <Lbl x={pr.p([2.6, 0, zc + 0.75])[0]} y={pr.p([2.6, 0, zc + 0.75])[1]} t="p(x + δx) δA" c={C.key} s={T.key} a="middle" o={fin(f, tE + 10)} />
        <Lbl x={1090} y={120} t="equal pushes: net 0" c={C.gold} s={T.key} o={win(f, tEq, tRise - 20)} />
        <Lbl x={1090} y={120} t="pressure rises east" c={C.key} s={T.key} o={fin(f, tRise + 4) * fout(f, tNet - 6)} />
      </Svg>
      <TeX s={String.raw`p(x+\delta x)\approx p+\frac{\partial p}{\partial x}\,\delta x`} x={1090} y={255} size={56} o={fin(f, tTay)} />
      {/* K6 r1: row heights from the measured glyph boxes (fractions ≈ 103 px at 48, the braced row 178 px at 64): the rows overlapped,
          and the first row reached x 1929 */}
      <CalcStack f={f} x={1180} y={340} size={48} rows={[
        { lhs: String.raw`\text{net}`, rhs: String.raw`=${E25a}`, at: tNet, h: 92 },
        { rhs: String.raw`=${E25b}`, at: tNet + 50, cont: true, h: 112 },
        { rhs: { parts: [{ t: "=" }, { t: String.raw`-\frac{\partial p}{\partial x}\,` }, { t: String.raw`\delta x\,\delta A`, u: { w: String.raw`\text{volume}`, c: C.gold } }], layers: [{ t: "all", o: 1, u: f >= tVol ? [2] : [] }] }, at: tVol, h: 186, size: 64 },
        { rhs: String.raw`=${E25c}`, at: tVol + 60, cont: true, h: 112 },
      ]} maxLines={2} />
    </Scene>
  );
};

// ================================================================ s26 force per kilogram: the pressure gradient force
const P26: Part[] = [{ t: String.raw`\mathbf F_p=-\frac{1}{\rho}\nabla p`, u: { w: String.raw`\text{pressure gradient force}`, c: C.gold } }];
const S26: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26_per_kilogram");
  const tDiv = SS(k, 0), tCan = SS(k, 1), tNU = SS(k, 2), tAll = SS(k, 3), tName = SS(k, 4), tEqn = SS(k, 5), tOnly = SS(k, 6);
  if (P26[0].t !== EQ_S26) throw new Error("s26 part drifts from EQ_S26");
  const bx = 330, by = 330, bw = 300, bh = 200;
  return (
    <Scene>
      <Svg>
        <rect x={bx} y={by} width={bw} height={bh} fill="#22304a" stroke="#9fd3ff" strokeWidth={4} />
        <ForceArrow p={[bx + bw / 2 + 60, by + bh / 2]} q={[bx + bw / 2 - 120, by + bh / 2]} w={10} head={40} />
        <g opacity={fin(f, tEqn)}>
          <Arrow p={[bx + bw / 2, by + bh / 2]} q={[bx + bw / 2, by + bh + 150]} color={BROWN} w={8} head={28} />
          <Lbl x={bx + bw / 2 + 20} y={by + bh + 120} t="gravity" c={C.key} s={T.floor} />
          <Arrow p={[bx + bw / 2, by + bh / 2]} q={[bx + bw / 2 + 40, by - 140]} color="#8e6fd8" w={8} head={28} />
          <Lbl x={bx + bw / 2 + 60} y={by - 120} t="Coriolis" c={C.key} s={T.floor} />
          <Arrow p={[bx + bw, by + bh / 2 + 50]} q={[bx + bw + 170, by + bh / 2 + 50]} color={C.muted} w={8} head={28} />
          <Lbl x={bx + bw + 30} y={by + bh / 2 + 110} t="friction" c={C.key} s={T.floor} />
        </g>
        <Lbl x={bx - 40} y={by + bh / 2 - 60} t="push" c={PGFc} s={T.floor} a="end" />
        <Lbl x={1080} y={760} t="only differences push" c={C.gold} s={T.key} o={fin(f, tOnly)} />
      </Svg>
      <CalcStack f={f} x={1330} y={90} size={56} rows={[
        { lhs: String.raw`\text{mass}`, rhs: String.raw`=\rho\,\delta V`, at: tDiv },
        { lhs: String.raw`\frac{-\frac{\partial p}{\partial x}\,\cancel{\delta V}}{\rho\,\cancel{\delta V}}`, rhs: String.raw`=-\frac{1}{\rho}\frac{\partial p}{\partial x}`, at: tCan, h: 150 },
      ]} o={fout(f, tAll - 6)} />
      <TeX s={String.raw`\text{north, up: the same}`} x={1080} y={430} size={52} o={fin(f, tNU) * fout(f, tAll - 6)} />
      <Layered parts={P26} x={1080} y={300} size={96} o={fin(f, tAll)} layers={[{ t: "all", o: 1, tc: { 0: C.second }, u: f >= tName ? [0] : [] }]} />
    </Scene>
  );
};

// ================================================================ s27 from high to low, easy numbers
const S27: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27_high_to_low");
  const tG = SS(k, 0), tFlip = SS(k, 1), tHL = SS(k, 2), tEasy = SS(k, 3), tOne = SS(k, 4), tUnits = SS(k, 5), tGrad = SS(k, 6), tRho1 = SS(k, 7), tRho12 = SS(k, 8), tHour = SS(k, 9);
  const x0 = 260, x1 = 760;
  const hrs = clamp((f - tHour - 20) / 60, 0, 1);
  return (
    <Scene>
      <Svg>
        <line x1={x0} y1={120} x2={x0} y2={760} stroke={C.ink} strokeWidth={4} />
        <line x1={x1} y1={120} x2={x1} y2={760} stroke={C.ink} strokeWidth={4} />
        <Lbl x={x0} y={90} t="1000 hPa" c={C.key} s={T.floor} a="middle" />
        <Lbl x={x1} y={90} t="1001 hPa" c={C.key} s={T.floor} a="middle" />
        <Lbl x={140} y={440} t="L" c={C.key} s={T.hero} a="middle" o={fin(f, tHL)} />
        <Lbl x={880} y={440} t="H" c={C.key} s={T.hero} a="middle" o={fin(f, tHL)} />
        <Arrow p={[450, 330]} q={[650, 330]} color={C.second} o={fin(f, tG)} />
        <Lbl x={550} y={280} t="∇p" c={C.second} s={T.calc} a="middle" o={fin(f, tG)} />
        <ForceArrow p={[570, 550]} q={[370, 550]} o={fin(f, tFlip)} w={10} head={40} />
        <Lbl x={470} y={610} t="force" c={PGFc} s={T.key} a="middle" o={fin(f, tFlip + 10)} />
        <Bracket p={[x0, 720]} q={[x1, 720]} c={C.gold} o={fin(f, tOne)} />
        <Lbl x={(x0 + x1) / 2} y={780} t="100 km" c={C.gold} s={T.key} a="middle" o={fin(f, tOne + 6)} />
        <ClockText x={1110} y={760} t="in 1 h: ≈ 3 m/s" h={hrs} o={fin(f, tHour)} />
      </Svg>
      <CalcStack f={f} x={1450} y={90} size={52} maxLines={4} rows={[
        { lhs: String.raw`\frac{100\ \mathrm{Pa}}{100\,000\ \mathrm{m}}`, rhs: String.raw`=0.001\ \mathrm{Pa/m}`, at: tUnits, h: 125 },
        { lhs: String.raw`\frac{0.001}{1}`, rhs: String.raw`\approx0.001\ \mathrm{m/s^2}`, at: tRho1, h: 125 },
        { lhs: String.raw`\frac{0.001}{1.2}`, rhs: String.raw`\approx0.0008\ \mathrm{m/s^2}`, at: tRho12, h: 125 },
        { lhs: String.raw`0.00083\times3600\ \mathrm{s}`, rhs: String.raw`\approx3\ \mathrm{m/s}`, at: tHour },
      ]} />
    </Scene>
  );
};

export const SCENES_C: Record<string, React.FC> = {
  s17_lapse_rate: S17, s18_thin_layer: S18, s19_reason_one: S19, s20_reason_two: S20, s21_reason_three: S21, s22_sphere: S22, s23_cos_example: S23,
  s24_pressure_recap: S24, s25_box: S25, s26_per_kilogram: S26, s27_high_to_low: S27,
};
void [Band, RightTick, Keyword, CurvedLink, SunGlyph, GeoImg, Walker, PlaneContours, edges, Place, prog, nf];
