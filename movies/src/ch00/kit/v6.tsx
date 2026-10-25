// v6 kit for the Chapter-0 dot-product movie (storyboard composition_changes): CurvedLink, TimeGraph, SunGlyph.
// Pure functions of their props (frame passed in): deterministic. Candidates for promotion to movies/src/house/.
import React from "react";
import { ramp } from "../../house";
import { Lbl, Pt, clamp } from "./draw";
import { C } from "./type";

/**
 * CurvedLink: a gold quadratic Bezier arrow (5-px stroke, open 18-px chevron) from an anchor on the picture to an anchor
 * in the maths zone. Draws over 12 frames from `start`, fades over 8 frames from `end`. `bend` = px of the control point
 * off the chord's midpoint (positive = towards the top of the screen). `o` scales the whole link (e.g. 0.4 when dimmed).
 */
export const CurvedLink: React.FC<{ f: number; from: Pt; to: Pt; start: number; end?: number; bend?: number; o?: number; ctl?: Pt }> = ({
  f, from, to, start, end, bend = 120, o = 1, ctl: ctlIn,
}) => {
  const d = clamp((f - start) / 12, 0, 1);
  const op = o * (end !== undefined ? 1 - ramp(f, end, end + 8) : 1);
  if (d <= 0 || op <= 0) return null;
  const dx = to[0] - from[0], dy = to[1] - from[1], L = Math.hypot(dx, dy) || 1;
  let nx = -dy / L, ny = dx / L;
  if (ny > 0) { nx = -nx; ny = -ny; } // the normal that points up the screen
  const ctl: Pt = ctlIn ?? [(from[0] + to[0]) / 2 + nx * bend, (from[1] + to[1]) / 2 + ny * bend];
  const path = `M ${from[0]} ${from[1]} Q ${ctl[0]} ${ctl[1]} ${to[0]} ${to[1]}`;
  const tx = to[0] - ctl[0], ty = to[1] - ctl[1], tl = Math.hypot(tx, ty) || 1, ux = tx / tl, uy = ty / tl;
  const rot = (a: number): Pt => [-ux * Math.cos(a) + uy * Math.sin(a), -ux * Math.sin(a) - uy * Math.cos(a)];
  const h1 = rot(0.5), h2 = rot(-0.5), hl = 18;
  const head = `${to[0] + h1[0] * hl},${to[1] + h1[1] * hl} ${to[0]},${to[1]} ${to[0] + h2[0] * hl},${to[1] + h2[1] * hl}`;
  return (
    <g opacity={op}>
      <path d={path} fill="none" stroke={C.bg} strokeWidth={11} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - d} strokeLinecap="round" />
      <path d={path} fill="none" stroke={C.gold} strokeWidth={5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - d} strokeLinecap="round" />
      {d >= 1 ? <polyline points={head} fill="none" stroke={C.gold} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
    </g>
  );
};

/** one series of a TimeGraph: samples (t_h, T_C), drawn up to hour `upto` (never extrapolated) */
export type TGSeries = { t: number[]; T: number[]; upto: number; c: string; dash?: boolean; o?: number;
  pts?: { h: number; o: number }[]; end?: { text: string; o?: number; dx?: number; dy?: number; a?: "start" | "middle" | "end"; s?: number; c?: string } };

/**
 * TimeGraph: axes t = 0..tMax h (x) and T (y) with ticks (44 px) and axis words, up to two series; the pole series is
 * dashed, the balloon series solid (colour never alone). `thumb` = no ticks, no axis words.
 */
export const TimeGraph: React.FC<{ x: number; y: number; w: number; h: number; tMax?: number; Tr: [number, number];
  series: TGSeries[]; thumb?: boolean; o?: number; Tticks?: number[] }> = ({ x, y, w, h, tMax = 3, Tr, series, thumb = false, o = 1, Tticks = [12.5, 13.0, 13.5] }) => {
  if (o <= 0) return null;
  const X = (t: number) => x + (t / tMax) * w, Y = (T: number) => y + h - ((T - Tr[0]) / (Tr[1] - Tr[0])) * h;
  const lw = thumb ? 4 : 6;
  return (
    <g opacity={o}>
      <line x1={x} y1={y + h} x2={x + w + 10} y2={y + h} stroke={C.muted} strokeWidth={3} />
      <line x1={x} y1={y - 10} x2={x} y2={y + h} stroke={C.muted} strokeWidth={3} />
      {!thumb ? <>
        {Array.from({ length: tMax + 1 }, (_, k) => (
          <g key={`t${k}`}>
            <line x1={X(k)} y1={y + h} x2={X(k)} y2={y + h + 10} stroke={C.muted} strokeWidth={3} />
            <Lbl x={X(k)} y={y + h + 36} t={`${k}`} c={C.muted} s={52} a="middle" b={false} />
          </g>
        ))}
        <Lbl x={X(tMax) + 40} y={y + h + 36} t="time (h)" c={C.muted} s={52} a="start" b={false} />
        {Tticks.map((T) => (
          <g key={`T${T}`}>
            <line x1={x - 10} y1={Y(T)} x2={x} y2={Y(T)} stroke={C.muted} strokeWidth={3} />
            <line x1={x} y1={Y(T)} x2={x + w} y2={Y(T)} stroke={C.grid} strokeWidth={1.5} />
            <Lbl x={x - 16} y={Y(T)} t={T.toFixed(1)} c={C.muted} s={52} a="end" b={false} />
          </g>
        ))}
        <Lbl x={x - 16} y={y - 40} t="T (°C)" c={C.muted} s={52} a="end" b={false} />
      </> : null}
      {series.map((S, i) => {
        const so = S.o ?? 1;
        if (so <= 0) return null;
        const up = clamp(S.upto, 0, tMax);
        const pts: string[] = [];
        for (let k = 0; k < S.t.length; k++) {
          if (S.t[k] > up + 1e-9) {
            if (k > 0) { // interpolate the last piece to `up`
              const a = S.t[k - 1], b = S.t[k], wgt = (up - a) / (b - a);
              pts.push(`${X(up)},${Y(S.T[k - 1] + (S.T[k] - S.T[k - 1]) * wgt)}`);
            }
            break;
          }
          pts.push(`${X(S.t[k])},${Y(S.T[k])}`);
        }
        const Tend = (() => { // value at `up`
          let k = 0;
          while (k < S.t.length - 1 && S.t[k + 1] < up) k++;
          if (k >= S.t.length - 1) return S.T[S.T.length - 1];
          const wgt = (up - S.t[k]) / (S.t[k + 1] - S.t[k]);
          return S.T[k] + (S.T[k + 1] - S.T[k]) * clamp(wgt, 0, 1);
        })();
        const at = (hh: number) => { // value at whole hour hh
          let k = 0;
          while (k < S.t.length - 1 && S.t[k + 1] <= hh) k++;
          return S.T[Math.min(k, S.T.length - 1)];
        };
        return (
          <g key={i} opacity={so}>
            {pts.length > 1 ? <polyline points={pts.join(" ")} fill="none" stroke={S.c} strokeWidth={lw} strokeDasharray={S.dash ? "16 10" : undefined}
              strokeLinecap="round" strokeLinejoin="round" /> : null}
            {(S.pts ?? []).map((p, k) => p.o > 0 ? <circle key={k} cx={X(p.h)} cy={Y(at(p.h))} r={thumb ? 5 : 7} fill={S.c} stroke={C.bg} strokeWidth={2} opacity={p.o} /> : null)}
            {S.end && (S.end.o ?? 1) > 0 ? <Lbl x={X(up) + (S.end.dx ?? 16)} y={Y(Tend) + (S.end.dy ?? 0)} t={S.end.text} c={S.end.c ?? S.c}
              s={S.end.s ?? 44} a={S.end.a ?? "start"} o={S.end.o ?? 1} /> : null}
          </g>
        );
      })}
    </g>
  );
};
export const tgXY = (x: number, y: number, w: number, h: number, Tr: [number, number], tMax = 3) => ({
  X: (t: number) => x + (t / tMax) * w, Y: (T: number) => y + h - ((T - Tr[0]) / (Tr[1] - Tr[0])) * h,
});

/** SunGlyph: a small illustrative sun (64 px), static rays (no animation) */
export const SunGlyph: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: 8 }, (_, k) => {
      const a = (k * Math.PI) / 4;
      return <line key={k} x1={x + Math.cos(a) * 20 * s} y1={y + Math.sin(a) * 20 * s} x2={x + Math.cos(a) * 31 * s} y2={y + Math.sin(a) * 31 * s}
        stroke={C.gold} strokeWidth={5 * s} strokeLinecap="round" />;
    })}
    <circle cx={x} cy={y} r={14 * s} fill={C.gold} />
  </g>
);
