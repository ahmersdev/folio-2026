"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { RevealHeading, SharinganSequence } from "./components";
import { SECTION_HEIGHT_DVH } from "./sharingan-reveal.data";
import useSharinganReveal from "./use-sharingan-reveal";

// Canvas 2D + new Image() are browser-only APIs, same reason hero-banner's
// R3F pieces are dynamically imported with ssr: false.
const DynamicSharinganSequence = dynamic(
  () => Promise.resolve(SharinganSequence),
  { ssr: false },
);

export default function SharinganReveal() {
  const { containerRef, progress, isScrubbed, shouldPreload } =
    useSharinganReveal();

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={isScrubbed ? { height: `${SECTION_HEIGHT_DVH}dvh` } : undefined}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden",
          // Scrubbed (desktop and mobile alike — reduced-motion is the
          // only thing that skips the pin now): pinned, fills the viewport
          // edge-to-edge. h-dvh (not h-screen/100vh) so mobile browser
          // chrome showing/hiding mid-scroll doesn't desync the sticky math.
          isScrubbed ? "sticky top-0 h-dvh" : "aspect-video",
        )}
      >
        <DynamicSharinganSequence
          progress={progress}
          shouldPreload={shouldPreload}
        />

        {/* Scrim: keeps the heading legible over bright frame content
            without needing a bounded panel around the footage. */}
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-background via-background/35 to-transparent"
          aria-hidden="true"
        />

        {/* Percentage-based, not vh-based, so it holds its position
            relative to this box whether that box is a full h-dvh pin or
            the much shorter aspect-video block. */}
        <div className="absolute inset-x-0 bottom-[8%] flex justify-center px-6">
          <RevealHeading progress={progress} />
        </div>
      </div>
    </section>
  );
}
