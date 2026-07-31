import { GLYPHS } from "../../eye-mesh.data";
import useGlyphSatellites from "./use-glyph-satellites";

export default function GlyphSatellites() {
  const { group, textures, radius } = useGlyphSatellites();

  return (
    <group ref={group}>
      {GLYPHS.map((glyph, i) => {
        const angle = (i / GLYPHS.length) * Math.PI * 2;
        const texture = textures[i];
        if (!texture) return null;
        return (
          <sprite
            key={glyph}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            scale={[0.35, 0.35, 1]}
          >
            <spriteMaterial map={texture} transparent depthWrite={false} />
          </sprite>
        );
      })}
    </group>
  );
}
