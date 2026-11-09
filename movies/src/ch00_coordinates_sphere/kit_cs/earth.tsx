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
export type Cut = { kind: "whole" } | { kind: "mer"; lon0: number; slide: number; dir: V3 } | { kind: "lat"; lat0: number; lift: number; capO: number; polar?: boolean }
  | { kind: "oct"; gap: number; out: number; lift?: V3; fade?: number }
  | { kind: "wedge"; l0: number; l1: number; open: number };
const FACE = "#4a3d36";   // warm dark-grey section (storyboard s04)
// fix loop p3a (pass-2 review 1 M2/M3): flat cut faces in ONE flat colour read as a dome, not a hollow. Each cutting PLANE gets its own tone
// of the section colour, as if lit from above-left (the equator plane lightest, the 0°/180° meridian plane middle, the 90° E/W plane
// darkest), and every face is outlined (its two radial corner edges + its rim arc) by a thin light tube, so the eye reads planes meeting
// at corners. Unlit tones (MeshBasic), so the Blue Marble skin keeps its true colours.
export const FACE_TONE = { eq: "#7d6553", m0: "#57473c", m90: "#3b302a" };
const EDGE = "#efe0c4";

/** a closed outline (centre -> first rim point -> rim arc -> centre) as a thin tube of world radius r (a few px at the movie's cameras) */
const outlineGeo = (rim: V3[], r: number) => {
  const path = new THREE.CurvePath<THREE.Vector3>();
  const pts = [[0, 0, 0] as V3, ...rim, [0, 0, 0] as V3].map((q) => new THREE.Vector3(...q));
  for (let i = 0; i + 1 < pts.length; i++) path.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
  return new THREE.TubeGeometry(path, 4 * pts.length, r, 6, false);
};

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

export const EarthMesh: React.FC<{ tex: THREE.Texture | null; alpha?: number; cut?: Cut; faceO?: number }> = ({ tex, alpha = 1, cut = { kind: "whole" }, faceO = 0.97 }) =>
  cut.kind === "oct" ? <OctantEarth tex={tex} gap={cut.gap} out={cut.out} lift={cut.lift} fade={cut.fade} />
    : cut.kind === "wedge" ? <WedgeEarth tex={tex} l0={cut.l0} l1={cut.l1} open={cut.open} />
      : <CutEarth tex={tex} alpha={alpha} cut={cut} faceO={faceO} />;

// ------------------------------------------------------------------------------------------------ pass 2: the Earth in eight pieces
// User 2026-11-07 (old 14:13): "slice the Earth along the x, y and z axes … a little hollow between them, so people understand that x, y
// and z start at the middle of the globe". The three coordinate planes (equator plane, the 0°/180° meridian plane, the 90° E/W meridian
// plane) cut the Earth into eight pieces. Each piece is pushed `gap` radii out along its own diagonal (thin gaps where the axes run), and the
// piece between the +x, +y and +z axes (0-90° E, northern half) lifts out along its diagonal by `out` × 0.9 radii and fades, leaving a
// corner hollow at the centre where the three axes meet. Every piece shows its three flat cut faces (quarter discs, the section colour).
const quarterFan = (pts: V3[]) => {
  const pos: number[] = [0, 0, 0];
  for (const q of pts) pos.push(...q);
  const idx: number[] = [];
  for (let i = 1; i < pts.length; i++) idx.push(0, i, i + 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  return g;
};
const OCT = [-180, -90, 0, 90].flatMap((L) => [-90, 0].map((B) => ({ L, B })));
/** the diagonal (unit) of the piece lon L..L+90, lat B..B+90 */
export const octDiag = (L: number, B: number): V3 => ll(B < 0 ? -35.264 : 35.264, L + 45);
/** where a surface point (lat, lon) ends up when its piece is pushed out by `gap` (the arrow to a place follows its piece) */
export const octShift = (lat: number, lon: number, gap: number): V3 => {
  const L = Math.floor((((lon + 180) % 360) + 360) % 360 / 90) * 90 - 180, B = lat < 0 ? -90 : 0;
  const d = octDiag(L, B), p = ll(lat, lon);
  return [p[0] + d[0] * gap, p[1] + d[1] * gap, p[2] + d[2] * gap];
};
/** which cutting plane a face of piece (L, B) lies in: j = 0 the meridian plane at L, 1 at L + 90, 2 the equator plane */
const planeOf = (L: number, j: number): keyof typeof FACE_TONE => (j === 2 ? "eq" : (((j === 0 ? L : L + 90) % 180) + 180) % 180 === 0 ? "m0" : "m90");
const OctantEarth: React.FC<{ tex: THREE.Texture | null; gap: number; out: number; lift?: V3; fade?: number }> = ({ tex, gap, out, lift, fade }) => {
  const geos = useMemo(() => OCT.map(({ L, B }) => {
    const rims = [Array.from({ length: 49 }, (_, i) => ll(B + (90 * i) / 48, L, 0.999)), Array.from({ length: 49 }, (_, i) => ll(B + (90 * i) / 48, L + 90, 0.999)),
      Array.from({ length: 49 }, (_, i) => ll(0, L + (90 * i) / 48, 0.999))];
    return { skin: sphereGeo(L, L + 90, 90, 90, 1, B, B + 90), faces: rims.map((q) => quarterFan(q)),
      edges: rims.map((q) => outlineGeo(q.filter((_, i) => i % 3 === 0 || i === 48), 0.0055)) };
  }), []);
  const mats = useMemo(() => OCT.map(({ L }) => ({ skin: new THREE.MeshBasicMaterial({ side: THREE.FrontSide, transparent: true }),
    faces: [0, 1, 2].map((j) => new THREE.MeshBasicMaterial({ color: FACE_TONE[planeOf(L, j)], side: THREE.DoubleSide, transparent: true })),
    edge: new THREE.MeshBasicMaterial({ color: EDGE, transparent: true }) })), []);
  return (
    <group>
      {OCT.map(({ L, B }, i) => {
        const lifted = L === 0 && B === 0;
        // p3a (review 1 M2): with `lift`, the piece rises along `lift` (screen-up and aside, never towards the camera) at full strength and
        // stays there, offset, until `fade` takes it away; without it, the pass-2 behaviour (out along its diagonal while fading)
        const o = lifted ? (lift ? Math.max(0, 1 - (fade ?? 0)) : Math.max(0, 1 - out)) : 1;
        if (o <= 0.01) return null;
        const m = mats[i];
        if (m.skin.map !== tex) { m.skin.map = tex; m.skin.needsUpdate = true; }
        m.skin.opacity = o; m.skin.depthWrite = o > 0.98;
        for (const fm of m.faces) { fm.opacity = o; fm.depthWrite = o > 0.98; }
        m.edge.opacity = o * 0.9; m.edge.depthWrite = o > 0.98;
        const d = octDiag(L, B), s0 = gap + (lifted && !lift ? 0.9 * out : 0);
        const pos: V3 = lifted && lift ? [d[0] * gap + lift[0] * out, d[1] * gap + lift[1] * out, d[2] * gap + lift[2] * out] : [d[0] * s0, d[1] * s0, d[2] * s0];
        return (
          <group key={i} position={pos}>
            <mesh geometry={geos[i].skin} material={m.skin} renderOrder={lifted ? 4 : 1} />
            {geos[i].faces.map((g, j) => <mesh key={j} geometry={g} material={m.faces[j]} renderOrder={lifted ? 4 : 1} />)}
            {gap > 0.004 ? geos[i].edges.map((g, j) => <mesh key={`e${j}`} geometry={g} material={m.edge} renderOrder={lifted ? 5 : 2} />) : null}
          </group>
        );
      })}
    </group>
  );
};

// ------------------------------------------------------------------------------------------------ p3a: the wedge cut (s25)
// The Earth with the wedge between longitudes l0 and l1 cut out (the cross-product Part 2 quarter cut-away, narrower): two half-disc faces
// through the polar axis meet along the axis, so the axis and the radii of the parallels lie in plain view ON the faces, while every
// place outside the wedge stays on the Blue Marble skin. `open` 0..1: the wedge's skin fades out and the faces fade in (0 = whole Earth).
const halfFan = (lon: number) => quarterFan(Array.from({ length: 97 }, (_, i) => ll(-90 + (180 * i) / 96, lon, 0.999)));
const WedgeEarth: React.FC<{ tex: THREE.Texture | null; l0: number; l1: number; open: number }> = ({ tex, l0, l1, open }) => {
  const geo = useMemo(() => ({ skin: sphereGeo(l1, l0 + 360, 270, 180), plug: sphereGeo(l0, l1, 90, 180), f0: halfFan(l0), f1: halfFan(l1),
    e0: outlineGeo(Array.from({ length: 33 }, (_, i) => ll(-90 + (180 * i) / 32, l0, 0.999)), 0.0045),
    e1: outlineGeo(Array.from({ length: 33 }, (_, i) => ll(-90 + (180 * i) / 32, l1, 0.999)), 0.0045) }), [l0, l1]);
  const m = useMemo(() => ({ skin: new THREE.MeshBasicMaterial({ side: THREE.FrontSide }), plug: new THREE.MeshBasicMaterial({ side: THREE.FrontSide, transparent: true }),
    f0: new THREE.MeshBasicMaterial({ color: FACE_TONE.m0, side: THREE.DoubleSide, transparent: true }),
    f1: new THREE.MeshBasicMaterial({ color: FACE_TONE.m90, side: THREE.DoubleSide, transparent: true }),
    edge: new THREE.MeshBasicMaterial({ color: EDGE, transparent: true }) }), []);
  for (const q of [m.skin, m.plug]) if (q.map !== tex) { q.map = tex; q.needsUpdate = true; }
  const op = Math.max(0, Math.min(1, open));
  m.plug.opacity = 1 - op; m.plug.depthWrite = op < 0.02;
  for (const q of [m.f0, m.f1]) { q.opacity = op; q.depthWrite = op > 0.98; }
  m.edge.opacity = 0.85 * op;
  return (
    <group>
      <mesh geometry={geo.skin} material={m.skin} renderOrder={1} />
      {op > 0.01 ? <>
        <mesh geometry={geo.f0} material={m.f0} renderOrder={2} />
        <mesh geometry={geo.f1} material={m.f1} renderOrder={2} />
        <mesh geometry={geo.e0} material={m.edge} renderOrder={3} />
        <mesh geometry={geo.e1} material={m.edge} renderOrder={3} />
      </> : null}
      {op < 0.99 ? <mesh geometry={geo.plug} material={m.plug} renderOrder={4} /> : null}
    </group>
  );
};

const CutEarth: React.FC<{ tex: THREE.Texture | null; alpha: number; cut: Exclude<Cut, { kind: "oct" } | { kind: "wedge" }>; faceO: number }> = ({ tex, alpha, cut, faceO }) => {
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
    // pass 2 (user 2026-11-07, old 15:22): the removed half no longer travels 2.2 radii out of the 3-D frame (its edge was cut by the
    // frame); it moves 0.2 radii along `dir` (inside the frame's spare room) while it fades out.
    offB = [cut.dir[0] * 0.2 * s, cut.dir[1] * 0.2 * s, cut.dir[2] * 0.2 * s];
    oB = alpha * (1 - s) * (1 - s);
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
