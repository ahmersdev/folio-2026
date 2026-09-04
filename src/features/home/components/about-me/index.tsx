"use client";

import CustomButton from "@/components/custom-button";
import {
  ABOUT_CAPTION_EMPHASIS,
  ABOUT_CAPTION_PREFIX,
  ABOUT_CAPTION_SUFFIX,
  ABOUT_CTA_HREF,
  ABOUT_CTA_LABEL,
  ABOUT_TITLE,
} from "./about-me.data";
import useAboutMe from "./use-about-me";
import { Bloom } from "./components";

export default function AboutMe() {
  const { titleRef } = useAboutMe();

  return (
    <section className="relative overflow-clip bg-white px-[5%] py-16 text-black-secondary sm:py-20 md:py-28 lg:py-32">
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span
              className="size-4.5 shrink-0 rounded-full bg-black-secondary
                md:size-5
                lg:size-7"
            />
            <p
              className="text-[20px] leading-none font-semibold tracking-tight
                md:text-[24px]
                lg:text-[30px]"
            >
              {ABOUT_CAPTION_PREFIX}
              <span className="italic">{ABOUT_CAPTION_EMPHASIS}</span>
              {ABOUT_CAPTION_SUFFIX}
            </p>
          </div>

          <h2
            ref={titleRef}
            className="text-(length:--_typography---font-sizes--heading--h4) leading-none font-normal tracking-[-0.01em] uppercase
              lg:max-w-[29ch]"
          >
            {ABOUT_TITLE}
          </h2>

          <CustomButton
            label={ABOUT_CTA_LABEL}
            href={ABOUT_CTA_HREF}
            target={"_blank"}
            className="mt-8"
          />
        </div>

        {/* Hidden below lg, matching the reference (which drops its own
            decorative graphic entirely on tablet/mobile rather than just
            shrinking it). */}
        <Bloom className="hidden shrink-0 self-center lg:block lg:w-87.5" />
      </div>
    </section>
  );
}
