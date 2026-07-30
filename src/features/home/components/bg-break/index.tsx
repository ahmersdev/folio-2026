"use client";

import { useGLTF } from "@react-three/drei";

useGLTF.preload("/models/hero-bg-break.glb");

export default function BgBreak() {
  const { scene } = useGLTF("/models/hero-bg-break.glb");

  return (
    <primitive
      object={scene}
      position={[0, -4.3, 0]}
      scale={[1, 1.4, 1]}
      castShadow
      receiveShadow
    />
  );
}
