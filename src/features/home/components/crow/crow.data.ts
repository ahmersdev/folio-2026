import { TFlightConfig } from "./crow.interface";

// Three independent flight configs — varied paths, depths, speeds, and
// staggered phase offsets so multiple crows don't look like synchronized
// clones. Each is a roughly horizontal glide (not a steep corner-to-corner
// dive), placed just outside the camera frustum horizontally so it doesn't
// visibly pop in/out at the screen edges.
export const FLIGHT_CONFIGS: TFlightConfig[] = [
  {
    start: [-9, 3.4, -1.5],
    end: [9, 2.6, -0.8],
    duration: 7,
    scale: 0.8,
    flapSpeed: 10,
    flapAmplitude: 0.6,
    undulationAmplitude: 0.35,
    undulationCycles: 3,
    phaseOffset: 0,
  },
  {
    start: [-9, 2.0, 0.6],
    end: [9, 1.4, 1.2],
    duration: 9,
    scale: 0.6,
    flapSpeed: 8,
    flapAmplitude: 0.5,
    undulationAmplitude: 0.3,
    undulationCycles: 2,
    phaseOffset: 0.35,
  },
  {
    // Rising diagonal instead of a horizontal glide: enters low near the
    // bottom-left (around 70% down the screen), climbs up past the middle
    // of the frame, and keeps rising to exit off the top — like taking
    // flight from the ground rather than crossing the sky.
    start: [-5, -1.7, 1],
    end: [2, 4.2, 0],
    duration: 3,
    scale: 0.7,
    flapSpeed: 11,
    flapAmplitude: 0.55,
    undulationAmplitude: 0.3,
    undulationCycles: 3,
    phaseOffset: 0.5,
  },
];
