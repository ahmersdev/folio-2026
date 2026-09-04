import { ROUTES } from "@/constants/routes";
import { INavLink } from "./header.interface";

export const BRAND_HREF = ROUTES.HOME;

export const HEADER_DEFAULT_INSET_PX = 0;
export const HEADER_SCROLLED_INSET_PX = 20;
export const HEADER_DEFAULT_TOP_INSET_PX = 0;
export const HEADER_SCROLLED_TOP_INSET_PX = 12;
export const HEADER_SCROLL_TWEEN_DURATION_S = 0.4;
export const HEADER_SCROLL_EASE = "power2.out";

// Header stays hidden until the hero's background/image scale-in settles,
// so it doesn't pop in over a still-animating hero. Header and Hero mount in
// the same commit (see app/layout.tsx), so a plain fixed delay lines up with
// hero.data.ts's IMAGE_REVEAL_START_S (1.6) + IMAGE_REVEAL_DURATION_S (1.5).
// Keep in sync by hand if that timing changes.
export const HEADER_REVEAL_DELAY_S = 3.1;
export const HEADER_REVEAL_DURATION_S = 0.5;
export const HEADER_REVEAL_EASE = "power1.out";
export const HEADER_REVEAL_Y_PERCENT_FROM = -100;

export const NAV_LINKS: INavLink[] = [
  { label: "ABOUT", href: ROUTES.ABOUT },
  { label: "WORKS", href: ROUTES.WORKS },
  { label: "SERVICES", href: ROUTES.SERVICES },
  { label: "CONTACT", href: ROUTES.CONTACT },
];
