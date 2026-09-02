import { TRange } from "./falling-feathers.interface";

// Tuning for the falling-feather effect: a crow occasionally sheds a single
// feather mid-flight, which flutters down and toward the camera before
// fading out. Values here favor rarity and legibility — the goal is a
// noticeable one-off event, not ambient particles.

// Pool size. Headroom for overlap between an old feather's fade-out and a
// new shed, not a target count — typically 0-1 are visible at once.
export const MAX_FEATHERS = 4;

// Terminal fall speed, world units/second.
export const FALL_SPEED: TRange = [0.55, 0.85];

// Primary side-to-side rocking frequency and amplitude. This sine also
// drives horizontal drift (see use-falling-feathers.ts) so the feather
// slides the way it's tilting, rather than tilting and drifting
// independently.
export const SWAY_FREQ: TRange = [0.55, 1.0];
export const SWAY_AMP: TRange = [0.45, 0.8];

// Second sway sine, deliberately a non-integer ratio of the first so the
// combined motion doesn't repeat on a short, obvious cycle.
export const SWAY_SECONDARY_RATIO = 0.37;

// Max rock rotation (rotation.z), radians.
export const ROCK_MAX = 0.7;

// Slow tumble around the long axis — the feather "turning over" as it falls.
export const SPIN_SPEED: TRange = [0.3, 0.8];

// Drift toward the camera (+Z). This is the main legibility lever: a
// feather shed at crow depth (z ~ -1.5..1.5) is a speck at real-world
// scale, so it's deliberately drifted forward and grows larger as it
// approaches the camera at z=5.
export const DRIFT_Z: TRange = [0.12, 0.25];

// Constant horizontal breeze, same sign as the clouds' DRIFT_SPEEDS
// (atmosphere-clouds.data.ts) so the whole scene reads as one wind.
export const WIND_X = 0.18;

// Seconds for the crow's shed velocity to bleed out of the feather's
// motion.
export const IMPULSE_DECAY = 1.2;

// Opacity envelope, seconds. Fade-out is measured as distance-to-floor
// divided by (fallSpeed * FADE_OUT), so it naturally completes right as the
// feather reaches DESPAWN_Y regardless of that feather's randomized speed.
export const FADE_IN = 0.4;
export const FADE_OUT = 1.5;

// Slot is released once it falls below this Y. MAX_LIFETIME is a safety
// ceiling only (e.g. a feather whose drift carries it somewhere odd) — it
// also fades out on approach so a ceiling-triggered despawn never pops.
export const DESPAWN_Y = -5.5;
export const MAX_LIFETIME = 16;

// World-unit height of a spawned feather; width is derived per-image from
// its own aspect ratio so none of the three source images gets stretched.
export const FEATHER_HEIGHT = 0.26;

// Rim glow tracing each feather's own silhouette, in the site's primary
// brand color. Built from a copy of the feather's own alpha-cut texture
// scaled up slightly and tinted — the sliver of margin outside the real
// feather's edge is what reads as a glowing border, so this stays close to
// 1 (a small excess, not a generic halo).
export const GLOW_SCALE = 1.15;

// Max glow opacity, applied on top of the feather's own fade envelope
// (material.opacity). Additive blending amplifies perceived brightness, so
// this is kept under 1.
export const GLOW_OPACITY = 0.85;

// Matches --primary in globals.css. Hardcoded like the scene's other
// three.js colors (e.g. the crow rim light) since WebGL can't read CSS
// custom properties.
export const GLOW_COLOR = "#c22436";

// Push behind the feather along camera-relative Z so the transparent
// render pass doesn't flip-flop draw order between the glow and the
// feather when they sit at (nearly) the same position.
export const GLOW_Z_OFFSET = 0.01;
