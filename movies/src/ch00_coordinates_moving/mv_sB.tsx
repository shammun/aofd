// ch00_coordinates_moving scenes s08-s12: Storm Ciarán (ERA5 hourly 21 -> 06 UTC, tracked by continuity), its motion U, the
// lopsided ring at 03 UTC (sector means of the round part), the storm-relative wind v′ = v − U at two ring points (arrow
// subtraction), the round parts per side for the ground and the rider, what does not change (ring means, the uniform-wind
// picture, the Brest gust). Maps are local equirectangular frames of the ERA5 rasters (true local shape). Numbers from data/mv.json only.
import React from "react";
import { useCurrentFrame } from "remotion";
import { C, T } from "../house/kit/type";
import { Pt } from "../house/kit/draw";
import { SourceBelow } from "../house/kit/frame";
import { AnimatedWindArrow } from "../house/kit/wind";
import { CurvedLink } from "../house/kit/extras";
import {
  AT, Arrow, BREST, CI, CIA_PIC, CalcStack, CiaMap, ClockText, D, D2R, HL, HOUR, HouseIcon, K, Keyword, LEN, Lbl, Layered, MapBox, Place, Proj, Recall, SE, SRC_CIA,
  SRC_CIA3, SS, Scene, SideCallout, SpeedBar, Svg, TRK, TeX, XC, arcD, boxAt, clamp, fin, fout, lin, mapP, mix, nf, pieces, prog, ringD, sectorD, win,
} from "./mv_lib";
import { EQ_S08, EQ_S10 } from "./mv_eq";

const RG = CI.ring, SEC = CI.sec, PTS = CI.pts, U = CI.U as number[];
const E3 = D.e3, E4 = D.e4;
// ---------------------------------------------------------------- numbers on screen = the data (the render fails otherwise)
const CHECK_B: [string, number, number, number][] = [
  ["p00", TRK[3][3], 954.5, 0.05], ["spd", CI.spd, 14.6, 0.05], ["brg", CI.brg, 71, 0.5], ["Ue", 14.6 * Math.sin(71 * D2R), 13.8, 0.05], ["Un", 14.6 * Math.cos(71 * D2R), 4.8, 0.05],
  ["Ue data", U[0], 13.8, 0.05], ["Un data", U[1], 4.8, 0.05], ["S_g", SEC.S_g, 18.2, 0.05], ["N_g", SEC.N_g, 6.9, 0.05], ["S_s", SEC.S_s, 5.0, 0.05], ["N_s", SEC.N_s, 19.9, 0.05],
  ["S_u", SEC.S_u, 13.2, 0.05], ["N_u", SEC.N_u, -13.0, 0.05], ["gS u", PTS.S.g[0], 13.5, 0.05], ["gS v", PTS.S.g[1], 8.4, 0.05], ["gN u", PTS.N.g[0], -4.2, 0.05],
  ["gN v", PTS.N.g[1], -5.3, 0.05], ["sS u", PTS.S.s[0], -0.3, 0.05], ["sS v", PTS.S.s[1], 3.7, 0.05], ["sN u", PTS.N.s[0], -18.0, 0.05], ["sN v", PTS.N.s[1], -10.1, 0.05],
  ["|sS|", Math.hypot(PTS.S.s[0], PTS.S.s[1]), 3.7, 0.05], ["|sN|", Math.hypot(PTS.N.s[0], PTS.N.s[1]), 20.6, 0.05], ["vtm g", CI.vtm[0], 14.1, 0.05],
  ["vtm s", CI.vtm[1], 13.8, 0.05], ["vrm g", CI.vrm[0], -6, 0.5], ["vrm s", CI.vrm[1], -6, 0.5], ["uni", CI.vtm[2], 0.3, 0.05], ["gust", CI.gust_kt, 84, 0],
  ["gust kmh", CI.gust_kt * 1.852, 156, 0.5], ["round 18", Math.round(SEC.S_g), 18, 0], ["round 7", Math.round(SEC.N_g), 7, 0], ["13 S", Math.round(SEC.S_u), 13, 0],
  ["13 N", Math.round(-SEC.N_u), 13, 0], ["5", Math.round(SEC.S_s), 5, 0], ["20", Math.round(SEC.N_s), 20, 0], ["15", Math.round(CI.spd), 15, 0],
  // calc & sync audit #5e: the new rows
  ["gS u 2dp", PTS.S.g[0], 13.47, 0.005], ["gS v 2dp", PTS.S.g[1], 8.44, 0.005], ["Ue 2dp", U[0], 13.78, 0.005], ["Un 2dp", U[1], 4.75, 0.005],
  ["e3 la0", E3.ll0[0], 49.667, 0], ["e3 lo0", E3.ll0[1], -5.717, 0], ["e3 la6", E3.ll6[0], 50.516, 0], ["e3 lo6", E3.ll6[1], -1.505, 0],
  ["e3 dy", E3.dy, 94.4, 0.05], ["e3 dx", E3.dx, 300.4, 0.05], ["mcos", E4.mcos, 0.906, 5e-4],
  ...(E4.tu5 as number[]).map((v, i) => [`tu5 ${i}`, v, [11.4, 13.8, 14.6, 13.7, 11.3][i], 0.05] as [string, number, number, number]),
  // remake 2026-11-07: the trig inputs said and highlighted in s08 (rounded bearing 71°, as said), their products, and Part 1's N = 72 in s12
  ["sin71", Math.sin(71 * D2R), 0.946, 5e-4], ["cos71", Math.cos(71 * D2R), 0.326, 5e-4], ["east 14.6", 14.6 * 0.946, 13.8, 0.05], ["north 14.6", 14.6 * 0.326, 4.8, 0.05],
  ["brg rounds to 71", Math.round(CI.brg), 71, 0], ["N ring", RG.lat.length, 72, 0],
];
CHECK_B.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });

/** the screen direction of the anticlockwise ring tangent θ̂ at ring point i (from the neighbouring ring points on this map) */
const tanAt = (P: Proj, i: number): Pt => {
  const n = RG.lat.length, a = P(RG.lat[(i + n - 1) % n], RG.lon[(i + n - 1) % n]), b = P(RG.lat[(i + 1) % n], RG.lon[(i + 1) % n]);
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  return [dx / L, dy / L];
};
const ptOf = (P: Proj, i: number): Pt => P(RG.lat[i], RG.lon[i]);
const uv = (v: number[], s: number): Pt => [v[0] * s, -v[1] * s];     // (east, north) m/s → screen px

// ================================================================ s08 Storm Ciarán and its motion U
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = K("s08_ciaran");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t8 = SS(k, 8);
  // hourly 21 -> 00 UTC while S2-S3 speak, held at midnight for S4, then 00 -> 06 UTC while the motion is told (1 h ≈ 1.5-2 s)
  const h = f < t4 ? 3 * lin(f, t1 + 10, SE(k, 2)) : 3 + 6 * lin(f, t4, AT(k, 4, "roughly fifteen"));
  const hi = Math.min(9, Math.floor(h + 1e-6));
  const tBrg = AT(k, 4, "seventy one degrees"), tSp = AT(k, 4, "fourteen point six");
  const eq = pieces(EQ_S08, [String.raw`\approx`]);
  return (
    <Scene>
      <CiaMap f={f} h={h} parts={0.7}>
        {(P) => {
          const c0 = P(TRK[3][1], TRK[3][2]), a = CI.brg * D2R, L = CI.spd * 9;
          return <>
            <path d={TRK.slice(0, hi + 1).map((t, i) => `${i ? "L" : "M"}${P(t[1], t[2])[0].toFixed(1)} ${P(t[1], t[2])[1].toFixed(1)}`).join("")} fill="none" stroke={C.gold} strokeWidth={4} />
            {TRK.slice(0, hi + 1).map((t, i) => <circle key={i} cx={P(t[1], t[2])[0]} cy={P(t[1], t[2])[1]} r={i === 3 ? 11 : 8} fill={C.gold} stroke={C.bg} strokeWidth={3} />)}
            <circle cx={c0[0]} cy={c0[1]} r={26} fill="none" stroke={C.gold} strokeWidth={4} opacity={win(f, t3, t4)} />
            <g opacity={fin(f, tBrg)}>
              <line x1={c0[0]} y1={c0[1]} x2={c0[0]} y2={c0[1] - 120} stroke={C.muted} strokeWidth={4} strokeDasharray="10 8" />
              <path d={arcD(c0, 80, 90, 90 - CI.brg)} fill="none" stroke={C.gold} strokeWidth={5} />
              <Arrow p={c0} q={[c0[0] + Math.sin(a) * L, c0[1] - Math.cos(a) * L]} color={C.second} />
            </g>
          </>;
        }}
      </CiaMap>
      <Svg>
        <Place p={mapP(boxCia())(50.45, -4.75)} t="Cornwall" r={0} dx={0} dy={-40} a="middle" o={fin(f, AT(k, 3, "Cornwall"))} />
        <ClockText x={XC + 30} y={90} t={`${HOUR[hi]} UTC`} h={(parseInt(HOUR[hi], 10) % 12) || 12} />
        <Keyword f={f} text="a real moving storm" at={[XC, 180]} appear={0} out={t1 - 18} s={T.floor} />
        <Keyword f={f} text="Storm Ciarán · 1–2 Nov 2023" at={[XC, 180]} appear={t1} out={t4 - 18} s={T.floor} />
        <Keyword f={f} text="tracked hour by hour" at={[XC, 270]} appear={AT(k, 2, "hour by hour")} out={t4 - 18} s={T.floor} />
        <SideCallout f={f} lines="00 UTC: 954.5 hPa" at={[XC + 30, 360]} appear={AT(k, 3, "nine hundred")} out={t4 - 18}
          target={(() => { const c = mapP(boxCia())(TRK[3][1], TRK[3][2]); return [c[0] + 30, c[1] - 6] as Pt; })()} s={T.floor} bend={30} />
        <Keyword f={f} text="towards 71°: east-north-east" at={[XC, 180]} appear={tBrg} s={T.floor} c={C.second} />
        <SpeedBar x={XC} y={770} />
      </Svg>
      <CalcStack f={f} x={XC} y={250} size={44} maxLines={3} o={fout(f, t5 - 12)} rows={[
        { rhs: String.raw`00\ \text{h}:\ 49.667^\circ\text{N},\ 5.717^\circ\text{W}`, at: t4, c: C.muted },
        { rhs: String.raw`06\ \text{h}:\ 50.516^\circ\text{N},\ 1.505^\circ\text{W}`, at: t4 + 15, c: C.muted, cont: true },
        { rhs: String.raw`\Delta y=6371\times0.849\times0.01745`, at: t4 + 35 },
        { rhs: String.raw`\approx94.4\ \text{km}`, at: t4 + 50, cont: true },
        { rhs: String.raw`\varphi_{\text{mid}}=(49.667+50.516)\div2`, at: t4 + 65, c: C.muted },
        { rhs: String.raw`=50.09^\circ`, at: t4 + 75, c: C.muted, cont: true },
        { rhs: String.raw`\Delta\lambda=4.212\times0.01745`, at: t4 + 90, c: C.muted },
        { rhs: String.raw`=0.07350\ \text{rad}`, at: t4 + 100, c: C.muted, cont: true },
        { rhs: String.raw`\Delta x=6371\times\cos50.09^\circ\times0.07350`, at: t4 + 115 },
        { rhs: String.raw`\approx300.4\ \text{km}`, at: t4 + 135, cont: true },
        { rhs: String.raw`\tan\beta=300.4\div94.4\approx3.18`, at: tBrg - 20 },
        { rhs: String.raw`\Rightarrow\beta\approx72.6^\circ\ \text{on average}`, at: tBrg - 5, cont: true },
        { rhs: String.raw`\text{at the start: }71^\circ`, at: tBrg + 10, c: C.muted, cont: true },
        { rhs: String.raw`\sqrt{94.4^2+300.4^2}\approx315\ \text{km}`, at: tSp - 50 },
        { rhs: String.raw`315\,000\ \text{m}\div21\,600\ \text{s}\approx14.6\ \text{m/s}`, at: tSp - 20, cont: true },
      ]} />
      {/* remake 2026-11-07 (R16): Part 1's bearing rule at its point of use; S6-S7 the calculation with the trig inputs highlighted on their
          words; S8 the answer as U in Part 4's local east and north arrows */}
      <Recall f={f} tex={String.raw`\theta=90^\circ-\text{bearing}`} name="polar coordinates, bearings" x={XC} y={280} size={46} appear={t5} out={t6 - 12} />
      <TeX s={String.raw`\text{east}=|\mathbf U|\cos\theta,\ \ \text{north}=|\mathbf U|\sin\theta`} x={XC} y={460} size={44}
        o={win(f, AT(k, 5, "east and north parts"), t6 - 12)} />
      <CalcStack f={f} x={XC} y={270} size={44} maxLines={3} o={fout(f, t8 - 12)} rows={[
        { rhs: String.raw`\text{east}=|\mathbf U|\sin71^\circ`, at: t6 },
        { rhs: String.raw`\text{north}=|\mathbf U|\cos71^\circ`, at: AT(k, 6, "its north part"), cont: true },
        { rhs: String.raw`\sin71^\circ\approx0.946,\ \ \cos71^\circ\approx0.326`, at: AT(k, 7, "Sine seventy one"), c: C.gold,
          glow: Math.max(HL(f, AT(k, 7, "Sine seventy one")), HL(f, AT(k, 7, "cosine seventy one"))) },
        { rhs: String.raw`\text{east}=14.6\times0.946\approx13.8\ \text{m/s}`, at: AT(k, 7, "the east part is about") },
        { rhs: String.raw`\text{north}=14.6\times0.326\approx4.8\ \text{m/s}`, at: AT(k, 7, "the north part about"), cont: true },
      ]} />
      <TeX s={eq[0]} x={XC} y={300} size={46} c={C.second} o={fin(f, t8)} />
      <TeX s={eq[1]} x={XC} y={370} size={46} c={C.second} o={fin(f, t8 + 10)} />
      <Recall f={f} tex={String.raw`\mathbf U=13.8\,\hat{\mathbf i}+4.8\,\hat{\mathbf j}`} name="local east and north arrows" lab="from Part 4:" x={XC} y={470}
        size={46} c={C.second} appear={AT(k, 8, "thirteen point eight times i hat")} />
      <SourceBelow text={SRC_CIA} pic={CIA_PIC} w={920} name="s08 src" />
    </Scene>
  );
};
/** the default Ciarán map box (CiaMap's own) */
const boxCia = (): MapBox => boxAt(50.3, -4.6, 9.0, 80, 40, 920, 720);

// ================================================================ s09 the lopsided ring (ground-relative round parts)
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09_lopsided");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const P = mapP(boxCia());
  const iS = PTS.S.i as number, iN = PTS.N.i as number;
  return (
    <Scene>
      <CiaMap f={f} h={6}>
        {(Pm) => {
          const s = 5, spinAt = (i: number, v: number, o: number) => { const p0 = ptOf(Pm, i), t = tanAt(Pm, i); return <Arrow p={p0} q={[p0[0] + t[0] * v * s, p0[1] + t[1] * v * s]} color={C.first} w={8} head={28} o={o} />; };
          return <>
            <path d={ringD(Pm)} fill="none" stroke={C.first} strokeWidth={5} />
            <path d={sectorD(Pm, RG.south)} fill="none" stroke={C.gold} strokeWidth={16} opacity={0.55 * fin(f, AT(k, 2, "eighteen"))} />
            <path d={sectorD(Pm, RG.north)} fill="none" stroke={C.gold} strokeWidth={16} opacity={0.55 * fin(f, AT(k, 2, "seven"))} />
            {/* the spin as seen from the ground: the ring's own round part every 30° (data), anticlockwise seen from above */}
            {Array.from({ length: 12 }, (_, q) => q * 6).map((i) => <g key={i}>{spinAt(i, RG.vt[i], fin(f, t1) * win(f, t1, t5 - 18))}</g>)}
            {/* S6/S7: the storm's own spin (the rider's sector-mean round part along θ̂) and the motion U, head to tail */}
            {[{ i: iS, v: SEC.S_s, t: t5 }, { i: iN, v: SEC.N_s, t: t6 }].map(({ i, v, t }) => {
              const p0 = ptOf(Pm, i), tg = tanAt(Pm, i), sp: Pt = [p0[0] + tg[0] * v * s, p0[1] + tg[1] * v * s], w = uv(U, s);
              return <g key={i} opacity={fin(f, t)}><Arrow p={p0} q={sp} color={C.first} w={8} head={28} /><Arrow p={sp} q={[sp[0] + w[0], sp[1] + w[1]]} color={C.second} w={8} head={28} /></g>;
            })}
          </>;
        }}
      </CiaMap>
      <Svg>
        <Keyword f={f} text="200-km ring, 03 UTC" at={[XC, 150]} appear={0} s={T.floor} c={C.first} />
        <Keyword f={f} text="round part · in or out" at={[XC, 230]} appear={t1} s={T.floor} />
        {/* Must 13: north above south, as on the map; links leave from each line's left edge and never cross */}
        <SideCallout f={f} lines="north ≈ 7 m/s" at={[XC + 30, 330]} appear={AT(k, 2, "only about seven")} target={(() => { const p = ptOf(P, iN); return [p[0] + 14, p[1] - 10] as Pt; })()} s={T.floor} bend={30} />
        <SideCallout f={f} lines="south ≈ 18 m/s" at={[XC + 30, 410]} appear={AT(k, 2, "about eighteen")} target={(() => { const p = ptOf(P, iS); return [p[0] + 14, p[1] + 10] as Pt; })()} s={T.floor} bend={-30} />
        <Keyword f={f} text="why so lopsided?" at={[XC, 520]} appear={t3} out={t4 - 18} s={T.floor} c={C.gold} />
        <Keyword f={f} text="anticlockwise, seen from above" at={[XC, 520]} appear={t4} s={T.floor} c={C.first} />
        <Keyword f={f} text="south: spin + motion add" at={[XC, 600]} appear={t5} s={T.floor} />
        <Keyword f={f} text="north: they partly cancel" at={[XC, 670]} appear={t6} s={T.floor} c={C.neg} />
        <SpeedBar x={XC} y={780} />
      </Svg>
      {/* remake 2026-11-07 (R16): Part 1's split at its point of use (S1), leaving before the side values (S2) */}
      <TeX s={String.raw`u_r=u\cos\theta+v\sin\theta`} x={XC} y={320} size={46} c={C.first} o={win(f, AT(k, 1, "we split"), AT(k, 2, "about eighteen") - 12)} />
      <Recall f={f} tex={String.raw`u_\theta=-u\sin\theta+v\cos\theta`} name="radial and tangential wind" x={XC} y={385} size={46} c={C.first}
        appear={AT(k, 1, "with the formulas")} out={AT(k, 2, "about eighteen") - 12} />
      <SourceBelow text={SRC_CIA3} pic={CIA_PIC} w={920} name="s09 src" />
    </Scene>
  );
};

// ================================================================ s10 the storm-relative wind v′ = v − U (D43)
const B10: MapBox = boxAt(50.3, -3.7, 8.0, 80, 40, 540, 720);
const S10P = { x: 80, y: 40, w: 540, h: 720 };
const SC = 9;                                                   // inset arrows: 9 px per m/s (manifest)
const ON: Pt = [980, 150], OS: Pt = [700, 640];
const Inset: React.FC<{ f: number; O: Pt; g: number[]; s: number[]; tG: number; tU: number; tV: number }> = ({ f, O, g, s, tG, tU, tV }) => {
  const gv = uv(g, SC), mu = uv([-U[0], -U[1]], SC), gt: Pt = [O[0] + gv[0], O[1] + gv[1]], ut: Pt = [gt[0] + mu[0], gt[1] + mu[1]], sv = uv(s, SC);
  return (
    <g>
      <circle cx={O[0]} cy={O[1]} r={9} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, tG)} />
      <AnimatedWindArrow from={O} to={gt} speed={Math.hypot(g[0], g[1])} f={f} c={C.local} px={8} head={28} o={fin(f, tG)} />{/* Part 1 lessons D1: the full (ground) wind is never teal; slate as in s01 */}
      <Arrow p={gt} q={ut} color={C.second} w={8} head={28} dash="14 10" o={fin(f, tU)} />
      <Arrow p={O} q={[O[0] + sv[0], O[1] + sv[1]]} color={C.key} w={9} head={30} o={fin(f, tV)} />
    </g>
  );
};
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_storm_relative");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t8 = SS(k, 8), t9 = SS(k, 9), t11 = SS(k, 11);
  const sG = AT(k, 6, "the ground wind is"), sU = AT(k, 7, "Take away"), sV = AT(k, 7, "the rider feels");
  const nG = AT(k, 9, "The ground wind is"), nU = AT(k, 10, "Take away"), nV = AT(k, 10, "the rider feels");
  const P = mapP(B10), pS = ptOf(P, PTS.S.i), pN = ptOf(P, PTS.N.i);
  const parts = [{ t: String.raw`\mathbf v=\mathbf U+\mathbf v'` }, { t: String.raw`\ \Rightarrow\ \mathbf v'=\mathbf v-\mathbf U`, c: C.key }];
  if (parts.map((p) => p.t).join("").replace(/\s/g, "") !== EQ_S10.replace(/\s/g, "")) throw new Error("s10 parts drift from EQ_S10");
  const gN = uv(PTS.N.g, SC), gS = uv(PTS.S.g, SC), mU = uv([-U[0], -U[1]], SC), sN = uv(PTS.N.s, SC), sS = uv(PTS.S.s, SC);
  return (
    <Scene>
      <CiaMap f={f} h={6} B={B10} id="cia10" parts={0.6}>
        {(Pm) => <>
          <path d={ringD(Pm)} fill="none" stroke={C.first} strokeWidth={4} />
          <circle cx={ptOf(Pm, PTS.N.i)[0]} cy={ptOf(Pm, PTS.N.i)[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, t8)} />
          <circle cx={ptOf(Pm, PTS.S.i)[0]} cy={ptOf(Pm, PTS.S.i)[1]} r={10} fill={C.gold} stroke={C.bg} strokeWidth={3} opacity={fin(f, t5)} />
          {(() => { const c = Pm(CI.c03[0], CI.c03[1]), w = uv(U, 6); return <Arrow p={c} q={[c[0] + w[0], c[1] + w[1]]} color={C.second} w={8} head={28} />; })()}
        </>}
      </CiaMap>
      <Svg>
        <Lbl x={820} y={80} t="north side" c={C.key} s={T.floor} a="middle" o={fin(f, t8)} />
        <Lbl x={820} y={470} t="south side" c={C.key} s={T.floor} a="middle" o={fin(f, t5)} />
        <Inset f={f} O={ON} g={PTS.N.g} s={PTS.N.s} tG={nG} tU={nU} tV={nV} />
        <Inset f={f} O={OS} g={PTS.S.g} s={PTS.S.s} tG={sG} tU={sU} tV={sV} />
        <CurvedLink f={f} from={[pN[0] + 12, pN[1] - 8]} to={[ON[0] - 14, ON[1] - 8]} start={t8 + 6} bend={60} />
        <CurvedLink f={f} from={[pS[0] + 12, pS[1] + 6]} to={[OS[0] - 14, OS[1] + 4]} start={t5 + 6} bend={-30} />
        {/* Part 1 lessons B1: the insets say what they magnify (the map's arrows at 6 px per m/s, the insets at 9) */}
        <Lbl x={640} y={820} t="insets: 1.5$\times$ larger" c={C.muted} s={T.floor} b={false} o={fin(f, t5 + 6)} />
        <SpeedBar x={XC} y={100} />
        <Keyword f={f} text="riding with the storm's centre" at={[XC, 240]} appear={0} out={t1 - 18} s={T.floor} />
        <Keyword f={f} text="storm-relative wind" at={[XC, 240]} appear={t1} c={C.gold} />
        <Keyword f={f} text="met in the vectors movie" at={[XC, 420]} appear={AT(k, 1, "vectors movie")} out={t4 - 18} s={T.floor} c={C.gold} />
        <Keyword f={f} text="−U: the arrow reversed" at={[XC, 420]} appear={t4} s={T.floor} c={C.second} />
        <Keyword f={f} text="rider: the north is windier" at={[XC, 790]} appear={t11} s={T.floor} c={C.gold} />
      </Svg>
      {/* tip labels of the insets (KaTeX, house hats/bold) */}
      <TeX s={H_V} x={ON[0] + gN[0] + 22} y={ON[1] + gN[1] + 8} size={46} c={C.local} o={fin(f, nG)} halo />
      <TeX s={String.raw`-\mathbf U`} x={ON[0] + gN[0] + mU[0] / 2 + 6} y={ON[1] + gN[1] + mU[1] / 2 + 40} size={46} c={C.second} ax={0.5} o={fin(f, nU)} halo />
      <TeX s={String.raw`\mathbf v'`} x={ON[0] + sN[0] - 18} y={ON[1] + sN[1] + 10} size={46} c={C.key} ax={1} o={fin(f, nV)} halo />
      <TeX s={H_V} x={OS[0] + gS[0] + 22} y={OS[1] + gS[1] - 4} size={46} c={C.local} o={fin(f, sG)} halo />
      <TeX s={String.raw`-\mathbf U`} x={OS[0] + gS[0] + mU[0] / 2 + 10} y={OS[1] + gS[1] + mU[1] / 2 + 44} size={46} c={C.second} ax={0.5} o={fin(f, sU)} halo />
      <TeX s={String.raw`\mathbf v'`} x={OS[0] + sS[0] - 22} y={OS[1] + sS[1] + 8} size={46} c={C.key} ax={1} o={fin(f, sV)} halo />
      <Layered parts={parts} x={XC} y={330} size={58} layers={[{ t: [0], o: fin(f, t2) }, { t: [1], o: fin(f, t3) }]} />
      <CalcStack f={f} x={XC} y={480} size={44} maxLines={3} rows={[
        { rhs: String.raw`\text{south: }\mathbf v=(13.47,\ 8.44)`, at: sG },
        { rhs: String.raw`\mathbf v'=(13.47,\ 8.44)-(13.78,\ 4.75)`, at: sU },
        { rhs: String.raw`=(-0.31,\ 3.69)\approx(-0.3,\ 3.7)`, at: sV, c: C.key },
        { rhs: String.raw`|\mathbf v'|=\sqrt{0.31^2+3.69^2}\approx3.7`, at: AT(k, 7, "a gentle"), c: C.key },
        { rhs: String.raw`\text{north: }\mathbf v=(-4.2,\ -5.3)`, at: nG },
        { rhs: String.raw`\mathbf v'=(-4.2,\ -5.3)-(13.8,\ 4.8)`, at: nU },
        { rhs: String.raw`=(-18.0,\ -10.1)`, at: nV, c: C.key },
        { rhs: String.raw`|\mathbf v'|=\sqrt{324+102}\approx20.6`, at: AT(k, 10, "about twenty"), c: C.key },
      ]} />
      <SourceBelow text={SRC_CIA3} pic={S10P} w={540} name="s10 src" />
    </Scene>
  );
};
const H_V = String.raw`\mathbf v`;

// ================================================================ s11 the round parts per side, ground vs rider (D43 4)
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_round_parts");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const aS = prog(f, AT(k, 2, "drops from eighteen"), AT(k, 2, "drops from eighteen") + 60), aN = prog(f, AT(k, 4, "grows from seven"), AT(k, 4, "grows from seven") + 60);
  const vS = mix(SEC.S_g, SEC.S_s, aS), vN = mix(SEC.N_g, SEC.N_s, aN);
  const GX = { n: 1560, s: 1740 }, GY = { h: 230, g: 310, m: 390, r: 470 };
  const oDot = win(f, AT(k, 1, "same way as the spin"), AT(k, 2, "about five") - 10), uU: Pt = [Math.sin(CI.brg * D2R) * 60, -Math.cos(CI.brg * D2R) * 60];
  const cell = (x: number, y: number, t: string, c: string, o: number) => <Lbl x={x} y={y} t={t} c={c} s={T.key} a="middle" o={o} />;
  return (
    <Scene>
      <CiaMap f={f} h={6} parts={0.6}>
        {(Pm) => {
          const s = 6, at = (i: number, v: number, c: string) => { const p0 = ptOf(Pm, i), t = tanAt(Pm, i); return <Arrow p={p0} q={[p0[0] + t[0] * v * s, p0[1] + t[1] * v * s]} color={c} w={9} head={32} />; };
          return <>
            <path d={ringD(Pm)} fill="none" stroke={C.first} strokeWidth={5} />
            <path d={sectorD(Pm, RG.south)} fill="none" stroke={C.gold} strokeWidth={16} opacity={0.5} />
            <path d={sectorD(Pm, RG.north)} fill="none" stroke={C.gold} strokeWidth={16} opacity={0.5} />
            {at(PTS.S.i, vS, aS > 0.5 ? C.key : C.first)}
            {(E4.di as number[]).map((d, j) => { const n = RG.lat.length, i = (PTS.S.i + d + n) % n, p0 = ptOf(Pm, i), t = tanAt(Pm, i), o = oDot;
              if (o <= 0) return null;
              return <g key={d} opacity={o}>
                <Arrow p={p0} q={[p0[0] + t[0] * 60, p0[1] + t[1] * 60]} color={C.key} w={5} head={18} halo={false} />
                <Arrow p={p0} q={[p0[0] + uU[0], p0[1] + uU[1]]} color={C.second} w={5} head={18} halo={false} />
                {j % 2 === 0 ? <Lbl x={p0[0] + 14} y={p0[1] + 52} t={(E4.tu5[j] as number).toFixed(1)} c={C.second} s={T.floor} /> : null}
              </g>; })}
            {at(PTS.N.i, vN, aN > 0.5 ? C.key : C.first)}
          </>;
        }}
      </CiaMap>
      <Svg>
        <SpeedBar x={XC} y={100} />
        <Lbl x={XC} y={GY.h} t="round part, m/s" c={C.muted} s={T.floor} b={false} />
        <Lbl x={GX.n} y={GY.h} t="north" c={C.key} s={T.floor} a="middle" />
        <Lbl x={GX.s} y={GY.h} t="south" c={C.key} s={T.floor} a="middle" />
        <Lbl x={XC} y={GY.g} t="ground" c={C.local} s={T.floor} />
        <Lbl x={XC} y={GY.m} t="motion" c={C.second} s={T.floor} />
        <Lbl x={XC} y={GY.r} t="rider" c={C.key} s={T.floor} />
        {cell(GX.n, GY.g, "6.9", C.first, 1)}
        {cell(GX.s, GY.g, "18.2", C.first, 1)}
        {cell(GX.s, GY.m, "+13.2", C.second, fin(f, AT(k, 1, "adds about thirteen")))}
        {cell(GX.s, GY.r, "5.0", C.key, fin(f, AT(k, 2, "about five")))}
        {cell(GX.n, GY.m, "−13.0", C.neg, fin(f, AT(k, 3, "takes away about thirteen")))}
        {cell(GX.n, GY.r, "19.9", C.key, fin(f, AT(k, 4, "about twenty")))}
        <Keyword f={f} text="ground: the south felt stronger" at={[XC, 715]} appear={t5} out={t7 - 18} s={T.floor} c={C.local} />
        <Keyword f={f} text="rider: the storm's own shape" at={[XC, 790]} appear={t6} s={T.floor} />
        <Keyword f={f} text="a storm's own structure" at={[XC, 715]} appear={t7} s={T.floor} c={C.gold} />
      </Svg>
      <CalcStack f={f} x={XC} y={520} size={44} maxLines={3} o={fout(f, AT(k, 2, "about five") - 10)} rows={[
        { rhs: String.raw`\text{middle: }\mathbf U\cdot\hat{\boldsymbol\theta}=|\mathbf U|\approx14.6`, at: AT(k, 1, "same way as the spin") },
        { rhs: String.raw`\text{out to }\pm45^\circ:\ \text{average }\cos\approx0.906`, at: AT(k, 1, "same way as the spin") + 40, c: C.muted },
        { rhs: String.raw`14.6\times0.906\approx13.2`, at: AT(k, 1, "adds about thirteen") },
      ]} />
      <TeX s={String.raw`\text{north: against the spin}\approx-13.0`} x={XC} y={690} size={44} c={C.neg} o={win(f, AT(k, 3, "takes away about thirteen"), t5 - 22)} />
      <TeX s={String.raw`\text{south: }18.2-13.2\approx5.0`} x={XC} y={560} size={48} o={fin(f, AT(k, 2, "about five"))} />
      <TeX s={String.raw`\text{north: }6.9-(-13.0)\approx19.9`} x={XC} y={625} size={48} o={fin(f, AT(k, 4, "about twenty"))} />
      <SourceBelow text={SRC_CIA3} pic={CIA_PIC} w={920} name="s11 src" />
    </Scene>
  );
};

// ================================================================ s12 what does not change (ring means), the uniform wind, the Brest gust
const RingPic: React.FC<{ f: number; c: Pt; R: number; storm: boolean; o?: number }> = ({ f, c, R, storm, o = 1 }) => {
  if (o <= 0) return null;
  return <g opacity={o}>
    <circle cx={c[0]} cy={c[1]} r={R} fill="none" stroke={C.first} strokeWidth={4} />
    <circle cx={c[0]} cy={c[1]} r={9} fill={C.gold} />
    {Array.from({ length: 24 }, (_, i) => i * 3).map((i) => { const a = RG.az[i] * D2R, p0: Pt = [c[0] + R * Math.cos(a), c[1] - R * Math.sin(a)];
      const u = RG.u[i] - (storm ? U[0] : 0), v = RG.v[i] - (storm ? U[1] : 0);
      return <AnimatedWindArrow key={i} from={p0} to={[p0[0] + u * 4, p0[1] - v * 4]} speed={Math.hypot(u, v)} f={f} c={storm ? C.key : C.local} px={5} head={18} />; })}{/* Part 1 lessons D1: full winds never teal */}
  </g>;
};
const RPIC = { x: 100, y: 60, w: 880, h: 660 };
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12_invariant");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7), t8 = SS(k, 8), t9 = SS(k, 9), t10 = SS(k, 10);
  const oR = fout(f, t9 - 14, 12), oM = fin(f, t9, 14);
  const cU: Pt = [1460, 400], RU = 140;
  const ua = Math.atan2(U[1], U[0]);                              // U's direction (maths angle, from east)
  const P = mapP(boxCia()), brest = P(BREST[0], BREST[1]);
  return (
    <Scene>
      <Svg>
        <RingPic f={f} c={[300, 330]} R={190} storm={false} o={oR} />
        <RingPic f={f} c={[760, 330]} R={190} storm o={oR} />
        <g opacity={oR}>
          <Lbl x={300} y={95} t="from the ground" c={C.local} s={T.floor} a="middle" />
          <Lbl x={760} y={95} t="riding with the storm" c={C.second} s={T.floor} a="middle" />
          <Lbl x={300} y={600} t="round 14.1 m/s" c={C.first} s={T.floor} a="middle" o={fin(f, AT(k, 2, "fourteen point one"))} />
          <Lbl x={760} y={600} t="round 13.8 m/s" c={C.first} s={T.floor} a="middle" o={fin(f, AT(k, 2, "thirteen point eight"))} />
          <Lbl x={300} y={670} t="inflow ≈ −6 m/s" c={C.neg} s={T.floor} a="middle" o={fin(f, AT(k, 3, "about six"))} />
          <Lbl x={760} y={670} t="inflow ≈ −6 m/s" c={C.neg} s={T.floor} a="middle" o={fin(f, AT(k, 3, "about six") + 8)} />
          <CurvedLink f={f} from={[470, 590]} to={[590, 590]} start={AT(k, 2, "thirteen point eight") + 10} bend={50} />
          <Lbl x={530} y={520} t="same" c={C.gold} s={T.floor} a="middle" o={fin(f, AT(k, 2, "thirteen point eight") + 22)} />
        </g>
        {/* a steady, uniform wind U on a circle: its round part is + on one side and − on the other (sum 0 on a flat circle) */}
        <g opacity={fin(f, t5) * fout(f, t9 - 14, 12)}>
          <path d={arcD(cU, RU, (ua - Math.PI / 2) / D2R + 3, (ua + Math.PI / 2) / D2R - 3)} fill="none" stroke={C.first} strokeWidth={18} opacity={0.55} />
          <path d={arcD(cU, RU, (ua + Math.PI / 2) / D2R + 3, (ua + 1.5 * Math.PI) / D2R - 3)} fill="none" stroke={C.neg} strokeWidth={18} opacity={0.55} strokeDasharray="14 8" />
          <circle cx={cU[0]} cy={cU[1]} r={RU} fill="none" stroke={C.local} strokeWidth={3} />
          {Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4, p0: Pt = [cU[0] + RU * Math.cos(a), cU[1] - RU * Math.sin(a)];
            return <Arrow key={i} p={p0} q={[p0[0] + 64 * Math.cos(ua), p0[1] - 64 * Math.sin(ua)]} color={C.second} w={6} head={22} />; })}
          <Lbl x={cU[0] + (RU + 60) * Math.cos(ua + Math.PI / 2)} y={cU[1] - (RU + 60) * Math.sin(ua + Math.PI / 2)} t="+" c={C.first} s={T.key} a="middle" />
          <Lbl x={cU[0] - (RU + 60) * Math.cos(ua + Math.PI / 2)} y={cU[1] + (RU + 60) * Math.sin(ua + Math.PI / 2)} t="−" c={C.neg} s={T.key} a="middle" />
        </g>
        <Keyword f={f} text="what changes, what doesn't?" at={[XC, 150]} appear={0} out={t1 - 18} s={T.floor} />
        <Keyword f={f} text="each point: changes by U" at={[XC, 150]} appear={t1} out={t4 - 18} s={T.floor} />
        <Keyword f={f} text="no accident" at={[XC, 150]} appear={t4} out={t9 - 18} s={T.floor} c={C.gold} />
        <Keyword f={f} text="flat map: adds exactly 0" at={[XC, 660]} appear={t6} out={t8 - 18} s={T.floor} />
        <Keyword f={f} text="round Earth: 0.3" at={[XC, 730]} appear={t7} out={t8 - 18} s={T.floor} />
        <Keyword f={f} text="spin: the storm's" at={[XC, 660]} appear={t8} out={t9 - 18} s={T.floor} c={C.first} />
        <Keyword f={f} text="motion: the whole pattern" at={[XC, 730]} appear={t8 + 10} out={t9 - 18} s={T.floor} c={C.second} />
        <Keyword f={f} text="a house: the ground wind" at={[XC, 150]} appear={t9} s={T.floor} />
      </Svg>
      {/* remake 2026-11-07 (R16): Part 1's ring average, N = 72 points every 5° (as here) */}
      <Recall f={f} tex={String.raw`\bar u_\theta=\dfrac{1}{N}\sum_{i=1}^{N}u_{\theta,i},\ \ N=72`} name="ring averages" x={XC} y={300} size={46}
        appear={AT(k, 2, "ring average")} out={t4 - 18} />
      <SourceBelow text={SRC_CIA3} pic={RPIC} w={880} o={oR} name="s12 src a" />
      <CiaMap f={f} h={6} o={oM} id="cia12">
        {() => <HouseIcon x={brest[0]} y={brest[1] - 6} s={0.9} />}
      </CiaMap>
      <Svg>
        <Place p={brest} t="Brest" r={0} dx={-30} dy={40} a="end" o={oM} />
        <SideCallout f={f} lines={["gust 84 kt", "≈ 156 km/h"]} at={[XC + 30, 300]} appear={AT(k, 10, "eighty four knots")} target={[brest[0] + 22, brest[1] - 22]} s={T.key} c={C.local} bend={30} />
        <SpeedBar x={XC} y={780} o={oM} />
      </Svg>
      <TeX s={String.raw`84\ \text{kt}\times1.852\approx156\ \text{km/h}`} x={XC} y={470} size={48} o={fin(f, AT(k, 10, "about a hundred"))} />
      <SourceBelow text="Data: ERA5 (Copernicus C3S) · ISD (NOAA NCEI), Brest · 2 Nov 2023, 03 UTC" pic={CIA_PIC} w={920} o={oM} name="s12 src b" />
    </Scene>
  );
};

export const SCENES_B: Record<string, React.FC> = {
  s08_ciaran: S08, s09_lopsided: S09, s10_storm_relative: S10, s11_round_parts: S11, s12_invariant: S12,
};
void [LEN, clamp, nf, SRC_CIA];
