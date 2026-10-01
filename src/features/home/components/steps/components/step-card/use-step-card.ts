import { useId, useRef, useState } from "react";
import {
  gsap,
  prefersReducedMotion,
  ScrollTrigger,
  useIsomorphicLayoutEffect,
} from "@/lib";
import {
  STEP_BUTTON_HOVER_DURATION_S,
  STEP_BUTTON_HOVER_EASE,
  STEP_BUTTON_HOVER_SCALE,
  STEP_TOGGLE_DURATION_S,
  STEP_TOGGLE_EASE,
  STEP_TOGGLE_REDUCED_DURATION_S,
  STEPS_DESKTOP_QUERY,
} from "../../steps.data";

export default function useStepCard() {
  const descriptionId = useId();
  const descriptionRef = useRef<HTMLDivElement>(null);
  const plainTitleRef = useRef<HTMLHeadingElement>(null);
  const gradientTitleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const description = descriptionRef.current;
    const plainTitle = plainTitleRef.current;
    const gradientTitle = gradientTitleRef.current;
    const button = buttonRef.current;
    const chevron = chevronRef.current;
    if (!description || !plainTitle || !gradientTitle || !button || !chevron)
      return;

    // The toggle only exists at desktop width. matchMedia builds the timeline
    // there and, on leaving it (resize below the breakpoint, or unmount),
    // reverts it — which clears every inline style GSAP set, so the CSS
    // (closed at desktop, everything visible below) is back in charge.
    const mm = gsap.matchMedia();

    mm.add(STEPS_DESKTOP_QUERY, () => {
      // Under reduced motion the toggle still works, it just lands instantly.
      const reduceMotion = prefersReducedMotion();

      // Opening/closing changes page height, so triggers measured against the
      // old layout (Progress above pins; sections below are yet to come)
      // need re-measuring once it settles.
      const refresh = () => ScrollTrigger.refresh();

      const tl = gsap.timeline({
        paused: true,
        defaults: {
          duration: reduceMotion
            ? STEP_TOGGLE_REDUCED_DURATION_S
            : STEP_TOGGLE_DURATION_S,
          ease: STEP_TOGGLE_EASE,
        },
        onComplete: refresh,
        onReverseComplete: refresh,
      });

      // fromTo for the height (not from): its closed state is also set by CSS,
      // and an explicit pair keeps StrictMode's double-invoke from reading a
      // leftover inline value as the implicit end. visibility flips with the
      // height so a closed description is out of the accessibility tree and
      // the tab order, but stays visible while it collapses.
      tl.fromTo(
        description,
        { height: 0, visibility: "hidden" },
        { height: "auto", visibility: "visible" },
        0,
      )
        .to([plainTitle, gradientTitle], { yPercent: -100 }, 0)
        .to(chevron, { rotation: 180 }, 0);

      timelineRef.current = tl;

      const hoverTo = (scale: number) =>
        gsap.to(button, {
          scale,
          duration: reduceMotion ? 0 : STEP_BUTTON_HOVER_DURATION_S,
          ease: STEP_BUTTON_HOVER_EASE,
          overwrite: "auto",
        });
      const onEnter = () => hoverTo(STEP_BUTTON_HOVER_SCALE);
      const onLeave = () => hoverTo(1);
      button.addEventListener("pointerenter", onEnter);
      button.addEventListener("pointerleave", onLeave);

      return () => {
        button.removeEventListener("pointerenter", onEnter);
        button.removeEventListener("pointerleave", onLeave);
        tl.kill();
        timelineRef.current = null;
        // Back to closed so aria-expanded matches the reverted CSS state.
        setIsOpen(false);
      };
    });

    return () => mm.revert();
  }, []);

  const toggle = () => {
    const tl = timelineRef.current;
    if (!tl) return;
    if (isOpen) tl.reverse();
    else tl.play();
    setIsOpen(!isOpen);
  };

  return {
    descriptionId,
    descriptionRef,
    plainTitleRef,
    gradientTitleRef,
    buttonRef,
    chevronRef,
    isOpen,
    toggle,
  };
}
