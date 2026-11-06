// ch00_coordinates_storm (#5b), K6 round 1+ (2026-11-05): framing check for the HRRR layer stack in s18 / s19. Projects the stack's
// corner points (4 corners × bottom/top, the height arrow tip, the tick ends) and the s18 km tick labels (anchor end at x − 10,
// width ≈ textW(t, 44)) with the SAME orbit keys and camera maths as cs_sB.tsx (house kit cam.ts), every frame, and reports the
// extremes. Pass: stack points inside x 40-1068 / y 40-788 (the GlobeFrame box), labels start at x ≥ 60 and end before x 1842.
// usage (repo root): npx --prefix movies esbuild movies/src/ch00_coordinates_storm/checks/stack_frame.ts --bundle --platform=node
//   --format=esm --outfile=<scratch>/stack_frame.mjs && node <scratch>/stack_frame.mjs
// KEEP the keys below in step with S18 / S19 in cs_sB.tsx (inline there, so cam_speed.mjs can read them).
import timing from "../../../ch00/ch00_coordinates_storm/timing.json";
import csJ from "../../../ch00/ch00_coordinates_storm/data/cs.json";
import { OrbitKey, Pt, orbitCam, orbitPath, projector, V3 } from "../../house/kit/cam";

// ---- copies of the S18 / S19 camera (cs_sB.tsx) ----
const D0 = Number(process.env.SD ?? 16), STACK_PP: Pt = [Number(process.env.PPX ?? 600), Number(process.env.PPY ?? 400)];
const STACK_KEYS18 = (len: number): OrbitKey[] => [{ f: 0, az: -100, el: 20, dist: D0, target: [0, 0, 0.75] }, { f: len + 10, az: -76, el: 22, dist: D0, target: [0, 0, 0.75], linear: true }];
const STACK_KEYS19 = (tOrbit: number, tLook: number, len: number, top: number): OrbitKey[] => [
  { f: 0, az: -76, el: 22, dist: D0, target: [0, 0, 0.75] },
  { f: tOrbit, az: -76, el: 22, dist: D0, target: [0, 0, 0.75] },
  { f: Math.min(tOrbit + 150, tLook - 12), az: 4, el: 34, dist: D0, target: [0, 0, 0.75] },
  { f: tLook, az: 4, el: 30, dist: D0, target: [0, 0, 0.75] },
  { f: tLook + 45, az: -6, el: 6, dist: 6.8, target: [0, -1.6, top * 0.45] },
  { f: tLook + 45 + 40, az: -2, el: 6, dist: 6.8, target: [0, -1.6, top * 0.5], linear: true },
  { f: tLook + 45 + 40 + 45, az: -20, el: 24, dist: D0, target: [0, 0, 0.75] },
  { f: len + 10, az: -26, el: 24, dist: D0, target: [0, 0, 0.75], linear: true },
];

type Snt = { text: string; start: number; end: number };
const sc = (timing as unknown as { scenes: { id: string; start: number; sentences: Snt[] }[] }).scenes;
const FPS = 30;
const k18 = sc.findIndex((s) => s.id === "s18_ian_stack"), k19 = k18 + 1;
const cut = (k: number) => Math.round(sc[k].start * FPS);
const STK = (csJ as unknown as { stack: { half_km: number; z_km: number[] } }).stack;
const H = STK.half_km / 100, ZX = 15 / 100, top = STK.z_km[4] * ZX;
const textW = (t: string, s: number) => [...t].reduce((w, ch) => w + s * (/[ .,:;()|'·]/.test(ch) ? 0.3 : /[mwMW]/.test(ch) ? 0.85 : /[A-Z0-9°]/.test(ch) ? 0.6 : 0.53), 0);
const pts: V3[] = [];
for (const [x, y] of [[-H, -H], [H, -H], [H, H], [-H, H]]) { pts.push([x, y, 0], [x, y, top + 0.05]); }
pts.push([-H, -H, 16 * ZX + 0.2]);
for (const km of [0, 3, 6, 9, 12, 15]) pts.push([-H - 0.18, -H - 0.18, km * ZX]);

const run = (name: string, keys: OrbitKey[], len: number, labels: boolean, skip: [number, number] = [0, 0]) => {
  let sx0 = 1e9, sx1 = -1e9, sy0 = 1e9, sy1 = -1e9, lx0 = 1e9, lx1 = -1e9, fx0 = -1, fl0 = -1;
  for (let f = 0; f < len; f++) {
    if (f >= skip[0] && f < skip[1]) continue;   // s19 close look: the camera is meant to be among the layers
    const st = orbitCam({ ...orbitPath(keys, f), fov: 32 }, STACK_PP);
    const pr = projector(st, 1920, 1080, 0, 0);
    for (const v of pts) { const q = pr.p(v); if (q[0] < sx0) { sx0 = q[0]; fx0 = f; } sx1 = Math.max(sx1, q[0]); sy0 = Math.min(sy0, q[1]); sy1 = Math.max(sy1, q[1]); }
    if (labels) {
      const lab: [string, V3][] = [0, 3, 6, 9, 12, 15].map((km) => [`${km}`, [-H - 0.2, -H - 0.2, km * ZX] as V3]);
      lab.push(["km", [-H - 0.2, -H - 0.2, 16 * ZX + 0.3]]);
      for (const [t, v] of lab) { const q = pr.p(v), x1 = q[0] - 10, x0 = x1 - textW(t, 44); if (x0 < lx0) { lx0 = x0; fl0 = f; } lx1 = Math.max(lx1, x1); }
    }
  }
  const ok = sx0 >= 40 && sx1 <= 1068 && sy0 >= 40 && sy1 <= 788 && (!labels || (lx0 >= 60 && lx1 <= 1842));
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: stack x ${sx0.toFixed(0)} (f ${fx0})..${sx1.toFixed(0)}, y ${sy0.toFixed(0)}..${sy1.toFixed(0)}` +
    (labels ? `; km labels x ${lx0.toFixed(0)} (f ${fl0})..${lx1.toFixed(0)}` : ""));
  return ok;
};
const L18 = cut(k19) - cut(k18), L19 = cut(k19 + 1) - cut(k19);
const SSk = (k: number, j: number) => Math.round(sc[k].sentences[j].start * FPS) - cut(k);
const a = run("s18", STACK_KEYS18(L18), L18, true);
const tLook = SSk(k19, 8);
const b = run("s19", STACK_KEYS19(SSk(k19, 7), tLook, L19, top), L19, false, [tLook, tLook + 130]);
process.exit(a && b ? 0 : 1);
