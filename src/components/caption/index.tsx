"use client";

import { cn } from "@/lib";
import { ICaptionProps } from "./caption.interface";

export default function Caption(props: ICaptionProps) {
  const { prefix, emphasis, suffix, className } = props;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className="size-4.5 shrink-0 rounded-full bg-white-secondary
          md:size-5
          lg:size-7"
      />
      <p
        className="text-[20px] leading-none font-semibold tracking-tight text-white-secondary
          md:text-[24px]
          lg:text-[30px]"
      >
        {prefix}
        <span className="italic">{emphasis}</span>
        {suffix}
      </p>
    </div>
  );
}
