"use client";

import { CSSProperties } from "react";
import { WorkCard } from "./components";
import {
  WORKS_BADGE,
  WORKS_PERSPECTIVE_PX,
  WORKS_PIN_TOP,
  WORKS_TITLE,
  WORKS_TRACK_HEIGHT_VH,
} from "./featured-works.data";
import useFeaturedWorks from "./use-featured-works";
import { FEATURED_WORKS } from "@/data/works";

export default function FeaturedWorks() {
  const { headerRef, titleRef, badgeRef, trackRef, stackRef } =
    useFeaturedWorks();

  return (
    <section className="overflow-clip px-[5%] py-16 text-white-secondary min-[480px]:py-20 min-[768px]:py-25 min-[992px]:py-37.5">
      <div className="mx-auto w-full max-w-420">
        <header
          ref={headerRef}
          className="relative mb-8 text-center min-[480px]:mb-11 min-[768px]:mb-13 min-[992px]:mb-20"
        >
          <h2
            ref={titleRef}
            className="text-(length:--_typography---font-sizes--heading--h2) leading-none font-normal tracking-[-0.03em] uppercase"
          >
            {WORKS_TITLE}
          </h2>
          {/* Sticker: top/right offsets and padding follow the reference's
              breakpoints; hidden at 479px and below. */}
          <p
            ref={badgeRef}
            className="absolute top-4.75 text-black-secondary right-52.5 hidden -rotate-15 bg-lime px-5 py-3 font-heading text-[clamp(1.5rem,1.2573rem+1.0356vw,2.5rem)] leading-[0.8] tracking-[-0.01em] min-[480px]:block min-[768px]:top-6 min-[992px]:top-11.5 min-[992px]:right-51.75 min-[992px]:px-9 min-[992px]:py-5 min-[1920px]:top-20.5 min-[1920px]:right-69.25"
          >
            {WORKS_BADGE}
          </p>
        </header>

        {/* From 768px (motion allowed) the track is tall and the stack inside it
            sticks near the top, with a CSS perspective for the peeling cards;
            below that, or under reduced motion, both collapse to plain flow.
            The geometry comes from data so it's tuned in one place; Tailwind
            can't take it from a variable at build time. */}
        <div
          ref={trackRef}
          className="motion-safe:min-[768px]:h-(--works-track-h)"
          style={
            {
              "--works-track-h": `${WORKS_TRACK_HEIGHT_VH}vh`,
              "--works-pin-top": WORKS_PIN_TOP,
              "--works-perspective": `${WORKS_PERSPECTIVE_PX}px`,
            } as CSSProperties
          }
        >
          <div
            ref={stackRef}
            className="relative flex flex-col items-center gap-5 motion-safe:min-[768px]:sticky motion-safe:min-[768px]:top-(--works-pin-top) motion-safe:min-[768px]:gap-0 motion-safe:min-[768px]:perspective-(--works-perspective)"
          >
            {FEATURED_WORKS.map((work, index) => (
              <WorkCard
                key={work.title}
                work={work}
                index={index}
                total={FEATURED_WORKS.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
