"use client";

import Link from "next/link";
import useNavLink from "./use-nav-link";
import { INavLink } from "@/layout/header/header.interface";

export default function NavLink(props: INavLink) {
  const { label, href } = props;

  const { text1Ref, text2Ref, onMouseEnter, onMouseLeave } = useNavLink();

  return (
    <li className="flex flex-1 border-b border-white-secondary pb-1.5">
      <Link
        href={href}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="flex flex-1 items-center justify-start gap-4"
      >
        <span className="size-3 shrink-0 rounded-full border border-white-secondary" />
        <span className="relative h-5 overflow-clip">
          <span
            ref={text1Ref}
            className="block h-5 text-[16px] text-white-secondary leading-5"
          >
            {label}
          </span>
          <span
            ref={text2Ref}
            className="block h-5 text-[16px] text-white-secondary leading-5"
            aria-hidden="true"
          >
            {label}
          </span>
        </span>
      </Link>
    </li>
  );
}
