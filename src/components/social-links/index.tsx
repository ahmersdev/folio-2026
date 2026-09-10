"use client";

import { SOCIAL_LINKS } from "@/constants";
import { cn } from "@/lib";
import { ISocialLinksProps } from "./social-links.interface";

export default function SocialLinks(props: ISocialLinksProps) {
  const {
    className,
    label = "Reach via",
    labelClassName,
    lineClassName,
    iconsClassName,
  } = props;

  return (
    <>
      <p
        className={cn(
          "text-(length:--_typography---font-sizes--body--md) font-medium leading-normal text-white",
          labelClassName,
        )}
      >
        {label}
      </p>
      <div
        className={cn("h-px w-5 md:w-10 bg-white-secondary", lineClassName)}
      />
      <div className={cn("flex gap-4", iconsClassName)}>
        {SOCIAL_LINKS.map(({ label: socialLabel, href, Icon }) => (
          <a
            key={socialLabel}
            aria-label={socialLabel}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex"
          >
            <Icon className={cn("size-5 text-white-secondary", className)} />
          </a>
        ))}
      </div>
    </>
  );
}
