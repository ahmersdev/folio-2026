import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import {
  CLOUD_STYLES,
  DRIFT_BOUNDS,
  DRIFT_SPEEDS,
  POSITION_RANGES,
} from "./atmosphere-clouds.data";
import { randomInRange } from "./atmosphere-clouds.utils";

export default function useAtmosphereClouds() {
  const cloudRefs = useRef<(Group | null)[]>([]);

  // Randomized once per mount (empty deps) so the cloud layout differs each
  // page load without reshuffling on every re-render.
  /* eslint-disable react-hooks/purity */
  const clouds = useMemo(
    () =>
      CLOUD_STYLES.map((style, i) => {
        const range = POSITION_RANGES[i];
        return {
          ...style,
          seed: Math.random() * 1000,
          position: [
            randomInRange(range.x),
            randomInRange(range.y),
            randomInRange(range.z),
          ] as [number, number, number],
        };
      }),
    [],
  );
  /* eslint-enable react-hooks/purity */

  // Each cloud drifts sideways and wraps back to the opposite edge once it
  // crosses DRIFT_BOUNDS, so it keeps cycling through view indefinitely
  // instead of drifting off and only returning after a very slow full
  // rotation of the whole scene.
  useFrame((_, delta) => {
    cloudRefs.current.forEach((instance, i) => {
      if (!instance) return;
      instance.position.x += DRIFT_SPEEDS[i] * delta;
      if (instance.position.x > DRIFT_BOUNDS.max) {
        instance.position.x = DRIFT_BOUNDS.min;
      }
    });
  });

  function setCloudRef(index: number) {
    return (instance: Group | null) => {
      cloudRefs.current[index] = instance;
    };
  }

  return { clouds, setCloudRef };
}
