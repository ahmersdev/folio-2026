import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLYPHS } from "../../eye-mesh.data";
import { createGlyphSpriteTexture } from "../../eye-mesh.utils";

export default function useGlyphSatellites() {
  const group = useRef<THREE.Group>(null);
  const radius = 1.4;
  const textures = useMemo(
    () => GLYPHS.map((g) => createGlyphSpriteTexture(g)),
    [],
  );

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.35;
  });

  return { group, textures, radius };
}
