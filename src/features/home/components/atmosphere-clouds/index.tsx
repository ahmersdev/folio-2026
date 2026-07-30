"use client";
// Three.js/R3F mutates refs every frame by design; this is incompatible
// with the React Compiler's memoization assumptions, so this file opts out.
"use no memo";

import { Cloud, Clouds } from "@react-three/drei";
import useAtmosphereClouds from "./use-atmosphere-clouds";

export default function AtmosphereClouds() {
  const { group, clouds } = useAtmosphereClouds();

  return (
    <group ref={group}>
      <Clouds limit={200}>
        {clouds.map((cloud, i) => (
          <Cloud key={i} {...cloud} />
        ))}
      </Clouds>
    </group>
  );
}
