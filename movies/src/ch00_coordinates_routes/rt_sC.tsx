// ch00_coordinates_routes scenes s11-s15: where the route goes (the keep line after the maths block, 312° → vertex 62.4° N near
// Greenland → 214°), the rhumb line (258.5°, 9733 km, +11 %, the spiral to a pole), why sailors liked it (one compass setting,
// Brest → Lisbon, a ruler on the Mercator chart, rhumb-line legs), the recap and the series end card. Globes in the house GB frame
// (whole, unzoomed; s13 turns to Brest-Lisbon and back); every number from data/rt.json.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { ramp } from "../house";
import { Pt } from "../house/kit/draw";
import { GlobeFrame, SourceBelow } from "../house/kit/frame";
import { CurvedLink } from "../house/kit/extras";
import { Notebook } from "../house/kit/icons";
import { GProj, GlobeCam, globePath } from "./kit_rt/globe";
import {
  AT, Arrow, BREST, CalcStack, Compass, D, D2R, Disc, GB, GC, Globe, H, HL, HOLD, K, Keyword, Recall, LAX, LEN, LIS, LON, LL, Lbl, Magnifier, MercMap, OrthoGlobe, PlaneIcon, RH, RHP, RO,
  Route, SE, SLATE, sang, SRC_G, SS, Scene, SideCallout, Svg, TableIcon, TeX, XC, add, along, arcD, clamp, dP, discOf, fin, flatPath, fout, gdot, globeG, mercBox, mercY,
  mix, opath, ortho, plab, poly, prog, scaleDisc, textW, win,
} from "./rt_lib";
import { CAM_ROUTE } from "./rt_sA";
import { DISC, SGN } from "./rt_sB";
import { EQ_S14 } from "./rt_eq";

const BL = D.bl, LG = D.legs;
const CHECK_C: [string, number, number, number][] = [
  ["brg0", RO.brg0, 312, 0.5], ["brg1", RO.brg1, 214, 0.5], ["vx", RO.vx[0], 62.4, 0.05], ["sig79", RO.sig_deg, 79, 0.5], ["d", RO.d_km, 8755, 0.5],
  ["rhb", RH.brg, 258.5, 0.05], ["rhkm", RH.km, 9733, 0.5], ["ratio", 9733 / 8755, 1.11, 0.005], ["extra", RH.extra, 978, 0.6], ["hour", 978 / 900, 1.1, 0.015],
  ["blg", BL.gc_km, 1138, 0.5], ["blx", BL.extra_m, 150, 2], ["pct", 100 * (RH.ratio - 1), 11, 0.5], ["sig", RO.sig_deg, 78.7, 0.05], ["chg", RO.brg0 - RO.brg1, 100, 2.5],
  // r1fix 2026-11-10 (review 1 M4): the s13 row's two lengths to the hundredth of a km, and their difference in km
  ["blg2", BL.gc_km, 1138.12, 0.005], ["blr2", BL.rh_km, 1138.27, 0.005], ["bld", (BL.rh_km - BL.gc_km), 0.15, 0.005],
];
CHECK_C.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
const GSrc: React.FC<{ o?: number }> = ({ o = 1 }) => <SourceBelow text={SRC_G} pic={GB} w={960} o={o} name="globe src" />;
/** screen direction of local north and of the route at point i of a route (for the same-angle marks at the meridians) */
const angleMark = (G: GProj, pts: LL[], i: number, r = 26) => {
  const [la, lo] = pts[i], p = G.p(la, lo), n = G.p(la + 1.5, lo), q = G.p(pts[i + 1][0], pts[i + 1][1]);
  const an = Math.atan2(-(n[1] - p[1]), n[0] - p[0]) / D2R, ar = Math.atan2(-(q[1] - p[1]), q[0] - p[0]) / D2R;
  let d = ar - an; d = ((d % 360) + 540) % 360 - 180;
  return { p, d: arcD(p, r, an, an + d, 16), vis: G.vis(la, lo) };
};
/** the route index nearest to longitude lo */
const atLon = (pts: LL[], lo: number) => pts.reduce((b, q, i) => (Math.abs(q[1] - lo) < Math.abs(pts[b][1] - lo) ? i : b), 0);

// ================================================================ s11 the keep line, then where the route goes
const MB11 = { x: 1100, y: 150, w: 600, h: 0 }, ME11 = { x0: -130 * D2R, x1: 10 * D2R, y0: mercY(25), y1: mercY(68) };
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_route_shape");
  // remake 2026-11-07: the new S5 says where the heading comes from (Part 4's east and north arrows); the F1 rows are cued on its words
  const tKeep = SS(k, 1), tWhere = SS(k, 2), tWSW = AT(k, 3, "west-south-west"), tB0 = AT(k, 4, "three hundred and twelve degrees"), tHow = SS(k, 5),
    tEN = AT(k, 5, "own east and north arrows"), tMeas = AT(k, 5, "how much of"), tAlong = AT(k, 5, "along each one"), tTurn = AT(k, 5, "turn that into"),
    tVx = AT(k, 6, "sixty two point four degrees north"), tGl = AT(k, 6, "Greenland"), tCan = AT(k, 7, "northern Canada"), tB1 = AT(k, 7, "two hundred and fourteen degrees"),
    tChg = AT(k, 8, "almost a hundred degrees"), tWhy = SS(k, 9);
  const cam = globePath([{ f: 0, ...CAM_ROUTE }, { f: LEN(k) + 10, ...CAM_ROUTE, lon: -62 }], f);
  const G = globeG(cam);
  const see = win(f, tKeep, tWhere - 10, 16);
  const fly = prog(f, tB0, SE(k, 8));
  const hd = RO.head as number[], hi = Math.min(180, Math.round(fly * 180));
  const pL = G.p(LON[0], LON[1]), pA = G.p(LAX[0], LAX[1]);
  const MBf = mercBox(MB11, ME11);
  // remake 2026-11-07: the WSW chart leaves before the F1 stack enters (its label at y 519 sat on the stack's first row)
  const mapO = win(f, tWSW, tHow - 12);
  const cities = D.mc.cities as number[];
  // heading strip (in the column after the chart has gone): 11 samples of the heading along the route (every tenth)
  const SX = 1130, SW = 660, SY = 300;
  const sx = (i: number) => SX + (i / 10) * SW;
  // r1fix 2026-11-10 (review 1 M1): the keep-line picture is the face-on disc of s07/s10 (σ IS the angle at the Earth's centre between r̂₁
  // and r̂₂), as an inset in the column. The old surface wedge (two chords meeting at the projected centre) opened ~170° on screen yet read 79°.
  const D11 = scaleDisc(DISC, [1470, 600], 180), m11 = (D11.a1 + D11.a2) / 2;
  return (
    <Scene>
      <Globe cam={cam} grat={0.16}
        over={(Gg) => { const P = along(Gg, GC, fly); return <>
          <Route G={Gg} pts={GC} c={C.gold} w={8} />
          {gdot(Gg, LON[0], LON[1], C.key, 10)}{gdot(Gg, LAX[0], LAX[1], C.key, 10)}
          {gdot(Gg, RO.vx[0], RO.vx[1], C.gold, 10, fin(f, tVx))}
          {plab(Gg, LON[0], LON[1], "London", 1, -18, -36, "end")}
          {/* r1fix (review 1 M6): "Los Angeles" below the city (s11-s13 alike, so the cuts do not jump), off s12's rhumb line and its angle mark */}
          {plab(Gg, LAX[0], LAX[1], "Los Angeles", 1, 0, 136)}
          {/* build1 2026-11-10 (K6 text-text): 62.4° N under the route (was over London's label), Greenland on its ice sheet's north */}
          {plab(Gg, RO.vx[0], RO.vx[1], "62.4° N", fin(f, tVx), 0, 48, "middle")}
          {plab(Gg, 77, -42, "Greenland", fin(f, tGl), 0, 0, "middle", true)}
          {plab(Gg, 58, -100, "Canada", fin(f, tCan), 0, 0, "middle", true)}
          {fly > 0 && P.vis ? <PlaneIcon p={P.p} a={P.a} s={0.7} o={fout(f, SE(k, 8) + 20)} /> : null}
        </>; }} />
      <GlobeFrame id="s11k" zoom={0} disc={discOf(cam)} />
      <GSrc />
      <Svg>
        {/* the face-on disc (same geometry as s07/s10: centre, r̂₁, r̂₂ projected through the face-on camera), σ arc and the route arc */}
        <Disc V={D11} o={see} sig={1} route={1} sw={0.75} />
        <Lbl x={D11.c[0]} y={D11.c[1] + D11.R + 58} t="seen from the Earth's centre" c={C.muted} s={T.floor} a="middle" o={see} />
        {/* r1fix 2026-11-10 (review 1 S7): the London dial sits 20 px outside the globe's limb (it straddled the limb, over the image) */}
        <Compass c={[pL[0] + 200, pL[1] + 110]} r={58} brg={RO.brg0} o={fin(f, tB0) * fout(f, tWhy)} label={false} />
        <Compass c={[pA[0] - 60, pA[1] - 150]} r={58} brg={RO.brg1} o={fin(f, tB1) * fout(f, tWhy)} label={false} />
        <Keyword f={f} text="if you skipped, keep this:" at={[XC, 110]} appear={0} out={tWhere - 18} c={C.gold} />
        <Keyword f={f} text="≈ 79° apart (at the centre)" at={[XC, 210]} s={T.floor} appear={AT(k, 1, "seventy nine")} out={tWhere - 18} />
        <Keyword f={f} text="great circle ≈ 8755 km" at={[XC, 290]} s={T.floor} appear={AT(k, 1, "eight thousand")} out={tWhere - 18} c={C.gold} />
        <Keyword f={f} text="where does it go?" at={[XC, 110]} appear={tWhere} out={tChg - 18} />
        <MercMap id="s11" B={MB11} E={ME11} o={mapO}
          inside={(P) => { const a = P(cities[0], cities[1]), b = P(cities[2], cities[3]); return <Arrow p={a} q={b} color={SLATE} w={6} head={26} dash="14 9" />; }}
          over={(P) => { const a = P(cities[0], cities[1]), b = P(cities[2], cities[3]); return <>
            <circle cx={a[0]} cy={a[1]} r={8} fill={C.key} /><circle cx={b[0]} cy={b[1]} r={8} fill={C.key} /></>; }} />
        <Lbl x={XC} y={MBf.y + MBf.h + 78} t="flat map: west-south-west" c={SLATE} s={T.floor} o={mapO} />
        <Keyword f={f} text="heading changes by almost 100°" at={[XC, 140]} s={T.floor} appear={tChg} />
        <g opacity={fin(f, tChg)}>
          <line x1={SX} y1={SY} x2={SX + SW} y2={SY} stroke={C.muted} strokeWidth={4} />
          {hd.filter((_, i) => i % 18 === 0).map((h, i) => <line key={i} x1={sx(i)} y1={SY - 14} x2={sx(i)} y2={SY + 14} stroke={C.muted} strokeWidth={3} />)}
          <path d={poly(hd.filter((_, i) => i % 18 === 0).map((h, i) => [sx(i), SY - 20 - (h - 214) * 0.9] as Pt))} fill="none" stroke={C.gold} strokeWidth={5} />
          <circle cx={sx(hi / 18)} cy={SY - 20 - (hd[hi] - 214) * 0.9} r={9} fill={C.key} />
          <Lbl x={SX} y={SY + 50} t="312°" c={C.key} s={T.floor} a="start" />
          <Lbl x={SX + SW} y={SY + 50} t="214°" c={C.key} s={T.floor} a="end" />
        </g>
        <Keyword f={f} text="over Greenland and Canada" at={[XC, 820]} s={T.floor} appear={tWhy} />
        {/* build1 2026-11-10 (continuity plan 5f s11): the compass bearing (from north, clockwise) recalled from Part 1 where 312° is formed */}
        <Lbl x={XC} y={800} t="derived in Part 1: bearings" c={C.gold} s={T.floor} o={win(f, tTurn + 30, SS(k, 6) - 10)} />
        {/* r1fix 2026-11-10 (review 1 M2): the vertex and the arrival are results on their words (their unvoiced working — n̂, n_z, back-azimuth — is gone) */}
        <Keyword f={f} text="highest point ≈ 62.4° N" at={[XC, 540]} s={T.floor} appear={tVx} c={C.gold} />
        <Keyword f={f} text="arrives at ≈ 214° (south-west)" at={[XC, 620]} s={T.floor} appear={tB1} c={C.gold} />
      </Svg>
      {/* the inset's labels: r̂₁ (ink), r̂₂ (orange) at the tips, σ inside the arc, d on the route arc (as s07) */}
      <TeX s={H.r1} x={dP(D11, D11.a1, D11.R + 44)[0]} y={dP(D11, D11.a1, D11.R + 44)[1]} size={48} c={C.ink} ax={0.5} o={see} halo />
      <TeX s={H.r2} x={dP(D11, D11.a2, D11.R + 44)[0]} y={dP(D11, D11.a2, D11.R + 44)[1]} size={48} c={C.second} ax={0.5} o={see} halo />
      <TeX s={String.raw`\sigma`} x={dP(D11, m11, D11.R * 0.5)[0]} y={dP(D11, m11, D11.R * 0.5)[1]} size={52} c={C.gold} ax={0.5} o={see} halo />
      <TeX s={String.raw`d`} x={dP(D11, m11, D11.R + 40)[0]} y={dP(D11, m11, D11.R + 40)[1]} size={52} c={C.gold} ax={0.5} o={see} halo />
      <SourceBelow text="Map: Natural Earth (Mercator)" pic={MBf} w={600} o={mapO} name="s11 src map" />
      {/* audit F1: the heading from Part 4's local arrows. Remake 2026-11-07: the rows are cued on S5 (what is combined is said; the products
          stay on screen), Part 4 recalled above the stack, the answer glows. r1fix 2026-11-10 (review 1 M2): only the VOICED heading rows
          remain (14 rows rolled past at 2 s each with one sentence of voice); the arrows are named east / north and β is said to be the
          angle west of north, so each number on screen is labelled; the stack leaves as the vertex sentence starts */}
      <Recall f={f} tex="" name="local east and north" part={4} x={XC} y={410} appear={AT(k, 5, "from Part 4")} out={SS(k, 6) - 10} />
      <CalcStack f={f} x={XC} y={540} size={44} maxLines={2} o={fout(f, SS(k, 6) + 4)} rows={[
        { rhs: String.raw`\text{east }\hat{\mathbf i}_1=(0.002,\,1.000,\,0)`, at: tEN, c: C.muted, h: 56 },
        { rhs: String.raw`\text{north }\hat{\mathbf j}_1=(-0.783,\,0.002,\,0.622)`, at: tEN + 12, c: C.muted, cont: true, h: 56 },
        { rhs: String.raw`e=\hat{\mathbf r}_2\cdot\hat{\mathbf i}_1,\ \ n=\hat{\mathbf r}_2\cdot\hat{\mathbf j}_1`, at: tMeas, c: C.muted, h: 56 },
        { rhs: String.raw`e=-0.001-0.730`, at: tAlong, h: 56 },
        { rhs: String.raw`=-0.731\ \text{(west)}`, at: tAlong + 14, cont: true, h: 56 },
        { rhs: String.raw`n=0.307-0.001+0.348`, at: tAlong + 28, h: 56 },
        { rhs: String.raw`=0.654\ \text{(north)}`, at: tAlong + 42, cont: true, h: 56 },
        { rhs: String.raw`\beta\text{: the angle west of north}`, at: tTurn, c: C.muted, h: 56 },
        { rhs: String.raw`\tan\beta=0.731\div0.654\approx1.12`, at: tTurn + 12, h: 56 },
        { rhs: String.raw`\Rightarrow\beta\approx48^\circ`, at: tTurn + 22, cont: true, h: 56 },
        { rhs: String.raw`360^\circ-48^\circ=312^\circ\ \text{(north-west)}`, at: tTurn + 30, c: C.gold, cont: true, h: 56, glow: HL(f, tTurn + 30) },
      ]} />
      {void [tCan, tHow, tChg, m11]}
    </Scene>
  );
};

// ================================================================ s12 the rhumb line
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12_rhumb");
  const tRh = AT(k, 1, "rhumb line"), tSame = AT(k, 1, "crosses every meridian"), tB = AT(k, 2, "two hundred and fifty eight"), tS = AT(k, 3, "further south"), tLen = AT(k, 3, "nine thousand"),
    tHow = SS(k, 4), tR = AT(k, 5, "gives about one point"), tPct = AT(k, 5, "eleven percent"), tX = SS(k, 6), tHr = AT(k, 6, "more than an hour"), tSp = AT(k, 7, "spiral round and round");
  const cam = globePath([{ f: 0, ...CAM_ROUTE, lon: -62 }, { f: LEN(k) + 10, ...CAM_ROUTE, lon: -64 }], f);
  const G = globeG(cam), pL = G.p(LON[0], LON[1]);
  const marks = [-20, -40, -60, -80, -100].map((lo) => atLon(RHP, lo));
  // the spiral inset: a south-polar view (azimuthal equidistant) of the line kept at 258.5° beyond LA
  const SP = D.rhumb.spiral as number[][], ic: Pt = [1660, 720], iR = 120;
  const pp = (la: number, lo: number): Pt => { const r = (iR * (90 + la)) / 130; return [ic[0] + r * Math.sin(lo * D2R), ic[1] + r * Math.cos(lo * D2R)]; };
  const nSp = Math.round((SP[0].length - 1) * prog(f, tSp, tSp + 90));
  return (
    <Scene>
      <Globe cam={cam} grat={0.16}
        over={(Gg) => <>
          <Route G={Gg} pts={GC} c={C.gold} w={8} />
          <Route G={Gg} pts={RHP} c={SLATE} w={7} upto={prog(f, tRh, tRh + 80)} o={fin(f, tRh)} />
          {marks.map((i, q) => { const M = angleMark(Gg, RHP, i); return M.vis ? <path key={q} d={M.d} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tSame + 8 * q)} /> : null; })}
          {gdot(Gg, LON[0], LON[1], C.key, 10)}{gdot(Gg, LAX[0], LAX[1], C.key, 10)}
          {plab(Gg, LON[0], LON[1], "London", 1, -18, -36, "end")}
          {/* r1fix 2026-11-10 (review 1 M6): below the city, off the slate rhumb line and the first gold angle mark */}
          {plab(Gg, LAX[0], LAX[1], "Los Angeles", 1, 0, 136)}
        </>} />
      <GlobeFrame id="s12k" zoom={0} disc={discOf(cam)} />
      <GSrc />
      <Svg>
        {/* r1fix 2026-11-10 (review 1 S7): the dial 20 px outside the limb, as s11 */}
        <Compass c={[pL[0] + 200, pL[1] + 110]} r={58} brg={RH.brg} col={SLATE} o={fin(f, tB)} label={false} />
        <Keyword f={f} text="sailors' route" at={[XC, 110]} appear={0} out={tRh - 18} />
        <Keyword f={f} text="rhumb line" at={[XC, 110]} appear={tRh} c={SLATE} />
        <Lbl x={XC} y={185} t="same bearing all the way" c={C.key} s={T.floor} o={fin(f, tSame)} />
        <Lbl x={XC} y={255} t="≈ 258.5°: a little south of west" c={SLATE} s={T.floor} o={fin(f, tB)} />
        <Lbl x={XC} y={325} t="rhumb ≈ 9733 km" c={SLATE} s={T.floor} o={fin(f, tLen)} />
        <Lbl x={XC + 420} y={325} t="vs 8755 km" c={C.gold} s={T.floor} o={fin(f, tLen + 20)} />
        {/* r1fix (review 1 M3): the results stand alone (the unvoiced ψ working is Part 7's); one more voiced line fills the gap before "how much longer?" */}
        <Lbl x={XC} y={395} t="stays south of the great circle" c={SLATE} s={T.floor} o={win(f, tS, tHow - 20)} />
        <Keyword f={f} text="how much longer?" at={[XC, 400]} s={T.floor} appear={tHow} out={tR - 18} />
        <g opacity={fin(f, tSp)}>
          <circle cx={ic[0]} cy={ic[1]} r={iR} fill="#1f2c48" stroke={C.grid} strokeWidth={3} />
          {[-60, -30, 0].map((la) => <circle key={la} cx={ic[0]} cy={ic[1]} r={(iR * (90 + la)) / 130} fill="none" stroke={C.muted} strokeOpacity={0.3} strokeWidth={1.5} />)}
          <path d={poly(SP[0].slice(0, Math.max(2, nSp)).map((la, i) => pp(la, SP[1][i])))} fill="none" stroke={SLATE} strokeWidth={4} />
          <circle cx={ic[0]} cy={ic[1]} r={7} fill={C.key} />
        </g>
        <Lbl x={XC} y={770} t="to the South Pole" c={C.muted} s={T.floor} o={fin(f, tSp + 30)} />
      </Svg>
      <CalcStack f={f} x={1560} y={390} size={46} maxLines={3} rows={[
        { lhs: String.raw`9733\ \text{km}\div8755\ \text{km}`, rhs: String.raw`\approx1.11`, at: tR },
        { lhs: String.raw`9733-8755`, rhs: String.raw`\approx978\ \text{km}`, at: tX },
        { lhs: String.raw`978\ \text{km}\div900\ \text{km/h}`, rhs: String.raw`\approx1.1\ \text{h}`, at: tHr },
      ]} />
      <TeX s={String.raw`+11\,\%`} x={XC} y={660} size={60} c={C.gold} o={fin(f, tPct)} glow={HL(f, tPct)} />
      {/* r1fix 2026-11-10 (review 1 M3): the ψ = ln tan(45° + φ/2) working (eleven rows, never voiced, ψ undefined, "(Part 7)" pointing
          ahead) is dropped; Part 7 teaches ψ. The bearing and the length stay as results on their words (the Lbls above). */}
      {void [tS, SS]}
    </Scene>
  );
};

// ================================================================ s13 why sailors liked the rhumb line: three reasons
const MB13 = { x: 1100, y: 380, w: 700, h: 0 }, ME13 = { x0: -130 * D2R, x1: 10 * D2R, y0: mercY(25), y1: mercY(66) };
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = K("s13_why_rhumb");
  const t3 = SS(k, 1), tR1 = SS(k, 2), tSet = AT(k, 3, "two hundred and fifty eight"), tNew = SS(k, 4), tCalc = AT(k, 5, "a lot of calculation"), tR2 = SS(k, 6), tBL = SS(k, 7),
    tBLx = AT(k, 7, "a hundred and fifty metres"), tR3 = SS(k, 8), tMerc = AT(k, 9, "Mercator map"), tRuler = AT(k, 10, "with a ruler"), tAng = AT(k, 10, "read off its angle"),
    // remake 2026-11-07 (continuity §6): the Part 7 line is said once, in the recap; the keyword stays, after the Mercator sentence
    tLegs = AT(k, 11, "rhumb-line legs"), tP7 = AT(k, 9, "a straight line") + 30;
  const CAM_BL: GlobeCam = { lat: 40, lon: -14, dist: 3.4 };
  const cam = globePath([{ f: 0, ...CAM_ROUTE, lon: -64 }, { f: tR2, ...CAM_ROUTE, lon: -64 }, { f: tR2 + 100, ...CAM_BL }, { f: tR3, ...CAM_BL },
    { f: tR3 + 100, ...CAM_ROUTE }, { f: LEN(k) + 10, ...CAM_ROUTE, lon: -61 }], f);
  const fly = prog(f, tNew, tR2 - 20);
  const hd = RO.head as number[], hi = Math.min(180, Math.round(fly * 180));
  const blG: LL[] = BL.gc[0].map((la: number, i: number) => [la, BL.gc[1][i]] as LL), blR: LL[] = BL.rh[0].map((la: number, i: number) => [la, BL.rh[1][i]] as LL);
  const legs: LL[][] = (LG.legs as { lat: number[]; lon: number[] }[]).map((L) => L.lat.map((la, i) => [la, L.lon[i]] as LL));
  const r1o = win(f, tR1, tR2 - 18), r2o = win(f, tR2, tR3 - 18), r3o = fin(f, tR3);
  const MBf = mercBox(MB13, ME13);
  const cities = D.mc.cities as number[];
  const dim = (a: number, b: number) => fin(f, a) * (1 - 0.4 * fin(f, b));
  return (
    <Scene>
      <Globe cam={cam} grat={0.16}
        over={(G) => { const P = along(G, GC, fly); return <>
          {/* r1fix 2026-11-10 (review 1 S2): the London–LA route dims to 25 % while the camera is at Brest–Lisbon (it looked like a branch
              starting at Brest) and the Brest–Lisbon pair leaves with its labels when the camera turns back */}
          <Route G={G} pts={GC} c={C.gold} w={8} o={1 - 0.75 * win(f, tR2 + 40, tR3 + 60, 30)} />
          <Route G={G} pts={RHP} c={SLATE} w={6} o={0.75 * fout(f, tR2 - 10)} />
          <Route G={G} pts={blR} c={SLATE} w={8} o={win(f, tBL, tR3 + 40)} />
          <Route G={G} pts={blG} c={C.gold} w={4} o={win(f, tBL, tR3 + 40)} />
          {legs.map((L, i) => <Route key={i} G={G} pts={L} c={SLATE} w={6} o={fin(f, tLegs + 10 * i)} />)}
          {(LG.pts[0] as number[]).map((la, i) => gdot(G, la, LG.pts[1][i], C.key, 7, fin(f, tLegs)))}
          {gdot(G, LON[0], LON[1], C.key, 10)}{gdot(G, LAX[0], LAX[1], C.key, 10)}
          {gdot(G, BREST[0], BREST[1], C.key, 9, win(f, tR2 + 60, tR3 + 40))}{gdot(G, LIS[0], LIS[1], C.key, 9, win(f, tR2 + 60, tR3 + 40))}
          {plab(G, BREST[0], BREST[1], "Brest", win(f, tBL, tR3 + 40), 18, -30)}
          {plab(G, LIS[0], LIS[1], "Lisbon", win(f, tBL, tR3 + 40), 18, 34)}
          {plab(G, LON[0], LON[1], "London", fout(f, tR2) + fin(f, tR3 + 100), -18, -36, "end")}
          {plab(G, LAX[0], LAX[1], "Los Angeles", fout(f, tR2) + fin(f, tR3 + 100), 0, 136)}
          {fly > 0 && P.vis ? <PlaneIcon p={P.p} a={P.a} s={0.7} o={fout(f, tR2 - 20)} /> : null}
        </>; }} />
      <GlobeFrame id="s13k" zoom={0} disc={discOf(cam)} />
      <GSrc />
      <Svg>
        <Keyword f={f} text="why the longer route?" at={[XC, 110]} appear={0} out={t3 - 18} />
        {/* r1fix 2026-11-10 (review 1 S5): the question is not alone for 5 s */}
        <Keyword f={f} text="rhumb line: +11 %, +978 km" at={[XC, 200]} s={T.floor} appear={AT(k, 0, "longer route")} out={tR1 - 18} c={SLATE} />
        <Keyword f={f} text="three reasons" at={[XC, 110]} appear={t3} out={tR1 - 18} />
        <Keyword f={f} text="1 · steering" at={[XC, 110]} s={T.floor} appear={tR1} o={1 - 0.4 * fin(f, tR2)} />
        <Keyword f={f} text="2 · short trips" at={[XC, 180]} s={T.floor} appear={tR2} o={1 - 0.4 * fin(f, tR3)} />
        <Keyword f={f} text="3 · a ruler on a map" at={[XC, 250]} s={T.floor} appear={tR3} />
        {/* reason 1: one fixed dial against one that keeps turning */}
        <Compass c={[1240, 430]} r={80} brg={RH.brg} col={SLATE} o={r1o * fin(f, tSet - 10)} />
        <Compass c={[1540, 430]} r={80} brg={hd[hi]} o={r1o * fin(f, tNew)} />
        <Lbl x={1240} y={560} t="258.5°" c={SLATE} s={T.floor} a="middle" o={r1o * fin(f, tSet)} />
        <Lbl x={1540} y={560} t="312° → 214°" c={C.gold} s={T.floor} a="middle" o={r1o * fin(f, tNew)} />
        <TableIcon c={[1250, 700]} o={r1o * fin(f, tCalc)} />
        <Lbl x={1360} y={700} t="a lot of calculation" c={C.key} s={T.floor} o={r1o * fin(f, tCalc)} />
        {/* reason 2 */}
        <Lbl x={XC} y={380} t="Brest → Lisbon" c={C.key} s={T.floor} o={r2o * fin(f, tBL)} />
        {/* r1fix 2026-11-10 (review 1 M4): the magnifier sits left of its text (its handle crossed the old grey line) */}
        <Magnifier c={[1150, 740]} r={40} o={r2o * fin(f, tBLx)} />
        <Lbl x={1250} y={750} t="only ≈ 150 m longer" c={SLATE} s={T.floor} o={r2o * fin(f, tBLx)} />
        {/* reason 3: the Mercator chart, a ruler along the straight rhumb line and the 258.5° reading */}
        <MercMap id="s13" B={MB13} E={ME13} o={r3o * fin(f, tMerc)}
          inside={(P) => <path d={flatPath(P, D.mc.rh)} fill="none" stroke={SLATE} strokeWidth={6} />}
          over={(P) => { const a = P(cities[0], cities[1]), b = P(cities[2], cities[3]), dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), n: Pt = [-dy / L, dx / L];
            const rul = prog(f, tRuler, tRuler + 30);
            return <>
              <circle cx={a[0]} cy={a[1]} r={8} fill={C.key} /><circle cx={b[0]} cy={b[1]} r={8} fill={C.key} />
              <path d={`M ${a[0] + n[0] * 14} ${a[1] + n[1] * 14} L ${a[0] + n[0] * 14 + dx * rul} ${a[1] + n[1] * 14 + dy * rul} L ${a[0] + n[0] * 40 + dx * rul} ${a[1] + n[1] * 40 + dy * rul} L ${a[0] + n[0] * 40} ${a[1] + n[1] * 40} Z`}
                fill={C.gold} fillOpacity={0.35} stroke={C.gold} strokeWidth={3} opacity={fin(f, tRuler)} />
              <line x1={a[0]} y1={a[1]} x2={a[0]} y2={a[1] - 70} stroke={C.key} strokeWidth={3} strokeDasharray="8 6" opacity={fin(f, tAng)} />
              <path d={arcD(a, 52, 90, 90 - RH.brg)} fill="none" stroke={C.gold} strokeWidth={4} opacity={fin(f, tAng)} />
            </>; }} />
        <Lbl x={XC} y={MBf.y + MBf.h + 76} t="Mercator: straight, 258.5°" c={SLATE} s={T.floor} o={r3o * fin(f, tAng)} />
        <Keyword f={f} text="why straight: Part 7" at={[XC, 840]} s={T.floor} appear={tP7} c={C.gold} />
      </Svg>
      <SourceBelow text="Map: Natural Earth (Mercator)" pic={MBf} w={700} o={r3o * fin(f, tMerc)} name="s13 src map" />
      {/* r1fix 2026-11-10 (review 1 M4): the storyboard row — the two lengths (the s07 rule and the rhumb length, more digits) and their
          difference; the unvoiced flat estimate (√(1075² + 375²) ≈ 1139 km) is gone: beside "+150 m" it read as a 1-km difference */}
      <CalcStack f={f} x={XC} y={450} size={44} maxLines={3} o={r2o} rows={[
        { rhs: String.raw`\text{great circle}\approx1138.12\ \text{km}`, at: tBL + 10, c: C.gold, h: 58 },
        { rhs: String.raw`\text{rhumb line}\approx1138.27\ \text{km}`, at: AT(k, 7, "the rhumb line is"), c: SLATE, h: 58 },
        { rhs: String.raw`\text{difference}\approx0.15\ \text{km}=150\ \text{m}`, at: tBLx, c: SLATE, h: 58, glow: HL(f, tBLx) },
      ]} />
      {void [dim, tLegs]}
    </Scene>
  );
};

// ================================================================ s14 recap: one mini picture and one line per sentence (older ones at 60 %)
const cells: Pt[] = [[235, 175], [540, 175], [845, 175], [235, 455], [540, 455], [845, 455], [235, 735], [540, 735]];
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14_recap");
  // remake 2026-11-07 (R3): S7 + S8 are the two-sentence teaser (one beat: the Mercator mini + "Part 7: maps", then "care near the poles")
  const t = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((j) => SS(k, j));
  const op = (j: number) => fin(f, t[j]) * (j < 7 ? 1 - 0.4 * fin(f, t[j + 1]) : 1);
  const O2 = ortho(45, -55, cells[2], 115), O6 = ortho(45, -55, cells[6], 115);
  const D3 = scaleDisc(DISC, cells[3], 105);
  const MB = { x: cells[7][0] - 130, y: cells[7][1] - 70, w: 260, h: 0 }, ME = { x0: -130 * D2R, x1: 10 * D2R, y0: mercY(25), y1: mercY(68) };
  const gc = GC.filter((_, i) => i % 3 === 0), rh = RHP.filter((_, i) => i % 3 === 0);
  const plane = (O: ReturnType<typeof ortho>) => poly(Array.from({ length: 73 }, (_, i) => { const a = i * 5 * D2R;
    const n = D.plane.n as number[], r1 = RO.r1 as number[], v2 = [n[1] * r1[2] - n[2] * r1[1], n[2] * r1[0] - n[0] * r1[2], n[0] * r1[1] - n[1] * r1[0]];
    return O.pv([0, 1, 2].map((q) => r1[q] * Math.cos(a) + v2[q] * Math.sin(a))); })) + "Z";
  const hd = RO.head as number[];
  return (
    <Scene>
      <Svg>
        <g opacity={op(0)}>
          {[20, 40, 60].map((r) => <circle key={r} cx={cells[0][0]} cy={cells[0][1]} r={r * 1.6} fill="none" stroke={C.first} strokeWidth={3} />)}
          <Arrow p={[cells[0][0] + 70, cells[0][1]]} q={[cells[0][0] + 120, cells[0][1] - 40]} color={C.second} w={6} head={20} />
          <Arrow p={[cells[0][0] + 70, cells[0][1]]} q={[cells[0][0] + 110, cells[0][1] + 50]} color={C.second} w={6} head={20} />
        </g>
        <g opacity={op(1)}>
          <circle cx={cells[1][0]} cy={cells[1][1]} r={110} fill="#1f2c48" stroke={C.grid} strokeWidth={3} />
          <path d={arcD(cells[1], 110, 30, 55)} fill="none" stroke={C.first} strokeWidth={10} />
          <line x1={cells[1][0] - 80} y1={cells[1][1] - 40} x2={cells[1][0] + 80} y2={cells[1][1] - 40} stroke={C.first} strokeWidth={8} />
        </g>
        <g opacity={op(2)}>
          <OrthoGlobe O={O2} />
          <path d={plane(O2)} fill={C.key} fillOpacity={0.22} stroke={C.gold} strokeWidth={3} />
          <path d={opath(O2, gc)} fill="none" stroke={C.gold} strokeWidth={6} />
        </g>
        <g opacity={op(3)}><Disc V={D3} sig={1} route={1} sw={0.55} /></g>
        <g opacity={op(4)}>
          <path d={`M ${cells[4][0] - 120} ${cells[4][1] + 50} Q ${cells[4][0]} ${cells[4][1] - 110} ${cells[4][0] + 120} ${cells[4][1] + 50}`} fill="none" stroke={C.gold} strokeWidth={8} />
          <PlaneIcon p={[cells[4][0], cells[4][1] - 30]} s={0.8} />
          <circle cx={cells[4][0] - 120} cy={cells[4][1] + 50} r={9} fill={C.key} /><circle cx={cells[4][0] + 120} cy={cells[4][1] + 50} r={9} fill={C.key} />
        </g>
        <g opacity={op(5)}>
          <Compass c={[cells[5][0] - 60, cells[5][1]]} r={60} brg={RO.brg0} label={false} />
          <Compass c={[cells[5][0] + 80, cells[5][1]]} r={60} brg={RO.brg1} label={false} />
        </g>
        <g opacity={op(6)}>
          <OrthoGlobe O={O6} />
          <path d={opath(O6, gc)} fill="none" stroke={C.gold} strokeWidth={6} />
          <path d={opath(O6, rh)} fill="none" stroke={SLATE} strokeWidth={6} />
        </g>
        <MercMap id="s14" B={MB} E={ME} o={op(7)} inside={(P) => <path d={flatPath(P, D.mc.rh)} fill="none" stroke={SLATE} strokeWidth={5} />} />
        <Lbl x={cells[7][0] + 170} y={cells[7][1] - 10} t="?" c={C.gold} s={T.key} o={op(7)} />
        <Lbl x={XC} y={110} t="curvilinear coordinates" c={C.key} s={T.floor} o={op(0)} />
        <Lbl x={XC} y={290} t="great circle: the shortest way" c={C.gold} s={T.floor} o={op(2)} />
        <Lbl x={XC} y={560} t="heading 312° → 214°" c={C.key} s={T.floor} o={op(5)} />
        <Lbl x={XC} y={650} t="rhumb: one bearing · +11 %" c={SLATE} s={T.floor} o={op(6)} />
        <Lbl x={XC} y={740} t="Part 7: maps" c={C.gold} s={T.floor} o={op(7)} />
        <Lbl x={XC} y={815} t="care near the poles" c={C.key} s={T.floor} o={fin(f, AT(k, 8, "care near the poles"))} />
      </Svg>
      <TeX s={String.raw`h_\theta=r,\quad h_\varphi=a,\quad h_\lambda=a\cos\varphi`} x={XC} y={200} size={48} o={op(1)} />
      <TeX s={EQ_S14} x={XC} y={380} size={50} o={op(3)} />
      <TeX s={String.raw`\sigma\approx78.7^\circ,\quad d\approx8755\ \text{km}`} x={XC} y={470} size={48} o={op(4)} />
      {void [hd, SideCallout, H, D2R]}
    </Scene>
  );
};

// ================================================================ s15 the series end card (maths ending, HOUSE_STYLE §3)
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_end");
  const t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const thumb = (x: number, i: number) => {
    const O = ortho(45, -55, [x, 155], 62);   // Part 1 lessons B5: r 62 keeps the globe 23 px inside its box (was 70: 15 px)
    return (
      <g key={i} opacity={0.75}>
        <rect x={x - 150} y={70} width={300} height={170} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
        {i === 0 ? <><OrthoGlobe O={O} grat={0.25} coast={0.5} /><path d={opath(O, GC)} fill="none" stroke={C.gold} strokeWidth={4} /></> : null}
        {i === 1 ? <Compass c={[x, 155]} r={60} brg={RO.brg0} label={false} /> : null}
        {i === 2 ? <><OrthoGlobe O={O} grat={0.25} coast={0.5} /><path d={opath(O, RHP)} fill="none" stroke={SLATE} strokeWidth={4} /></> : null}
        {i === 3 ? <MercMap id="s15" B={{ x: x - 120, y: 95, w: 240, h: 0 }} E={{ x0: -130 * D2R, x1: 10 * D2R, y0: mercY(25), y1: mercY(68) }}
          inside={(P) => <path d={flatPath(P, D.mc.rh)} fill="none" stroke={SLATE} strokeWidth={4} />} /> : null}
      </g>
    );
  };
  const rel = ["vectors and index notation", "dot product", "cross product", "derivatives and Taylor series", "gradient", "contour maps", "curl", "material derivative", "Coriolis", "reading weather maps"];
  const COLX = [200, 1000], ROWY = (r: number) => 648 + r * 48;
  rel.forEach((tt, i) => { if (COLX[Math.floor(i / 5)] + textW(tt, T.floor) > (COLX[Math.floor(i / 5) + 1] ?? 1840) - 10) throw new Error(`end card: "${tt}" too wide`); });
  return (
    <Scene>
      {/* remake 2026-11-07 (R3): the picture fades out with the music over the 2.5-s silent hold (= Part 4's s29) */}
      <Svg o={1 - ramp(f, LEN(k) - HOLD, LEN(k) - 4)}>
        <g opacity={fin(f, 6)}>{[420, 760, 1100, 1440].map((x, i) => thumb(x, i))}</g>
        <Lbl x={960} y={315} t="a series of maths tutorials" c={C.key} s={T.calc} a="middle" o={fin(f, 10)} />
        <Lbl x={960} y={395} t="atmospheric science · meteorology · fluid dynamics" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "atmospheric science"))} />
        <g opacity={fin(f, t2)}><Notebook x={300} y={482} s={0.4} /><Lbl x={370} y={490} t="coordinates notebook" c={C.ink} s={T.key} /></g>
        <g opacity={fin(f, tOther)}>
          {[0, 1, 2].map((i) => <Notebook key={i} x={260 + i * 30} y={575 - i * 10} s={0.24} c={[C.second, C.gold, C.muted][i]} o={0.9} />)}
          <Lbl x={370} y={565} t="notebooks for the other maths concepts" c={C.key} s={T.key} />
        </g>
        <g opacity={fin(f, tOther + 20) * 0.8}>
          {rel.map((tt, i) => <Lbl key={tt} x={COLX[Math.floor(i / 5)]} y={ROWY(i % 5)} t={tt} c={C.muted} s={T.floor} b={false} />)}
        </g>
      </Svg>
    </Scene>
  );
};

export const SCENES_C: Record<string, React.FC> = { s11_route_shape: S11, s12_rhumb: S12, s13_why_rhumb: S13, s14_recap: S14, s15_end: S15 };
void [CurvedLink, add, clamp, mix, dP, SGN, LEN, Disc, PlaneIcon, sang];
