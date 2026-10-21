import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { HOUSE } from "./palette";

/** Unit-sphere point for longitude/latitude in degrees (y = north pole axis). Same convention as assets/viz3d.js. */
export const lonlatToXYZ = (lonDeg: number, latDeg: number, r = 1): [number, number, number] => {
  const lo = (lonDeg * Math.PI) / 180, la = (latDeg * Math.PI) / 180;
  return [r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo)];
};

const graticule = (step: number): THREE.BufferGeometry => {
  const pts: number[] = [];
  const seg = (a: [number, number, number], b: [number, number, number]) => pts.push(...a, ...b);
  for (let lat = -90 + step; lat < 90; lat += step)
    for (let lon = 0; lon < 360; lon += 4) seg(lonlatToXYZ(lon, lat, 1.002), lonlatToXYZ(lon + 4, lat, 1.002));
  for (let lon = 0; lon < 360; lon += step)
    for (let lat = -88; lat < 88; lat += 4) seg(lonlatToXYZ(lon, lat, 1.002), lonlatToXYZ(lon, lat + 4, 1.002));
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
};

export type GlobeArrow = { lon: number; lat: number; dir: [number, number]; length?: number; color?: string };

/**
 * A globe with a graticule, an emphasised equator, the rotation axis and optional local arrows (east, north components
 * of a horizontal vector at a lon/lat). Rotation is a pure function of the frame: `degPerSecond` (0 = still).
 * `paths` are polylines in lon/lat (e.g. precomputed trajectories) drawn on the surface.
 */
export const Globe: React.FC<{
  degPerSecond?: number; tiltDeg?: number; arrows?: GlobeArrow[]; paths?: { pts: [number, number][]; color?: string }[];
  showAxis?: boolean; sphereColor?: string; cameraZ?: number;
}> = ({ degPerSecond = 6, tiltDeg = 20, arrows = [], paths = [], showAxis = true, sphereColor = "#1d3557", cameraZ = 4.2 }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const grat = useMemo(() => graticule(30), []);
  const equator = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p: number[] = [];
    for (let lon = 0; lon <= 360; lon += 3) p.push(...lonlatToXYZ(lon, 0, 1.003));
    g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color: HOUSE.accent }));
  }, []);
  const pathGeoms = useMemo(() => paths.map((pa) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pa.pts.flatMap(([lo, la]) => lonlatToXYZ(lo, la, 1.006)), 3));
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color: pa.color || HOUSE.glyphB }));
  }), [paths]);
  const arrowObjs = useMemo(() => arrows.map((a) => {
    const lo = (a.lon * Math.PI) / 180, la = (a.lat * Math.PI) / 180;
    const east = new THREE.Vector3(Math.cos(lo), 0, -Math.sin(lo));
    const north = new THREE.Vector3(-Math.sin(la) * Math.sin(lo), Math.cos(la), -Math.sin(la) * Math.cos(lo));
    const d = east.multiplyScalar(a.dir[0]).add(north.multiplyScalar(a.dir[1])).normalize();
    const origin = new THREE.Vector3(...lonlatToXYZ(a.lon, a.lat, 1.01));
    return new THREE.ArrowHelper(d, origin, a.length ?? 0.35, new THREE.Color(a.color || HOUSE.glyphA).getHex(), 0.08, 0.05);
  }), [arrows]);
  const spin = ((frame / fps) * degPerSecond * Math.PI) / 180;
  return (
    <ThreeCanvas width={width} height={height} camera={{ fov: 35, position: [0, 0, cameraZ], near: 0.01, far: 100 }}
      style={{ background: "transparent" }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 2, 4]} intensity={1.1} />
      <group rotation={[(tiltDeg * Math.PI) / 180, 0, 0]}>
        <group rotation={[0, spin, 0]}>
          <mesh>
            <sphereGeometry args={[1, 96, 48]} />
            <meshStandardMaterial color={sphereColor} roughness={0.75} metalness={0} />
          </mesh>
          <lineSegments geometry={grat}><lineBasicMaterial color={HOUSE.grid} /></lineSegments>
          <primitive object={equator} />
          {pathGeoms.map((o, i) => <primitive key={i} object={o} />)}
          {arrowObjs.map((o, i) => <primitive key={i} object={o} />)}
        </group>
        {showAxis ? (
          <mesh>
            <cylinderGeometry args={[0.008, 0.008, 2.6, 8]} />
            <meshBasicMaterial color={HOUSE.muted} />
          </mesh>
        ) : null}
      </group>
    </ThreeCanvas>
  );
};
