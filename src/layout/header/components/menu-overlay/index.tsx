"use client";

import { CloseIcon } from "@/assets/icons";
import { SocialLinks } from "@/components";
import { BRAND_TEXT } from "@/constants";
import { cn } from "@/lib";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  MENU_NAV_LINKS,
  TAGLINE_ROTATE_DEG,
  TAGLINE_TEXT,
} from "./menu-overlay.data";
import { IMenuOverlayProps } from "./menu-overlay.interface";
import { MenuLink } from "./components";

export default function MenuOverlay(props: IMenuOverlayProps) {
  const { phase, panelRef, onClose } = props;

  const isVisible = phase === "opening" || phase === "open";

  return (
    <div
      ref={panelRef}
      aria-hidden={!isVisible}
      inert={phase === "closed" ? true : undefined}
      // `phase` starts as "closed" on both the server and the initial client
      // render, so this already renders `display:none` in the raw SSR HTML —
      // preventing the flash use-menu-overlay.ts's gsap.set() can't (that
      // only runs after hydration). Using `hidden` instead of a static
      // transform class avoids fighting GSAP's own yPercent-driven transform
      // writes on this element (a transform class here previously froze the
      // whole page — pointer-events-none only applies while !isVisible, so a
      // fixed inset-0 panel left in the wrong position was catching clicks).
      hidden={phase === "closed"}
      className={cn(
        "fixed inset-0 z-110 flex h-dvh flex-col justify-between bg-black-secondary",
        !isVisible && "pointer-events-none",
      )}
    >
      <div className="flex flex-col">
        <div className="relative">
          <p
            aria-hidden
            style={{
              background: "var(--gradient-heading)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
            className="pointer-events-none relative font-heading font-normal text-[clamp(3.75rem,calc(16.83vw-0.19375rem),14.95rem)] leading-[0.8] tracking-[-0.03em] text-center whitespace-nowrap opacity-30 pt-15 md:pt-11 lg:pt-0"
          >
            {BRAND_TEXT}
          </p>
          <div
            style={{
              transform: `translate(-50%, -50%) rotate(${TAGLINE_ROTATE_DEG}deg)`,
            }}
            className="pointer-events-none absolute top-1/2 left-1/2 hidden bg-rose px-[clamp(0.75rem,calc(1.19vw+1.17875rem),2.25rem)] py-[clamp(1rem,calc(0.595vw+0.714375rem),1.25rem)] md:block"
          >
            <span className="font-heading font-normal text-[clamp(1.75rem,calc(1.04vw+1.25rem),2.1875rem)] leading-[0.8] tracking-[-0.01em] whitespace-nowrap text-black-secondary uppercase">
              {TAGLINE_TEXT}
            </span>
          </div>
          <button
            type="button"
            data-menu-close=""
            aria-label="Close menu"
            onClick={onClose}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-10 flex size-[clamp(3rem,calc(3.19vw+2.251875rem),5.125rem)] items-center justify-center rounded-[clamp(0.75rem,calc(0.75vw+0.57375rem),1.25rem)] border border-white/30 bg-black-secondary"
          >
            <CloseIcon className="size-[clamp(1.5rem,calc(1.69vw+1.10375rem),2.625rem)] text-white-secondary" />
          </button>
        </div>

        <ul className="flex flex-col">
          {MENU_NAV_LINKS.map(({ label, href }) => (
            <MenuLink
              key={label}
              label={label}
              href={href}
              onNavigate={onClose}
            />
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 px-15 py-10 md:justify-between">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-sans font-bold text-(length:--_typography---font-sizes--body--md) leading-normal tracking-normal text-white underline decoration-solid"
        >
          {CONTACT_EMAIL}
        </a>

        <div className="flex items-center gap-2 md:gap-3">
          <SocialLinks label="Follow us" labelClassName="font-bold" />
        </div>

        <a
          href={`tel:${CONTACT_PHONE}`}
          className="font-sans font-bold text-(length:--_typography---font-sizes--body--md) leading-normal tracking-normal text-white underline decoration-solid"
        >
          {CONTACT_PHONE}
        </a>
      </div>
    </div>
  );
}
