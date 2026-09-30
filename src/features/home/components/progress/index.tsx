"use client";

import Image from "next/image";
import { PROGRESS_ITEMS } from "./progress.data";
import useProgress from "./use-progress";

export default function Progress() {
  const { trackRef, rowRef } = useProgress();

  return (
    <section className="relative overflow-clip text-black-secondary">
      {/* Track height is set in JS (use-progress.ts). The pinned box is the
          full screen on desktop and a 70%-tall box 18% from the top on
          tablet/phone; taller content just overflows it. Under reduced
          motion no height is set and the box becomes a natively scrollable
          strip, so every card stays reachable. */}
      <div ref={trackRef} className="relative">
        <div className="sticky top-0 h-dvh max-[991px]:top-[18dvh] max-[991px]:h-[70dvh] motion-reduce:static motion-reduce:h-auto! motion-reduce:overflow-x-auto motion-reduce:py-16">
          <div
            ref={rowRef}
            className="flex h-full items-center pl-(--progress-start)"
          >
            {/* items-start keeps every year on the same line even when a
                paragraph wraps to a different number of lines. */}
            <div className="flex items-start gap-x-(--progress-gap)">
              {PROGRESS_ITEMS.map((item) => (
                <article
                  key={item.year}
                  className="flex shrink-0 flex-col items-end max-[767px]:items-start"
                >
                  {/* The badge is anchored to the whole year + dash row, not
                      the digits alone. */}
                  <div className="relative mb-(--progress-year-mb) flex items-center gap-x-(--progress-year-gap)">
                    <span
                      style={{ backgroundColor: item.badgeColor }}
                      className="font-heading text-(length:--_typography---font-sizes--body--badge) absolute top-(--progress-badge-top) right-(--progress-badge-right) w-fit rotate-[-15deg] px-(--progress-badge-px) py-(--progress-badge-py) leading-[0.8] tracking-[-0.01em] text-black-secondary max-[479px]:hidden"
                    >
                      {item.badgeLabel}
                    </span>

                    <p className="font-heading text-(length:--_typography---font-sizes--heading--progress-year) leading-none tracking-[-0.03em] text-white-secondary">
                      {item.year}
                    </p>

                    <span
                      aria-hidden
                      className="h-(--progress-dash-h) w-(--progress-dash-w) shrink-0 bg-white-secondary"
                    />
                  </div>

                  <div className="w-(--progress-col)">
                    <div className="h-px w-full bg-white-secondary" />

                    <p className="mt-(--progress-text-mt) mb-(--progress-text-mb) min-h-30 text-(length:--progress-text-size) leading-(--progress-text-lh) text-white-secondary">
                      {item.description}
                    </p>

                    <div className="relative h-(--progress-img-h) w-full overflow-clip rounded-(--progress-img-radius)">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width: 991px) 300px, 480px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
