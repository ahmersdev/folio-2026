// Reverse-engineered from the reference site's own interaction config —
// pulled directly from its exported IX2 action lists ("Button primary hover
// in"/"hover out") and its newer wf:hover interaction (for the text roll +
// corner accents), not estimated. The previous version of this file only
// covered the text roll; the button's own background fill and the dash
// line's color/scale flip were missing entirely, which was the actual gap
// between this component and the reference.

// Button's own background: transparent -> filled, and the dash line's
// color flip (black -> white) run together, same duration/ease. Source
// used the CSS-standard "ease" keyword; "power1.inOut" is GSAP's closest
// named equivalent.
export const FILL_DURATION_S = 0.35;
export const FILL_EASE = "power1.inOut";

// Dash line widens on hover (scaleX only). Source easing name "inOutCubic"
// maps 1:1 to GSAP's "power2.inOut" (GSAP's power1/2/3/4 correspond to
// quad/cubic/quart/quint, same convention).
export const DASH_SCALE_X = 1.3;
export const DASH_SCALE_DURATION_S = 0.5;
export const DASH_SCALE_EASE = "power2.inOut";

// Text color flip (both copies together) — duration/ease read directly off
// the resolved gsap.globalTimeline tween, not guessed.
export const TEXT_COLOR_DURATION_S = 0.3;
export const TEXT_COLOR_EASE = "power1.out";

// Text roll (per-char, both copies at once) — duration/stagger matched the
// reference exactly (confirmed against its raw interaction JSON). Ease was
// a numeric preset id with no lookup table in the fetched JS, so
// "power2.out" is a starting point to tune by eye, same substitute already
// used for nav-link's roll.
export const CHAR_DURATION_S = 0.35;
export const STAGGER_AMOUNT_S = 0.5;
export const CHAR_EASE = "power2.out";

// The three small white "notch" marks that sit on the border (top-left,
// bottom-right x2) — decorative stitches that only read correctly against
// a visible border, so they shrink away and slide off as the button fills.
// Duration/ease/translate distance read directly off the resolved
// gsap.globalTimeline tweens for these exact elements, not guessed.
export const NOTCH_SHRINK_DURATION_S = 0.5;
export const NOTCH_SHRINK_EASE = "back.in";
export const NOTCH_TRANSLATE_X_PX = 20;
