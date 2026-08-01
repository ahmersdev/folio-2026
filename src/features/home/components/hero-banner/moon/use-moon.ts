"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { ROTATION_SPEED } from "./moon.data";

const MOON_GLB_PATH = "/models/moon.glb";

useGLTF.preload(MOON_GLB_PATH);

export default function useMoon() {
  const { scene } = useGLTF(MOON_GLB_PATH);
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * ROTATION_SPEED;
  });

  return { group, scene };
}
