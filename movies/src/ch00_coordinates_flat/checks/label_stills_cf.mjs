// Adapted 2026-11-05 for ch00_coordinates_flat (build 1) from src/ch00_coordinates/checks/label_stills_co.mjs: entry src/ch00_coordinates_flat/index.ts, composition Ch00CoordinatesFlat.
// Stills + text boxes for the label check (copied by label_check.py next to movies/node_modules and run from there).
// node label_stills.mjs <bundleDir|--bundle> <publicDir> <outDir> <framesFile> [--bundle-out dir] [--scale 0.5]
// Renders each frame with inputProps {bbox: true}; the composition's BoxProbe logs "BBOX {json}"; written to
// outDir/b<frame>.json next to f<frame>.jpg.
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const [, , bundleArg, publicDir, outDir, framesFile, ...rest] = process.argv;
const opt = (k, d) => (rest.includes(k) ? rest[rest.indexOf(k) + 1] : d);
const MOVIES = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
let serveUrl = bundleArg;
if (bundleArg === "--bundle") {
  const t0 = Date.now();
  serveUrl = await bundle({ entryPoint: path.join(MOVIES, "src/ch00_coordinates_flat/index.ts"), publicDir, outDir: opt("--bundle-out") });
  console.log(`bundled in ${((Date.now() - t0) / 1000).toFixed(0)} s -> ${serveUrl}`);
  if (rest.includes("--bundle-only")) process.exit(0);
}
fs.mkdirSync(outDir, { recursive: true });
const scale = Number(opt("--scale", "0.5"));
let port = opt("--port") ? Number(opt("--port")) : null; // a failed still can leave its server port bound: move on by 3
const inputProps = { audio: "narration_music_cf.wav", bbox: true };
const chromiumOptions = { gl: "angle" };
const browser = await openBrowser("chrome", { chromiumOptions });
const comp = await selectComposition({ serveUrl, id: "Ch00CoordinatesFlat", inputProps, puppeteerInstance: browser, chromiumOptions,
  timeoutInMilliseconds: 240000, port });
const frames = fs.readFileSync(framesFile, "utf8").split(/[,\s]+/).filter(Boolean).map(Number);
for (const f of frames) {
  const jf = path.join(outDir, `b${String(f).padStart(5, "0")}.json`);
  if (fs.existsSync(jf) && !rest.includes("--force")) continue;
  const t0 = Date.now();
  let got = null;
  try {
    await renderStill({ composition: comp, serveUrl, inputProps, output: path.join(outDir, `f${String(f).padStart(5, "0")}.jpg`), frame: f,
      puppeteerInstance: browser, imageFormat: "jpeg", jpegQuality: 85, scale, chromiumOptions, timeoutInMilliseconds: 240000, logLevel: "error", port,
      onBrowserLog: (l) => { const s = l.text || ""; if (s.startsWith("BBOX ")) { const j = JSON.parse(s.slice(5)); if (j.frame === f) got = j; } else if (s.startsWith("BBOXERR")) console.log(s); } });
    if (got) fs.writeFileSync(jf, JSON.stringify(got));
    console.log(`frame ${f} ${((Date.now() - t0) / 1000).toFixed(1)} s ${got ? got.boxes.length + " boxes" : "NO BOXES"}`);
  } catch (e) { console.log(`frame ${f} ERROR ${String(e).slice(0, 600)}`); if (port) port += 3; }
}
await browser.close({ silent: true });
