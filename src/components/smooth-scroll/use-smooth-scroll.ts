import Lenis from "lenis";
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from "@/lib";
import { LENIS_LERP, LENIS_WHEEL_MULTIPLIER } from "./smooth-scroll.data";

export default function useSmoothScroll() {
  useIsomorphicLayoutEffect(() => {
    const lenis = new Lenis({
      lerp: LENIS_LERP,
      wheelMultiplier: LENIS_WHEEL_MULTIPLIER,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}
