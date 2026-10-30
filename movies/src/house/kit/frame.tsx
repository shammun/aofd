// House kit §5b frame pieces (UF2, 2026-10-29; HOUSE_STYLE §5b "zoom-reveal", user feedback round 2 G1-G4):
//   K1 GlobeFrame   the zoom-reveal frame of the house globe (numbers measured from cross-product v5 s33 `Vignette`)
//   K2 SourceBelow  a data-source line placed under (or beside) the picture's own box, never on it
//   K3 Callout      a readout / keyword about a feature of a picture, placed in the free zone with a gold link to the feature
// All three are SVG, pure functions of their props (no state), and publish K6 masks for the `overlap` QA gate
// (house/kit/bbox.tsx → tools/movie_qa.py). Put GlobeFrame AFTER the picture and BEFORE the text layers.
import React from "react";
import { ramp } from "..";
import { CurvedLink } from "./extras";
import { Lbl, Pt, Svg, textW } from "./draw";
import { C, FONT } from "./type";

/** The measured §5b numbers (cross-product v5 s33 `Vignette`, bottom fade raised for the source line). */
export const FRAME = {
  edge: 60,                    // top / left / right-edge fades (px)
  right: { x0: 980, x1: 1160, a: 0.82 },   // the dark panel behind the keyword column: 0 → 82 % over x 980-1160, then flat 82 %
  bottom: { y0: 760, y1: 830 },            // bottom fade; solid background below y 830 (the source line at y ≈ 852 sits on it)
  sharp: { x0: 40, y0: 40, x1Right: 1068, x1: 1880, y1: 788 },  // where the fade alpha is < 0.4 (the K6 no-text region)
  srcY: 852,                   // centre of a one-line source line under a full-bleed picture
} as const;

export type Box = { x: number; y: number; w: number; h: number };

/**
 * K1 GlobeFrame: draws the house zoom-reveal overlays on top of a full-bleed globe (or terrain, satellite plate, stack).
 *   zoom  0..1  the edge fades (top 0-60, left 0-60, right edge 1860-1920, bottom 760-830 + solid below); 0 = a whole,
 *               unzoomed globe that sits inside its box (no fades needed, house §5b)
 *   right 0..1  the right panel (0 → 82 % over x 980-1160, flat 82 % beyond): ramp it in over 1 s (30 frames) when a zoom or
 *               hover starts and out when it ends; text may then sit on it (the faded rim)
 *   disc        the unzoomed globe's silhouette {c, r} (published as the K6 sharp mask while zoom < 0.5)
 *   bottomAt    where the bottom fade reaches the background (default 830); raise it (e.g. 790) when a two-line source line
 *               must sit below the picture
 * The K6 sharp mask while zoomed is the rectangle where the fades are < 40 % (x 40 … 1068 with the panel, … 1880 without).
 */
export const GlobeFrame: React.FC<{ id: string; zoom: number; right?: number; disc?: { c: Pt; r: number }; o?: number; name?: string; bottomAt?: number }> = ({
  id, zoom, right = 0, disc, o = 1, name = "globe", bottomAt }) => {
  const z = Math.max(0, Math.min(1, zoom)) * o, R = Math.max(0, Math.min(1, right)) * o;
  const { edge, right: P, sharp: S } = FRAME;
  const B = bottomAt === undefined ? FRAME.bottom : { y0: bottomAt - 70, y1: bottomAt };
  // UF2 fix 1 (K6 tuning): a picture fading below half opacity is no longer "sharp" (no mask while it cross-fades away)
  const mask = o < 0.5 ? null : z >= 0.5 ? { name, k: "rect", r: [S.x0, S.y0, R >= 0.5 ? S.x1Right : S.x1, B.y0 + 0.4 * (B.y1 - B.y0)] }
    : disc ? { name, k: "circle", c: disc.c, r: disc.r } : null;
  return (
    <Svg>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.bg} stopOpacity={0} /><stop offset="1" stopColor={C.bg} stopOpacity={1} /></linearGradient>
        <linearGradient id={`${id}t`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={C.bg} stopOpacity={0} /><stop offset="0.55" stopColor={C.bg} stopOpacity={1} /></linearGradient>
        <linearGradient id={`${id}l`} x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor={C.bg} stopOpacity={0} /><stop offset="0.55" stopColor={C.bg} stopOpacity={1} /></linearGradient>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={C.bg} stopOpacity={0} /><stop offset="0.55" stopColor={C.bg} stopOpacity={1} /></linearGradient>
        <linearGradient id={`${id}k`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={C.bg} stopOpacity={0} /><stop offset="1" stopColor={C.bg} stopOpacity={P.a} /></linearGradient>
      </defs>
      {/* UF2 fix 1 (weather review M4 / S18 / S14): the 980-1160 ramp as 30 stepped bands (6 px each, smoothstep alpha) — the url(#…k)
          gradient fill did not paint in the headless renders (only the flat part showed: a hard vertical edge at x 1160) */}
      {R > 0 ? <g opacity={R}>{Array.from({ length: 30 }, (_, i) => { const t = (i + 0.5) / 30, a = P.a * t * t * (3 - 2 * t);
        return <rect key={i} x={P.x0 + (i * (P.x1 - P.x0)) / 30} y={0} width={(P.x1 - P.x0) / 30} height={1080} fill={C.bg} fillOpacity={a} shapeRendering="crispEdges" />; })}
        <rect x={P.x1} y={0} width={1920 - P.x1} height={1080} fill={C.bg} fillOpacity={P.a} /></g> : null}
      {z > 0 ? <g opacity={z}>
        <rect x={0} y={B.y0} width={1920} height={B.y1 - B.y0} fill={`url(#${id}b)`} />
        <rect x={0} y={B.y1} width={1920} height={1080 - B.y1} fill={C.bg} />
        <rect x={0} y={0} width={1920} height={edge} fill={`url(#${id}t)`} />
        <rect x={0} y={0} width={edge} height={1080} fill={`url(#${id}l)`} />
        <rect x={1920 - edge} y={0} width={edge} height={1080} fill={`url(#${id}r)`} />
      </g> : null}
      {mask ? <g data-k6-mask={JSON.stringify(mask)} /> : null}
    </Svg>
  );
};

/** wrap a source line at " · " into ≤ 2 lines that fit `w` px (30 px, or 28 px if needed) */
const wrapSrc = (t: string, w: number): { s: number; lines: string[] } => {
  const W = (x: string, s: number) => textW(x, s) * 0.95; // weight 500 is narrower than textW's semibold estimate
  for (const s of [30, 28]) {
    if (W(t, s) <= w) return { s, lines: [t] };
    // tokens: the " · " parts, and the words of any part wider than the line (glued back with spaces)
    const toks: { t: string; sep: string }[] = [];
    t.split(" · ").forEach((q, i) => { const sep0 = i ? " · " : "";
      if (W(q, s) <= w) toks.push({ t: q, sep: sep0 }); else q.split(" ").forEach((wd, j) => toks.push({ t: wd, sep: j ? " " : sep0 })); });
    const lines: string[] = [];
    let cur = "";
    for (const q of toks) { const nxt = cur ? `${cur}${q.sep}${q.t}` : q.t; if (W(nxt, s) <= w || !cur) cur = nxt; else { lines.push(cur); cur = q.t; } }
    if (cur) lines.push(cur);
    if (lines.length <= 2 || s === 28) return { s, lines };
  }
  return { s: 28, lines: [t] };
};

/**
 * K2 SourceBelow: the data-source line (muted #9aa6bd, 30 px, never spoken) at least `gap` (16) px under the picture's own
 * box `pic` (x, y, w, h in page px), left-aligned with it (or at `x`), wrapped to `w` (default: the box width, ≥ 760 px).
 * `beside`: put it to the right of the box instead, bottom-aligned with the box. Throws when the line would reach the
 * caption band (last line centre > 866 px) — a layout that would print a credit on a picture or in the captions fails
 * the render (house §5b). Publishes a K6 `src` entry (its box and the picture's bottom).
 */
export const SourceLine: React.FC<{ text: string; pic: Box; o?: number; x?: number; w?: number; gap?: number; beside?: boolean; name?: string }> = ({
  text, pic, o = 1, x, w, gap = 16, beside = false, name = "src" }) => {
  const ww = w ?? Math.max(760, pic.w);
  const { s, lines } = wrapSrc(text, ww);
  const lh = s * 1.18;
  const x0 = beside ? pic.x + pic.w + 24 : x ?? pic.x;
  const yTop = beside ? pic.y + pic.h - lines.length * lh : pic.y + pic.h + gap;
  const yc = (k: number) => yTop + s * 0.62 + k * lh;
  const last = yc(lines.length - 1);
  if (!beside && last > 866) throw new Error(`SourceBelow "${text.slice(0, 40)}…": picture box ends at y ${pic.y + pic.h}, line would sit at ${last.toFixed(0)} (> 866)`);
  if (o <= 0) return null;
  return (
    <g opacity={o} data-k6-src={JSON.stringify({ name, pic: [pic.x, pic.y, pic.x + pic.w, pic.y + pic.h] })}>
      {lines.map((ln, k) => <text key={k} x={x0} y={yc(k)} fill={C.muted} fontSize={s} fontFamily={FONT} fontWeight={500} dominantBaseline="central"
        stroke={C.bg} strokeWidth={0.2 * s} strokeLinejoin="round" paintOrder="stroke">{ln}</text>)}
    </g>
  );
};
/** K2 in its own full-frame SVG layer (on top of WebGL views and HTML maps); SourceLine is the <g> for use inside an <Svg>. */
export const SourceBelow: React.FC<{ text: string; pic: Box; o?: number; x?: number; w?: number; gap?: number; beside?: boolean; name?: string }> = (p) =>
  (p.o ?? 1) <= 0 ? null : <Svg><SourceLine {...p} /></Svg>;

/**
 * K3 Callout: a keyword / readout about a spot on a picture, in the free zone (maths zone or a faded rim) with a gold
 * CurvedLink from the text's edge to `target`. `lines` stack downward at 1.25 × size. Place inside <Svg>.
 *   at      [x, y] of the first line (anchor `a`), appear / out frames as Keyword, `target` page px (null = no link)
 */
export const Callout: React.FC<{ f: number; lines: string[] | string; at: Pt; appear: number; out?: number; target?: Pt | null; s?: number; c?: string;
  a?: "start" | "middle" | "end"; bend?: number; o?: number; linkEnd?: number }> = ({ f, lines, at, appear, out, target, s = 54, c = C.key, a = "start", bend = 60, o = 1, linkEnd }) => {
  const L = Array.isArray(lines) ? lines : [lines];
  const op = ramp(f, appear, appear + 8) * (out !== undefined ? 1 - ramp(f, out, out + 10) : 1) * o;
  if (op <= 0) return null;
  const wMax = Math.max(...L.map((t) => textW(t, s)));
  const x0 = a === "start" ? at[0] : a === "end" ? at[0] - wMax : at[0] - wMax / 2;
  const y0 = at[1] - 0.6 * s, y1 = at[1] + (L.length - 1) * 1.25 * s + 0.6 * s;
  let from: Pt | null = null;
  // a target off the frame (a 3-D point behind the camera or outside the content area) gets no link
  const tg = target && Number.isFinite(target[0]) && target[0] >= 30 && target[0] <= 1890 && target[1] >= 30 && target[1] <= 870 ? target : null;
  if (tg) {
    const cx = (x0 + x0 + wMax) / 2, cy = (y0 + y1) / 2;
    const dx = tg[0] - cx, dy = tg[1] - cy;
    const hx = wMax / 2 + 14, hy = (y1 - y0) / 2 + 10;
    const sc = 1 / Math.max(Math.abs(dx) / hx, Math.abs(dy) / hy, 1e-6);
    from = [cx + dx * Math.min(1, sc), cy + dy * Math.min(1, sc)];
  }
  return (
    <g opacity={op}>
      {L.map((t, k) => <Lbl key={k} x={at[0]} y={at[1] + k * 1.25 * s} t={t} c={c} s={s} a={a} />)}
      {tg && from ? <CurvedLink f={f} from={from} to={tg} start={appear + 6} end={linkEnd} bend={bend} /> : null}
    </g>
  );
};
