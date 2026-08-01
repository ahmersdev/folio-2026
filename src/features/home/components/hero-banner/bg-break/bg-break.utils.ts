import { TLiftPhaseDurations } from "./bg-break.interface";

export function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function randomInt(min: number, max: number) {
  return Math.floor(randomInRange(min, max + 1));
}

export function pickRandomDirection(): 1 | -1 {
  return Math.random() < 0.5 ? 1 : -1;
}

export function easeInOutSine(t: number) {
  return (1 - Math.cos(Math.PI * t)) / 2;
}

// Given seconds elapsed since a lift cycle started, returns the current 0-1
// offset multiplier (0 = at rest, 1 = full lift height) and whether the
// cycle has finished.
export function getLiftOffset(
  elapsedInCycle: number,
  durations: TLiftPhaseDurations,
) {
  const { up, hold, down } = durations;

  if (elapsedInCycle < up) {
    return { offset: easeInOutSine(elapsedInCycle / up), done: false };
  }
  if (elapsedInCycle < up + hold) {
    return { offset: 1, done: false };
  }
  if (elapsedInCycle < up + hold + down) {
    const t = (elapsedInCycle - up - hold) / down;
    return { offset: 1 - easeInOutSine(t), done: false };
  }
  return { offset: 0, done: true };
}

// Random sample of `count` indices from [0, total) excluding anything in
// `exclude`. Simple rejection sampling is fine at this scale (picking <=3
// from a pool of up to 200, excluding <=5).
export function pickUnusedFragmentIndices(
  count: number,
  exclude: Set<number>,
  total: number,
) {
  const picked: number[] = [];
  const maxAttempts = count * 20;
  let attempts = 0;

  while (picked.length < count && attempts < maxAttempts) {
    const candidate = Math.floor(Math.random() * total);
    if (!exclude.has(candidate) && !picked.includes(candidate)) {
      picked.push(candidate);
    }
    attempts++;
  }

  return picked;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Linear step toward target, scaled by duration, not a scripted sine cycle —
// hover needs to handle target reversing mid-flight (fast in/out) without
// waiting for a fixed-duration cycle to finish first.
export function stepHoverValue(
  current: number,
  target: number,
  delta: number,
  upDuration: number,
  downDuration: number,
) {
  const duration = target > current ? upDuration : downDuration;
  const step = delta / duration;
  return target > current
    ? Math.min(target, current + step)
    : Math.max(target, current - step);
}
