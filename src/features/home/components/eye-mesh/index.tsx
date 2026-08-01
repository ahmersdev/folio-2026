// Three.js/R3F mutates refs every frame by design; this is incompatible
// with the React Compiler's memoization assumptions, so this file opts out.
"use no memo";

import { Float } from "@react-three/drei";
import { IEyeProps } from "./eye-mesh.interface";
import { GlyphSatellites } from "./components";
import useEyeMesh from "./use-eye-mesh";

export default function EyeMesh(props: IEyeProps) {
  const { tilt, irisTexture } = useEyeMesh(props);

  return (
    <group ref={tilt}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.7}>
        <mesh>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshStandardMaterial
            color="#c22436"
            emissive="#c22436"
            emissiveIntensity={0.7}
            emissiveMap={irisTexture ?? undefined}
            roughness={0.3}
            metalness={0.3}
            flatShading
          />
        </mesh>
        <GlyphSatellites />
      </Float>
    </group>
  );
}
