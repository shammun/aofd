import React from "react";
import { HOUSE } from "./palette";

/**
 * Source footnote strip (user rule U-M.3, 2026-10-22): every frame that shows a labelled equation carries, at the
 * bottom, the exact source of each label on screen — book, section, equation number and printed page, or "our label".
 * Full width, y ≈ 1000–1072 at 1080p (bottom 8 px), muted ink on HOUSE.panel, text ≥ 28 px (legible at 640 px wide),
 * items joined with " · ", at most two lines. Badges, grid notes and gauges must sit above y ≈ 990.
 * `o` fades the whole strip; `emphasis` (0…1) brightens the text and border once (no flash: callers ramp it over ≥ 1 s).
 * Player captions also sit at the bottom: the movie page places them above the strip (VTT cue `line:` setting).
 */
export const FOOTNOTE_TOP = 1000;
export const Footnote: React.FC<{ items: string[]; o?: number; emphasis?: number; size?: number }> = ({
  items, o = 1, emphasis = 0, size = 28,
}) => {
  if (!items.length || o <= 0) return null;
  const e = Math.max(0, Math.min(1, emphasis));
  // muted ink (#9aa6bd) → ink (#e8ecf4) as emphasis rises: a smooth brightening, never a flash
  const mix = (a: number, b: number) => Math.round(a + (b - a) * e);
  const ink = `rgb(${mix(0x9a, 0xe8)},${mix(0xa6, 0xec)},${mix(0xbd, 0xf4)})`;
  return (
    <div data-footnote="source" style={{ position: "absolute", left: 0, right: 0, top: FOOTNOTE_TOP, bottom: 8,
      background: HOUSE.panel, opacity: o, display: "flex", alignItems: "center", padding: "0 28px",
      borderTop: `2px solid ${e > 0.05 ? HOUSE.accent : HOUSE.grid}`, boxSizing: "border-box" }}>
      <div style={{ fontFamily: HOUSE.font, fontSize: size, lineHeight: 1.12, color: ink, overflow: "hidden", maxHeight: 2 * 1.12 * size + 2 }}>
        {items.join("  ·  ")}
      </div>
    </div>
  );
};
