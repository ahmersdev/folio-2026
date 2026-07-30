interface CrowIconProps {
  className?: string;
}

export default function CrowIcon({ className }: CrowIconProps) {
  return (
    <svg
      viewBox="0 0 120 60"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        className="crow-wing crow-wing--left"
        style={{ transformOrigin: "60px 30px" }}
        d="M60 30 C 48 22, 30 14, 4 18 C 24 24, 34 28, 42 33 C 30 32, 16 34, 2 42 C 22 40, 38 38, 52 36 Z"
      />
      <path
        className="crow-wing crow-wing--right"
        style={{ transformOrigin: "60px 30px" }}
        d="M60 30 C 72 22, 90 14, 116 18 C 96 24, 86 28, 78 33 C 90 32, 104 34, 118 42 C 98 40, 82 38, 68 36 Z"
      />
      <path d="M60 26 C 56 24, 55 30, 60 33 C 65 30, 64 24, 60 26 Z" />
    </svg>
  );
}
