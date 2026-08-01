// Three.js/R3F mutates refs every frame by design; this is incompatible
// with the React Compiler's memoization assumptions, so this file opts out.
"use no memo";

import * as THREE from "three";
import { FEATHER_COLOR, MAX_FEATHERS } from "./falling-feathers.data";
import { IFallingFeathersProps } from "./falling-feathers.interface";
import useFallingFeathers from "./use-falling-feathers";

export default function FallingFeathers({ spawnQueue }: IFallingFeathersProps) {
  const { geometry, texture, setMeshRef, setMaterialRef } = useFallingFeathers({
    spawnQueue,
  });

  if (!texture) return null;

  return (
    <>
      {Array.from({ length: MAX_FEATHERS }, (_, i) => (
        <mesh key={i} ref={setMeshRef(i)} geometry={geometry} visible={false}>
          <meshStandardMaterial
            ref={setMaterialRef(i)}
            color={FEATHER_COLOR}
            alphaMap={texture}
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
