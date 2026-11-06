// ch00_coordinates_maps scenes s16-s23: from the turning globe up over the North Pole and flat into the polar stereographic map
// (the morphing Earth, then the pixel-aligned SVG polar map), the place tour, the 10 hPa polar vortex of 21 Jan 2026 (height
// field, contours, wind trails from advect_on_sphere), east = round and north = in, the moved origin on a flat ring, the vortex
// about the pole vs about its own centre, the recap and the series end card. Numbers from data/mp.json only.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Pt, pulse, textW } from "../house/kit/draw";
import { SourceBelow } from "../house/kit/frame";
import { AnimatedWindArrow } from "../house/kit/wind";
import { Notebook } from "../house/kit/icons";
import { CamState } from "./kit_mp/cam";
import {
  AT, Arrow, CalcStack, D, D2R, H, HeightBar, K, Keyword, LEN, Lbl, MorphView, PolarMap, ProjMap, PV, R_PS, RINGS, SRC_VX, SS, Scene, SideCallout, SpokeLabels,
  Svg, TeX, VP, VPIC, XC, fin, fout, llD, mapPt, mix, morphD, poly, polarPos, prog, rhoPS, win, BREST,
} from "./mp_lib";
import { Ladder } from "./mp_sB";
import { EQ_S19, EQ_S20, EQ_S22 } from "./mp_eq";

const VX = D.vortex, PL = D.places, WH = D.wheel;
const CHECK_C: [string, number, number, number][] = [
  ["c lat", VX.c[0], 72.9, 0.01], ["c lon", VX.c[1], 44.3, 0.05], ["c lat (73)", VX.c[0], 73, 0.15], ["c lon (44)", VX.c[1], 44, 0.3], ["cz", VX.cz / 1e3, 28.6, 0.01],
  ["z30", VX.z30 / 1e3, 30.7, 0.03], ["vmax", VX.vmax, 79, 0.05], ["kmh", 79 * 3.6, 284, 0.5], ["dpole", VX.dpole, 1900, 3], ["vtP", VX.vtP, 17.5, 0.01],
  ["rmsP", VX.rmsP, 33, 0.1], ["ratP", VX.rmsP / VX.vtP, 1.9, 0.02], ["vtC", VX.vtC, 47, 0.4], ["rmsC", VX.rmsC, 20, 0.2], ["ratC", VX.rmsC / VX.vtC, 0.4, 0.02],
  ["night", VX.night, 69.8, 0.05], ["dP", WH.dP, 1118, 0.1], ["ur", WH.ur, -4.5, 0.03], ["ut", WH.ut, 8.9, 0.05], ["rx", 500 / WH.dP, 0.447, 5e-4], ["ry", 1000 / WH.dP, 0.894, 5e-4],
  ["ring 75", D.ps.rings_km["75"], 1565, 0.5], ["ring 30", D.ps.rings_km["30"], 6864, 0.5],
];
CHECK_C.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
const SRC_PS = "Image: NASA Blue Marble NG · Natural Earth";

// ================================================================ s16 the turning globe → above the North Pole → the polar stereographic map
const FULL = { x: 0, y: 0, w: 1920, h: 1080 };
/** camera at elevation `el` above the equator plane over longitude 0, `dist` Earth radii from the centre; north up the screen
 * (straight above the pole: longitude 0 down, 90° E right) */
const riseCam = (el: number, dist: number): CamState => {
  const e = el * D2R;
  return { pos: [0, dist * Math.sin(e), dist * Math.cos(e)], target: [0, 0, 0], up: [0, Math.cos(e), -Math.sin(e)], fov: 35, pp: [VP.cx, VP.cy] };
};
// the camera distance that draws the plane y = 1 at VP.s px per Earth radius
const D_FLAT = 1 + 540 / (VP.s * Math.tan(17.5 * D2R));
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16_globe_to_pole");
  const t3 = SS(k, 3), tRise = AT(k, 3, "rise up"), t4 = SS(k, 4), tRings = AT(k, 4, "rings round the pole"), tSpk = AT(k, 4, "spokes, like"), t5 = SS(k, 5),
    t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11), t12 = SS(k, 12), t13 = SS(k, 13);
  const tFl = AT(k, 5, "flatten"), tDone = tFl + 90;
  const orb = { az: 0, el: mix(20, 90, prog(f, tRise, tRise + 150)), dist: mix(4.8, D_FLAT, prog(f, tFl, tDone)), target: [0, 0, 0] };
  const spin = -120 * (1 - prog(f, 0, tRise - 10));
  const mt = prog(f, tFl, tDone);
  const st = riseCam(orb.el, orb.dist);
  const flat = f >= tFl;
  const pos = polarPos(flat ? (f - tFl) / (tDone - tFl) : 0, spin);
  const posE = (la: number, lo: number, lc: number) => pos(la, lo, lc);
  const clipR = flat ? mix(900, R_PS * VP.s, mt) : null;
  const o3 = fout(f, tDone + 6, 14), oMap = fin(f, tDone, 14);
  const ringO = fin(f, tRings, 15), spkO = fin(f, tSpk, 15);
  const ringD = (la: number) => { const fl: number[] = []; for (let lo = -180; lo <= 180; lo += 4) fl.push(la, lo); return morphD(st, FULL, posE, fl, !flat); };
  const spokeD = (lo: number) => { const fl: number[] = []; for (let la = D.ps.edge; la <= 90; la += 2) fl.push(la, lo); return morphD(st, FULL, posE, fl, !flat); };
  const lblO = (at: number) => fin(f, at);
  const arc = poly(Array.from({ length: 40 }, (_, i) => mapPt(VP, "ps", 60, -30 + (100 * i) / 39)));
  const arcEnd = mapPt(VP, "ps", 60, 70), arcPrev = mapPt(VP, "ps", 60, 66);
  return (
    <Scene>
      <MorphView st={st} box={FULL} pos={posE} o={o3} lat0={flat ? 10 : -90} lat1={90} clipR={clipR} />
      <Svg o={o3}>
        <path d={(D.coast as number[][]).map((L) => morphD(st, FULL, posE, L, !flat)).join("")} fill="none" stroke={C.key} strokeOpacity={0.45} strokeWidth={1.5} />
        <g opacity={ringO}>{RINGS.map((la) => <path key={la} d={ringD(la)} fill="none" stroke={C.local} strokeWidth={3} />)}</g>
        <g opacity={spkO}>{Array.from({ length: 12 }, (_, i) => i * 30 - 180).map((lo) => <path key={lo} d={spokeD(lo)} fill="none" stroke={C.local} strokeWidth={2.5} />)}</g>
      </Svg>
      <PolarMap f={f} o={oMap} rings={0.75} spokes={0.6} ringLbl={0} dimBase={0.15} id="s16p" />
      <Svg>
        <circle cx={VP.cx} cy={VP.cy} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, t6)} />
        <g data-lc-maplabel="1">{RINGS.map((la, i) => { const q = ringLbl(la); return <Lbl key={la} x={q[0]} y={q[1]} t={`${la}°`} c={C.key} s={T.floor} a="middle"
          o={oMap * lblO(AT(k, 7, ["seventy five", "sixty", "forty five", "thirty degrees"][i]))} />; })}</g>
        <SpokeLabels o={[oMap * lblO(AT(k, 9, "Zero degrees")), oMap * lblO(AT(k, 10, "Ninety degrees east")), oMap * lblO(AT(k, 10, "a hundred and eighty")),
          oMap * lblO(AT(k, 10, "ninety degrees west"))]} />
        <path d={arc} fill="none" stroke={C.gold} strokeWidth={7} opacity={fin(f, t11)} />
        <Arrow p={arcPrev} q={arcEnd} color={C.gold} w={7} head={28} o={fin(f, t11)} />
        <Keyword f={f} text="one more map: from above a pole" at={[XC, 160]} s={T.floor} appear={0} out={t3 - 18} />
        <Keyword f={f} text="rise above the North Pole" at={[XC, 160]} s={T.floor} appear={t3} out={t4 - 18} />
        <Keyword f={f} text="rings = latitude" at={[XC, 160]} appear={tRings} />
        <Keyword f={f} text="spokes = longitude" at={[XC, 240]} appear={tSpk} />
        <Keyword f={f} text="flatten into a map" at={[XC, 360]} s={T.floor} appear={t5} out={t8 - 18} />
        <Keyword f={f} text="east = anticlockwise" at={[XC, 360]} s={T.floor} appear={t11} out={t12 - 18} c={C.gold} />
        <Lbl x={XC} y={420} t="(seen from above the North Pole)" c={C.muted} s={T.floor} b={false} o={win(f, t11 + 8, t12 - 18)} />
        <Keyword f={f} text="polar coordinates again" at={[XC, 360]} appear={t12} />
        <Lbl x={XC} y={430} t="r grows away from the pole" c={C.key} s={T.floor} o={fin(f, AT(k, 12, "the distance from the middle"))} />
        <Lbl x={XC} y={490} t="angle: the longitude" c={C.key} s={T.floor} o={fin(f, AT(k, 12, "the angle round"))} />
        <Keyword f={f} text="polar stereographic" at={[XC, 620]} appear={AT(k, 13, "polar stereographic")} c={C.gold} />
        <Lbl x={XC} y={690} t="true to scale at 60° N" c={C.key} s={T.floor} o={fin(f, AT(k, 13, "true to scale"))} />
      </Svg>
      <SourceBelow text={SRC_PS} pic={VPIC} w={760} name="s16 src" />
    </Scene>
  );
};
/** ring labels on the 48° screen ray (upper right of the pole), clear of the tour's place labels */
const ringLbl = (la: number): Pt => { const r = rhoPS(la) * VP.s, a = 48 * D2R; return [VP.cx + r * Math.cos(a), VP.cy - r * Math.sin(a)]; };
const RingLabels: React.FC<{ o: number }> = ({ o }) => o <= 0 ? null :
  <g data-lc-maplabel="1" opacity={o}>{RINGS.map((la) => { const q = ringLbl(la); return <Lbl key={la} x={q[0]} y={q[1]} t={`${la}°`} c={C.key} s={T.floor} a="middle" />; })}</g>;

// ================================================================ s17 the place tour (ring first, then spoke)
type PlaceLbl = { key: string; at: Pt; a: "start" | "end"; italic?: boolean };
/** label spots chosen by hand on the 1920 × 1080 frame (polar map centre 540, 430; 270 px per Earth radius), each joined to its
 * dot by a short leader; no two labels share a 44-px band where they overlap in x (checked below) */
const PLBL: PlaceLbl[] = [
  { key: "brest", at: [550, 662], a: "start" }, { key: "iceland", at: [440, 582], a: "end" }, { key: "greenland", at: [425, 506], a: "end" },
  { key: "scandinavia", at: [640, 566], a: "start" }, { key: "longyearbyen", at: [640, 506], a: "start" }, { key: "barents", at: [660, 446], a: "start", italic: true },
  { key: "siberia", at: [690, 384], a: "start" }, { key: "bering", at: [530, 224], a: "end", italic: true }, { key: "alaska", at: [425, 278], a: "end" },
  { key: "canada", at: [350, 398], a: "end" }, { key: "hudson", at: [380, 448], a: "end", italic: true }, { key: "la", at: [322, 332], a: "start" },
];
(() => {  // labels: no overlap with each other or with the ring labels
  const box = (p: PlaceLbl) => { const w = textW(PL[p.key].name, T.floor); const x0 = p.a === "start" ? p.at[0] : p.at[0] - w; return [x0, p.at[1] - 22, x0 + w, p.at[1] + 22]; };
  const rl = RINGS.map((la) => { const q = ringLbl(la); return [q[0] - 36, q[1] - 22, q[0] + 36, q[1] + 22]; });
  const all = [...PLBL.map(box), ...rl];
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const A = all[i], B = all[j];
    if (Math.min(A[2], B[2]) - Math.max(A[0], B[0]) > 4 && Math.min(A[3], B[3]) - Math.max(A[1], B[1]) > 2) throw new Error(`s17 labels ${i} and ${j} overlap`);
  }
})();
const PlaceMark: React.FC<{ p: PlaceLbl; o: number }> = ({ p, o }) => {
  if (o <= 0) return null;
  const P = PL[p.key], q = mapPt(VP, "ps", P.ll[0], P.ll[1]);
  const w = textW(P.name, T.floor), lx = p.a === "start" ? p.at[0] - 6 : p.at[0] + 6;
  void w;
  return <g opacity={o} data-lc-maplabel="1">
    <line x1={q[0]} y1={q[1]} x2={lx} y2={p.at[1]} stroke={C.key} strokeWidth={2} opacity={0.7} />
    <circle cx={q[0]} cy={q[1]} r={9} fill={P.kind === "sea" ? C.first : C.gold} stroke={C.bg} strokeWidth={3} />
    <Lbl x={p.at[0]} y={p.at[1]} t={P.name} c={C.key} s={T.floor} a={p.a} italic={p.italic} />
  </g>;
};
/** the tour's timing (frames in s17), also used by s18 for the labels that stay */
const tourTimes = (k: number) => ({
  brest: AT(k, 2, "is Brest"), iceland: AT(k, 3, "is Iceland"), greenland: AT(k, 4, "Greenland"), scandinavia: AT(k, 5, "Scandinavia"), longyearbyen: AT(k, 6, "is Longyearbyen"),
  barents: AT(k, 7, "the Barents Sea"), siberia: AT(k, 8, "stretches Siberia"), bering: AT(k, 9, "the Bering Strait"), alaska: AT(k, 9, "with Alaska"), canada: AT(k, 10, "is Canada"),
  hudson: AT(k, 10, "with Hudson Bay"), la: AT(k, 12, "Just inside"),
} as Record<string, number>);
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_where_is_what");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11),
    t12 = SS(k, 12);
  const TT = tourTimes(k);
  // highlights: [from, to, rings, spokes]
  const HL: [number, number, number[], number[]][] = [
    [AT(k, 2, "forty five degree ring"), AT(k, 2, "zero spoke"), [45], []], [AT(k, 2, "zero spoke"), t3, [], [0]], [AT(k, 3, "sixty degree ring"), t4, [60], []],
    [t5, t6, [], [0]], [AT(k, 8, "ninety degrees east"), t9, [], [90]], [AT(k, 9, "a hundred and eighty degrees"), t10, [], [180]], [AT(k, 10, "ninety degrees west"), t11, [], [-90]],
    [AT(k, 12, "thirty degree ring"), AT(k, 12, "between the ninety"), [30], []], [AT(k, 12, "between the ninety"), LEN(k), [30], [-90, 180]],
  ];
  const cur = HL.find(([a, b]) => f >= a && f < b + 10);
  const hiO = cur ? win(f, cur[0], cur[1], 10) : 0;
  const coords: [string, string, number, number][] = [
    ["Brest", "48.4° N, 4.5° W", AT(k, 2, "at forty eight"), t3], ["Iceland", "65° N, 19° W", AT(k, 3, "sixty five"), t4], ["Greenland", "72° N, 40° W", AT(k, 4, "seventy two"), t5],
    ["Scandinavia", "", t5, t6], ["Longyearbyen", "78.2° N, 15.6° E", AT(k, 6, "seventy eight"), t7], ["Barents Sea", "75° N, 40° E", AT(k, 7, "seventy five"), t8],
    ["Siberia", "along 90° E", AT(k, 8, "ninety degrees east"), t9], ["Alaska", "65° N, 150° W", AT(k, 9, "sixty five degrees north"), t10],
    ["Hudson Bay", "60° N", AT(k, 10, "about sixty"), t11], ["Los Angeles", "34° N, 118° W", AT(k, 11, "thirty four"), LEN(k)],
  ];
  return (
    <Scene>
      <PolarMap f={f} rings={0.75} spokes={0.6} dimBase={0.15} hiRing={cur ? cur[2] : []} hiSpoke={cur ? cur[3] : []} hiO={hiO} id="s17p"
        children={() => <path d={(D.gl_ps as number[][]).map((L) => llD(VP, "ps", L, undefined, 0, 89.9, true)).join("")} fill="none" stroke={C.first} strokeWidth={4}
          opacity={win(f, TT.greenland, t5 + 30, 14)} />} />
      <Svg>
        <RingLabels o={1} />
        <SpokeLabels o={[1, 1, 1, 1]} />
        {PLBL.map((p) => <PlaceMark key={p.key} p={p} o={fin(f, TT[p.key])} />)}
        <Keyword f={f} text="a short tour" at={[XC, 160]} appear={0} out={t1 - 18} />
        <Keyword f={f} text="ring: latitude · spoke: longitude" at={[XC, 160]} s={T.floor} appear={t1} out={t2 - 18} />
        {coords.map(([nm, c, a, b], i) => <g key={i}>
          <Keyword f={f} text={nm} at={[XC, 300]} appear={a} out={b - 18} />
          {c ? <Lbl x={XC} y={390} t={c} c={C.gold} s={T.calc} o={win(f, a + 6, b - 18)} /> : null}
        </g>)}
        <Lbl x={XC + 520} y={390} t="?" c={C.gold} s={T.calc} o={win(f, AT(k, 11, "thirty four") + 30, t12)} />
      </Svg>
      <SourceBelow text={SRC_PS} pic={VPIC} w={760} name="s17 src" />
    </Scene>
  );
};

// ================================================================ s18 the 10 hPa polar vortex, 21 Jan 2026
/** contour labels: one per level, on its line where it crosses the 225° screen ray (lower left, where the place labels have gone) */
const CONT_LBL: { t: string; at: Pt }[] = (() => {
  const out: { t: string; at: Pt }[] = [];
  const ang = 228 * D2R, ux = Math.cos(ang), uy = -Math.sin(ang);
  for (const c of VX.contours as { level: number; lines: number[][] }[]) {
    let best: Pt | null = null, bd = 1e9;
    for (const L of c.lines) for (let i = 0; i < L.length; i += 2) {
      const q = mapPt(VP, "ps", L[i], L[i + 1]), dx = q[0] - VP.cx, dy = q[1] - VP.cy, along = dx * ux + dy * uy, perp = Math.abs(dx * uy - dy * ux);
      if (along < 60 || Math.hypot(dx, dy) > 0.92 * R_PS * VP.s) continue;
      if (perp < bd) { bd = perp; best = q; }
    }
    if (best && bd < 14 && out.every((o) => Math.hypot(o.at[0] - best![0], o.at[1] - best![1]) > 60)) out.push({ t: (c.level / 1000).toFixed(1), at: best });
  }
  return out;
})();
const cross = (q: Pt, o: number, s = 18) => o <= 0 ? null : <g opacity={o} stroke={C.gold} strokeWidth={8} strokeLinecap="round">
  <line x1={q[0] - s} y1={q[1] - s} x2={q[0] + s} y2={q[1] + s} /><line x1={q[0] + s} y1={q[1] - s} x2={q[0] - s} y2={q[1] + s} /></g>;
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_vortex");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), tShow = AT(k, 3, "this map shows it"), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8),
    t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11);
  const lblO = mix(1, 0.4, fin(f, t5, 30)) * fout(f, t5 + 30, 60);
  const cz = mapPt(VP, "ps", VX.c[0], VX.c[1]), z30 = mapPt(VP, "ps", 30, 0);
  const bright = (la: number) => (f >= t10 ? (la >= 55 && la <= 66 ? 1.5 : 0.6) : 1);
  return (
    <Scene>
      <PolarMap f={f} field={fin(f, tShow, 30)} cont={fin(f, t4, 20)} rings={mix(0.75, 0.45, fin(f, tShow))} spokes={mix(0.6, 0.35, fin(f, tShow))} dimBase={0.15}
        trails={fin(f, AT(k, 8, "let the air move"), 20)} trailFr={f} bright={bright} hiRing={[30]} hiO={pulse(f, AT(k, 7, "thirty point seven"), 50)} id="s18p"
        children={() => <>
          {CONT_LBL.map((q) => <g key={q.t} data-lc-maplabel="1" opacity={fin(f, t4 + 20)}><Lbl x={q.at[0]} y={q.at[1]} t={q.t} c={C.key} s={T.floor} a="middle" /></g>)}
          {cross(cz, fin(f, t6))}
          <circle cx={z30[0]} cy={z30[1]} r={10} fill={C.gold} opacity={fin(f, AT(k, 7, "thirty point seven"))} />
        </>} />
      <Svg>
        <RingLabels o={mix(1, 0.6, fin(f, tShow))} />
        <SpokeLabels o={[1, 1, 1, 1]} />
        {PLBL.map((p) => <PlaceMark key={p.key} p={p} o={lblO} />)}
        <Keyword f={f} text="real weather on this map" at={[XC, 110]} appear={0} out={t1 - 18} />
        <Keyword f={f} text="pressure falls as we go up" at={[XC, 110]} s={T.floor} appear={t1} out={t2 - 18} />
        <Keyword f={f} text="stratosphere: ≈ 30 km up" at={[XC, 110]} s={T.floor} appear={t2} out={t3 - 18} />
        <Lbl x={XC} y={180} t="10 hPa ≈ 1/100 of ground pressure" c={C.key} s={T.floor} o={win(f, AT(k, 2, "only ten"), t3 - 18)} />
        <Keyword f={f} text="height of the 10 hPa surface" at={[XC, 110]} s={T.floor} appear={t3} />
        <Lbl x={XC} y={180} t="21 Jan 2026" c={C.muted} s={T.floor} b={false} o={fin(f, AT(k, 3, "twenty first"))} />
        <HeightBar x={XC + 20} y={300} o={fin(f, tShow, 20)} />
        <Lbl x={XC} y={430} t="lines every 400 m" c={C.key} s={T.floor} o={fin(f, AT(k, 4, "every four hundred"))} />
        <SideCallout f={f} lines="≈ 28.6 km" at={[XC + 14, 520]} appear={AT(k, 6, "twenty eight")} target={[cz[0] + 20, cz[1] - 6]} c={C.gold} bend={20} />
        <Lbl x={XC} y={590} t="73° N, 44° E: Barents Sea" c={C.muted} s={T.floor} b={false} o={fin(f, AT(k, 6, "seventy three"))} />
        <SideCallout f={f} lines="≈ 30.7 km along 30° N" at={[XC + 14, 670]} appear={AT(k, 7, "thirty point seven")} target={[z30[0] + 14, z30[1]]} c={C.gold} bend={-20} />
        <Keyword f={f} text="stratospheric polar vortex" at={[XC, 820]} appear={AT(k, 11, "stratospheric polar vortex")} c={C.gold} />
      </Svg>
      <TeX s={String.raw`10\ \text{hPa}\div1013\ \text{hPa}\approx0.01`} x={XC} y={250} size={50} c={C.key} o={win(f, AT(k, 2, "a hundredth"), t3 - 18)} />
      <TeX s={String.raw`79\ \text{m/s}\times3.6\approx284\ \text{km/h}`} x={XC} y={750} size={58} c={C.key} o={fin(f, AT(k, 10, "nearly eighty")) * fout(f, t11 - 10)} />
      <SourceBelow text={SRC_VX} pic={VPIC} w={760} name="s18 src" />
    </Scene>
  );
};

// ================================================================ s19 east = round (θ̂), north = in (−r̂); westerlies anticlockwise; polar night
const S19: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19_vortex_components");
  const t1 = SS(k, 1), t2 = SS(k, 2), tTh = AT(k, 2, "theta hat"), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10);
  const P0 = mapPt(VP, "ps", 60, -90), L = 120;
  const rr: Pt = [(P0[0] - VP.cx), (P0[1] - VP.cy)], rn = Math.hypot(rr[0], rr[1]), rh: Pt = [rr[0] / rn, rr[1] / rn], th: Pt = [rh[1], -rh[0]];
  // the map's east and north at P0 from the JS mirror (a small step east / north), checked to lie along θ̂ and −r̂
  const pe = mapPt(VP, "ps", 60, -89.99), pn = mapPt(VP, "ps", 60.01, -90);
  const eu: Pt = [(pe[0] - P0[0]) / Math.hypot(pe[0] - P0[0], pe[1] - P0[1]), (pe[1] - P0[1]) / Math.hypot(pe[0] - P0[0], pe[1] - P0[1])];
  const nu: Pt = [(pn[0] - P0[0]) / Math.hypot(pn[0] - P0[0], pn[1] - P0[1]), (pn[1] - P0[1]) / Math.hypot(pn[0] - P0[0], pn[1] - P0[1])];
  if (Math.abs(eu[0] * th[0] + eu[1] * th[1] - 1) > 1e-6 || Math.abs(nu[0] * rh[0] + nu[1] * rh[1] + 1) > 1e-6) throw new Error("s19: east ∦ θ̂ or north ∦ −r̂");
  const tip = (u: Pt, l = L): Pt => [P0[0] + u[0] * l, P0[1] + u[1] * l];
  const arc = poly(Array.from({ length: 40 }, (_, i) => mapPt(VP, "ps", 60, -150 + (110 * i) / 39)));
  const nightR = rhoPS(VX.night) * VP.s;
  return (
    <Scene>
      <PolarMap f={f} field={0.6} cont={0.5} rings={0.45} spokes={0.35} dimBase={0.15} trails={0.8} trailFr={Math.round(f * 0.5)} id="s19p"
        children={() => <circle cx={VP.cx} cy={VP.cy} r={nightR} fill="#0b1020" opacity={0.55 * fin(f, AT(k, 10, "long winter night"), 20)} stroke={C.local} strokeWidth={3} strokeDasharray="10 8" />} />
      <Svg>
        <RingLabels o={0.6} />
        <SpokeLabels o={[1, 1, 1, 1]} />
        <circle cx={P0[0]} cy={P0[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, t1)} />
        <Arrow p={P0} q={tip(eu)} color={C.second} w={10} head={36} o={fin(f, t1)} />
        <Arrow p={P0} q={tip(nu)} color={C.second} w={10} head={36} o={fin(f, t1 + 15)} />
        <Arrow p={P0} q={tip(th, 90)} color={C.local} w={6} head={26} o={win(f, tTh, t4) * 0.95} dash="10 6" />
        <Arrow p={P0} q={tip(rh, 100)} color={C.local} w={6} head={26} o={fin(f, t4)} dash="10 6" />
        <path d={arc} fill="none" stroke={C.gold} strokeWidth={7} opacity={win(f, AT(k, 2, "anticlockwise"), t3) + fin(f, t8) * fout(f, t9 + 30)} />
        <Lbl x={1640} y={300} t="same ✓" c={C.gold} s={T.key} o={win(f, tTh + 20, t5)} />
        <Keyword f={f} text="the map's polar coordinates" at={[XC, 110]} appear={0} out={t2 - 18} />
        <Keyword f={f} text="east = round (anticlockwise)" at={[XC, 110]} s={T.floor} appear={t2} out={t8 - 18} />
        <Keyword f={f} text="north = in, towards the pole" at={[XC, 190]} s={T.floor} appear={t3} out={t8 - 18} />
        <Keyword f={f} text="westerlies: anticlockwise" at={[XC, 110]} appear={t8} out={t10 - 18} c={C.gold} />
        <g opacity={fin(f, t9)}>
          <Lbl x={XC} y={470} t="hurricane ≈ 100 km" c={C.key} s={T.floor} />
          <rect x={XC} y={500} width={12} height={22} fill={C.first} />
          <Lbl x={XC} y={570} t="polar vortex: thousands of km" c={C.key} s={T.floor} />
          <rect x={XC} y={600} width={700} height={22} fill={C.first} opacity={0.75} />
        </g>
        <Keyword f={f} text="formed by the long polar night" at={[XC, 110]} s={T.floor} appear={t10} />
        <Lbl x={XC} y={660} t="dark: the polar night, 21 Jan" c={C.muted} s={T.floor} b={false} o={fin(f, AT(k, 10, "long winter night"))} />
        <HeightBar x={XC + 20} y={770} o={1} />
      </Svg>
      <TeX s={H.i} x={tip(eu, L + 36)[0]} y={tip(eu, L + 36)[1]} size={54} c={C.second} ax={0.5} halo o={fin(f, t1)} />
      <TeX s={H.j} x={tip(nu, L + 36)[0]} y={tip(nu, L + 36)[1]} size={54} c={C.second} ax={0.5} halo o={fin(f, t1 + 15)} />
      <TeX s={H.r} x={tip(rh, 140)[0]} y={tip(rh, 140)[1]} size={54} c={C.local} ax={0.5} halo o={fin(f, t4)} />
      <TeX s={String.raw`\mathbf i=\hat{\boldsymbol\theta},\qquad \mathbf j=-\hat{\mathbf r}`} x={XC} y={290} size={64} o={fin(f, t5)} />
      <TeX s={EQ_S19} x={XC} y={380} size={64} c={C.gold} o={fin(f, t7)} />
      <SourceBelow text={SRC_VX} pic={VPIC} w={760} name="s19 src" />
    </Scene>
  );
};

// ================================================================ s20 a flat ring of air, the origin moved 500 km west, one point by hand
const KM = 0.25;                                               // px per km
const C20: Pt = [620, 480], R20 = WH.R_km * KM;
const S20: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20_origin_wheel");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10), t11 = SS(k, 11),
    t12 = SS(k, 12), t13 = SS(k, 13), t14 = SS(k, 14), t15 = SS(k, 15), t16 = SS(k, 16);
  const sh = prog(f, t5 + 20, t5 + 80);
  const O: Pt = [C20[0] - WH.shift_km * KM * sh, C20[1]];
  const P: Pt = [C20[0], C20[1] - R20];
  const rr: Pt = [P[0] - O[0], P[1] - O[1]], n = Math.hypot(rr[0], rr[1]) || 1, rh: Pt = [rr[0] / n, rr[1] / n], th: Pt = [rh[1], -rh[0]];
  const W = 12;                                                // px per m/s
  const u: Pt = [-WH.U, 0];
  const ur = u[0] * rh[0] - u[1] * rh[1], ut = u[0] * th[0] - u[1] * th[1];   // screen y is down: v (north) = −(screen y)
  if (sh >= 1 && (Math.abs(ur - WH.ur) > 1e-6 || Math.abs(ut - WH.ut) > 1e-6)) throw new Error(`s20: u_r ${ur}, u_θ ${ut} vs data ${WH.ur}, ${WH.ut}`);
  const arrows = Array.from({ length: 10 }, (_, i) => { const a = (i * 36 + 18) * D2R, q: Pt = [C20[0] + R20 * Math.cos(a), C20[1] - R20 * Math.sin(a)], tg: Pt = [-Math.sin(a), -Math.cos(a)];
    return { q, tg }; });
  const extra = [210, 270, 330].map((deg) => { const a = deg * D2R, q: Pt = [C20[0] + R20 * Math.cos(a), C20[1] - R20 * Math.sin(a)];
    const wv: Pt = [-Math.sin(a) * WH.U, Math.cos(a) * WH.U];                         // the ring's wind there (east, north), anticlockwise
    const r2: Pt = [q[0] - O[0], -(q[1] - O[1])], nn = Math.hypot(r2[0], r2[1]); const rhat: Pt = [r2[0] / nn, r2[1] / nn]; const vr = wv[0] * rhat[0] + wv[1] * rhat[1];
    return { q, rhat, vr }; });
  const band = (from: Pt, dir: Pt, val: number, c: string, o: number) => o <= 0 ? null : <line x1={from[0]} y1={from[1]} x2={from[0] + dir[0] * val * W} y2={from[1] + dir[1] * val * W}
    stroke={c} strokeWidth={20} strokeOpacity={0.55} opacity={o} strokeLinecap="butt" />;
  return (
    <Scene>
      <Svg>
        <circle cx={C20[0]} cy={C20[1]} r={R20} fill="none" stroke={C.first} strokeWidth={3} opacity={0.6} />
        {/* Part 1 lessons D1: the full winds are ink (teal = the round part u_θ, rose = the in/out part u_r) */}
        {arrows.map((A, i) => <AnimatedWindArrow key={i} from={A.q} to={[A.q[0] + A.tg[0] * 70, A.q[1] + A.tg[1] * 70]} speed={WH.U} f={f} c={C.ink} px={7} head={26} o={fin(f, t2) * fout(f, t7, 20) + 0.35 * fin(f, t7)} />)}
        <circle cx={C20[0]} cy={C20[1]} r={9} fill={C.key} />
        <line x1={C20[0]} y1={C20[1]} x2={C20[0] + R20} y2={C20[1]} stroke={C.muted} strokeWidth={3} strokeDasharray="10 8" opacity={win(f, t2, t5)} />
        <Lbl x={C20[0] + R20 / 2} y={C20[1] + 32} t="1000 km" c={C.muted} s={T.floor} a="middle" o={win(f, AT(k, 2, "a thousand"), t5)} />
        {/* the origin and the moved origin */}
        <circle cx={C20[0]} cy={C20[1]} r={16} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, t3) * mix(1, 0.35, sh)} />
        <circle cx={O[0]} cy={O[1]} r={12} fill={C.gold} opacity={fin(f, t5)} />
        <Arrow p={[C20[0] - 6, C20[1] + 70]} q={[C20[0] - WH.shift_km * KM, C20[1] + 70]} color={C.gold} w={6} head={24} o={win(f, t5 + 10, t8)} />
        <Lbl x={C20[0] - (WH.shift_km * KM) / 2} y={C20[1] + 112} t="500 km west" c={C.gold} s={T.floor} a="middle" o={win(f, t5 + 10, t8)} />
        {/* origin at the centre: r̂ and θ̂ at the top point */}
        <g opacity={win(f, t3, t5)}>
          <Arrow p={P} q={[P[0], P[1] - 100]} color={C.second} w={8} head={30} />
          <Arrow p={P} q={[P[0] - 100, P[1]]} color={C.second} w={8} head={30} />
        </g>
        {/* the moved origin: P, its wind, the legs, r̂ and θ̂, the two shadows */}
        <circle cx={P[0]} cy={P[1]} r={11} fill={C.key} stroke={C.bg} strokeWidth={3} opacity={fin(f, t6)} />
        <Arrow p={P} q={[P[0] + u[0] * W, P[1]]} color={C.ink} w={10} head={36} o={fin(f, t7)} />{/* Part 1 lessons D1: the full wind is ink */}
        <g opacity={fin(f, t8) * fout(f, t15, 20)}>
          <line x1={O[0]} y1={O[1]} x2={P[0]} y2={O[1]} stroke={C.second} strokeWidth={5} strokeDasharray="12 8" />
          <line x1={P[0]} y1={O[1]} x2={P[0]} y2={P[1]} stroke={C.second} strokeWidth={5} strokeDasharray="12 8" />
          <line x1={O[0]} y1={O[1]} x2={P[0]} y2={P[1]} stroke={C.local} strokeWidth={4} opacity={fin(f, t9)} />
        </g>
        <Lbl x={(O[0] + P[0]) / 2} y={O[1] + 34} t="500" c={C.second} s={T.floor} a="middle" o={fin(f, t8) * fout(f, t15, 20)} />
        <Lbl x={P[0] + 16} y={(O[1] + P[1]) / 2 + 60} t="1000" c={C.second} s={T.floor} o={fin(f, t8) * fout(f, t15, 20)} />
        <Arrow p={P} q={[P[0] + rh[0] * 110, P[1] + rh[1] * 110]} color={C.second} w={8} head={30} o={fin(f, t10)} />
        <Arrow p={P} q={[P[0] + th[0] * 110, P[1] + th[1] * 110]} color={C.second} w={8} head={30} o={fin(f, t13)} />
        {band(P, rh, ur, C.neg, fin(f, AT(k, 11, "about minus four")))}
        {band(P, th, ut, C.first, fin(f, AT(k, 14, "about eight")))}
        <Lbl x={P[0] + rh[0] * ur * W - 30} y={P[1] + rh[1] * ur * W + 40} t="−" c={C.neg} s={T.calc} a="middle" o={fin(f, AT(k, 11, "about minus four"))} />
        {extra.map((E, i) => <g key={i} opacity={fin(f, t16 + 10 * i)}>{band(E.q, [E.rhat[0], -E.rhat[1]], E.vr, E.vr < 0 ? C.neg : C.second, 1)}</g>)}
        <Keyword f={f} text="where to put the origin?" at={[XC, 110]} appear={0} out={t1 - 18} />
        <Keyword f={f} text="a flat example first" at={[XC, 110]} s={T.floor} appear={t1} out={t2 - 18} />
        <Keyword f={f} text="a ring of air: 10 m/s round" at={[XC, 110]} s={T.floor} appear={t2} out={t3 - 18} />
        <Keyword f={f} text="round 10 · in/out 0" at={[XC, 400]} appear={AT(k, 4, "The tangential wind is ten")} out={t5 - 18} />
        <Lbl x={XC} y={720} t="u = −10, v = 0" c={C.ink} s={T.calc} o={fin(f, AT(k, 7, "u is minus ten")) * fout(f, t15 - 18)} />
        <Keyword f={f} text="looks like inflow …" at={[XC, 800]} s={T.floor} appear={t12} out={t15 - 18} c={C.neg} />
        <Keyword f={f} text="same air, split differently" at={[XC, 720]} appear={t15} />
        <Keyword f={f} text="from the origin, not the air" at={[XC, 800]} s={T.floor} appear={t16} c={C.gold} />
      </Svg>
      <TeX s={EQ_S20} x={XC} y={200} size={56} o={fin(f, t3)} />
      <TeX s={String.raw`O_1`} x={C20[0] + 20} y={C20[1] + 40} size={52} c={C.gold} o={fin(f, t3) * mix(1, 0, sh)} />
      <TeX s={String.raw`O_2`} x={O[0] - 20} y={O[1] + 40} size={52} c={C.gold} ax={1} o={fin(f, t5 + 60)} />
      <TeX s={String.raw`P`} x={P[0] + 20} y={P[1] - 40} size={52} c={C.key} o={fin(f, t6)} />
      <TeX s={H.r} x={P[0] + rh[0] * 150} y={P[1] + rh[1] * 150} size={52} c={C.second} ax={0.5} o={fin(f, t10)} />
      <TeX s={H.th} x={P[0] + th[0] * 150} y={P[1] + th[1] * 150 - 10} size={52} c={C.second} ax={0.5} o={fin(f, t13)} />
      <CalcStack f={f} x={XC} y={310} size={54} maxLines={3} o={fout(f, t15 - 10, 12)} rows={[
        { rhs: String.raw`\sqrt{500^2+1000^2}\approx1118\ \text{km}`, at: AT(k, 9, "about one thousand") },
        { rhs: String.raw`\hat{\mathbf r}=\left(\dfrac{500}{1118},\ \dfrac{1000}{1118}\right)`, at: AT(k, 10, "each divided"), h: 96 },
        { rhs: String.raw`\approx(0.447,\ 0.894)`, at: AT(k, 10, "zero point four"), cont: true },
        { rhs: String.raw`u_r=(-10)(0.447)+(0)(0.894)`, at: AT(k, 11, "minus ten times"), c: C.neg, size: 48 },
        { rhs: String.raw`\approx-4.5`, at: AT(k, 11, "about minus four"), c: C.neg, cont: true },
        { rhs: String.raw`u_\theta=(-10)(-0.894)+0`, at: AT(k, 14, "minus ten times"), c: C.first, size: 48 },
        { rhs: String.raw`\approx8.9`, at: AT(k, 14, "about eight"), c: C.first, cont: true },
      ]} />
    </Scene>
  );
};

// ================================================================ s21 the vortex about the pole vs about its own centre
const S21: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21_origin_vortex");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10);
  const gl = prog(f, t5 + 10, t5 + 70);
  const cz = mapPt(VP, "ps", VX.c[0], VX.c[1]);
  const RP = VX.ringP, RC = VX.ringC;
  const ptsP: Pt[] = RP.lat.map((la: number, i: number) => mapPt(VP, "ps", la, RP.lon[i])), ptsC: Pt[] = RC.lat.map((la: number, i: number) => mapPt(VP, "ps", la, RC.lon[i]));
  const ring = ptsP.map((p, i) => [mix(p[0], ptsC[i][0], gl), mix(p[1], ptsC[i][1], gl)] as Pt);
  const ctr: Pt = [mix(VP.cx, cz[0], gl), mix(VP.cy, cz[1], gl)];
  const ticks = (pts: Pt[], c0: Pt, R: { vr: number[]; vt: number[] }, o: number) => o <= 0 ? null : <g opacity={o}>{pts.map((q, i) => {
    const d = Math.hypot(q[0] - c0[0], q[1] - c0[1]), r: Pt = [(q[0] - c0[0]) / d, (q[1] - c0[1]) / d], t: Pt = [r[1], -r[0]], s = 1.6;
    return <g key={i}>
      <line x1={q[0]} y1={q[1]} x2={q[0] + t[0] * R.vt[i] * s} y2={q[1] + t[1] * R.vt[i] * s} stroke={C.first} strokeWidth={5} />
      <line x1={q[0]} y1={q[1]} x2={q[0] + r[0] * R.vr[i] * s} y2={q[1] + r[1] * R.vr[i] * s} stroke={R.vr[i] < 0 ? C.neg : C.second} strokeWidth={5} strokeDasharray={R.vr[i] < 0 ? "6 4" : undefined} />
    </g>; })}</g>;
  const BS = 7.5;
  const bar = (y: number, v: number, c: string, t: string, o: number) => o <= 0 ? null : <g opacity={o}>
    <rect x={XC} y={y - 13} width={v * BS} height={26} fill={c} /><Lbl x={XC + v * BS + 16} y={y} t={t} c={c} s={T.floor} /></g>;
  return (
    <Scene>
      <PolarMap f={f} field={0.7} cont={0.6} rings={0.35} spokes={0.3} dimBase={0.15} trails={0.7} trailFr={f + 400} id="s21p"
        children={() => <>
          {cross(cz, fin(f, t1))}
          <line x1={cz[0]} y1={cz[1]} x2={VP.cx} y2={VP.cy} stroke={C.gold} strokeWidth={5} opacity={win(f, AT(k, 2, "about one thousand"), t3 + 30)} />
          <circle cx={VP.cx} cy={VP.cy} r={8} fill={C.key} />
          <path d={poly(ring) + "Z"} fill="none" stroke={gl > 0.5 ? C.gold : C.local} strokeWidth={5} opacity={fin(f, t3)} />
          {ticks(ptsP, [VP.cx, VP.cy], RP, fin(f, t3 + 30) * fout(f, t5, 10))}
          {ticks(ptsC, cz, RC, fin(f, t5 + 75))}
        </>} />
      <Svg>
        <RingLabels o={0.5} />
        <Keyword f={f} text="back to the vortex" at={[XC, 250]} appear={0} out={t2 - 18} />
        <SideCallout f={f} lines={["centre ≈ 72.9° N, 44.3° E", "≈ 1900 km from the pole"]} at={[XC + 14, 250]} appear={t2} out={t3 - 18} target={[cz[0] + 22, cz[1]]} c={C.gold} s={T.floor} bend={20} />
        <HeightBar x={XC + 20} y={150} o={1 - win(f, t5 + 10, t5 + 75, 10)} w={440} />
        <g opacity={fin(f, t3 + 30)}>
          <Lbl x={XC} y={250} t="ticks: round ·" c={C.first} s={T.floor} />
          <Lbl x={XC + textW("ticks: round · ", T.floor)} y={250} t="in" c={C.neg} s={T.floor} />
          <Lbl x={XC + textW("ticks: round · in ", T.floor)} y={250} t="/ out" c={C.second} s={T.floor} />
        </g>
        <Lbl x={XC} y={320} t="ring 2000 km about the pole" c={C.muted} s={T.floor} b={false} o={fin(f, t3)} />
        {bar(370, VX.vtP, C.first, "round ≈ 17.5 m/s", fin(f, AT(k, 4, "seventeen")))}
        {bar(420, VX.rmsP, C.neg, "in/out (rms) ≈ 33", fin(f, AT(k, 4, "thirty three")))}
        <Lbl x={XC} y={540} t="ring 2000 km about its own centre" c={C.muted} s={T.floor} b={false} o={fin(f, t5)} />
        {bar(590, VX.vtC, C.first, "round ≈ 47 m/s", fin(f, AT(k, 6, "forty seven")))}
        {bar(640, VX.rmsC, C.neg, "in/out (rms) ≈ 20", fin(f, AT(k, 6, "about twenty")))}
        <Keyword f={f} text="mostly spin, like the hurricane" at={[XC, 770]} s={T.floor} appear={t7} out={t8 - 18} />
        <Keyword f={f} text="origin: the centre of what turns" at={[XC, 770]} s={T.floor} appear={t8} out={t9 - 18} c={C.gold} />
        <Keyword f={f} text="cold air can spill south" at={[XC, 770]} s={T.floor} appear={t9} out={AT(k, 10, "Waves on the jet") - 18} />
        <Keyword f={f} text="more: Waves on the jet" at={[XC, 770]} appear={AT(k, 10, "Waves on the jet")} out={AT(k, 10, "The polar vortex") - 18} />
        <Keyword f={f} text="more: The polar vortex" at={[XC, 770]} appear={AT(k, 10, "The polar vortex")} />
      </Svg>
      <TeX s={String.raw`(90^\circ-72.9^\circ)\times111.2\approx1900\ \text{km}`} x={XC} y={360} size={46} c={C.gold} o={win(f, AT(k, 2, "about one thousand"), t3 - 18)} />
      <TeX s={String.raw`\text{ratio}=33\div17.5\approx1.9`} x={XC} y={475} size={54} c={C.gold} o={fin(f, AT(k, 4, "one point nine"))} />
      <TeX s={String.raw`\text{ratio}=20\div47\approx0.4`} x={XC} y={695} size={54} c={C.gold} o={fin(f, AT(k, 6, "zero point four"))} />
      <SourceBelow text={SRC_VX} pic={VPIC} w={760} name="s21 src" />
    </Scene>
  );
};

// ================================================================ s22 recap: one mini picture per sentence, older ones dimmed
const VR1: PV = { cx: 540, cy: 430, s: 135 }, VR3: PV = { cx: 540, cy: 440, s: 95 }, VR5: PV = { cx: 540, cy: 440, s: 160 }, VR6: PV = { cx: 540, cy: 440, s: 230 };
const S22: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22_recap");
  const ts = Array.from({ length: 8 }, (_, i) => SS(k, i));
  const b = (i: number) => win(f, ts[i], i < 7 ? ts[i + 1] - 10 : 1e9, 12);
  const io = (i: number) => fin(f, ts[i]) * (i < 7 ? mix(1, 0.6, fin(f, ts[i + 1])) : 1);
  const R = D.routes;
  const rhFlat: number[] = [], gcFlat: number[] = [];
  (R.rh[0] as number[]).forEach((la, i) => rhFlat.push(la, R.rh[1][i]));
  (R.gc[0] as number[]).forEach((la, i) => gcFlat.push(la, R.gc[1][i]));
  const lobes = Array.from({ length: 12 }, (_, i) => -180 + 30 * i);
  const gorePath = lobes.map((l0) => { const pts: Pt[] = []; for (let la = -90; la <= 90; la += 5) pts.push(mapPt(VR1, "go", la, l0 + 0.001));
    for (let la = 90; la >= -90; la -= 5) pts.push(mapPt(VR1, "go", la, l0 + 29.999)); return poly(pts) + "Z"; }).join("");
  return (
    <Scene>
      <Svg>
        <g opacity={b(0)}><path d={gorePath} fill="#22304e" stroke={C.key} strokeWidth={2} /></g>
        <g opacity={b(1)}>
          <rect x={VR1.cx - Math.PI * VR1.s} y={VR1.cy - (Math.PI / 2) * VR1.s} width={2 * Math.PI * VR1.s} height={Math.PI * VR1.s} fill="#1d2a44" stroke={C.grid} strokeWidth={3} />
          {[BREST[0], 60, 78.22].map((la) => <line key={la} x1={VR1.cx - Math.PI * VR1.s} y1={mapPt(VR1, "pc", la, 0)[1]} x2={VR1.cx + Math.PI * VR1.s} y2={mapPt(VR1, "pc", la, 0)[1]}
            stroke={C.gold} strokeWidth={5} opacity={0.8} />)}
          <path d={(D.coast as number[][]).map((L) => llD(VR1, "pc", L)).join("")} fill="none" stroke={C.key} strokeOpacity={0.6} strokeWidth={1.5} />
        </g>
        <g opacity={b(2)}>
          {[360, 640].map((x, i) => <circle key={i} cx={x} cy={430} r={16} fill={C.gold} />)}
          <line x1={360} y1={490} x2={640} y2={490} stroke={C.first} strokeWidth={6} />
          <Lbl x={500} y={540} t="73.8 km" c={C.first} s={T.key} a="middle" />
          <Lbl x={360} y={380} t="T" c={C.key} s={T.key} a="middle" /><Lbl x={640} y={380} t="T + 1 °C" c={C.key} s={T.key} a="middle" />
        </g>
      </Svg>
      <ProjMap id="s22m" v={VR3} name="mc" latTop={80} img={null} coast={0.6} o={b(3)}>
        {() => <><path d={llD(VR3, "mc", rhFlat)} fill="none" stroke={C.local} strokeWidth={6} /><path d={llD(VR3, "mc", gcFlat)} fill="none" stroke={C.gold} strokeWidth={6} /></>}
      </ProjMap>
      <Svg o={b(4)}><Ladder f={f} x={420} show={[1, 1, 1, 1, 1, 1, 1, 1]} open={1} /></Svg>
      <ProjMap id="s22e" v={VR5} name="ee" clipEllipse sea="#1d2a44" img={null} coast={0.6} o={b(5)} />
      <PolarMap f={f} v={VR6} o={b(6)} base={0} rings={0.6} spokes={0.5} dimBase={0} id="s22p"
        children={(Pp) => { const q = Pp(60, -90), cz = Pp(VX.c[0], VX.c[1]); return <>
          <Arrow p={q} q={[q[0], q[1] + 90]} color={C.second} w={8} head={30} /><Arrow p={q} q={[q[0] + 90, q[1]]} color={C.second} w={8} head={30} />
          {cross(cz, 1, 14)}</>; }} />
      <Svg>
        <g opacity={b(7)}>
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${180 + i * 150} 220 Q ${260 + i * 150} 430 ${180 + i * 150} 680`} fill="none" stroke={C.local} strokeWidth={4} />)}
          <Arrow p={[300, 450]} q={[720, 450]} color={C.second} w={10} head={40} />
        </g>
        <Keyword f={f} text="flattening stretches something" at={[XC, 110]} s={T.floor} appear={ts[0]} o={mix(1, 0.6, fin(f, ts[1]))} />
        <Lbl x={XC} y={330} t="scale factors → slopes on a grid" c={C.key} s={T.floor} o={io(2)} />
        <Lbl x={XC} y={400} t="Mercator: rhumb lines straight" c={C.key} s={T.floor} o={io(3)} />
        <Lbl x={XC} y={805} t="east is round, north is in" c={C.key} s={T.floor} o={io(6)} />
        <Keyword f={f} text="next: The gradient" at={[300, 790]} appear={AT(k, 7, "the gradient")} c={C.gold} />
      </Svg>
      <TeX s={String.raw`x=a\,\lambda,\quad y=a\,\varphi`} x={XC} y={200} size={58} o={io(1)} />
      <TeX s={String.raw`k=\dfrac{1}{\cos\varphi}`} x={XC + 480} y={200} size={58} o={io(1)} />
      <TeX s={EQ_S22} x={XC} y={500} size={60} o={io(4)} />
      <TeX s={String.raw`\text{area stretch}=\dfrac{1}{\cos^2\varphi}`} x={XC} y={640} size={56} o={io(5)} />
      <TeX s={String.raw`u_\theta=u,\qquad u_r=-v`} x={XC} y={738} size={52} c={C.gold} o={io(6)} />
      <SourceBelow text="coast: Natural Earth" pic={{ x: 120, y: 120, w: 840, h: 640 }} w={840} o={Math.max(b(1), b(3), b(5), b(6))} name="s22 src" />
    </Scene>
  );
};

// ================================================================ s23 the series end card (maths-tutorial ending, word for word)
const S23: React.FC = () => {
  const f = useCurrentFrame(), k = K("s23_end");
  const t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const thumb = (x: number, i: number) => (
    <g key={i} opacity={0.75}>
      <rect x={x - 150} y={70} width={300} height={170} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
      {/* Part 1 lessons B5: every icon >= 20 px inside its box (y 70-240): the circles were r 70-75 (10-15 px), the map 18 px */}
      {i === 0 ? <><circle cx={x} cy={155} r={62} fill="none" stroke={C.local} strokeWidth={3} /><path d={`M ${x - 52} 168 Q ${x} 98 ${x + 48} 140`} fill="none" stroke={C.gold} strokeWidth={5} /></> : null}
      {i === 1 ? <><rect x={x - 90} y={94} width={180} height={122} fill="none" stroke={C.local} strokeWidth={3} />
        {[-60, -20, 20, 60].map((d) => <line key={d} x1={x + d} y1={94} x2={x + d} y2={216} stroke={C.local} strokeWidth={2} />)}
        {[110, 135, 170, 205].map((y) => <line key={y} x1={x - 90} y1={y} x2={x + 90} y2={y} stroke={C.local} strokeWidth={2} />)}
        <line x1={x - 80} y1={130} x2={x + 80} y2={190} stroke={C.local} strokeWidth={5} /></> : null}
      {i === 2 ? <>{[20, 40, 60].map((r) => <circle key={r} cx={x} cy={155} r={r} fill="none" stroke={C.local} strokeWidth={3} />)}
        {[0, 1, 2, 3, 4, 5].map((j) => <line key={j} x1={x} y1={155} x2={x + 60 * Math.cos((j * Math.PI) / 3)} y2={155 - 60 * Math.sin((j * Math.PI) / 3)} stroke={C.local} strokeWidth={2} />)}
        <path d={`M ${x + 50} 155 A 50 50 0 0 0 ${x} 105`} fill="none" stroke={C.gold} strokeWidth={5} /></> : null}
      {i === 3 ? <><Arrow p={[x - 90, 190]} q={[x + 80, 120]} color={C.second} w={7} head={26} />
        {[-50, 0, 50].map((d) => <path key={d} d={`M ${x + d - 20} 96 Q ${x + d + 10} 155 ${x + d - 20} 214`} fill="none" stroke={C.local} strokeWidth={3} />)}</> : null}
    </g>
  );
  const rel = ["vectors and index notation", "dot product", "cross product", "derivatives and Taylor series", "gradient", "contour maps", "curl", "material derivative", "Coriolis", "reading weather maps"];
  const COLX = [200, 1000], ROWY = (r: number) => 648 + r * 48;
  rel.forEach((t, i) => { if (COLX[Math.floor(i / 5)] + textW(t, T.floor) > (COLX[Math.floor(i / 5) + 1] ?? 1840) - 10) throw new Error(`end card: "${t}" too wide`); });
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, 6)}>{[420, 760, 1100, 1440].map((x, i) => thumb(x, i))}</g>
        <Lbl x={960} y={315} t="a series of maths tutorials" c={C.key} s={T.calc} a="middle" o={fin(f, 10)} />
        <Lbl x={960} y={395} t="atmospheric science · meteorology · fluid dynamics" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "atmospheric science"))} />
        <g opacity={fin(f, t2)}><Notebook x={300} y={482} s={0.4} /><Lbl x={352} y={490} t="coordinates notebook" c={C.ink} s={T.key} /></g>
        <g opacity={fin(f, tOther)}>
          {[0, 1, 2].map((i) => <Notebook key={i} x={260 + i * 30} y={575 - i * 10} s={0.24} c={[C.second, "#8e6fd8", C.muted][i]} o={0.9} />)}
          <Lbl x={352} y={565} t="notebooks for the other maths concepts" c={C.key} s={T.key} />
        </g>
        <g opacity={fin(f, tOther + 20) * 0.8}>
          {rel.map((t, i) => <Lbl key={t} x={COLX[Math.floor(i / 5)]} y={ROWY(i % 5)} t={t} c={C.muted} s={T.floor} b={false} />)}
        </g>
      </Svg>
    </Scene>
  );
};

export const SCENES_C: Record<string, React.FC> = {
  s16_globe_to_pole: S16, s17_where_is_what: S17, s18_vortex: S18, s19_vortex_components: S19, s20_origin_wheel: S20, s21_origin_vortex: S21, s22_recap: S22, s23_end: S23,
};
