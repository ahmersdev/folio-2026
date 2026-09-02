import {
  TCloudStyle,
  TDriftBounds,
  TRange,
} from "./atmosphere-clouds.interface";

// Clouds drift sideways and wrap back to the opposite edge once they cross
// this range, so they keep cycling through view instead of drifting off
// forever (previously the only motion was a whole-scene rotation slow enough
// that a cloud could take ~7 minutes to come back around).
export const DRIFT_BOUNDS: TDriftBounds = { min: -18, max: 18 };

export const CLOUD_STYLES: TCloudStyle[] = [
  {
    bounds: [6, 1.5, 2],
    volume: 6,
    color: "#8a2020",
    opacity: 0.7,
    speed: 0.15,
    fade: 40,
  },
  {
    bounds: [7, 1.5, 2],
    volume: 7,
    color: "#6e1616",
    opacity: 0.65,
    speed: 0.1,
    fade: 45,
  },
  {
    bounds: [10, 2, 3],
    volume: 9,
    color: "#4a1010",
    opacity: 0.55,
    speed: 0.08,
    fade: 55,
  },
];

// Parallel to CLOUD_STYLES/POSITION_RANGES (indexed the same way) rather than
// merged into CLOUD_STYLES, since driftSpeed is only consumed by the drift
// loop and isn't a valid prop to spread onto <Cloud>.
export const DRIFT_SPEEDS = [0.35, 0.45, 0.55];

export const POSITION_RANGES: { x: TRange; y: TRange; z: TRange }[] = [
  { x: [-6, -2], y: [3, 4.5], z: [-10, -6] },
  { x: [2, 6], y: [4, 5.5], z: [-14, -9] },
  { x: [-2, 2], y: [5, 6.5], z: [-19, -13] },
];
