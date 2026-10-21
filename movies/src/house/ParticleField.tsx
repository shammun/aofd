import React from "react";
import { useCurrentFrame } from "remotion";
import { HOUSE } from "./palette";

/**
 * Particles moving along PRECOMPUTED paths (R1 §4.2: the movie only interpolates the tested Python output).
 * `paths[k]` is a list of [x, y] samples at times `times` (seconds, shared); x, y in pixels of a `width`×`height` box.
 * Drawn as SVG circles with a short fading trail; position is linear interpolation in time — pure function of frame.
 */
export const ParticleField: React.FC<{
  paths: [number, number][][]; times: number[]; fps: number; width: number; height: number;
  trail?: number; radius?: number; color?: string; timeScale?: number;
}> = ({ paths, times, fps, width, height, trail = 8, radius = 5, color = HOUSE.glyphA, timeScale = 1 }) => {
  const frame = useCurrentFrame();
  const at = (path: [number, number][], tt: number): [number, number] => {
    if (tt <= times[0]) return path[0];
    const last = times.length - 1;
    if (tt >= times[last]) return path[last];
    let i = 0;
    while (i < last - 1 && times[i + 1] < tt) i++;
    const w = (tt - times[i]) / (times[i + 1] - times[i]);
    return [path[i][0] + w * (path[i + 1][0] - path[i][0]), path[i][1] + w * (path[i + 1][1] - path[i][1])];
  };
  const t = (frame / fps) * timeScale;
  return (
    <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0 }}>
      {paths.map((p, k) => {
        const head = at(p, t);
        const tail = Array.from({ length: trail }, (_, j) => at(p, t - ((j + 1) / fps) * timeScale * 2));
        return (
          <g key={k}>
            {tail.map((q, j) => (
              <circle key={j} cx={q[0]} cy={q[1]} r={radius * (1 - j / trail) * 0.8} fill={color}
                opacity={0.5 * (1 - j / trail)} />
            ))}
            <circle cx={head[0]} cy={head[1]} r={radius} fill={color} />
          </g>
        );
      })}
    </svg>
  );
};
