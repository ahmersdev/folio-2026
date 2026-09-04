"use client";

import Link from "next/link";
import { BRAND_HREF, NAV_LINKS } from "./header.data";
import { BRAND_TEXT } from "@/constants";
import { Hamburger, NavLink } from "./components";
import useHeader from "./use-header";

export default function Header() {
  const { headerRef } = useHeader();

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-99 bg-black-secondary/64 backdrop-blur-[200px] rounded-xl"
    >
      <nav
        aria-label="Primary"
        className="flex items-stretch justify-between
        border-b border-white-secondary lg:border-0
        pt-4 px-4 md:px-6
        gap-10"
      >
        <Link
          href={BRAND_HREF}
          className="flex max-w-[20%] flex-1 items-end border-0 lg:border-b border-white-secondary pb-2 font-heading text-white-secondary text-(length:--_typography---font-sizes--heading--h5) leading-none whitespace-nowrap"
        >
          {BRAND_TEXT}
        </Link>

        <ul className="hidden flex-1 items-stretch lg:flex gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <NavLink key={label} label={label} href={href} />
          ))}
        </ul>

        <Hamburger />
      </nav>
    </header>
  );
}
