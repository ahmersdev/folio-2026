"use client";

import { PreloaderCircleIcon } from "@/assets/icons";
import {
  EXIT_DURATION_MS,
  EXIT_EASING,
  LOADING_LABEL,
  SLOW_LOAD_LABEL,
} from "./preloader.data";
import usePreloader from "./use-preloader";

export default function Preloader() {
  const { phase, progress, announcedProgress, isSlow } = usePreloader();

  if (phase === "hidden") return null;

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-6 bg-background"
      style={{
        clipPath:
          phase === "exiting"
            ? "circle(0% at 50% 50%)"
            : "circle(150% at 50% 50%)",
        transition: `clip-path ${EXIT_DURATION_MS}ms ${EXIT_EASING}`,
      }}
    >
      <span className="sr-only" role="status" aria-live="polite">
        {phase === "exiting"
          ? "Loading complete"
          : `Loading, ${announcedProgress}%`}
      </span>

      <div className="relative flex size-64 items-center justify-center sm:size-72">
        <div className="absolute inset-0 rounded-full border border-primary/10" />

        <div className="absolute inset-0 animate-[spin_2.4s_linear_infinite] motion-reduce:hidden">
          <span className="absolute top-0 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/70 shadow-[0_0_6px_var(--primary)]" />
        </div>

        <PreloaderCircleIcon progress={progress} className="absolute inset-0" />

        <div className="flex flex-col items-center gap-3 px-8 text-center">
          <span className="font-protest-revolution text-4xl tracking-normal sm:text-5xl [text-shadow:0_0_20px_rgba(194,36,54,0.5)]">
            Ahmer
            <span className="text-primary animate-pulse motion-reduce:animate-none">
              .
            </span>
          </span>

          <div className="flex flex-col items-center gap-1 font-cinzel-decorative text-xs tracking-[0.3em] text-muted-foreground font-bold uppercase">
            <span>{isSlow ? SLOW_LOAD_LABEL : LOADING_LABEL}</span>
            <span className="text-foreground tabular-nums font-semibold text-xl">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
