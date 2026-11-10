// ch00_coordinates_frames scenes s00-s09: the title, the hook, the Part 3 recap, the local east-north-up frame at Brest, the
// three arrows derived as numbers (up from the position arrow, east from the top view, north from the meridian slice), the
// checks, other stations (Trappes, Singapore) and Khulna with Amphan. Globes: the house GB frame (whole, unzoomed) or the
// zoom-reveal (full-bleed, K1 fades and the darkened right panel, text from x 1190). Numbers from data/fr.json only.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Pt, RightTick } from "../house/kit/draw";
import { SeriesTitle } from "./kit_fr/SeriesTitle";
import { GlobeFrame } from "../house/kit/frame";   // r8d: SourceBelow comes gated from fr_lib
import { AnimatedWindArrow } from "../house/kit/wind";
import { CurvedLink } from "../house/kit/extras";
import { GlobeCam, LatCircle, globePath, llPath } from "./kit_fr/globe";
import { V3 } from "./kit_fr/cam";
import {
  AT, ArcHead, Arrow, BREST, Recall, BROWN, CalcStack, D, D2R, GB, GFULL, GeoMap, Globe, H, KHULNA, Keyword, K, LEN, Lbl, SE, SING, SS, Scene, SideCallout, SkipChip,
  Svg, TRAPPES, TeX, Tripod, TripodTips, XC, add, arcD, boxAt, clamp, discOf, e2g, enAt, facing, fin, fout, garrow, gdot, globeG, gseg, keepTime, linesPath, ll, mix,
  pieces, plab, poly, prog, sang, svNorth, svP, svUp, tvDir, tvEast, tvP, win, TopV, SliceV, GeoImg, IMGS, chipSpan, SpeedBar,
  HL,
  SourceBelow, useTextGate,
  InsetGlobe, CAM_INSET, INSET, uarrow, gtip, turned3, GArc, rhatAt, meridianPath,
} from "./fr_lib";
import { AngleArc, SliceBase, TopViewBase, sliceArrows, topArrows, turned } from "./fr_dia";
import { EQ_S03, EQ_S04, EQ_S05, EQ_S06, EQ_S08 } from "./fr_eq";

const BR = D.brest, TR = D.trappes, SG = D.sing, KH = D.khulna, CO = D.coast, IAN = D.ian;
// ---------------------------------------------------------------- numbers on screen = the data (the render fails otherwise)
const CHECK_A: [string, number, number, number][] = [
  ["cos phi", BR.cs[0], 0.664, 5e-4], ["sin phi", BR.cs[1], 0.748, 5e-4], ["cos lam", BR.cs[2], 0.997, 5e-4], ["sin lam", BR.cs[3], -0.078, 5e-4],
  ["k1", BR.k[0], 0.662, 5e-4], ["k2", BR.k[1], -0.052, 5e-4], ["k3", BR.k[2], 0.748, 5e-4], ["i1", BR.i[0], 0.078, 5e-4], ["i2", BR.i[1], 0.997, 5e-4],
  ["j1", BR.j[0], -0.745, 5e-4], ["j2", BR.j[1], 0.059, 5e-4], ["j3", BR.j[2], 0.664, 5e-4], ["dBT", TR.dkm, 480, 0.5], ["sig", TR.sig, 0.075, 5e-4],
  ["degBT", TR.deg, 4.3, 0.05], ["kS1", SG.k[0], -0.239, 5e-4], ["kS2", SG.k[1], 0.971, 5e-4], ["kS3", SG.k[2], 0.024, 5e-4], ["dotBS", SG.dot, -0.191, 5e-4],
  ["degBS", SG.deg, 101, 0.05], ["kK1", KH.k[0], 0.006, 5e-4], ["kK2", KH.k[1], 0.922, 5e-4], ["kK3", KH.k[2], 0.388, 5e-4], ["degBK", KH.deg, 75.8, 0.05],
  ["iK1", KH.i[0], -1.0, 5e-4], ["iK2", KH.i[1], 0.007, 5e-4], ["degii", KH.iideg, 94, 0.5], ["amphan", KH.amphan.closest_km, 79, 0.5],
  ["a", D.consts.a / 1e3, 6371, 1e-9], ["brg", CO.brg, 329, 0.5], ["along", IAN.along, 9.4, 0.05], ["across", IAN.across, -31.54, 0.05], ["sp", IAN.sp, 33, 0.5],
];
CHECK_A.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
// the kit's globe frame (enAt, Y-up) = fluidpy enu_basis (Earth axes) at Brest, mapped by e2g (parity row)
{
  const g = (v: number[]) => e2g(v);
  const lb = ll(BREST[0], BREST[1]), kb = g(BR.k);
  if (Math.hypot(lb[0] - kb[0], lb[1] - kb[1], lb[2] - kb[2]) > 1e-5) throw new Error("CHECK globe up ≠ enu_basis k at Brest");
}
const SRC_G = "Image: NASA Blue Marble Next Generation · Natural Earth";
const GSrc: React.FC<{ o?: number }> = ({ o = 1 }) => <SourceBelow text={SRC_G} pic={GB} w={960} o={o} name="globe src" />;
const XZ = 1190;                     // text column on the darkened panel of a zoomed globe
const LON_FACE = BREST[1] + 180;     // the kept half of the half-Earth (east of Brest's meridian), face = Brest's meridian plane
const CAM_FACE: GlobeCam = { lat: 8, lon: BREST[1] - 75, dist: 3.4 };
// build 2 (2026-11-10, user): s05 no longer sits over the pole for its 3-D half (k̂ at Brest was a dot from there). The camera sweeps
// from the side view to an OBLIQUE view (lat 52, 55° east of Brest: the parallel a near-circle, the axis in view, k̂ at Brest 62 % of its
// length) and holds there while the parallel, λ and the slide east are told; only on "the picture from Part 1" does it rise over the
// pole (TOP2, farther and higher in the box) and flatten into the top-view diagram, with the oblique inset (fr_lib InsetGlobe) taking over.
const SIDE: GlobeCam = { lat: 22, lon: BREST[1], dist: 3.4, pp: [480, 395] };
const OBL: GlobeCam = { lat: 52, lon: BREST[1] + 55, dist: 3.2, pp: [480, 395] };
const TOP2: GlobeCam = { lat: 89.5, lon: BREST[1], dist: 4.0, pp: [480, 328] };
const ZOOM_BREST: GlobeCam = { lat: BREST[0], lon: BREST[1], dist: 2.4, pp: [600, 470] };
const UN: GlobeCam = { lat: 44, lon: 6, dist: 4.3, pp: [520, 420] };
const zoomOf = (cam: GlobeCam) => clamp((4.3 - cam.dist) / (4.3 - 2.4), 0, 1);
/** the top-view diagram matched to the 3-D camera over the pole: centre = the projected centre of Brest's parallel */
const topFrom3D = (): TopV => {
  const G = globeG(TOP2);
  const c = G.pw([0, Math.sin(BREST[0] * D2R), 0]), b = G.p(BREST[0], BREST[1]);
  return { c, r: Math.hypot(b[0] - c[0], b[1] - c[1]) };
};
const TV: TopV = topFrom3D();
const sliceFrom3D = (): SliceV => {
  const G = globeG(CAM_FACE), c = G.pw([0, 0, 0]), n = G.pw([0, 1, 0]);
  return { c, r: Math.hypot(n[0] - c[0], n[1] - c[1]) };
};
const SV: SliceV = sliceFrom3D();

// ================================================================ s00 title (remake 2026-11-07: series title layout, no "made easy" (R1);
// Part A: four stations with their own tripods on a turning globe; Part B (on "meteorology"): from above the North Pole, a parcel moving east
// along Brest's parallel, its east arrow swinging round with it (faint copies left behind) — the movie's second idea, frames that turn)
const TB = { x: 1150, y: 150, w: 690, h: 480 };
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  const tMet = AT(k, 0, "they're used"), tCo = AT(k, 0, "coordinates");   // Part B on "they're used" (opening rule 2026-11-07)
  const oA = fout(f, tMet, 12), oB = fin(f, tMet, 12);
  const gT = useTextGate();
  const cam = globePath([{ f: 0, lat: 30, lon: 50, dist: 3.0 }, { f: 400, lat: 32, lon: 44, dist: 3.0 }], f);
  const lonP = BREST[1] + 26 * prog(f, 16, tMet);
  const lonB = BREST[1] + 70 * prog(f, tMet + 10, LEN(k) - 10);
  const camB: GlobeCam = { lat: 89.5, lon: BREST[1] + 20, dist: 3.0 };
  const iTip = (G: ReturnType<typeof globeG>, lo: number, L = 0.3): Pt => { const e = [Math.cos(lo * D2R), 0, -Math.sin(lo * D2R)], b = ll(BREST[0], lo);
    return G.pw([b[0] + e[0] * L, b[1] + e[1] * L, b[2] + e[2] * L]); };
  const ghosts = [0, 1, 2, 3].map((q) => BREST[1] + 70 * prog(f - 24 * (q + 1), tMet + 10, LEN(k) - 10)).filter((lo) => lo > BREST[1] + 1);
  return (
    <Scene fadeIn={false}>
      {/* r8e (k6r8d s01 f362): the title is house RiseText (outside fr_lib's wrappers), so it takes the scene gate's exit here */}
      <Svg o={gT}>
        <SeriesTitle f={f} concept="Coordinates" part="Part 4 · Turning frames" sub={["local axes and how they turn"]} pulseAt={tCo} />
      </Svg>
      <Globe cam={cam} box={TB} o={oA * fin(f, 4, 10)} grat={0.35} coast={0.4}
        over={(G) => <>
          <LatCircle G={G} lat={BREST[0]} c={C.local} w={3} o={0.7} dash="8 8" />
          {[BREST, TRAPPES, SING, KHULNA].map((p, i) => <Tripod key={i} G={G} la={p[0]} lo={p[1]} L={0.2} w={6} head={20} />)}
          <Tripod G={G} la={BREST[0]} lo={lonP} L={0.2} w={6} head={20} o={fin(f, 16, 10)} />
          {gdot(G, BREST[0], lonP, C.key, 9, fin(f, 16, 10))}
        </>} />
      <Globe cam={camB} box={TB} o={oB} grat={0.3} coast={0.4}
        over={(G) => <>
          <LatCircle G={G} lat={BREST[0]} c={C.local} w={3} o={0.7} dash="8 8" />
          <path d={llPath(G, Array.from({ length: 31 }, (_, i) => [BREST[0], BREST[1] + ((lonB - BREST[1]) * i) / 30] as [number, number]), 1.003)} fill="none" stroke={C.local} strokeWidth={6} />
          {ghosts.map((lo, q) => <Arrow key={q} p={G.p(BREST[0], lo)} q={iTip(G, lo)} color={C.second} w={6} head={22} o={0.5 - 0.1 * q} />)}
          <Arrow p={G.p(BREST[0], BREST[1])} q={iTip(G, BREST[1])} color={C.second} w={7} head={24} o={0.6} />
          <Arrow p={G.p(BREST[0], lonB)} q={iTip(G, lonB)} color={C.second} w={8} head={28} />
          {gdot(G, BREST[0], lonB, C.key, 10)}
        </>} />
      <SourceBelow text="Image: NASA Blue Marble Next Generation" pic={TB} w={690} name="s00 src a" />
    </Scene>
  );
};

// ================================================================ s01 hook
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  const tKh = AT(k, 1, "Khulna"), tMove = AT(k, 2, "as the air moves"), t4 = SS(k, 4), tLF = AT(k, 4, "local frames"), tPlace = AT(k, 4, "differ from place to place"), tBy = AT(k, 4, "by themselves");
  const cam = globePath([{ f: 0, lat: 36, lon: 40, dist: 3.4 }, { f: LEN(k) + 10, lat: 36, lon: 36, dist: 3.4 }], f);
  const lonP = BREST[1] + 30 * prog(f, tMove, tMove + 150);
  const G = globeG(cam);
  return (
    <Scene>
      <Globe cam={cam} grat={0.25}
        over={(Gg) => <>
          <LatCircle G={Gg} lat={BREST[0]} c={C.local} w={3} o={0.6 * fin(f, tMove)} dash="8 8" />
          <Tripod G={Gg} la={BREST[0]} lo={BREST[1]} L={0.2} />
          <Tripod G={Gg} la={KHULNA[0]} lo={KHULNA[1]} L={0.2} o={fin(f, tKh)} />
          <Tripod G={Gg} la={BREST[0]} lo={lonP} L={0.2} o={fin(f, tMove)} />
          {plab(Gg, BREST[0], BREST[1], "Brest", 1, -22, 30, "end")}
          {plab(Gg, KHULNA[0], KHULNA[1], "Khulna", fin(f, tKh), 18, 40)}
        </>} />
      <TripodTips G={G} la={BREST[0]} lo={BREST[1]} L={0.2} size={48} o={fout(f, tMove - 20)} />
      <GlobeFrame id="s01k" zoom={0} disc={discOf(cam)} />
      <GSrc />
      <Svg>
        <Keyword f={f} text="east · north · up" at={[XC, 150]} appear={0} out={t4 - 18} />
        <Keyword f={f} text="local frames" at={[XC, 380]} appear={tLF} />
        <Keyword f={f} text="different at every place" at={[XC, 500]} appear={tPlace} />
        <Keyword f={f} text="turning as you move" at={[XC, 620]} appear={tBy} />
        {/* minis (remake 2026-11-07): two tripods pointing different ways (no coast: the coast frame is Part 2's); a tripod sliding along a parallel */}
        <g opacity={fin(f, tPlace)}>
          {[[1700, 540, 0], [1790, 520, 38]].map(([x, y, a]) => <g key={x}>
            <Arrow p={[x, y]} q={[x + 40 * Math.cos(a * D2R), y + 40 * Math.sin(a * D2R)]} color={C.second} w={5} head={14} />
            <Arrow p={[x, y]} q={[x + 40 * Math.sin(a * D2R), y - 40 * Math.cos(a * D2R)]} color={C.first} w={5} head={14} /></g>)}
        </g>
        <g opacity={fin(f, tBy)}>
          <path d="M 1660 660 Q 1740 610 1820 660" fill="none" stroke={C.gold} strokeWidth={4} />
          {[0, 1].map((q) => { const x = 1690 + q * 100, y = q ? 655 : 645, a = q ? -25 : 25;
            return <g key={q}><Arrow p={[x, y]} q={[x + 44 * Math.cos(a * D2R), y + 44 * Math.sin(a * D2R)]} color={C.second} w={5} head={14} />
              <Arrow p={[x, y]} q={[x + 40 * Math.sin(a * D2R), y - 40 * Math.cos(a * D2R)]} color={C.first} w={5} head={14} /></g>; })}
        </g>
      </Svg>
    </Scene>
  );
};

// ================================================================ s03 the local east-north-up frame (zoom-reveal at Brest)
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_enu");
  const tBr = AT(k, 0, "Brest"), tBri = AT(k, 1, "Brittany"), tAtl = AT(k, 1, "Atlantic Ocean"), tI = AT(k, 4, "I hat"), tJ = AT(k, 4, "j hat"), tK = AT(k, 4, "k hat"),
    tFr = SS(k, 5), tU = SS(k, 6), tV = AT(k, 7, "bold v"), tEq = SS(k, 8), tParts = SS(k, 9), tX = SS(k, 10), tGr = AT(k, 12, "Gravity"), tFromN = AT(k, 12, "measured from north"), tRep = SS(k, 13);
  const cam = ZOOM_BREST, L = 0.15;
  const G = globeG(cam, GFULL);
  const gr = add(G.p(BREST[0], BREST[1]), [0, 0], 0);
  const up = ll(BREST[0], BREST[1], 1 - L * 0.9);
  return (
    <Scene>
      <Globe cam={cam} box={GFULL} coast={0.6}
        over={(Gg) => <>
          {(() => { const t = { i: fin(f, tI, 16), j: fin(f, tJ, 16), k: fin(f, tK, 16) };
            const tp = Gg; const e = tp; void e;
            const b = ll(BREST[0], BREST[1]);
            const en = { e: [0, 0, 0] as V3 }; void en;
            const T3 = (() => { const q = (v: V3, s: number): V3 => [b[0] + v[0] * s, b[1] + v[1] * s, b[2] + v[2] * s]; return q; })();
            const E = (() => { const la = BREST[0] * D2R, lo = BREST[1] * D2R; return { e: [Math.cos(lo), 0, -Math.sin(lo)] as V3, n: [-Math.sin(la) * Math.sin(lo), Math.cos(la), -Math.sin(la) * Math.cos(lo)] as V3, u: b }; })();
            return <>
              {garrow(Gg, b, T3(E.e, L * t.i), C.second, 9, 34, t.i)}
              {garrow(Gg, b, T3(E.n, L * t.j), C.second, 9, 34, t.j)}
              {garrow(Gg, b, T3(E.u, L * 1.15 * t.k), C.first, 9, 34, t.k)}
              {garrow(Gg, b, up, BROWN, 9, 34, fin(f, tGr))}
            </>; })()}
          {gdot(Gg, BREST[0], BREST[1], C.gold, 10, fin(f, tBr))}
          {plab(Gg, BREST[0], BREST[1], "Brest", fin(f, tBr), -24, 0, "end")}
          {plab(Gg, BREST[0], BREST[1], "Brittany", fin(f, tBri), 70, 120)}
          {plab(Gg, BREST[0], BREST[1], "Atlantic Ocean", fin(f, tAtl), -60, 170, "end", true)}
        </>} />
      <TripodTips G={G} la={BREST[0]} lo={BREST[1]} L={L} size={58} o={fin(f, tK)} />
      <GlobeFrame id="s03k" zoom={1} right={1} />
      <SourceBelow text={SRC_G} pic={{ x: 80, y: 40, w: 960, h: 772 }} w={960} name="s03 src" />
      <Svg>
        <Keyword f={f} text="a weather station at Brest" at={[XZ, 120]} s={T.floor} appear={0} out={tFr - 20} />
        <Keyword f={f} text="local east · north · up" at={[XZ, 120]} appear={tFr} />
        <Lbl x={XZ} y={240} t="Part 1:" c={C.muted} s={T.floor} o={win(f, tU, tEq - 20)} />
        <Lbl x={XZ} y={648} t="right-handed" c={C.key} s={T.floor} o={fin(f, AT(k, 10, "right-handed"))} />
        <Lbl x={XZ} y={770} t="wind measured from north" c={C.key} s={T.floor} o={fin(f, tFromN)} />
        <g opacity={gr ? 0 : 0} />
      </Svg>
      <TeX s={String.raw`\text{wind arrow }\mathbf u\ \to\ \mathbf v`} x={XZ + 170} y={240} size={54} o={win(f, tV, tEq - 20)} />
      <TeX s={EQ_S03} x={XZ} y={360} size={68} o={fin(f, tEq)} />
      <TeX s={String.raw`\text{east}\qquad\text{north}\qquad\text{up}`} x={XZ + 40} y={450} size={44} c={C.gold} o={fin(f, tParts)} />
      <TeX s={String.raw`\hat{\mathbf i}\times\hat{\mathbf j}=\hat{\mathbf k}`} x={XZ} y={575} size={60} o={fin(f, tX)} />
      <TeX s={String.raw`\text{gravity along }-\hat{\mathbf k}`} x={XZ} y={708} size={44} c={BROWN} o={fin(f, tGr)} />
      <Svg><Keyword f={f} text="every weather report" at={[XZ, 840]} s={T.floor} appear={tRep} /></Svg>
    </Scene>
  );
};

// ================================================================ s04 up = the position arrow (half-Earth face through Brest's meridian)
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = K("s04_k_up");
  const tAx = AT(k, 3, "x hat points"), tAy = AT(k, 3, "y hat to"), tAz = AT(k, 3, "z hat to"), tUp = SS(k, 4), tOut = SS(k, 5), tPos = SS(k, 6), tK = SS(k, 7),
    tPhi = AT(k, 7, "where phi"), tNum = SS(k, 8), [, chipEnd] = chipSpan(k);
  const G = globeG(CAM_FACE);
  const rb = ll(BREST[0], BREST[1]), kTip = ll(BREST[0], BREST[1], 1.38);
  const ax = (v: number[], L = 1.3): V3 => { const g = e2g(v); return [g[0] * L, g[1] * L, g[2] * L]; };
  const eq = pieces(EQ_S04, [String.raw`\ \cos\varphi\sin`]);
  const kp = G.pw(kTip);
  return (
    <Scene>
      <Globe cam={CAM_FACE} mesh={{ half: LON_FACE, slide: 1 }}
        over={(Gg) => <>
          {gseg(Gg, [0, -1.15, 0], [0, 1.25, 0], C.local, 3, 1, "10 8")}
          {garrow(Gg, [0, 0, 0], ax([1, 0, 0]), C.second, 7, 26, 0.85 * fin(f, tAx))}
          {garrow(Gg, [0, 0, 0], ax([0, 1, 0]), C.second, 7, 26, 0.85 * fin(f, tAy))}
          {garrow(Gg, [0, 0, 0], ax([0, 0, 1]), C.second, 7, 26, 0.85 * fin(f, tAz))}
          {garrow(Gg, [0, 0, 0], rb, C.first, 8, 30, fin(f, tPos, 18))}
          {garrow(Gg, rb, kTip, C.first, 10, 38, fin(f, tOut))}
          {gdot(Gg, BREST[0], BREST[1], C.gold, 10)}
          <circle cx={Gg.pw([0, 0, 0])[0]} cy={Gg.pw([0, 0, 0])[1]} r={9} fill={C.local} />
        </>} />
      <TeX s={H.k} x={kp[0] + 30} y={kp[1] - 10} size={58} c={C.first} o={fin(f, tOut)} halo />
      <TeX s={H.x} x={G.pw(ax([1, 0, 0], 1.45))[0]} y={G.pw(ax([1, 0, 0], 1.45))[1]} size={50} c={C.second} ax={0.5} o={0.85 * fin(f, tAx) * fout(f, AT(k, 9, "forty eight") - 12)} halo />
      <TeX s={H.y} x={G.pw(ax([0, 1, 0], 1.45))[0]} y={G.pw(ax([0, 1, 0], 1.45))[1]} size={50} c={C.second} ax={0.5} o={0.85 * fin(f, tAy) * fout(f, AT(k, 9, "forty eight") - 12)} halo />
      <TeX s={H.z} x={G.pw(ax([0, 0, 1], 1.4))[0] + 34} y={G.pw(ax([0, 0, 1], 1.4))[1]} size={50} c={C.second} ax={0.5} o={0.85 * fin(f, tAz) * fout(f, AT(k, 9, "forty eight") - 12)} halo />
      <GlobeFrame id="s04k" zoom={0} disc={discOf(CAM_FACE)} />
      <GSrc />
      <Svg>
        <Keyword f={f} text="three arrows as numbers" at={[XC, 110]} appear={0} out={tAx - 20} />
        <Keyword f={f} text="up first: the easiest" at={[XC, 110]} appear={tUp} out={tK - 20} />
        <SideCallout f={f} lines="same direction" at={[XC, 230]} appear={tPos + 30} out={tK - 20} target={[kp[0] + 4, kp[1] + 50]} c={C.gold} s={T.floor} />
        <SkipChip f={f} k={k} to={keepTime("s07_enu_checks")} />
      </Svg>
      {/* remake 2026-11-07 (R16): Part 3's Earth axes and position arrow recalled at their point of use (the cut s02 carried them) */}
      <TeX s={String.raw`\hat{\mathbf x}\to(0^\circ,\ 0^\circ),\quad \hat{\mathbf y}\to(0^\circ,\ 90^\circ\text{E})`} x={XC} y={120} size={50} o={win(f, tAx, tUp - 20)} />
      <Recall f={f} tex={String.raw`\hat{\mathbf z}\to\text{North Pole}`} name="Earth axes" part={3} x={XC} y={195} size={50} appear={tAz} out={tUp - 20} />
      <TeX s={eq[0]} x={XC} y={120} size={54} o={fin(f, tK)} />
      <TeX s={eq[1]} x={XC + 120} y={190} size={54} o={fin(f, tK)} />
      <Recall f={f} tex="" name="position vector" part={3} x={XC} y={258} appear={tK + 10} />
      <TeX s={String.raw`\varphi:\ \text{latitude},\quad \lambda:\ \text{longitude}`} x={XC} y={325} size={44} c={C.muted} o={fin(f, tPhi)} />
      <CalcStack f={f} x={1220} y={390} size={44} maxLines={4} rows={[
        { lhs: String.raw`\text{Brest: }\varphi`, rhs: String.raw`=48.4^\circ,\ \ \lambda=-4.5^\circ`, at: AT(k, 9, "forty eight") },
        { lhs: String.raw`\cos\varphi`, rhs: String.raw`=0.664,\ \ \sin\varphi=0.748`, at: AT(k, 10, "Cosine phi"), glow: HL(f, AT(k, 10, "Cosine phi")) },
        { lhs: String.raw`\cos\lambda`, rhs: String.raw`=0.997,\ \ \sin\lambda=-0.078`, at: AT(k, 11, "Cosine lambda"), glow: HL(f, AT(k, 11, "Cosine lambda")) },
        { lhs: String.raw`k_x`, rhs: String.raw`=0.664\times0.997\approx0.662`, at: AT(k, 12, "zero point six six two") },
        { lhs: String.raw`k_y`, rhs: String.raw`=0.664\times(-0.078)`, at: SS(k, 13) },
        { rhs: String.raw`\approx-0.052`, at: AT(k, 13, "minus zero point"), cont: true },
        { lhs: H.k, rhs: String.raw`\approx(0.662,\ -0.052,\ 0.748)`, at: SS(k, 14), glow: HL(f, SS(k, 14) + 6) },
        { lhs: String.raw`|\hat{\mathbf k}|^2`, rhs: String.raw`=0.662^2+0.052^2`, at: SS(k, 15) },
        { rhs: String.raw`\ \ +0.748^2\approx1`, at: SS(k, 15) + 10, cont: true },
      ]} />
    </Scene>
  );
};

// ================================================================ s05 east from the top view (camera rises over the North Pole; Part 1's 90° turn)
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = K("s05_i_east");
  const tAbove = AT(k, 1, "far above"), tPar = AT(k, 2, "the parallel"), tLam = AT(k, 3, "the angle lambda"), tSlide = SS(k, 4), tP1 = SS(k, 5), tRh = SS(k, 6),
    tRdef = AT(k, 7, "cosine lambda"), tPlays = SS(k, 8), tTurn = AT(k, 9, "turning r hat"), tI = SS(k, 10), tZero = SS(k, 11), tNum = SS(k, 12), tY = SS(k, 13);
  const cam = globePath([{ f: 0, ...SIDE }, { f: tAbove, ...SIDE }, { f: tAbove + 75, ...OBL }, { f: tP1 - 50, ...OBL }, { f: tP1 + 5, ...TOP2 }, { f: LEN(k) + 10, ...TOP2 }], f);
  const flat = fin(f, tP1 + 5, 20);
  const U = 170;
  // S4 "Brest slides anticlockwise round this circle": the parcel and its tripod slide 20° east along the parallel and back, on the
  // 3-D globe (build 1 drew this slide on the 2-D layer while that layer was still invisible)
  const lamS = BREST[1] + 20 * Math.sin(Math.PI * clamp((f - tSlide) / 90, 0, 1));
  const sliding = f > tSlide && f < tSlide + 90;
  const A = topArrows(TV, BREST[1], U);
  const rot = 90 * prog(f, tTurn, tTurn + 40);
  const turnTip = turned(A.p, A.Rdir, U, rot);
  const r = pieces(String.raw`\hat{\mathbf i}=(-(-0.078),\ 0.997,\ 0)=(0.078,\ 0.997,\ 0)`, ["=(0.078"]);
  // the companion inset (build 2): Brest's k̂ (and a faint ĵ) on the oblique globe; R̂, level and straight away from the axis, appears
  // with the diagram's R̂ and a copy of it turns about the Earth's axis into î with the diagram's quarter turn
  const G3 = globeG(cam), Gi = globeG(CAM_INSET, INSET);
  const bB = ll(BREST[0], BREST[1]), EB = enAt(BREST[0], BREST[1]), Rd = rhatAt(BREST[1]), LI = 0.2;
  const td = turned3(Rd, EB.e, rot);
  const oTurn = fin(f, tTurn) * (1 - fin(f, tI, 8)), oI = fin(f, tI, 8), oRh = fin(f, tRh);
  const tipsO = fin(f, tLam) * fout(f, tP1 - 60) * (sliding ? 0 : 1);
  return (
    <Scene>
      <Globe cam={cam} o={1 - flat} grat={0.2}
        over={(Gg) => <>
          {gseg(Gg, [0, 0, 0], [0, 1.3, 0], C.local, 3, 0.8 * fin(f, tPar), "10 8")}
          <LatCircle G={Gg} lat={BREST[0]} c={C.gold} w={5} o={fin(f, tPar)} />
          <path d={llPath(Gg, Array.from({ length: 31 }, (_, i) => [BREST[0], BREST[1] + ((lamS - BREST[1]) * i) / 30] as [number, number]), 1.003)} fill="none" stroke={C.key} strokeWidth={6} opacity={fin(f, tSlide)} />
          <Tripod G={Gg} la={BREST[0]} lo={lamS} L={0.18} o={fin(f, tLam)} />
          {gdot(Gg, BREST[0], lamS, C.gold, 10, fin(f, tLam))}
        </>} />
      <TripodTips G={G3} la={BREST[0]} lo={BREST[1]} L={0.18} size={48} o={tipsO} />
      <GlobeFrame id="s05k" zoom={0} disc={discOf(cam)} o={1 - flat} />
      <GSrc />
      <InsetGlobe id="s05i" o={flat} over={(Gg) => <>
        <LatCircle G={Gg} lat={BREST[0]} c={C.gold} w={5} o={0.95} />
        {uarrow(Gg, bB, EB.n, LI, C.second, 0.65)}
        {uarrow(Gg, bB, EB.u, LI * 1.15, C.first)}
        {uarrow(Gg, bB, Rd, LI, C.second, oRh)}
        {uarrow(Gg, bB, td, LI, C.second, oTurn)}
        <GArc G={Gg} b={bB} d0={Rd} d1={EB.e} r={LI * 0.5} deg={rot} o={fin(f, tTurn) * fout(f, tI + 40)} />
        {uarrow(Gg, bB, EB.e, LI, C.second, oI)}
        {gdot(Gg, BREST[0], BREST[1], C.gold, 8)}
      </>} />
      <TeX s={H.k} x={gtip(Gi, bB, EB.u, LI * 1.15)[0]} y={gtip(Gi, bB, EB.u, LI * 1.15)[1]} size={48} c={C.first} ax={0.5} o={flat} halo />
      <TeX s={H.R} x={gtip(Gi, bB, Rd, LI)[0]} y={gtip(Gi, bB, Rd, LI)[1]} size={48} c={C.second} ax={0.5} o={flat * oRh} halo />
      <TeX s={H.i} x={gtip(Gi, bB, EB.e, LI)[0]} y={gtip(Gi, bB, EB.e, LI)[1]} size={48} c={C.second} ax={0.5} o={flat * oI} halo />
      <Svg>
        <g opacity={flat}>
          <TopViewBase V={TV} axes={0.65} />
          <Arrow p={TV.c} q={tvP(TV, BREST[1])} color={C.second} w={8} head={30} o={fin(f, tRh)} />
          <circle cx={A.p[0]} cy={A.p[1]} r={12} fill={C.key} stroke={C.bg} strokeWidth={4} />
          <Arrow p={A.p} q={turnTip} color={C.second} w={10} head={38} o={fin(f, tTurn) * (1 - fin(f, tI, 8))} />
          <AngleArc c={A.p} r={70} a0={sang(A.Rdir)} a1={sang(A.Rdir) + rot} o={fin(f, tTurn) * fout(f, tI + 40)} head />
          <Arrow p={A.p} q={A.I} color={C.second} w={10} head={38} o={fin(f, tI, 8)} />
          <line x1={A.I[0]} y1={A.I[1]} x2={TV.c[0] + TV.r * 0.55} y2={TV.c[1]} stroke={C.gold} strokeWidth={4} strokeDasharray="8 8" opacity={fin(f, tY)} />
        </g>
      </Svg>
      <TeX s={H.x} x={TV.c[0] + 34} y={TV.c[1] + TV.r * 0.5} size={50} c={C.second} o={0.7 * flat} />
      <TeX s={H.y} x={TV.c[0] + TV.r * 0.58} y={TV.c[1] - 40} size={50} c={C.second} o={0.7 * flat} />
      <TeX s={H.R} x={mix(TV.c[0], tvP(TV, BREST[1])[0], 0.5) - 60} y={mix(TV.c[1], tvP(TV, BREST[1])[1], 0.55)} size={52} c={C.second} ax={1} o={flat * fin(f, tRh)} halo />
      <TeX s={H.i} x={A.I[0] + 24} y={A.I[1] - 30} size={56} c={C.second} o={fin(f, tI, 8)} halo />
      {/* k6r8b fix (2026-11-09): enters only once the globe has gone (it sat on the globe for a frame of the cross-fade, f7688) and leaves
          before the gold dashed î-to-ŷ line comes in at tY (the line ran through its end, 34 frames from f9322) */}
      <TeX s={String.raw`\lambda=-4.5^\circ`} x={TV.c[0] + 30} y={TV.c[1] + TV.r * 0.22} size={46} c={C.local} ax={0} o={fin(f, Math.max(tLam, tP1 + 27)) * fout(f, tY - 12)} />
      <Svg>
        <Keyword f={f} text="now east" at={[XC, 110]} appear={0} out={tP1 - 20} />
        <Keyword f={f} text="from above the North Pole" at={[XC, 210]} appear={tAbove} out={tP1 - 20} />
        <Keyword f={f} text="the picture from Part 1" at={[XC, 110]} appear={tP1} out={tRdef - 20} />
        {/* remake 2026-11-07 (R16): the quarter-turn rule with its gold recall keyword (leaves before î's line comes in below it) */}
        <Lbl x={XC} y={478} t="derived in Part 1: quarter turn" c={C.gold} s={T.floor} o={win(f, tTurn, tI - 20)} />
        <Keyword f={f} text="no part along the axis" at={[XC, 620]} s={T.floor} appear={tZero} out={tNum - 20} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf R}=(\cos\lambda,\ \sin\lambda,\ 0)`} x={XC} y={110} size={56} o={fin(f, tRdef)} />
      <TeX s={String.raw`\hat{\mathbf i}\ \text{plays}\ \hat{\boldsymbol\theta}`} x={XC} y={215} size={56} o={fin(f, tPlays)} />
      <TeX s={String.raw`(p,\ q)\ \to\ (-q,\ p)`} x={XC} y={420} size={56} o={fin(f, tTurn)} />
      <TeX s={EQ_S05} x={XC} y={520} size={64} o={fin(f, tI)} />
      <TeX s={r[0]} x={XC} y={620} size={50} o={fin(f, tNum)} />
      <TeX s={r[1]} x={XC + 60} y={700} size={50} o={fin(f, tNum + 20)} />
      <TeX s={String.raw`\hat{\mathbf i}\approx\hat{\mathbf y}`} x={XC} y={800} size={60} c={C.gold} o={fin(f, tY)} />
    </Scene>
  );
};

// ================================================================ s06 north from the meridian slice (half-Earth face → the slice diagram)
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = K("s06_j_north");
  const tSl = AT(k, 1, "slice the Earth"), tDirs = SS(k, 2), tPhi = SS(k, 3), tK = SS(k, 4), tN = SS(k, 5), tPlays = SS(k, 6), tTurn = SS(k, 7), tJ = SS(k, 8),
    tR = SS(k, 9), tJf = SS(k, 10), tNum = SS(k, 11), tLegs = SS(k, 12);
  const slide = prog(f, tSl, tSl + 40);
  const flat = fin(f, tPhi, 20);
  const U = 160, A = sliceArrows(SV, BREST[0], U);
  const rot = 90 * prog(f, AT(k, 7, "turn k hat"), AT(k, 7, "turn k hat") + 40);
  const tip = turned(A.p, A.Kdir, U, rot);
  const sp = Math.sin(BREST[0] * D2R), cp = Math.cos(BREST[0] * D2R);
  const legUp = add(A.p, [0, -1], U * cp), legIn = add(legUp, [-1, 0], U * sp);
  const eq = pieces(EQ_S06, [String.raw`\ -\sin\varphi\sin`]);
  // the companion inset (build 2): Brest's meridian and k̂ on the oblique globe (î faint, known from s05); a copy of k̂ turns about
  // the east arrow towards the pole into ĵ with the diagram's quarter turn
  const tTk = AT(k, 7, "turn k hat");
  const Gi = globeG(CAM_INSET, INSET), bB = ll(BREST[0], BREST[1]), EB = enAt(BREST[0], BREST[1]), LI = 0.2;
  const td = turned3(EB.u, EB.n, rot);
  const oTurn = fin(f, tTk) * (1 - fin(f, tJ, 8)), oJ = fin(f, tJ, 8);
  return (
    <Scene>
      <Globe cam={CAM_FACE} mesh={{ half: LON_FACE, slide, whole: 0 }} o={1 - flat}
        over={(Gg) => <>
          {gseg(Gg, [0, -1.15, 0], [0, 1.25, 0], C.local, 3, fin(f, tDirs), "10 8")}
          {garrow(Gg, [0, 0, 0], [0, 0.55, 0], C.second, 7, 26, fin(f, tDirs))}
          {garrow(Gg, [0, 0, 0], ll(0, BREST[1], 0.55), C.second, 7, 26, fin(f, tDirs))}
          {gdot(Gg, BREST[0], BREST[1], C.gold, 10)}
        </>} />
      <GlobeFrame id="s06k" zoom={0} disc={discOf(CAM_FACE)} o={1 - flat} />
      <GSrc />
      <InsetGlobe id="s06i" o={flat} over={(Gg) => <>
        <path d={meridianPath(Gg, BREST[1])} fill="none" stroke={C.gold} strokeWidth={5} opacity={0.95} />
        {uarrow(Gg, bB, EB.e, LI, C.second, 0.65)}
        {uarrow(Gg, bB, EB.u, LI * 1.15, C.first)}
        {uarrow(Gg, bB, td, LI * 1.15, C.second, oTurn)}
        <GArc G={Gg} b={bB} d0={EB.u} d1={EB.n} r={LI * 0.55} deg={rot} o={fin(f, tTk) * fout(f, tJ + 40)} />
        {uarrow(Gg, bB, EB.n, LI, C.second, oJ)}
        {gdot(Gg, BREST[0], BREST[1], C.gold, 8)}
      </>} />
      <TeX s={H.k} x={gtip(Gi, bB, EB.u, LI * 1.15)[0]} y={gtip(Gi, bB, EB.u, LI * 1.15)[1]} size={48} c={C.first} ax={0.5} o={flat} halo />
      <TeX s={H.j} x={gtip(Gi, bB, EB.n, LI)[0]} y={gtip(Gi, bB, EB.n, LI)[1]} size={48} c={C.second} ax={0.5} o={flat * oJ} halo />
      <Svg>
        <g opacity={flat}>
          <SliceBase V={SV} />
          <AngleArc c={SV.c} r={90} a0={0} a1={BREST[0]} />
          <line x1={SV.c[0]} y1={SV.c[1]} x2={A.p[0]} y2={A.p[1]} stroke={C.local} strokeWidth={3} strokeDasharray="8 8" />
          <Arrow p={A.p} q={A.K} color={C.first} w={10} head={38} />
          <circle cx={A.p[0]} cy={A.p[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={4} />
          <Arrow p={A.p} q={tip} color={C.second} w={10} head={38} o={fin(f, AT(k, 7, "turn k hat")) * (1 - fin(f, tJ, 8))} />
          <AngleArc c={A.p} r={64} a0={sang(A.Kdir)} a1={sang(A.Kdir) + rot} o={fin(f, AT(k, 7, "turn k hat")) * fout(f, tJ + 40)} head />
          <Arrow p={A.p} q={A.J} color={C.second} w={10} head={38} o={fin(f, tJ, 8)} />
          <g opacity={fin(f, tLegs)}>
            <Arrow p={A.p} q={legUp} color={C.second} w={6} head={22} dash="10 8" />
            <Arrow p={legUp} q={legIn} color={C.second} w={6} head={22} dash="10 8" />
          </g>
        </g>
      </Svg>
      <TeX s={H.z} x={SV.c[0] + 24} y={SV.c[1] - SV.r * 0.5} size={50} c={C.second} o={flat} />
      <TeX s={H.R} x={SV.c[0] + SV.r * 0.5} y={SV.c[1] + 44} size={50} c={C.second} ax={0.5} o={flat} />
      <TeX s={String.raw`\varphi=48.4^\circ`} x={SV.c[0] + 100} y={SV.c[1] - 40} size={46} c={C.gold} o={flat * fin(f, tPhi)} />
      {/* build 2: the tip labels sit beside the heads (above them they were cut by the frame's top edge, build 1 f10500) */}
      <TeX s={H.k} x={A.K[0] + 34} y={A.K[1] + 56} size={56} c={C.first} o={flat} halo />
      <TeX s={H.j} x={A.J[0] - 30} y={A.J[1] + 50} size={56} c={C.second} ax={1} o={fin(f, tJ, 8)} halo />
      <TeX s={String.raw`\text{dashed: up the axis,}`} x={XC} y={715} size={44} c={C.second} o={fin(f, tLegs + 12)} />
      <TeX s={String.raw`\text{and in towards it}`} x={XC + 40} y={770} size={44} c={C.second} o={fin(f, tLegs + 12)} />
      <Svg>
        <Keyword f={f} text="now north" at={[XC, 110]} appear={0} out={tK - 20} />
        <Keyword f={f} text="north = the way $\varphi$ grows" at={[XC, 210]} appear={tN} out={tPlays - 20} />
        <Lbl x={XC} y={300} t="Part 1:" c={C.gold} s={T.floor} o={win(f, tTurn, SE(k, 8))} />
      </Svg>
      <TeX s={String.raw`\hat{\mathbf k}=\cos\varphi\,\hat{\mathbf R}+\sin\varphi\,\hat{\mathbf z}`} x={XC} y={110} size={56} o={fin(f, tK)} />
      <TeX s={String.raw`\hat{\mathbf j}\ \text{plays}\ \hat{\boldsymbol\theta}`} x={XC} y={210} size={54} o={win(f, tPlays, SE(k, 8))} />
      <TeX s={String.raw`(p,\ q)\ \to\ (-q,\ p)`} x={XC + 170} y={300} size={54} o={win(f, tTurn, SE(k, 8))} />
      <TeX s={String.raw`\hat{\mathbf j}=-\sin\varphi\,\hat{\mathbf R}+\cos\varphi\,\hat{\mathbf z}`} x={XC} y={400} size={56} o={fin(f, tJ)} />
      <TeX s={String.raw`\hat{\mathbf R}=(\cos\lambda,\ \sin\lambda,\ 0)`} x={XC} y={490} size={52} o={fin(f, tR)} />
      <TeX s={eq[0]} x={XC} y={590} size={50} o={fin(f, tJf)} />
      <TeX s={eq[1]} x={XC + 140} y={655} size={50} o={fin(f, tJf)} />
      <TeX s={String.raw`\hat{\mathbf j}=(-0.7478\times0.9969,`} x={XC} y={715} size={44} o={fin(f, SS(k, 11)) * fout(f, tLegs - 10)} />
      <TeX s={String.raw`-0.7478\times(-0.0785),\ 0.6639)`} x={XC + 40} y={770} size={44} o={fin(f, SS(k, 11) + 15) * fout(f, tLegs - 10)} />
      <TeX s={String.raw`\approx(-0.745,\ 0.059,\ 0.664)`} x={XC + 100} y={825} size={46} o={fin(f, AT(k, 11, "that's minus"))} />
    </Scene>
  );
};

// ================================================================ s07 checks: unit length, right angles, right-handed (zoomed at Brest)
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_enu_checks");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), tRA = SS(k, 4), tCr = SS(k, 6), tK = SS(k, 7), tRH = SS(k, 8), tKeep = SS(k, 9);
  const L = 0.15, G = globeG(ZOOM_BREST, GFULL);
  const t = { b: G.p(BREST[0], BREST[1]) };
  const tp = (() => { const la = BREST[0] * D2R, lo = BREST[1] * D2R, b = ll(BREST[0], BREST[1]);
    const q = (v: number[], s: number): V3 => [b[0] + v[0] * s, b[1] + v[1] * s, b[2] + v[2] * s];
    return { i: G.pw(q([Math.cos(lo), 0, -Math.sin(lo)], L)), j: G.pw(q([-Math.sin(la) * Math.sin(lo), Math.cos(la), -Math.sin(la) * Math.cos(lo)], L)), k: G.pw(q(b, L * 1.15)) }; })();
  const u = (q: Pt): Pt => { const dx = q[0] - t.b[0], dy = q[1] - t.b[1], n = Math.hypot(dx, dy) || 1; return [dx / n, dy / n]; };
  // Part 1 lessons B4: at the keep line the zoomed Brest check (rows, right-angle ticks) gives way to the keep line's own picture:
  // the whole globe, a tripod at several places, each up arrow continuing the dashed line from the Earth's centre
  const kO = fin(f, tKeep, 15), zO = 1 - kO;
  const KEEP_CAM: GlobeCam = { lat: 28, lon: 12, dist: 3.4 };
  const KEEP_P: [number, number][] = [[BREST[0], BREST[1]], [2, 18], [56, 42], [22, -24], [-25, 25]];
  return (
    <Scene>
      <Globe cam={ZOOM_BREST} box={GFULL} coast={0.6} o={zO} over={(Gg) => <Tripod G={Gg} la={BREST[0]} lo={BREST[1]} L={L} w={9} head={34} />} />
      <TripodTips G={G} la={BREST[0]} lo={BREST[1]} L={L} size={58} o={zO} />
      {kO > 0 ? <Globe cam={KEEP_CAM} o={kO} grat={0.22} coast={0.45} over={(Gg) => <>
        {KEEP_P.map(([la, lo], i) => Gg.vis(la, lo) ? <g key={i}>{gseg(Gg, [0, 0, 0], ll(la, lo), C.local, 3, 0.85, "10 8")}<Tripod G={Gg} la={la} lo={lo} L={0.2} w={7} head={26} /></g> : null)}
        <circle cx={Gg.pw([0, 0, 0])[0]} cy={Gg.pw([0, 0, 0])[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
      </>} /> : null}
      <Svg o={zO}>
        <RightTick at={t.b} u1={u(tp.i)} u2={u(tp.j)} s={30} o={fin(f, tRA)} c={C.key} />
        <RightTick at={t.b} u1={u(tp.j)} u2={u(tp.k)} s={30} o={fin(f, SS(k, 5))} c={C.key} />
        <RightTick at={t.b} u1={u(tp.i)} u2={u(tp.k)} s={30} o={fin(f, SS(k, 5) + 10)} c={C.key} />
      </Svg>
      <GlobeFrame id="s07k" zoom={1} right={1} />
      <SourceBelow text={SRC_G} pic={{ x: 80, y: 40, w: 960, h: 772 }} w={960} name="s07 src" />
      <Svg>
        <Keyword f={f} text="length one? right angles?" at={[XZ, 110]} s={T.floor} appear={0} out={t1 - 20} />
        <Keyword f={f} text="right-handed at Brest" at={[XZ, 770]} s={T.floor} appear={tRH} out={tKeep - 20} />
        <Keyword f={f} text="what to keep" at={[XZ, 700]} appear={tKeep} c={C.gold} />
      </Svg>
      <CalcStack f={f} x={1270} y={150} size={44} maxLines={3} o={fout(f, tKeep - 12)} rows={[
        { lhs: String.raw`|\hat{\mathbf i}|^2`, rhs: String.raw`=0.078^2+0.997^2\approx1`, at: AT(k, 1, "the squares") },
        { lhs: String.raw`\hat{\mathbf i}\cdot\hat{\mathbf j}`, rhs: String.raw`=0.078\times(-0.745)`, at: AT(k, 2, "we multiply") },
        { rhs: String.raw`+0.997\times0.059+0`, at: AT(k, 2, "and add them"), cont: true },
        { rhs: String.raw`\approx-0.058+0.059\approx0`, at: t3 },
        { lhs: String.raw`\hat{\mathbf j}\cdot\hat{\mathbf k}`, rhs: String.raw`=-0.493-0.003`, at: SS(k, 5), c: C.muted },
        { rhs: String.raw`+0.497\approx0`, at: SS(k, 5) + 15, c: C.muted, cont: true },
        { lhs: String.raw`\hat{\mathbf k}\cdot\hat{\mathbf i}`, rhs: String.raw`\approx0.052-0.052+0=0`, at: SS(k, 5) + 30, c: C.muted },
        { lhs: String.raw`\hat{\mathbf i}\times\hat{\mathbf j}`, rhs: String.raw`=(0.997\times0.664-0,`, at: tCr },
        { rhs: String.raw`\ \ 0-0.078\times0.664,`, at: tCr + 12, cont: true },
        { rhs: String.raw`\ \ 0.078\times0.059`, at: tCr + 24, cont: true },
        { rhs: String.raw`\ \ \ \ -0.997\times(-0.745))`, at: tCr + 30, cont: true },
        { rhs: String.raw`\approx(0.662,\ -0.052,\ 0.748)`, at: AT(k, 6, "gives zero point six"), cont: true },
      ]} />
      <TeX s={String.raw`=\hat{\mathbf k}`} x={1270} y={680} size={56} c={C.first} o={fin(f, tK) * fout(f, tKeep - 20)} />
      <Svg><Lbl x={XZ} y={680} t="so" c={C.muted} s={T.floor} o={fin(f, tK) * fout(f, tKeep - 20)} /></Svg>
      <Svg>
        <Lbl x={XZ} y={775} t="each place: its own arrows" c={C.key} s={T.floor} o={fin(f, tKeep + 20)} />
        <Lbl x={XZ} y={830} t="up: away from the centre" c={C.key} s={T.floor} o={fin(f, tKeep + 30)} />
      </Svg>
      {void t2}
    </Scene>
  );
};

// ================================================================ s08 other stations: Trappes (arc rule) and Singapore (dot product)
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = K("s08_other_stations");
  const tOut = AT(k, 1, "zoom back out"), tTr = AT(k, 2, "Trappes"), tArc = SS(k, 5), t43 = SS(k, 6), tSg = AT(k, 7, "Singapore"), tDot = SS(k, 9), tKs = SS(k, 10), tMul = SS(k, 11),
    tSum = SS(k, 12), t101 = SS(k, 13), tMore = SS(k, 14);
  const cam = globePath([{ f: 0, ...ZOOM_BREST }, { f: tOut, ...ZOOM_BREST }, { f: tOut + 50, ...UN, lat: 47, lon: 0 }, { f: tSg - 30, ...UN, lat: 47, lon: 0 },
    { f: tSg + 20, ...UN, lat: 30, lon: 48 }, { f: LEN(k) + 10, ...UN, lat: 30, lon: 50 }], f);
  const zf = zoomOf(cam), G0 = discOf(cam, GFULL), G = globeG(cam, GFULL);
  const L = zf > 0.5 ? 0.15 : 0.2;
  const c0 = G.pw([0, 0, 0]);
  const slices = (la: number, lo: number, s = 1) => G.pw(ll(la, lo, s));
  const k3 = fin(f, t101);
  return (
    <Scene>
      <Globe cam={cam} box={GFULL} grat={0.2 * (1 - zf)} coast={0.55}
        over={(Gg) => <>
          <Tripod G={Gg} la={BREST[0]} lo={BREST[1]} L={L} />
          <Tripod G={Gg} la={TRAPPES[0]} lo={TRAPPES[1]} L={L} o={fin(f, tTr)} />
          <Tripod G={Gg} la={SING[0]} lo={SING[1]} L={0.2} o={fin(f, tSg)} />
          <path d={llPath(Gg, Array.from({ length: 21 }, (_, i) => [mix(BREST[0], TRAPPES[0], i / 20), mix(BREST[1], TRAPPES[1], i / 20)] as [number, number]), 1.004)} fill="none" stroke={C.gold} strokeWidth={6} opacity={win(f, tArc, tSg - 20)} />
          {plab(Gg, BREST[0], BREST[1], "Brest", fin(f, tOut + 40) * facing(Gg, BREST[0], BREST[1]), -22, 32, "end")}
          {plab(Gg, TRAPPES[0], TRAPPES[1], "Trappes", fin(f, tTr) * facing(Gg, TRAPPES[0], TRAPPES[1]), 18, -40)}
          {plab(Gg, SING[0], SING[1], "Singapore", fin(f, tSg) * facing(Gg, SING[0], SING[1]), 18, 40)}
        </>} />
      <Svg>
        <g opacity={win(f, tArc, tSg - 20)}>
          <line x1={c0[0]} y1={c0[1]} x2={slices(BREST[0], BREST[1])[0]} y2={slices(BREST[0], BREST[1])[1]} stroke={C.gold} strokeWidth={3} strokeDasharray="8 8" />
          <line x1={c0[0]} y1={c0[1]} x2={slices(TRAPPES[0], TRAPPES[1])[0]} y2={slices(TRAPPES[0], TRAPPES[1])[1]} stroke={C.gold} strokeWidth={3} strokeDasharray="8 8" />
        </g>
        <g opacity={k3}>
          <Arrow p={c0} q={slices(BREST[0], BREST[1], 1.25)} color={C.first} w={6} head={24} />
          <Arrow p={c0} q={slices(SING[0], SING[1], 1.25)} color={C.first} w={6} head={24} />
          <path d={poly(Array.from({ length: 31 }, (_, i) => { const a = ll(BREST[0], BREST[1], 1), b = ll(SING[0], SING[1], 1), t = i / 30;
            const v: V3 = [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)], n = Math.hypot(...v); return G.pw([v[0] / n * 0.35, v[1] / n * 0.35, v[2] / n * 0.35]); }))}
            fill="none" stroke={C.gold} strokeWidth={5} />
        </g>
      </Svg>
      <GlobeFrame id="s08k" zoom={zf} right={zf} disc={G0} />
      <SourceBelow text={SRC_G} pic={{ x: 80, y: 40, w: 960, h: 772 }} w={960} name="s08 src" o={Math.max(clamp((822 - (G0.c[1] + G0.r)) / 20, 0, 1), clamp((zf - 0.5) / 0.15, 0, 1))} />
      <Svg>
        <Keyword f={f} text="each station: its own frame" at={[XZ, 110]} s={T.floor} appear={0} out={tTr - 20} />
        <Lbl x={XZ} y={110} t="Trappes: 480 km east" c={C.key} s={T.floor} o={fin(f, tTr)} />
        <Lbl x={XZ} y={190} t="ups' angle $\theta$ = centre angle" c={C.muted} s={T.floor} o={fin(f, SS(k, 4))} />
        <Keyword f={f} text="more than a right angle" at={[XZ, 822]} s={T.floor} appear={tMore} />
      </Svg>
      <TeX s={String.raw`\Delta\lambda=2.01^\circ+4.49^\circ=6.50^\circ`} x={XZ} y={190} size={44} c={C.muted} o={win(f, AT(k, 2, "four hundred"), SS(k, 4) - 22)} />
      <TeX s={String.raw`\Delta x=6.50\times73.8\ \text{km}\approx480\ \text{km}`} x={XZ} y={250} size={44} c={C.muted} o={win(f, AT(k, 2, "four hundred") + 25, SS(k, 4) - 22)} />
      <TeX s={String.raw`\theta=\dfrac{480}{6371}\approx0.075\ \text{rad}\approx4.3^\circ`} x={XZ} y={300} size={46} o={fin(f, tArc)} />
      {/* remake 2026-11-07 (R16): the arc rule is Part 1's (s = r × angle); the step per degree east (73.8 km at Brest) is Part 3's */}
      <Recall f={f} tex="" name="arc length" part={1} x={XZ} y={385} appear={tArc + 10} out={tDot - 12} />
      <TeX s={EQ_S08} x={XZ} y={430} size={52} o={fin(f, tDot)} />
      <TeX s={String.raw`\hat{\mathbf k}_S=(-0.239,\ 0.971,\ 0.024)`} x={XZ} y={515} size={44} o={fin(f, tKs)} />
      <TeX s={String.raw`\hat{\mathbf k}_B\cdot\hat{\mathbf k}_S=0.662\times(-0.239)`} x={XZ} y={600} size={44} o={fin(f, tMul)} />
      <TeX s={String.raw`+(-0.052)\times0.971`} x={XZ + 150} y={655} size={44} o={fin(f, tMul + 15)} />
      <TeX s={String.raw`+0.748\times0.024`} x={XZ + 150} y={710} size={44} o={fin(f, tMul + 30)} />
      <TeX s={String.raw`=-0.158-0.050+0.018`} x={XZ + 40} y={765} size={44} o={fin(f, tSum)} />
      <TeX s={f < t101 ? String.raw`=-0.191` : String.raw`=-0.191\ \Rightarrow\ \approx101^\circ`} x={XZ + 40} y={822} size={44} o={win(f, AT(k, 12, "minus zero point"), tMore - 20)} glow={HL(f, AT(k, 13, "about a hundred and one"))} />
      {void t43}
    </Scene>
  );
};

// ================================================================ s09 Khulna (zoom tour of the Bay of Bengal) and Amphan
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09_khulna");
  const tKh = AT(k, 0, "Khulna"), tBd = AT(k, 0, "Bangladesh"), tGa = AT(k, 1, "Ganges delta"), tSu = AT(k, 1, "Sundarbans"), tBay = AT(k, 2, "Bay of Bengal"),
    tKo = AT(k, 2, "Kolkata"), tIn = AT(k, 2, "in India"), tAm = AT(k, 3, "Cyclone Amphan"), t78 = AT(k, 3, "seventy nine"), tLL = SS(k, 4), tKk = SS(k, 5), tDot = SS(k, 6),
    t76 = SS(k, 7), tEast = SS(k, 8), tIk = SS(k, 9), t94 = SS(k, 10), tMean = SS(k, 11), tZo = AT(k, 12, "zoom back out");
  const Z: GlobeCam = { lat: KHULNA[0] - 1.0, lon: KHULNA[1] - 0.3, dist: 1.25, pp: [560, 430] };
  const cam = globePath([{ f: 0, ...UN, lat: 30, lon: 50 }, { f: 6, ...UN, lat: 30, lon: 50 }, { f: tKh + 20, ...Z }, { f: tZo, ...Z }, { f: tZo + 50, ...UN, lat: 35, lon: 42 },
    { f: LEN(k) + 10, ...UN, lat: 35, lon: 42 }], f);
  const zf = clamp((4.3 - cam.dist) / (4.3 - 1.55), 0, 1), G0 = discOf(cam, GFULL);
  const zfr = Math.max(zf, clamp((G0.c[0] + G0.r - 1000) / 60, 0, 1));
  const AM = KH.amphan, kol = KH.kolkata as [number, number];
  const ca = AM.closest_at as [number, number];
  const zo = fin(f, tZo + 40);
  const G = globeG(cam, GFULL);
  const c0 = G.pw([0, 0, 0]);
  const k1 = r3(G, BREST), k2 = r3(G, KHULNA);
  return (
    <Scene>
      <Globe cam={cam} box={GFULL} grat={0.18 * (1 - zf)} coast={0.5 * (1 - zf)} extraLines={[...D.lines.bob_coast, ...D.lines.bob_border]} extraO={zf}
        over={(Gg) => <>
          <path d={llPath(Gg, (AM.lat as number[]).map((la, i) => [la, AM.lon[i]] as [number, number]), 1.003)} fill="none" stroke={C.gold} strokeWidth={4} opacity={fin(f, tAm) * (1 - zo)} />
          {(AM.lat as number[]).map((la, i) => <g key={i}>{gdot(Gg, la, AM.lon[i], C.gold, 6, fin(f, tAm + i) * (1 - zo))}</g>)}
          {gseg(Gg, ll(KH.ll_ne[0], KH.ll_ne[1], 1.003), ll(ca[0], ca[1], 1.003), C.gold, 5, fin(f, t78) * (1 - zo), "10 6")}
          <Tripod G={Gg} la={KHULNA[0]} lo={KHULNA[1]} L={zf > 0.5 ? 0.06 : 0.2} o={fin(f, tKk)} />
          <Tripod G={Gg} la={BREST[0]} lo={BREST[1]} L={0.2} o={zo} />
          {gdot(Gg, KH.ll_ne[0], KH.ll_ne[1], C.gold, 10, fin(f, tKh) * (1 - fin(f, tKk)))}
          {plab(Gg, KH.ll_ne[0], KH.ll_ne[1], "Khulna", fin(f, tKh), 20, -34)}
          {plab(Gg, 23.6, 90.3, "Bangladesh", win(f, tBd, tZo - 10) * zf, 0, 0, "middle")}
          {plab(Gg, 23.4, 86.6, "India", win(f, tIn, tZo - 10) * zf, 0, 0, "middle")}
          {plab(Gg, 22.3, 90.2, "Ganges delta", win(f, tGa, tLL) * zf, 0, 0, "start", true)}
          {plab(Gg, 21.9, 89.3, "Sundarbans", win(f, tSu, tZo - 10) * zf, 0, 0, "end", true)}
          {plab(Gg, 19.2, 89.4, "Bay of Bengal", win(f, tBay, tZo - 10) * zf, 0, 0, "middle", true)}
          {gdot(Gg, kol[0], kol[1], C.key, 8, win(f, tKo, tZo - 10) * zf)}
          {plab(Gg, kol[0], kol[1], "Kolkata", win(f, tKo, tZo - 10) * zf, -18, -30, "end")}
          {plab(Gg, BREST[0], BREST[1], "Brest", zo * facing(Gg, BREST[0], BREST[1]), -22, 32, "end")}
        </>} />
      <Svg>
        <g opacity={zo}>
          <Arrow p={c0} q={k1} color={C.first} w={6} head={24} />
          <Arrow p={c0} q={k2} color={C.first} w={6} head={24} />
        </g>
      </Svg>
      {/* k6r8b fix (2026-11-09): on the zoom back out the globe's disc still reached under the stack's left column (î_B·î_K over the
          picture, f19528); the frame keeps its fades and the right panel until the shrinking disc ends left of x 1060 */}
      <GlobeFrame id="s09k" zoom={zfr} right={zfr} disc={G0} bottomAt={790} />
      <SourceBelow text="Image: NASA Blue Marble NG · Natural Earth · Track: IBTrACS (NOAA NCEI), Amphan, May 2020" pic={{ x: 80, y: 40, w: 960, h: 742 }} w={960} name="s09 src"
        o={Math.max(clamp((790 - (G0.c[1] + G0.r)) / 20, 0, 1), clamp((zf - 0.5) / 0.15, 0, 1))} />
      <Svg>
        <Keyword f={f} text="Khulna, Bangladesh" at={[XZ, 110]} appear={0} out={tLL - 20} />
        <SideCallout f={f} lines={["Amphan, May 2020:", "centre ≈ 79 km west"]} at={[XZ, 230]} appear={t78} out={tLL - 20} target={null} s={T.floor} />
        <Keyword f={f} text="same words, different arrows" at={[XZ, 820]} s={T.floor} appear={tMean} />
      </Svg>
      <TeX s={String.raw`22.8^\circ\text{N},\ \ 89.6^\circ\text{E}`} x={XZ} y={110} size={54} o={fin(f, tLL) * fout(f, tEast - 22)} />
      <Svg><Keyword f={f} text="even east is different" at={[XZ, 110]} s={T.floor} appear={tEast} /></Svg>
      {/* k6r8b fix (2026-11-09): exit before entry. Each line the stack pushes out fades 10 frames BEFORE the next line slides in,
          so it never rises through "even east is different" at y 110 (k̂_K under it at f18868) */}
      <CalcStack f={f} x={1235} y={190} size={44} maxLines={3} rows={[
        { lhs: "", rhs: String.raw`\cos\varphi=0.922,\ \ \sin\varphi=0.388`, at: AT(k, 5, "cosine phi"), c: C.muted, glow: HL(f, AT(k, 5, "cosine phi")), out: tDot - 10 },
        { lhs: "", rhs: String.raw`\cos\lambda=0.007,\ \ \sin\lambda=1.000`, at: AT(k, 5, "cosine lambda"), c: C.muted, glow: HL(f, AT(k, 5, "cosine lambda")), out: t76 - 10 },
        { lhs: String.raw`\hat{\mathbf k}_K`, rhs: String.raw`=(0.922\times0.007,`, at: AT(k, 5, "so its up arrow"), out: tIk - 10 },
        { lhs: "", rhs: String.raw`\ \ 0.922\times1.000,\ 0.388)`, at: AT(k, 5, "so its up arrow") + 12, cont: true, out: tIk - 10 },
        { lhs: "", rhs: String.raw`\approx(0.006,\ 0.922,\ 0.388)`, at: AT(k, 5, "zero point zero zero six"), cont: true, out: tIk - 10 },
        { lhs: String.raw`\hat{\mathbf k}_B\cdot\hat{\mathbf k}_K`, rhs: String.raw`=0.662\times0.006`, at: tDot, out: t94 - 10 },
        { lhs: "", rhs: String.raw`\ \ +(-0.052)\times0.922`, at: tDot + 15, cont: true, out: t94 - 10 },
        { lhs: "", rhs: String.raw`\ \ +0.748\times0.388`, at: tDot + 30, cont: true, out: t94 - 10 },
        { lhs: "", rhs: String.raw`=0.004-0.048+0.290`, at: AT(k, 6, "that gives"), cont: true, out: t94 - 10 },
        { lhs: "", rhs: String.raw`=0.246`, at: AT(k, 6, "zero point two four six"), cont: true, out: t94 - 10 },
        { lhs: "", rhs: String.raw`\cos^{-1}0.246\approx75.8^\circ`, at: t76, glow: HL(f, AT(k, 7, "seventy five point eight")), out: t94 + 45 },
        { lhs: String.raw`\hat{\mathbf i}_K`, rhs: String.raw`=(-\sin89.6^\circ,\ \cos89.6^\circ,\ 0)`, at: tIk },
        { lhs: "", rhs: String.raw`=(-1.000,\ 0.007,\ 0)`, at: AT(k, 9, "minus one"), cont: true },
        { lhs: "", rhs: String.raw`\approx-\hat{\mathbf x}`, at: AT(k, 9, "almost exactly"), cont: true },
        { lhs: String.raw`\hat{\mathbf i}_B\cdot\hat{\mathbf i}_K`, rhs: String.raw`=0.078\times(-1.000)`, at: t94 },
        { lhs: "", rhs: String.raw`\ \ +0.997\times0.007`, at: t94 + 15, cont: true },
        { lhs: "", rhs: String.raw`=-0.078+0.007`, at: t94 + 30, cont: true },
        { lhs: "", rhs: String.raw`=-0.071`, at: t94 + 40, cont: true },
        { lhs: "", rhs: String.raw`\cos^{-1}(-0.071)\approx94^\circ`, at: t94 + 55, glow: HL(f, AT(k, 10, "ninety four")) },
      ]} />
    </Scene>
  );
};
const r3 = (G: ReturnType<typeof globeG>, p: [number, number]) => G.pw(ll(p[0], p[1], 1.25));

export const SCENES_A: Record<string, React.FC> = {
  s00_title: S00, s01_hook: S01, s03_enu: S03, s04_k_up: S04, s05_i_east: S05, s06_j_north: S06, s07_enu_checks: S07,
  s08_other_stations: S08, s09_khulna: S09,
};
void [ArcHead, CurvedLink, arcD, svNorth, svP, svUp, tvDir, tvEast, fout, SE];
