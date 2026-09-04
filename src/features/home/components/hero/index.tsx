"use client";

import Image from "next/image";
import { StatBadgeIcon } from "@/assets/icons";
import { HeroForegroundImg } from "@/assets/images";
import {
  HERO_DESCRIPTION,
  HERO_SOCIAL_LINKS,
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
      className="relative flex h-dvh flex-col gap-4 justify-between overflow-clip bg-white pt-[13dvh] pb-[5dvh] text-white-secondary"
    >
      <div className="relative z-10 text-center flex-1 sm:flex-none">
        <h1 ref={titleRef} className="text-[19vw] leading-none">
          {HERO_TITLE}
        </h1>
      </div>

      <div className="relative z-30 w-full px-[6vw] grid grid-cols-1 grid-rows-1 sm:grid-cols-[auto_auto] sm:grid-rows-2 sm:justify-between gap-4">
        <h2
          ref={subtitleRef}
          className="text-[clamp(44px,4.44vw,64px)] leading-none tracking-[-0.0405em]"
        >
          {HERO_SUBTITLE_LINES[0]} <br />
          {HERO_SUBTITLE_LINES[1]}
        </h2>

        <p
          ref={descriptionRef}
          className="max-w-[clamp(280px,31.25vw,450px)] text-[clamp(16px,1.25vw,18px)] font-medium leading-[1.5556]"
        >
          {HERO_DESCRIPTION}
        </p>

        <div
          ref={socialLinksRef}
          className="order-2 sm:order-0 flex items-center gap-3"
        >
          <p className="text-[clamp(16px,1.39vw,20px)] font-medium leading-normal">
            Reach via
          </p>
          <div className="h-px w-10 bg-white-secondary" />
          <div className="flex gap-4">
            {HERO_SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                aria-label="social link"
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        <div
          ref={statRef}
          className="order-1 sm:order-0 flex items-center gap-4"
        >
          <StatBadgeIcon
            className="h-[clamp(52px,calc(2.5vw+24px),60px)]
              w-[clamp(42.77px,calc(2.056vw+19.74px),49.35px)]"
          />
          <div>
            <p className="font-heading text-[clamp(28px,2.5vw,36px)] leading-none">
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
      />

      <div ref={imageRef} className="pointer-events-none absolute inset-0 z-20">
        <div className="absolute inset-x-0 top-0 lg:top-[clamp(40px,10%,157px)] bottom-0">
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
