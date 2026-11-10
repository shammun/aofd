// ch00_coordinates_moving scenes s13-s18: what a fixed barometer sees (the frozen-pattern ghost, τ defined), the change of
// variables ∂p/∂t = ∂p/∂τ − U·∇p (D44, skip chip B), the Plymouth numbers (ERA5 msl, centred difference, sphere gradient), what
// they mean (bars, the tracked-centre check), the recap and the series end card. Numbers from data/mv.json only.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Pt, textW } from "../house/kit/draw";
import { SourceBelow } from "../house/kit/frame";
import { AnimatedWindArrow } from "../house/kit/wind";
import { CurvedLink } from "../house/kit/extras";
import { Notebook } from "../house/kit/icons";
import { ramp } from "../house";
import {
  AT, Arrow, Ax, Axes, Barometer, BROWN, CI, CalcStack, CiaMap, D, D2R, HL, HOLD, K, Keyword, LEN, Lbl, Layered, MapBox, PBar, PLY, Place, Recall, Rider, SE, SS, Scene,
  SideCallout, SkipChip, SpeedBar, Svg, TRK, TeX, Train, Walker, XC, arcD, axP, axX, axY, boxAt, clamp, curveD, fin, fout, keepTime, lin, mapP, mix, prog, ringD, win, ParcelDot,
} from "./mv_lib";
import { EQ_S13, EQ_S14, EQ_S16 } from "./mv_eq";

const PL = CI.ply, U = CI.U as number[];
// ---------------------------------------------------------------- numbers on screen = the data (the render fails otherwise)
const CHECK_C: [string, number, number, number][] = [
  ["p23", PL.p3[0], 964.1, 0.05], ["p01", PL.p3[2], 956.5, 0.05], ["dpdt", PL.dpdt, -3.8, 0.05], ["along", PL.along, 0.061, 5e-4], ["UgP", PL.UgP, 3.2, 0.05],
  ["dpdtau", PL.dpdtau, -0.6, 0.05], ["dist", PL.dist_km, 123, 0.5], ["kmh", CI.spd * 3.6, 52.5, 0.05], ["calc1", (956.5 - 964.1) / 2, -3.8, 1e-9],
  ["calc2", 52.5 * 0.061, 3.2, 0.01], ["calc3", -3.8 + 3.2, -0.6, 1e-9], ["c23", CI.cmin[0], 954.9, 0.05], ["c01", CI.cmin[2], 954.0, 0.05],
  ["cchk", (CI.cmin[2] - CI.cmin[0]) / 2, -0.5, 0.05], ["bars", -0.6 - 3.2, -3.8, 1e-9], ["p00c", TRK[3][3], 954.5, 0.05], ["15", Math.round(CI.spd), 15, 0],
  ["14", Math.round(CI.vtm[0]), 14, 0],
];
CHECK_C.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
// the frozen-pattern ghost is the 23 UTC isobars slid rigidly along U (per-vertex flat shift); the builder's destination_point
// ghost at 1 h must agree to 0.02° (CHECK)
const slide = (lon: number, lat: number, km: number): [number, number] => {
  const a = CI.brg * D2R;
  return [lon + (km * Math.sin(a)) / (111.2 * Math.cos(lat * D2R)), lat + (km * Math.cos(a)) / 111.2];
};
{
  const g0 = CI.ghost[0][0].lines[0], g1 = CI.ghost[1][0].lines[0], q = slide(g0[0], g0[1], CI.spd * 3.6);
  if (Math.abs(q[0] - g1[0]) > 0.02 || Math.abs(q[1] - g1[1]) > 0.02) throw new Error(`CHECK ghost slide ${q} vs ${g1.slice(0, 2)}`);
}
const ghostPath = (P: (la: number, lo: number) => Pt, hrs: number) => (CI.ghost[0] as { lines: number[][] }[]).map((L) => L.lines.map((ln) => {
  let d = "";
  for (let i = 0; i < ln.length; i += 2) { const [lo, la] = slide(ln[i], ln[i + 1], CI.spd * 3.6 * hrs); const p = P(la, lo); d += `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`; }
  return d;
}).join("")).join("");
/** Plymouth's pressure at hour index h (2 = 23 UTC, 3 = 00, 4 = 01), linear between the hourly ERA5 values */
const pAt = (h: number) => { const q = clamp(h - 2, 0, 2); return q < 1 ? mix(PL.p3[0], PL.p3[1], q) : mix(PL.p3[1], PL.p3[2], q - 1); };
const SRC_PLY = "Data: ERA5 (Copernicus C3S) · 1–2 Nov 2023, hourly · Plymouth";

// ================================================================ s13 two observers; τ defined (D44 1)
const B13: MapBox = boxAt(50.0, -4.8, 4.6, 80, 40, 920, 720);
const P13 = { x: 80, y: 40, w: 920, h: 720 };
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = K("s13_tau");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10),
    t11 = SS(k, 11), t13 = SS(k, 13), t14 = SS(k, 14), t15 = SS(k, 15);
  const h = 2 + 2 * lin(f, t2 + 10, SE(k, 3));                    // 23 -> 01 UTC while S3-S4 speak (1 h ≈ 6 s)
  const hi = Math.floor(h), w = h - hi, cA = TRK[hi], cB = TRK[Math.min(9, hi + 1)];
  const P = mapP(B13), ply = P(PLY[0], PLY[1]);
  const parts = [{ t: String.raw`x'=x-U\,t,` }, { t: String.raw`\qquad \tau=t`, c: C.second }];
  if (parts.map((p) => p.t).join("").replace(/\s/g, "") !== EQ_S13.replace(/\s/g, "")) throw new Error("s13 parts drift from EQ_S13");
  return (
    <Scene>
      <CiaMap f={f} h={h} B={B13} field="msl" parts={0} id="cia13">
        {(Pm) => {
          const c = Pm(mix(cA[1], cB[1], w), mix(cA[2], cB[2], w));
          return <>
            <path d={ghostPath(Pm, h - 2)} fill="none" stroke={C.local} strokeWidth={3} strokeDasharray="12 8" opacity={fin(f, t2) * fout(f, t5 + 30, 20)} />
            <Rider x={c[0]} y={c[1]} s={0.85} o={fin(f, t2)} />
          </>;
        }}
      </CiaMap>
      <Svg>
        <Barometer x={ply[0] - 40} y={ply[1] - 46} r={32} hPa={pAt(h)} o={fin(f, 0)} />
        <circle cx={ply[0]} cy={ply[1]} r={9} fill={C.local} stroke={C.bg} strokeWidth={3} />
        <Place p={ply} t="Plymouth" r={0} dx={22} dy={30} o={fin(f, AT(k, 1, "Plymouth"))} />
        <PBar x={XC} y={90} />
        <Keyword f={f} text="a fixed barometer" at={[XC, 210]} appear={0} out={t4 - 18} s={T.floor} c={C.local} />
        <Keyword f={f} text="the storm arriving" at={[XC, 210]} appear={AT(k, 4, "the storm arriving")} s={T.floor} c={C.first} />
        <Keyword f={f} text="the storm changing" at={[XC, 270]} appear={AT(k, 4, "the storm changing")} s={T.floor} c={C.second} />
        <Keyword f={f} text="1. the fixed barometer" at={[XC, 350]} appear={t6} s={T.floor} c={C.local} />
        <Keyword f={f} text="p: pressure, t: time" at={[XC, 530]} appear={t8} out={t9 - 18} s={T.floor} />
        <Keyword f={f} text="2. a rider, moving at U" at={[XC, 530]} appear={t9} s={T.floor} c={C.second} />
        <Keyword f={f} text="frozen: no change at all" at={[XC, 820]} appear={t14} out={t15 - 18} s={T.floor} />
        <Keyword f={f} text="< 0 deepening · > 0 filling" at={[XC, 820]} appear={t15} s={T.floor} c={C.second} />
      </Svg>
      <TeX s={String.raw`\dfrac{\partial p}{\partial t}\Big|_{x\ \text{fixed}}`} x={XC} y={440} size={52} c={C.local} o={fin(f, t7)} />
      <Layered parts={parts} x={XC} y={612} size={56} layers={[{ t: [0], o: fin(f, AT(k, 10, "x prime")) }, { t: [1], o: fin(f, t11) }]} />
      <TeX s={String.raw`\dfrac{\partial p}{\partial\tau}\Big|_{x'\ \text{fixed}}`} x={XC} y={716} size={52} c={C.second} o={fin(f, t13)} />
      <SourceBelow text={SRC_PLY} pic={P13} w={920} name="s13 src" />
    </Scene>
  );
};

// ================================================================ s14 linking the barometer and the rider (D44 2-4), skip chip B
const prS = CI.ply.prof_s_km as number[], prP = CI.ply.prof_p as number[];
const pLo = Math.floor(Math.min(...prP) / 5) * 5, pHi = Math.ceil(Math.max(...prP) / 5) * 5;
const A14: Ax = { x: 220, y: 150, w: 740, h: 360, xr: [-300, 300], yr: [pLo, pHi] };
const yt14 = Array.from({ length: Math.round((pHi - pLo) / 10) + 1 }, (_, i) => pLo + i * 10).filter((v) => v <= pHi);
const pProf = (x: number) => { const q = (x - prS[0]) / (prS[1] - prS[0]), i = clamp(Math.floor(q), 0, prS.length - 2), w = q - i; return prP[i] + (prP[i + 1] - prP[i]) * clamp(w, 0, 1); };
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14_tau_derive");
  const t3 = SS(k, 3), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11), t12 = SS(k, 12), t13 = SS(k, 13),
    t14 = SS(k, 14), t15 = SS(k, 15), t16 = SS(k, 16);
  const sh = 52.5 * lin(f, t13, SE(k, 15));                       // the pattern slides by one hour of U (52.5 km) while S14-S16 speak
  const X = Array.from({ length: 121 }, (_, i) => -300 + i * 5).filter((x) => x - sh >= -300);
  const P = axP(A14), x0 = axX(A14)(0);
  const ps = (A14.h / (pHi - pLo)) * PL.along / (A14.w / 600);     // tangent slope px/px
  const p0 = P(0, pProf(-sh)), tg0: Pt = [p0[0] - 70, p0[1] + 70 * ps], tg1: Pt = [p0[0] + 70, p0[1] - 70 * ps];
  const xmin = prS[prP.indexOf(Math.min(...prP))] + sh;           // the low, riding with the pattern
  const rp = P(xmin, pProf(xmin - sh));
  const parts = [{ t: String.raw`\dfrac{\partial p}{\partial t}`, u: { w: String.raw`\text{barometer}`, c: C.local } }, { t: "=" },
    { t: String.raw`\dfrac{\partial p}{\partial\tau}`, u: { w: String.raw`\text{storm changing}`, c: C.second } }, { t: String.raw`-\mathbf U\cdot\nabla p`, u: { w: String.raw`\text{sliding past}`, c: C.first } }];
  if (parts.map((p) => p.t).join("").replace(/\s/g, "") !== EQ_S14.replace(/\s/g, "")) throw new Error("s14 parts drift from EQ_S14");
  return (
    <Scene>
      <Svg>
        <Axes A={A14} xt={[-150, 0, 150, 300]} yt={yt14} xl="km along the storm's path" yl="pressure (hPa)" />
        <line x1={x0} y1={A14.y} x2={x0} y2={A14.y + A14.h} stroke={C.local} strokeWidth={3} strokeDasharray="10 8" />
        <path d={curveD(A14, X, X.map((x) => pProf(x - sh)))} fill="none" stroke={C.local} strokeWidth={6} />
        <Barometer x={x0} y={95} r={34} hPa={pProf(-sh)} />
        <circle cx={p0[0]} cy={p0[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        <line x1={tg0[0]} y1={tg0[1]} x2={tg1[0]} y2={tg1[1]} stroke={C.gold} strokeWidth={6} opacity={fin(f, AT(k, 13, "how fast the pressure rises"))} />
        {/* slope label removed: the tangent line shows the gradient visually; label overlapped sliding C.local curve at sh>11km */}
        <Rider x={rp[0]} y={rp[1] - 12} s={0.8} o={fin(f, t3)} />
        <Arrow p={[rp[0] + 30, rp[1] - 90]} q={[rp[0] + 150, rp[1] - 90]} color={C.second} w={8} head={28} o={fin(f, t3)} />
        <Keyword f={f} text="how are the two rates linked?" at={[XC, 120]} appear={0} out={t3 - 18} s={T.floor} />
        <Keyword f={f} text="1. the rider: a traveller at U" at={[XC, 120]} appear={t3} out={t5 - 18} s={T.floor} c={C.second} />
        <Keyword f={f} text="3. move it across the =" at={[XC, 425]} appear={t8} out={t16 - 18} s={T.floor} c={C.gold} />
        <Keyword f={f} text="$\nabla p$ · cross product movie" at={[XC, 690]} appear={AT(k, 5, "where grad p")} out={t8 - 18} s={T.floor} c={C.gold} />
        <Keyword f={f} text="speed $\times$ slope along $\mathbf U$" at={[XC, 755]} appear={t13} out={t16 - 18} s={T.floor} c={C.first} />
        <Keyword f={f} text="what to keep" at={[XC, 755]} appear={t16} c={C.gold} />
        <SkipChip f={f} k={k} to={keepTime("s14_tau_derive")} />
        <CurvedLink f={f} from={[XC + 520, 290]} to={[XC + 560, 455]} start={t8 + 10} end={t10} bend={-80} />
      </Svg>
      {/* Part 1 lessons B4: the derivation rows leave at the keep line; the keep picture is the barometer, the sliding pattern and the
          labelled equation (barometer = storm changing − sliding past) */}
      <CalcStack f={f} x={XC} y={150} size={52} maxLines={2} o={fout(f, t16 - 12)} rows={[
        { rhs: String.raw`\dfrac{dp}{dt}=\dfrac{\partial p}{\partial t}+\mathbf U\cdot\nabla p`, at: AT(k, 5, "With the dot product"), h: 120 },
        { rhs: String.raw`\dfrac{\partial p}{\partial\tau}=\dfrac{\partial p}{\partial t}+\mathbf U\cdot\nabla p`, at: AT(k, 7, "So partial p by partial tau"), h: 120 },
      ]} />
      {/* remake 2026-11-07 (R16; series audit §3a): the traveller's rate from the derivatives movie (S4), grad p from the cross product movie (S5) */}
      <Recall f={f} tex={String.raw`\dfrac{dT}{dt}=\dfrac{\partial T}{\partial t}+\text{speed}\times\text{slope}`} name="the traveller's rate"
        lab="from the derivatives movie:" x={XC} y={470} size={46} appear={AT(k, 4, "derivatives movie")} out={t8 - 12} />
      <Layered parts={parts} x={960} y={620} size={64} layers={[{ t: "all", o: fin(f, t9) }, { t: [], u: [0], o: fin(f, t11) }, { t: [], u: [2], o: fin(f, t12) }, { t: [], u: [3], o: fin(f, t15) }]} />
      <TeX s={String.raw`\tfrac{\cancel{\text{km}}}{\text{h}}\times\tfrac{\text{hPa}}{\cancel{\text{km}}}=\tfrac{\text{hPa}}{\text{h}}`} x={960} y={820} size={48} o={win(f, t14, t16 - 18)} />
    </Scene>
  );
};

// ================================================================ s15 the Plymouth numbers (D44 5)
const B15: MapBox = boxAt(50.0, -4.9, 3.6, 80, 40, 920, 480);
const A15: Ax = { x: 260, y: 600, w: 560, h: 150, xr: [-1, 1], yr: [955, 966] };
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_plymouth");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8);
  const P = mapP(B15), ply = P(PLY[0], PLY[1]), c0 = P(TRK[3][1], TRK[3][2]);
  const gd = PL.gdir * D2R, ud = CI.brg * D2R;
  const gTip: Pt = [ply[0] + Math.sin(gd) * 115, ply[1] - Math.cos(gd) * 115], uTip: Pt = [ply[0] + Math.sin(ud) * 175, ply[1] - Math.cos(ud) * 175];
  const tP23 = AT(k, 1, "nine hundred and sixty four"), tP01 = AT(k, 1, "nine hundred and fifty six");
  const G = axP(A15), pts = [[-1, PL.p3[0], tP23], [0, PL.p3[1], tP01], [1, PL.p3[2], tP01]] as [number, number, number][];
  return (
    <Scene>
      <CiaMap f={f} h={3} B={B15} field="msl" parts={0} id="cia15">
        {() => <>
          <line x1={c0[0]} y1={c0[1]} x2={ply[0]} y2={ply[1]} stroke={C.gold} strokeWidth={4} strokeDasharray="12 8" opacity={fin(f, t3)} />
          <circle cx={c0[0]} cy={c0[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        </>}
      </CiaMap>
      <Svg>
        <Barometer x={ply[0] - 52} y={ply[1] - 40} r={28} hPa={PL.p3[1]} />
        <circle cx={ply[0]} cy={ply[1]} r={9} fill={C.local} stroke={C.bg} strokeWidth={3} />
        <Place p={ply} t="Plymouth" r={0} dx={22} dy={40} />
        <Place p={c0} t="954.5 hPa" r={0} dx={-18} dy={36} a="end" o={fin(f, t3)} />
        <Place p={[(c0[0] + ply[0]) / 2, (c0[1] + ply[1]) / 2]} t="≈ 123 km" r={0} dx={-18} dy={-24} a="end" o={fin(f, AT(k, 3, "a hundred and twenty three"))} />
        <g opacity={fin(f, t4)}>
          <Arrow p={ply} q={gTip} color={C.local} w={8} head={28} />
          <Arrow p={ply} q={uTip} color={C.second} w={8} head={28} />
          <path d={arcD(ply, 70, 90 - PL.gdir, 90 - CI.brg)} fill="none" stroke={C.gold} strokeWidth={4} />
        </g>
        {/* Plymouth's barometer, 23 -> 01 UTC (ERA5, bilinear at the town); the gold chord is the centred difference */}
        <Axes A={A15} xt={[-1, 0, 1]} yt={[956, 960, 964]} xf={(v) => `${["23", "00", "01"][v + 1]} UTC`} yl="hPa" />
        <path d={pts.filter(([, , a]) => f >= a).map(([x, p], i) => `${i ? "L" : "M"}${G(x, p)[0].toFixed(1)} ${G(x, p)[1].toFixed(1)}`).join("")} fill="none" stroke={C.neg} strokeWidth={6} />
        {pts.map(([x, p, a], i) => <circle key={i} cx={G(x, p)[0]} cy={G(x, p)[1]} r={9} fill={C.neg} stroke={C.bg} strokeWidth={3} opacity={fin(f, a)} />)}
        <Lbl x={G(-1, PL.p3[0])[0] + 120} y={G(-1, PL.p3[0])[1] - 6} t="964.1" c={C.neg} s={T.floor} o={fin(f, tP23)} />
        <Lbl x={G(1, PL.p3[2])[0] + 20} y={G(1, PL.p3[2])[1] - 6} t="956.5" c={C.neg} s={T.floor} o={fin(f, tP01)} />
        <line x1={G(-1, PL.p3[0])[0]} y1={G(-1, PL.p3[0])[1]} x2={G(1, PL.p3[2])[0]} y2={G(1, PL.p3[2])[1]} stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" opacity={fin(f, t2)} />
        <PBar x={XC} y={90} />
        <Keyword f={f} text="Plymouth, around midnight" at={[XC, 210]} appear={0} out={t4 - 18} s={T.floor} />
        <SideCallout f={f} lines="0.061 hPa/km along U" at={[XC + 30, 210]} appear={AT(k, 4, "zero point zero six one")} target={[gTip[0] + 4, gTip[1] - 14]} s={T.floor} c={C.local}
          ctl={[820, 90]} />
        <Keyword f={f} text="the storm's own change" at={[XC, 740]} appear={t7} s={T.floor} c={C.second} />
      </Svg>
      <TeX s={String.raw`\nabla p`} x={gTip[0] - 10} y={gTip[1] - 34} size={44} c={C.local} ax={1} o={fin(f, t4)} halo />
      <TeX s={String.raw`\mathbf U`} x={uTip[0] + 14} y={uTip[1] + 30} size={44} c={C.second} o={fin(f, t4)} halo />
      <CalcStack f={f} x={XC} y={300} size={44} maxLines={3} rows={[
        { rhs: String.raw`\dfrac{\partial p}{\partial t}\approx\dfrac{956.5-964.1}{2\ \text{h}}\approx-3.8\ \text{hPa/h}`, at: AT(k, 2, "about minus three point eight"), h: 110 },
        { rhs: String.raw`|\nabla p|\approx0.062\ \text{hPa/km},\ \text{towards }63^\circ`, at: t4, c: C.local },
        { rhs: String.raw`\text{along }71^\circ:\ 0.062\times\cos8^\circ\approx0.061`, at: AT(k, 4, "zero point zero six one"), c: C.local, cont: true,
          glow: HL(f, AT(k, 4, "zero point zero six one")) },
        { rhs: String.raw`|\mathbf U|\approx14.58\ \text{m/s}\times3.6\approx52.5\ \text{km/h}`, at: AT(k, 5, "fifty two and a half") },
        { rhs: String.raw`\mathbf U\cdot\nabla p\approx52.5\times0.061\approx3.2\ \text{hPa/h}`, at: AT(k, 6, "the storm's speed times") },
        { rhs: String.raw`\dfrac{\partial p}{\partial\tau}\approx-3.8+3.2=-0.6\ \text{hPa/h}`, at: AT(k, 8, "Adding"), h: 110, c: C.second,
          glow: HL(f, AT(k, 8, "minus zero point six")) },
      ]} />
      <SourceBelow text={SRC_PLY} pic={{ x: 80, y: 40, w: 920, h: 772 }} w={920} name="s15 src" />
    </Scene>
  );
};

// ================================================================ s16 what the numbers mean (bars), the tracked-centre check
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16_meaning");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const Y0 = 130, SCL = 140;                                        // the zero line and px per hPa/h (Must 14: the bars get the whole picture zone)
  const bars = [
    { x: 160, v: PL.dpdt, c: C.local, val: "−3.8", name: "barometer", a: AT(k, 0, "three point eight") },
    { x: 500, v: -PL.UgP, c: C.first, val: "−3.2", name: "sliding past", a: AT(k, 0, "three point two") },
    { x: 860, v: PL.dpdtau, c: C.second, val: "−0.6", name: "storm changing", a: AT(k, 0, "zero point six") },
  ];
  const BW = 80;
  return (
    <Scene>
      <Svg>
        <line x1={140} y1={Y0} x2={980} y2={Y0} stroke={C.muted} strokeWidth={3} />
        <Lbl x={106} y={420} t="hPa per hour" c={C.muted} s={T.floor} a="middle" rot={-90} b={false} />
        {bars.map((b, i) => {
          const hgt = Math.abs(b.v) * SCL, o = fin(f, b.a);
          // labels beside the bars, never on them: right of the bar's lower end (the short bar: under its end, right-aligned)
          const lx = i < 2 ? b.x + BW + 24 : b.x + BW, ly = i < 2 ? Y0 + hgt - 60 : Y0 + hgt + 50, an = i < 2 ? "start" : "end";
          return <g key={i} opacity={o}>
            <rect x={b.x} y={Y0} width={BW} height={hgt} fill={b.c} opacity={0.85} />
            <Lbl x={lx} y={ly} t={b.val} c={b.c} s={T.key} a={an as "start" | "end"} />
            <Lbl x={lx} y={ly + 56} t={b.name} c={b.c} s={T.floor} a={an as "start" | "end"} />
          </g>;
        })}
        <Keyword f={f} text="mostly: the storm arriving" at={[XC, 300]} appear={t1} s={T.floor} c={C.first} />
        <Keyword f={f} text="believable?" at={[XC, 400]} appear={t2} out={t3 - 18} s={T.floor} c={C.gold} />
        <Keyword f={f} text="check: the tracked centre" at={[XC, 400]} appear={t3} s={T.floor} c={C.gold} />
        <CurvedLink f={f} from={[XC - 14, 510]} to={[bars[2].x + BW + 10, Y0 + 40]} start={AT(k, 4, "about minus half") + 6} bend={40} />
        <Keyword f={f} text="same idea: advection" at={[XC, 650]} appear={t5} s={T.floor} />
        <Keyword f={f} text="later: reading maps over time" at={[XC, 730]} appear={t6} s={T.floor} />
      </Svg>
      <TeX s={EQ_S16} x={XC} y={180} size={56} o={fin(f, 0)} />
      <TeX s={String.raw`\dfrac{954.0-954.9}{2\ \text{h}}\approx-0.5\ \text{hPa/h}`} x={XC} y={515} size={48} o={fin(f, AT(k, 4, "fell from"))} />
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 2 Nov 2023 · Plymouth and the tracked centre" pic={{ x: 80, y: 40, w: 920, h: 720 }} w={920} name="s16 src" />
    </Scene>
  );
};

// ================================================================ s17 recap (one beat per sentence; each beat leaves ≥ 8 frames before the next)
const RB: MapBox = boxAt(50.3, -4.0, 8.0, 160, 140, 760, 560);
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_recap");
  // Part 1 lessons D3: each beat at full strength until ITS sentence ends; the next enters 8 frames after its sentence starts
  // remake 2026-11-07 (R3): the teaser is two sentences (S9, S10); its picture and its words stay to the end of the scene
  const n = 11, beat = (j: number) => (j < n - 2 ? win(f, SS(k, j) + (j ? 8 : 0), SE(k, j), 10) : fin(f, SS(k, j) + 8));
  const O: Pt = [520, 430];
  const sRel = CI.pts.N.s as number[], gRel = CI.pts.N.g as number[];
  const pic = (j: number) => {
    const o = beat(j);
    if (o <= 0) return null;
    return <g key={j} opacity={o}>
      {j === 0 ? <><line x1={100} y1={514} x2={980} y2={514} stroke={C.local} strokeWidth={6} /><Train x={300} y={500} w={360} /><Walker x={480} y={388} s={0.9} />
        <Arrow p={[330, 240]} q={[630, 240]} color={C.second} /></> : null}
      {j === 1 ? <><circle cx={O[0]} cy={O[1] - 150 + 260 * lin(f, SS(k, 1), SS(k, 1) + 60) * lin(f, SS(k, 1), SS(k, 1) + 60)} r={18} fill={C.key} />
        <Arrow p={[O[0] + 60, O[1] - 60]} q={[O[0] + 60, O[1] + 80]} color={BROWN} /></> : null}
      {j === 2 || j === 3 ? <><rect x={O[0] - 70} y={O[1] - 70} width={140} height={140} fill={C.first} fillOpacity={0.18} stroke={C.first} strokeWidth={5} />
        <Arrow p={[O[0] + 80, O[1]]} q={[O[0] + 260, O[1]]} color={C.first} /></> : null}
      {j === 5 ? <>{(() => { const s = 12, o0: Pt = [O[0] + 160, O[1] - 160], gv: Pt = [gRel[0] * s, -gRel[1] * s], mu: Pt = [-U[0] * s, U[1] * s];
        const gt: Pt = [o0[0] + gv[0], o0[1] + gv[1]];
        return <><Arrow p={o0} q={gt} color={C.first} /><Arrow p={gt} q={[gt[0] + mu[0], gt[1] + mu[1]]} color={C.second} dash="14 10" />
          <Arrow p={o0} q={[o0[0] + sRel[0] * s, o0[1] - sRel[1] * s]} color={C.key} /></>; })()}</> : null}
      {j === 7 ? <><Barometer x={O[0]} y={O[1]} r={90} hPa={mix(964, 956, lin(f, SS(k, 7), SS(k, 8)))} /></> : null}
      {j === 8 ? <>{[[PL.dpdt, C.local, 220], [-PL.UgP, C.first, 470], [PL.dpdtau, C.second, 720]].map(([v, c, x]) =>
        <rect key={x as number} x={x as number} y={200} width={90} height={Math.abs(v as number) * 120} fill={c as string} opacity={0.85} />)}
        <line x1={180} y1={200} x2={860} y2={200} stroke={C.muted} strokeWidth={3} /></> : null}
      {j === 9 ? <><circle cx={O[0]} cy={O[1]} r={250} fill="#22304a" stroke={C.local} strokeWidth={3} />
        <path d={`M ${O[0] - 200} ${O[1] + 40} Q ${O[0] - 20} ${O[1] - 240} ${O[0] + 200} ${O[1] + 60}`} fill="none" stroke={C.gold} strokeWidth={7} />
        <path d={`M ${O[0] - 200} ${O[1] + 40} Q ${O[0]} ${O[1] - 40} ${O[0] + 200} ${O[1] + 60}`} fill="none" stroke={C.local} strokeWidth={6} strokeDasharray="12 8" />
        <circle cx={O[0] - 200} cy={O[1] + 40} r={10} fill={C.gold} /><circle cx={O[0] + 200} cy={O[1] + 60} r={10} fill={C.gold} /></> : null}
    </g>;
  };
  const txt: [number, string, string?][] = [[1, "accelerations unchanged", "same 9.8 m/s², same forces"], [2, "acceleration = local + advection"], [3, "pieces differ, the sum doesn't", "−4.0 + 5.4 = 0 + 1.4"],
    [4, "Ciarán: ≈ 15 m/s, east-north-east"], [5, "storm-relative wind"], [6, "average spin ≈ 14 m/s, both frames"],
    [7, "a fixed barometer's rate =", "storm changing − sliding past"], [8, "Plymouth: −3.8 = −0.6 − 3.2 hPa/h", "mostly the storm arriving"], [9, "Part 6: great circles, rhumb lines"]];
  const oT10 = beat(10);
  return (
    <Scene>
      <Svg>{Array.from({ length: n }, (_, j) => pic(j))}</Svg>
      <CiaMap f={f} h={6} B={RB} o={beat(4)} id="ciaR4">
        {(P) => { const c = P(CI.c03[0], CI.c03[1]); return <Arrow p={c} q={[c[0] + U[0] * 9, c[1] - U[1] * 9]} color={C.second} />; }}
      </CiaMap>
      <CiaMap f={f} h={6} B={RB} o={beat(6)} id="ciaR6">
        {(P) => <path d={ringD(P)} fill="none" stroke={C.first} strokeWidth={6} />}
      </CiaMap>
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 2 Nov 2023" pic={{ x: 160, y: 140, w: 760, h: 560 }} w={760} o={Math.max(beat(4), beat(6))} name="s17 src" />
      <Svg><SpeedBar x={XC} y={780} o={Math.max(beat(4), beat(6))} /></Svg>
      <Svg>
        {txt.map(([j, a, b]) => <g key={j} opacity={beat(j)}><Lbl x={XC} y={360} t={a} c={C.key} s={T.floor} />{b ? <Lbl x={XC} y={440} t={b} c={C.gold} s={T.floor} /> : null}</g>)}
        <Lbl x={XC} y={440} t="flights cross Greenland" c={C.gold} s={T.floor} o={oT10} />
      </Svg>
      <TeX s={String.raw`x=x'+U\,t,\qquad u=u'+U`} x={XC} y={360} size={56} o={beat(0)} />
      {/* Part 1 lessons C1: the recap's v′ = v − U set in KaTeX (was a sans label) */}
      <TeX s={String.raw`\mathbf v'=\mathbf v-\mathbf U`} x={XC} y={440} size={T.floor + 4} c={C.gold} o={beat(5)} />
      <TeX s={String.raw`\dfrac{Du}{Dt}=\dfrac{\partial u}{\partial t}+\mathbf v\cdot\nabla u`} x={XC} y={480} size={52} o={beat(2)} />
    </Scene>
  );
};

// ================================================================ s18 the series end card (maths ending, HOUSE_STYLE §3)
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_end");
  const t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const thumb = (x: number, i: number) => (
    <g key={i} opacity={0.75}>
      <rect x={x - 150} y={70} width={300} height={170} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
      {/* Part 1 lessons B5: icons >= 20 px inside the box (y 70-240, x ± 150): the rails were 18 px from the bottom and 20 from the sides */}
      {i === 0 ? <><line x1={x - 124} y1={196} x2={x + 124} y2={196} stroke={C.local} strokeWidth={3} /><rect x={x - 90} y={146} width={150} height={44} rx={8} fill="#3a4766" stroke={C.local} strokeWidth={3} />
        <line x1={x - 124} y1={214} x2={x + 124} y2={214} stroke={C.local} strokeWidth={3} /><line x1={x - 90} y1={110} x2={x + 60} y2={110} stroke={C.second} strokeWidth={3} /></> : null}
      {i === 1 ? <><Arrow p={[x - 90, 210]} q={[x + 40, 130]} color={C.local} w={5} head={18} /><Arrow p={[x + 40, 130]} q={[x - 60, 100]} color={C.second} w={5} head={18} dash="10 6" />
        <Arrow p={[x - 90, 210]} q={[x - 62, 106]} color={C.key} w={5} head={18} /></> : null}
      {i === 2 ? <><circle cx={x - 20} cy={155} r={60} fill="none" stroke={C.first} strokeWidth={4} /><circle cx={x - 20} cy={155} r={6} fill={C.gold} />
        <Arrow p={[x - 20, 155]} q={[x + 110, 115]} color={C.second} w={5} head={18} /></> : null}
      {i === 3 ? <Barometer x={x} y={155} r={58} hPa={958} /> : null}
    </g>
  );
  const rel = ["vectors and index notation", "dot product", "cross product", "derivatives and Taylor series", "gradient", "contour maps", "curl", "material derivative", "Coriolis", "reading weather maps"];
  const COLX = [200, 1000], ROWY = (r: number) => 648 + r * 48;
  rel.forEach((t, i) => { if (COLX[Math.floor(i / 5)] + textW(t, T.floor) > (COLX[Math.floor(i / 5) + 1] ?? 1840) - 10) throw new Error(`end card: "${t}" too wide`); });
  return (
    <Scene>
      {/* remake 2026-11-07 (R3): the picture fades out with the music over the 2.5-s silent hold (= Parts 2 and 4) */}
      <Svg o={1 - ramp(f, LEN(k) - HOLD, LEN(k) - 4)}>
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
    </Scene>
  );
};

export const SCENES_C: Record<string, React.FC> = {
  s13_tau: S13, s14_tau_derive: S14, s15_plymouth: S15, s16_meaning: S16, s17_recap: S17, s18_end: S18,
};
void [D, axY, prog, Place];
