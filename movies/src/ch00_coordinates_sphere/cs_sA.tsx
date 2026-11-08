// ch00_coordinates_sphere scenes s00-s12 (s02 recap cut, remake 2026-11-07): the title, the hook, the sphere and its centre, the sliced Earth
// and the radius a, latitude, the parallel (a circle round the axis), colatitude and the sine-cosine swap (TwoViewSlice, skip chip
// K1), meridians, the prime-meridian tour (zoom-reveal), longitude (the equatorial slice from above) and the graticule. Globes: the
// house GB frame (whole, unzoomed: no edge fades) or the zoom-reveal (s10: full-bleed, K1 fades, text on the darkened panel from
// x 1190). Numbers from data/cs.json only (CHECK_A below re-asserts every screen string against the data).
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Pt, RightTick, pulse } from "../house/kit/draw";
import { SeriesTitle } from "./kit_cs/SeriesTitle";
import { GlobeFrame, SourceBelow } from "../house/kit/frame";
import { SunGlyph } from "../house/kit/extras";
import { GProj, globePath, llPath } from "./kit_cs/globe";
import { Quad3D } from "./kit_cs/three3d";
import { V3 } from "./kit_cs/cam";
import {
  AT, Arrow, BREST, Balloon, BandTint, CalcStack, Chevron, D, D2R, Earth, GB, GFULL, Grat, K, KHULNA, KeepLine, Keyword, LEN, LYB, Layered, Lbl, SE, SING, SRC_G, SRC_BM,
  SS, Scene, SideCallout, SkipChip, Svg, TeX, XC, XZ, add, arcD, chipSpan, clamp, cutAt, discOf, e2g, eastAt, facing, fin, fout, gdot, globeG, gseg, keepGone,
  keepTime, ll, merPath, splitVis, mix, parPath, plab, poly, prog, rep, spinPath, win, faceArc, faceFlat, lin,
  RAD, Magnify, KeepPic, Recall,
} from "./cs_lib";
import { FItem, FLAT_C, FLAT_R, FACE_B, LON0, MerFlatBase, PHI, TwoView, camFace, merCut, ptOf } from "./cs_two";
import { EQ_S04, EQ_S05, EQ_S07, EQ_S08, EQ_S11 } from "./cs_eq";

const BR = D.brest;
// ---------------------------------------------------------------- numbers on screen = the data (the render fails otherwise)
const CHECK_A: [string, number, number, number][] = [
  ["a", D.consts.a_km, 6371, 1e-9], ["sinB", BR.sin, 0.7478, 5e-5], ["cosB", BR.cos, 0.6639, 5e-5], ["colat", BR.colat, 41.6, 1e-9],
  ["sin41.6", Math.sin(41.6 * D2R), 0.6639, 5e-5], ["bal", (10 / D.consts.a_km) * 100, 0.16, 5e-3], ["lam360", 360 + BREST[1], 355.5, 1e-9],
  ["pmUK", D.pm.cross["United Kingdom"][0], 53.76, 0.01], ["pmGhana", D.pm.cross.Ghana[1], 5.62, 0.01], ["pmAnt", D.pm.cross.Antarctica[0], -71.5, 0.01],
];
CHECK_A.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
const GSrc: React.FC<{ o?: number; cut?: boolean }> = ({ o = 1, cut = false }) => <SourceBelow text={cut ? SRC_BM : SRC_G} pic={GB} w={960} o={o} name="globe src" />;
const CB = PHI * D2R, BU = Math.cos(CB), BV = Math.sin(CB);   // Brest on the meridian face (unit radius)
/** a point on the meridian face through LON0 (u along the equator line under Brest, v up the axis) */
const fpt = (u: number, v: number): V3 => { const m = ll(0, LON0); return [u * m[0], v, u * m[2]]; };
const CAMF = camFace(LON0, 3.3);

// ================================================================ s00 title
const TB = { x: 1150, y: 160, w: 690, h: 480 };
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  const tMet = AT(k, 0, "to measure"), tCo = AT(k, 0, "coordinates");   // HOUSE_STYLE §3 (2026-11-06): the concept name pulses on its word
  const oA = fout(f, tMet, 12), oB = fin(f, tMet, 12);
  const camA = globePath([{ f: 0, lat: 20, lon: LON0 - 10, dist: 3.2 }, { f: 60, lat: 12, lon: LON0 - 40, dist: 3.2 }], f);
  const slide = prog(f, 40, 95);
  const tArrow = 96, tWedge = 124;
  const camB = globePath([{ f: tMet, lat: 56, lon: 8, dist: 3.0 }, { f: LEN(k) + 10, lat: 58, lon: 12, dist: 3.0 }], f);
  const GA = globeG(camA, TB);
  const c0 = GA.pw([0, 0, 0]);
  const wedge = prog(f, tWedge, tWedge + 40);
  return (
    <Scene fadeIn={false}>
      <Svg>
        {/* remake 2026-11-07 (R1/R2): the series title layout (kit_cs/SeriesTitle = Parts 1-2), no "made easy"; "Coordinates" pulses on its word */}
        <SeriesTitle f={f} concept="Coordinates" part="Part 3 · Our round Earth" sub={["latitude, longitude,", "distances and areas"]} pulseAt={tCo} />
      </Svg>
      <Earth cam={camA} box={TB} cut={merCut(slide)} o={oA * fin(f, 4, 10)} coast={0.4}
        over={(G) => <>
          {slide > 0.5 ? <circle cx={c0[0]} cy={c0[1]} r={9} fill={C.gold} opacity={fin(f, 88, 8)} /> : null}
          <Arrow p={c0} q={[mix(c0[0], G.pw(fpt(BU, BV))[0], prog(f, tArrow, tArrow + 24)), mix(c0[1], G.pw(fpt(BU, BV))[1], prog(f, tArrow, tArrow + 24))]}
            color={RAD} w={7} head={24} o={fin(f, tArrow, 6)} />
          <path d={`M${c0[0]} ${c0[1]}${poly(Array.from({ length: 25 }, (_, i) => G.pw(fpt(0.42 * Math.cos(CB * wedge * i / 24), 0.42 * Math.sin(CB * wedge * i / 24))))).replace("M", "L")}Z`}
            fill={C.gold} fillOpacity={0.25} stroke={C.gold} strokeWidth={4} opacity={fin(f, tWedge, 8)} />
          <line x1={c0[0]} y1={c0[1]} x2={G.pw(fpt(1, 0))[0]} y2={G.pw(fpt(1, 0))[1]} stroke={C.local} strokeWidth={3} opacity={fin(f, tWedge - 10, 8)} />
        </>} />
      <Earth cam={camB} box={TB} o={oB} coast={0.4} grat={0}
        over={(G) => {
          let d = "";
          for (let la = 40; la <= 86; la += 1) { const pts: [number, number][] = []; for (let lo = -25; lo <= 45; lo += 1) pts.push([la, lo]); d += llPath(G, pts); }
          for (let lo = -25; lo <= 45; lo += 1) { const pts: [number, number][] = []; for (let la = 40; la <= 86; la += 1) pts.push([la, lo]); d += llPath(G, pts); }
          const box1 = (la: number, lo: number) => llPath(G, [[la, lo], [la, lo + 1], [la + 1, lo + 1], [la + 1, lo], [la, lo]]);
          return <>
            <path d={d} fill="none" stroke={C.ink} strokeOpacity={0.45} strokeWidth={1.2} />
            <path d={box1(48, -5) + box1(78, 15)} fill={C.gold} fillOpacity={0.55} stroke={C.gold} strokeWidth={3} opacity={fin(f, tMet + 20, 12)} />
          </>;
        }} />
      <SourceBelow text="Image: NASA Blue Marble Next Generation" pic={TB} w={690} name="s00 src" />
    </Scene>
  );
};

// ================================================================ s01 hook
const Thumb: React.FC<{ x: number; y: number; i: number; lit: boolean }> = ({ x, y, i, lit }) => {
  const c = lit ? C.gold : C.muted;
  return (
    <g opacity={lit ? 1 : 0.35}>
      {i === 0 ? <>{[0, 1, 2, 3].map((q) => <line key={q} x1={x - 36 + q * 24} y1={y - 30} x2={x - 36 + q * 24} y2={y + 30} stroke={c} strokeWidth={3} />)}
        {[0, 1, 2].map((q) => <line key={`h${q}`} x1={x - 40} y1={y - 22 + q * 22} x2={x + 40} y2={y - 22 + q * 22} stroke={c} strokeWidth={3} />)}</> : null}
      {i === 1 ? <><ellipse cx={x} cy={y - 24} rx={34} ry={10} fill="none" stroke={c} strokeWidth={3} /><ellipse cx={x} cy={y + 24} rx={34} ry={10} fill="none" stroke={c} strokeWidth={3} />
        <line x1={x - 34} y1={y - 24} x2={x - 34} y2={y + 24} stroke={c} strokeWidth={3} /><line x1={x + 34} y1={y - 24} x2={x + 34} y2={y + 24} stroke={c} strokeWidth={3} /></> : null}
      {i === 2 ? <><circle cx={x} cy={y} r={34} fill="none" stroke={c} strokeWidth={4} /><ellipse cx={x} cy={y} rx={34} ry={11} fill="none" stroke={c} strokeWidth={2.5} />
        <ellipse cx={x} cy={y} rx={12} ry={34} fill="none" stroke={c} strokeWidth={2.5} /></> : null}
      {i === 3 ? <><Arrow p={[x - 20, y + 22]} q={[x + 30, y + 22]} color={c} w={4} head={14} halo={false} /><Arrow p={[x - 20, y + 22]} q={[x + 6, y - 6]} color={c} w={4} head={14} halo={false} />
        <Arrow p={[x - 20, y + 22]} q={[x - 20, y - 34]} color={c} w={4} head={14} halo={false} /></> : null}
      {i === 4 ? <><circle cx={x - 8} cy={y} r={18} fill="none" stroke={c} strokeWidth={4} /><Arrow p={[x + 14, y]} q={[x + 42, y - 18]} color={c} w={4} head={14} halo={false} />
        <rect x={x - 40} y={y + 22} width={10} height={14} fill={c} /></> : null}
      {i === 5 ? <><circle cx={x} cy={y} r={34} fill="none" stroke={c} strokeWidth={3} /><path d={`M${x - 26} ${y + 10} Q ${x} ${y - 46} ${x + 28} ${y + 4}`} fill="none" stroke={c} strokeWidth={4} /></> : null}
      {i === 6 ? <><rect x={x - 42} y={y - 26} width={84} height={52} fill="none" stroke={c} strokeWidth={3} /><ellipse cx={x - 8} cy={y} rx={14} ry={18} fill={c} opacity={0.6} />
        <ellipse cx={x + 22} cy={y - 6} rx={10} ry={8} fill={c} opacity={0.6} /></> : null}
    </g>
  );
};
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  const tWhere = AT(k, 0, "where a place is"), tFar = AT(k, 0, "how far apart"), tSeven = AT(k, 1, "seven parts"), tLL = AT(k, 2, "latitude and longitude"),
    tKm = AT(k, 2, "kilometres") - 16, tGrid = AT(k, 3, "grid boxes"), tTrop = AT(k, 3, "tropics");
  const cam = spinPath([{ f: 0, lat: 28, lon: 15, dist: 3.4 }, { f: LEN(k) + 10, lat: 32, lon: 65, dist: 3.4, spin: 0.2 }], f);
  const gc: [number, number][] = D.gc_bk.lat.map((la: number, i: number) => [la, D.gc_bk.lon[i]]);
  const nGc = Math.max(2, Math.round(gc.length * prog(f, tFar, tFar + 40)));
  return (
    <Scene>
      <Earth cam={cam} grat={0.2 + 0.3 * fin(f, tLL)} coast={0.45}
        over={(G) => <>
          <path d={llPath(G, gc.slice(0, nGc), 1.003)} fill="none" stroke={C.gold} strokeWidth={4} strokeOpacity={0.6} opacity={fin(f, tFar)} />
          {[BREST, KHULNA, SING].map((p, i) => <g key={i}>{gdot(G, p[0], p[1], C.gold, 10)}</g>)}
          <BandTint G={G} a={-30} b={30} c={C.first} o={0.4 * win(f, tTrop, tTrop + 60, 12)} />
          <g opacity={fin(f, tGrid)}>{(() => {
            let d = "";
            for (let la = 74; la <= 82; la += 1) { const pts: [number, number][] = []; for (let lo = 8; lo <= 32; lo += 1) pts.push([la, lo]); d += llPath(G, pts); }
            for (let lo = 8; lo <= 32; lo += 1) { const pts: [number, number][] = []; for (let la = 74; la <= 82; la += 1) pts.push([la, lo]); d += llPath(G, pts); }
            return <path d={d} fill="none" stroke={C.gold} strokeWidth={1.6} strokeOpacity={0.8} />;
          })()}</g>
        </>} />
      <GSrc />
      <Svg>
        <Keyword f={f} text="where?" at={[XC, 150]} appear={tWhere} />
        <Keyword f={f} text="how far?" at={[XC, 240]} appear={tFar} />
        <Keyword f={f} text="degrees → km" at={[XC, 330]} appear={tKm} />
        <Keyword f={f} text="grid boxes" at={[XC, 420]} appear={tGrid} />
        <Keyword f={f} text="the tropics" at={[XC + 330, 420]} appear={tTrop} />
        <g opacity={fin(f, tSeven)}>{Array.from({ length: 7 }, (_, i) => <Thumb key={i} x={1130 + i * 110} y={590} i={i} lit={i === 2} />)}</g>
        <Lbl x={1350} y={675} t="round Earth" c={C.key} s={T.key} a="middle" o={fin(f, tSeven + 12)} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s03 the sphere: origin at the centre
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_sphere");
  const tC = AT(k, 3, "the Earth's centre"), t4 = SS(k, 4), tR = AT(k, 5, "which we call r"), tAng = SS(k, 6), tSph = AT(k, 7, "spherical coordinates"),
    tLat = AT(k, 8, "latitude"), tLon = AT(k, 8, "longitude"), tKnife = SS(k, 9);
  const cam = spinPath([{ f: 0, lat: 22, lon: -40, dist: 3.4 }, { f: LEN(k) + 10, lat: 22, lon: -12, dist: 3.4, spin: 0.2 }], f);
  const alpha = 1 - 0.62 * fin(f, tC, 20);
  const pB = ll(BREST[0], BREST[1]), pBal = ll(BREST[0], BREST[1], 1 + (10 / 6371) * 50), pUnder = ll(30, -25, 0.55);
  const m = ll(0, LON0);
  const knife: V3[] = [[-1.3 * m[0], -1.3, -1.3 * m[2]], [1.3 * m[0], -1.3, 1.3 * m[2]], [1.3 * m[0], 1.3, 1.3 * m[2]], [-1.3 * m[0], 1.3, -1.3 * m[2]]];
  return (
    <Scene>
      <Earth cam={cam} alpha={alpha} coast={0.45} three={<Quad3D pts={knife} color={C.gold} o={0.2 * fin(f, tKnife, 20)} />}
        over={(G) => {
          const c0 = G.pw([0, 0, 0]);
          return <>
            <circle cx={c0[0]} cy={c0[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tC)} />
            {[pB, pBal, pUnder].map((q, i) => <g key={i} opacity={fin(f, t4 + i * 20)}>
              {gseg(G, [0, 0, 0], q, RAD, i === 0 ? 7 : 4, i === 0 ? 1 : 0.6)}
              <circle cx={G.pw(q)[0]} cy={G.pw(q)[1]} r={10} fill={i === 0 ? C.gold : C.key} stroke={C.bg} strokeWidth={3} />
            </g>)}
            <Balloon p={[G.pw(pBal)[0], G.pw(pBal)[1] - 8]} s={0.8} o={fin(f, t4 + 20)} />
            <Lbl x={(c0[0] + G.pw(pB)[0]) / 2 - 24} y={(c0[1] + G.pw(pB)[1]) / 2 - 10} t="$r$" c={RAD} s={T.key} a="end" o={fin(f, tR)} />
            <g opacity={fin(f, tAng)}>
              <path d={poly(Array.from({ length: 21 }, (_, i) => G.pw(ll(BREST[0] * i / 20, BREST[1], 0.32))))} fill="none" stroke={C.local} strokeWidth={5} />
              <path d={poly(Array.from({ length: 21 }, (_, i) => G.pw(ll(0, BREST[1] * i / 20, 0.32))))} fill="none" stroke={C.local} strokeWidth={5} />
              {gseg(G, [0, 0, 0], ll(0, 0, 0.6), C.local, 3, 0.8, "8 8")}
              {gseg(G, [0, 0, 0], ll(0, BREST[1], 0.6), C.local, 3, 0.8, "8 8")}
            </g>
          </>;
        }} />
      <GSrc />
      <Svg>
        <Keyword f={f} text="sphere" at={[XC, 160]} appear={0} />
        <Keyword f={f} text="origin: the Earth's centre" at={[XC, 260]} appear={tC} />
        <Keyword f={f} text="distance $r$" at={[XC, 360]} appear={tR} />
        <Keyword f={f} text="two angles" at={[XC, 450]} appear={tAng} />
        <Keyword f={f} text="spherical coordinates" at={[XC, 560]} appear={tSph} />
        <Keyword f={f} text="latitude" at={[XC, 660]} appear={tLat} />
        <Keyword f={f} text="longitude" at={[XC + 300, 660]} appear={tLon} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s04 the sliced Earth and the radius a
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = K("s04_slice_radius");
  const tSlice = AT(k, 0, "slicing the Earth in half"), tBrest = AT(k, 0, "Brest"), tFace = SS(k, 1), tArrow = SS(k, 2), tR = SS(k, 3), tRad = AT(k, 4, "the Earth's radius"),
    t6400 = AT(k, 5, "six thousand four hundred"), tExact = AT(k, 5, "more exactly"), tA = AT(k, 7, "We call it a"), tGround = SS(k, 8), tBal = SS(k, 9);
  const cam = globePath([{ f: 0, lat: 22, lon: -12, dist: 3.4 }, { f: 95, lat: 12, lon: LON0 - 40, dist: 3.3 }, { f: LEN(k) + 10, lat: 12, lon: LON0 - 40, dist: 3.3 }], f);
  const slide = prog(f, Math.max(tSlice + 30, 100), Math.max(tSlice + 75, 145));
  const part1 = cutAt(EQ_S04, String.raw`\quad`)[0], part2 = cutAt(EQ_S04, String.raw`\quad`)[1];

  const G = globeG(cam);
  const c0 = G.pw([0, 0, 0]), pb = G.pw(fpt(BU, BV)), mid: Pt = [(c0[0] + pb[0]) / 2, (c0[1] + pb[1]) / 2];
  const balP = G.pw(fpt(BU * (1 + 500 / 6371), BV * (1 + 500 / 6371)));
  const isA = fin(f, tA + 8, 10);
  return (
    <Scene>
      <Earth cam={cam} cut={merCut(slide)} coast={0.4}
        over={(Gg) => {
          const P = (u: number, v: number) => Gg.pw(fpt(u, v));
          return <g opacity={slide}>
            {[0.55, 0.19].map((rr) => <path key={rr} d={faceArc(P, 0, 0, rr, -90, 270, 90)} fill="none" stroke="#7a6658" strokeWidth={2} strokeDasharray="6 8" />)}
            <line x1={P(0, -1.25)[0]} y1={P(0, -1.25)[1]} x2={P(0, 1.25)[0]} y2={P(0, 1.25)[1]} stroke={C.local} strokeWidth={4} />
            <circle cx={c0[0]} cy={c0[1]} r={11 + 5 * pulse(f, tFace + 20, 24)} fill={C.gold} stroke={C.bg} strokeWidth={3} />
            <Arrow p={c0} q={[mix(c0[0], pb[0], prog(f, tArrow, tArrow + 30)), mix(c0[1], pb[1], prog(f, tArrow, tArrow + 30))]} color={RAD} o={fin(f, tArrow, 6)} />
            <circle cx={pb[0]} cy={pb[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
            {plab(Gg, 90, 0, "North Pole", 1, 22, -10, "start", false, 1.25)}
            {plab(Gg, -90, 0, "South Pole", 1, 22, 10, "start", false, 1.25)}
          </g>;
        }} />
      <GSrc o={fout(f, Math.max(tSlice + 30, 100) - 10, 8)} /><GSrc cut o={fin(f, Math.max(tSlice + 30, 100), 8)} />{/* pass 2: the coastline goes with the cut */}
      <Svg>
        <g data-lc-maplabel="1"><Lbl x={pb[0] + 22} y={pb[1] - 28} t="Brest" c={C.key} s={T.floor} o={fin(f, tBrest)} /></g>
        {/* K6 k6r1: r fades out over the 8 frames before "We call it a", a fades in 8 frames after (no cross-fade on one spot) */}
        <Lbl x={mid[0] - 28} y={mid[1] - 18} t="$r$" c={RAD} s={T.key} a="end" o={fin(f, tR) * (1 - fin(f, tA - 8, 8))} />
        <Lbl x={mid[0] - 28} y={mid[1] - 18} t="$a$" c={RAD} s={T.key} a="end" o={isA} />
        <Balloon p={balP} s={0.9} o={fin(f, tBal)} />
        <Keyword f={f} text="slice" at={[XC, 150]} appear={0} out={tRad - 30} />
        <Keyword f={f} text="Earth's radius" at={[XC, 150]} appear={tRad} />
        <SideCallout f={f} lines={[]} at={[XC + 4, 260]} appear={t6400} target={mid} bend={40} />
        <Keyword f={f} text="its own letter" at={[XC, 460]} appear={SS(k, 6)} />
        <Keyword f={f} text="one radius for every height" at={[XC, 780]} appear={SS(k, 10)} />
      </Svg>
      <Layered parts={[{ t: String.raw`a`, c: C.ink }, { t: part1.slice(1) }]} x={XC + 10} y={260} size={T.calc}
        layers={[{ t: [1], o: fin(f, t6400) }, { t: [0], o: isA, glow: pulse(f, tA + 6, 20) }]} />
      <TeX s={part2} x={XC + 10} y={345} size={T.key} c={C.muted} o={fin(f, tExact)} />
      <TeX s={String.raw`r=a\ \ \text{on the ground}`} x={XC} y={560} size={T.calc} c={C.ink} o={fin(f, tGround)} />
      <TeX s={String.raw`10\ \text{km}\div 6371\ \text{km}\approx 0.16\,\%`} x={XC} y={670} size={60} c={C.ink} o={fin(f, AT(k, 9, "only ten kilometres"))} />
    </Scene>
  );
};

// ================================================================ s05 latitude
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = K("s05_latitude");
  const tEq = SS(k, 1), tAng = AT(k, 2, "the angle between"), tPhi = AT(k, 3, "phi"), t48 = AT(k, 4, "forty eight point four"), tN = SS(k, 5),
    t0 = SS(k, 6), t45 = SS(k, 7), t90 = SS(k, 8), tS = SS(k, 9), tRange = SS(k, 10);
  const ghostLat = f < t0 ? PHI : f < t45 ? mix(PHI, 0, prog(f, t0, t0 + 25)) : f < t90 ? mix(0, 45, prog(f, t45, t45 + 25)) : f < tS ? mix(45, 90, prog(f, t90, t90 + 25))
    : f < tRange ? mix(90, -90, prog(f, tS, tS + 40)) : mix(-90, PHI, prog(f, tRange, tRange + 40));
  const ghostO = win(f, t0, tRange + 50, 10);
  const G = globeG(CAMF);
  const P = (u: number, v: number) => G.pw(fpt(u, v));
  const c0 = P(0, 0), pb = P(BU, BV), gh = P(Math.cos(ghostLat * D2R), Math.sin(ghostLat * D2R));
  const wedgeMid = P(0.4 * Math.cos(CB / 2), 0.4 * Math.sin(CB / 2));
  const lab = (lat: number) => P(1.08 * Math.cos(lat * D2R), 1.08 * Math.sin(lat * D2R));
  return (
    <Scene>
      <Earth cam={CAMF} cut={merCut(1)} coast={0.4}
        over={() => <>
          <line x1={P(0, -1.25)[0]} y1={P(0, -1.25)[1]} x2={P(0, 1.25)[0]} y2={P(0, 1.25)[1]} stroke={C.local} strokeWidth={4} />
          <line x1={c0[0]} y1={c0[1]} x2={P(1, 0)[0]} y2={P(1, 0)[1]} stroke={C.local} strokeWidth={5} opacity={fin(f, tEq)} strokeDasharray={undefined} />
          <path d={`M${c0[0]} ${c0[1]}${faceArc(P, 0, 0, 0.62, 0, PHI * prog(f, tAng, tAng + 25)).replace("M", "L")}Z`} fill={C.gold} fillOpacity={0.16} stroke="none" opacity={fin(f, tAng)} />
          <path d={faceArc(P, 0, 0, 0.62, 0, PHI * prog(f, tAng, tAng + 25))} fill="none" stroke={C.gold} strokeWidth={8} opacity={fin(f, tAng)} />
          <Arrow p={c0} q={gh} color={RAD} w={6} head={26} o={0.6 * ghostO} />
          <Arrow p={c0} q={pb} color={RAD} />
          <circle cx={c0[0]} cy={c0[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={3} />
          <circle cx={pb[0]} cy={pb[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        </>} />
      <TeX s={String.raw`\varphi`} x={wedgeMid[0]} y={wedgeMid[1]} size={T.key} c={C.gold} ax={0.5} o={fin(f, tPhi)} halo />
      <GSrc cut />
      <Svg>
        <g data-lc-maplabel="1">
          <Lbl x={P(0.97, 0)[0]} y={P(0.97, 0)[1] + 44} t="equator" c={C.key} s={T.floor} a="end" o={fin(f, tEq)} />{/* K6 k6r1: inside the face, under the line end (it sat on the range row) */}
          <Lbl x={lab(0)[0] + 10} y={lab(0)[1] - 34} t="0°" c={C.key} s={T.floor} o={win(f, t0 + 20, t45)} />
          <Lbl x={lab(45)[0] + 10} y={lab(45)[1] - 10} t="45°" c={C.key} s={T.floor} o={win(f, t45 + 20, t90)} />
          <Lbl x={P(0, 1)[0] + 24} y={P(0, 1)[1] + 40} t="90° N" c={C.key} s={T.floor} o={win(f, t90 + 20, tS)} />
          <Lbl x={P(0, -1)[0] + 24} y={P(0, -1)[1] - 34} t="−90°" c={C.neg} s={T.floor} o={win(f, tS + 30, tRange)} />
        </g>
        <Keyword f={f} text="the first angle" at={[XC, 150]} appear={0} out={tAng - 30} />
        <Keyword f={f} text="latitude: angle at the centre" at={[XC, 150]} appear={tAng - 8} out={tPhi - 20} s={T.floor + 6} />{/* review 1 S1 */}
        <Keyword f={f} text="latitude $\varphi$" at={[XC, 150]} appear={tPhi} />
        <SideCallout f={f} lines={[]} at={[XC + 4, 270]} appear={t48} target={wedgeMid} bend={50} />
      </Svg>
      <TeX s={String.raw`48.4^\circ`} x={XC + 10} y={270} size={T.eq} c={C.gold} o={fin(f, t48) * fout(f, tN - 20)} />
      <TeX s={EQ_S05} x={XC + 10} y={270} size={T.eq} c={C.ink} o={fin(f, tN)} />
      <TeX s={String.raw`-90^\circ\le\varphi\le+90^\circ`} x={XC} y={430} size={T.calc} c={C.ink} o={fin(f, tRange)} />
    </Scene>
  );
};

// ================================================================ s06 the parallel: a circle round the axis
// remake 2026-11-07, fact-check row 5: the spoken list now names every country the parallel crosses (Natural Earth crossings in
// cs.json par48.seg, DS05); the added labels sit at the middle of their crossing segment (data, not hand-placed)
const L0: { t: string; lon: number }[] = D.par48.labels;
const SEG = D.par48.seg as Record<string, [number, number][]>;
const midOf = (c: string, i: number) => (SEG[c][i][0] + SEG[c][i][1]) / 2;
const LAB48: { t: string; lon: number; say: [number, string] }[] = [
  { t: L0[0].t, lon: L0[0].lon, say: [5, "central Europe"] }, { t: L0[1].t, lon: L0[1].lon, say: [5, "Ukraine"] },
  { t: "Russia", lon: midOf("Russia", 0), say: [5, "southern Russia"] }, { t: L0[2].t, lon: L0[2].lon, say: [5, "Kazakhstan"] },
  { t: "China", lon: midOf("China", 0), say: [5, "the far west of China"] }, { t: L0[3].t, lon: L0[3].lon, say: [5, "Mongolia"] },
  { t: "China", lon: midOf("China", 2), say: [5, "north-east China"] }, { t: "Russia", lon: midOf("Russia", 1), say: [5, "Russia's Far East"] },
  { t: "Pacific", lon: -165, say: [6, "the Pacific"] }, { t: "Vancouver Island", lon: midOf("Canada", 0), say: [6, "Vancouver Island"] },
  { t: L0[4].t, lon: L0[4].lon, say: [6, "northern United States"] }, { t: L0[5].t, lon: L0[5].lon, say: [6, "eastern Canada"] },
  { t: L0[6].t, lon: L0[6].lon, say: [6, "Atlantic"] },
];
const SEA48 = new Set(["Atlantic", "Pacific"]);
if (L0.map((l) => l.t).join("|") !== "central Europe|Ukraine|Kazakhstan|Mongolia|United States|Canada|Atlantic") throw new Error("par48 labels changed in cs.json");
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = K("s06_parallel");
  const tJoin = SS(k, 1), tSweep = SS(k, 2), tSame = SS(k, 3), tPar = AT(k, 4, "parallel"), t5 = SS(k, 5), t6 = SS(k, 6), tAcross = AT(k, 7, "straight across"),
    tDisc = SS(k, 8), tNot = SS(k, 9), tAxis = SS(k, 10), tRound = SS(k, 11), tRings = SS(k, 12), tSoon = SS(k, 13);
  const at = LAB48.map((l) => AT(k, l.say[0], l.say[1]));
  const lonU = (lo: number) => (lo < LON0 ? lo + 360 : lo);
  const cam = spinPath([
    { f: 0, lat: 12, lon: LON0 - 40, dist: 3.3 }, { f: tJoin + 40, lat: 30, lon: -40, dist: 3.4 }, { f: t5 - 20, lat: 34, lon: -10, dist: 3.4 },
    ...LAB48.map((l, i) => ({ f: at[i] - 10, lat: 34, lon: lonU(l.lon), dist: 3.4 })),
    { f: SE(k, 6) + 10, lat: 34, lon: 355.5, dist: 3.4 }, { f: tAcross + 30, lat: 46, lon: 340, dist: 3.5 }, { f: LEN(k) + 10, lat: 46, lon: 345, dist: 3.5 },
  ], f);
  const slide = 1 - prog(f, tJoin, tJoin + 30);
  const sweep = prog(f, tSweep + 15, SE(k, 2) - 10);
  const lonNow = LON0 + 360 * sweep;
  const alpha = 1 - 0.5 * win(f, tSweep, t5, 20);
  const lift = 0.42 * prog(f, tAcross, tAcross + 40) * (1 - prog(f, tSoon, tSoon + 40));
  const capO = 1 - 0.8 * prog(f, tAcross, tAcross + 40) * (1 - prog(f, tSoon, tSoon + 40));
  const cut = f < tAcross ? merCut(slide) : ({ kind: "lat", lat0: PHI, lift, capO } as const);
  const G = globeG(cam);
  const dc = G.pw([0, Math.sin(CB), 0]), c0 = G.pw([0, 0, 0]);
  return (
    <Scene>
      <Earth cam={cam} cut={cut} alpha={alpha} coast={0.45}
        over={(Gg) => {
          const sw = f < tSweep ? 0 : sweep, n = Math.max(2, Math.round(180 * sw));
          const { front, back } = splitVis(Gg, Array.from({ length: n + 1 }, (_, i) => ll(PHI, LON0 + (360 * sw * i) / n, 1.002)));
          const pNow = ll(PHI, lonNow);
          return <>
            {back.map((s, i) => (s.length > 1 ? <path key={`b${i}`} d={poly(s)} fill="none" stroke={C.second} strokeWidth={4} strokeOpacity={0.35 * (1 - fin(f, t5))} strokeDasharray="8 8" /> : null))}
            {front.map((s, i) => (s.length > 1 ? <path key={`f${i}`} d={poly(s)} fill="none" stroke={C.second} strokeWidth={5 + 3 * fin(f, tPar)} /> : null))}
            {f >= tSweep && f < t5 + 10 ? <g opacity={fout(f, t5)}>
              {gseg(Gg, [0, 0, 0], pNow, RAD, 6)}
              <path d={poly(Array.from({ length: 13 }, (_, i) => Gg.pw(ll(PHI * i / 12, lonNow, 0.3))))} fill="none" stroke={C.gold} strokeWidth={5} />
              <g data-lc-maplabel="1"><Lbl x={Gg.pw(ll(PHI / 2, lonNow, 0.36))[0] + 16} y={Gg.pw(ll(PHI / 2, lonNow, 0.36))[1]} t="48.4°" c={C.gold} s={T.floor}
                o={fin(f, AT(k, 2, "forty eight point four"))} /></g>{/* calc audit S11 */}
              {gseg(Gg, [0, 0, 0], ll(0, lonNow, 0.42), C.local, 3, 0.8, "8 8")}
            </g> : null}
            {gdot(Gg, BREST[0], BREST[1], C.gold, 10)}
            {/* K6 k6r1: each name is gone (10-frame fade) 8 frames before the next one comes in (they cross-faded on one spot) */}
            {/* remake 2026-11-07: 13 names, some under a second apart: they alternate above / below the parallel, and each is gone before the
                next name on its own side comes in (the old rule: 8 frames clear, at most 2.5 s) */}
            {LAB48.map((l, i) => { const up = i % 2 === 0, nx = at[i + 2];
              return plab(Gg, up ? PHI + 3.2 : PHI - 3.2, l.lon, l.t, win(f, at[i], nx !== undefined ? Math.min(at[i] + 75, nx - 18) : at[i] + 75) * facing(Gg, PHI, l.lon),
                0, up ? -26 : 44, "middle", SEA48.has(l.t)); })}
            {/* pass 2: the inside lines (axis piece, the two centres) leave when the cap closes over them (they would sit on the opaque globe) */}
            {f >= tAcross ? <g opacity={fin(f, tDisc) * fout(f, tSoon)}>
              {gseg(Gg, [0, -0.05, 0], [0, Math.sin(CB), 0], C.local, 4, 1, "10 8")}
              <circle cx={dc[0]} cy={dc[1]} r={10} fill={C.local} stroke={C.bg} strokeWidth={3} />
              <circle cx={c0[0]} cy={c0[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tNot)} />
            </g> : null}
            {[0, 15, 30, 45, 60, 75].map((la, i) => <path key={la} d={parPath(Gg, la)} fill="none" stroke={C.second} strokeWidth={3} opacity={0.8 * fin(f, tRings + i * 8)} />)}
          </>;
        }} />
      <GSrc cut o={1 - win(f, tJoin + 30, tAcross - 8, 8)} /><GSrc o={win(f, tJoin + 38, tAcross - 20, 8)} />{/* pass 2: Natural Earth only while the joined Earth shows its coastline */}
      <Svg>
        <Keyword f={f} text="same latitude?" at={[XC, 150]} appear={0} out={tSame - 20} />
        <Keyword f={f} text="same latitude 48.4°" at={[XC, 150]} appear={tSame} />
        <Keyword f={f} text="parallel" at={[XC, 250]} appear={tPar} />
        <SideCallout f={f} lines={["not the same centre"]} at={[XC + 4, 470]} out={tSoon} appear={tNot} target={[(dc[0] + c0[0]) / 2 + 14, (dc[1] + c0[1]) / 2]} bend={40} />
        <SideCallout f={f} lines={["on the axis"]} at={[XC + 4, 380]} out={tSoon} appear={tAxis} target={[dc[0] + 16, dc[1] - 6]} bend={30} />
        <Keyword f={f} text="parallel = circle round the axis" at={[XC, 580]} appear={tRound} s={T.floor + 4} />
        <Keyword f={f} text="smaller towards the poles" at={[XC, 680]} appear={tRings} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s07 colatitude
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_colatitude");
  const tFrom = AT(k, 2, "start from the North Pole"), tCo = AT(k, 3, "colatitude"), tFill = SS(k, 4), tEq = SS(k, 5), tCalc = SS(k, 6), tAngle = SS(k, 8), tCircle = SS(k, 9);
  const G = globeG(CAMF);
  const P = (u: number, v: number) => G.pw(fpt(u, v));
  const c0 = P(0, 0), pb = P(BU, BV);
  const coMid = P(0.5 * Math.cos((90 + PHI) / 2 * D2R), 0.5 * Math.sin((90 + PHI) / 2 * D2R));
  const coArc = PHI + (90 - PHI) * (1 - prog(f, tFrom, tFrom + 30));
  return (
    <Scene>
      <Earth cam={CAMF} cut={merCut(1)} coast={0.4}
        over={() => <>
          <line x1={P(0, -1.25)[0]} y1={P(0, -1.25)[1]} x2={P(0, 1.25)[0]} y2={P(0, 1.25)[1]} stroke={C.local} strokeWidth={4} />
          <line x1={c0[0]} y1={c0[1]} x2={P(1, 0)[0]} y2={P(1, 0)[1]} stroke={C.local} strokeWidth={5} />
          <path d={`M${c0[0]} ${c0[1]}${faceArc(P, 0, 0, 0.62, 0, PHI).replace("M", "L")}Z`} fill={C.gold} fillOpacity={0.16 + 0.2 * pulse(f, tFill + 20, 30)} stroke="none" />
          <path d={faceArc(P, 0, 0, 0.62, 0, PHI)} fill="none" stroke={C.gold} strokeWidth={8} />
          <g opacity={fin(f, tFrom)}>
            <path d={`M${c0[0]} ${c0[1]}${faceArc(P, 0, 0, 0.5, coArc, 90).replace("M", "L")}Z`} fill={C.local} fillOpacity={0.18 + 0.2 * pulse(f, tFill + 50, 30)} stroke="none" />
            <path d={faceArc(P, 0, 0, 0.5, coArc, 90)} fill="none" stroke={C.local} strokeWidth={8} />
          </g>
          <path d={`M${P(0.12, 0)[0]} ${P(0.12, 0)[1]}L${P(0.12, 0.12)[0]} ${P(0.12, 0.12)[1]}L${P(0, 0.12)[0]} ${P(0, 0.12)[1]}`} fill="none" stroke={C.ink} strokeWidth={4} opacity={fin(f, tFill)} />
          <line x1={P(-BU, BV)[0]} y1={P(-BU, BV)[1]} x2={pb[0]} y2={pb[1]} stroke={C.second} strokeWidth={6} strokeDasharray="14 8" opacity={win(f, tCircle, LEN(k) + 20)} />
          <Arrow p={c0} q={pb} color={RAD} />
          <circle cx={c0[0]} cy={c0[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={3} />
          <circle cx={pb[0]} cy={pb[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        </>} />
      <GSrc cut />
      <Svg>
        <Keyword f={f} text="a second way" at={[XC, 150]} appear={0} out={tCo - 30} />
        <SideCallout f={f} lines={["colatitude"]} at={[XC + 4, 150]} appear={tCo} target={coMid} c={C.local} bend={40} />
        <g opacity={fin(f, tAngle)}>
          <path d={`M1110 650L1180 650M1110 650L1160 600`} fill="none" stroke={C.local} strokeWidth={6} />
          <path d={arcD([1110, 650], 40, 0, 45)} fill="none" stroke={C.local} strokeWidth={4} />
          <Lbl x={1200} y={630} t="colatitude: an angle" c={C.key} s={T.key} />
        </g>
        <g opacity={fin(f, tCircle)}>
          <ellipse cx={1140} cy={750} rx={34} ry={12} fill="none" stroke={C.second} strokeWidth={6} />
          <Lbl x={1200} y={750} t="parallel: a circle" c={C.key} s={T.key} />
        </g>
      </Svg>
      <TeX s={String.raw`\varphi+\text{colatitude}=90^\circ`} x={XC} y={260} size={T.calc} c={C.ink} o={fin(f, tFill + 30)} />
      <TeX s={EQ_S07} x={XC} y={370} size={T.calc} c={C.ink} o={fin(f, tEq)} />
      <TeX s={String.raw`90^\circ-48.4^\circ=41.6^\circ`} x={XC} y={480} size={T.calc} c={C.ink} o={fin(f, tCalc)} />
    </Scene>
  );
};

// ================================================================ s08 sine and cosine swap (TwoViewSlice; skip chip K1)
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = K("s08_sin_cos_swap");
  const chipA = AT(k, 3, "skip ahead"), chipEnd = chipA + 255;
  const tTri = SS(k, 4), tShrink = AT(k, 5, "shrink it to length one"), tDrop = AT(k, 6, "drop a line"), tRT = AT(k, 7, "right triangle"), tRule = SS(k, 8),
    tPhi = SS(k, 9), tCos = AT(k, 10, "cosine phi"), tSin = AT(k, 11, "sine phi"), tOther = SS(k, 12), t180 = SS(k, 13), tShare = SS(k, 14), tCo = AT(k, 15, "exactly the colatitude"),
    tSwap = SS(k, 16), tSame = SS(k, 17), tEq = SS(k, 18), tNum = SS(k, 19), tBook = SS(k, 20);
  const flatIn = Math.max(chipEnd, tTri);
  const L = 1 - 0.2 * prog(f, tShrink, tShrink + 30);
  const b: [number, number] = [L * BU, L * BV], ft: [number, number] = [L * BU, 0];
  const items: FItem[] = [
    { k: "dot", p: [0, 0], c: C.gold, at: 0, same: false },
    { k: "seg", a: [0, -1.1], b: [0, 1.15], c: C.local, w: 4, at: 0, same: false },
    { k: "seg", a: [0, 0], b: [1, 0], c: C.local, w: 4, at: 0, same: false },
    { k: "arrow", a: [0, 0], b, c: RAD, at: 0, same: false },
    { k: "lbl", p: [b[0] / 2, b[1] / 2], t: "length 1", t2: "1", c: RAD, dx: -24, dy: -26, a: "end", at: tShrink + 30 },   // K6 k6r1: flat "1" (the long label crossed the axis)
    { k: "seg", a: b, b: ft, c: C.local, w: 5, dash: "12 8", at: tDrop },
    { k: "tick", p: ft, d1: [-1, 0], d2: [0, 1], s: 0.08, at: tDrop + 20 },
    { k: "fill", pts: [[0, 0], ft, b], c: C.ink, fo: 0.1, at: tRT },
    { k: "wedge", r: 0.3, a0: 0, a1: PHI, c: C.gold, fo: 0.22, at: tPhi },
    { k: "arc", r: 0.3, a0: 0, a1: PHI, c: C.gold, w: 6, at: tPhi, same: false },
    { k: "tex", p: [0.2 * Math.cos(CB / 2), 0.2 * Math.sin(CB / 2)], t: String.raw`\varphi`, c: C.gold, size: 48, at: tPhi + 4, same: false },
    { k: "band", a: [0, 0], b: ft, c: C.second, w: 16, at: tCos },
    { k: "tex", p: [ft[0] / 2, 0], t: String.raw`\cos\varphi`, c: C.second, size: 48, dx: 16, dx3: 0, dy: 44, at: tCos, same: false },
    { k: "band", a: ft, b, c: C.second, w: 16, at: tSin },
    { k: "tex", p: [ft[0], b[1] / 2], t: String.raw`\sin\varphi`, c: C.second, size: 48, dx: 100, ax: 0, dx3: 22, ax3: 0, at: tSin, same: false },   // flat: right of the rim (K6 k6r1)
  ];
  // the colatitude corner wedge is centred at Brest's end (items' wedges are centred on the face origin): drawn in the extra layers
  const corner = (P: (u: number, v: number) => Pt) => {
    const o = fin(f, tOther);
    if (o <= 0) return null;
    const pts: Pt[] = Array.from({ length: 25 }, (_, i) => { const a = (180 + PHI + ((90 - PHI) * i) / 24) * D2R; return P(b[0] + 0.17 * Math.cos(a), b[1] + 0.17 * Math.sin(a)); });
    return <g opacity={o}><path d={`M${P(...b)[0]} ${P(...b)[1]}${poly(pts).replace("M", "L")}Z`} fill={C.local} fillOpacity={0.35} stroke={C.local} strokeWidth={4} /></g>;
  };
  const eqs = cutAt(EQ_S08, String.raw`,\qquad `);
  // review 1 S6: the flat twin was 200 px wide (the "1", φ and the side tags near the floor); now radius 260
  const S8C: Pt = [1110, 310], S8R = 260;
  const P2 = faceFlat(S8C, S8R);
  // K6 k6f2: the link stops just outside the rim, pointing in at Brest's corner (crossing the rim is a link-axis fault)
  const cornerTip = P2(1.07 * Math.cos(PHI * D2R), 1.07 * Math.sin(PHI * D2R));
  const roleO = fin(f, tSwap);
  return (
    <Scene>
      <TwoView f={f} cam={camFace(LON0)} cut={merCut(1)} face={FACE_B} flatC={S8C} flatR={S8R} items={items} flatO={fin(f, flatIn, 15)}
        flatBase={(P) => <MerFlatBase P={P} />} extra3={(_, P) => corner(P)} extraFlat={(P) => corner(P)} />
      <Svg>
        <Keyword f={f} text="sine ↔ cosine" at={[XC, 150]} appear={0} out={chipA - 20} />
        <g opacity={win(f, tRule, SS(k, 12) - 10)}>
          <Lbl x={XC} y={680} t="next = long $\times\cos$" c={C.key} s={T.floor} />
          <Lbl x={XC} y={745} t="opposite = long $\times\sin$" c={C.key} s={T.floor} />
        </g>
        <g opacity={roleO * fout(f, tEq - 20)}>
          {/* K6 k6r1: "next" right of the moved sin φ tag; "opposite" left of the axis on the cos φ row (it crossed the axis and the rim) */}
          <Lbl x={1500} y={ptOf(P2, [ft[0], b[1] / 2])[1]} t="next" c={C.gold} s={T.floor} />
          <Lbl x={S8C[0] - 16} y={ptOf(P2, [ft[0] / 2, 0])[1] + 58} t="opposite" c={C.gold} s={T.floor} a="end" />
        </g>
        <Keyword f={f} text="colatitude" at={[1440, 150]} appear={tCo} out={tEq - 20} c={C.local} targets={[cornerTip]} />{/* review 1 S6: linked to Brest's corner */}
        <Keyword f={f} text="same sides, swapped roles" at={[XC, 790]} appear={tSame} out={tEq - 20} s={T.floor} />
        <Lbl x={1440} y={420} t="books with" c={C.key} s={T.floor} o={fin(f, tBook)} />
        <Lbl x={1440} y={475} t="colatitude:" c={C.key} s={T.floor} o={fin(f, tBook)} />
        <Lbl x={1440} y={540} t="$\cos\leftrightarrow\sin$" c={C.key} s={T.key} o={fin(f, tBook)} />
      </Svg>
      <TeX s={String.raw`180^\circ-90^\circ-\varphi=90^\circ-\varphi`} x={XC} y={660} size={60} c={C.ink} o={win(f, tShare, tEq - 20)} />
      <TeX s={eqs[0]} x={XC} y={650} size={60} c={C.ink} o={fin(f, tEq)} />
      <TeX s={eqs[1]} x={XC} y={735} size={60} c={C.ink} o={fin(f, AT(k, 18, "and the cosine of the colatitude"))} />
      <TeX s={String.raw`\sin 41.6^\circ\approx 0.6639=\cos 48.4^\circ`} x={XC} y={820} size={T.floor + 6} c={C.ink} o={fin(f, tNum)} />
      {/* remake 2026-11-07 (R16): Part 1's polar lines recalled where the triangle rule is used (S8), right of the flat face */}
      <Recall f={f} tex={String.raw`x=r\cos\theta,\ \ y=r\sin\theta`} name="polar coordinates" x={1372} y={430} size={44} appear={tRule} out={SS(k, 12) - 10} />
      <SkipChip f={f} k={k} to={keepTime("s09_meridians")} />
      {void [t180, poly]}
    </Scene>
  );
};

// ================================================================ s09 meridians
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09_meridians");
  const tLine = SS(k, 3), tStart = AT(k, 4, "Start at the North Pole"), tMer = AT(k, 5, "meridian"), tSun = SS(k, 6), tTurn = SS(k, 7), tMeet = SS(k, 8), tBig = SS(k, 9), tPar = SS(k, 10);
  const draw = prog(f, tStart + 40, SE(k, 4));
  const tipLat = 90 - 180 * draw;
  const turnEnd = SE(k, 8) - 70;
  const cam = spinPath([
    { f: 0, lat: 30, lon: -30, dist: 3.4 }, { f: tStart + 30, lat: 60, lon: -30, dist: 3.4 }, { f: tStart + 40, lat: 60, lon: -30, dist: 3.4 },
    { f: SE(k, 4), lat: -40, lon: -30, dist: 3.4 }, { f: tTurn, lat: 10, lon: -30, dist: 3.4 },
    { f: turnEnd, lat: 10, lon: -390, dist: 3.4, spin: 0.15 }, { f: SE(k, 8), lat: 55, lon: -390, dist: 3.4 }, { f: tBig + 70, lat: 15, lon: -400, dist: 3.4 },
    { f: LEN(k) + 10, lat: 15, lon: -405, dist: 3.4 },
  ], f);
  const alpha = 1 - 0.6 * fin(f, tBig, 20);
  const G = globeG(cam);
  const topP = G.p(Math.max(tipLat, -85), -30, 1.004);
  return (
    <Scene>
      <Earth cam={cam} alpha={alpha} coast={0.45}
        over={(Gg) => <>
          <path d={merPath(Gg, -30, 90, tipLat, 1.003)} fill="none" stroke={C.second} strokeWidth={7} opacity={fin(f, tStart + 40, 4)} />
          {Array.from({ length: 11 }, (_, i) => { const m = -60 - 30 * i; const o = f < tTurn ? 0 : clamp((m + 5 - cam.lon) / 10, 0, 1);
            return <path key={m} d={merPath(Gg, m)} fill="none" stroke={C.second} strokeWidth={4} opacity={o} />; })}
          {f >= tBig ? <g opacity={fin(f, tBig)}>
            <path d={poly([...Array.from({ length: 61 }, (_, i) => Gg.pw(ll(-90 + 3 * i, -30))), ...Array.from({ length: 61 }, (_, i) => Gg.pw(ll(90 - 3 * i, 150)))])}
              fill="none" stroke={C.second} strokeWidth={3} strokeDasharray="10 8" opacity={0.7} />
            <circle cx={Gg.pw([0, 0, 0])[0]} cy={Gg.pw([0, 0, 0])[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={3} />
          </g> : null}
          {f >= tPar ? <g opacity={fin(f, tPar)}>
            <path d={poly(Array.from({ length: 121 }, (_, i) => Gg.pw(ll(50, (360 * i) / 120))))} fill="none" stroke={C.local} strokeWidth={4} />
            <circle cx={Gg.pw([0, Math.sin(50 * D2R), 0])[0]} cy={Gg.pw([0, Math.sin(50 * D2R), 0])[1]} r={10} fill={C.local} stroke={C.bg} strokeWidth={3} />
            {gseg(Gg, [0, -1.1, 0], [0, 1.2, 0], C.local, 3, 0.8, "8 8")}
          </g> : null}
        </>} />
      <GSrc />
      <Svg>
        <SunGlyph x={topP[0] + 120} y={Math.max(120, topP[1] - 60)} s={0.8} o={win(f, tSun, tTurn - 10)} />
        <Keyword f={f} text="another kind of line" at={[XC, 300]} appear={tLine} out={tMer - 20} />
        <SideCallout f={f} lines={["meridian", "half circle"]} at={[XC + 4, 300]} appear={tMer} out={tTurn - 10} target={[G.p(10, -30, 1.004)[0] + 10, G.p(10, -30, 1.004)[1]]} bend={40} />
        <Keyword f={f} text="midday" at={[XC, 470]} appear={tSun} out={tTurn - 10} />
        <Keyword f={f} text="12 meridians, 30° apart" at={[XC, 180]} appear={AT(k, 7, "twelve")} />{/* review 1 S1 */}
        <Keyword f={f} text="pole to pole" at={[XC, 300]} appear={tMeet} />
        <Keyword f={f} text="round the centre" at={[XC, 420]} appear={tBig} />
        <Keyword f={f} text="centre vs axis" at={[XC, 540]} appear={tPar} />
      </Svg>
      <KeepLine f={f} k={k} lines={["colatitude from the pole:", String.raw`$\sin\leftrightarrow\cos$`]} />
      {/* Part 1 lessons B4: the keep line's own picture (one triangle: φ at the centre, 90° − φ from the axis, sin φ = cos(90° − φ)) */}
      <KeepPic kind="swap" c={[1150, 760]} R={330} o={fin(f, 4, 10) * fout(f, SE(k, 1), 10)} />
      {void keepGone}
    </Scene>
  );
};

// ================================================================ s10 the prime meridian, pole to pole (zoom-reveal tour)
const TOUR: { t: string; lat: number; lon: number }[] = D.pm.tour;
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_prime_meridian");
  const tGold = SS(k, 0), tG = AT(k, 1, "Greenwich"), t1884 = AT(k, 1, "eighteen eighty four"), tPrime = AT(k, 2, "prime meridian"), tFollow = SS(k, 3), tPole = AT(k, 4, "North Pole");
  const say: Record<string, [number, string]> = {
    "Arctic Ocean": [4, "Arctic Ocean"], Greenland: [5, "Greenland"], Norway: [5, "Norway"], "Norwegian Sea": [5, "Norwegian Sea"], "North Sea": [5, "North Sea"],
    Yorkshire: [5, "Yorkshire"], Greenwich: [6, "Greenwich"], Brighton: [6, "Brighton"], "English Channel": [7, "English Channel"], Normandy: [7, "Normandy"], France: [7, "France"],
    Pyrenees: [7, "Pyrenees"], Spain: [8, "Spain"], Valencia: [8, "Valencia"], "Mediterranean Sea": [8, "Mediterranean Sea"], Algeria: [9, "Algeria"], Sahara: [9, "Sahara"],
    Mali: [9, "Mali"], "Burkina Faso": [9, "Burkina Faso"], Togo: [10, "Togo"], Ghana: [10, "Ghana"], Accra: [10, "Accra"], "Gulf of Guinea": [11, "Gulf of Guinea"],
    equator: [11, "equator"], "South Atlantic": [12, "South Atlantic"], "Southern Ocean": [12, "Southern Ocean"], Antarctica: [13, "Antarctica"], "South Pole": [13, "South Pole"],
  };
  const tOf = (t: string) => AT(k, say[t][0], say[t][1]);
  const keys = TOUR.filter((p) => !["Greenland", "Norway", "Arctic Ocean"].includes(p.t)).map((p) => ({ f: tOf(p.t) - 12, lat: clamp(p.lat, -82, 84), lon: 0, dist: 2.4, pp: [600, 470] as Pt }));
  const zEnd = LEN(k) - 50;
  const cam = globePath([
    { f: 0, lat: 30, lon: 0, dist: 4.6, pp: [520, 400] }, { f: tFollow - 50, lat: 51, lon: 0, dist: 4.6, pp: [520, 400] }, { f: tFollow, lat: 60, lon: 0, dist: 2.4, pp: [600, 470] },
    { f: tPole - 10, lat: 84, lon: 0, dist: 2.4, pp: [600, 470] }, { f: tOf("Norwegian Sea") - 12, lat: 70, lon: 0, dist: 2.4, pp: [600, 470] }, ...keys.slice(1),
    { f: zEnd, lat: -30, lon: 0, dist: 4.6, pp: [520, 400] }, { f: LEN(k) + 10, lat: -10, lon: 0, dist: 4.6, pp: [520, 400] },
  ], f);
  // K6 k6r1: unzoomed dist 4.3 → 4.6, centre y 420 → 400 and picture box h 810 → 790 (the disc and the source line's box reached the
  // caption band / each other); the source line steps aside while the growing disc covers it (zoom < 50 %: disc mask)
  const zoom = clamp((4.6 - cam.dist) / (4.6 - 2.4), 0, 1);
  const dk = discOf(cam, GFULL), srcO = zoom >= 0.5 ? 1 : clamp((814 - (dk.c[1] + dk.r)) / 12, 0, 1);
  // pass 2 (user 2026-11-07: every meridian ends at both poles): the gold line follows the camera down and, once it has reached the South
  // Pole, stays there while the camera zooms back out (it used to shrink back with the camera's latitude, ending near 50° S)
  const tSP = tOf("South Pole");
  const drawTo = f < tPole ? 90 : f >= tSP ? -90 : Math.max(-90, cam.lat - 22);
  const latTxt = `${Math.abs(Math.round(cam.lat))}° ${cam.lat >= 0.5 ? "N" : cam.lat <= -0.5 ? "S" : ""}`;
  return (
    <Scene>
      <Earth cam={cam} box={GFULL} coast={0.5} borders={0.5}
        over={(Gg) => <>
          <path d={merPath(Gg, 0)} fill="none" stroke={C.gold} strokeWidth={4} opacity={0.6 * fin(f, tGold) * (1 - fin(f, tPole))} />
          <path d={merPath(Gg, 0, 90, drawTo, 1.003)} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tPole)} />
          {gdot(Gg, 51.48, 0, C.gold, 10, fin(f, tG))}
          {plab(Gg, 51.48, 0, "Greenwich", fin(f, tG) * (1 - fin(f, tFollow)), 20, -30)}
          {TOUR.map((p) => { const t0 = tOf(p.t); const o = win(f, t0, t0 + 60);
            return o > 0 ? <g key={p.t}>{p.t === "equator" ? <line x1={Gg.p(0, -3)[0]} y1={Gg.p(0, -3)[1]} x2={Gg.p(0, 3)[0]} y2={Gg.p(0, 3)[1]} stroke={C.gold} strokeWidth={6} opacity={o} /> : null}
              {plab(Gg, p.lat, p.lon, p.t, o, p.lon < 0 ? -18 : 18, -28, p.lon < 0 ? "end" : "start", /Sea|Ocean|Gulf|Atlantic|Channel|equator/.test(p.t))}</g> : null; })}
        </>} />
      <GlobeFrame id="s10k" zoom={zoom} right={zoom} disc={discOf(cam, GFULL)} />
      <SourceBelow text={SRC_G} pic={{ x: 60, y: 20, w: 960, h: 790 }} w={960} o={srcO} name="globe src" />
      <Svg>
        <Keyword f={f} text="the starting line" at={[XZ, 180]} appear={0} out={tPrime - 30} />
        <Keyword f={f} text="prime meridian" at={[XZ, 180]} appear={tPrime} />
        <Keyword f={f} text="0° longitude" at={[XZ, 280]} appear={tPrime + 20} />
        <Lbl x={XZ} y={370} t={latTxt} c={C.gold} s={T.calc} o={win(f, tPole, zEnd - 20)} />
        <Keyword f={f} text="agreed in 1884" at={[XZ, 470]} appear={t1884} out={tFollow + 30} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s11 longitude: the angle round the axis
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_longitude");
  const tUp = SS(k, 1), tSpoke = SS(k, 2), tSlice = AT(k, 3, "slice the Earth across"), tRim = SS(k, 4), tLon = AT(k, 5, "Longitude is the angle"), tLam = AT(k, 6, "lambda"),
    tEast = SS(k, 7), tPlus = SS(k, 8), tMinus = SS(k, 9), tB = SS(k, 10), t360 = SS(k, 11), tThen = SS(k, 12), tSame = SS(k, 13);
  const cam = globePath([{ f: 0, lat: 20, lon: -30, dist: 3.4 }, { f: tUp, lat: 20, lon: -60, dist: 3.4 }, { f: tUp + 95, lat: 88, lon: -90, dist: 3.4 },
    { f: tSlice, lat: 88, lon: -90, dist: 3.4 }, { f: tSlice + 50, lat: 70, lon: -90, dist: 3.3 }, { f: LEN(k) + 10, lat: 70, lon: -90, dist: 3.3 }], f);
  const capO = 1 - prog(f, tSlice, tSlice + 40);   // fix loop 1 (M2): the cap leaves completely; the face shows the true polar view
  const lift = 0.25 * prog(f, tSlice, tSlice + 40);
  const G = globeG(cam);
  const F = { O: [0, 0, 0] as V3, U: e2g([1, 0, 0]), V: e2g([0, 1, 0]) };
  const P = (u: number, v: number): Pt => G.pw([F.O[0] + u * F.U[0] + v * F.V[0], 0, F.O[2] + u * F.U[2] + v * F.V[2]]);
  const ang = (lo: number, r: number) => P(r * Math.cos(lo * D2R), r * Math.sin(lo * D2R));
  const c0 = P(0, 0);
  const arcLon = (a0: number, a1: number, r: number) => poly(Array.from({ length: 49 }, (_, i) => ang(a0 + ((a1 - a0) * i) / 48, r)));
  const IC: Pt = [1330, 520], IR = 150;
  const part = cutAt(EQ_S11, String.raw`\ \ (`)[0], part2 = `(${cutAt(EQ_S11, String.raw`\ \ (`)[1]}`;
  return (
    <Scene>
      <Earth cam={cam} cut={f >= tSlice ? { kind: "lat", lat0: 0, lift, capO, polar: true } : { kind: "whole" }} coast={0.45} grat={0.4 * fin(f, tSpoke) * (1 - fin(f, tSlice))}
        over={(Gg) => <>
          <path d={merPath(Gg, 0)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tSpoke) * (1 - fin(f, tSlice))} />
          {f >= tSlice ? <g opacity={fin(f, tRim)}>
            {Array.from({ length: 12 }, (_, i) => <line key={i} x1={c0[0]} y1={c0[1]} x2={ang(i * 30, 1)[0]} y2={ang(i * 30, 1)[1]} stroke={i === 0 ? C.gold : C.local} strokeWidth={i === 0 ? 6 : 3} />)}
            <line x1={c0[0]} y1={c0[1]} x2={ang(LON0, 1)[0]} y2={ang(LON0, 1)[1]} stroke={C.key} strokeWidth={4} opacity={fin(f, tLon)} />
            <circle cx={c0[0]} cy={c0[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} />
            <path d={arcLon(0, LON0, 0.7)} fill="none" stroke={C.second} strokeWidth={8} opacity={fin(f, tLon)} />
            <path d={arcLon(15, 75, 1.06)} fill="none" stroke={C.key} strokeWidth={5} opacity={fin(f, tEast)} />
            <Chevron at={ang(75, 1.06)} dir={[ang(76, 1.06)[0] - ang(75, 1.06)[0], ang(76, 1.06)[1] - ang(75, 1.06)[1]]} c={C.key} o={fin(f, tEast)} />
            <path d={arcLon(0, 180, 0.85)} fill="none" stroke={C.second} strokeWidth={6} opacity={0.8 * fin(f, tPlus)} />
            <path d={arcLon(0, -180, 0.85)} fill="none" stroke={C.neg} strokeWidth={6} strokeDasharray="14 10" opacity={0.8 * fin(f, tMinus)} />
          </g> : null}
          {gdot(Gg, BREST[0], BREST[1], C.gold, 9, f < tSlice ? 1 : 0)}
        </>} />
      <GSrc />
      <Svg>
        <g data-lc-maplabel="1">
          <Lbl x={ang(80, 1.15)[0]} y={ang(80, 1.15)[1]} t="east" c={C.key} s={T.floor} a="middle" o={fin(f, tEast)} />
          {/* calc audit S2: the ends of each half are named on their words ("up to 180° E", "down to −180") */}
          <Lbl x={ang(90, 0.62)[0]} y={ang(90, 0.62)[1]} t="+" c={C.second} s={T.key} a="middle" o={fin(f, tPlus)} />
          <Lbl x={ang(90, 0.62)[0]} y={ang(90, 0.62)[1] + 56} t="0 … +180° E" c={C.second} s={T.floor} a="middle" o={fin(f, AT(k, 8, "up to a hundred"))} />
          <Lbl x={ang(-90, 0.62)[0]} y={ang(-90, 0.62)[1]} t="−" c={C.neg} s={T.key} a="middle" o={fin(f, tMinus)} />
          <Lbl x={ang(-90, 0.62)[0]} y={ang(-90, 0.62)[1] + 56} t="0 … −180°" c={C.neg} s={T.floor} a="middle" o={fin(f, AT(k, 9, "down to minus"))} />
        </g>
        <Keyword f={f} text="the second angle" at={[XC, 150]} appear={0} out={tLon - 30} />
        <Keyword f={f} text="longitude $\lambda$" at={[XC, 150]} appear={tLam} />
        <g opacity={win(f, tLon + 20, t360 - 10)}>
          <circle cx={IC[0]} cy={IC[1]} r={IR + 14} fill={C.bg} stroke={C.grid} strokeWidth={3} />
          <line x1={IC[0]} y1={IC[1]} x2={IC[0] + IR} y2={IC[1]} stroke={C.gold} strokeWidth={6} />
          <line x1={IC[0]} y1={IC[1]} x2={IC[0] + IR * Math.cos(27 * D2R)} y2={IC[1] + IR * Math.sin(27 * D2R)} stroke={C.key} strokeWidth={5} />
          <path d={`M${IC[0]} ${IC[1]}${arcD(IC, IR * 0.8, 0, -27).replace("M", "L")}Z`} fill={C.second} fillOpacity={0.25} stroke={C.second} strokeWidth={5} />
        </g>
        {/* Part 1 lessons B1: the inset shows what it magnifies (ring on the λ arc at the centre, leader, "magnified 6×") */}
        <Magnify src={ang(LON0 / 2, 0.7)} at={IC} r={IR + 14} label="magnified $6\times$" ly={IC[1] + IR + 50} o={win(f, tLon + 20, t360 - 10)} />
      </Svg>
      <TeX s={String.raw`\lambda`} x={IC[0] + IR * 0.95} y={IC[1] + 30} size={T.key} c={C.second} ax={0} o={win(f, tLam, t360 - 10)} halo />
      {/* remake 2026-11-07 (R16): Part 1's angle convention on screen while the voice names it (S7-S9) */}
      <Recall f={f} tex={String.raw`\theta\ \text{anticlockwise from east}`} name="polar angle" verb="defined" x={XC} y={260} size={46} appear={tEast} out={tB - 12} />
      <TeX s={part} x={XC} y={290} size={T.eq} c={C.ink} o={fin(f, tB)} />
      <TeX s={part2} x={XC + 80} y={390} size={56} c={C.ink} o={fin(f, tThen)} />
      <Svg>
        <g opacity={fin(f, t360)}>
          <line x1={1120} y1={680} x2={1770} y2={680} stroke={C.muted} strokeWidth={4} />
          {[0, 90, 180, 270, 360].map((v) => <g key={v}><line x1={1120 + (v / 360) * 650} y1={668} x2={1120 + (v / 360) * 650} y2={692} stroke={C.muted} strokeWidth={4} />
            <Lbl x={1120 + (v / 360) * 650} y={720} t={`${v}°`} c={C.muted} s={T.floor} a="middle" b={false} /></g>)}
          <circle cx={1120 + (355.5 / 360) * 650} cy={680} r={12} fill={C.gold} />
          <Lbl x={1120} y={630} t="always going east" c={C.key} s={T.floor} />
        </g>
        <Keyword f={f} text="same meridian" at={[XC, 520]} appear={tSame} />
      </Svg>
      <TeX s={String.raw`360^\circ-4.5^\circ=355.5^\circ`} x={XC} y={800} size={60} c={C.ink} o={fin(f, AT(k, 12, "three hundred and fifty five"))} />
    </Scene>
  );
};

// ================================================================ s12 the graticule
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12_graticule");
  const tMer = SS(k, 1), tPar = SS(k, 2), tGrat = AT(k, 3, "graticule"), tRight = SS(k, 4), tPlace = SS(k, 5), tTwo = SS(k, 6), tBrest = SS(k, 7);
  const atLat = [AT(k, 2, "the equator"), AT(k, 2, "fifteen north"), AT(k, 2, "thirty north"), AT(k, 2, "forty five"), AT(k, 2, "sixty"), AT(k, 2, "seventy five")];
  const tSouth = AT(k, 2, "the same to the south");
  const atLon = [AT(k, 1, "zero"), AT(k, 1, "fifteen east"), AT(k, 1, "thirty east"), AT(k, 1, "all the way round")];
  const cam = spinPath([{ f: 0, lat: 20, lon: -10, dist: 3.4 }, { f: atLon[0], lat: 20, lon: 0, dist: 3.4 }, { f: atLon[2] + 20, lat: 20, lon: 30, dist: 3.4 },
    { f: tPar, lat: 20, lon: 20, dist: 3.4 }, { f: tBrest, lat: 30, lon: 5, dist: 3.4 }, { f: LEN(k) + 10, lat: 32, lon: 0, dist: 3.4 }], f);
  const G = globeG(cam);
  const merO = (lon: number) => {
    if (lon === 0) return fin(f, atLon[0]); if (lon === 15) return fin(f, atLon[1]); if (lon === 30) return fin(f, atLon[2]);
    const i = ((lon - 45 + 360) % 360) / 15;
    return fin(f, atLon[3] + i * 3, 8);
  };
  const parO = (la: number) => { const a = Math.abs(la), i = [0, 15, 30, 45, 60, 75].indexOf(a); return la < 0 ? fin(f, tSouth + i * 4) : fin(f, atLat[i]); };
  const tagLon = cam.lon - 62;
  const tick = (() => { const la = 15, lo = Math.round(cam.lon / 15) * 15; const p = G.p(la, lo), e = G.p(la, lo + 4), n = G.p(la + 4, lo);
    const u = (q: Pt): Pt => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [(q[0] - p[0]) / d, (q[1] - p[1]) / d]; }; return { p, e: u(e), n: u(n) }; })();
  const bP = G.p(BREST[0], BREST[1]);
  return (
    <Scene>
      <Earth cam={cam} coast={0.4}
        over={(Gg) => <>
          {Array.from({ length: 24 }, (_, i) => i * 15).map((lon) => <path key={`m${lon}`} d={merPath(Gg, lon > 180 ? lon - 360 : lon)} fill="none" stroke={C.local} strokeWidth={3}
            opacity={merO(lon)} />)}
          {[-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75].map((la) => <path key={`p${la}`} d={parPath(Gg, la)} fill="none" stroke={C.second} strokeWidth={3} opacity={parO(la)} />)}
          {[0, 15, 30].map((lon, i) => plab(Gg, 0, lon, i === 0 ? "0°" : `${lon}° E`, win(f, atLon[i], tPar) * facing(Gg, 0, lon), 0, 34, "middle"))}
          <path d={parPath(Gg, BREST[0])} fill="none" stroke={C.second} strokeWidth={7} opacity={fin(f, tBrest)} />
          <path d={merPath(Gg, BREST[1])} fill="none" stroke={C.local} strokeWidth={7} opacity={fin(f, tBrest)} />
          {gdot(Gg, BREST[0], BREST[1], C.gold, 12, fin(f, tBrest))}
          {plab(Gg, BREST[0], BREST[1], "Brest", fin(f, tBrest), -20, -30, "end")}
        </>} />
      <GSrc />
      <Svg>
        {/* review 1 S14 / calc audit S13: unclipped, 40 px further out (they sat on the rim; "75°" was cut at the top) */}
        {[0, 15, 30, 45, 60, 75].map((la, i) => <g key={la}>{plab(G, la, tagLon, i === 0 ? "0°" : i < 3 ? `${la}° N` : `${la}°`, win(f, atLat[i], tGrat + 60) * facing(G, la, tagLon), -50, -26, "end")}</g>)}
        <RightTick at={tick.p} u1={tick.e} u2={tick.n} s={26} c={C.gold} o={win(f, tRight + 30, tPlace)} />
        <Keyword f={f} text="both kinds of line" at={[XC, 150]} appear={0} out={tGrat - 30} />
        <Keyword f={f} text="graticule" at={[XC, 150]} appear={tGrat} />
        <Keyword f={f} text="meridians $\perp$ parallels" at={[XC, 250]} appear={tRight} />
        <Keyword f={f} text="place =" at={[XC, 360]} appear={tPlace} />
        <Keyword f={f} text="(latitude, longitude)" at={[XC, 440]} appear={tTwo} />
        <SideCallout f={f} lines={["48.4° N, 4.5° W"]} at={[XC + 4, 560]} appear={AT(k, 7, "forty eight point four")} target={[bP[0] + 14, bP[1]]} bend={40} />
      </Svg>
    </Scene>
  );
};

export const SCENES_A: Record<string, React.FC> = {
  s00_title: S00, s01_hook: S01, s03_sphere: S03, s04_slice_radius: S04, s05_latitude: S05, s06_parallel: S06, s07_colatitude: S07,
  s08_sin_cos_swap: S08, s09_meridians: S09, s10_prime_meridian: S10, s11_longitude: S11, s12_graticule: S12,
};
void [LYB, discOf, eastAt, lin];
