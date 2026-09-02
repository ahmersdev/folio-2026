// One-shot check (no matchMedia change listener), matching the pattern in
// hero-banner/components/falling-feathers/falling-feathers.utils.ts.
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
