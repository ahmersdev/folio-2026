import { ComponentType, SVGProps } from "react";

export interface ICustomButton {
  label: string;
  href: string;
  target?: "_self" | "_blank" | "_parent" | "_top";
  className?: string;
  // Trailing icon badge (e.g. ArrowIcon) — omitted by default. Passed as a
  // component reference (not a rendered element) so it can be rendered
  // twice internally for the hover roll, same convention SOCIAL_LINKS
  // already uses for its own Icon prop (src/constants/index.ts).
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  // Rest state is already filled (bg-rose-light by default, override via
  // className) with no hover fill/dash-color/text-color transition — for
  // contexts like the 404 marquee CTA where the reference button has no
  // :hover background change at all. Default (false) keeps today's
  // transparent-until-hover-fills-black behaviour.
  filled?: boolean;
  // "lg" swaps every internal size (text, notches, dash, icon badge) to a
  // fluid clamp() scale for large, full-bleed contexts like the marquee —
  // "default" (current fixed breakpoint scale) is used everywhere else.
  size?: "default" | "lg";
}
