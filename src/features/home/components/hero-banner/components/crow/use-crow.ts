import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ICrowProps } from "./crow.interface";

const CROW_GLB_PATH = "/models/crow.glb";

useGLTF.preload(CROW_GLB_PATH);

// How far back along the path (in progress units) to look for orientation.
const LOOKBEHIND = 0.01;

// Seconds before a crow's very first flight, randomized so crows don't all
// enter together.
const INITIAL_ENTRY_DELAY_MAX = 10;
// Seconds a crow waits off-screen between one exit and the next entry.
const REENTRY_DELAY_MIN = 10;
const REENTRY_DELAY_MAX = 30;

export default function useCrow({ config }: ICrowProps) {
  const { nodes } = useGLTF(CROW_GLB_PATH);

  // useGLTF caches and returns the same node objects for every instance;
  // since a three.js object can only have one parent at a time, rendering
  // those shared nodes directly would make all but the last crow invisible.
  // Clone once per instance — a plain clone is fine, there's no skeleton.
  const crowBody = useMemo(() => nodes.CrowBody.clone(), [nodes]);
  const wingLMesh = useMemo(() => nodes.WingL.clone(), [nodes]);
  const wingRMesh = useMemo(() => nodes.WingR.clone(), [nodes]);

  const group = useRef<THREE.Group>(null);
  const wingL = useRef<THREE.Object3D>(null);
  const wingR = useRef<THREE.Object3D>(null);
  const progress = useRef(0);
  const behind = useMemo(() => new THREE.Vector3(), []);

  const [visible, setVisible] = useState(false);
  const phase = useRef<"waiting" | "flying">("waiting");
  // Seeded lazily on the first useFrame call rather than here, since
  // Math.random() during render is impure and the compiler flags it.
  const timer = useRef<number | null>(null);

  function positionAt(p: number, out: THREE.Vector3) {
    out.set(
      THREE.MathUtils.lerp(config.start[0], config.end[0], p),
      THREE.MathUtils.lerp(config.start[1], config.end[1], p) +
        Math.sin(p * Math.PI * config.undulationCycles) *
          config.undulationAmplitude,
      THREE.MathUtils.lerp(config.start[2], config.end[2], p),
    );
    return out;
  }

  useFrame((state, delta) => {
    if (timer.current === null) {
      timer.current = Math.random() * INITIAL_ENTRY_DELAY_MAX;
    }

    if (phase.current === "waiting") {
      timer.current -= delta;
      if (timer.current > 0) return;
      phase.current = "flying";
      progress.current = 0;
      setVisible(true);
    }

    progress.current += delta / config.duration;
    if (progress.current >= 1) {
      phase.current = "waiting";
      timer.current =
        REENTRY_DELAY_MIN +
        Math.random() * (REENTRY_DELAY_MAX - REENTRY_DELAY_MIN);
      setVisible(false);
      return;
    }

    if (group.current) {
      positionAt(progress.current, group.current.position);
      // crow.glb's face points toward local +Z, the opposite of three.js's
      // -Z lookAt convention, so aim at a point just behind on the path
      // instead of ahead — that leaves the face pointing forward.
      positionAt(progress.current - LOOKBEHIND, behind);
      group.current.lookAt(behind);
    }

    const flap =
      Math.sin(state.clock.elapsedTime * config.flapSpeed) *
      config.flapAmplitude;
    if (wingL.current) wingL.current.rotation.z = flap;
    if (wingR.current) wingR.current.rotation.z = -flap;
  });

  return { group, wingL, wingR, crowBody, wingLMesh, wingRMesh, visible };
}
