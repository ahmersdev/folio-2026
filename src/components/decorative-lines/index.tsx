"use client";

import { cn } from "@/lib";
import { IDecorativeLinesProps } from "./decorative-lines.interface";

export default function DecorativeLines(props: IDecorativeLinesProps) {
  const {
    heights,
    gap,
    lineClassName = "bg-white-secondary",
    className,
  } = props;

  return (
    <div className={cn("flex flex-col", className)} style={{ gap }}>
      {heights.map((height, i) => (
        <div key={i} className={lineClassName} style={{ height }} />
      ))}
    </div>
  );
}
