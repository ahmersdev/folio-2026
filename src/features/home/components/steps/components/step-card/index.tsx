"use client";

import { ChevronDownIcon, StepMarkerIcon } from "@/assets/icons";
import { cn } from "@/lib";
import { IStepCardProps } from "./step-card.interface";
import useStepCard from "./use-step-card";
import { TITLE_CLASS } from "./step-card.data";

export default function StepCard(props: IStepCardProps) {
  const { step } = props;
  const {
    descriptionId,
    descriptionRef,
    plainTitleRef,
    gradientTitleRef,
    buttonRef,
    chevronRef,
    isOpen,
    toggle,
  } = useStepCard();

  return (
    <article className="relative flex flex-col items-center">
      {/* lg-and-up marker on the dashed line; sits above the line (z-1) but
          below the card (z-2). */}
      <StepMarkerIcon
        aria-hidden
        className="relative z-1 mb-8 hidden shrink-0 text-white-secondary lg:block"
      />

      <div className="relative z-2 w-full grow rounded-[40px] bg-background px-4 py-11 text-center sm:py-8 lg:pt-10 lg:pb-16 xl:px-5">
        <p className="mb-6 font-heading text-2xl leading-none tracking-[-0.01em] text-white-secondary">
          Step {step.count}
        </p>

        {/* Two stacked headings in a clipped box: opening slides the plain one
            out the top and the gradient copy (parked one line below) into
            view. The copy is decorative, so it is hidden from screen readers. */}
        <div className="relative overflow-hidden">
          <h3 ref={plainTitleRef} className={TITLE_CLASS}>
            {step.title}
          </h3>
          <h3
            ref={gradientTitleRef}
            aria-hidden
            className={cn(
              TITLE_CLASS,
              "absolute inset-x-0 top-full hidden bg-ember bg-clip-text text-transparent lg:block",
            )}
          >
            {step.title}
          </h3>
        </div>

        {/* Closed by CSS at lg and up (use-step-card.ts animates it open);
            always visible below it. */}
        <div
          ref={descriptionRef}
          id={descriptionId}
          className="overflow-hidden lg:invisible lg:h-0"
        >
          <p className="pt-6 text-lg leading-[1.4]">{step.description}</p>
        </div>

        {/* Centered on the card's bottom edge: the wrapper starts at the edge
            and the button is pulled up by half its height. */}
        <div className="pointer-events-none absolute inset-x-0 top-full hidden justify-center lg:flex">
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={isOpen}
            aria-controls={descriptionId}
            aria-label={`${step.title} details`}
            onClick={toggle}
            className="pointer-events-auto -mt-8 grid size-15 cursor-pointer place-items-center rounded-full bg-ash text-white-secondary"
          >
            <ChevronDownIcon ref={chevronRef} aria-hidden className="size-8" />
          </button>
        </div>
      </div>
    </article>
  );
}
