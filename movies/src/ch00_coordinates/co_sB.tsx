// ch00_coordinates scenes s15-s30: the sphere (latitude, longitude, position vector, the Earth as a cylinder, distances north
// and east, ERA5 boxes, areas), the local east-north-up frame and its turning, metric terms, curvilinear coordinates, three
// reasons, and the two London-Los Angeles routes. Globes: the house GB frame (whole, unzoomed: no edge fade, K1 disc mask);
// s24 is the zoom-reveal (full-bleed, K1 fades and the darkened right panel). Numbers from data/co.json only.
import React from "react";
import { useCurrentFrame } from "remotion";
import { PoleThermometer } from "../house";
import { C, T } from "../house/kit/type";
import { Band, Pt, RightTick } from "../house/kit/draw";
import { CalcStack, Layered, Part, TeX } from "../house/kit/tex";
import { Keyword } from "../house/kit/notes";
import { CurvedLink } from "../house/kit/extras";
import { Callout, GlobeFrame, SourceBelow } from "../house/kit/frame";
import { GProj, LatCircle, SurfArrow, enAt, gcArrowPts, globePath, ll, llPath } from "./kit_co/globe";
import { V3 } from "./kit_co/cam";
import {
  AT, Arrow, Ax, Axes, BREST, Curve, D, D2R, GB, GFULL, GeoMap, Globe, LEN, LYB, Lbl, MapBox, PlaneIcon, SS, SE, Scene, Svg, ArcHead, arcD, axP, clamp,
  discOf, fin, fout, mix, nf, poly, prog, win, K, linesPath, globeG, mapP as mapP_, spinPath,
} from "./co_lib";
import { EQ_S18, EQ_S19, EQ_S20, EQ_S21, EQ_S23, EQ_S24, EQ_S25, EQ_S26, EQ_S27, EQ_S29 } from "./co_eq";

const SPH = D.sphere, MET = D.metric, RT = D.route;
const cutAt = (s: string, at: string): string[] => { if (!s.includes(at)) throw new Error(`cutAt: ${at} not in ${s}`); return s.split(at); };
const CHECK_B: [string, number, number, number][] = [
  ["a", SPH.a / 1e3, 6371, 1e-9], ["spd0", SPH.spd[0], 465, 0.5], ["spdB", SPH.spd[1], 309, 0.5], ["spdL", SPH.spd[2], 95, 0.2], ["dy1", SPH.dy1, 111.2, 0.01],
  ["dxB", SPH.dx1[1], 74, 0.2], ["dxL", SPH.dx1[2], 23, 0.31], ["box dy", SPH.box[0], 28, 0.21], ["box dxB", SPH.box[1], 18.5, 0.05], ["box dxL", SPH.box[2], 5.7, 0.03],
  ["z Brest", SPH.rb_km[2], 4760, 4], ["R Brest", SPH.R_km, 4230, 1], ["lam360", SPH.lam360, 355.5, 0.011], ["angBT", MET.angBT, 4, 0.33], ["angBS", MET.angBS, 101, 0.01],
  ["dBT", MET.dBT, 480, 0.5], ["swing", MET.swing, 12, 0.2], ["tilt", MET.tilt, 1, 1e-3], ["metric", MET.mx * 1e5, 1.6, 0.031], ["ratio", MET.ratio, 65, 0.71],
  ["sig", RT.sig, 79, 0.22], ["d", RT.d, 8760, 1], ["brg", RT.brg, 312, 0.34], ["vx", RT.vx[0], 62, 0.27], ["rh d", RT.rh_d, 9730, 3.4], ["rh b", RT.rh_b, 258, 0.45],
  ["rh pct", (RT.rh_d / RT.d - 1) * 100, 11, 0.12], ["rh extra", RT.rh_d - RT.d, 970, 3], ["gauge 30", SPH.gauge[10], 0.5, 1e-9],
];
CHECK_B.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
const GSRC = "Image: NASA Blue Marble Next Generation";
const GSrc: React.FC<{ o?: number }> = ({ o = 1 }) => <SourceBelow text={GSRC} pic={GB} w={960} o={o} name="globe src" />;
const dot = (G: GProj, la: number, lo: number, c: string = C.gold, r = 11, o = 1) => (o <= 0 || !G.vis(la, lo) ? null :
  <circle cx={G.p(la, lo)[0]} cy={G.p(la, lo)[1]} r={r} fill={c} stroke={C.bg} strokeWidth={4} opacity={o} />);
const seg = (G: GProj, a: V3, b: V3, c: string, w = 8, o = 1, dash?: string) => o <= 0 ? null :
  <line x1={G.pw(a)[0]} y1={G.pw(a)[1]} x2={G.pw(b)[0]} y2={G.pw(b)[1]} stroke={c} strokeWidth={w} strokeLinecap="round" opacity={o} strokeDasharray={dash} />;
const wlab = (G: GProj, v: V3, t: string, c: string, o = 1, dx = 16, dy = 0, a: "start" | "middle" | "end" = "start", s: number = T.floor) =>
  <Lbl x={G.pw(v)[0] + dx} y={G.pw(v)[1] + dy} t={t} c={c} s={s} a={a} o={o} />;
const scl = (v: V3, s: number): V3 => [v[0] * s, v[1] * s, v[2] * s];
const mer = (lon: number, a = -89, b = 89): [number, number][] => Array.from({ length: 61 }, (_, i) => [a + ((b - a) * i) / 60, lon]);

// ================================================================ s15 the sphere
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_sphere");
  const tO = SS(k, 1), tR = AT(k, 2, "distance from the centre"), tA = SS(k, 3), tSph = SS(k, 4), tLL = AT(k, 5, "latitude and longitude");
  const cam = globePath([{ f: 0, lat: 28, lon: -40, dist: 3.4 }, { f: LEN(k) + 10, lat: 36, lon: -14, dist: 3.4 }], f);
  const G0 = discOf(cam);
  const bW = ll(BREST[0], BREST[1]);
  const gr = prog(f, tR, tR + 30);
  return (
    <Scene>
      <Globe cam={cam} grat={0.3} meshO={mix(1, 0.62, fin(f, tO))}
        over={(G) => <>
          {seg(G, [0, 0, 0], scl(bW, gr), C.first, 9, fin(f, tR))}
          <circle cx={G.pw([0, 0, 0])[0]} cy={G.pw([0, 0, 0])[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={4} opacity={fin(f, tO)} />
          {dot(G, BREST[0], BREST[1], C.key, 10, fin(f, tR + 20))}
          <path d={poly(Array.from({ length: 21 }, (_, i) => G.pw(ll((BREST[0] * i) / 20, BREST[1], 0.32))))} fill="none" stroke={C.local} strokeWidth={5} opacity={fin(f, tLL)} />
          <path d={poly(Array.from({ length: 21 }, (_, i) => G.pw(ll(0, -40 + ((BREST[1] + 40) * i) / 20, 0.45))))} fill="none" stroke={C.local} strokeWidth={5} opacity={fin(f, tLL + 10)} />
        </>} />
      <GlobeFrame id="s15k" zoom={0} disc={G0} />
      <GSrc />
      <Svg>
        <Lbl x={1100} y={170} t="r" c={C.first} s={T.calc} o={fin(f, tR)} />
        <Callout f={f} lines="a ≈ 6400 | 6371 km" at={[1100, 300]} appear={tA} target={G0.c[0] > 0 ? [mix(G0.c[0], globeLabelX(cam, bW), 0.55), mix(G0.c[1], globeLabelY(cam, bW), 0.55)] : null} />
        <Keyword f={f} text="spherical coordinates" at={[1100, 480]} appear={tSph} />
        <Keyword f={f} text="latitude · longitude" at={[1100, 600]} appear={tLL} />
      </Svg>
    </Scene>
  );
};
const globeLabelX = (cam: Parameters<typeof globeG>[0], v: V3) => globeG(cam).pw(v)[0];
const globeLabelY = (cam: Parameters<typeof globeG>[0], v: V3) => globeG(cam).pw(v)[1];

// ================================================================ s16 latitude
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16_latitude");
  const tLine = SS(k, 1), tAng = SS(k, 2), tPhi = AT(k, 3, "phi"), tEq = SS(k, 4), tNP = SS(k, 5), tSP = SS(k, 6), tBr = AT(k, 7, "Brest"), tPar = SS(k, 8),
    tCol = SS(k, 9), tCo = SS(k, 10), tSw = SS(k, 11);
  const cam = globePath([{ f: 0, lat: 36, lon: -14, dist: 3.4 }, { f: tLine, lat: 8, lon: -4.49 - 25, dist: 3.4 }, { f: tBr - 10, lat: 8, lon: -4.49 - 25, dist: 3.4 },
    { f: tBr + 25, lat: 30, lon: -4.49, dist: 3.4 }, { f: LEN(k) + 10, lat: 32, lon: -4.49, dist: 3.4 }], f);
  const G0 = discOf(cam);
  const lat = f < tEq ? BREST[0] : f < tNP ? mix(BREST[0], 0, prog(f, tEq, tEq + 24)) : f < tSP ? mix(0, 89.5, prog(f, tNP, tNP + 24)) : f < tBr ? mix(89.5, -89.5, prog(f, tSP, tSP + 30))
    : mix(-89.5, BREST[0], prog(f, tBr - 10, tBr + 20));
  const pW = ll(lat, BREST[1]);
  const eqRing = Array.from({ length: 73 }, (_, i) => ll(0, i * 5, 1.0));
  const tag = f < tEq ? "" : f < tNP ? "0°" : f < tSP ? "90° N" : f < tBr - 10 ? "−90°" : "";
  return (
    <Scene>
      <Globe cam={cam} grat={0.22} meshO={0.72}
        over={(G) => <>
          <path d={poly(eqRing.map((v) => G.pw(v))) + "Z"} fill={C.local} fillOpacity={0.12} stroke={C.local} strokeWidth={3} opacity={fin(f, tAng)} />
          {seg(G, [0, 0, 0], pW, C.first, 8, fin(f, tLine))}
          {seg(G, [0, 0, 0], ll(0, BREST[1]), C.local, 4, fin(f, tAng), "10 8")}
          <path d={poly(Array.from({ length: 25 }, (_, i) => G.pw(ll((lat * i) / 24, BREST[1], 0.36))))} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tAng)} />
          {wlab(G, ll(lat / 2, BREST[1], 0.44), "φ", C.gold, fin(f, tPhi), 10, 0, "start", T.calc)}
          <circle cx={G.pw(pW)[0]} cy={G.pw(pW)[1]} r={12} fill={C.key} stroke={C.bg} strokeWidth={4} opacity={fin(f, tLine)} />
          {tag ? wlab(G, pW, tag, lat < -1 ? C.neg : C.key, 1, 24, -30, "start", T.key) : null}
          <LatCircle G={G} lat={BREST[0]} c={C.second} w={6} o={fin(f, tPar)} />
          <path d={poly(Array.from({ length: 25 }, (_, i) => G.pw(ll(90 - ((90 - BREST[0]) * i) / 24, BREST[1], 0.5))))} fill="none" stroke={C.local} strokeWidth={6} opacity={fin(f, tCol)} />
          {seg(G, [0, 0, 0], [0, 1, 0], C.local, 4, fin(f, tCol), "10 8")}
          {f >= tBr ? <><circle cx={G.p(BREST[0], BREST[1])[0]} cy={G.p(BREST[0], BREST[1])[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={4} />
            <Lbl x={G.p(BREST[0], BREST[1])[0] - 22} y={G.p(BREST[0], BREST[1])[1] - 34} t="Brest" c={C.key} s={T.floor} a="end" o={fin(f, tBr)} /></> : null}
        </>} />
      <GlobeFrame id="s16k" zoom={0} disc={G0} />
      <GSrc />
      <Svg>
        <Keyword f={f} text="latitude φ" at={[1100, 150]} appear={tPhi} />
        <Lbl x={1100} y={260} t="48.4° N" c={C.key} s={T.calc} o={fin(f, AT(k, 7, "forty eight point four"))} />
        <Keyword f={f} text="parallel" at={[1100, 380]} appear={AT(k, 8, "parallel")} c={C.second} />
        <Keyword f={f} text="colatitude" at={[1100, 500]} appear={AT(k, 10, "colatitude")} c={C.local} />
        <Lbl x={1100} y={720} t="sin ↔ cos" c={C.key} s={T.key} o={fin(f, tSw)} />
      </Svg>
      <TeX s={String.raw`90^{\circ}-\varphi`} x={1100} y={600} size={68} c={C.local} o={fin(f, AT(k, 10, "ninety degrees minus"))} />
    </Scene>
  );
};

// ================================================================ s17 longitude (from above the North Pole)
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_longitude");
  const tMer = SS(k, 1), tGr = AT(k, 2, "Greenwich"), tAng = SS(k, 3), tLam = AT(k, 4, "lambda"), tEW = SS(k, 5), tB = SS(k, 6), t360 = SS(k, 7), tGrat = AT(k, 8, "graticule");
  const cam = globePath([{ f: 0, lat: 32, lon: -4.49, dist: 3.4 }, { f: tMer + 10, lat: 82, lon: -4.49, dist: 3.4 }, { f: LEN(k) + 10, lat: 84, lon: -4.49, dist: 3.4 }], f);
  const G0 = discOf(cam);
  const md = prog(f, tMer, tMer + 50);
  const merid = Array.from({ length: 12 }, (_, i) => -180 + i * 30);
  const lam = BREST[1] * prog(f, tAng + 20, tAng + 60);
  const rul = { x: 1110, y: 640, w: 680 };
  const rx = (v: number) => rul.x + (v / 360) * rul.w;
  return (
    <Scene>
      <Globe cam={cam} grat={0} coast={0.5}
        over={(G) => <>
          {merid.map((lo) => <path key={lo} d={llPath(G, mer(lo, -89, mix(-89, 89, md)))} fill="none" stroke={C.local} strokeWidth={3} opacity={0.7} />)}
          <path d={llPath(G, mer(0))} fill="none" stroke={C.gold} strokeWidth={7} opacity={fin(f, tGr)} />
          <path d={llPath(G, mer(BREST[1]))} fill="none" stroke={C.second} strokeWidth={5} opacity={fin(f, tAng)} />
          <path d={poly(Array.from({ length: 21 }, (_, i) => G.pw(ll(0, (lam * i) / 20, 0.62))))} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tAng + 20)} />
          {seg(G, [0, 0, 0], ll(0, 0, 0.7), C.gold, 3, fin(f, tAng + 20), "8 6")}
          {seg(G, [0, 0, 0], ll(0, BREST[1], 0.7), C.second, 3, fin(f, tAng + 20), "8 6")}
          {wlab(G, ll(0, -2, 0.75), "λ", C.gold, fin(f, tLam), 0, 30, "middle", T.calc)}
          {dot(G, 51.48, 0.0, C.gold, 10, fin(f, tGr))}
          {wlab(G, ll(51.48, 0.0), "Greenwich", C.key, fin(f, tGr), 18, -30)}
          {dot(G, BREST[0], BREST[1], C.key, 10, fin(f, tB))}
          <SurfArrow G={G} pts={Array.from({ length: 20 }, (_, i) => [8, 40 + i * 2] as [number, number])} c={C.first} w={7} head={26} o={fin(f, tEW)} />
          <SurfArrow G={G} pts={Array.from({ length: 20 }, (_, i) => [8, -40 - i * 2] as [number, number])} c={C.neg} w={7} head={26} o={fin(f, tEW)} />
          {wlab(G, ll(8, 75), "+ east", C.first, fin(f, tEW), 0, 0, "middle")}
          {wlab(G, ll(8, -75), "− west", C.neg, fin(f, tEW), 0, 0, "middle")}
          <path d={llPath(G, Array.from({ length: 181 }, (_, i) => [0, -180 + i * 2] as [number, number]))} fill="none" stroke={C.local} strokeWidth={3} opacity={0.6 * fin(f, tEW)} />
        </>} />
      <Globe cam={cam} grat={fin(f, tGrat) * 0.8} gratStep={15} coast={0} o={fin(f, tGrat)} meshO={0} />
      <GlobeFrame id="s17k" zoom={0} disc={G0} />
      <GSrc />
      <Svg>
        <Keyword f={f} text="meridians" at={[1100, 140]} appear={AT(k, 1, "meridians")} />
        <Keyword f={f} text="prime meridian" at={[1100, 240]} appear={AT(k, 2, "prime meridian")} c={C.gold} />
        <Keyword f={f} text="longitude λ" at={[1100, 340]} appear={tLam} />
        <g opacity={fin(f, t360)}>
          <line x1={rul.x} y1={rul.y} x2={rul.x + rul.w} y2={rul.y} stroke={C.muted} strokeWidth={4} />
          {[0, 90, 180, 270, 360].map((v) => <g key={v}><line x1={rx(v)} y1={rul.y - 14} x2={rx(v)} y2={rul.y + 14} stroke={C.muted} strokeWidth={3} />
            <Lbl x={rx(v)} y={rul.y + 46} t={`${v}`} c={C.muted} s={T.floor} a="middle" b={false} /></g>)}
          <circle cx={rx(SPH.lam360)} cy={rul.y} r={12} fill={C.second} stroke={C.bg} strokeWidth={3} />
        </g>
        <Lbl x={1640} y={rul.y - 60} t="355.5°" c={C.second} s={T.key} a="middle" o={fin(f, AT(k, 7, "three hundred and fifty five"))} />
        <Keyword f={f} text="graticule" at={[1100, 800]} appear={tGrat} />
      </Svg>
      <TeX s={String.raw`\lambda=-4.5^{\circ}`} x={1100} y={460} size={72} c={C.second} o={fin(f, AT(k, 6, "minus four point five"))} />
    </Scene>
  );
};

// ================================================================ s18 the position vector, by two right triangles (schematic cross-sections)
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_position");
  const tVec = SS(k, 1), tSide = SS(k, 3), tPhi = SS(k, 4), tZ = SS(k, 5), tR = SS(k, 6), tTop = SS(k, 7), tLam = SS(k, 8), tSplit = SS(k, 9), tAll = SS(k, 10),
    tN1 = SS(k, 11), tN2 = SS(k, 12);
  const phi = BREST[0] * D2R, A: Pt = [300, 470], RS = 210, lamS = 35 * D2R, B: Pt = [770, 470];
  const pB: Pt = [A[0] + RS * Math.cos(phi), A[1] - RS * Math.sin(phi)];
  const foot: Pt = [pB[0], A[1]];
  const rT = RS * Math.cos(phi);
  const q: Pt = [B[0] + rT * Math.cos(lamS), B[1] - rT * Math.sin(lamS)];
  const lines = cutAt(EQ_S18, String.raw`,\qquad `);
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, tSide)}>
          <circle cx={A[0]} cy={A[1]} r={RS} fill="#22304a" stroke={C.local} strokeWidth={3} />
          <line x1={A[0] - RS - 30} y1={A[1]} x2={A[0] + RS + 30} y2={A[1]} stroke={C.local} strokeWidth={3} strokeDasharray="10 8" />
          <line x1={A[0]} y1={A[1] + RS + 30} x2={A[0]} y2={A[1] - RS - 40} stroke={C.local} strokeWidth={3} />
          <Lbl x={A[0]} y={A[1] - RS - 70} t="axis" c={C.muted} s={T.floor} a="middle" b={false} />
          <Lbl x={A[0] - RS - 40} y={A[1] - 30} t="equator plane" c={C.muted} s={T.floor} b={false} />
          <line x1={A[0]} y1={A[1]} x2={pB[0]} y2={pB[1]} stroke={C.first} strokeWidth={10} strokeLinecap="round" />
          <path d={arcD(A, 70, 0, BREST[0])} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tPhi)} />
          <Lbl x={A[0] + 88} y={A[1] - 34} t="φ" c={C.gold} s={T.key} o={fin(f, tPhi)} />
          <line x1={pB[0]} y1={pB[1]} x2={foot[0]} y2={foot[1]} stroke={C.second} strokeWidth={8} opacity={fin(f, tZ)} />
          <line x1={A[0]} y1={A[1] + 6} x2={foot[0]} y2={foot[1] + 6} stroke={C.second} strokeWidth={8} opacity={fin(f, tR)} />
          <RightTick at={foot} u1={[-1, 0]} u2={[0, -1]} c={C.ink} o={fin(f, tZ)} />
          <circle cx={pB[0]} cy={pB[1]} r={11} fill={C.gold} stroke={C.bg} strokeWidth={4} />
        </g>
        <g opacity={fin(f, tTop)}>
          <circle cx={B[0]} cy={B[1]} r={RS} fill="#22304a" stroke={C.local} strokeWidth={3} />
          <circle cx={B[0]} cy={B[1]} r={rT} fill="none" stroke={C.second} strokeWidth={3} strokeDasharray="8 8" />
          <line x1={B[0] - RS - 20} y1={B[1]} x2={B[0] + RS + 20} y2={B[1]} stroke={C.local} strokeWidth={3} />
          <Lbl x={B[0] + RS + 10} y={B[1] + 40} t="x" c={C.muted} s={T.floor} a="end" b={false} />
          <line x1={B[0]} y1={B[1] + RS + 20} x2={B[0]} y2={B[1] - RS - 20} stroke={C.local} strokeWidth={3} />
          <Lbl x={B[0] + 18} y={B[1] - RS - 10} t="y" c={C.muted} s={T.floor} b={false} />
          <line x1={B[0]} y1={B[1]} x2={q[0]} y2={q[1]} stroke={C.second} strokeWidth={9} strokeLinecap="round" opacity={fin(f, tLam)} />
          <path d={arcD(B, 60, 0, 35)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tLam)} />
          <Lbl x={B[0] + 74} y={B[1] - 22} t="λ" c={C.gold} s={T.key} o={fin(f, tLam)} />
          <line x1={B[0]} y1={B[1] + 5} x2={q[0]} y2={B[1] + 5} stroke={C.second} strokeWidth={6} opacity={fin(f, tSplit)} strokeDasharray="12 8" />
          <line x1={q[0]} y1={B[1]} x2={q[0]} y2={q[1]} stroke={C.second} strokeWidth={6} opacity={fin(f, tSplit)} strokeDasharray="12 8" />
          <circle cx={B[0]} cy={B[1]} r={8} fill={C.local} />
        </g>
        <Lbl x={500} y={140} t="side view" c={C.muted} s={T.floor} a="middle" b={false} o={0} />
        <CurvedLink f={f} from={[1240, 610]} to={[foot[0] + 18, (pB[1] + foot[1]) / 2]} start={tN1 + 10} bend={70} end={tN2 - 6} />
        <CurvedLink f={f} from={[1240, 720]} to={[(A[0] + foot[0]) / 2, A[1] + 14]} start={tN2 + 10} bend={-60} />
        <Keyword f={f} text="polar coordinates again" at={[1080, 120]} s={T.floor} appear={AT(k, 9, "polar coordinates")} out={tAll - 18} />
      </Svg>
      <TeX s={String.raw`a\sin\varphi`} x={foot[0] + 18} y={(pB[1] + foot[1]) / 2} size={52} c={C.second} o={fin(f, tZ)} />
      <TeX s={String.raw`a\cos\varphi`} x={(A[0] + foot[0]) / 2} y={A[1] + 50} size={52} ax={0.5} c={C.second} o={fin(f, tR)} />
      <TeX s={String.raw`a\cos\varphi\cos\lambda`} x={B[0]} y={B[1] + RS + 60} size={48} ax={0.5} c={C.second} o={fin(f, tSplit)} />
      <TeX s={String.raw`a\cos\varphi\sin\lambda`} x={q[0] + 16} y={(B[1] + q[1]) / 2 - 70} size={48} c={C.second} o={fin(f, tSplit + 10)} />
      {lines.map((ln, i) => <TeX key={i} s={ln} x={1100} y={180 + i * 100} size={64} o={fin(f, tAll + i * 25)} />)}
      <CalcStack f={f} x={1500} y={570} size={56} rows={[
        { lhs: String.raw`6371\times0.748`, rhs: String.raw`\approx4760\ \mathrm{km}`, at: tN1 },
        { lhs: String.raw`6371\times0.664`, rhs: String.raw`\approx4230\ \mathrm{km}`, at: tN2 },
      ]} />
    </Scene>
  );
};

// ================================================================ s19 the Earth as a cylinder: ground speed Ω a cos φ
const S19: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19_earth_cylinder");
  const tSpin = SS(k, 1), tOm = SS(k, 2), tU = SS(k, 3), tEq = SS(k, 4), tB = AT(k, 5, "Brest"), tL = AT(k, 6, "Longyearbyen"), tP = SS(k, 7), tWhy = SS(k, 8);
  // the Earth turns eastward under a fixed camera: the camera's longitude decreases (one turn in 20 s while spinning), pausing on the named places
  const cam = spinPath([{ f: 0, lat: 26, lon: 20, dist: 3.4 }, { f: tSpin, lat: 26, lon: 10, dist: 3.4 },
    { f: tB - 2, lat: 30, lon: BREST[1] - 360, dist: 3.4, spin: 0.1 }, { f: tL - 12, lat: 30, lon: BREST[1] - 362, dist: 3.4 },
    { f: tL + 18, lat: 36, lon: LYB[1] - 360, dist: 3.4 }, { f: tP + 30, lat: 38, lon: LYB[1] - 366, dist: 3.4 },
    { f: LEN(k) + 10, lat: 30, lon: LYB[1] - 366 - 18 * ((LEN(k) + 10 - tP - 30) / 30), dist: 3.4, spin: 0.15 }], f);
  const G0 = discOf(cam);
  const lats = [0, BREST[0], LYB[0]];
  const tags = [{ t: "465 m/s", at: AT(k, 4, "four hundred and sixty five") }, { t: "309 m/s", at: AT(k, 5, "three hundred and nine") }, { t: "95 m/s", at: AT(k, 6, "ninety five") }];
  return (
    <Scene>
      <Globe cam={cam} grat={0.18}
        over={(G) => <>
          {seg(G, [0, -1.32, 0], [0, 1.32, 0], C.local, 5, fin(f, tSpin), "14 10")}
          {lats.map((la, i) => <LatCircle key={la} G={G} lat={la} c={C.second} w={5} o={fin(f, tU + i * 10)} />)}
          <LatCircle G={G} lat={-BREST[0]} c={C.local} w={2} o={0.5 * fin(f, tSpin)} dash="8 8" />
          {lats.map((la, i) => {
            const L = (SPH.spd[i] / SPH.spd[0]) * 22, lo0 = cam.lon - 8;
            return <g key={`a${la}`}><SurfArrow G={G} pts={gcArrowPts(la, lo0, 90, L)} c={C.first} w={9} head={32} o={fin(f, tags[i].at)} />
              {wlab(G, ll(la, lo0 + L / Math.cos(la * D2R) + 2), tags[i].t, C.first, fin(f, tags[i].at), 14, -26)}</g>;
          })}
          {dot(G, 89.5, 0, C.key, 10, fin(f, tP))}
          {wlab(G, ll(89.5, 0), "0", C.key, fin(f, tP), 18, -26, "start", T.key)}
          {f >= tB - 20 ? <>{dot(G, BREST[0], BREST[1], C.gold, 10, fin(f, tB - 20))}{wlab(G, ll(BREST[0], BREST[1]), "Brest", C.key, fin(f, tB - 6), -24, 40, "end")}</> : null}
          {f >= tL - 20 ? <>{dot(G, LYB[0], LYB[1], C.gold, 10, fin(f, tL - 20))}{wlab(G, ll(LYB[0], LYB[1]), "Longyearbyen (Svalbard)", C.key, fin(f, tL - 6), -24, -34, "end")}</> : null}
        </>} />
      <GlobeFrame id="s19k" zoom={0} disc={G0} />
      <GSrc />
      <Svg><Keyword f={f} text="cylindrical coordinate" at={[1100, 130]} s={T.floor} appear={AT(k, 0, "cylindrical coordinate")} />
        <Keyword f={f} text="spin and winds: by latitude" at={[1100, 810]} s={T.floor} appear={tWhy} /></Svg>
      <TeX s={String.raw`\Omega=7.29\times10^{-5}\ \mathrm{rad/s}`} x={1100} y={250} size={60} o={fin(f, tOm)} />
      <TeX s={EQ_S19} x={1100} y={380} size={84} o={fin(f, tU)} />
      <CalcStack f={f} x={1180} y={500} size={50} rows={[{ lhs: "", rhs: String.raw`7.29\times10^{-5}\times6.371\times10^{6}\approx465\ \mathrm{m/s}`, at: AT(k, 4, "seven point two nine") }]} />
      <TeX s={String.raw`\cos\varphi\approx\tfrac{2}{3}\ \text{at Brest}`} x={1100} y={640} size={52} c={C.local} o={fin(f, AT(k, 5, "two thirds"))} />
    </Scene>
  );
};

// ================================================================ s20 one degree north = 111 km everywhere
const S20: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20_distance_north");
  const tMer = SS(k, 1), tRule = SS(k, 2), tOne = SS(k, 4), t111 = SS(k, 5), tSame = SS(k, 6), tMin = SS(k, 7);
  const cam = globePath([{ f: 0, lat: 30, lon: LYB[1] - 70, dist: 3.4 }, { f: tMer, lat: 25, lon: BREST[1] - 35, dist: 3.4 }, { f: LEN(k) + 10, lat: 28, lon: BREST[1] - 38, dist: 3.4 }], f);
  const G0 = discOf(cam);
  const base = f < tSame ? BREST[0] : mix(10, 75, prog(f, tSame + 10, SE(k, 6) - 10));
  const w5 = f < tMin ? 5 : mix(5, 1.2, prog(f, tMin, tMin + 20));
  const band = Array.from({ length: 11 }, (_, i) => [base + (w5 * i) / 10, BREST[1]] as [number, number]);
  const [l1, l2] = cutAt(EQ_S20, String.raw`,\qquad `);
  return (
    <Scene>
      <Globe cam={cam} grat={0.2}
        over={(G) => <>
          <path d={llPath(G, mer(BREST[1]))} fill="none" stroke={C.second} strokeWidth={5} opacity={fin(f, tMer)} />
          {seg(G, [0, 0, 0], ll(base, BREST[1]), C.first, 5, fin(f, tRule))}
          {seg(G, [0, 0, 0], ll(base + w5, BREST[1]), C.first, 5, fin(f, tRule))}
          <path d={llPath(G, band, 1.004)} fill="none" stroke={C.gold} strokeWidth={14} strokeLinecap="round" opacity={fin(f, tRule)} />
          {wlab(G, ll(base + w5 / 2, BREST[1] + 3), "111 km", C.gold, fin(f, t111) * fout(f, tMin - 10), 20, 0, "start", T.key)}
          {wlab(G, ll(base + w5 / 2, BREST[1] + 3), "1.85 km", C.gold, fin(f, tMin + 20), 20, 0, "start", T.key)}
        </>} />
      <GlobeFrame id="s20k" zoom={0} disc={G0} />
      <GSrc />
      <Svg><Keyword f={f} text="same at every latitude" at={[1100, 640]} s={T.floor} appear={tSame} c={C.gold} />
        <Lbl x={1100} y={790} t="1′ ≈ 1.85 km = 1 nautical mile" c={C.key} s={T.floor} o={fin(f, tMin + 20)} /></Svg>
      <TeX s={l1} x={1100} y={150} size={80} o={fin(f, tRule)} />
      <TeX s={l2} x={1100} y={260} size={60} c={C.muted} o={fin(f, tRule + 30) * 0.6} />
      <CalcStack f={f} x={1320} y={350} size={56} rows={[
        { lhs: String.raw`1^{\circ}`, rhs: String.raw`=\pi/180=0.01745\ \mathrm{rad}`, at: tOne },
        { lhs: String.raw`6371\times0.01745`, rhs: String.raw`\approx111.2\ \mathrm{km}`, at: t111 },
      ]} />
    </Scene>
  );
};

// ================================================================ s21 one degree east = a cos φ × 111 km
const S21: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21_distance_east");
  const tPar = SS(k, 1), tRad = SS(k, 2), tDx = SS(k, 3), tCos = SS(k, 4), tE = SS(k, 6), tB = SS(k, 7), tL = SS(k, 8), tP = SS(k, 9), tOr = SS(k, 10);
  const cam = globePath([{ f: 0, lat: 28, lon: BREST[1] - 38, dist: 3.4 }, { f: tPar, lat: 32, lon: BREST[1] - 20, dist: 3.4 }, { f: tE, lat: 18, lon: BREST[1] - 20, dist: 3.4 },
    { f: tB, lat: 34, lon: BREST[1] - 20, dist: 3.4 }, { f: tL, lat: 52, lon: BREST[1] - 20, dist: 3.4 }, { f: tP + 20, lat: 62, lon: BREST[1] - 20, dist: 3.4 },
    { f: tOr + 10, lat: 30, lon: BREST[1] - 20, dist: 3.4 }, { f: LEN(k) + 10, lat: 30, lon: BREST[1] - 26, dist: 3.4 }], f);
  const G0 = discOf(cam);
  const steps = [{ la: 0, at: tE }, { la: BREST[0], at: tB }, { la: LYB[0], at: tL }, { la: 89.0, at: tP }];
  const [, e2] = cutAt(EQ_S21, String.raw`,\qquad `);
  const parts: Part[] = [{ t: String.raw`\delta x=` }, { t: String.raw`a\cos\varphi`, u: { w: String.raw`\text{radius of the parallel}`, c: C.gold } }, { t: String.raw`\,\delta\lambda` }];
  if ((parts.map((p) => p.t).join("")).replace(/\s/g, "") !== e2.replace(/\s/g, "")) throw new Error("s21 parts drift from EQ_S21");
  const lab = ["111 km", "74 km", "23 km", "0"], cosv = ["1", "0.66", "0.2", "0"];
  return (
    <Scene>
      <Globe cam={cam} grat={0.2}
        over={(G) => <>
          <LatCircle G={G} lat={BREST[0]} c={C.second} w={6} o={fin(f, tPar)} />
          {seg(G, [0, Math.sin(BREST[0] * D2R), 0], ll(BREST[0], BREST[1]), C.first, 7, fin(f, tRad))}
          {seg(G, [0, 0, 0], ll(BREST[0], BREST[1]), C.local, 4, fin(f, tRad), "10 8")}
          {seg(G, [0, -1.3, 0], [0, 1.3, 0], C.local, 4, fin(f, tPar), "14 10")}
          {steps.map((s, i) => <g key={i} opacity={fin(f, s.at)}>
            <path d={llPath(G, Array.from({ length: 11 }, (_, j) => [s.la, BREST[1] + 0.5 * j] as [number, number]), 1.004)} fill="none" stroke={C.gold} strokeWidth={14} strokeLinecap="round" />
            {wlab(G, ll(s.la, BREST[1] + 5.5), lab[i], C.gold, 1, 18, -10, "start", T.key)}</g>)}
          {Array.from({ length: 12 }, (_, i) => <path key={i} d={llPath(G, mer(-180 + i * 30))} fill="none" stroke={C.second} strokeWidth={4} opacity={0.8 * fin(f, tOr)} />)}
        </>} />
      <GlobeFrame id="s21k" zoom={0} disc={G0} />
      <GSrc />
      <Svg>
        <Lbl x={1100} y={560} t="cos φ:" c={C.muted} s={T.floor} o={fin(f, tE)} />
        {cosv.map((c, i) => <Lbl key={i} x={1260 + i * 140} y={560} t={c} c={C.key} s={T.key} o={fin(f, steps[i].at)} />)}
        <Keyword f={f} text="like segments of an orange" at={[1100, 800]} s={T.floor} appear={tOr} />
      </Svg>
      <Layered parts={parts} x={1100} y={200} size={80} layers={[{ t: "all", o: fin(f, tDx) }, { t: [], u: [1], o: fin(f, tCos) }]} />
      <CalcStack f={f} x={1330} y={620} size={52} rows={[
        { lhs: String.raw`111\times0.66`, rhs: String.raw`\approx74`, at: tB + 10 },
        { lhs: String.raw`111\times0.2`, rhs: String.raw`\approx23`, at: tL + 10 },
      ]} />
    </Scene>
  );
};

// ================================================================ s22 ERA5 boxes thin towards the poles (two local panels, true local shape)
const panelBox = (latC: number, lonC: number, dlat: number, x: number): MapBox => {
  const w = 540, h = 540, c = Math.cos(latC * D2R), dlon = (dlat * (w / h)) / c;
  return { lat0: latC - dlat / 2, lat1: latC + dlat / 2, lon0: lonC - dlon / 2, lon1: lonC + dlon / 2, x, y: 60, w, h };
};
const S22: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22_grid_cells");
  const tGrid = SS(k, 1), tB = SS(k, 2), tS = SS(k, 3), tThin = SS(k, 4), tFor = SS(k, 5), tOther = SS(k, 6);
  const BB = panelBox(48.375, -4.375, 1.25, 80), BS = panelBox(78.125, 15.625, 1.0, 680);
  const grid = (B: MapBox) => {
    const ls: React.ReactNode[] = [];
    for (let la = Math.ceil(B.lat0 * 4) / 4; la <= B.lat1; la += 0.25) ls.push(<line key={`a${la}`} x1={B.x} y1={mapP_(B)(la, B.lon0)[1]} x2={B.x + B.w} y2={mapP_(B)(la, B.lon0)[1]} stroke={C.gold} strokeWidth={2} opacity={0.65} />);
    for (let lo = Math.ceil(B.lon0 * 4) / 4; lo <= B.lon1; lo += 0.25) ls.push(<line key={`o${lo}`} x1={mapP_(B)(B.lat0, lo)[0]} y1={B.y} x2={mapP_(B)(B.lat0, lo)[0]} y2={B.y + B.h} stroke={C.gold} strokeWidth={2} opacity={0.65} />);
    return ls;
  };
  const cell = (B: MapBox, la: number, lo: number) => { const P = mapP_(B); const a = P(la + 0.25, lo), b = P(la, lo + 0.25); return { a, b }; };
  const cb = cell(BB, 48.25, -4.5), cs = cell(BS, 78.0, 15.5);
  const ghostW = (cs.b[0] - cs.a[0]) / Math.cos(LYB[0] * D2R);
  const land = (P: (la: number, lo: number) => Pt, parts: number[][]) => parts.map((p, i) => <path key={i} d={linesPath(P, [p]) + "Z"} fill="#3c4a3a" stroke={C.key} strokeOpacity={0.7} strokeWidth={1.5} />);
  return (
    <Scene>
      <GeoMap id="s22b" B={BB} o={fin(f, 0)}>{(P) => <>{land(P, D.panels.brittany)}<g opacity={fin(f, tGrid)}>{grid(BB)}</g>
        <rect x={cb.a[0]} y={cb.a[1]} width={cb.b[0] - cb.a[0]} height={cb.b[1] - cb.a[1]} fill={C.gold} fillOpacity={0.3} stroke={C.gold} strokeWidth={5} opacity={fin(f, tB)} />
        <circle cx={P(BREST[0], BREST[1])[0]} cy={P(BREST[0], BREST[1])[1]} r={9} fill={C.key} stroke={C.bg} strokeWidth={3} /></>}</GeoMap>
      <GeoMap id="s22s" B={BS} o={fin(f, tS - 30)}>{(P) => <>{land(P, D.panels.svalbard)}<g opacity={fin(f, tS - 20)}>{grid(BS)}</g>
        <rect x={cs.a[0]} y={cs.a[1]} width={cs.b[0] - cs.a[0]} height={cs.b[1] - cs.a[1]} fill={C.gold} fillOpacity={0.3} stroke={C.gold} strokeWidth={5} opacity={fin(f, tS)} />
        <rect x={cs.a[0]} y={cs.a[1]} width={ghostW} height={cs.b[1] - cs.a[1]} fill="none" stroke={C.neg} strokeWidth={5} strokeDasharray="14 10" opacity={fin(f, tFor)} />
        <circle cx={P(LYB[0], LYB[1])[0]} cy={P(LYB[0], LYB[1])[1]} r={9} fill={C.key} stroke={C.bg} strokeWidth={3} /></>}</GeoMap>
      <Svg>
        <Lbl x={BB.x + 20} y={BB.y + BB.h + 40} t="Brest" c={C.key} s={T.floor} />
        <Lbl x={BS.x + 20} y={BS.y + BS.h + 40} t="Longyearbyen, Svalbard" c={C.key} s={T.floor} o={fin(f, tS - 30)} />
        <Lbl x={cb.b[0] + 14} y={(cb.a[1] + cb.b[1]) / 2} t="27.8 km" c={C.key} s={T.floor} o={fin(f, tB)} />
        <Lbl x={(cb.a[0] + cb.b[0]) / 2} y={cb.b[1] + 34} t="18.5 km" c={C.key} s={T.floor} a="middle" o={fin(f, AT(k, 2, "eighteen and a half"))} />
        <Lbl x={cs.b[0] + 14} y={(cs.a[1] + cs.b[1]) / 2 - 30} t="27.8 km" c={C.key} s={T.floor} o={fin(f, tS)} />
        <Lbl x={cs.a[0]} y={cs.b[1] + 34} t="5.7 km" c={C.key} s={T.floor} a="middle" o={fin(f, AT(k, 3, "under six"))} />
        <Keyword f={f} text="thinner towards the poles" at={[1300, 160]} s={T.floor} appear={tThin} />
        <Lbl x={1300} y={260} t="forgot the cos φ:" c={C.neg} s={T.floor} o={fin(f, tFor)} />
        <Lbl x={1300} y={320} t="× 4.9 too wide" c={C.neg} s={T.floor} o={fin(f, tFor + 10)} />
        <Keyword f={f} text="other kinds of grid" at={[1300, 420]} s={T.floor} appear={AT(k, 6, "other kinds of grid")} />
      </Svg>
      <Globe cam={{ lat: 60, lon: 0, dist: 3.5 }} box={{ x: 1300, y: 470, w: 520, h: 300 }} grat={0.7} gratStep={10} coast={0.4} o={fin(f, tOther)} />
      <SourceBelow text="Land: Natural Earth · ERA5 0.25° grid" pic={{ x: 80, y: 60, w: 1140, h: 600 }} w={1140} name="s22 src" />
      <SourceBelow text={GSRC} pic={{ x: 1300, y: 470, w: 520, h: 300 }} w={520} o={fin(f, tOther)} name="s22 src globe" />
    </Scene>
  );
};

// ================================================================ s23 areas: half the Earth between 30° S and 30° N
const S23: React.FC = () => {
  const f = useCurrentFrame(), k = K("s23_area");
  const tPatch = SS(k, 1), tdA = SS(k, 2), tAdd = SS(k, 4), tInt = SS(k, 5), tGrow = SS(k, 6), tHalf = SS(k, 7), tBoth = SS(k, 8), tW = SS(k, 10);
  const cam = globePath([{ f: 0, lat: 30, lon: BREST[1] - 26, dist: 3.4 }, { f: tAdd, lat: 18, lon: -10, dist: 3.4 }, { f: LEN(k) + 10, lat: 12, lon: -4, dist: 3.4 }], f);
  const G0 = discOf(cam);
  const A: Ax = { x: 1180, y: 470, w: 560, h: 300, xr: [0, 90], yr: [0, 1] };
  const fillTo = mix(0, 90, prog(f, tAdd + 10, tGrow + 40));
  const half = fin(f, tBoth);
  const [d1, d2] = cutAt(EQ_S23, String.raw`,\qquad `);
  const gl = (SPH.gauge as number[]), gx = gl.map((_, i) => i * 3);
  const upto = clamp(fillTo / 90, 0, 1);
  return (
    <Scene>
      <Globe cam={cam} grat={0.2}
        over={(G) => <>
          {Array.from({ length: 46 }, (_, i) => i * 2).filter((la) => la <= fillTo && f < tBoth).map((la) => <LatCircle key={la} G={G} lat={la} c={C.first} w={9} o={0.35} />)}
          {Array.from({ length: 31 }, (_, i) => -30 + i * 2).map((la) => <LatCircle key={`h${la}`} G={G} lat={la} c={C.first} w={9} o={0.38 * half} />)}
          <path d={llPath(G, [[45, -6], [45, 6], [50, 6], [50, -6], [45, -6]] as [number, number][], 1.004)} fill={C.gold} fillOpacity={0.35} stroke={C.gold} strokeWidth={5} opacity={fin(f, tPatch) * fout(f, tAdd)} />
          {wlab(G, ll(47.5, 6.5), "a cos φ δλ", C.gold, fin(f, tPatch + 20) * fout(f, tAdd), 0, -70, "middle")}
          {wlab(G, ll(47.5, -6.5), "a δφ", C.gold, fin(f, tPatch + 10) * fout(f, tAdd), -16, 0, "end")}
        </>} />
      <GlobeFrame id="s23k" zoom={0} disc={G0} />
      <GSrc />
      <Svg>
        <Axes A={A} xt={[0, 30, 60, 90]} yt={[0, 0.5, 1]} xl="latitude (°)" yl="share of the hemisphere" yf={(v) => (v === 0.5 ? "½" : nf(v, 0))} o={fin(f, tAdd)} />
        <Curve A={A} xs={gx} ys={gl} c={C.first} w={7} upto={upto} />
        <circle cx={axP(A)(30, 0.5)[0]} cy={axP(A)(30, 0.5)[1]} r={12} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tHalf)} />
        <Lbl x={axP(A)(30, 0.5)[0] + 20} y={axP(A)(30, 0.5)[1] - 36} t="½" c={C.gold} s={T.calc} o={fin(f, tHalf)} />
        <Keyword f={f} text="half of the Earth" at={[1100, 380]} s={T.floor} appear={AT(k, 8, "half of the whole Earth")} out={tW - 18} c={C.first} />
        <Keyword f={f} text="weight each latitude by cos φ" at={[1100, 380]} s={T.floor} appear={tW} />
      </Svg>
      <TeX s={d1} x={1100} y={140} size={72} o={fin(f, tdA)} />
      <TeX s={d2} x={1100} y={265} size={60} o={fin(f, tInt)} />
      <TeX s={String.raw`\sin30^{\circ}=0.5`} x={1500} y={380} size={56} o={win(f, tHalf, tBoth - 20)} />
    </Scene>
  );
};

// ================================================================ s24 the local east-north-up frame (zoom-reveal at Brest)
const S24: React.FC = () => {
  const f = useCurrentFrame(), k = K("s24_enu");
  const tBr = AT(k, 0, "Brest"), tSur = SS(k, 1), tArr = SS(k, 3), tFr = SS(k, 4), tW = SS(k, 5), tUVW = SS(k, 6), tX = SS(k, 7), tOwn = SS(k, 8), tOut = AT(k, 9, "zoom back out"),
    tTr = AT(k, 10, "Trappes"), t4 = AT(k, 10, "about four degrees"), tSg = AT(k, 11, "Singapore"), t101 = AT(k, 11, "a hundred and one");
  const Z = { dist: 2.4, pp: [600, 470] as Pt }, U = { dist: 4.3, pp: [520, 430] as Pt };
  const cam = globePath([
    { f: 0, lat: BREST[0], lon: BREST[1], ...Z }, { f: tOut, lat: BREST[0], lon: BREST[1], ...Z }, { f: tOut + 45, lat: 46, lon: 0, ...U },
    { f: tTr - 6, lat: 47, lon: 0, ...U }, { f: tSg - 20, lat: 30, lon: 45, ...U }, { f: tSg + 10, lat: 25, lon: 50, ...U }, { f: LEN(k) + 10, lat: 25, lon: 52, ...U }], f);
  const zf = clamp((4.3 - cam.dist) / (4.3 - 2.4), 0, 1);
  const right = fout(f, tOut, 30);
  const G0 = discOf(cam, GFULL);
  const st = (la: number, lo: number, L: number, o: number, labels: boolean, key: string) => {
    const e = enAt(la, lo), b = ll(la, lo);
    const tip = (v: V3, s: number): V3 => [b[0] + v[0] * s, b[1] + v[1] * s, b[2] + v[2] * s];
    return { b, e: tip(e.e, L), n: tip(e.n, L), u: tip(e.u, L * 1.2), o, labels, key };
  };
  const frames = [st(BREST[0], BREST[1], zf > 0.5 ? 0.09 : 0.16, fin(f, tArr), zf > 0.5, "b"), st(D.sphere.trappes[0], D.sphere.trappes[1], 0.16, fin(f, tTr), false, "t"),
    st(D.sphere.sing[0], D.sphere.sing[1], 0.16, fin(f, tSg), false, "s")];
  const e3 = cutAt(EQ_S24, "=");
  return (
    <Scene>
      <Globe cam={cam} box={GFULL} grat={0.18 * (1 - zf)} coast={0.55}
        over={(G) => <>
          {frames.map((F) => F.o <= 0 || !G.vis(...(F.key === "b" ? BREST : F.key === "t" ? (D.sphere.trappes as [number, number]) : (D.sphere.sing as [number, number]))) ? null : <g key={F.key} opacity={F.o}>
            {F.key === "b" ? <>{arrowW(G, F.b, F.e, C.second)}{arrowW(G, F.b, F.n, C.second)}</> : null}
            {arrowW(G, F.b, F.u, C.first)}
            <circle cx={G.pw(F.b)[0]} cy={G.pw(F.b)[1]} r={9} fill={C.gold} stroke={C.bg} strokeWidth={3} />
          </g>)}
          {frames[0].labels && frames[0].o > 0 ? <>{wlab(G, frames[0].e, "i", C.second, frames[0].o, 12, -26, "start", T.key)}{wlab(G, frames[0].n, "j", C.second, frames[0].o, 12, -20, "start", T.key)}
            {wlab(G, frames[0].u, "k", C.first, frames[0].o, 14, -20, "start", T.key)}</> : null}
          {wlab(G, ll(BREST[0], BREST[1]), "Brest", C.key, fin(f, tBr) * (zf > 0.5 ? 1 : fin(f, tTr)), -20, 44, "end")}
          {wlab(G, ll(48.2, -3.0), "Brittany", C.key, win(f, AT(k, 1, "Brittany"), tOut - 10) * zf, 0, 60, "middle")}
          {wlab(G, ll(47.0, -9.5), "Atlantic Ocean", C.key, win(f, AT(k, 1, "Atlantic Ocean"), tOut - 10) * zf, 0, 0, "middle")}
          {G.vis(D.sphere.trappes[0], D.sphere.trappes[1]) ? wlab(G, ll(D.sphere.trappes[0], D.sphere.trappes[1]), "Trappes", C.key, fin(f, tTr), 16, -34) : null}
          {G.vis(D.sphere.sing[0], D.sphere.sing[1]) ? wlab(G, ll(D.sphere.sing[0], D.sphere.sing[1]), "Singapore", C.key, fin(f, tSg), 16, 34) : null}
        </>} />
      <GlobeFrame id="s24k" zoom={zf} right={right} disc={G0} />
      <SourceBelow text="Image: NASA Blue Marble NG · ETOPO 2022 (NOAA)" pic={{ x: 80, y: 40, w: 960, h: 772 }} w={960} name="s24 src" />
      <Svg>
        <Keyword f={f} text="local east, north, up" at={[1200, 140]} appear={AT(k, 4, "east, north, up")} out={tOut - 18} />
        <Lbl x={1200} y={430} t="u east · v north · w up" c={C.key} s={T.floor} o={fin(f, tUVW) * fout(f, tOut - 18)} />
        <Lbl x={1200} y={640} t="right-handed" c={C.key} s={T.floor} o={fin(f, tX + 20) * fout(f, tOut - 18)} />
        <Keyword f={f} text="each station: its own frame" at={[1200, 740]} s={T.floor} appear={tOwn} out={tOut - 18} />
        <Callout f={f} lines="≈ 4°" at={[1200, 300]} appear={t4} target={null} s={T.calc} />
        <Lbl x={1200} y={370} t="Brest → Trappes, 480 km" c={C.muted} s={T.floor} o={fin(f, AT(k, 10, "four hundred and eighty"))} />
        <Callout f={f} lines="≈ 101°" at={[1200, 520]} appear={t101} target={null} s={T.calc} />
        <Lbl x={1200} y={590} t="Brest → Singapore" c={C.muted} s={T.floor} o={fin(f, t101)} />
      </Svg>
      <TeX s={`${e3[0]}=${e3.slice(1).join("=")}`} x={1200} y={300} size={72} o={fin(f, tW) * fout(f, tOut - 18)} />
      <TeX s={String.raw`\mathbf i\times\mathbf j=\mathbf k`} x={1200} y={550} size={68} o={fin(f, tX) * fout(f, tOut - 18)} />
    </Scene>
  );
};
const arrowW = (G: GProj, a: V3, b: V3, c: string) => <Arrow p={G.pw(a)} q={G.pw(b)} color={c} w={8} head={30} />;

// ================================================================ s25 how the local arrows turn (eastbound plane, from above the pole)
const S25: React.FC = () => {
  const f = useCurrentFrame(), k = K("s25_enu_turn");
  const tPl = SS(k, 2), tHr = SS(k, 3), tDeg = SS(k, 4), tSw = SS(k, 5), tN = SS(k, 6), tEq = SS(k, 7), tSR = SS(k, 8);
  const cam = globePath([{ f: 0, lat: 46, lon: 0, dist: 3.4 }, { f: tPl, lat: 80, lon: 2, dist: 3.4 }, { f: LEN(k) + 10, lat: 82, lon: 2, dist: 3.4 }], f);
  const G0 = discOf(cam);
  const fly = prog(f, tPl + 20, tDeg + 30);
  const lonP = BREST[1] + MET.swing * fly;
  const iA = (lo: number) => { const e = enAt(BREST[0], lo); const b = ll(BREST[0], lo); return { b, e: [b[0] + e.e[0] * 0.3, b[1] + e.e[1] * 0.3, b[2] + e.e[2] * 0.3] as V3 }; };
  const s0 = iA(BREST[1]), s1 = iA(lonP);
  const eqs = cutAt(EQ_S25, String.raw`,\quad `);
  return (
    <Scene>
      <Globe cam={cam} grat={0.15}
        over={(G) => <>
          <LatCircle G={G} lat={BREST[0]} c={C.local} w={3} o={0.6} dash="8 8" />
          <path d={llPath(G, Array.from({ length: 31 }, (_, i) => [BREST[0], BREST[1] + ((lonP - BREST[1]) * i) / 30] as [number, number]), 1.003)} fill="none" stroke={C.local} strokeWidth={7} opacity={fin(f, tPl)} />
          {arrowW(G, s0.b, s0.e, C.second)}
          {fly > 0.02 ? arrowW(G, s1.b, s1.e, C.second) : null}
          <PlaneIcon p={G.p(BREST[0], lonP, 1.01)} a={0} s={0.8} o={fin(f, tPl)} />
          {seg(G, [0, 0, 0], ll(BREST[0], BREST[1], 0.8), C.gold, 3, fin(f, tSw), "8 6")}
          {seg(G, [0, 0, 0], ll(BREST[0], lonP, 0.8), C.gold, 3, fin(f, tSw), "8 6")}
          <path d={poly(Array.from({ length: 21 }, (_, i) => G.pw(ll(0, BREST[1] + ((lonP - BREST[1]) * i) / 20, 0.5))))} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tSw)} />
          {wlab(G, ll(0, BREST[1] + 6, 0.55), "≈ 12°", C.gold, fin(f, tSw), 0, -40, "middle", T.key)}
        </>} />
      <GlobeFrame id="s25k" zoom={0} disc={G0} />
      <GSrc />
      <Svg><Keyword f={f} text="like θ̂ round a circle" at={[1100, 330]} s={T.floor} appear={AT(k, 5, "exactly like theta hat")} out={tN - 18} />
        <Lbl x={1100} y={330} t="111 km north → up tilts 1°" c={C.key} s={T.floor} o={fin(f, tN)} />
        <Keyword f={f} text="speed / radius = how fast they turn" at={[1100, 800]} s={T.floor} appear={tSR} /></Svg>
      <CalcStack f={f} x={1360} y={110} size={54} rows={[
        { lhs: String.raw`250\times3600`, rhs: String.raw`=900\ \mathrm{km}`, at: tHr },
        { lhs: String.raw`900/74`, rhs: String.raw`\approx12^{\circ}`, at: AT(k, 4, "about twelve degrees") },
      ]} />
      {eqs.map((e, i) => <TeX key={i} s={e} x={1100} y={450 + i * 110} size={48} o={fin(f, tEq + i * 15)} />)}
    </Scene>
  );
};

// ================================================================ s26 metric terms
const S26: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26_metric_terms");
  const tWhole = SS(k, 1), tExtra = SS(k, 2), tEast = SS(k, 3), tMet = AT(k, 4, "metric terms"), tOnly = SS(k, 5), tNum = SS(k, 7), t65 = SS(k, 8), tAdd = SS(k, 9);
  const cam = globePath([{ f: 0, lat: 82, lon: 2, dist: 3.4 }, { f: tWhole, lat: 50, lon: 6, dist: 3.4 }, { f: LEN(k) + 10, lat: 52, lon: 12, dist: 3.4 }], f);
  const G0 = discOf(cam);
  const PC = D.parcel, n = PC.lat.length;
  const run = clamp((f - tWhole) / Math.max(1, tNum - tWhole), 0, 1), j = Math.min(n - 1, Math.floor(run * (n - 1)));
  const parts: Part[] = [{ t: String.raw`\frac{D\mathbf v}{Dt}\cdot\mathbf i=` }, { t: String.raw`\frac{Du}{Dt}`, u: { w: String.raw`\text{change of the number }u`, c: C.gold } },
    { t: String.raw`-\frac{uv\tan\varphi}{a}+\frac{uw}{a}`, u: { w: String.raw`\text{turning arrows}`, c: C.gold } }];
  if (parts.map((p) => p.t).join("").replace(/\s/g, "") !== EQ_S26.replace(/\s/g, "")) throw new Error("s26 parts drift from EQ_S26");
  const lo10 = Math.log10, bx = (v: number) => 1120 + (lo10(v) + 6) * 170;
  return (
    <Scene>
      <Globe cam={cam} grat={0.18}
        over={(G) => <>
          <path d={llPath(G, (PC.lat as number[]).slice(0, j + 1).map((la, i) => [la, PC.lon[i]] as [number, number]), 1.003)} fill="none" stroke={C.first} strokeWidth={5} opacity={fin(f, tWhole)} />
          <SurfArrow G={G} pts={gcArrowPts(PC.lat[j], PC.lon[j], Math.atan2(PC.u[j], PC.v[j]) / D2R, 6)} c={C.first} w={8} head={28} o={fin(f, tWhole)} />
          {dot(G, PC.lat[j], PC.lon[j], C.key, 9, fin(f, tWhole))}
        </>} />
      <GlobeFrame id="s26k" zoom={0} disc={G0} />
      <GSrc />
      <Svg>
        <Lbl x={1100} y={560} t={`u = ${nf(PC.u[j], 1)}, v = ${nf(PC.v[j], 1)} m/s`} c={C.first} s={T.floor} o={win(f, tWhole + 10, tNum - 20)} />
        <Lbl x={1100} y={620} t="no force: the arrows turn" c={C.muted} s={T.floor} o={win(f, tExtra, tNum - 20)} />
        <g opacity={fin(f, t65)}>
          <rect x={1120} y={600} width={bx(MET.mx) - 1120} height={30} fill={C.second} />
          <rect x={1120} y={660} width={bx(MET.fv) - 1120} height={30} fill={C.local} />
          <Lbl x={bx(MET.mx) + 14} y={615} t="metric" c={C.second} s={T.floor} />
          <Lbl x={bx(MET.fv) + 14} y={675} t="Coriolis" c={C.local} s={T.floor} />
          <Lbl x={1120} y={740} t="≈ 65 × smaller (log scale)" c={C.key} s={T.floor} />
        </g>
        <Keyword f={f} text="small here, they add up globally" at={[1100, 820]} s={T.floor} appear={tAdd} />
      </Svg>
      <Layered parts={parts} x={1090} y={200} size={64} layers={[{ t: "all", o: fin(f, tEast) }, { t: [], u: [1], o: fin(f, tEast + 30) }, { t: [], u: [2], o: fin(f, tMet) }]} />
      <CalcStack f={f} x={1360} y={420} size={46} rows={[{ lhs: String.raw`\frac{10\times10\times\tan45^{\circ}}{6.37\times10^{6}}`, rhs: String.raw`\approx1.6\times10^{-5}\ \mathrm{m/s^2}`, at: tNum, h: 110 }]} />
      <Svg><Keyword f={f} text="metric terms" at={[1100, 330]} s={T.floor} appear={tMet} out={tNum - 18} c={C.gold} /></Svg>
    </Scene>
  );
};

// ================================================================ s27 curvilinear coordinates and scale factors
const S27: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27_curvilinear");
  const tF1 = SS(k, 2), tF2 = SS(k, 3), tF3 = SS(k, 4), tPol = SS(k, 5), tEar = SS(k, 6), tSl = SS(k, 8), tGr = SS(k, 9), tP = SS(k, 10);
  const pan = [{ x: 330 }, { x: 960 }, { x: 1590 }], y0 = 190;
  const AL = D.alps;
  const PB = { x: 80, y: 560, w: 900, h: 230 };
  const ax = (lo: number) => PB.x + ((lo - 5) / 11) * PB.w, az = (z: number) => PB.y + PB.h - (z / 6) * PB.h;
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, 0)}>
          {[40, 80, 120].map((r) => <circle key={r} cx={pan[0].x} cy={y0} r={r} fill="none" stroke={C.first} strokeWidth={3} opacity={0.8} />)}
          {[0, 45, 90, 135].map((a) => <line key={a} x1={pan[0].x - 130 * Math.cos(a * D2R)} y1={y0 + 130 * Math.sin(a * D2R)} x2={pan[0].x + 130 * Math.cos(a * D2R)} y2={y0 - 130 * Math.sin(a * D2R)} stroke={C.first} strokeWidth={2} opacity={0.6} />)}
          <ellipse cx={pan[1].x} cy={y0 + 100} rx={110} ry={30} fill="none" stroke={C.first} strokeWidth={3} />
          <ellipse cx={pan[1].x} cy={y0 - 100} rx={110} ry={30} fill="none" stroke={C.first} strokeWidth={3} />
          <line x1={pan[1].x - 110} y1={y0 - 100} x2={pan[1].x - 110} y2={y0 + 100} stroke={C.first} strokeWidth={3} />
          <line x1={pan[1].x + 110} y1={y0 - 100} x2={pan[1].x + 110} y2={y0 + 100} stroke={C.first} strokeWidth={3} />
          <circle cx={pan[2].x} cy={y0} r={130} fill="none" stroke={C.first} strokeWidth={3} />
          {[-60, -30, 0, 30, 60].map((la) => <ellipse key={la} cx={pan[2].x} cy={y0 - 130 * Math.sin(la * D2R)} rx={130 * Math.cos(la * D2R)} ry={18 * Math.cos(la * D2R)} fill="none" stroke={C.first} strokeWidth={2} opacity={0.7} />)}
          {[30, 70].map((w) => <ellipse key={w} cx={pan[2].x} cy={y0} rx={w} ry={130} fill="none" stroke={C.first} strokeWidth={2} opacity={0.7} />)}
        </g>
        <g opacity={fin(f, tF2)}>
          {pan.map((p, i) => <g key={i}><Arrow p={[p.x + 60, y0 - 40]} q={[p.x + 120, y0 - 70]} color={C.second} w={6} head={22} /><Arrow p={[p.x + 60, y0 - 40]} q={[p.x + 90, y0 + 20]} color={C.second} w={6} head={22} /></g>)}
        </g>
        <Keyword f={f} text="1 · lines that curve" at={[90, 400]} s={T.floor} appear={tF1} />
        <Keyword f={f} text="2 · unit vectors turn" at={[90, 460]} s={T.floor} appear={tF2} />
        <Keyword f={f} text="3 · scale factors" at={[90, 520]} s={T.floor} appear={tF3} c={C.gold} />
        <Lbl x={1100} y={400} t="polar:" c={C.muted} s={T.floor} o={fin(f, tPol)} />
        <Lbl x={1100} y={470} t="sphere:" c={C.muted} s={T.floor} o={fin(f, tEar)} />
        <g opacity={fin(f, tP)}>
          <path d={poly((AL.lon as number[]).map((lo, i) => [ax(lo), az(AL.z[i])] as Pt)) + `L${ax(16)} ${PB.y + PB.h}L${ax(5)} ${PB.y + PB.h}Z`} fill="#5b5040" stroke={C.key} strokeWidth={2} />
          {(AL.zp as number[]).map((z, i) => <g key={i}><line x1={PB.x} y1={az(z)} x2={PB.x + PB.w} y2={az(z)} stroke={C.local} strokeWidth={3} strokeDasharray="12 8" />
            <Lbl x={PB.x + PB.w + 12} y={az(z)} t={`${AL.lev[i]} hPa`} c={C.local} s={T.floor} b={false} /></g>)}
          <rect x={PB.x} y={PB.y} width={PB.w} height={PB.h} fill="none" stroke={C.grid} strokeWidth={2} />
        </g>
        <Keyword f={f} text="pressure as a vertical coordinate" at={[1100, 820]} s={T.floor} appear={AT(k, 10, "pressure instead of height")} />
        <Keyword f={f} text="gradient: the next movie" at={[1100, 720]} s={T.floor} appear={tGr} />
      </Svg>
      <TeX s={String.raw`1,\ \ r`} x={1290} y={400} size={60} o={fin(f, tPol)} />
      <TeX s={String.raw`a,\ \ a\cos\varphi`} x={1290} y={470} size={60} o={fin(f, tEar)} />
      <TeX s={EQ_S27} x={1100} y={600} size={50} o={fin(f, tSl)} />
      <SourceBelow text="Relief: ETOPO 2022 (NOAA) · 46.5° N · standard pressure levels" pic={PB} w={900} o={fin(f, tP)} name="s27 src" />
    </Scene>
  );
};

// ================================================================ s28 three good reasons (schematic mini pictures)
const S28: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28_why");
  const t1 = SS(k, 2), t1b = SS(k, 3), t2 = SS(k, 4), t2b = SS(k, 5), t3 = SS(k, 6), t3b = SS(k, 7), tRow = SS(k, 8);
  const row = prog(f, tRow, tRow + 30);
  const pos = (i: number): { x: number; y: number; s: number } => ({ x: mix(500 + 0 * i, 330 + i * 630, row), y: mix(400, 360, row), s: mix(1, 0.62, row) });
  const op = (i: number) => (row > 0 ? 1 : i === 0 ? win(f, t1, t2 - 18) : i === 1 ? win(f, t2, t3 - 18) : fin(f, t3));
  const pic = (i: number) => {
    const { x, y, s } = pos(i);
    return <g key={i} opacity={op(i)} transform={`translate(${x} ${y}) scale(${s})`}>
      {i === 0 ? <><circle cx={-160} cy={0} r={130} fill="none" stroke={C.first} strokeWidth={6} /><circle cx={-160} cy={0} r={9} fill={C.gold} />
        <circle cx={210} cy={0} r={160} fill="#22304a" stroke={C.first} strokeWidth={6} /></> : null}
      {i === 1 ? <>{[40, 80, 120].map((r) => <circle key={r} cx={-220} cy={0} r={r} fill="none" stroke={C.first} strokeWidth={3} />)}
        <Arrow p={[0, 60]} q={[100, 60]} color={C.second} w={7} head={24} /><Arrow p={[0, 60]} q={[0, -40]} color={C.second} w={7} head={24} /><Arrow p={[0, 60]} q={[-60, 110]} color={C.first} w={7} head={24} />
        {Array.from({ length: 6 }, (_, q) => <line key={q} x1={170 + q * 30} y1={-90} x2={170 + q * 30} y2={90} stroke={C.gold} strokeWidth={2} />)}
        {Array.from({ length: 7 }, (_, q) => <line key={`h${q}`} x1={170} y1={-90 + q * 30} x2={320} y2={-90 + q * 30} stroke={C.gold} strokeWidth={2} />)}</> : null}
      {i === 2 ? <><circle cx={-170} cy={0} r={110} fill="none" stroke={C.first} strokeWidth={4} /><Arrow p={[-170 + 110, 0]} q={[-170 + 110, -90]} color={C.first} w={8} head={28} />
        <Arrow p={[-170 + 110, 0]} q={[-170 + 50, 0]} color={C.neg} w={8} head={28} />
        <path d="M 120 140 Q 190 20 250 -140" fill="none" stroke={C.key} strokeWidth={5} /><Arrow p={[190, 10]} q={[230, -80]} color={C.second} w={7} head={24} /><Arrow p={[190, 10]} q={[110, -20]} color={C.neg} w={7} head={24} /></> : null}
    </g>;
  };
  return (
    <Scene>
      <Svg>
        {[0, 1, 2].map(pic)}
        <Keyword f={f} text="1 · shape" at={[1250, 160]} appear={t1} out={row > 0 ? undefined : t2 - 18} />
        <Lbl x={1250} y={300} t="r = constant · r = a" c={C.key} s={T.floor} o={win(f, t1b, t2 - 18)} />
        <Keyword f={f} text="2 · measurement" at={[1250, 160]} appear={t2} out={t3 - 18} />
        <Lbl x={1250} y={300} t="radar · station · grid" c={C.key} s={T.floor} o={win(f, t2b, t3 - 18)} />
        <Keyword f={f} text="3 · meaning" at={[1250, 160]} appear={t3} out={tRow - 18} />
        <Lbl x={1250} y={300} t="spin, inflow · along, across" c={C.key} s={T.floor} o={win(f, t3b, tRow - 18)} />
        {["shape", "measurement", "meaning"].map((t, i) => <Lbl key={t} x={330 + i * 630} y={620} t={t} c={C.key} s={T.key} a="middle" o={row} />)}
        <Lbl x={960} y={760} t="maps · storm surge · moving storm" c={C.muted} s={T.floor} a="middle" o={fin(f, tRow + 20)} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s29 the great circle London - Los Angeles
const routePts = (key: "gc" | "rh", n = 181): [number, number][] => (RT[key][0] as number[]).slice(0, n).map((la, i) => [la, RT[key][1][i]] as [number, number]);
const S29: React.FC = () => {
  const f = useCurrentFrame(), k = K("s29_great_circle");
  const tFlat = SS(k, 1), tGC = SS(k, 2), tLon = AT(k, 3, "London"), tLA = AT(k, 3, "Los Angeles"), tCut = SS(k, 4), tDot = SS(k, 6), tCos = SS(k, 7), tAng = SS(k, 8),
    tWSW = SS(k, 9), tBrg = AT(k, 10, "three hundred and twelve"), tVx = AT(k, 10, "sixty two degrees north"), tGl = AT(k, 10, "Greenland"), tFl = SS(k, 11);
  const cam = globePath([{ f: 0, lat: 40, lon: -30, dist: 3.4 }, { f: tLon + 4, lat: RT.lhr[0], lon: RT.lhr[1], dist: 3.4 }, { f: tLA - 8, lat: RT.lhr[0], lon: RT.lhr[1], dist: 3.4 },
    { f: tLA + 44, lat: 58, lon: -58, dist: 3.4 },
    { f: LEN(k) + 10, lat: 57, lon: -60, dist: 3.4 }], f);
  const G0 = discOf(cam);
  const draw = prog(f, tCut, tCut + 60);
  const fly = prog(f, tWSW, tFl + 40);
  const pts = routePts("gc"), jf = Math.min(180, Math.floor(fly * 180));
  const r1 = ll(RT.lhr[0], RT.lhr[1]), r2 = ll(RT.lax[0], RT.lax[1]);
  const nrm = (() => { const c: V3 = [r1[1] * r2[2] - r1[2] * r2[1], r1[2] * r2[0] - r1[0] * r2[2], r1[0] * r2[1] - r1[1] * r2[0]]; const L = Math.hypot(...c); return [c[0] / L, c[1] / L, c[2] / L] as V3; })();
  const v2 = (() => { const c: V3 = [nrm[1] * r1[2] - nrm[2] * r1[1], nrm[2] * r1[0] - nrm[0] * r1[2], nrm[0] * r1[1] - nrm[1] * r1[0]]; return c; })();
  const full = Array.from({ length: 73 }, (_, i) => { const a = (i * 5) * D2R; return [r1[0] * Math.cos(a) + v2[0] * Math.sin(a), r1[1] * Math.cos(a) + v2[1] * Math.sin(a), r1[2] * Math.cos(a) + v2[2] * Math.sin(a)] as V3; });
  const sig = RT.sig * D2R;
  const arcC = Array.from({ length: 21 }, (_, i) => { const a = (sig * i) / 20; return scl([r1[0] * Math.cos(a) + v2[0] * Math.sin(a), r1[1] * Math.cos(a) + v2[1] * Math.sin(a), r1[2] * Math.cos(a) + v2[2] * Math.sin(a)] as V3, 0.3); });
  return (
    <Scene>
      <Globe cam={cam} grat={0.16} meshO={mix(1, 0.75, fin(f, tDot) * fout(f, tWSW))}
        over={(G) => <>
          <path d={poly(full.map((v) => G.pw(scl(v, 1.0)))) + "Z"} fill={C.gold} fillOpacity={0.1} stroke={C.gold} strokeWidth={2} strokeDasharray="10 8" opacity={fin(f, tCut) * fout(f, tDot + 40)} />
          <path d={llPath(G, pts.slice(0, Math.max(2, Math.round(181 * draw))), 1.004)} fill="none" stroke={C.gold} strokeWidth={7} opacity={fin(f, tCut)} />
          {seg(G, [0, 0, 0], r1, C.first, 7, fin(f, tDot))}{seg(G, [0, 0, 0], r2, C.second, 7, fin(f, tDot))}
          <path d={poly(arcC.map((v) => G.pw(v)))} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tCos)} />
          {wlab(G, scl(arcC[10], 1.4), "σ", C.gold, fin(f, tCos), 0, 0, "middle", T.key)}
          {dot(G, RT.lhr[0], RT.lhr[1], C.key, 10, fin(f, tLon))}{dot(G, RT.lax[0], RT.lax[1], C.key, 10, fin(f, tLA))}
          {G.vis(RT.lhr[0], RT.lhr[1]) ? wlab(G, ll(RT.lhr[0], RT.lhr[1]), "London", C.key, fin(f, tLon), 16, 30) : null}
          {G.vis(RT.lax[0], RT.lax[1]) ? wlab(G, ll(RT.lax[0], RT.lax[1]), "Los Angeles", C.key, fin(f, tLA), -16, 34, "end") : null}
          {fly > 0 && G.vis(pts[jf][0], pts[jf][1]) ? <PlaneIcon p={G.p(pts[jf][0], pts[jf][1], 1.01)} s={0.7} a={Math.atan2(-(G.p(pts[Math.min(180, jf + 2)][0], pts[Math.min(180, jf + 2)][1])[1] - G.p(pts[jf][0], pts[jf][1])[1]), G.p(pts[Math.min(180, jf + 2)][0], pts[Math.min(180, jf + 2)][1])[0] - G.p(pts[jf][0], pts[jf][1])[0]) / D2R} /> : null}
          {dot(G, RT.vx[0], RT.vx[1], C.gold, 9, fin(f, tVx))}
          {G.vis(RT.vx[0], RT.vx[1]) ? wlab(G, ll(RT.vx[0], RT.vx[1]), "Greenland", C.key, fin(f, tGl), 16, -34) : null}
        </>} />
      <GlobeFrame id="s29k" zoom={0} disc={G0} />
      <GSrc />
      <Svg>
        <Keyword f={f} text="great circle" at={[1100, 130]} appear={AT(k, 2, "great circle")} c={C.gold} />
        <Lbl x={1100} y={560} t="bearing ≈ 312° (north-west)" c={C.key} s={T.floor} o={fin(f, tBrg)} />
        <Lbl x={1100} y={630} t="highest ≈ 62° N" c={C.key} s={T.floor} o={fin(f, tVx)} />
        <Lbl x={1100} y={720} t="over Greenland and northern Canada" c={C.muted} s={T.floor} o={fin(f, tFl)} />
        <Lbl x={1100} y={220} t="flat sheet: a straight line" c={C.muted} s={T.floor} o={win(f, tFlat, tDot - 18)} />
      </Svg>
      <TeX s={EQ_S29} x={1100} y={300} size={60} o={fin(f, tCos)} />
      <CalcStack f={f} x={1320} y={380} size={54} rows={[
        { lhs: String.raw`\sigma`, rhs: String.raw`\approx79^{\circ}=1.375\ \mathrm{rad}`, at: tAng },
        { lhs: String.raw`d\approx6371\times1.375`, rhs: String.raw`\approx8760\ \mathrm{km}`, at: AT(k, 8, "eight thousand seven hundred") },
      ]} />
    </Scene>
  );
};

// ================================================================ s30 the rhumb line
const S30: React.FC = () => {
  const f = useCurrentFrame(), k = K("s30_rhumb_line");
  const tRh = SS(k, 0), tLen = SS(k, 2), tPct = SS(k, 3), tGlobe = SS(k, 4), tFlat = SS(k, 5);
  const gO = fin(f, tGlobe);
  const cam = globePath([{ f: 0, lat: 57, lon: -60, dist: 3.4 }, { f: LEN(k) + 10, lat: 52, lon: -62, dist: 3.4 }], f);
  const G0 = discOf(cam);
  const draw = prog(f, tRh + 20, tRh + 90);
  const rh = routePts("rh");
  const MB = { x: 1110, y: 515, w: 700, h: 280 };
  const mc = D.proj.routes_mc, ext: [number, number] = [Math.PI, 1.1];
  const s = Math.min(MB.w / (130 * D2R), MB.h / 0.75), cx = MB.x + MB.w / 2, cy = MB.y + MB.h / 2, x0 = -60 * D2R, y0c = 0.98;
  const pm = (x: number, y: number): Pt => [cx + (x - x0) * s, cy - (y - y0c) * s];
  const xyd = (flat: number[]) => { let d = ""; for (let i = 0; i < flat.length; i += 2) { const q = pm(flat[i], flat[i + 1]); d += `${i ? "L" : "M"}${q[0].toFixed(1)} ${q[1].toFixed(1)}`; } return d; };
  void ext;
  return (
    <Scene>
      <Globe cam={cam} grat={0.16}
        over={(G) => <>
          <path d={llPath(G, routePts("gc"), 1.004)} fill="none" stroke={C.gold} strokeWidth={mix(7, 9, gO)} />
          <path d={llPath(G, rh.slice(0, Math.max(2, Math.round(181 * draw))), 1.004)} fill="none" stroke={C.local} strokeWidth={7} opacity={fin(f, tRh)} />
          {[30, 60, 90, 120, 150].map((i) => <circle key={i} cx={G.p(rh[i][0], rh[i][1])[0]} cy={G.p(rh[i][0], rh[i][1])[1]} r={7} fill={C.local} opacity={fin(f, tRh + 40) * (G.vis(rh[i][0], rh[i][1]) ? 1 : 0)} />)}
          {dot(G, RT.lhr[0], RT.lhr[1], C.key, 10)}{dot(G, RT.lax[0], RT.lax[1], C.key, 10)}
        </>} />
      <GlobeFrame id="s30k" zoom={0} disc={G0} />
      <GSrc />
      <Svg>
        <Keyword f={f} text="rhumb line" at={[1100, 130]} appear={AT(k, 0, "rhumb line")} c={C.local} />
        <Lbl x={1100} y={200} t="same compass bearing" c={C.muted} s={T.floor} o={fin(f, tRh + 30)} />
        <Lbl x={1100} y={280} t="≈ 258° · ≈ 9730 km" c={C.local} s={T.floor} o={fin(f, tLen)} />
        <Lbl x={1100} y={340} t="great circle ≈ 8760 km" c={C.gold} s={T.floor} o={fin(f, tLen + 20)} />
        <Lbl x={1100} y={420} t="+11 % · ≈ 970 km · ≈ 1 h" c={C.key} s={T.floor} o={fin(f, tPct)} />
        <g opacity={fin(f, tFlat)}>
          <defs><clipPath id="s30mc"><rect x={MB.x} y={MB.y} width={MB.w} height={MB.h} /></clipPath></defs>
          <rect x={MB.x} y={MB.y} width={MB.w} height={MB.h} fill="#1d2a44" />
          <g clipPath="url(#s30mc)">
            {(D.proj.coast as { mc: number[] }[]).map((c, i) => <path key={i} d={xyd(c.mc)} fill="none" stroke={C.key} strokeOpacity={0.6} strokeWidth={1.6} />)}
            <path d={xyd(mc.gc)} fill="none" stroke={C.gold} strokeWidth={6} />
            <path d={xyd(mc.rh)} fill="none" stroke={C.local} strokeWidth={6} />
          </g>
          <rect x={MB.x} y={MB.y} width={MB.w} height={MB.h} fill="none" stroke={C.grid} strokeWidth={3} />
        </g>
        <Lbl x={MB.x} y={MB.y - 32} t="Mercator: rhumb straight" c={C.muted} s={T.floor} o={fin(f, tFlat)} />
      </Svg>
      <SourceBelow text="Coast: Natural Earth" pic={MB} w={700} o={fin(f, tFlat)} name="s30 src mc" />
    </Scene>
  );
};

export const SCENES_B: Record<string, React.FC> = {
  s15_sphere: S15, s16_latitude: S16, s17_longitude: S17, s18_position: S18, s19_earth_cylinder: S19, s20_distance_north: S20, s21_distance_east: S21,
  s22_grid_cells: S22, s23_area: S23, s24_enu: S24, s25_enu_turn: S25, s26_metric_terms: S26, s27_curvilinear: S27, s28_why: S28, s29_great_circle: S29,
  s30_rhumb_line: S30,
};
void [Band, PoleThermometer, ArcHead, mix, BREST];
