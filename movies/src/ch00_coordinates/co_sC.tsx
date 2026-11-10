// ch00_coordinates scenes s31-s47: map projections (gores -> plate carree -> Mercator morph, area, Equal Earth with the Sep 2026
// ERA5 anomaly), the polar view and the 10 hPa polar vortex (NCEP/NCAR R1, 21 Jan 2026), rotation of axes and the rotation
// matrix, along/across a coast (HRRR 20 UTC, CO-OPS gauges), Galilean frames (train, ball) and Storm Ciaran (ERA5, tracked by
// continuity), the recap and the series end card. Projected coordinates come from fluidpy.geo.mapproj via co.json; morphs only
// interpolate the same points between two projections. Numbers from data/co.json only.
import React from "react";
import { useCurrentFrame } from "remotion";
import { PoleThermometer } from "../house";
import { C, T } from "../house/kit/type";
import { Band, Dash, Pt, pulse, textW } from "../house/kit/draw";
import { CalcStack, Layered, Part, TeX } from "../house/kit/tex";
import { Keyword } from "../house/kit/notes";
import { CurvedLink } from "../house/kit/extras";
import { Callout, SourceBelow } from "../house/kit/frame";
import { AnimatedWindArrow, FlowParticles } from "../house/kit/wind";
import { Notebook } from "../house/kit/icons";
import {
  AT, Arrow, Ax, Axes, BREST, BROWN, Balloon, Barometer, ClockText, ColourBar, Curve, D, D2R, GeoImg, GeoMap, HouseIcon, IMGS, K, LEN, LUT_BAL, Lbl, MapBox,
  SS, SE, Scene, SideCallout, SpeedBar, Svg, Train, Walker, ArcHead, arcD, axP, boxAt, clamp, fin, fout, linesPath, mapP, mix, nf, poly, prog, win, xyMix, zoomBox,
} from "./co_lib";
import { EQ_S31, EQ_S32, EQ_S33, EQ_S37, EQ_S38, EQ_S39, EQ_S41, EQ_S42, EQ_S43, EQ_S45 } from "./co_eq";

const PJ = D.proj, VX = D.vortex, CO = D.coast, CI = D.ciaran, PL = D.plane;
const cutAt = (s: string, at: string): string[] => { if (!s.includes(at)) throw new Error(`cutAt: ${at} not in ${s}`); return s.split(at); };
const CHECK_C: [string, number, number, number][] = [
  ["k Brest", PJ.k[0], 1.5, 0.01], ["k Sval", PJ.k[1], 4.9, 0.002], ["areal 60", PJ.areal[0], 4, 1e-6], ["areal Sval", PJ.areal[1], 24, 0.01],
  ["Af/Gl", PJ.areas_Mkm2[1] / PJ.areas_Mkm2[0], 14, 0.5], ["omega60", PJ.ee_omega60[0], 30, 1.5], ["vortex lat", VX.c[0], 72.9, 0.01], ["vortex z", VX.cz / 1e3, 28.6, 0.01],
  ["z30", VX.z30 / 1e3, 30.7, 0.03], ["cb sw", CO.cb_sw, 329, 0.2], ["sp F", CO.spF, 33, 0.1], ["al F", CO.alF, 9, 0.4], ["ac F", CO.acF, -32, 0.45], ["ac S", CO.acS, 11.5, 0.01],
  ["d FS", CO.d_km, 150, 15], ["U", CI.spd, 15, 0.45], ["S", CI.S, 19, 0.2], ["N", CI.N, 8, 0.4], ["vtm g", CI.vtm[0], 14, 0.15], ["vtm s", CI.vtm[1], 14, 0.25],
  ["vrm g", CI.vrm[0], -6, 0.05], ["vrm s", CI.vrm[1], -6, 0.15], ["gust", CI.gust_kt, 84, 0], ["gust kmh", CI.gust_kt * 1.852, 156, 0.5], ["dpdt", CI.ply.dpdt, -3.8, 0.03],
  ["slide", CI.ply.slide, -3.2, 0.02], ["resid", CI.ply.resid, -0.6, 0.02], ["rot30 x", PL.rot30[0], 8.7, 0.04], ["rot30 y", PL.rot30[1], -5, 1e-9],
  ["ratP", VX.ratP, 1.9, 0.05], ["ratC", VX.ratC, 0.4, 0.05],   // fix loop 1 (Should 10): s36 radial ÷ tangential bars
];
CHECK_C.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
const BMSRC = "Image: NASA Blue Marble NG · coast: Natural Earth";

// ---------------------------------------------------------------- projected world maps
type PV = { cx: number; cy: number; s: number };
const pv = (v: PV) => (x: number, y: number): Pt => [v.cx + x * v.s, v.cy - y * v.s];
const flatD = (p: (x: number, y: number) => Pt, flat: number[]) => { let d = ""; for (let i = 0; i < flat.length; i += 2) { const q = p(flat[i], flat[i + 1]); d += `${i ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`; } return d; };
/** the coastlines in projection a mixed towards projection b by t */
const Coast: React.FC<{ v: PV; a: string; b?: string; t?: number; o?: number; w?: number }> = ({ v, a, b, t = 0, o = 0.85, w = 1.8 }) => {
  const p = pv(v);
  return <path d={(PJ.coast as Record<string, number[]>[]).map((c) => flatD(p, b && t > 0 ? xyMix(c[a], c[b], t) : c[a])).join("")} fill="none" stroke={C.key} strokeOpacity={o} strokeWidth={w} />;
};
/** a projection's Blue Marble raster placed by its own extent */
const Raster: React.FC<{ v: PV; kind: string; o?: number; ext: [number, number]; id: string; masked?: boolean }> = ({ v, kind, o = 1, ext, id, masked = false }) => {
  if (o <= 0) return null;
  const p = pv(v), a = p(-ext[0], ext[1]), b = p(ext[0], -ext[1]);
  return <g opacity={o}>
    {masked ? <defs><mask id={`rm_${id}`}><image href={IMGS.bmA(kind)} x={a[0]} y={a[1]} width={b[0] - a[0]} height={b[1] - a[1]} preserveAspectRatio="none" /></mask></defs> : null}
    <image href={IMGS.bm(kind)} x={a[0]} y={a[1]} width={b[0] - a[0]} height={b[1] - a[1]} preserveAspectRatio="none" mask={masked ? `url(#rm_${id})` : undefined} />
  </g>;
};
const EXT = PJ.ext as Record<string, [number, number]>;

// ================================================================ s31 plate carrée: the globe peeled and stretched
const V31: PV = { cx: 520, cy: 400, s: 138 };
const S31: React.FC = () => {
  const f = useCurrentFrame(), k = K("s31_plate_carree");
  const tPeel = AT(k, 0, "orange peel"), tPC = SS(k, 1), tData = SS(k, 2), tPar = SS(k, 3), tK = SS(k, 4), tB = SS(k, 5), tS = SS(k, 6), tNS = SS(k, 7);
  const m = prog(f, tPC, tPC + 75);
  const rg = fin(f, 0, 10) * (1 - m), rp = m;
  const tis = fin(f, tPar);
  const p = pv(V31);
  const iB = 1, iS = 2;
  const ct = (i: number): Pt => { const L = PJ.tissot.pc[i] as number[]; let x = 0, y = 0; for (let j = 0; j < L.length; j += 2) { x += L[j]; y += L[j + 1]; } return p((2 * x) / L.length, (2 * y) / L.length); };
  const eq = cutAt(EQ_S31, String.raw`,\qquad k=`);
  return (
    <Scene>
      <Svg>
        <defs><clipPath id="s31c"><rect x={V31.cx - Math.PI * V31.s} y={V31.cy - (Math.PI / 2) * V31.s - 4} width={2 * Math.PI * V31.s} height={Math.PI * V31.s + 8} /></clipPath></defs>
        <rect x={V31.cx - Math.PI * V31.s} y={V31.cy - (Math.PI / 2) * V31.s} width={2 * Math.PI * V31.s} height={Math.PI * V31.s} fill="#141b2c" opacity={rp} />
        <Raster v={V31} kind="go" ext={EXT.go} id="s31g" masked o={rg} />
        <Raster v={V31} kind="pc" ext={EXT.pc} id="s31p" o={rp} />
        <g clipPath="url(#s31c)"><Coast v={V31} a="go" b="pc" t={m} /></g>
        <g opacity={tis}>{(PJ.tissot.pc as number[][]).map((L, i) => <path key={i} d={flatD(p, L) + "Z"} fill={C.gold} fillOpacity={0.25} stroke={C.gold} strokeWidth={3} />)}</g>
        {/* fix loop 1 (Must 6): the ellipses now sit at Brest and Svalbard (data fix: tissot_ellipses units); the column is ordered
            like the targets (Svalbard is higher on the map) and the links leave from each line's left edge, so they never cross */}
        <SideCallout f={f} lines="≈ 4.9 ×" at={[1150, 470]} appear={tS} target={ct(iS)} c={C.gold} s={54} bend={30} />
        <SideCallout f={f} lines="1/0.66 ≈ 1.5 ×" at={[1150, 590]} appear={tB} target={ct(iB)} c={C.gold} s={54} bend={30} />
        <Keyword f={f} text="flattening stretches" at={[1150, 330]} s={T.floor} appear={AT(k, 0, "stretches")} out={tData - 18} />
        <Keyword f={f} text="how weather data arrive" at={[1150, 330]} s={T.floor} appear={tData} out={tPar - 18} />
        <Keyword f={f} text="every parallel as long" at={[1150, 330]} s={T.floor} appear={tPar} out={tB - 18} />
        <Lbl x={1150} y={386} t="as the equator" c={C.key} s={T.floor} o={win(f, tPar + 8, tB - 18)} />
        <Keyword f={f} text="shapes squashed near the poles" at={[1150, 720]} s={T.floor} appear={tNS} />
        <Keyword f={f} text="peel" at={[V31.cx, V31.cy - (Math.PI / 2) * V31.s - 50]} a="middle" s={T.floor} appear={tPeel} out={tPC - 18} />
      </Svg>
      <TeX s={eq[0]} x={1150} y={130} size={64} o={fin(f, tPC)} />
      <TeX s={String.raw`k=${eq[1]}`} x={1150} y={240} size={64} c={C.gold} o={fin(f, tK)} />
      <SourceBelow text={BMSRC} pic={{ x: 80, y: 180, w: 880, h: 440 }} w={880} name="s31 src" />
    </Scene>
  );
};

// ================================================================ s32 Mercator: north-south stretched by the same 1/cos φ
const V32a: PV = V31, V32b: PV = { cx: 520, cy: 430, s: 120 };
const S32: React.FC = () => {
  const f = useCurrentFrame(), k = K("s32_mercator");
  const tIdea = SS(k, 1), tCirc = SS(k, 2), tConf = AT(k, 3, "conformal"), tNav = SS(k, 4), tStep = SS(k, 5), tAdd = SS(k, 6), tChk = SS(k, 7), tInf = SS(k, 8);
  const m = prog(f, tIdea, tIdea + 75);
  const v: PV = { cx: mix(V32a.cx, V32b.cx, m), cy: mix(V32a.cy, V32b.cy, m), s: mix(V32a.s, V32b.s, m) };
  const p = pv(v);
  const yTop = mix(Math.PI / 2, 3.13, m);
  const clip = { x: v.cx - Math.PI * v.s, y: v.cy - yTop * v.s, w: 2 * Math.PI * v.s, h: 2 * yTop * v.s };
  const tis = (PJ.tissot.pc as number[][]).map((L, i) => xyMix(L, PJ.tissot.mc[i], m));
  const parts: Part[] = [{ t: String.raw`y=a\,\ln\tan\!\left(\frac{\pi}{4}+\frac{\varphi}{2}\right)` }, { t: String.raw`,\qquad ` }, { t: String.raw`\frac{dy}{d\varphi}=\frac{a}{\cos\varphi}`, u: { w: String.raw`\text{slope}`, c: C.gold } }];
  if (parts.map((q) => q.t).join("").replace(/\s/g, "") !== EQ_S32.replace(/\s/g, "")) throw new Error("s32 parts drift from EQ_S32");
  const latTick = (la: number) => p(Math.PI, Math.log(Math.tan(Math.PI / 4 + (la * D2R) / 2)));
  return (
    <Scene>
      <Svg>
        <defs><clipPath id="s32c"><rect x={clip.x} y={clip.y} width={clip.w} height={clip.h} /></clipPath></defs>
        <g clipPath="url(#s32c)">
          <Raster v={v} kind="pc" ext={EXT.pc} id="s32p" o={1 - m} />
          <Raster v={v} kind="mc" ext={EXT.mc} id="s32m" o={m} />
          <Coast v={v} a="pc" b="mc" t={m} />
          <g opacity={fin(f, 0) * fout(f, tNav - 12)}>{tis.map((L, i) => <path key={i} d={flatD(p, L) + "Z"} fill={C.gold} fillOpacity={0.25} stroke={C.gold} strokeWidth={3} />)}</g>
          <g opacity={fin(f, tNav)}>
            <path d={flatD(p, PJ.routes_mc.rh)} fill="none" stroke={C.local} strokeWidth={6} />
            <path d={flatD(p, PJ.routes_mc.gc)} fill="none" stroke={C.gold} strokeWidth={6} />
          </g>
        </g>
        <rect x={clip.x} y={clip.y} width={clip.w} height={clip.h} fill="none" stroke={C.grid} strokeWidth={3} />
        <g opacity={fin(f, tInf)}>{[0, 60, 80, 85].map((la) => <g key={la}><line x1={latTick(la)[0]} y1={latTick(la)[1]} x2={latTick(la)[0] + 14} y2={latTick(la)[1]} stroke={C.muted} strokeWidth={3} />
          <Lbl x={latTick(la)[0] + 22} y={latTick(la)[1]} t={`${la}°`} c={C.muted} s={T.floor} b={false} /></g>)}</g>
        <Keyword f={f} text="Mercator, 1569" at={[1150, 320]} appear={AT(k, 0, "fifteen sixty nine")} out={tCirc - 18} />
        <Keyword f={f} text="circles stay circles" at={[1150, 320]} s={T.floor} appear={tCirc} out={tConf - 18} />
        <Keyword f={f} text="conformal" at={[1150, 320]} appear={tConf} c={C.gold} />
        <Lbl x={1150} y={390} t="rhumb line: straight" c={C.local} s={T.floor} o={fin(f, tNav)} />
        <Lbl x={1150} y={445} t="great circle: curved" c={C.gold} s={T.floor} o={fin(f, tNav + 20)} />
        <Keyword f={f} text="derivatives movie" at={[1460, 790]} s={T.floor} appear={AT(k, 7, "derivatives movie")} out={tInf - 18} />
        <Keyword f={f} text="→ ∞ at the poles" at={[1460, 790]} s={T.floor} appear={tInf + 10} />
      </Svg>
      <TeX s={String.raw`dy=\frac{a\,d\varphi}{\cos\varphi}`} x={1150} y={150} size={64} o={fin(f, tStep)} />
      {/* K6: the two halves of EQ_S32 on two lines (inline it ran 340 px past the frame) */}
      <Layered parts={[parts[0], { t: "," }]} x={1100} y={545} size={64} layers={[{ t: [0], o: fin(f, tAdd) }, { t: [1], o: fin(f, tChk) }]} />
      <Layered parts={[parts[2]]} x={1100} y={735} size={64} layers={[{ t: "all", o: fin(f, tChk) }, { t: [], u: [0], o: fin(f, tChk + 20) }]} />
      <SourceBelow text={BMSRC} pic={{ x: 80, y: 54, w: 880, h: 752 }} w={880} name="s32 src" />
    </Scene>
  );
};

// ================================================================ s33 Mercator inflates areas: Greenland vs Africa
const S33: React.FC = () => {
  const f = useCurrentFrame(), k = K("s33_mercator_area");
  const tA = SS(k, 1), t4 = SS(k, 2), t24 = SS(k, 3), tGA = SS(k, 4), tTr = SS(k, 5), tVerd = SS(k, 6);
  const v = V32b, p = pv(v);
  const clip = { x: v.cx - Math.PI * v.s, y: v.cy - 3.13 * v.s, w: 2 * Math.PI * v.s, h: 2 * 3.13 * v.s };
  const lift = prog(f, tTr, tTr + 40);
  const eqv: PV = { cx: 1500, cy: 560, s: 300 };
  const pe = pv(eqv);
  const shape = (merc: number[][], eqa: number[][], c: string, off: Pt, o: number) => o <= 0 ? null : <g opacity={o}>
    {merc.map((L, i) => { const q = flatD(p, L) + "Z"; return <path key={i} d={q} fill={c} fillOpacity={0.35 * (1 - lift)} stroke={c} strokeWidth={3} opacity={1 - lift} />; })}
    {eqa.map((L, i) => <path key={`e${i}`} d={flatD((x, y) => [pe(x, y)[0] + off[0], pe(x, y)[1] + off[1]], L) + "Z"} fill={c} fillOpacity={0.45} stroke={c} strokeWidth={3} opacity={lift} />)}
  </g>;
  const ct = (i: number): Pt => { const L = PJ.tissot.mc[i] as number[]; let x = 0, y = 0; for (let j = 0; j < L.length; j += 2) { x += L[j]; y += L[j + 1]; } return p((2 * x) / L.length, (2 * y) / L.length); };
  return (
    <Scene>
      <Svg>
        <defs><clipPath id="s33c"><rect x={clip.x} y={clip.y} width={clip.w} height={clip.h} /></clipPath></defs>
        <g clipPath="url(#s33c)">
          <Raster v={v} kind="mc" ext={EXT.mc} id="s33m" o={mix(1, 0.45, fin(f, tGA))} />
          <Coast v={v} a="mc" o={0.6} />
          <g opacity={fout(f, tGA - 12)}>{(PJ.tissot.mc as number[][]).map((L, i) => <path key={i} d={flatD(p, L) + "Z"} fill={C.gold} fillOpacity={i === 3 || i === 4 || i === 2 ? 0.45 : 0.18} stroke={C.gold} strokeWidth={3} />)}</g>
        </g>
        <rect x={clip.x} y={clip.y} width={clip.w} height={clip.h} fill="none" stroke={C.grid} strokeWidth={3} />
        {shape(PJ.gl.mc, PJ.gl.eq, C.first, [-130, -160], fin(f, tGA))}
        {shape(PJ.af.mc, PJ.af.eq, C.second, [100, 40], fin(f, tGA))}
        {/* fix loop 1 (Must 6): the circles now sit at 60° N and Svalbard (data fix); column ordered like the targets, links
            from each line's left edge (no crossing) */}
        <SideCallout f={f} lines="≈ 24 ×" at={[1150, 330]} appear={t24} target={ct(2)} c={C.gold} s={54} out={tGA - 18} bend={30} />
        <SideCallout f={f} lines="4 ×" at={[1150, 430]} appear={t4} target={ct(4)} c={C.gold} s={54} out={tGA - 18} bend={30} />
        {/* fix loop 1 (Should 18): an opening keyword from frame 0 (QA halves WARN 33:40-33:44) */}
        <Keyword f={f} text="conformal has a price" at={[1150, 330]} s={T.floor} appear={0} out={tA + 40} />
        <Lbl x={1100} y={330} t="Greenland ≈ Africa on the map" c={C.key} s={T.floor} o={win(f, tGA, tTr - 18)} />
        <Lbl x={1100} y={330} t="true size: Africa ≈ 14 × Greenland" c={C.key} s={T.floor} o={fin(f, tTr + 20)} />
        <Keyword f={f} text="directions yes, sizes no" at={[1150, 820]} s={T.floor} appear={tVerd} />
      </Svg>
      <TeX s={EQ_S33} x={1150} y={180} size={64} o={fin(f, tA)} />
      <SourceBelow text="Image: NASA Blue Marble NG · borders: Natural Earth" pic={{ x: 80, y: 54, w: 880, h: 752 }} w={880} name="s33 src" />
    </Scene>
  );
};

// ================================================================ s34 equal-area maps (Equal Earth) and the climate example
const S34: React.FC = () => {
  const f = useCurrentFrame(), k = K("s34_equal_area");
  const tWarm = SS(k, 1), tEE = SS(k, 2), tTrue = SS(k, 3), tSh = SS(k, 4), t30 = SS(k, 5), tNo = SS(k, 6), tRule = SS(k, 7), tUse = SS(k, 8);
  // fix loop 1 (Should 9): the Equal Earth map starts 40 px clear of the Mercator panel (its left end slid under it)
  const vm: PV = { cx: 300, cy: 300, s: 70 }, ve: PV = { cx: mix(845, 600, prog(f, tTrue, tTrue + 30)), cy: mix(300, 360, prog(f, tTrue, tTrue + 30)), s: mix(105, 175, prog(f, tTrue, tTrue + 30)) };
  const pm = pv(vm), pe = pv(ve);
  const mO = fout(f, tTrue - 12, 14);
  const imgAt = (v: PV, kind: "mc" | "ee", ext: [number, number]) => { const p = pv(v), a = p(-ext[0], ext[1]), b = p(ext[0], -ext[1]); return { a, b }; };
  const IM = imgAt(vm, "mc", [Math.PI, Math.PI]), IE = imgAt(ve, "ee", EXT.ee);
  const e3 = (PJ.tissot.ee as number[][]);
  const om = (() => { const L = e3[3]; let x = 0, y = 0; for (let j = 0; j < L.length; j += 2) { x += L[j]; y += L[j + 1]; } return pe((2 * x) / L.length, (2 * y) / L.length); })();
  return (
    <Scene>
      <Svg>
        <g opacity={mO}>
          <defs><clipPath id="s34m"><rect x={vm.cx - Math.PI * vm.s} y={vm.cy - 3.13 * vm.s} width={2 * Math.PI * vm.s} height={6.26 * vm.s} /></clipPath></defs>
          <g clipPath="url(#s34m)">
            <image href={IMGS.t2m("mc")} x={IM.a[0]} y={IM.a[1]} width={IM.b[0] - IM.a[0]} height={IM.b[1] - IM.a[1]} preserveAspectRatio="none" />
            <Coast v={vm} a="mc" o={0.7} w={1.4} />
          </g>
          <rect x={vm.cx - Math.PI * vm.s} y={vm.cy - 3.13 * vm.s} width={2 * Math.PI * vm.s} height={6.26 * vm.s} fill="none" stroke={C.grid} strokeWidth={3} />
          <Lbl x={vm.cx} y={vm.cy + 3.13 * vm.s + 36} t="Mercator" c={C.muted} s={T.floor} a="middle" b={false} />
        </g>
        <defs><mask id="s34e"><image href={IMGS.bmA("ee")} x={IE.a[0]} y={IE.a[1]} width={IE.b[0] - IE.a[0]} height={IE.b[1] - IE.a[1]} preserveAspectRatio="none" /></mask></defs>
        <g mask="url(#s34e)">
          <image href={IMGS.t2m("ee")} x={IE.a[0]} y={IE.a[1]} width={IE.b[0] - IE.a[0]} height={IE.b[1] - IE.a[1]} preserveAspectRatio="none" />
          <Coast v={ve} a="ee" o={0.7} w={1.4} />
        </g>
        <Lbl x={ve.cx} y={ve.cy + EXT.ee[1] * ve.s + 36} t="Equal Earth" c={C.muted} s={T.floor} a="middle" b={false} o={fin(f, tEE)} />
        <g opacity={fin(f, tTrue)}>
          {(PJ.gl.ee as number[][]).map((L, i) => <path key={`g${i}`} d={flatD(pe, L) + "Z"} fill="none" stroke={C.first} strokeWidth={4} />)}
          {(PJ.af.ee as number[][]).map((L, i) => <path key={`a${i}`} d={flatD(pe, L) + "Z"} fill="none" stroke={C.second} strokeWidth={3} />)}
        </g>
        <g opacity={fin(f, tSh)}>{e3.map((L, i) => <path key={i} d={flatD(pe, L) + "Z"} fill={C.gold} fillOpacity={0.2} stroke={C.gold} strokeWidth={3} />)}</g>
        <ColourBar x={1200} y={130} w={420} lut={LUT_BAL} lo={-5} hi={5} unit="°C" title={["2 m temperature,", "difference from normal"]} ticks={[{ v: -4, t: "−4" }, { v: 0, t: "0" }, { v: 4, t: "4" }]} />
        <Keyword f={f} text="how much is warmer?" at={[1200, 300]} s={T.floor} appear={tWarm} out={tTrue - 18} />
        <Lbl x={1200} y={300} t="Greenland ≈ 1/14 of Africa" c={C.key} s={T.floor} o={fin(f, AT(k, 3, "a fourteenth"))} />
        <SideCallout f={f} lines="angles off ≥ 30°" at={[1200, 400]} appear={t30} target={om} s={T.floor} c={C.gold} bend={20} />
        <Keyword f={f} text="no flat map keeps both" at={[1200, 500]} s={T.floor} appear={tNo} />
        <Keyword f={f} text="pick the map for the job" at={[1200, 580]} s={T.floor} appear={tRule} />
        <Lbl x={1200} y={660} t="conformal → winds, directions" c={C.key} s={T.floor} o={fin(f, tUse)} />
        <Lbl x={1200} y={720} t="equal-area → amounts" c={C.key} s={T.floor} o={fin(f, tUse + 20)} />
        <Keyword f={f} text="reading weather maps" at={[1200, 800]} s={T.floor} appear={AT(k, 9, "reading weather maps")} />
      </Svg>
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · Sep 2026 vs 1991–2020 · coast: Natural Earth" pic={{ x: 80, y: 40, w: 1100, h: 700 }} w={1100} name="s34 src" />
    </Scene>
  );
};

// ================================================================ s35-s36 the view from above the pole: the 10 hPa polar vortex, 21 Jan 2026
const VP: PV = { cx: 470, cy: 405, s: 262 };
const PolarMap: React.FC<{ f: number; o?: number; cont?: number; arrows?: number; rings?: number; children?: (p: (x: number, y: number) => Pt) => React.ReactNode }> = ({ f, o = 1, cont = 1, arrows = 1, rings = 0.4, children }) => {
  const p = pv(VP), R = EXT.ps[0];
  return (
    <Svg o={o}>
      <defs><clipPath id="psc"><circle cx={VP.cx} cy={VP.cy} r={R * VP.s} /></clipPath></defs>
      <g clipPath="url(#psc)">
        <Raster v={VP} kind="ps" ext={EXT.ps} id="ps" masked />
        <circle cx={VP.cx} cy={VP.cy} r={R * VP.s} fill="#1a2a5a" opacity={0.45} />
        {(VX.coast as number[][]).map((L, i) => <path key={i} d={flatD(p, L)} fill="none" stroke={C.key} strokeOpacity={0.55} strokeWidth={1.6} />)}
        {Object.values(VX.rings as Record<string, number>).map((r, i) => <circle key={i} cx={VP.cx} cy={VP.cy} r={r * VP.s} fill="none" stroke={C.local} strokeWidth={2.5} opacity={rings} />)}
        {Array.from({ length: 12 }, (_, i) => i * 30).map((a) => { const t = (a - 90) * D2R; return <line key={a} x1={VP.cx} y1={VP.cy} x2={VP.cx + R * VP.s * Math.cos(t)} y2={VP.cy + R * VP.s * Math.sin(t)} stroke={C.local} strokeWidth={2} opacity={rings * 0.8} />; })}
        {/* contour lines (data-lc-contour) and their height labels (outlined map labels, data-lc-maplabel): the labels sit ON
            their own contour, at spots chosen once (CONT_LABELS) clear of the other labels and of every arrow, ring and arc */}
        <g opacity={cont}>{(VX.contours as { level: number; xy: number[][] }[]).map((c) => <g key={c.level}>
          {c.xy.map((L, i) => <path key={i} d={flatD(p, L)} fill="none" stroke={C.key} strokeWidth={3} data-lc-contour="1" />)}
        </g>)}
          {CONT_LABELS.map((q) => <g key={q.t} data-lc-maplabel="1"><Lbl x={q.at[0]} y={q.at[1]} t={q.t} c={C.key} s={T.floor} a="middle" /></g>)}</g>
        <g opacity={arrows}>{(VX.arrows as number[][]).map((A, i) => { const q = p(A[0], A[1]), L = A[4] * 2.2; return <AnimatedWindArrow key={i} from={q} to={[q[0] + A[2] * L, q[1] - A[3] * L]} speed={A[4]} f={f} c={C.first} px={6} head={20} />; })}</g>
        {children ? children(p) : null}
      </g>
      <circle cx={VP.cx} cy={VP.cy} r={R * VP.s} fill="none" stroke={C.grid} strokeWidth={3} />
    </Svg>
  );
};
/** K6 clean-up: the contour labels, placed ONCE for s35 and s36 (so they never jump at the cut). For each level, the spot on its
 * own contour farthest from everything else drawn on the polar map in either scene (the wind arrows, the r line and λ arc, the
 * anticlockwise arc, both rings, the two component arrows, the centre and 30° N markers) and from the labels already placed;
 * a level with no spot ≥ 34 px clear of all of it gets no label. Pure function of the data. */
const CONT_LABELS: { t: string; at: Pt }[] = (() => {
  const p = pv(VP), R = EXT.ps[0] * VP.s;
  const avoid: Pt[][] = [];
  (VX.arrows as number[][]).forEach((A) => { const q = p(A[0], A[1]), L = A[4] * 2.2; avoid.push([q, [q[0] + A[2] * L, q[1] - A[3] * L]]); });
  avoid.push([[VP.cx, VP.cy], p(0, -VX.rings["45"])]);
  const arcPts = (r: number, a0: number, a1: number): Pt[] => Array.from({ length: 25 }, (_, i) => { const a = (a0 + ((a1 - a0) * i) / 24) * D2R; return [VP.cx + r * Math.cos(a), VP.cy - r * Math.sin(a)] as Pt; });
  avoid.push(arcPts(90, -90, -30), arcPts(150, 200, 320));
  const ringPts = (L: number[]) => Array.from({ length: L.length / 2 + 1 }, (_, i) => p(L[(2 * i) % L.length], L[(2 * i + 1) % L.length]));
  avoid.push(ringPts(VX.ringP), ringPts(VX.ringC));
  const A6 = (VX.arrows as number[][])[6], a0 = p(A6[0], A6[1]), rad = Math.hypot(a0[0] - VP.cx, a0[1] - VP.cy);
  const rr: Pt = [(a0[0] - VP.cx) / rad, (a0[1] - VP.cy) / rad], th: Pt = [rr[1], -rr[0]];
  avoid.push([a0, [a0[0] + th[0] * 120, a0[1] + th[1] * 120]], [a0, [a0[0] - rr[0] * 110, a0[1] - rr[1] * 110]]);
  const cz = p(VX.cxy[0], VX.cxy[1]), z30 = p(0, -VX.rings["30"]);
  avoid.push([[cz[0] - 20, cz[1]], [cz[0] + 20, cz[1]]], [[z30[0] - 12, z30[1]], [z30[0] + 12, z30[1]]], [[VP.cx + 20, VP.cy + 100], [VP.cx + 60, VP.cy + 140]]);
  avoid.push([[986, 360], cz], [[986, 470], z30]);   // the two s35 callout links (bend 20: within ~10 px of these chords)
  const dSeg = (q: Pt, a: Pt, b: Pt) => { const vx = b[0] - a[0], vy = b[1] - a[1], L2 = vx * vx + vy * vy || 1;
    const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * vx + (q[1] - a[1]) * vy) / L2)); return Math.hypot(q[0] - a[0] - t * vx, q[1] - a[1] - t * vy); };
  const hw = 50, hh = 21;   // half box of a "29.6" label at 44 px
  const dBox = (q: Pt, a: Pt, b: Pt) => Math.min(...[[0, 0], [-hw, -hh], [hw, -hh], [-hw, hh], [hw, hh], [-hw, 0], [hw, 0], [0, -hh], [0, hh]].map(([dx, dy]) => dSeg([q[0] + dx, q[1] + dy], a, b)));
  const out: { t: string; at: Pt }[] = [];
  for (const c of VX.contours as { level: number; xy: number[][] }[]) {
    let best: Pt | null = null, bd = 34;
    for (const L of c.xy) for (let j = 0; j < L.length / 2; j += 3) {
      const q = p(L[2 * j], L[2 * j + 1]);
      if (Math.hypot(q[0] - VP.cx, q[1] - VP.cy) > 0.86 * R) continue;
      if (out.some((o) => Math.abs(o.at[0] - q[0]) < 2 * hw + 16 && Math.abs(o.at[1] - q[1]) < 2 * hh + 14)) continue;
      let d = 1e9;
      for (const poly_ of avoid) for (let i = 0; i + 1 < poly_.length; i++) d = Math.min(d, dBox(q, poly_[i], poly_[i + 1]));
      if (d > bd) { bd = d; best = q; }
    }
    if (best) out.push({ t: (c.level / 1000).toFixed(1), at: best });
  }
  return out;
})();
const VSRC = "Data: NCEP/NCAR Reanalysis 1 (NOAA PSL) · 21 Jan 2026 · 10 hPa · Image: NASA BMNG";
const VPIC = { x: VP.cx - EXT.ps[0] * VP.s, y: VP.cy - EXT.ps[0] * VP.s, w: 2 * EXT.ps[0] * VP.s, h: 2 * EXT.ps[0] * VP.s };
const S35: React.FC = () => {
  const f = useCurrentFrame(), k = K("s35_polar_view");
  const tRings = SS(k, 1), tPol = SS(k, 2), tR = AT(k, 2, "distance from the middle"), tLon = AT(k, 2, "longitude"), tZ = SS(k, 3), tLines = SS(k, 4), tVal = SS(k, 5), t31 = AT(k, 5, "almost thirty one"),
    tWind = SS(k, 6), tPV = AT(k, 7, "polar vortex");
  const z30: Pt = pv(VP)(0, -VX.rings["30"]), cz: Pt = pv(VP)(VX.cxy[0], VX.cxy[1]);
  return (
    <Scene>
      <PolarMap f={f} cont={fin(f, tLines, 20)} arrows={fin(f, tWind)} rings={mix(0.35, 0.9, win(f, tRings, tZ))}>
        {(p) => <>
          <line x1={VP.cx} y1={VP.cy} x2={p(0, -VX.rings["45"])[0]} y2={p(0, -VX.rings["45"])[1]} stroke={C.gold} strokeWidth={6} opacity={win(f, tR, tZ)} />
          <path d={arcD([VP.cx, VP.cy], 90, -90, -30)} fill="none" stroke={C.gold} strokeWidth={6} opacity={win(f, tLon, tZ)} />
          <circle cx={cz[0]} cy={cz[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tVal)} />
          <circle cx={z30[0]} cy={z30[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, t31)} />
        </>}
      </PolarMap>
      <Svg>
        <Lbl x={VP.cx + 20} y={VP.cy + 120} t="r" c={C.gold} s={T.calc} o={win(f, tR, tZ)} />
        <Keyword f={f} text="one more map: from above a pole" at={[1000, 140]} s={T.floor} appear={AT(k, 0, "one more map")} out={tPol - 18} />
        <Keyword f={f} text="polar coordinates again" at={[1000, 140]} s={T.floor} appear={tPol} out={tZ - 18} />
        <Lbl x={1000} y={220} t="r: distance from the pole" c={C.key} s={T.floor} o={win(f, tR, tZ - 18)} />
        <Lbl x={1000} y={276} t="angle: longitude" c={C.key} s={T.floor} o={win(f, tLon, tZ - 18)} />
        <Keyword f={f} text="10 hPa surface, about 30 km up" at={[1000, 140]} s={T.floor} appear={tZ} />
        <Lbl x={1000} y={220} t="21 Jan 2026" c={C.muted} s={T.floor} o={fin(f, tZ + 10)} />
        <SideCallout f={f} lines="≈ 28.6 km" at={[1000, 360]} appear={tVal} target={cz} s={T.key} bend={20} />
        <SideCallout f={f} lines="≈ 30.7 km at 30° N" at={[1000, 470]} appear={t31} target={z30} s={T.key} bend={-20} />
        <Lbl x={1000} y={580} t="west to east, round the Arctic" c={C.first} s={T.floor} o={fin(f, tWind)} />
        <Keyword f={f} text="stratospheric polar vortex" at={[1000, 700]} appear={tPV} />
      </Svg>
      <SourceBelow text={VSRC} pic={VPIC} w={980} name="s35 src" />
    </Scene>
  );
};
const S36: React.FC = () => {
  const f = useCurrentFrame(), k = K("s36_vortex_components");
  const tE = SS(k, 0), tN = SS(k, 1), tAnti = SS(k, 2), tHur = SS(k, 3), tNight = SS(k, 4), tCen = SS(k, 5), tRe = SS(k, 6), tOr = SS(k, 7);
  const p = pv(VP);
  const cz = p(VX.cxy[0], VX.cxy[1]);
  const A = (VX.arrows as number[][])[6];
  const a0 = p(A[0], A[1]);
  const rad = Math.hypot(a0[0] - VP.cx, a0[1] - VP.cy), rr: Pt = [(a0[0] - VP.cx) / rad, (a0[1] - VP.cy) / rad], th: Pt = [rr[1], -rr[0]];
  const ringD = (L: number[]) => flatD(p, L) + "Z";
  const ticks = (L: number[], vr: number[], c: Pt | null, o: number) => o <= 0 ? null : <g opacity={o}>{Array.from({ length: 24 }, (_, i) => i * 3).map((i) => {
    const q = p(L[2 * i], L[2 * i + 1]), ctr = c ?? [VP.cx, VP.cy], d = Math.hypot(q[0] - ctr[0], q[1] - ctr[1]), u: Pt = [(q[0] - ctr[0]) / d, (q[1] - ctr[1]) / d];
    const v = vr[i] ?? 0; return <line key={i} x1={q[0]} y1={q[1]} x2={q[0] + u[0] * v * 2} y2={q[1] + u[1] * v * 2} stroke={v < 0 ? C.neg : C.second} strokeWidth={6} />;
  })}</g>;
  return (
    <Scene>
      <PolarMap f={f} cont={mix(1, 0.4, fin(f, tRe))} arrows={mix(1, 0.3, fin(f, tE))}>
        {() => <>
          <g opacity={win(f, tE, tHur)}>
            <Arrow p={a0} q={[a0[0] + th[0] * 120, a0[1] + th[1] * 120]} color={C.first} />
            <Arrow p={a0} q={[a0[0] - rr[0] * 110, a0[1] - rr[1] * 110]} color={C.neg} o={fin(f, tN)} />
          </g>
          <path d={arcD([VP.cx, VP.cy], 150, 200, 320)} fill="none" stroke={C.gold} strokeWidth={6} opacity={win(f, tAnti, tCen)} />
          <ArcHead c={[VP.cx, VP.cy]} r={150} a={320} dir={1} col={C.gold} o={win(f, tAnti, tCen)} />
          <g opacity={fin(f, tCen)} stroke={C.gold} strokeWidth={8} strokeLinecap="round"><line x1={cz[0] - 18} y1={cz[1] - 18} x2={cz[0] + 18} y2={cz[1] + 18} /><line x1={cz[0] + 18} y1={cz[1] - 18} x2={cz[0] - 18} y2={cz[1] + 18} /></g>

          <path d={ringD(VX.ringP)} fill="none" stroke={C.local} strokeWidth={4} opacity={fin(f, tRe) * 0.9} />
          <path d={ringD(VX.ringC)} fill="none" stroke={C.first} strokeWidth={5} opacity={fin(f, tRe + 30)} />
          {ticks(VX.ringP, VX.ringP_vr, null, fin(f, tRe) * fout(f, tRe + 90, 20))}
          {ticks(VX.ringC, VX.ringC_vr, cz, fin(f, tRe + 30))}
        </>}
      </PolarMap>
      <Svg>
        {/* K6: the two component arrows are named in the column, in their own colours (on the map the labels sat on contours) */}
        <Keyword f={f} text="eastward = tangential" at={[1000, 140]} s={T.floor} appear={tE} out={tHur - 18} c={C.first} />
        <Keyword f={f} text="northward = − radial" at={[1000, 220]} s={T.floor} appear={tN} out={tHur - 18} c={C.neg} />
        <Lbl x={1000} y={300} t="anticlockwise, seen from above the pole" c={C.key} s={T.floor} o={win(f, tAnti, tHur - 18)} />
        <g opacity={win(f, tHur, tCen - 18)}>
          <Lbl x={1000} y={160} t="like a hurricane, far wider" c={C.key} s={T.floor} />
          <rect x={1000} y={230} width={8} height={26} fill={C.first} /><Lbl x={1030} y={243} t="hurricane" c={C.muted} s={T.floor} />
          <rect x={1000} y={300} width={760} height={26} fill={C.first} opacity={0.75} /><Lbl x={1000} y={360} t="polar vortex" c={C.muted} s={T.floor} />
        </g>
        <Lbl x={1000} y={450} t="formed by the cold polar night" c={C.key} s={T.floor} o={win(f, tNight, tCen - 18)} />
        <Lbl x={1000} y={160} t="centre ≈ 72.9° N, Barents Sea" c={C.key} s={T.floor} o={fin(f, tCen)} />
        <Lbl x={1000} y={240} t="origin at the vortex centre:" c={C.key} s={T.floor} o={fin(f, tRe)} />
        <Lbl x={1000} y={300} t="far more purely tangential" c={C.first} s={T.floor} o={fin(f, tRe + 30)} />
        {/* fix loop 1 (Should 10): a legend for the radial ticks and the claim as two numbers — rms radial wind ÷ mean tangential
            wind on the 2000-km ring about the pole (1.88) and about the vortex centre (0.42), VX.ratP / VX.ratC */}
        <g opacity={fin(f, tRe)}>
          <Lbl x={1000} y={370} t="radial ticks:" c={C.muted} s={T.floor} b={false} />
          <Lbl x={1000 + textW("radial ticks: ", T.floor)} y={370} t="in" c={C.neg} s={T.floor} />
          <Lbl x={1000 + textW("radial ticks: in · ", T.floor)} y={370} t="out" c={C.second} s={T.floor} />
          <Lbl x={1000 + textW("radial ticks: in ", T.floor)} y={370} t="·" c={C.muted} s={T.floor} />
        </g>
        <g opacity={fin(f, tRe + 30)}>
          <Lbl x={1000} y={525} t="radial ÷ tangential" c={C.muted} s={T.floor} b={false} />
          <rect x={1000} y={562} width={VX.ratP * 200} height={26} fill={C.local} />
          <Lbl x={1000 + VX.ratP * 200 + 16} y={575} t="about the pole ≈ 1.9" c={C.local} s={T.floor} />
          <rect x={1000} y={627} width={VX.ratC * 200} height={26} fill={C.first} />
          <Lbl x={1000 + VX.ratC * 200 + 16} y={640} t="about the centre ≈ 0.4" c={C.first} s={T.floor} />
        </g>
        <Keyword f={f} text="choose the origin" at={[1000, 445]} appear={tOr} c={C.gold} />
        <Keyword f={f} text="stratosphere movie" at={[1000, 700]} s={T.floor} appear={AT(k, 8, "stratosphere movie")} />
      </Svg>
      <SourceBelow text={VSRC} pic={VPIC} w={980} name="s36 src" />
    </Scene>
  );
};

// ================================================================ s37 turning the axes
const O37: Pt = [470, 470];
const S37: React.FC = () => {
  const f = useCurrentFrame(), k = K("s37_rotate_axes");
  const tSame = SS(k, 1), tAl = SS(k, 2), tX = SS(k, 3), tY = SS(k, 4), tDot = SS(k, 5), tEq = SS(k, 6), t30 = SS(k, 7), tXp = SS(k, 8), tYp = SS(k, 9), tLen = SS(k, 10);
  const al = 30 * prog(f, tAl, tAl + 40), a = al * D2R, L = 380;
  const ex: Pt = [Math.cos(a), -Math.sin(a)], ey: Pt = [-Math.sin(a), -Math.cos(a)], s = 30;
  const px = PL.rot30[0], py = PL.rot30[1];
  const sx: Pt = [O37[0] + ex[0] * px * s, O37[1] + ex[1] * px * s], sy: Pt = [O37[0] + ey[0] * py * s, O37[1] + ey[1] * py * s];
  const eq = cutAt(EQ_S37, String.raw`,\qquad `);
  return (
    <Scene>
      <Svg>
        <Arrow p={[O37[0] - 300, O37[1]]} q={[O37[0] + L, O37[1]]} color={C.second} w={4} head={24} o={0.35} />
        <Arrow p={[O37[0], O37[1] + 300]} q={[O37[0], O37[1] - L]} color={C.second} w={4} head={24} o={0.35} />
        <g opacity={fin(f, tAl)}>
          <Arrow p={[O37[0] - ex[0] * 280, O37[1] - ex[1] * 280]} q={[O37[0] + ex[0] * L, O37[1] + ex[1] * L]} color={C.second} w={6} head={30} />
          <Arrow p={[O37[0] - ey[0] * 280, O37[1] - ey[1] * 280]} q={[O37[0] + ey[0] * L, O37[1] + ey[1] * L]} color={C.second} w={6} head={30} />
          <path d={arcD(O37, 160, 0, al)} fill="none" stroke={C.gold} strokeWidth={6} />
          <Lbl x={O37[0] + 190} y={O37[1] - 50} t="α" c={C.gold} s={T.calc} />
        </g>
        <Band p={O37} q={sx} color={C.second} o={0.55 * fin(f, tXp)} />
        <Band p={O37} q={sy} color={C.neg} o={0.55 * fin(f, tYp)} />
        <Dash p={[O37[0] + 10 * s, O37[1]]} q={sx} c={C.second} w={3} />
        <g opacity={fin(f, 0)}><AnimatedWindArrow from={O37} to={[O37[0] + 10 * s, O37[1]]} speed={10} f={f} c={C.first} px={10} head={40} /></g>
        <Lbl x={O37[0] + 10 * s + 20} y={O37[1] + 40} t="10 m/s east" c={C.first} s={T.floor} />
        <Keyword f={f} text="change coordinates: turn the axes" at={[1100, 330]} s={T.floor} appear={AT(k, 0, "change coordinates")} out={tEq - 18} />
        <Keyword f={f} text="same arrow, turned rulers" at={[1100, 820]} s={T.floor} appear={tSame} out={tAl - 18} />
        <Lbl x={1100} y={820} t="anticlockwise, seen from above" c={C.key} s={T.floor} o={fin(f, tAl + 10) * fout(f, tDot - 18)} />
        <Keyword f={f} text="dot products with the new arrows" at={[1100, 820]} s={T.floor} appear={tDot} out={t30 - 18} />
        <Keyword f={f} text="α = 30°" at={[1100, 820]} appear={t30} c={C.gold} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf x}'=(\cos\alpha,\ \sin\alpha)`} x={1100} y={130} size={56} c={C.second} o={fin(f, tX)} />
      <TeX s={String.raw`\hat{\mathbf y}'=(-\sin\alpha,\ \cos\alpha)`} x={1100} y={220} size={56} c={C.second} o={fin(f, tY)} />
      <TeX s={eq[0]} x={1100} y={330} size={60} o={fin(f, tEq)} />
      <TeX s={eq[1]} x={1100} y={420} size={60} o={fin(f, tEq + 30)} />
      <TeX s={String.raw`x'`} x={O37[0] + ex[0] * (L + 40)} y={O37[1] + ex[1] * (L + 40)} size={56} ax={0.5} c={C.second} o={fin(f, tAl + 20)} />
      <TeX s={String.raw`y'`} x={O37[0] + ey[0] * (L + 40)} y={O37[1] + ey[1] * (L + 40)} size={56} ax={0.5} c={C.second} o={fin(f, tAl + 20)} />
      <CalcStack f={f} x={1340} y={500} size={54} rows={[
        { lhs: String.raw`x'`, rhs: String.raw`=10\times0.87\approx8.7`, at: tXp },
        { lhs: String.raw`y'`, rhs: String.raw`=-10\times0.5=-5`, at: tYp },
        { lhs: String.raw`\sqrt{8.66^2+5^2}`, rhs: String.raw`=10`, at: tLen },
      ]} />
    </Scene>
  );
};

// ================================================================ s38 the rotation matrix; polar components are a rotation
const S38: React.FC = () => {
  const f = useCurrentFrame(), k = K("s38_rotation_matrix");
  const tM = SS(k, 0), tDC = SS(k, 1), tIdx = SS(k, 2), tLink = SS(k, 3), tTurn = SS(k, 4), tSix = AT(k, 5, "six outward"), tPl = SS(k, 6);
  const O: Pt = [440, 520], R = 280, th = PL.th;
  const at = (a: number): Pt => [O[0] + R * Math.cos(a * D2R), O[1] - R * Math.sin(a * D2R)];
  const axesAt = (a: number, o: number, key: string, L = 120) => { const b = at(a), er: Pt = [Math.cos(a * D2R), -Math.sin(a * D2R)], et: Pt = [-Math.sin(a * D2R), -Math.cos(a * D2R)];
    return <g key={key} opacity={o}><Arrow p={b} q={[b[0] + er[0] * L, b[1] + er[1] * L]} color={C.second} w={7} head={28} /><Arrow p={b} q={[b[0] + et[0] * L, b[1] + et[1] * L]} color={C.second} w={7} head={28} /></g>; };
  const b = at(th);
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, 0)}>
          <circle cx={O[0]} cy={O[1]} r={R} fill="none" stroke={C.first} strokeWidth={3} opacity={0.4} />
          <PoleThermometer x={O[0]} y={O[1]} s={0.8} />
          <Arrow p={[b[0] - 140, b[1]]} q={[b[0] + 140, b[1]]} color={C.second} w={4} head={22} o={0.4} />
          <Arrow p={[b[0], b[1] + 140]} q={[b[0], b[1] - 140]} color={C.second} w={4} head={22} o={0.4} />
          {axesAt(th, fin(f, tTurn), "b", 150)}
          <path d={arcD(b, 60, 0, th * prog(f, tTurn, tTurn + 30))} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tTurn)} />
          <Balloon p={b} s={0.7} />
          {[150, 250].map((a, i) => axesAt(a, fin(f, tPl + i * 10), `p${i}`))}
          {[150, 250].map((a) => <Balloon key={a} p={at(a)} s={0.55} o={fin(f, tPl)} />)}
        </g>
        <Lbl x={b[0] + 40} y={b[1] - 150} t="(6, −8)" c={C.key} s={T.calc} o={fin(f, tSix)} />
        <Keyword f={f} text="same" at={[b[0] + 120, b[1] - 220]} s={T.floor} appear={tSix + 20} c={C.gold} />
        <Keyword f={f} text="direction cosines" at={[1100, 380]} s={T.floor} appear={tDC} c={C.gold} />
        <Keyword f={f} text="angle changes from place to place" at={[1080, 800]} s={T.floor} appear={tPl} />
      </Svg>
      <TeX s={String.raw`C=\begin{pmatrix}\cos\alpha & -\sin\alpha\\ \sin\alpha & \cos\alpha\end{pmatrix}`} x={1100} y={200} size={64} o={fin(f, tM)} />
      <TeX s={EQ_S38} x={1100} y={500} size={60} o={fin(f, tIdx)} />
      <TeX s={String.raw`\hat{\mathbf r},\ \hat{\boldsymbol\theta}=\hat{\mathbf x},\ \hat{\mathbf y}\ \text{turned by }\theta`} x={1100} y={620} size={52} c={C.second} o={fin(f, tTurn)} />
      <TeX s={String.raw`53^{\circ}`} x={b[0] + 70} y={b[1] - 26} size={44} c={C.gold} o={fin(f, AT(k, 5, "fifty three degrees"))} />
    </Scene>
  );
};

// ================================================================ s39-s40 along and across the coast (HRRR 20 UTC), the surge and Tampa Bay
const FLB: MapBox = boxAt(26.75, -82.05, 2.3, 80, 40, 1140, 760);
const TPB: MapBox = boxAt(27.55, -82.45, 1.8, 80, 40, 1140, 760);
const CoastMap: React.FC<{ B: MapBox; o?: number; children?: (P: (la: number, lo: number) => Pt) => React.ReactNode }> = ({ B, o = 1, children }) => (
  <GeoMap id="s39m" B={B} o={o}>
    {(P) => <>
      <GeoImg P={P} href={IMGS.goes} box={D.ian.goes_box} o={0.6} />
      <GeoImg P={P} href={IMGS.ian(20)} box={D.ian.speed_box} o={0.65} />
      <path d={linesPath(P, D.ian.coast)} fill="none" stroke={C.key} strokeWidth={2.6} />
      {children ? children(P) : null}
    </>}
  </GeoMap>
);
const CSRC = "Data: HRRR analysis (NOAA) · 28 Sep 2022, 20 UTC · GOES-16 image 18:01 UTC";
const S39: React.FC = () => {
  const f = useCurrentFrame(), k = K("s39_coastline");
  const tWhat = SS(k, 1), tBrg = SS(k, 3), tAx = SS(k, 4), tW = SS(k, 5), tFMB = AT(k, 5, "Fort Myers Beach"), tAl = SS(k, 6), tAc = SS(k, 7), tPush = SS(k, 8);
  const P = mapP(FLB);
  const F = P(CO.fmb[0], CO.fmb[1]), s = 7;
  const b = CO.cb_sw * D2R, ea: Pt = [Math.sin(b), -Math.cos(b)], ec: Pt = [-Math.cos(b), -Math.sin(b)];
  const uE = CO.uF[0], uN = CO.uF[1];
  const wt: Pt = [F[0] + uE * s, F[1] - uN * s];
  const sa: Pt = [F[0] + ea[0] * CO.alF * s, F[1] + ea[1] * CO.alF * s], sc_: Pt = [F[0] + ec[0] * CO.acF * s, F[1] + ec[1] * CO.acF * s];
  const pN = P(CO.pN[1], CO.pN[0]), pV = P(CO.pV[1], CO.pV[0]);
  const eye = P(CO.eye20[0], CO.eye20[1]);
  return (
    <Scene>
      <CoastMap B={FLB}>
        {() => <>
          <g opacity={fin(f, tBrg)}><Arrow p={pN} q={pV} color={C.second} w={8} head={34} /></g>
          <circle cx={eye[0]} cy={eye[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={fin(f, tW)} />
          <g opacity={fin(f, tAx)}>
            <Arrow p={[F[0] - ea[0] * 160, F[1] - ea[1] * 160]} q={[F[0] + ea[0] * 260, F[1] + ea[1] * 260]} color={C.second} w={6} head={28} />
            <Arrow p={F} q={[F[0] + ec[0] * 240, F[1] + ec[1] * 240]} color={C.second} w={6} head={28} />
          </g>
          <Band p={F} q={sa} color={C.second} o={0.6 * fin(f, tAl)} />
          <Band p={F} q={sc_} color={C.neg} o={0.6 * fin(f, tAc)} />
          <g opacity={fin(f, tW)}><AnimatedWindArrow from={F} to={wt} speed={CO.spF} f={f} c={C.first} px={10} head={40} /></g>
          <g opacity={fin(f, tPush)}>{[0, 1, 2].map((i) => { const o: Pt = [F[0] + ec[0] * (120 + i * 30) - ea[0] * (i - 1) * 70, F[1] + ec[1] * (120 + i * 30) - ea[1] * (i - 1) * 70];
            return <AnimatedWindArrow key={i} from={o} to={[o[0] - ec[0] * 90, o[1] - ec[1] * 90]} speed={5} f={f} c="#7fb3e0" px={8} head={28} mode="pulse" />; })}</g>
          <circle cx={F[0]} cy={F[1]} r={9} fill={C.key} stroke={C.bg} strokeWidth={3} opacity={fin(f, tFMB)} />
        </>}
      </CoastMap>
      <Svg>
        {/* fix loop 1 (Should 12): 35 px further left, off the two x′-direction arrows */}
        <Lbl x={F[0] - 95} y={F[1] - 36} t="Fort Myers Beach" c={C.key} s={T.floor} a="end" o={fin(f, tFMB)} />
        <Lbl x={F[0] + ea[0] * 300} y={F[1] + ea[1] * 300} t="x′" c={C.second} s={T.key} a="middle" o={fin(f, tAx)} />
        <Lbl x={F[0] + ec[0] * 285} y={F[1] + ec[1] * 285} t="y′" c={C.second} s={T.key} a="middle" o={fin(f, tAx)} />
        <SpeedBar x={1270} y={120} w={300} />
        <Keyword f={f} text="along · across the shore" at={[1260, 260]} s={T.floor} appear={tWhat} />
        {/* fix loop 1 (Should 12): the three links end on three different things — the coastline ≈ 130 px north of Fort Myers
            Beach (the coast link bows over the wind arrow), the x′ (along) axis 80 px south of the beach (a link to its northern half
            would cross the rose across band), the middle of the across band */}
        <SideCallout f={f} lines="coast ≈ 329°" at={[1260, 350]} appear={AT(k, 3, "three hundred and twenty nine")} target={[(pN[0] + pV[0]) / 2 + ea[0] * 130 + 8, (pN[1] + pV[1]) / 2 + ea[1] * 130]} s={T.floor} c={C.second} bend={150} />
        <Lbl x={1260} y={555} t="33 m/s from the SW" c={C.first} s={T.floor} o={fin(f, AT(k, 5, "thirty three"))} />
        {/* K6: across above along, so the two links (both from the left edge) never cross */}
        <SideCallout f={f} lines="≈ −32 m/s: onto the land" at={[1260, 630]} appear={tAc} target={[(F[0] + sc_[0]) / 2, (F[1] + sc_[1]) / 2]} s={T.floor} c={C.neg} bend={20} />
        <SideCallout f={f} lines="≈ 9 m/s along" at={[1260, 705]} appear={tAl} target={[F[0] - ea[0] * 80, F[1] - ea[1] * 80]} s={T.floor} c={C.second} bend={-20} />
        <Keyword f={f} text="pushing the sea onshore" at={[1260, 790]} s={T.floor} appear={tPush} />
      </Svg>
      <TeX s={cutAt(EQ_S39, String.raw`,\qquad `)[0]} x={1260} y={430} size={44} o={fin(f, tAx)} />
      <TeX s={cutAt(EQ_S39, String.raw`,\qquad `)[1]} x={1260} y={490} size={44} o={fin(f, tAx + 15)} />
      <SourceBelow text={CSRC} pic={{ x: 80, y: 40, w: 1140, h: 760 }} w={1140} name="s39 src" />
    </Scene>
  );
};
const S40: React.FC = () => {
  const f = useCurrentFrame(), k = K("s40_surge");
  const tRose = SS(k, 1), tSurge = AT(k, 2, "storm surge"), tFt = SS(k, 3), tTB = AT(k, 4, "Tampa Bay"), tDue = SS(k, 5), tFell = SS(k, 6), tFlip = SS(k, 7), tEk = SS(k, 9);
  const pan = prog(f, tTB - 10, tTB + 40) * (1 - prog(f, LEN(k) - 80, LEN(k) - 10));
  const B = zoomBox(FLB, TPB, pan);
  const P = mapP(B);
  const S = P(CO.stp[0], CO.stp[1]), s = 7;
  const b = 355.4 * D2R, ec: Pt = [-Math.cos(b), -Math.sin(b)];
  const sc_: Pt = [S[0] + ec[0] * CO.acS * s, S[1] + ec[1] * CO.acS * s];
  const G = D.gauges;
  // fix loop 1 (Must 15): the chart 80 px lower and 70 px shorter, so the wind-speed colour bar fits above it
  // fix loop 1 K6: top 20 px lower (the chart title sat 12 px under the colour bar's ticks), bottom unchanged
  const A: Ax = { x: 1330, y: 250, w: 440, h: 180, xr: [0, 36], yr: [-2, 2.5] };
  return (
    <Scene>
      <CoastMap B={B}>
        {(Pm) => { const F = Pm(CO.fmb[0], CO.fmb[1]); return <>
          <circle cx={F[0]} cy={F[1]} r={9} fill={C.key} stroke={C.bg} strokeWidth={3} />
          <g opacity={fin(f, tDue)}>
            <Arrow p={Pm(CO.pS[1], CO.pS[0])} q={Pm(CO.pNn[1], CO.pNn[0])} color={C.second} w={8} head={34} />
            <AnimatedWindArrow from={S} to={[S[0] + CO.uS[0] * s, S[1] - CO.uS[1] * s]} speed={19} f={f} c={C.first} px={10} head={40} />
            <Band p={S} q={sc_} color={C.first} o={0.5} />
          </g>
          <circle cx={S[0]} cy={S[1]} r={9} fill={C.key} stroke={C.bg} strokeWidth={3} opacity={fin(f, tTB)} />
        </>; }}
      </CoastMap>
      <Svg>
        <Lbl x={S[0] + 24} y={S[1] + 34} t="St. Petersburg, Tampa Bay" c={C.key} s={T.floor} o={fin(f, tTB)} />
        <Axes A={A} xt={[0, 12, 24, 36]} yt={[-2, 0, 2]} xl="hours from 28 Sep, 00 UTC" yl="water above tide (m)" zero o={fin(f, tRose)} />
        <Curve A={A} xs={G["8725520"].h} ys={G["8725520"].res} c={C.neg} w={5} upto={prog(f, tRose, tFt)} />
        <Curve A={A} xs={G["8726520"].h} ys={G["8726520"].res} c={C.first} w={5} upto={prog(f, tFell, tFell + 60)} />
        {/* fix loop 1 (Should 11): the gauge is up the river at Fort Myers (not at the beach), and the NHC height is above the ground */}
        <SpeedBar x={1270} y={80} w={300} />
        <Lbl x={1340} y={565} t="Fort Myers (upriver)" c={C.neg} s={T.floor} o={fin(f, tRose)} />
        <Lbl x={1340} y={615} t="St. Petersburg" c={C.first} s={T.floor} o={fin(f, tFell)} />
        <Keyword f={f} text="storm surge" at={[1260, 685]} appear={tSurge} out={tFt - 18} />
        <Lbl x={1260} y={685} t="Fort Myers Beach:" c={C.local} s={T.floor} o={fin(f, tFt) * fout(f, tTB - 18)} />
        <Lbl x={1260} y={737} t="10–15 ft ≈ 3–4.5 m" c={C.local} s={T.floor} o={fin(f, tFt) * fout(f, tTB - 18)} />
        <Lbl x={1260} y={789} t="above the ground" c={C.local} s={T.floor} o={fin(f, tFt) * fout(f, tTB - 18)} />
        <Lbl x={1260} y={685} t="+11.5 m/s: out to sea" c={C.first} s={T.floor} o={fin(f, AT(k, 5, "eleven and a half")) * fout(f, tFlip - 18)} />
        <Lbl x={1260} y={685} t="−32 · +11.5: the sign flips" c={C.gold} s={T.floor} o={fin(f, tFlip) * fout(f, tEk - 18)} />
        <Keyword f={f} text="along-shore: Ekman movie" at={[1260, 685]} s={T.floor} appear={tEk} />
        <Lbl x={1260} y={775} t="almost due north" c={C.second} s={T.floor} o={win(f, tDue, LEN(k) - 90)} />
      </Svg>
      <SourceBelow text="Data: HRRR (NOAA) · 28 Sep 2022, 20 UTC · NOAA CO-OPS gauges · NHC report" pic={{ x: 80, y: 40, w: 1140, h: 760 }} w={1140} name="s40 src" />
    </Scene>
  );
};

// ================================================================ s41 Galilean frames: the train
const S41: React.FC = () => {
  const f = useCurrentFrame(), k = K("s41_galilean");
  const tTr = SS(k, 1), tWk = SS(k, 2), tSee = SS(k, 3), tAdd = SS(k, 4), tU = SS(k, 5), tX = SS(k, 6), tGal = AT(k, 7, "Galilean transformation");
  const x = mix(120, 520, prog(f, tTr, SE(k, 3)));
  const wx = x + 120 + 220 * prog(f, tWk, SE(k, 3));
  const yT = 520;
  const slide = prog(f, tX + 10, SE(k, 6));
  const eq = cutAt(EQ_S41, String.raw`,\qquad `);
  return (
    <Scene>
      <Svg>
        <line x1={80} y1={yT + 14} x2={1840} y2={yT + 14} stroke={C.local} strokeWidth={6} />
        {Array.from({ length: 30 }, (_, i) => <line key={i} x1={90 + i * 60} y1={yT + 4} x2={90 + i * 60} y2={yT + 24} stroke={C.local} strokeWidth={4} />)}
        <Train x={x} y={yT} w={640} />
        <Walker x={wx} y={yT - 112} s={0.9} o={fin(f, tWk)} />
        <Arrow p={[x + 200, yT - 260]} q={[x + 480, yT - 260]} color={C.second} o={fin(f, tTr)} />
        <Lbl x={x + 200} y={yT - 310} t="U = 20 m/s" c={C.second} s={T.key} o={fin(f, tTr)} />
        <Arrow p={[wx, yT - 210]} q={[wx + 70, yT - 210]} color={C.first} w={8} head={26} o={fin(f, tWk)} />
        {/* fix loop 1 (Must 12): the walker's tag left of its arrow (on the right it ran into "x = x′ + U t" at x 1100) */}
        <Lbl x={wx - 24} y={yT - 210} t="u′ = 1.5" c={C.first} s={T.floor} a="end" o={fin(f, tWk)} />
        <PoleThermometer x={1600} y={yT + 4} s={1.1} o={fin(f, tSee)} />
        <Lbl x={1600} y={yT + 70} t="beside the track" c={C.muted} s={T.floor} a="middle" o={fin(f, tSee)} />
        <g opacity={fin(f, tX)}>
          <line x1={200} y1={720} x2={1500} y2={720} stroke={C.local} strokeWidth={4} />
          {Array.from({ length: 14 }, (_, i) => <line key={i} x1={200 + i * 100} y1={706} x2={200 + i * 100} y2={734} stroke={C.local} strokeWidth={3} />)}
          <Lbl x={180} y={720} t="x" c={C.local} s={T.key} a="end" />
          <line x1={200 + slide * 400} y1={790} x2={900 + slide * 400} y2={790} stroke={C.first} strokeWidth={4} />
          {Array.from({ length: 8 }, (_, i) => <line key={i} x1={200 + slide * 400 + i * 100} y1={776} x2={200 + slide * 400 + i * 100} y2={804} stroke={C.first} strokeWidth={3} />)}
          <Lbl x={180 + slide * 400} y={790} t="x′" c={C.first} s={T.key} a="end" />
          <Lbl x={200 + slide * 200} y={840} t="U t" c={C.gold} s={T.floor} a="middle" o={slide} />
        </g>
        <Keyword f={f} text="velocities add" at={[1100, 140]} appear={tAdd} />
        <Keyword f={f} text="Galilean transformation" at={[1100, 380]} appear={tGal} c={C.gold} />
      </Svg>
      <CalcStack f={f} x={1100} y={36} size={54} rows={[{ lhs: "", rhs: String.raw`20+1.5=21.5\ \mathrm{m/s}`, at: AT(k, 3, "twenty one and a half") }]} />
      <TeX s={eq[0]} x={1100} y={230} size={64} o={fin(f, tU)} />
      <TeX s={`${eq[1]},\\qquad ${eq[2]}`} x={1100} y={310} size={56} o={fin(f, tX)} />
    </Scene>
  );
};

// ================================================================ s42 accelerations are the same in both frames
const S42: React.FC = () => {
  const f = useCurrentFrame(), k = K("s42_galilean_accel");
  const tTake = SS(k, 2), tZero = SS(k, 3), tSame = SS(k, 4), tBall = SS(k, 5), tF = SS(k, 6), tFl = SS(k, 7), tSum = SS(k, 8), tOnly = SS(k, 9), tTurn = SS(k, 10);
  const parts: Part[] = [{ t: String.raw`\frac{d\mathbf u}{dt}=` }, { t: String.raw`\frac{d\mathbf U}{dt}`, x: C.neg, u: { w: String.raw`=0`, c: C.gold } }, { t: String.raw`+\frac{d\mathbf u'}{dt}` }];
  const drop = prog(f, tBall + 10, tBall + 70);
  const fall = (t: number) => 9.81 * t * t * 0.5 * 16;
  const yb = 360 + fall(drop * 1.6);
  const lhsP: Part[] = [{ t: String.raw`\frac{\partial\mathbf u}{\partial t}`, u: { w: String.raw`\text{local}`, c: C.local } }, { t: String.raw`+(\mathbf u\cdot\nabla)\mathbf u`, u: { w: String.raw`\text{advection}`, c: C.first } },
    { t: "=" }, { t: String.raw`\frac{\partial\mathbf u'}{\partial t'}`, u: { w: String.raw`\text{local}`, c: C.local } }, { t: String.raw`+(\mathbf u'\cdot\nabla')\mathbf u'`, u: { w: String.raw`\text{advection}`, c: C.first } }];
  if (lhsP.map((p) => p.t).join("").replace(/\s/g, "") !== EQ_S42.replace(/\s/g, "")) throw new Error("s42 parts drift from EQ_S42");
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, 0) * fout(f, tFl - 12)}>
          <Train x={120} y={720} w={360} />
          <circle cx={300} cy={Math.min(yb, 600)} r={16} fill={C.key} stroke={C.bg} strokeWidth={3} />
          <Arrow p={[340, 420]} q={[340, 560]} color={BROWN} />
          <Lbl x={300} y={300} t="train: straight down" c={C.muted} s={T.floor} a="middle" />
          <line x1={540} y1={734} x2={1000} y2={734} stroke={C.local} strokeWidth={5} />
          <path d={poly(Array.from({ length: 21 }, (_, i) => { const t = (i / 20) * drop * 1.6; return [600 + t * 160, Math.min(360 + fall(t), 600)] as Pt; }))} fill="none" stroke={C.key} strokeWidth={4} strokeDasharray="10 8" />
          <circle cx={600 + drop * 1.6 * 160} cy={Math.min(yb, 600)} r={16} fill={C.key} stroke={C.bg} strokeWidth={3} />
          <Arrow p={[880, 420]} q={[880, 560]} color={BROWN} />
          <Lbl x={800} y={300} t="ground: a curve" c={C.muted} s={T.floor} a="middle" />
          <Lbl x={560} y={800} t="same 9.8 m/s² down" c={BROWN} s={T.key} a="middle" />
        </g>
        <g opacity={fin(f, tTurn)}>
          <ellipse cx={500} cy={600} rx={260} ry={90} fill="#22304a" stroke={C.local} strokeWidth={4} />
          <path d={arcD([500, 600], 200, 200, 320)} fill="none" stroke={C.gold} strokeWidth={5} />
          <Lbl x={500} y={840} t="a turning frame: extra terms" c={C.neg} s={T.floor} a="middle" />
        </g>
        <Keyword f={f} text="accelerations?" at={[1100, 360]} appear={6} out={tSame - 18} />
        <Keyword f={f} text="a = a′" at={[1100, 360]} appear={tSame} c={C.gold} />
        <Keyword f={f} text="same forces in both frames" at={[1100, 450]} s={T.floor} appear={tF} out={tFl - 18} />
        <Keyword f={f} text="the sum is the same" at={[1100, 760]} s={T.floor} appear={tSum} out={tTurn - 18} c={C.gold} />
        <Keyword f={f} text="steady, straight frames only" at={[1100, 450]} s={T.floor} appear={tOnly} />
        <Keyword f={f} text="Coriolis, centrifugal" at={[1100, 760]} s={T.floor} appear={tTurn} c={C.neg} />
      </Svg>
      <Layered parts={parts} x={1100} y={180} size={64} layers={[{ t: "all", o: fin(f, tTake) }, { t: [], u: [1], x: [1], o: fin(f, tZero) }]} />
      <Layered parts={lhsP} x={80} y={540} size={64} layers={[{ t: "all", o: fin(f, tFl) * fout(f, tTurn - 12) }, { t: [], u: [0, 1, 3, 4], o: fin(f, tFl + 30) * fout(f, tTurn - 12) }]} />
    </Scene>
  );
};

// ================================================================ s43-s45 Storm Ciarán, ERA5 hourly, tracked by continuity
const CIA: MapBox = boxAt(50.3, -5.2, 9.5, 80, 40, 1100, 760);
const isoD = (P: (la: number, lo: number) => Pt, levels: { level: number; lines: number[][] }[]) => levels.map((L) => linesPath(P, L.lines)).join("");
const CiaMap: React.FC<{ f: number; B?: MapBox; h: number; o?: number; parts?: number; children?: (P: (la: number, lo: number) => Pt) => React.ReactNode; iso?: number }> = ({ f, B = CIA, h, o = 1, parts = 1, children, iso = 1 }) => {
  const a = Math.floor(clamp(h, 0, 9)), b = Math.min(9, a + 1), w = clamp(h, 0, 9) - a;
  return (
    <GeoMap id="cia" B={B} o={o}>
      {(P) => <>
        <GeoImg P={P} href={IMGS.cia(a)} box={CI.sbox} o={0.85} />
        {w > 0.01 ? <GeoImg P={P} href={IMGS.cia(b)} box={CI.sbox} o={0.85 * w} /> : null}
        <path d={linesPath(P, CI.coast)} fill="none" stroke={C.key} strokeOpacity={0.85} strokeWidth={2} />
        <path d={isoD(P, CI.frames[w > 0.5 ? b : a].iso)} fill="none" stroke={C.key} strokeWidth={2.4} opacity={0.9 * iso} />
        <FlowParticles P={(la, lo) => P(la, lo)} tracks={CI.tracks} fr={f / 2} tail={10} w={2} o={parts} vmax={25} />
        {children ? children(P) : null}
      </>}
    </GeoMap>
  );
};
const CSRC2 = "Data: ERA5 (Copernicus C3S) · 1–2 Nov 2023, hourly";
const TR = CI.track as [string, number, number, number][];
const S43: React.FC = () => {
  const f = useCurrentFrame(), k = K("s43_storm_frame");
  const tCh = SS(k, 1), tMove = SS(k, 2), tRing = SS(k, 3), tSN = SS(k, 4), tWhy = SS(k, 5), tS = SS(k, 6), tN = SS(k, 7), tSub = SS(k, 8), tSR = AT(k, 9, "storm-relative");
  const h = mix(0, 6, prog(f, tCh + 10, SE(k, 2) - 10));
  const P = mapP(CIA);
  const hi = Math.round(h);
  const ringD = poly((CI.ring.lat as number[]).map((la, i) => P(la, CI.ring.lon[i]))) + "Z";
  const az = CI.ring.az as number[];
  const azR = (90 - (CI.brg + 90) + 360) % 360;
  const arcSec = (cAz: number) => poly(az.map((a, i) => ({ a, i })).filter(({ a }) => Math.abs(((a - cAz) + 540) % 360 - 180) <= 45).map(({ i }) => P(CI.ring.lat[i], CI.ring.lon[i])));
  const sub = prog(f, tSub + 10, tSub + 70);
  const U = CI.U as number[], s = 4.2;
  const sPt = (cAz: number) => { let best = 0, bd = 1e9; az.forEach((a, i) => { const d = Math.abs(((a - cAz) + 540) % 360 - 180); if (d < bd) { bd = d; best = i; } }); return best; };
  const iS = sPt(azR), iN = sPt((azR + 180) % 360);
  const motion0 = P(TR[3][1], TR[3][2]);
  const eq = cutAt(EQ_S43, String.raw`,\qquad `);
  return (
    <Scene>
      <CiaMap f={f} h={h} parts={f < tRing ? 0.5 : 1}>
        {(Pm) => <>
          <path d={poly(TR.slice(0, hi + 1).map((t) => Pm(t[1], t[2])))} fill="none" stroke={C.gold} strokeWidth={4} />
          {TR.slice(0, hi + 1).map((t, i) => <circle key={i} cx={Pm(t[1], t[2])[0]} cy={Pm(t[1], t[2])[1]} r={8} fill={C.gold} stroke={C.bg} strokeWidth={3} />)}
          <g opacity={fin(f, AT(k, 2, "about fifteen"))}><Arrow p={motion0} q={[motion0[0] + U[0] * 14, motion0[1] - U[1] * 14]} color={C.second} /></g>
          <path d={ringD} fill="none" stroke={C.first} strokeWidth={5} opacity={fin(f, tRing)} />
          <path d={arcSec(azR)} fill="none" stroke={C.gold} strokeWidth={16} opacity={0.6 * win(f, tSN, tSub)} />
          <path d={arcSec((azR + 180) % 360)} fill="none" stroke={C.gold} strokeWidth={16} opacity={0.6 * win(f, tSN, tSub)} />
          {[iS, iN].map((i, q) => { const p0 = Pm(CI.ring.lat[i], CI.ring.lon[i]), tanA = (az[i] + 90) * D2R, vt = CI.ring.vt[i];
            const sp: Pt = [p0[0] + Math.cos(tanA) * vt * s, p0[1] - Math.sin(tanA) * vt * s];
            return <g key={q} opacity={win(f, q === 0 ? tS : tN, tSub)}><Arrow p={p0} q={sp} color={C.first} w={8} head={30} /><Arrow p={sp} q={[sp[0] + U[0] * s, sp[1] - U[1] * s]} color={C.second} w={8} head={30} /></g>; })}
          <g opacity={fin(f, tSub)}>{(CI.arrows as number[][]).map((A, i) => { const p0 = Pm(A[0], A[1]); const u = A[2] - U[0] * sub, v = A[3] - U[1] * sub;
            return <AnimatedWindArrow key={i} from={p0} to={[p0[0] + u * 3.2, p0[1] - v * 3.2]} speed={Math.hypot(u, v)} f={f} c={C.first} px={6} head={20} />; })}</g>
        </>}
      </CiaMap>
      <Svg>
        <SpeedBar x={1240} y={110} w={330} hi={30} />
        <ClockText x={1270} y={240} t={`${TR[clamp(hi, 0, 9)][0].slice(11, 13)} UTC`} h={(parseInt(TR[clamp(hi, 0, 9)][0].slice(11, 13), 10) % 12) || 12} o={fin(f, tCh) * fout(f, tRing - 18)} />
        <ClockText x={1270} y={240} t="03 UTC" h={3} o={fin(f, tRing)} />
        <Lbl x={1240} y={330} t="≈ 15 m/s, east-north-east" c={C.second} s={T.floor} o={fin(f, AT(k, 2, "about fifteen"))} />
        <Keyword f={f} text="200-km ring" at={[1240, 410]} s={T.floor} appear={tRing} c={C.first} out={tWhy - 18} />
        {/* fix loop 1 (Must 13): north above south, like their arcs on the map, and the links leave from each line's left edge
            (they crossed each other and ran under the "s" of "south") */}
        <SideCallout f={f} lines="north ≈ 8 m/s" at={[1240, 500]} appear={AT(k, 4, "only about eight")} target={P(CI.ring.lat[iN], CI.ring.lon[iN])} s={T.floor} out={tSub - 18} bend={20} />
        <SideCallout f={f} lines="south ≈ 19 m/s" at={[1240, 580]} appear={AT(k, 4, "about nineteen")} target={P(CI.ring.lat[iS], CI.ring.lon[iS])} s={T.floor} out={tSub - 18} bend={-20} />
        <Lbl x={1240} y={670} t="south: spin + motion add" c={C.key} s={T.floor} o={win(f, tS, tSub - 18)} />
        <Lbl x={1240} y={730} t="north: they partly cancel" c={C.key} s={T.floor} o={win(f, tN, tSub - 18)} />
        <Keyword f={f} text="storm-relative winds" at={[1240, 670]} appear={tSR} c={C.gold} s={T.floor} />
        <Keyword f={f} text="why so lopsided?" at={[1240, 410]} s={T.floor} appear={tWhy} out={tS - 18} />
      </Svg>
      <TeX s={eq[0]} x={1240} y={790} size={52} o={fin(f, tSub)} />
      <SourceBelow text={CSRC2} pic={{ x: 80, y: 40, w: 1100, h: 760 }} w={1100} name="s43 src" />
    </Scene>
  );
};
const RingPic: React.FC<{ f: number; c: Pt; R: number; storm: boolean; o?: number }> = ({ f, c, R, storm, o = 1 }) => {
  if (o <= 0) return null;
  const rg = CI.ring, U = CI.U as number[];
  return <g opacity={o}>
    <circle cx={c[0]} cy={c[1]} r={R} fill="none" stroke={C.first} strokeWidth={4} />
    <circle cx={c[0]} cy={c[1]} r={8} fill={C.gold} />
    {Array.from({ length: 24 }, (_, i) => i * 3).map((i) => { const a = rg.az[i] * D2R, p0: Pt = [c[0] + R * Math.cos(a), c[1] - R * Math.sin(a)];
      const u = rg.u[i] - (storm ? U[0] : 0), v = rg.v[i] - (storm ? U[1] : 0);
      return <AnimatedWindArrow key={i} from={p0} to={[p0[0] + u * 4, p0[1] - v * 4]} speed={Math.hypot(u, v)} f={f} c={C.first} px={5} head={18} />; })}
  </g>;
};
const S44: React.FC = () => {
  const f = useCurrentFrame(), k = K("s44_storm_invariant");
  const tCh = SS(k, 1), tSpin = SS(k, 2), tIn = SS(k, 3), tAcc = SS(k, 4), tUni = SS(k, 5), tBel = SS(k, 6), tHouse = SS(k, 7), tGust = SS(k, 8);
  const oR = fout(f, tHouse - 12, 14), oM = fin(f, tHouse, 14);
  const cU: Pt = [1560, 330], RU = 150;
  const P = mapP(CIA);
  const brest = P(BREST[0], BREST[1]);
  return (
    <Scene>
      <Svg>
        <RingPic f={f} c={[300, 330]} R={200} storm={false} o={oR} />
        <RingPic f={f} c={[860, 330]} R={200} storm o={oR} />
        <g opacity={oR}>
          <Lbl x={300} y={80} t="from the ground" c={C.muted} s={T.floor} a="middle" />
          <Lbl x={860} y={80} t="riding with the storm" c={C.muted} s={T.floor} a="middle" />
          <Lbl x={300} y={620} t="spin ≈ 14 m/s" c={C.first} s={T.floor} a="middle" o={fin(f, tSpin)} />
          <Lbl x={860} y={620} t="spin ≈ 14 m/s" c={C.first} s={T.floor} a="middle" o={fin(f, tSpin + 10)} />
          <Lbl x={300} y={690} t="inflow ≈ −6 m/s" c={C.neg} s={T.floor} a="middle" o={fin(f, tIn)} />
          <Lbl x={860} y={690} t="inflow ≈ −6 m/s" c={C.neg} s={T.floor} a="middle" o={fin(f, tIn + 10)} />
          <CurvedLink f={f} from={[440, 620]} to={[720, 620]} start={tSpin + 20} bend={40} />
          <Lbl x={580} y={560} t="same" c={C.gold} s={T.floor} a="middle" o={fin(f, tSpin + 30)} />
          <g opacity={fin(f, tUni)}>
            <circle cx={cU[0]} cy={cU[1]} r={RU} fill="none" stroke={C.local} strokeWidth={3} />
            {Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4, p0: Pt = [cU[0] + RU * Math.cos(a), cU[1] - RU * Math.sin(a)];
              return <g key={i}><Arrow p={p0} q={[p0[0] + 70, p0[1]]} color={C.second} w={6} head={22} />
                <Lbl x={p0[0] + (Math.cos(a) > 0.1 ? 26 : Math.cos(a) < -0.1 ? -26 : 0)} y={p0[1] + (Math.sin(a) > 0 ? -34 : 34)} t={Math.sin(a) > 0.1 ? "−" : Math.sin(a) < -0.1 ? "+" : ""} c={Math.sin(a) > 0.1 ? C.neg : C.first} s={T.key} a="middle" /></g>; })}
            <Lbl x={cU[0]} y={cU[1] + RU + 104} t="uniform wind: adds ≈ 0" c={C.key} s={T.floor} a="middle" />
          </g>
          <Keyword f={f} text="each point: changes by 15 m/s" at={[1180, 620]} s={T.floor} appear={tCh} out={tAcc - 18} />
          <Keyword f={f} text="no accident" at={[1180, 620]} s={T.floor} appear={tAcc} out={tUni - 18} />
          <Lbl x={1180} y={720} t="spin: the storm's" c={C.key} s={T.floor} o={fin(f, tBel)} />
          <Lbl x={1180} y={776} t="motion: the pattern's" c={C.key} s={T.floor} o={fin(f, tBel + 10)} />
        </g>
      </Svg>
      <CiaMap f={f} h={6} o={oM}>
        {() => <HouseIcon x={brest[0]} y={brest[1] - 6} s={0.9} />}
      </CiaMap>
      <Svg>
        <Lbl x={brest[0] - 30} y={brest[1] + 40} t="Brest" c={C.key} s={T.floor} a="end" o={oM} />
        <Keyword f={f} text="the ground wind counts" at={[1240, 330]} s={T.floor} appear={tHouse} />
        <Callout f={f} lines={["gust 84 kt", "≈ 156 km/h"]} at={[1240, 480]} appear={tGust} target={[brest[0] + 20, brest[1] - 20]} s={T.key} c={C.local} bend={30} />
        <SpeedBar x={1240} y={110} w={330} hi={30} o={oM} />
      </Svg>
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · ISD (NOAA NCEI) Brest · 2 Nov 2023, 03 UTC" pic={{ x: 80, y: 40, w: 1100, h: 760 }} w={1100} name="s44 src" />
    </Scene>
  );
};
const S45: React.FC = () => {
  const f = useCurrentFrame(), k = K("s45_fixed_barometer");
  const tFroz = SS(k, 1), tFall = SS(k, 2), tSplit = SS(k, 3), tPly = AT(k, 4, "Plymouth"), t38 = AT(k, 4, "three point eight"), t32 = SS(k, 5), t06 = SS(k, 6), tMost = SS(k, 7), tAdv = SS(k, 8);
  const B = boxAt(50.5, -4.5, 4.5, 80, 40, 880, 760);   // K6: narrower map, wider text column for the three under-words
  const P = mapP(B);
  const slide = prog(f, tFroz + 10, SE(k, 2) - 10) * 2;
  const g = CI.ghost as { level: number; lines: number[][] }[][];
  const gi = Math.min(2, Math.floor(slide)), gw = slide - gi;
  const ply = P(CI.ply.p[0], CI.ply.p[1]);
  const parts: Part[] = [{ t: String.raw`\frac{\partial p}{\partial t}`, u: { w: String.raw`\text{fixed barometer}`, c: C.local } }, { t: "=" },
    { t: String.raw`\frac{\partial p}{\partial \tau}`, u: { w: String.raw`\text{with the storm}`, c: C.gold } }, { t: String.raw`-\mathbf U\cdot\nabla p`, u: { w: String.raw`\text{sliding pattern}`, c: C.second } }];
  if (parts.map((p) => p.t).join("").replace(/\s/g, "") !== EQ_S45.replace(/\s/g, "")) throw new Error("s45 parts drift from EQ_S45");
  // fix loop 1 (Must 14): bars hang from a baseline at y 640 (40 px per hPa/h), the unit above the baseline's right end, the
  // S7/S8 keywords between the equation and the bars, the equation broken BEFORE "=" (no lone "=" at the end of line 1)
  const BY = 640, BS = 40;
  const bar = (x: number, v: number, c: string, o: number) => o <= 0 ? null : <rect x={x} y={BY} width={70} height={Math.abs(v) * BS} fill={c} opacity={o} />;
  const ghostO = fin(f, tFroz) * fout(f, tSplit + 40, 20);
  const ghostD = (gi < 2 ? (gw < 0.5 ? g[gi] : g[gi + 1]) : g[2]).map((L) => linesPath(P, L.lines)).join("");
  return (
    <Scene>
      <CiaMap f={f} B={B} h={mix(2, 4, prog(f, tFroz + 10, SE(k, 2) - 10))} iso={0.9}>
        {() => <path d={ghostD} fill="none" stroke={C.local} strokeWidth={3} strokeDasharray="12 8" opacity={ghostO} />}
      </CiaMap>
      <Svg>
        <Barometer x={ply[0]} y={ply[1] - 50} r={36} hPa={mix(965, 958, prog(f, tFall, tFall + 90))} o={fin(f, 0)} />
        <Lbl x={ply[0] + 50} y={ply[1] + 10} t="Plymouth" c={C.key} s={T.floor} o={fin(f, tPly)} />
        <SpeedBar x={1460} y={90} w={250} hi={30} />
        <Lbl x={1010} y={270} t="frozen pattern, sliding" c={C.local} s={T.floor} o={win(f, tFroz, tSplit - 18)} />
        <Lbl x={1010} y={330} t="pressure falls at a fixed place" c={C.key} s={T.floor} o={win(f, tFall, tSplit - 18)} />
        <g>
          <line x1={1250} y1={BY} x2={1800} y2={BY} stroke={C.muted} strokeWidth={3} />
          {bar(1280, CI.ply.dpdt, C.local, fin(f, t38))}
          {bar(1460, CI.ply.slide, C.second, fin(f, t32))}
          {bar(1640, CI.ply.resid, C.gold, fin(f, t06))}
          <Lbl x={1315} y={832} t="−3.8" c={C.local} s={T.floor} a="middle" o={fin(f, t38)} />
          <Lbl x={1495} y={832} t="−3.2" c={C.second} s={T.floor} a="middle" o={fin(f, t32)} />
          <Lbl x={1675} y={832} t="−0.6" c={C.gold} s={T.floor} a="middle" o={fin(f, t06)} />
          <Lbl x={1800} y={605} t="hPa per hour" c={C.muted} s={T.floor} a="end" o={fin(f, t38)} />
        </g>
        <Keyword f={f} text="mostly: the storm arriving" at={[1010, 535]} s={T.floor} appear={tMost} out={tAdv - 18} />
        <Keyword f={f} text="advection · material derivative" at={[1010, 535]} s={T.floor} appear={tAdv} />
      </Svg>
      {/* K6: EQ_S45 on two lines at 64 px (three under-words ≥ 44 px do not fit on one line beside the map) */}
      <Layered parts={[parts[0]]} x={1010} y={116} size={64} layers={[{ t: "all", o: fin(f, tSplit) }, { t: [], u: [0], o: fin(f, tSplit + 40) }]} />
      <Layered parts={[parts[1], parts[2], parts[3]]} x={1010} y={370} size={64} layers={[{ t: "all", o: fin(f, tSplit) }, { t: [], u: [1, 2], o: fin(f, tSplit + 40) }]} />
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 1–2 Nov 2023, 23–01 UTC" pic={{ x: 80, y: 40, w: 880, h: 760 }} w={880} name="s45 src" />
    </Scene>
  );
};

// ================================================================ s46 recap (one beat per sentence; each beat leaves ≥ 8 frames before the next)
const S46: React.FC = () => {
  const f = useCurrentFrame(), k = K("s46_recap");
  const n = 11, beat = (j: number) => (j < n - 1 ? win(f, SS(k, j), SS(k, j + 1) - 18, 10) : fin(f, SS(k, j)));
  const O: Pt = [480, 450];
  const pic = (j: number) => {
    const o = beat(j);
    if (o <= 0) return null;
    return <g key={j} opacity={o}>
      {j === 0 ? <><Arrow p={[O[0] - 260, O[1] + 180]} q={[O[0] + 300, O[1] + 180]} color={C.second} w={6} head={28} /><Arrow p={[O[0] - 200, O[1] + 240]} q={[O[0] - 200, O[1] - 260]} color={C.second} w={6} head={28} />
        <circle cx={O[0] - 200} cy={O[1] + 180} r={12} fill={C.gold} /><Balloon p={[O[0] + 100, O[1] - 120]} /></> : null}
      {j === 1 ? <>{[[-260, 0], [-120, 0]].map(([x], q) => <g key={q}><Arrow p={[O[0] + x, O[1]]} q={[O[0] + x + 90, O[1]]} color={C.second} w={7} head={26} /><Arrow p={[O[0] + x, O[1]]} q={[O[0] + x, O[1] - 90]} color={C.second} w={7} head={26} /></g>)}
        <circle cx={O[0] + 200} cy={O[1]} r={150} fill="none" stroke={C.first} strokeWidth={3} />{[30, 150, 260].map((a) => { const b: Pt = [O[0] + 200 + 150 * Math.cos(a * D2R), O[1] - 150 * Math.sin(a * D2R)];
          return <Arrow key={a} p={b} q={[b[0] + 80 * Math.cos(a * D2R), b[1] - 80 * Math.sin(a * D2R)]} color={C.second} w={6} head={22} />; })}</> : null}
      {j === 2 ? <><path d={arcD(O, 260, 0, 60)} fill="none" stroke={C.second} strokeWidth={12} /><line x1={O[0]} y1={O[1]} x2={O[0] + 260} y2={O[1]} stroke={C.first} strokeWidth={6} />
        <line x1={O[0]} y1={O[1]} x2={O[0] + 130} y2={O[1] - 225} stroke={C.first} strokeWidth={6} /></> : null}
      {j === 3 || j === 4 ? <><circle cx={O[0]} cy={O[1]} r={200} fill="none" stroke={C.first} strokeWidth={5} /><circle cx={O[0]} cy={O[1]} r={10} fill={C.gold} />
        <Arrow p={[O[0] + 200, O[1]]} q={[O[0] + 200, O[1] - 160]} color={C.first} /><Arrow p={[O[0] + 200, O[1]]} q={[O[0] + (j === 3 ? 140 : 90), O[1]]} color={C.neg} /></> : null}
      {j === 5 ? <><circle cx={O[0]} cy={O[1]} r={260} fill="#22304a" stroke={C.local} strokeWidth={3} />{[0, 48, 78].map((la) => <ellipse key={la} cx={O[0]} cy={O[1] - 260 * Math.sin(la * D2R)} rx={260 * Math.cos(la * D2R)} ry={30 * Math.cos(la * D2R)} fill="none" stroke={C.second} strokeWidth={4} />)}</> : null}
      {j === 6 ? <><circle cx={O[0]} cy={O[1]} r={260} fill="#22304a" stroke={C.local} strokeWidth={3} /><path d={`M ${O[0] - 225} ${O[1] - 130} Q ${O[0]} ${O[1] - 165} ${O[0] + 225} ${O[1] - 130} L ${O[0] + 225} ${O[1] + 130} Q ${O[0]} ${O[1] + 165} ${O[0] - 225} ${O[1] + 130} Z`} fill={C.first} opacity={0.4} /></> : null}
      {j === 7 ? <><circle cx={O[0]} cy={O[1]} r={260} fill="#22304a" stroke={C.local} strokeWidth={3} /><path d={`M ${O[0] - 200} ${O[1] + 40} Q ${O[0] - 20} ${O[1] - 240} ${O[0] + 200} ${O[1] + 60}`} fill="none" stroke={C.gold} strokeWidth={7} />
        <path d={`M ${O[0] - 200} ${O[1] + 40} Q ${O[0]} ${O[1] - 40} ${O[0] + 200} ${O[1] + 60}`} fill="none" stroke={C.local} strokeWidth={6} strokeDasharray="12 8" /></> : null}
      {j === 8 ? <><rect x={O[0] - 380} y={O[1] - 200} width={340} height={400} fill="#22304a" stroke={C.local} strokeWidth={3} /><rect x={O[0] - 300} y={O[1] - 190} width={110} height={110} fill={C.first} opacity={0.6} />
        <ellipse cx={O[0] + 200} cy={O[1]} rx={230} ry={130} fill="#22304a" stroke={C.local} strokeWidth={3} /><rect x={O[0] + 120} y={O[1] - 110} width={40} height={30} fill={C.first} opacity={0.6} /></> : null}
      {j === 9 ? <><path d={`M ${O[0] - 150} ${O[1] + 250} Q ${O[0]} ${O[1]} ${O[0] + 100} ${O[1] - 260}`} fill="none" stroke={C.key} strokeWidth={5} /><Arrow p={[O[0] + 10, O[1] + 20]} q={[O[0] + 70, O[1] - 140]} color={C.second} />
        <Arrow p={[O[0] + 10, O[1] + 20]} q={[O[0] - 150, O[1] - 40]} color={C.neg} /></> : null}
      {j === 10 ? <><Train x={O[0] - 380} y={O[1] + 60} w={380} /><circle cx={O[0] + 220} cy={O[1] - 40} r={140} fill="none" stroke={C.first} strokeWidth={4} /><circle cx={O[0] + 220} cy={O[1] - 40} r={8} fill={C.gold} /></> : null}
    </g>;
  };
  // K6: every line ≤ 760 px (x 1080 … 1840); long beats split over two or three lines
  const txt: [string, string?, string?][] = [["origin + directions"], ["fixed x̂, ŷ · turning r̂, θ̂"], ["s = r θ (radians)"], ["spin ≈ 37 m/s", "inflow ≈ 12.5 m/s"], ["steady spin still accelerates"],
    ["1° north ≈ 111 km", "1° east: 74 km at Brest,", "23 km at Svalbard"], ["half the Earth: 30° S – 30° N"], ["shortest: a great circle"], ["Mercator keeps shapes", "equal-area keeps sizes"],
    ["turned axes: along · across"], ["Galilean frames:", "accelerations and spin unchanged"]];
  return (
    <Scene>
      <Svg>
        {Array.from({ length: n }, (_, j) => pic(j))}
        {txt.map(([a, b, c], j) => j === 1 ? null : <g key={j} opacity={beat(j)}><Lbl x={1080} y={360} t={a} c={C.key} s={T.key} />{b ? <Lbl x={1080} y={450} t={b} c={C.key} s={T.floor} /> : null}
          {c ? <Lbl x={1080} y={506} t={c} c={C.key} s={T.floor} /> : null}</g>)}
      </Svg>
      {/* fix loop 1 (Should 2): beat 1 in KaTeX, so the hats sit on x, y, r and θ */}
      <TeX s={String.raw`\text{fixed }\hat{\mathbf x},\,\hat{\mathbf y}\ \cdot\ \text{turning }\hat{\mathbf r},\,\hat{\boldsymbol\theta}`} x={1080} y={360} size={56} c={C.key} o={beat(1)} />
    </Scene>
  );
};

// ================================================================ s47 the series end card (maths ending, HOUSE_STYLE §3)
const S47: React.FC = () => {
  const f = useCurrentFrame(), k = K("s47_end");
  const t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const thumb = (x: number, i: number) => (
    <g key={i} opacity={0.75}>
      <rect x={x - 150} y={70} width={300} height={170} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
      {i === 0 ? <>{[25, 50, 75].map((r) => <circle key={r} cx={x} cy={155} r={r} fill="none" stroke={C.first} strokeWidth={3} />)}</> : null}
      {i === 1 ? <><circle cx={x} cy={155} r={70} fill="none" stroke={C.first} strokeWidth={3} />{[-35, 0, 35].map((d) => <ellipse key={d} cx={x} cy={155 - d} rx={70 * Math.cos(Math.asin(d / 70))} ry={10} fill="none" stroke={C.first} strokeWidth={2} />)}<ellipse cx={x} cy={155} rx={30} ry={70} fill="none" stroke={C.first} strokeWidth={2} /></> : null}
      {i === 2 ? <><rect x={x - 110} y={90} width={220} height={130} fill="none" stroke={C.local} strokeWidth={3} />{[0, 1, 2, 3].map((q) => <line key={q} x1={x - 110 + q * 55 + 27} y1={90} x2={x - 110 + q * 55 + 27} y2={220} stroke={C.local} strokeWidth={2} />)}
        {[0, 1, 2].map((q) => <line key={`h${q}`} x1={x - 110} y1={90 + [20, 65, 110][q]} x2={x + 110} y2={90 + [20, 65, 110][q]} stroke={C.local} strokeWidth={2} />)}</> : null}
      {i === 3 ? <><circle cx={x} cy={155} r={60} fill="none" stroke={C.first} strokeWidth={4} /><Arrow p={[x + 60, 155]} q={[x + 60, 100]} color={C.first} w={6} head={20} /><Arrow p={[x + 60, 155]} q={[x + 20, 155]} color={C.neg} w={6} head={20} /></> : null}
    </g>
  );
  const rel = ["vectors and index notation", "dot product", "cross product", "derivatives and Taylor series", "gradient", "contour maps", "curl", "material derivative", "Coriolis", "reading weather maps"];
  // fix loop 1 (Should 14): the topic list starts 24 px below the stacked-notebooks icon (it touched "vectors and index notation")
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
  s31_plate_carree: S31, s32_mercator: S32, s33_mercator_area: S33, s34_equal_area: S34, s35_polar_view: S35, s36_vortex_components: S36, s37_rotate_axes: S37,
  s38_rotation_matrix: S38, s39_coastline: S39, s40_surge: S40, s41_galilean: S41, s42_galilean_accel: S42, s43_storm_frame: S43, s44_storm_invariant: S44,
  s45_fixed_barometer: S45, s46_recap: S46, s47_end: S47,
};
void [Curve, ColourBar, pulse, nf];
