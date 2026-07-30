"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import EyeMesh from "../eye-mesh";
import AtmosphereClouds from "../atmosphere-clouds";
import BgBreak from "../bg-break";
import useRedMoonScene from "./use-red-moon-scene";

export default function RedMoonScene() {
  const { handlePointerMove, handlePointerLeave, pointer } = useRedMoonScene();

  return (
    <div
      className="h-screen w-full bg-black"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 60 }}>
        <ambientLight intensity={0.35} color="#ff2b2b" />
        <directionalLight
          intensity={2.0}
          color="#ff0000"
          position={[0, 5, 2]}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        {/* dim neutral fill so unlit rock faces aren't pure black */}
        <directionalLight
          intensity={0.25}
          color="#8a8a9a"
          position={[-4, 2, -3]}
        />

        <group position={[0, 1, 0]}>
          <EyeMesh pointer={pointer} />
        </group>

        <Suspense fallback={null}>
          <AtmosphereClouds />
          <BgBreak />
        </Suspense>
      </Canvas>
    </div>
  );
}
