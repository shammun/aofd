// kit_cs (ch00_coordinates_sphere, Part 3): the textured Earth with the cuts this movie needs, as one declarative mesh
//   whole  the Blue Marble sphere, optionally translucent (alpha < 1) so the centre and the axes inside show
//   mer    the Earth cut along the meridian plane through lon0: the half EAST of lon0 stays (its flat face, a warm dark-grey
//          section, faces the WEST side of the globe), the western half slides away along `dir` by 2.2 radii × slide and fades
//   lat    the Earth cut across at latitude lat0: the lower part stays (flat disc face at height sin lat0, radius cos lat0),
//          the cap above lifts by `lift` radii and fades to `capO`
// The kit's HalfEarthMesh (cross-product Part 2, UV2-20) slides its half along the face normal only (towards the camera); here the
// slide direction is a parameter so the half leaves to the side of the frame. Only THREE intrinsic tags (group, mesh) — the
// R3F tree never gets an SVG tag (build-1 K6 lesson). Pure function of props (no state, no RNG).
import React, { useMemo } from "react";
import * as THREE from "three";
import { V3 } from "./cam";
import { faceDisc, ll, sphereGeo } from "./globe";

const D2R = Math.PI / 180;
export type Cut = { kind: "whole" } | { kind: "mer"; lon0: number; slide: number; dir: V3 } | { kind: "lat"; lat0: number; lift: number; capO: number; polar?: boolean };
const FACE = "#4a3d36";   // warm dark-grey section (storyboard s04)

/** a horizontal disc at height y (normal +Y), radius r */
const latDisc = (y: number, r: number) => {
  const g = new THREE.CircleGeometry(r * 0.999, 160);
  g.rotateX(-Math.PI / 2);
  g.translate(0, y, 0);
  return g;
};

/** fix loop 1 (review 1 M2): the equator face seen from above the North Pole, textured with the TRUE north-polar view of the cap above it
 * (each face point shows the surface point straight above it: radius cos(lat), angle = longitude), darkened like a section. So the
 * 0° spoke runs towards Europe and 90° E towards India, and a foot point lies under its own city (no oblique parallax through a
 * translucent face). Rings in latitude (fine near the rim), seam duplicated at ±180°. */
const polarDisc = (y: number, lat0: number) => {
  const nLon = 240, nLat = 90, pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let j = 0; j <= nLat; j++) {
    const lat = 90 - ((90 - lat0) * j) / nLat, r = Math.cos(lat * D2R) * 0.999;
    for (let i = 0; i <= nLon; i++) {
      const lon = -180 + (360 * i) / nLon, lo = lon * D2R;
      pos.push(r * Math.sin(lo), y, r * Math.cos(lo));
      uv.push(i / nLon, (lat + 90) / 180);
    }
  }
  for (let j = 0; j < nLat; j++) for (let i = 0; i < nLon; i++) {
    const a = j * (nLon + 1) + i, b = a + nLon + 1;
    idx.push(a, b, a + 1, a + 1, b, b + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
};
const POLAR_DIM = 0.4;   // the polar face is darkened so the overlays (axes, spokes, labels) read on it

export const EarthMesh: React.FC<{ tex: THREE.Texture | null; alpha?: number; cut?: Cut; faceO?: number }> = ({ tex, alpha = 1, cut = { kind: "whole" }, faceO = 0.97 }) => {
  const kind = cut.kind;
  const lon0 = cut.kind === "mer" ? cut.lon0 : 0, lat0 = cut.kind === "lat" ? cut.lat0 : 0;
  const geoA = useMemo(() => (kind === "mer" ? sphereGeo(lon0, lon0 + 180, 180, 180) : kind === "lat" ? sphereGeo(-180, 180, 360, 180, 1, -90, lat0) : sphereGeo(-180, 180, 360, 180)),
    [kind, lon0, lat0]);
  const geoB = useMemo(() => (kind === "mer" ? sphereGeo(lon0 - 180, lon0, 180, 180) : kind === "lat" ? sphereGeo(-180, 180, 360, 60, 1, lat0, 90) : null), [kind, lon0, lat0]);
  const polar = cut.kind === "lat" && !!cut.polar;
  const face = useMemo(() => (kind === "mer" ? faceDisc(lon0) : kind === "lat" ? latDisc(Math.sin(lat0 * D2R), Math.cos(lat0 * D2R)) : null), [kind, lon0, lat0]);
  const pFace = useMemo(() => (polar ? polarDisc(Math.sin(lat0 * D2R), lat0) : null), [polar, lat0]);
  const mP = useMemo(() => { const m = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true }); m.color.setScalar(POLAR_DIM); return m; }, []);
  if (mP.map !== tex) { mP.map = tex; mP.needsUpdate = true; }
  const mA = useMemo(() => new THREE.MeshBasicMaterial({ side: THREE.FrontSide, transparent: true }), []);
  const mB = useMemo(() => new THREE.MeshBasicMaterial({ side: THREE.FrontSide, transparent: true }), []);
  const mF = useMemo(() => new THREE.MeshBasicMaterial({ color: FACE, side: THREE.DoubleSide, transparent: true }), []);
  const mF2 = useMemo(() => new THREE.MeshBasicMaterial({ color: FACE, side: THREE.DoubleSide, transparent: true }), []);
  for (const m of [mA, mB]) if (m.map !== tex) { m.map = tex; m.needsUpdate = true; }
  mA.opacity = alpha; mA.depthWrite = alpha > 0.98;
  let offB: V3 = [0, 0, 0], oB = 0, oF = 0;
  if (cut.kind === "mer") {
    const s = Math.max(0, Math.min(1, cut.slide));
    offB = [cut.dir[0] * 2.2 * s, cut.dir[1] * 2.2 * s, cut.dir[2] * 2.2 * s];
    oB = alpha * (1 - s);
    oF = s > 0.002 ? faceO * Math.min(1, s * 6) : 0;
  } else if (cut.kind === "lat") {
    offB = [0, cut.lift, 0];
    oB = cut.capO * alpha;
    oF = cut.lift > 0.002 || cut.capO < 0.99 ? (cut.polar ? 1 : faceO) * Math.min(1, Math.max(cut.lift * 8, 1 - cut.capO)) : 0;
  }
  mB.opacity = oB; mB.depthWrite = oB > 0.98;
  mF.opacity = oF; mF.depthWrite = oF > 0.98;
  mP.opacity = oF; mP.depthWrite = oF > 0.98;
  mF2.opacity = Math.min(oF, oB); mF2.depthWrite = false;
  // the moving half's own cut face (so the slid half is not hollow): the same disc, moved with it
  const e = cut.kind === "mer" ? ll(0, lon0 - 90) : ([0, 0, 0] as V3);
  return (
    <group>
      <mesh geometry={geoA} material={mA} renderOrder={1} />
      {pFace && oF > 0.01 ? <mesh geometry={pFace} material={mP} renderOrder={2} position={[0, 0.002, 0]} /> : null}
      {face && !pFace && oF > 0.01 ? <mesh geometry={face} material={mF} renderOrder={2} position={cut.kind === "mer" ? [-e[0] * 0.002, 0, -e[2] * 0.002] : [0, 0.002, 0]} /> : null}
      {geoB && oB > 0.01 ? <mesh geometry={geoB} material={mB} position={offB} renderOrder={3} /> : null}
      {face && oB > 0.01 && oF > 0.01 ? <mesh geometry={face} material={mF2} position={[offB[0] + e[0] * 0.002, offB[1] - (cut.kind === "lat" ? 0.002 : 0), offB[2] + e[2] * 0.002]} renderOrder={3} /> : null}
    </group>
  );
};
