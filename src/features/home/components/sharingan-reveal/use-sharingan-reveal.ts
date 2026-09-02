import { useRef, useSyncExternalStore } from "react";
import { useInView, useMotionValue, useScroll, useSpring } from "motion/react";
import { prefersReducedMotion } from "./sharingan-reveal.utils";

// Doesn't need to react to a live change (matches the one-shot convention
// elsewhere in this codebase), so subscribe is a no-op — but
// useSyncExternalStore is still what's needed here, not useState+useEffect:
// its getServerSnapshot is used for both the SSR pass *and* the client's
// first hydration render, so the two always agree and React never flags a
// hydration mismatch. useState+useEffect can't offer that — the effect only
// runs after hydration commits, which is exactly the "setState in an
// effect" pattern this codebase's lint config treats as an error.
const noSubscription = () => () => {};
const getServerSnapshotFalse = () => false;

export default function useSharinganReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useSyncExternalStore(
    noSubscription,
    prefersReducedMotion,
    getServerSnapshotFalse,
  );

  // Mobile pins/scrubs exactly like desktop now (see the mobile-pin plan) —
  // reduced-motion is the only thing that skips the pin.
  const isScrubbed = !reducedMotion;

  // Progress tied to scroll position through the pinned section. Lower
  // stiffness than a typical UI spring (was 120) so a fast flick genuinely
  // can't catch up to the raw scroll target — the frame scrub advances at a
  // bounded rate no matter how hard someone scrolls, rather than just
  // easing the visual transition between whatever frames it lands on.
  // Damping is scaled down to match (keeping the same ~1.5 damping ratio,
  // so it's still no-bounce/no-overshoot) rather than left at 24, which at
  // this stiffness would feel sluggish even on a slow, deliberate scroll.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const scrubProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 15,
    mass: 0.5,
  });

  // Reduced-motion path: no scrub, no scroll-linked animation — just the
  // fully-assembled end state, rendered via the same components.
  const staticProgress = useMotionValue(1);

  const progress = isScrubbed ? scrubProgress : staticProgress;

  // Starts the frame preload once the section is close to the viewport,
  // well before it's actually visible/being scrubbed, so frames are ready
  // by the time scrubbing starts.
  const shouldPreload = useInView(containerRef, {
    once: true,
    margin: "200px",
  });

  return {
    containerRef,
    progress,
    reducedMotion,
    isScrubbed,
    shouldPreload,
  };
}
