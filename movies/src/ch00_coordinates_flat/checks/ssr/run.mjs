// No-browser server-render check for ch00_coordinates (build 1): bundles checks/ssr/entry.jsx with esbuild (remotion,
// @remotion/three and @react-three/fiber replaced by the stubs in ./stubs: frame from a global, no WebGL; with --3d the 3-D
// children render as plain tags so their component bodies run too), renders every scene at every `step` frames plus each
// sentence start −4/0/+3/+12 and the scene end, and fails on any exception (missing datum, KaTeX error, text under the 44-px
// floor, a source line pushed into the caption band, an equation constant drifting from cf_eq.ts) or a NaN in the markup.
// It also writes the list of staticFile assets the scenes ask for and checks them against a public dir (--public).
// usage (from movies/): node src/ch00_coordinates_flat/checks/ssr/run.mjs [--step 10] [--3d] [--public <dir>]
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MOVIES = path.resolve(HERE, "../../../..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const step = Number(arg("--step", "10")), three = process.argv.includes("--3d"), pub = arg("--public");
const OUT = path.join(MOVIES, "out/ch00/ch00_coordinates_flat/modload");
fs.mkdirSync(OUT, { recursive: true });
const rel = (p) => path.relative(MOVIES, p).split(path.sep).join("/");
execSync(`npx esbuild "${rel(path.join(HERE, "entry.jsx"))}" --bundle --platform=node --format=esm --outfile="${rel(path.join(OUT, "ssr.mjs"))}" --jsx=automatic `
  + `--loader:.woff=empty --loader:.woff2=empty --loader:.ttf=empty --loader:.css=empty --log-level=error `
  + `--alias:remotion=./${rel(path.join(HERE, "stubs/remotion.js"))} --alias:@remotion/three=./${rel(path.join(HERE, "stubs/three-canvas.js"))} `
  + `--alias:@react-three/fiber=./${rel(path.join(HERE, "stubs/fiber.js"))} --external:three --external:react --external:react-dom`, { cwd: MOVIES, stdio: "inherit" });
if (three) globalThis.__R3 = 1;
const origErr = console.error; let warn = 0; console.error = () => { warn++; };
const m = await import(pathToFileURL(path.join(OUT, "ssr.mjs")).href);
const t0 = Date.now();
const r = m.runAll(step);
console.error = origErr;
console.log(`${three ? "with 3-D children: " : ""}${r.n} scene-frames rendered in ${((Date.now() - t0) / 1000).toFixed(0)} s; ${r.errs.length} error(s); NaN frames ${r.nan}`
  + (three ? `; React warnings about 3-D tags suppressed: ${warn}; THREE-tag guard on ${r.r3} 3-D frames` : ""));
for (const e of r.errs.slice(0, 60)) console.log("ERR " + e);
fs.writeFileSync(path.join(OUT, "assets_used.json"), JSON.stringify(r.assets, null, 1));
let missing = [];
if (pub) { const have = new Set(fs.readdirSync(pub)); missing = r.assets.filter((a) => !have.has(a)); console.log(`assets asked for: ${r.assets.length}; missing in ${pub}: ${missing.length ? missing.join(", ") : "none"}`); }
process.exitCode = r.errs.length || r.nan || missing.length ? 1 : 0;
