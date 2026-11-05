// ch00_gradient scenes s09-s16: a real gradient field (ERA5 850 hPa over Brittany), the directional derivative (derivation), why the
// gradient points the steepest way, why it is at right angles to contours, four walkers, spacing, Mont Blanc, water and scale.
// Every number on screen is read from data/gr.json (CHECK rows at the top); this file only places and times.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Band, Bracket, Dash, Pt, RightTick } from "../house/kit/draw";
import { CalcStack, TeX } from "../house/kit/tex";
import { Keyword } from "../house/kit/notes";
import { CurvedLink } from "../house/kit/extras";
import { GlobeFrame, SourceBelow } from "../house/kit/frame";
import { View3D as HView3D } from "../house/kit/three3d";
import { orbitCam as hOrbitCam, orbitPath as hOrbitPath, projector as hProjector, V3 } from "../house/kit/cam";
import {
  AT, Arrow, Ax, Axes, AxesEN, BaroIcon, ColourBar, Curve, D, D2R, GeoImg, GeoMap, HillGround, HillIcon, HO, IMG, K, LEN, LUT_AMP, LUT_H, LUT_TH, Lbl,
  MapBox, PlaneContours, Place, SS, SE, Scene, SideCallout, Svg, ThermoIcon, Walker, arcD, axP, boxAt, clamp, edges, fin, fout, hp, linesPath, mapP, mix, nf,
  poly, prog, win, zoomBox,
} from "./gr_lib";
import { MontBlanc3D, mbH, mbW } from "./gr_3d";
import { EQ_S10, EQ_S11 } from "./gr_eq";

const T8 = D.t850, HL = D.hill, MBD = D.mb, SCL = D.scale, EH = D.ehill, MSL = D.msl;
const CHECK_B: [string, number, number, number][] = [
  ["dT/dx", T8.brest.gx, -3.2, 0.005], ["dT/dy", T8.brest.gy, -2.5, 0.02], ["|gradT|", T8.brest.mag, 4.1, 0.05], ["bearing", T8.brest.brg, 230, 2.5],
  ["north", HL.north, 40, 1e-9], ["walk", HL.walk[1], 25, 1e-9], ["ramp gentle", D.ramps.gentle, 50, 1e-9], ["ramp steep", D.ramps.steep, 200, 1e-9],
  ["MB dist", MBD.dist_km, 10.06, 0.01], ["MB avg", MBD.avg, 0.375, 5e-4], ["MB smax", MBD.smax, 0.6, 0.05], ["Everest 5%", SCL.ev_mag * 100, 5, 0.6],
  ["plain", SCL.plain, 50, 15], ["plateau", SCL.plateau, 4900, 80], ["block", (SCL.block_km[0] + SCL.block_km[1]) / 2, 35, 1.5],
];
CHECK_B.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

/** the ERA5 850 hPa temperature map with its isotherms and ∇T arrows (s09, s12, s33) */
const AR_S = 16;                                         // px per K/100 km (arrow lengths; no scale drawn, manifest)
export const T850Map: React.FC<{ id: string; B: MapBox; o?: number; arrows?: number; grow?: number; iso?: number; fade?: number; img?: string; list?: number[][] }> = ({
  id, B, o = 1, arrows = 1, grow = 1, iso = 0.6, fade = 0, img = "t850.png", list }) => (
  <GeoMap id={id} B={B} o={o} fade={fade} frame={0.6}>
    {(P) => <>
      <GeoImg P={P} href={IMG(img)} box={edges(T8.img_box)} />
      <path d={linesPath(P, D.lines.europe_coast)} fill="none" stroke={C.key} strokeOpacity={0.8} strokeWidth={2} />
      <path d={linesPath(P, D.lines.europe_border)} fill="none" stroke={C.key} strokeOpacity={0.5} strokeWidth={1.5} strokeDasharray="6 6" />
      {T8.iso.map((L: { level: number; lines: number[][] }) => <path key={L.level} d={linesPath(P, L.lines)} fill="none" stroke={C.ink} strokeOpacity={iso} strokeWidth={2} />)}
      {arrows > 0 ? (list ?? T8.arrows).map((a: number[], i: number) => {
        const p0 = P(a[0], a[1]);
        return <Arrow key={i} p={p0} q={[p0[0] + a[2] * AR_S * grow, p0[1] - a[3] * AR_S * grow]} color={C.second} w={6} head={20} o={arrows} />;
      }) : null}
    </>}
  </GeoMap>
);

// ================================================================ s09 a real gradient field: ERA5 850 hPa, 18 UTC 1 Nov 2023
const MB9: MapBox = boxAt(48.2, -7.0, 11.5, 80, 40, 1100, 780);   // K6 r1: h 780 so the source line ends above y 880
const ZB9: MapBox = boxAt(48.5, -4.5, 2.2, 80, 40, 1100, 780);
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09_gradient_field");
  const tArr = SS(k, 0), tName = AT(k, 1, "gradient field"), tBrit = AT(k, 2, "Brittany"), tERA = AT(k, 4, "ERA5"), tRe = AT(k, 4, "reanalysis"), tWarm = SS(k, 5);
  const tBrest = AT(k, 6, "At Brest"), tDx = AT(k, 6, "partial capital T by partial x"), tDy = AT(k, 6, "partial capital T by partial y"), tPy = SS(k, 7), tBrg = SS(k, 8);
  const zin = prog(f, tBrest - 10, tBrest + 35), zout = prog(f, SE(k, 8) - 20, LEN(k) - 4);
  const B = zoomBox(zoomBox(MB9, ZB9, zin), MB9, zout);
  const P = mapP(B);
  const br = P(T8.brest.gp[0], T8.brest.gp[1]);
  const s = 52 * (B.w / MB9.w) * ((MB9.lat1 - MB9.lat0) / (B.lat1 - B.lat0)) / 6.1;      // the Brest arrow: same px/K as the map, grown with the zoom
  const L = Math.min(1, (zin - zout) * 1.2);
  const ex: Pt = [br[0] + T8.brest.gx * s, br[1]], tipB: Pt = [br[0] + T8.brest.gx * s, br[1] - T8.brest.gy * s];
  return (
    <Scene>
      <T850Map id="s09" B={B} arrows={fin(f, tArr) * (1 - 0.6 * L)} grow={prog(f, tArr, tArr + 40)} fade={L * 0.8} />
      <Svg>
        <Place p={P(48.15, -2.9)} t="Brittany" r={0} dx={0} dy={0} a="middle" o={fin(f, tBrit) * (1 - L)} italic />
        <Place p={br} t="Brest" dx={-18} dy={-40} a="end" o={fin(f, tBrest)} />
        <g opacity={L}>
          <Dash p={br} q={ex} c={C.second} w={6} />
          <Dash p={ex} q={tipB} c={C.second} w={6} />
          <Arrow p={br} q={tipB} color={C.second} w={10} head={40} o={fin(f, tPy)} />
          <path d={arcD(br, 120, 90, 90 - T8.brest.brg)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tBrg)} />
        </g>
        <ColourBar x={1240} y={110} w={330} lut={LUT_TH} lo={-14} hi={14} unit="°C" title="temperature" ticks={[{ v: -10, t: "−10" }, { v: 0, t: "0" }, { v: 10, t: "10" }]} o={1 - 0.0 * L} />
        <Keyword f={f} text="gradient field" at={[1240, 250]} appear={tName} out={tBrest - 12} />
        <Lbl x={1240} y={330} t="ERA5 = reanalysis" c={C.key} s={T.key} o={win(f, tRe, tBrest - 12)} />
        <Lbl x={1240} y={410} t="towards warmer air" c={C.key} s={T.key} o={win(f, tWarm, tBrest - 12)} />
        <SideCallout f={f} lines="∂T/∂x = −3.2" at={[1240, 270]} appear={tDx} target={[mix(br[0], ex[0], 0.5), br[1] + 6]} s={T.calc} bend={40} out={LEN(k) - 30} />
        <SideCallout f={f} lines="∂T/∂y = −2.5" at={[1240, 380]} appear={tDy} target={[ex[0] - 8, mix(ex[1], tipB[1], 0.5)]} s={T.calc} bend={-30} out={LEN(k) - 30} />
        <Lbl x={1240} y={460} t="K per 100 km" c={C.muted} s={T.floor} b={false} o={fin(f, tDx + 20) * fout(f, LEN(k) - 30)} />
        {/* K6 r2: the bearing link points at the arc's south side (below Brest), so the three links reach Brest in the order of their labels */}
        <SideCallout f={f} lines="≈ 230° from north" at={[1240, 770]} appear={tBrg} target={[br[0] + 8, br[1] + 128]} s={T.key} bend={-30} out={LEN(k) - 30} />
      </Svg>
      <CalcStack f={f} x={1326} y={540} size={60} rows={[
        { lhs: String.raw`|\nabla T|`, rhs: String.raw`=\sqrt{3.2^2+2.5^2}`, at: tPy },
        { rhs: String.raw`\approx 4.1\ \mathrm{K\ per\ 100\ km}`, at: tPy + 40, cont: true },
      ]} o={fout(f, LEN(k) - 30)} />
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 1 Nov 2023, 18 UTC · 850 hPa" pic={{ x: MB9.x, y: MB9.y, w: MB9.w, h: MB9.h }} w={1100} name="s09 src" />
    </Scene>
  );
};

// ================================================================ s10 the directional derivative (derivation, one move per sentence)
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_directional");
  const tGo = SS(k, 0), tDs = SS(k, 1), tN = AT(k, 2, "n hat"), tAl = AT(k, 2, "alpha"), tParts = SS(k, 3), tSteps = SS(k, 4), tDh = SS(k, 5), tDiv = SS(k, 6), tRes = SS(k, 7);
  const tDot = SS(k, 8), tName = AT(k, 9, "directional derivative"), tChk = SS(k, 10), tNum = SS(k, 11);
  const al = f < tChk ? 32 : mix(32, 90, prog(f, tChk, tChk + 40));
  const ds = 1.7;
  const tip = hp(ds * Math.cos(al * D2R), ds * Math.sin(al * D2R)), ex = hp(ds * Math.cos(al * D2R), 0);
  const sg = 1 / 25;
  return (
    <Scene>
      <Svg>
        <HillGround />
        <PlaneContours o={0.9} />
        <AxesEN />
        <Arrow p={HO} q={hp(30 * sg, 40 * sg)} color={C.second} o={0.35} />
        <Arrow p={HO} q={tip} color={C.first} w={10} head={40} o={fin(f, tDs)} />
        <Lbl x={tip[0] + 22} y={tip[1] - 22} t="n̂" c={C.first} s={T.calc} o={fin(f, tN)} />
        <path d={arcD(HO, 80, 0, al)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tAl)} />
        <Lbl x={HO[0] + 96 * Math.cos((al / 2) * D2R) + 12} y={HO[1] - 96 * Math.sin((al / 2) * D2R)} t="α" c={C.gold} s={T.key} o={fin(f, tAl + 6)} />
        <g opacity={fin(f, tParts) * fout(f, tChk)}>
          <Dash p={HO} q={ex} c={C.first} w={5} />
          <Dash p={ex} q={tip} c={C.first} w={5} />
          <Lbl x={mix(HO[0], ex[0], 0.5)} y={HO[1] + 40} t="ds cos α" c={C.first} s={T.floor} a="middle" />
          <Lbl x={ex[0] + 16} y={mix(ex[1], tip[1], 0.5)} t="ds sin α" c={C.first} s={T.floor} />
        </g>
        <Walker x={HO[0] - 34} y={HO[1] + 4} s={0.7} />
        <Keyword f={f} text="directional derivative" at={[1080, 780]} appear={tName} out={tChk - 12} />
      </Svg>
      <CalcStack f={f} x={1250} y={90} size={58} maxLines={4} rows={[
        { lhs: String.raw`dx`, rhs: String.raw`=ds\cos\alpha`, at: tSteps },
        { lhs: String.raw`dy`, rhs: String.raw`=ds\sin\alpha`, at: tSteps + 30 },
        { lhs: String.raw`dh`, rhs: String.raw`=\frac{\partial h}{\partial x}\,dx+\frac{\partial h}{\partial y}\,dy`, at: tDh, h: 120 },
        { lhs: String.raw`\div\,ds`, rhs: String.raw`\ `, at: tDiv, c: C.gold, lc: C.gold },
      ]} o={fout(f, tRes - 4)} />
      <TeX s={EQ_S10} x={1070} y={300} size={48} o={fin(f, tRes) * fout(f, tChk - 6)} />
      <TeX s={String.raw`\nabla h\cdot\hat{\mathbf n}`} x={1450} y={460} size={T.eq} c={C.second} o={fin(f, tDot) * fout(f, tChk - 6)} />
      <Svg><Lbl x={1440} y={560} t="dot product" c={C.key} s={T.key} o={fin(f, tDot + 10) * fout(f, tChk - 6)} /></Svg>
      <TeX s={String.raw`\alpha=90^{\circ}:\ \ 30\times0+40\times1=40`} x={1070} y={300} size={54} o={fin(f, tNum)} />
    </Scene>
  );
};

// ================================================================ s11 why the gradient points the steepest way
const CA: Ax = { x: 1150, y: 520, w: 560, h: 230, xr: [-180, 180], yr: [-50, 50] };
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_steepest");
  const tQ = SS(k, 0), tForm = SS(k, 1), tTh = AT(k, 2, "theta"), tOne = SS(k, 3), tMax = SS(k, 4), tAlong = SS(k, 5), tWhy = SS(k, 6), tOpp = SS(k, 7);
  const g = Math.atan2(40, 30) / D2R;
  const th = f < tTh ? 40 : f < tAlong ? 40 + 360 * prog(f, tTh + 10, tAlong - 10) : f < tOpp ? 0 : mix(0, 180, prog(f, tOpp, tOpp + 40));
  const thn = ((th + 180) % 360 + 360) % 360 - 180;
  const val = 50 * Math.cos(th * D2R);
  const sg = 1 / 25, gtip = hp(30 * sg, 40 * sg);
  const nd: Pt = hp(1.6 * Math.cos((g + th) * D2R), 1.6 * Math.sin((g + th) * D2R));
  const shadow = hp(((val * sg) * Math.cos((g + th) * D2R)), ((val * sg) * Math.sin((g + th) * D2R)));
  const cp = axP(CA)(thn, val);
  const xs = Array.from({ length: 73 }, (_, i) => -180 + i * 5), ys = xs.map((x) => 50 * Math.cos(x * D2R));
  return (
    <Scene>
      <Svg>
        <HillGround />
        <PlaneContours o={0.9} />
        <Band p={HO} q={shadow} color={val >= 0 ? C.second : C.neg} o={0.45 * fin(f, tOne)} />
        <Arrow p={HO} q={gtip} color={C.second} />
        <Lbl x={gtip[0] + 30} y={gtip[1] - 20} t="∇h" c={C.second} s={T.calc} />
        <Arrow p={HO} q={nd} color={C.first} w={10} head={40} o={fin(f, tForm)} />
        <path d={arcD(HO, 70, g, g + th)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tTh) * (Math.abs(th) > 3 ? 1 : 0)} />
        <Walker x={HO[0] - 34} y={HO[1] + 4} s={0.7} />
        <g opacity={fin(f, tOne)}>
          <Axes A={CA} xt={[-90, 0, 90]} yt={[-50, 0, 50]} yl="climb (m/km)" xl="θ (°)" zero />
          <Curve A={CA} xs={xs} ys={ys} c={C.first} w={5} />
          <circle cx={cp[0]} cy={cp[1]} r={11} fill={C.first} stroke={C.bg} strokeWidth={3} />
          <circle cx={axP(CA)(0, 50)[0]} cy={axP(CA)(0, 50)[1]} r={12} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tMax)} />
        </g>
        <Lbl x={1150} y={430} t={`50 cos θ = ${nf(val, 0)}`} c={val < -0.5 ? C.neg : C.key} s={T.calc} o={fin(f, tOne)} />
        <Lbl x={1150} y={90} t="why steepest?" c={C.key} s={T.key} o={fin(f, tQ) * fout(f, tForm - 8)} />
        <Lbl x={1150} y={330} t="cos θ ≤ 1" c={C.gold} s={T.key} o={fin(f, tMax)} />
        <Lbl x={1420} y={330} t="fastest rate = |∇h|" c={C.key} s={T.floor} o={fin(f, tWhy)} />
      </Svg>
      <TeX s={EQ_S11} x={1070} y={200} size={50} o={fin(f, tForm)} />
    </Scene>
  );
};

// ================================================================ s12 at right angles to contour lines (and isotherms, isobars)
const eS = 120;                                         // px per km for the s12 hill
const eO: Pt = [520, 450];
const ep = (x: number, y: number): Pt => [eO[0] + x * eS, eO[1] - y * eS];
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12_perpendicular");
  const tWalk = SS(k, 0), tCont = AT(k, 1, "contour lines"), tZero = SS(k, 2), tNinety = SS(k, 3), tRight = SS(k, 4), tIso = SS(k, 5), tMovie = SS(k, 6);
  const ell = (h: number) => { const s = Math.sqrt(-2 * Math.log(h / EH.H)), pts: Pt[] = []; for (let a = 0; a <= 360; a += 4) pts.push(ep(EH.a * s * Math.cos(a * D2R), EH.b * s * Math.sin(a * D2R))); return poly(pts); };
  const s50 = Math.sqrt(-2 * Math.log(50 / EH.H)), wa = mix(0.2, 3.6, prog(f, tWalk + 10, tZero + 30));
  const wp = ep(EH.a * s50 * Math.cos(wa), EH.b * s50 * Math.sin(wa));
  const oHill = fout(f, tIso, 14), oMaps = fin(f, tIso, 14);
  const BL = boxAt(48.2, -5.2, 6.0, 80, 60, 840, 680), BR = boxAt(48.2, -5.2, 6.0, 1000, 60, 840, 680);
  const tick = (P: (la: number, lo: number) => Pt, t: number[], key: string) => {
    const p0 = P(t[0], t[1]), gl = Math.hypot(t[2], t[3]), tl = Math.hypot(t[4], t[5]);
    const ug: Pt = [t[2] / gl, -t[3] / gl], ut: Pt = [t[4] / tl, -t[5] / tl];
    return <g key={key}><Arrow p={p0} q={[p0[0] + ug[0] * 70, p0[1] + ug[1] * 70]} color={C.second} w={7} head={24} /><RightTick at={p0} u1={ug} u2={ut} s={20} c={C.gold} /></g>;
  };
  return (
    <Scene>
      <Svg o={oHill}>
        <rect x={eO[0] - 470} y={eO[1] - 400} width={940} height={800} rx={22} fill="#22304a" />
        {EH.levels.map((h: number) => <path key={h} d={ell(h)} fill="none" stroke={C.key} strokeWidth={h === 50 ? 4 : 2} strokeOpacity={h === 50 ? 0.95 : 0.45} />)}
        <path d={(() => { const pts: Pt[] = []; for (let a = 0.2; a <= wa; a += 0.05) pts.push(ep(EH.a * s50 * Math.cos(a), EH.b * s50 * Math.sin(a))); return poly(pts); })()}
          fill="none" stroke={C.first} strokeWidth={7} opacity={fin(f, tWalk)} />
        <Walker x={wp[0]} y={wp[1]} s={0.65} o={fin(f, tWalk)} />
        {EH.ticks.map((t: number[], i: number) => {
          const p0 = ep(t[0], t[1]), gl = Math.hypot(t[2], t[3]), ug: Pt = [t[2] / gl, -t[3] / gl];
          const s = Math.sqrt(-2 * Math.log(50 / EH.H)), ang = Math.atan2(t[1] / EH.b, t[0] / EH.a), tg: Pt = [-EH.a * s * Math.sin(ang), -EH.b * s * Math.cos(ang)], tl = Math.hypot(tg[0], tg[1]);
          return <g key={i} opacity={fin(f, tRight + 8 * i)}><Arrow p={p0} q={[p0[0] + ug[0] * 80, p0[1] + ug[1] * 80]} color={C.second} w={8} head={28} />
            <RightTick at={p0} u1={ug} u2={[tg[0] / tl, tg[1] / tl]} s={22} c={C.gold} /></g>;
        })}
        <Lbl x={1100} y={140} t="contour lines" c={C.key} s={T.key} o={fin(f, tCont)} />
        <Lbl x={1100} y={260} t="climb = 0" c={C.key} s={T.calc} o={fin(f, tZero)} />
        <Lbl x={1100} y={500} t="θ = 90°" c={C.gold} s={T.calc} o={fin(f, tNinety + 20)} />
        <Lbl x={1100} y={620} t="∇h ⟂ contours" c={C.second} s={T.calc} o={fin(f, tRight)} />
      </Svg>
      <GeoMap id="s12t" B={BL} o={oMaps} frame={0.6}>
        {(P) => <>
          <GeoImg P={P} href={IMG("t850.png")} box={edges(T8.img_box)} o={0.75} />
          <path d={linesPath(P, D.lines.europe_coast)} fill="none" stroke={C.key} strokeOpacity={0.7} strokeWidth={2} />
          {T8.iso.map((L: { level: number; lines: number[][] }) => <path key={L.level} d={linesPath(P, L.lines)} fill="none" stroke={C.ink} strokeOpacity={0.85} strokeWidth={2.5} />)}
        </>}
      </GeoMap>
      <GeoMap id="s12p" B={BR} o={oMaps} frame={0.6}>
        {(P) => <>
          <path d={linesPath(P, D.lines.europe_coast)} fill="none" stroke={C.key} strokeOpacity={0.7} strokeWidth={2} />
          {MSL.isobars.map((L: { level: number; lines: number[][] }) => <path key={L.level} d={linesPath(P, L.lines)} fill="none" stroke={C.ink} strokeOpacity={0.85} strokeWidth={2.5} />)}
        </>}
      </GeoMap>
      <Svg o={oMaps}>
        {T8.ticks.map((t: number[], i: number) => tick(mapP(BL), t, `t${i}`))}
        {MSL.ticks.map((t: number[], i: number) => tick(mapP(BR), [t[0], t[1], t[2], t[3], t[4], t[5]], `p${i}`))}
        <Lbl x={BL.x + 20} y={BL.y + BL.h + 35} t="isotherms" c={C.key} s={T.key} o={fin(f, AT(k, 5, "isotherms"))} />
        <Lbl x={BR.x + 20} y={BR.y + BR.h + 35} t="isobars" c={C.key} s={T.key} o={fin(f, AT(k, 5, "isobars"))} />
        <Lbl x={BL.x + 420} y={BL.y + BL.h + 35} t="contour maps" c={C.muted} s={T.floor} o={0.8 * fin(f, tMovie)} />
        <Lbl x={BR.x + 240} y={BR.y + BR.h + 35} t="how contour maps are made" c={C.muted} s={T.floor} o={0.8 * fin(f, tMovie + 20)} />
      </Svg>
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 850 hPa, 1 Nov 2023, 18 UTC · sea level, 2 Nov 2023, 03 UTC" pic={{ x: 80, y: 60, w: 1760, h: 680 }} w={1760} gap={70} o={oMaps} name="s12 src" />
    </Scene>
  );
};
const T8x = T8;
void T8x;

// ================================================================ s13 four walkers, one thing changing
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = K("s13_cases");
  const at = [SS(k, 1), SS(k, 4), SS(k, 7), SS(k, 10)], calc = [SS(k, 2), SS(k, 5), SS(k, 8), SS(k, 11)], rule = [SS(k, 3), SS(k, 6), SS(k, 9), SS(k, 12)];
  const angs = [0, 60, 90, 180], vals = HL.walk as number[];
  const txt = [String.raw`50\times\cos 0^{\circ}=50`, String.raw`50\times\cos 60^{\circ}=25`, String.raw`50\times\cos 90^{\circ}=0`, String.raw`50\times(-1)=-50`];
  const words = ["steepest", "shadow", "no change", "steepest down"];
  const g = Math.atan2(40, 30) / D2R;
  return (
    <Scene>
      {angs.map((a, i) => {
        const cx = 290 + i * 450, cy = 330, u = 2.9;
        const P = (x: number, y: number): Pt => [cx + x * u * 50, cy - y * u * 50];
        const gt = P(0.6 * 1.2, 0.8 * 1.2), dir: Pt = [Math.cos((g + a) * D2R), Math.sin((g + a) * D2R)];
        const wt = P(dir[0] * 1.2, dir[1] * 1.2);
        const proj = (vals[i] / 50) * 1.2, sh = P(proj * dir[0], proj * dir[1]);
        return (
          <React.Fragment key={i}>
            <Svg o={fin(f, i === 0 ? 4 : at[i] - 6)}>
              <rect x={cx - 200} y={cy - 200} width={400} height={400} rx={18} fill="#22304a" />
              {[-3, -2, -1, 0, 1, 2, 3].map((q) => { const o0 = P(q * 0.6 * 0.45, q * 0.8 * 0.45); const d: Pt = [-0.8, 0.6];
                return <line key={q} x1={o0[0] - d[0] * 190} y1={o0[1] + d[1] * 190} x2={o0[0] + d[0] * 190} y2={o0[1] - d[1] * 190} stroke={C.key} strokeOpacity={0.35} strokeWidth={2} />; })}
              <Band p={[cx, cy]} q={sh} color={vals[i] >= 0 ? C.second : C.neg} o={0.45 * fin(f, calc[i])} />
              <Arrow p={[cx, cy]} q={gt} color={C.second} w={8} head={30} />
              <Arrow p={[cx, cy]} q={wt} color={C.first} w={8} head={30} o={fin(f, at[i])} />
              <circle cx={cx} cy={cy} r={8} fill={C.gold} />
            </Svg>
            <TeX s={txt[i]} x={cx} y={600} size={48} ax={0.5} c={vals[i] < -0.5 ? C.neg : C.ink} o={fin(f, calc[i])} />
            <Svg><Lbl x={cx} y={700} t={words[i]} c={C.key} s={T.key} a="middle" o={fin(f, rule[i])} /></Svg>
          </React.Fragment>
        );
      })}
      <Svg><Lbl x={960} y={800} t="same hill, same ∇h — only the direction changes" c={C.muted} s={T.floor} a="middle" o={win(f, SS(k, 0), at[0] + 10)} /></Svg>
    </Scene>
  );
};

// ================================================================ s14 spacing: crowded lines mean a big gradient
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14_spacing");
  const tQ = SS(k, 0), tEvery = SS(k, 1), tGen = SS(k, 2), tSt = SS(k, 3), tSt2 = SS(k, 4), tRule = SS(k, 5), tIcons = SS(k, 6);
  const u = 190;                                       // px per km
  const panel = (x0: number, sp: number, o: number, n: number) => (
    <g opacity={o}>
      <rect x={x0} y={70} width={800} height={440} rx={18} fill="#22304a" />
      {Array.from({ length: n }, (_, i) => x0 + 40 + i * sp * u).filter((x) => x < x0 + 790).map((x, i) => (
        <g key={i}><line x1={x} y1={90} x2={x} y2={350} stroke={C.key} strokeWidth={3} strokeOpacity={0.8} />
          <Lbl x={x + 8} y={110} t={`${(i + 1) * 100}`} c={C.muted} s={T.floor} b={false} /></g>))}
    </g>
  );
  return (
    <Scene>
      <Svg>
        {panel(80, 2, fin(f, tEvery), 3)}
        {panel(1000, 0.5, fin(f, tSt), 9)}
        {/* K6 r1: the contour lines stop at y 350; brackets and their labels sit under them (a label across five lines was unreadable) */}
        <Bracket p={[120, 385]} q={[120 + 2 * u, 385]} off={0} c={C.gold} o={fin(f, tGen)} />
        <Lbl x={120 + u} y={450} t="2 km" c={C.gold} s={T.key} a="middle" o={fin(f, tGen + 6)} />
        <Bracket p={[1040, 385]} q={[1040 + 0.5 * u, 385]} off={0} c={C.gold} o={fin(f, tSt + 10)} />
        <Lbl x={1040 + 0.25 * u + 40} y={450} t="0.5 km" c={C.gold} s={T.key} a="middle" o={fin(f, tSt + 16)} />
        <Arrow p={[480, 300]} q={[480 + 50 * 1.5, 300]} color={C.second} o={fin(f, AT(k, 2, "fifty metres per kilometre"))} />
        <Arrow p={[1500, 300]} q={[1500 + 200 * 1.5, 300]} color={C.second} o={fin(f, AT(k, 4, "two hundred metres per kilometre"))} />
        <Lbl x={960} y={720} t="closer lines → bigger gradient" c={C.key} s={T.key} a="middle" o={fin(f, tRule)} />
        <HillIcon x={720} y={830} s={0.6} o={fin(f, AT(k, 6, "steep slope"))} />
        <ThermoIcon x={960} y={820} s={0.55} o={fin(f, AT(k, 6, "temperature"))} />
        <BaroIcon x={1200} y={800} r={34} o={fin(f, AT(k, 6, "pressure"))} />
        <Keyword f={f} text="read it off a map" at={[960, 590]} a="middle" appear={tQ} out={tGen - 12} />
      </Svg>
      <TeX s={String.raw`\frac{100\ \mathrm{m}}{2\ \mathrm{km}}=50\ \mathrm{m/km}`} x={480} y={600} size={60} ax={0.5} o={fin(f, AT(k, 2, "a hundred metres over two"))} />
      <TeX s={String.raw`\frac{100\ \mathrm{m}}{0.5\ \mathrm{km}}=200\ \mathrm{m/km}`} x={1400} y={600} size={60} ax={0.5} o={fin(f, tSt2)} />
    </Scene>
  );
};

// ================================================================ s15 Mont Blanc: a real mountain (drape, heights ×2)
const mbCam = (f: number, k: number, keys: { f: number; tgt: [number, number]; dist: number; az: number; el: number }[]) =>
  hOrbitCam({ ...hOrbitPath(keys.map((q) => ({ f: q.f, az: q.az, el: q.el, dist: q.dist, target: mbW(q.tgt[0], q.tgt[1], mbH(q.tgt[0], q.tgt[1])) as V3 })), f), fov: 32 }, [600, 470]);
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_mont_blanc");
  const tMB = AT(k, 0, "Mont Blanc"), tETO = AT(k, 1, "ETOPO"), tX2 = SS(k, 2), tCham = AT(k, 3, "Chamonix"), tSum = AT(k, 4, "The summit"), tTen = AT(k, 4, "ten kilometres");
  const tAvg = SS(k, 5), tPct = SS(k, 6), tDraw = SS(k, 7), tUp = SS(k, 8), tSixty = AT(k, 9, "about sixty percent");
  const C0: [number, number] = [45.865, 6.87];
  const st = mbCam(f, k, [
    { f: 0, tgt: C0, dist: 44, az: 262, el: 40 }, { f: tCham - 10, tgt: C0, dist: 44, az: 266, el: 40 },
    { f: tCham + 20, tgt: MBD.cham, dist: 30, az: 266, el: 38 }, { f: tTen + 30, tgt: MBD.summit, dist: 28, az: 262, el: 40 },
    { f: tDraw, tgt: [45.86, 6.875], dist: 34, az: 258, el: 44 }, { f: LEN(k) - 40, tgt: C0, dist: 44, az: 262, el: 40 },
  ]);
  const pr = hProjector(st, 1920, 1080, 0, 0);
  const pc = pr.p(mbW(MBD.cham[0], MBD.cham[1], mbH(MBD.cham[0], MBD.cham[1]))), ps = pr.p(mbW(MBD.summit[0], MBD.summit[1], mbH(MBD.summit[0], MBD.summit[1])));
  const oA = fin(f, tDraw) * fout(f, LEN(k) - 40);
  const pmax = pr.p(mbW(MBD.smax_at[0], MBD.smax_at[1], mbH(MBD.smax_at[0], MBD.smax_at[1])));
  return (
    <Scene>
      <HView3D st={st} x={0} y={0} w={1920} h={1080}>
        <MontBlanc3D />
      </HView3D>
      <Svg>
        <g opacity={0.55 * oA}>
          {MBD.contours.map((c: { level: number; lines: number[][] }) => <path key={c.level} d={c.lines.map((ln) => {
            const pts: Pt[] = []; for (let i = 0; i < ln.length; i += 2) pts.push(pr.p(mbW(ln[i + 1], ln[i], c.level))); return poly(pts); }).join("")}
            fill="none" stroke={C.key} strokeWidth={2} />)}
        </g>
        {(MBD.arrows as number[][]).map((a, i) => {
          const g = Math.hypot(a[3], a[4]); if (g < 0.04) return null;
          const p0 = mbW(a[0], a[1], mbH(a[0], a[1])), L = 2.2 * g;
          const p1: V3 = [p0[0] + (L * a[3]) / g, p0[1] + (L * a[4]) / g, p0[2]];
          return <Arrow key={i} p={pr.p(p0)} q={pr.p(p1)} color={C.second} w={5} head={16} o={oA} />;
        })}
        <Place p={pc} t="Chamonix" dx={-22} dy={-36} a="end" o={fin(f, tCham)} />
        <Place p={ps} t="Mont Blanc" dx={-22} dy={40} a="end" o={fin(f, tMB) * fin(f, tSum)} />
        <g opacity={fin(f, tTen) * fout(f, tDraw)}>
          <line x1={pc[0]} y1={pc[1]} x2={ps[0]} y2={ps[1]} stroke={C.gold} strokeWidth={5} strokeDasharray="14 10" />
        </g>
      </Svg>
      <GlobeFrame id="s15f" zoom={1} right={1} />
      <Svg>
        <Lbl x={1200} y={100} t="ETOPO terrain" c={C.key} s={T.key} o={fin(f, tETO)} />
        <Lbl x={1200} y={170} t="heights × 2" c={C.key} s={T.key} o={fin(f, tX2)} />
        <SideCallout f={f} lines="Chamonix ≈ 1035 m" at={[1200, 270]} appear={tCham + 4} target={[pc[0] + 10, pc[1] + 14]} s={T.key} bend={30} out={tDraw - 10} />
        <SideCallout f={f} lines="summit ≈ 4806 m" at={[1200, 350]} appear={tSum + 4} target={[ps[0] + 14, ps[1] + 14]} s={T.key} bend={-30} out={tDraw - 10} />
        <SideCallout f={f} lines="about 60 %" at={[1200, 720]} appear={tSixty} target={[pmax[0] + 10, pmax[1]]} s={T.calc} bend={40} />
        <SideCallout f={f} lines="≈ 10 km apart" at={[1200, 770]} appear={tTen + 6} out={tDraw - 10} target={[mix(pc[0], ps[0], 0.3) + 6, mix(pc[1], ps[1], 0.3) + 8]} s={T.key} ctl={[ps[0] + 10, ps[1] + 200]} />
        <Lbl x={1200} y={620} t="uphill, ⟂ contours" c={C.key} s={T.key} o={fin(f, tUp)} />
      </Svg>
      {/* K6 r1: right-hand sides only, from x 1200 (the left-hand sides reached back over the terrain to x 830) */}
      <CalcStack f={f} x={1190} y={420} size={56} rows={[
        { rhs: String.raw`4806-1035=3771\ \mathrm{m}`, at: tAvg },
        { rhs: String.raw`3771\div 10\,056\approx0.375`, at: tPct },
        { rhs: String.raw`\approx37.5\ \mathrm{m\ per\ 100\ m}`, at: tPct + 40, cont: true },
      ]} o={fout(f, tDraw - 6)} />
      <SourceBelow text="Terrain: ETOPO 2022 (NOAA) · imagery: Copernicus Sentinel-2 · 26 Sep 2023" pic={{ x: 0, y: 0, w: 1920, h: 820 }} x={80} w={1100} name="s15 src" />
    </Scene>
  );
};

// ================================================================ s16 water feels the gradient; the scale of a gradient
const AB: MapBox = boxAt(45.8, 8.5, 3.4, 80, 50, 680, 430);
const HB: MapBox = boxAt(29.5, 87.5, 9.0, 1120, 50, 720, 430);
const PA: Ax = { x: 1220, y: 650, w: 560, h: 150, xr: [24, 33], yr: [0, 6] };   // K6 r1: axis words folded into the ticks ("km", "°N")
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16_water_scale");
  const tWater = SS(k, 0), tRain = SS(k, 1), tScale = SS(k, 2), tMap = SS(k, 3), tBlocks = SS(k, 4), tPlain = AT(k, 5, "Ganges plain"), tPlat = AT(k, 5, "Tibetan plateau");
  const tEv = SS(k, 6), tBoth = SS(k, 7);
  const st = mbCam(f, k, [{ f: 0, tgt: [45.865, 6.87], dist: 44, az: 262, el: 40 }, { f: LEN(k), tgt: [45.86, 6.875], dist: 36, az: 258, el: 46 }]);
  const pr = hProjector(st, 1920, 1080, 0, 0);
  const oD = fout(f, tScale - 6, 16), oS = fin(f, tScale + 4, 16);
  const run = prog(f, tRain - 10, tScale - 10);
  const ev = SCL.everest_block as number[];
  const pe = axP(PA)(ev[0], (SCL.prof_h[(SCL.prof_lat as number[]).findIndex((x) => Math.abs(x - ev[0]) < 0.2)] ?? 3000) / 1000);
  return (
    <Scene>
      <HView3D st={st} x={0} y={0} w={1920} h={1080} o={oD}>
        <MontBlanc3D />
      </HView3D>
      <Svg o={oD}>
        {(MBD.drops as number[][][]).map((d, i) => {
          const n = Math.max(2, Math.round(d[0].length * run)), pts: Pt[] = [];
          for (let j = 0; j < n; j++) pts.push(pr.p(mbW(d[0][j], d[1][j], d[2][j])));
          const head = pts[pts.length - 1];
          return <g key={i} opacity={fin(f, tRain)}><path d={poly(pts)} fill="none" stroke={C.first} strokeWidth={4} strokeOpacity={0.8} />
            <circle cx={head[0]} cy={head[1]} r={8} fill="#9fd3ff" stroke={C.bg} strokeWidth={3} /></g>;
        })}
      </Svg>
      {oD > 0 ? <GlobeFrame id="s16f" zoom={oD} right={oD} /> : null}
      <Svg o={oD}>
        <Lbl x={1200} y={120} t="−∇h: steepest way down" c={C.key} s={T.key} o={fin(f, tRain)} />
        <Lbl x={1200} y={200} t="streams follow −∇h" c={C.key} s={T.floor} o={fin(f, tRain + 60)} />
      </Svg>
      <GeoMap id="s16a" B={AB} o={oS} frame={0.6}>
        {(P) => <>
          <GeoImg P={P} href={IMG("alps_slope.png")} box={SCL.alps_box} />
          <path d={linesPath(P, D.lines.alps_border)} fill="none" stroke={C.ink} strokeOpacity={0.6} strokeWidth={1.8} strokeDasharray="6 6" />
          <path d={linesPath(P, D.lines.alps_coast)} fill="none" stroke={C.ink} strokeOpacity={0.7} strokeWidth={1.8} />
        </>}
      </GeoMap>
      <GeoMap id="s16h" B={HB} o={oS * fin(f, tBlocks)} frame={0.6}>
        {(P) => <>
          <GeoImg P={P} href={IMG("him_blocks.png")} box={SCL.him_box} pixel />
          <path d={linesPath(P, D.lines.him_border)} fill="none" stroke={C.ink} strokeOpacity={0.6} strokeWidth={1.8} strokeDasharray="6 6" />
        </>}
      </GeoMap>
      <Svg o={oS}>
        <ColourBar x={800} y={150} w={220} lut={LUT_AMP} lo={0} hi={60} unit="%" title="slope" ticks={[{ v: 0, t: "0" }, { v: 30, t: "30" }, { v: 60, t: "60" }]} />
        <ColourBar x={800} y={380} w={220} lut={LUT_H} lo={0} hi={6.5} unit="km" title="height" ticks={[{ v: 0, t: "0" }, { v: 3, t: "3" }, { v: 6, t: "6" }]} o={fin(f, tBlocks)} />
        <Lbl x={100} y={580} t="points < 2 km apart" c={C.key} s={T.key} o={fin(f, tMap)} />
        <Lbl x={100} y={660} t="steepest ≈ 60 %" c={C.key} s={T.calc} o={fin(f, tMap + 30)} />
        <Lbl x={1120} y={575} t="blocks ≈ 35 km" c={C.key} s={T.key} o={fin(f, tBlocks)} />
        <Place p={mapP(HB)(EVEREST_LL[0], EVEREST_LL[1])} t="Everest" dx={18} dy={-32} o={fin(f, tEv)} />
        <g opacity={fin(f, tPlain)}>
          <Axes A={PA} xt={[26, 28, 30, 32]} yt={[0, 3, 6]} xf={(v) => `${v}°N`} yf={(v) => `${v} km`} />
          <Curve A={PA} xs={SCL.prof_lat} ys={(SCL.prof_h as number[]).map((h) => h / 1000)} c={C.key} w={6} upto={prog(f, tPlain, tPlat + 30)} />
        </g>
        <Lbl x={PA.x + 8} y={PA.y + PA.h - 30} t="≈ 50 m" c={C.key} s={T.floor} o={fin(f, tPlain + 10)} />
        <Lbl x={PA.x + PA.w - 10} y={PA.y - 24} t="≈ 4900 m" c={C.key} s={T.floor} a="end" o={fin(f, tPlat)} />
        {/* K6 r1: the slope readout sits under the plateau, inside the chart, with a short link to the rising flank (from the left of the
            chart it crossed the y axis and the "3" tick) */}
        <SideCallout f={f} lines="≈ 5 %" at={[1474, 768]} appear={tEv + 10} target={[pe[0] + 2, pe[1] + 4]} s={T.key} bend={12} />
        <Lbl x={100} y={780} t="both right, each for its scale" c={C.gold} s={T.key} o={fin(f, tBoth)} />
      </Svg>
      <SourceBelow text="Data: ETOPO 2022 (NOAA) · 60″ grid" pic={{ x: AB.x, y: AB.y, w: AB.w, h: AB.h }} w={680} o={oS} name="s16 src alps" />
      <SourceBelow text="Data: ETOPO 2022 (NOAA) · 20′ block means" pic={{ x: HB.x, y: HB.y, w: HB.w, h: HB.h }} w={720} o={oS * fin(f, tBlocks)} name="s16 src him" />
      <SourceBelow text="Terrain: ETOPO 2022 (NOAA) · imagery: Copernicus Sentinel-2 · 26 Sep 2023" pic={{ x: 0, y: 0, w: 1920, h: 820 }} x={80} w={1100} o={oD} name="s16 src mb" />
    </Scene>
  );
};
const EVEREST_LL: [number, number] = D.scale.everest;

export const SCENES_B: Record<string, React.FC> = {
  s09_gradient_field: S09, s10_directional: S10, s11_steepest: S11, s12_perpendicular: S12, s13_cases: S13, s14_spacing: S14, s15_mont_blanc: S15, s16_water_scale: S16,
};
void [Curve, LUT_AMP, LUT_H, CurvedLink, HillIcon, ThermoIcon, BaroIcon, Place, nf, GeoImg];
