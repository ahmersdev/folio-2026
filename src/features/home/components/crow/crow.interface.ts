export type TFlightConfig = {
  start: [number, number, number];
  end: [number, number, number];
  duration: number;
  scale: number;
  flapSpeed: number;
  flapAmplitude: number;
  undulationAmplitude: number;
  undulationCycles: number;
  // 0-1 starting point along the path, so multiple crows don't all enter
  // at the same moment.
  phaseOffset: number;
};

export interface ICrowProps {
  config: TFlightConfig;
}
