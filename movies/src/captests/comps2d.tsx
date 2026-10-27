// 2-D capability-test compositions: d3-geo synoptic map (S1), GIBS + d3 overlay (S2), d3 hourly loop (A1),
// MapLibre frames + Remotion overlay (A1), GEE frames + our colour bar (A4), before/after wipe (A5), SVG chart (A6),
// RustGIS relief + our isobars (C3). Pure functions of the frame.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { geoConicConformal, geoEquirectangular, geoPath, GeoProjection } from "d3-geo";
import { K, Label, lerp, ramp, useJson } from "./kit";

type Line = { p: Record<string, unknown>; c: number[][] };
type Iso = { l: number; c: number[][] };

const bboxPoly = (w: number, s: number, e: number, n: number) => {
  const c: number[][] = [];
  for (let i = 0; i <= 20; i++) c.push([w + (e - w) * i / 20, s]);
  for (let i = 0; i <= 20; i++) c.push([e, s + (n - s) * i / 20]);
  for (let i = 0; i <= 20; i++) c.push([e - (e - w) * i / 20, n]);
  for (let i = 0; i <= 20; i++) c.push([w, n - (n - s) * i / 20]);
  return { type: "Feature" as const, properties: {}, geometry: { type: "LineString" as const, coordinates: c } };
};
const ls = (c: number[][]) => ({ type: "LineString" as const, coordinates: c });

const lcc = (ext: [[number, number], [number, number]], b: number[]) =>
  geoConicConformal().parallels([42, 58]).rotate([8, 0]).center([0, 50]).fitExtent(ext, bboxPoly(b[0], b[1], b[2], b[3]));

/** front symbols: triangles (cold) or half discs (warm) every `gap` px on the side given by `side` (east or north) */
const FrontSym: React.FC<{ pts: [number, number][]; kind: string; gap?: number; size?: number; o?: number }> = ({ pts, kind, gap = 70, size = 22, o = 1 }) => {
  const col = kind === "warm" ? "#e04848" : "#3a6fe8";
  const out: React.ReactNode[] = [];
  let acc = gap / 2;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const L = Math.hypot(x1 - x0, y1 - y0);
    if (L < 1e-6) continue;
    const ux = (x1 - x0) / L, uy = (y1 - y0) / L;
    let nx = -uy, ny = ux;
    // heuristic side (stated in the test notes): cold symbols point east (+x), warm symbols point north (-y)
    if (kind === "warm" ? ny > 0 : nx < 0) { nx = -nx; ny = -ny; }
    while (acc <= L) {
      const px = x0 + ux * acc, py = y0 + uy * acc;
      if (kind === "warm") {
        const a0 = Math.atan2(uy, ux);
        const sweep = nx * Math.cos(a0 + Math.PI / 2) + ny * Math.sin(a0 + Math.PI / 2) > 0 ? 1 : 0;
        out.push(<path key={`${i}-${acc}`} d={`M ${px - ux * size / 2} ${py - uy * size / 2} A ${size / 2} ${size / 2} 0 0 ${sweep} ${px + ux * size / 2} ${py + uy * size / 2} Z`} fill={col} opacity={o} />);
      } else {
        out.push(<path key={`${i}-${acc}`} d={`M ${px - ux * size / 2} ${py - uy * size / 2} L ${px + nx * size * 0.9} ${py + ny * size * 0.9} L ${px + ux * size / 2} ${py + uy * size / 2} Z`} fill={col} opacity={o} />);
      }
      acc += gap;
    }
    acc -= L;
  }
  return <g>{out}</g>;
};

const proj2 = (p: GeoProjection, c: number[][]) => c.map((q) => p(q as [number, number]) as [number, number]).filter(Boolean);

// ------------------------------------------------------------------ S1 d3-geo still
type S1 = { isobars: Iso[]; fronts: Line[]; low: { lat: number; lon: number; hPa: number }; high: { lat: number; lon: number; hPa: number }; arrows: number[][] };
export const S1Build: React.FC = () => <S1D3 build />;
export const S1D3: React.FC<{ build?: boolean }> = ({ build = false }) => {
  const fr = useCurrentFrame();
  const o = (a: number, b: number) => (build ? ramp(fr, a, b) : 1);
  const s = useJson<S1>("s1.json");
  const coast = useJson<Line[]>("coast_ciaran.json");
  const bord = useJson<Line[]>("borders_ciaran.json");
  if (!s || !coast || !bord) return null;
  const p = lcc([[60, 40], [1860, 1040]], [-35, 33, 20, 66]);
  const path = geoPath(p);
  const clipId = "clip";
  const frame = path(bboxPoly(-35, 33, 20, 66).geometry as never) ?? "";
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <svg width={1920} height={1080}>
        <defs><clipPath id={clipId}><path d={frame + "Z"} /></clipPath></defs>
        <path d={frame + "Z"} fill="#202a44" />
        <g clipPath={`url(#${clipId})`}>
          {coast.map((c, i) => <path key={i} d={path(ls(c.c)) ?? ""} stroke="#8fa0c0" strokeWidth={1.6} fill="none" />)}
          {bord.map((c, i) => <path key={i} d={path(ls(c.c)) ?? ""} stroke="#5d6b88" strokeWidth={1.1} strokeDasharray="5 4" fill="none" />)}
          <g opacity={o(30, 90)}>{s.isobars.map((c, i) => <path key={i} d={path(ls(c.c)) ?? ""} stroke={c.l % 20 === 0 ? K.key : "#c9d1e3"} strokeWidth={c.l % 20 === 0 ? 3.2 : 1.8} fill="none" />)}</g>
          <g opacity={o(160, 210)}>{s.arrows.map(([la, lo, u, v], i) => {
            const a = p([lo, la]); if (!a) return null;
            const sp = Math.hypot(u, v), k = 2.6;
            const b: [number, number] = [a[0] + u * k, a[1] - v * k];
            return <g key={i} opacity={0.85}><line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={K.teal} strokeWidth={2.4} />
              <circle cx={b[0]} cy={b[1]} r={sp > 15 ? 4 : 3} fill={K.teal} /></g>;
          })}</g>
          <g opacity={o(100, 150)}>{s.fronts.map((f, i) => { const pts = proj2(p, f.c); const k = String(f.p.kind);
            return <g key={i}><path d={path(ls(f.c)) ?? ""} stroke={k === "warm" ? "#e04848" : "#3a6fe8"} strokeWidth={5} fill="none" /><FrontSym pts={pts} kind={k} /></g>; })}</g>
        </g>
        <g opacity={o(220, 260)}>{[s.low, s.high].map((c, i) => { const a = p([c.lon, c.lat]); if (!a) return null;
          return <g key={i}><text x={a[0]} y={a[1] + 26} fontSize={96} fontWeight={800} fill={i === 0 ? K.rose : "#6fa8ff"} textAnchor="middle" fontFamily={K.font}>{i === 0 ? "L" : "H"}</text>
            <text x={a[0]} y={a[1] + 82} fontSize={48} fill={K.key} textAnchor="middle" fontFamily={K.font}>{Math.round(c.hPa)}</text></g>; })}</g>
      </svg>
      <Label x={90} y={60} s={54}>Ciarán · 12 UTC 2 Nov 2023 · ERA5</Label>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ S2 GIBS image + d3 overlay
export const S2D3: React.FC = () => {
  const s = useJson<S1>("s1.json");
  const coast = useJson<Line[]>("coast_ciaran.json");
  if (!s || !coast) return null;
  // the MODIS Aqua mosaic is equirectangular over -50..10 E, 35..70 N; the same projection places the lines
  const p = geoEquirectangular().fitExtent([[0, -170], [1920, 1250]], bboxPoly(-42, 35, 10, 70));
  const a = p([-50, 70])!, b = p([10, 35])!;
  const path = geoPath(p);
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Img src={staticFile("s2_modis.jpg")} style={{ position: "absolute", left: a[0], top: a[1], width: b[0] - a[0], height: b[1] - a[1] }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {coast.map((c, i) => <path key={i} d={path(ls(c.c)) ?? ""} stroke={K.gold} strokeWidth={1.6} fill="none" />)}
        {s.isobars.map((c, i) => <path key={i} d={path(ls(c.c)) ?? ""} stroke="#ffffff" strokeOpacity={0.9} strokeWidth={c.l % 20 === 0 ? 3.4 : 2} fill="none" />)}
        {(() => { const q = p([s.low.lon, s.low.lat])!; return <text x={q[0]} y={q[1] + 30} fontSize={96} fontWeight={800} fill={K.rose} textAnchor="middle" fontFamily={K.font}>L</text>; })()}
      </svg>
      <Label x={90} y={60} s={54}>MODIS Aqua true colour + ERA5 isobars</Label>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ A1 d3 hourly loop (crossfade between data hours)
type Hour = { t: string; iso: Iso[]; fronts: Line[]; low: [number, number, number] };
export const A1D3: React.FC = () => {
  const f = useCurrentFrame();
  const H = useJson<Hour[]>("a1_hours.json");
  const coast = useJson<Line[]>("coast_ciaran.json");
  if (!H || !coast) return null;
  const p = lcc([[60, 40], [1860, 1040]], [-40, 36, 10, 66]);
  const path = geoPath(p);
  const per = 12;
  const x = Math.min(H.length - 1.0001, f / per);
  const i0 = Math.floor(x), w = x - i0;
  const frame = path(bboxPoly(-40, 36, 10, 66).geometry as never) ?? "";
  const layer = (h: Hour, o: number) => (
    <g opacity={o}>
      {h.iso.map((c, i) => <path key={i} d={path(ls(c.c)) ?? ""} stroke={c.l % 20 === 0 ? K.key : "#c9d1e3"} strokeWidth={c.l % 20 === 0 ? 3 : 1.7} fill="none" />)}
      {h.fronts.map((fr, i) => { const k = String(fr.p.kind); return <g key={i}><path d={path(ls(fr.c)) ?? ""} stroke={k === "warm" ? "#e04848" : "#3a6fe8"} strokeWidth={5} fill="none" /><FrontSym pts={proj2(p, fr.c)} kind={k} /></g>; })}
    </g>);
  const L0 = H[i0].low, L1 = H[i0 + 1].low;
  const lp = p([lerp(L0[0], L1[0], w), lerp(L0[1], L1[1], w)])!;
  const hr = H[i0].t;
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <svg width={1920} height={1080}>
        <defs><clipPath id="c1"><path d={frame + "Z"} /></clipPath></defs>
        <path d={frame + "Z"} fill="#202a44" />
        <g clipPath="url(#c1)">
          {coast.map((c, i) => <path key={i} d={path(ls(c.c)) ?? ""} stroke="#8fa0c0" strokeWidth={1.5} fill="none" />)}
          {layer(H[i0], 1 - w)}{layer(H[i0 + 1], w)}
        </g>
        <text x={lp[0]} y={lp[1] + 28} fontSize={96} fontWeight={800} fill={K.rose} textAnchor="middle" fontFamily={K.font}>L</text>
      </svg>
      <Label x={90} y={60} s={68}>{`${hr.slice(8, 10)} Nov ${hr.slice(11, 13)}:00 UTC`}</Label>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ A1 MapLibre frames + Remotion overlay
export const A1ML: React.FC = () => {
  const f = useCurrentFrame();
  const H = useJson<Hour[]>("a1_hours.json");
  if (!H) return null;
  const per = 12;
  const x = Math.min(24.0001 - 0.001, f / per), i0 = Math.floor(x), w = x - i0;
  const name = (i: number) => staticFile(`a1ml_${String(i).padStart(2, "0")}.png`);
  // MapLibre fitBounds(padding 4) in Web Mercator over the prepared bounds -> pixel mapping for the overlay
  const b = [-40.125, 35.875, 10.125, 66.125];
  const mx = (lo: number) => (lo + 180) / 360, my = (la: number) => (1 - Math.log(Math.tan(Math.PI / 4 + la * Math.PI / 360)) / Math.PI) / 2;
  const sx = (1920 - 8) / (mx(b[2]) - mx(b[0])), sy = (1080 - 8) / (my(b[1]) - my(b[3]));
  const s = Math.min(sx, sy);
  const cx = (mx(b[0]) + mx(b[2])) / 2, cy = (my(b[1]) + my(b[3])) / 2;
  const P = (lo: number, la: number) => [960 + (mx(lo) - cx) * s, 540 + (my(la) - cy) * s];
  const L0 = H[i0].low, L1 = H[Math.min(24, i0 + 1)].low;
  const lp = P(lerp(L0[0], L1[0], w), lerp(L0[1], L1[1], w));
  const hr = H[i0].t;
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Img src={name(i0)} style={{ position: "absolute", width: 1920, height: 1080 }} />
      <Img src={name(Math.min(24, i0 + 1))} style={{ position: "absolute", width: 1920, height: 1080, opacity: w }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <circle cx={lp[0]} cy={lp[1]} r={60} fill="none" stroke={K.gold} strokeWidth={6} />
        <text x={lp[0] + 80} y={lp[1] + 20} fontSize={64} fontWeight={800} fill={K.rose} fontFamily={K.font} stroke="#000" strokeWidth={1}>L {Math.round(lerp(L0[2], L1[2], w))}</text>
      </svg>
      <Label x={70} y={50} s={68}>{`${hr.slice(8, 10)} Nov ${hr.slice(11, 13)}:00 UTC`}</Label>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ A4 GEE frames + our colour bar
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const A4Bar: React.FC = () => {
  const f = useCurrentFrame();
  const per = 25, i = Math.min(11, Math.floor(f / per)), w = clampW((f % per) / per);
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Img src={staticFile(`a4_${String(i).padStart(2, "0")}.png`)} style={{ position: "absolute", left: 60, top: 100, width: 1500, height: 800 }} />
      {i < 11 ? <Img src={staticFile(`a4_${String(i + 1).padStart(2, "0")}.png`)} style={{ position: "absolute", left: 60, top: 100, width: 1500, height: 800, opacity: w }} /> : null}
      <Img src={staticFile("cbar_balance.png")} style={{ position: "absolute", left: 1640, top: 180, width: 70, height: 600 }} />
      <Label x={1730} y={150} s={48} c={K.ink}>+3</Label>
      <Label x={1730} y={455} s={48} c={K.ink}>0</Label>
      <Label x={1730} y={750} s={48} c={K.ink}>−3</Label>
      <Label x={1620} y={800} s={44} c={K.muted}>°C</Label>
      <Label x={70} y={20} s={64}>{`${MONTHS[i]} 2023 · SST anomaly`}</Label>
    </AbsoluteFill>
  );
};
const clampW = (x: number) => Math.max(0, Math.min(1, (x - 0.6) / 0.4));

// ------------------------------------------------------------------ A5 before/after wipe
export const A5Wipe: React.FC = () => {
  const f = useCurrentFrame();
  const t = ramp(f, 60, 180) - ramp(f, 230, 290) * 0.5;
  const W = 800, x0 = 560, y0 = 140;
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Img src={staticFile("a5_before.png")} style={{ position: "absolute", left: x0, top: y0, width: W, height: W }} />
      <div style={{ position: "absolute", left: x0, top: y0, width: W * t, height: W, overflow: "hidden" }}>
        <Img src={staticFile("a5_after.png")} style={{ width: W, height: W }} />
      </div>
      <div style={{ position: "absolute", left: x0 + W * t - 3, top: y0, width: 6, height: W, background: K.gold }} />
      <Label x={x0 - 40} y={y0 + 300} s={54} anchor="end">Aug–Sep 2022</Label>
      <Label x={x0 + W + 40} y={y0 + 300} s={54}>Aug–Sep 2021</Label>
      <Label x={70} y={30} s={60}>Lower Indus · MODIS false colour</Label>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ A6 chart drawing itself
export const A6Chart: React.FC = () => {
  const f = useCurrentFrame();
  const d = useJson<{ t: string[]; v: number[] }>("a6_nino.json");
  if (!d) return null;
  const n = d.v.length, k = Math.max(2, Math.round(lerp(2, n, ramp(f, 15, 400))));
  const X = (i: number) => 140 + (i / (n - 1)) * 1680, Y = (v: number) => 470 - v * 120;
  let pos = "", neg = "";
  for (let i = 0; i < k; i++) {
    const v = d.v[i];
    pos += `${i ? "L" : "M"}${X(i)},${Y(Math.max(0, v))}`;
    neg += `${i ? "L" : "M"}${X(i)},${Y(Math.min(0, v))}`;
  }
  const close = `L${X(k - 1)},${Y(0)}L${X(0)},${Y(0)}Z`;
  const years = [1985, 1995, 2005, 2015, 2025];
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <svg width={1920} height={1080}>
        <path d={pos + close} fill={K.rose} opacity={0.9} />
        <path d={neg + close} fill="#4f7fbf" opacity={0.9} />
        <line x1={140} x2={1820} y1={Y(0)} y2={Y(0)} stroke={K.muted} strokeWidth={2} />
        {years.map((y) => { const i = (y - 1982) * 12; return <text key={y} x={X(i)} y={860} fontSize={48} fill={K.muted} textAnchor="middle" fontFamily={K.font}>{y}</text>; })}
        {[-2, 2].map((v) => <text key={v} x={120} y={Y(v) + 16} fontSize={48} fill={K.muted} textAnchor="end" fontFamily={K.font}>{v > 0 ? "+2" : "−2"}</text>)}
      </svg>
      <Label x={140} y={60} s={68}>{`${d.t[k - 1]}   ${d.v[k - 1] >= 0 ? "+" : "−"}${Math.abs(d.v[k - 1]).toFixed(1)} °C`}</Label>
      <Label x={1820} y={60} s={54} c={K.muted} anchor="end">Niño 3.4 SST anomaly</Label>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ C3 RustGIS relief + our isobars + labels
type C3 = { bounds: number[]; isobars: Iso[]; places: [string, number, number][] };
export const C3Relief: React.FC = () => {
  const f = useCurrentFrame();
  const d = useJson<C3>("c3.json");
  const coast = useJson<Line[]>("coast_ciaran.json");
  if (!d || !coast) return null;
  const [w, s, e, n] = d.bounds;
  const p = geoEquirectangular().fitExtent([[160, 40], [1760, 1040]], bboxPoly(w, s, e, n));
  const a = p([w, n])!, b = p([e, s])!;
  const path = geoPath(p);
  const o1 = ramp(f, 30, 90), o2 = ramp(f, 100, 160);
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Img src={staticFile("c3_hs.png")} style={{ position: "absolute", left: a[0], top: a[1], width: b[0] - a[0], height: b[1] - a[1], filter: "brightness(0.9)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <g opacity={o1}>{d.isobars.map((c, i) => <path key={i} d={path(ls(c.c)) ?? ""} stroke={K.teal} strokeWidth={c.l % 20 === 0 ? 4 : 2.4} fill="none" />)}</g>
        <g opacity={o2}>{d.places.map(([nm, lo, la]) => { const q = p([lo, la])!; return <g key={nm}><circle cx={q[0]} cy={q[1]} r={12} fill={K.gold} />
          <text x={q[0] + 20} y={q[1] - 14} fontSize={52} fontWeight={700} fill={K.key} stroke="#000" strokeWidth={1.2} fontFamily={K.font}>{nm}</text></g>; })}</g>
      </svg>
    </AbsoluteFill>
  );
};
