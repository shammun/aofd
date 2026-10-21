import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { EqLine, Globe, HOUSE, LowerThird, ScaleBadge, TERM, ramp } from "../house";
import timing from "../../poc/timing.json";
import s1 from "../../poc/data/s1_inertial.json";
import s2 from "../../poc/data/s2_rotating.json";
import s3 from "../../poc/data/s3_coriolis_f.json";

/**
 * PoC D (movies/poc/storyboard.yaml): "Coriolis: straight in space, curved on the turntable", 20 s, 1920×1080, 30 fps.
 * Physics is precomputed by movies/data/build_poc.py from tested fluidpy.geo.frames functions (turntable_puck,
 * coriolis_acceleration_horizontal, coriolis_parameter); this file only indexes the samples by frame.
 * Scene cuts sit in the middle of the narration gaps measured in timing.json (tools/tts.py, af_bella ×1.0).
 */

export const POC_FPS = 30;
export const POC_FRAMES = 600; // 20.0 s (storyboard target); narration is 19.30 s, the last 0.7 s holds the end strip

const sc = timing.scenes;
const gapMid = (a: number, b: number) =>
  Math.round(((sc[a].sentences[sc[a].sentences.length - 1].end + sc[b].sentences[0].start) / 2) * POC_FPS);
export const CUT1 = gapMid(0, 1); // ≈ 6.0 s
export const CUT2 = gapMid(1, 2); // ≈ 11.2 s
const sec = (s: number) => Math.round(s * POC_FPS);

// ---- equations (verbatim from the storyboard; colour is applied by string replacement only) ----
const EQ_212 = String.raw`\left(\frac{\mathrm{d}\boldsymbol{v}_R}{\mathrm{d}t}\right)_{\!R} = \left(\frac{\mathrm{d}\boldsymbol{v}_I}{\mathrm{d}t}\right)_{\!I} \underbrace{{}-2\boldsymbol{\Omega}\times\boldsymbol{v}_R}_{\text{Coriolis}} \underbrace{{}-\boldsymbol{\Omega}\times(\boldsymbol{\Omega}\times\boldsymbol{r})}_{\text{centrifugal}}`;
const EQ_280 = String.raw`f = 2\Omega\sin\vartheta`;
const CORI_TERM = String.raw`\underbrace{{}-2\boldsymbol{\Omega}\times\boldsymbol{v}_R}_{\text{Coriolis}}`;
const CENT_TERM = String.raw`\underbrace{{}-\boldsymbol{\Omega}\times(\boldsymbol{\Omega}\times\boldsymbol{r})}_{\text{centrifugal}}`;
const a8 = (o: number) => Math.round(Math.max(0, Math.min(1, o)) * 255).toString(16).padStart(2, "0");
/** (2.12) with the Coriolis term violet and the centrifugal term slate, each revealed with opacity oC / oF. */
const eq212Shown = (oC: number, oF: number) =>
  EQ_212.replace(CORI_TERM, `\\textcolor{${TERM.coriolis}${a8(oC)}}{${CORI_TERM}}`)
    .replace(CENT_TERM, `\\textcolor{${TERM.tendency}${a8(oF)}}{${CENT_TERM}}`);
const EQ_280_SHOWN = EQ_280.replace(String.raw`2\Omega\sin\vartheta`, `\\textcolor{${TERM.coriolis}}{2\\Omega\\sin\\vartheta}`);

// ---- turntable geometry (screen px; physical y is up, screen y is down) ----
const CX = 960, CY = 545, RPX = 350; // table radius 1.0 m drawn as 350 px
const P = (x: number, y: number) => [CX + x * RPX, CY - y * RPX] as const;
const DEG = 180 / Math.PI;
const SLATE = TERM.tendency, VIOLET = TERM.coriolis, ORANGE = HOUSE.glyphB;
const FONT: React.CSSProperties = { fontFamily: HOUSE.font, color: HOUSE.ink };

const Chip: React.FC<{ text: string; x: number; y: number; color?: string; size?: number; o?: number }> = ({
  text, x, y, color = HOUSE.accent, size = 30, o = 1,
}) => (
  <div style={{ position: "absolute", left: x, top: y, ...FONT, fontSize: size, background: HOUSE.panel, opacity: o,
    border: `2px solid ${color}`, borderRadius: 10, padding: "8px 18px", maxWidth: 620 }}>{text}</div>
);

const RoomGrid: React.FC<{ angleRad: number }> = ({ angleRad }) => {
  const lines = [];
  for (let k = -16; k <= 16; k++) {
    lines.push(<line key={`v${k}`} x1={k * 80} y1={-1300} x2={k * 80} y2={1300} />);
    lines.push(<line key={`h${k}`} x1={-1300} y1={k * 80} x2={1300} y2={k * 80} />);
  }
  // physical anticlockwise angle a -> SVG rotate(−a) (screen y points down)
  return <g transform={`translate(${CX} ${CY}) rotate(${-angleRad * DEG})`} stroke={HOUSE.grid} strokeWidth={1.5}
    opacity={0.55}>{lines}</g>;
};

/** Disc, rim, eight spokes and the orange target mark (due east at t = 0), turned by the physical angle. */
const Table: React.FC<{ angleRad: number; r?: number; cx?: number; cy?: number; mark?: boolean }> = ({
  angleRad, r = RPX, cx = CX, cy = CY, mark = true,
}) => (
  <g transform={`translate(${cx} ${cy}) rotate(${-angleRad * DEG})`}>
    <circle r={r} fill="#1b2438" stroke="#c9d2e3" strokeWidth={r > 200 ? 6 : 3} />
    {[0, 2, 4, 6].map((i) => { // alternate sectors shaded so the spin is visible
      const a0 = (i * Math.PI) / 4, a1 = ((i + 1) * Math.PI) / 4;
      return <path key={`s${i}`} fill="#26314d"
        d={`M0 0 L${r * Math.cos(a0)} ${-r * Math.sin(a0)} A${r} ${r} 0 0 0 ${r * Math.cos(a1)} ${-r * Math.sin(a1)} Z`} />;
    })}
    {Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      return <line key={i} x1={0} y1={0} x2={r * Math.cos(a)} y2={-r * Math.sin(a)} stroke="#33405c"
        strokeWidth={r > 200 ? 3 : 1.5} />;
    })}
    <circle r={r > 200 ? 7 : 3} fill="#c9d2e3" />
    {mark ? <rect x={r - (r > 200 ? 14 : 6)} y={-(r > 200 ? 14 : 6)} width={r > 200 ? 28 : 12} height={r > 200 ? 28 : 12}
      fill={ORANGE} transform={`rotate(45 ${r} 0)`} /> : null}
  </g>
);

const pathD = (xs: number[], ys: number[], n: number, map = P) =>
  xs.slice(0, n + 1).map((x, i) => { const [a, b] = map(x, ys[i]); return `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`; })
    .join(" ");

const Puck: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const [a, b] = P(x, y);
  return <circle cx={a} cy={b} r={0.03 * RPX} fill="#ffffff" stroke="#0f1420" strokeWidth={2} />; // 6 cm wide
};

const SpinArrow: React.FC = () => {
  // arc outside the rim from 115° to 160° (physical, anticlockwise), arrow head at the end
  const r = RPX + 34, a0 = (115 * Math.PI) / 180, a1 = (160 * Math.PI) / 180;
  const [x0, y0] = [CX + r * Math.cos(a0), CY - r * Math.sin(a0)];
  const [x1, y1] = [CX + r * Math.cos(a1), CY - r * Math.sin(a1)];
  const tx = -Math.sin(a1), ty = -Math.cos(a1); // screen tangent (anticlockwise)
  const nx = Math.cos(a1), ny = -Math.sin(a1);
  const h = 22;
  return (
    <g stroke={HOUSE.accent} strokeWidth={5} fill="none">
      <path d={`M${x0} ${y0} A${r} ${r} 0 0 0 ${x1} ${y1}`} />
      <path d={`M${x1 + tx * h} ${y1 + ty * h} L${x1 + nx * h * 0.6} ${y1 + ny * h * 0.6} M${x1 + tx * h} ${y1 + ty * h} L${x1 - nx * h * 0.6} ${y1 - ny * h * 0.6}`} />
    </g>
  );
};

// ---------------------------------------------------------------- s1: room view (inertial)
const SceneInertial: React.FC = () => {
  const f = useCurrentFrame();
  const n = s1.t.length - 1; // 181 samples, 1/30 s apart: real time
  const k = Math.min(n, f);
  const ang = s1.angle[k];
  const o = ramp(f, 0, 6);
  return (
    <AbsoluteFill style={{ background: HOUSE.bg }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <RoomGrid angleRad={0} />
        <Table angleRad={ang} />
        <path d={pathD(s1.x_inertial, s1.y_inertial, k)} stroke={SLATE} strokeWidth={7} fill="none" strokeLinecap="round" />
        <Puck x={s1.x_inertial[k]} y={s1.y_inertial[k]} />
        <SpinArrow />
      </svg>
      <Chip text="room view (inertial)" x={40} y={36} />
      <div style={{ position: "absolute", left: 40, top: 112, ...FONT, fontSize: 28, color: HOUSE.muted }}>
        t = {s1.t[k].toFixed(1)} s · real time
      </div>
      <div style={{ position: "absolute", left: 120, top: 250, width: 420, ...FONT, fontSize: 30, opacity: o,
        color: HOUSE.accent, lineHeight: 1.3 }}>
        table spins anticlockwise (seen from above) — like the Northern Hemisphere
      </div>
      <div style={{ position: "absolute", left: 1330, top: 600, width: 480, ...FONT, fontSize: 30, color: SLATE,
        opacity: ramp(f, 30, 45) }}>
        puck path: a straight line<br /><span style={{ color: HOUSE.muted, fontSize: 26 }}>no horizontal force acts</span>
      </div>
      <ScaleBadge detail="table 0.5 rad/s, Earth 7.29×10⁻⁵ rad/s; puck drawn 6 cm wide" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- s2: table view (rotating)
const REPLAY = s2.t.length - 1; // 135 frames = 4.5 s for 6 s of table time (×1.33)
const INSET = { x: 1560, y: 330, r: 140 };

const SceneRotating: React.FC = () => {
  const f = useCurrentFrame();
  const k = Math.min(REPLAY, f);
  const ang = s2.angle[k];
  const [px, py] = P(s2.x_rotating[k], s2.y_rotating[k]);
  const ax = s2.coriolis_ax[k], ay = s2.coriolis_ay[k];
  const am = Math.hypot(ax, ay) || 1;
  const L = 95;
  const [qx, qy] = [px + (ax / am) * L, py - (ay / am) * L];
  const hx = (qx - px) / L, hy = (qy - py) / L;
  const held = ramp(f, REPLAY, REPLAY + 8);
  const mapI = (x: number, y: number) => [INSET.x + x * INSET.r, INSET.y - y * INSET.r] as const;
  const [ix, iy] = mapI(s2.x_inertial[k], s2.y_inertial[k]);
  return (
    <AbsoluteFill style={{ background: HOUSE.bg }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <RoomGrid angleRad={-ang} />
        <Table angleRad={0} />
        <line x1={CX} y1={CY} x2={CX + RPX - 30} y2={CY} stroke={SLATE} strokeWidth={4} strokeDasharray="16 12" />
        <path d={`M${CX + RPX - 30} ${CY} l-22 -12 M${CX + RPX - 30} ${CY} l-22 12`} stroke={SLATE} strokeWidth={4} />
        <path d={pathD(s2.x_rotating, s2.y_rotating, k)} stroke={VIOLET} strokeWidth={7} fill="none" strokeLinecap="round" />
        <Puck x={s2.x_rotating[k]} y={s2.y_rotating[k]} />
        {k > 0 ? (
          <g stroke={VIOLET} strokeWidth={6} fill="none" opacity={1 - held}>
            <line x1={px} y1={py} x2={qx} y2={qy} />
            <path d={`M${qx} ${qy} L${qx - 22 * hx + 12 * hy} ${qy - 22 * hy - 12 * hx} M${qx} ${qy} L${qx - 22 * hx - 12 * hy} ${qy - 22 * hy + 12 * hx}`} />
          </g>
        ) : null}
        {/* room-frame inset: the same throw seen from the room, straight */}
        <g>
          <rect x={INSET.x - 170} y={INSET.y - 170} width={340} height={340} rx={14} fill={HOUSE.panel}
            stroke={HOUSE.grid} strokeWidth={2} />
          <Table angleRad={ang} r={INSET.r} cx={INSET.x} cy={INSET.y} />
          <line x1={INSET.x} y1={INSET.y} x2={mapI(0.9, 0)[0]} y2={INSET.y} stroke={SLATE} strokeWidth={3} opacity={0.35} />
          <path d={pathD(s2.x_inertial, s2.y_inertial, k, mapI)} stroke={SLATE} strokeWidth={4} fill="none" />
          <circle cx={ix} cy={iy} r={5} fill="#fff" />
        </g>
      </svg>
      <Chip text="table view (rotating)" x={40} y={36} color={VIOLET} />
      <div style={{ position: "absolute", left: 40, top: 112, ...FONT, fontSize: 28, color: HOUSE.muted }}>
        t = {s2.t[k].toFixed(1)} s · table time ×1.33
      </div>
      <div style={{ position: "absolute", left: CX + RPX - 150, top: CY + 22, ...FONT, fontSize: 28, color: SLATE }}>aimed here</div>
      <div style={{ position: "absolute", left: 40, top: 300, width: 400, ...FONT, fontSize: 32, color: VIOLET,
        opacity: ramp(f, 10, 20) }}>
        Coriolis −2Ω×v<br /><span style={{ fontSize: 26, color: HOUSE.muted }}>arrow: always at right angles, to the right
        of the motion (length not to scale)</span>
      </div>
      <div style={{ position: "absolute", left: INSET.x - 170, top: INSET.y + 180, width: 340, textAlign: "center",
        ...FONT, fontSize: 26, color: HOUSE.muted }}>room view: still straight</div>
      <div style={{ position: "absolute", left: 40, bottom: 40, maxWidth: 560, ...FONT, fontSize: 24, color: HOUSE.muted,
        background: HOUSE.panel, borderRadius: 10, padding: "8px 16px" }}>
        flat table: centrifugal also acts here (at most half the Coriolis push on this path)
      </div>
      <ScaleBadge detail="table 0.5 rad/s, not Earth's 7.29×10⁻⁵ rad/s · time ×1.33" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- s3: equation + globe of f
const fAt = (lat: number) => {
  const i = Math.max(0, Math.min(s3.lat_deg.length - 2, Math.floor(lat + 90)));
  const w = lat + 90 - i;
  return s3.f[i] * (1 - w) + s3.f[i + 1] * w;
};
const FMAX = Math.max(...s3.f.map(Math.abs));
const NEUTRAL = [42, 51, 71], POS = [142, 111, 216], NEG = [76, 175, 110]; // violet (f>0) ↔ green (f<0), centred at 0
const fColor = (fv: number) => {
  const s = Math.min(1, Math.abs(fv) / FMAX), end = fv >= 0 ? POS : NEG;
  const c = NEUTRAL.map((n, j) => Math.round(n + (end[j] - n) * s));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
const hex = (rgb: string) => "#" + rgb.match(/\d+/g)!.map((v) => Number(v).toString(16).padStart(2, "0")).join("");
// latitude bands every 15°, filled with dense latitude circles (house Globe draws lon/lat polylines)
const BAND_PATHS: { pts: [number, number][]; color: string }[] = (() => {
  const out: { pts: [number, number][]; color: string }[] = [];
  for (let lat = -89.75; lat < 90; lat += 0.25) {
    const band = Math.floor((lat + 90) / 15);
    const col = hex(fColor(fAt(-90 + band * 15 + 7.5)));
    const pts: [number, number][] = [];
    for (let lon = 0; lon <= 360; lon += 4) pts.push([lon, lat]);
    out.push({ pts, color: col });
  }
  return out;
})();
const sci = (v: number) => {
  if (v === 0) return "0";
  const e = Math.floor(Math.log10(Math.abs(v)));
  return `${(v / 10 ** e).toFixed(2).replace("-", "−")}×10${String(e).replace("-", "⁻").replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+d])}`;
};
const fLat = (lat: number) => s3.f[s3.lat_deg.indexOf(lat)];

const GLOBE_Z = 8.2, GLOBE_TILT = 20;
// apparent radius in px of the unit sphere for the house Globe camera (fov 35°, 1080 px tall)
const GLOBE = { cx: 1460, cy: 470, rpx: 540 / (Math.tan((17.5 * Math.PI) / 180) * Math.sqrt(GLOBE_Z ** 2 - 1)), tilt: GLOBE_TILT };
const SHADOW = "0 0 6px #0f1420, 0 0 3px #0f1420, 0 0 2px #0f1420";
const SceneEquation: React.FC = () => {
  const f = useCurrentFrame();
  const start2 = sec(sc[2].sentences[1].start) - CUT2 - 6; // second line fades in with the second sentence (~15.5 s)
  const endStrip = sec(18.5) - CUT2;
  // reveal in step with the narration: LHS + spinning globe, then "minus two Omega cross v" (Coriolis), centrifugal,
  // caption; "On Earth" -> the f line; then hemisphere labels and the legend with the data readouts
  const t0 = sc[2].sentences[0].start;
  const tC = sec(t0 + 0.9) - CUT2, tF = sec(t0 + 2.2) - CUT2, tA = sec(t0 + 3.0) - CUT2;
  const o1 = ramp(f, 0, 10), oC = ramp(f, tC, tC + 10), oF = ramp(f, tF, tF + 10), oA = ramp(f, tA, tA + 10);
  const o2 = ramp(f, start2, start2 + 12), oL = ramp(f, start2 + 24, start2 + 36), oR = ramp(f, start2 + 42, start2 + 54);
  const ratio = (2 * 0.5) / fLat(45);
  const ylat = (lat: number) => GLOBE.cy - GLOBE.rpx * Math.sin(((lat - GLOBE.tilt) * Math.PI) / 180);
  return (
    <AbsoluteFill style={{ background: HOUSE.bg }}>
      {/* left 60 %: equations */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1210, height: 1080 }}>
        <div style={{ opacity: o1 }}>
          <div style={{ position: "absolute", left: 60, top: 170, ...FONT, fontSize: 30, color: HOUSE.muted }}>
            Vallis §2.1 — acceleration seen in the rotating frame
          </div>
          <div style={{ position: "absolute", left: 0, width: 1090, top: 0, height: 1080 }}>
            <EqLine latex={eq212Shown(oC, oF)} size={38} y={33} />
          </div>
          <div style={{ position: "absolute", left: 1090, top: 0.33 * 1080, transform: "translateY(-50%)", ...FONT,
            fontSize: 33, color: HOUSE.muted }}>(2.12)</div>
          <div style={{ position: "absolute", left: 60, right: 40, top: 480, ...FONT, fontSize: 30, color: HOUSE.muted,
            textAlign: "center", opacity: oA }}>
            both are apparent (“as if”) forces, seen only from the rotating frame
          </div>
        </div>
        <div style={{ opacity: o2 }}>
          <EqLine latex={EQ_280_SHOWN} number="2.80" size={60} y={60} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", ...FONT, fontSize: 30,
            color: HOUSE.muted }}>ϑ = latitude · Vallis §2.3</div>
        </div>
      </div>
      {/* right 40 %: globe shaded by f (one turn per 10 s, anticlockwise seen from above the North Pole) */}
      {/* plain globe while (2.12) is introduced; the f shading cross-fades in with "On Earth, f is …" */}
      {o2 < 1 ? (
        <div style={{ position: "absolute", left: GLOBE.cx - 960, top: GLOBE.cy - 540, width: 1920, height: 1080,
          opacity: o1 * (1 - o2) }}>
          <Globe degPerSecond={36} tiltDeg={GLOBE.tilt} cameraZ={GLOBE_Z} sphereColor="#2a3347" />
        </div>
      ) : null}
      {o2 > 0 ? (
        <div style={{ position: "absolute", left: GLOBE.cx - 960, top: GLOBE.cy - 540, width: 1920, height: 1080,
          opacity: o2 }}>
          <Globe degPerSecond={36} tiltDeg={GLOBE.tilt} cameraZ={GLOBE_Z} paths={BAND_PATHS} sphereColor="#2a3347" />
        </div>
      ) : null}
      <div style={{ position: "absolute", right: 1920 - GLOBE.cx + 16, top: GLOBE.cy - GLOBE.rpx - 78,
        ...FONT, fontSize: 28, color: HOUSE.muted, opacity: o1, whiteSpace: "nowrap" }}>
        ↺ anticlockwise seen from above the N. Pole
      </div>
      <div style={{ opacity: oL }}>
        {[{ lat: 50, t: "NH: turns right" }, { lat: 0, t: "equator: f = 0" }, { lat: -40, t: "SH: turns left" }].map((l) => (
          <div key={l.t} style={{ position: "absolute", left: GLOBE.cx - 200, width: 400, textAlign: "center",
            top: ylat(l.lat) - 20, ...FONT, fontSize: 30, fontWeight: 600, color: HOUSE.ink, textShadow: SHADOW,
            whiteSpace: "nowrap" }}>{l.t}</div>
        ))}
      </div>
      <div style={{ opacity: oR }}>
        {/* legend with the data readouts (fluidpy coriolis_parameter, s3_coriolis_f.json) */}
        <div style={{ position: "absolute", left: GLOBE.cx - 330, top: GLOBE.cy + GLOBE.rpx + 40, width: 660, ...FONT,
          fontSize: 28, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: HOUSE.muted }}>
            <span>f &lt; 0</span>
            <div style={{ flex: 1, height: 18, borderRadius: 4,
              background: `linear-gradient(90deg, ${fColor(-FMAX)}, ${fColor(0)}, ${fColor(FMAX)})` }} />
            <span>f &gt; 0</span>
          </div>
          <div style={{ color: HOUSE.ink, marginTop: 10 }}>
            90°N {sci(fLat(90))} · 45°N {sci(fLat(45))} s⁻¹
          </div>
          <div style={{ color: HOUSE.ink }}>0°: 0 · 45°S {sci(fLat(-45))} s⁻¹</div>
          <div style={{ color: HOUSE.muted, marginTop: 8 }}>
            table 2Ω = 1 s⁻¹: ~{(Math.round(ratio / 1000) * 1000).toLocaleString("en-US").replace(",", " ")}× Earth's f at 45°N
          </div>
        </div>
      </div>
      <LowerThird text="Explore it: Coriolis globe explainer" sub="Chapter 0B notebook · Coriolis block" from={endStrip} />
      <ScaleBadge detail="globe spins 1 turn per 10 s (Earth: 23 h 56 min)" />
    </AbsoluteFill>
  );
};

export const PocCoriolis: React.FC<{ audio?: string }> = ({ audio = "narration.wav" }) => (
  <AbsoluteFill style={{ background: HOUSE.bg }}>
    <Sequence name="s1_inertial" durationInFrames={CUT1}><SceneInertial /></Sequence>
    <Sequence name="s2_rotating" from={CUT1} durationInFrames={CUT2 - CUT1}><SceneRotating /></Sequence>
    <Sequence name="s3_equation" from={CUT2} durationInFrames={POC_FRAMES - CUT2}><SceneEquation /></Sequence>
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
