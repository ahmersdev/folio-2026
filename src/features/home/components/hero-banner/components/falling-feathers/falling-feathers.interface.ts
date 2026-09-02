import type { RefObject } from "react";
import * as THREE from "three";

export type TRange = [number, number];

export type TFeatherSpawn = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
};

// Mutable per-slot simulation state for one pooled feather. A plain object
// (not a class) so it lives in a ref array without extra allocation
// machinery, matching the ref-driven style used throughout this scene.
export type TFeatherSlot = {
  active: boolean;
  age: number;
  fallSpeed: number;
  swayFreq: number;
  swayAmp: number;
  swayPhase: number;
  swayPhase2: number;
  spinSpeed: number;
  driftZ: number;
  impulse: THREE.Vector3;
};

export interface IFallingFeathersProps {
  spawnQueue: RefObject<TFeatherSpawn[]>;
}
