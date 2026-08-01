// Three.js/R3F mutates refs every frame by design; this is incompatible
// with the React Compiler's memoization assumptions, so this file opts out.
"use no memo";

import { SCALE } from "./moon.data";
import useMoon from "./use-moon";

export default function Moon() {
  const { group, scene } = useMoon();

  return (
    <group ref={group} scale={SCALE}>
      <primitive object={scene} />
    </group>
  );
}
