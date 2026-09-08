import { WHATSAPP_LINK } from "@/constants";

export const CTA_TICKER_TEXT = "Let’s Connect And Let’s Work Together";
export const CTA_LABEL = "Let's Contact";
export const CTA_HREF = WHATSAPP_LINK;

// Each row renders the phrase twice back-to-back: tweening the track exactly
// -50%/+50% of its own width (i.e. one full phrase-width) lands it back on a
// frame identical to the start, so `repeat: -1` reads as continuous motion
// with no visible seam.
export const TICKER_REPEAT_COUNT = 2;

// A literal px/second speed (not a fixed seconds duration) — duration is
// derived per-row from its own measured width in use-cta-marquee.ts, so
// both rows move at the same visual speed regardless of viewport size or
// font-size, instead of drifting apart as the fluid text-size clamp
// changes each row's rendered width.
export const MARQUEE_SPEED_PX_PER_S = 250;
export const MARQUEE_EASE = "none";
