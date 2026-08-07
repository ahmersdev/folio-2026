// Three.js/R3F mutates refs every frame by design; this is incompatible
// with the React Compiler's memoization assumptions, so this file opts out.
"use no memo";

import { Fragment } from "react";
import * as THREE from "three";
import { GLOW_COLOR, MAX_FEATHERS } from "./falling-feathers.data";
import { IFallingFeathersProps } from "./falling-feathers.interface";
import useFallingFeathers from "./use-falling-feathers";

export default function FallingFeathers({ spawnQueue }: IFallingFeathersProps) {
  const { setMeshRef, setMaterialRef, setGlowMeshRef, setGlowMaterialRef } =
    useFallingFeathers({ spawnQueue });

  // Geometry and each material's map are assigned imperatively per-spawn
  // (use-falling-feathers.ts) since which of the three feather images a
  // slot gets is randomized fresh each time it's reused. The glow mesh
  // reuses the same geometry/texture as its feather, just scaled up and
  // tinted, so it traces that feather's actual silhouette as a rim glow.
  return (
    <>
      {Array.from({ length: MAX_FEATHERS }, (_, i) => (
        <Fragment key={i}>
          <mesh ref={setGlowMeshRef(i)} visible={false} renderOrder={-1}>
            <meshBasicMaterial
              ref={setGlowMaterialRef(i)}
              color={GLOW_COLOR}
              transparent
              opacity={0}
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh ref={setMeshRef(i)} visible={false}>
            <meshStandardMaterial
              ref={setMaterialRef(i)}
              transparent
              opacity={0}
              depthWrite={false}
              side={THREE.DoubleSide}
              roughness={0.8}
            />
          </mesh>
        </Fragment>
      ))}
    </>
  );
}
