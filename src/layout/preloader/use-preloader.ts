import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { SplitText } from "@/lib/gsap-split-text";
import { prefersReducedMotion } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import {
  COVER_EXIT_DURATION_S,
  COVER_EXIT_EASE,
  COVER_EXIT_Y_PERCENT,
  HOLD_DURATION_S,
  TEXT_REVEAL_DELAY_S,
  TEXT_REVEAL_DURATION_S,
  TEXT_REVEAL_EASE,
  TEXT_REVEAL_STAGGER_S,
} from "./preloader.data";
import { TPreloaderPhase } from "./preloader.interface";

export default function usePreloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<TPreloaderPhase>("loading");

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    // charsClass names the generated mask wrapper "char-mask" so globals.css
    // can give it overflow-clip-margin — otherwise diagonal glyphs (e.g. "A")
    // that ink slightly past their advance-width box get visibly clipped.
    const split = SplitText.create(text, {
      type: "chars",
      mask: "chars",
      charsClass: "char",
    });

    // Text starts at opacity-0 in the static markup (see preloader/index.tsx)
    // so the server-rendered, unsplit text is never shown. Flip it back to
    // visible here, in the same synchronous pre-paint pass that positions
    // the freshly-split chars at their hidden "from" state below — so by
    // the time the browser paints, what's visible is the masked chars ready
    // to animate in, never a flash of the raw, un-split string.
    gsap.set(text, { opacity: 1 });

    // The preloader must still run under reduced motion — it's what unhides
    // the SSR-hidden text and drives the phase transitions that unlock page
    // scroll below. Zeroing every duration/stagger keeps those essential
    // state changes exactly where they are, just without the animated motion.
    const reduceMotion = prefersReducedMotion();

    const tl = gsap.timeline({
      onComplete: () => setPhase("hidden"),
    });

    tl.from(split.chars, {
      yPercent: -100,
      duration: reduceMotion ? 0 : TEXT_REVEAL_DURATION_S,
      stagger: reduceMotion ? 0 : TEXT_REVEAL_STAGGER_S,
      ease: TEXT_REVEAL_EASE,
      delay: reduceMotion ? 0 : TEXT_REVEAL_DELAY_S,
    })
      // Whole cover — text included, since it's a child of this element —
      // rides out as one solid block. Text has no exit animation of its own.
      .to(
        container,
        {
          yPercent: COVER_EXIT_Y_PERCENT,
          duration: reduceMotion ? 0 : COVER_EXIT_DURATION_S,
          ease: COVER_EXIT_EASE,
          onStart: () => setPhase("exiting"),
        },
        `+=${reduceMotion ? 0 : HOLD_DURATION_S}`,
      );

    return () => {
      tl.kill();
      split.revert();
    };
  }, []);

  useEffect(() => {
    if (phase === "hidden") return;

    document.documentElement.classList.add("overflow-hidden");
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [phase]);

  return { containerRef, textRef, phase };
}
