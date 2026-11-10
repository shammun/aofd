import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as THREE from "three";
import { SCENES_A } from "../../co_sA";
import { SCENES_B } from "../../co_sB";
import { SCENES_C } from "../../co_sC";
import { sc, CUT, LEN, FPS } from "../../co_lib";
/** THREE-tag guard (--3d only): every tag inside an <r3root> (a ThreeCanvas tree, see stubs/three-canvas.js) must be an R3F
 * intrinsic, i.e. a THREE class in camelCase (mesh, group, meshBasicMaterial …) or `primitive`. Anything else (an SVG <g>, a
 * <div>, a <text>) crashes the real render with "X is not part of the THREE namespace" and is reported as an error here. */
const R3_OK = new Set(["primitive", "r3root"]);
const badR3 = (html) => {
  const bad = new Set();
  let i = 0;
  while ((i = html.indexOf("<r3root>", i)) >= 0) {
    const j = html.indexOf("</r3root>", i);
    const sub = html.slice(i, j < 0 ? undefined : j);
    for (const m of sub.matchAll(/<([a-zA-Z][\w-]*)/g)) {
      const t = m[1];
      if (R3_OK.has(t)) continue;
      const P = t[0].toUpperCase() + t.slice(1);
      if (!(P in THREE)) bad.add(t);
    }
    i = j < 0 ? html.length : j + 1;
  }
  return [...bad];
};
/** Server-render every scene at many frames (no WebGL, no browser): any exception in a scene body (a missing datum, a TeX error,
 * a text below the 44-px floor, a source line that would sit in the caption band, a drifting equation constant) fails here. */
export const runAll = (step) => {
  const BY = { ...SCENES_A, ...SCENES_B, ...SCENES_C };
  let n = 0; const errs = []; let nan = 0; let r3 = 0;
  sc.forEach((s, k) => {
    const S = BY[s.id]; const len = LEN(k);
    const frames = new Set();
    for (let f = 0; f < len + 10; f += step) frames.add(f);
    s.sentences.forEach((q) => { const a = Math.round(q.start * FPS) - CUT[k]; [a - 4, a, a + 3, a + 12].forEach((x) => { if (x >= 0 && x < len + 10) frames.add(x); }); });
    frames.add(len - 1); frames.add(len + 9);
    for (const f of [...frames].sort((a, b) => a - b)) {
      globalThis.__F = f; n++;
      try {
        const html = renderToStaticMarkup(React.createElement(S));
        if (globalThis.__R3 && html.includes("<r3root>")) {
          r3++;
          const b = badR3(html);
          if (b.length) throw new Error(`non-THREE tag(s) in a 3-D tree: <${b.join(">, <")}>`);
        }
        if (/NaN/.test(html)) { nan++; if (nan < 12) errs.push(`${s.id} f${f}: NaN in markup near ${html.slice(Math.max(0, html.indexOf("NaN") - 120), html.indexOf("NaN") + 20)}`); }
      }
      catch (e) { const msg = `${s.id}: ${e.message.slice(0, 200)}`; if (!errs.some((x) => x.startsWith(msg))) errs.push(`${msg} (first at f${f})`); }
    }
  });
  return { n, errs, nan, r3, assets: [...(globalThis.__ASSETS ?? [])].sort() };
};
