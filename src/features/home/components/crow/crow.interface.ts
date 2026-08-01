export type TFlightConfig = {
  start: [number, number, number];
  end: [number, number, number];
  duration: number;
  scale: number;
  flapSpeed: number;
  flapAmplitude: number;
  undulationAmplitude: number;
  undulationCycles: number;
};

export interface ICrowProps {
  config: TFlightConfig;
}
