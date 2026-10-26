// Everyday objects for the cross-product movie (kit_cp): Door3D, BottleCap3D, Screw3D, Spanner3D (+ bolt and plate).
// Z-up world. Angles in radians, + = anticlockwise seen from above (about +z). Pure functions of props.
import React, { useMemo } from "react";
import * as THREE from "three";

const MUTED = "#9aa6bd", DARK = "#3a4766", EDGE = "#f4ecd2";
const std = (color: string, o = 1, emiss = 0.18, rough = 0.6) => {
  const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, transparent: o < 1, opacity: o });
  m.emissive.set(color).multiplyScalar(emiss);
  return m;
};

/** Door hinged on the z axis at the origin; closed along +x; `swing` [rad] about +z. Walls on both sides of the
 * opening. 1.0 wide, 2.0 tall, 0.05 thick. */
export const Door3D: React.FC<{ swing: number; o?: number }> = ({ swing, o = 1 }) => {
  const g = useMemo(() => {
    const box = new THREE.BoxGeometry(1.0, 0.05, 2.0);
    box.translate(0.5, 0, 1.0);
    return { box, edges: new THREE.EdgesGeometry(box) };
  }, []);
  const mats = useMemo(() => ({ door: std(MUTED, 0.75, 0.15), edge: new THREE.LineBasicMaterial({ color: EDGE, transparent: true, opacity: 0.85 }),
    wall: std("#4a5677", 1, 0.15, 0.9), knob: std("#d8b23a", 1, 0.3) }), []);
  mats.door.opacity = 0.75 * o; mats.edge.opacity = 0.85 * o;
  return (
    <group>
      <group rotation={[0, 0, swing]}>
        <mesh geometry={g.box} material={mats.door} />
        <lineSegments geometry={g.edges} material={mats.edge} />
        <mesh material={mats.knob} position={[0.86, 0.06, 0.95]}><sphereGeometry args={[0.045, 16, 12]} /></mesh>
      </group>
      <mesh material={mats.wall} position={[-0.35, 0, 0.02]}><boxGeometry args={[0.6, 0.12, 0.04]} /></mesh>
      <mesh material={mats.wall} position={[1.35, 0, 0.02]}><boxGeometry args={[0.6, 0.12, 0.04]} /></mesh>
    </group>
  );
};

/** Bottle (lathe, translucent) and a knurled cap; the cap turns by `angle` about +z and lifts by `lift`.
 * `markA` (teal) sits on the cap and turns with it; `markB` (orange) is fixed on the bottle's shoulder. */
export const BottleCap3D: React.FC<{ angle: number; lift: number; markA: number; markB: number; o?: number; capScale?: number }> = ({
  angle, lift, markA, markB, o = 1 }) => {
  const g = useMemo(() => {
    const prof: THREE.Vector2[] = [];
    const P = (r: number, z: number) => prof.push(new THREE.Vector2(r, z));
    P(0.001, 0); P(0.5, 0); P(0.55, 0.06); P(0.55, 0.85); P(0.5, 1.0); P(0.32, 1.18); P(0.25, 1.3); P(0.25, 1.42); P(0.001, 1.42);
    const bottle = new THREE.LatheGeometry(prof, 64);
    bottle.rotateX(Math.PI / 2);
    // knurled cap: cylinder side radius modulated by 48 ridges
    const cap = new THREE.CylinderGeometry(0.34, 0.34, 0.28, 192, 1, false);
    const pos = cap.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i), y = pos.getY(i);
      const r = Math.hypot(x, z);
      if (r > 0.33 && Math.abs(Math.abs(y) - 0.14) > 1e-4) {
        const th = Math.atan2(z, x), rr = 0.34 + 0.018 * Math.cos(48 * th);
        pos.setXYZ(i, (x / r) * rr, y, (z / r) * rr);
      } else if (r > 0.33) {
        const th = Math.atan2(z, x), rr = 0.34 + 0.018 * Math.cos(48 * th);
        pos.setXYZ(i, (x / r) * rr, y, (z / r) * rr);
      }
    }
    cap.computeVertexNormals();
    cap.rotateX(Math.PI / 2);
    return { bottle, cap };
  }, []);
  const mats = useMemo(() => ({ bottle: std("#5b7fa8", 0.32, 0.15, 0.3), cap: std("#c9d2e3", 1, 0.2, 0.55), a: std("#2aa198", 1, 0.45), b: std("#e8833a", 1, 0.45) }), []);
  mats.bottle.opacity = 0.32 * o;
  const capZ = 1.42 + 0.14 + lift;
  return (
    <group>
      <mesh geometry={g.bottle} material={mats.bottle} renderOrder={3} />
      <group position={[0, 0, capZ]} rotation={[0, 0, angle]}>
        <mesh geometry={g.cap} material={mats.cap} />
        <mesh material={mats.a} position={[0.3 * Math.cos(markA), 0.3 * Math.sin(markA), 0.15]}><boxGeometry args={[0.1, 0.1, 0.03]} /></mesh>
        <mesh material={mats.a} position={[0.355 * Math.cos(markA), 0.355 * Math.sin(markA), 0]} rotation={[0, 0, markA]}><boxGeometry args={[0.03, 0.08, 0.26]} /></mesh>
      </group>
      <mesh material={mats.b} position={[0.27 * Math.cos(markB), 0.27 * Math.sin(markB), 1.36]} rotation={[0, 0, markB]}><boxGeometry args={[0.06, 0.1, 0.1]} /></mesh>
    </group>
  );
};

/** A right-handed wood screw entering a block whose top is at z = 0: the screw turns by `angle` and rises by
 * `advance` (z of its head = 0.5 + advance). Thread: helix (r cos t, r sin t, p t / 2π) — right-handed (rhr.json). */
export const Screw3D: React.FC<{ angle: number; advance: number; o?: number }> = ({ angle, advance }) => {
  const g = useMemo(() => {
    const pitch = 0.25, turns = 7, R = 0.16;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= turns * 48; i++) {
      const t = (i / 48) * 2 * Math.PI;
      pts.push(new THREE.Vector3(R * Math.cos(t), R * Math.sin(t), -1.55 + (pitch * t) / (2 * Math.PI)));
    }
    const thread = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), turns * 48, 0.035, 8, false);
    const shaft = new THREE.CylinderGeometry(0.13, 0.04, 1.75, 32);
    shaft.rotateX(Math.PI / 2);
    shaft.translate(0, 0, -0.62);
    const head = new THREE.CylinderGeometry(0.34, 0.2, 0.16, 48);
    head.rotateX(Math.PI / 2);
    head.translate(0, 0, 0.36);
    return { thread, shaft, head };
  }, []);
  const mats = useMemo(() => ({ metal: std("#c9d2e3", 1, 0.18, 0.35), slot: std("#1d2740", 1, 0.0), block: std("#3a4766", 1, 0.12, 0.85) }), []);
  return (
    <group>
      <group position={[0, 0, advance]} rotation={[0, 0, angle]}>
        <mesh geometry={g.shaft} material={mats.metal} />
        <mesh geometry={g.thread} material={mats.metal} />
        <mesh geometry={g.head} material={mats.metal} />
        <mesh material={mats.slot} position={[0, 0, 0.445]}><boxGeometry args={[0.6, 0.07, 0.04]} /></mesh>
      </group>
      <mesh material={mats.block} position={[0, 0, -0.6]}><boxGeometry args={[1.8, 1.4, 1.2]} /></mesh>
    </group>
  );
};

/** Open-ended spanner on a hex bolt in a plate. Bolt axis z at the origin; the spanner lies along `angle` (rad) with
 * its grip at 0.3 m; `sink` lowers the bolt (thread travel). 1 world unit = 1 m. */
export const Spanner3D: React.FC<{ angle: number; sink?: number; o?: number }> = ({ angle, sink = 0 }) => {
  const g = useMemo(() => {
    const s = new THREE.Shape();
    // handle from x = 0.045 to 0.34, 0.032 wide, rounded end; jaw ring round the bolt with an opening facing −x
    s.moveTo(0.045, -0.016); s.lineTo(0.33, -0.016); s.absarc(0.33, 0, 0.016, -Math.PI / 2, Math.PI / 2, false); s.lineTo(0.045, 0.016);
    s.absarc(0, 0, 0.05, Math.asin(0.016 / 0.05), Math.PI - 0.62, false);
    s.lineTo(-0.028, 0.019); s.lineTo(0.012, 0.019); s.lineTo(0.012, -0.019); s.lineTo(-0.028, -0.019);
    s.absarc(0, 0, 0.05, Math.PI + 0.62, 2 * Math.PI - Math.asin(0.016 / 0.05), false);
    const sp = new THREE.ExtrudeGeometry(s, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 2, curveSegments: 24 });
    const hex = new THREE.CylinderGeometry(0.0215, 0.0215, 0.016, 6);
    hex.rotateX(Math.PI / 2);
    const stud = new THREE.CylinderGeometry(0.011, 0.011, 0.06, 20);
    stud.rotateX(Math.PI / 2);
    return { sp, hex, stud };
  }, []);
  const mats = useMemo(() => ({ steel: std("#c9d2e3", 1, 0.22, 0.35), bolt: std("#aab4c8", 1, 0.18, 0.45), plate: std("#3a4766", 1, 0.1, 0.85) }), []);
  return (
    <group>
      <mesh material={mats.plate} position={[0.12, 0, -0.012]}><boxGeometry args={[0.62, 0.42, 0.024]} /></mesh>
      <group position={[0, 0, -sink]} rotation={[0, 0, angle]}>
        <mesh geometry={g.stud} material={mats.bolt} position={[0, 0, 0.0]} />
        <mesh geometry={g.hex} material={mats.bolt} position={[0, 0, 0.012]} rotation={[0, 0, Math.PI / 6]} />
        <mesh geometry={g.sp} material={mats.steel} position={[0, 0, 0.008]} />
      </group>
    </group>
  );
};
