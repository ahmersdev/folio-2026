"use client";

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
import { Caption, CustomButton } from "@/components";

export default function AboutMe() {
  const { titleRef } = useAboutMe();

  return (
    <section className="relative overflow-clip px-[5%] py-16 sm:py-20 md:py-28 lg:py-32">
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div>
          <Caption
            prefix={ABOUT_CAPTION_PREFIX}
            emphasis={ABOUT_CAPTION_EMPHASIS}
            suffix={ABOUT_CAPTION_SUFFIX}
            className="mb-6"
          />

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
            target="_blank"
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
