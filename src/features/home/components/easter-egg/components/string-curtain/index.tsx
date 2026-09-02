import Image from "next/image";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { EasterEggBgImg } from "@/assets/images";
import { IStringCurtainProps } from "./string-curtain.interface";
import useStringCurtain from "./use-string-curtain";

export default function StringCurtain({ reducedMotion }: IStringCurtainProps) {
  const { containerRef, canvasRef, muted, toggleMuted, theme, cycleTheme } =
    useStringCurtain(reducedMotion);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Its own toolbar row rather than overlaid on the artwork — the
          doorway (where the canvas actually sits) is positioned at
          runtime by use-string-curtain.ts's rebuild(), so anchoring these
          controls to it too would need the same runtime coordination for
          no real benefit. */}
      {!reducedMotion && (
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <button
              type="button"
              onClick={() => cycleTheme(-1)}
              aria-label="Previous chime theme"
              className="transition-colors hover:text-primary"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <span className="min-w-24 text-center text-[11px] tracking-[0.15em] uppercase">
              {theme.label}
            </span>
            <button
              type="button"
              onClick={() => cycleTheme(1)}
              aria-label="Next chime theme"
              className="transition-colors hover:text-primary"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={toggleMuted}
            aria-pressed={muted}
            aria-label={muted ? "Unmute string chimes" : "Mute string chimes"}
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            {muted ? (
              <VolumeX className="size-4" aria-hidden="true" />
            ) : (
              <Volume2 className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      )}

      <div ref={containerRef} className="relative w-full">
        <Image
          src={EasterEggBgImg}
          alt=""
          aria-hidden="true"
          // Normal responsive block — capped by the wrapper's max-w-6xl,
          // never scaled beyond or cropped. The curtain's canvas below is
          // sized/positioned in use-string-curtain.ts's rebuild() to fit
          // inside wherever the doorway lands in this rendered image.
          className="w-full h-auto"
        />
        <canvas
          ref={canvasRef}
          // Position (left/top) and size are set imperatively by
          // rebuild() every resize, to land exactly inside the doorway —
          // see the comment there for the math.
          style={{ position: "absolute" }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
