// house-dark-v1: the movie style. Term colours are the project-wide equation colours (R4 §1.3), so a Coriolis term is
// violet in the notebook, the explainer and the movie. Fonts are system fonts (no network at render time).
export const HOUSE = {
  id: "house-dark-v1",
  bg: "#0f1420",
  panel: "#182032",
  ink: "#e8ecf4",
  muted: "#9aa6bd",
  grid: "#2b3550",
  accent: "#4fb3bf",
  font: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  mono: "Consolas, 'Courier New', monospace",
  glyphA: "#2aa198", // teal: first vector of a dot/cross glyph (R2 §3.3)
  glyphB: "#e8833a", // orange: second vector
} as const;

export const TERM = {
  tendency: "#8a94a8", // slate   ∂/∂t
  advection: "#2aa198", // teal    u·∇
  coriolis: "#8e6fd8", // violet  Coriolis / rotation
  pressure: "#e8833a", // orange  pressure gradient
  gravity: "#a8743f", // brown   gravity / buoyancy
  friction: "#d9667f", // rose    friction / diffusion
  forcing: "#d8b23a", // gold    forcing / heating
  beta: "#5b6fd8", // indigo  β / planetary vorticity gradient
} as const;

export type TermFamily = keyof typeof TERM;

/** Smooth 0→1 ramp between frames a and b (clamped). Pure function of the frame: deterministic. */
export const ramp = (frame: number, a: number, b: number): number => {
  if (b <= a) return frame >= b ? 1 : 0;
  const t = Math.min(1, Math.max(0, (frame - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
