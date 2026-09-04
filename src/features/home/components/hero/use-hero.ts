import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SplitText } from "@/lib/gsap-split-text";
import { prefersReducedMotion } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import {
  DESCRIPTION_REVEAL_DURATION_S,
  DESCRIPTION_REVEAL_EASE,
  DESCRIPTION_REVEAL_STAGGER_AMOUNT_S,
  DESCRIPTION_REVEAL_START_S,
  IMAGE_REVEAL_DURATION_S,
  IMAGE_REVEAL_EASE,
  IMAGE_REVEAL_SCALE_X_FROM,
  IMAGE_REVEAL_SCALE_Y_FROM,
  IMAGE_REVEAL_START_S,
  PARALLAX_MAX_OFFSET_X_PX,
  PARALLAX_MAX_OFFSET_Y_PX,
  PARALLAX_QUICK_TO_DURATION_S,
  PARALLAX_QUICK_TO_EASE,
  PROOF_AREA_REVEAL_DURATION_S,
  PROOF_AREA_REVEAL_EASE,
  PROOF_AREA_REVEAL_Y_PX,
  SOCIAL_LINKS_REVEAL_START_S,
  STAT_REVEAL_START_S,
  SUBTITLE_REVEAL_DURATION_S,
  SUBTITLE_REVEAL_EASE,
  SUBTITLE_REVEAL_STAGGER_AMOUNT_S,
  SUBTITLE_REVEAL_START_S,
  TITLE_REVEAL_DURATION_S,
  TITLE_REVEAL_EASE,
  TITLE_REVEAL_STAGGER_AMOUNT_S,
  TITLE_REVEAL_START_S,
} from "./hero.data";

export default function useHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const image = imageRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const description = descriptionRef.current;
    const socialLinks = socialLinksRef.current;
    const stat = statRef.current;
    if (
      !section ||
      !bg ||
      !image ||
      !title ||
      !subtitle ||
      !description ||
      !socialLinks ||
      !stat
    )
      return;

    // Nothing here is CSS-pre-hidden — every "from" state below only exists
    // because GSAP's immediateRender applies it, and the cursor-follow
    // parallax is exactly the kind of interaction-triggered motion this
    // setting exists to suppress. So under reduced motion, skip creating any
    // of it: text/image/proof-area elements stay in their natural, already
    // fully-visible default state with zero extra code.
    if (prefersReducedMotion()) return;

    // Cursor-follow parallax on the foreground image only — text refs above
    // are never touched. Deferred (via the tl.call below) until the intro's
    // scale-in settles, so it never fights that tween; imageRef is safe to
    // reuse as both targets since GSAP tracks x/y and scaleX/scaleY as
    // independent transform components (proven in this codebase already by
    // custom-cursor/index.tsx, which combines quickTo-driven x/y with a
    // separate scale tween on the same element).
    let removeParallaxListeners: (() => void) | null = null;
    const startParallax = () => {
      if (window.matchMedia("(pointer: coarse)").matches) return;

      // No reduced-motion check needed here: this whole effect already
      // returned early above when prefersReducedMotion() is true, so
      // startParallax can only ever run when it's false.
      const xTo = gsap.quickTo(image, "x", {
        duration: PARALLAX_QUICK_TO_DURATION_S,
        ease: PARALLAX_QUICK_TO_EASE,
      });
      const yTo = gsap.quickTo(image, "y", {
        duration: PARALLAX_QUICK_TO_DURATION_S,
        ease: PARALLAX_QUICK_TO_EASE,
      });

      const handlePointerMove = (e: PointerEvent) => {
        const rect = section.getBoundingClientRect();
        const nx = gsap.utils.clamp(
          -1,
          1,
          (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2),
        );
        const ny = gsap.utils.clamp(
          -1,
          1,
          (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2),
        );
        xTo(nx * PARALLAX_MAX_OFFSET_X_PX);
        yTo(ny * PARALLAX_MAX_OFFSET_Y_PX);
      };
      const handlePointerLeave = () => {
        xTo(0);
        yTo(0);
      };

      section.addEventListener("pointermove", handlePointerMove);
      section.addEventListener("pointerleave", handlePointerLeave);
      removeParallaxListeners = () => {
        section.removeEventListener("pointermove", handlePointerMove);
        section.removeEventListener("pointerleave", handlePointerLeave);
      };
    };

    // type includes "words" (not just "chars"): with chars-only, each letter
    // is its own atomic inline-block with no DOM whitespace tying it to its
    // neighbors, so the browser can wrap a line between any two letters, not
    // just at real spaces (confirmed: was splitting "Digital" into "D" / "igital").
    // Word-level wrappers keep each word shrink-to-fit on one line while still
    // exposing .chars for the per-character stagger animation below.
    // charsClass names the generated mask wrapper "char-mask" (SplitText
    // suffixes "-mask" onto whatever class the char itself gets), which
    // globals.css gives overflow-clip-margin so diagonal glyphs (e.g. "A")
    // that ink slightly past their advance-width box don't get clipped.
    const splitConfig = {
      type: "chars, words",
      mask: "chars",
      charsClass: "char",
    } as const;
    const titleSplit = SplitText.create(title, splitConfig);
    const subtitleSplit = SplitText.create(subtitle, splitConfig);
    const descriptionSplit = SplitText.create(description, splitConfig);

    const tl = gsap.timeline();

    // fromTo (not from) for persistent DOM nodes: React StrictMode's dev-only
    // double-invoke (mount -> cleanup -> mount) kills the first timeline right
    // after immediateRender applies its "from" inline styles, and a plain
    // .from() on the second run would then read that leftover value as its
    // implicit "to" state, freezing the element. Explicit to-values sidestep
    // that. SplitText-driven chars below don't need this: split.revert() in
    // cleanup destroys the char DOM entirely, so there's nothing to leak.
    //
    // bg and image are tweened together (same array, same from/to/duration/
    // ease) rather than as one nested pair, because they can't share a DOM
    // subtree: image needs to paint above the text (person occludes the
    // title) while bg needs to stay below it (gradient never covers text) —
    // two different stacking positions. GSAP tweening both targets in lockstep
    // keeps them visually indistinguishable from a single scaling layer.
    tl.fromTo(
      [bg, image],
      { scaleX: IMAGE_REVEAL_SCALE_X_FROM, scaleY: IMAGE_REVEAL_SCALE_Y_FROM },
      {
        scaleX: 1,
        scaleY: 1,
        duration: IMAGE_REVEAL_DURATION_S,
        ease: IMAGE_REVEAL_EASE,
      },
      IMAGE_REVEAL_START_S,
    )
      .call(startParallax, [], IMAGE_REVEAL_START_S + IMAGE_REVEAL_DURATION_S)
      .from(
        titleSplit.chars,
        {
          yPercent: -100,
          duration: TITLE_REVEAL_DURATION_S,
          stagger: { amount: TITLE_REVEAL_STAGGER_AMOUNT_S },
          ease: TITLE_REVEAL_EASE,
        },
        TITLE_REVEAL_START_S,
      )
      .from(
        subtitleSplit.chars,
        {
          yPercent: -100,
          duration: SUBTITLE_REVEAL_DURATION_S,
          stagger: { amount: SUBTITLE_REVEAL_STAGGER_AMOUNT_S },
          ease: SUBTITLE_REVEAL_EASE,
        },
        SUBTITLE_REVEAL_START_S,
      )
      .from(
        descriptionSplit.chars,
        {
          yPercent: -100,
          duration: DESCRIPTION_REVEAL_DURATION_S,
          stagger: { amount: DESCRIPTION_REVEAL_STAGGER_AMOUNT_S },
          ease: DESCRIPTION_REVEAL_EASE,
        },
        DESCRIPTION_REVEAL_START_S,
      )
      .fromTo(
        socialLinks,
        { opacity: 0, y: PROOF_AREA_REVEAL_Y_PX },
        {
          opacity: 1,
          y: 0,
          duration: PROOF_AREA_REVEAL_DURATION_S,
          ease: PROOF_AREA_REVEAL_EASE,
        },
        SOCIAL_LINKS_REVEAL_START_S,
      )
      .fromTo(
        stat,
        { opacity: 0, y: PROOF_AREA_REVEAL_Y_PX },
        {
          opacity: 1,
          y: 0,
          duration: PROOF_AREA_REVEAL_DURATION_S,
          ease: PROOF_AREA_REVEAL_EASE,
        },
        STAT_REVEAL_START_S,
      );

    return () => {
      tl.kill();
      removeParallaxListeners?.();
      gsap.killTweensOf(image, ["x", "y"]);
      titleSplit.revert();
      subtitleSplit.revert();
      descriptionSplit.revert();
    };
  }, []);

  return {
    sectionRef,
    bgRef,
    imageRef,
    titleRef,
    subtitleRef,
    descriptionRef,
    socialLinksRef,
    statRef,
  };
}
