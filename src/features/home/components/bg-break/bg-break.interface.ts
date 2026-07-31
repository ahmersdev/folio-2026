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
