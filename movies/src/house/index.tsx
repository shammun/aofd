// House components (R1 §5.2), written once and reused by every chapter. Only the orchestrator or the knowledge-keeper
// edits them; motion-builders import them.
export { HOUSE, TERM, ramp } from "./palette";
export type { TermFamily } from "./palette";
export { TitleCard } from "./TitleCard";
export { EqLine, tex } from "./EqLine";
export type { EqTerm } from "./EqLine";
export { DerivationStrip } from "./DerivationStrip";
export type { DerivLine } from "./DerivationStrip";
export { ScaleBadge } from "./ScaleBadge";
export { Globe, lonlatToXYZ } from "./Globe";
export type { GlobeArrow } from "./Globe";
export { BetaPlane } from "./BetaPlane";
export { ParticleField } from "./ParticleField";
export { MapPanel } from "./MapPanel";
export { LowerThird } from "./LowerThird";
export { EndCard } from "./EndCard";
