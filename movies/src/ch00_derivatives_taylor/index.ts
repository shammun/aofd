// Separate Remotion entry for ch00_derivatives_taylor (#4), so this movie bundles independently of the other movies being
// built in parallel (same pattern as ch00_weather_basics and ch00_vectors_index_notation). It is also registered in
// movies/src/Root.tsx as Ch00DerivativesTaylor.
import { registerRoot } from "remotion";
import { RootDT } from "./RootDT";

registerRoot(RootDT);
