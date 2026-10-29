import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ramp } from "../house";
import timing from "../../ch00/ch00_weather_basics/timing.json";
import basicsJ from "../../ch00/ch00_weather_basics/data/basics.json";
import atmosJ from "../../ch00/ch00_weather_basics/data/atmos.json";
import soundJ from "../../ch00/ch00_weather_basics/data/soundings.json";
import moistJ from "../../ch00/ch00_weather_basics/data/moist.json";
import hlJ from "../../ch00/ch00_weather_basics/data/highs_lows.json";
import globalH from "../../ch00/ch00_weather_basics/data/global_20231102T12.json";
import isoGJ from "../../ch00/ch00_weather_basics/data/isobars_20231102T12.json";
import brestCJ from "../../ch00/ch00_weather_basics/data/brest_climate.json";
import stationsJ from "../../ch00/ch00_weather_basics/data/igra_stations_2023.json";
import hourlyJ from "../../ch00/ch00_weather_basics/data/ciaran_hourly.json";
import brestHJ from "../../ch00/ch00_weather_basics/data/brest_hourly.json";
import frontsJ from "../../ch00/ch00_weather_basics/data/fronts.json";
import c850J from "../../ch00/ch00_weather_basics/data/ciaran_850.json";
import climJ from "../../ch00/ch00_weather_basics/data/climatology.json";
import linesJ from "../../ch00/ch00_weather_basics/data/lines.json";
import titleJ from "../../ch00/ch00_weather_basics/data/title.json";
import tibJ from "../../ch00/ch00_weather_basics/data/tibet_etopo.json";
import latestJ from "../../ch00/ch00_weather_basics/data/latest_map.json";
import cesTibJ from "../../ch00/ch00_weather_basics/data/cesium_tibet_anchors.json";
import uf1J from "../../ch00/ch00_weather_basics/data/uf1.json";
import sliceJ from "../../ch00/ch00_weather_basics/data/slice.json";
import sliceCfJ from "../../ch00/ch00_weather_basics/data/slice_cf.json";
import britJ from "../../ch00/ch00_weather_basics/data/brittany_etopo.json";
import { CurvedLink, SunGlyph } from "../house/kit/extras";
import { C, FONT, T } from "../house/kit/type";
import { Arrow, Bracket, Dash, Lbl, Pt, Svg, clamp, lerp, pulse, textW } from "../house/kit/draw";
import { CalcRow, CalcStack, Layered, Part, TeX, base, col } from "../house/kit/tex";
import { Keyword } from "../house/kit/notes";
import { RiseText, TitleGradient } from "../house/kit/title";
import { ClockGlyph, Droplet, Notebook } from "../house/kit/icons";
import { V3, orbitCam, OrbitKey, orbitPath, projector, Projector, easeIO, D2R, CamState } from "./kit_wb/cam";
import { GlobeCam, GlobeMesh, GProj, coastPath, globeCam, globePath, globeProj, gcArrowPts, llPath, SurfArrow, sphereGeo, useTex, useBin, ll, Graticule, LatCircle } from "./kit_wb/globe";
import { Arrow3D, Ball3D, Quad3D, Rod3D, View3D } from "./kit_wb/three3d";
import { Box3D, BoxEdges3D, Plate3D, SliceWall, Sphere3D, WedgeEarth } from "./kit_wb/col3d";
import { GeoImage, IsoLevel, IsoPaths, MapBox, MapPlane, ShellMesh, Terrain, Wall, fieldTexture, lerpBox, linesPath, llLine, lutAt, lutCss, mapP, slice2, useFieldTex,
  useFieldURL, useVars } from "./kit_wb/wb";
import * as THREE from "three";
import { BoxProbe } from "./kit_wb/bbox";

/**
 * Chapter 0B movie "Weather basics: pressure, temperature, humidity and wind, from scratch", version 1
 * (movies/ch00/ch00_weather_basics/storyboard.yaml, 62 scenes), 1920×1080, 30 fps; length = timing.json + 2.5-s hold.
 * House style movies/HOUSE_STYLE.md (reference ch00_dot_product_why v6): one title (s00), keywords not sentences, no
 * boxes, no references, content y 40-860 (the caption band stays empty), text ≥ 44 px, reveals on their words (AT).
 * Real maps and data animation wherever the picture can sit on the Earth (series_plan "Maps and animation"): globes
 * (GIBS true colour, Blue Marble, ERA5 fields), maps (MODIS true colour, ERA5 isobars, fronts, winds), soundings rising.
 * Every number and every moving or coloured thing comes from data/*.json written by movies/data/build_ch00_weather_basics.py
 * from tested fluidpy functions (manifest.json); this file only indexes and interpolates. Diagrams (slab, cubes, wedges,
 * molecules, icons) are illustrative and listed as such in the storyboard.
 */

export const WB_FPS = 30;
const FPS = WB_FPS;
type Snt = { text: string; start: number; end: number };
type Scn = { id: string; start: number; end: number; sentences: Snt[] };
const sc = (timing as unknown as { scenes: Scn[]; total_frames: number }).scenes;
const HOLD = 75;
const XF = 10;
export const WB_FRAMES = (timing as unknown as { total_frames: number }).total_frames + HOLD;
const IDS = sc.map((s) => s.id);
const K = (id: string) => { const k = IDS.indexOf(id); if (k < 0) throw new Error(`no scene ${id}`); return k; };
const CUT = sc.map((s, i) => (i === 0 ? 0 : Math.round(s.start * FPS)));
const END = [...CUT.slice(1), WB_FRAMES];
const LEN = (k: number) => END[k] - CUT[k];
const SS = (k: number, j: number) => Math.round(sc[k].sentences[j].start * FPS) - CUT[k];
const SE = (k: number, j: number) => Math.round(sc[k].sentences[j].end * FPS) - CUT[k];
const AT = (k: number, j: number, phrase: string) => {
  const s = sc[k].sentences[j];
  if (!s) throw new Error(`${sc[k].id} has no sentence ${j}`);
  const i = s.text.indexOf(phrase);
  if (i < 0) throw new Error(`phrase "${phrase}" not in ${sc[k].id} sentence ${j}`);
  return Math.round((s.start + ((s.end - s.start) * i) / s.text.length) * FPS) - CUT[k];
};
const fin = (f: number, a: number, n = 12) => ramp(f, a, a + n);
const fout = (f: number, a: number, n = 10) => 1 - ramp(f, a, a + n);
const win = (f: number, a: number, b: number, n = 10) => fin(f, a, n) * fout(f, b, n);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const fmt = (v: number, d = 0) => v.toFixed(d);
const interp = (x: number, xs: number[], ys: number[]) => {
  if (x <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) if (x <= xs[i]) { const w = (x - xs[i - 1]) / (xs[i] - xs[i - 1]); return ys[i - 1] + (ys[i] - ys[i - 1]) * w; }
  return ys[ys.length - 1];
};

// ---------------------------------------------------------------- data (typed loosely; numbers come from the builder)
/* eslint-disable @typescript-eslint/no-explicit-any */
const BA = basicsJ as any, AM = atmosJ as any, SD = soundJ as any, MO = moistJ as any, HL = hlJ as any, GH = globalH as any;
const ISO_G = (isoGJ as any).levels as IsoLevel[];
const BC = brestCJ as any, ST = stationsJ as any, HR = hourlyJ as any, BH = brestHJ as any, FR = frontsJ as any, C8 = c850J as any;
const CL = climJ as any, LN = linesJ as any, TI = titleJ as any;
const UF = uf1J as any, SLJ = sliceJ as any, SCJ = sliceCfJ as any, BRJ = britJ as any;
const COAST = LN.globe_coast_110m as number[][];
const LUT_THERMAL = GH.luts.thermal as string[], LUT_HALINE = GH.luts.haline as string[], LUT_DENSE = GH.luts.dense as string[],
  LUT_BAL = GH.luts.balance as string[];
const IMG = {
  globe: staticFile("wb_globe_tc_20231102.jpg"), bmng: staticFile("wb_bmng.jpg"), tc1101: staticFile("wb_ciaran_tc_20231101.jpg"),
  modis: staticFile("wb_modis_20231102.jpg"), cumulus: staticFile("wb_cumulus_20240624.jpg"),
  terra: staticFile("wb_cumulus_terra_20240624.jpg"), brittany: staticFile("wb_bmng_brittany.jpg"),
};
const BOX_TC1101: [number, number, number, number] = [35, 65, -40, 10];
const BOX_MODIS: [number, number, number, number] = [35, 70, -50, 10];
const BOX_CU: [number, number, number, number] = [47, 49.5, 0, 4];
const BREST: [number, number] = [48.39, -4.49];
const TRAPPES: [number, number] = [SD.trappes.lat, SD.trappes.lon];
const SING: [number, number] = [SD.singapore.lat, SD.singapore.lon];
const SHELL50 = (12 / 6371) * 50;

// ---------------------------------------------------------------- equations (verbatim from the storyboard)
const EQ_S04 = String.raw`p = \dfrac{\text{force}}{\text{area}}`;
const EQ_S05 = String.raw`m = \dfrac{p_0}{g} = \dfrac{101\,325}{9.81} \approx 10\,300\ \mathrm{kg}`;
const EQ_S07 = String.raw`1\ \mathrm{hPa} = 100\ \mathrm{Pa}`;
const EQ_S08 = String.raw`50\ \mathrm{m^3} \times 1.2\ \mathrm{kg/m^3} = 60\ \mathrm{kg}`;
const EQ_S09 = String.raw`T\,[\mathrm{K}] = T\,[^\circ\mathrm{C}] + 273.15`;
const EQ_S10 = String.raw`p = \rho R T`;
const EQ_S11 = String.raw`\rho = \dfrac{p}{R T} = \dfrac{101\,325}{287 \times 288.15} \approx 1.225\ \mathrm{kg/m^3}`;
const EQ_S12 = String.raw`\dfrac{1.29 - 1.16}{1.29} \approx 10\,\%`;
const EQ_S14 = String.raw`p(z) - p(z+\Delta z) = \rho\, g\, \Delta z`;
const EQ_S15 = String.raw`\dfrac{\partial p}{\partial z} = -\rho\, g`;
const EQ_S16 = String.raw`\rho g = 1.225 \times 9.81 \approx 12\ \mathrm{Pa/m}`;
const EQ_S17 = String.raw`\dfrac{\partial p}{\partial z} = -\dfrac{p\, g}{R T}`;
const EQ_S18 = String.raw`H = \dfrac{R T}{g}`;
const EQ_S19 = String.raw`\ln\dfrac{p}{p_0} = -\dfrac{z}{H}`;
const EQ_S20 = String.raw`8.43 \times \ln 2 \approx 5.8\ \mathrm{km}`;
const EQ_S22 = String.raw`\text{fraction below} = 1 - \dfrac{p(z)}{p_0}`;
const EQ_S27 = String.raw`e \approx 1.61\, q\, p = 1.61 \times 0.020 \times 1000 \approx 32\ \mathrm{hPa}`;
const EQ_S29 = String.raw`RH = \dfrac{\text{vapour pressure}}{\text{saturation vapour pressure}} \times 100\,\%`;
const EQ_S29_SHOWN = String.raw`RH = \dfrac{\text{vapour pressure}}{\begin{array}{c}\text{saturation}\\ \text{vapour pressure}\end{array}} \times 100\,\%`;
const EQ_S31 = String.raw`12 \div 8 \approx 1.5\ \mathrm{km}`;
const EQ_S32 = String.raw`|\mathbf v| = \sqrt{8^2 + 6^2} = 10\ \mathrm{m/s}`;
const EQ_S34 = String.raw`1\ \mathrm{kt} = 1852\ \mathrm{m} \div 3600\ \mathrm{s} \approx 0.51\ \mathrm{m/s}`;
const EQ_S40 = String.raw`p_{\text{sea}} = p_s\, e^{z_s/H} = 835 \times e^{1.609/8.43} \approx 1010\ \mathrm{hPa}`;
const EQ_S51 = String.raw`\dfrac{1\ \mathrm{m}}{\cos 60^\circ} = 2\ \mathrm{m}`;
const EQ_S58 = String.raw`23.2 \div 0.514 \approx 45\ \mathrm{kt}`;
const EQ_S60 = String.raw`p = p_0\, e^{-z/H}`;

// UF1 storyboard equations that the composition shows split over a CalcStack row's lhs/rhs or built piece by piece (s14, s18,
// s18b, s19, s19b): the full strings, verbatim from the storyboard, for the equations QA gate (the screen shows the same maths)
const EQ_UF1_SPLIT = [String.raw`V = 1\ \mathrm{m^2} \times \Delta z`, String.raw`m = \rho\, V = \rho \times 1\ \mathrm{m^2} \times \Delta z`,
  String.raw`W = m\, g = \rho\, g\, \Delta z \times 1\ \mathrm{m^2}`,
  String.raw`p(z) \times 1\ \mathrm{m^2} - p(z+\Delta z) \times 1\ \mathrm{m^2} = \rho\, g\, \Delta z \times 1\ \mathrm{m^2}`,
  String.raw`\dfrac{\mathrm{J}}{\mathrm{kg\,K}} = \dfrac{\mathrm{m^2}}{\mathrm{s^2\,K}}`,
  String.raw`h = \dfrac{p_0}{\rho_0\, g} = \dfrac{101\,325}{1.225 \times 9.81} \approx 8.43\ \mathrm{km}`,
  String.raw`\dfrac{1}{p}\dfrac{\partial p}{\partial z} = -\dfrac{1}{H}`, String.raw`\int_{p_0}^{p} \dfrac{dp'}{p'} = -\dfrac{1}{H}\int_{0}^{z} dz'`,
  String.raw`\ln p - \ln p_0 = \ln\dfrac{p}{p_0}`];
void EQ_UF1_SPLIT;

// ---------------------------------------------------------------- numbers in the TeX strings = the data (fail the render otherwise)
const CHECK: [string, number, number, number][] = [
  ["mass", BA.column.mass_kg, 10332, 1], ["rho15", BA.density.rho15, 1.225, 6e-4], ["rho0", BA.density.rho_0C, 1.29, 6e-3], ["rho30", BA.density.rho_30C, 1.16, 6e-3],
  ["rho g", BA.near_ground.rho_g, 12, 0.05], ["H", BA.scale_height.H_m / 1000, 8.43, 0.01], ["halve", BA.scale_height.halving.z_km[0], 5.85, 0.06],
  ["e", MO.q_example.e_hPa, 32, 0.3], ["lcl", MO.lcl.z_m / 1000, 1.5, 0.06], ["speed", BA.wind.speed, 10, 1e-9], ["knot", BA.wind.knot_ms, 0.514, 5e-4],
  ["slp", BA.sea_level.p_sea_hPa, 1010, 1], ["kt03", BH.speed_kt[27], 45, 0.5], ["v03", BH.speed_ms[27], 23.2, 0.05],
];
CHECK.forEach(([n, v, r, tol]) => { if (!(Math.abs(v - r) <= tol)) throw new Error(`CHECK ${n}: data ${v} vs screen ${r}`); });
if (BH.time_utc[27] !== "2023-11-02T03") throw new Error("brest_hourly index 27 is not 03 UTC 2 Nov");

// ---------------------------------------------------------------- shared pieces
const Scene: React.FC<{ children: React.ReactNode; fadeIn?: boolean }> = ({ children, fadeIn = true }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.bg, opacity: fadeIn ? ramp(f, 0, XF) : 1 }}>{children}</AbsoluteFill>;
};
const GHV = GH.variables as { name: string }[];
const GNY = 361, GNX = 720;
/** the global ERA5 hour as Float32 fields (null while loading) */
const useGlobal = () => useVars(staticFile("wb_global_20231102T12.bin"), GH);
/** a globe in a screen rectangle: Earth texture, optional field layer (texture over the whole sphere), optional shell,
 * then an SVG overlay drawn with the same camera (coasts and whatever `over` returns) */
const FieldSphere: React.FC<{ tex: THREE.Texture | null; o: number; r?: number }> = ({ tex, o, r = 1.002 }) => {
  const geo = React.useMemo(() => sphereGeo(-180, 180, 240, 120, r), [r]);
  const mat = React.useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false }), []);
  if (mat.map !== tex) { mat.map = tex; mat.needsUpdate = true; }
  mat.opacity = o;
  if (!tex || o <= 0) return null;
  return <mesh geometry={geo} material={mat} renderOrder={6} />;
};
type GlobeProps = { cam: GlobeCam; box?: { x: number; y: number; w: number; h: number }; img?: string; field?: THREE.Texture | null; fieldO?: number;
  field2?: THREE.Texture | null; field2O?: number; shell?: number; shellO?: number; coast?: number; o?: number; dim?: number;
  over?: (G: GProj) => React.ReactNode; under3d?: React.ReactNode; grat?: number; wedge?: { lon0: number; slide: number }; boxed?: boolean; canvas?: { x: number; y: number; w: number; h: number; fadeY: number } };
const GBOX = { x: 80, y: 40, w: 920, h: 820 };
const Globe: React.FC<GlobeProps> = ({ cam, box = GBOX, img = IMG.globe, field = null, fieldO = 0, field2 = null, field2O = 0, shell = 0, shellO = 0.32, coast = 0.45,
  o = 1, dim = 1, over, under3d, grat = 0, wedge, boxed = false, canvas }) => {
  const tex = useTex(img);
  // UF1 fix 1 (v4 review 1 M4): the main globe draws into a full-frame canvas with the SAME pixel scale and centre as its
  // box (fov widened so tan(fov/2)/H is unchanged; principal point moved by the box offset), so a zoomed globe is never cut
  // by the box's straight edges; the canvas fades out over y 850-900 so the caption band stays clear.
  const full = (box === GBOX && !boxed) || !!canvas, CV = canvas ?? (full ? { x: 0, y: 0, w: 1920, h: 1080 } : box);
  const fy = canvas ? canvas.fadeY - canvas.y : 850;
  const fov0 = cam.fov ?? 35, fovC = full ? (2 * Math.atan(Math.tan((fov0 * D2R) / 2) * CV.h / box.h)) / D2R : fov0;
  const ppC: Pt = cam.pp ? [cam.pp[0] + box.x - CV.x, cam.pp[1] + box.y - CV.y] : [box.x - CV.x + box.w / 2, box.y - CV.y + box.h / 2];
  const st = globeCam({ ...cam, fov: fovC, pp: ppC }, ppC);
  const G = globeProj(st, CV.w, CV.h, CV.x, CV.y);
  if (o <= 0) return null;
  const id = `gc${box.x}_${box.y}`;
  const fade = full ? `linear-gradient(to bottom, black 0px, black ${fy}px, transparent ${fy + 45}px)` : undefined;
  return (
    <>
      <View3D st={st} x={CV.x} y={CV.y} w={CV.w} h={CV.h} o={tex ? o : 0} key3={st.pos} amb={1.6} dir={1.4}
        style={fade ? { WebkitMaskImage: fade, maskImage: fade } : undefined}>
        {wedge && wedge.slide > 0 ? <WedgeEarth tex={tex} lon0={wedge.lon0} slide={wedge.slide} /> : <GlobeMesh tex={tex} dim={dim} />}
        <FieldSphere tex={field} o={fieldO} />
        <FieldSphere tex={field2} o={field2O} r={1.003} />
        <ShellMesh h={shell} o={shellO} />
        {under3d}
      </View3D>
      <Svg o={o}>
        <defs><clipPath id={id}><rect x={CV.x} y={CV.y} width={CV.w} height={full ? fy + 20 : CV.h} /></clipPath></defs>
        <g clipPath={`url(#${id})`}>
          {grat > 0 ? <Graticule G={G} step={30} o={grat} /> : null}
          {coast > 0 ? <path d={coastPath(G, COAST)} fill="none" stroke={C.key} strokeOpacity={coast} strokeWidth={1.6} /> : null}
          {over ? over(G) : null}
        </g>
      </Svg>
    </>
  );
};
/** the dot + name of a place on a globe or map */
const Place: React.FC<{ p: Pt; t?: string; o?: number; dx?: number; dy?: number; a?: "start" | "middle" | "end"; c?: string; r?: number }> = ({ p, t, o = 1, dx = 20, dy = -34, a = "start", c = C.gold, r = 11 }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <circle cx={p[0]} cy={p[1]} r={r} fill={c} stroke={C.bg} strokeWidth={4} />
      {t ? <Lbl x={p[0] + dx} y={p[1] + dy} t={t} c={C.key} s={T.key} a={a} /> : null}
    </g>
  );
/** billboard fade at the globe's limb: 1 facing the camera, 0 at the limb (dot(normal, view) below 0.15) */
const limb = (G: GProj, lat: number, lon: number) => {
  const q = G.w(lat, lon), c = G.camPos, d = [c[0] - q[0], c[1] - q[1], c[2] - q[2]], L = Math.hypot(d[0], d[1], d[2]) || 1, n = Math.hypot(q[0], q[1], q[2]) || 1;
  const dot = (q[0] * d[0] + q[1] * d[1] + q[2] * d[2]) / (L * n);
  return clamp((dot - 0.05) / 0.15, 0, 1);
};
/** a colour bar (52-px labels) */
const ColourBar: React.FC<{ x: number; y: number; w: number; lut: string[]; ticks: { v: number; t: string }[]; lo: number; hi: number; unit?: string; o?: number; title?: string }> = ({ x, y, w, lut, ticks, lo, hi, unit, o = 1, title }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      {/* UF1 R2: what the colours mean, above the bar (44 px muted) */}
      {title ? <Lbl x={x} y={y - 34} t={title} c={C.muted} s={44} b={false} /> : null}
      {Array.from({ length: 60 }, (_, i) => <rect key={i} x={x + (i * w) / 60} y={y} width={w / 60 + 0.8} height={26} fill={lutCss(lut, (i + 0.5) / 60)} />)}
      <rect x={x} y={y} width={w} height={26} fill="none" stroke={C.muted} strokeWidth={2} />
      {ticks.map((tk) => <Lbl key={tk.t} x={x + ((tk.v - lo) / (hi - lo)) * w} y={y + 62} t={tk.t} c={C.muted} s={52} a="middle" b={false} />)}
      {unit ? <Lbl x={x + w + 20} y={y + 13} t={unit} c={C.muted} s={52} b={false} /> : null}
    </g>
  );
/** XY axes; returns mappers. Ticks at 52 px. */
type Ax = { x: number; y: number; w: number; h: number; xr: [number, number]; yr: [number, number] };
const axX = (A: Ax) => (v: number) => A.x + ((v - A.xr[0]) / (A.xr[1] - A.xr[0])) * A.w;
const axY = (A: Ax) => (v: number) => A.y + A.h - ((v - A.yr[0]) / (A.yr[1] - A.yr[0])) * A.h;
const Axes: React.FC<{ A: Ax; xt: number[]; yt: number[]; xl?: string; yl?: string; o?: number; grid?: boolean; xfmt?: (v: number) => string; yfmt?: (v: number) => string }> = ({
  A, xt, yt, xl, yl, o = 1, grid = true, xfmt = (v) => String(v), yfmt = (v) => String(v) }) => {
  if (o <= 0) return null;
  const X = axX(A), Y = axY(A);
  return (
    <g opacity={o}>
      {grid ? yt.map((v) => <line key={`gy${v}`} x1={A.x} x2={A.x + A.w} y1={Y(v)} y2={Y(v)} stroke={C.grid} strokeWidth={1.5} />) : null}
      <line x1={A.x} y1={A.y + A.h} x2={A.x + A.w + 10} y2={A.y + A.h} stroke={C.muted} strokeWidth={3} />
      <line x1={A.x} y1={A.y - 10} x2={A.x} y2={A.y + A.h} stroke={C.muted} strokeWidth={3} />
      {xt.map((v) => <g key={`x${v}`}><line x1={X(v)} x2={X(v)} y1={A.y + A.h} y2={A.y + A.h + 10} stroke={C.muted} strokeWidth={3} />
        <Lbl x={X(v)} y={A.y + A.h + 38} t={xfmt(v)} c={C.muted} s={52} a="middle" b={false} /></g>)}
      {yt.map((v) => <g key={`y${v}`}><line x1={A.x - 10} x2={A.x} y1={Y(v)} y2={Y(v)} stroke={C.muted} strokeWidth={3} />
        <Lbl x={A.x - 16} y={Y(v)} t={yfmt(v)} c={C.muted} s={52} a="end" b={false} /></g>)}
      {xl ? <Lbl x={A.x + A.w} y={A.y + A.h + 92} t={xl} c={C.muted} s={52} a="end" b={false} /> : null}
      {yl ? <Lbl x={A.x + 14} y={A.y - 36} t={yl} c={C.muted} s={52} a="start" b={false} /> : null}
    </g>
  );
};
/** CalcStack rows with display fractions need taller rows than the default 1.42 × size */
const tall = (rows: CalcRow[], size: number): CalcRow[] => rows.map((r) => (/dfrac|sqrt/.test(`${String(r.lhs ?? "")} ${String(r.rhs)}`) && r.h === undefined ? { ...r, h: (r.size ?? size) * (/dfrac/.test(`${String(r.lhs ?? "")} ${String(r.rhs)}`) ? 2.35 : 1.6) } : r));
const poly = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
/** seeded pseudo-random (deterministic) */
const rnd = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
/** molecules bouncing in a box: positions at frame f (straight lines, elastic walls), illustrative */
const molecules = (n: number, f: number, speed: number, seed = 1): Pt[] => Array.from({ length: n }, (_, i) => {
  const x0 = rnd(i + seed * 101), y0 = rnd(i * 3 + seed * 37), a = 2 * Math.PI * rnd(i * 7 + seed * 11), v = speed * (0.6 + 0.8 * rnd(i * 13 + seed));
  const tri = (u: number) => { const m = ((u % 2) + 2) % 2; return m < 1 ? m : 2 - m; };
  return [tri(x0 + Math.cos(a) * v * f), tri(y0 + Math.sin(a) * v * f)];
});
const MolBox: React.FC<{ x: number; y: number; s: number; n: number; f: number; speed: number; c?: string; seed?: number; o?: number; r?: number; wallHi?: number }> = ({
  x, y, s, n, f, speed, c = C.ink, seed = 1, o = 1, r = 7, wallHi = 0 }) => o <= 0 ? null : (
  <g opacity={o}>
    <rect x={x} y={y} width={s} height={s} fill="#1b2540" stroke={C.muted} strokeWidth={4} />
    {wallHi > 0 ? <line x1={x + s} y1={y} x2={x + s} y2={y + s} stroke={C.second} strokeWidth={8} opacity={wallHi} /> : null}
    {molecules(n, f, speed, seed).map((p, i) => <circle key={i} cx={x + r + p[0] * (s - 2 * r)} cy={y + r + p[1] * (s - 2 * r)} r={r} fill={c} />)}
  </g>
);
/** an isometric box (cube or room) with edge length a, b, c px along the three iso axes */
const isoPt = (o: Pt, x: number, y: number, z: number): Pt => [o[0] + (x - y) * 0.866, o[1] + (x + y) * 0.5 - z];
const IsoBox: React.FC<{ o: Pt; a: number; b: number; c: number; fill?: string; fo?: number; stroke?: string; w?: number; op?: number }> = ({ o, a, b, c, fill = "#7cc4ff", fo = 0, stroke = C.ink, w = 4, op = 1 }) => {
  const P = (x: number, y: number, z: number) => isoPt(o, x, y, z);
  const top = [P(0, 0, c), P(a, 0, c), P(a, b, c), P(0, b, c)], f1 = [P(a, 0, 0), P(a, b, 0), P(a, b, c), P(a, 0, c)], f2 = [P(0, b, 0), P(a, b, 0), P(a, b, c), P(0, b, c)];
  return (
    <g opacity={op}>
      {[top, f1, f2].map((q, i) => <path key={i} d={poly(q) + "Z"} fill={fill} fillOpacity={fo * (1 - 0.18 * i)} stroke={stroke} strokeWidth={w} strokeLinejoin="round" />)}
      <path d={poly([P(0, 0, 0), P(a, 0, 0)]) + poly([P(0, 0, 0), P(0, b, 0)]) + poly([P(0, 0, 0), P(0, 0, c)])} stroke={stroke} strokeOpacity={0.35} strokeWidth={w} strokeDasharray="10 8" fill="none" />
    </g>
  );
};
/** person outline (illustrative) */
const Person: React.FC<{ x: number; y: number; s?: number; o?: number; c?: string }> = ({ x, y, s = 1, o = 1, c = C.ink }) => (
  <g opacity={o} fill="none" stroke={c} strokeWidth={6} strokeLinecap="round">
    <circle cx={x} cy={y - 150 * s} r={26 * s} />
    <path d={`M${x} ${y - 122 * s} L${x} ${y - 40 * s} M${x - 50 * s} ${y - 100 * s} L${x} ${y - 90 * s} L${x + 50 * s} ${y - 100 * s} M${x} ${y - 40 * s} L${x - 34 * s} ${y + 30 * s} M${x} ${y - 40 * s} L${x + 34 * s} ${y + 30 * s}`} />
  </g>
);
/** barometer dial (illustrative instrument face; the needle value is given) */
const Barometer: React.FC<{ x: number; y: number; r: number; v: number; o?: number; label?: string; ticks?: boolean }> = ({ x, y, r, v, o = 1, label, ticks = true }) => {
  if (o <= 0) return null;
  const ang = (p: number) => (-135 + ((p - 950) / 100) * 270) * D2R;
  const tp = (p: number, rr: number): Pt => [x + Math.sin(ang(p)) * rr, y - Math.cos(ang(p)) * rr];
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={r} fill="#1d2740" stroke={C.ink} strokeWidth={6} />
      {[950, 975, 1000, 1025, 1050].map((p) => <line key={p} x1={tp(p, r * 0.8)[0]} y1={tp(p, r * 0.8)[1]} x2={tp(p, r * 0.94)[0]} y2={tp(p, r * 0.94)[1]} stroke={C.ink} strokeWidth={5} />)}
      {ticks ? [950, 1000, 1050].map((p) => <Lbl key={`l${p}`} x={tp(p, r * 0.56)[0]} y={tp(p, r * 0.56)[1]} t={String(p)} c={C.muted} s={52} a="middle" b={false} />) : null}
      <line x1={x} y1={y} x2={tp(v, r * 0.82)[0]} y2={tp(v, r * 0.82)[1]} stroke={C.second} strokeWidth={8} strokeLinecap="round" />
      <circle cx={x} cy={y} r={12} fill={C.second} />
      {label ? <Lbl x={x} y={y + r + 48} t={label} c={C.key} s={T.key} a="middle" /> : null}
    </g>
  );
};
/** a cloud puff (illustrative) */
const Cloud: React.FC<{ x: number; y: number; s?: number; o?: number; c?: string }> = ({ x, y, s = 1, o = 1, c = "#eef2f8" }) => (
  <g opacity={o} fill={c}>
    <ellipse cx={x} cy={y} rx={70 * s} ry={34 * s} /><circle cx={x - 30 * s} cy={y - 22 * s} r={30 * s} /><circle cx={x + 18 * s} cy={y - 34 * s} r={38 * s} />
    <rect x={x - 70 * s} y={y} width={140 * s} height={34 * s} />
  </g>
);
/** a hot-air balloon (illustrative) */
const HotBalloon: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g opacity={o}>
    <path d={`M${x} ${y + 70 * s} C ${x - 90 * s} ${y + 10 * s}, ${x - 80 * s} ${y - 110 * s}, ${x} ${y - 110 * s} C ${x + 80 * s} ${y - 110 * s}, ${x + 90 * s} ${y + 10 * s}, ${x} ${y + 70 * s} Z`}
      fill={C.second} stroke={C.ink} strokeWidth={4} />
    <rect x={x - 18 * s} y={y + 92 * s} width={36 * s} height={26 * s} fill="#a8743f" />
    <line x1={x - 14 * s} y1={y + 66 * s} x2={x - 14 * s} y2={y + 92 * s} stroke={C.ink} strokeWidth={3} /><line x1={x + 14 * s} y1={y + 66 * s} x2={x + 14 * s} y2={y + 92 * s} stroke={C.ink} strokeWidth={3} />
  </g>
);
/** UF1 U-WB-21: the balloon glyph that hangs ABOVE a trail's head (x, y): the trail ends 14 px below the instrument box
 * (16 × 12 px, warm-white fill, 2-px gold outline), the box hangs on a 10-px warm-white string under the white balloon */
const SondeGlyph: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => o <= 0 ? null : (
  <g opacity={o}>
    <circle cx={x} cy={y - (36 + 24) * s} r={24 * s} fill="#eef2f8" stroke={C.bg} strokeWidth={3} />
    <line x1={x} y1={y - 36 * s} x2={x} y2={y - 26 * s} stroke={C.key} strokeWidth={2} />
    <rect x={x - 8 * s} y={y - 26 * s} width={16 * s} height={12 * s} fill={C.second} stroke={C.bg} strokeWidth={2.5} /> {/* fix 1 (U-WB-21): orange box, not gold like the trail */}
  </g>
);
/** weather balloon with its radiosonde box */
const SondeBalloon: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g opacity={o}>
    <circle cx={x} cy={y - 40 * s} r={26 * s} fill="#eef2f8" stroke={C.bg} strokeWidth={3} />
    <line x1={x} y1={y - 14 * s} x2={x} y2={y + 22 * s} stroke={C.ink} strokeWidth={3} />
    <rect x={x - 9 * s} y={y + 22 * s} width={18 * s} height={14 * s} fill={C.second} stroke={C.bg} strokeWidth={2} />
  </g>
);
/** fix loop 1 (review S5): one colour per quantity through the whole movie — pressure teal (as the title readout),
 * temperature orange; gold only for pointers and links; argon gets its own violet in the s03 bar */
const PRES = C.first, TEMP = C.second, ARGON = "#8e6fd8";
/** fix loop 2 (review 2 cosmetic): ONE H/L style in every scene, the cartostyle map layers' (tools/maptools/cartostyle.py dark
 * medium: low #ff7a8a, high #7fb2ff, bold letter with the dark halo) so the drawn letters match s43/s45/s49/s59 */
const LOW_C = "#ff7a8a", HIGH_C = "#7fb2ff";
const PRAD = 380; // globe radius on screen at dist 3.8 in the picture zone (approx.)
void PRAD;

/** apparent radius (px) of the unit globe for a camera at `dist` Earth radii, fov 35°, canvas height h */
const silR = (dist: number, h: number) => (h / 2) * Math.tan(Math.asin(1 / dist)) / Math.tan(17.5 * D2R);
/** sounding values at height z (km) by linear interpolation (p by log-linear) */
const sndAt = (S: any, zkm: number) => ({
  T: interp(zkm, S.z_km, S.T_C), p: Math.exp(interp(zkm, S.z_km, (S.p_hPa as number[]).map(Math.log))),
});

// ================================================================ UF1 R1: the data-source line
const SRCS = UF.sources as Record<string, string[]>;
/** UF1 R1 (user, 2026-10-28): the source line of a real-data picture — muted #9aa6bd, 30 px (≥ 28), at the bottom of the
 * picture it credits (last line's centre y ≤ 848, never in the caption band 880-1040), fades with its picture, never
 * spoken. The text is the storyboard's source_line string (uf1.json, written by the builder) — verbatim. Long lines wrap
 * at " · " inside the picture's width (two or three lines stacked upwards). */
const srcLines = (t: string, w: number, x = 84): { s: number; lines: string[] } => {
  const W = (x: string, s: number) => textW(x, s) * 1.05;   // weight 500 is narrower than textW's semibold estimate
  for (const s of [30, 28]) {
    if (W(t, s) <= w) return { s, lines: [t] };
    // tokens: the " · " parts, and the words of any part wider than the line (glued back with spaces)
    const toks: { t: string; sep: string }[] = [];
    t.split(" · ").forEach((q, i) => { const sep0 = i ? " · " : "";
      if (W(q, s) <= Math.max(w, 1880 - x)) toks.push({ t: q, sep: sep0 }); else q.split(" ").forEach((wd, j) => toks.push({ t: wd, sep: j ? " " : sep0 })); });
    const lines: string[] = [];
    let cur = "";
    for (const q of toks) { const nxt = cur ? `${cur}${q.sep}${q.t}` : q.t; if (W(nxt, s) <= w || !cur) cur = nxt; else { lines.push(cur.trim()); cur = q.t; } }
    if (cur) lines.push(cur.trim());
    if (lines.length <= 2 || s === 28) return { s, lines };
  }
  return { s: 28, lines: [t] };
};
const SrcLine: React.FC<{ id: string; i?: number; o?: number; x?: number; w?: number; y?: number }> = ({ id, i = 0, o = 1, x = 84, w = 900, y = 848 }) => {
  const t = SRCS[id]?.[i];
  if (t === undefined) throw new Error(`no source line ${id}[${i}] in uf1.json`);
  if (o <= 0) return null;
  const { s, lines } = srcLines(t, w, x);
  return (
    <g opacity={o} data-src={`${id}:${i}`}>
      {/* UF1 fix 1 (review 1 S4): a dark backing band so the line reads on imagery (maps, satellite pictures, globes) */}
      {lines.map((ln, k) => { const yy = y - (lines.length - 1 - k) * s * 1.18, ww = textW(ln, s) * 1.02;
        return <rect key={`b${k}`} x={x - 10} y={yy - s * 0.66} width={ww + 20} height={s * 1.32} rx={6} fill={C.bg} opacity={0.72} />; })}
      {lines.map((ln, k) => <text key={k} x={x} y={y - (lines.length - 1 - k) * s * 1.18} fill={C.muted} fontSize={s} fontFamily={FONT} fontWeight={500}
        dominantBaseline="central" stroke={C.bg} strokeWidth={0.2 * s} strokeLinejoin="round" paintOrder="stroke">{ln}</text>)}
    </g>
  );
};
/** a source line in its own full-frame SVG layer (on top of WebGL views and HTML maps) */
const Src: React.FC<{ id: string; i?: number; o?: number; x?: number; w?: number; y?: number }> = (p) => (p.o ?? 1) <= 0 ? null : <Svg><SrcLine {...p} /></Svg>;

// ================================================================ UF1 R3: the 3-D air column (s05, s13-s15, s18, s18b, s20c, s22)
/** the column world: base [0,1]×[0,1] (one square metre), height in units (km × zk); camera orbit; returns the stage
 * pieces (View3D children are given by the caller) and a projector for the SVG labels */
const COLVB = { x: 80, y: 40, w: 920, h: 820 };
const colStage = (o: { az: number; el: number; dist: number; target: V3 }): { st: CamState; pr: Projector } => {
  const st = orbitCam(o, [COLVB.w / 2, COLVB.h / 2]);
  return { st, pr: projector(st, COLVB.w, COLVB.h, COLVB.x, COLVB.y) };
};
/** ussa-like density fade of the column faces with height (km): exp(−z/8.43), floored */
const rhoFade = (zkm: number) => Math.max(0.03, Math.exp(-zkm / 8.43));
/** the base plate (1 m × 1 m) with its two "1 m" edge labels */
const BaseLabels: React.FC<{ pr: Projector; o?: number; area?: boolean }> = ({ pr, o = 1, area = true }) => {
  if (o <= 0) return null;
  const a = pr.p([0.5, -0.12, 0]), b = pr.p([1.14, 0.5, 0]), c = pr.p([0.5, 0.5, 0]);
  return (
    <g opacity={o}>
      <Lbl x={a[0]} y={a[1] + 30} t="1 m" c={C.gold} s={T.key} a="middle" />
      <Lbl x={b[0] + 20} y={b[1] + 18} t="1 m" c={C.gold} s={T.key} a="start" />
      {area ? <Lbl x={c[0]} y={Math.max(a[1], b[1]) + 92} t="area 1 m²" c={C.key} s={T.key} a="middle" /> : null}
    </g>
  );
};
/** a height axis beside the column: teal rod in 3-D is drawn by the caller; ticks + labels here (52 px) */
const HeightTicks: React.FC<{ pr: Projector; zk: number; ticks: number[]; x?: number; y?: number; o?: number; unit?: string }> = ({ pr, zk, ticks, x = -0.35, y = 0, o = 1, unit = "km" }) => o <= 0 ? null : (
  <g opacity={o}>
    {ticks.map((v) => { const q = pr.p([x, y, v * zk]); return <g key={v}><line x1={q[0] - 10} x2={q[0] + 10} y1={q[1]} y2={q[1]} stroke={C.first} strokeWidth={4} />
      <Lbl x={q[0] - 18} y={q[1]} t={v === ticks[ticks.length - 1] ? `${unit} ${v}` : `${v}`} c={C.muted} s={52} a="end" b={false} /></g>; })}
  </g>
);

// ================================================================ s00 title
const S00: React.FC = () => {
  const f = useCurrentFrame(), k = K("s00_title");
  // UF1 U-WB-02: "…and how meteorologists / read the weather"; Part B cross-fades on "meteorologists"
  const tMet = AT(k, 0, "meteorologists"), tEasy = AT(k, 0, "the easy way");
  const BXA = { x: 1250, y: 90, w: 590, h: 430 }; // >= 50 px clear of the subtitle (data_needs §F)
  const oA = fin(f, 4, 10) * fout(f, tMet, 12), oB = fin(f, tMet, 12);
  // Part A: the balloon rises through the real Trappes sounding (00 UTC 1 Nov 2023) on the globe, air shell ×50
  const zTop = 12, u = easeIO(clamp((f - 10) / (tMet - 20), 0, 1)), z = Math.max(SD.trappes.z_km[0], zTop * u);
  const v = sndAt(SD.trappes, z);
  // Part B: the 1 Nov afternoon true colour with the hourly ERA5 isobars 12 UTC 1 Nov → 03 UTC 2 Nov and the Brest readout
  const hB = clamp((f - tMet - 6) / (5 * FPS), 0, 1) * 15, hi = Math.min(15, Math.floor(hB));
  const brest = interp(hB, TI.partB.brest_hPa.map((_: number, i: number) => i), TI.partB.brest_hPa);
  const MB: MapBox = { lat0: 41, lat1: 59, lon0: -26, lon1: 10, x: BXA.x, y: BXA.y, w: BXA.w, h: BXA.h };
  const P = mapP(MB);
  const pz = 1 + 0.06 * pulse(f, tEasy, 12);
  const top = 1 + (z / 6371) * 50;
  return (
    <Scene fadeIn={false}>
      <Globe cam={{ lat: 30, lon: 10, dist: 3.9 }} box={BXA} shell={SHELL50} o={oA} coast={0.35}
        over={(G) => {
          const a = G.p(TRAPPES[0], TRAPPES[1], 1.001), b = G.p(TRAPPES[0], TRAPPES[1], top);
          return <g><line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.gold} strokeWidth={4} /><SondeBalloon x={b[0]} y={b[1]} s={0.9} /></g>;
        }} />
      <Svg>
        <defs><TitleGradient id="ttl" x1={100} x2={760} /><clipPath id="s00m"><rect x={BXA.x} y={BXA.y} width={BXA.w} height={BXA.h} /></clipPath></defs>
        <RiseText f={f} t="Weather" x={100} y={250} s={150} at={2} fill="url(#ttl)" />
        <RiseText f={f} t="basics" x={100} y={410} s={150} at={12} fill="url(#ttl)" />
        <g transform={`translate(104 530) scale(${pz}) translate(-104 -530)`}>
          <RiseText f={f} t="made easy" x={104} y={550} s={96} at={20} fill={C.key} />
        </g>
        <RiseText f={f} t="and how meteorologists" x={106} y={660} s={68} at={38} fill={C.key} colors={(i) => (i >= 8 ? C.first : undefined)} />
        <RiseText f={f} t="read the weather" x={106} y={744} s={68} at={52} fill={C.key} />
        {/* fix loop 1 (S1): Part A's readout is fully gone (6 frames) before Part B's fades in, so the two never overlap */}
        <g opacity={fin(f, 4, 10) * fout(f, tMet - 8, 6)}>
          {/* floor size + wider slots: at T.key "12.0 km" ran into "−60 °C" (stage-2 frame check); x 1260 keeps the
              readout ≥ 50 px clear of the subtitle (ends ≈ 1198) and the widest "1003 hPa" inside x 1840 */}
          <Lbl x={1260} y={620} t={`${fmt(z, 1)} km`} c={C.key} s={T.floor} />
          <Lbl x={1475} y={620} t={`${fmt(v.T, 0)} °C`} c={C.second} s={T.floor} />
          <Lbl x={1645} y={620} t={`${fmt(v.p, 0)} hPa`} c={C.first} s={T.floor} />
        </g>
        <g opacity={oB} clipPath="url(#s00m)">
          <GeoImage P={P} href={IMG.tc1101} box={BOX_TC1101} />
          <path d={linesPath(P, LN.ciaran_coast_10m)} fill="none" stroke={C.key} strokeOpacity={0.55} strokeWidth={1.5} />
          <IsoPaths P={P} levels={HR.isobars[hi].levels} o={0.9} w={2.5} />
          <Place p={P(BREST[0], BREST[1])} />
        </g>
        <g opacity={oB}>
          <rect x={BXA.x} y={BXA.y} width={BXA.w} height={BXA.h} fill="none" stroke={C.grid} strokeWidth={3} />
        </g>
        <g opacity={fin(f, tMet, 10)}>
          <Lbl x={1360} y={620} t="Brest" c={C.key} s={T.key} />
          <Lbl x={1520} y={620} t={`${fmt(brest, 0)} hPa`} c={C.first} s={T.key} />
          <ClockGlyph x={1790} y={620} r={28} h={(12 + hB) % 12} />
        </g>
        {/* UF1 R1: the two source lines under the right column, each with its picture */}
        <SrcLine id="s00_title" i={0} o={oA} x={1250} w={500} y={848} />
        <SrcLine id="s00_title" i={1} o={oB} x={1250} w={500} y={848} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s01 hook: the real Earth on 2 Nov 2023
const S01: React.FC = () => {
  const f = useCurrentFrame(), k = K("s01_hook");
  // UF1 U-WB-03, R4: turn, zoom, change direction; end = s02's first camera
  const tRing = AT(k, 1, "real storm");
  // UF1 fix 1 (review 1 M4, U-WB-03): the spin visibly reverses — the Earth turns east (lon of view falls 40°) up to "pressure",
  // then back west (view lon rises 55°) to "wind", then the zoom to Ciarán (dist 2.9: the whole disc stays in the full-frame canvas)
  const cam = globePath([{ f: 0, lat: 44, lon: 0, dist: 3.8 }, { f: AT(k, 1, "pressure"), lat: 38, lon: -40, dist: 3.4 }, { f: AT(k, 1, "wind"), lat: 48, lon: 15, dist: 3.2 },
    { f: tRing, lat: 53, lon: -2, dist: 2.9 }, { f: LEN(k), lat: 35, lon: -15, dist: 3.8 }], f);
  const words = ["pressure", "temperature", "humidity", "wind"];
  return (
    <Scene>
      <Globe cam={cam} over={(G) => {
        const c = G.p(52.58, 1.56), r = 70;
        const o = fin(f, tRing);
        return o > 0 ? <g opacity={o}><circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={C.gold} strokeWidth={5} />
          <Lbl x={c[0] - 40} y={c[1] - r - 40} t="Storm Ciarán" c={C.key} s={T.key} a="end" /></g> : null;
      }} />
      <Svg>
        <Lbl x={1440} y={150} t="?" c={C.gold} s={T.hero} a="middle" o={fin(f, SS(k, 0)) * (1 + 0.0 * pulse(f, SS(k, 0)))} />
        {words.map((w, i) => {
          const a = AT(k, 1, w), y = 300 + i * 130;
          return (
            <g key={w} opacity={fin(f, a)}>
              {i === 0 ? <Barometer x={1180} y={y} r={44} v={1013} ticks={false} /> : null}
              {i === 1 ? <g><rect x={1170} y={y - 50} width={20} height={80} rx={10} fill="none" stroke={C.ink} strokeWidth={4} /><circle cx={1180} cy={y + 36} r={18} fill={C.second} /><rect x={1176} y={y - 10} width={8} height={40} fill={C.second} /></g> : null}
              {i === 2 ? <Droplet x={1180} y={y + 10} s={1.1} /> : null}
              {i === 3 ? <Arrow p={[1140, y + 20]} q={[1225, y - 20]} color={C.first} w={9} head={30} /> : null}
              <Lbl x={1260} y={y} t={w} c={C.key} s={T.key} />
            </g>
          );
        })}
        <SrcLine id="s01_hook" />
      </Svg>
    </Scene>
  );
};

/// ================================================================ s02 thin shell: true scale, then × 50 (UF1: radius rod, desk-globe shrink)
const EQ_S02 = String.raw`\dfrac{12\ \text{km}}{6371\ \text{km}} \approx 0.002`;
/** a code-drawn desk globe on a gold stand (icon), radius r px; `rim` = the sky-blue air rim (0..1), `rad` = gold radius line */
const DeskGlobe: React.FC<{ x: number; y: number; r: number; o?: number; rim?: number; rad?: number }> = ({ x, y, r, o = 1, rim = 0, rad = 0 }) => o <= 0 ? null : (
  <g opacity={o}>
    <defs><radialGradient id="dgl" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stopColor="#4f8fd0" /><stop offset="1" stopColor="#1d3f6e" /></radialGradient></defs>
    <path d={`M${x - r * 0.55} ${y + r * 1.42} L${x + r * 0.55} ${y + r * 1.42} L${x + r * 0.2} ${y + r * 1.18} L${x - r * 0.2} ${y + r * 1.18} Z`} fill={C.gold} />
    <line x1={x} y1={y + r * 1.18} x2={x} y2={y + r * 1.0} stroke={C.gold} strokeWidth={8} />
    <path d={`M${x - r * 1.12} ${y} A ${r * 1.12} ${r * 1.12} 0 0 0 ${x} ${y + r * 1.12}`} fill="none" stroke={C.gold} strokeWidth={6} />
    <circle cx={x} cy={y} r={r} fill="url(#dgl)" />
    <path d={`M${x - r * 0.5} ${y - r * 0.55} q ${r * 0.3} ${-r * 0.2} ${r * 0.55} ${r * 0.05} q ${r * 0.1} ${r * 0.35} ${-r * 0.2} ${r * 0.5} q ${-r * 0.35} ${-r * 0.1} ${-r * 0.35} ${-r * 0.55} Z`} fill="#5f9c5a" opacity={0.85} />
    <path d={`M${x + r * 0.15} ${y + r * 0.1} q ${r * 0.35} ${-r * 0.1} ${r * 0.45} ${r * 0.25} q ${-r * 0.05} ${r * 0.35} ${-r * 0.3} ${r * 0.35} Z`} fill="#5f9c5a" opacity={0.85} />
    {rim > 0 ? <circle cx={x} cy={y} r={r + 3} fill="none" stroke="#7cc4ff" strokeWidth={4} opacity={rim} /> : null}
    {rad > 0 ? <g opacity={rad}><line x1={x} y1={y} x2={x + r} y2={y} stroke={C.gold} strokeWidth={6} /><circle cx={x} cy={y} r={6} fill={C.gold} /></g> : null}
  </g>
);
const S02: React.FC = () => {
  const f = useCurrentFrame(), k = K("s02_thin_shell");
  const t12 = AT(k, 3, "twelve kilometres"), tR = AT(k, 3, "the Earth's radius"), tCS = AT(k, 3, "from its centre to its surface");
  const tGl = AT(k, 5, "desk globe"), t150 = AT(k, 5, "one hundred and fifty millimetres");
  const tFr = SS(k, 6), tSh = SS(k, 7), tPa = SS(k, 8), t50 = AT(k, 9, "fifty times thicker");
  const grow = easeIO(clamp((f - t50) / 45, 0, 1));
  const h = mix(12 / 6371, SHELL50, grow);
  // UF1 R4 camera: continuity from s01, eastward turn, zoom for the hair-line shell on S3, the cut face on S4, back for S6-S10
  const cam = globePath([{ f: 0, lat: 35, lon: -15, dist: 3.8 }, { f: SS(k, 2), lat: 25, lon: 0, dist: 3.8 }, { f: SS(k, 2) + 50, lat: 25, lon: 0, dist: 3.0 },
    { f: tR - 16, lat: 25, lon: 0, dist: 3.0 }, { f: tR + 4, lat: 10, lon: -40, dist: 3.5 }, { f: SE(k, 3) + 20, lat: 10, lon: -40, dist: 3.5 },
    { f: SS(k, 5), lat: 25, lon: -15, dist: 3.8 }, { f: LEN(k), lat: 30, lon: -5, dist: 3.8 }], f);
  // U-WB-04: the quarter wedge (lon −45 … +45) slides out on "the Earth's radius" and closes at the end of S4
  const slide = easeIO(clamp((f - tR + 6) / 24, 0, 1)) * (1 - easeIO(clamp((f - SE(k, 3) - 4) / 24, 0, 1)));
  const rodO = clamp((slide - 0.6) / 0.4, 0, 1);
  const pulseT = clamp((f - tCS) / 45, 0, 1);
  // the hair-line shell zoom circle (×50) on the upper-right limb during S3 to the radius
  const R = silR(cam.dist, GBOX.h), cx = GBOX.x + GBOX.w / 2, cy = GBOX.y + GBOX.h / 2;
  const zO = win(f, SS(k, 2) + 40, tR - 14);
  const lp: Pt = [cx + R * 0.707, cy - R * 0.707], ic: Pt = [cx + 250, cy - 250], ir = 120;
  const band = Math.max(3, (12 / 6371) * R * 50); // UF1 fix 1 (S6): the magnifier enlarges ×50, the number the narration says
  const rows: CalcRow[] = [
    { rhs: EQ_S02, at: tFr },
    { rhs: String.raw`0.002 \times 150\ \text{mm} \approx 0.3\ \text{mm}`, at: tSh, ul: AT(k, 7, "three tenths") },
  ];
  const ox = 1190, oy = 300, orr = 105;
  return (
    <Scene>
      <Globe cam={cam} shell={h} shellO={0.55} coast={0.45 * (1 - clamp(slide * 4, 0, 1))} wedge={{ lon0: -45, slide }}
        under3d={rodO > 0 ? <>
          <Rod3D a={[0, 0, 0]} b={ll(0, 45, 1.0)} px={10} color={C.second} o={rodO} />
          <Ball3D at={[0, 0, 0]} px={18} color={C.second} o={rodO} />
          <Ball3D at={ll(0, 45, 1.0)} px={18} color={C.second} o={rodO} />
          {pulseT > 0 && pulseT < 1 ? <Ball3D at={ll(0, 45, pulseT)} px={28} color={C.gold} o={rodO} /> : null}
        </> : null}
        over={(G) => {
          const m = G.pw(ll(0, 45, 0.5));
          return rodO > 0 ? <Lbl x={m[0]} y={m[1] - 50} t="6371 km" c={C.second} s={T.key} a="middle" o={rodO} /> : null;
        }} />
      <Svg>
        {/* the ×50 zoom circle on the hair-line shell (true scale) */}
        <g opacity={zO}>
          <circle cx={lp[0]} cy={lp[1]} r={26} fill="none" stroke={C.gold} strokeWidth={4} />
          <line x1={lp[0] + 18} y1={lp[1] - 18} x2={ic[0] - ir * 0.7} y2={ic[1] + ir * 0.7} stroke={C.gold} strokeWidth={4} />
          <defs><clipPath id="s02z"><circle cx={ic[0]} cy={ic[1]} r={ir} /></clipPath></defs>
          <circle cx={ic[0]} cy={ic[1]} r={ir} fill={C.bg} />
          <g clipPath="url(#s02z)">
            <rect x={ic[0] - ir} y={ic[1] + 20} width={2 * ir} height={ir} fill="#2c5f8f" />
            <rect x={ic[0] - ir} y={ic[1] + 20 - band} width={2 * ir} height={band} fill="#7cc4ff" opacity={0.8} />
          </g>
          <circle cx={ic[0]} cy={ic[1]} r={ir} fill="none" stroke={C.gold} strokeWidth={4} />
          <Lbl x={ic[0]} y={ic[1] - 55} t="× 50" c={C.gold} s={T.floor} a="middle" />
        </g>
        <Keyword f={f} text="× 50" at={[1110, 842]} appear={t50} s={T.key} />
        {/* fix loop 1 (M2): the maths zone carries the words from S1 on, until the shrink takes the zone */}
        <Keyword f={f} text="atmosphere" at={[1100, 150]} appear={AT(k, 1, "atmosphere")} out={tGl - 12} s={T.calc} />
        <g opacity={win(f, AT(k, 1, "gravity"), tGl - 12)}>
          <Arrow p={[1130, 220]} q={[1130, 330]} color={C.ink} w={8} head={28} />
          <Lbl x={1180} y={280} t="held down by gravity" c={C.key} s={T.key} />
        </g>
        <Lbl x={1100} y={410} t="much thinner than pictures" c={C.key} s={T.key} o={win(f, SS(k, 2), tGl - 12)} />
        <Lbl x={1100} y={510} t="weather layer: 12 km" c={C.first} s={T.key} o={win(f, t12, tGl - 12)} />
        <Lbl x={1100} y={600} t="Earth's radius: 6371 km" c={C.second} s={T.key} o={win(f, tR, tGl - 12)} />
        {/* U-WB-05: the desk globe, each factor on its words */}
        <DeskGlobe x={ox} y={oy} r={orr} o={fin(f, tGl)} rim={fin(f, tPa)} rad={fin(f, t150)} />
        <Lbl x={ox + 150} y={oy - 70} t="30 cm across" c={C.key} s={T.key} o={fin(f, tGl)} />
        <Lbl x={ox + 150} y={oy + 10} t="radius 150 mm" c={C.gold} s={T.calc} o={fin(f, t150)} />
        <Keyword f={f} text="fraction of the radius" at={[1100, 500]} appear={tFr} out={tSh - 6} s={T.key} />
        <Keyword f={f} text="same shrink" at={[1100, 500]} appear={tSh} out={tPa} s={T.key} />
        <g opacity={fin(f, tPa)}>
          {[0, 1, 2].map((i) => <rect key={i} x={1600 + i * 14} y={390 + i * 12} width={190} height={100} fill="#eef2f8" stroke={C.muted} strokeWidth={2} opacity={0.9} />)}
          <Lbl x={1830} y={540} t="3 sheets of paper" c={C.key} s={T.key} a="end" />
        </g>
        <Keyword f={f} text="weather layer" at={[1560, 610]} appear={tFr + 10} out={tSh - 6} s={T.floor} targets={[[1265, 640]]} />
        <Keyword f={f} text="Earth's radius" at={[1560, 730]} appear={tFr + 30} out={tSh - 6} s={T.floor} targets={[[1265, 712]]} />
        <CurvedLink f={f} from={[1500, 340]} to={[1600, 690]} start={tSh + 8} end={tPa + 30} bend={90} />
      </Svg>
      <CalcStack f={f} x={1110} y={590} rows={tall(rows, 58)} maxLines={2} size={58} />
      <Src id="s02_thin_shell" />
    </Scene>
  );
};

// ================================================================ s03 air: composition, molecules, then a 3-D air parcel on the real wind over Brittany
/** UF1 U-WB-06: Brittany in 3-D (ETOPO 2022 60″ relief ×5 under the cloud-free Blue Marble NG crop), world unit = 10 km,
 * x east, y north, z up; the parcel rides the builder's advect_on_sphere path on the ERA5 10-m wind of 1 Nov 2023 12 UTC.
 * Tool: three.js Terrain (kit_wb) in Remotion — chosen over a CesiumJS frame pass so the box, trail, arrows and labels are
 * all functions of the frame in one renderer (the storyboard's Cesium shot is the runner-up). */
const S3 = UF.s03, BR_LAT0 = 48.0, BR_LON0 = -3.75, BRX = Math.cos(48 * D2R) * 11.132, BRY = 11.132;
const brx = (lon: number) => (lon - BR_LON0) * BRX, bry = (lat: number) => (lat - BR_LAT0) * BRY;
const BR_ZS = 5 / 1e4; // metres → world units, heights ×5 (said: "drawn far bigger than life")
const S03: React.FC = () => {
  const f = useCurrentFrame(), k = K("s03_air_parcel");
  const tN = AT(k, 1, "seventy-eight"), tO = AT(k, 1, "twenty-one"), tAr = AT(k, 1, "argon"), tCO = AT(k, 2, "Carbon dioxide"), tW = AT(k, 2, "water vapour");
  const tMol = SS(k, 3), tPar = AT(k, 5, "An air parcel"), tOne = AT(k, 6, "Here's one"), tTh = AT(k, 7, "its own temperature"), tWv = AT(k, 7, "water vapour");
  // globe: drift to Europe (S1-S4), fly down to Brittany (S5-S6), tilt; 20-frame cross-fade into the 3-D landscape on "Here's one"
  const cam = globePath([{ f: 0, lat: 25, lon: -15, dist: 3.8 }, { f: SS(k, 4), lat: 45, lon: 0, dist: 3.8 },
    { f: tOne - 4, lat: 48.2, lon: -3.8, dist: 1.6 }, { f: tOne + 24, lat: 48.0, lon: -3.8, dist: 1.5, tilt: 40 }], f);
  const xf = clamp((f - tOne) / 20, 0, 1);
  const X0 = 1080, W = 760, y = 120, comp = BA.composition_percent;
  const segs = [{ n: "nitrogen", v: comp.N2, c: "#5b6fd8", t: tN }, { n: "oxygen", v: comp.O2, c: C.first, t: tO }, { n: "argon", v: comp.Ar, c: ARGON, t: tAr }];
  let acc = 0;
  const molO = win(f, tMol, SS(k, 4) + 20);
  const mz = fout(f, tOne, 14); // the maths-zone items give the frame to the landscape on S7
  // ---- the 3-D landscape
  const ev = useVars(staticFile("wb_brittany_etopo.bin"), BRJ);
  const btex = useTex(IMG.brittany);
  const n = (S3.path_lat as number[]).length;
  const tEnd = SE(k, 7) - 10;
  const u = clamp((f - tOne) / (tEnd - tOne), 0, 1), fi = u * (n - 1), i0 = Math.min(n - 2, Math.floor(fi)), wI = fi - i0;
  const plat = S3.path_lat[i0] + (S3.path_lat[i0 + 1] - S3.path_lat[i0]) * wI, plon = S3.path_lon[i0] + (S3.path_lon[i0 + 1] - S3.path_lon[i0]) * wI;
  const PZ0 = 1500 * BR_ZS, PH = 2400 * BR_ZS, PW = 0.6; // box floats 1.5 km up (×5), 8 km × 8 km × 1.6 km (×5)
  const pc: V3 = [brx(plon), bry(plat), PZ0 + PH / 2];
  const rise = clamp((f - (tEnd - 50)) / 60, 0, 1);
  // UF1 fix 1 (review 1 S2): full-frame canvas (same pixel scale as the old 1760×820 box, fades over y 850-900), camera
  // higher (el 50) and held on the middle of the path so the box visibly travels across the frame and no tile edge shows
  const VB = { x: 0, y: 0, w: 1920, h: 1080 };
  const fovT = (2 * Math.atan(Math.tan(17.5 * D2R) * 1080 / 820)) / D2R;
  const mid: V3 = [brx(-3.3), bry((S3.path_lat[0] + S3.path_lat[n - 1]) / 2), 0.4];
  const ost = orbitCam({ az: mix(-108, -98, u), el: mix(64, 61, u) + 3 * easeIO(rise), dist: mix(24, 23, easeIO(u)) + 1.5 * easeIO(rise), target: mid, fov: fovT },
    [960, 490]);
  const pr = projector(ost, VB.w, VB.h, VB.x, VB.y);
  const places: { t: string; la: number; lo: number; s: number; c: string }[] = [
    { t: "Brest", la: 48.39, lo: -4.49, s: T.floor, c: C.key }, { t: "Brittany", la: 48.05, lo: -2.35, s: T.key, c: C.key },
    { t: "English Channel", la: 49.0, lo: -3.6, s: T.floor, c: "#cfe3ff" }];
  const hr = (S3.dt_s * fi) / 3600, h0 = Math.min(S3.arrows.u.length - 2, Math.floor(hr)), wh = hr - h0;
  const AR = S3.arrows;
  const trailN = 14, trail: Pt[] = [];
  for (let q = Math.max(0, Math.floor(fi) - trailN); q <= Math.floor(fi); q++) trail.push(pr.p([brx(S3.path_lon[q]), bry(S3.path_lat[q]), PZ0 + PH / 2]));
  trail.push(pr.p(pc));
  const top = pr.p([pc[0], pc[1], PZ0 + PH + 0.05]);
  return (
    <Scene>
      <Globe cam={cam} shell={SHELL50} o={1 - xf} over={(G) => {
        const o = fin(f, tPar) * fout(f, tOne - 30, 20);
        if (o <= 0) return null;
        const c = G.p(48.2, -3.8, 1.01);
        return <g opacity={o}><ellipse cx={c[0]} cy={c[1]} rx={60} ry={44} fill={C.first} fillOpacity={0.3} stroke={C.first} strokeWidth={5} strokeDasharray="10 7" /></g>;
      }} />
      {xf > 0 && ev && btex ? <View3D st={ost} x={VB.x} y={VB.y} w={VB.w} h={VB.h} o={xf} amb={1.4} dir={1.2}
        style={{ WebkitMaskImage: "linear-gradient(to bottom, black 0px, black 850px, transparent 900px)", maskImage: "linear-gradient(to bottom, black 0px, black 850px, transparent 900px)" }}>
        <Terrain H={ev.z} ny={BRJ.coords ? 180 : 180} nx={330} x0={brx(BRJ.coords.lon0)} x1={brx(BRJ.coords.lon1)} y0={bry(BRJ.coords.lat0)} y1={bry(BRJ.coords.lat1)} zs={BR_ZS} tex={btex} />
        <Box3D a={[pc[0] - PW, pc[1] - PW, PZ0]} b={[pc[0] + PW, pc[1] + PW, PZ0 + PH]} color={C.first} o={0.35} />
        <BoxEdges3D a={[pc[0] - PW, pc[1] - PW, PZ0]} b={[pc[0] + PW, pc[1] + PW, PZ0 + PH]} color={C.first} px={3} />
      </View3D> : null}
      <Svg>
        <defs><clipPath id="s03v"><rect x={0} y={0} width={1920} height={860} /></clipPath>
          <linearGradient id="s03ft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.bg} stopOpacity={1} /><stop offset="1" stopColor={C.bg} stopOpacity={0} /></linearGradient>
          <linearGradient id="s03fr" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor={C.bg} stopOpacity={1} /><stop offset="1" stopColor={C.bg} stopOpacity={0} /></linearGradient></defs>
        {/* fix 1 (S2): soft top and right edges so the relief tile's border never shows as a line */}
        <rect x={0} y={0} width={1920} height={150} fill="url(#s03ft)" opacity={xf} /><rect x={1700} y={0} width={220} height={900} fill="url(#s03fr)" opacity={xf} /><rect x={0} y={0} width={200} height={900} fill="url(#s03fr)" opacity={xf} transform="translate(200 0) scale(-1 1)" />
        <g opacity={xf} clipPath="url(#s03v)">
          {(AR.lat as number[]).map((la, j) => (AR.lon as number[]).map((lo, q) => {
            const uu = AR.u[h0][j][q] * (1 - wh) + AR.u[h0 + 1][j][q] * wh, vv = AR.v[h0][j][q] * (1 - wh) + AR.v[h0 + 1][j][q] * wh;
            if (!Number.isFinite(uu) || !Number.isFinite(vv)) return null;
            if (!pr.vis([brx(lo), bry(la), 0.12])) return null;
            const a = pr.p([brx(lo), bry(la), 0.12]), b = pr.p([brx(lo) + uu * 0.07, bry(la) + vv * 0.07, 0.12]);
            return <Arrow key={`${j}_${q}`} p={a} q={b} color={C.first} w={4} head={16} o={0.8} />;
          }))}
          <path d={poly(trail)} fill="none" stroke={C.first} strokeWidth={5} strokeOpacity={0.75} strokeLinecap="round" />
          {places.map((q) => { const w3: V3 = [brx(q.lo), bry(q.la), 0.15]; if (!pr.vis(w3)) return null; const a = pr.p(w3);
            return <g key={q.t}>{q.t === "Brest" ? <circle cx={a[0]} cy={a[1]} r={8} fill={C.gold} stroke={C.bg} strokeWidth={3} /> : null}
              <Lbl x={a[0] + (q.t === "Brest" ? -16 : 0)} y={a[1] + (q.t === "Brest" ? -30 : 0)} t={q.t} c={q.c} s={q.s} a={q.t === "Brest" ? "end" : "middle"} /></g>; })}
        </g>
        <g opacity={xf}>
          <Lbl x={top[0]} y={top[1] - 46} t="air parcel" c={C.key} s={T.key} a="middle" />
          <g opacity={fin(f, tTh)}>
            <rect x={top[0] - 66} y={top[1] - 150} width={16} height={56} rx={8} fill="none" stroke={C.ink} strokeWidth={4} />
            <circle cx={top[0] - 58} cy={top[1] - 88} r={13} fill={C.second} /><rect x={top[0] - 61} y={top[1] - 126} width={6} height={32} fill={C.second} />
          </g>
          <Droplet x={top[0] + 50} y={top[1] - 110} s={0.8} o={fin(f, tWv)} />
          <Keyword f={f} text="moves with the wind" at={[1420, 110]} appear={AT(k, 7, "Wherever")} s={T.floor} />
        </g>
      </Svg>
      <Svg o={mz}>
        {segs.map((s) => { const x = X0 + (acc / 100) * W, w = (s.v / 100) * W; acc += s.v; return (
          <g key={s.n} opacity={fin(f, s.t)}>
            <rect x={x} y={y} width={Math.max(w, 4)} height={70} fill={s.c} />
          </g>); })}
        {/* fix loop 1 (M2 3-10 s, r5 scan): the bar's frame is there on "a mixture of gases"; its parts fill on their words */}
        <rect x={X0} y={y} width={W} height={70} fill="none" stroke={C.muted} strokeWidth={3} opacity={fin(f, AT(k, 0, "mixture"))} />
        <g opacity={fin(f, tN)}><Lbl x={X0} y={y + 110} t="nitrogen 78 %" c={C.key} s={T.key} /></g>
        <g opacity={fin(f, tO)}><Lbl x={X0} y={y + 180} t="oxygen 21 %" c={C.first} s={T.key} /></g>
        <g opacity={fin(f, tAr)}><Lbl x={X0 + 420} y={y + 180} t="argon 0.9 %" c={ARGON} s={T.key} /></g>
        <g opacity={fin(f, tCO) * fout(f, tMol)}><Lbl x={X0} y={y + 250} t="carbon dioxide 0.04 %" c={C.key} s={T.key} /></g>
        <g opacity={fin(f, tW) * fout(f, tMol)}><rect x={X0} y={y + 300} width={60 + 40 * Math.sin(f / 12) ** 2} height={40} fill="none" stroke="#7cc4ff" strokeWidth={4} strokeDasharray="10 8" />
          <Lbl x={X0 + 130} y={y + 320} t="water vapour 0–4 %" c="#7cc4ff" s={T.key} /></g>
        <MolBox x={1200} y={340} s={440} n={70} f={f - tMol} speed={0.012} o={molO} />
        <Lbl x={1420} y={830} t="hundreds of m/s" c={C.key} s={T.key} a="middle" o={molO} />
        {void PRES}{void TEMP}
        <Keyword f={f} text="air parcel" at={[1200, 560]} appear={tPar} s={T.calc} />
        <Lbl x={1200} y={650} t="moves with the flow" c={C.key} s={T.key} o={fin(f, AT(k, 5, "moves with the flow"))} />
      </Svg>
      <Src id="s03_air_parcel" i={0} o={1 - xf} />
      <Src id="s03_air_parcel" i={1} o={xf} w={1700} />
    </Scene>
  );
};

// ================================================================ s04 pressure: hits on a wall → force per area
const S04: React.FC = () => {
  const f = useCurrentFrame(), k = K("s04_pressure_what");
  const tHit = SS(k, 1), tSteady = AT(k, 2, "steady force"), tEq = AT(k, 3, "force divided"), tAll = SS(k, 4), tPa = SS(k, 5);
  const boxO = fout(f, tAll);
  const ticks = Array.from({ length: 30 }, (_, i) => ({ y: 160 + rnd(i * 5) * 480, t: tHit + i * 6 }));
  const arrowO = fin(f, tSteady);
  const cube: Pt = [520, 470];
  const dirs: [Pt, Pt][] = [[[0, -1], [0, -200]], [[0, 1], [0, 200]], [[-1, 0], [-210, 0]], [[1, 0], [210, 0]], [[-0.7, 0.45], [-170, 110]], [[0.7, -0.45], [170, -110]]];
  return (
    <Scene>
      <Svg>
        <g opacity={boxO}>
          <MolBox x={160} y={160} s={480} n={60} f={f} speed={0.012} wallHi={fin(f, tHit)} />
          {ticks.map((t, i) => f >= t.t && f < t.t + 14 ? <line key={i} x1={640} y1={t.y} x2={672} y2={t.y} stroke={C.second} strokeWidth={6} opacity={1 - (f - t.t) / 14} /> : null)}
          <Arrow p={[860, 400]} q={[660, 400]} color={C.second} o={arrowO} />
          <rect x={644} y={300} width={20} height={200} fill="none" stroke={C.gold} strokeWidth={4} opacity={fin(f, tEq)} />
          <Lbl x={760} y={540} t="area" c={C.gold} s={T.key} o={fin(f, tEq)} />
          <Lbl x={760} y={340} t="force" c={C.second} s={T.key} o={arrowO} />
        </g>
        <g opacity={fin(f, tAll)}>
          <IsoBox o={[cube[0] - 60, cube[1] - 30]} a={120} b={120} c={120} fill="#7cc4ff" fo={0.25} />
          {dirs.map(([, d], i) => <Arrow key={i} p={[cube[0] + d[0] * 1.6, cube[1] + d[1] * 1.6 - 20]} q={[cube[0] + d[0] * 0.75, cube[1] + d[1] * 0.75 - 20]} color={C.second} w={9} head={32} />)}
          <Lbl x={520} y={830} t="equal in every direction" c={C.key} s={T.key} a="middle" />
        </g>
      </Svg>
      <Svg>
        {/* fix loop 1 (M2): the maths zone is not empty while the hits build the force */}
        <Keyword f={f} text="air pressure" at={[1120, 150]} appear={AT(k, 0, "air pressure")} s={T.calc} />
        <Lbl x={1120} y={250} t="billions of tiny pushes" c={C.second} s={T.key} o={fin(f, AT(k, 2, "billions"))} />
      </Svg>
      <TeX s={EQ_S04} x={1120} y={420} size={T.eq} o={fin(f, tEq)} />
      <TeX s={String.raw`1\ \mathrm{Pa} = 1\ \mathrm{N/m^2}`} x={1120} y={640} size={T.calc} o={fin(f, tPa)} />
    </Scene>
  );
};

/// ================================================================ s05 the column's weight (UF1 U-WB-07: a 3-D column on one square metre)
/** the old SVG column (s60 recap thumbnail) */
const Column: React.FC<{ x: number; y0: number; y1: number; w?: number; o?: number; slab?: [number, number]; slabO?: number }> = ({ x, y0, y1, w = 160, o = 1, slab, slabO = 0 }) => (
  <g opacity={o}>
    <defs><linearGradient id={`colg${x}`} x1={0} y1={1} x2={0} y2={0}><stop offset="0" stopColor="#7cc4ff" stopOpacity={0.75} /><stop offset="1" stopColor="#7cc4ff" stopOpacity={0.02} /></linearGradient></defs>
    <rect x={x - w / 2} y={y1} width={w} height={y0 - y1} fill={`url(#colg${x})`} />
    <line x1={x - w / 2} y1={y0} x2={x - w / 2} y2={y1} stroke="#7cc4ff" strokeOpacity={0.5} strokeWidth={3} />
    <line x1={x + w / 2} y1={y0} x2={x + w / 2} y2={y1} stroke="#7cc4ff" strokeOpacity={0.5} strokeWidth={3} />
    <path d={`M${x - w / 2 - 30} ${y0} L${x + w / 2 + 30} ${y0} L${x + w / 2 + 70} ${y0 + 30} L${x - w / 2 + 10} ${y0 + 30} Z`} fill="#3a4766" stroke={C.gold} strokeWidth={4} />
    {slab && slabO > 0 ? <rect x={x - w / 2} y={slab[0]} width={w} height={slab[1] - slab[0]} fill="#7cc4ff" fillOpacity={0.45} stroke={C.gold} strokeWidth={4} opacity={slabO} /> : null}
  </g>
);
const Car: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => (
  <g opacity={o}><rect x={x - 38} y={y - 22} width={76} height={24} rx={8} fill={C.local} /><rect x={x - 22} y={y - 40} width={40} height={20} rx={6} fill={C.local} />
    <circle cx={x - 22} cy={y + 4} r={9} fill={C.bg} stroke={C.ink} strokeWidth={3} /><circle cx={x + 22} cy={y + 4} r={9} fill={C.bg} stroke={C.ink} strokeWidth={3} /></g>
);
/** the 3-D air column (35 km drawn 7 units tall: zk = 0.2 per km), faces fading with height like the air's density */
const COLZK = 0.12, COLTOP = 4.4;
const ColumnFaces: React.FC<{ o?: number; zk?: number; top?: number; dim?: number }> = ({ o = 1, zk = COLZK, top = COLTOP, dim = 1 }) => (
  <>
    <Box3D a={[0, 0, 0]} b={[1, 1, top]} color="#7cc4ff" o={0.42 * o * dim} bands={28} oz={(t) => rhoFade((t * top) / zk)} top={false} />
    <Rod3D a={[0, 0, 0]} b={[0, 0, top * 0.55]} px={2} color="#7cc4ff" o={0.5 * o} /><Rod3D a={[1, 0, 0]} b={[1, 0, top * 0.55]} px={2} color="#7cc4ff" o={0.5 * o} />
    <Rod3D a={[1, 1, 0]} b={[1, 1, top * 0.55]} px={2} color="#7cc4ff" o={0.5 * o} /><Rod3D a={[0, 1, 0]} b={[0, 1, top * 0.55]} px={2} color="#7cc4ff" o={0.5 * o} />
    <Plate3D a={[-0.02, -0.02, 0]} b={[1.02, 1.02, 0]} fill="#3a4766" fo={0.85} edge={C.gold} px={5} o={o} />
  </>
);
/** s05's end camera (re-used by s13-s15 and s18 for continuity) */
const S05_END = { az: 20, el: 22, dist: 8.2, target: [0.5, 0.5, 2.0] as V3 };
const S05: React.FC = () => {
  const f = useCurrentFrame(), k = K("s05_weight_column");
  const tCol = SS(k, 1), tW = AT(k, 2, "its weight"), tP = AT(k, 3, "one hundred"), tWt = SS(k, 4), tM = SS(k, 5), tKg = AT(k, 6, "ten thousand"), tCars = AT(k, 6, "seven cars"), tEnd = SS(k, 7);
  const rows: CalcRow[] = [
    { lhs: "m", rhs: String.raw`= \dfrac{p_0}{g}`, at: tM },
    { rhs: String.raw`= \dfrac{101\,325}{9.81}`, at: AT(k, 5, "divided by g") + 10, cont: true },
    { rhs: String.raw`\approx 10\,300\ \mathrm{kg}`, at: tKg, cont: true, ul: tKg + 10 },
  ];
  // camera: low at the plate on S2, tilting up the column to its end view by the end of S3
  const o3 = orbitPath([{ f: 0, az: -30, el: 12, dist: 4.2, target: [0.5, 0.5, 0.45] }, { f: tCol, az: -30, el: 12, dist: 4.2, target: [0.5, 0.5, 0.45] },
    { f: SE(k, 2), ...S05_END }, { f: LEN(k), ...S05_END, az: 28 }], f);
  const { st, pr } = colStage(o3);
  const topL = pr.p([0.5, 0.5, COLTOP * 0.92]), mid = pr.p([0.5, 0.5, 2.0]), base = pr.p([1, 0, 0]);
  return (
    <Scene>
      <View3D st={st} x={COLVB.x} y={COLVB.y} w={COLVB.w} h={COLVB.h}>
        <ColumnFaces />
        <Rod3D a={[-0.6, 0, 0]} b={[-0.6, 0, 3.9]} px={4} color={C.first} o={fin(f, tCol)} />
        <Arrow3D from={[0.5, 0.5, 3.0]} to={[0.5, 0.5, 0.06]} color="#a8743f" px={10} head={40} o={fin(f, tW)} />
      </View3D>
      <Svg>
        <BaseLabels pr={pr} o={fin(f, tCol)} />
        <HeightTicks pr={pr} zk={COLZK} ticks={[0, 10, 20, 30]} x={-0.6} o={fin(f, tCol)} />
        <Keyword f={f} text="top of the atmosphere: no sharp edge" at={[110, 90]} appear={AT(k, 1, "all the way")} s={T.floor} targets={[[topL[0], topL[1] + 20]]} />
        <Lbl x={mid[0] + 40} y={mid[1]} t="weight" c="#a8743f" s={T.key} o={fin(f, tW)} />
        <Lbl x={base[0] + 150} y={base[1] - 70} t="101 325 Pa" c={PRES} s={T.key} o={fin(f, tP)} />
        {Array.from({ length: 7 }, (_, i) => <Car key={i} x={1130 + i * 100} y={740} o={fin(f, tCars + i * 3)} />)}
        <Keyword f={f} text="pressure = weight above" at={[1080, 830]} appear={tEnd} s={T.key} />
      </Svg>
      {/* fix loop 1 (M2): the goal first, in the maths zone from the first words; answered on "one hundred…", gone when the weight row arrives */}
      <TeX s={String.raw`p_0 = \ ?`} x={1100} y={500} size={T.eq} c={PRES} o={fin(f, AT(k, 0, "pressure at the ground")) * fout(f, tP - 6, 6)} />
      <TeX s={String.raw`p_0 = 101\,325\ \mathrm{Pa}`} x={1100} y={500} size={T.eq} c={PRES} o={fin(f, tP) * fout(f, tWt - 10)} />
      <TeX s={String.raw`\text{weight} = m\,g`} x={1100} y={100} size={T.calc} o={fin(f, tWt)} />
      <TeX s={String.raw`g = 9.81\ \mathrm{m/s^2}`} x={1100} y={190} size={T.calc} o={fin(f, AT(k, 4, "nine point"))} />
      <CalcStack f={f} x={1180} y={270} rows={tall(rows, T.calc)} size={T.calc} maxLines={1} />
    </Scene>
  );
};

// ================================================================ s06 why we are not crushed
const S06: React.FC = () => {
  const f = useCurrentFrame(), k = K("s06_not_crushed");
  const tIn = SS(k, 1), tOut = AT(k, 1, "push back"), tBal = SS(k, 2), tLift = SS(k, 3);
  const angs = Array.from({ length: 10 }, (_, i) => (i / 10) * 2 * Math.PI);
  const lift = clamp((f - tLift) / 90, 0, 1);
  return (
    <Scene>
      <Svg>
        <Person x={480} y={600} s={2} />
        {angs.map((a, i) => { const cx = 480, cy = 420, R1 = 330, R2 = 250; const p: Pt = [cx + Math.cos(a) * R1, cy + Math.sin(a) * R1 * 1.05], q: Pt = [cx + Math.cos(a) * R2, cy + Math.sin(a) * R2 * 1.05];
          return <g key={i}><Arrow p={p} q={q} color={C.second} w={8} head={28} o={fin(f, tIn + i * 2)} /><Arrow p={lerp(q, [cx, cy], 0.55)} q={lerp(q, [cx, cy], 0.15)} color={C.first} w={6} head={22} o={fin(f, tOut + i * 2)} /></g>; })}
        {/* fix loop 1 (M2): the arrow legend in the maths zone, on the words, gone before the lift arrives */}
        <g opacity={win(f, tIn, tLift - 10)}><Arrow p={[1100, 150]} q={[1200, 150]} color={C.second} w={8} head={28} /><Lbl x={1230} y={150} t="air pushes in" c={C.second} s={T.key} /></g>
        <g opacity={win(f, tOut, tLift - 10)}><Arrow p={[1200, 220]} q={[1100, 220]} color={C.first} w={6} head={22} /><Lbl x={1230} y={220} t="body pushes out" c={C.first} s={T.key} /></g>
        <Keyword f={f} text="balance" at={[1100, 330]} appear={tBal} s={T.calc} />
        <g opacity={fin(f, tLift)}>
          <rect x={1450} y={120} width={200} height={700} fill="none" stroke={C.muted} strokeWidth={4} />
          <rect x={1470} y={700 - 520 * easeIO(lift)} width={160} height={110} fill="#3a4766" stroke={C.ink} strokeWidth={4} />
          <circle cx={1550} cy={755 - 520 * easeIO(lift)} r={18 + 6 * pulse(f, tLift + 70, 30)} fill="none" stroke={C.gold} strokeWidth={5} />
          <Lbl x={1420} y={500} t="ears pop" c={C.key} s={T.key} a="end" />
        </g>
      </Svg>
    </Scene>
  );
};

// ================================================================ s07 hectopascals and the barometer (needle follows the real Brest hours)
const S07: React.FC = () => {
  const f = useCurrentFrame(), k = K("s07_hpa");
  const t1 = SS(k, 1), tMb = SS(k, 2), tBaro = SS(k, 3), tFew = SS(k, 4), tWind = SS(k, 5);
  const hh = clamp((f - tFew) / (SE(k, 5) - tFew), 0, 1) * 47;
  const needle = f < tFew ? 1013 : interp(hh, BH.msl_hPa.map((_: number, i: number) => i), BH.msl_hPa);
  const rows: CalcRow[] = [
    { lhs: String.raw`1\ \mathrm{hPa}`, rhs: String.raw`= 100\ \mathrm{Pa}`, at: AT(k, 0, "hectopascals") },
    { lhs: String.raw`101\,325\ \mathrm{Pa}`, rhs: String.raw`= 1013.25\ \mathrm{hPa}`, at: AT(k, 1, "so the average") },
    { rhs: String.raw`\approx 1013\ \mathrm{hPa}`, at: AT(k, 1, "so the average") + 20, cont: true },
    { lhs: String.raw`1\ \mathrm{hPa}`, rhs: String.raw`= 1\ \mathrm{mb}`, at: tMb },
  ];
  return (
    <Scene>
      <Svg>
        <Barometer x={520} y={430} r={300} v={needle} o={fin(f, 0)} />
        <Keyword f={f} text="barometer" at={[520, 780]} a="middle" appear={tBaro} s={T.key} />
        <Lbl x={1100} y={720} t="a few %" c={C.gold} s={T.key} o={fin(f, tFew)} />
        {/* fix loop 1 (M2 3-10 s, r5 scan): the new unit is named in the maths zone on S0 */}
        <Keyword f={f} text="hectopascals (hPa)" at={[1100, 600]} appear={AT(k, 0, "hectopascals")} s={T.key} />
        {/* fix loop 2 (review 2 S1): "big numbers" shown on S0's first words, so the maths zone is not empty for 3.5 s */}
        <Lbl x={1100} y={470} t="101 325 Pa: a big number" c={C.key} s={T.key} o={win(f, 0, AT(k, 1, "so the average") - 6)} />
        <Keyword f={f} text="drive the winds" at={[1100, 810]} appear={tWind} s={T.key} />
      </Svg>
      <TeX s={EQ_S07} x={-999} y={-999} size={T.calc} o={0} />
      <CalcStack f={f} x={1400} y={110} rows={tall(rows, T.calc)} size={T.calc} maxLines={4} />
      <Src id="s07_hpa" o={fin(f, tFew)} w={1200} />
    </Scene>
  );
};

// ================================================================ s08 density: the room
const S08: React.FC = () => {
  const f = useCurrentFrame(), k = K("s08_density");
  const tRho = AT(k, 1, "rho"), t12 = SS(k, 2), tRoom = SS(k, 3), tFill = AT(k, 3, "fifty cubic"), t60 = AT(k, 3, "sixty kilograms");
  const s = 70, o: Pt = [420, 450];
  const P = (x: number, y: number, z: number) => isoPt(o, x * s, y * s, z * s);
  const rows: CalcRow[] = [
    { rhs: String.raw`5 \times 4 \times 2.5 = 50\ \mathrm{m^3}`, at: tFill },
    { rhs: EQ_S08, at: t60, ul: t60 + 10 },
  ];
  return (
    <Scene>
      <Svg>
        {/* fix loop 1 (M1): the (empty) room stands from frame 0 — air you cannot see; it fills on "fifty cubic metres" */}
        <IsoBox o={o} a={5 * s} b={4 * s} c={2.5 * s} fill="#7cc4ff" fo={0.3 * fin(f, tFill, 30)} />
        <g opacity={fin(f, tRoom)}>
          <Lbl x={460} y={830} t="5 m × 4 m × 2.5 m" c={C.key} s={T.key} a="middle" />
        </g>
        <Person x={P(2.5, 2, 0)[0]} y={P(2.5, 2, 0)[1] - 10} s={0.75} o={fin(f, t60)} />
        <Keyword f={f} text="density" at={[1230, 140]} appear={AT(k, 0, "density")} out={tRho - 8} s={T.calc} />
      </Svg>
      <TeX s={String.raw`\mathrm{kg}\ \text{per}\ \mathrm{m^3}`} x={1120} y={240} size={T.calc} o={fin(f, AT(k, 1, "how much mass")) * fout(f, t12 - 10)} />
      <TeX s={String.raw`\rho`} x={1120} y={140} size={96} c="#a8743f" o={fin(f, tRho)} />
      <TeX s={String.raw`\text{density},\ \mathrm{kg/m^3}`} x={1230} y={140} size={T.key} c={C.key} o={fin(f, tRho)} />
      <TeX s={String.raw`\rho \approx 1.2\ \mathrm{kg/m^3}`} x={1120} y={280} size={T.calc} o={fin(f, t12)} />
      <CalcStack f={f} x={1110} y={420} rows={tall(rows.map((r) => ({ ...r })), 58)} size={58} />
    </Scene>
  );
};

// ================================================================ s09 temperature and kelvin
const S09: React.FC = () => {
  const f = useCurrentFrame(), k = K("s09_temperature");
  const tK = SS(k, 1), tAdd = SS(k, 2), tStep = SS(k, 3), tZero = SS(k, 4);
  const A: Ax = { x: 1250, y: 120, w: 10, h: 640, xr: [0, 1], yr: [-273.15, 40] };
  const Y = axY(A);
  const pairs = [[-273.15, 0], [0, 273.15], [15, 288.15]];
  return (
    <Scene>
      <Svg>
        <MolBox x={120} y={260} s={360} n={36} f={f} speed={0.004} c={C.local} seed={2} />
        <MolBox x={560} y={260} s={360} n={36} f={f} speed={0.02} c={C.second} seed={3} />
        <Lbl x={300} y={680} t="colder" c={C.local} s={T.key} a="middle" />
        <Lbl x={740} y={680} t="warmer" c={C.second} s={T.key} a="middle" />
        {/* fix loop 1 (M2 3-10 s): the two scale bars stand faint from frame 0; their names come on "Celsius" / "kelvin" */}
        <g opacity={0.45 + 0.55 * fin(f, tK)}>
          <line x1={1250} y1={Y(40)} x2={1250} y2={Y(-273.15)} stroke={C.muted} strokeWidth={6} />
          <line x1={1560} y1={Y(40)} x2={1560} y2={Y(-273.15)} stroke={C.muted} strokeWidth={6} />
        </g>
        <Lbl x={1250} y={90} t="°C" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "Celsius"))} />
        <Lbl x={1560} y={90} t="K" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "kelvin"))} />
        <Lbl x={1405} y={300} t="faster = warmer" c={TEMP} s={T.key} a="middle" o={fin(f, AT(k, 0, "the warmer")) * fout(f, tK)} />
        <g opacity={fin(f, tK)}>
          {pairs.map(([c, kk]) => <g key={c}>
            <line x1={1235} x2={1265} y1={Y(c)} y2={Y(c)} stroke={C.ink} strokeWidth={4} /><line x1={1545} x2={1575} y1={Y(c)} y2={Y(c)} stroke={C.ink} strokeWidth={4} />
            <Lbl x={1220} y={Y(c) + (c === 15 ? -22 : c === 0 ? 22 : 0)} t={String(c)} c={C.ink} s={52} a="end" b={false} />
            <Lbl x={1590} y={Y(c) + (c === 15 ? -22 : c === 0 ? 22 : 0)} t={String(kk)} c={C.ink} s={52} b={false} />
            <line x1={1270} x2={1540} y1={Y(c)} y2={Y(c)} stroke={C.gold} strokeWidth={3} strokeDasharray="8 8" opacity={fin(f, tAdd)} />
          </g>)}
          <circle cx={1560} cy={Y(-273.15)} r={14 + 8 * pulse(f, tZero, 30)} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, tZero)} />
          <Lbl x={1405} y={Y(-273.15) + 60} t="coldest possible" a="middle" c={C.key} s={T.key} o={fin(f, tZero)} />
          <Lbl x={1300} y={Y(-150)} t="same step" c={C.gold} s={T.key} o={fin(f, tStep)} />
        </g>
      </Svg>
      <TeX s={EQ_S09} x={120} y={790} size={T.calc} o={fin(f, tAdd)} />
    </Scene>
  );
};

// ================================================================ s10 the gas law, built
const S10: React.FC = () => {
  const f = useCurrentFrame(), k = K("s10_gas_law");
  const t2 = SS(k, 2), t3 = SS(k, 3), t4 = AT(k, 4, "p equals"), t6 = SS(k, 6), tR = AT(k, 6, "two hundred");
  const parts: Part[] = [
    { t: "p", c: PRES, u: { w: String.raw`\text{pressure (Pa)}`, c: C.gold } }, { t: "=" },
    { t: String.raw`\rho`, c: "#a8743f", u: { w: String.raw`\text{density}`, c: C.gold } },
    { t: "R", c: C.key, u: { w: String.raw`\text{gas constant}`, c: C.gold } },
    { t: "T", c: TEMP, u: { w: String.raw`\text{temperature (K)}`, c: C.gold } },
  ];
  const c1 = win(f, t2, t3 + 10), c2 = fin(f, t3);
  // fix loop 1 (M1/M2): one molecule box from frame 0 (the wall the molecules push on), and the three quantities waiting in
  // the maths zone on their words in S0, until the law gathers them on "p equals"
  const box0 = fout(f, t2, 8);
  const qs: [string, string, string][] = [["p", PRES, "pressure"], [String.raw`\rho`, "#a8743f", "density"], ["T", TEMP, "temperature"]];
  return (
    <Scene>
      <Svg>
        <g opacity={box0}>
          <MolBox x={120} y={200} s={300} n={20} f={f} speed={0.01} seed={4} wallHi={fin(f, AT(k, 1, "push harder"))} />
        </g>
        <g opacity={c1}>
          <MolBox x={120} y={200} s={300} n={20} f={f} speed={0.01} seed={4} />
          <MolBox x={540} y={200} s={300} n={40} f={f} speed={0.01} seed={5} />
          <Arrow p={[460, 360]} q={[425, 360]} color={C.second} w={8} head={26} /><Arrow p={[920, 360]} q={[845, 360]} color={C.second} w={12} head={36} />
          <Lbl x={480} y={620} t="p ∝ ρ" c={C.key} s={T.calc} a="middle" />
        </g>
        <g opacity={c2 * fout(f, t4)}>
          <MolBox x={120} y={200} s={300} n={20} f={f} speed={0.006} seed={6} c={C.local} />
          <MolBox x={540} y={200} s={300} n={20} f={f} speed={0.02} seed={6} c={C.second} />
          <Arrow p={[460, 360]} q={[425, 360]} color={C.second} w={8} head={26} /><Arrow p={[920, 360]} q={[845, 360]} color={C.second} w={12} head={36} />
          <Lbl x={480} y={620} t="p ∝ T" c={C.key} s={T.calc} a="middle" />
        </g>
      </Svg>
      {qs.map(([s, c, w], i) => <TeX key={w} s={s} x={1220 + i * 220} y={300} size={96} c={c} ax={0.5} o={fin(f, AT(k, 0, w)) * fout(f, t4 - 8, 8)} />)}
      <Svg>{qs.map(([, c, w], i) => <Lbl key={w} x={1220 + i * 220} y={420} t={w} c={c} s={T.floor} a="middle" o={fin(f, AT(k, 0, w)) * fout(f, t4 - 8, 8)} />)}</Svg>
      <Layered parts={parts} layers={[base(fin(f, t4)), { u: [0, 2, 3, 4], o: fin(f, t6) }]} x={960} y={380} size={96} ax={0.5} />
      <TeX s={EQ_S10} x={-999} y={-999} o={0} />
      <TeX s={String.raw`R = 287\ \mathrm{J\,kg^{-1}\,K^{-1}}`} x={960} y={720} size={T.calc} ax={0.5} o={fin(f, tR)} />
    </Scene>
  );
};

// ================================================================ s11 the gas law with numbers
const S11: React.FC = () => {
  const f = useCurrentFrame(), k = K("s11_gas_law_numbers");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4);
  const rows: CalcRow[] = [
    { lhs: String.raw`\rho`, rhs: String.raw`= \dfrac{p}{R T}`, at: t2 },
    { rhs: String.raw`= \dfrac{101\,325}{287 \times 288.15}`, at: t3, cont: true },
    { rhs: String.raw`\approx 1.225\ \mathrm{kg/m^3}`, at: t4, cont: true, ul: t4 + 12 },
  ];
  return (
    <Scene>
      <Svg>
        {/* fix loop 1 (M1): the cubic metre stands from frame 0; its values come on their words */}
        <IsoBox o={[420, 420]} a={220} b={220} c={220} fill="#7cc4ff" fo={0.4 * fin(f, t4, 30)} op={1} />
        <Lbl x={140} y={720} t="p = 1013 hPa" c={PRES} s={T.key} o={fin(f, AT(k, 1, "one thousand"))} />
        <Lbl x={140} y={800} t="T = 15 °C = 288.15 K" c={TEMP} s={T.key} o={fin(f, AT(k, 1, "fifteen"))} />
        <Lbl x={420} y={140} t="1 m³" c={C.key} s={T.key} a="middle" o={fin(f, AT(k, 1, "density"))} />
        <Lbl x={760} y={330} t="1.225 kg" c={C.key} s={T.key} o={fin(f, t4 + 15)} />
      </Svg>
      <TeX s={EQ_S11} x={-999} y={-999} o={0} />
      {/* fix loop 1 (M2): the law from the last scene opens the maths zone ("Let's use it") */}
      <TeX s={EQ_S10} x={1180} y={110} size={T.calc} o={1} />
      <CalcStack f={f} x={1180} y={260} rows={tall(rows, T.calc)} size={T.calc} />
    </Scene>
  );
};

// ================================================================ s12 warm air is lighter
const S12: React.FC = () => {
  const f = useCurrentFrame(), k = K("s12_warm_air_light");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4);
  const rows: CalcRow[] = [
    { rhs: String.raw`\dfrac{101\,325}{287 \times 273.15} \approx 1.29`, at: t1, c: C.local },
    { rhs: String.raw`\dfrac{101\,325}{287 \times 303.15} \approx 1.16`, at: t2, c: C.second },
    { rhs: EQ_S12, at: t3, ul: t3 + 12 },
  ];
  const rise = clamp((f - t4) / 120, 0, 1);
  const dots = (x: number, n: number, seed: number) => Array.from({ length: n }, (_, i) => <circle key={i} cx={x + 20 + rnd(i * 3 + seed) * 200} cy={330 + rnd(i * 7 + seed) * 200} r={6} fill={C.ink} opacity={0.8} />);
  return (
    <Scene>
      <Svg>
        {/* fix loop 1 (M1): the two boxes stand from frame 0 (same pressure, "change only the temperature"); dots and values on their words */}
        <rect x={100} y={320} width={240} height={220} fill="#22304d" stroke={C.local} strokeWidth={5} />
        <rect x={440} y={320} width={240} height={220} fill="#3a2c22" stroke={C.second} strokeWidth={5} />
        <g opacity={fin(f, t1)}>{dots(100, 52, 1)}
          <Lbl x={220} y={600} t="0 °C" c={C.local} s={T.key} a="middle" /><Lbl x={220} y={670} t="1.29 kg/m³" c={C.local} s={T.key} a="middle" />
          <Arrow p={[220, 230]} q={[220, 300]} color={C.local} w={8} head={26} o={fin(f, t4)} /></g>
        <g opacity={fin(f, t2)}>{dots(440, 47, 9)}
          <Lbl x={560} y={600} t="30 °C" c={C.second} s={T.key} a="middle" /><Lbl x={560} y={670} t="1.16 kg/m³" c={C.second} s={T.key} a="middle" />
          <Arrow p={[560, 300]} q={[560, 230]} color={C.second} w={8} head={26} o={fin(f, t4)} /></g>
        <Lbl x={390} y={770} t="p = 1013 hPa" c={PRES} s={T.key} a="middle" o={fin(f, AT(k, 0, "pressure fixed"))} />
        <HotBalloon x={850} y={560 - 360 * easeIO(rise)} s={0.9} o={fin(f, t4)} />
        <Lbl x={1100} y={780} t="warm rises · cold sinks" c={C.key} s={T.key} o={fin(f, AT(k, 4, "warm air tends"))} />
      </Svg>
      <CalcStack f={f} x={1100} y={120} rows={tall(rows, 62)} size={62} maxLines={3} />
      <TeX s={String.raw`\rho = \dfrac{p}{R\,T}`} x={1100} y={640} size={62} o={fin(f, AT(k, 0, "change only"))} />
    </Scene>
  );
};

/// ================================================================ s13-s15 the slab (UF1 U-WB-08/09, R3: a 3-D slab inside the 3-D column)
const SLZ = 1.7, SLH = 0.45; // slab bottom and thickness (world units) inside the 7.4-unit column
/** the slab stage: column (dimmed), slab box with gold edges, the three forces as 3-D arrows; returns the projector */
const SlabStage: React.FC<{ f: number; o3: ReturnType<typeof orbitPath>; thin?: number; up?: number; dn?: number; wt?: number; fillHi?: number; topHi?: number; dzHi?: number;
  wtPulse?: number; zt?: number; children?: (pr: Projector, g: { z0: number; z1: number }) => React.ReactNode }> = ({ f, o3, thin = 0, up = 0, dn = 0, wt = 0, fillHi = 0, topHi = 0,
  dzHi = 0, wtPulse = 0, zt = 1, children }) => {
  const { st, pr } = colStage(o3);
  const h = SLH * (1 - 0.82 * thin), z0 = SLZ + (SLH - h) / 2, z1 = z0 + h;
  void f;
  return (
    <>
      <View3D st={st} x={COLVB.x} y={COLVB.y} w={COLVB.w} h={COLVB.h}>
        <ColumnFaces dim={0.55} />
        <Rod3D a={[-0.6, 0, 0]} b={[-0.6, 0, 3.9]} px={4} color={C.first} o={zt} />
        <Box3D a={[0, 0, z0]} b={[1, 1, z1]} color="#7cc4ff" o={0.45 + 0.35 * fillHi} order={5} />
        {topHi > 0 ? <Box3D a={[0, 0, z1 - 0.004]} b={[1, 1, z1]} color={C.gold} o={0.3 * topHi} order={6} /> : null}
        <BoxEdges3D a={[0, 0, z0]} b={[1, 1, z1]} color={C.gold} px={4} />
        <Arrow3D from={[0.3, 0.5, z0 - 1.25]} to={[0.3, 0.5, z0 - 0.03]} color={C.second} px={10} head={36} o={up} />
        <Arrow3D from={[0.3, 0.5, z1 + 1.0]} to={[0.3, 0.5, z1 + 0.03]} color={C.second} px={10} head={36} o={dn} />
        <Arrow3D from={[0.78, 0.5, (z0 + z1) / 2]} to={[0.78, 0.5, (z0 + z1) / 2 - 0.75]} color="#a8743f" px={10 + 4 * wtPulse} head={36} o={wt} />
      </View3D>
      <Svg>{children ? children(pr, { z0, z1 }) : null}</Svg>
    </>
  );
};
/** labels on the slab: the two "1 m" top edges, the Δz bracket, the arrows' names at their tips */
const SlabLabels: React.FC<{ pr: Projector; z0: number; z1: number; m1?: number; dz?: number; dzPulse?: number; up?: number; dn?: number; wt?: number; area?: number }> = ({
  pr, z0, z1, m1 = 1, dz = 0, dzPulse = 0, up = 0, dn = 0, wt = 0, area = 0 }) => {
  const e1 = pr.p([0.5, 0, z1]), e2 = pr.p([1, 0.5, z1]), b0 = pr.p([1.08, 0, z0]), b1 = pr.p([1.08, 0, z1]);
  const tu = pr.p([0.3, 0.5, z0 - 1.25]), td = pr.p([0.3, 0.5, z1 + 1.0]), tw = pr.p([0.78, 0.5, (z0 + z1) / 2 - 0.75]), ct = pr.p([0.5, 0.5, z1]);
  return (
    <g>
      <g opacity={m1}><Lbl x={e1[0] - 10} y={e1[1] + 34} t="1 m" c={C.gold} s={T.floor} a="end" /><Lbl x={e2[0] + 24} y={e2[1] - 6} t="1 m" c={C.gold} s={T.floor} /></g>
      {area > 0 ? <Lbl x={ct[0]} y={ct[1] - 58} t="1 m²" c={C.gold} s={T.key} a="middle" o={area} /> : null}
      {dz > 0 ? <g opacity={dz}><Bracket p={[b0[0] + 26, b0[1]]} q={[b1[0] + 26, b1[1]]} off={0} c={C.gold} w={5 + 3 * dzPulse} />
        <Lbl x={b0[0] + 64} y={(b0[1] + b1[1]) / 2 + 30} t="Δz" c={C.gold} s={T.key} /></g> : null}
      <Lbl x={tu[0] - 24} y={tu[1] - 10} t="p(z)" c={C.second} s={T.key} a="end" o={up} />
      <Lbl x={td[0] - 24} y={td[1] + 10} t="p(z + Δz)" c={C.second} s={T.key} a="end" o={dn} />
      <Lbl x={tw[0] + 30} y={tw[1] + 10} t="weight" c="#a8743f" s={T.key} o={wt} />
    </g>
  );
};
/** the slab camera: s05's end view, moving closer (dist × 0.6, el 28) and orbiting az +20 → +35 across s13-s15 */
const slabCam = (f: number, k: number, from: "s05" | "near", azA: number, azB: number) => orbitPath([
  from === "s05" ? { f: 0, ...S05_END } : { f: 0, az: azA, el: 28, dist: 7.8, target: [0.5, 0.5, SLZ + 0.2] },
  { f: from === "s05" ? 60 : 1, az: azA + 2, el: 28, dist: 7.8, target: [0.5, 0.5, SLZ + 0.2] },
  { f: LEN(k), az: azB, el: 28, dist: 7.8, target: [0.5, 0.5, SLZ + 0.2], linear: true }], f);
const S13: React.FC = () => {
  const f = useCurrentFrame(), k = K("s13_slab");
  const up = fin(f, SS(k, 5)), dn = fin(f, SS(k, 6)), wt = fin(f, SS(k, 7));
  return (
    <Scene>
      <SlabStage f={f} o3={slabCam(f, k, "s05", 20, 26)} up={up} dn={dn} wt={wt}>
        {(pr, g) => <SlabLabels pr={pr} z0={g.z0} z1={g.z1} m1={fin(f, AT(k, 2, "one square metre"))} dz={fin(f, AT(k, 2, "delta z"))} up={up} dn={dn} wt={wt} />}
      </SlabStage>
      <Svg>
        <Lbl x={1100} y={200} t="z = height" c={C.first} s={T.key} o={fin(f, SS(k, 3))} />
        <Lbl x={1100} y={290} t="Δz = small step in height" c={C.gold} s={T.key} o={fin(f, AT(k, 3, "delta z means"))} />
        <Keyword f={f} text="at rest → forces balance" at={[1100, 420]} appear={SS(k, 4)} s={T.key} />
        {/* fix loop 1 (M2): the question and the goal open the maths zone (house: the goal before the calculation) */}
        <Lbl x={1100} y={600} t="going up: p falls" c={PRES} s={T.key} o={fin(f, AT(k, 0, "pressure changes"))} />
        <Keyword f={f} text="goal: how fast?" at={[1100, 700]} appear={AT(k, 1, "Our goal")} s={T.key} />
      </Svg>
    </Scene>
  );
};
const S14: React.FC = () => {
  const f = useCurrentFrame(), k = K("s14_slab_weight");
  const tBase = AT(k, 1, "its base"), tTh = AT(k, 1, "thickness"), tD = AT(k, 2, "density"), tWg = AT(k, 3, "weight"), tCan = AT(k, 7, "cancel it");
  // U-WB-09: volume → mass → weight, one line per sentence, each factor named
  const rows: CalcRow[] = [
    { lhs: "V", rhs: String.raw`= 1\ \mathrm{m^2} \times \Delta z`, at: AT(k, 1, "so its volume") },
    { lhs: "m", rhs: String.raw`= \rho\, V = \rho \times 1\ \mathrm{m^2} \times \Delta z`, at: AT(k, 2, "so m equals") },
    { lhs: "W", rhs: String.raw`= m\, g = \rho\, g\, \Delta z \times 1\ \mathrm{m^2}`, at: AT(k, 3, "so W equals"), c: "#a8743f" },
  ];
  const sq = String.raw`\times 1\ \mathrm{m^2}`;
  const L1: Part[] = [{ t: "p(z)", c: C.second, u: { w: String.raw`\text{push up}`, c: C.gold } }, { t: sq, c: C.ink, x: C.gold }];
  const L1b: Part[] = [{ t: "-" }, { t: String.raw`p(z+\Delta z)`, c: C.second, u: { w: String.raw`\text{push down}`, c: C.gold } }, { t: sq, c: C.ink, x: C.gold }];
  const L2: Part[] = [{ t: "=" }, { t: String.raw`\rho\, g\, \Delta z`, c: "#a8743f", u: { w: String.raw`\text{weight}`, c: C.gold } }, { t: sq, c: C.ink, x: C.gold }];
  const t6 = SS(k, 5), t7 = SS(k, 6);
  const fx = fout(f, SS(k, 4) - 4, 10); // the volume → weight block gives the zone to the balance on "Now the balance"
  return (
    <Scene>
      <SlabStage f={f} o3={slabCam(f, k, "near", 26, 30)} up={1} dn={1} wt={1} fillHi={fin(f, tD) * fout(f, tWg)} topHi={fin(f, tBase) * fout(f, tD)}
        dzHi={pulse(f, tTh, 24)} wtPulse={pulse(f, tWg, 24)}>
        {(pr, g) => <SlabLabels pr={pr} z0={g.z0} z1={g.z1} dz={1} dzPulse={pulse(f, tTh, 24)} up={1} dn={1} wt={1} area={fin(f, tBase) * fout(f, tD)} />}
      </SlabStage>
      <Svg>
        {/* UF1 fix 1 (review 1 S1): the maths zone has a keyword from frame 0 */}
        <Keyword f={f} text="what does the slab weigh?" at={[1100, 150]} appear={0} out={AT(k, 1, "so its volume") - 8} s={T.key} />
        <Keyword f={f} text="mass = density × volume" at={[110, 100]} appear={AT(k, 2, "mass is density")} out={AT(k, 3, "weight is mass") - 6} s={T.key} />
        <Keyword f={f} text="weight = mass × g" at={[110, 100]} appear={AT(k, 3, "weight is mass")} out={SS(k, 4) + 20} s={T.key} />
        <Keyword f={f} text="push = pressure × area" at={[110, 100]} appear={SS(k, 5)} out={tCan} s={T.key} />
        <Keyword f={f} text="bottom pushes harder by the weight" at={[1080, 840]} appear={SS(k, 8)} s={T.floor} />
      </Svg>
      <CalcStack f={f} x={1110} y={110} rows={tall(rows, 56)} size={56} o={fx} />
      <Layered parts={L1} layers={[base(fin(f, t6)), { u: [0], o: fin(f, t7) }, { x: [1], o: fin(f, tCan) }]} x={1100} y={150} size={64} />
      <Layered parts={L1b} layers={[base(fin(f, t6)), { u: [1], o: fin(f, t7) }, { x: [2], o: fin(f, tCan) }]} x={1100} y={300} size={64} />
      <Layered parts={L2} layers={[base(fin(f, t7)), { u: [1], o: fin(f, t7) }, { x: [2], o: fin(f, tCan) }]} x={1100} y={450} size={64} />
      <TeX s={EQ_S14} x={1080} y={640} size={72} o={fin(f, tCan + 20)} />
    </Scene>
  );
};
const S15: React.FC = () => {
  const f = useCurrentFrame(), k = K("s15_hydrostatic");
  const tThin = AT(k, 4, "thinner and thinner");
  const thin = easeIO(clamp((f - tThin) / 60, 0, 1));
  const rows: CalcRow[] = [
    { lhs: String.raw`\Delta p`, rhs: String.raw`= p(z+\Delta z) - p(z)`, at: SS(k, 1) },
    { rhs: String.raw`= -\rho\, g\, \Delta z`, at: SS(k, 3), cont: true },
    { lhs: String.raw`\dfrac{\Delta p}{\Delta z}`, rhs: String.raw`= -\rho\, g`, at: AT(k, 4, "Divide") },
  ];
  const parts: Part[] = [
    { t: String.raw`\dfrac{\partial p}{\partial z}`, c: C.second, u: { w: String.raw`\text{change of } p \text{ with height}`, c: C.gold } }, { t: "=" },
    { t: String.raw`-\rho\, g`, c: "#a8743f", u: { w: String.raw`\text{weight per m}^3`, c: C.gold } },
  ];
  const tMain = SS(k, 7);
  return (
    <Scene>
      <SlabStage f={f} o3={slabCam(f, k, "near", 30, 35)} thin={thin} up={1} dn={1} wt={1}>
        {(pr, g) => <g><SlabLabels pr={pr} z0={g.z0} z1={g.z1} dz={1} up={1} dn={1} wt={1} />
          <Lbl x={pr.p([1.08, 0, g.z1])[0] + 70} y={pr.p([1.08, 0, g.z1])[1] - 70} t="Δz → 0" c={C.gold} s={T.key} o={fin(f, tThin)} /></g>}
      </SlabStage>
      <Svg>
        <Lbl x={1100} y={560} t="negative: falls going up" c={C.neg} s={T.key} o={win(f, SS(k, 2), tMain)} />
        <Keyword f={f} text="partial: only height changes" at={[1100, 650]} appear={SS(k, 6)} out={tMain} s={T.key} />
        <Keyword f={f} text="hydrostatic balance" at={[1100, 800]} appear={AT(k, 8, "hydrostatic balance")} s={T.calc} />
      </Svg>
      <CalcStack f={f} x={1280} y={60} rows={tall(rows.map((r) => ({ ...r, out: tMain })), 62)} size={62} />
      <Layered parts={parts} layers={[base(fin(f, tMain)), { u: [0, 2], o: fin(f, AT(k, 5, "how fast")) * fin(f, tMain) }]} x={1090} y={380} size={84} />
      <TeX s={EQ_S15} x={-999} y={-999} o={0} />
    </Scene>
  );
};

// ================================================================ s16 the tower
const S16: React.FC = () => {
  const f = useCurrentFrame(), k = K("s16_hydrostatic_numbers");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const rows: CalcRow[] = [
    { rhs: EQ_S16, at: AT(k, 1, "so the pressure"), size: 56 },
    { rhs: String.raw`100\ \mathrm{Pa} \div 12\ \mathrm{Pa/m} \approx 8\ \mathrm{m}`, at: t2 },
    { rhs: String.raw`300\ \mathrm{m} \times 12\ \mathrm{Pa/m} \approx 3600\ \mathrm{Pa} = 36\ \mathrm{hPa}`, at: AT(k, 3, "thirty-six"), size: 46 },
  ];
  const ride = easeIO(clamp((f - t3) / 120, 0, 1)), yb = 790, yt = 190, ycar = yb - (yb - yt) * ride;
  const pRead = 1013 - 36 * ride;
  return (
    <Scene>
      <Svg>
        <path d={`M300 ${yb} L360 ${yt} L420 ${yt} L480 ${yb} Z`} fill="none" stroke={C.muted} strokeWidth={6} />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <line key={i} x1={300 + (i * 60) / 8} y1={yb - (i * (yb - yt)) / 8} x2={480 - (i * 60) / 8} y2={yb - ((i + 1) * (yb - yt)) / 8} stroke={C.muted} strokeWidth={3} />)}
        <Lbl x={230} y={yt} t="300 m" c={C.key} s={T.key} a="end" o={fin(f, t3)} />
        <Lbl x={230} y={yb} t="0 m" c={C.key} s={T.key} a="end" o={fin(f, t3)} />
        <rect x={500} y={ycar - 50} width={70} height={50} fill="#3a4766" stroke={C.ink} strokeWidth={4} opacity={fin(f, t3)} />
        <Lbl x={600} y={ycar - 25} t={`${fmt(pRead, 0)} hPa`} c={C.second} s={T.key} o={fin(f, t3)} />
        <circle cx={535} cy={ycar - 25} r={12 + 6 * pulse(f, t4, 30)} fill="none" stroke={C.gold} strokeWidth={4} opacity={fin(f, t4)} />
        <Keyword f={f} text="ears notice" at={[640, 300]} appear={t4} s={T.key} />
        <Keyword f={f} text="vertical accelerations ≪ g" at={[1080, 780]} appear={t5} s={T.floor} />
      </Svg>
      <CalcStack f={f} x={1068} y={120} rows={tall(rows, 56)} size={56} />
      {/* fix loop 1 (M2 3-10 s, r5 scan): the balance from s15 stands in the maths zone from frame 0 ("How fast is that?") */}
      <TeX s={EQ_S15} x={1080} y={600} size={T.calc} o={1} />
      {void t1}
    </Scene>
  );
};

// ================================================================ pressure graph (s17, s19, s20, s21)
const PG: Ax = { x: 200, y: 90, w: 720, h: 640, xr: [0, 1050], yr: [0, 30] };
const isoCurve = (upto = 30): string => {
  const X = axX(PG), Y = axY(PG);
  return poly((AM.iso.z_km as number[]).map((z, i) => [z, AM.iso.p_hPa[i]] as [number, number]).filter(([z]) => z <= upto).map(([z, p]) => [X(p), Y(z)] as Pt));
};
const PGraph: React.FC<{ o?: number; upto?: number; curveO?: number; dash?: boolean }> = ({ o = 1, upto = 30, curveO = 1, dash }) => (
  <g opacity={o}>
    <Axes A={PG} xt={[0, 500, 1000]} yt={[0, 10, 20, 30]} xl="pressure (hPa)" yl="height (km)" />
    <path d={isoCurve(upto)} fill="none" stroke={C.local} strokeWidth={6} opacity={curveO} strokeDasharray={dash ? "14 10" : undefined} />
  </g>
);
const S17: React.FC = () => {
  const f = useCurrentFrame(), k = K("s17_combine");
  const X = axX(PG), Y = axY(PG);
  const tIn = AT(k, 3, "in place of rho"), tRes = SS(k, 4), tProp = SS(k, 5), tSteep = SS(k, 6), tGentle = SS(k, 7);
  const tang = (z: number, L: number) => { const p = interp(z, AM.iso.z_km, AM.iso.p_hPa), dp = (p / (AM.iso.H_km)); // hPa per km
    const a: Pt = [X(p + dp * L / 2), Y(z - L / 2)], b: Pt = [X(p - dp * L / 2), Y(z + L / 2)]; return { a, b }; };
  const t0 = tang(1, 4), t20 = tang(20, 4);
  return (
    <Scene>
      <Svg>
        <PGraph o={fin(f, 0)} curveO={0.6} />
        <g opacity={fin(f, tSteep)}><line x1={t0.a[0]} y1={t0.a[1]} x2={t0.b[0]} y2={t0.b[1]} stroke={C.gold} strokeWidth={7} /><Lbl x={X(620)} y={Y(7)} t="falls fast" c={C.gold} s={T.key} /></g>
        <g opacity={fin(f, tGentle)}><line x1={t20.a[0]} y1={t20.a[1]} x2={t20.b[0]} y2={t20.b[1]} stroke={C.gold} strokeWidth={7} /><Lbl x={X(220)} y={Y(23)} t="falls slowly" c={C.gold} s={T.key} /></g>
                <Keyword f={f} text="proportional to p itself" at={[1100, 720]} appear={tProp} s={T.key} />
      </Svg>
      <TeX s={EQ_S15} x={1120} y={140} size={T.eq} o={fout(f, tRes)} />
      <TeX s={String.raw`\rho = \dfrac{p}{R T}`} x={1120} y={380} size={T.calc} o={fin(f, SS(k, 2)) * fout(f, tRes)} />
      <TeX s={EQ_S17} x={1120} y={180} size={96} o={fin(f, tRes)} glow={pulse(f, tProp, 30)} />
      {void tIn}
    </Scene>
  );
};

/// ================================================================ s18 scale height (UF1 U-WB-10/11/12: 3-D column, units on their words, the meaning)
const UFH = UF.H, UFE = UF.e, UFK = UF.per_km, UFS = UF.slabs, UFHV = UF.halving, UFSTD = UF.standard;
/** s18's units line, built piece by piece (stage 0 … 5) with the struck units in gold; every stage has the same layout, so
 * stacked stages line up exactly */
const unitsTeX = (k: number) => {
  const tr = "transparent", ink = C.ink, gold = C.gold;
  const vis = (s: string, on: boolean) => col(on ? ink : tr, s);
  const X = (s: string, on: boolean, struck: boolean) => col(struck ? gold : tr, String.raw`\cancel{${col(on ? ink : tr, s)}}`);
  return [
    vis(String.raw`\dfrac{\mathrm{J}}{\mathrm{kg\,K}}`, k >= 0),
    vis(String.raw`=`, k >= 1), col(k >= 1 ? ink : tr, String.raw`\dfrac{${vis(String.raw`\mathrm{m^2}`, k >= 1)}}{${X(String.raw`\mathrm{s^2}`, k >= 1, k >= 4)}\,${X(String.raw`\mathrm{K}`, k >= 1, k >= 2)}}`), // fix 1: no bar before its units
    vis(String.raw`\times`, k >= 2), X(String.raw`\mathrm{K}`, k >= 2, k >= 2),
    vis(String.raw`\div`, k >= 3), col(k >= 3 ? ink : tr, String.raw`\dfrac{${X(String.raw`\mathrm{m}`, k >= 3, k >= 4)}}{${X(String.raw`\mathrm{s^2}`, k >= 3, k >= 4)}}`),
    vis(String.raw`= \mathrm{m}`, k >= 5),
  ].join(" ");
};
const EQ_S18B = String.raw`H = \dfrac{287 \times 288.15}{9.81} \approx 8.43\ \mathrm{km}`;
/** a small p(z) graph (height up, pressure across) in the maths zone (s18 meaning) */
const MG: Ax = { x: 1180, y: 430, w: 560, h: 300, xr: [0, 1050], yr: [0, 12] };
const S18: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18_scale_height");
  const zk = 0.3; // 0-12 km drawn 3.6 units tall
  const tU = [AT(k, 5, "joules per kilogram per kelvin"), AT(k, 5, "metre squared per second squared"), AT(k, 6, "T in kelvin"), AT(k, 6, "metres per second squared"),
    AT(k, 6, "metres per second squared") + 24, AT(k, 6, "metres: a height")];
  const tG = SS(k, 7), tTan = AT(k, 8, "kept falling at the rate"), tH = AT(k, 8, "exactly H"), tSlow = SS(k, 9), tDeep = SS(k, 10), tWarm = SS(k, 11);
  const o3 = orbitPath([{ f: 0, ...S05_END, az: 20, el: 25, dist: 7.2, target: [0.5, 0.5, 1.7] }, { f: tWarm - 10, az: 32, el: 22, dist: 7.2, target: [0.5, 0.5, 1.7], linear: true },
    { f: tWarm + 40, az: -72, el: 16, dist: 9.5, target: [2.1, 0.5, 1.4] }, { f: LEN(k), az: -66, el: 16, dist: 9.5, target: [2.1, 0.5, 1.4] }], f);
  const { st, pr } = colStage(o3);
  const X = axX(MG), Y = axY(MG);
  const Hk = UFH.H_m / 1000;
  const curve = poly(Array.from({ length: 61 }, (_, i) => { const z = (12 * i) / 60; return [X(1013.25 * Math.exp(-z / Hk)), Y(z)] as Pt; }));
  const tanU = clamp((f - tTan) / Math.max(1, tH - tTan), 0, 1);
  const hC = (UFH.H263_m / 1000) * zk, hW = (UFH.H303_m / 1000) * zk;
  const gO = fin(f, tG);
  return (
    <Scene>
      <View3D st={st} x={COLVB.x} y={COLVB.y} w={COLVB.w} h={COLVB.h}>
        <ColumnFaces zk={zk} top={3.9} dim={1 - 0.6 * fin(f, tWarm)} />
        <Rod3D a={[-0.6, 0, 0]} b={[-0.6, 0, 3.8]} px={4} color={C.first} />
        <Box3D a={[1.7, 0, 0]} b={[2.7, 1, hC]} color={C.local} o={0.45 * fin(f, tWarm)} />
        <BoxEdges3D a={[1.7, 0, 0]} b={[2.7, 1, hC]} color={C.local} px={3} o={fin(f, tWarm)} />
        <Box3D a={[3.2, 0, 0]} b={[4.2, 1, hW]} color={C.second} o={0.4 * fin(f, tWarm + 15)} />
        <BoxEdges3D a={[3.2, 0, 0]} b={[4.2, 1, hW]} color={C.second} px={3} o={fin(f, tWarm + 15)} />
      </View3D>
      <Svg>
        <BaseLabels pr={pr} area={false} o={1 - fin(f, tWarm)} />
        <HeightTicks pr={pr} zk={zk} ticks={[0, 4, 8, 12]} x={-0.6} />
        {(() => { const a = pr.p([2.2, 0.5, 0]), b = pr.p([3.7, 0.5, 0]); return <g opacity={fin(f, tWarm)}>
          <Lbl x={a[0]} y={a[1] + 50} t="colder: smaller H" c={C.local} s={T.floor} a="middle" />
          <Lbl x={b[0] + 30} y={b[1] + 110} t="warmer: bigger H" c={C.second} s={T.floor} a="middle" /></g>; })()}
        <Keyword f={f} text="g, R, T always together" at={[1100, 300]} appear={0} out={AT(k, 1, "the scale height") - 8} s={T.key} targets={[[1440, 180]]} />
        <Keyword f={f} text="scale height" at={[1100, 318]} appear={AT(k, 1, "the scale height")} out={tG} s={T.key} targets={[[1150, 230]]} />
        {/* U-WB-12: the meaning, on a small graph */}
        <g opacity={gO}>
          <Axes A={MG} xt={[0, 1000]} yt={[0, 4, 8, 12]} yl="km" grid={false} />
          <path d={curve} fill="none" stroke={C.local} strokeWidth={6} opacity={0.9} />
          <line x1={X(1013.25)} y1={Y(0)} x2={mix(X(1013.25), X(0), tanU)} y2={mix(Y(0), Y(Hk), tanU)} stroke={C.gold} strokeWidth={5} strokeDasharray="14 10" opacity={fin(f, tTan)} />
          <g opacity={fin(f, tH)}><line x1={MG.x - 14} x2={MG.x + 14} y1={Y(Hk)} y2={Y(Hk)} stroke={C.gold} strokeWidth={6} />
            <Lbl x={MG.x + 26} y={Y(Hk) - 4} t="H" c={C.gold} s={T.key} /></g>
          <Lbl x={X(330)} y={Y(5.5)} t="falls more slowly" c={C.local} s={T.floor} o={fin(f, tSlow)} />
        </g>
        <Keyword f={f} text="H = how deep the air is" at={[1100, 840]} appear={tDeep} s={T.key} />
      </Svg>
      <TeX s={EQ_S17} x={1100} y={130} size={T.calc} o={fout(f, SS(k, 1) - 6)} />
      <TeX s={EQ_S18} x={1100} y={150} size={96} o={fin(f, AT(k, 1, "the scale height"))} />
      <TeX s={String.raw`\dfrac{\partial p}{\partial z} = -\dfrac{p}{H}`} x={1570} y={150} size={T.calc} o={fin(f, AT(k, 2, "much simpler"))} />
      {tU.map((t0, i) => <TeX key={i} s={unitsTeX(i)} x={1100} y={420} size={58} o={fin(f, t0) * fout(f, tG - 8)} />)}
      <Svg><Keyword f={f} text="what kind of quantity?" at={[1100, 400]} appear={SS(k, 3)} out={tU[0] - 6} s={T.key} />
        <line x1={1640} x2={1700} y1={462} y2={462} stroke={C.gold} strokeWidth={5} opacity={fin(f, tU[5]) * fout(f, tG - 8)} /></Svg>
    </Scene>
  );
};
// ================================================================ s18b the scale height in numbers (UF1 U-WB-13, new)
const S18B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s18b_scale_height_number");
  const zk = 0.3, Hk = 8.43;
  const t8 = SS(k, 7), tNow = AT(k, 11, "eight point four three");
  const riseU = easeIO(clamp((f - AT(k, 7, "same density")) / Math.max(1, tNow - AT(k, 7, "same density")), 0, 1));
  const o3 = orbitPath([{ f: 0, az: -66, el: 16, dist: 9.5, target: [2.1, 0.5, 1.4] }, { f: SS(k, 6), az: -66, el: 16, dist: 8.5, target: [1.3, 0.5, 1.5] }, { f: LEN(k), az: -60, el: 18, dist: 8.5, target: [1.3, 0.5, 1.5], linear: true }], f);
  const { st, pr } = colStage(o3);
  const g1 = fout(f, SS(k, 6) - 4, 12); // first block (values and H) gives way to the picture on "Here's a nice way"
  const rows: CalcRow[] = [{ rhs: EQ_S18B, at: SS(k, 5), ul: AT(k, 5, "eight point four three") }];
  const rows2: CalcRow[] = [
    { lhs: "h", rhs: String.raw`= \dfrac{p_0}{\rho_0\, g} = \dfrac{101\,325}{1.225 \times 9.81}`, at: SS(k, 10) },
    { rhs: String.raw`\approx 8.43\ \mathrm{km}`, at: tNow, cont: true, ul: tNow + 10 },
  ];
  const lineA = pr.p([-0.6, 0, Hk * zk]), lineB = pr.p([3.0, 0, Hk * zk]);
  return (
    <Scene>
      <View3D st={st} x={COLVB.x} y={COLVB.y} w={COLVB.w} h={COLVB.h}>
        <ColumnFaces zk={zk} top={3.9} />
        <Rod3D a={[-0.6, 0, 0]} b={[-0.6, 0, 3.8]} px={4} color={C.first} />
        <Plate3D a={[1.6, 0, 0]} b={[2.6, 1, 0]} fill="#3a4766" fo={0.85} edge={C.gold} px={5} o={fin(f, t8 - 20)} />
        <Box3D a={[1.6, 0, 0]} b={[2.6, 1, Math.max(0.01, Hk * zk * riseU)]} color="#7cc4ff" o={0.55 * fin(f, t8)} />
        <BoxEdges3D a={[1.6, 0, 0]} b={[2.6, 1, Math.max(0.01, Hk * zk * riseU)]} color="#7cc4ff" px={3} o={fin(f, t8)} />
      </View3D>
      <Svg>
        <HeightTicks pr={pr} zk={zk} ticks={[0, 4, 8, 12]} x={-0.6} />
        <line x1={lineA[0]} y1={lineA[1]} x2={lineB[0]} y2={lineB[1]} stroke={C.gold} strokeWidth={4} strokeDasharray="14 10" opacity={fin(f, SS(k, 5))} />
        <Lbl x={lineB[0] + 14} y={lineB[1]} t="8.43 km" c={C.gold} s={T.key} o={fin(f, SS(k, 5))} />
        {(() => { const a = pr.p([0.5, -0.1, 0]), b = pr.p([2.1, -0.1, 0]); return <g>
          <Lbl x={a[0]} y={a[1] + 40} t="1 m²" c={C.gold} s={T.floor} a="middle" />
          <Lbl x={b[0]} y={b[1] + 40} t="1 m²" c={C.gold} s={T.floor} a="middle" o={fin(f, t8 - 20)} />
          <Lbl x={a[0]} y={a[1] + 96} t="real air" c={C.key} s={T.floor} a="middle" o={fin(f, t8)} />
          <Lbl x={b[0] + 40} y={b[1] + 96} t="ρ₀ all the way up" c="#7cc4ff" s={T.floor} a="middle" o={fin(f, t8)} /></g>; })()}
        <Keyword f={f} text="how deep is our air?" at={[1100, 110]} appear={SS(k, 0)} out={SS(k, 6) - 4} s={T.key} />
        <Lbl x={1100} y={258} t="gas constant, dry air" c={C.key} s={T.floor} o={fin(f, SS(k, 2)) * g1} />
        <Keyword f={f} text="sea-level density (gas law)" at={[1100, 300]} appear={AT(k, 7, "sea-level density")} s={T.floor} />
        <Keyword f={f} text="same weight" at={[1100, 400]} appear={SS(k, 8)} s={T.key} />
        <Keyword f={f} text="H = height at sea-level density" at={[1080, 840]} appear={SS(k, 12)} s={T.floor} />
        <CurvedLink f={f} from={[1420, 735]} to={[1560, 150]} start={tNow + 20} bend={-120} />
      </Svg>
      <TeX s={String.raw`R = 287\ \mathrm{J\,kg^{-1}\,K^{-1}}`} x={1100} y={200} size={T.calc} o={fin(f, SS(k, 2)) * g1} c={C.key} />
      <TeX s={String.raw`T = 15\ ^\circ\mathrm{C} = 288.15\ \mathrm{K}`} x={1100} y={330} size={T.calc} o={fin(f, SS(k, 3)) * g1} c={TEMP} />
      <TeX s={String.raw`g = 9.81\ \mathrm{m/s^2}`} x={1100} y={420} size={T.calc} o={fin(f, SS(k, 4)) * g1} />
      <CalcStack f={f} x={1100} y={510} rows={tall(rows, 62)} size={62} o={g1} />
      <TeX s={String.raw`H \approx 8.43\ \mathrm{km}`} x={1460} y={110} size={T.calc} c={C.gold} o={fin(f, SS(k, 6))} />
      <TeX s={String.raw`\rho_0 = 1.225\ \mathrm{kg/m^3}`} x={1100} y={220} size={T.calc} o={fin(f, AT(k, 7, "one point two two five"))} />
      <TeX s={String.raw`\rho_0\, g\, h = p_0`} x={1100} y={490} size={T.calc} o={fin(f, SS(k, 9))} />
      <CalcStack f={f} x={1100} y={590} rows={tall(rows2, 56)} size={56} />
    </Scene>
  );
};

// ================================================================ s19 solving for p(z) (UF1 U-WB-14: the assumption, divide, the slope of ln)
/** the ln p inset (lower right of the picture zone): height up 0-30 km, ln p across */
// UF1 fix 1 (review 1 M2, S1): the ln p inset sits where the big graph is (whose empty axes fade while it shows), clear of the CalcStack
const LNG: Ax = { x: 200, y: 260, w: 380, h: 420, xr: [0, 1], yr: [0, 30] };
const LnInset: React.FC<{ f: number; draw: number; o?: number; marks?: number; tri?: number }> = ({ draw, o = 1, marks = 0, tri = 0 }) => {
  if (o <= 0) return null;
  const X = axX(LNG), Y = axY(LNG), zt = 30 * draw;
  const xl = (z: number) => 0.92 - (0.84 * z) / 30;
  return (
    <g opacity={o}>
      <rect x={LNG.x - 70} y={LNG.y - 70} width={LNG.w + 110} height={LNG.h + 150} fill={C.bg} stroke={C.grid} strokeWidth={3} />
      <line x1={LNG.x} y1={LNG.y + LNG.h} x2={LNG.x + LNG.w} y2={LNG.y + LNG.h} stroke={C.muted} strokeWidth={3} />
      <line x1={LNG.x} y1={LNG.y} x2={LNG.x} y2={LNG.y + LNG.h} stroke={C.muted} strokeWidth={3} />
      <Lbl x={LNG.x + LNG.w} y={LNG.y + LNG.h + 40} t="ln p" c={C.muted} s={T.floor} a="end" b={false} />
      <Lbl x={LNG.x - 12} y={LNG.y - 36} t="km" c={C.muted} s={T.floor} a="start" b={false} />
      {draw > 0 ? <line x1={X(xl(0))} y1={Y(0)} x2={X(xl(zt))} y2={Y(zt)} stroke={C.local} strokeWidth={6} /> : null}
      {tri > 0 ? <g opacity={tri}><path d={`M${X(xl(10))} ${Y(10)} L${X(xl(10))} ${Y(16)} L${X(xl(16))} ${Y(16)}`} fill="none" stroke={C.gold} strokeWidth={4} />
        <Lbl x={X(xl(10)) + 16} y={Y(13)} t="1 m → −1/H" c={C.gold} s={T.floor} a="start" /></g> : null}
      {marks > 0 ? <g opacity={marks}><circle cx={X(xl(0))} cy={Y(0)} r={9} fill={C.gold} /><Lbl x={X(xl(0)) - 12} y={Y(0) - 34} t="z = 0, p₀" c={C.gold} s={T.floor} a="end" />
        <circle cx={X(xl(20))} cy={Y(20)} r={9} fill={C.gold} /><Lbl x={X(xl(20)) + 16} y={Y(20) - 30} t="z, p" c={C.gold} s={T.floor} /></g> : null}
    </g>
  );
};
const EQ_S19A = String.raw`\dfrac{\partial \ln p}{\partial z} = -\dfrac{1}{H}`;
const S19: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19_exponential");
  const rows: CalcRow[] = [
    { lhs: String.raw`\dfrac{\partial p}{\partial z}`, rhs: String.raw`= -\dfrac{p}{H}`, at: SS(k, 0) },
    { lhs: String.raw`\dfrac{1}{p}\dfrac{\partial p}{\partial z}`, rhs: String.raw`= -\dfrac{1}{H}`, at: AT(k, 3, "one over p, times") },
    { lhs: String.raw`\dfrac{\partial \ln p}{\partial z}`, rhs: String.raw`= -\dfrac{1}{H}`, at: AT(k, 5, "the left side") },
  ];
  const tLine = SS(k, 6);
  return (
    <Scene>
      <Svg>
        <PGraph upto={0} curveO={0} o={1 - fin(f, SS(k, 4))} />
        <LnInset f={f} draw={clamp((f - tLine) / 60, 0, 1)} o={fin(f, SS(k, 4))} tri={fin(f, AT(k, 6, "one over H"))} />
        <Keyword f={f} text="assume: same T → H fixed" at={[1080, 590]} appear={SS(k, 1)} out={SS(k, 3) - 4} s={T.floor} />
        <Lbl x={1080} y={670} t="a simplification: real T changes" c={C.local} s={T.floor} o={win(f, SS(k, 2), SS(k, 3) - 4)} />
        <Keyword f={f} text="divide by p" at={[1080, 820]} appear={SS(k, 3)} out={SS(k, 4) - 4} s={T.key} />
        <Keyword f={f} text="slope of ln" at={[1080, 820]} appear={SS(k, 4)} out={SS(k, 5) - 4} s={T.key} />
        <Keyword f={f} text="chain rule" at={[1080, 820]} appear={SS(k, 5)} s={T.key} />
      </Svg>
      <TeX s={String.raw`\dfrac{d \ln p}{d p} = \dfrac{1}{p}`} x={1500} y={680} size={T.calc} o={fin(f, AT(k, 4, "the slope of the natural log"))} />
      <TeX s={EQ_S19A} x={-999} y={-999} o={0} />
      <CalcStack f={f} x={1100} y={60} rows={tall(rows, 62).map((r) => ({ ...r, h: 165 }))} size={62} maxLines={3} />
    </Scene>
  );
};
// ================================================================ s19b the integration (UF1 U-WB-14, new)
const S19B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s19b_integrate");
  const tP = AT(k, 7, "p equals"), draw = clamp((f - tP) / 60, 0, 1);
  const rows: CalcRow[] = [
    { lhs: String.raw`\int_{p_0}^{p} \dfrac{dp'}{p'}`, rhs: String.raw`= -\dfrac{1}{H}\int_{0}^{z} dz'`, at: SS(k, 1) },
    { lhs: String.raw`\ln p - \ln p_0`, rhs: String.raw`= -\dfrac{1}{H}\int_{0}^{z} dz'`, at: SS(k, 2), lc: C.gold },
    { lhs: String.raw`\ln p - \ln p_0`, rhs: String.raw`= -\dfrac{z}{H}`, at: SS(k, 3), c: C.gold, lc: C.ink },
    { lhs: String.raw`\ln p - \ln p_0`, rhs: String.raw`= \ln\dfrac{p}{p_0}`, at: SS(k, 4) },
    { rhs: EQ_S19, at: SS(k, 5), size: 84 },
    { lhs: "p", rhs: String.raw`= p_0\, e^{-z/H}`, at: tP, size: 96, ul: tP + 15 },
  ];
  const X = axX(PG), Y = axY(PG);
  return (
    <Scene>
      <Svg>
        {/* UF1 fix 1 (review 1 S1): the maths zone has a keyword from frame 0 */}
        <Keyword f={f} text="add up the small falls" at={[1100, 150]} appear={0} out={SS(K("s19b_integrate"), 1) - 6} s={T.key} />
        <PGraph upto={30 * draw} curveO={1} o={fin(f, tP - 10)} />
        <Lbl x={X(1000)} y={Y(25)} t="p₀ = 1013 hPa" c={C.local} s={T.key} a="end" o={fin(f, tP + 20)} />
        <LnInset f={f} draw={1} o={fout(f, tP - 10)} marks={fin(f, SS(k, 0))} />
        <Keyword f={f} text="add up small steps = integrate" at={[1080, 820]} appear={SS(k, 1)} out={SS(k, 6) - 6} s={T.floor} />
        <Keyword f={f} text="e ≈ 2.72" at={[1080, 820]} appear={AT(k, 6, "two point seven two")} out={SS(k, 8) - 4} s={T.key} />
        <g opacity={win(f, AT(k, 6, "pi turns up"), SS(k, 8) - 4)}><circle cx={1460} cy={815} r={34} fill="none" stroke={C.gold} strokeWidth={4} />
          <line x1={1460} y1={815} x2={1494} y2={815} stroke={C.gold} strokeWidth={4} /><Lbl x={1530} y={815} t="π for circles" c={C.key} s={T.floor} /></g>
        <Keyword f={f} text="same T all the way up" at={[1080, 820]} appear={SS(k, 8)} s={T.key} />
      </Svg>
      <CalcStack f={f} x={1100} y={60} rows={tall(rows, 60).map((r) => ({ ...r, h: r.size === 96 ? 175 : 195 }))} size={60} maxLines={3} />
    </Scene>
  );
};

// ================================================================ s20 what the curve says (UF1 U-WB-15: e^{-1} = 1/e ≈ 0.37)
const EQ_S20N = String.raw`e^{-H/H} = e^{-1} = \dfrac{1}{e} \approx \dfrac{1}{2.72} \approx 0.37`;
const S20: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20_exponential_meaning");
  const X = axX(PG), Y = axY(PG), H = AM.iso.H_km;
  const climb = easeIO(clamp((f - SS(k, 1)) / 60, 0, 1)), zc = H * climb, pc = interp(zc, AM.iso.z_km, AM.iso.p_hPa);
  const t4 = SS(k, 4), pts = [[0, 1013.25, "1013 hPa", AT(k, 4, "one thousand")], [H, UFE.p_H_hPa[0], "373 hPa", AT(k, 4, "three hundred")], [2 * H, UFE.p_H_hPa[1], "137 hPa", AT(k, 4, "one hundred and thirty-seven")]] as [number, number, string, number][];
  return (
    <Scene>
      <Svg>
        <PGraph />
        <g opacity={fin(f, SS(k, 1)) * fout(f, t4)}><circle cx={X(pc)} cy={Y(zc)} r={13} fill={C.gold} />
          <line x1={X(0)} x2={X(pc)} y1={Y(zc)} y2={Y(zc)} stroke={C.gold} strokeDasharray="8 8" strokeWidth={3} />
          <Lbl x={X(0) + 14} y={Y(zc) - 32} t={climb >= 1 ? "z = H = 8.4 km" : ""} c={C.gold} s={T.floor} /></g>
        <Keyword f={f} text="falls to 37 % every 8.4 km" at={[1080, 560]} appear={SS(k, 3)} s={T.key} />
        {pts.map(([z, p, l, t0], i) => <g key={i} opacity={fin(f, t0)}><circle cx={X(p)} cy={Y(z)} r={10} fill={C.gold} />
          <Lbl x={X(p) + 22} y={Y(z) - 30} t={l} c={C.key} s={T.key} /></g>)}
        {[0, 1].map((i) => <g key={`a${i}`} opacity={fin(f, pts[i + 1][3])}>
          <path d={`M${X(pts[i][1]) - 10} ${Y(pts[i][0]) - 14} Q ${X((pts[i][1] + pts[i + 1][1]) / 2) - 120} ${Y((pts[i][0] + pts[i + 1][0]) / 2)} ${X(pts[i + 1][1]) - 14} ${Y(pts[i + 1][0]) + 12}`} fill="none" stroke={C.gold} strokeWidth={4} />
          <Lbl x={X((pts[i][1] + pts[i + 1][1]) / 2) - 140} y={Y((pts[i][0] + pts[i + 1][0]) / 2)} t="× 0.37" c={C.gold} s={T.floor} a="end" /></g>)}
      </Svg>
      <TeX s={EQ_S60} x={1100} y={150} size={T.calc} o={1} />
      <CalcStack f={f} x={1080} y={330} rows={tall([{ rhs: EQ_S20N, at: SS(k, 2), ul: AT(k, 2, "zero point three seven") }], 58)} size={58} />
    </Scene>
  );
};
// ================================================================ s20b eleven percent per kilometre (UF1 U-WB-16, new)
const S20B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20b_per_km");
  const zm = easeIO(clamp(f / 50, 0, 1)); // the zoom: 0-30 km × 0-1050 hPa → 0-2 km × 750-1050 hPa
  const A: Ax = { ...PG, xr: [mix(0, 750, zm), 1050], yr: [0, mix(30, 2, zm)] };
  const X = axX(A), Y = axY(A), Hm = UFH.H_m / 1000;
  const curve = poly(Array.from({ length: 81 }, (_, i) => { const z = (A.yr[1] * i) / 80; return [X(1013.25 * Math.exp(-z / Hm)), Y(z)] as Pt; }));
  const [p0, p1, p2] = UFK.p_hPa as number[];
  const rows: CalcRow[] = [
    { rhs: String.raw`\dfrac{1\ \mathrm{km}}{8.43\ \mathrm{km}} \approx 0.12`, at: SS(k, 2), ul: AT(k, 2, "twelve percent") },
    { rhs: String.raw`1 - e^{-1/8.43} \approx 0.11`, at: SS(k, 3), ul: AT(k, 3, "eleven percent") },
  ];
  const t6 = SS(k, 6), t7 = SS(k, 7);
  const xt = (zm < 0.5 ? [0, 500, 1000] : [800, 900, 1000]).filter((v) => v >= A.xr[0] - 1e-9), yt = (zm < 0.5 ? [0, 10, 20, 30] : [0, 1, 2]).filter((v) => v <= A.yr[1] + 1e-9);
  return (
    <Scene>
      <Svg>
        {/* UF1 fix 1 (review 1 S1): the maths zone has a keyword from frame 0 */}
        <Keyword f={f} text="one kilometre near the ground" at={[1100, 150]} appear={0} out={SS(K("s20b_per_km"), 1) - 6} s={T.key} />
        <defs><clipPath id="s20bc"><rect x={PG.x} y={PG.y - 10} width={PG.w + 20} height={PG.h + 10} /></clipPath></defs>
        <Axes A={A} xt={xt} yt={yt} xl="pressure (hPa)" yl="height (km)" />
        <g clipPath="url(#s20bc)"><path d={curve} fill="none" stroke={C.local} strokeWidth={6} /></g>
        <g opacity={fin(f, SS(k, 4)) * fout(f, t6)}><Bracket p={[X(p0) + 40, Y(0)]} q={[X(p0) + 40, Y(1)]} off={0} c={C.gold} />
          <Lbl x={X(p0) + 70} y={Y(0.5)} t="0 → 1 km" c={C.gold} s={T.floor} /></g>
        <g opacity={fin(f, t6)}>
          <circle cx={X(p0)} cy={Y(0)} r={10} fill={C.gold} /><circle cx={X(p1)} cy={Y(1)} r={10} fill={C.gold} /><circle cx={X(p2)} cy={Y(2)} r={10} fill={C.gold} />
          <Lbl x={X(p1) + 24} y={Y(0.55)} t="1013 → 900 hPa" c={C.key} s={T.floor} o={fin(f, AT(k, 6, "about nine hundred"))} />
          <Lbl x={X(p2) + 24} y={Y(1.55)} t="900 → 800 hPa" c={C.key} s={T.floor} o={fin(f, AT(k, 6, "about eight hundred"))} />
        </g>
        <g opacity={fin(f, t7)}>
          <rect x={1120} y={640} width={(p0 - p1) * 3.2} height={50} fill={C.first} opacity={0.75} /><Lbl x={1130 + (p0 - p1) * 3.2} y={665} t="−113 hPa" c={C.key} s={T.key} o={fin(f, AT(k, 7, "a hundred and thirteen"))} />
          <rect x={1120} y={770} width={(p1 - p2) * 3.2} height={50} fill={C.first} opacity={0.75} /><Lbl x={1130 + (p1 - p2) * 3.2} y={795} t="−101 hPa" c={C.key} s={T.key} o={fin(f, AT(k, 7, "a hundred and one"))} />
          <Lbl x={1120} y={600} t="1st km" c={C.muted} s={T.floor} b={false} /><Lbl x={1120} y={730} t="2nd km" c={C.muted} s={T.floor} b={false} />
        </g>
        <Keyword f={f} text="each metre: takes away p/H" at={[1080, 110]} appear={SS(k, 1)} out={SS(k, 4) - 4} s={T.key} />
        <Keyword f={f} text="p held fixed" at={[1520, 330]} appear={AT(k, 2, "one kilometre divided")} out={SS(k, 4) - 4} s={T.floor} />
        <Keyword f={f} text="p shrinks" at={[1560, 470]} appear={AT(k, 3, "shrinks")} out={SS(k, 4) - 4} s={T.floor} />
        <Keyword f={f} text="11 % of the pressure" at={[1080, 110]} appear={SS(k, 4)} out={t7 - 4} s={T.key} />
        <Lbl x={1080} y={185} t="at the bottom of that kilometre" c={C.key} s={T.floor} o={win(f, SS(k, 5), t7 - 4)} />
        <Keyword f={f} text="same fraction, smaller drops" at={[1080, 110]} appear={t7} s={T.key} />
      </Svg>
      <CalcStack f={f} x={1100} y={260} rows={tall(rows, 60)} size={60} o={fout(f, t7 - 4)} />
    </Scene>
  );
};
const Mattresses: React.FC<{ x: number; y: number; o: number; strike?: number; w?: number }> = ({ x, y, o, strike = 0, w = 300 }) => o <= 0 ? null : (
  <g opacity={o}>
    {[0, 1, 2, 3, 4, 5].map((i) => { const h = 22 + i * 9, yy = y - [0, 22, 53, 93, 142, 200][i]; return <rect key={i} x={x} y={yy - h} width={w} height={h} rx={10} fill="#3a4766" stroke={C.ink} strokeWidth={3} />; })}
    {strike > 0 ? <line x1={x - 20} y1={y + 10} x2={x + w + 20} y2={y - 300} stroke={C.neg} strokeWidth={7} opacity={strike} /> : null}
  </g>
);
// ================================================================ s20c ten slabs of equal mass (UF1 U-WB-17, new; replaces the mattress picture)
const S20C: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20c_equal_slabs");
  const zk = 0.15, tops = [0, ...(UFS.z_top_km as number[])];
  const tApp = SS(k, 1), tEnd1 = SE(k, 1);
  const o3 = orbitPath([{ f: 0, az: -40, el: 16, dist: 9.5, target: [0.5, 0.5, 1.9] }, { f: LEN(k), az: -15, el: 18, dist: 9.5, target: [0.5, 0.5, 1.9], linear: true }], f);
  const { st, pr } = colStage(o3);
  const shown = (i: number) => fin(f, tApp + ((tEnd1 - tApp) * i) / 11, 10);
  const lit = (i: number) => (i === 0 ? fin(f, SS(k, 2)) : i <= 4 ? fin(f, SS(k, 3) + ((SE(k, 3) - SS(k, 3)) * (i - 1)) / 4) : 0);
  // tags "≈ 1000 kg" at slab centres, pushed apart to ≥ 50 px (leader lines)
  const want = tops.slice(0, 9).map((z, i) => pr.p([1.05, 1, ((z + tops[i + 1]) / 2) * zk]));
  const ys = want.map((p) => p[1]);
  for (let i = 1; i < ys.length; i++) if (ys[i] > ys[i - 1] - 50) ys[i] = ys[i - 1] - 50;
  return (
    <Scene>
      <View3D st={st} x={COLVB.x} y={COLVB.y} w={COLVB.w} h={COLVB.h}>
        <Plate3D a={[-0.02, -0.02, 0]} b={[1.02, 1.02, 0]} fill="#3a4766" fo={0.85} edge={C.gold} px={5} />
        <Rod3D a={[-0.6, 0, 0]} b={[-0.6, 0, 25 * zk]} px={4} color={C.first} />
        {tops.slice(0, 9).map((z, i) => <Box3D key={i} a={[0, 0, z * zk]} b={[1, 1, tops[i + 1] * zk]} color={i % 2 ? "#5a9fd8" : "#8fd0ff"} o={0.42 * shown(i)} top={false} bottom={false} />)}
        <Box3D a={[0, 0, tops[9] * zk]} b={[1, 1, 26 * zk]} color="#8fd0ff" o={0.35 * shown(9)} bands={8} fade={1} top={false} bottom={false} />
        {tops.slice(1, 10).map((z, i) => <BoxEdges3D key={i} a={[0, 0, z * zk]} b={[1, 1, z * zk]} color={C.gold} px={lit(i + 1) > 0 ? 6 : 3} o={shown(i + 1)} skipTop vert={0} />)}
        {[0.2, 0.5, 0.8].map((x, i) => <Arrow3D key={i} from={[x, 0.5, 2.2]} to={[x, 0.5, tops[1] * zk + 0.05]} color="#a8743f" px={7} head={26} o={win(f, SS(k, 2), SS(k, 3) + 30)} />)}
      </View3D>
      <Svg>
        {/* UF1 fix 1 (review 1 S1): the maths zone has a keyword from frame 0 */}
        <Keyword f={f} text="why does the curve bend?" at={[1100, 150]} appear={0} out={AT(k, 1, "same amount") - 8} s={T.key} />
        <HeightTicks pr={pr} zk={zk} ticks={[0, 5, 10, 15, 20, 25]} x={-0.6} />
        {want.map((p, i) => <g key={i} opacity={shown(i)}>
          <line x1={p[0]} y1={p[1]} x2={p[0] + 70} y2={ys[i]} stroke={C.muted} strokeWidth={2} />
          <Lbl x={p[0] + 78} y={ys[i]} t="≈ 1000 kg" c={C.key} s={T.floor} b={false} /></g>)}
        {[0, 1, 2, 3, 4].map((i) => { const a = pr.p([-0.05, 0, tops[i] * zk]), b = pr.p([-0.05, 0, tops[i + 1] * zk]); return <g key={i} opacity={lit(i) * fout(f, SS(k, 4))}>
          <Bracket p={[a[0] - 70, a[1]]} q={[b[0] - 70, b[1]]} off={0} c={C.gold} />
          {i === 0 ? <Lbl x={a[0] - 96} y={(a[1] + b[1]) / 2} t="≈ 900 m" c={C.gold} s={T.floor} a="end" /> : null}</g>; })}
        {/* UF1 fix 1 (review 1 S7): the link leaves the label's left end, clear of "no sharp top" */}
        <Keyword f={f} text="ninth top ≈ 19 km" at={[1100, 565]} appear={AT(k, 4, "nineteen")} s={T.key} />
        <CurvedLink f={f} from={[1084, 560]} to={pr.p([0, 0, tops[9] * zk])} start={AT(k, 4, "nineteen") + 8} end={LEN(k)} ctl={[1000, 0]} />
        <Keyword f={f} text="same mass in every slab" at={[1100, 140]} appear={AT(k, 1, "same amount")} s={T.key} />
        <Lbl x={1100} y={230} t="1/10 of the air above 1 m²" c={C.key} s={T.floor} o={fin(f, AT(k, 1, "one tenth"))} />
        <Keyword f={f} text="bottom slab: squeezed most" at={[1100, 340]} appear={SS(k, 2)} s={T.floor} />
        <Keyword f={f} text="higher: less weight above → thicker" at={[1100, 420]} appear={SS(k, 3)} s={T.floor} />
        <Keyword f={f} text="no sharp top" at={[1100, 480]} appear={AT(k, 4, "no sharp top")} s={T.floor} />
        <Mattresses x={1650} y={850} w={200} o={fin(f, SS(k, 5))} strike={0} />
        <Keyword f={f} text="like: foam mattresses" at={[1100, 650]} appear={SS(k, 5)} out={SS(k, 6) - 4} s={T.floor} />
        <Lbl x={1100} y={680} t="unlike:" c={C.local} s={T.floor} o={fin(f, SS(k, 6))} />
        <Lbl x={1100} y={740} t="no separate layers" c={C.local} s={T.floor} o={fin(f, SS(k, 6))} />
        <Lbl x={1100} y={800} t="depends on T" c={C.local} s={T.floor} o={fin(f, AT(k, 6, "temperature"))} />
      </Svg>
    </Scene>
  );
};
// ================================================================ s20d the halving height (UF1 U-WB-18, new)
const EQ_S20D = String.raw`z = H\, \ln\dfrac{p_0}{p}`;
const S20D: React.FC = () => {
  const f = useCurrentFrame(), k = K("s20d_halving");
  const X = axX(PG), Y = axY(PG);
  const rows: CalcRow[] = [
    { rhs: EQ_S19, at: SS(k, 1) },
    { rhs: EQ_S20D, at: AT(k, 2, "so we get"), size: 84, ul: AT(k, 2, "so we get") + 20 },
    { rhs: String.raw`\dfrac{p_0}{p} = 2 \;\Rightarrow\; z = 8.43 \times \ln 2`, at: SS(k, 4) },
    { rhs: String.raw`\ln 2 \approx 0.69`, at: SS(k, 5) },
    { rhs: String.raw`z \approx 8.43 \times 0.69 \approx 5.8\ \mathrm{km}`, at: AT(k, 5, "so z is"), ul: AT(k, 5, "five point eight"), size: 54 },
  ];
  const hv = UFHV;
  return (
    <Scene>
      <Svg>
        {/* UF1 fix 1 (review 1 S1): the maths zone has a keyword from frame 0 */}
        <Keyword f={f} text="where has p halved?" at={[1100, 150]} appear={0} out={SS(K("s20d_halving"), 1) - 6} s={T.key} />
        <PGraph />
        {(hv.z_km as number[]).map((z, i) => <g key={i} opacity={fin(f, AT(k, 6, i ? "eleven point seven" : "at five point eight"))}>
          <line x1={X(0)} x2={X(hv.p_hPa[i])} y1={Y(z)} y2={Y(z)} stroke={C.gold} strokeWidth={3} strokeDasharray="4 8" />
          <line x1={X(hv.p_hPa[i])} x2={X(hv.p_hPa[i])} y1={Y(z)} y2={Y(0)} stroke={C.gold} strokeWidth={3} strokeDasharray="4 8" />
          <circle cx={X(hv.p_hPa[i])} cy={Y(z)} r={10} fill={C.first} />
          <Lbl x={X(hv.p_hPa[i]) + 24} y={Y(z) - 30} t={`${fmt(z, 1)} km: ${i ? "≈ 250" : "≈ 500"} hPa`} c={C.first} s={T.key} /></g>)}
        <Keyword f={f} text="multiply by −H" at={[1080, 820]} appear={AT(k, 1, "multiply both sides")} out={SS(k, 2) - 4} s={T.key} />
        <Keyword f={f} text="height for any pressure" at={[1080, 820]} appear={SS(k, 3)} out={SS(k, 4) - 4} s={T.key} />
      </Svg>
      <TeX s={String.raw`\ln\dfrac{1}{x} = -\ln x`} x={1450} y={730} size={T.calc} o={win(f, SS(k, 2), SS(k, 3) - 4)} />
      <CalcStack f={f} x={1080} y={60} rows={tall(rows, 62)} size={62} maxLines={3} />
    </Scene>
  );
};

// ================================================================ s21 a real balloon over France, in 3-D
const LAT0 = 48.8, LON0 = 2.0, KM = 1 / 100, CSL = Math.cos(LAT0 * D2R) * 111.32 * KM;
const wx = (lon: number) => (lon - LON0) * CSL, wy = (lat: number) => (lat - LAT0) * 111.32 * KM;
const ZEX = 10; // vertical exaggeration of the 3-D column (said in s21: "heights are drawn ten times taller than distances on the map")
const wz = (zkm: number) => zkm * KM * ZEX;
const FrancePlane: React.FC<{ o?: number; tex: THREE.Texture | null }> = ({ o = 1, tex }) => {
  return <MapPlane tex={tex} x0={wx(BOX_TC1101[2])} x1={wx(BOX_TC1101[3])} y0={wy(BOX_TC1101[0])} y1={wy(BOX_TC1101[1])} o={o} />;
};
const S21: React.FC = () => {
  const f = useCurrentFrame(), k = K("s21_balloon_pressure");
  const tLaunch = SS(k, 2), tSonde = AT(k, 2, "radiosonde"), tThis = SS(k, 4), tX10 = SS(k, 5), tLow = SS(k, 6), tHigh = SS(k, 7);
  const keys: OrbitKey[] = [{ f: 0, az: -90, el: 62, dist: 24, target: [0, 0, 0] }, { f: tThis, az: -70, el: 22, dist: 13, target: [0, 0, 1.6] },
    { f: LEN(k), az: -55, el: 18, dist: 12, target: [0, 0, 1.8] }];
  const VB = { x: 80, y: 40, w: 920, h: 820 };
  const st = orbitCam(orbitPath(keys, f), [VB.w / 2, VB.h / 2]);
  const pr = projector(st, VB.w, VB.h, VB.x, VB.y);
  const ftex = useTex(IMG.tc1101);
  const S = SD.trappes, zTop = S.top_km;
  const rise = clamp((f - tThis) / (tLow - tThis + 60), 0, 1), z = mix(S.z_km[0], zTop, rise);
  const v = sndAt(S, z);
  const base = pr.p([0, 0, 0]), at = pr.p([0, 0, wz(z)]);
  const X = axX(PGR), Y = axY(PGR);
  const pts = (S.z_km as number[]).map((zz, i) => [zz, S.p_hPa[i]] as [number, number]).filter(([zz]) => zz <= 30);
  return (
    <Scene>
      <View3D st={st} x={VB.x} y={VB.y} w={VB.w} h={VB.h}>
        <FrancePlane tex={ftex} />
        <Rod3D a={[0, 0, 0]} b={[0, 0, wz(zTop)]} px={3} color={C.gold} o={0.5 * fin(f, tThis)} />
      </View3D>
      <Svg>
        <Place p={base} t="Trappes, near Paris" o={fin(f, tLaunch)} dx={-20} dy={50} a="end" />
        <SondeGlyph x={at[0]} y={at[1] - 4} s={1.3} o={fin(f, tLaunch)} />
        <Keyword f={f} text="radiosonde" at={[120, 120]} appear={tSonde} s={T.key} targets={[[at[0] - 10, at[1] + 30]]} />
        <g opacity={fin(f, tThis)}>
          <Lbl x={at[0] + 40} y={at[1] - 40} t={`${fmt(z, 1)} km`} c={C.key} s={T.key} />
          <Lbl x={at[0] + 40} y={at[1] + 20} t={`${fmt(v.p, 0)} hPa`} c={C.first} s={T.key} />
        </g>
        {/* UF1 U-WB-19: the on-picture date label is replaced by the source line */}
        <Keyword f={f} text="heights × 10" at={[120, 746]} appear={tX10} out={tLow} s={T.key} />
        <SrcLine id="s21_balloon_pressure" w={1100} />
        {/* fix loop 1 (M2): "Does the real atmosphere follow this curve?" — the curve is on screen from frame 0, the balloon's dots join it */}
        <g>
          <Axes A={PGR} xt={[0, 500, 1000]} yt={[0, 10, 20, 30]} xl="hPa" yl="km" />
          <path d={poly((AM.iso.z_km as number[]).map((zz, i) => [zz, AM.iso.p_hPa[i]] as [number, number]).filter(([zz]) => zz <= 30).map(([zz, p]) => [X(p), Y(zz)] as Pt))}
            fill="none" stroke={C.local} strokeWidth={5} />
          <Lbl x={X(330)} y={Y(12)} t="our curve" c={C.local} s={T.key} />
          {pts.map(([zz, p], i) => zz <= z && f >= tThis ? <circle key={i} cx={X(p)} cy={Y(zz)} r={7} fill={C.first} /> : null)}
          <rect x={X(780)} y={Y(3)} width={X(1020) - X(780)} height={Y(0) - Y(3)} fill={C.gold} opacity={0.18 * fin(f, tLow)} />
          <Lbl x={X(400)} y={Y(1.5)} t="close" c={C.gold} s={T.key} o={fin(f, tLow)} />
          <Lbl x={X(250)} y={Y(26)} t="colder → smaller H" c={C.gold} s={T.key} o={fin(f, tHigh)} />
        </g>
      </Svg>
    </Scene>
  );
};
const PGR: Ax = { x: 1200, y: 110, w: 560, h: 600, xr: [0, 1050], yr: [0, 30] };

/// ================================================================ s22 how much air is below (UF1 U-WB-20: 3-D column, the share of the weight)
const EQ_S22N = String.raw`\text{share below} = 1 - \dfrac{p}{p_0}`;
const S22: React.FC = () => {
  const f = useCurrentFrame(), k = K("s22_mass_below");
  const zk = 0.11; // 0-35 km drawn 3.85 units tall
  const std = UFSTD;
  const t1 = SS(k, 1), t2 = SS(k, 2), tStd = AT(k, 3, "standard atmosphere"), t55 = SS(k, 4), t6 = SS(k, 5), t7 = SS(k, 6), t16 = SS(k, 7), t31 = SS(k, 8), tGl = SS(k, 9);
  // the height marker z: a generic 10 km first, then the three standard-atmosphere heights on their words
  const zTo = f < t55 ? 10 : f < t16 ? 5.5 : f < t31 ? 16 : 31, zFrom = f < t55 ? 10 : f < t16 ? 10 : f < t31 ? 5.5 : 16;
  const tSw = f < t55 ? 0 : f < t16 ? t55 : f < t31 ? t16 : t31;
  const zM = mix(zFrom, zTo, easeIO(clamp((f - tSw) / 30, 0, 1)));
  const o3 = orbitPath([{ f: 0, az: -35, el: 18, dist: 8.6, target: [0.5, 0.5, 1.9] }, { f: tGl, az: -10, el: 20, dist: 8.6, target: [0.5, 0.5, 1.9], linear: true }], f);
  const { st, pr } = colStage(o3);
  const cO = fout(f, tGl, 20), gO = fin(f, tGl, 20);
  const g = pr.p([1.2, 0, 0]), gt = pr.p([1.2, 0, 4.0]), zz = pr.p([1.2, 0, zM * zk]), zl = pr.p([-0.6, 0, zM * zk]);
  const cam = globePath([{ f: tGl, lat: 30, lon: -10, dist: 3.8 }, { f: LEN(k), lat: 45, lon: -20, dist: 3.0 }], f);
  const rowsA: CalcRow[] = [{ rhs: String.raw`1 - \dfrac{505}{1013} \approx 0.50`, at: t6, ul: AT(k, 5, "a half is a half") }];
  return (
    <Scene>
      <View3D st={st} x={COLVB.x} y={COLVB.y} w={COLVB.w} h={COLVB.h} o={cO}>
        <ColumnFaces />
        <Rod3D a={[-0.6, 0, 0]} b={[-0.6, 0, 3.9]} px={4} color={C.first} />
        <Box3D a={[0.01, 0.01, 0]} b={[0.99, 0.99, zM * zk]} color={C.first} o={0.5 * fin(f, AT(k, 2, "the share below"))} />
        <BoxEdges3D a={[-0.03, -0.03, zM * zk]} b={[1.03, 1.03, zM * zk]} color={C.first} px={5} o={fin(f, t1)} skipTop vert={0} />
      </View3D>
      <Svg o={cO}>
        <HeightTicks pr={pr} zk={zk} ticks={[0, 10, 20, 30]} x={-0.6} />
        {/* the two weights: the whole column (gold) and the air above z (teal) */}
        <g opacity={fin(f, AT(k, 1, "whole column"))}><Bracket p={[g[0] + 30, g[1]]} q={[gt[0] + 30, gt[1]]} off={0} c={C.gold} />
          <Lbl x={g[0] + 60} y={gt[1] + 40} t="p₀: weight of all the air" c={C.gold} s={T.floor} /></g>
        <g opacity={fin(f, AT(k, 1, "only the air above"))}><Bracket p={[zz[0] + 110, zz[1]]} q={[gt[0] + 110, gt[1]]} off={0} c={C.first} />
          <Lbl x={zz[0] + 140} y={(zz[1] + gt[1]) / 2 + 40} t="p: weight above z" c={C.first} s={T.floor} /></g>
        <Lbl x={zl[0] - 70} y={zl[1]} t="z" c={C.first} s={T.key} a="end" o={fin(f, t1) * (f < t55 ? 1 : 0)} />
        <Lbl x={zl[0] - 70} y={zl[1]} t={`${fmt(zTo, zTo % 1 ? 1 : 0)} km`} c={C.first} s={T.floor} a="end" o={f >= t55 ? 1 : 0} />
        <g opacity={fin(f, t7) * fout(f, t16)}>{(() => { const q = pr.p([-0.6, 0, 5.85 * zk]); return <g><line x1={q[0] - 12} x2={q[0] + 12} y1={q[1]} y2={q[1]} stroke={C.local} strokeWidth={5} />
          <Lbl x={q[0] + 22} y={q[1] - 30} t="our curve 5.8 km" c={C.local} s={T.floor} /></g>; })()}</g>
        {/* QA halves: the maths zone carries the idea from the first words, before the shares are written */}
        <Keyword f={f} text="pressure = weight above" at={[1100, 470]} appear={4} out={tStd - 8} s={T.key} />
        <Keyword f={f} text="standard atmosphere" at={[1100, 470]} appear={tStd} out={t6 - 4} s={T.key} />
        <Lbl x={1100} y={545} t="an average of real measurements" c={C.key} s={T.floor} o={win(f, tStd, t6 - 4)} />
        <Lbl x={1100} y={620} t="5.5 km: p ≈ 505 hPa" c={PRES} s={T.key} o={win(f, AT(k, 4, "five hundred and five"), t7 + 30)} />
        <Lbl x={1100} y={800} t="5.5 km: 50 % below" c={C.key} s={T.key} o={win(f, AT(k, 5, "half of all the air"), t16)} />
        <Lbl x={1100} y={620} t="16 km: 90 % below" c={C.key} s={T.key} o={win(f, t16, tGl)} />
        <Lbl x={1100} y={700} t="1 − 0.10 = 0.90" c={C.ink} s={T.key} o={win(f, AT(k, 7, "nine tenths"), tGl)} />
        <Lbl x={1100} y={790} t="31 km: 99 % below" c={C.key} s={T.key} o={win(f, AT(k, 8, "ninety-nine"), tGl)} />
      </Svg>
      <TeX s={String.raw`\text{share above} = \dfrac{p}{p_0}`} x={1100} y={140} size={60} o={fin(f, AT(k, 2, "share of all the air")) * cO} />
      <TeX s={EQ_S22N} x={1100} y={320} size={T.eq} o={fin(f, AT(k, 2, "the share below")) * cO} />
      <TeX s={EQ_S22} x={-999} y={-999} o={0} />
      <CalcStack f={f} x={1100} y={660} rows={tall(rowsA, 56)} size={56} o={cO * fout(f, t7 + 30)} />
      <Globe cam={cam} shell={SHELL50} o={gO} />
      <Svg><Keyword f={f} text="thin shell" at={[1100, 800]} appear={tGl} s={T.key} /></Svg>
      <Src id="s22_mass_below" i={0} o={fin(f, tStd) * cO} />
      <Src id="s22_mass_below" i={1} o={gO} />
    </Scene>
  );
};

// ================================================================ s23-s25 the temperature profile (full width)
const TG: Ax = { x: 260, y: 80, w: 980, h: 580, xr: [-90, 20], yr: [0, 50] }; // fix 1 (M2): h 660 → 580 so "temperature (°C)" clears the source line
// fix loop 2 (review 2 S4): + 0.01 km, so `top_km` (33.94, rounded) keeps the last point (33.942 km); s23-s25 now end at the same point
const tLine = (S: any, upto: number, A: Ax = TG) => { const X = axX(A), Y = axY(A);
  return poly((S.z_km as number[]).map((z, i) => [z, S.T_C[i]] as [number, number]).filter(([z, T_]) => z <= upto + 0.01 && Number.isFinite(T_)).map(([z, T_]) => [X(T_), Y(z)] as Pt)); };
const TGraph: React.FC<{ f: number; trappesUpto: number; trappesO?: number; extra?: React.ReactNode; A?: Ax }> = ({ trappesUpto, trappesO = 1, extra, A = TG }) => (
  <g>
    <Axes A={A} xt={A.w < 900 ? [-80, -40, 0] : [-80, -60, -40, -20, 0, 20]} yt={[0, 10, 20, 30, 40, 50]} xl="temperature (°C)" yl="height (km)" />
    <path d={tLine(SD.trappes, trappesUpto, A)} fill="none" stroke={C.second} strokeWidth={6} opacity={trappesO} strokeLinejoin="round" />
    {extra}
  </g>
);
const S23: React.FC = () => {
  const f = useCurrentFrame(), k = K("s23_troposphere");
  const X = axX(TG), Y = axY(TG);
  // fix loop 1 (S1): the balloon stops at the last temperature point of the sounding (the line ends there)
  const zT = Math.max(...(SD.trappes.z_km as number[]).filter((_z, i) => Number.isFinite(SD.trappes.T_C[i])));
  const up = zT * clamp((f - 10) / (SE(k, 2) - 10), 0, 1);
  const v = sndAt(SD.trappes, Math.max(SD.trappes.z_km[0], up));
  const fit = SD.trappes, tr = SD.trappes.tropopause;
  // fix loop 1 (S1): the slope triangle sits ON the fitted line between 3 and 4 km (about −10 °C), its "−6.5 °C" label left of the line
  const a: Pt = [X(fit.lapse_fit_intercept_C - fit.lapse_fit_K_per_km * 3), Y(3)], b: Pt = [X(fit.lapse_fit_intercept_C - fit.lapse_fit_K_per_km * 4), Y(4)];
  const tTri = AT(k, 2, "six and a half"), tBand = AT(k, 3, "troposphere"), tWx = SS(k, 4);
  return (
    <Scene>
      <Svg>
        <rect x={TG.x} y={Y(tr.z_km)} width={TG.w} height={Y(0) - Y(tr.z_km)} fill={C.first} opacity={0.14 * fin(f, tBand)} />
        <TGraph f={f} trappesUpto={up} />
        {/* fix loop 1 (S1): the instrument box sits on the data point (the balloon a little above it), parked at the last data point */}
        {/* fix loop 2 (review 2 S4): once at the last data point (33.9 km) the glyph gives way to a parked dot ON that point */}
        <SondeGlyph x={X(v.T)} y={Y(Math.max(0.2, up))} s={0.9} o={fout(f, SE(k, 2), 15)} />
        <circle cx={X(v.T)} cy={Y(up)} r={10} fill="#eef2f8" stroke={C.bg} strokeWidth={3} opacity={fin(f, SE(k, 2), 15)} />
        {/* fix loop 1 (S1): on a 0-50 km axis a 1-km slope triangle is 13 px tall and its labels sat on the line and the "20" tick;
            the rate is now a keyword in the right column with a gold pointer to the fitted line at 3-4 km */}
        <Keyword f={f} text="−6.5 °C per km" at={[1320, Y(21)]} appear={tTri} s={T.key} targets={[[(a[0] + b[0]) / 2 + 8, (a[1] + b[1]) / 2]]} />
        <Keyword f={f} text="troposphere" at={[1320, Y(11.5)]} appear={tBand} s={T.calc} />
        <Lbl x={1320} y={Y(11.5) + 85} t="tropos = turning" c={C.key} s={T.key} o={fin(f, tBand + 15)} />
        <g opacity={fin(f, tWx)}><Cloud x={X(-20)} y={Y(4)} s={0.7} /><Cloud x={X(-45)} y={Y(7)} s={0.55} /></g>
        <SrcLine id="s23_troposphere" w={1700} />
      </Svg>
    </Scene>
  );
};
const S24: React.FC = () => {
  const f = useCurrentFrame(), k = K("s24_stratosphere");
  const X = axX(TG), Y = axY(TG), tr = SD.trappes.tropopause, top = SD.trappes.top_km;
  const col = SD.era5_column_trappes;
  const tStr = AT(k, 3, "stratosphere"), tOz = AT(k, 3, "ozone"), tBurst = SS(k, 4), tAbove = AT(k, 4, "other measurements"), tMeso = SS(k, 5);
  const ext = clamp((f - tAbove) / 60, 0, 1);
  const colPts = (col.z_km as number[]).map((z, i) => [z, col.T_C[i]] as [number, number]).filter(([z]) => z >= top - 1 && z <= top + (47 - top) * ext);
  return (
    <Scene>
      <Svg>
        <rect x={TG.x} y={Y(tr.z_km)} width={TG.w} height={Y(0) - Y(tr.z_km)} fill={C.first} opacity={0.14} />
        <rect x={TG.x} y={Y(50)} width={TG.w} height={Y(tr.z_km) - Y(50)} fill="#5b6fd8" opacity={0.14 * fin(f, tStr)} />
        <TGraph f={f} trappesUpto={top} />
        <g opacity={fin(f, SS(k, 0))}><line x1={TG.x} x2={TG.x + TG.w} y1={Y(tr.z_km)} y2={Y(tr.z_km)} stroke={C.gold} strokeWidth={4} strokeDasharray="14 10" />
          <Lbl x={X(-10)} y={Y(tr.z_km) - 36} t={`tropopause ≈ 11 km, ≈ ${fmt(tr.T_C, 0)} °C`} c={C.gold} s={T.key} /></g>
        <Keyword f={f} text="stratosphere" at={[1320, Y(25)]} appear={tStr} s={T.calc} />
        <g opacity={fin(f, tOz)}><SunGlyph x={X(5)} y={Y(40)} /><line x1={X(-75)} x2={X(-10)} y1={Y(25)} y2={Y(25)} stroke={C.gold} strokeDasharray="4 10" strokeWidth={5} />
          <Lbl x={X(-40)} y={Y(29)} t="ozone absorbs UV" c={C.key} s={T.key} /></g>
        <g opacity={fin(f, tBurst) * fout(f, tBurst + 40)}><circle cx={X(sndAt(SD.trappes, top).T)} cy={Y(top) - 60} r={20 + 30 * clamp((f - tBurst) / 40, 0, 1)} fill="none" stroke="#eef2f8" strokeWidth={5} /></g>
        <SondeGlyph x={X(sndAt(SD.trappes, top).T)} y={Y(top)} s={0.9} o={fout(f, tBurst, 8)} />
        <path d={poly(colPts.map(([z, T_]) => [X(T_), Y(z)] as Pt))} fill="none" stroke={C.local} strokeWidth={5} strokeDasharray="12 10" opacity={fin(f, tAbove)} />
        <Lbl x={X(-22)} y={Y(47)} t="≈ 50 km" c={C.local} s={T.key} o={fin(f, AT(k, 4, "fifty"))} />
        <Lbl x={1320} y={170 - 60} t="thermosphere" c={C.key} s={T.key} o={fin(f, tMeso + 20)} />
        <Lbl x={1320} y={170} t="mesosphere" c={C.key} s={T.key} o={fin(f, tMeso)} />
        <SrcLine id="s24_stratosphere" w={1700} />
      </Svg>
    </Scene>
  );
};
/** zonal-mean temperature on a regular (height, latitude) grid for the s25 cross-section texture */
const zonalTex = (() => {
  let t: THREE.DataTexture | null = null;
  return () => {
    if (t) return t;
    const Z = SD.zonal_tropopause, nl = Z.lat.length, nz = 100;
    const d = new Uint8Array(nl * nz * 4);
    for (let j = 0; j < nz; j++) {
      const z = (j / (nz - 1)) * 45;
      for (let i = 0; i < nl; i++) {
        const zs = (Z.z_zm_km as number[][]).map((row) => row[i]), ts = (Z.t_zm_C as number[][]).map((row) => row[i]);
        const ord = zs.map((zz, q) => [zz, ts[q]]).sort((a, b) => a[0] - b[0]);
        const T_ = interp(z, ord.map((o) => o[0]), ord.map((o) => o[1]));
        const c = lutCss(LUT_THERMAL, (T_ + 85) / 110).match(/\d+/g)!.map(Number), q = 4 * (j * nl + i);
        d[q] = c[0]; d[q + 1] = c[1]; d[q + 2] = c[2]; d[q + 3] = 235;
      }
    }
    t = new THREE.DataTexture(d, nl, nz, THREE.RGBAFormat); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.LinearFilter; t.needsUpdate = true;
    return t;
  };
})();
const ZEX_G = 50; // the cross-section through the globe: heights × 50, as the narration said for the air shell
const fanGeo = (lon0: number) => {
  const pos: number[] = [], uv: number[] = [], idx: number[] = [], nl = 90, nz = 20;
  for (let j = 0; j <= nz; j++) for (let i = 0; i <= nl; i++) {
    const lat = -90 + (180 * i) / nl, r = 1 + ((j / nz) * 45 / 6371) * ZEX_G, la = lat * D2R, lo = lon0 * D2R;
    pos.push(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo)); uv.push(i / nl, j / nz);
  }
  for (let j = 0; j < nz; j++) for (let i = 0; i < nl; i++) { const a = j * (nl + 1) + i; idx.push(a, a + 1, a + nl + 1, a + 1, a + nl + 2, a + nl + 1); }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  return g;
};
const ZonalFan: React.FC<{ lon0: number; o: number }> = ({ lon0, o }) => {
  const geo = React.useMemo(() => fanGeo(lon0), [lon0]);
  const mat = React.useMemo(() => new THREE.MeshBasicMaterial({ map: zonalTex(), transparent: true, side: THREE.DoubleSide, depthWrite: false }), []);
  mat.opacity = o;
  return o <= 0 ? null : <mesh geometry={geo} material={mat} renderOrder={7} />;
};
const S25: React.FC = () => {
  const f = useCurrentFrame(), k = K("s25_tropics");
  // UF1 U-WB-22/23, R2, R4: the chart narrows to the picture zone; the globe moves to the maths zone, grows and flies
  const A: Ax = { x: 200, y: 80, w: 720, h: 580, xr: [-90, 20], yr: [0, 50] }; // fix 1 (M2)
  const X = axX(A), Y = axY(A), sg = SD.singapore, tr = SD.trappes.tropopause;
  const tSg = SS(k, 1), tTr = AT(k, 2, "much higher"), tSgW = AT(k, 1, "Singapore"), tRise = AT(k, 3, "Strong rising currents"), tPole = AT(k, 4, "Near the poles");
  const up = sg.top_km * clamp((f - tSg) / 70, 0, 1);
  const IB = { x: 1020, y: 40, w: 840, h: 560 };
  const Z = SD.zonal_tropopause;
  // UF1 fix 1 (review 1 M4, S9): zoom kept inside the canvas (dist ≥ 2.9); the polar key looks straight across the 0/180°
  // meridian plane (lon 90), so the ×50 zonal-mean section reads as a ring round the limb: high over the equator, low at the poles
  const cam = globePath([{ f: 0, lat: 0, lon: 90, dist: 3.8 }, { f: tSgW, lat: 1.4, lon: 103.8, dist: 2.9 }, { f: tRise, lat: 1.4, lon: 103.8, dist: 2.9 },
    { f: tRise + 40, lat: 15, lon: 70, dist: 3.4 }, { f: tPole, lat: 15, lon: 70, dist: 3.4 }, { f: tPole + 40, lat: 18, lon: 90, dist: 3.1 }, { f: LEN(k), lat: 30, lon: 75, dist: 3.8 }], f);
  return (
    <Scene>
      <Svg>
        <TGraph f={f} A={A} trappesUpto={SD.trappes.top_km} trappesO={0.6} extra={
          <g>
            <path d={tLine(sg, up, A)} fill="none" stroke={C.first} strokeWidth={6} />
            <g opacity={fin(f, tTr)}><line x1={A.x} x2={A.x + A.w} y1={Y(sg.tropopause.z_km)} y2={Y(sg.tropopause.z_km)} stroke={C.first} strokeWidth={4} strokeDasharray="14 10" />
              <Lbl x={X(-86)} y={Y(sg.tropopause.z_km) - 36} t="Singapore ≈ 16 km, below −75 °C" c={C.first} s={T.floor} /></g>
            <line x1={A.x} x2={A.x + A.w} y1={Y(tr.z_km)} y2={Y(tr.z_km)} stroke={C.second} strokeWidth={3} strokeDasharray="10 10" opacity={0.7} />
            <Lbl x={X(-86)} y={Y(tr.z_km) + 64} t="Paris 11 km" c={C.second} s={T.key} />
            <Arrow p={[X(12), Y(tr.z_km)]} q={[X(12), Y(sg.tropopause.z_km)]} color={C.gold} w={6} head={24} o={fin(f, tTr + 20)} />
          </g>} />
        <SrcLine id="s25_tropics" i={0} w={900} />
      </Svg>
      <Globe cam={cam} box={IB} canvas={{ x: 960, y: 0, w: 960, h: 1080, fadeY: 600 }} o={fin(f, 0)} img={IMG.bmng} coast={0.3}
        under3d={<><ZonalFan lon0={0} o={0.95} /><ZonalFan lon0={180} o={0.95} /></>}
        over={(G) => {
          const pts = (Z.lat as number[]).map((la, i) => G.pw(G.w(la, 0, 1 + (Z.z_km[i] / 6371) * ZEX_G)));
          const pts2 = (Z.lat as number[]).map((la, i) => G.pw(G.w(la, 180, 1 + (Z.z_km[i] / 6371) * ZEX_G)));
          const q = (la: number, lo = 0) => G.pw(G.w(la, lo, 1 + ((interp(la, Z.lat, Z.z_km) + 4) / 6371) * ZEX_G));
          const s = G.p(1.4, 103.8), pole = G.pw(G.w(80, 0, 1 + ((interp(80, Z.lat, Z.z_km) / 2) / 6371) * ZEX_G));
          return <g>
            <path d={poly(pts)} fill="none" stroke={C.gold} strokeWidth={4} /><path d={poly(pts2)} fill="none" stroke={C.gold} strokeWidth={4} />
            {G.vis(1.4, 103.8) ? <g opacity={win(f, tSgW, tRise + 30)}><circle cx={s[0]} cy={s[1]} r={34} fill="none" stroke={C.gold} strokeWidth={5} />
              <Lbl x={s[0] + 44} y={s[1] + 40} t="Singapore" c={C.key} s={T.floor} /></g> : null}
            <Lbl x={q(0, 180)[0] - 20} y={q(0, 180)[1] - 40} t="≈ 16 km" c={C.key} s={T.floor} a="end" o={fin(f, tRise)} />
            <g opacity={fin(f, tPole)}><circle cx={pole[0]} cy={pole[1]} r={30} fill="none" stroke={C.gold} strokeWidth={5} />
              <Lbl x={pole[0] + 40} y={pole[1] < 90 ? pole[1] + 50 : pole[1] - 30} t="≈ 8 km" c={C.key} s={T.floor} /></g>
          </g>;
        }} />
      <Svg>
        <ColourBar x={1120} y={672} w={520} lut={LUT_THERMAL} lo={-85} hi={25} ticks={[{ v: -80, t: "−80" }, { v: -40, t: "−40" }, { v: 0, t: "0" }, { v: 20, t: "20" }]} unit="°C" title="temperature, Nov 2023 mean" />
      </Svg>
      <Src id="s25_tropics" i={1} x={1060} w={780} y={848} />
    </Scene>
  );
};

/// ================================================================ s26 why it is cold aloft (UF1 U-WB-24/25: a real day in 3-D)
/** the 24 Jun 2024 plate (MODIS Terra 10:20 UTC → Aqua 13:20 UTC, 47-49.5N 0-4E), world unit 10 km, heights ×20 (said) */
const CU_LAT0 = 48.25, CU_LON0 = 2.0, CUX = Math.cos(48.25 * D2R) * 11.132, CUY = 11.132, CUZ = 2; // CUZ: units per km (×20)
const cux = (lon: number) => (lon - CU_LON0) * CUX, cuy = (lat: number) => (lat - CU_LAT0) * CUY;
const warmCool = (Tc: number, hi = 25, lo = 11.3) => { const t = clamp((hi - Tc) / (hi - lo), 0, 1); const a = [0xe0, 0x60, 0x3a], b = [0x6f, 0x8f, 0xd8];
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`; };
const S26: React.FC = () => {
  const f = useCurrentFrame(), k = K("s26_why_cold_aloft");
  const P26 = UF.s26_parcel, SN = UF.s26_sounding;
  const tGl = AT(k, 1, "warms the ground first"), tPan = SS(k, 2), tReal = AT(k, 3, "a real sunny morning"), tTh = SS(k, 5), tRise = SS(k, 6);
  const tLow = AT(k, 6, "lower pressure"), tExp = AT(k, 6, "expands"), tCool = AT(k, 7, "it cools"), t10 = AT(k, 7, "almost ten degrees");
  const tBal = AT(k, 8, "A weather balloon"), tAft = AT(k, 9, "the early afternoon"), tEndR = SE(k, 7);
  const ttex = useTex(IMG.terra), atex = useTex(IMG.cumulus);
  const x0 = cux(BOX_CU[2]), x1 = cux(BOX_CU[3]), y0 = cuy(BOX_CU[0]), y1 = cuy(BOX_CU[1]);
  // the hero parcel rises 0 → 1.4 km over S7-S8, along a gently drifting path; T and size from dry_parcel_ascent
  const u = easeIO(clamp((f - tRise) / Math.max(1, tEndR - tRise), 0, 1));
  const zi = u * ((P26.z_m as number[]).length - 1), j0 = Math.min(P26.z_m.length - 2, Math.floor(zi)), wj = zi - j0;
  const Tp = P26.T_C[j0] + (P26.T_C[j0 + 1] - P26.T_C[j0]) * wj, rD = P26.r_drawn[j0] + (P26.r_drawn[j0 + 1] - P26.r_drawn[j0]) * wj;
  const zkm = (P26.z_m[j0] + (P26.z_m[j0 + 1] - P26.z_m[j0]) * wj) / 1000;
  const r0 = 0.55, hp: V3 = [-3 + 1.2 * u, -2 + 0.8 * u, zkm * CUZ + r0 * rD];
  const cond = fin(f, tAft, 30);
  const tx = cux(SN.lon), ty = cuy(SN.lat);
  // camera: the whole plate (S1-S5) → close on the hero parcel (S6-S8) → the parcel and the Trappes rod (S9) → back (S10-S11)
  const keys: OrbitKey[] = [{ f: 0, az: -112, el: 34, dist: 36, target: [0, 1, 0] }, { f: tTh, az: -105, el: 30, dist: 32, target: [0, 0, 0] },
    { f: tRise, az: -100, el: 26, dist: 18, target: [-2.6, -1.6, 1.4] }, { f: tEndR, az: -92, el: 26, dist: 17, target: [-2.0, -1.2, 2.2] },
    { f: tBal + 20, az: -86, el: 24, dist: 22, target: [-1.0, 2.0, 1.6] }, { f: SE(k, 8), az: -84, el: 24, dist: 22, target: [-1.0, 2.0, 1.6] },
    { f: LEN(k), az: -78, el: 34, dist: 40, target: [0, 0, 0.5] }];
  const VB = { x: 80, y: 40, w: 980, h: 820 };
  const st = orbitCam(orbitPath(keys, f), [VB.w / 2, VB.h / 2]);
  const pr = projector(st, VB.w, VB.h, VB.x, VB.y);
  const shafts = [[-8, -6], [-3, 4], [2, -5], [6, 3], [9, -9], [-10, 6]];
  const therm = [[-7, -4], [4, 5], [7, -6], [-5, 7], [10, 1], [1, -9]].map(([x, y], i) => { const v = clamp((f - tTh - i * 8) / 160, 0, 1); return { x: x + v, y, z: 0.3 + 3.2 * easeIO(v), o: fin(f, tTh + i * 8) * (1 - 0.6 * v) }; });
  const zs = SN.z_m as number[], Ts = SN.T_C as number[];
  const rodTop = pr.p([tx, ty, (zs.filter((z) => z <= 1600).slice(-1)[0] / 1000) * CUZ]);
  const bA = pr.p([tx + 0.5, ty, SN.bracket_km[0] * CUZ]), bB = pr.p([tx + 0.5, ty, SN.bracket_km[1] * CUZ]);
  return (
    <Scene>
      <View3D st={st} x={VB.x} y={VB.y} w={VB.w} h={VB.h} amb={1.3} dir={1.3}>
        <MapPlane tex={ttex} x0={x0} x1={x1} y0={y0} y1={y1} o={1} dim={1 + 0.22 * fin(f, tGl, 30) * (1 - cond)} />
        <MapPlane tex={atex} x0={x0} x1={x1} y0={y0} y1={y1} z={0.01} o={cond} />
        {shafts.map(([x, y], i) => <Quad3D key={i} pts={[[x - 4, y + 3, 16], [x - 3.4, y + 3, 16], [x + 0.3, y, 0.05], [x - 0.3, y, 0.05]]} color={C.gold} o={0.22 * fin(f, SS(k, 1) + i * 5) * fout(f, tTh, 30)} />)}
        <Box3D a={[x0, y0, 0.02]} b={[x1, y1, 0.3]} color={C.second} o={0.16 * fin(f, tPan, 30) * fout(f, tRise, 30)} top bottom={false} />
        {therm.map((p, i) => <Sphere3D key={i} at={[p.x, p.y, p.z]} r={0.38} color="#f2c9a8" o={0.45 * p.o * fout(f, tRise, 20)} />)}
        <Sphere3D at={hp} r={r0 * rD} color={cond > 0 ? "#eef2f8" : warmCool(Tp)} o={0.68 * fin(f, tRise - 10)} />
        {cond > 0 ? <Sphere3D at={[hp[0], hp[1], hp[2] + r0 * rD * 0.7]} r={r0 * rD * 0.75} color="#ffffff" o={0.55 * cond} /> : null}
        {zs.slice(0, -1).map((z, i) => z / 1000 <= 1.6 ? <Rod3D key={i} a={[tx, ty, (z / 1000) * CUZ]} b={[tx, ty, (zs[i + 1] / 1000) * CUZ]} px={11} color={warmCool(Ts[i], 25, 9.8)} o={fin(f, tBal)} /> : null)}
      </View3D>
      <Svg>
        <SondeGlyph x={rodTop[0]} y={rodTop[1] - 8} s={1.1} o={fin(f, tBal)} />
        <g opacity={fin(f, tBal + 20)}><Bracket p={[bA[0] + 18, bA[1]]} q={[bB[0] + 18, bB[1]]} off={0} c={C.gold} />
          <Lbl x={bA[0] + 50} y={(bA[1] + bB[1]) / 2} t="−10 °C per km" c={C.gold} s={T.key} /></g>
        <Lbl x={rodTop[0]} y={rodTop[1] - 160} t="Trappes, 12 UTC" c={C.key} s={T.floor} a="middle" o={fin(f, tBal)} />
        {/* maths zone: the reasons, each on its words */}
        <Lbl x={1100} y={110} t="higher, yet colder?" c={C.key} s={T.key} o={win(f, AT(k, 0, "colder"), tGl - 8, 8)} />
        <Lbl x={1100} y={110} t="sun warms the ground first" c={C.key} s={T.key} o={fin(f, tGl) * fout(f, tReal - 8)} />
        <g opacity={fin(f, tPan) * fout(f, tReal - 8)}>
          <path d="M1130 300 L1330 300 L1310 350 L1150 350 Z" fill="#3a4766" stroke={C.ink} strokeWidth={4} /><line x1={1330} y1={310} x2={1420} y2={300} stroke={C.ink} strokeWidth={6} />
          {[0, 1, 2].map((i) => <path key={i} d={`M${1180 + i * 50} 280 q 10 -20 0 -40 q -10 -20 0 -40`} fill="none" stroke="#7cc4ff" strokeWidth={4} />)}
          {[0, 1, 2, 3].map((i) => <path key={`f${i}`} d={`M${1170 + i * 45} 395 l 15 -35 l 15 35 Z`} fill={C.second} />)}
          <Keyword f={f} text="heated from below" at={[1100, 470]} appear={tPan} s={T.key} />
        </g>
        <Keyword f={f} text="24 June 2024, morning" at={[1100, 110]} appear={tReal} out={tAft - 8} s={T.key} />
        <Keyword f={f} text="thermals" at={[1100, 200]} appear={AT(k, 5, "thermals")} out={tRise} s={T.key} />
        <Keyword f={f} text="lower pressure" at={[1100, 250]} appear={tLow} s={T.key} />
        <Keyword f={f} text="expands" at={[1100, 340]} appear={tExp} s={T.key} />
        <Keyword f={f} text="cools" at={[1450, 340]} appear={tCool} s={T.key} />
        <Lbl x={1100} y={440} t="≈ 10 °C per km" c={C.local} s={T.calc} o={fin(f, t10)} />
        <g opacity={fin(f, tRise) * fout(f, tAft)}>
          <defs><linearGradient id="wc26" x1={0} x2={1} y1={0} y2={0}><stop offset="0" stopColor="#e0603a" /><stop offset="1" stopColor="#6f8fd8" /></linearGradient></defs>
          <rect x={1100} y={560} width={300} height={26} fill="url(#wc26)" />
          <Lbl x={1100} y={625} t="warmer" c={C.key} s={T.floor} /><Lbl x={1400} y={625} t="cooler" c={C.key} s={T.floor} a="end" />
        </g>
        <Keyword f={f} text="clouds form" at={[1100, 560]} appear={tAft + 10} s={T.key} />
      </Svg>
      <Src id="s26_why_cold_aloft" i={0} o={fout(f, tBal - 6, 8)} w={960} />
      <Src id="s26_why_cold_aloft" i={1} o={fin(f, tBal) * fout(f, tAft - 6, 8)} w={960} />
      <Src id="s26_why_cold_aloft" i={2} o={fin(f, tAft)} w={960} />
    </Scene>
  );
};

// ================================================================ s27 water vapour on the globe (UF1 U-WB-26/27/28: cloud-free spin, colour bar)
const S27: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27_vapour");
  const g = useGlobal();
  const qTex = useFieldTex(g?.q2m, GNY, GNX, LUT_HALINE, 0, 20, 1, true);
  const tQ = AT(k, 3, "specific humidity"), tE = SS(k, 5), tCl = AT(k, 2, "Clouds and fog"), tPol = AT(k, 4, "cold polar air"), tTrop = AT(k, 4, "tropical air");
  // R4: spin east along the equator, change direction towards the pole, hold over the Arctic, fly to the tropics (= s27b's first camera)
  const cam = globePath([{ f: 0, lat: 10, lon: -60, dist: 3.8 }, { f: SE(k, 1), lat: 10, lon: 0, dist: 3.8 }, { f: tCl + 70, lat: 70, lon: -20, dist: 3.4 },
    { f: tPol + 20, lat: 70, lon: -20, dist: 3.4 }, { f: tTrop + 30, lat: 8, lon: -35, dist: 3.4 }], f);
  return (
    <Scene>
      <Globe cam={cam} img={IMG.bmng} field={qTex} fieldO={0.8 * fin(f, tQ, 20)} coast={0.5} />
      <Svg>
        <g opacity={fin(f, SS(k, 1)) * fout(f, tQ)}>
          {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={1120 + rnd(i) * 300} cy={150 + rnd(i * 5) * 250} r={6} fill="#7cc4ff" opacity={0.35} />)}
          <Lbl x={1250} y={460} t="vapour: invisible" c={C.key} s={T.key} a="middle" />
        </g>
        <g opacity={fin(f, SS(k, 2)) * fout(f, tQ)}>
          <Cloud x={1660} y={300} s={1.3} />
          <Lbl x={1660} y={530} t="cloud: drops" c={C.key} s={T.key} a="middle" />
        </g>
        <Keyword f={f} text="specific humidity" at={[1100, 140]} appear={tQ} s={T.key} />
        <Lbl x={1100} y={440} t="cold polar air: ≈ 0" c={C.key} s={T.key} o={fin(f, tPol)} />
        <Lbl x={1100} y={515} t="warm tropical air: ≈ 20 g/kg" c={C.key} s={T.key} o={fin(f, AT(k, 4, "twenty grams"))} />
        <ColourBar x={1120} y={720} w={560} lut={LUT_HALINE} lo={0} hi={20} ticks={[{ v: 0, t: "0" }, { v: 10, t: "10" }, { v: 20, t: "20" }]} unit="g/kg" o={fin(f, tQ)} title="specific humidity, 2 m up" />
        <Keyword f={f} text="vapour pressure" at={[1100, 600]} appear={tE} s={T.key} />
      </Svg>
      <TeX s={String.raw`q = \dfrac{\text{g of vapour}}{\text{kg of air}}`} x={1100} y={290} size={T.calc} o={fin(f, tQ)} />
      <Src id="s27_vapour" i={0} o={fout(f, tQ, 10)} />
      <Src id="s27_vapour" i={1} o={fin(f, tQ, 10)} />
    </Scene>
  );
};
// ================================================================ s27b vapour pressure from specific humidity (UF1 U-WB-29, new)
const EQ_S27B = String.raw`e \approx 1.61\, q\, p`;
const S27B: React.FC = () => {
  const f = useCurrentFrame(), k = K("s27b_vapour_pressure");
  const g = useGlobal();
  const qTex = useFieldTex(g?.q2m, GNY, GNX, LUT_HALINE, 0, 20, 1, true);
  const QM = UF.vapour.qmax;
  const cam = globePath([{ f: 0, lat: 8, lon: -35, dist: 3.4 }, { f: SS(k, 9), lat: QM.lat, lon: QM.lon, dist: 3.0 }], f);
  const parts: Part[] = [
    { t: "e", c: C.first, u: { w: String.raw`\text{vapour pressure}`, c: C.gold } }, { t: String.raw`\approx 1.61` },
    { t: "q", c: "#7cc4ff", u: { w: String.raw`\begin{array}{c}\text{kg of vapour}\\ \text{per kg of air}\end{array}`, c: C.gold } },
    { t: "p", c: PRES, u: { w: String.raw`\text{air pressure}`, c: C.gold } },
  ];
  const tB = SS(k, 4), tC = SS(k, 9);
  const boxO = fin(f, tB) * fout(f, tC - 6, 12);
  const dots = (x: number, n: number, c: string, seed: number) => Array.from({ length: n }, (_, i) => <circle key={i} cx={x + 14 + rnd(i * 3 + seed) * 232} cy={422 + rnd(i * 7 + seed) * 166} r={5.5} fill={c} />);
  const rows: CalcRow[] = [
    { rhs: String.raw`q = 20\ \mathrm{g/kg} = 0.020`, at: AT(k, 9, "q is twenty") },
    { rhs: String.raw`p \approx 1000\ \mathrm{hPa}`, at: AT(k, 9, "and p is about") },
    { rhs: String.raw`e \approx 1.61 \times 0.020 \times 1000 \approx 32\ \mathrm{hPa}`, at: SS(k, 10), ul: AT(k, 10, "thirty-two") },
  ];
  return (
    <Scene>
      <Globe cam={cam} img={IMG.bmng} field={qTex} fieldO={0.8} coast={0.5} over={(G) => {
        if (!G.vis(QM.lat, QM.lon)) return null;
        const c = G.p(QM.lat, QM.lon);
        return <g opacity={fin(f, SS(k, 9))}><circle cx={c[0]} cy={c[1]} r={46} fill="none" stroke={C.gold} strokeWidth={5} />
          <Lbl x={c[0]} y={c[1] - 74} t="q ≈ 20 g/kg" c={C.key} s={T.key} a="middle" /></g>;
      }} />
      <Svg>
        <ColourBar x={120} y={120} w={420} lut={LUT_HALINE} lo={0} hi={20} ticks={[{ v: 0, t: "0" }, { v: 10, t: "10" }, { v: 20, t: "20" }]} unit="g/kg" title="specific humidity" />
        <Keyword f={f} text="this e: vapour pressure, not 2.72" at={[1100, 450]} appear={SS(k, 3)} out={tB - 4} s={T.floor} c={C.local} />
        <g opacity={boxO}>
          <rect x={1100} y={410} width={260} height={190} fill="#1b2540" stroke={C.muted} strokeWidth={4} />{dots(1100, 100, C.first, 3)}
          <rect x={1480} y={410} width={260} height={190} fill="#1b2540" stroke={C.muted} strokeWidth={4} />{dots(1480, UF.vapour.dots[1], "#8fa8e8", 11)}
          <Lbl x={1230} y={642} t="1 kg of air" c={C.first} s={T.floor} a="middle" /><Lbl x={1610} y={642} t="1 kg of vapour" c="#8fa8e8" s={T.floor} a="middle" />
          <Lbl x={1230} y={692} t="29 each" c={C.key} s={T.floor} a="middle" o={fin(f, SS(k, 6))} /><Lbl x={1610} y={692} t="18 each" c={C.key} s={T.floor} a="middle" o={fin(f, SS(k, 6))} />
        </g>
        <Keyword f={f} text="molecule share = 1.61 × mass share" at={[1080, 840]} appear={SS(k, 8)} out={tC - 6} s={T.floor} />
        <Keyword f={f} text="out of ≈ 1000 hPa" at={[1100, 760]} appear={AT(k, 10, "out of about")} s={T.key} />
      </Svg>
      <TeX s={EQ_S27B} x={1100} y={150} size={T.eq} o={fin(f, SS(k, 1))} />
      <Svg>
        <Keyword f={f} text="e: vapour pressure" at={[1100, 265]} appear={AT(k, 2, "the vapour pressure")} s={T.floor} c={C.first} />
        <Keyword f={f} text="q: kg of vapour per kg of air" at={[1100, 320]} appear={AT(k, 2, "the specific humidity")} s={T.floor} c="#7cc4ff" />
        <Keyword f={f} text="p: air pressure" at={[1100, 375]} appear={AT(k, 2, "the air pressure")} s={T.floor} c={PRES} />
      </Svg>

      <TeX s={String.raw`29 \div 18 \approx 1.61`} x={1100} y={748} size={T.calc} o={win(f, SS(k, 7), tC - 6)} />
      <CalcStack f={f} x={1100} y={420} rows={tall(rows, 50)} size={50} />
      <Src id="s27b_vapour_pressure" />
    </Scene>
  );
};

// ================================================================ s28-s30 the saturation curve (picture zone graph)
const EG: Ax = { x: 230, y: 90, w: 700, h: 620, xr: [-10, 35], yr: [0, 50] };
const ES = MO.es_curve;
const esAt = (Tc: number) => interp(Tc, ES.T_C, ES.es_hPa);
const TdAt = (e: number) => interp(e, ES.es_hPa, ES.T_C);
// fix loop 1 (S4): s29 now says "cools to eighteen degrees … about seventy-three percent" — the data must agree
if (Math.round((15 / esAt(18)) * 100) !== 73) throw new Error(`CHECK s29: RH at 18 °C is ${(15 / esAt(18)) * 100} %, not ≈ 73 %`);
const EGraph: React.FC<{ o?: number; draw?: number }> = ({ o = 1, draw = 1 }) => {
  const X = axX(EG), Y = axY(EG);
  const n = Math.max(2, Math.round(ES.T_C.length * draw));
  return (
    <g opacity={o}>
      <Axes A={EG} xt={[-10, 0, 10, 20, 30]} yt={[10, 20, 30, 40, 50]} xl="temperature (°C)" yl="vapour pressure (hPa)" />
      <path d={poly((ES.T_C as number[]).slice(0, n).map((t, i) => [X(t), Y(ES.es_hPa[i])] as Pt))} fill="none" stroke={C.gold} strokeWidth={6} />
    </g>
  );
};
const S28: React.FC = () => {
  const f = useCurrentFrame(), k = K("s28_saturation");
  const X = axX(EG), Y = axY(EG);
  const t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const words = ["about six", "twelve at ten", "twenty-three", "forty-two"], labs = ["6 hPa", "12 hPa", "23 hPa", "42 hPa"];
  const sat = fin(f, SS(k, 2));
  return (
    <Scene>
      <Svg>
        <g opacity={fout(f, t3)}>
          <rect x={160} y={600} width={760} height={160} fill="#1f4f7a" />
          {Array.from({ length: 16 }, (_, i) => { const ph = ((f + i * 23) % 90) / 90, up = i % 2 === 0; const y = up ? 600 - ph * 380 : 220 + ph * 380;
            return <g key={i}><circle cx={190 + i * 46} cy={y} r={9} fill="#7cc4ff" /><Arrow p={[190 + i * 46, y + (up ? 30 : -30)]} q={[190 + i * 46, y + (up ? -10 : 10)]} color={up ? C.second : C.first} w={4} head={14} halo={false} /></g>; })}
          <Lbl x={540} y={140} t="leaving = landing" c={C.key} s={T.key} a="middle" o={sat} />
          <Keyword f={f} text="saturated" at={[540, 820]} a="middle" appear={SS(k, 2)} s={T.key} />
        </g>
        {/* fix loop 1 (M2): the maths zone carries the arrow legend and the name from S0 on, before the graph's numbers */}
        <g opacity={win(f, AT(k, 0, "leave the water"), t3)}>
          <Arrow p={[1110, 330]} q={[1110, 250]} color={C.second} w={6} head={22} /><Lbl x={1150} y={290} t="leaving" c={C.second} s={T.key} />
          <Arrow p={[1440, 250]} q={[1440, 330]} color={C.first} w={6} head={22} /><Lbl x={1480} y={290} t="landing" c={C.first} s={T.key} />
        </g>
        <Lbl x={1100} y={420} t="warmer water: more escape" c={C.key} s={T.key} o={win(f, SS(k, 1), t3)} />
        <Keyword f={f} text="saturation vapour pressure" at={[1080, 150]} appear={AT(k, 2, "saturation vapour")} s={T.key} />
        <EGraph o={fin(f, t3)} draw={clamp((f - t3) / 40, 0, 1)} />
        {(MO.es_points.T_C as number[]).map((t, i) => <g key={i} opacity={fin(f, AT(k, 3, words[i]))}><circle cx={X(t)} cy={Y(MO.es_points.es_hPa[i])} r={10} fill={C.gold} />
          <Lbl x={X(t) - 18} y={Y(MO.es_points.es_hPa[i]) - 36} t={labs[i]} c={C.key} s={T.key} a="end" /></g>)}
        <Lbl x={1100} y={300} t="× 2 per 10 °C" c={C.gold} s={T.calc} o={fin(f, t4)} />
        <Lbl x={1100} y={500} t="like a sponge" c={C.key} s={T.key} o={fin(f, t5)} />
        <line x1={1090} y1={520} x2={1420} y2={480} stroke={C.neg} strokeWidth={6} opacity={fin(f, t6)} />
        <Lbl x={1080} y={620} t="set by temperature, not the air" c={C.key} s={T.floor} o={fin(f, t6)} />
      </Svg>
    </Scene>
  );
};
const S29: React.FC = () => {
  const f = useCurrentFrame(), k = K("s29_relative_humidity");
  const X = axX(EG), Y = axY(EG);
  const t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t6 = SS(k, 6);
  // fix loop 1 (S4): the cooling to 18 °C runs on "eighteen degrees" and the RH readout comes on "rises", landing on 73 % as said
  const tCool = AT(k, 6, "eighteen"), Tn = mix(25, 18, easeIO(clamp((f - tCool) / 70, 0, 1))), rh = (15 / esAt(Tn)) * 100;
  const rows: CalcRow[] = [
    { rhs: String.raw`15 \div 31.3 \approx 0.48`, at: t4 },
    { lhs: "RH", rhs: String.raw`\approx 48\,\%`, at: AT(k, 4, "so the relative"), ul: AT(k, 4, "forty-eight") },
  ];
  return (
    <Scene>
      <Svg>
        <EGraph />
        <g opacity={fin(f, t2)}><circle cx={X(Tn)} cy={Y(15)} r={13} fill={C.first} /><Lbl x={X(Tn) + 24} y={Y(15) + 36} t="our air" c={C.first} s={T.key} /></g>
        <g opacity={fin(f, t3) * fout(f, t6)}><circle cx={X(25)} cy={Y(esAt(25))} r={11} fill={C.gold} /><Lbl x={X(25) - 20} y={Y(esAt(25)) - 36} t="31.3 hPa" c={C.gold} s={T.key} a="end" />
          <line x1={X(25) + 26} x2={X(25) + 26} y1={Y(15)} y2={Y(esAt(25))} stroke={C.gold} strokeWidth={5} /></g>
        <Lbl x={1100} y={720} t={`RH ${fmt(rh, 0)} %`} c={C.first} s={T.calc} o={fin(f, AT(k, 6, "rises"))} />
      </Svg>
      {/* fix loop 1 (S2): the definition at 58 px with the denominator on two lines (it was 44 px on one line) */}
      <TeX s={EQ_S29} x={-999} y={-999} o={0} />
      <TeX s={EQ_S29_SHOWN} x={1000} y={190} size={58} o={fin(f, SS(k, 1))} />
      <Svg><Keyword f={f} text="relative humidity" at={[1000, 190]} appear={AT(k, 0, "Relative humidity")} out={SS(k, 1) - 10} s={T.calc} /></Svg>
      <CalcStack f={f} x={1300} y={360} rows={tall(rows, T.calc)} size={T.calc} />
    </Scene>
  );
};
const S30: React.FC = () => {
  const f = useCurrentFrame(), k = K("s30_dew_point");
  const X = axX(EG), Y = axY(EG);
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = AT(k, 3, "This is the dew point"), td = MO.dew_point.Td_C;
  const Tn = mix(18, td, easeIO(clamp((f - t1) / (t2 - t1 + 20), 0, 1)));
  return (
    <Scene>
      <Svg>
        <EGraph />
        <line x1={X(-10)} x2={X(35)} y1={Y(15)} y2={Y(15)} stroke={C.first} strokeWidth={3} strokeDasharray="10 10" opacity={fin(f, t1)} />
        <Lbl x={X(-8)} y={Y(15) - 30} t="15 hPa" c={C.first} s={T.key} o={fin(f, t1)} />
        <circle cx={X(Tn)} cy={Y(15)} r={13} fill={C.first} />
        <circle cx={X(td)} cy={Y(15)} r={26} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, t2)} />
        <Lbl x={X(td) + 36} y={Y(15) + 46} t="≈ 13 °C" c={C.gold} s={T.key} o={fin(f, t2)} />
        <Keyword f={f} text="dew point" at={[1100, 160]} appear={t3} s={T.calc} />
        {/* fix loop 1 (M2): the goal in the maths zone from the first words */}
        <Lbl x={1100} y={260} t="cool until saturated" c={C.first} s={T.key} o={fin(f, AT(k, 0, "cool this air"))} />
        <g opacity={fin(f, SS(k, 4))}>{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${1120 + i * 30} 420 q 6 -60 18 -80`} stroke="#5aa05a" strokeWidth={6} fill="none" />)}
          <Droplet x={1150} y={360} s={0.5} /><Droplet x={1220} y={350} s={0.5} /><Lbl x={1320} y={390} t="dew" c={C.key} s={T.key} /></g>
        <g opacity={fin(f, SS(k, 5))}><rect x={1100} y={520} width={300} height={60} fill="#eef2f8" opacity={0.5} /><Lbl x={1440} y={550} t="fog" c={C.key} s={T.key} /></g>
        <g opacity={fin(f, SS(k, 6))}><Cloud x={1220} y={720} s={1} /><Lbl x={1440} y={720} t="cloud" c={C.key} s={T.key} /></g>
      </Svg>
    </Scene>
  );
};

// ================================================================ s31 where clouds begin (graph + the real cumulus day)
const S31: React.FC = () => {
  const f = useCurrentFrame(), k = K("s31_cloud_base");
  const L = MO.lcl, A: Ax = { x: 1180, y: 100, w: 600, h: 560, xr: [0, 30], yr: [0, 3] };
  const X = axX(A), Y = axY(A);
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t6 = SS(k, 6);
  const up = (t: number) => clamp((f - t) / 50, 0, 1);
  const line = (vals: number[], frac: number) => poly((L.z_profile_m as number[]).map((z, i) => [z, vals[i]] as [number, number]).filter(([z]) => z <= 3000 * frac).map(([z, v]) => [X(v), Y(z / 1000)] as Pt));
  const pr = clamp((f - SS(k, 0)) / (t4 - SS(k, 0)), 0, 1), py = 760 - (L.z_m / 3000) * 600 * pr;
  const rows: CalcRow[] = [{ rhs: EQ_S31, at: t4, ul: t4 + 15 }];
  const MB: MapBox = { lat0: BOX_CU[0], lat1: BOX_CU[1], lon0: BOX_CU[2], lon1: BOX_CU[3], x: 100, y: 120, w: 880, h: 720 };
  return (
    <Scene>
      <Svg>
        <g opacity={fout(f, t6)}>
          <rect x={80} y={760} width={920} height={60} fill="#3c5a2e" />
          <line x1={80} x2={1000} y1={760 - (L.z_m / 3000) * 600} y2={760 - (L.z_m / 3000) * 600} stroke={C.gold} strokeWidth={4} strokeDasharray="14 10" opacity={fin(f, t4)} />
          {[0, 1, 2].map((i) => <circle key={i} cx={250 + i * 250} cy={py} r={34} fill={pr < 1 ? C.second : "#eef2f8"} fillOpacity={0.5} stroke={C.second} strokeWidth={4} strokeDasharray="8 6" />)}
          {[0, 1, 2].map((i) => <Cloud key={`c${i}`} x={250 + i * 250} y={760 - (L.z_m / 3000) * 600 - 40} s={0.9} o={fin(f, SS(k, 5))} />)}
        </g>
        <g opacity={fin(f, t6)}>
          <GeoImage P={mapP(MB)} href={IMG.cumulus} box={BOX_CU} />
          <Lbl x={120} y={80} t="real cumulus, northern France" c={C.key} s={T.key} />
        </g>
        {/* fix loop 1 (M2 3-10 s): the graph frame is there from frame 0; the lines are drawn on their words */}
        <Axes A={A} xt={[0, 10, 20, 30]} yt={[0, 1, 2, 3]} xl="°C" yl="height (km)" o={1} />
        <defs><clipPath id="s31g"><rect x={A.x} y={A.y} width={A.w} height={A.h} /></clipPath></defs>
        <g clipPath="url(#s31g)">
          <path d={line(L.T_profile_C, up(t1))} fill="none" stroke={C.second} strokeWidth={6} opacity={fin(f, t1)} />
          <path d={line(L.Td_profile_C, up(t2))} fill="none" stroke={C.first} strokeWidth={6} opacity={fin(f, t2)} />
        </g>
        {/* fix loop 1 (S1): labels beside their lines, "12 °C" above its gap bracket */}
        <Lbl x={X(28)} y={Y(0.4)} t="T" c={C.second} s={T.key} o={fin(f, t1)} />
        <Lbl x={X(interp(2500, L.z_profile_m, L.Td_profile_C)) + 24} y={Y(2.5)} t="dew point" c={C.first} s={T.key} o={fin(f, t2)} />
        <g opacity={fin(f, t3)}><line x1={X(L.Td0_C)} x2={X(25)} y1={Y(0) - 18} y2={Y(0) - 18} stroke={C.gold} strokeWidth={5} /><Lbl x={X(L.Td0_C) - 16} y={Y(0) - 24} t="12 °C" c={C.gold} s={T.key} a="end" /></g>
        <circle cx={X(L.T_C)} cy={Y(L.z_m / 1000)} r={22} fill="none" stroke={C.gold} strokeWidth={5} opacity={fin(f, t4)} />
        <Lbl x={X(L.T_C) + 30} y={Y(L.z_m / 1000) - 40} t="base ≈ 1.5 km" c={C.gold} s={T.key} o={fin(f, t4)} />
        <Keyword f={f} text="flat bases" at={[1180, 820]} appear={AT(k, 6, "flat bases")} s={T.key} />
        <SrcLine id="s31_cloud_base" o={fin(f, t6)} />
      </Svg>
      <CalcStack f={f} x={1300} y={775} rows={tall(rows, 60)} size={60} o={fout(f, t6)} />
    </Scene>
  );
};

// ================================================================ s32-s35 wind
const S32: React.FC = () => {
  const f = useCurrentFrame(), k = K("s32_wind_vector");
  const MB: MapBox = { lat0: 45.5, lat1: 51, lon0: -8.5, lon1: -0.5, x: 80, y: 40, w: 920, h: 820 };
  const P = mapP(MB), O: Pt = [500, 560], s = 34;
  const tip: Pt = [O[0] + 8 * s, O[1] - 6 * s];
  const wd = HR.wind_1p5, k0 = 0;
  const t1 = SS(k, 1), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const rows: CalcRow[] = [
    { lhs: String.raw`|\mathbf v|`, rhs: String.raw`= \sqrt{8^2 + 6^2}`, at: AT(k, 5, "square root") },
    { rhs: String.raw`= \sqrt{100}`, at: AT(k, 5, "square root") + 30, cont: true },
    { rhs: String.raw`= 10\ \mathrm{m/s}`, at: AT(k, 5, "which is ten"), cont: true, ul: AT(k, 5, "which is ten") + 12 },
  ];
  return (
    <Scene>
      <Svg>
        <defs><clipPath id="s32c"><rect x={80} y={40} width={920} height={820} /></clipPath></defs>
        <g clipPath="url(#s32c)" opacity={0.55}>
          <GeoImage P={P} href={IMG.tc1101} box={BOX_TC1101} />
          <path d={linesPath(P, LN.ciaran_coast_10m)} fill="none" stroke={C.key} strokeOpacity={0.6} strokeWidth={1.5} />
        </g>
        <g clipPath="url(#s32c)" opacity={win(f, t1, t3)}>
          {(wd.lat as number[]).map((la, j) => (wd.lon as number[]).map((lo, i) => { const u = wd.u[k0][j][i], v = wd.v[k0][j][i], p = P(la, lo);
            return <Arrow key={`${j}_${i}`} p={p} q={[p[0] + u * 4, p[1] - v * 4]} color={C.first} w={4} head={14} halo={false} />; }))}
        </g>
        <g opacity={fin(f, SS(k, 2))}>
          <line x1={O[0] - 60} x2={O[0] + 340} y1={O[1]} y2={O[1]} stroke={C.key} strokeWidth={3} /><line x1={O[0]} x2={O[0]} y1={O[1] + 60} y2={O[1] - 260} stroke={C.key} strokeWidth={3} />
          <Lbl x={O[0] + 350} y={O[1]} t="E" c={C.key} s={T.key} /><Lbl x={O[0]} y={O[1] - 290} t="N" c={C.key} s={T.key} a="middle" />
        </g>
        <Dash p={O} q={[tip[0], O[1]]} c={C.second} w={6} o={fin(f, t4)} /><Dash p={[tip[0], O[1]]} q={tip} c={C.local} w={6} o={fin(f, t4)} />
        <Arrow p={O} q={tip} color={C.first} o={fin(f, t4)} />
        <Lbl x={(O[0] + tip[0]) / 2} y={O[1] + 50} t="u = 8 m/s" c={C.second} s={T.key} a="middle" o={fin(f, AT(k, 4, "u equal"))} />
        <Lbl x={tip[0] + 24} y={(O[1] + tip[1]) / 2} t="v = 6 m/s" c={C.local} s={T.key} o={fin(f, AT(k, 4, "v equal"))} />
        {/* fix loop 1 (M2, r5 scan: 14.5 s): the maths zone names wind as a vector from S0/S1, before its components */}
        <Keyword f={f} text="wind" at={[1080, 180]} appear={AT(k, 0, "wind")} out={t3 - 10} s={T.calc} />
        <Lbl x={1080} y={270} t="speed + direction" c={C.key} s={T.key} o={win(f, AT(k, 1, "speed"), t3 - 10)} />
        <Lbl x={1080} y={350} t="→ a vector" c={C.first} s={T.key} o={win(f, AT(k, 1, "vector"), t3 - 10)} />
        <Lbl x={1080} y={180} t="u: eastward part" c={C.second} s={T.key} o={fin(f, t3)} />
        <Lbl x={1080} y={260} t="v: northward part" c={C.local} s={T.key} o={fin(f, AT(k, 3, "northward"))} />
        <SrcLine id="s32_wind_vector" />
      </Svg>
      <CalcStack f={f} x={1300} y={430} rows={tall(rows, T.calc)} size={T.calc} />
      <TeX s={EQ_S32} x={-999} y={-999} o={0} />
      {void t5}
    </Scene>
  );
};
const S33: React.FC = () => {
  const f = useCurrentFrame(), k = K("s33_wind_direction");
  const c: Pt = [520, 450], R = 300;
  const at = (deg: number, r: number): Pt => [c[0] + Math.sin(deg * D2R) * r, c[1] - Math.cos(deg * D2R) * r];
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const dir = BA.wind.dir_from, arc = clamp((f - t4) / 40, 0, 1);
  const arcPts: Pt[] = Array.from({ length: 41 }, (_, i) => at((dir * arc * i) / 40, R * 0.55));
  return (
    <Scene>
      <Svg>
        <circle cx={c[0]} cy={c[1]} r={R} fill="none" stroke={C.muted} strokeWidth={4} />
        {[[0, "0° N"], [90, "90° E"], [180, "180° S"], [270, "270° W"]].map(([d, t]) => <g key={t as string} opacity={fin(f, t2)}>
          <line x1={at(d as number, R - 20)[0]} y1={at(d as number, R - 20)[1]} x2={at(d as number, R + 10)[0]} y2={at(d as number, R + 10)[1]} stroke={C.ink} strokeWidth={5} />
          <Lbl x={at(d as number, R + 110)[0]} y={at(d as number, R + 50)[1]} t={t as string} c={C.ink} s={52} a="middle" b={false} /></g>)}
        <Arrow p={[c[0] - R + 20, c[1] + 140]} q={[c[0] - 60, c[1] + 140]} color={C.first} o={win(f, t1, t3)} />
        <Lbl x={1100} y={150} t="westerly = from the west" c={C.key} s={T.key} o={fin(f, t1)} />
        {/* fix loop 1 (M2 3-10 s, r5 scan) */}
        <Keyword f={f} text="named by where it comes from" at={[1100, 820]} appear={AT(k, 0, "where it comes from")} s={T.floor} />
        <Lbl x={1100} y={240} t="clockwise from north," c={C.key} s={T.key} o={fin(f, t2)} /><Lbl x={1100} y={300} t="seen from above" c={C.key} s={T.key} o={fin(f, t2)} />
        <g opacity={fin(f, t3)}>
          <Dash p={c} q={at(dir, R)} c={C.first} w={4} />
          <Arrow p={c} q={[c[0] + 8 * 26, c[1] - 6 * 26]} color={C.first} />
        </g>
        <path d={poly(arcPts)} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, t4)} />
        <Lbl x={at(dir / 2, R * 0.55 + 40)[0] + 20} y={at(dir / 2, R * 0.55 + 40)[1] + 20} t="233°" c={C.gold} s={T.calc} o={fin(f, AT(k, 4, "two hundred"))} />
        <Lbl x={1100} y={400} t="from the south-west" c={C.key} s={T.key} o={fin(f, AT(k, 3, "comes from"))} />
        <Keyword f={f} text="south-westerly" at={[1100, 500]} appear={AT(k, 4, "south-westerly")} s={T.calc} />
        <g opacity={fin(f, t5)}><Arrow p={[1080, 700]} q={[1300, 700]} color={C.local} /><Lbl x={1330} y={700} t="eastward current" c={C.local} s={T.key} /></g>
      </Svg>
    </Scene>
  );
};
const S34: React.FC = () => {
  const f = useCurrentFrame(), k = K("s34_wind_units");
  const t1 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const rows: CalcRow[] = [
    { rhs: String.raw`10\ \mathrm{m/s} \times 3.6 = 36\ \mathrm{km/h}`, at: AT(k, 2, "so ten") },
    { rhs: EQ_S34, at: t5, size: 46 },
    { rhs: String.raw`10 \div 0.514 \approx 19\ \mathrm{kt}`, at: AT(k, 5, "nineteen"), ul: AT(k, 5, "nineteen") + 10 },
  ];
  const gArc = fin(f, t4);
  return (
    <Scene>
      {/* fix loop 1 (M1): the globe is there from frame 0 (its meridian arc comes on the knot sentence) */}
      <Globe cam={globePath([{ f: 0, lat: 30, lon: -20, dist: 3.4 }, { f: t4, lat: 30, lon: -20, dist: 3.4 }, { f: t4 + 60, lat: 42, lon: -35, dist: 3.0 }], f)} o={1} over={(G) => {
        const pts: [number, number][] = []; for (let la = -85; la <= 85; la += 2) pts.push([la, -20]);
        const a = G.p(45, -20), b = G.p(55, -20);
        return <g opacity={gArc}><path d={llPath(G, pts)} fill="none" stroke={C.gold} strokeWidth={4} />
          <path d={llPath(G, [[45, -20], [46, -20]])} stroke={C.second} strokeWidth={14} fill="none" />
          {void b}
        </g>;
      }} />
      <Svg>
        <g opacity={gArc}>
          
          <line x1={1100} x2={1480} y1={540} y2={540} stroke={C.second} strokeWidth={8} />
          {Array.from({ length: 61 }, (_, i) => <line key={i} x1={1100 + i * (380 / 60)} x2={1100 + i * (380 / 60)} y1={i % 10 === 0 ? 510 : 524} y2={556} stroke={C.ink} strokeWidth={2} />)}
          <Lbl x={1100} y={468} t="1° = 60 nautical miles" c={C.key} s={T.key} />
          <Lbl x={1100} y={620} t="1 nautical mile = 1852 m" c={C.key} s={T.key} />
        </g>
        <Lbl x={1080} y={720} t="knot = nautical mile per hour" c={C.key} s={T.key} o={fin(f, t3)} />
      </Svg>
      <Svg><Lbl x={1100} y={90} t="m/s · km/h · knots" c={C.key} s={T.key} o={fin(f, AT(k, 0, "several units"))} /><SrcLine id="s34_wind_units" /></Svg>
      <CalcStack f={f} x={1100} y={180} rows={tall(rows, 60)} size={60} />
      {void t1}
    </Scene>
  );
};
/** animated streaklines on a map: each track (lat, lon pairs) drawn as a moving comet */
const Streak2D: React.FC<{ P: (la: number, lo: number) => Pt; tracks: number[][][]; f: number; o?: number; c?: string; period?: number }> = ({ P, tracks, f, o = 1, c = C.key, period = 45 }) => o <= 0 ? null : (
  <g opacity={o} fill="none" stroke={c} strokeLinecap="round">
    {tracks.map((tr, i) => { const n = tr.length, ph = ((f + i * 17) % period) / period, head = ph * (n - 1), h0 = Math.floor(head);
      const pts: Pt[] = []; for (let q = Math.max(0, h0 - 3); q <= h0; q++) pts.push(P(tr[q][0], tr[q][1]));
      if (h0 < n - 1) { const w = head - h0; const a = tr[h0], b = tr[h0 + 1]; pts.push(P(a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w)); }
      return pts.length > 1 ? <path key={i} d={poly(pts)} strokeWidth={3} strokeOpacity={0.85 * Math.sin(Math.PI * ph)} /> : null; })}
  </g>
);
const MAPB: MapBox = { lat0: 36, lat1: 60, lon0: -30, lon1: 10, x: 80, y: 40, w: 920, h: 820 };
const CiaranMap: React.FC<{ B?: MapBox; img?: string; imgBox?: [number, number, number, number]; iso?: IsoLevel[]; o?: number; dim?: number; children?: React.ReactNode; id: string }> = ({
  B = MAPB, img = IMG.modis, imgBox = BOX_MODIS, iso, o = 1, dim = 1, children, id }) => {
  const P = mapP(B);
  return o <= 0 ? null : (
    <g opacity={o}>
      <defs><clipPath id={id}><rect x={B.x} y={B.y} width={B.w} height={B.h} /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        <GeoImage P={P} href={img} box={imgBox} o={dim} />
        <path d={linesPath(P, LN.ciaran_coast_10m)} fill="none" stroke={C.key} strokeOpacity={0.8} strokeWidth={2.2} />
        <path d={linesPath(P, LN.ciaran_borders_10m)} fill="none" stroke={C.key} strokeOpacity={0.4} strokeWidth={1.2} />
        {iso ? <IsoPaths P={P} levels={iso} o={0.85} w={2.5} /> : null}
        {children}
      </g>
      <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="none" stroke={C.grid} strokeWidth={3} />
    </g>
  );
};
const ISO12 = HR.isobars[24].levels as IsoLevel[]; // 12 UTC 2 Nov
if (HR.isobars[24].time_utc !== "2023-11-02T12") throw new Error("isobars index 24 ≠ 12 UTC 2 Nov");
const S35: React.FC = () => {
  const f = useCurrentFrame(), k = K("s35_why_wind");
  const t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4);
  const P = mapP(MAPB), L = HL.low;
  return (
    <Scene>
      <Svg>
        <g opacity={fout(f, t3)}>
          <Barometer x={260} y={360} r={150} v={1020} label="high" ticks={false} />
          <Barometer x={760} y={360} r={150} v={1000} label="low" ticks={false} />
          <Arrow p={[430, 360]} q={[590, 360]} color={C.second} o={fin(f, SS(k, 1))} />
          <Lbl x={510} y={640} t="pushed from high to low" c={C.key} s={T.key} a="middle" o={fin(f, t2)} />
        </g>
        <CiaranMap id="s35m" iso={ISO12} o={fin(f, t3)}>
          <Streak2D P={P} tracks={HL.streaklines_10m_12utc.tracks} f={f} o={fin(f, t3)} />
          <Lbl x={P(L.lat, L.lon)[0]} y={P(L.lat, L.lon)[1]} t="L" c={LOW_C} s={T.calc} a="middle" />
        </CiaranMap>
        {/* fix loop 1 (M2): the cause is named in the maths zone on its words */}
        <Lbl x={1440} y={200} t="?" c={C.gold} s={T.hero} a="middle" o={win(f, 0, AT(k, 1, "pressure") - 8)} />
        <Keyword f={f} text="pressure difference" at={[1100, 200]} appear={AT(k, 1, "pressure")} s={T.key} />
        <Lbl x={1100} y={290} t="high → low" c={C.second} s={T.key} o={fin(f, t2)} />
        <Keyword f={f} text="turned aside" at={[1100, 400]} appear={AT(k, 3, "turned aside")} s={T.key} />
        <Keyword f={f} text="Coriolis effect →" at={[1100, 600]} appear={AT(k, 4, "Coriolis")} s={T.key} />
        <Keyword f={f} text="geostrophic wind →" at={[1100, 700]} appear={AT(k, 4, "geostrophic")} s={T.key} />
        <SrcLine id="s35_why_wind" o={fin(f, t3)} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s36 weather vs climate at Brest
const S36: React.FC = () => {
  const f = useCurrentFrame(), k = K("s36_weather_climate");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const A: Ax = { x: 200, y: 100, w: 1580, h: 600, xr: [1, 365], yr: [0, 25] };
  const X = axX(A), Y = axY(A);
  const n23 = Math.round(365 * clamp((f - AT(k, 3, "for every day")) / (t5 - AT(k, 3, "for every day")), 0, 1));
  const band = clamp((f - t4) / 60, 0, 1), nb = Math.max(2, Math.round(365 * band));
  const doy = BC.doy as number[];
  const months = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], mn = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const MB: MapBox = { lat0: 46.5, lat1: 50, lon0: -6.5, lon1: -1.5, x: 120, y: 120, w: 780, h: 700 };
  return (
    <Scene>
      <MapImg o={fout(f, t3)} layers={[{ n: "brest", o: 1 }]} box={{ x: 100, y: 60, w: 900, h: 800 }} />
      <Svg>
        {void MB}
        {/* fix loop 1 (M2 3-10 s, r5 scan) */}
        <Lbl x={1080} y={180} t="two words" c={C.gold} s={T.key} o={win(f, AT(k, 0, "two words"), t3)} />
        <Keyword f={f} text="weather: now, a few days" at={[1080, 300]} appear={t1} out={t3} s={T.key} />
        <Keyword f={f} text="climate: 30-year statistics" at={[1080, 420]} appear={t2} out={t3} s={T.key} />
        <g opacity={fin(f, t3)}>
          <Axes A={A} xt={[]} yt={[0, 5, 10, 15, 20, 25]} yl="°C" />
          {months.map((m, i) => <Lbl key={i} x={X(m + 14)} y={A.y + A.h + 38} t={mn[i]} c={C.muted} s={52} a="middle" b={false} />)}
          <path d={poly([...doy.slice(0, nb).map((d, i) => [X(d), Y(BC.q90_C[i])] as Pt), ...doy.slice(0, nb).map((d, i) => [X(d), Y(BC.q10_C[i])] as Pt).reverse()]) + "Z"}
            fill={C.local} fillOpacity={0.3 * fin(f, t4)} />
          <path d={poly(doy.slice(0, nb).map((d, i) => [X(d), Y(BC.mean_C[i])] as Pt))} fill="none" stroke={C.key} strokeWidth={4} opacity={fin(f, t4)} />
          <path d={poly((BC.y2023_C as number[]).slice(0, n23).map((v, i) => [X(i + 1), Y(v)] as Pt))} fill="none" stroke={C.second} strokeWidth={3.5} />
          <Lbl x={X(20)} y={Y(25.2)} t="Brest, 2023" c={C.second} s={T.key} />
          <Lbl x={X(20)} y={Y(22.8)} t="1991–2020: average and 8 days in 10" c={C.key} s={T.floor} o={fin(f, t4)} />
        </g>
        <Lbl x={1000} y={794} t="climate: what you expect · weather: what you get" c={C.key} s={T.key} a="middle" o={fin(f, t6)} />
        <SrcLine id="s36_weather_climate" i={0} o={fout(f, t3)} />
        <SrcLine id="s36_weather_climate" i={1} o={fin(f, t3)} w={1700} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s37 observations: the 2023 balloon stations
const S37: React.FC = () => {
  const f = useCurrentFrame(), k = K("s37_observations");
  const cam = globePath([{ f: 0, lat: 40, lon: 10, dist: 3.8 }, { f: Math.round(LEN(k) * 0.5), lat: 20, lon: -40, dist: 3.8 }, { f: LEN(k), lat: 15, lon: 20, dist: 3.8 }], f);
  const t1 = SS(k, 1), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const kinds = ["stations", "balloons", "ships", "buoys", "aircraft", "satellites"];
  return (
    <Scene>
      <Globe cam={cam} over={(G) => <g opacity={fin(f, t3)}>{(ST.latlon as number[][]).map(([la, lo], i) => G.vis(la, lo) ? <circle key={i} cx={G.p(la, lo)[0]} cy={G.p(la, lo)[1]} r={5} fill={C.gold} /> : null)}</g>} />
      <Svg>
        {/* fix loop 1 (M2 3-10 s, r5 scan) */}
        <Lbl x={1440} y={420} t="?" c={C.gold} s={T.hero} a="middle" o={win(f, 0, AT(k, 1, "weather stations") - 8)} />
        {kinds.map((w, i) => <Lbl key={w} x={1100 + (i % 2) * 360} y={150 + Math.floor(i / 2) * 80} t={w} c={C.key} s={T.key} o={fin(f, AT(k, 1, w === "stations" ? "weather stations" : w === "balloons" ? "weather balloons" : w))} />)}
        <Keyword f={f} text="crowded" at={[1100, 470]} appear={AT(k, 4, "crowded")} s={T.key} /><Lbl x={1100} y={530} t="Europe · N America · E Asia" c={C.key} s={T.floor} o={fin(f, AT(k, 4, "crowded"))} />
        <Keyword f={f} text="sparse" at={[1100, 620]} appear={AT(k, 4, "sparse")} s={T.key} /><Lbl x={1100} y={680} t="oceans · Africa · poles" c={C.key} s={T.floor} o={fin(f, AT(k, 4, "sparse"))} />
        <Keyword f={f} text="different things and times" at={[1100, 790]} appear={t5} s={T.floor} />
        <SrcLine id="s37_observations" />
      </Svg>
      {void t1}{void t4}
    </Scene>
  );
};

// ================================================================ s38 reanalysis: observations + a model → ERA5 2-m temperature
const S38: React.FC = () => {
  const f = useCurrentFrame(), k = K("s38_reanalysis");
  const g = useGlobal();
  const tTex = useFieldTex(g?.t2m, GNY, GNX, LUT_THERMAL, -30, 35, 1, true);
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  // UF1 U-WB-30, R4: one full westward turn while the field fills (keys ≤ 120° apart so the slerp goes west); end = s39 start
  const cam = globePath([{ f: 0, lat: 15, lon: 20, dist: 3.8 }, { f: t3, lat: 10, lon: -60, dist: 4.2 }, { f: t5, lat: -25, lon: -180, dist: 4.2 },
    { f: t7, lat: 0, lon: -280, dist: 4.2 }, { f: LEN(k), lat: 20, lon: -360, dist: 3.8 }], f);
  return (
    <Scene>
      <Globe cam={cam} field={tTex} fieldO={0.85 * fin(f, t3, 30)} grat={0.6 * win(f, t1, t3 + 20)} over={(G) => <g>
        <g opacity={fout(f, t3 + 30) * 0.9}>{(ST.latlon as number[][]).map(([la, lo], i) => G.vis(la, lo) ? <circle key={i} cx={G.p(la, lo)[0]} cy={G.p(la, lo)[1]} r={5} fill={C.gold} /> : null)}</g>
        {f > t5 ? (() => { const c0 = G.pw([0, 0, 0]), R0 = silR(cam.dist, GBOX.h); return <g opacity={fin(f, t5) * fout(f, t7) * 0.6}>
          <defs><clipPath id="s38disc"><circle cx={c0[0]} cy={c0[1]} r={R0 - 2} /></clipPath></defs>{/* fix 1 (S10): no band past the limb */}
          <path clipPath="url(#s38disc)" d={llPath(G, Array.from({ length: 73 }, (_, i) => [-55, -180 + i * 5] as [number, number]))} stroke={C.local} strokeWidth={60} strokeOpacity={0.35} fill="none" /></g>; })() : null}
      </g>} />
      <Svg>
        <Keyword f={f} text="model + observations" at={[1100, 140]} appear={t1} s={T.key} />
        <Keyword f={f} text="nudged every few hours" at={[1100, 230]} appear={t2} s={T.key} />
        <Keyword f={f} text="every place, height, hour" at={[1100, 320]} appear={t3} s={T.key} />
        <Keyword f={f} text="ERA5" at={[1100, 430]} appear={AT(k, 4, "ERA5")} s={T.calc} />
        <Lbl x={1100} y={520} t="1940 → today · ≈ 30 km grid" c={C.key} s={T.key} o={fin(f, t5)} />
        <Lbl x={1100} y={610} t="like a jigsaw" c={C.key} s={T.key} o={win(f, t6, t7)} />
        <Lbl x={1100} y={590} t="unlike: least certain" c={C.key} s={T.floor} o={fin(f, t7)} /><Lbl x={1100} y={640} t="where data are sparse" c={C.key} s={T.floor} o={fin(f, t7)} />
        <ColourBar x={1120} y={730} w={560} lut={LUT_THERMAL} lo={-30} hi={35} ticks={[{ v: -30, t: "−30" }, { v: 0, t: "0" }, { v: 30, t: "30" }]} unit="°C" o={fin(f, t3)} title="2-m temperature" />
        <SrcLine id="s38_reanalysis" i={0} o={fout(f, t3, 20)} />
        <SrcLine id="s38_reanalysis" i={1} o={fin(f, t3, 20)} />
      </Svg>
      {void t4}
    </Scene>
  );
};

// ================================================================ s39 surface pressure: the mountains (+ Tibet in 3-D relief)
const TE = tibJ as any;
const CTA = cesTibJ as any;
const USE_THREE_TIBET = false;
const TNY = 255, TNX = 495;
const S39: React.FC = () => {
  const f = useCurrentFrame(), k = K("s39_surface_pressure");
  const g = useGlobal();
  const spTex = useFieldTex(g?.sp, GNY, GNX, LUT_DENSE.slice().reverse(), 500, 1040, 1, true);
  const t1 = SS(k, 1), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const cam = globePath([{ f: 0, lat: 20, lon: 0, dist: 3.8 }, { f: t3, lat: 32, lon: 85, dist: 3.4 }, { f: t5 + 60, lat: 20, lon: 40, dist: 3.8 }, { f: LEN(k), lat: 10, lon: -80, dist: 3.8 }], f);
  // the close-up: ETOPO 2022 relief (4′ means) under the Blue Marble, vertical ×30 (said in the narration, S4)
  const tv = useVars(staticFile("wb_tibet_etopo.bin"), TE);
  const btex = useTex(staticFile("wb_bmng_tibet.jpg"));
  const VB = { x: 1060, y: 330, w: 780, h: 520 };
  const st = orbitCam(orbitPath([{ f: t4, az: -95, el: 52, dist: 34, target: [0, 0, 0.5] }, { f: LEN(k), az: -70, el: 34, dist: 30, target: [0, 0, 0.8] }], f), [VB.w / 2, VB.h / 2]);
  const pr = projector(st, VB.w, VB.h, VB.x, VB.y);
  const sx = (33 / TNX) * 111.32 * Math.cos(33.5 * D2R) / 100, sy = (17 / TNY) * 111.32 / 100, ZT = 30 / 1e5;
  const wpt = (la: number, lo: number, zm: number): V3 => [((lo - 88.5) / 33) * TNX * sx, ((la - 33.5) / 17) * TNY * sy, zm * ZT];
  const oT = fin(f, t4);
  const ci = clamp(f - t4, 0, CTA.n - 1), an = (CTA.anchors as Record<string, [number, number][]>)[String(ci)];
  if (Math.abs(CTA.f0 - t4) > 1) throw new Error(`cesium tibet shot starts at ${CTA.f0}, scene sentence 4 at ${t4}: re-render the shot`);
  void pr; void wpt;
  return (
    <Scene>
      <Globe cam={cam} field={spTex} fieldO={0.85 * fin(f, t1)} over={(G) => <g>
        {G.vis(31, 88) ? <g opacity={fin(f, t3) * fout(f, t4)}><circle cx={G.p(31, 88)[0]} cy={G.p(31, 88)[1]} r={70} fill="none" stroke={C.gold} strokeWidth={5} />
          <Lbl x={G.p(31, 88)[0]} y={G.p(31, 88)[1] - 100} t="Tibet < 600 hPa" c={C.key} s={T.key} a="middle" /></g> : null}
        {G.vis(-20, -68) ? <Lbl x={G.p(-20, -68)[0] + 30} y={G.p(-20, -68)[1]} t="Andes" c={C.key} s={T.key} o={fin(f, AT(k, 3, "Andes")) * limb(G, -20, -68)} /> : null}
        {G.vis(40, -108) ? <Lbl x={G.p(40, -108)[0] + 30} y={G.p(40, -108)[1]} t="Rockies" c={C.key} s={T.key} o={fin(f, AT(k, 3, "Rockies")) * limb(G, 40, -108)} /> : null}
      </g>} />
      {/* CesiumJS (no Ion) frames: ETOPO 4′ ×30 + Blue Marble, rendered headless by tools/movie_wb/cesium_shots.py (chosen over the
          three.js Terrain below, kept as the runner-up) */}
      {oT > 0 ? <Img src={staticFile(`cesium_tibet/f_${String(ci).padStart(5, "0")}.jpg`)} style={{ position: "absolute", left: VB.x, top: VB.y, width: VB.w, height: VB.h, opacity: oT }} /> : null}
      {USE_THREE_TIBET && tv && btex ? <View3D st={st} x={VB.x} y={VB.y} w={VB.w} h={VB.h} o={oT}>
        <Terrain H={tv.z} ny={TNY} nx={TNX} x0={-(TNX - 1) * sx / 2} x1={(TNX - 1) * sx / 2} y0={-(TNY - 1) * sy / 2} y1={(TNY - 1) * sy / 2}
          zs={ZT} tex={btex} rise={easeIO(clamp((f - t4) / 60, 0, 1))} />
      </View3D> : null}
      <Svg>
        <ColourBar x={1120} y={130} w={560} lut={LUT_DENSE.slice().reverse()} lo={500} hi={1040} ticks={[{ v: 500, t: "500" }, { v: 1000, t: "1000" }]} unit="hPa" o={fin(f, t1) * fout(f, t4)} title="surface pressure" />
        <g opacity={oT}>
          {an ? <Lbl x={VB.x + an[0][0]} y={VB.y + an[0][1] - 40} t="Tibetan Plateau" c={C.key} s={T.key} a="middle" /> : null}
          {an ? <Lbl x={VB.x + an[1][0]} y={Math.min(VB.y + VB.h - 120, VB.y + an[1][1] - 34)} t="Himalayas" c={C.key} s={T.floor} a="middle" /> : null}
          <Lbl x={1080} y={300} t="mountains × 30 taller" c={C.key} s={T.key} />
        </g>
        <Keyword f={f} text="less air above high ground" at={[1080, 140]} appear={t5} out={t6} s={T.key} />
        <Keyword f={f} text="weather hidden" at={[1080, 220]} appear={t6} s={T.key} />
        <SrcLine id="s39_surface_pressure" i={0} o={fout(f, t4)} />
        <SrcLine id="s39_surface_pressure" i={1} o={oT} x={1080} w={760} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s40 reducing to sea level (side view, thought example)
const S40: React.FC = () => {
  const f = useCurrentFrame(), k = K("s40_sea_level");
  const t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6), t7 = SS(k, 7);
  const sea = 760, top = 360;
  const col = clamp((f - t3) / 50, 0, 1);
  const parts: Part[] = [{ t: String.raw`p_{\text{sea}}` }, { t: "=" }, { t: "p_s", c: PRES, u: { w: String.raw`\text{station } p`, c: C.gold } },
    { t: String.raw`\, e^{z_s/H}`, c: C.first, u: { w: String.raw`z_s:\ \text{height}`, c: C.gold } }];
  const rows: CalcRow[] = [
    { rhs: String.raw`= 835 \times e^{1.609/8.43}`, at: t4 },
    { rhs: String.raw`\approx 835 \times 1.21`, at: t4 + 70, cont: true },
    { rhs: String.raw`\approx 1010\ \mathrm{hPa}`, at: t5, cont: true, ul: t5 + 10 },
  ];
  return (
    <Scene>
      <Svg>
        <rect x={80} y={sea} width={920} height={60} fill="#1f4f7a" />
        <path d={`M300 ${sea} L560 ${top} L820 ${sea} Z`} fill="#7a5a3a" stroke={C.ink} strokeWidth={4} />
        <rect x={540} y={top - 40} width={40} height={40} fill={C.key} opacity={fin(f, t2)} />
        <Lbl x={600} y={top - 160} t="p = 835 hPa" c={C.key} s={T.key} o={fin(f, AT(k, 2, "eight hundred"))} /><Lbl x={600} y={top - 95} t="T = 15 °C" c={C.key} s={T.key} o={fin(f, AT(k, 2, "fifteen"))} />
        <Lbl x={240} y={top} t="1609 m" c={C.key} s={T.key} a="end" o={fin(f, t2)} />
        <Lbl x={240} y={sea - 70} t="0 m" c={C.key} s={T.key} a="end" o={fin(f, t2)} />
        {/* fix loop 1 (S4): the unspoken "≈ 1013 hPa" beside the result is gone; the two towns are named as said */}
        <rect x={130} y={sea - 40} width={40} height={40} fill={C.key} opacity={fin(f, SS(k, 0))} />
        <Lbl x={100} y={sea - 150} t="seaside town" c={C.key} s={T.key} o={fin(f, AT(k, 0, "seaside"))} />
        <Lbl x={600} y={top - 225} t="mountain town" c={C.key} s={T.key} o={fin(f, AT(k, 0, "mountain town"))} />
        {/* fix loop 1 (M2): the maths zone carries the idea before the formula arrives */}
        <Lbl x={1440} y={300} t="?" c={C.gold} s={T.hero} a="middle" o={win(f, 0, SS(k, 1) - 8)} />
        <Keyword f={f} text="as if at sea level" at={[1100, 300]} appear={SS(k, 1)} out={t4 - 30} s={T.key} />
        <Lbl x={1100} y={420} t="+ weight of column below" c="#7cc4ff" s={T.key} o={win(f, t3, t4 - 30)} />
        <rect x={880} y={top} width={70} height={(sea - top) * col} fill="#7cc4ff" fillOpacity={0.3} stroke="#7cc4ff" strokeWidth={4} strokeDasharray="12 8" opacity={fin(f, t3)} />
        <Lbl x={995} y={(top + sea) / 2} t="imaginary column" c="#7cc4ff" s={T.floor} a="middle" rot={-90} o={fin(f, t3)} />
        <Keyword f={f} text="sea-level pressure" at={[1100, 830]} appear={t6} s={T.key} />
        <Lbl x={1100} y={760} t="real services: more careful" c={C.key} s={T.floor} o={fin(f, t7)} />
      </Svg>
      {/* fix loop 1 (S2): 84 px, so the underbrace notes are ≥ 58 px */}
      <Layered parts={parts} layers={[base(fin(f, t4 - 30)), { u: [2, 3], o: fin(f, t4 - 10) }]} x={1070} y={170} size={84} />
      <CalcStack f={f} x={1240} y={380} rows={tall(rows, T.calc)} size={T.calc} />
      <TeX s={EQ_S40} x={-999} y={-999} o={0} />
    </Scene>
  );
};

// ================================================================ s41-s42 sea-level pressure, isobars, highs and lows on the globe
const isoGlobe = (G: GProj, levels: IsoLevel[], upto: number, w = 2.4) => levels.filter((L) => Math.abs(L.level - 1012) <= upto).map((L) =>
  <path key={L.level} d={coastPath(G, L.lines, undefined, 1.002)} fill="none" stroke={C.key} strokeOpacity={0.8} strokeWidth={w} />);
const S41: React.FC = () => {
  const f = useCurrentFrame(), k = K("s41_msl_isobars");
  const g = useGlobal();
  const mTex = useFieldTex(g?.msl, GNY, GNX, LUT_BAL, 970, 1056, 1, true);
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4);
  const cam = globePath([{ f: 0, lat: 10, lon: -80, dist: 3.8 }, { f: t3, lat: 30, lon: -30, dist: 3.8 }, { f: t4 + 40, lat: 48, lon: -12, dist: 3.4 }], f);
  const upto = 60 * clamp((f - t2) / 90, 0, 1);
  return (
    <Scene>
      <Globe cam={cam} field={mTex} fieldO={0.8 * fin(f, 0)} over={(G) => <g>
        {f >= t2 ? isoGlobe(G, ISO_G, upto) : null}
        {f >= t4 && G.vis(47, -8) ? <g opacity={fin(f, t4)}><circle cx={G.p(47.5, -9)[0]} cy={G.p(47.5, -9)[1]} r={80} fill="none" stroke={C.gold} strokeWidth={5} /></g> : null}
      </g>} />
      <Svg>
        <ColourBar x={1120} y={130} w={560} lut={LUT_BAL} lo={970} hi={1056} ticks={[{ v: 970, t: "970" }, { v: 1013, t: "1013" }, { v: 1050, t: "1050" }]} unit="hPa" o={fin(f, 0)} title="sea-level pressure" />
        <Keyword f={f} text="the weather appears" at={[1100, 300]} appear={t1} s={T.key} />
        <SrcLine id="s41_msl_isobars" />
        <Lbl x={1100} y={400} t="every 4 hPa" c={C.key} s={T.key} o={fin(f, t2)} />
        <Keyword f={f} text="isobars" at={[1100, 520]} appear={AT(k, 3, "isobars")} s={T.calc} />
        <Lbl x={1100} y={605} t="iso = equal" c={C.key} s={T.key} o={fin(f, AT(k, 3, "equal weight"))} />
        <Lbl x={1100} y={670} t="baros = weight" c={C.key} s={T.key} o={fin(f, AT(k, 3, "equal weight"))} />
        <Keyword f={f} text="crowded → strong wind" at={[1100, 760]} appear={t4} s={T.key} />
      </Svg>
    </Scene>
  );
};
const LM = latestJ as any;
const S42: React.FC = () => {
  const f = useCurrentFrame(), k = K("s42_highs_lows");
  const g = useGlobal();
  const mTex = useFieldTex(g?.msl, GNY, GNX, LUT_BAL, 970, 1056, 1, true);
  const lv = useVars(staticFile("wb_latest_gfs.bin"), LM);
  const gTex = useFieldTex(lv?.msl, 181, 360, LUT_BAL, 970, 1056, 1, true);
  const t0 = SS(k, 0), t1 = SS(k, 1), t2 = AT(k, 2, "Storm Ciarán"), t3 = AT(k, 3, "near the Azores");
  const t4 = SS(k, 4), tTy = AT(k, 5, "typhoon"), tNA = AT(k, 5, "North Atlantic");
  const L = HL.low, Hh = HL.high, ty = LM.deepest_low, na = LM.north_atlantic_low;
  const xg = fin(f, t4, 20);   // ERA5 2 Nov 2023 → GFS 27 Oct 2026
  const cam = globePath([{ f: 0, lat: 48, lon: -12, dist: 3.4 }, { f: t4, lat: 48, lon: -12, dist: 3.4 },
    { f: tTy, lat: 25, lon: 150, dist: 3.4, hop: 0.8 }, { f: tNA - 10, lat: 25, lon: 150, dist: 3.4 }, { f: tNA + 50, lat: 50, lon: -25, dist: 3.4, hop: 0.8 }], f);
  return (
    <Scene>
      <Globe cam={cam} field={mTex} fieldO={0.8 * (1 - xg)} field2={gTex} field2O={0.8 * xg} over={(G) => <g>
        <g opacity={1 - xg}>{isoGlobe(G, ISO_G, 60)}</g>
        <g opacity={xg}>{isoGlobe(G, LM.isobars as IsoLevel[], 60)}</g>
        <g opacity={(1 - xg) * limb(G, L.lat, L.lon)}>
          <g opacity={fin(f, AT(k, 0, "called lows"))}><Lbl x={G.p(L.lat, L.lon)[0]} y={G.p(L.lat, L.lon)[1]} t="L" c={C.key} s={68} a="middle" /></g>
          {/* fix loop 2 (review 2 N-M1): centred UNDER the L (as the H's value), clamped inside the globe's box (the label right of
              the L ran past the picture zone's clip at x ≈ 1000 and lost "hPa") */}
          <Lbl x={clamp(G.p(L.lat, L.lon)[0], GBOX.x + 200, GBOX.x + GBOX.w - 200)} y={G.p(L.lat, L.lon)[1] + 72} t="Ciarán 956 hPa" c={C.key} s={T.key} a="middle" o={fin(f, t2)} />
        </g>
        <g opacity={(1 - xg) * limb(G, Hh.lat, Hh.lon)}>
          <g opacity={fin(f, AT(k, 0, "called highs"))}><Lbl x={G.p(Hh.lat, Hh.lon)[0]} y={G.p(Hh.lat, Hh.lon)[1]} t="H" c={C.key} s={68} a="middle" /></g>
          <Lbl x={G.p(Hh.lat, Hh.lon)[0]} y={G.p(Hh.lat, Hh.lon)[1] + 70} t="≈ 1030 hPa" c={C.key} s={T.key} a="middle" o={fin(f, t3)} />
        </g>
        {G.vis(ty.lat, ty.lon) ? <g opacity={fin(f, tTy) * limb(G, ty.lat, ty.lon)}><Lbl x={G.p(ty.lat, ty.lon)[0]} y={G.p(ty.lat, ty.lon)[1]} t="L" c={C.key} s={68} a="middle" />
          <Lbl x={G.p(ty.lat, ty.lon)[0]} y={G.p(ty.lat, ty.lon)[1] + 70} t="typhoon ≈ 935 hPa" c={C.key} s={T.key} a="middle" /></g> : null}
        {G.vis(na.lat, na.lon) ? <g opacity={fin(f, tNA) * limb(G, na.lat, na.lon)}><Lbl x={G.p(na.lat, na.lon)[0]} y={G.p(na.lat, na.lon)[1]} t="L" c={C.key} s={68} a="middle" />
          <Lbl x={G.p(na.lat, na.lon)[0]} y={G.p(na.lat, na.lon)[1] + 70} t="≈ 955 hPa" c={C.key} s={T.key} a="middle" /></g> : null}
      </g>} />
      <Svg>
        {/* fix loop 2 (review 2 S1): s41's pressure colour bar stays (same field, same colours on both maps), so the maths zone is
            not a lone "H" for 3.5 s; the H / L column moves down under it */}
        <ColourBar x={1120} y={130} w={560} lut={LUT_BAL} lo={970} hi={1056} ticks={[{ v: 970, t: "970" }, { v: 1013, t: "1013" }, { v: 1050, t: "1050" }]} unit="hPa" title="sea-level pressure" />
        <SrcLine id="s42_highs_lows" i={0} o={1 - xg} />
        <SrcLine id="s42_highs_lows" i={1} o={xg} />
        {/* fix loop 1 (M2): the H / L names in the maths zone on their words in S0 */}
        <g opacity={win(f, AT(k, 0, "higher than all"), t4)}><Lbl x={1100} y={300} t="H" c={C.key} s={68} /><Lbl x={1160} y={300} t="high" c={C.key} s={T.key} o={fin(f, AT(k, 0, "called highs"))} /></g>
        <g opacity={win(f, AT(k, 0, "lower"), t4)}><Lbl x={1100} y={380} t="L" c={C.key} s={68} /><Lbl x={1160} y={380} t="low" c={C.key} s={T.key} o={fin(f, AT(k, 0, "called lows"))} /></g>
        <Keyword f={f} text="low = depression = cyclone" at={[1100, 470]} appear={AT(k, 1, "depression")} out={t4} s={T.key} />
        <Keyword f={f} text="high = anticyclone" at={[1100, 590]} appear={AT(k, 1, "anticyclone")} out={t4} s={T.key} />
        <Lbl x={1100} y={420} t="weather-service analysis" c={C.key} s={T.key} o={fin(f, t4)} />
        <Lbl x={1100} y={500} t="27 Oct 2026" c={C.key} s={T.key} o={fin(f, AT(k, 4, "twenty-seventh"))} />
      </Svg>
      {void t0}{void t1}
    </Scene>
  );
};

// ================================================================ s43 lows are cloudy, highs are clear (MODIS Aqua, 2 Nov 2023)
/** cartostyle map layers (tools/movie_wb/make_maps.py): one opaque base + transparent overlays, 1240 × 820 at (60, 40);
 * `kb` = Ken Burns zoom (scale s about the frame point cx, cy in 0..1) */
const MAPF = { x: 60, y: 40, w: 1240, h: 820 };
const MapImg: React.FC<{ layers: { n: string; o: number }[]; kb?: { s: number; cx: number; cy: number }; o?: number; box?: { x: number; y: number; w: number; h: number } }> = ({
  layers, kb, o = 1, box = MAPF }) => o <= 0 ? null : (
  <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, overflow: "hidden", opacity: o, borderRadius: 4 }}>
    <div style={{ position: "absolute", inset: 0, transformOrigin: kb ? `${kb.cx * 100}% ${kb.cy * 100}%` : "50% 50%", transform: kb ? `scale(${kb.s})` : undefined }}>
      {layers.map((L) => (L.o > 0 ? <Img key={L.n} src={staticFile(`wb_map_${L.n}.png`)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", opacity: L.o }} /> : null))}
    </div>
  </div>
);
const S43: React.FC = () => {
  const f = useCurrentFrame(), k = K("s43_lows_cloudy");
  const t1 = SS(k, 1), t4 = SS(k, 4), t5 = SS(k, 5), t7 = SS(k, 7);
  const pan = easeIO(clamp((f - t5) / 70, 0, 1));
  // fix loop 1 (S3): the pan stops at cx 0.3 (was 0.1), so the L and "Brest" stay inside the frame with the H
  const kb = { s: 1.45, cx: mix(0.68, 0.3, pan), cy: mix(0.35, 0.85, pan) };
  const lowArrows = (x: number, y: number, o: number) => <g opacity={o}>
    <Arrow p={[x - 160, y + 120]} q={[x - 40, y + 120]} color={C.first} w={7} head={24} /><Arrow p={[x + 160, y + 120]} q={[x + 40, y + 120]} color={C.first} w={7} head={24} />
    <Arrow p={[x, y + 100]} q={[x, y - 20]} color={C.first} w={7} head={24} o={fin(f, SS(k, 2))} /><Cloud x={x} y={y - 70} s={0.9} o={fin(f, SS(k, 3))} /></g>;
  const highArrows = (x: number, y: number, o: number) => <g opacity={o}>
    <Arrow p={[x, y - 80]} q={[x, y + 70]} color={C.local} w={7} head={24} /><Arrow p={[x - 20, y + 110]} q={[x - 140, y + 110]} color={C.local} w={7} head={24} />
    <Arrow p={[x + 20, y + 110]} q={[x + 140, y + 110]} color={C.local} w={7} head={24} /></g>;
  return (
    <Scene>
      <MapImg layers={[{ n: "sat_base", o: 1 }, { n: "sat_iso", o: 1 }, { n: "sat_marks", o: 1 }]} kb={kb} />
      <Svg>
        {lowArrows(1580, 300, win(f, t1, t5))}
        <Lbl x={1340} y={520} t="rises → cools" c={C.key} s={T.floor} o={win(f, SS(k, 3), t5)} />
        <Lbl x={1340} y={580} t="→ dew point → cloud" c={C.key} s={T.floor} o={win(f, SS(k, 3), t5)} />
        <Keyword f={f} text="lows: cloudy, wet" at={[1340, 760]} appear={t4} out={t5} s={T.key} />
        {highArrows(1580, 300, fin(f, t5))}
        <Lbl x={1340} y={540} t="sinks → warms → clear" c={C.key} s={T.floor} o={fin(f, SS(k, 6))} />
        <Keyword f={f} text="highs: settled, dry" at={[1340, 760]} appear={t7} s={T.key} />
        <SrcLine id="s43_lows_cloudy" x={300} w={980} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s44 the real wind circles the low
const S44: React.FC = () => {
  const f = useCurrentFrame(), k = K("s44_round_lows");
  const t0 = SS(k, 0), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const P = mapP(MAPB), L = HL.low, Hh = HL.high, ar = HL.arrows_10m_12utc.rows as number[][];
  // fix loop 1 (S3): a0 / sweep let the high's arc stay inside the map (the high sits near the bottom-left corner)
  const arc = (c: Pt, r: number, cw: boolean, o: number, a0 = 0.3, sweep = 1.6 * Math.PI) => {
    const pts: Pt[] = Array.from({ length: 31 }, (_, i) => { const a = (cw ? -1 : 1) * (i / 30) * sweep + a0; return [c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)]; });
    // fix loop 2: the arrow's last segment is ≥ 34 px (on the high's short arc 2 of 30 steps were 15 px, under the 26-px head)
    let j = 28; while (j > 0 && Math.hypot(pts[30][0] - pts[j][0], pts[30][1] - pts[j][1]) < 34) j--;
    return <g opacity={o}><path d={poly(pts.slice(0, j + 2))} fill="none" stroke={C.gold} strokeWidth={6} /><Arrow p={pts[j]} q={pts[30]} color={C.gold} w={6} head={26} /></g>;
  };
  const lp = P(L.lat, L.lon), hp = P(Math.max(38.0, Hh.lat), Math.max(-28, Hh.lon)); // H at the map edge (the high is just off it), arc room inside
  return (
    <Scene>
      <Svg>
        <CiaranMap id="s44m" iso={ISO12}>
          <g opacity={fin(f, t0)}>{ar.map(([la, lo, u, v], i) => { const p = P(la, lo); return <Arrow key={i} p={p} q={[p[0] + u * 3, p[1] - v * 3]} color={C.first} w={4} head={14} halo={false} />; })}</g>
          <Streak2D P={P} tracks={HL.streaklines_10m_12utc.tracks} f={f} o={fin(f, t0)} />
          <Lbl x={lp[0]} y={lp[1]} t="L" c={LOW_C} s={T.calc} a="middle" />
          <Lbl x={hp[0]} y={hp[1]} t="H" c={HIGH_C} s={T.calc} a="middle" />
          {arc(lp, 130, false, fin(f, AT(k, 2, "anticlockwise")))}
          {/* fix loop 2 (review 2 cosmetic): the high's clockwise arc over its top and right side only (105° → −15°), all inside the map */}
          {arc(hp, 105, true, fin(f, t3), 105 * D2R, 120 * D2R)}
        </CiaranMap>
        <Arrow p={[1100, 120]} q={[1220, 120]} color={C.first} w={4} head={14} halo={false} o={fin(f, t0)} />
        <Lbl x={1240} y={120} t="wind" c={C.first} s={T.key} o={fin(f, t0) * fout(f, AT(k, 0, "ten metres") - 6, 6)} />
        <Lbl x={1240} y={120} t="wind 10 m up" c={C.first} s={T.key} o={fin(f, AT(k, 0, "ten metres"))} />
        <Lbl x={1100} y={250} t="anticlockwise," c={C.key} s={T.key} o={fin(f, AT(k, 2, "anticlockwise"))} /><Lbl x={1100} y={305} t="seen from above" c={C.key} s={T.key} o={fin(f, AT(k, 2, "anticlockwise"))} />
        <Lbl x={1100} y={370} t="slightly inward" c={C.key} s={T.key} o={fin(f, AT(k, 2, "only slightly"))} />
        <Lbl x={1100} y={430} t="around the high: clockwise" c={C.key} s={T.key} o={fin(f, t3)} />
        <Keyword f={f} text="Coriolis effect →" at={[1100, 820]} appear={t5} s={T.key} />
      </Svg>
      {/* fix loop 1 (S3): the southern-hemisphere globe twice as large, the reversed (clockwise) arc with a big head */}
      <Globe cam={{ lat: -45, lon: HL.rings.sh_low.lon, dist: 3.4 }} box={{ x: 1440, y: 500, w: 400, h: 340 }} o={fin(f, t4)} coast={0.4} over={(G) => {
        if (!G.vis(HL.rings.sh_low.lat, HL.rings.sh_low.lon)) return null;
        const c = G.p(HL.rings.sh_low.lat, HL.rings.sh_low.lon);
        return <g>{arc(c, 85, true, 1)}<Lbl x={c[0]} y={c[1]} t="L" c={LOW_C} s={T.key} a="middle" /></g>;
      }} />
      <Svg><Lbl x={1100} y={560} t="south: reversed" c={C.key} s={T.key} o={fin(f, t4)} /><SrcLine id="s44_round_lows" /></Svg>
    </Scene>
  );
};

// ================================================================ s45-s50 air masses and fronts (ERA5 850 hPa)
const C8NY = 141, C8NX = 221;
const C8B: [number, number, number, number] = [30, 65, -40, 15];
const useC8 = () => useVars(staticFile("wb_ciaran_850.bin"), C8);
const T850Map: React.FC<{ f: number; url: string | null; o?: number; B?: MapBox; id: string; children?: React.ReactNode; fieldO?: number }> = ({ url, o = 1, B = MAPB, id, children, fieldO = 0.75 }) => {
  const P = mapP(B);
  return o <= 0 ? null : (
    <g opacity={o}>
      <defs><clipPath id={id}><rect x={B.x} y={B.y} width={B.w} height={B.h} /></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        <GeoImage P={P} href={IMG.tc1101} box={BOX_TC1101} />
        {url ? <GeoImage P={P} href={url} box={C8B} o={fieldO} /> : null}
        <path d={linesPath(P, LN.ciaran_coast_10m)} fill="none" stroke={C.key} strokeOpacity={0.75} strokeWidth={1.6} />
        <path d={linesPath(P, LN.ciaran_borders_10m)} fill="none" stroke={C.key} strokeOpacity={0.4} strokeWidth={1.2} />
        {children}
      </g>
      <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="none" stroke={C.grid} strokeWidth={3} />
    </g>
  );
};
const S45: React.FC = () => {
  const f = useCurrentFrame(), k = K("s45_air_masses");
  const v = useC8(), g = useGlobal();
  const url = useFieldURL(v?.t18, C8NY, C8NX, LUT_THERMAL, -5, 15);
  const tTex = useFieldTex(g?.t2m, GNY, GNX, LUT_THERMAL, -30, 35, 1, true);
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), tX = AT(k, 4, "towards France") + 20;
  const P = mapP(MAPB);
  const grid = [["polar", "maritime"], ["polar", "continental"], ["tropical", "maritime"], ["tropical", "continental"]];
  return (
    <Scene>
      {/* UF1 R4: the camera goes where the words go (far north, tropical seas, France), then the 850-hPa chart */}
      <Globe cam={globePath([{ f: 0, lat: 45, lon: -20, dist: 3.6 }, { f: AT(k, 1, "far north"), lat: 70, lon: -30, dist: 3.4 }, { f: AT(k, 1, "tropical seas"), lat: 18, lon: -40, dist: 3.4 },
        { f: AT(k, 4, "towards France"), lat: 48, lon: -12, dist: 3.4 }], f)} field={tTex} fieldO={0.75} o={fout(f, tX)} />
      <MapImg o={fin(f, tX, 20)} layers={[{ n: "t850_base", o: 1 }, { n: "t850_places", o: 1 }, { n: "t850_masses", o: fin(f, AT(k, 4, "tropical air")) }]} />
      <Svg>
        {void url}{void P}
        {/* fix loop 1 (M2): the two kinds of air are named in the maths zone in S0-S1, before "air mass" */}
        <Lbl x={1100} y={140} t="temperature + moisture" c={C.key} s={T.key} o={win(f, AT(k, 0, "temperature"), AT(k, 2, "air mass") - 10)} />
        <Lbl x={1100} y={230} t="far north: cold, dry" c={C.local} s={T.key} o={win(f, AT(k, 1, "cold and dry"), t2)} />
        <Lbl x={1100} y={300} t="tropical seas: warm, moist" c={C.second} s={T.key} o={win(f, AT(k, 1, "warm and moist"), t2)} />
        <Keyword f={f} text="air mass" at={[1100, 140]} appear={AT(k, 2, "air mass")} out={t4} s={T.calc} />
        <Lbl x={1100} y={230} t="> 1000 km across" c={C.key} s={T.key} o={win(f, t2, t4)} />
        {/* UF1 fix 1 (review 1 S3): the four names, each on its word, kept until the map comes in */}
        <Lbl x={1100} y={340} t="polar" c={C.local} s={T.key} o={win(f, AT(k, 3, "polar"), tX)} />
        <Lbl x={1100 + textW("polar · ", T.key)} y={340} t="or tropical" c={C.second} s={T.key} o={win(f, AT(k, 3, "tropical"), tX)} />
        <Lbl x={1100} y={430} t="maritime: from the sea" c="#7cc4ff" s={T.key} o={win(f, AT(k, 3, "maritime"), tX)} />
        <Lbl x={1100} y={510} t="continental: from land" c={C.gold} s={T.key} o={win(f, AT(k, 3, "continental"), tX)} />
        {void grid}
        <ColourBar x={1360} y={150} w={380} lut={LUT_THERMAL} lo={-6} hi={16} ticks={[{ v: -5, t: "−5" }, { v: 15, t: "15" }]} unit="°C" o={fin(f, tX)} title="850-hPa temperature" />
        <ColourBar x={1120} y={730} w={560} lut={LUT_THERMAL} lo={-30} hi={35} ticks={[{ v: -30, t: "−30" }, { v: 0, t: "0" }, { v: 30, t: "30" }]} unit="°C" o={fout(f, tX)} title="2-m temperature" />
        <Lbl x={1340} y={330} t="≈ 1.5 km up" c={C.key} s={T.floor} o={fin(f, tX)} />
        <Lbl x={1340} y={400} t="1 Nov 2023" c={C.key} s={T.floor} o={fin(f, tX)} />
        <SrcLine id="s45_air_masses" i={0} o={fout(f, tX)} />
        <SrcLine id="s45_air_masses" i={1} o={fin(f, tX)} w={1200} />
      </Svg>
      {void t1}
    </Scene>
  );
};
const TR = FR.transect;
const S46: React.FC = () => {
  const f = useCurrentFrame(), k = K("s46_fronts");
  const v = useC8();
  const url = useFieldURL(v?.t18, C8NY, C8NX, LUT_THERMAL, -5, 15);
  const P = mapP(MAPB);
  const t1 = SS(k, 1), t2 = SS(k, 2), t4 = SS(k, 4), t5 = SS(k, 5);
  const A: Ax = { x: 1400, y: 110, w: 380, h: 300, xr: [-400, 400], yr: [Math.floor(TR.cold_plateau_C - 1), Math.ceil(TR.warm_plateau_C + 1)] };
  const X = axX(A), Y = axY(A);
  const draw = clamp((f - SS(k, 0)) / 60, 0, 1), n = Math.max(2, Math.round(TR.s_km.length * draw));
  const [s10, s90] = TR.s10_s90_km;
  return (
    <Scene>
      <MapImg layers={[{ n: "t850_base", o: 1 }, { n: "t850_places", o: 1 }, { n: "t850_transect", o: fin(f, 10) }]} />
      <Svg>
        {void url}{void P}
        {/* fix loop 1 (S9): y ticks every 5 °C so the size of the step can be read */}
        <Axes A={A} xt={[-400, 0, 400]} yt={[0, 5, 10, 15].filter((v) => v >= A.yr[0] && v <= A.yr[1])} xl="km" yl="°C" grid={false} />
        <path d={poly((TR.s_km as number[]).slice(0, n).map((s, i) => [X(s), Y(TR.T850_C[i])] as Pt))} fill="none" stroke={C.second} strokeWidth={6} />
        <g opacity={fin(f, t1)}>
          <rect x={X(s10 ?? -50)} y={A.y} width={X(s90 ?? 50) - X(s10 ?? -50)} height={A.h} fill={C.gold} opacity={0.18} />
          <Lbl x={1340} y={565} t={`front ≈ ${fmt(TR.width_10_90_km, 0)} km`} c={C.gold} s={T.key} />
        </g>
        <Lbl x={1340} y={628} t="T and wind change" c={C.key} s={T.floor} o={fin(f, t2)} />
        <Lbl x={1340} y={686} t="cold air advancing" c={C.key} s={T.floor} o={fin(f, t4)} /><Lbl x={1340} y={734} t="→ cold front" c={C.key} s={T.floor} o={fin(f, t4)} />
        <Lbl x={1340} y={792} t="warm air advancing" c={C.key} s={T.floor} o={fin(f, t5)} /><Lbl x={1340} y={840} t="→ warm front" c={C.key} s={T.floor} o={fin(f, t5)} />
        <ColourBar x={120} y={150} w={360} lut={LUT_THERMAL} lo={-6} hi={16} ticks={[{ v: -5, t: "−5" }, { v: 15, t: "15" }]} unit="°C" title="850-hPa temperature" />
        <SrcLine id="s46_fronts" w={1200} />
      </Svg>
    </Scene>
  );
};
// ---------------------------------------------------------------- s47-s48 the real ERA5 slice along 48.5N (UF1 U-WB-31, R2, R3)
/** world: x = distance along the slice / 100 km, z = height km × 0.8 (heights ×80, W72, said in s48 S6), y = north
 * (the 850-hPa map lies flat under the wall); the wall carries the T anomaly (balance, ±8 °C) with saturated air
 * whitened; ~1500 dots follow RK4 tracks of the in-slice wind (builder: diag.sections.in_section_tracks, w ×80 like z) */
const SL = UF.slice, SC = UF.slice_cf, SLX = SL.XS, SLZK = SL.ZS;
// UF1 fix 1 (v4 review 1 M1): s47 uses its own slice along 46.5N (through the map's analysed cold front, W70/W77); s48 the 48.5N slice
const sliceOf = (warm: boolean) => (warm ? SL : SC);
const mkSlx = (D: any) => (lon: number) => (lon - D.lon0) * Math.cos(D.lat * D2R) * 111.32 * SLX;
const mkSly = (D: any) => (lat: number) => (lat - D.lat) * 111.32 * SLX;
const useSliceTex = (v: Record<string, Float32Array> | null, D: any) => React.useMemo(() => {
  if (!v) return null;
  const nx = D.ns, nz = D.nz, d = new Uint8Array(nx * nz * 4), cl = new Uint8Array(nx * nz * 4);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const a = v.anom[j * nx + i], rh = v.rh[j * nx + i], q = 4 * (j * nx + i);
    const c = lutAt(LUT_BAL, (a + 8) / 16), wet = rh >= D.rh_cloud ? 0.4 : 0;
    d[q] = c[0] + (255 - c[0]) * wet; d[q + 1] = c[1] + (255 - c[1]) * wet; d[q + 2] = c[2] + (255 - c[2]) * wet; d[q + 3] = 235;
    cl[q] = 255; cl[q + 1] = 255; cl[q + 2] = 255; cl[q + 3] = rh >= D.rh_cloud ? 150 : 0;
  }
  const mk = (b: Uint8Array) => { const t = new THREE.DataTexture(b, nx, nz, THREE.RGBAFormat); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; return t; };
  return { field: mk(d), cloud: mk(cl) };
}, [v, D]);
const SliceScene: React.FC<{ warm: boolean }> = ({ warm }) => {
  const f = useCurrentFrame(), k = K(warm ? "s48_warm_front" : "s47_cold_front");
  const D = sliceOf(warm), LENK = D.length_km as number;
  const slx = mkSlx(D), sly = mkSly(D);
  const v = useVars(staticFile(warm ? "wb_slice.bin" : "wb_slice_cf.bin"), warm ? SLJ : SCJ);
  const tx = useSliceTex(v, D);
  const c8 = useC8();
  const mapTex = useFieldTex(c8?.t18, C8NY, C8NX, LUT_THERMAL, -5, 15, 1, false);
  // s47: top-down while S2 names the line and the map's cold front (blue, with a gold ring where the slice crosses it); the wall
  // rises at the end of S2, before S3 explains the colours
  const tMapF = warm ? -999 : AT(k, 1, "across the Bay"), tCross = warm ? -999 : AT(k, 1, "cold front on the map");
  const tRise = warm ? -999 : SE(k, 1) - 30, rise = warm ? 1 : easeIO(clamp((f - tRise) / 75, 0, 1));
  const VB = { x: 80, y: 40, w: 1760, h: 780 };
  // the front: a straight least-squares fit s = a z + b (km); cold: 850-650 hPa, the lowest kilometre (900-875 hPa) dashed
  const CF = SC.cold_front, WF = SL.warm_front;
  const fa = warm ? (WF.slope_km_per_km as number) : (CF.fit_a_km_per_km as number), fb = warm ? (WF.s_ground_km as number) : (CF.fit_b_km as number);
  const fz0 = warm ? 0 : (CF.fit_z_km[0] as number), fz1 = warm ? Math.max(...(WF.z_m as number[])) / 1000 : (CF.fit_z_km[1] as number) + 0.3;
  const fitS = (z: number) => fa * z + fb;
  const low: [number, number][] = warm ? [] : (CF.traced as any[]).filter((p) => p.hPa >= 850).map((p) => [p.s_km, p.z_m / 1000] as [number, number]); // z ascending: 900, 875, 850 hPa
  const frontS = (z: number) => (warm || z >= fz0 || low.length < 2 ? fitS(z) : interp(z, [0, ...low.map((p) => p[1])], [low[0][0], ...low.map((p) => p[0])]));
  const W0: V3 = [LENK * SLX / 2, 0, 2.6];
  const zoomC: V3 = [fitS(2.0) * SLX + 0.2, 0, 2.4];
  const keys: OrbitKey[] = warm
    ? [{ f: 0, az: -98, el: 12, dist: 15, target: [6.0, 0, 2.6] }, { f: 75, az: -96, el: 11, dist: 10.5, target: [10.0, 0, 2.2] }, { f: LEN(k), az: -92, el: 11, dist: 10.5, target: [10.2, 0, 2.2], linear: true }]
    : [{ f: 0, az: -90, el: 84, dist: 24, target: [W0[0], -0.5, 0] }, { f: Math.max(1, tRise), az: -90, el: 84, dist: 24, target: [W0[0], -0.5, 0] },
      { f: tRise + 75, az: -98, el: 12, dist: 14, target: W0 }, { f: SS(k, 4), az: -98, el: 12, dist: 14, target: W0 },
      { f: SS(k, 4) + 50, az: -100, el: 10, dist: 7.2, target: zoomC }, { f: SS(k, 7) - 10, az: -97, el: 10, dist: 7.6, target: [zoomC[0] + 0.3, 0, 2.2] },
      { f: LEN(k), az: -98, el: 12, dist: 14, target: W0 }];
  const st = orbitCam(orbitPath(keys, f), [VB.w / 2, VB.h / 2]);
  const pr = projector(st, VB.w, VB.h, VB.x, VB.y);
  const W = (s_km: number, z_km: number): Pt => pr.p([s_km * SLX, -0.02, z_km * SLZK]);
  const outline = [fz0, (fz0 + fz1) / 2, fz1].map((z) => W(fitS(z), z));
  const lowLine = warm ? [] : [[low[0][0], 0] as [number, number], ...low].map(([s, z]) => W(s, z));
  const tOut = warm ? SS(k, 2) : SS(k, 4), tTri = warm ? SS(k, 2) + 20 : SS(k, 5), tLift = warm ? AT(k, 2, "glides up") : AT(k, 5, "lifts the warm air");
  const tCl = warm ? AT(k, 3, "layered cloud") : AT(k, 6, "tall clouds"), tGW = warm ? SS(k, 4) : SS(k, 7), tAir = warm ? SS(k, 1) : SS(k, 3);
  // particles
  const parts: React.ReactNode[] = [];
  if (v && rise >= 1) {
    const NP = D.particles.n, NT = NP * D.particles.generations, NS = D.particles.nsteps, L = 90;
    const hi = fin(f, tLift);
    for (let p = 0; p < NP; p++) {
      const a = f / L + ((p * 0.6180339887) % 1), g = Math.floor(a) % 3, tau = a - Math.floor(a), sg = tau * NS, tr = p + g * NP;
      const at = (sx: number): [number, number] | null => { const i0 = Math.min(NS - 1, Math.floor(sx)), w = sx - i0;
        const s0 = v.trs[i0 * NT + tr], s1 = v.trs[(i0 + 1) * NT + tr], z0 = v.trz[i0 * NT + tr], z1 = v.trz[(i0 + 1) * NT + tr];
        if (!Number.isFinite(s0) || !Number.isFinite(s1)) return null; return [s0 + (s1 - s0) * w, z0 + (z1 - z0) * w]; };
      const h = at(sg), t0 = at(Math.max(0, sg - 2.4));
      if (!h || !t0 || h[1] > 8 || h[1] < 0) continue;
      const fs = frontS(h[1]);
      const lifted = warm ? h[0] > fs - 60 && h[1] - t0[1] > 0.02 && h[1] > 0.4 : h[0] > fs && h[0] < fs + 220 && h[1] - t0[1] > 0.03;
      const o = Math.min(1, 5 * tau, 5 * (1 - tau)) * (lifted && hi > 0 ? 1 : 0.6);
      const A = W(t0[0], t0[1]), B = W(h[0], h[1]);
      parts.push(<line key={p} x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={lifted && hi > 0 ? C.gold : C.key} strokeOpacity={o} strokeWidth={lifted && hi > 0 ? 3.5 : 2.6} strokeLinecap="round" />);
    }
  }
  // the slope triangle (data: 1 km up per 50 km, both fronts here) and, for the warm front, its true-scale twin (s48 S6)
  const sp = (warm ? WF.spoken : CF.spoken) as number, zt0 = warm ? 1.2 : 1.9, st0 = fitS(zt0);
  const tA = W(st0, zt0), tB = W(st0, zt0 + 1), tC = W(st0 + (warm ? sp : -sp), zt0 + 1);
  const tw = fin(f, warm ? AT(k, 5, "eighty times taller") : 1e9);
  const twA = W(st0 + 230, zt0 + 1.7), twB = W(st0 + 230 + sp, zt0 + 1.7 + 1 / 80);
  const gw = D.ground_winds, gk = warm ? ["warm_behind", "warm_ahead"] : ["cold_behind", "cold_ahead"];
  const brest = warm ? W(SL.brest_s_km, 0) : pr.p([slx(BREST[1]), sly(BREST[0]), 0.01]);
  const ground0 = W(0, 0), ground1 = W(LENK, 0);
  // s47: the map's analysed 850-hPa cold front (fronts.json) on the map under the slice — the slice crosses it (W77)
  const cfMap = !warm ? (FR.cold_front.lat as number[]).map((la, i) => pr.p([slx(FR.cold_front.lon[i]), sly(la), 0.01])) : [];
  const cross = !warm ? W(CF.map_cross_s_km, 0) : null;
  const cfO = !warm ? 0.95 * fin(f, tMapF) * (1 - 0.7 * rise) : 0;
  const brestDy = warm ? 40 : -26;
  return (
    <Scene>
      <View3D st={st} x={VB.x} y={VB.y} w={VB.w} h={VB.h} amb={1.6} dir={0.6}>
        <MapPlane tex={mapTex} x0={slx(-40)} x1={slx(15)} y0={sly(30)} y1={sly(65)} z={-0.01} o={1} dim={0.75} />
        <SliceWall tex={tx?.field ?? null} x0={0} x1={LENK * SLX} z0={0} z1={8 * SLZK} rise={rise} />
        <SliceWall tex={tx?.cloud ?? null} x0={0} x1={LENK * SLX} z0={0} z1={8 * SLZK} rise={rise} o={0.9 * pulse(f, tCl, 40)} />
      </View3D>
      <Svg>
        <defs><clipPath id={`slc${warm ? 1 : 0}`}><rect x={VB.x} y={VB.y} width={VB.w} height={VB.h} /></clipPath></defs>
        <g clipPath={`url(#slc${warm ? 1 : 0})`}>
          {cfO > 0 ? <g opacity={cfO}><path d={poly(cfMap)} fill="none" stroke={C.bg} strokeWidth={11} /><path d={poly(cfMap)} fill="none" stroke="#4f7fd8" strokeWidth={7} />
            {cross ? <circle cx={cross[0]} cy={cross[1]} r={22} fill="none" stroke={C.gold} strokeWidth={6} opacity={fin(f, tCross)} /> : null}</g> : null}
          <line x1={ground0[0]} y1={ground0[1]} x2={ground1[0]} y2={ground1[1]} stroke={C.gold} strokeWidth={warm ? 3 : 7} opacity={warm ? 0.6 : fout(f, tRise + 60, 20) * 0.9 + 0.4} />
          {parts}
          <g opacity={fin(f, tOut)}>
            {!warm ? <><path d={poly(lowLine)} fill="none" stroke={C.bg} strokeWidth={9} strokeLinejoin="round" /><path d={poly(lowLine)} fill="none" stroke={C.gold} strokeWidth={5} strokeDasharray="12 10" strokeLinejoin="round" /></> : null}
            <path d={poly(outline)} fill="none" stroke={C.bg} strokeWidth={11} strokeLinecap="round" /><path d={poly(outline)} fill="none" stroke={C.gold} strokeWidth={6} strokeLinecap="round" /></g>
          <g opacity={fin(f, tTri)}><path d={`M${tA[0]} ${tA[1]} L${tB[0]} ${tB[1]} L${tC[0]} ${tC[1]}`} fill="none" stroke={C.gold} strokeWidth={5} />
            <Lbl x={tB[0] + (warm ? -14 : 14)} y={(tA[1] + tB[1]) / 2} t="1 km" c={C.gold} s={T.floor} a={warm ? "end" : "start"} />
            <Lbl x={warm ? (tB[0] + tC[0]) / 2 : tC[0] - 14} y={tB[1] - (warm ? 44 : 30)} t={`${sp} km`} c={C.gold} s={T.floor} a={warm ? "middle" : "end"} /></g>
          <g opacity={tw}><line x1={twA[0]} y1={twA[1]} x2={twB[0]} y2={twB[1]} stroke={C.gold} strokeWidth={5} />
            <Lbl x={(twA[0] + twB[0]) / 2} y={twA[1] - 34} t="true slope" c={C.gold} s={T.floor} a="middle" /></g>
          {gk.map((key, i) => { const g = gw[key], p0 = pr.p([g.s_km * SLX - g.u * 0.03, -g.v * 0.03 - 0.3, 0.02]), p1 = pr.p([g.s_km * SLX + g.u * 0.03, g.v * 0.03 - 0.3, 0.02]);
            const lx = p1[0] + (i ? 60 : -60), near = warm && Math.abs(lx - brest[0]) < 150;
            return <g key={key} opacity={fin(f, tGW + i * 20)}><Arrow p={p0} q={p1} color={C.first} w={8} head={30} /><Lbl x={near ? brest[0] + 170 : lx} y={warm ? Math.min(VB.y + VB.h - 28, p1[1] + 44) : Math.min(VB.y + VB.h - 60, p1[1] - 46)} t={`from ${g.from}`} c={C.first} s={T.floor} a="middle" /></g>; })}
          <g opacity={warm ? 1 : fin(f, tMapF) * (1 - rise)}>{warm ? <line x1={brest[0]} y1={brest[1] - 14} x2={brest[0]} y2={brest[1] + 14} stroke={C.gold} strokeWidth={5} /> : <circle cx={brest[0]} cy={brest[1]} r={8} fill={C.key} stroke={C.bg} strokeWidth={3} />}
            <Lbl x={brest[0] + (warm ? 0 : 16)} y={brest[1] + brestDy} t="Brest" c={C.key} s={T.floor} a={warm ? "middle" : "start"} /></g>
        </g>
        {/* labels on their words */}
        {!warm ? <g>
          <Lbl x={W(fitS(1.4) - 380, 1.2)[0]} y={W(fitS(1.4) - 380, 1.2)[1]} t="cold air" c={C.local} s={T.key} a="middle" o={fin(f, tAir)} />
          <Lbl x={W(fitS(2.6) + 330, 2.6)[0]} y={W(fitS(2.6) + 330, 2.6)[1]} t="warm air" c={C.second} s={T.key} a="middle" o={fin(f, tAir)} />
          <Lbl x={outline[2][0] + 24} y={outline[2][1] - 30} t="cold front" c={C.gold} s={T.key} o={fin(f, tOut)} />
          <Lbl x={120} y={100} t="cold 1.29 · warm 1.16 kg/m³" c={C.key} s={T.floor} o={fin(f, SS(k, 3))} />
          <Keyword f={f} text="cold front on the map" at={[120, 100]} appear={tCross} out={SS(k, 3) - 8} s={T.floor} c="#8fb1ff" />
          <Keyword f={f} text="slice along 46.5°N" at={[120, 170]} appear={AT(k, 1, "a real slice")} out={SS(k, 2) - 8} s={T.floor} />
          <Keyword f={f} text="tall clouds, heavy showers" at={[120, 170]} appear={tCl} out={SS(k, 7) - 6} s={T.floor} />
          <Keyword f={f} text="behind: colder, drier" at={[120, 170]} appear={SS(k, 7)} s={T.floor} o={1} />
        </g> : <g>
          <Lbl x={W(1250, 4.2)[0]} y={W(1250, 4.2)[1]} t="warm air" c={C.second} s={T.key} a="middle" o={fin(f, tAir)} />
          <Lbl x={W(1400, 0.6)[0]} y={W(1400, 0.6)[1]} t="cold air" c={C.local} s={T.key} a="middle" o={fin(f, tAir)} />
          <Lbl x={outline[0][0] - 20} y={outline[0][1] - 40} t="warm front" c={C.gold} s={T.key} a="end" o={fin(f, tOut)} />
          <Keyword f={f} text="a second slice, through Brest" at={[120, 110]} appear={0} out={SS(k, 3) - 8} s={T.floor} />
          <Keyword f={f} text="layered cloud · steady rain" at={[120, 110]} appear={tCl} s={T.floor} />
          <Keyword f={f} text="behind: milder, moister" at={[120, 180]} appear={SS(k, 4)} s={T.floor} />
        </g>}
        <ColourBar x={1180} y={120} w={400} lut={LUT_BAL} lo={-8} hi={8} ticks={[{ v: -8, t: "−8" }, { v: 0, t: "0" }, { v: 8, t: "+8" }]} unit="°C" title="colder / warmer than average" o={rise} />
        <SrcLine id={warm ? "s48_warm_front" : "s47_cold_front"} w={1700} />
      </Svg>
    </Scene>
  );
};
const S47: React.FC = () => <SliceScene warm={false} />;
const S48: React.FC = () => <SliceScene warm />;
/** front symbols along a polyline (screen points); `side` +1/−1 = left/right of the direction of travel along the line */
const FrontSymbols: React.FC<{ pts: Pt[]; kind: "warm" | "cold"; sideOf: (p: Pt, d: Pt) => number; o: number }> = ({ pts, kind, sideOf, o }) => {
  if (o <= 0 || pts.length < 2) return null;
  const col = kind === "cold" ? "#4f7fd8" : "#d9464f";
  const out: React.ReactNode[] = [];
  let acc = 0, next = 30;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    while (acc + L >= next) {
      const t = (next - acc) / L, p: Pt = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], d: Pt = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
      const s = sideOf(p, d), n: Pt = [-d[1] * s, d[0] * s], h = 20;
      out.push(kind === "cold"
        ? <polygon key={out.length} points={`${p[0] - d[0] * h},${p[1] - d[1] * h} ${p[0] + d[0] * h},${p[1] + d[1] * h} ${p[0] + n[0] * h * 1.3},${p[1] + n[1] * h * 1.3}`} fill={col} stroke={C.key} strokeWidth={2} />
        : <path key={out.length} d={`M${p[0] - d[0] * h} ${p[1] - d[1] * h} A ${h} ${h} 0 0 ${s > 0 ? 0 : 1} ${p[0] + d[0] * h} ${p[1] + d[1] * h} Z`} fill={col} stroke={C.key} strokeWidth={2} />);
      next += 80;
    }
    acc += L;
  }
  return <g opacity={o}><path d={poly(pts)} fill="none" stroke={col} strokeWidth={7} />{out}</g>;
};
const sideFrom = (P: (la: number, lo: number) => Pt, la21: number[], lo21: number[]) => {
  const q = la21.map((la, i) => P(la, lo21[i]));
  return (p: Pt, d: Pt) => {
    let best = q[0], bd = 1e9;
    for (const c of q) { const dd = Math.hypot(c[0] - p[0], c[1] - p[1]); if (dd < bd) { bd = dd; best = c; } }
    const cr = d[0] * (best[1] - p[1]) - d[1] * (best[0] - p[0]);
    return cr >= 0 ? -1 : 1;
  };
};
const FrontsMap: React.FC<{ f: number; k: number; symbols: number; lines: number; turn: number }> = ({ f, symbols, lines, turn }) => {
  const v = useC8();
  const url = useFieldURL(v?.t18, C8NY, C8NX, LUT_THERMAL, -5, 15);
  const B: MapBox = { lat0: 38, lat1: 58, lon0: -26, lon1: 8, x: 80, y: 40, w: 1180, h: 820 };
  const P = mapP(B);
  const wf = FR.warm_front, cf = FR.cold_front;
  const wpts = (wf.lat as number[]).map((la, i) => P(la, wf.lon[i])), cpts = (cf.lat as number[]).map((la, i) => P(la, cf.lon[i]));
  const lat1 = C8.coords.lat1 as number[], lon1 = C8.coords.lon1 as number[];
  const arrows: React.ReactNode[] = [];
  if (v && turn > 0) lat1.forEach((la, j) => lon1.forEach((lo, i) => { if (la < 39 || la > 57 || lo < -25 || lo > 7 || (i + j) % 2) return;
    const u = v.u18_1deg[j * lon1.length + i], w = v.v18_1deg[j * lon1.length + i], p = P(la, lo);
    arrows.push(<Arrow key={`${j}_${i}`} p={p} q={[p[0] + u * 2.2, p[1] - w * 2.2]} color={C.first} w={4} head={14} halo={false} />); }));
  return (
    <T850Map f={f} url={url} B={B} id="frm">
      <g opacity={turn}>{arrows}</g>
      <path d={poly(wpts)} fill="none" stroke={C.gold} strokeWidth={7} opacity={lines * (1 - symbols)} />
      <path d={poly(cpts)} fill="none" stroke={C.gold} strokeWidth={7} opacity={lines * (1 - symbols)} />
      <FrontSymbols pts={wpts} kind="warm" sideOf={sideFrom(P, FR.warm_front_21.lat, FR.warm_front_21.lon)} o={symbols} />
      <FrontSymbols pts={cpts} kind="cold" sideOf={sideFrom(P, FR.cold_front_21.lat, FR.cold_front_21.lon)} o={symbols} />
      <Place p={P(BREST[0], BREST[1])} t="Brest" dx={-20} dy={-40} a="end" />
      <Lbl x={P(FR.low_18.lat, FR.low_18.lon)[0]} y={P(FR.low_18.lat, FR.low_18.lon)[1]} t="L" c={C.key} s={T.calc} a="middle" />
    </T850Map>
  );
};
/** UF1 U-WB-31: the s49-s50 wind particles on the 850-hPa chart — 3000 tracks from the builder (advect_on_sphere, frozen 18 UTC
 * field, 36 × 600 s), projected to the chart's pixels by tools/movie_wb/map_px.py (same cartostyle frame as the PNG layers).
 * Each particle lives 2 s (12 steps = 2 h of motion), three lives in a row continue one track (6 h in 6 s), then it restarts. */
const P850N = 3000, P850S = 37;
const Particles850: React.FC<{ f: number; o?: number }> = ({ f, o = 0.7 }) => {
  const buf = useBin(staticFile("wb_t850_particles_px.bin"));
  const P = React.useMemo(() => (buf ? new Float32Array(buf) : null), [buf]);
  if (!P || o <= 0) return null;
  const L = 60, out: React.ReactNode[] = [];
  for (let p = 0; p < P850N; p++) {
    const a = f / L + ((p * 0.6180339887) % 1), g = Math.floor(a) % 3, tau = a - Math.floor(a), sg = g * 12 + tau * 12;
    const at = (sx: number): Pt | null => { const i0 = Math.min(P850S - 2, Math.floor(sx)), w = sx - i0, q = (p * P850S + i0) * 2;
      const x0 = P[q], y0 = P[q + 1], x1 = P[q + 2], y1 = P[q + 3];
      if (!Number.isFinite(x0) || !Number.isFinite(x1)) return null; return [MAPF.x + x0 + (x1 - x0) * w, MAPF.y + y0 + (y1 - y0) * w]; };
    const h = at(sg), t0 = at(Math.max(g === 0 ? 0 : g * 12 - 3, sg - 3));
    if (!h || !t0 || h[0] < MAPF.x || h[0] > MAPF.x + MAPF.w || h[1] < MAPF.y || h[1] > MAPF.y + MAPF.h) continue;
    const fo = g === 0 ? Math.min(1, 6 * tau) : g === 2 ? Math.min(1, 6 * (1 - tau)) : 1;
    out.push(<line key={p} x1={t0[0]} y1={t0[1]} x2={h[0]} y2={h[1]} stroke="#f4ecd2" strokeOpacity={fo} strokeWidth={2.2} strokeLinecap="round" />);
  }
  return <Svg o={o}><defs><clipPath id="p850c"><rect x={MAPF.x} y={MAPF.y} width={MAPF.w} height={MAPF.h} /></clipPath></defs><g clipPath="url(#p850c)">{out}</g></Svg>;
};
const S49: React.FC = () => {
  const f = useCurrentFrame(), k = K("s49_real_fronts");
  const t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  return (
    <Scene>
      {/* UF1 U-WB-31: ~3000 wind particles (advect_on_sphere on the frozen 18 UTC 850-hPa wind) under the front lines */}
      <MapImg layers={[{ n: "t850_base", o: 1 }]} />
      <Particles850 f={f} o={0.7} />
      <MapImg layers={[{ n: "t850_wind", o: fin(f, t5) }, { n: "t850_lines_warm", o: fin(f, t3) }, { n: "t850_lines_cold", o: fin(f, t4) }, { n: "t850_places", o: 1 }]} />
      <Svg>
        <ColourBar x={1360} y={130} w={380} lut={LUT_THERMAL} lo={-6} hi={16} ticks={[{ v: -5, t: "−5" }, { v: 15, t: "15" }]} unit="°C" title="850-hPa temperature" />
        <SrcLine id="s49_real_fronts" w={1200} />
        <Lbl x={1340} y={300} t="≈ 1.5 km up" c={C.key} s={T.key} o={fin(f, SS(k, 1))} />
        <Keyword f={f} text="warm tongue" at={[1340, 400]} appear={SS(k, 2)} s={T.key} />
        <Lbl x={1340} y={500} t="warm front" c={C.key} s={T.key} o={fin(f, t3)} />
        <Lbl x={1340} y={580} t="cold front" c={C.key} s={T.key} o={fin(f, t4)} />
        <Lbl x={1340} y={680} t="wind turns" c={C.first} s={T.key} o={fin(f, t5)} />
      </Svg>
    </Scene>
  );
};
const S50: React.FC = () => {
  const f = useCurrentFrame(), k = K("s50_front_symbols");
  const t1 = SS(k, 1), ts = AT(k, 1, "blue triangles");
  return (
    <Scene>
      <MapImg layers={[{ n: "t850_base", o: 1 }]} />
      <Particles850 f={f + K("s50_front_symbols") * 0} o={0.4} />
      <MapImg layers={[{ n: "t850_lines", o: 1 - fin(f, ts, 20) }, { n: "t850_symbols", o: fin(f, ts, 20) }, { n: "t850_places", o: 1 }]} />
      <Svg>
        <ColourBar x={1360} y={800} w={380} lut={LUT_THERMAL} lo={-6} hi={16} ticks={[{ v: -5, t: "−5" }, { v: 15, t: "15" }]} unit="°C" title="850-hPa temperature" />
        <SrcLine id="s50_front_symbols" w={1200} />
        <Lbl x={1340} y={200} t="symbols: the side" c={C.key} s={T.floor} o={fin(f, SS(k, 0))} />
        <Lbl x={1340} y={260} t="it moves towards" c={C.key} s={T.floor} o={fin(f, SS(k, 0))} />
        <g opacity={fin(f, t1)}><polygon points="1350,420 1390,420 1370,385" fill="#5b9bff" /><Lbl x={1410} y={410} t="cold front" c={C.key} s={T.key} /></g>
        <g opacity={fin(f, AT(k, 1, "red half"))}><path d="M1350 520 A 20 20 0 0 1 1390 520 Z" fill="#ff5c5c" /><Lbl x={1410} y={510} t="warm front" c={C.key} s={T.key} /></g>
        <Keyword f={f} text="weather maps →" at={[1340, 700]} appear={SS(k, 2)} s={T.key} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s51-s53 the global picture
const S51: React.FC = () => {
  const f = useCurrentFrame(), k = K("s51_heating");
  const cv = useVars(staticFile("wb_climatology.bin"), CL);
  const t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const rolled = React.useMemo(() => { if (!cv) return null; const ny = CL.coords.tlat.length, nx = CL.coords.tlon.length, o = new Float32Array(ny * nx);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) o[j * nx + i] = cv.t2m_ann[j * nx + ((i + nx / 2) % nx)]; return o; }, [cv]);
  const tex = useFieldTex(rolled, CL.coords.tlat.length, CL.coords.tlon.length, LUT_THERMAL, -40, 30, 1, true);
  const dist = 3.8, R = silR(dist, GBOX.h), cx = GBOX.x + GBOX.w / 2, cy = GBOX.y + GBOX.h / 2;
  const beam = (lat: number, o: number, lab: string) => {
    const p: Pt = [cx - R * Math.cos(lat * D2R), cy - R * Math.sin(lat * D2R)], w = 40;
    const n: Pt = [-Math.cos(lat * D2R), -Math.sin(lat * D2R)], tg: Pt = [Math.sin(lat * D2R), -Math.cos(lat * D2R)], L = w / 2 / Math.cos(lat * D2R);
    return <g opacity={o}>
      <rect x={GBOX.x} y={p[1] - w / 2} width={p[0] - GBOX.x} height={w} fill={C.gold} opacity={0.45} />
      <line x1={p[0] - tg[0] * L} y1={p[1] - tg[1] * L} x2={p[0] + tg[0] * L} y2={p[1] + tg[1] * L} stroke={C.second} strokeWidth={12} />
      <Lbl x={p[0] + n[0] * -60 + 10} y={p[1] + (lat > 0 ? -60 : 50)} t={lab} c={C.key} s={T.key} />
    </g>;
  };
  return (
    <Scene>
      <Globe cam={globePath([{ f: 0, lat: 0, lon: 0, dist }, { f: t6, lat: 0, lon: 0, dist }, { f: LEN(k), lat: 5, lon: -40, dist: 3.8 }], f)} img={IMG.bmng} field={tex} fieldO={0.8 * fin(f, t5)} coast={0.35} />
      <Svg>
        {beam(0, win(f, t3, t5), "1 m")}
        {beam(60, win(f, t4, t5), "2 m")}
        {/* fix loop 1 (M2 3-10 s, r5 scan) */}
        <Lbl x={1100} y={140} t="the whole planet" c={C.key} s={T.key} o={win(f, AT(k, 0, "whole planet"), t2 - 8)} />
        <Lbl x={1100} y={240} t="why does weather move?" c={C.gold} s={T.key} o={win(f, AT(k, 0, "why the weather"), t2 - 8)} />
        <Lbl x={1100} y={140} t="equinox noon" c={C.key} s={T.key} o={fin(f, t2)} />
        <Lbl x={1100} y={440} t="half the sunlight per m²" c={C.gold} s={T.key} o={fin(f, AT(k, 4, "half as much"))} />
        <g opacity={fin(f, t5)}>
          {[1, -1].map((s) => <Arrow key={s} p={[cx + 40, cy - s * 40]} q={[cx + 40, cy - s * 300]} color={C.second} w={16} head={50} />)}
          <Lbl x={1100} y={560} t="heat carried poleward" c={C.key} s={T.key} />
          <ColourBar x={1120} y={680} w={560} lut={LUT_THERMAL} lo={-40} hi={30} ticks={[{ v: -40, t: "−40" }, { v: 0, t: "0" }, { v: 30, t: "30" }]} unit="°C" title="2-m temperature, 1991–2020 mean" />
        </g>
        <Lbl x={1100} y={590} t="storms like Ciarán" c={C.key} s={T.key} o={fin(f, t6)} />
        <SrcLine id="s51_heating" i={0} o={fout(f, t5)} />
        <SrcLine id="s51_heating" i={1} o={fin(f, t5)} />
      </Svg>
      <TeX s={EQ_S51} x={1100} y={300} size={T.calc} o={fin(f, AT(k, 4, "two metres"))} />
    </Scene>
  );
};
const CLNY = 94, CLNX = 192;
const S52: React.FC = () => {
  const f = useCurrentFrame(), k = K("s52_pressure_belts");
  const cv = useVars(staticFile("wb_climatology.bin"), CL);
  const tex = useFieldTex(cv?.mslp_ann, CLNY, CLNX, LUT_BAL, 990, 1036, 1, true);
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5);
  const cam = globePath([{ f: 0, lat: 5, lon: -40, dist: 3.8 }, { f: Math.round(LEN(k) * 0.55), lat: 5, lon: 10, dist: 3.8 }, { f: LEN(k), lat: 15, lon: -30, dist: 3.8 }], f);
  const highs = Object.entries(CL.highs) as [string, any][];
  return (
    <Scene>
      <Globe cam={cam} img={IMG.bmng} field={tex} fieldO={0.85} coast={0.4} over={(G) => <g>
        {(CL.isobars as IsoLevel[]).map((L) => <path key={L.level} d={coastPath(G, L.lines, undefined, 1.002)} fill="none" stroke={C.key} strokeOpacity={0.7} strokeWidth={2} />)}
        <LatCircle G={G} lat={30} c={C.gold} o={fin(f, t1)} w={4} dash="12 10" /><LatCircle G={G} lat={-30} c={C.gold} o={fin(f, t1)} w={4} dash="12 10" />
        {highs.map(([nm, h]) => G.vis(h.lat, h.lon) ? <Lbl key={nm} x={G.p(h.lat, h.lon)[0]} y={G.p(h.lat, h.lon)[1]} t="H" c={C.key} s={T.calc} a="middle" o={fin(f, t2)} /> : null)}
        {/* fix loop 1 (S7): the ITCZ draped on the sphere along the annual-mean MSLP trough (builder: climatology.json itcz_trough) */}
        <path d={llPath(G, (CL.itcz_trough.lon as number[]).map((lo, i) => [CL.itcz_trough.lat[i], lo] as [number, number]), 1.003)} fill="none" stroke={C.first}
          strokeWidth={16} strokeOpacity={0.85 * fin(f, t3)} strokeLinecap="round" />
      </g>} />
      <Svg>
        <ColourBar x={1120} y={130} w={560} lut={LUT_BAL} lo={990} hi={1036} ticks={[{ v: 990, t: "990" }, { v: 1013, t: "1013" }, { v: 1036, t: "1036" }]} unit="hPa" title="sea-level pressure, 1991–2020 mean" />
        <SrcLine id="s52_pressure_belts" />
        <Lbl x={1100} y={260} t="1991–2020 average" c={C.key} s={T.key} o={fin(f, SS(k, 0))} />
        <Keyword f={f} text="subtropical highs" at={[1100, 380]} appear={AT(k, 2, "subtropical highs")} s={T.calc} />
        <Lbl x={1100} y={470} t="≈ 30° N and S" c={C.gold} s={T.key} o={fin(f, t1)} />
        <Keyword f={f} text="intertropical" at={[1100, 580]} appear={t4} s={T.key} />
        <Lbl x={1100} y={645} t="convergence zone" c={C.key} s={T.key} o={fin(f, t4)} />
        <Lbl x={1100} y={725} t="ITCZ" c={C.first} s={T.calc} o={fin(f, t4 + 15)} />
        <Keyword f={f} text="general circulation →" at={[1100, 800]} appear={t5} s={T.key} />
      </Svg>
    </Scene>
  );
};
const S53: React.FC = () => {
  const f = useCurrentFrame(), k = K("s53_trades_westerlies");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4), t5 = SS(k, 5), t6 = SS(k, 6);
  const tracks = CL.streaklines.tracks as number[][][];
  const cam = globePath([{ f: 0, lat: 15, lon: -30, dist: 3.8 }, { f: t5, lat: 30, lon: -30, dist: 3.8 }, { f: LEN(k), lat: 40, lon: -20, dist: 3.4 }], f);
  const tr = HR.track;
  const Gs = globeProj(globeCam({ ...cam, pp: [GBOX.w / 2, GBOX.h / 2] }, [GBOX.w / 2, GBOX.h / 2]), GBOX.w, GBOX.h, GBOX.x, GBOX.y);
  const beltPt = (la: number, lo: number): Pt[] => (Gs.vis(la, lo) ? [Gs.p(la, lo, 1.003)] : []);
  return (
    <Scene>
      <Globe cam={cam} img={IMG.bmng} coast={0.4} over={(G) => <g>
        {/* fix loop 1 (S6): teal streaks that taper from tail to a bright arrowhead, so the direction reads in a still */}
        <g fill="none" strokeLinecap="round">
          {tracks.map((t, i) => { const n = t.length, ph = ((f + i * 13) % 60) / 60, h = Math.floor(ph * (n - 1));
            const seg = (t.slice(Math.max(0, h - 5), h + 1) as [number, number][]).filter(([la, lo]) => G.vis(la, lo, 1.003)).map(([la, lo]) => G.p(la, lo, 1.003));
            if (seg.length < 2) return null;
            const o = 0.95 * Math.sin(Math.PI * ph), a = seg[seg.length - 2], b = seg[seg.length - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
            const d: Pt = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], nn: Pt = [-d[1], d[0]], hl = 13, hw = 7;
            return <g key={i} opacity={o}>
              {seg.slice(1).map((q, j) => <line key={j} x1={seg[j][0]} y1={seg[j][1]} x2={q[0]} y2={q[1]} stroke={C.first} strokeWidth={1.5 + (3.5 * (j + 1)) / seg.length} strokeOpacity={0.35 + (0.65 * (j + 1)) / seg.length} />)}
              <polygon points={`${b[0] + d[0] * hl},${b[1] + d[1] * hl} ${b[0] + nn[0] * hw},${b[1] + nn[1] * hw} ${b[0] - nn[0] * hw},${b[1] - nn[1] * hw}`} fill="#9df0e6" />
            </g>; })}
        </g>
        {f >= t5 ? <SurfArrow G={G} pts={(tr.lat as number[]).map((la, i) => [la, tr.lon[i]] as [number, number])} c={C.gold} w={10} head={36} o={fin(f, t5)} /> : null}
      </g>} />
      <Svg>
        <Lbl x={1100} y={140} t="1991–2020 average wind" c={C.key} s={T.key} />
        <Keyword f={f} text="trade winds" at={[1100, 380]} appear={AT(k, 1, "trade winds")} s={T.calc} />
        {/* fix loop 1 (S6): gold pointers from each name to its belt on the globe (same camera as the globe); UF1 fix 1 (M2): names
            stacked in the belts' north-south order (westerlies, NE trades, SE trades) so the pointers never cross */}
        <Keyword f={f} text="north-east trades" at={[1100, 465]} appear={t2} s={T.key} targets={beltPt(15, -40)} />
        <Keyword f={f} text="south-east trades" at={[1100, 545]} appear={t3} s={T.key} targets={beltPt(-12, -20)} />
        <Keyword f={f} text="westerlies" at={[1100, 260]} appear={AT(k, 4, "westerlies")} s={T.calc} targets={beltPt(47, -30)} />
        <Lbl x={1100} y={660} t="storms travel west → east" c={C.gold} s={T.key} o={fin(f, t5)} />
        <Keyword f={f} text="Coriolis →" at={[1100, 800]} appear={t6} s={T.key} />
        <SrcLine id="s53_trades_westerlies" />
      </Svg>
      {void t1}{void t4}
    </Scene>
  );
};

// ================================================================ s54-s59 one storm over one town
const BX = HR.coords;
const HNY = 101, HNX = 161;
const S54: React.FC = () => {
  const f = useCurrentFrame(), k = K("s54_ciaran_intro");
  const t2 = SS(k, 2), t3 = SS(k, 3), t5 = SS(k, 5);
  // flight: space → the North Atlantic → western Europe, with the hourly ERA5 isobars sweeping on the globe (12 → 18 UTC 1 Nov)
  const cam = globePath([{ f: 0, lat: 40, lon: -20, dist: 3.4 }, { f: t2, lat: 48, lon: -9, dist: 1.75 }], f);
  const hF = clamp(f / Math.max(1, t2), 0, 1) * 6, hI = Math.min(24, Math.round(hF));
  const P = mapP(MAPB);
  return (
    <Scene>
      <Globe cam={cam} boxed o={fout(f, t2, 20)} over={(G) => <g>
        {(HR.isobars[hI].levels as IsoLevel[]).map((L) => <path key={L.level} d={coastPath(G, L.lines, undefined, 1.002)} fill="none" stroke={C.key} strokeOpacity={0.75} strokeWidth={2.2} />)}
        {G.vis(BREST[0], BREST[1]) ? <Place p={G.p(BREST[0], BREST[1])} t="Brest" o={limb(G, BREST[0], BREST[1]) * fin(f, AT(k, 1, "towards Europe"))} /> : null}
      </g>} />
      <Svg>
        <CiaranMap id="s54m" img={IMG.tc1101} imgBox={BOX_TC1101} o={fin(f, t2, 20)}>
          <Place p={P(BREST[0], BREST[1])} t="Brest" o={fin(f, t3)} />
        </CiaranMap>
        {/* fix loop 1 (M2 3-10 s, r5 scan) */}
        <Lbl x={1100} y={200} t="one storm · one town" c={C.key} s={T.key} o={win(f, AT(k, 0, "one real storm"), AT(k, 1, "Storm") - 8)} />
        <Keyword f={f} text="Storm Ciarán · 1 Nov 2023" at={[1100, 200]} appear={AT(k, 1, "Storm")} s={T.key} />
        <Lbl x={1100} y={320} t="satellite, afternoon" c={C.key} s={T.key} o={fin(f, t2)} />
        <Keyword f={f} text="UTC = universal time" at={[1100, 700]} appear={t5} s={T.key} />
        <ClockGlyph x={1700} y={700} r={34} h={12} o={fin(f, t5)} />
        <SrcLine id="s54_ciaran_intro" />
      </Svg>
    </Scene>
  );
};
/** the hourly panel (s55-s58): isobars, fronts, 10-m wind and the low at fractional hour h (0 = 12 UTC 1 Nov) */
const HMB: MapBox = { lat0: 39, lat1: 60, lon0: -30, lon1: 10, x: 80, y: 40, w: 920, h: 700 };
/** fix loop 2 (review 2 N-M2): the builder draws the warm + cold pair only while both are the attached textbook fronts
 * (12-21 UTC 1 Nov, `shown`); past the last shown hour they fade out over one hour and the map keeps isobars, low and track */
const FR_LAST = (FR.hourly as any[]).reduce((m: number, r: any, i: number) => (r.shown ? i : m), -1);
const frontFade = (h: number) => clamp(FR_LAST + 1 - h, 0, 1);
const HourMap: React.FC<{ h: number; B?: MapBox; id: string; fronts?: number; fw?: number; fc?: number; wind?: number; track?: number; children?: React.ReactNode;
  brestArrow?: number; brestLabel?: number; frontO?: number }> = ({ h, B = MAPB, id, fronts = 1, fw, fc, wind = 0.8, track = 1, children, brestArrow = 0, brestLabel = 0,
  frontO }) => {
  const P = mapP(B), i = Math.max(0, Math.min(24, Math.round(h)));
  const tr = HR.track, n = Math.min(25, Math.floor(h) + 1);
  const lat = interp(h, tr.lat.map((_: number, q: number) => q), tr.lat), lon = interp(h, tr.lon.map((_: number, q: number) => q), tr.lon);
  const oW = fw ?? fronts, oC = fc ?? fronts;
  // fix loop 1 (M3/M4): the track is Ciarán's own centre (continuity tracker) and ends at the current centre; the fronts are the
  // frontal zone attached to it (builder fronts.json hourly); the L gets a dark halo so the track does not run under it
  const trackLa = [...tr.lat.slice(0, n), lat], trackLo = [...tr.lon.slice(0, n), lon];
  const W = HR.wind_1p5, fh = FR.hourly[Math.max(0, Math.min(i, FR_LAST))], ff = frontO ?? frontFade(h);
  // fix loop 3 (review 3 cosmetic): within ~75 px of Brest's ring the L glyph slides up to 30 px up-left (smoothly), so it is not half
  // hidden under the ring at 00-03 UTC; the track still ends at the real centre
  const pL = P(lat, lon), pB = P(BREST[0], BREST[1]), dLB = Math.hypot(pL[0] - pB[0], pL[1] - pB[1]), offL = 30 * clamp((75 - dLB) / 25, 0, 1) / Math.SQRT2;
  const bi = 12 + i; // brest_hourly index (starts 00 UTC 1 Nov)
  return (
    <CiaranMap id={id} B={B} img={IMG.tc1101} imgBox={BOX_TC1101} dim={0.6} iso={HR.isobars[i].levels}>
      <g opacity={wind}>{(W.lat as number[]).map((la, j) => (W.lon as number[]).map((lo, q) => { if ((j + q) % 2) return null; const u = W.u[i][j][q], v = W.v[i][j][q], p = P(la, lo);
        return <Arrow key={`${j}_${q}`} p={p} q={[p[0] + u * 2.5, p[1] - v * 2.5]} color={C.first} w={3.5} head={12} halo={false} />; }))}</g>
      {oW * ff > 0 && fh.warm ? <path d={llLine(P, fh.warm[0], fh.warm[1])} fill="none" stroke="#d9464f" strokeWidth={7} opacity={oW * ff} /> : null}
      {oC * ff > 0 && fh.cold ? <path d={llLine(P, fh.cold[0], fh.cold[1])} fill="none" stroke="#4f7fd8" strokeWidth={7} opacity={oC * ff} /> : null}
      {/* fix loop 2 (review 2 cosmetic): one H/L style (pink letter + dark halo, as the map layers); the track stops 34 px short of
          the letter instead of a dark disc, and Brest's ring is drawn OVER the L with a dark outline, so the L never hides the dot */}
      {track > 0 ? <path d={poly(trimEnd(trackLa.map((la, q) => P(la, trackLo[q])), 34))} fill="none" stroke={C.gold} strokeWidth={5} opacity={track} /> : null}
      <Lbl x={pL[0] - offL} y={pL[1] - offL} t="L" c={LOW_C} s={T.calc} a="middle" />
      <circle cx={P(BREST[0], BREST[1])[0]} cy={P(BREST[0], BREST[1])[1]} r={19} fill="none" stroke={C.bg} strokeWidth={11} />
      <circle cx={P(BREST[0], BREST[1])[0]} cy={P(BREST[0], BREST[1])[1]} r={19} fill="none" stroke={C.key} strokeWidth={4} />
      <Place p={P(BREST[0], BREST[1])} t={brestLabel > 0 ? "Brest" : undefined} o={1} dx={26} dy={48} a="start" />
      {brestArrow > 0 ? (() => { const p = P(BREST[0], BREST[1]), u = BH.u10[bi], v = BH.v10[bi]; return <Arrow p={p} q={[p[0] + u * 6, p[1] - v * 6]} color={C.first} o={brestArrow} />; })() : null}
      {children}
    </CiaranMap>
  );
};
/** the polyline with its last `r` px removed (the end point moved back along the line) */
const trimEnd = (pts: Pt[], r: number): Pt[] => {
  if (pts.length < 2) return pts;
  const e = pts[pts.length - 1], d = (p: Pt) => Math.hypot(p[0] - e[0], p[1] - e[1]);
  let j = pts.length - 1;
  while (j >= 0 && d(pts[j]) < r) j--;
  if (j < 0) return [];
  const a = pts[j], b = pts[j + 1];
  let lo = 0, hi = 1;     // a is ≥ r from the end, b is < r: bisect for the point at exactly r
  for (let it = 0; it < 30; it++) { const m = (lo + hi) / 2; if (d([a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m]) >= r) lo = m; else hi = m; }
  return [...pts.slice(0, j + 1), [a[0] + (b[0] - a[0]) * lo, a[1] + (b[1] - a[1]) * lo]];
};
const hourLabel = (h: number) => { const hh = (12 + Math.floor(h)) % 24, d = 12 + Math.floor(h) >= 24 ? 2 : 1; return `${String(hh).padStart(2, "0")} UTC ${d} Nov`; };
const S55: React.FC = () => {
  const f = useCurrentFrame(), k = K("s55_ciaran_maps");
  // fix loop 1 (M3/M4): S0 holds 12 UTC 1 Nov while the isobars and the two fronts are named; the hours run in S1: 12 → 03 UTC
  // (the deepest hour) between "from about nine hundred and seventy" and "fifty-four", then on to 12 UTC 2 Nov
  const tA = AT(k, 1, "from about nine hundred"), tB = AT(k, 1, "fifty-four") + 10, tE = LEN(k) - 15;
  // fix loop 3 (review 3 S-c): same frame budget, but 01-03 UTC (the Channel crossing, closest to Brest at about 01:50) is spread over
  // "crosses the English Channel just north of Brest"; 954 hPa (01 UTC) is on "fifty-four"; the rest of the night and the morning run
  // from "during the night" to the scene's end
  const tX = AT(k, 1, "crosses"), tN = AT(k, 1, "during the night");
  const h = f < tA ? 0 : f < tB ? 13 * easeIO(clamp((f - tA) / (tB - tA), 0, 1)) : f < tX ? 13 + 0.4 * clamp((f - tB) / (tX - tB), 0, 1)
    : f < tN ? 13.4 + 1.6 * clamp((f - tX) / (tN - tX), 0, 1) : 15 + 9 * clamp((f - tN) / (tE - tN), 0, 1);
  const hp = Math.min(24, Math.round(h));
  if (Math.abs(HR.track.hPa[0] - 970) > 1 || HR.track.time_utc[0] !== "2023-11-01T12") throw new Error(`CHECK s55: Ciarán at 12 UTC 1 Nov is ${HR.track.hPa[0]} hPa, said 970`);
  if (FR.hourly[FR_LAST]?.time_utc !== "2023-11-01T21" || FR.hourly_shown_until_utc !== "2023-11-01T21") throw new Error(`CHECK s55: fronts drawn to ${FR.hourly_shown_until_utc}, built for 21 UTC`);
  if (Math.round(HR.track.hPa[15]) !== 954 || HR.track.time_utc[15] !== "2023-11-02T03") throw new Error(`CHECK s55: 03 UTC 2 Nov ${HR.track.hPa[15]} hPa, said 954`);
  if (Math.round(HR.track.hPa[13]) !== 954 || HR.track.time_utc[13] !== "2023-11-02T01") throw new Error(`CHECK s55: 01 UTC 2 Nov ${HR.track.hPa[13]} hPa, shown on "fifty-four"`);
  const tW = AT(k, 0, "warm front"), tC = AT(k, 0, "cold front");
  return (
    <Scene>
      <Svg>
        <HourMap h={h} id="s55m" fw={fin(f, tW)} fc={fin(f, tC)} track={fin(f, tA)} brestLabel={1} />
        <Lbl x={1100} y={140} t="isobars every 4 hPa" c={C.key} s={T.key} />
        <ClockGlyph x={1130} y={260} r={34} h={(12 + h) % 12} />
        <Lbl x={1190} y={260} t={hourLabel(Math.round(h))} c={C.key} s={T.key} />
        {/* fix loop 2 (review 2 N-M2): the key fades with the lines after 21 UTC (no fronts are drawn after that hour) */}
        <g opacity={fin(f, tW) * frontFade(h)}><line x1={1100} x2={1170} y1={380} y2={380} stroke="#d9464f" strokeWidth={7} /><Lbl x={1190} y={380} t="warm front" c={C.key} s={T.key} /></g>
        <g opacity={fin(f, tC) * frontFade(h)}><line x1={1100} x2={1170} y1={450} y2={450} stroke="#4f7fd8" strokeWidth={7} /><Lbl x={1190} y={450} t="cold front" c={C.key} s={T.key} /></g>
        {/* fix loop 2 (review 2 S5): "≈ 970" (the number spoken) until the hours start to run, then the running hourly value */}
        <Lbl x={1100} y={590} t={hp === 0 ? "low: ≈ 970 hPa" : `low: ${fmt(HR.track.hPa[hp], 0)} hPa`} c={PRES} s={T.calc} o={fin(f, tA)} />
        <Lbl x={1100} y={700} t="track of the low" c={C.gold} s={T.key} o={fin(f, tA)} />
        <SrcLine id="s55_ciaran_maps" w={1100} />
      </Svg>
    </Scene>
  );
};
const BRG: Ax = { x: 1200, y: 90, w: 600, h: 240, xr: [0, 24], yr: [955, 1005] };
const BTG: Ax = { x: 1200, y: 560, w: 600, h: 200, xr: [0, 24], yr: [9, 15] };
const brestSeries = (key: string) => (BH[key] as number[]).slice(12, 37);
const hourTicks = (v: number) => String((12 + v) % 24).padStart(2, "0");
const BrestGraphs: React.FC<{ f: number; h: number; showT: number; children?: React.ReactNode }> = ({ h, showT, children }) => {
  const Xp = axX(BRG), Yp = axY(BRG), Xt = axX(BTG), Yt = axY(BTG);
  const n = Math.max(1, Math.floor(h) + 1);
  const ps = brestSeries("msl_hPa"), ts = brestSeries("t2m_C");
  const part = (s: number[], X: (v: number) => number, Y: (v: number) => number) => {
    const pts: Pt[] = s.slice(0, n).map((v, i) => [X(i), Y(v)]);
    if (h < 24 && n < s.length) pts.push([X(h), Y(s[n - 1] + (s[n] - s[n - 1]) * (h - (n - 1)))]);
    return poly(pts);
  };
  return (
    <g>
      <Axes A={BRG} xt={[0, 6, 12, 18, 24]} yt={[960, 980, 1000]} yl="hPa" xfmt={hourTicks} />
      {/* fix loop 1 (S5): pressure teal and temperature orange, as everywhere else in the movie (gold stays for pointers) */}
      <path d={part(ps, Xp, Yp)} fill="none" stroke={PRES} strokeWidth={6} />
      {ps.slice(0, n).map((v, i) => <circle key={i} cx={Xp(i)} cy={Yp(v)} r={5} fill={PRES} />)}
      <g opacity={showT}>
        <Axes A={BTG} xt={[0, 6, 12, 18, 24]} yt={[10, 12, 14]} yl="°C" xfmt={hourTicks} />
        <path d={part(ts, Xt, Yt)} fill="none" stroke={TEMP} strokeWidth={6} />
        {ts.slice(0, n).map((v, i) => <circle key={i} cx={Xt(i)} cy={Yt(v)} r={5} fill={TEMP} />)}
      </g>
      {children}
    </g>
  );
};
const S56: React.FC = () => {
  const f = useCurrentFrame(), k = K("s56_brest_pressure");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4);
  const h = f < t2 ? 0 : f < t3 ? 13 * clamp((f - t2) / (SE(k, 2) - t2), 0, 1) : f < t4 ? 13 : 13 + 11 * clamp((f - t4) / (SE(k, 4) - t4), 0, 1);
  const Xp = axX(BRG), Yp = axY(BRG), ps = brestSeries("msl_hPa");
  return (
    <Scene>
      <Svg>
        <HourMap h={h} id="s56m" fronts={0} wind={0.4} B={HMB} brestLabel={1} />
        <BrestGraphs f={f} h={h} showT={0}>
          <circle cx={Xp(0)} cy={Yp(ps[0])} r={11} fill="none" stroke={C.gold} strokeWidth={4} opacity={fin(f, t1)} />
          <circle cx={Xp(13)} cy={Yp(ps[13])} r={11} fill="none" stroke={C.gold} strokeWidth={4} opacity={fin(f, AT(k, 2, "nine hundred"))} />
          <Lbl x={1200} y={450} t="12 UTC: 997 hPa" c={PRES} s={T.key} o={fin(f, t1)} />
          <Lbl x={1200} y={530} t="01 UTC: 962 hPa" c={PRES} s={T.key} o={fin(f, AT(k, 2, "nine hundred"))} />
          <Lbl x={1200} y={650} t="−35 hPa in 13 h" c={C.gold} s={T.key} o={fin(f, t3)} />
          <Lbl x={1200} y={740} t="+14 hPa in 5 h" c={C.gold} s={T.key} o={fin(f, t4)} />
        </BrestGraphs>
        <SrcLine id="s56_brest_pressure" w={1080} />
      </Svg>
    </Scene>
  );
};
const S57: React.FC = () => {
  const f = useCurrentFrame(), k = K("s57_brest_warm_front");
  const t1 = SS(k, 1), t2 = SS(k, 2), t3 = SS(k, 3), t4 = SS(k, 4);
  const h = f < t2 ? 6 : 6 + 2 * clamp((f - t2) / 60, 0, 1);
  const Xt = axX(BTG), Yt = axY(BTG), ts = brestSeries("t2m_C");
  return (
    <Scene>
      <Svg>
        <HourMap h={h} id="s57m" wind={0.35} brestArrow={fin(f, t1)} B={HMB} brestLabel={1} />
        <BrestGraphs f={f} h={Math.max(h, 24 * 0 + h)} showT={fin(f, SS(k, 0))}>
          <rect x={Xt(6)} y={BRG.y} width={Xt(8) - Xt(6)} height={BTG.y + BTG.h - BRG.y} fill={C.gold} opacity={0.18 * fin(f, t3)} />
          <Lbl x={Xt(7)} y={BTG.y + BTG.h + 92} t="warm front" c={C.gold} s={T.floor} a="middle" o={fin(f, t3)} />
          {/* right of the minimum, under the curve: end-anchored it sat on the y axis over the 10/12 ticks (stage-2 frame check) */}
          <Lbl x={Xt(6) + 20} y={Yt(ts[6]) + 50} t="12.0 °C" c={TEMP} s={T.key} o={fin(f, AT(k, 1, "twelve degrees"))} />
          <Lbl x={Xt(8) + 20} y={Yt(ts[8]) - 40} t="≈ 14.5 °C" c={TEMP} s={T.key} o={fin(f, AT(k, 2, "fourteen"))} />
        </BrestGraphs>
        <Lbl x={100} y={760} t="13 m/s from 155° (SSE)" c={C.first} s={T.key} o={win(f, AT(k, 1, "south-south-east"), t2)} />
        <Lbl x={100} y={760} t="18 m/s from 204° (SSW)" c={C.first} s={T.key} o={fin(f, AT(k, 2, "south-south-west"))} />
        <Keyword f={f} text="warm sector" at={[1100, 470]} appear={AT(k, 4, "warm sector")} s={T.key} />
        <SrcLine id="s57_brest_warm_front" w={1080} />
      </Svg>
      {void t4}
    </Scene>
  );
};
const S58: React.FC = () => {
  const f = useCurrentFrame(), k = K("s58_brest_cold_front");
  // fix loop 3 (review 3 N3-M1): S1 "A few hours later…" runs the map on from s57's 20 UTC to 00 UTC while the last drawn fronts fade over
  // the first 0.5 s (no hard cut); the new S2 says the map can no longer trace them and points to Brest's measurements (the graph band
  // 'cold front' appears on "Brest's own measurements"); the wind / temperature reveals moved one sentence on (S3-S5)
  const tB = AT(k, 1, "Brest's own measurements"), t1 = SS(k, 2), t2 = SS(k, 3), t3 = SS(k, 4);
  const h = f < SE(k, 0) ? 8 + 4 * easeIO(clamp(f / SE(k, 0), 0, 1)) : f < t1 ? 12 : 12 + 3 * clamp((f - t1) / (SE(k, 2) - t1), 0, 1);
  const Xt = axX(BTG), Yt = axY(BTG), ts = brestSeries("t2m_C");
  const rows: CalcRow[] = [{ rhs: EQ_S58, at: AT(k, 2, "forty-five"), ul: AT(k, 2, "forty-five") + 10 }];
  return (
    <Scene>
      <Svg>
        <HourMap h={h} id="s58m" wind={0.35} brestArrow={fin(f, t1)} B={HMB} brestLabel={1} frontO={1 - ramp(f, 0, 15)} />
        <BrestGraphs f={f} h={h} showT={1}>
          <rect x={Xt(12)} y={BRG.y} width={Xt(15) - Xt(12)} height={BTG.y + BTG.h - BRG.y} fill={C.gold} opacity={0.18 * fin(f, tB)} />
          <Lbl x={Xt(13.5)} y={BTG.y + BTG.h + 92} t="cold front" c={C.gold} s={T.floor} a="middle" o={fin(f, tB)} />
          {/* fix loop 1 (S3): beside the drop, at about 11 °C (it sat on the x axis) */}
          <Lbl x={Xt(15) + 24} y={Yt(11.2)} t="−2 °C" c={TEMP} s={T.key} o={fin(f, t2)} />
        </BrestGraphs>
        <Lbl x={100} y={760} t="19 m/s from 221° (SW)" c={C.first} s={T.key} o={win(f, t1, AT(k, 2, "by three"))} />
        <Lbl x={100} y={760} t="23 m/s from 271° (W)" c={C.first} s={T.key} o={fin(f, AT(k, 2, "by three"))} />
        <Keyword f={f} text="cooler polar air" at={[1500, 360]} appear={t3} s={T.key} />
        <SrcLine id="s58_brest_cold_front" w={1080} />
      </Svg>
      <CalcStack f={f} x={1200} y={430} rows={tall(rows, 60)} size={60} />
    </Scene>
  );
};
const S59: React.FC = () => {
  const f = useCurrentFrame(), k = K("s59_ciaran_after");
  const z = easeIO(clamp(f / LEN(k), 0, 1));
  return (
    <Scene>
      {/* fix loop 1 (S3): a gentler zoom anchored near the bottom-left, so the H stays inside the frame */}
      <MapImg layers={[{ n: "sat_base", o: 1 }, { n: "sat_iso", o: 1 }, { n: "sat_marks", o: 1 }]} kb={{ s: mix(1.0, 1.12, z), cx: 0.12, cy: 0.88 }} />
      <Svg>
        <Lbl x={1340} y={160} t="2 Nov, afternoon" c={C.key} s={T.key} />
        <Keyword f={f} text="weather maps →" at={[1340, 420]} appear={SS(k, 1)} s={T.floor} />
        <Keyword f={f} text="why the wind circles →" at={[1340, 540]} appear={SS(k, 2)} s={T.floor} />
        <SrcLine id="s59_ciaran_after" x={300} w={980} />
      </Svg>
    </Scene>
  );
};

// ================================================================ s60 recap
const S60: React.FC = () => {
  const f = useCurrentFrame(), k = K("s60_recap");
  const n = sc[k].sentences.length;
  const beat = (j: number) => fin(f, SS(k, j) + (j === 0 ? 4 : 0), 10) * (j < n - 1 ? fout(f, SS(k, j + 1) - 6, 10) : 1);
  const X = axX(PG), Y = axY(PG);
  return (
    <Scene>
      <Globe cam={{ lat: 30, lon: -10, dist: 3.8 }} shell={SHELL50} o={beat(0)} />
      <Svg>
        <Keyword f={f} text="thin shell · troposphere" at={[1100, 400]} appear={SS(k, 0) + 4} out={SS(k, 1) - 6} s={T.key} />
        <g opacity={beat(1)}><Column x={480} y0={760} y1={80} /><Lbl x={1100} y={400} t="1013 hPa = weight of the air" c={C.key} s={T.key} /></g>
        <g opacity={beat(2)}><PGraph /><Lbl x={1100} y={560} t="H ≈ 8 km" c={C.key} s={T.calc} /></g>
        <g opacity={beat(3)}><IsoBox o={[260, 560]} a={160} b={160} c={160} fill={C.local} fo={0.4} /><IsoBox o={[640, 560]} a={160} b={160} c={160} fill={C.second} fo={0.3} />
          <Lbl x={1100} y={560} t="warm air is lighter" c={C.key} s={T.key} /></g>
        <g opacity={beat(4)}><EGraph /><circle cx={axX(EG)(MO.dew_point.Td_C)} cy={axY(EG)(15)} r={24} fill="none" stroke={C.gold} strokeWidth={5} />
          <Lbl x={1100} y={400} t="RH · dew point · clouds" c={C.key} s={T.key} /></g>
        <g opacity={beat(5)}><circle cx={520} cy={450} r={260} fill="none" stroke={C.muted} strokeWidth={4} /><Arrow p={[520, 450]} q={[520 + 8 * 26, 450 - 6 * 26]} color={C.first} />
          <Lbl x={1100} y={400} t="233° south-westerly · 19 kt" c={C.key} s={T.key} /></g>
        <Lbl x={1340} y={400} t="H and L · fronts" c={C.key} s={T.key} o={beat(6)} />
        <g opacity={beat(7)}>
          {(() => { const A: Ax = { x: 200, y: 150, w: 800, h: 500, xr: [1, 365], yr: [0, 25] }, Xa = axX(A), Ya = axY(A); return <g>
            <path d={poly([...(BC.doy as number[]).map((d, i) => [Xa(d), Ya(BC.q90_C[i])] as Pt), ...(BC.doy as number[]).map((d, i) => [Xa(d), Ya(BC.q10_C[i])] as Pt).reverse()]) + "Z"} fill={C.local} fillOpacity={0.3} />
            <path d={poly((BC.y2023_C as number[]).map((v, i) => [Xa(i + 1), Ya(v)] as Pt))} fill="none" stroke={C.second} strokeWidth={3} /></g>; })()}
          <Lbl x={1100} y={400} t="weather · climate · reanalysis" c={C.key} s={T.key} /></g>
        <SrcLine id="s60_recap" x={1080} w={760} />
      </Svg>
      <MapImg o={beat(6)} layers={[{ n: "t850_base", o: 1 }, { n: "t850_symbols", o: 1 }, { n: "t850_places", o: 1 }]} />
      <TeX s={EQ_S60} x={1100} y={300} size={T.calc} o={beat(2)} />
      <TeX s={EQ_S10} x={1100} y={300} size={T.calc} o={beat(3)} />
      {void X}{void Y}
    </Scene>
  );
};

// ================================================================ s61 end card (house ending for weather, climate and ocean movies)
const S61: React.FC = () => {
  const f = useCurrentFrame(), k = K("s61_end");
  const t1 = SS(k, 1), t2 = SS(k, 2), tOther = AT(k, 2, "and the notebooks");
  const thumb = (x: number, i: number) => (
    <g key={i} opacity={0.75}>
      <rect x={x - 150} y={150} width={300} height={190} rx={16} fill="#18213a" stroke={C.grid} strokeWidth={3} />
      {i === 0 ? <><circle cx={x} cy={245} r={70} fill="#22406a" /><circle cx={x} cy={245} r={80} fill="none" stroke="#7cc4ff" strokeWidth={8} strokeOpacity={0.5} /></> : null}
      {i === 1 ? <><rect x={x - 30} y={170} width={60} height={150} fill="#7cc4ff" opacity={0.5} /><rect x={x - 60} y={315} width={120} height={10} fill={C.gold} /></> : null}
      {i === 2 ? <path d={poly((ES.T_C as number[]).map((t, q) => [x - 120 + ((t + 10) / 45) * 240, 320 - (ES.es_hPa[q] / 50) * 150] as Pt))} fill="none" stroke={C.gold} strokeWidth={5} /> : null}
      {i === 3 ? <>{[0, 1, 2, 3].map((q) => <circle key={q} cx={x + 20} cy={250} r={20 + q * 22} fill="none" stroke={C.ink} strokeWidth={3} />)}<text x={x + 20} y={262} fill={C.key} fontSize={44} textAnchor="middle">L</text></> : null}
    </g>
  );
  return (
    <Scene>
      <Svg>
        <g opacity={fin(f, 6)}>{[420, 760, 1100, 1440].map((x, i) => thumb(x, i))}</g>
        <Lbl x={960} y={420} t="a series of tutorials" c={C.key} s={T.calc} a="middle" o={fin(f, 10)} />
        <Lbl x={960} y={505} t="meteorology · atmospheric science · climate" c={C.key} s={T.key} a="middle" o={fin(f, t1)} />
        <Lbl x={960} y={580} t="the ideas, and the maths behind them" c={C.gold} s={T.key} a="middle" o={fin(f, AT(k, 1, "not just"))} />
        <g opacity={fin(f, t2)}><Notebook x={560} y={690} s={0.5} /><Lbl x={630} y={690} t="weather-basics notebook" c={C.ink} s={T.calc} /></g>
        <g opacity={fin(f, tOther)}>
          {[0, 1, 2].map((i) => <Notebook key={i} x={420 + i * 34} y={820 - i * 10} s={0.28} c={[C.second, "#8e6fd8", C.muted][i]} o={0.9} />)}
          <Lbl x={560} y={812} t="notebooks for the other concepts" c={C.key} s={T.key} />
        </g>
      </Svg>
    </Scene>
  );
};

// ================================================================ assembly
const V3Dummy: V3 = [0, 0, 0];
const Projector0: Projector | null = null;
const BYID: Record<string, React.FC> = { s00_title: S00, s01_hook: S01, s02_thin_shell: S02, s03_air_parcel: S03, s04_pressure_what: S04, s05_weight_column: S05,
  s06_not_crushed: S06, s07_hpa: S07, s08_density: S08, s09_temperature: S09, s10_gas_law: S10, s11_gas_law_numbers: S11, s12_warm_air_light: S12, s13_slab: S13,
  s14_slab_weight: S14, s15_hydrostatic: S15, s16_hydrostatic_numbers: S16, s17_combine: S17, s18_scale_height: S18, s18b_scale_height_number: S18B,
  s19_exponential: S19, s19b_integrate: S19B, s20_exponential_meaning: S20, s20b_per_km: S20B, s20c_equal_slabs: S20C, s20d_halving: S20D,
  s21_balloon_pressure: S21, s22_mass_below: S22, s23_troposphere: S23, s24_stratosphere: S24, s25_tropics: S25, s26_why_cold_aloft: S26, s27_vapour: S27,
  s27b_vapour_pressure: S27B, s28_saturation: S28, s29_relative_humidity: S29, s30_dew_point: S30, s31_cloud_base: S31, s32_wind_vector: S32,
  s33_wind_direction: S33, s34_wind_units: S34, s35_why_wind: S35, s36_weather_climate: S36, s37_observations: S37, s38_reanalysis: S38,
  s39_surface_pressure: S39, s40_sea_level: S40, s41_msl_isobars: S41, s42_highs_lows: S42, s43_lows_cloudy: S43, s44_round_lows: S44, s45_air_masses: S45,
  s46_fronts: S46, s47_cold_front: S47, s48_warm_front: S48, s49_real_fronts: S49, s50_front_symbols: S50, s51_heating: S51, s52_pressure_belts: S52,
  s53_trades_westerlies: S53, s54_ciaran_intro: S54, s55_ciaran_maps: S55, s56_brest_pressure: S56, s57_brest_warm_front: S57, s58_brest_cold_front: S58,
  s59_ciaran_after: S59, s60_recap: S60, s61_end: S61 };
const SCENES: React.FC[] = sc.map((s) => { const c = BYID[s.id]; if (!c) throw new Error(`no component for scene ${s.id}`); return c; });
// UF1 R1: every scene with a storyboard source line must be drawn with it (static check; the frames are checked by tools/movie_wb/source_check.py)
Object.keys(SRCS).forEach((id) => { if (!BYID[id]) throw new Error(`source line for unknown scene ${id}`); });
if (SCENES.length !== sc.length) throw new Error(`${SCENES.length} scene components but ${sc.length} scenes in timing.json`);
void [BX, HNY, HNX, slice2, MapPlane, Wall, Ball3D, Quad3D, Graticule, gcArrowPts, V3Dummy, Projector0, CurvedLink, textW, Bracket, lerp, interp, mix, Droplet, LUT_DENSE];
export const WeatherBasics: React.FC<{ audio?: string; bbox?: boolean }> = ({ audio = "narration_music.wav", bbox = false }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    {bbox ? <BoxProbe /> : null}
    {SCENES.map((S, k) => (
      <Sequence key={sc[k].id} name={sc[k].id} from={CUT[k]} durationInFrames={LEN(k) + (k < SCENES.length - 1 ? XF : 0)}><S /></Sequence>
    ))}
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
