"use client";

import useCustomCursor from "./use-custom-cursor";

export default function CustomCursor() {
  const { cursorRef, isCoarse } = useCustomCursor();

  if (isCoarse) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="cursor-dot pointer-events-none fixed left-0 top-0 z-9999 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
    />
  );
}
