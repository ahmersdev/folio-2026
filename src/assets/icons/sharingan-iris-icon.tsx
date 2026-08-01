import { cn } from "@/lib/utils";

export default function SharinganIrisIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-4 text-primary", className)}
      {...props}
    >
      {/* Outer Eye Circle */}
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      {/* Center Pupil */}
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      {/* 3 Tomoe Nodes */}
      <circle cx="12" cy="6.5" r="1.2" fill="currentColor" />
      <circle cx="16.7" cy="14.7" r="1.2" fill="currentColor" />
      <circle cx="7.3" cy="14.7" r="1.2" fill="currentColor" />
    </svg>
  );
}
