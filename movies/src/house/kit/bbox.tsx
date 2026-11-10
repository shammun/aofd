// House kit (UF2 K6): promoted from ch00_weather_basics/kit_wb/bbox.tsx, plus the K1/K2/K5 picture masks.
// Debug-only text-box probe for the label check (tools/movie_cp/label_check.py). Rendered only when the composition gets
// the prop `bbox: true`; it never changes a normal render. After every other delayRender handle has cleared (data, images,
// fonts), it measures every visible text element in the page and console.logs one line "BBOX {json}" that the still
// renderer forwards (onBrowserLog). Boxes are in composition pixels (1920 × 1080).
//   block = one SVG <text>, or one positioned HTML text block (the lowest absolutely positioned <div> holding the text:
//   a TeX, a Layered equation with all its layers, one CalcStack row); rects = the glyph runs of that block (text-node
//   client rects, shrunk vertically to the ink: line boxes are taller than the letters).
import React, { useEffect, useMemo } from "react";
import { continueRender, delayRender, useCurrentFrame } from "remotion";
import { PROBE } from "./probe";

// UF2 fix 1 (K6 tuning): `own` = the owner of a label (the nearest [data-lc-own] group, or "cbar:<name>" for a colour bar's own
// title / ticks), so tools/k6_overlap.py can log a label touching its own shape as INFO instead of a failure
type Box = { t: string; o: number; r: number[][]; m?: boolean; own?: string };
const ownerOf = (el: Element | null): string | undefined => {
  if (!el) return undefined;
  const o = el.closest("[data-lc-own]");
  if (o) return o.getAttribute("data-lc-own") ?? undefined;
  const cb = el.closest("[data-k6-cbar]");
  if (cb) { try { return "cbar:" + (JSON.parse(cb.getAttribute("data-k6-cbar") ?? "{}").name ?? "cbar"); } catch { return "cbar"; } }
  return undefined;
};
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
      blocks.set(svgText, { t: (svgText.textContent || "").slice(0, 60), o: Math.round(o * 100) / 100, r: [shrink(r, 0.2, 0.17)],
        m: !!svgText.closest("[data-lc-maplabel]") || undefined, own: ownerOf(svgText) });
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
    const b = blocks.get(root) ?? { t: "", o: 0, r: [], own: ownerOf(root) };
    b.t = (b.t + txt).slice(0, 60);
    b.o = Math.max(b.o, Math.round(o * 100) / 100);
    for (const r of rs) b.r.push(shrink(r, 0.18, 0.14));
    blocks.set(root, b);
  }
  return [...blocks.values()];
};

// ---------------------------------------------------------------- shapes (fix loop 2: text vs shapes, links vs links)
// Every visible SVG geometry element outside KaTeX is sampled along its outline (≈ 6-px steps, ≤ 300 points) in page px:
//   link   the gold CurvedLink (path or chevron, stroke #d8b23a, 4–6 px)      → text-vs-link and link-vs-link
//   stroke any other stroke ≥ 3 px at ≥ 45 % (arrow shafts, arcs, brackets, loops) → text-vs-stroke
//   fill   any fill ≥ 30 % (arrowheads, strips, patches, discs, polygons)   → text-vs-fill
//   img    an <img>/<image> that is not full-frame (thumbnails, map tiles)   → text-vs-fill
// Clipped geometry is cut to its clip-path box; anything inside [data-lc-ok] (a deliberate mark ON its text: a strike,
// a cross line of the recipe table) is not tested. A contour line ([data-lc-contour], isobars) is not tested against a map
// label ([data-lc-maplabel]: a contour value or a place name), which sits on the map's linework by design.
// Grid and background colours (#2b3550, #4a5677, the bg and its halos) are skipped. `g` groups the parts of one drawing
// (parent element) so a link never "crosses" its own chevron. WebGL arrows come from the PROBE registry (probe.ts).
type Shape = { k: string; c: string; w: number; o: number; pts: number[][]; closed: boolean; g: string; tag: string; clip?: number[]; contour?: boolean; own?: string };
const rgbOf = (c: string): number[] | null => {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  return m[1].split(/[ ,/]+/).filter(Boolean).slice(0, 3).map(Number);
};
// background, halo, grid, axis-grey and the dim disc spokes (#3e4b6c): guide lines, not marks
const SKIP_RGB = [[23, 31, 51], [15, 20, 32], [43, 53, 80], [74, 86, 119], [62, 75, 108]];
const isSkip = (c: string) => {
  const v = rgbOf(c);
  return !v || SKIP_RGB.some((q) => Math.abs(q[0] - v[0]) + Math.abs(q[1] - v[1]) + Math.abs(q[2] - v[2]) < 24);
};
const isGold = (c: string) => {
  const v = rgbOf(c);
  return !!v && Math.abs(v[0] - 216) + Math.abs(v[1] - 178) + Math.abs(v[2] - 58) < 30;
};
const gid = new WeakMap<Element, string>();
let gn = 0;
const groupId = (e: Element | null) => {
  if (!e) return "-";
  if (!gid.has(e)) gid.set(e, `g${gn++}`);
  return gid.get(e) as string;
};
const r1 = (v: number) => Math.round(v * 10) / 10;
/** the screen box of the nearest clip-path (url) on the element or an ancestor, so clipped-away geometry is not tested */
const clipBox = (el: Element): number[] | undefined => {
  let box: number[] | undefined;
  for (let e: Element | null = el; e && e.tagName.toLowerCase() !== "svg"; e = e.parentElement) {
    const cp = getComputedStyle(e).clipPath || e.getAttribute("clip-path") || "";
    const m = cp.match(/url\(["']?#([^"')]+)["']?\)/);
    if (!m) continue;
    const ce = document.getElementById(m[1]);
    const ctm = (e as SVGGraphicsElement).getScreenCTM?.();
    if (!ce || !ctm) continue;
    let b: number[] | undefined;
    Array.from(ce.children).forEach((ch) => {
      const g = ch as SVGGraphicsElement;
      if (!g.getBBox) return;
      const bb = g.getBBox();
      const cs = [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]].map(([x, y]) => new DOMPoint(x, y).matrixTransform(ctm));
      const q = [Math.min(...cs.map((c) => c.x)), Math.min(...cs.map((c) => c.y)), Math.max(...cs.map((c) => c.x)), Math.max(...cs.map((c) => c.y))];
      b = b ? [Math.min(b[0], q[0]), Math.min(b[1], q[1]), Math.max(b[2], q[2]), Math.max(b[3], q[3])] : q;
    });
    if (b) box = box ? [Math.max(box[0], b[0]), Math.max(box[1], b[1]), Math.min(box[2], b[2]), Math.min(box[3], b[3])] : b;
  }
  return box?.map(r1);
};
const measureShapes = (frame: number): Shape[] => {
  const out: Shape[] = [];
  const els = document.querySelectorAll("svg line, svg polyline, svg polygon, svg path, svg circle, svg ellipse, svg rect");
  els.forEach((el) => {
    if (el.closest(".katex, defs, clipPath, pattern, mask, marker, text, [data-lc-ok]")) return;
    const g = el as SVGGeometryElement;
    const o = effOpacity(g);
    if (o < 0.2) return;
    const cs = getComputedStyle(g);
    // a gradient fill is a shading overlay (vignettes), not a mark; a pattern fill (hatch) is a mark
    const fid = cs.fill.match(/#([^"')]+)/)?.[1];
    const fillPat = cs.fill.startsWith("url(") && !/Gradient$/.test(fid ? document.getElementById(fid)?.tagName ?? "" : "");
    if (cs.fill.startsWith("url(") && !fillPat && !(cs.stroke !== "none" && !isSkip(cs.stroke))) return;
    const fillA = el.tagName === "line" || cs.fill === "none" || (cs.fill.startsWith("url(") && !fillPat) || (!fillPat && isSkip(cs.fill)) ? 0 : (fillPat ? 0.5 : colourAlpha(cs.fill)) * parseFloat(cs.fillOpacity || "1") * o;
    const strokeA = cs.stroke === "none" || isSkip(cs.stroke) ? 0 : colourAlpha(cs.stroke) * parseFloat(cs.strokeOpacity || "1") * o;
    const m = g.getScreenCTM();
    if (!m) return;
    const sc = Math.hypot(m.a, m.b);
    const sw = parseFloat(cs.strokeWidth || "0") * sc;
    // a CurvedLink (house kit) is a gold path drawn with pathLength="1" plus its chevron polyline in the same <g>
    const isLinkG = (g0: Element | null) => !!g0 && !!g0.querySelector(':scope > path[pathLength="1"]');
    const gold = strokeA > 0 && isGold(cs.stroke) && sw >= 3.5 && sw <= 6.5
      && ((el.tagName === "path" && el.getAttribute("pathLength") === "1") || (el.tagName === "polyline" && isLinkG(el.parentElement)));
    // muted-grey (#9aa6bd, the house "ticks and units" colour) lines up to 4.5 px are axis and guide lines that the labels
    // name; the gold r = 30 ring is the Keyword's 20-frame pulse on its target (an emphasis, gone a second later)
    const mut = rgbOf(cs.stroke);
    const guide = !!mut && Math.abs(mut[0] - 154) + Math.abs(mut[1] - 166) + Math.abs(mut[2] - 189) < 20 && sw <= 4.5;
    const pulseRing = el.tagName === "circle" && isGold(cs.stroke) && el.getAttribute("r") === "30" && cs.fill === "none";
    if (pulseRing) return;
    // UF2 fix 1 (K6 tuning): axis / guide lines are reported as kind "axis" (tested against gold links only: "links must not
    // cross … ticks", house §6), never against text
    if (guide && fillA < 0.3) {
      const m0 = g.getScreenCTM();
      let L0 = 0; try { L0 = g.getTotalLength(); } catch { return; }
      if (!m0 || !(L0 > 0)) return;
      const n0 = Math.min(120, Math.max(2, Math.ceil(L0 / 8)));
      const pts0: number[][] = [];
      for (let i = 0; i <= n0; i++) { const q = g.getPointAtLength((L0 * i) / n0); const s0 = new DOMPoint(q.x, q.y).matrixTransform(m0); pts0.push([r1(s0.x), r1(s0.y)]); }
      out.push({ k: "axis", c: cs.stroke, w: r1(sw), o: Math.round(strokeA * 100) / 100, pts: pts0, closed: false, g: groupId(el.parentElement), tag: el.tagName, clip: clipBox(el) });
      return;
    }
    const kind = gold ? "link" : fillA >= 0.3 ? "fill" : strokeA >= 0.45 && sw >= 3 ? "stroke" : "";
    if (!kind) return;
    let L = 0;
    try { L = g.getTotalLength(); } catch { return; }
    if (!(L > 0)) return;
    const n = Math.min(300, Math.max(2, Math.ceil((L * sc) / 6)));
    const pts: number[][] = [];
    const pt = new DOMPoint();
    for (let i = 0; i <= n; i++) {
      const q = g.getPointAtLength((L * i) / n);
      pt.x = q.x; pt.y = q.y;
      const s = pt.matrixTransform(m);
      pts.push([r1(s.x), r1(s.y)]);
    }
    const closed = kind === "fill" || el.tagName === "polygon" || el.tagName === "circle" || el.tagName === "rect" || el.tagName === "ellipse";
    const clip = clipBox(el);
    out.push({ k: kind, c: kind === "fill" ? cs.fill : cs.stroke, w: r1(kind === "fill" ? 0 : sw), o: Math.round((kind === "fill" ? fillA : strokeA) * 100) / 100,
      pts, closed, g: groupId(el.parentElement), tag: el.tagName, clip, contour: !!el.closest("[data-lc-contour]") || undefined, own: ownerOf(el) });
    // a filled shape that also has a visible outline stroke is also a stroke
    if (kind === "fill" && strokeA >= 0.45 && sw >= 3) out.push({ k: "stroke", c: cs.stroke, w: r1(sw), o: Math.round(strokeA * 100) / 100, pts, closed, g: groupId(el.parentElement), tag: el.tagName, clip });
  });
  document.querySelectorAll("img, svg image").forEach((el) => {
    if (el.closest("[data-lc-ok]")) return;
    const o = effOpacity(el);
    if (o < 0.2) return;
    const r0 = el.getBoundingClientRect();
    // cut to every overflow-clipping ancestor (an image cropped by its panel)
    let [x0, y0, x1, y1] = [r0.left, r0.top, r0.right, r0.bottom];
    for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.overflow !== "visible" || cs.overflowX !== "visible") {
        const q = e.getBoundingClientRect();
        if (!FULL(q)) { x0 = Math.max(x0, q.left); y0 = Math.max(y0, q.top); x1 = Math.min(x1, q.right); y1 = Math.min(y1, q.bottom); }
      }
    }
    const r = new DOMRect(x0, y0, Math.max(0, x1 - x0), Math.max(0, y1 - y0));
    if (r.width < 8 || r.height < 8 || FULL(r)) return;
    out.push({ k: "img", c: "img", w: 0, o: Math.round(o * 100) / 100, closed: true, g: groupId(el), tag: el.tagName.toLowerCase(),
      pts: [[r.left, r.top], [r.right, r.top], [r.right, r.bottom], [r.left, r.bottom]].map((p) => p.map(r1)) });
  });
  // UF2 fix 1 (K6 tuning): the gold underline of a CalcStack row (an HTML div, not SVG) is a stroke too ("what does it mean?" on
  // the underline at 13:49 was missed)
  document.querySelectorAll('div[style*="background"]').forEach((el) => {
    if (el.closest("[data-lc-ok]")) return;
    const cs = getComputedStyle(el);
    if (!isGold(cs.backgroundColor)) return;
    const r = el.getBoundingClientRect();
    if (r.height > 10 || r.width < 20) return;
    const o = effOpacity(el);
    if (o < 0.2) return;
    const y = r1(r.top + r.height / 2);
    out.push({ k: "stroke", c: cs.backgroundColor, w: r1(Math.max(3, r.height)), o: Math.round(o * 100) / 100, pts: [[r1(r.left), y], [r1(r.right), y]], closed: false,
      g: groupId(el), tag: "underline" });
  });
  PROBE.reg.forEach((s, id) => {
    if (s.frame !== frame || s.o < 0.2 || s.k === "mask3d") return;
    if (s.k === "arrow3d") {
      out.push({ k: "stroke", c: s.c, w: s.w, o: s.o, pts: s.pts.map((p) => p.map(r1)), closed: false, g: id, tag: "arrow3d" });
      if (s.head) out.push({ k: "fill", c: s.c, w: 0, o: s.o, pts: s.head.map((p) => p.map(r1)), closed: true, g: id, tag: "arrow3d-head" });
    } else if (s.k === "rod3d") {
      if (s.w >= 3 && !(s.c.toLowerCase() === "#9aa6bd" && s.w <= 4.5)) out.push({ k: "stroke", c: s.c, w: r1(s.w), o: s.o, pts: s.pts.map((p) => p.map(r1)), closed: false, g: id, tag: "rod3d" });
    } else if (s.o >= 0.3) {
      out.push({ k: "fill", c: s.c, w: 0, o: s.o, pts: s.pts.map((p) => p.map(r1)), closed: true, g: id, tag: s.k, own: s.own });
    }
  });
  return out;
};

// ---------------------------------------------------------------- K6 picture masks (house §5b, UF2)
// K1 GlobeFrame, K2 SourceBelow and K5 LayerStack3D publish an invisible <g data-k6-mask='{json}'> (the source line a
// data-k6-src='{json}'); the probe reports them with their effective opacity so tools/movie_qa.py (gate `overlap`) can fail
// must-class text inside the SHARP part of a picture and a source line closer than 16 px to its picture.
//   mask json: {name, k: "rect", r: [x0, y0, x1, y1]} | {name, k: "circle", c: [x, y], r} | {name, k: "poly", pts: [[x, y], ...]}
type Mask = { name: string; k: string; o: number; r?: number[] | number; c?: number[]; pts?: number[][]; src?: number[] };
const measureMasks = (): Mask[] => {
  const out: Mask[] = [];
  document.querySelectorAll("[data-k6-mask],[data-k6-src],[data-k6-cbar]").forEach((el) => {
    const o = effOpacity(el);
    if (o < 0.2) return;
    const raw = el.getAttribute("data-k6-mask") ?? el.getAttribute("data-k6-src") ?? el.getAttribute("data-k6-cbar") ?? "{}";
    try {
      const j = JSON.parse(raw);
      if (el.hasAttribute("data-k6-cbar")) {
        const r = el.getBoundingClientRect();
        out.push({ name: j.name ?? "cbar", k: "cbar", o: Math.round(o * 100) / 100, src: [r.left, r.top, r.right, r.bottom].map(r1) });
      } else if (el.hasAttribute("data-k6-src")) {
        const r = el.getBoundingClientRect();
        out.push({ name: j.name ?? "src", k: "src", o: Math.round(o * 100) / 100, src: [r.left, r.top, r.right, r.bottom].map(r1), r: j.pic });
      } else out.push({ ...j, o: Math.round(o * 100) / 100 });
    } catch (e) { console.log(`BBOXERR mask ${String(e)}`); }
  });
  // UF2 fix 1 (K6 tuning): K5 LayerStack3D publishes its projected outline through the WebGL probe registry
  PROBE.reg.forEach((s) => {
    if (s.k !== "mask3d" || s.frame !== PROBE.frame || s.o < 0.2) return;
    out.push({ name: s.name ?? "stack", k: "poly", o: Math.round(s.o * 100) / 100, pts: s.pts.map((p) => p.map(r1)) });
  });
  return out;
};

/** Mount once inside the composition (only in bbox mode). */
export const BoxProbe: React.FC = () => {
  const frame = useCurrentFrame();
  PROBE.on = true;
  PROBE.frame = frame;
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
        let shapes: Shape[] = [];
        let masks: Mask[] = [];
        try { masks = measureMasks(); } catch (e) { console.log(`BBOXERR masks ${frame} ${String(e)}`); }
        try { boxes = measure(); } catch (e) { console.log(`BBOXERR ${frame} ${String(e)}`); }
        try { shapes = measureShapes(frame); } catch (e) { console.log(`BBOXERR shapes ${frame} ${String(e)}`); }
        console.log(`BBOX ${JSON.stringify({ frame, boxes, shapes, masks })}`);
        continueRender(h);
      }, 150);
    };
    document.fonts.ready.then(() => setTimeout(poll, 60));
    return () => { done = true; };
  }, [frame, h]);
  return null;
};
