// Copied 2026-11-05 into kit_cs (ch00_coordinates_storm, #5b) from kit_co unchanged except this line, so this movie bundles independently.
// Copied 2026-10-28 from movies/src/ch00_weather_basics/kit_wb (unchanged) so this movie bundles independently.
// One-frame probe: the WebGL renderer string (WEBGL_debug_renderer_info) that this Chrome uses, logged and drawn.
import React, { useLayoutEffect, useState } from "react";
import { AbsoluteFill } from "remotion";

export const GpuProbe: React.FC = () => {
  const [info, setInfo] = useState("probing…");
  useLayoutEffect(() => {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    let s = "no WebGL";
    if (gl) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      s = ext ? `${gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)} | ${gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)}` : `${gl.getParameter(gl.RENDERER)}`;
    }
    console.log(`GPUPROBE ${s}`);
    setInfo(s);
  }, []);
  return <AbsoluteFill style={{ background: "#171f33", color: "#e8ecf4", fontSize: 40, padding: 60, fontFamily: "Segoe UI" }}>{info}</AbsoluteFill>;
};
