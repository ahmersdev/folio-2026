// Flat --primary tint painted over the footage, on top of everything else
// (canvas + the scroll-driven glow below). A plain DOM element, unlike the
// canvas, so it reads --primary directly instead of needing a hardcoded
// hex. Tune this value directly to taste.
export const PRIMARY_TINT_OPACITY = 0.2;

// On narrow/tall canvases (portrait phones), a pure "cover" fit crops the
// (16:9) source's width down tight to fully cover height — this floors how
// far that crop is allowed to go: at least this fraction of the source's
// width always stays visible, trading a full vertical cover for keeping
// the composition recognizable instead of zooming into a sliver of it.
// Canvases wider than the source (crops height instead) are unaffected —
// see drawForeground in use-sharingan-sequence.ts.
export const MIN_VISIBLE_WIDTH_FRACTION = 1;

// Blur radius (px) applied to the full-height background layer that shows
// through in the foreground's letterbox gaps — see drawBackground in
// use-sharingan-sequence.ts. Tune directly to taste.
export const BACKDROP_BLUR_PX = 15;

// Black overlay opacity painted over the blurred background layer, on top
// of the blur, so it reads as a receded backdrop rather than a second sharp
// image competing with the foreground. Tune directly to taste.
export const BACKDROP_OVERLAY_OPACITY = 0.6;
