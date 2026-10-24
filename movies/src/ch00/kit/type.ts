// v5 design system for the Chapter-0 movies (reports/ch00_v5_analysis_visual.md §2; storyboard "LAYOUT SYSTEM").
// Candidate for promotion to movies/src/house/ by the orchestrator / knowledge-keeper.
import { HOUSE, TERM } from "../../house";

/** Type scale in px at 1080p. Nothing below T.floor (44 px): the text helpers throw if asked for less. */
export const T = { hero: 128, eq: 84, calc: 68, key: 54, floor: 44 } as const;

/** Safe content area (no title band) and the two zones. The caption band y 880-1040 stays empty. */
export const SAFE = { x0: 80, x1: 1840, y0: 40, y1: 860 } as const;
export const ZONE = { pic: { x0: 80, x1: 1000 }, math: { x0: 1060, x1: 1840 } } as const;

/** Colour roles (house-dark-v1 hues). HOUSE.accent is not used as a text colour in v5. */
export const C = {
  // background lifted from HOUSE.bg #0f1420 (BT.709 Y ≈ 33) to Y ≈ 42: ffmpeg blackdetect (pix_th 0.10, tv range →
  // Y ≤ 37.9 is 'black') read sparse v5 frames as black screens; the frame now never is. Proposal for house-dark-v1.
  bg: "#171f33",
  ink: HOUSE.ink,
  first: HOUSE.glyphA, // teal: a, p, v, F, advection
  second: HOUSE.glyphB, // orange: b, q, ∇T, x̂, b̂, d
  neg: TERM.friction, // rose: negative (always with hatch and a minus glyph)
  key: "#f4ecd2", // warm white keywords
  gold: "#d8b23a", // pointers, underlines, the s03 tags
  local: "#aab4c8", // ∂T/∂t text (slate, brightened for phones)
  muted: "#9aa6bd", // ticks and units only
  grid: HOUSE.grid,
} as const;

export const FONT = HOUSE.font;

/** The floor rule as code: any text helper asked for < 44 px throws, so a too-small label fails the render. */
export const floor = (s: number, what: string): number => {
  if (s < T.floor - 1e-9) throw new Error(`text "${what}" at ${s} px is below the 44-px floor`);
  return s;
};
