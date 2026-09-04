import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import {
  HEADER_DEFAULT_INSET_PX,
  HEADER_DEFAULT_TOP_INSET_PX,
  HEADER_REVEAL_DELAY_S,
  HEADER_REVEAL_DURATION_S,
  HEADER_REVEAL_EASE,
  HEADER_REVEAL_Y_PERCENT_FROM,
  HEADER_SCROLLED_INSET_PX,
  HEADER_SCROLLED_TOP_INSET_PX,
  HEADER_SCROLL_EASE,
  HEADER_SCROLL_TWEEN_DURATION_S,
} from "./header.data";

export default function useHeader() {
  const headerRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const reduceMotion = prefersReducedMotion();
    let scrolled = false;

    // fromTo (not from): immediateRender applies the offscreen "from" state
    // synchronously in this layout effect, before the browser's first paint,
    // so there's no static hidden className needed and no FOUC — same
    // approach as the hero/about-me reveals. Under reduced motion the hero
    // shows its final state immediately with no reveal to wait on, so the
    // header should match that and appear in place right away instead of
    // sliding in after HEADER_REVEAL_DELAY_S.
    const revealTween = reduceMotion
      ? gsap.set(header, { yPercent: 0 })
      : gsap.fromTo(
          header,
          { yPercent: HEADER_REVEAL_Y_PERCENT_FROM },
          {
            yPercent: 0,
            duration: HEADER_REVEAL_DURATION_S,
            ease: HEADER_REVEAL_EASE,
            delay: HEADER_REVEAL_DELAY_S,
          },
        );

    // Animate left/right/top insets rather than width: the header is fixed
    // and full-bleed (inset-x-0 top-0), so pulling all three edges in by the
    // same amount narrows and lifts it off the viewport edge while staying
    // centered, with no over-constrained left/right/width conflict for the
    // browser to resolve.
    const onScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled === scrolled) return;
      scrolled = isScrolled;

      gsap.to(header, {
        left: isScrolled ? HEADER_SCROLLED_INSET_PX : HEADER_DEFAULT_INSET_PX,
        right: isScrolled ? HEADER_SCROLLED_INSET_PX : HEADER_DEFAULT_INSET_PX,
        top: isScrolled
          ? HEADER_SCROLLED_TOP_INSET_PX
          : HEADER_DEFAULT_TOP_INSET_PX,
        duration: reduceMotion ? 0 : HEADER_SCROLL_TWEEN_DURATION_S,
        ease: HEADER_SCROLL_EASE,
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      revealTween.kill();
    };
  }, []);

  return { headerRef };
}
