// Separate Remotion entry for ch00_dot_product_v01b (2026-10-28): bundling this file never imports another movie,
// so a half-edited file elsewhere cannot break this build. The orchestrator registers it in movies/src/Root.tsx later.
import { registerRoot } from "remotion";
import { RootDPV } from "./RootDPV";

registerRoot(RootDPV);
