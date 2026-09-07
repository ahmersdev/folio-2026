import { COARSE_POINTER_QUERY } from "./custom-cursor.data";

export function subscribeToCoarsePointer(onChange: () => void) {
  const mql = window.matchMedia(COARSE_POINTER_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export function getIsCoarsePointer() {
  return window.matchMedia(COARSE_POINTER_QUERY).matches;
}

// SSR has no pointer to query — assume coarse (no cursor rendered) until the
// client subscribes to the real value, avoiding a hydration mismatch.
export function getServerIsCoarsePointer() {
  return true;
}
