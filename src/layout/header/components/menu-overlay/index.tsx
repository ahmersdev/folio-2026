"use client";

import { CloseIcon } from "@/assets/icons";
import { BRAND_TEXT, SOCIAL_LINKS } from "@/constants";
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
            style={{
              background: "var(--gradient-heading)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
            className="pointer-events-none relative font-heading font-normal text-[clamp(60px,calc(16.83vw-3.1px),239.2px)] leading-[0.8] tracking-[-0.03em] text-center whitespace-nowrap opacity-30 pt-15 md:pt-11 lg:pt-0"
          >
            {BRAND_TEXT}
          </p>
          <div
            style={{
              transform: `translate(-50%, -50%) rotate(${TAGLINE_ROTATE_DEG}deg)`,
            }}
            className="pointer-events-none absolute top-1/2 left-1/2 hidden bg-rose px-[clamp(12px,calc(1.19vw+18.86px),36px)] py-[clamp(16px,calc(0.595vw+11.43px),20px)] md:block"
          >
            <span className="font-heading font-normal text-[clamp(28px,calc(1.04vw+20px),35px)] leading-[0.8] tracking-[-0.01em] whitespace-nowrap text-black-secondary uppercase">
              {TAGLINE_TEXT}
            </span>
          </div>
          <button
            type="button"
            data-menu-close=""
            aria-label="Close menu"
            onClick={onClose}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-10 flex size-[clamp(48px,calc(3.19vw+36.03px),82px)] items-center justify-center rounded-[clamp(12px,calc(0.75vw+9.18px),20px)] border border-white/30 bg-black-secondary"
          >
            <CloseIcon className="size-[clamp(24px,calc(1.69vw+17.66px),42px)] text-white-secondary" />
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

        <div className="flex items-center gap-3">
          <p className="font-sans font-bold text-(length:--_typography---font-sizes--body--md) leading-normal tracking-normal text-white">
            Follow us
          </p>
          <div className="h-px w-5 md:w-10 bg-white-secondary" />
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              aria-label={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex"
            >
              <Icon className="size-5 text-white-secondary" />
            </a>
          ))}
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
