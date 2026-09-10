"use client";

import { Fragment } from "react";
import { cn } from "@/lib";
import { DEFAULT_SUBTITLE_LINES } from "./subtitle.data";
import { ISubtitleProps } from "./subtitle.interface";

export default function Subtitle(props: ISubtitleProps) {
  const { lines = DEFAULT_SUBTITLE_LINES, className, ref } = props;

  return (
    <h2
      ref={ref}
      className={cn(
        "text-[clamp(2.75rem,4.44vw,4rem)] leading-none tracking-[-0.0405em] text-white-secondary",
        className,
      )}
    >
      {lines.map((line, index) => (
        <Fragment key={line}>
          {index > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </h2>
  );
}
