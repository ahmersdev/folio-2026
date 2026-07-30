import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createScrollingCodeTexture } from "./eye-mesh.utils";
import { IEyeProps } from "./eye-mesh.interface";

export default function useEyeMesh(props: IEyeProps) {
  const { pointer } = props;

  const tilt = useRef<THREE.Group>(null);
  const irisTexture = useMemo(() => createScrollingCodeTexture(), []);

  // R3F mutates refs and three.js objects every frame by design; the React
  // Compiler's static immutability analysis doesn't model this pattern.
  /* eslint-disable react-hooks/immutability */
  useFrame((_, delta) => {
    if (tilt.current) {
      tilt.current.rotation.x = THREE.MathUtils.damp(
        tilt.current.rotation.x,
        pointer.current.y * 0.35,
        4,
        delta,
      );
      tilt.current.rotation.y = THREE.MathUtils.damp(
        tilt.current.rotation.y,
        pointer.current.x * 0.45,
        4,
        delta,
      );
    }
    if (irisTexture) {
      irisTexture.offset.y -= delta * 0.12;
    }
  });
  /* eslint-enable react-hooks/immutability */

  return { tilt, irisTexture };
}
