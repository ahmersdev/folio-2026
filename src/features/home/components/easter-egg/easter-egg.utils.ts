// One-shot check (no matchMedia change listener), matching the pattern in
// sharingan-reveal.utils.ts's prefersReducedMotion.
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
