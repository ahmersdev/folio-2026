"use client";

import { HamburgerIcon } from "@/assets/icons";
import useHamburger from "./use-hamburger";
import { IHamburgerProps } from "./hamburger.interface";

export default function Hamburger(props: IHamburgerProps) {
  const { onClick, isOpen } = props;

  const { iconRef, onMouseEnter, onMouseLeave } = useHamburger();

  return (
    <button
      type="button"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      className="flex w-17.5 items-center justify-end lg:justify-center border-0 lg:border-b border-white-secondary pb-2"
    >
      <HamburgerIcon
        ref={iconRef}
        className="h-[clamp(21px,calc(0.129vw+21px),22px)] w-[clamp(21px,calc(0.188vw+21px),32px)] -rotate-45 text-white-secondary"
      />
    </button>
  );
}
