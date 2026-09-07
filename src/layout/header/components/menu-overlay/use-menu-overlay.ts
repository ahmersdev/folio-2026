import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib";
import { PANEL_DURATION_S, PANEL_EASE } from "./menu-overlay.data";
import {
  IUseMenuOverlayReturn,
  TMenuOverlayPhase,
} from "./menu-overlay.interface";

export default function useMenuOverlay(): IUseMenuOverlayReturn {
  const panelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<TMenuOverlayPhase>("closed");

  useIsomorphicLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // The `hidden` attribute in menu-overlay/index.tsx (not this call) is
    // what prevents the first-paint flash — see its comment. This just
    // establishes the panel's actual off-screen position for once it
    // becomes visible. The panel stays mounted at all times (unlike
    // Preloader, which unmounts once done) so this timeline keeps a stable
    // target across repeated opens/closes.
    gsap.set(panel, { yPercent: -100 });

    const reduceMotion = prefersReducedMotion();

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => setPhase("open"),
      onReverseComplete: () => setPhase("closed"),
    });
    tl.to(panel, {
      yPercent: 0,
      duration: reduceMotion ? 0 : PANEL_DURATION_S,
      ease: PANEL_EASE,
    });
    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, []);

  const open = () => {
    if (phase !== "closed") return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    setPhase("opening");
    tlRef.current?.play(0);
  };

  const close = () => {
    if (phase !== "open") return;
    setPhase("closing");
    tlRef.current?.reverse();
  };

  const toggle = () => {
    if (phase === "closed") open();
    else if (phase === "open") close();
    // "opening"/"closing": ignored — no mid-transition interrupt, matching
    // the rest of this codebase's paused/play/reverse timelines.
  };

  // Escape-to-close + a minimal Tab focus trap, active only while the panel
  // is meaningfully visible.
  useEffect(() => {
    if (phase !== "opening" && phase !== "open") return;
    const panel = panelRef.current;

    const closeButton = panel?.querySelector<HTMLElement>("[data-menu-close]");
    closeButton?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusables = panel.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Restore focus to whatever was focused before open() (normally the
  // hamburger button) once the close animation has fully finished.
  useEffect(() => {
    if (phase === "closed") previouslyFocusedRef.current?.focus();
  }, [phase]);

  // Scroll lock — verbatim idiom from preloader/use-preloader.ts.
  useEffect(() => {
    if (phase === "closed") return;
    document.documentElement.classList.add("overflow-hidden");
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [phase]);

  return { phase, panelRef, open, close, toggle };
}
