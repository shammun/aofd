// ch00_coordinates_storm scenes s21-s32: Cyclone Amphan (globe tour, the MODIS pinhole eye, ERA5 rings and the section beside
// Ian's), why cylindrical coordinates, back to Ian's coast (onshore wind, storm surge, the tide gauges), the flood visuals of
// flood_visuals §v3 (user decision 2026-11-05: the flight goes to Amphan's landfall and shelf; the swipe is Cyclone Nargis 2008,
// MODIS 7-2-1), the recap and the end card. Every number on screen is asserted against data/cs.json below.
import React from "react";
import { Img, useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Pt, pulse, textW } from "../house/kit/draw";
import { TeX } from "../house/kit/tex";
import { CalcStack } from "./cs_lib";  // fix 0: fraction rows get their real height
import { Keyword } from "./cs_lib";   // Part 1 lessons C1: maths in $…$
import { GlobeFrame, SourceBelow } from "../house/kit/frame";
import { AnimatedWindArrow } from "../house/kit/wind";
import { Notebook } from "../house/kit/icons";
import { globePath, llPath, useTex } from "./kit_cs/globe";
import {
  AMP, AT, Arrow, Ax, Axes, CST, ColourBar, Cross, Curve, D, D2R, FLD, Globe, GeoImg, GeoMap, IMG, K, LEN, LUT_DEPTH, LUT_UR, Lbl, MapBox, NAR, Place, RING, SAY, SEC, SRC, SS,
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
  const tBay = AT(k, 0, "Bay of Bengal"), tRem = SS(k, 1), tMay = SS(k, 2), t18 = AT(k, 3, "eighteenth"), t20 = SS(k, 4), tKol = SS(k, 5), tSat = AT(k, 5, "Satkhira"),
    tKhu = AT(k, 5, "Khulna"), tDis = SS(k, 6);
  const keys = [
    { f: 0, lat: 18, lon: 60, dist: G_DIST0, pp: G_PP0 },
    { f: tBay - 10, lat: 18, lon: 60, dist: G_DIST0, pp: G_PP0 },
    { f: tBay + 45, lat: 16, lon: 88, dist: 2.4, pp: [600, 470] as Pt },
    { f: t20, lat: 16, lon: 88, dist: 2.4, pp: [600, 470] as Pt },
    { f: t20 + 60, lat: 21.8, lon: 88.6, dist: 1.32, pp: [600, 470] as Pt },
    { f: tDis + 70, lat: 21.8, lon: 88.6, dist: 1.32, pp: [600, 470] as Pt },
    { f: LEN(k) - 15, lat: 18, lon: 60, dist: G_DIST0, pp: G_PP0 },
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
            const o = fin(f, t0) * (big ? (cam.dist > 1.7 ? 1 : 0) * fout(f, t20 + 40) : (near ? 1 : 0)) * fout(f, LEN(k) - 60);
            return <Place key={nm} p={q} t={nm} r={big ? 0 : 9} dx={big ? 0 : off[0]} dy={big ? 0 : off[1]} a={big ? "middle" : off[0] < 0 ? "end" : "start"} o={o} />; })}
          <g opacity={near ? fin(f, t20 + 40) * fout(f, LEN(k) - 60) : 0}>
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
        <Keyword f={f} text="super cyclonic storm" at={[1210, 120]} s={T.key} appear={t18} out={t20 - 20} />
        <Lbl x={1210} y={210} t={`18 May · ${AMP.peak.kt} kt (IMD)`} c={C.key} s={T.floor} o={win(f, t18 + 20, t20 - 20)} />
        <Keyword f={f} text="ashore: 20 May" at={[1210, 120]} s={T.key} appear={t20} out={LEN(k) - 50} />
        <Lbl x={1210} y={300} t={`Kolkata ≈ ${Math.round(AMP.close.Kolkata.km)} km`} c={C.key} s={T.floor} o={win(f, tKol, LEN(k) - 50)} />
        <Lbl x={1210} y={370} t={`Satkhira ≈ ${Math.round(AMP.close.Satkhira.km)} km W`} c={C.key} s={T.floor} o={win(f, tSat, LEN(k) - 50)} />
        <Lbl x={1210} y={440} t={`Khulna ≈ ${Math.round(AMP.close.Khulna.km)} km W`} c={C.key} s={T.floor} o={win(f, tKhu, LEN(k) - 50)} />
        <Lbl x={1210} y={530} t="Khulna, Satkhira districts" c={C.gold} s={T.floor} o={win(f, tDis, LEN(k) - 50)} />
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
            <circle cx={e[0]} cy={e[1]} r={9} fill="none" stroke={C.gold} strokeWidth={2.5} opacity={fin(f, tEye)} />
          </g>
        </svg>
      </div>
      <Svg>
        <rect x={PB.x} y={PB.y} width={PB.w} height={PB.h} fill="none" stroke={C.grid} strokeWidth={3} />
        <g opacity={fin(f, tSame)}>
          <ellipse cx={e[0]} cy={e[1] - 230} rx={110} ry={30} fill="none" stroke={C.key} strokeWidth={4} opacity={0.8} />
          <ellipse cx={e[0]} cy={e[1]} rx={110} ry={30} fill="none" stroke={C.key} strokeWidth={4} opacity={0.8} />
          <line x1={e[0] - 110} y1={e[1]} x2={e[0] - 110} y2={e[1] - 230} stroke={C.key} strokeWidth={3} opacity={0.8} />
          <line x1={e[0] + 110} y1={e[1]} x2={e[0] + 110} y2={e[1] - 230} stroke={C.key} strokeWidth={3} opacity={0.8} />
        </g>
        <Keyword f={f} text="18 May · two days before landfall" at={[MX, 120]} s={T.floor} appear={0} out={tEye - 20} />
        <SideCallout f={f} lines="pinhole eye" at={[MX, 300]} appear={tEye} target={[e[0] + 16, e[1]]} c={C.gold} />
        {/* Part 1 lessons B1: the zoom says what it magnifies (the frame's true width from the crop box, ÷ the zoom) */}
        <Lbl x={MX} y={420} t={`zoomed ${z.toFixed(1)}×: frame ≈ ${Math.round(((cr[3] - cr[2]) * 111.32 * Math.cos(((cr[0] + cr[1]) / 2) * D2R)) / z / 10) * 10} km wide`}
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
        <SpeedBar x={830} y={90} w={160} hi={30} />{/* K6 r0: its "m/s" touched the keyword column */}
        <Lbl x={MX} y={470} t={`round ≈ ${SAY.a_vt} m/s · in ≈ ${Math.abs(SAY.a_vr)} m/s (−)`} c={C.key} s={T.floor} o={win(f, tMeans, tOff - 10)} />
        <Lbl x={MX} y={540} t="anticlockwise, like Ian" c={C.key} s={T.floor} o={win(f, tACW, tOff - 10)} />
        <Lbl x={MX} y={600} t="both: northern hemisphere" c={C.key} s={T.floor} o={win(f, tACW + 20, tOff - 10)} />
        <Lbl x={MX} y={734} t="ERA5's storm: much too weak" c={C.local} s={T.floor} o={win(f, AT(k, 9, "so the reanalysis"), tShape - 20)} />{/* K6 round 1: under the taller rows */}
        <Keyword f={f} text="but the shape is right" at={[MX, 120]} s={T.key} appear={tShape} out={tTwo - 20} />
        {/* K6 round 1: the two angle lines ran to x 1897: each is split at "⇒" (the arctan on the line under its fraction), the storm
            labels move up, and "a similar spiral angle" takes the keyword place on its sentence */}
        <g opacity={fin(f, tTan)}>
          <Lbl x={MX} y={305} t="Amphan · 50 km · ERA5" c={C.key} s={T.floor} />
          <Lbl x={MX} y={357} t={`round ${nf(AMP.vt10[0], 1)} · in ${nf(AMP.vr10[0], 1)}`} c={C.local} s={T.floor} />
          <Lbl x={MX} y={585} t="Ian · 25 km · HRRR" c={C.key} s={T.floor} />
          <Lbl x={MX} y={637} t="round 34.8 · in −13.3" c={C.local} s={T.floor} />
        </g>
        <Keyword f={f} text="a similar spiral angle" at={[MX, 120]} s={T.key} c={C.gold} appear={tTwo} />
      </Svg>
      {/* fix 0 B24: what the inflow angle is, then the angle step for each storm */}
      <TeX s={String.raw`\tan(\text{inflow angle})=\dfrac{|u_r|}{u_\theta}`} x={MX} y={215} size={46} o={fin(f, tTan)} />
      <TeX s={EQ23a} x={MX} y={440} size={44} o={fin(f, tTan + 20)} />
      <TeX s={String.raw`\Rightarrow\ ` + EQ23b} x={MX + 40} y={518} size={44} o={fin(f, tTan + 30)} />
      <TeX s={String.raw`\dfrac{13.3}{34.8}\approx0.38`} x={MX} y={720} size={44} o={fin(f, tTan + 40)} />
      <TeX s={String.raw`\Rightarrow\ \arctan0.38\approx20.9^\circ\approx21^\circ`} x={MX + 40} y={798} size={44} o={fin(f, tTan + 50)} />
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
        { rhs: String.raw`90\ \mathrm{kt}\times1.852\approx167\ \mathrm{km/h}`, at: AT(k, 8, "ninety knots"), c: C.local, cont: true },
        { rhs: String.raw`167\div3.6\approx${SAY.a_ms}\ \mathrm{m/s}`, at: AT(k, 8, "forty six"), c: C.local },
        { rhs: String.raw`p_{\min}:\ \text{ERA5 }${SAY.a_msl}\ \text{vs official }${AMP.best06.hpa}\ \mathrm{hPa}`, at: tWeak, c: C.local },
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
    <Lbl x={x + 13} y={y - 70} t="m/s" c={C.muted} s={T.floor} a="middle" b={false} />
    <Lbl x={x + 13} y={y - 30} t="+ out" c="#8db5e2" s={T.floor} a="middle" />
    <Lbl x={x + 13} y={y + h + 34} t="− in" c={C.neg} s={T.floor} a="middle" />
  </g>
);
const S24: React.FC = () => {
  const f = useCurrentFrame(), k = K("s24_amphan_curtain");
  const tSame = SS(k, 1), tIn = SS(k, 2), tOut = SS(k, 3), tBlur = SS(k, 4), tFit = SS(k, 5);
  // K6 round 1: both panels and the bar 40 px lower: the keywords at y 50 sat on the "height (km)" titles and 4 px from the bar
  const BI = { x: 150, y: 150, w: 640, h: 500 }, BA = { x: 1160, y: 150, w: 640, h: 500 };
  const PI = (r: number, z: number) => secP(r, z, BI, 200), PA = (r: number, z: number) => secP(r, z, BA, 300);
  const am = AMP.sec, mn = PA(am.min[1], am.min[2]), mx = PA(am.max[1], am.max[2]);
  return (
    <Scene>
      <Svg>
        <image href={IMG("cst_sec_ian.png")} x={BI.x} y={BI.y} width={BI.w} height={BI.h} preserveAspectRatio="none" />
        <SecAxes B={BI} rMax={200} />
        <image href={IMG("cst_sec_amphan.png")} x={BA.x} y={BA.y} width={BA.w} height={BA.h} preserveAspectRatio="none" />
        <SecAxes B={BA} rMax={300} rt={[0, 100, 200, 300]} />
        <VBar x={935} y={220} h={380} />
        <circle cx={mn[0]} cy={mn[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tIn)} />
        <circle cx={mx[0]} cy={mx[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tOut)} />
        <InUpOut f={f} P={PI} rIn={[30, 170]} rUp={40} zTop={15.5} o={fin(f, tBlur)} />
        <InUpOut f={f} P={PA} rIn={[60, 260]} rUp={70} zTop={15.0} o={fin(f, tBlur)} />
        <Keyword f={f} text="Ian (left) · Amphan (right)" at={[150, 50]} s={T.floor} appear={0} out={tIn - 20} />
        <Keyword f={f} text={`≈ ${nf(am.min[0], 0)} m/s, 100 km, ≈ 0.2 km up`} at={[700, 50]} s={T.floor} appear={tIn} out={tOut - 20} />
        <Keyword f={f} text={`≈ +${Math.round(am.max[0])} m/s near the top`} at={[700, 50]} s={T.floor} appear={tOut} out={tBlur - 20} />
        <Keyword f={f} text="in, up and out · same picture" at={[700, 50]} s={T.floor} c={C.gold} appear={tFit} />
      </Svg>
      <SourceBelow text="Data: NOAA HRRR analysis · 28 Sep 2022, 18 UTC" pic={{ x: BI.x - 70, y: BI.y, w: BI.w + 70, h: BI.h + 100 }} w={700} name="s24 src i" />
      <SourceBelow text={SRC.era5} pic={{ x: BA.x - 70, y: BA.y, w: BA.w + 70, h: BA.h + 100 }} w={700} name="s24 src a" />
    </Scene>
  );
};

// ================================================================ s25 why cylindrical coordinates: three good reasons
const S25: React.FC = () => {
  const f = useCurrentFrame(), k = K("s25_why_cylindrical");
  const tThree = SS(k, 1), tShape = SS(k, 2), tPhys = SS(k, 4), tEN = SS(k, 6), tMean = SS(k, 7), tParts = SS(k, 8);
  const c1: Pt = [280, 300], c2: Pt = [280, 520];
  const mini = { x: 470, y: 170, w: 420, h: 260 };
  const ring = (c: Pt, r: number) => <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={C.local} strokeWidth={4} />;
  const xs = Array.from({ length: 73 }, (_, i) => i * 5);
  const G: Ax = { x: 560, y: 470, w: 330, h: 130, xr: [0, 360], yr: [-50, 50] };
  return (
    <Scene>
      <Svg>
        <g opacity={0.35 + 0.65 * fin(f, tShape)}>
          <image href={IMG("cst_ur_925.png")} x={c1[0] - 130} y={c1[1] - 130} width={260} height={260} />
          <Arrow p={[c1[0] + 150, c1[1]]} q={[mini.x - 20, c1[1]]} color={C.gold} w={6} head={24} />
          <image href={IMG("cst_sec_ian.png")} x={mini.x} y={mini.y} width={mini.w} height={mini.h} preserveAspectRatio="none" />
          <rect x={mini.x} y={mini.y} width={mini.w} height={mini.h} fill="none" stroke={C.grid} strokeWidth={3} />
        </g>
        <g opacity={fin(f, tPhys)}>
          {ring(c2, 110)}
          <Arrow p={polar(c2, 110, 60)} q={[polar(c2, 110, 60)[0] - 80 * Math.sin(60 * D2R), polar(c2, 110, 60)[1] - 80 * Math.cos(60 * D2R)]} color={C.first} w={8} head={28} />
          <Arrow p={polar(c2, 110, 60)} q={polar(c2, 40, 60)} color={C.neg} w={8} head={28} />
          <g opacity={fin(f, tEN)}>
            <Axes A={G} xt={[0, 180, 360]} yt={[-40, 0, 40]} xf={(v) => `${v}°`} zero />
            <Curve A={G} xs={(RING.az as number[]).concat([360])} ys={(RING.u as number[]).concat([RING.u[0]])} c={C.second} w={4} />
            <Curve A={G} xs={(RING.az as number[]).concat([360])} ys={(RING.vv as number[]).concat([RING.vv[0]])} c={C.first} w={4} dash="10 8" />
            <Lbl x={G.x + G.w + 10} y={G.y + 20} t="u" c={C.second} s={T.floor} />
            <Lbl x={G.x + G.w + 10} y={G.y + 80} t="v" c={C.first} s={T.floor} />
          </g>
        </g>
        <g opacity={fin(f, tMean)}>
          <ellipse cx={280} cy={800 - 40} rx={110} ry={26} fill="none" stroke={C.key} strokeWidth={3} />
          <Arrow p={[390, 760]} q={[330, 760]} color={C.neg} w={7} head={24} o={fin(f, tParts)} />
          <Arrow p={[280, 735]} q={[360, 720]} color={C.first} w={7} head={24} o={fin(f, tParts + 20)} />
          <Arrow p={[200, 760]} q={[200, 680]} color={C.local} w={7} head={24} o={fin(f, tParts + 40)} />
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
const S26: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26_onshore");
  const tNot = SS(k, 1), tAlong = SS(k, 2), tWind = SS(k, 3), tCoast = SS(k, 4), tP4 = SS(k, 5);
  const B = coastMap(28.4, 60, 760);
  const Bx: MapBox = { ...B, x: 520 - B.w / 2 };
  const P = mapP(Bx), fm = P(CST.fmb[0], CST.fmb[1]), u = CST.uF as number[];
  const s = 4.5;
  const n1 = P(CST.naples[0], CST.naples[1]), n2 = P(CST.englewood[0], CST.englewood[1]);
  return (
    <Scene>
      <GeoMap id="s26m" B={Bx}>{(Pp) => <CoastBody P={Pp} f={f} />}</GeoMap>
      <Svg>
        <Place p={fm} t="Fort Myers Beach" dx={-20} dy={44} a="end" o={fin(f, tWind)} />
        <AnimatedWindArrow from={[fm[0] - u[0] * s, fm[1] + u[1] * s]} to={fm} speed={CST.spF} f={f} c={C.ink} px={10} head={36} o={fin(f, tWind)} />
        <line x1={n1[0]} y1={n1[1]} x2={n2[0]} y2={n2[1]} stroke={C.second} strokeWidth={5} opacity={fin(f, tCoast)} />
        <g opacity={win(f, tAlong, tWind - 20)}>
          <Arrow p={fm} q={[fm[0] + (n2[0] - n1[0]) * 0.35, fm[1] + (n2[1] - n1[1]) * 0.35]} color={C.second} w={8} head={28} />
          <Arrow p={fm} q={[fm[0] + 110, fm[1] - 70]} color={C.second} w={8} head={28} />
        </g>
        <Keyword f={f} text="back to the coast" at={[MX, 120]} s={T.key} appear={0} out={tAlong - 20} />
        <Keyword f={f} text="along the shore · across the shore" at={[MX, 120]} s={T.floor} appear={tAlong} out={tWind - 20} />
        <Keyword f={f} text={`≈ ${Math.round(CST.spF)} m/s from the SW`} at={[MX, 120]} s={T.key} appear={tWind} out={tP4 - 20} />
        <Lbl x={MX} y={210} t="20 UTC · ≈ 1 h after landfall" c={C.key} s={T.floor} o={win(f, tWind, tP4 - 20)} />
        <Lbl x={MX} y={290} t="coast runs NNW" c={C.second} s={T.floor} o={win(f, tCoast, tP4 - 20)} />
        <Lbl x={MX} y={360} t="almost straight onto the land" c={C.key} s={T.floor} o={win(f, tCoast + 30, tP4 - 20)} />
        <Keyword f={f} text="Part 4: how much, exactly" at={[MX, 120]} s={T.key} c={C.local} appear={tP4} />
        <SpeedBar x={MX} y={720} w={360} hi={50} />
        <Lbl x={MX} y={620} t="towards the NE = from the SW" c={C.muted} s={T.floor} o={win(f, AT(k, 3, "from the s") , tP4 - 20)} />
      </Svg>
      {/* fix 0 B25a: the 33 m/s from its two components */}
      <CalcStack f={f} x={MX} y={410} size={44} maxLines={3} o={fout(f, tP4 - 10)} rows={[
        // K6 round 1: both rows ran past 1842 (to 1909 / 1894): the components as one (u, v) pair, the length's result on its own line
        // K6 round 2: still 6 px past 1842: the directions as E / N on the numbers (as NNW / SW / NE elsewhere on this screen)
        { rhs: String.raw`(u,\ v)=(${nf(u[0], 1)}\ \text{E},\ ${nf(u[1], 1)}\ \text{N})\ \mathrm{m/s}`, at: tWind + 20 },
        { rhs: String.raw`\sqrt{${nf(u[0], 1)}^2+${nf(u[1], 1)}^2}=\sqrt{${Math.round(u[0] ** 2)}+${Math.round(u[1] ** 2)}}`, at: AT(k, 3, "thirty three") },
        { rhs: String.raw`\approx${nf(CST.spF, 1)}\ \mathrm{m/s}`, at: AT(k, 3, "thirty three") + 15, cont: true },
      ]} />
      <SourceBelow text={SRC.hrrr20} pic={Bx} w={1400} name="s26 src" />
    </Scene>
  );
};

const GA = (x: number, y: number, w: number, h: number): Ax => ({ x, y, w, h, xr: [0, 36], yr: [-2.2, 2.6] });
const Gauges: React.FC<{ A: Ax; f: number; tF: number; tS: number; land?: boolean; labels?: boolean }> = ({ A, f, tF, tS, land = true, labels = true }) => {
  const G1 = CST.gauges["8725520"], G2 = CST.gauges["8726520"];
  const P = axP(A);
  const pk = P(G1.ext_h, G1.ext), tr = P(G2.ext_h, G2.ext);
  return (
    <g>
      {/* K6 round 1+: the date ticks were 12 px apart in s28 ("27 Sep 12" … 188-196 px wide): the days at midnight ("28 Sep"), noon as
          "12 UTC" (≥ 60 px apart at the narrowest chart, s28; the landfall tag says "≈ 19 UTC" on the same clock) */}
      <Axes A={A} xt={[0, 12, 24, 36]} yt={[-2, 0, 2]} xf={(v) => ["12 UTC", "28 Sep", "12 UTC", "29 Sep"][v / 12]} yf={(v) => nf(v, 0, true)} zero
        yl="vs predicted tide (m)" />{/* K6 r0: the long axis title ran past 1842 */}
      <line x1={P(CST.land_h, 0)[0]} y1={A.y} x2={P(CST.land_h, 0)[0]} y2={A.y + A.h} stroke={C.local} strokeWidth={3} strokeDasharray="10 8" opacity={land ? 1 : 0} />
      <Lbl x={P(CST.land_h, 0)[0] - 10} y={A.y + 26} t="landfall ≈ 19 UTC" c={C.local} s={T.floor} a="end" o={land ? 1 : 0} />
      <Curve A={A} xs={G1.h} ys={G1.res} c={C.second} w={6} upto={prog(f, tF, tF + 60)} />
      <Curve A={A} xs={G2.h} ys={G2.res} c="#8db5e2" w={6} dash="14 9" upto={prog(f, tS, tS + 60)} />
      {/* K6 round 1: the end labels (one line each, 570-640 px) ran over the map, the colour bar and each other: two lines each, right
          of the chart's end (the gauge's value on its line's level) */}
      {labels ? <>
        <Lbl x={A.x + A.w + 16} y={pk[1] - 6} t={`≈ +${G1.ext.toFixed(1)} m`} c={C.second} s={T.floor} o={fin(f, tF + 50)} />
        <Lbl x={A.x + A.w + 16} y={pk[1] + 40} t="Fort Myers (upriver)" c={C.second} s={T.floor} o={fin(f, tF + 50)} />
        <Lbl x={A.x + A.w + 16} y={tr[1] - 44} t={`≈ ${nf(G2.ext, 1)} m`} c="#8db5e2" s={T.floor} o={fin(f, tS + 50)} />
        <Lbl x={A.x + A.w + 16} y={tr[1] + 2} t="Saint Petersburg" c="#8db5e2" s={T.floor} o={fin(f, tS + 50)} />
      </> : null}
    </g>
  );
};
const S27: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27_surge");
  const tSurge = AT(k, 1, "storm surge"), tWind = SS(k, 2), tCm = SS(k, 3), tNHC = SS(k, 4), tFM = SS(k, 5), tNorth = SS(k, 6), tOut = SS(k, 7), tStP = SS(k, 8), tFlip = SS(k, 9),
    tEk = SS(k, 10), tMore = SS(k, 11);
  const B = coastMap(28.4, 60, 760);
  const Bx: MapBox = { ...B, x: 340 - B.w / 2 + 120 };
  const P = mapP(Bx), fm = P(CST.fmb[0], CST.fmb[1]), sp = P(CST.stp[0], CST.stp[1]);
  const uF = CST.uF as number[], uS = CST.uS as number[], s = 4.5;
  // K6 r0 / fix 0: below the rows; K6 round 1: 30 px lower (the feet rows now take two lines)
  const sh = CST.shelf, SA: Ax = { x: 1110, y: 470, w: 640, h: 200, xr: [0, 150], yr: [-80, 10] };
  const rise = prog(f, tSurge, tSurge + 90) * fout(f, tNorth - 10);
  const GAx = GA(1010, 530, 680, 230);   // K6 r0: "29 Sep 00" ran past 1842; K6 round 1: wider, the date ticks overlapped each other
  return (
    <Scene>
      <GeoMap id="s27m" B={Bx}>{(Pp) => <CoastBody P={Pp} f={f} />}</GeoMap>
      <Svg>
        <Place p={fm} t="Fort Myers Beach" dx={-20} dy={44} a="end" />
        {/* K6 round 1: anchored at its end the name ran out of the map's left edge; centred above the marker it stays inside */}
        <Place p={sp} t="Saint Petersburg" dx={0} dy={-40} a="middle" o={fin(f, tNorth)} />
        <AnimatedWindArrow from={[fm[0] - uF[0] * s, fm[1] + uF[1] * s]} to={fm} speed={CST.spF} f={f} c={C.ink} px={10} head={36} />
        <AnimatedWindArrow from={sp} to={[sp[0] + uS[0] * s, sp[1] - uS[1] * s]} speed={Math.hypot(uS[0], uS[1])} f={f} c={C.ink} px={10} head={36} o={fin(f, tOut)} />
        <g opacity={win(f, tWind, tFM - 20)}>
          <Axes A={SA} xt={[0, 50, 100, 150]} yt={[-80, -40, 0]} xl="km from Fort Myers Beach (WSW)" yl="sea floor (m)" xf={(v) => `${v}`} />
          <Curve A={SA} xs={sh.km} ys={sh.z} c="#8a6f4e" w={6} />
          <rect x={SA.x} y={axP(SA)(0, 0)[1] - 30 * rise} width={SA.w} height={30 * rise + 2} fill="#7cc4ff" opacity={0.35} />
        </g>
        <Keyword f={f} text="onto the land" at={[MX, 120]} s={T.key} appear={0} out={tSurge - 20} />
        <Keyword f={f} text="storm surge" at={[MX, 120]} s={T.key} appear={tSurge} out={tNHC - 20} />
        <Lbl x={MX} y={210} t="wide, shallow shelf" c={C.key} s={T.floor} o={win(f, tWind, tNHC - 20)} />
        <Lbl x={MX} y={270} t="≈ 1 cm per hPa" c={C.local} s={T.floor} o={win(f, tCm, tNHC - 20)} />
        <Lbl x={MX} y={312} t="75 cm: small next to 3-4.5 m" c={C.muted} s={T.floor} o={win(f, tNHC + 30, tFM - 10)} />
        <Keyword f={f} text="NHC: 3-4.5 m above the ground" at={[MX, 120]} s={T.floor} c={C.local} appear={tNHC} out={tNorth - 20} />
        <g opacity={fin(f, tFM)}><Gauges A={GAx} f={f} tF={tFM} tS={tStP} land={false} labels={false} /></g>
        <Lbl x={MX} y={230} t={`Fort Myers (upriver) ≈ +${CST.gauges["8725520"].ext.toFixed(1)} m`} c={C.second} s={T.floor} o={win(f, tFM + 30, tEk - 20)} />
        <Keyword f={f} text={`≈ ${Math.round(CST.d_fs)} km north: Tampa Bay`} at={[MX, 120]} s={T.floor} appear={tNorth} out={tFlip - 20} />
        <Lbl x={MX} y={300} t="wind blows out to sea" c={C.key} s={T.floor} o={win(f, tOut, tEk - 20)} />
        <Lbl x={MX} y={370} t={`Saint Petersburg ≈ ${nf(CST.gauges["8726520"].ext, 1)} m`} c="#8db5e2" s={T.floor} o={win(f, tStP + 30, tEk - 20)} />
        <Keyword f={f} text="the surge flips" at={[MX, 120]} s={T.key} c={C.gold} appear={tFlip} out={tEk - 20} />
        <Keyword f={f} text="more: Friction and Ekman layers" at={[MX, 120]} s={T.floor} appear={tEk} out={tMore - 20} />
        <Keyword f={f} text="more: Storm surge" at={[MX, 120]} s={T.floor} appear={tMore} />
        <SpeedBar x={770} y={90} w={220} hi={50} />
      </Svg>
      {/* fix 0 B25b: Ian's number for the inverted barometer; B25c: the feet-to-metres factor */}
      <TeX s={String.raw`1013-${(D.s17 as { best: number }).best}\approx75\ \mathrm{hPa}\ \Rightarrow\ \approx75\ \mathrm{cm}`} x={MX} y={372} size={46} c={C.local} o={win(f, AT(k, 3, "Ian's centre"), tFM - 10)} />
      {/* K6 round 1: the feet → metres row ran to x 1943: ten and fifteen feet on two lines */}
      <TeX s={String.raw`10\times0.3048\approx3.0\ \mathrm m`} x={MX} y={195} size={46} c={C.local} o={win(f, tNHC + 10, tFM - 10)} />
      <TeX s={String.raw`15\times0.3048\approx4.6\ \mathrm m`} x={MX} y={252} size={46} c={C.local} o={win(f, tNHC + 25, tFM - 10)} />
      <SourceBelow text={SRC.surge} pic={Bx} w={1400} name="s27 src" />
    </Scene>
  );
};

// ================================================================ s28 Ian: no satellite saw the surge; the gauges are its record
const S28: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28_ian_record");
  const tNo = SS(k, 1), tGauge = SS(k, 3), tLines = SS(k, 4), tMeas = SS(k, 5);
  // K6 round 1 (relayout): chart 160-760 with two-line end labels right of it (to x ≈ 1200); the notes at x 1120 above the map (y ≤ 278);
  // the map 1500-1820 × 300-720 with Fort Myers named inside it and Saint Petersburg left of it (a leader to its dot); the colour bar
  // under the map. Before: the end labels ran over the map, the notes and the colour bar; the map's names straddled its edge.
  const A = GA(160, 300, 600, 400);
  const LB = coastMap(28.4, 300, 420);
  const Lx: MapBox = { ...LB, x: 1500 };
  const P = mapP(Lx), fm = P(CST.gauges["8725520"].lat, CST.gauges["8725520"].lon), sp = P(CST.gauges["8726520"].lat, CST.gauges["8726520"].lon);
  const spL: Pt = [Lx.x - 16, sp[1] + 44];                   // the Saint Petersburg name: right end, outside the map
  return (
    <Scene>
      <Svg>
        <Gauges A={A} f={f} tF={tLines} tS={AT(k, 4, "drops")} />
        <Keyword f={f} text="what did satellites see?" at={[220, 100]} s={T.key} appear={0} out={tNo - 20} />
        <Keyword f={f} text="no satellite saw the surge itself" at={[220, 100]} s={T.key} appear={tNo} />
        <Keyword f={f} text="the surge, measured" at={[220, 180]} s={T.key} c={C.gold} appear={tMeas} />
        <Lbl x={1120} y={150} t="tide gauges, every 6 min" c={C.key} s={T.floor} o={fin(f, tGauge)} />
        <Lbl x={1120} y={210} t="NHC: 3-4.5 m above the ground" c={C.local} s={T.floor} o={fin(f, tLines)} />
        <Lbl x={1120} y={260} t="Fort Myers Beach, other datum" c={C.local} s={T.floor} o={fin(f, tLines)} />
        <SpeedBar x={1500} y={790} w={230} hi={50} />
      </Svg>
      <GeoMap id="s28m" B={Lx}>{(Pp) => <CoastBody P={Pp} f={f} />}</GeoMap>
      <Svg>
        <Place p={fm} t="Fort Myers" dx={-30} dy={-40} a="middle" />
        <Place p={sp} t="Saint Petersburg" r={11} dx={spL[0] - sp[0]} dy={spL[1] - sp[1]} a="end" />{/* fix 0 B25d: as the voice and the chart say */}
        <line x1={spL[0] + 6} y1={spL[1] - 8} x2={sp[0] - 12} y2={sp[1] + 6} stroke={C.key} strokeWidth={2.5} opacity={0.8} />
      </Svg>
      <SourceBelow text={SRC.surge} pic={{ x: 160, y: 300, w: 640, h: 520 }} w={1400} name="s28 src" />
    </Scene>
  );
};

// ================================================================ s29 the flight to Amphan's shelf and landfall (flood_visuals §v3: Amphan keeps the flight)
const S29: React.FC = () => {
  const f = useCurrentFrame(), k = K("s29_flood_flight");
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
            <g data-lc-maplabel="1"><Lbl x={G.p(sh.coast_lat - sh.km_to_20m / 222.4, 89.0, 1.003)[0] + 18} y={G.p(sh.coast_lat - sh.km_to_20m / 222.4, 89.0, 1.003)[1]}
              t={`≈ ${Math.round(sh.km_to_20m)} km`} c={C.gold} s={T.floor} /></g>
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

// ================================================================ s30 the swipe: Cyclone Nargis 2008, MODIS 7-2-1 (user decision 2026-11-05)
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
const S30: React.FC = () => {
  const f = useCurrentFrame(), k = K("s30_flood_swipe");
  // timed by phrase (SSP): the s30 slot sentences are re-voiced for Nargis in the heavy phase and may gain a bridging sentence
  const tFalse = SSP(k, "false colour"), tBands = SSP(k, "infrared"), tKey = SSP(k, "plants"), tL = SSP(k, "On the left"), tR = SSP(k, "On the right"),
    tPin = SSP(k, "same latitudes"), tLeft = SSP(k, "left behind"), tMore = SSP(k, "own movie");
  const PB = { x: 80, y: 60, w: 1000, h: 0 };
  const box = NAR.crop_wsen as number[];
  PB.h = Math.round((PB.w * (box[3] - box[1])) / ((box[2] - box[0]) * Math.cos(16.4 * D2R)));
  const B: MapBox = { lat0: box[1], lat1: box[3], lon0: box[0], lon1: box[2], ...PB };
  const P = mapP(B);
  const sx = swipeX(f, tR);
  const xl = PB.x + sx * PB.w;
  const oBef = clamp((xl - PB.x - 40) / 160, 0, 1), oAft = clamp((PB.x + PB.w - xl - 40) / 160, 0, 1);
  const km50 = (50 / (111.32 * Math.cos(16.4 * D2R)) / (box[2] - box[0])) * PB.w;
  const places = NAR.places as [string, number, number][];
  // K6 round 1: a name on the picture steps aside (fades) while the swipe line passes over it: the line and the edge of the
  // "before" picture would cut through its letters (351 hits on Yangon, the date tags, "50 km", "N"); 6 px clear, 24 px fade
  const nearO = (x0: number, x1: number) => { const d = xl < x0 ? x0 - xl : xl > x1 ? xl - x1 : 0; return clamp((d - 6) / 24, 0, 1); };
  const tw = (t: string) => textW(t, T.floor);
  return (
    <Scene>
      <div style={{ position: "absolute", left: PB.x, top: PB.y, width: PB.w, height: PB.h, overflow: "hidden" }}>
        <Img src={IMG("cst_swipe_after.jpg")} style={{ position: "absolute", left: 0, top: 0, width: PB.w, height: PB.h }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: sx * PB.w, height: PB.h, overflow: "hidden" }}>
          <Img src={IMG("cst_swipe_before.jpg")} style={{ position: "absolute", left: 0, top: 0, width: PB.w, height: PB.h }} />
        </div>
      </div>
      <Svg>
        <rect x={PB.x} y={PB.y} width={PB.w} height={PB.h} fill="none" stroke={C.grid} strokeWidth={3} />
        <line x1={xl} y1={PB.y} x2={xl} y2={PB.y + PB.h} stroke={C.gold} strokeWidth={6} opacity={fin(f, tL)} />
        {places.map(([nm, la, lo]) => { const q = P(la, lo), east = q[0] + 16 + tw(nm) > PB.x + PB.w - 20;   // Yangon: name left of its dot (it ran out of the picture)
          const x0 = east ? q[0] - 16 - tw(nm) : q[0] - 10, x1 = east ? q[0] + 10 : q[0] + 16 + tw(nm);
          return <Place key={nm} p={q} t={nm} dx={east ? -16 : 16} dy={-30} r={8} a={east ? "end" : "start"} o={fin(f, 8) * nearO(x0, x1)} />; })}
        <line x1={PB.x + PB.w - 40 - km50} y1={PB.y + PB.h - 30} x2={PB.x + PB.w - 40} y2={PB.y + PB.h - 30} stroke={C.key} strokeWidth={6} />
        <Lbl x={PB.x + PB.w - 40 - km50 / 2} y={PB.y + PB.h - 64} t="50 km" c={C.key} s={T.floor} a="middle" o={nearO(PB.x + PB.w - 40 - km50 / 2 - tw("50 km") / 2, PB.x + PB.w - 40 - km50 / 2 + tw("50 km") / 2)} />
        <Arrow p={[PB.x + 50, PB.y + 120]} q={[PB.x + 50, PB.y + 40]} color={C.key} w={5} head={20} />
        <Lbl x={PB.x + 80} y={PB.y + 70} t="N" c={C.key} s={T.floor} o={nearO(PB.x + 80, PB.x + 80 + tw("N"))} />
        <Lbl x={PB.x + 130} y={PB.y + 30 + 18} t={`before · ${NAR.BEFORE}`} c={C.key} s={T.floor} o={fin(f, tL) * oBef * nearO(PB.x + 130, PB.x + 130 + tw(`before · ${NAR.BEFORE}`))} />
        <Lbl x={PB.x + PB.w - 20} y={PB.y + 30 + 18} t={`after · ${NAR.AFTER}`} c={C.key} s={T.floor} a="end"
          o={fin(f, tR) * oAft * nearO(PB.x + PB.w - 20 - tw(`after · ${NAR.AFTER}`), PB.x + PB.w - 20)} />
        <Keyword f={f} text="Cyclone Nargis · Myanmar · 2008" at={[MX + 40, 120]} s={T.floor} appear={0} out={tKey - 20} />
        <Keyword f={f} text="false colour" at={[MX + 40, 210]} s={T.key} appear={tFalse} out={tKey - 20} />
        <Keyword f={f} text="water: dark blue or black" at={[MX + 40, 120]} s={T.floor} appear={tKey} out={tLeft - 20} />
        <Keyword f={f} text="what the surge left" at={[MX + 40, 120]} s={T.floor} c={C.local} appear={tLeft} out={tMore - 20} />
        <Keyword f={f} text="more: Floods from space" at={[MX + 40, 120]} s={T.floor} appear={tMore} />
        <Lbl x={MX + 40} y={300} t="same latitudes and longitudes" c={C.key} s={T.floor} o={win(f, tPin, tLeft - 20)} />
        <Lbl x={MX + 40} y={300} t="landfall: 2 May 2008" c={C.key} s={T.floor} o={win(f, tL, tPin - 20)} />
      </Svg>
      <Svg>
        {[["shortwave infrared → red", "#e06a5a"], ["near infrared → green", "#6fcf6a"], ["red light → blue", "#6a8fe0"]].map(([t, c], i) =>
          <Lbl key={t} x={MX + 40} y={430 + i * 64} t={t} c={c} s={T.floor} o={fin(f, tBands + 15 * i)} />)}
        {[["plants", "#46b45a"], ["bare ground", "#b98a62"], ["clouds", "#e8ecf4"], ["water", "#1c2f6e"]].map(([t, c], i) =>
          <g key={t} opacity={fin(f, tKey + 12 * i)}><rect x={MX + 40 + (i % 2) * 360} y={640 + Math.floor(i / 2) * 70} width={44} height={44} fill={c} stroke={C.muted} strokeWidth={2} />
            <Lbl x={MX + 100 + (i % 2) * 360} y={662 + Math.floor(i / 2) * 70} t={t} c={C.key} s={T.floor} /></g>)}
      </Svg>
      <SourceBelow text={SRC.nargis} pic={PB} w={1000} name="s30 src" />
    </Scene>
  );
};

// ================================================================ s31 recap (one beat per sentence, mini pictures)
const S31: React.FC = () => {
  const f = useCurrentFrame(), k = K("s31_recap");
  const t = (j: number) => SS(k, j);
  const beat = (j: number, o2 = 1) => win(f, t(j), j < 9 ? t(j + 1) - 8 : LEN(k) + 20) * o2;
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
        <g opacity={beat(7) + beat(8)}>
          <Gauges A={GA(200, 250, 720, 380)} f={f} tF={t(7)} tS={t(7) + 20} land={false} labels={false} />
        </g>
        <g opacity={beat(9)}>
          <circle cx={c[0]} cy={c[1]} r={250} fill="#21406e" stroke={C.local} strokeWidth={4} />
          <ellipse cx={c[0]} cy={c[1]} rx={250} ry={70} fill="none" stroke={C.local} strokeWidth={2} />
          <ellipse cx={c[0]} cy={c[1]} rx={90} ry={250} fill="none" stroke={C.local} strokeWidth={2} />
        </g>
        <Keyword f={f} text="to sum up" at={[MX, 120]} s={T.key} appear={0} out={t(1) - 20} />
        <Keyword f={f} text="slopes: −sin, cos" at={[MX, 120]} s={T.key} appear={t(1)} out={t(2) - 20} />
        <Keyword f={f} text="$\hat{\mathbf r}$ → $\hat{\boldsymbol\theta}$,  $\hat{\boldsymbol\theta}$ → $-\hat{\mathbf r}$" at={[MX, 120]} s={T.floor} appear={t(2)} out={t(3) - 20} />
        <Keyword f={f} text="product rule: both change" at={[MX, 120]} s={T.key} appear={t(3)} out={t(4) - 20} />
        <Keyword f={f} text="$v/r\ \cdot\ v\,\hat{\boldsymbol\theta}\ \cdot\ -(v^2/r)\,\hat{\mathbf r}$" at={[MX, 120]} s={T.key} appear={t(4)} out={t(5) - 20} />
        <Keyword f={f} text="0.048 $\mathrm{m/s^2}$ ≈ g/200" at={[MX, 120]} s={T.key} appear={t(5)} out={t(6) - 20} />
        <Keyword f={f} text="(r, θ, z): in, up and out" at={[MX, 120]} s={T.key} appear={t(6)} out={t(7) - 20} />
        <Keyword f={f} text="onshore wind → storm surge" at={[MX, 120]} s={T.key} appear={t(7)} out={t(8) - 20} />
        <Keyword f={f} text="gauges · floods from space" at={[MX, 120]} s={T.key} appear={t(8)} out={t(9) - 20} />
        <Keyword f={f} text="Part 3: the Earth" at={[MX, 120]} s={T.key} appear={t(9)} />
      </Svg>
      <TeX s={String.raw`\Delta\theta\ \text{along}\ \hat{\boldsymbol\theta}`} x={MX} y={300} size={T.calc} o={beat(0)} />
      <TeX s={String.raw`\dfrac{d\hat{\mathbf r}}{d\theta}=\hat{\boldsymbol\theta},\qquad \dfrac{d\hat{\boldsymbol\theta}}{d\theta}=-\hat{\mathbf r}`} x={MX} y={320} size={48} o={beat(2)} />
      <TeX s={String.raw`\mathbf a=-\dfrac{v^2}{r}\,\hat{\mathbf r}`} x={MX} y={330} size={T.eq} o={beat(4) + beat(5)} />
      {/* K6 round 1: the picture box now includes the colour bar's "− in / + out" (the credit sat on them) */}
      <SourceBelow text="Data: NOAA HRRR · ERA5 (Copernicus C3S)" pic={{ x: 120, y: 200, w: 840, h: 510 }} w={840} o={beat(6)} name="s31 src 1" />
      <SourceBelow text="Data: NOAA CO-OPS gauges · 27-29 Sep 2022" pic={{ x: 120, y: 250, w: 840, h: 480 }} w={840} o={beat(7) + beat(8)} name="s31 src 2" />
    </Scene>
  );
};

// ================================================================ s32 the series end card (maths ending, word for word)
const S32: React.FC = () => {
  const f = useCurrentFrame(), k = K("s32_end");
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
          {rel.map((s2, i) => <Lbl key={s2} x={COLX[Math.floor(i / 5)]} y={ROWY(i % 5)} t={s2} c={C.muted} s={T.floor} b={false} />)}
        </g>
      </Svg>
    </Scene>
  );
};

export const SCENES_C: Record<string, React.FC> = {
  s21_amphan_intro: S21, s22_amphan_eye: S22, s23_amphan_ring: S23, s24_amphan_curtain: S24, s25_why_cylindrical: S25, s26_onshore: S26, s27_surge: S27,
  s28_ian_record: S28, s29_flood_flight: S29, s30_flood_swipe: S30, s31_recap: S31, s32_end: S32,
};
void [ColourBar, mix, poly, STK, SEC, Cross];

