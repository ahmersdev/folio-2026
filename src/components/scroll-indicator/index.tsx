import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SharinganIrisImg } from "@/assets/images";
import { IScrollIndicatorProps } from "./scroll-indicator.interface";

export default function ScrollIndicator(props: IScrollIndicatorProps) {
  const { targetId = "projects", className } = props;

  const handleScroll = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      onClick={handleScroll}
      type="button"
      aria-label="Scroll to inspect system"
      className={cn(
        "pointer-events-auto absolute top-[60%] left-1/2 z-20 -translate-x-1/2 sm:bottom-8",
        "group relative flex size-28 sm:size-32 items-center justify-center cursor-pointer select-none",
        "transition-transform duration-300 hover:scale-105",
        className,
      )}
    >
      {/* 1. Central Sharingan Core */}
      <div
        className={cn(
          "relative flex size-12 sm:size-14 items-center justify-center rounded-full overflow-hidden shrink-0 z-10",
          "bg-black shadow-lg",
          "transition-all duration-300 group-hover:shadow-[0_0_20px_var(--primary)]",
        )}
      >
        {/* Crisp Sharingan Image Container */}
        <div className="absolute inset-0 size-full transition-transform duration-700 ease-out group-hover:rotate-180">
          <Image
            src={SharinganIrisImg}
            alt="Sharingan Iris"
            fill
            unoptimized
            className={cn(
              "object-cover transition-all duration-300",
              "opacity-70 group-hover:opacity-100 group-hover:scale-110",
              "filter drop-shadow-[0_0_8px_rgba(194,36,54,0.4)]",
            )}
            priority
          />
        </div>

        {/* Overlay Dark Vignette for contrast */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/80 pointer-events-none" />

        {/* Bouncing Down Arrow */}
        <ChevronDown
          className={cn(
            "relative z-10 size-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-all duration-300",
            "animate-bounce motion-reduce:animate-none",
            "group-hover:scale-110 group-hover:text-primary",
          )}
          aria-hidden="true"
        />
      </div>

      {/* 2. Concentric Ring Divider */}
      <div className="absolute inset-5 sm:inset-6 rounded-full border border-border/70 transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-[0_0_12px_rgba(194,36,54,0.3)]" />

      {/* 3. Outer Rotating Circular Text */}
      <div className="absolute inset-0 size-full animate-[spin_12s_linear_infinite] motion-reduce:animate-none group-hover:animation-duration-[6s]">
        <svg viewBox="0 0 100 100" className="size-full">
          <path
            id="textPath"
            d="M 50, 50 m -43, 0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0"
            fill="none"
          />
          <text className="font-cinzel text-[7.5px] font-bold fill-muted-foreground tracking-[0.22em] uppercase transition-colors duration-300 group-hover:fill-foreground">
            <textPath href="#textPath" startOffset="0%">
              • SCROLL TO INSPECT • TSUKUYOMI SYSTEM
            </textPath>
          </text>
        </svg>
      </div>
    </button>
  );
}
