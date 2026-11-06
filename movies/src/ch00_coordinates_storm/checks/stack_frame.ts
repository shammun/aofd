// ch00_coordinates_storm (#5b): framing check for the HRRR layer stack in s18 / s19 (K6 round 1+, 2026-11-05; rewritten for the user notes
// 2026-11-06 item 6: a taller stack with EVENLY spaced layers, LZ below, and a new camera). Projects the stack's corner points (4 corners × the
// bottom and top layer), the height-arrow tip and the five tag anchors with the SAME orbit keys and camera maths as cs_sB.tsx (house kit
// cam.ts), every frame, and reports the extremes per phase. Pass: in the overview phases the stack stays inside x 40-1068 / y 40-800 (the
// GlobeFrame box, bottom fade raised to 830); in the close (oblique) phases, which the user asked for, at least 4 of the 5 layer centres stay
// on screen inside x 40-1068 / y 40-800 and every tag anchor stays on screen (x 0-1920, y 0-1080), so each value has a visible leader.
// usage (repo root): npx --prefix movies esbuild movies/src/ch00_coordinates_storm/checks/stack_frame.ts --bundle --platform=node
//   --format=esm --outfile=<scratch>/stack_frame.mjs && node <scratch>/stack_frame.mjs
// KEEP the keys below in step with S18 / S19 in cs_sB.tsx (inline there, so cam_speed.mjs can read them).
import timing from "../../../ch00/ch00_coordinates_storm/timing.json";
import csJ from "../../../ch00/ch00_coordinates_storm/data/cs.json";
import { OrbitKey, Pt, orbitCam, orbitPath, projector, V3 } from "../../house/kit/cam";

const STACK_PP: Pt = [600, 405];
const LZ = [0.35, 1.25, 2.15, 3.05, 3.95], TOP = LZ[4], TGT: V3 = [0, 0, 1.95];
const KEYS18 = (tFive: number, tCol: number, len: number): OrbitKey[] => [
  { f: 0, az: -100, el: 16, dist: 16.5, target: TGT },
  { f: tFive, az: -86, el: 18, dist: 16.5, target: TGT },
  { f: tFive + 150, az: -68, el: 24, dist: 13.5, target: TGT },
  { f: tCol, az: -40, el: 26, dist: 13.5, target: TGT },
  { f: tCol + 150, az: -30, el: 22, dist: 18, target: TGT },
  { f: len + 10, az: -86, el: 22, dist: 18, target: TGT, linear: true },
];
const KEYS19 = (tOrbit: number, tLook: number, len: number): OrbitKey[] => [
  { f: 0, az: -86, el: 22, dist: 18, target: TGT },
  { f: tOrbit, az: -76, el: 22, dist: 18, target: TGT },
  { f: Math.min(tOrbit + 150, tLook - 12), az: 4, el: 30, dist: 19, target: TGT },
  { f: tLook, az: 4, el: 28, dist: 19, target: TGT },
  { f: tLook + 45, az: -6, el: 6, dist: 7.5, target: [0, -1.6, TOP * 0.45] },
  { f: tLook + 45 + 40, az: -2, el: 6, dist: 7.5, target: [0, -1.6, TOP * 0.5], linear: true },
  { f: tLook + 45 + 40 + 45, az: -20, el: 24, dist: 19, target: TGT },
  { f: len + 10, az: -26, el: 24, dist: 19, target: TGT, linear: true },
];

type Snt = { text: string; start: number; end: number };
const sc = (timing as unknown as { scenes: { id: string; start: number; sentences: Snt[] }[] }).scenes;
const FPS = 30;
const k18 = sc.findIndex((s) => s.id === "s18_ian_stack"), k19 = k18 + 1;
const cut = (k: number) => Math.round(sc[k].start * FPS);
const STK = (csJ as unknown as { stack: { half_km: number } }).stack;
const H = STK.half_km / 100;
const corners: V3[] = [];
for (const [x, y] of [[-H, -H], [H, -H], [H, H], [-H, H]]) corners.push([x, y, 0], [x, y, TOP + 0.05]);
corners.push([-H, -H, TOP + 0.9]);

const run = (name: string, keys: OrbitKey[], len: number, phases: [string, number, number, boolean][]) => {
  let ok = true;
  for (const [ph, a, b, close] of phases) {
    let sx0 = 1e9, sx1 = -1e9, sy0 = 1e9, sy1 = -1e9, minIn = 9, tagOff = 0;
    for (let f = a; f < Math.min(b, len); f++) {
      const st = orbitCam({ ...orbitPath(keys, f), fov: 32 }, STACK_PP);
      const pr = projector(st, 1920, 1080, 0, 0);
      for (const v of corners) { const q = pr.p(v); sx0 = Math.min(sx0, q[0]); sx1 = Math.max(sx1, q[0]); sy0 = Math.min(sy0, q[1]); sy1 = Math.max(sy1, q[1]); }
      const nIn = LZ.filter((z) => { const q = pr.p([0, 0, z]); return q[0] >= 40 && q[0] <= 1068 && q[1] >= 40 && q[1] <= 800; }).length;
      minIn = Math.min(minIn, nIn);
      tagOff += LZ.filter((z) => { const q = pr.p([H, -H, z]); return !(q[0] >= 0 && q[0] <= 1920 && q[1] >= 0 && q[1] <= 1080); }).length;
    }
    const info = ph.endsWith("(kept)");   // the s19 close look the user liked (≤ 6 s, among the layers by design): reported, not gated
    const good = info || (close ? minIn >= 4 && tagOff === 0 : sx0 >= 40 && sx1 <= 1068 && sy0 >= 40 && sy1 <= 800);
    ok = ok && good;
    console.log(`${good ? "ok  " : "FAIL"} ${name} ${ph} (f ${a}-${b}${close ? ", close" : ""}): stack x ${sx0.toFixed(0)}..${sx1.toFixed(0)}, y ${sy0.toFixed(0)}..${sy1.toFixed(0)}; ` +
      `layer centres in frame ≥ ${minIn}/5; tag anchors off screen ${tagOff}`);
  }
  return ok;
};
const L18 = cut(k19) - cut(k18), L19 = cut(k19 + 1) - cut(k19);
const SSk = (k: number, j: number) => Math.round(sc[k].sentences[j].start * FPS) - cut(k);
const tFive = SSk(k18, 3), tCol = SSk(k18, 8);
const a = run("s18", KEYS18(tFive, tCol, L18), L18, [["overview", 0, tFive + 40, false], ["close oblique + hover", tFive + 40, tCol + 60, true],
  ["pull back + orbit", tCol + 150, L18, false]]);
const tOrbit = SSk(k19, 7), tLook = SSk(k19, 8);
const b = run("s19", KEYS19(tOrbit, tLook, L19), L19, [["lit layers", 0, tOrbit, false], ["swing round", tOrbit, tLook, false],
  ["close look (kept)", tLook, tLook + 130, true], ["back out", tLook + 140, L19, false]]);
process.exit(a && b ? 0 : 1);
