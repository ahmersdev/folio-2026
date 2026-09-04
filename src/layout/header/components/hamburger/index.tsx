"use client";

import { HamburgerIcon } from "@/assets/icons";
import useHamburger from "./use-hamburger";

export default function Hamburger() {
  const { iconRef, onMouseEnter, onMouseLeave } = useHamburger();

  return (
    <button
      type="button"
      aria-label="Open menu"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="flex w-17.5 items-center justify-center border-0 lg:border-b border-white-secondary pb-2"
    >
      <HamburgerIcon
        ref={iconRef}
        className="h-5.5 w-8 -rotate-45 text-white-secondary"
      />
    </button>
  );
}
