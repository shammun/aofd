// Separate Remotion entry for ch00_vectors_index_notation (#1a), so this movie bundles independently of the other movies
// being built in parallel (same pattern as ch00_weather_basics). The orchestrator registers it in movies/src/Root.tsx.
import { registerRoot } from "remotion";
import { RootVI } from "./RootVI";

registerRoot(RootVI);
