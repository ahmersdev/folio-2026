export const TEXT_REVEAL_DELAY_S = 0.05;
export const TEXT_REVEAL_DURATION_S = 1;
export const TEXT_REVEAL_STAGGER_S = 0.05;
export const TEXT_REVEAL_EASE = "back.inOut";

// Reverse-engineered from the live site's gsap.globalTimeline: the cover's
// exit tween starts ~0.01s before the char stagger group actually finishes
// (1.44s vs. a 1.45s end), i.e. no real hold — it's the very next thing in
// the sequence, not a pause after it.
export const HOLD_DURATION_S = 0;

// Whole cover exits as a single solid block, not split into pieces. The
// text has no exit animation of its own — it's a child of the cover, so it
// rides out together with it as one piece.
export const COVER_EXIT_DURATION_S = 1;
export const COVER_EXIT_EASE = "power2.inOut";
export const COVER_EXIT_Y_PERCENT = -120;

// Decorative strip pinned just below the cover's bottom edge — inherits the
// cover's own transform, so it only becomes visible for an instant as the
// cover finishes its exit (the extra travel past -100%).
export const BORDER_LINE_HEIGHTS_PX = [12, 9, 6, 4, 3];
export const BORDER_LINE_GAP_PX = 4;
