import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Moon from "../moon";
import AtmosphereClouds from "../atmosphere-clouds";
import BgBreak from "../bg-break";

export default function BackgroundScene() {
  return (
    <div className="absolute inset-0 h-screen w-full bg-black">
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
          {/* Pushed back past AtmosphereClouds' farthest range (z: -19)
              so the moon renders behind the clouds instead of in front. */}
          <group position={[0, 1, -24]}>
            <Moon />
          </group>

          <AtmosphereClouds />
          <BgBreak />
        </Suspense>
      </Canvas>
    </div>
  );
}
