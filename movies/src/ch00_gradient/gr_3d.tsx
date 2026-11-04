// 3-D pieces of ch00_gradient (#6): the Mont Blanc drape (ETOPO 15″ heights ×2 under the Sentinel-2 texture), the analytic hills
// (title hill, s03 hillside) as height-coloured terrain, and the Singapore column floor. All inside the house View3D (Z up, km);
// overlays (arrows, labels) are drawn in SVG through the same camera's projector. Inside the 3-D trees only three.js tags.
import React, { useMemo } from "react";
import * as THREE from "three";
import { D, IMG, LUT_H } from "./gr_lib";
import { Terrain, fieldTexture, MapPlane } from "./kit_gr/wb";
import { useTex } from "./kit_gr/globe";
import { V3 } from "../house/kit/cam";

// ---------------------------------------------------------------- Mont Blanc: local km frame
const MB = D.mb;
export const MB_LAT0 = MB.box[0], MB_LAT1 = MB.box[1], MB_LON0 = MB.box[2], MB_LON1 = MB.box[3];
const MB_LC = (MB_LAT0 + MB_LAT1) / 2, MB_OC = (MB_LON0 + MB_LON1) / 2;
export const KX = 111.32 * Math.cos((MB_LC * Math.PI) / 180), KY = 111.19;
export const ZEX = 2;                                   // heights ×2 on screen (said in s15 S3)
/** lat/lon/height [m] → world (km; z exaggerated) */
export const mbW = (lat: number, lon: number, h: number): V3 => [(lon - MB_OC) * KX, (lat - MB_LC) * KY, (h / 1000) * ZEX];
export const MB_X0 = (MB_LON0 - MB_OC) * KX, MB_X1 = (MB_LON1 - MB_OC) * KX, MB_Y0 = (MB_LAT0 - MB_LC) * KY, MB_Y1 = (MB_LAT1 - MB_LC) * KY;
const MBH = new Float32Array(MB.h as number[]);
/** bilinear height [m] of the 15″ drape grid at (lat, lon) */
export const mbH = (lat: number, lon: number): number => {
  const ny = MB.ny as number, nx = MB.nx as number, la = MB.lat as number[], lo = MB.lon as number[];
  const fy = ((lat - la[0]) / (la[ny - 1] - la[0])) * (ny - 1), fx = ((lon - lo[0]) / (lo[nx - 1] - lo[0])) * (nx - 1);
  const j = Math.max(0, Math.min(ny - 2, Math.floor(fy))), i = Math.max(0, Math.min(nx - 2, Math.floor(fx))), v = fy - j, u = fx - i;
  const g = (jj: number, ii: number) => MBH[jj * nx + ii];
  return (1 - v) * ((1 - u) * g(j, i) + u * g(j, i + 1)) + v * ((1 - u) * g(j + 1, i) + u * g(j + 1, i + 1));
};
/** the drape: ETOPO 15″ heights ×2, Sentinel-2 true colour (26 Sep 2023) */
export const MontBlanc3D: React.FC<{ o?: number }> = ({ o = 1 }) => {
  const tex = useTex(IMG("mb_s2.jpg"));
  if (o <= 0) return null;
  return <Terrain H={MBH} ny={MB.ny} nx={MB.nx} x0={MB_X0} x1={MB_X1} y0={MB_Y0} y1={MB_Y1} zs={ZEX / 1000} tex={tex} />;
};

// ---------------------------------------------------------------- analytic hills as terrain (km; heights in km × zex)
/** a height-coloured terrain from a function h(x, y) [m] on [−R, R]² with n × n nodes */
export const FnTerrain: React.FC<{ h: (x: number, y: number) => number; R: number; n?: number; zex: number; lo: number; hi: number; o?: number }> = ({
  h, R, n = 81, zex, lo, hi, o = 1 }) => {
  const { H, tex } = useMemo(() => {
    const H = new Float32Array(n * n);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) H[j * n + i] = h(-R + (2 * R * i) / (n - 1), -R + (2 * R * j) / (n - 1));
    return { H, tex: fieldTexture(H, n, n, LUT_H, lo, hi, 1) };
  }, [h, R, n, lo, hi]);
  if (o <= 0) return null;
  return <Terrain H={H} ny={n} nx={n} x0={-R} x1={R} y0={-R} y1={R} zs={zex / 1000} tex={tex} />;
};

// ---------------------------------------------------------------- Singapore floor (Blue Marble patch, km frame centred on the station)
const SG = D.sing;
export const SG_KX = 111.32 * Math.cos((SG.site[0] * Math.PI) / 180), SG_KY = 111.19;
export const sgW = (lat: number, lon: number, zkm = 0, zs = 1): V3 => [(lon - SG.site[1]) * SG_KX, (lat - SG.site[0]) * SG_KY, zkm * zs];
export const SingaporeFloor: React.FC<{ o?: number; dim?: number }> = ({ o = 1, dim = 1 }) => {
  const tex = useTex(IMG("sing_floor.jpg"));
  const fb = SG.floor_box as number[];
  const a = sgW(fb[0], fb[2]), b = sgW(fb[1], fb[3]);
  return <MapPlane tex={tex} x0={a[0]} x1={b[0]} y0={a[1]} y1={b[1]} z={0} o={o} dim={dim} />;
};

/** a translucent fog sheet (decorative, s03) between the camera and the far slope */
export const FogSheet: React.FC<{ z: number; R: number; o?: number }> = ({ z, R, o = 0.4 }) => {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#c9d3e6", transparent: true, depthWrite: false, side: THREE.DoubleSide }), []);
  mat.opacity = o;
  if (o <= 0) return null;
  return <mesh material={mat} position={[0, R * 0.55, z]} renderOrder={30}><planeGeometry args={[2 * R, R * 0.9]} /></mesh>;
};
