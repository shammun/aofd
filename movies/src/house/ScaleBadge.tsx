import React from "react";
import { HOUSE } from "./palette";

/**
 * The fixed "not to scale" badge required on every exaggerated scene (R1 §4.2, PLANNING §8.4). `detail` names the
 * exaggeration, e.g. "turntable 0.5 rad/s, not Earth's 7.3e-5 rad/s" or "vertical ×1000". The id lets movie_qa and the
 * reviewer find it in the composition source.
 */
export const ScaleBadge: React.FC<{ detail?: string; corner?: "tl" | "tr" | "bl" | "br" }> = ({ detail, corner = "tr" }) => {
  const pos: React.CSSProperties = {
    tl: { top: 36, left: 40 }, tr: { top: 36, right: 40 }, bl: { bottom: 36, left: 40 }, br: { bottom: 36, right: 40 },
  }[corner];
  return (
    <div data-badge="not-to-scale" style={{ position: "absolute", ...pos, background: "rgba(216,178,58,0.14)",
      border: "2px solid #d8b23a", color: "#f0d78a", borderRadius: 12, padding: "10px 18px", fontFamily: HOUSE.font,
      fontSize: 26, maxWidth: 560 }}>
      <b>not to scale</b>{detail ? <span style={{ color: HOUSE.ink }}> · {detail}</span> : null}
    </div>
  );
};
