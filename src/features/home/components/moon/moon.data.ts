// moon.glb is a unit-radius sphere (radius 1); scaled up to roughly match
// the eye mesh's prior visual footprint (icosahedron radius 1.15).
// The moon sits much farther from the camera than that baseline (z: -24 vs
// the camera at z: 5, pushed back so it renders behind the clouds), so this
// is boosted ~5.8x (29/5, the distance ratio) to keep its on-screen size
// matching how it looked before the reorder.
export const SCALE = 6.96;

// Slow constant self-rotation instead of the eye's pointer-tracking tilt —
// a moon doesn't follow the cursor, but a gentle spin keeps it feeling alive
// and gradually reveals more of the crater texture over time.
export const ROTATION_SPEED = 0.05;
