export const BG_BREAK_GLB_PATH = "/models/hero-bg-break.glb";

export const FRAGMENT_COUNT = 200;
export const FRAGMENT_NAME_PREFIX = "Slab_frag_";

// Scheduler: after a random gap, wake a small batch of fragments.
export const MIN_SPAWN_INTERVAL_S = 2;
export const MAX_SPAWN_INTERVAL_S = 10;

// How many fragments join per spawn batch, and the hard ceiling on
// concurrently-animating fragments out of 200 total, so the effect stays a
// subtle ambient flicker rather than a visible wave.
export const MIN_BATCH_SIZE = 1;
export const MAX_BATCH_SIZE = 3;
export const MAX_CONCURRENT_LIFTS = 5;

// Lift height in world units, not a pixel value — "a couple pixels" of
// screen displacement depends on camera FOV/distance and isn't practically
// convertible to an exact figure. Tune visually against the running scene.
export const LIFT_HEIGHT_UNITS = 0.1;

// Ease in on the lift, brief hold at the peak, slower ease-out to settle —
// reads as something shifting and resettling rather than a twitch.
export const LIFT_UP_DURATION_S = 0.6;
export const LIFT_HOLD_DURATION_S = 2;
export const LIFT_DOWN_DURATION_S = 2;
