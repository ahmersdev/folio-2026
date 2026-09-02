import { TFeatherSpawn } from "../falling-feathers/falling-feathers.interface";

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
  onShed?: (spawn: TFeatherSpawn) => void;
}
