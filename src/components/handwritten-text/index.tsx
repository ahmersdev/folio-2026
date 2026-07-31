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
        "font-brush text-primary inline-block whitespace-nowrap",
        className,
      )}
      style={{
        clipPath: revealed
          ? "inset(-40% 0% -40% 0)"
          : "inset(-40% 100% -40% 0)",
        transition: "clip-path 1.6s cubic-bezier(0.65, 0, 0.35, 1)",
      }}
    >
      {text}
    </span>
  );
}
