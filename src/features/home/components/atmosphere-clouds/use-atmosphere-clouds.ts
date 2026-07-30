import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { CLOUD_STYLES, POSITION_RANGES } from "./atmosphere-clouds.data";
import { randomInRange } from "./atmosphere-clouds.utils";

export default function useAtmosphereClouds() {
  const group = useRef<Group>(null);

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

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.015;
  });

  return { group, clouds };
}
