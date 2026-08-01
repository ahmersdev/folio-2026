"use client";

import { cn } from "@/lib/utils";
import { ITaglineBannerProps } from "./tagline-banner.interface";

export default function TaglineBanner(props: ITaglineBannerProps) {
  const {
    primaryText = "I see the whole system",
    highlightText = "before I write a line.",
    className,
  } = props;
  return (
    <div className={cn("relative max-w-4xl", className)}>
      <h1
        className={cn(
          "font-protest-revolution text_foreground",
          "text-4xl sm:text-5xl md:text-6xl",
          "leading-[1.15] tracking-wide normal-case",
          "[text-shadow:0_3px_12px_rgba(0,0,0,0.85)]",
        )}
      >
        {primaryText}{" "}
        <span
          className={cn(
            "text-primary inline-block",
            "[text-shadow:0_0_12px_var(--primary),0_0_24px_rgba(194,36,54,0.4)]",
          )}
        >
          {highlightText}
        </span>
      </h1>
    </div>
  );
}
