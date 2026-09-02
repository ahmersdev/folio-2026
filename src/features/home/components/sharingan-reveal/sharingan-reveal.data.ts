// Scroll-progress breakpoints (0 → 1 across the whole pinned section) that
// gate each phase of the awakening. Shared by every subcomponent so their
// individual useTransform ranges stay in sync with one another.
//
// The clip scrubs across [0, SEQUENCE_PHASE_END] and holds on its final
// frame past that point. The heading types in starting 20% into that same
// span (not 20% of the whole section) and finishes exactly as the frames
// finish/hold, so both settle together for the final stretch.
export const SEQUENCE_PHASE_END = 0.85;
export const HEADING_PHASE_START = SEQUENCE_PHASE_END * 0.2;
export const HEADING_PHASE_END = SEQUENCE_PHASE_END;

// Total scroll distance the section pins for, in dynamic-viewport-heights
// (dvh, not vh — recalculates correctly as mobile browser chrome
// shows/hides mid-scroll, unlike vh). Long enough for the three phases to
// read as distinct beats rather than blurring together.
export const SECTION_HEIGHT_DVH = 280;

export const HEADING_COPY =
  "A system's outcome is decided before the first line is written. I make sure I'm the one who saw it coming.";
