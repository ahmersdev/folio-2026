import { useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/lib";
import {
  STEPS_REVEAL_SCROLL_START,
  STEPS_SUBTITLE_REVEAL_DURATION_S,
  STEPS_SUBTITLE_REVEAL_EASE,
  STEPS_SUBTITLE_REVEAL_STAGGER_AMOUNT_S,
  STEPS_SUBTITLE_REVEAL_START_S,
  STEPS_TITLE_REVEAL_DURATION_S,
  STEPS_TITLE_REVEAL_EASE,
  STEPS_TITLE_REVEAL_STAGGER_AMOUNT_S,
} from "./steps.data";

export default function useSteps() {
  const headerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    const header = headerRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    if (!header || !title || !subtitle) return;

    // Nothing is CSS-pre-hidden — the "from" state only exists because GSAP
    // applies it — so under reduced motion skipping the tween leaves the text
    // fully visible with no extra code.
    if (prefersReducedMotion()) return;

    // Word-level wrappers keep each word on one line while .chars drives the
    // per-character stagger; charsClass names the mask "char-mask", which
    // globals.css pads so diagonal glyphs aren't clipped (same as the hero).
    const splitConfig = {
      type: "chars, words",
      mask: "chars",
      charsClass: "char",
    } as const;
    const titleSplit = SplitText.create(title, splitConfig);
    const subtitleSplit = SplitText.create(subtitle, splitConfig);

    // Plays once when the header's top reaches the trigger line and never
    // replays (once: true). Cleanup reverts the splits, so nothing leaks
    // across StrictMode's double-invoke.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: STEPS_REVEAL_SCROLL_START,
        once: true,
      },
    });

    tl.from(titleSplit.chars, {
      yPercent: -100,
      duration: STEPS_TITLE_REVEAL_DURATION_S,
      stagger: { amount: STEPS_TITLE_REVEAL_STAGGER_AMOUNT_S },
      ease: STEPS_TITLE_REVEAL_EASE,
    }).from(
      subtitleSplit.chars,
      {
        yPercent: -100,
        duration: STEPS_SUBTITLE_REVEAL_DURATION_S,
        stagger: { amount: STEPS_SUBTITLE_REVEAL_STAGGER_AMOUNT_S },
        ease: STEPS_SUBTITLE_REVEAL_EASE,
      },
      STEPS_SUBTITLE_REVEAL_START_S,
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      titleSplit.revert();
      subtitleSplit.revert();
    };
  }, []);

  return { headerRef, titleRef, subtitleRef };
}
