import { WHATSAPP_PHONE_INTL } from "@/constants";
import { ROUTES } from "@/constants/routes";
import { INavLink } from "@/interfaces";

// Panel slides from -100dvh to 0dvh on open; close reverses the same tween.
// Implemented as yPercent (-100 -> 0) on an h-dvh element rather than literal
// dvh keyframes — same idiom use-header.ts uses for its own full-height
// reveal, which stays resize-safe since percentage transforms are
// recalculated against the element's live box size.
export const PANEL_DURATION_S = 0.8;
export const PANEL_EASE = "power1.out";

export const CONTACT_EMAIL = "ahmer.dock@gmail.com";
export const CONTACT_PHONE = WHATSAPP_PHONE_INTL;

export const TAGLINE_TEXT = "FULL STACK MIND, SHIPPING HANDS";
export const TAGLINE_ROTATE_DEG = -15;

// This menu's own nav list — deliberately separate from header.data.ts's
// NAV_LINKS (the persistent top bar) so this richer, Home-inclusive list
// doesn't also change the top bar. "Projects" reuses ROUTES.WORKS: same
// destination as the top bar's "Works" link, just relabeled here.
export const MENU_NAV_LINKS: INavLink[] = [
  { label: "HOME", href: ROUTES.HOME },
  { label: "ABOUT", href: ROUTES.ABOUT },
  { label: "PROJECTS", href: ROUTES.WORKS },
  { label: "SERVICES", href: ROUTES.SERVICES },
  { label: "CONTACT", href: ROUTES.CONTACT },
];
