// ch00_coordinates_routes scenes s00-s05: the title, the hook (globe + Mercator chart), the recap of Parts 1-5, curvilinear
// coordinates, scale factors (ring → see-through globe at Brest), and what a great circle is. Globes: the house GB frame (whole,
// unzoomed; no edge fade) with a source line below; every number from data/rt.json (CHECK rows below re-assert the screen strings).
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Pt, pulse } from "../house/kit/draw";
import { RiseText, TitleGradient } from "../house/kit/title";
import { GlobeFrame, SourceBelow } from "../house/kit/frame";
import { CurvedLink } from "../house/kit/extras";
import { GlobeCam, LatCircle, globePath } from "./kit_rt/globe";
import { V3 } from "./kit_rt/cam";
import {
  AT, Arrow, BREST, CalcStack, Compass, D, D2R, GB, GC, Globe, H, K, Keyword, LAX, LEN, LON, LL, LYB, Lbl, MercMap, OrthoGlobe, PlaneIcon, RHP, RO, RH,
  Route, SE, SLATE, SRC_G, SS, Scene, Svg, TeX, XC, add, along, arcD, clamp, discOf, e2g, fin, fout, gdot, globeG, gseg, ll, mercBox, mercY, mix, opath,
  ortho, pieces, plab, poly, prog, win, facing, flatPath,
} from "./rt_lib";
import { EQ_S02, EQ_S04 } from "./rt_eq";

// ---------------------------------------------------------------- numbers on screen = the data (the render fails otherwise)
const SCL = D.scale;
const CHECK_A: [string, number, number, number][] = [
  ["a", D.consts.a / 1e3, 6371, 1e-9], ["dy", SCL.dy, 111.2, 0.05], ["dx", SCL.dx, 73.8, 0.05], ["cos", SCL.cos, 0.664, 5e-4], ["deg", SCL.deg, 0.01745, 5e-6],
  ["eq1", SCL.eq, 111, 0.5], ["lyb1", SCL.lyb, 23, 0.5], ["brg0", RO.brg0, 312, 0.5], ["rh", RH.brg, 258.5, 0.05],
];
CHECK_A.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
// the kit's globe frame (ll, Y-up) = fluidpy unit_vector (Earth axes) mapped by e2g (parity row)
{
  const a = ll(LON[0], LON[1]), b = e2g(RO.r1);
  if (Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) > 1e-5) throw new Error("CHECK globe ll ≠ unit_vector at London");
}
const GSrc: React.FC<{ o?: number }> = ({ o = 1 }) => <SourceBelow text={SRC_G} pic={GB} w={960} o={o} name="globe src" />;
/** the camera that shows both cities and the whole route (s01, s06, s11-s13) */
export const CAM_ROUTE: GlobeCam = { lat: 55, lon: -60, dist: 3.4 };
/** a point of the great-circle plane (Earth axes) at angle t from London towards Los Angeles, in kit globe coordinates */
const NRM = D.plane.n as number[];
const V2 = [NRM[1] * RO.r1[2] - NRM[2] * RO.r1[1], NRM[2] * RO.r1[0] - NRM[0] * RO.r1[2], NRM[0] * RO.r1[1] - NRM[1] * RO.r1[0]];
export const planePt = (t: number, s = 1): V3 => e2g([0, 1, 2].map((i) => s * (RO.r1[i] * Math.cos(t) + V2[i] * Math.sin(t))));
const lab = (la: number, lo: number, t: string) => ({ la, lo, t });

// ================================================================ s00 title
const TA = { x: 1180, y: 170, w: 600, h: 470 }, TBb = { x: 1130, y: 170, w: 470, h: 470 };
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  const tApp = AT(k, 0, "meteorology and aviation"), tEasy = AT(k, 0, "the easy way"), tFl = AT(k, 0, "shortest flights");
  const pz = 1 + 0.06 * pulse(f, tEasy, 14);
  const oA = fout(f, tApp, 12), oB = fin(f, tApp, 12);
  const camA = globePath([{ f: 0, lat: 46, lon: -40, dist: 3.4 }, { f: 330, lat: 50, lon: -58, dist: 3.4 }], f);
  const camB = { lat: 52, lon: -60, dist: 3.4 };
  const draw = prog(f, 20, tApp - 10), fly = clamp((f - tApp - 6) / (LEN(k) - tApp), 0, 1), rh = prog(f, tFl - 30, LEN(k));
  const hd = RO.head as number[], hi = Math.min(180, Math.round(fly * 180));
  return (
    <Scene fadeIn={false}>
      <Svg>
        <defs><TitleGradient id="ttl" x1={100} x2={1000} /></defs>
        <RiseText f={f} t="Coordinates" x={100} y={235} s={150} at={2} fill="url(#ttl)" />
        <RiseText f={f} t="Part 6" x={100} y={390} s={150} at={14} fill="url(#ttl)" />
        <g transform={`translate(104 505) scale(${pz}) translate(-104 -505)`}>
          <RiseText f={f} t="Routes" x={104} y={530} s={96} at={24} fill={C.key} />
        </g>
        <RiseText f={f} t="great circles" x={106} y={660} s={68} at={32} fill={C.gold} />
        <RiseText f={f} t="and rhumb lines" x={106} y={750} s={68} at={40} fill={C.key} colors={(i) => (i >= 4 ? SLATE : undefined)} />
      </Svg>
      <Globe cam={camA} box={TA} o={oA * fin(f, 4, 10)} grat={0.3} coast={0.35}
        over={(G) => <>
          <path d={poly(Array.from({ length: 73 }, (_, i) => G.pw(planePt((i * 5) * D2R))))} fill={C.key} fillOpacity={0.12} stroke={C.key} strokeOpacity={0.4} strokeWidth={2}
            opacity={win(f, 10, tApp - 20)} />
          <Route G={G} pts={GC} c={C.gold} w={6} upto={draw} />
          {gdot(G, LON[0], LON[1], C.key, 8)}{gdot(G, LAX[0], LAX[1], C.key, 8)}
        </>} />
      <Globe cam={camB} box={TBb} o={oB}
        over={(G) => { const P = along(G, GC, fly); return <>
          <Route G={G} pts={GC} c={C.gold} w={6} />
          <Route G={G} pts={RHP} c={SLATE} w={6} upto={rh} />
          {gdot(G, LON[0], LON[1], C.key, 8)}{gdot(G, LAX[0], LAX[1], C.key, 8)}
          {P.vis ? <PlaneIcon p={P.p} a={P.a} s={0.6} c={C.ink} /> : null}
        </>; }} />
      <Svg>
        <Compass c={[1720, 290]} r={66} brg={hd[hi]} o={oB} label={false} />
        <Compass c={[1720, 520]} r={66} brg={RH.brg} o={oB * fin(f, tFl - 30)} col={SLATE} label={false} />
      </Svg>
      <SourceBelow text={SRC_G} pic={{ x: 1130, y: 170, w: 710, h: 470 }} w={700} name="s00 src" />
    </Scene>
  );
};

// ================================================================ s01 hook: the shortest way London → Los Angeles
const MB1 = { x: 1060, y: 120, w: 780, h: 0 }, ME1 = { x0: -135 * D2R, x1: 15 * D2R, y0: mercY(18), y1: mercY(68) };
const MB1f = mercBox(MB1, ME1);
/** seven code-drawn thumbnails (the seven parts; the sixth lit) */
const Thumb: React.FC<{ i: number; x: number; y: number; o?: number }> = ({ i, x, y, o = 1 }) => {
  const w = 96, h = 80, cx = x + w / 2, cy = y + h / 2;
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={i === 5 ? C.gold : C.grid} strokeWidth={3} />
      {i === 0 ? [0, 1, 2, 3].map((q) => <g key={q}><line x1={x + 14 + q * 22} y1={y + 12} x2={x + 14 + q * 22} y2={y + h - 12} stroke={C.first} strokeWidth={2} />
        <line x1={x + 12} y1={y + 14 + q * 18} x2={x + w - 12} y2={y + 14 + q * 18} stroke={C.first} strokeWidth={2} /></g>) : null}
      {i === 1 ? <><ellipse cx={cx} cy={y + 22} rx={30} ry={8} fill="none" stroke={C.first} strokeWidth={3} /><ellipse cx={cx} cy={y + 60} rx={30} ry={8} fill="none" stroke={C.first} strokeWidth={3} />
        <line x1={cx - 30} y1={y + 22} x2={cx - 30} y2={y + 60} stroke={C.first} strokeWidth={3} /><line x1={cx + 30} y1={y + 22} x2={cx + 30} y2={y + 60} stroke={C.first} strokeWidth={3} /></> : null}
      {i === 2 || i === 5 ? <><circle cx={cx} cy={cy} r={30} fill="#1f2c48" stroke={C.first} strokeWidth={3} /><ellipse cx={cx} cy={cy} rx={30} ry={9} fill="none" stroke={C.first} strokeWidth={2} />
        {i === 5 ? <path d={`M ${cx + 22} ${cy - 8} Q ${cx} ${cy - 34} ${cx - 22} ${cy + 6}`} fill="none" stroke={C.gold} strokeWidth={4} /> : null}</> : null}
      {i === 3 ? <><Arrow p={[cx - 10, cy + 14]} q={[cx + 26, cy + 14]} color={C.second} w={4} head={12} /><Arrow p={[cx - 10, cy + 14]} q={[cx - 10, cy - 22]} color={C.second} w={4} head={12} /></> : null}
      {i === 4 ? <><circle cx={cx - 8} cy={cy} r={22} fill="none" stroke={C.first} strokeWidth={3} /><Arrow p={[cx + 12, cy + 26]} q={[cx + 40, cy + 26]} color={C.second} w={4} head={12} /></> : null}
      {i === 6 ? <><rect x={x + 14} y={y + 16} width={w - 28} height={h - 32} fill="#33405e" stroke={C.key} strokeWidth={2} /><line x1={x + 22} y1={y + 30} x2={x + w - 22} y2={y + 52} stroke={SLATE} strokeWidth={3} /></> : null}
    </g>
  );
};
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  const tSh = AT(k, 0, "shortest way"), tMap = AT(k, 0, "flat map seems to point"), tSix = AT(k, 1, "sixth of seven parts"), tSail = AT(k, 3, "sailors");
  const cam = globePath([{ f: 0, ...CAM_ROUTE, lon: -56 }, { f: LEN(k) + 10, ...CAM_ROUTE }], f);
  const gw = 7 + 5 * pulse(f, tSh, 24);
  const cities = D.mc.cities as number[];
  const thumbY = MB1f.y + MB1f.h + 92;
  return (
    <Scene>
      <Globe cam={cam} grat={0.18}
        over={(G) => <>
          <Route G={G} pts={GC} c={C.gold} w={gw} o={fin(f, tSh)} />
          <Route G={G} pts={RHP} c={SLATE} w={7} upto={prog(f, tSail, tSail + 60)} o={fin(f, tSail)} />
          {gdot(G, LON[0], LON[1], C.key, 10)}{gdot(G, LAX[0], LAX[1], C.key, 10)}
          {plab(G, LON[0], LON[1], "London", 1, -18, -34, "end")}
          {plab(G, LAX[0], LAX[1], "Los Angeles", 1, 16, 42)}
        </>} />
      <GlobeFrame id="s01k" zoom={0} disc={discOf(cam)} />
      <GSrc />
      <Svg>
        <Keyword f={f} text="the shortest way?" at={[XC - 40, 64]} s={T.floor} appear={0} out={tSix - 18} />
        <MercMap id="s01" B={MB1} E={ME1}
          inside={(P) => <path d={flatPath(P, D.mc.rh)} fill="none" stroke={SLATE} strokeWidth={6 + 4 * pulse(f, tMap, 24)} strokeDasharray="16 10" opacity={fin(f, tMap)} />}
          over={(P) => { const a = P(cities[0], cities[1]), b = P(cities[2], cities[3]); return <>
            <circle cx={a[0]} cy={a[1]} r={9} fill={C.key} stroke={C.bg} strokeWidth={3} /><circle cx={b[0]} cy={b[1]} r={9} fill={C.key} stroke={C.bg} strokeWidth={3} />
            <g data-lc-maplabel="1"><Lbl x={a[0] - 16} y={a[1] - 34} t="London" c={C.key} s={T.floor} a="end" /></g>
            <g data-lc-maplabel="1"><Lbl x={b[0] + 16} y={b[1] + 40} t="Los Angeles" c={C.key} s={T.floor} /></g>
          </>; }} />
        {Array.from({ length: 7 }, (_, i) => <Thumb key={i} i={i} x={1060 + i * 114} y={thumbY} o={fin(f, tSix + 4 * i) * (i === 5 ? 1 : 0.35)} />)}
        <Keyword f={f} text="routes" at={[1060 + 5 * 114 + 48, thumbY + 128]} a="middle" s={T.floor} appear={tSix + 30} />
      </Svg>
      <SourceBelow text="Map: Natural Earth (Mercator)" pic={MB1f} w={780} name="s01 src map" />
    </Scene>
  );
};

// ================================================================ s02 recap of Parts 1, 3, 4, 5 (one beat per sentence, older beats at 60 %)
const S02: React.FC = () => {
  const f = useCurrentFrame(), k = K("s02_part5_recap");
  const t = [0, 1, 2, 3, 4, 5, 6, 7].map((j) => SS(k, j));
  const dimTo = (j: number) => (j < 7 ? 1 - 0.4 * fin(f, t[j + 1]) : 1);
  const tArc = AT(k, 1, "arc rule"), tPhi = AT(k, 2, "latitude, phi"), tA = AT(k, 2, "the letter a"), tR = AT(k, 3, "position arrow");
  // Part 1's polar ring (top left)
  const P1c: Pt = [270, 250], Rr = 150, th = 50;
  // Part 3's globe (orthographic, right of it)
  const O = ortho(28, -25, [730, 300], 210);
  const br = O.p(BREST[0], BREST[1]), c0 = O.c;
  const slide = (BREST[0] + 30 * clamp((f - t[5] - 20) / 90, 0, 1));         // the dot moves north along Brest's meridian (S5)
  const stepE = (la: number): LL[] => Array.from({ length: 11 }, (_, i) => [la, BREST[1] + i] as LL);
  const r2 = pieces(EQ_S02, [String.raw`\ \cos\varphi\sin`]);
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, 0) * dimTo(1)}>
          {[50, 100, 150].map((r) => <circle key={r} cx={P1c[0]} cy={P1c[1]} r={r} fill="none" stroke={C.first} strokeWidth={2.5} opacity={0.7} />)}
          {[0, 45, 90, 135].map((a) => <line key={a} x1={P1c[0] - 170 * Math.cos(a * D2R)} y1={P1c[1] + 170 * Math.sin(a * D2R)} x2={P1c[0] + 170 * Math.cos(a * D2R)} y2={P1c[1] - 170 * Math.sin(a * D2R)} stroke={C.first} strokeWidth={2} opacity={0.5} />)}
          <line x1={P1c[0]} y1={P1c[1]} x2={P1c[0] + Rr} y2={P1c[1]} stroke={C.key} strokeWidth={4} opacity={fin(f, tArc)} />
          <line x1={P1c[0]} y1={P1c[1]} x2={P1c[0] + Rr * Math.cos(th * D2R)} y2={P1c[1] - Rr * Math.sin(th * D2R)} stroke={C.key} strokeWidth={4} opacity={fin(f, tArc)} />
          <path d={arcD(P1c, Rr, 0, th)} fill="none" stroke={C.gold} strokeWidth={8} opacity={fin(f, tArc)} />
          <path d={arcD(P1c, 46, 0, th)} fill="none" stroke={C.gold} strokeWidth={4} opacity={fin(f, tArc)} />
        </g>
        <g opacity={fin(f, t[2]) * dimTo(5)}>
          <OrthoGlobe O={O} />
          <path d={opath(O, Array.from({ length: 25 }, (_, i) => [(BREST[0] * i) / 24, BREST[1]] as LL))} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tPhi)} />
          <path d={opath(O, Array.from({ length: 13 }, (_, i) => [0, (BREST[1] * i) / 12] as LL))} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tPhi + 20)} />
          <line x1={c0[0]} y1={c0[1]} x2={br[0]} y2={br[1]} stroke={C.key} strokeWidth={4} strokeDasharray="10 7" opacity={fin(f, tA)} />
          <Arrow p={c0} q={add(c0, [br[0] - c0[0], br[1] - c0[1]], 0.62)} color={C.first} w={8} head={28} o={fin(f, tR) * dimTo(3)} />
          <circle cx={br[0]} cy={br[1]} r={9} fill={C.gold} stroke={C.bg} strokeWidth={3} />
          <circle cx={c0[0]} cy={c0[1]} r={7} fill={C.key} opacity={fin(f, tA)} />
          {/* S4: one degree north (teal step on the meridian, ×10); S5: one degree east, shrinking as the dot moves north */}
          <path d={opath(O, Array.from({ length: 11 }, (_, i) => [BREST[0] + i, BREST[1]] as LL))} fill="none" stroke={C.first} strokeWidth={10} opacity={fin(f, t[4]) * dimTo(4)} strokeLinecap="round" />
          <path d={opath(O, stepE(slide))} fill="none" stroke={C.first} strokeWidth={10} opacity={fin(f, t[5])} strokeLinecap="round" />
          <circle cx={O.p(slide, BREST[1])[0]} cy={O.p(slide, BREST[1])[1]} r={8} fill={C.key} opacity={fin(f, t[5])} />
        </g>
        {/* S6: a station's east, north, up arrows (Part 4); S7: a storm and the frame moving with it (Part 5) */}
        <g opacity={fin(f, t[6]) * dimTo(6)}>
          <line x1={140} y1={720} x2={420} y2={720} stroke={C.grid} strokeWidth={4} />
          <Arrow p={[260, 720]} q={[380, 720]} color={C.second} w={8} head={28} />
          <Arrow p={[260, 720]} q={[205, 655]} color={C.second} w={8} head={28} />
          <Arrow p={[260, 720]} q={[260, 590]} color={C.first} w={8} head={28} />
          <circle cx={260} cy={720} r={9} fill={C.gold} stroke={C.bg} strokeWidth={3} />
        </g>
        <g opacity={fin(f, t[7])}>
          {[30, 55, 80].map((r) => <circle key={r} cx={640 + 1.6 * Math.max(0, f - t[7])} cy={690} r={r} fill="none" stroke={C.first} strokeWidth={3} opacity={0.8} />)}
          <Arrow p={[560, 800]} q={[820, 800]} color={C.second} w={8} head={28} />
        </g>
      </Svg>
      <TeX s={H.k} x={268} y={570} size={48} c={C.first} ax={0.5} o={fin(f, t[6]) * dimTo(6)} />
      <TeX s={String.raw`r`} x={P1c[0] + Rr / 2} y={P1c[1] + 30} size={50} c={C.key} ax={0.5} o={fin(f, tArc) * dimTo(1)} />
      <TeX s={String.raw`\theta`} x={P1c[0] + 64} y={P1c[1] - 28} size={48} c={C.gold} o={fin(f, tArc) * dimTo(1)} />
      <TeX s={String.raw`s`} x={P1c[0] + Rr * Math.cos(25 * D2R) + 30} y={P1c[1] - Rr * Math.sin(25 * D2R) - 18} size={52} c={C.gold} o={fin(f, tArc) * dimTo(1)} />
      <TeX s={String.raw`a`} x={mix(c0[0], br[0], 0.45) - 30} y={mix(c0[1], br[1], 0.45)} size={50} c={C.key} ax={1} o={fin(f, tA) * dimTo(5)} halo />
      <Svg>
        <Keyword f={f} text="from the earlier parts" at={[XC, 110]} appear={0} out={t[1] - 18} />
        <Lbl x={XC} y={110} t="Part 1" c={C.muted} s={T.floor} o={fin(f, t[1]) * dimTo(1)} />
        <Lbl x={XC} y={300} t="Part 3" c={C.muted} s={T.floor} o={fin(f, t[2]) * dimTo(5)} />
        <Keyword f={f} text="Part 4: station arrows turn" at={[XC, 730]} s={T.floor} appear={t[6]} o={dimTo(6)} />
        <Keyword f={f} text="Part 5: frames that move" at={[XC, 810]} s={T.floor} appear={t[7]} />
      </Svg>
      <TeX s={String.raw`s=r\,\theta`} x={XC} y={190} size={60} o={fin(f, tArc) * dimTo(1)} />
      <TeX s={String.raw`\varphi,\ \lambda`} x={XC + 170} y={300} size={54} o={fin(f, tPhi) * dimTo(5)} />
      <TeX s={String.raw`a\approx 6400\ \text{km}\ (6371\ \text{km})`} x={XC} y={375} size={50} o={fin(f, tA) * dimTo(5)} />
      <TeX s={r2[0]} x={XC} y={455} size={48} o={fin(f, tR) * dimTo(3)} />
      <TeX s={r2[1]} x={XC + 110} y={515} size={48} o={fin(f, tR) * dimTo(3)} />
      <TeX s={String.raw`\Delta y=a\,\Delta\varphi\approx 111.2\ \text{km per }1^\circ`} x={XC} y={590} size={46} o={fin(f, t[4]) * dimTo(5)} />
      <TeX s={String.raw`\Delta x=a\cos\varphi\,\Delta\lambda`} x={XC} y={655} size={46} o={fin(f, t[5]) * dimTo(5)} />
    </Scene>
  );
};

// ================================================================ s03 curvilinear coordinates: three systems side by side (Should 8: pictures centred at y 300, ×1.15)
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_curvilinear");
  const tCv = AT(k, 1, "curvilinear coordinates"), t3 = SS(k, 2), tF1 = SS(k, 3), tRad = AT(k, 3, "rings round a radar"), tLat = AT(k, 3, "circles of latitude"),
    tMer = AT(k, 3, "the meridians"), tF2 = SS(k, 4), tGl = AT(k, 4, "east and north arrows"), tF3 = SS(k, 5), tDeg = AT(k, 6, "one degree can mean"), tName = SS(k, 7);
  const y0 = 300, xs = [330, 960, 1590];
  const ZM = (x: number) => `translate(${x} ${y0}) scale(1.15) translate(${-x} ${-y0})`;
  const O = ortho(30, 10, [xs[2], y0], 150);
  const rot = 40 * prog(f, tF2, tF2 + 120);                     // the r̂, θ̂ pairs turn as we go round
  const lit = (a: number) => 0.6 + 0.4 * fin(f, a);
  const radarPts = [20, 140, 260].map((a) => a + rot);
  const gl: LL[] = [[10, -30], [40, 30], [62, 0]];
  const en = (la: number, lo: number) => { const p = O.p(la, lo), e = O.p(la, lo + 6), n = O.p(la + 6, lo);
    const u = (q: Pt): Pt => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1; return [dx / L, dy / L]; }; return { p, e: u(e), n: u(n) }; };
  const wedge = (la: number): LL[] => Array.from({ length: 11 }, (_, i) => [la, 10 + i] as LL);
  return (
    <Scene>
      <Svg>
        <g transform={ZM(xs[0])}>
          {[40, 80, 120].map((r) => <circle key={r} cx={xs[0]} cy={y0} r={r} fill="none" stroke={fin(f, tRad) > 0 ? C.gold : C.first} strokeWidth={3} opacity={lit(tRad)} />)}
          {[0, 45, 90, 135].map((a) => <line key={a} x1={xs[0] - 130 * Math.cos(a * D2R)} y1={y0 + 130 * Math.sin(a * D2R)} x2={xs[0] + 130 * Math.cos(a * D2R)} y2={y0 - 130 * Math.sin(a * D2R)} stroke={C.first} strokeWidth={2} opacity={0.55} />)}
          {radarPts.map((a, i) => { const p: Pt = [xs[0] + 100 * Math.cos(a * D2R), y0 - 100 * Math.sin(a * D2R)];
            return <g key={i} opacity={fin(f, tF2)}><Arrow p={p} q={[p[0] + 44 * Math.cos(a * D2R), p[1] - 44 * Math.sin(a * D2R)]} color={C.second} w={5} head={16} />
              <Arrow p={p} q={[p[0] - 44 * Math.sin(a * D2R), p[1] - 44 * Math.cos(a * D2R)]} color={C.second} w={5} head={16} /></g>; })}
        </g>
        <g transform={ZM(xs[1])}>
          {[-100, 0, 100].map((dy) => <ellipse key={dy} cx={xs[1]} cy={y0 + dy} rx={110} ry={30} fill="none" stroke={fin(f, tLat) > 0 ? C.gold : C.first} strokeWidth={3} opacity={lit(tLat)} />)}
          <line x1={xs[1] - 110} y1={y0 - 100} x2={xs[1] - 110} y2={y0 + 100} stroke={C.first} strokeWidth={3} />
          <line x1={xs[1] + 110} y1={y0 - 100} x2={xs[1] + 110} y2={y0 + 100} stroke={C.first} strokeWidth={3} />
          <line x1={xs[1]} y1={y0 - 130} x2={xs[1]} y2={y0 + 130} stroke={C.muted} strokeWidth={2} strokeDasharray="8 6" />
        </g>
        <g transform={ZM(xs[2])}>
          <OrthoGlobe O={O} stroke={fin(f, tMer) > 0 ? C.gold : C.grid} />
          {[-60, -30, 0, 30, 60].map((la) => <path key={la} d={opath(O, Array.from({ length: 73 }, (_, i) => [la, -180 + 5 * i] as LL))} fill="none" stroke={C.gold} strokeWidth={2.5} opacity={fin(f, tLat) * 0.8} />)}
          {[-60, -30, 0, 30, 60, 90].map((lo) => <path key={lo} d={opath(O, Array.from({ length: 37 }, (_, i) => [-90 + 5 * i, lo] as LL))} fill="none" stroke={C.gold} strokeWidth={2.5} opacity={fin(f, tMer) * 0.8} />)}
          {gl.map(([la, lo], i) => { const q = en(la, lo); return <g key={i} opacity={fin(f, tGl)}>
            <Arrow p={q.p} q={add(q.p, q.e, 40)} color={C.second} w={5} head={16} /><Arrow p={q.p} q={add(q.p, q.n, 40)} color={C.second} w={5} head={16} /></g>; })}
          {/* the two 1° turns of longitude (drawn 10° wide): along the equator and along 78.2° N */}
          {[0, LYB[0]].map((la) => <path key={la} d={opath(O, wedge(la))} fill="none" stroke={C.first} strokeWidth={9} strokeLinecap="round" opacity={fin(f, tDeg)} />)}
          {[10, 20].map((lo) => <path key={lo} d={opath(O, Array.from({ length: 19 }, (_, i) => [5 * i, lo] as LL))} fill="none" stroke={C.key} strokeWidth={2} opacity={fin(f, tDeg) * 0.8} />)}
        </g>
        {/* labels under the pictures (opening words), then the two walk lengths under the globe */}
        <Lbl x={xs[0]} y={505} t="polar" c={C.muted} s={T.floor} a="middle" o={fout(f, tF3 - 20)} />
        <Lbl x={xs[1]} y={505} t="cylindrical" c={C.muted} s={T.floor} a="middle" o={fout(f, tF3 - 20)} />
        <Lbl x={xs[2]} y={505} t="latitude, longitude" c={C.muted} s={T.floor} a="middle" o={fout(f, tF3 - 20)} />
        <Keyword f={f} text="1° east ≈ 111 km (equator)" at={[1270, 520]} s={T.floor} appear={tDeg} c={C.first} />
        <Keyword f={f} text="1° east ≈ 23 km (78° N)" at={[1270, 585]} s={T.floor} appear={tDeg + 20} c={C.first} />
        <Keyword f={f} text="curvilinear: lines that can curve" at={[90, 640]} appear={tCv} />
        <Keyword f={f} text="three features" at={[1300, 650]} s={T.floor} appear={t3} out={tDeg - 18} />
        <Keyword f={f} text="1 · curved lines" at={[90, 760]} s={T.floor} appear={tF1} />
        <Keyword f={f} text="2 · unit vectors turn" at={[560, 760]} s={T.floor} appear={tF2} />
        <Keyword f={f} text="3 · a step is not a distance" at={[1080, 760]} s={T.floor} appear={tF3} c={C.gold} />
        <Keyword f={f} text="it needs a name" at={[1080, 830]} s={T.floor} appear={tName} />
      </Svg>
      <TeX s={H.r} x={xs[0] - 175} y={y0 - 160} size={46} c={C.second} o={fin(f, tF2)} />
      <TeX s={H.th} x={xs[0] - 175} y={y0 - 95} size={46} c={C.second} o={fin(f, tF2)} />
    </Scene>
  );
};

// ================================================================ s04 scale factors: Part 1's ring, then a see-through globe at Brest (steps drawn 10° wide)
const CAM4: GlobeCam = { lat: 40, lon: -50, dist: 3.4 };
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = K("s04_scale_factors");
  const tRing = SS(k, 1), tMult = SS(k, 2), tSF = AT(k, 3, "scale factor"), tTh = SS(k, 4), tN = AT(k, 5, "stepping north"), tLat = AT(k, 5, "scale factor of latitude"),
    tE = AT(k, 6, "Stepping east"), tPar = AT(k, 6, "a circle whose radius"), tLon = SS(k, 7), tBr = SS(k, 8), tDeg = SS(k, 9), tDy = SS(k, 10), tCos = SS(k, 11), tDx = SS(k, 12), tSame = SS(k, 13);
  const ring = fout(f, tN - 10, 16), glo = fin(f, tN, 16);
  const c1: Pt = [540, 430], R = 300, dth = 25;
  const G = globeG(CAM4);
  const br = G.p(BREST[0], BREST[1]), axisPt = G.pw([0, Math.sin(BREST[0] * D2R), 0]), c0 = G.pw([0, 0, 0]);
  const nStep: LL[] = Array.from({ length: 16 }, (_, i) => [BREST[0] + i, BREST[1]] as LL);
  const eStep: LL[] = Array.from({ length: 16 }, (_, i) => [BREST[0], BREST[1] + i] as LL);
  const mN = G.p(BREST[0] + 7.5, BREST[1]), mE = G.p(BREST[0], BREST[1] + 7.5), nT = G.p(BREST[0] + 4, BREST[1]);
  const rows = pieces(EQ_S04, [String.raw`h_\varphi`, String.raw`h_\lambda`]).map((s) => s.replace(String.raw`,\qquad`, "").trim());
  const yIn = 470;
  return (
    <Scene>
      <Svg o={ring}>
        <circle cx={c1[0]} cy={c1[1]} r={R} fill="none" stroke={C.first} strokeWidth={4} opacity={0.6} />
        <line x1={c1[0]} y1={c1[1]} x2={c1[0] + R} y2={c1[1]} stroke={C.key} strokeWidth={4} />
        <line x1={c1[0]} y1={c1[1]} x2={c1[0] + R * Math.cos(dth * D2R)} y2={c1[1] - R * Math.sin(dth * D2R)} stroke={C.key} strokeWidth={4} opacity={fin(f, tRing)} />
        <path d={arcD(c1, 80, 0, dth)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tRing)} />
        <path d={arcD(c1, R, 0, dth)} fill="none" stroke={C.first} strokeWidth={12} strokeLinecap="round" opacity={fin(f, tRing + 20)} />
        <circle cx={c1[0]} cy={c1[1]} r={9} fill={C.key} />
      </Svg>
      <TeX s={String.raw`r`} x={c1[0] + R / 2} y={c1[1] + 34} size={56} c={C.key} ax={0.5} o={ring} />
      <TeX s={String.raw`\Delta\theta`} x={c1[0] + 92} y={c1[1] - 44} size={48} c={C.gold} o={ring * fin(f, tRing)} />
      <TeX s={String.raw`r\,\Delta\theta`} x={c1[0] + R + 30} y={c1[1] - 70} size={56} c={C.first} o={ring * fin(f, tRing + 20)} />
      <Globe cam={CAM4} o={glo} meshO={0.55} grat={0.2} coast={0.35}
        over={(Gg) => <>
          {gseg(Gg, [0, -1.2, 0], [0, 1.25, 0], C.muted, 3, 1, "10 8")}
          {gseg(Gg, [0, 0, 0], ll(BREST[0], BREST[1]), C.key, 4, fin(f, tN), "10 7")}
          <Route G={Gg} pts={nStep} c={C.first} w={12} o={fin(f, tN + 10)} />
          <LatCircle G={Gg} lat={BREST[0]} c={C.gold} w={4} o={fin(f, tPar)} dash="10 8" />
          {gseg(Gg, [0, Math.sin(BREST[0] * D2R), 0], ll(BREST[0], BREST[1]), C.gold, 5, fin(f, tPar))}
          <Route G={Gg} pts={eStep} c={C.first} w={12} o={fin(f, tE + 10)} />
          {gdot(Gg, BREST[0], BREST[1], C.gold, 10, fin(f, tN))}
          <circle cx={c0[0]} cy={c0[1]} r={8} fill={C.key} opacity={fin(f, tN)} />
          {plab(Gg, BREST[0], BREST[1], "Brest", fin(f, tBr), -22, 34, "end")}
        </>} />
      <GlobeFrame id="s04k" zoom={0} disc={discOf(CAM4)} o={glo} />
      <GSrc o={glo} />
      <TeX s={String.raw`a`} x={mix(c0[0], br[0], 0.5) - 26} y={mix(c0[1], br[1], 0.5) + 10} size={50} c={C.key} ax={1} o={fin(f, tN)} halo />
      <TeX s={String.raw`a\,\Delta\varphi`} x={mN[0] - 24} y={mN[1]} size={50} c={C.first} ax={1} o={fin(f, tN + 10)} halo />
      <TeX s={String.raw`a\cos\varphi`} x={mix(axisPt[0], br[0], 0.3)} y={mix(axisPt[1], br[1], 0.3) - 34} size={48} c={C.gold} ax={0.5} o={fin(f, tPar)} halo />
      <TeX s={String.raw`a\cos\varphi\,\Delta\lambda`} x={mE[0] + 56} y={mE[1] - 66} size={48} c={C.first} ax={0.5} o={fin(f, tE + 10)} halo />
      <Svg>
        <Keyword f={f} text="how far for a small step?" at={[XC, 110]} appear={0} out={tSF - 18} />
        <Keyword f={f} text="scale factor = metres per unit" at={[XC, 110]} s={T.floor} appear={tSF} c={C.gold} />
        <Lbl x={XC} y={200} t="θ:" c={C.muted} s={T.floor} o={fin(f, tTh)} />
        <Lbl x={XC} y={275} t="φ:" c={C.muted} s={T.floor} o={fin(f, tLat)} />
        <Lbl x={XC} y={350} t="λ:" c={C.muted} s={T.floor} o={fin(f, tLon)} />
        <Keyword f={f} text="r × the step" at={[XC + 330, 200]} s={T.floor} appear={tMult} out={tTh - 18} />
        <Keyword f={f} text="at Brest" at={[XC + 520, yIn - 20]} s={T.floor} appear={tBr} />
        <Keyword f={f} text="same 1° step: 111.2 km or 73.8 km" at={[XC, 830]} s={T.floor} appear={tSame} />
        <CurvedLink f={f} from={[XC - 14, 620]} to={[nT[0] + 14, nT[1] + 4]} start={tDy + 40} bend={40} end={tCos - 10} />
        <CurvedLink f={f} from={[XC - 14, 682]} to={[mE[0] + 8, mE[1] + 12]} start={tDx + 40} bend={-40} />
      </Svg>
      <TeX s={rows[0]} x={XC + 80} y={200} size={56} o={fin(f, tTh)} />
      <TeX s={rows[1]} x={XC + 80} y={275} size={56} o={fin(f, tLat)} />
      <TeX s={rows[2]} x={XC + 80} y={350} size={56} o={fin(f, tLon)} />
      <TeX s={String.raw`\varphi=48.4^\circ,\quad a=6371\ \text{km}`} x={XC} y={yIn - 20} size={46} o={fin(f, tBr)} />
      <TeX s={String.raw`1^\circ=0.01745\ \text{rad}`} x={XC} y={yIn + 42} size={46} o={fin(f, tDeg)} />
      <CalcStack f={f} x={1270} y={585} size={46} maxLines={2} rows={[
        { lhs: String.raw`\Delta y`, rhs: String.raw`=6371\times0.01745`, at: AT(k, 10, "six thousand"), c: C.first, lc: C.first },
        { rhs: String.raw`\approx 111.2\ \text{km}`, at: AT(k, 10, "about a hundred"), c: C.first, cont: true },
        { lhs: String.raw`\cos 48.4^\circ`, rhs: String.raw`\approx 0.664`, at: AT(k, 11, "is zero point") },
        { lhs: String.raw`\Delta x`, rhs: String.raw`=111.2\times0.664`, at: AT(k, 12, "a hundred and eleven"), c: C.first, lc: C.first },
        { rhs: String.raw`\approx 73.8\ \text{km}`, at: AT(k, 12, "only about"), c: C.first, cont: true },
      ]} />
      {void [tDy, tCos, tDx]}
    </Scene>
  );
};

// ================================================================ s05 the shortest way, and what a great circle is
const CAM5: GlobeCam = { lat: 24, lon: -32, dist: 3.4 };
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = K("s05_shortest_way");
  const tFuel = AT(k, 1, "fuel"), tFlat = AT(k, 2, "straight line"), tTun = SS(k, 3), tGC = AT(k, 4, "great circle"), tCen = SS(k, 5), tEq = AT(k, 6, "The equator"),
    tMer = AT(k, 6, "every meridian"), tNot = AT(k, 7, "not great circles");
  const cam = globePath([{ f: 0, ...CAM5, lon: -26 }, { f: LEN(k) + 10, ...CAM5 }], f);
  const see = fin(f, tCen, 16) * fout(f, tEq - 6, 16);            // the globe goes see-through while the centre is shown
  const c60 = [0, Math.sin(60 * D2R), 0] as V3;
  const full = (lat: number): LL[] => Array.from({ length: 73 }, (_, i) => [lat, -180 + 5 * i] as LL);
  const mer = (lo: number): LL[] => Array.from({ length: 73 }, (_, i) => [-90 + 2.5 * i, lo] as LL);
  return (
    <Scene>
      <Globe cam={cam} grat={0.15} meshO={1 - 0.55 * see - 0.35 * fin(f, tNot) }
        over={(G) => { const pl = Array.from({ length: 73 }, (_, i) => G.pw(planePt((i * 5) * D2R))), c0 = G.pw([0, 0, 0]);
          const back = (pts: Pt[]) => poly(pts);
          return <>
            {/* the great circle through London and LA, all the way round (its far half dashed), then two radii to the centre */}
            <path d={back(pl)} fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray="10 9" opacity={fin(f, tGC) * 0.6} />
            <Route G={G} pts={Array.from({ length: 73 }, (_, i) => { const v = planePt((i * 5) * D2R); return [Math.asin(v[1]) / D2R, Math.atan2(v[0], v[2]) / D2R] as LL; })} c={C.gold} w={7} upto={prog(f, tGC, tGC + 50)} o={fin(f, tGC)} />
            {[0, 120, 240].map((a) => { const p = G.pw(planePt(a * D2R)); return <line key={a} x1={c0[0]} y1={c0[1]} x2={p[0]} y2={p[1]} stroke={C.gold} strokeWidth={4} opacity={see} />; })}
            <circle cx={c0[0]} cy={c0[1]} r={10} fill={C.key} stroke={C.bg} strokeWidth={3} opacity={see} />
            <Route G={G} pts={full(0)} c={C.gold} w={6} o={fin(f, tEq)} />
            <Route G={G} pts={mer(0)} c={C.gold} w={6} o={fin(f, tMer)} />
            <Route G={G} pts={mer(180)} c={C.gold} w={6} o={fin(f, tMer)} />
            <Route G={G} pts={full(60)} c={SLATE} w={6} o={fin(f, tNot)} />
            {gseg(G, [0, -1.15, 0], [0, 1.2, 0], C.muted, 3, fin(f, tNot), "10 8")}
            {gseg(G, c60, ll(60, -32), SLATE, 5, fin(f, tNot + 10))}
            <circle cx={G.pw(c60)[0]} cy={G.pw(c60)[1]} r={9} fill={SLATE} stroke={C.bg} strokeWidth={3} opacity={fin(f, tNot + 10)} />
          </>; }} />
      <GlobeFrame id="s05k" zoom={0} disc={discOf(cam)} />
      <GSrc />
      {(() => { const G = globeG(cam), q = G.pw(c60); return <Svg><g data-lc-maplabel="1"><Lbl x={q[0] + 20} y={q[1] - 34} t="centre on the axis" c={C.key} s={T.floor} o={fin(f, tNot + 20)} /></g></Svg>; })()}
      <Svg>
        <Keyword f={f} text="the shortest way?" at={[XC, 110]} appear={0} />
        <Keyword f={f} text="distance · fuel · time" at={[XC, 200]} s={T.floor} appear={tFuel} />
        <g opacity={fin(f, tFlat)}>
          <rect x={XC} y={260} width={420} height={150} fill="#22304a" stroke={C.grid} strokeWidth={3} />
          <circle cx={XC + 60} cy={370} r={10} fill={C.key} /><circle cx={XC + 360} cy={300} r={10} fill={C.key} />
          <line x1={XC + 60} y1={370} x2={XC + 360} y2={300} stroke={C.key} strokeWidth={5} />
        </g>
        <Keyword f={f} text="paper: a straight line" at={[XC, 460]} s={T.floor} appear={tFlat} />
        <Keyword f={f} text="a plane: the curved surface" at={[XC, 530]} s={T.floor} appear={tTun} />
        <Keyword f={f} text="great circle" at={[XC, 620]} appear={tGC} c={C.gold} />
        <Keyword f={f} text="centre = the Earth's centre" at={[XC, 700]} s={T.floor} appear={tCen} />
        <Keyword f={f} text="equator · meridian + partner" at={[XC, 770]} s={T.floor} appear={tEq} c={C.gold} />
        <Keyword f={f} text="other parallels: smaller" at={[XC, 840]} s={T.floor} appear={tNot} c={SLATE} />
      </Svg>
    </Scene>
  );
};

export const SCENES_A: Record<string, React.FC> = {
  s00_title: S00, s01_hook: S01, s02_part5_recap: S02, s03_curvilinear: S03, s04_scale_factors: S04, s05_shortest_way: S05,
};
void [lab, facing, RHP, CalcStack];
