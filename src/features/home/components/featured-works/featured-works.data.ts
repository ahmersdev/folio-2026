export const WORKS_TITLE = "FEATURED WORKS";
export const WORKS_BADGE = "DIGITAL SCREENS";
export const WORKS_CTA_LABEL = "Learn More";

// The pinned stack only exists at 768px and up with motion allowed — the
// reference drops it at 767px. Must equal the `min-[768px]:` classes in
// featured-works/index.tsx and work-card/index.tsx: matchMedia can't read the
// breakpoint from them.
export const WORKS_PINNED_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

// Pinned track geometry, all from the reference: a 300vh track holding a
// wrapper that sticks 10% from the top, with the wrapper's CSS perspective
// giving the peeling cards their depth.
export const WORKS_TRACK_HEIGHT_VH = 300;
export const WORKS_PIN_TOP = "10%";
export const WORKS_PERSPECTIVE_PX = 1500;

// One ScrollTrigger on the track (reference interaction data): runs from the
// track's top meeting the viewport top to its bottom meeting the viewport
// bottom, with a 0.8s scrub lag.
export const WORKS_SCROLL_START = "top top";
export const WORKS_SCROLL_END = "bottom bottom";
export const WORKS_SCRUB_S = 0.8;

// Every step in the reference timeline lasts 0.5s on a linear ease; the
// timeline's own length is just the scrub's yardstick.
export const WORKS_STEP_DURATION_S = 0.5;
export const WORKS_STEP_EASE = "none";

// Cards behind the front one rest pre-offset and shrunk, so a ~20px strip of
// each shows beneath the front card (index = card position, 0 = front).
export const WORKS_STACK_INITIAL = [
  { y: 0, scale: 1 },
  { y: 40, scale: 0.94 },
  { y: 80, scale: 0.88 },
  { y: 120, scale: 0.82 },
];

// The front card lifts out and tilts away.
export const WORKS_PEEL_Y_PERCENT = -120;
export const WORKS_PEEL_ROTATE_X_DEG = 45;

// Timeline steps, in order. At `at`, card `peel` lifts away while each card
// in `forward` steps to its next resting offset/scale.
export const WORKS_TIMELINE_STEPS = [
  {
    at: 0.1,
    peel: 0,
    forward: [
      { card: 1, y: 0, scale: 1 },
      { card: 2, y: 60, scale: 0.94 },
      { card: 3, y: 100, scale: 0.88 },
    ],
  },
  {
    at: 0.61,
    peel: 1,
    forward: [
      { card: 2, y: 0, scale: 1 },
      { card: 3, y: 80, scale: 0.94 },
    ],
  },
  {
    at: 1.12,
    peel: 2,
    forward: [{ card: 3, y: 0, scale: 1 }],
  },
];

// Header reveal — heading char by char through SplitText masks, played once
// when the heading's top reaches 90% of the viewport (same values as the
// Steps header, kept local so each section can be tuned on its own), then the
// sticker pops in: opacity and scale 0.5 -> 1 at 1s, back.out.
export const WORKS_REVEAL_SCROLL_START = "top 90%";
export const WORKS_TITLE_REVEAL_DURATION_S = 1;
export const WORKS_TITLE_REVEAL_STAGGER_AMOUNT_S = 0.5;
export const WORKS_TITLE_REVEAL_EASE = "back.inOut";
export const WORKS_BADGE_REVEAL_START_S = 1;
export const WORKS_BADGE_REVEAL_DURATION_S = 0.6;
export const WORKS_BADGE_REVEAL_FROM_SCALE = 0.5;
export const WORKS_BADGE_REVEAL_EASE = "back.out";
