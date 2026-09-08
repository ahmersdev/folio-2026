"use client";

import { ArrowIcon } from "@/assets/icons";
import { CustomButton } from "@/components";
import {
  CTA_HREF,
  CTA_LABEL,
  CTA_TICKER_TEXT,
  TICKER_REPEAT_COUNT,
} from "./cta-marquee.data";
import useCtaMarquee from "./use-cta-marquee";

const TICKER_COPIES = Array.from({ length: TICKER_REPEAT_COUNT });

export default function CtaMarquee() {
  const { row1Ref, row2Ref } = useCtaMarquee();

  return (
    <section className="overflow-clip py-16 text-black-secondary sm:py-20 md:py-28 relative">
      <div ref={row1Ref} className="flex w-max whitespace-nowrap opacity-50">
        {TICKER_COPIES.map((_, i) => (
          <h2
            key={i}
            className="mr-[clamp(20px,3vw,40px)] text-[clamp(3rem,0.6942rem+9.8382vw,12.5rem)] leading-none uppercase"
          >
            {CTA_TICKER_TEXT}
          </h2>
        ))}
      </div>

      <div ref={row2Ref} className="flex w-max whitespace-nowrap opacity-50">
        {TICKER_COPIES.map((_, i) => (
          <h2
            key={i}
            className="text-stroke mr-[clamp(20px,3vw,40px)] text-[clamp(3rem,0.6942rem+9.8382vw,12.5rem)] leading-none text-transparent uppercase"
          >
            {CTA_TICKER_TEXT}
          </h2>
        ))}
      </div>

      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
        <CustomButton
          label={CTA_LABEL}
          href={CTA_HREF}
          target="_blank"
          icon={ArrowIcon}
          filled
          size="lg"
        />
      </div>
    </section>
  );
}
