import { useRef } from "react";
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib";
import {
  PROGRESS_DESKTOP_QUERY,
  PROGRESS_END_INSET,
  PROGRESS_REFERENCE_ITEM_COUNT,
  PROGRESS_ROW_SCRUB,
  PROGRESS_SCROLL,
} from "./progress.data";

export default function useProgress() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    const row = rowRef.current;
    if (!track || !row) return;

    // A horizontal scrub has no independent "settled" state distinct from
    // "untranslated" — under reduced motion the row simply never animates.
    if (prefersReducedMotion()) return;

    const cards = row.firstElementChild as HTMLElement | null;
    if (!cards) return;

    const tierFor = () =>
      window.matchMedia(PROGRESS_DESKTOP_QUERY).matches
        ? PROGRESS_SCROLL.desktop
        : PROGRESS_SCROLL.tablet;

    // The scroll length is tuned for the reference's 6 cards and scaled by
    // how much farther our row travels, so the px-per-px pace stays the same. offsetLeft/offsetWidth are plain
    // geometry (unaffected by the GSAP transform); offsetLeft includes the
    // row's start padding.
    const measure = () => {
      const tier = tierFor();
      const items = Array.from(cards.children) as HTMLElement[];
      const itemWidth = Math.max(...items.map((item) => item.offsetWidth));
      const gap = parseFloat(getComputedStyle(cards).columnGap) || 0;

      const referenceWidth =
        PROGRESS_REFERENCE_ITEM_COUNT * itemWidth +
        (PROGRESS_REFERENCE_ITEM_COUNT - 1) * gap;
      const referenceRestRight = referenceWidth * (1 - tier.endShare);
      const restRight = window.innerWidth * (1 - PROGRESS_END_INSET);
      const start = cards.offsetLeft;

      const distance = Math.max(start + cards.offsetWidth - restRight, 0);
      const referenceDistance = Math.max(
        start + referenceWidth - referenceRestRight,
        1,
      );
      const travel =
        tier.travelVh * window.innerHeight * (distance / referenceDistance);

      return { distance, height: travel + tier.tailVh * window.innerHeight };
    };

    const setTrackHeight = () => {
      track.style.height = `${measure().height}px`;
    };
    setTrackHeight();

    // CSS `position: sticky` holds the row on screen; this tween only supplies
    // the horizontal motion. Start/end are functions so a resize across the
    // `lg` breakpoint picks up the other tier on refresh.
    const tween = gsap.to(row, {
      x: () => -measure().distance,
      ease: "none",
      scrollTrigger: {
        trigger: track,
        start: () => tierFor().start,
        end: () => tierFor().end,
        scrub: PROGRESS_ROW_SCRUB,
        invalidateOnRefresh: true,
        onRefreshInit: setTrackHeight,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return { trackRef, rowRef };
}
