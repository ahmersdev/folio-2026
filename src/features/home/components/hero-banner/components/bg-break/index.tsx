// Three.js/R3F mutates refs every frame by design; this is incompatible
// with the React Compiler's memoization assumptions, so this file opts out.
"use no memo";

import useBgBreak from "./use-bg-break";

export default function BgBreak() {
  const { scene } = useBgBreak();

  return (
    <primitive
      object={scene}
      position={[0, -4.3, 0]}
      scale={[1, 1.4, 1]}
      castShadow
      receiveShadow
    />
  );
}
