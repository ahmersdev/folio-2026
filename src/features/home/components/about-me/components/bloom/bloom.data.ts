// Ring sizes as % of the outermost ring (Four, 309×324 — Bloom's own aspect-[309/324]
// root). Computed independently per axis (W/309, H/324) so each ring reconstructs its own
// exact intrinsic aspect ratio despite ~0.5% W:H variance between the 4 source SVGs.
export const RING_ONE_WIDTH_PCT = 44.66; // 138/309
export const RING_ONE_HEIGHT_PCT = 44.75; // 145/324
export const RING_TWO_WIDTH_PCT = 58.58; // 181/309
export const RING_TWO_HEIGHT_PCT = 58.33; // 189/324
export const RING_THREE_WIDTH_PCT = 72.17; // 223/309
export const RING_THREE_HEIGHT_PCT = 72.22; // 234/324
export const RING_FOUR_WIDTH_PCT = 100; // 309/309
export const RING_FOUR_HEIGHT_PCT = 100; // 324/324

// Per-circle reveal within a single ring (20 circles, source order = confirmed sweep order).
// Opacity only, deliberately — see use-bloom.ts for why scale/transform is off the table.
export const CIRCLE_STAGGER_EACH_S = 0.035;
export const CIRCLE_TWEEN_DURATION_S = 0.4;
export const CIRCLE_EASE = "power2.out";

// Ring-to-ring: next ring starts ~40% into the previous ring's own sweep
// (20 × CIRCLE_STAGGER_EACH_S ≈ 0.665s) for a continuous outward wave rather
// than four discrete sequential blocks.
export const RING_TO_RING_OFFSET_S = 0.4;

// One-shot ScrollTrigger gate — fires once the graphic is meaningfully in
// view, plays the bloom-in once, and holds at full bloom (no reverse, no
// repeat).
export const BLOOM_SCROLL_START = "top 85%";

// Matches the lg breakpoint the parent (about-me/index.tsx) already gates
// this component's visibility on (default, un-overridden Tailwind lg).
export const BLOOM_MATCH_MEDIA_QUERY = "(min-width: 1024px)";
