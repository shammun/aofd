// Separate Remotion entry for ch00_gradient (#6), so this movie bundles independently of the other movies being built in
// parallel (same pattern as ch00_coordinates). It is also registered in movies/src/Root.tsx as Ch00Gradient.
import { registerRoot } from "remotion";
import { RootGR } from "./RootGR";

registerRoot(RootGR);
