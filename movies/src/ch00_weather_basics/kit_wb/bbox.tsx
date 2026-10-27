// Debug-only text-box probe for the label check (tools/movie_cp/label_check.py). Rendered only when the composition gets
// the prop `bbox: true`; it never changes a normal render. After every other delayRender handle has cleared (data, images,
// fonts), it measures every visible text element in the page and console.logs one line "BBOX {json}" that the still
// renderer forwards (onBrowserLog). Boxes are in composition pixels (1920 × 1080).
//   block = one SVG <text>, or one positioned HTML text block (the lowest absolutely positioned <div> holding the text:
//   a TeX, a Layered equation with all its layers, one CalcStack row); rects = the glyph runs of that block (text-node
//   client rects, shrunk vertically to the ink: line boxes are taller than the letters).
import React, { useEffect, useMemo } from "react";
import { continueRender, delayRender, useCurrentFrame } from "remotion";

type Box = { t: string; o: number; r: number[][] };
const FULL = (r: DOMRect) => r.width >= 1900 && r.height >= 1060;

const effOpacity = (el: Element | null): number => {
  let o = 1;
  for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
    const cs = getComputedStyle(e);
    if (cs.display === "none" || cs.visibility === "hidden") return 0;
    o *= parseFloat(cs.opacity || "1");
    if (o < 0.02) return 0;
  }
  return o;
};
const colourAlpha = (c: string): number => {
  if (!c || c === "transparent") return 0;
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return 1;
  const p = m[1].split(/[ ,/]+/).filter(Boolean);
  return p.length >= 4 ? parseFloat(p[3]) : 1;
};
const shrink = (r: DOMRect, top: number, bot: number): number[] => {
  const h = r.height;
  return [r.left, r.top + top * h, r.right, r.bottom - bot * h].map((v) => Math.round(v * 10) / 10);
};

const measure = (): Box[] => {
  const blocks = new Map<Element, Box>();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const txt = (n.textContent || "").replace(/[\s​ ]/g, "");
    if (!txt) continue;
    const pe = n.parentElement;
    if (!pe || pe.closest("style,script,title,defs")) continue;
    const svgText = pe.closest("text");
    if (svgText) {
      if (blocks.has(svgText)) continue;
      const cs = getComputedStyle(svgText);
      const o = effOpacity(svgText) * parseFloat(cs.fillOpacity || "1") * (cs.fill === "none" ? 0 : colourAlpha(cs.fill));
      if (o < 0.2) continue;
      const r = svgText.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      blocks.set(svgText, { t: (svgText.textContent || "").slice(0, 60), o: Math.round(o * 100) / 100, r: [shrink(r, 0.2, 0.17)] });
      continue;
    }
    const o = effOpacity(pe) * colourAlpha(getComputedStyle(pe).color);
    if (o < 0.2) continue;
    // block root: the lowest absolutely positioned <div> ancestor that is not a full-frame container
    let root: Element | null = null;
    for (let e: Element | null = pe; e && e !== document.body; e = e.parentElement) {
      if (e.tagName === "DIV" && getComputedStyle(e).position === "absolute" && !FULL(e.getBoundingClientRect())) { root = e; break; }
    }
    if (!root) root = pe;
    const rg = document.createRange();
    rg.selectNodeContents(n);
    const rs = Array.from(rg.getClientRects()).filter((r) => r.width >= 1 && r.height >= 1);
    if (!rs.length) continue;
    const b = blocks.get(root) ?? { t: "", o: 0, r: [] };
    b.t = (b.t + txt).slice(0, 60);
    b.o = Math.max(b.o, Math.round(o * 100) / 100);
    for (const r of rs) b.r.push(shrink(r, 0.18, 0.14));
    blocks.set(root, b);
  }
  return [...blocks.values()];
};

/** Mount once inside the composition (only in bbox mode). */
export const BoxProbe: React.FC = () => {
  const frame = useCurrentFrame();
  const h = useMemo(() => delayRender(`bbox ${frame}`, { timeoutInMilliseconds: 120000 }), [frame]);
  useEffect(() => {
    let done = false;
    const t0 = Date.now();
    const w = window as unknown as { remotion_delayRenderTimeouts?: Record<string, unknown> };
    const poll = () => {
      if (done) return;
      const pending = Object.keys(w.remotion_delayRenderTimeouts ?? {}).length;
      if (pending > 1 && Date.now() - t0 < 60000) { setTimeout(poll, 60); return; }
      setTimeout(() => {
        if (done) return;
        done = true;
        let boxes: Box[] = [];
        try { boxes = measure(); } catch (e) { console.log(`BBOXERR ${frame} ${String(e)}`); }
        console.log(`BBOX ${JSON.stringify({ frame, boxes })}`);
        continueRender(h);
      }, 150);
    };
    document.fonts.ready.then(() => setTimeout(poll, 60));
    return () => { done = true; };
  }, [frame, h]);
  return null;
};
