"use client";

import Image from "next/image";
import { PROGRESS_ITEMS } from "./progress.data";
import useProgress from "./use-progress";

export default function Progress() {
  const { trackRef, rowRef } = useProgress();

  return (
    <section className="relative overflow-clip text-white-secondary">
      {/* Track height is set in JS (use-progress.ts). The pinned box is the
          full screen on desktop and a 70%-tall box 18% from the top on
          tablet/phone; taller content just overflows it. Under reduced
          motion no height is set and the box becomes a natively scrollable
          strip, so every card stays reachable. */}
      <div ref={trackRef} className="relative">
        <div className="sticky top-0 h-dvh max-lg:top-[18dvh] max-lg:h-[70dvh] motion-reduce:static motion-reduce:h-auto! motion-reduce:overflow-x-auto motion-reduce:py-16">
          <div
            ref={rowRef}
            className="flex h-full items-center pl-34.25 md:pl-37 lg:pl-160"
          >
            {/* items-start keeps every year on the same line even when a
                paragraph wraps to a different number of lines. */}
            <div className="flex items-start gap-x-8 sm:gap-x-12 md:gap-x-16 lg:gap-x-30 2xl:gap-x-50">
              {PROGRESS_ITEMS.map((item) => (
                <article
                  key={item.year}
                  className="flex shrink-0 flex-col items-start md:items-end"
                >
                  {/* The badge is anchored to the whole year + dash row, not
                      the digits alone. */}
                  <div className="relative mb-4 flex items-center gap-x-4 sm:gap-x-5 md:mb-5 lg:mb-6 lg:gap-x-8">
                    <span
                      style={{ backgroundColor: item.badgeColor }}
                      className="font-heading text-(length:--_typography---font-sizes--body--badge) absolute top-6.5 right-21.5 w-fit rotate-[-15deg] px-4 py-3 leading-[0.8] tracking-[-0.01em] text-white-secondary max-sm:hidden md:top-9 md:right-32.75 lg:top-13.75 lg:right-38.5 lg:px-6 lg:py-4"
                    >
                      {item.badgeLabel}
                    </span>

                    <p className="font-heading text-(length:--_typography---font-sizes--heading--progress-year) leading-none tracking-[-0.03em] text-white-secondary">
                      {item.year}
                    </p>

                    <span
                      aria-hidden
                      className="h-1.5 w-7.5 shrink-0 bg-white sm:h-2 sm:w-10 md:w-12.5 lg:w-19.5"
                    />
                  </div>

                  <div className="w-75 lg:w-120">
                    <div className="h-px w-full bg-white-secondary" />

                    <p className="mt-5 mb-6 min-h-30 text-base/6 text-white-secondary md:mt-6 md:mb-8 lg:mt-10 lg:mb-13 lg:text-xl/7.5">
                      {item.description}
                    </p>

                    <div className="relative h-[187.5px] w-full overflow-clip rounded-2xl sm:rounded-[20px] md:rounded-3xl lg:h-(--progress-img-h) lg:rounded-[40px]">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 480px, 300px"
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
