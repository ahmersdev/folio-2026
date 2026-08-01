import { TRange } from "./atmosphere-clouds.interface";

export function randomInRange([min, max]: TRange) {
  return min + Math.random() * (max - min);
}
