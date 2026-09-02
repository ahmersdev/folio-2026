import { motion, useTransform } from "motion/react";
import { ISharinganSequenceProps } from "./sharingan-sequence.interface";
import { PRIMARY_TINT_OPACITY } from "./sharingan-sequence.data";
import useSharinganSequence from "./use-sharingan-sequence";

export default function SharinganSequence({
  progress,
  shouldPreload,
}: ISharinganSequenceProps) {
  const { canvasRef } = useSharinganSequence(progress, shouldPreload);
  // Red bloom ramps up as the sharingan ignites, screen-blended straight
  // over the footage rather than sitting behind it as a blurred box —
  // makes sense now the canvas is full-bleed with nothing visible around it.
  const glowOpacity = useTransform(progress, [0, 1], [0, 0.35]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full"
        aria-hidden="true"
      />
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute inset-0 mix-blend-screen bg-[radial-gradient(circle_at_50%_44%,var(--primary)_0%,transparent_46%)]"
        aria-hidden="true"
      />
      {/* Flat color tint over the footage — see PRIMARY_TINT_OPACITY in
          sharingan-sequence.data.ts to adjust. */}
      <div
        style={{ opacity: PRIMARY_TINT_OPACITY }}
        className="pointer-events-none absolute inset-0 bg-primary"
        aria-hidden="true"
      />
    </>
  );
}
