// moon.glb is a unit-radius sphere (radius 1); scaled up to roughly match
// the eye mesh's prior visual footprint (icosahedron radius 1.15).
export const SCALE = 1.2;

// Slow constant self-rotation instead of the eye's pointer-tracking tilt —
// a moon doesn't follow the cursor, but a gentle spin keeps it feeling alive
// and gradually reveals more of the crater texture over time.
export const ROTATION_SPEED = 0.05;
