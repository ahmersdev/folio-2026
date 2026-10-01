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
  // Colour of the three notch marks that break the border. Defaults to white;
  // set it to the surface behind the button so the notches read as gaps in
  // the outline instead of white blocks on a coloured background.
  notchColor?: string;
  // Colour of the button's outline. Defaults to black-secondary. Only the
  // outline changes: the dash and label text colours are set separately and
  // are not affected.
  borderColor?: string;
}
