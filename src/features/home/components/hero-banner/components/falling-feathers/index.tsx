// Three.js/R3F mutates refs every frame by design; this is incompatible
// with the React Compiler's memoization assumptions, so this file opts out.
"use no memo";

import * as THREE from "three";
import { MAX_FEATHERS } from "./falling-feathers.data";
import { IFallingFeathersProps } from "./falling-feathers.interface";
import useFallingFeathers from "./use-falling-feathers";

export default function FallingFeathers({ spawnQueue }: IFallingFeathersProps) {
  const { setMeshRef, setMaterialRef } = useFallingFeathers({ spawnQueue });

  // Geometry and the material's map are assigned imperatively per-spawn
  // (use-falling-feathers.ts) since which of the three feather images a
  // slot gets is randomized fresh each time it's reused.
  return (
    <>
      {Array.from({ length: MAX_FEATHERS }, (_, i) => (
        <mesh key={i} ref={setMeshRef(i)} visible={false}>
          <meshStandardMaterial
            ref={setMaterialRef(i)}
            transparent
            opacity={0}
            depthWrite={false}
            side={THREE.DoubleSide}
            roughness={0.8}
          />
        </mesh>
      ))}
    </>
  );
}
