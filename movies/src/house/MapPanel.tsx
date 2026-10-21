import React, { useMemo } from "react";
import { geoGraticule10, geoOrthographic, geoPath, geoEquirectangular, geoNaturalEarth1, GeoProjection } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { HOUSE } from "./palette";

/**
 * A d3-geo map panel (SVG). `land` is GeoJSON (e.g. Natural Earth 110 m, public domain, loaded by the composition via
 * staticFile + delayRender); `lines` are extra GeoJSON features (fronts, contours, tracks) drawn on top.
 * For "orthographic" the globe can spin: `rotateDegPerSecond` is applied as a pure function of the frame.
 */
export const MapPanel: React.FC<{
  projection?: "orthographic" | "equirectangular" | "naturalEarth"; land?: FeatureCollection | Feature;
  lines?: { feature: Feature<Geometry>; color?: string; width?: number; dash?: string }[];
  center?: [number, number]; rotateDegPerSecond?: number; width?: number; height?: number; title?: string;
}> = ({ projection = "orthographic", land, lines = [], center = [0, 20], rotateDegPerSecond = 0, width, height, title }) => {
  const frame = useCurrentFrame();
  const vc = useVideoConfig();
  const W = width ?? vc.width, H = height ?? vc.height;
  const proj: GeoProjection = useMemo(() => {
    const p = projection === "orthographic" ? geoOrthographic() : projection === "equirectangular"
      ? geoEquirectangular() : geoNaturalEarth1();
    return p.fitExtent([[40, 40], [W - 40, H - 40]], { type: "Sphere" });
  }, [projection, W, H]);
  if (projection === "orthographic") proj.rotate([-center[0] - (frame / vc.fps) * rotateDegPerSecond, -center[1], 0]);
  const path = geoPath(proj);
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, fontFamily: HOUSE.font }}>
      <path d={path({ type: "Sphere" }) || ""} fill="#13233d" stroke={HOUSE.grid} strokeWidth={2} />
      <path d={path(geoGraticule10()) || ""} fill="none" stroke={HOUSE.grid} strokeWidth={1} />
      {land ? <path d={path(land) || ""} fill="#4a5a48" stroke="#7d8f78" strokeWidth={1} /> : null}
      {lines.map((l, i) => (
        <path key={i} d={path(l.feature) || ""} fill="none" stroke={l.color || HOUSE.glyphB} strokeWidth={l.width ?? 3}
          strokeDasharray={l.dash} />
      ))}
      {title ? <text x={W / 2} y={36} textAnchor="middle" fill={HOUSE.ink} fontSize={30}>{title}</text> : null}
    </svg>
  );
};
