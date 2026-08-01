import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  DESPAWN_Y,
  DRIFT_Z,
  FADE_IN,
  FADE_OUT,
  FALL_SPEED,
  IMPULSE_DECAY,
  MAX_FEATHERS,
  MAX_LIFETIME,
  ROCK_MAX,
  SPIN_SPEED,
  SWAY_AMP,
  SWAY_FREQ,
  SWAY_SECONDARY_RATIO,
  WIND_X,
} from "./falling-feathers.data";
import {
  IFallingFeathersProps,
  TFeatherSlot,
} from "./falling-feathers.interface";
import {
  createFeatherGeometry,
  createFeatherTexture,
  prefersReducedMotion,
  randomInRange,
} from "./falling-feathers.utils";

function createSlot(): TFeatherSlot {
  return {
    active: false,
    age: 0,
    fallSpeed: 0,
    swayFreq: 0,
    swayAmp: 0,
    swayPhase: 0,
    swayPhase2: 0,
    spinSpeed: 0,
    driftZ: 0,
    impulse: new THREE.Vector3(),
  };
}

export default function useFallingFeathers({
  spawnQueue,
}: IFallingFeathersProps) {
  // One-shot check (no matchMedia change listener), matching the pattern in
  // bg-break.utils.ts's prefersReducedMotion.
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  const geometry = useMemo(() => createFeatherGeometry(), []);
  const texture = useMemo(() => createFeatherTexture(), []);

  const slots = useRef<TFeatherSlot[]>(
    Array.from({ length: MAX_FEATHERS }, createSlot),
  );
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const materialRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  function setMeshRef(index: number) {
    return (instance: THREE.Mesh | null) => {
      meshRefs.current[index] = instance;
    };
  }

  function setMaterialRef(index: number) {
    return (instance: THREE.MeshStandardMaterial | null) => {
      materialRefs.current[index] = instance;
    };
  }

  useFrame((_, delta) => {
    if (reducedMotion) return;

    // Drain pending sheds from the crows and claim a free slot for each.
    const queue = spawnQueue.current;
    if (queue.length > 0) {
      const pending = queue.splice(0, queue.length);
      for (const spawn of pending) {
        const index = slots.current.findIndex((slot) => !slot.active);
        if (index === -1) continue; // pool full, drop this shed

        const slot = slots.current[index];
        slot.active = true;
        slot.age = 0;
        slot.fallSpeed = randomInRange(FALL_SPEED);
        slot.swayFreq = randomInRange(SWAY_FREQ);
        slot.swayAmp = randomInRange(SWAY_AMP);
        slot.swayPhase = Math.random() * Math.PI * 2;
        slot.swayPhase2 = Math.random() * Math.PI * 2;
        slot.spinSpeed = randomInRange(SPIN_SPEED);
        slot.driftZ = randomInRange(DRIFT_Z);
        slot.impulse.copy(spawn.velocity);

        const mesh = meshRefs.current[index];
        if (mesh) {
          mesh.position.copy(spawn.position);
          mesh.rotation.set(0, Math.random() * Math.PI * 2, 0);
          mesh.visible = true;
        }
        const material = materialRefs.current[index];
        if (material) material.opacity = 0;
      }
    }

    // Advance every active slot.
    slots.current.forEach((slot, index) => {
      if (!slot.active) return;

      const mesh = meshRefs.current[index];
      const material = materialRefs.current[index];
      if (!mesh || !material) return;

      slot.age += delta;

      const sway = Math.sin(slot.age * slot.swayFreq + slot.swayPhase);
      const sway2 = Math.sin(
        slot.age * slot.swayFreq * SWAY_SECONDARY_RATIO + slot.swayPhase2,
      );

      mesh.rotation.z = sway * ROCK_MAX;
      mesh.rotation.x = sway2 * 0.3;
      mesh.rotation.y += slot.spinSpeed * delta;

      // Horizontal motion is driven by the same sines that drive the tilt —
      // that coupling is what makes this read as a feather riding the air
      // rather than a shape falling on a scripted path.
      mesh.position.x +=
        (sway * slot.swayAmp +
          sway2 * slot.swayAmp * 0.4 +
          WIND_X +
          slot.impulse.x) *
        delta;
      mesh.position.y -= (slot.fallSpeed - slot.impulse.y) * delta;
      mesh.position.z += slot.driftZ * delta;

      slot.impulse.multiplyScalar(Math.max(0, 1 - delta / IMPULSE_DECAY));

      // Fade in on age; fade out on proximity to the despawn floor, scaled
      // by this slot's own fall speed so it completes right as the feather
      // reaches DESPAWN_Y regardless of randomized speed. A separate
      // lifetime-based fade covers the MAX_LIFETIME safety ceiling so a
      // stalled feather never just pops out of existence.
      const opacityFromAge = THREE.MathUtils.clamp(slot.age / FADE_IN, 0, 1);
      const fadeOutDistance = slot.fallSpeed * FADE_OUT;
      const opacityFromFloor = THREE.MathUtils.clamp(
        (mesh.position.y - DESPAWN_Y) / fadeOutDistance,
        0,
        1,
      );
      const opacityFromLifetime = THREE.MathUtils.clamp(
        (MAX_LIFETIME - slot.age) / FADE_OUT,
        0,
        1,
      );
      material.opacity = Math.min(
        opacityFromAge,
        opacityFromFloor,
        opacityFromLifetime,
      );

      if (mesh.position.y < DESPAWN_Y || slot.age > MAX_LIFETIME) {
        slot.active = false;
        mesh.visible = false;
      }
    });
  });

  return { geometry, texture, setMeshRef, setMaterialRef };
}
