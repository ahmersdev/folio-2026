"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Moon from "../moon";
import AtmosphereClouds from "../atmosphere-clouds";
import BgBreak from "../bg-break";
import Crow from "../crow";
import { FLIGHT_CONFIGS } from "../crow/crow.data";

export default function RedMoonScene() {
  return (
    <div className="h-screen w-full bg-black">
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 60 }}>
        <ambientLight intensity={0.3} color="#ff2b2b" />
        <ambientLight intensity={1.5} color="#ffffff" />
        {/* neutral fill, brightened while checking baked colors */}
        <directionalLight
          intensity={1.5}
          color="#ffffff"
          position={[-4, 2, -3]}
        />

        <Suspense fallback={null}>
          <group position={[0, 1, 0]}>
            <Moon />
          </group>

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
