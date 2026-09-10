"use client";

import Image from "next/image";
import { StatBadgeIcon } from "@/assets/icons";
import { HeroForegroundImg, HeroNoiseImg } from "@/assets/images";
import { SocialLinks, Subtitle } from "@/components";
import {
  HERO_DESCRIPTION,
  HERO_STAT,
  HERO_SUBTITLE_LINES,
  HERO_TITLE,
} from "./hero.data";
import useHero from "./use-hero";

export default function Hero() {
  const {
    sectionRef,
    bgRef,
    imageRef,
    titleRef,
    subtitleRef,
    descriptionRef,
    socialLinksRef,
    statRef,
  } = useHero();

  return (
    <section
      ref={sectionRef}
      className="relative flex h-dvh flex-col gap-4 justify-between overflow-clip pt-[13dvh] pb-[5dvh] text-white-secondary"
    >
      <div className="relative z-10 text-center flex-1 sm:flex-none">
        <h1 ref={titleRef} className="text-[19vw] leading-none">
          {HERO_TITLE}
        </h1>
      </div>

      <div className="relative z-30 w-full px-[6vw] grid grid-cols-1 grid-rows-1 sm:grid-cols-[auto_auto] sm:grid-rows-2 sm:justify-between gap-4">
        <Subtitle ref={subtitleRef} lines={HERO_SUBTITLE_LINES} />

        <p
          ref={descriptionRef}
          className="max-w-[clamp(17.5rem,31.25vw,28.125rem)] text-[clamp(1rem,1.25vw,1.125rem)] font-medium leading-[1.5556]"
        >
          {HERO_DESCRIPTION}
        </p>

        <div
          ref={socialLinksRef}
          className="order-2 sm:order-0 flex items-center gap-3"
        >
          <SocialLinks />
        </div>

        <div
          ref={statRef}
          className="order-1 sm:order-0 flex items-center gap-4"
        >
          <StatBadgeIcon
            className="h-[clamp(3.25rem,calc(2.5vw+1.5rem),3.75rem)]
              w-[clamp(2.673125rem,calc(2.056vw+1.23375rem),3.084375rem)]"
          />
          <div>
            <p className="font-heading text-[clamp(1.75rem,2.5vw,2.25rem)] leading-none">
              {HERO_STAT.value}
            </p>
            <p className="text-[16px]">{HERO_STAT.label}</p>
          </div>
        </div>
      </div>

      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Image
          src={HeroNoiseImg}
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 0px) 100vw"
          className="object-cover opacity-70"
        />
      </div>

      <div ref={imageRef} className="pointer-events-none absolute inset-0 z-20">
        <div className="absolute inset-x-0 top-0 lg:top-[clamp(2.5rem,10%,9.8125rem)] bottom-0">
          <Image
            src={HeroForegroundImg}
            alt=""
            fill
            preload
            sizes="(min-width: 0px) 100vw"
            className="object-cover lg:object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
}
