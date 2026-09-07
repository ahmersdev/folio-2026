import { useRef } from "react";
import {
  CHAR_DURATION_S,
  CHAR_EASE,
  DASH_AND_TEXT_HOVER_COLOR,
  DASH_SCALE_DURATION_S,
  DASH_SCALE_EASE,
  DASH_SCALE_X,
  FILL_COLOR,
  FILL_DURATION_S,
  FILL_EASE,
  NOTCH_SHRINK_DURATION_S,
  NOTCH_SHRINK_EASE,
  NOTCH_TRANSLATE_X_PX,
  STAGGER_AMOUNT_S,
  TEXT_COLOR_DURATION_S,
  TEXT_COLOR_EASE,
} from "./custom-button.data";
import {
  gsap,
  prefersReducedMotion,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/lib";

export default function useCustomButton() {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const dashRef = useRef<HTMLSpanElement>(null);
  const notch1Ref = useRef<HTMLSpanElement>(null);
  const notch2Ref = useRef<HTMLSpanElement>(null);
  const notch3Ref = useRef<HTMLSpanElement>(null);
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const dash = dashRef.current;
    const notch1 = notch1Ref.current;
    const notch2 = notch2Ref.current;
    const notch3 = notch3Ref.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    if (
      !container ||
      !dash ||
      !notch1 ||
      !notch2 ||
      !notch3 ||
      !text1 ||
      !text2
    )
      return;

    // Measured, not a fixed constant: the label's font size changes across
    // breakpoints, so a hardcoded offset would undershoot at larger sizes
    // and leave text1 visible at the top of the mask post-roll.
    const lineHeightPx = text1.getBoundingClientRect().height;

    const splitConfig = { type: "chars", charsClass: "char" } as const;
    const split1 = SplitText.create(text1, splitConfig);
    const split2 = SplitText.create(text2, splitConfig);

    const reduceMotion = prefersReducedMotion();
    const d = (duration: number) => (reduceMotion ? 0 : duration);

    // Paused; play()/reverse() on hover. Unlike nav-link's isolated text
    // swap (which resets instantly on leave), this button coordinates
    // several properties at once — fill, dash color+scale, text color,
    // text roll — so hover-out plays the same timeline in reverse rather
    // than snapping only the text back while the fill is still animating,
    // which would desync the parts mid-transition.
    const tl = gsap.timeline({ paused: true });
    tl.to(
      container,
      {
        backgroundColor: FILL_COLOR,
        duration: d(FILL_DURATION_S),
        ease: FILL_EASE,
      },
      0,
    )
      .to(
        dash,
        {
          backgroundColor: DASH_AND_TEXT_HOVER_COLOR,
          duration: d(FILL_DURATION_S),
          ease: FILL_EASE,
        },
        0,
      )
      .to(
        dash,
        {
          scaleX: DASH_SCALE_X,
          duration: d(DASH_SCALE_DURATION_S),
          ease: DASH_SCALE_EASE,
        },
        0,
      )
      .to(
        [text1, text2],
        {
          color: DASH_AND_TEXT_HOVER_COLOR,
          duration: d(TEXT_COLOR_DURATION_S),
          ease: TEXT_COLOR_EASE,
        },
        0,
      )
      .to(
        [...split1.chars, ...split2.chars],
        {
          y: -lineHeightPx,
          duration: d(CHAR_DURATION_S),
          stagger: { amount: d(STAGGER_AMOUNT_S) },
          ease: CHAR_EASE,
        },
        0,
      )
      // notch1 sits top-left (by the dash) and slides further left as it
      // shrinks; notch2/notch3 sit bottom-right and slide right — both
      // read as "shrinking away toward the nearest edge" rather than
      // shrinking in place, matching the reference.
      .to(
        notch1,
        {
          width: 0,
          x: -NOTCH_TRANSLATE_X_PX,
          duration: d(NOTCH_SHRINK_DURATION_S),
          ease: NOTCH_SHRINK_EASE,
        },
        0,
      )
      .to(
        [notch2, notch3],
        {
          width: 0,
          x: NOTCH_TRANSLATE_X_PX,
          duration: d(NOTCH_SHRINK_DURATION_S),
          ease: NOTCH_SHRINK_EASE,
        },
        0,
      );
    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
      split1.revert();
      split2.revert();
    };
  }, []);

  const onMouseEnter = () => tlRef.current?.play();
  const onMouseLeave = () => tlRef.current?.reverse();

  return {
    containerRef,
    dashRef,
    notch1Ref,
    notch2Ref,
    notch3Ref,
    text1Ref,
    text2Ref,
    onMouseEnter,
    onMouseLeave,
  };
}
