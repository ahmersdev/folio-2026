"use client";
// Three.js/R3F mutates refs every frame by design; this is incompatible
// with the React Compiler's memoization assumptions, so this file opts out.
"use no memo";

import { ICrowProps } from "./crow.interface";
import useCrow from "./use-crow";

export default function Crow({ config }: ICrowProps) {
  const { group, wingL, wingR, crowBody, wingLMesh, wingRMesh } = useCrow({
    config,
  });

  return (
    <group ref={group} scale={config.scale}>
      <primitive object={crowBody} />
      <primitive object={wingLMesh} ref={wingL} />
      <primitive object={wingRMesh} ref={wingR} />
    </group>
  );
}
