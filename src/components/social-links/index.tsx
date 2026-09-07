"use client";

import { SOCIAL_LINKS } from "@/constants";
import { cn } from "@/lib";
import { ISocialLinksProps } from "./social-links.interface";

export default function SocialLinks(props: ISocialLinksProps) {
  const { className } = props;

  return (
    <>
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          aria-label={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="flex"
        >
          <Icon className={cn("size-5", className)} />
        </a>
      ))}
    </>
  );
}
