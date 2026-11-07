// ch00_coordinates_storm scenes s21-s32: Cyclone Amphan (globe tour, the MODIS pinhole eye, ERA5 rings and the section beside
// Ian's), why cylindrical coordinates, back to Ian's coast (onshore wind, storm surge, the tide gauges), the flood visuals of
// flood_visuals §v3 (user decision 2026-11-05: the flight goes to Amphan's landfall and shelf; the swipe is Cyclone Nargis 2008,
// MODIS 7-2-1), the recap and the end card. Every number on screen is asserted against data/cs.json below.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { ramp } from "../house";
import { C, FONT, T } from "../house/kit/type";
import { Pt, pulse, textW } from "../house/kit/draw";
import { TeX } from "../house/kit/tex";
import { CalcStack } from "./cs_lib";  // fix 0: fraction rows get their real height
import { Keyword } from "./cs_lib";   // Part 1 lessons C1: maths in $…$
import { GlobeFrame, SourceBelow } from "../house/kit/frame";
import { AnimatedWindArrow } from "../house/kit/wind";
import { Notebook } from "../house/kit/icons";
import { globePath, llPath, useTex } from "./kit_cs/globe";
import {
  AMP, ASSET_NAMES, AT, ArcHead, Arrow, HOLD, SE, Ax, Proj, lerpBox, Axes, CST, ColourBar, Cross, Curve, D, D2R, FLD, Globe, GeoImg, GeoMap, IMG, K, LEN, LUT_DEPTH, LUT_UR, Lbl, MapBox, NAR, Place, RING, SAY, SEC, SRC, SS,
  SSP, STK, Scene, SideCallout, SpeedBar, Svg, URBar, arcD, axP, boxAt, clamp, fin, fout, linesPath, lutCss, mapP, mix, nf, poly, polar, prog, win,
} from "./cs_lib";
import { InUpOut, SecAxes, secP } from "./cs_sB";
import { EQ_S23, EQ_S25, cutAt } from "./cs_eq";

// ---------------------------------------------------------------- numbers on screen = the data (the render fails otherwise)
const CHECK_C: [string, number, number, number][] = [
  ["a vt", AMP.vt10[0], 20, 0.15], ["a vr", AMP.vr10[0], -6, 0.05], ["a ring", AMP.ring_km, 50, 0], ["a inflow", AMP.inflow, 17, 0.5], ["i inflow", 20.9, 21, 0.5],
  ["a kt", AMP.best06.kt, 90, 0], ["a hPa", AMP.best06.hpa, 956, 0], ["a peak", AMP.peak.kt, 130, 0], ["Kolkata", AMP.close.Kolkata.km, 17, 1], ["Satkhira", AMP.close.Satkhira.km, 45, 1],
  ["Khulna", AMP.close.Khulna.km, 79, 0.5], ["a sec min", AMP.sec.min[0], -11, 0.15], ["a sec min r", AMP.sec.min[1], 100, 0], ["a sec max", AMP.sec.max[0], 6, 0.25],
  ["fmb", CST.spF, 33, 0.1], ["fmb from", CST.fromF, 222.5, 0.1], ["coast brg", CST.coast_brg, 329, 0.2], ["fm res", CST.gauges["8725520"].ext, 2.2, 0.01],
  ["stp res", CST.gauges["8726520"].ext, -1.8, 0.05], ["d fs", CST.d_fs, 160, 1], ["shelf", FLD.shelf["89.0E"].km_to_20m, 33, 0.2], ["acc", RING.acc, 0.048, 0.0006],
  ["say a_vt", SAY.a_vt, 20, 0], ["say a_kmh", SAY.a_kmh, 167, 0],
  ["say a_ms", SAY.a_ms, 46, 0], ["a ms", (AMP.best06.kt * 1.852) / 3.6, 46, 0.5], ["say a_msl", SAY.a_msl, 967, 0], ["a msl", AMP.msl, 967, 0.5],
];
CHECK_C.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

const MX = 1100;
const TR = AMP.track as [string, number, number, number | null][];
const trackLL = TR.map((q) => [q[1], q[2]] as [number, number]);
/** the unzoomed globe of s21 and s29 (K6 round 1): at dist 4.3 about (560, 470) the disc (r 410) reached y 880, so the one-line source
 * under it sat on the picture; dist 4.75 about (560, 430) gives r = f_px / √(d² − 1) ≈ 369 (fov 35°, f_px = 540 / tan 17.5°), bottom ≈ 799 */
const G_DIST0 = 4.75, G_PP0: Pt = [560, 430];
const G_DISC_R = Math.ceil(540 / Math.tan(17.5 * D2R) / Math.sqrt(G_DIST0 * G_DIST0 - 1));

// ================================================================ s21 the Bay of Bengal, Cyclone Amphan (globe tour, zoom back out)
const S21: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21_amphan_intro");
  // remake 2026-11-07 (fact-check rows 1-2): S3-S6 the IMD wind class, 1999, not a damage scale, Sidr / Aila; S8-S9 the split Kolkata line
  const tBay = AT(k, 0, "Bay of Bengal"), tRem = SS(k, 1), tMay = SS(k, 2), t18 = AT(k, 3, "eighteenth"), t99 = SS(k, 4), tWind = SS(k, 5), tSidr = SS(k, 6),
    t20 = SS(k, 7), tKol = SS(k, 8), tSat = AT(k, 9, "Satkhira"), tKhu = AT(k, 9, "Khulna"), tDis = SS(k, 10);
  const keys = [
    { f: 0, lat: 18, lon: 60, dist: G_DIST0, pp: G_PP0 },
    { f: tBay - 10, lat: 18, lon: 60, dist: G_DIST0, pp: G_PP0 },
    { f: tBay + 45, lat: 16, lon: 88, dist: 2.4, pp: [600, 470] as Pt },
    { f: t20, lat: 16, lon: 88, dist: 2.4, pp: [600, 470] as Pt },
    { f: t20 + 60, lat: 21.8, lon: 88.6, dist: 1.32, pp: [600, 470] as Pt },
    { f: tDis + 70, lat: 21.8, lon: 88.6, dist: 1.32, pp: [600, 470] as Pt },
    // #5b r1 S19: the zoomed map with the two districts holds to the end of S6 (the zoom-out ran under "Khulna and Satkhira districts")
    { f: LEN(k), lat: 21.8, lon: 88.6, dist: 1.32, pp: [600, 470] as Pt },
  ];
  const cam = globePath(keys, f);
  const zoom = clamp((G_DIST0 - cam.dist) / (G_DIST0 - 2.4), 0, 1);
  const grow = clamp((f - tMay) / Math.max(1, t20 + 30 - tMay), 0, 1);
  const nTr = Math.max(2, Math.round(trackLL.length * grow));
  const ipk = TR.findIndex((q) => q[0].startsWith(AMP.peak.t.slice(0, 13)));
  const places: [string, number, number, number, Pt][] = [["India", 22.5, 79.5, tBay + 20, [0, 0]], ["Myanmar", 21.0, 95.5, tBay + 30, [0, 0]], ["Bangladesh", 24.2, 90.2, tBay + 40, [0, 0]],
    ["Kolkata", AMP.places.Kolkata[0], AMP.places.Kolkata[1], tKol, [-20, -34]], ["Satkhira", AMP.places.Satkhira[0], AMP.places.Satkhira[1], tSat, [20, -34]],
    ["Khulna", AMP.places.Khulna[0], AMP.places.Khulna[1], tKhu, [20, 34]]];
  const near = cam.dist < 1.6;
  return (
    <Scene>
      <Globe cam={cam} lines={AMP.coast} coast={0.6} over={(G) => {
        const p = (la: number, lo: number) => G.p(la, lo, 1.002);
        return <g>
          <path d={llPath(G, trackLL.slice(0, nTr), 1.002)} fill="none" stroke={C.gold} strokeWidth={5} />
          {trackLL.slice(0, nTr).map(([la, lo], i) => i % 2 === 0 && G.vis(la, lo) ? <circle key={i} cx={p(la, lo)[0]} cy={p(la, lo)[1]} r={5} fill={C.gold} /> : null)}
          {ipk >= 0 && ipk < nTr ? <circle cx={p(trackLL[ipk][0], trackLL[ipk][1])[0]} cy={p(trackLL[ipk][0], trackLL[ipk][1])[1]} r={10 + 6 * pulse(f, t18, 30)} fill="none" stroke={C.gold} strokeWidth={5} /> : null}
          <g opacity={near ? 1 : 0}>{(AMP.borders as number[][]).map((l, i) => <path key={i} d={llPath(G, Array.from({ length: l.length / 2 }, (_, j) => [l[2 * j + 1], l[2 * j]] as [number, number]), 1.002)}
            fill="none" stroke={C.key} strokeWidth={2} strokeDasharray="8 6" opacity={0.7} />)}</g>
          {places.map(([nm, la, lo, t0, off]) => { const q = p(la, lo); const big = off[0] === 0 && off[1] === 0;
            // K6 round 1: the country names belong to the opening view; on the zoom back out they crowded together (India / Myanmar
            // / Bangladesh 6 px apart at 32:15)
            const o = fin(f, t0) * (big ? (cam.dist > 1.7 ? 1 : 0) * fout(f, t20 + 40) : (near ? 1 : 0)) * fout(f, LEN(k) - 14);
            return <Place key={nm} p={q} t={nm} r={big ? 0 : 9} dx={big ? 0 : off[0]} dy={big ? 0 : off[1]} a={big ? "middle" : off[0] < 0 ? "end" : "start"} o={o} />; })}
          <g opacity={near ? fin(f, t20 + 40) * fout(f, LEN(k) - 14) : 0}>
            <circle cx={p(AMP.landfall[0], AMP.landfall[1])[0]} cy={p(AMP.landfall[0], AMP.landfall[1])[1]} r={16} fill="none" stroke={C.gold} strokeWidth={5} />
            {/* K6 round 1: a place name on the map: an outlined map label, as the other places (Place) */}
            <g data-lc-maplabel="1"><Lbl x={p(AMP.landfall[0], AMP.landfall[1])[0] - 24} y={p(AMP.landfall[0], AMP.landfall[1])[1] + 40} t="Sundarbans" c={C.key} s={T.floor} a="end" /></g>
            <circle cx={p(22.75, 89.3)[0]} cy={p(22.75, 89.3)[1]} r={70} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="12 9" opacity={fin(f, tDis)} />
          </g>
        </g>;
      }} />
      <GlobeFrame id="s21k" bottomAt={790} zoom={zoom} right={zoom} disc={{ c: G_PP0, r: G_DISC_R }} />
      <Svg>
        <Keyword f={f} text="storm 2: Cyclone Amphan" at={[1210, 120]} s={T.floor} appear={0} out={t18 - 20} />
        <Lbl x={1210} y={210} t="cyclone = tropical cyclone" c={C.key} s={T.floor} o={win(f, tRem, t18 - 20)} />
        <Lbl x={1210} y={280} t="May 2020" c={C.key} s={T.floor} o={win(f, tMay, t18 - 20)} />
        <Keyword f={f} text="IMD's top wind class:" at={[1210, 120]} s={T.floor} appear={t18} out={t20 - 20} />
        <Lbl x={1210} y={190} t="super cyclonic storm" c={C.key} s={T.key} o={win(f, t18 + 10, t20 - 20)} />
        <Lbl x={1210} y={270} t="18 May" c={C.key} s={T.floor} o={win(f, t18 + 20, t20 - 20)} />
        <Lbl x={1210} y={340} t="first since 1999 in the Bay" c={C.key} s={T.floor} o={win(f, t99, t20 - 20)} />
        <Lbl x={1210} y={410} t="a wind class, not harm" c={C.gold} s={T.floor} o={win(f, tWind, t20 - 20)} />
        <Lbl x={1210} y={500} t="Sidr 2007 · Aila 2009:" c={C.key} s={T.floor} o={win(f, tSidr, t20 - 20)} />
        <Lbl x={1210} y={560} t="weaker, but very harmful" c={C.key} s={T.floor} o={win(f, tSidr + 20, t20 - 20)} />
        <Keyword f={f} text="ashore: 20 May" at={[1210, 120]} s={T.key} appear={t20} out={LEN(k) - 14} />
        <Lbl x={1210} y={300} t={`closest to Kolkata ≈ ${Math.round(AMP.close.Kolkata.km)} km`} c={C.key} s={T.floor} o={win(f, tKol, LEN(k) - 14)} />
        <Lbl x={1210} y={370} t={`Satkhira ≈ ${Math.round(AMP.close.Satkhira.km)} km W`} c={C.key} s={T.floor} o={win(f, tSat, LEN(k) - 14)} />
        <Lbl x={1210} y={440} t={`Khulna ≈ ${Math.round(AMP.close.Khulna.km)} km W`} c={C.key} s={T.floor} o={win(f, tKhu, LEN(k) - 14)} />
        <Lbl x={1210} y={530} t="Khulna, Satkhira districts" c={C.gold} s={T.floor} o={win(f, tDis, LEN(k) - 14)} />
      </Svg>
      <SourceBelow text={SRC.ibtAmp} pic={{ x: 80, y: 40, w: 1000, h: 755 }} w={1740} name="s21 src" />{/* K6 r0: one line (two ran into the caption band) */}
    </Scene>
  );
};

// ================================================================ s22 Amphan's pinhole eye (MODIS Terra, 18 May)
const S22: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22_amphan_eye");
  const tEye = AT(k, 1, "pinhole eye"), tSame = SS(k, 2);
  const M = AMP.modis, cr = M.crop as number[];
  const PB = { x: 140, y: 50, w: 760, h: 760 };
  const B: MapBox = { lat0: cr[0], lat1: cr[1], lon0: cr[2], lon1: cr[3], ...PB };
  const P = mapP(B), e = P(M.eye[0], M.eye[1]);
  const z = 1 + 2.4 * prog(f, 10, tEye);                      // a slow zoom: 600 km → ≈ 250 km
  return (
    <Scene>
      <div style={{ position: "absolute", left: PB.x, top: PB.y, width: PB.w, height: PB.h, overflow: "hidden" }}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: -PB.x, top: -PB.y }}>
          <g transform={`translate(${e[0]} ${e[1]}) scale(${z}) translate(${-e[0]} ${-e[1]})`}>
            <GeoImg P={P} href={IMG("cst_modis_amphan.jpg")} box={cr} />
            <circle cx={e[0]} cy={e[1]} r={9} fill="none" stroke={C.gold} strokeWidth={2.5} opacity={fin(f, tEye)} />{/* M8: the eye now sits here (build fix) */}
          </g>
        </svg>
      </div>
      <Svg>
        <rect x={PB.x} y={PB.y} width={PB.w} height={PB.h} fill="none" stroke={C.grid} strokeWidth={3} />
        {/* #5b r1 M8: the cylinder in ink over a dark halo (key-white on white cloud was invisible) */}
        <g opacity={fin(f, tSame)}>
          {[[C.bg, 10], [C.ink, 4]].map(([col, w], j) => <g key={j} stroke={col as string} strokeWidth={w as number} fill="none" opacity={j ? 1 : 0.7}>
            <ellipse cx={e[0]} cy={e[1] - 230} rx={110} ry={30} /><ellipse cx={e[0]} cy={e[1]} rx={110} ry={30} />
            <line x1={e[0] - 110} y1={e[1]} x2={e[0] - 110} y2={e[1] - 230} /><line x1={e[0] + 110} y1={e[1]} x2={e[0] + 110} y2={e[1] - 230} />
          </g>)}
        </g>
        <Keyword f={f} text="18 May · two days before landfall" at={[MX, 120]} s={T.floor} appear={0} out={tEye - 20} />
        <SideCallout f={f} lines="pinhole eye" at={[MX, 300]} appear={tEye} target={[e[0] + 16, e[1]]} c={C.gold} />
        {/* Part 1 lessons B1: the zoom says what it magnifies (the frame's true width from the crop box, ÷ the zoom) */}
        <Lbl x={MX} y={420} t={String.raw`zoomed $${z.toFixed(1)}\times$: frame ≈ ${Math.round(((cr[3] - cr[2]) * 111.32 * Math.cos(((cr[0] + cr[1]) / 2) * D2R)) / z / 10) * 10} km wide`}
          c={C.muted} s={T.floor} o={fin(f, tEye)} />
        <Keyword f={f} text="same shape → same coordinates" at={[MX, 120]} s={T.floor} appear={tSame} />
      </Svg>
      <SourceBelow text={SRC.modis} pic={PB} w={1400} name="s22 src" />
    </Scene>
  );
};

// ================================================================ s23 Amphan's spin and inflow on a ring (ERA5 10 m), beside Ian's
const S23: React.FC = () => {
  const f = useCurrentFrame(), k = K("s23_amphan_ring");
  const tERA = AT(k, 1, "ERA5"), tRe = SS(k, 2), tBox = SS(k, 3), tHere = SS(k, 4), tOrig = SS(k, 5), tMeans = SS(k, 6), tACW = SS(k, 7), tOff = SS(k, 8), tWeak = SS(k, 9),
    tShape = SS(k, 10), tTan = SS(k, 11), tTwo = SS(k, 12);
  const PB = { x: 110, y: 50, w: 700, h: 760 };
  const B: MapBox = boxAt(21.0, 88.5, 7.0, PB.x, PB.y, PB.w, PB.h);
  const P = mapP(B), c = P(AMP.c[0], AMP.c[1]);
  const rpx = (AMP.ring_km / 111.2 / 7.0) * PB.h;
  const bx = (0.25 / 7.0) * PB.h;
  const sp = 3.2;                                             // px per m/s for the ring-mean arrows
  const a0 = 160 * D2R, rp: Pt = [c[0] + rpx * Math.cos(a0), c[1] - rpx * Math.sin(a0)];
  const vtV: Pt = [-Math.sin(a0) * AMP.vt10[0] * sp * 2, -Math.cos(a0) * AMP.vt10[0] * sp * 2];
  const vrV: Pt = [Math.cos(a0) * AMP.vr10[0] * sp * 2, -Math.sin(a0) * AMP.vr10[0] * sp * 2];
  const angT = Math.atan2(-vtV[1], vtV[0]), angW = Math.atan2(-(vtV[1] + vrV[1]), vtV[0] + vrV[0]);   // screen angles (y up), radians
  const angArc = arcD(rp, 70, Math.min(angT, angW) / D2R, Math.max(angT, angW) / D2R);
  // K6 round 1: the label (anchor end, left of the arc) ran out of the map's left edge; now centred under the two arrow tips
  const angLbl = polar(rp, 150, (angT + angW) / 2 / D2R);
  const oMap = fin(f, tHere - 10, 14) + (f < tHere ? 0.0 : 0);
  const [EQ23a, EQ23b] = cutAt(EQ_S23, String.raw`\ \Rightarrow\ `);   // K6 round 1: two lines
  return (
    <Scene>
      <GeoMap id="s23m" B={B} o={1}>
        {(Pp) => <>
          <GeoImg P={Pp} href={IMG("cst_amphan_speed.png")} box={AMP.img_box} o={0.95} />
          <path d={linesPath(Pp, AMP.coast_map)} fill="none" stroke={C.key} strokeWidth={2.5} />
          <path d={linesPath(Pp, AMP.borders_map)} fill="none" stroke={C.key} strokeWidth={2} strokeDasharray="8 6" opacity={0.75} />
          {(AMP.arrows as number[][]).map(([la, lo, u, v], i) => { const q = Pp(la, lo), s2 = 2.4;
            return <AnimatedWindArrow key={i} from={q} to={[q[0] + u * s2, q[1] - v * s2]} speed={Math.hypot(u, v)} f={f} c={C.ink} px={4} head={16} o={0.85} />; })}
        </>}
      </GeoMap>
      <Svg>
        <g opacity={fin(f, tOrig)}>
          <circle cx={c[0]} cy={c[1]} r={rpx} fill="none" stroke={C.key} strokeWidth={4} />
          {Array.from({ length: 72 }, (_, i) => <circle key={i} cx={c[0] + rpx * Math.cos((i * 5) * D2R)} cy={c[1] - rpx * Math.sin((i * 5) * D2R)} r={2.6} fill={C.key} />)}
          <Cross p={c} c={C.first} />
        </g>
        <rect x={c[0] + 120} y={c[1] + 120} width={bx} height={bx} fill="none" stroke={C.gold} strokeWidth={4} opacity={win(f, tBox, tOrig + 40)} />
        <g opacity={fin(f, tMeans)}>
          <AnimatedWindArrow from={rp} to={[rp[0] + vtV[0], rp[1] + vtV[1]]} speed={AMP.vt10[0]} f={f} c={C.first} px={9} head={30} />
          <AnimatedWindArrow from={rp} to={[rp[0] + vrV[0], rp[1] + vrV[1]]} speed={Math.abs(AMP.vr10[0])} f={f} c={C.neg} px={9} head={30} />
        </g>
        {/* fix 0 B24: the actual wind (round + in) and the inflow angle between it and the round arrow */}
        <g opacity={fin(f, tTan)}>
          <AnimatedWindArrow from={rp} to={[rp[0] + vtV[0] + vrV[0], rp[1] + vtV[1] + vrV[1]]} speed={Math.hypot(AMP.vt10[0], AMP.vr10[0])} f={f} c={C.ink} px={8} head={28} />
          <path d={angArc} fill="none" stroke={C.gold} strokeWidth={5} />
          <g data-lc-maplabel="1"><Lbl x={angLbl[0]} y={angLbl[1] + 10} t="inflow angle" c={C.gold} s={T.floor} a="middle" /></g>
        </g>
        <path d={arcD(c, rpx + 40, 30, 120)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tACW)} />
        <polyline points={`${polar(c, rpx + 40, 120)[0] + 4},${polar(c, rpx + 40, 120)[1] + 22} ${polar(c, rpx + 40, 120)[0]},${polar(c, rpx + 40, 120)[1]} ${polar(c, rpx + 40, 120)[0] + 24},${polar(c, rpx + 40, 120)[1] - 2}`}
          fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tACW)} />
        <Keyword f={f} text="same way as Ian's" at={[MX, 120]} s={T.key} appear={0} out={tERA - 20} />
        <Keyword f={f} text="ERA5: a reanalysis" at={[MX, 120]} s={T.key} appear={tERA} out={tHere - 20} />
        <Lbl x={MX} y={210} t="observations + a weather model" c={C.key} s={T.floor} o={win(f, tRe, tHere - 20)} />
        <SideCallout f={f} lines="one box ≈ 28 km" at={[MX, 290]} appear={tBox} out={tHere - 20} target={[c[0] + 120 + bx + 4, c[1] + 120 + bx / 2]} s={T.floor} c={C.gold} />
        <Keyword f={f} text="20 May · 06 UTC" at={[MX, 120]} s={T.key} appear={tHere} out={tWeak + 10} />
        <SideCallout f={f} lines="ERA5 centre · ring 50 km" at={[MX, 210]} appear={tOrig} out={tShape - 20} target={[c[0] + rpx + 6, c[1] - 20]} s={T.floor} c={C.first} />
        <SpeedBar x={836} y={90} w={120} hi={30} />{/* K6 r0: its "m/s" touched the keyword column; #5b r1 S16: 120 px wide, "m/s" ends ≈ 50 px before the keyword */}
        <Lbl x={MX} y={470} t={`$u_\\theta$ ≈ ${SAY.a_vt} m/s · $u_r$ ≈ −${Math.abs(SAY.a_vr)} m/s`} c={C.key} s={T.floor} o={win(f, tMeans, tOff - 10)} />
        <Lbl x={MX} y={540} t="anticlockwise, like Ian" c={C.key} s={T.floor} o={win(f, tACW, tOff - 10)} />
        <Lbl x={MX} y={600} t="both: northern hemisphere" c={C.key} s={T.floor} o={win(f, tACW + 20, tOff - 10)} />
        <Lbl x={MX} y={734} t="ERA5's storm: much too weak" c={C.local} s={T.floor} o={win(f, AT(k, 9, "so the reanalysis"), tShape - 20)} />{/* K6 round 1: under the taller rows */}
        <Keyword f={f} text="but the shape is right" at={[MX, 120]} s={T.key} appear={tShape} out={tTan - 20} />
        <Keyword f={f} text="derived in Part 1: inflow angle" at={[MX, 120]} s={T.floor} c={C.gold} appear={tTan + 4} out={tTwo - 20} />{/* remake 2026-11-07 (R16) */}
        {/* K6 round 1: the two angle lines ran to x 1897: each is split at "⇒" (the arctan on the line under its fraction), the storm
            labels move up, and "a similar spiral angle" takes the keyword place on its sentence */}
        <g opacity={fin(f, tTan)}>
          <Lbl x={MX} y={305} t="Amphan · 50 km · ERA5" c={C.key} s={T.floor} />
          <Lbl x={MX} y={357} t={`$u_\\theta$ = ${nf(AMP.vt10[0], 1)} · $u_r$ = ${nf(AMP.vr10[0], 1)}`} c={C.local} s={T.floor} />
          <Lbl x={MX} y={585} t="Ian · 25 km · HRRR" c={C.key} s={T.floor} />
          <Lbl x={MX} y={637} t="$u_\theta$ = 34.8 · $u_r$ = −13.3" c={C.local} s={T.floor} />
        </g>
        <Keyword f={f} text="a similar spiral angle" at={[MX, 120]} s={T.key} c={C.gold} appear={tTwo} />
      </Svg>
      {/* fix 0 B24: what the inflow angle is, then the angle step for each storm */}
      {/* #5b r1 S16: where "≈ 28 km" comes from */}
      <TeX s={String.raw`0.25^\circ\times111\ \mathrm{km}\approx28\ \mathrm{km}`} x={MX} y={370} size={44} c={C.gold} o={win(f, tBox + 20, tHere - 20)} />
      <TeX s={String.raw`\tan(\text{inflow angle})=\dfrac{|u_r|}{u_\theta}`} x={MX} y={215} size={46} o={fin(f, tTan)} />
      <TeX s={EQ23a} x={MX} y={440} size={44} o={fin(f, tTan + 20)} />
      <TeX s={String.raw`\Rightarrow\ ` + EQ23b} x={MX + 40} y={518} size={44} o={fin(f, tTan + 30)} />
      {/* #5b r1 S16: three decimals, so that the arctan values hold (arctan 0.38 = 20.8°, arctan 0.382 = 20.9°) */}
      <TeX s={String.raw`\dfrac{13.3}{34.8}\approx0.382`} x={MX} y={720} size={44} o={fin(f, tTan + 40)} />
      <TeX s={String.raw`\Rightarrow\ \arctan0.382\approx20.9^\circ\approx21^\circ`} x={MX + 40} y={798} size={44} o={fin(f, tTan + 50)} />
      {/* Part 1 lessons A7 / B2: each storm's inputs drawn as the right triangle the tangent is read from (legs: round u_θ teal, in |u_r|
          rose; the actual wind ink; the angle gold), at one scale (4.6 px per m/s), sides labelled */}
      <Svg>
        {[{ vt: AMP.vt10[0], vr: Math.abs(AMP.vr10[0]), x0: 1560, y0: 405, o: fin(f, tTan + 20), lt: nf(AMP.vt10[0], 1), lr: nf(Math.abs(AMP.vr10[0]), 1) },
          { vt: 34.8, vr: 13.3, x0: 1540, y0: 690, o: fin(f, tTan + 40), lt: "34.8", lr: "13.3" }].map((q, i) => {
          const sc = 4.6, x1 = q.x0 + q.vt * sc, y1 = q.y0 - q.vr * sc, ang = Math.atan2(q.vr, q.vt) / D2R;
          return <g key={i} opacity={q.o}>
            <line x1={q.x0} y1={q.y0} x2={x1} y2={q.y0} stroke={C.first} strokeWidth={5} />
            <line x1={x1} y1={q.y0} x2={x1} y2={y1} stroke={C.neg} strokeWidth={5} />
            <line x1={q.x0} y1={q.y0} x2={x1} y2={y1} stroke={C.ink} strokeWidth={4} />
            <path d={arcD([q.x0, q.y0], 46, 0, ang)} fill="none" stroke={C.gold} strokeWidth={4} />
            <Lbl x={(q.x0 + x1) / 2} y={q.y0 + 28} t={q.lt} c={C.first} s={T.floor} a="middle" />
            <Lbl x={x1 + 12} y={(q.y0 + y1) / 2} t={q.lr} c={C.neg} s={T.floor} />
          </g>; })}
      </Svg>
      {/* fix 0 B14: like with like: the official 90 kt in m/s, and the two lowest pressures; K6 round 1: the first row (to x 1897) split */}
      <CalcStack f={f} x={MX} y={440} size={44} maxLines={3} o={fout(f, tShape - 10)} rows={[
        { rhs: String.raw`\text{official (3-min): }90\ \mathrm{kt}`, at: tOff, c: C.local },
        // #5b r2 S7: the factor with its unit, and "kt" named, before it is used
        { rhs: String.raw`1\ \mathrm{kt}=1.852\ \mathrm{km/h}\quad(\text{kt: knot})`, at: AT(k, 8, "ninety knots"), c: C.local, cont: true },
        { rhs: String.raw`90\times1.852\approx167\ \mathrm{km/h}`, at: AT(k, 8, "ninety knots") + 18, c: C.local, cont: true },
        { rhs: String.raw`167\div3.6\approx${SAY.a_ms}\ \mathrm{m/s}`, at: AT(k, 8, "forty six"), c: C.local },
        // #5b r1 S16: the official 956 hPa on S8, where it is spoken; ERA5's 967 on S9
        { rhs: String.raw`\text{official lowest pressure: }${AMP.best06.hpa}\ \mathrm{hPa}`, at: AT(k, 8, "nine hundred and fifty six"), c: C.local },
        { rhs: String.raw`\text{ERA5's lowest pressure: }\approx${SAY.a_msl}\ \mathrm{hPa}`, at: tWeak, c: C.local },
      ]} />
      <SourceBelow text={SRC.era5} pic={PB} w={1400} o={oMap + 1} name="s23 src" />
    </Scene>
  );
};

// ================================================================ s24 Amphan's section beside Ian's
const VBar: React.FC<{ x: number; y: number; h: number; o?: number }> = ({ x, y, h, o = 1 }) => o <= 0 ? null : (
  <g opacity={o} data-k6-cbar="1">
    {Array.from({ length: 60 }, (_, i) => <rect key={i} x={x} y={y + (i * h) / 60} width={26} height={h / 60 + 0.8} fill={lutCss(LUT_UR, 1 - (i + 0.5) / 60)} />)}
    <rect x={x} y={y} width={26} height={h} fill="none" stroke={C.muted} strokeWidth={2} />
    {[[16, "+16"], [0, "0"], [-16, "−16"]].map(([v, t]) => <Lbl key={t as string} x={x + 40} y={y + h * (1 - ((v as number) + 16) / 32)} t={t as string} c={C.muted} s={T.floor} b={false} />)}
    {/* #5b r1 S20: "+ out" 26 px higher (it overlapped "+16") */}
    <Lbl x={x + 13} y={y - 96} t="m/s" c={C.muted} s={T.floor} a="middle" b={false} />
    <Lbl x={x + 13} y={y - 50} t="+ out" c="#8db5e2" s={T.floor} a="middle" />
    <Lbl x={x + 13} y={y + h + 34} t="− in" c={C.neg} s={T.floor} a="middle" />
  </g>
);
const S24: React.FC = () => {
  const f = useCurrentFrame(), k = K("s24_amphan_curtain");
  // user notes 2026-11-06 item 7: S4-S9 say and label the dark lines (the u_r = 0 m/s contour of each section: the border between in and
  // out; it wraps small weak pockets, so the two pictures' lines differ) and the parts with no colour (no data)
  const tSame = SS(k, 1), tIn = SS(k, 2), tOut = SS(k, 3), tLines = SS(k, 4), tPock = SS(k, 5), tDiff = SS(k, 6), tNoData = SS(k, 7), tCorner = SS(k, 8),
    tTopE = AT(k, 8, "along the top"), tFirst = SS(k, 9), tBlur = SS(k, 10), tFit = SS(k, 11);
  // K6 round 1: both panels and the bar 40 px lower: the keywords at y 50 sat on the "height (km)" titles and 4 px from the bar
  const BI = { x: 150, y: 150, w: 640, h: 500 }, BA = { x: 1160, y: 150, w: 640, h: 500 };
  const PI = (r: number, z: number) => secP(r, z, BI, 200), PA = (r: number, z: number) => secP(r, z, BA, 300);
  const am = AMP.sec, mn = PA(am.min[1], am.min[2]), mx = PA(am.max[1], am.max[2]);
  const ZI = SEC.zero as { line_pt: number[]; pocket: number[]; z_top: number; r_first: number; corner: number[] };
  const ZA = am.zero as { line_pt: number[]; pocket: number[]; z_top: number; r_first: number; corner: number[] };
  const zeroLbl = (P: (r: number, z: number) => Pt, z: { line_pt: number[] }, o: number) => { const q = P(z.line_pt[0], z.line_pt[1]);
    return o <= 0 ? null : <g data-lc-maplabel="1"><text x={q[0]} y={q[1]} fill="#1a1a24" fontSize={T.floor} fontFamily={FONT} fontWeight={650} textAnchor="middle"
      dominantBaseline="central" stroke="#f1ece0" strokeWidth={0.2 * T.floor} strokeLinejoin="round" paintOrder="stroke" opacity={o}>0</text></g>; };
  const ring = (P: (r: number, z: number) => Pt, z: { pocket: number[] }, o: number) => { const q = P(z.pocket[0], z.pocket[1]);
    return <circle cx={q[0]} cy={q[1]} r={58} fill="none" stroke={C.gold} strokeWidth={5} strokeDasharray="12 8" opacity={o} />; };
  /** a gold dashed outline of a no-data region given in (r, z) */
  const box = (P: (r: number, z: number) => Pt, r0: number, r1: number, z0: number, z1: number, o: number) => { const a = P(r0, z1), b = P(r1, z0);
    return <rect x={a[0] - 3} y={a[1] - 3} width={b[0] - a[0] + 6} height={b[1] - a[1] + 6} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="10 7" opacity={o} />; };
  const oL = fin(f, tLines + 10), oP = win(f, tPock, tNoData - 10) + 0.6 * pulse(f, tDiff, 40);
  const oC = win(f, tCorner, tBlur - 10), oT = win(f, tTopE, tBlur - 10), oF = win(f, tFirst, tBlur - 10);
  return (
    <Scene>
      <Svg>
        <image href={IMG("cst_sec_ian.png")} x={BI.x} y={BI.y} width={BI.w} height={BI.h} preserveAspectRatio="none" />
        <SecAxes B={BI} rMax={200} />
        <image href={IMG("cst_sec_amphan.png")} x={BA.x} y={BA.y} width={BA.w} height={BA.h} preserveAspectRatio="none" />
        <SecAxes B={BA} rMax={300} rt={[0, 100, 200, 300]} />
        <VBar x={935} y={244} h={380} />{/* #5b r2: 24 px lower, clear of the tags at y 68 (also while they rise in) */}
        <circle cx={mn[0]} cy={mn[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tIn)} />
        <circle cx={mx[0]} cy={mx[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tOut)} />
        {/* the u_r = 0 lines named on the pictures: a contour label "0" on each, the pockets ringed */}
        {zeroLbl(PI, ZI, oL)}{zeroLbl(PA, ZA, oL)}
        {ring(PI, ZI, oP)}{ring(PA, ZA, oP)}
        {/* no data: the corner below the sea surface, the strip above the top level, Amphan inside its first ring */}
        {box(PI, 0, ZI.corner[0], 0, ZI.corner[1], oC)}{box(PA, 0, ZA.corner[0], 0, ZA.corner[1], oC)}
        {box(PI, 0, 200, ZI.z_top, 16, oT)}{box(PA, 0, 300, ZA.z_top, 16, oT)}
        {box(PA, 0, ZA.r_first, 0, 16, oF)}
        <InUpOut f={f} P={PI} rIn={[30, 170]} rUp={40} zTop={15.5} o={fin(f, tBlur)} />
        <InUpOut f={f} P={PA} rIn={[60, 260]} rUp={70} zTop={15.0} o={fin(f, tBlur)} />
        <Keyword f={f} text="Ian (left) · Amphan (right)" at={[150, 68]} s={T.floor} appear={0} out={tIn - 20} />
        <Keyword f={f} text={`≈ ${nf(am.min[0], 0)} m/s, 100 km, ≈ 0.2 km up`} at={[700, 68]} s={T.floor} appear={tIn} out={tOut - 20} />
        <Keyword f={f} text={`≈ +${Math.round(am.max[0])} m/s near the top`} at={[700, 68]} s={T.floor} appear={tOut} out={tLines - 20} />
        <Keyword f={f} text="dark line: $u_r$ = 0 m/s · in | out border" at={[560, 68]} s={T.floor} appear={tLines} out={tPock - 20} />
        <Keyword f={f} text="it wraps weak pockets" at={[560, 68]} s={T.floor} c={C.gold} appear={tPock} out={tDiff - 20} />
        <Keyword f={f} text="pockets differ · big pattern the same" at={[560, 68]} s={T.floor} appear={tDiff} out={tNoData - 20} />
        <Keyword f={f} text="no colour: no data" at={[560, 68]} s={T.floor} appear={tNoData} out={tCorner - 20} />
        <Keyword f={f} text="below the sea surface · above the top level" at={[560, 68]} s={T.floor} c={C.gold} appear={tCorner} out={tFirst - 20} />
        <Keyword f={f} text={`Amphan: starts ${Math.round(ZA.r_first)} km out`} at={[560, 68]} s={T.floor} c={C.gold} appear={tFirst} out={tBlur - 20} />
        <Keyword f={f} text="in, up and out · same picture" at={[700, 68]} s={T.floor} c={C.gold} appear={tFit} />
      </Svg>
      <SourceBelow text="Data: NOAA HRRR analysis · 28 Sep 2022, 18 UTC" pic={{ x: BI.x - 70, y: BI.y, w: BI.w + 70, h: BI.h + 100 }} w={700} name="s24 src i" />
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 20 May 2020, 06 UTC" pic={{ x: BA.x - 70, y: BA.y, w: BA.w + 70, h: BA.h + 100 }} w={700} name="s24 src a" />
    </Scene>
  );
};

// ================================================================ s25 why cylindrical coordinates: three good reasons
const S25: React.FC = () => {
  const f = useCurrentFrame(), k = K("s25_why_cylindrical");
  const tThree = SS(k, 1), tShape = SS(k, 2), tPhys = SS(k, 4), tEN = SS(k, 6), tMean = SS(k, 7), tParts = SS(k, 8);
  // #5b r2 S10: the ring smaller and 20 px clear of the map above it (it overlapped by 20 px); the parcel at -20° so that its arrows
  // stay off the map's bottom edge and the u/v chart
  const c1: Pt = [280, 300], c2: Pt = [280, 540], rc = 90, aP = -20;
  const mini = { x: 470, y: 170, w: 420, h: 260 };
  const ring = (c: Pt, r: number) => <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={C.local} strokeWidth={4} />;
  const xs = Array.from({ length: 73 }, (_, i) => i * 5);
  const G: Ax = { x: 600, y: 470, w: 290, h: 130, xr: [0, 360], yr: [-50, 50] };
  return (
    <Scene>
      <Svg>
        <g opacity={0.35 + 0.65 * fin(f, tShape)}>
          <image href={IMG("cst_ur_925.png")} x={c1[0] - 130} y={c1[1] - 130} width={260} height={260} />
          <Arrow p={[c1[0] + 136, c1[1]]} q={[mini.x - 6, c1[1]]} color={C.gold} w={6} head={22} />{/* #5b r1 S21: long enough to read as an arrow */}
          <image href={IMG("cst_sec_ian.png")} x={mini.x} y={mini.y} width={mini.w} height={mini.h} preserveAspectRatio="none" />
          <rect x={mini.x} y={mini.y} width={mini.w} height={mini.h} fill="none" stroke={C.grid} strokeWidth={3} />
        </g>
        <g opacity={fin(f, tPhys)}>
          {ring(c2, rc)}
          <Arrow p={polar(c2, rc, aP)} q={[polar(c2, rc, aP)[0] - 80 * Math.sin(aP * D2R), polar(c2, rc, aP)[1] - 80 * Math.cos(aP * D2R)]} color={C.first} w={8} head={28} />
          <Arrow p={polar(c2, rc, aP)} q={polar(c2, 30, aP)} color={C.neg} w={8} head={28} />
          <g opacity={fin(f, tEN)}>
            <Axes A={G} xt={[0, 180, 360]} yt={[-40, 0, 40]} xf={(v) => `${v}°`} zero />
            <Curve A={G} xs={(RING.az as number[]).concat([360])} ys={(RING.u as number[]).concat([RING.u[0]])} c={C.second} w={4} />
            <Curve A={G} xs={(RING.az as number[]).concat([360])} ys={(RING.vv as number[]).concat([RING.vv[0]])} c={C.local} w={4} dash="10 8" />{/* #5b r1 S21: slate (teal is u_θ) */}
            {/* #5b r2 S10: the unit on the chart */}
            <Lbl x={G.x + G.w + 10} y={G.y + 20} t="u (m/s)" c={C.second} s={T.floor} />
            <Lbl x={G.x + G.w + 10} y={G.y + 80} t="v (m/s)" c={C.local} s={T.floor} />
          </g>
        </g>
        {/* #5b r2 S10: the disc 30 px lower, so the "up" arrow stays clear of the source line above it */}
        <g opacity={fin(f, tMean)} transform="translate(0 30)">
          <ellipse cx={280} cy={800 - 40} rx={110} ry={26} fill="none" stroke={C.key} strokeWidth={3} />
          <Arrow p={[390, 760]} q={[330, 760]} color={C.neg} w={7} head={24} o={fin(f, tParts)} />
          <Arrow p={[280, 735]} q={[360, 720]} color={C.first} w={7} head={24} o={fin(f, tParts + 20)} />
          <Arrow p={[200, 760]} q={[200, 705]} color={C.local} w={7} head={24} o={fin(f, tParts + 40)} />
          <Lbl x={430} y={760} t="in · round · up" c={C.key} s={T.floor} o={fin(f, tParts)} />
        </g>
        <Keyword f={f} text="why cylindrical?" at={[MX, 120]} s={T.key} appear={0} out={tThree - 20} />
        <Keyword f={f} text="three good reasons" at={[MX, 120]} s={T.key} appear={tThree} />
        <Keyword f={f} text="1 · shape" at={[MX, 230]} s={T.key} appear={tShape} />
        <Keyword f={f} text="2 · physics" at={[MX, 330]} s={T.key} appear={tPhys} />
        <Keyword f={f} text="3 · meaning" at={[MX, 560]} s={T.key} appear={tMean} />
        <URBar x={MX} y={680} w={360} title={false} />
      </Svg>
      <TeX s={EQ_S25} x={MX} y={440} size={64} o={fin(f, AT(k, 5, "minus v squared"))} />
      <SourceBelow text="Data: NOAA HRRR analysis · 28 Sep 2022, 18 UTC (mini pictures)" pic={{ x: 150, y: 170, w: 740, h: 450 }} w={740} name="s25 src" />
    </Scene>
  );
};

// ================================================================ s26-s27 back to Ian's coast: onshore wind, storm surge
const CB = CST.box as number[];
const coastMap = (x: number, y: number, h: number): MapBox => boxAt((CB[0] + CB[1]) / 2, (CB[2] + CB[3]) / 2, CB[1] - CB[0], x, y, (h * (CB[3] - CB[2]) * Math.cos(27 * D2R)) / (CB[1] - CB[0]), h);
const CoastBody: React.FC<{ P: (la: number, lo: number) => Pt; f: number }> = ({ P, f }) => <>
  <GeoImg P={P} href={IMG("cst_ian_speed_20.png")} box={CB} o={0.95} />
  <path d={linesPath(P, CST.coast)} fill="none" stroke={C.key} strokeWidth={2.5} />
  {(CST.arrows as number[][]).map(([la, lo, u, v], i) => { const q = P(la, lo), s2 = 2.0;
    return <AnimatedWindArrow key={i} from={q} to={[q[0] + u * s2, q[1] - v * s2]} speed={Math.hypot(u, v)} f={f} c={C.ink} px={4} head={16} o={0.8} />; })}
</>;
const GA = (x: number, y: number, w: number, h: number): Ax => ({ x, y, w, h, xr: [0, 36], yr: [-2.2, 2.6] });
const Gauges: React.FC<{ A: Ax; f: number; tF: number; tS: number; land?: boolean; labels?: boolean }> = ({ A, f, tF, tS, land = true, labels = true }) => {
  const G1 = CST.gauges["8725520"], G2 = CST.gauges["8726520"];
  const P = axP(A);
  const pk = P(G1.ext_h, G1.ext), tr = P(G2.ext_h, G2.ext);
  return (
    <g>
      {/* K6 round 1+: the date ticks were 12 px apart in s28 ("27 Sep 12" … 188-196 px wide): the days at midnight ("28 Sep"), noon as
          "12 UTC" (≥ 60 px apart at the narrowest chart, s28; the landfall tag says "≈ 19 UTC" on the same clock) */}
      {/* #5b r1 S25: the first tick (27 Sep 12 UTC) read as an ambiguous "12 UTC": the chart starts unlabelled; "12 UTC" follows "28 Sep" */}
      <Axes A={A} xt={[12, 24, 36]} yt={[-2, 0, 2]} xf={(v) => ["", "28 Sep", "12 UTC", "29 Sep"][v / 12]} yf={(v) => nf(v, 0, true)} zero
        yl="vs predicted tide (m)" />{/* K6 r0: the long axis title ran past 1842 */}
      <line x1={P(CST.land_h, 0)[0]} y1={A.y} x2={P(CST.land_h, 0)[0]} y2={A.y + A.h} stroke={C.local} strokeWidth={3} strokeDasharray="10 8" opacity={land ? 1 : 0} />
      <Lbl x={P(CST.land_h, 0)[0] - 10} y={A.y + 26} t="landfall ≈ 19 UTC" c={C.local} s={T.floor} a="end" o={land ? 1 : 0} />
      <Curve A={A} xs={G1.h} ys={G1.res} c={C.second} w={6} upto={prog(f, tF, tF + 60)} />
      <Curve A={A} xs={G2.h} ys={G2.res} c="#8db5e2" w={6} dash="14 9" upto={prog(f, tS, tS + 60)} />
      {/* K6 round 1: the end labels (one line each, 570-640 px) ran over the map, the colour bar and each other: two lines each, right
          of the chart's end (the gauge's value on its line's level) */}
      {labels ? <>
        <Lbl x={A.x + A.w + 16} y={pk[1] - 6} t={`≈ +${G1.ext.toFixed(1)} m`} c={C.second} s={T.floor} o={fin(f, tF + 50)} />{/* lint-ok: m is the unit metre */}
        <Lbl x={A.x + A.w + 16} y={pk[1] + 40} t="Fort Myers (upriver)" c={C.second} s={T.floor} o={fin(f, tF + 50)} />
        <Lbl x={A.x + A.w + 16} y={tr[1] - 44} t={`≈ ${nf(G2.ext, 1)} m`} c="#8db5e2" s={T.floor} o={fin(f, tS + 50)} />{/* lint-ok: m is the unit metre */}
        <Lbl x={A.x + A.w + 16} y={tr[1] + 2} t="Saint Petersburg" c="#8db5e2" s={T.floor} o={fin(f, tS + 50)} />
      </> : null}
    </g>
  );
};
// ================================================================ s29 the flight to Amphan's shelf and landfall (flood_visuals §v3: Amphan keeps the flight)
const S29: React.FC = () => {
  const f = useCurrentFrame(), k = K("s32_flood_flight");
  const tFly = SS(k, 1), tBlue = SS(k, 2), tLines = SS(k, 3), tDeep = AT(k, 3, "two hundred"), tShelf = SS(k, 4), tPile = SS(k, 5), tTrack = SS(k, 6), t20 = AT(k, 6, "twentieth");
  const keys = [
    { f: 0, lat: 18, lon: 60, dist: G_DIST0, pp: G_PP0 },
    { f: tFly, lat: 18, lon: 60, dist: G_DIST0, pp: G_PP0 },
    { f: tFly + 120, lat: 19, lon: 89, dist: 1.55, pp: [600, 450] as Pt },
    { f: tShelf - 20, lat: 19, lon: 89, dist: 1.55, pp: [600, 450] as Pt },
    { f: tShelf + 50, lat: 21.4, lon: 89.0, dist: 1.16, pp: [600, 450] as Pt },
    { f: tTrack - 10, lat: 21.4, lon: 89.0, dist: 1.16, pp: [600, 450] as Pt },
    { f: tTrack + 50, lat: 19.5, lon: 88.5, dist: 1.45, pp: [600, 450] as Pt },
    { f: LEN(k) + 10, lat: 21.0, lon: 88.4, dist: 1.2, pp: [600, 450] as Pt },
  ];
  const cam = globePath(keys, f);
  const zoom = clamp((G_DIST0 - cam.dist) / (G_DIST0 - 2.4), 0, 1);
  const bay = useTex(IMG("cst_bay_patch.png"));
  const bb = FLD.bay_box_wsen as number[];
  const iso = FLD.iso as Record<string, number[][]>;
  const grow = clamp((f - tTrack) / 120, 0, 1), nTr = Math.max(2, Math.round(trackLL.length * grow));
  const sh = FLD.shelf["89.0E"];
  return (
    <Scene>
      <Globe cam={cam} lines={AMP.coast} coast={0.35 * (1 - fin(f, tBlue))} drapes={[{ tex: bay, lat: [bb[1], bb[3]], lon: [bb[0], bb[2]], o: fin(f, tFly + 60, 30), r: 1.0015 }]}
        over={(G) => <g>
          {(["20", "200"] as const).map((lv) => (iso[lv] ?? []).map((l, i) => <path key={`${lv}${i}`} d={llPath(G, Array.from({ length: l.length / 2 }, (_, j) => [l[2 * j + 1], l[2 * j]] as [number, number]), 1.003)}
            fill="none" stroke={lv === "20" ? "#ffffff" : "#5d7fae"} strokeWidth={lv === "20" ? 3 + 2 * pulse(f, tLines, 30) : 3 + 2 * pulse(f, tDeep, 30)} opacity={fin(f, tLines)} />))}
          <g opacity={win(f, tShelf, tTrack)}>
            <line x1={G.p(sh.coast_lat, 89.0, 1.003)[0]} y1={G.p(sh.coast_lat, 89.0, 1.003)[1]} x2={G.p(sh.coast_lat - sh.km_to_20m / 111.2, 89.0, 1.003)[0]}
              y2={G.p(sh.coast_lat - sh.km_to_20m / 111.2, 89.0, 1.003)[1]} stroke={C.gold} strokeWidth={6} />
            {/* fix 0 B25e: the number on the shelf line itself */}
            {/* #5b r2 cosmetic: left of the line (on its right it sat on the white 20-m contour) */}
            <g data-lc-maplabel="1"><Lbl x={G.p(sh.coast_lat - sh.km_to_20m / 222.4, 89.0, 1.003)[0] - 18} y={G.p(sh.coast_lat - sh.km_to_20m / 222.4, 89.0, 1.003)[1] - 8}
              t={`≈ ${Math.round(sh.km_to_20m)} km`} c={C.gold} s={T.floor} a="end" /></g>
          </g>
          <path d={llPath(G, trackLL.slice(0, nTr), 1.004)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tTrack)} />
          <circle cx={G.p(AMP.landfall[0], AMP.landfall[1], 1.004)[0]} cy={G.p(AMP.landfall[0], AMP.landfall[1], 1.004)[1]} r={16} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, t20)} />
        </g>} />
      <GlobeFrame id="s29k" bottomAt={790} zoom={zoom} right={zoom} disc={{ c: G_PP0, r: G_DISC_R }} />
      <Svg>
        <Keyword f={f} text="floods seen from space" at={[1210, 120]} s={T.key} appear={0} out={tBlue - 20} />
        <Keyword f={f} text="sea depth" at={[1210, 120]} s={T.key} appear={tBlue} out={tShelf - 20} />
        <g opacity={fin(f, tBlue)}>
          {Array.from({ length: 40 }, (_, i) => <rect key={i} x={1210 + i * 12} y={260} width={12.8} height={24} fill={lutCss(LUT_DEPTH, (i + 0.5) / 40)} />)}
          <rect x={1210} y={260} width={480} height={24} fill="none" stroke={C.muted} strokeWidth={2} />
          {[[20, "20"], [200, "200"], [4000, "4000"]].map(([d, t]) => <Lbl key={t as string} x={1210 + (Math.log10(d as number) / Math.log10(4000)) * 480} y={316} t={t as string} c={C.muted} s={T.floor} a="middle" b={false} />)}
          <Lbl x={1210} y={222} t="sea depth (m)" c={C.muted} s={T.floor} b={false} />
        </g>
        <Lbl x={1210} y={400} t="white: 20 m · dark: 200 m" c={C.key} s={T.floor} o={win(f, tLines, tTrack - 20)} />
        <Keyword f={f} text={`< 20 m for ≈ ${Math.round(sh.km_to_20m)} km`} at={[1210, 120]} s={T.key} appear={tShelf} out={tTrack - 20} />
        <Lbl x={1210} y={480} t="a wide, shallow shelf" c={C.key} s={T.floor} o={win(f, tPile, tTrack - 20)} />
        <Keyword f={f} text="track · landfall 20 May" at={[1210, 120]} s={T.floor} appear={tTrack} />
      </Svg>
      <SourceBelow text={SRC.flight} pic={{ x: 80, y: 40, w: 1000, h: 755 }} w={1740} name="s29 src" />{/* K6 r0: one line */}
    </Scene>
  );
};

// ================================================================ the flood section (user notes 2026-11-06 items 8-11): shared swipe frame
/** the swipe line position (0 = left edge, 1 = right edge): starts at the RIGHT edge (all "before"), slow glide to the LEFT edge
 * (all "after"), hold, slow glide back to the RIGHT edge, hold, glide to the MIDDLE and stop (user, 2026-11-05); ≈ 4.5 s per
 * full width, eased */
export const swipeX = (f: number, t0: number) => {
  const G = 135, Hd = 45, seg = [t0, t0 + G, t0 + G + Hd, t0 + 2 * G + Hd, t0 + 2 * G + 2 * Hd, t0 + 2.5 * G + 2 * Hd];
  if (f <= seg[0]) return 1;
  if (f <= seg[1]) return 1 - prog(f, seg[0], seg[1]);
  if (f <= seg[2]) return 0;
  if (f <= seg[3]) return prog(f, seg[2], seg[3]);
  if (f <= seg[4]) return 1;
  return 1 - 0.5 * prog(f, seg[4], seg[5]);
};
/** the frames one full swipe takes (swipeX) */
const SWIPE_LEN = 2.5 * 135 + 2 * 45;
/** two sweeps in one scene: the first sweep from t1; from tBack the line glides from the middle back to the right edge (while the
 * pictures change colouring); the second sweep from t2 */
const swipe2 = (f: number, t1: number, tBack: number, t2: number) => f < tBack ? swipeX(f, t1) : f < t2 ? 0.5 + 0.5 * prog(f, tBack, tBack + 40) : swipeX(f, t2);
type Place3 = [string, number, number];
/** One before/after frame: the "after" picture fills the box, the "before" picture shows left of the line (house swipe rule). Two
 * colourings may cross-fade (`mixB` 0 = the first pair, 1 = the second). Place names step aside while the line passes (K6 round 1 lesson). */
const SwipeFrame: React.FC<{ f: number; PB: { x: number; y: number; w: number; h: number }; box: number[]; sx: number; pairs: [string, string][]; mixB?: number;
  tags: [string, string]; places: Place3[]; labelSide?: Record<string, [number, number, "start" | "end"]>; km: number; oLine?: number; oTags?: number; o?: number;
  oPlaces?: number; tagBL?: boolean; children?: React.ReactNode }> = ({ f, PB, box, sx, pairs, mixB = 0, tags, places, labelSide = {}, km, oLine = 1, oTags, o = 1, oPlaces = 1,
  tagBL = false, children }) => {
  if (o <= 0) return null;
  const B: MapBox = { lat0: box[1], lat1: box[3], lon0: box[0], lon1: box[2], ...PB };
  const P = mapP(B);
  const xl = PB.x + sx * PB.w;
  const oBef = clamp((xl - PB.x - 40) / 160, 0, 1), oAft = clamp((PB.x + PB.w - xl - 40) / 160, 0, 1);
  const kmPx = (km / (111.32 * Math.cos(((box[1] + box[3]) / 2) * D2R)) / (box[2] - box[0])) * PB.w;
  const nearO = (x0: number, x1: number) => { const d = xl < x0 ? x0 - xl : xl > x1 ? xl - x1 : 0; return clamp((d - 20) / 24, 0, 1); };
  const tw = (t: string) => textW(t, T.floor);
  const op = (j: number) => (pairs.length === 1 ? 1 : j === 0 ? 1 - mixB : mixB);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {pairs.map(([, aft], j) => op(j) <= 0 ? null : <div key={`a${j}`} style={{ position: "absolute", left: PB.x, top: PB.y, width: PB.w, height: PB.h, overflow: "hidden", opacity: op(j) }}>
        <Img src={IMG(aft as (typeof ASSET_NAMES)[number])} style={{ position: "absolute", left: 0, top: 0, width: PB.w, height: PB.h }} /></div>)}
      {pairs.map(([bef], j) => op(j) <= 0 ? null : <div key={`b${j}`} style={{ position: "absolute", left: PB.x, top: PB.y, width: sx * PB.w, height: PB.h, overflow: "hidden", opacity: op(j) }}>
        <Img src={IMG(bef as (typeof ASSET_NAMES)[number])} style={{ position: "absolute", left: 0, top: 0, width: PB.w, height: PB.h }} /></div>)}
      <Svg>
        <rect x={PB.x} y={PB.y} width={PB.w} height={PB.h} fill="none" stroke={C.grid} strokeWidth={3} />
        <line x1={xl} y1={PB.y} x2={xl} y2={PB.y + PB.h} stroke={C.gold} strokeWidth={6} opacity={oLine} />
        {places.map(([nm, la, lo]) => { const q = P(la, lo), sd = labelSide[nm] ?? [16, -30, "start"];
          const x0 = sd[2] === "end" ? q[0] + sd[0] - tw(nm) : q[0] + sd[0], x1 = sd[2] === "end" ? q[0] + sd[0] : q[0] + sd[0] + tw(nm);
          return <Place key={nm} p={q} t={nm} dx={sd[0]} dy={sd[1]} r={8} a={sd[2]} o={oPlaces * fin(f, 8) * nearO(Math.min(x0, q[0] - 10), Math.max(x1, q[0] + 10))} />; })}
        <line x1={PB.x + PB.w - 40 - kmPx} y1={PB.y + PB.h - 30} x2={PB.x + PB.w - 40} y2={PB.y + PB.h - 30} stroke={C.key} strokeWidth={6}
          opacity={nearO(PB.x + PB.w - 40 - kmPx, PB.x + PB.w - 40)} />
        <Lbl x={PB.x + PB.w - 40 - kmPx / 2} y={PB.y + PB.h - 64} t={`${km} km`} c={C.key} s={T.floor} a="middle"
          o={nearO(PB.x + PB.w - 40 - kmPx / 2 - tw(`${km} km`) / 2, PB.x + PB.w - 40 - kmPx / 2 + tw(`${km} km`) / 2)} />
        <g opacity={nearO(PB.x + 40, PB.x + 110)}><Arrow p={[PB.x + 50, PB.y + 120]} q={[PB.x + 50, PB.y + 40]} color={C.key} w={5} head={20} /></g>
        <Lbl x={PB.x + 80} y={PB.y + 70} t="N" c={C.key} s={T.floor} o={nearO(PB.x + 80, PB.x + 80 + tw("N"))} />{/* lint-ok: N = north on the compass arrow */}
        {/* notes 2 S4: `tagBL` puts the "before" tag at the bottom left (s30: Satkhira's dot sat on it at the top) */}
        <Lbl x={tagBL ? PB.x + 30 : PB.x + 130} y={tagBL ? PB.y + PB.h - 36 : PB.y + 48} t={tags[0]} c={C.key} s={T.floor}
          o={(oTags ?? oLine) * oBef * nearO(tagBL ? PB.x + 30 : PB.x + 130, (tagBL ? PB.x + 30 : PB.x + 130) + tw(tags[0]))} />
        <Lbl x={PB.x + PB.w - 20} y={PB.y + 48} t={tags[1]} c={C.key} s={T.floor} a="end" o={(oTags ?? oLine) * oAft * nearO(PB.x + PB.w - 20 - tw(tags[1]), PB.x + PB.w - 20)} />
        {children}
      </Svg>
    </AbsoluteFill>
  );
};
/** the house colour-key swatches (icons inside their box: a filled square with a muted rim), in a 2-column grid */
const Swatches: React.FC<{ f: number; x: number; y: number; items: [string, string][]; t0: number; dt?: number }> = ({ f, x, y, items, t0, dt = 12 }) => <>
  {items.map(([t, c], i) => <g key={t} opacity={fin(f, t0 + dt * i)}>
    <rect x={x + (i % 2) * 360} y={y + Math.floor(i / 2) * 70} width={44} height={44} fill={c} stroke={C.muted} strokeWidth={2} />
    <Lbl x={x + 60 + (i % 2) * 360} y={y + 22 + Math.floor(i / 2) * 70} t={t} c={C.key} s={T.floor} /></g>)}
</>;
const rgbHex = (q: number[]) => `#${q.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;

// ================================================================ s30 Amphan's flood: why no ordinary before/after, then the Sentinel-1 radar pair
const AS1 = D.amphan_s1;
// user notes 2026-11-06: the new screen numbers = the data (DS31-DS37 in the builder; the render fails otherwise)
const CHECK_U1: [string, number, number, number][] = [
  ["s1 km2", D.amphan_s1.new_km2, 124.9, 0.05], ["say s1", D.say.s1_km2, 125, 0], ["sqrt125", Math.sqrt(125), 11.2, 0.05],
  ["n kt", D.nargis.lf_kt, 90, 0], ["n kmh", D.nargis.lf_kt * 1.852, D.say.n_kmh, 0.5], ["n ms", D.say.n_kmh / 3.6, D.say.n_ms, 0.5],
  ["i kt", D.idai.lf_kt, 85, 0], ["i kmh", D.idai.lf_kt * 1.852, D.say.i_kmh, 0.5], ["i ms", D.say.i_kmh / 3.6, D.say.i_ms, 0.5],
  ["amphan first ring", D.amphan.sec.zero.r_first, 25, 0.5], ["dtheta deg", 0.01 / D2R, 0.57, 0.005],
  // notes 2 S5: ≈ 34 700 pixels × (60 m × 60 m = 3600 m² = 0.0036 km²) ≈ 125 km² (DS38)
  ["s1 npx", D.amphan_s1.n_new_px, 34700, 50], ["say npx", SAY.s1_npx, 34700, 0], ["s1 px m", D.amphan_s1.px_m, 60, 0.5], ["px area", 60 * 60 / 1e6, SAY.s1_px_km2, 1e-12],
  ["npx x area", D.amphan_s1.n_new_px * D.amphan_s1.km2_px, D.amphan_s1.new_km2, 1e-6], ["said product", 34700 * SAY.s1_px_km2, 125, 0.5],
];
CHECK_U1.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
const S30: React.FC = () => {
  const f = useCurrentFrame(), k = K("s34_amphan_radar");
  // notes 2 S5: S8 "We count the pixels …", S9 the pixel area, S10 the product, S11 the square (was S9)
  const tCloud = SS(k, 1), tSmall = SS(k, 2), tRadar = SS(k, 3), tSend = SS(k, 4), tMirror = SS(k, 5), tHere = SS(k, 6), tSweep = SS(k, 7), tKm2 = SS(k, 8),
    tProd = SS(k, 10), tSq = SS(k, 11);
  const tCyan = AT(k, 8, "marked here in cyan"), tN = AT(k, 8, "thirty four thousand");
  const box = AS1.box_wsen as number[];
  const asp = ((box[2] - box[0]) * Math.cos(((box[1] + box[3]) / 2) * D2R)) / (box[3] - box[1]);
  const PB = { x: 80, y: 70, w: 1000, h: Math.round(1000 / asp) };
  const half = { w: 490, h: Math.round(490 / asp) };
  const oCl = fout(f, tRadar - 6, 14), oSch = win(f, tRadar, tHere - 14, 14), oPair = fin(f, tHere + 2, 14);
  // notes 2 S5: after the house sweep (right → left → right → middle) the line glides on to the LEFT edge, so the whole "after" picture shows
  // under the cyan count mask
  const tSw = AT(k, 7, "line moves"), tAll = Math.max(tSw + SWIPE_LEN + 24, tCyan);
  const sx = f < tAll ? swipeX(f, tSw) : 0.5 * (1 - prog(f, tAll, tAll + 50));
  const xl = PB.x + sx * PB.w;
  const kmPx = PB.w / ((box[2] - box[0]) * 111.32 * Math.cos(((box[1] + box[3]) / 2) * D2R));
  const side = Math.sqrt(125) * kmPx;
  const sqAt: Pt = [PB.x + 70, PB.y + PB.h - 60 - side];
  const greyLut = Array.from({ length: 16 }, (_, i) => rgbHex([i * 17, i * 17, i * 17]));
  const P1 = mapP({ lat0: box[1], lat1: box[3], lon0: box[0], lon1: box[2], x: 80, y: 260, w: half.w, h: half.h });
  const P2 = mapP({ lat0: box[1], lat1: box[3], lon0: box[0], lon1: box[2], x: 590, y: 260, w: half.w, h: half.h });
  const sat: Pt = [300, 150];
  return (
    <Scene>
      {/* S0-S2: the ordinary (natural-colour) pictures after landfall: cloud */}
      <Svg o={oCl}>
        {[["cst_amphan_clouds_21.jpg", 80, "21 May 2020", P1], ["cst_amphan_clouds_22.jpg", 590, "22 May 2020", P2]].map(([h, x, t, P]) => <g key={t as string}>
          <clipPath id={`s30c${x}`}><rect x={x as number} y={260} width={half.w} height={half.h} /></clipPath>
          <image href={IMG(h as "cst_amphan_clouds_21.jpg")} x={x as number} y={260} width={half.w} height={half.h} preserveAspectRatio="none" />
          <path d={linesPath(P as Proj, AS1.coast)} fill="none" stroke={C.gold} strokeWidth={2.5} opacity={0.9} clipPath={`url(#s30c${x})`} />
          <rect x={x as number} y={260} width={half.w} height={half.h} fill="none" stroke={C.grid} strokeWidth={3} />
          <Lbl x={x as number} y={225} t={t as string} c={C.key} s={T.floor} /></g>)}
        <Lbl x={80} y={260 + half.h + 50} t="gold line: the coast, under the cloud" c={C.gold} s={T.floor} />
      </Svg>
      <SourceBelow text="Images: NASA Worldview (MODIS Terra), natural colour · 21 and 22 May 2020" pic={{ x: 80, y: 260, w: 1000, h: half.h + 80 }} w={1000} o={oCl} name="s30 src clouds" />
      {/* S3-S5: how radar sees: a code-drawn satellite, microwave pulses, rough land returns some (bright), calm water reflects them away (dark) */}
      <Svg o={oSch}>
        <g transform={`translate(${sat[0]} ${sat[1]})`} opacity={fin(f, AT(k, 4, "Sentinel-1"))}>
          <rect x={-40} y={-24} width={80} height={48} rx={6} fill="#33415f" stroke={C.ink} strokeWidth={3} />
          <rect x={-150} y={-14} width={96} height={28} fill="#2c5a9e" stroke={C.ink} strokeWidth={2} /><rect x={54} y={-14} width={96} height={28} fill="#2c5a9e" stroke={C.ink} strokeWidth={2} />
        </g>
        <Lbl x={sat[0]} y={sat[1] - 62} t="Sentinel-1" c={C.key} s={T.floor} a="middle" o={fin(f, AT(k, 4, "Sentinel-1"))} />{/* notes 2 C6: on its name */}
        <rect x={120} y={640} width={420} height={60} fill="#5b6b3a" /><rect x={560} y={640} width={420} height={60} fill="#1c2f6e" />
        <Lbl x={330} y={740} t="land: rough" c={C.key} s={T.floor} a="middle" /><Lbl x={770} y={740} t="calm water: a mirror" c={C.key} s={T.floor} a="middle" />
        {[0, 1, 2].map((i) => { const ph = ((f - tSend) / 40 - i / 3 + 3) % 1; const o = f < tSend ? 0 : 1 - ph;
          return <g key={i} opacity={o}><path d={arcD(sat, 120 + ph * 420, -125, -55)} fill="none" stroke={C.second} strokeWidth={4} strokeDasharray="10 8" /></g>; })}
        <Arrow p={[330, 640]} q={[300, 230]} color={C.ink} w={7} head={26} o={fin(f, tMirror - 30)} />
        <Lbl x={350} y={520} t="echo back: bright" c={C.ink} s={T.floor} o={fin(f, tMirror - 30)} />
        <Arrow p={[770, 640]} q={[960, 300]} color={C.local} w={7} head={26} o={fin(f, tMirror)} />
        <Lbl x={985} y={380} t="bounces away: dark" c={C.local} s={T.floor} o={fin(f, tMirror)} />
      </Svg>
      {/* S6-S9: the radar pair */}
      <SwipeFrame f={f} PB={PB} box={box} sx={sx} pairs={[["cst_amphan_s1_before.jpg", "cst_amphan_s1_after.jpg"]]} tags={["before · 16 May", "after · 22 May"]}
        places={AS1.places as Place3[]} labelSide={{ Satkhira: [20, 4, "start"] }} km={25} oLine={fin(f, tSw - 8, 8) * fout(f, tAll + 50, 10)}
        oTags={fin(f, AT(k, 6, "sixteenth")) * fout(f, LEN(k) - 14)} o={oPair} tagBL>
        {/* notes 2 S5: the counted new-water pixels (DS38), on the "after" side of the line */}
        <clipPath id="s30new"><rect x={xl} y={PB.y} width={Math.max(0, PB.x + PB.w - xl)} height={PB.h} /></clipPath>
        <image href={IMG("cst_amphan_s1_new.png")} x={PB.x} y={PB.y} width={PB.w} height={PB.h} preserveAspectRatio="none" clipPath="url(#s30new)" opacity={fin(f, tCyan, 15)} />
        <g opacity={fin(f, tSq)}>
          <rect x={sqAt[0]} y={sqAt[1]} width={side} height={side} fill="none" stroke={C.gold} strokeWidth={5} />
          <g data-lc-maplabel="1"><Lbl x={sqAt[0] + side + 14} y={sqAt[1] + side / 2} t="11 km" c={C.gold} s={T.floor} /></g>
        </g>
      </SwipeFrame>
      <Svg>
        <Keyword f={f} text="Amphan's flood from space?" at={[MX + 40, 120]} s={T.floor} appear={0} out={tCloud - 20} />
        <Keyword f={f} text="clouds for days" at={[MX + 40, 120]} s={T.key} appear={tCloud} out={tSmall - 20} />
        <Keyword f={f} text="small patches, 250-m pixels" at={[MX + 40, 120]} s={T.floor} appear={tSmall} out={tRadar - 20} />
        <Keyword f={f} text="radar sees through clouds" at={[MX + 40, 120]} s={T.key} c={C.gold} appear={tRadar} out={tHere - 20} />
        <Keyword f={f} text="microwaves out, echo back" at={[MX + 40, 210]} s={T.floor} appear={tSend} out={tHere - 20} />
        <Keyword f={f} text="calm water: dark" at={[MX + 40, 290]} s={T.key} appear={tMirror} out={tHere - 20} />
        <Keyword f={f} text="Satkhira · the Sundarbans" at={[MX + 40, 120]} s={T.floor} appear={tHere} out={tKm2 - 20} />
        <Lbl x={MX + 40} y={200} t="16 May: before Amphan" c={C.key} s={T.floor} o={win(f, AT(k, 6, "sixteenth"), tKm2 - 20)} />
        <Lbl x={MX + 40} y={260} t="22 May: 2.5 days after landfall" c={C.key} s={T.floor} o={win(f, AT(k, 6, "twenty second"), tKm2 - 20)} />
        <Keyword f={f} text="count the new dark pixels" at={[MX + 40, 120]} s={T.floor} appear={tKm2} out={AT(k, 10, "a hundred and twenty five") - 20} />
        <Keyword f={f} text={`new water ≈ ${SAY.s1_km2} km²`} at={[MX + 40, 120]} s={T.key} c={C.gold} appear={AT(k, 10, "a hundred and twenty five")} />
        <g opacity={fin(f, tCyan)}><rect x={MX + 40} y={758} width={44} height={44} fill="#00e5ff" stroke={C.muted} strokeWidth={2} />
          <Lbl x={MX + 100} y={780} t="cyan: new water, counted" c={C.key} s={T.floor} /></g>
        {/* the key: grey = radar echo strength; dark = water */}
        <g opacity={oPair}>
          <ColourBar x={MX + 40} y={540} w={420} lut={greyLut} lo={-24} hi={0} unit="dB" title="radar echo strength" ticks={[{ v: -24, t: "−24" }, { v: -12, t: "−12" }, { v: 0, t: "0" }]} />
          <Lbl x={MX + 40} y={660} t="dark = water" c={C.key} s={T.floor} />
          <Lbl x={MX + 40} y={720} t="bright = land, trees, towns" c={C.key} s={T.floor} />
        </g>
      </Svg>
      {/* notes 2 S5: the inputs of the 125 km² (pixel count × pixel area), each on its words; on S11 the square's rows replace the pixel rows */}
      <TeX s={String.raw`\approx34\,700\ \text{pixels}`} x={MX + 40} y={210} size={44} o={win(f, tN, tSq - 10)} />
      <TeX s={String.raw`1\ \text{pixel}:\ ${SAY.s1_px_m}\ \mathrm m\times${SAY.s1_px_m}\ \mathrm m=3600\ \mathrm m^2`} x={MX + 40} y={280} size={44} o={win(f, AT(k, 9, "sixty metres"), tSq - 10)} />
      <TeX s={String.raw`=${SAY.s1_px_km2}\ \mathrm{km}^2`} x={MX + 190} y={350} size={44} o={win(f, AT(k, 9, "zero point"), tSq - 10)} />
      <TeX s={String.raw`34\,700\times${SAY.s1_px_km2}\approx${SAY.s1_km2}\ \mathrm{km}^2`} x={MX + 40} y={420} size={44} c={C.gold} o={fin(f, tProd)} />
      <TeX s={String.raw`\sqrt{125}\approx${Math.sqrt(125).toFixed(1)}\ \mathrm{km}`} x={MX + 40} y={210} size={46} c={C.gold} o={fin(f, AT(k, 11, "eleven"))} />
      <TeX s={String.raw`11\times11=121\approx125\ \mathrm{km}^2`} x={MX + 40} y={290} size={44} c={C.gold} o={fin(f, AT(k, 11, "eleven") + 20)} />
      <SourceBelow text="Data: ESA Copernicus Sentinel-1 radar · 16 and 22 May 2020" pic={PB} w={1000} o={oPair} name="s30 src s1" />
    </Scene>
  );
};

// ================================================================ s31 Cyclone Nargis as a case study (globe → Myanmar, the delta, the track, the eye, the zoom)
const NG = D.nargis;
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2008-04-25 12:00:00" → "25 Apr 2008, 12 UTC" (the track's date readout) */
const dayOf = (t: string) => `${Number(t.slice(8, 10))} ${MON[Number(t.slice(5, 7)) - 1]} ${t.slice(0, 4)}, ${t.slice(11, 13)} UTC`;
const NTR = (NG.track as [string, number, number, number | null][]);
const S31: React.FC = () => {
  const f = useCurrentFrame(), k = K("s35_nargis_intro");
  // notes 2 S2: S7 (× 1.852 → km/h) and S8 (why ÷ 3.6 → m/s) are new; later sentences +2
  const tGo = SS(k, 1), tRiver = SS(k, 2), tDelta = SS(k, 3), tForm = SS(k, 4), tPath = SS(k, 5), tLand = SS(k, 6), tCross = SS(k, 9), tPic = SS(k, 10), tFlood = SS(k, 11),
    tZoom = SS(k, 12);
  const crop = NAR.crop_wsen as number[], sb = NG.storm_box as number[];
  // the flat frame of s32 (its first frame is the natural-colour 'before' picture in this box)
  const PB = { x: 80, y: 60, w: 1000, h: Math.round((1000 * (crop[3] - crop[1])) / ((crop[2] - crop[0]) * Math.cos(16.4 * D2R))) };
  const Bd: MapBox = { lat0: crop[1], lat1: crop[3], lon0: crop[0], lon1: crop[2], ...PB };
  // notes 2 S6: wider (6.0° of latitude, was 4.2°) so the spiral bands round the eye show; the picture is contrast enhanced (builder storm_stretch)
  const Bs: MapBox = boxAt(16.0, 94.6, 6.0, PB.x, PB.y, PB.w, PB.h);
  // user notes item 9 (stills look_u1): the delta's geography and the storm picture are shown FLAT (a draped patch on the blurred globe read
  // as a pale rectangle); the globe carries the trip to Myanmar and the track; S10 zooms the flat storm map into the delta box (= s32 frame 0)
  const oDelta = win(f, tRiver + 24, tForm - 4, 20), oStorm = fin(f, tPic, 20), oEnd = prog(f, tZoom + 10, tZoom + 85);
  const oFlat = Math.max(oDelta, oStorm);
  const keys = [
    { f: 0, lat: 16, lon: 88, dist: G_DIST0, pp: G_PP0 },
    { f: tGo, lat: 16, lon: 88, dist: G_DIST0, pp: G_PP0 },
    { f: tGo + 75, lat: 17, lon: 95, dist: 1.9, pp: [600, 450] as Pt },
    { f: tRiver + 40, lat: 16.4, lon: 95.3, dist: 1.5, pp: [600, 450] as Pt },
    { f: tForm - 10, lat: 16.4, lon: 95.3, dist: 1.5, pp: [600, 450] as Pt },
    { f: tForm + 60, lat: 14.0, lon: 90.0, dist: 2.25, pp: [600, 450] as Pt },
    { f: tCross - 20, lat: 14.0, lon: 90.0, dist: 2.25, pp: [600, 450] as Pt },
    { f: tCross + 50, lat: 16.3, lon: 94.5, dist: 1.6, pp: [600, 450] as Pt },
    { f: LEN(k) + 10, lat: 16.3, lon: 94.5, dist: 1.6, pp: [600, 450] as Pt },
  ];
  const cam = globePath(keys, f);
  const zoom = clamp((G_DIST0 - cam.dist) / (G_DIST0 - 2.4), 0, 1);
  const grow = clamp((f - tForm) / Math.max(1, tCross + 40 - tForm), 0, 1);
  const ntr = NTR.map((q) => [q[1], q[2]] as [number, number]);
  const nTr = Math.max(2, Math.round(ntr.length * grow));
  const dIdx = Math.min(NTR.length - 1, nTr - 1);
  const lf = NG.landfall as number[], eye = NG.eye as number[];
  const near = cam.dist < 1.7;
  const Bz = lerpBox(Bs, Bd, oEnd);
  return (
    <Scene>
      <Globe cam={cam} lines={AMP.coast} coast={0.6} o={1 - oFlat} over={(G) => {
        const p = (la: number, lo: number) => G.p(la, lo, 1.003);
        return <g>
          <g opacity={fin(f, tForm)}>
            <path d={llPath(G, ntr.slice(0, nTr), 1.004)} fill="none" stroke={C.gold} strokeWidth={5} />
            {ntr.slice(0, nTr).map(([la, lo], i) => i % 4 === 0 && G.vis(la, lo) ? <circle key={i} cx={p(la, lo)[0]} cy={p(la, lo)[1]} r={5} fill={C.gold} /> : null)}
          </g>
          <circle cx={p(lf[0], lf[1])[0]} cy={p(lf[0], lf[1])[1]} r={16} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tLand)} />
          <rect x={Math.min(p(crop[3], crop[0])[0], p(crop[1], crop[0])[0])} y={p(crop[3], crop[0])[1]} width={p(crop[3], crop[2])[0] - p(crop[3], crop[0])[0]}
            height={p(crop[1], crop[0])[1] - p(crop[3], crop[0])[1]} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="12 8" opacity={win(f, tGo + 60, tRiver + 30)} />
          {[["Myanmar", 20.5, 96.0, tGo + 40, true], ["Bay of Bengal", 17.5, 89.0, tGo, true], ["Yangon", NG.yangon[0], NG.yangon[1], tCross, false]].map(([nm, la, lo, t0, big]) =>
            <Place key={nm as string} p={p(la as number, lo as number)} t={nm as string} r={big ? 0 : 9} dx={big ? 0 : 18} dy={big ? 0 : -30} a={big ? "middle" : "start"}
              o={fin(f, t0 as number) * (big ? (cam.dist > 1.5 ? 1 : 0) : near ? 1 : 0)} />)}
        </g>;
      }} />
      <GlobeFrame id="s31k" bottomAt={790} zoom={zoom} right={zoom} disc={{ c: G_PP0, r: G_DISC_R }} o={1 - oFlat} />
      {/* S2-S3: the delta, flat (MODIS natural colour, 21 Apr 2008): the river's many channels, low land */}
      <GeoMap id="s31d" B={Bd} o={oDelta} frame={1} children={(P) => <>
        <GeoImg P={P} href={IMG("cst_nargis_tc_before.jpg")} box={[crop[1], crop[3], crop[0], crop[2]]} />
      </>} over={(P) => <>
        {(NAR.places as Place3[]).filter((q) => q[0] === "Yangon" || q[0] === "Pathein").map(([nm, la, lo]) => <Place key={nm} p={P(la, lo)} t={nm} dx={nm === "Yangon" ? -16 : 16}
          dy={-30} r={8} a={nm === "Yangon" ? "end" : "start"} />)}
        <ellipse cx={P(16.02, 95.25)[0]} cy={P(16.02, 95.25)[1]} rx={260} ry={95} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="12 8" opacity={fin(f, AT(k, 2, "fans out"))} />
        <g data-lc-maplabel="1"><Lbl x={P(16.02, 95.25)[0]} y={P(16.02, 95.25)[1] - 112} t="channels" c={C.gold} s={T.floor} a="middle" o={fin(f, AT(k, 2, "fans out"))} /></g>
        <g data-lc-maplabel="1"><Lbl x={P(16.62, 95.3)[0]} y={P(16.62, 95.3)[1]} t="Irrawaddy delta" c={C.key} s={T.floor} a="middle" o={fin(f, tDelta)} /></g>
      </>} />
      {/* S8-S10: the storm on 2 May (MODIS Aqua), flat, with the coast and the eye; S10 zooms into the delta box */}
      <GeoMap id="s31s" B={Bz} o={oStorm} frame={1} children={(P) => <>
        <GeoImg P={P} href={IMG("cst_nargis_storm.jpg")} box={[sb[0], sb[1], sb[2], sb[3]]} o={1 - oEnd} />
        <GeoImg P={P} href={IMG("cst_nargis_tc_before.jpg")} box={[crop[1], crop[3], crop[0], crop[2]]} o={oEnd} />
        <path d={linesPath(P, NG.coast)} fill="none" stroke={C.gold} strokeWidth={2.5} opacity={0.9 * (1 - oEnd)} />
        <path d={poly(ntr.filter((q) => q[1] > 91).map((q) => P(q[0], q[1])))} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="10 8" opacity={0.8 * (1 - oEnd)} />
      </>} over={(P) => <>
        <circle cx={P(eye[0], eye[1])[0]} cy={P(eye[0], eye[1])[1]} r={30} fill="none" stroke={C.gold} strokeWidth={5} opacity={win(f, AT(k, 10, "eye"), tZoom + 10)} />
        <g data-lc-maplabel="1"><Lbl x={P(eye[0], eye[1])[0]} y={P(eye[0], eye[1])[1] + 64} t="eye" c={C.gold} s={T.floor} a="middle" o={win(f, AT(k, 10, "eye"), tZoom + 10)} /></g>
        {/* notes 2 C8: north of the dashed track (it ran through the label) */}
        <g data-lc-maplabel="1"><Lbl x={P(17.0, 95.3)[0]} y={P(17.0, 95.3)[1]} t="Irrawaddy delta" c={C.key} s={T.floor} a="middle" o={win(f, tPic + 20, tZoom + 10)} /></g>
      </>} />
      <Svg>
        <Keyword f={f} text="Cyclone Nargis · May 2008" at={[1210, 120]} s={T.floor} appear={AT(k, 0, "Cyclone Nargis") - 6} out={tRiver - 20} />{/* notes 2 C2: on its words */}
        <Keyword f={f} text="Irrawaddy (Ayeyarwady)" at={[1210, 120]} s={T.floor} appear={tRiver} out={tForm - 20} />
        <Lbl x={1210} y={210} t="many channels to the sea" c={C.key} s={T.floor} o={win(f, AT(k, 2, "fans out"), tForm - 20)} />
        {/* DS32: 90 % of the delta's land ≤ 5 m above the sea (ETOPO 2022); said as "most of it only a few metres above the sea" */}
        <Lbl x={1210} y={280} t="a low, flat plain" c={C.key} s={T.floor} o={win(f, tDelta, tForm - 20)} />
        <Lbl x={1210} y={340} t="mostly a few metres" c={C.key} s={T.floor} o={win(f, tDelta + 30, tForm - 20)} />
        <Lbl x={1210} y={400} t="above the sea" c={C.key} s={T.floor} o={win(f, tDelta + 30, tForm - 20)} />
        <Keyword f={f} text="formed: late April" at={[1210, 120]} s={T.floor} appear={tForm} out={tPic - 20} />
        <Lbl x={1210} y={200} t={dayOf(NTR[dIdx][0])} c={C.gold} s={T.floor} o={win(f, tForm, tPic - 20)} />
        <Lbl x={1210} y={270} t="west → north → east" c={C.key} s={T.floor} o={win(f, tPath, tPic - 20)} />
        <Lbl x={1210} y={340} t="landfall: 2 May 2008" c={C.key} s={T.floor} o={win(f, tLand, tPic - 20)} />
        <Lbl x={1210} y={680} t="→ across the delta, to Yangon" c={C.key} s={T.floor} o={win(f, tCross, tPic - 20)} />
        <Keyword f={f} text="2 May · hours before landfall" at={[1210, 120]} s={T.floor} appear={tPic} out={tFlood - 20} />
        <Lbl x={1210} y={210} t="the eye: just off the coast" c={C.gold} s={T.floor} o={win(f, AT(k, 10, "eye"), tFlood - 20)} />
        <Keyword f={f} text="surge, rain: floods inland" at={[1210, 120]} s={T.floor} appear={tFlood} out={tZoom - 20} />
        <Keyword f={f} text="zoom in: the delta" at={[1210, 120]} s={T.floor} c={C.gold} appear={tZoom} />
      </Svg>
      {/* the official intensity at landfall, every step shown (IMD, 3-minute average) */}
      {/* notes 2 S2: every step said (S6 the knots, S7 × 1.852, S8 why ÷ 3.6) and drawn in the normal text colour (was slate) */}
      <CalcStack f={f} x={1210} y={420} size={44} maxLines={4} o={fout(f, tPic - 10)} rows={[
        { rhs: String.raw`\text{official (3-min): }${NG.lf_kt}\ \mathrm{kt}`, at: AT(k, 6, "ninety knots") },
        { rhs: String.raw`${NG.lf_kt}\times1.852\approx${SAY.n_kmh}\ \mathrm{km/h}`, at: AT(k, 7, "one point eight five two") },
        { rhs: String.raw`1\ \mathrm{km/h}=1000\ \mathrm m\ \text{in}\ 3600\ \mathrm s`, at: AT(k, 8, "a thousand metres") },
        { rhs: String.raw`${SAY.n_kmh}\div3.6\approx${SAY.n_ms}\ \mathrm{m/s}`, at: AT(k, 8, "divide by three point six") },
      ]} />
      <SourceBelow text="Data: IBTrACS v04r01 (NOAA NCEI) · Cyclone Nargis, 25 Apr-3 May 2008 · NASA Blue Marble · Natural Earth" pic={{ x: 80, y: 40, w: 1000, h: 755 }} w={1740}
        o={1 - oFlat} name="s31 src g" />
      <SourceBelow text="Image: NASA MODIS (Terra), natural colour, via Google Earth Engine · 21 Apr 2008 · the Irrawaddy delta" pic={PB} w={1000} o={win(f, tRiver + 46, tForm - 26, 6)} name="s31 src d" />
      <SourceBelow text={oEnd < 0.5 ? "Image: NASA Worldview (MODIS Aqua) · 2 May 2008 · coast: Natural Earth · track: IBTrACS v04r01 (NOAA NCEI)"
        : "Image: NASA MODIS (Terra), natural colour, via Google Earth Engine · 21 Apr 2008 · the Irrawaddy delta"} pic={PB} w={1000} o={fin(f, tPic + 22, 8)} name="s31 src s" />
    </Scene>
  );
};

// ================================================================ s32 the Nargis before/after: natural colour first, then false colour 7-2-1 (user notes item 8)
const S32: React.FC = () => {
  const f = useCurrentFrame(), k = K("s37_nargis_swipe");
  const tL = SS(k, 1), tR = SS(k, 2), tLook = SS(k, 3), tBrown = SS(k, 4), tFalse = SS(k, 5), tBands = SS(k, 6), tKey = SS(k, 7), tSoak = SS(k, 8), tSpot = SS(k, 9),
    tSame = SS(k, 10), tG2 = AT(k, 11, "line glides"), tPin = SS(k, 12), tLeft = SS(k, 13);
  const box = NAR.crop_wsen as number[];
  const PB = { x: 80, y: 60, w: 1000, h: 0 };
  PB.h = Math.round((PB.w * (box[3] - box[1])) / ((box[2] - box[0]) * Math.cos(16.4 * D2R)));
  // S1-S2: the frame shrinks into two half panels (before left, after right) on the date words; back to one frame before the sweep
  const tG1 = AT(k, 3, "line glides");
  const spl = prog(f, tL, tL + 24) * (1 - prog(f, tG1 - 42, tG1 - 8));
  const hw = 480, hh = Math.round((hw * PB.h) / PB.w), hy = PB.y + Math.round((PB.h - hh) / 2);
  // notes 2 M3: the natural sweep runs to its middle stop; on S5 ("So flood mappers use false colour") the natural pair dims and is titled
  // "next: false colour"; right after the middle stop it cross-fades to the false-colour pair (line held in the middle), so the band rows (S6)
  // and the colour key (S7) stand beside the false-colour picture; S10 "Here are the same two days" starts the second sweep as before
  const tX = Math.max(tG1 + 12 + SWIPE_LEN + 12, tFalse + 20);
  const mixB = prog(f, tX, tX + 30);
  const dimN = 0.45 * win(f, tFalse, tX + 30, 12);
  const sx = swipe2(f, tG1 + 12, tSame, tG2 + 12);
  const oSplit = clamp(spl * 3, 0, 1);
  const kr = NG.key_rgb as Record<string, number[]>;
  const pairs: [string, string][] = [["cst_nargis_tc_before.jpg", "cst_nargis_tc_after.jpg"], ["cst_swipe_before.jpg", "cst_swipe_after.jpg"]];  // lint-ok: asset file names, not maths
  return (
    <Scene>
      <SwipeFrame f={f} PB={PB} box={box} sx={sx} pairs={pairs} mixB={mixB} tags={[`before · ${NAR.BEFORE}`, `after · ${NAR.AFTER}`]} places={NAR.places as Place3[]}
        labelSide={{ Yangon: [-16, -30, "end"] }} km={50} oLine={fin(f, tG1 - 8, 8)} o={1 - oSplit} oPlaces={clamp(1 - 2 * oSplit, 0, 1)}>
        <rect x={PB.x} y={PB.y} width={PB.w} height={PB.h} fill={C.bg} opacity={dimN} />{/* notes 2 M3: the natural pair dims while the next colouring is announced */}
      </SwipeFrame>
      {/* the two half panels (natural colour) while the dates are said */}
      <Svg o={oSplit}>
        <image href={IMG("cst_nargis_tc_before.jpg")} x={PB.x} y={hy} width={hw} height={hh} preserveAspectRatio="none" />
        <image href={IMG("cst_nargis_tc_after.jpg")} x={PB.x + PB.w - hw} y={hy} width={hw} height={hh} preserveAspectRatio="none" opacity={0.4 + 0.6 * fin(f, tR, 14)} />
        <rect x={PB.x} y={hy} width={hw} height={hh} fill="none" stroke={C.grid} strokeWidth={3} />
        <rect x={PB.x + PB.w - hw} y={hy} width={hw} height={hh} fill="none" stroke={C.grid} strokeWidth={3} />
        <rect x={PB.x - 4} y={hy - 4} width={hw + 8} height={hh + 8} fill="none" stroke={C.gold} strokeWidth={6} opacity={pulse(f, tL + 24, 36)} />
        <rect x={PB.x + PB.w - hw - 4} y={hy - 4} width={hw + 8} height={hh + 8} fill="none" stroke={C.gold} strokeWidth={6} opacity={pulse(f, tR + 6, 36)} />
        <Lbl x={PB.x} y={hy - 36} t={`before · ${NAR.BEFORE}`} c={C.key} s={T.floor} o={fin(f, tL + 16) * clamp(2 * oSplit - 1, 0, 1)} />
        <Lbl x={PB.x + PB.w - hw} y={hy - 36} t={`after · ${NAR.AFTER}`} c={C.key} s={T.floor} o={fin(f, tR) * clamp(2 * oSplit - 1, 0, 1)} />
      </Svg>
      <Svg>
        <Keyword f={f} text="natural colour" at={[MX + 40, 120]} s={T.key} appear={0} out={tLook - 20} />
        <Lbl x={MX + 40} y={210} t="as our eyes would see it" c={C.key} s={T.floor} o={win(f, 10, tLook - 20)} />
        <Lbl x={MX + 40} y={290} t="landfall: 2 May 2008" c={C.key} s={T.floor} o={win(f, tL, tLook - 20)} />
        <Keyword f={f} text="look for the flood" at={[MX + 40, 120]} s={T.key} appear={tLook} out={tBrown - 20} />
        <Keyword f={f} text="hard to see: both brown" at={[MX + 40, 120]} s={T.key} appear={tBrown} out={tFalse - 20} />
        <g opacity={fout(f, tFalse - 10)}><Swatches f={f} x={MX + 40} y={210} t0={AT(k, 4, "muddy")} dt={20} items={[["muddy water", "#8a7a55"], ["wet soil", "#6f6446"]]} /></g>
        <Keyword f={f} text="next: false colour" at={[MX + 40, 120]} s={T.key} c={C.gold} appear={tFalse} out={tX - 8} />
        <Keyword f={f} text="false colour: bands 7-2-1" at={[MX + 40, 120]} s={T.key} c={C.gold} appear={tX + 10} out={tLeft - 20} />
        {/* the band rows on their words (S6) */}
        {[["shortwave infrared → red", "#e06a5a", Math.max(tX + 10, AT(k, 6, "shortwave infrared"))], ["near infrared → green", "#6fcf6a", Math.max(tX + 25, AT(k, 6, "paint them red"))],
          ["red light → blue", "#6a8fe0", Math.max(tX + 40, AT(k, 6, "ordinary red light"))]].map(([t, c, t0], i) =>
          <Lbl key={t as string} x={MX + 40} y={220 + i * 60} t={t as string} c={c as string} s={T.floor} o={win(f, t0 as number, tLeft - 20)} />)}
        {/* the colour key only once the false-colour picture is up (S7) */}
        <g opacity={fout(f, tLeft - 20)}>
          <Swatches f={f} x={MX + 40} y={420} t0={Math.max(tKey, tX + 30)} items={[["plants", rgbHex(kr.plants)], ["dry fields", rgbHex(kr["dry fields"])], ["clouds", rgbHex(kr.clouds)], ["water", rgbHex(kr.water)]]} />
        </g>
        <Lbl x={MX + 40} y={620} t="water soaks up infrared: dark" c={C.key} s={T.floor} o={win(f, tSoak, tLeft - 20)} />
        <Lbl x={MX + 40} y={690} t="the same two days" c={C.gold} s={T.floor} o={win(f, tSame, tPin - 20)} />
        <Lbl x={MX + 40} y={690} t="same latitudes and longitudes" c={C.key} s={T.floor} o={win(f, tPin, tLeft - 20)} />
        <Keyword f={f} text="what the surge left behind" at={[MX + 40, 120]} s={T.floor} c={C.local} appear={tLeft} />
        <Lbl x={MX + 40} y={210} t="dark water: the flood" c={C.key} s={T.floor} o={fin(f, tLeft)} />
      </Svg>
      <SourceBelow text={mixB < 0.5 ? "Images: NASA MODIS (Terra) via Google Earth Engine · natural colour (bands 1-4-3) · Cyclone Nargis, 21 Apr and 5 May 2008" : SRC.nargis}
        pic={{ x: PB.x, y: mix(PB.y, hy, spl), w: PB.w, h: mix(PB.h, hh, spl) }} w={1000} name="s32 src" />
    </Scene>
  );
};

// ================================================================ s33 Cyclone Idai, shorter (globe → Mozambique Channel, clockwise, the picture, Beira, the zoom)
const ID = D.idai;
const ITR = (ID.track as [string, number, number, number | null][]);
const S33: React.FC = () => {
  const f = useCurrentFrame(), k = K("s38_idai_intro");
  // notes 2 S2: S5 (× 1.852) and S6 (÷ 3.6) are new; later sentences +2
  const tYear = SS(k, 1), tCw = SS(k, 2), tPic = SS(k, 3), tLand = SS(k, 4), tBeira = SS(k, 7), tZoom = SS(k, 8);
  const crop = ID.crop_wsen as number[], vb = ID.viirs_box as number[];
  const keys = [
    { f: 0, lat: 0, lon: 70, dist: G_DIST0, pp: G_PP0 },
    { f: 20, lat: 0, lon: 70, dist: G_DIST0, pp: G_PP0 },
    { f: tYear, lat: -12, lon: 50, dist: 3.0, pp: [600, 450] as Pt },
    { f: tYear + 70, lat: -18, lon: 40, dist: 2.0, pp: [600, 450] as Pt },
    { f: tBeira - 10, lat: -18, lon: 40, dist: 2.0, pp: [600, 450] as Pt },
    { f: tBeira + 60, lat: -19.75, lon: 34.6, dist: 1.25, pp: [600, 450] as Pt },
    { f: tZoom, lat: -19.75, lon: 34.6, dist: 1.25, pp: [600, 450] as Pt },
    { f: tZoom + 60, lat: (crop[1] + crop[3]) / 2, lon: (crop[0] + crop[2]) / 2, dist: 1.055, pp: [580, 430] as Pt },
    { f: LEN(k) + 10, lat: (crop[1] + crop[3]) / 2, lon: (crop[0] + crop[2]) / 2, dist: 1.055, pp: [580, 430] as Pt },
  ];
  const cam = globePath(keys, f);
  const zoom = clamp((G_DIST0 - cam.dist) / (G_DIST0 - 2.4), 0, 1);
  const viirs = useTex(IMG("cst_idai_viirs.jpg"));
  const land = useTex(IMG("cst_idai_tc_before.jpg"));
  const itr = ITR.map((q) => [q[1], q[2]] as [number, number]);
  const grow = clamp((f - tYear) / 150, 0, 1), nTr = Math.max(2, Math.round(itr.length * grow));
  const lf = ID.landfall as number[];
  const k14 = ITR.findIndex((q) => q[0].startsWith("2019-03-14 12")), sp = itr[Math.max(0, k14)];
  const near = cam.dist < 1.5;
  const oV = win(f, tPic, tBeira + 30, 20), oLand = fin(f, tZoom + 20, 30), oEndFlat = fin(f, tZoom + 55, 20);
  const PBi = { x: 80, y: 50, w: Math.round((720 * (crop[2] - crop[0]) * Math.cos(19.8 * D2R)) / (crop[3] - crop[1])), h: 720 };
  return (
    <Scene>
      <Globe cam={cam} lines={ID.coast} coast={0.6} o={1 - oEndFlat} drapes={[
        { tex: viirs, lat: [vb[0], vb[1]], lon: [vb[2], vb[3]], o: oV, r: 1.0015 },
        { tex: land, lat: [crop[1], crop[3]], lon: [crop[0], crop[2]], o: oLand, r: 1.002 }]} over={(G) => {
        const p = (la: number, lo: number) => G.p(la, lo, 1.003);
        // the clockwise arc round the storm (southern hemisphere, seen from above): from north through east, south, west
        const arc: [number, number][] = Array.from({ length: 31 }, (_, i) => { const a = (i * 300) / 30; return [sp[0] + 3.2 * Math.cos(a * D2R), sp[1] + (3.2 * Math.sin(a * D2R)) / Math.cos(sp[0] * D2R)]; });
        const tip = p(arc[30][0], arc[30][1]), pre = p(arc[28][0], arc[28][1]);
        return <g>
          <g opacity={win(f, 0, tYear - 10, 20)}>
            <path d={llPath(G, Array.from({ length: 181 }, (_, i) => [0, -180 + 2 * i] as [number, number]), 1.002)} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="12 9" />
          </g>
          <g data-lc-maplabel="1"><Lbl x={p(1.5, 66)[0]} y={p(1.5, 66)[1] - 26} t="equator" c={C.gold} s={T.floor} a="middle" o={win(f, 10, tYear + 30)} /></g>
          <path d={llPath(G, itr.slice(0, nTr), 1.004)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tYear) * fout(f, tZoom - 16)} />
          <g opacity={win(f, tCw, tPic + 10)}>
            <path d={llPath(G, arc, 1.004)} fill="none" stroke={C.second} strokeWidth={6} />
            <Arrow p={pre} q={tip} color={C.second} w={6} head={26} />
          </g>
          <circle cx={p(lf[0], lf[1])[0]} cy={p(lf[0], lf[1])[1]} r={16} fill="none" stroke={C.gold} strokeWidth={5} opacity={win(f, tLand, tZoom - 16)} />
          {[["Madagascar", -19.5, 46.8, tYear + 30, true], ["Mozambique", -16.5, 36.5, tYear + 40, true], ["Africa", -8.0, 30.0, 30, true]].map(([nm, la, lo, t0, big]) =>
            <Place key={nm as string} p={p(la as number, lo as number)} t={nm as string} r={0} dx={0} dy={0} a="middle"
              o={fin(f, t0 as number) * (cam.dist > 1.5 ? 1 : 0) * fout(f, tBeira)} />)}
          {(ID.places as Place3[]).filter((q) => q[0] !== "Dondo").map(([nm, la, lo]) => <Place key={nm} p={p(la, lo)} t={nm} r={9} dx={nm === "Beira" ? 18 : -18} dy={nm === "Beira" ? -46 : 46}
            a={nm === "Beira" ? "start" : "end"} o={fin(f, AT(k, 7, nm)) * (near ? 1 : 0) * fout(f, tZoom + 20)} />)}
        </g>;
      }} />
      <GlobeFrame id="s33k" bottomAt={790} zoom={zoom} right={zoom} disc={{ c: G_PP0, r: G_DISC_R }} o={1 - oEndFlat} />
      <SwipeFrame f={f} PB={PBi} box={crop} sx={1} pairs={[["cst_idai_tc_before.jpg", "cst_idai_tc_after.jpg"]]} tags={["", ""]} places={ID.places as Place3[]}
        labelSide={{ Beira: [-16, -34, "end"], Buzi: [-16, 36, "end"], Dondo: [16, -30, "start"] }} km={25} oLine={0} o={oEndFlat} />
      <Svg>
        <Keyword f={f} text="south of the equator" at={[1210, 120]} s={T.key} appear={0} out={tYear - 20} />
        <Keyword f={f} text="Cyclone Idai · March 2019" at={[1210, 120]} s={T.floor} appear={tYear} out={tCw - 20} />
        <Lbl x={1210} y={210} t="the Mozambique Channel" c={C.key} s={T.floor} o={win(f, tYear + 30, tCw - 20)} />
        <Keyword f={f} text="clockwise (seen from above)" at={[1210, 120]} s={T.floor} c={C.second} appear={tCw} out={tPic - 20} />
        {/* the two hemispheres side by side: north anticlockwise, south clockwise */}
        <g opacity={win(f, tCw + 20, tPic - 20)}>
          {/* arcD / ArcHead angles in the maths sense: increasing = anticlockwise on screen (north up); ArcHead dir 1 = anticlockwise */}
          {[[1330, "north", 50, 350, 1, C.local], [1620, "south", 130, -170, -1, C.second]].map(([x, t, a0, a1, dir, c]) => <g key={t as string}>
            <path d={arcD([x as number, 330], 70, a0 as number, a1 as number)} fill="none" stroke={c as string} strokeWidth={5} />
            <ArcHead c={[x as number, 330]} r={70} a={a1 as number} dir={dir as 1 | -1} col={c as string} />
            <Lbl x={x as number} y={445} t={t as string} c={C.key} s={T.floor} a="middle" /></g>)}
        </g>
        <Keyword f={f} text="14 March 2019" at={[1210, 120]} s={T.floor} appear={tPic} out={tLand - 20} />
        <Keyword f={f} text="landfall near Beira" at={[1210, 120]} s={T.floor} appear={tLand} out={tBeira - 20} />
        <Lbl x={1210} y={210} t="night of 14-15 March" c={C.key} s={T.floor} o={win(f, tLand, tBeira - 20)} />
        <Keyword f={f} text="low, flat land: two rivers" at={[1210, 120]} s={T.floor} appear={tBeira} out={tZoom - 20} />
        <Keyword f={f} text="zoom in: Beira" at={[1210, 120]} s={T.floor} c={C.gold} appear={tZoom} />
      </Svg>
      {/* notes 2 S2: every step said (S4 the knots, S5 × 1.852, S6 ÷ 3.6) and drawn in the normal text colour (was slate) */}
      <CalcStack f={f} x={1210} y={300} size={44} maxLines={4} o={fout(f, tBeira - 10)} rows={[
        { rhs: String.raw`\text{official (10-min): }${ID.lf_kt}\ \mathrm{kt}`, at: AT(k, 4, "eighty five knots") },
        { rhs: String.raw`${ID.lf_kt}\times1.852\approx${SAY.i_kmh}\ \mathrm{km/h}`, at: AT(k, 5, "one point eight five two") },
        { rhs: String.raw`${SAY.i_kmh}\div3.6\approx${SAY.i_ms}\ \mathrm{m/s}`, at: AT(k, 6, "three point six") },
      ]} />
      <SourceBelow text={f < tPic ? "Data: IBTrACS v04r01 (NOAA NCEI) · Cyclone Idai, 9-16 Mar 2019 · NASA Blue Marble · Natural Earth"
        : f < tZoom ? "Image: NASA Worldview (VIIRS, Suomi NPP) · 14 Mar 2019 · IBTrACS v04r01 (NOAA NCEI) · NASA Blue Marble · Natural Earth"
          : "Image: NASA MODIS (Aqua) via Google Earth Engine · 11 Mar 2019 · NASA Blue Marble · Natural Earth"} pic={{ x: 80, y: 40, w: 1000, h: 755 }} w={1740} name="s33 src" />
    </Scene>
  );
};

// ================================================================ s34 the Idai before/after: natural colour, then false colour 7-2-1
const S34: React.FC = () => {
  const f = useCurrentFrame(), k = K("s40_idai_swipe");
  const tAgain = SS(k, 1), tSame = SS(k, 2), tWater = SS(k, 3), tCloud = SS(k, 4), tMore = SS(k, 5);
  const box = ID.crop_wsen as number[];
  // the Idai box is taller than wide (0.85° × 1.15° at 19.8 S): fixed height 720 px, width from the true local shape
  const PB = { x: 80, y: 50, w: 0, h: 720 };
  PB.w = Math.round((PB.h * (box[2] - box[0]) * Math.cos(19.8 * D2R)) / (box[3] - box[1]));
  const mixB = prog(f, tSame, tSame + 30);
  // notes 2 S3: the natural sweep starts on the scene's first words, so it reaches its middle stop (and holds ≈ 1.4 s) before S2 "Now the same
  // two days in false colour" (was: still gliding back at S2, no middle stop)
  const tG1 = Math.min(AT(k, 0, "on the eleventh"), SS(k, 0) + 15);
  const sx = swipe2(f, tG1, Math.max(tSame, tG1 + SWIPE_LEN + 20), tWater);
  const kr = NG.key_rgb as Record<string, number[]>;
  return (
    <Scene>
      {/* user notes item 10: the Buzi and Beira names apart (Beira above-left of its dot, Buzi below-left of its dot) */}
      <SwipeFrame f={f} PB={PB} box={box} sx={sx} pairs={[["cst_idai_tc_before.jpg", "cst_idai_tc_after.jpg"], ["cst_idai_721_before.jpg", "cst_idai_721_after.jpg"]]} mixB={mixB}
        tags={["before · 11 Mar", "after · 25 Mar"]} places={ID.places as Place3[]}
        labelSide={{ Beira: [-16, -34, "end"], Buzi: [-16, 36, "end"], Dondo: [16, -30, "start"] }} km={25} oLine={fin(f, tG1 - 8, 8)} />
      <Svg>
        <Keyword f={f} text="natural colour" at={[MX + 40, 120]} s={T.key} appear={0} out={tAgain - 20} />
        <Lbl x={MX + 40} y={210} t="11 Mar: 3.5 days before landfall" c={C.key} s={T.floor} o={win(f, AT(k, 0, "on the eleventh"), tSame - 20)} />
        <Lbl x={MX + 40} y={270} t="25 Mar: about 10 days after" c={C.key} s={T.floor} o={win(f, AT(k, 0, "twenty fifth"), tSame - 20)} />
        <Keyword f={f} text="hard to see again" at={[MX + 40, 120]} s={T.key} appear={tAgain} out={tSame - 20} />
        <Keyword f={f} text="false colour: bands 7-2-1" at={[MX + 40, 120]} s={T.key} c={C.gold} appear={tSame} out={tMore - 20} />
        <g opacity={fin(f, tSame)}>
          <Swatches f={f} x={MX + 40} y={420} t0={tSame + 10} dt={6} items={[["plants", rgbHex(kr.plants)], ["dry fields", rgbHex(kr["dry fields"])], ["clouds", rgbHex(kr.clouds)], ["water", rgbHex(kr.water)]]} />
        </g>
        <Lbl x={MX + 40} y={620} t="dark blue: floodwater" c={C.key} s={T.floor} o={fin(f, tWater)} />
        <Lbl x={MX + 40} y={690} t="white blobs: clouds" c={C.key} s={T.floor} o={fin(f, tCloud)} />
        <Keyword f={f} text="more: Floods from space" at={[MX + 40, 120]} s={T.floor} appear={tMore} />
      </Svg>
      <SourceBelow text={mixB < 0.5 ? "Images: NASA MODIS (Aqua, Terra) via Google Earth Engine · natural colour (bands 1-4-3) · Cyclone Idai, 11 and 25 Mar 2019"
        : "Images: NASA MODIS (Aqua, Terra) via Google Earth Engine · bands 7-2-1 · Cyclone Idai, 11 and 25 Mar 2019"} pic={PB} w={1000} name="s34 src" />
    </Scene>
  );
};

// ================================================================ s35 recap (one beat per sentence, mini pictures)
const S35: React.FC = () => {
  const f = useCurrentFrame(), k = K("s41_recap");
  const t = (j: number) => SS(k, j);
  // #5b r1 S23 (D3): each recap keyword at full strength to the END of its sentence; the next one starts 18 frames after that
  const kIn = (j: number) => (j === 0 ? 0 : Math.max(t(j), SE(k, j - 1) + 18)), kOut = (j: number) => SE(k, j);
  const beat = (j: number, o2 = 1) => win(f, t(j), j < 13 ? t(j + 1) - 8 : LEN(k) + 20) * o2;
  const c: Pt = [520, 450];
  return (
    <Scene>
      <Svg>
        <g opacity={beat(0)}>
          <circle cx={c[0]} cy={c[1]} r={260} fill="none" stroke={C.local} strokeWidth={5} />
          <Arrow p={c} q={polar(c, 260, 53)} color={C.second} w={9} head={34} />
          <path d={arcD(c, 260, 53, 73)} fill="none" stroke={C.second} strokeWidth={12} />
        </g>
        <g opacity={beat(1)}>
          {[0, 1].map((i) => { const A: Ax = { x: 160 + i * 420, y: 330, w: 340, h: 220, xr: [0, 360], yr: [-1, 1] };
            const xs = Array.from({ length: 73 }, (_, q) => q * 5);
            return <g key={i}><Axes A={A} xt={[180]} yt={[-1, 1]} xf={(v) => `${v}°`} />
              <Curve A={A} xs={xs} ys={xs.map((d) => (i ? Math.sin(d * D2R) : Math.cos(d * D2R)))} c={i ? C.first : C.second} /></g>; })}
        </g>
        <g opacity={beat(2)}>
          <circle cx={c[0]} cy={c[1]} r={200} fill="none" stroke={C.local} strokeWidth={4} />
          <Arrow p={c} q={polar(c, 200, 40)} color={C.second} w={9} head={34} /><Arrow p={c} q={polar(c, 200, 130)} color={C.second} w={9} head={34} />
          <path d={arcD(c, 240, 45, 120)} fill="none" stroke={C.gold} strokeWidth={5} /><path d={arcD(c, 240, 135, 210)} fill="none" stroke={C.gold} strokeWidth={5} />
        </g>
        <g opacity={beat(3)}>
          {[C.local, C.second, C.neg].map((cc, i) => <rect key={i} x={300 + i * 110} y={560 - [180, 240, 30][i]} width={70} height={[180, 240, 30][i]} fill={cc} />)}
        </g>
        <g opacity={beat(4) + beat(5)}>
          <circle cx={c[0]} cy={c[1]} r={250} fill="none" stroke={C.local} strokeWidth={5} />
          <Arrow p={polar(c, 250, 60)} q={[polar(c, 250, 60)[0] - 150 * Math.sin(60 * D2R), polar(c, 250, 60)[1] - 150 * Math.cos(60 * D2R)]} color={C.first} w={10} head={36} />
          <Arrow p={polar(c, 250, 60)} q={polar(c, 130, 60)} color={C.neg} w={10} head={36} />
        </g>
        <g opacity={beat(6)}>
          <image href={IMG("cst_sec_ian.png")} x={120} y={200} width={400} height={300} preserveAspectRatio="none" />
          <image href={IMG("cst_sec_amphan.png")} x={560} y={200} width={400} height={300} preserveAspectRatio="none" />
          <URBar x={300} y={560} w={420} title={false} />
        </g>
        {/* remake 2026-11-07 (R3): the coast block's numbers in the recap: turned axes (S7), the two stations and their gauges (S8-S9),
            the three events' across-shore winds (S10), the floods (S11), Part 3 (S12-S13) */}
        <g opacity={beat(7)}>
          <line x1={180} y1={640} x2={860} y2={260} stroke={C.key} strokeWidth={5} />
          <Arrow p={[520, 450]} q={[520 + 0.87 * 200, 450 - 0.49 * 200]} color={C.second} w={9} head={32} />
          <Arrow p={[520, 450]} q={[520 - 0.49 * 200, 450 - 0.87 * 200]} color={C.second} w={9} head={32} />
          <Lbl x={760} y={250} t="along" c={C.local} s={T.floor} />
          <Lbl x={420} y={250} t="across" c={C.first} s={T.floor} a="end" />
          <Lbl x={300} y={300} t="sea" c="#8db5e2" s={T.key} />
          <Lbl x={720} y={600} t="land" c="#c9b48a" s={T.key} />
        </g>
        <g opacity={beat(8) + beat(9)}>
          <Gauges A={GA(200, 250, 720, 380)} f={f} tF={t(8)} tS={t(9)} land={false} labels={false} />
        </g>
        <g opacity={beat(10)}>
          {(["amphan", "nargis", "idai"] as const).map((n, i) => { const v = (D.shore[n].shown.across as number), y = 230 + i * 190;
            return <g key={n}><Lbl x={140} y={y} t={["Amphan · 2020", "Nargis · 2008", "Idai · 2019"][i]} c={C.key} s={T.key} />
              <rect x={880} y={y - 30} width={70} height={130} fill="#6b5a3e" />
              <Arrow p={[870 - 13 * Math.abs(v), y + 70]} q={[870, y + 70]} color={C.neg} w={10} head={32} />
              <Lbl x={560} y={y + 10} t={`across ${nf(v, 1)} m/s`} c={C.neg} s={T.floor} /></g>; })}
          <Lbl x={915} y={170} t="land" c="#c9b48a" s={T.floor} a="middle" />
        </g>
        {/* user notes 2026-11-06 item 12: the three flood events, in the order the movie showed them */}
        <g opacity={beat(11)}>
          {[["cst_amphan_s1_after.jpg", "Amphan · radar"], ["cst_swipe_after.jpg", "Nargis · 7-2-1"], ["cst_idai_721_after.jpg", "Idai · 7-2-1"]].map(([h, t], i) => <g key={t}>
            <image href={IMG(h as "cst_swipe_after.jpg")} x={110} y={150 + i * 205} width={300} height={170} preserveAspectRatio="xMidYMid slice" />
            <rect x={110} y={150 + i * 205} width={300} height={170} fill="none" stroke={C.grid} strokeWidth={3} />
            <Lbl x={440} y={235 + i * 205} t={t} c={C.key} s={T.floor} /></g>)}
        </g>
        <g opacity={beat(12) + beat(13)}>
          <circle cx={c[0]} cy={c[1]} r={250} fill="#21406e" stroke={C.local} strokeWidth={4} />
          <ellipse cx={c[0]} cy={c[1]} rx={250} ry={70} fill="none" stroke={C.local} strokeWidth={2} />
          <ellipse cx={c[0]} cy={c[1]} rx={90} ry={250} fill="none" stroke={C.local} strokeWidth={2} />
        </g>
        <Keyword f={f} text="to sum up" at={[MX, 120]} s={T.key} appear={kIn(0)} out={kOut(0)} />
        <Keyword f={f} text="slopes: $-\sin$, $\cos$" at={[MX, 120]} s={T.key} appear={kIn(1)} out={kOut(1)} />
        <Keyword f={f} text="$\hat{\mathbf r}$ → $\hat{\boldsymbol\theta}$,  $\hat{\boldsymbol\theta}$ → $-\hat{\mathbf r}$" at={[MX, 120]} s={T.floor} appear={kIn(2)} out={kOut(2)} />
        <Keyword f={f} text="product rule: both change" at={[MX, 120]} s={T.key} appear={kIn(3)} out={kOut(3)} />
        <Keyword f={f} text="$v/r\ \cdot\ v\,\hat{\boldsymbol\theta}\ \cdot\ -(v^2/r)\,\hat{\mathbf r}$" at={[MX, 120]} s={T.key} appear={kIn(4)} out={kOut(4)} />
        <Keyword f={f} text="0.048 $\mathrm{m/s^2}$ ≈ g/200" at={[MX, 120]} s={T.key} appear={kIn(5)} out={kOut(5)} />
        <Keyword f={f} text="$(r,\ \theta,\ z)$: in, up and out" at={[MX, 120]} s={T.key} appear={kIn(6)} out={kOut(6)} />
        <Keyword f={f} text="turned axes: along · across" at={[MX, 120]} s={T.key} appear={kIn(7)} out={kOut(7)} />
        <Keyword f={f} text={`Fort Myers Beach: ${nf(D.shore.fmb.shown.across, 1)} m/s`} at={[MX, 120]} s={T.floor} c={C.neg} appear={kIn(8)} out={kOut(8)} />
        <Lbl x={MX} y={200} t={`gauge: ≈ +${CST.gauges["8725520"].ext.toFixed(1)} m`} c={C.second} s={T.floor} o={win(f, kIn(8) + 10, kOut(8))} />{/* lint-ok: m is the unit metre */}
        <Keyword f={f} text={`Saint Petersburg: ${nf(D.shore.stp.shown.across, 1, true)} m/s`} at={[MX, 120]} s={T.floor} c={C.first} appear={kIn(9)} out={kOut(9)} />
        <Lbl x={MX} y={200} t={`gauge: ≈ ${nf(CST.gauges["8726520"].ext, 1)} m`} c="#8db5e2" s={T.floor} o={win(f, kIn(9) + 10, kOut(9))} />{/* lint-ok: m is the unit metre */}
        <Keyword f={f} text="onto the land before each flood" at={[MX, 120]} s={T.floor} appear={kIn(10)} out={kOut(10)} />
        <Keyword f={f} text="floods from space" at={[MX, 120]} s={T.key} appear={kIn(11)} out={kOut(11)} />
        <Keyword f={f} text="Part 3: the Earth" at={[MX, 120]} s={T.key} appear={kIn(12)} />
        <Lbl x={MX} y={210} t="latitude, longitude → km" c={C.key} s={T.floor} o={fin(f, kIn(13))} />
      </Svg>
      <TeX s={String.raw`\Delta\theta\ \text{along}\ \hat{\boldsymbol\theta}`} x={MX} y={300} size={T.calc} o={beat(0)} />
      <TeX s={String.raw`\dfrac{d\hat{\mathbf r}}{d\theta}=\hat{\boldsymbol\theta},\qquad \dfrac{d\hat{\boldsymbol\theta}}{d\theta}=-\hat{\mathbf r}`} x={MX} y={320} size={48} o={beat(2)} />
      <TeX s={String.raw`\mathbf a=-\dfrac{v^2}{r}\,\hat{\mathbf r}`} x={MX} y={330} size={T.eq} o={beat(4) + beat(5)} />
      {/* K6 round 1: the picture box now includes the colour bar's "− in / + out" (the credit sat on them) */}
      <SourceBelow text="Data: NOAA HRRR · ERA5 (Copernicus C3S)" pic={{ x: 120, y: 200, w: 840, h: 510 }} w={840} o={beat(6)} name="s31 src 1" />
      <SourceBelow text="Data: NOAA CO-OPS gauges · 27-29 Sep 2022" pic={{ x: 120, y: 250, w: 840, h: 480 }} w={840} o={beat(8) + beat(9)} name="s31 src 2" />
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 10-m wind at landfall" pic={{ x: 120, y: 160, w: 840, h: 600 }} w={840} o={beat(10)} name="s41 src era5" />
      <SourceBelow text="Data: ESA Copernicus Sentinel-1 · NASA MODIS via Google Earth Engine" pic={{ x: 110, y: 150, w: 840, h: 580 }} w={840} o={beat(11)} name="s35 src 3" />
    </Scene>
  );
};

// ================================================================ s36 the series end card (maths ending, word for word)
const S36: React.FC = () => {
  const f = useCurrentFrame(), k = K("s42_end");
  const t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const thumb = (x: number, i: number) => (
    <g key={i} opacity={0.75}>
      <rect x={x - 150} y={70} width={300} height={170} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
      {i === 0 ? <><circle cx={x - 30} cy={160} r={60} fill="none" stroke={C.local} strokeWidth={3} /><Arrow p={[x - 30, 160]} q={[x + 20, 115]} color={C.second} w={5} head={18} />
        <Arrow p={[x - 30, 160]} q={[x - 75, 115]} color={C.second} w={5} head={18} /></> : null}
      {/* Part 1 lessons B5 / D2: every icon ≥ 20 px inside its card (the cylinder's lower rim reached 17 px); the section thumbnail is a
          drawn in-up-out schematic (a data picture would need its own source line and colour bar) */}
      {i === 1 ? <><ellipse cx={x} cy={110} rx={70} ry={18} fill="none" stroke={C.key} strokeWidth={3} /><ellipse cx={x} cy={198} rx={70} ry={18} fill="none" stroke={C.key} strokeWidth={3} />
        <line x1={x - 70} y1={110} x2={x - 70} y2={198} stroke={C.key} strokeWidth={3} /><line x1={x + 70} y1={110} x2={x + 70} y2={198} stroke={C.key} strokeWidth={3} /></> : null}
      {i === 2 ? <><rect x={x - 110} y={95} width={220} height={120} fill="none" stroke={C.grid} strokeWidth={3} />
        <Arrow p={[x + 95, 198]} q={[x - 55, 198]} color={C.gold} w={5} head={18} /><Arrow p={[x - 72, 192]} q={[x - 72, 118]} color={C.gold} w={5} head={18} />
        <Arrow p={[x - 55, 112]} q={[x + 95, 112]} color={C.gold} w={5} head={18} /></> : null}
      {i === 3 ? <><path d={`M${x - 120} 210 L${x - 40} 140 L${x + 30} 120 L${x + 120} 90`} fill="none" stroke={C.key} strokeWidth={4} />
        <Arrow p={[x - 20, 180]} q={[x + 40, 150]} color={C.second} w={5} head={18} /><Arrow p={[x - 20, 180]} q={[x - 50, 130]} color={C.second} w={5} head={18} /></> : null}
    </g>
  );
  const rel = ["vectors and index notation", "dot product", "cross product", "derivatives and Taylor series", "gradient", "contour maps", "curl", "material derivative", "Coriolis", "reading weather maps"];
  const COLX = [200, 1000], ROWY = (r: number) => 650 + r * 46;   // K6 round 1: the fifth row (672 + 192) reached y 882, in the caption band
  rel.forEach((s2, i) => { if (COLX[Math.floor(i / 5)] + textW(s2, T.floor) > (COLX[Math.floor(i / 5) + 1] ?? 1840) - 10) throw new Error(`end card: "${s2}" too wide`); });
  return (
    <Scene>
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
          {rel.map((s2, i) => <Lbl key={s2} x={COLX[Math.floor(i / 5)]} y={ROWY(i % 5)} t={s2} c={C.muted} s={T.floor} b={false} />)}
        </g>
      </Svg>
    </Scene>
  );
};

export const SCENES_C: Record<string, React.FC> = {
  s21_amphan_intro: S21, s22_amphan_eye: S22, s23_amphan_ring: S23, s24_amphan_curtain: S24, s25_why_cylindrical: S25, 
  s32_flood_flight: S29, s34_amphan_radar: S30, s35_nargis_intro: S31, s37_nargis_swipe: S32, s38_idai_intro: S33, s40_idai_swipe: S34,
  s41_recap: S35, s42_end: S36,
};
void [ColourBar, mix, poly, STK, SEC, Cross];

