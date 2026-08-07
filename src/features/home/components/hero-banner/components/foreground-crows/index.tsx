import { Suspense, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { FLIGHT_CONFIGS } from "./foreground-crows.data";
import Crow from "../crow";
import FallingFeathers from "../falling-feathers";
import { TFeatherSpawn } from "../falling-feathers/falling-feathers.interface";

export default function ForegroundCrows() {
  const spawnQueue = useRef<TFeatherSpawn[]>([]);
  const handleShed = useCallback((spawn: TFeatherSpawn) => {
    spawnQueue.current.push(spawn);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 h-screen w-full">
      <Canvas
        shadows
        camera={{ position: [0, 1, 5], fov: 60 }}
        gl={{ alpha: true }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <ambientLight intensity={1} color="#ffffff" />
        <directionalLight
          intensity={2}
          color="#ff2b2b"
          position={[0, 4, -10]}
        />

        <Suspense fallback={null}>
          {FLIGHT_CONFIGS.map((config, i) => (
            <Crow key={i} config={config} onShed={handleShed} />
          ))}
          <FallingFeathers spawnQueue={spawnQueue} />
        </Suspense>
      </Canvas>
    </div>
  );
}
