// Keyword (word + gold pointers), TipLabel / placeLabels (labels at arrow tips), Balance (two bars on a zero line).
// v5 components from reports/ch00_v5_analysis_visual.md §2.5, §2.8 and storyboard s19c. SVG; place inside <Svg>.
import React from "react";
import { ramp } from "../../house";
import { Lbl, Pt, clamp, textW, unit } from "./draw";
import { C, floor } from "./type";

type Anchor = "start" | "middle" | "end";
const bbox = (x: number, y: number, t: string, s: number, a: Anchor) => {
  const w = textW(t, s), x0 = a === "start" ? x : a === "end" ? x - w : x - w / 2;
  return { x0, x1: x0 + w, y0: y - 0.58 * s, y1: y + 0.58 * s };
};

/** A keyword in warm white (54 px) with gold pointer curves to its targets; fades in, pointers draw, targets pulse. */
export const Keyword: React.FC<{
  f: number; text: string; at: Pt; a?: Anchor; s?: number; c?: string; appear: number; out?: number; targets?: Pt[];
  bend?: number; halo?: boolean; o?: number; italic?: boolean;
}> = ({ f, text, at, a = "start", s = 54, c = C.key, appear, out, targets = [], bend = 0.22, halo = true, o = 1, italic }) => {
  floor(s, text);
  const oT = ramp(f, appear, appear + 8) * (out !== undefined ? 1 - ramp(f, out, out + 10) : 1) * o;
  if (oT <= 0) return null;
  const rise = 12 * (1 - ramp(f, appear, appear + 8));
  const B = bbox(at[0], at[1], text, s, a);
  const cx = (B.x0 + B.x1) / 2, cy = (B.y0 + B.y1) / 2;
  return (
    <g opacity={oT}>
      {targets.map((tg, k) => {
        // start on the word's box edge facing the target
        const dx = tg[0] - cx, dy = tg[1] - cy;
        const hx = (B.x1 - B.x0) / 2 + 10, hy = (B.y1 - B.y0) / 2 + 8;
        const sc = 1 / Math.max(Math.abs(dx) / hx, Math.abs(dy) / hy, 1e-6);
        const st: Pt = [cx + dx * Math.min(1, sc), cy + dy * Math.min(1, sc)];
        const u = unit(st, tg);
        const en: Pt = [tg[0] - u[0] * 16, tg[1] - u[1] * 16];
        const L = Math.hypot(en[0] - st[0], en[1] - st[1]);
        const sign = targets.length > 1 ? (k % 2 === 0 ? -1 : 1) : 1;
        const ctl: Pt = [(st[0] + en[0]) / 2 - u[1] * L * bend * sign, (st[1] + en[1]) / 2 + u[0] * L * bend * sign];
        const d = clamp((f - appear - 8 - 4 * k) / 10, 0, 1);
        if (d <= 0 || L < 4) return null;
        const tu = unit(ctl, en);
        const ang = 0.5, hl = 20;
        const rot = (v: Pt, t: number): Pt => [v[0] * Math.cos(t) - v[1] * Math.sin(t), v[0] * Math.sin(t) + v[1] * Math.cos(t)];
        const h1 = rot([-tu[0], -tu[1]], ang), h2 = rot([-tu[0], -tu[1]], -ang);
        const pul = halo ? (f >= appear + 18 + 4 * k && f <= appear + 38 + 4 * k ? Math.sin((Math.PI * (f - appear - 18 - 4 * k)) / 20) : 0) : 0;
        return (
          <g key={k}>
            <path d={`M ${st[0]} ${st[1]} Q ${ctl[0]} ${ctl[1]} ${en[0]} ${en[1]}`} fill="none" stroke={C.bg} strokeWidth={10}
              pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - d} strokeLinecap="round" />
            <path d={`M ${st[0]} ${st[1]} Q ${ctl[0]} ${ctl[1]} ${en[0]} ${en[1]}`} fill="none" stroke={C.gold} strokeWidth={5}
              pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - d} strokeLinecap="round" />
            {d >= 1 ? <polyline points={`${en[0] + h1[0] * hl},${en[1] + h1[1] * hl} ${en[0]},${en[1]} ${en[0] + h2[0] * hl},${en[1] + h2[1] * hl}`}
              fill="none" stroke={C.gold} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
            {pul > 0 ? <circle cx={tg[0]} cy={tg[1]} r={30} fill="none" stroke={C.gold} strokeWidth={4} opacity={0.8 * pul} /> : null}
          </g>
        );
      })}
      <Lbl x={at[0]} y={at[1] + rise} t={text} c={c} s={s} a={a} italic={italic} />
    </g>
  );
};

/** Label placement at arrow tips (deterministic, from static geometry; call once per scene, outside the frame loop). */
export type TipReq = { id: string; tail: Pt; tip: Pt; text: string; s?: number; head?: number; prefer?: number[] };
export type TipPos = { x: number; y: number; a: Anchor; s: number; text: string };
export const placeLabels = (reqs: TipReq[], segs: [Pt, Pt][] = [], zone = { x0: 80, x1: 1840, y0: 40, y1: 860 }): Record<string, TipPos> => {
  const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
  const out: Record<string, TipPos> = {};
  const hitSeg = (b: { x0: number; x1: number; y0: number; y1: number }, pad: number) =>
    segs.some(([p, q]) => {
      for (let i = 0; i <= 24; i++) {
        const x = p[0] + ((q[0] - p[0]) * i) / 24, y = p[1] + ((q[1] - p[1]) * i) / 24;
        if (x > b.x0 - pad && x < b.x1 + pad && y > b.y0 - pad && y < b.y1 + pad) return true;
      }
      return false;
    });
  for (const r of reqs) {
    const s = r.s ?? 54, head = r.head ?? 40;
    const u = unit(r.tail, r.tip), n: Pt = [u[1], -u[0]];
    const d = head * 0.6 + 16;
    const along = (): [number, number, Anchor] => {
      const x = r.tip[0] + u[0] * d, y = r.tip[1] + u[1] * d + u[1] * s * 0.35;
      return [x, y, u[0] > 0.35 ? "start" : u[0] < -0.35 ? "end" : "middle"];
    };
    const cands: [number, number, Anchor][] = [
      along(),
      [r.tip[0] + u[0] * d * 0.4 + n[0] * s * 0.95, r.tip[1] + u[1] * d * 0.4 + n[1] * s * 0.95, n[0] > 0.35 ? "start" : n[0] < -0.35 ? "end" : "middle"],
      [r.tip[0] + u[0] * d * 0.4 - n[0] * s * 0.95, r.tip[1] + u[1] * d * 0.4 - n[1] * s * 0.95, -n[0] > 0.35 ? "start" : -n[0] < -0.35 ? "end" : "middle"],
      [r.tip[0], r.tip[1] - s * 1.0, "middle"],
      [r.tip[0], r.tip[1] + s * 1.0, "middle"],
    ];
    const order = r.prefer ?? [0, 1, 2, 3, 4];
    let pick = cands[order[0]];
    for (const k of order) {
      const [x, y, a] = cands[k];
      const b = bbox(x, y, r.text, s, a);
      const inZone = b.x0 >= zone.x0 && b.x1 <= zone.x1 && b.y0 >= zone.y0 && b.y1 <= zone.y1;
      const clash = placed.some((q) => !(b.x1 + 10 < q.x0 || b.x0 - 10 > q.x1 || b.y1 + 6 < q.y0 || b.y0 - 6 > q.y1));
      if (inZone && !clash && !hitSeg(b, s * 0.15)) { pick = cands[k]; break; }
    }
    const [x, y, a] = pick;
    placed.push(bbox(x, y, r.text, s, a));
    out[r.id] = { x, y, a, s, text: r.text };
  }
  return out;
};
export const TipLabel: React.FC<{ p: TipPos; c: string; o?: number }> = ({ p, c, o = 1 }) =>
  <Lbl x={p.x} y={p.y} t={p.text} c={c} s={p.s} a={p.a} o={o} />;

/** Balance (s19c): two bars on one zero line; right = +value (teal), left = −value (rose, hatched, with "−"). */
export const Balance: React.FC<{ x0: number; y: number; scale: number; plus: number; minus: number; gPlus: number; gMinus: number;
  o?: number; id: string; h?: number }> = ({ x0, y, scale, plus, minus, gPlus, gMinus, o = 1, id, h = 56 }) => {
  if (o <= 0) return null;
  const wp = plus * scale * gPlus, wm = Math.abs(minus) * scale * gMinus;
  return (
    <g opacity={o}>
      <defs>
        <pattern id={id} width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={16} height={16} fill={C.neg} fillOpacity={0.35} />
          <line x1={0} y1={0} x2={0} y2={16} stroke={C.neg} strokeWidth={6} />
        </pattern>
      </defs>
      <line x1={x0 - Math.abs(minus) * scale - 40} y1={y + h / 2 + 10} x2={x0 + plus * scale + 40} y2={y + h / 2 + 10} stroke={C.muted} strokeWidth={3} />
      {wp > 0 ? <rect x={x0} y={y - h / 2} width={wp} height={h} fill={C.first} fillOpacity={0.85} /> : null}
      {wm > 0 ? <rect x={x0 - wm} y={y - h / 2} width={wm} height={h} fill={`url(#${id})`} stroke={C.neg} strokeWidth={4} strokeDasharray="12 8" /> : null}
      <line x1={x0} y1={y - h / 2 - 22} x2={x0} y2={y + h / 2 + 22} stroke={C.ink} strokeWidth={5} />
    </g>
  );
};
