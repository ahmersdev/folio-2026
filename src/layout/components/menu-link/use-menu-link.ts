import { useRef } from "react";
import {
  gsap,
  SplitText,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib";
import {
  CHAR_DURATION_S,
  ENTER_STAGGER_AMOUNT_S,
  ENTER_TRAVEL_PERCENT,
  EXIT_STAGGER_AMOUNT_S,
  TEXT_EASE,
  WIPE_DURATION_S,
  WIPE_EASE,
} from "./menu-link.data";

export default function useMenuLink(hasIndex: boolean, isActive: boolean) {
  const wipeRef = useRef<HTMLSpanElement>(null);
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const indexText1Ref = useRef<HTMLSpanElement>(null);
  const indexText2Ref = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    const wipe = wipeRef.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    const indexText1 = indexText1Ref.current;
    const indexText2 = indexText2Ref.current;
    if (!wipe || !text1 || !text2) return;

    // No `mask` here, same reason as use-nav-link.ts: SplitText's char mask
    // clips a copy that needs to travel a full line, since the mask box is
    // sized to each character's own glyph, not the parent's line height.
    const splitConfig = { type: "chars", charsClass: "char" } as const;
    const split1 = SplitText.create(text1, splitConfig);
    const split2 = SplitText.create(text2, splitConfig);

    // Index number is only present for callers that pass `index` (e.g. the
    // footer nav) — split it alongside the label only when it's rendered, so
    // non-indexed callers (e.g. the header overlay) never touch null refs.
    const splitIndex1 =
      hasIndex && indexText1 ? SplitText.create(indexText1, splitConfig) : null;
    const splitIndex2 =
      hasIndex && indexText2 ? SplitText.create(indexText2, splitConfig) : null;

    const reduceMotion = prefersReducedMotion();
    const d = (duration: number) => (reduceMotion ? 0 : duration);
    const tl = gsap.timeline({ paused: true });

    // Layer 1: background wipe.
    tl.to(
      wipe,
      {
        scaleY: 1,
        duration: d(WIPE_DURATION_S),
        ease: WIPE_EASE,
      },
      0,
    )
      // Layer 2: exit copy flies up and fades out, one box-height (100%).
      .to(
        splitIndex1 ? [split1.chars, splitIndex1.chars] : split1.chars,
        {
          yPercent: -100,
          opacity: 0,
          duration: d(CHAR_DURATION_S),
          stagger: { amount: d(EXIT_STAGGER_AMOUNT_S) },
          ease: TEXT_EASE,
        },
        0,
      )
      // Layer 2b: enter copy, resting further than one box-height below
      // (ENTER_REST_TOP_PERCENT) to clear this tight line-height's glyph
      // overshoot — travel matches that same percentage so it lands exactly
      // in the vacated slot. No separate color tween needed: text1/text2
      // carry static idle/active colors, so swapping which copy is visible
      // is the color flip. The index number, when present, mirrors the same
      // motion so it reads as one unit with the label.
      .to(
        splitIndex2 ? [split2.chars, splitIndex2.chars] : split2.chars,
        {
          yPercent: -ENTER_TRAVEL_PERCENT,
          opacity: 1,
          duration: d(CHAR_DURATION_S),
          stagger: { amount: d(ENTER_STAGGER_AMOUNT_S) },
          ease: TEXT_EASE,
        },
        0,
      );
    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
      split1.revert();
      split2.revert();
      splitIndex1?.revert();
      splitIndex2?.revert();
    };
  }, []);

  // Active route: hold the timeline at its hover-end state instead of
  // playing/reversing into it, so the current page's link permanently shows
  // the same UI a hover would produce. `.progress()` jumps there directly
  // (no easing), so this is instant on mount and on route change alike — it
  // only re-runs when `isActive` itself flips, not on every render.
  useIsomorphicLayoutEffect(() => {
    tlRef.current?.progress(isActive ? 1 : 0);
  }, [isActive]);

  // While active, hover/focus must do nothing — the link is already showing
  // the "hovered" look permanently, so there's no state left to animate into
  // or out of.
  const onMouseEnter = () => {
    if (!isActive) tlRef.current?.play();
  };
  const onMouseLeave = () => {
    if (!isActive) tlRef.current?.reverse();
  };

  return {
    wipeRef,
    text1Ref,
    text2Ref,
    indexText1Ref,
    indexText2Ref,
    onMouseEnter,
    onMouseLeave,
  };
}
