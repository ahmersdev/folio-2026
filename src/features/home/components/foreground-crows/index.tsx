import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { FLIGHT_CONFIGS } from "./foreground-crows.data";
import Crow from "../crow";

export default function ForegroundCrows() {
  return (
    <div className="pointer-events-none absolute inset-0 h-screen w-full">
      <Canvas
        shadows
        camera={{ position: [0, 1, 5], fov: 60 }}
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} color="#ff2b2b" />
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight
          intensity={1.5}
          color="#ffffff"
          position={[-4, 2, -3]}
        />

        <Suspense fallback={null}>
          {FLIGHT_CONFIGS.map((config, i) => (
            <Crow key={i} config={config} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
