import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import {
  BAR_WIDTH_TO_PX,
  BAR_X_TO_PX,
  DURATION_S,
  EASE,
  LEAVE_SPEED,
  ROTATE_TO_DEG,
} from "./hamburger.data";

export default function useHamburger() {
  const iconRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    const sideBars = icon.querySelectorAll('[data-hamburger-bar="side"]');
    const reduceMotion = prefersReducedMotion();

    // No explicit "from" values: the icon's -rotate-45 Tailwind class and the
    // bars' native x/width SVG attributes already are the resting state, so
    // GSAP just tweens from whatever's currently on the DOM to the hover
    // target — same approach as use-nav-link.ts.
    //
    // Unlike NavLink (which snaps back instantly on hover-out), the reference
    // site's hamburger genuinely reverse-animates on mouseleave, so this
    // timeline is reversed rather than paused on the way out.
    const tl = gsap.timeline({ paused: true });
    tl.to(
      icon,
      {
        rotate: ROTATE_TO_DEG,
        duration: reduceMotion ? 0 : DURATION_S,
        ease: EASE,
      },
      0,
    ).to(
      sideBars,
      {
        attr: { width: BAR_WIDTH_TO_PX, x: BAR_X_TO_PX },
        duration: reduceMotion ? 0 : DURATION_S,
        ease: EASE,
      },
      0,
    );
    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, []);

  const onMouseEnter = () => tlRef.current?.timeScale(1).play();
  const onMouseLeave = () => tlRef.current?.timeScale(LEAVE_SPEED).reverse();

  return { iconRef, onMouseEnter, onMouseLeave };
}
