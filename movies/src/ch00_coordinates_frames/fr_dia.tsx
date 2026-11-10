// ch00_coordinates_frames: the code-drawn diagrams shared by several scenes (schematic; every angle and direction from the
// stated formulas): the top view from above the North Pole (s05, s18, s21), the meridian slice (s06, s19, s20, s21), Part 2's
// circle (s16), the 3 × 3 "which motion turns which arrow" grid (s17, s22), a pseudo-3-D tripod (s22, s24, s28), the log-scale
// size bars (s27, s28) and the coast arrows (s00, s10, s14, s28). SVG <g> pieces: place inside <Svg>.
import React from "react";
import { C, T } from "../house/kit/type";
import { Pt, RightTick } from "../house/kit/draw";
import { ArcHead, Arrow, D2R, H, Lbl, Svg, TeX, TopV, SliceV, add, arcD, sang, svNorth, svP, svUp, tvDir, tvEast, tvP } from "./fr_lib";

/** the top view: the parallel (gold circle), the centre (the axis seen end-on), faint x̂ (down) and ŷ (right), the place at λ */
export const TopViewBase: React.FC<{ V: TopV; o?: number; axes?: number; circle?: number; centre?: number }> = ({ V, o = 1, axes = 0.6, circle = 1, centre = 1 }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <circle cx={V.c[0]} cy={V.c[1]} r={V.r} fill="none" stroke={C.gold} strokeWidth={5} opacity={circle} />
      {axes > 0 ? <g opacity={axes}>
        <Arrow p={V.c} q={[V.c[0], V.c[1] + V.r * 0.55]} color={C.second} w={6} head={24} />
        <Arrow p={V.c} q={[V.c[0] + V.r * 0.55, V.c[1]]} color={C.second} w={6} head={24} />
      </g> : null}
      <circle cx={V.c[0]} cy={V.c[1]} r={10} fill={C.local} stroke={C.bg} strokeWidth={3} opacity={centre} />
    </g>
  );
/** R̂ (from the axis out through the place) and î (R̂ turned +90°) at longitude lam on the top view, unit length U px */
export const topArrows = (V: TopV, lam: number, U: number) => {
  const p = tvP(V, lam), R = tvDir(lam), E = tvEast(lam);
  return { p, R: add(p, R, U), I: add(p, E, U), mR: add(p, R, -U), Rdir: R, Edir: E };
};
/** the meridian slice: the half circle of the meridian (gold), the axis ẑ (up) and R̂ (right) at the centre */
export const SliceBase: React.FC<{ V: SliceV; o?: number; axes?: number; circle?: number; full?: boolean; quarter?: boolean }> = ({ V, o = 1, axes = 1, circle = 1, full = false, quarter = false }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <path d={arcD(V.c, V.r, full ? -180 : quarter ? 0 : -90, 90, 80)} fill="none" stroke={C.gold} strokeWidth={5} opacity={circle} />
      <line x1={V.c[0]} y1={quarter ? V.c[1] + 30 : V.c[1] + V.r * 1.08} x2={V.c[0]} y2={V.c[1] - V.r * 1.12} stroke={C.local} strokeWidth={3} strokeDasharray="10 8" />
      <line x1={V.c[0] - (full ? V.r : 0)} y1={V.c[1]} x2={V.c[0] + V.r} y2={V.c[1]} stroke={C.grid} strokeWidth={3} />
      {axes > 0 ? <g opacity={axes}>
        <Arrow p={V.c} q={[V.c[0], V.c[1] - V.r * 0.5]} color={C.second} w={6} head={24} />
        <Arrow p={V.c} q={[V.c[0] + V.r * 0.5, V.c[1]]} color={C.second} w={6} head={24} />
      </g> : null}
      <circle cx={V.c[0]} cy={V.c[1]} r={9} fill={C.local} stroke={C.bg} strokeWidth={3} />
    </g>
  );
export const sliceArrows = (V: SliceV, phi: number, U: number) => {
  const p = svP(V, phi), K_ = svUp(phi), J_ = svNorth(phi);
  return { p, K: add(p, K_, U), J: add(p, J_, U), mK: add(p, K_, -U), Kdir: K_, Jdir: J_ };
};
/** an angle arc at the centre between two screen angles with its label (TeX is placed by the caller) */
export const AngleArc: React.FC<{ c: Pt; r: number; a0: number; a1: number; col?: string; o?: number; w?: number; head?: boolean }> = ({ c, r, a0, a1, col = C.gold, o = 1, w = 5, head = false }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <path d={arcD(c, r, a0, a1)} fill="none" stroke={col} strokeWidth={w} />
      {head ? <ArcHead c={c} r={r} a={a1} dir={a1 > a0 ? 1 : -1} col={col} /> : null}
    </g>
  );
/** an arrow rigidly turned by `deg` (maths sense on screen) about its tail: the TurnRule90 animation of Part 1 */
export const turned = (p: Pt, d: Pt, U: number, deg: number): Pt => {
  const a = sang(d) + deg;
  return [p[0] + U * Math.cos(a * D2R), p[1] - U * Math.sin(a * D2R)];
};

/** Part 2's circle (s16): centre c, radius r, the point at angle th (maths sense) with r̂ and θ̂ of length U */
export const circleArrows = (c: Pt, r: number, th: number, U: number) => {
  const a = th * D2R, p: Pt = [c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)];
  const R: Pt = [Math.cos(a), -Math.sin(a)], Th: Pt = [-Math.sin(a), -Math.cos(a)];
  return { p, R: add(p, R, U), Th: add(p, Th, U), Rdir: R, Thdir: Th };
};

/** the 3 × 3 grid: rows î, ĵ, k̂ (TeX labels by the caller), columns east / north / up; cell contents by the caller */
export const GRID = { x0: 260, y0: 210, cw: 230, ch: 170 };
export const gridCell = (r: number, c: number): Pt => [GRID.x0 + c * GRID.cw + GRID.cw / 2, GRID.y0 + r * GRID.ch + GRID.ch / 2];
export const GridBase: React.FC<{ o?: number }> = ({ o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    {[0, 1, 2, 3].map((i) => <line key={`h${i}`} x1={GRID.x0} y1={GRID.y0 + i * GRID.ch} x2={GRID.x0 + 3 * GRID.cw} y2={GRID.y0 + i * GRID.ch} stroke={C.grid} strokeWidth={3} />)}
    {[0, 1, 2, 3].map((i) => <line key={`v${i}`} x1={GRID.x0 + i * GRID.cw} y1={GRID.y0} x2={GRID.x0 + i * GRID.cw} y2={GRID.y0 + 3 * GRID.ch} stroke={C.grid} strokeWidth={3} />)}
    {["east", "north", "up"].map((t, i) => <Lbl key={t} x={GRID.x0 + i * GRID.cw + GRID.cw / 2} y={GRID.y0 - 44} t={t} c={C.key} s={T.floor} a="middle" />)}
  </g>
);

/** a pseudo-3-D tripod (oblique view): î to the lower right, ĵ to the upper right (into the page), k̂ up */
export const TRI = { i: [0.86, 0.36] as Pt, j: [0.62, -0.5] as Pt, k: [0, -1] as Pt };
export const MiniTripod: React.FC<{ at: Pt; U: number; o?: number; w?: number; head?: number }> = ({ at, U, o = 1, w = 8, head = 30 }) => o <= 0 ? null : (
  <g opacity={o}>
    <Arrow p={at} q={add(at, TRI.i, U)} color={C.second} w={w} head={head} />
    <Arrow p={at} q={add(at, TRI.j, U)} color={C.second} w={w} head={head} />
    <Arrow p={at} q={add(at, TRI.k, U)} color={C.first} w={w} head={head} />
    <circle cx={at[0]} cy={at[1]} r={9} fill={C.gold} stroke={C.bg} strokeWidth={3} />
  </g>
);
/** Part 1 lessons B4 (2026-11-05): the keep-line picture of s22 and s25 (its own picture, not the optional block's grid or equations).
 * Side view of the Earth's surface (an arc, schematic): one parcel's three arrows at three places as it moves east; up (k̂, teal) always
 * points away from the centre, east (î, orange) along the surface, north (ĵ) out of the screen (⊙, Part 1 lessons B7). `wind`: the same
 * push-free wind (ink, one fixed screen direction) at each place, whose east number changes as î turns (s25). Place OUTSIDE <Svg>. */
export const TurnPic: React.FC<{ o: number; wind?: boolean; c?: Pt; R?: number }> = ({ o, wind = false, c = [540, 1300], R = 800 }) => {
  if (o <= 0) return null;
  const at = (a: number, r = R): Pt => [c[0] + r * Math.cos(a * D2R), c[1] - r * Math.sin(a * D2R)];
  const A = [114, 90, 66], L = 110;
  const surf = Array.from({ length: 41 }, (_, i) => at(124 - (68 * i) / 40));
  const mv = Array.from({ length: 31 }, (_, i) => at(112 - (44 * i) / 30, R - 70));
  return <>
    <Svg o={o}>
      <path d={`M ${surf.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")}`} fill="none" stroke={C.local} strokeWidth={5} />
      <path d={`M ${mv.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ")}`} fill="none" stroke={C.gold} strokeWidth={5} strokeDasharray="14 10" />
      <Arrow p={mv[28]} q={mv[30]} color={C.gold} w={5} head={22} />
      {A.map((a) => { const p = at(a), up: Pt = [Math.cos(a * D2R), -Math.sin(a * D2R)], east: Pt = [Math.sin(a * D2R), Math.cos(a * D2R)];
        return <g key={a}>
          <Arrow p={p} q={add(p, east, L)} color={C.second} w={7} head={26} />
          <Arrow p={p} q={add(p, up, L)} color={C.first} w={7} head={26} />
          {wind ? <Arrow p={p} q={add(p, [0.94, -0.34], 0.95 * L)} color={C.ink} w={6} head={24} dash="12 8" /> : null}
          <circle cx={p[0]} cy={p[1]} r={15} fill={C.bg} stroke={C.second} strokeWidth={4} />
          <circle cx={p[0]} cy={p[1]} r={5} fill={C.second} />
        </g>; })}
      <Lbl x={at(90, R - 70)[0]} y={at(90, R - 70)[1] + 50} t="moving east" c={C.gold} s={T.floor} a="middle" />
      {wind ? <Lbl x={at(66)[0] + 30} y={at(66)[1] + 170} t="same wind, no push" c={C.key} s={T.floor} a="end" /> : null}
    </Svg>
    <TeX s={H.k} x={add(at(90), [0, -1], L + 30)[0]} y={add(at(90), [0, -1], L + 30)[1]} size={50} c={C.first} ax={0.5} o={o} halo />
    <TeX s={H.i} x={add(at(90), [1, 0], L + 40)[0]} y={at(90)[1]} size={50} c={C.second} ax={0.5} o={o} halo />
    <TeX s={String.raw`\hat{\mathbf j}\ \odot\ \text{(out of the screen)}`} x={at(114)[0] - 30} y={at(114)[1] + 120} size={44} c={C.second} o={o} halo />
    <TeX s={wind ? String.raw`\text{the east number changes}\Rightarrow\text{metric terms}` : String.raw`\text{they turn at}\approx\dfrac{\text{speed}}{a}`} x={c[0]} y={820}
      size={46} c={C.key} ax={0.5} o={o} />
  </>;
};
export const MiniTick: React.FC<{ at: Pt; a: Pt; b: Pt; o?: number; s?: number }> = ({ at, a, b, o = 1, s = 26 }) => {
  const n = (v: Pt): Pt => { const L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; };
  return <RightTick at={at} u1={n(a)} u2={n(b)} s={s} o={o} c={C.key} />;
};

/** log-scale bars (s27, s28): x of a value on a log axis from 10^lo at x0 with `px` per decade */
export const logX = (x0: number, px: number, lo: number) => (v: number) => x0 + (Math.log10(v) - lo) * px;
