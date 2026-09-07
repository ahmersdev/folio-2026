"use client";

import Link from "next/link";
import { ENTER_REST_TOP_PERCENT } from "./menu-link.data";
import useMenuLink from "./use-menu-link";
import { IMenuLinkProps } from "./menu-link.interface";

export default function MenuLink(props: IMenuLinkProps) {
  const { label, href, onNavigate } = props;

  const { wipeRef, text1Ref, text2Ref, onMouseEnter, onMouseLeave } =
    useMenuLink();

  return (
    <li className="border-b border-white-secondary/30">
      <Link
        href={href}
        onClick={onNavigate}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="relative flex items-center justify-center overflow-hidden px-6 pt-6 md:pt-9 md:px-10"
      >
        <span
          ref={wipeRef}
          className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-wipe"
        />
        <span className="relative z-10 block" aria-label={label}>
          <span
            ref={text1Ref}
            aria-hidden
            className="block font-heading font-normal text-(length:--_typography---font-sizes--nav--menu-item) leading-[0.5] tracking-[-0.01em] text-center text-[#808080] uppercase"
          >
            {label}
          </span>
          <span
            ref={text2Ref}
            aria-hidden
            style={{ top: `${ENTER_REST_TOP_PERCENT}%` }}
            className="absolute inset-x-0 block font-heading font-normal text-(length:--_typography---font-sizes--nav--menu-item) leading-[0.5] tracking-[-0.01em] text-center text-white-secondary uppercase"
          >
            {label}
          </span>
        </span>
      </Link>
    </li>
  );
}
