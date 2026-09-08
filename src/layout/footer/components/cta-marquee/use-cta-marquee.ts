import { useRef } from "react";
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib";
import { MARQUEE_EASE, MARQUEE_SPEED_PX_PER_S } from "./cta-marquee.data";

export default function useCtaMarquee() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!row1 || !row2) return;

    // Reduced motion: rows stay static — only the first of the two
    // duplicated phrases is visible within the section's overflow-clip
    // bounds, the second sits clipped off to the right.
    if (prefersReducedMotion()) return;

    // Each row duplicates its phrase twice (see TICKER_REPEAT_COUNT), so
    // half of its own scrollWidth is exactly one full loop. Deriving
    // duration from that measured width — rather than a fixed seconds
    // value — keeps both rows at the same literal px/second speed no
    // matter how wide either one renders (the text-size clamp is
    // viewport-relative, so a fixed duration would let them drift apart).
    const durationFor = (row: HTMLDivElement) =>
      row.scrollWidth / 2 / MARQUEE_SPEED_PX_PER_S;

    // Row 1 scrolls left, row 2 scrolls right — the layered, opposite-
    // direction look the reference site uses.
    const tween1 = gsap.to(row1, {
      xPercent: -50,
      repeat: -1,
      ease: MARQUEE_EASE,
      duration: durationFor(row1),
    });
    const tween2 = gsap.fromTo(
      row2,
      { xPercent: -50 },
      {
        xPercent: 0,
        repeat: -1,
        ease: MARQUEE_EASE,
        duration: durationFor(row2),
      },
    );

    // Re-derive duration (not the whole tween) on resize, so an in-flight
    // loop's current position is preserved while its speed re-locks to the
    // row's new measured width.
    //
    // Coalesced to one rAF per burst: a drag-resize can fire "resize"
    // several times before the next paint, and each run reads scrollWidth
    // (forces layout) for both rows — collapsing a burst down to a single
    // read avoids repeatedly forcing that layout for frames the browser
    // hasn't even painted yet.
    let resizeRaf = 0;
    const handleResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        tween1.duration(durationFor(row1));
        tween2.duration(durationFor(row2));
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(resizeRaf);
      tween1.kill();
      tween2.kill();
    };
  }, []);

  return { row1Ref, row2Ref };
}
