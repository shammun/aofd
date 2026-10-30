// House kit K7 (UF2, 2026-10-29; HOUSE_STYLE §5b "wind arrows are always animated"):
//   AnimatedWindArrow  an SVG wind arrow whose direction and length come from the data and whose INSIDE moves:
//                      `dash` = marching dashes (tail → head) at k · speed px/s, `pulse` = a bead running tail → head
//   FlowParticles      streaklines along precomputed tracks (fluidpy.diag.trajectories.advect_on_sphere), globe or map
//                      mode through any projector; `bright(lat)` raises the belt being named (cross-product v5 s33 look)
//   BeltChevrons       a row of gold direction chevrons along a latitude belt, pointing the way the wind blows (from data)
// Everything is a pure function of the frame (no state), so renders are deterministic.
import React from "react";
import { Pt } from "./draw";
import { C } from "./type";

/** The house dash speed: k px per second per m/s (a 10 m/s arrow's dashes move 60 px/s); the same in every scene. */
export const WIND_K = 6;

/**
 * AnimatedWindArrow: from → to (page px, from the data vector), `speed` m/s sets the dash speed (dash) or the bead period
 * (pulse: every max(0.6, 12 / speed) s). Head solid (40 px house head, 0.42 half-width). `f` frame, `fps` 30.
 */
export const AnimatedWindArrow: React.FC<{ from: Pt; to: Pt; speed: number; f: number; fps?: number; mode?: "dash" | "pulse"; c?: string; px?: number;
  head?: number; o?: number; k?: number; halo?: boolean }> = ({ from, to, speed, f, fps = 30, mode = "dash", c = C.first, px = 8, head = 30, o = 1, k = WIND_K, halo = true }) => {
  if (o <= 0) return null;
  const dx = to[0] - from[0], dy = to[1] - from[1], L = Math.hypot(dx, dy);
  if (L < 4) return null;
  const ux = dx / L, uy = dy / L, h = Math.min(head, 0.55 * L), hw = 0.42 * h;
  const sx = to[0] - ux * h * 0.8, sy = to[1] - uy * h * 0.8;
  const bx = to[0] - ux * h, by = to[1] - uy * h;
  const shaft = `M${from[0].toFixed(1)} ${from[1].toFixed(1)}L${sx.toFixed(1)} ${sy.toFixed(1)}`;
  const headPts = `${to[0]},${to[1]} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}`;
  const t = f / fps;
  if (mode === "dash") {
    const dl = Math.max(8, 0.18 * L), gl = Math.max(6, 0.12 * L), per = dl + gl;
    const off = -((t * k * speed) % per);
    return (
      <g opacity={o}>
        {halo ? <path d={shaft} fill="none" stroke={C.bg} strokeOpacity={0.6} strokeWidth={px + 5} strokeLinecap="round" /> : null}
        <path d={shaft} fill="none" stroke={c} strokeWidth={px} strokeDasharray={`${dl.toFixed(1)} ${gl.toFixed(1)}`} strokeDashoffset={off.toFixed(2)} strokeLinecap="butt" />
        <polygon points={headPts} fill={c} stroke={C.bg} strokeWidth={2} />
      </g>
    );
  }
  const period = Math.max(0.6, 12 / Math.max(0.1, speed)), ph = (t % period) / period;
  const bead: Pt = [from[0] + (sx - from[0]) * ph, from[1] + (sy - from[1]) * ph];
  const arrive = ph > 0.85 ? (ph - 0.85) / 0.15 : 0;
  return (
    <g opacity={o}>
      {halo ? <path d={shaft} fill="none" stroke={C.bg} strokeOpacity={0.6} strokeWidth={px + 5} strokeLinecap="round" /> : null}
      <path d={shaft} fill="none" stroke={c} strokeWidth={px} strokeLinecap="round" />
      <circle cx={bead[0]} cy={bead[1]} r={0.8 * px} fill={C.key} fillOpacity={0.7} />
      <polygon points={headPts} fill={c} stroke={arrive > 0 ? C.key : C.bg} strokeWidth={2 + 2 * arrive} />
    </g>
  );
};

/** decoded trails (house binary): Int16 (lat, lon) × 100 [N, L, 2], then Uint8 speed × 4 [N, L] (-32768 = gap) */
export type Trails = { n: number; L: number; ll: Int16Array; sp: Uint8Array };
export const decodeTrails = (buf: ArrayBuffer | null, n: number, L: number): Trails | null =>
  buf ? { n, L, ll: new Int16Array(buf, 0, n * L * 2), sp: new Uint8Array(buf, n * L * 4, n * L) } : null;

/** a projector for FlowParticles: (lat, lon) → page px, or null when hidden (behind the globe, outside a map) */
export type LLProj = (lat: number, lon: number) => Pt | null;

/**
 * FlowParticles: at frame `fr` every track i shows its sample (fr + phase_i) mod L and `tail` samples behind it as a
 * fading streak (warm white by default, alpha by speed and age), with a 1-px dark edge so it reads on bright land.
 * Source: `T` (house binary trails, one sample per frame step) or `tracks` (lat/lon lists, [N][L][2]).
 * `bright(lat)` multiplies the alpha (belt highlight: ×1.4 inside, ×0.45 outside); `stride` thins the tracks.
 * The frame → time mapping (e.g. 1 s of screen = 30 min) is fixed per scene by the builder and recorded in its manifest.
 */
export const FlowParticles: React.FC<{ P: LLProj; T?: Trails | null; tracks?: number[][][]; fr: number; tail?: number; o?: number; c?: string; w?: number;
  bright?: (lat: number) => number; stride?: number; vmax?: number; speeds?: number[][] }> = ({
  P, T, tracks, fr, tail = 12, o = 1, c = "#f4ecd2", w = 2, bright, stride = 1, vmax = 10, speeds }) => {
  if (o <= 0 || (!T && !tracks)) return null;
  const NB = 4, NS = 3;
  const paths: string[][] = Array.from({ length: NB * NS }, () => []);
  const n = T ? T.n : tracks!.length;
  for (let i = 0; i < n; i += stride) {
    const L = T ? T.L : tracks![i].length;
    if (L < 2) continue;
    const ph = (i * 37 + (i % 7) * 11) % L;
    const h = (Math.floor(fr) + ph) % L;
    const lifeA = Math.min(1, Math.min(h, L - 1 - h) / 6);
    if (lifeA <= 0) continue;
    let prev: Pt | null = null;
    for (let k = 0; k <= tail && h - k >= 0; k++) {
      const s = h - k;
      let la: number, lo: number, spd: number;
      if (T) {
        const q = i * L + s;
        if (T.ll[2 * q] === -32768) { prev = null; continue; }
        la = T.ll[2 * q] / 100; lo = T.ll[2 * q + 1] / 100; spd = T.sp[q] / 4;
      } else {
        [la, lo] = tracks![i][s] as [number, number]; spd = speeds ? speeds[i][s] : vmax / 2;
        if (!Number.isFinite(la)) { prev = null; continue; }
      }
      const q = P(la, lo);
      if (!q) { prev = null; continue; }
      if (prev && k > 0 && Math.abs(q[0] - prev[0]) + Math.abs(q[1] - prev[1]) < 60) {
        const sb = Math.min(NS - 1, Math.floor((spd / vmax) * NS));
        const ab = Math.min(NB - 1, Math.floor(((k - 1) / tail) * NB));
        const bb = bright ? bright(la) : 1;
        if (bb * lifeA > 0.15) paths[ab * NS + sb].push(`M${prev[0].toFixed(1)} ${prev[1].toFixed(1)}L${q[0].toFixed(1)} ${q[1].toFixed(1)}`);
      }
      prev = q;
    }
  }
  return (
    <g opacity={o}>
      {paths.map((ps, kk) => {
        if (!ps.length) return null;
        const ab = Math.floor(kk / NS), sb = kk % NS;
        const a = (0.35 + 0.6 * ((sb + 0.5) / NS)) * (1 - ab / NB);
        return <g key={kk}><path d={ps.join("")} fill="none" stroke="#0b1020" strokeOpacity={0.55 * a} strokeWidth={w + 2} strokeLinecap="round" />
          <path d={ps.join("")} fill="none" stroke={c} strokeOpacity={Math.min(1, a)} strokeWidth={w} strokeLinecap="round" /></g>;
      })}
    </g>
  );
};

/** the belt-brightness mask of the v5 look: `inside` in |lat| ∈ [a, b] (both hemispheres if sym), `outside` elsewhere */
export const beltBright = (a: number, b: number, inside = 1.4, outside = 0.45, sym = true) => (lat: number) =>
  (lat >= a && lat <= b) || (sym && -lat >= a && -lat <= b) ? inside : outside;

/**
 * BeltChevrons: gold open chevrons every `step` degrees of longitude along latitude `lat` from lon0 to lon1, pointing
 * towards azimuth `toward` (degrees clockwise from north, the way the wind blows TO; from the data's area-mean wind).
 * `P` projects (lat, lon) → px or null (hidden). Static marks (the streaks move).
 */
export const BeltChevrons: React.FC<{ P: LLProj; lat: number; lon0: number; lon1: number; toward: number; step?: number; c?: string; o?: number; size?: number }> = ({
  P, lat, lon0, lon1, toward, step = 10, c = C.gold, o = 1, size = 14 }) => {
  if (o <= 0) return null;
  const az = (toward * Math.PI) / 180, dN = Math.cos(az), dE = Math.sin(az);
  const out: React.ReactNode[] = [];
  for (let lo = lon0; lo <= lon1 + 1e-6; lo += step) {
    const p = P(lat, lo), q = P(lat + dN * 1.2, lo + (dE * 1.2) / Math.max(0.2, Math.cos((lat * Math.PI) / 180)));
    if (!p || !q) continue;
    const ux = q[0] - p[0], uy = q[1] - p[1], L = Math.hypot(ux, uy) || 1, dx = ux / L, dy = uy / L;
    out.push(<polyline key={lo} points={`${p[0] - dy * size - dx * size * 0.7},${p[1] + dx * size - dy * size * 0.7} ${p[0] + dx * size * 0.7},${p[1] + dy * size * 0.7} ${p[0] + dy * size - dx * size * 0.7},${p[1] - dx * size - dy * size * 0.7}`}
      fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />);
  }
  return <g opacity={o}>{out}</g>;
};
