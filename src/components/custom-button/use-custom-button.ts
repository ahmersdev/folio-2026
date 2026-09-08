import { useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/lib";
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
  HOVER_SCALE,
  HOVER_SCALE_DURATION_S,
  HOVER_SCALE_EASE,
  ICON_ROLL_DURATION_S,
  ICON_ROLL_EASE,
  NOTCH_SHRINK_DURATION_S,
  NOTCH_SHRINK_EASE,
  NOTCH_TRANSLATE_X_PX,
  STAGGER_AMOUNT_S,
  TEXT_COLOR_DURATION_S,
  TEXT_COLOR_EASE,
} from "./custom-button.data";

interface IUseCustomButtonOptions {
  // filled buttons skip the fill/dash-color/text-color block entirely (see
  // ICustomButton's `filled` doc); hasIcon gates whether the dash ref is
  // required (dash is only rendered when there's no icon) and whether the
  // icon-roll segment is built; isLg gates the whole-button hover shrink
  // (size="lg" only — see ICustomButton.size doc).
  filled: boolean;
  hasIcon: boolean;
  isLg: boolean;
}

export default function useCustomButton(options: IUseCustomButtonOptions) {
  const { filled, hasIcon, isLg } = options;

  const containerRef = useRef<HTMLAnchorElement>(null);
  const dashRef = useRef<HTMLSpanElement>(null);
  const notch1Ref = useRef<HTMLSpanElement>(null);
  const notch2Ref = useRef<HTMLSpanElement>(null);
  const notch3Ref = useRef<HTMLSpanElement>(null);
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const iconRowRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const dash = dashRef.current;
    const notch1 = notch1Ref.current;
    const notch2 = notch2Ref.current;
    const notch3 = notch3Ref.current;
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    const iconRow = iconRowRef.current;
    if (!container || !notch1 || !notch2 || !notch3 || !text1 || !text2) return;
    // dash only exists in the markup when there's no icon (see index.tsx) —
    // required whenever the fill/dash-color choreography below will run.
    if (!filled && !dash) return;
    if (hasIcon && !iconRow) return;

    // Measured, not a fixed constant: the label's font size (and, for the
    // icon badge, its own size) changes across breakpoints/size variants,
    // so a hardcoded offset would undershoot at other sizes.
    const lineHeightPx = text1.getBoundingClientRect().height;

    const splitConfig = { type: "chars", charsClass: "char" } as const;
    const split1 = SplitText.create(text1, splitConfig);
    const split2 = SplitText.create(text2, splitConfig);

    const reduceMotion = prefersReducedMotion();
    const d = (duration: number) => (reduceMotion ? 0 : duration);

    // Paused; play()/reverse() on hover. Unlike nav-link's isolated text
    // swap (which resets instantly on leave), this button coordinates
    // several properties at once — so hover-out plays the same timeline in
    // reverse rather than snapping only one part back while another is
    // still animating, which would desync them mid-transition.
    const tl = gsap.timeline({ paused: true });

    // Whole-button hover shrink — size="lg" only (e.g. the 404 marquee
    // CTA), matching the reference's own big filled button. Not applied to
    // the default size, which wasn't observed to do this.
    if (isLg) {
      tl.to(
        container,
        {
          scale: HOVER_SCALE,
          duration: d(HOVER_SCALE_DURATION_S),
          ease: HOVER_SCALE_EASE,
        },
        0,
      );
    }

    // Filled buttons (see ICustomButton.filled) are already in their final
    // colour at rest — the reference for that variant has no hover
    // background/colour change at all, so this whole block only applies to
    // the default transparent-until-hover-fills-black button.
    if (!filled) {
      tl.to(
        container,
        {
          backgroundColor: FILL_COLOR,
          duration: d(FILL_DURATION_S),
          ease: FILL_EASE,
        },
        0,
      );
      if (dash) {
        tl.to(
          dash,
          {
            backgroundColor: DASH_AND_TEXT_HOVER_COLOR,
            duration: d(FILL_DURATION_S),
            ease: FILL_EASE,
          },
          0,
        ).to(
          dash,
          {
            scaleX: DASH_SCALE_X,
            duration: d(DASH_SCALE_DURATION_S),
            ease: DASH_SCALE_EASE,
          },
          0,
        );
      }
      tl.to(
        [text1, text2],
        {
          color: DASH_AND_TEXT_HOVER_COLOR,
          duration: d(TEXT_COLOR_DURATION_S),
          ease: TEXT_COLOR_EASE,
        },
        0,
      );
    }

    tl.to(
      [...split1.chars, ...split2.chars],
      {
        y: -lineHeightPx,
        duration: d(CHAR_DURATION_S),
        stagger: { amount: d(STAGGER_AMOUNT_S) },
        ease: CHAR_EASE,
      },
      0,
    )
      // notch1 sits top-left (by the dash, or the text start when there's
      // no dash) and slides further left as it shrinks; notch2/notch3 sit
      // bottom-right and slide right — both read as "shrinking away toward
      // the nearest edge" rather than shrinking in place, matching the
      // reference.
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

    if (hasIcon && iconRow) {
      // iconRow holds two equal-width icon slots side by side (see
      // index.tsx) but has no width of its own — as a normal in-flow flex
      // box it stretches to fill its parent (the badge), so
      // getBoundingClientRect() would report the badge's width, not the
      // row's true (overflowing) content width. scrollWidth measures the
      // real content extent regardless of the box's own computed width —
      // same reasoning already applied to the ticker rows in
      // use-cta-marquee.ts — so half of it is exactly one slot's width.
      const iconSlotWidthPx = iconRow.scrollWidth / 2;
      tl.to(
        iconRow,
        {
          x: -iconSlotWidthPx,
          duration: d(ICON_ROLL_DURATION_S),
          ease: ICON_ROLL_EASE,
        },
        0,
      );
    }

    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
      split1.revert();
      split2.revert();
    };
  }, [filled, hasIcon, isLg]);

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
    iconRowRef,
    onMouseEnter,
    onMouseLeave,
  };
}
