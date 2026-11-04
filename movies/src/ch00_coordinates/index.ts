// Separate Remotion entry for ch00_coordinates (#5), so this movie bundles independently of the other movies being built in
// parallel (same pattern as ch00_derivatives_taylor and ch00_weather_basics). It is also registered in movies/src/Root.tsx as
// Ch00Coordinates.
import { registerRoot } from "remotion";
import { RootCO } from "./RootCO";

registerRoot(RootCO);
