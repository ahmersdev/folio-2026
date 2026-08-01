import * as THREE from "three";
import { TRange } from "./falling-feathers.interface";

export function randomInRange([min, max]: TRange) {
  return min + Math.random() * (max - min);
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Draws a feather silhouette (tapered quill + swept barbs) into a texture
// used as an alphaMap. Runtime-generated rather than a shipped PNG — same
// canvas-texture approach as createGlyphSpriteTexture in eye-mesh.utils.ts.
//
// THREE's alphaMap reads a texture's green channel, not the canvas's own
// alpha channel, so "opacity" below is encoded as a gray level (rgb(v,v,v))
// rather than via rgba() transparency.
export function createFeatherTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const cx = canvas.width / 2;
  const tipY = 8;
  const baseY = canvas.height - 8;

  const rows = 40;
  for (let i = 0; i < rows; i++) {
    const t = i / (rows - 1); // 0 at tip, 1 at base
    const y = tipY + t * (baseY - tipY);
    const reach = (canvas.width / 2 - 6) * Math.sin(t * Math.PI * 0.6 + 0.2);
    const sweep = 14 + t * 10;
    const strength = Math.round(200 * t + 30);

    for (const side of [-1, 1] as const) {
      const grad = ctx.createLinearGradient(
        cx,
        y,
        cx + side * reach,
        y - sweep,
      );
      grad.addColorStop(0, `rgb(${strength},${strength},${strength})`);
      grad.addColorStop(1, "rgb(0,0,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, y);
      ctx.quadraticCurveTo(
        cx + side * reach * 0.6,
        y - sweep * 0.5,
        cx + side * reach,
        y - sweep,
      );
      ctx.stroke();
    }
  }

  ctx.strokeStyle = "rgb(235,235,235)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, tipY);
  ctx.lineTo(cx, baseY);
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

// A lengthwise-subdivided plane, bent slightly along z so the blade isn't a
// perfectly flat card — it catches light differently as it tumbles. Bend
// peaks at the tip and stays flat at the base, reading as attached-then-
// curling rather than a taco fold.
export function createFeatherGeometry() {
  const geometry = new THREE.PlaneGeometry(0.09, 0.26, 1, 10);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i);
    const t = (y + 0.13) / 0.26;
    position.setZ(i, Math.pow(t, 2) * 0.03);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}
