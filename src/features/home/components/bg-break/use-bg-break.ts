"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { MeshStandardMaterial, Texture } from "three";
import {
  BG_BREAK_GLB_PATH,
  FRAGMENT_COUNT,
  FRAGMENT_NAME_PREFIX,
  MIN_SPAWN_INTERVAL_S,
  MAX_SPAWN_INTERVAL_S,
  MIN_BATCH_SIZE,
  MAX_BATCH_SIZE,
  MAX_CONCURRENT_LIFTS,
  LIFT_HEIGHT_UNITS,
  LIFT_UP_DURATION_S,
  LIFT_HOLD_DURATION_S,
  LIFT_DOWN_DURATION_S,
  LAVA_MATERIAL_NAME,
  LAVA_FLOW_SPEED_X,
  LAVA_FLOW_SPEED_Y,
} from "./bg-break.data";
import {
  randomInRange,
  randomInt,
  pickRandomDirection,
  pickUnusedFragmentIndices,
  getLiftOffset,
  prefersReducedMotion,
} from "./bg-break.utils";
import { TActiveLift, TRestPosition } from "./bg-break.interface";

useGLTF.preload(BG_BREAK_GLB_PATH);

export default function useBgBreak() {
  const { scene, nodes, materials } = useGLTF(BG_BREAK_GLB_PATH);

  // Snapshot each fragment's authored rest Y position once, so lifts animate
  // relative to it instead of overwriting position with an assumed zero pose.
  const restPositions = useMemo(() => {
    const rest: TRestPosition[] = [];
    for (let i = 0; i < FRAGMENT_COUNT; i++) {
      const node = nodes[`${FRAGMENT_NAME_PREFIX}${i}`];
      rest.push({ y: node?.position.y ?? 0 });
    }
    return rest;
  }, [nodes]);

  // LavaBase's material carries real base color/normal/emissive maps, so
  // "flowing" is done by scrolling their UVs — every mapped texture needs to
  // move together, or the diffuse pattern drifts out of sync with the
  // normal/emissive detail.
  const lavaTextures = useMemo(() => {
    const material = materials[LAVA_MATERIAL_NAME] as
      | MeshStandardMaterial
      | undefined;
    if (!material) return [];
    return [material.map, material.normalMap, material.emissiveMap].filter(
      (texture): texture is Texture => Boolean(texture),
    );
  }, [materials]);

  const activeLifts = useRef<TActiveLift[]>([]);
  const activeIndices = useRef<Set<number>>(new Set());
  const nextSpawnAt = useRef<number | null>(null);

  // Read once at mount — this is a decorative ambient effect, not a setting
  // users toggle mid-session, so a live matchMedia listener would be overkill.
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  // R3F mutates refs and three.js objects every frame by design; the React
  // Compiler's static immutability analysis doesn't model this pattern.
  /* eslint-disable react-hooks/immutability */
  useFrame((state, delta) => {
    if (reducedMotion) return;

    const elapsed = state.clock.elapsedTime;

    for (const texture of lavaTextures) {
      texture.offset.x += delta * LAVA_FLOW_SPEED_X;
      texture.offset.y += delta * LAVA_FLOW_SPEED_Y;
    }

    if (nextSpawnAt.current === null) {
      nextSpawnAt.current =
        elapsed + randomInRange(MIN_SPAWN_INTERVAL_S, MAX_SPAWN_INTERVAL_S);
    }

    if (
      elapsed >= nextSpawnAt.current &&
      activeLifts.current.length < MAX_CONCURRENT_LIFTS
    ) {
      const room = MAX_CONCURRENT_LIFTS - activeLifts.current.length;
      const batchSize = Math.min(
        room,
        randomInt(MIN_BATCH_SIZE, MAX_BATCH_SIZE),
      );
      const chosen = pickUnusedFragmentIndices(
        batchSize,
        activeIndices.current,
        FRAGMENT_COUNT,
      );

      for (const fragmentIndex of chosen) {
        activeLifts.current.push({
          fragmentIndex,
          direction: pickRandomDirection(),
          startTime: elapsed,
        });
        activeIndices.current.add(fragmentIndex);
      }

      nextSpawnAt.current =
        elapsed + randomInRange(MIN_SPAWN_INTERVAL_S, MAX_SPAWN_INTERVAL_S);
    }

    if (activeLifts.current.length === 0) return;

    const stillActive: TActiveLift[] = [];
    for (const lift of activeLifts.current) {
      const node = nodes[`${FRAGMENT_NAME_PREFIX}${lift.fragmentIndex}`];
      const rest = restPositions[lift.fragmentIndex];
      const { offset, done } = getLiftOffset(elapsed - lift.startTime, {
        up: LIFT_UP_DURATION_S,
        hold: LIFT_HOLD_DURATION_S,
        down: LIFT_DOWN_DURATION_S,
      });

      if (node) {
        node.position.y = rest.y + offset * LIFT_HEIGHT_UNITS * lift.direction;
      }

      if (done) {
        if (node) node.position.y = rest.y;
        activeIndices.current.delete(lift.fragmentIndex);
      } else {
        stillActive.push(lift);
      }
    }
    activeLifts.current = stillActive;
  });
  /* eslint-enable react-hooks/immutability */

  return { scene };
}
