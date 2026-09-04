"use client";

import { BRAND_TEXT } from "@/constants";
import { cn } from "@/lib/utils";
import { BORDER_LINE_GAP_PX, BORDER_LINE_HEIGHTS_PX } from "./preloader.data";
import usePreloader from "./use-preloader";

export default function Preloader() {
  const { containerRef, textRef, phase } = usePreloader();

  if (phase === "hidden") return null;

  return (
    <div
      ref={containerRef}
      aria-hidden={phase === "exiting"}
      className={cn(
        "fixed inset-0 z-100 flex items-center justify-center bg-black-secondary",
        phase === "exiting" && "pointer-events-none",
      )}
    >
      <span
        ref={textRef}
        className="relative z-10 opacity-0 font-heading text-white whitespace-nowrap text-(length:--_typography---font-sizes--heading--h5)"
      >
        {BRAND_TEXT}
      </span>

      <div
        className="absolute inset-x-0 top-full flex flex-col"
        style={{ gap: BORDER_LINE_GAP_PX }}
      >
        {BORDER_LINE_HEIGHTS_PX.map((height, i) => (
          <div key={i} className="bg-black-secondary" style={{ height }} />
        ))}
      </div>
    </div>
  );
}
