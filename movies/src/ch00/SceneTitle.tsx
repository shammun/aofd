import React from "react";
import { AbsoluteFill } from "remotion";
import { HOUSE, ramp, tex } from "../house";

/**
 * SceneTitle — the stand-out scene-title band (storyboard ch00_dot_product_why v4, `title_treatment`, user rule G3).
 * Candidate house component: lives in movies/src/ch00/ until the orchestrator promotes it to movies/src/house/.
 *
 * Full-width band y 0–132 (HOUSE.panel at 0.95, 2-px HOUSE.grid bottom rule, 14-px HOUSE.accent bar on the left);
 * kicker (part name, caps, 28 px, 600, letter-spacing 3 px, accent, baseline y 40); title (60 px bold ink, baseline
 * y 104, max width 1500 px, 52 px if longer; `$…$` segments are rendered with KaTeX inline); a 4-px accent underline at
 * y 116 that grows 0 → title width over frames 6–20; counter "n / N" right-aligned at x 1872, baseline y 104, 28 px muted.
 * Entrance: kicker and title slide in from x − 40 with opacity 0 → 1 over frames 0–12 (title 3 frames later); they fade
 * out over the last 6 frames of the scene (`outAt`), so two titles never overlap. The band itself is drawn by the
 * caller on every frame (put this component outside the scene <Sequence>s), so it never disappears at a cut.
 * Part change: the accent bar widens 14 → 28 px and back over frames 0–24.
 *
 * Everything is a pure function of the frame `f` passed in (scene-relative), so it is deterministic.
 */
export type SceneTitleProps = {
  f: number; kicker: string; title: string; index: number; total: number; partChange?: boolean; outAt?: number;
};

/** Split "text $tex$ text" into HTML: plain parts escaped, $…$ parts rendered with KaTeX (throws on a TeX error). */
const titleHtml = (s: string): string =>
  s.split("$").map((part, i) => (i % 2 === 1 ? tex(part, false)
    : part.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"))).join("");

/** visible characters of a title (TeX segments count roughly as 2 characters each) for the 60 → 52 px rule */
const visibleLen = (s: string) => s.split("$").reduce((n, part, i) => n + (i % 2 === 1 ? 2 : part.length), 0);

export const SceneTitle: React.FC<SceneTitleProps> = ({ f, kicker, title, index, total, partChange = false, outAt }) => {
  const out = outAt !== undefined ? 1 - ramp(f, outAt - 6, outAt) : 1;
  const inK = ramp(f, 0, 12), inT = ramp(f, 3, 15);
  const grow = ramp(f, 6, 20);
  const bar = 14 + (partChange ? 14 * Math.sin(Math.PI * Math.min(1, Math.max(0, f / 24))) : 0);
  const size = visibleLen(title) > 44 ? 52 : 60;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 132, background: HOUSE.panel, opacity: 0.95,
        borderBottom: `2px solid ${HOUSE.grid}`, boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: bar, height: 132, background: HOUSE.accent }} />
      {/* kicker: baseline y 40 (28 px, cap height ≈ 20 px) */}
      <div style={{ position: "absolute", left: 48 - 40 * (1 - inK), top: 12, fontFamily: HOUSE.font, fontSize: 28,
        fontWeight: 600, letterSpacing: 3, color: HOUSE.accent, opacity: inK * out, lineHeight: "34px", whiteSpace: "nowrap" }}>
        {kicker}
      </div>
      {/* title: baseline y 104; the underline is a child of the title box so its width is the title's width */}
      <div style={{ position: "absolute", left: 48 - 40 * (1 - inT), top: 104 - size * 0.93, opacity: inT * out,
        maxWidth: 1500 }}>
        <div style={{ display: "inline-block", position: "relative", fontFamily: HOUSE.font, fontSize: size, fontWeight: 700,
          color: HOUSE.ink, lineHeight: `${size * 1.15}px`, whiteSpace: "nowrap" }}>
          <span dangerouslySetInnerHTML={{ __html: titleHtml(title) }} />
          <div style={{ position: "absolute", left: 0, top: 116 - (104 - size * 0.93), height: 4, width: `${grow * 100}%`,
            background: HOUSE.accent }} />
        </div>
      </div>
      <div style={{ position: "absolute", right: 1920 - 1872, top: 104 - 26, fontFamily: HOUSE.font, fontSize: 28,
        color: HOUSE.muted, opacity: out, lineHeight: "32px" }}>
        {index} / {total}
      </div>
    </AbsoluteFill>
  );
};

/**
 * PartCard — the part opener under the band: the stage dims to 35 % (the caller multiplies its stage opacity by
 * `partCardDim(f)`), a centred card shows the part name (84 px bold) and a one-line subtitle (40 px muted); fades in over
 * 10 frames, holds, fades out over 10 frames, 2.0 s in all (60 frames at 30 fps), starting at frame `at`.
 */
export const PART_CARD_FRAMES = 60;
export const partCardO = (f: number, at = 0) =>
  ramp(f, at, at + 10) * (1 - ramp(f, at + PART_CARD_FRAMES - 10, at + PART_CARD_FRAMES));
export const partCardDim = (f: number, at = 0) => 1 - 0.65 * partCardO(f, at);
export const PartCard: React.FC<{ f: number; name: string; subtitle: string; at?: number }> = ({ f, name, subtitle, at = 0 }) => {
  const o = partCardO(f, at);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
      <div style={{ opacity: o, background: HOUSE.panel, border: `3px solid ${HOUSE.accent}`, borderRadius: 22,
        padding: "40px 80px", textAlign: "center", fontFamily: HOUSE.font, marginTop: 66 }}>
        <div style={{ fontSize: 84, fontWeight: 700, color: HOUSE.ink }}>{name}</div>
        <div style={{ fontSize: 40, color: HOUSE.muted, marginTop: 14 }}>{subtitle}</div>
      </div>
    </AbsoluteFill>
  );
};
