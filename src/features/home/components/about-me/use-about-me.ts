import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import "@/lib/gsap-scroll-trigger";
import { SplitText } from "@/lib/gsap-split-text";
import { prefersReducedMotion } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import {
  TITLE_REVEAL_OPACITY_FROM,
  TITLE_REVEAL_SCROLL_END,
  TITLE_REVEAL_SCROLL_START,
  TITLE_REVEAL_SCRUB,
  TITLE_REVEAL_STAGGER_EACH_S,
} from "./about-me.data";

export default function useAboutMe() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const split = SplitText.create(title, {
      type: "words",
      wordsClass: "word",
    });

    // Scroll-scrubbed opacity has no "duration" to zero out under reduced
    // motion — the tween's progress *is* the scroll position. So instead of
    // building the scrollTrigger-driven tween at all, just set the words to
    // their settled, fully-visible state immediately.
    if (prefersReducedMotion()) {
      gsap.set(split.words, { opacity: 1 });
      return () => {
        split.revert();
      };
    }

    // fromTo (not from): a scrubbed tween driven by ScrollTrigger has no
    // independent play/replay of its own for StrictMode's double-invoke to
    // race against, but fromTo still keeps both the "from" and "to" state
    // explicit rather than relying on the split words' own current opacity.
    const tween = gsap.fromTo(
      split.words,
      { opacity: TITLE_REVEAL_OPACITY_FROM },
      {
        opacity: 1,
        ease: "none",
        stagger: { each: TITLE_REVEAL_STAGGER_EACH_S },
        scrollTrigger: {
          trigger: title,
          start: TITLE_REVEAL_SCROLL_START,
          end: TITLE_REVEAL_SCROLL_END,
          scrub: TITLE_REVEAL_SCRUB,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, []);

  return { titleRef };
}
