// New in kit_mp (ch00_coordinates_maps, 2026-11-05): MorphMesh — the textured Earth as n lobes (gores) whose vertex positions
// come from a position function pos(lat, lon, lobeCentre) evaluated on every render, so one mesh can be a globe, peel into
// gores, stretch into a flat map or flatten into the polar map. The function is the caller's (a linear blend of the JS mirrors
// of fluidpy.geo.mapproj.forward, checked against Python in mp_lib.tsx); UVs are the Blue Marble's equirectangular (lon, lat),
// so every texel stays on its own place through the morph. Pure function of props (no useFrame, no rAF, no randomness).
// Candidate for house/kit (GlobeToPolarMorph / ProjectionMorph in the storyboard; promote when a second movie needs it).
import React, { useMemo } from "react";
import * as THREE from "three";
import { V3 } from "./cam";

/** world position of (lat, lon) [degrees] in the lobe whose central meridian is lc [radians] */
export type PosFn = (lat: number, lon: number, lc: number) => V3;

export const MorphMesh: React.FC<{ tex: THREE.Texture | null; pos: PosFn; lobes?: number; lat0?: number; lat1?: number; nLat?: number; nLon?: number;
  o?: number; dim?: number }> = ({ tex, pos, lobes = 12, lat0 = -90, lat1 = 90, nLat = 60, nLon = 10, o = 1, dim = 1 }) => {
  const geo = useMemo(() => {
    const per = (nLon + 1) * (nLat + 1), uv: number[] = [], idx: number[] = [];
    const ll: number[] = [];
    const w = 360 / lobes;
    for (let L = 0; L < lobes; L++) {
      const lon0 = -180 + L * w;
      for (let j = 0; j <= nLat; j++) {
        const lat = lat0 + ((lat1 - lat0) * j) / nLat;
        for (let i = 0; i <= nLon; i++) {
          const lon = lon0 + (w * i) / nLon;
          uv.push((lon + 180) / 360, (lat + 90) / 180);
          ll.push(lat, lon, ((-180 + (L + 0.5) * w) * Math.PI) / 180);
        }
      }
      for (let j = 0; j < nLat; j++) for (let i = 0; i < nLon; i++) {
        const a = L * per + j * (nLon + 1) + i, b = a + 1, c = a + nLon + 1, d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array((ll.length / 3) * 3), 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    (g as unknown as { _ll: number[] })._ll = ll;
    return g;
  }, [lobes, lat0, lat1, nLat, nLon]);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true }), []);
  if (mat.map !== tex) { mat.map = tex; mat.needsUpdate = true; }
  mat.opacity = o;
  mat.depthWrite = o > 0.98;
  mat.color.setScalar(dim);
  const ll = (geo as unknown as { _ll: number[] })._ll;
  const P = geo.attributes.position as THREE.BufferAttribute;
  const arr = P.array as Float32Array;
  for (let k = 0, n = ll.length / 3; k < n; k++) {
    const p = pos(ll[3 * k], ll[3 * k + 1], ll[3 * k + 2]);
    arr[3 * k] = p[0]; arr[3 * k + 1] = p[1]; arr[3 * k + 2] = p[2];
  }
  P.needsUpdate = true;
  geo.computeBoundingSphere();
  return <mesh geometry={geo} material={mat} frustumCulled={false} />;
};
