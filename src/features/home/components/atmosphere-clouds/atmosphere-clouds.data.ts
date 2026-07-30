import { TCloudStyle, TRange } from "./atmosphere-clouds.interface";

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

export const POSITION_RANGES: { x: TRange; y: TRange; z: TRange }[] = [
  { x: [-6, -2], y: [3, 4.5], z: [-10, -6] },
  { x: [2, 6], y: [4, 5.5], z: [-14, -9] },
  { x: [-2, 2], y: [5, 6.5], z: [-19, -13] },
];
