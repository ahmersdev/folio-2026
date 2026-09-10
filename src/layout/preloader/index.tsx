"use client";

import { usePathname } from "next/navigation";
import { DecorativeLines } from "@/components";
import { BRAND_TEXT } from "@/constants";
import { cn } from "@/lib";
import { BORDER_LINE_GAP_PX, BORDER_LINE_HEIGHTS_PX } from "./preloader.data";
import usePreloader from "./use-preloader";
import { ROUTES } from "@/constants/routes";

export default function Preloader() {
  const pathname = usePathname();

  // usePreloader drives side effects (locking scroll, inerting the page)
  // for as long as it's mounted, so it must not mount at all outside the
  // home page rather than just being hidden from render.
  if (pathname !== ROUTES.HOME) return null;

  return <PreloaderCover />;
}

function PreloaderCover() {
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

      <DecorativeLines
        heights={BORDER_LINE_HEIGHTS_PX}
        gap={BORDER_LINE_GAP_PX}
        className="absolute inset-x-0 top-full"
      />
    </div>
  );
}
