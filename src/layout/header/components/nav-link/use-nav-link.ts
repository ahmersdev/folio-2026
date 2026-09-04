import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SplitText } from "@/lib/gsap-split-text";
import { prefersReducedMotion } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import {
  CHAR_DURATION_S,
  EASE,
  ENTER_STAGGER_AMOUNT_S,
  EXIT_STAGGER_AMOUNT_S,
  LINE_HEIGHT_PX,
} from "./nav-link.data";

export default function useNavLink() {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    const text1 = text1Ref.current;
    const text2 = text2Ref.current;
    if (!text1 || !text2) return;

    // No `mask` here (unlike the preloader/hero splits): SplitText's char
    // mask gives each letter its own tiny clip box that does NOT travel
    // with it. That's correct for a reveal where a letter only ever moves
    // within its own spot, but wrong here — text2's letters need to travel
    // a full line into an entirely different row, and a per-letter mask
    // left behind clips them out the moment they leave their original box,
    // even though they're inside our own word-level `overflow-clip`
    // wrapper (confirmed live: with the char mask, text2 never reappears;
    // without it, the swap renders correctly). type:"chars" alone still
    // gives us the individual .char spans the stagger tween needs.
    const splitConfig = {
      type: "chars",
      charsClass: "char",
    } as const;
    const split1 = SplitText.create(text1, splitConfig);
    const split2 = SplitText.create(text2, splitConfig);

    const reduceMotion = prefersReducedMotion();

    // Paused, not autoplaying: play() on hover-in. Both copies move at once
    // (same position, 0), matching the reference — the outgoing copy (text1)
    // flies up out of the mask while the incoming copy (text2), already
    // sitting one line below in normal flow, flies up into it, each letter
    // staggered independently rather than the whole word moving as one block.
    //
    // On the reference, hover-out has no visible reverse animation — the
    // swapped text just holds until the mouse leaves, at which point it
    // resets instantly (not an animated tween back down) so the next hover
    // plays cleanly from the start again.
    const tl = gsap.timeline({ paused: true });
    tl.to(
      split1.chars,
      {
        y: -LINE_HEIGHT_PX,
        duration: reduceMotion ? 0 : CHAR_DURATION_S,
        stagger: { amount: reduceMotion ? 0 : EXIT_STAGGER_AMOUNT_S },
        ease: EASE,
      },
      0,
    ).to(
      split2.chars,
      {
        y: -LINE_HEIGHT_PX,
        duration: reduceMotion ? 0 : CHAR_DURATION_S,
        stagger: { amount: reduceMotion ? 0 : ENTER_STAGGER_AMOUNT_S },
        ease: EASE,
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

  const onMouseEnter = () => tlRef.current?.play(0);
  const onMouseLeave = () => tlRef.current?.pause(0);

  return { text1Ref, text2Ref, onMouseEnter, onMouseLeave };
}
