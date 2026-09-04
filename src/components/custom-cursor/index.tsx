"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const COARSE_POINTER_QUERY = "(pointer: coarse)";

function subscribeToCoarsePointer(onChange: () => void) {
  const mql = window.matchMedia(COARSE_POINTER_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getIsCoarsePointer() {
  return window.matchMedia(COARSE_POINTER_QUERY).matches;
}

// SSR has no pointer to query — assume coarse (no cursor rendered) until the
// client subscribes to the real value, avoiding a hydration mismatch.
function getServerIsCoarsePointer() {
  return true;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isCoarse = useSyncExternalStore(
    subscribeToCoarsePointer,
    getIsCoarsePointer,
    getServerIsCoarsePointer,
  );

  useEffect(() => {
    if (isCoarse || !cursorRef.current) return;

    const reduceMotion = prefersReducedMotion();
    const el = cursorRef.current;

    document.documentElement.classList.add("has-custom-cursor");

    const xTo = gsap.quickTo(el, "x", {
      duration: reduceMotion ? 0 : 0.25,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: reduceMotion ? 0 : 0.25,
      ease: "power3.out",
    });

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const isHoverTarget = (target: EventTarget | null) =>
      target instanceof Element &&
      target.closest("a, button, [data-cursor-hover]") !== null;

    const over = (e: MouseEvent) => {
      if (isHoverTarget(e.target)) {
        gsap.to(el, {
          scale: 1.8,
          duration: reduceMotion ? 0 : 0.25,
          ease: "power2.out",
        });
      }
    };
    const out = (e: MouseEvent) => {
      if (isHoverTarget(e.target)) {
        gsap.to(el, {
          scale: 1,
          duration: reduceMotion ? 0 : 0.25,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [isCoarse]);

  if (isCoarse) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="cursor-dot pointer-events-none fixed left-0 top-0 z-9999 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
    />
  );
}
