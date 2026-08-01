"use client";

import { cn } from "@/lib/utils";
import { ITypewriterTextProps } from "./typewriter-text.interface";
import useTypewriterText from "./use-typewriter-text";

export default function TypewriterText(props: ITypewriterTextProps) {
  const { text, className } = props;
  const { displayedText } = useTypewriterText(text);

  return (
    <span
      className={cn(
        "font-cinzel text-primary font-medium tracking-widest sm:whitespace-nowrap",
        "text-lg sm:text-xl md:text-2xl",
        "inline-block",
        "[text-shadow:0_0_6px_var(--primary),0_0_15px_rgba(194,36,54,0.4)]",
        className,
      )}
    >
      <span aria-hidden="true">
        {displayedText}
        <span className="motion-reduce:animate-none animate-pulse ml-1 text-primary">
          |
        </span>
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
