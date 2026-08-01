"use client";

import { EyeMesh, ThemeToggle } from "./components";
import useHome from "./use-home";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  const { handlePointerMove, handlePointerLeave, pointer } = useHome();

  return (
    <div
      className="w-full bg-background p-4 flex flex-col items-center justify-center gap-10"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <ThemeToggle />
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
      </Canvas>
    </div>
  );
}
