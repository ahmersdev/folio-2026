"use client";

import { cn } from "@/lib/utils";
import { ITypewriterTextProps } from "./typewriter-text.interface";
import useTypewriterText from "./use-typewriter-text";

export default function TypewriterText(props: ITypewriterTextProps) {
  const { text, className } = props;
  const { displayedText } = useTypewriterText(text);

  return (
    <span className={cn("font-brush text-primary inline-block", className)}>
      <span aria-hidden="true">
        {displayedText}
        <span className="motion-reduce:animate-none animate-pulse">|</span>
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
