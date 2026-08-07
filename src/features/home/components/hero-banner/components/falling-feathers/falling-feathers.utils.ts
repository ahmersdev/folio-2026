import { TRange } from "./falling-feathers.interface";

export function randomInRange([min, max]: TRange) {
  return min + Math.random() * (max - min);
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
