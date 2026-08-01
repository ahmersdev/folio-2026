import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Raycaster,
  Vector2,
  type MeshStandardMaterial,
  type Object3D,
  type Texture,
} from "three";
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
  HOVER_LIFT_UP_DURATION_S,
  HOVER_LIFT_DOWN_DURATION_S,
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
  stepHoverValue,
  prefersReducedMotion,
} from "./bg-break.utils";
import { TActiveLift, TRestPosition, THoverAnim } from "./bg-break.interface";

useGLTF.preload(BG_BREAK_GLB_PATH);

export default function useBgBreak() {
  const { scene, nodes, materials } = useGLTF(BG_BREAK_GLB_PATH);
  const { gl, camera } = useThree();

  const restPositions = useMemo(() => {
    const rest: TRestPosition[] = [];
    for (let i = 0; i < FRAGMENT_COUNT; i++) {
      const node = nodes[`${FRAGMENT_NAME_PREFIX}${i}`];
      rest.push({ y: node?.position.y ?? 0 });
    }
    return rest;
  }, [nodes]);

  // Map each Object3D mesh to its fragment index without mutating the GLTF nodes
  const { fragmentMeshes, meshIndexMap } = useMemo(() => {
    const arr: Object3D[] = [];
    const map = new Map<Object3D, number>();
    for (let i = 0; i < FRAGMENT_COUNT; i++) {
      const node = nodes[`${FRAGMENT_NAME_PREFIX}${i}`];
      if (node) {
        arr.push(node);
        map.set(node, i);
      }
    }
    return { fragmentMeshes: arr, meshIndexMap: map };
  }, [nodes]);

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

  const hoverAnimations = useRef<Map<number, THoverAnim>>(new Map());
  const hoveredIndexRef = useRef<number | null>(null);
  // Non-null while a touch point is actively toggled on — while set, the
  // automatic per-frame raycast is bypassed so a finger lifting off doesn't
  // leave a stale pointer position registering as "still hovering".
  const touchLockedIndexRef = useRef<number | null>(null);
  const pointerInsideRef = useRef(true);

  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    if (reducedMotion) return;
    const el = gl.domElement;
    const raycaster = new Raycaster();
    const ndc = new Vector2(); // Create a reusable Vector2 instance

    const handlePointerLeave = () => {
      pointerInsideRef.current = false;
    };
    const handlePointerEnter = () => {
      pointerInsideRef.current = true;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;

      const rect = el.getBoundingClientRect();

      // Set x and y directly on the Vector2 instance
      ndc.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );

      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(fragmentMeshes, false);
      const hitMesh = hits.length > 0 ? hits[0].object : null;
      const hitIndex = hitMesh ? (meshIndexMap.get(hitMesh) ?? null) : null;

      touchLockedIndexRef.current =
        touchLockedIndexRef.current === hitIndex ? null : hitIndex;
    };

    el.addEventListener("pointerleave", handlePointerLeave);
    el.addEventListener("pointerenter", handlePointerEnter);
    el.addEventListener("pointerdown", handlePointerDown);
    return () => {
      el.removeEventListener("pointerleave", handlePointerLeave);
      el.removeEventListener("pointerenter", handlePointerEnter);
      el.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [gl, camera, fragmentMeshes, meshIndexMap, reducedMotion]);

  /* eslint-disable react-hooks/immutability */
  useFrame((state, delta) => {
    if (reducedMotion) return;

    const elapsed = state.clock.elapsedTime;

    for (const texture of lavaTextures) {
      texture.offset.x += delta * LAVA_FLOW_SPEED_X;
      texture.offset.y += delta * LAVA_FLOW_SPEED_Y;
    }

    // ---- ambient scheduler ----
    if (nextSpawnAt.current === null) {
      nextSpawnAt.current =
        elapsed + randomInRange(MIN_SPAWN_INTERVAL_S, MAX_SPAWN_INTERVAL_S);
    }

    if (elapsed >= nextSpawnAt.current) {
      if (activeLifts.current.length < MAX_CONCURRENT_LIFTS) {
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
      }

      nextSpawnAt.current =
        elapsed + randomInRange(MIN_SPAWN_INTERVAL_S, MAX_SPAWN_INTERVAL_S);
    }

    // ---- ambient lift step (writes rest-reset immediately when done) ----
    const ambientOffsets = new Map<number, number>();
    if (activeLifts.current.length > 0) {
      const stillActive: TActiveLift[] = [];
      for (const lift of activeLifts.current) {
        const node = nodes[`${FRAGMENT_NAME_PREFIX}${lift.fragmentIndex}`];
        const rest = restPositions[lift.fragmentIndex];
        const { offset, done } = getLiftOffset(elapsed - lift.startTime, {
          up: LIFT_UP_DURATION_S,
          hold: LIFT_HOLD_DURATION_S,
          down: LIFT_DOWN_DURATION_S,
        });

        if (done) {
          if (node) node.position.y = rest.y;
          activeIndices.current.delete(lift.fragmentIndex);
        } else {
          ambientOffsets.set(lift.fragmentIndex, offset * lift.direction);
          stillActive.push(lift);
        }
      }
      activeLifts.current = stillActive;
    }

    // ---- hover / tap raycast ----
    let overIndex: number | null;
    if (touchLockedIndexRef.current !== null) {
      overIndex = touchLockedIndexRef.current;
    } else if (!pointerInsideRef.current) {
      overIndex = null;
    } else {
      state.raycaster.setFromCamera(state.pointer, state.camera);
      const hits =
        fragmentMeshes.length > 0
          ? state.raycaster.intersectObjects(fragmentMeshes, false)
          : [];
      const hitMesh = hits.length > 0 ? hits[0].object : null;
      overIndex = hitMesh ? (meshIndexMap.get(hitMesh) ?? null) : null;
    }

    if (overIndex !== hoveredIndexRef.current) {
      if (hoveredIndexRef.current !== null) {
        const prev = hoverAnimations.current.get(hoveredIndexRef.current);
        if (prev) prev.target = 0;
      }
      if (overIndex !== null) {
        const existing = hoverAnimations.current.get(overIndex);
        if (existing) {
          existing.target = 1;
        } else {
          hoverAnimations.current.set(overIndex, { value: 0, target: 1 });
        }
      }
      hoveredIndexRef.current = overIndex;
    }

    // ---- apply combined offsets for every fragment touched this frame ----
    const touched = new Set<number>([
      ...ambientOffsets.keys(),
      ...hoverAnimations.current.keys(),
    ]);

    for (const index of touched) {
      const anim = hoverAnimations.current.get(index);
      if (anim) {
        anim.value = stepHoverValue(
          anim.value,
          anim.target,
          delta,
          HOVER_LIFT_UP_DURATION_S,
          HOVER_LIFT_DOWN_DURATION_S,
        );
      }

      const node = nodes[`${FRAGMENT_NAME_PREFIX}${index}`];
      const rest = restPositions[index];
      if (!node) continue;

      const ambientSigned = ambientOffsets.get(index) ?? 0;
      const hoverSigned = anim?.value ?? 0; // hover is always upward (+1)
      const combined =
        Math.abs(hoverSigned) >= Math.abs(ambientSigned)
          ? hoverSigned
          : ambientSigned;

      node.position.y = rest.y + combined * LIFT_HEIGHT_UNITS;

      if (anim && anim.target === 0 && anim.value === 0) {
        hoverAnimations.current.delete(index);
      }
    }
  });
  /* eslint-enable react-hooks/immutability */

  return { scene };
}
