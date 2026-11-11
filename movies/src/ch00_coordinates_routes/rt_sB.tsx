// ch00_coordinates_routes scenes s06-s10: the slicing sheet and why the great circle is shortest (s06), the globe turned face-on
// to the sheet: σ and d = a σ (s07), then the optional maths block: the two position arrows (s08, skip chip), cos σ = r̂₁ · r̂₂
// (s09) and the distance (s10). The face-on disc of s07-s10 is the SAME geometry: its centre, radius and arrow angles are the
// projections of the centre, r̂₁ and r̂₂ through the s07 face-on camera (DISC below). Numbers from data/rt.json only.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Pt, pulse } from "../house/kit/draw";
import { GlobeFrame, SourceBelow } from "../house/kit/frame";
import { CurvedLink } from "../house/kit/extras";
import { Part } from "../house/kit/tex";
import { GlobeCam, globePath } from "./kit_rt/globe";
import {
  AT, Arrow, CalcStack, ClockIcon, D, D2R, Disc, DiscV, GB, GC, Globe, H, HL, K, Keyword, Recall, along, LAX, LEN, LON, LL, Layered, Lbl, OptionalTag, PlaneIcon, RO, Route, SE,
  SLATE, SRC_G, SS, Scene, SideCallout, SkipChip, Stool, Svg, TeX, XC, add, arcD, chipSpan, clamp, dP, discOf, e2g, fin, fout, gdot, globeG, mix, pieces,
  plab, poly, prog, sang, scaleDisc, skipTo, win,
} from "./rt_lib";
import { CAM_ROUTE, planePt } from "./rt_sA";
import { EQ_S02, EQ_S07, EQ_S08, EQ_S09, EQ_S10, cutAt } from "./rt_eq";

// ---------------------------------------------------------------- numbers on screen = the data
const CHECK_B: [string, number, number, number][] = [
  ["r11", RO.r1[0], 0.622, 5e-4], ["r12", RO.r1[1], -0.001, 5e-4], ["r13", RO.r1[2], 0.783, 5e-4], ["r21", RO.r2[0], -0.392, 5e-4], ["r22", RO.r2[1], -0.730, 5e-4],
  ["r23", RO.r2[2], 0.560, 5e-4], ["c1", RO.cs1[0], 0.622, 5e-4], ["sl1", RO.cs1[2], -0.0023, 5e-5], ["s1", RO.cs1[3], 0.783, 5e-4], ["c2", RO.cs2[0], 0.829, 5e-4],
  ["cl2", RO.cs2[1], -0.473, 5e-4], ["sl2", RO.cs2[2], -0.881, 5e-4], ["s2", RO.cs2[3], 0.560, 5e-4], ["dot", RO.dot, 0.195, 5e-4], ["sig", RO.sig_deg, 78.7, 0.05],
  ["sig2", RO.sig_deg, 78.74, 0.005], ["rad", RO.sig_rad, 1.3742, 5e-5], ["d", RO.d_km, 8755, 0.5], ["quick", 78.74 * 111.2, 8756, 0.5], ["sig exact", 78.738 * Math.PI / 180, 1.3742, 5e-5], ["deg", D.scale.dy, 111.2, 0.05], ["h", RO.d_km / 900, 9.7, 0.05],
  ["tick", D.scale.dy * 10, 1112, 0.5], ["lon", LON[0], 51.5, 0.011], ["la", LAX[0], 34, 0.051], ["law", -LAX[1], 118, 0.241],
];
CHECK_B.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
const GSrc: React.FC<{ o?: number }> = ({ o = 1 }) => <SourceBelow text={SRC_G} pic={GB} w={960} o={o} name="globe src" />;
/** the face-on camera: looking down the normal r̂₁ × r̂₂ of the great-circle plane (data: plane.lat/lon) */
// (dist 4.0: a little further out than the house 3.4, so the city names fit beside the rim)
const CAM_N: GlobeCam = { lat: D.plane.lat, lon: D.plane.lon, dist: 4.0 };
const DISC: DiscV = (() => {
  const G = globeG(CAM_N), c = G.pw([0, 0, 0]), p1 = G.pw(e2g(RO.r1)), p2 = G.pw(e2g(RO.r2));
  const R1 = Math.hypot(p1[0] - c[0], p1[1] - c[1]), R2 = Math.hypot(p2[0] - c[0], p2[1] - c[1]);
  if (Math.abs(R1 - R2) > 0.5) throw new Error(`face-on disc: |r̂₁| ${R1} ≠ |r̂₂| ${R2} on screen`);
  const a1 = sang([p1[0] - c[0], p1[1] - c[1]]);
  let da = sang([p2[0] - c[0], p2[1] - c[1]]) - a1;
  da = ((da % 360) + 540) % 360 - 180;
  if (Math.abs(Math.abs(da) - RO.sig_deg) > 0.05) throw new Error(`face-on disc: angle ${da} ≠ σ ${RO.sig_deg}`);
  return { c, R: R1, a1, a2: a1 + da };
})();
const SGN = Math.sign(DISC.a2 - DISC.a1);
const mid = (V: DiscV) => (V.a1 + V.a2) / 2;
/** a label just outside the tip of the arrow at screen angle a */
const tipAt = (V: DiscV, a: number, off = 48): Pt => dP(V, a, V.R + off);

// ================================================================ s06 the slicing sheet through London, Los Angeles and the centre
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = K("s06_great_circle");
  const tLon = AT(k, 1, "London"), tLA = AT(k, 2, "Los Angeles"), tSh = AT(k, 3, "flat sheet slicing"), tStool = AT(k, 4, "three legs steady a stool"), tTr = AT(k, 5, "traces a great circle"),
    tWhy = SS(k, 6), tAll = AT(k, 7, "all the circles"), tBig = AT(k, 8, "biggest of them"), tStr = AT(k, 9, "string pulled tight"),
    tPuck = AT(k, 10, "the puck from Part 4");   // remake 2026-11-07: Part 4's puck "along a great circle, which we'll meet in Part 6" paid off
  const puckT = prog(f, tPuck + 10, LEN(k) - 10);
  const cam = globePath([{ f: 0, lat: 24, lon: -32, dist: 3.4 }, { f: 20, lat: 24, lon: -32, dist: 3.4 }, { f: tLon + 20, lat: LON[0], lon: LON[1], dist: 3.4 },
    { f: tLA - 12, lat: LON[0], lon: LON[1], dist: 3.4 }, { f: tLA + 80, ...CAM_ROUTE }, { f: LEN(k) + 10, ...CAM_ROUTE, lon: -61 }], f);
  const sheet = win(f, tSh, tWhy - 10, 16);
  const SM = D.small as { lat: number[]; lon: number[]; flat: number[]; flon: number[] }[];
  const smPts = (i: number): LL[] => SM[i].lat.map((la, j) => [la, SM[i].lon[j]] as LL);
  const gc61: LL[] = Array.from({ length: 61 }, (_, i) => GC[3 * i]);
  const snap = prog(f, tStr + 10, tStr + 26);
  const str: LL[] = gc61.map(([la, lo], i) => [mix(SM[2].lat[i], la, snap), mix(SM[2].lon[i], lo, snap)] as LL);
  const pul = pulse(f, tStool + 10, 26);
  return (
    <Scene>
      <Globe cam={cam} grat={0.15} meshO={1 - 0.6 * sheet}
        over={(G) => { const pl = Array.from({ length: 73 }, (_, i) => G.pw(planePt((i * 5) * D2R))), c0 = G.pw([0, 0, 0]);
          return <>
            <path d={poly(pl) + "Z"} fill={C.key} fillOpacity={0.25} stroke={C.key} strokeOpacity={0.6} strokeWidth={2} opacity={sheet} />
            <path d={poly(pl.slice(0, 1 + Math.round(72 * prog(f, tTr, tTr + 60)))) } fill="none" stroke={C.gold} strokeWidth={4} opacity={fin(f, tTr) * fout(f, tWhy + 30, 20)} />
            <Route G={G} pts={GC} c={C.gold} w={fin(f, tTr) > 0 ? 10 : 7} o={fin(f, tTr)} />
            {SM.map((_, i) => <Route key={i} G={G} pts={smPts(i)} c={SLATE} w={5} upto={prog(f, tAll + 12 * i, tAll + 12 * i + 40)} o={fin(f, tAll + 12 * i) * fout(f, tBig + 10, 20)} />)}
            <Route G={G} pts={str} c={C.key} w={3} o={fin(f, tStr)} />
            <circle cx={c0[0]} cy={c0[1]} r={10 + 8 * pul} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={sheet} />
            {gdot(G, LON[0], LON[1], C.gold, 10 + 8 * pul)}{gdot(G, LAX[0], LAX[1], C.gold, 10 + 8 * pul, fin(f, tLA))}
            {plab(G, LON[0], LON[1], "London", fin(f, tLon), -18, -36, "end")}
            {plab(G, LAX[0], LAX[1], "Los Angeles", fin(f, tLA), 16, 42)}
            {/* the Part 4 puck gliding along the great circle (illustrative; the route's own points) */}
            {(() => { const P = along(G, GC, puckT); return P.vis && f >= tPuck ? <circle cx={P.p[0]} cy={P.p[1]} r={13} fill={C.key} stroke={C.bg} strokeWidth={4} opacity={fin(f, tPuck)} /> : null; })()}
          </>; }} />
      <GlobeFrame id="s06k" zoom={0} disc={discOf(cam)} />
      <GSrc />
      <Svg>
        <Keyword f={f} text="London → Los Angeles" at={[XC, 110]} appear={0} out={tWhy - 18} />
        <Lbl x={XC} y={200} t="London: 51.5° N, near 0°" c={C.key} s={T.floor} o={win(f, tLon, tWhy - 18)} />
        <Lbl x={XC} y={270} t="Los Angeles: 34° N, 118° W" c={C.key} s={T.floor} o={win(f, tLA, tWhy - 18)} />
        <Keyword f={f} text="one flat sheet" at={[XC, 370]} appear={tSh} out={tWhy - 18} />
        <Lbl x={XC} y={440} t="London · Los Angeles · centre" c={C.key} s={T.floor} o={win(f, tSh + 30, tWhy - 18)} />
        <Stool c={[1210, 570]} s={0.8} o={win(f, tStool, tWhy - 18)} />
        <Lbl x={1320} y={570} t="3 points → 1 sheet" c={C.key} s={T.floor} o={win(f, tStool, tWhy - 18)} />
        <Keyword f={f} text="great circle route" at={[XC, 680]} appear={tTr} c={C.gold} />
        <Keyword f={f} text="why the shortest?" at={[XC, 200]} appear={tWhy} />
        <Keyword f={f} text="circles through both cities" at={[XC, 290]} s={T.floor} appear={tAll} c={SLATE} />
        <Keyword f={f} text="the biggest bends the least" at={[XC, 370]} s={T.floor} appear={tBig} c={C.gold} />
        <Keyword f={f} text="a string pulled tight" at={[XC, 450]} s={T.floor} appear={tStr} />
        <Keyword f={f} text="Part 4's puck: a great circle" at={[XC, 530]} s={T.floor} appear={tPuck} c={C.gold} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s07 the face-on sheet: σ and d = a σ (the arc rule of Part 1)
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_sigma");
  const tTurn = SS(k, 1), tFlat = SS(k, 2), tA1 = AT(k, 3, "one arrow from the centre"), tA2 = AT(k, 3, "another one"), tSig = AT(k, 4, "is called sigma"),
    tArc = AT(k, 5, "arc of the circle"), tRule = AT(k, 6, "arc rule from Part 1"), tD = AT(k, 7, "d equals"), tDeg = AT(k, 9, "Every degree"), tKnow = SS(k, 10);
  const cam = globePath([{ f: 0, ...CAM_ROUTE, lon: -61 }, { f: tTurn, ...CAM_ROUTE, lon: -61 }, { f: tTurn + 130, ...CAM_N }, { f: LEN(k) + 10, ...CAM_N }], f);
  const flat = fin(f, tFlat, 30);
  const V = DISC, m = mid(V);
  const aR = m + 180;                                           // the radius tagged "a": opposite the route
  const ticks = Array.from({ length: 7 }, (_, i) => V.a1 + SGN * 10 * (i + 1));
  // Part 1's ring (inset in the column)
  const ic: Pt = [1250, 330], ir = 100;
  return (
    <Scene>
      {/* r1fix 2026-11-10 (review 1 S3): the texture is gone once the sheet is face-on (a geometry diagram, not a map: South America showed through) */}
      <Globe cam={cam} grat={0.15 * (1 - flat)} coast={0.4 * (1 - flat)} meshO={1 - flat}
        over={(G) => { const pl = Array.from({ length: 73 }, (_, i) => G.pw(planePt((i * 5) * D2R)));
          return <>
            <path d={poly(pl) + "Z"} fill={C.key} fillOpacity={0.22} stroke={C.gold} strokeWidth={3} opacity={1 - flat} />
            <Route G={G} pts={GC} c={C.gold} w={8} o={1 - flat} />
            {gdot(G, LON[0], LON[1], C.key, 9, 1 - flat)}{gdot(G, LAX[0], LAX[1], C.key, 9, 1 - flat)}
          </>; }} />
      <GlobeFrame id="s07k" zoom={0} disc={discOf(cam)} />
      <GSrc />
      <Svg>
        <Disc V={V} o={flat} a1o={fin(f, tA1)} a2o={fin(f, tA2)} sig={prog(f, tSig, tSig + 30)} route={prog(f, tArc, tArc + 40)} />
        <line x1={V.c[0]} y1={V.c[1]} x2={dP(V, aR)[0]} y2={dP(V, aR)[1]} stroke={C.key} strokeWidth={4} strokeDasharray="10 8" opacity={flat} />
        {ticks.map((a, i) => { const p = dP(V, a, V.R - 18), q = dP(V, a, V.R + 18); return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={C.key} strokeWidth={4} opacity={fin(f, tDeg + 6 * i)} />; })}
        <g data-lc-maplabel="1">
          <Lbl x={tipAt(V, V.a1)[0] + 50} y={tipAt(V, V.a1)[1]} t="London" c={C.key} s={T.floor} o={fin(f, tA1 + 10)} />
          <Lbl x={tipAt(V, V.a2)[0] - 30} y={tipAt(V, V.a2)[1] - 65} t="Los Angeles" c={C.key} s={T.floor} a="middle" o={fin(f, tA2 + 10)} />
        </g>
        {/* the inset: Part 1's ring, s = r θ, and the gold "same" pairs */}
        <g opacity={fin(f, tRule)}>
          <circle cx={ic[0]} cy={ic[1]} r={ir} fill="none" stroke={C.first} strokeWidth={4} />
          <line x1={ic[0]} y1={ic[1]} x2={ic[0] + ir} y2={ic[1]} stroke={C.key} strokeWidth={3} />
          <line x1={ic[0]} y1={ic[1]} x2={ic[0] + ir * Math.cos(60 * D2R)} y2={ic[1] - ir * Math.sin(60 * D2R)} stroke={C.key} strokeWidth={3} />
          <path d={arcD(ic, ir, 0, 60)} fill="none" stroke={C.gold} strokeWidth={8} />
          <path d={arcD(ic, 30, 0, 60)} fill="none" stroke={C.gold} strokeWidth={3} />
        </g>
        <Keyword f={f} text="how long?" at={[XC, 110]} appear={0} out={tRule - 18} />
        {/* r1fix 2026-11-10 (review 1 M5): the column names each piece on its word while the disc is built (it showed only "how long?" for 30 s) */}
        <Keyword f={f} text="a flat circle, radius $a$" at={[XC, 200]} s={T.floor} appear={tFlat} out={tRule - 18} />
        <Keyword f={f} text="$\hat{\mathbf r}_1$: centre → London" at={[XC, 280]} s={T.floor} appear={tA1} out={tRule - 18} c={C.ink} />
        <Keyword f={f} text="$\hat{\mathbf r}_2$: centre → Los Angeles" at={[XC, 350]} s={T.floor} appear={tA2} out={tRule - 18} c={C.second} />
        <Keyword f={f} text="$\sigma$: the angle at the centre" at={[XC, 430]} s={T.floor} appear={tSig} out={tRule - 18} c={C.gold} />
        <Keyword f={f} text="$d$: the arc between the tips" at={[XC, 510]} s={T.floor} appear={tArc} out={tRule - 18} c={C.gold} />
        {/* remake 2026-11-07 (R16): the recall keyword of the series ("derived in Part K: <name>") */}
        <Lbl x={XC} y={190} t="derived in Part 1: arc length" c={C.gold} s={T.floor} o={fin(f, tRule)} />
        <Keyword f={f} text="know $\sigma$ → know the distance" at={[XC, 830]} s={T.floor} appear={tKnow} />
      </Svg>
      <TeX s={H.r1} x={tipAt(V, V.a1)[0]} y={tipAt(V, V.a1)[1]} size={54} c={C.ink} ax={0.5} o={fin(f, tA1)} halo />
      <TeX s={H.r2} x={tipAt(V, V.a2)[0]} y={tipAt(V, V.a2)[1]} size={54} c={C.second} ax={0.5} o={fin(f, tA2)} halo />
      <TeX s={String.raw`\sigma`} x={dP(V, m, V.R * 0.42)[0]} y={dP(V, m, V.R * 0.42)[1]} size={60} c={C.gold} ax={0.5} o={fin(f, tSig)} halo />
      <TeX s={String.raw`d`} x={dP(V, m, V.R + 46)[0]} y={dP(V, m, V.R + 46)[1]} size={60} c={C.gold} ax={0.5} o={fin(f, tArc)} halo />
      <TeX s={String.raw`a`} x={dP(V, aR, V.R * 0.55)[0]} y={dP(V, aR, V.R * 0.55)[1] - 30} size={56} c={C.key} ax={0.5} o={flat * fin(f, tFlat + 40)} halo />
      <TeX s={String.raw`r`} x={ic[0] + ir / 2} y={ic[1] + 36} size={46} c={C.key} ax={0.5} o={fin(f, tRule)} />
      <TeX s={String.raw`\theta`} x={ic[0] + 38} y={ic[1] - 34} size={44} c={C.gold} o={fin(f, tRule)} />
      <TeX s={String.raw`s`} x={ic[0] + ir * Math.cos(30 * D2R) + 22} y={ic[1] - ir * Math.sin(30 * D2R) - 16} size={48} c={C.gold} o={fin(f, tRule)} />
      <TeX s={String.raw`s=r\,\theta`} x={1430} y={255} size={54} o={fin(f, tRule + 10)} />
      {[String.raw`r\ \leftrightarrow\ a`, String.raw`\theta\ \leftrightarrow\ \sigma`, String.raw`s\ \leftrightarrow\ d`].map((q, i) =>
        <TeX key={q} s={q} x={1430} y={330 + 55 * i} size={46} c={C.gold} o={fin(f, tRule + 40 + 15 * i)} />)}
      <TeX s={String.raw`s=r\,\theta\ \ \longrightarrow\ \ d=a\,\sigma`} x={XC} y={500} size={54} o={fin(f, tD)} />
      <TeX s={EQ_S07} x={XC} y={600} size={64} c={C.gold} o={fin(f, tD + 30)} />
      <TeX s={String.raw`1^\circ\ \text{of}\ \sigma\ \approx 111.2\ \text{km}`} x={XC} y={720} size={54} o={fin(f, tDeg)} />
    </Scene>
  );
};

// ================================================================ s08 the two position arrows, every input written (maths-skip chip)
const D8 = scaleDisc(DISC, [270, 255], 165);
const AX: Pt = [760, 360], AXS = 190;
const ax3 = (v: number[]): Pt => [AX[0] + AXS * (-0.55 * v[0] + v[1]), AX[1] + AXS * (0.45 * v[0] - v[2])];
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = K("s08_position_arrows");
  const [chipA, chipEnd] = chipSpan(k);
  const tR = SS(k, 3), tF = SS(k, 4), tLon = SS(k, 5), tC1 = AT(k, 6, "The cosine"), tP1 = AT(k, 7, "zero point six two two"), tS = SS(k, 8), tP2 = AT(k, 8, "about minus"),
    tP3 = AT(k, 9, "zero point seven eight three"), tLA = SS(k, 10), tC2 = SS(k, 11), tQ1 = AT(k, 12, "about minus"), tQ2 = AT(k, 13, "about minus"), tQ3 = AT(k, 14, "is zero point five");
  const [v1, v2] = cutAt(EQ_S08, String.raw`,\qquad `);
  const p1 = pieces(v1, ["0.622,", String.raw`\ -0.001,`, String.raw`\ 0.783)`]), p2 = pieces(v2, ["-0.392,", String.raw`\ -0.730,`, String.raw`\ 0.560)`]);
  // Part 1 lessons D1: London's position arrow r̂₁ is ink (was teal; teal = the round/tangential part)
  const parts1: Part[] = p1.map((t) => ({ t, c: C.ink })), parts2: Part[] = p2.map((t, i) => ({ t, c: i ? C.ink : C.second }));
  // r1fix 2026-11-10 (review 1 S4): the "r̂ ≈ (" bracket appears with its first part, not 12 s before it
  const L = (ts: number[], parts: Part[]) => [{ t: [0], o: fin(f, ts[0] - 8) }, ...ts.map((a, i) => ({ t: [i + 1], o: fin(f, a) }))].map((x) => ({ ...x, t: x.t as number[] })) ;
  const r2f = pieces(EQ_S02, [String.raw`\ \cos\varphi\sin`]);
  const o1 = ax3(RO.r1), o2 = ax3(RO.r2);
  const outL = tLA - 18;
  return (
    <Scene>
      <Svg>
        <Disc V={D8} sw={0.7} />
        {/* Part 3's fixed axes (x̂ to 0° N 0° E, ŷ to 0° N 90° E, ẑ to the North Pole), oblique view, with r̂₁ and r̂₂.
            r1fix 2026-11-10 (review 1 M5): the tripod, the r̂ formula and the "r̂₁: London, r̂₂: Los Angeles" row are there from the
            first frame (80 % of the frame was empty for 32 s); the keyword moves to the top and leaves before the skip chip */}
        <g>
          <Arrow p={AX} q={ax3([1.15, 0, 0])} color={C.muted} w={5} head={20} />
          <Arrow p={AX} q={ax3([0, 1.1, 0])} color={C.muted} w={5} head={20} />
          <Arrow p={AX} q={ax3([0, 0, 1.15])} color={C.muted} w={5} head={20} />
          <Arrow p={AX} q={o1} color={C.ink} w={8} head={28} o={fin(f, tP3)} />
          <Arrow p={AX} q={o2} color={C.second} w={8} head={28} o={fin(f, tQ3)} />
        </g>
        <Keyword f={f} text="$\sigma$, step by step" at={[XC, 110]} appear={0} out={chipA - 18} />
        <SkipChip f={f} k={k} to={skipTo("s11_route_shape")} />
      </Svg>
      <TeX s={H.r1} x={tipAt(D8, D8.a1, 34)[0]} y={tipAt(D8, D8.a1, 34)[1]} size={48} c={C.ink} ax={0.5} halo />
      <TeX s={H.r2} x={tipAt(D8, D8.a2, 34)[0]} y={tipAt(D8, D8.a2, 34)[1]} size={48} c={C.second} ax={0.5} halo />
      <TeX s={String.raw`\hat{\mathbf x}`} x={ax3([1.3, 0, 0])[0]} y={ax3([1.3, 0, 0])[1]} size={46} c={C.muted} ax={0.5} />
      <TeX s={String.raw`\hat{\mathbf y}`} x={ax3([0, 1.25, 0])[0]} y={ax3([0, 1.25, 0])[1]} size={46} c={C.muted} ax={0.5} />
      <TeX s={String.raw`\hat{\mathbf z}`} x={ax3([0, 0, 1.3])[0]} y={ax3([0, 0, 1.3])[1]} size={46} c={C.muted} ax={0.5} />
      <Layered parts={parts1} layers={L([tP1, tP2, tP3], parts1)} x={100} y={640} size={54} o={fin(f, tLon)} />
      <Layered parts={parts2} layers={L([tQ1, tQ2, tQ3], parts2)} x={100} y={745} size={54} o={fin(f, tLA)} />
      {/* column: what we need, the formula, then each city's inputs and its three parts */}
      <TeX s={String.raw`\hat{\mathbf r}_1:\ \text{London},\quad \hat{\mathbf r}_2:\ \text{Los Angeles}`} x={XC} y={250} size={46} />
      <TeX s={r2f[0]} x={XC} y={335} size={46} />
      <TeX s={r2f[1]} x={XC + 110} y={395} size={46} />
      {/* remake 2026-11-07 (R16): the position arrow recalled from Part 3 (the old opening recap carried it) */}
      <Recall f={f} tex="" name="position vector" part={3} x={XC} y={450} appear={AT(k, 4, "From Part 3")} out={tLon - 10} />
      <TeX s={String.raw`\text{London: }\varphi=51.51^\circ,\ \lambda=-0.13^\circ`} x={XC} y={495} size={46} c={C.ink} o={win(f, tLon, outL)} />
      {/* build1 2026-11-10 (K6): rows 56 px (a new last line, before the slide, stayed above the caption band y 880); both stacks start at y 680 (was 575): the line that slides out passes the city rows above at < 0.2 opacity */}
      {/* show it, don't voice it (2026-11-07): the products are on screen; the trig values (inputs) glow on their words */}
      <CalcStack f={f} x={1230} y={660} size={44} maxLines={2} o={fout(f, outL)} rows={[
        { h: 56, lhs: String.raw`\text{1st}`, rhs: String.raw`=\cos 51.51^\circ\times\cos(-0.13^\circ)`, at: tC1 },
        { h: 56, rhs: String.raw`=0.622\times1.000\approx0.622`, at: AT(k, 6, "is zero point six two two"), cont: true, glow: HL(f, AT(k, 6, "is zero point six two two")) },
        { h: 56, lhs: String.raw`\sin(-0.13^\circ)`, rhs: String.raw`=-0.0023`, at: tS, glow: HL(f, AT(k, 8, "is minus zero point zero zero two three")) },
        { h: 56, lhs: String.raw`\text{2nd}`, rhs: String.raw`=0.622\times(-0.0023)`, at: AT(k, 8, "so the second part") },
        { h: 56, rhs: String.raw`\approx-0.001`, at: tP2, cont: true },
        { h: 56, lhs: String.raw`\text{3rd}`, rhs: String.raw`=\sin 51.51^\circ\approx0.783`, at: SS(k, 9), glow: HL(f, tP3) },
      ]} />
      <TeX s={String.raw`\text{Los Angeles: }\varphi=34.05^\circ,`} x={XC} y={470} size={46} c={C.second} o={fin(f, tLA)} />
      {/* build1 2026-11-10 (K6): λ leaves before the 3rd part (sin 34.05° carries its own input), so the 2-row line sliding out never meets it */}
      <TeX s={String.raw`\lambda=-118.24^\circ`} x={XC + 330} y={525} size={46} c={C.second} o={win(f, tLA, SS(k, 14) - 12)} />
      <CalcStack f={f} x={1230} y={625} size={44} maxLines={2} rows={[
        { h: 56, lhs: String.raw`\cos\varphi`, rhs: String.raw`=0.829,\ \ \cos\lambda=-0.473`, at: tC2, glow: HL(f, AT(k, 11, "zero point eight two nine")) },
        { h: 56, lhs: String.raw`\sin\lambda`, rhs: String.raw`=-0.881`, at: AT(k, 11, "its sine lambda"), glow: HL(f, AT(k, 11, "minus zero point eight eight one")) },
        { h: 56, lhs: String.raw`\text{1st}`, rhs: String.raw`=0.829\times(-0.473)`, at: SS(k, 12) },
        { h: 56, rhs: String.raw`\approx-0.392`, at: tQ1, cont: true },
        { h: 56, lhs: String.raw`\text{2nd}`, rhs: String.raw`=0.829\times(-0.881)`, at: SS(k, 13) },
        { h: 56, rhs: String.raw`\approx-0.730`, at: tQ2, cont: true },
        { h: 56, lhs: String.raw`\text{3rd}`, rhs: String.raw`=\sin 34.05^\circ\approx0.560`, at: SS(k, 14), glow: HL(f, tQ3) },
      ]} />
      {void [chipEnd, tQ1, tQ2, tR, tF]}
    </Scene>
  );
};

// ================================================================ s09 cos σ = r̂₁ · r̂₂ (the dot product movie's rule), σ ≈ 78.7°
const D9 = scaleDisc(DISC, [430, 330], 250);
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09_cos_sigma");
  // remake 2026-11-07 (show it, don't voice it): one sentence says which parts are multiplied and that they are added (S4); the
  // three products and the sum are on screen, each on the words for its parts; S5 gives the result
  const tRule = SS(k, 1), tLen = SS(k, 2), tSh = SS(k, 3), tMul = SS(k, 4),
    tM = [AT(k, 4, "London's first part"), AT(k, 4, "then the second parts"), AT(k, 4, "then the third")],
    tPr = [AT(k, 4, "London's first part") + 24, AT(k, 4, "then the second parts") + 20, AT(k, 4, "then the third") + 20], tSum = AT(k, 4, "add the three products"),
    tCos = AT(k, 5, "about zero point"), tWhich = SS(k, 6), tInv = AT(k, 7, "inverse cosine"), tSig = AT(k, 7, "about seventy eight"),
    tQ = AT(k, 8, "quarter of the way round");
  // r1fix 2026-11-10 (review 1 M6): the three number columns 200 px apart, the gold pair-bracket 94 px right of each column's centre
  // (the widest number, "−0.730" at 52 px, ends 79 px right of it; the next column's number starts 141 px right): no stroke through a digit
  const V = D9, xs = [1300, 1500, 1700], y1 = 255, y2 = 345;
  const u1: Pt = [Math.cos(V.a1 * D2R), -Math.sin(V.a1 * D2R)];
  const tip2 = dP(V, V.a2), foot = add(V.c, u1, V.R * RO.dot);
  // r1fix (review 1 M6): σ at 0.5 R on the mid-ray, clear of the 0.3 R arc and 48 px from the dashed drop line (was 0.36 R: on both)
  const sigP = dP(V, mid(V), V.R * 0.5);
  return (
    <Scene>
      <Svg>
        {/* the dashed drop line from r̂₂'s tip to its foot on r̂₁ */}
        <line x1={tip2[0]} y1={tip2[1]} x2={foot[0]} y2={foot[1]} stroke={C.second} strokeWidth={3} strokeDasharray="8 7" opacity={fin(f, tSh)} />
        <Disc V={V} sig={prog(f, tInv, tInv + 30)} />
        {/* r1fix 2026-11-10 (review 1 S1): the shadow of r̂₂ (length 1) on r̂₁, a 20-px band in the caster's colour, cos σ ≈ 0.195 long, drawn
            OVER the disc (under it, r̂₁'s shaft and the centre dot hid all 49 px of it) */}
        <line x1={V.c[0]} y1={V.c[1]} x2={foot[0]} y2={foot[1]} stroke={C.second} strokeWidth={20} strokeOpacity={0.75} strokeLinecap="butt" opacity={fin(f, tSh)} />
        <path d={`M ${V.c[0]} ${V.c[1]} L ${dP(V, V.a1, V.R * 0.55)[0]} ${dP(V, V.a1, V.R * 0.55)[1]} ` + arcD(V.c, V.R * 0.55, V.a1, V.a1 + SGN * 90).replace(/^M/, "L") + " Z"}
          fill={SLATE} fillOpacity={0.18} stroke={SLATE} strokeWidth={3} opacity={fin(f, tQ)} />
        {xs.map((x, i) => <g key={i} opacity={fin(f, tM[i])}>
          <path d={`M ${x + 94} ${y1 - 8} L ${x + 106} ${y1 - 8} L ${x + 106} ${y2 + 8} L ${x + 94} ${y2 + 8}`} fill="none" stroke={C.gold} strokeWidth={5} strokeLinejoin="round" />
        </g>)}
        <Keyword f={f} text="rule from the dot product movie" at={[XC, 165]} s={T.floor} appear={0} out={tRule - 18} />
        {/* r1fix (review 1 M6): the link's head stops 40 px right of the σ label (it landed on the letter) */}
        <CurvedLink f={f} from={[1086, 815]} to={[sigP[0] + 44, sigP[1] + 6]} start={tInv + 40} bend={-80} />
        <OptionalTag f={f} from={-20} />
      </Svg>
      <TeX s={H.r1} x={tipAt(V, V.a1)[0]} y={tipAt(V, V.a1)[1]} size={54} c={C.ink} ax={0.5} halo />
      <TeX s={H.r2} x={tipAt(V, V.a2)[0]} y={tipAt(V, V.a2)[1]} size={54} c={C.second} ax={0.5} halo />
      <TeX s={String.raw`\sigma`} x={sigP[0]} y={sigP[1]} size={56} c={C.gold} ax={0.5} o={fin(f, tInv)} halo />
      <TeX s={String.raw`|\hat{\mathbf r}_1|=|\hat{\mathbf r}_2|=1`} x={430} y={690} size={52} ax={0.5} o={fin(f, tLen)} />
      <TeX s={String.raw`\text{shadow}=\cos\sigma`} x={430} y={780} size={48} c={C.second} ax={0.5} o={fin(f, tSh)} />
      <TeX s={String.raw`\mathbf a\cdot\mathbf b=|\mathbf a|\,|\mathbf b|\cos(\text{angle})`} x={XC} y={165} size={48} o={win(f, tRule, tLen - 18)} />
      <TeX s={EQ_S09} x={XC} y={165} size={58} c={C.gold} o={fin(f, tLen)} />
      <TeX s={H.r1} x={XC + 10} y={y1} size={54} c={C.ink} />
      <TeX s={H.r2} x={XC + 10} y={y2} size={54} c={C.second} />
      {[0.622, -0.001, 0.783].map((v, i) => <TeX key={`a${i}`} s={v.toFixed(3)} x={xs[i]} y={y1} size={52} ax={0.5} />)}
      {[-0.392, -0.730, 0.560].map((v, i) => <TeX key={`b${i}`} s={v.toFixed(3)} x={xs[i]} y={y2} size={52} ax={0.5} />)}
      <CalcStack f={f} x={1590} y={445} size={46} maxLines={3} rows={[
        { lhs: String.raw`0.622\times(-0.392)`, rhs: String.raw`\approx-0.244`, at: tPr[0] },
        { lhs: String.raw`(-0.001)\times(-0.730)`, rhs: String.raw`\approx+0.001`, at: tPr[1] },
        { lhs: String.raw`0.783\times0.560`, rhs: String.raw`\approx0.438`, at: tPr[2] },
      ]} />
      <TeX s={String.raw`\cos\sigma\approx-0.244+0.001+0.438`} x={XC} y={675} size={46} o={fin(f, tSum)} />
      <TeX s={String.raw`\approx0.195`} x={XC + 260} y={735} size={50} c={C.gold} o={fin(f, tCos)} glow={HL(f, tCos)} />
      <TeX s={String.raw`\sigma=\cos^{-1}(0.195)\approx78.7^\circ`} x={XC} y={815} size={46} c={C.gold} o={fin(f, tInv)} glow={HL(f, tSig)} />
      {void [tMul, tWhich]}
    </Scene>
  );
};

// ================================================================ s10 σ in radians, d = a σ ≈ 8755 km, the per-degree check, ≈ 9.7 h
const D10 = scaleDisc(DISC, [430, 400], 250);
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_distance");
  const tRad = SS(k, 1), tSig = AT(k, 2, "seventy eight point seven three eight"), tSigE = AT(k, 2, "about one point"), tD = SS(k, 3), tDv = AT(k, 4, "eight thousand"),
    tQ = AT(k, 5, "the quick way"), tQv = AT(k, 5, "make about eight thousand"), tQr = AT(k, 5, "the same to within"), tCr = AT(k, 6, "nine hundred kilometres per hour"), tH = AT(k, 6, "nearly ten hours");
  const V = D10, m = mid(V);
  const e = pieces(EQ_S10, [String.raw`\approx 6371`, String.raw`\approx 8755`]);
  const ticks = Array.from({ length: 7 }, (_, i) => V.a1 + SGN * 10 * (i + 1));
  const lab = dP(V, m, V.R + 64);
  const tk1 = dP(V, V.a1 - SGN * 8, V.R + 40);
  const fly = clamp((f - tCr) / 120, 0, 1);
  return (
    <Scene>
      <Svg>
        <Disc V={V} sig={1} route={1} />
        {ticks.map((a, i) => { const p = dP(V, a, V.R - 18), q = dP(V, a, V.R + 18); return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={C.key} strokeWidth={4} opacity={0.35 + 0.65 * fin(f, tQ + 6 * i)} />; })}
        <g data-lc-maplabel="1"><Lbl x={lab[0]} y={lab[1]} t="≈ 8755 km" c={C.gold} s={T.floor} a="middle" o={fin(f, tDv)} /></g>
        <CurvedLink f={f} from={[XC - 14, 500]} to={[lab[0] + 70, lab[1] + 24]} start={tDv + 20} bend={60} end={tQ - 12} />
        <PlaneIcon p={[mix(300, 560, fly), 760]} s={0.9} o={fin(f, tCr)} />
        <ClockIcon c={[700, 760]} o={fin(f, tH)} />
        <Keyword f={f} text="$\sigma$ in radians" at={[XC, 170]} appear={0} out={tRad - 18} />
        <Keyword f={f} text="10° ≈ 1112 km" at={[tk1[0], tk1[1]]} s={T.floor} appear={tQ + 50} />
        <OptionalTag f={f} from={-20} to={LEN(k) - 14} />
      </Svg>
      <TeX s={String.raw`\sigma`} x={dP(V, m, V.R * 0.42)[0]} y={dP(V, m, V.R * 0.42)[1]} size={56} c={C.gold} ax={0.5} halo />
      <TeX s={String.raw`\approx9.7\ \text{h}`} x={760} y={760} size={52} o={fin(f, tH)} />
      <CalcStack f={f} x={1230} y={175} size={46} maxLines={3} rows={[
        { lhs: String.raw`1^\circ`, rhs: String.raw`=\dfrac{\pi}{180}\ \text{rad}\approx0.01745\ \text{rad}`, at: tRad, h: 92, glow: HL(f, AT(k, 1, "about zero point")) },
        // Part 1 lessons A6: the row says which exact angle it uses (78.74 x 0.01745 would give 1.3740, not 1.3742)
        { lhs: String.raw`\sigma`, rhs: String.raw`\approx78.738^\circ\times\dfrac{\pi}{180}`, at: tSig },
        { rhs: String.raw`\approx1.3742\ \text{rad}`, at: tSigE, cont: true },
      ]} />
      <Layered parts={[{ t: e[0] }, { t: e[1] }]} layers={[{ t: [0], o: 1 }, { t: [1], o: fin(f, AT(k, 3, "six thousand")), glow: HL(f, AT(k, 3, "six thousand")) }]} x={XC} y={500} size={50} o={fin(f, tD)} />
      <TeX s={e[2]} x={XC + 120} y={570} size={54} c={C.gold} o={fin(f, tDv)} glow={HL(f, tDv)} />
      {/* Part 1 lessons A6: the quick check said as it is: 78.74 x 111.2 = 8755.9, so 8756, the same to within the rounding */}
      <TeX s={String.raw`78.74\times111.2\ \text{km}\approx8756\ \text{km}`} x={XC} y={670} size={44} o={fin(f, tQv)} />
      <TeX s={String.raw`\approx8755\ \text{(rounding)}`} x={XC + 40} y={724} size={44} c={C.muted} o={fin(f, tQr)} />
      <TeX s={String.raw`8755\ \text{km}\div900\ \text{km/h}\approx9.7\ \text{h}`} x={XC} y={790} size={44} o={fin(f, tH)} />
    </Scene>
  );
};

export const SCENES_B: Record<string, React.FC> = { s06_great_circle: S06, s07_sigma: S07, s08_position_arrows: S08, s09_cos_sigma: S09, s10_distance: S10 };
void [SE, LAX, GC, SideCallout, clamp, poly, pulse];
export { DISC, CAM_N, SGN };
