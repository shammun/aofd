// ch00_coordinates_sphere scenes s26-s36: ERA5 grid boxes at four places (real BMNG panels, the 0.25° grid), the area of a patch
// (zoom-reveal, skip chip K4), ERA5 box areas (3-D tiles), the strip round the Earth, the slope of sine, adding strips (integration),
// the band fraction, Archimedes' cylinder, the cos φ weighting of a global mean (toy, then ERA5 September 2026; keep line K4), the
// recap and the series end card. Numbers from data/cs.json only (CHECK_C re-asserts every screen string).
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Pt, pulse } from "../house/kit/draw";
import { Check, Notebook } from "../house/kit/icons";
import { CurvedLink } from "../house/kit/extras";
import { GlobeFrame } from "../house/kit/frame";
import { SourceBelow } from "./cs_lib";   // p3c: the gated source line (enters at XF after a scene start)
import { Axis3D, GProj, globePath } from "./kit_cs/globe";
import { Rod3D } from "./kit_cs/three3d";
import { orbitCam, projector, V3 } from "./kit_cs/cam";
import {
  AT, Arrow, BREST, BandTint, CalcStack, ColourBar, D, D2R, Earth, GB, GFULL, IMGS, K, KHULNA, KeepLine, Keyword, LEN, LUT_T, LYB, Layered, Lbl, SE, SING, SRC_G, SS,
  Scene, SideCallout, SkipChip, Svg, TeX, Thermo, VIOLET, XC, XZ, arcD, chipSpan, clamp, cutAt, discOf, fin, fout, gdot, gseg, globeG, keepGone, keepTime, ll, merPath, mix,
  parPath, plab, poly, prog, rep, spinPath, splitVis, win,
  RAD, Magnify, KeepPic,
  Recall, HOLD, facePt, merFace, XF, XIN,
} from "./cs_lib";
import { ramp } from "../house";
import { merCut } from "./cs_two";
import { EQ_S18, EQ_S27, EQ_S28, EQ_S29, EQ_S30, EQ_S31, EQ_S32, EQ_S33, EQ_S34 } from "./cs_eq";

const E5 = D.era5, AR = D.area, BD = D.band, TM = D.t2m;
const CHECK_C: [string, number, number, number][] = [
  ["tall", E5.tall, 27.8, 0.05], ["wS", E5.wide[0], 27.8, 0.05], ["wK", E5.wide[1], 25.6, 0.05], ["wB", E5.wide[2], 18.5, 0.05], ["wL", E5.wide[3], 5.7, 0.05],
  ["ratio", E5.ratio, 4.9, 0.05], ["a2", AR.a2 / 1e6, 40.6, 0.05], ["rad", AR.rad025, 0.00436, 5e-6], ["A0", AR.flat[0], 773, 0.5], ["AK", AR.flat[1], 712, 0.5],
  ["AB", AR.flat[2], 513, 0.5], ["AL", AR.flat[3], 158, 0.5], ["exB", AR.exact[2], 513.1, 0.05], ["st1", BD.steps[0], 0.174, 5e-4], ["st2", BD.steps[1], 0.168, 5e-4],
  ["st3", BD.steps[2], 0.158, 5e-4], ["nh", BD.nh / 1e6, 255, 0.5], ["whole", BD.whole / 1e6, 510, 0.5], ["f48", BD.f48, 0.7478, 5e-5], ["Tw", TM.weighted, 16.3, 0.05],
  ["Tp", TM.plain, 7.1, 0.05], ["dT", TM.weighted - TM.plain, 9, 0.2], ["sin30", BD.curve[30], 0.5, 1e-9], ["sin20", BD.curve[20], 0.342, 5e-4], ["cos25", Math.cos(25 * D2R), 0.906, 5e-4],
];
CHECK_C.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
const GSrc: React.FC<{ o?: number }> = ({ o = 1 }) => <SourceBelow text={SRC_G} pic={GB} w={960} o={o} name="globe src" />;
const PHI = BREST[0];

// ================================================================ s26 ERA5 grid boxes at four places
const PW = 400, PH = 440, PY = 120, PX = [80, 500, 920, 1340];
type PanelD = { key: string; name: string; box: number[]; cell: number[]; glat: number[]; glon: number[]; coast: number[][] };
const Panel: React.FC<{ p: PanelD; x: number; o: number; f: number; tCell: number; ghost: number }> = ({ p, x, o, f, tCell, ghost }) => {
  if (o <= 0) return null;
  const [la0, la1, lo0, lo1] = p.box;
  const P = (la: number, lo: number): Pt => [x + ((lo - lo0) / (lo1 - lo0)) * PW, PY + ((la1 - la) / (la1 - la0)) * PH];
  const c = p.cell, a = P(c[1], c[2]), b = P(c[0], c[3]);
  const gw = (b[0] - a[0]) * (E5.ratio - 1) / 2;
  let coast = "";
  for (const ln of p.coast) for (let i = 0; i < ln.length; i += 2) { const q = P(ln[i + 1], ln[i]); coast += `${i ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`; }
  return (
    <div style={{ position: "absolute", left: x, top: PY, width: PW, height: PH, overflow: "hidden", opacity: o }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: -x, top: -PY }}>
        <image href={IMGS.panel(p.key)} x={x} y={PY} width={PW} height={PH} preserveAspectRatio="none" />
        <path d={coast} fill="none" stroke={C.key} strokeOpacity={0.7} strokeWidth={2} />
        {p.glat.map((la) => <line key={`a${la}`} x1={x} y1={P(la, lo0)[1]} x2={x + PW} y2={P(la, lo0)[1]} stroke="#cfd6e6" strokeOpacity={0.75} strokeWidth={2} />)}
        {p.glon.map((lo) => <line key={`o${lo}`} x1={P(la0, lo)[0]} y1={PY} x2={P(la0, lo)[0]} y2={PY + PH} stroke="#cfd6e6" strokeOpacity={0.75} strokeWidth={2} />)}
        <rect x={a[0]} y={a[1]} width={b[0] - a[0]} height={b[1] - a[1]} fill={C.gold} fillOpacity={0.35 * fin(f, tCell)} stroke={C.gold} strokeWidth={5} opacity={fin(f, tCell)} />
        {ghost > 0 ? <rect x={a[0] - gw} y={a[1]} width={(b[0] - a[0]) * E5.ratio} height={b[1] - a[1]} fill="none" stroke={C.neg} strokeWidth={5} strokeDasharray="14 9" opacity={ghost} /> : null}
      </svg>
    </div>
  );
};
const cellCentre = (p: PanelD, x: number): Pt => {
  const [la0, la1, lo0, lo1] = p.box, c = p.cell;
  return [x + (((c[2] + c[3]) / 2 - lo0) / (lo1 - lo0)) * PW, PY + ((la1 - (c[0] + c[1]) / 2) / (la1 - la0)) * PH];
};
/** a cubed-sphere grid: each of the cube's six faces split n × n, the grid lines pushed out onto the sphere (front parts only) */
const cubeGrid = (G: GProj, n: number): Pt[][] => {
  const F: [V3, V3, V3][] = [[[1, 0, 0], [0, 1, 0], [0, 0, 1]], [[-1, 0, 0], [0, 1, 0], [0, 0, 1]], [[0, 1, 0], [1, 0, 0], [0, 0, 1]],
    [[0, -1, 0], [1, 0, 0], [0, 0, 1]], [[0, 0, 1], [1, 0, 0], [0, 1, 0]], [[0, 0, -1], [1, 0, 0], [0, 1, 0]]];
  const out: Pt[][] = [];
  for (const [N, U, V] of F) for (let i = 0; i <= n; i++) for (const along of [0, 1]) {
    const t = -1 + (2 * i) / n;
    const pts: V3[] = Array.from({ length: 25 }, (_, j) => { const s = -1 + j / 12, u = along ? t : s, v = along ? s : t;
      const q: V3 = [N[0] + u * U[0] + v * V[0], N[1] + u * U[1] + v * V[1], N[2] + u * U[2] + v * V[2]], m = Math.hypot(...q) / 1.003;
      return [q[0] / m, q[1] / m, q[2] / m]; });
    out.push(...splitVis(G, pts).front);
  }
  return out;
};
const S26: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26_grid_boxes");
  const tRe = AT(k, 1, "reanalysis"), tGrid = SS(k, 2), tTall = SS(k, 3), tH = AT(k, 4, "is about"), tW = SS(k, 5), tThin = SS(k, 10), tForget = SS(k, 11), tSlope = SS(k, 12),
    tP2 = SS(k, 13), tOther = SS(k, 14);
  const atW = [AT(k, 6, "twenty seven point eight"), AT(k, 7, "twenty five point six"), AT(k, 8, "eighteen and a half"), AT(k, 9, "five point seven")];
  const atName = [AT(k, 6, "Singapore"), AT(k, 7, "Khulna"), AT(k, 8, "Brest"), AT(k, 9, "Longyearbyen")];
  const pans = E5.panels as PanelD[];
  const oP = 1 - fin(f, tOther, 20);
  const camG = globePath([{ f: tOther, lat: 58, lon: 20, dist: 3.4 }, { f: LEN(k) + 10, lat: 56, lon: 30, dist: 3.4 }], f);
  const GB_LL = { x: 80, y: 60, w: 840, h: 640 }, GB_CS = { x: 1000, y: 60, w: 840, h: 640 };
  return (
    <Scene>
      {pans.map((p, i) => <Panel key={p.key} p={p} x={PX[i]} o={oP} f={f} tCell={tGrid + 20} ghost={i === 3 ? win(f, tForget, tP2) : 0} />)}
      <Svg o={oP}>
        {pans.map((p, i) => <g key={p.key}>
          <Lbl x={PX[i] + PW / 2} y={PY + PH + 34} t={p.name} c={C.key} s={T.floor} a="middle" o={0.6 + 0.4 * fin(f, atName[i])} />
          <Lbl x={PX[i] + PW / 2} y={PY + PH + 90} t={`${E5.wide[i].toFixed(1)} km wide`} c={C.gold} s={T.floor} a="middle" o={fin(f, atW[i])} />
        </g>)}
      </Svg>
      <SourceBelow text="Image: NASA Blue Marble Next Generation · Natural Earth · ERA5 0.25° grid (Copernicus C3S)" pic={{ x: 80, y: PY, w: 1660, h: PH + 110 }} w={1660}
        o={oP * fin(f, XF, 8)} name="s26 src" />{/* p3b: after s25's "pole" row and credit */}
      {f >= tOther ? <>
        {/* review 1 S9: "other kinds of grid" shows the problem AND an answer, both large: the latitude-longitude grid (every 10°) crowds
            together at the pole; a cubed-sphere grid (a cube's faces split 8 × 8 and puffed out onto the sphere) keeps its boxes about the
            same size. Schematic grids drawn on the real globe image; one source line below both */}
        <Earth cam={camG} box={GB_LL} o={fin(f, tOther, 20)} coast={0.4} over={(G) => <>
          {(() => { let d = ""; for (let la = -80; la <= 80; la += 10) d += parPath(G, la); for (let lo = -180; lo < 180; lo += 10) d += merPath(G, lo, -90, 90); return <path d={d} fill="none" stroke={C.gold} strokeOpacity={0.85} strokeWidth={2} />; })()}
        </>} />
        <Earth cam={camG} box={GB_CS} o={fin(f, tOther + 20, 20)} coast={0.4} over={(G) => <>
          {cubeGrid(G, 8).map((q, i) => <path key={i} d={poly(q)} fill="none" stroke={C.gold} strokeOpacity={0.85} strokeWidth={2} />)}
        </>} />
        <Svg>
          <Lbl x={GB_LL.x + GB_LL.w / 2} y={GB_LL.y + GB_LL.h + 30} t="latitude-longitude: crowded at the pole" c={C.key} s={T.floor} a="middle" o={fin(f, tOther + 10)} />
          <Lbl x={GB_CS.x + GB_CS.w / 2} y={GB_CS.y + GB_CS.h + 30} t="cubed sphere: boxes about the same size" c={C.key} s={T.floor} a="middle" o={fin(f, tOther + 30)} />
        </Svg>
        {/* K6 k6r1: the globe's source line comes in after the panels' one has gone (they cross-faded on one row) */}
        <SourceBelow text={SRC_G} pic={{ x: GB_LL.x, y: GB_LL.y, w: 1700, h: GB_LL.h + 60 }} w={1700} o={fin(f, tOther + 26, 12)} name="s26 globe src" />
      </> : null}
      <Svg>
        <Keyword f={f} text="weather data" at={[XC, 770]} appear={XIN} out={tRe - 20} />{/* p3b: after s25's keywords */}
        <Keyword f={f} text="reanalysis = observations + model" at={[80, 770]} appear={tRe} out={tTall - 15} />
        <Keyword f={f} text="every 0.25°" at={[1340, 770]} appear={tGrid} out={tTall - 15} />
        <Keyword f={f} text="width depends on $\cos\varphi$" at={[80, 830]} appear={tW} out={tThin - 20} s={T.floor + 4} />
        <Keyword f={f} text="thinner and thinner towards the poles" at={[80, 830]} appear={tThin} out={tForget - 20} s={T.floor + 4} />
        <Keyword f={f} text="$5\times$ too big · slopes $5\times$ too small" at={[80, 830]} appear={tSlope} out={tP2 - 20} s={T.floor + 4} />
        <Keyword f={f} text="Part 4: degrees → km" at={[80, 830]} appear={tP2} out={tOther - 20} s={T.floor + 4} />
      </Svg>
      <TeX s={String.raw`111.2\div4\approx27.8\ \text{km}`} x={980} y={770} size={56} c={C.ink} o={win(f, tH - 20, tThin - 15)} />

      {[[0.9997, 27.8], [0.9219, 25.6], [0.6639, 18.5], [0.2045, 5.7]].map(([c, w], i) =>
        <TeX key={i} s={String.raw`27.8\times${c.toFixed(4)}\approx${w.toFixed(1)}\ \text{km}`} x={980} y={840} size={52} c={C.gold}
          o={win(f, atW[i] - 20, i < 3 ? atW[i + 1] - 30 : tThin - 15)} />)}
      <TeX s={String.raw`27.8\ \text{km}\div5.7\ \text{km}\approx4.9`} x={980} y={770} size={56} c={C.neg} o={win(f, tForget, tOther - 15)} />

      {void [cellCentre]}
    </Scene>
  );
};

// ================================================================ s27 the area of a small patch (zoom-reveal; skip chip K4)
const S27: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27_area_patch");
  const chipA = AT(k, 4, "skip ahead"), chipEnd = chipA + 255;
  const tWhy = SS(k, 1), tAvg = SS(k, 2), tTake = SS(k, 5), tNS = SS(k, 6), tEW = SS(k, 7), tRight = SS(k, 8), tFlat = SS(k, 9), tRect = SS(k, 10), tMul = SS(k, 11),
    tColl = SS(k, 12), tShrink = SS(k, 13), tLimit = SS(k, 14), tDA = SS(k, 15), tDelta = SS(k, 16), tRad = SS(k, 17);
  const zOut = SE(k, 16);
  const cam = globePath([{ f: 0, lat: 30, lon: 0, dist: 4.6, pp: [520, 400] }, { f: tTake, lat: 32, lon: -2, dist: 4.6, pp: [520, 400] },
    { f: tTake + 45, lat: PHI, lon: BREST[1], dist: 1.35, pp: [560, 470] }, { f: zOut, lat: PHI, lon: BREST[1], dist: 1.35, pp: [560, 470] },
    { f: zOut + 45, lat: 30, lon: 0, dist: 4.6, pp: [520, 400] }, { f: LEN(k) + 10, lat: 30, lon: 0, dist: 4.6, pp: [520, 400] }], f);
  // K6 k6r1: as s10 (dist 4.6, centre y 400, picture h 790, the source line steps aside while the growing disc covers it)
  const zoom = clamp((4.6 - cam.dist) / (4.6 - 1.35), 0, 1);
  const dk = discOf(cam, GFULL), srcO = zoom >= 0.5 ? 1 : clamp((814 - (dk.c[1] + dk.r)) / 12, 0, 1);
  const la0 = PHI - 2.5, la1 = PHI + 2.5, lo0 = BREST[1] - 2.5, lo1 = BREST[1] + 2.5;
  const lift = 0.06 * prog(f, tFlat, tFlat + 40) * (1 - prog(f, tShrink, tShrink + 60));
  const G = globeG(cam, GFULL);
  const ring = (r: number): Pt[] => [...Array.from({ length: 11 }, (_, i) => G.pw(ll(la0, lo0 + 0.5 * i, r))), ...Array.from({ length: 11 }, (_, i) => G.pw(ll(la0 + 0.5 * i, lo1, r))),
    ...Array.from({ length: 11 }, (_, i) => G.pw(ll(la1, lo1 - 0.5 * i, r))), ...Array.from({ length: 11 }, (_, i) => G.pw(ll(la1 - 0.5 * i, lo0, r)))];
  const shrink = 1 - 0.75 * prog(f, tShrink, tShrink + 60);
  const sc = (p: Pt, c: Pt): Pt => [c[0] + (p[0] - c[0]) * shrink, c[1] + (p[1] - c[1]) * shrink];
  const cc = G.pw(ll(PHI, BREST[1], 1 + lift));
  const tile = ring(1 + lift).map((p) => sc(p, cc)), base = ring(1.001);
  const sW = sc(G.pw(ll(PHI, lo0, 1 + lift)), cc), sS = sc(G.pw(ll(la0, BREST[1], 1 + lift)), cc), sE = sc(G.pw(ll(PHI, lo1, 1 + lift)), cc);
  const cornerSW = sc(G.pw(ll(la0, lo0, 1 + lift)), cc), cornerSE = sc(G.pw(ll(la0, lo1, 1 + lift)), cc), cornerNW = sc(G.pw(ll(la1, lo0, 1 + lift)), cc);
  const u = (a: Pt, b: Pt): Pt => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / d, (b[1] - a[1]) / d]; };
  const eD = rep(EQ_S27, String.raw`\cos\varphi`, String.raw`\textcolor{${C.gold}}{\cos\varphi}`);
  const oP = fin(f, tTake + 30) * fout(f, zOut - 10);
  return (
    <Scene>
      <Earth cam={cam} box={GFULL} coast={0.5} borders={0.5}
        over={() => <g opacity={oP}>
          <path d={`${poly(base)}Z`} fill={C.gold} fillOpacity={0.25 * (1 - fin(f, tFlat))} stroke={C.gold} strokeWidth={4} opacity={1} />
          {lift > 0.001 ? <path d={`${poly(tile)}Z`} fill={C.gold} fillOpacity={0.45} stroke={C.gold} strokeWidth={3} /> : null}
          <Arrow p={cornerSW} q={cornerSE} color={C.second} w={7} head={24} o={fin(f, tFlat + 20)} />
          <Arrow p={cornerSW} q={cornerNW} color={C.second} w={7} head={24} o={fin(f, tFlat + 20)} />
          <path d={`M${cornerSW[0] + 26 * u(cornerSW, cornerSE)[0]} ${cornerSW[1] + 26 * u(cornerSW, cornerSE)[1]}l${26 * u(cornerSW, cornerNW)[0]} ${26 * u(cornerSW, cornerNW)[1]}l${-26 * u(cornerSW, cornerSE)[0]} ${-26 * u(cornerSW, cornerSE)[1]}`}
            fill="none" stroke={C.gold} strokeWidth={4} opacity={fin(f, tRight)} />
        </g>} />
      <GlobeFrame id="s27k" zoom={zoom} right={zoom} disc={discOf(cam, GFULL)} />
      {/* review 1 M4: the two side lengths are drawn AFTER the frame's darkening (they sat under it, near-invisible), at 68 px, a in ink and
          the step in orange, and they stay until "Collecting the pieces" */}
      <TeX s={String.raw`\textcolor{${RAD}}{a}\,\Delta\varphi`} x={XZ} y={470} size={T.calc} c={C.second} ax={0} o={oP * fin(f, tNS) * fout(f, tColl)} />
      <TeX s={String.raw`\textcolor{${RAD}}{a\cos\varphi}\,\Delta\lambda`} x={XZ} y={570} size={T.calc} c={C.second} ax={0} o={oP * fin(f, tEW) * fout(f, tColl)} />
      <SourceBelow text={SRC_G} pic={{ x: 60, y: 20, w: 960, h: 790 }} w={960} o={srcO} name="globe src" />
      <Svg>
        <CurvedLink f={f} from={[XZ - 14, 466]} to={[sE[0] + 10, sE[1]]} start={tNS + 6} end={tColl} bend={30} o={oP} />
        <CurvedLink f={f} from={[XZ - 14, 566]} to={[sS[0], sS[1] + 10]} start={tEW + 6} end={tColl} bend={-40} o={oP} />
        <Keyword f={f} text="areas" at={[XZ, 160]} appear={0} out={chipA - 20} />
        <Keyword f={f} text="why do we care?" at={[XZ, 470]} appear={tWhy} out={tTake - 20} />
        <Keyword f={f} text="to average over the Earth" at={[XZ, 560]} appear={tAvg} out={tTake - 20} s={T.floor + 4} />
        <Keyword f={f} text="almost a rectangle" at={[XZ, 160]} appear={Math.max(tFlat, chipEnd + 10)} out={tLimit - 15} />
        <Keyword f={f} text="$\Delta$: a small step" at={[XZ, 680]} appear={tDelta} />
        <Keyword f={f} text="$d$: a tiny step" at={[XZ, 755]} appear={AT(k, 16, "a small d")} />
        <Keyword f={f} text="angles in radians" at={[XZ, 830]} appear={tRad} />
      </Svg>
      <CalcStack f={f} x={XZ + 110} y={260} size={56} rows={[
        { lhs: String.raw`\Delta A`, rhs: String.raw`\approx(a\cos\varphi\,\Delta\lambda)(a\,\Delta\varphi)`, at: tMul, out: tLimit - 15 },
        { lhs: String.raw`\Delta A`, rhs: String.raw`\approx a^2\cos\varphi\,\Delta\varphi\,\Delta\lambda`, at: tColl, out: tLimit - 15 },
      ]} />
      <TeX s={eD} x={XZ} y={500} size={72} c={C.ink} o={fin(f, tDA)} />

      <SkipChip f={f} k={k} to={keepTime("s34_global_mean")} />
      {void [tRect, VIOLET]}
    </Scene>
  );
};

// ================================================================ s28 the area of one ERA5 box (3-D tiles)
const S28: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28_box_areas");
  const tRad = SS(k, 1), tA2 = SS(k, 2), tEq = AT(k, 3, "that's about") + 19, tCos = SS(k, 4), tK = AT(k, 5, "it's about"), tB = AT(k, 6, "is about five"), tL = AT(k, 7, "it's only about"),
    tChk = SS(k, 8), tEx = SS(k, 9);
  // still review k6r2: the tile row 80 px right (its left tags "27.8 km" / "wide:" started at x 20, left of the x 60 margin)
  const st = orbitCam({ az: -62, el: 38, dist: 260, target: [60, 0, 0], fov: 30 }, [600, 430]);
  const pr = projector(st, 1920, 1080);
  const tiles = [{ w: E5.wide[0], n: "equator", at: tEq, A: AR.flat[0] }, { w: E5.wide[1], n: "Khulna", at: tK, A: AR.flat[1] },
    { w: E5.wide[2], n: "Brest", at: tB, A: AR.flat[2] }, { w: E5.wide[3], n: "Longyearbyen", at: tL, A: AR.flat[3] }];
  let x0 = 0;
  const placed = tiles.map((t) => { const o = { ...t, x: x0 }; x0 += t.w + 10; return o; });
  const H = E5.tall;
  const P = (x: number, y: number, z = 0): Pt => pr.p([x, y, z] as V3);
  const quad = (x: number, w: number) => `M${P(x, 0)[0]} ${P(x, 0)[1]}L${P(x + w, 0)[0]} ${P(x + w, 0)[1]}L${P(x + w, H)[0]} ${P(x + w, H)[1]}L${P(x, H)[0]} ${P(x, H)[1]}Z`;
  // build 1: one more digit on screen, then the spoken rounding, so every product below is true to its last digit (A1/A6; DS24)
  const rows = [String.raw`0.25^\circ=0.25\times\dfrac{\pi}{180}`, String.raw`=0.0043633\approx0.00436\ \text{rad}`,
    String.raw`a^2=6371^2=40.59\times10^{6}`, String.raw`\approx40.6\times10^{6}\ \text{km}^2`];
  return (
    <Scene>
      <Svg>
        {placed.map((t) => { const o = fin(f, t.at);
          return <g key={t.n}>
            <path d={quad(t.x, t.w)} fill={C.gold} fillOpacity={0.12 + 0.5 * o} stroke={C.gold} strokeWidth={4} />
            <path d={`M${P(t.x, 0)[0]} ${P(t.x, 0)[1]}L${P(t.x + t.w, 0)[0]} ${P(t.x + t.w, 0)[1]}`} stroke={C.second} strokeWidth={6} />
            <path d={`M${P(t.x, 0)[0]} ${P(t.x, 0)[1]}L${P(t.x, H)[0]} ${P(t.x, H)[1]}`} stroke={C.second} strokeWidth={6} />
            <Lbl x={(P(t.x, 0)[0] + P(t.x + t.w, 0)[0]) / 2} y={(P(t.x, 0)[1] + P(t.x + t.w, 0)[1]) / 2 + 58} t={`${t.w.toFixed(1)} km`} c={C.second} s={T.floor} a="middle" />
            <Lbl x={(P(t.x + t.w / 2, 0)[0])} y={P(t.x + t.w / 2, 0)[1] + 118} t={t.n} c={C.key} s={T.floor} a="middle" />
          </g>; })}
        <Lbl x={P(0, H / 2)[0] - 40} y={P(0, H / 2)[1] + 6} t="27.8 km" c={C.second} s={T.floor} a="end" />
        {/* still review k6r2: the row label "km wide:" (it started at x −66) is gone; each width carries its "km" */}

        <g opacity={fin(f, tEx)}>
          <Lbl x={1100} y={790} t="exact: 513.1 km²" c={C.gold} s={T.key} />
          <Check x={1560} y={790} s={0.8} />
        </g>
        {/* K6 k6r1: the keyword and the box-area formula sit under the tiles (the paging rows slid up into the formula at y 140 and the
            keyword at y 400 sat on the rows) */}
        <Keyword f={f} text="area of one box?" at={[XC, 150]} appear={0} out={tRad - 12} />{/* review 1 S1 */}
        <Keyword f={f} text="every other box: $\times\cos\varphi$" at={[120, 710]} appear={tCos} out={tK - 15} s={T.floor + 4} />
      </Svg>
      <TeX s={EQ_S28} x={120} y={800} size={T.calc} c={C.ink} o={fin(f, 0)} />
      {/* calc audit S10: the voice rounds the inputs (40.6 million, 0.00436); the rows use the unrounded ones (772.8 ≈ 773) */}
      <TeX s={String.raw`\text{rows unrounded (rounded: }\approx772)`} x={120} y={710} size={44} c={C.muted} o={win(f, tEq + 15, tCos - 20)} />
      {/* p3a (review 2 Should/Cosmetic): "twice" is a square (no orphan "× 0.0043633" row); each place's cos φ is its own gold row on its word,
          the box area on "it's about" */}
      <CalcStack f={f} x={XC} y={230} size={52} maxLines={4} rows={[
        { lhs: "", rhs: rows[0], at: tRad },
        { lhs: "", rhs: rows[1], at: AT(k, 1, "is zero point"), cont: true, glow: pulse(f, AT(k, 1, "is zero point"), 30) },
        { lhs: "", rhs: rows[2], at: tA2 },
        { lhs: "", rhs: rows[3], at: AT(k, 2, "about forty"), cont: true },
        { lhs: "", rhs: String.raw`\Delta A_{\text{eq}}=40.59\times10^{6}\times0.0043633^2`, at: SS(k, 3), size: 46 },
        { lhs: "", rhs: String.raw`\approx772.8\approx773\ \text{km}^2`, at: tEq, cont: true, glow: pulse(f, tEq, 30) },
        { lhs: "", rhs: String.raw`\cos22.8^\circ\approx0.9219`, at: AT(k, 5, "zero point nine"), size: 46, glow: pulse(f, AT(k, 5, "zero point nine") + 8, 30) },
        { lhs: "", rhs: String.raw`\Delta A=772.8\times0.9219\approx712\ \text{km}^2`, at: tK, size: 46, cont: true },
        { lhs: "", rhs: String.raw`\cos48.4^\circ\approx0.6639`, at: AT(k, 6, "Brest's cosine phi"), size: 46, glow: pulse(f, AT(k, 6, "Brest's cosine phi") + 8, 30) },
        { lhs: "", rhs: String.raw`\Delta A=772.8\times0.6639\approx513\ \text{km}^2`, at: tB, size: 46, cont: true },
        { lhs: "", rhs: String.raw`\cos78.2^\circ\approx0.2045`, at: AT(k, 7, "much smaller cosine phi"), size: 46, glow: pulse(f, AT(k, 7, "much smaller cosine phi") + 8, 30) },
        { lhs: "", rhs: String.raw`\Delta A=772.8\times0.2045\approx158\ \text{km}^2`, at: tL, size: 46, cont: true },
      ]} />
    </Scene>
  );
};

// ================================================================ s29 a strip all round the Earth
const GB29 = { x: 60, y: 28, w: 960, h: 640 };
const S29: React.FC = () => {
  const f = useCurrentFrame(), k = K("s29_strip_round");
  const tQ = SS(k, 1), tWhy = SS(k, 2), tTrop = SS(k, 3), tBuild = SS(k, 4), tOne = SS(k, 5), tUn = AT(k, 6, "Cut it and unroll it"), tLen = SS(k, 7), tWid = SS(k, 8), tArea = SS(k, 9);
  const cam = globePath([{ f: 0, lat: 20, lon: 0, dist: 4.0 }, { f: LEN(k) + 10, lat: 20, lon: -6, dist: 4.0 }], f);
  const G = globeG(cam, GB29);
  const un = prog(f, tUn, tUn + 60);
  const N = 72, L = cam.lon;
  const pts = Array.from({ length: N + 1 }, (_, i) => { const lo = L + 180 - (360 * i) / N, q = ll(27.5, lo, 1.003), c = G.camPos;
    const vis = q[0] * (c[0] - q[0]) + q[1] * (c[1] - q[1]) + q[2] * (c[2] - q[2]) > 0; const s = G.pw(q); const t: Pt = [100 + (860 * i) / N, 760];
    return { p: [mix(s[0], t[0], un), mix(s[1], t[1], un)] as Pt, w: vis ? 1 : un }; });

  const parts = cutAt(EQ_S29, "=2");
  // p3a: the half-Earth for S7-S9 (cut along 36° E: the camera at 0…−6° E sees the face 36-42° from frontal, as camFace's 40°)
  const LC = 36, S27 = Math.sin(27.5 * D2R), C27 = Math.cos(27.5 * D2R);
  const cutO = prog(f, tLen - 10, tLen + 30);
  const pR = G.pw(facePt(merFace(LC), C27 / 2, S27));
  return (
    <Scene>
      {/* p3a (pass-2 review 1 M3, the user's "lines inside the Earth shown as inside"): no see-through Earth. On "Its length is the length of
          the parallel" (S7) the Earth is cut open along the 36° E meridian (the cross-product Part 2 half-Earth, seen 36-42° from the face):
          the spin axis is drawn ON the cut face, the strip's parallel (27.5° N) runs round it on the kept half, and its radius a cos φ runs
          ON the face from the axis to the rim, so it can never be read as a line across the Atlantic. The removed half of the parallel is a
          faint dashed construction line; its hidden back is dashed and dim. */}
      <Earth cam={cam} box={GB29} coast={0.45} cut={merCut(cutO, LC)} cutCoast
        three={<Axis3D L={1.25} r={0.006} color={C.local} o={fin(f, tLen)} />}
        over={(Gg) => {
          const P = (u: number, v: number) => Gg.pw(facePt(merFace(LC), u, v));
          const ring = Array.from({ length: 121 }, (_, i) => ll(27.5, LC + (360 * i) / 120, 1.003));
          const sv = splitVis(Gg, ring.filter((_, i) => i <= 60));
          const oL = fin(f, tLen);
          return <>
            <BandTint G={Gg} a={0} b={30} c={C.first} o={0.35 * fin(f, tQ) * fout(f, tOne)} />
            <BandTint G={Gg} a={25} b={30} c={C.gold} o={0.75 * fin(f, tOne) * (1 - un)} />
            <line x1={P(0, -1)[0]} y1={P(0, -1)[1]} x2={P(0, 1)[0]} y2={P(0, 1)[1]} stroke={C.local} strokeWidth={4} opacity={cutO * oL} />
            {sv.front.map((q, i) => <path key={i} d={poly(q)} fill="none" stroke={C.second} strokeWidth={5} opacity={oL} />)}
            {sv.back.map((q, i) => <path key={`b${i}`} d={poly(q)} fill="none" stroke={C.second} strokeWidth={3} strokeDasharray="8 8" opacity={0.4 * oL} />)}
            <path d={poly(ring.filter((_, i) => i >= 60).map((q) => Gg.pw(q)))} fill="none" stroke={C.muted} strokeWidth={2.5} strokeDasharray="6 10" opacity={0.55 * cutO * oL} />
            <line x1={P(0, S27)[0]} y1={P(0, S27)[1]} x2={P(C27, S27)[0]} y2={P(C27, S27)[1]} stroke={C.second} strokeWidth={7} strokeLinecap="round" opacity={cutO * oL} />
            <circle cx={P(0, S27)[0]} cy={P(0, S27)[1]} r={8} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={cutO * oL} />
          </>;
        }} />
      <TeX s={String.raw`a\cos\varphi`} x={pR[0]} y={pR[1] + 44} size={T.floor} c={C.second} ax={0.5} o={cutO * fin(f, tLen + 15)} halo />
      <SourceBelow text={SRC_G} pic={{ x: 60, y: 28, w: 960, h: 650 }} w={960} name="globe src" o={fout(f, tUn - 10)} />
      <Svg>
        {un > 0 ? pts.slice(1).map((q, i) => <line key={i} x1={pts[i].p[0]} y1={pts[i].p[1]} x2={q.p[0]} y2={q.p[1]} stroke={C.gold} strokeWidth={8 + 14 * un} strokeLinecap="butt"
          opacity={Math.min(q.w, pts[i].w)} />) : null}
        <Keyword f={f} text="area between 0° and $\varphi$?" at={[XC, 150]} appear={tQ} />
        <Keyword f={f} text="why care?" at={[XC, 250]} appear={tWhy} out={tBuild - 20} />

        <Keyword f={f} text="how much is tropical" at={[XC, 340]} appear={tTrop} s={T.floor + 4} />
        <Keyword f={f} text="thin strips" at={[XC, 250]} appear={tBuild} />
        <Keyword f={f} text="almost a rectangle" at={[XC, 440]} appear={tUn + 40} />
        <Keyword f={f} text="the Earth" at={[XC, 150]} appear={0} out={tQ - 20} />
      </Svg>
      {/* review 1 C3: the strip's edges, phi and phi + delta phi, at the right limb */}
      <TeX s={String.raw`\varphi`} x={G.p(25, L + 72)[0] + 18} y={G.p(25, L + 72)[1] + 18} size={T.floor} c={C.gold} ax={0} o={fin(f, tOne + 10) * (1 - un)} halo />
      <TeX s={String.raw`\varphi+\Delta\varphi`} x={G.p(30, L + 72)[0] + 18} y={G.p(30, L + 72)[1] - 26} size={T.floor} c={C.gold} ax={0} o={fin(f, tOne + 20) * (1 - un)} halo />
      <TeX s={String.raw`2\pi\,a\cos\varphi`} x={530} y={700} size={T.key} c={C.second} ax={0.5} o={fin(f, tLen + 30) * un} />
      <TeX s={String.raw`a\,\Delta\varphi`} x={980} y={760} size={T.key} c={C.gold} ax={0} o={fin(f, tWid) * un} />
      <TeX s={parts[0]} x={XC} y={600} size={50} c={C.ink} o={fin(f, tArea)} />
      <TeX s={`=2${parts[1]}`} x={XC + 40} y={700} size={60} c={C.ink} o={fin(f, AT(k, 9, "two pi, times the radius squared"))} />
    </Scene>
  );
};

// ================================================================ s30 the slope of sine (Part 2's shortcut)
const S30: React.FC = () => {
  const f = useCurrentFrame(), k = K("s30_slope_of_sine");
  const tStep = SS(k, 2), tSo = SS(k, 3), tCall = SS(k, 4), tChk = SS(k, 5), tTen = SS(k, 6), tMid = SS(k, 7), tProd = AT(k, 8, "about zero point one five eight"),
    tGrow = SS(k, 9), tToo = SS(k, 10), tStrip = SS(k, 11);
  const O: Pt = [180, 760], R = 620;
  const at = (deg: number, r = R): Pt => [O[0] + r * Math.cos(deg * D2R), O[1] - r * Math.sin(deg * D2R)];
  const a0 = 20, a1 = 30;
  const y20 = O[1] - R * BD.curve[20], y30 = O[1] - R * BD.curve[30];
  const xb = O[0] + R + 60;
  return (
    <Scene>
      <Svg>
        <path d={arcD(O, R, 0, 90, 90)} fill="none" stroke={C.grid} strokeWidth={4} />
        <line x1={O[0] - 20} y1={O[1]} x2={O[0] + R + 140} y2={O[1]} stroke={C.muted} strokeWidth={3} />
        <line x1={O[0]} y1={O[1] + 20} x2={O[0]} y2={O[1] - R - 30} stroke={C.muted} strokeWidth={3} />
        <Arrow p={O} q={at(a0)} color={RAD} w={8} head={30} o={fin(f, tChk)} />
        <Arrow p={O} q={at(a1)} color={RAD} w={8} head={30} o={fin(f, tChk)} />
        <line x1={O[0]} y1={O[1]} x2={at(25)[0]} y2={at(25)[1]} stroke={C.local} strokeWidth={3} strokeDasharray="10 8" opacity={fin(f, tMid)} />
        <path d={arcD(O, R, a0, a1)} fill="none" stroke={C.gold} strokeWidth={12} opacity={fin(f, tStep)} />
        <line x1={at(a0)[0]} y1={y20} x2={xb} y2={y20} stroke={C.second} strokeWidth={3} strokeDasharray="8 8" opacity={fin(f, tStep)} />
        <line x1={at(a1)[0]} y1={y30} x2={xb} y2={y30} stroke={C.second} strokeWidth={3} strokeDasharray="8 8" opacity={fin(f, tStep)} />
        <line x1={xb} y1={y20} x2={xb} y2={y30} stroke={C.second} strokeWidth={14} opacity={fin(f, tStep + 20)} />
        <path d={arcD(O, 120, 0, 25)} fill="none" stroke={C.local} strokeWidth={5} opacity={fin(f, tMid)} />
        <Lbl x={O[0] + 140} y={O[1] - 30} t="25°" c={C.local} s={T.floor} o={fin(f, tMid)} />
        <Lbl x={at(a0)[0] + 14} y={at(a0)[1] + 34} t="20°" c={C.key} s={T.floor} o={fin(f, tChk)} />
        <Lbl x={at(a1)[0] + 10} y={at(a1)[1] - 34} t="30°" c={C.key} s={T.floor} o={fin(f, tChk)} />
        <Keyword f={f} text="a shortcut" at={[XC, 150]} appear={XIN} out={tSo - 20} />{/* p3b: after s29's keyword */}
        <Check x={1780} y={730} s={0.8} o={fin(f, tToo)} />
      </Svg>
      <TeX s={String.raw`\Delta\varphi`} x={at(25, R + 30)[0]} y={at(25, R + 30)[1]} size={T.key} c={C.gold} ax={0} o={fin(f, tStep)} halo />
      {/* K6 k6r1: right of the orange step bar (above it, it sat on the "30°" tag and the arrow tip) */}
      {/* p3b (k6p3a f70799): under the foot of the step bar (x ≈ 854-1053, y ≈ 583-637), clear of the "20°" tag and of the rows' left sides */}
      <TeX s={String.raw`\Delta(\sin\varphi)`} x={xb - 6} y={y20 + 62} size={T.key} c={C.second} ax={0} o={fin(f, tCall)} halo />
      <TeX s={EQ_S30} x={XC} y={160} size={T.calc} c={C.ink} o={fin(f, tSo)} />
      {/* remake 2026-11-07 (R16): Part 2's slope of sine on "But Part 2 gave us a shortcut", until the check's rows come in */}
      <Recall f={f} tex={String.raw`\dfrac{d}{d\theta}\sin\theta=\cos\theta`} name="slope of sine" part={2} x={XC} y={330} size={50} appear={SS(k, 1)} out={tTen - 12} />
      <CalcStack f={f} x={XC + 40} y={260} size={52} maxLines={4} rows={[
        { lhs: String.raw`\Delta\varphi`, rhs: String.raw`=10\times\dfrac{\pi}{180}\approx0.1745\ \text{rad}`, at: tTen, glow: pulse(f, AT(k, 6, "zero point one"), 30) },   // still review: the conversion's arithmetic (A1)
        { lhs: String.raw`\cos25^\circ`, rhs: String.raw`\approx0.906`, at: tMid + 30, glow: pulse(f, AT(k, 7, "zero point nine"), 30) },
        { lhs: String.raw`\cos\varphi\,\Delta\varphi`, rhs: String.raw`=0.906\times0.1745\approx0.158`, at: tProd - 20, ul: tToo, glow: pulse(f, AT(k, 8, "about zero point"), 30) },   // p3a: a left side (stand-alone frame)
        { lhs: "", rhs: String.raw`\Delta(\sin\varphi)=\sin30^\circ-\sin20^\circ`, at: tGrow + 40, size: 46 },
        { lhs: "", rhs: String.raw`=0.5-0.342=0.158`, at: AT(k, 10, "zero point one five eight"), ul: tToo, cont: true },
      ]} />
      <TeX s={String.raw`\text{strip}\approx2\pi a^2\,\Delta(\sin\varphi)`} x={XC} y={810} size={T.calc} c={C.ink} o={fin(f, tStrip)} />
    </Scene>
  );
};

// ================================================================ s31 adding the strips: integration
const S31: React.FC = () => {
  const f = useCurrentFrame(), k = K("s31_adding_strips");
  const tStack = SS(k, 0), tStair = SS(k, 1), tAdd = SS(k, 2), tZero = SS(k, 3), tSum = SS(k, 4), tBand = SS(k, 5), tChk = SS(k, 6), tSteps = SS(k, 7) + 15,
    tFive = SS(k, 8), tName = SS(k, 9), tS = SS(k, 10), tPrime = SS(k, 11), tInt = SS(k, 12);
  const cam = globePath([{ f: 0, lat: 22, lon: 0, dist: 3.4 }, { f: LEN(k) + 10, lat: 22, lon: -8, dist: 3.4 }], f);
  const A = { x: 1140, y: 140, w: 640, h: 380 };
  const X = (d: number) => A.x + (d / 90) * A.w, Y = (s: number) => A.y + A.h - s * A.h;
  const curve = poly((BD.curve as number[]).map((s, d) => [X(d), Y(s)] as Pt));
  const width = f < tName ? 10 : f < tS ? 5 : f < tPrime ? 2 : 1;
  const upto = f < tName ? 30 : 90;
  const stairs = (() => { let d = ""; for (let a = 0; a < upto; a += width) { const s0 = BD.curve[a], s1 = BD.curve[Math.min(90, a + width)];
    d += `M${X(a)} ${Y(s0)}L${X(a + width)} ${Y(s0)}L${X(a + width)} ${Y(s1)}`; } return d; })();
  const oS = (i: number) => fin(f, tSteps + i * 25);
  const eqs = cutAt(EQ_S31, String.raw`,\qquad `);
  return (
    <Scene>
      <Earth cam={cam} coast={0.45}
        over={(Gg) => <>
          {[0, 1, 2].map((i) => <BandTint key={i} G={Gg} a={10 * i} b={10 * i + 10} c={i % 2 ? C.gold : C.first} o={0.5 * fin(f, tStack + 20 * i) * (f >= tChk ? (0.4 + 0.6 * oS(i)) : 1)} />)}
          <path d={parPath(Gg, 30)} fill="none" stroke={C.key} strokeWidth={3} opacity={fin(f, tStack)} />
        </>} />
      <GSrc />
      <Svg>
        <line x1={A.x} y1={A.y + A.h} x2={A.x + A.w + 10} y2={A.y + A.h} stroke={C.muted} strokeWidth={3} />
        <line x1={A.x} y1={A.y - 10} x2={A.x} y2={A.y + A.h} stroke={C.muted} strokeWidth={3} />
        {/* K6 k6r1: the x ticks 8 px lower and the y tick "0" 12 px higher (the two origin labels touched) */}
        {[0, 30, 60, 90].map((d) => <Lbl key={d} x={X(d)} y={A.y + A.h + 44} t={`${d}°`} c={C.muted} s={48} a="middle" b={false} />)}
        {[0, 0.5, 1].map((s) => <Lbl key={s} x={A.x - 14} y={Y(s) - (s === 0 ? 12 : 0)} t={`${s}`} c={C.muted} s={48} a="end" b={false} />)}
        <Lbl x={A.x + 14} y={A.y - 30} t="$\sin\varphi$" c={C.muted} s={T.floor} b={false} />
        <path d={curve} fill="none" stroke={C.second} strokeWidth={5} opacity={0.8} />
        <path d={stairs} fill="none" stroke={C.gold} strokeWidth={width === 10 ? 7 : 4} opacity={fin(f, tStair)} />
        {[0, 1, 2].map((i) => <Lbl key={i} x={X(10 * i + 10) + 12} y={(Y(BD.curve[10 * i]) + Y(BD.curve[10 * i + 10])) / 2} t={BD.steps[i].toFixed(3)} c={C.gold} s={T.floor}
          o={oS(i) * fout(f, tName - 10)} />)}
        <Keyword f={f} text="stack the strips" at={[XC, 620]} appear={0} out={tAdd - 20} />
        <Keyword f={f} text="steps add up: top − bottom" at={[XC, 620]} appear={tAdd} out={tBand - 20} s={T.floor + 4} />
        <Keyword f={f} text="integration" at={[XC, 820]} appear={tName} out={tPrime - 20} />
      </Svg>
      {/* Part 1 lessons C1: φ′ set in KaTeX (a prime in the sans label is not maths) */}
      <TeX s={String.raw`\varphi'\text{: latitude of each strip}`} x={XC + 104} y={830} size={T.floor} c={C.key} o={fin(f, tPrime)} />{/* k6r2: right of the integral's "sum" */}
      <TeX s={eqs[1]} x={XC} y={665} size={T.eq} c={C.ink} o={fin(f, tBand) * fout(f, SS(k, 7) - 12)} />
      <CalcStack f={f} x={XC} y={600} size={44} maxLines={4} rows={[
        { lhs: "", rhs: String.raw`\sin10^\circ\approx0.174,\ \ \sin20^\circ\approx0.342`, at: SS(k, 7), out: SS(k, 8) - 8, glow: pulse(f, SS(k, 7) + 8, 30) },   // p3a: inputs, gold
        { lhs: "", rhs: String.raw`0^\circ\to10^\circ:\ \ 0.174-0=0.174`, at: SS(k, 7) + 15, out: SS(k, 8) - 8 },
        { lhs: "", rhs: String.raw`10^\circ\to20^\circ:\ \ 0.342-0.174=0.168`, at: SS(k, 7) + 40, out: SS(k, 8) - 8 },
        { lhs: "", rhs: String.raw`20^\circ\to30^\circ:\ \ 0.500-0.342=0.158`, at: SS(k, 7) + 65, out: SS(k, 8) - 8 },
      ]} />
      <TeX s={String.raw`0.174+0.168+0.158`} x={XC} y={730} size={52} c={C.ink} o={win(f, SS(k, 8), tName - 22)} />
      <TeX s={String.raw`=0.500=\sin30^\circ`} x={XC + 60} y={800} size={52} c={C.ink} o={win(f, AT(k, 8, "zero point five"), tName - 22)} glow={pulse(f, AT(k, 8, "zero point five"), 30)} />
      <Layered parts={[{ t: String.raw`\int_0^{\varphi}`, u: { w: String.raw`\text{sum}`, c: C.gold } }, { t: String.raw`\cos\varphi'` },
        { t: String.raw`\,d\varphi'`, u: { w: String.raw`\text{tiny step}`, c: C.gold } }, { t: String.raw`=\sin\varphi` }]} x={XC} y={705} size={64}
        layers={[{ t: "all", o: fin(f, tInt) }, { t: [], u: [0, 2], o: fin(f, tInt + 25) }]} />
      {void [tZero, tSum, tFive, SE, eqs[0]]}
    </Scene>
  );
};

// ================================================================ s32 the share sin φ: half the Earth within 30° of the equator
const S32: React.FC = () => {
  const f = useCurrentFrame(), k = K("s32_band_fraction");
  const tUp = SS(k, 1), tSin90 = SS(k, 2), t255 = AT(k, 3, "two hundred"), tWhole = SS(k, 4), tShare = SS(k, 5), tHalf = SS(k, 6), tHalfNH = SS(k, 7), tSouth = SS(k, 8),
    tBoth = SS(k, 9), tBrest = SS(k, 10), tTrop = SS(k, 11);
  // calc audit M4: on "three quarters" the tint cross-fades from 30° S-30° N to 0°-48.4° N (the share south of Brest)
  const tQ = AT(k, 10, "three quarters"), qx = fin(f, tQ, 15);
  const cam = globePath([{ f: 0, lat: 18, lon: 20, dist: 3.4 }, { f: LEN(k) + 10, lat: 22, lon: 12, dist: 3.4 }], f);
  const top = 90 * prog(f, tUp, tSin90 + 30);
  const phase2 = f >= tHalf;
  const G = globeG(cam);
  return (
    <Scene>
      <Earth cam={cam} coast={0.45}
        over={(Gg) => <>
          {!phase2 ? <BandTint G={Gg} a={0} b={top} c={C.first} o={0.45} /> : null}
          {!phase2 ? <BandTint G={Gg} a={-90 * prog(f, tWhole, tWhole + 40)} b={0} c={C.first} o={0.45 * fin(f, tWhole)} /> : null}
          {phase2 ? <BandTint G={Gg} a={f >= tBoth ? -30 : 0} b={30} c={C.first} o={0.5 * (1 - qx)} /> : null}
          {phase2 ? <BandTint G={Gg} a={30} b={90} c={C.local} o={0.35 * (1 - qx)} /> : null}
          {phase2 && f >= tBoth ? <BandTint G={Gg} a={-90} b={-30} c={C.local} o={0.35 * (1 - qx)} /> : null}
          <BandTint G={Gg} a={0} b={PHI} c={C.first} o={0.5 * qx} />
          <BandTint G={Gg} a={PHI} b={90} c={C.local} o={0.35 * qx} />
          <path d={parPath(Gg, PHI)} fill="none" stroke={C.second} strokeWidth={6} opacity={fin(f, tBrest)} />
          {gdot(Gg, PHI, BREST[1], C.gold, 10, fin(f, tBrest))}
        </>} />
      <GSrc />
      <Svg>
        <g data-lc-maplabel="1">
          <Lbl x={G.p(15, cam.lon)[0]} y={G.p(15, cam.lon)[1]} t="½" c={C.key} s={T.key} a="middle" o={win(f, tHalfNH, tBoth)} />
          <Lbl x={G.p(55, cam.lon)[0]} y={G.p(55, cam.lon)[1]} t="½" c={C.key} s={T.key} a="middle" o={win(f, tHalfNH, tBoth)} />
        </g>
        <Keyword f={f} text="check the formula" at={[XC, 150]} appear={0} out={t255 - 60} />
        {/* K6 k6r1: the rows start at y 210 with 2 lines (3 reached the share formula, the top one sat on "check the formula"); the formula,
            the sin 30° / sin 48.4° lines move down and the last two keywords move to the top row */}
        <Keyword f={f} text="half of the Earth" at={[XC, 150]} appear={tBoth + 20} out={tQ - 16} />
        <Keyword f={f} text="¾ of the northern hemisphere" at={[XC, 150]} appear={tQ + 4} out={tTrop - 20} s={46} />
        <g data-lc-maplabel="1"><Lbl x={G.p(24, cam.lon)[0]} y={G.p(24, cam.lon)[1]} t="¾" c={C.key} s={T.key} a="middle" o={win(f, tQ + 4, tTrop - 10)} /></g>
        <Keyword f={f} text="tropics: huge · polar caps: small" at={[XC, 150]} appear={tTrop} s={46} />
      </Svg>
      <CalcStack f={f} x={XC + 40} y={210} size={52} maxLines={2} rows={[
        { lhs: String.raw`\sin90^\circ`, rhs: "=1", at: AT(k, 2, "is one") },
        { lhs: String.raw`a^2`, rhs: String.raw`=6371^2\approx40.6\times10^{6}\ \text{km}^2`, at: SS(k, 3) },
        { lhs: String.raw`2\pi a^2`, rhs: String.raw`\approx2\pi\times40.6\times10^{6}`, at: t255 - 20 },
        { lhs: "", rhs: String.raw`\approx255\times10^{6}\ \text{km}^2`, at: t255 + 20, cont: true },
        { lhs: String.raw`4\pi a^2`, rhs: String.raw`=2\times255\times10^{6}`, at: AT(k, 4, "twice that") },
        { lhs: "", rhs: String.raw`=510\times10^{6}\ \text{km}^2`, at: AT(k, 4, "about five hundred") - 20, cont: true },
      ]} />
      <TeX s={EQ_S32} x={XC} y={610} size={T.eq} c={C.ink} o={fin(f, tShare)} />
      <TeX s={String.raw`\sin30^\circ=\dfrac12`} x={XC} y={770} size={60} c={C.ink} o={win(f, tHalf, tBrest - 22)} />
      <TeX s={String.raw`\sin48.4^\circ\approx0.7478\approx\dfrac34`} x={XC} y={770} size={60} c={C.second} o={fin(f, AT(k, 10, "zero point seven four"))} />
      {void [tSouth]}
    </Scene>
  );
};

// ================================================================ s33 Archimedes' cylinder
const S33: React.FC = () => {
  const f = useCurrentFrame(), k = K("s33_archimedes");
  const tWrap = SS(k, 1), tPush = SS(k, 2), tH = SS(k, 3), tZ = SS(k, 4), tRoll = SS(k, 5), tLen = SS(k, 6), tSame = SS(k, 7), tWhy = SS(k, 8), tShort = SS(k, 9), tWide = SS(k, 10),
    tCancel = SS(k, 11), tEq = SS(k, 12);
  const cam = spinPath([{ f: 0, lat: 15, lon: 0, dist: 4.4 }, { f: LEN(k) + 10, lat: 15, lon: 40, dist: 4.4, spin: 0.2 }], f);   // review 1 S10: the whole cylinder
  const G = globeG(cam);
  const L = cam.lon, sp = Math.sin(PHI * D2R);
  const cyl = (lo: number, y: number): V3 => [Math.sin(lo * D2R), y, Math.cos(lo * D2R)];
  const front = (lo: number) => Math.cos((lo - L) * D2R) > 0;
  const rim = (y: number) => { const pf: Pt[] = [], pb: Pt[] = []; for (let lo = L - 90; lo <= L + 90; lo += 3) pf.push(G.pw(cyl(lo, y))); for (let lo = L + 90; lo <= L + 270; lo += 3) pb.push(G.pw(cyl(lo, y))); return { pf, pb }; };
  const band = [...Array.from({ length: 61 }, (_, i) => G.pw(cyl(L - 90 + 3 * i, 0))), ...Array.from({ length: 61 }, (_, i) => G.pw(cyl(L + 90 - 3 * i, sp)))];
  const s70a = Math.sin(58 * D2R), s70b = Math.sin(62 * D2R);   // review 1 S10: the strip pair at about 60°
  const strip = [...Array.from({ length: 61 }, (_, i) => G.pw(cyl(L - 90 + 3 * i, s70a))), ...Array.from({ length: 61 }, (_, i) => G.pw(cyl(L + 90 - 3 * i, s70b)))];
  const br0 = G.pw(cyl(L + 92, 0)), br1 = G.pw(cyl(L + 92, sp));
  const cylO = fin(f, tWrap);
  return (
    <Scene>
      <Earth cam={cam} coast={0.45}
        over={(Gg) => <>
          <BandTint G={Gg} a={0} b={PHI} c={C.first} o={0.45 * fin(f, tPush)} />
          <BandTint G={Gg} a={58} b={62} c={C.gold} o={0.8 * win(f, tShort, tEq)} />
        </>} />
      <Svg>
        <g opacity={cylO}>
          {[-1.15, 1.15].map((y) => { const r = rim(y); return <g key={y}><path d={poly(r.pf)} fill="none" stroke={C.local} strokeWidth={3} /><path d={poly(r.pb)} fill="none" stroke={C.local} strokeWidth={2} strokeDasharray="8 8" opacity={0.6} /></g>; })}
          {Array.from({ length: 12 }, (_, i) => { const lo = i * 30; const a = G.pw(cyl(lo, -1.15)), b = G.pw(cyl(lo, 1.15));
            return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.local} strokeWidth={front(lo) ? 2.5 : 1.5} strokeDasharray={front(lo) ? undefined : "8 8"} opacity={front(lo) ? 0.8 : 0.4} />; })}
          <path d={`${poly(band)}Z`} fill={C.first} fillOpacity={0.3 * fin(f, tH)} stroke={C.first} strokeWidth={3} opacity={fin(f, tH)} />
          <path d={`${poly(strip)}Z`} fill={C.gold} fillOpacity={0.5} stroke={C.gold} strokeWidth={2} opacity={win(f, tShort, tEq)} />
          {[10, 25, 40].map((la) => [-35, 0, 35].map((d) => { const lo = L + d; const a = G.pw(ll(la, lo, 1.003)), b = G.pw(cyl(lo, Math.sin(la * D2R)));
            return <Arrow key={`${la}${d}`} p={a} q={b} color={C.first} w={4} head={16} o={win(f, tPush + 20, tH + 30)} />; }))}
          <line x1={br0[0] + 30} y1={br0[1]} x2={br1[0] + 30} y2={br1[1]} stroke={C.gold} strokeWidth={5} opacity={fin(f, tH)} />
          <line x1={br0[0] + 18} y1={br0[1]} x2={br0[0] + 42} y2={br0[1]} stroke={C.gold} strokeWidth={5} opacity={fin(f, tH)} />
          <line x1={br1[0] + 18} y1={br1[1]} x2={br1[0] + 42} y2={br1[1]} stroke={C.gold} strokeWidth={5} opacity={fin(f, tH)} />
        </g>
        <SideCallout f={f} lines={[String.raw`height $a\sin\varphi=z$`]} at={[XC + 4, 160]} appear={tZ} target={[(br0[0] + br1[0]) / 2 + 36, (br0[1] + br1[1]) / 2]} bend={30} out={tWhy - 15} />
        <g opacity={win(f, tRoll, tWhy - 15)}>
          <rect x={1110} y={300} width={640} height={130} fill={C.first} fillOpacity={0.3} stroke={C.first} strokeWidth={4} />
        </g>
        <Keyword f={f} text="Archimedes" at={[XC, 160]} appear={0} out={tZ - 20} />
        <Keyword f={f} text="shorter round: $\times\cos\varphi$" at={[XC, 300]} appear={tShort} s={T.floor + 4} />
        <Keyword f={f} text="wider along the surface: $\times\,1/\cos\varphi$" at={[XC, 380]} appear={tWide} s={T.floor} />
        <Keyword f={f} text="they cancel" at={[XC, 470]} appear={tCancel} />
        <g data-lc-maplabel="1">
          <Lbl x={G.pw(cyl(L + 90, (s70a + s70b) / 2))[0] + 44} y={G.pw(cyl(L + 90, (s70a + s70b) / 2))[1] - 30} t="round: $\times\cos\varphi$" c={C.gold} s={T.floor}
            o={win(f, tShort + 10, tEq)} />
          <Lbl x={G.pw(cyl(L + 90, (s70a + s70b) / 2))[0] + 44} y={G.pw(cyl(L + 90, (s70a + s70b) / 2))[1] + 30} t="width: $\times\,1/\cos\varphi$" c={C.gold} s={T.floor}
            o={win(f, tWide + 10, tEq)} />
        </g>
        <Keyword f={f} text="equal heights, equal areas" at={[XC, 760]} appear={tEq} />
      </Svg>
      <TeX s={String.raw`\text{length }2\pi a`} x={1430} y={470} size={52} c={C.ink} ax={0.5} o={win(f, tLen, tWhy - 15)} />

      <TeX s={String.raw`\text{height }a\sin\varphi`} x={1430} y={250} size={52} c={C.ink} ax={0.5} o={win(f, tLen + 30, tWhy - 15)} />
      <TeX s={EQ_S33} x={XC} y={590} size={60} c={C.ink} o={fin(f, tSame)} />
      <TeX s={String.raw`A_{0\to\varphi}=2\pi a^2\sin\varphi`} x={XC} y={680} size={52} c={C.muted} o={fin(f, tSame + 30)} />
      <Svg><Check x={1700} y={680} s={0.7} o={fin(f, tSame + 50)} /></Svg>
    </Scene>
  );
};

// ================================================================ s34 the cos φ weighting of a global mean (keep line K4)
const MB = { x: 90, y: 220, w: 900, h: Math.round(900 * TM.ee_ext[1] / TM.ee_ext[0]) };
/** Equal Earth (Šavrič, Patterson & Jenny 2018; the projection of the ERA5 map, data build DS29): a parallel is a straight line. Its
 * height and half-width at latitude `lat`, normalised like coast_ee (y by the pole's height, x by the equator's half-width). */
const EE = { A1: 1.340264, A2: -0.081106, A3: 0.000893, A4: 0.003796 };
const eeTh = (lat: number) => Math.asin((Math.sqrt(3) / 2) * Math.sin(lat * D2R));
const eeYr = (th: number) => EE.A1 * th + EE.A2 * th ** 3 + EE.A3 * th ** 7 + EE.A4 * th ** 9;
const eeXr = (th: number) => Math.cos(th) / (EE.A1 + 3 * EE.A2 * th ** 2 + 7 * EE.A3 * th ** 6 + 9 * EE.A4 * th ** 8);
const eeY = (lat: number) => eeYr(eeTh(lat)) / eeYr(eeTh(90)), eeX = (lat: number) => eeXr(eeTh(lat)) / eeXr(0);
const S34: React.FC = () => {
  const f = useCurrentFrame(), k = K("s34_global_mean");
  const g0 = keepGone(k, 1);
  // fix loop 1 (review 1 S8): S11-S13 explain T̄, Σ and j (new sentences); the real-data sentences moved +3
  const tHere = SS(k, 2), tPlanet = SS(k, 3), tEq = SS(k, 4), tN60 = SS(k, 5), tPlain = SS(k, 6), tHalf = SS(k, 7), tW = SS(k, 8), t20 = SS(k, 9), tWhy = SS(k, 10),
    tTbar = AT(k, 11, "T bar"), tSig = AT(k, 12, "sigma"), tSum = AT(k, 13, "the sum of cosine phi"), tReal = AT(k, 14, "real data"),
    tP = AT(k, 15, "about seven point one"), tWt = AT(k, 16, "about sixteen point three"), tCold = SS(k, 17), tHow = SS(k, 18);
  // review 1 M1 / calc audit M1: no empty frame. The keep picture stays through "Here's where this matters" (S2), with the goal keyword;
  // both boxes come in as outlines on the first frame of S3 (after the keep picture's 10-frame fade) and fill on their own sentences
  const tBox = tPlanet + 10;
  const oToy = fin(f, tBox) * fout(f, tReal - 10), oMap = fin(f, tReal, 15);
  const tile = (x: number, y: number, w: number, h: number) => `M${x} ${y + h}L${x + w} ${y + h}L${x + w + 60} ${y}L${x + 60} ${y}Z`;
  const cx = MB.x + MB.w / 2, cy = MB.y + MB.h / 2;
  const coast = (TM.coast_ee as number[][]).map((ln) => poly(Array.from({ length: ln.length / 2 }, (_, i) => [cx + ln[2 * i] * MB.w / 2, cy - ln[2 * i + 1] * MB.h / 2] as Pt))).join("");
  const thermoL = (t: number) => clamp((t + 10) / 45, 0, 1);
  const y60 = eeY(60) * MB.h / 2, x60 = eeX(60) * MB.w / 2;
  const oCaps = fin(f, tCold) * oMap;
  return (
    <Scene>
      <Svg>
        <g opacity={oToy}>
          <path d={tile(150, 560, 400, 200)} fill={C.gold} fillOpacity={0.35 * fin(f, tEq)} stroke={C.gold} strokeWidth={4} opacity={Math.max(0.6, fin(f, tEq))} />
          <path d={tile(650, 300, 200, 200)} fill={C.gold} fillOpacity={0.35 * fin(f, tN60)} stroke={C.gold} strokeWidth={4} opacity={Math.max(0.6, fin(f, tN60))} />
          {/* review 1 M1/S7: each name on its own words; the areas on "one half" */}
          <Lbl x={300} y={800} t="equator" c={C.key} s={T.floor} a="middle" o={fin(f, AT(k, 4, "equator"))} />
          <Lbl x={410} y={800} t="· area 1" c={C.key} s={T.floor} o={fin(f, AT(k, 7, "one half"))} />
          <Lbl x={720} y={540} t="60° N" c={C.key} s={T.floor} a="middle" o={fin(f, AT(k, 5, "sixty degrees north"))} />
          <Lbl x={795} y={540} t="· area ½" c={C.key} s={T.floor} o={fin(f, AT(k, 7, "one half"))} />
          <Thermo x={380} y={600} level={thermoL(30)} c={C.neg} o={fin(f, tEq + 20)} />
          <Thermo x={780} y={340} level={thermoL(0)} c={C.first} o={fin(f, tN60 + 20)} />
          <Lbl x={430} y={510} t="30 °C" c={C.key} s={T.key} o={fin(f, tEq + 20)} />
          <Lbl x={830} y={250} t="0 °C" c={C.key} s={T.key} o={fin(f, tN60 + 20)} />
        </g>
        <g opacity={oMap}>
          {/* p3a (house rule 2026-11-08, review 2 Should): the data figure's title: what it shows and when */}
          <Lbl x={MB.x} y={MB.y - 48} t="2-m air temperature · September 2026 mean" c={C.ink} s={T.floor} />
          <rect x={MB.x} y={MB.y} width={MB.w} height={MB.h} fill="none" stroke="none" />
          <image href={IMGS.t2mEE} x={MB.x} y={MB.y} width={MB.w} height={MB.h} preserveAspectRatio="none" />
          <path d={coast} fill="none" stroke={C.bg} strokeOpacity={0.7} strokeWidth={1.6} />
          {/* review 1 S7: the colour range is clipped below −60 °C (Antarctic interior): an end arrow, ticks at 52 px */}
          <ColourBar x={1130} y={190} w={560} lut={LUT_T} lo={-60} hi={40} unit="°C" title="2-m air temperature" lowArrow tickS={52}
            ticks={[{ v: -60, t: "−60" }, { v: -20, t: "−20" }, { v: 0, t: "0" }, { v: 20, t: "20" }, { v: 40, t: "40" }]} />
        </g>
        {/* review 1 S7: BOTH polar caps (60-90° N and S) are outlined on the map; the strip of thin boxes is labelled for both */}
        <g opacity={oCaps}>
          {[-1, 1].map((sg) => <line key={sg} x1={cx - x60} y1={cy - sg * y60} x2={cx + x60} y2={cy - sg * y60} stroke={C.ink} strokeWidth={4} strokeDasharray="14 9" />)}
          <image href={IMGS.t2mPolar} x={1100} y={580} width={720} height={60} preserveAspectRatio="none" opacity={0.4} />
          {Array.from({ length: 61 }, (_, i) => <line key={i} x1={1100 + 12 * i} y1={580} x2={1100 + 12 * i} y2={640} stroke={C.ink} strokeOpacity={0.35} strokeWidth={1} />)}
          <rect x={1100} y={580} width={720} height={60} fill="none" stroke={C.muted} strokeWidth={2} />
          <Lbl x={1100} y={685} t="60–90° N and S: many thin boxes" c={C.muted} s={T.floor} b={false} />
        </g>
        <Keyword f={f} text="global average?" at={[XC, 400]} appear={tHere} out={tPlain - 12} />
        <Keyword f={f} text="two boxes · same size in degrees" at={[XC, 480]} appear={tPlanet} out={tPlain - 12} s={T.floor} />
        <Keyword f={f} text="plain average" at={[XC, 360]} appear={tP} c={C.local} o={oMap} />
        <Keyword f={f} text="weighted by $\cos\varphi$" at={[XC, 470]} appear={tWt} c={C.first} o={oMap} />
        <Keyword f={f} text="$\cos\varphi$ weighting" at={[XC, 830]} appear={tHow} />
        {/* review 1 S8: the new symbols named on their words */}
        <Lbl x={XC} y={680} t="$\overline{T}$: the average temperature" c={C.key} s={T.floor + 4} o={win(f, tTbar, tReal - 10)} />
        <Lbl x={XC} y={745} t="$\Sigma_j$: add up over all boxes $j$" c={C.key} s={T.floor + 4} o={win(f, tSig, tReal - 10)} />
        <Lbl x={XC} y={810} t="$\cos\varphi_j$: the weight of box $j$" c={C.key} s={T.floor + 4} o={win(f, tSum, tReal - 10)} />
      </Svg>
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 2-m temperature · September 2026 monthly mean · 1° grid" pic={MB} w={900} o={oMap} name="s34 src" />
      <TeX s={String.raw`\approx7.1\ ^\circ\text{C}`} x={1594} y={360} size={54} c={C.local} o={fin(f, tP) * oMap} glow={pulse(f, tP, 30)} />
      <TeX s={String.raw`\approx16.3\ ^\circ\text{C}`} x={1594} y={470} size={54} c={C.first} o={fin(f, tWt) * oMap} glow={pulse(f, tWt, 30)} />
      <TeX s={String.raw`16.3-7.1=9.2\ ^\circ\text{C}\ \text{too cold}`} x={XC} y={760} size={50} c={C.neg} o={fin(f, AT(k, 17, "more than nine")) * oMap} />
      <CalcStack f={f} x={XC} y={230} size={50} maxLines={4} o={fout(f, tWhy - 20)} rows={[
        { lhs: "", rhs: String.raw`\text{plain: }(30+0)\div2=15\ ^\circ\text{C}`, at: tPlain },
        { lhs: "", rhs: String.raw`\text{weights: }\cos0^\circ=1,\ \cos60^\circ=\dfrac12`, at: tHalf + 20 },
        { lhs: "", rhs: String.raw`\text{weighted: }(30\times1+0\times\dfrac12)`, at: tW + 30, size: 46 },
        // still review k6r2 (A1): the divisor is the sum of the weights, 1 + ½ = 1.5, and the numerator 30; then 30 ÷ 1.5 on "That's twenty"
        { lhs: "", rhs: String.raw`\div(1+\dfrac12)`, at: AT(k, 8, "and divides"), size: 46, cont: true },
        { lhs: "", rhs: String.raw`\text{weighted}=30\div1.5=20\ ^\circ\text{C}`, at: SS(k, 9), size: 46, glow: pulse(f, SS(k, 9) + 8, 30) },
      ]} />
      {/* k6r3: the toy rows (all worked by "That's twenty") leave before the general formula comes in on the next sentence, in their place */}
      <TeX s={EQ_S34} x={XC} y={500} size={T.eq} c={C.ink} o={fin(f, tWhy) * fout(f, tReal - 10)} />
      <KeepLine f={f} k={k} lines={[String.raw`boxes shrink by $\cos\varphi$ ·`, "half the Earth within", "30° of the equator"]} />
      {/* Part 1 lessons B4: the keep line's own picture, in the empty picture zone (the band 30° S-30° N, narrower boxes near the pole);
          fix loop 1 (M1): held through S2 so the screen is never empty before the two boxes */}
      <KeepPic kind="band" c={[470, 450]} R={300} o={fin(f, 4, 10) * fout(f, tPlanet, 10)} />
      {void [g0, t20, LYB, KHULNA, SING]}
    </Scene>
  );
};

// ================================================================ s35 to sum up
const MC: Pt = [520, 430];
const Mini: React.FC<{ i: number; o: number }> = ({ i, o }) => {
  if (o <= 0) return null;
  const R = 260, c = MC;
  const p = (deg: number, r = R): Pt => [c[0] + r * Math.cos(deg * D2R), c[1] - r * Math.sin(deg * D2R)];
  const half = `${arcD(c, R, -90, 90, 60)}Z`;
  return (
    <g opacity={o}>
      {i === 0 ? <><circle cx={c[0]} cy={c[1]} r={R} fill="#1d2a44" stroke={C.muted} strokeWidth={4} /><Arrow p={c} q={p(40)} color={RAD} /><circle cx={c[0]} cy={c[1]} r={10} fill={C.gold} /></> : null}
      {i === 1 ? <><path d={half} fill="#4a3d36" stroke={C.muted} strokeWidth={4} /><Arrow p={c} q={p(48.4)} color={RAD} /><Lbl x={p(48.4, 140)[0] - 30} y={p(48.4, 140)[1] - 20} t="$a$" c={RAD} s={T.key} a="end" /></> : null}
      {i === 2 || i === 3 ? <><path d={half} fill="#4a3d36" stroke={C.muted} strokeWidth={4} /><line x1={c[0]} y1={c[1]} x2={c[0] + R} y2={c[1]} stroke={C.local} strokeWidth={4} />
        <line x1={c[0]} y1={c[1] + R} x2={c[0]} y2={c[1] - R} stroke={C.local} strokeWidth={4} /><Arrow p={c} q={p(48.4)} color={RAD} />
        <path d={`M${c[0]} ${c[1]}${arcD(c, 120, 0, 48.4).replace("M", "L")}Z`} fill={C.gold} fillOpacity={i === 2 ? 0.35 : 0.12} stroke={C.gold} strokeWidth={5} />
        {i === 3 ? <path d={`M${c[0]} ${c[1]}${arcD(c, 100, 48.4, 90).replace("M", "L")}Z`} fill={C.local} fillOpacity={0.35} stroke={C.local} strokeWidth={5} /> : null}</> : null}
      {i === 4 || i === 5 ? <><circle cx={c[0]} cy={c[1]} r={R} fill="#1d2a44" stroke={C.muted} strokeWidth={4} />
        {i === 4 ? <ellipse cx={c[0]} cy={c[1] - R * 0.75} rx={R * 0.66} ry={40} fill="none" stroke={C.second} strokeWidth={6} /> : <>{/* p3a (pass-2 review 1 M4, the user's rule): a meridian is HALF a circle, pole to pole, never continued: one half-ellipse */}
          <path d={`M${c[0]} ${c[1] - R} A ${R * 0.45} ${R} 0 0 1 ${c[0]} ${c[1] + R}`} fill="none" stroke={C.second} strokeWidth={6} />
          <circle cx={c[0]} cy={c[1] - R} r={8} fill={C.second} /><circle cx={c[0]} cy={c[1] + R} r={8} fill={C.second} /></>}
        <line x1={c[0]} y1={c[1] - R - 40} x2={c[0]} y2={c[1] + R + 40} stroke={C.local} strokeWidth={3} strokeDasharray="10 8" /><circle cx={c[0]} cy={i === 4 ? c[1] - R * 0.75 : c[1]} r={9} fill={i === 4 ? C.local : C.gold} /></> : null}
      {i === 6 ? <><circle cx={c[0]} cy={c[1]} r={R} fill="#4a3d36" stroke={C.muted} strokeWidth={4} /><line x1={c[0]} y1={c[1]} x2={p(0)[0]} y2={p(0)[1]} stroke={C.gold} strokeWidth={6} />
        <line x1={c[0]} y1={c[1]} x2={p(40)[0]} y2={p(40)[1]} stroke={C.key} strokeWidth={5} /><path d={arcD(c, 140, 0, 40)} fill="none" stroke={C.second} strokeWidth={8} /></> : null}
      {i === 7 ? <><path d={`M${c[0] - 200} ${c[1] + 150}L${c[0] + 120} ${c[1] + 150}L${c[0] + 120} ${c[1] - 210}Z`} fill={C.ink} fillOpacity={0.08} stroke="none" />
        <Arrow p={[c[0] - 200, c[1] + 150]} q={[c[0] + 120, c[1] - 210]} color={RAD} />
        <line x1={c[0] - 200} y1={c[1] + 150} x2={c[0] + 120} y2={c[1] + 150} stroke={C.second} strokeWidth={8} /><line x1={c[0] + 120} y1={c[1] + 150} x2={c[0] + 120} y2={c[1] - 210} stroke={C.second} strokeWidth={8} /></> : null}
      {i === 8 ? <><circle cx={c[0]} cy={c[1]} r={R} fill="#1d2a44" stroke={C.muted} strokeWidth={4} /><ellipse cx={c[0]} cy={c[1]} rx={R} ry={50} fill="none" stroke={C.second} strokeWidth={4} />
        <Arrow p={[c[0] - 60, c[1] + 50]} q={[c[0] + 200, c[1] + 48]} color={C.first} /></> : null}
      {i === 9 ? <><path d={arcD(c, R, -10, 90)} fill="none" stroke={C.muted} strokeWidth={4} /><path d={arcD(c, R, 30, 45)} fill="none" stroke={C.second} strokeWidth={16} />
        <line x1={c[0]} y1={c[1]} x2={p(30)[0]} y2={p(30)[1]} stroke={C.key} strokeWidth={4} /><line x1={c[0]} y1={c[1]} x2={p(45)[0]} y2={p(45)[1]} stroke={C.key} strokeWidth={4} /></> : null}
      {i === 10 ? <>{[0, 1, 2, 3].map((q) => <rect key={q} x={c[0] - 200} y={c[1] - 200 + q * 110} width={360 * Math.cos(q * 25 * D2R)} height={50} fill={C.gold} rx={6} />)}</> : null}
      {i === 11 ? <path d={`M${c[0] - 220} ${c[1] + 100}L${c[0] + 140} ${c[1] + 100}L${c[0] + 220} ${c[1] - 60}L${c[0] - 140} ${c[1] - 60}Z`} fill={C.gold} fillOpacity={0.4} stroke={C.gold} strokeWidth={5} /> : null}
      {i === 12 ? <>{Array.from({ length: 9 }, (_, q) => <rect key={q} x={c[0] - 280 + q * 60} y={c[1] + 200 - 400 * Math.sin((q + 1) * 10 * D2R)} width={56} height={400 * Math.sin((q + 1) * 10 * D2R)} fill={C.gold} opacity={0.6} />)}</> : null}
      {i === 13 ? <>{[[TM.plain, C.muted, "plain"], [TM.weighted, C.gold, "weighted"]].map(([v, cc, t], q) => <g key={q}>
        <rect x={c[0] - 240} y={c[1] - 110 + q * 190} width={28 * (v as number)} height={80} fill={cc as string} rx={6} />
        <Lbl x={c[0] - 240} y={c[1] - 145 + q * 190} t={`${t} ${(v as number).toFixed(1)} °C`} c={C.key} s={T.floor} /></g>)}</> : null}
      {i === 14 ? <><line x1={c[0]} y1={c[1] + 220} x2={c[0]} y2={c[1] + 40} stroke={C.muted} strokeWidth={8} />
        <Arrow p={[c[0], c[1] + 40]} q={[c[0] + 200, c[1] + 40]} color={C.second} /><Arrow p={[c[0], c[1] + 40]} q={[c[0] + 110, c[1] - 60]} color={C.second} />
        <Arrow p={[c[0], c[1] + 40]} q={[c[0], c[1] - 170]} color={C.first} /><Lbl x={c[0] + 160} y={c[1] - 150} t="?" c={C.gold} s={T.hero} /></> : null}
    </g>
  );
};
const S35: React.FC = () => {
  const f = useCurrentFrame(), k = K("s35_recap");
  // remake 2026-11-07 (R3): 16 sentences: the recap S0-S12 (S10 and S12 with their numbers), S13 the ERA5 numbers, S14-S15 the two-sentence
  // teaser to Part 4 (one picture and keyword for both); the end card follows
  const n = 16, NP = 15;
  // Part 1 lessons D3: each beat at full strength until ITS sentence ends (it used to start fading 10 frames early: the gaps are
  // 10-11 frames); the next beat comes in 8 frames after its sentence starts, so the 10-frame fade-out + 8-frame swap gap still fit
  const a = (j: number) => (j ? SS(k, j) + 8 : XIN), b = (j: number) => (j + 1 < NP ? SE(k, j) : LEN(k) + 20);
  if (TM.plain.toFixed(1) !== "7.1" || TM.weighted.toFixed(1) !== "16.3") throw new Error("CHECK s35: ERA5 means changed (voice says 7.1 / 16.3)");
  if (D.deg.dx1[3].toFixed(0) !== "74") throw new Error("CHECK s35: Brest degree east (voice says about 74 km)");
  const kw: [number, string, string | null][] = [
    [0, "distance + two angles", null], [1, "", String.raw`a\approx6400\ \text{km}`], [2, String.raw`latitude $\varphi$`, null], [3, "", String.raw`\text{colatitude}=90^\circ-\varphi`],
    [4, "parallel: round the axis", null], [5, "meridian: round the centre", null], [6, String.raw`longitude $\lambda$: east +`, null],
    [7, "", EQ_S18.split(String.raw`,\quad `)[2]], [8, "", String.raw`U=\Omega\,a\cos\varphi`], [9, "", String.raw`\Delta y=a\,\Delta\varphi`],
    [10, "", String.raw`\Delta x=a\cos\varphi\,\Delta\lambda`], [11, "", String.raw`dA=a^2\cos\varphi\,d\varphi\,d\lambda`], [12, String.raw`share $\sin\varphi$ · weights $\cos\varphi$`, null],
    [13, "7.1 → 16.3 °C", null], [14, "Part 4: turning frames", null],
  ];
  return (
    <Scene>
      <Svg>{Array.from({ length: NP }, (_, j) => <Mini key={j} i={j} o={fin(f, a(j), 10) * fout(f, b(j), 10)} />)}</Svg>
      <Svg>{kw.filter((q) => q[1]).map(([j, t]) => <Keyword key={j} f={f} text={t} at={[XC, 430]} appear={a(j)} out={j + 1 < NP ? b(j) : undefined} />)}</Svg>
      {kw.filter((q) => q[2]).map(([j, , s]) => <TeX key={j} s={s as string} x={XC} y={430} size={j === 7 ? T.calc : 60} c={C.ink} o={fin(f, a(j)) * (j + 1 < NP ? fout(f, b(j)) : 1)} />)}
      <Svg>
        {/* p3a (review 2 Should, stand-alone frames): the number of each rule with what it is, on its word */}
        <Lbl x={XC} y={540} t="at the equator ≈ 464.6 m/s" c={C.key} s={T.floor} o={win(f, AT(k, 8, "about four hundred"), b(8))} />
        <Lbl x={XC} y={540} t="≈ 111 km per degree, everywhere" c={C.key} s={T.floor} o={win(f, AT(k, 9, "about a hundred"), b(9))} />
        <Lbl x={XC} y={540} t="Brest: ≈ 74 km per degree" c={C.key} s={T.floor} o={win(f, AT(k, 10, "about seventy four") + 28, b(10))} />
        <Lbl x={XC} y={540} t="ERA5 · September 2026" c={C.key} s={T.floor} o={win(f, a(13) + 8, b(13))} />
        <Lbl x={XC} y={540} t="its own east, north, up" c={C.key} s={T.floor} o={win(f, AT(k, 14, "its own east") - 18, SS(k, 15) - 14)} />
        <Lbl x={XC} y={540} t="they turn as the air moves" c={C.key} s={T.floor} o={fin(f, SS(k, 15) + 8)} />
      </Svg>
      {/* data frame (house rule): the source line under the ERA5 bars */}
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · 2-m temperature · September 2026 · global means" pic={{ x: 270, y: 250, w: 520, h: 340 }} w={760}
        o={fin(f, a(13), 10) * fout(f, b(13), 10)} name="s35 src era5" />
      <Svg><Lbl x={XC} y={540} t="$\sin\leftrightarrow\cos$" c={C.key} s={T.key} o={win(f, AT(k, 3, "swaps sine"), b(3))} />
        </Svg>
      <TeX s={String.raw`x=a\cos\varphi\cos\lambda,\ \ y=a\cos\varphi\sin\lambda`} x={XC} y={540} size={48} c={C.ink} o={win(f, AT(k, 7, "x is the radius"), b(7))} />
    </Scene>
  );
};

// ================================================================ s36 the series end card (maths ending)
const S36: React.FC = () => {
  const f = useCurrentFrame(), k = K("s36_end");
  const t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const thumb = (x: number, i: number) => (
    <g key={i} opacity={0.75}>
      <rect x={x - 150} y={70} width={300} height={170} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
      {/* Part 1 lessons B5: every icon >= 20 px inside its box (box y 70-240): the half disc and the globe now r 60-62 (were 70: 15 px) */}
      {i === 0 ? <><path d={`M${x - 20} 215 A 60 60 0 0 1 ${x - 20} 95 Z`} fill="#4a3d36" stroke={C.muted} strokeWidth={3} /><line x1={x - 20} y1={155} x2={x + 40} y2={155} stroke={C.local} strokeWidth={3} />
        <Arrow p={[x - 20, 155]} q={[x + 22, 111]} color={RAD} w={5} head={16} halo={false} /></> : null}
      {i === 1 ? <><circle cx={x} cy={155} r={62} fill="none" stroke={C.muted} strokeWidth={3} />{[-36, 0, 36].map((q) => <ellipse key={q} cx={x} cy={155 + q} rx={62 * Math.cos(Math.asin(q / 62))} ry={9} fill="none" stroke={C.second} strokeWidth={2} />)}
        {[22, 44].map((q) => <ellipse key={q} cx={x} cy={155} rx={q} ry={62} fill="none" stroke={C.local} strokeWidth={2} />)}</> : null}
      {i === 2 ? <><path d={`M${x - 90} 215 L${x + 60} 215 L${x + 60} 100 Z`} fill={C.ink} fillOpacity={0.1} stroke={C.second} strokeWidth={4} /></> : null}
      {i === 3 ? <path d={`M${x - 90} 210 L${x + 50} 210 L${x + 90} 110 L${x - 50} 110 Z`} fill={C.gold} fillOpacity={0.4} stroke={C.gold} strokeWidth={4} /> : null}
    </g>
  );
  return (
    <Scene>
      {/* remake 2026-11-07 (R3): the picture fades out over the 75-frame hold, together with the music's 2.5-s tail (Part 2's s42) */}
      <Svg o={1 - ramp(f, LEN(k) - HOLD, LEN(k) - 4)}>
        <g opacity={fin(f, 6)}>{[420, 760, 1100, 1440].map((x, i) => thumb(x, i))}</g>
        <Lbl x={960} y={330} t="a series of maths tutorials" c={C.key} s={T.calc} a="middle" o={fin(f, 10)} />
        <Lbl x={960} y={410} t="atmospheric science · meteorology · fluid dynamics" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "atmospheric science"))} />
        <g opacity={fin(f, t2)}><Notebook x={300} y={500} s={0.4} /><Lbl x={370} y={508} t="coordinates notebook" c={C.ink} s={T.key} /></g>
        <g opacity={fin(f, tOther)}>
          {[0, 1, 2].map((i) => <Notebook key={i} x={260 + i * 30} y={600 - i * 10} s={0.24} c={[C.second, VIOLET, C.muted][i]} o={0.9} />)}
          <Lbl x={370} y={590} t="notebooks for the other maths concepts" c={C.key} s={T.key} />
        </g>
      </Svg>
    </Scene>
  );
};

export const SCENES_C: Record<string, React.FC> = {
  s26_grid_boxes: S26, s27_area_patch: S27, s28_box_areas: S28, s29_strip_round: S29, s30_slope_of_sine: S30, s31_adding_strips: S31, s32_band_fraction: S32,
  s33_archimedes: S33, s34_global_mean: S34, s35_recap: S35, s36_end: S36,
};
void [gdot, plab, splitVis, pulse, GFULL, mix, Rod3D];
