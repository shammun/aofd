// Separate Remotion entry for ch00_coordinates_sphere (#5c), so this movie bundles independently of the other movies. It is also
// registered in movies/src/Root.tsx as Ch00CoordinatesSphere.
import { registerRoot } from "remotion";
import { RootCS } from "./RootCS";

registerRoot(RootCS);
