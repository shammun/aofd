// Copied 2026-11-05 into kit_cs (ch00_coordinates_sphere, Part 3) from build 1's kit_co unchanged except this line, so this movie bundles independently.
// Copied 2026-11-04 into kit_co (ch00_coordinates) unchanged except this line, so this movie bundles independently.
// Copied 2026-10-28 from movies/src/ch00_weather_basics/kit_wb (unchanged) so this movie bundles independently.
// Debug-only shape registry for the label check (bbox mode, tools/movie_cp/label_check.py). WebGL objects are not in the
// DOM, so Arrow3D / Rod3D / Ball3D / Quad3D write their screen projection here while they render; BoxProbe reads the
// entries stamped with the current absolute frame. Off (a no-op) in every normal render.
export type Shape3 = { k: "arrow3d" | "rod3d" | "ball3d" | "quad3d"; c: string; w: number; o: number; pts: number[][]; closed: boolean; head?: number[][] };
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
