import { useCallback, useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import * as SharinganFrameModules from "@/assets/images/sharingan-frames";
import { SEQUENCE_PHASE_END } from "../../sharingan-reveal.data";
import {
  BACKDROP_BLUR_PX,
  BACKDROP_OVERLAY_OPACITY,
  MIN_VISIBLE_WIDTH_FRACTION,
} from "./sharingan-sequence.data";

// The barrel exports 64 individually-named constants (SharinganFrame001…
// 064); none of those keys are numeric-only identifiers, so Object.values
// preserves the declaration order they were generated in — frames 1→64,
// no need to hand-write 64 import lines.
const FRAME_SOURCES = Object.values(SharinganFrameModules).map(
  (frame) => frame.src,
);
const FRAME_COUNT = FRAME_SOURCES.length;

function computeFrameIndex(progressValue: number) {
  const t = Math.min(1, Math.max(0, progressValue / SEQUENCE_PHASE_END));
  return Math.round(t * (FRAME_COUNT - 1));
}

// Full, uncapped "cover" fit of the same frame — always fills the entire
// canvas with no letterboxing (unlike drawForeground below), since on
// narrow/tall canvases it's the tighter width-crop that's allowed to go all
// the way. Blurred and darkened so it reads as a receded backdrop rather
// than competing with the sharp foreground layer drawn on top of it.
function drawBackground(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
) {
  const scale = Math.max(
    canvasWidth / image.naturalWidth,
    canvasHeight / image.naturalHeight,
  );
  const w = image.naturalWidth * scale;
  const h = image.naturalHeight * scale;

  ctx.save();
  ctx.filter = `blur(${BACKDROP_BLUR_PX}px)`;
  ctx.drawImage(image, (canvasWidth - w) / 2, (canvasHeight - h) / 2, w, h);
  ctx.restore();

  ctx.fillStyle = `rgba(0, 0, 0, ${BACKDROP_OVERLAY_OPACITY})`;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

// "Cover" fill (crops whichever axis has excess), but capped so a
// narrow/tall canvas can never crop the source's width down past
// MIN_VISIBLE_WIDTH_FRACTION — past that point it backs off from fully
// covering height, leaving letterbox space top/bottom that the blurred
// drawBackground layer beneath shows through, rather than zooming in
// tighter. Canvases wider than the source (which crop height, not width)
// are unaffected — the width floor's scale cap is always looser than what
// that case's cover-fit needs, so there's no letterbox space to fill in
// that case.
function drawForeground(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
) {
  const coverScale = Math.max(
    canvasWidth / image.naturalWidth,
    canvasHeight / image.naturalHeight,
  );
  const minWidthScale =
    canvasWidth / (image.naturalWidth * MIN_VISIBLE_WIDTH_FRACTION);
  const scale = Math.min(coverScale, minWidthScale);

  const w = image.naturalWidth * scale;
  const h = image.naturalHeight * scale;
  ctx.drawImage(image, (canvasWidth - w) / 2, (canvasHeight - h) / 2, w, h);
}

export default function useSharinganSequence(
  progress: MotionValue<number>,
  shouldPreload: boolean,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawnIndexRef = useRef(-1);

  const drawFrame = useCallback((index: number, force = false) => {
    const canvas = canvasRef.current;
    const image = imagesRef.current[index];
    if (!canvas || !image || !image.complete) return;
    if (!force && index === lastDrawnIndexRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    lastDrawnIndexRef.current = index;
    drawBackground(ctx, image, canvas.width, canvas.height);
    drawForeground(ctx, image, canvas.width, canvas.height);
  }, []);

  // Preload every frame once the section is near the viewport (see
  // shouldPreload in use-sharingan-reveal.ts) rather than on mount, so this
  // ~1MB image sequence doesn't compete with the hero's initial load.
  useEffect(() => {
    if (!shouldPreload || imagesRef.current.length > 0) return;

    imagesRef.current = FRAME_SOURCES.map((src, index) => {
      const image = new window.Image();
      image.src = src;
      image.onload = () => {
        if (index === computeFrameIndex(progress.get())) {
          drawFrame(index, true);
        }
      };
      return image;
    });
  }, [shouldPreload, progress, drawFrame]);

  // Keep the canvas's backing pixel size in sync with its rendered CSS
  // size — canvas needs an explicit width/height attribute, unlike a
  // normal element, or it stays at its default (blurry/stretched) backing
  // resolution.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      canvas.width = Math.round(width * window.devicePixelRatio);
      canvas.height = Math.round(height * window.devicePixelRatio);
      drawFrame(computeFrameIndex(progress.get()), true);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [progress, drawFrame]);

  useMotionValueEvent(progress, "change", (value) => {
    drawFrame(computeFrameIndex(value));
  });

  return { canvasRef };
}
