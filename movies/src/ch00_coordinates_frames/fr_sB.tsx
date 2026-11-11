// ch00_coordinates_frames scenes s10-s19: the coast frame (SW Florida; the bearing 329° from two Natural Earth coast points; α =
// 121°; Ian's HRRR 20 UTC wind split along and across), the arrows turning as you move (plane from above the pole), Part 2's
// turning rules, the plan (which motion turns which arrow), and Di/Dt derived (top view, then the meridian slice).
// Numbers from data/fr.json only (CHECK rows below).
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Band, Pt } from "../house/kit/draw";
import { GlobeFrame } from "../house/kit/frame";   // r8d: SourceBelow comes gated from fr_lib
import { AnimatedWindArrow, FlowParticles } from "../house/kit/wind";
import { CurvedLink } from "../house/kit/extras";
import { GlobeCam, LatCircle, llPath } from "./kit_fr/globe";
import {
  AT, Arrow, BREST, CalcStack, D, D2R, GB, GFULL, GeoImg, GeoMap, Globe, H, IMGS, K, Keyword, LEN, Lbl, PlaneIcon, Place, Recall, SE, SS, Scene, SideCallout, SkipChip,
  SpeedBar, Svg, TeX, Tripod, XC, add, boxAt, clamp, discOf, enAt, fin, fout, garrow, gdot, globeG, keepTime, linesPath, ll, mapP, mix, pieces, poly, prog, sang, svP,
  tvP, win, TopV, SliceV, ParcelDot, chipSpan,
  HL,
  SourceBelow,
  InsetGlobe, CAM_INSET, INSET, uarrow, gtip, gtip2, rhatAt, add3,
} from "./fr_lib";
import { V3 } from "./kit_fr/cam";
import { AngleArc, GRID, GridBase, SliceBase, TopViewBase, circleArrows, gridCell, sliceArrows, topArrows, turned } from "./fr_dia";
import { EQ_S10, EQ_S11, EQ_S12, EQ_S13, EQ_S16, EQ_S18, EQ_S19, cutAt } from "./fr_eq";

const CO = D.coast, IAN = D.ian, TU = D.turn;
const CHECK_B: [string, number, number, number][] = [
  ["dphi", CO.dphi, 0.823, 6e-4], ["dlam", CO.dlam, -0.553, 6e-4], ["dy", CO.dy, 91.5, 0.1], ["dx", CO.dx, -55.0, 0.05], ["tanb", CO.tanb, 0.601, 6e-4],
  ["beta", CO.beta, 31, 0.05], ["brg", CO.brg, 329.1, 0.05], ["xp1", CO.xp[0], -0.515, 5e-4], ["xp2", CO.xp[1], 0.857, 5e-4], ["yp1", CO.yp[0], -0.857, 5e-4],
  ["yp2", CO.yp[1], -0.515, 5e-4], ["u", IAN.u[0], 22.2, 0.05], ["v", IAN.u[1], 24.3, 0.05], ["sp", IAN.sp, 33, 0.5], ["along", IAN.along, 9.4, 0.05],
  ["across", IAN.across, -31.54, 0.05], ["swing", TU.swing, 12, 0.2], ["tilt", TU.tilt, 1, 1e-3], ["rate", TU.rate10 * 1e6, 2.4, 0.04], ["perday", TU.rate10 * 86400 / D2R, 12, 0.31],
  ["R", TU.R_km, 4230, 1],
];
CHECK_B.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

const XZ = 1190;
const CAM_TOP: GlobeCam = { lat: 89.5, lon: BREST[1], dist: 3.4 };
const MAPB = { x: 80, y: 50, w: 920, h: 740 };
const MSRC = "Data: Natural Earth (coastline)";
const MAP14 = { x: 80, y: 50, w: 920, h: 640 };
/** the coast frame at a point p on a map: along x̂′ (bearing 329°) and across ŷ′ (x̂′ turned +90°), screen directions */
const XP: Pt = [CO.xp[0], -CO.xp[1]], YP: Pt = [CO.yp[0], -CO.yp[1]];

// ================================================================ s10 a frame turned on purpose: the coast frame, RECALLED from Part 2
// (remake 2026-11-07, continuity_plan §2c item 1, R15/R16). Phase 1 (S0-S6): the flat coast map; the axes turn from î, ĵ to x̂′, ŷ′ by
// α = 121°; Part 1's equations ("derived in Part 1: turned axes") and Part 2's result (coast 329°, α 121°, along 9.4 / across −31.5, "found
// in Part 2"). Phase 2 (S7): the 3-D point, new in Part 4: a zoomed globe at Fort Myers Beach, k̂ stays, î and ĵ turn about it by α.
// Phase 3 (S8-S9): s11's map with Naples, Englewood and the two legs Part 2 read off a km map ("?"), the question s11 answers.
const FMB_CAM: GlobeCam = { lat: 26.0, lon: -82.6, dist: 2.4, pp: [560, 450] };
const B11 = () => boxAt(26.52, -82.15, 1.35, MAPB.x, MAPB.y, MAPB.w, MAPB.h);
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_coast_frame");
  const tAl = SS(k, 1), tP2 = SS(k, 2), tX = SS(k, 3), tY = SS(k, 4), tBrg = SS(k, 5), tAlpha = AT(k, 5, "so alpha"),
    tWind = SS(k, 6), tAlong = AT(k, 6, "nine point four"), tAcross = AT(k, 6, "minus thirty one"), tLand = AT(k, 6, "onto the land"),
    t3D = SS(k, 7), tTurn3 = AT(k, 7, "turn only"), tLegs = SS(k, 8), tNow = SS(k, 9);
  const B = boxAt(26.55, -82.05, 1.6, MAPB.x, MAPB.y, MAPB.w, MAPB.h);
  const P = mapP(B), p0 = P(IAN.fmb[0], IAN.fmb[1]), U = 170, s = 4.2;
  const a = 121 * prog(f, tX, tX + 60);
  const ex: Pt = [Math.cos(a * D2R), -Math.sin(a * D2R)], ny: Pt = [-Math.sin(a * D2R), -Math.cos(a * D2R)];
  const turnedNow = a > 1;
  const eq = cutAt(EQ_S10, String.raw`,\qquad `);
  const o1 = fout(f, t3D - 6, 16), o2 = fin(f, t3D - 6, 16) * fout(f, tLegs - 6, 16), o3 = fin(f, tLegs - 6, 16);
  // r8d (k6r8c f21520-21526, f21882-21888): exit before entry between the phases. The pictures cross-fade (o1 / o2 / o3); phase 2's text and
  // credit enter only after phase 1's have gone (t3D + 10), phase 3's credit only after phase 2's (tLegs + 10)
  const o2t = fin(f, t3D + 12, 12) * fout(f, tLegs - 6, 16), o3t = fin(f, tLegs + 12, 12);
  const w: Pt = [IAN.u[0] * s, -IAN.u[1] * s];
  const al = add(p0, XP, IAN.along * s), ac = add(p0, YP, IAN.across * s);
  // phase 2: the local tripod at Fort Myers Beach on the globe, î and ĵ turning about k̂ by α (anticlockwise seen from above)
  const G = globeG(FMB_CAM, GFULL), L = 0.13;
  const E = enAt(IAN.fmb[0], IAN.fmb[1]), b0 = ll(IAN.fmb[0], IAN.fmb[1]);
  const a3 = 121 * prog(f, tTurn3, tTurn3 + 60);
  const comb = (c1: number, c2: number): V3 => [b0[0] + L * (c1 * E.e[0] + c2 * E.n[0]), b0[1] + L * (c1 * E.e[1] + c2 * E.n[1]), b0[2] + L * (c1 * E.e[2] + c2 * E.n[2])];
  const xq = comb(Math.cos(a3 * D2R), Math.sin(a3 * D2R)), yq = comb(-Math.sin(a3 * D2R), Math.cos(a3 * D2R));
  const kq: V3 = [b0[0] * (1 + L * 1.15), b0[1] * (1 + L * 1.15), b0[2] * (1 + L * 1.15)];
  const tipLab = (q: V3, d = 40): Pt => { const s0 = G.pw(b0), s1 = G.pw(q), dx = s1[0] - s0[0], dy = s1[1] - s0[1], n = Math.hypot(dx, dy) || 1; return [s1[0] + (dx / n) * d, s1[1] + (dy / n) * d]; };
  // phase 3: s11's map, the two coast points and the two legs
  const B3 = B11(), P3 = mapP(B3), A3 = P3(CO.A[0], CO.A[1]), Bp3 = P3(CO.B[0], CO.B[1]), Cn3 = P3(CO.B[0], CO.A[1]);
  return (
    <Scene>
      {/* phase 1: the coast map with the axes turning, the wind and its two parts */}
      <GeoMap id="s10m" B={B} o={o1}>
        {(Pm) => <path d={linesPath(Pm, CO.lines)} fill="none" stroke={C.key} strokeOpacity={0.9} strokeWidth={2.6} />}
      </GeoMap>
      <Svg o={o1}>
        <Band p={p0} q={al} color={C.first} o={0.75 * fin(f, tAlong)} />
        <Band p={p0} q={ac} color={C.neg} o={0.75 * fin(f, tAcross)} />
        <Arrow p={p0} q={add(p0, ex, U)} color={C.second} w={9} head={34} />
        <Arrow p={p0} q={add(p0, ny, U)} color={C.second} w={9} head={34} />
        {f >= tWind ? <g opacity={fin(f, tWind)}><AnimatedWindArrow from={p0} to={add(p0, w)} speed={IAN.sp} f={f} c={C.ink} px={9} head={30} /></g> : null}
        <circle cx={p0[0]} cy={p0[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        <AngleArc c={p0} r={64} a0={0} a1={a} col={C.second} o={fin(f, tX)} head />
        {/* k6r8b fix (2026-11-09): the town name and "Gulf of Mexico" sat on each other and on ŷ′ (which turns down-left, out to sea)
            from f20213 on; the name now sits below-right of the dot on the land (x̂′ goes up-left, the wind and α up-right), the sea
            label low in the open Gulf, clear of ŷ′'s tip (≈ 400, 575) */}
        <Place p={p0} t="Fort Myers Beach" o={fin(f, AT(k, 2, "Fort Myers Beach"))} dx={40} dy={72} a="start" r={0} />
        <g data-lc-maplabel="1"><Lbl x={140} y={700} t="Gulf of Mexico" c={C.key} s={T.floor} italic o={fin(f, AT(k, 2, "Florida"))} /></g>
        <g data-lc-maplabel="1"><Lbl x={760} y={250} t="Florida" c={C.key} s={T.floor} o={fin(f, AT(k, 2, "Florida"))} /></g>
      </Svg>
      {/* r8e (k6r8d f21523-21526): the map tip labels leave before the globe picture starts to come in (t3D - 6) */}
      <TeX s={turnedNow ? H.xp : H.i} x={p0[0] + ex[0] * (U + 40)} y={p0[1] + ex[1] * (U + 40)} size={54} c={C.second} ax={0.5} o={o1 * fout(f, t3D - 22, 12)} halo />
      <TeX s={turnedNow ? H.yp : H.j} x={p0[0] + ny[0] * (U + 40)} y={p0[1] + ny[1] * (U + 40)} size={54} c={C.second} ax={0.5} o={o1 * fout(f, t3D - 22, 12)} halo />
      <TeX s={String.raw`\alpha`} x={p0[0] + 74} y={p0[1] - 70} size={50} c={C.second} o={fin(f, tX) * o1} />
      <SourceBelow text="Data: Natural Earth (coastline) · wind: HRRR (NOAA), 28 Sep 2022, 20 UTC" pic={MAPB} w={920} o={o1} name="s10 src" />
      <Svg o={o1}>
        <Keyword f={f} text="turned on purpose" at={[XC, 110]} appear={0} out={tP2 - 20} />
        <Lbl x={XC} y={210} t="along the shore · across it" c={C.key} s={T.floor} o={win(f, tAl, tP2 - 20)} />
        <Lbl x={XC} y={110} t="Part 2: Ian at Fort Myers Beach" c={C.muted} s={T.floor} o={fin(f, tP2)} />
      </Svg>
      <TeX s={eq[0]} x={XC} y={215} size={54} o={fin(f, tX) * o1} />
      <Recall f={f} tex={eq[1]} name="turned axes" part={1} x={XC} y={300} size={54} appear={tY} out={t3D - 6} />
      <TeX s={String.raw`\text{coast: bearing }329^\circ`} x={XC} y={455} size={50} o={fin(f, tBrg) * o1} />
      <TeX s={EQ_S13} x={XC} y={530} size={44} o={fin(f, tAlpha) * o1} />
      <TeX s={String.raw`\text{along}\approx9.4\ \text{m/s}`} x={XC} y={615} size={50} c={C.first} o={fin(f, tAlong) * o1} />
      <TeX s={String.raw`\text{across}\approx-31.5\ \text{m/s}`} x={XC} y={690} size={50} c={C.neg} o={fin(f, tAcross) * o1} />
      <Recall f={f} tex="" name="Fort Myers Beach" lab="found in Part 2:" x={XC} y={815} appear={tLand + 10} out={t3D - 6} />
      <Svg o={o1}><Lbl x={XC} y={752} t="minus: onto the land" c={C.neg} s={T.floor} o={fin(f, tLand)} /></Svg>
      {/* phase 2: in three dimensions, k̂ stays and î, ĵ turn about it */}
      {o2 > 0 ? <>
        <Globe cam={FMB_CAM} box={GFULL} coast={0.6} o={o2}
          over={(Gg) => <>
            {garrow(Gg, b0, xq, C.second, 9, 34)}
            {garrow(Gg, b0, yq, C.second, 9, 34)}
            {garrow(Gg, b0, kq, C.first, 9, 34)}
            {gdot(Gg, IAN.fmb[0], IAN.fmb[1], C.gold, 10)}
          </>} />
        {/* r8d (k6r8c f21523-21885, 190 hits each): x̂′ / ŷ′ written at the arrow tips sat on the sharp globe (3-glyph labels are not spot
            labels). The tips keep î / ĵ (spot glyphs) until the turn starts; the turned arrows are named in the column with gold links */}
        <TeX s={H.i} x={tipLab(xq)[0]} y={tipLab(xq)[1]} size={56} c={C.second} ax={0.5} o={o2t * fout(f, tTurn3, 8)} halo />
        <TeX s={H.j} x={tipLab(yq)[0]} y={tipLab(yq)[1]} size={56} c={C.second} ax={0.5} o={o2t * fout(f, tTurn3, 8)} halo />
        <TeX s={H.k} x={tipLab(kq)[0]} y={tipLab(kq)[1]} size={56} c={C.first} ax={0.5} o={o2t} halo />
        <GlobeFrame id="s10k" zoom={1} right={1} o={o2} />
        <SourceBelow text="Image: NASA Blue Marble Next Generation · Natural Earth" pic={{ x: 80, y: 40, w: 960, h: 772 }} w={960} o={o2t} name="s10 src g" />
        <Svg o={o2t}><Keyword f={f} text="in three dimensions" at={[XZ, 120]} appear={t3D + 18} /></Svg>
        <TeX s={eq[0]} x={XZ} y={250} size={50} o={o2t} />
        <TeX s={eq[1]} x={XZ} y={335} size={50} o={o2t} />
        <TeX s={String.raw`\hat{\mathbf k}\ \text{unchanged}`} x={XZ} y={430} size={54} c={C.first} o={o2t * fin(f, AT(k, 7, "as it is"))} />
        <Svg o={o2t}>
          <Lbl x={XZ} y={520} t="anticlockwise, from above" c={C.muted} s={T.floor} o={fin(f, AT(k, 7, "anticlockwise"))} />
          <SideCallout f={f} lines="$\hat{\mathbf x}'$ along the coast" at={[XZ, 630]} appear={tTurn3 + 62} out={tLegs - 22} target={G.pw(xq)} s={T.floor} c={C.second} bend={40} />
          {/* r8e (k6r8d f21882-21888: "91.5 km ?" on the x̂′ link): the callouts and links leave at tLegs - 22, before phase 3; phase 3 labels enter with o3t */}
          <SideCallout f={f} lines="$\hat{\mathbf y}'$ out to sea" at={[XZ, 720]} appear={tTurn3 + 70} out={tLegs - 22} target={G.pw(yq)} s={T.floor} c={C.second} bend={40} />
        </Svg>
      </> : null}
      {/* phase 3: Part 2's two legs, read off a km map: where do they come from? */}
      <GeoMap id="s10m3" B={B3} o={o3}>
        {(Pm) => <path d={linesPath(Pm, CO.lines)} fill="none" stroke={C.key} strokeOpacity={0.9} strokeWidth={2.6} />}
      </GeoMap>
      <Svg o={o3}>
        <line x1={A3[0]} y1={A3[1]} x2={Bp3[0]} y2={Bp3[1]} stroke={C.gold} strokeWidth={5} strokeDasharray="14 10" />
        <Arrow p={A3} q={Cn3} color={C.second} w={9} head={30} dash="14 10" />
        <Arrow p={Cn3} q={Bp3} color={C.second} w={9} head={30} dash="14 10" />
        <Place p={A3} t="Naples" o={o3t} dx={-24} dy={-30} a="end" />
        <Place p={Bp3} t="Englewood" o={o3t} dx={-24} dy={-30} a="end" />
        <g data-lc-maplabel="1">
          <Lbl x={A3[0] + 26} y={mix(A3[1], Cn3[1], 0.5)} t="91.5 km ?" c={C.second} s={T.floor} o={o3t} />
          <Lbl x={mix(Cn3[0], Bp3[0], 0.5)} y={Cn3[1] - 40} t="55 km ?" c={C.second} s={T.floor} a="middle" o={o3t} />
        </g>
        <Keyword f={f} text="Part 2: read off a km map" at={[XC, 110]} s={T.floor} appear={tLegs + 18} />
        <Lbl x={XC} y={210} t="91.5 km north · 55 km west" c={C.key} s={T.floor} o={fin(f, AT(k, 8, "ninety one"))} />
        <Keyword f={f} text="from latitude and longitude" at={[XC, 800]} s={T.floor} appear={tNow} />
      </Svg>
      <SourceBelow text="Data: Natural Earth 10 m coastline" pic={MAPB} w={920} o={o3t} name="s10 src 3" />
    </Scene>
  );
};

// ================================================================ s11 two coast points and the steps north and east in km (Part 3's rules)
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_coast_points");
  const tN = AT(k, 1, "Naples"), tV = AT(k, 2, "Englewood"), tWorld = SS(k, 3), tRules = SS(k, 7), tNorth = AT(k, 9, "about ninety one"), tWest = AT(k, 12, "about minus fifty five"),
    tSum = SS(k, 13), tBrg = SS(k, 14), tTan = AT(k, 14, "their ratio"), t31 = AT(k, 14, "the tangent of"), t329 = AT(k, 14, "a bearing of");
  const gone = tBrg - 10;
  const B = boxAt(26.52, -82.15, 1.35, MAPB.x, MAPB.y, MAPB.w, MAPB.h);
  const P = mapP(B);
  const A = P(CO.A[0], CO.A[1]), Bp = P(CO.B[0], CO.B[1]), Cn = P(CO.B[0], CO.A[1]);
  const gN = prog(f, tNorth, tNorth + 30), gW = prog(f, tWest, tWest + 30);
  const eqB = cutAt(EQ_S12, String.raw`,\qquad `);
  return (
    <Scene>
      <GeoMap id="s11m" B={B}>
        {(Pm) => <path d={linesPath(Pm, CO.lines)} fill="none" stroke={C.key} strokeOpacity={0.9} strokeWidth={2.6} />}
      </GeoMap>
      <Svg>
        <line x1={A[0]} y1={A[1]} x2={Bp[0]} y2={Bp[1]} stroke={C.gold} strokeWidth={5} strokeDasharray="14 10" opacity={fin(f, tV + 20)} />
        <Arrow p={A} q={[A[0], mix(A[1], Cn[1], gN)]} color={C.second} w={9} head={30} o={fin(f, tNorth)} />
        <Arrow p={Cn} q={[mix(Cn[0], Bp[0], gW), Cn[1]]} color={C.second} w={9} head={30} o={fin(f, tWest)} />
        <Place p={A} t="Naples" o={fin(f, tN)} dx={-24} dy={-30} a="end" />
        <Place p={Bp} t="Englewood" o={fin(f, tV)} dx={-24} dy={-30} a="end" />
        <g data-lc-maplabel="1">
          <Lbl x={A[0] - 24} y={A[1] + 20} t="26.10° N, 81.80° W" c={C.key} s={T.floor} a="end" o={fin(f, tN + 20)} />
          {/* r1fix (review 1 build 2, S10): Englewood's reading on two lines (one line ran left through the map's border and the frame edge) */}
          <Lbl x={Bp[0] - 24} y={Bp[1] + 20} t="26.92° N," c={C.key} s={T.floor} a="end" o={fin(f, tV + 20)} />
          <Lbl x={Bp[0] - 24} y={Bp[1] + 68} t="82.35° W" c={C.key} s={T.floor} a="end" o={fin(f, tV + 20)} />
        </g>
        <SideCallout f={f} lines="west leg: 55 km" at={[XC, 740]} appear={tWest + 20} out={gone} target={[mix(Cn[0], Bp[0], 0.5), Cn[1] - 8]} s={T.floor} bend={60} />
        <SideCallout f={f} lines="north leg: 91.5 km" at={[XC, 825]} appear={tNorth + 20} out={gone} target={[A[0] + 10, mix(A[1], Cn[1], 0.5)]} s={T.floor} bend={40} />
        {/* remake 2026-11-07: the angle of the coast from north at Naples (Part 2's β), on the last sentence */}
        <Arrow p={A} q={[A[0], A[1] - 200]} color={C.second} w={7} head={26} o={fin(f, tBrg)} />
        <AngleArc c={A} r={130} a0={90} a1={sang([Bp[0] - A[0], Bp[1] - A[1]])} col={C.gold} o={fin(f, t31)} />
      </Svg>
      <SourceBelow text="Data: Natural Earth 10 m coastline" pic={MAPB} w={920} name="s11 src" />
      <Svg>
        <Keyword f={f} text="two points on the coastline" at={[XC, 110]} appear={0} out={tRules - 20} />
        <Lbl x={XC} y={200} t="from a world coastline map" c={C.muted} s={T.floor} o={win(f, tWorld, tRules - 20)} />
      </Svg>
      {/* remake 2026-11-07 (R16): Part 3's rules, recalled at their use */}
      <Recall f={f} tex={EQ_S11} name="distances" part={3} x={XC} y={110} size={50} appear={tRules} out={gone} />
      <TeX s={String.raw`\beta`} x={A[0] - 30} y={A[1] - 150} size={50} c={C.gold} ax={1} o={fin(f, t31)} halo />
      <Svg><Keyword f={f} text="Part 2's coast bearing" at={[XC, 110]} appear={tBrg + 8} /></Svg>
      <TeX s={eqB[0]} x={XC} y={250} size={54} o={fin(f, tTan)} />
      <TeX s={String.raw`\beta\approx31^\circ`} x={XC} y={360} size={54} o={fin(f, t31)} />
      <TeX s={eqB[1]} x={XC} y={450} size={54} o={fin(f, t329)} glow={HL(f, AT(k, 14, "three hundred and twenty nine"))} />
      <Recall f={f} tex="" name="the coast's bearing" lab="found in Part 2:" x={XC} y={540} appear={t329 + 10} />
      <CalcStack f={f} x={1175} y={250} size={44} maxLines={4} o={fout(f, gone)} rows={[
        { lhs: String.raw`\Delta\varphi`, rhs: String.raw`=0.823^\circ`, at: AT(k, 4, "zero point eight two three") },
        { lhs: String.raw`\Delta\lambda`, rhs: String.raw`=-0.553^\circ`, at: AT(k, 5, "minus zero point") },
        { lhs: String.raw`1^\circ`, rhs: String.raw`=0.01745\ \text{rad}`, at: SS(k, 9), c: C.muted, glow: HL(f, AT(k, 9, "zero point zero one seven four five")) },
        { lhs: String.raw`\Delta\varphi`, rhs: String.raw`=0.823\times0.01745=0.01436`, at: AT(k, 9, "zero point zero one four three six") },
        { lhs: String.raw`\Delta y`, rhs: String.raw`=6371\times0.01436\approx91.5\ \text{km}`, at: tNorth },
        { lhs: String.raw`\varphi_{\text{mid}}`, rhs: String.raw`=\dfrac{26.10+26.92}{2}=26.51^\circ`, at: AT(k, 11, "middle latitude"), h: 80 },
        { lhs: "", rhs: String.raw`\approx26.5^\circ`, at: AT(k, 11, "twenty six and a half"), cont: true },
        { lhs: String.raw`\cos\varphi`, rhs: String.raw`=\cos26.5^\circ=0.895`, at: AT(k, 11, "zero point eight nine five"), glow: HL(f, AT(k, 11, "zero point eight nine five")) },
        { lhs: String.raw`\Delta\lambda`, rhs: String.raw`=-0.553\times0.01745`, at: AT(k, 12, "minus zero point zero zero") - 20 },
        { lhs: "", rhs: String.raw`=-0.00965\ \text{rad}`, at: AT(k, 12, "minus zero point zero zero"), cont: true },
        { lhs: String.raw`\Delta x`, rhs: String.raw`=6371\times0.895\times(-0.00965)`, at: AT(k, 12, "the step east") },
        { rhs: String.raw`\approx-55.0\ \text{km}`, at: tWest, cont: true },
      ]} />
    </Scene>
  );
};

// ================================================================ s15 the arrows turn by themselves (plane from above the North Pole)
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_arrows_turn");
  const tPl = SS(k, 2), tHr = AT(k, 3, "nine hundred"), tDeg = AT(k, 4, "about twelve degrees"), tSw = SS(k, 5), tTh = AT(k, 5, "just like theta hat"), tN = SS(k, 6), tTilt = SS(k, 7),
    tKeep = SS(k, 8), tD = SS(k, 9), tFol = SS(k, 10), tHow = SS(k, 11);
  const cam = CAM_TOP, G = globeG(cam);
  const fly = prog(f, tPl + 20, tDeg + 30);
  const lonP = BREST[1] + TU.swing * fly;
  const iTip = (lo: number) => { const e = [Math.cos(lo * D2R), 0, -Math.sin(lo * D2R)], b = ll(BREST[0], lo); return G.pw([b[0] + e[0] * 0.32, b[1] + e[1] * 0.32, b[2] + e[2] * 0.32]); };
  const c0 = G.pw([0, Math.sin(BREST[0] * D2R), 0]);
  return (
    <Scene>
      <Globe cam={cam} grat={0.15}
        over={(Gg) => <>
          <LatCircle G={Gg} lat={BREST[0]} c={C.local} w={3} o={0.6} dash="8 8" />
          <path d={llPath(Gg, Array.from({ length: 31 }, (_, i) => [BREST[0], BREST[1] + ((lonP - BREST[1]) * i) / 30] as [number, number]), 1.003)} fill="none" stroke={C.local} strokeWidth={7} opacity={fin(f, tPl)} />
          <Arrow p={Gg.p(BREST[0], BREST[1])} q={iTip(BREST[1])} color={C.second} w={8} head={30} />
          {fly > 0.02 ? <Arrow p={Gg.p(BREST[0], lonP)} q={iTip(lonP)} color={C.second} w={8} head={30} /> : null}
          <PlaneIcon p={Gg.p(BREST[0], lonP, 1.01)} a={sang([iTip(lonP)[0] - Gg.p(BREST[0], lonP)[0], iTip(lonP)[1] - Gg.p(BREST[0], lonP)[1]])} s={0.8} o={fin(f, tPl)} />
          <line x1={c0[0]} y1={c0[1]} x2={Gg.p(BREST[0], BREST[1])[0]} y2={Gg.p(BREST[0], BREST[1])[1]} stroke={C.gold} strokeWidth={3} strokeDasharray="8 6" opacity={fin(f, tSw)} />
          <line x1={c0[0]} y1={c0[1]} x2={Gg.p(BREST[0], lonP)[0]} y2={Gg.p(BREST[0], lonP)[1]} stroke={C.gold} strokeWidth={3} strokeDasharray="8 6" opacity={fin(f, tSw)} />
          <path d={poly(Array.from({ length: 21 }, (_, i) => { const lo = BREST[1] + ((lonP - BREST[1]) * i) / 20, b = Gg.p(BREST[0], lo); return [mix(c0[0], b[0], 0.35), mix(c0[1], b[1], 0.35)] as Pt; }))}
            fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tSw)} />
        </>} />
      <TeX s={H.i} x={iTip(BREST[1])[0] + 10} y={iTip(BREST[1])[1] + 34} size={50} c={C.second} o={1} halo />
      <GlobeFrame id="s15k" zoom={0} disc={discOf(cam)} />
      <SourceBelow text="Image: NASA Blue Marble Next Generation · Natural Earth" pic={GB} w={960} name="s15 src" />
      <Svg>
        <Keyword f={f} text="a second kind of turning" at={[XC, 110]} appear={0} out={tPl - 20} />
        <Lbl x={XC} y={110} t="plane: 250 m/s due east, 1 hour" c={C.key} s={T.floor} o={fin(f, tPl)} />
        <Lbl x={XC} y={445} t="≈ 12° round the axis" c={C.gold} s={T.key} o={fin(f, tSw)} />
        <Keyword f={f} text="following the air parcel" at={[XC, 800]} s={T.floor} appear={tFol} />
      </Svg>
      <CalcStack f={f} x={1420} y={220} size={50} rows={[
        { lhs: String.raw`250\ \text{m/s}\times3600\ \text{s}`, rhs: String.raw`=900\ \text{km}`, at: tHr },
        { lhs: String.raw`\dfrac{900\ \text{km}}{74\ \text{km per degree}}`, rhs: String.raw`\approx12^\circ`, at: tDeg, h: 110 },
      ]} />
      <Recall f={f} tex={String.raw`\Delta x=a\cos\varphi\,\Delta\lambda\approx74\ \text{km per }1^\circ`} name="distances" part={3} x={XC} y={700} size={46}
        appear={AT(k, 4, "As we found")} out={tN - 20} glow={HL(f, AT(k, 4, "seventy four"))} />
      {/* k6r8b fix (2026-11-09): the three column lines 45 px lower (were 500 / 500 / 590), clear of "≈ 12° round the axis" at y 445 (f27505, f27696) */}
      <TeX s={String.raw`\text{like }\hat{\boldsymbol\theta}\text{ round a circle}`} x={XC} y={545} size={50} c={C.key} o={win(f, tTh, tN - 20)} />
      <TeX s={String.raw`111\ \text{km north}\ \Rightarrow\ \hat{\mathbf k}\ \text{tilts }1^\circ`} x={XC} y={545} size={50} o={win(f, tTilt, tD - 20)} />
      <TeX s={String.raw`\hat{\mathbf i},\ \hat{\mathbf j},\ \hat{\mathbf k}\ \text{keep changing}`} x={XC} y={630} size={50} o={win(f, tKeep, tD - 20)} />
      <TeX s={String.raw`\dfrac{D\hat{\mathbf i}}{Dt},\quad \dfrac{D\hat{\mathbf j}}{Dt},\quad \dfrac{D\hat{\mathbf k}}{Dt}`} x={XC} y={620} size={60} o={fin(f, tD)} />
      {void tN}
    </Scene>
  );
};

// ================================================================ s16 Part 2's two turning rules (the recipe)
const CC: Pt = [520, 470], CR = 280;
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16_toolkit");
  const t2 = SS(k, 3), tCirc = SS(k, 4), tFirst = SS(k, 5), tWrote = SS(k, 6), tV = SS(k, 7), tCh = SS(k, 8), tR = SS(k, 9), tRec = SS(k, 10), tFind = SS(k, 11);
  const [, chipEnd] = chipSpan(k);
  const th = 53.13 + 15 * Math.sin(Math.PI * clamp((f - tFirst) / 120, 0, 1));
  const A = circleArrows(CC, CR, th, 170);
  const eq = cutAt(EQ_S16, String.raw`,\qquad `);
  return (
    <Scene>
      <Svg>
        <circle cx={CC[0]} cy={CC[1]} r={CR} fill="none" stroke={C.gold} strokeWidth={4} opacity={0.8} />
        <circle cx={CC[0]} cy={CC[1]} r={9} fill={C.local} />
        <line x1={CC[0]} y1={CC[1]} x2={A.p[0]} y2={A.p[1]} stroke={C.local} strokeWidth={4} opacity={fin(f, tV)} />
        <Arrow p={A.p} q={A.R} color={C.second} w={10} head={38} />
        <Arrow p={A.p} q={A.Th} color={C.second} w={10} head={38} />
        <Arrow p={add(A.R, A.Thdir, 0)} q={add(A.R, A.Thdir, 70)} color={C.gold} w={6} head={24} o={fin(f, tFirst)} />
        <Arrow p={A.Th} q={add(A.Th, A.Rdir, -70)} color={C.gold} w={6} head={24} o={fin(f, AT(k, 5, "theta hat changes"))} />
        <Arrow p={add(A.p, A.Thdir, -40)} q={add(A.p, A.Thdir, -150)} color={C.first} w={8} head={30} o={fin(f, tV)} />
        <ParcelDot p={A.p} />
      </Svg>
      <TeX s={H.r} x={A.R[0] + 20} y={A.R[1] + 20} size={56} c={C.second} halo />
      <TeX s={H.th} x={A.Th[0] - 20} y={A.Th[1] - 30} size={56} c={C.second} ax={1} halo />
      <TeX s="r" x={mix(CC[0], A.p[0], 0.5) + 20} y={mix(CC[1], A.p[1], 0.5) + 20} size={50} c={C.local} o={fin(f, tV)} />
      <TeX s="v" x={add(A.p, A.Thdir, -150)[0] - 30} y={add(A.p, A.Thdir, -150)[1]} size={52} c={C.first} ax={1} o={fin(f, tV)} />
      <Svg>
        <Keyword f={f} text="how fast do the arrows turn?" at={[XC, 110]} s={T.floor} appear={0} out={t2 - 20} />
        <Keyword f={f} text="two results from Part 2" at={[XC, 110]} appear={t2} out={tWrote - 20} />
        <SkipChip f={f} k={k} to={keepTime("s22_add_motions")} />
        <Keyword f={f} text="speed / radius" at={[XC, 800]} appear={tRec} c={C.gold} />
      </Svg>
      <TeX s={eq[0]} x={XC} y={130} size={58} o={fin(f, tWrote)} />
      <TeX s={eq[1]} x={XC + 330} y={130} size={58} o={fin(f, AT(k, 6, "d theta hat"))} />
      <TeX s={String.raw`\dfrac{d\theta}{dt}=\dfrac{v}{r}`} x={XC} y={300} size={58} o={fin(f, tV)} />
      <Svg><Lbl x={1370} y={300} t="derived in Part 2" c={C.gold} s={T.floor} o={fin(f, tWrote)} /></Svg>
      <TeX s={String.raw`\dfrac{d\hat{\boldsymbol\theta}}{dt}=-\hat{\mathbf r}\,\dfrac{v}{r}`} x={XC} y={450} size={58} o={fin(f, tCh)} />
      <TeX s={String.raw`\dfrac{d\hat{\mathbf r}}{dt}=\hat{\boldsymbol\theta}\,\dfrac{v}{r}`} x={XC + 380} y={450} size={58} o={fin(f, tR)} />
      <TeX s={String.raw`\text{circle}\ \to\ \hat{\mathbf r},\ \hat{\boldsymbol\theta}\ \to\ \dfrac{\text{speed}}{\text{radius}}`} x={XC} y={620} size={50} o={fin(f, tFind)} />
      {void [tCirc, chipEnd]}
    </Scene>
  );
};

// ================================================================ s17 the plan: three motions, what each one leaves alone
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_which_moves");
  const tOne = SS(k, 1), tUp = SS(k, 2), tF = SS(k, 3), tNone = SS(k, 4), tNo = SS(k, 5), tI = SS(k, 6), tAlone = SS(k, 7), tFour = SS(k, 8);
  const hl = (s: string) => s.split(String.raw`\varphi`).join(String.raw`\textcolor{#d8b23a}{\varphi}`).split(String.raw`\lambda`).join(String.raw`\textcolor{#d8b23a}{\lambda}`);
  const kS = String.raw`\hat{\mathbf k}=(\cos\varphi\cos\lambda,\ \cos\varphi\sin\lambda,\ \sin\varphi)`;
  const iS = String.raw`\hat{\mathbf i}=(-\sin\lambda,\ \cos\lambda,\ 0)`;
  const jS = String.raw`\hat{\mathbf j}=(-\sin\varphi\cos\lambda,\ -\sin\varphi\sin\lambda,\ \cos\varphi)`;
  const cell = (r: number, c: number, t: string, col: string, at: number) => { const p = gridCell(r, c); return <Lbl key={`${r}${c}`} x={p[0]} y={p[1]} t={t} c={col} s={T.floor} a="middle" o={fin(f, at)} />; };
  return (
    <Scene>
      <Svg>
        <GridBase />
        {[0, 1, 2].map((r) => cell(r, 2, "none", C.muted, tNone))}
        {cell(0, 1, "none", C.muted, tAlone)}
        {[[0, 0], [1, 0], [2, 0], [1, 1], [2, 1]].map(([r, c], q) => cell(r, c, "?", C.gold, tFour + 8 * q))}
      </Svg>
      {[H.i, H.j, H.k].map((s, r) => <TeX key={r} s={s} x={GRID.x0 - 40} y={GRID.y0 + r * GRID.ch + GRID.ch / 2} size={60} c={r === 2 ? C.first : C.second} ax={1} />)}
      <Svg>
        <Keyword f={f} text="east · north · up" at={[XC, 110]} appear={0} out={tF - 20} />
        <Lbl x={XC} y={200} t="one at a time, then add" c={C.muted} s={T.floor} o={win(f, tOne, tF - 20)} />
        <Lbl x={XC} y={560} t="going up: turns nothing" c={C.key} s={T.floor} o={fin(f, tNone)} />
        <Keyword f={f} text="four things to find" at={[XC, 800]} s={T.floor} appear={tFour} />
      </Svg>
      <TeX s={hl(iS)} x={XC} y={130} size={48} o={fin(f, tF)} />
      <TeX s={hl(jS.split(String.raw`\ -\sin`)[0])} x={XC} y={225} size={44} o={fin(f, tF + 8)} />
      <TeX s={hl(String.raw`-\sin` + jS.split(String.raw`\ -\sin`)[1])} x={XC + 120} y={285} size={44} o={fin(f, tF + 8)} />
      <TeX s={hl(kS)} x={XC} y={375} size={44} o={fin(f, tF + 16)} />
      <TeX s={String.raw`\text{only }\varphi,\ \lambda`} x={XC} y={465} size={50} c={C.gold} o={fin(f, tF + 40)} />
      <TeX s={String.raw`\text{going north leaves }\hat{\mathbf i}\text{ alone}`} x={XC} y={650} size={48} o={fin(f, tAlone)} />
      {void [tUp, tNo, tI]}
    </Scene>
  );
};

// ================================================================ s18 going east turns î towards −R̂ (top view; steps 1-3)
// build 2 (2026-11-10): the top view sits higher and smaller (was c (520, 380), r 300) so the companion inset fits below it; the inset
// shows the parcel's tripod sliding east along the real parallel, with R̂ at it and, on "d i hat by d lambda", the gold nudge of î
// towards −R̂ in three dimensions
const TV2: TopV = { c: [620, 330], r: 250 };
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_i_east_a");
  const tCirc = SS(k, 1), tRoles = SS(k, 2), tS1 = SS(k, 3), tRate = SS(k, 5), tS2 = SS(k, 6), tDi = SS(k, 7), tS3 = SS(k, 8), tEq = SS(k, 9), tWords = SS(k, 10);
  const lam = -20 + 15 * prog(f, tS1, tS1 + 60);
  const A = topArrows(TV2, lam, 160);
  const parts = pieces(EQ_S18, [String.raw`=\dfrac{d\hat{\mathbf i}}{d\lambda}`, String.raw`=-\hat{\mathbf R}`]);
  const Gi = globeG(CAM_INSET, INSET), bP = ll(BREST[0], lam), EP = enAt(BREST[0], lam), Rd = rhatAt(lam), LI = 0.2;
  return (
    <Scene>
      <InsetGlobe id="s18i" o={1} src over={(Gg) => <>
        <LatCircle G={Gg} lat={BREST[0]} c={C.gold} w={5} o={0.95} />
        {uarrow(Gg, bP, EP.n, LI, C.second, 0.65)}
        {uarrow(Gg, bP, EP.u, LI * 1.15, C.first)}
        {uarrow(Gg, bP, Rd, LI, C.second)}
        {uarrow(Gg, bP, EP.e, LI, C.second)}
        {garrow(Gg, add3(bP, EP.e, LI), add3(add3(bP, EP.e, LI), Rd, -LI * 0.45), C.gold, 6, 22, fin(f, tDi))}
        {gdot(Gg, BREST[0], lam, C.key, 8)}
      </>} />
      {/* r1fix (review 1 build 2, S3): tip labels 44 px past the heads; î's pushed away from its gold nudge (towards −R̂) so neither touches it */}
      <TeX s={H.k} x={gtip(Gi, bP, EP.u, LI * 1.15, 44)[0]} y={gtip(Gi, bP, EP.u, LI * 1.15, 44)[1]} size={48} c={C.first} ax={0.5} halo />
      <TeX s={H.R} x={gtip(Gi, bP, Rd, LI, 44)[0]} y={gtip(Gi, bP, Rd, LI, 44)[1]} size={48} c={C.second} ax={0.5} halo />
      {/* î's tip is the lowest point of the inset: past it (or pushed down by the nudge rule) the glyph sat on the source line (k6 r1fix);
          it goes RIGHT of the tip, level with it, 12 px clear of the gold nudge's head (which leaves the tip up-right, towards −R̂) */}
      <TeX s={H.i} x={Gi.pw(add3(bP, EP.e, LI))[0] + 58} y={Gi.pw(add3(bP, EP.e, LI))[1] - 2} size={48} c={C.second} ax={0.5} halo />
      <Svg>
        <TopViewBase V={TV2} axes={0.4} />
        <line x1={TV2.c[0]} y1={TV2.c[1]} x2={A.p[0]} y2={A.p[1]} stroke={C.local} strokeWidth={3} strokeDasharray="8 8" />
        <Arrow p={A.p} q={A.R} color={C.second} w={10} head={38} />
        <Arrow p={A.p} q={A.I} color={C.second} w={10} head={38} />
        <Arrow p={A.I} q={add(A.I, A.Rdir, -80)} color={C.gold} w={6} head={24} o={fin(f, tDi)} />
        <ParcelDot p={A.p} />
        <AngleArc c={TV2.c} r={90} a0={sang(tvP(TV2, 0, 1) as Pt) * 0 + -90} a1={-90 + lam} col={C.local} />
      </Svg>
      <TeX s={String.raw`a\cos\varphi`} x={TV2.c[0] + TV2.r * 0.78} y={TV2.c[1] - TV2.r * 0.78} size={52} c={C.gold} o={fin(f, tCirc)} />
      <TeX s={H.R} x={A.R[0] + 10} y={Math.min(A.R[1] + 30, 830)} size={54} c={C.second} halo />
      <TeX s={H.i} x={A.I[0] + 24} y={A.I[1] + 10} size={54} c={C.second} halo />
      <TeX s={String.raw`\lambda`} x={TV2.c[0] - 40} y={TV2.c[1] + 120} size={50} c={C.local} />
      <Svg>
        <Keyword f={f} text="first: going east, and î" at={[XC, 110]} appear={0} out={tRoles - 20} />
        <Lbl x={XC} y={290} t="step 1" c={C.muted} s={T.floor} o={fin(f, tS1)} />
        <Lbl x={XC} y={440} t="step 2" c={C.muted} s={T.floor} o={fin(f, tS2)} />
        <Lbl x={XC} y={590} t="step 3" c={C.muted} s={T.floor} o={fin(f, tS3)} />
        <Keyword f={f} text="east swings in towards the axis" at={[XC, 800]} s={T.floor} appear={tWords} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf R}\ \text{plays}\ \hat{\mathbf r},\quad \hat{\mathbf i}\ \text{plays}\ \hat{\boldsymbol\theta},\quad \lambda\ \text{plays}\ \theta`} x={XC} y={130} size={44} o={fin(f, tRoles)} />
      <TeX s={String.raw`\dfrac{D\lambda}{Dt}=\dfrac{u}{a\cos\varphi}`} x={XC + 160} y={290} size={56} o={fin(f, tRate)} />
      <TeX s={String.raw`\dfrac{d\hat{\mathbf i}}{d\lambda}=-\hat{\mathbf R}`} x={XC + 160} y={440} size={56} o={fin(f, tDi)} />
      <TeX s={parts[0]} x={XC + 160} y={585} size={50} o={fin(f, tEq)} />
      <TeX s={f < tEq + 30 ? parts[1] : parts[1] + parts[2]} x={XC + 160} y={705} size={50} o={fin(f, tEq + 15)} />
    </Scene>
  );
};

// ================================================================ s19 R̂ in the local arrows; Di/Dt; how fast at Brest (meridian slice; steps 4-6)
const SV2: SliceV = { c: [380, 640], r: 470 };
const S19: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19_i_east_b");
  const tSl = SS(k, 2), tK = SS(k, 3), tJ = SS(k, 4), tMul = SS(k, 5), tSub = SS(k, 6), tZ = SS(k, 7), tOne = SS(k, 8), tR = SS(k, 9), tWords = SS(k, 10), tS6 = SS(k, 11),
    tEq = SS(k, 12), tTip = SS(k, 13), tHow = SS(k, 14), tTen = SS(k, 15), t24 = SS(k, 16), t12 = SS(k, 17);
  const phi = D.brest.ll[0], U = 170;
  const A = sliceArrows(SV2, phi, U);
  const cp = Math.cos(phi * D2R), sp = Math.sin(phi * D2R);
  const legK = add(A.p, A.Kdir, U * cp), legR = add(legK, A.Jdir, -U * sp);
  const mid = fout(f, tS6 - 20);
  return (
    <Scene>
      <Svg>
        <SliceBase V={SV2} axes={0.5} quarter />
        <line x1={SV2.c[0]} y1={SV2.c[1]} x2={A.p[0]} y2={A.p[1]} stroke={C.local} strokeWidth={3} strokeDasharray="8 8" />
        <Arrow p={A.p} q={A.K} color={C.first} w={10} head={38} />
        <Arrow p={A.p} q={A.J} color={C.second} w={10} head={38} />
        <Arrow p={A.p} q={[A.p[0] + U, A.p[1]]} color={C.second} w={8} head={30} dash="14 10" o={fin(f, tR)} />
        <g opacity={fin(f, tR + 20)}>
          <Arrow p={A.p} q={legK} color={C.first} w={6} head={22} dash="10 8" />
          <Arrow p={legK} q={legR} color={C.second} w={6} head={22} dash="10 8" />
        </g>
        <ParcelDot p={A.p} />
        <CurvedLink f={f} from={[XC - 14, 700]} to={[A.p[0] + U * 0.6, A.p[1] + 14]} start={tR + 30} end={tS6 - 20} bend={-60} />
      </Svg>
      <TeX s={H.k} x={A.K[0] + 20} y={A.K[1] - 20} size={54} c={C.first} halo />
      <TeX s={H.j} x={A.J[0] - 20} y={A.J[1] - 26} size={54} c={C.second} ax={1} halo />
      <TeX s={H.R} x={A.p[0] + U + 20} y={A.p[1] + 10} size={52} c={C.second} o={fin(f, tR)} halo />
      <TeX s={String.raw`-\sin\varphi\,\hat{\mathbf j}`} x={legR[0] + 30} y={mix(legK[1], legR[1], 0.5) - 40} size={44} c={C.second} o={fin(f, tR + 20)} halo />
      <TeX s={H.z} x={SV2.c[0] + 24} y={SV2.c[1] - SV2.r * 0.5} size={48} c={C.second} o={0.7} />
      <Svg>
        <Keyword f={f} text="in her own arrows" at={[XC, 110]} appear={0} out={tK - 20} />
        <Lbl x={XC} y={290} t="step 4: $\times\cos\varphi,\ \times\sin\varphi$" c={C.muted} s={T.floor} o={win(f, tMul, tS6 - 20)} />
        <Lbl x={XC} y={770} t="partly up, partly south" c={C.key} s={T.floor} o={win(f, tWords, tS6 - 20)} />
        <Lbl x={XC} y={262} t="step 6" c={C.muted} s={T.floor} o={fin(f, tS6)} />
        <Keyword f={f} text="tips north, and down" at={[XC, 470]} s={T.floor} appear={tTip} />
        <Lbl x={XC} y={538} t="u = 10 m/s at Brest" c={C.key} s={T.floor} o={fin(f, tTen)} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf k}=\cos\varphi\,\hat{\mathbf R}+\sin\varphi\,\hat{\mathbf z}`} x={XC} y={130} size={50} o={win(f, tK, tS6 - 20)} />
      <TeX s={String.raw`\hat{\mathbf j}=-\sin\varphi\,\hat{\mathbf R}+\cos\varphi\,\hat{\mathbf z}`} x={XC} y={200} size={50} o={win(f, tJ, tS6 - 20)} />
      <TeX s={String.raw`\cos\varphi\,\hat{\mathbf k}-\sin\varphi\,\hat{\mathbf j}`} x={XC} y={370} size={48} o={win(f, tSub, tS6 - 20) * mid} />
      <TeX s={String.raw`=(\cos^2\varphi+\sin^2\varphi)\,\hat{\mathbf R}`} x={XC + 40} y={440} size={48} o={win(f, tSub + 20, tS6 - 20)} />
      <TeX s={f < tZ ? String.raw`+(\cos\varphi\sin\varphi-\sin\varphi\cos\varphi)\,\hat{\mathbf z}` : String.raw`+\cancel{(\cos\varphi\sin\varphi-\sin\varphi\cos\varphi)\,\hat{\mathbf z}}`} x={XC + 40} y={515} size={46} o={win(f, tSub + 40, tS6 - 20)} />
      <TeX s={String.raw`\cos^2\varphi+\sin^2\varphi=1`} x={XC + 40} y={595} size={46} c={C.gold} o={win(f, tOne, tS6 - 20)} />
      <TeX s={String.raw`\hat{\mathbf R}=\cos\varphi\,\hat{\mathbf k}-\sin\varphi\,\hat{\mathbf j}`} x={XC} y={690} size={54} c={C.key} o={win(f, tR, tS6 - 20)} />
      <TeX s={EQ_S19} x={XC} y={370} size={50} o={fin(f, tEq)} />
      <CalcStack f={f} x={XC} y={578} size={44} maxLines={3} rows={[   /* labels on the left; the rate and its value stay together (house rule 2026-11-07); k6r8b SSR fix (2026-11-09): y 590 -> 578 so the three lines end at y 877.5 (were 889.5, into the caption band), the "u = 10 m/s" label above it 560 -> 538 */
        { lhs: String.raw`\text{rate}`, rhs: String.raw`\dfrac{u}{a\cos\varphi}=\dfrac{10}{4\,230\,000}`, at: AT(k, 15, "divide ten"), h: 112, glow: HL(f, AT(k, 15, "four million")) },
        { lhs: "", rhs: String.raw`\approx2.36\times10^{-6}\approx2.4\times10^{-6}\ \text{rad/s}`, at: t24, cont: true },
        { lhs: String.raw`\text{1 day}`, rhs: String.raw`2.36\times10^{-6}\times86\,400\approx0.204\ \text{rad}`, at: t12 },
        { lhs: String.raw`\text{turn}`, rhs: String.raw`0.204\times57.3^\circ\approx11.7^\circ\approx12^\circ`, at: t12 + 40, c: C.gold, glow: HL(f, AT(k, 17, "twelve degrees")) },
      ]} />
      {void [tSl, tHow, svP, tvP, gdot, Tripod, GB, LEN, SE, XZ, Place, fout]}
    </Scene>
  );
};

export const SCENES_B: Record<string, React.FC> = {
  s10_coast_frame: S10, s11_coast_points: S11, s15_arrows_turn: S15, s16_toolkit: S16,
  s17_which_moves: S17, s18_i_east_a: S18, s19_i_east_b: S19,
};
