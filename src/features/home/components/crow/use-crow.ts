"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ICrowProps } from "./crow.interface";

const CROW_GLB_PATH = "/models/crow.glb";

useGLTF.preload(CROW_GLB_PATH);

// How far back along the path (in progress units) to look for orientation.
const LOOKBEHIND = 0.01;

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
  const progress = useRef(config.phaseOffset);
  const behind = useMemo(() => new THREE.Vector3(), []);

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
    progress.current += delta / config.duration;
    if (progress.current > 1) progress.current -= 1;

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

  return { group, wingL, wingR, crowBody, wingLMesh, wingRMesh };
}
