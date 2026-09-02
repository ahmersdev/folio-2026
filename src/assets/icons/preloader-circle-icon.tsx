import { cn } from "@/lib/utils";
import { SVGProps } from "react";

interface PreloaderCircleIconProps extends SVGProps<SVGSVGElement> {
  progress: number;
  radius?: number;
}

export default function PreloaderCircleIcon({
  progress,
  radius = 46,
  className,
  ...props
}: PreloaderCircleIconProps) {
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("size-full -rotate-90 overflow-visible", className)}
      {...props}
    >
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="var(--border)"
        strokeWidth="1.5"
        className="opacity-60"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress / 100)}
        className="drop-shadow-[0_0_6px_var(--primary)] transition-[stroke-dashoffset] duration-300 ease-out"
      />
    </svg>
  );
}
