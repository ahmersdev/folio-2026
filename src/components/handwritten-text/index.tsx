"use client";

import { cn } from "@/lib/utils";
import { IHandwrittenTextProps } from "./handwritten-text.interface";
import useHandwrittenText from "./use-handwritten-text";

export default function HandwrittenText(props: IHandwrittenTextProps) {
  const { text, className } = props;
  const { revealed } = useHandwrittenText();

  return (
    <span
      className={cn(
        "font-cinzel-decorative z-10 text-foreground font-bold tracking-[0.2em] whitespace-nowrap",
        "text-4xl sm:text-6xl md:text-7xl",
        "inline-block",
        "[text-shadow:0_4px_16px_rgba(0,0,0,0.9)]",
        className,
      )}
      style={{
        clipPath: revealed
          ? "inset(-50% -5% -40% 0)"
          : "inset(-40% 100% -40% 0)",
        transition: "clip-path 1.6s cubic-bezier(0.65, 0, 0.35, 1)",
      }}
    >
      {text}
    </span>
  );
}
