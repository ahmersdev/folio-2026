import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";
import {
  COARSE_POINTER_QUERY,
  HOVER_DURATION_S,
  HOVER_EASE,
  HOVER_SCALE,
  HOVER_TARGET_SELECTOR,
  MOVE_DURATION_S,
  MOVE_EASE,
} from "./custom-cursor.data";

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

export default function useCustomCursor() {
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
      duration: reduceMotion ? 0 : MOVE_DURATION_S,
      ease: MOVE_EASE,
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: reduceMotion ? 0 : MOVE_DURATION_S,
      ease: MOVE_EASE,
    });

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const isHoverTarget = (target: EventTarget | null) =>
      target instanceof Element &&
      target.closest(HOVER_TARGET_SELECTOR) !== null;

    const over = (e: MouseEvent) => {
      if (isHoverTarget(e.target)) {
        gsap.to(el, {
          scale: HOVER_SCALE,
          duration: reduceMotion ? 0 : HOVER_DURATION_S,
          ease: HOVER_EASE,
        });
      }
    };
    const out = (e: MouseEvent) => {
      if (isHoverTarget(e.target)) {
        gsap.to(el, {
          scale: 1,
          duration: reduceMotion ? 0 : HOVER_DURATION_S,
          ease: HOVER_EASE,
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

  return { cursorRef, isCoarse };
}
