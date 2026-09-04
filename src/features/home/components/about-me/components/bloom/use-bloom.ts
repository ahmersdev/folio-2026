import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap-scroll-trigger";
import { prefersReducedMotion } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import {
  BLOOM_MATCH_MEDIA_QUERY,
  BLOOM_SCROLL_START,
  CIRCLE_EASE,
  CIRCLE_STAGGER_EACH_S,
  CIRCLE_TWEEN_DURATION_S,
  RING_TO_RING_OFFSET_S,
} from "./bloom.data";

export default function useBloom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringOneRef = useRef<HTMLDivElement>(null);
  const ringTwoRef = useRef<HTMLDivElement>(null);
  const ringThreeRef = useRef<HTMLDivElement>(null);
  const ringFourRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    // The circles carry no default opacity attribute, so with no tween ever
    // created they're already fully visible — skip the whole scroll-gated
    // reveal under reduced motion rather than trying to zero out a
    // ScrollTrigger-driven "play once" timeline.
    if (prefersReducedMotion()) return;

    // Scoped to lg: the component is `hidden` below lg (see about-me/index.tsx),
    // and a ScrollTrigger against a display:none element is unreliable. matchMedia
    // also self-tears-down (via the returned revert) on breakpoint change.
    const mm = gsap.matchMedia();

    mm.add(BLOOM_MATCH_MEDIA_QUERY, () => {
      const rings = [ringOneRef, ringTwoRef, ringThreeRef, ringFourRef]
        .map((r) => r.current)
        .filter((el): el is HTMLDivElement => el !== null);
      if (rings.length !== 4 || !containerRef.current) return;

      const circleGroups = rings.map((ring) =>
        gsap.utils.toArray<SVGCircleElement>(ring.querySelectorAll("circle")),
      );

      // Paused, gated by ScrollTrigger below — plays once and holds at full
      // bloom, no repeat/reverse.
      const tl = gsap.timeline({ paused: true });

      circleGroups.forEach((circles, ringIndex) => {
        // fromTo (not from): StrictMode's dev-only double-invoke (mount ->
        // cleanup -> mount) kills the first timeline right after
        // immediateRender applies its "from" state, and a plain .from() on
        // the second run would then read that leftover value as its
        // implicit "to" state, freezing the element.
        //
        // opacity only — deliberately not scale/transform: half of each
        // ring's circles carry a static SVG `transform="matrix(...)"` with a
        // negative determinant (a deliberate mirror baked in so that half's
        // gradients point outward correctly). Animating `scale` sets
        // scaleX/scaleY to a plain positive value, which overwrites that
        // mirrored component and flips those circles' gradients once the
        // tween completes. Opacity never touches `transform`, so it can't
        // clobber it.
        tl.fromTo(
          circles,
          { opacity: 0 },
          {
            opacity: 1,
            duration: CIRCLE_TWEEN_DURATION_S,
            ease: CIRCLE_EASE,
            // Source order matches the rings' own confirmed angular sweep
            // order, so a plain "each" stagger sweeps around the ring.
            stagger: { each: CIRCLE_STAGGER_EACH_S },
          },
          ringIndex === 0 ? 0 : `<${RING_TO_RING_OFFSET_S}`,
        );
      });

      let played = false;

      // Takes the ScrollTrigger instance as a param (rather than closing
      // over the outer `trigger` const) so it's safe to call from onEnter
      // even when GSAP invokes it synchronously inside create() itself —
      // e.g. when the trigger point has already been passed at creation
      // time — before the `const trigger = ...` assignment below exists.
      const playOnce = (instance: ScrollTrigger) => {
        if (played) return;
        played = true;
        instance.kill();
        tl.play();
      };

      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: BLOOM_SCROLL_START,
        once: true,
        onEnter: (self) => playOnce(self),
      });

      // onEnter only fires on a live scroll transition past `start`. Two
      // related problems on a page load/refresh where the scroll position
      // is already past that point: (1) there's no transition for onEnter to
      // catch, and (2) the browser's own scroll restoration can settle
      // asynchronously (after this effect already ran) and, in several
      // browsers, without ever firing a real `scroll` event — so checking
      // just once, here, isn't reliable either. Check now for the common
      // case, then re-check (with a forced refresh, since layout/scroll may
      // have shifted) once the page has fully finished loading, which is
      // when restoration is guaranteed to have settled.
      const checkAlreadyInView = () => {
        if (played) return;
        ScrollTrigger.refresh();
        if (trigger.progress > 0) playOnce(trigger);
      };

      checkAlreadyInView();
      if (!played) {
        if (document.readyState === "complete") {
          checkAlreadyInView();
        } else {
          window.addEventListener("load", checkAlreadyInView, {
            once: true,
          });
        }
      }

      return () => {
        window.removeEventListener("load", checkAlreadyInView);
        trigger.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return { containerRef, ringOneRef, ringTwoRef, ringThreeRef, ringFourRef };
}
