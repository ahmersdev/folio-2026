"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import EyeMesh from "../eye-mesh";
import AtmosphereClouds from "../atmosphere-clouds";
import BgBreak from "../bg-break";
import Crow from "../crow";
import { FLIGHT_CONFIGS } from "../crow/crow.data";
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
        <ambientLight intensity={0.3} color="#ff2b2b" />
        <ambientLight intensity={1.5} color="#ffffff" />
        {/* neutral fill, brightened while checking baked colors */}
        <directionalLight
          intensity={1.5}
          color="#ffffff"
          position={[-4, 2, -3]}
        />

        <group position={[0, 1, 0]}>
          <EyeMesh pointer={pointer} />
        </group>

        <Suspense fallback={null}>
          <AtmosphereClouds />
          <BgBreak />
          {FLIGHT_CONFIGS.map((config, i) => (
            <Crow key={i} config={config} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
