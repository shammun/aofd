// TwoViewSlice (new for Part 3; storyboard s08, s14-s17, s19, s22-s24; promote to house/kit on second use): the three.js cut Earth
// on the left (x 80-940) and the same cut face drawn flat on the right; ONE item list {kind, frame} drives both views, so every
// item (centre, axis, equator line, arrow, angle arc, dropped line, right-angle tick, leg, length label) appears in both on the
// same frame, and a short gold "same" pulse marks the newest item in both copies for 1 s. Items live in face coordinates (u, v):
// the 3-D view maps them through the globe camera (face3), the flat view through faceFlat(c, R). Labels are spot labels beside
// their legs (never on a line); per-view offsets where the two pictures need different room. SVG for lines, HTML for KaTeX.
import React from "react";
import { C, T } from "../house/kit/type";
import { Arrow, Pt, Svg } from "../house/kit/draw";
import { GlobeCam, GProj } from "./kit_cs/globe";
import { V3 } from "./kit_cs/cam";
import { Cut } from "./kit_cs/earth";
import {
  BREST, Box, D2R, Earth, FP, Face, Lbl, SRC_BM, SameMark, TV3, TeX, face3, faceArc, faceFlat, faceTick, faceWedge, fin, fout, globeG, ll, merFace,
} from "./cs_lib";
import { SourceBelow } from "../house/kit/frame";

export type UV = [number, number];
type Base = { at: number; out?: number; o?: number; only?: "3" | "2"; same?: boolean; n?: number };
export type FItem = Base & (
  | { k: "dot"; p: UV; c: string; r?: number }
  | { k: "seg"; a: UV; b: UV; c: string; w?: number; dash?: string; grow?: number }
  | { k: "arrow"; a: UV; b: UV; c: string; w?: number; head?: number; grow?: number }
  | { k: "arc"; cu?: number; cv?: number; r: number; a0: number; a1: number; c: string; w?: number; px?: number }
  | { k: "wedge"; r: number; a0: number; a1: number; c: string; fo?: number; px?: number }
  | { k: "tick"; p: UV; d1: UV; d2: UV; s: number; c?: string }
  | { k: "fill"; pts: UV[]; c: string; fo?: number }
  | { k: "lbl"; p: UV; t: string; t2?: string; c?: string; s?: number; dx?: number; dy?: number; a?: "start" | "middle" | "end"; dx3?: number; dy3?: number; a3?: "start" | "middle" | "end" }
  | { k: "tex"; p: UV; t: string; t2?: string; c?: string; size?: number; dx?: number; dy?: number; ax?: number; dx3?: number; dy3?: number; ax3?: number }
  | { k: "band"; a: UV; b: UV; c: string; w?: number; fo?: number }
);

const anchorOf = (it: FItem): UV => {
  switch (it.k) {
    case "dot": case "tick": case "lbl": case "tex": return it.p;
    case "seg": case "arrow": case "band": return [(it.a[0] + it.b[0]) / 2, (it.a[1] + it.b[1]) / 2];
    case "arc": case "wedge": { const r = it.r * 0.7, m = ((it.a0 + it.a1) / 2) * D2R; return [("cu" in it ? it.cu ?? 0 : 0) + r * Math.cos(m), ("cv" in it ? it.cv ?? 0 : 0) + r * Math.sin(m)]; }
    case "fill": return [it.pts.reduce((s, p) => s + p[0], 0) / it.pts.length, it.pts.reduce((s, p) => s + p[1], 0) / it.pts.length];
  }
  return [0, 0];
};
const opOf = (f: number, it: FItem) => fin(f, it.at, it.n ?? 12) * (it.out !== undefined ? fout(f, it.out) : 1) * (it.o ?? 1);
/** the SVG of the items in one view (P maps face (u, v) to page px; `pxs` scales a face-unit radius given in px of the flat view) */
export const FaceSvg: React.FC<{ f: number; P: FP; items: FItem[]; which: "3" | "2"; R: number }> = ({ f, P, items, which, R }) => {
  const out: React.ReactNode[] = [];
  let newest = -1;
  items.forEach((it, i) => { if (it.same !== false && f >= it.at && f < it.at + 30 && (newest < 0 || it.at >= items[newest].at)) newest = i; });
  items.forEach((it, i) => {
    if (it.only && it.only !== which) return;
    const o = opOf(f, it);
    if (o <= 0) return;
    const pr = (p: UV) => P(p[0], p[1]);
    switch (it.k) {
      case "dot": { const q = pr(it.p); out.push(<circle key={i} cx={q[0]} cy={q[1]} r={it.r ?? 10} fill={it.c} stroke={C.bg} strokeWidth={3} opacity={o} />); break; }
      case "seg": { const g = it.grow ?? 1, b: UV = [it.a[0] + (it.b[0] - it.a[0]) * g, it.a[1] + (it.b[1] - it.a[1]) * g];
        const p = pr(it.a), q = pr(b);
        out.push(<line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={it.c} strokeWidth={it.w ?? 6} strokeDasharray={it.dash} strokeLinecap="round" opacity={o} />); break; }
      case "arrow": { const g = it.grow ?? 1, b: UV = [it.a[0] + (it.b[0] - it.a[0]) * g, it.a[1] + (it.b[1] - it.a[1]) * g];
        out.push(<Arrow key={i} p={pr(it.a)} q={pr(b)} color={it.c} w={it.w ?? 10} head={it.head ?? 36} o={o} />); break; }
      case "arc": { const r = it.px !== undefined ? it.px / R : it.r;
        out.push(<path key={i} d={faceArc(P, it.cu ?? 0, it.cv ?? 0, r, it.a0, it.a1)} fill="none" stroke={it.c} strokeWidth={it.w ?? 7} strokeLinecap="round" opacity={o} />); break; }
      case "wedge": { const r = it.px !== undefined ? it.px / R : it.r;
        out.push(<path key={i} d={faceWedge(P, r, it.a0, it.a1)} fill={it.c} fillOpacity={it.fo ?? 0.18} stroke="none" opacity={o} />); break; }
      case "tick": out.push(<path key={i} d={faceTick(P, it.p[0], it.p[1], it.d1, it.d2, it.s)} fill="none" stroke={it.c ?? C.ink} strokeWidth={4} opacity={o} />); break;
      case "fill": out.push(<path key={i} d={it.pts.map((p, j) => `${j ? "L" : "M"}${pr(p)[0].toFixed(1)} ${pr(p)[1].toFixed(1)}`).join("") + "Z"} fill={it.c} fillOpacity={it.fo ?? 0.1}
        stroke="none" opacity={o} />); break;
      case "band": { const p = pr(it.a), q = pr(it.b);
        out.push(<line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={it.c} strokeWidth={it.w ?? 18} strokeOpacity={it.fo ?? 0.55} strokeLinecap="round" opacity={o} />); break; }
      case "lbl": { const q = pr(it.p), dx = which === "3" ? it.dx3 ?? it.dx ?? 0 : it.dx ?? 0, dy = which === "3" ? it.dy3 ?? it.dy ?? 0 : it.dy ?? 0;
        out.push(<g key={i} data-lc-maplabel="1" data-lc-own={which === "2" ? "face2" : undefined}><Lbl x={q[0] + dx} y={q[1] + dy} t={which === "2" ? it.t2 ?? it.t : it.t} c={it.c ?? C.key} s={it.s ?? T.floor} a={which === "3" ? it.a3 ?? it.a ?? "start" : it.a ?? "start"} o={o} /></g>); break; }
      default: break;
    }
  });
  if (newest >= 0 && (!items[newest].only || items[newest].only === which)) out.push(<SameMark key="same" f={f} at={items[newest].at} p={P(...anchorOf(items[newest]))} />);
  return <>{out}</>;
};
/** the KaTeX labels of the items in one view (HTML layer) */
export const FaceTex: React.FC<{ f: number; P: FP; items: FItem[]; which: "3" | "2" }> = ({ f, P, items, which }) => (
  <>{items.map((it, i) => {
    if (it.k !== "tex" || (it.only && it.only !== which)) return null;
    const o = opOf(f, it);
    if (o <= 0) return null;
    const q = P(it.p[0], it.p[1]);
    const dx = which === "3" ? it.dx3 ?? it.dx ?? 0 : it.dx ?? 0, dy = which === "3" ? it.dy3 ?? it.dy ?? 0 : it.dy ?? 0, ax = which === "3" ? it.ax3 ?? it.ax ?? 0.5 : it.ax ?? 0.5;
    return <TeX key={i} s={which === "2" ? it.t2 ?? it.t : it.t} x={q[0] + dx} y={q[1] + dy} size={it.size ?? 54} c={it.c ?? C.key} ax={ax} o={o} halo />;
  })}</>
);

/** The two views. `flatBase(P)` / `base3(G, P)` draw the static outline of each view (half-disc, rim …) under the items. */
export const TwoView: React.FC<{ f: number; cam: GlobeCam; cut: Cut; face: Face; flatC: Pt; flatR: number; items: FItem[]; flatO?: number; o3?: number;
  base3?: (G: GProj, P: FP) => React.ReactNode; flatBase?: (P: FP) => React.ReactNode; box?: Box; alpha?: number; three?: React.ReactNode; src?: number;
  extra3?: (G: GProj, P: FP) => React.ReactNode; extraFlat?: (P: FP) => React.ReactNode }> = ({
  f, cam, cut, face, flatC, flatR, items, flatO = 1, o3 = 1, base3, flatBase, box = TV3, alpha = 1, three, src = 1, extra3, extraFlat }) => {
  const G = globeG(cam, box);
  const P3 = face3(G, face), P2 = faceFlat(flatC, flatR);
  const R3 = Math.hypot(P3(1, 0)[0] - P3(0, 0)[0], P3(1, 0)[1] - P3(0, 0)[1]);
  return (
    <>
      <Earth cam={cam} box={box} cut={cut} alpha={alpha} o={o3} coast={0} three={three}
        over={(Gg) => <>
          {base3 ? base3(Gg, P3) : null}
          <FaceSvg f={f} P={P3} items={items} which="3" R={R3} />
          {extra3 ? extra3(Gg, P3) : null}
        </>} />
      <FaceTex f={f} P={P3} items={items} which="3" />
      <Svg o={flatO}>
        {flatBase ? flatBase(P2) : null}
        <FaceSvg f={f} P={P2} items={items} which="2" R={flatR} />
        {extraFlat ? extraFlat(P2) : null}
      </Svg>
      {/* K6 k6r1: the flat face's labels own its half-disc fill (labels drawn on their own diagram's ground); its rim, axis and legs stay checked */}
      {flatO > 0 ? <div data-lc-own="face2" style={{ position: "absolute", inset: 0, opacity: flatO }}><FaceTex f={f} P={P2} items={items} which="2" /></div> : null}
      <SourceBelow text={SRC_BM} pic={box} x={Math.max(60, box.x)} w={880} o={src * o3} name="two-view src" />{/* still review: inside the x 60 margin */}
    </>
  );
};

// ---------------------------------------------------------------- the standard cuts and cameras
export const LON0 = BREST[1];
export const PHI = BREST[0];
const nrm = (v: V3): V3 => { const n = Math.hypot(...v) || 1; return [v[0] / n, v[1] / n, v[2] / n]; };
/** pass 2: the removed half moves a little to the right (0.2 radii, inside the frame's spare room) while it fades out in place */
export const slideDir = (lon0: number): V3 => nrm(ll(0, lon0));
export const merCut = (slide: number, lon0 = LON0): Cut => ({ kind: "mer", lon0, slide, dir: slideDir(lon0) });
/** the meridian face seen from its west side, M (the equator line) to the right. Pass 2 (user 2026-11-07, old 5:59-8:49, 15:22-16:00, 28:23,
 * 29:39): 15° from frontal showed only the flat section, "a blank circle, not the Earth". Now 50° from frontal and 12° above the equator
 * (the cross-product Part 2 half-Earth used 38° / 12°): the Blue Marble outside of the kept half shows as a crescent right of the section
 * (Europe and Africa next to Brest's rim), about a third of a radius wide, so it reads as an Earth cut open (40° gave a thin sliver in the
 * first look stills); the flat twin keeps the true angles. */
export const camFace = (lon0 = LON0, dist = 3.3): GlobeCam => ({ lat: 12, lon: lon0 - 40, dist });
export const FACE_B = merFace(LON0);
/** the top view: from above the North Pole (x̂ to the right, ŷ up the screen), the face tilted 20° so it reads as a disc */
export const CAM_TOP: GlobeCam = { lat: 70, lon: -90, dist: 3.3 };
/** flat-view placement for TwoViewSlice (right of x 980; calculations below y 600) */
export const FLAT_C: Pt = [1120, 320], FLAT_R = 200;
export const TOP_C: Pt = [1210, 330], TOP_R = 200;
/** the static outline of the meridian half-disc (flat): rim from the South Pole to the North Pole through the equator, the axis */
export const MerFlatBase: React.FC<{ P: FP; o?: number; fill?: boolean }> = ({ P, o = 1, fill = true }) => o <= 0 ? null : (
  <g opacity={o}>
    {fill ? <g data-lc-own="face2"><path d={`${faceArc(P, 0, 0, 1, -90, 90, 90)}Z`} fill="#4a3d36" fillOpacity={0.55} stroke="none" /></g> : null}
    <path d={faceArc(P, 0, 0, 1, -90, 90, 90)} fill="none" stroke={C.muted} strokeWidth={4} />
    <line x1={P(0, -1)[0]} y1={P(0, -1)[1]} x2={P(0, 1)[0]} y2={P(0, 1)[1]} stroke={C.grid} strokeWidth={3} />
  </g>
);
/** the static outline of a full disc (flat): the equator face or a parallel's disc */
export const DiscFlatBase: React.FC<{ P: FP; o?: number; rim?: string }> = ({ P, o = 1, rim = C.muted }) => o <= 0 ? null : (
  <g opacity={o}>
    <g data-lc-own="face2"><path d={`${faceArc(P, 0, 0, 1, 0, 360, 120)}Z`} fill="#4a3d36" fillOpacity={0.55} stroke="none" /></g>
    <path d={`${faceArc(P, 0, 0, 1, 0, 360, 120)}Z`} fill="none" stroke={rim} strokeWidth={4} />
  </g>
);
export const ptOf = (P: FP, p: UV): Pt => P(p[0], p[1]);
export { faceArc, faceFlat, face3, Arrow };
