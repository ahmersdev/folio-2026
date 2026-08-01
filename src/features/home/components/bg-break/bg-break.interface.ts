// One in-flight lift cycle for a single fragment.
export type TActiveLift = {
  fragmentIndex: number;
  direction: 1 | -1;
  startTime: number;
};

// Rest-pose Y position captured per fragment at mount, since Cell Fracture
// output bakes a distinct baseline position per shard rather than zero.
export type TRestPosition = { y: number };

export type TLiftPhaseDurations = {
  up: number;
  hold: number;
  down: number;
};

// A live hover/tap lift for one fragment. Unlike TActiveLift, this isn't a
// fire-and-forget scripted cycle — value chases target every frame, so
// reversing mid-transition (mouse enters then immediately leaves) just
// changes the target instead of needing to restart a duration-based cycle.
export type THoverAnim = { value: number; target: 0 | 1 };
