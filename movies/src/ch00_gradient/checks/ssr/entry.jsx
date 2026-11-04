// Adapted 2026-11-04 for ch00_gradient (#6, build 1) from ch00_coordinates/checks/ssr/entry.jsx (#5, unchanged): four scene files; --3d fails on non-THREE tags.
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SCENES_A } from "../../gr_sA";
import { SCENES_B } from "../../gr_sB";
import { SCENES_C } from "../../gr_sC";
import { SCENES_D } from "../../gr_sD";
import * as THREE from "three";
import { sc, CUT, LEN, FPS } from "../../gr_lib";
import { ThreeCanvas } from "@remotion/three";
/** every tag inside a <r3f-root> (the stub ThreeCanvas marker) must be a THREE class or <primitive> (#5: an SVG <g> killed 166 stills) */
export const badTags = (html) => { let n = 0; const bad = [];
  for (const seg of html.match(/<r3f-root>[\s\S]*?<\/r3f-root>/g) ?? []) for (const m of seg.matchAll(/<([a-zA-Z][\w-]*)/g)) {
    const tg = m[1]; if (tg === "r3f-root" || tg === "primitive") continue; n++;
    if (!((tg[0].toUpperCase() + tg.slice(1)) in THREE) && !bad.includes(tg)) bad.push(tg); }
  return { n, bad }; };
/** negative self-test of the gate: a <g> inside a three.js tree must be caught (the run fails if it is not) */
export const selftest3 = () => { const was = globalThis.__R3; globalThis.__R3 = 1;
  const html = renderToStaticMarkup(React.createElement(ThreeCanvas, null, React.createElement("group", null, React.createElement("mesh", null), React.createElement("g", null))));
  globalThis.__R3 = was; return badTags(html).bad; };
/** Server-render every scene at many frames (no WebGL, no browser): any exception in a scene body (a missing datum, a TeX error,
 * a text below the 44-px floor, a source line that would sit in the caption band, a drifting equation constant) fails here. */
export const runAll = (step) => {
  const BY = { ...SCENES_A, ...SCENES_B, ...SCENES_C, ...SCENES_D };
  let n = 0, n3 = 0; const errs = []; let nan = 0;
  sc.forEach((s, k) => {
    const S = BY[s.id]; const len = LEN(k);
    const frames = new Set();
    for (let f = 0; f < len + 10; f += step) frames.add(f);
    s.sentences.forEach((q) => { const a = Math.round(q.start * FPS) - CUT[k]; [a - 4, a, a + 3, a + 12].forEach((x) => { if (x >= 0 && x < len + 10) frames.add(x); }); });
    frames.add(len - 1); frames.add(len + 9);
    for (const f of [...frames].sort((a, b) => a - b)) {
      globalThis.__F = f; n++;
      try { const html = renderToStaticMarkup(React.createElement(S)); if (/NaN/.test(html)) { nan++; if (nan < 12) errs.push(`${s.id} f${f}: NaN in markup near ${html.slice(Math.max(0, html.indexOf("NaN") - 120), html.indexOf("NaN") + 20)}`); }
        // #5 K6 lesson (166 stills lost to an SVG <g> inside an R3F tree): with --3d every tag inside a <r3f-root> must be a THREE class
        if (globalThis.__R3) { const b = badTags(html); n3 += b.n;
          for (const tg of b.bad) { const msg = `${s.id}: <${tg}> inside a three.js tree is not a THREE class (R3F would throw)`; if (!errs.some((x) => x.startsWith(msg))) errs.push(`${msg} (first at f${f})`); } } }
      catch (e) { const msg = `${s.id}: ${e.message.slice(0, 200)}`; if (!errs.some((x) => x.startsWith(msg))) errs.push(`${msg} (first at f${f})`); }
    }
  });
  return { n, n3, errs, nan, assets: [...(globalThis.__ASSETS ?? [])].sort() };
};
