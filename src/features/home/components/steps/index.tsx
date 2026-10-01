"use client";

import { StepCard } from "./components";
import { STEPS, STEPS_SUBTITLE, STEPS_TITLE } from "./steps.data";
import useSteps from "./use-steps";

export default function Steps() {
  const { headerRef, titleRef, subtitleRef } = useSteps();

  return (
    <section className="rounded-[100px] bg-mist py-37.5 text-white-secondary">
      <div className="px-[5%]">
        <div className="mx-auto w-full max-w-420">
          <header ref={headerRef} className="mb-20 text-center">
            <h2
              ref={titleRef}
              className="mb-3 text-(length:--_typography---font-sizes--heading--h4) leading-none font-normal tracking-[-0.01em] uppercase"
            >
              {STEPS_TITLE}
            </h2>
            <p
              ref={subtitleRef}
              className="text-xl leading-[1.4] text-charcoal"
            >
              {STEPS_SUBTITLE}
            </p>
          </header>

          {/* 1 column, 2x2 from sm, 4 columns from lg. Cards align to the top
              at lg so opening one grows only that card; below it they stretch
              so a row's cards match heights. */}
          <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-start xl:gap-10">
            {/* Dashed connector behind the row; lg and up only. */}
            <div
              aria-hidden
              className="absolute top-3 left-1/2 hidden w-[79%] max-w-325 -translate-x-1/2 border-2 border-dashed border-ash lg:block"
            />
            {STEPS.map((step) => (
              <StepCard key={step.count} step={step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
