// Reverse-engineered from the reference site's compiled interactions config:
// mouseenter tweens the icon's rotation from its resting -45deg to 0deg and
// grows the two side bars (16px wide, centered at x=8) to match the middle
// bar (32px, x=0) — same moment, same duration. mouseleave reverses the same
// tween, played back at 1.15x (Webflow's "reverse" hover control speed).
// duration/ease weren't recoverable from the bundle (no explicit duration;
// ease was a numeric preset id with no lookup table in the fetched JS), so
// these are starting points to tune by eye — same caveat as nav-link.data.ts.
export const ROTATE_TO_DEG = 0;
export const BAR_WIDTH_TO_PX = 32;
export const BAR_X_TO_PX = 0;
export const DURATION_S = 0.3;
export const EASE = "power2.out";
export const LEAVE_SPEED = 1.15;
