// ch00_coordinates_sphere scenes s13-s25: the Earth-centred axes, Brest's position in two slices (TwoViewSlice, skip chip K2), the
// position vector and r̂, Khulna (zoom-reveal flight, side and top views), the spinning ground U = Ω a cos φ and its numbers (keep
// line K2), distances north and east on the meridian and parallel slices (skip chip K3), and one degree east at four places (keep
// line K3). Numbers from data/cs.json only (CHECK_B re-asserts every screen string).
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Pt, RightTick, pulse, textW } from "../house/kit/draw";
import { ClockGlyph } from "../house/kit/icons";
import { SunGlyph, CurvedLink } from "../house/kit/extras";
import { GlobeFrame, SourceBelow } from "../house/kit/frame";
import { AnimatedWindArrow } from "../house/kit/wind";
import { GProj, globePath, llPath } from "./kit_cs/globe";
import { V3 } from "./kit_cs/cam";
import {
  AT, Arrow, BREST, CalcStack, Chevron, D, D2R, Earth, GB, GFULL, H, K, KHULNA, KeepLine, Keyword, LEN, LYB, Layered, Lbl, PlaneIcon, SE, SING, SRC_G, SS,
  Scene, SideCallout, SkipChip, Svg, TV3, TeX, VIOLET, XC, XZ, arcD, chipSpan, clamp, cutAt, discOf, e2g, eastAt, facePt, facing, faceArc, fin, fout, gdot, globeG,
  gseg, keepGone, keepTime, latFace, ll, merFace, merPath, mix, parPath, plab, poly, prog, splitVis, win, eqFace, Face, faceFlat, face3, spinPath,
  RAD, Magnify, KeepPic,
} from "./cs_lib";
import { CAM_TOP, DiscFlatBase, FItem, FLAT_C, FLAT_R, LON0, MerFlatBase, PHI, TOP_C, TOP_R, TwoView, camFace, merCut, ptOf } from "./cs_two";
import { EQ_S13, EQ_S15, EQ_S16, EQ_S17, EQ_S18, EQ_S19, EQ_S20, EQ_S21, EQ_S22, EQ_S24, EQ_S25 } from "./cs_eq";

const BR = D.brest, KH = D.khulna, SP = D.spin, DG = D.deg;
const CHECK_B: [string, number, number, number][] = [
  ["zB", BR.r_km[2], 4764, 0.5], ["RB", BR.R_km, 4230, 0.5], ["xB", BR.r_km[0], 4217, 0.5], ["yB", BR.r_km[1], -332, 0.5], ["sinB", BR.sin, 0.7478, 5e-5], ["cosB", BR.cos, 0.6639, 5e-5],
  ["cosl", BR.cosl, 0.9969, 5e-5], ["sinl", BR.sinl, -0.0785, 5e-5], ["r1", BR.rhat[0], 0.662, 5e-4], ["r2", BR.rhat[1], -0.052, 5e-4], ["r3", BR.rhat[2], 0.748, 5e-4],
  ["zK", KH.r_km[2], 2469, 0.5], ["RK", KH.R_km, 5873, 0.5], ["xK", KH.r_km[0], 41, 0.5], ["yK", KH.r_km[1], 5873, 0.5], ["sinK", KH.sin, 0.3875, 5e-5], ["cosK", KH.cos, 0.9219, 5e-5],
  ["coslK", KH.cosl, 0.00698, 5e-6], ["T", SP.T, 86164, 0.5], ["Om", SP.Om * 1e5, 7.29, 5e-3], ["U0", SP.U[0], 464.6, 0.05], ["US", SP.U[1], 464, 0.5], ["UK", SP.U[2], 428, 0.5],
  ["UB", SP.U[3], 308, 0.5], ["UL", SP.U[4], 95, 0.5], ["dy1", DG.dy1, 111.2, 0.05], ["dxS", DG.dx1[1], 111.2, 0.05], ["dxK", DG.dx1[2], 102.5, 0.05],
  ["dxB", DG.dx1[3], 73.8, 0.05], ["dxL", DG.dx1[4], 22.7, 0.05], ["min", DG.min_km, 1.85, 0.005], ["eqB", DG.brest_eq_km, 5382, 0.5], ["cosL", Math.cos(LYB[0] * D2R), 0.2045, 5e-5],
  ["amphan", KH.amphan.closest_km, 78, 20],
  // fix loop 1: the new rows (Singapore 1.35° N, cos 1.35° = 0.9997; Longyearbyen 78.2° N; 1 m/s = 3.6 km/h; 2π × 6400 ≈ 40 000; 1670/900 ≈ 1.9)
  ["latS", SING[0], 1.35, 0.005], ["cosS", Math.cos(SING[0] * D2R), 0.9997, 5e-5], ["latL", LYB[0], 78.2, 0.05], ["kmh", 3600 / 1000, 3.6, 1e-12],
  ["circ", 2 * Math.PI * 6400, 40000, 300], ["jet", 1670 / 900, 1.9, 0.05], ["U36", SP.U[0] * 3.6, 1670, 5],
];
CHECK_B.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
const GSrc: React.FC<{ o?: number }> = ({ o = 1 }) => <SourceBelow text={SRC_G} pic={GB} w={960} o={o} name="globe src" />;
const CB = PHI * D2R, BU = Math.cos(CB), BV = Math.sin(CB);
const KX3 = 1420;   // keyword column right of the flat diagram (TwoViewSlice scenes): rows y 440 / 505 (above: the legs' tags)

// ================================================================ s13 the Earth-centred axes x, y, z
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = K("s13_earth_axes");
  const tAx = SS(k, 2), tZ = AT(k, 3, "The z axis"), tX = AT(k, 4, "The x axis"), tGG = AT(k, 4, "Gulf of Guinea"), tY = AT(k, 5, "The y axis"), tIO = AT(k, 5, "Indian Ocean"),
    tHat = AT(k, 6, "x hat, y hat and z hat"), tRA = SS(k, 7), tCross = SS(k, 8), tTurn = SS(k, 9), tGoal = SS(k, 10), tTwo = SS(k, 11);
  const cam = spinPath([{ f: 0, lat: 22, lon: 40, dist: 3.5 }, { f: tX - 10, lat: 15, lon: 40, dist: 3.5 }, { f: tX + 50, lat: 12, lon: 18, dist: 3.5 },
    { f: tY - 10, lat: 12, lon: 25, dist: 3.5 }, { f: tY + 60, lat: 12, lon: 68, dist: 3.5 }, { f: tHat, lat: 22, lon: 45, dist: 3.5 },
    { f: tTurn, lat: 22, lon: 45, dist: 3.5 }, { f: SE(k, 9), lat: 22, lon: 95, dist: 3.5 }, { f: LEN(k) + 10, lat: 22, lon: 100, dist: 3.5 }], f);
  const G = globeG(cam);
  const c0 = G.pw([0, 0, 0]);
  const ex = e2g([1, 0, 0]), ey = e2g([0, 1, 0]), ez = e2g([0, 0, 1]);
  const tip = (v: V3, s: number) => G.pw([v[0] * s, v[1] * s, v[2] * s]);
  const u = (v: V3): Pt => { const q = tip(v, 0.3); const d = Math.hypot(q[0] - c0[0], q[1] - c0[1]) || 1; return [(q[0] - c0[0]) / d, (q[1] - c0[1]) / d]; };
  const xh = tip(ex, 0.55), yh = tip(ey, 0.55), zh = tip(ez, 0.55);
  const rows = cutAt(EQ_S13, "=");
  return (
    <Scene>
      <Earth cam={cam} alpha={0.42} coast={0.4}
        over={(Gg) => <>
          <circle cx={c0[0]} cy={c0[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tAx)} />
          {gseg(Gg, [0, 0, 0], [ez[0] * 1.4, ez[1] * 1.4, ez[2] * 1.4], C.second, 5, fin(f, tZ))}
          {gseg(Gg, [0, 0, 0], [ex[0] * 1.4, ex[1] * 1.4, ex[2] * 1.4], C.second, 5, fin(f, tX))}
          {gseg(Gg, [0, 0, 0], [ey[0] * 1.4, ey[1] * 1.4, ey[2] * 1.4], C.second, 5, fin(f, tY))}
          {gdot(Gg, 0, 0, C.second, 9, fin(f, tX))}{gdot(Gg, 0, 90, C.second, 9, fin(f, tY))}
          {plab(Gg, 0, 0, "Gulf of Guinea", win(f, tGG, tHat) * facing(Gg, 0, 0), 20, 36, "start", true)}
          {plab(Gg, 0, 90, "Indian Ocean", win(f, tIO, tHat) * facing(Gg, 0, 90), -20, 40, "end", true)}{/* K6 k6r1: below-left of its dot (it ran over the y axis and its tag) */}
          {plab(Gg, 15, 89, "Bay of Bengal", win(f, tIO + 20, tHat) * facing(Gg, 15, 89), 20, -30, "start", true)}
          <g opacity={fin(f, tHat)}>
            <Arrow p={c0} q={xh} color={C.second} w={9} head={30} />
            <Arrow p={c0} q={yh} color={C.second} w={9} head={30} />
            <Arrow p={c0} q={zh} color={C.second} w={9} head={30} />
          </g>
        </>} />
      <Svg>
        <RightTick at={c0} u1={u(ex)} u2={u(ey)} s={24} c={C.ink} o={fin(f, tRA)} />
        <RightTick at={c0} u1={u(ey)} u2={u(ez)} s={24} c={C.ink} o={fin(f, tRA + 10)} />
        <RightTick at={c0} u1={u(ex)} u2={u(ez)} s={24} c={C.ink} o={fin(f, tRA + 20)} />
        {void 0}
        <Keyword f={f} text="an arrow in space" at={[XC, 150]} appear={0} out={tAx - 30} />
        <Keyword f={f} text="three axes from the centre" at={[XC, 150]} appear={tAx} />
        <path d={arcD([1640, 560], 50, 200, -60)} fill="none" stroke={VIOLET} strokeWidth={5} opacity={fin(f, tCross)} />
        <Chevron at={[1640 + 50 * Math.cos(-60 * D2R), 560 + 50 * Math.sin(60 * D2R)]} dir={[-Math.sin(60 * D2R), Math.cos(60 * D2R)]} c={VIOLET} o={fin(f, tCross)} />
        <Keyword f={f} text="they turn with the Earth" at={[XC, 670]} appear={tTurn} out={tGoal - 20} />
        <Keyword f={f} text="goal: Brest's $x$, $y$, $z$" at={[XC, 670]} appear={tGoal} />
        <g opacity={fin(f, tTwo)}>
          <path d="M1120 790 A 40 40 0 0 1 1120 710 Z" fill="#4a3d36" stroke={C.muted} strokeWidth={3} />
          <Lbl x={1150} y={760} t="side view" c={C.key} s={T.floor} />
          <ellipse cx={1500} cy={760} rx={40} ry={16} fill="#4a3d36" stroke={C.muted} strokeWidth={3} />
          <Lbl x={1560} y={760} t="top view" c={C.key} s={T.floor} />
        </g>
      </Svg>
      <TeX s={String.raw`${H.x}\to 0^\circ\,\text{N},\ 0^\circ\,\text{E}`} x={XC} y={260} size={56} c={C.ink} o={fin(f, tHat + 10)} />
      <TeX s={String.raw`${H.y}\to 0^\circ\,\text{N},\ 90^\circ\,\text{E}`} x={XC} y={345} size={56} c={C.ink} o={fin(f, tHat + 25)} />
      <TeX s={String.raw`${H.z}\to\text{North Pole}`} x={XC} y={430} size={56} c={C.ink} o={fin(f, tHat + 40)} />
      <TeX s={EQ_S13} x={XC} y={560} size={T.eq} c={C.ink} o={fin(f, tCross)} />
      {/* checklist "all maths is TeX": the axis names x, y, z are KaTeX */}
      <TeX s="z" x={tip(ez, 1.48)[0] + 20} y={tip(ez, 1.48)[1] - 16} size={T.key} c={C.second} ax={0} o={fin(f, tZ)} halo />
      <TeX s="x" x={Math.max(80, tip(ex, 1.5)[0])} y={tip(ex, 1.5)[1] - 46} size={T.key} c={C.second} ax={0.5} o={fin(f, tX)} halo />
      <TeX s="y" x={tip(ey, 1.5)[0]} y={tip(ey, 1.5)[1] - 46} size={T.key} c={C.second} ax={0.5} o={fin(f, tY)} halo />
      <TeX s={H.x} x={xh[0] + 10} y={xh[1] + 34} size={48} c={C.second} ax={0.5} o={fin(f, tHat)} halo />
      <TeX s={H.y} x={yh[0] + 10} y={yh[1] + 34} size={48} c={C.second} ax={0.5} o={fin(f, tHat)} halo />
      <TeX s={H.z} x={zh[0] + 34} y={zh[1]} size={48} c={C.second} ax={0} o={fin(f, tHat)} halo />
      <GSrc />
      {void rows}
    </Scene>
  );
};


// ================================================================ the side-view items shared by s14-s16 (Brest's meridian face)
const sideItems = (t: { c: number; ax: number; eq: number; ar: number; phi: number; drop: number; rt: number; tri: number }): FItem[] => [
  { k: "dot", p: [0, 0], c: C.gold, at: t.c },
  { k: "seg", a: [0, -1.1], b: [0, 1.18], c: C.local, w: 4, at: t.ax },
  // K6 k6r1: the pole end of the axis is above the 3-D view's frame, so its two tags are drawn in the flat view only (they overlapped
  // each other off-frame); flat-view tags sit clear of the axis, rim and dashed leg (t2 = shorter flat text)
  { k: "tex", p: [0, 1.18], t: String.raw`z`, c: C.second, size: 54, dx: -34, dy: -6, at: t.ax, same: false, only: "2" },
  { k: "lbl", p: [0, 1.0], t: "North Pole", c: C.key, dx: 26, dy: -40, at: t.ax + 6, same: false, only: "2" },
  { k: "seg", a: [0, 0], b: [1, 0], c: C.local, w: 4, at: t.eq },
  { k: "lbl", p: [0.55, 0], t: "equator plane", t2: "equator", c: C.muted, dy: 40, a: "middle", dy3: 40, a3: "middle", at: t.eq + 6, same: false, out: t.drop - 20 },
  { k: "arrow", a: [0, 0], b: [BU, BV], c: RAD, at: t.ar },
  { k: "tex", p: [BU / 2, BV / 2], t: String.raw`a`, c: RAD, size: 54, dx: -30, dy: -26, at: t.ar + 6, same: false },
  { k: "wedge", r: 0.34, a0: 0, a1: PHI, c: C.gold, fo: 0.2, at: t.phi },
  { k: "arc", r: 0.34, a0: 0, a1: PHI, c: C.gold, w: 6, at: t.phi, same: false },
  { k: "tex", p: [0.22 * Math.cos(CB / 2), 0.22 * Math.sin(CB / 2)], t: String.raw`\varphi`, c: C.gold, size: 48, at: t.phi + 4, same: false },
  { k: "lbl", p: [0, 0], t: "48.4°", c: C.gold, dx: -18, dy: 46, a: "end", at: t.phi + 10, same: false, only: "2" },   // left of the axis, under the equator line (it sat on the dashed leg)
  { k: "seg", a: [BU, BV], b: [BU, 0], c: C.local, w: 5, dash: "12 8", at: t.drop },
  { k: "tick", p: [BU, 0], d1: [-1, 0], d2: [0, 1], s: 0.08, at: t.rt },
  { k: "fill", pts: [[0, 0], [BU, 0], [BU, BV]], c: C.ink, fo: 0.1, at: t.tri },
  { k: "dot", p: [BU, BV], c: C.gold, r: 9, at: 0, same: false },
];
const ALL0 = { c: 0, ax: 0, eq: 0, ar: 0, phi: 0, drop: 0, rt: 0, tri: 0 };
const allOld = (it: FItem[]) => it.map((x) => ({ ...x, at: Math.min(x.at, 0), same: false }) as FItem);
const CAMF = camFace(LON0);
const FACE_B = merFace(LON0);

// ================================================================ s14 Brest's side view (TwoViewSlice; skip chip K2)
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14_brest_side");
  const chipA = AT(k, 2, "skip ahead"), chipEnd = chipA + 255;
  const tSlice = AT(k, 4, "slice the Earth"), tNext = AT(k, 4, "next to it"), tEvery = SS(k, 5);
  const t = { c: AT(k, 6, "the centre"), ax: AT(k, 7, "the Earth's axis"), eq: AT(k, 8, "out to the equator"), ar: AT(k, 9, "the arrow from the centre to Brest"),
    phi: AT(k, 10, "forty eight point four degrees"), drop: AT(k, 11, "drop a line"), rt: AT(k, 12, "right angle"), tri: AT(k, 13, "right triangle") };
  const slide = prog(f, tSlice, tSlice + 45);
  const flatIn = Math.max(chipEnd, tNext);
  return (
    <Scene>
      <TwoView f={f} cam={CAMF} cut={merCut(slide)} face={FACE_B} flatC={FLAT_C} flatR={FLAT_R} items={sideItems(t)} flatO={fin(f, flatIn, 15)}
        flatBase={(P) => <MerFlatBase P={P} />} />
      <Svg>
        <Keyword f={f} text="Brest's position" at={[XC, 150]} appear={0} out={chipA - 20} />
        <Keyword f={f} text="the side view" at={[KX3, 470]} appear={SS(k, 3)} out={tEvery - 10} />
        <Keyword f={f} text="drawn in both" at={[KX3, 470]} appear={tEvery + 8} out={t.tri - 20} />
        <Keyword f={f} text="right triangle" at={[KX3, 470]} appear={t.tri} />
      </Svg>
      <SkipChip f={f} k={k} to={keepTime("s21_ground_speeds")} />
    </Scene>
  );
};

// ================================================================ s15 z = a sin φ
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_brest_z");
  const tUp = SS(k, 1), tOpp = SS(k, 2), tRule = SS(k, 3), tEq = SS(k, 4), tNum = SS(k, 5), tA = AT(k, 6, "six thousand three hundred"), tSin = SS(k, 7), tRes = AT(k, 8, "which is about"),
    tEasy = SS(k, 9), tPole = AT(k, 10, "on the North Pole's side"), tSouth = SS(k, 11);
  const items: FItem[] = [
    ...allOld(sideItems(ALL0)),
    { k: "band", a: [BU, 0], b: [BU, BV], c: C.second, w: 16, at: tUp },
    // K6 k6r1: flat tags start right of the rim (they straddled it); the radius glows in both views on "six thousand three hundred …"
    // (it replaces a gold link from the a-row that had to cross the axis and the equator line)
    { k: "band", a: [0, 0], b: [BU, BV], c: RAD, w: 18, fo: 0.35, at: tA, out: tSin + 30 },
    { k: "lbl", p: [BU, BV / 2], t: String.raw`opposite $\varphi$`, c: C.gold, dx: 70, dy: 0, at: tOpp, out: tRes - 20, only: "2" },
    // 3-D: just "z" at the leg (the full tag ran past the 3-D frame into the flat view's 48.4°); the flat tag and the rows carry the number
    { k: "tex", p: [BU, BV / 2], t: String.raw`z`, t2: String.raw`z\approx4764\ \text{km}`, c: C.second, size: 48, dx: 70, ax: 0, dx3: 22, ax3: 0, at: tRes },
    { k: "arrow", a: [BU + 0.06, BV * 0.55], b: [BU + 0.06, BV * 0.95], c: C.gold, w: 5, head: 22, at: tPole },
    { k: "arrow", a: [0, 0], b: [Math.cos(30 * D2R), -Math.sin(30 * D2R)], c: RAD, w: 6, head: 24, o: 0.6, at: tSouth },
    { k: "band", a: [Math.cos(30 * D2R), 0], b: [Math.cos(30 * D2R), -Math.sin(30 * D2R)], c: C.neg, w: 12, at: tSouth + 15, same: false },
    // 3-D only, under the southern tip (it ran off the 3-D frame's right edge; the flat side has the keyword "south: z < 0")
    { k: "lbl", p: [Math.cos(30 * D2R), -0.5], t: "$z<0$", c: C.neg, dy: 56, a: "middle", at: tSouth + 25, same: false, only: "3" },
  ];
  const P2 = faceFlat(FLAT_C, FLAT_R);
  return (
    <Scene>
      <TwoView f={f} cam={CAMF} cut={merCut(1)} face={FACE_B} flatC={FLAT_C} flatR={FLAT_R} items={items} flatBase={(P) => <MerFlatBase P={P} />} />
      <Svg>
        <Keyword f={f} text="height above" at={[KX3, 440]} appear={0} out={tNum - 22} s={48} />
        <Keyword f={f} text="the equator plane" at={[KX3, 500]} appear={0} out={tNum - 22} s={46} />
        <Keyword f={f} text="towards the" at={[KX3, 440]} appear={tPole} s={48} out={tSouth - 22} />
        <Keyword f={f} text="North Pole" at={[KX3, 500]} appear={tPole} s={48} out={tSouth - 22} />
        <Keyword f={f} text="south: $z<0$" at={[KX3, 440]} appear={tSouth + 20} c={C.neg} s={48} />
        <Lbl x={XC} y={660} t="opposite = long $\times\sin$" c={C.key} s={T.floor} o={win(f, tRule, tEq - 15)} />
        {void P2}
      </Svg>
      {/* K6 k6r1: the under-words ran past x 1842 (to 2099): calc size and shorter words */}
      <Layered parts={[{ t: String.raw`z=` }, { t: String.raw`a`, c: RAD, u: { w: String.raw`\text{radius}`, c: C.gold } }, { t: String.raw`\sin\varphi`, u: { w: String.raw`\text{sine of latitude}`, c: C.gold } }]}
        x={XC} y={680} size={T.calc} layers={[{ t: "all", o: fin(f, tEq) * fout(f, tNum - 15) }, { t: [], u: [1, 2], o: fin(f, tEq + 20) * fout(f, tNum - 15) }]} />
      <TeX s={EQ_S15} x={KX3} y={330} size={T.calc} c={C.ink} o={fin(f, tNum)} />
      <CalcStack f={f} x={XC + 60} y={560} size={52} maxLines={2} rows={[
        { lhs: "a", rhs: String.raw`=6371\ \text{km}`, at: tA },
        { lhs: "", rhs: String.raw`\sin48.4^\circ\approx0.7478`, at: tSin, cont: true },
        { lhs: "z", rhs: String.raw`=6371\ \text{km}\times0.7478\approx4764\ \text{km}`, at: tRes - 30, size: 46 },
        { lhs: "", rhs: String.raw`6400\times\dfrac34=4800`, at: tEasy, c: C.muted },
      ]} />
      {void tSin}
    </Scene>
  );
};

// ================================================================ s16 the distance from the axis a cos φ
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16_brest_axis_distance");
  const tNext = SS(k, 1), tCos = SS(k, 2), tRes = AT(k, 3, "which is about"), tEasy = SS(k, 4), tDisc = SS(k, 5), tBoth = SS(k, 6);
  const items: FItem[] = [
    ...allOld(sideItems(ALL0)),
    { k: "band", a: [BU, 0], b: [BU, BV], c: C.second, w: 10, fo: 0.4, at: 0, same: false },
    // K6 k6r1: flat tags right of the rim / clear of the axis; the flat leg tag is a cos φ alone (the number is in the 3-D view and the rows);
    // the 3-D leg tag starts right of the 3-D axis
    { k: "tex", p: [BU, BV / 2], t: String.raw`4764\ \text{km}`, c: C.second, size: 44, dx: 70, ax: 0, dx3: 22, ax3: 0, at: 0, same: false },
    { k: "band", a: [0, 0], b: [BU, 0], c: C.second, w: 16, at: 4 },
    { k: "lbl", p: [BU / 2, 0], t: String.raw`next to $\varphi$`, c: C.gold, dx: 30, dy: 44, a: "middle", at: tNext, out: tRes - 20, only: "2" },
    { k: "tex", p: [BU / 2, 0], t: String.raw`${EQ_S16}\approx4230\ \text{km}`, t2: EQ_S16, c: C.second, size: 48, dx: 16, dx3: 80, dy: 50, dy3: 50, at: tRes },
  ];
  const disc3 = (G: GProj) => {
    const o = fin(f, tDisc);
    if (o <= 0) return null;
    const ring = Array.from({ length: 121 }, (_, i) => ll(PHI, LON0 + (360 * i) / 120, 1.001));
    const sv = splitVis(G, ring);
    return <g opacity={o}>
      <path d={poly(ring.map((q) => G.pw(q)))} fill={C.second} fillOpacity={0.12} stroke="none" />
      {sv.front.map((s, i) => <path key={i} d={poly(s)} fill="none" stroke={C.second} strokeWidth={4} />)}
      {sv.back.map((s, i) => <path key={`b${i}`} d={poly(s)} fill="none" stroke={C.second} strokeWidth={3} strokeDasharray="8 8" opacity={0.6} />)}
    </g>;
  };
  return (
    <Scene>
      <TwoView f={f} cam={CAMF} cut={merCut(1)} face={FACE_B} flatC={FLAT_C} flatR={FLAT_R} items={items} flatBase={(P) => <MerFlatBase P={P} />}
        extra3={(G) => disc3(G)} extraFlat={(P) => <line x1={P(-BU, BV)[0]} y1={P(-BU, BV)[1]} x2={P(BU, BV)[0]} y2={P(BU, BV)[1]} stroke={C.second} strokeWidth={4}
          strokeDasharray="12 8" opacity={fin(f, tDisc)} />} />
      <Svg>
        <Keyword f={f} text="distance from" at={[KX3, 440]} appear={0} out={tDisc - 22} s={48} />
        <Keyword f={f} text="the axis" at={[KX3, 500]} appear={0} out={tDisc - 22} s={48} />
        <Keyword f={f} text="= radius of" at={[KX3, 440]} appear={tDisc} s={48} />
        <Keyword f={f} text="Brest's parallel" at={[KX3, 500]} appear={tDisc} s={46} />
        <Lbl x={XC} y={660} t="next = long $\times\cos$" c={C.key} s={T.floor} o={win(f, tNext, tCos - 15)} />
        <Keyword f={f} text="up 4764 · out 4230 km" at={[XC, 820]} appear={tBoth} s={T.floor} />
      </Svg>
      <CalcStack f={f} x={XC + 160} y={545} size={52} maxLines={2} rows={[   // K6 k6r1: y 600 put the fraction row into the caption band (y 920)
        { lhs: String.raw`\cos48.4^\circ`, rhs: String.raw`\approx0.6639`, at: tCos },
        { lhs: String.raw`a\cos\varphi`, rhs: String.raw`=6371\ \text{km}\times0.6639`, at: tRes - 30 },
        { lhs: "", rhs: String.raw`\approx4230\ \text{km}`, at: tRes, cont: true },
        { lhs: "", rhs: String.raw`6400\times\dfrac23\approx4270`, at: tEasy, c: C.muted, out: tBoth - 15 },
      ]} />
    </Scene>
  );
};

// ================================================================ s17 the top view: x and y
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_brest_top");
  const tFoot = AT(k, 3, "the foot"), tLeg = AT(k, 4, "four thousand two hundred and thirty"), tLam = AT(k, 5, "minus four and a half"), tPolar = AT(k, 6, "polar coordinates"),
    tParts = SS(k, 7), tNum = SS(k, 8), tCx = SS(k, 9), tX = AT(k, 10, "about four thousand two hundred and seventeen"), tSy = SS(k, 11), tY = AT(k, 12, "about minus three"),
    tWest = SS(k, 13);
  const fu = BU * BR.cosl, fv = BU * BR.sinl;
  const items: FItem[] = [
    { k: "dot", p: [0, 0], c: C.gold, at: 0, same: false },
    { k: "arrow", a: [0, 0], b: [1.2, 0], c: C.second, w: 5, head: 24, at: 0, same: false },
    { k: "arrow", a: [0, 0], b: [0, 1.2], c: C.second, w: 5, head: 24, at: 0, same: false },
    { k: "tex", p: [1.2, 0], t: String.raw`x`, c: C.second, size: 54, dx: 10, dy: -34, dx3: -14, dy3: -34, at: 0, same: false },   // K6 k6r1: above the tip
    { k: "tex", p: [0, 1.2], t: String.raw`y`, c: C.second, size: 54, dx: 34, at: 0, same: false },
    { k: "dot", p: [fu, fv], c: C.key, r: 9, at: tFoot },
    { k: "seg", a: [0, 0], b: [fu, fv], c: RAD, w: 8, at: tLeg },
    { k: "lbl", p: [fu * 0.55, fv * 0.55], t: "4230 km", c: RAD, dy: -40, a: "middle", dy3: -40, a3: "middle", at: tLeg + 10, same: false, out: tParts - 15 },
    { k: "arc", r: 0.45, a0: 0, a1: BREST[1], c: C.second, w: 7, at: tLam },
    { k: "seg", a: [0, 0], b: [fu, 0], c: C.second, w: 6, dash: "14 8", at: tParts },
    { k: "seg", a: [fu, 0], b: [fu, fv], c: C.second, w: 6, dash: "14 8", at: tParts + 15, same: false },
    // K6 k6r1: the x and y tags are TeX (maths), the flat y tag sits right of the rim (the y leg is 10 px long there), the 3-D y tag
    // under the x tag (it ran off the 3-D frame); the flat x tag drops "km" to stay inside the disc
    { k: "tex", p: [fu * 0.5, 0], t: String.raw`x\approx4217\ \text{km}`, t2: String.raw`x\approx4217`, c: C.second, size: 46, dy: 46, dy3: 46, at: tX },
    { k: "tex", p: [fu, fv], t: String.raw`y\approx-332\ \text{km}`, c: C.neg, size: 46, dx: 90, dy: 62, ax: 0, dx3: 20, dy3: 104, ax3: 1, at: tY },
  ];
  const G = globeG(CAM_TOP, TV3);
  const pB = G.pw(ll(BREST[0], BREST[1])), pF = G.pw(facePt(eqFace, fu, fv));
  const eqs = cutAt(EQ_S17, String.raw`,\qquad `);
  const IC: Pt = [1640, 420], IR = 120;   // Part 1 lessons B1: inset moved up, clear of the x, y lines at y 650 (they overlapped it)
  return (
    <Scene>
      <TwoView f={f} cam={CAM_TOP} cut={{ kind: "lat", lat0: 0, lift: 0, capO: 0, polar: true }} face={eqFace} flatC={TOP_C} flatR={TOP_R} items={items}
        flatBase={(P) => <DiscFlatBase P={P} />}
        extra3={() => <g opacity={fin(f, tFoot)}>
          <line x1={pB[0]} y1={pB[1]} x2={pF[0]} y2={pF[1]} stroke={C.local} strokeWidth={5} strokeDasharray="12 8" />
          <circle cx={pB[0]} cy={pB[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        </g>} />
      <Svg>
        <Keyword f={f} text="the top view" at={[1440, 150]} appear={0} out={tWest - 20} s={50} />
        <Keyword f={f} text="just west of 0°" at={[1440, 150]} appear={tWest} s={50} />
        <g opacity={win(f, tLam + 15, tNum - 10)}>
          <circle cx={IC[0]} cy={IC[1]} r={IR + 12} fill={C.bg} stroke={C.grid} strokeWidth={3} />
          <line x1={IC[0]} y1={IC[1]} x2={IC[0] + IR} y2={IC[1]} stroke={C.second} strokeWidth={5} />
          <line x1={IC[0]} y1={IC[1]} x2={IC[0] + IR * Math.cos(27 * D2R)} y2={IC[1] + IR * Math.sin(27 * D2R)} stroke={RAD} strokeWidth={5} />
          <path d={arcD(IC, IR * 0.75, 0, -27)} fill="none" stroke={C.second} strokeWidth={6} />
        </g>
        {/* Part 1 lessons B1: ring on the small λ arc of the flat top view, leader, "magnified 6×" */}
        <g opacity={win(f, tLam + 15, tNum - 10)}>
          <Magnify src={ptOf(faceFlat(TOP_C, TOP_R), [0.45 * Math.cos(BREST[1] * D2R / 2), 0.45 * Math.sin(BREST[1] * D2R / 2)])} srcR={24} at={IC} r={IR + 12} label="magnified $6\times$" ly={IC[1] - IR - 46} o={1} />
        </g>
        <Keyword f={f} text="Part 1: polar" at={[XC, 640]} appear={tPolar} out={tParts - 20} />
      </Svg>
      <TeX s={String.raw`\lambda`} x={IC[0] + IR * 0.8} y={IC[1] + 20} size={T.key} c={C.second} ax={0} o={win(f, tLam + 15, tNum - 10)} halo />
      <TeX s={String.raw`r\to a\cos\varphi,\quad \theta\to\lambda`} x={XC} y={730} size={60} c={C.ink} o={win(f, tPolar + 15, tParts - 15)} />
      <TeX s={eqs[0]} x={XC} y={650} size={60} c={C.ink} o={win(f, tParts, tCx - 15)} />
      <TeX s={eqs[1]} x={XC} y={740} size={60} c={C.ink} o={win(f, AT(k, 7, "and the y part"), tCx - 15)} />
      {/* Part 1 lessons (stack bottom guard): at y 600 the last row (≈ −332 km) sat at y ≈ 906, in the caption band; 528 ends at 868 */}
      <CalcStack f={f} x={XC + 100} y={528} size={48} maxLines={2} rows={[
        { lhs: String.raw`\cos(-4.5^\circ)`, rhs: String.raw`\approx0.9969`, at: tCx },
        { lhs: "x", rhs: String.raw`=4230\times0.9969\approx4217\ \text{km}`, at: tX - 30, cont: true },
        { lhs: String.raw`\sin(-4.5^\circ)`, rhs: String.raw`\approx-0.0785`, at: tSy },
        { lhs: "y", rhs: String.raw`=4230\times(-0.0785)`, at: tY - 30, cont: true },
        { lhs: "", rhs: String.raw`\approx-332\ \text{km}`, at: tY, cont: true },
      ]} />
    </Scene>
  );
};

// ================================================================ s18 the position vector and r̂
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_position_vector");
  const tAx = SS(k, 1), t1 = SS(k, 2), t2 = SS(k, 3), t3 = SS(k, 4), tB = SS(k, 5), tChk = SS(k, 6), tPy1 = SS(k, 7), tPy2 = SS(k, 8), tOne = SS(k, 9), tDiv = SS(k, 10),
    tUnit = SS(k, 11), tHat = AT(k, 12, "r hat"), tParts = SS(k, 13), tNum = SS(k, 14), tP4 = SS(k, 15);
  const cam = spinPath([{ f: 0, lat: 24, lon: 34, dist: 3.4 }, { f: LEN(k) + 10, lat: 26, lon: 30, dist: 3.4 }], f);
  const G = globeG(cam);
  const ex = e2g([1, 0, 0]), ey = e2g([0, 1, 0]), ez = e2g([0, 0, 1]);
  const r = BR.rhat as number[];
  const pX: V3 = [ex[0] * r[0], ex[1] * r[0], ex[2] * r[0]], pXY: V3 = [pX[0] + ey[0] * r[1], pX[1] + ey[1] * r[1], pX[2] + ey[2] * r[1]], pB = ll(BREST[0], BREST[1]);
  const c0 = G.pw([0, 0, 0]), sB = G.pw(pB), sX = G.pw(pX), sXY = G.pw(pXY);
  // K6 k6r2: the 4217 tag sits 58 px off the x leg along its upward normal (straight above, it sat on the sloping leg and the x axis)
  const lX = Math.hypot(sX[0] - c0[0], sX[1] - c0[1]) || 1, nX0: Pt = [(sX[1] - c0[1]) / lX, -(sX[0] - c0[0]) / lX], nX: Pt = nX0[1] > 0 ? [-nX0[0], -nX0[1]] : nX0;
  const hatO = fin(f, tUnit), tealO = 1 - 0.7 * fin(f, tDiv);
  const sHat = G.pw([pB[0] * 1.32, pB[1] * 1.32, pB[2] * 1.32]);
  const lines = cutAt(EQ_S18, String.raw`,\quad `);
  const P1 = cutAt(lines[0], String.raw`a\cos\varphi`);
  const fade1 = fout(f, tParts - 20), fadeF = fout(f, tChk - 20);
  return (
    <Scene>
      <Earth cam={cam} alpha={0.45} coast={0.4}
        over={(Gg) => <>
          {gseg(Gg, [0, 0, 0], [ex[0] * 1.3, ex[1] * 1.3, ex[2] * 1.3], C.second, 3, 0.7, "8 8")}
          {gseg(Gg, [0, 0, 0], [ey[0] * 1.3, ey[1] * 1.3, ey[2] * 1.3], C.second, 3, 0.7, "8 8")}
          {gseg(Gg, [0, 0, 0], [ez[0] * 1.3, ez[1] * 1.3, ez[2] * 1.3], C.second, 3, 0.7, "8 8")}
          <Arrow p={c0} q={sB} color={RAD} o={tealO} />
          <g opacity={fin(f, t1)}>
            <line x1={c0[0]} y1={c0[1]} x2={sX[0]} y2={sX[1]} stroke={C.second} strokeWidth={6} strokeDasharray="14 8" />
            <line x1={sX[0]} y1={sX[1]} x2={sXY[0]} y2={sXY[1]} stroke={C.second} strokeWidth={6} strokeDasharray="14 8" opacity={fin(f, t2)} />
            <line x1={sXY[0]} y1={sXY[1]} x2={sB[0]} y2={sB[1]} stroke={C.second} strokeWidth={6} strokeDasharray="14 8" opacity={fin(f, t3)} />
            <line x1={c0[0]} y1={c0[1]} x2={sXY[0]} y2={sXY[1]} stroke={C.gold} strokeWidth={4} opacity={win(f, tPy1, tPy2 + 30)} />
          </g>
          <circle cx={c0[0]} cy={c0[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
          <circle cx={sB[0]} cy={sB[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
          <Arrow p={sB} q={sHat} color={C.second} o={hatO} />
        </>} />
      <TeX s={H.r} x={sHat[0] + 30} y={sHat[1] - 10} size={T.key} c={C.second} ax={0} o={fin(f, tHat)} halo />
      <GSrc />
      <Svg>
        <Lbl x={(c0[0] + sX[0]) / 2 + 58 * nX[0]} y={(c0[1] + sX[1]) / 2 + 58 * nX[1] + 14} t="4217" c={C.second} s={T.floor} a="middle" o={fin(f, tB) * fade1} />
        <Lbl x={(sX[0] + sXY[0]) / 2 + 26} y={(sX[1] + sXY[1]) / 2 + 30} t="−332" c={C.neg} s={T.floor} o={fin(f, tB + 10) * fade1} />
        <Lbl x={(sXY[0] + sB[0]) / 2 + 22} y={(sXY[1] + sB[1]) / 2} t="4764" c={C.second} s={T.floor} o={fin(f, tB + 20) * fade1} />
        {/* review 1 M6: the keyword leaves before the a cos φ term (and its brace) comes in, on S1 */}
        <Keyword f={f} text="two steps together" at={[XC, 130]} appear={0} out={tAx - 15} />
        {/* review 1 S12: the links come in from below / above the picture (they crossed the Brest arrow and the 4217 tag) */}
        <CurvedLink f={f} from={[XC - 10, 280]} to={[(c0[0] + sXY[0]) / 2 + 10, (c0[1] + sXY[1]) / 2 + 8]} start={tPy1 + 20} end={tPy2} ctl={[780, 700]} />
        <CurvedLink f={f} from={[XC - 10, 480]} to={[(c0[0] + sB[0]) / 2 + 8, (c0[1] + sB[1]) / 2 - 6]} start={tPy2 + 20} end={tOne} ctl={[820, 160]} />
        <Keyword f={f} text="Part 4: up" at={[XC, 580]} appear={tP4} />
      </Svg>
      {/* K6 k6r1: the 4217 tag above the x leg (it sat on the −332 tag); the three lines at calc size (the under-word ran to x 2004) */}
      <Layered parts={[{ t: P1[0] }, { t: String.raw`a\cos\varphi`, u: { w: String.raw`\text{distance from the axis}`, c: C.gold } }, { t: P1[1] }]} x={XC} y={150} size={T.calc}
        layers={[{ t: [1], u: [1], o: fin(f, tAx) * fadeF }, { t: [0, 2], o: fin(f, t1) * fadeF }]} />{/* review 1 M6: the brace comes in WITH its a cos φ term (S1), the rest of x on S2 */}
      <TeX s={lines[1]} x={XC} y={305} size={T.calc} c={C.ink} o={fin(f, t2) * fadeF} />
      <TeX s={lines[2]} x={XC} y={420} size={T.calc} c={C.ink} o={fin(f, t3) * fadeF} />
      <TeX s={String.raw`(4217,\ -332,\ 4764)\ \text{km}`} x={XC} y={520} size={60} c={C.ink} o={fin(f, tB) * fadeF} />
      <TeX s={String.raw`(4217,\ -332,\ 4764)\ \text{km}`} x={XC} y={130} size={52} c={C.ink} o={fin(f, tChk - 10) * fade1} />
      <CalcStack f={f} x={XC + 20} y={250} size={46} maxLines={3} rows={[
        { lhs: "", rhs: String.raw`\sqrt{4217^2+332^2}`, at: tPy1 + 20, out: tParts - 20 },
        { lhs: "", rhs: String.raw`=\sqrt{17\,783\,000+110\,000}`, at: tPy1 + 45, out: tParts - 20, cont: true },
        { lhs: "", rhs: String.raw`=\sqrt{17\,893\,000}\approx4230\ \text{km}`, at: AT(k, 7, "gives back"), out: tParts - 20, cont: true },
        { lhs: "", rhs: String.raw`\sqrt{4230^2+4764^2}`, at: tPy2 + 20, out: tParts - 20 },
        { lhs: "", rhs: String.raw`=\sqrt{17\,893\,000+22\,696\,000}`, at: tPy2 + 45, out: tParts - 20, cont: true },
        { lhs: "", rhs: String.raw`=\sqrt{40\,589\,000}\approx6371\ \text{km}`, at: AT(k, 8, "gives six thousand"), out: tParts - 20, cont: true },
        { lhs: "", rhs: String.raw`\cos^2\varphi+\sin^2\varphi=1`, at: tOne, out: tParts - 20 },
      ]} />
      <TeX s={String.raw`${H.r}=(\cos\varphi\cos\lambda,`} x={XC} y={200} size={60} c={C.ink} o={fin(f, tParts)} />
      <TeX s={String.raw`\cos\varphi\sin\lambda,\ \sin\varphi)`} x={XC + 120} y={290} size={60} c={C.ink} o={fin(f, tParts)} />
      {/* calc audit M5: the division is shown, on "For Brest, they're about" (0.6619, −0.0521, 0.7478) */}
      <TeX s={String.raw`(4217,\ -332,\ 4764)\div6371`} x={XC} y={390} size={52} c={C.ink} o={fin(f, tNum)} />
      <TeX s={String.raw`\approx(0.662,\ -0.052,\ 0.748)`} x={XC + 40} y={470} size={52} c={C.ink} o={fin(f, AT(k, 14, "about zero point"))} />
      {void [tChk, EQ_S19]}
    </Scene>
  );
};

// ================================================================ s19 Khulna (flight, side view, top view)
const S19: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19_khulna");
  const tKh = AT(k, 1, "Khulna"), tBd = AT(k, 1, "Bangladesh"), tSb = AT(k, 1, "Sundarbans"), tAm = AT(k, 1, "Cyclone Amphan"), tLL = SS(k, 2), tSide = SS(k, 3),
    tZ = AT(k, 4, "about two thousand four hundred"), tR = AT(k, 5, "five thousand eight hundred"), tLow = SS(k, 6), tTop = SS(k, 7), tX = AT(k, 8, "about forty one"),
    tY = AT(k, 9, "five thousand eight hundred"), tAlong = SS(k, 10), tLen = SS(k, 11);
  const zOut = tLL + 40;
  // K6 k6r1: unzoomed dist 4.3 → 4.6 and centre y 420 → 400 (the disc reached y 829, on the source line); the place names show only
  // when zoomed in (≥ 85 %: they piled up while the camera zoomed), and the source line steps aside while the growing disc covers it
  const cam = globePath([{ f: 0, lat: 28, lon: 40, dist: 4.6, pp: [520, 400] }, { f: tKh + 10, lat: 21, lon: 89.5, dist: 2.4, pp: [600, 470] },
    { f: tLL, lat: 21, lon: 89.5, dist: 2.4, pp: [600, 470] }, { f: zOut + 30, lat: 22, lon: 70, dist: 4.6, pp: [520, 400] }, { f: LEN(k) + 10, lat: 22, lon: 70, dist: 4.6, pp: [520, 400] }], f);
  const zoom = clamp((4.6 - cam.dist) / (4.6 - 2.4), 0, 1);
  const gz = clamp((zoom - 0.85) / 0.15, 0, 1);
  const dk = discOf(cam, GFULL), srcO = zoom >= 0.5 ? 1 : clamp((814 - (dk.c[1] + dk.r)) / 12, 0, 1);
  const oA = fout(f, tSide - 12, 12), oB = win(f, tSide, tTop - 12, 12), oC = fin(f, tTop, 12);
  const CK = KH.ll[0] * D2R, KU = Math.cos(CK), KV = Math.sin(CK);
  const am: [number, number][] = KH.amphan.lat.map((la: number, i: number) => [la, KH.amphan.lon[i]]);
  const sideK: FItem[] = [
    { k: "dot", p: [0, 0], c: C.gold, at: 0, same: false }, { k: "seg", a: [0, -1.1], b: [0, 1.18], c: C.local, w: 4, at: 0, same: false },
    { k: "seg", a: [0, 0], b: [1, 0], c: C.local, w: 4, at: 0, same: false },
    { k: "seg", a: [0, 0], b: [BU, BV], c: C.muted, w: 3, dash: "8 8", at: tSide, same: false }, { k: "seg", a: [BU, BV], b: [BU, 0], c: C.muted, w: 3, dash: "8 8", at: tSide, same: false },
    { k: "arrow", a: [0, 0], b: [KU, KV], c: RAD, at: tSide },
    { k: "wedge", r: 0.4, a0: 0, a1: KH.ll[0], c: C.gold, fo: 0.2, at: tSide + 20, same: false },
    { k: "seg", a: [KU, KV], b: [KU, 0], c: C.local, w: 5, dash: "12 8", at: tSide + 30, same: false },
    { k: "tick", p: [KU, 0], d1: [-1, 0], d2: [0, 1], s: 0.07, at: tSide + 30, same: false },
    { k: "band", a: [KU, 0], b: [KU, KV], c: C.second, w: 14, at: tZ - 20 },
    { k: "lbl", p: [KU, KV / 2], t: "2469 km", c: C.second, dx: 22, only: "2", at: tZ },
    { k: "lbl", p: [KU, KV], t: "2469 km", c: C.second, dx3: -14, dy3: -44, a3: "end", only: "3", at: tZ, same: false },   // review 1 M3: 3-D tag above-left of Khulna, inside the slice and clear of the arrow (it was clipped to "246")
    { k: "band", a: [0, 0], b: [KU, 0], c: C.second, w: 14, at: tR - 20 },
    { k: "lbl", p: [KU / 2, 0], t: "5873 km", c: C.second, dy: 46, a: "middle", dy3: 46, a3: "middle", at: tR },
  ];
  const fu = KU * KH.cosl, fv = KU * KH.sinl;
  const topK: FItem[] = [
    { k: "dot", p: [0, 0], c: C.gold, at: 0, same: false },
    { k: "arrow", a: [0, 0], b: [1.2, 0], c: C.second, w: 5, head: 24, at: 0, same: false }, { k: "arrow", a: [0, 0], b: [0, 1.2], c: C.second, w: 5, head: 24, at: 0, same: false },
    { k: "tex", p: [1.2, 0], t: String.raw`x`, c: C.second, size: 54, dx: 10, dy: 40, at: 0, same: false }, { k: "tex", p: [0, 1.2], t: String.raw`y`, c: C.second, size: 54, dx: 34, at: 0, same: false },
    { k: "dot", p: [fu, fv], c: C.key, r: 9, at: tTop + 10 },
    { k: "seg", a: [0, 0], b: [fu, fv], c: RAD, w: 8, at: tTop + 20, same: false },
    { k: "arc", r: 0.4, a0: 0, a1: KH.ll[1], c: C.second, w: 6, at: tTop + 30, same: false },
    // checklist "all maths is TeX": the x and y tags are KaTeX
    { k: "tex", p: [fu, 0], t: String.raw`x\approx41\ \text{km}`, c: C.second, size: 46, dx: -18, dy: 40, ax: 1, dx3: 18, dy3: 40, ax3: 0, at: tX },   // flat: left of the y axis (it ran into the x-axis name)
    { k: "tex", p: [fu, fv / 2], t: String.raw`y\approx5873\ \text{km}`, c: C.second, size: 46, dx: 24, ax: 0, dx3: 24, ax3: 0, at: tY },
  ];
  const Gt = globeG(CAM_TOP, TV3);
  const pK = Gt.pw(ll(KH.ll[0], KH.ll[1])), c0t = Gt.pw([0, 0, 0]);
  const facePx = (P: (u: number, v: number) => Pt) => P;
  return (
    <Scene>
      {oA > 0 ? <>
        <Earth cam={cam} box={GFULL} o={oA} coast={0.55} borders={0.6}
          over={(Gg) => <>
            <path d={llPath(Gg, am, 1.003)} fill="none" stroke={C.key} strokeWidth={4} strokeOpacity={0.85} opacity={fin(f, tAm)} />
            {gdot(Gg, KH.ll[0], KH.ll[1], C.gold, 11, fin(f, tKh))}
            {plab(Gg, KH.ll[0], KH.ll[1], "Khulna", fin(f, tKh) * gz, 20, -32)}
            {plab(Gg, 27.2, 90.3, "Bangladesh", fin(f, tBd) * gz, 0, 0, "middle")}
            {plab(Gg, 21.8, 89.2, "Sundarbans", fin(f, tSb) * gz, -16, 30, "end", true)}
            {plab(Gg, 17.5, 88.5, "Bay of Bengal", fin(f, tBd + 20) * gz, 0, 0, "middle", true)}
            {plab(Gg, am[Math.floor(am.length * 0.35)][0], am[Math.floor(am.length * 0.35)][1], "Amphan", fin(f, tAm) * gz, 22, 0, "start", true)}
          </>} />
        <GlobeFrame id="s19k" zoom={zoom * oA} right={zoom * oA} disc={discOf(cam, GFULL)} />
        <SourceBelow text="Image: NASA BMNG · Natural Earth · Track: IBTrACS v04r01 (Amphan, 16–21 May 2020)" pic={{ x: 60, y: 20, w: 1300, h: 790 }} w={1300} o={oA * srcO} name="s19 src" />
      </> : null}
      {oB > 0 ? <TwoView f={f} cam={camFace(KH.ll[1])} cut={merCut(1, KH.ll[1])} face={merFace(KH.ll[1])} flatC={FLAT_C} flatR={FLAT_R} items={sideK} o3={oB} flatO={oB}
        flatBase={(P) => <MerFlatBase P={P} />} /> : null}
      {oC > 0 ? <TwoView f={f} cam={CAM_TOP} cut={{ kind: "lat", lat0: 0, lift: 0, capO: 0, polar: true }} face={eqFace} flatC={TOP_C} flatR={TOP_R} items={topK} o3={oC} flatO={oC}
        flatBase={(P) => <DiscFlatBase P={P} />}
        extra3={() => <g opacity={fin(f, tAlong)}><Arrow p={c0t} q={pK} color={RAD} /><circle cx={pK[0]} cy={pK[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} /></g>} /> : null}
      <Svg>
        <Keyword f={f} text="another city" at={[XZ, 170]} appear={0} out={tLL - 20} o={oA} />
        <Keyword f={f} text="22.8° N, 89.6° E" at={[XZ, 280]} appear={tLL} out={tSide - 24} />
        <Keyword f={f} text="lower, and" at={[KX3, 440]} appear={tLow} out={tTop - 24} s={48} />
        <Keyword f={f} text="farther from" at={[KX3, 500]} appear={tLow} out={tTop - 24} s={48} />
        <Keyword f={f} text="the axis" at={[KX3, 560]} appear={tLow} out={tTop - 24} s={48} />
        <Keyword f={f} text="almost along $y$" at={[1440, 150]} appear={tAlong} s={50} />
      </Svg>
      {oB > 0 ? <CalcStack f={f} x={XC + 125} y={620} size={46} maxLines={2} o={oB} rows={[
        { lhs: String.raw`\sin\varphi`, rhs: String.raw`=\sin22.8^\circ\approx0.3875`, at: AT(k, 3, "sine phi is") },
        { lhs: "z", rhs: String.raw`=6371\times0.3875\approx2469\ \text{km}`, at: tZ - 30 },
        { lhs: String.raw`\cos\varphi`, rhs: String.raw`=\cos22.8^\circ\approx0.9219`, at: AT(k, 5, "Cosine phi is") },
        { lhs: String.raw`a\cos\varphi`, rhs: String.raw`=6371\times0.9219\approx5873\ \text{km}`, at: tR - 30 },
      ]} /> : null}
      {oC > 0 ? <CalcStack f={f} x={XC + 20} y={580} size={44} maxLines={4} o={oC} rows={[
        { lhs: String.raw`\cos\lambda`, rhs: String.raw`=\cos89.6^\circ\approx0.00698`, at: AT(k, 8, "Its cosine") },
        { lhs: "x", rhs: String.raw`=5873\times0.00698\approx41\ \text{km}`, at: tX - 30 },
        { lhs: String.raw`\sin\lambda`, rhs: String.raw`=\sin89.6^\circ\approx1.000`, at: AT(k, 9, "Its sine") },
        { lhs: "y", rhs: String.raw`=5873\times1.000\approx5873\ \text{km}`, at: tY - 30 },
        { lhs: "", rhs: String.raw`41^2+5873^2+2469^2`, at: tLen },
        { lhs: "", rhs: String.raw`=1\,681+34\,492\,129+6\,095\,961`, at: tLen + 30 },
        { lhs: "", rhs: String.raw`=40\,589\,771`, at: tLen + 60 },
        { lhs: "", rhs: String.raw`\sqrt{40\,589\,771}\approx6371\ \text{km}`, at: AT(k, 11, "six thousand") },
      ]} /> : null}
      {void [facePx, EQ_S19]}
    </Scene>
  );
};

// ================================================================ s20 the spinning ground: U = Ω a cos φ
const S20: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20_spin_rate");
  // fix loop 1 (review 1 S2): the noon-to-noon rows are spoken (S9-S11, one row each); every later sentence moved +3
  const tCircle = SS(k, 1), tRad = SS(k, 2), tHow = SS(k, 3), tT = SS(k, 6), tCapT = AT(k, 7, "capital T"), tSun = SS(k, 8), tFar = SS(k, 12), tDist = AT(k, 13, "two pi times"),
    tDist2 = SS(k, 14), tSpeed = SS(k, 15), tU = SS(k, 16), tPull = SS(k, 17), tRadS = SS(k, 18), tOm = AT(k, 19, "capital Omega"), tRes = SS(k, 20), tRing = SS(k, 21);
  const cam = spinPath([{ f: 0, lat: 28, lon: 10, dist: 3.4 }, { f: tFar, lat: 30, lon: -30, dist: 3.4 }, { f: LEN(k) + 10, lat: 30, lon: -40, dist: 3.4 }], f);
  const trip = prog(f, tDist, tDist2 + 60);
  const lonD = LON0 + 360 * trip;
  const G = globeG(cam);
  const pc = G.pw([0, BV, 0]), pb = G.pw(ll(PHI, LON0));
  const A = cutAt(EQ_S20, String.raw`,\qquad `), A1 = cutAt(A[0], String.raw`=\Omega`);
  return (
    <Scene>
      <Earth cam={cam} coast={0.45}
        over={(Gg) => {
          const ring = Array.from({ length: 121 }, (_, i) => ll(PHI, (360 * i) / 120, 1.002));
          const sv = splitVis(Gg, ring);
          const nT = Math.max(2, Math.round(120 * trip)), trail = Array.from({ length: nT + 1 }, (_, i) => ll(PHI, LON0 + (360 * trip * i) / nT, 1.004));
          const tv = splitVis(Gg, trail);
          return <>
            {gseg(Gg, [0, -1.3, 0], [0, 1.35, 0], C.local, 4, 1, "12 8")}
            {sv.front.map((s, i) => <path key={i} d={poly(s)} fill="none" stroke={C.second} strokeWidth={5} opacity={fin(f, tCircle)} />)}
            {sv.back.map((s, i) => <path key={`b${i}`} d={poly(s)} fill="none" stroke={C.second} strokeWidth={3} strokeDasharray="8 8" opacity={0.5 * fin(f, tCircle)} />)}
            <line x1={pc[0]} y1={pc[1]} x2={pb[0]} y2={pb[1]} stroke={C.second} strokeWidth={5} opacity={fin(f, tRad) * fout(f, tDist - 10)} />
            {tv.front.map((s, i) => <path key={`t${i}`} d={poly(s)} fill="none" stroke={C.gold} strokeWidth={7} opacity={fin(f, tDist)} />)}
            {gdot(Gg, PHI, lonD, C.gold, 12, 1)}
          </>;
        }} />
      {/* K6 k6r1: right of the axis (the dashed axis ran through the tag at the segment's middle) */}
      {/* k6r2: the globe turns Brest across the axis, so the tag starts right of whichever end is further right (continuous), under the parallel (k6r3: above it, the ring crossed it) */}
      <TeX s={String.raw`a\cos\varphi`} x={Math.max(pc[0], pb[0]) + 18} y={pb[1] + 44} size={48} c={C.second} ax={0} o={fin(f, tRad) * fout(f, tDist - 10)} halo />
      <GSrc />
      <Svg>
        <Keyword f={f} text="a second meaning" at={[XC, 140]} appear={0} out={tHow - 20} />
        <Keyword f={f} text="how fast is the ground moving?" at={[XC, 140]} appear={tHow} s={T.floor + 4} />
        <ClockGlyph x={1130} y={250} r={30} h={11.9} o={win(f, tT, tRes - 22)} />
        <path d="M1210 230 l8 16 l18 2 l-13 12 l3 18 l-16 -9 l-16 9 l3 -18 l-13 -12 l18 -2 z" fill={C.key} opacity={win(f, tT, tRes - 22)} />
        <Lbl x={1250} y={250} t="one turn: 23 h 56 min 4 s" c={C.key} s={T.floor} o={win(f, tT, tRes - 22)} />
        <g opacity={win(f, tSun, tRes - 22)}>
          <SunGlyph x={1140} y={345} s={0.5} />
          <ellipse cx={1140} cy={345} rx={60} ry={22} fill="none" stroke={C.muted} strokeWidth={3} />
          <circle cx={1200} cy={345} r={8} fill={C.first} />
          <Lbl x={1240} y={345} t="noon to noon: 4 min longer" c={C.key} s={T.floor} />
        </g>
        <Keyword f={f} text="spin rate, rad/s" at={[1420, 800]} appear={tRadS + 30} out={tRing - 22} />
        <g opacity={fin(f, tRing)}>
          <circle cx={1130} cy={800} r={26} fill="none" stroke={C.muted} strokeWidth={3} />
          <Arrow p={[1130, 774]} q={[1170, 774]} color={C.first} w={5} head={16} halo={false} />
        </g>
        <Lbl x={1180} y={800} t="speed = radius $\times$ turning rate" c={C.key} s={T.floor} o={fin(f, tRing)} />
      </Svg>
      {/* still review k6r2: T names the "one turn" row, left of its clock (under the star icon it sat on the star) */}
      <TeX s="T" x={1084} y={236} size={T.key} c={C.ink} ax={1} o={win(f, tCapT, tRes - 22)} />
      {/* fix loop 1 (review 1 S2): each row on its own spoken words, at full ink (older rows dim), until the next question */}
      <CalcStack f={f} x={XC} y={430} size={50} maxLines={4} rows={[
        { lhs: "", rhs: String.raw`360^\circ\div365\ \text{days}\approx1^\circ\ \text{a day}`, at: AT(k, 9, "so each day"), out: tFar - 10 },
        { lhs: "", rhs: String.raw`\text{noon to noon: }360^\circ+1^\circ=361^\circ`, at: AT(k, 10, "three hundred and sixty one"), out: tFar - 10 },
        { lhs: "", rhs: String.raw`24\ \text{h}=1440\ \text{min}`, at: AT(k, 11, "one thousand four hundred and forty minutes"), out: tFar - 10 },
        { lhs: "", rhs: String.raw`1440\div360=4\ \text{min per }1^\circ`, at: AT(k, 11, "divided by"), out: tFar - 10 },
      ]} />
      <TeX s={String.raw`\text{distance}=2\pi\,a\cos\varphi`} x={XC} y={450} size={60} c={C.ink} o={fin(f, tDist2) * fout(f, tRes - 22)} />
      <TeX s={String.raw`\text{speed}=\text{distance}\div T`} x={XC} y={540} size={60} c={C.ink} o={fin(f, tSpeed) * fout(f, tRes - 22)} />
      <TeX s={String.raw`U=\textcolor{${VIOLET}}{\dfrac{2\pi}{T}}\,a\cos\varphi`} x={XC} y={650} size={T.calc} c={C.ink} o={fin(f, tU) * fout(f, tRes - 22)} glow={pulse(f, tPull, 30)} />
      <TeX s={A[1]} x={XC} y={800} size={60} c={VIOLET} o={win(f, tOm, tRing - 22)} />
      <TeX s={A1[0]} x={XC} y={450} size={T.eq} c={C.ink} o={fin(f, tRes)} />
      <TeX s={String.raw`=\Omega${A1[1]}`} x={XC + 40} y={630} size={96} c={C.ink} o={fin(f, tRes + 15)} />
    </Scene>
  );
};

// ================================================================ s21 ground speeds at real places (keep line K2)
const S21: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21_ground_speeds");
  const g0 = keepGone(k, 2);
  // fix loop 1 (review 1 S3): the easy-numbers sentence is now four (S8-S11: 2π × 6400, ÷ 24 h, × 3.6 explained, 464.6 × 3.6); later sentences +3
  const tNum = SS(k, 3), tT = SS(k, 4), tOm = SS(k, 5), tEq = SS(k, 6), tUeq = AT(k, 7, "which is about"), tEasy = SS(k, 8), tJet = SS(k, 12), tS = SS(k, 13), tK = SS(k, 14),
    tB = SS(k, 15), tL = SS(k, 16), tL2 = SS(k, 17), tPole = SS(k, 18), tEast = SS(k, 19), tFeel = SS(k, 20), tCP = SS(k, 21);
  const cam = spinPath([{ f: 0, lat: 25, lon: 40, dist: 3.4 }, { f: tS - 30, lat: 20, lon: 80, dist: 3.4 }, { f: tS + 20, lat: 15, lon: 95, dist: 3.4 },
    { f: tK + 20, lat: 25, lon: 75, dist: 3.4 }, { f: tB + 20, lat: 35, lon: 10, dist: 3.4 }, { f: tL + 20, lat: 52, lon: 20, dist: 3.4 },
    { f: tPole + 30, lat: 58, lon: 30, dist: 3.4 }, { f: LEN(k) + 10, lat: 40, lon: 40, dist: 3.4 }], f);
  const places: { la: number; lo: number; U: number; at: number; name: string }[] = [
    { la: 0, lo: 60, U: SP.U[0], at: tEq, name: "equator" }, { la: SING[0], lo: SING[1], U: SP.U[1], at: tS, name: "Singapore" },
    { la: KHULNA[0], lo: KHULNA[1], U: SP.U[2], at: tK, name: "Khulna" }, { la: BREST[0], lo: BREST[1], U: SP.U[3], at: tB, name: "Brest" },
    { la: LYB[0], lo: LYB[1], U: SP.U[4], at: tL2, name: "Longyearbyen" },
  ];
  const G = globeG(cam);
  const tipOf = (la: number, lo: number, U: number): [Pt, Pt] => {
    const b = ll(la, lo, 1.004), e = eastAt(lo), p0 = G.pw(b), w = G.wpp(b) * (U / 1.5);
    return [p0, G.pw([b[0] + e[0] * w, b[1] + e[1] * w, b[2] + e[2] * w])];
  };
  return (
    <Scene>
      <Earth cam={cam} coast={0.45}
        over={(Gg) => <>
          {gseg(Gg, [0, -1.3, 0], [0, 1.35, 0], C.local, 4, 1, "12 8")}
          {[0, KHULNA[0], BREST[0], LYB[0]].map((la) => <path key={la} d={parPath(Gg, la)} fill="none" stroke={C.second} strokeWidth={3} opacity={0.7} />)}
          {places.map((p) => { const [a, b] = tipOf(p.la, p.lo, p.U); const o = fin(f, p.at) * facing(Gg, p.la, p.lo);
            return o > 0 ? <AnimatedWindArrow key={p.name} from={a} to={b} speed={p.U / 20} f={f} c={C.first} px={8} head={28} o={o} /> : null; })}
          {[SING, KHULNA, BREST, LYB].map((p, i) => <g key={i}>{gdot(Gg, p[0], p[1], C.gold, 9, fin(f, places[i + 1].at))}</g>)}
          {gdot(Gg, 90, 0, C.key, 9, fin(f, tPole))}
          <path d={poly(Array.from({ length: 31 }, (_, i) => Gg.pw(ll(72, -20 + 4 * i, 1.01))))} fill="none" stroke={C.key} strokeWidth={5} opacity={fin(f, tEast)} />
        </>} />
      <GSrc />
      <Svg>
        {places.slice(1).map((p) => { const [, b] = tipOf(p.la, p.lo, p.U); const o = win(f, p.at + 20, p.at + 260) * facing(G, p.la, p.lo);
          // K6 k6r1: the tag stays left of x 1070 (Khulna's ran into the maths column)
          const tg = `${p.name} ≈ ${Math.round(p.U)}`;
          return o > 0 ? <g key={p.name} data-lc-maplabel="1"><Lbl x={Math.min(b[0] + 14, 1036 - textW(tg, T.floor))} y={b[1] - 30} t={tg} c={C.key} s={T.floor} o={o} /></g> : null; })}
        <g data-lc-maplabel="1"><Lbl x={G.p(90, 0)[0] + 20} y={G.p(90, 0)[1] + 34} t="0" c={C.key} s={T.floor} o={fin(f, tPole) * (G.vis(90, 0) ? 1 : 0)} /></g>
        <Keyword f={f} text="east, the way the Earth turns" at={[XC, 620]} appear={tEast} out={tFeel - 20} s={T.floor + 4} />
        <Keyword f={f} text="we move with the ground" at={[XC, 620]} appear={tFeel} />
        <Keyword f={f} text="more: the cross product movie" at={[XC, 720]} appear={AT(k, 21, "cross product movie")} s={T.floor + 4} />
        <g opacity={win(f, tJet, tS - 10)}><PlaneIcon p={[1140, 620]} s={1.2} /><Lbl x={1200} y={620} t="passenger jet ≈ 900 km/h" c={C.key} s={T.floor} /></g>
      </Svg>
      <TeX s={EQ_S21} x={XC} y={130} size={T.eq} c={C.ink} o={fin(f, g0 + 8)} />
      <CalcStack f={f} x={XC - 30} y={230} size={46} maxLines={3} rows={[
        { lhs: "T", rhs: String.raw`=23\times3600+56\times60+4`, at: tT },
        { lhs: "", rhs: String.raw`=82\,800+3\,360+4=86\,164\ \text{s}`, at: AT(k, 4, "is eighty six"), cont: true },
        { lhs: String.raw`\Omega`, rhs: String.raw`=\dfrac{2\pi}{86\,164\ \text{s}}\approx7.292\times10^{-5}\ \text{rad/s}`, at: AT(k, 5, "two pi divided"), h: 110, size: 44 },
        // calc audit S3: cos 0° = 1 on its words, and the U row carries the × 1
        { lhs: String.raw`\cos0^\circ`, rhs: "=1", at: AT(k, 6, "cosine phi is one"), size: 44 },
        { lhs: String.raw`U_{\text{eq}}`, rhs: String.raw`=7.292\times10^{-5}\times6.371\times10^{6}\times1`, at: tUeq - 40, size: 44 },
        { lhs: "", rhs: String.raw`\approx464.6\ \text{m/s}`, at: tUeq, size: 44, cont: true },
        // review 1 S3: every number of the easy check is spoken, each row on its words, at full ink (the house dims the older rows)
        { lhs: "", rhs: String.raw`2\pi\times6400\ \text{km}\approx40\,000\ \text{km}`, at: AT(k, 8, "which is about forty thousand") },
        { lhs: "", rhs: String.raw`40\,000\ \text{km}\div24\ \text{h}\approx1670\ \text{km/h}`, at: AT(k, 9, "is about one thousand") },
        { lhs: String.raw`1\ \text{m/s}`, rhs: String.raw`=3600\ \text{m/h}=3.6\ \text{km/h}`, at: AT(k, 10, "we multiply by") },
        { lhs: "", rhs: String.raw`464.6\ \text{m/s}\times3.6\approx1670\ \text{km/h}`, at: AT(k, 11, "is also about") },
        { lhs: "", rhs: String.raw`1670\div900\approx1.9`, at: AT(k, 12, "divided by nine hundred") },
        // calc audit M3: Singapore's latitude and its cos φ are named and shown before they are used
        { lhs: "", rhs: String.raw`\text{Singapore }1.35^\circ\text{N: }\cos\varphi\approx0.9997`, at: AT(k, 13, "one point three five"), size: 44 },
        { lhs: "", rhs: String.raw`464.6\times0.9997\approx464\ \text{m/s}`, at: AT(k, 13, "moves at about") },
        { lhs: "", rhs: String.raw`464.6\times0.9219\approx428\ \text{m/s}`, at: AT(k, 14, "so it's about") },
        { lhs: "", rhs: String.raw`464.6\times0.6639\approx308\ \text{m/s}`, at: AT(k, 15, "so it's about") },
        // calc audit M3: Longyearbyen's 78.2° N and cos 78.2° on their words; the product on "So the ground there"
        { lhs: "", rhs: String.raw`\text{Longyearbyen }78.2^\circ\text{N: }\cos\varphi\approx0.2045`, at: AT(k, 16, "seventy eight point two"), size: 44 },
        { lhs: "", rhs: String.raw`464.6\times0.2045\approx95\ \text{m/s}`, at: AT(k, 17, "So the ground there") },
      ]} />
      <KeepLine f={f} k={k} last={2} lines={[String.raw`height $a\sin\varphi$ ·`, String.raw`from the axis $a\cos\varphi$ ·`, String.raw`ground east at $\Omega\,a\cos\varphi$`]} />
      {/* Part 1 lessons B4: the keep line's own picture (the slice: a sin φ, a cos φ, east ⊙ at Ω a cos φ) */}
      <KeepPic kind="slice" c={[1150, 790]} R={310} o={fin(f, 4, 10) * fout(f, SE(k, 2), 10)} />
      {void [tNum, tOm, tCP]}
    </Scene>
  );
};

// ================================================================ s22 distance north: Δy = a Δφ (skip chip K3)
const S22: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22_distance_north");
  const chipA = AT(k, 1, "skip ahead"), chipEnd = chipA + 255;
  const tNorth = SS(k, 2), tSlice = SS(k, 3), tMer = AT(k, 4, "a meridian is part of"), tRad = SS(k, 5), tWalk = SS(k, 6), tRule = SS(k, 7), tEq = SS(k, 8), tOne = SS(k, 9),
    tTurn = SS(k, 10), tDeg = AT(k, 11, "which is zero point"), tKm = AT(k, 12, "that's about"), tEasy = SS(k, 13), tSame = SS(k, 14), tAlways = SS(k, 15);
  // K6 k6r1: the moving 5° wedge stops at 60° (at 80° its Δy tag left the 3-D frame) and the radius a is drawn at −45°, clear of the wedge
  const s0 = 20 + 40 * prog(f, tSame, tSame + 120), s1 = s0 + 5;
  const step = (a: number): [number, number] => [Math.cos(a * D2R), Math.sin(a * D2R)];
  const items: FItem[] = [
    { k: "dot", p: [0, 0], c: C.gold, at: 0, same: false },
    { k: "seg", a: [0, -1.1], b: [0, 1.15], c: C.local, w: 3, at: 0, same: false },
    { k: "arc", r: 1, a0: -90, a1: 90, c: C.second, w: 8, at: tMer },
    { k: "seg", a: [0, 0], b: step(-45), c: RAD, w: 6, at: tRad },
    { k: "tex", p: [0.5 * Math.cos(-45 * D2R), 0.5 * Math.sin(-45 * D2R)], t: String.raw`a`, c: RAD, size: 54, dx: -30, dy: 30, at: tRad + 6, same: false },
    { k: "seg", a: [0, 0], b: step(s0), c: C.key, w: 4, at: tWalk },
    { k: "seg", a: [0, 0], b: step(s1), c: C.key, w: 4, at: tWalk, same: false },
    { k: "arc", r: 0.32, a0: s0, a1: s1, c: C.gold, w: 7, at: tWalk + 20, same: false },
    { k: "arc", r: 1.03, a0: s0, a1: s1, c: C.second, w: 16, at: tWalk + 30, same: false },
    { k: "tex", p: [0.42 * Math.cos((s0 + 2.5) * D2R), 0.42 * Math.sin((s0 + 2.5) * D2R)], t: String.raw`\Delta\varphi`, c: C.gold, size: 44, dx: 34, at: tWalk + 20, same: false },
    { k: "tex", p: [1.1 * Math.cos((s0 + 2.5) * D2R), 1.1 * Math.sin((s0 + 2.5) * D2R)], t: String.raw`\Delta y`, c: C.second, size: 48, dx: 30, ax: 0, dx3: 30, dy3: 30, ax3: 0, at: tWalk + 30, same: false },
    { k: "dot", p: step(s1), c: C.key, r: 11, at: tWalk + 30, same: false },
    { k: "lbl", p: [0, Math.sin((s0 + 2.5) * D2R)], t: "111.2 km", c: C.second, dx: -16, dy: 14, a: "end", at: tSame, only: "2" },   // left of the axis (it ran into the keywords)
  ];
  const flatIn = Math.max(chipEnd, tNorth);
  return (
    <Scene>
      <TwoView f={f} cam={CAMF} cut={merCut(prog(f, tSlice, tSlice + 40))} face={FACE_B} flatC={FLAT_C} flatR={FLAT_R} items={items} flatO={fin(f, flatIn, 15)}
        flatBase={(P) => <MerFlatBase P={P} />} />
      <Svg>
        <Keyword f={f} text="distances on the ground" at={[XC, 150]} appear={0} out={chipA - 20} />
        <Keyword f={f} text="first north, then east" at={[XC, 330]} appear={chipA - 8} out={flatIn - 12} />{/* review 1 S1 */}
        <Keyword f={f} text="going north" at={[KX3, 150]} appear={Math.max(tNorth, chipEnd + 10)} out={tMer - 20} />
        <Keyword f={f} text="circle round" at={[KX3 + 60, 150]} appear={tMer} />{/* review 1 S11: 60 px right, clear of the flat Δy tag */}
        <Keyword f={f} text="the centre" at={[KX3 + 60, 215]} appear={tMer} />
        <Keyword f={f} text="same everywhere" at={[KX3, 380]} appear={tSame} s={48} />
      </Svg>
      <TeX s={String.raw`s=r\,\theta`} x={XC} y={660} size={60} c={C.ink} o={win(f, tRule, tEq - 15)} />
      {/* K6 k6r1: calc size and shorter under-words (they ran to x 2299) */}
      <Layered parts={[{ t: String.raw`\Delta y=` }, { t: String.raw`a`, c: RAD, u: { w: String.raw`\text{radius}`, c: C.gold } },
        { t: String.raw`\,\Delta\varphi`, u: { w: String.raw`\text{change in }\varphi\text{ (rad)}`, c: C.gold } }]} x={XC} y={680} size={T.calc}
        layers={[{ t: "all", o: fin(f, tEq) * fout(f, tTurn - 15) }, { t: [], u: [1, 2], o: fin(f, tEq + 25) * fout(f, tTurn - 15) }]} />
      <TeX s={EQ_S22} x={KX3} y={460} size={T.eq} c={C.ink} o={fin(f, tTurn)} />
      <CalcStack f={f} x={XC + 50} y={600} size={44} maxLines={3} rows={[
        { lhs: String.raw`360^\circ`, rhs: String.raw`=2\pi\ \text{rad}`, at: AT(k, 10, "or two pi radians") },   // review 1 S4 / calc audit S4: the spoken full turn
        { lhs: String.raw`1^\circ`, rhs: String.raw`=\pi/180\approx0.01745\ \text{rad}`, at: tDeg - 20 },
        { lhs: String.raw`\Delta y`, rhs: String.raw`=6371\ \text{km}\times0.01745\approx111.2\ \text{km}`, at: tKm - 30 },
        { lhs: "", rhs: String.raw`6400\times0.0175=112`, at: tEasy, c: C.muted },
      ]} />

      <SkipChip f={f} k={k} to={keepTime("s25_degree_east")} />
      {void [tOne, tAlways]}
    </Scene>
  );
};

// ================================================================ s23 two examples: the nautical mile, Brest to the equator
const S23: React.FC = () => {
  const f = useCurrentFrame(), k = K("s23_north_examples");
  const tMin = SS(k, 1), tNm = AT(k, 2, "nautical mile"), tSouth = SS(k, 3), tMul = AT(k, 4, "is about"), tLonger = SS(k, 5), tCurve = SS(k, 6), tStraight = SS(k, 7);
  const walk = prog(f, tSouth + 20, SE(k, 3) + 20);
  const items: FItem[] = [
    ...allOld(sideItems(ALL0)).filter((x) => x.k !== "fill" && x.k !== "tick" && !(x.k === "seg" && x.dash)),
    { k: "arc", r: 1.025, a0: PHI * (1 - walk), a1: PHI, c: C.second, w: 14, at: tSouth + 20 },
    { k: "seg", a: [BU, BV], b: [BU, 0], c: C.second, w: 8, dash: "14 8", at: tLonger },
    // K6 k6r1: the 4764 tag sat on the radius arrow and its "a" (3-D: now right of the leg); the flat view names both lengths right of the rim
    // instead of two gold callouts whose links crossed the rim, the axis and the rows
    { k: "tex", p: [BU, BV / 2], t: String.raw`z`, c: C.second, size: 48, dx3: 22, ax3: 0, at: tLonger + 10, same: false, only: "3" },   // k6r2: "4764 km" crossed the curve's arc
    { k: "lbl", p: [1.03 * Math.cos(40 * D2R), 1.03 * Math.sin(40 * D2R)], t: "along the curve: 5382 km", c: C.second, dx: 30, dy: -6, at: tCurve, only: "2" },
    { k: "lbl", p: [BU, BV / 2], t: "straight: 4764 km", c: C.second, dx: 70, dy: 30, at: tStraight, only: "2" },
  ];
  const P2 = faceFlat(FLAT_C, FLAT_R);
  const IC: Pt = [1600, 470], IR = 110;
  return (
    <Scene>
      <TwoView f={f} cam={CAMF} cut={merCut(1)} face={FACE_B} flatC={FLAT_C} flatR={FLAT_R} items={items} flatBase={(P) => <MerFlatBase P={P} />} />
      <Svg>
        <Keyword f={f} text="two examples" at={[KX3, 150]} appear={0} out={tNm - 20} />
        <Keyword f={f} text="nautical mile" at={[KX3, 150]} appear={tNm} out={tSouth - 15} />
        <g opacity={win(f, tMin + 10, tSouth - 15)}>
          <circle cx={IC[0]} cy={IC[1]} r={IR + 12} fill={C.bg} stroke={C.grid} strokeWidth={3} />
          <path d={arcD([IC[0] - 300, IC[1] + 60], 400, 2, 22)} fill="none" stroke={C.second} strokeWidth={14} />
        </g>
        {/* Part 1 lessons B1: ring on the meridian at Brest (flat view), leader, label */}
        <g opacity={win(f, tMin + 10, tSouth - 15)}>
          <Magnify src={ptOf(P2, [1.025 * BU, 1.025 * BV])} srcR={24} at={IC} r={IR + 12} label="$1'$ magnified $60\times$" ly={IC[1] - IR - 46} o={1} />
        </g>
        {void P2}
      </Svg>
      <CalcStack f={f} x={XC + 40} y={600} size={56} maxLines={2} rows={[
        { lhs: "", rhs: String.raw`111.2\ \text{km}\div60\approx1.85\ \text{km}`, at: AT(k, 1, "which is about"), out: tCurve - 15 },
        { lhs: "", rhs: String.raw`48.4\times111.2\ \text{km}\approx5382\ \text{km}`, at: tMul - 20, out: tCurve - 15 },
      ]} />
      {/* calc audit S1: the spoken height 4764 km is shown, next to the walk it is compared with */}
      <TeX s={String.raw`z\approx4764\ \text{km}\ <\ 5382\ \text{km}`} x={XC + 40} y={800} size={56} c={C.second}
        o={fin(f, AT(k, 5, "four thousand seven hundred")) * fout(f, tCurve - 15)} />
    </Scene>
  );
};

// ================================================================ s24 distance east: Δx = a cos φ Δλ (the parallel's disc)
const S24: React.FC = () => {
  const f = useCurrentFrame(), k = K("s24_distance_east");
  const tPar = SS(k, 1), tRound = AT(k, 2, "a circle round"), tRad = SS(k, 3), tSlice = SS(k, 4), tWalk = SS(k, 5), tRule = SS(k, 6), tEq = SS(k, 7), tNum = AT(k, 8, "which is about"),
    tTwo = SS(k, 9);
  const cam = { lat: 38, lon: LON0 - 90, dist: 3.3 };
  const lift = 0.45 * prog(f, tSlice, tSlice + 40), capO = 1 - 0.85 * prog(f, tSlice, tSlice + 40);
  const F: Face = latFace(PHI, LON0);
  const rr = BU;   // the disc's radius in face units (Earth radii)
  const s0 = 25 * prog(f, tWalk, tWalk + 90), s1 = s0 + 5;
  const pt = (a: number, r = rr): [number, number] => [r * Math.cos(a * D2R), r * Math.sin(a * D2R)];
  const items: FItem[] = [
    { k: "dot", p: [0, 0], c: C.local, at: 0, same: false },
    { k: "arc", r: rr, a0: 0, a1: 360, c: C.second, w: 6, at: tRound },
    { k: "seg", a: [0, 0], b: pt(0), c: RAD, w: 6, at: tRad },
    { k: "lbl", p: pt(0, rr / 2), t: "4230 km", c: RAD, dy: 40, a: "middle", only: "2", at: tRad + 10, same: false },
    { k: "seg", a: [0, 0], b: pt(s0), c: C.key, w: 4, at: tWalk },
    { k: "seg", a: [0, 0], b: pt(s1), c: C.key, w: 4, at: tWalk, same: false },
    { k: "arc", r: rr * 0.42, a0: s0, a1: s1, c: C.gold, w: 7, at: tWalk + 20, same: false },
    { k: "arc", r: rr * 1.04, a0: s0, a1: s1, c: C.second, w: 16, at: tWalk + 30, same: false },
    { k: "dot", p: pt(s1), c: C.key, r: 10, at: tWalk + 30, same: false },
    { k: "tex", p: pt(s0 + 2.5, rr * 0.55), t: String.raw`\Delta\lambda`, c: C.gold, size: 44, dx: 30, at: tWalk + 20, same: false },
    { k: "tex", p: pt(s0 + 2.5, rr * 1.12), t: String.raw`\Delta x`, c: C.second, size: 48, dx: 26, ax: 0, dx3: 26, ax3: 0, at: tWalk + 30, same: false },
  ];
  const G = globeG(cam, TV3);
  const cE = G.pw([0, 0, 0]), pB = G.pw(ll(PHI, LON0)), pC = G.pw([0, BV, 0]);
  const fC: Pt = [1210, 340];
  const bar = (x: number, y: number, w: number, c: string, o: number) => <rect x={x} y={y - 14} width={w} height={28} fill={c} opacity={o} rx={4} />;
  return (
    <Scene>
      <TwoView f={f} cam={cam} cut={{ kind: "lat", lat0: PHI, lift, capO }} face={F} flatC={fC} flatR={200 / rr} items={items} flatO={fin(f, tSlice, 15)}
        flatBase={(P) => <path d={`${faceArc(P, 0, 0, rr, 0, 360, 120)}Z`} fill="#4a3d36" fillOpacity={0.55} stroke={C.muted} strokeWidth={4} />}
        extra3={() => <g opacity={win(f, SS(k, 4) + 30, tWalk + 200)}>
          <line x1={cE[0]} y1={cE[1]} x2={pB[0]} y2={pB[1]} stroke={RAD} strokeWidth={4} strokeDasharray="10 8" opacity={0.6} />
          <circle cx={cE[0]} cy={cE[1]} r={9} fill={C.gold} stroke={C.bg} strokeWidth={3} />
          <line x1={pC[0]} y1={pC[1]} x2={cE[0]} y2={cE[1]} stroke={C.local} strokeWidth={3} strokeDasharray="8 8" />
        </g>} />
      <Svg>
        {/* K6 k6r1: the keyword column 1450 → 1540 (the flat Δx tag reached "the axis") */}
        <Keyword f={f} text="going east" at={[1540, 150]} appear={0} out={tRound - 20} s={50} />
        <Keyword f={f} text="circle round" at={[1540, 150]} appear={tRound} s={50} />
        <Keyword f={f} text="the axis" at={[1540, 215]} appear={tRound} s={50} />
        <Keyword f={f} text="not round" at={[1540, 330]} appear={tRad} s={50} />
        <Keyword f={f} text="the centre" at={[1540, 395]} appear={tRad} s={50} />
        <g opacity={fin(f, tTwo)}>
          {bar(XC + 220, 760, 73.8 * 3, C.second, 1)}{bar(XC + 220, 820, 111.2 * 3, C.local, 0.7)}
          <Lbl x={XC + 200} y={760} t="east 73.8" c={C.key} s={T.floor} a="end" />
          <Lbl x={XC + 200} y={820} t="north 111.2" c={C.key} s={T.floor} a="end" />
        </g>
      </Svg>
      <Layered parts={[{ t: String.raw`\Delta x=` }, { t: String.raw`a\cos\varphi`, u: { w: String.raw`\text{radius of the parallel}`, c: C.gold } }, { t: String.raw`\,\Delta\lambda` }]}
        x={XC} y={650} size={T.calc} layers={[{ t: "all", o: fin(f, tEq) * fout(f, tTwo - 15) }, { t: [], u: [1], o: fin(f, tEq + 25) * fout(f, tTwo - 15) }]} />
      <TeX s={EQ_S24} x={XC} y={610} size={60} c={C.ink} o={fin(f, tTwo)} />
      <TeX s={String.raw`\Delta x=4230\ \text{km}\times0.01745\approx73.8\ \text{km}`} x={XC} y={790} size={44} c={C.ink} o={win(f, tNum - 20, tTwo - 22)} />
      <TeX s={String.raw`\cos48.4^\circ\approx\dfrac23`} x={1560} y={760} size={46} c={C.ink} o={fin(f, tTwo + 20)} />
      {void [tPar, tRule, facePt, face3]}
    </Scene>
  );
};

// ================================================================ s25 one degree east at four places (keep line K3)
const S25: React.FC = () => {
  const f = useCurrentFrame(), k = K("s25_degree_east");
  const g0 = keepGone(k, 1);
  const tCmp = SS(k, 2), tEach = SS(k, 3), tS = SS(k, 4), tK = SS(k, 5), tB = SS(k, 6), tL = SS(k, 7), tP = SS(k, 8), tLike = SS(k, 9), tUnlike = SS(k, 10);
  const cam = spinPath([{ f: 0, lat: 35, lon: 40, dist: 3.4 }, { f: LEN(k) + 10, lat: 35, lon: 46, dist: 3.4 }], f);
  const P4 = [{ la: SING[0], lo: SING[1], d: DG.dx1[1], at: tS, n: "Singapore", row: String.raw`111.2\times0.9997\approx111.2` },
    { la: KHULNA[0], lo: KHULNA[1], d: DG.dx1[2], at: tK, n: "Khulna", row: String.raw`111.2\times0.9219\approx102.5` },
    { la: BREST[0], lo: BREST[1], d: DG.dx1[3], at: tB, n: "Brest", row: String.raw`111.2\times0.6639\approx73.8` },
    { la: LYB[0], lo: LYB[1], d: DG.dx1[4], at: tL, n: "Longyearbyen", row: String.raw`111.2\times0.2045\approx22.7` }];
  const X0 = 1380, KPX = 3.6, Y0 = 330, DY = 95;
  const eqs = cutAt(EQ_S25, String.raw`\quad`);
  return (
    <Scene>
      <Earth cam={cam} alpha={0.55} coast={0.4}
        over={(Gg) => <>
          {gseg(Gg, [0, -1.25, 0], [0, 1.3, 0], C.local, 3, 0.9, "10 8")}
          {P4.map((p) => { const o = 0.35 + 0.65 * fin(f, p.at); const s = Math.sin(p.la * D2R);
            const ring = Array.from({ length: 97 }, (_, i) => Gg.pw(ll(p.la, (360 * i) / 96, 1.001)));
            return <g key={p.n} opacity={o}>
              <path d={`${poly(ring)}Z`} fill={C.second} fillOpacity={0.1 + 0.12 * fin(f, p.at)} stroke={C.second} strokeWidth={3} />
              {gseg(Gg, [0, s, 0], ll(p.la, p.lo, 1.001), RAD, 4, fin(f, p.at))}
              <path d={poly(Array.from({ length: 11 }, (_, i) => Gg.pw(ll(p.la, p.lo + 0.5 * i, 1.004))))} fill="none" stroke={C.gold} strokeWidth={10} opacity={fin(f, p.at)} />
            </g>; })}
          {Array.from({ length: 12 }, (_, i) => <path key={i} d={merPath(Gg, -180 + 30 * i)} fill="none" stroke={C.second} strokeWidth={i % 2 ? 4 : 2} opacity={0.8 * fin(f, tLike)} />)}
          <GoreTint G={Gg} o={0.35 * fin(f, tLike)} />
        </>} />
      <GSrc />
      <Svg>
        {P4.map((p, i) => { const y = Y0 + i * DY, o = fin(f, p.at), w = p.d * KPX * prog(f, p.at, p.at + 25);
          return <g key={p.n}>
            <Lbl x={X0 - 18} y={y} t={p.n} c={C.key} s={T.floor} a="end" o={(0.5 + 0.5 * o) * fin(f, g0)} />{/* after the keep picture (Part 1 lessons B4) */}
            <rect x={X0} y={y - 16} width={Math.max(0, w)} height={32} fill={C.gold} opacity={o} rx={4} />
            <Lbl x={X0 + 8} y={y + 44} t={`${p.d.toFixed(1)} km`} c={C.gold} s={T.floor} o={fin(f, p.at + 20)} />
          </g>; })}
        <circle cx={X0} cy={Y0 + 4 * DY - 10} r={9} fill={C.gold} opacity={fin(f, tP)} />
        <Lbl x={X0 - 18} y={Y0 + 4 * DY - 10} t="pole" c={C.key} s={T.floor} a="end" o={fin(f, tP)} />
        <Lbl x={X0 + 24} y={Y0 + 4 * DY - 10} t="0" c={C.gold} s={T.floor} o={fin(f, tP)} />
        <Keyword f={f} text="Like: orange segments" at={[XC, 780]} appear={tLike} s={T.floor + 4} />

        <Lbl x={XC} y={840} t="Unlike: one through every place" c={C.key} s={T.floor} o={fin(f, tUnlike)} />
      </Svg>
      <TeX s={eqs[0]} x={XC} y={170} size={60} c={C.ink} o={fin(f, Math.max(tEach, g0 + 8))} />
      <TeX s={eqs[1]} x={1600} y={240} size={50} c={C.muted} o={fin(f, Math.max(tEach, g0 + 8))} />
      {P4.map((p, i) => <TeX key={p.n} s={p.row} x={XC} y={730} size={52} c={C.ink} o={win(f, p.at + 10, (P4[i + 1]?.at ?? tP) - 10)} />)}
      <KeepLine f={f} k={k} lines={["1° north ≈ 111 km ·", String.raw`1° east = 111 km $\times\cos\varphi$`]} />
      {/* Part 1 lessons B4: the keep line's own picture (a degree north is the same everywhere; a degree east shrinks with cos φ) */}
      <KeepPic kind="steps" c={[1440, 580]} R={220} o={fin(f, 4, 10) * fout(f, SE(k, 1), 10)} />
      {void [tCmp]}
    </Scene>
  );
};
/** alternate 15° gores tinted orange (many meridians in one path, thick enough to overlap; like the band tint) */
const GoreTint: React.FC<{ G: GProj; o: number }> = ({ G, o }) => {
  if (o <= 0) return null;
  let d = "";
  for (let g = 0; g < 12; g++) for (let lo = -180 + 30 * g + 0.75; lo < -180 + 30 * g + 15; lo += 1.5) d += merPath(G, lo, -86, 86, 1.002);
  return <path d={d} fill="none" stroke={C.second} strokeWidth={8} strokeOpacity={o} />;
};

export const SCENES_B: Record<string, React.FC> = {
  s13_earth_axes: S13, s14_brest_side: S14, s15_brest_z: S15, s16_brest_axis_distance: S16, s17_brest_top: S17, s18_position_vector: S18, s19_khulna: S19,
  s20_spin_rate: S20, s21_ground_speeds: S21, s22_distance_north: S22, s23_north_examples: S23, s24_distance_east: S24, s25_degree_east: S25,
};
void [GFULL, XZ, gdot, mix, pulse, Chevron, TOP_C, TOP_R, ptOf, DiscFlatBase, globePath, clamp];
