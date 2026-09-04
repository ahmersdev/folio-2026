// Reverse-engineered from the reference site's compiled interactions config:
// both text copies split into chars and animate concurrently (position 0),
// each char translating to yPercent -100, with a per-copy stagger spread of
// 0.2s (outgoing copy) / 0.3s (incoming copy) — those two numbers matched
// the reference exactly. duration/ease weren't recoverable from the bundle
// (no explicit duration; ease was a numeric preset id with no lookup table
// in the fetched JS), so these are starting points to tune by eye.
export const CHAR_DURATION_S = 0.3;
export const EXIT_STAGGER_AMOUNT_S = 0.2;
export const ENTER_STAGGER_AMOUNT_S = 0.3;
export const EASE = "power2.out";

// Matches the h-5/leading-5 line height on the two text spans in
// nav-link/index.tsx. Used as an absolute px offset (not yPercent) because
// SplitText's per-char mask sizes each char to its own glyph box, not the
// parent's line-height — yPercent:-100 on a char only moves it by that
// smaller glyph height, so text1 never fully clears the mask and text2
// never lands exactly in the visible slot. A fixed 20px offset moves both
// by exactly one line, however tall the glyphs themselves are.
export const LINE_HEIGHT_PX = 20;
