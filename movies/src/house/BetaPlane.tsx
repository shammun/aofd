import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { HOUSE } from "./palette";

/**
 * A tilted β-plane patch (x = east, y = north, z = up) whose surface height is `height(x, y, t)` with x, y in [-1, 1]
 * and t in seconds of movie time. Pass a precomputed field instead with `grid` (row-major, ny×nx, values per frame are
 * up to the caller). Colour: f increasing northward is shown as a light-to-dark ramp so "β = df/dy" is visible.
 * Heights are display units; the composition must show a ScaleBadge if they are exaggerated.
 */
export const BetaPlane: React.FC<{
  height?: (x: number, y: number, t: number) => number; n?: number; cameraPos?: [number, number, number];
}> = ({ height = () => 0, n = 64, cameraPos = [0, -2.6, 2.0] }) => {
  const frame = useCurrentFrame();
  const { width, height: H, fps } = useVideoConfig();
  const t = frame / fps;
  const geom = useMemo(() => new THREE.PlaneGeometry(2, 2, n, n), [n]);
  useMemo(() => {
    const pos = geom.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const south = new THREE.Color("#a8d5e2"), north = new THREE.Color("#3a5a99"), c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      pos.setZ(i, height(x, y, t));
      c.copy(south).lerp(north, (y + 1) / 2);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    pos.needsUpdate = true;
    geom.computeVertexNormals();
  }, [geom, height, t]);
  return (
    <ThreeCanvas width={width} height={H} camera={{ fov: 40, position: cameraPos, up: [0, 0, 1], near: 0.01, far: 50 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[1, -2, 3]} intensity={0.8} />
      <mesh geometry={geom}><meshStandardMaterial vertexColors roughness={0.8} metalness={0} side={THREE.DoubleSide} /></mesh>
      <gridHelper args={[2, 8, HOUSE.grid, HOUSE.grid]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.001]} />
    </ThreeCanvas>
  );
};
