// House kit: promoted 2026-10-29 (weather basics UF2) from ch00_weather_basics/kit_wb/probe.ts.
// Debug-only shape registry for the label check (bbox mode, tools/movie_cp/label_check.py). WebGL objects are not in the
// DOM, so Arrow3D / Rod3D / Ball3D / Quad3D write their screen projection here while they render; BoxProbe reads the
// entries stamped with the current absolute frame. Off (a no-op) in every normal render.
// UF2 fix 1 (K6 tuning): "mask3d" = the projected outline of a K5 layer stack (a sharp-picture mask for the overlap gate)
export type Shape3 = { k: "arrow3d" | "rod3d" | "ball3d" | "quad3d" | "mask3d"; c: string; w: number; o: number; pts: number[][]; closed: boolean; head?: number[][]; name?: string; own?: string };
type Reg = { on: boolean; frame: number; reg: Map<string, Shape3 & { frame: number }> };
const W = globalThis as unknown as { __cpwProbe?: Reg };
export const PROBE: Reg = W.__cpwProbe ?? (W.__cpwProbe = { on: false, frame: -1, reg: new Map() });
export const probe3 = (id: string, s: Shape3) => {
  if (!PROBE.on) return;
  PROBE.reg.set(id, { ...s, frame: PROBE.frame });
};
export const probeOff = (id: string) => {
  if (PROBE.on) PROBE.reg.delete(id);
};
