"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ENTER_REST_TOP_PERCENT } from "./menu-link.data";
import useMenuLink from "./use-menu-link";
import { IMenuLinkProps } from "./menu-link.interface";
import { cn } from "@/lib";

export default function MenuLink(props: IMenuLinkProps) {
  const { label, href, index, onNavigate } = props;

  const hasIndex = index !== undefined;
  const pathname = usePathname();
  const isActive = pathname === href;

  const {
    wipeRef,
    text1Ref,
    text2Ref,
    indexText1Ref,
    indexText2Ref,
    onMouseEnter,
    onMouseLeave,
  } = useMenuLink(hasIndex, isActive);

  const formattedIndex = hasIndex ? String(index + 1).padStart(2, "0") : null;

  return (
    <li className="border-b border-white-secondary/30">
      <Link
        href={href}
        onClick={onNavigate}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onMouseEnter}
        onBlur={onMouseLeave}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "relative flex items-center overflow-hidden pt-6 md:pt-9 px-6 md:px-10",
          hasIndex ? "justify-between" : "justify-center",
        )}
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

        {hasIndex && (
          <span className="relative z-10 block" aria-hidden>
            <span
              ref={indexText1Ref}
              className="block font-heading font-normal text-(length:--_typography---font-sizes--nav--menu-item-index) leading-[0.8076] tracking-[-0.0162em] text-transparent uppercase [-webkit-text-stroke:1px_#808080]"
            >
              {formattedIndex}
            </span>
            <span
              ref={indexText2Ref}
              style={{ top: `${ENTER_REST_TOP_PERCENT}%` }}
              className="absolute inset-x-0 block font-heading font-normal text-(length:--_typography---font-sizes--nav--menu-item-index) leading-[0.8076] tracking-[-0.0162em] text-white-secondary uppercase"
            >
              {formattedIndex}
            </span>
          </span>
        )}
      </Link>
    </li>
  );
}
