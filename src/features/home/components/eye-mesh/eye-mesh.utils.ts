import * as THREE from "three";

const CODE_GLYPHS = ["01", "10", "{}", "<>", "/>", ";", "=>", "&&", "()", "[]"];

export function createScrollingCodeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px monospace";
  ctx.fillStyle = "rgba(255, 210, 210, 0.9)";
  ctx.textBaseline = "middle";

  const cell = 32;
  for (let y = 0; y < canvas.height; y += cell) {
    for (let x = 0; x < canvas.width; x += cell) {
      const glyph = CODE_GLYPHS[Math.floor(Math.random() * CODE_GLYPHS.length)];
      ctx.fillText(glyph, x + 2, y + cell / 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createGlyphSpriteTexture(glyph: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 56px monospace";
  ctx.fillStyle = "#ffb3b8";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(glyph, canvas.width / 2, canvas.height / 2 + 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
